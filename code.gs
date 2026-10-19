/**
 * SUPREMA FUTURE X — BACKEND ENGINE v16 EAL6+
 * Dominio: supremafuturex.com
 * Routing: ceo@ | academy@ | desk@ | support@
 */

const CONFIG = {
  TELEGRAM_BOT_TOKEN: "INSERISCI_QUI_IL_TUO_BOT_TOKEN", // Es: 123456789:ABCdef...
  TELEGRAM_CHAT_ID: "INSERISCI_QUI_LA_TUA_CHAT_ID",       // Es: -100123456789 o ID privato CEO
  DRIVE_VAULT_FOLDER: "MEDIA_VAULT_SUPREMA",
  MEET_ROOM_SCREENING: "https://meet.google.com/new",     // Stanza protetta call screening
  PREZZI: {
    "Double Impact": 299,
    "Nexus": 349,
    "Sovereign Enterprise": 399
  }
};

// =========================================================================
// 1. ENDPOINT GET (Lettura Dati per Dashboard X-BOX)
// =========================================================================
function doGet(e) {
  const action = e.parameter.action;
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (action === "getCandidati") {
    const sheet = ottieniOFaFoglio(ss, "Candidati", [
      "DATA_REGISTRAZIONE", "ID_NEXUS", "NOME", "EMAIL", "TELEGRAM", "PERCORSO", "GOLD_CARD", "STATO", "REMINDER_24H", "REMINDER_2H"
    ]);
    const dati = sheet.getDataRange().getValues();
    const headers = dati[0];
    const rows = dati.slice(1);
    const lista = rows.map(r => {
      let obj = {};
      headers.forEach((h, i) => obj[h] = r[i]);
      return obj;
    });
    return creaRispostaJSON({ status: "success", dati: lista });
  }

  if (action === "getDashboardData") {
    const sheetMastro = ottieniOFaFoglio(ss, "Mastro_Finanziario", [
      "TIMESTAMP", "DESCRIZIONE", "TIPO", "IMPORTO", "OPS_54", "DIV_30", "TAX_16", "HASH"
    ]);
    const datiMastro = sheetMastro.getDataRange().getValues();
    const voci = datiMastro.slice(1).map(r => ({
      timestamp: r[0],
      descrizione: r[1],
      tipo: r[2],
      importo: r[3],
      operativita: r[4],
      dividendi: r[5],
      tasse: r[6],
      proofHash: r[7]
    }));
    return creaRispostaJSON({ status: "success", corsisti: voci });
  }

  return creaRispostaJSON({ status: "running", nodo: "EAL6+ Sovrano", domain: "supremafuturex.com" });
}

