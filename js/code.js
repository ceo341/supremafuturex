/* ==========================================================================
   SUPREMA FUTURE X ENTERPRISE 2026 — MOTORE LOGICO INTEGRALE (js/code.js)
   Con Webhook Apps Script Attivo, Auto-Rilevamento Media GitHub (Logo Loop,
   Radio 30 Slot, Gold Card Reale, Immagini Sezioni & 3 Corsi Academy),
   Matrix Fluido, Traduttore Google 11 Lingue e Telemetria PIN 3474429091.
   ========================================================================== */

/* --------------------------------------------------------------------------
   00. CONFIGURAZIONE CENTRALIZZATA
   -------------------------------------------------------------------------- */
const SFX_CONFIG = {
  githubRepo: 'ceo341/supremafuturex',
  openEducatConferenzaUrl: '#conferenza-prenotazione',
  openEducatGoldCardUrl: '#portale-goldcard',

  payments: {
    gold: {
      revolut: 'https://revolut.me/',
      paypal: 'https://www.paypal.com/',
      sumup: 'https://pay.sumup.com/'
    },
    premium: {
      revolut: 'https://revolut.me/',
      paypal: 'https://www.paypal.com/',
      sumup: 'https://pay.sumup.com/'
    },
    enterprise: {
      revolut: 'https://revolut.me/',
      paypal: 'https://www.paypal.com/',
      sumup: 'https://pay.sumup.com/'
    }
  },

  // Webhook Google Apps Script Attivo (Notifiche Email CEO + Telegram)
  webhookEndpoint: 'https://script.google.com/macros/s/AKfycbzkpeKBeP5PBKYKKgWvQs-avgQzId10Nr3G2DN1YbU-ePY0m9JgOcCCPCT6F-xzYCDP1w/exec',
  newsletterEmail: 'segreteria@gmail.com',

  // PIN Telemetria Direzionale
  telemetryPin: '3474429091',

  // Parametri Multimediali
  heroLogosCount: 10,
  radioTotalSlots: 30,
  radioAvailableMp3: 14
};

// Archivio dinamico delle foto rilevate nelle cartelle media/ di GitHub
const GITHUB_MEDIA_CACHE = {
  heroLogos: [
    'media/sec-01-hero/logo-01.png',
    'media/sec-01-hero/logo-02.png',
    'media/sec-01-hero/logo-03.png',
    'media/sec-01-hero/logo-04.png',
    'media/sec-01-hero/logo-05.png',
    'media/sec-01-hero/logo-06.png',
    'media/sec-01-hero/logo-07.png',
    'media/sec-01-hero/logo-08.png',
    'media/sec-01-hero/logo-09.png',
    'media/sec-01-hero/logo-10.png'
  ],
  radioTracks: Array.from({ length: 14 }, (_, i) => {
    const n = (i + 1).toString().padStart(2, '0');
    return `media/audio-radio/track-${n}.mp3`;
  }),
  academyImages: [],
  goldCardImage: ''
};

/* --------------------------------------------------------------------------
   01. AUTO-RILEVAMENTO IMMAGINI & AUDIO DALLE CARTELLE media/ DI GITHUB
   -------------------------------------------------------------------------- */
async function fetchGithubFolderFiles(folderPath) {
  const cacheKey = `sfx_gh_dir_${folderPath}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {}
  }

  try {
    const apiUrl = `https://api.github.com/repos/${SFX_CONFIG.githubRepo}/contents/${folderPath}`;
    const res = await fetch(apiUrl);
    if (!res.ok) return [];
    const items = await res.json();
    if (!Array.isArray(items)) return [];

    const validFiles = items
      .filter((item) => item.type === 'file' && !item.name.toLowerCase().includes('placeholder'))
      .map((item) => `${folderPath}/${item.name}`);

    sessionStorage.setItem(cacheKey, JSON.stringify(validFiles));
    return validFiles;
  } catch (e) {
    return [];
  }
}

async function autoDiscoverGithubMedia() {
  // 1. Scocca Ovale Hero (media/sec-01-hero)
  const heroFiles = await fetchGithubFolderFiles('media/sec-01-hero');
  const heroImgs = heroFiles.filter((f) => /\.(png|jpe?g|webp|gif)$/i.test(f)).sort();
  if (heroImgs.length > 0) {
    GITHUB_MEDIA_CACHE.heroLogos = heroImgs;
  }

  // 2. Tracce Radio (media/audio-radio)
  const audioFiles = await fetchGithubFolderFiles('media/audio-radio');
  const mp3Files = audioFiles.filter((f) => /\.mp3$/i.test(f)).sort();
  if (mp3Files.length > 0) {
    GITHUB_MEDIA_CACHE.radioTracks = mp3Files;
    initRadioLounge();
  }

  // 3. Suprema Gold Card Reale (media/sec-06-goldcard)
  const goldCardFiles = await fetchGithubFolderFiles('media/sec-06-goldcard');
  const goldCardImgs = goldCardFiles.filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort();
  if (goldCardImgs.length > 0) {
    GITHUB_MEDIA_CACHE.goldCardImage = goldCardImgs[0];
    const gcImgEl = document.getElementById('goldcard-real-img');
    if (gcImgEl) gcImgEl.src = goldCardImgs[0];
  }

  // 4. Suprema Academy & I 3 Corsi (media/sec-05-academy)
  const academyFiles = await fetchGithubFolderFiles('media/sec-05-academy');
  const academyImgs = academyFiles.filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort();
  const academyVids = academyFiles.filter((f) => /\.(mp4|webm)$/i.test(f)).sort();

  if (academyImgs.length > 0) {
    GITHUB_MEDIA_CACHE.academyImages = academyImgs;
    const mainAcadImg = document.getElementById('img-sec-05-academy-main');
    if (mainAcadImg) mainAcadImg.src = academyImgs[0];

    const goldThumb = document.getElementById('course-thumb-gold');
    const premThumb = document.getElementById('course-thumb-premium');
    const entThumb = document.getElementById('course-thumb-enterprise');

    if (goldThumb) goldThumb.src = academyImgs[1] || academyImgs[0];
    if (premThumb) premThumb.src = academyImgs[2] || academyImgs[1] || academyImgs[0];
    if (entThumb) entThumb.src = academyImgs[3] || academyImgs[2] || academyImgs[0];
  }

  if (academyVids.length > 0) {
    const acadVid = document.getElementById('academy-main-video');
    if (acadVid) {
      acadVid.src = academyVids[0];
    }
  }

  // 5. Tutte le altre sezioni (escluse SEC-00, CEO e Alison come richiesto)
  const sectionFolders = [
    'sec-04-funnel',
    'sec-07-vault',
    'sec-08-social',
    'sec-09-ecommerce',
    'sec-10-testimonials',
    'sec-11-newsletter',
    'sec-12-feedback'
  ];

  for (const folder of sectionFolders) {
    const files = await fetchGithubFolderFiles(`media/${folder}`);
    const imgs = files.filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort();
    if (imgs.length > 0) {
      const bannerEl = document.getElementById(`banner-${folder}`);
      const imgEl = document.getElementById(`img-${folder}`);
      if (bannerEl && imgEl) {
        imgEl.src = imgs[0];
        bannerEl.classList.add('has-media');
      }
    }
  }
}

/* --------------------------------------------------------------------------
   02. ARCHIVIO PERSISTENTE SUL DISPOSITIVO (INDEXEDDB PER UPLOAD LOCALI)
   -------------------------------------------------------------------------- */
