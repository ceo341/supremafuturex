/**
 * ====================================================================
 * SUPREMA FUTURE X // ERP EAL6+ & X-BOX AZIENDALE CEO
 * DIREZIONE GENERALE: CEO GIULIANO CARATELLI
 * VERSIONE: ENTERPRISE (CODICE ESTESO E FORMATTATO)
 * (PARTE 1 DI 2: DATABASE, SOCIAL, MARKETING & ROUTING)
 * ====================================================================
 */

// ==========================================
// 1. CONFIGURAZIONE CENTRALE & IDENTIFICATIVI
// ==========================================
const ID_FOGLIO_MASTER = '1h68DamKGwoVmPa0LXTYJpWhejP20VFNQPFNdqMpY0pE';
const EMAIL_DIREZIONE = 'ceo@supremaofficial.com';
const NUMERO_WA_DIREZIONE = '393474429091';

// ==========================================
// 2. CREDENZIALI TELEGRAM BOT (NUOVO BOT SUPREMA)
// ==========================================
const TELEGRAM_TOKEN = '8881640493:AAHYGipjZm1dIduW3u-F3Wx2hbiWkD-SITA';
const TELEGRAM_CHAT_ID = '6534406542';

// 3. ID CARTELLA DRIVE "ARCHIVIO CORSISTI" 
const ID_CARTELLA_DRIVE_ROOT = ''; 

/**
 * CONNESSIONE AL FOGLIO MASTER
 */
function ottieniFoglioMaster() {
  try {
    return SpreadsheetApp.openById(ID_FOGLIO_MASTER);
  } catch (errore) {
    throw new Error('Impossibile accedere al Foglio Master SFX: ' + errore.toString());
  }
}

/**
 * GESTIONE TABELLE E CREAZIONE AUTOMATICA SCHEDE
 */
function ottieniScheda(nomeScheda) {
  const master = ottieniFoglioMaster();
  let scheda = master.getSheetByName(nomeScheda);

  if (!scheda) {
    scheda = master.insertSheet(nomeScheda);
    
    if (nomeScheda === 'Leads_Provvisori') {
      scheda.appendRow([
        'DATA_ISCRIZIONE', 
        'CODICE_NEXUS', 
        'NOME_CANDIDATO', 
        'EMAIL', 
        'TELEFONO', 
        'DATA_NASCITA', 
        'CORSO_INTERESSE', 
        'DATA_COLLOQUIO', 
        'ORA_COLLOQUIO', 
        'NOTE', 
        'STATO_ATTUALE', 
        'STATO_7GG', 
        'STATO_48H', 
        'ID_CALENDARIO'
      ]);
      scheda.getRange("A1:N1").setFontWeight("bold").setBackground("#D4AF37").setFontColor("#000000");
    }
    
    else if (nomeScheda === 'Corsisti_Ufficiali') {
      scheda.appendRow([
        'DATA_PROMOZIONE', 
        'CODICE_NEXUS', 
        'NOME_CORSISTA', 
        'EMAIL', 
        'TELEFONO', 
        'CORSO_ASSEGNATO', 
        'ID_CARTELLA_DRIVE', 
        'SEMAFORO_PAGAMENTO', 
        'SEMAFORO_MATERIALI', 
        'SEMAFORO_AVANZAMENTO', 
        'STORICO_OPERAZIONI'
      ]);
      scheda.getRange("A1:K1").setFontWeight("bold").setBackground("#00F0FF").setFontColor("#000000");
    }
    
    else if (nomeScheda === 'Calendario_Marketing') {
      scheda.appendRow([
        'CODICE_NEXUS', 
        'NOME', 
        'EMAIL', 
        'DATA_NASCITA', 
        'DATA_INGRESSO', 
        'ULTIMO_INVIO_NEWSLETTER', 
        'STATO_MARKETING'
      ]);
      scheda.getRange("A1:G1").setFontWeight("bold").setBackground("#34495E").setFontColor("#FFFFFF");
    }
    
    else if (nomeScheda === 'Sezione_Social') {
      scheda.appendRow([
        'DATA_CREAZIONE', 
        'CANALE_PIATTAFORMA', 
        'TITOLO_CAMPAGNA', 
        'TESTO_COPY', 
        'LINK_RISORSA', 
        'STATO_LANCIO'
      ]);
      scheda.getRange("A1:F1").setFontWeight("bold").setBackground("#8E44AD").setFontColor("#FFFFFF");
    }
  }
  return scheda;
}

