/**
 * ====================================================================
 * SUPREMA FUTURE X S.R.L. // DELTA QUEUE OFFLINE ENGINE V35
 * GOVERNANCE: CEO GIULIANO CARATELLI
 * PROTOCOLLO: EAL6+ SOVRANO // OFFLINE STORAGE & AUTO-SYNC
 * ====================================================================
 */

(function (window) {
    'use strict';

    const QUEUE_STORAGE_KEY = 'sfx_delta_queue_v35';
    const APPS_SCRIPT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzegxbf4ZpkJkrb4NVJsTlYmfles9jW9VTw0hv8JWRdF6251ag3SKBGVq-eR1rfvwBQ3g/exec';

    const SFXDeltaQueue = {
        /**
         * Recupera la coda dei messaggi memorizzata in locale
         */
        getCoda() {
            try {
                const data = localStorage.getItem(QUEUE_STORAGE_KEY);
                return data ? JSON.parse(data) : [];
            } catch (e) {
                console.error("[DELTA QUEUE] Errore lettura localStorage:", e);
                return [];
            }
        },

        /**
         * Salva la coda aggiornata nel localStorage
         */
        salvaCoda(coda) {
            try {
                localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(coda));
            } catch (e) {
                console.error("[DELTA QUEUE] Errore scrittura localStorage:", e);
            }
        },

        /**
         * Accoda un elemento per la trasmissione differita
         */
        accoda(payload) {
            const coda = this.getCoda();
            const elemento = {
                id: 'DELTA_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
                timestamp: new Date().toISOString(),
                payload: payload,
                tentativi: 0
            };

            coda.push(elemento);
            this.salvaCoda(coda);
            console.log(`[DELTA QUEUE] Elemento accodato [${elemento.id}]. Totale in coda: ${coda.length}`);
            
            this.aggiornaBadgeStato();
            
            if (navigator.onLine) {
                this.sincronizza();
            }
        },

        /**
         * Esegue la sincronizzazione differita degli elementi accodati
         */
        async sincronizza() {
            if (!navigator.onLine) {
                console.warn("[DELTA QUEUE] Impossibile sincronizzare: dispositivo Offline.");
                return;
            }

            const coda = this.getCoda();
            if (coda.length === 0) return;

            console.log(`[DELTA QUEUE] Avvio sincronizzazione di ${coda.length} elementi...`);
            const codaRimanente = [];

            for (const item of coda) {
                try {
                    item.tentativi++;
                    const response = await fetch(APPS_SCRIPT_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                        body: JSON.stringify(item.payload)
                    });

                    const resData = await response.json();

                    if (resData && (resData.status === 'success' || resData.status === 'ok')) {
                        console.log(`[DELTA QUEUE] Elemento [${item.id}] trasmesso con successo!`);
                    } else {
                        console.warn(`[DELTA QUEUE] Risposta non conforme per [${item.id}], riaccodamento.`);
                        codaRimanente.push(item);
                    }
                } catch (err) {
                    console.warn(`[DELTA QUEUE] Errore trasmissione [${item.id}]:`, err);
                    if (item.tentativi < 10) {
                        codaRimanente.push(item);
                    } else {
                        console.error(`[DELTA QUEUE] Elemento [${item.id}] scartato dopo 10 tentativi falliti.`);
                    }
                }
            }

            this.salvaCoda(codaRimanente);
            this.aggiornaBadgeStato();
        },

        /**
         * Aggiorna l'indicatore di stato della rete e della coda nell'interfaccia UI
         */
        aggiornaBadgeStato() {
            const badge = document.getElementById('delta-queue-status-badge');
            const coda = this.getCoda();

            if (!badge) return;

            if (!navigator.onLine) {
                badge.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-950 text-yellow-400 border border-yellow-700 animate-pulse";
                badge.innerHTML = `<i class="fa-solid fa-wifi-slash mr-1"></i>OFFLINE (${coda.length} in coda)`;
            } else if (coda.length > 0) {
                badge.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-sfx-cyan/20 text-sfx-cyanLight border border-sfx-cyan/40 animate-pulse";
                badge.innerHTML = `<i class="fa-solid fa-arrows-rotate fa-spin mr-1"></i>SYNCING (${coda.length})`;
            } else {
                badge.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-950 text-green-400 border border-green-800";
                badge.innerHTML = `<i class="fa-solid fa-circle text-[8px] mr-1"></i>EAL6+ ONLINE`;
            }
        }
    };

    // Esportazione oggetto globale
    window.SFXDeltaQueue = SFXDeltaQueue;

    // Event Listener Connettività Rete
    window.addEventListener('online', () => {
        console.log("[DELTA QUEUE] Connessione ripristinata. Avvio auto-sync...");
        SFXDeltaQueue.aggiornaBadgeStato();
        SFXDeltaQueue.sincronizza();
    });

    window.addEventListener('offline', () => {
        console.warn("[DELTA QUEUE] Connessione interrotta. Modalità Coda Offline attiva.");
        SFXDeltaQueue.aggiornaBadgeStato();
    });

    // Inizializzazione al caricamento del DOM
    document.addEventListener('DOMContentLoaded', () => {
        SFXDeltaQueue.aggiornaBadgeStato();
        if (navigator.onLine) {
            SFXDeltaQueue.sincronizza();
        }

        // Controllo periodico coda ogni 20 secondi
        setInterval(() => {
            if (navigator.onLine && SFXDeltaQueue.getCoda().length > 0) {
                SFXDeltaQueue.sincronizza();
            }
        }, 20000);
    });

})(window);
