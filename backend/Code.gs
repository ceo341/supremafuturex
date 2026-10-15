/**
 * ====================================================================
 * SUPREMA FUTURE X // MOTORE CENTRALE GOVERNANCE & PROMEMORIA
 * DIREZIONE GENERALE: CEO GIULIANO CARATELLI
 * CODICE MASTER FOGLIO: 1h68DamKGwoVmPa0LXTYJpWhejP20VFNQPFNdqMpY0pE
 * ====================================================================
 */

const ID_FOGLIO_MASTER = '1h68DamKGwoVmPa0LXTYJpWhejP20VFNQPFNdqMpY0pE';
const EMAIL_DIREZIONE = 'ceo@supremaofficial.com';

function ottieniFoglioMaster() {
  try {
    const foglioAttivo = SpreadsheetApp.getActiveSpreadsheet();
    if (foglioAttivo && foglioAttivo.getId() === ID_FOGLIO_MASTER) return foglioAttivo;
  } catch (e) {}
  return SpreadsheetApp.openById(ID_FOGLIO_MASTER);
}

function ottieniScheda(tipoScheda) {
  const master = ottieniFoglioMaster();
  let scheda = null;
  
  switch(tipoScheda) {
    case 'LEADS':
      scheda = master.getSheetByName('Nexus_Leads') || master.getSheetByName('Leads_CRM');
      if (!scheda) {
        scheda = master.insertSheet('Nexus_Leads');
        scheda.appendRow([
          'TIMESTAMP', 'CODICE_NEXUS', 'NOME', 'AZIENDA', 'EMAIL', 
          'TELEFONO', 'AMBITO', 'DATA_PRENOTAZIONE', 'ORA_PRENOTAZIONE', 
          'NOTE', 'PUNTI', 'STATUS', 'STATO_7_GIORNI', 'STATO_48_ORE', 'ID_CALENDARIO'
        ]);
      }
      break;

    case 'LEDGER':
      scheda = master.getSheetByName('Ledger_Finanza') || master.getSheetByName('Mastro_Finanziario');
      if (!scheda) {
        scheda = master.insertSheet('Ledger_Finanza');
        scheda.appendRow(['TIMESTAMP', 'DESCRIZIONE', 'TIPO', 'IMPORTO', 'OPERATIVITA_54', 'DIVIDENDI_30', 'TASSE_16', 'CODICE_SICUREZZA']);
      }
      break;

    case 'PROMPTS':
      scheda = master.getSheetByName('Prompts_Neurali');
      if (!scheda) {
        scheda = master.insertSheet('Prompts_Neurali');
        scheda.appendRow(['TIMESTAMP', 'AGENTE', 'VERSIONE', 'PROMPT_SISTEMA', 'OPERATORE']);
      }
      break;

    case 'ACADEMY':
      scheda = master.getSheetByName('Academy_Students');
      if (!scheda) {
        scheda = master.insertSheet('Academy_Students');
        scheda.appendRow(['TIMESTAMP', 'CORSISTA', 'EMAIL', 'PACCHETTO', 'STATO_ACCESSO', 'TOKEN_ATTIVAZIONE']);
      }
      break;

    case 'LOGS':
      scheda = master.getSheetByName('Agent_Logs');
      if (!scheda) {
        scheda = master.insertSheet('Agent_Logs');
        scheda.appendRow(['TIMESTAMP', 'AGENTE', 'LIVELLO', 'EVENTO', 'DATI_REGISTRATI']);
      }
      break;

    case 'SCOUT':
      scheda = master.getSheetByName('Scout_Drafts');
      if (!scheda) {
        scheda = master.insertSheet('Scout_Drafts');
        scheda.appendRow(['TIMESTAMP', 'CANALE', 'TESTO_BOZZA', 'STATO_APPROVAZIONE']);
      }
      break;

    case 'SICUREZZA':
      scheda = master.getSheetByName('Sicurezza_Blacklist');
      if (!scheda) {
        scheda = master.insertSheet('Sicurezza_Blacklist');
        scheda.appendRow(['TIMESTAMP', 'INDIRIZZO_IP', 'DISPOSITIVO', 'SEVERITA', 'NOTE_ACCESSO']);
      }
      break;
  }
  return scheda;
}

