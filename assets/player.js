// Player de Sala de Espera — BiOOH Patient Clean (ES5-safe / resiliente)

// ===== Helpers =====
function $(q, root){ return (root||document).querySelector(q); }
function escapeHtml(s){
  return String(s||'')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ===== Params (sem regex sensível) =====
var search = (typeof location !== 'undefined' && location.search) ? location.search : '';
if (search && search.charAt(0) === '?') search = search.slice(1);

var params = {};
if (search) {
  var pairs = search.split('&');
  for (var i = 0; i < pairs.length; i++) {
    if (!pairs[i]) continue;
    var kv = pairs[i].split('=');
    var k = decodeURIComponent(kv[0] || '');
    var v = decodeURIComponent((kv[1] || '').replace(/+/g, ' '));
    params[k] = v;
  }
}

var CLINIC = params.clinic || 'default';
var API    = params.api    || '[http://localhost:4000';/]http://localhost:4000';

// ===== State =====
var state = {
  playlist: [],
  idx: -1,
  timer: null,
  qrUrl: null,
  brand: 'BiOOH'
};

// ===== Load playlist =====
function loadPlaylist(){
  try{
    var url = API + '/api/playlist?clinic=' + encodeURIComponent(CLINIC);
    fetch(url).then(function(r){ return r.json(); }).then(function(data){
      data = data || {};
      state.playlist = (data.items && data.items.length) ? data.items : [];
      state.qrUrl    = data.qrUrl || 'https://biooh.link/checkin';
      state.brand    = (data.brand && data.brand.name) ? data.brand.name : 'BiOOH';

      // Atualiza marca (se existir no HTML)
      var brandEl = document.getElementById('brandName');
      if(brandEl){ brandEl.textContent = state.brand; }

      // Atualiza ticker (se existir)
      var flowEl = document.getElementById('tickerFlow');
      if(flowEl){
        var msgs = (data.ticker && data.ticker.length) ? data.ticker : [
          'Use o QR para check‑in e atualizar seus dados.',
          'Anote 3 dúvidas para sua consulta.',
          'Hidrate-se com pequenos goles.'
        ];
        var html = '';
        for(var i=0;i<msgs.length;i++){ html += '<span>' + escapeHtml(msgs[i]) + '</span>'; }
        flowEl.innerHTML = html + html; // duplica para fluxo contínuo
      }

      // Se não houver itens, mostra aviso e sai
      if(!state.playlist.length){
        var screen0 = document.getElementById('screen');
        if(screen0){
          screen0.innerHTML =
            '<div class="center" style="display:grid;place-content:center;height:100%;text-align:center;padding:24px">'+
              '<h2 style="margin:0 0 8px">Sem conteúdo publicado</h2>'+
              '<p class="lead" style="max-width:720px;margin:0 auto;color:#5B677A">'+
                'Publique uma playlist pelo Admin (Template: Diabetes) e recarregue esta página.'+
              '</p>'+
            '</div>';
        }
        return;
      }

      // Inicia os slides
      nextSlide();
    }).catch(function(e){
      console.error('Falha ao carregar playlist:', e);
      var screenE = document.getElementById('screen');
      if(screenE){
        screenE.innerHTML =
          '<div class="center" style="display:grid;place-content:center;height:100%;text-align:center;padding:24px">'+
            '<h2 style="margin:0 0 8px">Erro ao carregar</h2>'+
            '<p class="lead" style="max-width:720px;margin:0 auto;color:#5B677A">'+
              'Verifique a conexão com o backend e recarregue (Ctrl/⌘ + R).'+
            '</p>'+
          '</div>';
      }
    });
  }catch(e){
    console.error(e);
  }
}

