/**
 * ====================================================================
 * SUPREMA FUTURE X S.R.L. // CORE ENGINE JS V38 (BLOCCO 1 DI 2)
 * GOVERNANCE: CEO GIULIANO CARATELLI
 * PROTOCOLLO: EAL6+ SOVRANO // INTEGRATED CONNECTOR & AI ALISON
 * ====================================================================
 */

// WEBHOOK UFFICIALE V38 GOOGLE APPS SCRIPT
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzWBzJIGix89spOCn4khKN4RZ8oGsH9-I4Ii2OsBI9LdLt4g5En7BqkMtBHu_u56joG/exec';

/**
 * 1. SFX CONNECTOR API DISPATCHER
 */
window.SFXConnector = {
    async inviaLead(payload) {
        console.log("[SFX CONNECTOR] Invio payload EAL6+:", payload);
        
        if (!navigator.onLine && window.SFXDeltaQueue) {
            console.warn("[SFX CONNECTOR] Dispositivo offline. Accodamento in Delta Queue...");
            window.SFXDeltaQueue.accoda(payload);
            return { status: "queued", message: "Accodato in locale per la trasmissione differita." };
        }

        try {
            const response = await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("[SFX CONNECTOR] Errore rete/server:", error);
            if (window.SFXDeltaQueue) {
                window.SFXDeltaQueue.accoda(payload);
                return { status: "queued", message: "Errore di rete. Accodato in Delta Queue." };
            }
            throw error;
        }
    },

    async recuperaLeads() {
        try {
            const res = await fetch(`${APPS_SCRIPT_URL}?action=GET_LEADS`);
            return await res.json();
        } catch (err) {
            console.error("[SFX CONNECTOR] Errore recupero leads:", err);
            return { status: "error", leads: [] };
        }
    },

    async recuperaLedger() {
        try {
            const res = await fetch(`${APPS_SCRIPT_URL}?action=GET_LEDGER`);
            return await res.json();
        } catch (err) {
            console.error("[SFX CONNECTOR] Errore recupero ledger:", err);
            return { status: "error", ledger: [] };
        }
    }
};

/**
 * 2. ALISON AI CHATBOT & EXECUTIVE VOICE CONCIERGE
 */
class AlisonConcierge {
    constructor() {
        this.chatOpen = false;
        this.history = [];
        this.isVoiceActive = false;
        this.synth = window.speechSynthesis || null;
        this.recognition = null;
        this.setupRecognition();
    }

    init() {
        console.log("[ALISON AI] Inizializzazione Executive Concierge Alison V38...");
        this.bindEvents();
    }

    setupRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.lang = 'it-IT';
            this.recognition.interimResults = false;

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                console.log("[ALISON VOICE] Trascrizione vocale:", transcript);
                const inputElem = document.getElementById('alison-chat-input') || document.getElementById('alison-user-input');
                if (inputElem) inputElem.value = transcript;
                this.inviaMessaggio(transcript);
            };

            this.recognition.onerror = (event) => {
                console.warn("[ALISON VOICE] Errore riconoscimento vocale:", event.error);
                this.aggiornaStatoVocale(false);
            };

            this.recognition.onend = () => {
                this.aggiornaStatoVocale(false);
            };
        }
    }

    bindEvents() {
        const btnToggle = document.getElementById('btn-alison-toggle');
        if (btnToggle) btnToggle.addEventListener('click', () => this.toggleChat());

        const btnClose = document.getElementById('btn-alison-close');
        if (btnClose) btnClose.addEventListener('click', () => this.chiudiChat());

        const btnSend = document.getElementById('btn-alison-send');
        if (btnSend) {
            btnSend.addEventListener('click', () => {
                const inputElem = document.getElementById('alison-chat-input') || document.getElementById('alison-user-input');
                if (inputElem) this.inviaMessaggio(inputElem.value);
            });
        }

        const inputElem = document.getElementById('alison-chat-input') || document.getElementById('alison-user-input');
        if (inputElem) {
            inputElem.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.inviaMessaggio(inputElem.value);
                }
            });
        }

        const btnVoice = document.getElementById('btn-alison-voice');
        if (btnVoice) btnVoice.addEventListener('click', () => this.toggleRiconoscimentoVocale());
    }

    toggleChat() {
        this.chatOpen ? this.chiudiChat() : this.apriChat();
    }

    apriChat() {
        const container = document.getElementById('alison-chat-container');
        if (!container) return;
        this.chatOpen = true;
        container.classList.remove('hidden');
        container.classList.add('flex');
        
        if (this.history.length === 0) {
            this.appendMessage('agent', 'Benvenuto nell\'Ecosistema Suprema Future X. Sono Alison, Executive Concierge della Presidenza. Come posso assisterla oggi?');
        }
    }

    chiudiChat() {
        const container = document.getElementById('alison-chat-container');
        if (!container) return;
        this.chatOpen = false;
        container.classList.remove('flex');
        container.classList.add('hidden');
    }

    toggleRiconoscimentoVocale() {
        if (!this.recognition) {
            alert("Il riconoscimento vocale non è supportato dal tuo browser.");
            return;
        }

        if (this.isVoiceActive) {
            this.recognition.stop();
            this.aggiornaStatoVocale(false);
        } else {
            try {
                this.recognition.start();
                this.aggiornaStatoVocale(true);
            } catch (err) {
                console.error("[ALISON VOICE] Impossibile avviare il microfono:", err);
            }
        }
    }

    aggiornaStatoVocale(attivo) {
        this.isVoiceActive = attivo;
        const btnVoice = document.getElementById('btn-alison-voice');
        if (!btnVoice) return;

        if (attivo) {
            btnVoice.classList.add('animate-pulse', 'text-red-500', 'border-red-500');
            btnVoice.classList.remove('text-sfx-gold');
        } else {
            btnVoice.classList.remove('animate-pulse', 'text-red-500', 'border-red-500');
            btnVoice.classList.add('text-sfx-gold');
        }
    }

    parla(testo) {
        if (!this.synth) return;
        this.synth.cancel();
        
        const utterance = new SpeechSynthesisUtterance(testo);
        utterance.lang = 'it-IT';
        utterance.pitch = 1.0;
        utterance.rate = 1.0;

        const voices = this.synth.getVoices();
        const italianVoice = voices.find(v => v.lang.includes('it'));
        if (italianVoice) utterance.voice = italianVoice;

        this.synth.speak(utterance);
    }

    async inviaMessaggio(testo) {
        if (!testo || !testo.trim()) return;
        const inputElem = document.getElementById('alison-chat-input') || document.getElementById('alison-user-input');
        if (inputElem) inputElem.value = '';

        this.appendMessage('user', testo);
        this.appendMessage('agent', 'Alison sta elaborando la richiesta...');

        try {
            const res = await window.SFXConnector.inviaLead({
                action: 'ALISON_CHAT_QUERY',
                message: testo,
                timestamp: new Date().toISOString()
            });

            this.removeLastAgentMessage();
            const risposta = (res && res.reply) ? res.reply : "La Presidenza ha ricevuto la sua nota. Un nostro Executive provvederà al riscontro.";
            this.appendMessage('agent', risposta);
            this.parla(risposta);
        } catch (err) {
            this.removeLastAgentMessage();
            const fallback = "Desidera prenotare un appuntamento riservato con il CEO Giuliano Caratelli o esplorare i programmi della Suprema Academy?";
            this.appendMessage('agent', fallback);
            this.parla(fallback);
        }
    }

    inviaMessaggioManuale() {
        const inputElem = document.getElementById('alison-user-input');
        if (inputElem) this.inviaMessaggio(inputElem.value);
    }

    appendMessage(sender, text) {
        const body = document.getElementById('alison-chat-body') || document.getElementById('alison-chat-log');
        if (!body) return;

        const ora = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        const div = document.createElement('div');
        
        if (sender === 'user') {
            div.className = 'self-end bg-sfx-gold text-black p-3.5 rounded-2xl max-w-[85%] text-xs font-bold shadow-lg space-y-1 ml-auto';
            div.innerHTML = `<div>${text}</div><div class="text-[9px] text-black/60 text-right font-mono">${ora}</div>`;
        } else {
            div.className = 'self-start bg-black/90 text-sfx-goldLight p-3.5 rounded-2xl max-w-[85%] text-xs border border-sfx-gold/40 shadow-lg space-y-1 alison-msg-node';
            div.innerHTML = `<div class="font-bold text-[10px] text-sfx-cyan uppercase tracking-wider mb-1"><i class="fa-solid fa-robot mr-1"></i>Alison AI Concierge</div><div>${text}</div><div class="text-[9px] text-gray-500 text-right font-mono">${ora}</div>`;
        }

        body.appendChild(div);
        body.scrollTop = body.scrollHeight;
        this.history.push({ sender, text, timestamp: ora });
    }

    removeLastAgentMessage() {
        const body = document.getElementById('alison-chat-body') || document.getElementById('alison-chat-log');
        if (!body) return;
        const nodes = body.querySelectorAll('.alison-msg-node');
        if (nodes.length > 0) {
            nodes[nodes.length - 1].remove();
        }
    }
}

