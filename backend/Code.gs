<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SUPREMA FUTURE X | X-BOX Executive CRM</title>
  <style>
    /* ----------------------------------------------------
       X-BOX STILI CORPORATE - TEMA SCURO
    ---------------------------------------------------- */
    :root {
      --bg-dark: #090A0D;
      --bg-panel: #1F2227;
      --text-main: #FFFFFF;
      --text-muted: #8892B0;
      --gold: #D4AF37;
      --cyan: #00F0FF;
      --red: #FF3366;
    }
    
    body {
      margin: 0; 
      padding: 0; 
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: var(--bg-dark); 
      color: var(--text-main);
    }
    
    header {
      background: linear-gradient(90deg, #11141A 0%, var(--bg-panel) 100%);
      padding: 20px 40px; 
      border-bottom: 2px solid var(--gold);
      display: flex; 
      justify-content: space-between; 
      align-items: center;
    }
    
    header h1 { 
      margin: 0; 
      font-size: 24px; 
      color: var(--gold); 
      letter-spacing: 2px; 
    }
    
    header span { 
      font-size: 14px; 
      color: var(--cyan); 
      font-weight: bold; 
    }
    
    .container { 
      padding: 30px 40px; 
      max-width: 1400px; 
      margin: auto; 
    }
    
    /* Layout a due colonne */
    .grid-dashboard {
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 30px;
    }
    
    /* Pannelli di Sezione */
    .panel {
      background-color: var(--bg-panel); 
      border-radius: 8px;
      padding: 25px; 
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
      border-top: 3px solid var(--cyan);
    }
    
    .panel.gold-border { 
      border-top-color: var(--gold); 
    }
    
    .panel h2 { 
      margin-top: 0; 
      margin-bottom: 20px; 
      font-size: 18px; 
      display: flex; 
      align-items: center; 
    }
    
    .panel h2 .badge { 
      margin-left: 15px; 
      background: var(--cyan); 
      color: #000; 
      padding: 3px 10px; 
      border-radius: 20px; 
      font-size: 12px; 
    }
    
    .panel.gold-border h2 .badge { 
      background: var(--gold); 
    }
    
    /* Card Singolo Contatto */
    .card {
      background: #15181E; 
      border: 1px solid #2C303A; 
      padding: 15px;
      margin-bottom: 15px; 
      border-radius: 6px; 
      transition: transform 0.2s;
    }
    
    .card:hover { 
      transform: translateY(-3px); 
      border-color: var(--text-muted); 
    }
    
    .card-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 10px; 
      border-bottom: 1px solid #2C303A; 
      padding-bottom: 8px;
    }
    
    .card-id { 
      color: var(--text-muted); 
      font-family: monospace; 
      font-size: 12px; 
    }
    
    .card-title { 
      font-weight: bold; 
      font-size: 16px; 
      color: var(--cyan); 
    }
    
    .card-body p { 
      margin: 5px 0; 
      font-size: 13px; 
      color: #ccc; 
    }
    
    .card-body p strong { 
      color: #fff; 
    }
    
    /* Bottoni e Azioni */
    .btn {
      background: var(--bg-panel); 
      color: #fff; 
      border: 1px solid var(--text-muted);
      padding: 8px 15px; 
      border-radius: 4px; 
      cursor: pointer; 
      font-size: 12px; 
      font-weight: bold;
      transition: all 0.3s; 
      margin-top: 10px;
    }
    
    .btn:hover { 
      background: #333; 
    }
    
    .btn-action { 
      background: var(--cyan); 
      color: #000; 
      border: none; 
    }
    
    .btn-action:hover { 
      background: #00C0CC; 
    }
    
    .btn-gold { 
      background: var(--gold); 
      color: #000; 
      border: none; 
    }
    
    .btn-gold:hover { 
      background: #b8962e; 
    }
    
    /* Semafori e Tag */
    .semafori-grid { 
      display: grid; 
      grid-template-columns: 1fr 1fr 1fr; 
      gap: 10px; 
      margin-top: 15px; 
    }
    
    .semaforo-box { 
      background: #0F1115; 
      padding: 8px; 
      border-radius: 4px; 
      text-align: center; 
      font-size: 11px; 
      border: 1px solid #222; 
    }
    
    /* Motore di Ricerca */
    .search-bar { 
      width: 100%; 
      padding: 15px; 
      background: #15181E; 
      border: 1px solid var(--text-muted); 
      color: #fff; 
      border-radius: 6px; 
      margin-bottom: 30px; 
      font-size: 16px; 
      outline: none; 
      box-sizing: border-box;
    }
    
    .search-bar:focus { 
      border-color: var(--gold); 
    }
    
    .loader { 
      text-align: center; 
      padding: 30px; 
      color: var(--gold); 
      display: none; 
    }
    
    /* Modal / Pop-up Invia Moduli */
    .modal-overlay { 
      position: fixed; 
      top: 0; 
      left: 0; 
      width: 100%; 
      height: 100%; 
      background: rgba(0,0,0,0.8); 
      display: none; 
      justify-content: center; 
      align-items: center; 
      z-index: 1000; 
    }
    
    .modal-content { 
      background: var(--bg-panel); 
      padding: 30px; 
      border-radius: 8px; 
      width: 400px; 
      border: 2px solid var(--cyan); 
      box-sizing: border-box;
    }
    
    .modal-content input, .modal-content select { 
      width: 100%; 
      padding: 10px; 
      margin: 10px 0; 
      background: #0F1115; 
      border: 1px solid #333; 
      color: #fff; 
      border-radius: 4px; 
      box-sizing: border-box;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <header>
    <h1>SUPREMA FUTURE X</h1>
    <span>CENTRALINA OPERATIVA EAL6+</span>
  </header>

  <div class="container">
    
    <!-- BARRA DI RICERCA GLOBALE -->
    <input type="text" class="search-bar" id="searchInput" placeholder="Cerca per Nome, Email o Codice Nexus (Es. NX-4701)..." onkeyup="filtraContatti()">

    <div id="globalLoader" class="loader">Sincronizzazione Dati con Google Server in corso...</div>

    <!-- GRIGLIA PRINCIPALE -->
    <div class="grid-dashboard">
      
      <!-- COLONNA SINISTRA: SALA D'ATTESA (Provvisori) -->
      <div class="panel gold-border">
        <h2>SALA D'ATTESA <span class="badge" id="countProvvisori">0</span></h2>
        <p style="font-size: 12px; color: var(--text-muted); margin-top: -10px; margin-bottom: 20px;">Leads in attesa di avallo CEO dopo il colloquio.</p>
        
        <div id="listaProvvisori">
          <!-- Le card verranno generate qui dal JavaScript -->
        </div>
      </div>

      <!-- COLONNA DESTRA: ACCADEMIA (Corsisti Ufficiali) -->
      <div class="panel">
        <h2>CORSISTI UFFICIALI <span class="badge" id="countCorsisti">0</span></h2>
        <p style="font-size: 12px; color: var(--text-muted); margin-top: -10px; margin-bottom: 20px;">Fascicoli attivi e gestione semafori didattici.</p>

        <div id="listaCorsisti">
           <!-- Le card verranno generate qui dal JavaScript -->
        </div>
      </div>

    </div>
  </div>
<!-- FINESTRA POP-UP PER ASSEGNAZIONE MODULI -->
  <div class="modal-overlay" id="modalModuli">
    <div class="modal-content">
      <h3 style="margin-top: 0; color: var(--cyan);">Assegna Materiale</h3>
      <p style="font-size: 12px; color: #ccc;">Scegli un documento Master da copiare nel fascicolo del corsista.</p>
      
      <input type="hidden" id="modalNexusCode">
      
      <label style="font-size: 12px; color: var(--gold);">Nome Materiale (Es. Scheda Trading)</label>
      <input type="text" id="modalTitoloModulo" placeholder="Es. Scheda Trading 01">
      
      <label style="font-size: 12px; color: var(--gold);">ID File Originale (da Google Drive)</label>
      <input type="text" id="modalIdFile" placeholder="Incolla l'ID alfanumerico del file">
      
      <div style="display: flex; justify-content: space-between; margin-top: 20px;">
        <button class="btn" onclick="chiudiModal()">Annulla</button>
        <button class="btn btn-action" onclick="eseguiAssegnazione()">Invia Materiale</button>
      </div>
    </div>
  </div>

  <!-- SCRIPT DI CONNESSIONE AL BACKEND -->
  <script>
    // =========================================================================
    // ⚠️ COLLEGAMENTO DIRETTO AL TUO MOTORE GOOGLE APPS SCRIPT
    // =========================================================================
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw14_idDB0G_HPvOUUJgpDoK5rt4aLvVR43NYF_X3Dux1dwM9vT-XqWxRdHSi2Lb7cd/exec';

    // Caricamento Dati all'avvio
    window.onload = function() {
      if(APPS_SCRIPT_URL === 'INCOLLA_QUI_L_URL_DI_ESECUZIONE_GOOGLE_APP_SCRIPT') {
        alert("ATTENZIONE: Devi incollare l'URL del tuo Google Apps Script nel file crm.html per far funzionare i dati.");
      } else {
        aggiornaCruscotto();
      }
    };

    // Lettura Dati da Google (GET)
    async function aggiornaCruscotto() {
      document.getElementById('globalLoader').style.display = 'block';
      document.getElementById('listaProvvisori').innerHTML = '';
      document.getElementById('listaCorsisti').innerHTML = '';

      try {
        // Scarica Provvisori
        const resP = await fetch(APPS_SCRIPT_URL + '?action=GET_PROVVISORI');
        const datiP = await resP.json();
        
        // Scarica Corsisti
        const resC = await fetch(APPS_SCRIPT_URL + '?action=GET_CORSISTI');
        const datiC = await resC.json();

        disegnaProvvisori(datiP.dati || []);
        disegnaCorsisti(datiC.dati || []);
        
      } catch (err) {
        console.error("Errore di sincronizzazione: ", err);
        alert("Errore di connessione ai server Google.");
      }
      document.getElementById('globalLoader').style.display = 'none';
    }

    // Rendering Card Provvisori
    function disegnaProvvisori(leads) {
      document.getElementById('countProvvisori').innerText = leads.length;
      let html = '';
      leads.forEach(function(lead) {
        html += `
        <div class="card item-ricerca" data-chiave="${lead.nome.toLowerCase()} ${lead.codiceNexus.toLowerCase()}">
          <div class="card-header">
            <span class="card-title">${lead.nome}</span>
            <span class="card-id">${lead.codiceNexus}</span>
          </div>
          <div class="card-body">
            <p><strong>Corso:</strong> ${lead.corso}</p>
            <p><strong>Colloquio:</strong> ${lead.dataColloquio} ore ${lead.oraColloquio}</p>
            <p><strong>Contatti:</strong> ${lead.telefono} | ${lead.email}</p>
            <button class="btn btn-gold" onclick="promuovi('${lead.codiceNexus}', '${lead.corso}')">⚡ AVVALLA & CREA FASCICOLO DRIVE</button>
          </div>
        </div>`;
      });
      document.getElementById('listaProvvisori').innerHTML = html;
    }

    // Rendering Card Corsisti
    function disegnaCorsisti(corsisti) {
      document.getElementById('countCorsisti').innerText = corsisti.length;
      let html = '';
      corsisti.forEach(function(c) {
        html += `
        <div class="card item-ricerca" data-chiave="${c.nome.toLowerCase()} ${c.codiceNexus.toLowerCase()}">
          <div class="card-header">
            <span class="card-title">${c.nome}</span>
            <span class="card-id">${c.codiceNexus}</span>
          </div>
          <div class="card-body">
            <p><strong>Percorso:</strong> ${c.corso}</p>
            <p><strong>Drive ID:</strong> <span style="color:#00F0FF; font-size:10px;">${c.idCartellaDrive}</span></p>
            
            <div class="semafori-grid">
              <div class="semaforo-box">
                <span style="color:#888;">Pagamenti</span><br><strong>${c.semaforoPagamento}</strong>
              </div>
              <div class="semaforo-box">
                <span style="color:#888;">Materiali</span><br><strong>${c.semaforoMateriali}</strong>
              </div>
              <div class="semaforo-box">
                <span style="color:#888;">Avanzamento</span><br><strong>${c.semaforoAvanzamento}</strong>
              </div>
            </div>

            <div style="display:flex; gap:10px;">
              <button class="btn btn-action" onclick="apriModalModuli('${c.codiceNexus}')">📄 ASSEGNA MATERIALE</button>
            </div>
          </div>
        </div>`;
      });
      document.getElementById('listaCorsisti').innerHTML = html;
    }

    // Motore di Ricerca Interno
    function filtraContatti() {
      const input = document.getElementById('searchInput').value.toLowerCase();
      const schede = document.querySelectorAll('.item-ricerca');
      
      schede.forEach(function(scheda) {
        const chiave = scheda.getAttribute('data-chiave');
        if (chiave.includes(input)) {
          scheda.style.display = 'block';
        } else {
          scheda.style.display = 'none';
        }
      });
    }

    // Azione: Promuovi Corsista
    async function promuovi(codiceNexus, corso) {
      if(!confirm("Confermi di voler avvallare questo lead? Verranno creati i fascicoli Drive e inviate le comunicazioni al corsista.")) {
        return;
      }
      
      document.getElementById('globalLoader').style.display = 'block';
      
      try {
        const response = await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          body: JSON.stringify({ 
            action: 'PROMUOVI_CORSISTA', 
            codiceNexus: codiceNexus, 
            corso: corso 
          })
        });
        
        const result = await response.json();
        
        if(result.status === 'success') {
          alert("Successo: " + result.messaggio);
          aggiornaCruscotto();
        } else {
          alert("Errore: " + result.messaggio);
        }
      } catch (err) {
        alert("Errore di trasmissione al server.");
      }
    }

    // Gestione Modale Moduli Didattici
    function apriModalModuli(codice) {
      document.getElementById('modalNexusCode').value = codice;
      document.getElementById('modalModuli').style.display = 'flex';
    }
    
    function chiudiModal() { 
      document.getElementById('modalModuli').style.display = 'none'; 
    }

    async function eseguiAssegnazione() {
      const codice = document.getElementById('modalNexusCode').value;
      const titolo = document.getElementById('modalTitoloModulo').value;
      const idMaster = document.getElementById('modalIdFile').value;

      if(!titolo || !idMaster) { 
        alert("Compila entrambi i campi prima di procedere."); 
        return; 
      }

      chiudiModal();
      document.getElementById('globalLoader').style.display = 'block';
      
      try {
        const response = await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          body: JSON.stringify({ 
            action: 'ASSEGNA_MODULO', 
            codiceNexus: codice, 
            titoloModulo: titolo, 
            idFileMaster: idMaster 
          })
        });
        
        const result = await response.json();
        
        if(result.status === 'success') {
          alert("Materiale Assegnato! Inserito nel Drive del corsista.");
          aggiornaCruscotto();
        } else {
          alert("Errore assegnazione: " + (result.messaggio || result.errore));
        }
      } catch (err) { 
        alert("Errore di trasmissione al server."); 
      }
    }
  </script>
</body>
</html>
