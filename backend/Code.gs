/**
 * =========================================================================
 * SUPREMA FUTURE X - BACKEND GOOGLE APPS SCRIPT (MASTER ECOSISTEMA)
 * File: /backend/Code.gs (su GitHub può essere nominato Code.js)
 * Descrizione: Gestore chiamate API REST, scrittura Google Sheets,
 *              Notifiche Multi-Canale (Email, Telegram) e Autenticazione.
 * =========================================================================
 */

// ==========================================
// CONFIGURAZIONE AMBIENTE
// ==========================================
const CONFIG = {
  EMAIL_DIREZIONE: "mariachiara.official2026@gmail.com",
  EMAIL_CEO: "ceo@supremaofficial.com",
  TELEFONO_WHATSAPP: "+393474429091",
  TELEGRAM_BOT_TOKEN: "INSERISCI_BOT_TOKEN", // Sostituire con il token del Bot Telegram
  TELEGRAM_CHAT_ID: "INSERISCI_CHAT_ID"      // Sostituire con l'ID chat della Direzione
};

/**
 * GESTIONE CHIAMATE GET (Per leggere dati da Apps Script)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: "SUCCESS", message: "Suprema Future X Backend API Online. Server EAL6+ Attivo." }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * GESTIONE CHIAMATE POST (Ricezione dati da index.html, admin.html, vault.html)
 */
function doPost(e) {
  // Impostazione risposta predefinita
  let output = { status: "ERROR", message: "Azione non riconosciuta o payload vuoto." };
  
  // Prevenzione conflitti in scritture simultanee
  const lock = LockService.getScriptLock();
  lock.tryLock(10000); 
  
  try {
    // Parsing dei dati in ingresso
    let requestData;
    if (e.postData && e.postData.contents) {
      requestData = JSON.parse(e.postData.contents);
    } else {
      requestData = e.parameter; // Fallback per form normali
    }

    const azione = requestData.azione;
    const payload = requestData.payload || requestData; // Gestisce sia la struttura nidificata che quella piatta
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // ==========================================
    // 1. AUTENTICAZIONE MASTER & CEO VAULT
    // ==========================================
    if (azione === 'VERIFICA_AUTENTICAZIONE_MASTER') {
      const psw = payload.password || "";
      const pin = payload.pin || "";
      
      const eMasterValida = (psw === "MARIACHIARA ceoofficial2026");
      const ePinValido = (pin === "2026" || pin === "3474429091" || pin === "");

      if (eMasterValida && ePinValido) {
        output = { status: "SUCCESS", role: payload.destinazione === 'vault' ? 'CEO_OWNER' : 'ADMIN_OPERATOR' };
      } else {
        output = { status: "DENIED", message: "Credenziali non valide. Accesso negato dal sistema EAL6+." };
      }
    }

    // ==========================================
    // 2. REGISTRAZIONE LEAD CRM NEXUS & CANDIDATURE
    // ==========================================
    else if (azione === 'REGISTRA_LEAD_CRM' || azione === 'REGISTRAZIONE_LEAD' || azione === 'CANDIDATURA_CONFERENZA') {
      const sheetCRM = ottieniOcreaFoglio(ss, "CRM_Leads_Nexus");
      
      // Creazione Token se non esiste
      const tokenUnivoco = payload.token || payload.codiceNX || ("NX-2026-" + Math.floor(1000 + Math.random() * 9000));
      
      sheetCRM.appendRow([
        new Date(),
        tokenUnivoco,
        payload.nome || "Lead Anonimo",
        payload.email || "Non fornita",
        payload.telefono || "Non fornito",
        payload.corso || payload.canale || "Landing Page",
        payload.note || "",
        "NEXUS_NOTIFIED"
      ]);

      // Scatena la notifica su Email e (se configurato) Telegram
      inviaNotificheMultiCanale(payload, tokenUnivoco, azione);
      
      output = { status: "SUCCESS", token: tokenUnivoco, message: "Lead salvato nel CRM e notifiche direzionali inviate." };
    }

    // ==========================================
    // 3. AGGIORNAMENTO PUNTI GOLD CARD
    // ==========================================
    else if (azione === 'AGGIORNA_PUNTI_FEDELTA' || azione === 'AGGIORNA_PUNTI') {
      const sheetGold = ottieniOcreaFoglio(ss, "Gold_Card_Ledger");
      sheetGold.appendRow([
        new Date(),
        payload.idCarta || payload.token || "SCONOSCIUTO",
        payload.puntiAggiunti || payload.punti || 0,
        payload.puntiTotali || 0,
        payload.grado || "1. Membro Nexus Start",
        payload.causale || "Accredito Sistema"
      ]);

      output = { status: "SUCCESS", message: "Punti aggiornati nel ledger Gold Card." };
    }

    // ==========================================
    // 4. DYNAMIC MEDIA ENGINE CONFIGURATION (FOTO/VIDEO)
    // ==========================================
    else if (azione === 'AGGIORNA_CONFIGURAZIONE_MEDIA') {
      const sheetMedia = ottieniOcreaFoglio(ss, "Media_Config");
      sheetMedia.appendRow([
        new Date(),
        payload.sezione || "Non definita",
        payload.formato || "Sconosciuto",
        payload.url || "Nessun URL"
      ]);

      output = { status: "SUCCESS", message: "Asset Media configurato e registrato nel DB." };
    }

    // ==========================================
    // 5. PROMPT AGENTI IA (ALISON)
    // ==========================================
    else if (azione === 'AGGIORNA_PROMPT_AGENTE' || azione === 'AGGIORNA_PROMPT') {
      const sheetPrompts = ottieniOcreaFoglio(ss, "Agent_Prompts");
      sheetPrompts.appendRow([
        new Date(),
        payload.codiceAgente || "AG-01_ALISON",
        payload.prompt || "Nessun testo",
        payload.operatore || "Sconosciuto"
      ]);

      output = { status: "SUCCESS", message: "Prompt neurale aggiornato." };
    }

    // ==========================================
    // 6. DISPOSIZIONE BONIFICO MEDIOLANUM (VAULT CEO)
    // ==========================================
    else if (azione === 'REGISTRA_PROSPETTO_BONIFICO') {
      const sheetVault = ottieniOcreaFoglio(ss, "CEO_Vault_Ledger");
      sheetVault.appendRow([
        new Date(),
        payload.banca || "BANCA MEDIOLANUM S.P.A.",
        payload.importo || 0,
        payload.causale || "Liquidazione dividendi",
        "DISPOSIZIONE_GENERATA_CEO"
      ]);

      output = { status: "SUCCESS", message: "Disposizione salvata nel ledger del Vault CEO." };
    }

  } catch (err) {
    // Logica di gestione errori globale
    Logger.log("ERRORE SISTEMA: " + err.toString());
    output = { status: "EXCEPTION", error: err.toString() };
  } finally {
    lock.releaseLock();
  }

  // Ritorno JSON abilitato per CORS (Cross-Origin Resource Sharing)
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}


