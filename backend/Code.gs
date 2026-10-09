/**
 * ====================================================================
 * SUPREMA FUTURE X S.R.L. // GOVERNANCE BACKEND ENGINE V35 (Code.gs)
 * GOVERNANCE: CEO GIULIANO CARATELLI
 * PROTOCOLLO: EAL6+ SOVRANO // REAL-TIME WEBHOOK & LEDGER
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
    SHEET_PROMPTS: 'Prompt_Neurali'
};

/**
 * 1. ENTRY POINT HTTP POST (INCOMING WEBHOOKS & DATA INGESTION)
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
        } else {
            return responseJSON({ status: "error", message: "Azione non riconosciuta: " + action });
        }
    } catch (err) {
        return responseJSON({ status: "error", error: err.toString() });
    }
}

/**
 * 2. ENTRY POINT HTTP GET (DATA RETRIEVAL & HEALTH CHECK PING)
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
            return responseJSON({ status: "ok", service: "Suprema Future X Governance Webhook Engine" });
        }
    } catch (err) {
        return responseJSON({ status: "error", error: err.toString() });
    }
}

/**
 * 3. GESTORE INGESTION CANDIDATURE & GENERAZIONE CODICE ID (CEOSFX0002+)
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

    // Calcolo progressivo automatico a partire da CEOSFX0002 (CEOSFX0001 e' riservato esclusivamente al CEO Giuliano Caratelli)
    const lastRow = sheet.getLastRow();
    const progressivo = Math.max(2, lastRow); // Garantisce partenza da 2
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
    
    // Assegnazione punti in base al percorso richiesto
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

    // Dispatch triplo canale notifiche (Email + Telegram + WhatsApp)
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
 * 4. GESTORE MASTRO FINANZIARIO & SPLIT STATUTARIO 54/30/16
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

    // Calcolo firma SHA-256 per l'integrita del Mastro EAL6+
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
 * 5. AGGIORNAMENTO SYSTEM PROMPT AGENTI NEURALI H24
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
 * 6. SISTEMA NOTIFICHE EMAIL (DIREZIONE & CANDIDATO)
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
}/**
 * 7. NOTIFICA TELEGRAM BOT IN TEMPO REALE SULLO SMARTPHONE DEL CEO
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

/**
 * 8. GESTORI EXIT INTENT, NEWSLETTER & FEEDBACK DIRETTO
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
 * 9. FUNZIONI DI RECUPERO DATI PER CRM NEXUS E X-BOX ERP
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
 * 10. HELPER UTILITY RESPONSE JSON
 */
function responseJSON(data) {
    return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}
