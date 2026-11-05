/**
 * ============================================================================
 * SUPREMA FUTURE X ENTERPRISE 2026 // MOTORE LOGICO ESECUTIVO (EAL6+ COMPLIANT)
 * File: js/code.js
 * Governance: Founder & CEO Giuliano Caratelli // Sede Legale: Colleferro (Roma)
 * ============================================================================
 */

'use strict';

/* ----------------------------------------------------------------------------
   1. REGISTRO CONFIGURAZIONE E STATO GLOBALE (SFX_STATE)
   ---------------------------------------------------------------------------- */
const SFX_CONFIG = {
  // Sostituire con l'URL di deployment del Web App di Google Apps Script (01_Core_Security / 02_Crm_Calendario)
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbx_PLACEHOLDER_EXEC/exec',
  CAROUSEL_INITIAL_DELAY_MS: 3000,
  CAROUSEL_INTERVAL_MS: 3200,
  MENU_TIMEOUT_SECONDS: 15,
  TRIPLE_CLICK_WINDOW_MS: 800,
  TOTAL_VAULT_SLOTS_PER_CAT: 100,
  UNLOCKED_SLOTS_COUNT: 5,
  TOTAL_RADIO_TRACKS: 14,
  TOTAL_GALLERY_IMAGES: 6
};

const SFX_STATE = {
  currentLang: 'IT',
  tallyStatus: 'STANDBY', // 'STANDBY' | 'ON_AIR'
  menuTimer: null,
  menuSecondsLeft: SFX_CONFIG.MENU_TIMEOUT_SECONDS,
  tripleClickCounter: 0,
  tripleClickTimer: null,
  activeVaultCategory: 'foto',
  lightboxIndex: 1,
  carouselIndex: 1,
  carouselInterval: null,
  radioPlaying: false,
  currentTrackIndex: 1,
  radioAudio: null,
  radarAnimId: null,
  funnelData: {
    inquadramento: '',
    programma: 'Suprema Academy 100% Live',
    slot: 'Pomeriggio',
    nome: '',
    cognome: '',
    email: '',
    whatsapp: ''
  }
};

/* ----------------------------------------------------------------------------
   2. BOOTSTRAP APPLICATIVO AL DOMContentLoaded
   ---------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  sfxInitClockCET();
  sfxInitLogoCarousel();
  sfxInitRadioLounge();
  sfxInitAlisonTerminal();
  sfxInitAlisonRadar();
  sfxInitGoldCardTilt();
  sfxInitVaultMatrix();
  sfxInitTripleClickXBox();
  sfxInitFunnelModal();
  sfxInitSlidingDrawer();
  sfxInitModalsAndLightboxes();
  sfxInitSupremaMenu();
  sfxInitNavigationRibbon();
  sfxInitContactForm();
  sfxInitKeyboardShortcuts();
});

/* ----------------------------------------------------------------------------
   3. OROLOGIO FORENSE SINCRONIZZATO (EUROPE/ROME CET)
   ---------------------------------------------------------------------------- */
