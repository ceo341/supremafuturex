/**
 * ====================================================================
 * SUPREMA FUTURE X S.R.L. // MASTER JAVASCRIPT ENGINE V35 (INTEGRALE)
 * GOVERNANCE: CEO GIULIANO CARATELLI
 * PROTOCOLLO: EAL6+ SOVRANO
 * ====================================================================
 */

// URL Webhook Ufficiale Google Apps Script Master Engine
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzegxbf4ZpkJkrb4NVJsTlYmfles9jW9VTw0hv8JWRdF6251ag3SKBGVq-eR1rfvwBQ3g/exec';

/**
 * 1. DIZIONARIO TRADUZIONE INTEGRALE A 10 LINGUE (100% COVERAGE)
 */
window.DIZIONARIO_LINGUE = {
    IT: {
        "hero-desc": "Community, Networking & Academy <strong>ENTERPRISE</strong> potente e piena di risultati. Ecosistema d'élite per Formazione, Leadership, Luxury Fittings e Innovazione Neurale guidato dalla Direzione del CEO GIULIANO.",
        "alison-title": "ALISON // EXECUTIVE ASSISTANT",
        "ceo-title": "CONFERENZA CON IL CEO",
        "ceo-desc": "Sessioni esclusive a numero chiuso con la Direzione del CEO GIULIANO.",
        "academy-title": "SUPREMA ACADEMY",
        "goldcard-title": "SUPREMA GOLD CARD",
        "luxury-title": "BOUTIQUE LUXURY",
        "antigravity-title": "LINEA ANTIGRAVITY",
        "multimedia-title": "SUPREMA MULTIMEDIA LIBRARY",
        "gateway-title": "GATEWAY PAGAMENTI"
    },
    FR: {
        "hero-desc": "Communauté, Networking et Académie <strong>ENTERPRISE</strong> puissante et pleine de résultats. Écosystème d'élite pour la Formation, le Leadership, le Luxury Fittings et l'Innovation Neurale guidé par le CEO GIULIANO.",
        "alison-title": "ALISON // ASSISTANTE EXÉCUTIVE",
        "ceo-title": "CONFÉRENCE AVEC LE CEO",
        "ceo-desc": "Sessions exclusives en comité restreint avec la Direction du CEO GIULIANO.",
        "academy-title": "ACADÉMIE SUPREMA",
        "goldcard-title": "CARTE D'OR SUPREMA",
        "luxury-title": "BOUTIQUE LUXE",
        "antigravity-title": "LIGNE ANTIGRAVITÉ",
        "multimedia-title": "BIBLIOTHÈQUE MULTIMÉDIA SUPREMA",
        "gateway-title": "PASSERELLE DE PAIEMENT"
    },
    EN: {
        "hero-desc": "Powerful <strong>ENTERPRISE</strong> Community, Networking & Academy full of results. Elite ecosystem for Training, Leadership, Luxury Fittings and Neural Innovation led by CEO GIULIANO.",
        "alison-title": "ALISON // EXECUTIVE ASSISTANT",
        "ceo-title": "CONFERENCE WITH THE CEO",
        "ceo-desc": "Exclusive limited-enrollment sessions with the Management of CEO GIULIANO.",
        "academy-title": "SUPREMA ACADEMY",
        "goldcard-title": "SUPREMA GOLD CARD",
        "luxury-title": "BOUTIQUE LUXURY",
        "antigravity-title": "ANTIGRAVITY LINE",
        "multimedia-title": "SUPREMA MULTIMEDIA LIBRARY",
        "gateway-title": "PAYMENT GATEWAY"
    },
    SK: {
        "hero-desc": "Výkonná komunita, Networking a Akadémia <strong>ENTERPRISE</strong> plná výsledkov. Elitný ekosystém pre Vzdelávanie, Líderstvo, Luxury Fittings a Inováciu pod vedením CEO GIULIANA.",
        "alison-title": "ALISON // EXEKUTÍVNA ASISTENTKA",
        "ceo-title": "KONFERENCIA S CEO",
        "ceo-desc": "Exkluzívne uzatvorené relácie s vedením CEO GIULIANA.",
        "academy-title": "AKADÉMIA SUPREMA",
        "goldcard-title": "ZLATÁ KARTA SUPREMA",
        "luxury-title": "LUXUSNÁ BUTIKOVÁ LÍNIA",
        "antigravity-title": "ANTIGRAVITAČNÁ LÍNIA",
        "multimedia-title": "MULTIMEDIÁLNA KNIZNICA SUPREMA",
        "gateway-title": "PLATOBNÁ BRÁNA"
    },
    RO: {
        "hero-desc": "Comunitate, Networking și Academie <strong>ENTERPRISE</strong> puternică și plină de rezultate. Ecosistem de elită pentru Formare, Leadership, Luxury Fittings și Inovație Neurală sub direcția CEO GIULIANO.",
        "alison-title": "ALISON // ASISTENT EXECUTIV",
        "ceo-title": "CONFERINȚĂ CU CEO",
        "ceo-desc": "Sesiuni exclusive cu număr limitat sub direcția CEO GIULIANO.",
        "academy-title": "ACADEMIA SUPREMA",
        "goldcard-title": "CARDUL DE AUR SUPREMA",
        "luxury-title": "BOUTIQUE LUXURY",
        "antigravity-title": "LINIA ANTIGRAVITATE",
        "multimedia-title": "BIBLIOTECA MULTIMEDIA SUPREMA",
        "gateway-title": "PASARELĂ DE PLATĂ"
    },
    DE: {
        "hero-desc": "Leistungsstarke <strong>ENTERPRISE</strong> Community, Networking & Akademie voller Ergebnisse. Elite-Ökosystem für Ausbildung, Führung, Luxury Fittings und Innovation unter der Leitung von CEO GIULIANO.",
        "alison-title": "ALISON // EXECUTIVE ASSISTANTIN",
        "ceo-title": "KONFERENZ MIT DEM CEO",
        "ceo-desc": "Exklusive Sitzungen in kleinem Rahmen mit der Leitung von CEO GIULIANO.",
        "academy-title": "SUPREMA AKADEMIE",
        "goldcard-title": "SUPREMA GOLD CARD",
        "luxury-title": "LUXUS-BOUTIQUE",
        "antigravity-title": "ANTIGRAVITATIONS-LINIE",
        "multimedia-title": "SUPREMA MULTIMEDIA-BIBLIOTHEK",
        "gateway-title": "ZAHLUNGSGATEWAY"
    },
    ES: {
        "hero-desc": "Comunidad, Networking y Academia <strong>ENTERPRISE</strong> potente y llena de resultados. Ecosistema de élite para Formación, Liderazgo, Luxury Fittings e Innovación Neural bajo la dirección del CEO GIULIANO.",
        "alison-title": "ALISON // ASISTENTE EJECUTIVA",
        "ceo-title": "CONFERENCIA CON EL CEO",
        "ceo-desc": "Sesiones exclusivas de cupo limitado con la Dirección del CEO GIULIANO.",
        "academy-title": "ACADEMIA SUPREMA",
        "goldcard-title": "TARJETA DE ORO SUPREMA",
        "luxury-title": "BOUTIQUE DE LUJO",
        "antigravity-title": "LÍNEA ANTIGRAVEDAD",
        "multimedia-title": "BIBLIOTECA MULTIMEDIA SUPREMA",
        "gateway-title": "PASARELA DE PAGO"
    },
    CS: {
        "hero-desc": "Výkonná komunita, Networking a Akademie <strong>ENTERPRISE</strong> plná výsledků. Elitní ekosystém pro Vzdělávání, Lídrovství, Luxury Fittings a Inovaci pod vedením CEO GIULIANA.",
        "alison-title": "ALISON // EXEKUTIVNÍ ASISTENTKA",
        "ceo-title": "KONFERENCE S CEO",
        "ceo-desc": "Exkluzivní uzavřená setkání s vedením CEO GIULIANA.",
        "academy-title": "AKADEMIE SUPREMA",
        "goldcard-title": "ZLATÁ KARTA SUPREMA",
        "luxury-title": "LUXUSNÍ BUTIK",
        "antigravity-title": "ANTIGRAVITAČNÍ ŘADA",
        "multimedia-title": "MULTIMEDIÁLNÍ KNIHOVNA SUPREMA",
        "gateway-title": "PLATEBNÍ BRÁNA"
    },
    PT: {
        "hero-desc": "Comunidade, Networking e Academia <strong>ENTERPRISE</strong> potente e cheia de resultados. Ecossistema de elite para Formação, Liderança, Luxury Fittings e Inovação Neural sob a direção do CEO GIULIANO.",
        "alison-title": "ALISON // ASSISTENTE EXECUTIVA",
        "ceo-title": "CONFERÊNCIA COM O CEO",
        "ceo-desc": "Sessões exclusivas com vagas limitadas sob a Direção do CEO GIULIANO.",
        "academy-title": "ACADEMIA SUPREMA",
        "goldcard-title": "CARTÃO DE OURO SUPREMA",
        "luxury-title": "BOUTIQUE DE LUXO",
        "antigravity-title": "LINHA ANTIGRAVIDADE",
        "multimedia-title": "BIBLIOTECA MULTIMÍDIA SUPREMA",
        "gateway-title": "GATEWAY DE PAGAMENTO"
    },
    SQ: {
        "hero-desc": "Komunitet, Networking dhe Akademi <strong>ENTERPRISE</strong> i fuqishëm dhe me shumë rezultate. Ekosistem elitë për Trajnim, Udhëheqje, Luxury Fittings dhe Inovacion i udhëhequr nga CEO GIULIANO.",
        "alison-title": "ALISON // ASISTENTE EKZEKUTIVE",
        "ceo-title": "KONFERENCË ME CEO-N",
        "ceo-desc": "Sesione ekskluzive me numër të kufizuar me Drejtimin e CEO GIULIANO.",
        "academy-title": "AKADEMIA SUPREMA",
        "goldcard-title": "KARTA E ARTË SUPREMA",
        "luxury-title": "BUTIK LUKSI",
        "antigravity-title": "LINJA ANTIGRAVITET",
        "multimedia-title": "BIBLIOTEKA MULTIMEDIA SUPREMA",
        "gateway-title": "PORTA E PAGESAVE"
    }
};

