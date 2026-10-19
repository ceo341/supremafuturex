/**
 * ============================================================================
 * SUPREMA FUTURE X — ERP & INFRASTRUCTURE BACKEND ENGINE v16 EAL6+
 * Dominio Primario: supremafuturex.com
 * Routing Caselle: ceo@ | academy@ | desk@ | support@
 * Copyright © 2026 Suprema Future X. Tutti i diritti riservati.
 * ============================================================================
 */

// ============================================================================
// 1. CONFIGURAZIONE CENTRALE, MATRICE PREZZI & TOKEN TELEGRAM
// ============================================================================
const CONFIG_SFX = {
  VERSIONE: "16.3.1 - EAL6+ SOVEREIGN FULL MASTER",
  DOMINIO: "supremafuturex.com",
  NOME_AZIENDA: "Suprema Future X",
  CEO_NOME: "Giuliano Caratelli",

  // Canali Email Istituzionali Allineati
  EMAIL_CEO: "ceo@supremafuturex.com",
  EMAIL_ACADEMY: "academy@supremafuturex.com",
  EMAIL_DESK: "desk@supremafuturex.com",
  EMAIL_SUPPORT: "support@supremafuturex.com",

  // Integrazione Bot Telegram Ufficiale & Chat ID Personale Convalidato
  TELEGRAM_BOT_TOKEN: "8881640493:AAGPBeTAtU0YyQe36PT0duOZZcPuTbsSZdl",
  TELEGRAM_CHAT_ID: "6534406542",

  // Cartelle Cloud Google Drive
  DRIVE_VAULT_FOLDER: "MEDIA_VAULT_SUPREMA",
  DRIVE_ASSEDIO_ROOT: "SFX_CORSISTI_WORKSPACE",
  MEET_STANZA_SCREENING: "https://meet.google.com/new",

  // Matrice Economica (100% Live One-to-One — Prezzi Bloccati)
  LISTINO: {
    "Double Impact": { prezzo: 299.00, ops: 161.46, div: 89.70, tax: 47.84 },
    "Nexus": { prezzo: 349.00, ops: 188.46, div: 104.70, tax: 55.84 },
    "Sovereign Enterprise": { prezzo: 399.00, ops: 215.46, div: 119.70, tax: 63.84 }
  },

  // Ripartizione Statutaria Mastro Finanziario Ledger
  PERCENTUALI: {
    OPERATIVITA: 0.54, // 54% Server, Infrastruttura, Flotta AI
    DIVIDENDI: 0.30,   // 30% Utili Direzione / Riserva CEO
    TASSE: 0.16        // 16% Accantonamento Intoccabile F24
  },

  // Referral e Gold Card
  GOLD_CARD: {
    SCONTO_CORSISTA: 0.05,  // 5% sconto allievo
    PROVVIGIONE_CASSA: 0.10 // 10% accredito presentatore
  }
};

