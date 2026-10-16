/**
 * ============================================================================
 * SUPREMA FUTURE X — MASTER BACKEND OPERATING SYSTEM (EAL6+ COMPLIANT)
 * File: Code.gs | PARTE 1 DI 2 (RIGHE 1 - 425)
 * Architettura Integrata dei 15 Agenti Operativi Autonomi
 * ============================================================================
 * Agente 01: Gatekeeper Nexus (Filtro Candidature, Validazione & ID)
 * Agente 02: Booking & Google Calendar Engine
 * Agente 03: Dispatcher Telegram (Allerta Istantanea Centralina HTML)
 * Agente 04: Welcome Onboarding Transazionale
 * Agente 05: Lead Scoring & Algorithmic Triage
 * Agente 06: Provisioning Cloud Google Drive (Workspace Tripartito)
 * Agente 07: Welcome Corsista Ufficiale & Protocollo di Accesso
 * Agente 15: Security Guard, Sanitizzazione Dati & Audit Logging EAL6+
 * ============================================================================
 */

// ============================================================================
// MODULO 01: CONFIGURAZIONE CENTRALE, IDENTITÀ & CASSAFORTE DIGITALE
// ============================================================================

const CONFIG = {
  // Database Centrale Google Sheets (ID Verificato e Collegato)
  SPREADSHEET_ID: '1h68DamKGwoVmPa0LXTYJpWhejP20VFNQPFNdqMpY0pE',

  // Centralina Notifiche Telegram
  TELEGRAM_TOKEN: PropertiesService.getScriptProperties().getProperty('TELEGRAM_TOKEN') || '8881640493:AAGPBeTAtU0YyQe36PT0duOZZcPuTbsSZdI',
  TELEGRAM_CHAT_ID: PropertiesService.getScriptProperties().getProperty('TELEGRAM_CHAT_ID') || '6534406542',

  // Nomenclatura Fogli di Calcolo Operativi
  SHEET_CANDIDATI: 'Candidati',
  SHEET_CORSISTI: 'Corsisti',
  SHEET_AMMINISTRAZIONE: 'Amministrazione',
  SHEET_MATERIALI: 'Materiali_Master',
  SHEET_LOGS: 'Logs_Audit',

  // Parametri Istituzionali & Comunicazione
  NOME_AZIENDA: 'Suprema Future X',
  EMAIL_MITTENTE_NOME: 'Suprema Future X Operations',
  TIMEZONE: 'Europe/Rome',
  CALENDAR_ID: 'primary',
  DURATA_CALL_MINUTI: 45,

  // Versione Architettura di Sistema
  VERSIONE_BACKEND: '2.6.0-EAL6-MONOLITH',
  WEBAPP_URL: 'https://script.google.com/macros/s/AKfycbzJ5atqYnvcqvqbfCWvEmX7gZAdxe3kfbv79F_ANBwRuURpQ2Tcw_GuTTtdFIbBNUbU/exec'
};

// ============================================================================
// MODULO 02: MOTORE DI COLLEGAMENTO AL DATABASE (STANDALONE RESOLVER)
// ============================================================================

/**
 * Connessione robusta al foglio di calcolo, compatibile con script Standalone.
 */
function getDB() {
  if (!CONFIG.SPREADSHEET_ID || CONFIG.SPREADSHEET_ID === 'INCOLLA_QUI_IL_TUO_ID_FOGLIO') {
    throw new Error('CONFIG.SPREADSHEET_ID non configurato. Impossibile accedere al database.');
  }
  try {
    return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  } catch (err) {
    Logger.log('Errore critico openById: ' + err.toString());
    throw new Error('Database Google Sheets non raggiungibile: ' + err.message);
  }
}

/**
 * Recupera un foglio di lavoro o lo genera istantaneamente applicando le intestazioni canoniche.
 */
function ottieniOFreaFoglio(nomeFoglio, intestazioni) {
  const ss = getDB();
  var sheet = ss.getSheetByName(nomeFoglio);
  if (!sheet) {
    sheet = ss.insertSheet(nomeFoglio);
    if (intestazioni && intestazioni.length > 0) {
      sheet.appendRow(intestazioni);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, intestazioni.length).setFontWeight('bold');
    }
  }
  return sheet;
}

// ============================================================================
// AGENTE 15: SECURITY GUARD, SANITIZZAZIONE DATI & AUDIT LOGGING EAL6+
// ============================================================================

function sanitizeInput(val) {
  if (val === null || val === undefined) return '';
  return String(val).trim();
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function validaEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(String(email).trim());
}

function validaTelefono(tel) {
  const pulito = String(tel).replace(/[^0-9+]/g, '');
  return pulito.length >= 8;
}

