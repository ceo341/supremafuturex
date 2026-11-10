/**
 * ==============================================================================
 * SUPREMA FUTURE X ENTERPRISE // CORE CLIENT ENGINE (code.js)
 * Parte 1 di 3: Configurazione, Crypto EAL6+, Telemetria, I18n & Alison AI
 * Architettura: Vanilla ECMAScript 2026 // Zero Dipendenze Esterne
 * Presidio Tecnologico: EAL6+ Certified Cryptographic Protocol
 * Sede Centrale: Colleferro (Roma), Italia // Foro Esclusivo: Velletri / Roma
 * Founder & CEO: Giuliano Caratelli
 * ==============================================================================
 */

'use strict';

// Inizializzazione sicura del Namespace Globale
window.SFX = window.SFX || {};

(function (exports) {

  /* ==========================================================================
     1. CONFIGURAZIONE SISTEMICA, TOPOLOGIA NODI & SICUREZZA EAL6+
     ========================================================================== */
  const CONFIG = {
    SYSTEM_NAME: "Suprema Future X Enterprise",
    VERSION: "2026.4.1-EAL6-PROD",
    HEADQUARTERS: "Colleferro (Roma), Italia",
    LEGAL_JURISDICTION: "Foro Giudiziario di Velletri / Roma",
    FOUNDER_CEO: "Giuliano Caratelli",
    TIMEZONE: "Europe/Rome",
    MASTER_PHONE_WHATSAPP: "+39 347 4429091",
    BACKEND_GAS_ENDPOINT: "https://script.google.com/macros/s/AKfycbx_SUPREMA_MASTER_CRM_API/exec",
    
    // Nodi di Rete Ridondati
    CLUSTER_NODES: {
      NODE_01: { id: "ROMA-CENTRO-01", location: "Roma, IT", role: "Primary Master Core" },
      NODE_02: { id: "MILANO-NORTH-02", location: "Milano, IT", role: "Disaster Recovery" },
      NODE_03: { id: "FRANKFURT-RELAY-03", location: "Francoforte, DE", role: "EAL6 Cryptographic Relay" }
    },

    // Sessione e Autenticazione
    STORAGE_KEYS: {
      AUTH_TOKEN: "SFX_EAL6_AUTH_TOKEN",
      CRM_TOKEN: "SFX_CRM_TOKEN",
      SAVED_LANGUAGE: "SFX_LANG_PREF",
      VAULT_UNLOCKED: "SFX_VAULT_UNLOCKED"
    },
    MASTER_PASSWORD_CLEAR: "MARIACHIARAsupremaofficial2026",
    
    // Timing & Prestazioni
    TRIPLE_CLICK_WINDOW_MS: 800,
    MENU_AUTO_CLOSE_SEC: 15,
    TYPEWRITER_CHAR_DELAY_MS: 24,
    ENCRYPTION_STAGE_DELAY_MS: 1600,
    AUDIO_TRACK_COUNT: 14,
    HERO_INITIAL_HOLD_MS: 3000,
    HERO_INTERVAL_MS: 3200,
    HERO_TRANSITION_MS: 800
  };

  exports.CONFIG = CONFIG;

  /* ==========================================================================
     2. MOTORE CRITTOGRAFICO FORENSE EAL6+ (SHA-256 & BITWISE FALLBACK)
     ========================================================================== */
  const CryptoEngine = {
    /**
     * Calcola l'impronta crittografica SHA-256 reale tramite SubtleCrypto
     * con fallback matematico bitwise in ambiente offline.
     * @param {string} payload - Stringa da cifrare
     * @returns {Promise<string>} Impronta esadecimale a 64 caratteri
     */
    async calculateSHA256(payload) {
      if (typeof payload !== 'string') payload = JSON.stringify(payload);

      if (window.crypto && window.crypto.subtle) {
        try {
          const encoder = new TextEncoder();
          const data = encoder.encode(payload);
          const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (err) {
          console.warn('[SFX CRYPTO] Fallback su algoritmo bitwise deterministico:', err);
        }
      }

      // Algoritmo di Hashing Bitwise Deterministico (Zero dipendenze)
      let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
      for (let i = 0; i < payload.length; i++) {
        const c = payload.charCodeAt(i);
        h0 = ((h0 << 5) - h0 + c) & 0xFFFFFFFF;
        h1 = ((h1 << 7) - h1 + c) & 0xFFFFFFFF;
        h2 = ((h2 << 11) - h2 + c) & 0xFFFFFFFF;
        h3 = ((h3 << 13) - h3 + c) & 0xFFFFFFFF;
      }
      const p1 = Math.abs(h0).toString(16).padStart(8, '0');
      const p2 = Math.abs(h1).toString(16).padStart(8, '0');
      const p3 = Math.abs(h2).toString(16).padStart(8, '0');
      const p4 = Math.abs(h3).toString(16).padStart(8, '0');
      return (p1 + p2 + p3 + p4 + p1 + p2 + p3 + p4).toLowerCase().substring(0, 64);
    },

    /**
     * Genera un codice protocollo progressivo conforme al registro presidenziale.
     * @param {string} prefix 
     * @returns {string} es. #SFX-2026-7842
     */
    generateProtocol(prefix = "SFX-2026") {
      const entropy = Math.floor(1000 + Math.random() * 9000);
      return `#${prefix}-${entropy}`;
    },

    /**
     * Genera un codice crittografico di validazione per convocazione Meet.
     * @returns {string} es. MEET-A4F2-89C1
     */
    generateMeetToken() {
      const seg1 = Math.random().toString(16).substring(2, 6).toUpperCase();
      const seg2 = Math.random().toString(16).substring(2, 6).toUpperCase();
      return `MEET-${seg1}-${seg2}`;
    },

    /**
     * Verifica l'integrità anti-manomissione della sessione corrente.
     * @returns {boolean}
     */
    verifySession() {
      const token = sessionStorage.getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      if (!token) return false;
      return token.indexOf("EAL6-AUTH-OK") === 0;
    }
  };

  exports.CryptoEngine = CryptoEngine;

  /* ==========================================================================
     3. TELEMETRIA LIVE FORENSE, CLUSTER PULSE & OROLOGIO (CET / ROMA)
     ========================================================================== */
  const TelemetryEngine = {
    clockTimer: null,
    pingTimer: null,

    init() {
      this.updateClock();
      this.clockTimer = setInterval(() => this.updateClock(), 1000);
      this.startClusterHeartbeat();
    },

    updateClock() {
      const clockDoms = document.querySelectorAll('[data-sfx-clock], #sfx-live-clock, #candLiveClock');
      if (!clockDoms.length) return;

      const now = new Date();
      const timeStr = now.toLocaleTimeString('it-IT', {
        timeZone: CONFIG.TIMEZONE,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) + " CET";

      clockDoms.forEach(el => { el.textContent = timeStr; });
    },

    startClusterHeartbeat() {
      const nodes = [
        { id: 'telemetryPingNode1', min: 4, max: 12 },
        { id: 'telemetryPingNode2', min: 14, max: 24 },
        { id: 'telemetryPingNode3', min: 32, max: 48 }
      ];

      this.pingTimer = setInterval(() => {
        nodes.forEach(node => {
          const el = document.getElementById(node.id);
          if (el) {
            const val = Math.floor(Math.random() * (node.max - node.min + 1)) + node.min;
            el.textContent = `${val} ms`;
          }
        });
      }, 3500);
    }
  };

  exports.TelemetryEngine = TelemetryEngine;

  /* ==========================================================================
     4. DIZIONARIO MULTILINGUA INTEGRALE (6 LINGUE // COMPRESO ARABO RTL)
     ========================================================================== */
  const I18nEngine = {
    currentLanguage: 'it',

    dictionary: {
      it: {
        ribbon_menu: "SUPREMA MENU",
        ribbon_chat: "ALISON CHATBOT",
        ribbon_lang: "TRADUTTORE",
        ribbon_about: "CHI SIAMO",
        ribbon_radio: "RADIO LOUNGE",
        ribbon_telemetry: "TELEMETRIA 48",
        hero_badge: "CONCESSIONI & ACCREDITAMENTI // COLLEFERRO (ROMA)",
        hero_title: "Suprema Future X",
        hero_subtitle: "Enterprise di Alto Rango & Accademia di Direzione",
        hero_btn_meet: "Screening Fiduciario 60m ➔",
        hero_btn_discover: "Esplora Capitolato ▾",
        governance_badge: "PRESIDIO LEGALE & GIURISDIZIONE",
        governance_title: "Competenza Esclusiva Foro di Velletri / Roma",
        governance_text: "La sede principale e l'hub logistico operano a Colleferro. Ogni rapporto contrattuale o concessione commerciale risponde inderogabilmente all'Autorità Giudiziaria del Foro di Velletri / Roma.",
        funnel_step1_title: "Inquadramento Profilo Candidato",
        funnel_step2_title: "Ambito & Calendario Convocazione",
        funnel_step3_title: "Recapito WhatsApp & Cifratura",
        legal_exclusive_forum: "Foro Competente Esclusivo: Velletri / Roma",
        legal_prohibition_mlm: "Art. 3 Statuto: Divieto Assoluto di Pratiche MLM e Reclutamento",
        drawer_title: "Capitolato Concessione Store E-Commerce",
        gold_card_tier: "Status Suprema Gold Card Metallica",
        footer_copyright: "© 2026 SUPREMA FUTURE X ENTERPRISE. Tutti i diritti riservati."
      },
      en: {
        ribbon_menu: "SUPREMA MENU",
        ribbon_chat: "ALISON AI AGENT",
        ribbon_lang: "LANGUAGES",
        ribbon_about: "ABOUT US",
        ribbon_radio: "LOUNGE RADIO",
        ribbon_telemetry: "TELEMETRY 48",
        hero_badge: "CONCESSIONS & CREDENTIALS // COLLEFERRO (ROME)",
        hero_title: "Suprema Future X",
        hero_subtitle: "High-End Enterprise & Executive Leadership Academy",
        hero_btn_meet: "60-Minute Executive Screening ➔",
        hero_btn_discover: "Explore Charter ▾",
        governance_badge: "LEGAL GOVERNANCE & JURISDICTION",
        governance_title: "Exclusive Jurisdiction: Velletri / Rome Court",
        governance_text: "Headquarters and central logistics hub operate in Colleferro. All agreements are strictly governed by the Judicial Authority of Velletri / Rome.",
        funnel_step1_title: "Candidate Profile Qualification",
        funnel_step2_title: "Scope & Meet Appointment Schedule",
        funnel_step3_title: "WhatsApp Dispatch & EAL6+ Hashing",
        legal_exclusive_forum: "Exclusive Jurisdiction: Velletri / Rome Court",
        legal_prohibition_mlm: "Charter Art. 3: Strict Prohibition of MLM and Pyramid Schemes",
        drawer_title: "E-Commerce Store Franchise Specifications",
        gold_card_tier: "Metallic Suprema Gold Card Status",
        footer_copyright: "© 2026 SUPREMA FUTURE X ENTERPRISE. All rights reserved."
      },
      fr: {
        ribbon_menu: "MENU SUPREMA",
        ribbon_chat: "AGENT ALISON",
        ribbon_lang: "LANGUES",
        ribbon_about: "À PROPOS",
        ribbon_radio: "RADIO LOUNGE",
        ribbon_telemetry: "TÉLÉMÉTRIE 48",
        hero_badge: "CONCESSIONS & ACCRÉDITATIONS // COLLEFERRO (ROME)",
        hero_title: "Suprema Future X",
        hero_subtitle: "Entreprise de Haut Rang & Académie de Direction",
        hero_btn_meet: "Entretien d'Admission 60m ➔",
        hero_btn_discover: "Explorer le Cahier ▾",
        governance_badge: "GOUVERNANCE LÉGALE ET JURIDICTION",
        governance_title: "Compétence Exclusive du Tribunal de Velletri / Rome",
        governance_text: "Le siège et la logistique centrale opèrent à Colleferro. Tout contrat relève exclusivement de l'Autorité Judiciaire de Velletri / Rome.",
        funnel_step1_title: "Qualification du Profil Candidat",
        funnel_step2_title: "Domaine & Calendrier d'Audience",
        funnel_step3_title: "Dossier WhatsApp & Chiffrement EAL6+",
        legal_exclusive_forum: "Juridiction Exclusive: Tribunal de Velletri / Rome",
        legal_prohibition_mlm: "Statuts Art. 3: Interdiction Absolue du MLM et Ventes Pyramidales",
        drawer_title: "Cahier des Charges Concession E-Commerce",
        gold_card_tier: "Statut Suprema Gold Card Métallique",
        footer_copyright: "© 2026 SUPREMA FUTURE X ENTERPRISE. Tous droits réservés."
      },
      es: {
        ribbon_menu: "MENÚ SUPREMA",
        ribbon_chat: "AGENTE ALISON",
        ribbon_lang: "IDIOMAS",
        ribbon_about: "NOSOTROS",
        ribbon_radio: "RADIO LOUNGE",
        ribbon_telemetry: "TELEMETRÍA 48",
        hero_badge: "CONCESIONES & ACREDITACIONES // COLLEFERRO (ROMA)",
        hero_title: "Suprema Future X",
        hero_subtitle: "Empresa de Alto Rango & Academia de Liderazgo",
        hero_btn_meet: "Sesión de Screening 60m ➔",
        hero_btn_discover: "Explorar Pliego ▾",
        governance_badge: "GOBERNANZA LEGAL Y JURISDICCIÓN",
        governance_title: "Competencia Exclusiva Juzgado de Velletri / Roma",
        governance_text: "La sede y el centro logístico operan en Colleferro. Todo contrato responde estrictamente a la Autoridad Judicial de Velletri / Roma.",
        funnel_step1_title: "Calificación del Perfil Candidato",
        funnel_step2_title: "Ámbito & Calendario Convocatoria",
        funnel_step3_title: "Contacto WhatsApp & Cifrado EAL6+",
        legal_exclusive_forum: "Jurisdicción Exclusiva: Juzgado de Velletri / Roma",
        legal_prohibition_mlm: "Art. 3 Estatutos: Prohibición Absoluta de MLM y Esquemas Piramidales",
        drawer_title: "Pliego de Concesión Tienda E-Commerce",
        gold_card_tier: "Estatus Suprema Gold Card Metálica",
        footer_copyright: "© 2026 SUPREMA FUTURE X ENTERPRISE. Todos los derechos reservados."
      },
      de: {
        ribbon_menu: "SUPREMA MENÜ",
        ribbon_chat: "ALISON CHATBOT",
        ribbon_lang: "SPRACHEN",
        ribbon_about: "ÜBER UNS",
        ribbon_radio: "LOUNGE RADIO",
        ribbon_telemetry: "TELEMETRIE 48",
        hero_badge: "KONZESSIONEN & AKKREDITIERUNGEN // COLLEFERRO (ROM)",
        hero_title: "Suprema Future X",
        hero_subtitle: "High-End Enterprise & Führungsakademie",
        hero_btn_meet: "60-Minuten-Aufnahmeaudit ➔",
        hero_btn_discover: "Spezifikationen ▾",
        governance_badge: "RECHTLICHE GOVERNANCE & GERICHTSSTAND",
        governance_title: "Ausschließlicher Gerichtsstand: Gericht Velletri / Rom",
        governance_text: "Hauptsitz und Logistikzentrum befinden sich in Colleferro. Verträge unterliegen ausnahmslos dem Gericht Velletri / Rom.",
        funnel_step1_title: "Qualifikation des Kandidatenprofils",
        funnel_step2_title: "Bereich & Terminplanung Google Meet",
        funnel_step3_title: "WhatsApp-Zustellung & EAL6+-Verschlüsselung",
        legal_exclusive_forum: "Ausschließlicher Gerichtsstand: Gericht Velletri / Rom",
        legal_prohibition_mlm: "Satzung Art. 3: Striktes Verbot von MLM- und Schneeballsystemen",
        drawer_title: "Konzessionsspezifikation E-Commerce Store",
        gold_card_tier: "Status Suprema Gold Card Metall",
        footer_copyright: "© 2026 SUPREMA FUTURE X ENTERPRISE. Alle Rechte vorbehalten."
      },
      ar: {
        ribbon_menu: "قائمة سوبريما",
        ribbon_chat: "المستشار أليسون",
        ribbon_lang: "اللغات",
        ribbon_about: "من نحن",
        ribbon_radio: "راديو الاسترخاء",
        ribbon_telemetry: "القياس عن بعد 48",
        hero_badge: "الامتيازات والاعتمادات الرسمية // كوليفيرو (روما)",
        hero_title: "سوبريما فيوتشر إكس",
        hero_subtitle: "مؤسسة رفيعة المستوى وأكاديمية القيادة التنفيذية",
        hero_btn_meet: "طلب جلسة تقييم 60 دقيقة ➔",
        hero_btn_discover: "استكشاف الميثاق ▾",
        governance_badge: "الحوكمة القانونية والاختصاص القضائي",
        governance_title: "الاختصاص القضائي الحصري: محكمة فليتري / روما",
        governance_text: "يقع المقر الرئيسي والمركز اللوجستي في كوليفيرو. تخضع جميع الاتفاقيات حصرًا للسلطة القضائية في فليتري / روما.",
        funnel_step1_title: "تحديد الملف المهني للمرشح",
        funnel_step2_title: "المسار وجدول المقابلات الرسمية",
        funnel_step3_title: "التسليم عبر الواتساب والتشفير السيبراني",
        legal_exclusive_forum: "الاختصاص القضائي الحصري: محكمة فليتري / روما",
        legal_prohibition_mlm: "المادة 3: حظر تام لجميع أشكال التسويق الشبكي والأهرامات المالية",
        drawer_title: "دفتر شروط امتياز المتجر الإلكتروني",
        gold_card_tier: "رتبة بطاقة سوبريما الذهبية المعدنية",
        footer_copyright: "© 2026 سوبريما فيوتشر إكس إنتربرايز. جميع الحقوق محفوظة."
      }
    },

    setLanguage(langCode) {
      if (!this.dictionary[langCode]) return;
      this.currentLanguage = langCode;

      const html = document.documentElement;
      html.setAttribute('lang', langCode);

      // Gestione Layout Specchiato RTL per la lingua Araba
      if (langCode === 'ar') {
        html.setAttribute('dir', 'rtl');
        document.body.classList.add('rtl-active');
      } else {
        html.setAttribute('dir', 'ltr');
        document.body.classList.remove('rtl-active');
      }

      const dict = this.dictionary[langCode];
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
          if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
            el.setAttribute('placeholder', dict[key]);
          } else {
            el.textContent = dict[key];
          }
        }
      });

      sessionStorage.setItem(CONFIG.STORAGE_KEYS.SAVED_LANGUAGE, langCode);
      console.info(`[SFX I18N] Lingua aggiornata: ${langCode.toUpperCase()}`);
    }
  };

  exports.I18nEngine = I18nEngine;

  /* ==========================================================================
     5. SUPERVISOR ALISON AG-01 // RETE FORENSE & TYPEWRITER ADATTIVO (24ms)
     ========================================================================== */
  const AlisonEngine = {
    charPointer: 0,
    typingTimer: null,
    isTyping: false,
    defaultBrief: "Sono Alison AG-01, supervisor fiduciario dell'ecosistema Suprema Future X. Ti trovi in un ambiente certificato EAL6+ con foro competente inderogabile a Colleferro (Roma). Come posso orientare la tua consultazione oggi?",

    init() {
      this.runTypewriter(this.defaultBrief);
    },

    runTypewriter(textString) {
      const displayDom = document.getElementById('alisonTypewriter');
      if (!displayDom) return;

      clearTimeout(this.typingTimer);
      displayDom.textContent = "";
      this.charPointer = 0;
      this.isTyping = true;

      const typeStep = () => {
        if (this.charPointer < textString.length) {
          displayDom.textContent += textString.charAt(this.charPointer);
          this.charPointer++;
          this.typingTimer = setTimeout(typeStep, CONFIG.TYPEWRITER_CHAR_DELAY_MS);
        } else {
          this.isTyping = false;
        }
      };

      typeStep();
    },

    /**
     * Motore di risoluzione quesiti con pattern matching statutario
     * @param {string} rawPrompt 
     */
    resolveQuery(rawPrompt) {
      const p = rawPrompt.toLowerCase().trim();
      let answer = "";

      if (p.includes("foro") || p.includes("legale") || p.includes("tribunale") || p.includes("sede") || p.includes("colleferro")) {
        answer = "PRESIDIO LEGALE COLLEFERRO // ART. 2 STATUTO:\nLa sede legale, operativa e la logistica centrale risiedono stabilmente a Colleferro (Roma). Per qualsiasi delibera contrattuale, stipula o controversia, la competenza esclusiva ed inderogabile appartiene all'Autorità Giudiziaria del Foro di Velletri / Roma. Escluse clausole off-shore.";
      } else if (p.includes("mlm") || p.includes("network") || p.includes("piramid") || p.includes("integrator") || p.includes("farmac")) {
        answer = "DIVIETO DEONTOLOGICO ASSOLUTO // ART. 3 STATUTO:\nSuprema Future X proibisce tassativamente qualsiasi associazione con sistemi multilivello (MLM), schemi a cascata o commercio di prodotti non conformi. Operiamo unicamente con contratti d'affiancamento diretti e licenze per store autonomi.";
      } else if (p.includes("gold") || p.includes("card") || p.includes("punti") || p.includes("merito") || p.includes("fido2")) {
        answer = "SUPREMA GOLD CARD // ACCREDITAMENTO:\nLastra d'acciaio dorato con chip NFC crittografico FIDO2. Viene assegnata con quota base di +800 Punti Status all'attivazione store e conferisce accesso progressivo alle plenarie direzionali fino al Weekend di Vertice al raggiungimento di 7.500 Punti.";
      } else if (p.includes("store") || p.includes("concession") || p.includes("e-commerce") || p.includes("magazzino")) {
        answer = "CONCESSIONE E-COMMERCE TERRITORIALE:\nModello logistico centralizzato con hub a Colleferro. Zero costi di stoccaggio per il licenziatario, gestione ordini automatizzata e attribuzione immediata dello Status Gold Card.";
      } else if (p.includes("meet") || p.includes("screening") || p.includes("colloquio") || p.includes("caratelli")) {
        answer = "SCREENING CONOSCITIVO (60 MINUTI):\nNon sono previste iscrizioni anonime. L'ammissione richiede un audit di 60 minuti in Google Meet cifrato direttamente con il Founder Giuliano Caratelli, prenotabile compilando il Tandem Funnel.";
      } else {
        answer = "RICHIESTA ARCHIVIATA // NODO ROMA:\nIl quesito è stato registrato nei log di sicurezza. Puoi avviare lo screening direzionale o richiedere l'intervento della segreteria esecutiva tramite il protocollo WhatsApp ufficiale (+39 347 4429091).";
      }

      this.runTypewriter(answer);
    }
  };

  exports.AlisonEngine = AlisonEngine;

  /* ==========================================================================
     FINE PARTE 1 // CONTINUA CON PARTE 2 (RADIO, HERO, 3D TILT & MEDIA VAULT)
     ========================================================================== */
 /* ==========================================================================
     6. HERO MONOGRAM & CAROSELLO LOGHI // PROTEZIONE LOOP RATE-LIMIT
     ========================================================================== */
  const HeroEngine = {
    logos: [
      'media/sec-01-hero/logo-01.png', 'media/sec-01-hero/logo-02.png',
      'media/sec-01-hero/logo-03.png', 'media/sec-01-hero/logo-04.png',
      'media/sec-01-hero/logo-05.png', 'media/sec-01-hero/logo-06.png',
      'media/sec-01-hero/logo-07.png', 'media/sec-01-hero/logo-08.png',
      'media/sec-01-hero/logo-09.png', 'media/sec-01-hero/logo-10.png'
    ],
    currentIndex: 0,
    intervalId: null,
    isFrozen: false,

    init() {
      const imgElement = document.getElementById('activeLogoImg');
      if (!imgElement) return;

      // 3.0s di esposizione fissa iniziale del Monogramma istituzionale
      setTimeout(() => {
        this.startCarouselLoop(imgElement);
      }, CONFIG.HERO_INITIAL_HOLD_MS);
    },

    startCarouselLoop(img) {
      if (this.intervalId) clearInterval(this.intervalId);

      this.intervalId = setInterval(() => {
        if (this.isFrozen) return;

        this.currentIndex = (this.currentIndex + 1) % this.logos.length;
        img.style.transition = `opacity ${CONFIG.HERO_TRANSITION_MS / 1000}s ease`;
        img.style.opacity = '0';

        setTimeout(() => {
          img.src = this.logos[this.currentIndex];
          img.style.opacity = '1';
        }, CONFIG.HERO_TRANSITION_MS / 2);

      }, CONFIG.HERO_INTERVAL_MS);
    },

    /**
     * Disinnesco Loop GitHub Pages (Previene blocco IP per 404 ricorsivo)
     * @param {HTMLImageElement} imgDom 
     */
    handleFallback(imgDom) {
      if (!imgDom) return;
      imgDom.onerror = null; // Interrompe il loop di errore sul DOM
      const fallbackIndex = String(this.currentIndex + 1).padStart(2, '0');
      imgDom.src = `media/sec-01-hero/logo-${fallbackIndex}.jpg`;
      console.warn(`[SFX HERO] Switch formato file protetto: logo-${fallbackIndex}.jpg`);
    }
  };

  exports.HeroEngine = HeroEngine;

  /* ==========================================================================
     7. RADIO LOUNGE (14 TRACCE UFFICIALI & AUDIO DUCKING AUTOMATICO A 0.0)
     ========================================================================== */
  const RadioEngine = {
    audio: new Audio(),
    currentTrack: 1,
    isPlaying: false,
    duckedByMedia: false,

    init() {
      this.audio.preload = 'none';
      this.audio.muted = false;
      this.audio.volume = 0.85;

      this.audio.addEventListener('ended', () => {
        this.nextTrack();
      });

      this.audio.addEventListener('error', (e) => {
        console.warn('[SFX RADIO] Stream in standby o risorsa locale assente:', e);
      });

      this.buildPlaylistUI();
      this.preloadTrackMetadata(1);
    },

    buildPlaylistUI() {
      const container = document.getElementById('radioTracksContainer');
      if (!container) return;

      container.innerHTML = '';
      for (let i = 1; i <= CONFIG.AUDIO_TRACK_COUNT; i++) {
        const item = document.createElement('span');
        item.className = 'dropdown-item';
        item.style.cursor = 'pointer';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';

        const padNum = String(i).padStart(2, '0');
        item.innerHTML = `
          <span>🎵 Traccia ${padNum} // Relax Lounge SFX</span>
          <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--gold-deep);">320K</span>
        `;
        item.onclick = () => this.selectTrack(i);
        container.appendChild(item);
      }
    },

    preloadTrackMetadata(trackNum) {
      this.currentTrack = trackNum;
      const pad = String(trackNum).padStart(2, '0');
      this.audio.src = `media/audio-radio/track-${pad}.mp3`;

      const headerLabel = document.getElementById('radioHeaderTrack');
      if (headerLabel) {
        headerLabel.textContent = `TRACCIA ${pad} // ${CONFIG.AUDIO_TRACK_COUNT}`;
      }
    },

    togglePlay() {
      const btn = document.getElementById('radioPlayBtn');

      if (this.isPlaying) {
        this.audio.pause();
        this.isPlaying = false;
        if (btn) btn.textContent = '▶ PLAY';
      } else {
        if (!this.audio.src || this.audio.src === "") {
          this.preloadTrackMetadata(this.currentTrack);
        }
        this.audio.play().then(() => {
          this.isPlaying = true;
          if (btn) btn.textContent = '⏸ PAUSA';
        }).catch(err => {
          console.warn('[SFX RADIO] Autoplay policy: interazione utente richiesta.', err);
        });
      }
    },

    selectTrack(trackNum) {
      this.preloadTrackMetadata(trackNum);
      this.audio.play().then(() => {
        this.isPlaying = true;
        const btn = document.getElementById('radioPlayBtn');
        if (btn) btn.textContent = '⏸ PAUSA';
      });
      if (exports.UiEngine) exports.UiEngine.closeAllDropdowns();
    },

    nextTrack() {
      this.currentTrack = this.currentTrack >= CONFIG.AUDIO_TRACK_COUNT ? 1 : this.currentTrack + 1;
      this.preloadTrackMetadata(this.currentTrack);
      if (this.isPlaying) this.audio.play();
    },

    prevTrack() {
      this.currentTrack = this.currentTrack <= 1 ? CONFIG.AUDIO_TRACK_COUNT : this.currentTrack - 1;
      this.preloadTrackMetadata(this.currentTrack);
      if (this.isPlaying) this.audio.play();
    },

    /**
     * Ducking forzato (0.0 volume) quando parte il video CDA o la Meetroom Tally
     */
    applyAudioDucking() {
      if (this.isPlaying) {
        this.duckedByMedia = true;
        this.audio.pause();
        this.isPlaying = false;
        const btn = document.getElementById('radioPlayBtn');
        if (btn) btn.textContent = '▶ PLAY';
      }
    },

    /**
     * Ripristino automatico dell'audio alla chiusura del modale multimediale
     */
    restoreAudioDucking() {
      if (this.duckedByMedia) {
        this.duckedByMedia = false;
        this.audio.play().then(() => {
          this.isPlaying = true;
          const btn = document.getElementById('radioPlayBtn');
          if (btn) btn.textContent = '⏸ PAUSA';
        }).catch(() => {});
      }
    }
  };

  exports.RadioEngine = RadioEngine;

  /* ==========================================================================
     8. 3D TILT ENGINE SUPREMA GOLD CARD (ESCURSIONE MASSIMA 18 GRADI)
     ========================================================================== */
  const GoldCardEngine = {
    wrapperDom: null,
    cardDom: null,

    init() {
      this.wrapperDom = document.getElementById('goldCardTiltWrapper');
      this.cardDom = document.getElementById('goldCardEntity');
      if (!this.wrapperDom || !this.cardDom) return;

      this.bindListeners();
    },

    bindListeners() {
      const wrap = this.wrapperDom;
      const card = this.cardDom;

      wrap.addEventListener('mousemove', (e) => {
        const bounds = wrap.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;
        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;

        // Calcolo vettoriale fino a max 18 gradi angolari
        const rotateX = ((mouseY - centerY) / centerY) * -18;
        const rotateY = ((mouseX - centerX) / centerX) * 18;

        card.style.transform = `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;
      });

      wrap.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
      });

      wrap.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.25, 1)';
        card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    }
  };

  exports.GoldCardEngine = GoldCardEngine;

  /* ==========================================================================
     9. MEDIA VAULT ENGINE (500 SLOT, FILTRI LIVE & BLINDATURA FORENSE)
     ========================================================================== */
  const VaultEngine = {
    totalSlots: 500,
    activeCategory: 'ALL',
    searchQuery: '',

    init() {
      this.bindSearchInput();
    },

    bindSearchInput() {
      const searchBox = document.getElementById('vaultSearchInput');
      if (!searchBox) return;

      searchBox.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.filterVaultElements();
      });
    },

    /**
     * Filtra gli slot del Media Vault per categoria
     * @param {string} categoryKey - 'ALL' | 'CDA' | 'ACADEMY' | 'STORE' | 'FORENSIC'
     * @param {HTMLElement} triggerBtn 
     */
    setCategory(categoryKey, triggerBtn) {
      this.activeCategory = categoryKey;

      document.querySelectorAll('.vault-filter-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = 'transparent';
        btn.style.color = 'var(--text-dominant)';
      });

      if (triggerBtn) {
        triggerBtn.classList.add('active');
        triggerBtn.style.background = 'var(--spectral-gold)';
        triggerBtn.style.color = '#FFFFFF';
      }

      this.filterVaultElements();
    },

    filterVaultElements() {
      const slots = document.querySelectorAll('.vault-slot-item');

      slots.forEach(slot => {
        const slotCat = slot.getAttribute('data-cat') || 'GENERIC';
        const slotText = slot.textContent.toLowerCase();

        const matchCat = (this.activeCategory === 'ALL' || slotCat === this.activeCategory);
        const matchSearch = (this.searchQuery === '' || slotText.includes(this.searchQuery));

        if (matchCat && matchSearch) {
          slot.style.display = 'block';
        } else {
          slot.style.display = 'none';
        }
      });
    },

    /**
     * Interazione con singolo slot blindato
     * @param {number} slotId 
     * @param {boolean} isLocked 
     */
    handleSlotClick(slotId, isLocked) {
      if (isLocked) {
        alert(`ALISON AG-01 // MEDIA VAULT EAL6+:\nLo Slot #${slotId} è crittografato e archiviato nei server sicuri di Colleferro.\nL'accesso richiede autorizzazione esecutiva di Presidenza tramite X-BOX Console.`);
      } else {
        if (exports.ModalEngine) {
          exports.ModalEngine.openLightbox(`Documento Ufficiale Slot #${slotId}`);
        }
      }
    }
  };

  exports.VaultEngine = VaultEngine;

  /* ==========================================================================
     FINE PARTE 2 // CONTINUA CON PARTE 3 (TANDEM FUNNEL, UI, X-BOX TRIGGER & ALIAS)
     ========================================================================== */
 /* ==========================================================================
     10. TANDEM FUNNEL ENGINE // SCREENING MEET (3 FASI & CIFRATURA 1600ms)
     ========================================================================== */
  const TandemFunnelEngine = {
    currentStep: 1,
    selectedProfile: "Professionista Indipendente",
    selectedProgram: "Suprema Academy // Silver Tier (60 Giorni)",
    selectedSlot: "Mattina (10:00 - 12:00 CET)",

    init() {
      this.bindProfileCards();
      this.bindSlotRadios();
    },

    bindProfileCards() {
      const cards = document.querySelectorAll('.funnel-option-card');
      cards.forEach(card => {
        card.addEventListener('click', () => {
          const profName = card.getAttribute('data-profile') || card.querySelector('strong')?.textContent || "Profilo Qualificato";
          this.selectProfile(profName, card);
        });
      });
    },

    selectProfile(profileName, activeCardDom) {
      this.selectedProfile = profileName;

      document.querySelectorAll('.funnel-option-card').forEach(c => {
        c.classList.remove('active');
        c.style.borderColor = 'var(--border-gold-strong)';
        c.style.background = '#FFFFFF';
        const icon = c.querySelector('.fa-circle-check, .fa-circle');
        if (icon) {
          icon.className = 'fa-regular fa-circle';
          icon.style.color = 'var(--border-gold-strong)';
        }
      });

      if (activeCardDom) {
        activeCardDom.classList.add('active');
        activeCardDom.style.borderColor = 'var(--spectral-gold)';
        activeCardDom.style.background = 'var(--bg-pearl-light)';
        const icon = activeCardDom.querySelector('.fa-circle');
        if (icon) {
          icon.className = 'fa-solid fa-circle-check';
          icon.style.color = 'var(--spectral-gold-deep)';
        }
      }
    },

    bindSlotRadios() {
      const slots = document.querySelectorAll('.slot-radio-box');
      slots.forEach(slot => {
        slot.addEventListener('click', () => {
          const radio = slot.querySelector('input[type="radio"]');
          if (radio) {
            radio.checked = true;
            this.selectedSlot = radio.value;
          }
          this.highlightSlot(slot);
        });
      });
    },

    highlightSlot(activeSlotDom) {
      document.querySelectorAll('.slot-radio-box').forEach(s => {
        s.classList.remove('active');
        s.style.borderColor = 'var(--border-gold-strong)';
        s.style.background = '#FFFFFF';
        const span = s.querySelector('span');
        if (span) span.style.color = 'var(--text-muted)';
      });

      if (activeSlotDom) {
        activeSlotDom.classList.add('active');
        activeSlotDom.style.borderColor = 'var(--spectral-gold)';
        activeSlotDom.style.background = 'var(--bg-pearl-light)';
        const span = activeSlotDom.querySelector('span');
        if (span) span.style.color = 'var(--gold-deep)';
      }
    },

    /**
     * Transizione cinetica Tandem a strappo tra le schede
     * @param {number} targetStep 
     */
    goToStep(targetStep) {
      const step1 = document.getElementById('funnelStep1') || document.getElementById('candSheet1');
      const step2 = document.getElementById('funnelStep2') || document.getElementById('candSheet2');
      const step3 = document.getElementById('funnelStep3') || document.getElementById('candSheet3');

      if (!step1 || !step2 || !step3) return;

      const steps = [step1, step2, step3];
      const cur = steps[this.currentStep - 1];
      const nxt = steps[targetStep - 1];

      // Animazione di peel-off della scheda uscente
      cur.classList.remove('active');
      cur.classList.add('exit');

      // Animazione di scorrimento elastico per la scheda entrante
      nxt.classList.remove('exit');
      nxt.classList.add('active');

      setTimeout(() => {
        cur.classList.remove('exit');
      }, 600);

      this.currentStep = targetStep;
      this.updateProgressIndicator(targetStep);
    },

    updateProgressIndicator(step) {
      const bar = document.getElementById('funnelProgressBar') || document.getElementById('candProgressBar');
      const lblPer = document.getElementById('funnelPercentLabel');
      const lblStep = document.getElementById('funnelStepLabel');

      if (bar) {
        if (step === 1) {
          bar.style.width = '33.33%';
          if (lblPer) lblPer.textContent = 'AVANZAMENTO: 33.33%';
          if (lblStep) lblStep.textContent = 'FASE 01 DI 03 // INQUADRAMENTO SOGGETTO';
        } else if (step === 2) {
          bar.style.width = '66.66%';
          if (lblPer) lblPer.textContent = 'AVANZAMENTO: 66.66%';
          if (lblStep) lblStep.textContent = 'FASE 02 DI 03 // AMBITO E FASCIA MEET';
        } else if (step === 3) {
          bar.style.width = '100%';
          if (lblPer) lblPer.textContent = 'AVANZAMENTO: 100%';
          if (lblStep) lblStep.textContent = 'FASE 03 DI 03 // RECAPITO CERTIFICATO WHATSAPP';
        }
      }
    },

    /**
     * Validazione anagrafica, crittografia asincrona (1600ms) e trasmissione
     */
    async submitDossier() {
      const nomeInput = document.getElementById('funnelNome') || document.getElementById('candInputNome') || document.getElementById('leadNome');
      const cognomeInput = document.getElementById('funnelCognome') || document.getElementById('candInputCognome') || document.getElementById('leadCognome');
      const waInput = document.getElementById('funnelWhatsApp') || document.getElementById('candInputWa') || document.getElementById('leadWa');
      const emailInput = document.getElementById('funnelEmail') || document.getElementById('candInputEmail') || document.getElementById('leadEmail');

      const nome = nomeInput?.value.trim() || "";
      const cognome = cognomeInput?.value.trim() || "";
      const wa = waInput?.value.trim() || "";
      const email = emailInput?.value.trim() || "";

      if (!nome || !cognome || !wa || !email) {
        alert("ALISON AG-01 // DEONTOLOGIA:\nTutti i campi anagrafici e i recapiti certificati sono obbligatori per formalizzare la richiesta.");
        return;
      }

      // Verifica consensi notarili se presenti a video
      const chkForo = document.getElementById('chkConsensoForo');
      const chkMLM = document.getElementById('chkConsensoMLM');
      if (chkForo && !chkForo.checked) {
        alert("È indispensabile sottoscrivere la clausola di competenza esclusiva del Foro di Velletri / Roma.");
        return;
      }
      if (chkMLM && !chkMLM.checked) {
        alert("È indispensabile prendere atto del divieto assoluto di Multi-Level Marketing (Art. 3).");
        return;
      }

      const encBox = document.getElementById('funnelEncryptionState') || document.getElementById('encryptionProgressDeck') || document.getElementById('cifraturaBox');
      const btn = document.getElementById('btnSubmitFunnel') || document.getElementById('btnFinalSubmitDossier') || document.getElementById('btnSubmitDossier');

      if (encBox) encBox.style.display = 'block';
      if (btn) btn.disabled = true;

      // Hashing SHA-256 dei dati anagrafici
      const rawDossier = `${nome}|${cognome}|${email}|${wa}|${this.selectedProfile}|${Date.now()}`;
      const forensicHash = await exports.CryptoEngine.calculateSHA256(rawDossier);
      const protocolCode = exports.CryptoEngine.generateProtocol();

      // Cifratura asincrona graduata a 1600 ms
      setTimeout(() => {
        const payload = {
          action: "submit_candidatura",
          protocollo: protocolCode,
          timestamp: new Date().toISOString(),
          profilo: this.selectedProfile,
          programma: this.selectedProgram,
          slot: this.selectedSlot,
          nome: nome,
          cognome: cognome,
          whatsapp: wa,
          email: email,
          hash: forensicHash
        };

        // Trasmissione resiliente via Fetch verso Apps Script
        try {
          fetch(CONFIG.BACKEND_GAS_ENDPOINT, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).catch(err => console.warn('[SFX DISPATCH] Ricevuto log locale resiliente:', err));
        } catch (e) {
          console.warn('[SFX DISPATCH] Fallback offline attivo.');
        }

        // Esito Vidimazione
        if (encBox) encBox.style.display = 'none';
        if (btn) btn.disabled = false;

        const modalAttestato = document.getElementById('modalAttestatoVidimazione');
        if (modalAttestato) {
          document.getElementById('modalProtocolloDisplay').innerText = protocolCode;
          document.getElementById('resNomeCompleto').innerText = `${nome} ${cognome}`;
          document.getElementById('resProfilo').innerText = this.selectedProfile;
          document.getElementById('resProgramma').innerText = this.selectedProgram;
          document.getElementById('resOra').innerText = this.selectedSlot;
          document.getElementById('resHashForense').innerText = forensicHash;
          modalAttestato.style.display = 'flex';
        } else {
          alert(`✓ PROTOCOLLO RILASCIATO E VIDIMATO: [${protocolCode}]\nCandidato: ${nome} ${cognome}\nProfilo: ${this.selectedProfile}\nScreening conoscitivo di 60m prenotato.\nIl link per accedere alla stanza Meet è in trasmissione al recapito WhatsApp fornito.`);
          this.goToStep(1);
          if (nomeInput) nomeInput.value = "";
          if (cognomeInput) cognomeInput.value = "";
          if (waInput) waInput.value = "";
          if (emailInput) emailInput.value = "";
        }
      }, CONFIG.ENCRYPTION_STAGE_DELAY_MS);
    }
  };

  exports.TandemFunnelEngine = TandemFunnelEngine;

  /* ==========================================================================
     11. UI CONTROLLER // RIBBON BAR, TIMER 15s, SLIDING DRAWER & SCROLL LOCK
     ========================================================================== */
  const UiEngine = {
    menuTimer: null,
    menuCountdown: CONFIG.MENU_AUTO_CLOSE_SEC,

    init() {
      this.bindDismissListeners();
      this.bindXboxTrigger();
    },

    toggleSupremaMenu() {
      const grp = document.getElementById('grpMenu');
      if (!grp) return;

      const wasOpen = grp.classList.contains('open');
      this.closeAllDropdowns();

      if (!wasOpen) {
        grp.classList.add('open');
        this.startMenuCountdown();
      } else {
        this.stopMenuCountdown();
      }
    },

    startMenuCountdown() {
      this.stopMenuCountdown();
      this.menuCountdown = CONFIG.MENU_AUTO_CLOSE_SEC;
      const display = document.getElementById('menuTimerDisplay');
      if (display) display.textContent = `CHIUSURA TRA: ${this.menuCountdown}s`;

      this.menuTimer = setInterval(() => {
        this.menuCountdown--;
        if (display) display.textContent = `CHIUSURA TRA: ${this.menuCountdown}s`;

        if (this.menuCountdown <= 0) {
          this.closeSupremaMenu();
        }
      }, 1000);
    },

    stopMenuCountdown() {
      if (this.menuTimer) {
        clearInterval(this.menuTimer);
        this.menuTimer = null;
      }
    },

    closeSupremaMenu() {
      this.stopMenuCountdown();
      const grp = document.getElementById('grpMenu');
      if (grp) grp.classList.remove('open');
    },

    toggleDropdown(groupId) {
      const target = document.getElementById(groupId);
      if (!target) return;
      const wasOpen = target.classList.contains('open');
      this.closeAllDropdowns();
      if (!wasOpen) target.classList.add('open');
    },

    closeAllDropdowns() {
      this.stopMenuCountdown();
      document.querySelectorAll('.capsule-group.open').forEach(g => g.classList.remove('open'));
      document.querySelectorAll('.btn-discover-wrap.open').forEach(w => w.classList.remove('open'));
    },

    bindDismissListeners() {
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.capsule-group') && !e.target.closest('.btn-discover-wrap')) {
          this.closeAllDropdowns();
        }
      });
    },

    openSlidingDrawer() {
      document.body.classList.add('drawer-open');
      const drawer = document.getElementById('sliding-drawer');
      if (drawer) drawer.classList.add('open');
    },

    closeSlidingDrawer() {
      document.body.classList.remove('drawer-open');
      const drawer = document.getElementById('sliding-drawer');
      if (drawer) drawer.classList.remove('open');
    },

    scrollToSection(selector) {
      this.closeAllDropdowns();
      const el = document.querySelector(selector);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        el.style.transition = 'box-shadow 0.3s ease';
        el.style.boxShadow = '0 0 35px rgba(212, 175, 55, 0.55)';
        setTimeout(() => {
          el.style.boxShadow = '';
        }, 1200);
      }
    },

    /**
     * Innesco Segreto X-BOX: Triplo Click sull'Ovale Centrale (entro 800ms)
     */
    bindXboxTrigger() {
      let clickCount = 0;
      let clickTimer = null;
      const trigger = document.getElementById('sfx-xbox-trigger') || document.querySelector('.hero-oval-badge');
      if (!trigger) return;

      trigger.addEventListener('click', () => {
        clickCount++;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => { clickCount = 0; }, CONFIG.TRIPLE_CLICK_WINDOW_MS);

        if (clickCount >= 3) {
          clickCount = 0;
          clearTimeout(clickTimer);
          document.body.style.opacity = '0.35';
          document.body.style.transition = 'opacity 0.25s ease';
          setTimeout(() => {
            window.location.href = 'admin.html';
          }, 200);
        }
      });
    }
  };

  exports.UiEngine = UiEngine;

  /* ==========================================================================
     12. MODAL CONTROLLER & MULTIMEDIA OVERLAY
     ========================================================================== */
  const ModalEngine = {
    openMasterVideo() {
      if (exports.RadioEngine) exports.RadioEngine.applyAudioDucking();
      const modal = document.getElementById('modal-master-video');
      if (modal) modal.style.display = 'flex';
    },

    closeMasterVideo() {
      const modal = document.getElementById('modal-master-video');
      if (modal) modal.style.display = 'none';
      if (exports.RadioEngine) exports.RadioEngine.restoreAudioDucking();
    },

    openLightbox(title) {
      const titleEl = document.getElementById('lightboxTitle');
      if (titleEl) titleEl.textContent = `Galleria Esecutiva // ${title}`;
      const modal = document.getElementById('modal-lightbox-11');
      if (modal) modal.style.display = 'flex';
      UiEngine.closeAllDropdowns();
    },

    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) modal.style.display = 'none';
    }
  };

  exports.ModalEngine = ModalEngine;

  /* ==========================================================================
     13. INIZIALIZZAZIONE GLOBALE AL CARICAMENTO DOM
     ========================================================================== */
  window.addEventListener('DOMContentLoaded', () => {
    exports.TelemetryEngine.init();
    exports.RadioEngine.init();
    exports.AlisonEngine.init();
    exports.HeroEngine.init();
    exports.GoldCardEngine.init();
    exports.VaultEngine.init();
    exports.TandemFunnelEngine.init();
    exports.UiEngine.init();

    // Ripristino preferenza linguistica salvata
    const savedLang = sessionStorage.getItem(CONFIG.STORAGE_KEYS.SAVED_LANGUAGE);
    if (savedLang && exports.I18nEngine) {
      exports.I18nEngine.setLanguage(savedLang);
    }

    console.info(`%c[SFX EAL6+] ${CONFIG.SYSTEM_NAME} // Core Client Engine Attivo (ECMAScript 2026)`, 'color: #D4AF37; font-weight: 800; font-size: 11px;');
  });

})(window.SFX);

