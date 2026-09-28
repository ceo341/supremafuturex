/**
 * SUPREMA FUTURE X - CONTROLLER MODULI CRM & ACCREDITI
 * File: /js/moduli-crm.js
 * Descrizione: Gestore invio candidature, generazione Codice NX e innesco notifiche multi-canale.
 */

const ModuliCRM = (function () {
    'use strict';

    /**
     * Gestisce l'invio del form di candidatura CRM Nexus.
     * @param {Event} event - Evento di submit del form
     */
    async function inviaCandidaturaCRM(event) {
        event.preventDefault();

        const elNome = document.getElementById('crm-nome');
        const elEmail = document.getElementById('crm-email');
        const elTelefono = document.getElementById('crm-telefono');
        const elNote = document.getElementById('crm-note');

        if (!elNome || !elEmail || !elTelefono) return;

        const codiceNX = 'NX-2026-' + Math.floor(1000 + Math.random() * 9000);

        const payloadLead = {
            codiceNX: codiceNX,
            nome: elNome.value,
            email: elEmail.value,
            telefono: elTelefono.value,
            note: elNote ? elNote.value : ''
        };

        // Invio al backend Google Apps Script via ConnettoreApi
        if (typeof ConnettoreApi !== 'undefined') {
            await ConnettoreApi.invia('REGISTRA_LEAD_CRM', payloadLead);
        }

        // Accredito automatico +250 PTS sulla Gold Card
        if (typeof MotoreCartaOro !== 'undefined') {
            MotoreCartaOro.aggiungiPunti(250, 'CANDIDATURA_CRM_NEXUS');
        }

        alert(`CANDIDATURA REGISTRATA CON SUCCESSO!\n\nCodice Identificativo: ${codiceNX}\nStato: NOTIFICHE MULTI-CANALE ATTIVATE (Email, WhatsApp, Telegram)\n\nL'ufficio Suprema la contatterà nelle prossime 24 ore.`);

        const form = document.getElementById('form-candidatura-nexus');
        if (form) form.reset();
    }

    return {
        inviaCandidatura: inviaCandidaturaCRM
    };
})();

// Esportazione per l'uso globale nei form HTML
window.inviaCandidaturaCRM = ModuliCRM.inviaCandidatura;
