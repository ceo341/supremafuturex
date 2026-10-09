/**
 * ====================================================================
 * SUPREMA FUTURE X S.R.L. // CORE ENGINE JS V35 (INTEGRALE)
 * GOVERNANCE: CEO GIULIANO CARATELLI
 * PROTOCOLLO: EAL6+ SOVRANO // INTEGRATED CONNECTOR & AI ALISON
 * ====================================================================
 */

// URL WEB APP GOOGLE APPS SCRIPT UFFICIALE E CONFIGURATO
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxnaL-1tkUz5DtwvBjDHN77TABy-WDCEdAY1ijTJHJXiackawN55ryX2kNc8So8t3MvSw/exec';

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
        console.log("[ALISON AI] Inizializzazione Executive Concierge Alison V35...");
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
                const inputElem = document.getElementById('alison-chat-input');
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
        if (btnToggle) {
            btnToggle.addEventListener('click', () => this.toggleChat());
        }

        const btnClose = document.getElementById('btn-alison-close');
        if (btnClose) {
            btnClose.addEventListener('click', () => this.chiudiChat());
        }

        const btnSend = document.getElementById('btn-alison-send');
        if (btnSend) {
            btnSend.addEventListener('click', () => {
                const inputElem = document.getElementById('alison-chat-input');
                if (inputElem) this.inviaMessaggio(inputElem.value);
            });
        }

        const inputElem = document.getElementById('alison-chat-input');
        if (inputElem) {
            inputElem.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.inviaMessaggio(inputElem.value);
                }
            });
        }

        const btnVoice = document.getElementById('btn-alison-voice');
        if (btnVoice) {
            btnVoice.addEventListener('click', () => this.toggleRiconoscimentoVocale());
        }
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
        const inputElem = document.getElementById('alison-chat-input');
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

    appendMessage(sender, text) {
        const body = document.getElementById('alison-chat-body');
        if (!body) return;

        const ora = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        const div = document.createElement('div');
        
        if (sender === 'user') {
            div.className = 'self-end bg-sfx-gold text-black p-3.5 rounded-2xl max-w-[85%] text-xs font-bold shadow-lg space-y-1';
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
        const body = document.getElementById('alison-chat-body');
        if (!body) return;
        const nodes = body.querySelectorAll('.alison-msg-node');
        if (nodes.length > 0) {
            nodes[nodes.length - 1].remove();
        }
    }
}

window.Alison = new AlisonConcierge();

/**
 * 3. MOTORE MULTILINGUA EAL6+ (IT, EN, FR, DE, ES, ZH, AR)
 */
