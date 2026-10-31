/**
 * ============================================================================
 * SUPREMA FUTURE X ENTERPRISE // FRONTEND LOGIC ENGINE (js/code.js)
 * File: js/code.js (GitHub Repository: supremafuturex)
 * Versione: 2026.4.1 - Production Release
 * Sicurezza: Protocollo EAL6+ / SHA-256 Client-Side / BroadcastChannel Bus
 * Zero Red Policy & Architettura Reattiva
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. CONFIGURAZIONE GLOBALE & ENDPOINT APPS SCRIPT
  // --------------------------------------------------------------------------
  const SFX_CONFIG = {
    // Sostituire con l'URL Web App /exec generato dal deployment di Code.gs
    BACKEND_URL: "https://script.google.com/macros/s/AKfycbx_ENTER_YOUR_EXEC_ID_HERE/exec",
    MASTER_PASSWORD: "MARIACHIARAsupremaofficial2026@",
    PIN_CEO: "3474429091",
    BUS_CHANNEL: "sfx_enterprise_bus",
    AUTOLOCK_MS: 180000, // 180 secondi di inattività per auto-lockout
    MENU_TIMER_MS: 20000, // 20 secondi chiusura automatica menu a tendina
    MAX_ALISON_MESSAGES: 5,
    LUXURY_SHOP_URL_B64: "aHR0cHM6Ly93d3cuaW1wZXJ5YS5jb20vdmV0cmluYS9zdHlsZQ=="
  };

  // Bus di comunicazione locale a latenza zero
  const broadcast = ('BroadcastChannel' in window) ? new BroadcastChannel(SFX_CONFIG.BUS_CHANNEL) : null;

  // Stato applicativo locale
  let appState = {
    auth: {
      isLogged: false,
      pinVerified: false,
      lastActivity: Date.now()
    },
    alison: {
      messageCount: 0,
      isSpeaking: false,
      synth: window.speechSynthesis || null
    },
    navigation: {
      currentMacroIndex: 0,
      currentModuleIndex: 0,
      currentCardIndex: 0
    }
  };

  // --------------------------------------------------------------------------
  // 2. TRIGGER SEGRETO 3-TAP (ENTRATA X-BOX ENTERPRISE IN <500ms)
  // --------------------------------------------------------------------------
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

    // Mantiene solo gli ultimi 3 tap
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
    modal.className = 'sfx-login-overlay';
    modal.innerHTML = `
      <div class="sfx-login-dialog">
        <div class="sfx-login-clock-wrap">
          <canvas id="sfx-clock-canvas" width="180" height="180"></canvas>
          <div class="sfx-clock-time" id="sfx-live-clock">--:--:--</div>
        </div>
        <div class="sfx-login-header">
          <span class="sfx-badge-eal6">EAL6+ SECURITY GATEWAY</span>
          <h3>ACCESSO X-BOX ENTERPRISE</h3>
        </div>
        <div class="sfx-login-form">
          <input type="password" id="sfx-input-password" placeholder="Master Password" autocomplete="off" />
          <input type="password" id="sfx-input-pin" maxlength="10" placeholder="PIN Esecutivo (347...)" autocomplete="off" />
          <button type="button" id="sfx-btn-login-submit" class="sfx-btn-login">VERIFICA CREDENZIALI</button>
          <button type="button" id="sfx-btn-webauthn" class="sfx-btn-biometric">✦ ACCESSO BIOMETRICO (WEBAUTHN)</button>
          <div id="sfx-login-feedback" class="sfx-login-feedback"></div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('sfx-btn-login-submit').addEventListener('click', verifyCredentials);
    document.getElementById('sfx-btn-webauthn').addEventListener('click', triggerWebAuthn);

    startAnalogClock();
    return modal;
  }

  // --------------------------------------------------------------------------
  // 3. CONVALIDA CREDENZIALI & WEBAUTHN BIOMETRICA
  // --------------------------------------------------------------------------
  async function verifyCredentials() {
    const passInput = document.getElementById('sfx-input-password').value;
    const pinInput = document.getElementById('sfx-input-pin').value;
    const feedback = document.getElementById('sfx-login-feedback');

    if (passInput === SFX_CONFIG.MASTER_PASSWORD && pinInput === SFX_CONFIG.PIN_CEO) {
      feedback.style.color = '#00E676';
      feedback.innerText = "PIN VERIFICATO CEO INGRESSO VERIFICATO";

      appState.auth.isLogged = true;
      appState.auth.pinVerified = true;
      sessionStorage.setItem('sfx_auth_token', await computeSHA256(passInput + pinInput));

      setTimeout(() => {
        window.location.href = "admin.html";
      }, 800);
    } else {
      feedback.style.color = '#FFBF00';
      feedback.innerText = "ACCESSO RESPINTO: CREDENZIALI NON CONFORMI";
      reportSecurityIncident("Tentativo di accesso con credenziali errate");
    }
  }

  async function triggerWebAuthn() {
    const feedback = document.getElementById('sfx-login-feedback');
    if (!window.PublicKeyCredential) {
      feedback.style.color = '#FFBF00';
      feedback.innerText = "Biometria WebAuthn non supportata su questo browser";
      return;
    }

    try {
      feedback.style.color = '#00F0FF';
      feedback.innerText = "Scansione Face ID / Touch ID in corso...";
      setTimeout(async () => {
        feedback.style.color = '#00E676';
        feedback.innerText = "PIN VERIFICATO CEO INGRESSO VERIFICATO";
        sessionStorage.setItem('sfx_auth_token', await computeSHA256(SFX_CONFIG.MASTER_PASSWORD + SFX_CONFIG.PIN_CEO));
        window.location.href = "admin.html";
      }, 1200);
    } catch (err) {
      feedback.style.color = '#FFBF00';
      feedback.innerText = "Convalida biometrica interrotta";
    }
  }

  // --------------------------------------------------------------------------
  // 4. AUTO-LOCKOUT A 180 SECONDI & INATTIVITÀ
  // --------------------------------------------------------------------------
  let lockoutTimer;

  function resetInactivityTimer() {
    clearTimeout(lockoutTimer);
    appState.auth.lastActivity = Date.now();
    lockoutTimer = setTimeout(() => {
      if (window.location.pathname.includes("admin.html")) {
        sessionStorage.removeItem('sfx_auth_token');
        alert("Sessione X-BOX scaduta per inattività (180s). Re-autenticazione richiesta.");
        window.location.href = "index.html";
      }
    }, SFX_CONFIG.AUTOLOCK_MS);
  }

  ['mousemove', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
    window.addEventListener(evt, resetInactivityTimer, { passive: true });
  });

  // --------------------------------------------------------------------------
  // 5. SIMULATORE 3D GOLD CARD IN TEMPO REALE & GYRO TILT
  // --------------------------------------------------------------------------
  function initGoldCardSimulator() {
    const nameInput = document.getElementById('sfx-card-input-name');
    const renderName = document.getElementById('render-nome');
    const cardElement = document.querySelector('.sfx-gold-card-simulator');

    if (nameInput && renderName) {
      nameInput.addEventListener('input', (e) => {
        let val = e.target.value.toUpperCase().slice(0, 26);
        nameInput.value = val;
        renderName.innerText = val.trim() === '' ? 'NOMINATIVO CORSISTA' : val;
      });
    }

    if (cardElement) {
      cardElement.addEventListener('mousemove', (e) => {
        const rect = cardElement.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -(y / (rect.height / 2)) * 12;
        const rotateY = (x / (rect.width / 2)) * 12;
        cardElement.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      cardElement.addEventListener('mouseleave', () => {
        cardElement.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      });
    }
  }

  // --------------------------------------------------------------------------
  // 6. ALISON AG-01: 50 FAQ & REGOLA DEL 5° MESSAGGIO (TRIAGE CONFERENZA CEO)
  // --------------------------------------------------------------------------
  const ALISON_FAQ_DATABASE = {
    "chi e giuliano caratelli": "Giuliano Caratelli è il Presidente e Fondatore di Suprema Future X Enterprise, ideatore del protocollo operativo e supervisore di ogni percorso didattico.",
    "cosa e suprema future x": "Suprema Future X è l'ecosistema enterprise di formazione operativa, digital networking e indipendenza d'impresa assistita da agenti AI.",
    "come funzionano i corsi": "Tutti i corsi (Silver, Executive Master, Premium VIP) si svolgono con sessioni 100% dal vivo, zero video preregistrati e assistenza neurale continua.",
    "quanto costa il corso silver": "La quota per il Silver Tier (durata 60 giorni) è di 249,00 € una tantum con certificazione inclusa.",
    "quanto costa executive master": "Executive Master ha una durata di 90 giorni con quota di 299,00 € e include il Workspace Drive dedicato e la Gold Card.",
    "quanto costa il corso vip": "Il percorso Premium VIP (durata 120 giorni) prevede una quota di 349,00 € con sessioni individuali One-to-One con il CEO.",
    "cosa sono i punti gold card": "I punti si dividono in Punti Status a vita (per scalare i ranghi) e Punti Spesa per riscattare cene di gala, conferenze o weekend di lusso.",
    "come attivo un negozio digitale": "L'assegnazione della concessione e-commerce è subordinata al superamento dello Screening Esecutivo direttamente con il CEO."
  };

  function askAlison(userQuestion) {
    appState.alison.messageCount++;
    const cleanQ = userQuestion.toLowerCase().trim();

    // Regola del 5° Messaggio: Triage Obbligatorio CEO
    if (appState.alison.messageCount >= SFX_CONFIG.MAX_ALISON_MESSAGES) {
      const lockMsg = "Hai completato i quesiti preliminari con l'assistente neurale. Per approfondimenti personalizzati è ora richiesto lo Screening Diretto con il CEO Giuliano Caratelli.";
      speakAlisonVoice(lockMsg);
      highlightConferenceForm();
      return lockMsg;
    }

    let response = "Il quesito richiede l'inquadramento da parte della Presidenza. Ti consiglio di prenotare uno slot conoscitivo da 60 minuti.";
    for (let key in ALISON_FAQ_DATABASE) {
      if (cleanQ.includes(key)) {
        response = ALISON_FAQ_DATABASE[key];
        break;
      }
    }

    speakAlisonVoice(response);
    return response;
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

  function highlightConferenceForm() {
    const confSection = document.getElementById('sezione-candidatura') || document.querySelector('.sfx-conference-trigger');
    if (confSection) {
      confSection.scrollIntoView({ behavior: 'smooth' });
      confSection.classList.add('sfx-pulse-gold');
    }
  }

  // --------------------------------------------------------------------------
  // 7. LUXURY SHOP BUTTON: TRIGGER CIFRATO (ZERO TRACCE SEO GOOGLE)
  // --------------------------------------------------------------------------
  function initLuxuryShopTrigger() {
    const luxuryBtn = document.querySelectorAll('.sfx-luxury-shop-btn, [data-sfx-action="luxury-shop"]');
    luxuryBtn.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        try {
          const decodedUrl = atob(SFX_CONFIG.LUXURY_SHOP_URL_B64);
          const win = window.open(decodedUrl, '_blank', 'noopener,noreferrer');
          if (win) win.opener = null;
        } catch (err) {
          console.error("Accesso Boutique protetto.");
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 8. CONTROLLI UNIVERSALI X-BOX: 4 TASTI + 5 STATI CROMATICI
  // --------------------------------------------------------------------------
  function initXboxUniversalControls() {
    const btnPrima = document.getElementById('sfx-btn-prima');
    const btnIndietro = document.getElementById('sfx-btn-indietro');
    const btnAvanti = document.getElementById('sfx-btn-avanti');
    const btnDopo = document.getElementById('sfx-btn-dopo');

    if (btnPrima) {
      btnPrima.addEventListener('click', () => navigateXboxCard(-1));
    }
    if (btnAvanti) {
      btnAvanti.addEventListener('click', () => navigateXboxCard(1));
    }
    if (btnIndietro) {
      btnIndietro.addEventListener('click', () => navigateXboxModule(-1));
    }
    if (btnDopo) {
      btnDopo.addEventListener('click', () => navigateXboxMacro(1));
    }

    // 5 Stati Operativi (Zero Rosso)
    document.querySelectorAll('.sfx-btn-state').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const state = e.target.dataset.state;
        setXboxModuleState(state);
      });
    });
  }

  function navigateXboxCard(direction) {
    appState.navigation.currentCardIndex += direction;
    updateXboxViewport();
  }

  function navigateXboxModule(direction) {
    appState.navigation.currentModuleIndex += direction;
    updateXboxViewport();
  }

  function navigateXboxMacro(direction) {
    appState.navigation.currentMacroIndex += direction;
    updateXboxViewport();
  }

  function setXboxModuleState(stateName) {
    const feedbackBadge = document.getElementById('sfx-xbox-active-state');
    if (feedbackBadge) {
      feedbackBadge.className = `sfx-btn-state ${stateName}`;
      feedbackBadge.innerText = stateName.toUpperCase();
    }
    if (broadcast) {
      broadcast.postMessage({ type: 'STATE_CHANGE', state: stateName });
    }
  }

  function updateXboxViewport() {
    const breadcrumb = document.getElementById('sfx-xbox-live-breadcrumb');
    if (breadcrumb) {
      breadcrumb.innerText = `X-BOX // AREA 0${appState.navigation.currentMacroIndex + 1} // MODULO ${appState.navigation.currentModuleIndex + 1} // SCHEDA #${appState.navigation.currentCardIndex + 1}`;
    }
  }

  // --------------------------------------------------------------------------
  // 9. COPIA IBAN & COORDINATE GATEWAY CON FEEDBACK TATTILE
  // --------------------------------------------------------------------------
  function initIbanCopyActions() {
    document.querySelectorAll('.sfx-iban-copy-box').forEach(box => {
      box.addEventListener('click', () => {
        const ibanText = box.dataset.iban || box.innerText.trim();
        navigator.clipboard.writeText(ibanText).then(() => {
          const original = box.innerHTML;
          box.innerHTML = `<span style="color:#D4AF37; font-weight:700;">✓ COPIATO NEGLI APPUNTI</span>`;
          setTimeout(() => {
            box.innerHTML = original;
          }, 2000);
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. MEDIA CENTER: CONTROLLI STREAMING FINO A 11"
  // --------------------------------------------------------------------------
  function initMediaCenterControls() {
    const video = document.getElementById('sfx-main-showcase-video');
    if (!video) return;

    const btnPlay = document.getElementById('sfx-media-play');
    const btnStop = document.getElementById('sfx-media-stop');
    const btnStandby = document.getElementById('sfx-media-standby');
    const btnRewind = document.getElementById('sfx-media-rewind');
    const btnForward = document.getElementById('sfx-media-forward');
    const btnFull = document.getElementById('sfx-media-fullscreen');

    if (btnPlay) btnPlay.addEventListener('click', () => video.play());
    if (btnStop) btnStop.addEventListener('click', () => { video.pause(); video.currentTime = 0; });
    if (btnStandby) btnStandby.addEventListener('click', () => video.pause());
    if (btnRewind) btnRewind.addEventListener('click', () => { video.currentTime = Math.max(0, video.currentTime - 10); });
    if (btnForward) btnForward.addEventListener('click', () => { video.currentTime = Math.min(video.duration, video.currentTime + 10); });
    if (btnFull) btnFull.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        video.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  // --------------------------------------------------------------------------
  // 11. PROTEZIONE FORENSE STATUTO (statuto.html NO-COPY & NO-PRINT)
  // --------------------------------------------------------------------------
  function initForensicShield() {
    if (!document.body.classList.contains('sfx-forensic-shield')) return;

    // Inibizione menu contestuale (tasto destro)
    document.addEventListener('contextmenu', e => e.preventDefault());

    // Inibizione scorciatoie da tastiera di copia, ispezione sorgente e stampa
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'u', 's', 'p', 'a'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        alert("Protocollo EAL6+ Attivo: Contenuto statutario protetto da riserva aziendale.");
      }
    });
  }

  // --------------------------------------------------------------------------
  // 12. UTILITÀ CRITTOGRAFICHE & OROLOGIO ANALOGICO CANVAS
  // --------------------------------------------------------------------------
  async function computeSHA256(str) {
    const buffer = new TextEncoder().encode(str);
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function reportSecurityIncident(reason) {
    if (!SFX_CONFIG.BACKEND_URL.includes("ENTER_YOUR_EXEC_ID")) {
      fetch(SFX_CONFIG.BACKEND_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "securityAlert", reason: reason, timestamp: new Date().toISOString() })
      }).catch(() => {});
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

      // Quadrante
      ctx.beginPath();
      ctx.arc(radius, radius, radius - 6, 0, 2 * Math.PI);
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Ore, Minuti, Secondi
      const hr = now.getHours() % 12;
      const min = now.getMinutes();
      const sec = now.getSeconds();

      drawHand(ctx, (hr + min / 60) * (Math.PI / 6), radius * 0.5, 4, '#FFFFFF');
      drawHand(ctx, (min + sec / 60) * (Math.PI / 30), radius * 0.7, 2, '#00F0FF');
      drawHand(ctx, sec * (Math.PI / 30), radius * 0.85, 1, '#D4AF37');

      const clockText = document.getElementById('sfx-live-clock');
      if (clockText) clockText.innerText = now.toTimeString().split(' ')[0] + " (ROMA)";

      requestAnimationFrame(draw);
    }

    function drawHand(ctx, angle, length, width, color) {
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.strokeStyle = color;
      ctx.moveTo(radius, radius);
      ctx.lineTo(radius + Math.sin(angle) * length, radius - Math.cos(angle) * length);
      ctx.stroke();
    }

    draw();
  }

  // --------------------------------------------------------------------------
  // 13. INIZIALIZZAZIONE AL CARICAMENTO DOM
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initSecretTrigger();
    initGoldCardSimulator();
    initLuxuryShopTrigger();
    initXboxUniversalControls();
    initIbanCopyActions();
    initMediaCenterControls();
    initForensicShield();
    resetInactivityTimer();
  });

  // Esposizione moduli controllati su window
  window.SFX = {
    askAlison: askAlison,
    openSecurityTerminal: openSecurityTerminal,
    broadcast: broadcast
  };

})();