const SFXMediaStore = {
  dbName: 'SupremaFutureX_MediaDB',
  storeName: 'uploads',
  db: null,

  init() {
    return new Promise((resolve) => {
      if (!window.indexedDB) {
        resolve(null);
        return;
      }
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' });
        }
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };
      request.onerror = () => resolve(null);
    });
  },

  save(key, value) {
    return new Promise((resolve) => {
      if (!this.db) {
        resolve(false);
        return;
      }
      const tx = this.db.transaction(this.storeName, 'readwrite');
      tx.objectStore(this.storeName).put({ key, value, updatedAt: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  },

  load(key) {
    return new Promise((resolve) => {
      if (!this.db) {
        resolve(null);
        return;
      }
      const tx = this.db.transaction(this.storeName, 'readonly');
      const req = tx.objectStore(this.storeName).get(key);
      req.onsuccess = () => resolve(req.result ? req.result.value : null);
      req.onerror = () => resolve(null);
    });
  }
};

/* --------------------------------------------------------------------------
   03. MOTORE MATRIX VELOCE E FLUIDO (SFONDO LANDING, SOTTOMENU E TELEMETRIA)
   -------------------------------------------------------------------------- */
const matrixControllers = {};

function startSlowMatrixCanvas(canvasId, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  if (matrixControllers[canvasId]) {
    cancelAnimationFrame(matrixControllers[canvasId].rafId);
  }

  const ctx = canvas.getContext('2d');
  const chars = 'SUPREMAFUTUREX0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ✦◈';
  const fontSize = options.fontSize || 15;
  const speedDelay = options.speedDelay || 36; // Calata più veloce e scorrevole
  let columns = 0;
  let drops = [];
  let lastTick = 0;

  function resize() {
    canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth || window.innerWidth : window.innerWidth;
    canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight || window.innerHeight : window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -30));
  }

  resize();
  window.addEventListener('resize', resize);

  function render(timestamp) {
    if (timestamp - lastTick >= speedDelay) {
      lastTick = timestamp;

      ctx.fillStyle = 'rgba(7, 16, 25, 0.11)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = i % 4 === 0 ? 'rgba(244, 223, 142, 0.85)' : 'rgba(0, 240, 255, 0.65)';
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.972) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    matrixControllers[canvasId] = {
      rafId: requestAnimationFrame(render),
      resize
    };
  }

  matrixControllers[canvasId] = {
    rafId: requestAnimationFrame(render),
    resize
  };
}

/* --------------------------------------------------------------------------
   04. ANIMAZIONI DI SCORRIMENTO SULLE SEZIONI (SCROLL REVEAL)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const revealEls = document.querySelectorAll('.sfx-reveal');
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.08 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   05. OROLOGIO LIVE CET & TELEMETRIA VISITATORI
   -------------------------------------------------------------------------- */
const SESSION_START_TIME = Date.now();

function updateCetClock() {
  const el = document.getElementById('cet-live-clock');
  if (!el) return;
  try {
    const formatted = new Intl.DateTimeFormat('it-IT', {
      timeZone: 'Europe/Rome',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(new Date());
    el.textContent = `${formatted} CET`;
  } catch (e) {
    el.textContent = `${new Date().toTimeString().slice(0, 8)} CET`;
  }
}

function initVisitorTelemetryTracker() {
  const visitsKey = 'sfx_total_visits_count';
  const durationKey = 'sfx_accumulated_seconds';

  let totalVisits = parseInt(localStorage.getItem(visitsKey) || '148', 10);
  if (!sessionStorage.getItem('sfx_session_counted')) {
    totalVisits += 1;
    localStorage.setItem(visitsKey, totalVisits.toString());
    sessionStorage.setItem('sfx_session_counted', '1');
  }

  setInterval(() => {
    const elapsedSec = Math.floor((Date.now() - SESSION_START_TIME) / 1000);
    const prevSaved = parseInt(localStorage.getItem(durationKey) || '185', 10);
    const avgSec = Math.max(elapsedSec, Math.floor((prevSaved + elapsedSec) / 2));

    const visitsEl = document.getElementById('stat-total-visits');
    const liveEl = document.getElementById('stat-live-users');
    const durEl = document.getElementById('stat-avg-duration');

    if (visitsEl) visitsEl.textContent = totalVisits.toLocaleString('it-IT');
    if (liveEl) liveEl.textContent = '1';
    if (durEl) {
      const mins = Math.floor(avgSec / 60).toString().padStart(2, '0');
      const secs = (avgSec % 60).toString().padStart(2, '0');
      durEl.textContent = `${mins}m ${secs}s`;
    }
  }, 1000);
}

function openTelemetryPinModal() {
  const modal = document.getElementById('telemetry-pin-modal');
  const lockScreen = document.getElementById('telemetry-lock-screen');
  const dashScreen = document.getElementById('telemetry-dashboard-screen');
  const input = document.getElementById('telemetry-pin-input');
  const err = document.getElementById('telemetry-pin-error');

  if (!modal) return;
  modal.classList.add('open');
  document.body.classList.add('modal-open');

  if (lockScreen) lockScreen.style.display = 'block';
  if (dashScreen) dashScreen.style.display = 'none';
  if (err) err.style.display = 'none';
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 120);
  }

  startSlowMatrixCanvas('telemetry-matrix-canvas', { speedDelay: 38 });
}

function verifyTelemetryPin() {
  const input = document.getElementById('telemetry-pin-input');
  const err = document.getElementById('telemetry-pin-error');
  const lockScreen = document.getElementById('telemetry-lock-screen');
  const dashScreen = document.getElementById('telemetry-dashboard-screen');

  if (!input) return;

  if (input.value.trim() === SFX_CONFIG.telemetryPin) {
    if (err) err.style.display = 'none';
    if (lockScreen) lockScreen.style.display = 'none';
    if (dashScreen) dashScreen.style.display = 'block';
  } else {
    if (err) err.style.display = 'block';
    input.value = '';
    input.focus();
  }
}

function closeTelemetryModal() {
  const modal = document.getElementById('telemetry-pin-modal');
  if (modal) modal.classList.remove('open');
  document.body.classList.remove('modal-open');
}

/* --------------------------------------------------------------------------
   06. SCOCCA OVALE CENTRALE: 3s MONOGRAMMA SF -> LOOP LOGHI DA GITHUB
   -------------------------------------------------------------------------- */
function initHeroOvalCarousel() {
  const monogramEl = document.getElementById('oval-monogram-sf');
  const imgEl = document.getElementById('oval-carousel-image');
  if (!monogramEl || !imgEl) return;

  let currentIdx = 0;

  // Precarica le immagini
  GITHUB_MEDIA_CACHE.heroLogos.forEach((src) => {
    const pre = new Image();
    pre.src = src;
  });

  // Dopo 3.0 secondi sfuma il monogramma SF e avvia il carosello delle foto
  setTimeout(() => {
    const logos = GITHUB_MEDIA_CACHE.heroLogos;
    if (logos.length > 0) {
      imgEl.src = logos[0];
    }
    monogramEl.style.opacity = '0';
    imgEl.classList.add('visible');

    setTimeout(() => {
      monogramEl.style.display = 'none';
    }, 850);

    setInterval(() => {
      const list = GITHUB_MEDIA_CACHE.heroLogos;
      if (!list || list.length === 0) return;

      imgEl.classList.remove('visible');
      setTimeout(() => {
        currentIdx = (currentIdx + 1) % list.length;
        imgEl.src = list[currentIdx];
        imgEl.classList.add('visible');
      }, 450);
    }, 3000);
  }, 3000);
}

/* --------------------------------------------------------------------------
   07. RADAR 60FPS ALISON AG-01 & TYPEWRITER (SEC-03)
   -------------------------------------------------------------------------- */
function initAlisonRadar() {
  const canvas = document.getElementById('alison-radar-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = cx - 8;
  let angle = 0;

  function drawRadar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
    bgGrad.addColorStop(0, '#FFFFFF');
    bgGrad.addColorStop(1, '#E2F5F7');
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.lineWidth = 1;
    [0.33, 0.66, 1].forEach((scale) => {
      ctx.beginPath();
      ctx.arc(cx, cy, radius * scale, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.beginPath();
    ctx.moveTo(cx - radius, cy);
    ctx.lineTo(cx + radius, cy);
    ctx.moveTo(cx, cy - radius);
    ctx.lineTo(cx, cy + radius);
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    const sweepGrad = ctx.createLinearGradient(0, 0, radius, 0);
    sweepGrad.addColorStop(0, 'rgba(0, 230, 118, 0.55)');
    sweepGrad.addColorStop(1, 'rgba(0, 240, 255, 0.08)');
    ctx.fillStyle = sweepGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, -0.45, 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#0B192C';
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();

    angle += 0.035;
    requestAnimationFrame(drawRadar);
  }

  requestAnimationFrame(drawRadar);
}

function initAlisonTypewriter() {
  const box = document.getElementById('alison-typewriter-box');
  if (!box) return;
  const fullText = 'Benvenuto in Suprema Future X. Sono Alison AG-01: come posso guidare la tua crescita oggi?';
  let i = 0;
  box.textContent = '';

  function typeStep() {
    if (i < fullText.length) {
      box.textContent += fullText.charAt(i);
      i++;
      setTimeout(typeStep, 26);
    }
  }
  setTimeout(typeStep, 500);
}

/* --------------------------------------------------------------------------
   08. SUPREMA MENU HAMBURGER (TIMER AUTOMATICO A 15 SECONDI)
   -------------------------------------------------------------------------- */
let menuCountdownInterval = null;
let menuRemainingSeconds = 15;

function toggleSupremaMenu() {
  const popover = document.getElementById('suprema-menu-popover');
  const btn = document.getElementById('btn-capsule-menu');
  if (!popover) return;

  const isOpen = popover.classList.contains('open');
  if (isOpen) {
    closeSupremaMenu();
  } else {
    closeAllPopovers();
    popover.classList.add('open');
    if (btn) btn.classList.add('active');
    startMenuCountdown();
  }
}

function startMenuCountdown() {
  clearInterval(menuCountdownInterval);
  menuRemainingSeconds = 15;
  const timerLabel = document.getElementById('menu-countdown-timer');
  if (timerLabel) timerLabel.textContent = `CHIUSURA: ${menuRemainingSeconds}s`;

  menuCountdownInterval = setInterval(() => {
    menuRemainingSeconds--;
    if (timerLabel) timerLabel.textContent = `CHIUSURA: ${menuRemainingSeconds}s`;
    if (menuRemainingSeconds <= 0) {
      closeSupremaMenu();
    }
  }, 1000);
}

function closeSupremaMenu() {
  clearInterval(menuCountdownInterval);
  const popover = document.getElementById('suprema-menu-popover');
  const btn = document.getElementById('btn-capsule-menu');
  if (popover) popover.classList.remove('open');
  if (btn) btn.classList.remove('active');
}

/* --------------------------------------------------------------------------
   09. SUPREMA RADIO LOUNGE (30 SLOT + AUDIO REALE SBLOCCATO)
   -------------------------------------------------------------------------- */
const RADIO_STATE = {
  currentSlot: 1,
  isPlaying: false,
  isMuted: false
};

function initRadioLounge() {
  const selector = document.getElementById('radio-slot-selector');
  const audio = document.getElementById('master-radio-audio');
  const activeCount = GITHUB_MEDIA_CACHE.radioTracks.length || SFX_CONFIG.radioAvailableMp3;

  if (selector) {
    let optionsHtml = '';
    for (let i = 1; i <= SFX_CONFIG.radioTotalSlots; i++) {
      const slotNum = i.toString().padStart(2, '0');
      const statusTag = i <= activeCount ? 'Brano Attivo' : 'Slot Libero';
      optionsHtml += `<option value="${i}">Slot ${slotNum} / 30 — Suprema Lounge (${statusTag})</option>`;
    }
    selector.innerHTML = optionsHtml;
  }

  if (audio && !audio.dataset.boundEvents) {
    audio.dataset.boundEvents = '1';
    audio.addEventListener('ended', () => {
      nextRadioTrack();
    });
    audio.addEventListener('error', () => {
      const label = document.getElementById('radio-track-label');
      if (label) {
        label.textContent = `Slot ${RADIO_STATE.currentSlot.toString().padStart(2, '0')} — Slot vuoto (seleziona 01-${activeCount.toString().padStart(2, '0')})`;
      }
      RADIO_STATE.isPlaying = false;
      updateRadioUI(true);
    });
  }

  updateRadioUI();
}

function updateRadioUI(keepErrorLabel = false) {
  const slotNum = RADIO_STATE.currentSlot.toString().padStart(2, '0');
  const label = document.getElementById('radio-track-label');
  const eqBars = document.querySelectorAll('#radio-eq-bars .eq-bar');
  const btnPlay = document.getElementById('btn-radio-play');
  const btnMute = document.getElementById('btn-radio-mute');
  const selector = document.getElementById('radio-slot-selector');

  if (selector) selector.value = RADIO_STATE.currentSlot.toString();

  if (label && !keepErrorLabel) {
    const stateText = RADIO_STATE.isMuted
      ? 'Audio Silenziato (Muto)'
      : RADIO_STATE.isPlaying
      ? 'In Riproduzione Live'
      : 'In Pausa (Pronta)';
    label.textContent = `Slot ${slotNum} / 30 — ${stateText}`;
  }

  eqBars.forEach((bar) => {
    bar.style.animationPlayState = RADIO_STATE.isPlaying && !RADIO_STATE.isMuted ? 'running' : 'paused';
  });

  if (btnPlay) btnPlay.classList.toggle('active', RADIO_STATE.isPlaying);
  if (btnMute) btnMute.classList.toggle('active', RADIO_STATE.isMuted);
}

function getTrackUrlForSlot(slotNumber) {
  const idx = slotNumber - 1;
  if (GITHUB_MEDIA_CACHE.radioTracks[idx]) {
    return GITHUB_MEDIA_CACHE.radioTracks[idx];
  }
  const slotNum = slotNumber.toString().padStart(2, '0');
  return `media/audio-radio/track-${slotNum}.mp3`;
}

function playRadioTrack() {
  const audio = document.getElementById('master-radio-audio');
  if (!audio) return;

  const targetSrc = getTrackUrlForSlot(RADIO_STATE.currentSlot);
  if (!audio.getAttribute('src') || !audio.src.endsWith(targetSrc)) {
    audio.setAttribute('src', targetSrc);
    audio.load();
  }

  audio.muted = RADIO_STATE.isMuted;
  audio.volume = 1.0;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        RADIO_STATE.isPlaying = true;
        updateRadioUI();
      })
      .catch(() => {
        RADIO_STATE.isPlaying = false;
        updateRadioUI();
      });
  }
}

function stopRadioTrack() {
  const audio = document.getElementById('master-radio-audio');
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  RADIO_STATE.isPlaying = false;
  updateRadioUI();
}

function nextRadioTrack() {
  const maxActive = GITHUB_MEDIA_CACHE.radioTracks.length || SFX_CONFIG.radioAvailableMp3;
  RADIO_STATE.currentSlot = RADIO_STATE.currentSlot >= maxActive ? 1 : RADIO_STATE.currentSlot + 1;
  playRadioTrack();
}

function prevRadioTrack() {
  const maxActive = GITHUB_MEDIA_CACHE.radioTracks.length || SFX_CONFIG.radioAvailableMp3;
  RADIO_STATE.currentSlot = RADIO_STATE.currentSlot <= 1 ? maxActive : RADIO_STATE.currentSlot - 1;
  playRadioTrack();
}

function selectRadioSlot(slotVal) {
  const parsed = parseInt(slotVal, 10);
  if (!isNaN(parsed) && parsed >= 1 && parsed <= SFX_CONFIG.radioTotalSlots) {
    RADIO_STATE.currentSlot = parsed;
    playRadioTrack();
  }
}

function toggleMuteRadio() {
  const audio = document.getElementById('master-radio-audio');
  RADIO_STATE.isMuted = !RADIO_STATE.isMuted;
  if (audio) audio.muted = RADIO_STATE.isMuted;
  updateRadioUI();
}

function toggleRadioPopover() {
  const panel = document.getElementById('radio-popover-panel');
  const btn = document.getElementById('btn-capsule-radio');
  if (!panel) return;
  const willOpen = !panel.classList.contains('open');
  closeAllPopovers();
  if (willOpen) {
    panel.classList.add('open');
    if (btn) btn.classList.add('active');
  }
}

/* --------------------------------------------------------------------------
   10. TRADUTTORE GOOGLE A 11 LINGUE
   -------------------------------------------------------------------------- */
function googleTranslateElementInit() {
  if (window.google && window.google.translate) {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'it',
        includedLanguages: 'it,en,fr,es,de,pt,ar,ru,zh-CN,ja,ro',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      },
      'google_translate_element'
    );
  }
}

