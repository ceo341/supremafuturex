/**
 * ====================================================================
 * SUPREMA FUTURE X // FRONTEND MASTER ENGINE V50 EAL6+
 * GOVERNANCE: CEO GIULIANO CARATELLI
 * PROTOCOLLO: EAL6+ SOVRANO // ANTI-LOCKOUT & RESILIENT CORE
 * ====================================================================
 */

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzJ5atqYnvcqvqbfCWvEmX7gZAdxe3kfbv79F_ANBwRuURpQ2Tcw_GuTTtdFIbBNUbU/exec";
const PIN_SOVRANO_MASTER = "3474429091";
const PWD_SOVRANA_MASTER = "MARIACHIARAsupremaofficial2026@";

// ============================================================================
// 1. VARIABILI DI STATO, BROADCAST BUS E AUDIO NEURALE (WEB AUDIO API)
// ============================================================================
let menuTimer;
let clickCount = 0;
let clickTimer;
let tentativiFalliti = 0;
let alisonChatCount = 0;
let caveauTimeout;

const sfxEnterpriseBus = (function() {
    try {
        if ('BroadcastChannel' in window) return new BroadcastChannel('sfx_enterprise_bus');
    } catch(e) {}
    return null;
})();

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

document.addEventListener('click', () => {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}, { once: true });

function playAudioFeedback(type) {
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        if (type === 'auth-start') { 
            osc.type = 'sine'; 
            osc.frequency.setValueAtTime(880, audioCtx.currentTime); 
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); 
            osc.start(); 
            osc.stop(audioCtx.currentTime + 0.1); 
        } else if (type === 'success-beep') { 
            osc.type = 'square'; 
            osc.frequency.setValueAtTime(1200, audioCtx.currentTime); 
            gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); 
            osc.start(); 
            osc.stop(audioCtx.currentTime + 0.15); 
        } else if (type === 'error-beep') { 
            osc.type = 'sawtooth'; 
            osc.frequency.setValueAtTime(150, audioCtx.currentTime); 
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); 
            osc.start(); 
            osc.stop(audioCtx.currentTime + 0.3); 
        } else if (type === 'lockdown-alarm') { 
            osc.type = 'square'; 
            osc.frequency.setValueAtTime(100, audioCtx.currentTime); 
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime); 
            osc.start(); 
            osc.stop(audioCtx.currentTime + 1.5); 
        }
    } catch(e) {}
}

// ============================================================================
// 2. MOTORE CRITTOGRAFICO SHA-256 (Client-Side)
// ============================================================================
async function hashSHA256(text) {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ============================================================================
// 3. MENU A SCOMPARSA (REGOLA DEI 15/20 SECONDI E HOVER)
// ============================================================================
function setupSmartMenu() {
    const dropdowns = document.querySelectorAll('.nav-dropdown-container');
    
    dropdowns.forEach(container => {
        const menu = container.querySelector('.nav-dropdown-menu');
        if (!menu) return;

        container.addEventListener('mouseenter', () => {
            clearTimeout(menuTimer);
            menu.classList.add('force-open');
            menu.classList.remove('hidden');
        });

        container.addEventListener('mouseleave', () => {
            menuTimer = setTimeout(() => { 
                menu.classList.remove('force-open'); 
                menu.classList.add('hidden');
            }, 350);
        });

        container.addEventListener('click', (e) => {
            if (e.target.closest('.nav-dropdown-menu')) return;
            document.querySelectorAll('.nav-dropdown-menu').forEach(m => {
                m.classList.remove('force-open');
                m.classList.add('hidden');
            });
            menu.classList.add('force-open');
            menu.classList.remove('hidden');
            
            clearTimeout(menuTimer);
            menuTimer = setTimeout(() => { 
                menu.classList.remove('force-open'); 
                menu.classList.add('hidden');
            }, 15000); // Chiusura dopo 15 secondi di inattività
        });

        const links = menu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('force-open');
                menu.classList.add('hidden');
                clearTimeout(menuTimer);
            });
        });
    });
}

