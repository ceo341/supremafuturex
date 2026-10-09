/**
 * ====================================================================
 * SUPREMA FUTURE X S.R.L. // APPS SCRIPT MASTER ENGINE EAL6+
 * GOVERNANCE: GIULIANO CARATELLI CEO
 * ====================================================================
 */

var CONFIG = {
  EMAIL_CEO: "ceo@supremaofficial.com",
  PHONE_CEO: "+393474429091",
  TELEGRAM_BOT_TOKEN: "789123456:AAFx_YOUR_TELEGRAM_BOT_TOKEN_HERE", // Inserisci il token Telegram se attivo
  TELEGRAM_CHAT_ID: "123456789",
  DOMAIN_URL: "https://supremafuturex.com/"
};

/**
 * RISPOSTA GET (Lettura Lead per CRM)
 */
function doGet(e) {
  var params = e ? e.parameter : {};
  var action = params.action || params.azione || "GET_LEADS";

  if (action === "GET_LEADS") {
    var leads = recuperaTuttiILeads();
    return rispostaJSON({
      status: "online",
      version: "v34_EAL6_FULL",
      total: leads.length,
      leads: leads
    });
  }

  return rispostaJSON({ status: "online", message: "Suprema Future X Engine Active" });
}

/**
 * RISPOSTA POST (Ingestion Candidature, Prompts, Ledger, Feedback)
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    return rispostaJSON({ status: "busy", message: "Server occupato" });
  }

  try {
    var contents = e.postData ? e.postData.contents : "{}";
    var payload = JSON.parse(contents);
    var action = payload.action || payload.azione || "CANDIDATURA_CONFERENZA_CEO";

    if (action === "CANDIDATURA_CONFERENZA_CEO" || action === "LEAD_INGESTION" || action === "REGISTER_LEAD") {
      return gestisciNuovaCandidatura(payload);
    } else if (action === "AGGIORNA_PROMPT_NEURALE") {
      return aggiornaPromptAgente(payload);
    } else if (action === "LEDGER_ENTRY") {
      return registraMastroFinanziario(payload);
    } else if (action === "EXIT_INTENT_FEEDBACK") {
      return gestisciExitFeedback(payload);
    }

    return rispostaJSON({ status: "success", message: "Azione elaborata" });
  } catch (err) {
    Logger.log("Errore doPost: " + err.toString());
    return rispostaJSON({ status: "error", error: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

/**
 * INGESTION CANDIDATURA & SALVATAGGIO MULTI-TAB COMPATIBILE
 */
function gestisciNuovaCandidatura(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ottieniFoglioFlessibile(ss, ["Leads_CRM", "Nexus_Leads"]);

  var nome = data.nome || data.name || "Candidato Riservato";
  var email = data.email || CONFIG.EMAIL_CEO;
  var telefono = data.telefono || data.phone || CONFIG.PHONE_CEO;
  var corsoAsset = data.canale || data.course || data.asset || "Conferenza CEO Giuliano";
  var note = data.note || "";
  
  var progressivo = sheet.getLastRow() + 1;
  var nexusCode = "CEOSFX" + padNumero(progressivo, 4);

  var punti = 100;
  if (corsoAsset.indexOf("Gold") !== -1) punti = 500;
  if (corsoAsset.indexOf("Premium") !== -1 || corsoAsset.indexOf("CEO") !== -1) punti = 1500;
  if (corsoAsset.indexOf("Opal") !== -1) punti = 500;
  if (corsoAsset.indexOf("Antigravity") !== -1) punti = 1000;

  var timestamp = new Date();
  var statusCard = calcolaStatusGrado(punti);

  sheet.appendRow([
    timestamp,
    nexusCode,
    nome,
    email,
    telefono,
    corsoAsset,
    punti,
    statusCard,
    "ATTIVO",
    note
  ]);

  // Invio Notifiche
  inviaEmailCEO("NUOVA CANDIDATURA EXECUTIVA", 
    "Nuova candidatura ricevuta nell'Ecosistema:\n\n" +
    "Nome: " + nome + "\n" +
    "Email: " + email + "\n" +
    "Telefono/WhatsApp: " + telefono + "\n" +
    "Asset/Ambito: " + corsoAsset + "\n" +
    "Codice Assegnato: " + nexusCode + "\n" +
    "Note: " + note
  );

  inviaTelegramNotifica("👑 *NUOVA CANDIDATURA EXECUTIVA*\n\n" +
    "👤 *Nome:* " + nome + "\n" +
    "📧 *Email:* " + email + "\n" +
    "📞 *Tel:* `" + telefono + "`\n" +
    "🎯 *Ambito:* " + corsoAsset + "\n" +
    "💳 *Codice ID:* `" + nexusCode + "`\n" +
    "📝 *Note:* " + note
  );

  inviaEmailGoldCardCorsista(nome, email, nexusCode, punti, statusCard);

  return rispostaJSON({
    status: "success",
    nexusCode: nexusCode,
    punti: punti,
    message: "Candidatura registrata ed email inoltrata."
  });
}

