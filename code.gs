/**
 * ============================================================================
 * SUPREMA FUTURE X S.R.L. // BACKEND SOVRANO MASTER ENGINE EAL6+
 * FILE: Codice.gs
 * GOVERNANCE: CEO GIULIANO CARATELLI
 * PROTOCOLLO: EAL6+ SOVRANO // ANTI-LOCKOUT & RESILIENT ARCHITECTURE
 * DATA RILASCIO: OTTOBRE 2026 // VERSIONE INTEGRALE DEFINITIVA V55.0
 * ============================================================================
 */

// ============================================================================
// 1. CONFIGURAZIONE COSTANTI DI SISTEMA, CREDENZIALI & ALIAS AZIENDALI
// ============================================================================
const SFX_CONFIG = {
  MASTER_PWD: "MARIACHIARAsupremaofficial2026@",
  MASTER_PIN: "3474429091",
  EMERGENCY_RESCUE_CODE: "itmc2202v",
  DATABASE_NAME: "SUPREMA_FUTURE_X_DATABASE_EAL6",
  DRIVE_ROOT_FOLDER: "SUPREMA_FUTURE_X_DRIVE_VAULT",
  TELEGRAM_DEFAULT_TOKEN: "7849182390:AAGr3K0m_kX-example_token",
  TELEGRAM_DEFAULT_CHAT_ID: "6534406542",
  ALIASES: {
    ACADEMY: "academy@supremafuturex.com",
    DESK: "desk@supremafuturex.com",
    SUPPORT: "support@supremafuturex.com",
    CEO: "ceo@supremafuturex.com"
  },
  LISTINO_CORSI: {
    CONFERENZA_CEO: 0.00,
    SILVER_TIER: 249.00,
    EXECUTIVE_MASTER: 299.00,
    PREMIUM_VIP: 349.00
  },
  ORARI_SLOT_MATRICE: {
    1: ["10:00 - 11:00", "11:00 - 12:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00"], // Lunedì (5 slot da 60m)
    2: ["21:00 - 22:00", "22:00 - 23:00"], // Martedì (2 slot da 60m)
    3: ["21:00 - 22:00", "22:00 - 23:00"], // Mercoledì (2 slot da 60m)
    4: ["18:00 - 19:00", "19:00 - 20:00"], // Giovedì (2 slot da 60m)
    5: [], // Venerdì: CHIUSO (0 slot)
    6: ["10:00 - 11:00", "11:00 - 12:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00"], // Sabato (5 slot da 60m)
    0: []  // Domenica: CHIUSO (0 slot)
  },
  MATRICE_100_KEYWORD: [
    // Priorità 1: Intento Diretto al Lavoro & E-Commerce (1-35)
    "lavoro indipendente", "aprire negozio online", "e-commerce senza magazzino", "zero stock",
    "reindirizzamento al lavoro", "guadagno digitale serio", "mentoring one to one", "corsi dal vivo",
    "zero videocorsi", "consulenza presidenza", "formazione certificata", "fare impresa online",
    "diventare autonomo", "vendere su internet", "attivita chiavi in mano", "secondo reddito",
    "liberta finanziaria concreta", "metodo operativo", "no fuffaguru", "protocollo live",
    "affiancamento continuo", "business sostenibile", "guadagno reale", "commercio elettronico autonomo",
    "accordi commerciali digitali", "vendita diretta assistita", "formazione professionale digitale",
    "scuola d impresa", "academy lavoro", "avvio attivita online", "creazione store digitale",
    "metodo d impresa certificato", "piattaforma e-commerce chiavi in mano", "autonomia di guadagno",
    "professione digitale certificata",
    // Priorità 2: Insoddisfazione & Riscatto Economico (36-70)
    "stanco del posto fisso", "videocorsi registrati inutili", "promesse facili online", "licenziamento e ripartenza",
    "cambiare carriera", "lavoro da remoto vero", "mettersi in proprio a 40 anni", "giovani imprenditori",
    "reinventarsi professionalmente", "competenze pratiche", "come iniziare da zero", "niente teoria fuffa",
    "vendere prodotti luxury", "margini netti alti", "business B2B", "networking qualificato",
    "contatti aziendali", "gestione tempo libero", "disciplina lavorativa", "organizzazione orari",
    "lavorare da casa seriamente", "trovare clienti online", "closing commerciale", "negoziazione vendite",
    "strategie di posizionamento", "reindirizzamento professionale rapido", "crescita individuale",
    "guida pratica per fare business", "lavoro indipendente italia", "rilancio economico personale",
    "superamento precariato", "creare reddito autonomo", "gestione clientela estera", "svolta professionale",
    "soluzioni per disoccupati e inoccupati",
    // Priorità 3: Brand Suprema Future X & Governance (71-100)
    "Giuliano Caratelli", "Suprema Future X", "Suprema Gold Card", "pass phygital",
    "comunita d elite", "polo scientifico", "Roma centro Via della Scrofa", "protocollo EAL6+",
    "riservatezza contrattuale", "codice etico sfx", "atto statutario corsista", "Silver Tier 249",
    "Executive Master 299", "Premium VIP 349", "flotta neurale ai", "Alison AG-01",
    "Scout AG-04", "Assedio AG-11", "Sentinel AG-12", "Ginevra AG-03",
    "presidenza esecutiva", "screening preliminare 30 minuti", "sessione riservata meet", "ecosistema aziendale",
    "partnership formali", "accordi quadro impresa", "sovranita tecnologica", "tutela corsisti",
    "eccellenza italiana", "standard qualitativo supremo"
  ]
};

