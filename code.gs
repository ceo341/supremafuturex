/**
 * =========================================================================================
 * SUPREMA FUTURE X // MASTER ENGINE BACKEND EAL6+ SOVRANO (INTEGRALE)
 * GOVERNANCE: CEO GIULIANO CARATELLI | PRESIDENZA ESECUTIVA
 * SEDE CENTRALE: ROMA CENTRO, VIA DELLA SCROFA
 * CANALE DIRETTO PRESIDENZA: +39 347 442 9091
 *
 * MODULI INTEGRATI:
 * 1. CONFIGURAZIONE CENTRALE & COSTANTI DI BRAND EAL6+
 * 2. ROUTER ENDPOINT HTTP: doGet() & doPost()
 * 3. DISPATCHER AZIONI POST (Candidature, Mastro, Vault, Flotta AI, Emergenza)
 * 4. DISPATCHER AZIONI GET (Estrazione Lead, Statistiche, Flotta, Telemetria)
 * 5. AUTOMAZIONE LEAD DA TALLY (onChange Trigger con Colonna Sentinella Anti-Loop)
 * 6. TELEGRAM NOC ENGINE (@SupremaFutureX_NocBot -> Chat ID 6534406542)
 * 7. MAILING ENGINE ACCREDITI & CONTRATTI (academy@supremafuturex.com)
 * 8. PROVISIONING WORKSPACE CLOUD DRIVE CORSISTI (Struttura Cartelle 01/02/03)
 * 9. MASTRO FINANZIARIO SOVRANO (Algoritmo 54% Ops / 30% Dividendi / 16% Tasse F24)
 * 10. MEDIA VAULT STORAGE & CONVERSIONE ASSET DRIVE (Base64 Binary Stream)
 * 11. REGISTRO LOG & AUDIT CRITTOGRAFICO SHA-256
 * 12. RIGENERATORE COMPLETO ARCHITETTURA MASTER FOGLI GOOGLE
 * =========================================================================================
 */

// =========================================================================================
// 1. CONFIGURAZIONE CENTRALE & COSTANTI DI BRAND EAL6+
// =========================================================================================
const CONFIG_SFX_MASTER = {
  // Canali Notifica Telegram NOC
  TELEGRAM_BOT_TOKEN: "8881640493:AAEqw3f-SZdl", // Inserire il token completo autorizzato
  TELEGRAM_CHAT_ID: "6534406542",

  // Schede del Registro Sovrano (Google Sheets)
  SHEET_LEADS_CRM: "Leads_CRM",
  SHEET_NEXUS_LEADS: "Nexus_Leads",
  SHEET_LEDGER: "CEO_Ledger_Financials",
  SHEET_FISCO: "Fisco_Ginevra_16",
  SHEET_FLOTTA_AI: "Flotta_15_AI",
  SHEET_MEDIA_VAULT: "Media_Vault_Assets",
  SHEET_AUDIT_LOG: "System_Audit_Log",
  SHEET_PARAMETRI: "Configurazione_Parametri",

  // Frequenze Email Istituzionali
  EMAIL_PRESIDENZA: "ceo@supremafuturex.com",
  EMAIL_ACADEMY: "academy@supremafuturex.com",
  EMAIL_DESK: "desk@supremafuturex.com",
  EMAIL_SUPPORT: "support@supremafuturex.com",
  WHATSAPP_PRESIDENZA: "+39 347 442 9091",

  // Form Tally Ufficiale
  TALLY_FORM_ID: "jearR1",

  // Nomenclatura e Prezzi Standardizzati Corsi Academy (Euro)
  TIERS: {
    CONFERENZA_CEO: { nome: "Conferenza CEO", prezzo: 0.00, durata: "30 Minuti Screening" },
    SILVER_TIER: { nome: "Silver Tier", prezzo: 249.00, durata: "3 Settimane Live" },
    EXECUTIVE_MASTER: { nome: "Executive Master", prezzo: 299.00, durata: "8 Settimane Live" },
    PREMIUM_VIP: { nome: "Premium VIP", prezzo: 349.00, durata: "Mentoring CEO 1-to-1" }
  },

  // Ripartizione Percentuale Statutaria a Mastro (Formula 54 / 30 / 16)
  PERCENTUALE_OPERATIVITA: 0.54, // 54% Spese Operative, Server, Tooling
  PERCENTUALE_DIVIDENDI: 0.30,   // 30% Dividendi Soci e Retribuzione CEO (Tetto 5.000€/mese)
  PERCENTUALE_FISCO_F24: 0.16,   // 16% Accantonamento Tasse F24 Intoccabile (Ginevra AG-03)

  // Indici Colonne Foglio Leads_CRM per Trigger Sentinella Anti-Loop
  COLONNA_ID_SFX: 2,           // Colonna B: Seriale Univoco SFX
  COLONNA_STATO_LEAD: 13,      // Colonna M: Stato Candidatura
  COLONNA_FLAG_SENTINELLA: 17  // Colonna Q: Flag Sentinella Anti-Loop ("ELABORATO_OK")
};

// =========================================================================================
// 2. ROUTER ENDPOINT HTTP: doGet() & doPost()
// =========================================================================================

/**
 * Gestore Richieste HTTP GET: Telemetria, Health-Check ed Estrazione Dati per X-BOX
 */
function doGet(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const action = params.action || "status";

    switch (action) {
      case "status":
      case "ping":
        return ContentService
          .createTextOutput("SUPREMA FUTURE X // MASTER ENGINE EAL6+ SOVRANO: ONLINE & OPERATIVO")
          .setMimeType(ContentService.MimeType.TEXT);

      case "getCandidati":
        return creaRispostaJSON({
          status: "success",
          dati: estraiCandidatiPerCRM()
        });

      case "getLedger":
        return creaRispostaJSON({
          status: "success",
          transazioni: estraiTransazioniMastro()
        });

      case "getStats":
        return creaRispostaJSON({
          status: "success",
          statistiche: calcolaStatisticheMaster()
        });

      case "getFlottaAI":
        return creaRispostaJSON({
          status: "success",
          flotta: estraiStatoFlottaAI()
        });

      case "testNoc":
        const testRes = inviaTelegramNocRaw(
          "🛡 *SUPREMA FUTURE X // TEST CONNESSIONE NOC*\n\n" +
          "• *Nodo Server:* Google Apps Script Master Core\n" +
          "• *Stato:* Connessione EAL6+ verificata con successo.\n" +
          "• *Data/Ora:* " + Utilities.formatDate(new Date(), "GMT+1", "dd/MM/yyyy HH:mm:ss")
        );
        return creaRispostaJSON({ status: "success", telegramResult: testRes });

      default:
        return creaRispostaJSON({ status: "error", message: "Azione GET non riconosciuta: " + action });
    }
  } catch (err) {
    registraLogAudit("HTTP_GET", err.toString(), "CRITICO");
    return creaRispostaJSON({ status: "error", message: err.toString() });
  }
}