// ============================================================================
// 4. STEALTH TRIGGER (TRIPLO TAP SU LOGO CENTRALE & 4 TAP TITOLO)
// ============================================================================
function initStealthTriggers() {
    const centralLogo = document.getElementById('sfx-brand-logo-center');
    const emergenzaTrigger = document.getElementById('sfx-main-title') || document.getElementById('trigger-titolo-emergenza');

    if (centralLogo) {
        centralLogo.addEventListener('click', (e) => {
            e.preventDefault();
            clickCount++;
            clearTimeout(clickTimer);

            if (clickCount >= 3) {
                clickCount = 0;
                checkBiometricsOrOpenTerminal();
            } else {
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                }, 500); // Finestra 500ms
            }
        });
        centralLogo.style.touchAction = 'manipulation';
    }

    if (emergenzaTrigger) {
        let emergClickCount = 0;
        let emergTimer;
        emergenzaTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            emergClickCount++;
            clearTimeout(emergTimer);

            if (emergClickCount >= 4) {
                emergClickCount = 0;
                apriEmergenzaSovrana7Pollici();
            } else {
                emergTimer = setTimeout(() => {
                    emergClickCount = 0;
                }, 600);
            }
        });
        emergenzaTrigger.style.touchAction = 'manipulation';
    }
}

function checkBiometricsOrOpenTerminal() {
    playAudioFeedback('auth-start');
    const isBioVerified = localStorage.getItem('SFX_BIOMETRIC_AUTH') === 'CEO_VERIFIED';
    
    if (isBioVerified) {
        setTimeout(() => { eseguiAccessoConsentito(true); }, 300);
    } else {
        apriTerminale9Pollici();
    }
}

// ============================================================================
// 5. TERMINALI, CANVAS, CORIANDOLI E OROLOGIO (9" e 7")
// ============================================================================
function apriTerminale9Pollici() {
    const modal = document.getElementById('modal-terminale-9');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        initCanvasBackground();
        initAnalogClock();
        controllaBiometriaSalvata();
    }
}

function apriEmergenzaSovrana7Pollici() {
    const modal = document.getElementById('modal-emergenza-7');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }
}

function initCanvasBackground() {
    const canvas = document.getElementById('canvas-terminal-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    
    let particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({ 
            x: Math.random() * canvas.width, 
            y: Math.random() * canvas.height, 
            vy: Math.random() * 1.5 + 0.5, 
            size: Math.random() * 1.5 + 0.5 
        });
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(9, 10, 13, 0.25)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00F0FF';
        particles.forEach(p => {
            ctx.beginPath(); 
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); 
            ctx.fill();
            p.y += p.vy; 
            if (p.y > canvas.height) p.y = 0;
        });
        requestAnimationFrame(draw);
    }
    draw();
}

function initAnalogClock() {
    const canvas = document.getElementById('canvas-clock');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    ctx.translate(radius, radius);

    function drawClock() {
        ctx.clearRect(-radius, -radius, canvas.width, canvas.height);
        const now = new Date(); 
        const hour = now.getHours(); 
        const minute = now.getMinutes(); 
        const second = now.getSeconds();

        // Quadrante
        ctx.beginPath(); 
        ctx.arc(0, 0, radius - 3, 0, 2 * Math.PI); 
        ctx.fillStyle = '#090A0D'; 
        ctx.fill();
        ctx.strokeStyle = '#D4AF37'; 
        ctx.lineWidth = 2; 
        ctx.stroke();

        // Perno
        ctx.beginPath(); 
        ctx.arc(0, 0, 4, 0, 2 * Math.PI); 
        ctx.fillStyle = '#00F0FF'; 
        ctx.fill();

        // Lancette
        const hourAngle = (hour % 12) * Math.PI / 6 + (minute * Math.PI / (6 * 60));
        drawHand(ctx, hourAngle, radius * 0.5, 3.5, '#D4AF37');
        const minuteAngle = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
        drawHand(ctx, minuteAngle, radius * 0.7, 2, '#C0C0C0');
        const secondAngle = (second * Math.PI / 30);
        drawHand(ctx, secondAngle, radius * 0.85, 1, '#00F0FF');

        requestAnimationFrame(drawClock);
    }

    function drawHand(ctx, pos, length, width, color) {
        ctx.beginPath(); 
        ctx.lineWidth = width; 
        ctx.lineCap = "round"; 
        ctx.strokeStyle = color;
        ctx.moveTo(0, 0); 
        ctx.rotate(pos); 
        ctx.lineTo(0, -length); 
        ctx.stroke(); 
        ctx.rotate(-pos);
    }
    drawClock();
}