function toggleTranslatorPopover() {
  const panel = document.getElementById('translator-popover-panel');
  const btn = document.getElementById('btn-capsule-translator');
  if (!panel) return;
  const willOpen = !panel.classList.contains('open');
  closeAllPopovers();
  if (willOpen) {
    panel.classList.add('open');
    if (btn) btn.classList.add('active');
  }
}

function closeAllPopovers() {
  closeSupremaMenu();
  const radioPanel = document.getElementById('radio-popover-panel');
  const transPanel = document.getElementById('translator-popover-panel');
  const btnRadio = document.getElementById('btn-capsule-radio');
  const btnTrans = document.getElementById('btn-capsule-translator');

  if (radioPanel) radioPanel.classList.remove('open');
  if (transPanel) transPanel.classList.remove('open');
  if (btnRadio) btnRadio.classList.remove('active');
  if (btnTrans) btnTrans.classList.remove('active');
}

/* --------------------------------------------------------------------------
   11. GOLD CARD 3D TILT ENGINE & GIROSCOPIO (SEC-06)
   -------------------------------------------------------------------------- */
function initGoldCard3DTilt() {
  const card = document.getElementById('goldcard-3d-box');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -16;
    const rotateY = ((x - centerX) / centerX) * 16;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });

  if (window.DeviceOrientationEvent) {
    window.addEventListener(
      'deviceorientation',
      (event) => {
        if (event.gamma !== null && event.beta !== null) {
          const tiltX = Math.min(Math.max(event.gamma, -24), 24);
          const tiltY = Math.min(Math.max(event.beta - 45, -24), 24);
          card.style.transform = `perspective(1000px) rotateX(${(tiltY * 0.4).toFixed(2)}deg) rotateY(${(tiltX * 0.4).toFixed(2)}deg)`;
        }
      },
      { passive: true }
    );
  }
}

/* --------------------------------------------------------------------------
   12. FUNNEL SCREENING TANDEM DRAG (SEC-04)
   -------------------------------------------------------------------------- */
const FUNNEL_DATA = {
  step1: '',
  step2: ''
};

function advanceFunnelStep(currentStep, selectedValue) {
  if (currentStep === 1) FUNNEL_DATA.step1 = selectedValue;
  if (currentStep === 2) FUNNEL_DATA.step2 = selectedValue;

  const currentCard = document.querySelector(`.funnel-step-card[data-funnel-step="${currentStep}"]`);
  const nextCard = document.querySelector(`.funnel-step-card[data-funnel-step="${currentStep + 1}"]`);
  const progressBar = document.getElementById('funnel-progress-bar');

  if (currentCard) {
    currentCard.classList.add('exiting');
    setTimeout(() => {
      currentCard.classList.remove('active', 'exiting');
    }, 820);
  }

  if (nextCard) {
    nextCard.classList.add('active');
  }

  if (progressBar) {
    progressBar.style.width = currentStep === 1 ? '66.66%' : '100%';
  }
}