// ============================================================================
// 2. ENTRY POINT GET (API Dashboard X-BOX & Monitoraggio)
// ============================================================================
function doGet(e) {
  try {
    const action = e.parameter ? e.parameter.action : null;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // A. Lettura registro candidati
    if (action === "getCandidati") {
      const sheet = ottieniOFaFoglio(ss, "Candidati", [
        "DATA_REGISTRAZIONE", "ID_NEXUS", "NOME", "EMAIL", "TELEGRAM",
        "PERCORSO", "GOLD_CARD", "STATO", "REMINDER_24H", "REMINDER_2H", "RECUPERO_GHOST", "FEEDBACK_14D"
      ]);
      const rows = sheet.getDataRange().getValues();
      if (rows.length <= 1) {
        return creaRispostaJSON({ status: "success", dati: [] });
      }
      const headers = rows[0];
      const lista = rows.slice(1).map(r => {
        let obj = {};
        headers.forEach((h, i) => obj[h] = r[i]);
        return obj;
      });
      return creaRispostaJSON({ status: "success", dati: lista });
    }

    // B. Lettura Mastro Finanziario Ledger (Split 54/30/16)
    if (action === "getDashboardData") {
      const sheetMastro = ottieniOFaFoglio(ss, "Mastro_Finanziario", [
        "TIMESTAMP", "DESCRIZIONE", "TIPO", "IMPORTO", "OPS_54", "DIV_30", "TAX_16", "HASH"
      ]);
      const rows = sheetMastro.getDataRange().getValues();
      const corsisti = rows.slice(1).map(r => ({
        timestamp: r[0],
        descrizione: r[1],
        tipo: r[2],
        importo: r[3],
        operativita: r[4],
        dividendi: r[5],
        tasse: r[6],
        proofHash: r[7]
      }));
      return creaRispostaJSON({ status: "success", corsisti: corsisti });
    }

    // C. Lettura Ticket Helpdesk ("Hai bisogno di aiuto")
    if (action === "getTickets") {
      const sheetTickets = ottieniOFaFoglio(ss, "Ticket_Supporto", [
        "DATA_ORA", "ID_TICKET", "NOME", "EMAIL", "TELEGRAM", "CATEGORIA", "MESSAGGIO", "STATO"
      ]);
      const rows = sheetTickets.getDataRange().getValues();
      const tickets = rows.slice(1).map(r => ({
        dataOra: r[0],
        idTicket: r[1],
        nome: r[2],
        email: r[3],
        telegram: r[4],
        categoria: r[5],
        messaggio: r[6],
        stato: r[7]
      }));
      return creaRispostaJSON({ status: "success", tickets: tickets });
    }

    // D. Lettura Log di Audit EAL6+
    if (action === "getAuditLogs") {
      const sheetAudit = ottieniOFaFoglio(ss, "Log_Audit_EAL6", ["TIMESTAMP", "AZIONE", "LIVELLO", "DETTAGLI"]);
      const rows = sheetAudit.getDataRange().getValues();
      const logs = rows.slice(1).map(r => ({
        timestamp: r[0],
        azione: r[1],
        livello: r[2],
        dettagli: r[3]
      }));
      return creaRispostaJSON({ status: "success", logs: logs });
    }

    // E. Ping di telemetria nodo
    return creaRispostaJSON({
      status: "active",
      nodo: "EAL6+ SOVRANO NOC",
      sistema: CONFIG_SFX.NOME_AZIENDA,
      dominio: CONFIG_SFX.DOMINIO,
      tokenTelegramAttivo: !!CONFIG_SFX.TELEGRAM_BOT_TOKEN,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    registraLogAudit("doGet_CRITICAL_ERROR", "ERROR", err.toString());
    return creaRispostaJSON({ status: "error", message: err.toString() });
  }
}

// ============================================================================
// 3. ENTRY POINT POST (Upload Media, Helpdesk, Landing, Mastro, Assedio)
// ============================================================================
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
      payload = e.parameter || {};
    }

    const action = payload.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // ------------------------------------------------------------------------
    // CASE A: UPLOAD FILE NEL MEDIA VAULT (Foto, Video, Slide, PDF Base64)
    // ------------------------------------------------------------------------
    if (action === "uploadMediaVault") {
      if (!payload.fileBase64) {
        return creaRispostaJSON({ status: "error", message: "Stringa Base64 del file assente." });
      }

      const cartellaVault = ottieniOCreaCartellaDrive(CONFIG_SFX.DRIVE_VAULT_FOLDER);
      const decodedData = Utilities.base64Decode(payload.fileBase64);
      const mime = payload.mimeType || "application/octet-stream";
      const nomeFile = payload.nomeFile || `SFX_ASSET_${Date.now()}`;
      const blob = Utilities.newBlob(decodedData, mime, nomeFile);
      const fileCreato = cartellaVault.createFile(blob);

      const categoria = payload.categoria || "DOCUMENTO";
      fileCreato.setDescription(`Caricato tramite X-BOX da Presidenza | Categoria: ${categoria} | Data: ${new Date().toISOString()}`);

      const sheetMedia = ottieniOFaFoglio(ss, "Media_Vault", [
        "DATA_CARICAMENTO", "NOME_FILE", "CATEGORIA", "MIME_TYPE", "DRIVE_ID", "URL_FILE"
      ]);
      sheetMedia.appendRow([
        new Date().toISOString(),
        nomeFile,
        categoria,
        mime,
        fileCreato.getId(),
        fileCreato.getUrl()
      ]);

      inviaTelegram(
        `📁 <b>Media Vault // Nuovo Asset Archiviato</b>\n` +
        `<b>Nome:</b> ${nomeFile}\n` +
        `<b>Categoria:</b> ${categoria}\n` +
        `<b>Mime:</b> ${mime}\n` +
        `<b>Link Drive:</b> <a href="${fileCreato.getUrl()}">Apri Risorsa</a>`
      );

      registraLogAudit("UPLOAD_MEDIA_VAULT", "INFO", `File: ${nomeFile} (${categoria}) salvato su Drive.`);
      return creaRispostaJSON({ status: "success", fileId: fileCreato.getId(), url: fileCreato.getUrl() });
    }

    // ------------------------------------------------------------------------
    // CASE B: MODULO TICKET ASSISTENZA ("Hai bisogno di aiuto")
    // ------------------------------------------------------------------------
    if (action === "inviaTicketSupporto" || action === "ticket") {
      const sheetTickets = ottieniOFaFoglio(ss, "Ticket_Supporto", [
        "DATA_ORA", "ID_TICKET", "NOME", "EMAIL", "TELEGRAM", "CATEGORIA", "MESSAGGIO", "STATO"
      ]);

      const idTicket = "TK-" + Utilities.formatDate(new Date(), "GMT+2", "yyyyMMdd") + "-" + Math.floor(100 + Math.random() * 900);
      const dataOra = Utilities.formatDate(new Date(), "GMT+2", "dd/MM/yyyy HH:mm:ss");
      const nome = payload.nome || "Anonimo";
      const email = payload.email || "";
      const telegram = payload.telegram || "Non specificato";
      const categoria = payload.categoria || "Assistenza Generale";
      const messaggio = payload.messaggio || "";

      sheetTickets.appendRow([
        dataOra,
        idTicket,
        nome,
        email,
        telegram,
        categoria,
        messaggio,
        "APERTO"
      ]);

      if (email) {
        const corpoHTML = generaTemplateEmailSupporto({
          nome: nome,
          idTicket: idTicket,
          categoria: categoria,
          messaggio: messaggio
        });

        inviaEmailTransazionale(
          email,
          `[Ticket #${idTicket}] Ricezione Richiesta di Supporto // Suprema Future X`,
          corpoHTML,
          CONFIG_SFX.EMAIL_SUPPORT,
          "Suprema Future X Support"
        );
      }

      inviaTelegram(
        `🆘 <b>Nuovo Ticket Helpdesk (#${idTicket})</b>\n` +
        `<b>Utente:</b> ${nome}\n` +
        `<b>Email:</b> ${email}\n` +
        `<b>Telegram:</b> ${telegram}\n` +
        `<b>Categoria:</b> ${categoria}\n` +
        `<b>Messaggio:</b> <i>${messaggio}</i>`
      );

      registraLogAudit("TICKET_CREATO", "INFO", `Ticket ${idTicket} registrato.`);
      return creaRispostaJSON({ status: "success", idTicket: idTicket, message: "Ticket preso in carico." });
    }

    // ------------------------------------------------------------------------
    // CASE C: REGISTRAZIONE CANDIDATURA LANDING PAGE
    // ------------------------------------------------------------------------
    if (action === "registraCandidatura" || !action) {
      const sheet = ottieniOFaFoglio(ss, "Candidati", [
        "DATA_REGISTRAZIONE", "ID_NEXUS", "NOME", "EMAIL", "TELEGRAM",
        "PERCORSO", "GOLD_CARD", "STATO", "REMINDER_24H", "REMINDER_2H", "RECUPERO_GHOST", "FEEDBACK_14D"
      ]);

      const idNexus = "NX-" + Math.floor(1000 + Math.random() * 9000);
      const dataReg = new Date();
      const nome = payload.nome || "Candidato";
      const email = payload.email || "";
      const telegram = payload.telegram || "";
      const percorso = payload.percorso || "Double Impact";
      const goldCard = payload.goldCard || "Standard";

      sheet.appendRow([
        dataReg.toISOString(),
        idNexus,
        nome,
        email,
        telegram,
        percorso,
        goldCard,
        "Screening Pendente",
        false,
        false,
        false,
        false
      ]);

      if (email) {
        const corpoHTML = generaTemplateEmailCandidatura({
          nome: nome,
          idNexus: idNexus,
          percorso: percorso,
          goldCard: goldCard
        });

        inviaEmailTransazionale(
          email,
          "Protocollo di Selezione One-to-One // Suprema Future X",
          corpoHTML,
          CONFIG_SFX.EMAIL_ACADEMY,
          "Suprema Future X Academy"
        );
      }

      inviaTelegram(
        `🎯 <b>Nuova Candidatura Qualificata [${idNexus}]</b>\n` +
        `<b>Nome:</b> ${nome}\n` +
        `<b>Email:</b> ${email}\n` +
        `<b>Telegram:</b> ${telegram}\n` +
        `<b>Percorso Scelto:</b> ${percorso}\n` +
        `<b>Codice Gold Card:</b> ${goldCard}`
      );

      registraLogAudit("CANDIDATURA_RICEVUTA", "INFO", `Candidato ${idNexus} (${nome}) salvato.`);
      return creaRispostaJSON({ status: "success", idNexus: idNexus });
    }

    // ------------------------------------------------------------------------
    // CASE D: MASTRO FINANZIARIO LEDGER (Split 54 / 30 / 16)
    // ------------------------------------------------------------------------
    if (action === "registraIncasso") {
      const sheetMastro = ottieniOFaFoglio(ss, "Mastro_Finanziario", [
        "TIMESTAMP", "DESCRIZIONE", "TIPO", "IMPORTO", "OPS_54", "DIV_30", "TAX_16", "HASH"
      ]);

      const importo = parseFloat(payload.importo) || 0;
      const tipo = payload.metodo === "USCITA" ? "USCITA" : "ENTRATA";
      let ops = 0, div = 0, tax = 0;

      if (tipo === "ENTRATA") {
        ops = importo * CONFIG_SFX.PERCENTUALI.OPERATIVITA;
        div = importo * CONFIG_SFX.PERCENTUALI.DIVIDENDI;
        tax = importo * CONFIG_SFX.PERCENTUALI.TASSE;
      } else {
        ops = importo;
      }

      const txId = "TX-" + Utilities.formatDate(new Date(), "GMT+2", "yyyyMMdd-HHmmss");
      const proofRaw = `${txId}_${importo}_${new Date().getTime()}`;
      const proofHash = Utilities.base64Encode(
        Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, proofRaw)
      ).substring(0, 16);

      sheetMastro.appendRow([
        new Date().toISOString(),
        payload.note || "Incasso Mastro",
        tipo,
        importo,
        ops,
        div,
        tax,
        "SHA256-" + proofHash
      ]);

      inviaTelegram(
        `💰 <b>Mastro Finanziario Ledger // Ripartizione EAL6+</b>\n` +
        `<b>Causale:</b> ${payload.note || 'Incasso'}\n` +
        `<b>Totale:</b> € ${importo.toFixed(2)}\n` +
        `<b>Operatività (54%):</b> € ${ops.toFixed(2)}\n` +
        `<b>Dividendi CEO (30%):</b> € ${div.toFixed(2)}\n` +
        `<b>Fondo F24 (16%):</b> € ${tax.toFixed(2)}\n` +
        `<b>Proof Hash:</b> <code>SHA256-${proofHash}</code>`
      );

      registraLogAudit("MASTRO_TRANSAZIONE", "INFO", `Transazione ${txId} (€ ${importo})`);
      return creaRispostaJSON({ status: "success", transazioneId: txId, proofHash: proofHash });
    }

    // ------------------------------------------------------------------------
    // CASE E: CLONAZIONE WORKSPACE CORSISTA ASSEDIO (AG-11)
    // ------------------------------------------------------------------------
    if (action === "avvallaCorsista") {
      const email = (payload.email || "").trim();
      const nome = payload.nome || "Corsista";
      const percorso = payload.pacchetto || "Double Impact";

      if (!email) {
        return creaRispostaJSON({ status: "error", message: "Email allievo obbligatoria per Assedio." });
      }

      const rootAssedio = ottieniOCreaCartellaDrive(CONFIG_SFX.DRIVE_ASSEDIO_ROOT);
      const folderCorsista = rootAssedio.createFolder(`[CORSISTA] ${nome} - ${percorso}`);

      folderCorsista.createFolder("01_SESSIONI_LIVE_1TO1_REGISTRI");
      folderCorsista.createFolder("02_MINI_CRM_PIPELINE_AZIENDALE");
      folderCorsista.createFolder("03_PROMPTS_AGENTI_AI_PERSONALIZZATI");
      folderCorsista.createFolder("04_CONTRATTI_E_ATTI_OPERATIVI");

      folderCorsista.addEditor(email);

      // Aggiornamento automatico stato nel foglio Candidati
      const sheetCandidati = ss.getSheetByName("Candidati");
      if (sheetCandidati) {
        const dataC = sheetCandidati.getDataRange().getValues();
        for (let i = 1; i < dataC.length; i++) {
          if (dataC[i][3] === email || dataC[i][2] === nome) {
            sheetCandidati.getRange(i + 1, 8).setValue("Approvato - Workspace Attivo");
            break;
          }
        }
      }

      inviaEmailTransazionale(
        email,
        "Workspace Esecutivo Attivo // Strumenti di Lavoro Suprema Future X",
        generaTemplateEmailAssedio({ nome: nome, percorso: percorso, linkDrive: folderCorsista.getUrl() }),
        CONFIG_SFX.EMAIL_ACADEMY,
        "Suprema Future X Delivery"
      );

      inviaTelegram(
        `⚡ <b>Workspace Assedio Generato</b>\n` +
        `Corsista: <b>${nome}</b> (${email})\n` +
        `Percorso: <b>${percorso}</b>\n` +
        `Drive: <a href="${folderCorsista.getUrl()}">Apri Cartella</a>`
      );

      registraLogAudit("ASSEDIO_WORKSPACE", "INFO", `Workspace rilasciato a ${email}`);
      return creaRispostaJSON({ status: "success", message: "Workspace creato e condiviso.", url: folderCorsista.getUrl() });
    }

    // ------------------------------------------------------------------------
    // CASE F: WEBHOOK TELEGRAM BIDIREZIONALE
    // ------------------------------------------------------------------------
    if (payload.message && payload.message.text) {
      gestisciComandoTelegram(payload.message);
      return creaRispostaJSON({ status: "ok" });
    }

    return creaRispostaJSON({ status: "ignored", message: "Azione non riconosciuta." });

  } catch (err) {
    registraLogAudit("doPost_CRITICAL_ERROR", "ERROR", err.toString());
    return creaRispostaJSON({ status: "error", message: err.toString() });
  }
}