// =========================================================================
// 2. ENDPOINT POST (Smistamento Form, Upload, Mastro e Ticket Supporto)
// =========================================================================
function doPost(e) {
  try {
    let payload = {};
    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter;
      }
    } else {
      payload = e.parameter;
    }

    const action = payload.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // A. UPLOAD MEDIA VAULT (Foto, Video, Slide, PDF da Dispositivo)
    if (action === "uploadMediaVault") {
      const folder = ottieniOCreaCartellaDrive(CONFIG.DRIVE_VAULT_FOLDER);
      const decodedBytes = Utilities.base64Decode(payload.fileBase64);
      const blob = Utilities.newBlob(decodedBytes, payload.mimeType || "application/octet-stream", payload.nomeFile || "Asset_SFX");
      const file = folder.createFile(blob);
      file.setDescription("Caricato tramite X-BOX Aziendale da CEO Caratelli. Categoria: " + (payload.categoria || "GENERICO"));

      // Notifica Telegram di avvenuta archiviazione
      inviaTelegram(`📦 <b>Nuovo Asset Archiviato nel Media Vault</b>\n<b>File:</b> ${payload.nomeFile}\n<b>Categoria:</b> ${payload.categoria}\n<b>Drive Link:</b> <a href="${file.getUrl()}">Apri File</a>`);

      return creaRispostaJSON({ status: "success", fileId: file.getId(), url: file.getUrl() });
    }

    // B. MODULO TICKET SUPPORTO / ASSISTENZA ("Hai bisogno di noi")
    if (action === "inviaTicketSupporto" || action === "ticket") {
      const sheetTicket = ottieniOFaFoglio(ss, "Ticket_Supporto", [
        "DATA_ORA", "ID_TICKET", "NOME", "EMAIL", "TELEGRAM", "CATEGORIA", "MESSAGGIO", "STATO"
      ]);
      const ticketId = "TK-" + Utilities.formatDate(new Date(), "GMT+2", "yyyyMMdd") + "-" + Math.floor(100 + Math.random() * 900);
      const dataOra = Utilities.formatDate(new Date(), "GMT+2", "dd/MM/yyyy HH:mm:ss");

      sheetTicket.appendRow([
        dataOra,
        ticketId,
        payload.nome || "Anonimo",
        payload.email || "Nessuna",
        payload.telegram || "Non specificato",
        payload.categoria || "Generale",
        payload.messaggio || "",
        "APERTO"
      ]);

      // Ricevuta automatica da support@supremafuturex.com
      if (payload.email) {
        inviaEmailTransazionale(
          payload.email,
          `[Ticket #${ticketId}] Presa in carico richiesta di supporto`,
          `Gentile ${payload.nome || 'Utente'},\n\nAbbiamo ricevuto la tua richiesta di assistenza (ID: ${ticketId}).\n\nOggetto / Ambito: ${payload.categoria || 'Generale'}\nDescrizione: "${payload.messaggio}"\n\nUn nostro operatore o la Direzione ti risponderà direttamente entro 4 ore operative.\n\nDesk Operativo & Supporto\nSuprema Future X\nhttps://supremafuturex.com`,
          "support@supremafuturex.com",
          "Suprema Future X Support"
        );
      }

      // Notifica istantanea Telegram al CEO
      inviaTelegram(`🆘 <b>Nuovo Ticket di Supporto (#${ticketId})</b>\n<b>Da:</b> ${payload.nome} (${payload.email})\n<b>Telegram:</b> ${payload.telegram}\n<b>Categoria:</b> ${payload.categoria}\n<b>Messaggio:</b> ${payload.messaggio}`);

      return creaRispostaJSON({ status: "success", ticketId: ticketId, message: "Ticket preso in carico." });
    }

    // C. REGISTRAZIONE CANDIDATURA LANDING PAGE
    if (action === "registraCandidatura" || !action) {
      const sheet = ottieniOFaFoglio(ss, "Candidati", [
        "DATA_REGISTRAZIONE", "ID_NEXUS", "NOME", "EMAIL", "TELEGRAM", "PERCORSO", "GOLD_CARD", "STATO", "REMINDER_24H", "REMINDER_2H"
      ]);
      const idNexus = "NX-" + Math.floor(1000 + Math.random() * 9000);
      const timestamp = new Date();
      const percorsoScelto = payload.percorso || "Double Impact";

      sheet.appendRow([
        timestamp.toISOString(),
        idNexus,
        payload.nome || "Candidato",
        payload.email || "",
        payload.telegram || "",
        percorsoScelto,
        payload.goldCard || "Standard",
        "Screening 30m Pendente",
        false,
        false
      ]);

      // Conferma al candidato da academy@supremafuturex.com
      if (payload.email) {
        inviaEmailTransazionale(
          payload.email,
          "Candidatura Confermata // Protocollo Screening 30 Min — Suprema Future X",
          `Gentile ${payload.nome},\n\nLa tua candidatura per l'incubatrice "${percorsoScelto}" è stata registrata con codice univoco ${idNexus}.\n\nTi ricordiamo che l'accesso è 100% Live One-to-One e subordinato al superamento della Call di Screening Direzionale da 30 minuti con la Presidenza.\nRiceverai i dettagli di collegamento orario a ridosso della call.\n\nDirezione Generale\nSuprema Future X\nhttps://supremafuturex.com`,
          "academy@supremafuturex.com",
          "Suprema Future X Academy"
        );
      }

      inviaTelegram(`🎯 <b>Nuova Candidatura Ricevuta (${idNexus})</b>\n<b>Nome:</b> ${payload.nome}\n<b>Email:</b> ${payload.email}\n<b>Telegram:</b> ${payload.telegram}\n<b>Percorso:</b> ${percorsoScelto}\n<b>Codice Invito:</b> ${payload.goldCard || 'Nessuno'}`);

      return creaRispostaJSON({ status: "success", idNexus: idNexus });
    }

    // D. MASTRO FINANZIARIO LEDGER (SPLIT 54 / 30 / 16)
    if (action === "registraIncasso") {
      const sheetMastro = ottieniOFaFoglio(ss, "Mastro_Finanziario", [
        "TIMESTAMP", "DESCRIZIONE", "TIPO", "IMPORTO", "OPS_54", "DIV_30", "TAX_16", "HASH"
      ]);
      const imp = parseFloat(payload.importo) || 0;
      const tipo = payload.metodo === "USCITA" ? "USCITA" : "ENTRATA";
      let ops = 0, div = 0, tax = 0;

      if (tipo === "ENTRATA") {
        ops = imp * 0.54;
        div = imp * 0.30;
        tax = imp * 0.16;
      } else {
        ops = imp;
      }

      const txId = "TX-" + Utilities.formatDate(new Date(), "GMT+2", "yyyyMMdd-HHmmss");
      const proofHash = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, txId + imp)).substring(0, 16);

      sheetMastro.appendRow([
        new Date().toISOString(),
        payload.note || "Incasso Mastro",
        tipo,
        imp,
        ops,
        div,
        tax,
        "SHA256-" + proofHash
      ]);

      return creaRispostaJSON({ status: "success", transazioneId: txId, proofHash: proofHash });
    }

    return creaRispostaJSON({ status: "ignored", message: "Azione non riconosciuta." });

  } catch (error) {
    return creaRispostaJSON({ status: "error", message: error.toString() });
  }
}