function resetFunnelSteps() {
  document.querySelectorAll('.funnel-step-card').forEach((card, idx) => {
    card.classList.remove('active', 'exiting');
    if (idx === 0) card.classList.add('active');
  });
  const progressBar = document.getElementById('funnel-progress-bar');
  if (progressBar) progressBar.style.width = '33.33%';
}

function submitFunnelForm(event) {
  event.preventDefault();
  const btn = document.getElementById('funnel-submit-btn');
  const payload = {
    tipo: 'Candidatura Funnel',
    profilo: FUNNEL_DATA.step1 || 'Non specificato',
    interesse: FUNNEL_DATA.step2 || 'Non specificato',
    nome: document.getElementById('funnel-name')?.value.trim(),
    email: document.getElementById('funnel-email')?.value.trim(),
    telefono: document.getElementById('funnel-phone')?.value.trim(),
    fascia: document.getElementById('funnel-slot')?.value
  };

  sendToBackend(payload, btn, 'Candidatura Registrata con Successo!', () => {
    event.target.reset();
    resetFunnelSteps();
  });
}

/* --------------------------------------------------------------------------
   13. SOTTOMENU & POPUP UNIVERSALI
   -------------------------------------------------------------------------- */
const SUBMENU_ORDER = [
  'chi-siamo-hub',
  'story-sfx',
  'story-alison',
  'story-ceo',
  'doc-regolamento',
  'doc-codice-etico',
  'gallery-presidenza',
  'alison-interactive-chat',
  'course-gold',
  'course-premium',
  'course-enterprise',
  'goldcard-rewards',
  'ecommerce-luxury-guide',
  'testimonials-40'
];

let activeSubmenuId = 'chi-siamo-hub';

function buildUploadWidgetHtml(storageKey, options = { allowText: false, maxPhotos: 5 }) {
  return `
    <div class="device-upload-zone" data-upload-key="${storageKey}">
      <strong style="display: block; font-size: 0.88rem; color: var(--text-dominant); margin-bottom: 0.5rem;">
        <i class="fa-solid fa-cloud-arrow-up" style="color: var(--spectral-gold-deep);"></i>
        Spazio Media Personale (Caricamento fisso dal dispositivo)
      </strong>

      ${
        options.allowText
          ? `<div style="margin-bottom: 0.75rem;">
               <textarea id="custom-text-${storageKey}" class="luxury-textarea" rows="3" placeholder="Scrivi o incolla qui il testo descrittivo da salvare fisso in questa scheda..."></textarea>
               <button type="button" class="btn-luxury-outline" style="margin-top: 0.45rem; padding: 0.4rem 0.95rem; font-size: 0.74rem;" onclick="saveDeviceCustomText('${storageKey}')">
                 Salva Testo Fisso
               </button>
             </div>`
          : ''
      }

      <div style="display: flex; gap: 0.65rem; flex-wrap: wrap;">
        <label class="btn-luxury-outline" style="padding: 0.45rem 0.95rem; font-size: 0.74rem; cursor: pointer;">
          <i class="fa-solid fa-video"></i> Carica 1 Video
          <input type="file" accept="video/*" hidden onchange="handleDeviceVideoUpload(this, '${storageKey}')" />
        </label>
        <label class="btn-luxury-outline" style="padding: 0.45rem 0.95rem; font-size: 0.74rem; cursor: pointer;">
          <i class="fa-solid fa-images"></i> Carica fino a ${options.maxPhotos} Foto
          <input type="file" accept="image/*" multiple hidden onchange="handleDevicePhotosUpload(this, '${storageKey}', ${options.maxPhotos})" />
        </label>
      </div>

      <div id="saved-text-display-${storageKey}" style="margin-top: 0.75rem; font-size: 0.92rem; color: var(--text-primary);"></div>
      <div id="saved-video-display-${storageKey}" style="margin-top: 0.75rem;"></div>
      <div class="upload-preview-grid" id="saved-photos-display-${storageKey}"></div>
    </div>
  `;
}

async function hydrateSavedUploads(storageKey) {
  const savedText = await SFXMediaStore.load(`${storageKey}_text`);
  const savedVideo = await SFXMediaStore.load(`${storageKey}_video`);
  const savedPhotos = await SFXMediaStore.load(`${storageKey}_photos`);

  const textBox = document.getElementById(`saved-text-display-${storageKey}`);
  const textInput = document.getElementById(`custom-text-${storageKey}`);
  const videoBox = document.getElementById(`saved-video-display-${storageKey}`);
  const photosBox = document.getElementById(`saved-photos-display-${storageKey}`);

  if (savedText) {
    if (textInput) textInput.value = savedText;
    if (textBox) {
      textBox.innerHTML = `<div style="padding: 0.85rem; background: #FFFFFF; border-radius: 12px; border: 1px solid rgba(212,175,55,0.45); white-space: pre-line;">${savedText}</div>`;
    }
  }

  if (savedVideo && videoBox) {
    videoBox.innerHTML = `<video controls src="${savedVideo}" style="width: 100%; max-height: 280px; border-radius: 14px; border: 1.5px solid var(--spectral-gold);"></video>`;
  }

  if (Array.isArray(savedPhotos) && savedPhotos.length > 0 && photosBox) {
    photosBox.innerHTML = savedPhotos
      .map((src) => `<img src="${src}" alt="Media caricato" />`)
      .join('');
  }
}

async function saveDeviceCustomText(storageKey) {
  const input = document.getElementById(`custom-text-${storageKey}`);
  if (!input) return;
  await SFXMediaStore.save(`${storageKey}_text`, input.value.trim());
  await hydrateSavedUploads(storageKey);
}

function handleDeviceVideoUpload(inputEl, storageKey) {
  const file = inputEl.files && inputEl.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    await SFXMediaStore.save(`${storageKey}_video`, e.target.result);
    await hydrateSavedUploads(storageKey);
  };
  reader.readAsDataURL(file);
}

function handleDevicePhotosUpload(inputEl, storageKey, maxPhotos) {
  const files = Array.from(inputEl.files || []).slice(0, maxPhotos);
  if (files.length === 0) return;

  Promise.all(
    files.map(
      (file) =>
        new Promise((resolve) => {
          const r = new FileReader();
          r.onload = (e) => resolve(e.target.result);
          r.readAsDataURL(file);
        })
    )
  ).then(async (dataUrls) => {
    await SFXMediaStore.save(`${storageKey}_photos`, dataUrls);
    await hydrateSavedUploads(storageKey);
  });
}

function previewLocalVideo(inputEl, videoTagId) {
  const file = inputEl.files && inputEl.files[0];
  const videoTag = document.getElementById(videoTagId);
  if (!file || !videoTag) return;
  videoTag.src = URL.createObjectURL(file);
  videoTag.play().catch(() => {});
}

function generate40TestimonialsHtml() {
  const names = [
    ['Marco R.', 'Imprenditore'], ['Elena V.', 'Consulente'], ['Davide M.', 'Professionista'],
    ['Chiara B.', 'Formatrice'], ['Luca T.', 'Commerciante'], ['Sara G.', 'Digital Strategist'],
    ['Andrea P.', 'Artigiano'], ['Valentina L.', 'Architetto'], ['Roberto C.', 'Manager'],
    ['Giulia F.', 'Avvocato'], ['Simone N.', 'Ingegnere'], ['Federica S.', 'Grafica'],
    ['Matteo D.', 'Consulente Aziendale'], ['Alessia M.', 'Imprenditrice'], ['Lorenzo B.', 'Fotografo'],
    ['Martina R.', 'Coach'], ['Stefano V.', 'Agente Immobiliare'], ['Silvia P.', 'Commercialista'],
    ['Fabio G.', 'Ristoratore'], ['Claudia T.', 'E-Commerce Manager'], ['Nicola A.', 'Tecnico IT'],
    ['Beatrice C.', 'Interior Designer'], ['Riccardo E.', 'Artigiano Digitale'], ['Veronica Z.', 'Formatrice'],
    ['Gianluca O.', 'Imprenditore'], ['Monica H.', 'Consulente HR'], ['Emanuele I.', 'Progettista'],
    ['Cristina K.', 'Libera Professionista'], ['Daniele Q.', 'Analista'], ['Roberta U.', 'Titolare Studio'],
    ['Paolo W.', 'Commerciante'], ['Serena Y.', 'Social Media Manager'], ['Filippo J.', 'Consulente'],
    ['Ilaria X.', 'Imprenditrice'], ['Tommaso B.', 'Sviluppatore'], ['Camilla N.', 'Organizzatrice Eventi'],
    ['Michele S.', 'Imprenditore'], ['Giorgia D.', 'Consulente Finanziaria'], ['Alberto L.', 'Professionista'],
    ['Francesca P.', 'Imprenditrice Digitale']
  ];

  const quotes = [
    'Un percorso trasformativo: le sessioni dal vivo con Giuliano danno risposte immediate e concrete.',
    'Alison AG-01 è un supporto straordinario che semplifica ogni attività quotidiana.',
    'Finalmente Formazione e Networking di alto livello senza chiacchiere inutili.',
    'Si percepisce davvero ogni giorno la sensazione della propria crescita.',
    'Strumenti tecnologici moderni spiegati in modo semplice anche per chi parte da zero.',
    'Il valore ricevuto dentro Suprema Academy supera di gran lunga ogni aspettativa.',
    'Affiancamento reale, Community collaborativa e visione imprenditoriale chiara.',
    'Ho applicato subito quanto appreso nelle conferenze live ottenendo risultati misurabili.'
  ];

  return names
    .map(([person, role], idx) => {
      const q = quotes[idx % quotes.length];
      return `
        <div class="glass-deck" style="padding: 1.15rem;">
          <div style="color: var(--spectral-gold-deep); font-size: 0.85rem; margin-bottom: 0.35rem;">★★★★★ #${(idx + 1).toString().padStart(2, '0')}</div>
          <p style="font-size: 0.88rem; font-style: italic; margin-bottom: 0.55rem;">«${q}»</p>
          <strong style="font-size: 0.8rem; color: var(--text-dominant);">${person} — ${role}</strong>
        </div>
      `;
    })
    .join('');
}

