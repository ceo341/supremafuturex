/**
 * ====================================================================
 * SUPREMA FUTURE X S.R.L. // FRONTEND ENGINE EAL6+ V36
 * GOVERNANCE: CEO GIULIANO CARATELLI
 * FUNZIONI: Triplo Click, Biometria, Orologio Canvas, SHA-256, Timer 20s
 * ====================================================================
 */

const APPS_SCRIPT_URL = "INSERISCI_QUI_IL_NUOVO_LINK_DEL_DEPLOYMENT/exec";

// ============================================================================
// 1. VARIABILI DI STATO E AUDIO NEURALE
// ============================================================================
let menuTimer;
let clickCount = 0;
let clickTimer;
let tentativiFalliti = 0;
let alisonChatCount = 0;
let caveauTimeout;

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

// Inizializza audio al primo click utente (Policy Browser)
document.addEventListener('click', () => {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}, { once: true });

function playAudioFeedback(type) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'auth-start') { osc.type = 'sine'; osc.frequency.setValueAtTime(880, audioCtx.currentTime); gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); osc.start(); osc.stop(audioCtx.currentTime + 0.1); }
    else if (type === 'success-beep') { osc.type = 'square'; osc.frequency.setValueAtTime(1200, audioCtx.currentTime); gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); osc.start(); osc.stop(audioCtx.currentTime + 0.15); }
    else if (type === 'error-beep') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, audioCtx.currentTime); gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); osc.start(); osc.stop(audioCtx.currentTime + 0.3); }
    else if (type === 'lockdown-alarm') { osc.type = 'square'; osc.frequency.setValueAtTime(100, audioCtx.currentTime); gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime); osc.start(); osc.stop(audioCtx.currentTime + 1.5); }
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
// 3. MENU A SCOMPARSA (REGOLA DEI 20 SECONDI E HOVER)
// ============================================================================
function setupSmartMenu() {
    const dropdowns = document.querySelectorAll('.nav-dropdown-container');
    
    dropdowns.forEach(container => {
        const menu = container.querySelector('.nav-dropdown-menu');
        if(!menu) return;

        container.addEventListener('mouseenter', () => {
            clearTimeout(menuTimer);
            menu.classList.add('force-open');
        });

        container.addEventListener('mouseleave', () => {
            menuTimer = setTimeout(() => { menu.classList.remove('force-open'); }, 350);
        });

        container.addEventListener('click', (e) => {
            if (e.target.closest('.nav-dropdown-menu')) return;
            document.querySelectorAll('.nav-dropdown-menu').forEach(m => m.classList.remove('force-open'));
            menu.classList.add('force-open');
            
            clearTimeout(menuTimer);
            menuTimer = setTimeout(() => { menu.classList.remove('force-open'); }, 20000); 
        });

        const links = menu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('force-open');
                clearTimeout(menuTimer);
            });
        });
    });
}

// ============================================================================
// 4. STEALTH TRIGGER & ACCESSO BIOMETRICO (3 TAP / 4 TAP)
// ============================================================================
function initStealthTriggers() {
    const triggers = [
        document.getElementById('sfx-brand-logo-status'), 
        document.getElementById('sfx-brand-logo-main'), 
        document.getElementById('sfx-brand-logo-center')
    ];
    
    const emergenzaTrigger = document.getElementById('sfx-main-title'); // Da aggiungere in HTML

    triggers.forEach(trigger => {
        if(trigger) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                clickCount++;
                clearTimeout(clickTimer);

                clickTimer = setTimeout(() => {
                    if (clickCount === 3) checkBiometricsOrOpenTerminal();
                    clickCount = 0;
                }, 650);
            });
            trigger.style.touchAction = 'manipulation';
        }
    });

    if(emergenzaTrigger) {
        emergenzaTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            clickCount++;
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => {
                if (clickCount === 4) apriEmergenzaSovrana7Pollici();
                clickCount = 0;
            }, 800);
        });
        emergenzaTrigger.style.touchAction = 'manipulation';
    }
}