/**
 * 2. CONNECTOR API WEBHOOK (INGESTION LEADS & QUEUE FALLBACK)
 */
window.SFXConnector = {
    async inviaLead(payload) {
        try {
            if (!navigator.onLine && window.SFXDeltaQueue) {
                window.SFXDeltaQueue.accoda(payload);
                return { status: "queued", message: "Inviato in coda offline Delta Queue" };
            }

            const response = await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.warn("[SFX CONNECTOR] Connessione non disponibile. Inserimento in coda offline:", error);
            if (window.SFXDeltaQueue) {
                window.SFXDeltaQueue.accoda(payload);
            }
            return { status: "queued_error", error: error.toString() };
        }
    },

    async recuperaLeads() {
        try {
            const response = await fetch(APPS_SCRIPT_URL + '?action=GET_LEADS');
            const data = await response.json();
            return data.leads || [];
        } catch (error) {
            console.error("[SFX CONNECTOR] Errore recupero leads:", error);
            return [];
        }
    }
};

/**
 * 3. MOTORE CHATBOT ALISON V3 & SINTESI VOCALE WEBAUDIO + VOICE RECOGNITION
 */
window.AlisonEngine = {
    sintesi: window.speechSynthesis || null,
    riconoscitore: null,

    parla(testo) {
        if (!this.sintesi) return;
        this.sintesi.cancel();

        const utterance = new SpeechSynthesisUtterance(testo);
        utterance.lang = 'it-IT';
        utterance.pitch = 1.05;
        utterance.rate = 0.95;

        const voci = this.sintesi.getVoices();
        const voceIT = voci.find(v => v.lang.includes('it') && (v.name.includes('Alice') || v.name.includes('Elsa') || v.name.includes('Federica') || v.name.includes('Female')));
        if (voceIT) utterance.voice = voceIT;

        this.sintesi.speak(utterance);
    },

    avviaRiconoscimentoVocale() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Il tuo browser non supporta l'input vocale diretto. Digita il messaggio.");
            return;
        }

        if (!this.riconoscitore) {
            this.riconoscitore = new SpeechRecognition();
            this.riconoscitore.lang = 'it-IT';
            this.riconoscitore.interimResults = false;

            this.riconoscitore.onresult = (e) => {
                const trascrizione = e.results[0][0].transcript;
                const inputElem = document.getElementById('input-centrale');
                if (inputElem) {
                    inputElem.value = trascrizione;
                    inviaMessaggioCentrale();
                }
            };

            this.riconoscitore.onerror = (e) => {
                console.warn("[ALISON VOICE RECOGNITION ERRORE]", e.error);
            };
        }

        this.riconoscitore.start();
    },

    gestisciScelta(scelta) {
        const box = document.getElementById('box-chat-centrale');
        if (!box) return;

        let risposta = "";
        let audioText = "";

        if (typeof scelta === 'string' && (scelta.includes('1. SI') || scelta.includes('2. SI'))) {
            risposta = "Ti sto reindirizzando immediatamente alla scheda di candidatura riservata per la Conferenza con il CEO GIULIANO.";
            audioText = "Ti sto trasferendo alla scheda di candidatura con il CEO Giuliano.";
            this.parla(audioText);
            setTimeout(() => { window.location.href = 'candidatura.html'; }, 1200);
            return;
        } else if (typeof scelta === 'string' && scelta.includes('3. NO')) {
            risposta = "Perfetto. Di quale ambito specifico desideri parlare? Posso illustrarti Suprema Academy, la Boutique Luxury o la Linea Antigravity.";
            audioText = "Di quale ambito desideri maggiori informazioni?";
        } else if (scelta === 4 || (typeof scelta === 'string' && scelta.includes('4.'))) {
            risposta = "Comprendo le tue riflessioni. Un colloquio diretto con il CEO GIULIANO chiarisce ogni dubbio e illustra le prospettive dell'Ecosistema.";
            audioText = "Un colloquio diretto con il CEO toglie ogni dubbio. Posso collegarti su WhatsApp.";
        } else {
            risposta = "Richiesta acquisita. L'Executive Concierge invierà un riscontro alla tua attenzione.";
            audioText = "Richiesta acquisita. Verrai ricontattato a breve.";
        }

        this.parla(audioText);
        box.innerHTML += `
            <div class="bg-white p-4 rounded-2xl border border-gray-200 max-w-xl shadow-sm text-gray-800 space-y-2 mt-3 font-mono text-xs">
                <strong class="text-sfx-cyan">Alison:</strong> ${risposta}
            </div>`;
        box.scrollTop = box.scrollHeight;
    }
};

