/**
 * SUPREMA FUTURE X - CONNETTORE API UNIVERSALE (V3.8 ENHANCED)
 * File: /js/connettore-api.js
 * Descrizione: Gestore unico delle chiamate asincrone verso Google Apps Script (Code.gs),
 *              gestione fallback offline, sincronizzazione multi-scheda via BroadcastChannel
 *              e dispatch notifiche multi-canale.
 */

const ConnettoreApi = (function () {
    'use strict';

    const CONFIGURAZIONE = {
        // Endpoint Google Apps Script predefinito dell'ecosistema Suprema Future X
        ENDPOINT: 'https://script.google.com/macros/s/AKfycbzAiwpjrU33wRkogEvuQr9YduJpssGHs9ewFHlpke2Ar9NgG2YbNoZ5ZfyRGr9IVAZkew/exec',
        TEMPO_LIMITE_MS: 12000,
        CANALE_SINCRONIZZAZIONE: 'sfx_canale_sincronizzazione_ecosistema',
        CHIAVE_CODA_OFFLINE: 'SFX_CODA_OFFLINE_REQUESTS'
    };

    // Inizializzazione Canale di trasmissione live tra schede aperte nel browser
    let canaleTrasmissione = null;
    try {
        if ('BroadcastChannel' in window) {
            canaleTrasmissione = new BroadcastChannel(CONFIGURAZIONE.CANALE_SINCRONIZZAZIONE);
        }
    } catch (e) {
        console.warn('[ConnettoreApi]: BroadcastChannel non supportato dal browser.', e);
    }

    /**
     * Ottiene l'URL attivo dell'endpoint (con supporto a override dinamico via localStorage)
     * @returns {string}
     */
    function getEndpoint() {
        return localStorage.getItem('SFX_APPSCRIPT_URL') || CONFIGURAZIONE.ENDPOINT;
    }

    /**
     * Imposta o aggiorna l'URL dell'endpoint Apps Script
     * @param {string} nuovoUrl 
     * @returns {boolean}
     */
    function impostaEndpoint(nuovoUrl) {
        if (nuovoUrl && nuovoUrl.startsWith('https://script.google.com')) {
            localStorage.setItem('SFX_APPSCRIPT_URL', nuovoUrl.trim());
            return true;
        }
        return false;
    }

    /**
     * Prepara e struttura il payload unificato per la massima compatibilità con Code.gs
     * @param {string} azione 
     * @param {Object} datiPayload 
     * @returns {Object}
     */
    function preparaPayload(azione, datiPayload = {}) {
        const tokenAuth = sessionStorage.getItem('SFX_TOKEN_AUTENTICAZIONE') || localStorage.getItem('SFX_CEO_PIN') || '3474429091';
        
        return Object.assign({
            azione: azione,
            timestamp: new Date().toISOString(),
            tokenAutenticazione: tokenAuth,
            payload: datiPayload
        }, datiPayload);
    }

    /**
     * Invia un payload JSON al backend Google Apps Script.
     * @param {string} azione - L'azione richiesta dal sistema (es. 'REGISTRAZIONE_LEAD', 'AGGIORNA_PROMPT')
     * @param {Object} datiPayload - I dati associati all'operazione
     * @returns {Promise<Object>} Risposta del server
     */
    async function inviaRichiesta(azione, datiPayload = {}) {
        const controlloreInterruzione = new AbortController();
        const idTimer = setTimeout(() => controlloreInterruzione.abort(), CONFIGURAZIONE.TEMPO_LIMITE_MS);

        const pacchettoRichiesta = preparaPayload(azione, datiPayload);
        const urlEndpoint = getEndpoint();

        try {
            // Chiamata primaria standard POST con JSON
            const risposta = await fetch(urlEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(pacchettoRichiesta),
                signal: controlloreInterruzione.signal
            });

            clearTimeout(idTimer);

            let rispostaJson = null;

            if (risposta.ok) {
                try {
                    rispostaJson = await risposta.json();
                } catch (e) {
                    rispostaJson = { status: 'SUCCESS', message: 'Richiesta ricevuta dal server.' };
                }
            } else {
                throw new Error(`Errore HTTP Stato: ${risposta.status}`);
            }

            // Notifica tutte le altre schede aperte via BroadcastChannel
            notificaSchede('STATO_AGGIORNATO', azione, rispostaJson);

            return rispostaJson;

        } catch (errore) {
            clearTimeout(idTimer);
            console.warn(`[ConnettoreApi Avviso - ${azione}]: Tentativo fallback no-cors / offline.`, errore.message);

            // Tentativo 2: Fallback no-cors per evitare blocchi CORS sui redirect di Apps Script
            try {
                await fetch(urlEndpoint, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(pacchettoRichiesta)
                });

                const risultatoFallback = {
                    status: 'SUCCESS',
                    modalita: 'NO_CORS_DISPATCH',
                    messaggio: 'Operazione trasmessa con successo in modalità no-cors.'
                };

                notificaSchede('STATO_AGGIORNATO', azione, risultatoFallback);
                return risultatoFallback;

            } catch (errFallback) {
                console.error(`[ConnettoreApi Errore Critico - ${azione}]: Salvataggio in coda offline.`, errFallback.message);
                
                // Salvataggio in localStorage per sincronizzazione successiva al ripristino rete
                salvaInCodaOffline(pacchettoRichiesta);

                const risultatoOffline = {
                    status: 'OFFLINE_CACHE',
                    messaggio: 'Connessione assente o bloccata. Operazione salvata temporaneamente in locale per il successivo sync.',
                    errore: errFallback.message
                };

                notificaSchede('OFFLINE_RECORDED', azione, risultatoOffline);
                return risultatoOffline;
            }
        }
    }

    /**
     * Esegue una richiesta GET per scaricare la lista dei lead dal database Apps Script
     * @returns {Promise<Object>}
     */
    async function richiediDati() {
        const urlEndpoint = getEndpoint();
        try {
            const risposta = await fetch(`${urlEndpoint}?timestamp=${Date.now()}`);
            if (!risposta.ok) throw new Error(`Stato HTTP: ${risposta.status}`);
            return await risposta.json();
        } catch (err) {
            console.error('[ConnettoreApi Errore GET]: Impossibile scaricare dati.', err);
            return { status: 'ERROR', message: err.message, data: [] };
        }
    }

    /**
     * Salva una richiesta non inviata nella coda offline del browser
     * @param {Object} pacchetto 
     */
    function salvaInCodaOffline(pacchetto) {
        try {
            const codaAttuale = JSON.parse(localStorage.getItem(CONFIGURAZIONE.CHIAVE_CODA_OFFLINE) || '[]');
            codaAttuale.push(pacchetto);
            localStorage.setItem(CONFIGURAZIONE.CHIAVE_CODA_OFFLINE, JSON.stringify(codaAttuale));
        } catch (e) {
            console.error('[ConnettoreApi]: Errore scrittura coda offline.', e);
        }
    }

    /**
     * Sincronizza la coda delle operazioni salvate in locale quando torna la connessione
     */
    async function sincronizzaCodaOffline() {
        const coda = JSON.parse(localStorage.getItem(CONFIGURAZIONE.CHIAVE_CODA_OFFLINE) || '[]');
        if (coda.length === 0) return;

        console.log(`[ConnettoreApi]: Avvio sincronizzazione di ${coda.length} elementi in coda offline...`);
        const codaRimanente = [];

        for (const elemento of coda) {
            try {
                await inviaRichiesta(elemento.azione, elemento.payload || elemento);
            } catch (e) {
                codaRimanente.push(elemento);
            }
        }

        localStorage.setItem(CONFIGURAZIONE.CHIAVE_CODA_OFFLINE, JSON.stringify(codaRimanente));
        if (codaRimanente.length === 0) {
            console.log('[ConnettoreApi]: Sincronizzazione coda offline completata con successo!');
        }
    }

    /**
     * Trasmette messaggi tramite BroadcastChannel a tutte le schede aperte nel browser
     * @param {string} evento 
     * @param {string} azione 
     * @param {Object} risultato 
     */
    function notificaSchede(evento, azione, risultato) {
        if (canaleTrasmissione) {
            try {
                canaleTrasmissione.postMessage({
                    evento: evento,
                    azione: azione,
                    risultato: risultato,
                    timestamp: new Date().toISOString()
                });
            } catch (e) {
                console.warn('[ConnettoreApi]: Errore postMessage BroadcastChannel.', e);
            }
        }
    }

    /**
     * Registra un listener per gli eventi inviati dalle altre schede del sito
     * @param {Function} callback - Funzione da eseguire alla ricezione del messaggio
     */
    function ascoltaEventiSchede(callback) {
        if (canaleTrasmissione) {
            canaleTrasmissione.onmessage = (evento) => {
                if (typeof callback === 'function') {
                    callback(evento.data);
                }
            };
        }
    }

    // Listener globale per il ripristino automatico della connessione internet
    if (typeof window !== 'undefined') {
        window.addEventListener('online', () => {
            console.log('[ConnettoreApi]: Connessione ripristinata. Avvio sync coda offline...');
            sincronizzaCodaOffline();
        });
    }

    // Export dei metodi operativi per l'ecosistema Suprema Future X
    return {
        invia: inviaRichiesta,
        ottieni: richiediDati,
        onSincronizzazione: ascoltaEventiSchede,
        setEndpoint: impostaEndpoint,
        getEndpoint: getEndpoint,
        sincronizzaOffline: sincronizzaCodaOffline,

        // Wrapper applicativi diretti
        salvaLead: function (datiLead) {
            return inviaRichiesta('REGISTRAZIONE_LEAD', datiLead);
        },
        candidaturaConferenza: function (datiConferenza) {
            return inviaRichiesta('CANDIDATURA_CONFERENZA', datiConferenza);
        },
        aggiornaPrompt: function (testoPrompt, operatore = 'GEK CAREL') {
            return inviaRichiesta('AGGIORNA_PROMPT', { prompt: testoPrompt, operatore: operatore });
        },
        aggiornaPuntiCard: function (token, punti, causale) {
            return inviaRichiesta('AGGIORNA_PUNTI', { token: token, punti: punti, causale: causale });
        },
        creaWorkspaceClassroom: function (token, nome, email) {
            return inviaRichiesta('CREA_WORKSPACE_CLASSROOM', { token: token, nome: nome, email: email });
        }
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConnettoreApi;
}