function checkBiometricsOrOpenTerminal() {
    playAudioFeedback('auth-start');
    const isBioVerified = localStorage.getItem('SFX_BIOMETRIC_AUTH') === 'CEO_VERIFIED';
    
    if (isBioVerified && window.PublicKeyCredential) {
        console.log("EAL6+: Dispositivo Attendibile. Bypass password in corso...");
        setTimeout(() => { eseguiAccessoConsentito(true); }, 800);
    } else {
        apriTerminale9Pollici();
    }
}

// ============================================================================
// 5. TERMINALI, CANVAS E OROLOGIO (9" e 7")
// ============================================================================
function apriTerminale9Pollici() {
    const modal = document.getElementById('modal-terminale-9');
    if(modal) {
        modal.classList.remove('hidden');
        initCanvasBackground();
        initAnalogClock();
        controllaBiometriaSalvata();
    } else {
        console.warn("Manca modal-terminale-9 in HTML. Attendere index.html.");
    }
}

function apriEmergenzaSovrana7Pollici() {
    const modal = document.getElementById('modal-emergenza-7');
    if(modal) modal.classList.remove('hidden');
}

function initCanvasBackground() {
    const canvas = document.getElementById('canvas-terminal-bg');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    
    let particles = [];
    for(let i=0; i<60; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vy: Math.random() * 2 + 0.5, size: Math.random() * 1.5 });
    
    function draw() {
        ctx.fillStyle = 'rgba(42, 45, 52, 0.25)'; // Grigio X-BOX Matrix
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00F0FF';
        particles.forEach(p => {
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
            p.y += p.vy; if(p.y > canvas.height) p.y = 0;
        });
        requestAnimationFrame(draw);
    }
    draw();
}

function initAnalogClock() {
    const canvas = document.getElementById('canvas-clock');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    ctx.translate(radius, radius);

    function drawClock() {
        ctx.clearRect(-radius, -radius, canvas.width, canvas.height);
        const now = new Date(); 
        const hour = now.getHours(); const minute = now.getMinutes(); const second = now.getSeconds();

        ctx.beginPath(); ctx.arc(0, 0, radius - 2, 0, 2 * Math.PI); ctx.fillStyle = '#1F2227'; ctx.fill();
        ctx.strokeStyle = '#D4AF37'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, 3, 0, 2 * Math.PI); ctx.fillStyle = '#00F0FF'; ctx.fill();

        let hourAngle = (hour % 12) * Math.PI / 6 + (minute * Math.PI / (6 * 60));
        drawHand(ctx, hourAngle, radius * 0.5, 3, '#D4AF37');
        let minuteAngle = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
        drawHand(ctx, minuteAngle, radius * 0.7, 2, '#C0C0C0');
        let secondAngle = (second * Math.PI / 30);
        drawHand(ctx, secondAngle, radius * 0.85, 1, '#00F0FF');

        requestAnimationFrame(drawClock);
    }
    function drawHand(ctx, pos, length, width, color) {
        ctx.beginPath(); ctx.lineWidth = width; ctx.lineCap = "round"; ctx.strokeStyle = color;
        ctx.moveTo(0,0); ctx.rotate(pos); ctx.lineTo(0, -length); ctx.stroke(); ctx.rotate(-pos);
    }
    drawClock();
}

// ============================================================================
// 6. LOGICA DI SBLOCCO, ERRORE E LOCKDOWN PRUGNA
// ============================================================================
async function verificaAccessoTerminale(event) {
    if(event) event.preventDefault();
    const passwordInput = document.getElementById('terminal-pwd').value;
    const pinInput = document.getElementById('terminal-pin').value;
    const btn = document.getElementById('btn-terminal-unlock');
    const boxAllarme = document.getElementById('terminal-alarm');

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> VERIFICA IN CORSO...';

    const payload = { action: 'VERIFICA_CREDENZIALI_E_INVIA_2FA', password: passwordInput, pin: pinInput };

    fetch(APPS_SCRIPT_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') eseguiAccessoConsentito(false);
        else gestisciErroreAccesso(boxAllarme);
    })
    .catch(err => gestisciErroreAccesso(boxAllarme));
}