function gestisciExitFeedback(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ottieniFoglioFlessibile(ss, ["Feedback_Valutazioni", "Leads_CRM"]);
  
  sheet.appendRow([
    new Date(),
    "EXIT_INTENT_LEAD",
    data.email || "anonimo@sfx.com",
    5,
    "Recuperato con Exit-Intent Net (+50 PTS)"
  ]);

  inviaEmailCEO("EXIT INTENT LEAD RECUPERATO", "Email recuperata in uscita: " + data.email);
  return rispostaJSON({ status: "success", message: "Feedback exit registrato." });
}

function registraMastroFinanziario(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ottieniFoglioFlessibile(ss, ["Ledger_Finanziario", "CEO_Ledger_Financials"]);
  
  var importo = parseFloat(data.amount) || 0;
  var desc = data.description || "Transazione Ecosistema";
  var tipo = data.type || "ENTRATA";
  
  var splitOps = (importo * 0.54).toFixed(2);
  var splitReserve = (importo * 0.30).toFixed(2);
  var splitTax = (importo * 0.16).toFixed(2);
  var hashProof = "0x" + Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, desc + importo + new Date().getTime())).substring(0, 16);

  sheet.appendRow([
    new Date(),
    desc,
    tipo,
    importo,
    splitOps,
    splitReserve,
    splitTax,
    hashProof
  ]);

  return rispostaJSON({ status: "success", hashProof: hashProof });
}

function aggiornaPromptAgente(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ottieniFoglioFlessibile(ss, ["System_Prompts", "Prompts_Neurali"]);
  sheet.appendRow([new Date(), data.operatore || "GIULIANO CARATELLI CEO", data.prompt || "Nessun testo"]);
  return rispostaJSON({ status: "success", message: "Prompt aggiornato." });
}

function inviaEmailGoldCardCorsista(name, email, nexusCode, points, statusName) {
  var subject = "👑 Suprema Gold Card // Rilascio Pass Ufficiale — " + name;

  var htmlBody = "" +
    "<div style='background-color: #090A0D; color: #ffffff; font-family: Montserrat, Arial, sans-serif; padding: 30px; max-width: 650px; margin: 0 auto; border-radius: 20px; border: 2px solid #B8860B;'>" +
      "<div style='text-align: center; margin-bottom: 25px;'>" +
        "<h1 style='color: #D4AF37; font-size: 20px; letter-spacing: 2px; margin: 0;'>SUPREMA FUTURE X S.R.L.</h1>" +
        "<p style='color: #00F0FF; font-size: 11px; font-weight: bold; letter-spacing: 3px; margin-top: 5px;'>ENTERPRISE DREAM DEFENSE SYSTEM</p>" +
      "</div>" +
      "<p style='font-size: 13px; color: #cbd5e1; line-height: 1.6; text-align: center;'>" +
        "Gentile <strong>" + name + "</strong>, la Direzione del <strong>CEO Giuliano Caratelli</strong> le rilascia la Sua tessera d'accesso ufficiale." +
      "</p>" +
      "<div style='position: relative; max-width: 550px; margin: 25px auto; border-radius: 16px; overflow: hidden; border: 1px solid #B8860B;'>" +
        "<img src='" + CONFIG.DOMAIN_URL + "media/card_front.png' alt='Suprema Gold Card' style='width: 100%; display: block;'>" +
      "</div>" +
      "<div style='background: #12141C; padding: 18px; border-radius: 14px; border: 1px solid #00F0FF; font-family: monospace; font-size: 12px; margin-bottom: 20px;'>" +
        "<p style='margin: 5px 0; color: #94a3b8;'>TITOLARE: <strong style='color: #FFFFFF; font-size: 14px;'>" + name.toUpperCase() + "</strong></p>" +
        "<p style='margin: 5px 0; color: #94a3b8;'>CODICE ID CARD: <strong style='color: #D4AF37; font-size: 14px;'>" + nexusCode + "</strong></p>" +
        "<p style='margin: 5px 0; color: #94a3b8;'>STATUS: <strong style='color: #D4AF37;'>" + statusName + "</strong></p>" +
        "<p style='margin: 5px 0; color: #94a3b8;'>SALDO ACCREDITATO: <strong style='color: #00F0FF; font-size: 16px;'>" + points + " PTS</strong></p>" +
      "</div>" +
      "<div style='text-align: center; margin-top: 25px;'>" +
        "<a href='" + CONFIG.DOMAIN_URL + "#gold-card' style='display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #B8860B, #D4AF37); color: #000000; font-weight: bold; text-decoration: none; border-radius: 10px; font-size: 12px;'>SCARICA CARD SUL SITO &rarr;</a>" +
      "</div>" +
      "<hr style='border: 0; border-top: 1px solid #222; margin: 25px 0;'>" +
      "<p style='font-size: 10px; color: #64748b; text-align: center;'>© 2026 SUPREMA FUTURE X S.R.L. // GOVERNANCE: GIULIANO CEO</p>" +
    "</div>";

  try {
    MailApp.sendEmail({ to: email, subject: subject, htmlBody: htmlBody });
  } catch (e) {
    Logger.log("Errore invio Email Gold Card: " + e.toString());
  }
}

