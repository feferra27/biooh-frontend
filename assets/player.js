// Player de Sala de Espera — BiOOH Patient Clean
const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => [...el.querySelectorAll(q)];

const params = new URLSearchParams(location.search);
const CLINIC = params.get('clinic') || 'default';
const API = params.get('api') || 'http://localhost:4000';

const state = { playlist: [], idx: -1, timer: null };

async function loadPlaylist(){
  try{
    const r = await fetch(`${API}/api/playlist?clinic=${encodeURIComponent(CLINIC)}`);
    const data = await r.json();
    state.playlist = data.items || [];
    $('#brandName').textContent = data.brand?.name || 'BiOOH';
    $('#qrurl').textContent = (data.qrUrl||'https://biooh.link/checkin').replace('https://','');
    $('#tickerFlow').innerHTML = (data.ticker||['Use o QR para check‑in e atualizar seus dados.','Anote 3 dúvidas para sua consulta.','Hidrate-se com pequenos goles.']).map(t=>`<span>${t}</span>`).join('');
    // duplicar para fluxo infinito
    $('#tickerFlow').innerHTML += $('#tickerFlow').innerHTML;
    nextSlide();
  }catch(e){
    console.error(e);
  }
}

function mountSlide(item){
  const screen = $('#screen');
  screen.innerHTML = '';
  const s = document.createElement('div');
  s.className = 'slide active';

  if(item.type === 'imageText'){
    s.innerHTML = `
      <div class="two">
        <div>
          <div class="title-xl">${item.title||''}</div>
          ${item.lead?`<p class="lead">${item.lead}</p>`:''}
          ${Array.isArray(item.bullets)?`<ul class="bul">${item.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>`:''}
          ${item.badge?`<span class="badge">${item.badge}</span>`:''}
          ${item.qr!==false?`<div class="qrbox" style="margin-top:12px">
            <div style="font-weight:700">Aponte a câmera para abrir</div>
            <div class="qrgrid" aria-hidden="true">${'<span></span>'.repeat(36)}</div>
            <div class="qrurl" id="qrurl"></div>
          </div>`:''}
        </div>
        <div class="hero">${item.image?`<img src="${item.image}" alt="${item.alt||''}"/>`:''}</div>
      </div>`;
  }
  else if(item.type === 'video'){
    s.innerHTML = `
      <div class="two">
        <div>
          <div class="title-xl">${item.title||''}</div>
          ${item.lead?`<p class="lead">${item.lead}</p>`:''}
          ${Array.isArray(item.bullets)?`<ul class="bul">${item.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>`:''}
        </div>
        <div class="hero"><video id="v" autoplay muted playsinline src="${item.src}"></video></div>
      </div>`;
    const v = s.querySelector('#v');
    v.addEventListener('ended', ()=>nextSlide());
  }
  else if(item.type === 'quiz'){
    s.innerHTML = `
      <div class="slide quiz">
        <div class="two">
          <div>
            <span class="badge">Quiz</span>
            <div class="title-xl" style="margin-top:8px">${item.question}</div>
            <div class="options">${item.options.map(o=>`<div class="opt">${o}</div>`).join('')}</div>
            <div class="reveal">Resposta: <strong>${item.answer}</strong>. ${item.explain||''}</div>
          </div>
          <div class="hero">${item.image?`<img src="${item.image}">`:''}</div>
        </div>
      </div>`;
    setTimeout(()=>s.classList.add('revealed'), item.revealMs||6000);
  }
  screen.appendChild(s);
}

function nextSlide(){
  clearTimeout(state.timer);
  state.idx = (state.idx + 1) % state.playlist.length;
  const item = state.playlist[state.idx];
  mountSlide(item);
  const dur = item.type==='video' ? (item.duration||20000) : (item.duration||16000);
  if(item.type!=='video') state.timer = setTimeout(nextSlide, dur);
  track('slide_impression', { idx: state.idx, id: item.id||null, type:item.type });
}

function updateClock(){
  const el=$('#clock');
  const d=new Date();
  el.textContent=d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}
setInterval(updateClock, 1000); updateClock();

function track(evt, payload){
  try{ fetch(`${API}/api/analytics`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ clinic: CLINIC, evt, payload, ts: Date.now() }) }); }catch(e){}
}

window.addEventListener('load', loadPlaylist);
