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
  var API = params.api || 'http' + String.fromCharCode(58) + '//localhost' + String.fromCharCode(58) + '4000';

  // ===== Estado =====
  var state = {
    playlist: [],
    idx: -1,
    timer: null,
    brand: 'BiOOH',
    qrUrl: 'https' + String.fromCharCode(58) + '//biooh.link/checkin'
  };

  // ===== Carrega playlist, aplica brand/ticker, inicia LOOP =====
  function load() {
    var url = API + '/api/playlist?clinic=' + encodeURIComponent(CLINIC);
    fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      data = data || {};
      state.playlist = (data.items && data.items.length) ? data.items : [];
      state.brand    = (data.brand && data.brand.name) ? data.brand.name : 'BiOOH';
      state.qrUrl    = data.qrUrl || 'https' + String.fromCharCode(58) + '//biooh.link/checkin';

      // Brand (se existir no HTML)
      var brandEl = $('brandName');
      if (brandEl) brandEl.textContent = state.brand;

      // Ticker (se existir no HTML)
      var flowEl = $('tickerFlow');
      if (flowEl){
        var msgs = (data.ticker && data.ticker.length) ? data.ticker : [
          'Use o QR para check-in e atualizar seus dados.',
          'Anote 3 duvidas para sua consulta.',
          'Hidrate-se com pequenos goles.'
        ];
        var html = '';
        for(var i=0;i<msgs.length;i++){ html += '<span>'+escapeHtml(msgs[i])+'</span>'; }
        flowEl.innerHTML = html + html;
      }

      var