/**
 * INTERFACCIA RICEZIONE DATI GET (RICERCHE E LETTURA DATI)
 */
function doGet(e) {
  try {
    const azione = e && e.parameter ? e.parameter.action : '';
    
    if (azione === 'PING') {
      return rispostaJson({ status: 'ok', messaggio: 'Centrale Operativa Suprema Future X Attiva' });
    }
    if (azione === 'CERCA_FASCICOLO') {
      const chiave = e.parameter.query || '';
      return rispostaJson(cercaFascicoloUniversale(chiave));
    }
    if (azione === 'GET_PROVVISORI') {
      return rispostaJson({ status: 'ok', dati: estraiElencoProvvisori() });
    }
    if (azione === 'GET_CORSISTI') {
      return rispostaJson({ status: 'ok', dati: estraiElencoCorsisti() });
    }
    if (azione === 'GET_SOCIAL') {
      return rispostaJson({ status: 'ok', dati: estraiCampagneSocial() });
    }

    return rispostaJson({ status: 'ok', messaggio: 'Console SFX Pronta' });
  } catch (errore) {
    return rispostaJson({ status: 'error', errore: errore.toString() });
  }
}

/**
 * INTERFACCIA RICEZIONE DATI POST (AZIONI DI SCRITTURA ED ESECUZIONE)
 */
function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try { 
        payload = JSON.parse(e.postData.contents); 
      } catch (err) { 
        payload = e.parameter || {}; 
      }
    } else {
      payload = e ? (e.parameter || {}) : {};
    }

    const azione = payload.action || 'CANDIDATURA_CONFERENZA';

    switch (azione) {
      case 'CANDIDATURA_CONFERENZA':
        return registraNuovoProvvisorio(payload);
      case 'PROMUOVI_CORSISTA':
        return promuoviACorsista(payload);
      case 'ASSEGNA_MODULO':
        return assegnaDocumentoMaster(payload);
      case 'AGGIORNA_SEMAFORO':
        return aggiornaSemaforiCorsista(payload);
      case 'SALVA_CAMPAGNA_SOCIAL':
        return registraNuovaCampagnaSocial(payload);
      default:
        return rispostaJson({ status: 'error', messaggio: 'Azione non supportata: ' + azione });
    }
  } catch (errore) {
    return rispostaJson({ status: 'error', errore: errore.toString() });
  }
}

/**
 * INGRESSO CANDIDATO IN LISTA PROVVISORIA
 */
function registraNuovoProvvisorio(dati) {
  const foglioProvvisori = ottieniScheda('Leads_Provvisori');
  const foglioMarketing = ottieniScheda('Calendario_Marketing');
  
  const righeTotali = Math.max(1, foglioProvvisori.getLastRow());
  const codiceNexus = 'NX-' + (4700 + righeTotali);
  const adesso = new Date();

  // Estrazione Dati Estesi
  const nome = dati.nome || 'Candidato Non Nominato';
  const email = dati.email || '';
  const telefono = dati.telefono || 'N/D';
  const dataNascita = dati.dataNascita || dati.data_nascita || 'Non specificata';
  const corsoScelto = dati.ambito || dati.corso || 'Conferenza CEO';
  const dataColloquio = dati.dataPrenotazione || dati.data_prenotazione || adesso.toLocaleDateString('it-IT');
  const oraColloquio = dati.oraPrenotazione || dati.ora_prenotazione || '16:00';
  const note = dati.note || '';

  let idCalendario = 'NON_CONFIGURATO';
  try {
    const resCal = creaAppuntamentoCalendario(nome, email, telefono, corsoScelto, codiceNexus, dataColloquio, oraColloquio);
    if (resCal && resCal.id) {
      idCalendario = resCal.id;
    }
  } catch (err) {
    Logger.log("Errore creazione calendario: " + err);
  }

  // Registrazione su Leads_Provvisori
  foglioProvvisori.appendRow([
    adesso.toISOString(), 
    codiceNexus, 
    nome, 
    email, 
    telefono, 
    dataNascita, 
    corsoScelto, 
    dataColloquio, 
    oraColloquio, 
    note, 
    'DA_VALUTARE', 
    'DA_INVIARE', 
    'DA_INVIARE', 
    idCalendario
  ]);

  // Registrazione nel Calendario Marketing per Compleanni e Newsletter 15gg
  foglioMarketing.appendRow([
    codiceNexus, 
    nome, 
    email, 
    dataNascita, 
    adesso.toISOString(), 
    adesso.toISOString(), 
    'ATTIVO'
  ]);

  // Link WhatsApp Candidato
  const testoWa = encodeURIComponent(`Buongiorno Segreteria Suprema Future X, ho completato la registrazione per ${corsoScelto}. Mio identificativo: ${codiceNexus}.`);
  const linkWa = `https://wa.me/${NUMERO_WA_DIREZIONE}?text=${testoWa}`;

  // Notifica Telegram Immediata per il CEO (Formattata estesa)
  const messaggioTelegram = 
    `🟡 <b>NUOVO ACCREDITO PROVVISORIO [${codiceNexus}]</b>\n\n` +
    `👤 <b>Nome:</b> ${nome}\n` +
    `📱 <b>Telefono:</b> ${telefono}\n` +
    `📧 <b>Email:</b> ${email}\n` +
    `🎂 <b>Data Nascita:</b> ${dataNascita}\n` +
    `🎯 <b>Percorso:</b> ${corsoScelto}\n` +
    `📅 <b>Colloquio:</b> ${dataColloquio} alle ${oraColloquio}\n\n` +
    `<i>Dati inseriti nella sala d'attesa dell'X-BOX. Pronto per l'avallo.</i>`;

  inviaNotificaTelegram(messaggioTelegram);

  return rispostaJson({
    status: 'success',
    nexusCode: codiceNexus,
    linkWa: linkWa,
    messaggio: 'Lead registrato correttamente nei provvisori'
  });
}