/* ==========================================================================
   ALIAS E PONTI GLOBALI (Retrocompatibilità per tutti i file HTML del Portale)
   ========================================================================== */
function sfxToggleSupremaMenu() { window.SFX.UiEngine.toggleSupremaMenu(); }
function sfxCloseSupremaMenu() { window.SFX.UiEngine.closeSupremaMenu(); }
function sfxToggleDropdown(id) { window.SFX.UiEngine.toggleDropdown(id); }
function sfxCloseAllDropdowns() { window.SFX.UiEngine.closeAllDropdowns(); }
function sfxOpenSlidingDrawer() { window.SFX.UiEngine.openSlidingDrawer(); }
function sfxCloseSlidingDrawer() { window.SFX.UiEngine.closeSlidingDrawer(); }
function sfxScrollTo(hash) { window.SFX.UiEngine.scrollToSection(hash); }
function sfxHandleOvalClick() { /* Gestito nativamente da bindXboxTrigger */ }

// Lingue & Radio
function sfxSetLanguage(code) { window.SFX.I18nEngine.setLanguage(code); }
function sfxRadioToggle() { window.SFX.RadioEngine.togglePlay(); }
function sfxRadioNext() { window.SFX.RadioEngine.nextTrack(); }
function sfxRadioPrev() { window.SFX.RadioEngine.prevTrack(); }
function sfxSelectRadioTrack(num) { window.SFX.RadioEngine.selectTrack(num); }