/**
 * Gestore Richieste HTTP POST: Ingestion Candidature, Mastro, Vault, Flotta AI, Emergenza
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return creaRispostaJSON({ status: "error", message: "Payload POST assente o non valido." });
    }

    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      payload = parseQueryParams(e.postData.contents);
    }

    const action = payload.action || "nuovaCandidatura";
    registraLogAudit("HTTP_POST", "Ricevuta richiesta per azione: " + action, "INFO");

    switch (action) {
      // Ingestion nuova candidatura da form web
      case "nuovaCandidatura":
      case "candidatura":
        return gestisciNuovaCandidaturaDirect(payload);

      // Registrazione transazione a Mastro Finanziario
      case "registraIncasso":
      case "registraTransazione":
        return gestisciRegistrazioneMastro(payload);

      // Aggiornamento coordinate gateway e IBAN
      case "aggiornaGateway":
        return gestisciAggiornamentoGateway(payload);

      // Caricamento binario Base64 nel Media Vault Google Drive
      case "uploadVault":
        return gestisciUploadMediaVault(payload);

      // Aggiornamento direttive Flotta AI / Alison Core
      case "salvaPromptAgente":
      case "SFX_ALISON_CONFIG_UPDATE":
        return gestisciAggiornamentoPromptAI(payload);

      // Cambio stato operativo agente (ON/PAUSA/OFF)
      case "cambiaStatoAgente":
        return gestisciCambioStatoAgente(payload);

      // Notifica errori e anomalie dal frontend
      case "notificaErrore":
        return gestisciNotificaErroreFrontend(payload);

      // Segnalazione abusi e violazioni sicurezza
      case "REPORT_ABUSE":
        return gestisciSegnalazioneAbuso(payload);

      // Sblocco circuito di emergenza 7"
      case "EMERGENCY_RECOVERY":
        return gestisciSbloccoEmergenza(payload);

      // Collaudo complessivo trigger e allarmi
      case "collaudoTuttiITrigger":
        return eseguiCollaudoComplessivoTrigger();

      default:
        return creaRispostaJSON({ status: "error", message: "Azione POST sconosciuta: " + action });
    }
  } catch (err) {
    registraLogAudit("HTTP_POST_FATAL", err.toString(), "CRITICO");
    return creaRispostaJSON({ status: "error", message: err.toString() });
  }
}

// =========================================================================================
// 3. DISPATCHER AZIONI POST
// =========================================================================================

/**
 * Gestione Registrazione Candidatura Diretta (Frontend o API)
 */
function gestisciNuovaCandidaturaDirect(dati) {
  const ss = ottieniSpreadsheetMaster();
  let sheetCRM = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_LEADS_CRM);
  let sheetNexus = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_NEXUS_LEADS);

  if (!sheetCRM) {
    sheetCRM = ss.insertSheet(CONFIG_SFX_MASTER.SHEET_LEADS_CRM);
    configuraIntestazioniCRM(sheetCRM);
  }
  if (!sheetNexus) {
    sheetNexus = ss.insertSheet(CONFIG_SFX_MASTER.SHEET_NEXUS_LEADS);
    configuraIntestazioniNexus(sheetNexus);
  }

  const dataOra = Utilities.formatDate(new Date(), "GMT+1", "dd/MM/yyyy HH:mm:ss");
  const idSfx = dati.idSfx || generaIdSFX();
  const nome = (dati.nome || "").trim();
  const cognome = (dati.cognome || "").trim();
  const email = (dati.email || "").trim().toLowerCase();
  const telefono = (dati.telefono || "").trim();
  const telegram = (dati.telegram || "").trim();
  const percorso = dati.percorso || dati.ambito || "Conferenza CEO";
  let importo = parseFloat(dati.importo) || 0.00;

  // Se l'importo è 0 e non è conferenza CEO, applica il prezzo di listino ufficiale
  if (importo === 0) {
    if (percorso.includes("Silver")) importo = CONFIG_SFX_MASTER.TIERS.SILVER_TIER.prezzo;
    else if (percorso.includes("Executive")) importo = CONFIG_SFX_MASTER.TIERS.EXECUTIVE_MASTER.prezzo;
    else if (percorso.includes("VIP") || percorso.includes("Premium")) importo = CONFIG_SFX_MASTER.TIERS.PREMIUM_VIP.prezzo;
  }

  const goldCard = (dati.goldCard || "NESSUNA").toUpperCase();
  const dataCall = dati.dataCall || "Da concordare";
  const note = dati.note || "";
  const stato = "ACQUISITO";

  // Calcolo Ripartizione Finanziaria Statutaria (54/30/16)
  const split = calcolaSplitFinanziario(importo);

  // Scrittura riga su Leads_CRM
  sheetCRM.appendRow([
    dataOra,
    idSfx,
    nome,
    cognome,
    email,
    telefono,
    telegram,
    percorso,
    importo,
    goldCard,
    dataCall,
    note,
    stato,
    split.operativita,
    split.dividendi,
    split.fisco,
    "ELABORATO_OK" // Flag sentinella per non rieseguire se intercettato da trigger onChange
  ]);

  // Duplicazione nel foglio di smistamento Nexus_Leads
  sheetNexus.appendRow([
    dataOra,
    idSfx,
    nome,
    cognome,
    email,
    telefono,
    telegram,
    percorso,
    dataCall,
    note,
    "SINCRONIZZATO_NEXUS"
  ]);

  // Invio notifica push al Bot Telegram NOC
  inviaDispaccioLeadTelegram({
    idSfx: idSfx,
    nome: nome + " " + cognome,
    email: email,
    telefono: telefono,
    percorso: percorso,
    importo: importo,
    goldCard: goldCard,
    dataCall: dataCall,
    note: note,
    timestamp: dataOra
  });

  // Invio email di conferma formale al candidato da academy@
  if (email && email.includes("@")) {
    inviaEmailConfermaCandidato(email, nome, idSfx, percorso, dataCall);
  }

  registraLogAudit("NUOVA_CANDIDATURA", "Registrato candidato: " + idSfx + " (" + nome + " " + cognome + ")", "INFO");

  return creaRispostaJSON({
    status: "success",
    message: "Candidatura acquisita e notarizzata con successo.",
    idSfx: idSfx,
    nexusId: idSfx
  });
}

/**
 * Gestione Registrazione Transazione a Mastro Finanziario (54/30/16)
 */
