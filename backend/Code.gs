/**
 * ====================================================================
 * SUPREMA FUTURE X S.R.L. // GOVERNANCE BACKEND ENGINE V38 (Code.gs)
 * GOVERNANCE: CEO GIULIANO CARATELLI
 * PROTOCOLLO: EAL6+ SOVRANO // REAL-TIME WEBHOOK, ASSEDIO & CEO HUB
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
    SHEET_LOG_ATTIVITA: 'LOG_ATTIVITA',
    SHEET_BOX1: 'Box 1 - File e Risorse',
    SHEET_BOX2: 'Box 2 - Schede e Finanza',
    SHEET_DASH: 'Dashboard CEO',
    SHEET_BLACKLIST: 'Sicurezza_Blacklist' // NUOVO: Tracciamento IP
};

// ⚙️ CONFIGURAZIONE MASTER ASSET SFX (Provisioning Assedio)
const SFX_CONFIG = {
    MASTER_FOLDER_ID:    "INSERISCI_ID_CARTELLA_ROOT_STUDENTI", // Cartella radice Drive allievi
    MASTER_DOC_ID:       "INSERISCI_ID_DOC_MASTER",             // Dossier Contratto Formativo
    MASTER_SLIDES_ID:    "INSERISCI_ID_SLIDES_MASTER",          // Locandina & Deck
    MASTER_SHEET_ID:     "INSERISCI_ID_SHEET_MASTER",           // Scheda Operativa Esecutiva
    MASTER_FORM_ID:      "INSERISCI_ID_FORM_MASTER",            // Modulo Questionario Onboarding
    SITES_URL:           "https://sites.google.com/view/suprema-martina",
    NOTEBOOK_URL:        "https://notebooklm.google.com/notebook/TUO_ID",
    XBOX_WEBHOOK_URL:    ""                                      // Webhook Google Chat X-Box CEO
};

/**
 * ====================================================================
 * 0. ZERO-PLAINTEXT SECRETS & GATEWAY DINAMICO IBAN
 * ====================================================================
 */
function inizializzaCredenzialiSicure() {
    const props = PropertiesService.getScriptProperties();
    if(!props.getProperty('HASH_MASTER_PWD')) props.setProperty('HASH_MASTER_PWD', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'); 
    if(!props.getProperty('HASH_PIN_CODE')) props.setProperty('HASH_PIN_CODE', 'b9b68cb267e889da3b3f2c5d1e2b58d0'); 
    if(!props.getProperty('HASH_RESCUE_KEY')) props.setProperty('HASH_RESCUE_KEY', '4a7f058098ef'); 
    if(!props.getProperty('SFX_CURRENT_IBAN')) {
        props.setProperty('SFX_CURRENT_IBAN', 'IT00A0000000000000000000000');
        props.setProperty('SFX_IBAN_OWNER', 'Suprema Future X S.r.l.');
    }
}

function recuperaDatiDinamici() {
    const props = PropertiesService.getScriptProperties();
    return responseJSON({
        status: "ok",
        iban: props.getProperty('SFX_CURRENT_IBAN') || "Non impostato",
        intestatario: props.getProperty('SFX_IBAN_OWNER') || "Suprema Future X S.r.l."
    });
}

function aggiornaIbanDinamico(data) {
    const props = PropertiesService.getScriptProperties();
    const vecchioIban = props.getProperty('SFX_CURRENT_IBAN');
    props.setProperty('SFX_CURRENT_IBAN', data.nuovoIban);
    props.setProperty('SFX_IBAN_OWNER', data.nuovoIntestatario || 'Suprema Future X S.r.l.');
    registraLogAttivita("CEO", "Giuliano", "CAMBIO_IBAN", "Modifica da " + vecchioIban + " a " + data.nuovoIban);
    return responseJSON({status: "success", message: "IBAN aggiornato globalmente."});
}

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
        } else if (action === 'GET_DYNAMIC_DATA') {
            return recuperaDatiDinamici();
        } else {
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
 * 2. ENTRY POINT HTTP POST (Incoming Webhooks & Ingestion Engine)
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
            const risultato = motoreAssedio(data.payload);
            return responseJSON({ status: "success", message: risultato });
        } else if (action === 'SECURITY_BREACH_ALERT') {
            return gestisciAllarmeSicurezzaIP(data);
        } else if (action === 'UPDATE_IBAN') {
            return aggiornaIbanDinamico(data);
        } else {
            return responseJSON({ status: "error", message: "Azione non riconosciuta: " + action });
        }
    } catch (err) {
        return responseJSON({ status: "error", error: err.toString() });
    }
}

/**
 * ====================================================================
 * 2B. PROTOCOLLO ANTI-INTRUSIONE E BLACKLIST IP EAL6+
 * ====================================================================
 */
function gestisciAllarmeSicurezzaIP(data) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEET_BLACKLIST);

    if (!sheet) {
        sheet = ss.insertSheet(CONFIG.SHEET_BLACKLIST);
        sheet.appendRow(['TIMESTAMP', 'INDIRIZZO IP', 'DISPOSITIVO', 'STATO_ALLARME', 'DETTAGLIO_ERRORE']);
        sheet.getRange("1:1").setFontWeight("bold").setBackground("#4A0E4E").setFontColor("#FFFFFF"); 
    }
    
    const timestamp = new Date();
    const ip = data.ip || 'Sconosciuto';
    const device = data.device || 'N/D';
    const status = data.status || 'PRUGNA_BLOCCATO';
    const detail = data.detail || 'Multipli tentativi di accesso falliti';

    sheet.appendRow([timestamp, ip, device, status, detail]);
    
    const oggetto = `🚨 [ALLARME EAL6+] TENTATIVO DI VIOLAZIONE X-BOX`;
    const corpoHtml = `
        <div style="font-family: monospace; background: #2D0A11; color: #ffffff; padding: 20px; border: 2px solid #FF3333;">
            <h2 style="color: #FF3333;">TENTATIVO DI ABUSO PARAMETRO X-BOX</h2>
            <p><strong>INDIRIZZO IP INTRUSO:</strong> ${ip}</p>
            <p>Si prega il CEO di rientrare nella violazione e di risistemare il circuito con l'entrata di emergenza: 4 colpi titolo e rispondere alla domanda di sicurezza.</p>
        </div>
    `;
    MailApp.sendEmail({ to: CONFIG.CEO_EMAIL, subject: oggetto, htmlBody: corpoHtml });
    
    return responseJSON({ status: "success", message: "Blacklist aggiornata. Notifiche CEO inviate." });
}