/**
 * =========================================================================
 * FUNZIONI HELPER (SUPPORTO INTERNO)
 * =========================================================================
 */

/**
 * Ottiene un foglio di Google Sheets per nome, se non esiste lo crea e formatta l'intestazione.
 */
function ottieniOcreaFoglio(ss, nomeFoglio) {
  let sheet = ss.getSheetByName(nomeFoglio);
  if (!sheet) {
    sheet = ss.insertSheet(nomeFoglio);
    // Imposta una colorazione base per le nuove schede
    sheet.getRange("A1:Z1").setBackground("#090A0D").setFontColor("#D4AF37").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Motore di Dispatch Notifiche Multi-Canale (Email e Telegram)
 */
function inviaNotificheMultiCanale(data, token, tipoAzione) {
  const nome = data.nome || "Candidato";
  const email = data.email || "Non fornita";
  const telefono = data.telefono || "Non fornito";
  const note = data.note || "Nessuna nota aggiuntiva";
  const corsoOCanale = data.corso || data.canale || "Sito Web";

  // 1. INVIO EMAIL ALLA DIREZIONE (MailBot Nexus)
  try {
    const oggettoMail = `[SUPREMA FUTURE X] Nuovo Lead Ecosistema - ${token}`;
    const corpoMailHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #090A0D; color: #E5E7EB; padding: 20px; border: 1px solid #D4AF37;">
        <h2 style="color: #D4AF37; margin-bottom: 5px;">NOTIFICA CRM NEXUS</h2>
        <p style="color: #00F0FF; font-size: 12px; margin-top: 0;">Evento: ${tipoAzione}</p>
        <hr style="border-top: 1px solid #333;">
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr><td style="padding: 8px; border: 1px solid #333;"><strong>Token:</strong></td><td style="padding: 8px; border: 1px solid #333; color: #00F0FF;">${token}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #333;"><strong>Nome:</strong></td><td style="padding: 8px; border: 1px solid #333;">${nome}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #333;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #333;">${email}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #333;"><strong>Telefono:</strong></td><td style="padding: 8px; border: 1px solid #333; color: #D4AF37;">${telefono}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #333;"><strong>Canale/Corso:</strong></td><td style="padding: 8px; border: 1px solid #333;">${corsoOCanale}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #333;"><strong>Note:</strong></td><td style="padding: 8px; border: 1px solid #333;">${note}</td></tr>
        </table>
      </div>
    `;

    MailApp.sendEmail({
      to: CONFIG.EMAIL_DIREZIONE + "," + CONFIG.EMAIL_CEO,
      subject: oggettoMail,
      htmlBody: corpoMailHtml
    });
  } catch (eMail) {
    Logger.log("Errore invio Email Direzionale: " + eMail.toString());
  }

  // 2. INVIO ALERT TELEGRAM (Se configurato)
  if (CONFIG.TELEGRAM_BOT_TOKEN !== "INSERISCI_BOT_TOKEN") {
    try {
      const testoTelegram = `💎 *NUOVO LEAD NEXUS* 💎\n\n` +
                            `👤 *Nome:* ${nome}\n` +
                            `📧 *Email:* ${email}\n` +
                            `📞 *Tel/WA:* ${telefono}\n` +
                            `🔑 *Token:* \`${token}\`\n` +
                            `🎯 *Target:* ${corsoOCanale}\n` +
                            `📝 *Note:* ${note}\n\n` +
                            `_Notifica Automatica AG-01 Alison_`;

      const urlTelegram = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;
      
      UrlFetchApp.fetch(urlTelegram, {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify({
          chat_id: CONFIG.TELEGRAM_CHAT_ID,
          text: testoTelegram,
          parse_mode: "Markdown"
        })
      });
    } catch (eTelegram) {
      Logger.log("Errore invio Telegram: " + eTelegram.toString());
    }
  }
}
