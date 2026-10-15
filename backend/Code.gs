/**
 * ====================================================================
 * SUPREMA FUTURE X // BACKEND ECOSYSTEM & 15 AGENTS ENGINE
 * GOVERNANCE: CEO GIULIANO CARATELLI
 * MASTER SPREADSHEET ID: 1h68DamKGwoVmPa0LXTYJpWhejP20VFNQPFNdqMpY0pE
 * ====================================================================
 */

const MASTER_ID = '1h68DamKGwoVmPa0LXTYJpWhejP20VFNQPFNdqMpY0pE';
const CEO_EMAIL = 'ceo@supremaofficial.com';

function getMasterSpreadsheet() {
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active && active.getId() === MASTER_ID) return active;
  } catch (e) {}
  return SpreadsheetApp.openById(MASTER_ID);
}

function getTargetSheet(tabType) {
  const ss = getMasterSpreadsheet();
  let sheet = null;
  
  switch(tabType) {
    case 'LEADS':
      sheet = ss.getSheetByName('Nexus_Leads') || ss.getSheetByName('Leads_CRM') || ss.getSheetByName('Leads_Candidature');
      if (!sheet) {
        sheet = ss.insertSheet('Nexus_Leads');
        sheet.appendRow(['TIMESTAMP', 'CODICE_NEXUS', 'NOME', 'AZIENDA', 'EMAIL', 'TELEFONO', 'AMBITO', 'DATA_PRENOTAZIONE', 'ORA_PRENOTAZIONE', 'NOTE', 'PUNTI', 'STATUS']);
      }
      break;

    case 'LEDGER':
      sheet = ss.getSheetByName('Ledger_Finanza') || ss.getSheetByName('CEO_Ledger_Finanza') || ss.getSheetByName('Mastro_Finanziario');
      if (!sheet) {
        sheet = ss.insertSheet('Ledger_Finanza');
        sheet.appendRow(['TIMESTAMP', 'DESCRIZIONE', 'TIPO', 'IMPORTO', 'OPERATIVITA_54', 'DIVIDENDI_30', 'TASSE_16', 'PROOF_HASH']);
      }
      break;

    case 'PROMPTS':
      sheet = ss.getSheetByName('Prompts_Neurali') || ss.getSheetByName('System_Prompts');
      if (!sheet) {
        sheet = ss.insertSheet('Prompts_Neurali');
        sheet.appendRow(['TIMESTAMP', 'AGENTE', 'VERSIONE', 'PROMPT_SISTEMA', 'OPERATORE']);
      }
      break;

    case 'ACADEMY':
      sheet = ss.getSheetByName('Academy_Students') || ss.getSheetByName('DB_CORSISTI');
      if (!sheet) {
        sheet = ss.insertSheet('Academy_Students');
        sheet.appendRow(['TIMESTAMP', 'CORSISTA', 'EMAIL_WORKSPACE', 'TIER_ACCADEMIA', 'STATO_DRIVE', 'PROVISIONING_TOKEN']);
      }
      break;

    case 'AGENT_LOGS':
      sheet = ss.getSheetByName('Agent_Logs') || ss.getSheetByName('System_Telemetry');
      if (!sheet) {
        sheet = ss.insertSheet('Agent_Logs');
        sheet.appendRow(['TIMESTAMP', 'AGENTE', 'LIVELLO', 'EVENTO', 'PAYLOAD_JSON']);
      }
      break;

    case 'SCOUT':
      sheet = ss.getSheetByName('Scout_Drafts') || ss.getSheetByName('Newsletter_Sub');
      if (!sheet) {
        sheet = ss.insertSheet('Scout_Drafts');
        sheet.appendRow(['TIMESTAMP', 'CANALE', 'CONTENUTO_POST', 'STATO_APPROVAZIONE']);
      }
      break;

    case 'SECURITY':
      sheet = ss.getSheetByName('Sicurezza_Blacklist');
      if (!sheet) {
        sheet = ss.insertSheet('Sicurezza_Blacklist');
        sheet.appendRow(['TIMESTAMP', 'IP', 'DEVICE', 'SEVERITA', 'DETTAGLI']);
      }
      break;
  }
  return sheet;
}

function doGet(e) {
  try {
    const action = e && e.parameter ? e.parameter.action : '';
    if (action === 'PING') return jsonReply({ status: 'ok', message: 'Ecosistema Agenti Operativo' });
    if (action === 'GET_LEADS') return fetchLeads();
    if (action === 'GET_LEDGER') return fetchLedger();
    if (action === 'GET_PROMPTS') return fetchPrompts();
    if (action === 'GET_DYNAMIC_DATA') return fetchDynamicData();
    return jsonReply({ status: 'ok', service: 'SFX Governance Engine Active', fleet: '15 Agenti Sincronizzati' });
  } catch (err) {
    return jsonReply({ status: 'error', error: err.toString() });
  }
}