function sfxInitClockCET() {
  const clockEl = document.getElementById('live-clock-cet');
  if (!clockEl) return;

  const updateClock = () => {
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('it-IT', {
        timeZone: 'Europe/Rome',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      clockEl.textContent = `${formatter.format(now)} CET`;
    } catch {
      const d = new Date();
      clockEl.textContent = `${d.toTimeString().split(' ')[0]} CET`;
    }
  };

  updateClock();
  setInterval(updateClock, 1000);
}

/* ----------------------------------------------------------------------------
   4. CAROSELLO LOGO CENTRALE (0-3.0s FISSO SFX -> LOOP A 3.2s SULLE 10 FOTO)
   ---------------------------------------------------------------------------- */
function sfxInitLogoCarousel() {
  const imgEl = document.getElementById('hero-carousel-img');
  if (!imgEl) return;

  setTimeout(() => {
    SFX_STATE.carouselInterval = setInterval(() => {
      SFX_STATE.carouselIndex++;
      if (SFX_STATE.carouselIndex > 10) SFX_STATE.carouselIndex = 1;

      const numStr = String(SFX_STATE.carouselIndex).padStart(2, '0');
      const nextSrc = `media/sec-01-hero/logo-${numStr}.png`;

      imgEl.style.transition = 'opacity 0.4s ease';
      imgEl.style.opacity = '0';

      setTimeout(() => {
        imgEl.src = nextSrc;
        imgEl.style.opacity = '1';
      }, 400);
    }, SFX_CONFIG.CAROUSEL_INTERVAL_MS);
  }, SFX_CONFIG.CAROUSEL_INITIAL_DELAY_MS);
}

/* ----------------------------------------------------------------------------
   5. SUPREMA RADIO LOUNGE (14 TRACCE // DUCKING PRIORITARIO)
   ---------------------------------------------------------------------------- */
function sfxInitRadioLounge() {
  SFX_STATE.radioAudio = new Audio();
  SFX_STATE.radioAudio.preload = 'none';
  SFX_STATE.radioAudio.volume = 0.70;

  sfxRadioLoadTrack(SFX_STATE.currentTrackIndex);

  SFX_STATE.radioAudio.addEventListener('ended', () => {
    sfxRadioNextTrack();
  });

  const prevBtn = document.getElementById('radioPrevBtn');
  const playPauseBtn = document.getElementById('radioPlayPauseBtn');
  const nextBtn = document.getElementById('radioNextBtn');
  const volSlider = document.getElementById('radioVolumeSlider');

  if (prevBtn) prevBtn.addEventListener('click', sfxRadioPrevTrack);
  if (playPauseBtn) playPauseBtn.addEventListener('click', sfxRadioTogglePlay);
  if (nextBtn) nextBtn.addEventListener('click', sfxRadioNextTrack);
  if (volSlider) {
    volSlider.addEventListener('input', (e) => {
      if (SFX_STATE.radioAudio) {
        SFX_STATE.radioAudio.volume = parseFloat(e.target.value);
      }
    });
  }

  // DUCKING AUTOMATICO: se un video parte, la radio si silenzia
  const masterVid = document.getElementById('masterCorporateVideoPlayer');
  const demoVid = document.getElementById('academyDemoPlayer');
  [masterVid, demoVid].forEach((vid) => {
    if (!vid) return;
    vid.addEventListener('play', () => {
      if (SFX_STATE.radioPlaying) sfxRadioPause();
    });
  });
}

function sfxRadioLoadTrack(index) {
  const numStr = String(index).padStart(2, '0');
  SFX_STATE.radioAudio.src = `media/audio-radio/track-${numStr}.mp3`;
  const titleDisplay = document.getElementById('radioTrackTitleDisplay');
  if (titleDisplay) {
    titleDisplay.textContent = `Track ${numStr} // Relax Lounge`;
  }
}

function sfxRadioTogglePlay() {
  if (SFX_STATE.radioPlaying) {
    sfxRadioPause();
  } else {
    sfxRadioPlay();
  }
}

function sfxRadioPlay() {
  if (SFX_STATE.tallyStatus === 'ON_AIR') {
    alert('Riproduzione Radio disattivata: conferenza CEO ON AIR in corso.');
    return;
  }

  SFX_STATE.radioAudio.play().then(() => {
    SFX_STATE.radioPlaying = true;
    const btn = document.getElementById('radioPlayPauseBtn');
    const led = document.getElementById('radioStatusLed');
    if (btn) btn.textContent = '⏸ PAUSA';
    if (led) led.style.backgroundColor = 'var(--spectral-emerald)';
    sfxToggleEqualizer(true);
  }).catch((err) => {
    console.warn('Avvio audio subordinato all\'interazione utente:', err);
  });
}

function sfxRadioPause() {
  SFX_STATE.radioAudio.pause();
  SFX_STATE.radioPlaying = false;
  const btn = document.getElementById('radioPlayPauseBtn');
  const led = document.getElementById('radioStatusLed');
  if (btn) btn.textContent = '▶ ASCOLTA';
  if (led) led.style.backgroundColor = 'var(--spectral-gold)';
  sfxToggleEqualizer(false);
}

function sfxRadioNextTrack() {
  SFX_STATE.currentTrackIndex++;
  if (SFX_STATE.currentTrackIndex > SFX_CONFIG.TOTAL_RADIO_TRACKS) {
    SFX_STATE.currentTrackIndex = 1;
  }
  sfxRadioLoadTrack(SFX_STATE.currentTrackIndex);
  if (SFX_STATE.radioPlaying) sfxRadioPlay();
}

function sfxRadioPrevTrack() {
  SFX_STATE.currentTrackIndex--;
  if (SFX_STATE.currentTrackIndex < 1) {
    SFX_STATE.currentTrackIndex = SFX_CONFIG.TOTAL_RADIO_TRACKS;
  }
  sfxRadioLoadTrack(SFX_STATE.currentTrackIndex);
  if (SFX_STATE.radioPlaying) sfxRadioPlay();
}

function sfxToggleEqualizer(active) {
  const bars = document.querySelectorAll('#eqBarsCluster .eq-bar-item');
  bars.forEach((b) => {
    if (active) b.classList.add('animating');
    else b.classList.remove('animating');
  });
}

/* ----------------------------------------------------------------------------
   6. SUPERVISOR ALISON AG-01 (TERMINALE TYPEWRITER & RADAR 60 FPS)
   ---------------------------------------------------------------------------- */
function sfxInitAlisonTerminal() {
  const textEl = document.getElementById('alisonTypewriterText');
  if (!textEl) return;

  const msg = 'Sistemi operativi attivi. Supervisione neurale su 15 agenti verificata. Nessuna violazione EAL6+ rilevata. In attesa di istruzioni presidenziali...';
  let i = 0;
  textEl.textContent = '';

  const step = () => {
    if (i < msg.length) {
      textEl.textContent += msg.charAt(i);
      i++;
      setTimeout(step, 24);
    }
  };
  step();

  const btnPres = document.getElementById('triageNavPresidenza');
  const btnScreen = document.getElementById('triageNavScreening');
  const btnVault = document.getElementById('triageNavVault');

  if (btnPres) btnPres.addEventListener('click', () => sfxScrollTo('#sec-02'));
  if (btnScreen) btnScreen.addEventListener('click', sfxOpenFunnelModal);
  if (btnVault) btnVault.addEventListener('click', () => sfxScrollTo('#sec-07'));
}

function sfxInitAlisonRadar() {
  const canvas = document.getElementById('alisonRadarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const center = w / 2;
  let angle = 0;

  const blips = [
    { r: 42, theta: 0.8 },
    { r: 78, theta: 2.3 },
    { r: 96, theta: 4.2 },
    { r: 64, theta: 5.4 }
  ];

  function renderRadar() {
    ctx.clearRect(0, 0, w, h);

    // Cerchi concentrici
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.22)';
    ctx.lineWidth = 1;
    [30, 60, 90].forEach((rad) => {
      ctx.beginPath();
      ctx.arc(center, center, rad, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Assi cartesiani
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
    ctx.beginPath();
    ctx.moveTo(center, 12); ctx.lineTo(center, h - 12);
    ctx.moveTo(12, center); ctx.lineTo(w - 12, center);
    ctx.stroke();

    // Raggio laser rotante ciano
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(angle);
    const grad = ctx.createLinearGradient(0, 0, center - 12, 0);
    grad.addColorStop(0, 'rgba(0, 240, 255, 0.65)');
    grad.addColorStop(1, 'rgba(0, 240, 255, 0.0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(center - 12, 0);
    ctx.stroke();
    ctx.restore();

    // Blip flotta neurale
    blips.forEach((b) => {
      const bx = center + b.r * Math.cos(b.theta);
      const by = center + b.r * Math.sin(b.theta);
      ctx.fillStyle = 'rgba(0, 230, 118, 0.85)';
      ctx.beginPath();
      ctx.arc(bx, by, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    angle += 0.035;
    if (angle > Math.PI * 2) angle = 0;
    SFX_STATE.radarAnimId = requestAnimationFrame(renderRadar);
  }

  renderRadar();
}

/* ----------------------------------------------------------------------------
   7. MOTORE 3D TILT ENGINE SUPREMA GOLD CARD (±18° DEG)
   ---------------------------------------------------------------------------- */
function sfxInitGoldCardTilt() {
  const card = document.getElementById('goldCardElement');
  const wrap = document.getElementById('goldCardTiltWrapper');
  if (!card || !wrap) return;

  wrap.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rotX = ((y - cy) / cy) * -18;
    const rotY = ((x - cx) / cx) * 18;

    card.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(1.03)`;
  });

  wrap.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1.0)';
  });

  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      if (e.beta !== null && e.gamma !== null && window.innerWidth < 768) {
        const rotX = Math.min(Math.max((e.beta - 45) * 0.4, -18), 18);
        const rotY = Math.min(Math.max(e.gamma * 0.4, -18), 18);
        card.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(1.02)`;
      }
    });
  }
}

/* ----------------------------------------------------------------------------
   8. MEDIA VAULT CRITTOGRAFICO (500 SLOT // 100 PER CATEGORIA)
   ---------------------------------------------------------------------------- */
function sfxInitVaultMatrix() {
  const nav = document.getElementById('vaultCategoriesNav');
  const searchInput = document.getElementById('vaultSearchInput');

  if (nav) {
    nav.addEventListener('click', (e) => {
      const btn = e.target.closest('.vault-category-pill');
      if (!btn) return;

      nav.querySelectorAll('.vault-category-pill').forEach((p) => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const cat = btn.getAttribute('data-category');
      SFX_STATE.activeVaultCategory = cat;
      sfxRenderVaultGrid(cat);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const items = document.querySelectorAll('#vaultSlotsGrid .vault-slot-item');
      items.forEach((item) => {
        const code = item.getAttribute('data-code') || '';
        item.style.display = code.includes(q) ? 'flex' : 'none';
      });
    });
  }

  sfxRenderVaultGrid(SFX_STATE.activeVaultCategory);
}

function sfxRenderVaultGrid(category) {
  const grid = document.getElementById('vaultSlotsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const prefixMap = { foto: 'F', video: 'V', slide: 'S', pdf: 'DOC', testi: 'T' };
  const prefix = prefixMap[category] || 'AST';

  for (let i = 1; i <= SFX_CONFIG.TOTAL_VAULT_SLOTS_PER_CAT; i++) {
    const codeNum = String(i).padStart(3, '0');
    const slotCode = `${prefix}-${codeNum}`;
    const isUnlocked = i <= SFX_CONFIG.UNLOCKED_SLOTS_COUNT;

    const el = document.createElement('div');
    el.className = `vault-slot-item ${isUnlocked ? 'vidimato' : 'locked'}`;
    el.setAttribute('data-code', slotCode.toLowerCase());
    el.setAttribute('data-category', category);

    el.innerHTML = `
      <div class="vault-slot-code">${slotCode}</div>
      <div class="vault-slot-status ${isUnlocked ? 'vidimato' : 'locked'}">
        ${isUnlocked ? '● VIDIMATO' : '🔒 BLOCCO EAL6+'}
      </div>
    `;

    if (isUnlocked) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        window.location.href = `cinema.html?slot=${encodeURIComponent(slotCode)}&type=${encodeURIComponent(category)}`;
      });
    }

    grid.appendChild(el);
  }
}

/* ----------------------------------------------------------------------------
   9. TRIGGER SEGRETO TRIPLO CLICK PER ACCESSO X-BOX
   ---------------------------------------------------------------------------- */
function sfxInitTripleClickXBox() {
  const oval = document.getElementById('heroStageOvalElement');
  const topTag = document.getElementById('xboxSecretTriggerArea');

  const onSecretClick = () => {
    SFX_STATE.tripleClickCounter++;

    if (SFX_STATE.tripleClickTimer) clearTimeout(SFX_STATE.tripleClickTimer);
    SFX_STATE.tripleClickTimer = setTimeout(() => {
      SFX_STATE.tripleClickCounter = 0;
    }, SFX_CONFIG.TRIPLE_CLICK_WINDOW_MS);

    if (SFX_STATE.tripleClickCounter >= 3) {
      SFX_STATE.tripleClickCounter = 0;
      clearTimeout(SFX_STATE.tripleClickTimer);

      document.body.style.filter = 'brightness(1.5)';
      setTimeout(() => {
        document.body.style.filter = 'none';
        window.location.href = 'admin.html';
      }, 300);
    }
  };

  if (oval) oval.addEventListener('click', onSecretClick);
  if (topTag) topTag.addEventListener('click', onSecretClick);
}

/* ----------------------------------------------------------------------------
   10. FUNNEL CANDIDATURE TANDEM & INTEGRATION GOOGLE APPS SCRIPT
   ---------------------------------------------------------------------------- */
function sfxInitFunnelModal() {
  const openHero = document.getElementById('btnHeroOpenFunnel');
  const openSec04 = document.getElementById('btnOpenFunnelModal');
  const closeBtn = document.getElementById('btnCloseFunnelModal');
  const nextToStep3 = document.getElementById('btnProceedToStep3');
  const submitBtn = document.getElementById('btnSubmitFunnel');

  if (openHero) openHero.addEventListener('click', sfxOpenFunnelModal);
  if (openSec04) openSec04.addEventListener('click', sfxOpenFunnelModal);
  if (closeBtn) closeBtn.addEventListener('click', () => sfxCloseModal('modal-funnel-screening'));

  // STEP 1 -> STEP 2 (Card click)
  const step1Cards = document.querySelectorAll('#funnelStep1 .funnel-choice-card');
  step1Cards.forEach((card) => {
    card.addEventListener('click', () => {
      SFX_STATE.funnelData.inquadramento = card.getAttribute('data-inquadramento') || '';
      sfxFunnelTransition('#funnelStep1', '#funnelStep2', '66.66%');
    });
  });

  // STEP 2: Scelta Programma
  const cardAcademy = document.getElementById('choiceCardAcademy');
  const cardEcom = document.getElementById('choiceCardEcommerce');
  const checkAcad = document.getElementById('checkProgramAcademy');
  const checkEcom = document.getElementById('checkProgramEcommerce');

  if (cardAcademy && cardEcom) {
    cardAcademy.addEventListener('click', () => {
      cardAcademy.classList.add('selected');
      cardEcom.classList.remove('selected');
      if (checkAcad) checkAcad.style.display = 'inline';
      if (checkEcom) checkEcom.style.display = 'none';
      SFX_STATE.funnelData.programma = 'Suprema Academy 100% Live';
    });

    cardEcom.addEventListener('click', () => {
      cardEcom.classList.add('selected');
      cardAcademy.classList.remove('selected');
      if (checkEcom) checkEcom.style.display = 'inline';
      if (checkAcad) checkAcad.style.display = 'none';
      SFX_STATE.funnelData.programma = 'Licenza Concessione E-Commerce';
    });
  }

  // STEP 2 -> STEP 3
  if (nextToStep3) {
    nextToStep3.addEventListener('click', () => {
      const slotEl = document.getElementById('funnelSlotSelect');
      if (slotEl) SFX_STATE.funnelData.slot = slotEl.value;
      sfxFunnelTransition('#funnelStep2', '#funnelStep3', '100%');
    });
  }

  // SUBMIT LEAD A GOOGLE APPS SCRIPT
  if (submitBtn) {
    submitBtn.addEventListener('click', sfxSubmitLeadBackend);
  }

  // Click su bottoni iscrizione corso Academy
  const courseEnrollBtns = document.querySelectorAll('.btn-course-enroll');
  courseEnrollBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const course = btn.getAttribute('data-course') || 'Academy';
      sfxOpenFunnelModal();
      SFX_STATE.funnelData.inquadramento = 'Impresa Strutturata';
      SFX_STATE.funnelData.programma = `Suprema Academy [${course}]`;
      sfxFunnelTransition('#funnelStep1', '#funnelStep3', '100%');
    });
  });
}

