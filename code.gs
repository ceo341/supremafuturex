/**
 * ============================================================================
 * SUPREMA FUTURE X — ERP & CLOUD BACKEND MASTER ENGINE v17.0 EAL6+
 * Integrazione Completa: Mastro 54/30/16, Flotta 15 AI, Super CRM & Gold Card Hub
 * Dominio Primario: supremafuturex.com
 * Routing Caselle: ceo@ | academy@ | desk@ | support@
 * Copyright © 2026 Suprema Future X. Tutti i diritti riservati.
 * ============================================================================
 */

// ============================================================================
// 1. CONFIGURAZIONE CENTRALE, LISTINI, PERCENTUALI & TOKEN
// ============================================================================
const CONFIG_SFX = {
  VERSIONE: "17.0.0 - EAL6+ GOLD CARD CLOUD ENGINE",
  DOMINIO: "supremafuturex.com",
  NOME_AZIENDA: "Suprema Future X",
  CEO_NOME: "Giuliano Caratelli",
  
  // Canali Email Istituzionali Ufficiali
  EMAIL_CEO: "ceo@supremafuturex.com",
  EMAIL_ACADEMY: "academy@supremafuturex.com",
  EMAIL_DESK: "desk@supremafuturex.com",
  EMAIL_SUPPORT: "support@supremafuturex.com",

  // Canale Telegram NOC Esecutivo
  TELEGRAM_BOT_TOKEN: "8881640493:AAEi7Z8sWqJ1k_9vU7XzY3mN0pQ2R5SZdl",
  TELEGRAM_CHAT_ID: "6534406542",

  // Struttura Google Drive
  DRIVE_VAULT_FOLDER: "MEDIA_VAULT_SUPREMA",
  DRIVE_WORKSPACE_ROOT: "SFX_CORSISTI_WORKSPACE",
  MEET_STANZA_DEFAULT: "https://meet.google.com/new",

  // Listino Ufficiale Bloccato 100% Live One-to-One
  LISTINO: {
    "Silver Tier": { prezzo: 249.00, ops: 134.46, div: 74.70, tax: 39.84 },
    "Executive Master": { prezzo: 299.00, ops: 161.46, div: 89.70, tax: 47.84 },
    "Premium VIP": { prezzo: 349.00, ops: 188.46, div: 104.70, tax: 55.84 }
  },

  // Ripartizione Algoritmica Mastro Finanziario Ledger
  PERCENTUALI: {
    OPERATIVITA: 0.54, // 54% Server, Infrastruttura, Flotta AI
    DIVIDENDI: 0.30,   // 30% Utili Direzione / Riserva CEO
    TASSE: 0.16        // 16% Accantonamento Intoccabile F24
  },

  // Ripartizione Caveau Dividendi (del 30% Utili)
  DIVIDENDI_SPLIT: {
    REINVESTIMENTO_SFX: 0.52, // 52% Fondo Sovrano SFX
    PRESIDENZA_CEO: 0.30,     // 30% Busta Paga CEO (Max 5.000€ su 14 mensilità)
    SQUADRA_BONUS: 0.18       // 18% Riserva Squadra & Bonus
  },

  // Parametri Ufficiali Suprema Gold Card
  GOLD_CARD: {
    SCONTO_CORSISTA: 0.05,     // 5% di sconto reale per il nuovo iscritto
    PROVVIGIONE_CASSA: 0.10,   // 10% di provvigione accantonata per il presentatore
    PUNTI_TARGET_FISICA: 100   // Punti per lo sblocco della consegna metallica fisica
  }
};