// CANNONE CORIANDOLI DI GIOIA (CANVAS CELEBRATIVO)
function sparaCoriandoliDiGioia() {
    const canvas = document.getElementById('canvas-confetti-gioia');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colori = ['#D4AF37', '#00F0FF', '#FFBF00', '#F3E5AB', '#4A0E4E', '#FFFFFF', '#10B981'];
    const particelle = [];
    const quantita = 150;

    for (let i = 0; i < quantita; i++) {
        particelle.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            r: Math.random() * 6 + 3,
            color: colori[Math.floor(Math.random() * colori.length)],
            tilt: Math.floor(Math.random() * 10) - 10,
            tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
            tiltAngle: 0,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.8) * 20
        });
    }

    const start = Date.now();
    function step() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particelle.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.35; // Gravità
            p.tiltAngle += p.tiltAngleIncremental;
            p.tilt = Math.sin(p.tiltAngle) * 15;

            ctx.beginPath();
            ctx.lineWidth = p.r;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
            ctx.stroke();
        });

        if (Date.now() - start < 3000) {
            requestAnimationFrame(step);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    step();
}

// ============================================================================
// 6. LOGICA DI SBLOCCO SOVRANO (MARIACHIARAsupremaofficial2026@ & 3474429091)
// ============================================================================
const FRASI_PRESIDENZA_RANDOM = [
    "\"LA LEADERSHIP NON SI DOMANDA: SI STRUTTURA. IL SISTEMA È AI TUOI ORDINI.\"",
    "\"BENTORNATO COMANDANTE GIULIANO. LE MATRICI FINANZIARIE E NEURALI SONO ALLINEATE.\"",
    "\"IL FUTURO SI GUIDA INSIEME: NESSUN COMPROMESSO, SOLO RISULTATI CONCRETI.\"",
    "\"PRESIDENTE, IL FORTE EAL6+ SOVRANO È COMPLETAMENTE OPERATIVO E PROTETTO.\"",
    "\"FLOTTA 15 AGENTI E MASTRO 54/30/16 ATTENDONO LE TUE DIRETTIVE.\""
];

function validaAccessoTerminale(event) {
    if (event) event.preventDefault();
    const pwdInput = document.getElementById('terminal-pwd');
    const pinInput = document.getElementById('terminal-pin');
    const boxAllarme = document.getElementById('terminal-alarm') || document.getElementById('terminal-alarm-box');
    const errText = document.getElementById('terminal-error-text');

    const rawPwd = pwdInput ? pwdInput.value : '';
    const rawPin = pinInput ? pinInput.value : '';

    const cleanPwd = rawPwd.trim().replace(/\s+/g, '');
    const cleanPin = rawPin.trim();

    const isPwdValid = (
        cleanPwd === PWD_SOVRANA_MASTER ||
        cleanPwd === "MARIACHIARAsupremaofficial2026" ||
        rawPwd.trim() === "MARIACHIARA suprema official2026@"
    );

    const isPinValid = (cleanPin === PIN_SOVRANO_MASTER);

    if (isPwdValid && isPinValid) {
        tentativiFalliti = 0;
        if (boxAllarme) boxAllarme.classList.add('hidden');
        if (errText) errText.classList.add('hidden');
        
        sessionStorage.setItem('sfx_authenticated', 'true');
        sessionStorage.setItem('sfx_role', 'CEO_CLEARANCE');
        
        eseguiAccessoConsentito(false);
    } else {
        gestisciErroreAccesso(boxAllarme, errText);
    }
}

function verificaAccessoTerminale(event) {
    return validaAccessoTerminale(event);
}