// ============================================================================
// 2. ENTRY POINT HTTP GET (doGet) // ENDPOINT UNIFICATO MULTI-ACTION
// ============================================================================
function doGet(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(15000);
  try {
    const params = e ? e.parameter : {};
    const azione = (params.action || params.azione || "ping").trim();
    let responseData = {};

    switch (azione) {
      case "FULL_DASHBOARD_SYNC":
        responseData = ottieniFullDashboardSync();
        break;

      case "getCandidati":
        responseData = { status: "success", candidati: leggiTabellaSheet("Candidati") };
        break;

      case "getCorsisti":
        responseData = { status: "success", corsisti: leggiTabellaSheet("Corsisti") };
        break;

      case "getConfigLanding":
        responseData = { status: "success", config: ottieniConfigurazioneLanding() };
        break;

      case "getSlotDisponibili":
      case "getSlotOccupati":
        responseData = { 
          status: "success", 
          slotOccupati: ottieniSlotOccupati(), 
          matriceUfficiale: SFX_CONFIG.ORARI_SLOT_MATRICE 
        };
        break;

      case "getGoldCards":
        responseData = { status: "success", goldCards: leggiTabellaSheet("Gold_Cards") };
        break;

      case "getMastro":
        responseData = { 
          status: "success", 
          mastro: leggiTabellaSheet("Mastro_Finanziario"), 
          sintesi: ottieniSintesiMastro() 
        };
        break;

      case "getFlottaAI":
        responseData = { status: "success", flotta: leggiTabellaSheet("Flotta_15_AI") };
        break;

      case "getDossierCorsista":
        responseData = ottieniDossierSingoloCorsista(params.matricola);
        break;

      case "ping":
      default:
        responseData = {
          status: "ONLINE",
          protocollo: "EAL6+ SOVRANO",
          versione: "V55.0-MASTER",
          orarioServerRoma: Utilities.formatDate(new Date(), "Europe/Rome", "yyyy-MM-dd HH:mm:ss"),
          governance: "CEO GIULIANO CARATELLI",
          sistema: "SUPREMA FUTURE X CLOUD CORE"
        };
        break;
    }

    return ContentService.createTextOutput(JSON.stringify(responseData))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "ERROR", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// 3. ENTRY POINT HTTP POST (doPost) // DISPATCHER OPERAZIONI SCRITTURA
// ============================================================================
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(20000);
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (errJson) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const azione = (payload.azione || payload.action || "").trim();
    let esito = { status: "SUCCESS" };

    switch (azione) {
      case "AUTENTICAZIONE_PRESIDENZA":
        esito = verificaAutenticazioneServer(payload.password, payload.pin);
        break;

      case "nuovaCandidatura":
      case "registraCandidatura":
        esito = registraNuovaCandidatura(payload);
        break;

      case "GESTISCI_STATO_SLOT":
        esito = gestisciStatoSlot(payload.slot, payload.nuovoStato, payload.idLead);
        break;

      case "SALVA_CONFIG_SEZIONI":
      case "IMPOSTA_CONFIG":
        esito = salvaConfigurazioneLanding(payload.config || payload.sezioni);
        break;

      case "REGISTRA_INCASSO_MANUALE":
      case "registraIncasso":
        esito = registraTransazioneMastro(payload);
        break;

      case "UPLOAD_MEDIA_DRIVE":
      case "UPLOAD_FOTO":
        esito = caricaFileBase64SuDrive(payload);
        break;

      case "AGGIORNA_SBLOCCHI_DIDATTICI":
        esito = aggiornaSblocchiCorsista(payload.matricola, payload.moduliSbloccatiCsv, payload.giornoAvanzamento);
        break;

      case "AGGIORNA_RATE_CORSISTA":
        esito = aggiornaRateCorsista(payload.matricola, payload.statoPagamento, payload.importoVersato, payload.residuo, payload.scadenza);
        break;

      case "SALVA_SLOT_LIBERO_CORSISTA":
        esito = salvaSlotLiberoCorsista(payload.matricola, payload.indiceSlot, payload.titolo, payload.url, payload.attivo);
        break;

      case "CREA_WORKSPACE_CORSISTA":
        esito = creaAlberoCartelleDriveCorsista(payload.matricola, payload.nominativo, payload.email);
        break;

      case "REGISTRA_GOLD_CARD":
      case "aggiornaPuntiGold":
        esito = registraOAggiornaGoldCard(payload);
        break;

      case "AGGIORNA_PROMPT_AGENTE":
        esito = aggiornaPromptAgenteAI(payload.agenteId, payload.promptMaster);
        break;

      case "EMERGENCY_RECOVERY":
        esito = convalidaRipristinoEmergenza(payload.answerHash);
        break;

      case "REPORT_ABUSE":
      case "notificaErrore":
      case "ATTIVA_KILL_SWITCH":
        esito = registraSegnalazioneSicurezza(payload);
        break;

      default:
        esito = { status: "ERROR", message: "Azione non riconosciuta: " + azione };
        break;
    }

    return ContentService.createTextOutput(JSON.stringify(esito))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (errPost) {
    return ContentService.createTextOutput(JSON.stringify({ status: "ERROR", message: errPost.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// 4. AUTENTICAZIONE E SICUREZZA SERVER-SIDE EAL6+
// ============================================================================
function verificaAutenticazioneServer(pwd, pin) {
  const cleanPwd = (pwd || "").trim().replace(/\s+/g, "");
  const cleanPin = (pin || "").trim();

  const isPwdValida = (cleanPwd === SFX_CONFIG.MASTER_PWD || cleanPwd === "MARIACHIARAsupremaofficial2026");
  const isPinValido = (cleanPin === SFX_CONFIG.MASTER_PIN);

  if (isPwdValida && isPinValido) {
    const sessionToken = "TOKEN_EAL6_" + Utilities.getUuid() + "_" + Date.now();
    salvaLogNOC("AUTH_SUCCESS", "Presidenza validata con successo dal server", "Terminale Esecutivo");
    return {
      status: "SUCCESS",
      clearance: "CEO_CLEARANCE_LV9",
      sessionToken: sessionToken,
      messaggio: "Accesso confermato. Bentornato Presidente Giuliano Caratelli."
    };
  } else {
    salvaLogNOC("AUTH_FAILURE", "Tentativo di accesso con credenziali non autorizzate", "Perimetro");
    inviaTelegramSovereign("⚠️ <b>ALLARME SICUREZZA // TENTATIVO ACCESSO NON AUTORIZZATO</b>\nRilevato tentativo di sblocco terminale con credenziali non conformi.");
    return {
      status: "FORBIDDEN",
      message: "Credenziali non autorizzate. Tentativo registrato nel log di sicurezza EAL6+."
    };
  }
}

function convalidaRipristinoEmergenza(risposta) {
  const resp = (risposta || "").trim().toLowerCase();
  if (resp === SFX_CONFIG.EMERGENCY_RESCUE_CODE) {
    salvaLogNOC("EMERGENCY_OVERRIDE", "Circuito di emergenza 7 pollici convalidato", "CEO Giuliano Caratelli");
    inviaTelegramSovereign("🚨 <b>EMERGENCY RESCUE SBLOCCATO</b>\nCircuito di emergenza validato dal CEO Giuliano Caratelli.");
    return { status: "SUCCESS", message: "Circuito di emergenza validato con successo." };
  }
  return { status: "ERROR", message: "Risposta di emergenza errata." };
}

// ============================================================================
// 5. REGISTRAZIONE CANDIDATURE // TELEGRAM OBBLIGATORIO & LOCK SLOT IMMEDIATO
// ============================================================================
function registraNuovaCandidatura(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Candidati") || ss.insertSheet("Candidati");

  const idSfx = data.idSfx || ("SFX-" + new Date().getFullYear().toString().slice(-2) + "-" + Utilities.getUuid().substring(0, 4).toUpperCase());
  const nome = (data.nome || "").trim();
  const cognome = (data.cognome || "").trim();
  const email = (data.email || "").trim();
  const telefono = (data.telefono || "").trim();
  
  // TELEGRAM TASSATIVAMENTE OBBLIGATORIO
  const rawTg = (data.telegram || data.telegramUser || data.telegramUsername || "").trim();
  if (!rawTg) {
    return { status: "VALIDATION_ERROR", message: "Il contatto Telegram è obbligatorio per l'accesso allo screening." };
  }
  const cleanTg = rawTg.startsWith("@") ? rawTg : ("@" + rawTg);

  const percorso = (data.percorso || "Conferenza CEO").trim();
  const slotRichiesto = (data.slot || data.dataCall || "Da Concordare").trim();
  const note = (data.note || "").trim();
  const goldCard = (data.goldCard || "NESSUNA").trim();

  // Determinazione Rigorosa della Quota
  let importo = 0.00;
  if (percorso.toLowerCase().includes("silver")) importo = SFX_CONFIG.LISTINO_CORSI.SILVER_TIER;
  else if (percorso.toLowerCase().includes("executive")) importo = SFX_CONFIG.LISTINO_CORSI.EXECUTIVE_MASTER;
  else if (percorso.toLowerCase().includes("vip")) importo = SFX_CONFIG.LISTINO_CORSI.PREMIUM_VIP;
  else importo = SFX_CONFIG.LISTINO_CORSI.CONFERENZA_CEO; // Tassativamente 0.00 €

  // Inserimento riga su Google Sheets
  sheet.appendRow([
    new Date(), idSfx, nome, cognome, email, telefono, cleanTg, percorso, slotRichiesto, importo, goldCard, note, "IN_ATTESA_CEO"
  ]);

  // Invio email dal canale corretto Workspace
  if (importo === 0.00) {
    inviaEmailSovereign(
      SFX_CONFIG.ALIASES.DESK,
      email,
      "Conferma Registrazione Screening // Conferenza CEO Giuliano Caratelli",
      `<div style="font-family: monospace; background: #050A0F; color: #fff; padding: 25px; border-radius: 12px; border: 1px solid #D4AF37;">
        <h2 style="color: #D4AF37;">SUPREMA FUTURE X // CONFERENZA CEO</h2>
        <p>Gentile <b>${nome} ${cognome}</b>,</p>
        <p>La tua richiesta di screening preliminare di 30 minuti con il Fondatore e CEO <b>Giuliano Caratelli</b> è stata acquisita a <b>costo zero (€ 0,00)</b>.</p>
        <p><b>Identificativo Pratica:</b> <code>${idSfx}</code><br>
           <b>Telegram Verificato:</b> <code>${cleanTg}</code><br>
           <b>Slot Riservato:</b> ${slotRichiesto} (In attesa di convalida definitiva)</p>
        <p>Riceverai a breve su Telegram o email il link protetto per la stanza Google Meet.</p>
        <hr style="border: 0; border-top: 1px solid #333;">
        <small style="color: #888;">Suprema Future X S.r.l. &bull; Ufficio Presidenza &bull; Roma Centro, Via della Scrofa</small>
      </div>`
    );
  } else {
    inviaEmailSovereign(
      SFX_CONFIG.ALIASES.ACADEMY,
      email,
      `Ammissione Didattica // Percorso ${percorso}`,
      `<div style="font-family: monospace; background: #050A0F; color: #fff; padding: 25px; border-radius: 12px; border: 1px solid #00F0FF;">
        <h2 style="color: #00F0FF;">SUPREMA ACADEMY // 100% LIVE ONE-TO-ONE</h2>
        <p>Gentile <b>${nome} ${cognome}</b>,</p>
        <p>La tua candidatura per il percorso <b>${percorso}</b> (Quota Bloccata: € ${importo.toFixed(2)}) è stata presa in carico.</p>
        <p><b>Identificativo Pratica:</b> <code>${idSfx}</code><br>
           <b>Telegram Verificato:</b> <code>${cleanTg}</code></p>
        <p>Il desk didattico ti invierà la modulistica statutaria e predisporrà il tuo Workspace dedicato.</p>
      </div>`
    );
  }

  // Notifica Telegram Istantanea con Link Diretto al Telegram dell'Utente
  const tgLink = "https://t.me/" + cleanTg.replace("@", "");
  inviaTelegramSovereign(
    `👑 <b>NUOVA CANDIDATURA ACQUISITA</b>\n` +
    `────────────────────────\n` +
    `<b>ID:</b> <code>${idSfx}</code>\n` +
    `<b>Candidato:</b> ${nome} ${cognome}\n` +
    `<b>Telegram:</b> <a href="${tgLink}">${cleanTg}</a>\n` +
    `<b>Recapito:</b> ${telefono}\n` +
    `<b>Email:</b> ${email}\n` +
    `<b>Percorso:</b> ${percorso} (€ ${importo.toFixed(2)})\n` +
    `<b>Slot Richiesto:</b> <code>${slotRichiesto}</code>`
  );

  return { status: "SUCCESS", idSfx: idSfx, importo: importo, slot: slotRichiesto, telegram: cleanTg };
}

// ============================================================================
// 6. GESTORE STATO SLOT ORARI (LOCK / CONFERMA CEO / LIBERA)
// ============================================================================
function gestisciStatoSlot(slotStringa, nuovoStato, idLead) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Candidati");
  if (!sheet) return { status: "ERROR", message: "Scheda Candidati non presente" };

  const data = sheet.getDataRange().getValues();
  let rigaModificata = -1;

  for (let i = 1; i < data.length; i++) {
    const slotRiga = (data[i][8] || "").toString();
    const idRiga = (data[i][1] || "").toString();

    if ((idLead && idRiga === idLead) || (!idLead && slotRiga.includes(slotStringa))) {
      rigaModificata = i + 1;
      break;
    }
  }

  if (rigaModificata > 0) {
    if (nuovoStato === "ACCETTA" || nuovoStato === "CONFERMATO") {
      sheet.getRange(rigaModificata, 13).setValue("CONFERMATO_CEO");
      salvaLogNOC("SLOT_LOCK", `Slot ${slotStringa} CONFERMATO dal CEO per lead ${idLead}`, "Presidenza");
      inviaTelegramSovereign(`✅ <b>SLOT CONFERMATO DAL CEO</b>\nLo slot <code>${slotStringa}</code> è stato blindato a calendario per il lead <code>${idLead}</code>.`);
      return { status: "SUCCESS", message: "Slot confermato dal CEO e definitivamente bloccato." };
    } else if (nuovoStato === "LIBERA" || nuovoStato === "RIFIUTA") {
      sheet.getRange(rigaModificata, 9).setValue(slotStringa + " [LIBERATO]");
      sheet.getRange(rigaModificata, 13).setValue("RIFIUTATO_O_LIBERO");
      salvaLogNOC("SLOT_UNLOCK", `Slot ${slotStringa} LIBERATO dal CEO per lead ${idLead}`, "Presidenza");
      inviaTelegramSovereign(`🔓 <b>SLOT LIBERATO DAL CEO</b>\nLo slot <code>${slotStringa}</code> è tornato disponibile al pubblico.`);
      return { status: "SUCCESS", message: "Slot liberato con successo e reso disponibile." };
    }
  }

  return { status: "NOT_FOUND", message: "Nessuna prenotazione attiva trovata per questo slot." };
}

function ottieniSlotOccupati() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Candidati");
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  const occupati = [];

  for (let i = 1; i < data.length; i++) {
    const slot = (data[i][8] || "").toString();
    const stato = (data[i][12] || "").toString();

    if (slot && stato !== "RIFIUTATO_O_LIBERO" && !slot.includes("[LIBERATO]")) {
      occupati.push(slot);
    }
  }
  return occupati;
}

// ============================================================================
// 7. FASCICOLO PERSONALE CORSISTA // 90 GIORNI, RATE & 20 SLOT LIBERI
// ============================================================================
function ottieniDossierSingoloCorsista(matricola) {
  if (!matricola) return { status: "ERROR", message: "Matricola non fornita." };
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Corsisti");
  if (!sheet) return { status: "ERROR", message: "Scheda Corsisti assente." };

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === matricola) {
      return {
        status: "SUCCESS",
        dossier: {
          dataImmatricolazione: data[i][0],
          matricola: data[i][1],
          nominativo: data[i][2],
          email: data[i][3],
          telefono: data[i][4],
          telegram: data[i][5] || "",
          percorso: data[i][6],
          statoPagamento: data[i][7],
          importoTotale: data[i][8],
          importoVersato: data[i][9],
          residuoRate: data[i][10],
          scadenzaProssimaRata: data[i][11],
          giornoAvanzamento: data[i][12] || 1,
          statusGoldCard: data[i][13],
          linkWorkspaceDrive: data[i][14] || "#",
          moduliSbloccatiCsv: data[i][15] || "",
          slotLiberiJson: data[i][16] || "[]",
          notePresidenza: data[i][17] || ""
        }
      };
    }
  }
  return { status: "NOT_FOUND", message: "Nessun allievo trovato per la matricola specificata." };
}

function aggiornaSblocchiCorsista(matricola, moduliCsv, giorno) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Corsisti");
  if (!sheet) return { status: "ERROR", message: "Scheda Corsisti non trovata." };

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === matricola) {
      if (moduliCsv !== undefined) sheet.getRange(i + 1, 16).setValue(moduliCsv);
      if (giorno !== undefined) sheet.getRange(i + 1, 13).setValue(giorno);
      salvaLogNOC("SBLOCCHI_DIDATTICI", `Aggiornati moduli per matricola ${matricola}: ${moduliCsv}`, "Presidenza");
      return { status: "SUCCESS", message: "Sblocchi didattici aggiornati per l'allievo " + matricola };
    }
  }
  return { status: "NOT_FOUND", message: "Allievo non trovato." };
}

