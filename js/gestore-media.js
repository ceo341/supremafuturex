/**
 * SUPREMA FUTURE X - DYNAMIC MEDIA ENGINE CONTROLLER
 * File: /js/gestore-media.js
 * Descrizione: Gestore per Foto, Video, PDF, Slide e Documenti di Testo (INCLUSA GOLD CARD)
 */

const GestoreMedia = (function () {
    'use strict';

    // Mappa degli elementi visivi presenti nel sito web (AGGIUNTO GOLDCARD)
    const MAPPA_TARGET = {
        'logo': '#logo-sfx-main',
        'hero': '#media-hero-display',
        'governance': '#media-ceo-display',
        'chat': '#media-alison-display',
        'goldcard': '#media-goldcard-display',
        'accademia': '#contenuto-subpagina-dinamica',
        'vault': '#visore-blueprint'
    };

    /**
     * Raccoglie i dati dal form Admin, li invia al backend e aggiorna lo schermo.
     */
    async function applicaConfigurazioneMedia() {
        const elSezione = document.getElementById('selettore-sezione-media');
        const elFormato = document.getElementById('tipo-media-switch');
        const elUrl = document.getElementById('url-risorsa-media');
        const elFileInput = document.getElementById('file-upload-logo');

        if (!elSezione || !elFormato) return;

        const sezione = elSezione.value;
        const formato = elFormato.value;
        let urlRisorsa = elUrl ? elUrl.value.trim() : '';

        // Lettura file locale (Foto, PDF, TXT)
        if (elFileInput && elFileInput.files && elFileInput.files[0]) {
            const file = elFileInput.files[0];
            urlRisorsa = await leggiFileLocale(file, formato);
        }

        if (!urlRisorsa) {
            alert("Inserire un URL valido oppure selezionare un file dal computer.");
            return;
        }

        // Invio dei dati al backend Google Apps Script tramite ConnettoreApi
        if (typeof ConnettoreApi !== 'undefined') {
            await ConnettoreApi.invia('AGGIORNA_CONFIGURAZIONE_MEDIA', {
                sezione: sezione,
                formato: formato,
                url: urlRisorsa
            });
        }

        // Aggiornamento visivo immediato a schermo
        aggiornaElementoVisivo(sezione, formato, urlRisorsa);

        alert(`CONTENUTO AGGIORNATO!\n\nDestinazione: ${sezione.toUpperCase()}\nFormato: ${formato}\nStato: Sincronizzato con l'Ecosistema.`);
    }

    /**
     * Converte un file caricato da PC nel formato corretto.
     */
    function leggiFileLocale(file, formato) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            if (formato === 'TESTO') {
                reader.readAsText(file);
            } else {
                reader.readAsDataURL(file);
            }
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    /**
     * Sostituisce l'elemento visivo nella pagina con il tag HTML corretto.
     */
    function aggiornaElementoVisivo(sezione, formato, sorgente) {
        const selettore = MAPPA_TARGET[sezione];
        if (!selettore) return;

        const elementoAttuale = document.querySelector(selettore);
        if (!elementoAttuale) return;

        const genitore = elementoAttuale.parentNode;
        let nuovoElemento;

        switch (formato.toUpperCase()) {
            case 'PDF':
            case 'SLIDE': {
                nuovoElemento = document.createElement('iframe');
                let urlEmbed = sorgente;
                if (sorgente.includes('docs.google.com') && !sorgente.includes('embed')) {
                    urlEmbed = sorgente.replace(/\/edit.*$/, '/embed');
                }
                nuovoElemento.src = urlEmbed;
                nuovoElemento.style.width = '100%';
                nuovoElemento.style.height = '450px';
                nuovoElemento.style.border = '1px solid var(--oro-imperiale)';
                nuovoElemento.style.borderRadius = '8px';
                break;
            }
            case 'TESTO': {
                nuovoElemento = document.createElement('pre');
                nuovoElemento.textContent = sorgente;
                nuovoElemento.style.background = '#0b0c0f';
                nuovoElemento.style.color = 'var(--ciano-neon)';
                nuovoElemento.style.fontFamily = 'var(--font-mono)';
                nuovoElemento.style.padding = '15px';
                nuovoElemento.style.borderRadius = '8px';
                nuovoElemento.style.maxHeight = '300px';
                nuovoElemento.style.overflowY = 'auto';
                nuovoElemento.style.whiteSpace = 'pre-wrap';
                break;
            }
            case 'VIDEO': {
                nuovoElemento = document.createElement('video');
                nuovoElemento.src = sorgente;
                nuovoElemento.autoplay = true;
                nuovoElemento.loop = true;
                nuovoElemento.muted = true;
                nuovoElemento.playsInline = true;
                nuovoElemento.setAttribute('playsinline', '');
                break;
            }
            case 'FOTO':
            default: {
                nuovoElemento = document.createElement('img');
                nuovoElemento.src = sorgente;
                nuovoElemento.alt = "Risorsa Multimediale Suprema";
                break;
            }
        }

        // Mantiene ID e classi originali per non rompere la grafica 3D
        nuovoElemento.className = elementoAttuale.className;
        nuovoElemento.id = elementoAttuale.id;

        genitore.replaceChild(nuovoElemento, elementoAttuale);
    }

    return {
        applicaMedia: applicaConfigurazioneMedia,
        aggiornaVisivo: aggiornaElementoVisivo
    };
})();

// Esportazione per il pulsante del pannello Admin
window.applicaModificaMedia = GestoreMedia.applicaMedia;