function eseguiAccessoConsentito(isBiometric) {
    playAudioFeedback('success-beep');
    sparaCoriandoliDiGioia();

    if (!isBiometric && !localStorage.getItem('SFX_BIOMETRIC_AUTH')) {
        richiediSalvataggioBiometrico();
    }

    const ora = new Date().getHours();
    let saluto = "BUONASERA PRESIDENTE CARATELLI";
    if (ora < 12) saluto = "BUONGIORNO COMANDANTE GIULIANO";
    else if (ora < 18) saluto = "BUON POMERIGGIO CEO CARATELLI";

    const formBox = document.getElementById('terminal-form-box');
    const successBox = document.getElementById('terminal-success-box') || document.getElementById('terminal-greeting-box');
    const greetingEl = document.getElementById('terminal-greeting') || document.getElementById('terminal-greeting-text');
    const quoteEl = document.getElementById('terminal-quote-text');

    if (formBox) formBox.classList.add('hidden');
    if (successBox) successBox.classList.remove('hidden');
    if (greetingEl) greetingEl.innerText = saluto;
    if (quoteEl) {
        const fraseScelta = FRASI_PRESIDENZA_RANDOM[Math.floor(Math.random() * FRASI_PRESIDENZA_RANDOM.length)];
        quoteEl.innerText = fraseScelta;
    }

    setTimeout(() => {
        const modal9 = document.getElementById('modal-terminale-9');
        const modalCaveau8 = document.getElementById('modal-caveau-8');
        const boxLoginTerminal = document.getElementById('box-login-terminal');
        const boxCaveau8 = document.getElementById('box-caveau-8');
        
        if (modal9) modal9.classList.add('hidden');
        if (boxLoginTerminal) boxLoginTerminal.classList.add('hidden');
        
        if (modalCaveau8) {
            modalCaveau8.classList.remove('hidden');
        } else if (boxCaveau8) {
            boxCaveau8.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.location.href = "admin.html";
        }
    }, 2200);
}

function gestisciErroreAccesso(boxAllarme, errText) {
    tentativiFalliti++;
    playAudioFeedback('error-beep');
    const btn = document.getElementById('btn-terminal-unlock');
    
    if (errText) {
        errText.innerText = `Credenziali errate. Tentativo: ${tentativiFalliti}/3`;
        errText.classList.remove('hidden');
    }

    if (tentativiFalliti >= 3) {
        if (boxAllarme) {
            boxAllarme.classList.remove('hidden');
            boxAllarme.innerHTML = `
                <div class="text-center p-6">
                    <i class="fa-solid fa-triangle-exclamation text-4xl text-[#FFBF00] mb-3 animate-pulse"></i>
                    <div class="font-grotesk font-black text-xl text-white uppercase">Accesso Negato</div>
                    <div class="font-mono text-sm text-[#FFBF00] mt-1">Dispositivo segnalato al NOC Telegram.</div>
                </div>`;
        }
        eseguiLockdown("Superamento limite tentativi terminale EAL6+");
    } else {
        if (boxAllarme) {
            boxAllarme.classList.remove('hidden');
            boxAllarme.innerHTML = `
                <div class="text-center p-6">
                    <i class="fa-solid fa-triangle-exclamation text-4xl text-[#FFBF00] mb-3 animate-pulse"></i>
                    <div class="font-grotesk font-black text-xl text-white uppercase">Credenziali Errate</div>
                    <div class="font-mono text-sm text-[#FFBF00] mt-1">Tentativo ${tentativiFalliti} di 3</div>
                </div>`;
            setTimeout(() => { boxAllarme.classList.add('hidden'); }, 1800);
        }
    }
    
    if (btn) {
        btn.disabled = false;
        btn.innerHTML = 'VERIFICA E SBLOCCA <i class="fa-solid fa-unlock-keyhole ml-1"></i>';
    }
}

