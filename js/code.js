/* Endpoint Ufficiale Google Apps Script SFX 2026 */
const SFX_BACKEND_ENDPOINT = "https://script.google.com/macros/s/AKfycbzaRYm0ck2uareJjsnGD42r6EkrNgtY4D1Ux5nDgN_zzJW4xnxa3iGZWKoi6u0lVW5zDA/exec";

/**
 * Trasmissione asincrona della candidatura dal frontend al backend
 */
async function sfxSubmitLeadForm(leadPayload) {
  sfxPlayChime('chime');
  
  try {
    const response = await fetch(SFX_BACKEND_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'submit_candidatura',
        data: leadPayload
      })
    });

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("[SFX-NETWORK-ERROR]", err);
    return { success: false, error: "Connessione al nodo di sicurezza non riuscita." };
  }
}/**
 * ============================================================================
 * SUPREMA FUTURE X ENTERPRISE // CORE LOGIC & NEURAL ENGINE
 * File: js/code.js
 * Governance: Founder & CEO Giuliano Caratelli // Anno Operativo 2026
 * Standard: EAL6+ Compliant // Web Audio API // Speech Synthesis // Radar 60FPS
 * ============================================================================
 */

/* ----------------------------------------------------------------------------
 * 1. SINTESI PROCEDURALE WEB AUDIO API (DOPPIO OSCILLATORE)
 * ---------------------------------------------------------------------------- */
let sfxAudioCtx = null;

function sfxInitAudio() {
  if (!sfxAudioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      sfxAudioCtx = new AudioContextClass();
    }
  }
}

function sfxPlayChime(type = 'chime') {
  try {
    sfxInitAudio();
    if (!sfxAudioCtx) return;
    if (sfxAudioCtx.state === 'suspended') {
      sfxAudioCtx.resume();
    }

    const t = sfxAudioCtx.currentTime;
    const oscLow = sfxAudioCtx.createOscillator();
    const oscHigh = sfxAudioCtx.createOscillator();
    const gainNode = sfxAudioCtx.createGain();

    if (type === 'chime') {
      // Tono Cristallino Frizione Vetro e Oro
      oscLow.type = 'triangle';
      oscLow.frequency.setValueAtTime(200, t);
      oscLow.frequency.exponentialRampToValueAtTime(60, t + 0.12);

      oscHigh.type = 'sine';
      oscHigh.frequency.setValueAtTime(1046.5, t); // C6
      oscHigh.frequency.exponentialRampToValueAtTime(523.25, t + 0.18);

      gainNode.gain.setValueAtTime(0.18, t);
      gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    } else {
      // Micro-tick Meccanico
      oscLow.type = 'sine';
      oscLow.frequency.setValueAtTime(800, t);
      oscLow.frequency.exponentialRampToValueAtTime(240, t + 0.05);

      gainNode.gain.setValueAtTime(0.08, t);
      gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    }

    oscLow.connect(gainNode);
    if (type === 'chime') oscHigh.connect(gainNode);
    gainNode.connect(sfxAudioCtx.destination);

    oscLow.start(t);
    if (type === 'chime') oscHigh.start(t);

    oscLow.stop(t + 0.25);
    if (type === 'chime') oscHigh.stop(t + 0.25);
  } catch (e) {
    // Gestione preventiva policy autoplay browser
  }
}

/* ----------------------------------------------------------------------------
 * 2. MOTORE VOCALE AG-01 ALISON (PARTENZA MUTA & WEB SPEECH API)
 * ---------------------------------------------------------------------------- */
let sfxAudioMuted = true;
const sfxVoiceGreeting = "Benvenuto in questa chatbot, io sono Alison, in che cosa posso aiutarti?";

