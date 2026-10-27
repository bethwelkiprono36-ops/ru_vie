import './style.css';

const app = document.querySelector('#app');
let demoOn = true;
let paused = false;
let tick = 0;
let activePage = 'Overview';
let signal = 82;
let people = 2;
let movement = 37;

const navItems = [
  ['Overview', '◫'], ['Live sensing', '⌁'], ['Room map', '⌗'],
  ['Devices', '▣'], ['Data & privacy', '◇'], ['Setup guide', '?']
];

function metricCard(icon, label, value, unit, note, color = 'cyan') {
  return `<article class="metric card">
    <div class="metric-top"><span class="metric-icon ${color}">${icon}</span><span class="tiny muted">${note}</span></div>
    <div class="metric-label">${label}</div>
    <div class="metric-value">${value}<small>${unit || ''}</small></div>
  </article>`;
}

function chartBars() {
  return Array.from({length: 36}, (_, i) => {
    const h = 16 + ((Math.sin((i + tick) * .71) + 1) * 26) + ((i * 17 + tick * 7) % 13);
    return `<span style="height:${Math.min(86,h)}%;opacity:${.42 + (i%5)*.1}"></span>`;
  }).join('');
}

function roomDots() {
  return [
    [22,27, 'A'], [63,22,'B'], [47,56,'C'], [76,68,'D']
  ].map(([x,y,label], i) => `<span class="room-dot dot-${i}" style="left:${x}%;top:${y}%"><i></i><b>${label}</b></span>`).join('');
}