/**
 * ====================================================================
 * 3. GESTORE INGESTION CANDIDATURE & ID NEXUS (CEOSFX0002+)
 * ====================================================================
 */
function gestisciCandidaturaLead(data) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEET_LEADS);

    if (!sheet) {
        sheet = ss.insertSheet(CONFIG.SHEET_LEADS);
        sheet.appendRow([
            'TIMESTAMP', 
            'CODICE NEXUS ID', 
            'NOME COGNOME', 
            'AZIENDA / RUOLO', 
            'EMAIL', 
            'TELEFONO', 
            'AMBITO / CORSO', 
            'DATA PRENOTAZIONE', 
            'ORA PRENOTAZIONE', 
            'NOTE', 
            'PUNTI GOLD', 
            'STATUS'
        ]);
        sheet.getRange("1:1").setFontWeight("bold").setBackground("#B8860B").setFontColor("#FFFFFF");
    }

    const lastRow = sheet.getLastRow();
    const progressivo = Math.max(2, lastRow);
    const pad = (num, size) => {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    };
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
        timestamp,
        nexusCode,
        nome,
        azienda,
        email,
        telefono,
        ambito,
        dataPrenotazione,
        oraPrenotazione,
        note,
        puntiAssociati,
        'CANDIDATO ACCREDITATO'
    ]);

    inviaNotificaEmailDirezione(nexusCode, nome, email, telefono, ambito, dataPrenotazione, oraPrenotazione, note, puntiAssociati);
    inviaEmailConfermaCandidato(nexusCode, nome, email, ambito, puntiAssociati);
    inviaNotificaTelegram(nexusCode, nome, telefono, ambito, dataPrenotazione, oraPrenotazione);

    return responseJSON({
        status: "success",
        nexusCode: nexusCode,
        message: "Candidatura accreditata con successo nel Registro EAL6+",
        timestamp: timestamp
    });
}/**
 * ====================================================================
 * 4. MASTRO FINANZIARIO & RIPARTIZIONE STATUTARIA 54/30/16
 * ====================================================================
 */
function gestisciRegistrazioneMastro(data) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEET_LEDGER);

    if (!sheet) {
        sheet = ss.insertSheet(CONFIG.SHEET_LEDGER);
        sheet.appendRow([
            'TIMESTAMP',
            'DESCRIZIONE TRANSAZIONE',
            'IMPORTO TOTALE (€)',
            'TIPO MOVIMENTO',
            'OPERATIVITÀ (54%)',
            'DIVIDENDI / RISERVA (30%)',
            'TASSE / FISCALE (16%)',
            'PROOF HASH SHA-256'
        ]);
        sheet.getRange("1:1").setFontWeight("bold").setBackground("#008B99").setFontColor("#FFFFFF");
    }

    const timestamp = new Date();
    const descrizione = data.description || 'Transazione Generica';
    const importo = parseFloat(data.amount || 0);
    const tipo = data.type || 'ENTRATA';

    let ops = 0;
    let dividendi = 0;
    let tasse = 0;

    if (tipo === 'ENTRATA') {
        ops = importo * 0.54;
        dividendi = importo * 0.30;
        tasse = importo * 0.16;
    } else {
        ops = importo;
    }

    const rawData = timestamp.toISOString() + descrizione + importo.toFixed(2) + tipo;
    const signature = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, rawData);
    const proofHash = "0x" + signature.map(b => (b < 0 ? b + 256 : b).toString(16).padStart(2, '0')).join('').toUpperCase().substring(0, 16);

    sheet.appendRow([
        timestamp,
        descrizione,
        importo.toFixed(2),
        tipo,
        ops.toFixed(2),
        dividendi.toFixed(2),
        tasse.toFixed(2),
        proofHash
    ]);

    return responseJSON({
        status: "success",
        hashProof: proofHash,
        opsAllocated: ops.toFixed(2),
        dividendAllocated: dividendi.toFixed(2),
        taxAllocated: tasse.toFixed(2),
        message: "Transazione registrata con ripartizione 54/30/16"
    });
}

/**
 * ====================================================================
 * 5. AGGIORNAMENTO SYSTEM PROMPT AGENTI NEURALI H24
 * ====================================================================
 */
function gestisciAggiornamentoPrompt(data) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEET_PROMPTS);

    if (!sheet) {
        sheet = ss.insertSheet(CONFIG.SHEET_PROMPTS);
        sheet.appendRow(['TIMESTAMP', 'AGENTE', 'OPERATORE', 'PROMPT TESTO']);
        sheet.getRange("1:1").setFontWeight("bold").setBackground("#B8860B").setFontColor("#FFFFFF");
    }

    const timestamp = new Date();
    const agente = data.agente || 'ALISON_CONCIERGE';
    const operatore = data.operatore || 'CEO GIULIANO CARATELLI';
    const prompt = data.prompt || 'Prompt base';

    sheet.appendRow([timestamp, agente, operatore, prompt]);

    return responseJSON({
        status: "success",
        message: "Prompt per " + agente + " salvato con successo."
    });
}

/**
 * ====================================================================
 * 6. SISTEMA NOTIFICHE EMAIL (DIREZIONE & CANDIDATO)
 * ====================================================================
 */
