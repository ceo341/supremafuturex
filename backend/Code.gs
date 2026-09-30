// SUPREMA FUTURE X S.R.L. - BACKEND ENGINE (Code.gs)
// Architettura Serverless per Google Apps Script (EAL6+ Security Protocol)

const EMAIL_CEO_1 = "ceo@supremaofficial.com";
const EMAIL_CEO_2 = "supremaofficia1@gmail.com";
const TELEGRAM_BOT_TOKEN = ""; // Opzionale: Inserire Token Bot Telegram se attivo
const TELEGRAM_CHAT_ID = "";   // Opzionale: Inserire Chat ID Telegram se attivo

/**
 * Gestione principale delle chiamate POST in arrivo dalla Landing Page (index.html)
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const data = JSON.parse(e.postData.contents);
    const azione = data.azione || "REGISTRAZIONE_GENERICA";
    const dataOra = new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" });

    if (azione === "CANDIDATURA_CONFERENZA") {
      gestisciConferenzaCEO(ss, data, dataOra);
    } else if (azione === "REGISTRAZIONE_LEAD") {
      gestisciLeadNexus(ss, data, dataOra);
    } else if (azione === "FEEDBACK_UTENTE") {
      gestisciFeedback(ss, data, dataOra);
    } else if (azione === "NEWSLETTER_ISCRITTA") {
      gestisciNewsletter(ss, data, dataOra);
    } else if (azione === "SENTRY_VISITA_QUALIFICATA" || azione === "SENTRY_CLICK_SEZIONE") {
      gestisciSentryAnalytics(ss, data, dataOra);
    } else {
      gestisciGenerico(ss, data, dataOra);
    }

    return ContentService.createTextOutput(JSON.stringify({ 
      status: "SUCCESS", 
      message: "Dati elaborati e registrati correttamente nel sistema centralizzato.",
      timestamp: dataOra 
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "ERROR", 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Gestione Candidature Conferenza CEO Giuliano Caratelli (AG-05 Orion)
 */
function gestisciConferenzaCEO(ss, data, dataOra) {
  let sheet = ss.getSheetByName("Conferenze CEO");
  if (!sheet) {
    sheet = ss.insertSheet("Conferenze CEO");
    sheet.appendRow(["Data/Ora", "Nome e Cognome / Azienda", "Email", "Telefono", "Ambito Partecipazione", "Note Riservate", "Stato Processing"]);
    sheet.getRange("A1:G1").setFontWeight("bold").setBackground("#B8860B").setFontColor("#FFFFFF");
  }

  sheet.appendRow([
    dataOra,
    data.nome || "Non specificato",
    data.email || "Non specificata",
    data.telefono || "Non specificato",
    data.canale || data.ambito || "Generico",
    data.note || "Nessuna nota fornita",
    "DA CONTATTARE (RICONTATTO PRIORITARIO 24H)"
  ]);

  const oggetto = "🚨 NUOVA CANDIDATURA CONFERENZA CEO - " + (data.nome || "Utente");
  const corpo = "RICEVUTA NUOVA CANDIDATURA ALLA CONFERENZA CEO GIULIANO CARATELLI\n\n" +
                "Data e Ora: " + dataOra + "\n" +
                "Nome e Cognome / Ragione Sociale: " + (data.nome || "N/D") + "\n" +
                "Email Istituzionale: " + (data.email || "N/D") + "\n" +
                "Telefono / WhatsApp: " + (data.telefono || "N/D") + "\n" +
                "Ambito di Partecipazione: " + (data.canale || "N/D") + "\n" +
                "Note Riservate: " + (data.note || "Nessuna nota") + "\n\n" +
                "Infrastruttura EAL6+ Suprema Future X S.r.l.";

  inviaNotificaEmail(oggetto, corpo);
  inviaNotificaTelegram("🎙️ *CANDIDATURA CONFERENZA CEO*\n*Nome:* " + (data.nome || "N/D") + "\n*Tel:* " + (data.telefono || "N/D") + "\n*Ambito:* " + (data.canale || "N/D"));
}

/**
 * Gestione Leads Chatbot Alison & CRM Nexus (AG-01 Alison)
 */
function gestisciLeadNexus(ss, data, dataOra) {
  let sheet = ss.getSheetByName("Leads Nexus");
  if (!sheet) {
    sheet = ss.insertSheet("Leads Nexus");
    sheet.appendRow(["Data/Ora", "Token NX", "Nome e Cognome", "Email", "Telefono", "Canale / Fonte", "Note e Corso"]);
    sheet.getRange("A1:G1").setFontWeight("bold").setBackground("#008B99").setFontColor("#FFFFFF");
  }

  const token = data.token || ("NX-2026-" + Math.floor(1000 + Math.random() * 9000));

  sheet.appendRow([
    dataOra,
    token,
    data.nome || "Lead Anonimo",
    data.email || "Non specificata",
    data.telefono || "Non specificato",
    data.canale || "Landing Page",
    data.note || "Nessuna nota"
  ]);

  const oggetto = "⚡ NUOVO LEAD CRM NEXUS - Token " + token;
  const corpo = "NUOVO LEAD REGISTRATO NEL CRM NEXUS (AG-01 ALISON)\n\n" +
                "Token Assegnato: " + token + "\n" +
                "Data e Ora: " + dataOra + "\n" +
                "Nome: " + (data.nome || "N/D") + "\n" +
                "Email: " + (data.email || "N/D") + "\n" +
                "Telefono: " + (data.telefono || "N/D") + "\n" +
                "Fonte/Canale: " + (data.canale || "N/D") + "\n" +
                "Note / Corso: " + (data.note || "Nessuna nota") + "\n\n" +
                "Suprema Future X S.r.l. - Flotta Neurale Agente Alison";

  inviaNotificaEmail(oggetto, corpo);
  inviaNotificaTelegram("⚡ *NUOVO LEAD CRM NEXUS*\n*Token:* " + token + "\n*Nome:* " + (data.nome || "N/D") + "\n*Email:* " + (data.email || "N/D"));
}

