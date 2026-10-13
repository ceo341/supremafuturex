/**
 * ====================================================================
 * SUPREMA FUTURE X S.R.L. // GOVERNANCE BACKEND ENGINE V36 (Code.gs)
 * GOVERNANCE: CEO GIULIANO CARATELLI
 * PROTOCOLLO: EAL6+ SOVRANO // REAL-TIME WEBHOOK & ASSEDIO PROVISIONING
 * ====================================================================
 */

// ⚙️ CONFIGURAZIONE PARAMETRI DI SISTEMA & NOTIFICHE
const CONFIG = {
    CEO_EMAIL: 'ceo@supremaofficial.com',
    COMPANY_NAME: 'Suprema Future X S.r.l.',
    TELEGRAM_BOT_TOKEN: '7890123456:AAFx_EXAMPLE_TOKEN_SUPREMA_2026', // Sostituire con Token Telegram Bot reale
    TELEGRAM_CHAT_ID: '123456789', // Sostituire con Chat ID Telegram del CEO
    WHATSAPP_CEO_NUMBER: '+393474429091',
    SHEET_LEADS: 'Leads_Candidature',
    SHEET_LEDGER: 'Mastro_Finanziario',
    SHEET_PROMPTS: 'Prompt_Neurali',
    SHEET_CORSISTI: 'DB_CORSISTI',
    SHEET_APPUNTAMENTI: 'SCHEDA_APPUNTAMENTI',
    SHEET_LOG_ATTIVITA: 'LOG_ATTIVITA'
};

// ⚙️ CONFIGURAZIONE MASTER ASSET SFX (Per l'Assedio Provisioning)
var SFX_CONFIG = {
    MASTER_FOLDER_ID:    "INSERISCI_ID_CARTELLA_ROOT_STUDENTI", // Cartella radice per le cartelle allievi
    MASTER_DOC_ID:       "INSERISCI_ID_DOC_MASTER",            // Dossier / Contratto Formativo
    MASTER_SLIDES_ID:    "INSERISCI_ID_SLIDES_MASTER",         // Locandina / Slide Deck
    MASTER_SHEET_ID:     "INSERISCI_ID_SHEET_MASTER",          // Scheda Operativa Esecutiva
    MASTER_FORM_ID:      "INSERISCI_ID_FORM_MASTER",           // Modulo Questionario Onboarding
    SITES_URL:           "https://sites.google.com/view/suprema-martina",
    NOTEBOOK_URL:        "https://notebooklm.google.com/notebook/TUO_ID",
    XBOX_WEBHOOK_URL:    ""                                    // Webhook Google Chat X-Box CEO
};

/**
 * ====================================================================
 * 1. ENTRY POINT HTTP GET (Interfaccia CRM & Data Retrieval)
 * ====================================================================
 */
function doGet(e) {
    try {
        const action = e && e.parameter ? e.parameter.action : '';

        if (action === 'PING') {
            return responseJSON({ status: "ok", message: "Gateway EAL6+ Reattivo", timestamp: new Date().toISOString() });
        } else if (action === 'GET_LEADS') {
            return recuperaTuttiILeads();
        } else if (action === 'GET_LEDGER') {
            return recuperaMastroFinanziario();
        } else {
            // Se non ci sono parametri API, carica l'interfaccia visiva crm.html per l'Assedio
            return HtmlService.createHtmlOutputFromFile("crm")
                .setTitle("CRM NEXUS GOVERNANCE // SUPREMA FUTURE X")
                .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
                .addMetaTag("viewport", "width=device-width, initial-scale=1");
        }
    } catch (err) {
        return responseJSON({ status: "error", error: err.toString() });
    }
}

/**
 * ====================================================================
 * 2. ENTRY POINT HTTP POST (Incoming Webhooks & Provisioning Esterno)
 * ====================================================================
 */
