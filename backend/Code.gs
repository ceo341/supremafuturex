/**
 * SUPREMA FUTURE X - BACKEND GOOGLE APPS SCRIPT
 * File: /backend/Code.gs
 * Descrizione: Gestore delle chiamate API REST, scrittura su Google Sheets e notifiche multi-canale.
 */

function doPost(e) {
  var output = { status: "ERROR", message: "Azione non riconosciuta" };
  
  try {
    var requestData = JSON.parse(e.postData.contents);
    var azione = requestData.azione;
    var payload = requestData.payload || {};
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. AUTENTICAZIONE MASTER & CEO VAULT
    if (azione === 'VERIFICA_AUTENTICAZIONE_MASTER') {
      var eMasterValida = (payload.password === "MARIACHIARA ceoofficial2026");
      var ePinValido = (payload.pin === "2026" || payload.pin === "");

      if (eMasterValida && ePinValido) {
        output = { status: "SUCCESS", role: payload.destinazione === 'vault' ? 'CEO_OWNER' : 'ADMIN_OPERATOR' };
      } else {
        output = { status: "DENIED", message: "Credenziali non valide" };
      }
    }

    // 2. REGISTRAZIONE LEAD CRM NEXUS & NOTIFICHE MULTI-CANALE
    else if (azione === 'REGISTRA_LEAD_CRM') {
      var sheetCRM = ottieniOcreaFoglio(ss, "CRM_Leads_Nexus");
      sheetCRM.appendRow([
        new Date(),
        payload.codiceNX || "",
        payload.nome || "",
        payload.email || "",
        payload.telefono || "",
        payload.note || "",
        "NEXUS_NOTIFIED"
      ]);

      inviaNotificheMultiCanale(payload);
      output = { status: "SUCCESS", message: "Lead salvato e notifiche inviate." };
    }

    // 3. AGGIORNAMENTO PUNTI GOLD CARD
    else if (azione === 'AGGIORNA_PUNTI_FEDELTA') {
      var sheetGold = ottieniOcreaFoglio(ss, "Gold_Card_Ledger");
      sheetGold.appendRow([
        new Date(),
        payload.idCarta || "",
        payload.puntiAggiunti || 0,
        payload.puntiTotali || 0,
        payload.grado || "",
        payload.causale || ""
      ]);

      output = { status: "SUCCESS", message: "Punti aggiornati nel ledger." };
    }

    // 4. DYNAMIC MEDIA ENGINE CONFIGURATION
    else if (azione === 'AGGIORNA_CONFIGURAZIONE_MEDIA') {
      var sheetMedia = ottieniOcreaFoglio(ss, "Media_Config");
      sheetMedia.appendRow([
        new Date(),
        payload.sezione || "",
        payload.formato || "",
        payload.url || ""
      ]);

      output = { status: "SUCCESS", message: "Media configurato." };
    }

    // 5. PROMPT AGENTI IA
    else if (azione === 'AGGIORNA_PROMPT_AGENTE') {
      var sheetPrompts = ottieniOcreaFoglio(ss, "Agent_Prompts");
      sheetPrompts.appendRow([
        new Date(),
        payload.codiceAgente || "",
        payload.prompt || ""
      ]);

      output = { status: "SUCCESS", message: "Prompt aggiornato." };
    }

    // 6. DISPOSIZIONE BONIFICO MEDIOLANUM
    else if (azione === 'REGISTRA_PROSPETTO_BONIFICO') {
      var sheetVault = ottieniOcreaFoglio(ss, "CEO_Vault_Ledger");
      sheetVault.appendRow([
        new Date(),
        payload.banca || "BANCA MEDIOLANUM",
        payload.importo || 0,
        payload.causale || "",
        "DISPOSIZIONE_GENERATA"
      ]);

      output = { status: "SUCCESS", message: "Disposizione salvata nel Vault." };
    }

  } catch (err) {
    output = { status: "EXCEPTION", error: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

function ottieniOcreaFoglio(ss, nomeFoglio) {
  var sheet = ss.getSheetByName(nomeFoglio);
  if (!sheet) {
    sheet = ss.insertSheet(nomeFoglio);
  }
  return sheet;
}

function inviaNotificheMultiCanale(data) {
  try {
    MailApp.sendEmail({
      to: "mariachiara.official2026@gmail.com",
      subject: "[SUPREMA FUTURE X] Nuova Candidatura CRM - " + data.codiceNX,
      body: "Nuovo Lead registrato:\n\nNome: " + data.nome + "\nEmail: " + data.email + "\nTelefono: " + data.telefono + "\nNote: " + data.note
    });
  } catch (e) {
    Logger.log("Errore invio email: " + e.toString());
  }
}