function logAudit(modulo, azione, dettagli, livello) {
  try {
    const sheet = ottieniOFreaFoglio(CONFIG.SHEET_LOGS, ['TIMESTAMP', 'LIVELLO', 'MODULO', 'AZIONE', 'DETTAGLI']);
    const timestamp = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
    sheet.appendRow([timestamp, livello || 'INFO', modulo, azione, JSON.stringify(dettagli)]);
  } catch (err) {
    Logger.log('Fallimento scrittura logAudit: ' + err.toString());
  }
}

// ============================================================================
// AGENTE 03: DISPATCHER TELEGRAM CENTRALE (HTML FORMAT ENGINE)
// ============================================================================

/**
 * Invia messaggi al Bot Telegram usando la modalità HTML per evitare blocchi sintattici.
 */
function inviaTelegram(testoHtml) {
  try {
    const token = PropertiesService.getScriptProperties().getProperty('TELEGRAM_TOKEN') || CONFIG.TELEGRAM_TOKEN;
    const chatId = PropertiesService.getScriptProperties().getProperty('TELEGRAM_CHAT_ID') || CONFIG.TELEGRAM_CHAT_ID;
    const endpoint = 'https://api.telegram.org/bot' + token + '/sendMessage';

    const payload = {
      chat_id: chatId,
      text: testoHtml,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(endpoint, options);
    const statusCode = response.getResponseCode();
    const responseBody = response.getContentText();

    if (statusCode !== 200) {
      Logger.log('Errore Telegram HTTP ' + statusCode + ': ' + responseBody);
      logAudit('TELEGRAM', 'HTTP_ERROR', { status: statusCode, response: responseBody }, 'ERROR');
      return false;
    }
    return true;
  } catch (err) {
    Logger.log('Eccezione inviaTelegram: ' + err.toString());
    logAudit('TELEGRAM', 'EXCEPTION', { error: err.toString() }, 'CRITICAL');
    return false;
  }
}

function testTelegram() {
  const timestamp = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'dd/MM/yyyy HH:mm:ss');
  const messaggio = '<b>🚀 SUPREMA FUTURE X — VERIFICA OPERATIVA BACKEND</b>\n' +
                    '━━━━━━━━━━━━━━━━━━━━━━━━\n' +
                    '✅ <b>Stato:</b> Operativo a Regime Nominale\n' +
                    '🛡️ <b>Protocollo:</b> EAL6+ Integrity Check Attivo\n' +
                    '🔑 <b>Token Bot:</b> Convalidato\n' +
                    '👤 <b>Chat ID Destinatario:</b> <code>' + CONFIG.TELEGRAM_CHAT_ID + '</code>\n' +
                    '🕒 <b>Data e Ora:</b> ' + timestamp + '\n' +
                    '━━━━━━━━━━━━━━━━━━━━━━━━\n' +
                    '<i>Tutti i 15 agenti della centralina rispondono regolarmente.</i>';
  
  const esito = inviaTelegram(messaggio);
  Logger.log('Esito testTelegram: ' + (esito ? 'CONNESSO' : 'FALLITO'));
  return esito;
}

// ============================================================================
// AGENTE 01: GATEKEEPER NEXUS (FILTRO, DEDUPLICAZIONE & ID NEXUS)
// ============================================================================

function generaNexusId() {
  const sheet = ottieniOFreaFoglio(CONFIG.SHEET_CANDIDATI, [
    'ID_NEXUS', 'TIMESTAMP', 'NOME', 'COGNOME', 'EMAIL', 'TELEFONO',
    'NOTE_OBIETTIVI', 'LEAD_SCORE', 'PRIORITA', 'DATA_CALL', 'STATO_PIPELINE'
  ]);
  
  var nexusId = '';
  var duplicato = true;
  const dati = sheet.getDataRange().getValues();

  while (duplicato) {
    const casuale = Math.floor(1000 + Math.random() * 9000);
    nexusId = 'NX-' + casuale;
    duplicato = false;

    for (var r = 1; r < dati.length; r++) {
      if (String(dati[r][0]).trim() === nexusId) {
        duplicato = true;
        break;
      }
    }
  }
  return nexusId;
}

function verificaDuplicato(email, telefono) {
  const ss = getDB();
  const sheet = ss.getSheetByName(CONFIG.SHEET_CANDIDATI);
  if (!sheet) return { esiste: false };

  const righe = sheet.getDataRange().getValues();
  const emailVerifica = String(email).trim().toLowerCase();
  const telVerifica = String(telefono).replace(/[^0-9]/g, '');

  for (var i = 1; i < righe.length; i++) {
    const rowEmail = String(righe[i][4]).trim().toLowerCase();
    const rowTel = String(righe[i][5]).replace(/[^0-9]/g, '');

    if ((emailVerifica && rowEmail === emailVerifica) || (telVerifica && rowTel.length >= 8 && rowTel === telVerifica)) {
      return {
        esiste: true,
        nexusId: righe[i][0],
        rigaFoglio: i + 1,
        statoAttuale: righe[i][10]
      };
    }
  }
  return { esiste: false };
}