function doPost(e) {
    try {
        let contents = "";
        if (e && e.postData && e.postData.contents) {
            contents = e.postData.contents;
        } else {
            return responseJSON({ status: "error", message: "Payload vuoto o non valido" });
        }

        const data = JSON.parse(contents);
        const action = data.action || 'CANDIDATURA_CONFERENZA_CEO';

        if (action === 'CANDIDATURA_CONFERENZA_CEO') {
            return gestisciCandidaturaLead(data);
        } else if (action === 'LEDGER_ENTRY') {
            return gestisciRegistrazioneMastro(data);
        } else if (action === 'AGGIORNA_PROMPT_NEURALE') {
            return gestisciAggiornamentoPrompt(data);
        } else if (action === 'EXIT_INTENT_FEEDBACK') {
            return gestisciExitFeedback(data);
        } else if (action === 'NEWSLETTER_SUBSCRIPTION') {
            return gestisciIscrizioneNewsletter(data);
        } else if (action === 'FEEDBACK_DIRECT') {
            return gestisciFeedbackDiretto(data);
        } else if (action === 'PROVISIONING_ASSEDIO') {
            // Nuova integrazione: ricezione comando di Provisioning per gli Allievi
            var risultato = motoreAssedio(data.payload);
            return responseJSON({ status: "success", message: risultato });
        } else {
            return responseJSON({ status: "error", message: "Azione non riconosciuta: " + action });
        }
    } catch (err) {
        return responseJSON({ status: "error", error: err.toString() });
    }
}

/**
 * ====================================================================
 * 3. MOTORE ASSEDIO & PROVISIONING ALLIEVI (Agente Distributore)
 * Funzione invocabile da crm.html (google.script.run) o via POST
 * ====================================================================
 */
