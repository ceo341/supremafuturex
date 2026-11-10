/**
 * ==============================================================================
 * SUPREMA FUTURE X ENTERPRISE // FRONTEND CLIENT ENGINE
 * File: js/code.js
 * Piattaforma: GitHub Pages -> Google Apps Script REST Gateway
 * Endpoint Attivo: Versione 32 (11 Nov 2026)
 * Presidio Operativo: Colleferro (Roma) // Foro Giudiziario: Velletri / Roma
 * ==============================================================================
 */

'use strict';

// 1. CONFIGURAZIONE MASTER CLIENT-SIDE (VERSIONE 32)
const SFX_CONFIG = {
  // Nuovo Endpoint Web App Google Apps Script Versione 32
  API_URL: "https://script.google.com/macros/s/AKfycbyNWO9e32EIhLusbtZrfGalQHjep80waY7YbyWdPQr-9ARmmPEau8ngdVMtGkasogoMFA/exec",
  
  CHANNELS: {
    TELEGRAM_BOT: "@SupremaFutureX_NocBot",
    TELEGRAM_CANALE: "https://t.me/supremafuturex",
    WHATSAPP_CEO: "+393474429091",
    EMAIL_CEO: "ceo@supremaofficial.com"
  },

  TIME_SLOTS: [
    "Mattina (10:00 - 13:00 CET)",
    "Pomeriggio (15:00 - 18:00 CET)",
    "Serale (21:00 - 23:00 CET)"
  ],

  STORAGE_KEYS: {
    SESSION_TOKEN: "sfx_master_session_token",
    SESSION_EXPIRY: "sfx_master_session_expiry"
  }
};

/**
 * 2. COMUNICAZIONE HTTP FETCH VERSO IL GATEWAY APPS SCRIPT
 */
async function sfxApiCall(payload) {
  try {
    const response = await fetch(SFX_CONFIG.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("HTTP Status " + response.status);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("[SFX GATEWAY ERROR]", err);
    return {
      success: false,
      status: "error",
      message: "Impossibile comunicare con il nodo di Colleferro: " + err.message
    };
  }
}

/**
 * 3. INOLTRO CANDIDATURA (MASCHERA FRONTEND)
 */
async function sfxSubmitCandidatura(event) {
  if (event) event.preventDefault();

  const submitBtn = document.getElementById("sfx-submit-btn");
  const feedbackBox = document.getElementById("sfx-form-feedback");

  const nome = (document.getElementById("sfx-nome")?.value || "").trim();
  const cognome = (document.getElementById("sfx-cognome")?.value || "").trim();
  const email = (document.getElementById("sfx-email")?.value || "").trim();
  const whatsapp = (document.getElementById("sfx-whatsapp")?.value || "").trim();
  const azienda = (document.getElementById("sfx-azienda")?.value || "N/D").trim();
  const citta = (document.getElementById("sfx-citta")?.value || "Colleferro").trim();
  const profilo = document.getElementById("sfx-profilo")?.value || "Professionista Indipendente";
  const programma = document.getElementById("sfx-programma")?.value || "Executive Master Live";
  const fasciaMeet = document.getElementById("sfx-fascia")?.value || SFX_CONFIG.TIME_SLOTS[0];
  const note = (document.getElementById("sfx-note")?.value || "").trim();

  if (!nome || !cognome || !email || !whatsapp) {
    sfxShowToast("Tutti i campi contrassegnati con recapito sono obbligatori.", "warning");
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerText = "CRITTOGRAFIA & TRASMISSIONE EAL6+...";
  }

  const payload = {
    action: "submit_candidatura",
    nome: nome,
    cognome: cognome,
    email: email,
    whatsapp: whatsapp,
    azienda: azienda,
    citta: citta,
    profilo: profilo,
    programma: programma,
    fasciaMeet: fasciaMeet,
    note: note
  };

  const response = await sfxApiCall(payload);

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerText = "VIDIMA CANDIDATURA";
  }

  if (response.success) {
    sfxShowToast("Candidatura Vidimata: " + response.protocollo, "success");
    if (feedbackBox) {
      feedbackBox.innerHTML = `
        <div style="background:#FAF8F5; border:1px solid #C5A059; padding:20px; border-radius:6px; margin-top:20px;">
          <h4 style="color:#0B192C; margin:0 0 10px;">FASCICOLO ACQUISITO NEL PRESIDIO</h4>
          <p><strong>Protocollo:</strong> ${response.protocollo}</p>
          <p><strong>Stanza Google Meet:</strong> <a href="${response.meetLink}" target="_blank" style="color:#9E7B35; font-weight:bold;">Accedi al Meet</a></p>
          <p><strong>Fascia Oraria Assegnata:</strong> ${response.fasciaOraria || fasciaMeet}</p>
          <p style="font-size:12px; color:#666;">Notifiche trasmesse simultaneamente a Telegram, Email e WhatsApp.</p>
        </div>
      `;
    }
    document.getElementById("sfx-candidatura-form")?.reset();
  } else {
    sfxShowToast(response.message || "Errore durante la registrazione.", "error");
  }
}