// ============================================================================
// 4. I 6 TRIGGER AUTOMATIZZATI (EAL6+ SOVRANO)
// ============================================================================

// TRIGGER 1: Orologio Marketing e Appuntamenti (T-24h e T-2h)
function trigger_OrologioAppuntamenti() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Candidati");
  if (!sheet) return;

  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return;

  const adesso = new Date().getTime();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const timestampReg = new Date(row[0]).getTime();
    const idNexus = row[1];
    const nome = row[2];
    const email = row[3];
    const percorso = row[5];
    const r24 = row[8];
    const r2h = row[9];
    const stato = row[7];

    if (stato !== "Screening Pendente") continue;

    const momentoCall = timestampReg + (48 * 60 * 60 * 1000);
    const diffOre = (momentoCall - adesso) / (1000 * 60 * 60);

    if (diffOre <= 25 && diffOre >= 23 && !r24) {
      if (email) {
        const corpo = generaTemplateReminder24h({ nome: nome, percorso: percorso, idNexus: idNexus });
        inviaEmailTransazionale(email, "Promemoria: Call di Screening Direzionale tra 24 Ore // Suprema Future X", corpo, CONFIG_SFX.EMAIL_ACADEMY, "Suprema Future X Screening");
      }
      inviaTelegram(`⏰ <b>Alert Screening T-24H</b>\nCandidato: <b>${nome}</b> (${email})\nPercorso: ${percorso}`);
      sheet.getRange(i + 1, 9).setValue(true);
      registraLogAudit("TRIGGER_REMINDER_24H", "INFO", `Inviato a ${email}`);
    }

    if (diffOre <= 2.5 && diffOre >= 0.5 && !r2h) {
      if (email) {
        const corpo = generaTemplateStanzaMeet2h({ nome: nome, linkMeet: CONFIG_SFX.MEET_STANZA_SCREENING });
        inviaEmailTransazionale(email, "Stanza Live Aperta: Accesso allo Screening tra 2 Ore // Suprema Future X", corpo, CONFIG_SFX.EMAIL_ACADEMY, "Presidenza Suprema Future X");
      }
      inviaTelegram(`🚨 <b>Alert Imminente T-2H // Screening Live</b>\nCandidato: <b>${nome}</b> tra 2 ore in call.`);
      sheet.getRange(i + 1, 10).setValue(true);
      registraLogAudit("TRIGGER_REMINDER_2H", "INFO", `Inviato a ${email} con link Meet.`);
    }
  }
}