function inviaNotificaEmailDirezione(nexusCode, nome, email, telefono, ambito, dataPren, oraPren, note, punti) {
    try {
        const oggetto = `🚨 [NUOVA CANDIDATURA ${nexusCode}] - ${nome} (${ambito})`;
        const corpoHtml = `
            <div style="font-family: monospace; background: #090A0D; color: #ffffff; padding: 20px; border-radius: 12px; border: 2px solid #B8860B;">
                <h2 style="color: #D4AF37;">SUPREMA FUTURE X S.R.L. // NOTIFICA CANDIDATURA</h2>
                <p><strong>CODICE NEXUS ID:</strong> <span style="color: #00F0FF;">${nexusCode}</span></p>
                <hr style="border-color: #333;" />
                <p><strong>CANDIDATO:</strong> ${nome}</p>
                <p><strong>EMAIL:</strong> ${email}</p>
                <p><strong>TELEFONO:</strong> ${telefono}</p>
                <p><strong>AMBITO RICHIESTO:</strong> ${ambito}</p>
                <p><strong>SLOT PRENOTATO:</strong> ${dataPren} alle ${oraPren}</p>
                <p><strong>NOTE:</strong> ${note}</p>
                <p><strong>STATUS PUNTI:</strong> ${punti}</p>
                <hr style="border-color: #333;" />
                <p><a href="https://wa.me/${telefono.replace(/[^0-9]/g, '')}?text=Gentile%20${encodeURIComponent(nome)},%20la%20Direzione%20del%20CEO%20Giuliano%20Caratelli%20ha%20ricevuto%20la%20sua%20candidatura%20${nexusCode}" style="background: #25D366; color: white; padding: 10px 15px; text-decoration: none; border-radius: 6px; font-weight: bold;">PARLA SUBITO SU WHATSAPP</a></p>
            </div>
        `;

        MailApp.sendEmail({
            to: CONFIG.CEO_EMAIL,
            subject: oggetto,
            htmlBody: corpoHtml
        });
    } catch (err) {
        Logger.log("Errore invio email direzione: " + err.toString());
    }
}

function inviaEmailConfermaCandidato(nexusCode, nome, email, ambito, punti) {
    try {
        const oggetto = `✓ ACCREDITAMENTO RICEVUTO // SUPREMA GOLD CARD ${nexusCode}`;
        const corpoHtml = `
            <div style="font-family: Arial, sans-serif; background-color: #FDFBF7; color: #12141C; padding: 25px; border-radius: 16px; border: 1px solid #B8860B;">
                <h1 style="color: #B8860B;">SUPREMA FUTURE X S.R.L.</h1>
                <p>Gentile <strong>${nome}</strong>,</p>
                <p>La tua candidatura per <strong>${ambito}</strong> è stata ricevuta ed elaborata con successo dall'Executive Concierge Alison.</p>
                <div style="background: #090A0D; color: white; padding: 15px; border-radius: 10px; font-family: monospace;">
                    <p style="color: #D4AF37; font-size: 16px; margin: 0;">SUPREMA GOLD CARD PHYGITAL</p>
                    <p style="margin: 5px 0;">TITOLARE: ${nome.toUpperCase()}</p>
                    <p style="margin: 5px 0;">CODICE ASSEGNATO: <strong style="color: #00F0FF;">${nexusCode}</strong></p>
                    <p style="margin: 5px 0;">ACCREDITO INIZIALE: ${punti}</p>
                </div>
                <p style="margin-top: 15px;">La Direzione del <strong>CEO GIULIANO CARATELLI</strong> esaminerà la tua richiesta ed effettuerà il riscontro secondo lo slot prenotato.</p>
                <p style="font-size: 11px; color: #777;">Insieme guidiamo il tuo domani..</p>
            </div>
        `;

        MailApp.sendEmail({
            to: email,
            subject: oggetto,
            htmlBody: corpoHtml
        });
    } catch (err) {
        Logger.log("Errore invio email candidato: " + err.toString());
    }
}

/**
 * ====================================================================
 * 7. NOTIFICHE TELEGRAM SMARTPHONE CEO
 * ====================================================================
 */
function inviaNotificaTelegram(nexusCode, nome, telefono, ambito, dataPren, oraPren) {
    try {
        if (!CONFIG.TELEGRAM_BOT_TOKEN || CONFIG.TELEGRAM_BOT_TOKEN.includes('EXAMPLE')) {
            Logger.log("Telegram Bot Token non configurato o di esempio. Chiamata ignorata.");
            return;
        }

        const url = "https://api.telegram.org/bot" + CONFIG.TELEGRAM_BOT_TOKEN + "/sendMessage";
        const testoMessaggio = `👑 *SUPREMA FUTURE X // NUOVA CANDIDATURA*\n\n` +
            `*Codice Nexus:* \`\${nexusCode}\`\n` +
            `*Candidato:* ${nome}\n` +
            `*Telefono:* ${telefono}\n` +
            `*Ambito Richiesto:* ${ambito}\n` +
            `*Slot Prenotato:* ${dataPren} alle ${oraPren}\n\n` +
            `📲 [Apri Chat WhatsApp Diretta](https://wa.me/${telefono.replace(/[^0-9]/g, '')})`;

        const payload = {
            chat_id: CONFIG.TELEGRAM_CHAT_ID,
            text: testoMessaggio,
            parse_mode: 'Markdown',
            disable_web_page_preview: false
        };

        const options = {
            method: 'post',
            contentType: 'application/json',
            payload: JSON.stringify(payload),
            muteHttpExceptions: true
        };

        UrlFetchApp.fetch(url, options);
    } catch (err) {
        Logger.log("Errore invio notifica Telegram: " + err.toString());
    }
}

function inviaNotificaTelegramAssedio(idCorsista, nome, pacchetto) {
    try {
        if (!CONFIG.TELEGRAM_BOT_TOKEN || CONFIG.TELEGRAM_BOT_TOKEN.includes('EXAMPLE')) return;
        const url = "https://api.telegram.org/bot" + CONFIG.TELEGRAM_BOT_TOKEN + "/sendMessage";
        const testo = `⚡ *SUPREMA FUTURE X // ASSEDIO ATTIVATO*\n\n` +
            `*Allievo:* ${nome}\n` +
            `*Codice Identificativo:* \`\${idCorsista}\`\n` +
            `*Pacchetto:* ${pacchetto}\n` +
            `*Stato:* Cartella Drive creata, Master duplicati e accessi attivati.`;

        UrlFetchApp.fetch(url, {
            method: 'post',
            contentType: 'application/json',
            payload: JSON.stringify({ chat_id: CONFIG.TELEGRAM_CHAT_ID, text: testo, parse_mode: 'Markdown' }),
            muteHttpExceptions: true
        });
    } catch (e) {
        Logger.log("Errore invio Telegram Assedio: " + e.toString());
    }
}

/**
 * ====================================================================
 * 8. GESTORI EXIT INTENT, NEWSLETTER & FEEDBACK DIRETTO
 * ====================================================================
 */
