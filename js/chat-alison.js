/**
 * SUPREMA FUTURE X - CONTROLLER CHATBOT ALISON V3
 * File: /js/chat-alison.js
 * Descrizione: Gestione dell'interfaccia conversazionale, invio pillole rapide e risposte direzionali.
 */

const ChatAlison = (function () {
    'use strict';

    /**
     * Invia un messaggio rapido tramite le Quick Pills della Landing Page.
     * @param {string} testoPill - Il testo della pillola selezionata dall'utente
     */
    function inviaPillChat(testoPill) {
        const boxChat = document.getElementById('box-chat-anteprima');
        if (!boxChat) return;

        // Aggiunge il messaggio dell'utente alla chat
        const msgUtente = document.createElement('div');
        msgUtente.className = 'messaggio-utente';
        msgUtente.style.textAlign = 'right';
        msgUtente.style.margin = '8px 0';
        msgUtente.style.color = 'var(--ciano-neon)';
        msgUtente.style.fontFamily = 'var(--font-mono)';
        msgUtente.style.fontSize = '0.8rem';
        msgUtente.textContent = `> ${testoPill}`;
        boxChat.appendChild(msgUtente);

        // Simulazione risposta dinamica Alison
        setTimeout(() => {
            generaRispostaAlison(testoPill);
        }, 600);

        // Sincronizzazione con il backend tramite ConnettoreApi
        if (typeof ConnettoreApi !== 'undefined') {
            ConnettoreApi.invia('MESSAGGIO_ALISON_CHAT', { messaggio: testoPill });
        }
    }

    /**
     * Genera la risposta automatica di Alison in base all'argomento.
     */
    function generaRispostaAlison(richiesta) {
        const boxChat = document.getElementById('box-chat-anteprima');
        if (!boxChat) return;

        let testoRisposta = "Richiesta presa in carico. L'ufficio Suprema la contatterà nelle prossime 24 ore.";

        if (richiesta.includes('Corsi')) {
            testoRisposta = "I percorsi formativi dell'Accademia (Silver, Gold e Premium) includono certificazione EAL6+. Consulta la sezione Accademia per i dettagli dei moduli.";
        } else if (richiesta.includes('Gold Card')) {
            testoRisposta = "La Suprema Gold Card tricolore traccia la tua fedeltà su 6 Gradi. Ogni interazione nell'ecosistema ti accredita punti automatici.";
        } else if (richiesta.includes('Direzione')) {
            testoRisposta = "Per accedere al contatto riservato con la Governance, compila il form di Accredito CRM Nexus con il tuo profilo aziendale.";
        }

        const msgAlison = document.createElement('div');
        msgAlison.className = 'messaggio-alison';
        msgAlison.innerHTML = `<p>${testoRisposta}</p>`;
        boxChat.appendChild(msgAlison);
        boxChat.scrollTop = boxChat.scrollHeight;
    }

    return {
        inviaPill: inviaPillChat
    };
})();

// Esportazione per l'uso globale nei pulsanti HTML
window.inviaPillChat = ChatAlison.inviaPill;