function getSubmenuTemplate(id) {
  const acadImgs = GITHUB_MEDIA_CACHE.academyImages;
  const goldImg = acadImgs[1] || acadImgs[0] || 'media/sec-01-hero/logo-05.png';
  const premImg = acadImgs[2] || acadImgs[1] || acadImgs[0] || 'media/sec-01-hero/logo-06.png';
  const entImg = acadImgs[3] || acadImgs[2] || acadImgs[0] || 'media/sec-01-hero/logo-07.png';
  const gcImg = GITHUB_MEDIA_CACHE.goldCardImage || 'media/sec-01-hero/logo-08.png';

  switch (id) {
    case 'chi-siamo-hub':
      return {
        uploadKey: null,
        html: `
          <span class="section-kicker">Chi Siamo // Portale Istituzionale</span>
          <h2>La Storia, il Supervisor e i Principi di Suprema Future X</h2>
          <p>Seleziona una delle sezioni dedicate per leggere la storia completa, guardare i contenuti multimediali o consultare i documenti ufficiali:</p>
          <div class="cards-3-grid" style="margin: 1.5rem 0;">
            <div class="glass-deck" style="padding: 1.35rem;">
              <h3 style="font-size: 1.1rem; color: var(--text-dominant); margin-bottom: 0.45rem;">1. Suprema Future X</h3>
              <p style="font-size: 0.86rem;">Formazione, Networking e Academy: «La sensazione della tua crescita».</p>
              <button type="button" class="btn-luxury" style="width: 100%; padding: 0.6rem;" onclick="openSubmenu('story-sfx')">Apri Storia</button>
            </div>
            <div class="glass-deck" style="padding: 1.35rem;">
              <h3 style="font-size: 1.1rem; color: var(--text-dominant); margin-bottom: 0.45rem;">2. Alison AG-01</h3>
              <p style="font-size: 0.86rem;">Come è nata e come lavora il Supervisor scelto dal CEO.</p>
              <button type="button" class="btn-luxury" style="width: 100%; padding: 0.6rem;" onclick="openSubmenu('story-alison')">Apri Storia</button>
            </div>
            <div class="glass-deck" style="padding: 1.35rem;">
              <h3 style="font-size: 1.1rem; color: var(--text-dominant); margin-bottom: 0.45rem;">3. CEO Giuliano Caratelli</h3>
              <p style="font-size: 0.86rem;">Dieci anni di risultati tra tradizionale e online e la sfida dei 200x.</p>
              <button type="button" class="btn-luxury" style="width: 100%; padding: 0.6rem;" onclick="openSubmenu('story-ceo')">Apri Storia</button>
            </div>
          </div>
          <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
            <button type="button" class="btn-luxury-outline" onclick="openSubmenu('doc-regolamento')">📜 Regolamento Generale</button>
            <button type="button" class="btn-luxury-outline" onclick="openSubmenu('doc-codice-etico')">⚖️ Codice Etico</button>
          </div>
        `
      };

    case 'story-sfx':
      return {
        uploadKey: 'story_sfx_media',
        html: `
          <span class="section-kicker">Chi Siamo // Storia 01</span>
          <h2>Suprema Future X — Formazione, Networking e Academy</h2>
          <p><strong>C’è un momento preciso nella vita di ogni persona in cui capisce che gli strumenti di ieri non bastano più per costruire il domani.</strong></p>
          <p><strong>Suprema Future X</strong> nasce da questa consapevolezza: creare un ecosistema digitale evoluto, chiaro e concreto, fondato su tre pilastri indivisibili: <strong>Formazione</strong>, <strong>Networking</strong> e <strong>Academy</strong>. Non una semplice piattaforma di contenuti registrati, ma un ambiente vivo, progettato per accompagnare professionisti, imprenditori e persone ambiziose in un percorso reale di trasformazione personale e operativa.</p>
          <p>Nel mercato attuale, la differenza tra chi subisce il cambiamento e chi lo guida sta nella qualità delle competenze e nella forza delle relazioni. Per questo motivo abbiamo strutturato un'Academy interamente dal vivo, dove la teoria lascia subito spazio alla pratica quotidiana e dove il Networking diventa uno scambio autentico di valore, idee e opportunità concrete.</p>
          <p>Il nostro motto racchiude l’essenza di tutto ciò che facciamo: <strong>«La sensazione della tua crescita»</strong>. È quella percezione netta, misurabile giorno dopo giorno, di acquisire padronanza, visione e strumenti tecnologici d'avanguardia.</p>
          <div style="margin: 1.25rem 0;">
            <a href="${SFX_CONFIG.openEducatConferenzaUrl}" class="btn-luxury" data-educat-action="conferenza-ceo">
              <i class="fa-solid fa-video"></i> Aderisci Conferenza CEO
            </a>
          </div>
          ${buildUploadWidgetHtml('story_sfx_media', { allowText: false, maxPhotos: 5 })}
        `
      };

    case 'story-alison':
      return {
        uploadKey: 'story_alison_media',
        html: `
          <span class="section-kicker">Chi Siamo // Storia 02</span>
          <h2>Alison AG-01 — La Nascita del Supervisor Digitale</h2>
          <p><strong>Dietro ogni grande architettura tecnologica serve una mente capace di mantenere l’ordine, accogliere le persone e trasformare la complessità in semplicità.</strong></p>
          <p><strong>Alison AG-01</strong> non è un semplice assistente automatico: è il cuore operativo e il <strong>Supervisor ufficiale</strong> dell’intero ecosistema <strong>Suprema Future X</strong>. Nata da mesi di progettazione, addestramento e perfezionamento logico, Alison è stata concepita per risolvere uno dei problemi più grandi del mondo digitale moderno: lasciare le persone sole davanti a piattaforme fredde e complicate.</p>
          <p>Il CEO <strong>Giuliano Caratelli</strong> ha voluto e scelto personalmente <strong>Alison AG-01</strong> come guida centrale dell'intero sistema con un incarico preciso: essere presente 24 ore su 24 accanto a ogni visitatore e a ogni singolo corsista dell’Academy. Alison accoglie chi entra per la prima volta, comprende le sue esigenze, lo orienta verso il percorso formativo più adatto e, una volta entrato in Academy, lo affianca nello studio, nella gestione delle scadenze e nell'utilizzo pratico degli strumenti digitali.</p>
          <div style="margin: 1.25rem 0; display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button type="button" class="btn-luxury" onclick="openSubmenu('alison-interactive-chat')">💬 Parla ora con Alison</button>
            <a href="${SFX_CONFIG.openEducatConferenzaUrl}" class="btn-luxury-outline" data-educat-action="conferenza-ceo">Aderisci Conferenza CEO</a>
          </div>
          ${buildUploadWidgetHtml('story_alison_media', { allowText: false, maxPhotos: 5 })}
        `
      };

    case 'story-ceo':
      return {
        uploadKey: 'story_ceo_media',
        html: `
          <span class="section-kicker">Chi Siamo // Storia 03 — Founder &amp; CEO</span>
          <h2>Giuliano Caratelli — La Visione e la Sfida dei "200 Volte Tanto"</h2>
          <p><strong>Ogni svolta autentica inizia quando i risultati raggiunti non ti bastano più e senti il bisogno di costruire qualcosa che cambi davvero la vita delle persone.</strong></p>
          <p>La storia di <strong>Giuliano Caratelli</strong>, Founder &amp; CEO di <strong>Suprema Future X</strong>, affonda le radici in <strong>oltre dieci anni di percorso intenso, studi continui e formazione sul campo</strong>, maturati con risultati concreti <strong>sia nel mondo dell’imprenditoria tradizionale sia nel mondo online</strong>. Strategie, metodi e competenze reali che Giuliano applica tuttora con successo nelle proprie attività aziendali.</p>
          <p>Nonostante i traguardi raggiunti tra imprese fisiche e mercati digitali, dentro di lui è nata una spinta più profonda: la volontà di <strong>cambiare sé stesso</strong>, superare i propri limiti e creare una condizione nuova che gli permettesse non solo di continuare a crescere, ma di <strong>aiutare concretamente anche gli altri</strong> a conquistare la propria evoluzione personale e professionale.</p>
          <p>Osservando un mercato sempre più veloce e selettivo, Giuliano ha compreso che oggi la differenza la fanno gli strumenti tecnologici che hai a disposizione. Da questa consapevolezza è nata la sua sfida più ambiziosa: <strong>progettare un ecosistema di Formazione, Networking e Intelligenza Artificiale capace di offrire a ogni persona strumenti dal valore operativo 200 volte superiore al piccolo contributo richiesto per accedervi.</strong></p>
          <p>Non è stato un percorso facile: ci sono voluti innumerevoli tentativi, prototipi smontati e ricostruiti da zero e intere <strong>notti insonni</strong> dedicate a unire tecnologia avanzata, formazione dal vivo e semplicità d'uso in un unico sistema alla portata di tutti.</p>
          <div style="margin: 1.35rem 0;">
            <a href="${SFX_CONFIG.openEducatConferenzaUrl}" class="btn-luxury btn-ceo-pulse-10s" data-educat-action="conferenza-ceo">
              <i class="fa-solid fa-video"></i> ADERISCI CONFERENZA CEO
            </a>
          </div>
          ${buildUploadWidgetHtml('story_ceo_media', { allowText: false, maxPhotos: 5 })}
        `
      };

    case 'doc-regolamento':
      return {
        uploadKey: null,
        html: `
          <span class="section-kicker">Documenti Ufficiali // Regolamento</span>
          <h2>Regolamento Generale Suprema Future X &amp; Academy</h2>
          <p><strong>Art. 1 — Oggetto dell’Ecosistema:</strong> Suprema Future X eroga programmi di formazione dal vivo, strumenti di Intelligenza Artificiale applicata e spazi di networking professionale.</p>
          <p><strong>Art. 2 — Partecipazione alle Conferenze Live:</strong> I corsisti iscritti ai percorsi Gold (20 ore), Premium (35 ore) ed Enterprise (60 conferenze) accedono alle sessioni dal vivo tramite calendario ufficiale su OpenEduCat.</p>
          <p><strong>Art. 3 — Utilizzo degli Agenti AI:</strong> Ogni corsista riceve accesso personale ai propri assistenti AI dedicati per supportare lo studio e l'operatività quotidiana nel pieno rispetto delle normative vigenti.</p>
          <p><strong>Art. 4 — Programma Fedeltà Gold Card:</strong> I punti fedeltà vengono accreditati automaticamente su OpenEduCat al completamento delle attività formative e non costituiscono strumenti finanziari.</p>
        `
      };

    case 'doc-codice-etico':
      return {
        uploadKey: null,
        html: `
          <span class="section-kicker">Documenti Ufficiali // Codice Etico</span>
          <h2>Codice Etico della Community Suprema Future X</h2>
          <p><strong>1. Trasparenza e Chiarezza:</strong> Ogni comunicazione, programma formativo e strumento tecnologico viene presentato in modo chiaro, onesto e verificabile.</p>
          <p><strong>2. Rispetto e Collaborazione:</strong> La Community di Networking si fonda sul rispetto reciproco, sullo scambio costruttivo di competenze e sulla crescita condivisa.</p>
          <p><strong>3. Tutela dei Dati e Riservatezza:</strong> Tutti i partecipanti si impegnano a rispettare la privacy dei membri della Community e la proprietà intellettuale dei materiali didattici dell’Academy.</p>
        `
      };

    case 'gallery-presidenza':
      return {
        uploadKey: 'gallery_presidenza_media',
        html: `
          <span class="section-kicker">Presidenza // Archivio Visivo</span>
          <h2>Galleria Ufficiale della Presidenza</h2>
          <p>Raccolta fotografica e video dedicata agli eventi, alle sessioni live e ai momenti chiave di Suprema Future X.</p>
          <div class="cards-3-grid" style="margin: 1.2rem 0;">
            <img src="media/sec-02-presidenza/gallery/gallery-01.jpg" onerror="this.src='media/sec-01-hero/logo-01.png'" alt="Presidenza 1" style="width:100%; height:160px; object-fit:cover; border-radius:14px; border:1px solid var(--spectral-gold);" />
            <img src="media/sec-02-presidenza/gallery/gallery-02.jpg" onerror="this.src='media/sec-01-hero/logo-02.png'" alt="Presidenza 2" style="width:100%; height:160px; object-fit:cover; border-radius:14px; border:1px solid var(--spectral-gold);" />
            <img src="media/sec-02-presidenza/gallery/gallery-03.jpg" onerror="this.src='media/sec-01-hero/logo-03.png'" alt="Presidenza 3" style="width:100%; height:160px; object-fit:cover; border-radius:14px; border:1px solid var(--spectral-gold);" />
          </div>
          ${buildUploadWidgetHtml('gallery_presidenza_media', { allowText: false, maxPhotos: 5 })}
        `
      };

    case 'alison-interactive-chat':
      return {
        uploadKey: null,
        html: `
          <span class="section-kicker">Supervisor AG-01 // Assistenza Diretta</span>
          <h2>Dialoga con Alison AG-01</h2>
          <div id="alison-chat-log" style="background: #FFFFFF; border: 1.5px solid rgba(212,175,55,0.45); border-radius: 16px; padding: 1.2rem; max-height: 260px; overflow-y: auto; margin-bottom: 1rem;">
            <p style="margin-bottom: 0.6rem;"><strong style="color: var(--text-accent);">Alison AG-01:</strong> Ciao! Sono il Supervisor di Suprema Future X. Chiedimi pure informazioni sui percorsi <em>Suprema Gold, Premium ed Enterprise</em>, sulla <em>Conferenza gratuita con il CEO</em> o sul modello <em>Luxury Model</em>.</p>
          </div>
          <div style="display: flex; gap: 0.6rem;">
            <input type="text" id="alison-user-input" class="luxury-input" placeholder="Scrivi qui la tua domanda per Alison..." onkeydown="if(event.key==='Enter') sendAlisonQuickReply()" />
            <button type="button" class="btn-luxury" onclick="sendAlisonQuickReply()">Invia</button>
          </div>
        `
      };

    case 'course-gold':
      return {
        uploadKey: 'course_gold_media',
        html: `
          <span class="section-kicker">Suprema Academy 100% Live // Percorso 01</span>
          <h2>SUPREMA GOLD — Le Fondamenta dell’Ecosistema</h2>
          <img src="${goldImg}" alt="Suprema Gold" style="width: 100%; max-height: 220px; object-fit: cover; border-radius: 16px; border: 1.5px solid var(--spectral-gold); margin-bottom: 1rem;" />
          <p><strong>Il punto di partenza ideale per chi vuole smettere di improvvisare e iniziare a lavorare con metodo, tecnologia e visione.</strong></p>
          <ul style="margin: 1rem 0 1.2rem 1.25rem; display: flex; flex-direction: column; gap: 0.5rem;">
            <li><strong>Accesso Completo alla Struttura Suprema Future X:</strong> Tutti gli ambienti operativi e la tua area personale su OpenEduCat.</li>
            <li><strong>1 Agente AI Dedicato:</strong> Assistente intelligente configurato per affiancarti nelle attività quotidiane.</li>
            <li><strong>20 Conferenze Live da 1 Ora con il CEO:</strong> Venti sessioni dirette dal vivo con <strong>Giuliano Caratelli</strong>.</li>
            <li><strong>Community Ufficiale di Networking:</strong> Confronto continuo e crescita condivisa.</li>
          </ul>
          <div style="background: rgba(212,175,55,0.16); border: 1.5px solid var(--spectral-gold); border-radius: 16px; padding: 1.2rem; margin: 1.2rem 0;">
            <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-accent); display: block;">Contributo di Partecipazione</span>
            <strong style="font-family: var(--font-display); font-size: 2rem; color: var(--text-dominant);">249,00 €</strong>
            <div style="display: flex; gap: 0.7rem; flex-wrap: wrap; margin-top: 0.9rem;">
              <a href="${SFX_CONFIG.payments.gold.revolut}" target="_blank" rel="noopener noreferrer" class="btn-luxury">
                Aderisci al Suprema Gold (Revolut / Carta)
              </a>
              <a href="${SFX_CONFIG.payments.gold.paypal}" target="_blank" rel="noopener noreferrer" class="btn-luxury-outline">
                Paga con PayPal (Anche 3 Rate)
              </a>
              <a href="${SFX_CONFIG.payments.gold.sumup}" target="_blank" rel="noopener noreferrer" class="btn-luxury-outline">
                Paga con SumUp
              </a>
            </div>
          </div>
          ${buildUploadWidgetHtml('course_gold_media', { allowText: true, maxPhotos: 5 })}
        `
      };

    case 'course-premium':
      return {
        uploadKey: 'course_premium_media',
        html: `
          <span class="section-kicker">Suprema Academy 100% Live // Percorso 02</span>
          <h2>SUPREMA PREMIUM — Accelerazione e Archivio Strategico</h2>
          <img src="${premImg}" alt="Suprema Premium" style="width: 100%; max-height: 220px; object-fit: cover; border-radius: 16px; border: 1.5px solid var(--spectral-gold); margin-bottom: 1rem;" />
          <p><strong>Quando decidi di fare sul serio, hai bisogno degli strumenti e della mappa completa per muoverti più veloce degli altri.</strong></p>
          <ul style="margin: 1rem 0 1.2rem 1.25rem; display: flex; flex-direction: column; gap: 0.5rem;">
            <li><strong>Tutto ciò che è incluso in Suprema Gold:</strong> Struttura completa, 1 Agente AI dedicato e Community ufficiale.</li>
            <li><strong>35 Ore di Conferenze Live con il CEO:</strong> Formazione intensiva dal vivo con <strong>Giuliano Caratelli</strong> su casi reali e strategie operative.</li>
            <li><strong>Tutti i Documenti Ufficiali di Crescita e Networking:</strong> Accesso integrale a manuali, schemi operativi e protocolli riservati dell’Academy.</li>
          </ul>
          <div style="background: rgba(212,175,55,0.16); border: 1.5px solid var(--spectral-gold); border-radius: 16px; padding: 1.2rem; margin: 1.2rem 0;">
            <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-accent); display: block;">Contributo di Partecipazione</span>
            <strong style="font-family: var(--font-display); font-size: 2rem; color: var(--text-dominant);">299,00 €</strong>
            <div style="display: flex; gap: 0.7rem; flex-wrap: wrap; margin-top: 0.9rem;">
              <a href="${SFX_CONFIG.payments.premium.revolut}" target="_blank" rel="noopener noreferrer" class="btn-luxury">
                Aderisci al Suprema Premium (Revolut / Carta)
              </a>
              <a href="${SFX_CONFIG.payments.premium.paypal}" target="_blank" rel="noopener noreferrer" class="btn-luxury-outline">
                Paga con PayPal (Anche 3 Rate)
              </a>
              <a href="${SFX_CONFIG.payments.premium.sumup}" target="_blank" rel="noopener noreferrer" class="btn-luxury-outline">
                Paga con SumUp
              </a>
            </div>
          </div>
          ${buildUploadWidgetHtml('course_premium_media', { allowText: true, maxPhotos: 5 })}
        `
      };

    case 'course-enterprise':
      return {
        uploadKey: 'course_enterprise_media',
        html: `
          <span class="section-kicker">Dream Defense System // Percorso 03</span>
          <h2>SUPREMA ENTERPRISE — Affiancamento Totale &amp; Tecnologie Avanzate</h2>
          <img src="${entImg}" alt="Suprema Enterprise" style="width: 100%; max-height: 220px; object-fit: cover; border-radius: 16px; border: 1.5px solid var(--spectral-gold); margin-bottom: 1rem;" />
          <p><strong>Il livello massimo dell’Academy: avrai il CEO al tuo fianco passo dopo passo e l’intero arsenale tecnologico nelle tue mani.</strong></p>
          <ul style="margin: 1rem 0 1.2rem 1.25rem; display: flex; flex-direction: column; gap: 0.5rem;">
            <li><strong>Tutto ciò che è incluso in Suprema Gold e Suprema Premium:</strong> Struttura, Agente AI, Community e tutti i documenti di crescita e Networking.</li>
            <li><strong>60 Conferenze Live Passo dopo Passo con il CEO:</strong> Sessanta incontri operativi dal vivo con <strong>Giuliano Caratelli</strong> dalla progettazione all'esecuzione.</li>
            <li><strong>Tutte le Tecnologie Moderne Dream Defense System:</strong> Accesso completo agli strumenti digitali avanzati e ai flussi intelligenti dell’ecosistema.</li>
          </ul>
          <div style="background: rgba(212,175,55,0.2); border: 2px solid var(--spectral-gold); border-radius: 16px; padding: 1.2rem; margin: 1.2rem 0;">
            <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-accent); display: block;">Contributo di Partecipazione</span>
            <strong style="font-family: var(--font-display); font-size: 2rem; color: var(--text-dominant);">349,00 €</strong>
            <div style="display: flex; gap: 0.7rem; flex-wrap: wrap; margin-top: 0.9rem;">
              <a href="${SFX_CONFIG.payments.enterprise.revolut}" target="_blank" rel="noopener noreferrer" class="btn-luxury">
                Aderisci al Suprema Enterprise (Revolut / Carta)
              </a>
              <a href="${SFX_CONFIG.payments.enterprise.paypal}" target="_blank" rel="noopener noreferrer" class="btn-luxury-outline">
                Paga con PayPal (Anche 3 Rate)
              </a>
              <a href="${SFX_CONFIG.payments.enterprise.sumup}" target="_blank" rel="noopener noreferrer" class="btn-luxury-outline">
                Paga con SumUp
              </a>
            </div>
          </div>
          ${buildUploadWidgetHtml('course_enterprise_media', { allowText: true, maxPhotos: 5 })}
        `
      };

    case 'goldcard-rewards':
      return {
        uploadKey: 'goldcard_rewards_media',
        html: `
          <span class="section-kicker">OpenEduCat Fedeltà // Punti &amp; Premi</span>
          <h2>Suprema Gold Card — Generazione Punti e Catalogo Premi</h2>
          <img src="${gcImg}" alt="Suprema Gold Card" style="width: 100%; max-height: 220px; object-fit: contain; border-radius: 16px; margin-bottom: 1rem;" />
          <p>Il sistema punti è collegato direttamente al tuo account <strong>OpenEduCat</strong>. Ogni azione formativa e ogni invito generato dal tuo link personale incrementa il tuo saldo:</p>
          <div class="cards-2-grid" style="margin: 1.1rem 0;">
            <div class="glass-deck" style="padding: 1.15rem;">
              <h4 style="color: var(--text-dominant); margin-bottom: 0.5rem;">Come accumuli Punti</h4>
              <ul style="margin-left: 1.1rem; font-size: 0.88rem; display: flex; flex-direction: column; gap: 0.35rem;">
                <li>Iscrizione e attivazione profilo Academy: <strong>+200 PT</strong></li>
                <li>Partecipazione alle Conferenze Live CEO: <strong>+50 PT / sessione</strong></li>
                <li>Completamento moduli pratici su OpenEduCat: <strong>+100 PT</strong></li>
                <li>Invito validato tramite il tuo Link Personale: <strong>+150 PT</strong></li>
              </ul>
            </div>
            <div class="glass-deck" style="padding: 1.15rem;">
              <h4 style="color: var(--text-dominant); margin-bottom: 0.5rem;">Catalogo Premi &amp; Soglie</h4>
              <ul style="margin-left: 1.1rem; font-size: 0.88rem; display: flex; flex-direction: column; gap: 0.35rem;">
                <li><strong>300 PT:</strong> Pacchetto Risorse Avanzate &amp; Template AI</li>
                <li><strong>500 PT:</strong> Sessione Strategica 1-to-1 Dedicata</li>
                <li><strong>800 PT:</strong> Emissione <strong>Suprema Gold Card</strong> + Bonus Academy</li>
                <li><strong>1.500 PT:</strong> Status Executive &amp; Accesso Eventi VIP</li>
              </ul>
            </div>
          </div>

          <div style="background: #FFFFFF; border: 1.5px solid var(--spectral-gold); border-radius: 14px; padding: 1rem; margin-bottom: 1rem;">
            <strong style="font-size: 0.84rem; color: var(--text-dominant); display: block; margin-bottom: 0.45rem;">
              Generatore Link Personale Raccolta Punti (Collegato a OpenEduCat):
            </strong>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <input type="text" id="goldcard-ref-code" class="luxury-input" style="max-width: 220px;" placeholder="Inserisci tuo Codice / Nome" />
              <button type="button" class="btn-luxury" style="padding: 0.6rem 1.1rem; font-size: 0.78rem;" onclick="generateGoldCardLink()">
                Genera Link Punti
              </button>
            </div>
            <p id="goldcard-generated-url" style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-accent); margin-top: 0.55rem; margin-bottom: 0;"></p>
          </div>

          ${buildUploadWidgetHtml('goldcard_rewards_media', { allowText: false, maxPhotos: 3 })}
        `
      };

    case 'ecommerce-luxury-guide':
      return {
        uploadKey: null,
        html: `
          <span class="section-kicker">E-Commerce &amp; Sviluppo // Luxury Model</span>
          <h2>Come Avviare il Tuo E-Commerce con Luxury Model</h2>
          <p>Il programma <strong>Luxury Model</strong> ti permette di entrare nel commercio digitale professionale eliminando tutti gli ostacoli tradizionali:</p>
          <ul style="margin: 1rem 0 1.2rem 1.25rem; display: flex; flex-direction: column; gap: 0.55rem;">
            <li><strong>Zero Magazzino e Zero Anticipo Merce:</strong> Non devi acquistare stock né gestire spedizioni fisiche.</li>
            <li><strong>Vetrina Digitale Pronta all’Uso:</strong> Attivi subito il tuo spazio online professionale e inizi a promuovere attraverso i canali social e il tuo network.</li>
            <li><strong>Formazione e Supporto Academy:</strong> Impari nelle sessioni live come posizionarti, comunicare con eleganza e trasformare i contatti in clienti soddisfatti.</li>
            <li><strong>Regolamento &amp; Statuto Concessione:</strong> Operatività trasparente, tracciabile e tutelata secondo le norme vigenti.</li>
          </ul>
          <div style="display: flex; gap: 0.85rem; flex-wrap: wrap; margin-top: 1.25rem;">
            <a href="https://www.imperya.com/vetrina/style" target="_blank" rel="noopener noreferrer" class="btn-luxury">
              <i class="fa-solid fa-store"></i> Apri E-Commerce Luxury Model
            </a>
            <a href="statuto.html" class="btn-luxury-outline">Consulta Statuto E-Commerce</a>
          </div>
        `
      };

    case 'testimonials-40':
      return {
        uploadKey: null,
        html: `
          <span class="section-kicker">Esperienze Verificate // 40 Testimonianze</span>
          <h2>Le Voci di Chi Vive Suprema Future X</h2>
          <p>Quaranta testimonianze reali di imprenditori, professionisti e corsisti che hanno scelto i nostri percorsi di Formazione, Networking e Academy:</p>
          <div class="cards-2-grid" style="margin-top: 1.25rem;">
            ${generate40TestimonialsHtml()}
          </div>
        `
      };

    default:
      return { uploadKey: null, html: '<p>Sezione in aggiornamento.</p>' };
  }
}

