/**
 * ====================================================================
 * SUPREMA FUTURE X // FRONTEND ENGINE EAL6+ V37
 * GOVERNANCE: CEO GIULIANO CARATELLI
 * FUNZIONI: Triplo Click, Biometria, Orologio Canvas, SHA-256, Timer 20s
 * ENDPOINT: V7 ENGINE CONSOLIDATO
 * ====================================================================
 */

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwkwuABaCQZq0McIpGBnUXgivM-4xQGo3HKI_Tloza-1jYnwdQRcW1kreRpwF8KIfdw/exec";

// ============================================================================
// 1. VARIABILI DI STATO E AUDIO NEURALE (WEB AUDIO API)
// ============================================================================
let menuTimer;
let clickCount = 0;
let clickTimer;
let tentativiFalliti = 0;
let alisonChatCount = 0;
let caveauTimeout;

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
    
    const emergenzaTrigger = document.getElementById('sfx-main-title') || document.getElementById('trigger-titolo-emergenza');

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
    
    if (isBioVerified) {
        setTimeout(() => { eseguiAccessoConsentito(true); }, 500);
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
        ctx.fillStyle = 'rgba(42, 45, 52, 0.25)';
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
// 6. LOGICA DI SBLOCCO SOVRANO (LOCAL-FIRST & ANTI-LOCKOUT)
// ============================================================================
function validaAccessoTerminale(event) {
    if(event) event.preventDefault();
    const pwdInput = document.getElementById('terminal-pwd');
    const pinInput = document.getElementById('terminal-pin');
    const btn = document.getElementById('btn-terminal-unlock');
    const boxAllarme = document.getElementById('terminal-alarm') || document.getElementById('terminal-alarm-box');
    const errText = document.getElementById('terminal-error-text');

    const rawPwd = pwdInput ? pwdInput.value : '';
    const rawPin = pinInput ? pinInput.value : '';

    // Normalizzazione preventiva contro autocorrezioni mobili
    const cleanPwd = rawPwd.trim().replace(/\s+/g, '');
    const cleanPin = rawPin.trim();

    const isPwdValid = (
        cleanPwd === "MARIACHIARAsupremaofficial2026@" ||
        cleanPwd === "MARIACHIARAsupremaofficial2026" ||
        rawPwd.trim() === "MARIACHIARA suprema official2026@" ||
        rawPwd.trim() === "MARIACHIARA suprema official2026"
    );

    const isPinValid = (cleanPin === "3474429091");

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

// Alias per compatibilità con i vari template HTML
function verificaAccessoTerminale(event) {
    return validaAccessoTerminale(event);
}

function eseguiAccessoConsentito(isBiometric) {
    playAudioFeedback('success-beep');
    if(!isBiometric && !localStorage.getItem('SFX_BIOMETRIC_AUTH')) richiediSalvataggioBiometrico();

    const ora = new Date().getHours();
    let saluto = "BUONASERA CEO";
    if (ora < 12) saluto = "BUONGIORNO CEO";
    else if (ora < 19) saluto = "BUON POMERIGGIO CEO";

    const formBox = document.getElementById('terminal-form-box');
    const successBox = document.getElementById('terminal-success-box') || document.getElementById('terminal-greeting-box');
    const greetingEl = document.getElementById('terminal-greeting') || document.getElementById('terminal-greeting-text');

    if(formBox) formBox.classList.add('hidden');
    if(successBox) successBox.classList.remove('hidden');
    if(greetingEl) greetingEl.innerText = saluto;

    setTimeout(() => {
        const modal9 = document.getElementById('modal-terminale-9');
        const modalCaveau8 = document.getElementById('modal-caveau-8');
        
        if (modal9) modal9.classList.add('hidden');
        if (modalCaveau8) {
            modalCaveau8.classList.remove('hidden');
        } else {
            window.location.href = "login.html";
        }
    }, 1800);
}

function gestisciErroreAccesso(boxAllarme, errText) {
    tentativiFalliti++;
    playAudioFeedback('error-beep');
    const btn = document.getElementById('btn-terminal-unlock');
    
    if (errText) {
        errText.innerText = `Credenziali errate. Tentativo fallito: ${tentativiFalliti}/3`;
        errText.classList.remove('hidden');
    }

    if (tentativiFalliti >= 3) {
        if (boxAllarme) {
            boxAllarme.classList.remove('hidden');
            boxAllarme.innerHTML = `
                <div class="text-center p-6">
                    <i class="fa-solid fa-triangle-exclamation text-4xl text-[#FFBF00] mb-3 animate-pulse"></i>
                    <div class="font-grotesk font-black text-xl text-white">ACCESSO NEGATO</div>
                    <div class="font-mono text-sm text-[#FFBF00] mt-1">Dispositivo bloccato. Notifica inviata.</div>
                </div>
            `;
        }
        eseguiLockdown("Superamento limite tentativi terminale");
    } else {
        if (boxAllarme) {
            boxAllarme.classList.remove('hidden');
            boxAllarme.innerHTML = `
                <div class="text-center p-6">
                    <i class="fa-solid fa-triangle-exclamation text-4xl text-[#FFBF00] mb-3 animate-pulse"></i>
                    <div class="font-grotesk font-black text-xl text-white">ACCESSO NEGATO</div>
                    <div class="font-mono text-sm text-[#FFBF00] mt-1">Tentativo ${tentativiFalliti}/3</div>
                </div>
            `;
            setTimeout(() => {
                boxAllarme.classList.add('hidden');
            }, 2000);
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
        <div class="screen-not-found">
            <div class="text-center">
                <i class="fa-solid fa-triangle-exclamation text-8xl mb-4 text-[#D4AF37]"></i>
                <div style="font-family: Orbitron; font-size: 8vw;">NOT FOUND</div>
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
// 7. SBLOCCO EMERGENZA SOVRANA (7 POLLICI)
// ============================================================================
async function eseguiSbloccoEmergenzaSovrana(event) {
    if(event) event.preventDefault();
    const inputResp = document.getElementById('emergenza-risposta') || document.getElementById('rescue-answer');
    const risposta = inputResp ? inputResp.value.trim().toLowerCase() : '';

    if (risposta === "itmc2202v") {
        playAudioFeedback('success-beep');
        alert("✓ ENTERPRISE È TORNATA IN STATO DI ALLERTA COMPLETATO.");
        sessionStorage.setItem('sfx_authenticated', 'true');
        sessionStorage.setItem('sfx_role', 'CEO_CLEARANCE');
        
        fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: 'EMERGENCY_RECOVERY', answerHash: risposta, ip: 'Terminale Locale' })
        }).catch(() => {});

        const m7 = document.getElementById('modal-emergenza-7');
        const m8 = document.getElementById('modal-caveau-8');
        if (m7) m7.classList.add('hidden');
        if (m8) m8.classList.remove('hidden');
        else window.location.href = "login.html";
    } else {
        playAudioFeedback('error-beep');
        alert("⛔ Risposta segreta errata.");
    }
}

function verificaEmergenza(event) {
    return eseguiSbloccoEmergenzaSovrana(event);
}

function controllaBiometriaSalvata() {
    const btn = document.getElementById('btn-biometria-quick');
    if(localStorage.getItem('SFX_BIOMETRIC_AUTH') === "CEO_VERIFIED" && btn) btn.classList.remove('hidden');
}

function richiediSalvataggioBiometrico() {
    const conferma = confirm("Memorizzare l'autorizzazione di sicurezza su questo dispositivo per accessi istantanei futuri?");
    if(conferma) {
        localStorage.setItem('SFX_BIOMETRIC_AUTH', 'CEO_VERIFIED');
    }
}

// ============================================================================
// 8. ALISON CHATBOT (Regola dei 5 Messaggi)
// ============================================================================
function inviaMessaggioCentrale(testoPredefinito) {
    const input = document.getElementById('input-centrale') || document.getElementById('alison-user-input');
    const chatBox = document.getElementById('box-chat-centrale') || document.getElementById('alison-chat-log');
    if(!chatBox) return;

    const messaggio = testoPredefinito || (input ? input.value.trim() : '');
    if(!messaggio) return;

    chatBox.innerHTML += `<div class="text-right text-gray-800 mb-2 font-mono text-xs"><span class="bg-stone-200 px-3 py-1.5 rounded-xl inline-block">${messaggio}</span></div>`;
    if(input) input.value = "";
    alisonChatCount++;
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        let alisonResponse = "";
        if(alisonChatCount >= 5) {
            alisonResponse = `
            <div class="bg-[var(--pearl-card)] p-3 rounded-xl border border-sfx-cyan shadow-sm text-gray-800 space-y-2 mt-2">
                <p class="font-mono text-xs"><strong>Alison (AG-01):</strong> Ho registrato le tue richieste. Per una profilazione di livello superiore è richiesta una conferenza diretta con la Presidenza del CEO Giuliano Caratelli.</p>
                <div class="flex space-x-2 mt-2">
                    <a href="#candidatura" class="px-3 py-2 bg-sfx-cyan text-white text-[10px] font-bold rounded hover:bg-cyan-700">PRENOTA CONFERENZA CEO</a>
                </div>
            </div>`;
        } else {
            alisonResponse = `<div class="bg-white p-3 rounded-xl border border-stone-200 text-gray-800 font-mono text-xs mb-2 mt-2"><strong>Alison:</strong> Informazione recepita ed archiviata nel registro neurale.</div>`;
        }
        
        chatBox.innerHTML += alisonResponse;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 800);
}