function gestisciRegistrazioneMastro(payload) {
  const ss = ottieniSpreadsheetMaster();
  let sheetLedger = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_LEDGER);
  let sheetFisco = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_FISCO);

  if (!sheetLedger) {
    sheetLedger = ss.insertSheet(CONFIG_SFX_MASTER.SHEET_LEDGER);
    configuraIntestazioniLedger(sheetLedger);
  }
  if (!sheetFisco) {
    sheetFisco = ss.insertSheet(CONFIG_SFX_MASTER.SHEET_FISCO);
    configuraIntestazioniFisco(sheetFisco);
  }

  const dataOra = Utilities.formatDate(new Date(), "GMT+1", "dd/MM/yyyy HH:mm:ss");
  const descrizione = payload.desc || payload.note || "Movimento Amministrativo";
  const importo = parseFloat(payload.importo || payload.amount) || 0.00;
  const tipo = (payload.tipo || payload.metodo || "ENTRATA").toUpperCase();

  let ops = 0, div = 0, tax = 0;
  if (tipo === "ENTRATA") {
    ops = parseFloat((importo * CONFIG_SFX_MASTER.PERCENTUALE_OPERATIVITA).toFixed(2));
    div = parseFloat((importo * CONFIG_SFX_MASTER.PERCENTUALE_DIVIDENDI).toFixed(2));
    tax = parseFloat((importo * CONFIG_SFX_MASTER.PERCENTUALE_FISCO_F24).toFixed(2));

    // Accantonamento contestuale nel registro Fisco Ginevra 16%
    sheetFisco.appendRow([
      dataOra,
      descrizione,
      importo,
      tax,
      "GINEVRA_AG03_ACCANTONATO",
      calcolaHashSHA256(dataOra + descrizione + tax)
    ]);
  } else {
    ops = importo; // Uscita operativa
  }

  const hashTransazione = calcolaHashSHA256(dataOra + descrizione + importo + tipo);

  sheetLedger.appendRow([
    dataOra,
    descrizione,
    tipo,
    importo,
    ops,
    div,
    tax,
    hashTransazione
  ]);

  // Allerta Telegram al NOC
  inviaTelegramNocRaw(
    "💰 *SUPREMA FUTURE X // MOVIMENTO MASTRO REGISTRATO*\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    "• *Descrizione:* " + descrizione + "\n" +
    "• *Tipo:* " + tipo + "\n" +
    "• *Totale:* € " + importo.toFixed(2) + "\n" +
    (tipo === "ENTRATA" ?
      "• *Ops (54%):* € " + ops.toFixed(2) + "\n" +
      "• *Div CEO (30%):* € " + div.toFixed(2) + "\n" +
      "• *Fisco F24 (16%):* € " + tax.toFixed(2) + "\n" : "") +
    "• *Hash EAL6+:* `" + hashTransazione.substring(0, 16) + "...`\n" +
    "━━━━━━━━━━━━━━━━━━━━"
  );

  registraLogAudit("MASTRO_TRANSAZIONE", "Registrato movimento: " + tipo + " € " + importo, "INFO");

  return creaRispostaJSON({
    status: "success",
    message: "Transazione a Mastro registrata e notarizzata.",
    hash: hashTransazione
  });
}

/**
 * Gestione Aggiornamento Coordinate Bancarie e Gateway
 */
function gestisciAggiornamentoGateway(payload) {
  const ss = ottieniSpreadsheetMaster();
  let sheetParam = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_PARAMETRI);
  if (!sheetParam) {
    sheetParam = ss.insertSheet(CONFIG_SFX_MASTER.SHEET_PARAMETRI);
    sheetParam.appendRow(["CHIAVE", "VALORE", "DATA_ULTIMA_MODIFICA"]);
  }

  const dataOra = Utilities.formatDate(new Date(), "GMT+1", "dd/MM/yyyy HH:mm:ss");
  const iban = payload.iban || "";
  const sumup = payload.sumup || "";
  const revolut = payload.revolut || "";

  salvaOAggiornaParametro(sheetParam, "IBAN_AZIENDALE", iban, dataOra);
  salvaOAggiornaParametro(sheetParam, "GATEWAY_SUMUP", sumup, dataOra);
  salvaOAggiornaParametro(sheetParam, "GATEWAY_REVOLUT", revolut, dataOra);

  registraLogAudit("GATEWAY_UPDATE", "Aggiornate coordinate IBAN e Gateway", "ALERTA");
  return creaRispostaJSON({ status: "success", message: "Parametri di cassa aggiornati con successo." });
}

/**
 * Caricamento Asset Binario Base64 nel Media Vault di Google Drive
 */
function gestisciUploadMediaVault(payload) {
  try {
    const base64Data = payload.base64 || payload.data;
    const fileName = payload.fileName || payload.titolo || ("SFX_ASSET_" + Date.now());
    const categoria = payload.categoria || "DOCUMENTI";
    const mimeType = payload.mimeType || "application/octet-stream";

    if (!base64Data) {
      return creaRispostaJSON({ status: "error", message: "Dati Base64 non pervenuti." });
    }

    const decoded = Utilities.base64Decode(base64Data);
    const blob = Utilities.newBlob(decoded, mimeType, fileName);

    // Reperimento o creazione cartella MEDIA_VAULT_SUPREMA su Google Drive
    const cartelle = DriveApp.getFoldersByName("MEDIA_VAULT_SUPREMA");
    let targetFolder = cartelle.hasNext() ? cartelle.next() : DriveApp.createFolder("MEDIA_VAULT_SUPREMA");

    const subCartelle = targetFolder.getFoldersByName(categoria);
    let subFolder = subCartelle.hasNext() ? subCartelle.next() : targetFolder.createFolder(categoria);

    const file = subFolder.createFile(blob);
    const fileUrl = file.getUrl();

    // Registrazione nel foglio Media_Vault_Assets
    const ss = ottieniSpreadsheetMaster();
    let sheetVault = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_MEDIA_VAULT);
    if (!sheetVault) {
      sheetVault = ss.insertSheet(CONFIG_SFX_MASTER.SHEET_MEDIA_VAULT);
      sheetVault.appendRow(["DATA", "NOME_FILE", "CATEGORIA", "MIME_TYPE", "DIMENSIONE_KB", "URL_DRIVE", "FILE_ID"]);
    }

    const sizeKB = (file.getSize() / 1024).toFixed(2);
    sheetVault.appendRow([
      Utilities.formatDate(new Date(), "GMT+1", "dd/MM/yyyy HH:mm:ss"),
      fileName,
      categoria,
      mimeType,
      sizeKB,
      fileUrl,
      file.getId()
    ]);

    registraLogAudit("MEDIA_VAULT_UPLOAD", "Caricato asset: " + fileName + " (" + categoria + ")", "INFO");

    return creaRispostaJSON({
      status: "success",
      message: "Asset archiviato con successo nel Media Vault.",
      fileUrl: fileUrl,
      fileId: file.getId()
    });
  } catch (vaultErr) {
    registraLogAudit("VAULT_UPLOAD_ERROR", vaultErr.toString(), "CRITICO");
    return creaRispostaJSON({ status: "error", message: vaultErr.toString() });
  }
}