function gestisciExitFeedback(data) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Exit_Feedback');
    if (!sheet) {
        sheet = ss.insertSheet('Exit_Feedback');
        sheet.appendRow(['TIMESTAMP', 'EMAIL', 'CORSO / ORIENTAMENTO']);
        sheet.getRange("1:1").setFontWeight("bold").setBackground("#008B99").setFontColor("#FFFFFF");
    }
    sheet.appendRow([new Date(), data.email || 'N/D', data.course || 'EXIT_INTENT']);
    return responseJSON({ status: "success", message: "Exit feedback memorizzato con successo." });
}

function gestisciIscrizioneNewsletter(data) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Iscritti_Newsletter');
    if (!sheet) {
        sheet = ss.insertSheet('Iscritti_Newsletter');
        sheet.appendRow(['TIMESTAMP', 'EMAIL']);
        sheet.getRange("1:1").setFontWeight("bold").setBackground("#B8860B").setFontColor("#FFFFFF");
    }
    sheet.appendRow([new Date(), data.email || 'N/D']);
    return responseJSON({ status: "success", message: "Iscrizione newsletter completata." });
}

function gestisciFeedbackDiretto(data) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Feedback_Direttivo');
    if (!sheet) {
        sheet = ss.insertSheet('Feedback_Direttivo');
        sheet.appendRow(['TIMESTAMP', 'NOME', 'MESSAGGIO']);
        sheet.getRange("1:1").setFontWeight("bold").setBackground("#12141C").setFontColor("#FFFFFF");
    }
    sheet.appendRow([new Date(), data.nome || 'N/D', data.messaggio || 'N/D']);
    return responseJSON({ status: "success", message: "Feedback direttivo archiviato." });
}

/**
 * ====================================================================
 * 9. RECUPERO DATI PER CRM NEXUS E X-BOX ERP (doGet)
 * ====================================================================
 */
function recuperaTuttiILeads() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_LEADS);
    if (!sheet) return responseJSON({ status: "ok", leads: [] });

    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return responseJSON({ status: "ok", leads: [] });

    const leads = [];
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        leads.push({
            timestamp: row[0],
            nexusCode: row[1],
            nome: row[2],
            azienda: row[3],
            email: row[4],
            telefono: row[5],
            ambito: row[6],
            dataPrenotazione: row[7],
            oraPrenotazione: row[8],
            note: row[9],
            punti: row[10],
            status: row[11]
        });
    }

    return responseJSON({ status: "ok", leads: leads });
}

function recuperaMastroFinanziario() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_LEDGER);
    if (!sheet) return responseJSON({ status: "ok", ledger: [] });

    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return responseJSON({ status: "ok", ledger: [] });

    const ledger = [];
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        ledger.push({
            timestamp: row[0],
            descrizione: row[1],
            importo: row[2],
            tipo: row[3],
            operativita: row[4],
            dividendi: row[5],
            tasse: row[6],
            proofHash: row[7]
        });
    }

    return responseJSON({ status: "ok", ledger: ledger });
}

/**
 * ====================================================================
 * 10. MOTORE DI ASSEDIO (Agente Distributore + Provisioning Workspace)
 * ====================================================================
 */