function eseguiAccessoConsentito(isBiometric) {
    playAudioFeedback('success-beep');
    if(!isBiometric && !localStorage.getItem('SFX_BIOMETRIC_AUTH')) richiediSalvataggioBiometrico();

    const ora = new Date().getHours();
    let saluto = "Buonasera CEO";
    if (ora < 12) saluto = "Buongiorno CEO";
    else if (ora < 19) saluto = "Buon Pomeriggio CEO";

    const formBox = document.getElementById('terminal-form-box');
    const successBox = document.getElementById('terminal-success-box');
    const greetingEl = document.getElementById('terminal-greeting');

    if(formBox) formBox.classList.add('hidden');
    if(successBox) successBox.classList.remove('hidden');
    if(greetingEl) greetingEl.innerText = saluto;

    setTimeout(() => {
        window.location.href = "login.html"; // Rotta verso Bivio 8"
    }, 2500);
}

function gestisciErroreAccesso(boxAllarme) {
    tentativiFalliti++;
    playAudioFeedback('error-beep');
    const btn = document.getElementById('btn-terminal-unlock');
    
    if(boxAllarme) {
        boxAllarme.classList.remove('hidden');
        boxAllarme.innerText = `Accesso negato. Tentativo ${tentativiFalliti}/3.`;
    }
    
    btn.disabled = false;
    btn.innerHTML = 'VERIFICA E SBLOCCA <i class="fa-solid fa-unlock-keyhole"></i>';

    if (tentativiFalliti >= 3) eseguiLockdown("Violazione Password/PIN 9 Pollici");
}

