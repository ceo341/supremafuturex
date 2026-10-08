/**
 * ====================================================================
 * SUPREMA FUTURE X S.R.L. // APPS SCRIPT ENGINE v31 (ENTERPRISE)
 * GOVERNANCE: GIULIANO CARATELLI CEO
 * ====================================================================
 * Gestione CRM Leads, Ingestion Conferenza, Ledger Finanziario, 
 * Indottrinamento Agenti AI e Spedizione Suprema Gold Card Virtuata.
 */

var CONFIG = {
  SPREADSHEET_ID: SpreadsheetApp.getActiveSpreadsheet().getId(),
  ADMIN_EMAIL: "ceo@supremaofficial.com",
  ADMIN_PHONE: "+393474429091",
  TELEGRAM_BOT_TOKEN: "789123456:AAFx_YOUR_TELEGRAM_BOT_TOKEN_HERE",
  TELEGRAM_CHAT_ID: "123456789",
  DOMAIN_URL: "https://supremafuturex.com/"
};

function doGet(e) {
  var params = e ? e.parameter : {};
  var action = params.action || "GET_LEADS";

  if (action === "GET_LEADS") {
    var leads = recuperaTuttiILeads();
    return rispostaJSON({
      status: "online",
      version: "v31_EAL6",
      total: leads.length,
      leads: leads
    });
  }

  return rispostaJSON({ status: "online", message: "Suprema Engine v31 Active" });
}

function doPost(e) {
  try {
    var contents = e.postData ? e.postData.contents : "{}";
    var payload = JSON.parse(contents);
    var action = payload.action || "CANDIDATURA_CONFERENZA_CEO";

    if (action === "CANDIDATURA_CONFERENZA_CEO" || action === "LEAD_INGESTION") {
      return gestisciNuovaCandidatura(payload);
    } else if (action === "AGGIORNA_PROMPT_NEURALE") {
      return aggiornaPromptAgente(payload);
    } else if (action === "LEDGER_ENTRY") {
      return registraMastroFinanziario(payload);
    } else if (action === "EXIT_INTENT_FEEDBACK") {
      return gestisciExitFeedback(payload);
    }

    return rispostaJSON({ status: "error", message: "Azione sconosciuta" });
  } catch (err) {
    Logger.log("Errore doPost: " + err.toString());
    return rispostaJSON({ status: "error", error: err.toString() });
  }
}

function gestisciNuovaCandidatura(data) {
  setupSheets();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads_CRM");
  
  var nome = data.nome || data.name || "Utente Nexus";
  var email = data.email || "non_indicata@sfx.com";
  var telefono = data.telefono || data.phone || "N/D";
  var corsoAsset = data.canale || data.course || "Conferenza CEO";
  var note = data.note || "";
  
  var prossimoProgressivo = calcolaProssimoContatoreCard();
  var nexusCode = "CEOSFX" + padNumero(prossimoProgressivo, 4);
  
  var puntiAccreditati = 100;
  if (corsoAsset.indexOf("Gold") !== -1) puntiAccreditati = 500;
  if (corsoAsset.indexOf("Premium") !== -1 || corsoAsset.indexOf("CEO") !== -1) puntiAccreditati = 1500;
  if (corsoAsset.indexOf("Opal") !== -1) puntiAccreditati = 500;
  if (corsoAsset.indexOf("Antigravity") !== -1) puntiAccreditati = 1000;

  var timestamp = new Date();
  var statusCard = calcolaStatusGrado(puntiAccreditati);

  sheet.appendRow([
    timestamp,
    nexusCode,
    nome,
    email,
    telefono,
    corsoAsset,
    puntiAccreditati,
    statusCard,
    "ATTIVO",
    note
  ]);

  var msgTelegram = "👑 *NUOVO LEAD NEXUS RECUPERATO*\n\n" +
                    "👤 *Nome:* " + nome + "\n" +
                    "📧 *Email:* " + email + "\n" +
                    "📞 *Tel:* " + telefono + "\n" +
                    "🎯 *Asset:* " + corsoAsset + "\n" +
                    "💳 *Codice ID:* `" + nexusCode + "`\n" +
                    "🏆 *Punti Accreditati:* " + puntiAccreditati + " PTS\n" +
                    "📝 *Note:* " + note;
  inviaTelegramNotifica(msgTelegram);

  inviaEmailGoldCardVirtuata(nome, email, nexusCode, puntiAccreditati, statusCard);

  return rispostaJSON({
    status: "success",
    nexusCode: nexusCode,
    points: puntiAccreditati,
    message: "Candidatura registrata ed email inoltrata."
  });
}