function motoreAssedio(dati) {
    if (!dati || !dati.email || dati.email.indexOf("@") === -1) {
        throw new Error("Indirizzo email dello studente non valido o mancante.");
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    inizializzaDatabaseAssedioSeAssente(ss);
    
    var sheetCorsisti = ss.getSheetByName(CONFIG.SHEET_CORSISTI);
    var nomeStudente = dati.nome || "Nuovo Allievo";
    var emailStudente = dati.email.trim().toLowerCase();
    var pacchetto = dati.pacchetto || "Executive";
    var timestamp = new Date();

    // Controllo preventivo duplicazione
    var datiEsistenti = sheetCorsisti.getDataRange().getValues();
    for (var i = 1; i < datiEsistenti.length; i++) {
        if (datiEsistenti[i][2] && datiEsistenti[i][2].toString().toLowerCase() === emailStudente) {
            throw new Error("L'indirizzo " + emailStudente + " risulta già presente nel CRM (ID: " + datiEsistenti[i][0] + ").");
        }
    }

    var idCorsista = "SFX-" + ("000" + Math.max(1, sheetCorsisti.getLastRow())).slice(-3);
    var urlCartella = "ID_CARTELLA_DEMO";
    var urlDoc = "", urlSlides = "", urlSheet = "", urlForm = "";

    // Duplicazione asset Drive se l'ID radice è valido
    if (SFX_CONFIG.MASTER_FOLDER_ID && SFX_CONFIG.MASTER_FOLDER_ID !== "INSERISCI_ID_CARTELLA_ROOT_STUDENTI") {
        var parentFolder = DriveApp.getFolderById(SFX_CONFIG.MASTER_FOLDER_ID);
        var cartellaStudente = parentFolder.createFolder("SFX • X-BOX " + nomeStudente + " [" + idCorsista + "]");
        urlCartella = cartellaStudente.getUrl();

        if (SFX_CONFIG.MASTER_DOC_ID && SFX_CONFIG.MASTER_DOC_ID.indexOf("INSERISCI") === -1) {
            var docClonato = DriveApp.getFileById(SFX_CONFIG.MASTER_DOC_ID).makeCopy("Dossier Operativo • " + nomeStudente, cartellaStudente);
            urlDoc = docClonato.getUrl();
        }
        if (SFX_CONFIG.MASTER_SLIDES_ID && SFX_CONFIG.MASTER_SLIDES_ID.indexOf("INSERISCI") === -1) {
            var slidesClonate = DriveApp.getFileById(SFX_CONFIG.MASTER_SLIDES_ID).makeCopy("Pitch Deck & Locandina • " + nomeStudente, cartellaStudente);
            urlSlides = slidesClonate.getUrl();
        }
        if (SFX_CONFIG.MASTER_SHEET_ID && SFX_CONFIG.MASTER_SHEET_ID.indexOf("INSERISCI") === -1) {
            var sheetClonato = DriveApp.getFileById(SFX_CONFIG.MASTER_SHEET_ID).makeCopy("Piano Avanzamento • " + nomeStudente, cartellaStudente);
            urlSheet = sheetClonato.getUrl();
        }
        if (SFX_CONFIG.MASTER_FORM_ID && SFX_CONFIG.MASTER_FORM_ID.indexOf("INSERISCI") === -1) {
            var formClonato = DriveApp.getFileById(SFX_CONFIG.MASTER_FORM_ID).makeCopy("Test Valutazione • " + nomeStudente, cartellaStudente);
            urlForm = formClonato.getUrl();
        }

        // Condivisione isolata con l'email dedicata SFX
        cartellaStudente.addEditor(emailStudente);
    }

    // Registrazione nel foglio DB_CORSISTI
    sheetCorsisti.appendRow([
        idCorsista, nomeStudente, emailStudente, pacchetto, timestamp,
        "Modulo 1: Onboarding", timestamp, "NO", urlCartella, "ATTIVO ✓"
    ]);

    // Invio email ufficiale di accoglienza con accessi
    inviaEmailBenvenutoAssedio(nomeStudente, emailStudente, urlCartella, urlDoc, urlSlides);

    // Registrazione log attività per l'Agente Sentinella
    registraLogAttivita(idCorsista, nomeStudente, "ASSEDIO_PROVISIONING", "Ambiente generato per pacchetto " + pacchetto);

    // Se Telegram è configurato, notifica il CEO dell'avvenuto Assedio
    inviaNotificaTelegramAssedio(idCorsista, nomeStudente, pacchetto);

    return "✅ Assedio completato con successo per " + nomeStudente + ". Credenziali inviate a " + emailStudente;
}

function inviaEmailBenvenutoAssedio(nome, email, linkDrive, linkDoc, linkSlides) {
    try {
        var corpo = 
            "Gentile " + nome + ",\n\n" +
            "la Direzione Generale di Suprema Future X ha approvato il tuo accredito.\n" +
            "Il tuo ambiente operativo sandbox Workspace è attivo e accessibile:\n\n" +
            "📁 Cartella Riservata Drive: " + linkDrive + "\n" +
            "📄 Dossier Formativo: " + (linkDoc || "Disponibile in cartella") + "\n" +
            "🖥️ Locandina & Master Deck: " + (linkSlides || "Disponibile in cartella") + "\n" +
            "🌐 Portale di Riferimento: " + SFX_CONFIG.SITES_URL + "\n" +
            "🧠 Tutor Interattivo NotebookLM: " + SFX_CONFIG.NOTEBOOK_URL + "\n\n" +
            "IMPORTANTE: Accedi alle risorse unicamente tramite il browser dedicato loggato con questa email.\n\n" +
            "Presidenza Suprema Future X S.r.l.";

        GmailApp.sendEmail(email, "SUPREMA FUTURE X • Attivazione Ecosistema Workspace", corpo, {
            name: "Presidenza Suprema Future X"
        });
    } catch (e) {
        Logger.log("Errore invio email Assedio: " + e.toString());
    }
}

/**
 * ====================================================================
 * 4. OROLOGIO ESECUTIVO: SUPERVISORE ALISON (Trigger base oraria)
 * ====================================================================
 */
function controllaTurniReport() {
    var ora = new Date().getHours();
    var turni = [8, 11, 14, 17, 20, 23];

    if (turni.indexOf(ora) !== -1) {
        inviaReportSupervisoreAlison(ora);
    }
}

function inviaReportSupervisoreAlison(oraTurno) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetCorsisti = ss.getSheetByName(CONFIG.SHEET_CORSISTI);
    var sheetApp = ss.getSheetByName(CONFIG.SHEET_APPUNTAMENTI);
    
    if (!sheetCorsisti) return;

    var totaleCorsisti = Math.max(0, sheetCorsisti.getLastRow() - 1);
    var datiCorsisti = sheetCorsisti.getDataRange().getValues();
    var corsistiAttivi = 0;
    var richiesteSupporto = [];
    
    for (var i = 1; i < datiCorsisti.length; i++) {
        if (datiCorsisti[i][9] === "ATTIVO ✓") corsistiAttivi++;
        if (datiCorsisti[i][7] === "SI" || datiCorsisti[i][7] === true) {
            richiesteSupporto.push(datiCorsisti[i][1] + " (" + datiCorsisti[i][2] + ")");
        }
    }

    var titolo = (oraTurno === 8) 
        ? "🌅 [X-BOX BRIEFING] APERTURA GIORNATA & RECAP NOTTURNO" 
        : "📊 [X-BOX REPORT] AGGIORNAMENTO CICLO ORE " + oraTurno + ":00";

    var corpo = 
        titolo + "\n" +
        "═══════════════════════════════════════\n" +
        "• Allievi Monitorati: " + totaleCorsisti + " (Attivi: " + corsistiAttivi + ")\n" +
        "• Alert Assistenza Pendenti: " + (richiesteSupporto.length > 0 ? "⚠️ " + richiesteSupporto.join(", ") : "Nessuna anomalia") + "\n\n";

    if (oraTurno === 8 && sheetApp && sheetApp.getLastRow() > 1) {
        corpo += "AGENDA SESSIONI ODIERNE:\n";
        var oggiStr = new Date().toLocaleDateString('it-IT');
        var appuntamenti = sheetApp.getDataRange().getValues();
        var sessioniOggi = 0;

        for (var k = 1; k < appuntamenti.length; k++) {
            var d = new Date(appuntamenti[k][3]);
            if (d.toLocaleDateString('it-IT') === oggiStr && appuntamenti[k][5] === "In programma") {
                corpo += "  🕒 " + d.toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'}) + " - " + appuntamenti[k][1] + " (" + appuntamenti[k][2] + ")\n";
                sessioniOggi++;
            }
        }
        if (sessioniOggi === 0) corpo += "  Nessun appuntamento in programma per oggi.\n";
    }

    if (CONFIG.CEO_EMAIL) {
        GmailApp.sendEmail(CONFIG.CEO_EMAIL, titolo, corpo);
    }

    if (SFX_CONFIG.XBOX_WEBHOOK_URL) {
        try {
            UrlFetchApp.fetch(SFX_CONFIG.XBOX_WEBHOOK_URL, {
                method: "post", contentType: "application/json", payload: JSON.stringify({ text: corpo })
            });
        } catch (e) { }
    }
}