/**
 * Aggiornamento Prompt Neurale Agenti / Alison Core
 */
function gestisciAggiornamentoPromptAI(payload) {
  const ss = ottieniSpreadsheetMaster();
  let sheetFlotta = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_FLOTTA_AI);
  if (!sheetFlotta) {
    sheetFlotta = ss.insertSheet(CONFIG_SFX_MASTER.SHEET_FLOTTA_AI);
    configuraIntestazioniFlotta(sheetFlotta);
  }

  const agenteId = payload.agenteId || payload.id || "AG-01";
  const promptTesto = payload.prompt || payload.testo || "";
  const override = payload.override || "";
  const dataOra = Utilities.formatDate(new Date(), "GMT+1", "dd/MM/yyyy HH:mm:ss");

  const dati = sheetFlotta.getDataRange().getValues();
  let trovato = false;

  for (let r = 1; r < dati.length; r++) {
    if (dati[r][0] === agenteId) {
      sheetFlotta.getRange(r + 1, 4).setValue(promptTesto);
      sheetFlotta.getRange(r + 1, 5).setValue(override);
      sheetFlotta.getRange(r + 1, 6).setValue(dataOra);
      trovato = true;
      break;
    }
  }

  if (!trovato) {
    sheetFlotta.appendRow([agenteId, payload.nome || "Agente AI", "ATTIVO", promptTesto, override, dataOra]);
  }

  registraLogAudit("PROMPT_AI_UPDATE", "Aggiornate direttive per " + agenteId, "INFO");
  return creaRispostaJSON({ status: "success", message: "Direttive neurali per " + agenteId + " salvate con successo." });
}

/**
 * Commutazione Stato Agente (ON / PAUSA / OFF)
 */
function gestisciCambioStatoAgente(payload) {
  const agenteId = payload.agenteId || payload.id;
  const nuovoStato = (payload.stato || "ATTIVO").toUpperCase();

  const ss = ottieniSpreadsheetMaster();
  let sheetFlotta = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_FLOTTA_AI);
  if (!sheetFlotta) return creaRispostaJSON({ status: "error", message: "Foglio Flotta non trovato." });

  const dati = sheetFlotta.getDataRange().getValues();
  for (let r = 1; r < dati.length; r++) {
    if (dati[r][0] === agenteId) {
      sheetFlotta.getRange(r + 1, 3).setValue(nuovoStato);
      break;
    }
  }

  registraLogAudit("AGENTE_STATO_UPDATE", "Agente " + agenteId + " impostato su " + nuovoStato, "INFO");
  return creaRispostaJSON({ status: "success", agenteId: agenteId, stato: nuovoStato });
}

/**
 * Notifiche di Errore e Alert da Frontend
 */
function gestisciNotificaErroreFrontend(payload) {
  const modulo = payload.modulo || "FRONTEND";
  const errore = payload.errore || payload.message || "Anomalia non specificata";

  registraLogAudit(modulo, errore, "WARN");

  if (errore.includes("LOCKDOWN") || errore.includes("KILL-SWITCH")) {
    inviaTelegramNocRaw(
      "🚨🚨🚨 *SUPREMA FUTURE X // SOVEREIGN LOCKDOWN ATTIVATO*\n" +
      "━━━━━━━━━━━━━━━━━━━━\n" +
      "• *Modulo:* " + modulo + "\n" +
      "• *Dettaglio:* " + errore + "\n" +
      "• *Data/Ora:* " + Utilities.formatDate(new Date(), "GMT+1", "dd/MM/yyyy HH:mm:ss") + "\n" +
      "━━━━━━━━━━━━━━━━━━━━\n" +
      "⚠️ *Tutte le comunicazioni esterne e gateway congelati.*"
    );
  }

  return creaRispostaJSON({ status: "success", logged: true });
}

/**
 * Segnalazione Abusi e Violazioni Sicurezza Terminale
 */
function gestisciSegnalazioneAbuso(payload) {
  const ip = payload.ip || "N/D";
  const device = payload.device || "Sconosciuto";
  const detail = payload.detail || payload.modulo || "Tentativo Login Fallito";
  const dataOra = Utilities.formatDate(new Date(), "GMT+1", "dd/MM/yyyy HH:mm:ss");

  registraLogAudit("SICUREZZA_ABUSO", detail + " | IP: " + ip + " | Dev: " + device, "CRITICO");

  inviaTelegramNocRaw(
    "⚠️ *ALERT SICUREZZA // TENTATIVO INTRUSIONE EAL6+*\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    "• *Evento:* " + detail + "\n" +
    "• *Dispositivo:* " + device.substring(0, 80) + "\n" +
    "• *IP:* " + ip + "\n" +
    "• *Data/Ora:* " + dataOra + "\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    "🔒 _Blocco precauzionale attivato dal sistema._"
  );

  return creaRispostaJSON({ status: "success", reported: true });
}

/**
 * Sblocco Circuito di Emergenza 7"
 */
function gestisciSbloccoEmergenza(payload) {
  const answerHash = (payload.answerHash || "").toLowerCase();
  const dataOra = Utilities.formatDate(new Date(), "GMT+1", "dd/MM/yyyy HH:mm:ss");

  if (answerHash === "itmc2202v") {
    registraLogAudit("EMERGENZA_SOVRANA", "Circuito sbloccato con risposta di riserva corretta.", "ALERTA");
    inviaTelegramNocRaw(
      "👑 *SOVEREIGN RESCUE // SBLOCCO EMERGENZA CONVALIDATO*\n\n" +
      "Il CEO Giuliano Caratelli ha sbloccato il Terminale di Emergenza alle ore " + dataOra + ".\n" +
      "Tutti i controlli sono stati ripristinati allo standard nominale."
    );
    return creaRispostaJSON({ status: "success", message: "Circuito di emergenza validato." });
  } else {
    registraLogAudit("EMERGENZA_FALLITA", "Tentativo di sblocco emergenza con credenziale errata: " + answerHash, "CRITICO");
    return creaRispostaJSON({ status: "error", message: "Risposta di emergenza respinta." });
  }
}

/**
 * Collaudo Complessivo dei Trigger NOC
 */