/**
 * 4. SIMULATORE & RENDERING SUPREMA GOLD CARD (CEOSFX0001 RISERVATO CEO GIULIANO | CEOSFX0002+ UTENTI)
 */
window.GoldCardEngine = {
    // Contatore progressivo locale per generazione simulata clienti
    counterUtenti: 2,

    genera(nomeInput) {
        const nome = (nomeInput || "MARCO ROSSI").toUpperCase();
        const renderNome = document.getElementById('render-nome');
        const renderId = document.getElementById('render-id');
        const renderPts = document.getElementById('render-pts');

        if (renderNome) renderNome.textContent = nome;

        // Genera sequenza CEOSFX0002, CEOSFX0003, ecc.
        const pad = (num, size) => {
            let s = num + "";
            while (s.length < size) s = "0" + s;
            return s;
        };

        const code = "CEOSFX" + pad(this.counterUtenti, 4);
        if (renderId) renderId.textContent = code;
        if (renderPts) renderPts.textContent = "1,500 PTS";

        this.counterUtenti++;

        alert("✓ Suprema Gold Card Virtuata Generata!\n\nTitolare: " + nome + "\nCodice ID Assegnato: " + code + "\nSaldo Iniziale: 1,500 PTS");
    }
};/**
 * 5. GESTIONE DRAWER HAMBURGER & TIMER AUTOCLOSE (10 SECONDI)
 */