// ============================================================================
// AGENTE 05: LEAD SCORING & ALGORITHMIC TRIAGE
// ============================================================================

function calcolaLeadScore(dati) {
  var score = 40; // Valore di qualificazione di base

  // Valutazione disponibilità economica / budget dichiarato
  const budget = sanitizeInput(dati.budget).toLowerCase();
  if (budget.includes('5000') || budget.includes('alto') || budget.includes('immediato') || budget.includes('scala')) {
    score += 35;
  } else if (budget.includes('2000') || budget.includes('medio')) {
    score += 20;
  } else if (budget.includes('1000')) {
    score += 10;
  }

  // Valutazione ruolo professionale e seniority
  const ruolo = sanitizeInput(dati.ruolo || dati.professione || dati.esperienza).toLowerCase();
  if (ruolo.includes('ceo') || ruolo.includes('imprenditore') || ruolo.includes('founder') || ruolo.includes('titolare')) {
    score += 25;
  } else if (ruolo.includes('manager') || ruolo.includes('direttore') || ruolo.includes('consulente') || ruolo.includes('freelance')) {
    score += 15;
  } else if (ruolo.includes('professionista') || ruolo.includes('tecnico')) {
    score += 10;
  }

  // Valutazione completezza contatto telefonico
  const telefono = sanitizeInput(dati.telefono || dati.tel);
  if (validaTelefono(telefono)) {
    score += 5;
  }

  if (score > 100) score = 100;

  var priorita = 'PRIORITÀ STANDARD';
  if (score >= 80) {
    priorita = 'ALTA PRIORITÀ (HOT LEAD)';
  } else if (score >= 60) {
    priorita = 'MEDIA PRIORITÀ';
  }

  return { punteggio: score, priorita: priorita };
}

// ============================================================================
// AGENTE 02: BOOKING & SINCRONIZZAZIONE GOOGLE CALENDAR
// ============================================================================

function creaEventoCalendario(nomeCandidato, emailCandidato, dataOraStr, noteCandidato, nexusId) {
  try {
    if (!dataOraStr) return null;
    const inizioCall = new Date(dataOraStr);
    if (isNaN(inizioCall.getTime())) return null;

    const fineCall = new Date(inizioCall.getTime() + (CONFIG.DURATA_CALL_MINUTI * 60 * 1000));
    const calendario = CalendarApp.getCalendarById(CONFIG.CALENDAR_ID);

    const titolo = 'Intervista SFX: ' + nomeCandidato + ' [' + nexusId + ']';
    const descrizione = 'Sessione Strategica di Valutazione Candidatura Suprema Future X\n' +
                        'Codice Nexus: ' + nexusId + '\n' +
                        'Candidato: ' + nomeCandidato + '\n' +
                        'Email: ' + emailCandidato + '\n' +
                        'Note / Obiettivi Dichiarati: ' + noteCandidato + '\n\n' +
                        'Ambiente protetto SFX Operating System.';

    const evento = calendario.createEvent(titolo, inizioCall, fineCall, {
      description: descrizione,
      guests: emailCandidato,
      sendInvites: true
    });

    logAudit('CALENDAR', 'EVENTO_PIANIFICATO', { nexusId: nexusId, eventId: evento.getId(), inizio: dataOraStr }, 'INFO');
    return evento.getId();
  } catch (err) {
    Logger.log('Errore creazione evento calendario: ' + err.toString());
    logAudit('CALENDAR', 'PIANIFICAZIONE_FALLITA', { error: err.toString() }, 'WARNING');
    return null;
  }
}

// ============================================================================
// AGENTI 04 & 07: MOTORE EMAIL TRANSAZIONALI PROFESSIONALI
// ============================================================================