function motoreAssedio(dati) {
    if (!dati || !dati.email || dati.email.indexOf("@") === -1) {
        throw new Error("Indirizzo email dello studente non valido o mancante.");
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    inizializzaDatabaseAssedioSeAssente(ss);
    
    const sheetCorsisti = ss.getSheetByName(CONFIG.SHEET_CORSISTI);
    const nomeStudente = dati.nome || "Nuovo Allievo";
    const emailStudente = dati.email.trim().toLowerCase();
    const pacchetto = dati.pacchetto || "Executive";
    const timestamp = new Date();

    const datiEsistenti = sheetCorsisti.getDataRange().getValues();
    for (let i = 1; i < datiEsistenti.length; i++) {
        if (datiEsistenti[i][2] && datiEsistenti[i][2].toString().toLowerCase() === emailStudente) {
            throw new Error("L'indirizzo " + emailStudente + " risulta già presente nel CRM (ID: " + datiEsistenti[i][0] + ").");
        }
    }

    const idCorsista = "SFX-" + ("000" + Math.max(1, sheetCorsisti.getLastRow())).slice(-3);
    let urlCartella = "DEMO_SANDBOX_DIRECTORY";
    let urlDoc = "", urlSlides = "", urlSheet = "", urlForm = "";

    if (SFX_CONFIG.MASTER_FOLDER_ID && SFX_CONFIG.MASTER_FOLDER_ID !== "INSERISCI_ID_CARTELLA_ROOT_STUDENTI") {
        const parentFolder = DriveApp.getFolderById(SFX_CONFIG.MASTER_FOLDER_ID);
        const cartellaStudente = parentFolder.createFolder("SFX • X-BOX " + nomeStudente + " [" + idCorsista + "]");
        urlCartella = cartellaStudente.getUrl();

        if (SFX_CONFIG.MASTER_DOC_ID && SFX_CONFIG.MASTER_DOC_ID.indexOf("INSERISCI") === -1) {
            const docClonato = DriveApp.getFileById(SFX_CONFIG.MASTER_DOC_ID).makeCopy("Dossier Operativo • " + nomeStudente, cartellaStudente);
            urlDoc = docClonato.getUrl();
        }
        if (SFX_CONFIG.MASTER_SLIDES_ID && SFX_CONFIG.MASTER_SLIDES_ID.indexOf("INSERISCI") === -1) {
            const slidesClonate = DriveApp.getFileById(SFX_CONFIG.MASTER_SLIDES_ID).makeCopy("Pitch Deck & Locandina • " + nomeStudente, cartellaStudente);
            urlSlides = slidesClonate.getUrl();
        }
        if (SFX_CONFIG.MASTER_SHEET_ID && SFX_CONFIG.MASTER_SHEET_ID.indexOf("INSERISCI") === -1) {
            const sheetClonato = DriveApp.getFileById(SFX_CONFIG.MASTER_SHEET_ID).makeCopy("Piano Avanzamento • " + nomeStudente, cartellaStudente);
            urlSheet = sheetClonato.getUrl();
        }
        if (SFX_CONFIG.MASTER_FORM_ID && SFX_CONFIG.MASTER_FORM_ID.indexOf("INSERISCI") === -1) {
            const formClonato = DriveApp.getFileById(SFX_CONFIG.MASTER_FORM_ID).makeCopy("Test Valutazione • " + nomeStudente, cartellaStudente);
            urlForm = formClonato.getUrl();
        }

        cartellaStudente.addEditor(emailStudente);
    }

    sheetCorsisti.appendRow([
        idCorsista,
        nomeStudente,
        emailStudente,
        pacchetto,
        timestamp,
        "Modulo 1: Onboarding",
        timestamp,
        "NO",
        urlCartella,
        "ATTIVO ✓"
    ]);

    const sheetBox2 = ss.getSheetByName(CONFIG.SHEET_BOX2);
    if (sheetBox2) {
        let importoPacchetto = 850;
        if (pacchetto.includes("Executive")) importoPacchetto = 1500;
        if (pacchetto.includes("Gold") || pacchetto.includes("VIP")) importoPacchetto = 2500;

        sheetBox2.appendRow([
            idCorsista,
            nomeStudente,
            "Corsista",
            "SFX-MEM-" + ("000" + sheetCorsisti.getLastRow()).slice(-3),
            "Attivo",
            "Fattura",
            importoPacchetto,
            "Da incassare",
            urlCartella
        ]);
    }

    inviaEmailBenvenutoAssedio(nomeStudente, emailStudente, urlCartella, urlDoc, urlSlides);
    registraLogAttivita(idCorsista, nomeStudente, "ASSEDIO_PROVISIONING", "Ambiente e cartelle generate per pacchetto " + pacchetto);
    inviaNotificaTelegramAssedio(idCorsista, nomeStudente, pacchetto);

    return "✅ Assedio completato con successo per " + nomeStudente + " (" + idCorsista + "). Ambiente configurato.";
}

function inviaEmailBenvenutoAssedio(nome, email, linkDrive, linkDoc, linkSlides) {
    try {
        const corpo = 
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

        GmailApp.sendEmail(email, "SUPREMA FUTURE X • Attivazione Ecosistema & Accessi Workspace", corpo, {
            name: "Presidenza Suprema Future X"
        });
    } catch (e) {
        Logger.log("Errore invio email Assedio: " + e.toString());
    }
}
/**
 * ====================================================================
 * 12. SCHEDA MADRE DEGLI APPUNTAMENTI (Calendar & Google Meet Sync)
 * ====================================================================
 */
function creaNuovoAppuntamento(datiApp) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheetApp = ss.getSheetByName(CONFIG.SHEET_APPUNTAMENTI);
    if (!sheetApp) {
        inizializzaDatabaseAssedioSeAssente(ss);
        sheetApp = ss.getSheetByName(CONFIG.SHEET_APPUNTAMENTI);
    }

    const idApp = "APP-" + ("000" + Math.max(1, sheetApp.getLastRow())).slice(-3);
    const dataOraInizio = new Date(datiApp.dataOraIso);
    const dataOraFine = new Date(dataOraInizio.getTime() + (60 * 60 * 1000));

    const calendario = CalendarApp.getDefaultCalendar();
    const evento = calendario.createEvent(
        "SFX Sessione: " + datiApp.corsista + " [" + datiApp.tipoSessione + "]",
        dataOraInizio,
        dataOraFine,
        {
            description: "Sessione formativa riservata Suprema Future X.\nNote: " + (datiApp.notePreCall || "Nessuna"),
            guests: datiApp.emailCorsista,
            sendInvites: true
        }
    );

    const linkMeet = "https://meet.google.com/new";

    sheetApp.appendRow([
        idApp,
        datiApp.corsista,
        datiApp.tipoSessione,
        dataOraInizio,
        linkMeet,
        "In programma",
        datiApp.notePreCall || "",
        ""
    ]);

    registraLogAttivita(datiApp.corsista, datiApp.corsista, "APPUNTAMENTO_FISSATO", "Sessione fissata per il " + dataOraInizio.toLocaleString('it-IT'));
    return "Appuntamento " + idApp + " registrato e sincronizzato su Calendar.";
}

/**
 * ====================================================================
 * 13. OROLOGIO ESECUTIVO: SUPERVISORE REPORTING AD ALISON (8, 11, 14, 17, 20, 23)
 * ====================================================================
 */
function controllaTurniReport() {
    const ora = new Date().getHours();
    const turni = [8, 11, 14, 17, 20, 23];

    if (turni.indexOf(ora) !== -1) {
        inviaReportSupervisoreAlison(ora);
    }
}

function inviaReportSupervisoreAlison(oraTurno) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetCorsisti = ss.getSheetByName(CONFIG.SHEET_CORSISTI);
    const sheetApp = ss.getSheetByName(CONFIG.SHEET_APPUNTAMENTI);
    
    if (!sheetCorsisti) return;

    const totaleCorsisti = Math.max(0, sheetCorsisti.getLastRow() - 1);
    const datiCorsisti = sheetCorsisti.getDataRange().getValues();

    let corsistiAttivi = 0;
    const richiesteSupporto = [];
    
    for (let i = 1; i < datiCorsisti.length; i++) {
        if (datiCorsisti[i][9] === "ATTIVO ✓") corsistiAttivi++;
        if (datiCorsisti[i][7] === "SI" || datiCorsisti[i][7] === true) {
            richiesteSupporto.push(datiCorsisti[i][1] + " (" + datiCorsisti[i][2] + ")");
        }
    }

    const titolo = (oraTurno === 8) 
        ? "🌅 [X-BOX BRIEFING] APERTURA GIORNATA & RECAP NOTTURNO" 
        : "📊 [X-BOX REPORT] AGGIORNAMENTO CICLO ORE " + oraTurno + ":00";

    let corpo = 
        titolo + "\n" +
        "═══════════════════════════════════════\n" +
        "• Corsisti Monitorati: " + totaleCorsisti + " (Attivi a regime: " + corsistiAttivi + ")\n" +
        "• Alert Assistenza Pendenti: " + (richiesteSupporto.length > 0 ? "⚠️ " + richiesteSupporto.join(", ") : "Nessuna anomalia") + "\n\n";

    if (oraTurno === 8 && sheetApp && sheetApp.getLastRow() > 1) {
        corpo += "AGENDA SESSIONI ODIERNE:\n";
        const oggiStr = new Date().toLocaleDateString('it-IT');
        const appuntamenti = sheetApp.getDataRange().getValues();
        let sessioniOggi = 0;

        for (let k = 1; k < appuntamenti.length; k++) {
            const d = new Date(appuntamenti[k][3]);
            if (d.toLocaleDateString('it-IT') === oggiStr && appuntamenti[k][5] === "In programma") {
                corpo += "  🕒 " + d.toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'}) + " - " + appuntamenti[k][1] + " (" + appuntamenti[k][2] + ")\n";
                sessioniOggi++;
            }
        }
        if (sessioniOggi === 0) corpo += "  Nessun appuntamento in programma per oggi.\n";
    }

    corpo += "\nArchivio dati sincronizzato con File Madre SFX. Nessun intervento CEO richiesto oltre agli alert.";

    if (CONFIG.CEO_EMAIL) {
        GmailApp.sendEmail(CONFIG.CEO_EMAIL, titolo, corpo);
    }

    if (SFX_CONFIG.XBOX_WEBHOOK_URL) {
        try {
            UrlFetchApp.fetch(SFX_CONFIG.XBOX_WEBHOOK_URL, {
                method: "post",
                contentType: "application/json",
                payload: JSON.stringify({ text: corpo })
            });
        } catch (e) {
            Logger.log("Errore invio Webhook Chat: " + e.message);
        }
    }
}

