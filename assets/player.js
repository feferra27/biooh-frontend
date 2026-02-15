(function () {
  // ===== Helpers =====
  function $(id) { return document.getElementById(id); }
  function $qs(sel, root){ return (root||document).querySelector(sel); }
  function escapeHtml(s){
    return String(s||'')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function imgTag(src, alt){
    if(!src) return '';
    return '<img src="'+escapeHtml(src)+'" alt="'+escapeHtml(alt||'')+'">';
  }

  // ===== Params (sem regex sensível, sem entidades) =====
  var search = (typeof location !== 'undefined' && location.search) ? location.search : '';
  if (search && search.charAt(0) === '?') search = search.slice(1);

  var params = {};
  if (search) {
    var pairs = search.split('&');
    for (var i = 0; i < pairs.length; i++) {
      if (!pairs[i]) continue;
      var kv = pairs[i].split('=');
      var k = decodeURIComponent(kv[0] || '');
      var raw = (kv[1] || '');
      raw = raw.split('+').join(' ');
      var v = decodeURIComponent(raw);
      params[k] = v;
    }
  }

  var CLINIC = params.clinic || 'default';
  var API = params.api || 'http://localhost:4000';

  // ===== Estado =====
  var state = {
    playlist: [],
    idx: -1,
    timer: null,
    brand: 'BiOOH',
    qrUrl: 'https://biooh.link/checkin'
  };

  // ===== Carrega playlist, aplica brand/ticker, inicia LOOP =====
  function load() {
    var url = API + '/api/playlist?clinic=' + encodeURIComponent(CLINIC);
    fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      data = data || {};
      state.playlist = (data.items && data.items.length) ? data.items : [];
      state.brand    = (data.brand && data.brand.name) ? data.brand.name : 'BiOOH';
      state.qrUrl    = data.qrUrl || 'https://biooh.link/checkin';

      // Brand (se existir no HTML)
      var brandEl = $('brandName');
      if (brandEl) brandEl.textContent = state.brand;

      // Ticker (se existir no HTML)
      var flowEl = $('tickerFlow');
      if (flowEl){
        var msgs = (data.ticker && data.ticker.length) ? data.ticker : [
          'Use o QR para check‑in e atualizar seus dados.',
          'Anote 3 dúvidas para sua consulta.',
          'Hidrate-se com pequenos goles.'
        ];
        var html = '';
        for(var i=0;i<msgs.length;i++){ html += '<span>'+escapeHtml(msgs[i])+'</span>'; }
        flowEl.innerHTML = html + html;
      }

      var screen = $('screen');
      if (!screen) return;

      if (!state.playlist.length) {
        screen.innerHTML =
          '<div class="center" style="display:grid;place-content:center;height:100%;text-align:center;padding:24px">' +
            '<h2 style="margin:0 0 8px">Sem conteúdo publicado</h2>' +
            '<p class="lead" style="max-width:720px;margin:0 auto;color:#5B677A">' +
              'Use o Admin (Template: Diabetes) e recarregue.' +
            '</p>' +
          '</div>';
        return;
      }

      nextSlide();
    }).catch(function (e) {
      console.error(e);
      var screen = $('screen');
      if (screen) {
        screen.innerHTML =
          '<div class="center" style="display:grid;place-content:center;height:100%;text-align:center;padding:24px">' +
            '<h2 style="margin:0 0 8px">Erro ao carregar</h2>' +
            '<p class="lead" style="max-width:720px;margin:0 auto;color:#5B677A">' +
              'Verifique a URL do backend e recarregue.' +
            '</p>' +
          '</div>';
      }
    });
  }

  // ===== Monta um slide (imageText, video, quiz) =====
  function mountSlide(item){
    var screen = $('screen');
    if (!screen) return;
    screen.innerHTML = '';
    if (!item) return;

    var s = document.createElement('div');
    s.className = 'slide active';

    if (item.type === 'imageText'){
      var bulletsHtml = '';
      if (Object.prototype.toString.call(item.bullets)==='[object Array]' && item.bullets.length){
        var li = [];
        for (var i=0;i<item.bullets.length;i++){ li.push('<li>'+escapeHtml(item.bullets[i])+'</li>'); }
        bulletsHtml = '<ul class="bul">'+li.join('')+'</ul>';
      }
      s.innerHTML =
        '<div class="two">'+
          '<div>'+
            '<div class="title-xl">'+ escapeHtml(item.title||'') +'</div>'+
            (item.lead ? '<p class="lead">'+ escapeHtml(item.lead) +'</p>' : '')+
            bulletsHtml+
            (item.badge ? '<span class="badge">'+ escapeHtml(item.badge) +'</span>' : '')+
            ((item.qr !== false) ? (
              '<div class="qrbox" style="margin-top:12px">'+
                '<div style="font-weight:700">Aponte a câmera para abrir</div>'+
                '<div class="qrgrid" aria-hidden="true">'+ new Array(36+1).join('<span></span>') +'</div>'+
                '<div class="qrurl" id="qrurl"></div>'+
              '</div>'
            ) : '')+
          '</div>'+
          '<div class="hero">'+ imgTag(item.image, item.alt) +'</div>'+
        '</div>';

      var qrEl = $qs('#qrurl', s);
      if (qrEl){
        var urlTxt = (item.qrUrl || state.qrUrl || '').toString().replace(/^https?:\/\//,'');
        qrEl.textContent = urlTxt;
      }
    }
    else if (item.type === 'video'){
      s.innerHTML =
        '<div class="two">'+
          '<div>'+
            '<div class="title-xl">'+ escapeHtml(item.title||'') +'</div>'+
            (item.lead ? '<p class="lead">'+ escapeHtml(item.lead) +'</p>' : '')+
            (Object.prototype.toString.call(item.bullets)==='[object Array]' && item.bullets.length
              ? '<ul class="bul">'+ item.bullets.map(function(b){return '<li>'+escapeHtml(b)+'</li>';}).join('') +'</ul>' : ''
            )+
          '</div>'+
          '<div class="hero"><video id="v" autoplay muted playsinline src="'+ escapeHtml(item.src||'') +'"></video></div>'+
        '</div>';
      var v = $qs('#v', s);
      if (v){
        v.addEventListener('ended', function(){ nextSlide(); });
      }
    }
    else if (item.type === 'quiz'){
      var opts = (item.options||[]).map(function(o){ return '<div class="opt">'+escapeHtml(o)+'</div>'; }).join('');
      s.innerHTML =
        '<div class="slide quiz">'+
          '<div class="two">'+
            '<div>'+
              '<span class="badge">Quiz</span>'+
              '<div class="title-xl" style="margin-top:8px">'+ escapeHtml(item.question||'') +'</div>'+
              '<div class="options">'+ opts +'</div>'+
              '<div class="reveal">Resposta: <strong>'+ escapeHtml(item.answer||'') +'</strong>. '+ escapeHtml(item.explain||'') +'</div>'+
            '</div>'+
            '<div class="hero">'+ imgTag(item.image) +'</div>'+
          '</div>'+
        '</div>';
      setTimeout(function(){ s.classList.add('revealed'); }, item.revealMs || 6000);
    }
    else {
      s.innerHTML =
        '<div class="center" style="display:grid;place-content:center;height:100%;text-align:center;padding:24px">'+
          '<h2 style="margin:0 0 8px">Conteúdo não suportado</h2>'+
          '<p class="lead" style="max-width:720px;margin:0 auto;color:#5B677A">Tipo: <code>'+ escapeHtml(String(item.type)) +'</code></p>'+
        '</div>';
    }

    screen.appendChild(s);
  }

  // ===== LOOP =====
  function nextSlide() {
    clearTimeout(state.timer);
    if (!state.playlist.length) return;

    state.idx = (state.idx + 1) % state.playlist.length;
    var item = state.playlist[state.idx];
    mountSlide(item);