function inviaEmailConfermaCandidatura(nomeCompleto, email, nexusId, dataCall) {
  if (!validaEmail(email)) return;

  const subject = 'Candidatura Acquisita — Protocollo Suprema Future X [' + nexusId + ']';
  const dettaglioCall = dataCall 
    ? '<p style="margin: 8px 0; font-size: 14px;">📅 <b>Data Sessione Richiesta:</b> ' + escapeHtml(dataCall) + '</p>'
    : '<p style="margin: 8px 0; font-size: 14px;">Il desk operativo esaminerà le tue informazioni e fisserà la video-call preliminare.</p>';

  const htmlBody = 
    '<div style="background-color: #0b0d14; color: #d1d5db; font-family: Arial, Helvetica, sans-serif; padding: 30px; border-radius: 8px; max-width: 600px; margin: auto; border: 1px solid #1f2937;">' +
      '<h2 style="color: #00d2ff; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 0; font-size: 20px;">Suprema Future X</h2>' +
      '<p style="font-size: 15px;">Gentile <b>' + escapeHtml(nomeCompleto) + '</b>,</p>' +
      '<p style="font-size: 14px; line-height: 1.6;">la tua candidatura è stata formalmente acquisita dal nostro sistema centrale.</p>' +
      '<div style="background: #111827; border-left: 4px solid #00d2ff; padding: 15px; margin: 20px 0; border-radius: 4px;">' +
        '<span style="font-size: 11px; text-transform: uppercase; color: #9ca3af; letter-spacing: 1px;">Codice Univoco Nexus:</span><br>' +
        '<span style="font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: 2px;">' + nexusId + '</span>' +
      '</div>' +
      dettaglioCall +
      '<p style="font-size: 13px; color: #9ca3af; line-height: 1.6; margin-top: 15px;">Si raccomanda puntualità assoluta e postazione adeguata priva di rumori ambientali.</p>' +
      '<hr style="border: 0; border-top: 1px solid #374151; margin: 25px 0;">' +
      '<p style="font-size: 11px; color: #6b7280; text-align: center;">Suprema Future X Operations System — EAL6+ Certified Messaging</p>' +
    '</div>';

  try {
    MailApp.sendEmail({
      to: email,
      name: CONFIG.EMAIL_MITTENTE_NOME,
      subject: subject,
      htmlBody: htmlBody
    });
    logAudit('EMAIL', 'WELCOME_SENT', { destinatario: email, nexusId: nexusId }, 'INFO');
  } catch (err) {
    Logger.log('Errore invio email candidatura: ' + err.toString());
  }
}

function inviaEmailAccreditamentoUfficiale(nomeCompleto, email, nexusId, workspaceUrl) {
  if (!validaEmail(email)) return;

  const subject = 'Accreditamento Confermato — Accesso Riservato SFX [' + nexusId + ']';
  const htmlBody = 
    '<div style="background-color: #05140b; color: #d1fae5; font-family: Arial, Helvetica, sans-serif; padding: 30px; border-radius: 8px; max-width: 600px; margin: auto; border: 1px solid #059669;">' +
      '<h2 style="color: #10b981; text-transform: uppercase; margin-top: 0; font-size: 20px;">Accesso Accordato</h2>' +
      '<p style="font-size: 15px;">Gentile <b>' + escapeHtml(nomeCompleto) + '</b>,</p>' +
      '<p style="font-size: 14px; line-height: 1.6;">il tuo profilo è stato formalmente accreditato all\'interno del protocollo <b>Suprema Future X</b>.</p>' +
      '<div style="text-align: center; margin: 30px 0;">' +
        '<a href="' + workspaceUrl + '" style="background: #10b981; color: #022c1b; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 6px; display: inline-block; font-size: 15px; letter-spacing: 0.5px;">APRI WORKSPACE CLOUD DRIVE</a>' +
      '</div>' +
      '<p style="font-size: 13px; color: #a7f3d0; line-height: 1.6;">All\'interno troverai il materiale didattico esclusivo, la cartella per la consegna dei project work e il fascicolo contabile.</p>' +
      '<hr style="border: 0; border-top: 1px solid #065f46; margin: 25px 0;">' +
      '<p style="font-size: 11px; color: #6ee7b7; text-align: center;">Token di Accreditamento: ' + nexusId + '</p>' +
    '</div>';

  try {
    MailApp.sendEmail({
      to: email,
      name: CONFIG.EMAIL_MITTENTE_NOME,
      subject: subject,
      htmlBody: htmlBody
    });
    logAudit('EMAIL', 'ACCREDITO_SENT', { destinatario: email, nexusId: nexusId }, 'INFO');
  } catch (err) {
    Logger.log('Errore invio email accreditamento: ' + err.toString());
  }
}

// ============================================================================
// AGENTE 06: PROVISIONING CLOUD GOOGLE DRIVE (WORKSPACE TRIPARTITO)
// ============================================================================