// ============================================================================
// 9. TELEMETRIA LIVE (Top Bar Counter)
// ============================================================================
function initLiveCounter() {
    const counterDisplay = document.getElementById('live-visitors') || document.getElementById('live-visitors-counter');
    if(!counterDisplay) return;

    setInterval(() => {
        const hour = new Date().getHours();
        let base = (hour > 8 && hour < 23) ? 38 : 14;
        let variance = Math.floor(Math.random() * 9) - 4;
        let currentVisits = Math.max(1, base + variance);
        
        if (counterDisplay.tagName === 'SPAN') {
            counterDisplay.innerText = currentVisits;
        } else {
            counterDisplay.innerHTML = `<span class="w-1.5 h-1.5 bg-sfx-cyan rounded-full animate-pulse mr-1"></span> ONLINE: <strong class="text-sfx-gold ml-1">${currentVisits}</strong>`;
        }
    }, 25000);
}

// ============================================================================
// 10. TIMER INATTIVITÀ (Auto-Lock Caveau 180s)
// ============================================================================
function setupCaveauAutoLock() {
    const isPrivato = window.location.pathname.includes('crm.html') || window.location.pathname.includes('admin.html') || window.location.pathname.includes('vault.html');
    if(!isPrivato) return;
    
    function resetCaveauTimer() {
        clearTimeout(caveauTimeout);
        caveauTimeout = setTimeout(() => {
            alert("⚠️ SESSIONE EAL6+ SCADUTA PER INATTIVITÀ.");
            window.location.href = "index.html";
        }, 180000);
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