function registraNuovaCampagnaSocial(dati) {
  const foglioSocial = ottieniScheda('Sezione_Social');
  const adesso = new Date();
  
  foglioSocial.appendRow([ 
    adesso.toISOString(), 
    dati.canale || 'Tutti i Canali', 
    dati.titolo || 'Campagna SFX', 
    dati.testo || '', 
    dati.link || '', 
    dati.stato || 'PRONTO_PER_LANCIO' 
  ]);
  
  return rispostaJson({ 
    status: 'success', 
    messaggio: 'Bozza campagna social archiviata nella sezione marketing' 
  });
}

function cercaFascicoloUniversale(chiave) {
  if (!chiave) {
    return { status: 'error', messaggio: 'Nessun termine di ricerca specificato' };
  }
  
  const termine = String(chiave).toLowerCase().trim();
  const foglioCorsisti = ottieniScheda('Corsisti_Ufficiali');
  const foglioProvvisori = ottieniScheda('Leads_Provvisori');

  // Ricerca Corsisti
  if (foglioCorsisti.getLastRow() > 1) {
    const datiC = foglioCorsisti.getRange(2, 1, foglioCorsisti.getLastRow() - 1, foglioCorsisti.getLastColumn()).getValues();
    for (let i = 0; i < datiC.length; i++) {
      const r = datiC[i];
      if (String(r[1]).toLowerCase().includes(termine) || String(r[2]).toLowerCase().includes(termine)) {
        return {
          status: 'ok', 
          tipo: 'CORSISTA_UFFICIALE',
          dati: { 
            dataPromozione: r[0], 
            codiceNexus: r[1], 
            nome: r[2], 
            email: r[3], 
            telefono: r[4], 
            corso: r[5], 
            idCartellaDrive: r[6], 
            semaforoPagamento: r[7], 
            semaforoMateriali: r[8], 
            semaforoAvanzamento: r[9], 
            storico: r[10] 
          }
        };
      }
    }
  }

  // Ricerca Provvisori
  if (foglioProvvisori.getLastRow() > 1) {
    const datiP = foglioProvvisori.getRange(2, 1, foglioProvvisori.getLastRow() - 1, foglioProvvisori.getLastColumn()).getValues();
    for (let j = 0; j < datiP.length; j++) {
      const p = datiP[j];
      if (String(p[1]).toLowerCase().includes(termine) || String(p[2]).toLowerCase().includes(termine)) {
        return {
          status: 'ok', 
          tipo: 'LEAD_PROVVISORIO',
          dati: { 
            dataIscrizione: p[0], 
            codiceNexus: p[1], 
            nome: p[2], 
            email: p[3], 
            telefono: p[4], 
            dataNascita: p[5], 
            ambito: p[6], 
            dataColloquio: p[7], 
            oraColloquio: p[8], 
            note: p[9], 
            stato: p[10] 
          }
        };
      }
    }
  }
  return { status: 'not_found', messaggio: 'Nessun fascicolo trovato per: ' + chiave };
}