function inviaEmailCEO(oggetto, testo) {
  try {
    MailApp.sendEmail({
      to: CONFIG.EMAIL_CEO,
      subject: "[SUPREMA FUTURE X] " + oggetto,
      body: "ECOSISTEMA SUPREMA FUTURE X\nGovernance: Giuliano CEO\n\n" + testo
    });
  } catch (e) {
    Logger.log("Errore invio MailApp CEO: " + e.toString());
  }
}

function inviaTelegramNotifica(messaggio) {
  if (!CONFIG.TELEGRAM_BOT_TOKEN || CONFIG.TELEGRAM_BOT_TOKEN.indexOf("YOUR_") !== -1) return;
  var url = "https://api.telegram.org/bot" + CONFIG.TELEGRAM_BOT_TOKEN + "/sendMessage";
  var payload = { chat_id: CONFIG.TELEGRAM_CHAT_ID, text: messaggio, parse_mode: "Markdown" };
  try {
    UrlFetchApp.fetch(url, { method: "post", contentType: "application/json", payload: JSON.stringify(payload), muteHttpExceptions: true });
  } catch (e) {
    Logger.log("Errore Telegram: " + e.toString());
  }
}

function ottieniFoglioFlessibile(ss, nomiPossibili) {
  for (var i = 0; i < nomiPossibili.length; i++) {
    var s = ss.getSheetByName(nomiPossibili[i]);
    if (s) return s;
  }
  var newSheet = ss.insertSheet(nomiPossibili[0]);
  newSheet.appendRow(["Timestamp", "NexusCode", "Nome", "Email", "Telefono", "CorsoAsset", "PuntiGold", "GradoStatus", "StatoPipeline", "Note"]);
  return newSheet;
}

function recuperaTuttiILeads() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ottieniFoglioFlessibile(ss, ["Leads_CRM", "Nexus_Leads"]);
  var data = sheet.getDataRange().getValues();
  var leads = [];

  if (data.length <= 1) return [];

  for (var i = 1; i < data.length; i++) {
    leads.push({
      timestamp: data[i][0],
      nexus: data[i][1],
      name: data[i][2],
      email: data[i][3],
      phone: data[i][4],
      course: data[i][5],
      points: data[i][6],
      status: data[i][7],
      notes: data[i][9]
    });
  }
  return leads.reverse();
}

function calcolaStatusGrado(punti) {
  var p = parseInt(punti) || 0;
  if (p >= 3000) return "SOVRANO MAX";
  if (p >= 1500) return "GOLD EXECUTIVE";
  if (p >= 250) return "SILVER EXECUTIVE";
  return "MEMBER BASE";
}

function padNumero(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

function rispostaJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * FUNZIONE DI ATTIVAZIONE E SBLOCCO AUTORIZZAZIONI GOOGLE
 * Seleziona QUESTA FUNZIONE nel menu in alto e clicca su "Esegui" per concedere i permessi.
 */
function testAutorizzazioniGoogle() {
  inviaEmailCEO("TEST AUTORIZZAZIONE GOOGLE", "Se ricevi questa email, le notifiche di Google Apps Script sono attive al 100%!");
  Logger.log("Test autorizzazioni completato con successo.");
}