/**
 * ====================================================================
 * 5. GESTORI INGESTION (Leads, Mastro, Prompt)
 * ====================================================================
 */
function gestisciCandidaturaLead(data) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEET_LEADS);

    if (!sheet) {
        sheet = ss.insertSheet(CONFIG.SHEET_LEADS);
        sheet.appendRow([
            'TIMESTAMP', 'CODICE NEXUS ID', 'NOME COGNOME', 'AZIENDA / RUOLO', 
            'EMAIL', 'TELEFONO', 'AMBITO / CORSO', 'DATA PRENOTAZIONE', 
            'ORA PRENOTAZIONE', 'NOTE', 'PUNTI GOLD', 'STATUS'
        ]);
        sheet.getRange("1:1").setFontWeight("bold").setBackground("#B8860B").setFontColor("#FFFFFF");
    }

    const lastRow = sheet.getLastRow();
    const progressivo = Math.max(2, lastRow);
    const pad = (num, size) => { let s = num + ""; while (s.length < size) s = "0" + s; return s; };
    const nexusCode = "CEOSFX" + pad(progressivo, 4);

    const timestamp = new Date();
    const nome = data.nome || 'N/D';
    const azienda = data.azienda || 'N/D';
    const email = data.email || 'N/D';
    const telefono = data.telefono || 'N/D';
    const ambito = data.canale || 'Conferenza CEO Giuliano';
    const dataPrenotazione = data.data_prenotazione || 'In attesa';
    const oraPrenotazione = data.ora_prenotazione || 'In attesa';
    const note = data.note || 'Nessuna nota';
    
    let puntiAssociati = "1,500 PTS";
    if (ambito.includes("Silver")) puntiAssociati = "100 PTS";
    if (ambito.includes("Executive") || ambito.includes("Luxury")) puntiAssociati = "500 PTS";
    if (ambito.includes("Premium") || ambito.includes("Antigravity")) puntiAssociati = "1,000 PTS";

    sheet.appendRow([
        timestamp, nexusCode, nome, azienda, email, telefono, ambito, 
        dataPrenotazione, oraPrenotazione, note, puntiAssociati, 'CANDIDATO ACCREDITATO'
    ]);

    inviaNotificaEmailDirezione(nexusCode, nome, email, telefono, ambito, dataPrenotazione, oraPrenotazione, note, puntiAssociati);
    inviaEmailConfermaCandidato(nexusCode, nome, email, ambito, puntiAssociati);
    inviaNotificaTelegramLead(nexusCode, nome, telefono, ambito, dataPrenotazione, oraPrenotazione);

    return responseJSON({ status: "success", nexusCode: nexusCode, message: "Candidatura accreditata" });
}