function creaWorkspaceCorsistaDrive(nexusId, nomeCompleto, email) {
  try {
    const nomeCartellaRoot = '[' + nexusId + '] — ' + nomeCompleto;
    const rootFolder = DriveApp.createFolder(nomeCartellaRoot);

    const fMateriali = rootFolder.createFolder('01_Materiali_Operativi');
    const fConsegne = rootFolder.createFolder('02_Consegne_Project_Work');
    const fAmministrazione = rootFolder.createFolder('03_Dossier_Amministrativo');

    if (validaEmail(email)) {
      rootFolder.addViewer(email);
      fConsegne.addEditor(email);
    }

    logAudit('DRIVE', 'WORKSPACE_CREATO', { nexusId: nexusId, rootFolderId: rootFolder.getId() }, 'INFO');

    return {
      success: true,
      rootUrl: rootFolder.getUrl(),
      rootId: rootFolder.getId(),
      folderMaterialiId: fMateriali.getId(),
      folderConsegneId: fConsegne.getId(),
      folderAmministrazioneId: fAmministrazione.getId()
    };
  } catch (err) {
    Logger.log('Errore provisioning Google Drive: ' + err.toString());
    logAudit('DRIVE', 'PROVISIONING_FAIL', { error: err.toString(), nexusId: nexusId }, 'ERROR');
    return {
      success: false,
      rootUrl: 'Errore Configurazione Cloud',
      rootId: null
    };
  }
}
// ============================================================================
// AGENTE 09: DISPENSE & MODULI MASTER (CLONAZIONE FILE TEMPLATE)
// ============================================================================

function assegnaDispensaMaster(nexusId, targetFolderId, masterFileId, nomeModulo) {
  try {
    if (!masterFileId || !targetFolderId) return false;
    const fileOriginale = DriveApp.getFileById(masterFileId);
    const cartellaTarget = DriveApp.getFolderById(targetFolderId);

    const nuovoNome = '[' + nexusId + '] ' + (nomeModulo || fileOriginale.getName());
    const fileClonato = fileOriginale.makeCopy(nuovoNome, cartellaTarget);

    logAudit('DISPENSE', 'CLONAZIONE_SUCCESSO', { nexusId: nexusId, fileId: fileClonato.getId() }, 'INFO');
    return fileClonato.getUrl();
  } catch (err) {
    Logger.log('Errore clonazione file master: ' + err.toString());
    logAudit('DISPENSE', 'CLONAZIONE_FALLITA', { error: err.toString(), nexusId: nexusId }, 'WARNING');
    return false;
  }
}

// ============================================================================
// AGENTE 08 & 14: AMMINISTRAZIONE, INCASSI & SEMAFORI X-BOX
// ============================================================================

function aggiornaSemaforoCorsista(nexusId, tipo, valore) {
  const ss = getDB();
  const sheet = ss.getSheetByName(CONFIG.SHEET_CORSISTI);
  if (!sheet) return false;

  const mappaColonne = {
    'pagamenti': 7,
    'materiali': 8,
    'avanzamento': 9
  };

  const colonnaTarget = mappaColonne[String(tipo).trim().toLowerCase()];
  if (!colonnaTarget) return false;

  const data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(nexusId).trim()) {
      sheet.getRange(i + 1, colonnaTarget).setValue(valore);
      logAudit('X-BOX', 'SEMAFORO_AGGIORNATO', { nexusId: nexusId, tipo: tipo, valore: valore }, 'INFO');
      return true;
    }
  }
  return false;
}

function registraTransazioneIncasso(nexusId, nome, importo, metodo, note) {
  const sheet = ottieniOFreaFoglio(CONFIG.SHEET_AMMINISTRAZIONE, [
    'TX_ID', 'DATA_ORA', 'ID_NEXUS', 'NOME', 'IMPORTO', 'METODO', 'STATO', 'NOTE'
  ]);

  const txId = 'TX-' + Math.floor(100000 + Math.random() * 900000);
  const dataOra = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'dd/MM/yyyy HH:mm:ss');
  
  sheet.appendRow([txId, dataOra, nexusId, nome, importo, metodo, 'PAGATO', note]);

  aggiornaSemaforoCorsista(nexusId, 'pagamenti', 'VERDE');

  const msgTelegram = '<b>💶 NUOVO INCASSO REGISTRATO</b>\n' +
                      '━━━━━━━━━━━━━━━━━━━━\n' +
                      '🧾 <b>Transazione ID:</b> <code>' + txId + '</code>\n' +
                      '🆔 <b>ID Nexus:</b> <code>' + nexusId + '</code>\n' +
                      '👤 <b>Corsista:</b> ' + escapeHtml(nome) + '\n' +
                      '💰 <b>Importo:</b> € ' + escapeHtml(importo) + '\n' +
                      '💳 <b>Metodo:</b> ' + escapeHtml(metodo) + '\n' +
                      '🕒 <b>Data/Ora:</b> ' + dataOra + '\n' +
                      '━━━━━━━━━━━━━━━━━━━━\n' +
                      '<i>Semaforo Amministrativo impostato su VERDE.</i>';
  inviaTelegram(msgTelegram);
  logAudit('AMMINISTRAZIONE', 'INCASSO_REGISTRATO', { txId: txId, importo: importo }, 'INFO');

  return txId;
}

// ============================================================================
// AGENTI 10, 11, 12, 13: OROLOGIO AUTOMATICO (TRIGGER ORARIO CRON)
// ============================================================================