function controlloSentinellaInattivita() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetCorsisti = ss.getSheetByName(CONFIG.SHEET_CORSISTI);
    if (!sheetCorsisti || sheetCorsisti.getLastRow() <= 1) return;

    const dati = sheetCorsisti.getDataRange().getValues();
    const adesso = new Date().getTime();
    const fermiDa48Ore = [];

    for (let i = 1; i < dati.length; i++) {
        const ultimaAttivita = new Date(dati[i][6]).getTime();
        const diffOre = (adesso - ultimaAttivita) / (1000 * 60 * 60);

        if (diffOre >= 48 && dati[i][9] === "ATTIVO ✓") {
            fermiDa48Ore.push(dati[i][1]);
        }
    }

    if (fermiDa48Ore.length > 0) {
        registraLogAttivita("SENTINEL", "SENTINEL", "INATTIVITA_ALLERTA", "Corsisti inattivi > 48h: " + fermiDa48Ore.join(", "));
    }
}

/**
 * ====================================================================
 * 14. GENERATORE UFFICIALE: X-BOX CEO HUB (Box 1, Box 2, Dashboard CEO)
 * ====================================================================
 */
function creaXBoxCEOHub() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    const primaryColor = "#001F3F";     
    const accentCyan   = "#008080";     
    const textWhite    = "#FFFFFF";
    const kpiBg        = "#F4F6F9";     
    const borderColor  = "#D1D5DB";

    function getOrCreateSheet(name, tabColor) {
        let sheet = ss.getSheetByName(name);
        if (!sheet) {
            sheet = ss.insertSheet(name);
        }
        if (tabColor) sheet.setTabColor(tabColor);
        return sheet;
    }

    const sheetBox1 = getOrCreateSheet(CONFIG.SHEET_BOX1, "#0052CC");
    sheetBox1.clear();

    const headersBox1 = [
        "ID File",
        "Nome Documento",
        "Origine",
        "Categoria",
        "URL / Link di Collegamento",
        "Stato",
        "Note e Tag"
    ];

    sheetBox1.getRange(1, 1, 1, headersBox1.length).setValues([headersBox1]);
    const headerBox1Range = sheetBox1.getRange("A1:G1");
    headerBox1Range.setBackground(primaryColor)
        .setFontColor(textWhite)
        .setFontWeight("bold")
        .setAlignment("center", "middle")
        .setWrap(true);
    sheetBox1.setRowHeight(1, 35);

    const sampleBox1 = [
        ["DOC-001", "Manuale Operativo SFX", "Manuale", "Materiale Didattico", "https://drive.google.com/...", "Approvato", "Onboarding team"],
        ["DOC-002", "Verbale CDA Ottobre", "Notebook", "Verbale", "https://drive.google.com/...", "Archiviato", "Governance"],
        ["DOC-003", "Contratto Master Builder", "CRM", "Contratto", "https://drive.google.com/...", "In lavorazione", "Collaboratori"],
        ["DOC-004", "Dispensa Strategia Vendita", "Classroom", "Dispensa", "https://drive.google.com/...", "Archiviato", "Academy SFX"],
        ["DOC-005", "Verbale Allineamento Leader", "Notebook", "Verbale", "https://drive.google.com/...", "Archiviato", "Meeting settimanale"]
    ];
    sheetBox1.getRange(2, 1, sampleBox1.length, headersBox1.length).setValues(sampleBox1);

    sheetBox1.setColumnWidth(1, 90);   
    sheetBox1.setColumnWidth(2, 220);  
    sheetBox1.setColumnWidth(3, 130);  
    sheetBox1.setColumnWidth(4, 160);  
    sheetBox1.setColumnWidth(5, 230);  
    sheetBox1.setColumnWidth(6, 120);  
    sheetBox1.setColumnWidth(7, 200);  

    const ruleOrigine = SpreadsheetApp.newDataValidation()
        .requireValueInList(["Notebook", "Classroom", "CRM", "Manuale"], true).build();
    sheetBox1.getRange("C2:C100").setDataValidation(ruleOrigine);

    const ruleCategoria = SpreadsheetApp.newDataValidation()
        .requireValueInList(["Verbale", "Dispensa", "Contratto", "Materiale Didattico"], true).build();
    sheetBox1.getRange("D2:D100").setDataValidation(ruleCategoria);

    const ruleStatoDoc = SpreadsheetApp.newDataValidation()
        .requireValueInList(["In lavorazione", "Archiviato", "Approvato"], true).build();
    sheetBox1.getRange("F2:F100").setDataValidation(ruleStatoDoc);

    sheetBox1.setFrozenRows(1);

    const sheetBox2 = getOrCreateSheet(CONFIG.SHEET_BOX2, "#00875A");
    sheetBox2.clear();

    const headersBox2 = [
        "ID Anagrafica/Corsista",
        "Nome / Ragione Sociale",
        "Tipo",
        "ID Badge / Codice CRM",
        "Stato CRM",
        "Tipo Documento Finanziario",
        "Importo (€)",
        "Stato Pagamento",
        "Link Scheda CRM"
    ];

    sheetBox2.getRange(1, 1, 1, headersBox2.length).setValues([headersBox2]);
    const headerBox2Range = sheetBox2.getRange("A1:I1");
    headerBox2Range.setBackground(primaryColor)
        .setFontColor(textWhite)
        .setFontWeight("bold")
        .setAlignment("center", "middle")
        .setWrap(true);
    sheetBox2.setRowHeight(1, 35);

    const sampleBox2 = [
        ["CR-001", "Alessandro Conti", "Corsista", "SFX-MEM-003", "Attivo", "Fattura", 1250, "Pagato", "https://crm.suprema..."],
        ["CR-002", "Marco Rossi", "Cliente", "SFX-MEM-004", "Attivo", "Fattura", 850, "Da incassare", "https://crm.suprema..."],
        ["CR-003", "Elena Ferrari", "Corsista", "SFX-MEM-005", "Attivo", "Preventivo", 1500, "In sospeso", "https://crm.suprema..."],
        ["CR-004", "Studio Grafico Nova", "Fornitore", "FORN-001", "Chiuso", "Contratto", 450, "Pagato", "https://crm.suprema..."],
        ["CR-005", "Sara Moretti", "Corsista", "SFX-MEM-006", "In attesa", "Fattura", 950, "Da incassare", "https://crm.suprema..."]
    ];
    sheetBox2.getRange(2, 1, sampleBox2.length, headersBox2.length).setValues(sampleBox2);

    sheetBox2.getRange("G2:G100").setNumberFormat("€#,##0.00");

    sheetBox2.setColumnWidth(1, 150);  
    sheetBox2.setColumnWidth(2, 200);  
    sheetBox2.setColumnWidth(3, 110);  
    sheetBox2.setColumnWidth(4, 150);  
    sheetBox2.setColumnWidth(5, 110);  
    sheetBox2.setColumnWidth(6, 170);  
    sheetBox2.setColumnWidth(7, 120);  
    sheetBox2.setColumnWidth(8, 130);  
    sheetBox2.setColumnWidth(9, 180);  

    const ruleTipoAnag = SpreadsheetApp.newDataValidation()
        .requireValueInList(["Cliente", "Corsista", "Fornitore"], true).build();
    sheetBox2.getRange("C2:C100").setDataValidation(ruleTipoAnag);

    const ruleStatoCRM = SpreadsheetApp.newDataValidation()
        .requireValueInList(["Attivo", "In attesa", "Chiuso"], true).build();
    sheetBox2.getRange("E2:E100").setDataValidation(ruleStatoCRM);

    const ruleDocFin = SpreadsheetApp.newDataValidation()
        .requireValueInList(["Fattura", "Preventivo", "Contratto"], true).build();
    sheetBox2.getRange("F2:F100").setDataValidation(ruleDocFin);

    const rulePagamento = SpreadsheetApp.newDataValidation()
        .requireValueInList(["Pagato", "Da incassare", "In sospeso"], true).build();
    sheetBox2.getRange("H2:H100").setDataValidation(rulePagamento);

    sheetBox2.setFrozenRows(1);

    const sheetDash = getOrCreateSheet(CONFIG.SHEET_DASH, "#FF8B00");
    sheetDash.clear();

    sheetDash.getRange("B2:J2").merge();
    sheetDash.getRange("B2").setValue("X-BOX CEO HUB • QUADRO DI COMANDO ESECUTIVO")
        .setBackground(primaryColor)
        .setFontColor(textWhite)
        .setFontWeight("bold")
        .setFontSize(14)
        .setAlignment("center", "middle");
    sheetDash.setRowHeight(2, 45);

    const kpiCards = [
        { labelRange: "B4:C4", valRange: "B5:C5", label: "💰 TOTALE INCASSATO", formula: '=SUMIF(\'Box 2 - Schede e Finanza\'!H2:H, "Pagato", \'Box 2 - Schede e Finanza\'!G2:G)', format: "€#,##0.00" },
        { labelRange: "D4:E4", valRange: "D5:E5", label: "⏳ DA INCASSARE", formula: '=SUMIF(\'Box 2 - Schede e Finanza\'!H2:H, "Da incassare", \'Box 2 - Schede e Finanza\'!G2:G)', format: "€#,##0.00" },
        { labelRange: "F4:G4", valRange: "F5:G5", label: "🟢 ANAGRAFICHE ATTIVE", formula: '=COUNTIF(\'Box 2 - Schede e Finanza\'!E2:E, "Attivo")', format: "#,##0" },
        { labelRange: "H4:I4", valRange: "H5:I5", label: "📁 FILE ARCHIVIATI", formula: '=COUNTIF(\'Box 1 - File e Risorse\'!F2:F, "Archiviato")', format: "#,##0" }
    ];

    kpiCards.forEach(function(card) {
        sheetDash.getRange(card.labelRange).merge().setValue(card.label)
            .setBackground("#EAECF0")
            .setFontColor("#333333")
            .setFontWeight("bold")
            .setAlignment("center", "middle");

        const valCell = sheetDash.getRange(card.valRange).merge();
        valCell.setFormula(card.formula)
            .setBackground(kpiBg)
            .setFontColor(primaryColor)
            .setFontWeight("bold")
            .setFontSize(14)
            .setAlignment("center", "middle");
        if (card.format) valCell.setNumberFormat(card.format);
    });

    sheetDash.setRowHeight(4, 25);
    sheetDash.setRowHeight(5, 40);

    sheetDash.getRange("B8:E8").merge().setValue("FILE ARCHIVIATI PER ORIGINE")
        .setBackground(primaryColor).setFontColor(textWhite).setFontWeight("bold").setAlignment("center", "middle");
    
    sheetDash.getRange("B9:E9").setValues([["Origine", "In Lavorazione", "Archiviati", "Totale File"]]);
    sheetDash.getRange("B9:E9").setBackground("#D1D5DB").setFontWeight("bold").setAlignment("center", "middle");

    const origini = ["Notebook", "Classroom", "CRM", "Manuale"];
    for (let i = 0; i < origini.length; i++) {
        const row = 10 + i;
        const orig = origini[i];
        sheetDash.getRange(row, 2).setValue(orig).setFontWeight("bold");
        sheetDash.getRange(row, 3).setFormula('=COUNTIFS(\'Box 1 - File e Risorse\'!C2:C, "' + orig + '", \'Box 1 - File e Risorse\'!F2:F, "In lavorazione")');
        sheetDash.getRange(row, 4).setFormula('=COUNTIFS(\'Box 1 - File e Risorse\'!C2:C, "' + orig + '", \'Box 1 - File e Risorse\'!F2:F, "Archiviato")');
        sheetDash.getRange(row, 5).setFormula('=COUNTIF(\'Box 1 - File e Risorse\'!C2:C, "' + orig + '")');
    }
    sheetDash.getRange("B10:E13").setAlignment("center", "middle");

    sheetDash.getRange("B14").setValue("TOTALE").setFontWeight("bold");
    sheetDash.getRange("C14").setFormula('=SUM(C10:C13)');
    sheetDash.getRange("D14").setFormula('=SUM(D10:D13)');
    sheetDash.getRange("E14").setFormula('=SUM(E10:E13)');
    sheetDash.getRange("B14:E14").setBackground("#E5E7EB").setFontWeight("bold").setAlignment("center", "middle");

    sheetDash.getRange("G8:J8").merge().setValue("DETTAGLIO FINANZIARIO PER STATO PAGAMENTO")
        .setBackground(primaryColor).setFontColor(textWhite).setFontWeight("bold").setAlignment("center", "middle");
    
    sheetDash.getRange("G9:J9").setValues([["Stato Pagamento", "Numero Schede", "Importo Totale (€)", "% sul Totale"]]);
    sheetDash.getRange("G9:J9").setBackground("#D1D5DB").setFontWeight("bold").setAlignment("center", "middle");

    const statiPagamento = ["Pagato", "Da incassare", "In sospeso"];
    for (let j = 0; j < statiPagamento.length; j++) {
        const r = 10 + j;
        const st = statiPagamento[j];
        sheetDash.getRange(r, 7).setValue(st).setFontWeight("bold");
        sheetDash.getRange(r, 8).setFormula('=COUNTIF(\'Box 2 - Schede e Finanza\'!H2:H, "' + st + '")');
        sheetDash.getRange(r, 9).setFormula('=SUMIF(\'Box 2 - Schede e Finanza\'!H2:H, "' + st + '", \'Box 2 - Schede e Finanza\'!G2:G)').setNumberFormat("€#,##0.00");
        sheetDash.getRange(r, 10).setFormula('=IF(I13=0, 0, I' + r + '/I13)').setNumberFormat("0.0%");
    }
    sheetDash.getRange("G10:J12").setAlignment("center", "middle");

    sheetDash.getRange("G13").setValue("TOTALE GENERALE").setFontWeight("bold");
    sheetDash.getRange("H13").setFormula('=SUM(H10:H12)');
    sheetDash.getRange("I13").setFormula('=SUM(I10:I12)').setNumberFormat("€#,##0.00");
    sheetDash.getRange("J13").setFormula('=SUM(J10:J12)').setNumberFormat("0.0%");
    sheetDash.getRange("G13:J13").setBackground("#E5E7EB").setFontWeight("bold").setAlignment("center", "middle");

    sheetDash.setColumnWidth(1, 40);
    sheetDash.setColumnWidth(2, 130);
    sheetDash.setColumnWidth(3, 110);
    sheetDash.setColumnWidth(4, 110);
    sheetDash.setColumnWidth(5, 110);
    sheetDash.setColumnWidth(6, 40);
    sheetDash.setColumnWidth(7, 130);
    sheetDash.setColumnWidth(8, 110);
    sheetDash.setColumnWidth(9, 130);
    sheetDash.setColumnWidth(10, 100);

    ss.setActiveSheet(sheetDash);
}