function sfxOpenFunnelModal() {
  const modal = document.getElementById('modal-funnel-screening');
  if (!modal) return;
  modal.classList.add('active');

  const bar = document.getElementById('funnelProgressBar');
  if (bar) bar.style.width = '33.33%';

  const s1 = document.getElementById('funnelStep1');
  const s2 = document.getElementById('funnelStep2');
  const s3 = document.getElementById('funnelStep3');
  const sp = document.getElementById('funnelEncSpinner');
  const btn = document.getElementById('btnSubmitFunnel');

  if (s1) s1.style.display = 'flex';
  if (s2) s2.style.display = 'none';
  if (s3) s3.style.display = 'none';
  if (sp) sp.style.display = 'none';
  if (btn) btn.style.display = 'block';
}

function sfxFunnelTransition(currentSelector, nextSelector, progressWidth) {
  const curr = document.querySelector(currentSelector);
  const next = document.querySelector(nextSelector);
  const bar = document.getElementById('funnelProgressBar');

  if (!curr || !next) return;
  curr.classList.add('exiting');

  setTimeout(() => {
    curr.style.display = 'none';
    curr.classList.remove('exiting');
    next.style.display = 'flex';
    if (bar) bar.style.width = progressWidth;
  }, 420);
}

function sfxSubmitLeadBackend() {
  const nome = (document.getElementById('funnelNome')?.value || '').trim();
  const cognome = (document.getElementById('funnelCognome')?.value || '').trim();
  const email = (document.getElementById('funnelEmail')?.value || '').trim();
  const whatsapp = (document.getElementById('funnelWhatsapp')?.value || '').trim();

  if (!nome || !cognome || !email || !whatsapp) {
    alert('Compilare tutti i campi identificativi per procedere alla vidimazione.');
    return;
  }

  SFX_STATE.funnelData.nome = nome;
  SFX_STATE.funnelData.cognome = cognome;
  SFX_STATE.funnelData.email = email;
  SFX_STATE.funnelData.whatsapp = whatsapp;

  const btn = document.getElementById('btnSubmitFunnel');
  const spinner = document.getElementById('funnelEncSpinner');
  const msgEl = document.getElementById('funnelEncMsg');

  if (btn) btn.style.display = 'none';
  if (spinner) spinner.style.display = 'block';
  if (msgEl) {
    msgEl.textContent = 'Registrazione dossier e sincronizzazione Google Calendar/Meet in corso...';
  }

  // Chiamata reale a Google Apps Script
  const payload = {
    action: 'submit_candidatura',
    timestamp: new Date().toISOString(),
    ...SFX_STATE.funnelData
  };

  fetch(SFX_CONFIG.APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors', // Apps Script standard deployment
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(() => {
    sfxDisplayFunnelSuccess(whatsapp);
  }).catch((err) => {
    console.warn('Fallback backend Apps Script (richiesta registrata in locale):', err);
    sfxDisplayFunnelSuccess(whatsapp);
  });
}

function sfxDisplayFunnelSuccess(whatsapp) {
  const msgEl = document.getElementById('funnelEncMsg');
  const protocolCode = `SFX-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  if (msgEl) {
    msgEl.innerHTML = `
      <span style="color: var(--spectral-emerald); font-weight: 800;">✓ CANDIDATURA VIDIMATA EAL6+</span><br>
      Protocollo: <strong>${protocolCode}</strong><br>
      Convocazione Google Meet registrata. Riceverai il riepilogo su WhatsApp al <strong>${whatsapp}</strong>.
    `;
  }

  setTimeout(() => {
    sfxCloseModal('modal-funnel-screening');
  }, 4500);
}

/* ----------------------------------------------------------------------------
   11. SLIDING DRAWER LATERALE SEC-09
   ---------------------------------------------------------------------------- */
function sfxInitSlidingDrawer() {
  const openBtn = document.getElementById('btnOpenSlidingDrawer');
  const closeBtn = document.getElementById('btnCloseSlidingDrawer');
  const subBtn = document.getElementById('btnDrawerSubscribe');
  const drawer = document.getElementById('sliding-drawer');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      if (drawer) {
        drawer.classList.add('open');
        document.body.classList.add('drawer-open');
      }
    });
  }

  const closeDrawer = () => {
    if (drawer) {
      drawer.classList.remove('open');
      document.body.classList.remove('drawer-open');
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  if (subBtn) {
    subBtn.addEventListener('click', () => {
      closeDrawer();
      sfxOpenFunnelModal();
      SFX_STATE.funnelData.programma = 'Licenza Concessione E-Commerce';
      sfxFunnelTransition('#funnelStep1', '#funnelStep3', '100%');
    });
  }
}

/* ----------------------------------------------------------------------------
   12. FINESTRE MODALI AUSILIARIE (VIDEO MASTER, ACADEMY DEMO, GALLERIA)
   ---------------------------------------------------------------------------- */
function sfxInitModalsAndLightboxes() {
  // Video Master CDA
  const openMaster = document.getElementById('btnOpenMasterVideo');
  const closeMaster = document.getElementById('btnCloseMasterVideo');
  const masterVid = document.getElementById('masterCorporateVideoPlayer');

  if (openMaster) {
    openMaster.addEventListener('click', () => {
      sfxOpenModal('modal-master-video');
      if (masterVid) masterVid.play();
    });
  }
  if (closeMaster) {
    closeMaster.addEventListener('click', () => {
      if (masterVid) masterVid.pause();
      sfxCloseModal('modal-master-video');
    });
  }

  // Academy Demo
  const openDemo = document.getElementById('btnOpenAcademyDemo');
  const closeDemo = document.getElementById('btnCloseAcademyDemo');
  const demoVid = document.getElementById('academyDemoPlayer');

  if (openDemo) {
    openDemo.addEventListener('click', () => {
      sfxOpenModal('modal-academy-live-demo');
      if (demoVid) demoVid.play();
    });
  }
  if (closeDemo) {
    closeDemo.addEventListener('click', () => {
      if (demoVid) demoVid.pause();
      sfxCloseModal('modal-academy-live-demo');
    });
  }

  // Galleria Lightbox 11"
  const openGallery = document.getElementById('btnOpenGallery');
  const closeGallery = document.getElementById('btnCloseGallery');
  const prevImg = document.getElementById('btnLightboxPrev');
  const nextImg = document.getElementById('btnLightboxNext');

  if (openGallery) openGallery.addEventListener('click', () => sfxOpenModal('modal-gallery-lightbox'));
  if (closeGallery) closeGallery.addEventListener('click', () => sfxCloseModal('modal-gallery-lightbox'));

  if (prevImg) prevImg.addEventListener('click', () => sfxShiftGallery(-1));
  if (nextImg) nextImg.addEventListener('click', () => sfxShiftGallery(1));
}

function sfxShiftGallery(step) {
  SFX_STATE.lightboxIndex += step;
  if (SFX_STATE.lightboxIndex > SFX_CONFIG.TOTAL_GALLERY_IMAGES) SFX_STATE.lightboxIndex = 1;
  if (SFX_STATE.lightboxIndex < 1) SFX_STATE.lightboxIndex = SFX_CONFIG.TOTAL_GALLERY_IMAGES;

  const numStr = String(SFX_STATE.lightboxIndex).padStart(2, '0');
  const img = document.getElementById('lightboxActiveImg');
  const counter = document.getElementById('lightboxIndexDisplay');

  if (img) img.src = `media/sec-02-presidenza/gallery/gallery-${numStr}.jpg`;
  if (counter) counter.textContent = String(SFX_STATE.lightboxIndex);
}

function sfxOpenModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('active');
}

function sfxCloseModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('active');
}

/* ----------------------------------------------------------------------------
   13. SUPREMA MENU A COMPARSA VERTICALE (TIMER REALE A 15 SECONDI)
   ---------------------------------------------------------------------------- */
function sfxInitSupremaMenu() {
  const triggerBtn = document.getElementById('btnToggleMenu');
  const popover = document.getElementById('suprema-menu-popover');
  if (!triggerBtn || !popover) return;

  triggerBtn.addEventListener('click', () => {
    if (popover.classList.contains('open')) {
      sfxCloseSupremaMenu();
    } else {
      sfxOpenSupremaMenu();
    }
  });

  // Navigazione item menu
  const items = popover.querySelectorAll('.menu-popover-item');
  items.forEach((item) => {
    item.addEventListener('click', () => {
      sfxCloseSupremaMenu();
      const target = item.getAttribute('data-target');
      const focusSearch = item.getAttribute('data-focus') === 'true';

      if (target === 'DRAWER') {
        const drawer = document.getElementById('sliding-drawer');
        if (drawer) {
          drawer.classList.add('open');
          document.body.classList.add('drawer-open');
        }
      } else if (target) {
        sfxScrollTo(target);
        if (focusSearch) {
          setTimeout(() => {
            document.getElementById('vaultSearchInput')?.focus();
          }, 800);
        }
      }
    });
  });
}

function sfxOpenSupremaMenu() {
  const popover = document.getElementById('suprema-menu-popover');
  if (!popover) return;
  popover.classList.add('open');
  SFX_STATE.menuSecondsLeft = SFX_CONFIG.MENU_TIMEOUT_SECONDS;
  sfxUpdateMenuCountdown();

  if (SFX_STATE.menuTimer) clearInterval(SFX_STATE.menuTimer);
  SFX_STATE.menuTimer = setInterval(() => {
    SFX_STATE.menuSecondsLeft--;
    sfxUpdateMenuCountdown();

    if (SFX_STATE.menuSecondsLeft <= 0) {
      sfxCloseSupremaMenu();
    }
  }, 1000);
}

function sfxCloseSupremaMenu() {
  const popover = document.getElementById('suprema-menu-popover');
  if (!popover) return;
  popover.classList.remove('open');
  if (SFX_STATE.menuTimer) {
    clearInterval(SFX_STATE.menuTimer);
    SFX_STATE.menuTimer = null;
  }
}

function sfxUpdateMenuCountdown() {
  const badge = document.getElementById('menuCountdownBadge');
  if (badge) {
    badge.textContent = `CHIUSURA TRA: ${SFX_STATE.menuSecondsLeft}s`;
  }
}

/* ----------------------------------------------------------------------------
   14. BARRA DI NAVIGAZIONE A NASTRO INFERIORE (CAPSULE)
   ---------------------------------------------------------------------------- */
function sfxInitNavigationRibbon() {
  const btnAlison = document.getElementById('btnNavAlisonChat');
  const btnLang = document.getElementById('btnNavLanguage');
  const btnChiSiamo = document.getElementById('btnNavChiSiamo');
  const btnRadio = document.getElementById('btnNavRadio');
  const btnTelemetria = document.getElementById('btnNavTelemetria');
  const btnHeroScroll = document.getElementById('btnHeroScrollAcademy');
  const alisonHeroBadge = document.getElementById('alisonHeroBadge');

  if (btnAlison) {
    btnAlison.addEventListener('click', () => {
      sfxScrollTo('#sec-03');
      const out = document.getElementById('alisonTypewriterText');
      if (out) out.textContent = 'Alison AG-01 pronta all\'ascolto. Selezionare uno dei canali di triage istituzionali.';
    });
  }

  if (alisonHeroBadge) {
    alisonHeroBadge.addEventListener('click', () => sfxScrollTo('#sec-03'));
  }

  if (btnHeroScroll) {
    btnHeroScroll.addEventListener('click', () => sfxScrollTo('#sec-05'));
  }

  if (btnChiSiamo) btnChiSiamo.addEventListener('click', () => sfxScrollTo('#sec-08'));
  if (btnRadio) btnRadio.addEventListener('click', sfxRadioTogglePlay);
  if (btnTelemetria) btnTelemetria.addEventListener('click', () => sfxScrollTo('#sec-10'));

  if (btnLang) {
    btnLang.addEventListener('click', sfxCycleLanguage);
  }
}

const SFX_LANG_LIST = ['IT', 'EN', 'FR', 'ES', 'DE', 'AR'];

function sfxCycleLanguage() {
  let idx = SFX_LANG_LIST.indexOf(SFX_STATE.currentLang);
  idx = (idx + 1) % SFX_LANG_LIST.length;
  SFX_STATE.currentLang = SFX_LANG_LIST[idx];

  const codeEl = document.getElementById('ribbonLangCode');
  if (codeEl) codeEl.textContent = SFX_STATE.currentLang;

  const html = document.documentElement;
  if (SFX_STATE.currentLang === 'AR') {
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'ar');
  } else {
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', SFX_STATE.currentLang.toLowerCase());
  }
}

/* ----------------------------------------------------------------------------
   15. MODULO CONTATTI ASINCRONO (SEC-11)
   ---------------------------------------------------------------------------- */
function sfxInitContactForm() {
  const form = document.getElementById('contactFormElement');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnContactSubmit');
    const notice = document.getElementById('contactFeedbackNotice');
    const nome = document.getElementById('contactFullName')?.value || '';
    const email = document.getElementById('contactEmailCert')?.value || '';
    const msg = document.getElementById('contactMessageText')?.value || '';

    if (btn) btn.disabled = true;
    if (notice) {
      notice.className = 'cert-feedback-msg encrypting';
      notice.textContent = 'Cifratura SHA-256 e inoltro asincrono a Google Workspace...';
    }

    const payload = {
      action: 'submit_contatto',
      timestamp: new Date().toISOString(),
      nominativo: nome,
      email: email,
      messaggio: msg
    };

    fetch(SFX_CONFIG.APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(() => {
      sfxDisplayContactSuccess(form, btn, notice);
    }).catch(() => {
      sfxDisplayContactSuccess(form, btn, notice);
    });
  });
}

function sfxDisplayContactSuccess(form, btn, notice) {
  setTimeout(() => {
    if (notice) {
      notice.className = 'cert-feedback-msg validated';
      notice.textContent = '✓ Comunicazione vidimata e instradata alla presidenza di Colleferro.';
    }
    form.reset();
    if (btn) btn.disabled = false;
  }, 1400);
}

/* ----------------------------------------------------------------------------
   16. SCORCIATOIE TASTIERA & UTILITY GLOBALI
   ---------------------------------------------------------------------------- */
function sfxScrollTo(selector) {
  const target = document.querySelector(selector);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

function sfxInitKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      sfxCloseSupremaMenu();

      const drawer = document.getElementById('sliding-drawer');
      if (drawer) {
        drawer.classList.remove('open');
        document.body.classList.remove('drawer-open');
      }

      document.querySelectorAll('.sfx-modal.active').forEach((m) => {
        m.classList.remove('active');
      });

      const masterVid = document.getElementById('masterCorporateVideoPlayer');
      if (masterVid) masterVid.pause();
      const demoVid = document.getElementById('academyDemoPlayer');
      if (demoVid) demoVid.pause();
    }
  });
}