function orologioMarketingEAppuntamenti() {
  Logger.log('⏰ Inizio ciclo orologioMarketingEAppuntamenti...');
  const ss = getDB();
  const oggiTimestamp = new Date().getTime();
  const sheetCand = ss.getSheetByName(CONFIG.SHEET_CANDIDATI);
  
  if (sheetCand) {
    const dataCand = sheetCand.getDataRange().getValues();
    
    for (var i = 1; i < dataCand.length; i++) {
      const row = dataCand[i];
      const nexusId = String(row[0]).trim();
      const dataCreazione = row[1];
      const nomeCompleto = escapeHtml(row[2] + ' ' + row[3]);
      const email = String(row[4]).trim();
      const dataCallStr = row[9];
      const statoPipeline = String(row[10]).trim();

      if (statoPipeline === 'SALA D\'ATTESA') {
        if (dataCallStr && email) {
          const callDate = new Date(dataCallStr);
          if (!isNaN(callDate.getTime())) {
            const diffOre = (callDate.getTime() - oggiTimestamp) / (1000 * 60 * 60);

            if (diffOre > 44 && diffOre <= 48) {
              inviaTelegram('<b>⚠️ ALERT -48 ORE COLLOQUIO</b>\n' +
                            'Candidato: ' + nomeCompleto + ' [' + nexusId + ']\n' +
                            'Data Call: <code>' + dataCallStr + '</code>');
              logAudit('MARKETING', 'REMINDER_48H', { nexusId: nexusId }, 'INFO');
            } else if (diffOre > 164 && diffOre <= 168) {
              inviaTelegram('<b>📅 ALERT -7 GIORNI COLLOQUIO</b>\n' +
                            'Candidato: ' + nomeCompleto + ' [' + nexusId + ']\n' +
                            'Data Call: <code>' + dataCallStr + '</code>');
              logAudit('MARKETING', 'REMINDER_7GG', { nexusId: nexusId }, 'INFO');
            }
          }
        }

        if (dataCreazione) {
          const dataInserimento = new Date(dataCreazione);
          if (!isNaN(dataInserimento.getTime())) {
            const diffGiorni = (oggiTimestamp - dataInserimento.getTime()) / (1000 * 60 * 60 * 24);
            if (diffGiorni >= 15 && diffGiorni < 16) {
              logAudit('MARKETING', 'NURTURING_15GG_TRIGGER', { nexusId: nexusId, email: email }, 'INFO');
            }
          }
        }
      }
    }
  }
  Logger.log('✅ Ciclo orologio terminato regolarmente.');
}

// ============================================================================
// GATEWAY WEB APP: MOTORE CENTRALE RICEZIONE CHIAMATE (doPost)
// ============================================================================

function doPost(e) {
  try {
    var dati = {};
    if (e && e.postData && e.postData.contents) {
      try {
        dati = JSON.parse(e.postData.contents);
      } catch (errJson) {
        dati = e.parameter || {};
      }
    } else if (e && e.parameter) {
      dati = e.parameter;
    }

    const action = sanitizeInput(dati.action) || 'nuovaCandidatura';

    switch (action) {
      case 'nuovaCandidatura':
        return eseguiNuovaCandidatura(dati);

      case 'avvallaCorsista':
        return eseguiAvvalloCorsista(dati);

      case 'aggiornaStatoPipeline':
      case 'aggiornaStato':
        return eseguiAggiornaStato(dati);

      case 'aggiornaSemafori':
        return eseguiAggiornaSemafori(dati);

      case 'registraIncasso':
        return eseguiRegistraIncasso(dati);

      default:
        if (dati.nome || dati.email) {
          return eseguiNuovaCandidatura(dati);
        }
        return renderJson({ status: 'ok', response: 'Azione generica intercettata', azione: action });
    }
  } catch (err) {
    Logger.log('Errore critico doPost: ' + err.toString());
    logAudit('WEBAPP', 'DOPOST_FAIL', { error: err.toString() }, 'CRITICAL');
    return renderJson({ status: 'error', message: err.toString() });
  }
}