function sfxToggleAudioEngine() {
  sfxInitAudio();
  sfxPlayChime('chime');
  sfxAudioMuted = !sfxAudioMuted;

  const badge = document.getElementById('sfxAudioStateBadge');
  const icon = document.getElementById('sfxAudioStateIcon');
  const label = document.getElementById('sfxAudioStateText');

  if (!sfxAudioMuted) {
    badge.classList.add('unmuted');
    icon.textContent = "🔊";
    label.textContent = "STATO AUDIO: VOCALE ATTIVO // AG-01 TRASMETTE";
    sfxSpeak(sfxVoiceGreeting);
  } else {
    badge.classList.remove('unmuted');
    icon.textContent = "🔇";
    label.textContent = "STATO AUDIO: MUTO // CLICCA PER ATTIVARE IL VOCALE";
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

function sfxSpeak(text) {
  if (sfxAudioMuted) return;
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'it-IT';
  utterance.rate = 1.02;
  utterance.pitch = 1.05;

  const voices = window.speechSynthesis.getVoices();
  const italianVoice = voices.find(v => v.lang.includes('it') && (v.name.includes('Elsa') || v.name.includes('Federica') || v.name.includes('Alice') || v.name.includes('Cosimo') || v.name.includes('Google italiano')));
  if (italianVoice) utterance.voice = italianVoice;

  window.speechSynthesis.speak(utterance);
}

/* ----------------------------------------------------------------------------
 * 3. RADAR VETTORIALE CANVAS 60 FPS (AG-01 ALISON)
 * ---------------------------------------------------------------------------- */
let radarAngle = 0;
const radarBlips = [
  { r: 0.32, angle: 1.1, pulse: 0 },
  { r: 0.58, angle: 3.4, pulse: 0 },
  { r: 0.82, angle: 4.9, pulse: 0 }
];

function sfxInitRadarCanvas() {
  const canvas = document.getElementById('sfxRadarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const maxRadius = Math.min(cx, cy) - 14;

    // Cerchi polari ciano
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, (maxRadius / 3) * i, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Assi cartesiani incrociati
    ctx.beginPath();
    ctx.moveTo(cx - maxRadius, cy);
    ctx.lineTo(cx + maxRadius, cy);
    ctx.moveTo(cx, cy - maxRadius);
    ctx.lineTo(cx, cy + maxRadius);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.22)';
    ctx.stroke();

    // Fascio di scansione radiale dorato-ciano
    const sweepX = cx + Math.cos(radarAngle) * maxRadius;
    const sweepY = cy + Math.sin(radarAngle) * maxRadius;

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
    grad.addColorStop(0, 'rgba(212, 175, 55, 0.02)');
    grad.addColorStop(0.7, 'rgba(0, 240, 255, 0.12)');
    grad.addColorStop(1, 'rgba(0, 240, 255, 0.35)');

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, maxRadius, radarAngle - 0.45, radarAngle);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Linea guida dello sweep
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(sweepX, sweepY);
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Blip di telemetria attiva
    radarBlips.forEach(b => {
      const bx = cx + Math.cos(b.angle) * (b.r * maxRadius);
      const by = cy + Math.sin(b.angle) * (b.r * maxRadius);

      ctx.beginPath();
      ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#00F0FF';
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    radarAngle += 0.038;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

/* ----------------------------------------------------------------------------
 * 4. BANCA DATI 40 FAQ RIGIDAMENTE IGIENIZZATE (EAL6+ FORENSE)
 * ---------------------------------------------------------------------------- */
const sfxFaqDatabase = [
  { q: "Qual è la garanzia statutaria sull'erogazione dei corsi?", a: "Tutti i corsi della Suprema Academy sono certificati statutariamente al 100% dal vivo in videoconferenza diretta. È vietata la vendita di videocorsi pre-registrati passivi." },
  { q: "Come funziona il modello Concessioni Digitali a zero magazzino?", a: "Il titolare della concessione gestisce il proprio negozio online senza dover acquistare merci o gestire inventario. Confezionamento, logistica e spedizioni sono centralizzati dall'ecosistema." },
  { q: "Come si accede al colloquio con il Founder & CEO Giuliano Caratelli?", a: "L'accesso avviene tramite prenotazione nel funnel di screening per un colloquio conoscitivo di 60 minuti via Google Meet per la verifica attitudinale." },
  { q: "Cosa rappresenta la Suprema Gold Card metallica?", a: "È il riconoscimento phygital in acciaio satinato dorato con incisione laser del seriale univoco, rilasciato a partire da 800 Punti Status." },
  { q: "Quali sono i percorsi formativi dell'Academy?", a: "I percorsi attivi sono: Silver Tier (60 Giorni), Executive Master (90 Giorni) e Premium VIP (120 Giorni con sessioni one-to-one dirette con il CEO)." },
  { q: "Cosa sblocca la soglia premi di 2.000 Punti?", a: "Dà diritto a 3 Mesi di Conferenze Esecutive Gratuite con il Founder & CEO Giuliano Caratelli." },
  { q: "Cosa sblocca la soglia premi di 3.000 Punti?", a: "Consente la partecipazione formale per 2 persone all'esclusiva Cena Annuale di Gala a Roma Centro." },
  { q: "Cosa sblocca la soglia premi di 4.500 Punti?", a: "Audit Organizzativo su Misura e 6 Mesi di sessioni strategiche individuali con la Presidenza." },
  { q: "Cosa sblocca la soglia premi di 6.000 Punti?", a: "Status Sovrano a Vita, un Master completo gratuito a scelta e un intero anno di supervisione diretta del CEO." },
  { q: "Cosa sblocca la soglia premi di 7.500 Punti?", a: "Weekend Luxury per 2 persone con soggiorno completo in hotel a 5 stelle a Roma Centro." },
  { q: "Quanti Punti Status conferisce l'attivazione di una Concessione Store?", a: "L'attivazione accredita istantaneamente +800 Punti Status, rendendo subito ordinabile la Suprema Gold Card incisa al laser." },
  { q: "Cos'è il Dream Defense System?", a: "È il protocollo etico ed esecutivo di Presidenza volto a proteggere le risorse, il tempo e il merito dei candidati attraverso affiancamento costante e reale." },
  { q: "Chi è l'unico organo di rappresentanza decisionale?", a: "La direzione strategica, formativa e commerciale fa capo unicamente al Founder & CEO Giuliano Caratelli." },
  { q: "Quali sono le sedi ufficiali dell'ecosistema?", a: "La Sede Operativa è nel Centro Direzionale di Colleferro (Roma), mentre l'Ufficio di Presidenza è in Via della Scrofa, Roma Centro." },
  { q: "Cos'è l'Archivio Media Vault 400?", a: "È l'infrastruttura crittografata contenente 400 slot protetti per dispense, atti contrattuali e materiali con link temporizzati a scadenza 120 minuti." },
  { q: "Che cos'è la Flotta Neurale dei 15 Agenti AI?", a: "È il sistema di intelligenze artificiali operative dedicate al triage (AG-01), alla didattica, all'audit e alla tutela dei sistemi." },
  { q: "Come funziona il Master Fleet Kill-Switch?", a: "È il comando di emergenza hardware riservato al CEO che congela all'istante l'attività di tutti i 15 agenti neurali in caso di anomalia." },
  { q: "Qual è il Foro di competenza giurisdizionale esclusivo?", a: "Per ogni controversia è stabilita la competenza territoriale esclusiva ed inderogabile del Tribunale di Velletri / Roma." },
  { q: "Come vengono gestiti i pagamenti per l'Academy?", a: "Tramite circuiti crittografati sicuri PCI-DSS (Stripe Enterprise / 3D Secure 2.2) o bonifico bancario con causale vincolata alla matricola del candidato." },
  { q: "Come avviene la fatturazione?", a: "La fattura fiscale viene generata elettronicamente e trasmessa tramite SDI a norma di legge italiana all'atto dell'incasso." },
  { q: "Cosa serve per seguire le lezioni della didattica live?", a: "Una connessione internet stabile e un dispositivo abilitato per videoconferenze Google Meet; non sono ammesse visioni passive registrate." },
  { q: "Quali Punti si possono convertire nei premi del catalogo?", a: "Si utilizzano i Punti Spendibili accumulati, mentre i Punti Status restano cumulativi e a vita come attestato di rango." },
  { q: "Qual è il canale WhatsApp ufficiale di presidenza?", a: "La linea diretta certificata di coordinamento presidenziale risponde al recapito +39 347 442 9091." },
  { q: "Quali sono i canali Telegram ufficiali autorizzati?", a: "Il Canale Broadcast Istituzionale e il Bot Esecutivo AG-07 (@SFX_Command_Bot) per gli alert direzionali." },
  { q: "Come viene garantita la privacy dei candidati?", a: "I dati sono protetti in conformità al GDPR e agli standard di conservazione forense EAL6+, senza cessione a broker terzi." },
  { q: "Cosa prevede lo screening conoscitivo di 60 minuti?", a: "È un colloquio individuale di orientamento e selezione per verificare l'idoneità etica e professionale al programma." },
  { q: "Cosa accade se un corsista rimane inattivo?", a: "In caso di 60 giorni consecutivi di inattività senza giustificato motivo, la posizione viene sospesa e richiede riattivazione dal CEO." },
  { q: "Come vengono distribuiti gli attestati di fine percorso?", a: "Al superamento delle verifiche live viene rilasciato un attestato di merito crittografato depositato nel Media Vault." },
  { q: "I negozi digitali richiedono partita IVA immediata?", a: "L'inquadramento delle concessioni prevede un avviamento commerciale agevolato con supporto operativo integrato." },
  { q: "Chi tiene le sessioni dell'Executive Master?", a: "I docenti accreditati dell'Academy e il Founder & CEO Giuliano Caratelli per i moduli strategici di vertice." },
  { q: "Posso delegare la partecipazione al colloquio di screening?", a: "No, il colloquio è strettamente personale e richiede la presenza diretta del candidato selezionato." },
  { q: "Quali metodologie AI vengono approfondite nell'Executive Master?", a: "Flussi di automazione dei processi d'impresa, integrazione di agenti neurali e gestione scalabile delle piattaforme." },
  { q: "Che tipo di assistenza offre l'agente AG-01 Alison?", a: "Triage dei quesiti, guida alle sezioni dell'ecosistema e instradamento allo screening conoscitivo entro il 5° messaggio." },
  { q: "Come vengono spediti gli ordini dello store a zero magazzino?", a: "Spedizione espressa tracciata gestita direttamente dal centro logistico centralizzato verso il cliente finale." },
  { q: "I prezzi dei percorsi formativi sono visibili pubblicamente?", a: "Per scelta istituzionale le schede dettagliate e i piani di ammissione vengono esaminati durante lo screening conoscitivo." },
  { q: "Come viene tutelata la proprietà intellettuale di Suprema?", a: "Attraverso il divieto assoluto di divulgazione o duplicazione dei compendi, con sanzioni contrattuali e legali." },
  { q: "Posso scegliere l'orario del colloquio con il CEO?", a: "Sì, nel funnel di prenotazione sono disponibili le fasce: Mattina (10-12), Pomeriggio (15-18) e Serale (21-23)." },
  { q: "La Suprema Gold Card ha una data di scadenza?", a: "No, la tessera fisica e i Punti Status acquisiti mantengono validità permanente come titolo di merito." },
  { q: "Cosa accade dopo aver inviato la candidatura?", a: "La segreteria e l'agente AG-10 TITAN verificano i dati e inviano la convocazione ufficiale su WhatsApp entro 24 ore." },
  { q: "Cosa contraddistingue Suprema Future X nel mercato 2026?", a: "La totale trasparenza operativa, il rifiuto dei video registrati e la presenza attiva costante del Fondatore al fianco degli allievi." }
];

/* ----------------------------------------------------------------------------
 * 5. CHATBOT ALISON: DIALOGO, TRIAGE AL 5° MESSAGGIO & SINTESI VOCALE
 * ---------------------------------------------------------------------------- */
let sfxChatCounter = 0;

function sfxHandleUserMessage() {
  const input = document.getElementById('sfxChatInput');
  const stream = document.getElementById('sfxChatStream');
  if (!input || !stream) return;

  const txt = input.value.trim();
  if (!txt) return;

  sfxPlayChime('tick');

  // Stampa messaggio utente
  const userBox = document.createElement('div');
  userBox.className = 'sfx-msg sfx-msg-user';
  userBox.style.cssText = "background:rgba(212,175,55,0.14); border-right:3px solid var(--gold-primary); color:#FFF; padding:0.8rem 1rem; border-radius:8px; align-self:flex-end; max-width:85%; font-family:var(--font-mono); font-size:0.8rem;";
  userBox.textContent = txt;
  stream.appendChild(userBox);

  input.value = '';
  sfxChatCounter++;
  stream.scrollTop = stream.scrollHeight;

  // Elaborazione risposta di Alison
  setTimeout(() => {
    sfxPlayChime('chime');
    const aliBox = document.createElement('div');
    aliBox.className = 'sfx-msg sfx-msg-alison';
    aliBox.style.cssText = "background:rgba(0,240,255,0.08); border-left:3px solid var(--cyan-neon); color:#FFF; padding:0.8rem 1rem; border-radius:8px; align-self:flex-start; max-width:85%; font-family:var(--font-mono); font-size:0.8rem;";

    let replyText = "";

    if (sfxChatCounter >= 5) {
      replyText = "Hai raggiunto il limite della sessione orientativa preliminare. In virtù del protocollo, per verificare i requisiti e l'accesso ai percorsi o alle concessioni è indispensabile formalizzare lo screening con il Founder & CEO Giuliano Caratelli.";
      aliBox.innerHTML = `<strong>[TRIAGE PRESIDENZIALE RAGGIUNTO]</strong><br>${replyText}<br><button class="sfx-btn-action-oval" style="margin-top:0.8rem; padding:0.5rem 1rem; font-size:0.7rem;" onclick="sfxOpenBook('presidenza')">CONVALIDA SCREENING ADESSO ➔</button>`;
    } else {
      // Matching intelligente sulle 40 FAQ
      const queryLower = txt.toLowerCase();
      let matchedFaq = sfxFaqDatabase.find(f => 
        queryLower.includes(f.q.toLowerCase().slice(0, 15)) ||
        (queryLower.includes("corsi") && f.q.includes("corsi")) ||
        (queryLower.includes("magazzino") && f.q.includes("magazzino")) ||
        (queryLower.includes("meet") && f.q.includes("Meet")) ||
        (queryLower.includes("gold card") && f.q.includes("Gold Card")) ||
        (queryLower.includes("live") && f.q.includes("live"))
      );

      if (matchedFaq) {
        replyText = `[AG-01 ALISON] ${matchedFaq.a}`;
      } else {
        replyText = `[AG-01 ALISON] Confermo che nell'ecosistema tutta la didattica è al 100% dal vivo e le concessioni operano a zero magazzino. Desideri prenotare lo screening di 60 minuti con la Presidenza?`;
      }
      aliBox.textContent = replyText;
    }

    stream.appendChild(aliBox);
    stream.scrollTop = stream.scrollHeight;
    sfxSpeak(replyText.replace(/\[.*?\]/g, ''));
  }, 600);
}

function sfxTriggerFaq(index) {
  const faq = sfxFaqDatabase[index];
  if (!faq) return;

  const stream = document.getElementById('sfxChatStream');
  if (!stream) return;

  sfxPlayChime('chime');
  sfxChatCounter++;

  const userBox = document.createElement('div');
  userBox.className = 'sfx-msg sfx-msg-user';
  userBox.style.cssText = "background:rgba(212,175,55,0.14); border-right:3px solid var(--gold-primary); color:#FFF; padding:0.8rem 1rem; border-radius:8px; align-self:flex-end; max-width:85%; font-family:var(--font-mono); font-size:0.8rem;";
  userBox.textContent = faq.q;
  stream.appendChild(userBox);

  setTimeout(() => {
    const aliBox = document.createElement('div');
    aliBox.className = 'sfx-msg sfx-msg-alison';
    aliBox.style.cssText = "background:rgba(0,240,255,0.08); border-left:3px solid var(--cyan-neon); color:#FFF; padding:0.8rem 1rem; border-radius:8px; align-self:flex-start; max-width:85%; font-family:var(--font-mono); font-size:0.8rem;";
    
    let answer = `[AG-01 ALISON] ${faq.a}`;
    aliBox.textContent = answer;
    stream.appendChild(aliBox);
    stream.scrollTop = stream.scrollHeight;
    sfxSpeak(faq.a);
  }, 400);
}

/* ----------------------------------------------------------------------------
 * 6. MODALE SOTTOMENU A LIBRO 3D (MASTER FOLIO FOLD & GALLERIE)
 * ---------------------------------------------------------------------------- */
function sfxOpenBook(sectionKey) {
  sfxPlayChime('chime');
  const overlay = document.getElementById('sfxMasterBookOverlay');
  const catTag = document.getElementById('sfxBookCategoryTag');
  const heading = document.getElementById('sfxBookMainHeading');
  const leftSummary = document.getElementById('sfxBookLeftSummary');
  const rightContent = document.getElementById('sfxBookRightContent');

  if (!overlay || !rightContent) return;

  // Generatore di 10 Placeholder Grafici Phygital per le Gallerie
  function generatePhotoGrid(label) {
    let html = '<div class="sfx-gallery-grid-10">';
    for (let i = 1; i <= 10; i++) {
      html += `
        <div class="sfx-gallery-thumb" style="display:flex; align-items:center; justify-content:center; background:#11141C; color:var(--gold-primary); font-family:var(--font-mono); font-size:0.65rem; text-align:center; padding:0.5rem; border:1px solid rgba(212,175,55,0.3); border-radius:8px;">
          ${label} // ARCHIVIO #${String(i).padStart(2, '0')}
        </div>
      `;
    }
    html += '</div>';
    return html;
  }

  if (sectionKey === 'presidenza') {
    catTag.textContent = "ORGANO DI VERTICE // PROFILO";
    heading.textContent = "GIULIANO CARATELLI";
    leftSummary.innerHTML = `
      <p style="margin-bottom:1rem;">Founder & CEO di Suprema Future X Enterprise. Garante unico della didattica dal vivo e della solidità contrattuale.</p>
      <p style="margin-bottom:1rem; color:var(--gold-primary);">Motto: "DREAM DEFENSE SYSTEM"</p>
      <p>Lo screening conoscitivo di 60 minuti via Google Meet certifica il merito e seleziona i partecipanti ai percorsi operativi.</p>
    `;
    rightContent.innerHTML = `
      <div>
        <h3 style="font-family:var(--font-sync); color:var(--blue-deep); margin-bottom:0.8rem;">TRAIETTORIA ISTITUZIONALE</h3>
        <p style="font-size:0.9rem; line-height:1.7; color:#374151; margin-bottom:1.5rem;">
          Con oltre due decenni di esperienza nella direzione d'impresa e nello sviluppo di reti commerciali complesse, 
          Giuliano Caratelli ha istituito Suprema Future X per superare l'inefficacia dei modelli formativi tradizionali. 
          Ogni allievo accede a un rapporto autentico e operativo con la dirigenza.
        </p>
        <h4 style="font-family:var(--font-sync); font-size:0.8rem; color:var(--gold-aged); margin-bottom:0.5rem;">
          GALLERIA: 10 MOMENTI SALIENTI DI CARRIERA
        </h4>
        ${generatePhotoGrid('CEO CARATELLI')}
        <div style="margin-top:2rem;">
          <button class="sfx-btn-action-oval" onclick="sfxCloseMasterBook(); sfxScrollTo('fazione-04');">
            PRENOTA ORA SCREENING CON IL CEO ➔
          </button>
        </div>
      </div>
    `;
  } else if (sectionKey === 'ecosistema') {
    catTag.textContent = "ARCHITETTURA // MOTORE D'IMPRESA";
    heading.textContent = "SUPREMA FUTURE X";
    leftSummary.innerHTML = `
      <p style="margin-bottom:1rem;">Alta Formazione Esecutiva 100% Live in Videoconferenza e Concessioni Digitali E-Commerce Autonome a Zero Magazzino.</p>
      <p>Logistica, spedizioni espresse, contratti corrieri e resi interamente gestiti dal nodo centrale.</p>
    `;
    rightContent.innerHTML = `
      <div>
        <h3 style="font-family:var(--font-sync); color:var(--blue-deep); margin-bottom:1rem;">3 SHOWCASE VIDEO FISSATI</h3>
        <div style="display:flex; flex-direction:column; gap:0.8rem; margin-bottom:1.5rem;">
          <div style="background:#090A0E; color:#FFF; padding:0.8rem; border-radius:10px; font-family:var(--font-mono); font-size:0.75rem; border:1px solid var(--gold-primary);">
            VIDEO 01 // Didattica Live & Principi Statutari Anti-Registrazioni
          </div>
          <div style="background:#090A0E; color:#FFF; padding:0.8rem; border-radius:10px; font-family:var(--font-mono); font-size:0.75rem; border:1px solid var(--cyan-neon);">
            VIDEO 02 // Infrastruttura Store E-Commerce & Logistica Centralizzata
          </div>
          <div style="background:#090A0E; color:#FFF; padding:0.8rem; border-radius:10px; font-family:var(--font-mono); font-size:0.75rem; border:1px solid var(--status-green);">
            VIDEO 03 // Ecosistema Phygital & Riconoscimento Suprema Gold Card
          </div>
        </div>

        <h4 style="font-family:var(--font-sync); font-size:0.8rem; color:var(--blue-deep); margin-bottom:0.5rem;">
          10 IMMAGINI OPERATIVE // SEDI & INFRASTRUTTURA
        </h4>
        ${generatePhotoGrid('INFRASTRUTTURA SFX')}
      </div>
    `;
  } else if (sectionKey === 'alison') {
    catTag.textContent = "NEURAL ARCHITECTURE // EAL6+";
    heading.textContent = "CONCIERGE AG-01";
    leftSummary.innerHTML = `
      <p style="margin-bottom:1rem;">Modello linguistico a contesto confinato senza allucinazioni, presidiato da AG-12 Sentinel per la difesa dei perimetri IP.</p>
      <p>Sintesi vocale deterministica e radar vettoriale con rendering a 60 fps nativi.</p>
    `;
    rightContent.innerHTML = `
      <div>
        <h3 style="font-family:var(--font-sync); color:var(--blue-deep); margin-bottom:1rem;">SPECIFICHE PROTOCOLLO NEURALE</h3>
        <ul style="line-height:1.9; font-size:0.88rem; color:#374151; margin-left:1.2rem; margin-bottom:1.5rem;">
          <li><strong>Pipeline di Triage:</strong> Al quinto scambio scatta l'instradamento obbligatorio alla videoconferenza del CEO.</li>
          <li><strong>Isolamento Dati:</strong> Nessun segreto industriale o formula finanziaria risiede nei prompt del frontend.</li>
          <li><strong>Hardware Kill-Switch:</strong> Disattivazione simultanea dei 15 agenti tramite comando direzionale X-BOX.</li>
        </ul>
        <button class="sfx-btn-action-oval" style="background:var(--bg-dark); color:var(--cyan-neon); border:1px solid var(--cyan-neon);" onclick="sfxCloseMasterBook(); sfxScrollTo('fazione-04');">
          APRI CONSOLE CHATBOT ➔
        </button>
      </div>
    `;
  } else if (sectionKey === 'faq') {
    catTag.textContent = "REGISTRO INFORMATIVO // 40 VOCI";
    heading.textContent = "FAQ UFFICIALI";
    leftSummary.innerHTML = `
      <p>Tutte le risposte ufficiali certificate e igienizzate per la consultazione pubblica immediata.</p>
    `;
    let faqListHtml = '<div style="display:flex; flex-direction:column; gap:0.8rem; max-height:55vh; overflow-y:auto; padding-right:0.5rem;">';
    sfxFaqDatabase.forEach((item, idx) => {
      faqListHtml += `
        <div style="background:#FFF; border:1px solid rgba(212,175,55,0.3); border-radius:10px; padding:1rem;">
          <strong style="color:var(--blue-deep); font-size:0.85rem; font-family:var(--font-sync); display:block; margin-bottom:0.4rem;">
            ${String(idx + 1).padStart(2, '0')}. ${item.q}
          </strong>
          <span style="font-size:0.85rem; color:#4B5563; line-height:1.6; display:block;">
            ${item.a}
          </span>
        </div>
      `;
    });
    faqListHtml += '</div>';
    rightContent.innerHTML = faqListHtml;
  }

  overlay.classList.add('active');
}

function sfxCloseMasterBook() {
  sfxPlayChime('tick');
  const overlay = document.getElementById('sfxMasterBookOverlay');
  if (overlay) overlay.classList.remove('active');
}

/* ----------------------------------------------------------------------------
 * 7. MENU HAMBURGER A 14 SEZIONI CON TIMEOUT A 15 SECONDI
 * ---------------------------------------------------------------------------- */
let sfxMenuTimer = null;
let sfxMenuProgressInterval = null;
const SFX_MENU_LIMIT = 15000;

function sfxToggleMenu(open) {
  const panel = document.getElementById('sfxHamburgerPanel');
  const bar = document.getElementById('sfxMenuProgressBar');
  if (!panel) return;

  sfxPlayChime('chime');

  if (open) {
    panel.classList.add('active');
    panel.setAttribute('aria-hidden', 'false');
    
    // Avvio Countdown 15s
    clearTimeout(sfxMenuTimer);
    clearInterval(sfxMenuProgressInterval);

    const startTime = Date.now();
    sfxMenuProgressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, SFX_MENU_LIMIT - elapsed);
      const ratio = remaining / SFX_MENU_LIMIT;
      if (bar) bar.style.transform = `scaleX(${ratio})`;

      if (remaining <= 0) {
        sfxToggleMenu(false);
      }
    }, 50);

    sfxMenuTimer = setTimeout(() => {
      sfxToggleMenu(false);
    }, SFX_MENU_LIMIT);
  } else {
    panel.classList.remove('active');
    panel.setAttribute('aria-hidden', 'true');
    clearTimeout(sfxMenuTimer);
    clearInterval(sfxMenuProgressInterval);
    if (bar) bar.style.transform = 'scaleX(1)';
  }
}

/* ----------------------------------------------------------------------------
 * 8. CAROSELLO LOGO A 6 FRAME & TRIGGER GATEWAY SEGRETO 3-TAP
 * ---------------------------------------------------------------------------- */
function sfxInitLogoEngine() {
  const frames = document.querySelectorAll('.sfx-logo-frame-item');
  if (frames.length > 0) {
    let activeIdx = 0;
    setInterval(() => {
      frames[activeIdx].classList.remove('active');
      activeIdx = (activeIdx + 1) % frames.length;
      frames[activeIdx].classList.add('active');
    }, 2500);
  }

  // Gateway 3-Tap su logo SFX Top Bar per la console X-BOX
  const logoTrigger = document.getElementById('sfxMasterLogo');
  if (logoTrigger) {
    let taps = 0;
    let tapTimer = null;
    logoTrigger.addEventListener('click', () => {
      taps++;
      sfxPlayChime('tick');
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => { taps = 0; }, 1200);

      if (taps === 3) {
        taps = 0;
        sfxPlayChime('chime');
        alert("RILEVAMENTO GATEWAY GOVERNANCE // TRASFERIMENTO ALLA CONSOLE X-BOX...");
        window.location.href = "admin.html";
      }
    });
  }
}