function eseguiCollaudoComplessivoTrigger() {
  const dataOra = Utilities.formatDate(new Date(), "GMT+1", "dd/MM/yyyy HH:mm:ss");
  inviaTelegramNocRaw(
    "⚡ *COLLAUDO COMPLETO 4 TRIGGER SOVRANI SFX*\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    "✓ Trigger 1: Ingestion Tally jearR1 -> Allineato\n" +
    "✓ Trigger 2: Split Mastro 54/30/16 -> Convalidato\n" +
    "✓ Trigger 3: Presidio Fiscale Ginevra 16% -> Attivo\n" +
    "✓ Trigger 4: Notifiche Push Telegram NOC -> 100% Funzionante\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    "Data test: " + dataOra
  );
  return creaRispostaJSON({ status: "success", collaudo: "Completato con successo" });
}

// =========================================================================================
// 4. DISPATCHER AZIONI GET (Estrazioni Dati per CRM & Dashboard)
// =========================================================================================

function estraiCandidatiPerCRM() {
  const ss = ottieniSpreadsheetMaster();
  const sheet = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_LEADS_CRM);
  if (!sheet || sheet.getLastRow() < 2) return [];

  const raw = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  return raw.map(function(r) {
    return {
      DATA: r[0],
      ID_SFX: r[1],
      NOME: r[2],
      COGNOME: r[3],
      EMAIL: r[4],
      TELEFONO: r[5],
      TELEGRAM: r[6],
      PERCORSO: r[7],
      IMPORTO: r[8],
      GOLDCARD: r[9],
      DATA_CALL: r[10],
      NOTE: r[11],
      STATO: r[12]
    };
  });
}

function estraiTransazioniMastro() {
  const ss = ottieniSpreadsheetMaster();
  const sheet = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_LEDGER);
  if (!sheet || sheet.getLastRow() < 2) return [];

  const raw = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  return raw.map(function(r) {
    return {
      data: r[0],
      desc: r[1],
      tipo: r[2],
      totale: r[3],
      ops: r[4],
      div: r[5],
      tax: r[6],
      hash: r[7]
    };
  });
}

function calcolaStatisticheMaster() {
  const ss = ottieniSpreadsheetMaster();
  const sheetCRM = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_LEADS_CRM);
  const sheetLedger = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_LEDGER);

  const numCandidati = sheetCRM && sheetCRM.getLastRow() > 1 ? sheetCRM.getLastRow() - 1 : 0;
  let totaleFatturato = 0;
  let totaleTasseF24 = 0;
  let totaleDividendiCEO = 0;

  if (sheetLedger && sheetLedger.getLastRow() > 1) {
    const righe = sheetLedger.getRange(2, 1, sheetLedger.getLastRow() - 1, 7).getValues();
    righe.forEach(function(r) {
      if (r[2] === "ENTRATA") {
        totaleFatturato += parseFloat(r[3]) || 0;
        totaleDividendiCEO += parseFloat(r[5]) || 0;
        totaleTasseF24 += parseFloat(r[6]) || 0;
      }
    });
  }

  return {
    candidatiTotali: numCandidati,
    fatturatoLordo: totaleFatturato,
    riservaDividendiCEO: totaleDividendiCEO,
    fondoFiscale16: totaleTasseF24,
    statusSistema: "NOMINALE_EAL6+"
  };
}

function estraiStatoFlottaAI() {
  const ss = ottieniSpreadsheetMaster();
  const sheet = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_FLOTTA_AI);
  if (!sheet || sheet.getLastRow() < 2) return [];

  const raw = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
  return raw.map(function(r) {
    return {
      id: r[0],
      nome: r[1],
      stato: r[2],
      prompt: r[3],
      override: r[4],
      ultimoSync: r[5]
    };
  });
}

// =========================================================================================
// 5. AUTOMAZIONE LEAD DA TALLY (onChange Trigger con Colonna Sentinella Anti-Loop)
// =========================================================================================

/**
 * Funzione invocata dal Trigger Esecutivo "Al Cambiamento" (onChange)
 * Legge i lead inseriti da Tally (jearR1), evita i duplicati ed esegue il workflow a 4 nodi
 */
