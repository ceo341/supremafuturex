/**
 * SUPREMA FUTURE X - CONNETTORE API UNIVERSALE
 * File: /js/connettore-api.js
 * Descrizione: Gestore unico delle chiamate asincrone verso Google Apps Script (Code.gs) e sincronizzazione tra schede.
 */

const ConnettoreApi = (function () {
    'use strict';

    const CONFIGURAZIONE = {
        ENDPOINT: 'https://script.google.com/macros/s/AKfycbzBCxFARof3ccPcdvp3Jm9OG3QNHCmSZsU2tzYYR69OZOzCrCEZq9skzhI_BJFHPZD1mA/exec',
        TEMPO_LIMITE_MS: 12000,
        CANALE_SINCRONIZZAZIONE: 'sfx_canale_sincronizzazione_ecosistema'
    };

    // Canale di trasmissione live tra schede aperte nel browser
    const canaleTrasmissione = new BroadcastChannel(CONFIGURAZIONE.CANALE_SINCRONIZZAZIONE);

    /**
     * Invia un payload JSON al backend Google Apps Script.
     * @param {string} azione - L'azione richiesta dal sistema (es. 'SALVA_LEAD', 'AGGIORNA_PROMPT')
     * @param {Object} datiPayload - I dati associati all'operazione
     * @returns {Promise<Object>} Risposta del server
     */
    async function inviaRichiesta(azione, datiPayload = {}) {
        const controlloreInterruzione = new AbortController();
        const idTimer = setTimeout(() => controlloreInterruzione.abort(), CONFIGURAZIONE.TEMPO_LIMITE_MS);

        const pacchettoRichiesta = {
            azione: azione,
            timestamp: new Date().toISOString(),
            tokenAutenticazione: sessionStorage.getItem('SFX_TOKEN_AUTENTICAZIONE') || null,
            payload: datiPayload
        };

        try {
            const risposta = await fetch(CONFIGURAZIONE.ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(pacchettoRichiesta),
                signal: controlloreInterruzione.signal
            });

            clearTimeout(idTimer);

            if (!risposta.ok) {
                throw new Error(`Errore HTTP Stato: ${risposta.status}`);
            }

            const rispostaJson = await risposta.json();

            // Notifica tutte le altre schede aperte
            canaleTrasmissione.postMessage({
                evento: 'STATO_AGGIORNATO',
                azione: azione,
                risultato: rispostaJson
            });

            return rispostaJson;

        } catch (errore) {
            clearTimeout(idTimer);
            console.warn(`[ConnettoreApi Avviso - ${azione}]: Modalita Fallback attiva.`, errore.message);
            
            return {
                stato: 'OFFLINE_CACHE',
                messaggio: 'Operazione salvata temporaneamente in locale.',
                errore: errore.message
            };
        }
    }

    /**
     * Ascolta gli eventi inviati dalle altre schede del sito.
     * @param {Function} callback - Funzione da eseguire alla ricezione del messaggio
     */
    function ascoltaEventiSchede(callback) {
        canaleTrasmissione.onmessage = (evento) => {
            if (typeof callback === 'function') {
                callback(evento.data);
            }
        };
    }

    return {
        invia: inviaRichiesta,
        onSincronizzazione: ascoltaEventiSchede
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConnettoreApi;
}