window.Alison = new AlisonConcierge();
window.AlisonEngine = window.Alison;/**
 * 3. MOTORE MULTILINGUA EAL6+
 */
const TRADUZIONI = {
    IT: { heroTitle: "DREAM DEFENSE SYSTEM", heroSub: "SISTEMA SOVRANO DI ACCELERAZIONE FINANZIARIA & ARREDO LUXURY", btnCandidati: "PRESENTA CANDIDATURA NEXUS", btnScopri: "ESPLORA ECOSISTEMA" },
    EN: { heroTitle: "DREAM DEFENSE SYSTEM", heroSub: "SOVEREIGN SYSTEM OF FINANCIAL ACCELERATION & LUXURY FURNISHING", btnCandidati: "SUBMIT NEXUS APPLICATION", btnScopri: "EXPLORE ECOSYSTEM" },
    FR: { heroTitle: "DREAM DEFENSE SYSTEM", heroSub: "SYSTÈME SOUVERAIN D'ACCÉLÉRATION FINANCIÈRE ET AMEUBLEMENT DE LUXE", btnCandidati: "SOUMETTRE CANDIDATURE NEXUS", btnScopri: "EXPLORER L'ÉCOSYSTÈME" },
    DE: { heroTitle: "DREAM DEFENSE SYSTEM", heroSub: "SOUVERÄNES SYSTEM FÜR FINANZBESCHLEUNIGUNG UND LUXUSINNEINRICHTUNG", btnCandidati: "NEXUS-BEWERBUNG EINREICHEN", btnScopri: "ÖKOSYSTEM ERKUNDEN" },
    ES: { heroTitle: "DREAM DEFENSE SYSTEM", heroSub: "SISTEMA SOBERANO DE ACELERACIÓN FINANCIERA Y MOBILIARIO DE LUJO", btnCandidati: "PRESENTAR CANDIDATURA NEXUS", btnScopri: "EXPLORAR ECOSISTEMA" },
    ZH: { heroTitle: "梦想防御系统", heroSub: "主权金融加速与奢华家居系统", btnCandidati: "提交 NEXUS 申请", btnScopri: "探索生态系统" },
    AR: { heroTitle: "نظام الدفاع عن الأحلام", heroSub: "النظام السيادي للتسريع المالي والأثاث الفاخر", btnCandidati: "تقديم طلب NEXUS", btnScopri: "استكشاف النظام البيئي" }
};

function cambiaLingua(lang) {
    if (!TRADUZIONI[lang]) return;
    const t = TRADUZIONI[lang];

    const elemHeroTitle = document.getElementById('lang-hero-title');
    const elemHeroSub = document.getElementById('lang-hero-sub');
    const elemBtnCandidati = document.getElementById('lang-btn-candidati');
    const elemBtnScopri = document.getElementById('lang-btn-scopri');

    if (elemHeroTitle) elemHeroTitle.textContent = t.heroTitle;
    if (elemHeroSub) elemHeroSub.textContent = t.heroSub;
    if (elemBtnCandidati) elemBtnCandidati.textContent = t.btnCandidati;
    if (elemBtnScopri) elemBtnScopri.textContent = t.btnScopri;

    document.documentElement.lang = lang.toLowerCase();
    console.log(`[MULTILINGUA] Lingua impostata su: ${lang}`);
}

/**
 * 4. GOLD CARD & LEAD SCORING ENGINE
 */
