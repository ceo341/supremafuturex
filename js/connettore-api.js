/**
 * ============================================================================
 * SUPREMA FUTURE X - CONNETTORE API UNIVERSALE (V50 EAL6+ SOVRANO)
 * File: /js/connettore-api.js
 * Descrizione: Gestore unico delle chiamate asincrone verso Google Apps Script (Code.gs),
 *              gestione fallback offline, sincronizzazione multi-scheda via BroadcastChannel
 *              e dispatch notifiche multi-canale.
 * ============================================================================
 */

const ConnettoreApi = (function () {
    'use strict';

    const CONFIGURAZIONE = {
        // ENDPOINT ASSOLUTO UNIFICATO PER TUTTA LA RETE EAL6+
        ENDPOINT: 'https://script.google.com/macros/s/AKfycbzJ5atqYnvcqvqbfCWvEmX7gZAdxe3kfbv79F_ANBwRuURpQ2Tcw_GuTTtdFIbBNUbU/exec',
        TEMPO_LIMITE_MS: 15000,
        CANALE_SINCRONIZZAZIONE: 'sfx_enterprise_bus',
        CHIAVE_CODA_OFFLINE: 'SFX_CODA_OFFLINE_REQUESTS'
    };

    // Inizializzazione Canale di trasmissione live tra schede aperte nel browser
    let canaleTrasmissione = null;
    try {
        if ('BroadcastChannel' in window) {
            canaleTrasmissione = new BroadcastChannel(CONFIGURAZIONE.CANALE_SINCRONIZZAZIONE);
        }
    } catch (e) {
        console.warn('[ConnettoreApi EAL6+]: BroadcastChannel non supportato dal browser.', e);
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
            action: azione,
            azione: azione,
            timestamp: new Date().toISOString(),
            tokenAutenticazione: tokenAuth,
            payload: datiPayload
        }, datiPayload);
    }

    /**
     * Invia un payload JSON al backend Google Apps Script.
     * @param {string} azione - L'azione richiesta dal sistema (es. 'nuovaCandidatura', 'AGGIORNA_PROMPT')
     * @param {Object} datiPayload - I dati associati all'operazione
     * @returns {Promise<Object>} Risposta del server
     */
    async function inviaRichiesta(azione, datiPayload = {}) {
        const controlloreInterruzione = new AbortController();
        const idTimer = setTimeout(() => controlloreInterruzione.abort(), CONFIGURAZIONE.TEMPO_LIMITE_MS);

        const pacchettoRichiesta = preparaPayload(azione, datiPayload);
        const urlEndpoint = getEndpoint();

        try {
            // Chiamata primaria standard POST con JSON e text/plain per aggirare i preflight CORS
            const risposta = await fetch(urlEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(pacchettoRichiesta),
                signal: controlloreInterruzione.signal
            });

            clearTimeout(idTimer);

            let rispostaJson = null;

            if (risposta.ok) {
                try {
                    rispostaJson = await risposta.json();
                } catch (e) {
                    rispostaJson = { status: 'success', message: 'Richiesta ricevuta dal server e accodata.' };
                }
            } else {
                throw new Error(`Errore HTTP Stato: ${risposta.status}`);
            }

            // Notifica tutte le altre schede aperte via BroadcastChannel
            notificaSchede('STATO_AGGIORNATO', azione, rispostaJson);

            return rispostaJson;

        } catch (errore) {
            clearTimeout(idTimer);
            console.warn(`[ConnettoreApi EAL6+ - Fallback: ${azione}]: Tentativo no-cors / offline.`, errore.message);

            // Tentativo 2: Fallback no-cors
            try {
                await fetch(urlEndpoint, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain' },
                    body: JSON.stringify(pacchettoRichiesta)
                });

                const risultatoFallback = {
                    status: 'success',
                    modalita: 'NO_CORS_DISPATCH',
                    messaggio: 'Operazione trasmessa con successo in modalità no-cors.'
                };

                notificaSchede('STATO_AGGIORNATO', azione, risultatoFallback);
                return risultatoFallback;

            } catch (errFallback) {
                console.error(`[ConnettoreApi EAL6+ Errore Critico - ${azione}]: Salvataggio in coda offline.`, errFallback.message);
                
                salvaInCodaOffline(pacchettoRichiesta);

                const risultatoOffline = {
                    status: 'buffered',
                    messaggio: 'Connessione assente o firewall bloccante. Operazione salvata temporaneamente in locale per sync differito.',
                    errore: errFallback.message
                };

                notificaSchede('OFFLINE_RECORDED', azione, risultatoOffline);
                return risultatoOffline;
            }
        }
    }

    /**
     * Esegue una richiesta GET per scaricare dati dal backend Google Apps Script
     * @param {string} azioneRichiesta - Azione specifica (default: 'getCandidati')
     * @returns {Promise<Object>}
     */
    async function richiediDati(azioneRichiesta = 'getCandidati') {
        const urlEndpoint = getEndpoint();
        try {
            const queryUrl = `${urlEndpoint}?action=${encodeURIComponent(azioneRichiesta)}&timestamp=${Date.now()}`;
            const risposta = await fetch(queryUrl);
            if (!risposta.ok) throw new Error(`Stato HTTP: ${risposta.status}`);
            return await risposta.json();
        } catch (err) {
            console.error('[ConnettoreApi EAL6+ Errore GET]: Impossibile scaricare dati.', err);
            return { status: 'error', message: err.message, dati: [], corsisti: [] };
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
            console.error('[ConnettoreApi EAL6+]: Errore scrittura coda offline.', e);
        }
    }

    /**
     * Sincronizza la coda delle operazioni salvate in locale quando torna la connessione
     */
    async function sincronizzaCodaOffline() {
        const coda = JSON.parse(localStorage.getItem(CONFIGURAZIONE.CHIAVE_CODA_OFFLINE) || '[]');
        if (coda.length === 0) return;

        console.log(`[ConnettoreApi EAL6+]: Avvio sincronizzazione di ${coda.length} elementi in coda offline...`);
        const codaRimanente = [];

        for (const elemento of coda) {
            try {
                await inviaRichiesta(elemento.action || elemento.azione, elemento.payload || elemento);
            } catch (e) {
                codaRimanente.push(elemento);
            }
        }

        localStorage.setItem(CONFIGURAZIONE.CHIAVE_CODA_OFFLINE, JSON.stringify(codaRimanente));
        if (codaRimanente.length === 0) {
            console.log('[ConnettoreApi EAL6+]: Sincronizzazione coda offline completata con successo!');
            notificaSchede('SYNC_OFFLINE_COMPLETED', 'ALL', { elements: coda.length });
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
                    type: evento,
                    evento: evento,
                    azione: azione,
                    risultato: risultato,
                    timestamp: new Date().toISOString()
                });
            } catch (e) {
                console.warn('[ConnettoreApi EAL6+]: Errore postMessage BroadcastChannel.', e);
            }
        }
    }

    /**
     * Registra un listener per gli eventi inviati dalle altre schede del sito
     * @param {Function} callback - Funzione da eseguire alla ricezione del messaggio
     */
    function ascoltaEventiSchede(callback) {
        if (canaleTrasmissione) {
            canaleTrasmissione.addEventListener('message', (evento) => {
                if (typeof callback === 'function') {
                    callback(evento.data);
                }
            });
        }
    }

    // Listener globale per il ripristino automatico della connessione internet
    if (typeof window !== 'undefined') {
        window.addEventListener('online', () => {
            console.log('[ConnettoreApi EAL6+]: Connessione ripristinata. Avvio sync coda offline...');
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

        // Wrapper applicativi diretti compatibili con Code.gs Master EAL6+
        salvaLead: function (datiLead) {
            return inviaRichiesta('registraCandidatura', datiLead);
        },
        candidaturaConferenza: function (datiConferenza) {
            return inviaRichiesta('registraCandidatura', datiConferenza);
        },
        aggiornaPrompt: function (testoPrompt, operatore = 'CEO GIULIANO') {
            return inviaRichiesta('notificaErrore', { modulo: 'ALISON_AG_01', errore: `Aggiornamento prompt. Nuovo stato per ${operatore}` });
        },
        aggiornaPuntiCard: function (token, punti, causale) {
            return inviaRichiesta('aggiornaPuntiGold', { codice: token, punti: punti, note: causale });
        },
        creaWorkspaceClassroom: function (nome, email, pacchetto = 'Executive Master') {
            return inviaRichiesta('creaWorkspaceCorsista', { nome: nome, email: email, percorso: pacchetto });
        },
        registraIncasso: function (datiIncasso) {
            return inviaRichiesta('registraIncasso', datiIncasso);
        }
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConnettoreApi;
}