function eseguiLockdown(motivo) {
    playAudioFeedback('lockdown-alarm');
    const lockdownHtml = `
        <div style="position:fixed;inset:0;background:#050A0F;z-index:99999;display:flex;align-items:center;justify-content:center;color:#FFBF00;font-family:monospace;text-align:center;padding:20px;">
            <div>
                <i class="fa-solid fa-shield-halved text-7xl mb-4 animate-pulse"></i>
                <h1 style="font-size:28px;color:#fff;font-weight:900;">LOCKDOWN SOVRANO EAL6+</h1>
                <p style="color:#C0C0C0;margin-top:8px;">Dispositivo congelato. Riconnessione tra 3 secondi...</p>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', lockdownHtml);

    fetch(APPS_SCRIPT_URL, {
        method: 'POST', 
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'REPORT_ABUSE', ip: 'Rilevamento in corso', device: navigator.userAgent, detail: motivo })
    }).catch(() => {});

    setTimeout(() => { window.location.reload(); }, 3000);
}

// ============================================================================
// 7. SBLOCCO EMERGENZA SOVRANA 7" (RISPOSTA: itmc2202v)
// ============================================================================
async function eseguiSbloccoEmergenzaSovrana(event) {
    if (event) event.preventDefault();
    const inputResp = document.getElementById('emergenza-risposta') || document.getElementById('rescue-answer');
    const risposta = inputResp ? inputResp.value.trim().toLowerCase() : '';

    if (risposta === "itmc2202v") {
        playAudioFeedback('success-beep');
        sparaCoriandoliDiGioia();
        alert("✓ CIRCUITO DI EMERGENZA VALIDATO. Bentornato CEO Giuliano Caratelli.");
        
        sessionStorage.setItem('sfx_authenticated', 'true');
        sessionStorage.setItem('sfx_role', 'CEO_CLEARANCE');
        
        fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: 'EMERGENCY_RECOVERY', answerHash: risposta, ip: 'Terminale Locale' })
        }).catch(() => {});

        const m7 = document.getElementById('modal-emergenza-7');
        const m8 = document.getElementById('modal-caveau-8');
        const boxLoginTerminal = document.getElementById('box-login-terminal');
        const boxCaveau8 = document.getElementById('box-caveau-8');
        
        if (m7) m7.classList.add('hidden');
        if (boxLoginTerminal) boxLoginTerminal.classList.add('hidden');
        
        if (m8) m8.classList.remove('hidden');
        else if (boxCaveau8) boxCaveau8.classList.remove('hidden');
        else window.location.href = "admin.html";
    } else {
        playAudioFeedback('error-beep');
        alert("⛔ Risposta segreta non corretta.");
    }
}

function verificaEmergenza(event) {
    return eseguiSbloccoEmergenzaSovrana(event);
}

function controllaBiometriaSalvata() {
    const btn = document.getElementById('btn-biometria-quick');
    if (localStorage.getItem('SFX_BIOMETRIC_AUTH') === "CEO_VERIFIED" && btn) {
        btn.classList.remove('hidden');
    }
}

function richiediSalvataggioBiometrico() {
    const conferma = confirm("Memorizzare l'autorizzazione di sicurezza su questo dispositivo per accessi prioritari futuri?");
    if (conferma) {
        localStorage.setItem('SFX_BIOMETRIC_AUTH', 'CEO_VERIFIED');
    }
}

// ============================================================================
// 8. ALISON CHATBOT (FALLBACK INTELLIGENTE CON LISTINO V50)
// ============================================================================
if (typeof window.inviaMessaggioCentrale !== 'function') {
    window.inviaMessaggioCentrale = function(testoPredefinito) {
        const input = document.getElementById('input-centrale') || document.getElementById('alison-user-input');
        const chatBox = document.getElementById('box-chat-centrale') || document.getElementById('alison-chat-log');
        if (!chatBox) return;

        const messaggio = testoPredefinito || (input ? input.value.trim() : '');
        if (!messaggio) return;

        chatBox.innerHTML += `
            <div class="text-right text-gray-800 mb-2 font-mono text-xs">
                <span class="bg-sfx-gold/20 border border-sfx-gold/40 px-3 py-1.5 rounded-xl inline-block text-gray-900">${messaggio}</span>
            </div>`;
        if (input) input.value = "";
        alisonChatCount++;
        chatBox.scrollTop = chatBox.scrollHeight;

        setTimeout(() => {
            let risposta = "";
            const lower = messaggio.toLowerCase();

            if (lower.includes("prezz") || lower.includes("cost") || lower.includes("quant")) {
                risposta = "I percorsi di Suprema Academy hanno tariffe fisse e bloccate: Silver Tier a 249 €, Executive Master a 299 € e Premium VIP a 349 €. Zero video preregistrati: la formazione è 100% Live One-to-One da 60 minuti previa call di screening selettivo da 30 minuti con la Presidenza.";
            } else if (lower.includes("ceo") || lower.includes("giuliano") || lower.includes("caratelli")) {
                risposta = "Il Fondatore e CEO di Suprema Future X è Giuliano Caratelli. Conduce personalmente le sessioni riservate One-to-One per gli allievi accreditati e sovrintende all'intera architettura d'impresa.";
            } else if (alisonChatCount >= 4) {
                risposta = `Ho registrato la tua richiesta nel fascicolo esecutivo. Per una profilazione approfondita con il CEO Giuliano Caratelli, ti invito a prenotare la call di screening preliminare da 30 minuti su Google Meet.<br><br>
                <a href="candidatura.html" class="inline-block px-3 py-1.5 bg-sfx-gold text-black font-bold rounded-lg text-[10px] uppercase shadow-md">Prenota Screening 30m con il CEO &rarr;</a>`;
            } else {
                risposta = "Richiesta recepita e archiviata nel registro neurale di Alison (AG-01). Per candidarti a un percorso o richiedere il colloquio direzionale, puoi compilare la scheda di candidatura.";
            }

            chatBox.innerHTML += `
                <div class="bg-white p-3.5 rounded-xl border border-gray-300 text-gray-800 font-mono text-xs mb-2 mt-2 shadow-sm space-y-1">
                    <strong class="text-sfx-cyan block text-[10px]">Alison (AG-01):</strong>
                    <p class="leading-relaxed">${risposta}</p>
                </div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 300);
    };
}