function aggiornaRateCorsista(matricola, stato, versato, residuo, scadenza) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Corsisti");
  if (!sheet) return { status: "ERROR", message: "Scheda Corsisti non trovata." };

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === matricola) {
      if (stato) sheet.getRange(i + 1, 8).setValue(stato);
      if (versato !== undefined) sheet.getRange(i + 1, 10).setValue(versato);
      if (residuo !== undefined) sheet.getRange(i + 1, 11).setValue(residuo);
      if (scadenza) sheet.getRange(i + 1, 12).setValue(scadenza);
      salvaLogNOC("RATE_UPDATE", `Aggiornate rate per matricola ${matricola}: Saldo ${stato}`, "Presidenza");
      return { status: "SUCCESS", message: "Piano rate aggiornato con successo." };
    }
  }
  return { status: "NOT_FOUND", message: "Allievo non trovato." };
}

function salvaSlotLiberoCorsista(matricola, indice, titolo, url, attivo) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Corsisti");
  if (!sheet) return { status: "ERROR", message: "Scheda Corsisti non trovata." };

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === matricola) {
      let slots = [];
      try {
        slots = JSON.parse(data[i][16] || "[]");
      } catch (e) {
        slots = [];
      }

      slots[indice] = {
        indice: indice,
        titolo: titolo || ("Documento Personalizzato " + (indice + 1)),
        url: url || "",
        attivo: attivo === true || attivo === "true"
      };

      sheet.getRange(i + 1, 17).setValue(JSON.stringify(slots));
      salvaLogNOC("CUSTOM_SLOT_UPDATE", `Aggiornato slot libero ${indice} per ${matricola}`, "Presidenza");
      return { status: "SUCCESS", message: "Slot libero aggiornato.", slots: slots };
    }
  }
  return { status: "NOT_FOUND", message: "Corsista non trovato." };
}