function estraiElencoProvvisori() {
  const f = ottieniScheda('Leads_Provvisori');
  if (f.getLastRow() <= 1) return [];
  const righe = f.getRange(2, 1, f.getLastRow() - 1, f.getLastColumn()).getValues();
  return righe.map(function(r) {
    return { 
      codiceNexus: r[1], 
      nome: r[2], 
      email: r[3], 
      telefono: r[4], 
      dataNascita: r[5], 
      corso: r[6], 
      dataColloquio: r[7], 
      oraColloquio: r[8], 
      note: r[9], 
      stato: r[10] 
    };
  });
}

function estraiElencoCorsisti() {
  const f = ottieniScheda('Corsisti_Ufficiali');
  if (f.getLastRow() <= 1) return [];
  const righe = f.getRange(2, 1, f.getLastRow() - 1, f.getLastColumn()).getValues();
  return righe.map(function(r) {
    return { 
      dataPromozione: r[0], 
      codiceNexus: r[1], 
      nome: r[2], 
      email: r[3], 
      telefono: r[4], 
      corso: r[5], 
      idCartellaDrive: r[6], 
      semaforoPagamento: r[7], 
      semaforoMateriali: r[8], 
      semaforoAvanzamento: r[9], 
      storico: r[10] 
    };
  });
}

function estraiCampagneSocial() {
  const f = ottieniScheda('Sezione_Social');
  if (f.getLastRow() <= 1) return [];
  const righe = f.getRange(2, 1, f.getLastRow() - 1, f.getLastColumn()).getValues();
  return righe.map(function(r) {
    return { 
      data: r[0], 
      canale: r[1], 
      titolo: r[2], 
      testo: r[3], 
      link: r[4], 
      stato: r[5] 
    };
  });
}

function creaAppuntamentoCalendario(nome, email, telefono, ambito, codice, dataStr, oraStr) {
  const calendario = CalendarApp.getDefaultCalendar();
  const partiData = String(dataStr).split(/[\/\-]/);
  const partiOra = String(oraStr).split(':');
  
  if (partiData.length < 3 || partiOra.length < 2) return null;
  
  const inizio = new Date(
    parseInt(partiData[2], 10), 
    parseInt(partiData[1], 10) - 1, 
    parseInt(partiData[0], 10), 
    parseInt(partiOra[0], 10), 
    parseInt(partiOra[1], 10)
  );
  
  const fine = new Date(inizio.getTime() + (45 * 60 * 1000));
  
  const evento = calendario.createEvent(
    `Sessione SFX // ${nome} [${codice}]`, 
    inizio, 
    fine, 
    { 
      description: `Canale/Corso: ${ambito}\nTelefono: ${telefono}\nCodice Nexus: ${codice}`, 
      guests: email, 
      sendInvites: true 
    }
  );
  
  return { id: evento.getId() };
}

function rispostaJson(dati) {
  return ContentService.createTextOutput(JSON.stringify(dati)).setMimeType(ContentService.MimeType.JSON);
}
/**
 * ====================================================================
 * (PARTE 2 DI 2: AUTO-PROVISIONING DRIVE, SEMAFORI, TELEGRAM & MARKETING)
 * ====================================================================
 */