/**
 * 4. CONSOLE X-BOX SUPERADMIN (2FA)
 */
let sfxChallengeToken = null;

async function sfxVerifyPassword(passwordInput) {
  const pwd = passwordInput || document.getElementById("xbox-input-password")?.value || "";
  if (!pwd) {
    sfxShowToast("Inserire la Password di Vertice.", "warning");
    return;
  }

  const res = await sfxApiCall({
    action: "verify_password",
    password: pwd
  });

  if (res.success && res.challengeToken) {
    sfxChallengeToken = res.challengeToken;
    sfxShowToast("Step 1 Validato. Inserire PIN 2FA.", "info");
    document.getElementById("xbox-step-password")?.classList.add("hidden");
    document.getElementById("xbox-step-pin")?.classList.remove("hidden");
  } else {
    sfxShowToast(res.message || "Password errata.", "error");
  }
}

async function sfxVerifyPin(pinInput) {
  const pin = pinInput || document.getElementById("xbox-input-pin")?.value || "";
  if (!pin || !sfxChallengeToken) {
    sfxShowToast("PIN non valido o sessione scaduta.", "warning");
    return;
  }

  const res = await sfxApiCall({
    action: "verify_pin",
    pin: pin,
    challengeToken: sfxChallengeToken
  });

  if (res.success && res.sessionToken) {
    sessionStorage.setItem(SFX_CONFIG.STORAGE_KEYS.SESSION_TOKEN, res.sessionToken);
    sessionStorage.setItem(SFX_CONFIG.STORAGE_KEYS.SESSION_EXPIRY, res.expiresAt);
    sfxShowToast("Autenticazione EAL6+ Conclusa. Benvenuto Presidente.", "success");
    sfxLoadXboxDashboard();
  } else {
    sfxShowToast(res.message || "PIN non corretto.", "error");
  }
}

function sfxGetActiveSessionToken() {
  return sessionStorage.getItem(SFX_CONFIG.STORAGE_KEYS.SESSION_TOKEN) || "";
}

function sfxLogoutXbox() {
  sessionStorage.removeItem(SFX_CONFIG.STORAGE_KEYS.SESSION_TOKEN);
  sessionStorage.removeItem(SFX_CONFIG.STORAGE_KEYS.SESSION_EXPIRY);
  sfxChallengeToken = null;
  window.location.reload();
}

/**
 * 5. FUNZIONI OPERATIVE DELLA CONSOLE X-BOX
 */
async function sfxLoadXboxDashboard() {
  const token = sfxGetActiveSessionToken();
  if (!token) return;

  document.getElementById("xbox-login-modal")?.classList.add("hidden");
  document.getElementById("xbox-dashboard-panel")?.classList.remove("hidden");

  await Promise.all([
    sfxFetchCrmLeads(),
    sfxFetchVaultCatalog(),
    sfxFetchFleetStatus(),
    sfxFetchGoldCardRegistry()
  ]);
}

async function sfxFetchCrmLeads() {
  const res = await sfxApiCall({
    action: "get_crm_leads",
    sessionToken: sfxGetActiveSessionToken()
  });

  const container = document.getElementById("xbox-leads-table-body");
  if (!container) return;

  if (res.leads && res.leads.length > 0) {
    container.innerHTML = res.leads.map(l => `
      <tr>
        <td style="font-family:monospace; font-weight:bold;">${l.protocollo}</td>
        <td>${l.timestamp}</td>
        <td><strong>${l.nome} ${l.cognome}</strong></td>
        <td>${l.whatsapp}</td>
        <td>${l.programma}</td>
        <td><span class="badge">${l.fasciaMeet}</span></td>
        <td><a href="${l.meetLink || '#'}" target="_blank" style="color:#9E7B35;">Meet</a></td>
        <td><span class="status-tag status-${(l.stato || '').toLowerCase()}">${l.stato || 'IN_VALUTAZIONE'}</span></td>
      </tr>
    `).join("");
  } else {
    container.innerHTML = `<tr><td colspan="8" style="text-align:center;">Nessuna candidatura registrata nel foglio.</td></tr>`;
  }
}