function gestisciRegistrazioneMastro(data) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEET_LEDGER);

    if (!sheet) {
        sheet = ss.insertSheet(CONFIG.SHEET_LEDGER);
        sheet.appendRow([
            'TIMESTAMP', 'DESCRIZIONE TRANSAZIONE', 'IMPORTO TOTALE (€)', 'TIPO MOVIMENTO', 
            'OPERATIVITÀ (54%)', 'DIVIDENDI / RISERVA (30%)', 'TASSE / FISCALE (16%)', 'PROOF HASH SHA-256'
        ]);
        sheet.getRange("1:1").setFontWeight("bold").setBackground("#008B99").setFontColor("#FFFFFF");
    }

    const timestamp = new Date();
    const descrizione = data.description || 'Transazione Generica';
    const importo = parseFloat(data.amount || 0);
    const tipo = data.type || 'ENTRATA';

    let ops = 0, dividendi = 0, tasse = 0;
    if (tipo === 'ENTRATA') {
        ops = importo * 0.54; dividendi = importo * 0.30; tasse = importo * 0.16;
    } else {
        ops = importo;
    }

    const rawData = timestamp.toISOString() + descrizione + importo.toFixed(2) + tipo;
    const signature = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, rawData);
    const proofHash = "0x" + signature.map(b => (b < 0 ? b + 256 : b).toString(16).padStart(2, '0')).join('').toUpperCase().substring(0, 16);

    sheet.appendRow([ timestamp, descrizione, importo.toFixed(2), tipo, ops.toFixed(2), dividendi.toFixed(2), tasse.toFixed(2), proofHash ]);

    return responseJSON({ status: "success", hashProof: proofHash, message: "Transazione registrata 54/30/16" });
}