// TRIGGER 2: Report Mattutino & Controllo Fiscale (Ore 08:00)
function trigger_ReportMattutino() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheetCandidati = ss.getSheetByName("Candidati");
  let candidatiTotali = 0;
  let candidatiDaScreening = 0;
  if (sheetCandidati) {
    const dataC = sheetCandidati.getDataRange().getValues();
    candidatiTotali = Math.max(0, dataC.length - 1);
    for (let i = 1; i < dataC.length; i++) {
      if (dataC[i][7] && dataC[i][7].toString().includes("Pendente")) {
        candidatiDaScreening++;
      }
    }
  }

  const sheetMastro = ss.getSheetByName("Mastro_Finanziario");
  let incassoLordo = 0;
  if (sheetMastro) {
    const dataM = sheetMastro.getDataRange().getValues();
    for (let j = 1; j < dataM.length; j++) {
      if (dataM[j][2] === "ENTRATA") {
        incassoLordo += parseFloat(dataM[j][3]) || 0;
      }
    }
  }
  const fondoTasse16 = incassoLordo * CONFIG_SFX.PERCENTUALI.TASSE;

  inviaTelegram(
    `🌅 <b>SUPREMA FUTURE X // REPORT MATTUTINO ORE 08:00</b>\n\n` +
    `📊 <b>AG-02 Nicole (Candidature):</b>\n` +
    `• Lead a Registro: <b>${candidatiTotali}</b>\n` +
    `• Screening Pendenti: <b>${candidatiDaScreening}</b>\n\n` +
    `⚖️ <b>AG-03 Ginevra (Presidio Fiscale):</b>\n` +
    `• Fatturato Mastro: <b>€ ${incassoLordo.toFixed(2)}</b>\n` +
    `• Fondo Blindato F24 (16%): <b>€ ${fondoTasse16.toFixed(2)}</b>\n` +
    `• Copertura F24: 100% Nominale\n\n` +
    `<i>Protocollo EAL6+ Sovrano attivo su supremafuturex.com</i>`
  );

  registraLogAudit("REPORT_MATTUTINO", "INFO", `Report 08:00 inviato.`);
}