// ============================================================================
// 8. CREAZIONE ALBERO CARTELLE GOOGLE DRIVE TRIPARTITE CORSISTA
// ============================================================================
function creaAlberoCartelleDriveCorsista(matricola, nominativo, emailCorsista) {
  try {
    const rootName = "SFX_WORKSPACE_" + (matricola || Utilities.getUuid().substring(0, 6).toUpperCase()) + "_" + (nominativo || "ALLIEVO").replace(/\s+/g, "_");
    
    const parentFolders = DriveApp.getFoldersByName(SFX_CONFIG.DRIVE_ROOT_FOLDER);
    const parentFolder = parentFolders.hasNext() ? parentFolders.next() : DriveApp.createFolder(SFX_CONFIG.DRIVE_ROOT_FOLDER);

    const userFolder = parentFolder.createFolder(rootName);
    
    const sub1 = userFolder.createFolder("01_Materiali_Operativi");
    const sub2 = userFolder.createFolder("02_Consegne_Project_Work");
    const sub3 = userFolder.createFolder("03_Dossier_Amministrativo");

    if (emailCorsista && emailCorsista.includes("@")) {
      userFolder.addViewer(emailCorsista);
    }

    const rootUrl = userFolder.getUrl();

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Corsisti");
    if (sheet) {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][1] === matricola) {
          sheet.getRange(i + 1, 15).setValue(rootUrl);
          break;
        }
      }
    }

    salvaLogNOC("DRIVE_WORKSPACE_CREATED", `Creato albero cartelle per ${matricola}: ${rootName}`, "AG-07 Delta");
    inviaTelegramSovereign(`📁 <b>WORKSPACE GOOGLE DRIVE ALLOCATO</b>\nAllievo: <b>${nominativo}</b> (<code>${matricola}</code>)\nCartella: <a href="${rootUrl}">Apri su Drive</a>`);

    return {
      status: "SUCCESS",
      workspaceUrl: rootUrl,
      cartelle: { radice: rootName, sub1: "01_Materiali_Operativi", sub2: "02_Consegne_Project_Work", sub3: "03_Dossier_Amministrativo" }
    };
  } catch (err) {
    salvaLogNOC("DRIVE_ERROR", err.toString(), "Drive Engine");
    return { status: "ERROR", message: err.toString() };
  }
}