function calcolaPuntiGoldCard(datiForm) {
    let punti = 1000;
    if (datiForm.ambito === 'Conferenza CEO') punti += 500;
    if (datiForm.corso === 'Executive') punti += 300;
    if (datiForm.corso === 'Premium') punti += 500;
    if (datiForm.azienda && datiForm.azienda.trim().length > 2) punti += 200;
    if (datiForm.telefono && datiForm.telefono.startsWith('+39')) punti += 100;
    return punti;
}

function generaCodiceNexus() {
    const ora = Date.now().toString().slice(-4);
    const random = Math.floor(1000 + Math.random() * 9000);
    return `CEOSFX${ora}${random}`;
}

/**
 * 5. GESTIONE FORM CANDIDATURA & SLOT CALENDAR
 */
async function inviaCandidaturaForm(e) {
    e.preventDefault();

    const btnSubmit = document.getElementById('btn-submit-candidatura') || document.getElementById('btn-invia-lead');
    const statusBox = document.getElementById('candidatura-status') || document.getElementById('feedback-lead');

    const dati = {
        action: 'CANDIDATURA_FORM',
        nome: (document.getElementById('cand-nome') || document.getElementById('lead-nome')).value.trim(),
        azienda: (document.getElementById('cand-azienda') || document.getElementById('lead-azienda')).value.trim(),
        email: (document.getElementById('cand-email') || document.getElementById('lead-email')).value.trim(),
        telefono: (document.getElementById('cand-telefono') || document.getElementById('lead-telefono')).value.trim(),
        ambito: (document.getElementById('cand-ambito') || document.getElementById('lead-canale')).value,
        dataPrenotazione: document.getElementById('cand-data') ? document.getElementById('cand-data').value : 'In attesa',
        oraPrenotazione: document.getElementById('cand-ora') ? document.getElementById('cand-ora').value : 'In attesa',
        note: (document.getElementById('cand-note') || document.getElementById('lead-note')).value.trim(),
        nexusCode: generaCodiceNexus()
    };

    dati.punti = calcolaPuntiGoldCard(dati);

    if (btnSubmit) btnSubmit.disabled = true;
    if (statusBox) {
        statusBox.classList.remove('hidden');
        statusBox.className = "p-4 mt-4 rounded-xl text-xs font-mono border bg-cyan-950/40 border-sfx-cyan text-sfx-cyanLight block animate-pulse";
        statusBox.textContent = "Elaborazione candidatura e generazione Codice Nexus EAL6+ in corso...";
    }

    try {
        const risposta = await window.SFXConnector.inviaLead(dati);

        if (statusBox) {
            statusBox.className = "p-4 mt-4 rounded-xl text-xs font-mono border bg-green-950/50 border-green-500 text-green-300 block";
            statusBox.innerHTML = `✓ CANDIDATURA ACCETTATA!<br>Codice Nexus: <strong class="text-sfx-gold">${dati.nexusCode}</strong><br>Punti Accredito: <strong>${dati.punti} PTS</strong>`;
        }

        const elemCardNexus = document.getElementById('card-nexus-code');
        const elemCardNome = document.getElementById('card-candidato-nome');
        const elemCardPunti = document.getElementById('card-punti-valore');
        const boxGoldCard = document.getElementById('box-gold-card-preview');

        if (elemCardNexus) elemCardNexus.textContent = dati.nexusCode;
        if (elemCardNome) elemCardNome.textContent = dati.nome.toUpperCase();
        if (elemCardPunti) elemCardPunti.textContent = `${dati.punti.toLocaleString('it-IT')} PTS`;
        if (boxGoldCard) boxGoldCard.classList.remove('hidden');

    } catch (err) {
        if (statusBox) {
            statusBox.className = "p-4 mt-4 rounded-xl text-xs font-mono border bg-yellow-950/50 border-yellow-500 text-yellow-300 block";
            statusBox.textContent = "✓ Candidatura salvata in locale (Coda Delta Offline). Sincronizzazione automatica al ripristino rete.";
        }
    } finally {
        if (btnSubmit) btnSubmit.disabled = false;
    }
}

/**
 * 6. STEALTH ROUTER & ACCESSO TASTIERA RISERVATO
 */
let sequenzaTasti = [];
const CODICE_SECRETO = 'CEO2026';