function promuoviACorsista(payload) {
  const foglioProvvisori = ottieniScheda('Leads_Provvisori');
  const foglioCorsisti = ottieniScheda('Corsisti_Ufficiali');
  
  const codiceNexus = String(payload.codiceNexus || '').trim();
  const corsoAssegnato = payload.corso || 'Percorso Accademia SFX';
  const adesso = new Date();

  if (!codiceNexus) {
    return rispostaJson({ status: 'error', messaggio: 'Codice Nexus mancante per la promozione.' });
  }

  const righeP = foglioProvvisori.getDataRange().getValues();
  let rigaCandidato = -1;
  let datiCandidato = null;

  for (let i = 1; i < righeP.length; i++) {
    if (String(righeP[i][1]).trim() === codiceNexus) {
      rigaCandidato = i + 1;
      datiCandidato = righeP[i];
      break;
    }
  }

  if (!datiCandidato) {
    return rispostaJson({ status: 'error', messaggio: 'Candidato non trovato nella lista provvisoria.' });
  }

  const nome = datiCandidato[2];
  const email = datiCandidato[3];
  const telefono = datiCandidato[4];

  let idCartellaStudente = 'NON_CREATA';
  let linkCartellaStudente = '';

  // PROCESSO CREAZIONE CARTELLA DRIVE E SOTTOCARTELLE
  try {
    let cartellaBase = DriveApp.getRootFolder();
    if (ID_CARTELLA_DRIVE_ROOT && ID_CARTELLA_DRIVE_ROOT !== '') {
      try { 
        cartellaBase = DriveApp.getFolderById(ID_CARTELLA_DRIVE_ROOT); 
      } catch (e) {
        Logger.log("Errore caricamento root folder: " + e);
      }
    }

    const cartellaStudente = cartellaBase.createFolder(`[${codiceNexus}] — ${nome}`);
    idCartellaStudente = cartellaStudente.getId();
    linkCartellaStudente = cartellaStudente.getUrl();

    // Sottocartelle Operative
    cartellaStudente.createFolder('01_ACCADEMIA_MATERIALI');
    cartellaStudente.createFolder('02_CONSEGNE_ESERCIZI');
    cartellaStudente.createFolder('03_AMMINISTRAZIONE');

    // Assegnazione Permessi
    if (email && email.includes('@')) {
      cartellaStudente.addEditor(email);
    }
  } catch (errDrive) {
    Logger.log('Errore creazione Drive: ' + errDrive.toString());
  }

  // IMPOSTAZIONE SEMAFORI
  const semaforoPagamento = payload.statoPagamento || '🟣 VIOLA';
  const semaforoMateriali = '⚪ GRIGIO';
  const semaforoAvanzamento = '🟡 GIALLO';
  const storicoIniziale = `[${adesso.toLocaleDateString('it-IT')}] Promosso a Corsista per ${corsoAssegnato}. Fascicolo Drive creato.`;

  // SCRITTURA A DATABASE
  foglioCorsisti.appendRow([
    adesso.toISOString(), 
    codiceNexus, 
    nome, 
    email, 
    telefono,
    corsoAssegnato, 
    idCartellaStudente, 
    semaforoPagamento,
    semaforoMateriali, 
    semaforoAvanzamento, 
    storicoIniziale
  ]);

  // Aggiorna stato Provvisorio
  foglioProvvisori.getRange(rigaCandidato, 11).setValue('PROMOSSO_UFFICIALE');

  // INVIO EMAIL BENVENUTO
  if (email && email.includes('@')) {
    inviaEmailBenvenutoCorsista(email, nome, corsoAssegnato, codiceNexus, linkCartellaStudente);
  }

  // NOTIFICA TELEGRAM AL CEO
  const alertTelegram = 
    `👑 <b>CORSISTA AVVALLATO CON SUCCESSO!</b>\n\n` +
    `👤 <b>Nome:</b> ${nome} [${codiceNexus}]\n` +
    `🎯 <b>Percorso:</b> ${corsoAssegnato}\n` +
    `📁 <b>Fascicolo Drive:</b> Configurato (Cartella creata)\n` +
    `🟣 <b>Stato Pagamento:</b> ${semaforoPagamento}\n\n` +
    `<i>L'ambiente operativo del corsista è pronto e sincronizzato nell'X-BOX.</i>`;
    
  inviaNotificaTelegram(alertTelegram);

  return rispostaJson({ 
    status: 'success', 
    messaggio: `Corsista ${nome} promosso con successo.`, 
    idCartella: idCartellaStudente 
  });
}

