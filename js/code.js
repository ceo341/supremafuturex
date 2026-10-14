 /**
 * SUPREMA FUTURE X S.R.L. // FRONTEND ENGINE EAL6+
 * FILE: js/code.js
 * FUNZIONI: Triplo Click, Biometria, Orologio Canvas, Hash SHA-256, Timer 20s
 */

const APPS_SCRIPT_URL = "INSERISCI_QUI_IL_NUOVO_LINK_DEL_DEPLOYMENT/exec";

// ============================================================================
// 1. MOTORE CRITTOGRAFICO SHA-256 (Client-Side)
// ============================================================================
async function hashSHA256(text) {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ============================================================================
// 2. MENU A SCOMPARSA & TIMER 20 SECONDI (TOP BAR)
// ============================================================================
let menuTimer;
function setupSmartMenu() {
    const menuContainer = document.getElementById('menu-sezioni-container');
    const smartMenu = document.getElementById('smart-dropdown-menu');
    
    if(!menuContainer || !smartMenu) return;

    // Desktop: Hover
    menuContainer.addEventListener('mouseenter', () => {
        clearTimeout(menuTimer);
        smartMenu.classList.remove('hidden');
    });

    menuContainer.addEventListener('mouseleave', () => {
        menuTimer = setTimeout(() => {
            smartMenu.classList.add('hidden');
        }, 350); // Piccolo ritardo anti-frustrazione
    });

    // Mobile / Click
    menuContainer.addEventListener('click', (e) => {
        clearTimeout(menuTimer);
        smartMenu.classList.remove('hidden');
        
        // Timer di sicurezza 20 secondi
        menuTimer = setTimeout(() => {
            smartMenu.classList.add('hidden');
        }, 20000); 
    });

    // Auto-chiusura sui click interni
    const links = smartMenu.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            smartMenu.classList.add('hidden');
            clearTimeout(menuTimer);
        });
    });
}

// ============================================================================
// 3. STEALTH TRIGGER (3 Click = Login / 4 Click = Emergenza)
// ============================================================================
let clickCount = 0;
let clickTimer;

function handleStealthAccess(e) {
    e.preventDefault();
    clickCount++;
    clearTimeout(clickTimer);

    clickTimer = setTimeout(() => {
        if (clickCount === 3) {
            apriTerminale9Pollici();
        } else if (clickCount === 4) {
            apriEmergenzaSovrana7Pollici();
        }
        clickCount = 0;
    }, 650); // Finestra di 650ms per eseguire i tap
}

function initStealthTriggers() {
    // Aggancia il trigger ai loghi e ai titoli
    const triggers = [
        document.getElementById('sfx-brand-logo-status'), 
        document.getElementById('sfx-brand-logo-main'), 
        document.getElementById('sfx-brand-logo-center')
    ];
    
    triggers.forEach(trigger => {
        if(trigger) {
            trigger.addEventListener('click', handleStealthAccess);
            trigger.style.touchAction = 'manipulation'; // Evita zoom su mobile
        }
    });
}

// ============================================================================
// 4. ANIMAZIONE CANVAS (MATRICE/STELLE) E OROLOGIO ANALOGICO
// ============================================================================
function apriTerminale9Pollici() {
    const modal = document.getElementById('modal-terminale-9');
    if(modal) {
        modal.classList.remove('hidden');
        initCanvasBackground();
        initAnalogClock();
        controllaBiometriaSalvata();
    } else {
        console.warn("Modale Terminale assente. (Verrà aggiunta in index.html)");
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
    
    // Resize
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    
    let particles = [];
    for(let i=0; i<60; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vy: Math.random() * 2 + 0.5,
            size: Math.random() * 1.5
        });
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(9, 10, 13, 0.25)'; // Scia Matrix
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00F0FF';
        
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            p.y += p.vy;
            if(p.y > canvas.height) p.y = 0;
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
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();

        // Quadrante
        ctx.beginPath();
        ctx.arc(0, 0, radius - 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#090A0D';
        ctx.fill();
        ctx.strokeStyle = '#D4AF37'; // Oro
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Perno centrale
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, 2 * Math.PI);
        ctx.fillStyle = '#00F0FF';
        ctx.fill();

        // Lancetta Ore
        let hourAngle = (hour % 12) * Math.PI / 6 + (minute * Math.PI / (6 * 60));
        drawHand(ctx, hourAngle, radius * 0.5, 3, '#D4AF37');
        
        // Lancetta Minuti
        let minuteAngle = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
        drawHand(ctx, minuteAngle, radius * 0.7, 2, '#C0C0C0');
        
        // Lancetta Secondi
        let secondAngle = (second * Math.PI / 30);
        drawHand(ctx, secondAngle, radius * 0.85, 1, '#00F0FF');

        requestAnimationFrame(drawClock);
    }

    function drawHand(ctx, pos, length, width, color) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.strokeStyle = color;
        ctx.moveTo(0,0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    }
    drawClock();
}