function render() {
  app.innerHTML = `
  <div class="shell">
    <aside class="sidebar">
      <a class="brand" href="#" aria-label="RuView home"><span class="brand-mark">π</span><span>Ru<span class="brand-light">View</span><small>SPATIAL INTELLIGENCE</small></span></a>
      <div class="workspace"><span class="workspace-dot"></span><div><b>Personal workspace</b><small>Demo environment</small></div><span class="chevron">⌄</span></div>
      <div class="nav-caption">WORKSPACE</div>
      <nav>${navItems.map(([name, icon]) => `<button class="nav-item ${activePage===name?'selected':''}" data-page="${name}"><span class="nav-icon">${icon}</span>${name}${name==='Live sensing'?'<span class="nav-live"></span>':''}</button>`).join('')}</nav>
      <div class="sidebar-bottom"><div class="hardware-card"><div class="hardware-head"><span class="status-dot amber"></span><b>Sensor connection</b></div><p>No physical CSI source connected.</p><button class="text-button" data-page="Setup guide">Configure hardware <span>↗</span></button></div><div class="profile"><div class="avatar">RV</div><div><b>RuView Demo</b><small>Local simulator</small></div><span class="dots">•••</span></div></div>
    </aside>
    <main class="main">
      <header class="topbar"><button class="mobile-menu" id="menuBtn">☰</button><div class="breadcrumb">Workspace <span>/</span> ${activePage}</div><div class="top-actions"><span class="demo-pill"><i></i> SIMULATED DATA</span><button class="icon-btn" title="Notifications">♧</button><div class="avatar small-avatar">RV</div></div></header>
      <section class="content">
        <div class="page-heading"><div><div class="eyebrow">WI-FI SENSING PLATFORM <span class="eyebrow-line"></span></div><h1>${activePage==='Overview'?'Spatial intelligence, at a glance':activePage}</h1><p class="subheading">${activePage==='Overview'?'Monitor your environment and explore signal-derived insights.':'Explore the '+activePage.toLowerCase()+' workspace and demo controls.'}</p></div><div class="heading-actions"><button class="button secondary" id="exportBtn">⇩ <span>Export demo data</span></button><button class="button primary" id="toggleDemo">${demoOn?'Ⅱ Pause simulation':'▶ Resume simulation'}</button></div></div>
        <div class="notice"><span class="notice-icon">ⓘ</span><div><b>Demo mode is active</b><p>All values and room activity below are generated sample data — no real Wi-Fi sensing hardware is connected.</p></div><button id="noticeDismiss" aria-label="Dismiss notice">×</button></div>
        <div class="section-row"><div><h2>Environment overview</h2><p class="section-description">Current simulated snapshot <span class="live-dot"></span></p></div><span class="updated" id="updated">Updated just now</span></div>
        <div class="metrics-grid">
          ${metricCard('⌁','Signal quality',`${signal}`,'%','DEMO SIGNAL','cyan')}
          ${metricCard('◉','Presence estimate',demoOn?'02':'—',' entities','SIMULATED','purple')}
          ${metricCard('⌁','Movement index',`${movement}`,'/100','SIMULATED','orange')}
          ${metricCard('▣','Active receivers','0','','HARDWARE OFFLINE','red')}
        </div>
        <div class="panels-grid">
          <article class="card signal-card"><div class="card-heading"><div><h3>Signal activity</h3><p>Illustrative CSI-like signal stream</p></div><span class="live-tag"><i></i> ${paused?'PAUSED':'STREAMING DEMO'}</span></div><div class="chart-legend"><span><i class="legend-cyan"></i> Signal amplitude</span><span class="muted">Last 36 samples</span></div><div class="bar-chart" id="barChart">${chartBars()}</div><div class="chart-axis"><span>−36s</span><span>−24s</span><span>−12s</span><span>NOW</span></div><div class="chart-footer"><span><i class="legend-cyan"></i> Simulated signal</span><span class="muted">Not measured from hardware</span></div></article>
          <article class="card presence-card"><div class="card-heading"><div><h3>Presence estimate</h3><p>Demo activity classification</p></div><span class="mini-chip">DEMO</span></div><div class="presence-main"><div class="presence-ring"><div><strong>${demoOn?'02':'00'}</strong><small>DEMO ENTITIES</small></div></div><div class="presence-stats"><div><span class="presence-key"><i class="key-purple"></i> Stationary</span><b>${demoOn?'01':'00'}</b></div><div><span class="presence-key"><i class="key-cyan"></i> Moving</span><b>${demoOn?'01':'00'}</b></div><div><span class="presence-key"><i class="key-gray"></i> Unknown</span><b>00</b></div></div></div><div class="card-footnote">Illustrative output only. Not a real occupancy detector.</div></article>
        </div>
        <div class="panels-grid lower-grid">
          <article class="card room-card"><div class="card-heading"><div><h3>Room activity map</h3><p>Concept visualization · not a floor plan</p></div><button class="subtle-button" data-page="Room map">Expand ↗</button></div><div class="room-map"><div class="room-grid"></div><div class="room-outline"><span class="room-label">ZONE 01</span>${roomDots()}<div class="wifi-source"><span>⌁</span><small>SIMULATED</small></div></div><div class="map-legend"><span><i class="key-purple"></i> Demo track</span><span><i class="key-cyan"></i> Signal source (concept)</span></div></div></article>
          <article class="card device-card"><div class="card-heading"><div><h3>System status</h3><p>Runtime and connectivity</p></div><span class="mini-chip warning">NOT CONNECTED</span></div><div class="status-list"><div><span class="status-symbol">⌘</span><div><b>Dashboard</b><small>Frontend available</small></div><span class="status-label good">ONLINE</span></div><div><span class="status-symbol">⇄</span><div><b>Sensing backend</b><small>Endpoint not configured</small></div><span class="status-label off">OFFLINE</span></div><div><span class="status-symbol">▣</span><div><b>CSI receiver</b><small>No receiver detected</small></div><span class="status-label off">OFFLINE</span></div><div><span class="status-symbol">⌁</span><div><b>Data stream</b><small>${paused?'Simulation paused':'Sample generator'}</small></div><span class="status-label ${paused?'warning-text':'demo'}">${paused?'PAUSED':'DEMO'}</span></div></div><button class="button full secondary" data-page="Setup guide">View setup requirements <span>→</span></button></article>
        </div>
        <article class="card setup-strip"><div class="setup-icon">⌘</div><div><b>Ready to connect real sensing hardware?</b><p>Real CSI measurements need a compatible receiver, capture firmware, and a separate processing service.</p></div><button class="button secondary" data-page="Setup guide">Read setup guide →</button></article>
        <footer><span>π RuView <span class="muted">/ dashboard prototype</span></span><span><i class="footer-dot"></i> Frontend healthy <span class="footer-sep">·</span> Demo build 1.0.0</span></footer>
      </section>
    </main>
  </div>`;
  bind();
}

function bind() {
  document.querySelectorAll('[data-page]').forEach(el => el.addEventListener('click', () => {
    activePage = el.dataset.page;
    if (activePage === 'Setup guide') showSetup();
    else if (activePage === 'Devices') showDevices();
    else if (activePage === 'Data & privacy') showPrivacy();
    else if (activePage === 'Live sensing') showLive();
    else if (activePage === 'Room map') showRoom();
    else render();
  }));
  document.querySelector('#toggleDemo')?.addEventListener('click', () => { paused = !paused; demoOn = !paused; render(); });
  document.querySelector('#noticeDismiss')?.addEventListener('click', () => document.querySelector('.notice')?.remove());
  document.querySelector('#exportBtn')?.addEventListener('click', exportData);
  document.querySelector('#menuBtn')?.addEventListener('click', () => document.querySelector('.sidebar')?.classList.toggle('open'));
}