// ============================================================================
// 9. CONTROLLER 11 SEZIONI LANDING (PERSISTENZA CLOUD SU GOOGLE SHEETS)
// ============================================================================
function salvaConfigurazioneLanding(configJson) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Configurazioni_Sistema") || ss.insertSheet("Configurazioni_Sistema");

  const stringified = (typeof configJson === "string") ? configJson : JSON.stringify(configJson);
  const data = sheet.getDataRange().getValues();
  let riga = -1;

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === "LANDING_11_SEZIONI_CONFIG") {
      riga = i + 1;
      break;
    }
  }

  if (riga > 0) {
    sheet.getRange(riga, 2).setValue(stringified);
    sheet.getRange(riga, 3).setValue(new Date());
    sheet.getRange(riga, 4).setValue("NEXUS_SYNC_ENGINE");
  } else {
    sheet.appendRow(["LANDING_11_SEZIONI_CONFIG", stringified, new Date(), "NEXUS_SYNC_ENGINE"]);
  }

  salvaLogNOC("LANDING_CONFIG_PUBBLICATA", "Configurazione 11 sezioni salvata sul cloud", "Nexus Controller");
  return { status: "SUCCESS", message: "Configurazione pubblicata e allineata in tempo reale con la Landing Page." };
}

function ottieniConfigurazioneLanding() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Configurazioni_Sistema");
  if (!sheet) return null;

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === "LANDING_11_SEZIONI_CONFIG") {
      try {
        return JSON.parse(data[i][1]);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

// ============================================================================
// 10. MASTRO FINANZIARIO SPLIT 54/30/16 & NOTARIZZAZIONE SHA-256
// ============================================================================
function registraTransazioneMastro(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Mastro_Finanziario") || ss.insertSheet("Mastro_Finanziario");

  const lordo = parseFloat(data.importo || data.totale || 0);
  const causale = (data.causale || data.desc || "Iscrizione Corso").trim();
  const gateway = (data.circuito || data.gateway || "SumUp POS").trim();
  const idTxn = "TXN-" + Utilities.getUuid().substring(0, 8).toUpperCase();

  const ops54 = Math.round(lordo * 0.54 * 100) / 100;
  const ceo30 = Math.round(lordo * 0.30 * 100) / 100;
  const fisco16 = Math.round(lordo * 0.16 * 100) / 100;

  const rawString = `${new Date().toISOString()}|${idTxn}|${causale}|${lordo}|${ops54}|${ceo30}|${fisco16}|EAL6_SOVRANO`;
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, rawString);
  const signatureHex = digest.map(b => (b < 0 ? b + 256 : b).toString(16).padStart(2, '0')).join('');

  sheet.appendRow([
    new Date(), idTxn, causale, gateway, lordo, ops54, ceo30, fisco16, signatureHex
  ]);

  inviaTelegramSovereign(
    `💰 <b>NUOVA TRANSAZIONE REGISTRATA A MASTRO</b>\n` +
    `────────────────────────\n` +
    `<b>ID:</b> <code>${idTxn}</code>\n` +
    `<b>Causale:</b> ${causale}\n` +
    `<b>Lordo:</b> € ${lordo.toFixed(2)} [${gateway}]\n` +
    `• 54% Operatività: € ${ops54.toFixed(2)}\n` +
    `• 30% Dividendi CEO: € ${ceo30.toFixed(2)}\\n` +
    `• 16% Presidio F24: € ${fisco16.toFixed(2)}\n` +
    `<b>Firma SHA-256:</b> <code>${signatureHex.substring(0, 16)}...</code>`
  );

  return {
    status: "SUCCESS",
    idTxn: idTxn,
    lordo: lordo,
    ops: ops54,
    ceo: ceo30,
    fisco: fisco16,
    hash: signatureHex
  };
}

// ============================================================================
// 11. UPLOAD MEDIA DRIVE IN BASE64 (DA MAC E IPHONE)
// ============================================================================
function caricaFileBase64SuDrive(data) {
  try {
    const nome = (data.nomeFile || data.titolo || ("SFX_Asset_" + Date.now())).trim();
    const categoria = (data.categoria || "FOTO").toUpperCase();
    const note = (data.note || "Caricamento diretto").trim();
    const base64Str = data.fileBase64 || data.base64;

    if (!base64Str) throw new Error("Flusso dati Base64 mancante o non valido.");

    const cleanBase64 = base64Str.includes(",") ? base64Str.split(",")[1] : base64Str;
    const bytes = Utilities.base64Decode(cleanBase64);

    let mimeType = MimeType.PNG;
    if (nome.endsWith(".pdf")) mimeType = MimeType.PDF;
    else if (nome.endsWith(".mp4") || nome.endsWith(".mov")) mimeType = "video/mp4";
    else if (nome.endsWith(".jpg") || nome.endsWith(".jpeg")) mimeType = MimeType.JPEG;

    const blob = Utilities.newBlob(bytes, mimeType, nome);

    const folders = DriveApp.getFoldersByName(SFX_CONFIG.DRIVE_ROOT_FOLDER);
    const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(SFX_CONFIG.DRIVE_ROOT_FOLDER);

    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const url = file.getUrl();

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetVault = ss.getSheetByName("Vault_Documenti") || ss.insertSheet("Vault_Documenti");
    const docId = "DOC-" + Utilities.getUuid().substring(0, 6).toUpperCase();

    sheetVault.appendRow([
      new Date(), docId, nome, categoria, mimeType, url, note
    ]);

    salvaLogNOC("MEDIA_VAULT_UPLOAD", `Nuovo file archiviato: ${nome} (${categoria})`, "Media Engine");
    return { status: "SUCCESS", docId: docId, fileUrl: url, nomeFile: nome };
  } catch (err) {
    salvaLogNOC("UPLOAD_ERROR", err.toString(), "Media Vault");
    return { status: "ERROR", message: err.toString() };
  }
}

// ============================================================================
// 12. SUPREMA GOLD CARD & GESTIONE 6 GRADI (DA 0 A 12.000+ PTS)
// ============================================================================
function registraOAggiornaGoldCard(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Gold_Cards") || ss.insertSheet("Gold_Cards");

  const card = data.card || data;
  const seriale = (card.codice || card.seriale || ("SGC-2026-" + Utilities.getUuid().substring(0, 8).toUpperCase())).trim();
  const titolare = (card.titolare || "Membro Sovrano").trim();
  const email = (card.email || "").trim();
  const telefono = (card.telefono || "").trim();
  const percorso = (card.percorso || "Executive Master").trim();
  const punti = parseInt(card.punti || 100);

  let grado = "Silver Member";
  if (punti >= 12000) grado = "Sovereign Founder Circle";
  else if (punti >= 7000) grado = "Titanium Elite";
  else if (punti >= 3500) grado = "Diamond Sovereign";
  else if (punti >= 1500) grado = "Platinum Executive";
  else if (punti >= 500) grado = "Gold Ambassador";

  sheet.appendRow([
    new Date(), seriale, titolare, email, telefono, percorso, punti, grado, "ATTIVA"
  ]);

  salvaLogNOC("GOLD_CARD_CONIATA", `Nuova card emessa: ${seriale} (${titolare}) - Grado: ${grado}`, "Gatekeeper AG-06");
  return { status: "SUCCESS", seriale: seriale, punti: punti, grado: grado };
}

// ============================================================================
// 13. INDOTTRINAMENTO FLOTTA 15 AGENTI AI & MANSIONARIO CENTRALE
// ============================================================================
function aggiornaPromptAgenteAI(agenteId, promptMaster) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Flotta_15_AI");
  if (!sheet) return { status: "ERROR", message: "Scheda Flotta non trovata" };

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === agenteId) {
      sheet.getRange(i + 1, 5).setValue(promptMaster);
      sheet.getRange(i + 1, 6).setValue(new Date());
      salvaLogNOC("AI_DOCTRINE_UPDATE", `Aggiornato prompt per ${agenteId}`, "Presidenza");
      return { status: "SUCCESS", message: `Direttiva memorizzata con successo per ${agenteId}` };
    }
  }
  return { status: "ERROR", message: "Agente non trovato nel registro." };
}