function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try { payload = JSON.parse(e.postData.contents); } catch (err) { payload = e.parameter || {}; }
    } else {
      payload = e.parameter || {};
    }

    const action = payload.action || 'CANDIDATURA_CONFERENZA_CEO';

    switch (action) {
      case 'CANDIDATURA_CONFERENZA_CEO':
      case 'CANDIDATURA_FORM':
      case 'LEAD_INGESTION':
        return saveLead(payload);

      case 'LEDGER_ENTRY':
        return saveLedger(payload);

      case 'PROVISIONING_ASSEDIO':
        return saveAssedioProvisioning(payload.payload || payload);

      case 'AGGIORNA_PROMPT_NEURALE':
      case 'UPDATE_AGENT_PROMPT':
        return saveAgentPrompt(payload);

      case 'SAVE_SCOUT_POST':
        return saveScoutDraft(payload);

      case 'LOG_AGENT_ACTION':
      case 'AGENT_HEARTBEAT':
        return logAgentAction(payload);

      case 'REPORT_ABUSE':
      case 'SECURITY_ALARM':
        return saveSecurityAlert(payload);

      case 'UPDATE_GATEWAYS':
        return updateGateways(payload);

      default:
        return jsonReply({ status: 'error', message: 'Azione sconosciuta: ' + action });
    }
  } catch (err) {
    return jsonReply({ status: 'error', error: err.toString() });
  }
}

function saveLead(data) {
  const sheet = getTargetSheet('LEADS');
  const rowCount = Math.max(1, sheet.getLastRow());
  const nexusCode = 'NX-' + (4700 + rowCount);
  const ambito = data.canale || data.ambito || 'Conferenza CEO';
  const now = new Date();
  
  const dataPren = data.data_prenotazione || data.dataPrenotazione || now.toLocaleDateString('it-IT');
  const oraPren = data.ora_prenotazione || data.oraPrenotazione || now.toLocaleTimeString('it-IT');

  sheet.appendRow([
    now.toISOString(),
    nexusCode,
    data.nome || 'N/D',
    data.azienda || 'N/D',
    data.email || 'N/D',
    data.telefono || 'N/D',
    ambito,
    dataPren,
    oraPren,
    data.note || '',
    '1,500 PTS',
    'ACCREDITATO'
  ]);

  try {
    MailApp.sendEmail({
      to: CEO_EMAIL,
      subject: `🚨 NUOVA CANDIDATURA [${nexusCode}] - ${data.nome}`,
      htmlBody: `<h3>Candidatura Accreditata</h3><p><strong>Candidato:</strong> ${data.nome}</p><p><strong>Tel:</strong> ${data.telefono}</p><p><strong>Email:</strong> ${data.email}</p><p><strong>Ambito:</strong> ${ambito}</p>`
    });
  } catch (e) {}

  return jsonReply({ status: 'success', nexusCode: nexusCode });
}

function fetchLeads() {
  const sheet = getTargetSheet('LEADS');
  if (sheet.getLastRow() <= 1) return jsonReply({ status: 'ok', leads: [] });

  const numCols = Math.min(sheet.getLastColumn(), 12);
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, numCols).getValues();

  const leads = rows.map(r => ({
    timestamp: r[0] || '',
    nexusCode: r[1] || 'NX-N/D',
    nome: r[2] || 'N/D',
    azienda: r[3] || 'Privato',
    email: r[4] || 'N/D',
    telefono: r[5] || 'N/D',
    ambito: r[6] || 'Generale',
    dataPrenotazione: r[7] || '',
    oraPrenotazione: r[8] || '',
    note: r[9] || '',
    punti: r[10] || '1,500 PTS',
    status: r[11] || 'ACCREDITATO'
  }));

  return jsonReply({ status: 'ok', leads: leads });
}

function saveLedger(data) {
  const sheet = getTargetSheet('LEDGER');
  const importo = parseFloat(data.amount || 0);
  const tipo = (data.type || 'ENTRATA').toUpperCase();
  const desc = data.description || 'Movimento Mastro';
  const now = new Date().toISOString();

  let ops = (tipo === 'ENTRATA') ? importo * 0.54 : importo;
  let div = (tipo === 'ENTRATA') ? importo * 0.30 : 0;
  let tax = (tipo === 'ENTRATA') ? importo * 0.16 : 0;

  sheet.appendRow([now, desc, tipo, importo, ops, div, tax, 'HASH_VALIDATO']);
  return jsonReply({ status: 'success', split: { ops: ops, div: div, tax: tax } });
}

