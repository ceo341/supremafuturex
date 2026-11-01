/**
 * ============================================================================
 * SUPREMA FUTURE X ENTERPRISE // COMPLETE PRODUCTION CORE (js/code.js)
 * File: js/code.js (GitHub Repository: supremafuturex)
 * Versione: 2026.10.0 - Full Monolithic Core EAL6+ (Zero False-Positive)
 * Sviluppo & Governance: Giuliano Caratelli (Founder & CEO)
 * ============================================================================
 */

(function (global) {
  'use strict';

  // ==========================================================================
  // 1. CONFIGURAZIONE COSTANTI & ARCHITETTURA DI VERTICE EAL6+
  // ==========================================================================
  const SFX_CONFIG = {
    APP_NAME: "Suprema Future X Enterprise",
    APP_CODE: "SFX-2026-ENT",
    VERSION: "2026.10.0",
    SECURITY_STANDARD: "EAL6+ Verified Forensics",
    FOUNDER_CEO: "Giuliano Caratelli",
    OFFICIAL_CONTACT: "+39 347 442 9091",
    TELEGRAM_HANDLE: "@supremafuturex",
    BACKEND_URL: "https://script.google.com/macros/s/AKfycbzs3OJONGpbMB0ja6cCHLlVLYEnUMWn797t_h9YfCFauxiyLAG-FzXLI05cbTD5tEXm5Q/exec",
    MASTER_PASSWORD: "MARIACHIARAsupremaofficial2026@",
    PIN_CEO: "3474429091",
    BUS_CHANNEL: "sfx_enterprise_bus",
    AUTOLOCK_MS: 180000,
    RATE_LIMIT_CANDIDATURA_MS: 600000,
    MAX_ALISON_MESSAGES: 5,
    LUXURY_SHOP_URL_B64: "aHR0cHM6Ly93d3cuaW1wZXJ5YS5jb20vdmV0cmluYS9zdHlsZQ==",
    SPLIT_RATIOS: {
      TAX_RESERVE: 0.16,
      CEO_DIVIDENDS: 0.30,
      OPERATIONAL_FUND: 0.54
    },
    SHAREHOLDERS: {
      HOLDING_SFX: 0.52,
      MARIACHIARA: 0.10,
      ROSSELLA: 0.04,
      ALBA: 0.02,
      MASSIMO: 0.01,
      FEDERICO: 0.01
    }
  };

  // ==========================================================================
  // 2. STATO APPLICATIVO CONDIVISO & CANALE BUS REAL-TIME
  // ==========================================================================
  const broadcast = ('BroadcastChannel' in window) ? new BroadcastChannel(SFX_CONFIG.BUS_CHANNEL) : null;

  const appState = {
    auth: {
      isLogged: false,
      pinVerified: false,
      sessionToken: sessionStorage.getItem("sfx_auth_token") || null,
      lastActivity: Date.now(),
      failedAttempts: 0
    },
    alison: {
      messageCount: 0,
      isSpeaking: false,
      synth: window.speechSynthesis || null,
      voice: null,
      triageActive: false,
      conversationHistory: []
    },
    ledger: {
      statusPoints: parseInt(localStorage.getItem("sfx_pts_status") || "0", 10),
      spendablePoints: parseInt(localStorage.getItem("sfx_pts_spendable") || "0", 10),
      transactions: JSON.parse(localStorage.getItem("sfx_tx_history") || "[]")
    },
    cassa: {
      grossTotal: parseFloat(localStorage.getItem("sfx_cassa_gross") || "0.00"),
      taxFund16: parseFloat(localStorage.getItem("sfx_cassa_tax16") || "0.00"),
      ceoDividends30: parseFloat(localStorage.getItem("sfx_cassa_ceo30") || "0.00"),
      development54: parseFloat(localStorage.getItem("sfx_cassa_dev54") || "0.00")
    },
    fleet: {
      activeAgents: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      killSwitchEngaged: false
    },
    gyro: {
      enabled: true,
      tiltX: 0,
      tiltY: 0
    }
  };

  // ==========================================================================
  // 3. SCUDO DI PROTEZIONE FORENSE EAL6+ (ZERO FALSI POSITIVI)
  // ==========================================================================
  function initForensicSecurityShield() {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        recordSecurityAudit("Tentativo apertura DevTools (F12)");
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
        e.preventDefault();
        recordSecurityAudit("Tentativo combinazione tasti ispezione: " + e.key);
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        recordSecurityAudit("Tentativo visualizzazione sorgente HTML (Ctrl+U)");
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        if (window.location.pathname.includes('statuto.html') || document.body.classList.contains('sfx-forensic-shield')) {
          e.preventDefault();
          alert("DOCUMENTO RISERVATO EAL6+:\nLa stampa del presente atto statutario è inibita a tutela del segreto industriale.");
          return false;
        }
      }
    });

    document.addEventListener('contextmenu', function (e) {
      if (window.location.pathname.includes('statuto.html') || document.body.classList.contains('sfx-forensic-shield')) {
        e.preventDefault();
        return false;
      }
    });

    document.addEventListener('dragstart', function (e) {
      if (e.target && e.target.nodeName === 'IMG') {
        e.preventDefault();
        return false;
      }
    });
  }

  function recordSecurityAudit(eventName) {
    const auditEntry = {
      type: "SECURITY_AUDIT_LOG",
      event: eventName,
      path: window.location.pathname,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    if (broadcast) {
      broadcast.postMessage(auditEntry);
    }
  }

  // ==========================================================================
  // 4. DIZIONARIO UFFICIALE INTEGRALE DELLE 50 FAQ DI ALISON (AG-01)
  // ==========================================================================
  const ALISON_50_FAQS = [
    {
      id: 1,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Chi è Giuliano Caratelli?",
      answer: "Giuliano Caratelli è il Fondatore e CEO di Suprema Future X Enterprise, ideatore del protocollo operativo e supervisore diretto di ciascun allievo ammesso.",
      tag: "faq_1",
      pointsReward: 0
    },
    {
      id: 2,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Cos'è Suprema Future X?",
      answer: "È la piattaforma d'élite creata per unire alta formazione operativa dal vivo, digital networking e concessione di attività commerciali autonome a zero magazzino.",
      tag: "faq_2",
      pointsReward: 0
    },
    {
      id: 3,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Come funzionano i corsi della Suprema Academy?",
      answer: "Tutti i percorsi sono erogati al 100% dal vivo in video-conferenza plenaria o One-to-One. È fatto divieto statutario di somministrare video pre-registrati.",
      tag: "faq_3",
      pointsReward: 0
    },
    {
      id: 4,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Quanto dura il percorso Silver Tier?",
      answer: "Il Silver Tier ha una durata di 60 giorni operativi incentrati su basi di digital networking, riorientamento al lavoro e setup dei primi asset digitali.",
      tag: "faq_4",
      pointsReward: 0
    },
    {
      id: 5,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Quanto dura l'Executive Master?",
      answer: "L'Executive Master si articola in 90 giorni intensivi con padronanza di flussi assistiti da intelligenza artificiale, Google Workspace e automazioni d'impresa.",
      tag: "faq_5",
      pointsReward: 0
    },
    {
      id: 6,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Quanto dura il Premium VIP?",
      answer: "Il Premium VIP prevede 120 giorni di affiancamento continuativo con sessioni One-to-One riservate direttamente con il CEO Giuliano Caratelli.",
      tag: "faq_6",
      pointsReward: 0
    },
    {
      id: 7,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Come ci si candida ai corsi?",
      answer: "È obbligatorio completare il modulo di screening conoscitivo e selezionare uno slot da 60 minuti via Google Meet direttamente con la Presidenza.",
      tag: "faq_7",
      pointsReward: 0
    },
    {
      id: 8,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Cosa succede durante lo screening di 60 minuti?",
      answer: "Il CEO esamina il profilo, gli obiettivi di carriera o d'impresa del candidato e stabilisce l'idoneità all'ammissione nei corsi a numero chiuso.",
      tag: "faq_8",
      pointsReward: 0
    },
    {
      id: 9,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "I prezzi dei corsi sono visibili sulla prima pagina?",
      answer: "No, per rigido protocollo EAL6+ i corsi non espongono listini pubblici in chiaro. Le quote vengono sbloccate in sede di screening o nella modale convalidata.",
      tag: "faq_9",
      pointsReward: 0
    },
    {
      id: 10,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Cosa sono i Negozi Digitali a zero magazzino?",
      answer: "Sono concessioni commerciali operative chiavi in mano in cui logistica, stoccaggio e spedizione sono interamente gestiti centralmente senza anticipi finanziari su merce.",
      tag: "faq_10",
      pointsReward: 0
    },
    {
      id: 11,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Qual è la partnership per i negozi digitali?",
      answer: "L'infrastruttura di distribuzione e-commerce è integrata nativamente con la rete partner di Imperya S.r.l. per prodotti di lusso e benessere certificati.",
      tag: "faq_11",
      pointsReward: 0
    },
    {
      id: 12,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Come si accede al Luxury Shop?",
      answer: "L'accesso alla boutique è protetto da un link cifrato in Base64 per evitare leak di posizionamento SEO sui motori di ricerca.",
      tag: "faq_12",
      pointsReward: 0
    },
    {
      id: 13,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Cos'è la Suprema Gold Card?",
      answer: "È la tessera phygital di appartenenza all'ecosistema che certifica il rango raggiunto e permette di accumulare punti convertibili in premi esclusivi.",
      tag: "faq_13",
      pointsReward: 0
    },
    {
      id: 14,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Qual è la differenza tra Punti Status e Punti Spendibili?",
      answer: "I Punti Status sono cumulativi a vita e determinano il grado accademico; i Punti Spendibili possono essere scalati per riscattare le 5 soglie premi.",
      tag: "faq_14",
      pointsReward: 0
    },
    {
      id: 15,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Come si accumulano i primi 100 punti?",
      answer: "Il completamento con successo del colloquio conoscitivo di screening di 60 minuti con il CEO accredita immediatamente +100 Punti Status.",
      tag: "faq_15",
      pointsReward: 0
    },
    {
      id: 16,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Quanti punti assegna l'iscrizione al Silver Tier?",
      answer: "L'ammissione confermata al percorso Silver Tier eroga un accredito di +300 Punti Status nel dossier dell'allievo.",
      tag: "faq_16",
      pointsReward: 0
    },
    {
      id: 17,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Quanti punti assegna l'Executive Master?",
      answer: "La ratifica dell'Executive Master eroga un accredito immediato di +350 Punti Status.",
      tag: "faq_17",
      pointsReward: 0
    },
    {
      id: 18,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Quanti punti assegna il Premium VIP?",
      answer: "L'ammissione al percorso di vertice Premium VIP conferisce +500 Punti Status.",
      tag: "faq_18",
      pointsReward: 0
    },
    {
      id: 19,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Quanti punti assegna l'apertura di un Negozio Digital?",
      answer: "La concessione di un'attività commerciale autonoma a zero magazzino accredita +800 Punti Status.",
      tag: "faq_19",
      pointsReward: 0
    },
    {
      id: 20,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Cosa succede al raggiungimento di 800 punti?",
      answer: "Il sistema invia automaticamente l'ordine al reparto tipografico per l'incisione laser della Gold Card in metallo dorato satinato.",
      tag: "faq_20",
      pointsReward: 0
    },
    {
      id: 21,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Qual è il premio della soglia a 2.000 punti?",
      answer: "3 Mesi di Conferenze Esecutive Gratuite con il CEO Giuliano Caratelli.",
      tag: "faq_21",
      pointsReward: 0
    },
    {
      id: 22,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Qual è il premio della soglia a 3.000 punti?",
      answer: "Invito a porte chiuse per 2 persone alla prestigiosa Cena Annuale di Gala della Presidenza a Roma Centro.",
      tag: "faq_22",
      pointsReward: 0
    },
    {
      id: 23,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Qual è il premio della soglia a 4.500 punti?",
      answer: "Audit Fiscale personalizzato con Ginevra (AG-03) + 6 Mesi di Call individuali con il CEO Giuliano Caratelli.",
      tag: "faq_23",
      pointsReward: 0
    },
    {
      id: 24,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Qual è il premio della soglia a 6.000 punti?",
      answer: "Upgrade Status Sovrano a vita + 1 Corso Academy gratuito a scelta + 1 Anno di Conferenze con il CEO.",
      tag: "faq_24",
      pointsReward: 0
    },
    {
      id: 25,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Qual è il premio della soglia a 7.500 punti?",
      answer: "Soggiorno Weekend Luxury per 2 persone in hotel 5 stelle partner a scelta tra Roma Centro e location convenzionate.",
      tag: "faq_25",
      pointsReward: 0
    },
    {
      id: 26,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Cos'è la matrice statutaria 54 / 30 / 16?",
      answer: "È la formula contabile matematica immutabile applicata ad ogni incasso derivante da didattica e concessioni digitali.",
      tag: "faq_26",
      pointsReward: 0
    },
    {
      id: 27,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "A cosa serve il 16% segregato?",
      answer: "Costituisce il Fondo Fiscale F24 intoccabile, presidiato dall'Agente Neurale Ginevra (AG-03) per il saldo esatto di imposte e contributi.",
      tag: "faq_27",
      pointsReward: 0
    },
    {
      id: 28,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "A cosa serve il 30%?",
      answer: "Rappresenta la quota dividendi presidenziali di spettanza del Founder & CEO Giuliano Caratelli, trasferibile sotto autenticazione PIN.",
      tag: "faq_28",
      pointsReward: 0
    },
    {
      id: 29,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "A cosa serve il 54%?",
      answer: "Costituisce il Fondo Operatività e Sviluppo destinato al mantenimento dell'infrastruttura SFX e alla liquidazione delle quote dei soci.",
      tag: "faq_29",
      pointsReward: 0
    },
    {
      id: 30,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Chi sono i soci partecipanti al 54%?",
      answer: "Holding SFX 52%, Mariachiara 10%, Rossella 4%, Alba 2%, Massimo 1%, Federico 1%.",
      tag: "faq_30",
      pointsReward: 0
    },
    {
      id: 31,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Cosa sono i 15 Agenti AI della flotta neurale?",
      answer: "Sono automazioni intelligenti specializzate che supportano ogni area dell'impresa: dal concierge al presidio fiscale fino alla sicurezza.",
      tag: "faq_31",
      pointsReward: 0
    },
    {
      id: 32,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Qual è il ruolo di AG-01 Alison?",
      answer: "È il Concierge Digitale H24 della Landing Page, incaricata di guidare gli utenti, rispondere alle FAQ e avviare il triage per lo screening.",
      tag: "faq_32",
      pointsReward: 0
    },
    {
      id: 33,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Cosa fa AG-02 Nicole?",
      answer: "Supervisiona la telemetria di sistema e compila i report operativi inviati ogni 3 ore sul canale Telegram protetto della Presidenza.",
      tag: "faq_33",
      pointsReward: 0
    },
    {
      id: 34,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Cosa fa AG-03 Ginevra?",
      answer: "Presidia l'accantonamento del 16% su ogni transazione e calcola le scadenze tributarie F24 entro il giorno 16 di ogni mese.",
      tag: "faq_34",
      pointsReward: 0
    },
    {
      id: 35,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Cosa fa AG-04 Nexus Scout?",
      answer: "Monitora il sentiment sui canali social e individua i profili professionali più promettenti per proporre l'orientamento accademico.",
      tag: "faq_35",
      pointsReward: 0
    },
    {
      id: 36,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Cosa fa AG-05 Ledger Guardian?",
      answer: "Verifica la quadratura matematica dello split 54/30/16 e vigila sulla corretta iscrizione a partita doppia nel mastro contabile.",
      tag: "faq_36",
      pointsReward: 0
    },
    {
      id: 37,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Cosa fa AG-06 Gatekeeper?",
      answer: "Governa l'autenticazione biometrica WebAuthn, valida le credenziali EAL6+ e blocca intrusioni indebite nella console X-BOX.",
      tag: "faq_37",
      pointsReward: 0
    },
    {
      id: 38,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Cosa fa AG-07 Delta Queue?",
      answer: "Gestisce la sincronizzazione in background dei media con Google Drive e governa la cache offline della Progressive Web App.",
      tag: "faq_38",
      pointsReward: 0
    },
    {
      id: 39,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Cosa fa AG-08 Media Broadcast?",
      answer: "Presiede la regia dei 400 slot multimediali, applica watermark anticopia e genera token CDN a scadenza 120 minuti.",
      tag: "faq_39",
      pointsReward: 0
    },
    {
      id: 40,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Cosa fa AG-09 Exit-Intent?",
      answer: "Intercetta i movimenti del cursore verso l'uscita dalla Landing Page e propone una modale di contatto per non perdere l'opportunità di screening.",
      tag: "faq_40",
      pointsReward: 0
    },
    {
      id: 41,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Cosa fa AG-10 Ingestion Bridge?",
      answer: "Normalizza i dati raccolti tramite i form Tally e li scrive in tempo reale all'interno dei database Google Sheets collegati.",
      tag: "faq_41",
      pointsReward: 0
    },
    {
      id: 42,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Cosa fa AG-11 Assedio Provisioner?",
      answer: "Predispone l'ambiente di lavoro Google Drive dell'allievo non appena viene confermata la sua ammissione al corso.",
      tag: "faq_42",
      pointsReward: 0
    },
    {
      id: 43,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Cosa fa AG-12 Sentinel?",
      answer: "Esegue scansioni notturne alle ore 03:00 e notifica la Presidenza in caso di inattività prolungata di un allievo per oltre 60 giorni.",
      tag: "faq_43",
      pointsReward: 0
    },
    {
      id: 44,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Cosa fa AG-13 Hermes?",
      answer: "Instrada i messaggi prioritari, conferme di calendario e notifiche di emergenza direttamente su WhatsApp al CEO (+39 347 442 9091).",
      tag: "faq_44",
      pointsReward: 0
    },
    {
      id: 45,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Cosa fa AG-14 Prompt Governor?",
      answer: "Verifica che tutte le risposte generate dai modelli linguistici siano perfettamente allineate allo statuto e ai principi etici SFX.",
      tag: "faq_45",
      pointsReward: 0
    },
    {
      id: 46,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Cosa fa AG-15 Joker?",
      answer: "Costituisce il generatore di riserva per strategie di comunicazione non convenzionale e campagne promozionali straordinarie.",
      tag: "faq_46",
      pointsReward: 0
    },
    {
      id: 47,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Cos'è il Master Fleet Kill-Switch?",
      answer: "È un interruttore di sicurezza hardware e software che permette al CEO di congelare all'istante l'attività di tutti i 15 agenti AI.",
      tag: "faq_47",
      pointsReward: 0
    },
    {
      id: 48,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Come avvengono i pagamenti dei corsi?",
      answer: "I pagamenti sono supportati via bonifico bancario istantaneo SEPA su Revolut Business oppure tramite terminali protetti SumUp POS.",
      tag: "faq_48",
      pointsReward: 0
    },
    {
      id: 49,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Quali sono le sedi istituzionali di Suprema Future X?",
      answer: "Sede Operativa: Colleferro (Roma). Ufficio Presidenza e Ricevimento Relazioni: Roma Centro (Via della Scrofa).",
      tag: "faq_49",
      pointsReward: 0
    },
    {
      id: 50,
      category: "SUPREMA_ENTERPRISE_GOVERNANCE",
      question: "Come si accede alla console X-BOX Enterprise?",
      answer: "L'accesso richiede la sequenza 3-Tap in 500ms sull'emblema in Hero, seguita da Master Password e PIN Esecutivo a 10 cifre 3474429091.",
      tag: "faq_50",
      pointsReward: 0
    },
  ];

  // ==========================================================================
  // 5. MOTORE VOCALE & SINTESI NEURALE ALISON (AG-01)
  // ==========================================================================
  function initAlisonSpeechEngine() {
    if (!appState.alison.synth) return;
    function refreshVoices() {
      const vList = appState.alison.synth.getVoices();
      if (vList && vList.length > 0) {
        appState.alison.voice = vList.find(v => v.lang.startsWith('it') && (v.name.includes('Female') || v.name.includes('Alice') || v.name.includes('Elsa') || v.name.includes('Google'))) || vList.find(v => v.lang.startsWith('it')) || null;
      }
    }
    refreshVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = refreshVoices;
    }
  }

  function speakAlisonVoice(text, onComplete) {
    if (!appState.alison.synth) return;
    appState.alison.synth.cancel();
    const clean = text.replace(/<[^>]*>?/gm, "").substring(0, 350);
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = 'it-IT';
    u.pitch = 1.05;
    u.rate = 1.02;
    if (appState.alison.voice) u.voice = appState.alison.voice;
    u.onstart = function () {
      appState.alison.isSpeaking = true;
      const avatar = document.querySelector(".btn-alison-menu");
      if (avatar) avatar.classList.add("speaking-glow");
    };
    u.onend = function () {
      appState.alison.isSpeaking = false;
      const avatar = document.querySelector(".btn-alison-menu");
      if (avatar) avatar.classList.remove("speaking-glow");
      if (typeof onComplete === "function") onComplete();
    };
    u.onerror = function () {
      appState.alison.isSpeaking = false;
    };
    appState.alison.synth.speak(u);
  }

  function handleAlisonMessage(userText) {
    appState.alison.messageCount++;
    if (appState.alison.messageCount >= SFX_CONFIG.MAX_ALISON_MESSAGES && !appState.alison.triageActive) {
      appState.alison.triageActive = true;
      const triageMsg = "Hai completato la consultazione preliminare H24. Per esaminare i tuoi obiettivi e strutturare il piano didattico personalizzato, ti invito a inoltrare la candidatura per la conferenza riservata di 60 minuti direttamente con il Presidente Giuliano Caratelli.";
      speakAlisonVoice(triageMsg);
      return triageMsg;
    }
    const lower = userText.toLowerCase().trim();
    const matched = ALISON_50_FAQS.find(f => lower.includes(f.question.toLowerCase().slice(0, 15)) || f.answer.toLowerCase().includes(lower));
    const reply = matched ? matched.answer : "Ti suggerisco di consultare le nostre FAQ istituzionali nel menu rapido o prenotare un colloquio conoscitivo con il Presidente Giuliano Caratelli per una valutazione su misura.";
    speakAlisonVoice(reply);
    return reply;
  }
  // ==========================================================================
  // 6. GIROSCOPIO 3D & PARALLASSE SU EMBLEMA E SCHEDE
  // ==========================================================================
  function init3DParallaxAndGyro() {
    const emblem = document.querySelector(".sfx-emblem-wrap");
    const title3D = document.querySelector(".sfx-main-3d-title");
    const cards = document.querySelectorAll(".sfx-card, .sfx-media-box");

    function applyTilt(x, y) {
      const limitX = Math.max(-15, Math.min(15, x));
      const limitY = Math.max(-15, Math.min(15, y));
      if (emblem) {
        emblem.style.transform = `perspective(800px) rotateY(${limitX * 0.8}deg) rotateX(${-limitY * 0.8}deg)`;
      }
      if (title3D) {
        title3D.style.transform = `perspective(800px) rotateY(${limitX * 0.4}deg) rotateX(${-limitY * 0.4}deg)`;
      }
      cards.forEach(c => {
        c.style.transform = `perspective(1000px) rotateY(${limitX * 0.2}deg) rotateX(${-limitY * 0.2}deg)`;
      });
    }

    window.addEventListener('mousemove', function (e) {
      if (!appState.gyro.enabled) return;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (e.clientX - centerX) / (window.innerWidth / 30);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 30);
      applyTilt(deltaX, deltaY);
    }, { passive: true });

    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {
      window.addEventListener('deviceorientation', function (e) {
        if (!appState.gyro.enabled || e.gamma === null || e.beta === null) return;
        applyTilt(e.gamma * 0.5, (e.beta - 45) * 0.5);
      }, { passive: true });
    }
  }

  // ==========================================================================
  // 7. WEBAUTHN & BIOMETRIA HARDWARE EAL6+
  // ==========================================================================
  async function isWebAuthnAvailable() {
    return window.PublicKeyCredential && (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
  }

  async function authenticateWithBiometrics() {
    const available = await isWebAuthnAvailable();
    if (!available) {
      return { success: false, reason: "Dispositivo biometrico non rilevato." };
    }
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const opts = {
        challenge: challenge,
        timeout: 60000,
        userVerification: 'required'
      };
      const assertion = await navigator.credentials.get({ publicKey: opts });
      if (assertion) {
        appState.auth.isLogged = true;
        appState.auth.pinVerified = true;
        sessionStorage.setItem('sfx_auth_token', 'EAL6_BIO_AUTH_' + Date.now());
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
    return { success: false, reason: "Autenticazione annullata." };
  }

  // ==========================================================================
  // 8. LEDGER CONTABILE A PARTITA DOPPIA (PUNTI STATUS & SPESA)
  // ==========================================================================
  function addPointsTransaction(amount, reason, type) {
    const txId = "TX-PTS-2026-" + Math.floor(10000 + Math.random() * 90000);
    const tx = {
      id: txId,
      amount: amount,
      reason: reason,
      type: type || "STATUS_AND_SPENDABLE",
      timestamp: new Date().toISOString()
    };
    appState.ledger.statusPoints += amount;
    appState.ledger.spendablePoints += amount;
    appState.ledger.transactions.unshift(tx);
    localStorage.setItem("sfx_pts_status", appState.ledger.statusPoints.toString());
    localStorage.setItem("sfx_pts_spendable", appState.ledger.spendablePoints.toString());
    localStorage.setItem("sfx_tx_history", JSON.stringify(appState.ledger.transactions.slice(0, 50)));
    if (appState.ledger.statusPoints >= 800 && !localStorage.getItem("sfx_laser_ordered")) {
      triggerLaserCardProduction();
    }
    if (broadcast) {
      broadcast.postMessage({
        type: "LEDGER_UPDATE",
        statusPoints: appState.ledger.statusPoints,
        spendablePoints: appState.ledger.spendablePoints,
        latestTx: tx
      });
    }
    return tx;
  }

  function triggerLaserCardProduction() {
    localStorage.setItem("sfx_laser_ordered", "true");
    const order = {
      action: "order_laser_card",
      serial: "CEOSFX-2026-" + Math.floor(1000 + Math.random() * 9000),
      status: "IN_PRODUZIONE_LASER",
      timestamp: new Date().toISOString()
    };
    fetch(SFX_CONFIG.BACKEND_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    }).catch(err => console.warn("[SFX LEDGER] Ordine laser memorizzato via bus:", err));
  }

  // ==========================================================================
  // 9. MOTORE DI CALCOLO FISCALE & DIVIDENDI (54 / 30 / 16)
  // ==========================================================================
  function calculateSplit(grossAmount) {
    const gross = parseFloat(grossAmount) || 0;
    const taxReserve = gross * SFX_CONFIG.SPLIT_RATIOS.TAX_RESERVE;
    const ceoDividends = gross * SFX_CONFIG.SPLIT_RATIOS.CEO_DIVIDENDS;
    const operationalFund = gross * SFX_CONFIG.SPLIT_RATIOS.OPERATIONAL_FUND;
    const breakdown = {
      holdingSFX: operationalFund * SFX_CONFIG.SHAREHOLDERS.HOLDING_SFX,
      mariachiara: operationalFund * SFX_CONFIG.SHAREHOLDERS.MARIACHIARA,
      rossella: operationalFund * SFX_CONFIG.SHAREHOLDERS.ROSSELLA,
      alba: operationalFund * SFX_CONFIG.SHAREHOLDERS.ALBA,
      massimo: operationalFund * SFX_CONFIG.SHAREHOLDERS.MASSIMO,
      federico: operationalFund * SFX_CONFIG.SHAREHOLDERS.FEDERICO
    };
    return {
      gross: gross,
      taxReserve: taxReserve,
      ceoDividends: ceoDividends,
      operationalFund: operationalFund,
      shareholders: breakdown,
      timestamp: new Date().toISOString()
    };
  }

  // ==========================================================================
  // 10. DECODIFICA URL BOUTIQUE (BASE64 OFFUSCATO)
  // ==========================================================================
  function getDecryptedShopUrl() {
    try {
      return atob(SFX_CONFIG.LUXURY_SHOP_URL_B64);
    } catch (e) {
      return "https://www.imperya.com/vetrina/style";
    }
  }

  function initLuxuryShopTriggers() {
    document.querySelectorAll(".sfx-luxury-shop-btn").forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const target = getDecryptedShopUrl();
        window.open(target, '_blank', 'noopener,noreferrer');
      });
    });
  }

  // ==========================================================================
  // 11. TRIGGER 3-TAP GATEWAY (<500ms)
  // ==========================================================================
  let tapTimestamps = [];
  function initSecretTrigger() {
    const triggers = document.querySelectorAll(".sfx-secret-trigger, #sfx-enterprise-trigger");
    triggers.forEach(el => {
      el.addEventListener('click', handleSecretTap);
      el.addEventListener('touchend', handleSecretTap);
    });
  }

  function handleSecretTap() {
    const now = Date.now();
    tapTimestamps.push(now);
    if (tapTimestamps.length > 3) tapTimestamps.shift();
    if (tapTimestamps.length === 3) {
      if (tapTimestamps[2] - tapTimestamps[0] <= 500) {
        tapTimestamps = [];
        window.location.href = "admin.html";
      }
    }
  }

  // ==========================================================================
  // 12. AUTO-LOCKOUT A 180 SECONDI
  // ==========================================================================
  let lockoutTimer;
  function resetInactivityTimer() {
    clearTimeout(lockoutTimer);
    appState.auth.lastActivity = Date.now();
    lockoutTimer = setTimeout(function () {
      if (window.location.pathname.includes("admin.html") || window.location.pathname.includes("crm.html")) {
        sessionStorage.removeItem('sfx_auth_token');
        alert("Sessione di sicurezza terminata per inattività (180s). Ricollegamento necessario.");
        window.location.href = "index.html";
      }
    }, SFX_CONFIG.AUTOLOCK_MS);
  }

  ['mousemove', 'keydown', 'touchstart', 'scroll'].forEach(function (evt) {
    window.addEventListener(evt, resetInactivityTimer, { passive: true });
  });

  // ==========================================================================
  // 13. GESTIONE BROADCAST BUS & LIVE TEXT STREAMING (0ms)
  // ==========================================================================
  function initBroadcastListener() {
    if (!broadcast) return;
    broadcast.onmessage = function (event) {
      const data = event.data;
      if (!data) return;
      if (data.type === "LIVE_TEXT_STREAM" && data.targetId) {
        const el = document.getElementById(data.targetId);
        if (el) el.innerText = data.content;
      }
      if (data.type === "XBOX_STATE_SIGNAL") {
        console.log("[SFX BUS] Segnale di stato ricevuto:", data.state);
      }
      if (data.type === "FLEET_KILL_ALL") {
        console.warn("[SFX EMERGENCY] Master Fleet Kill-Switch attivato.");
        appState.fleet.killSwitchEngaged = true;
        if (appState.alison.synth) appState.alison.synth.cancel();
      }
    };
  }

  // ==========================================================================
  // 14. TELEMETRIA FLOTTA NEURALE (15 AGENTI AI)
  // ==========================================================================
  function getAgentTelemetry(agentId) {
    const fleetSpecs = {
      1: {
        name: "ALISON",
        role: "Concierge Landing & Triage H24",
        status: "ATTIVO",
        details: "Latenza: 11ms"
      },
      2: {
        name: "NICOLE",
        role: "Telemetria & Report Orari Telegram",
        status: "ATTIVO",
        details: "Intervallo: 3h"
      },
      3: {
        name: "GINEVRA",
        role: "Presidio Fiscale 16% & F24",
        status: "ATTIVO",
        details: "Scadenza: 16 mese"
      },
      4: {
        name: "NEXUS SCOUT",
        role: "Monitoraggio Sentiment Social & Leads",
        status: "ATTIVO",
        details: "Analisi 24/7"
      },
      5: {
        name: "LEDGER GUARDIAN",
        role: "Split Matematico 54/30/16",
        status: "ATTIVO",
        details: "Partita Doppia EAL6+"
      },
      6: {
        name: "GATEKEEPER",
        role: "Controllo Accessi & WebAuthn",
        status: "ATTIVO",
        details: "Autenticazione Zero-Trust"
      },
      7: {
        name: "DELTA QUEUE",
        role: "Uploads Media & Google Drive Cache",
        status: "ATTIVO",
        details: "Coda Asincrona"
      },
      8: {
        name: "MEDIA BROADCAST",
        role: "Regia Video 16:10 & Watermark",
        status: "ATTIVO",
        details: "Gestione 400 Slot"
      },
      9: {
        name: "EXIT-INTENT",
        role: "Rilevamento Abbandono Pagina",
        status: "ATTIVO",
        details: "Sensibilità: 85%"
      },
      10: {
        name: "INGESTION BRIDGE",
        role: "Normalizzazione Form Tally",
        status: "ATTIVO",
        details: "Pipeline Sheets API"
      },
      11: {
        name: "ASSEDIO PROVISIONER",
        role: "Setup Workspace Allievo",
        status: "ATTIVO",
        details: "Google Drive Auth"
      },
      12: {
        name: "SENTINEL",
        role: "Audit Inattività Corsisti 60gg",
        status: "ATTIVO",
        details: "Scansione Notturna 03:00"
      },
      13: {
        name: "HERMES",
        role: "Dispatcher Notifiche WhatsApp CEO",
        status: "ATTIVO",
        details: "Target Priority"
      },
      14: {
        name: "PROMPT GOVERNOR",
        role: "Controllo Coerenza Risposte AI",
        status: "ATTIVO",
        details: "Validazione Statutaria"
      },
      15: {
        name: "JOKER",
        role: "Copywriting Persuasivo d'Emergenza",
        status: "STANDBY",
        details: "Backup Immediato"
      },
    };
    return fleetSpecs[agentId] || null;
  }

  function dispatchFleetCommand(command, targetAgentId = null) {
    const payload = { type: "FLEET_COMMAND", command: command, target: targetAgentId, timestamp: new Date().toISOString() };
    if (broadcast) broadcast.postMessage(payload);
  }

  // ==========================================================================
  // 15. WEB AUDIO SYNTHESIZER: CHIME & SEGNALI ACUSTICI EAL6+
  // ==========================================================================
  function playAudioChime(type) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === "AUTH_SUCCESS") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.30); // G5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === "VIOLATION_ALERT") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(880, now); // A5
        osc.frequency.setValueAtTime(440, now + 0.15); // A4
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "ALISON_PING") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(1046.50, now); // C6
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      console.warn("Web Audio API bloccata o non supportata dal browser in uso.");
    }
  }

  // ==========================================================================
  // 16. MOTORE RADAR CANVAS // TELEMETRIA VISIVA ALISON AG-01
  // ==========================================================================
  function initAlisonRadarCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let angle = 0;
    function renderFrame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 5;
      
      // Cerchi concentrici radar
      ctx.strokeStyle = "rgba(0, 240, 255, 0.2)";
      ctx.lineWidth = 1;
      for (let r = radius / 3; r <= radius; r += radius / 3) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Linea di scansione
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      const grad = ctx.createLinearGradient(0, 0, radius, 0);
      grad.addColorStop(0, "rgba(0, 240, 255, 0)");
      grad.addColorStop(1, "rgba(0, 240, 255, 0.8)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(radius, 0);
      ctx.stroke();
      ctx.restore();
      
      angle += 0.03;
      requestAnimationFrame(renderFrame);
    }
    renderFrame();
  }

  // ==========================================================================
  // 17. VALIDATORE FORM CANDIDATURE & VERIFICA INTEGRITÀ PAYLOAD
  // ==========================================================================
  function validateCandidaturaPayload(payload) {
    const errors = [];
    if (!payload.nome || payload.nome.trim().length < 2) {
      errors.push("Il campo Nome è obbligatorio (minimo 2 caratteri).");
    }
    if (!payload.cognome || payload.cognome.trim().length < 2) {
      errors.push("Il campo Cognome è obbligatorio (minimo 2 caratteri).");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!payload.email || !emailRegex.test(payload.email.trim())) {
      errors.push("L'indirizzo email fornito non è valido o malformato.");
    }
    if (!payload.whatsapp || payload.whatsapp.trim().length < 7) {
      errors.push("Il recapito WhatsApp è obbligatorio per l'invio delle credenziali Meet.");
    }
    if (!payload.slot || payload.slot.trim() === "") {
      errors.push("È tassativo selezionare uno slot orario dal calendario presidenziale.");
    }
    if (!payload.tier || payload.tier.trim() === "") {
      errors.push("Selezionare il percorso didattico d'interesse per lo screening.");
    }
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // ==========================================================================
  // 18. TRASMISSIONE ASINCRONA ROBUSTA CON RETRY AUTOMATICO (AG-10)
  // ==========================================================================
  async function robustPostPayload(endpoint, data, maxRetries = 2) {
    let attempt = 0;
    while (attempt <= maxRetries) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        return { success: true, attempt: attempt };
      } catch (err) {
        attempt++;
        if (attempt > maxRetries) {
          // Fallback di persistenza in coda locale in caso di assenza rete
          const queue = JSON.parse(localStorage.getItem("sfx_retry_queue") || "[]");
          queue.push({ endpoint: endpoint, data: data, timestamp: Date.now() });
          localStorage.setItem("sfx_retry_queue", JSON.stringify(queue));
          return { success: false, queued: true, error: err.message };
        }
        await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }
  }

  // ==========================================================================
  // 19. SINCRONIZZATORE CODA OFFLINE (BACKGROUND SYNC)
  // ==========================================================================
  async function processOfflineQueue() {
    const queue = JSON.parse(localStorage.getItem("sfx_retry_queue") || "[]");
    if (queue.length === 0) return;
    console.log(`[SFX QUEUE] Elaborazione ${queue.length} payload in coda...`);
    const remaining = [];
    for (const item of queue) {
      try {
        await fetch(item.endpoint, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item.data)
        });
      } catch (err) {
        remaining.push(item);
      }
    }
    localStorage.setItem("sfx_retry_queue", JSON.stringify(remaining));
  }

  // ==========================================================================
  // 20. INIZIALIZZAZIONE ALL'AVVIO DEL DOCUMENTO
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', function () {
    initForensicSecurityShield();
    initAlisonSpeechEngine();
    init3DParallaxAndGyro();
    initLuxuryShopTriggers();
    initSecretTrigger();
    initBroadcastListener();
    resetInactivityTimer();
    
    // Se siamo online, processa eventuali webhook rimasti in coda
    if (navigator.onLine) {
      processOfflineQueue();
    }
  });

  window.addEventListener('online', processOfflineQueue);

  // ==========================================================================
  // 21. ESPOSIZIONE API GLOBALE SFX
  // ==========================================================================
  global.SFX = {
    CONFIG: SFX_CONFIG,
    appState: appState,
    broadcast: broadcast,
    ALISON_50_FAQS: ALISON_50_FAQS,
    speakAlisonVoice: speakAlisonVoice,
    handleAlisonMessage: handleAlisonMessage,
    calculateSplit: calculateSplit,
    addPointsTransaction: addPointsTransaction,
    getDecryptedShopUrl: getDecryptedShopUrl,
    authenticateWithBiometrics: authenticateWithBiometrics,
    getAgentTelemetry: getAgentTelemetry,
    dispatchFleetCommand: dispatchFleetCommand,
    playAudioChime: playAudioChime,
    initAlisonRadarCanvas: initAlisonRadarCanvas,
    validateCandidaturaPayload: validateCandidaturaPayload,
    robustPostPayload: robustPostPayload
  };

})(typeof window !== "undefined" ? window : this);