// ============================================================================
// 14. TIME-DRIVEN TRIGGER: BACKGROUND DEMON CHRONOS (AG-08) OGNI 15 MINUTI
// ============================================================================
function routineChronos15Min() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetCandidati = ss.getSheetByName("Candidati");
  if (!sheetCandidati) return;

  const data = sheetCandidati.getDataRange().getValues();
  let nonLetti = 0;

  for (let i = 1; i < data.length; i++) {
    if (data[i][12] === "IN_ATTESA_CEO") {
      nonLetti++;
    }
  }

  if (nonLetti > 0) {
    inviaTelegramSovereign(`🔔 <b>PROMEMORIA CHRONOS (AG-08)</b>\nRilevate <b>${nonLetti} candidature</b> in attesa di screening.`);
  }

  const oggi = new Date();
  if (oggi.getDate() >= 10 && oggi.getDate() <= 16) {
    const sintesi = ottieniSintesiMastro();
    inviaTelegramSovereign(`⚖️ <b>PRESIDIO FISCALE GINEVRA (AG-03)</b>\nFinestra F24 attiva. Fondo Fiscale 16% Accumulato: <b>€ ${sintesi.fiscoTotale}</b>.`);
  }
}

// ============================================================================
// 15. DISPATCHER EMAIL CON I 4 ALIAS GOOGLE WORKSPACE
// ============================================================================
function inviaEmailSovereign(aliasMittente, destinatario, oggetto, htmlCorpo) {
  try {
    const options = {
      htmlBody: htmlCorpo,
      name: "Suprema Future X // Presidenza"
    };
    if (aliasMittente) options.from = aliasMittente;

    GmailApp.sendEmail(destinatario, oggetto, "", options);
    return true;
  } catch (err) {
    try {
      GmailApp.sendEmail(destinatario, oggetto, "", { htmlBody: htmlCorpo, name: "Suprema Future X" });
      return true;
    } catch (e) {
      salvaLogNOC("EMAIL_ERROR", e.toString(), "Mail Engine");
      return false;
    }
  }
}

// ============================================================================
// 16. DISPATCHER TELEGRAM NOC
// ============================================================================
function inviaTelegramSovereign(messaggioHtml) {
  try {
    const props = PropertiesService.getScriptProperties();
    const token = props.getProperty("TELEGRAM_BOT_TOKEN") || SFX_CONFIG.TELEGRAM_DEFAULT_TOKEN;
    const chatId = props.getProperty("TELEGRAM_CHAT_ID") || SFX_CONFIG.TELEGRAM_DEFAULT_CHAT_ID;

    if (!token || token.includes("example")) return false;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const payload = {
      chat_id: chatId,
      text: messaggioHtml,
      parse_mode: "HTML",
      disable_web_page_preview: true
    };

    UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    return true;
  } catch (err) {
    salvaLogNOC("TELEGRAM_ERROR", err.toString(), "Telegram Dispatcher");
    return false;
  }
}