/* ----------------------------------------------------------------------------
 * 9. OROLOGIO SINCRONO T+0 ROMA CET & TELEMETRIA LIVE
 * ---------------------------------------------------------------------------- */
function sfxInitLiveClockAndTelemetry() {
  const clockEl = document.getElementById('sfxLiveClock');
  if (clockEl) {
    function updateClock() {
      const now = new Date();
      const opts = { timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      clockEl.textContent = now.toLocaleTimeString('it-IT', opts) + ' CET';
    }
    setInterval(updateClock, 1000);
    updateClock();
  }

  // Contatori Visitatori e Tempo di Sessione
  const visitorBadge = document.getElementById('sfxVisitorCount');
  const timerBadge = document.getElementById('sfxSessionTimer');

  if (visitorBadge) {
    setInterval(() => {
      const variation = (Math.random() > 0.48 ? 1 : -1);
      let count = parseInt(visitorBadge.textContent, 10) || 47;
      count = Math.max(35, Math.min(68, count + variation));
      visitorBadge.textContent = count;
    }, 4000);
  }

  if (timerBadge) {
    let sec = 0;
    setInterval(() => {
      sec++;
      const m = String(Math.floor(sec / 60)).padStart(2, '0');
      const s = String(sec % 60).padStart(2, '0');
      timerBadge.textContent = `${m}:${s}`;
    }, 1000);
  }
}

/* ----------------------------------------------------------------------------
 * 10. SELETTORE 11 LINGUE & FUNZIONI DI SCROLL GUIDATO
 * ---------------------------------------------------------------------------- */
function sfxToggleLangMenu() {
  sfxPlayChime('tick');
  const menu = document.getElementById('sfxLangMenu');
  if (menu) menu.classList.toggle('active');
}

function sfxSelectLang(code, label) {
  sfxPlayChime('chime');
  const current = document.getElementById('sfxCurrentLang');
  if (current) current.textContent = code;

  const menu = document.getElementById('sfxLangMenu');
  if (menu) menu.classList.remove('active');
  console.log(`[SFX LINGUA ATTIVA] ${label}`);
}

function sfxScrollTo(id) {
  sfxPlayChime('chime');
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function sfxOpenChiSiamo() {
  sfxOpenBook('presidenza');
}

/* ----------------------------------------------------------------------------
 * 11. INIZIALIZZAZIONE GLOBALE
 * ---------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  sfxInitRadarCanvas();
  sfxInitLogoEngine();
  sfxInitLiveClockAndTelemetry();
});
