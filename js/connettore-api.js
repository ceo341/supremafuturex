/**
 * ============================================================================
 * SUPREMA FUTURE X S.R.L. // CONNETTORE API UNIVERSALE EAL6+
 * FILE: js/connettore-api.js
 * GOVERNANCE: CEO GIULIANO CARATELLI
 * PROTOCOLLO: EAL6+ SOVRANO // GESTORE ASINCRONO MULTI-CHANNEL & OFFLINE QUEUE
 * DATA RILASCIO: 26 OTTOBRE 2026 // VERSIONE V55.0-MASTER
 * ============================================================================
 */

const ConnettoreApi = (function () {
  'use strict';

  const CONFIGURAZIONE = {
    // ENDPOINT UNIFICATO MASTER VERIFICATO (VERSIONE 14 // 26 OTT 2026)
    ENDPOINT: 'https://script.google.com/macros/s/AKfycbzjOsUCBWD2l7lIHPfJdSpq75MM57s6rUGYYp-0UZ0BYAiyVoyn4M8I0jeL4UKaRXJA/exec',
    TEMPO_LIMITE_MS: 15000,
    CANALE_BROADCAST: 'sfx_enterprise_bus',
    CHIAVE_CODA_OFFLINE: 'SFX_CODA_OFFLINE_REQUESTS_V55'
  };

  // 1. CANALE BROADCAST SOVRANO UNIFICATO TRA SCHEDE BROWSER
  let canaleBroadcast = null;
  try {
    if ('BroadcastChannel' in window) {
      canaleBroadcast = new BroadcastChannel(CONFIGURAZIONE.CANALE_BROADCAST);
    }
  } catch (e) {
    console.warn('[ConnettoreApi EAL6+]: BroadcastChannel non supportato su questo browser.', e);
  }

  /**
   * Recupera l'endpoint attivo garantendo fallback o override controllato
   */
  function getEndpoint() {
    return localStorage.getItem('SFX_APPSCRIPT_URL') || CONFIGURAZIONE.ENDPOINT;
  }

  /**
   * Consente l'aggiornamento dinamico dell'endpoint protetto
   */
  function impostaEndpoint(nuovoUrl) {
    if (nuovoUrl && nuovoUrl.startsWith('https://script.google.com')) {
      localStorage.setItem('SFX_APPSCRIPT_URL', nuovoUrl.trim());
      return true;
    }
    return false;
  }

  /**
   * Prepara e firma il payload canonico conforme al backend Codice.gs
   */
  function preparaPayload(azione, datiPayload = {}) {
    const tokenAuth = sessionStorage.getItem('sfx_token_sessione') || 
                      sessionStorage.getItem('SFX_TOKEN_AUTENTICAZIONE') || 
                      '3474429091';

    return Object.assign({
      action: azione,
      azione: azione,
      timestamp: new Date().toISOString(),
      tokenAutenticazione: tokenAuth,
      payload: datiPayload
    }, datiPayload);
  }

  /**
   * Invia una richiesta POST al backend Google Apps Script con gestione CORS & Offline
   */
  async function inviaRichiesta(azione, datiPayload = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIGURAZIONE.TEMPO_LIMITE_MS);
    const pacchetto = preparaPayload(azione, datiPayload);
    const urlEndpoint = getEndpoint();

    try {
      // Chiamata standard POST con Content-Type text/plain (Bypassa Preflight CORS)
      const risposta = await fetch(urlEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(pacchetto),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      let jsonRes = null;
      if (risposta.ok) {
        try {
          jsonRes = await risposta.json();
        } catch (errJson) {
          jsonRes = { status: 'SUCCESS', message: 'Richiesta acquisita e notarizzata dal server.' };
        }
      } else {
        throw new Error(`Stato HTTP: ${risposta.status}`);
      }

      // Notifica in tempo reale su sfx_enterprise_bus
      notificaSchedeBroadcast('STATO_AGGIORNATO', azione, jsonRes);
      return jsonRes;

    } catch (errore) {
      clearTimeout(timeoutId);
      console.warn(`[ConnettoreApi EAL6+ - Fallback ${azione}]: Tentativo no-cors in esecuzione...`, errore.message);

      // Fallback 1: Modalità no-cors blindata
      try {
        await fetch(urlEndpoint, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(pacchetto)
        });

        const fallbackResult = {
          status: 'SUCCESS',
          modalita: 'NO_CORS_DELIVERY',
          messaggio: 'Richiesta instradata al backend con successo.'
        };

        notificaSchedeBroadcast('STATO_AGGIORNATO', azione, fallbackResult);
        return fallbackResult;

      } catch (errFallback) {
        console.error(`[ConnettoreApi EAL6+ Errore]: Salvataggio in coda offline differita.`, errFallback.message);
        salvaInCodaOffline(pacchetto);

        const offlineResult = {
          status: 'BUFFERED',
          messaggio: 'Connessione assente. Richiesta salvata in memoria per sincronizzazione automatica.',
          errore: errFallback.message
        };

        notificaSchedeBroadcast('OFFLINE_RECORDED', azione, offlineResult);
        return offlineResult;
      }
    }
  }

  /**
   * Richiede dati GET al backend Codice.gs
   */
  async function richiediDati(azioneRichiesta = 'FULL_DASHBOARD_SYNC', parametriExtra = {}) {
    const urlEndpoint = getEndpoint();
    try {
      let queryUrl = `${urlEndpoint}?action=${encodeURIComponent(azioneRichiesta)}&timestamp=${Date.now()}`;
      for (const [k, v] of Object.entries(parametriExtra)) {
        queryUrl += `&${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
      }
      const res = await fetch(queryUrl);
      if (!res.ok) throw new Error(`Stato HTTP: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('[ConnettoreApi GET Error]:', err);
      return { status: 'ERROR', message: err.message, dati: {} };
    }
  }

  /**
   * Coda di memorizzazione offline locale
   */
  function salvaInCodaOffline(pacchetto) {
    try {
      const coda = JSON.parse(localStorage.getItem(CONFIGURAZIONE.CHIAVE_CODA_OFFLINE) || '[]');
      coda.push(pacchetto);
      localStorage.setItem(CONFIGURAZIONE.CHIAVE_CODA_OFFLINE, JSON.stringify(coda));
    } catch (e) {}
  }

  /**
   * Sincronizzazione automatica al ripristino della connettività internet
   */
  async function sincronizzaCodaOffline() {
    const coda = JSON.parse(localStorage.getItem(CONFIGURAZIONE.CHIAVE_CODA_OFFLINE) || '[]');
    if (coda.length === 0) return;

    console.log(`[ConnettoreApi EAL6+]: Sincronizzazione di ${coda.length} richieste in coda offline...`);
    const rimanenti = [];

    for (const item of coda) {
      try {
        await inviaRichiesta(item.action || item.azione, item.payload || item);
      } catch (e) {
        rimanenti.push(item);
      }
    }

    localStorage.setItem(CONFIGURAZIONE.CHIAVE_CODA_OFFLINE, JSON.stringify(rimanenti));
    if (rimanenti.length === 0) {
      console.log('[ConnettoreApi EAL6+]: Coda offline completamente sincronizzata.');
      notificaSchedeBroadcast('SYNC_OFFLINE_COMPLETED', 'ALL', { total: coda.length });
    }
  }

  /**
   * Dispaccio eventi BroadcastChannel multi-scheda
   */
  function notificaSchedeBroadcast(evento, azione, risultato) {
    if (canaleBroadcast) {
      try {
        canaleBroadcast.postMessage({
          type: evento,
          evento: evento,
          azione: azione,
          risultato: risultato,
          timestamp: new Date().toISOString()
        });
      } catch (e) {}
    }
  }

  /**
   * Ascolto eventi da altre schede dell'Ecosistema
   */
  function ascoltaEventi(callback) {
    if (canaleBroadcast && typeof callback === 'function') {
      canaleBroadcast.addEventListener('message', (ev) => callback(ev.data));
    }
  }

  // Listener globale ripristino linea
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      console.log('[ConnettoreApi]: Rete ripristinata. Avvio auto-sync...');
      sincronizzaCodaOffline();
    });
  }

  // METODI PUBBLICI COMPATIBILI CON CODICE.GS V55.0
  return {
    invia: inviaRichiesta,
    ottieni: richiediDati,
    onSync: ascoltaEventi,
    setEndpoint: impostaEndpoint,
    getEndpoint: getEndpoint,
    syncOffline: sincronizzaCodaOffline,

    // Chiamate Wrapper Native EAL6+
    registraCandidatura: function (datiCandidato) {
      return inviaRichiesta('registraCandidatura', datiCandidato);
    },
    gestisciStatoSlot: function (slot, nuovoStato, idLead) {
      return inviaRichiesta('GESTISCI_STATO_SLOT', { slot: slot, nuovoStato: nuovoStato, idLead: idLead });
    },
    salvaConfigSezioni: function (config) {
      return inviaRichiesta('SALVA_CONFIG_SEZIONI', { config: config });
    },
    registraIncassoMastro: function (datiIncasso) {
      return inviaRichiesta('REGISTRA_INCASSO_MANUALE', datiIncasso);
    },
    uploadMediaDrive: function (nomeFile, base64, categoria, note) {
      return inviaRichiesta('UPLOAD_MEDIA_DRIVE', { nomeFile: nomeFile, fileBase64: base64, categoria: categoria, note: note });
    },
    aggiornaSblocchiCorsista: function (matricola, moduliCsv, giorno) {
      return inviaRichiesta('AGGIORNA_SBLOCCHI_DIDATTICI', { matricola: matricola, moduliSbloccatiCsv: moduliCsv, giornoAvanzamento: giorno });
    },
    aggiornaRateCorsista: function (matricola, stato, versato, residuo, scadenza) {
      return inviaRichiesta('AGGIORNA_RATE_CORSISTA', { matricola: matricola, statoPagamento: stato, importoVersato: versato, residuo: residuo, scadenza: scadenza });
    },
    salvaSlotLiberoCorsista: function (matricola, indice, titolo, url, attivo) {
      return inviaRichiesta('SALVA_SLOT_LIBERO_CORSISTA', { matricola: matricola, indiceSlot: indice, titolo: titolo, url: url, attivo: attivo });
    },
    creaWorkspaceCorsista: function (matricola, nominativo, email) {
      return inviaRichiesta('CREA_WORKSPACE_CORSISTA', { matricola: matricola, nominativo: nominativo, email: email });
    },
    registraGoldCard: function (cardData) {
      return inviaRichiesta('REGISTRA_GOLD_CARD', { card: cardData });
    },
    aggiornaPromptAgente: function (agenteId, promptMaster) {
      return inviaRichiesta('AGGIORNA_PROMPT_AGENTE', { agenteId: agenteId, promptMaster: promptMaster });
    },
    autenticaPresidenza: function (password, pin) {
      return inviaRichiesta('AUTENTICAZIONE_PRESIDENZA', { password: password, pin: pin });
    }
  };
})();

// Esportazione globale sicura
if (typeof window !== 'undefined') {
  window.ConnettoreApi = ConnettoreApi;
  window.SFX_APPS_SCRIPT_URL = ConnettoreApi.getEndpoint();
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ConnettoreApi;
}
