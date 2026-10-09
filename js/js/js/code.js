/**
 * ====================================================================
 * SUPREMA FUTURE X S.R.L. // UNIFIED JAVASCRIPT MASTER CONNECTOR V35
 * GOVERNANCE: CEO GIULIANO CARATELLI
 * ====================================================================
 */

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzegxbf4ZpkJkrb4NVJsTlYmfles9jW9VTw0hv8JWRdF6251ag3SKBGVq-eR1rfvwBQ3g/exec';

/**
 * 1. SFX CONNECTOR (API WEBHOOK & NETWORK MANAGER)
 */
window.SFXConnector = {
    async inviaLead(payload) {
        try {
            if (!navigator.onLine && window.SFXDeltaQueue) {
                window.SFXDeltaQueue.accoda(payload);
                return { status: "queued", message: "Inviato in coda offline" };
            }

            const response = await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.warn("Connessione fallita, inserimento in coda offline:", error);
            if (window.SFXDeltaQueue) {
                window.SFXDeltaQueue.accoda(payload);
            }
            return { status: "queued_error", error: error.toString() };
        }
    },

    async recuperaLeads() {
        try {
            const response = await fetch(APPS_SCRIPT_URL + '?action=GET_LEADS');
            const data = await response.json();
            return data.leads || [];
        } catch (error) {
            console.error("Errore recupero leads dal server:", error);
            return [];
        }
    }
};

/**
 * 2. ALISON V3 NEURAL ENGINE (CHATBOT & SINTESI VOCALE)
 */
window.AlisonEngine = {
    sintesi: window.speechSynthesis || null,

    parla(testo) {
        if (!this.sintesi) return;
        
        // Cancella eventuali riproduzioni precedenti
        this.sintesi.cancel();

        const utterance = new SpeechSynthesisUtterance(testo);
        utterance.lang = 'it-IT';
        utterance.pitch = 1.05;
        utterance.rate = 0.95;

        // Cerca una voce italiana femminile
        const voci = this.sintesi.getVoices();
        const voceIT = voci.find(v => v.lang.includes('it') && (v.name.includes('Alice') || v.name.includes('Elsa') || v.name.includes('Federica') || v.name.includes('Female')));
        if (voceIT) utterance.voice = voceIT;

        this.sintesi.speak(utterance);
    },

    gestisciScelta(scelta) {
        const box = document.getElementById('box-chat-centrale');
        if (!box) return;

        let risposta = "";
        let audioText = "";

        if (typeof scelta === 'string' && (scelta.includes('1. SI') || scelta.includes('2. SI'))) {
            risposta = "Ti sto reindirizzando immediatamente alla scheda di candidatura per riservare il tuo posto in conferenza con il CEO Giuliano.";
            audioText = "Ti sto trasferendo alla scheda di candidatura riservata con il CEO Giuliano.";
            this.parla(audioText);
            setTimeout(() => { window.location.href = 'candidatura.html'; }, 1500);
            return;
        } else if (typeof scelta === 'string' && scelta.includes('3. NO')) {
            risposta = "Perfetto. Di quale ambito specifico dell'Ecosistema desideri informazioni? Posso illustrarti Suprema Academy, la Boutique Luxury o la Linea Antigravity.";
            audioText = "Di quale ambito desideri maggiori informazioni?";
        } else if (scelta === 4 || (typeof scelta === 'string' && scelta.includes('4.'))) {
            risposta = "Comprendo le tue riflessioni. Un incontro strategico con la Presidenza chiarisce ogni dubbio ed esamina le opportunità per la tua crescita.";
            audioText = "Un incontro diretto con il CEO toglie ogni dubbio. Posso collegarti su WhatsApp.";
        } else {
            risposta = "Richiesta ricevuta. Un Executive Concierge del Board esaminerà il tuo messaggio entro poche ore.";
            audioText = "Richiesta ricevuta. La Direzione ti ricontatterà a breve.";
        }

        this.parla(audioText);
        box.innerHTML += `<div class="bg-white p-4 rounded-2xl border border-gray-200 max-w-xl shadow-sm text-gray-800 space-y-2 mt-3 font-mono text-xs">
            <strong class="text-sfx-cyan">Alison:</strong> ${risposta}
        </div>`;
        box.scrollTop = box.scrollHeight;
    }
};/**
 * 3. GOLD CARD ENGINE (SIMULATORE & RENDERING CANVAS)
 */
window.GoldCardEngine = {
    genera(nomeInput) {
        const nome = (nomeInput || "GIORGIO MOSSI").toUpperCase();
        const renderNome = document.getElementById('render-nome');
        const renderId = document.getElementById('render-id');
        const renderPts = document.getElementById('render-pts');

        if (renderNome) renderNome.textContent = nome;

        // Generazione Codice Progressivo Casuale per simulatore
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const code = "CEOSFX" + randomNum;
        if (renderId) renderId.textContent = code;

        if (renderPts) renderPts.textContent = "1,500 PTS";

        alert("✓ Card Virtuata Generata per: " + nome + "\nCodice ID Assegnato: " + code);
    }
};

/**
 * 4. SFX MEDIA (FULLSCREEN & CONTROLLI BROADCAST)
 */
window.SFXMedia = {
    toggleFullscreen(elementId) {
        const el = document.getElementById(elementId);
        if (!el) return;

        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if (el.requestFullscreen) {
                el.requestFullscreen();
            } else if (el.webkitRequestFullscreen) {
                el.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }
};

// Inizializzazione automatica voci sintesi vocale al caricamento
if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.onvoiceschanged = () => {
        if (window.AlisonEngine && window.AlisonEngine.sintesi) {
            window.AlisonEngine.sintesi.getVoices();
        }
    };
}