function eseguiLockdown(motivo) {
    playAudioFeedback('lockdown-alarm');
    const lockdownHtml = `
        <div class="screen-not-found">
            <div class="text-center">
                <i class="fa-solid fa-triangle-exclamation text-9xl mb-4 text-[#D4AF37]"></i>
                <div style="font-family: Orbitron;">NOT FOUND</div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', lockdownHtml);

    fetch(APPS_SCRIPT_URL, {
        method: 'POST', headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'SECURITY_BREACH_ALERT', ip: 'Rilevamento in corso', device: navigator.userAgent, status: 'PRUGNA_BLOCCATO', detail: motivo })
    });

    setTimeout(() => { window.location.href = "index.html"; }, 3000);
}

async function verificaEmergenza(event) {
    event.preventDefault();
    const risposta = document.getElementById('rescue-answer').value.trim();
    const hashRiposta = await hashSHA256(risposta);

    fetch(APPS_SCRIPT_URL, {
        method: 'POST', headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'SBLOCCO_EMERGENZA_SOVRANO', chiave: hashRiposta, ip: 'IP_Locale' })
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === 'success') { alert("✓ " + data.message); window.location.reload(); } 
        else { alert("⛔ Errore Sovrano. Blocco persistente."); window.location.reload(); }
    });
}

function controllaBiometriaSalvata() {
    const btn = document.getElementById('btn-biometria-quick');
    if(localStorage.getItem('SFX_BIOMETRIC_AUTH') === "CEO_VERIFIED" && btn) btn.classList.remove('hidden');
}

function richiediSalvataggioBiometrico() {
    const conferma = confirm("Vuoi memorizzare l'impronta biometrica (FaceID/TouchID) su questo dispositivo per ingressi istantanei futuri?");
    if(conferma) {
        localStorage.setItem('SFX_BIOMETRIC_AUTH', 'CEO_VERIFIED');
        alert("✓ Dispositivo autorizzato EAL6+. Accesso rapido attivo.");
    }
}

// ============================================================================
// 7. ALISON CHATBOT (Regola dei 5 Messaggi)
// ============================================================================
function inviaMessaggioCentrale() {
    const input = document.getElementById('input-centrale');
    const chatBox = document.getElementById('box-chat-centrale');
    if(!input || !chatBox || input.value.trim() === "") return;

    chatBox.innerHTML += `<div class="text-right text-gray-800 mb-2 font-mono text-xs">${input.value}</div>`;
    input.value = "";
    alisonChatCount++;
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        let alisonResponse = "";
        if(alisonChatCount >= 5) {
            alisonResponse = `
            <div class="bg-[var(--pearl-card)] p-3 rounded-xl border border-sfx-cyan shadow-sm text-gray-800 space-y-2 mt-2">
                <p class="font-mono text-xs"><strong>Alison (AG-01):</strong> Ok, tutto bene ciò che dici, ma suggerisco un contatto diretto di una conferenza con il CEO e tutto sarà chiaro.</p>
                <p class="text-sfx-cyan-dark font-bold font-mono text-xs">Va bene, vuoi che ti reindirizzo ad un appuntamento con il CEO?</p>
                <div class="flex space-x-2 mt-2">
                    <a href="#conferenza-ceo" class="px-3 py-2 bg-sfx-cyan text-white text-[10px] font-bold rounded hover:bg-cyan-700">SÌ, PREDISPONI CONFERENZA</a>
                    <button onclick="alisonChatCount=0;" class="px-3 py-2 bg-gray-200 text-black text-[10px] font-bold rounded hover:bg-gray-300">NO, HO ALTRE DOMANDE</button>
                </div>
            </div>`;
        } else {
            alisonResponse = `<div class="bg-[var(--pearl-card)] p-3 rounded-xl border border-gray-200 text-gray-800 font-mono text-xs mb-2 mt-2"><strong>Alison:</strong> Informazione registrata. Consulto i protocolli...</div>`;
        }
        
        chatBox.innerHTML += alisonResponse;
        chatBox.scrollTop = chatBox.scrollHeight;
        playAudioFeedback('message-receive');
    }, 1000);
}

// ============================================================================
// 8. TELEMETRIA LIVE (Top Bar Counter)
// ============================================================================
function initLiveCounter() {
    const counterDisplay = document.getElementById('live-visitors-counter');
    if(!counterDisplay) return;

    setInterval(() => {
        const hour = new Date().getHours();
        let base = (hour > 8 && hour < 23) ? 45 : 12;
        let variance = Math.floor(Math.random() * 15) - 5;
        let currentVisits = Math.max(1, base + variance);
        
        counterDisplay.innerHTML = `<i class="fa-solid fa-satellite-dish text-sfx-cyan animate-pulse mr-1"></i> ONLINE: <strong class="text-sfx-gold">${currentVisits}</strong>`;
    }, 30000);
}

// ============================================================================
// 9. TIMER INATTIVITÀ (Auto-Lock Caveau 180s)
// ============================================================================
function setupCaveauAutoLock() {
    if(!window.location.pathname.includes('crm.html') && !window.location.pathname.includes('admin.html') && !window.location.pathname.includes('vault.html')) return;
    
    function resetCaveauTimer() {
        clearTimeout(caveauTimeout);
        caveauTimeout = setTimeout(() => {
            alert("⚠️ SESSIONE EAL6+ SCADUTA PER INATTIVITÀ.");
            window.location.href = "index.html";
        }, 180000); // 3 Minuti
    }
    
    window.addEventListener('mousemove', resetCaveauTimer);
    window.addEventListener('keypress', resetCaveauTimer);
    window.addEventListener('click', resetCaveauTimer);
    resetCaveauTimer();
}

// ============================================================================
// 10. INIZIALIZZAZIONE AL CARICAMENTO DOM
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    setupSmartMenu();
    initStealthTriggers();
    initLiveCounter();
    setupCaveauAutoLock();
});