window.SFXDrawer = {
    timer: null,

    toggle(id) {
        const drawer = document.getElementById(id);
        if (!drawer) return;
        
        drawer.classList.toggle('hidden');

        clearTimeout(this.timer);
        if (!drawer.classList.contains('hidden')) {
            this.timer = setTimeout(() => {
                drawer.classList.add('hidden');
            }, 10000);
        }
    },

    close(id) {
        const drawer = document.getElementById(id);
        if (drawer) drawer.classList.add('hidden');
        clearTimeout(this.timer);
    },

    closeOnClickOutside(event, id) {
        if (event.target.id === id) {
            this.close(id);
        }
    }
};

function toggleDrawer(id) { window.SFXDrawer.toggle(id); }
function chiudiDrawer(id) { window.SFXDrawer.close(id); }
function chiudiDrawerAlClickFuori(event, id) { window.SFXDrawer.closeOnClickOutside(event, id); }

/**
 * 6. ENGINE TRADUZIONE MULTILINGUA DINAMICA (CON MEMORIZZAZIONE LOCALE & AUTO-DETECT)
 */
function cambiaLingua(langKey) {
    localStorage.setItem('sfx_selected_lang', langKey);
    const dizionario = window.DIZIONARIO_LINGUE[langKey] || window.DIZIONARIO_LINGUE['IT'];
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dizionario[key]) {
            el.innerHTML = dizionario[key];
        }
    });
}

