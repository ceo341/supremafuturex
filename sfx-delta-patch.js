/**
 * ====================================================================
 * SUPREMA FUTURE X S.R.L. // OFFLINE DELTA QUEUE & SYNC ENGINE V35
 * GOVERNANCE: CEO GIULIANO CARATELLI
 * PROTOCOLLO: EAL6+ SOVRANO
 * ====================================================================
 */

const APPS_SCRIPT_WEBHOOK = 'https://script.google.com/macros/s/AKfycbzegxbf4ZpkJkrb4NVJsTlYmfles9jW9VTw0hv8JWRdF6251ag3SKBGVq-eR1rfvwBQ3g/exec';

window.SFXDeltaQueue = {
    STORAGE_KEY: 'sfx_offline_queue_v35',
    isSyncing: false,

    /**
     * Accoda una richiesta quando la rete non è disponibile
     */
    accoda(payload) {
        const coda = this.recuperaCoda();
        const elementoCoda = {
            id: 'DELTA_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
            timestamp: new Date().toISOString(),
            payload: payload
        };

        coda.push(elementoCoda);
        this.salvaCoda(coda);
        
        console.log(`[DELTA QUEUE] Payload accodato offline. ID: ${elementoCoda.id} | Totale in coda: ${coda.length}`);
        
        // Notifica visiva nell'interfaccia se disponibile
        if (typeof window.mostraNotificaBadge === 'function') {
            window.mostraNotificaBadge(`Dati salvati in locale (${coda.length} in coda offline)`);
        }
    },

    /**
     * Recupera la coda dal LocalStorage
     */
    recuperaCoda() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data) return [];
        try { 
            return JSON.parse(data); 
        } catch (e) { 
            console.error("[DELTA QUEUE] Errore lettura LocalStorage:", e);
            return []; 
        }
    },

    /**
     * Salva la coda aggiornata nel LocalStorage
     */
    salvaCoda(coda) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(coda));
        } catch (e) {
            console.error("[DELTA QUEUE] Errore salvataggio LocalStorage:", e);
        }
    },

    /**
     * Svuota completamente la coda
     */
    svuotaCoda() {
        localStorage.removeItem(this.STORAGE_KEY);
        console.log("[DELTA QUEUE] Coda locale completamente azzerata.");
    },

    /**
     * Sincronizza automaticamente tutti gli elementi della coda con il server
     */
    async sincronizza() {
        if (!navigator.onLine || this.isSyncing) return;

        const coda = this.recuperaCoda();
        if (coda.length === 0) return;

        this.isSyncing = true;
        console.log(`[DELTA QUEUE] Avvio sincronizzazione automatica per ${coda.length} elementi in coda...`);

        const elementiFalliti = [];

        for (const item of coda) {
            try {
                const response = await fetch(APPS_SCRIPT_WEBHOOK, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(item.payload)
                });

                if (response.ok) {
                    console.log(`[DELTA QUEUE] ✓ Sincronizzato elemento ID: ${item.id}`);
                } else {
                    console.warn(`[DELTA QUEUE] ✗ Errore server per elemento ID: ${item.id}`);
                    elementiFalliti.push(item);
                }
            } catch (err) {
                console.warn(`[DELTA QUEUE] ✗ Connessione interrotta durante invio ID: ${item.id}`, err);
                elementiFalliti.push(item);
            }
        }

        if (elementiFalliti.length === 0) {
            this.svuotaCoda();
            console.log("[DELTA QUEUE] ✓ Sincronizzazione Delta completata al 100%. Tutti i dati inviati.");
        } else {
            this.salvaCoda(elementiFalliti);
            console.warn(`[DELTA QUEUE] Sincronizzazione parziale. Elementi ancora in coda: ${elementiFalliti.length}`);
        }

        this.isSyncing = false;
    }
};

// Listener per ripristino automatico della connessione internet
window.addEventListener('online', () => {
    console.log("[NETWORK STATUS] Connessione ripristinata. Avvio immediato sincronizzazione Delta Queue...");
    setTimeout(() => {
        window.SFXDeltaQueue.sincronizza();
    }, 1500);
});

// Listener caricamento pagina
window.addEventListener('load', () => {
    if (navigator.onLine) {
        window.SFXDeltaQueue.sincronizza();
    }
});