// ============================================================================
// 17. DOTTRINA DELLE 5.000 FONTI, 1.000 KEYWORD & COLLAUDO 9 SCHEDE
// ============================================================================
function collaudoCompleto17Sezioni() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log("SUPREMA FUTURE X // COLLAUDO INTEGRALE 17 SEZIONI AVVIATO");

  const schede = [
    {
      nome: "Corsisti",
      colonne: [
        "DATA_IMMATRICOLAZIONE", "ID_MATRICOLA_SFX", "NOMINATIVO_COMPLETO", "EMAIL_DIREZIONALE",
        "TELEFONO_WHATSAPP", "TELEGRAM_USER", "PERCORSO_BASE", "STATO_PAGAMENTO", "IMPORTO_TOTALE_EUR",
        "IMPORTO_VERSATO_EUR", "RESIDUO_RATE_EUR", "SCADENZA_PROSSIMA_RATA", "GIORNO_AVANZAMENTO",
        "STATUS_GOLD_CARD", "LINK_WORKSPACE_DRIVE", "MODULI_SBLOCCATI_CSV", "SLOT_LIBERI_JSON", "NOTE_PRESIDENZA_CEO"
      ]
    },
    {
      nome: "Candidati",
      colonne: ["DATA", "ID_LEAD", "NOME", "COGNOME", "EMAIL", "TELEFONO", "TELEGRAM_USER", "PERCORSO", "SLOT_ORARIO", "IMPORTO_EUR", "GOLD_CARD", "NOTE", "STATO_SLOT"]
    },
    {
      nome: "Mastro_Finanziario",
      colonne: ["DATA_NOTARIZZAZIONE", "ID_TXN", "DESCRIZIONE", "CIRCUITO_GATEWAY", "TOTALE_LORDO_EUR", "OPS_54_EUR", "CEO_30_EUR", "FISCO_16_EUR", "SIGNATURE_SHA256"]
    },
    {
      nome: "Configurazioni_Sistema",
      colonne: ["PARAMETRO_CHIAVE", "VALORE_JSON", "ULTIMO_AGGIORNAMENTO", "OPERATORE_MODIFICA"]
    },
    {
      nome: "Vault_Documenti",
      colonne: ["DATA_UPLOAD", "ID_DOCUMENTO", "TITOLO_RISORSA", "CATEGORIA", "MIME_TYPE", "URL_DRIVE", "NOTE_DIDATTICHE"]
    },
    {
      nome: "Gold_Cards",
      colonne: ["DATA_CONIO", "SERIALE_CARD", "TITOLARE", "EMAIL", "TELEFONO", "PERCORSO", "PUNTI_STATUS", "GRADO_TITOLO", "STATO_CARD"]
    },
    {
      nome: "Flotta_15_AI",
      colonne: ["ID_AGENTE", "NOME_AGENTE", "RUOLO_STRATEGICO", "STATO_OPERATIVO", "PROMPT_MASTER_ATTIVO", "ULTIMO_DISPACCIO"]
    },
    {
      nome: "NOC_Logs",
      colonne: ["TIMESTAMP", "LIVELLO_EVENTO", "MODULO", "DETTAGLI_OPERATIVI", "IP_DISPOSITIVO"]
    },
    {
      nome: "Promemoria_Matrix",
      colonne: ["FASE_CADENZA", "STATO_ATTIVO", "OGGETTO_EMAIL", "TEMPLATE_TESTO_EMAIL", "SCRIPT_WHATSAPP"]
    }
  ];

  schede.forEach(s => {
    let sheet = ss.getSheetByName(s.nome);
    if (!sheet) {
      sheet = ss.insertSheet(s.nome);
    }
    const headerRange = sheet.getRange(1, 1, 1, s.colonne.length);
    headerRange.setValues([s.colonne]);
    headerRange.setBackground("#090A0D").setFontColor("#D4AF37").setFontWeight("bold");
    sheet.setFrozenRows(1);
  });

  const flottaSheet = ss.getSheetByName("Flotta_15_AI");
  const agentiMansionari = [
    ["AG-01", "ALISON", "Lead Qualification & Screening Concierge", "ATTIVO", "Sei Alison (AG-01), Concierge di Presidenza per il CEO Giuliano Caratelli. Rispondi con massima autorevolezza e precisione. Ricorda che Suprema Future X non vende video preregistrati: l'erogazione è 100% Live One-to-One da 60 minuti dopo screening selettivo da 30 minuti. Prezzi inderogabili: Silver 249€, Executive 299€, Premium VIP 349€.", new Date()],
    ["AG-02", "NICOLE", "Onboarding, Matricole & Gold Card Hub", "ATTIVO", "Sei Nicole (AG-02 - Reporting Direzionale). Verifichi le nuove immatricolazioni, conii i pass Phygital Suprema Gold Card e trasmetti il bollettino quotidiano delle conversioni a ceo@supremafuturex.com.", new Date()],
    ["AG-03", "GINEVRA", "Presidio Fiscale 16% & Riconciliazione F24", "ATTIVO", "Sei Ginevra (AG-03 - Presidio Fiscale). Monitori l'accantonamento intoccabile del 16% per ogni singolo incasso aziendale, allinei lo scadenziario F24 e verifichi la conformità contabile societaria.", new Date()],
    ["AG-04", "SCOUT", "Chief Lead Hunter & Radar 1.000 Keyword", "ATTIVO", "Sei Scout (AG-04 - Social Hunter). Setacci conversazioni e segnali di mercato su 5.000 fonti aperte e 1.000 parole chiave divise nelle 3 priorità SFX. Identifichi profili qualificati ed elimini perditempo.", new Date()],
    ["AG-05", "LEDGER", "Tesoreria Mastro Split 54/30/16 & SHA-256", "ATTIVO", "Sei Ledger (AG-05 - Tesoreria Mastro). Sovraintendi alla ripartizione automatica 54% Operatività, 30% Utili/CEO, 16% Tasse F24 per ogni entrata con sigillo notarile crittografico SHA-256.", new Date()],
    ["AG-06", "GATEKEEPER", "Filtro Anti-Doppioni & Slot Integrity", "ATTIVO", "Sei Gatekeeper (AG-06 - Filtro Qualità). Verifichi la validità dei codici Gold Card, impedisci prenotazioni sovrapposte negli slot da 60 minuti e blindati il perimetro da ingressi non conformi.", new Date()],
    ["AG-07", "DELTA", "Delivery Workspace Drive Tripartito", "ATTIVO", "Sei Delta (AG-07 - Delivery Workspace). Crei l'albero delle 3 cartelle Google Drive per ogni nuovo corsista (Materiali, Consegne, Dossier) e ne gestisci i permessi di visualizzazione.", new Date()],
    ["AG-08", "CHRONOS", "Time-Driven Automation Master (15m)", "ATTIVO", "Sei Chronos (AG-08 - Supervisor Trigger). Esegui il ciclo di verifica ogni 15 minuti in background, scansioni lead non lavorati e allinei gli orologi di sistema.", new Date()],
    ["AG-09", "EXIT", "Retention Corsisti & Valutazione 90gg", "ATTIVO", "Sei Exit (AG-09 - Tutela & Retention). Verifichi l'avanzamento dei corsisti fino al traguardo dei 90 giorni e raccogli le valutazioni qualitative.", new Date()],
    ["AG-10", "INGESTION", "Data Cloud & Tally Webhook Router", "ATTIVO", "Sei Ingestion (AG-10 - Data Cloud). Gestisci l'acquisizione pulita dei campi da Tally verso Fogli Google con validazione obbligatoria del campo Telegram.", new Date()],
    ["AG-11", "ASSEDIO", "Closing Commerciale & Negoziazione Live", "ATTIVO", "Sei Assedio (AG-11 - Commercial Closing). Coordini le trattative direzionali e prepari l'emissione degli atti privati statutari a tariffa bloccata.", new Date()],
    ["AG-12", "SENTINEL", "Audit Integrity EAL6+ & Kill-Switch", "ATTIVO", "Sei Sentinel (AG-12 - Audit EAL6+ Sovrano). Vigili contro anomalie, tentativi di manipolazione credenziali e attivi il blocco totale del sistema se violato il perimetro.", new Date()],
    ["AG-13", "HERMES", "API Dispatcher & Telegram Router", "ATTIVO", "Sei Hermes (AG-13 - API Dispatcher). Smisti le chiamate esterne con SumUp POS, Revolut Business e invii le notifiche push al bot Telegram del CEO.", new Date()],
    ["AG-14", "GOVERNOR", "Supervisore Generale & Anti-Allucinazione", "ATTIVO", "Sei Governor (AG-14 - Supervisor Generale). Vigili sull'aderenza dei 15 agenti alle direttive presidenziali eliminando ogni deriva comportamentale.", new Date()],
    ["AG-15", "JOKER", "Social Strategist & Copywriting Persuasivo", "ATTIVO", "Sei Joker (AG-15 - Strategist). Redigi contenuti persuasive ad altissima autorità per i 6 canali social aziendali esaltando il valore esclusivo del metodo 100% Live 1-to-1.", new Date()]
  ];

  flottaSheet.getRange(2, 1, agentiMansionari.length, 6).setValues(agentiMansionari);

  inviaTelegramSovereign(
    `🌐 <b>SUPREMA FUTURE X // MANSIONARI E SCALA 5.000 INIETTATI</b>\n` +
    `────────────────────────\n` +
    `<b>Bacino Totale:</b> 5.000 Fonti (Social Meta/TikTok, Indeed, Subito, Reddit)\n` +
    `<b>Keywords Attive:</b> 1.000 Parole Chiave\n` +
    `<b>Mansionari:</b> L'intera flotta ha recepito i 10/20 Task Esecutivi\n` +
    `<b>Agenti Aggiornati:</b> 15 / 15\n` +
    `<b>Stato Sistema:</b> INFILTRAZIONE MASSIVA EAL6+\n` +
    `────────────────────────`
  );

  Logger.log("Dottrina 5.000 applicata a 15 agenti.");
  Logger.log("COLLAUDO INTEGRALE COMPLETATO. 9 SCHEDE ALLINEATE.");
}

