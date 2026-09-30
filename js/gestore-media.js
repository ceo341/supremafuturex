/**
 * SUPREMA FUTURE X - DYNAMIC MEDIA ENGINE CONTROLLER
 * File: /js/gestore-media.js
 * Descrizione: Gestore universale per Foto, Video, PDF, Slide e Documenti di Testo.
 *              Sincronizzato con l'intero ecosistema via BroadcastChannel.
 */

const GestoreMedia = (function () {
    'use strict';

    // Mappa degli elementi visivi presenti nell'ecosistema Suprema Future X
    const MAPPA_TARGET = {
        'logo': '#logo-sfx-main',
        'hero': '#media-hero-display',
        'governance': '#media-ceo-display',
        'chat': '#media-alison-display',
        'goldcard': '#media-goldcard-display',
        'accademia': '#contenuto-subpagina-dinamica',
        'vault': '#visore-blueprint',
        'social': '#media-social-display'
    };

    /**
     * Raccoglie i dati dal pannello X-Box, li converte (se necessario) e avvia il dispatch.
     */
    async function applicaConfigurazioneMedia() {
        const elSezione = document.getElementById('selettore-sezione-media');
        const elFormato = document.getElementById('tipo-media-switch');
        const elUrl = document.getElementById('url-risorsa-media');
        const elFileInput = document.getElementById('file-upload-logo');

        if (!elSezione || !elFormato) {
            console.error('[GestoreMedia]: Impossibile trovare i selettori DOM per l\'aggiornamento.');
            return;
        }

        const sezione = elSezione.value;
        const formato = elFormato.value;
        let urlRisorsa = elUrl ? elUrl.value.trim() : '';

        // Lettura e codifica del file locale (Foto, PDF, TXT)
        if (elFileInput && elFileInput.files && elFileInput.files.length > 0) {
            try {
                const file = elFileInput.files[0];
                urlRisorsa = await leggiFileLocale(file, formato);
            } catch (err) {
                alert('Errore durante la lettura del file: ' + err.message);
                return;
            }
        }

        if (!urlRisorsa) {
            alert("ATTENZIONE: Inserire un URL valido oppure selezionare un file dal computer locale.");
            return;
        }

        // Invio dei dati al backend Google Apps Script tramite ConnettoreApi (se disponibile)
        if (typeof ConnettoreApi !== 'undefined') {
            try {
                await ConnettoreApi.invia('AGGIORNA_CONFIGURAZIONE_MEDIA', {
                    sezione: sezione,
                    formato: formato,
                    url: urlRisorsa
                });
            } catch (e) {
                console.warn("[GestoreMedia]: Backup backend fallito, ma procedo con aggiornamento DOM.", e);
            }
        }

        // Aggiornamento visivo locale
        aggiornaElementoVisivo(sezione, formato, urlRisorsa);

        // Trasmissione aggiornamento a tutte le altre schede aperte
        try {
            if ('BroadcastChannel' in window) {
                const bc = new BroadcastChannel('sfx_canale_sincronizzazione_ecosistema');
                bc.postMessage({
                    evento: 'SYNC_MEDIA',
                    sezione: sezione,
                    formato: formato,
                    sorgente: urlRisorsa
                });
            }
        } catch (e) {
            console.warn('[GestoreMedia]: BroadcastChannel non disponibile per sync live.', e);
        }

        alert(`[ ECOSISTEMA AGGIORNATO CON SUCCESSO ]\n\nDestinazione Nodo: ${sezione.toUpperCase()}\nFormato Esecutivo: ${formato}\n\nStato: Sincronizzazione in tempo reale attivata.`);
        
        // Reset dei campi di input dopo il successo
        if (elUrl) elUrl.value = '';
        if (elFileInput) elFileInput.value = '';
    }

    /**
     * Converte un file caricato da PC nel formato Base64 o Testo Piano.
     */
    function leggiFileLocale(file, formato) {
        return new Promise((resolve, reject) => {
            // Limite di sicurezza (10 MB)
            if (file.size > 10 * 1024 * 1024) {
                reject(new Error("File troppo grande. Il limite massimo è 10 MB."));
                return;
            }

            const reader = new FileReader();
            
            if (formato === 'TESTO') {
                reader.readAsText(file);
            } else {
                reader.readAsDataURL(file);
            }
            
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error("Fallimento nella lettura binaria del file."));
        });
    }

    /**
     * Identifica l'elemento HTML target, ne distrugge la natura precedente 
     * e inietta il nuovo formato (Image, Video, Iframe, Text) mantenendo le classi CSS.
     */
    function aggiornaElementoVisivo(sezione, formato, sorgente) {
        const selettore = MAPPA_TARGET[sezione];
        if (!selettore) {
            console.warn(`[GestoreMedia]: Nessun target trovato per la sezione '${sezione}'`);
            return;
        }

        const elementoAttuale = document.querySelector(selettore);
        if (!elementoAttuale) {
            console.warn(`[GestoreMedia]: Elemento DOM non trovato nel documento per il selettore ${selettore}`);
            return;
        }

        const genitore = elementoAttuale.parentNode;
        let nuovoElemento;

        switch (formato.toUpperCase()) {
            case 'PDF':
            case 'SLIDE': {
                nuovoElemento = document.createElement('iframe');
                let urlEmbed = sorgente;
                
                // Conversione automatica link Google Docs in formato Embed per visualizzazione
                if (sorgente.includes('docs.google.com') && !sorgente.includes('embed')) {
                    urlEmbed = sorgente.replace(/\/edit.*$/, '/preview');
                }
                
                nuovoElemento.src = urlEmbed;
                nuovoElemento.style.width = '100%';
                nuovoElemento.style.height = '100%';
                nuovoElemento.style.minHeight = '400px';
                nuovoElemento.style.border = '1px solid #00F0FF';
                nuovoElemento.style.borderRadius = '8px';
                break;
            }
            
            case 'TESTO': {
                nuovoElemento = document.createElement('pre');
                nuovoElemento.textContent = sorgente;
                nuovoElemento.style.background = '#090A0D';
                nuovoElemento.style.color = '#00F0FF';
                nuovoElemento.style.fontFamily = 'Courier, monospace';
                nuovoElemento.style.fontSize = '12px';
                nuovoElemento.style.padding = '15px';
                nuovoElemento.style.borderRadius = '8px';
                nuovoElemento.style.maxHeight = '350px';
                nuovoElemento.style.overflowY = 'auto';
                nuovoElemento.style.whiteSpace = 'pre-wrap';
                nuovoElemento.style.border = '1px solid rgba(0, 240, 255, 0.3)';
                break;
            }
            
            case 'VIDEO': {
                nuovoElemento = document.createElement('video');
                nuovoElemento.src = sorgente;
                nuovoElemento.autoplay = true;
                nuovoElemento.loop = true;
                nuovoElemento.muted = true;
                nuovoElemento.playsInline = true;
                nuovoElemento.controls = false;
                nuovoElemento.setAttribute('playsinline', '');
                nuovoElemento.style.width = '100%';
                nuovoElemento.style.height = '100%';
                nuovoElemento.style.objectFit = 'cover';
                break;
            }
            
            case 'FOTO':
            default: {
                nuovoElemento = document.createElement('img');
                nuovoElemento.src = sorgente;
                nuovoElemento.alt = "Risorsa Multimediale Suprema";
                nuovoElemento.style.objectFit = 'cover';
                break;
            }
        }

        // Trasferimento ID e Classi originali per preservare la formattazione di Tailwind CSS
        nuovoElemento.className = elementoAttuale.className;
        nuovoElemento.id = elementoAttuale.id;

        // Iniezione nel DOM
        genitore.replaceChild(nuovoElemento, elementoAttuale);
    }

    // Ascolto automatico degli aggiornamenti broadcast da altre schede
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bgChannel = new BroadcastChannel('sfx_canale_sincronizzazione_ecosistema');
        bgChannel.onmessage = (event) => {
            if (event.data && event.data.evento === 'SYNC_MEDIA') {
                aggiornaElementoVisivo(event.data.sezione, event.data.formato, event.data.sorgente);
            }
        };
    }

    return {
        applicaMedia: applicaConfigurazioneMedia,
        aggiornaVisivo: aggiornaElementoVisivo
    };
})();

// Esposizione globale per i bottoni onclick nell'HTML della control room
if (typeof window !== 'undefined') {
    window.applicaModificaMedia = GestoreMedia.applicaMedia;
}