/**
 * ====================================================================
 * 15. INIZIALIZZAZIONE DATABASE DI SUPPORTO & LOGGING
 * ====================================================================
 */
function inizializzaDatabaseAssedioSeAssente(ss) {
    if (!ss.getSheetByName(CONFIG.SHEET_CORSISTI)) {
        const s1 = ss.insertSheet(CONFIG.SHEET_CORSISTI);
        s1.appendRow(["ID", "NOME", "EMAIL", "PACCHETTO", "DATA_CREAZIONE", "MODULO_ATTUALE", "ULTIMA_INTERAZIONE", "SUPPORTO_PENDENTE", "LINK_DRIVE", "STATO"]);
        s1.getRange("1:1").setFontWeight("bold").setBackground("#001F3F").setFontColor("#FFFFFF");
    }
    if (!ss.getSheetByName(CONFIG.SHEET_APPUNTAMENTI)) {
        const s2 = ss.insertSheet(CONFIG.SHEET_APPUNTAMENTI);
        s2.appendRow(["ID_APP", "CORSISTA", "TIPO_SESSIONE", "DATA_ORA", "LINK_MEET", "STATO", "NOTE_PREP", "REPORT_POST"]);
        s2.getRange("1:1").setFontWeight("bold").setBackground("#001F3F").setFontColor("#FFFFFF");
    }
    if (!ss.getSheetByName(CONFIG.SHEET_LOG_ATTIVITA)) {
        const s3 = ss.insertSheet(CONFIG.SHEET_LOG_ATTIVITA);
        s3.appendRow(["TIMESTAMP", "ID_UTENTE", "NOME", "TIPO_AZIONE", "DETTAGLIO"]);
        s3.getRange("1:1").setFontWeight("bold").setBackground("#12141C").setFontColor("#FFFFFF");
    }
}

function registraLogAttivita(idUtente, nome, tipoAzione, dettaglio) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheetLog = ss.getSheetByName(CONFIG.SHEET_LOG_ATTIVITA);
    if (!sheetLog) {
        sheetLog = ss.insertSheet(CONFIG.SHEET_LOG_ATTIVITA);
        sheetLog.appendRow(["TIMESTAMP", "ID_UTENTE", "NOME", "TIPO_AZIONE", "DETTAGLIO"]);
    }
    sheetLog.appendRow([new Date(), idUtente, nome, tipoAzione, dettaglio]);
}

function responseJSON(data) {
    return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ====================================================================
 * 16. FUNZIONE DI INIZIALIZZAZIONE MASTER TOTALE
 * ====================================================================
 */
function inizializzaEcosistemaCompletoSFX() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    inizializzaCredenzialiSicure(); // NUOVO: Imposta le password e l'IBAN in memoria invisibile
    inizializzaDatabaseAssedioSeAssente(ss);
    creaXBoxCEOHub();
    
    Logger.log("✅ Ecosistema SFX configurato al 100%. Sicurezza Zero-Plaintext Attiva.");
}
