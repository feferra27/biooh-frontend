<script>
// ===== Player mínimo (ES5) — só para validar montagem de slides =====

// Helpers simples
function $(q, root){ return (root||document).querySelector(q); }
function escapeHtml(s){ return String(s||'')
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

// Parser de query (sem regex sensível)
var search = (location.search||'');
if (search && search.charAt(0) === '?') search = search.slice(1);
var params = {};
if (search){
  var pairs = search.split('&');
  for (var i=0;i<pairs.length;i++){
    if (!pairs[i]) continue;
    var kv = pairs[i].split('=');
    var k = decodeURIComponent(kv[0]||'');
    var v = decodeURIComponent((kv[1]||'').replace(/+/g,' '));
    params[k] = v;
  }
}

var CLINIC = params.clinic || 'default';
var API    = params.api    || '[http://localhost:4000';/]http://localhost:4000';

// Estado
var state = { playlist: [], idx: -1, timer: null };

// Carrega playlist e monta UM slide simples (sem ticker/brand/QR)
function loadPlaylist(){
  var url = API + '/api/playlist?clinic=' + encodeURIComponent(CLINIC);
  fetch(url).then(function(r){ return r.json(); }).then(function(data){
    data = data || {};
    state.playlist = (data.items && data.items.length) ? data.items : [];

    var screen = $('#screen');
    if (!screen) return;

    if (!state.playlist.length){
      screen.innerHTML = '<div style="display:grid;place-content:center;height:100%;text-align:center;padding:24px">'
        + '<h2>Nenhum item na playlist</h2>'
        + '<p class="lead" style="color:#5B677A">Use o Admin para publicar (Template: Diabetes) e recarregue.</p>'
        + '</div>';
      return;
    }

    // Monta apenas o primeiro item de forma simplificada
    var item = state.playlist[0] || {};
    var html = '<div class="slide active" style="padding:36px">'
      + '<div class="title-xl" style="font-size:32px;font-weight:900;color:#1649B4">'
      + escapeHtml(item.title || 'Slide de Teste') + '</div>'
      + (item.lead ? '<p class="lead" style="color:#5B677A">' + escapeHtml(item.lead) + '</p>' : '')
      + '</div>';

    screen.innerHTML = html;
  }).catch(function(e){
    console.error('Falha ao carregar:', e);
    var screen = $('#screen');
    if (screen){
      screen.innerHTML = '<div style="display:grid;place-content:center;height:100%;text-align:center;padding:24px">'
        + '<h2>Erro ao carregar</h2>'
        + '<p class="lead" style="color:#5B677A">Verifique a URL do backend e recarregue.</p>'
        + '</div>';
    }
  });
}

// Relógio (opcional)
function updateClock(){
  var el = document.getElementById('clock');
  if (!el) return;
  var d = new Date();
  el.textContent = d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}
setInterval(updateClock, 1000); updateClock();

window.addEventListener('load', loadPlaylist);
</script>