function assegnaDocumentoMaster(payload) {
  const foglioCorsisti = ottieniScheda('Corsisti_Ufficiali');
  const codiceNexus = String(payload.codiceNexus || '').trim();
  const idFileMaster = String(payload.idFileMaster || '').trim(); 
  const titoloModulo = payload.titoloModulo || 'Modulo Didattico SFX';

  if (!codiceNexus || !idFileMaster) {
    return rispostaJson({ status: 'error', messaggio: 'Parametri insufficienti per assegnare il documento.' });
  }

  const datiC = foglioCorsisti.getDataRange().getValues();
  let rigaTrovata = -1;
  let datiStudente = null;

  for (let i = 1; i < datiC.length; i++) {
    if (String(datiC[i][1]).trim() === codiceNexus) {
      rigaTrovata = i + 1;
      datiStudente = datiC[i];
      break;
    }
  }

  if (!datiStudente) {
    return rispostaJson({ status: 'error', messaggio: 'Corsista non trovato nel database.' });
  }

  const nome = datiStudente[2];
  const email = datiStudente[3];
  const idCartellaDrive = datiStudente[6];
  let linkCopia = '';

  try {
    const fileOriginale = DriveApp.getFileById(idFileMaster);
    const cartellaDestinazione = DriveApp.getFolderById(idCartellaDrive);
    
    let cartellaMateriali = cartellaDestinazione;
    const subFolders = cartellaDestinazione.getFoldersByName('01_ACCADEMIA_MATERIALI');
    
    if (subFolders.hasNext()) {
      cartellaMateriali = subFolders.next();
    }

    const fileCopiato = fileOriginale.makeCopy(`${titoloModulo} — ${nome} [${codiceNexus}]`, cartellaMateriali);
    linkCopia = fileCopiato.getUrl();

    // Aggiornamento Semaforo e Storico
    foglioCorsisti.getRange(rigaTrovata, 9).setValue('🟠 ARANCIONE');
    
    const adesso = new Date();
    const storicoAttuale = datiStudente[10] || '';
    foglioCorsisti.getRange(rigaTrovata, 11).setValue(storicoAttuale + `\n[${adesso.toLocaleDateString('it-IT')}] Assegnato documento: ${titoloModulo}`);

    // Email al corsista per avviso nuovo materiale
    if (email && email.includes('@')) {
      MailApp.sendEmail({
        to: email, 
        subject: `👑 NUOVO MATERIALE SBLOCCATO: ${titoloModulo} — SUPREMA FUTURE X`,
        htmlBody: `
          <div style="font-family: Arial, sans-serif; background: #090A0D; color: #ffffff; padding: 25px; border-left: 5px solid #00F0FF;">
            <h2 style="color: #00F0FF;">SUPREMA FUTURE X // ACADEMY</h2>
            <p>Gentile <strong>${nome}</strong>,</p>
            <p>La presidenza ha sbloccato per te una nuova risorsa operativa:</p>
            <p style="font-size: 16px; font-weight: bold; color: #D4AF37;">${titoloModulo}</p>
            <p>Il file è accessibile direttamente all'interno del tuo fascicolo di studio:</p>
            <br>
            <a href="${linkCopia}" style="display: inline-block; padding: 12px 24px; background: #00F0FF; color: #000; font-weight: bold; text-decoration: none; border-radius: 4px;">Accedi al Documento</a>
          </div>`
      });
    }

    inviaNotificaTelegram(
      `📄 <b>MODULO ASSEGNATO [${codiceNexus}]</b>\n\n` +
      `Corsista: <b>${nome}</b>\n` +
      `Risorsa: <b>${titoloModulo}</b>\n` +
      `Semaforo: 🟠 ARANCIONE`
    );
    
    return rispostaJson({ 
      status: 'success', 
      messaggio: `Documento ${titoloModulo} assegnato con successo.`, 
      linkFile: linkCopia 
    });

  } catch (err) {
    return rispostaJson({ status: 'error', errore: 'Errore duplicazione documento: ' + err.toString() });
  }
}

function aggiornaSemaforiCorsista(payload) {
  const foglioCorsisti = ottieniScheda('Corsisti_Ufficiali');
  const codiceNexus = String(payload.codiceNexus || '').trim();
  const tipoSemaforo = payload.tipoSemaforo; 
  const nuovoColore = payload.colore; 

  const datiC = foglioCorsisti.getDataRange().getValues();
  for (let i = 1; i < datiC.length; i++) {
    if (String(datiC[i][1]).trim() === codiceNexus) {
      const riga = i + 1;
      
      if (tipoSemaforo === 'PAGAMENTO') {
        foglioCorsisti.getRange(riga, 8).setValue(nuovoColore);
      }
      if (tipoSemaforo === 'MATERIALI') {
        foglioCorsisti.getRange(riga, 9).setValue(nuovoColore);
      }
      if (tipoSemaforo === 'AVANZAMENTO') {
        foglioCorsisti.getRange(riga, 10).setValue(nuovoColore);
      }
      
      return rispostaJson({ 
        status: 'success', 
        messaggio: `Semaforo ${tipoSemaforo} impostato su ${nuovoColore}` 
      });
    }
  }
  return rispostaJson({ status: 'error', messaggio: 'Corsista non identificato nel sistema.' });
}