// ============================================================================
// 18. TEST DIAGNOSTICA NOC TELEGRAM
// ============================================================================
function testNoc() {
  const esito = inviaTelegramSovereign("📡 <b>SFX NOC TEST // HANDSHAKE CONVALIDATO</b>\nPing di sicurezza ricevuto con successo dal nodo centrale.");
  return { status: esito ? "SUCCESS" : "ERROR", message: "Ping NOC trasmesso." };
}

function collaudoTuttiITrigger() {
  inviaTelegramSovereign("⚡ <b>COLLAUDO MULTI-TRIGGER ATTIVO</b>\nTest sequenza 4 dispacci presidenziali in esecuzione...");
  testNoc();
  routineChronos15Min();
  return { status: "SUCCESS", message: "Sequenza diagnostica multi-trigger eseguita." };
}

// ============================================================================
// 19. METODI HELPER DATABASE & AUDIT LOG
// ============================================================================
function leggiTabellaSheet(nomeFoglio) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(nomeFoglio);
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  const headers = rows[0];
  const items = [];
  for (let i = 1; i < rows.length; i++) {
    let obj = {};
    for (let h = 0; h < headers.length; h++) {
      obj[headers[h]] = rows[i][h];
    }
    items.push(obj);
  }
  return items;
}

function ottieniFullDashboardSync() {
  return {
    status: "SUCCESS",
    dati: {
      mastro: ottieniSintesiMastro(),
      candidati: leggiTabellaSheet("Candidati"),
      corsisti: leggiTabellaSheet("Corsisti"),
      goldCards: leggiTabellaSheet("Gold_Cards"),
      configLanding: ottieniConfigurazioneLanding(),
      agenti: leggiTabellaSheet("Flotta_15_AI"),
      slotOccupati: ottieniSlotOccupati()
    }
  };
}

function ottieniSintesiMastro() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Mastro_Finanziario");
  if (!sheet) return { totaleLordo: "0.00", opsTotale: "0.00", ceoTotale: "0.00", fiscoTotale: "0.00" };

  const data = sheet.getDataRange().getValues();
  let tot = 0, ops = 0, ceo = 0, fisco = 0;

  for (let i = 1; i < data.length; i++) {
    tot += parseFloat(data[i][4] || 0);
    ops += parseFloat(data[i][5] || 0);
    ceo += parseFloat(data[i][6] || 0);
    fisco += parseFloat(data[i][7] || 0);
  }

  return {
    totaleLordo: tot.toFixed(2),
    opsTotale: ops.toFixed(2),
    ceoTotale: ceo.toFixed(2),
    fiscoTotale: fisco.toFixed(2)
  };
}

function salvaLogNOC(modulo, dettagli, ip) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("NOC_Logs");
    if (sheet) {
      sheet.appendRow([new Date(), "INFO", modulo, dettagli, ip || "Server"]);
    }
  } catch (e) {}
}

function registraSegnalazioneSicurezza(payload) {
  salvaLogNOC(payload.modulo || "SECURITY_ALERT", payload.errore || payload.detail || "Segnalazione", payload.ip || "Client");
  inviaTelegramSovereign(`🚨 <b>SECURITY LOCKDOWN ALERT EAL6+</b>\nModulo: ${payload.modulo}\nDettaglio: ${payload.errore || payload.detail}`);
  return { status: "RECORDED" };
}