// TRIGGER 3: Recupero "Ghosting" (AG-15 Joker) - Ore 18:00
function trigger_RecuperoGhosting() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Candidati");
  if (!sheet) return;

  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return;

  const adesso = new Date().getTime();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const timestampReg = new Date(row[0]).getTime();
    const nome = row[2];
    const email = row[3];
    const percorso = row[5];
    const stato = row[7];
    const recuperoInviato = row[10];

    const diffOre = (adesso - timestampReg) / (1000 * 60 * 60);

    if (stato === "Screening Pendente" && diffOre > 72 && diffOre < 96 && !recuperoInviato) {
      if (email) {
        const corpo = `
          Gentile <span class="highlight">${nome}</span>,<br><br>
          Abbiamo provato a contattarti per la tua Call di Screening Direzionale relativa all'accesso a <b>"${percorso}"</b>.<br><br>
          Ti informiamo che i posti per l'incubazione 1-to-1 di questo mese stanno per esaurirsi.<br>
          Se desideri mantenere la tua priorità acquisita, ti invitiamo a rispondere a questa email entro 24 ore.<br><br>
          In caso contrario, saremo costretti a cedere il tuo posto al prossimo candidato in lista d'attesa.<br><br>
          Cordiali saluti,<br>
          Direzione Suprema Future X
        `;
        inviaEmailTransazionale(email, "Azione Richiesta: Mantenimento Priorità Incubazione // Suprema Future X", wrapperEmail("AVVISO SCADENZA PRIORITÀ", corpo), CONFIG_SFX.EMAIL_ACADEMY, "Suprema Future X Direzione");
      }
      inviaTelegram(`👻 <b>AG-15 Joker // Recupero Ghosting</b>\nInviata email di ultimatum a <b>${nome}</b> (${email}). Eravamo in attesa da oltre 3 giorni.`);
      sheet.getRange(i + 1, 11).setValue(true);
    }
  }
}

// TRIGGER 4: Allarme F24 e Scadenze (AG-03 Ginevra) - Giorno 12 del Mese
function trigger_AllarmeF24() {
  const oggi = new Date();
  if (oggi.getDate() !== 12) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetMastro = ss.getSheetByName("Mastro_Finanziario");
  let incassoLordo = 0;
  if (sheetMastro) {
    const dataM = sheetMastro.getDataRange().getValues();
    for (let j = 1; j < dataM.length; j++) {
      if (dataM[j][2] === "ENTRATA") {
        incassoLordo += parseFloat(dataM[j][3]) || 0;
      }
    }
  }
  const fondoTasse16 = incassoLordo * CONFIG_SFX.PERCENTUALI.TASSE;

  inviaTelegram(
    `🏛️ <b>AG-03 Ginevra // ALLARME SCADENZE F24</b>\n\n` +
    `Presidenza, ti informo che tra 4 giorni scade il versamento F24 (il 16 del mese).\n\n` +
    `• Fondo 16% Accumulato e Disponibile: <b>€ ${fondoTasse16.toFixed(2)}</b>\n\n` +
    `Ti prego di autorizzare la transazione al consulente fiscale.`
  );
}

// TRIGGER 5: Chiusura Busta Paga e Dividendi (AG-05 Ledger) - Giorno 27 del Mese
function trigger_ChiusuraDividendi() {
  const oggi = new Date();
  if (oggi.getDate() !== 27) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetMastro = ss.getSheetByName("Mastro_Finanziario");
  let incassoLordo = 0;
  if (sheetMastro) {
    const dataM = sheetMastro.getDataRange().getValues();
    for (let j = 1; j < dataM.length; j++) {
      if (dataM[j][2] === "ENTRATA") {
        incassoLordo += parseFloat(dataM[j][3]) || 0;
      }
    }
  }
  const dividendiCEO = incassoLordo * CONFIG_SFX.PERCENTUALI.DIVIDENDI;
  const operativita = incassoLordo * CONFIG_SFX.PERCENTUALI.OPERATIVITA;

  inviaTelegram(
    `💼 <b>AG-05 Ledger // CHIUSURA MENSILE E DIVIDENDI</b>\n\n` +
    `Presidenza, le quadrature contabili del mese sono state finalizzate.\n\n` +
    `• Fatturato Lordo Totale: <b>€ ${incassoLordo.toFixed(2)}</b>\n` +
    `• Operatività/Reinvestimento (54%): <b>€ ${operativita.toFixed(2)}</b>\n` +
    `• Busta Paga / Dividendi CEO (30%): <b>€ ${dividendiCEO.toFixed(2)}</b>\n\n` +
    `Puoi procedere al bonifico direzionale.`
  );
}