/**
 * Gestione Feedback Diretti inviati al CEO (AG-07 Harper)
 */
function gestisciFeedback(ss, data, dataOra) {
  let sheet = ss.getSheetByName("Feedback Diretti");
  if (!sheet) {
    sheet = ss.insertSheet("Feedback Diretti");
    sheet.appendRow(["Data/Ora", "Nome Utente / Ruolo", "Messaggio Feedback", "Stato"]);
    sheet.getRange("A1:D1").setFontWeight("bold").setBackground("#D4AF37").setFontColor("#000000");
  }

  sheet.appendRow([
    dataOra,
    data.nome || "Utente Anonimo",
    data.note || data.messaggio || "Nessun testo",
    "RICEVUTO X-BOX"
  ]);

  const oggetto = "💬 NUOVO FEEDBACK DIRETTO AL CEO - " + (data.nome || "Utente");
  const corpo = "RICEVUTO NUOVO FEEDBACK DALLA LANDING PAGE\n\n" +
                "Data e Ora: " + dataOra + "\n" +
                "Mittente: " + (data.nome || "N/D") + "\n" +
                "Messaggio: " + (data.note || data.messaggio || "N/D") + "\n\n" +
                "Suprema Future X S.r.l.";

  inviaNotificaEmail(oggetto, corpo);
}

/**
 * Gestione Iscrizioni alla Newsletter Riservata (AG-07 Harper)
 */
function gestisciNewsletter(ss, data, dataOra) {
  let sheet = ss.getSheetByName("Iscritti Newsletter");
  if (!sheet) {
    sheet = ss.insertSheet("Iscritti Newsletter");
    sheet.appendRow(["Data/Ora", "Email Istituzionale", "Stato Abbonamento"]);
    sheet.getRange("A1:C1").setFontWeight("bold").setBackground("#12141C").setFontColor("#00F0FF");
  }

  sheet.appendRow([
    dataOra,
    data.email || "Non specificata",
    "ATTIVO (NOTIZIARIO RISERVATO)"
  ]);

  const oggetto = "📧 NUOVA ISCRIZIONE NEWSLETTER - " + (data.email || "Email");
  const corpo = "NUOVA ISCRIZIONE AL NOTIZIARIO RISERVATO SUPREMA FUTURE X\n\n" +
                "Data e Ora: " + dataOra + "\n" +
                "Email: " + (data.email || "N/D") + "\n\n" +
                "Suprema Future X S.r.l.";

  inviaNotificaEmail(oggetto, corpo);
}

/**
 * Gestione Log Sentry Analytics (> 10 Sec & Click Sezioni)
 */
function gestisciSentryAnalytics(ss, data, dataOra) {
  let sheet = ss.getSheetByName("Analytics Sentry");
  if (!sheet) {
    sheet = ss.insertSheet("Analytics Sentry");
    sheet.appendRow(["Data/Ora", "Tipo Evento Sentry", "Sezione Cliccata", "Permanenza Utente"]);
    sheet.getRange("A1:D1").setFontWeight("bold").setBackground("#333333").setFontColor("#FFFFFF");
  }

  sheet.appendRow([
    dataOra,
    data.azione || "VISITA_QUALIFICATA",
    data.sezione || "Intero Ecosistema",
    data.permanenza || "> 10 Secondi"
  ]);
}

/**
 * Gestione Log Generici di Fallback
 */
function gestisciGenerico(ss, data, dataOra) {
  let sheet = ss.getSheetByName("Log Generici");
  if (!sheet) {
    sheet = ss.insertSheet("Log Generici");
    sheet.appendRow(["Data/Ora", "Azione Registrata", "Payload JSON Completo"]);
    sheet.getRange("A1:C1").setFontWeight("bold").setBackground("#4A5568").setFontColor("#FFFFFF");
  }

  sheet.appendRow([
    dataOra, 
    data.azione || "INFO_GENERICA", 
    JSON.stringify(data)
  ]);
}

/**
 * Funzione di Invio Email Simultaneo alla Direzione (CEO)
 */
function inviaNotificaEmail(oggetto, corpo) {
  try {
    MailApp.sendEmail(EMAIL_CEO_1, oggetto, corpo);
    MailApp.sendEmail(EMAIL_CEO_2, oggetto, corpo);
  } catch (err) {
    Logger.log("Errore durante l'invio della notifica mail: " + err.toString());
  }
}

/**
 * Funzione Invio Notifiche Telegram Bot
 */
function inviaNotificaTelegram(testo) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    const url = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage";
    const payload = {
      chat_id: TELEGRAM_CHAT_ID,
      text: testo,
      parse_mode: "Markdown"
    };
    UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload)
    });
  } catch (err) {
    Logger.log("Errore durante l'invio della notifica Telegram: " + err.toString());
  }
}

/**
 * Test dello stato del server tramite chiamata GET
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ONLINE",
    system: "SUPREMA FUTURE X S.R.L. BACKEND ENGINE EAL6+",
    version: "2026.09",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}