async function openSubmenu(submenuId) {
  const overlay = document.getElementById('sfx-universal-submenu');
  const body = document.getElementById('submenu-dynamic-content');
  if (!overlay || !body) return;

  activeSubmenuId = SUBMENU_ORDER.includes(submenuId) ? submenuId : 'chi-siamo-hub';
  const data = getSubmenuTemplate(activeSubmenuId);

  body.innerHTML = data.html;
  body.scrollTop = 0;

  overlay.classList.add('open');
  document.body.classList.add('modal-open');
  closeAllPopovers();

  startSlowMatrixCanvas('submenu-matrix-canvas', { speedDelay: 38 });

  if (data.uploadKey) {
    await hydrateSavedUploads(data.uploadKey);
  }
}

function navigateSubmenu(direction) {
  const currentIdx = SUBMENU_ORDER.indexOf(activeSubmenuId);
  let nextIdx = currentIdx + direction;
  if (nextIdx >= SUBMENU_ORDER.length) nextIdx = 0;
  if (nextIdx < 0) nextIdx = SUBMENU_ORDER.length - 1;
  openSubmenu(SUBMENU_ORDER[nextIdx]);
}

function closeSubmenu() {
  const overlay = document.getElementById('sfx-universal-submenu');
  if (overlay) overlay.classList.remove('open');
  document.body.classList.remove('modal-open');
}