// TRIGGER 6: Controllo Qualità e Testimonianze (AG-09 Exit) - Venerdì Ore 14:00
function trigger_RichiestaFeedback() {
  const oggi = new Date();
  if (oggi.getDay() !== 5) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Candidati");
  if (!sheet) return;

  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return;

  const adesso = new Date().getTime();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const timestampReg = new Date(row[0]).getTime();
    const nome = row[2];
    const email = row[3];
    const stato = row[7];
    const feedbackInviato = row[11];

    const diffGiorni = (adesso - timestampReg) / (1000 * 60 * 60 * 24);

    if (stato.includes("Approvato") && diffGiorni > 14 && !feedbackInviato) {
      if (email) {
        const corpo = `
          Gentile <span class="highlight">${nome}</span>,<br><br>
          Sei a bordo di Suprema Future X da due settimane in sessione 100% Live One-to-One con il CEO Giuliano Caratelli.<br><br>
          Il nostro obiettivo primario è il tuo risultato e la tua totale soddisfazione.<br>
          Come stanno procedendo i lavori?<br><br>
          Ti preghiamo di rispondere a questa email per condividere i tuoi primi risultati, lasciarci un feedback, o segnalare al Desk Operativo eventuali necessità.<br><br>
          Un saluto,<br>
          AG-09 Exit // Reparto Qualità
        `;
        inviaEmailTransazionale(email, "Come procede l'Incubazione One-to-One? // Suprema Future X", wrapperEmail("CONTROLLO QUALITÀ ESECUTIVO", corpo), CONFIG_SFX.EMAIL_SUPPORT, "Suprema Future X Qualità");
      }
      inviaTelegram(`⭐ <b>AG-09 Exit // Richiesta Feedback</b>\nInviata email di check-up al corsista <b>${nome}</b> (${email}) dopo 14 giorni di incubazione.`);
      sheet.getRange(i + 1, 12).setValue(true);
    }
  }
}