function doGet(e) {
  try {
    const azione = e && e.parameter ? e.parameter.action : '';
    if (azione === 'PING') return rispostaJson({ status: 'ok', messaggio: 'Sistema di Governance Attivo' });
    if (azione === 'GET_LEADS') return caricaListaCandidati();
    if (azione === 'GET_LEDGER') return caricaDatiFinanziari();
    if (azione === 'GET_PROMPTS') return caricaPromptAgenti();
    if (azione === 'GET_DYNAMIC_DATA') return caricaCoordinateAziendali();
    return rispostaJson({ status: 'ok', servizio: 'SUPREMA FUTURE X Governance Attiva' });
  } catch (errore) {
    return rispostaJson({ status: 'error', errore: errore.toString() });
  }
}

function doPost(e) {
  try {
    let dati = {};
    if (e && e.postData && e.postData.contents) {
      try { dati = JSON.parse(e.postData.contents); } catch (err) { dati = e.parameter || {}; }
    } else {
      dati = e.parameter || {};
    }

    const azione = dati.action || 'CANDIDATURA_CONFERENZA_CEO';

    switch (azione) {
      case 'CANDIDATURA_CONFERENZA_CEO':
      case 'CANDIDATURA_FORM':
      case 'LEAD_INGESTION':
        return registraNuovoCandidato(dati);

      case 'LEDGER_ENTRY':
        return registraMovimentoFinanziario(dati);

      case 'PROVISIONING_ASSEDIO':
        return attivaCorsistaAssedio(dati.payload || dati);

      case 'AGGIORNA_PROMPT_NEURALE':
      case 'UPDATE_AGENT_PROMPT':
        return salvaDirettivaAgente(dati);

      case 'SAVE_SCOUT_POST':
        return salvaBozzaSocial(dati);

      case 'LOG_AGENT_ACTION':
      case 'AGENT_HEARTBEAT':
        return registraAttivitaAgente(dati);

      case 'REPORT_ABUSE':
      case 'SECURITY_ALARM':
        return bloccaAccessoNonAutorizzato(dati);

      case 'UPDATE_GATEWAYS':
        return aggiornaCoordinatePagamento(dati);

      default:
        return rispostaJson({ status: 'error', messaggio: 'Comando non riconosciuto: ' + azione });
    }
  } catch (errore) {
    return rispostaJson({ status: 'error', errore: errore.toString() });
  }
}