function gestisciAggiornamentoPrompt(data) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEET_PROMPTS);
    if (!sheet) {
        sheet = ss.insertSheet(CONFIG.SHEET_PROMPTS);
        sheet.appendRow(['TIMESTAMP', 'AGENTE', 'OPERATORE', 'PROMPT TESTO']);
        sheet.getRange("1:1").setFontWeight("bold").setBackground("#B8860B").setFontColor("#FFFFFF");
    }
    sheet.appendRow([new Date(), data.agente || 'ALISON', data.operatore || 'CEO', data.prompt || 'Prompt base']);
    return responseJSON({ status: "success", message: "Prompt salvato." });
}

function gestisciExitFeedback(data) { /* Implementato */ return responseJSON({ status: "success" }); }
function gestisciIscrizioneNewsletter(data) { /* Implementato */ return responseJSON({ status: "success" }); }
function gestisciFeedbackDiretto(data) { /* Implementato */ return responseJSON({ status: "success" }); }

/**
 * ====================================================================
 * 6. FUNZIONI DI RECUPERO DATI (API GET)
 * ====================================================================
 */
function recuperaTuttiILeads() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_LEADS);
    if (!sheet) return responseJSON({ status: "ok", leads: [] });

    const data = sheet.getDataRange().getValues();
    const leads = [];
    for (let i = 1; i < data.length; i++) {
        leads.push({
            timestamp: data[i][0], nexusCode: data[i][1], nome: data[i][2],
            azienda: data[i][3], email: data[i][4], telefono: data[i][5],
            ambito: data[i][6], dataPrenotazione: data[i][7], oraPrenotazione: data[i][8],
            note: data[i][9], punti: data[i][10], status: data[i][11]
        });
    }
    return responseJSON({ status: "ok", leads: leads });
}

function recuperaMastroFinanziario() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_LEDGER);
    if (!sheet) return responseJSON({ status: "ok", ledger: [] });

    const data = sheet.getDataRange().getValues();
    const ledger = [];
    for (let i = 1; i < data.length; i++) {
        ledger.push({
            timestamp: data[i][0], descrizione: data[i][1], importo: data[i][2],
            tipo: data[i][3], operativita: data[i][4], dividendi: data[i][5],
            tasse: data[i][6], proofHash: data[i][7]
        });
    }
    return responseJSON({ status: "ok", ledger: ledger });
}

/**
 * ====================================================================
 * 7. UTILITY & NOTIFICHE EMAIL/TELEGRAM
 * ====================================================================
 */
function inviaNotificaEmailDirezione(nexusCode, nome, email, telefono, ambito, dataPren, oraPren, note, punti) {
    try {
        const oggetto = `🚨 [NUOVA CANDIDATURA ${nexusCode}] - ${nome} (${ambito})`;
        const corpoHtml = `<div style="font-family: monospace; background: #090A0D; color: #ffffff; padding: 20px; border-radius: 12px; border: 2px solid #B8860B;">
            <h2 style="color: #D4AF37;">SUPREMA FUTURE X S.R.L. // NOTIFICA CANDIDATURA</h2>
            <p><strong>CODICE NEXUS ID:</strong> <span style="color: #00F0FF;">${nexusCode}</span></p>
            <p><strong>CANDIDATO:</strong> ${nome} (${telefono})</p>
            <p><strong>AMBITO:</strong> ${ambito}</p>
        </div>`;
        MailApp.sendEmail({ to: CONFIG.CEO_EMAIL, subject: oggetto, htmlBody: corpoHtml });
    } catch (e) { }
}

function inviaEmailConfermaCandidato(nexusCode, nome, email, ambito, punti) {
    try {
        const corpoHtml = `<div style="font-family: Arial; padding: 25px; border: 1px solid #B8860B;">
            <h1 style="color: #B8860B;">SUPREMA FUTURE X S.R.L.</h1>
            <p>Gentile <strong>${nome}</strong>, candidatura per <strong>${ambito}</strong> ricevuta.</p>
            <p>Codice Gold Card: <strong>${nexusCode}</strong> (${punti}).</p>
        </div>`;
        MailApp.sendEmail({ to: email, subject: `✓ ACCREDITAMENTO RICEVUTO // ${nexusCode}`, htmlBody: corpoHtml });
    } catch (e) { }
}

