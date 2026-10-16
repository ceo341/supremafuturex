/**
 * SUPREMA FUTURE X - CONTROLLER CHATBOT ALISON V42 (EAL6+ SOVRANO)
 * File: /js/chat-alison.js
 * Descrizione: Gestione delle pillole rapide, routing verso il motore 50 FAQ
 *              e fallback conversazionale conforme alla Governance del CEO Giuliano Caratelli.
 */

const ChatAlison = (function () {
    'use strict';

    let pillChatCounter = 0;

    /**
     * Risolve il contenitore attivo della chat nell'interfaccia
     * @returns {HTMLElement|null}
     */
    function getBoxChat() {
        return document.getElementById('box-chat-centrale') ||
               document.getElementById('box-chat-anteprima') ||
               document.getElementById('alison-chat-log');
    }

    /**
     * Invia un messaggio rapido tramite le Quick Pills della Landing Page.
     * @param {string} testoPill - Il testo della pillola selezionata dall'utente
     */
    function inviaPillChat(testoPill) {
        if (!testoPill) return;

        // Se è presente il motore centrale unificato (index.html / code.js), delega ad esso
        if (typeof window.inviaMessaggioCentrale === 'function') {
            window.inviaMessaggioCentrale(testoPill);
            return;
        }

        const boxChat = getBoxChat();
        if (!boxChat) return;

        pillChatCounter++;

        // Rendering bolla utente (Stile Sovrano EAL6+)
        const msgUtente = document.createElement('div');
        msgUtente.className = 'text-right my-2 font-mono text-xs';
        msgUtente.innerHTML = `
            <span class="inline-block bg-[#FAF7F2] text-[#090A0D] border border-stone-300 px-3.5 py-2 rounded-2xl shadow-sm font-semibold">
                &gt; ${testoPill}
            </span>
        `;
        boxChat.appendChild(msgUtente);
        boxChat.scrollTop = boxChat.scrollHeight;

        // Risposta calibrata di Alison (AG-01) a 300ms
        setTimeout(() => {
            generaRispostaAlison(testoPill);
        }, 300);

        // Notifica asincrona non bloccante al backend
        if (typeof ConnettoreApi !== 'undefined' && typeof ConnettoreApi.invia === 'function') {
            ConnettoreApi.invia('MESSAGGIO_ALISON_CHAT', { messaggio: testoPill }).catch(() => {});
        }
    }

    /**
     * Genera la risposta automatica di Alison in base alle direttive ufficiali
     * @param {string} richiesta 
     */
    function generaRispostaAlison(richiesta) {
        const boxChat = getBoxChat();
        if (!boxChat) return;

        const reqLow = richiesta.toLowerCase();
        let testoRisposta = "Richiesta acquisita nel registro neurale EAL6+. L'ufficio di Presidenza esaminerà il tuo profilo.";

        if (reqLow.includes('cors') || reqLow.includes('academy') || reqLow.includes('silver') || reqLow.includes('executive') || reqLow.includes('master')) {
            testoRisposta = "I percorsi formativi ufficiali di Suprema Academy sono 3: Silver Tier (99 €), Executive Master (149 €) con provisioning Drive, e Premium VIP (189 €) con mentoring diretto del CEO Giuliano Caratelli.";
        } else if (reqLow.includes('gold') || reqLow.includes('card') || reqLow.includes('punti')) {
            testoRisposta = "La Suprema Gold Card phygital certifica il tuo status con crittografia EAL6+. Include plafond convenzionati, concierge dedicato H24 e accesso ai vertici a porte chiuse.";
        } else if (reqLow.includes('direzione') || reqLow.includes('ceo') || reqLow.includes('conferenza') || reqLow.includes('giuliano') || pillChatCounter >= 4) {
            testoRisposta = "Per le decisioni strategiche di vertice o per l'avvio al lavoro immediato, è richiesta la sessione diretta in Conferenza Riservata con il CEO Giuliano Caratelli. Ti invito a compilare la scheda di accredito.";
        } else if (reqLow.includes('fisco') || reqLow.includes('tasse') || reqLow.includes('16')) {
            testoRisposta = "La conformità tributaria dell'Ecosistema è presidiata dall'Agente Neurale AG-03 Ginevra, che vincola il fondo fiscale intoccabile del 16% per la serenità contabile societaria.";
        } else if (reqLow.includes('negozi') || reqLow.includes('commercio') || reqLow.includes('chiavi in mano')) {
            testoRisposta = "L'attività commerciale digitale chiavi in mano include cataloghi luxury a magazzino zero. L'abilitazione è subordinata al colloquio selettivo con la Presidenza.";
        }

        const msgAlison = document.createElement('div');
        msgAlison.className = 'text-left my-2 font-mono text-xs';
        msgAlison.innerHTML = `
            <div class="inline-block bg-[#090A0D] text-gray-200 border border-[#D4AF37]/40 p-3.5 rounded-2xl shadow-md max-w-[90%] space-y-2">
                <div class="flex items-center space-x-1.5 text-[10px] text-[#00F0FF] font-bold uppercase tracking-wider">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse"></span>
                    <span>ALISON (AG-01) // CONCIERGE</span>
                </div>
                <p class="leading-relaxed text-gray-300 font-sans text-xs">${testoRisposta}</p>
                <div class="pt-1.5 border-t border-gray-800 flex flex-wrap gap-2">
                    <a href="#candidatura" class="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#D4AF37] hover:bg-yellow-500 text-black font-extrabold text-[10px] rounded-lg transition-all">
                        <span>Accredito Conferenza CEO</span>
                        <i class="fa-solid fa-crown text-[9px] ml-1"></i>
                    </a>
                    <a href="https://wa.me/393474429091" target="_blank" class="inline-flex items-center space-x-1 px-2.5 py-1 bg-green-600 hover:bg-green-500 text-white font-extrabold text-[10px] rounded-lg transition-all">
                        <i class="fa-brands fa-whatsapp text-[10px]"></i>
                        <span>WhatsApp Direzione</span>
                    </a>
                </div>
            </div>
        `;

        boxChat.appendChild(msgAlison);
        boxChat.scrollTop = boxChat.scrollHeight;
    }

    return {
        inviaPill: inviaPillChat,
        inviaMessaggio: inviaPillChat
    };
})();

// Esportazione per i pulsanti e le Quick Pills HTML
window.inviaPillChat = ChatAlison.inviaPill;