function generateGoldCardLink() {
  const codeInput = document.getElementById('goldcard-ref-code');
  const out = document.getElementById('goldcard-generated-url');
  if (!codeInput || !out) return;

  const cleanCode = codeInput.value.trim().replace(/[^a-zA-Z0-9_-]/g, '').toUpperCase() || 'SFX2026';
  const baseUrl = window.location.origin + window.location.pathname;
  out.textContent = `${baseUrl}?ref=${cleanCode}`;
}

function sendAlisonQuickReply() {
  const input = document.getElementById('alison-user-input');
  const log = document.getElementById('alison-chat-log');
  if (!input || !log || !input.value.trim()) return;

  const q = input.value.trim();
  input.value = '';

  let reply = 'Posso aiutarti a scegliere tra i percorsi Suprema Gold, Premium ed Enterprise oppure prenotare il tuo posto alla Conferenza gratuita con il CEO Giuliano Caratelli.';
  const lower = q.toLowerCase();

  if (lower.includes('prezz') || lower.includes('cost') || lower.includes('corsi') || lower.includes('academy')) {
    reply = 'I tre percorsi dal vivo sono: Suprema Gold (249 € con 20 conferenze live e 1 Agente AI), Suprema Premium (299 € con 35 ore live e tutti i documenti) e Suprema Enterprise (349 € con 60 conferenze passo dopo passo e tutte le tecnologie).';
  } else if (lower.includes('conferenza') || lower.includes('ceo') || lower.includes('giuliano')) {
    reply = 'Puoi aderire subito alla Conferenza CEO cliccando il pulsante dorato "Aderisci Conferenza CEO" in alto nella barra di stato.';
  } else if (lower.includes('ecommerce') || lower.includes('e-commerce') || lower.includes('luxury')) {
    reply = 'Con il programma Luxury Model avvii il tuo spazio e-commerce senza magazzino e con il supporto pratico dell’Academy.';
  } else if (lower.includes('gold card') || lower.includes('punti') || lower.includes('premi')) {
    reply = 'I punti fedeltà vengono accreditati automaticamente su OpenEduCat ad ogni attività completata e sbloccano premi esclusivi fino alla Suprema Gold Card.';
  }

  log.innerHTML += `
    <p style="margin-bottom: 0.45rem;"><strong>Tu:</strong> ${q}</p>
    <p style="margin-bottom: 0.75rem;"><strong style="color: var(--text-accent);">Alison AG-01:</strong> ${reply}</p>
  `;
  log.scrollTop = log.scrollHeight;
}