async function sfxFetchVaultCatalog(category) {
  const res = await sfxApiCall({
    action: "get_vault_catalog",
    category: category || "ALL"
  });

  const container = document.getElementById("xbox-vault-grid");
  if (!container || !res.catalog) return;

  container.innerHTML = res.catalog.map(item => `
    <div class="vault-card" style="border:1px solid #C5A059; padding:15px; border-radius:6px; margin-bottom:10px;">
      <div style="font-size:11px; font-weight:bold; color:#9E7B35;">SLOT #${item.slot} [${item.access}]</div>
      <div style="font-size:14px; font-weight:bold; margin:5px 0;">${item.name}</div>
      <div style="font-size:12px; color:#555;">Dimensione: ${item.size} // Tipo: ${item.type}</div>
      <button onclick="sfxUnlockVaultSlot(${item.slot})" class="btn-vault-unlock" style="margin-top:8px;">Sblocca Token 120m</button>
    </div>
  `).join("");
}

async function sfxUnlockVaultSlot(slotNumber) {
  const res = await sfxApiCall({
    action: "generate_vault_token",
    slotNumber: slotNumber,
    sessionToken: sfxGetActiveSessionToken()
  });

  if (res.success && res.downloadUrl) {
    sfxShowToast("Token generato per Slot #" + slotNumber + ". Validità: 120 minuti.", "success");
    window.open(res.downloadUrl, "_blank");
  } else {
    sfxShowToast(res.message || "Accesso non autorizzato allo slot.", "error");
  }
}

async function sfxFetchFleetStatus() {
  const res = await sfxApiCall({
    action: "get_fleet_status"
  });

  const container = document.getElementById("xbox-fleet-container");
  if (!container || !res.agents) return;

  container.innerHTML = res.agents.map(ag => `
    <div class="agent-badge" style="display:inline-block; border:1px solid rgba(197,160,89,0.3); padding:8px 12px; margin:4px; border-radius:4px; background:#FAF8F5;">
      <span style="font-weight:bold; color:#0B192C;">${ag.id} [${ag.codename}]</span>: 
      <span style="color:#2E7D32; font-size:11px; font-weight:bold;">${ag.status}</span>
    </div>
  `).join("");
}

async function sfxFetchGoldCardRegistry() {
  const res = await sfxApiCall({
    action: "get_goldcard_registry",
    sessionToken: sfxGetActiveSessionToken()
  });

  const container = document.getElementById("xbox-goldcard-table-body");
  if (!container || !res.cards) return;

  container.innerHTML = res.cards.map(c => `
    <tr>
      <td style="font-family:monospace;">${c.matricola}</td>
      <td><strong>${c.titolare}</strong></td>
      <td>${c.punti} PT</td>
      <td>${c.soglia}</td>
      <td><span class="badge">${c.statoFisico}</span></td>
    </tr>
  `).join("");
}

async function sfxTriggerNotificationTest() {
  sfxShowToast("Invio sequenza di test multicanale in corso...", "info");
  const res = await sfxApiCall({
    action: "test_notifications",
    sessionToken: sfxGetActiveSessionToken()
  });

  if (res.success) {
    sfxShowToast("Notifica inviata con successo su Telegram, Email e WhatsApp.", "success");
  } else {
    sfxShowToast(res.message || "Errore durante il test notifiche.", "error");
  }
}

async function sfxTriggerKillSwitch(activate) {
  const confirmed = confirm("ATTENZIONE: Si sta per modificare lo stato del Kill Switch del presidio. Continuare?");
  if (!confirmed) return;

  const res = await sfxApiCall({
    action: "trigger_kill_switch",
    state: activate,
    sessionToken: sfxGetActiveSessionToken()
  });

  if (res.success) {
    sfxShowToast("Stato Kill-Switch aggiornato: " + (activate ? "ATTIVO" : "DISATTIVO"), "warning");
  } else {
    sfxShowToast(res.message || "Operazione non riuscita.", "error");
  }
}

/**
 * 6. SISTEMA DI NOTIFICA TOAST UI
 */
function sfxShowToast(message, type = "info") {
  let toastContainer = document.getElementById("sfx-toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "sfx-toast-container";
    toastContainer.style.cssText = "position:fixed; bottom:20px; right:20px; z-index:99999; display:flex; flex-direction:column; gap:10px;";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  const bgColors = {
    info: "#0B192C",
    success: "#1B5E20",
    warning: "#E65100",
    error: "#B71C1C"
  };

  toast.style.cssText = `
    background: ${bgColors[type] || "#0B192C"};
    color: #FFFFFF;
    border: 1px solid #C5A059;
    padding: 12px 20px;
    border-radius: 4px;
    font-family: 'Space Grotesk', -apple-system, sans-serif;
    font-size: 13px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    transition: opacity 0.3s ease;
  `;
  toast.innerText = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

/**
 * 7. INIZIALIZZAZIONE ALL'AVVIO
 */
document.addEventListener("DOMContentLoaded", () => {
  const leadForm = document.getElementById("sfx-candidatura-form");
  if (leadForm) {
    leadForm.addEventListener("submit", sfxSubmitCandidatura);
  }

  const activeToken = sfxGetActiveSessionToken();
  if (activeToken) {
    sfxLoadXboxDashboard();
  }
});