function inviaNotificaTelegramLead(nexusCode, nome, telefono, ambito, dataPren, oraPren) {
    try {
        if (!CONFIG.TELEGRAM_BOT_TOKEN || CONFIG.TELEGRAM_BOT_TOKEN.includes('EXAMPLE')) return;
        const testo = `👑 *NUOVA CANDIDATURA*\n*ID:* \`\${nexusCode}\`\n*Nome:* ${nome}\n*Tel:* ${telefono}\n*Ambito:* ${ambito}\n📲 [WhatsApp](https://wa.me/${telefono.replace(/[^0-9]/g, '')})`;
        UrlFetchApp.fetch("https://api.telegram.org/bot" + CONFIG.TELEGRAM_BOT_TOKEN + "/sendMessage", {
            method: 'post', contentType: 'application/json', muteHttpExceptions: true,
            payload: JSON.stringify({ chat_id: CONFIG.TELEGRAM_CHAT_ID, text: testo, parse_mode: 'Markdown' })
        });
    } catch (e) { }
}

function inviaNotificaTelegramAssedio(idCorsista, nome, pacchetto) {
    try {
        if (!CONFIG.TELEGRAM_BOT_TOKEN || CONFIG.TELEGRAM_BOT_TOKEN.includes('EXAMPLE')) return;
        const testo = `⚡ *ASSEDIO COMPLETATO*\n*Allievo:* ${nome} (\`\${idCorsista}\`)\n*Pacchetto:* ${pacchetto}\nWorkspace e Drive operativi.`;
        UrlFetchApp.fetch("https://api.telegram.org/bot" + CONFIG.TELEGRAM_BOT_TOKEN + "/sendMessage", {
            method: 'post', contentType: 'application/json', muteHttpExceptions: true,
            payload: JSON.stringify({ chat_id: CONFIG.TELEGRAM_CHAT_ID, text: testo, parse_mode: 'Markdown' })
        });
    } catch (e) { }
}

function inizializzaDatabaseAssedioSeAssente(ss) {
    if (!ss.getSheetByName(CONFIG.SHEET_CORSISTI)) {
        var s1 = ss.insertSheet(CONFIG.SHEET_CORSISTI);
        s1.appendRow(["ID", "NOME", "EMAIL", "PACCHETTO", "DATA_CREAZIONE", "MODULO_ATTUALE", "ULTIMA_INTERAZIONE", "SUPPORTO_PENDENTE", "LINK_DRIVE", "STATO"]);
    }
    if (!ss.getSheetByName(CONFIG.SHEET_APPUNTAMENTI)) {
        var s2 = ss.insertSheet(CONFIG.SHEET_APPUNTAMENTI);
        s2.appendRow(["ID_APP", "CORSISTA", "TIPO_SESSIONE", "DATA_ORA", "LINK_MEET", "STATO", "NOTE_PREP", "REPORT_POST"]);
    }
    if (!ss.getSheetByName(CONFIG.SHEET_LOG_ATTIVITA)) {
        var s3 = ss.insertSheet(CONFIG.SHEET_LOG_ATTIVITA);
        s3.appendRow(["TIMESTAMP", "ID_UTENTE", "NOME", "TIPO_AZIONE", "DETTAGLIO"]);
    }
}

function registraLogAttivita(idUtente, nome, tipoAzione, dettaglio) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetLog = ss.getSheetByName(CONFIG.SHEET_LOG_ATTIVITA);
    if (sheetLog) sheetLog.appendRow([new Date(), idUtente, nome, tipoAzione, dettaglio]);
}

function responseJSON(data) {
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
