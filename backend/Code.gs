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
  
  if (tabType === 'LEADS') {
    sheet = ss.getSheetByName('Nexus_Leads') || ss.getSheetByName('Leads_CRM') || ss.getSheetByName('Leads_Candidature');
    if (!sheet) {
      sheet = ss.insertSheet('Nexus_Leads');
      sheet.appendRow(['TIMESTAMP', 'CODICE_NEXUS', 'NOME', 'AZIENDA', 'EMAIL', 'TELEFONO', 'AMBITO', 'DATA_PRENOTAZIONE', 'ORA_PRENOTAZIONE', 'NOTE', 'PUNTI', 'STATUS']);
      sheet.getRange('1:1').setFontWeight('bold').setBackground('#1F2227').setFontColor('#00F0FF');
    }
  } else if (tabType === 'LEDGER') {
    sheet = ss.getSheetByName('Ledger_Finanza') || ss.getSheetByName('CEO_Ledger_Finanza') || ss.getSheetByName('Mastro_Finanziario');
    if (!sheet) {
      sheet = ss.insertSheet('Ledger_Finanza');
      sheet.appendRow(['TIMESTAMP', 'DESCRIZIONE', 'TIPO', 'IMPORTO', 'OPERATIVITA_54', 'DIVIDENDI_30', 'TASSE_16', 'PROOF_HASH']);
      sheet.getRange('1:1').setFontWeight('bold').setBackground('#1F2227').setFontColor('#D4AF37');
    }
  } else if (tabType === 'PROMPTS') {
    sheet = ss.getSheetByName('Prompts_Neurali') || ss.getSheetByName('System_Prompts');
    if (!sheet) sheet = ss.insertSheet('Prompts_Neurali');
  }
  
  return sheet;
}

function doGet(e) {
  try {
    const action = e && e.parameter ? e.parameter.action : '';
    if (action === 'PING') return jsonReply({ status: 'ok', message: 'Gateway EAL6+ Online' });
    if (action === 'GET_LEADS') return fetchLeads();
    if (action === 'GET_LEDGER') return fetchLedger();
    return jsonReply({ status: 'ok', service: 'SFX Governance Engine Active' });
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

    if (action === 'CANDIDATURA_CONFERENZA_CEO' || action === 'CANDIDATURA_FORM' || action === 'LEAD_INGESTION') {
      return saveLead(payload);
    } else if (action === 'LEDGER_ENTRY') {
      return saveLedger(payload);
    } else if (action === 'PROVISIONING_ASSEDIO') {
      return jsonReply({ status: 'success', message: 'Assedio predisposto' });
    }

    return jsonReply({ status: 'error', message: 'Azione sconosciuta: ' + action });
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
      htmlBody: `<h3>Candidatura ricevuta</h3><p><strong>Nome:</strong> ${data.nome}</p><p><strong>Tel:</strong> ${data.telefono}</p><p><strong>Email:</strong> ${data.email}</p><p><strong>Ambito:</strong> ${ambito}</p>`
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
  const desc = data.description || 'Movimento';
  const now = new Date().toISOString();

  let ops = (tipo === 'ENTRATA') ? importo * 0.54 : importo;
  let div = (tipo === 'ENTRATA') ? importo * 0.30 : 0;
  let tax = (tipo === 'ENTRATA') ? importo * 0.16 : 0;

  sheet.appendRow([now, desc, tipo, importo, ops, div, tax, 'PROOF_OK']);
  return jsonReply({ status: 'success' });
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

function jsonReply(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function testConnessione() {
  const sheet = getTargetSheet('LEADS');
  Logger.log('COLLEGAMENTO OK SU SCHEDA: ' + sheet.getName());
}