// ============================================================================
// 5. BIOMETRIA E SALVATAGGIO CREDENZIALI (TouchID / FaceID Simulator)
// ============================================================================
function controllaBiometriaSalvata() {
    const salvato = localStorage.getItem('SFX_BIOMETRIC_AUTH');
    const btn = document.getElementById('btn-biometria-quick');
    if(salvato === "CEO_VERIFIED" && btn) {
        btn.classList.remove('hidden');
    }
}

function richiediSalvataggioBiometrico() {
    const conferma = confirm("Vuoi memorizzare le credenziali su questo dispositivo (iPhone/MacBook) usando il riconoscimento biometrico locale per i futuri accessi?");
    if(conferma) {
        localStorage.setItem('SFX_BIOMETRIC_AUTH', 'CEO_VERIFIED');
        alert("✓ Dispositivo autorizzato. Il sistema ti riconoscerà automaticamente ai prossimi accessi.");
    }
}

// ============================================================================
// 6. LOGICA DI SBLOCCO E CHIAMATE API
// ============================================================================
let tentativiFalliti = 0;

async function verificaAccessoTerminale(event) {
    event.preventDefault();
    const passwordInput = document.getElementById('terminal-pwd').value;
    const pinInput = document.getElementById('terminal-pin').value;
    const btn = document.getElementById('btn-terminal-unlock');
    const boxAllarme = document.getElementById('terminal-alarm');

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> VERIFICA NEURALE IN CORSO...';

    // Criptiamo i dati lato client (Zero-Plaintext) prima di inviarli
    const pwdHash = await hashSHA256(passwordInput);
    const pinHash = await hashSHA256(pinInput);

    const payload = {
        action: 'VERIFICA_CREDENZIALI_E_INVIA_2FA',
        password: passwordInput, // Manteniamo anche il chiaro se il server accetta il doppio binario, altrimenti inviare solo Hash
        pin: pinInput
    };

    fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            eseguiAccessoConsentito();
        } else {
            gestisciErroreAccesso(boxAllarme);
        }
    })
    .catch(err => {
        gestisciErroreAccesso(boxAllarme);
    });
}

function eseguiAccessoConsentito() {
    // Chiedi salvataggio FaceID/TouchID se non presente
    if(!localStorage.getItem('SFX_BIOMETRIC_AUTH')) richiediSalvataggioBiometrico();

    // Saluto Dinamico
    const ora = new Date().getHours();
    let saluto = "Buonasera CEO";
    if (ora < 12) saluto = "Buongiorno CEO";
    else if (ora < 19) saluto = "Buon Pomeriggio CEO";

    document.getElementById('terminal-form-box').classList.add('hidden');
    const successBox = document.getElementById('terminal-success-box');
    successBox.classList.remove('hidden');
    document.getElementById('terminal-greeting').innerText = saluto;

    // Transizione automatica al Caveau Doppio 8" dopo l'esplosione
    setTimeout(() => {
        document.getElementById('modal-terminale-9').classList.add('hidden');
        document.getElementById('modal-caveau-8').classList.remove('hidden');
    }, 3500);
}

function gestisciErroreAccesso(boxAllarme) {
    tentativiFalliti++;
    const btn = document.getElementById('btn-terminal-unlock');
    
    // Pulsazione Arancione
    boxAllarme.classList.remove('hidden');
    boxAllarme.innerText = `Accesso negato. Tentativo ${tentativiFalliti}/3.`;
    
    btn.disabled = false;
    btn.innerHTML = 'VERIFICA E SBLOCCA <i class="fa-solid fa-unlock-keyhole"></i>';

    if (tentativiFalliti >= 3) {
        eseguiLockdown("Violazione Password/PIN");
    }
}

function eseguiLockdown(motivo) {
    // Genera grande X e scritta NOT FOUND
    const terminale = document.getElementById('modal-terminale-9');
    terminale.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-red-500 animate-pulse">
            <i class="fa-solid fa-xmark text-9xl"></i>
            <h1 class="font-grotesk font-black text-6xl mt-4 tracking-widest">NOT FOUND</h1>
        </div>
    `;

    // Richiesta API in background per registrare Blacklist e notificare WhatsApp
    fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
            action: 'SECURITY_BREACH_ALERT',
            ip: 'IP_Rilevato_dal_Server',
            device: navigator.userAgent,
            status: 'PRUGNA_BLOCCATO',
            detail: motivo
        })
    });

    // Dopo 3 secondi butta fuori
    setTimeout(() => {
        window.location.href = "index.html"; // Ricarica e butta fuori
    }, 3000);
}

async function verificaEmergenza(event) {
    event.preventDefault();
    const risposta = document.getElementById('rescue-answer').value.trim();
    const btn = document.getElementById('btn-rescue');
    btn.disabled = true;

    const hashRiposta = await hashSHA256(risposta);

    fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'SBLOCCO_EMERGENZA_SOVRANO', chiave: hashRiposta, ip: 'IP_Locale' })
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === 'success') {
            alert("✓ " + data.message);
            window.location.reload();
        } else {
            alert("⛔ Errore: Risposta errata.");
            btn.disabled = false;
        }
    });
}

// INIZIALIZZAZIONE AL CARICAMENTO DOM
document.addEventListener('DOMContentLoaded', () => {
    setupSmartMenu();
    initStealthTriggers();
});
