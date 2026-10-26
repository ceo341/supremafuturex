/**
 * ============================================================================
 * SUPREMA FUTURE X S.R.L. // DELTA QUEUE OFFLINE ENGINE EAL6+
 * FILE: sfx-delta-patch.js
 * GOVERNANCE: CEO GIULIANO CARATELLI
 * PROTOCOLLO: EAL6+ SOVRANO // OFFLINE STORAGE & RESILIENT AUTO-SYNC
 * DATA RILASCIO: 26 OTTOBRE 2026 // VERSIONE V55.0-MASTER
 * ============================================================================
 */

(function (window) {
  'use strict';

  const QUEUE_STORAGE_KEY = 'sfx_delta_queue_v55';
  const APPS_SCRIPT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzjOsUCBWD2l7lIHPfJdSpq75MM57s6rUGYYp-0UZ0BYAiyVoyn4M8I0jeL4UKaRXJA/exec';

  const SFXDeltaQueue = {
    getCoda() {
      try {
        const data = localStorage.getItem(QUEUE_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        return [];
      }
    },

    salvaCoda(coda) {
      try {
        localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(coda));
      } catch (e) {}
    },

    accoda(payload) {
      const coda = this.getCoda();
      coda.push({
        id: 'DELTA_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        timestamp: new Date().toISOString(),
        payload: payload,
        tentativi: 0
      });

      this.salvaCoda(coda);
      this.aggiornaBadgeStato();

      if (navigator.onLine) {
        this.sincronizza();
      }
    },

    async sincronizza() {
      if (!navigator.onLine) return;
      const coda = this.getCoda();
      if (coda.length === 0) return;

      const codaRimanente = [];
      const endpointAttivo = window.SFX_APPS_SCRIPT_URL || APPS_SCRIPT_ENDPOINT;

      for (const item of coda) {
        try {
          item.tentativi++;
          const response = await fetch(endpointAttivo, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(item.payload)
          });

          const resData = await response.json();
          if (!resData || (resData.status !== 'SUCCESS' && resData.status !== 'success' && !resData.idSfx)) {
            codaRimanente.push(item);
          }
        } catch (err) {
          if (item.tentativi < 10) codaRimanente.push(item);
        }
      }

      this.salvaCoda(codaRimanente);
      this.aggiornaBadgeStato();
    },

    aggiornaBadgeStato() {
      const badge = document.getElementById('delta-queue-status-badge');
      const coda = this.getCoda();
      if (!badge) return;

      if (!navigator.onLine) {
        badge.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FFBF00]/20 text-[#FFBF00] border border-[#FFBF00]/40 animate-pulse";
        badge.innerHTML = `<i class="fa-solid fa-wifi-slash mr-1"></i>OFFLINE (${coda.length})`;
      } else if (coda.length > 0) {
        badge.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 animate-pulse";
        badge.innerHTML = `<i class="fa-solid fa-arrows-rotate fa-spin mr-1"></i>SYNC (${coda.length})`;
      } else {
        badge.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-950 text-green-400 border border-green-800";
        badge.innerHTML = `<i class="fa-solid fa-circle text-[8px] mr-1"></i>EAL6+ ONLINE`;
      }
    }
  };

  window.SFXDeltaQueue = SFXDeltaQueue;

  window.addEventListener('online', () => {
    SFXDeltaQueue.aggiornaBadgeStato();
    SFXDeltaQueue.sincronizza();
  });

  window.addEventListener('offline', () => {
    SFXDeltaQueue.aggiornaBadgeStato();
  });

  document.addEventListener('DOMContentLoaded', () => {
    SFXDeltaQueue.aggiornaBadgeStato();
    if (navigator.onLine) SFXDeltaQueue.sincronizza();
    setInterval(() => {
      if (navigator.onLine && SFXDeltaQueue.getCoda().length > 0) {
        SFXDeltaQueue.sincronizza();
      }
    }, 20000);
  });
})(window);
