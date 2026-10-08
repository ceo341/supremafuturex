/**
 * ====================================================================
 * SUPREMA FUTURE X S.R.L. // UNIFIED FRONTEND JS ENGINE v31 (EAL6+)
 * GOVERNANCE: GIULIANO CARATELLI CEO
 * ====================================================================
 */

// 1. CATALOGO DATI & FAQ
window.SFXCatalog = {
  version: "v31_EAL6",
  motto: "Suprema Future X — Insieme guidiamo il tuo domani.",
  
  academy: [
    { id: "silver", nome: "CORSO NEXUS SILVER", livello: "Base", punti: 100, prezzo: "Reserved" },
    { id: "gold", nome: "CORSO GOLD EXECUTIVE", livello: "Avanzato", punti: 500, prezzo: "Reserved" },
    { id: "premium", nome: "CORSO PREMIUM VIP", livello: "Top Executive", punti: 1500, prezzo: "Reserved" }
  ],

  boutique: [
    { id: "opal", nome: "POMELLI OPAL LUXURY", codice: "OPAL-SFX-2026-PAT", punti: 500, finitura: "Oro 24K & Opale Nobile" },
    { id: "antigravity", nome: "LINEA ANTIGRAVITY INNOVATION", codice: "ANTIG-SFX-2026-X", punti: 1000, finitura: "Sospensione Magnetica Neurale" }
  ],

  faqAlison: [
    { q: "Cos'è Suprema Future X?", a: "Suprema Future X è una community, networking e academy Enterprise guidata dalla Direzione del CEO Giuliano." },
    { q: "Come si ottiene la Suprema Gold Card?", a: "La Gold Card viene rilasciata con il codice progressivo univoco (a partire da CEOSFX0002) a tutti gli iscritti Academy e partner." },
    { q: "Come fissare una conferenza con il CEO?", a: "Puoi inviare la candidatura dal modulo in pagina oppure cliccare sull'opzione 1 nella console di Alison." }
  ]
};

// 2. CONNETTORE API GOOGLE APPS SCRIPT
window.SFXConnector = {
  endpoint: 'https://script.google.com/macros/s/AKfycbw6cDhjlvwnv5KAJUEz-ocgiey3QJu9uunGvyklI00nOjXkVDBuMn5B4iz-JMU1IuNxsw/exec',

  async inviaLead(payload) {
    try {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err) {
      console.warn("[SFX Connector] Invio remoto fallito, salvataggio in coda offline Delta Patch:", err);
      if (window.SFXDelta) {
        window.SFXDelta.enqueueOfflineAction(payload);
      }
      return { status: "local_queued" };
    }
  },

  async recuperaLeads() {
    try {
      const res = await fetch(`${this.endpoint}?action=GET_LEADS`);
      return await res.json();
    } catch (err) {
      console.error("[SFX Connector] Errore recupero leads:", err);
      return { status: "offline", leads: [] };
    }
  }
};

// 3. MOTORE ALISON V3 & SINTESI VOCALE
window.AlisonEngine = {
  parla(testo) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const uttr = new SpeechSynthesisUtterance(testo);
      uttr.lang = 'it-IT';
      uttr.rate = 0.95;
      uttr.pitch = 1.05;
      window.speechSynthesis.speak(uttr);
    }
  },

  gestisciScelta(opzione) {
    if (opzione === 1 || opzione === '1. SI, per appuntamento con il CEO') {
      window.location.href = '#conferenza-ceo';
    } else if (opzione === 4 || opzione === '4. Ci devo pensare') {
      alert("Alison: Che cosa non è chiaro? Un appuntamento con il CEO toglie ogni dubbio! Ti collego a WhatsApp.");
      window.location.href = "https://wa.me/393474429091?text=Ciao%20Giuliano,%20vorrei%20maggiori%20informazioni%20sulle%20opportunit%C3%A0";
    }
  }
};

// 4. GENERATORE GOLD CARD PHYGITAL
window.GoldCardEngine = {
  genera(nomeInput) {
    const nome = (nomeInput || "ALISON EXECUTIVE").toUpperCase();
    let contatore = parseInt(localStorage.getItem('SFX_CARD_COUNTER')) || 2;
    const codiceCard = "CEOSFX" + String(contatore).padStart(4, '0');

    const renderNome = document.getElementById('render-nome');
    const renderId = document.getElementById('render-id');
    const renderPts = document.getElementById('render-pts');

    if (renderNome) renderNome.textContent = nome;
    if (renderId) renderId.textContent = codiceCard;
    if (renderPts) renderPts.textContent = "1,500 PTS";

    localStorage.setItem('SFX_CARD_COUNTER', (contatore + 1).toString());
    return { nome, codiceCard, punti: 1500 };
  }
};

// 5. REGIA MEDIA & SHOWCASE PLAYER
window.SFXMedia = {
  toggleFullscreen(elementId) {
    const el = document.getElementById(elementId || 'video-card-showcase');
    if (el) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    }
  },

  playShowcaseConAudio() {
    const video = document.getElementById('video-card-showcase');
    if (video) {
      video.play();
      setTimeout(() => {
        if (window.AlisonEngine) {
          window.AlisonEngine.parla("Card Suprema Future X. Un mondo di punti e di valore. Seguiteci anche sui nostri social.");
        }
      }, 6000);
    }
  }
};