function showInfo(title, description, items) {
  activePage = title;
  render();
  const content = document.querySelector('.content');
  const main = document.createElement('article');
  main.className = 'card info-page';
  main.innerHTML = `<div class="info-symbol">⌘</div><h2>${title}</h2><p>${description}</p><div class="info-list">${items.map((x,i)=>`<div><span class="info-num">0${i+1}</span><div><b>${x[0]}</b><p>${x[1]}</p></div></div>`).join('')}</div><button class="button primary" id="backOverview">← Back to overview</button>`;
  content.replaceChildren(main);
  document.querySelector('#backOverview').addEventListener('click', () => {activePage='Overview';render();});
}
function showSetup(){showInfo('Setup guide','A dashboard is only one part of a real Wi-Fi sensing system. Use these steps to plan a safe, testable integration.',[
['Choose compatible CSI hardware','Select a Wi-Fi chipset and firmware that can expose Channel State Information (CSI). Ordinary browser APIs cannot read CSI.'],
['Run a capture service','Collect CSI frames on a supported device and transmit them to a backend you control. Do not collect data from networks or people without permission.'],
['Process signals on a backend','A separate Python or Rust service should validate input, process signal features, and expose an authenticated API or WebSocket.'],
['Configure this dashboard','Add your backend endpoint only after it is deployed with authentication, HTTPS, and a documented data schema.'],
['Validate carefully','Start with synthetic signals and known test conditions. Presence and vital-sign estimates require independent validation and are not medical diagnoses.']
]);}
function showDevices(){showInfo('Devices','No physical sensing devices are currently paired. This is expected in the simulator.',[
['CSI receiver','Status: not connected. Pair a compatible CSI capture device through the backend service.'],
['Processing backend','Status: not configured. The dashboard currently generates sample values locally.'],
['Connection security','Use HTTPS, authentication, least-privilege access, and explicit consent for any sensing deployment.']
]);}
function showPrivacy(){showInfo('Data & privacy','This prototype generates sample readings in your browser and does not send them to a sensing backend.',[
['Demo readings','Signal, movement, and presence figures are synthetic and intended only for interface testing.'],
['Consent and notice','Real deployments should notify occupants and obtain appropriate permission before collecting environmental or personal data.'],
['Medical limitations','Do not use this prototype or unvalidated vital-sign algorithms for diagnosis, emergencies, or treatment decisions.']
]);}
function showLive(){showInfo('Live sensing','This view is a design placeholder for a future real-time CSI stream. The current app has no sensor endpoint configured.',[
['Current state','Simulated stream only; no raw CSI frames are received.'],
['Expected integration','A backend WebSocket can later deliver timestamped, validated signal features to the interface.'],
['Before enabling','Confirm hardware compatibility, authentication, rate limits, and user consent.']
]);}
function showRoom(){showInfo('Room map','The overview map is conceptual and contains generated points, not real location data.',[
['Coordinate system','A real map would need a surveyed room layout and calibrated receiver locations.'],
['Demo points','A/B/C/D markers are illustrative only and do not represent detected people.'],
['Validation','Test against ground truth before relying on any movement or occupancy output.']
]);}
function exportData(){
  const data = {generated_at:new Date().toISOString(),mode:'SIMULATED',real_sensor_connected:false,signal_quality_percent:signal,presence_estimate:demoOn?2:0,movement_index:movement,warning:'All values are synthetic demo data; not for medical, security, or emergency use.'};
  const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='ruview-demo-data.json'; a.click(); URL.revokeObjectURL(url);
}
render();
setInterval(() => {
  if (!paused && activePage === 'Overview') {
    tick++; signal = 76 + Math.floor(Math.abs(Math.sin(tick*.6))*22); movement = 20 + Math.floor(Math.abs(Math.cos(tick*.35))*65);
    const chart=document.querySelector('#barChart'); if(chart) chart.innerHTML=chartBars();
    const vals=document.querySelectorAll('.metric-value'); if(vals[0]) vals[0].innerHTML=`${signal}<small>%</small>`; if(vals[2]) vals[2].innerHTML=`${movement}<small>/100</small>`;
    const up=document.querySelector('#updated'); if(up) up.textContent='Updated just now';
  }
},1500);