function fetchLedger() {
  const sheet = getTargetSheet('LEDGER');
  if (sheet.getLastRow() <= 1) return jsonReply({ status: 'ok', ledger: [] });

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 8).getValues();
  const ledger = rows.map(r => ({
    timestamp: r[0],
    descrizione: r[1],
    tipo: r[2],
    importo: r[3],
    operativita: r[4],
    dividendi: r[5],
    tasse: r[6],
    proofHash: r[7]
  }));

  return jsonReply({ status: 'ok', ledger: ledger });
}

function saveAssedioProvisioning(dati) {
  const sheet = getTargetSheet('ACADEMY');
  const nome = dati.nome || 'Corsista';
  const email = dati.email || 'N/D';
  const tier = dati.pacchetto || dati.tier || 'Executive Master';
  const token = 'SFX-ASSEDIO-' + Utilities.getUuid().substring(0, 8).toUpperCase();

  sheet.appendRow([new Date().toISOString(), nome, email, tier, 'PROVISIONED', token]);
  return jsonReply({ status: 'success', message: `Assedio completato per ${nome}`, token: token });
}

function saveAgentPrompt(dati) {
  const sheet = getTargetSheet('PROMPTS');
  const agente = dati.agente || 'ALISON_NEURAL';
  const prompt = dati.prompt || dati.systemPrompt || '';
  const operatore = dati.operatore || 'CEO GIULIANO';
  const versione = 'V-' + (sheet.getLastRow());

  sheet.appendRow([new Date().toISOString(), agente, versione, prompt, operatore]);
  return jsonReply({ status: 'success', message: `Prompt neurale per ${agente} memorizzato.` });
}

function fetchPrompts() {
  const sheet = getTargetSheet('PROMPTS');
  if (sheet.getLastRow() <= 1) return jsonReply({ status: 'ok', prompts: [] });

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
  const prompts = rows.map(r => ({
    timestamp: r[0], agente: r[1], versione: r[2], prompt: r[3], operatore: r[4]
  }));
  return jsonReply({ status: 'ok', prompts: prompts });
}

function saveScoutDraft(dati) {
  const sheet = getTargetSheet('SCOUT');
  const canale = dati.channel || dati.canale || 'INSTAGRAM';
  const post = dati.content || dati.testo || '';

  sheet.appendRow([new Date().toISOString(), canale, post, 'IN_APPROVAZIONE_CEO']);
  return jsonReply({ status: 'success', message: 'Bozza inviata ad AG-15 Joker.' });
}

function logAgentAction(dati) {
  const sheet = getTargetSheet('AGENT_LOGS');
  const agente = dati.agente || 'SISTEMA';
  const livello = dati.level || 'INFO';
  const evento = dati.evento || 'ATTIVITA';
  const jsonPayload = JSON.stringify(dati.payload || {});

  sheet.appendRow([new Date().toISOString(), agente, livello, evento, jsonPayload]);
  return jsonReply({ status: 'success' });
}

function saveSecurityAlert(dati) {
  const sheet = getTargetSheet('SECURITY');
  sheet.appendRow([
    new Date().toISOString(),
    dati.ip || '0.0.0.0',
    dati.device || 'Browser',
    dati.severity || 'CRITICAL',
    dati.detail || 'Accesso anomalo bloccato'
  ]);
  return jsonReply({ status: 'blocked' });
}

function updateGateways(data) {
  const props = PropertiesService.getScriptProperties();
  if (data.iban) props.setProperty('SFX_IBAN', data.iban);
  if (data.sumup) props.setProperty('SFX_SUMUP', data.sumup);
  return jsonReply({ status: 'success', message: 'Gateways aggiornati.' });
}

function fetchDynamicData() {
  const props = PropertiesService.getScriptProperties();
  return jsonReply({
    status: 'ok',
    iban: props.getProperty('SFX_IBAN') || "IT00 A000 0000 0000 0000 0000 000",
    sumup: props.getProperty('SFX_SUMUP') || "https://me.sumup.com/pay/suprema"
  });
}

function jsonReply(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function testAggancioCompletoAgenti() {
  const sLeads = getTargetSheet('LEADS');
  const sPrompts = getTargetSheet('PROMPTS');
  const sLogs = getTargetSheet('AGENT_LOGS');
  const sAcademy = getTargetSheet('ACADEMY');
  Logger.log(`✓ Ecosistema Agenti Sincronizzato. Schede: ${sLeads.getName()}, ${sPrompts.getName()}, ${sLogs.getName()}, ${sAcademy.getName()}`);
}