// =========================================================================
// 3. TRIGGER AUTOMATICO CADENZATO: orologioMarketingEAppuntamenti
// Eseguito ogni ora per verificare le call fissate a 24h e a 2h
// =========================================================================
function orologioMarketingEAppuntamenti() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Candidati");
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return;

  const now = new Date().getTime();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const dataRegistrazione = new Date(row[0]).getTime();
    const nome = row[2];
    const email = row[3];
    const percorso = row[5];
    const r24 = row[8];
    const r2h = row[9];

    // Stima della call di screening a 48 ore dalla registrazione se non specificata
    const tempoCall = dataRegistrazione + (48 * 60 * 60 * 1000);
    const diffOre = (tempoCall - now) / (1000 * 60 * 60);

    // STEP 1: Notifica 24 ore prima
    if (diffOre <= 25 && diffOre >= 23 && !r24) {
      if (email) {
        inviaEmailTransazionale(
          email,
          "Promemoria: Call di Screening Direzionale tra 24 ore // Suprema Future X",
          `Gentile ${nome},\n\nTi ricordiamo che tra 24 ore è programmata la tua Call di Screening Direzionale da 30 minuti per l'accesso a "${percorso}".\n\nAssicurati di trovarti davanti al computer in un ambiente privo di rumori. Analizzeremo gli obiettivi operativi della tua impresa.\n\nPresidenza Esecutiva\nSuprema Future X`,
          "academy@supremafuturex.com",
          "Suprema Future X Direzione"
        );
      }
      inviaTelegram(`⏰ <b>Alert Screening T-24H</b>\nCandidato: <b>${nome}</b> (${email})\nPercorso: ${percorso}`);
      sheet.getRange(i + 1, 9).setValue(true);
    }

    // STEP 2: Notifica urgente 2 ore prima con link Stanza Meet
    if (diffOre <= 2.5 && diffOre >= 0.5 && !r2h) {
      if (email) {
        inviaEmailTransazionale(
          email,
          "Stanza Riservata Aperta: Accesso Screening Live tra 2 ore // Suprema Future X",
          `Gentile ${nome},\n\nLa stanza di collegamento Live per la tua Call di Screening Direzionale è pronta.\n\nAccedi tramite questo link:\n${CONFIG.MEET_ROOM_SCREENING}\n\nSessione 100% Live con il CEO Giuliano Caratelli.\n\nSuprema Future X`,
          "academy@supremafuturex.com",
          "Suprema Future X Live"
        );
      }
      inviaTelegram(`🚨 <b>Alert Screening Imminente (T-2H)</b>\nCandidato: <b>${nome}</b> sta per entrare in call screening.`);
      sheet.getRange(i + 1, 10).setValue(true);
    }
  }
}

// =========================================================================
// 4. FUNZIONI DI SUPPORTO & ROUTING
// =========================================================================
function ottieniOFaFoglio(ss, nomeFoglio, intestazioni) {
  let sheet = ss.getSheetByName(nomeFoglio);
  if (!sheet) {
    sheet = ss.insertSheet(nomeFoglio);
    sheet.appendRow(intestazioni);
    sheet.getRange(1, 1, 1, intestazioni.length).setFontWeight("bold").setBackground("#1F2227").setFontColor("#00F0FF");
  }
  return sheet;
}

function ottieniOCreaCartellaDrive(nomeCartella) {
  const folders = DriveApp.getFoldersByName(nomeCartella);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(nomeCartella);
}

function inviaEmailTransazionale(a, oggetto, corpo, daAlias, nomeMittente) {
  try {
    GmailApp.sendEmail(a, oggetto, corpo, {
      from: daAlias,
      name: nomeMittente
    });
  } catch (err) {
    MailApp.sendEmail(a, oggetto, corpo);
  }
}

function inviaTelegram(testoHTML) {
  if (!CONFIG.TELEGRAM_BOT_TOKEN || CONFIG.TELEGRAM_BOT_TOKEN.includes("INSERISCI")) return;
  try {
    const url = "https://api.telegram.org/bot" + CONFIG.TELEGRAM_BOT_TOKEN + "/sendMessage";
    UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        chat_id: CONFIG.TELEGRAM_CHAT_ID,
        text: testoHTML,
        parse_mode: "HTML",
        disable_web_page_preview: true
      }),
      muteHttpExceptions: true
    });
  } catch (e) {}
}

function creaRispostaJSON(dati) {
  return ContentService.createTextOutput(JSON.stringify(dati))
    .setMimeType(ContentService.MimeType.JSON);
}