function registraNuovoCandidato(dati) {
  const foglio = ottieniScheda('LEADS');
  const righeTotali = Math.max(1, foglio.getLastRow());
  const codiceNexus = 'NX-' + (4700 + righeTotali);
  const ambito = dati.canale || dati.ambito || 'Conferenza CEO';
  const adesso = new Date();
  
  const dataPren = dati.data_prenotazione || dati.dataPrenotazione || adesso.toLocaleDateString('it-IT');
  const oraPren = dati.ora_prenotazione || dati.oraPrenotazione || '16:00';
  const nomeCandidato = dati.nome || 'Candidato';
  const emailCandidato = dati.email || '';
  const telefonoCandidato = dati.telefono || 'N/D';
  const noteCandidato = dati.note || '';

  let idEventoCalendario = 'NON_CONFIGURATO';
  try {
    const resCal = creaEventoGoogleCalendar({
      nome: nomeCandidato, email: emailCandidato, telefono: telefonoCandidato,
      ambito: ambito, codiceNexus: codiceNexus, dataPrenotazione: dataPren, oraPrenotazione: oraPren
    });
    if (resCal.idEvento) idEventoCalendario = resCal.idEvento;
  } catch (errCal) {
    Logger.log("Avviso Calendar: " + errCal.toString());
  }

  let oreMancanti = 999;
  try {
    const partiData = String(dataPren).split(/[\/\-]/);
    const partiOra = String(oraPren).split(':');
    if (partiData.length >= 3 && partiOra.length >= 2) {
      const dataIncontro = new Date(
        parseInt(partiData[2], 10), parseInt(partiData[1], 10) - 1, parseInt(partiData[0], 10),
        parseInt(partiOra[0], 10), parseInt(partiOra[1], 10)
      ).getTime();
      oreMancanti = (dataIncontro - adesso.getTime()) / (1000 * 60 * 60);
    }
  } catch (e) {}

  let stato7gg = 'DA_INVIARE';
  let stato48h = 'DA_INVIARE';
  let scenarioTemporale = 'STANDARD';

  if (oreMancanti <= 48) {
    stato7gg = 'SALTATO_TEMPO_BREVE';
    stato48h = 'SALTATO_TEMPO_BREVE';
    scenarioTemporale = 'FLASH_PRIORITARIO';
  } else if (oreMancanti < 144) {
    stato7gg = 'ACCORPATO_SUBITO';
    stato48h = 'DA_INVIARE';
    scenarioTemporale = 'ACCORPATO_CON_BRIEFING';
  }

  foglio.appendRow([
    adesso.toISOString(), codiceNexus, nomeCandidato, dati.azienda || 'Privato',
    emailCandidato, telefonoCandidato, ambito, dataPren, oraPren,
    noteCandidato, '1,500 PTS', 'ACCREDITATO', stato7gg, stato48h, idEventoCalendario
  ]);

  try {
    MailApp.sendEmail({
      to: EMAIL_DIREZIONE,
      subject: `🚨 NUOVA CANDIDATURA [${codiceNexus}] - ${nomeCandidato} (${scenarioTemporale})`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; background: #090A0D; color: #ffffff; padding: 20px; border-left: 4px solid #D4AF37;">
          <h3 style="color: #D4AF37; margin-top: 0;">NUOVO ACCREDITO RICEVUTO</h3>
          <p><strong>Candidato:</strong> ${nomeCandidato}</p>
          <p><strong>Recapito Telefonico:</strong> ${telefonoCandidato}</p>
          <p><strong>Email:</strong> ${emailCandidato}</p>
          <p><strong>Ambito:</strong> ${ambito}</p>
          <p><strong>Slot:</strong> ${dataPren} alle ${oraPren} (${Math.round(oreMancanti)} ore rimaste)</p>
        </div>`
    });
  } catch (e) {}

  if (emailCandidato && emailCandidato.indexOf('@') !== -1) {
    inviaRicevutaProfilata(emailCandidato, nomeCandidato, ambito, codiceNexus, dataPren, oraPren, scenarioTemporale);
  }

  return rispostaJson({ status: 'success', nexusCode: codiceNexus, scenario: scenarioTemporale });
}

function creaEventoGoogleCalendar(info) {
  const calendario = CalendarApp.getDefaultCalendar();
  const partiData = String(info.dataPrenotazione).split(/[\/\-]/);
  const partiOra = String(info.oraPrenotazione).split(':');

  if (partiData.length < 3 || partiOra.length < 2) return { status: 'errore_formato' };

  const inizio = new Date(parseInt(partiData[2], 10), parseInt(partiData[1], 10) - 1, parseInt(partiData[0], 10), parseInt(partiOra[0], 10), parseInt(partiOra[1], 10));
  const fine = new Date(inizio.getTime() + (45 * 60 * 1000));

  const evento = calendario.createEvent(`Sessione SFX // ${info.nome} [${info.codiceNexus}]`, inizio, fine, {
    description: `INCONTRO RISERVATO SFX\nCandidato: ${info.nome}\nAmbito: ${info.ambito}\nTel: ${info.telefono}`,
    guests: info.email,
    sendInvites: true
  });

  return { status: 'ok', idEvento: evento.getId() };
}

function inviaRicevutaProfilata(email, nome, ambito, codice, data, ora, scenario) {
  let bloccoExtra = '';
  if (scenario === 'FLASH_PRIORITARIO') {
    bloccoExtra = `<div style="background: #090A0D; padding: 15px; border-left: 4px solid #00F0FF; margin: 15px 0;"><h4 style="color: #00F0FF; margin: 0;">⚡ ACCREDITO PRIORITARIO:</h4><p style="margin: 5px 0 0; font-size: 12px; color: #ddd;">Dato il preavviso ravvicinato, il tuo slot per <strong>${data} alle ${ora}</strong> è già confermato in agenda.</p></div>`;
  } else if (scenario === 'ACCORPATO_CON_BRIEFING') {
    bloccoExtra = `<div style="background: #090A0D; padding: 15px; border-left: 4px solid #D4AF37; margin: 15px 0;"><h4 style="color: #D4AF37; margin: 0;">BRIEFING OPERATIVO:</h4><p style="margin: 5px 0 0; font-size: 12px; color: #ddd;">Visiona subito il materiale preliminare per la sessione del <strong>${data} alle ${ora}</strong>.</p></div>`;
  }

  try {
    MailApp.sendEmail({
      to: email, subject: `👑 ACCREDITO [${codice}] — SUPREMA FUTURE X`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; background: #1F2227; color: #ffffff; padding: 25px; border: 2px solid #D4AF37;">
          <div style="background: #FFBF00; color: #000; padding: 12px; font-weight: bold; font-size: 12px; margin-bottom: 20px;">
            ⚠️ NOTA: Clicca su "Sembra sicuro" e sposta l'email in Posta in Arrivo per ricevere la stanza Meet.
          </div>
          <h2 style="color: #D4AF37; margin-top: 0;">SUPREMA FUTURE X</h2>
          <p>Gentile <strong>${nome}</strong>, registrazione acquisita.</p>
          <p style="color: #00F0FF;">CODICE IDENTIFICATIVO: <strong>${codice}</strong></p>
          ${bloccoExtra}
          <p style="font-size: 12px; color: #aaa;">La stanza Google Meet riservata arriverà 5 minuti prima.</p>
        </div>`
    });
  } catch (e) {}
}

function orologioControllaPromemoria() {
  const foglio = ottieniScheda('LEADS');
  const totaleRighe = foglio.getLastRow();
  if (totaleRighe <= 1) return;

  const colonneTotali = foglio.getLastColumn();
  const dati = foglio.getRange(2, 1, totaleRighe - 1, colonneTotali).getValues();
  const adesso = new Date().getTime();

  dati.forEach((riga, indice) => {
    const rigaFoglio = indice + 2;
    const codice = riga[1], nome = riga[2], email = riga[4], ambito = riga[6], data = riga[7], ora = riga[8];
    const stato7gg = riga[12], stato48h = riga[13];

    if (!data || !ora) return;
    const pD = String(data).split(/[\/\-]/), pO = String(ora).split(':');
    if (pD.length < 3 || pO.length < 2) return;

    const orario = new Date(parseInt(pD[2], 10), parseInt(pD[1], 10) - 1, parseInt(pD[0], 10), parseInt(pO[0], 10), parseInt(pO[1], 10)).getTime();
    const oreRimaste = (orario - adesso) / (1000 * 60 * 60);

    if (stato7gg === 'DA_INVIARE' && oreRimaste <= 168 && oreRimaste > 144) {
      inviaEmailSetteGiorni(email, nome, data, ora, codice);
      foglio.getRange(rigaFoglio, 13).setValue('INVIATO');
    }

    if (stato48h === 'DA_INVIARE' && oreRimaste <= 48 && oreRimaste > 24) {
      inviaEmailSondaggioQuarantottoOre(email, nome, data, ora, ambito);
      foglio.getRange(rigaFoglio, 14).setValue('INVIATO');
    }
  });
}

function inviaEmailSetteGiorni(email, nome, data, ora, codice) {
  if (!email || email.indexOf('@') === -1) return;
  try { 
    MailApp.sendEmail({ 
      to: email, 
      subject: `⏳ PROMEMORIA [-7 GIORNI] — Sessione del ${data}`, 
      htmlBody: `<div style="background: #1F2227; color: #fff; padding: 20px;"><h2 style="color: #00F0FF;">BRIEFING PREPARATORIO</h2><p>Ti ricordiamo la sessione del <strong>${data} alle ${ora}</strong>.</p></div>` 
    }); 
  } catch(e) {}
}

function inviaEmailSondaggioQuarantottoOre(email, nome, data, ora, ambito) {
  if (!email || email.indexOf('@') === -1) return;
  try { 
    MailApp.sendEmail({ 
      to: email, 
      subject: `🚨 CONFERMA RICHIESTA [-48 ORE] — Appuntamento del ${data}`, 
      htmlBody: `<div style="background: #1F2227; color: #fff; padding: 20px;"><h2 style="color: #D4AF37;">CONFERMA PRESENZA</h2><p>Rispondi <strong>CONFERMO</strong> o <strong>RINVIA</strong> per lo slot del <strong>${data} alle ${ora}</strong>.</p></div>` 
    }); 
  } catch(e) {}
}

function caricaListaCandidati() {
  const foglio = ottieniScheda('LEADS');
  if (foglio.getLastRow() <= 1) return rispostaJson({ status: 'ok', leads: [] });
  const righe = foglio.getRange(2, 1, foglio.getLastRow() - 1, Math.min(foglio.getLastColumn(), 15)).getValues();
  const leads = righe.map(r => ({ timestamp: r[0], nexusCode: r[1], nome: r[2], azienda: r[3], email: r[4], telefono: r[5], ambito: r[6], dataPrenotazione: r[7], oraPrenotazione: r[8], punti: r[10] }));
  return rispostaJson({ status: 'ok', leads: leads });
}

function registraMovimentoFinanziario(dati) {
  const foglio = ottieniScheda('LEDGER');
  const importo = parseFloat(dati.amount || 0);
  const tipo = (dati.type || 'ENTRATA').toUpperCase();
  let ops = (tipo === 'ENTRATA') ? importo * 0.54 : importo, div = (tipo === 'ENTRATA') ? importo * 0.30 : 0, tax = (tipo === 'ENTRATA') ? importo * 0.16 : 0;
  foglio.appendRow([new Date().toISOString(), dati.description || 'Movimento', tipo, importo, ops, div, tax, 'VERIFICATO']);
  return rispostaJson({ status: 'success', ripartizione: { ops: ops, div: div, tax: tax } });
}

function caricaDatiFinanziari() {
  const foglio = ottieniScheda('LEDGER');
  if (foglio.getLastRow() <= 1) return rispostaJson({ status: 'ok', ledger: [] });
  const righe = foglio.getRange(2, 1, foglio.getLastRow() - 1, 8).getValues();
  return rispostaJson({ status: 'ok', ledger: righe.map(r => ({ timestamp: r[0], descrizione: r[1], tipo: r[2], importo: r[3], ops: r[4], div: r[5], tax: r[6] })) });
}

function attivaCorsistaAssedio(dati) {
  const foglio = ottieniScheda('ACADEMY');
  const token = 'SFX-ASSEDIO-' + Utilities.getUuid().substring(0, 8).toUpperCase();
  foglio.appendRow([new Date().toISOString(), dati.nome || 'Corsista', dati.email || '', dati.pacchetto || 'Master', 'ATTIVATO', token]);
  return rispostaJson({ status: 'success', token: token });
}

function salvaDirettivaAgente(dati) {
  const foglio = ottieniScheda('PROMPTS');
  foglio.appendRow([new Date().toISOString(), dati.agente || 'ALISON', 'V-' + foglio.getLastRow(), dati.prompt || '', dati.operatore || 'CEO']);
  return rispostaJson({ status: 'success' });
}

function caricaPromptAgenti() {
  const foglio = ottieniScheda('PROMPTS');
  if (foglio.getLastRow() <= 1) return rispostaJson({ status: 'ok', prompts: [] });
  const righe = foglio.getRange(2, 1, foglio.getLastRow() - 1, 5).getValues();
  return rispostaJson({ status: 'ok', prompts: righe.map(r => ({ timestamp: r[0], agente: r[1], versione: r[2], prompt: r[3], operatore: r[4] })) });
}

function salvaBozzaSocial(dati) {
  ottieniScheda('SCOUT').appendRow([new Date().toISOString(), dati.canale || 'INSTAGRAM', dati.testo || '', 'IN_APPROVAZIONE']);
  return rispostaJson({ status: 'success' });
}

function registraAttivitaAgente(dati) {
  ottieniScheda('LOGS').appendRow([new Date().toISOString(), dati.agente || 'SISTEMA', dati.level || 'INFO', dati.evento || 'ATTIVITA', JSON.stringify(dati.payload || {})]);
  return rispostaJson({ status: 'success' });
}

function bloccaAccessoNonAutorizzato(dati) {
  ottieniScheda('SICUREZZA').appendRow([new Date().toISOString(), dati.ip || '0.0.0.0', dati.device || 'Browser', dati.severity || 'CRITICAL', dati.detail || 'Accesso bloccato']);
  return rispostaJson({ status: 'blocked' });
}

function aggiornaCoordinatePagamento(dati) {
  const props = PropertiesService.getScriptProperties();
  if (dati.iban) props.setProperty('SFX_IBAN', dati.iban);
  if (dati.sumup) props.setProperty('SFX_SUMUP', dati.sumup);
  return rispostaJson({ status: 'success' });
}

function caricaCoordinateAziendali() {
  const props = PropertiesService.getScriptProperties();
  return rispostaJson({ status: 'ok', iban: props.getProperty('SFX_IBAN') || "", sumup: props.getProperty('SFX_SUMUP') || "" });
}

function rispostaJson(dati) {
  return ContentService.createTextOutput(JSON.stringify(dati)).setMimeType(ContentService.MimeType.JSON);
}

function controllaTurniReport() { return true; }