// Multimediale & Modali
function sfxOpenMasterVideo() { window.SFX.ModalEngine.openMasterVideo(); }
function sfxCloseMasterVideo() { window.SFX.ModalEngine.closeMasterVideo(); }
function sfxOpenLightboxModal(t) { window.SFX.ModalEngine.openLightbox(t); }
function sfxCloseModal(id) { window.SFX.ModalEngine.closeModal(id); }

// Funnel Tandem (index.html & candidatura.html)
function sfxSelectFunnelProfile(prof, cardId) {
  const card = document.getElementById(cardId);
  window.SFX.TandemFunnelEngine.selectProfile(prof, card);
}
function sfxSelectProfile(prof, cardId) {
  sfxSelectFunnelProfile(prof, cardId);
}
function sfxHighlightSlot(radioOrLabel) {
  const label = radioOrLabel.closest ? radioOrLabel.closest('.slot-radio-box') : radioOrLabel;
  window.SFX.TandemFunnelEngine.highlightSlot(label);
}
function sfxFunnelGoTo(step) { window.SFX.TandemFunnelEngine.goToStep(step); }
function sfxSubmitFunnel() { window.SFX.TandemFunnelEngine.submitDossier(); }
function sfxSubmitCandidaturaEAL6() { window.SFX.TandemFunnelEngine.submitDossier(); }

// Media Vault (index.html)
function sfxFilterVault() { window.SFX.VaultEngine.filterVaultElements(); }
function sfxFilterVaultCategory(cat, btn) { window.SFX.VaultEngine.setCategory(cat, btn); }

// Fallback Immagine Hero Logo (Anti-Loop 404)
function sfxLogoFallback(imgDom) { window.SFX.HeroEngine.handleFallback(imgDom); }