// ============================================================================
// 5. ENGINE TEMPLATING EMAIL (HTML Responsive Cyber/Gold/Cyan)
// ============================================================================
function wrapperEmail(titolo, contenutoCorpo) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { margin:0; padding:0; background:#090A0D; font-family:'Montserrat',Helvetica,Arial,sans-serif; color:#E0E0E0; }
      .container { max-width:600px; margin:20px auto; background:#1F2227; border:1px solid #C0C0C033; border-radius:16px; overflow:hidden; }
      .header { background:#12141C; padding:30px; text-align:center; border-bottom:1px solid #C0C0C033; }
      .header h1 { margin:0; font-size:20px; color:#D4AF37; letter-spacing:2px; text-transform:uppercase; font-weight:900; }
      .badge { display:inline-block; margin-top:8px; padding:4px 12px; background:#008B9922; border:1px solid #00F0FF; color:#00F0FF; font-size:10px; font-weight:bold; border-radius:20px; }
      .content { padding:30px; font-size:13px; line-height:1.7; color:#C0C0C0; }
      .highlight { color:#D4AF37; font-weight:bold; }
      .box-alert { background:#090A0D; border-left:3px solid #00F0FF; padding:15px; margin:20px 0; border-radius:0 8px 8px 0; }
      .footer { background:#12141C; padding:20px; text-align:center; font-size:10px; color:#666; border-top:1px solid #222; }
      .btn { display:inline-block; padding:12px 24px; background:#008B99; color:#090A0D !important; font-weight:bold; text-decoration:none; border-radius:8px; margin-top:15px; text-transform:uppercase; letter-spacing:1px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>SUPREMA FUTURE X</h1>
        <div class="badge">${titolo}</div>
      </div>
      <div class="content">
        ${contenutoCorpo}
      </div>
      <div class="footer">
        © 2026 Suprema Future X. Protocollo EAL6+ Sovrano.<br>
        Governance e Sede Operativa: supremafuturex.com
      </div>
    </div>
  </body>
  </html>`;
}

function generaTemplateEmailSupporto(p) {
  const corpo = `
    Gentile <span class="highlight">${p.nome}</span>,<br><br>
    Abbiamo registrato la tua richiesta di assistenza con il codice identificativo <b>${p.idTicket}</b>.<br><br>
    <div class="box-alert">
      <b>Dettagli Pratica:</b><br>
      • Categoria: <b>${p.categoria}</b><br>
      • Messaggio Registrato: "${p.messaggio}"<br>
      • Stato Attuale: <b>In Lavorazione</b>
    </div>
    Un responsabile del nostro desk operativo o la Direzione Generale ti risponderà direttamente entro le prossime ore operative.<br><br>
    Per qualsiasi comunicazione relativa a questa pratica, puoi rispondere direttamente a questa email.
  `;
  return wrapperEmail("DESK DI ASSISTENZA &amp; SUPPORTO", corpo);
}

function generaTemplateEmailCandidatura(p) {
  const corpo = `
    Gentile <span class="highlight">${p.nome}</span>,<br><br>
    La tua candidatura al programma di incubazione esecutiva <b>"${p.percorso}"</b> è stata registrata nel database centrale di Suprema Future X.<br><br>
    <b>Codice Candidatura:</b> <code style="color:#00F0FF;">${p.idNexus}</code><br>
    <b>Codice Presentatore:</b> ${p.goldCard}<br><br>
    <div class="box-alert">
      <b>PROTOCOLLO ZERO VIDEO // 100% LIVE ONE-TO-ONE:</b><br>
      Suprema Future X non commercializza corsi preregistrati. L'erogazione avverrà unicamente tramite sessioni esecutive individuali da 60 minuti con la Presidenza.<br>
      L'ammissione finale è subordinata al superamento della <b>Call di Screening Direzionale da 30 minuti</b>.
    </div>
    Riceverai la convocazione e il link alla stanza protetta Google Meet a ridosso dell'appuntamento.
  `;
  return wrapperEmail("CONFERMA CANDIDATURA DIREZIONALE", corpo);
}

function generaTemplateReminder24h(p) {
  const corpo = `
    Gentile <span class="highlight">${p.nome}</span>,<br><br>
    Ti ricordiamo che tra <b>24 ore</b> è fissata la tua Call di Screening Direzionale da 30 minuti per l'accesso a <b>"${p.percorso}"</b>.<br><br>
    <div class="box-alert">
      <b>Raccomandazioni Tecniche:</b><br>
      • Collegati da computer con cuffie e connessione ad alta velocità.<br>
      • Definisci chiaramente gli obiettivi di fatturato della tua attività.<br>
      • Analizzeremo l'idoneità al deployment dei nostri agenti AI.
    </div>
    Il link della stanza riservata ti sarà inoltrato esattamente 2 ore prima dell'orario convenuto.
  `;
  return wrapperEmail("PROMEMORIA SCREENING // T-24 ORE", corpo);
}

function generaTemplateStanzaMeet2h(p) {
  const corpo = `
    Gentile <span class="highlight">${p.nome}</span>,<br><br>
    La stanza riservata per la tua Call di Screening Direzionale è attiva e sarà aperta tra <b>2 ore</b>.<br><br>
    <center>
      <a href="${p.linkMeet}" class="btn">ACCEDI ALLA STANZA LIVE MEET</a>
    </center>
    <br>
    La sessione sarà condotta direttamente dal CEO Giuliano Caratelli.
  `;
  return wrapperEmail("STANZA LIVE PRONTA // T-2 ORE", corpo);
}

function generaTemplateEmailAssedio(p) {
  const corpo = `
    Gentile <span class="highlight">${p.nome}</span>,<br><br>
    A seguito del superamento dello screening per <b>"${p.percorso}"</b>, è stato generato il tuo Workspace Aziendale dedicato su Google Drive a costo licenza zero.<br><br>
    <center>
      <a href="${p.linkDrive}" class="btn">APRI WORKSPACE ESECUTIVO</a>
    </center>
    <br>
    Nel Drive troverai i registri delle lezioni Live One-to-One, il Mini-CRM, i prompt degli agenti AI e gli accordi contrattuali.
  `;
  return wrapperEmail("RILASCIO WORKSPACE OPERATIVO", corpo);
}

// ============================================================================
// 6. GESTIONE COMANDI TELEGRAM (Webhook)
// ============================================================================
function gestisciComandoTelegram(msg) {
  const chatId = msg.chat.id;
  const testo = (msg.text || "").trim();

  if (testo === "/start") {
    inviaTelegramChat(
      chatId,
      "👑 <b>Suprema Future X // NOC Bot Attivo</b>\n\n" +
      "Comandi disponibili:\n" +
      "/status - Telemetria del nodo\n" +
      "/mastro - Saldo mastro e fondo F24\n" +
      "/leads - Candidature recenti\n" +
      "/ticket - Ultimi ticket supporto aperti"
    );
    return;
  }

  if (testo === "/status") {
    inviaTelegramChat(
      chatId,
      `🟢 <b>NODO EAL6+ SOVRANO ATTIVO</b>\n` +
      `<b>Dominio:</b> ${CONFIG_SFX.DOMINIO}\n` +
      `<b>Versione:</b> ${CONFIG_SFX.VERSIONE}\n` +
      `<b>Alias:</b> ceo@, academy@, desk@, support@\n` +
      `<b>Timestamp:</b> ${new Date().toLocaleString("it-IT")}`
    );
    return;
  }

  if (testo === "/mastro") {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Mastro_Finanziario");
    if (!sheet) {
      inviaTelegramChat(chatId, "⚠️ Foglio Mastro non ancora inizializzato.");
      return;
    }
    const data = sheet.getDataRange().getValues();
    let totale = 0;
    for (let i = 1; i < data.length; i++) {
      if (data[i][2] === "ENTRATA") totale += parseFloat(data[i][3]) || 0;
    }
    const ops = totale * CONFIG_SFX.PERCENTUALI.OPERATIVITA;
    const div = totale * CONFIG_SFX.PERCENTUALI.DIVIDENDI;
    const tax = totale * CONFIG_SFX.PERCENTUALI.TASSE;

    inviaTelegramChat(
      chatId,
      `📊 <b>Mastro Finanziario Ledger:</b>\n` +
      `• Totale Incassato: <b>€ ${totale.toFixed(2)}</b>\n` +
      `• Operatività (54%): € ${ops.toFixed(2)}\n` +
      `• Dividendi CEO (30%): € ${div.toFixed(2)}\n` +
      `• Fondo F24 (16%): € ${tax.toFixed(2)}`
    );
    return;
  }

  if (testo === "/leads") {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Candidati");
    if (!sheet) {
      inviaTelegramChat(chatId, "⚠️ Registro Candidati non presente.");
      return;
    }
    const data = sheet.getDataRange().getValues();
    const leads = data.slice(1);
    if (leads.length === 0) {
      inviaTelegramChat(chatId, "Nessun candidato presente.");
      return;
    }
    let msgOut = `🎯 <b>Ultimi Candidati (Totali: ${leads.length}):</b>\n`;
    leads.slice(-5).reverse().forEach(l => {
      msgOut += `• <b>${l[2]}</b> [${l[1]}] - ${l[5]} (${l[7]})\n`;
    });
    inviaTelegramChat(chatId, msgOut);
    return;
  }

  if (testo === "/ticket") {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Ticket_Supporto");
    if (!sheet) {
      inviaTelegramChat(chatId, "Nessun ticket registrato.");
      return;
    }
    const data = sheet.getDataRange().getValues();
    const tickets = data.slice(1);
    if (tickets.length === 0) {
      inviaTelegramChat(chatId, "Nessun ticket registrato.");
      return;
    }
    let msgOut = `🆘 <b>Ultimi Ticket Helpdesk:</b>\n`;
    tickets.slice(-5).reverse().forEach(t => {
      msgOut += `• <b>[${t[1]}]</b> ${t[2]} (${t[5]}): ${t[7]}\n`;
    });
    inviaTelegramChat(chatId, msgOut);
    return;
  }
}

// ============================================================================
// 7. INFRASTRUTTURA UTILITIES, DRIVE, SHEETS & TELEGRAM SENDER
// ============================================================================
function ottieniOFaFoglio(ss, nomeFoglio, colonne) {
  let sheet = ss.getSheetByName(nomeFoglio);
  if (!sheet) {
    sheet = ss.insertSheet(nomeFoglio);
    sheet.appendRow(colonne);
    sheet.getRange(1, 1, 1, colonne.length)
      .setFontWeight("bold")
      .setBackground("#1F2227")
      .setFontColor("#00F0FF");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function ottieniOCreaCartellaDrive(nome) {
  const folders = DriveApp.getFoldersByName(nome);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(nome);
}

function inviaEmailTransazionale(destinatario, oggetto, corpoHTML, aliasMittente, nomeMittente) {
  try {
    GmailApp.sendEmail(destinatario, oggetto, "", {
      htmlBody: corpoHTML,
      from: aliasMittente,
      name: nomeMittente
    });
  } catch (e) {
    MailApp.sendEmail(destinatario, oggetto, "Visualizza questa email in formato HTML.", {
      htmlBody: corpoHTML,
      name: nomeMittente
    });
  }
}

function inviaTelegram(testoHTML) {
  inviaTelegramChat(CONFIG_SFX.TELEGRAM_CHAT_ID, testoHTML);
}

function inviaTelegramChat(chatId, testoHTML) {
  if (!CONFIG_SFX.TELEGRAM_BOT_TOKEN) return;
  if (!chatId) return;

  try {
    const url = `https://api.telegram.org/bot${CONFIG_SFX.TELEGRAM_BOT_TOKEN}/sendMessage`;
    UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        chat_id: chatId,
        text: testoHTML,
        parse_mode: "HTML",
        disable_web_page_preview: true
      }),
      muteHttpExceptions: true
    });
  } catch (e) {}
}

function registraLogAudit(azione, livello, dettagli) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ottieniOFaFoglio(ss, "Log_Audit_EAL6", ["TIMESTAMP", "AZIONE", "LIVELLO", "DETTAGLI"]);
    sheet.appendRow([new Date().toISOString(), azione, livello, dettagli]);
  } catch (e) {}
}

function creaRispostaJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// 8. TEST TELEGRAM & INSTALLATORE 1-CLIC DEI 6 TRIGGER
// ============================================================================
function testNotificaTelegram() {
  inviaTelegram(
    `👑 <b>SUPREMA FUTURE X // TEST NODO NOC</b>\n\n` +
    `Collegamento Bot Telegram verificato con successo.\n` +
    `<b>Token:</b> <code>8881640493...SZdl</code>\n` +
    `<b>Chat ID:</b> <code>${CONFIG_SFX.TELEGRAM_CHAT_ID}</code>\n` +
    `<b>Data:</b> ${new Date().toLocaleString("it-IT")}\n` +
    `<b>Sistema:</b> EAL6+ Sovrano Multi-Trigger`
  );
}

function installaTuttiITriggerAziendali() {
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }

  // 1. Orario per appuntamenti a T-24h e T-2h
  ScriptApp.newTrigger("trigger_OrologioAppuntamenti").timeBased().everyHours(1).create();

  // 2. Report mattutino (ore 08:00)
  ScriptApp.newTrigger("trigger_ReportMattutino").timeBased().atHour(8).everyDays(1).create();

  // 3. Recupero Ghosting (ore 18:00)
  ScriptApp.newTrigger("trigger_RecuperoGhosting").timeBased().atHour(18).everyDays(1).create();

  // 4. Allarme F24 e Scadenze (Ore 10:00 - verifica automatica giorno 12)
  ScriptApp.newTrigger("trigger_AllarmeF24").timeBased().atHour(10).everyDays(1).create();

  // 5. Chiusura Dividendi CEO (Ore 11:00 - verifica automatica giorno 27)
  ScriptApp.newTrigger("trigger_ChiusuraDividendi").timeBased().atHour(11).everyDays(1).create();

  // 6. Controllo Qualità e Feedback (Venerdì alle ore 14:00)
  ScriptApp.newTrigger("trigger_RichiestaFeedback").timeBased().onWeekDay(ScriptApp.WeekDay.FRIDAY).atHour(14).create();

  Logger.log("✓ Tutti e 6 i trigger strategici sono stati installati con successo.");
}