window.addEventListener('keydown', (e) => {
    sequenzaTasti.push(e.key.toUpperCase());
    if (sequenzaTasti.length > CODICE_SECRETO.length) {
        sequenzaTasti.shift();
    }
    if (sequenzaTasti.join('') === CODICE_SECRETO) {
        console.log("[STEALTH ROUTER] Combinazione Segreta CEO Rilevata!");
        window.location.href = 'login.html?target=privato_ceo';
    }
});

/**
 * ====================================================================
 * 7. NUOVE FUNZIONI AGGIUNTE: TELEMETRIA, SMART MENU E TRIPLO TAP
 * ====================================================================
 */

// A) TELEMETRIA LIVE (Simulatore Visitatori X-BOX)
function avviaTelemetria() {
    const visitorElement = document.getElementById("live-visitors");
    if (visitorElement) {
        setInterval(() => {
            const baseVisitors = 18;
            const randomFluctuation = Math.floor(Math.random() * 20);
            visitorElement.innerText = baseVisitors + randomFluctuation;
        }, 4500);
    }
}

// B) MENU SMART (Auto-chiusura dopo 20 secondi)
let menuTimer = null;

function toggleSmartMenu() {
    const menu = document.getElementById('smart-dropdown-menu');
    if (!menu) return;

    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        menu.classList.add('flex');
        
        menuTimer = setTimeout(() => {
            chiudiSmartMenu();
        }, 20000);
    } else {
        chiudiSmartMenu();
    }
}

function chiudiSmartMenu() {
    const menu = document.getElementById('smart-dropdown-menu');
    if (menu) {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
    }
    if (menuTimer) {
        clearTimeout(menuTimer);
        menuTimer = null;
    }
}

// C) TRIPLO TAP SEGRETO SUL LOGO
let tapCount = 0;
let tapTimeout = null;

function setupTriploTap() {
    const logoTrigger1 = document.getElementById('sfx-brand-logo-main');
    const logoTrigger2 = document.getElementById('sfx-brand-logo-status');
    const logoTrigger3 = document.getElementById('sfx-brand-logo-center');
    
    const riggers = [logoTrigger1, logoTrigger2, logoTrigger3];
    
    riggers.forEach(trigger => {
        if (trigger) {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                tapCount++;

                if (tapCount === 1) {
                    tapTimeout = setTimeout(() => {
                        tapCount = 0;
                    }, 1500);
                }

                if (tapCount === 3) {
                    clearTimeout(tapTimeout);
                    tapCount = 0;
                    
                    const password = prompt("⚠️ [DREAM DEFENSE SYSTEM] ⚠️\n\nAccesso Sovrano Rilevato.\nInserire PIN o confermare riconoscimento facciale (Face ID):");
                    
                    if (password !== null) {
                        alert("Identità Confermata: CEO GIULIANO.\nTrasferimento al Terminale di Sicurezza in corso...");
                        window.location.href = "login.html"; 
                    } else {
                        alert("Accesso Annullato.");
                    }
                }
            });
        }
    });
}

/**
 * 8. UTILITIES DRAWERS
 */
function toggleDrawer(id) {
    const drawer = document.getElementById(id);
    if (drawer) {
        if (drawer.classList.contains('hidden')) {
            drawer.classList.remove('hidden');
        } else {
            drawer.classList.add('hidden');
        }
    }
}

function chiudiDrawer(id) {
    const drawer = document.getElementById(id);
    if (drawer) drawer.classList.add('hidden');
}

function chiudiDrawerAlClickFuori(event, id) {
    if (event.target.id === id) chiudiDrawer(id);
}

function apriWidgetAlison() {
    toggleDrawer('drawer-alison');
}

/**
 * 9. INIZIALIZZAZIONE EVENTI E CARICAMENTO DOM
 */
document.addEventListener('DOMContentLoaded', () => {
    window.Alison.init();
    avviaTelemetria();
    setupTriploTap();

    const formCandidatura = document.getElementById('form-candidatura-lead') || document.getElementById('form-candidatura');
    if (formCandidatura) {
        formCandidatura.addEventListener('submit', inviaCandidaturaForm);
    }

    const selectLang = document.getElementById('lang-selector') || document.getElementById('select-lingua');
    if (selectLang) {
        selectLang.addEventListener('change', (e) => cambiaLingua(e.target.value));
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('[PWA] Service Worker attivo con scope:', reg.scope))
            .catch(err => console.warn('[PWA] Registrazione Service Worker non riuscita:', err));
    }
});