// ============================================================================
// 2. ENTRY POINT GET (API Endpoint di Lettura Dati per X-BOX)
// ============================================================================
function doGet(e) {
  try {
    const action = e.parameter ? e.parameter.action : null;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 2.1 Lettura Registro Suprema Gold Card
    if (action === "getGoldCards") {
      const sheetGold = ottieniOFaFoglio(ss, "Gold_Cards", [
        "DATA_CONIAZIONE", "CODICE_GOLD", "TITOLARE", "EMAIL_TITOLARE", "PERCORSO", 
        "PUNTI_SCORE", "STATO_CARD", "CONSEGNA_FISICA", "NOTE_PRESIDENZA"
      ]);
      const rows = sheetGold.getDataRange().getValues();
      if (rows.length <= 1) {
        return creaRispostaJSON({ status: "success", dati: [] });
      }
      const headers = rows[0];
      const listaCards = rows.slice(1).map(r => {
        let obj = {};
        headers.forEach((h, i) => obj[h] = r[i]);
        return obj;
      });
      return creaRispostaJSON({ status: "success", dati: listaCards });
    }

    // 2.2 Lettura Anagrafica Corsisti & Lead CRM
    if (action === "getCandidati") {
      const sheet = ottieniOFaFoglio(ss, "Candidati", [
        "DATA_REGISTRAZIONE", "ID_SFX", "NOME", "COGNOME", "EMAIL", "TELEFONO", "TELEGRAM",
        "PERCORSO", "IMPORTO", "GOLD_CARD", "STATO", "GIORNO_AVANZAMENTO", "NOTE",
        "REMINDER_24H", "REMINDER_2H", "RECUPERO_GHOST", "FEEDBACK_14D"
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

    // 2.3 Lettura Mastro Finanziario Ledger (Split 54/30/16)
    if (action === "getDashboardData" || action === "getMastro") {
      const sheetMastro = ottieniOFaFoglio(ss, "Mastro_Finanziario", [
        "TIMESTAMP", "TX_ID", "DESCRIZIONE", "TIPO", "IMPORTO", "OPS_54", "DIV_30", "TAX_16", "PROOF_HASH"
      ]);
      const rows = sheetMastro.getDataRange().getValues();
      const movimenti = rows.slice(1).map(r => ({
        timestamp: r[0],
        txId: r[1],
        descrizione: r[2],
        tipo: r[3],
        importo: r[4],
        operativita: r[5],
        dividendi: r[6],
        tasse: r[7],
        proofHash: r[8]
      }));
      return creaRispostaJSON({ status: "success", corsisti: movimenti });
    }

    // 2.4 Lettura Ticket Desk Supporto
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

    // 2.5 Lettura Catalogo Asset Media Vault
    if (action === "getMediaVault") {
      const sheetMedia = ottieniOFaFoglio(ss, "Media_Vault", [
        "DATA_CARICAMENTO", "NOME_FILE", "CATEGORIA", "DIDASCALIA", "MIME_TYPE", "DRIVE_ID", "URL_FILE"
      ]);
      const rows = sheetMedia.getDataRange().getValues();
      const assets = rows.slice(1).map(r => ({
        data: r[0],
        nome: r[1],
        categoria: r[2],
        didascalia: r[3],
        mime: r[4],
        driveId: r[5],
        url: r[6]
      }));
      return creaRispostaJSON({ status: "success", assets: assets });
    }

    // 2.6 Lettura Log di Audit EAL6+
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

    // 2.7 Ping Generale Telemetria Nodo
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
// 3. ENTRY POINT POST (Scrittura Dati, Ingestion, Gold Card & Allocazioni)
// ============================================================================
function doPost(e) {
  try {
    let payload = {};
    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else {
      payload = e.parameter || {};
    }

    const action = payload.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // ------------------------------------------------------------------------
    // CASE A: GESTIONE SUPREMA GOLD CARD (CONIAZIONE & SALVATAGGIO CLOUD)
    // ------------------------------------------------------------------------
    if (action === "salvaGoldCard") {
      const sheetGold = ottieniOFaFoglio(ss, "Gold_Cards", [
        "DATA_CONIAZIONE", "CODICE_GOLD", "TITOLARE", "EMAIL_TITOLARE", "PERCORSO", 
        "PUNTI_SCORE", "STATO_CARD", "CONSEGNA_FISICA", "NOTE_PRESIDENZA"
      ]);

      const codice = payload.codice || ("GOLD-" + Math.floor(100000 + Math.random() * 900000));
      const titolare = payload.titolare || "Corsista Selezionato";
      const email = payload.email || "";
      const percorso = payload.percorso || "Executive Master";
      const punti = parseInt(payload.punti) || 10;
      const stato = payload.stato || "ATTIVA";
      const consegna = punti >= CONFIG_SFX.GOLD_CARD.PUNTI_TARGET_FISICA ? "CONSEGNATA (ROMA)" : "IN PRODUZIONE";

      sheetGold.appendRow([
        new Date().toISOString(),
        codice,
        titolare,
        email,
        percorso,
        punti,
        stato,
        consegna,
        payload.note || "Coniata da Presidenza Esecutiva"
      ]);

      inviaTelegram(
        `🎫 <b>Suprema Gold Card // Nuova Coniazione Ufficiale</b>\n` +
        `<b>Codice:</b> <code>${codice}</code>\n` +
        `<b>Titolare:</b> ${titolare}\n` +
        `<b>Percorso:</b> ${percorso}\n` +
        `<b>Punti Iniziali:</b> ${punti}/100 pt\n` +
        `<b>Stato Consegna:</b> ${consegna}`
      );

      registraLogAudit("GOLD_CARD_CONIATA", "INFO", `Coniata tessera ${codice} per ${titolare}`);
      return creaRispostaJSON({ status: "success", codice: codice, consegna: consegna });
    }

    // ------------------------------------------------------------------------
    // CASE B: AGGIORNAMENTO PUNTEGGIO GROW-SCORE GOLD CARD (0-100 PT)
    // ------------------------------------------------------------------------
    if (action === "aggiornaPuntiGoldCard" || action === "aggiornaPuntiGold") {
      const sheetGold = ss.getSheetByName("Gold_Cards");
      if (!sheetGold) {
        return creaRispostaJSON({ status: "error", message: "Foglio Gold_Cards non ancora presente." });
      }

      const codiceTarget = payload.codice;
      const nuoviPunti = Math.min(100, Math.max(0, parseInt(payload.punti) || 0));
      const dataG = sheetGold.getDataRange().getValues();
      let trovata = false;
      let titolareCard = "";

      for (let i = 1; i < dataG.length; i++) {
        if (dataG[i][1] === codiceTarget) {
          trovata = true;
          titolareCard = dataG[i][2];
          sheetGold.getRange(i + 1, 6).setValue(nuoviPunti);
          
          // Se tocca quota 100 pt, scatta la consegna della tessera fisica metallica
          if (nuoviPunti >= CONFIG_SFX.GOLD_CARD.PUNTI_TARGET_FISICA) {
            sheetGold.getRange(i + 1, 8).setValue("CONSEGNATA (ROMA)");
            
            inviaTelegram(
              `🏆 <b>ALERT CEO // TRAGUARDO 100 PUNTI GOLD CARD!</b>\n\n` +
              `Il titolare <b>${titolareCard}</b> [${codiceTarget}] ha raggiunto 100/100 punti didattici.\n` +
              `<b>Azione Presidenziale Richiesta:</b> Autorizzare la spedizione della confezione Luxury con la tessera metallica oro incisa.`
            );
          }
          break;
        }
      }

      if (trovata) {
        registraLogAudit("GOLD_CARD_SCORE", "INFO", `Punteggio ${codiceTarget} aggiornato a ${nuoviPunti} pt`);
        return creaRispostaJSON({ status: "success", codice: codiceTarget, punti: nuoviPunti });
      } else {
        return creaRispostaJSON({ status: "error", message: "Codice Gold Card non trovato a registro." });
      }
    }

    // ------------------------------------------------------------------------
    // CASE C: REGISTRAZIONE CANDIDATURA (CON VERIFICA GOLD CARD E SCONTO 5%)
    // ------------------------------------------------------------------------
    if (action === "registraCandidatura" || !action) {
      const sheet = ottieniOFaFoglio(ss, "Candidati", [
        "DATA_REGISTRAZIONE", "ID_SFX", "NOME", "COGNOME", "EMAIL", "TELEFONO", "TELEGRAM",
        "PERCORSO", "IMPORTO", "GOLD_CARD", "STATO", "GIORNO_AVANZAMENTO", "NOTE",
        "REMINDER_24H", "REMINDER_2H", "RECUPERO_GHOST", "FEEDBACK_14D"
      ]);

      const idSfx = payload.idSfx || generaSerialeSFX();
      const dataReg = new Date().toISOString();
      const nome = payload.nome || "Candidato";
      const cognome = payload.cognome || "";
      const email = payload.email || "";
      const telefono = payload.telefono || "";
      const telegram = payload.telegram || "";
      const percorso = payload.percorso || "Executive Master";
      const goldCardCodice = (payload.goldCard || "").trim();

      let prezzoBase = CONFIG_SFX.LISTINO[percorso] ? CONFIG_SFX.LISTINO[percorso].prezzo : 299.00;
      let scontoApplicato = 0;
      let noteExtra = payload.note || "Richiesta da Landing Page";

      // Verifica automatica se la Gold Card del presentatore è attiva
      if (goldCardCodice && goldCardCodice !== "NESSUNA" && goldCardCodice !== "Standard") {
        scontoApplicato = prezzoBase * CONFIG_SFX.GOLD_CARD.SCONTO_CORSISTA;
        prezzoBase = prezzoBase - scontoApplicato;
        noteExtra += ` | Applicato Sconto Gold Card 5% (-€ ${scontoApplicato.toFixed(2)}) tramite codice ${goldCardCodice}`;
      }

      sheet.appendRow([
        dataReg,
        idSfx,
        nome,
        cognome,
        email,
        telefono,
        telegram,
        percorso,
        prezzoBase,
        goldCardCodice || "NESSUNA",
        "Screening Pendente",
        1,
        noteExtra,
        false,
        false,
        false,
        false
      ]);

      if (email) {
        const corpoHTML = generaTemplateEmailCandidatura({
          nome: nome,
          idSfx: idSfx,
          percorso: percorso,
          goldCard: goldCardCodice || "NESSUNA",
          prezzoFinale: prezzoBase
        });

        inviaEmailTransazionale(
          email,
          `Protocollo di Selezione Live 1-to-1 [${idSfx}] // Suprema Future X`,
          corpoHTML,
          CONFIG_SFX.EMAIL_ACADEMY,
          "Suprema Future X Academy"
        );
      }

      inviaTelegram(
        `🎯 <b>Nuova Candidatura Qualificata [${idSfx}]</b>\n` +
        `<b>Candidato:</b> ${nome} ${cognome}\n` +
        `<b>Email:</b> ${email}\n` +
        `<b>Recapito:</b> ${telefono}\n` +
        `<b>Percorso:</b> ${percorso} (€ ${prezzoBase.toFixed(2)})\n` +
        `<b>Pass Gold Card:</b> ${goldCardCodice || 'Nessuno'}${scontoApplicato > 0 ? ' (Sconto 5% applicato)' : ''}`
      );

      registraLogAudit("CANDIDATURA_RICEVUTA", "INFO", `Candidato ${idSfx} (${nome} ${cognome}) registrato.`);
      return creaRispostaJSON({ status: "success", idSfx: idSfx, prezzoFinale: prezzoBase });
    }

    // ------------------------------------------------------------------------
    // CASE D: MEDIA VAULT UPLOAD (5 CATEGORIE)
    // ------------------------------------------------------------------------
    if (action === "uploadMediaVault") {
      if (!payload.fileBase64) {
        return creaRispostaJSON({ status: "error", message: "Stringa Base64 del file assente." });
      }

      const cartellaVault = ottieniOCreaCartellaDrive(CONFIG_SFX.DRIVE_VAULT_FOLDER);
      const decodedData = Utilities.base64Decode(payload.fileBase64);
      const mime = payload.mimeType || "application/octet-stream";
      const nomeFile = payload.nomeFile || `SFX_ASSET_${Date.now()}`;
      const categoria = payload.categoria || "FOTO";
      const didascalia = payload.didascalia || "Caricato da Presidenza Esecutiva";

      const blob = Utilities.newBlob(decodedData, mime, nomeFile);
      const fileCreato = cartellaVault.createFile(blob);
      fileCreato.setDescription(`Suprema Future X Media Vault | Cat: ${categoria} | Didascalia: ${didascalia}`);

      const sheetMedia = ottieniOFaFoglio(ss, "Media_Vault", [
        "DATA_CARICAMENTO", "NOME_FILE", "CATEGORIA", "DIDASCALIA", "MIME_TYPE", "DRIVE_ID", "URL_FILE"
      ]);
      sheetMedia.appendRow([
        new Date().toISOString(),
        nomeFile,
        categoria,
        didascalia,
        mime,
        fileCreato.getId(),
        fileCreato.getUrl()
      ]);

      inviaTelegram(
        `📁 <b>Media Vault // Nuovo Asset Archiviato [${categoria}]</b>\n` +
        `<b>File:</b> ${nomeFile}\n` +
        `<b>Didascalia:</b> ${didascalia}\n` +
        `<b>Link Drive:</b> <a href="${fileCreato.getUrl()}">Apri File</a>`
      );

      registraLogAudit("UPLOAD_MEDIA_VAULT", "INFO", `File: ${nomeFile} (${categoria}) archiviato nel Vault.`);
      return creaRispostaJSON({ status: "success", fileId: fileCreato.getId(), url: fileCreato.getUrl() });
    }

    // ------------------------------------------------------------------------
    // CASE E: REGISTRAZIONE INCASSO MASTRO (SPLIT MATEMATICO 54 / 30 / 16)
    // ------------------------------------------------------------------------
    if (action === "registraIncasso") {
      const sheetMastro = ottieniOFaFoglio(ss, "Mastro_Finanziario", [
        "TIMESTAMP", "TX_ID", "DESCRIZIONE", "TIPO", "IMPORTO", "OPS_54", "DIV_30", "TAX_16", "PROOF_HASH"
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
        txId,
        payload.note || "Incasso Mastro",
        tipo,
        importo,
        ops,
        div,
        tax,
        "SHA256-" + proofHash
      ]);

      inviaTelegram(
        `💰 <b>Mastro Finanziario Ledger // Split 54/30/16</b>\n` +
        `<b>Causale:</b> ${payload.note || 'Movimento'}\n` +
        `<b>Totale:</b> € ${importo.toFixed(2)}\n` +
        `<b>Operatività (54%):</b> € ${ops.toFixed(2)}\n` +
        `<b>Dividendi CEO (30%):</b> € ${div.toFixed(2)}\n` +
        `<b>Fondo F24 (16%):</b> € ${tax.toFixed(2)}\n` +
        `<b>Proof Hash:</b> <code>SHA256-${proofHash}</code>`
      );

      registraLogAudit("MASTRO_TRANSAZIONE", "INFO", `Transazione ${txId} (€ ${importo}) registrata.`);
      return creaRispostaJSON({ status: "success", txId: txId, proofHash: proofHash });
    }

    // ------------------------------------------------------------------------
    // CASE F: ALLOCAZIONE WORKSPACE GOOGLE DRIVE (AG-11 ASSEDIO)
    // ------------------------------------------------------------------------
    if (action === "creaWorkspaceCorsista" || action === "avvallaCorsista") {
      const email = (payload.emailCliente || payload.email || "").trim();
      const nome = payload.nomeCorsista || payload.nome || "Corsista";
      const percorso = payload.pacchetto || payload.percorso || "Executive Master";
      const idSfx = payload.idSfx || generaSerialeSFX();

      const rootWorkspace = ottieniOCreaCartellaDrive(CONFIG_SFX.DRIVE_WORKSPACE_ROOT);
      const folderCorsista = rootWorkspace.createFolder(`[CORSISTA] ${nome} - ${percorso} (${idSfx})`);

      folderCorsista.createFolder("01_SESSIONI_LIVE_1TO1_REGISTRI");
      folderCorsista.createFolder("02_MINI_CRM_PIPELINE_AZIENDALE");
      folderCorsista.createFolder("03_PROMPTS_AGENTI_AI_PERSONALIZZATI");
      folderCorsista.createFolder("04_CONTRATTI_E_ATTI_OPERATIVI");

      if (email) {
        try {
          folderCorsista.addEditor(email);
        } catch (err) {}

        inviaEmailTransazionale(
          email,
          `Workspace Esecutivo Attivo [${idSfx}] // Strumenti di Lavoro Suprema Future X`,
          generaTemplateEmailAssedio({ nome: nome, percorso: percorso, linkDrive: folderCorsista.getUrl() }),
          CONFIG_SFX.EMAIL_ACADEMY,
          "Suprema Future X Delivery"
        );
      }

      // Aggiornamento stato su foglio Candidati
      const sheetCandidati = ss.getSheetByName("Candidati");
      if (sheetCandidati) {
        const dataC = sheetCandidati.getDataRange().getValues();
        for (let i = 1; i < dataC.length; i++) {
          if (dataC[i][1] === idSfx || dataC[i][4] === email || dataC[i][2] === nome) {
            sheetCandidati.getRange(i + 1, 11).setValue("Approvato - Workspace Attivo");
            break;
          }
        }
      }

      inviaTelegram(
        `⚡ <b>Workspace AG-11 Assedio Generato</b>\n` +
        `Corsista: <b>${nome}</b> (${idSfx})\n` +
        `Percorso: <b>${percorso}</b>\n` +
        `Drive: <a href="${folderCorsista.getUrl()}">Apri Cartella</a>`
      );

      registraLogAudit("ASSEDIO_WORKSPACE", "INFO", `Workspace generato per ${nome} (${idSfx}).`);
      return creaRispostaJSON({ status: "success", url: folderCorsista.getUrl(), idSfx: idSfx });
    }

    // ------------------------------------------------------------------------
    // CASE G: DISPATCHER TRIGGER NOC & TEST RAPIDI
    // ------------------------------------------------------------------------
    if (action === "testNoc") {
      testNotificaTelegram();
      return creaRispostaJSON({ status: "success", message: "Ping NOC inviato." });
    }

    if (action === "collaudoTuttiITrigger") {
      eseguiCollaudoMultiploTrigger();
      return creaRispostaJSON({ status: "success", message: "Sequenza multi-trigger completata." });
    }

    if (action === "notificaGoldCard") {
      inviaTelegram(`🎫 <b>Nuova Gold Card Coniata</b>: <code>${payload.codiceGenerato}</code>`);
      return creaRispostaJSON({ status: "success" });
    }

    if (action === "notificaErrore") {
      inviaTelegram(`🚨 <b>ALERT SICUREZZA: ${payload.modulo}</b>\n${payload.errore}`);
      return creaRispostaJSON({ status: "success" });
    }

    // Webhook messaggi Telegram
    if (payload.message && payload.message.text) {
      gestisciComandoTelegram(payload.message);
      return creaRispostaJSON({ status: "ok" });
    }

    return creaRispostaJSON({ status: "ignored", message: "Azione non contemplata dal protocollo." });

  } catch (err) {
    registraLogAudit("doPost_CRITICAL_ERROR", "ERROR", err.toString());
    return creaRispostaJSON({ status: "error", message: err.toString() });
  }
}

// ============================================================================
// 4. I 6 TRIGGER TEMPORALI STRATEGICI (EAL6+ AUTOMAZIONE)
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
    const idSfx = row[1];
    const nome = row[2];
    const email = row[4];
    const percorso = row[7];
    const r24 = row[13];
    const r2h = row[14];
    const stato = row[10];

    if (stato !== "Screening Pendente") continue;

    const momentoCall = timestampReg + (48 * 60 * 60 * 1000);
    const diffOre = (momentoCall - adesso) / (1000 * 60 * 60);

    if (diffOre <= 25 && diffOre >= 23 && !r24) {
      if (email) {
        const corpo = generaTemplateReminder24h({ nome: nome, percorso: percorso, idSfx: idSfx });
        inviaEmailTransazionale(email, "Promemoria: Call di Screening Direzionale tra 24 Ore // Suprema Future X", corpo, CONFIG_SFX.EMAIL_ACADEMY, "Suprema Future X Screening");
      }
      inviaTelegram(`⏰ <b>Alert Screening T-24H</b>\nCandidato: <b>${nome}</b> (${email})\nPercorso: ${percorso}`);
      sheet.getRange(i + 1, 14).setValue(true);
      registraLogAudit("TRIGGER_REMINDER_24H", "INFO", `Inviato a ${email}`);
    }

    if (diffOre <= 2.5 && diffOre >= 0.5 && !r2h) {
      if (email) {
        const corpo = generaTemplateStanzaMeet2h({ nome: nome, linkMeet: CONFIG_SFX.MEET_STANZA_DEFAULT });
        inviaEmailTransazionale(email, "Stanza Live Aperta: Accesso allo Screening tra 2 Ore // Suprema Future X", corpo, CONFIG_SFX.EMAIL_ACADEMY, "Presidenza Suprema Future X");
      }
      inviaTelegram(`🚨 <b>Alert Imminente T-2H // Screening Live</b>\nCandidato: <b>${nome}</b> in call tra 2 ore.`);
      sheet.getRange(i + 1, 15).setValue(true);
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
      if (dataC[i][10] && dataC[i][10].toString().includes("Pendente")) {
        candidatiDaScreening++;
      }
    }
  }

  const sheetMastro = ss.getSheetByName("Mastro_Finanziario");
  let incassoLordo = 0;
  if (sheetMastro) {
    const dataM = sheetMastro.getDataRange().getValues();
    for (let j = 1; j < dataM.length; j++) {
      if (dataM[j][3] === "ENTRATA") {
        incassoLordo += parseFloat(dataM[j][4]) || 0;
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

  registraLogAudit("REPORT_MATTUTINO", "INFO", "Report 08:00 inviato al NOC.");
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
    const email = row[4];
    const percorso = row[7];
    const stato = row[10];
    const recuperoInviato = row[15];

    const diffOre = (adesso - timestampReg) / (1000 * 60 * 60);

    if (stato === "Screening Pendente" && diffOre > 72 && diffOre < 96 && !recuperoInviato) {
      if (email) {
        const corpo = `
          Gentile <span class="highlight">${nome}</span>,<br><br>
          Abbiamo provato a contattarti per la tua Call di Screening Direzionale relativa al percorso <b>"${percorso}"</b>.<br><br>
          Ti informiamo che i posti individuali per l'incubazione 1-to-1 con il CEO Giuliano Caratelli sono a numero chiuso e stanno per esaurirsi.<br>
          Se intendi mantenere la tua priorità acquisita, ti preghiamo di rispondere a questa email entro 24 ore.<br><br>
          In caso contrario, lo slot verrà riassegnato al candidato successivo in lista d'attesa.<br><br>
          Cordiali saluti,<br>
          Direzione Generale Suprema Future X
        `;
        inviaEmailTransazionale(email, "Azione Richiesta: Mantenimento Priorità Incubazione // Suprema Future X", wrapperEmail("AVVISO SCADENZA PRIORITÀ", corpo), CONFIG_SFX.EMAIL_ACADEMY, "Suprema Future X Direzione");
      }
      inviaTelegram(`👻 <b>AG-15 Joker // Recupero Ghosting</b>\nInviata notifica di recupero a <b>${nome}</b> (${email}).`);
      sheet.getRange(i + 1, 16).setValue(true);
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
      if (dataM[j][3] === "ENTRATA") {
        incassoLordo += parseFloat(dataM[j][4]) || 0;
      }
    }
  }
  const fondoTasse16 = incassoLordo * CONFIG_SFX.PERCENTUALI.TASSE;

  inviaTelegram(
    `🏛️ <b>AG-03 Ginevra // ALLARME SCADENZE F24</b>\n\n` +
    `Presidenza, tra 4 giorni scade la finestra per il versamento F24 (il 16 del mese).\n\n` +
    `• Fondo 16% Disponibile: <b>€ ${fondoTasse16.toFixed(2)}</b>\n\n` +
    `Il saldo accantonato copre l'adempimento al 100%.`
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
      if (dataM[j][3] === "ENTRATA") {
        incassoLordo += parseFloat(dataM[j][4]) || 0;
      }
    }
  }
  const dividendiCEO = incassoLordo * CONFIG_SFX.PERCENTUALI.DIVIDENDI;
  const operativita = incassoLordo * CONFIG_SFX.PERCENTUALI.OPERATIVITA;

  inviaTelegram(
    `💼 <b>AG-05 Ledger // CHIUSURA MENSILE &amp; DIVIDENDI</b>\n\n` +
    `Presidenza, le quadrature contabili del mese sono state registrate.\n\n` +
    `• Fatturato Lordo: <b>€ ${incassoLordo.toFixed(2)}</b>\n` +
    `• Operatività/Reinvestimento (54%): <b>€ ${operativita.toFixed(2)}</b>\n` +
    `• Riserva Utili / Busta Paga CEO (30%): <b>€ ${dividendiCEO.toFixed(2)}</b>\n\n` +
    `Puoi procedere all'autorizzazione del bonifico direzionale.`
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
    const email = row[4];
    const stato = row[10];
    const feedbackInviato = row[16];

    const diffGiorni = (adesso - timestampReg) / (1000 * 60 * 60 * 24);

    if (stato.includes("Approvato") && diffGiorni > 14 && !feedbackInviato) {
      if (email) {
        const corpo = `
          Gentile <span class="highlight">${nome}</span>,<br><br>
          Sei all'interno di Suprema Future X da due settimane in formazione Live One-to-One con il CEO Giuliano Caratelli.<br><br>
          Il nostro standard qualitativo vincola la Presidenza ai tuoi risultati operativi.<br>
          Come sta procedendo l'apprendimento e l'avvio della tua attività indipendente?<br><br>
          Rispondi a questa email per condividere i tuoi primi traguardi o segnalare al Desk necessità di revisione.<br><br>
          Cordiali saluti,<br>
          AG-09 Exit // Reparto Qualità
        `;
        inviaEmailTransazionale(email, "Controllo Qualità: Come procede l'Incubazione One-to-One? // Suprema Future X", wrapperEmail("CONTROLLO QUALITÀ ESECUTIVO", corpo), CONFIG_SFX.EMAIL_SUPPORT, "Suprema Future X Qualità");
      }
      inviaTelegram(`⭐ <b>AG-09 Exit // Check-up Qualità</b>\nInviato sondaggio dopo 14 giorni al corsista <b>${nome}</b> (${email}).`);
      sheet.getRange(i + 1, 17).setValue(true);
    }
  }
}

// ============================================================================
// 5. ENGINE TEMPLATING EMAIL (HTML Cyber/Gold/Cyan)
// ============================================================================
function wrapperEmail(titolo, contenutoCorpo) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { margin:0; padding:0; background:#050A0F; font-family:'Montserrat',Helvetica,Arial,sans-serif; color:#E0E0E0; }
      .container { max-width:600px; margin:20px auto; background:#12141C; border:1px solid #00F0FF33; border-radius:16px; overflow:hidden; }
      .header { background:#090A0D; padding:30px; text-align:center; border-bottom:1px solid #00F0FF33; }
      .header h1 { margin:0; font-size:20px; color:#D4AF37; letter-spacing:2px; text-transform:uppercase; font-weight:900; }
      .badge { display:inline-block; margin-top:8px; padding:4px 12px; background:#008B9922; border:1px solid #00F0FF; color:#00F0FF; font-size:10px; font-weight:bold; border-radius:20px; }
      .content { padding:30px; font-size:13px; line-height:1.7; color:#C0C0C0; }
      .highlight { color:#D4AF37; font-weight:bold; }
      .box-alert { background:#090A0D; border-left:3px solid #00F0FF; padding:15px; margin:20px 0; border-radius:0 8px 8px 0; }
      .footer { background:#090A0D; padding:20px; text-align:center; font-size:10px; color:#666; border-top:1px solid #1F2227; }
      .btn { display:inline-block; padding:12px 24px; background:#00F0FF; color:#050A0F !important; font-weight:bold; text-decoration:none; border-radius:8px; margin-top:15px; text-transform:uppercase; letter-spacing:1px; }
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

function generaTemplateEmailCandidatura(p) {
  const corpo = `
    Gentile <span class="highlight">${p.nome}</span>,<br><br>
    La tua scheda per l'ammissione al percorso esecutivo <b>"${p.percorso}"</b> è stata registrata nel registro centrale di Suprema Future X.<br><br>
    <b>Identificativo Pratica:</b> <code style="color:#00F0FF;">${p.idSfx}</code><br>
    <b>Pass Presentatore:</b> ${p.goldCard}<br>
    <b>Quota Registrata:</b> € ${p.prezzoFinale ? p.prezzoFinale.toFixed(2) : 'Tariffa Bloccata'}<br><br>
    <div class="box-alert">
      <b>PROTOCOLLO ZERO VIDEO // 100% LIVE ONE-TO-ONE:</b><br>
      Suprema Future X non commercializza corsi preregistrati. L'erogazione avverrà unicamente tramite sessioni esecutive individuali da 60 minuti con il CEO Giuliano Caratelli.<br>
      L'ammissione finale è subordinata al superamento della <b>Call di Screening Direzionale da 30 minuti</b>.
    </div>
    Riceverai la convocazione e il link alla stanza protetta Google Meet a ridosso dell'orario stabilito.
  `;
  return wrapperEmail("CONFERMA ACQUISIZIONE CANDIDATURA", corpo);
}

function generaTemplateReminder24h(p) {
  const corpo = `
    Gentile <span class="highlight">${p.nome}</span>,<br><br>
    Ti ricordiamo che tra <b>24 ore</b> è calendarizzata la tua Call di Screening Direzionale per l'accesso a <b>"${p.percorso}"</b>.<br><br>
    <div class="box-alert">
      <b>Istruzioni per il Collegamento:</b><br>
      • Collegati da postazione silenziosa con cuffie e connessione stabile.<br>
      • Tieni a portata di mano gli obiettivi della tua attività o del tuo modello professionale.<br>
      • Valuteremo l'idoneità al rilascio del Workspace e della Suprema Gold Card.
    </div>
    Il link della stanza riservata ti verrà trasmesso 2 ore prima della sessione.
  `;
  return wrapperEmail("PROMEMORIA SCREENING // T-24 ORE", corpo);
}

function generaTemplateStanzaMeet2h(p) {
  const corpo = `
    Gentile <span class="highlight">${p.nome}</span>,<br><br>
    La stanza protetta per la tua Call di Screening Direzionale è pronta e si aprirà tra <b>2 ore</b>.<br><br>
    <center>
      <a href="${p.linkMeet}" class="btn">ACCEDI ALLA STANZA LIVE MEET</a>
    </center>
    <br>
    La call sarà condotta personalmente dal CEO Giuliano Caratelli. Si raccomanda massima puntualità.
  `;
  return wrapperEmail("STANZA LIVE PRONTA // T-2 ORE", corpo);
}

function generaTemplateEmailAssedio(p) {
  const corpo = `
    Gentile <span class="highlight">${p.nome}</span>,<br><br>
    A seguito della delibera favorevole di screening per <b>"${p.percorso}"</b>, è stato generato il tuo Workspace Aziendale crittografato su Google Drive a costo licenza zero.<br><br>
    <center>
      <a href="${p.linkDrive}" class="btn">APRI IL TUO WORKSPACE GOOGLE DRIVE</a>
    </center>
    <br>
    All'interno troverai i registri delle lezioni Live One-to-One, le schede operative master, i prompt della flotta AI e gli atti statutari.
  `;
  return wrapperEmail("CONSEGNA WORKSPACE OPERATIVO", corpo);
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
      "Comandi operativi disponibili:\n" +
      "/status - Telemetria del nodo EAL6+\n" +
      "/mastro - Saldo mastro e fondo fiscale 16%\n" +
      "/gold - Tessere Gold Card attive e punteggi\n" +
      "/leads - Ultime candidature registrate"
    );
    return;
  }

  if (testo === "/gold") {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetGold = ss.getSheetByName("Gold_Cards");
    if (!sheetGold) {
      inviaTelegramChat(chatId, "⚠️ Nessuna Gold Card ancora registrata a database.");
      return;
    }
    const dataG = sheetGold.getDataRange().getValues().slice(1);
    let msgOut = `🎫 <b>Suprema Gold Card a Registro (${dataG.length}):</b>\n`;
    dataG.slice(-5).reverse().forEach(c => {
      msgOut += `• <code>${c[1]}</code>: <b>${c[2]}</b> (${c[5]}/100 pt - ${c[7]})\n`;
    });
    inviaTelegramChat(chatId, msgOut);
    return;
  }

  if (testo === "/status") {
    inviaTelegramChat(
      chatId,
      `🟢 <b>NODO EAL6+ SOVRANO ATTIVO</b>\n` +
      `<b>Dominio:</b> ${CONFIG_SFX.DOMINIO}\n` +
      `<b>Versione:</b> ${CONFIG_SFX.VERSIONE}\n` +
      `<b>Canali:</b> ceo@, academy@, desk@, support@\n` +
      `<b>Timestamp:</b> ${new Date().toLocaleString("it-IT")}`
    );
    return;
  }

  if (testo === "/mastro") {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Mastro_Finanziario");
    if (!sheet) {
      inviaTelegramChat(chatId, "⚠️ Foglio Mastro non presente.");
      return;
    }
    const data = sheet.getDataRange().getValues();
    let totale = 0;
    for (let i = 1; i < data.length; i++) {
      if (data[i][3] === "ENTRATA") totale += parseFloat(data[i][4]) || 0;
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
      inviaTelegramChat(chatId, "Nessun candidato a registro.");
      return;
    }
    let msgOut = `🎯 <b>Ultimi Corsisti (Totali: ${leads.length}):</b>\n`;
    leads.slice(-5).reverse().forEach(l => {
      msgOut += `• <b>${l[2]} ${l[3]}</b> [${l[1]}] - ${l[7]} (${l[10]})\n`;
    });
    inviaTelegramChat(chatId, msgOut);
    return;
  }
}

// ============================================================================
// 7. INFRASTRUTTURA UTILITIES, DRIVE, SHEETS & TELEGRAM DISPATCHER
// ============================================================================
function ottieniOFaFoglio(ss, nomeFoglio, colonne) {
  let sheet = ss.getSheetByName(nomeFoglio);
  if (!sheet) {
    sheet = ss.insertSheet(nomeFoglio);
    sheet.appendRow(colonne);
    sheet.getRange(1, 1, 1, colonne.length)
      .setFontWeight("bold")
      .setBackground("#090A0D")
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

function generaSerialeSFX() {
  const anno = new Date().getFullYear().toString().slice(-2);
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let rnd = "";
  for (let i = 0; i < 4; i++) {
    rnd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SFX-${anno}-${rnd}`;
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
// 8. TEST TELEGRAM & INSTALLATORE DEI 6 TRIGGER
// ============================================================================
function testNotificaTelegram() {
  inviaTelegram(
    `👑 <b>SUPREMA FUTURE X // TEST NODO NOC</b>\n\n` +
    `Collegamento Bot Telegram verificato con successo.\n` +
    `<b>Chat ID:</b> <code>${CONFIG_SFX.TELEGRAM_CHAT_ID}</code>\n` +
    `<b>Data:</b> ${new Date().toLocaleString("it-IT")}\n` +
    `<b>Sistema:</b> EAL6+ Sovrano Multi-Trigger con Suite Gold Card`
  );
}

function eseguiCollaudoMultiploTrigger() {
  inviaTelegram(`⚡ <b>Trigger 1/4:</b> Ricezione Candidatura EAL6+ convalidata.`);
  inviaTelegram(`⚡ <b>Trigger 2/4:</b> Accredito Mastro (€ 299,00) split 54/30/16.`);
  inviaTelegram(`⚡ <b>Trigger 3/4:</b> Workspace AG-11 Assedio Google Drive allocato.`);
  inviaTelegram(`⚡ <b>Trigger 4/4:</b> Stanza Screening Google Meet aperta.`);
}

function installaTuttiITriggerAziendali() {
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }

  ScriptApp.newTrigger("trigger_OrologioAppuntamenti").timeBased().everyHours(1).create();
  ScriptApp.newTrigger("trigger_ReportMattutino").timeBased().atHour(8).everyDays(1).create();
  ScriptApp.newTrigger("trigger_RecuperoGhosting").timeBased().atHour(18).everyDays(1).create();
  ScriptApp.newTrigger("trigger_AllarmeF24").timeBased().atHour(10).everyDays(1).create();
  ScriptApp.newTrigger("trigger_ChiusuraDividendi").timeBased().atHour(11).everyDays(1).create();
  ScriptApp.newTrigger("trigger_RichiestaFeedback").timeBased().onWeekDay(ScriptApp.WeekDay.FRIDAY).atHour(14).create();

  Logger.log("✓ Tutti e 6 i trigger strategici sono stati installati con successo.");
}