function inviaNotificaTelegram(messaggio) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  try {
    UrlFetchApp.fetch(url, { 
      method: 'post', 
      contentType: 'application/json', 
      muteHttpExceptions: true, 
      payload: JSON.stringify({ 
        chat_id: TELEGRAM_CHAT_ID, 
        text: messaggio, 
        parse_mode: 'HTML' 
      }) 
    });
  } catch (e) {
    Logger.log("Errore Invio Telegram: " + e.toString());
  }
}

function testTelegram() {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  const risposta = UrlFetchApp.fetch(url, {
    method: 'post', 
    contentType: 'application/json', 
    muteHttpExceptions: true,
    payload: JSON.stringify({ 
      chat_id: TELEGRAM_CHAT_ID, 
      text: "👑 <b>SUPREMA FUTURE X</b>\nTest di connessione verificato con successo! Il NUOVO bot è collegato e operativo nel sistema esteso.", 
      parse_mode: 'HTML' 
    })
  });
  Logger.log("Risposta server Telegram: " + risposta.getContentText());
}

function inviaEmailBenvenutoCorsista(email, nome, corso, codice, linkDrive) {
  try {
    MailApp.sendEmail({
      to: email, 
      subject: `👑 BENVENUTO IN ${corso.toUpperCase()} — SUPREMA FUTURE X`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; background: #090A0D; color: #ffffff; padding: 30px; border: 2px solid #D4AF37;">
          <h1 style="color: #D4AF37; margin-top: 0;">SUPREMA FUTURE X</h1>
          <p>Gentile <strong>${nome}</strong>,</p>
          <p>Con la presente confermiamo il tuo accredito ufficiale nel percorso di alto profilo:</p>
          <p style="color: #00F0FF; font-size: 18px; font-weight: bold;">${corso}</p>
          <p>Il tuo codice matricola operativo permanente è: <strong>${codice}</strong></p>
          
          <div style="background: #1F2227; padding: 20px; border-left: 4px solid #D4AF37; margin: 25px 0;">
            <h3 style="color: #D4AF37; margin-top: 0;">IL TUO FASCICOLO DIGITALE RISERVATO</h3>
            <p style="font-size: 13px; color: #ccc;">La direzione ha creato un'area cloud dedicata dove troverai dispense, contratti, moduli didattici e dove caricherai i tuoi elaborati:</p>
            <br>
            <a href="${linkDrive}" style="display: inline-block; padding: 12px 25px; background: #D4AF37; color: #000; font-weight: bold; text-decoration: none; border-radius: 4px;">Apri Fascicolo Google Drive</a>
          </div>
          
          <p style="font-size: 12px; color: #777;">Direzione Generale Suprema Future X — CEO Giuliano Caratelli</p>
        </div>`
    });
  } catch (e) {
    Logger.log("Errore Invio Email Benvenuto: " + e.toString());
  }
}

/**
 * ====================================================================
 * OROLOGIO MARKETING, COMPLEANNI E PROMEMORIA (CRON JOB)
 * ====================================================================
 */
function orologioMarketingEAppuntamenti() {
  const master = ottieniFoglioMaster();
  const foglioMarketing = master.getSheetByName('Calendario_Marketing');
  const adesso = new Date();
  const oggiGiornoMese = Utilities.formatDate(adesso, 'GMT+2', 'dd/MM');

  // 1. GESTIONE COMPLEANNI E NEWSLETTER (15 GIORNI)
  if (foglioMarketing && foglioMarketing.getLastRow() > 1) {
    const datiM = foglioMarketing.getRange(2, 1, foglioMarketing.getLastRow() - 1, foglioMarketing.getLastColumn()).getValues();
    
    datiM.forEach(function(riga, idx) {
      const numRiga = idx + 2;
      const codice = riga[0];
      const nome = riga[1];
      const email = riga[2];
      const dataNascita = String(riga[3]);
      const dataUltimaNews = new Date(riga[5]);
      
      // Controllo Compleanno
      if (dataNascita.includes('/') && dataNascita.slice(0, 5) === oggiGiornoMese && email.includes('@')) {
        MailApp.sendEmail({
          to: email, 
          subject: `👑 BUON COMPLEANNO DA SUPREMA FUTURE X, ${nome.toUpperCase()}!`,
          htmlBody: `
            <div style="font-family: Arial, sans-serif; background: #090A0D; color: #fff; padding: 25px; border-left: 5px solid #D4AF37;">
              <h2 style="color: #D4AF37;">UN AUGURIO ESCLUSIVO DALLA DIREZIONE</h2>
              <p>Gentile <strong>${nome}</strong>,</p>
              <p>La presidenza e il team di <strong>Suprema Future X</strong> ti augurano un eccellente compleanno.</p>
              <p>Possa questo nuovo anno consolidare la tua crescita, visione e sovranità professionale.</p>
            </div>`
        });
        inviaNotificaTelegram(`🎂 <b>COMPLEANNO DI OGGI</b>\n\nAuguri inviati a: <b>${nome}</b> [${codice}]`);
      }

      // Controllo Newsletter (Scadenza 15 giorni)
      const diffGiorni = Math.floor((adesso.getTime() - dataUltimaNews.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffGiorni >= 15 && email.includes('@')) {
        MailApp.sendEmail({
          to: email, 
          subject: `👑 RADAR OPERATIVO SFX — NUOVI SVILUPPI E RISORSE`,
          htmlBody: `
            <div style="font-family: Arial, sans-serif; background: #090A0D; color: #fff; padding: 25px; border-left: 5px solid #00F0FF;">
              <h2 style="color: #00F0FF;">SUPREMA FUTURE X // RADAR PERIODICO</h2>
              <p>Gentile <strong>${nome}</strong>,</p>
              <p>Continuano gli aggiornamenti operativi dedicati al nostro ecosistema riservato.</p>
              <p>Se non hai ancora pianificato la tua sessione strategica con il CEO o desideri esplorare i nuovi moduli disponibili, rispondi direttamente a questa email o scrivici su WhatsApp.</p>
            </div>`
        });
        
        // Aggiorna la data dell'ultimo invio
        foglioMarketing.getRange(numRiga, 6).setValue(adesso.toISOString());
      }
    });
  }

  // 2. GESTIONE PROMEMORIA APPUNTAMENTI (7 GIORNI E 48 ORE)
  const foglioProvvisori = master.getSheetByName('Leads_Provvisori');
  if (foglioProvvisori && foglioProvvisori.getLastRow() > 1) {
    const datiP = foglioProvvisori.getRange(2, 1, foglioProvvisori.getLastRow() - 1, foglioProvvisori.getLastColumn()).getValues();
    
    datiP.forEach(function(r, idx) {
      const numR = idx + 2;
      const email = r[3];
      const data = r[7];
      const ora = r[8];
      const st7 = r[11];
      const st48 = r[12];
      
      if (!data || !ora) return;
      
      const pD = String(data).split(/[\/\-]/);
      const pO = String(ora).split(':');
      
      if (pD.length < 3 || pO.length < 2) return;
      
      const targetTime = new Date(parseInt(pD[2], 10), parseInt(pD[1], 10) - 1, parseInt(pD[0], 10), parseInt(pO[0], 10), parseInt(pO[1], 10)).getTime();
      const oreMancanti = (targetTime - adesso.getTime()) / (1000 * 60 * 60);

      // Promemoria 7 Giorni
      if (st7 === 'DA_INVIARE' && oreMancanti <= 168 && oreMancanti > 144 && email.includes('@')) {
        MailApp.sendEmail({ 
          to: email, 
          subject: `⏳ PROMEMORIA [-7 GIORNI] — Sessione Suprema Future X del ${data}`, 
          htmlBody: `
            <div style="font-family: Arial, sans-serif; background: #1F2227; color: #fff; padding: 20px;">
              <h3 style="color:#00F0FF;">BRIEFING INCONTRO</h3>
              <p>Ti ricordiamo l'appuntamento fissato per il <strong>${data} alle ${ora}</strong>.</p>
            </div>` 
        });
        foglioProvvisori.getRange(numR, 12).setValue('INVIATO');
      }

      // Promemoria 48 Ore
      if (st48 === 'DA_INVIARE' && oreMancanti <= 48 && oreMancanti > 24 && email.includes('@')) {
        MailApp.sendEmail({ 
          to: email, 
          subject: `🚨 CONFERMA RICHIESTA [-48 ORE] — Appuntamento del ${data}`, 
          htmlBody: `
            <div style="font-family: Arial, sans-serif; background: #1F2227; color: #fff; padding: 20px;">
              <h3 style="color:#D4AF37;">CONFERMA PRESENZA</h3>
              <p>Ti ricordiamo la sessione del <strong>${data} alle ${ora}</strong>.</p>
              <p>Ti chiediamo gentilmente di confermare la tua presenza rispondendo a questa mail.</p>
            </div>` 
        });
        foglioProvvisori.getRange(numR, 13).setValue('INVIATO');
      }
    });
  }
}
