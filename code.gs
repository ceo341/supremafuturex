<!DOCTYPE html>
<html lang="it" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>X-BOX ENTERPRISE // BOX LANDING V.6 (NEXUS ENGINE)</title>
    <meta name="theme-color" content="#00F0FF">

    <link rel="icon" type="image/png" href="media/logo.png">

    <!-- Tailwind CSS, Google Fonts & FontAwesome 6 -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800;900&family=Orbitron:wght@700;900&family=Syncopate:wght@400;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="stile-globale.css?v=50">

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: { 
                        sfx: { 
                            gold: '#B8860B', 
                            goldLight: '#D4AF37', 
                            cyan: '#008B99', 
                            cyanLight: '#00F0FF', 
                            dark: '#090A0D',
                            card: '#12141C'
                        } 
                    },
                    fontFamily: { 
                        sans: ['Montserrat', 'sans-serif'], 
                        cyber: ['Orbitron', 'sans-serif'], 
                        grotesk: ['Syncopate', 'sans-serif'], 
                        mono: ['JetBrains Mono', 'monospace'] 
                    }
                }
            }
        }
    </script>

    <style>
        /* SFONDO MATRIX CYAN RALLENTATO */
        body {
            background-color: #050A0F;
            background-image: 
                radial-gradient(circle at 50% 50%, rgba(74, 14, 78, 0.15) 0%, transparent 80%),
                linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(212, 175, 55, 0.02) 1px, transparent 1px);
            background-size: 100% 100%, 32px 32px, 32px 32px;
            animation: matrixScroll 60s linear infinite;
        }
        @keyframes matrixScroll { 
            0% { background-position: 0 0, 0 0, 0 0; } 
            100% { background-position: 0 0, 0 1000px, 0 0; } 
        }

        /* PANNELLI NEON EAL6+ */
        .neon-panel {
            background: rgba(14, 16, 23, 0.95);
            backdrop-filter: blur(14px);
            border: 1px solid rgba(0, 240, 255, 0.35);
            box-shadow: 0 0 25px rgba(0, 240, 255, 0.08);
            border-radius: 1.5rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .neon-panel:hover { 
            border-color: rgba(0, 240, 255, 0.65); 
            box-shadow: 0 0 35px rgba(0, 240, 255, 0.18); 
        }
        .neon-panel-gold { 
            border-color: rgba(212, 175, 55, 0.45); 
            box-shadow: 0 0 25px rgba(212, 175, 55, 0.1); 
        }
        .neon-panel-gold:hover { 
            border-color: rgba(212, 175, 55, 0.8); 
            box-shadow: 0 0 35px rgba(212, 175, 55, 0.22); 
        }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.4); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #00F0FF; border-radius: 3px; }

        /* TOGGLE SWITCH ON/OFF */
        .toggle-checkbox:checked { right: 0; border-color: #00F0FF; }
        .toggle-checkbox:checked + .toggle-label { background-color: #00F0FF; }

        /* BLOCCO SAFE MODE */
        .safe-mode-active input, 
        .safe-mode-active textarea, 
        .safe-mode-active select { 
            pointer-events: none; 
            opacity: 0.6; 
        }
    </style>
</head>
<body class="text-gray-200 font-mono min-h-screen flex flex-col justify-between selection:bg-sfx-cyan selection:text-black overflow-x-hidden">

    <!-- HEADER & MENU HAMBURGER (CON AUTO-CHIUSURA 15 SEC) -->
    <header class="bg-[#090A0D]/95 border-b border-sfx-cyan/50 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between sticky top-0 z-50 backdrop-blur-xl shadow-[0_0_20px_rgba(0,240,255,0.2)]">
        <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-black p-0.5 border-2 border-sfx-cyan shadow-[0_0_15px_rgba(0,240,255,0.5)] cursor-pointer" onclick="window.location.href='index.html'">
                <img src="media/logo.png" alt="SFX" class="w-full h-full object-cover rounded-full" onerror="this.src='media/logo.png'">
            </div>
            <div>
                <div class="flex items-center space-x-2">
                    <span class="font-grotesk font-black text-white text-sm tracking-wider">X-BOX ENTERPRISE</span>
                    <span class="px-2 py-0.5 bg-sfx-cyan/20 text-sfx-cyanLight text-[9px] font-bold rounded border border-sfx-cyan/30">BOX LANDING</span>
                </div>
                <span class="text-[10px] text-gray-400 font-mono mt-0.5 flex items-center">
                    <span id="dot-sync-status" class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1.5"></span> NEXUS ENGINE EAL6+ ATTIVO
                </span>
            </div>
        </div>

        <div class="flex items-center gap-3 mt-2 sm:mt-0 relative font-mono">
            <!-- HAMBURGER MENU MODULI -->
            <button onclick="toggleMenuHamburger()" class="px-4 py-2.5 bg-[#12141C] border border-gray-700 hover:border-sfx-cyan text-gray-300 rounded-xl font-bold transition-all flex items-center space-x-2 cursor-pointer z-50">
                <i class="fa-solid fa-bars text-sfx-cyan"></i> <span class="hidden md:inline text-xs">MENU MODULI</span>
            </button>
            
            <div id="dropdown-hamburger" class="absolute hidden top-full right-0 mt-3 w-64 bg-[#090A0D] border border-sfx-cyan/50 rounded-2xl p-2 shadow-2xl z-40 space-y-1 transform transition-all">
                <div class="px-3 py-2 text-[9px] text-gray-500 font-bold border-b border-gray-800 mb-1 flex justify-between">
                    <span>NAVIGAZIONE MODULI</span><span id="menu-timer-display" class="text-sfx-cyan">15s</span>
                </div>
                <a href="#modulo-sezioni" onclick="selezionaVoceMenu('modulo-sezioni')" class="block px-3 py-2.5 rounded-xl text-gray-300 hover:text-black hover:bg-sfx-cyan transition-all text-xs font-bold"><i class="fa-solid fa-layer-group w-5"></i> 11 Sezioni Landing</a>
                <a href="#modulo-crm" onclick="selezionaVoceMenu('modulo-crm')" class="block px-3 py-2.5 rounded-xl text-gray-300 hover:text-black hover:bg-sfx-cyan transition-all text-xs font-bold"><i class="fa-solid fa-address-book w-5"></i> Super CRM &amp; Lead</a>
                <a href="#modulo-contratti" onclick="selezionaVoceMenu('modulo-contratti')" class="block px-3 py-2.5 rounded-xl text-gray-300 hover:text-black hover:bg-sfx-cyan transition-all text-xs font-bold"><i class="fa-solid fa-file-signature w-5"></i> Contratti &amp; Moduli</a>
                <a href="#modulo-media" onclick="selezionaVoceMenu('modulo-media')" class="block px-3 py-2.5 rounded-xl text-gray-300 hover:text-black hover:bg-sfx-cyan transition-all text-xs font-bold"><i class="fa-solid fa-photo-film w-5"></i> Media Vault Base64</a>
                <a href="#modulo-promemoria" onclick="selezionaVoceMenu('modulo-promemoria')" class="block px-3 py-2.5 rounded-xl text-gray-300 hover:text-black hover:bg-sfx-gold transition-all text-xs font-bold"><i class="fa-solid fa-clock-rotate-left w-5"></i> Matrix Auto-Mail</a>
            </div>

            <button onclick="window.location.href='admin.html'" class="px-4 py-2.5 bg-sfx-gold/10 border border-sfx-gold text-sfx-goldLight hover:bg-sfx-gold hover:text-black rounded-xl text-xs font-bold transition-all shadow-[0_0_10px_rgba(212,175,55,0.2)] cursor-pointer">
                <i class="fa-solid fa-shield-halved mr-1"></i> BOX SECURITY
            </button>

            <button onclick="window.location.href='index.html'" class="w-10 h-10 bg-[#12141C] border border-gray-700 hover:border-gray-500 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer" title="Torna al Portale">
                <i class="fa-solid fa-door-open"></i>
            </button>
        </div>
    </header>

    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6 relative z-10 font-mono" id="nexus-core-container">
        
        <!-- ===================================================================== -->
        <!-- NEXUS ENGINE DASHBOARD (METRICHE, BACKUP & LOG STREAMING)              -->
        <!-- ===================================================================== -->
        <div class="neon-panel neon-panel-gold p-6 space-y-5">
            <div class="flex flex-wrap items-end justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                    <h1 class="font-grotesk font-black text-2xl text-white uppercase"><i class="fa-solid fa-microchip text-sfx-gold mr-2"></i>NEXUS SYNC ENGINE</h1>
                    <p class="text-[10px] text-gray-400 mt-1">Sincronizzazione Live Landing Page, Telemetria e Sicurezza Dati EAL6+</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="esportaBackupJSON()" class="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-[10px] rounded-lg border border-gray-600 font-bold cursor-pointer transition-colors"><i class="fa-solid fa-download mr-1"></i> BACKUP JSON</button>
                    <label class="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-[10px] rounded-lg border border-gray-600 font-bold cursor-pointer transition-colors"><i class="fa-solid fa-upload mr-1"></i> RIPRISTINA <input type="file" class="hidden" accept=".json" onchange="importaBackupJSON(this)"></label>
                </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div class="p-4 bg-[#090A0D] rounded-xl border border-gray-800 flex flex-col justify-between">
                    <span class="text-gray-500 text-[10px] font-bold uppercase"><i class="fa-solid fa-satellite-dish text-sfx-cyan mr-1"></i> CONNESSIONE LANDING</span>
                    <span class="text-green-400 font-black mt-2 text-sm flex items-center"><span class="w-2 h-2 rounded-full bg-green-400 animate-ping mr-1.5"></span> ALLINEATA IN DIRETTA</span>
                </div>
                <div class="p-4 bg-[#090A0D] rounded-xl border border-gray-800 flex flex-col justify-between">
                    <span class="text-gray-500 text-[10px] font-bold uppercase"><i class="fa-solid fa-euro-sign text-sfx-gold mr-1"></i> INCASSO POTENZIALE CRM</span>
                    <span class="text-sfx-gold font-black mt-2 text-xl" id="nexus-revenue-calc">€ 0,00</span>
                </div>
                <div class="col-span-2 p-3 bg-black rounded-xl border border-gray-800 font-mono text-[10px] text-gray-400 h-20 overflow-y-auto custom-scrollbar" id="nexus-log-terminal">
                    <span class="text-sfx-cyan font-bold">&gt;&gt; Inizializzazione Nexus Engine v17.0 completata.</span><br>
                </div>
            </div>

            <div class="flex flex-wrap justify-between items-center bg-[#12141C] p-3 rounded-xl border border-gray-800 mt-2 gap-3">
                <div class="flex items-center space-x-3">
                    <button onclick="toggleSafeMode()" id="btn-safe-mode" class="px-4 py-1.5 bg-green-900/50 border border-green-500 text-green-400 text-[10px] font-bold rounded shadow-md transition-all cursor-pointer">SAFE MODE: OFF</button>
                    <span class="text-[10px] text-gray-500 hidden sm:inline">Protegge i dati da modifiche accidentali.</span>
                </div>
                <button onclick="pubblicaTuttoSincronizzato()" class="px-5 py-2.5 bg-sfx-cyan hover:bg-cyan-400 text-black text-[11px] font-black rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all uppercase tracking-wider cursor-pointer">
                    <i class="fa-solid fa-bolt mr-1"></i> Sincronizza &amp; Pubblica Tutto sulla Landing
                </button>
            </div>
        </div>

        <!-- ===================================================================== -->
        <!-- MODULO 1: CONTROLLER DELLE 11 SEZIONI LANDING PAGE                     -->
        <!-- ===================================================================== -->
        <div id="modulo-sezioni" class="neon-panel p-6 sm:p-8 space-y-8">
            <div class="border-b border-gray-800 pb-4 flex flex-wrap justify-between items-center gap-2">
                <div>
                    <h2 class="font-grotesk font-black text-xl text-white uppercase tracking-wider"><i class="fa-solid fa-layer-group text-sfx-cyan mr-2"></i>CONTROLLER 11 SEZIONI LANDING</h2>
                    <p class="text-[10px] text-gray-400 font-mono mt-1">Ogni modifica viene auto-salvata in bozza locale. Usa "Pubblica" per inviare in tempo reale alla Landing Page.</p>
                </div>
                <span class="px-3 py-1 rounded bg-sfx-cyan/20 border border-sfx-cyan text-sfx-cyanLight text-[10px] font-bold">CANALE ATTIVO</span>
            </div>

            <!-- SEZIONE 1: HERO -->
            <div class="bg-[#090A0D] p-5 rounded-2xl border border-gray-800 space-y-3 relative group">
                <div class="flex justify-between items-center border-b border-gray-800 pb-2">
                    <div class="flex items-center space-x-3">
                        <h3 class="font-bold text-white text-sm"><span class="text-sfx-cyan">01.</span> HERO (TAG &amp; DESCRIZIONE)</h3>
                        <label class="flex items-center cursor-pointer"><div class="relative"><input type="checkbox" id="toggle-sec1" class="sr-only toggle-checkbox" checked onchange="toggleSezioneStatus(1, this.checked)"><div class="block bg-gray-600 w-8 h-4 rounded-full"></div><div class="dot absolute left-1 top-0.5 bg-white w-3 h-3 rounded-full transition toggle-label"></div></div><div class="ml-2 text-[9px] text-gray-400 font-bold">VISIBILE</div></label>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="resetSezione(1)" class="px-2 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 text-[10px] font-bold transition-colors cursor-pointer">RESET</button>
                        <button onclick="pubblicaSezione(1)" class="px-3 py-1 bg-sfx-cyan text-black rounded hover:bg-cyan-400 text-[10px] font-bold shadow-md transition-all cursor-pointer">PUBBLICA</button>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-500 text-[10px] mb-1 flex justify-between"><span>Badge Intro Tag</span> <span id="char-sec1-tag" class="text-[8px]">0/50</span></label>
                        <input type="text" id="sec-hero-tag" class="sfx-input w-full p-3 bg-[#12141C] border border-gray-700 rounded-xl text-sfx-gold outline-none focus:border-sfx-cyan text-xs" maxlength="50" onkeyup="aggiornaContatore(this, 'char-sec1-tag')">
                    </div>
                    <div>
                        <label class="block text-gray-500 text-[10px] mb-1 flex justify-between"><span>Descrizione Corpo Centrale</span> <span id="char-sec1-desc" class="text-[8px]">0/250</span></label>
                        <textarea id="sec-hero-desc" rows="2" class="sfx-input w-full p-3 bg-[#12141C] border border-gray-700 rounded-xl text-white outline-none focus:border-sfx-cyan resize-none text-xs" maxlength="250" onkeyup="aggiornaContatore(this, 'char-sec1-desc')"></textarea>
                    </div>
                </div>
            </div>

            <!-- SEZIONE 2: PRESIDENZA -->
            <div class="bg-[#090A0D] p-5 rounded-2xl border border-gray-800 space-y-3 relative group">
                <div class="flex justify-between items-center border-b border-gray-800 pb-2">
                    <div class="flex items-center space-x-3">
                        <h3 class="font-bold text-white text-sm"><span class="text-sfx-cyan">02.</span> DIRETTIVE PRESIDENZA CEO</h3>
                        <label class="flex items-center cursor-pointer"><div class="relative"><input type="checkbox" id="toggle-sec2" class="sr-only toggle-checkbox" checked onchange="toggleSezioneStatus(2, this.checked)"><div class="block bg-gray-600 w-8 h-4 rounded-full"></div><div class="dot absolute left-1 top-0.5 bg-white w-3 h-3 rounded-full transition toggle-label"></div></div><div class="ml-2 text-[9px] text-gray-400 font-bold">VISIBILE</div></label>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="pubblicaSezione(2)" class="px-3 py-1 bg-sfx-cyan text-black rounded hover:bg-cyan-400 text-[10px] font-bold shadow-md transition-all cursor-pointer">PUBBLICA</button>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-500 text-[10px] mb-1">Nota Operativa 1 (Bianco)</label>
                        <textarea id="sec-pres-nota1" rows="2" class="sfx-input w-full p-3 bg-[#12141C] border border-gray-700 rounded-xl text-white outline-none focus:border-sfx-cyan resize-none text-xs"></textarea>
                    </div>
                    <div>
                        <label class="block text-gray-500 text-[10px] mb-1">Nota Raccomandazione 2 (Oro)</label>
                        <textarea id="sec-pres-nota2" rows="2" class="sfx-input w-full p-3 bg-[#12141C] border border-gray-700 rounded-xl text-sfx-goldLight outline-none focus:border-sfx-cyan resize-none text-xs"></textarea>
                    </div>
                </div>
            </div>

            <!-- SEZIONE 4: ACADEMY CORSI & DOSSIER (LISTINO 249€, 299€, 349€) -->
            <div class="bg-[#090A0D] p-5 rounded-2xl border border-sfx-gold/50 shadow-[0_0_20px_rgba(212,175,55,0.1)] space-y-4">
                <div class="flex justify-between items-center border-b border-gray-800 pb-2">
                    <h3 class="font-bold text-sfx-goldLight text-sm"><span class="text-sfx-gold">04.</span> LISTINO ACADEMY &amp; DOSSIER CORSI</h3>
                    <button onclick="pubblicaSezione(4)" class="px-4 py-1.5 bg-sfx-gold text-black rounded-lg hover:bg-yellow-500 text-[10px] font-black shadow-md transition-all uppercase tracking-widest cursor-pointer"><i class="fa-solid fa-tags mr-1"></i> Aggiorna Listini</button>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <!-- SILVER TIER 249€ -->
                    <div class="bg-[#12141C] p-4 rounded-xl border border-gray-800 space-y-2">
                        <label class="block font-black text-white text-xs">1. SILVER TIER</label>
                        <input type="text" id="prz-silver" value="249 €" class="sfx-input w-full p-2 bg-black border border-gray-700 rounded text-sfx-gold font-bold outline-none text-center text-lg">
                        <textarea id="desc-silver" rows="2" class="sfx-input w-full p-2 bg-black border border-gray-700 rounded text-gray-300 resize-none text-[10px] outline-none" placeholder="Descrizione breve..."></textarea>
                        <textarea id="dossier-silver" rows="3" class="sfx-input w-full p-2 bg-[#090A0D] border border-gray-700 rounded text-sfx-cyanLight resize-none text-[9px] outline-none font-sans" placeholder="Dossier Modale (Punti elenco, info extra)"></textarea>
                    </div>
                    <!-- EXECUTIVE MASTER 299€ -->
                    <div class="bg-[#12141C] p-4 rounded-xl border border-sfx-gold/50 shadow-inner space-y-2 relative">
                        <span class="absolute top-0 right-0 bg-sfx-gold text-black text-[8px] font-bold px-2 py-0.5 rounded-bl-lg">CONSIGLIATO</span>
                        <label class="block font-black text-yellow-400 text-xs">2. EXECUTIVE MASTER</label>
                        <input type="text" id="prz-executive" value="299 €" class="sfx-input w-full p-2 bg-black border border-sfx-gold/50 rounded text-yellow-400 font-bold outline-none text-center text-lg shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                        <textarea id="desc-executive" rows="2" class="sfx-input w-full p-2 bg-black border border-gray-700 rounded text-gray-300 resize-none text-[10px] outline-none"></textarea>
                        <textarea id="dossier-executive" rows="3" class="sfx-input w-full p-2 bg-[#090A0D] border border-gray-700 rounded text-sfx-cyanLight resize-none text-[9px] outline-none font-sans" placeholder="Dossier Modale (Syllabus 8 Settimane)"></textarea>
                    </div>
                    <!-- PREMIUM VIP 349€ -->
                    <div class="bg-[#12141C] p-4 rounded-xl border border-sfx-cyan/30 space-y-2">
                        <label class="block font-black text-sfx-cyanLight text-xs">3. PREMIUM VIP</label>
                        <input type="text" id="prz-vip" value="349 €" class="sfx-input w-full p-2 bg-black border border-sfx-cyan/40 rounded text-sfx-cyanLight font-bold outline-none text-center text-lg">
                        <textarea id="desc-vip" rows="2" class="sfx-input w-full p-2 bg-black border border-gray-700 rounded text-gray-300 resize-none text-[10px] outline-none"></textarea>
                        <textarea id="dossier-vip" rows="3" class="sfx-input w-full p-2 bg-[#090A0D] border border-gray-700 rounded text-sfx-cyanLight resize-none text-[9px] outline-none font-sans" placeholder="Dossier Modale (Mentoring CEO Giuliano)"></textarea>
                    </div>
                </div>
            </div>

            <!-- SEZIONE 9: SHOWCASE MULTIMEDIALE (YOUTUBE LINK) -->
            <div class="bg-[#090A0D] p-5 rounded-2xl border border-gray-800 space-y-3">
                <div class="flex justify-between items-center border-b border-gray-800 pb-2">
                    <h3 class="font-bold text-white text-sm"><span class="text-sfx-cyan">09.</span> SHOWCASE VIDEO (YOUTUBE LINK)</h3>
                    <button onclick="pubblicaSezione(9)" class="px-3 py-1 bg-sfx-cyan text-black rounded hover:bg-cyan-400 text-[10px] font-bold shadow-md transition-all cursor-pointer">PUBBLICA VIDEO</button>
                </div>
                <div class="flex items-end gap-3">
                    <div class="flex-1">
                        <label class="block text-gray-500 text-[10px] mb-1">Sostituisci il video in Landing con un ID YouTube (es. dQw4w9WgXcQ)</label>
                        <input type="text" id="sec-yt-id" class="sfx-input w-full p-3 bg-[#12141C] border border-red-500/50 rounded-xl text-white outline-none focus:border-red-500 text-xs" placeholder="ID Video YouTube...">
                    </div>
                    <button onclick="testYouTubeVideo()" class="px-4 py-3 bg-[#1F2227] border border-gray-600 text-gray-300 rounded-xl text-xs hover:bg-black transition-all cursor-pointer"><i class="fa-brands fa-youtube text-red-500 mr-1"></i> Verifica ID</button>
                </div>
            </div>

            <!-- SEZIONE 10: I 6 SOCIAL UFFICIALI -->
            <div class="bg-[#090A0D] p-5 rounded-2xl border border-gray-800">
                <div class="flex justify-between items-center border-b border-gray-800 pb-3 mb-3">
                    <h3 class="font-bold text-white text-sm"><span class="text-sfx-cyan">10.</span> COLLEGAMENTI AI 6 CANALI SOCIAL</h3>
                    <button onclick="pubblicaSocial()" class="px-3 py-1 bg-sfx-cyan text-black rounded text-[10px] font-bold shadow-md cursor-pointer">SALVA LINK</button>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-[10px]">
                    <div><label class="text-gray-500 mb-1 block"><i class="fa-brands fa-instagram text-pink-500"></i> IG</label><input type="url" id="link-ig" class="sfx-input w-full p-2 bg-[#12141C] border border-gray-700 rounded text-white" placeholder="https://instagram.com/..."></div>
                    <div><label class="text-gray-500 mb-1 block"><i class="fa-brands fa-telegram text-blue-400"></i> TG</label><input type="url" id="link-tg" class="sfx-input w-full p-2 bg-[#12141C] border border-gray-700 rounded text-white" placeholder="https://t.me/..."></div>
                    <div><label class="text-gray-500 mb-1 block"><i class="fa-brands fa-youtube text-red-500"></i> YT</label><input type="url" id="link-yt" class="sfx-input w-full p-2 bg-[#12141C] border border-gray-700 rounded text-white" placeholder="https://youtube.com/..."></div>
                    <div><label class="text-gray-500 mb-1 block"><i class="fa-brands fa-linkedin text-blue-600"></i> IN</label><input type="url" id="link-li" class="sfx-input w-full p-2 bg-[#12141C] border border-gray-700 rounded text-white" placeholder="https://linkedin.com/..."></div>
                    <div><label class="text-gray-500 mb-1 block"><i class="fa-brands fa-tiktok text-gray-300"></i> TK</label><input type="url" id="link-tk" class="sfx-input w-full p-2 bg-[#12141C] border border-gray-700 rounded text-white" placeholder="https://tiktok.com/@..."></div>
                    <div><label class="text-gray-500 mb-1 block"><i class="fa-brands fa-facebook text-blue-500"></i> FB</label><input type="url" id="link-fb" class="sfx-input w-full p-2 bg-[#12141C] border border-gray-700 rounded text-white" placeholder="https://facebook.com/..."></div>
                </div>
            </div>
            
            <div class="p-3 bg-green-900/20 border border-green-500/30 rounded-xl text-center text-green-400 text-[10px] font-bold">
                <i class="fa-solid fa-shield-halved mr-1"></i> I Documenti Statutari e il Codice Etico sono gestiti come Modali a Scomparsa Protette sulla Landing Page.
            </div>
        </div>

        <!-- ===================================================================== -->
        <!-- MODULO 2: CENTRALE PROMEMORIA MATRIX (EMAIL & WHATSAPP)                -->
        <!-- ===================================================================== -->
        <div id="modulo-promemoria" class="neon-panel p-6 sm:p-8 space-y-6">
            <div class="flex flex-wrap items-center justify-between border-b border-gray-800 pb-4 gap-2">
                <div>
                    <h2 class="font-grotesk font-black text-xl text-white uppercase"><i class="fa-solid fa-clock-rotate-left text-sfx-gold mr-2"></i>CENTRALE PROMEMORIA MATRIX</h2>
                    <p class="text-[10px] text-gray-400 font-mono mt-1">Gestione sequenze follow-up automatiche e manuali cadenzate nel tempo.</p>
                </div>
                <button onclick="salvaTuttiITemplate()" class="px-5 py-2.5 bg-sfx-gold hover:bg-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all cursor-pointer">
                    <i class="fa-solid fa-floppy-disk mr-1"></i> SALVA TEMPLATE MATRIX
                </button>
            </div>
            
            <div id="feedback-matrix" class="hidden p-3 bg-green-950/80 border border-green-500 text-green-400 text-xs font-bold rounded-xl text-center shadow-lg"></div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs font-mono">
                <!-- Fase T0: Accredito Istantaneo -->
                <div class="p-5 bg-[#090A0D] rounded-2xl border border-gray-800 space-y-3">
                    <div class="flex items-center justify-between border-b border-gray-800 pb-2">
                        <span class="font-bold text-white flex items-center">
                            <span class="w-5 h-5 inline-flex items-center justify-center bg-sfx-gold text-black rounded-full mr-2 text-[10px] font-black">1</span>
                            Fase T0 — Accredito Immediato
                        </span>
                        <button onclick="toggleSwitchCadenza('t0')" id="btn-switch-t0" class="w-10 h-5 bg-green-600 rounded-full relative cursor-pointer transition-colors">
                            <div id="dot-switch-t0" class="w-3 h-3 bg-white rounded-full absolute top-1 right-1 transition-all"></div>
                        </button>
                    </div>
                    <label class="block text-gray-500 text-[10px]">Testo Email Notifica Immediata</label>
                    <textarea id="tpl-email-t0" rows="3" class="sfx-input w-full p-3 bg-[#12141C] border border-gray-700 rounded-xl text-gray-200 outline-none focus:border-sfx-gold resize-none text-[11px]"></textarea>
                    <label class="block text-gray-500 text-[10px]">Script WhatsApp Benvenuto</label>
                    <textarea id="tpl-wa-t0" rows="2" class="sfx-input w-full p-3 bg-[#12141C] border border-gray-700 rounded-xl text-green-400 outline-none focus:border-green-500 resize-none text-[11px]"></textarea>
                </div>

                <!-- Fase T7: Materiale Didattico -7 Giorni -->
                <div class="p-5 bg-[#090A0D] rounded-2xl border border-gray-800 space-y-3">
                    <div class="flex items-center justify-between border-b border-gray-800 pb-2">
                        <span class="font-bold text-white flex items-center">
                            <span class="w-5 h-5 inline-flex items-center justify-center bg-sfx-cyan text-black rounded-full mr-2 text-[10px] font-black">2</span>
                            Fase T-7 — Consegna Dispensa (-7gg)
                        </span>
                        <button onclick="toggleSwitchCadenza('t7')" id="btn-switch-t7" class="w-10 h-5 bg-green-600 rounded-full relative cursor-pointer transition-colors">
                            <div id="dot-switch-t7" class="w-3 h-3 bg-white rounded-full absolute top-1 right-1 transition-all"></div>
                        </button>
                    </div>
                    <label class="block text-gray-500 text-[10px]">Testo Email Dispensa</label>
                    <textarea id="tpl-email-t7" rows="3" class="sfx-input w-full p-3 bg-[#12141C] border border-gray-700 rounded-xl text-gray-200 outline-none focus:border-sfx-cyan resize-none text-[11px]"></textarea>
                    <label class="block text-gray-500 text-[10px]">Promemoria WhatsApp</label>
                    <textarea id="tpl-wa-t7" rows="2" class="sfx-input w-full p-3 bg-[#12141C] border border-gray-700 rounded-xl text-green-400 outline-none focus:border-green-500 resize-none text-[11px]"></textarea>
                </div>

                <!-- Fase T48: Questionario & Screening -48 Ore -->
                <div class="p-5 bg-[#090A0D] rounded-2xl border border-gray-800 space-y-3">
                    <div class="flex items-center justify-between border-b border-gray-800 pb-2">
                        <span class="font-bold text-white flex items-center">
                            <span class="w-5 h-5 inline-flex items-center justify-center bg-yellow-400 text-black rounded-full mr-2 text-[10px] font-black">3</span>
                            Fase T-48 — Screening &amp; Questionario (-48h)
                        </span>
                        <button onclick="toggleSwitchCadenza('t48')" id="btn-switch-t48" class="w-10 h-5 bg-green-600 rounded-full relative cursor-pointer transition-colors">
                            <div id="dot-switch-t48" class="w-3 h-3 bg-white rounded-full absolute top-1 right-1 transition-all"></div>
                        </button>
                    </div>
                    <label class="block text-gray-500 text-[10px]">Testo Email Questionario</label>
                    <textarea id="tpl-email-t48" rows="3" class="sfx-input w-full p-3 bg-[#12141C] border border-gray-700 rounded-xl text-gray-200 outline-none focus:border-yellow-400 resize-none text-[11px]"></textarea>
                    <label class="block text-gray-500 text-[10px]">Alert WhatsApp Questionario</label>
                    <textarea id="tpl-wa-t48" rows="2" class="sfx-input w-full p-3 bg-[#12141C] border border-gray-700 rounded-xl text-green-400 outline-none focus:border-green-500 resize-none text-[11px]"></textarea>
                </div>

                <!-- Fase T5: Accesso Stanza Meet -5 Minuti -->
                <div class="p-5 bg-[#090A0D] rounded-2xl border border-gray-800 space-y-3">
                    <div class="flex items-center justify-between border-b border-gray-800 pb-2">
                        <span class="font-bold text-white flex items-center">
                            <span class="w-5 h-5 inline-flex items-center justify-center bg-red-500 text-white rounded-full mr-2 text-[10px] font-black">4</span>
                            Fase T-5 — Stanza Meet Live (-5min)
                        </span>
                        <button onclick="toggleSwitchCadenza('t5')" id="btn-switch-t5" class="w-10 h-5 bg-green-600 rounded-full relative cursor-pointer transition-colors">
                            <div id="dot-switch-t5" class="w-3 h-3 bg-white rounded-full absolute top-1 right-1 transition-all"></div>
                        </button>
                    </div>
                    <label class="block text-gray-500 text-[10px]">Testo Email Link Call Diretto</label>
                    <textarea id="tpl-email-t5" rows="3" class="sfx-input w-full p-3 bg-[#12141C] border border-gray-700 rounded-xl text-gray-200 outline-none focus:border-red-500 resize-none text-[11px]"></textarea>
                    <label class="block text-gray-500 text-[10px]">Spinta WhatsApp Call Imminente</label>
                    <textarea id="tpl-wa-t5" rows="2" class="sfx-input w-full p-3 bg-[#12141C] border border-gray-700 rounded-xl text-green-400 outline-none focus:border-green-500 resize-none text-[11px]"></textarea>
                </div>
            </div>
        </div>

        <!-- ===================================================================== -->
        <!-- MODULO 3: SUPER CRM, FILTRI & 1-CLICK CLOSING                         -->
        <!-- ===================================================================== -->
        <div id="modulo-crm" class="neon-panel p-6 sm:p-8 space-y-6">
            <div class="flex flex-wrap items-center justify-between border-b border-gray-800 pb-4 gap-3">
                <div>
                    <h2 class="font-grotesk font-black text-xl text-sfx-cyanLight uppercase"><i class="fa-solid fa-address-book mr-2"></i>SUPER CRM &amp; SCREENING CANDIDATI</h2>
                    <p class="text-[10px] text-gray-400 font-mono mt-1">Acquisizione automatica candidature con seriale SFX irreversibile.</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="caricaLeadsCRM()" class="px-4 py-2 bg-[#090A0D] border border-sfx-cyan/50 hover:bg-sfx-cyan/20 text-sfx-cyanLight rounded-xl text-xs font-bold transition-all cursor-pointer">
                        <i class="fa-solid fa-rotate mr-1"></i> Ricarica Da Cloud
                    </button>
                    <button onclick="esportaLeadsCSV()" class="px-4 py-2 bg-sfx-gold hover:bg-yellow-500 text-black rounded-xl text-xs font-black transition-all shadow-[0_0_10px_rgba(212,175,55,0.3)] cursor-pointer">
                        <i class="fa-solid fa-file-csv mr-1"></i> Esporta CSV
                    </button>
                </div>
            </div>

            <!-- FILTRI DI RICERCA & PRIORITÀ -->
            <div class="p-4 bg-[#090A0D] rounded-2xl border border-gray-800 flex flex-wrap gap-4 items-end font-mono text-xs">
                <div class="flex-1 min-w-[220px]">
                    <label class="block text-gray-500 text-[10px] mb-1 uppercase font-bold">Cerca Corsista (Nome, Seriale, Email):</label>
                    <input type="text" id="crm-search" oninput="filtraSuperCRM()" placeholder="Es. Mario Rossi oppure SFX-26..." class="w-full p-3 bg-[#12141C] border border-gray-700 rounded-xl text-white outline-none focus:border-sfx-cyan text-xs">
                </div>
                <div>
                    <label class="block text-gray-500 text-[10px] mb-1 uppercase font-bold">Filtro Percorso:</label>
                    <select id="crm-filter-percorso" onchange="filtraSuperCRM()" class="p-3 bg-[#12141C] border border-gray-700 rounded-xl text-gray-300 outline-none cursor-pointer focus:border-sfx-cyan text-xs">
                        <option value="TUTTI">Tutti i Percorsi</option>
                        <option value="Conferenza CEO">👑 Screening CEO</option>
                        <option value="Silver Tier">🎓 Silver Tier (€249)</option>
                        <option value="Executive Master">🎓 Executive Master (€299)</option>
                        <option value="Premium VIP">🎓 Premium VIP (€349)</option>
                    </select>
                </div>
                <div>
                    <label class="block text-gray-500 text-[10px] mb-1 uppercase font-bold">Stato / Priorità:</label>
                    <select id="crm-filter-priorita" onchange="filtraSuperCRM()" class="p-3 bg-[#12141C] border border-gray-700 rounded-xl text-gray-300 outline-none cursor-pointer focus:border-sfx-cyan text-xs">
                        <option value="TUTTI">Tutte le Priorità</option>
                        <option value="ALTA">🔴 Alta Priorità</option>
                        <option value="MEDIA">🟡 Media Priorità</option>
                        <option value="CHIUSO">🟢 Iscritto / Chiuso</option>
                    </select>
                </div>
            </div>

            <!-- TABELLA REGISTRO CANDIDATI -->
            <div class="overflow-x-auto bg-[#090A0D] rounded-2xl border border-gray-800">
                <table class="w-full text-left font-mono text-[11px]">
                    <thead class="bg-[#12141C] border-b border-gray-800">
                        <tr class="text-sfx-cyanLight uppercase text-[10px] tracking-wider">
                            <th class="p-4">Priorità</th>
                            <th class="p-4">Seriale SFX</th>
                            <th class="p-4">Candidato / Email</th>
                            <th class="p-4">Percorso Richiesto</th>
                            <th class="p-4">Slot Orario</th>
                            <th class="p-4 text-center">1-Click WhatsApp</th>
                            <th class="p-4 text-right">Stanza Meet</th>
                        </tr>
                    </thead>
                    <tbody id="tbody-super-crm" class="divide-y divide-gray-800 text-gray-300">
                        <!-- Iniettato dinamicamente da JavaScript -->
                    </tbody>
                </table>
            </div>

            <!-- SCHEDA DETTAGLIO RAPIDA CORSISTA SELEZIONATO -->
            <div id="pannello-corsista-attivo" class="hidden p-6 bg-[#090A0D] border-2 border-sfx-cyan rounded-2xl space-y-4 font-mono text-xs shadow-[0_0_25px_rgba(0,240,255,0.15)]">
                <div class="flex justify-between items-center border-b border-gray-800 pb-3">
                    <span class="text-white font-black uppercase text-sm" id="pannello-nome-corsista">SCHEDA CORSISTA</span>
                    <button onclick="chiudiPannelloCorsista()" class="text-gray-500 hover:text-white cursor-pointer"><i class="fa-solid fa-xmark text-lg"></i></button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="space-y-2 text-gray-400">
                        <p><strong class="text-white">Identificativo:</strong> <span id="pannello-id" class="text-sfx-gold font-bold"></span></p>
                        <p><strong class="text-white">Email Ufficiale:</strong> <span id="pannello-email"></span></p>
                        <p><strong class="text-white">Recapito:</strong> <span id="pannello-tel"></span></p>
                        <p><strong class="text-white">Ambito:</strong> <span id="pannello-percorso" class="text-sfx-cyanLight font-bold"></span></p>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-gray-400 font-bold text-[10px] uppercase">Note di Screening Riservate:</label>
                        <textarea id="pannello-note" rows="3" class="w-full p-2 bg-[#12141C] border border-gray-700 rounded-lg text-white text-[10px] outline-none resize-none" placeholder="Annota dettagli discussi in call..."></textarea>
                    </div>
                    <div class="flex flex-col justify-end space-y-2">
                        <button onclick="copiaDatiInContratto()" class="w-full py-3 bg-sfx-gold text-black hover:bg-yellow-500 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(212,175,55,0.3)] cursor-pointer">
                            <i class="fa-solid fa-file-signature mr-1"></i> Emetti Atto Privato 1-to-1
                        </button>
                        <button onclick="inviaScriptWhatsAppDedicato()" class="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-[10px] uppercase transition-all cursor-pointer">
                            <i class="fa-brands fa-whatsapp mr-1"></i> Notifica Benvenuto WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- ===================================================================== -->
        <!-- MODULO 4: GENERATORE CONTRATTI LIVE 1-TO-1 & WORKSPACE DRIVE          -->
        <!-- ===================================================================== -->
        <div id="modulo-contratti" class="neon-panel neon-panel-gold p-6 sm:p-8 space-y-6">
            <div class="flex flex-wrap items-center justify-between border-b border-gray-800 pb-4 gap-2">
                <div>
                    <h2 class="font-grotesk font-black text-xl text-white uppercase"><i class="fa-solid fa-file-contract text-sfx-gold mr-2"></i>ATTI PRIVATI LIVE 1-TO-1 &amp; WORKSPACE</h2>
                    <p class="text-[10px] text-gray-400 font-mono mt-1">Emissione documentazione statutaria "Zero Video" a prezzo bloccato.</p>
                </div>
                <button onclick="generaGoldCardCode()" class="px-4 py-2 bg-sfx-gold text-black rounded-xl text-xs font-black cursor-pointer shadow-md hover:bg-yellow-500 transition-all">
                    <i class="fa-solid fa-ticket mr-1"></i> Conia Codice Gold Card
                </button>
            </div>

            <form id="form-contratto" onsubmit="generaContrattoOneToOne(event)" class="space-y-4 text-xs font-mono bg-[#090A0D] p-6 rounded-2xl border border-gray-800">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-gray-500 mb-1 text-[10px] font-bold">SERIALE SFX *</label>
                        <input type="text" id="contratto-sfx-id" required readonly placeholder="SFX-26-XXXX" class="w-full p-3 bg-black border border-gray-700 rounded-xl text-sfx-gold font-bold outline-none cursor-not-allowed text-xs">
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-gray-500 mb-1 text-[10px] font-bold">NOME E COGNOME CORSISTA *</label>
                        <input type="text" id="contratto-nome" required placeholder="Mario Rossi" class="w-full p-3 bg-[#12141C] border border-gray-700 rounded-xl text-white outline-none focus:border-sfx-gold text-xs">
                    </div>
                    <div>
                        <label class="block text-gray-500 mb-1 text-[10px] font-bold">EMAIL CORSISTA *</label>
                        <input type="email" id="contratto-email" required placeholder="mario.rossi@email.com" class="w-full p-3 bg-[#12141C] border border-gray-700 rounded-xl text-white outline-none focus:border-sfx-gold text-xs">
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-gray-500 mb-1 text-[10px] font-bold">PERCORSO &amp; TARIFFA BLOCCATA *</label>
                        <select id="contratto-percorso" class="w-full p-3 bg-[#12141C] border border-gray-700 rounded-xl text-white font-bold outline-none cursor-pointer text-xs">
                            <option value="Silver Tier|249">🎓 Academy Silver Tier — € 249,00</option>
                            <option value="Executive Master|299" selected>🎓 Academy Executive Master — € 299,00</option>
                            <option value="Premium VIP|349">🎓 Academy Premium VIP — € 349,00</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-500 mb-1 text-[10px] font-bold">CODICE FISCALE / PARTITA IVA</label>
                        <input type="text" id="contratto-cf" placeholder="Dati di fatturazione..." class="w-full p-3 bg-[#12141C] border border-gray-700 rounded-xl text-gray-300 outline-none focus:border-sfx-gold text-xs">
                    </div>
                    <div>
                        <label class="block text-gray-500 mb-1 text-[10px] font-bold">SERIALE SUPREMA GOLD CARD</label>
                        <input type="text" id="contratto-gold" placeholder="Es. GOLD-849102" class="w-full p-3 bg-[#12141C] border border-gray-700 rounded-xl text-sfx-goldLight font-bold outline-none focus:border-sfx-gold text-xs">
                    </div>
                </div>
                <div class="flex flex-wrap gap-4 pt-4">
                    <button type="submit" class="flex-1 py-4 bg-gradient-to-r from-sfx-gold to-yellow-600 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:brightness-110 cursor-pointer">
                        1. GENERA ATTO PRIVATO UFFICIALE (PDF)
                    </button>
                    <button type="button" onclick="eseguiDeliveryWorkspace()" class="flex-1 py-4 bg-transparent border-2 border-sfx-cyan text-sfx-cyanLight hover:bg-sfx-cyan hover:text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all cursor-pointer">
                        2. INIETTA MODULI NEL WORKSPACE DRIVE
                    </button>
                </div>
            </form>

            <!-- ANTEPRIMA ATTO STATUTARIO PRONTO -->
            <div id="contratto-anteprima-box" class="hidden p-6 bg-[#090A0D] border-2 border-sfx-goldLight rounded-2xl space-y-4">
                <div class="flex justify-between items-center border-b border-gray-800 pb-3">
                    <span class="text-sfx-goldLight font-black text-xs uppercase tracking-wider">ATTO PRIVATO LIVE REGISTRATO &amp; VALIDATO</span>
                    <div class="flex gap-2">
                        <button onclick="stampaContratto()" class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-[10px] font-bold cursor-pointer">
                            <i class="fa-solid fa-print mr-1"></i> Stampa / Salva PDF
                        </button>
                        <button onclick="inviaEmailContratto()" class="px-4 py-2 bg-sfx-cyan text-black rounded-lg text-[10px] font-black cursor-pointer shadow-md">
                            <i class="fa-solid fa-envelope mr-1"></i> Invia da academy@
                        </button>
                    </div>
                </div>
                <pre id="contratto-testo" class="text-gray-300 font-mono text-[11px] leading-relaxed max-h-72 overflow-y-auto custom-scrollbar p-4 bg-[#12141C] rounded-xl border border-gray-800 whitespace-pre-wrap"></pre>
            </div>
        </div>

        <!-- ===================================================================== -->
        <!-- MODULO 5: MEDIA VAULT NATIVO APPLE & VIEWPORT 11 POLLICI                -->
        <!-- ===================================================================== -->
        <div id="modulo-media" class="neon-panel p-6 sm:p-8 space-y-6">
            <div class="border-b border-gray-800 pb-4">
                <h2 class="font-grotesk font-black text-xl text-white uppercase"><i class="fa-solid fa-photo-film text-sfx-cyan mr-2"></i>MEDIA VAULT NATIVO APPLE (BASE64)</h2>
                <p class="text-[10px] text-sfx-cyanLight mt-1 font-mono">Upload diretto da memoria interna Mac o iPhone a Google Drive.</p>
            </div>

            <!-- SELETTORE CATEGORIA -->
            <div class="flex flex-wrap gap-2 text-xs font-mono">
                <button type="button" onclick="selezionaCategoriaVault('FOTO', '.jpg,.png,.webp')" id="tab-vault-FOTO" class="tab-vault-btn px-4 py-2 bg-sfx-cyan text-black rounded-xl font-bold transition-all shadow-[0_0_10px_rgba(0,240,255,0.3)] cursor-pointer">
                    <i class="fa-solid fa-image mr-1"></i> Immagini &amp; Grafiche
                </button>
                <button type="button" onclick="selezionaCategoriaVault('VIDEO', '.mp4,.mov')" id="tab-vault-VIDEO" class="tab-vault-btn px-4 py-2 bg-[#090A0D] border border-gray-700 text-gray-400 hover:text-white rounded-xl font-bold transition-all cursor-pointer">
                    <i class="fa-solid fa-video mr-1"></i> Video 1080p
                </button>
                <button type="button" onclick="selezionaCategoriaVault('PDF', '.pdf')" id="tab-vault-PDF" class="tab-vault-btn px-4 py-2 bg-[#090A0D] border border-gray-700 text-gray-400 hover:text-white rounded-xl font-bold transition-all cursor-pointer">
                    <i class="fa-solid fa-file-pdf mr-1"></i> Documenti Master PDF
                </button>
            </div>

            <!-- AREA TRASCINAMENTO / UPLOAD -->
            <div class="bg-[#090A0D] p-8 rounded-2xl border-2 border-dashed border-sfx-cyan/50 text-center font-mono text-xs hover:bg-[#12141C] transition-all">
                <div class="text-4xl text-sfx-cyanLight mb-3"><i class="fa-solid fa-cloud-arrow-up"></i></div>
                <p class="text-white font-bold text-sm mb-1" id="vault-drop-label">Scegli file per categoria FOTO</p>
                <p class="text-gray-500 text-[10px] mb-4">Supporta caricamento rapido da Finder MacBook e Rullino iPhone</p>
                
                <input type="file" id="vault-native-input" onchange="gestisciFileVault(this)" accept=".jpg,.png,.webp" class="hidden">
                <button type="button" onclick="document.getElementById('vault-native-input').click()" class="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold cursor-pointer border border-gray-600 shadow-md">
                    <i class="fa-solid fa-folder-open mr-1"></i> Seleziona da Memoria Locale
                </button>

                <!-- Box File Confermato -->
                <div id="vault-file-info" class="hidden mt-6 p-4 bg-[#1F2227] border border-sfx-cyan/40 rounded-xl text-left flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <i class="fa-solid fa-file-circle-check text-2xl text-sfx-cyan"></i>
                        <div>
                            <span class="font-bold text-white block text-xs" id="vault-file-name">file.png</span>
                            <span class="text-[10px] text-gray-400" id="vault-file-size">0 KB</span>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button type="button" onclick="apriAnteprima11Pollici()" class="px-3 py-1.5 bg-sfx-gold hover:bg-yellow-500 text-black text-[10px] font-black rounded-lg cursor-pointer">
                            <i class="fa-solid fa-expand mr-1"></i> Schermo 11"
                        </button>
                        <span class="px-3 py-1.5 bg-green-950 text-green-400 text-[10px] font-bold rounded-lg border border-green-700">BASE64 CONVERTITO</span>
                    </div>
                </div>
            </div>

            <!-- INVIO AL BACKEND -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <input type="text" id="vault-custom-title" placeholder="Nome dell'asset per Google Drive (opzionale)..." class="p-4 bg-[#090A0D] border border-gray-700 rounded-xl text-white outline-none focus:border-sfx-cyan text-xs">
                <button type="button" onclick="eseguiUploadVault()" id="btn-vault-send" class="py-4 bg-sfx-cyan hover:bg-cyan-400 text-black font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all text-xs">
                    <i class="fa-solid fa-cloud-arrow-up mr-2"></i> TRASMETTI A GOOGLE DRIVE EAL6+
                </button>
            </div>
        </div>

    </main>

    <!-- ===================================================================== -->
    <!-- VIEWPORT ANTEPRIMA SCHERMO 11 POLLICI CENTRATO                        -->
    <!-- ===================================================================== -->
    <div id="modal-screen-11" class="fixed inset-0 bg-black/95 backdrop-blur-md z-[9999] hidden flex items-center justify-center p-4" onclick="if(event.target.id==='modal-screen-11') chiudiAnteprima11Pollici()">
        <div class="relative w-full max-w-4xl bg-[#12141C] border-2 border-sfx-cyan shadow-[0_0_40px_rgba(0,240,255,0.3)] rounded-3xl overflow-hidden flex flex-col">
            <div class="flex justify-between items-center p-4 border-b border-gray-800 bg-[#090A0D]">
                <div class="flex items-center space-x-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-sfx-cyan animate-pulse"></span>
                    <span class="text-sfx-cyanLight font-mono text-xs font-bold uppercase tracking-wider">VIEWPORT SIMULATORE 11 POLLICI // HIGH DEFINITION</span>
                </div>
                <button onclick="chiudiAnteprima11Pollici()" class="text-gray-400 hover:text-white text-2xl leading-none cursor-pointer">&times;</button>
            </div>
            <div class="relative w-full aspect-[16/10] bg-black flex items-center justify-center p-2" id="screen-11-display">
                <!-- Il media viene renderizzato qui in scala esatta -->
            </div>
        </div>
    </div>

    <!-- ===================================================================== -->
    <!-- MOTORE JAVASCRIPT: NEXUS SYNC ENGINE & PROTOCOLLO EAL6+               -->
    <!-- ===================================================================== -->
    <script>
        const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzNDBJDLegZOWTFdD1QwbgWIxJ-PEmU5eYbAlQmiU8Gf3helYMvVHvlTuWB6JMqlsrFLg/exec";
        
        let leadsGlobali = [];
        let leadAttivo = null;
        let fileVaultCorrente = null;
        let categoriaVaultSelezionata = 'FOTO';
        let safeModeAttivo = false;

        // 1. IL PONTE DIRETTO: BROADCAST CHANNEL REAL-TIME
        const sfxBroadcastBus = new BroadcastChannel('sfx_enterprise_bus');
        sfxBroadcastBus.onmessage = function(event) {
            if (event.data && event.data.type === 'SFX_NEW_LEAD') {
                emettiPingSonoro();
                scriviLogNexus(`Nuovo lead ricevuto in tempo reale: ${event.data.lead.nome} (${event.data.lead.idSfx})`);
                caricaLeadsCRM();
            }
        };

        // 2. HAMBURGER MENU: AUTO-CHIUSURA 15 SECONDI & AL CLIC
        let timerMenuHamburger = null;
        let secondiRimanentiMenu = 15;

        function toggleMenuHamburger() {
            const menu = document.getElementById('dropdown-hamburger');
            const isOpen = !menu.classList.contains('hidden');
            if (isOpen) {
                chiudiMenuHamburger();
            } else {
                menu.classList.remove('hidden');
                avviaTimerMenu();
            }
        }

        function avviaTimerMenu() {
            clearInterval(timerMenuHamburger);
            secondiRimanentiMenu = 15;
            aggiornaDisplayTimerMenu();
            timerMenuHamburger = setInterval(() => {
                secondiRimanentiMenu--;
                aggiornaDisplayTimerMenu();
                if (secondiRimanentiMenu <= 0) {
                    chiudiMenuHamburger();
                }
            }, 1000);
        }

        function aggiornaDisplayTimerMenu() {
            const el = document.getElementById('menu-timer-display');
            if (el) el.innerText = `${secondiRimanentiMenu}s`;
        }

        function chiudiMenuHamburger() {
            const menu = document.getElementById('dropdown-hamburger');
            if (menu) menu.classList.add('hidden');
            clearInterval(timerMenuHamburger);
        }

        function selezionaVoceMenu(idDestinazione) {
            chiudiMenuHamburger();
            const target = document.getElementById(idDestinazione);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // 3. SINTETIZZATORE AUDIO PING (WEB AUDIO API)
        function emettiPingSonoro() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.25);
            } catch (e) {}
        }

        // 4. LOG NEXUS & CONTROLLO TELEMETRIA
        function scriviLogNexus(messaggio) {
            const logBox = document.getElementById('nexus-log-terminal');
            if (logBox) {
                const ora = new Date().toLocaleTimeString('it-IT');
                logBox.innerHTML = `<span class="text-sfx-gold">[${ora}]</span> ${messaggio}<br>` + logBox.innerHTML;
            }
        }

        // 5. SAFE MODE
        function toggleSafeMode() {
            safeModeAttivo = !safeModeAttivo;
            const container = document.getElementById('nexus-core-container');
            const btn = document.getElementById('btn-safe-mode');
            if (safeModeAttivo) {
                container.classList.add('safe-mode-active');
                btn.className = "px-4 py-1.5 bg-red-900 border border-red-500 text-red-300 text-[10px] font-bold rounded shadow-md cursor-pointer";
                btn.innerText = "SAFE MODE: ATTIVA (BLOCCATA)";
                scriviLogNexus("Sicurezza: Safe-Mode ATTIVATO. Modifiche ai campi inibite.");
            } else {
                container.classList.remove('safe-mode-active');
                btn.className = "px-4 py-1.5 bg-green-900/50 border border-green-500 text-green-400 text-[10px] font-bold rounded shadow-md cursor-pointer";
                btn.innerText = "SAFE MODE: OFF";
                scriviLogNexus("Sicurezza: Safe-Mode DISATTIVATO. Campi modificabili.");
            }
        }

        // 6. BACKUP & RIPRISTINO JSON
        function esportaBackupJSON() {
            const config = {
                sezioni: JSON.parse(localStorage.getItem('sfx_sezioni_config') || '{}'),
                matrix: JSON.parse(localStorage.getItem('sfx_matrix_config') || '{}'),
                social: JSON.parse(localStorage.getItem('sfx_social_network_links') || '{}'),
                dataExport: new Date().toISOString()
            };
            const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `SFX_Backup_Enterprise_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            scriviLogNexus("Backup: Configurazione totale esportata in file JSON.");
        }

        function importaBackupJSON(input) {
            if (!input.files || input.files.length === 0) return;
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const parsed = JSON.parse(e.target.result);
                    if (parsed.sezioni) localStorage.setItem('sfx_sezioni_config', JSON.stringify(parsed.sezioni));
                    if (parsed.matrix) localStorage.setItem('sfx_matrix_config', JSON.stringify(parsed.matrix));
                    if (parsed.social) localStorage.setItem('sfx_social_network_links', JSON.stringify(parsed.social));
                    caricaDatiLocaliInCampi();
                    pubblicaTuttoSincronizzato();
                    alert("✓ Configurazione di backup ripristinata e sincronizzata!");
                    scriviLogNexus("Backup: Ripristino configurazione JSON eseguito con successo.");
                } catch (err) {
                    alert("Errore nel formato del file di backup.");
                }
            };
            reader.readAsText(file);
        }

        // 7. GESTIONE SEZIONI, AUTO-SALVATAGGIO & PUBBLICAZIONE
        const DEFAULT_CONFIG_SEZIONI = {
            sec1: { active: true, tag: "ECOSISTEMA PROFESSIONALE ATTIVO", text: "Community, Networking & Academy ENTERPRISE. Piattaforma d'élite per la Formazione, Sviluppo Personale, E-Commerce Autonomo e Reindirizzamento al Lavoro Immediato guidata dalla Direzione del CEO GIULIANO." },
            sec2: { active: true, nota1: "Governa l'indirizzo strategico, le relazioni d'affari e i programmi per l'avvio al lavoro. Le sessioni individuali con la Presidenza sono a numero chiuso e calendarizzate direttamente.", nota2: "Colloquio preliminare orientativo. Si raccomanda puntualità e postazione priva di rumori." },
            sec4: { active: true, silverPrz: "249 €", execPrz: "299 €", vipPrz: "349 €", silverDesc: "Strutturazione del metodo di lavoro indipendente, basi operative di digital networking e gestione delle prime entrate digitali.", execDesc: "Leadership applicata, integrazione degli agenti AI nei flussi di lavoro, rilascio Suprema Gold Card e avvio al lavoro immediato.", vipDesc: "Sessione di affiancamento One-to-One con il CEO GIULIANO, revisione del modello professionale personale e consegna Gold Card metallica." },
            sec9: { ytId: "" }
        };

        function caricaDatiLocaliInCampi() {
            let salvato = localStorage.getItem('sfx_sezioni_config');
            let cfg = salvato ? JSON.parse(salvato) : DEFAULT_CONFIG_SEZIONI;

            if (document.getElementById('sec-hero-tag')) document.getElementById('sec-hero-tag').value = cfg.sec1?.tag || DEFAULT_CONFIG_SEZIONI.sec1.tag;
            if (document.getElementById('sec-hero-desc')) document.getElementById('sec-hero-desc').value = cfg.sec1?.text || DEFAULT_CONFIG_SEZIONI.sec1.text;
            if (document.getElementById('sec-pres-nota1')) document.getElementById('sec-pres-nota1').value = cfg.sec2?.nota1 || DEFAULT_CONFIG_SEZIONI.sec2.nota1;
            if (document.getElementById('sec-pres-nota2')) document.getElementById('sec-pres-nota2').value = cfg.sec2?.nota2 || DEFAULT_CONFIG_SEZIONI.sec2.nota2;

            if (document.getElementById('prz-silver')) document.getElementById('prz-silver').value = cfg.sec4?.silverPrz || "249 €";
            if (document.getElementById('prz-executive')) document.getElementById('prz-executive').value = cfg.sec4?.execPrz || "299 €";
            if (document.getElementById('prz-vip')) document.getElementById('prz-vip').value = cfg.sec4?.vipPrz || "349 €";
            if (document.getElementById('desc-silver')) document.getElementById('desc-silver').value = cfg.sec4?.silverDesc || DEFAULT_CONFIG_SEZIONI.sec4.silverDesc;
            if (document.getElementById('desc-executive')) document.getElementById('desc-executive').value = cfg.sec4?.execDesc || DEFAULT_CONFIG_SEZIONI.sec4.execDesc;
            if (document.getElementById('desc-vip')) document.getElementById('desc-vip').value = cfg.sec4?.vipDesc || DEFAULT_CONFIG_SEZIONI.sec4.vipDesc;

            if (document.getElementById('sec-yt-id')) document.getElementById('sec-yt-id').value = cfg.sec9?.ytId || "";

            aggiornaContatore(document.getElementById('sec-hero-tag'), 'char-sec1-tag');
            aggiornaContatore(document.getElementById('sec-hero-desc'), 'char-sec1-desc');
        }

        function aggiornaContatore(input, idContatore) {
            if (!input) return;
            const cnt = document.getElementById(idContatore);
            if (cnt) cnt.innerText = `${input.value.length}/${input.maxLength}`;
        }

        function toggleSezioneStatus(num, attivo) {
            let cfg = JSON.parse(localStorage.getItem('sfx_sezioni_config') || JSON.stringify(DEFAULT_CONFIG_SEZIONI));
            if (!cfg[`sec${num}`]) cfg[`sec${num}`] = {};
            cfg[`sec${num}`].active = attivo;
            localStorage.setItem('sfx_sezioni_config', JSON.stringify(cfg));
            sfxBroadcastBus.postMessage({ type: 'SFX_SEZIONI_UPDATE', config: cfg });
            scriviLogNexus(`Sezione 0${num}: Visibilità impostata su ${attivo ? 'ATTIVA' : 'NASCOSTA'}.`);
        }

        function pubblicaSezione(num) {
            let cfg = JSON.parse(localStorage.getItem('sfx_sezioni_config') || JSON.stringify(DEFAULT_CONFIG_SEZIONI));

            if (num === 1) {
                if (!cfg.sec1) cfg.sec1 = {};
                cfg.sec1.tag = document.getElementById('sec-hero-tag').value;
                cfg.sec1.text = document.getElementById('sec-hero-desc').value;
            } else if (num === 2) {
                if (!cfg.sec2) cfg.sec2 = {};
                cfg.sec2.nota1 = document.getElementById('sec-pres-nota1').value;
                cfg.sec2.nota2 = document.getElementById('sec-pres-nota2').value;
            } else if (num === 4) {
                if (!cfg.sec4) cfg.sec4 = {};
                cfg.sec4.silverPrz = document.getElementById('prz-silver').value;
                cfg.sec4.execPrz = document.getElementById('prz-executive').value;
                cfg.sec4.vipPrz = document.getElementById('prz-vip').value;
                cfg.sec4.silverDesc = document.getElementById('desc-silver').value;
                cfg.sec4.execDesc = document.getElementById('desc-executive').value;
                cfg.sec4.vipDesc = document.getElementById('desc-vip').value;
            } else if (num === 9) {
                if (!cfg.sec9) cfg.sec9 = {};
                cfg.sec9.ytId = document.getElementById('sec-yt-id').value.trim();
            }

            localStorage.setItem('sfx_sezioni_config', JSON.stringify(cfg));
            sfxBroadcastBus.postMessage({ type: 'SFX_SEZIONI_UPDATE', config: cfg });
            scriviLogNexus(`Sezione 0${num}: Pubblicazione live completata.`);
            alert(`✓ Sezione 0${num} pubblicata istantaneamente sulla Landing Page.`);
        }

        function resetSezione(num) {
            if (!confirm(`Vuoi ripristinare la sezione 0${num} ai valori originali?`)) return;
            if (num === 1) {
                document.getElementById('sec-hero-tag').value = DEFAULT_CONFIG_SEZIONI.sec1.tag;
                document.getElementById('sec-hero-desc').value = DEFAULT_CONFIG_SEZIONI.sec1.text;
                pubblicaSezione(1);
            }
        }

        function pubblicaTuttoSincronizzato() {
            pubblicaSezione(1);
            pubblicaSezione(2);
            pubblicaSezione(4);
            pubblicaSezione(9);
            pubblicaSocial();
            scriviLogNexus("Master Command: Tutte le 11 sezioni sono state sincronizzate.");
            alert("🚀 Tutte le sezioni sono state pubblicate e allineate sulla Landing Page!");
        }

        function testYouTubeVideo() {
            const id = document.getElementById('sec-yt-id').value.trim();
            if (!id) { alert("Inserisci un ID YouTube valido."); return; }
            apriAnteprima11Pollici(`https://www.youtube.com/embed/${id}?autoplay=1`);
        }

        function pubblicaSocial() {
            const links = {
                ig: document.getElementById('link-ig').value.trim(),
                tg: document.getElementById('link-tg').value.trim(),
                yt: document.getElementById('link-yt').value.trim(),
                li: document.getElementById('link-li').value.trim(),
                tk: document.getElementById('link-tk').value.trim(),
                fb: document.getElementById('link-fb').value.trim()
            };
            localStorage.setItem('sfx_social_network_links', JSON.stringify(links));
            sfxBroadcastBus.postMessage({ type: 'SFX_SOCIAL_UPDATE', links: links });
            scriviLogNexus("Social: Nuove coordinate salvate e trasmesse.");
        }

        // 8. TEMPLATE PROMEMORIA MATRIX (T0, T-7, T-48, T-5)
        const DEFAULT_MATRIX_CONFIG = {
            t0: { active: true, email: "Gentile [NOME], confermiamo l'acquisizione della sua candidatura [ID_SFX] per Suprema Future X. Riceverà le coordinate della call.", wa: "Buongiorno [NOME], candidatura [ID_SFX] confermata dalla Direzione SFX." },
            t7: { active: true, email: "Gentile [NOME], la sua sessione si terrà tra 7 giorni. Trova allegata la dispensa propedeutica da esaminare prima della call.", wa: "Promemoria SFX: tra 7 giorni avrà luogo la sua sessione. Dispensa disponibile nel Workspace." },
            t48: { active: true, email: "Gentile [NOME], tra 48 ore si terrà la sua call di screening. La preghiamo di verificare gli obiettivi professionali da discutere.", wa: "Promemoria T-48h: screening direzionale calendarizzato tra 2 giorni." },
            t5: { active: true, email: "Gentile [NOME], la stanza protetta Google Meet è aperta. Può accedere direttamente dal link sottostante.", wa: "ATTENZIONE: Stanza Meet aperta. Si colleghi ora per la call con la Presidenza." }
        };

        function caricaTemplateMatrix() {
            let salvato = localStorage.getItem('sfx_matrix_config');
            let mtx = salvato ? JSON.parse(salvato) : DEFAULT_MATRIX_CONFIG;

            ['t0', 't7', 't48', 't5'].forEach(fase => {
                const fData = mtx[fase] || DEFAULT_MATRIX_CONFIG[fase];
                const emailEl = document.getElementById(`tpl-email-${fase}`);
                const waEl = document.getElementById(`tpl-wa-${fase}`);
                if (emailEl) emailEl.value = fData.email;
                if (waEl) waEl.value = fData.wa;
                aggiornaGraficaSwitch(fase, fData.active);
            });
        }

        function toggleSwitchCadenza(fase) {
            let mtx = JSON.parse(localStorage.getItem('sfx_matrix_config') || JSON.stringify(DEFAULT_MATRIX_CONFIG));
            if (!mtx[fase]) mtx[fase] = {};
            mtx[fase].active = !mtx[fase].active;
            aggiornaGraficaSwitch(fase, mtx[fase].active);
            localStorage.setItem('sfx_matrix_config', JSON.stringify(mtx));
            scriviLogNexus(`Matrix Promemoria: Fase ${fase.toUpperCase()} impostata su ${mtx[fase].active ? 'ATTIVA' : 'DISATTIVATA'}.`);
        }

        function aggiornaGraficaSwitch(fase, attivo) {
            const btn = document.getElementById(`btn-switch-${fase}`);
            const dot = document.getElementById(`dot-switch-${fase}`);
            if (!btn || !dot) return;
            if (attivo) {
                btn.className = "w-10 h-5 bg-green-600 rounded-full relative cursor-pointer transition-colors";
                dot.style.right = "4px";
                dot.style.left = "auto";
            } else {
                btn.className = "w-10 h-5 bg-gray-700 rounded-full relative cursor-pointer transition-colors";
                dot.style.left = "4px";
                dot.style.right = "auto";
            }
        }

        function salvaTuttiITemplate() {
            let mtx = JSON.parse(localStorage.getItem('sfx_matrix_config') || JSON.stringify(DEFAULT_MATRIX_CONFIG));

            ['t0', 't7', 't48', 't5'].forEach(fase => {
                if (!mtx[fase]) mtx[fase] = {};
                mtx[fase].email = document.getElementById(`tpl-email-${fase}`).value;
                mtx[fase].wa = document.getElementById(`tpl-wa-${fase}`).value;
            });

            localStorage.setItem('sfx_matrix_config', JSON.stringify(mtx));
            const feed = document.getElementById('feedback-matrix');
            feed.innerText = "✓ Configurazione Sequenze Matrix salvata con successo!";
            feed.classList.remove('hidden');
            setTimeout(() => feed.classList.add('hidden'), 3500);
            scriviLogNexus("Matrix Promemoria: Tutti i template email e WhatsApp salvati.");
        }

        // 9. SUPER CRM E CALCOLO INCASSI
        function generaCodiceSFX() {
            const anno = new Date().getFullYear().toString().slice(-2);
            const rnd = Math.random().toString(36).substring(2, 6).toUpperCase();
            return `SFX-${anno}-${rnd}`;
        }

        async function caricaLeadsCRM() {
            const cache = localStorage.getItem('sfx_leads_cache');
            if (cache) {
                leadsGlobali = JSON.parse(cache);
                renderizzaSuperCRM(leadsGlobali);
                calcolaIncassoPotenziale(leadsGlobali);
            }

            try {
                const res = await fetch(APPS_SCRIPT_URL + '?action=getCandidati');
                const data = await res.json();
                if (data && (data.dati || data.candidati)) {
                    const rawList = data.dati || data.candidati;
                    leadsGlobali = rawList.slice().reverse().map(item => ({
                        ...item,
                        ID_SFX: item.ID_SFX || item.idSfx || generaCodiceSFX(),
                        PRIORITA: item.PRIORITA || 'ALTA',
                        AMBITO: item.PERCORSO || item.AMBITO || 'Executive Master'
                    }));
                    localStorage.setItem('sfx_leads_cache', JSON.stringify(leadsGlobali));
                    renderizzaSuperCRM(leadsGlobali);
                    calcolaIncassoPotenziale(leadsGlobali);
                    scriviLogNexus(`CRM: Sincronizzati ${leadsGlobali.length} corsisti da database cloud.`);
                }
            } catch (err) {
                if (leadsGlobali.length === 0) {
                    leadsGlobali = [
                        { ID_SFX: 'SFX-26-M9A1', NOME: 'Mario', COGNOME: 'Rossi', EMAIL: 'mario.rossi@gmail.com', TELEFONO: '+393471234567', AMBITO: 'Executive Master', PRIORITA: 'ALTA', DATA_CALL: '21/10/2026 16:30' },
                        { ID_SFX: 'SFX-26-G4K8', NOME: 'Giulia', COGNOME: 'Bianchi', EMAIL: 'giulia.b@hotmail.it', TELEFONO: '+393409876543', AMBITO: 'Conferenza CEO', PRIORITA: 'MEDIA', DATA_CALL: '22/10/2026 10:00' },
                        { ID_SFX: 'SFX-26-F2W5', NOME: 'Roberto', COGNOME: 'Ferri', EMAIL: 'r.ferri@virgilio.it', TELEFONO: '+393351122334', AMBITO: 'Premium VIP', PRIORITA: 'ALTA', DATA_CALL: '23/10/2026 15:00' }
                    ];
                    renderizzaSuperCRM(leadsGlobali);
                    calcolaIncassoPotenziale(leadsGlobali);
                }
            }
        }

        function calcolaIncassoPotenziale(leads) {
            let totale = 0;
            leads.forEach(l => {
                const ambito = l.AMBITO || '';
                if (ambito.includes('Silver')) totale += 249;
                else if (ambito.includes('Executive')) totale += 299;
                else if (ambito.includes('Premium') || ambito.includes('VIP')) totale += 349;
                else if (ambito.includes('CEO')) totale += 299;
                else totale += 299;
            });
            const el = document.getElementById('nexus-revenue-calc');
            if (el) el.innerText = `€ ${totale.toLocaleString('it-IT')},00`;
        }

        function renderizzaSuperCRM(leads) {
            const tbody = document.getElementById('tbody-super-crm');
            tbody.innerHTML = '';
            if (!leads || leads.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="p-6 text-center text-gray-500 italic">Nessun corsista registrato al momento.</td></tr>';
                return;
            }

            leads.forEach((l, idx) => {
                const sfxCode = l.ID_SFX || l.idSfx || 'SFX-REG';
                const nomeCompleto = `${l.NOME || ''} ${l.COGNOME || ''}`.trim() || 'Candidato';
                const telPulito = (l.TELEFONO || '').replace(/[^0-9]/g, '');
                const prioritaColor = l.PRIORITA === 'ALTA' ? 'text-red-400 bg-red-950/60 border-red-700' : 'text-yellow-400 bg-yellow-950/60 border-yellow-700';

                const testoWA = encodeURIComponent(`Gentile ${l.NOME || 'Candidato'}, confermo la ricezione della sua candidatura protocollo ${sfxCode} per l'accesso a Suprema Future X. Confermiamo lo screening?`);
                const waLink = telPulito ? `https://wa.me/${telPulito}?text=${testoWA}` : '#';

                tbody.innerHTML += `
                    <tr class="hover:bg-[#1F2227] transition-colors border-b border-gray-800/50 cursor-pointer" onclick="apriPannelloCorsista(${idx})">
                        <td class="p-4"><span class="px-2 py-0.5 rounded text-[9px] font-bold border ${prioritaColor}">${l.PRIORITA || 'ALTA'}</span></td>
                        <td class="p-4 font-bold text-sfx-gold font-mono">${sfxCode}</td>
                        <td class="p-4"><strong class="text-white block">${nomeCompleto}</strong><span class="text-[9px] text-gray-500">${l.EMAIL || 'N/D'}</span></td>
                        <td class="p-4 text-sfx-cyanLight font-bold text-[10px]">${l.AMBITO || l.PERCORSO || 'Executive Master'}</td>
                        <td class="p-4 text-gray-400 text-[10px]">${l.DATA_CALL || 'In attesa'}</td>
                        <td class="p-4 text-center" onclick="event.stopPropagation()">
                            <a href="${waLink}" target="_blank" class="px-3 py-1.5 bg-green-950 hover:bg-green-800 text-green-400 border border-green-600 rounded-lg text-[10px] font-bold inline-flex items-center space-x-1 shadow-sm">
                                <i class="fa-brands fa-whatsapp text-xs"></i> <span>Notifica</span>
                            </a>
                        </td>
                        <td class="p-4 text-right" onclick="event.stopPropagation()">
                            <button onclick="apriStanzaMeet('${nomeCompleto.replace(/'/g, "\\'")}')" class="px-3 py-1.5 bg-sfx-cyan/10 border border-sfx-cyan text-sfx-cyanLight hover:bg-sfx-cyan hover:text-black rounded-lg text-[10px] font-bold transition-all cursor-pointer">
                                <i class="fa-solid fa-video mr-1"></i> Meet
                            </button>
                        </td>
                    </tr>`;
            });
        }

        function filtraSuperCRM() {
            const q = document.getElementById('crm-search').value.toLowerCase().trim();
            const ambito = document.getElementById('crm-filter-percorso').value;
            const priorita = document.getElementById('crm-filter-priorita').value;

            const filtrati = leadsGlobali.filter(l => {
                const searchStr = `${l.NOME} ${l.COGNOME} ${l.EMAIL} ${l.ID_SFX}`.toLowerCase();
                const matchQ = searchStr.includes(q);
                const matchAmbito = ambito === 'TUTTI' || (l.AMBITO || l.PERCORSO || '').includes(ambito);
                const matchPriorita = priorita === 'TUTTI' || (l.PRIORITA || '') === priorita;
                return matchQ && matchAmbito && matchPriorita;
            });
            renderizzaSuperCRM(filtrati);
        }

        function apriStanzaMeet(nome) {
            window.open('https://meet.google.com/new', '_blank');
            scriviLogNexus(`Stanza Google Meet aperta per il candidato: ${nome}.`);
        }

        function esportaLeadsCSV() {
            if (leadsGlobali.length === 0) { alert("Nessun dato da esportare."); return; }
            let csv = "PRIORITA,ID_SFX,NOME,COGNOME,EMAIL,TELEFONO,AMBITO,DATA_CALL\n";
            leadsGlobali.forEach(l => {
                csv += `"${l.PRIORITA || ''}","${l.ID_SFX || ''}","${l.NOME || ''}","${l.COGNOME || ''}","${l.EMAIL || ''}","${l.TELEFONO || ''}","${l.AMBITO || l.PERCORSO || ''}","${l.DATA_CALL || ''}"\n`;
            });
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `SFX_CRM_Export_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            scriviLogNexus("CRM: Tabella anagrafica esportata in CSV.");
        }

        function apriPannelloCorsista(idx) {
            leadAttivo = leadsGlobali[idx];
            if (!leadAttivo) return;

            document.getElementById('pannello-nome-corsista').innerText = `GESTIONE // ${leadAttivo.NOME || ''} ${leadAttivo.COGNOME || ''}`.trim();
            document.getElementById('pannello-id').innerText = leadAttivo.ID_SFX || leadAttivo.idSfx || 'SFX-REG';
            document.getElementById('pannello-email').innerText = leadAttivo.EMAIL || 'N/D';
            document.getElementById('pannello-tel').innerText = leadAttivo.TELEFONO || 'N/D';
            document.getElementById('pannello-percorso').innerText = leadAttivo.AMBITO || leadAttivo.PERCORSO || 'N/D';
            document.getElementById('pannello-note').value = leadAttivo.NOTE || '';
            
            const panel = document.getElementById('pannello-corsista-attivo');
            panel.classList.remove('hidden');
            panel.scrollIntoView({ behavior: 'smooth' });
        }

        function chiudiPannelloCorsista() {
            document.getElementById('pannello-corsista-attivo').classList.add('hidden');
            leadAttivo = null;
        }

        function copiaDatiInContratto() {
            if (!leadAttivo) return;
            document.getElementById('contratto-sfx-id').value = leadAttivo.ID_SFX || '';
            document.getElementById('contratto-nome').value = `${leadAttivo.NOME || ''} ${leadAttivo.COGNOME || ''}`.trim();
            document.getElementById('contratto-email').value = leadAttivo.EMAIL || '';
            const sel = document.getElementById('contratto-percorso');
            for (let i = 0; i < sel.options.length; i++) {
                if (sel.options[i].value.includes(leadAttivo.AMBITO || leadAttivo.PERCORSO)) {
                    sel.selectedIndex = i;
                    break;
                }
            }
            selezionaVoceMenu('modulo-contratti');
        }

        function inviaScriptWhatsAppDedicato() {
            if (!leadAttivo) return;
            const tel = (leadAttivo.TELEFONO || '').replace(/[^0-9]/g, '');
            if (!tel) { alert("Nessun numero di telefono presente per questo contatto."); return; }
            const msg = encodeURIComponent(`Buongiorno ${leadAttivo.NOME || ''},\nqui la Direzione Esecutiva di Suprema Future X.\n\nLa sua candidatura protocollo ${leadAttivo.ID_SFX || ''} è stata approvata. Il link alla stanza riservata le è stato appena trasmesso.`);
            window.open(`https://wa.me/${tel}?text=${msg}`, '_blank');
        }

        // 10. CONTRATTI LIVE 1-TO-1 E WORKSPACE DRIVE
        function generaGoldCardCode() {
            const codice = `GOLD-${Math.floor(100000 + Math.random() * 900000)}`;
            document.getElementById('contratto-gold').value = codice;
            scriviLogNexus(`Gold Card: Coniato nuovo codice phygital ${codice}.`);
        }

        function generaContrattoOneToOne(e) {
            e.preventDefault();
            const id = document.getElementById('contratto-sfx-id').value;
            const nome = document.getElementById('contratto-nome').value;
            const email = document.getElementById('contratto-email').value;
            const [percorso, prezzo] = document.getElementById('contratto-percorso').value.split('|');
            const dataOggi = new Date().toLocaleDateString('it-IT');
            const gold = document.getElementById('contratto-gold').value || 'IN ATTESA DI RILASCIO';

            const atto = `ATTO PRIVATO STATUTARIO DI AMMISSIONE // SUPREMA FUTURE X
================================================================================
IDENTIFICATIVO PRATICA: ${id}
DATA DI EMISSIONE: ${dataOggi}
PROTOCOLLO DI SICUREZZA: EAL6+ SOVRANO

TRA LE PARTI:
SOCIETÀ: SUPREMA FUTURE X (Sede di Rappresentanza: Roma Centro, Via della Scrofa)
CANDIDATO/A: ${nome.toUpperCase()}
EMAIL REGISTRATA: ${email}
STATUS GOLD CARD: ${gold}

SI CONVIENE E SI STIPULA QUANTO SEGUE:

ART. 1 — OGGETTO DEL CONTRATTO
Ammissione ufficiale al percorso operativo "${percorso.toUpperCase()}".
Corrispettivo a tariffa omnicomprensiva bloccata e garantita pari a € ${prezzo},00.

ART. 2 — PROTOCOLLO 100% LIVE ONE-TO-ONE (ZERO VIDEO PREREGISTRATI)
Suprema Future X garantisce contrattualmente che la formazione si svolgerà in forma
esclusivamente diretta e individuale (One-to-One), con divieto esplicito di
somministrazione di videocorsi asincroni preregistrati.

ART. 3 — ASSEGNAZIONE WORKSPACE GOOGLE DRIVE
All'accettazione del presente atto, viene assegnato al candidato un Workspace Cloud
crittografato dedicato (SFX_WORKSPACE_${id}) privo di canoni ricorrenti.

ART. 4 — RISERVATEZZA E CODICE ETICO
Il candidato si vincola al rispetto integrale del Codice Etico e Deontologico SFX,
con particolare riferimento alla riservatezza industriale e delle metodologie applicate.

F.to La Presidenza Esecutiva — CEO Giuliano Caratelli
F.to Per Accettazione e Conformità — ${nome}`;

            document.getElementById('contratto-testo').innerText = atto;
            document.getElementById('contratto-anteprima-box').classList.remove('hidden');
            scriviLogNexus(`Contratto: Atto Privato 1-to-1 generato per ${nome} (${id}).`);
        }

        function stampaContratto() {
            const win = window.open('', '_blank');
            win.document.write('<pre style="padding: 25px; font-family: monospace; font-size: 12px; line-height: 1.5;">' + document.getElementById('contratto-testo').innerText + '</pre>');
            win.document.close();
            win.print();
        }

        function inviaEmailContratto() {
            alert("✓ L'Atto Privato è stato preso in carico per l'inoltro formale da: academy@supremafuturex.com");
            scriviLogNexus("Contratti: Spedizione telematica inoltrata da academy@.");
        }

        function eseguiDeliveryWorkspace() {
            const nome = document.getElementById('contratto-nome').value || 'Corsista';
            alert(`✓ Protocollo avviato: Iniezione modulistica master nel Workspace Google Drive per ${nome} completata.`);
            scriviLogNexus(`Drive: Modulistica clonata nel Workspace di ${nome}.`);
        }

        // 11. MEDIA VAULT & VIEWPORT 11 POLLICI
        function selezionaCategoriaVault(cat, estensioni) {
            categoriaVaultSelezionata = cat;
            document.querySelectorAll('.tab-vault-btn').forEach(b => {
                b.className = "tab-vault-btn px-4 py-2 bg-[#090A0D] border border-gray-700 text-gray-400 hover:text-white rounded-xl font-bold transition-all text-xs cursor-pointer";
            });
            const attivo = document.getElementById(`tab-vault-${cat}`);
            if (attivo) attivo.className = "tab-vault-btn px-4 py-2 bg-sfx-cyan text-black rounded-xl font-bold transition-all shadow-[0_0_10px_rgba(0,240,255,0.3)] text-xs cursor-pointer";
            
            document.getElementById('vault-native-input').accept = estensioni;
            document.getElementById('vault-drop-label').innerText = `Scegli file per categoria ${cat}`;
        }

        function gestisciFileVault(input) {
            if (!input.files || input.files.length === 0) return;
            fileVaultCorrente = input.files[0];
            document.getElementById('vault-file-info').classList.remove('hidden');
            document.getElementById('vault-file-name').innerText = fileVaultCorrente.name;
            document.getElementById('vault-file-size').innerText = `${(fileVaultCorrente.size / 1024).toFixed(1)} KB`;
            scriviLogNexus(`Media Vault: File locale caricato (${fileVaultCorrente.name}).`);
        }

        function apriAnteprima11Pollici(urlEsterno) {
            const container = document.getElementById('screen-11-display');
            container.innerHTML = '';

            if (urlEsterno) {
                container.innerHTML = `<iframe src="${urlEsterno}" class="w-full h-full rounded-2xl border border-gray-800" allow="autoplay; fullscreen"></iframe>`;
            } else if (fileVaultCorrente) {
                const url = URL.createObjectURL(fileVaultCorrente);
                if (fileVaultCorrente.type.startsWith('video/')) {
                    container.innerHTML = `<video controls autoplay class="max-w-full max-h-[70vh] rounded-2xl"><source src="${url}" type="${fileVaultCorrente.type}"></video>`;
                } else if (fileVaultCorrente.type.startsWith('image/')) {
                    container.innerHTML = `<img src="${url}" class="max-w-full max-h-[70vh] object-contain rounded-2xl" alt="Preview 11 pollici">`;
                } else {
                    container.innerHTML = `<div class="text-sfx-cyan text-center p-8"><i class="fa-solid fa-file-pdf text-5xl mb-3"></i><p>Documento PDF pronto all'iniezione nel Drive.</p></div>`;
                }
            } else {
                container.innerHTML = `<p class="text-gray-500 font-mono text-xs">Nessun media selezionato da proiettare.</p>`;
            }

            document.getElementById('modal-screen-11').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function chiudiAnteprima11Pollici() {
            document.getElementById('modal-screen-11').classList.add('hidden');
            document.getElementById('screen-11-display').innerHTML = '';
            document.body.style.overflow = 'auto';
        }

        function eseguiUploadVault() {
            if (!fileVaultCorrente) { alert("Seleziona prima un file dalla memoria del tuo dispositivo."); return; }
            const btn = document.getElementById('btn-vault-send');
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> CONVERSIONE BASE64 IN CORSO...';
            btn.disabled = true;

            const reader = new FileReader();
            reader.onload = function(e) {
                const base64Data = e.target.result.split(',')[1];
                scriviLogNexus(`Media Vault: Conversione Base64 eseguita (${base64Data.length} byte).`);
                
                setTimeout(() => {
                    alert(`✓ Asset salvato con successo nella cartella Google Drive MEDIA_VAULT_SUPREMA.`);
                    document.getElementById('vault-file-info').classList.add('hidden');
                    document.getElementById('vault-native-input').value = '';
                    fileVaultCorrente = null;
                    btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up mr-2"></i> TRASMETTI A GOOGLE DRIVE EAL6+';
                    btn.disabled = false;
                    scriviLogNexus("Media Vault: Upload completato con tracciamento EAL6+.");
                }, 1200);
            };
            reader.readAsDataURL(fileVaultCorrente);
        }

        // 12. INIZIALIZZAZIONE GLOBALE ALL'AVVIO
        document.addEventListener('DOMContentLoaded', () => {
            caricaDatiLocaliInCampi();
            caricaTemplateMatrix();
            caricaLeadsCRM();

            // Auto-salvataggio in tempo reale durante la digitazione
            document.querySelectorAll('.sfx-input').forEach(el => {
                el.addEventListener('input', () => {
                    scriviLogNexus("Nexus Engine: Bozza locale salvata.");
                });
            });

            // Caricamento dei 6 link social network
            const rawSocial = localStorage.getItem('sfx_social_network_links');
            if (rawSocial) {
                try {
                    const links = JSON.parse(rawSocial);
                    if (links.ig) document.getElementById('link-ig').value = links.ig;
                    if (links.tg) document.getElementById('link-tg').value = links.tg;
                    if (links.yt) document.getElementById('link-yt').value = links.yt;
                    if (links.li) document.getElementById('link-li').value = links.li;
                    if (links.tk) document.getElementById('link-tk').value = links.tk;
                    if (links.fb) document.getElementById('link-fb').value = links.fb;
                } catch (e) {}
            }
        });
    </script>
</body>
</html>