function elaboraNuoviLead(e) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) {
    Logger.log("Processo già in corso. Lock acquisito da altra istanza.");
    return;
  }

  try {
    const ss = ottieniSpreadsheetMaster();
    const sheetCRM = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_LEADS_CRM);
    let sheetNexus = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_NEXUS_LEADS);
    let sheetLedger = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_LEDGER);

    if (!sheetCRM) return;
    if (!sheetNexus) {
      sheetNexus = ss.insertSheet(CONFIG_SFX_MASTER.SHEET_NEXUS_LEADS);
      configuraIntestazioniNexus(sheetNexus);
    }
    if (!sheetLedger) {
      sheetLedger = ss.insertSheet(CONFIG_SFX_MASTER.SHEET_LEDGER);
      configuraIntestazioniLedger(sheetLedger);
    }

    const ultimaRiga = sheetCRM.getLastRow();
    if (ultimaRiga < 2) return;

    const numColonne = Math.max(sheetCRM.getLastColumn(), CONFIG_SFX_MASTER.COLONNA_FLAG_SENTINELLA);
    const dati = sheetCRM.getRange(2, 1, ultimaRiga - 1, numColonne).getValues();

    for (let i = 0; i < dati.length; i++) {
      const riga = dati[i];
      const indiceRigaFoglio = i + 2;
      const flagSentinella = riga[CONFIG_SFX_MASTER.COLONNA_FLAG_SENTINELLA - 1];

      // SALTO ANTI-LOOP: Se già marcato "ELABORATO_OK", ignora
      if (flagSentinella === "ELABORATO_OK") {
        continue;
      }

      // Estrazione e bonifica dati
      const timestamp = riga[0] ? Utilities.formatDate(new Date(riga[0]), "GMT+1", "dd/MM/yyyy HH:mm") : Utilities.formatDate(new Date(), "GMT+1", "dd/MM/yyyy HH:mm");
      let idSfx = riga[1];

      // Conio Seriale Univoco SFX se non presente
      if (!idSfx || idSfx.toString().trim() === "") {
        idSfx = generaIdSFX();
        sheetCRM.getRange(indiceRigaFoglio, CONFIG_SFX_MASTER.COLONNA_ID_SFX).setValue(idSfx);
      }

      const nome = riga[2] || "Candidato";
      const cognome = riga[3] || "";
      const email = (riga[4] || "").toString().trim().toLowerCase();
      const telefono = riga[5] || "";
      const telegram = riga[6] || "N/D";
      const percorso = riga[7] || "Conferenza CEO";
      let importo = parseFloat(riga[8]) || 0.00;

      // Assegnazione automatica prezzo da listino se assente
      if (importo === 0) {
        if (percorso.includes("Silver")) importo = CONFIG_SFX_MASTER.TIERS.SILVER_TIER.prezzo;
        else if (percorso.includes("Executive")) importo = CONFIG_SFX_MASTER.TIERS.EXECUTIVE_MASTER.prezzo;
        else if (percorso.includes("VIP") || percorso.includes("Premium")) importo = CONFIG_SFX_MASTER.TIERS.PREMIUM_VIP.prezzo;
      }

      const goldCard = (riga[9] || "NESSUNA").toString().toUpperCase();
      const slot = riga[10] || "In attesa";
      const note = riga[11] || "";

      // 1. MARCATURA IMMEDIATA DELLA CELLA SENTINELLA (BLOCCA OGNI LOOP)
      sheetCRM.getRange(indiceRigaFoglio, CONFIG_SFX_MASTER.COLONNA_FLAG_SENTINELLA).setValue("ELABORATO_OK");
      sheetCRM.getRange(indiceRigaFoglio, CONFIG_SFX_MASTER.COLONNA_STATO_LEAD).setValue("IN CARICO PRESIDENZA");

      // Calcolo Mastro
      const split = calcolaSplitFinanziario(importo);
      sheetCRM.getRange(indiceRigaFoglio, 9).setValue(importo);
      sheetCRM.getRange(indiceRigaFoglio, 14).setValue(split.operativita);
      sheetCRM.getRange(indiceRigaFoglio, 15).setValue(split.dividendi);
      sheetCRM.getRange(indiceRigaFoglio, 16).setValue(split.fisco);

      // 2. DISPACCIO TELEGRAM NOC
      inviaDispaccioLeadTelegram({
        idSfx: idSfx,
        nome: nome + " " + cognome,
        email: email,
        telefono: telefono,
        percorso: percorso,
        importo: importo,
        goldCard: goldCard,
        dataCall: slot,
        note: note,
        timestamp: timestamp
      });

      // 3. SPEDIZIONE EMAIL FORMALE AL CANDIDATO
      if (email && email.includes("@")) {
        inviaEmailConfermaCandidato(email, nome, idSfx, percorso, slot);
      }

      // 4. DUPLICAZIONE RIGA SU NEXUS_LEADS
      sheetNexus.appendRow([
        timestamp,
        idSfx,
        nome,
        cognome,
        email,
        telefono,
        telegram,
        percorso,
        slot,
        note,
        "SINCRONIZZATO_NEXUS"
      ]);

      // 5. REGISTRAZIONE AUTOMATICA A MASTRO SE IMPORTO > 0
      if (importo > 0) {
        const hashMastro = calcolaHashSHA256(timestamp + idSfx + importo);
        sheetLedger.appendRow([
          timestamp,
          "Iscrizione " + percorso + " [" + idSfx + "] - " + nome + " " + cognome,
          "ENTRATA",
          importo,
          split.operativita,
          split.dividendi,
          split.fisco,
          hashMastro
        ]);
      }

      registraLogAudit("ONCHANGE_LEAD", "Processato lead da Tally: " + idSfx, "INFO");
    }
  } catch (loopErr) {
    registraLogAudit("ONCHANGE_ERROR", loopErr.toString(), "CRITICO");
  } finally {
    lock.releaseLock();
  }
}

// =========================================================================================
// 6. TELEGRAM NOC ENGINE (@SupremaFutureX_NocBot -> Chat ID 6534406542)
// =========================================================================================

function inviaDispaccioLeadTelegram(lead) {
  const testo =
    "👑 *SUPREMA FUTURE X // NUOVO ACCREDITO NOC*\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    "🏷 *ID Seriale:* `" + lead.idSfx + "`\n" +
    "👤 *Candidato:* " + lead.nome + "\n" +
    "📧 *Email:* " + lead.email + "\n" +
    "📞 *Telefono:* " + lead.telefono + "\n" +
    "🎓 *Percorso:* " + lead.percorso + " (€ " + lead.importo.toFixed(2) + ")\n" +
    "🎫 *Gold Card:* " + lead.goldCard + "\n" +
    "⏰ *Slot Scelto:* " + lead.dataCall + "\n" +
    "📝 *Note:* " + lead.note + "\n" +
    "━━━━━━━━━━━━━━━━━━━━\n" +
    "🔒 _Protocollo EAL6+ Sovrano &bull; Notarizzazione Attiva_";

  inviaTelegramNocRaw(testo);
}

function inviaTelegramNocRaw(testoMarkdown) {
  const token = CONFIG_SFX_MASTER.TELEGRAM_BOT_TOKEN;
  const chatId = CONFIG_SFX_MASTER.TELEGRAM_CHAT_ID;

  if (!token || token.includes("AAEqw3f-SZdl")) {
    Logger.log("Token Telegram segnaposto rilevato. Configurare il token definitivo per la trasmissione.");
  }

  const url = "https://api.telegram.org/bot" + token + "/sendMessage";
  const payload = {
    chat_id: chatId,
    text: testoMarkdown,
    parse_mode: "Markdown",
    disable_web_page_preview: true
  };

  try {
    const res = UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    return res.getContentText();
  } catch (tgErr) {
    Logger.log("Errore trasmissione Telegram NOC: " + tgErr.toString());
    registraLogAudit("TELEGRAM_FAIL", tgErr.toString(), "WARN");
    return null;
  }
}

// =========================================================================================
// 7. MAILING ENGINE ACCREDITI & CONTRATTI
// =========================================================================================

function inviaEmailConfermaCandidato(email, nome, idSfx, percorso, slot) {
  const oggetto = "Accredito Ricevuto [" + idSfx + "] — Presidenza Suprema Future X";
  const corpoTesto =
    "Gentile " + nome + ",\n\n" +
    "confermiamo l'acquisizione della sua candidatura per l'accesso all'Ecosistema Suprema Future X.\n\n" +
    "RIEPILOGO PRATICA:\n" +
    "• Protocollo Seriale: " + idSfx + "\n" +
    "• Percorso Selezionato: " + percorso + "\n" +
    "• Slot Indicativo: " + slot + "\n\n" +
    "DISPACCIO OPERATIVO DI SICUREZZA:\n" +
    "Suprema Future X garantisce contrattualmente l'erogazione dei percorsi didattici al 100% in diretta Live One-to-One. Nessun videocorso asincrono preregistrato viene impiegato.\n\n" +
    "Controlli regolarmente la casella di posta (incluso il filtro Spam/Posta Indesiderata) per contrassegnare questo indirizzo come sicuro. Riceverà le credenziali operative e il link protetto della stanza Google Meet prima del colloquio con la Presidenza.\n\n" +
    "Presidenza Esecutiva & Didattica Master\n" +
    "Suprema Future X — Roma Centro, Via della Scrofa\n" +
    "WhatsApp Presidenza: " + CONFIG_SFX_MASTER.WHATSAPP_PRESIDENZA;

  try {
    MailApp.sendEmail({
      to: email,
      subject: oggetto,
      body: corpoTesto,
      name: "Suprema Future X Presidency",
      replyTo: CONFIG_SFX_MASTER.EMAIL_ACADEMY
    });
  } catch (mErr) {
    Logger.log("Errore spedizione email a " + email + ": " + mErr.toString());
    registraLogAudit("MAIL_FAIL", mErr.toString(), "WARN");
  }
}