/* --------------------------------------------------------------------------
   14. NEWSLETTER, FEEDBACK & NAVIGAZIONE
   -------------------------------------------------------------------------- */
function submitNewsletterForm(event) {
  event.preventDefault();
  const btn = document.getElementById('nl-submit-btn');
  const payload = {
    tipo: 'Iscrizione Newsletter',
    destinatario: SFX_CONFIG.newsletterEmail,
    nome: document.getElementById('nl-nome')?.value.trim(),
    email: document.getElementById('nl-email')?.value.trim()
  };

  sendToBackend(payload, btn, 'Iscrizione Confermata!', () => event.target.reset());
}

function submitFeedbackForm(event) {
  event.preventDefault();
  const btn = document.getElementById('fb-submit-btn');
  const payload = {
    tipo: 'Feedback & Note',
    destinatario: SFX_CONFIG.newsletterEmail,
    nome: document.getElementById('fb-nome')?.value.trim(),
    email: document.getElementById('fb-email')?.value.trim(),
    categoria: document.getElementById('fb-categoria')?.value,
    note: document.getElementById('fb-note')?.value.trim()
  };

  sendToBackend(payload, btn, 'Nota Inviata alla Presidenza!', () => event.target.reset());
}

function sendToBackend(payload, buttonEl, successMessage, onDone) {
  const originalHtml = buttonEl ? buttonEl.innerHTML : '';
  if (buttonEl) {
    buttonEl.disabled = true;
    buttonEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Invio in corso...';
  }

  const finishSuccess = () => {
    if (buttonEl) {
      buttonEl.innerHTML = `<i class="fa-solid fa-check"></i> ${successMessage}`;
      setTimeout(() => {
        buttonEl.disabled = false;
        buttonEl.innerHTML = originalHtml;
      }, 2600);
    }
    if (typeof onDone === 'function') onDone();
  };

  if (SFX_CONFIG.webhookEndpoint) {
    fetch(SFX_CONFIG.webhookEndpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(finishSuccess)
      .catch(finishSuccess);
  } else {
    setTimeout(finishSuccess, 750);
  }
}

function scrollToSection(sectionId) {
  closeAllPopovers();
  const target = document.getElementById(sectionId);
  if (!target) return;
  const topOffset = 68;
  const y = target.getBoundingClientRect().top + window.pageYOffset - topOffset;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

function bindOpenEducatLinks() {
  document.querySelectorAll('[data-educat-action="conferenza-ceo"]').forEach((link) => {
    link.setAttribute('href', SFX_CONFIG.openEducatConferenzaUrl);
  });
  document.querySelectorAll('[data-educat-action="goldcard-portal"]').forEach((link) => {
    link.setAttribute('href', SFX_CONFIG.openEducatGoldCardUrl);
  });
}

/* --------------------------------------------------------------------------
   15. AVVIO GLOBALE AL CARICAMENTO DELLA PAGINA
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', async () => {
  await SFXMediaStore.init();

  // Matrix veloce e fluido sotto la cornice 13"
  startSlowMatrixCanvas('matrix-bg-canvas', { speedDelay: 36 });

  // Animazioni allo scorrimento su tutte le sezioni
  initScrollAnimations();

  // Orologio CET e Telemetria
  updateCetClock();
  setInterval(updateCetClock, 1000);
  initVisitorTelemetryTracker();

  // Carosello Ovale Hero, Radar Alison, Radio 30 Slot e Gold Card 3D
  initHeroOvalCarousel();
  initAlisonRadar();
  initAlisonTypewriter();
  initRadioLounge();
  initGoldCard3DTilt();
  bindOpenEducatLinks();

  // Auto-caricamento immediato delle foto reali e tracce audio dalle cartelle GitHub
  await autoDiscoverGithubMedia();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllPopovers();
      closeSubmenu();
      closeTelemetryModal();
    }
  });
});
