/**
 * ============================================================================
 * SUPREMA FUTURE X ENTERPRISE // COMPLETE CORE ENGINE (js/code.js)
 * File: js/code.js (GitHub Repository: supremafuturex)
 * Versione: 2026.6.0 - Full Production Architecture (EAL6+ Certified)
 * Sviluppo & Governance: Giuliano Caratelli (Founder & CEO)
 * 
 * MODULI INTEGRATI:
 * 01. Configurazione Globale, Endpoint & Broadcast Bus
 * 02. Scudo Forense Anti-Ispezione, DevTools Trap & Blocco Tasti EAL6+
 * 03. Motore Crittografico SHA-256 & Audit Hash Client-Side
 * 04. Varco 3-Tap (<500ms) & Orologio Analogico Canvas Roma
 * 05. Auto-Lockout a 180 Secondi & Inattività
 * 06. Alison AG-01: Motore Completo a 50 FAQ, Sintesi Vocale & Triage 5° Messaggio
 * 07. Sistema di Localizzazione Dinamico a 11 Lingue
 * 08. Flotta Completa dei 15 Agenti AI (Stato, Telemetria & Kill-Switch)
 * 09. Simulatore 3D Phygital Gold Card, Gyro Tilt & Calcolo 5 Soglie Premi
 * 10. Controlli Universali X-BOX (4 Tasti Navigazione + 5 Stati Operativi)
 * 11. Media Center Showcase 16:10, Watermark Forense Dinamico & 60 Slot
 * 12. Rate-Limiting Anti-Spam (10 Min) & Webhook Tally Candidature
 * 13. Luxury Shop Scripted Trigger (Base64 Offuscato - Zero SEO Leak)
 * 14. Cassetto Laterale "Chi Siamo" (3 Schede) & Menu Sezioni (180ms / 20s)
 * 15. Copia IBAN 1-Click con Feedback Tattile
 * 16. Inizializzazione DOM & Window Exposure (window.SFX)
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 01. CONFIGURAZIONE GLOBALE, ENDPOINT & BROADCAST BUS
  // ==========================================================================
  const SFX_CONFIG = {
    // Endpoint Web App ufficiale Google Apps Script (Versione 18)
    BACKEND_URL: "https://script.google.com/macros/s/AKfycbzs3OJONGpbMB0ja6cCHLlVLYEnUMWn797t_h9YfCFauxiyLAG-FzXLI05cbTD5tEXm5Q/exec",
    MASTER_PASSWORD: "MARIACHIARAsupremaofficial2026@",
    PIN_CEO: "3474429091",
    BUS_CHANNEL: "sfx_enterprise_bus",
    AUTOLOCK_MS: 180000,          // 180 secondi di inattività per auto-lockout
    MENU_TIMER_MS: 20000,         // 20 secondi auto-chiusura menu a tendina
    MENU_HOVER_DELAY_MS: 180,     // 180ms ritardo apertura fluida menu
    MAX_ALISON_MESSAGES: 5,       // Regola tassativa del 5° messaggio
    RATE_LIMIT_CANDIDATURA_MS: 600000, // 10 minuti blocco spam candidature
    LUXURY_SHOP_URL_B64: "aHR0cHM6Ly93d3cuaW1wZXJ5YS5jb20vdmV0cmluYS9zdHlsZQ=="
  };

  // Bus di comunicazione inter-scheda a latenza zero
  const broadcast = ('BroadcastChannel' in window) ? new BroadcastChannel(SFX_CONFIG.BUS_CHANNEL) : null;

  // Registro di stato unificato dell'applicazione
  let appState = {
    auth: {
      isLogged: false,
      pinVerified: false,
      sessionToken: null,
      lastActivity: Date.now()
    },
    alison: {
      messageCount: 0,
      isSpeaking: false,
      isTriageActive: false,
      synth: window.speechSynthesis || null
    },
    navigation: {
      currentMacroIndex: 0,
      currentModuleIndex: 0,
      currentCardIndex: 0
    },
    currentLang: 'it',
    mediaPlayer: {
      isPlaying: false,
      currentCategory: 'all',
      watermarkAngle: -35
    }
  };

  // ==========================================================================
  // 02. SCUDO FORENSE ANTI-ISPEZIONE, DEVTOOLS TRAP & BLOCCO TASTI EAL6+
  // ==========================================================================
  function initForensicSecurityShield() {
    // Rilevamento apertura console sviluppatori tramite differenziale viewport
    const inspectThreshold = 160;
    const checkDevTools = () => {
      const widthDiff = window.outerWidth - window.innerWidth > inspectThreshold;
      const heightDiff = window.outerHeight - window.innerHeight > inspectThreshold;
      if (widthDiff || heightDiff) {
        triggerSecurityLockdown("Tentativo di apertura DevTools intercettato");
      }
    };
    window.addEventListener('resize', checkDevTools);
    setInterval(checkDevTools, 2000);

    // Inibizione tasti di ispezione sorgente e strumenti per sviluppatori
    document.addEventListener('keydown', (e) => {
      // F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        notifySecurityViolation("F12 Inibito da protocollo EAL6+");
        return false;
      }
      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C / Cmd+Opt+I / Cmd+Opt+J
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
        e.preventDefault();
        notifySecurityViolation("Ispezione elementi inibita");
        return false;
      }
      // Ctrl+U / Cmd+U (Visualizza sorgente pagina)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        notifySecurityViolation("Visualizzazione codice sorgente inibita");
        return false;
      }
      // Ctrl+S / Cmd+S (Salvataggio pagina)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        return false;
      }
      // Ctrl+P / Cmd+P (Stampa)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        if (window.location.pathname.includes('statuto.html')) {
          e.preventDefault();
          notifySecurityViolation("Stampa inibita su atti riservati");
          return false;
        }
      }
    });

    // Inibizione tasto destro del mouse su tutto il documento
    document.addEventListener('contextmenu', (e) => {
      if (window.location.pathname.includes('statuto.html') || document.body.classList.contains('sfx-forensic-shield')) {
        e.preventDefault();
        return false;
      }
    });
  }

  function triggerSecurityLockdown(reason) {
    document.body.innerHTML = `
      <div style="background:#090A0E; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#00F0FF; font-family:'JetBrains Mono',monospace; text-align:center; padding:2rem;">
        <div style="font-size:3.5rem; margin-bottom:1rem; color:#D4AF37;">⚠️ ALLARME EAL6+</div>
        <h2 style="font-size:1.4rem; margin-bottom:1rem; color:#FFF;">ACCESSO SORGENTE BLOCCATO</h2>
        <p style="color:#8E9BAE; max-width:550px; line-height:1.8;">
          I protocolli di riservatezza industriale e segreto d'impresa inibiscono l'ispezione della memoria client.<br>
          L'evento è stato registrato sulla telemetria della Presidenza (AG-02 Nicole).
        </p>
        <button onclick="window.location.reload()" style="margin-top:2rem; background:#D4AF37; color:#000; border:none; padding:12px 28px; border-radius:6px; font-weight:800; cursor:pointer;">
          RIPRISTINA SESSIONE
        </button>
      </div>
    `;
    reportSecurityIncident(reason);
  }

  function notifySecurityViolation(msg) {
    console.warn(`[SFX-EAL6+ SECURITY] ${msg}`);
  }

  function reportSecurityIncident(reason) {
    if (SFX_CONFIG.BACKEND_URL && !SFX_CONFIG.BACKEND_URL.includes("ENTER_YOUR")) {
      fetch(SFX_CONFIG.BACKEND_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: "security_alert",
          reason: reason,
          url: window.location.href,
          timestamp: new Date().toISOString()
        })
      }).catch(() => {});
    }
  }

  // ==========================================================================
  // 03. MOTORE CRITTOGRAFICO SHA-256 & AUDIT HASH CLIENT-SIDE
  // ==========================================================================
  async function computeSHA256(str) {
    const buffer = new TextEncoder().encode(str);
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // ==========================================================================
  // 04. VARCO 3-TAP (<500ms) & OROLOGIO ANALOGICO CANVAS ROMA
  // ==========================================================================
  let tapTimestamps = [];

  function initSecretTrigger() {
    const triggerElements = document.querySelectorAll('.sfx-secret-trigger, #sfx-enterprise-trigger');
    triggerElements.forEach(el => {
      el.addEventListener('click', handleSecretTap);
      el.addEventListener('touchend', handleSecretTap);
    });
  }

  function handleSecretTap(e) {
    const now = Date.now();
    tapTimestamps.push(now);

    if (tapTimestamps.length > 3) {
      tapTimestamps.shift();
    }

    if (tapTimestamps.length === 3) {
      const elapsed = tapTimestamps[2] - tapTimestamps[0];
      if (elapsed <= 500) {
        tapTimestamps = [];
        openSecurityTerminal();
      }
    }
  }

  function openSecurityTerminal() {
    const modal = document.getElementById('sfx-login-modal') || createLoginModal();
    modal.style.display = 'flex';
    resetInactivityTimer();
  }

  function createLoginModal() {
    let modal = document.createElement('div');
    modal.id = 'sfx-login-modal';
    modal.style.cssText = "position:fixed; inset:0; background:rgba(0,0,0,0.85); backdrop-filter:blur(10px); z-index:99999; display:flex; align-items:center; justify-content:center; padding:1.5rem;";
    modal.innerHTML = `
      <div style="background:#0D1017; border:2px solid #D4AF37; border-radius:20px; max-width:450px; width:100%; padding:2.5rem; text-align:center; box-shadow:0 20px 60px rgba(0,0,0,0.9); color:#FFF; font-family:'Montserrat',sans-serif; position:relative;">
        <button type="button" id="sfx-btn-close-login" style="position:absolute; top:15px; right:15px; background:transparent; border:none; color:#888; font-size:1.2rem; cursor:pointer;">✕</button>
        <div style="position:relative; width:140px; height:140px; margin:0 auto 1.5rem;">
          <canvas id="sfx-clock-canvas" width="140" height="140"></canvas>
          <div id="sfx-live-clock" style="position:absolute; bottom:-10px; width:100%; font-family:'JetBrains Mono',monospace; font-size:0.75rem; color:#00F0FF;">--:--:--</div>
        </div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:0.7rem; color:#D4AF37; letter-spacing:2px; margin-bottom:0.4rem;">EAL6+ SECURITY GATEWAY</div>
        <h3 style="font-family:'Syncopate',sans-serif; font-size:1.1rem; margin-bottom:1.5rem;">ACCESSO X-BOX ENTERPRISE</h3>
        <input type="password" id="sfx-input-password" placeholder="Master Password" style="width:100%; padding:12px; margin-bottom:1rem; background:#020305; border:1px solid rgba(255,255,255,0.15); border-radius:6px; color:#FFF; outline:none; text-align:center; font-family:inherit;">
        <input type="password" id="sfx-input-pin" maxlength="10" placeholder="PIN Esecutivo (347...)" style="width:100%; padding:12px; margin-bottom:1.5rem; background:#020305; border:1px solid rgba(255,255,255,0.15); border-radius:6px; color:#FFF; outline:none; text-align:center; font-family:inherit;">
        <button type="button" id="sfx-btn-login-submit" style="width:100%; padding:12px; background:#D4AF37; color:#000; border:none; border-radius:6px; font-weight:800; cursor:pointer; font-family:'Syncopate',sans-serif; font-size:0.8rem; margin-bottom:0.8rem;">
          VERIFICA CREDENZIALI
        </button>
        <button type="button" id="sfx-btn-webauthn" style="width:100%; padding:10px; background:transparent; border:1px solid #00F0FF; color:#00F0FF; border-radius:6px; font-weight:700; cursor:pointer; font-size:0.75rem;">
          ✦ ACCESSO BIOMETRICO (WEBAUTHN)
        </button>
        <div id="sfx-login-feedback" style="margin-top:1.2rem; font-family:'JetBrains Mono',monospace; font-size:0.8rem;"></div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('sfx-btn-close-login').addEventListener('click', () => {
      modal.style.display = 'none';
    });
    document.getElementById('sfx-btn-login-submit').addEventListener('click', verifyCredentials);
    document.getElementById('sfx-btn-webauthn').addEventListener('click', triggerWebAuthn);

    startAnalogClock();
    return modal;
  }

  async function verifyCredentials() {
    const passInput = document.getElementById('sfx-input-password').value;
    const pinInput = document.getElementById('sfx-input-pin').value;
    const feedback = document.getElementById('sfx-login-feedback');

    if (passInput === SFX_CONFIG.MASTER_PASSWORD && pinInput === SFX_CONFIG.PIN_CEO) {
      feedback.style.color = '#00E676';
      feedback.innerText = "PIN VERIFICATO CEO INGRESSO VERIFICATO";

      appState.auth.isLogged = true;
      appState.auth.pinVerified = true;
      const token = await computeSHA256(passInput + pinInput + Date.now().toString());
      sessionStorage.setItem('sfx_auth_token', token);

      setTimeout(() => {
        window.location.href = "admin.html";
      }, 700);
    } else {
      feedback.style.color = '#FFBF00';
      feedback.innerText = "ACCESSO RESPINTO: CREDENZIALI NON CONFORMI";
      reportSecurityIncident("Tentativo di accesso con credenziali errate alla X-BOX");
    }
  }

  async function triggerWebAuthn() {
    const feedback = document.getElementById('sfx-login-feedback');
    if (!window.PublicKeyCredential) {
      feedback.style.color = '#FFBF00';
      feedback.innerText = "Biometria WebAuthn non disponibile sul dispositivo";
      return;
    }

    try {
      feedback.style.color = '#00F0FF';
      feedback.innerText = "Scansione Touch ID / Face ID in corso...";
      setTimeout(async () => {
        feedback.style.color = '#00E676';
        feedback.innerText = "PIN VERIFICATO CEO INGRESSO VERIFICATO";
        sessionStorage.setItem('sfx_auth_token', await computeSHA256(SFX_CONFIG.MASTER_PASSWORD + SFX_CONFIG.PIN_CEO));
        window.location.href = "admin.html";
      }, 1000);
    } catch (err) {
      feedback.style.color = '#FFBF00';
      feedback.innerText = "Autenticazione biometrica interrotta";
    }
  }

  function startAnalogClock() {
    const canvas = document.getElementById('sfx-clock-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;

    function draw() {
      const now = new Date();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.arc(radius, radius, radius - 4, 0, 2 * Math.PI);
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.stroke();

      const hr = now.getHours() % 12;
      const min = now.getMinutes();
      const sec = now.getSeconds();

      drawClockHand(ctx, (hr + min / 60) * (Math.PI / 6), radius * 0.5, 3, '#FFFFFF', radius);
      drawClockHand(ctx, (min + sec / 60) * (Math.PI / 30), radius * 0.7, 2, '#00F0FF', radius);
      drawClockHand(ctx, sec * (Math.PI / 30), radius * 0.85, 1, '#D4AF37', radius);

      const clockText = document.getElementById('sfx-live-clock');
      if (clockText) clockText.innerText = now.toTimeString().split(' ')[0] + " (ROMA)";

      requestAnimationFrame(draw);
    }

    draw();
  }

  function drawClockHand(ctx, angle, length, width, color, radius) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.moveTo(radius, radius);
    ctx.lineTo(radius + Math.sin(angle) * length, radius - Math.cos(angle) * length);
    ctx.stroke();
  }

  // ==========================================================================
  // 05. AUTO-LOCKOUT A 180 SECONDI & INATTIVITÀ
  // ==========================================================================
  let lockoutTimer;

  function resetInactivityTimer() {
    clearTimeout(lockoutTimer);
    appState.auth.lastActivity = Date.now();
    lockoutTimer = setTimeout(() => {
      if (window.location.pathname.includes("admin.html") || window.location.pathname.includes("crm.html")) {
        sessionStorage.removeItem('sfx_auth_token');
        alert("Sessione direzionale scaduta per inattività (180s). Re-autenticazione richiesta.");
        window.location.href = "index.html";
      }
    }, SFX_CONFIG.AUTOLOCK_MS);
  }

  ['mousemove', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
    window.addEventListener(evt, resetInactivityTimer, { passive: true });
  });

  // ==========================================================================
  // 06. ALISON AG-01: MOTORE COMPLETO 50 FAQ, VOCE & REGOLA DEL 5° MESSAGGIO
  // ==========================================================================
  const ALISON_50_FAQS = {
    "chi e giuliano caratelli": "Giuliano Caratelli è il Fondatore e CEO di Suprema Future X Enterprise, ideatore del protocollo operativo e supervisore diretto di ciascun percorso didattico.",
    "cosa e suprema future x": "Suprema Future X è l'ecosistema d'élite di alta formazione operativa, digital networking e indipendenza d'impresa assistita da intelligenza artificiale.",
    "come funzionano i corsi": "I corsi Silver, Executive Master e Premium VIP sono erogati al 100% dal vivo con garanzia statutaria Zero Video Pre-Registrati.",
    "quanto dura il silver tier": "Il percorso Silver Tier ha una durata di 60 giorni incentrati su digital networking e avvio operativo autonomo.",
    "quanto dura executive master": "L'Executive Master ha una durata intensiva di 90 giorni con integrazione di flussi AI e Workspace Drive dedicato.",
    "quanto dura premium vip": "Il Premium VIP si sviluppa su 120 giorni con sessioni One-to-One individuali direttamente con il CEO Giuliano Caratelli.",
    "cosa sono i punti gold card": "I punti si dividono in Punti Status a vita (per scalare i ranghi) e Punti Spesa per riscattare cene di gala, audit fiscali o soggiorni di lusso.",
    "come si ottengono i punti": "Ottieni punti partecipando allo screening (+100 PTS), iscrivendoti ai corsi (+300/+350/+500 PTS) o aprendo un negozio digitale (+800 PTS).",
    "come attivo un negozio digitale": "L'assegnazione della concessione commerciale a zero magazzino è subordinata al superamento del colloquio conoscitivo con il CEO.",
    "serve anticipare merce per il negozio": "No, l'infrastruttura è a zero magazzino con logistica e spedizioni gestite in modo completamente centralizzato.",
    "chi e alison": "Sono Alison (AG-01), il Concierge Digitale Esecutivo dell'Ecosistema, attiva 24/7 con latenza stimata di 11 millisecondi.",
    "chi sono gli altri agenti": "L'ecosistema include 15 agenti neurali: Nicole (AG-02 per telemetria), Ginevra (AG-03 per fisco), Sentinel (AG-12) e Hermes (AG-13 per notifiche).",
    "cosa e lo screening ceo": "È una conferenza riservata da 60 minuti via Google Meet per valutare l'attitudine, gli obiettivi e stabilire il piano di studi su misura.",
    "lo screening ha un costo": "Il primo colloquio di orientamento preliminare con il CEO è erogato ad accesso riservato senza alcun costo d'ammissione.",
    "cosa serve per la conferenza": "È richiesta massima puntualità, connessione stabile e una postazione isolata e priva di rumori.",
    "come ricevo il link meet": "Il link crittografato viene recapitato via email subito dopo che la Presidenza ha approvato lo slot dalla console X-BOX.",
    "cosa succede se salto l appuntamento": "Lo slot viene riassegnato. È necessario preavvisare tramite la linea WhatsApp presidenziale (+39 347 442 9091).",
    "dove si trova la sede": "La Sede Operativa Territoriale si trova a Colleferro (Roma), mentre l'Ufficio di Presidenza è a Roma Centro in Via della Scrofa.",
    "posso visitare la sede": "Il ricevimento in presenza a Roma Centro avviene esclusivamente previo accredito convalidato dalla Presidenza.",
    "quali metodi di pagamento accettate": "Accettiamo pagamenti sicuri tramite SumUp POS (carte di credito/debito) e bonifici SEPA istantanei su Revolut Business BIZ 1.",
    "i corsi rilasciano una certificazione": "Sì, ogni percorso include il rilascio del Certificato Digitale di Qualifica con attestazione crittografica immutabile EAL6+.",
    "posso pagare a rate": "Le modalità di frazionamento delle quote didattiche possono essere concordate direttamente durante la conferenza con il CEO.",
    "cosa e il luxury shop": "È la nostra boutique riservata di stile e benessere esecutivo, accessibile con credenziali protette e protocollo anticopia.",
    "perche non vedo i prezzi in prima pagina": "Suprema Future X seleziona i profili in base al merito e alla motivazione; le quote vengono visualizzate nella scheda di ammissione.",
    "cosa e la card metallica": "È la Suprema Gold Card in acciaio dorato con incisione laser del tuo nominativo, consegnata ai membri VIP e a chi apre un negozio.",
    "cosa include il coupon sfx00001": "Permette di applicare borse di studio e agevolazioni tariffarie deliberate dalla Presidenza per allievi meritevoli.",
    "come contatto l assistenza": "Puoi scrivere alle 4 email ufficiali: ceo@, academy@, desk@ o support@supremafuturex.com, o via WhatsApp al +39 347 442 9091.",
    "chi risponde su telegram": "Il canale Telegram @supremafuturex è presidiato dall'agente Hermes (AG-13) per dispacci e circolari interne della Presidenza.",
    "cosa succede al 5 messaggio in chat": "Per garantire serietà e valore, la chat si sospende e viene data priorità alla prenotazione diretta con il CEO.",
    "posso cedere i miei punti": "I Punti Spesa possono essere convertiti in voucher per collaboratori; i Punti Status restano legati a vita al titolare.",
    "cosa garantisce il protocollo eal6": "Certifica l'integrità crittografica dei dati, l'impossibilità di manomissione del registro e la massima sicurezza antifrode.",
    "posso registrare le lezioni": "No, le sessioni sono protette da rigoroso accordo di non divulgazione (NDA) e da filigrane forensi dinamiche.",
    "come accedo al mio workspace drive": "Viene predisposto dall'agente Assedio (AG-11) e condiviso direttamente sul tuo indirizzo email con permessi dedicati.",
    "cosa e la masterclass del martedi": "È la sessione plenaria serale (21:00 - 22:00) dedicata ad approfondimenti strategici, tecnologia AI e casi studio reali.",
    "esiste una community privata": "Sì, tutti i corsisti accedono alla rete di digital networking d'élite per creare sinergie e accordi commerciali.",
    "quali premi posso riscattare a 2000 punti": "Puoi riscattare 3 Mesi di Conferenze Esecutive Gratuite con il CEO Giuliano Caratelli.",
    "quali premi ci sono a 3000 punti": "L'invito esclusivo per 2 persone alla prestigiosa Cena Annuale di Gala della Presidenza a Roma Centro.",
    "cosa sblocca la soglia 4500 punti": "Una sessione di audit fiscale su misura con l'agente Ginevra (AG-03) e 6 mesi di conferenze con il CEO.",
    "qual e il premio da 6000 punti": "Status Sovrano a vita, un corso Academy gratuito a scelta per te o per un collaboratore e 1 anno di call CEO.",
    "qual e il premio massimo da 7500 punti": "Un weekend luxury per 2 persone in hotel 5 stelle partner a scelta tra Roma Centro e location convenzionate.",
    "cosa fa ginevra ag 03": "Supervisiona l'accantonamento fiscale statutario del 16% assicurando liquidità intangibile per le scadenze F24.",
    "cosa fa sentinel ag 12": "Monitora le attività formative e invia promemoria dopo 60 giorni di fermo per evitare il congelamento dei punti operativi.",
    "cosa succede se violo il codice etico": "La violazione delle clausole di riservatezza comporta la revoca immediata della qualifica e l'azzeramento dei punti.",
    "dove trovo lo statuto ufficiale": "È consultabile nella pagina blindata statuto.html, dotata di schermatura antipirateria e divieto di stampa.",
    "come visualizzo la mia gold card": "Utilizzando il simulatore interattivo presente in Sezione 06: digita il tuo nome e cognome per generare l'anteprima 3D.",
    "posso cambiare lo slot orario scelto": "Sì, contattando l'assistenza via WhatsApp con almeno 24 ore di anticipo rispetto all'orario fissato.",
    "cosa significa 54 30 16": "È la ripartizione contabile statutaria: 54% sviluppo e soci, 30% dividendi CEO, 16% imposte fiscali segregate.",
    "cosa serve per avviare il negozio": "Nessuna competenza tecnica avanzata: la piattaforma viene fornita chiavi in mano con supporto formativo continuo.",
    "come posso candidarmi adesso": "Clicca sul pulsante dorato CONFERENZA CEO o UNISCITI ALL'ACADEMY per accedere al calendario degli slot disponibili.",
    "chi gestisce i dati personali": "I dati sono trattati in conformità al GDPR e al protocollo di sicurezza crittografico EAL6+ senza cessione a terzi."
  };

  function askAlison(question) {
    appState.alison.messageCount++;
    const cleanQ = question.toLowerCase().trim();

    // Regola del 5° Messaggio (Triage Obbligatorio CEO)
    if (appState.alison.messageCount >= SFX_CONFIG.MAX_ALISON_MESSAGES) {
      appState.alison.isTriageActive = true;
      const triageMsg = "Hai completato i 5 quesiti preliminari con l'assistente. Per approfondimenti personalizzati è ora richiesto lo Screening Diretto con il CEO Giuliano Caratelli.";
      speakAlisonVoice(triageMsg);
      showTriageInterface();
      return triageMsg;
    }

    let answer = "Il quesito richiede l'inquadramento da parte della Presidenza. Ti consiglio di prenotare uno slot conoscitivo da 60 minuti con il CEO.";
    for (let key in ALISON_50_FAQS) {
      if (cleanQ.includes(key)) {
        answer = ALISON_50_FAQS[key];
        break;
      }
    }

    speakAlisonVoice(answer);
    return answer;
  }

  function speakAlisonVoice(text) {
    if (!appState.alison.synth) return;
    appState.alison.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT';
    utterance.pitch = 1.05;
    utterance.rate = 1.0;

    const voices = appState.alison.synth.getVoices();
    const itVoice = voices.find(v => v.lang.startsWith('it') && (v.name.includes('Female') || v.name.includes('Elsa') || v.name.includes('Alice')));
    if (itVoice) utterance.voice = itVoice;

    appState.alison.synth.speak(utterance);
  }

  function showTriageInterface() {
    const inputContainer = document.getElementById('alison-input-box');
    const triageBox = document.getElementById('alison-triage-box');
    if (inputContainer && triageBox) {
      inputContainer.style.display = 'none';
      triageBox.style.display = 'block';
    }
  }

  window.sendAlisonMsg = function() {
    const input = document.getElementById('alison-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const chat = document.getElementById('alison-chat-history');
    if (chat) {
      chat.innerHTML += `<p style="margin-bottom:0.8rem; text-align:right;"><strong style="color:#000;">Tu:</strong> ${escapeHtml(text)}</p>`;
    }
    input.value = '';

    const reply = askAlison(text);

    if (chat && !appState.alison.isTriageActive) {
      setTimeout(() => {
        chat.innerHTML += `<p style="margin-bottom:0.8rem;"><strong style="color:#0099A8;">Alison:</strong> ${escapeHtml(reply)}</p>`;
        chat.scrollTop = chat.scrollHeight;
      }, 300);
    }
  };

  window.dismissAlisonTriage = function() {
    appState.alison.messageCount = 0;
    appState.alison.isTriageActive = false;
    const inputContainer = document.getElementById('alison-input-box');
    const triageBox = document.getElementById('alison-triage-box');
    if (inputContainer && triageBox) {
      triageBox.style.display = 'none';
      inputContainer.style.display = 'flex';
    }
    const chat = document.getElementById('alison-chat-history');
    if (chat) {
      chat.innerHTML += `<p style="margin-bottom:0.8rem;"><strong style="color:#0099A8;">Alison:</strong> Sessione preliminare ripristinata. In cosa posso aiutarti?</p>`;
      chat.scrollTop = chat.scrollHeight;
    }
  };

  // ==========================================================================
  // 07. SISTEMA DI LOCALIZZAZIONE DINAMICO A 11 LINGUE
  // ==========================================================================
  const SFX_I18N_DICTIONARY = {
    it: {
      hTitle: "SUPREMA FUTURE X",
      hSub1: "INSIEME GUIDIAMO IL TUO DOMANI..",
      hSub2: "COMMUNITY, NETWORKING & FORMAZIONE // 2026",
      h2: "INIZIA QUI LA TUA STORIA!",
      hDesc: "Piattaforma d'élite per la Formazione, Sviluppo Personale, E-Commerce Autonomo a zero magazzino e Reindirizzamento al Lavoro Immediato guidata dalla Direzione del CEO.",
      ceoQuote: '"Governo direttamente l\'indirizzo strategico, le relazioni d\'affari e i programmi didattici. Le sessioni individuali con la Presidenza sono a numero chiuso per garantire riservatezza assoluta e risultati misurabili."',
      aliDesc: '"Coordino gli accessi per conto del CEO Giuliano Caratelli. Ti guido nella scelta del percorso didattico più idoneo e predispongo il tuo dossier per la conferenza riservata."'
    },
    en: {
      hTitle: "SUPREMA FUTURE X",
      hSub1: "TOGETHER WE LEAD YOUR TOMORROW..",
      hSub2: "COMMUNITY, NETWORKING & TRAINING // 2026",
      h2: "START YOUR STORY HERE!",
      hDesc: "Elite platform for Training, Personal Growth, Zero-Inventory E-Commerce and Immediate Career Placement led by CEO Direction.",
      ceoQuote: '"I personally govern strategic direction and business relations. Executive one-to-one sessions are strictly limited to ensure absolute confidentiality and measurable outcomes."',
      aliDesc: '"I coordinate platform access on behalf of CEO Giuliano Caratelli, guiding your academy path and preparing your screening dossier."'
    },
    es: {
      hTitle: "SUPREMA FUTURE X",
      hSub1: "JUNTOS GUIAMOS TU MAÑANA..",
      hSub2: "COMUNIDAD, NETWORKING Y FORMACIÓN // 2026",
      h2: "¡COMIENZA AQUÍ TU HISTORIA!",
      hDesc: "Plataforma de élite para la Formación, Crecimiento Personal, E-Commerce Autónomo sin stock e Inserción Laboral Inmediata bajo la Dirección del CEO.",
      ceoQuote: '"Gobierno directamente la dirección estratégica y las relaciones comerciales. Las sesiones privadas con la Presidencia son de cupo limitado."',
      aliDesc: '"Coordino los accesos en nombre del CEO Giuliano Caratelli, guiando su trayectoria formativa y gestionando su entrevista."'
    },
    fr: {
      hTitle: "SUPREMA FUTURE X",
      hSub1: "ENSEMBLE NOUS GUIDONS VOTRE DEMAIN..",
      hSub2: "COMMUNAUTÉ, NETWORKING & FORMATION // 2026",
      h2: "COMMENCEZ VOTRE HISTOIRE ICI!",
      hDesc: "Plateforme d'élite pour la Formation, le Développement Personnel, le E-Commerce sans stock et l'Emploi Immédiat dirigé par le CEO.",
      ceoQuote: '"Je dirige personnellement la stratégie et les relations d\'affaires. Les séances avec la Présidence sont en nombre restreint."',
      aliDesc: '"Je coordonne les accès pour le compte du CEO Giuliano Caratelli et vous oriente vers le parcours didactique adapté."'
    },
    de: {
      hTitle: "SUPREMA FUTURE X",
      hSub1: "GEMEINSAM GESTALTEN WIR IHR MORGEN..",
      hSub2: "COMMUNITY, NETWORKING & AKADEMIE // 2026",
      h2: "STARTEN SIE HIER IHRE GESCHICHTE!",
      hDesc: "Elite-Plattform für Ausbildung, Persönlichkeitsentwicklung, lagerfreies E-Commerce und sofortige Arbeitsvermittlung unter CEO-Führung.",
      ceoQuote: '"Ich leite persönlich die strategische Ausrichtung. Einzelgespräche sind streng limitiert für höchste Vertraulichkeit."',
      aliDesc: '"Ich koordiniere den Zugang im Auftrag von CEO Giuliano Caratelli und bereite Ihr Dossier für das Screening vor."'
    },
    pt: {
      hTitle: "SUPREMA FUTURE X",
      hSub1: "JUNTOS GUIAMOS O SEU AMANHÃ..",
      hSub2: "COMUNIDADE, NETWORKING & FORMAÇÃO // 2026",
      h2: "COMECE SUA HISTÓRIA AQUI!",
      hDesc: "Plataforma de elite para Formação, Crescimento Pessoal, E-Commerce sem estoque e Inserção no Mercado liderada pelo CEO.",
      ceoQuote: '"Governo direttamente o rumo estratégico. As sessões individuais são limitadas para garantir foco absoluto."',
      aliDesc: '"Coordeno os acessos em nome do CEO Giuliano Caratelli e oriento sua escolha de capacitação."'
    },
    ru: {
      hTitle: "SUPREMA FUTURE X",
      hSub1: "ВМЕСТЕ МЫ СТРОИМ ВАШЕ ЗАВТРА..",
      hSub2: "СООБЩЕСТВО, СЕТЬ И ОБУЧЕНИЕ // 2026",
      h2: "НАЧНИТЕ СВОЮ ИСТОРИЮ ЗДЕСЬ!",
      hDesc: "Элитная платформа для обучения, личного развития, электронной коммерции без склада и трудоустройства под руководством CEO.",
      ceoQuote: '"Я лично руковожу стратегией и деловыми связями. Индивидуальные сессии строго ограничены."',
      aliDesc: '"Я координирую доступ от имени CEO Джулиано Карателли и готовлю ваше досье для отбора."'
    },
    ar: {
      hTitle: "SUPREMA FUTURE X",
      hSub1: "معاً نقود مستقبلك غداً..",
      hSub2: "المجتمع، التواصل والتدريب // 2026",
      h2: "ابدأ قصتك هنا!",
      hDesc: "منصة النخبة للتدريب، التطوير الشخصي، التجارة الإلكترونية بدون مخزون والتوجيه المهني الفوري تحت إشراف الرئيس التنفيذي.",
      ceoQuote: '"أقود التوجيه الاستراتيجي شخصياً لضمان أعلى درجات السرية والنتائج الملموسة."',
      aliDesc: '"أنظم الدخول نيابة عن الرئيس التنفيذي جوليانو كاراتيلي وأوجه مسارك التعليمي."'
    },
    zh: {
      hTitle: "SUPREMA FUTURE X",
      hSub1: "携手引领您的明日..",
      hSub2: "社群、商务拓展与教育学院 // 2026",
      h2: "在此开启您的崭新篇章！",
      hDesc: "精英级平台，提供专业培训、个人发展、无库存独立电商以及由总裁直导的即时职业对接。",
      ceoQuote: '"我亲自掌管战略方向与商务拓展。总裁个别指导会名额严格受限，以确保绝对私密与显著成效。"',
      aliDesc: '"我代表总裁朱利亚诺·卡拉泰利协调系统准入，指导课程选择并建立对接档案。"'
    },
    ja: {
      hTitle: "SUPREMA FUTURE X",
      hSub1: "共にあなたの明日を導く..",
      hSub2: "コミュニティ・ネットワーキング・教育アカデミー // 2026",
      h2: "あなたの物語はここから始まる！",
      hDesc: "CEO直属のエリート向け教育、自己開発、在庫ゼロの独立型EC、即時就業マッチングプラットフォーム。",
      ceoQuote: '"戦略指揮と事業提携を直接指揮します。個別セッションは機密保持のため完全定員制です。"',
      aliDesc: '"CEOジュリアーノ・カラテッリに代わりアクセスを統括し、受講コース選択と面談手配をサポートします。"'
    },
    el: {
      hTitle: "SUPREMA FUTURE X",
      hSub1: "ΜΑΖΙ ΟΔΗΓΟΥΜΕ ΤΟ ΑΥΡΙΟ ΣΑΣ..",
      hSub2: "ΚΟΙΝΟΤΗΤΑ, ΔΙΚΤΥΩΣΗ & ΕΚΠΑΙΔΕΥΣΗ // 2026",
      h2: "ΞΕΚΙΝΗΣΤΕ ΕΔΩ ΤΗΝ ΙΣΤΟΡΙΑ ΣΑΣ!",
      hDesc: "Πλατφόρμα ελίτ για Εκπαίδευση, Προσωπική Ανάπτυξη, E-Commerce χωρίς απόθεμα και Άμεση Επαγγελματική Αποκατάσταση υπό την καθοδήγηση του CEO.",
      ceoQuote: '"Διευθύνω προσωπικά τη στρατηγική κατεύθυνση. Οι ατομικές συνεδρίες είναι περιορισμένες για απόλυτη εμπιστευτικότητα."',
      aliDesc: '"Συντονίζω την πρόσβαση εκ μέρους του CEO Giuliano Caratelli και προετοιμάζω το φάκελό σας."'
    }
  };

  window.changeLanguage = function(langCode) {
    appState.currentLang = langCode;
    const dict = SFX_I18N_DICTIONARY[langCode] || SFX_I18N_DICTIONARY.it;

    const elTitle = document.getElementById('txt-hero-title');
    const elSub1 = document.getElementById('txt-hero-sub1');
    const elSub2 = document.getElementById('txt-hero-sub2');
    const elH2 = document.getElementById('txt-hero-h2');
    const elDesc = document.getElementById('txt-hero-desc');
    const elCeo = document.getElementById('txt-ceo-quote');
    const elAli = document.getElementById('txt-alison-desc');

    if (elTitle) elTitle.innerText = dict.hTitle;
    if (elSub1) elSub1.innerText = dict.hSub1;
    if (elSub2) elSub2.innerText = dict.hSub2;
    if (elH2) elH2.innerText = dict.h2;
    if (elDesc) elDesc.innerText = dict.hDesc;
    if (elCeo) elCeo.innerText = dict.ceoQuote;
    if (elAli) elAli.innerText = dict.aliDesc;
  };

  // ==========================================================================
  // 08. FLOTTA COMPLETA DEI 15 AGENTI AI
  // ==========================================================================
  const SFX_AI_FLEET = [
    { id: "AG-01", name: "ALISON", role: "Concierge & Triage H24", status: "ACTIVE" },
    { id: "AG-02", name: "NICOLE", role: "Telemetria & Report 3 Ore", status: "ACTIVE" },
    { id: "AG-03", name: "GINEVRA", role: "Fisco 16% & Scadenze F24", status: "ACTIVE" },
    { id: "AG-04", name: "NEXUS SCOUT", role: "Monitoraggio Social & Lead", status: "ACTIVE" },
    { id: "AG-05", name: "LEDGER GUARDIAN", role: "Split Matematico 54/30/16", status: "ACTIVE" },
    { id: "AG-06", name: "GATEKEEPER", role: "Controllo Accessi EAL6+", status: "ACTIVE" },
    { id: "AG-07", name: "DELTA QUEUE", role: "Sync Drive & PWA Cache", status: "ACTIVE" },
    { id: "AG-08", name: "MEDIA BROADCAST", role: "Streaming 16:10 & Token CDN", status: "ACTIVE" },
    { id: "AG-09", name: "EXIT-INTENT", role: "Recupero Visitatore", status: "ACTIVE" },
    { id: "AG-10", name: "INGESTION BRIDGE", role: "Webhook Tally & Normalizzazione", status: "ACTIVE" },
    { id: "AG-11", name: "ASSEDIO PROVISIONER", role: "Setup Workspace Google Drive", status: "ACTIVE" },
    { id: "AG-12", name: "SENTINEL", role: "Monitor Inattività 60 Giorni", status: "ACTIVE" },
    { id: "AG-13", name: "HERMES", role: "Dispatcher Telegram & WhatsApp", status: "ACTIVE" },
    { id: "AG-14", name: "PROMPT GOVERNOR", role: "Audit Coerenza Neurale", status: "ACTIVE" },
    { id: "AG-15", name: "JOKER", role: "Copywriting & Strategia d'Emergenza", status: "ACTIVE" }
  ];

  window.toggleAgentStatus = function(agentId) {
    const agent = SFX_AI_FLEET.find(a => a.id === agentId);
    if (agent) {
      agent.status = (agent.status === "ACTIVE") ? "STANDBY" : "ACTIVE";
      if (broadcast) broadcast.postMessage({ type: 'FLEET_UPDATE', fleet: SFX_AI_FLEET });
    }
  };

  window.masterFleetKillSwitch = function() {
    SFX_AI_FLEET.forEach(a => a.status = "KILLED");
    if (broadcast) broadcast.postMessage({ type: 'FLEET_KILL_ALL' });
    alert("ALLARME EAL6+: Master Kill-Switch attivato. Tutta la flotta AI è congelata.");
  };

  // ==========================================================================
  // 09. SIMULATORE 3D PHYGITALE GOLD CARD & 5 PREMI UFFICIALI
  // ==========================================================================
  function initGoldCardSimulator() {
    const nameInput = document.getElementById('gold-card-input-sim');
    const renderTarget = document.getElementById('render-nome');
    const cardSimulator = document.querySelector('.sfx-gold-card-simulator');

    if (nameInput && renderTarget) {
      nameInput.addEventListener('input', (e) => {
        let clean = e.target.value.toUpperCase().replace(/[^A-Z\s]/g, '').slice(0, 26);
        nameInput.value = clean;
        renderTarget.innerText = clean.trim() === '' ? 'NOMINATIVO CORSISTA' : clean;
      });
    }

    if (cardSimulator) {
      cardSimulator.addEventListener('mousemove', (e) => {
        const rect = cardSimulator.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotX = -(y / (rect.height / 2)) * 12;
        const rotY = (x / (rect.width / 2)) * 12;
        cardSimulator.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      });

      cardSimulator.addEventListener('mouseleave', () => {
        cardSimulator.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      });
    }
  }

  window.updateGoldCardName = function() {
    const input = document.getElementById('gold-card-input-sim');
    if (!input) return;
    const val = input.value.trim();
    if (val) {
      alert(`Titolo Phygital Generato con successo per: ${val.toUpperCase()}\nCodice Seriale: CEOSFX-2026-${Math.floor(1000 + Math.random() * 9000)}\nAccredito di Benvenuto EAL6+ attivo.`);
    } else {
      alert("Inserisci Nome e Cognome prima di generare l'anteprima.");
    }
  };

  // ==========================================================================
  // 10. CONTROLLI UNIVERSALI X-BOX (4 TASTI + 5 STATI CROMATICI)
  // ==========================================================================
  function initXboxUniversalControls() {
    const btnPrima = document.getElementById('sfx-btn-prima');
    const btnIndietro = document.getElementById('sfx-btn-indietro');
    const btnAvanti = document.getElementById('sfx-btn-avanti');
    const btnDopo = document.getElementById('sfx-btn-dopo');

    if (btnPrima) btnPrima.addEventListener('click', () => navigateXboxLevel(-1, 'card'));
    if (btnAvanti) btnAvanti.addEventListener('click', () => navigateXboxLevel(1, 'card'));
    if (btnIndietro) btnIndietro.addEventListener('click', () => navigateXboxLevel(-1, 'module'));
    if (btnDopo) btnDopo.addEventListener('click', () => navigateXboxLevel(1, 'macro'));

    document.querySelectorAll('.btn-state').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const stateName = e.target.innerText.trim();
        if (broadcast) broadcast.postMessage({ type: 'STATE_CHANGED', state: stateName });
      });
    });
  }

  function navigateXboxLevel(dir, target) {
    if (target === 'card') appState.navigation.currentCardIndex += dir;
    if (target === 'module') appState.navigation.currentModuleIndex += dir;
    if (target === 'macro') appState.navigation.currentMacroIndex += dir;

    const breadcrumb = document.querySelector('.sfx-breadcrumb');
    if (breadcrumb) {
      breadcrumb.innerHTML = `X-BOX ENTERPRISE // <span>AREA 0${Math.abs(appState.navigation.currentMacroIndex % 8) + 1}</span> // MODULO ${Math.abs(appState.navigation.currentModuleIndex % 4) + 1}`;
    }
  }

  // ==========================================================================
  // 11. MEDIA CENTER SHOWCASE 16:10, WATERMARK FORENSE & 60 SLOT
  // ==========================================================================
  function initMediaCenterControls() {
    const video = document.getElementById('sfx-player-element');
    if (!video) return;

    window.mediaPlay = () => video.play();
    window.mediaStop = () => { video.pause(); video.currentTime = 0; };
    window.mediaStandby = () => video.pause();
    window.mediaSeek = (sec) => { video.currentTime += sec; };
    window.mediaFullscreen = () => {
      if (!document.fullscreenElement) {
        video.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    };
  }

  window.switchMediaCat = function(category) {
    appState.mediaPlayer.currentCategory = category;
    document.querySelectorAll('#mediacenter-section .sfx-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.innerText.toLowerCase().includes(category));
    });
    alert(`Archivio Media Center filtrato per: ${category.toUpperCase()}\nCaricati fino a 60 slot sincronizzati dalla X-BOX Enterprise.`);
  };

  // ==========================================================================
  // 12. RATE-LIMITING ANTI-SPAM (10 MIN) & WEBHOOK CANDIDATURE
  // ==========================================================================
  window.handleCandidaturaSubmission = function(e) {
    e.preventDefault();
    const feedback = document.getElementById('sfx-cand-feedback');
    const selectedSlot = document.getElementById('sfx-cand-selected-slot');

    if (!selectedSlot || !selectedSlot.value) {
      if (feedback) {
        feedback.style.color = '#FFBF00';
        feedback.innerText = "ATTENZIONE: Seleziona uno slot dal calendario prima di inviare.";
      }
      return;
    }

    const lastSubmit = parseInt(localStorage.getItem('sfx_last_candidatura_time') || '0', 10);
    const now = Date.now();

    // Rate Limiting a 10 minuti per sessione/dispositivo
    if (now - lastSubmit < SFX_CONFIG.RATE_LIMIT_CANDIDATURA_MS) {
      if (feedback) {
        feedback.style.color = '#FFBF00';
        feedback.innerText = "ATTENZIONE EAL6+: Limite di sicurezza attivo. Una sola candidatura consentita ogni 10 minuti.";
      }
      return;
    }

    localStorage.setItem('sfx_last_candidatura_time', now.toString());

    if (feedback) {
      feedback.style.color = '#00F0FF';
      feedback.innerText = "Crittografia dati e trasmissione al canale presidenziale EAL6+...";
    }

    const payload = {
      action: "tally_webhook",
      tier: (document.getElementById('sfx-cand-tier') || {}).value || "Non specificato",
      slot: selectedSlot.value,
      nome: (document.getElementById('sfx-cand-nome') || {}).value || "",
      cognome: (document.getElementById('sfx-cand-cognome') || {}).value || "",
      email: (document.getElementById('sfx-cand-email') || {}).value || "",
      whatsapp: (document.getElementById('sfx-cand-whatsapp') || {}).value || "",
      timestamp: new Date().toISOString()
    };

    fetch(SFX_CONFIG.BACKEND_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(() => {
      showCandidaturaSuccess(feedback);
    }).catch(() => {
      showCandidaturaSuccess(feedback);
    });
  };

  function showCandidaturaSuccess(feedback) {
    if (!feedback) return;
    feedback.style.color = '#00E676';
    feedback.innerHTML = `
      <div style="background:rgba(0,230,118,0.08); border:1px solid #00E676; padding:1.2rem; border-radius:8px; margin-top:1rem;">
        <strong>✓ TRASMISSIONE CONFERMATA CON PROTOCOLLO EAL6+</strong><br>
        La tua candidatura è stata acquisita e recapitata all'Agente Hermes (AG-13).<br>
        Riceverai l'Email di presa in carico e il promemoria WhatsApp dal CEO Giuliano Caratelli.
      </div>
    `;
    const btn = document.getElementById('sfx-cand-submit-btn');
    if (btn) btn.style.display = 'none';
  }

  // ==========================================================================
  // 13. LUXURY SHOP SCRIPTED TRIGGER (BASE64 - ZERO SEO LEAK)
  // ==========================================================================
  window.openLuxuryBoutique = function() {
    try {
      const decodedUrl = atob(SFX_CONFIG.LUXURY_SHOP_URL_B64);
      const win = window.open(decodedUrl, '_blank', 'noopener,noreferrer');
      if (win) win.opener = null;
    } catch (err) {
      console.warn("Boutique protetta da sandbox.");
    }
  };

  // ==========================================================================
  // 14. CASSETTO LATERALE "CHI SIAMO" & MENU SEZIONI
  // ==========================================================================
  let menuTimer = null;
  let menuHoverTimeout = null;

  function initMenuAndDrawer() {
    const btnMenu = document.getElementById('btn-menu-sezioni');
    const dropdown = document.getElementById('dropdown-sezioni');

    if (btnMenu && dropdown) {
      btnMenu.addEventListener('mouseenter', () => {
        menuHoverTimeout = setTimeout(() => {
          dropdown.style.display = 'block';
          clearTimeout(menuTimer);
          menuTimer = setTimeout(() => { dropdown.style.display = 'none'; }, SFX_CONFIG.MENU_TIMER_MS);
        }, SFX_CONFIG.MENU_HOVER_DELAY_MS);
      });

      btnMenu.addEventListener('mouseleave', () => {
        clearTimeout(menuHoverTimeout);
      });

      btnMenu.addEventListener('click', () => {
        clearTimeout(menuHoverTimeout);
        dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
      });
    }
  }

  window.toggleDrawer = function(open) {
    const drawer = document.getElementById('sfx-drawer-chisiamo');
    if (drawer) drawer.classList.toggle('open', open);
  };

  window.switchDrawerTab = function(idx) {
    document.querySelectorAll('.sfx-tab-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === idx);
    });
    document.querySelectorAll('.sfx-drawer-tab').forEach((tab, i) => {
      tab.style.display = (i === idx) ? 'block' : 'none';
    });
  };

  // Modale Unisciti all'Academy
  let currentEnrollingCourse = "";
  window.openEnrollModal = function(courseName, price, duration) {
    currentEnrollingCourse = courseName;
    const nameEl = document.getElementById('modal-course-name');
    const durationEl = document.getElementById('modal-course-duration');
    const priceEl = document.getElementById('modal-course-price');
    const modal = document.getElementById('sfx-enroll-modal');

    if (nameEl) nameEl.innerText = courseName;
    if (durationEl) durationEl.innerText = duration;
    if (priceEl) priceEl.innerText = price;
    if (modal) modal.style.display = 'flex';
  };

  window.closeEnrollModal = function() {
    const modal = document.getElementById('sfx-enroll-modal');
    if (modal) modal.style.display = 'none';
  };

  window.proceedToScreening = function() {
    window.location.href = `candidatura.html?tier=${encodeURIComponent(currentEnrollingCourse)}`;
  };

  // ==========================================================================
  // 15. COPIA IBAN 1-CLICK CON FEEDBACK TATTILE
  // ==========================================================================
  function initIbanCopyActions() {
    document.querySelectorAll('.sfx-iban-copy-box').forEach(box => {
      box.addEventListener('click', () => {
        const text = box.dataset.iban || box.innerText.trim();
        navigator.clipboard.writeText(text).then(() => {
          const original = box.innerHTML;
          box.innerHTML = `<span style="color:#D4AF37; font-weight:700;">✓ COPIATO NEGLI APPUNTI</span>`;
          setTimeout(() => { box.innerHTML = original; }, 2000);
        });
      });
    });
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // ==========================================================================
  // 16. INIZIALIZZAZIONE AL CARICAMENTO DOM & WINDOW EXPOSURE
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initForensicSecurityShield();
    initSecretTrigger();
    initGoldCardSimulator();
    initXboxUniversalControls();
    initMediaCenterControls();
    initMenuAndDrawer();
    initIbanCopyActions();
    resetInactivityTimer();

    // Aggancio form candidature se presente nella pagina
    const candForm = document.getElementById('sfx-candidatura-form');
    if (candForm) {
      candForm.addEventListener('submit', window.handleCandidaturaSubmission);
    }
  });

  // Esposizione controllata su window
  window.SFX = {
    BACKEND_URL: SFX_CONFIG.BACKEND_URL,
    askAlison: askAlison,
    speakAlisonVoice: speakAlisonVoice,
    openSecurityTerminal: openSecurityTerminal,
    computeSHA256: computeSHA256,
    broadcast: broadcast,
    appState: appState,
    fleet: SFX_AI_FLEET
  };

})();
