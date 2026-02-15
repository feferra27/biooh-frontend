(function () {
  // ===== Helpers =====
  function $(id) { return document.getElementById(id); }
  function escapeHtml(s) {
    return String(s || '')
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
      // converte "+" em espaço sem regex para evitar /+/g
      var raw = (kv[1] || '');
      raw = raw.split('+').join(' ');
      var v = decodeURIComponent(raw);
      params[k] = v;
    }
  }

  var CLINIC = params.clinic || 'default';
  var API    = params.api    || '[http://localhost:4000';/]http://localhost:4000';

  // ===== Carregar playlist e mostrar 1º item (versão mínima) =====
  function load() {
    var url = API + '/api/playlist?clinic=' + encodeURIComponent(CLINIC);
    fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      data = data || {};
      var items = (data.items && data.items.length) ? data.items : [];
      var screen = $('screen');
      if (!screen) return;

      if (!items.length) {
        screen.innerHTML =
          '<div style="display:grid;place-content:center;height:100%;text-align:center;padding:24px">' +
            '<h2>Sem conteúdo publicado</h2>' +
            '<p class="lead" style="color:#5B677A">Use o Admin (Template: Diabetes) e recarregue.</p>' +
          '</div>';
        return;
      }

      var item = items[0] || {};
      var html = '<div class="slide active" style="padding:24px">' +
                   '<h2 style="margin:0 0 8px;font-size:32px;font-weight:900;color:#1649B4">' +
                     escapeHtml(item.title || 'Slide') +
                   '</h2>' +
                   (item.lead ? '<p class="lead" style="color:#5B677A">' + escapeHtml(item.lead) + '</p>' : '') +
                 '</div>';
      screen.innerHTML = html;
    }).catch(function (e) {
      console.error(e);
      var screen = $('screen');
      if (screen) {
        screen.innerHTML =
          '<div style="display:grid;place-content:center;height:100%;text-align:center;padding:24px">' +
            '<h2>Erro ao carregar</h2>' +
            '<p class="lead" style="color:#5B677A">Verifique a URL do backend e recarregue.</p>' +
          '</div>';
      }
    });
  }

  // ===== Relógio (opcional) =====
  function updateClock() {
    var el = $('clock');
    if (!el) return;
    var d = new Date();
    el.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  setInterval(updateClock, 1000);
  updateClock();

  window.addEventListener('load', load);
})();