const TRADUZIONI = {
    IT: {
        heroTitle: "DREAM DEFENSE SYSTEM",
        heroSub: "SISTEMA SOVRANO DI ACCELERAZIONE FINANZIARIA & ARREDO LUXURY",
        btnCandidati: "PRESENTA CANDIDATURA NEXUS",
        btnScopri: "ESPLORA ECOSISTEMA"
    },
    EN: {
        heroTitle: "DREAM DEFENSE SYSTEM",
        heroSub: "SOVEREIGN SYSTEM OF FINANCIAL ACCELERATION & LUXURY FURNISHING",
        btnCandidati: "SUBMIT NEXUS APPLICATION",
        btnScopri: "EXPLORE ECOSYSTEM"
    },
    FR: {
        heroTitle: "DREAM DEFENSE SYSTEM",
        heroSub: "SYSTÈME SOUVERAIN D'ACCÉLÉRATION FINANCIÈRE ET AMEUBLEMENT DE LUXE",
        btnCandidati: "SOUMETTRE CANDIDATURE NEXUS",
        btnScopri: "EXPLORER L'ÉCOSYSTÈME"
    },
    DE: {
        heroTitle: "DREAM DEFENSE SYSTEM",
        heroSub: "SOUVERÄNES SYSTEM FÜR FINANZBESCHLEUNIGUNG UND LUXUSINNEINRICHTUNG",
        btnCandidati: "NEXUS-BEWERBUNG EINREICHEN",
        btnScopri: "ÖKOSYSTEM ERKUNDEN"
    },
    ES: {
        heroTitle: "DREAM DEFENSE SYSTEM",
        heroSub: "SISTEMA SOBERANO DE ACELERACIÓN FINANCIERA Y MOBILIARIO DE LUJO",
        btnCandidati: "PRESENTAR CANDIDATURA NEXUS",
        btnScopri: "EXPLORAR ECOSISTEMA"
    },
    ZH: {
        heroTitle: "梦想防御系统",
        heroSub: "主权金融加速与奢华家居系统",
        btnCandidati: "提交 NEXUS 申请",
        btnScopri: "探索生态系统"
    },
    AR: {
        heroTitle: "نظام الدفاع عن الأحلام",
        heroSub: "النظام السيادي للتسريع المالي والأثاث الفاخر",
        btnCandidati: "تقديم طلب NEXUS",
        btnScopri: "استكشاف النظام البيئي"
    }
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

    const btnSubmit = document.getElementById('btn-submit-candidatura');
    const statusBox = document.getElementById('candidatura-status');

    const dati = {
        action: 'CANDIDATURA_FORM',
        nome: document.getElementById('cand-nome').value.trim(),
        azienda: document.getElementById('cand-azienda').value.trim(),
        email: document.getElementById('cand-email').value.trim(),
        telefono: document.getElementById('cand-telefono').value.trim(),
        ambito: document.getElementById('cand-ambito').value,
        dataPrenotazione: document.getElementById('cand-data').value,
        oraPrenotazione: document.getElementById('cand-ora').value,
        note: document.getElementById('cand-note').value.trim(),
        nexusCode: generaCodiceNexus()
    };

    dati.punti = calcolaPuntiGoldCard(dati);

    if (btnSubmit) btnSubmit.disabled = true;
    if (statusBox) {
        statusBox.className = "text-sfx-cyanLight font-bold text-center animate-pulse";
        statusBox.textContent = "Elaborazione candidatura e generazione Codice Nexus EAL6+ in corso...";
    }

    try {
        const risposta = await window.SFXConnector.inviaLead(dati);

        if (statusBox) {
            statusBox.className = "text-green-400 font-bold text-center";
            statusBox.innerHTML = `✓ CANDIDATURA ACCETTATA!<br>Codice Nexus: <strong class="text-sfx-gold">${dati.nexusCode}</strong><br>Punti Accredito: <strong>${dati.punti} PTS</strong>`;
        }

        // Mostra la Gold Card generata
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
            statusBox.className = "text-yellow-400 font-bold text-center";
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
 * 7. INIZIALIZZAZIONE EVENTI E CARICAMENTO DOM
 */
document.addEventListener('DOMContentLoaded', () => {
    window.Alison.init();

    const formCandidatura = document.getElementById('form-candidatura');
    if (formCandidatura) {
        formCandidatura.addEventListener('submit', inviaCandidaturaForm);
    }

    const selectLang = document.getElementById('select-lingua');
    if (selectLang) {
        selectLang.addEventListener('change', (e) => cambiaLingua(e.target.value));
    }

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('[PWA] Service Worker attivo con scope:', reg.scope))
            .catch(err => console.warn('[PWA] Registrazione Service Worker non riuscita:', err));
    }
});/**
 * ====================================================================
 * SUPREMA FUTURE X S.R.L. // GOOGLE APPS SCRIPT MASTER ENGINE V35
 * GOVERNANCE: CEO GIULIANO CARATELLI
 * PROTOCOLLO: EAL6+ SOVRANO // INTEGRATED BACKEND ENGINE
 * ====================================================================
 */