function inviaEmailGoldCardVirtuata(name, email, nexusCode, points, statusName) {
  var subject = "👑 Suprema Gold Card // Rilascio Pass Ufficiale — " + name;

  var htmlBody = "" +
    "<div style='background-color: #090A0D; color: #ffffff; font-family: Montserrat, Arial, sans-serif; padding: 30px; max-width: 650px; margin: 0 auto; border-radius: 20px; border: 2px solid #B8860B;'>" +
      "<div style='text-align: center; margin-bottom: 25px;'>" +
        "<h1 style='color: #D4AF37; font-size: 22px; letter-spacing: 2px; margin: 0;'>SUPREMA FUTURE X S.R.L.</h1>" +
        "<p style='color: #00F0FF; font-size: 11px; font-weight: bold; letter-spacing: 3px; margin-top: 5px;'>DREAM DEFENSE SYSTEM // LOYALTY SOVRANO</p>" +
      "</div>" +
      "<p style='font-size: 13px; color: #cbd5e1; line-height: 1.6; text-align: center;'>" +
        "Gentile <strong>" + name + "</strong>, a seguito della Sua candidatura nell'Ecosistema Enterprise, La Direzione del <strong>CEO Giuliano Caratelli</strong> le rilascia la Sua tessera d'accesso ufficiale." +
      "</p>" +
      "<div style='position: relative; max-width: 550px; margin: 25px auto; border-radius: 16px; overflow: hidden; border: 1px solid #B8860B;'>" +
        "<img src='" + CONFIG.DOMAIN_URL + "media/card_front.png' alt='Suprema Gold Card' style='width: 100%; display: block;'>" +
      "</div>" +
      "<div style='background: #12141C; padding: 18px; border-radius: 14px; border: 1px solid #00F0FF; font-family: monospace; font-size: 12px; margin-bottom: 20px;'>" +
        "<p style='margin: 5px 0; color: #94a3b8;'>TITOLARE: <strong style='color: #FFFFFF; font-size: 14px;'>" + name.toUpperCase() + "</strong></p>" +
        "<p style='margin: 5px 0; color: #94a3b8;'>CODICE ID CARD: <strong style='color: #D4AF37; font-size: 14px;'>" + nexusCode + "</strong></p>" +
        "<p style='margin: 5px 0; color: #94a3b8;'>STATUS ASSEGNATO: <strong style='color: #D4AF37;'>" + statusName + "</strong></p>" +
        "<p style='margin: 5px 0; color: #94a3b8;'>SALDO ACCREDITATO: <strong style='color: #00F0FF; font-size: 16px;'>" + points + " PTS</strong></p>" +
      "</div>" +
      "<div style='text-align: center; margin-top: 25px;'>" +
        "<a href='" + CONFIG.DOMAIN_URL + "#gold-card' style='display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #B8860B, #D4AF37); color: #000000; font-weight: bold; text-decoration: none; border-radius: 10px; font-size: 12px;'>SCARICA CARD SUL SITO &rarr;</a>" +
      "</div>" +
      "<hr style='border: 0; border-top: 1px solid #222; margin: 25px 0;'>" +
      "<p style='font-size: 10px; color: #64748b; text-align: center;'>© 2026 SUPREMA FUTURE X S.R.L. // GOVERNANCE: GIULIANO CEO</p>" +
    "</div>";

  try {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (e) {
    Logger.log("Errore invio Email Gold Card: " + e.toString());
  }
}

function registraMastroFinanziario(data) {
  setupSheets();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Ledger_Finanziario");
  
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

  return rispostaJSON({
    status: "success",
    importo: importo,
    splitOps: splitOps,
    splitReserve: splitReserve,
    hashProof: hashProof
  });
}

function aggiornaPromptAgente(data) {
  setupSheets();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("System_Prompts");
  sheet.appendRow([new Date(), data.operatore || "GIULIANO CARATELLI CEO", data.prompt || "Nessun testo"]);
  return rispostaJSON({ status: "success", message: "Prompt aggiornato con successo." });
}

function recuperaTuttiILeads() {
  setupSheets();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads_CRM");
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
      state: data[i][8],
      notes: data[i][9]
    });
  }

  return leads.reverse();
}

function calcolaProssimoContatoreCard() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads_CRM");
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return 2;
  return lastRow;
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

function rispostaJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (!ss.getSheetByName("Leads_CRM")) {
    var sheet = ss.insertSheet("Leads_CRM");
    sheet.appendRow(["Timestamp", "NexusCode", "Nome", "Email", "Telefono", "CorsoAsset", "PuntiGold", "GradoStatus", "StatoPipeline", "Note"]);
    sheet.getRange("1:1").setFontWeight("bold").setBackground("#B8860B").setFontColor("#FFFFFF");
  }

  if (!ss.getSheetByName("Ledger_Finanziario")) {
    var sheetL = ss.insertSheet("Ledger_Finanziario");
    sheetL.appendRow(["Timestamp", "Descrizione", "Tipo", "ImportoTotale", "SplitOps_54", "SplitReserve_30", "SplitTax_16", "HashProof"]);
    sheetL.getRange("1:1").setFontWeight("bold").setBackground("#008B99").setFontColor("#FFFFFF");
  }

  if (!ss.getSheetByName("System_Prompts")) {
    var sheetP = ss.insertSheet("System_Prompts");
    sheetP.appendRow(["Timestamp", "Operatore", "SystemPromptTesto"]);
    sheetP.getRange("1:1").setFontWeight("bold").setBackground("#12141C").setFontColor("#FFFFFF");
  }
}