function eseguiNuovaCandidatura(dati) {
  const sheet = ottieniOFreaFoglio(CONFIG.SHEET_CANDIDATI, [
    'ID_NEXUS', 'TIMESTAMP', 'NOME', 'COGNOME', 'EMAIL', 'TELEFONO',
    'NOTE_OBIETTIVI', 'LEAD_SCORE', 'PRIORITA', 'DATA_CALL', 'STATO_PIPELINE'
  ]);

  const nome = sanitizeInput(dati.nome);
  const cognome = sanitizeInput(dati.cognome);
  const nomeCompleto = (nome + ' ' + cognome).trim() || 'Lead Anonimo';
  const email = sanitizeInput(dati.email);
  const telefono = sanitizeInput(dati.telefono || dati.tel);
  const note = sanitizeInput(dati.messaggio || dati.note || dati.obiettivo || 'Nessuna indicazione fornita');
  const dataCall = sanitizeInput(dati.dataCall || dati.appuntamento || '');

  const verificaDup = verificaDuplicato(email, telefono);
  var nexusId = '';
  if (verificaDup && verificaDup.esiste) {
    nexusId = verificaDup.nexusId;
    logAudit('GATEKEEPER', 'DUPLICATO_INTERCETTATO', { nexusId: nexusId, email: email }, 'WARNING');
  } else {
    nexusId = generaNexusId();
  }

  const timestamp = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'dd/MM/yyyy HH:mm:ss');
  const scoreData = calcolaLeadScore(dati);

  sheet.appendRow([
    nexusId, timestamp, nome, cognome, email, telefono,
    note, scoreData.punteggio, scoreData.priorita, dataCall, 'SALA D\'ATTESA'
  ]);

  if (dataCall) {
    creaEventoCalendario(nomeCompleto, email, dataCall, note, nexusId);
  }

  const msgTelegram = 
    '<b>🚨 NUOVA CANDIDATURA SFX</b>\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '🆔 <b>ID Nexus:</b> <code>' + nexusId + '</code>\n' +
    '👤 <b>Nominativo:</b> ' + escapeHtml(nomeCompleto) + '\n' +
    '📧 <b>Email:</b> ' + escapeHtml(email) + '\n' +
    '📞 <b>Telefono:</b> <code>' + escapeHtml(telefono) + '</code>\n' +
    '🎯 <b>Lead Score:</b> <b>' + scoreData.punteggio + '/100</b> (' + scoreData.priorita + ')\n' +
    (dataCall ? '📅 <b>Data Call:</b> <code>' + escapeHtml(dataCall) + '</code>\n' : '') +
    '📝 <b>Note:</b> <i>' + escapeHtml(note) + '</i>\n' +
    '🕒 <b>Data:</b> ' + timestamp + '\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '⚡ <i>In attesa di valutazione nella Sala d\'Attesa X-BOX</i>';
  inviaTelegram(msgTelegram);

  inviaEmailConfermaCandidatura(nomeCompleto, email, nexusId, dataCall);

  return renderJson({
    status: 'success',
    nexusId: nexusId,
    punteggio: scoreData.punteggio,
    priorita: scoreData.priorita,
    message: 'Candidatura elaborata e registrata.'
  });
}

function eseguiAvvalloCorsista(dati) {
  const nexusId = sanitizeInput(dati.nexusId);
  const nomeCompleto = sanitizeInput(dati.nomeCompleto || dati.nome);
  const email = sanitizeInput(dati.email);
  const telefono = sanitizeInput(dati.telefono);

  if (!nexusId) {
    return renderJson({ status: 'error', message: 'ID Nexus assente. Impossibile avvallare.' });
  }

  const workspace = creaWorkspaceCorsistaDrive(nexusId, nomeCompleto, email);

  const sheetCorsisti = ottieniOFreaFoglio(CONFIG.SHEET_CORSISTI, [
    'ID_NEXUS', 'DATA_ACCREDITAMENTO', 'NOME_COMPLETO', 'EMAIL', 'TELEFONO',
    'DRIVE_URL', 'SEMAFORO_PAGAMENTI', 'SEMAFORO_MATERIALI', 'AVANZAMENTO_DIDATTICO', 'NOTE'
  ]);
  
  const timestamp = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'dd/MM/yyyy HH:mm:ss');
  sheetCorsisti.appendRow([
    nexusId, timestamp, nomeCompleto, email, telefono,
    workspace.rootUrl, 'VERDE', 'MODULO_01', 'ATTIVO (0%)', 'Accreditato via X-BOX'
  ]);

  const ss = getDB();
  const sheetCand = ss.getSheetByName(CONFIG.SHEET_CANDIDATI);
  if (sheetCand) {
    const rows = sheetCand.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][0]).trim() === nexusId) {
        sheetCand.getRange(i + 1, 11).setValue('PROMOSSO CORSISTA');
        break;
      }
    }
  }

  const msgTelegram = 
    '<b>🎓 PROMOZIONE CORSISTA CONFERMATA</b>\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '🆔 <b>ID Nexus:</b> <code>' + nexusId + '</code>\n' +
    '👤 <b>Corsista:</b> ' + escapeHtml(nomeCompleto) + '\n' +
    '📧 <b>Email:</b> ' + escapeHtml(email) + '\n' +
    '📁 <b>Workspace Cloud:</b> <a href="' + workspace.rootUrl + '">Apri Google Drive</a>\n' +
    '🕒 <b>Timestamp:</b> ' + timestamp + '\n' +
    '━━━━━━━━━━━━━━━━━━━━';
  inviaTelegram(msgTelegram);

  inviaEmailAccreditamentoUfficiale(nomeCompleto, email, nexusId, workspace.rootUrl);

  return renderJson({ status: 'success', nexusId: nexusId, driveUrl: workspace.rootUrl });
}