// Inizializzazione automatica al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {
    let savedLang = localStorage.getItem('sfx_selected_lang');
    
    // Auto-detect lingua del browser se non presente in localStorage
    if (!savedLang) {
        const userLang = (navigator.language || navigator.userLanguage || '').substring(0, 2).toUpperCase();
        const lingueSupportate = ['IT', 'FR', 'EN', 'SK', 'RO', 'DE', 'ES', 'CS', 'PT', 'SQ'];
        savedLang = lingueSupportate.includes(userLang) ? userLang : 'IT';
    }

    const selector = document.getElementById('lang-selector');
    if (selector) selector.value = savedLang;
    cambiaLingua(savedLang);
});

/**
 * 7. MODALI REATTIVI (8" CORSI, 9" TESTIMONIANZE, 7" LUXURY, ANTIGRAVITY)
 */
function apriModalCorso(nomeCorso, descrizione) {
    const modal = document.getElementById('modal-corso-8pollici');
    const titolo = document.getElementById('titolo-corso-modal');
    const desc = document.getElementById('desc-corso-modal');
    const btn = document.getElementById('btn-aderisci-corso');

    if (modal && titolo && desc && btn) {
        titolo.textContent = "CORSO " + nomeCorso.toUpperCase();
        desc.textContent = descrizione;
        btn.textContent = "ADERISCI AL CORSO " + nomeCorso.toUpperCase();
        btn.href = "candidatura.html?corso=" + encodeURIComponent(nomeCorso);
        modal.classList.remove('hidden');
    }
}

function apriModalTestimonianze() {
    const modal = document.getElementById('modal-testimonianze-9pollici');
    if (modal) modal.classList.remove('hidden');
}

function apriModalLuxury7Pollici() {
    const modal = document.getElementById('modal-luxury-7pollici');
    if (modal) modal.classList.remove('hidden');
}

function apriModalAntigravityFeatures() {
    const modal = document.getElementById('modal-antigravity-detail');
    if (modal) modal.classList.remove('hidden');
}

/**
 * 8. CONTROLLI PLANCIA VIDEO SHOWCASE & FULLSCREEN / PIP
 */
function controlloVideo(azione) {
    const video = document.getElementById('video-card-showcase');
    if (!video) return;

    if (azione === 'play') {
        video.play();
    } else if (azione === 'pause' || azione === 'freeze') {
        video.pause();
    } else if (azione === 'stop') {
        video.pause();
        video.currentTime = 0;
    } else if (azione === 'rewind') {
        video.currentTime = Math.max(0, video.currentTime - 5);
    } else if (azione === 'forward') {
        video.currentTime = Math.min(video.duration || 0, video.currentTime + 5);
    }
}

function toggleFullScreenVideo() {
    const video = document.getElementById('video-card-showcase');
    if (!video) return;

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

async function togglePictureInPicture() {
    const video = document.getElementById('video-card-showcase');
    if (!video) return;

    try {
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        } else if (document.pictureInPictureEnabled) {
            await video.requestPictureInPicture();
        }
    } catch (err) {
        console.warn("[PiP ERRORE]", err);
    }
}

function caricaTabMedia(categoria) {
    alert("Sincronizzazione della categoria " + categoria.toUpperCase() + " in corso dall'X-BOX...");
}

/**
 * 9. PING TEST LIVE GATEWAY REAL-TIME
 */
async function testPingGateway() {
    const start = performance.now();
    try {
        await fetch(APPS_SCRIPT_URL + '?action=PING', { mode: 'no-cors' });
        const latency = Math.round(performance.now() - start);
        alert(`✓ PING GATEWAY EAL6+: ${latency}ms\nStato: Server Reattivo e Online.`);
    } catch (e) {
        alert("⚠️ Modalità Coda Offline Attiva (Server irraggiungibile o rete assente).");
    }
}/**
 * 10. INTERAZIONI UTENTE, CHAT INPUT, EXIT INTENT & FEEDBACK
 */