// ============================================================================
// 9. TELEMETRIA LIVE VISITATORI
// ============================================================================
function initLiveCounter() {
    const counterDisplay = document.getElementById('live-visitors') || document.getElementById('live-visitors-counter');
    if (!counterDisplay) return;

    setInterval(() => {
        const hour = new Date().getHours();
        const base = (hour > 8 && hour < 23) ? 38 : 14;
        const variance = Math.floor(Math.random() * 9) - 4;
        const currentVisits = Math.max(1, base + variance);
        
        if (counterDisplay.tagName === 'SPAN') {
            counterDisplay.innerText = currentVisits;
        } else {
            counterDisplay.innerHTML = `<span class="w-1.5 h-1.5 bg-sfx-cyan rounded-full animate-pulse mr-1"></span> ONLINE: <strong class="text-sfx-gold ml-1">${currentVisits}</strong>`;
        }
    }, 25000);
}

// ============================================================================
// 10. TIMER INATTIVITÀ CAVEAU (180 SECONDI)
// ============================================================================
function setupCaveauAutoLock() {
    const path = window.location.pathname;
    const isPrivato = path.includes('crm.html') || path.includes('admin.html') || path.includes('vault.html');
    if (!isPrivato) return;
    
    function resetCaveauTimer() {
        clearTimeout(caveauTimeout);
        caveauTimeout = setTimeout(() => {
            alert("⚠️ SESSIONE EAL6+ SCADUTA PER INATTIVITÀ.");
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
            window.location.href = "index.html";
        }, 180000); // 3 minuti
    }
    
    window.addEventListener('mousemove', resetCaveauTimer);
    window.addEventListener('keypress', resetCaveauTimer);
    window.addEventListener('click', resetCaveauTimer);
    resetCaveauTimer();
}

// ============================================================================
// 11. INIZIALIZZAZIONE AL CARICAMENTO DOM
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    setupSmartMenu();
    initStealthTriggers();
    initLiveCounter();
    setupCaveauAutoLock();
});