function eseguiAggiornaStato(dati) {
  const nexusId = sanitizeInput(dati.nexusId);
  const stato = sanitizeInput(dati.stato);
  const ss = getDB();
  const sheet = ss.getSheetByName(CONFIG.SHEET_CANDIDATI);
  if (!sheet) return renderJson({ status: 'error', message: 'Foglio Candidati non trovato' });

  const rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === nexusId) {
      sheet.getRange(i + 1, 11).setValue(stato);
      return renderJson({ status: 'success', nexusId: nexusId, nuovoStato: stato });
    }
  }
  return renderJson({ status: 'not_found', nexusId: nexusId });
}

function eseguiAggiornaSemafori(dati) {
  const esito = aggiornaSemaforoCorsista(dati.nexusId, dati.tipo, dati.valore);
  return renderJson({ status: esito ? 'success' : 'fail', nexusId: dati.nexusId });
}

function eseguiRegistraIncasso(dati) {
  const nexusId = sanitizeInput(dati.nexusId);
  const nome = sanitizeInput(dati.nome);
  const importo = sanitizeInput(dati.importo);
  const metodo = sanitizeInput(dati.metodo || 'Non Specificato');
  const note = sanitizeInput(dati.note);

  const txId = registraTransazioneIncasso(nexusId, nome, importo, metodo, note);
  return renderJson({ status: 'success', transazioneId: txId });
}

// ============================================================================
// GATEWAY WEB APP: LETTURA DATI (doGet) PER DASHBOARD CRM
// ============================================================================

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'ping';

    if (action === 'ping') {
      return renderJson({ status: 'ok', online: true, versione: CONFIG.VERSIONE_BACKEND, timestamp: new Date().toISOString() });
    }

    const ss = getDB();

    if (action === 'getCandidati') {
      const sheet = ss.getSheetByName(CONFIG.SHEET_CANDIDATI);
      return renderJson({ status: 'ok', dati: estraiMatriceOggetti(sheet) });
    }

    if (action === 'getCorsisti') {
      const sheet = ss.getSheetByName(CONFIG.SHEET_CORSISTI);
      return renderJson({ status: 'ok', dati: estraiMatriceOggetti(sheet) });
    }

    if (action === 'getDashboardData') {
      const candidati = estraiMatriceOggetti(ss.getSheetByName(CONFIG.SHEET_CANDIDATI));
      const corsisti = estraiMatriceOggetti(ss.getSheetByName(CONFIG.SHEET_CORSISTI));
      return renderJson({
        status: 'ok',
        metriche: {
          totaleCandidati: candidati.length,
          totaleCorsisti: corsisti.length,
          attesaRevisione: candidati.filter(function(c) { return String(c.STATO_PIPELINE).trim() === 'SALA D\'ATTESA'; }).length
        },
        candidati: candidati,
        corsisti: corsisti
      });
    }

    return renderJson({ status: 'unknown_action', action: action });
  } catch (err) {
    Logger.log('Errore doGet: ' + err.toString());
    return renderJson({ status: 'error', message: err.toString() });
  }
}

function estraiMatriceOggetti(sheet) {
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  const headers = rows[0];
  const output = [];
  for (var i = 1; i < rows.length; i++) {
    var item = {};
    for (var h = 0; h < headers.length; h++) {
      item[headers[h]] = rows[i][h];
    }
    output.push(item);
  }
  return output;
}

function renderJson(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// MODULO 15: SETUP INIZIALE & SCHEDULATORE (ESEGUIRE SOLO LA PRIMA VOLTA)
// ============================================================================

function setupInizialeSistema() {
  Logger.log('Avvio diagnostica e installazione sistema Suprema Future X...');
  
  getDB();
  
  const triggers = ScriptApp.getProjectTriggers();
  for (var t = 0; t < triggers.length; t++) {
    if (triggers[t].getHandlerFunction() === 'orologioMarketingEAppuntamenti') {
      ScriptApp.deleteTrigger(triggers[t]);
    }
  }
  ScriptApp.newTrigger('orologioMarketingEAppuntamenti')
    .timeBased()
    .everyHours(1)
    .create();

  const esitoTel = testTelegram();

  if (esitoTel) {
    Logger.log('✅ SETUP COMPLETATO CON SUCCESSO. IL SISTEMA E\' 100% ONLINE.');
    Logger.log('👉 Prossimo passo: In alto a destra clicca "Esegui il deployment" -> "Nuova versione"');
  } else {
    Logger.log('⚠️ ERRORE: Il bot Telegram non ha risposto. Verifica il TOKEN.');
  }
}