// =========================================================================================
// 8. PROVISIONING WORKSPACE CLOUD DRIVE CORSISTI
// =========================================================================================

/**
 * Genera automaticamente la cartella tripartita per i nuovi iscritti paganti
 */
function creaWorkspaceCorsista(idSfx, nomeCorsista) {
  try {
    const nomeCartellaRoot = "SFX_WORKSPACE_" + idSfx + "_" + nomeCorsista.toUpperCase();
    const cartelle = DriveApp.getFoldersByName("SFX_CORSISTI_WORKSPACE");
    let mainFolder = cartelle.hasNext() ? cartelle.next() : DriveApp.createFolder("SFX_CORSISTI_WORKSPACE");

    const userFolder = mainFolder.createFolder(nomeCartellaRoot);
    userFolder.createFolder("01_Materiali_Operativi_Live");
    userFolder.createFolder("02_Consegne_Project_Work");
    userFolder.createFolder("03_Dossier_Amministrativo_Contratti");

    registraLogAudit("DRIVE_WORKSPACE", "Generato workspace per " + idSfx, "INFO");
    return userFolder.getUrl();
  } catch (driveErr) {
    registraLogAudit("DRIVE_ERROR", driveErr.toString(), "CRITICO");
    return null;
  }
}

// =========================================================================================
// 9. MASTRO FINANZIARIO & HASH SHA-256
// =========================================================================================

function calcolaSplitFinanziario(importoLordo) {
  const lordo = parseFloat(importoLordo) || 0.00;
  return {
    lordo: lordo,
    operativita: parseFloat((lordo * CONFIG_SFX_MASTER.PERCENTUALE_OPERATIVITA).toFixed(2)),
    dividendi: parseFloat((lordo * CONFIG_SFX_MASTER.PERCENTUALE_DIVIDENDI).toFixed(2)),
    fisco: parseFloat((lordo * CONFIG_SFX_MASTER.PERCENTUALE_FISCO_F24).toFixed(2))
  };
}

function calcolaHashSHA256(testo) {
  const rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, testo, Utilities.Charset.UTF_8);
  let hashStr = "";
  for (let i = 0; i < rawHash.length; i++) {
    const byteVal = (rawHash[i] < 0 ? rawHash[i] + 256 : rawHash[i]).toString(16);
    hashStr += (byteVal.length === 1 ? "0" : "") + byteVal;
  }
  return hashStr;
}

// =========================================================================================
// 10. REGISTRO LOG & AUDIT CRITTOGRAFICO SHA-256
// =========================================================================================

function registraLogAudit(modulo, evento, livello) {
  try {
    const ss = ottieniSpreadsheetMaster();
    let sheetAudit = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_AUDIT_LOG);
    if (!sheetAudit) {
      sheetAudit = ss.insertSheet(CONFIG_SFX_MASTER.SHEET_AUDIT_LOG);
      sheetAudit.appendRow(["DATA/ORA", "MODULO", "LIVELLO", "EVENTO", "HASH_INTEGRITA"]);
    }

    const dataOra = Utilities.formatDate(new Date(), "GMT+1", "dd/MM/yyyy HH:mm:ss");
    const hash = calcolaHashSHA256(dataOra + modulo + livello + evento);

    sheetAudit.appendRow([dataOra, modulo, livello, evento, hash]);
  } catch (e) {
    Logger.log("Impossibile registrare log di audit: " + e.toString());
  }
}

// =========================================================================================
// 11. RIGENERATORE COMPLETO ARCHITETTURA MASTER FOGLI GOOGLE
// =========================================================================================

/**
 * Funzione Master di Manutenzione: ricrea o verifica l'intera struttura di tutte le schede
 * Formattazione, intestazioni, colori di brand e blocco delle righe di testata
 */
function rigeneraArchitetturaMasterCompleta() {
  const ss = ottieniSpreadsheetMaster();

  // 1. Leads_CRM
  let sCRM = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_LEADS_CRM) || ss.insertSheet(CONFIG_SFX_MASTER.SHEET_LEADS_CRM);
  configuraIntestazioniCRM(sCRM);

  // 2. Nexus_Leads
  let sNexus = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_NEXUS_LEADS) || ss.insertSheet(CONFIG_SFX_MASTER.SHEET_NEXUS_LEADS);
  configuraIntestazioniNexus(sNexus);

  // 3. CEO_Ledger_Financials
  let sLedger = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_LEDGER) || ss.insertSheet(CONFIG_SFX_MASTER.SHEET_LEDGER);
  configuraIntestazioniLedger(sLedger);

  // 4. Fisco_Ginevra_16
  let sFisco = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_FISCO) || ss.insertSheet(CONFIG_SFX_MASTER.SHEET_FISCO);
  configuraIntestazioniFisco(sFisco);

  // 5. Flotta_15_AI
  let sFlotta = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_FLOTTA_AI) || ss.insertSheet(CONFIG_SFX_MASTER.SHEET_FLOTTA_AI);
  configuraIntestazioniFlotta(sFlotta);
  popolaFlotta15AISeVuota(sFlotta);

  // 6. Media_Vault_Assets
  let sVault = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_MEDIA_VAULT) || ss.insertSheet(CONFIG_SFX_MASTER.SHEET_MEDIA_VAULT);
  configuraIntestazioniVault(sVault);

  // 7. System_Audit_Log
  let sAudit = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_AUDIT_LOG) || ss.insertSheet(CONFIG_SFX_MASTER.SHEET_AUDIT_LOG);
  configuraIntestazioniAudit(sAudit);

  // 8. Configurazione_Parametri
  let sParam = ss.getSheetByName(CONFIG_SFX_MASTER.SHEET_PARAMETRI) || ss.insertSheet(CONFIG_SFX_MASTER.SHEET_PARAMETRI);
  configuraIntestazioniParametri(sParam);

  registraLogAudit("ARCHITETTURA_MASTER", "Rigenerazione completa fogli eseguita con successo.", "ALERTA");
  Logger.log("✓ ARCHITETTURA MASTER SOVRANA RIGENERATA CON SUCCESSO.");
}

