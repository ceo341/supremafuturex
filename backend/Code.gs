/**
 * SUPREMA FUTURE X S.R.L. // BACKEND DISPATCHER EAL6+
 * Governance: Giuliano Caratelli CEO
 * Gestione Multi-Canale: Google Sheets + Email + Telegram Bot API
 */

// ==========================================
// CONFIGURAZIONE COSTANTI RISERVATE
// ==========================================
const EMAIL_DIREZIONALE = "ceo@supremaofficial.com";
const EMAIL_BACKUP = "supremaofficia1@gmail.com";

// Inserisci qui il Token del tuo Bot Telegram e il tuo ID Chat (se attivi)
const TELEGRAM_BOT_TOKEN = "INSERISCI_QUI_IL_TUO_BOT_TOKEN_TELEGRAM"; 
const TELEGRAM_CHAT_ID = "INSERISCI_QUI_IL_TUO_CHAT_ID_TELEGRAM";

// ==========================================
// PUNTO DI INGRESSO HTTP POST (ricezione dai Form)
// ==========================================
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    let rawData = e.postData.contents;
    let data = JSON.parse(rawData);
    
    let azione = data.azione || "REGISTRAZIONE_GENERICA";
    let nome = data.nome || "Utente Anonimo";
    let email = data.email || "N/D";
    let telefono = data.telefono || "N/D";
    let canale = data.canale || "Landing Page";
    let note = data.note || "Nessuna nota aggiuntiva";
    let token = data.token || ("NX-2026-" + Math.floor(1000 + Math.random() * 9000));
    let timestamp = new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" });

    // 1. SALVATAGGIO DATORI SU GOOGLE SHEETS
    salvaSuGoogleSheet(timestamp, azione, nome, email, telefono, canale, note, token);

    // 2. INVIO NOTIFICA EMAIL SE RICHIESTO DALL'AZIONE
    if (azione !== "SENTRY_VISITA_QUALIFICATA" && azione !== "SENTRY_CLICK_SEZIONE") {
      inviaNotificaEmail(timestamp, azione, nome, email, telefono, canale, note, token);
      inviaNotificaTelegram(timestamp, azione, nome, email, telefono, canale, note, token);
    }

    // RISPOSTA JSON PER AZZERARE GLI ERRORI CORS
    return ContentService
      .createTextOutput(JSON.stringify({ status: "SUCCESS", message: "Payload registrato ed elaborato con successo.", token: token }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "ERROR", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// ==========================================
// PUNTO DI INGRESSO HTTP GET (Test di Stato)
// ==========================================
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: "ONLINE", 
      sistema: "SUPREMA FUTURE X S.R.L.",
      governance: "Giuliano Caratelli CEO",
      protocollo: "EAL6+ SOVRANO",
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==========================================
// FUNZIONE 1: SALVATAGGIO DATORI SU GOOGLE SHEETS
// ==========================================
function salvaSuGoogleSheet(timestamp, azione, nome, email, telefono, canale, note, token) {
  let doc = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = doc.getSheetByName("REGISTRO_LEAD");

  // Se il foglio non esiste, lo crea con le intestazioni ufficiali
  if (!sheet) {
    sheet = doc.insertSheet("REGISTRO_LEAD");
    sheet.appendRow(["TIMESTAMP", "TIPO AZIONE", "NOME E COGNOME", "EMAIL", "TELEFONO", "CANALE/ORIGINE", "NOTE / PROMPT", "TOKEN NX"]);
    sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#B8860B font-color white").setFontColor("#FFFFFF");
  }

  sheet.appendRow([timestamp, azione, nome, email, telefono, canale, note, token]);
}

// ==========================================
// FUNZIONE 2: INVIO NOTIFICA EMAIL DIREZIONALE
// ==========================================
function inviaNotificaEmail(timestamp, azione, nome, email, telefono, canale, note, token) {
  let oggetto = "🚨 [SUPREMA FUTURE X] Nuova Candidatura: " + azione + " - " + nome;
  
  let corpoEmail = 
    "====================================================\n" +
    "SUPREMA FUTURE X S.R.L. // CONTROL ROOM DIREZIONALE\n" +
    "====================================================\n\n" +
    "Data e Ora: " + timestamp + "\n" +
    "Tipo Evento: " + azione + "\n" +
    "Token NX-2026: " + token + "\n\n" +
    "--- DETTAGLI CANDIDATO ---\n" +
    "Nome e Cognome: " + nome + "\n" +
    "Email: " + email + "\n" +
    "Telefono / WA: " + telefono + "\n" +
    "Canale / Ambito: " + canale + "\n\n" +
    "--- NOTE E DETTAGLI RISERVATI ---\n" +
    note + "\n\n" +
    "====================================================\n" +
    "Notifica automatica generata dal Nodo Neurale EAL6+.\n" +
    "Governance: Giuliano Caratelli CEO";

  try {
    MailApp.sendEmail(EMAIL_DIREZIONALE, oggetto, corpoEmail);
    if (EMAIL_BACKUP && EMAIL_BACKUP !== "") {
      MailApp.sendEmail(EMAIL_BACKUP, oggetto, corpoEmail);
    }
  } catch (err) {
    Logger.log("Errore durante l'invio della mail: " + err.toString());
  }
}

// ==========================================
// FUNZIONE 3: INVIO NOTIFICA TELEGRAM BOT API
// ==========================================
function inviaNotificaTelegram(timestamp, azione, nome, email, telefono, canale, note, token) {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === "INSERISCI_QUI_IL_TUO_BOT_TOKEN_TELEGRAM") {
    return; // Bot Token non ancora configurato
  }

  let testoTelegram = 
    "<b>👑 SUPREMA FUTURE X S.R.L. // NEW LEAD</b>\n" +
    "------------------------------------\n" +
    "<b>Azione:</b> " + azione + "\n" +
    "<b>Candidato:</b> " + nome + "\n" +
    "<b>Email:</b> " + email + "\n" +
    "<b>Tel:</b> " + telefono + "\n" +
    "<b>Ambito:</b> " + canale + "\n" +
    "<b>Token:</b> <code>" + token + "</code>\n" +
    "<b>Note:</b> " + note + "\n" +
    "------------------------------------\n" +
    "<i>Data: " + timestamp + "</i>";

  let url = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage";
  
  let payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: testoTelegram,
    parse_mode: "HTML"
  };

  let options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    UrlFetchApp.fetch(url, options);
  } catch (err) {
    Logger.log("Errore durante l'invio su Telegram: " + err.toString());
  }
}