// ===== Mount one slide =====
function mountSlide(item){
  var screen = document.getElementById('screen');
  if(!screen) return;
  screen.innerHTML = '';
  if(!item) return;

  var s = document.createElement('div');
  s.className = 'slide active';

  if(item.type === 'imageText'){
    var html = ''
      + '<div class="two">'
      + '  <div>'
      + '    <div class="title-xl">' + escapeHtml(item.title||'') + '</div>'
      + (item.lead ? ('<p class="lead">' + escapeHtml(item.lead) + '</p>') : '')
      + (Object.prototype.toString.call(item.bullets)==='[object Array]' ? ('<ul class="bul">' + item.bullets.map(function(b){return '<li>'+escapeHtml(b)+'</li>';}).join('') + '</ul>') : '')
      + (item.badge ? ('<span class="badge">' + escapeHtml(item.badge) + '</span>') : '')
      + (item.qr !== false ? (
          '<div class="qrbox" style="margin-top:12px">'
        + '  <div style="font-weight:700">Aponte a câmera para abrir</div>'
        + '  <div class="qrgrid" aria-hidden="true">' + new Array(36+1).join('<span></span>') + '</div>'
        + '  <div class="qrurl" id="qrurl"></div>'
        + '</div>') : '')
      + '  </div>'
      + '  <div class="hero">'
      + (item.image ? ('<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.alt||'') + '">') : '')
      + '  </div>'
      + '</div>';

    s.innerHTML = html;

    // Preenche o texto do QR dentro do slide
    var qrEl = s.querySelector('#qrurl');
    if(qrEl){
      var url = (item.qrUrl || state.qrUrl || '').toString().replace(/^https?:///,'');
      qrEl.textContent = url;
    }
  }
  else if(item.type === 'video'){
    var htmlV = ''
      + '<div class="two">'
      + '  <div>'
      + '    <div class="title-xl">' + escapeHtml(item.title||'') + '</div>'
      + (item.lead ? ('<p class="lead">' + escapeHtml(item.lead) + '</p>') : '')
      + (Object.prototype.toString.call(item.bullets)==='[object Array]' ? ('<ul class="bul">' + item.bullets.map(function(b){return '<li>'+escapeHtml(b)+'</li>';}).join('') + '</ul>') : '')
      + '  </div>'
      + '  <div class="hero"><video id="v" autoplay muted playsinline src="' + escapeHtml(item.src||'') + '"></video></div>'
      + '</div>';
    s.innerHTML = htmlV;

    var v = s.querySelector('#v');
    if(v){ v.addEventListener('ended', function(){ nextSlide(); }); }
  }
  else if(item.type === 'quiz'){
    var opts = (item.options||[]).map(function(o){ return '<div class="opt">'+escapeHtml(o)+'</div>'; }).join('');
    var htmlQ = ''
      + '<div class="slide quiz">'
      + '  <div class="two">'
      + '    <div>'
      + '      <span class="badge">Quiz</span>'
      + '      <div class="title-xl" style="margin-top:8px">' + escapeHtml(item.question||'') + '</div>'
      + '      <div class="options">' + opts + '</div>'
      + '      <div class="reveal">Resposta: <strong>' + escapeHtml(item.answer||'') + '</strong>. ' + escapeHtml(item.explain||'') + '</div>'
      + '    </div>'
      + '    <div class="hero">' + (item.image ? ('<img src="'+escapeHtml(item.image)+'">') : '') + '</div>'
      + '  </div>'
      + '</div>';
    s.innerHTML = htmlQ;

    setTimeout(function(){ s.classList.add('revealed'); }, item.revealMs || 6000);
  }
  else{
    s.innerHTML =
      '<div class="center" style="display:grid;place-content:center;height:100%;text-align:center;padding:24px">'
    + '  <h2 style="margin:0 0 8px">Conteúdo não suportado</h2>'
    + '  <p class="lead" style="max-width:720px;margin:0 auto;color:#5B677A">Tipo: <code>' + escapeHtml(String(item.type)) + '</code></p>'
    + '</div>';
  }

  screen.appendChild(s);
}

// ===== Slide loop =====
function nextSlide(){
  clearTimeout(state.timer);
  if(!state.playlist.length) return;

  state.idx = (state.idx + 1) % state.playlist.length;
  var item = state.playlist[state.idx];
  mountSlide(item);

  var dur = (item && item.type === 'video') ? (item.duration||20000) : ((item && item.duration) ? item.duration : 16000);
  if(item && item.type !== 'video'){
    state.timer = setTimeout(nextSlide, dur);
  }

  track('slide_impression', { idx: state.idx, id: (item && item.id) || null, type: (item && item.type) || 'unknown' });
}

// ===== Clock =====
function updateClock(){
  var el = document.getElementById('clock');
  if(!el) return;
  var d = new Date();
  el.textContent = d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}
setInterval(updateClock, 1000);
updateClock();

// ===== Analytics (best-effort) =====
function track(evt, payload){
  try{
    fetch(API + '/api/analytics', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ clinic: CLINIC, evt: evt, payload: payload, ts: Date.now() })
    });
  }catch(_){}
}

// ===== Boot =====
window.addEventListener('load', loadPlaylist);