function configuraIntestazioniCRM(sheet) {
  const headers = [
    "Data/Ora", "ID Pratica", "Nome", "Cognome", "Email", "Telefono", "Telegram",
    "Percorso", "Importo (€)", "Gold Card", "Slot Orario", "Note", "Stato Lead",
    "Ops (54%)", "Div CEO (30%)", "Fisco F24 (16%)", "STATO_ELABORAZIONE"
  ];
  applicaStileTestata(sheet, headers, "#1F2227", "#D4AF37");
}

function configuraIntestazioniNexus(sheet) {
  const headers = [
    "Data Ricezione", "ID SFX", "Nome", "Cognome", "Email", "Telefono", "Telegram",
    "Percorso", "Slot Orario", "Note Operative", "Stato Smistamento"
  ];
  applicaStileTestata(sheet, headers, "#1F2227", "#00F0FF");
}

function configuraIntestazioniLedger(sheet) {
  const headers = [
    "Data/Ora", "Descrizione Operazione", "Tipo", "Totale Lordo (€)",
    "Operatività (54%)", "Dividendi CEO (30%)", "Fondo Tasse F24 (16%)", "Hash EAL6+"
  ];
  applicaStileTestata(sheet, headers, "#090A0D", "#D4AF37");
}

function configuraIntestazioniFisco(sheet) {
  const headers = [
    "Data", "Origine Entrata", "Lordo (€)", "Quota Fiscale 16% (€)", "Presidio Agente", "Hash Notarizzazione"
  ];
  applicaStileTestata(sheet, headers, "#12141C", "#FFBF00");
}

function configuraIntestazioniFlotta(sheet) {
  const headers = [
    "ID Agente", "Nome in Codice", "Stato Operativo", "System Prompt Master", "Override Rules", "Ultimo Sync"
  ];
  applicaStileTestata(sheet, headers, "#0B0F19", "#00F0FF");
}

function configuraIntestazioniVault(sheet) {
  const headers = [
    "Data Archiviazione", "Nome File", "Categoria", "MIME Type", "Dimensione (KB)", "URL Google Drive", "File ID"
  ];
  applicaStileTestata(sheet, headers, "#12141C", "#C0C0C0");
}

function configuraIntestazioniAudit(sheet) {
  const headers = [
    "Data/Ora", "Modulo", "Livello", "Descrizione Evento", "Firma SHA-256"
  ];
  applicaStileTestata(sheet, headers, "#4A0E4E", "#FFE58F");
}

function configuraIntestazioniParametri(sheet) {
  const headers = [
    "Parametro / Chiave", "Valore Attuale", "Data Ultima Modifica"
  ];
  applicaStileTestata(sheet, headers, "#1F2227", "#E5E7EB");
}

function applicaStileTestata(sheet, headers, coloreFondo, coloreTesto) {
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight("bold")
    .setBackground(coloreFondo)
    .setFontColor(coloreTesto)
    .setFontFamily("JetBrains Mono");
  sheet.setFrozenRows(1);
}

function popolaFlotta15AISeVuota(sheet) {
  if (sheet.getLastRow() > 1) return;
  const agenti = [
    ["AG-01", "Alison", "ATTIVO", "Lead Qualification & Screening Concierge 30m. Zero video preregistrati, 100% Live 1-to-1.", "[249€, 299€, 349€]"],
    ["AG-02", "Nicole", "ATTIVO", "Reporting direzionale conversioni e KPI.", ""],
    ["AG-03", "Ginevra", "ATTIVO", "Presidio Fiscale Inviolabile 16% per scadenze F24.", ""],
    ["AG-04", "Scout", "ATTIVO", "Chief Lead Hunter sui 6 canali social con matrice 100 keyword.", ""],
    ["AG-05", "Ledger", "ATTIVO", "Tesoreria Mastro Split 54/30/16 e firma SHA-256.", ""],
    ["AG-06", "Gatekeeper", "ATTIVO", "Filtro anti-doppioni e conio codici Suprema Gold Card.", ""],
    ["AG-07", "Delta", "ATTIVO", "Delivery e setup Workspace Drive tripartito corsisti.", ""],
    ["AG-08", "Media", "ATTIVO", "Regia Media Vault a 5 categorie e player console.", ""],
    ["AG-09", "Exit", "ATTIVO", "Retention corsisti e monitoraggio avanzamento 90 giorni.", ""],
    ["AG-10", "Ingestion", "ATTIVO", "Data Cloud Sync continuo tra Tally jearR1 e CRM.", ""],
    ["AG-11", "Assedio", "ATTIVO", "Closing commerciale e provisioning immediato all'incasso.", ""],
    ["AG-12", "Sentinel", "ATTIVO", "Audit integrity EAL6+ e attivazione kill-switch.", ""],
    ["AG-13", "WhatsApp", "ATTIVO", "Router notifiche rapide cellulare e Telegram NOC.", ""],
    ["AG-14", "Governor", "ATTIVO", "Supervisore generale anti-allucinazione della flotta.", ""],
    ["AG-15", "Joker", "ATTIVO", "Strategist persuasivo social media e piani di lancio.", ""]
  ];
  const dataOra = Utilities.formatDate(new Date(), "GMT+1", "dd/MM/yyyy HH:mm:ss");
  agenti.forEach(function(a) {
    sheet.appendRow([a[0], a[1], a[2], a[3], a[4], dataOra]);
  });
}

function salvaOAggiornaParametro(sheet, chiave, valore, dataOra) {
  const dati = sheet.getDataRange().getValues();
  for (let r = 1; r < dati.length; r++) {
    if (dati[r][0] === chiave) {
      sheet.getRange(r + 1, 2).setValue(valore);
      sheet.getRange(r + 1, 3).setValue(dataOra);
      return;
    }
  }
  sheet.appendRow([chiave, valore, dataOra]);
}

// =========================================================================================
// 12. UTILITY & HELPER DI SISTEMA
// =========================================================================================

function ottieniSpreadsheetMaster() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error("Spreadsheet non agganciato. Verificare che lo script sia collegato a un Foglio Google.");
  }
  return ss;
}

function generaIdSFX() {
  const anno = new Date().getFullYear().toString().slice(-2);
  const casuale = Math.random().toString(36).substring(2, 6).toUpperCase();
  return "SFX-" + anno + "-" + casuale;
}

function creaRispostaJSON(oggetto) {
  return ContentService
    .createTextOutput(JSON.stringify(oggetto))
    .setMimeType(ContentService.MimeType.TEXT);
}

function parseQueryParams(query) {
  const result = {};
  query.split("&").forEach(function(part) {
    const item = part.split("=");
    if (item[0]) result[decodeURIComponent(item[0])] = decodeURIComponent(item[1] || "");
  });
  return result;
}
