/**
 * SUPREMA FUTURE X - MOTORE CARTA ORO (6 GRADI)
 * File: /js/carta-oro.js
 * Descrizione: Calcolatore di punteggio, avanzamento di grado automatico e persistenza dati della Gold Card.
 */

const MotoreCartaOro = (function () {
    'use strict';

    // Struttura rigida dei 6 Gradi stabilita dal CEO
    const GRADI = [
        { grado: 1, codice: 'SILVER_MEMBER', nome: 'Silver Member', puntiMinimi: 0, puntiMassimi: 499, colore: '#C0C0C0' },
        { grado: 2, codice: 'GOLD_AMBASSADOR', nome: 'Gold Ambassador', puntiMinimi: 500, puntiMassimi: 1499, colore: '#D4AF37' },
        { grado: 3, codice: 'PLATINUM_EXECUTIVE', nome: 'Platinum Executive', puntiMinimi: 1500, puntiMassimi: 3499, colore: '#E5E4E2' },
        { grado: 4, codice: 'DIAMOND_SOVEREIGN', nome: 'Diamond Sovereign', puntiMinimi: 3500, puntiMassimi: 6999, colore: '#00F0FF' },
        { grado: 5, codice: 'TITANIUM_ELITE', nome: 'Titanium Elite', puntiMinimi: 7000, puntiMassimi: 11999, colore: '#8A9EA7' },
        { grado: 6, codice: 'SOVEREIGN_FOUNDER', nome: 'Sovereign Founder Circle', puntiMinimi: 12000, puntiMassimi: Infinity, colore: '#FFD700' }
    ];

    const CHIAVE_MEMORIA = 'SFX_STATO_CARTA_ORO';

    /**
     * Recupera lo stato attuale della carta dal browser o ne crea uno iniziale.
     * @returns {Object} Stato utente
     */
    function ottieniStatoCarta() {
        const datiLocali = localStorage.getItem(CHIAVE_MEMORIA);
        if (datiLocali) {
            try {
                return JSON.parse(datiLocali);
            } catch (e) {
                console.error('[MotoreCartaOro]: Errore lettura dati locali.', e);
            }
        }

        const nuovoStato = {
            idCarta: 'SFX-' + Math.floor(100000 + Math.random() * 900000),
            punti: 0,
            infoGrado: GRADI[0],
            ultimoAggiornamento: new Date().toISOString()
        };

        salvaStatoCarta(nuovoStato);
        return nuovoStato;
    }

    function salvaStatoCarta(stato) {
        localStorage.setItem(CHIAVE_MEMORIA, JSON.stringify(stato));
    }

    /**
     * Aggiunge punti all'utente, calcola il passaggio di grado e invia i dati al database.
     * @param {number} puntiDaAggiungere - Punti da accreditare
     * @param {string} causale - Motivo dell'accredito
     */
    async function aggiungiPunti(puntiDaAggiungere, causale = 'AZIONATURA_ECOSISTEMA') {
        const stato = ottieniStatoCarta();
        stato.punti += puntiDaAggiungere;

        // Calcolo dinamico del grado
        const gradoCorrente = GRADI.slice().reverse().find(g => stato.punti >= g.puntiMinimi) || GRADI[0];
        const ePromosso = gradoCorrente.grado > stato.infoGrado.grado;

        stato.infoGrado = gradoCorrente;
        stato.ultimoAggiornamento = new Date().toISOString();

        salvaStatoCarta(stato);
        aggiornaInterfaccia(stato);

        // Invia l'aggiornamento al database centrale tramite il connettore API
        if (typeof ConnettoreApi !== 'undefined') {
            await ConnettoreApi.invia('AGGIORNA_PUNTI_FEDELTA', {
                idCarta: stato.idCarta,
                puntiAggiunti: puntiDaAggiungere,
                puntiTotali: stato.punti,
                grado: gradoCorrente.nome,
                causale: causale
            });
        }

        if (ePromosso) {
            mostraEventoPromozione(gradoCorrente);
        }

        return stato;
    }

    /**
     * Aggiorna gli elementi della carta visibili sulla pagina.
     */
    function aggiornaInterfaccia(stato) {
        const elPunti = document.getElementById('mostra-punti-carta');
        const elGrado = document.getElementById('mostra-grado-carta');
        const elId = document.getElementById('mostra-id-carta');

        if (elPunti) elPunti.textContent = `${stato.punti.toLocaleString('it-IT')} PTS`;
        if (elGrado) {
            elGrado.textContent = stato.infoGrado.nome;
            elGrado.style.color = stato.infoGrado.colore;
        }
        if (elId) elId.textContent = stato.idCarta;
    }

    function mostraEventoPromozione(grado) {
        console.log(`[MotoreCartaOro]: PROMOZIONE! Nuovo Grado: ${grado.nome}`);
        const modale = document.getElementById('modale-promozione-grado');
        if (modale) {
            const elTitolo = modale.querySelector('.titolo-grado');
            if (elTitolo) elTitolo.textContent = grado.nome;
            modale.classList.add('visibile');
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        aggiornaInterfaccia(ottieniStatoCarta());
    });

    return {
        ottieniStato: ottieniStatoCarta,
        aggiungiPunti: aggiungiPunti,
        ottieniGradi: function () { return GRADI; }
    };
})();
