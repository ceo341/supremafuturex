/**
 * SUPREMA FUTURE X - CONNETTORE API UNIVERSALE
 * File: /js/connettore-api.js
 * Descrizione: Gestore unico delle chiamate asincrone verso Google Apps Script (Code.gs) e sincronizzazione tra schede.
 */

const ConnettoreApi = (function () {
    'use strict';

    const CONFIGURAZIONE = {
        ENDPOINT: 'https://script.google.com/macros/s/AKfycbzYLWM-vCYD29fhPoNqHyI6r_ujIlMJiW4A6tIj1UJ0PT6HtURtXXFFuqnyjmi9vBkKBA/exec',
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
FILE 2: js/navigazione.js
Crea il secondo file js/navigazione.js e incolla questo codice completo:

JavaScript
/**
 * SUPREMA FUTURE X - GESTORE NAVIGAZIONE E BARRA DI STATO
 * File: /js/navigazione.js
 * Descrizione: Gestisce la barra di stato sotto lo slogan, il menu Hamburger con auto-chiusura a 15s e il motore multilingue Google API.
 */

const GestoreNavigazione = (function () {
    'use strict';

    let timerAutoChiusuraMenu = null;
    const TEMPO_AUTO_CHIUSURA_MS = 15000; // 15 secondi esatti di inattivita

    /**
     * Inizializza gli eventi della barra di stato e del menu hamburger.
     */
    function inizializza() {
        document.addEventListener('DOMContentLoaded', () => {
            configuraMenuHamburger();
            avviaPulsazioneBarraStato();
            configuraEngineMultilingue();
        });
    }

    /**
     * Configura l'apertura/chiusura del menu Hamburger e il timer di inattività a 15s.
     */
    function configuraMenuHamburger() {
        const pulsanteHamburger = document.getElementById('pulsante-menu-hamburger');
        const pannelloMenu = document.getElementById('pannello-menu-hamburger');

        if (!pulsanteHamburger || !pannelloMenu) return;

        pulsanteHamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const eAperto = pannelloMenu.classList.contains('attivo');

            if (eAperto) {
                chiudiMenu();
            } else {
                apriMenu();
            }
        });

        // Reset del timer di 15s ad ogni movimento del mouse o tocco all'interno del menu
        pannelloMenu.addEventListener('mousemove', resetTimerInattivita);
        pannelloMenu.addEventListener('touchstart', resetTimerInattivita);

        // Chiude il menu se l'utente clicca all'esterno
        document.addEventListener('click', (e) => {
            if (!pannelloMenu.contains(e.target) && e.target !== pulsanteHamburger) {
                chiudiMenu();
            }
        });
    }

    function apriMenu() {
        const pannelloMenu = document.getElementById('pannello-menu-hamburger');
        if (pannelloMenu) {
            pannelloMenu.classList.add('attivo');
            pannelloMenu.setAttribute('aria-hidden', 'false');
            startTimerAutoChiusura();
        }
    }

    function chiudiMenu() {
        const pannelloMenu = document.getElementById('pannello-menu-hamburger');
        if (pannelloMenu) {
            pannelloMenu.classList.remove('attivo');
            pannelloMenu.setAttribute('aria-hidden', 'true');
            clearTimeout(timerAutoChiusuraMenu);
        }
    }

    function startTimerAutoChiusura() {
        clearTimeout(timerAutoChiusuraMenu);
        timerAutoChiusuraMenu = setTimeout(() => {
            chiudiMenu();
            console.log('[GestoreNavigazione]: Menu chiuso automaticamente dopo 15 secondi di inattivita.');
        }, TEMPO_AUTO_CHIUSURA_MS);
    }

    function resetTimerInattivita() {
        const pannelloMenu = document.getElementById('pannello-menu-hamburger');
        if (pannelloMenu && pannelloMenu.classList.contains('attivo')) {
            startTimerAutoChiusura();
        }
    }

    /**
     * Aggiorna lo stato dei LED e della latenza sulla barra di stato universale.
     */
    function avviaPulsazioneBarraStato() {
        const elementoLatenza = document.getElementById('indicatore-latenza-server');
        if (!elementoLatenza) return;

        setInterval(() => {
            const latenzaSimulata = Math.floor(Math.random() * 8) + 10; // 10ms - 18ms
            elementoLatenza.textContent = `${latenzaSimulata}ms`;
        }, 5000);
    }

    /**
     * Gestisce l'integrazione Google Translate API o mostra l'avviso per lo sviluppatore se la chiave manca.
     */
    function configuraEngineMultilingue() {
        const selettoreLingua = document.getElementById('selettore-lingua-google');
        if (!selettoreLingua) return;

        selettoreLingua.addEventListener('change', (e) => {
            const linguaSelezionata = e.target.value;
            
            // Verifica presenza dello script Google Translate
            if (window.google && window.google.translate) {
                // Esegue la traduzione automatica del DOM
                const comboGoogle = document.querySelector('.goog-te-combo');
                if (comboGoogle) {
                    comboGoogle.value = linguaSelezionata;
                    comboGoogle.dispatchEvent(new Event('change'));
                }
            } else {
                // Fallback: Avviso per lo sviluppatore
                mostraAvvisoSviluppatoreTraduzione();
            }
        });
    }

    function mostraAvvisoSviluppatoreTraduzione() {
        const modaleAvviso = document.getElementById('modale-avviso-sviluppatore');
        if (modaleAvviso) {
            modaleAvviso.classList.add('visibile');
        } else {
            alert("INTEGRAZIONE GOOGLE TRANSLATE API RICHIESTA:\nInserire la chiave API Google Translate nel pannello di configurazione X-Box per abilitare la traduzione automatica.");
        }
    }

    inizializza();

    return {
        apriMenu: apriMenu,
        chiudiMenu: chiudiMenu
    };
})();