const CONFIG = {
    CEO_EMAIL: 'ceo@supremaofficial.com',
    COMPANY_NAME: 'Suprema Future X S.r.l.',
    TELEGRAM_BOT_TOKEN: '', // Opzionale: inserire token BotFather se attivo
    TELEGRAM_CHAT_ID: '',   // Opzionale: inserire chat ID personale se attivo
    WHATSAPP_CEO_NUMBER: '+393474429091',
    SHEET_LEADS: 'Leads_Candidature',
    SHEET_LEDGER: 'Mastro_Finanziario',
    SHEET_PROMPTS: 'Prompt_Neurali'
};

/**
 * 1. DISPATCHER POST INTERCETTAZIONE RICHIESTE ENTRANTI
 */
function doPost(e) {
    try {
        let payload = {};
        if (e && e.postData && e.postData.contents) {
            payload = JSON.parse(e.postData.contents);
        }

        const action = payload.action || 'CANDIDATURA_FORM';
        let result = {};

        switch (action) {
            case 'CANDIDATURA_FORM':
                result = gestisciCandidaturaForm(payload);
                break;
            case 'ALISON_CHAT_QUERY':
                result = gestisciAlisonQuery(payload);
                break;
            case 'LEDGER_ENTRY':
                result = gestisciLedgerEntry(payload);
                break;
            case 'AGGIORNA_PROMPT_NEURALE':
                result = gestisciPromptNeurale(payload);
                break;
            case 'SECURITY_ALARM_ABUSE':
                result = gestisciSecurityAlarm(payload);
                break;
            default:
                result = { status: 'error', message: 'Azione non riconosciuta dal Server EAL6+.' };
        }

        return ContentService
            .createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        return ContentService
            .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * 2. DISPATCHER GET PER RECUPERO DATI TABELLARI (CRM & MASTRO)
 */
function doGet(e) {
    try {
        const action = e.parameter.action || 'GET_LEADS';
        let data = {};

        if (action === 'GET_LEADS') {
            data = { status: 'success', leads: getLeadsData() };
        } else if (action === 'GET_LEDGER') {
            data = { status: 'success', ledger: getLedgerData() };
        } else {
            data = { status: 'error', message: 'Azione GET non valida.' };
        }

        return ContentService
            .createTextOutput(JSON.stringify(data))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        return ContentService
            .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * 3. GESTIONE CANDIDATURA FORM & GOLD CARD
 */
function gestisciCandidaturaForm(dati) {
    const sheet = ottieniOInizializzaFoglio(CONFIG.SHEET_LEADS, [
        'Timestamp', 'Codice Nexus', 'Nome', 'Azienda', 'Email', 'Telefono', 'Ambito', 'Data Prenotazione', 'Ora Prenotazione', 'Note', 'Punti Gold Card'
    ]);

    const timestamp = new Date().toISOString();
    const nexusCode = dati.nexusCode || ('CEOSFX' + Date.now().toString().slice(-6));
    const punti = dati.punti || 1500;

    sheet.appendRow([
        timestamp,
        nexusCode,
        dati.nome || '',
        dati.azienda || '',
        dati.email || '',
        dati.telefono || '',
        dati.ambito || '',
        dati.dataPrenotazione || '',
        dati.oraPrenotazione || '',
        dati.note || '',
        punti
    ]);

    // Invio Notifiche
    inviaEmailConferma(dati, nexusCode);
    inviaNotificaTelegram(`🚨 *NUOVA CANDIDATURA LEADS*\nCodice: \`${nexusCode}\`\nNome: ${dati.nome}\nAzienda:${dati.azienda || 'N/D'}\nTelefono: ${dati.telefono}\nAmbito:${dati.ambito}\nSlot: ${dati.dataPrenotazione} ore${dati.oraPrenotazione}`);

    return {
        status: 'success',
        nexusCode: nexusCode,
        punti: punti,
        message: 'Candidatura registrata con successo nel Registro Sovrano.'
    };
}

/**
 * 4. GESTIONE QUERY AGENTE AI ALISON
 */
function gestisciAlisonQuery(dati) {
    const msg = (dati.message || '').toLowerCase();
    let reply = "Gentile ospite, la Presidenza del CEO Giuliano Caratelli è stata notificata della sua richiesta. Un nostro Executive provvederà al riscontro.";

    if (msg.includes('ceo') || msg.includes('appuntamento') || msg.includes('conferenza')) {
        reply = "Può accreditarsi direttamente per un incontro riservato con il CEO Giuliano Caratelli tramite la sezione Candidatura Nexus. Le verrà assegnato un Codice Identificativo e lo slot da lei selezionato.";
    } else if (msg.includes('corso') || msg.includes('academy') || msg.includes('prezzo') || msg.includes('costo')) {
        reply = "La Suprema Academy offre tre percorsi d'élite: Silver (Base), Executive (Avanzato) e Premium VIP. Può candidarsi per accedere alle quote riservate e agli accrediti Gold Card.";
    } else if (msg.includes('opal') || msg.includes('brevetto') || msg.includes('antigravity')) {
        reply = "I brevetti WIPO/PCT relativi alla linea Boutique Luxury Opal e Levitazione Antigravity sono custoditi nella Cassaforte Privata Vault (accesso riservato EAL6+).";
    }

    inviaNotificaTelegram(`💬 *INTERAZIONE ALISON AI*\nMessaggio: "${dati.message}"\nRisposta inviata: "${reply}"`);

    return {
        status: 'success',
        reply: reply
    };
}

/**
 * 5. GESTIONE MASTRO FINANZIARIO LEDGER (SPLIT 54 / 30 / 16)
 */
function gestisciLedgerEntry(dati) {
    const sheet = ottieniOInizializzaFoglio(CONFIG.SHEET_LEDGER, [
        'Timestamp', 'Descrizione', 'Importo Totale', 'Tipo', 'Operatività (54%)', 'Dividendi (30%)', 'Tasse (16%)', 'Proof Hash SHA-256'
    ]);

    const timestamp = new Date().toISOString();
    const amount = parseFloat(dati.amount) || 0;
    const tipo = dati.type || 'ENTRATA';

    let ops = 0, div = 0, tax = 0;
    if (tipo === 'ENTRATA') {
        ops = amount * 0.54;
        div = amount * 0.30;
        tax = amount * 0.16;
    } else {
        ops = amount;
    }

    const proofHash = calcolaHashSHA256(timestamp + dati.description + amount);

    sheet.appendRow([
        timestamp,
        dati.description || '',
        amount,
        tipo,
        ops,
        div,
        tax,
        proofHash
    ]);

    inviaNotificaTelegram(`📊 *REGISTRAZIONE MASTRO FINANZIARIO*\nDescrizione: ${dati.description}\nImporto: €${amount.toFixed(2)} (${tipo})\nOps (54\%): €${ops.toFixed(2)} | Div (30%): € ${div.toFixed(2)} \vert{} Tax (16\%): €${tax.toFixed(2)}\nProof Hash: \`${proofHash.substring(0, 16)}...\``);

    return {
        status: 'success',
        hashProof: proofHash,
        message: 'Voce registrata nel Mastro Contabile Sovrano.'
    };
}

/**
 * 6. GESTIONE AGGIORNAMENTO PROMPT NEURALI AGENTI AI
 */
function gestisciPromptNeurale(dati) {
    const sheet = ottieniOInizializzaFoglio(CONFIG.SHEET_PROMPTS, [
        'Timestamp', 'Agente', 'System Prompt', 'Operatore'
    ]);

    sheet.appendRow([
        new Date().toISOString(),
        dati.agente || '',
        dati.prompt || '',
        dati.operatore || 'X-BOX ADMIN'
    ]);

    return {
        status: 'success',
        message: 'Prompt distribuito alla Rete Neurale.'
    };
}

/**
 * 7. SEGNALAZIONE ALLARME SICUREZZA EAL6+
 */
function gestisciSecurityAlarm(dati) {
    inviaNotificaTelegram(`🚨🚨 *ALLARME TENTATIVI FALLITI EAL6+*\nTarget: ${dati.target}\nTentativo Password: ${dati.passAttempt}\nTentativo PIN: ${dati.pinAttempt}\nUser Agent: ${dati.userAgent}`);
    return { status: 'logged', message: 'Segnalazione registrata.' };
}

/**
 * 8. FUNZIONI DI LETTURA DATI FOGLI FONDAMENTALI
 */
function getLeadsData() {
    const sheet = ottieniOInizializzaFoglio(CONFIG.SHEET_LEADS, []);
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];

    const headers = data[0];
    const rows = data.slice(1);

    return rows.map(row => ({
        timestamp: row[0],
        nexusCode: row[1],
        nome: row[2],
        azienda: row[3],
        email: row[4],
        telefono: row[5],
        ambito: row[6],
        dataPrenotazione: row[7],
        oraPrenotazione: row[8],
        note: row[9],
        punti: row[10]
    })).reverse();
}

function getLedgerData() {
    const sheet = ottieniOInizializzaFoglio(CONFIG.SHEET_LEDGER, []);
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];

    const rows = data.slice(1);

    return rows.map(row => ({
        timestamp: row[0],
        descrizione: row[1],
        importo: row[2],
        tipo: row[3],
        operativita: row[4],
        dividendi: row[5],
        tasse: row[6],
        proofHash: row[7]
    })).reverse();
}

/**
 * 9. UTILITIES ACCESSORIE: FOGLI, EMAIL, TELEGRAM & HASH SHA-256
 */
function ottieniOInizializzaFoglio(nomeFoglio, intestazioni) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(nomeFoglio);

    if (!sheet) {
        sheet = ss.insertSheet(nomeFoglio);
        if (intestazioni && intestazioni.length > 0) {
            sheet.appendRow(intestazioni);
            sheet.getRange(1, 1, 1, intestazioni.length).setFontWeight('bold').setBackground('#121620').setFontColor('#D4AF37');
        }
    }

    return sheet;
}

function inviaEmailConferma(dati, nexusCode) {
    if (!dati.email) return;

    try {
        const oggetto = `Conferma Ricezione Candidatura Nexus // Codice: ${nexusCode}`;
        const corpo = `Gentile ${dati.nome},\n\n` +
            `La Presidenza del CEO Giuliano Caratelli conferma la ricezione della sua candidatura per l'ambito: ${dati.ambito}.\n\n` +
            `Dettagli Accredito:\n` +
            `- Codice Nexus: ${nexusCode}\n` +
            `- Slot Prenotato: ${dati.dataPrenotazione} ore ${dati.oraPrenotazione}\n` +
            `- Punti Gold Card Accreditate: ${dati.punti || 1500} PTS\n\n` +
            `Cordiali Saluti,\n` +
            `Suprema Future X S.r.l. // Governance EAL6+`;

        MailApp.sendEmail(dati.email, oggetto, corpo);
    } catch (err) {
        Logger.log("Errore invio mail: " + err.toString());
    }
}

function inviaNotificaTelegram(messaggio) {
    if (!CONFIG.TELEGRAM_BOT_TOKEN || !CONFIG.TELEGRAM_CHAT_ID) return;

    try {
        const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;
        const payload = {
            chat_id: CONFIG.TELEGRAM_CHAT_ID,
            text: messaggio,
            parse_mode: 'Markdown'
        };

        UrlFetchApp.fetch(url, {
            method: 'post',
            contentType: 'application/json',
            payload: JSON.stringify(payload),
            muteHttpExceptions: true
        });
    } catch (err) {
        Logger.log("Errore Telegram: " + err.toString());
    }
}

function calcolaHashSHA256(stringa) {
    const rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, stringa, Utilities.Charset.UTF_8);
    let hash = '';
    for (let i = 0; i < rawHash.length; i++) {
        let byte = rawHash[i];
        if (byte < 0) byte += 256;
        let byteStr = byte.toString(16);
        if (byteStr.length === 1) byteStr = '0' + byteStr;
        hash += byteStr;
    }
    return '0x' + hash.toUpperCase();
}