function inviaPill(testo) {
    window.AlisonEngine.gestisciScelta(testo);
}

function GestoreObiezioni() {
    window.AlisonEngine.gestisciScelta(4);
}

function inviaMessaggioCentrale() {
    const input = document.getElementById('input-centrale');
    if (!input) return;
    const val = input.value.trim();
    if (!val) return;
    inviaPill(val);
    input.value = '';
}

function apriWidgetAlison() {
    const input = document.getElementById('input-centrale');
    if (input) input.focus();
    window.location.href = '#alison-ai';
}

function GeneraCardSimulata() {
    const inputNome = document.getElementById('sim-nome');
    window.GoldCardEngine.genera(inputNome ? inputNome.value : "");
}

async function InviaExitFeedback() {
    const emailElem = document.getElementById('exit-email');
    if (!emailElem || !emailElem.value) return;

    const email = emailElem.value.trim();
    if (window.SFXConnector) {
        await window.SFXConnector.inviaLead({
            action: 'EXIT_INTENT_FEEDBACK',
            email: email,
            course: 'EXIT_INTENT'
        });
    }

    alert("Grazie! La tua email è stata registrata (+50 PTS accreditati sulla Gold Card).");
    const modaleExit = document.getElementById('modale-exit');
    if (modaleExit) modaleExit.classList.add('hidden');
}

function inviaNewsletter(e) {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    if (window.SFXConnector) {
        window.SFXConnector.inviaLead({ action: 'NEWSLETTER_SUBSCRIPTION', email: email });
    }
    alert("Iscrizione al notiziario riservato completata con successo!");
    e.target.reset();
}

function inviaFeedback(e) {
    e.preventDefault();
    const nome = document.getElementById('feedback-nome').value;
    const messaggio = document.getElementById('feedback-messaggio').value;
    if (window.SFXConnector) {
        window.SFXConnector.inviaLead({ action: 'FEEDBACK_DIRECT', nome: nome, messaggio: messaggio });
    }
    alert("Feedback trasmesso alla Direzione del CEO GIULIANO.");
    e.target.reset();
}

/**
 * 11. FEEDBACK APTICO & AUDIO PER INTERAZIONI ED EVENTI TAP
 */
function riproduciClickAudio() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // 880 Hz metallico
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
    } catch(e) {
        // Fallback silente se l'interazione audio è bloccata dal browser
    }

    if (navigator.vibrate) {
        navigator.vibrate([15, 30, 15]);
    }
}

/**
 * 12. ROUTER STEALTH SU TAP LOGO (2 TAP = X-BOX | 3 TAP = PRIVATO CEO)
 */
(function initStealthLogoRouter() {
    function creaHandlerTap() {
        let clicks = 0;
        let timer = null;

        return function() {
            clicks++;
            riproduciClickAudio();
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (clicks === 2) {
                    window.location.href = 'login.html?target=xbox';
                } else if (clicks >= 3) {
                    window.location.href = 'login.html?target=privato_ceo';
                }
                clicks = 0;
            }, 400);
        };
    }

    document.addEventListener('DOMContentLoaded', () => {
        const logoStatus = document.getElementById('sfx-brand-logo-status');
        const logoMain = document.getElementById('sfx-brand-logo-main');
        const logoCenter = document.getElementById('sfx-brand-logo-center');

        if (logoStatus) logoStatus.addEventListener('click', creaHandlerTap());
        if (logoMain) logoMain.addEventListener('click', creaHandlerTap());
        if (logoCenter) logoCenter.addEventListener('click', creaHandlerTap());
    });
})();

/**
 * 13. DETECTOR EXIT INTENT (DESKTOP MOUSELEAVE & MOBILE BACK BUTTON)
 */
(function initExitIntentDetector() {
    let mostrato = false;

    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 10 && !mostrato) {
            mostrato = true;
            const modaleExit = document.getElementById('modale-exit');
            if (modaleExit) modaleExit.classList.remove('hidden');
        }
    });

    window.addEventListener('popstate', () => {
        if (!mostrato) {
            mostrato = true;
            const modaleExit = document.getElementById('modale-exit');
            if (modaleExit) modaleExit.classList.remove('hidden');
        }
    });
})();
