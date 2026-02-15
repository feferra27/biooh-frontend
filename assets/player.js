// Player de Sala de Espera — BiOOH Patient Clean (versão resiliente)

// Utilitários
const {{0-raw-markdown-2e22f34e-e3b1-4e1c-bf52-6ca63684602a}}nbsp; = (q, el = document) => el.querySelector(q);
const $ = (q, el = document) => [...el.querySelectorAll(q)];

// Parâmetros da URL
const params = new URLSearchParams(location.search);
const CLINIC = params.get('clinic') || 'default';
const API    = params.get('api')    || '[http://localhost:4000';/]http://localhost:4000';

// Estado global simples
const state = {
  playlist: [],
  idx: -1,
  timer: null,
  qrUrl: null,     // guardamos o qrUrl da clínica para usar nos slides
  brand: 'BiOOH'
};

// Carrega playlist do backend, atualiza topo/ticker e inicia ciclo
async function loadPlaylist(){
  try{
    const r = await fetch(${API}/api/playlist?clinic=${encodeURIComponent(CLINIC)});
    const data = await r.json();

    state.playlist = Array.isArray(data.items) ? data.items : [];
    state.qrUrl    = data.qrUrl || 'https://biooh.link/checkin';
    state.brand    = (data.brand && data.brand.name) ? data.brand.name : 'BiOOH';

    // Atualiza nome da clínica (se o elemento existir no HTML)
    const brandEl = $('#brandName');
    if (brandEl) brandEl.textContent = state.brand;

    // Atualiza ticker (se existir)
    const flowEl = $('#tickerFlow');
    if (flowEl){
      const msgs = (Array.isArray(data.ticker) && data.ticker.length)
        ? data.ticker
        : [
            'Use o QR para check‑in e atualizar seus dados.',
            'Anote 3 dúvidas para sua consulta.',
            'Hidrate-se com pequenos goles.'
          ];
      flowEl.innerHTML = msgs.map(t => &lt;span&gt;${t}&lt;/span&gt;).join('');
      // duplica para fluxo contínuo
      flowEl.innerHTML += flowEl.innerHTML;
    }

    // Se não houver itens, mostra aviso amigável e não inicia o ciclo
    if (!state.playlist.length){
      const screen = $('#screen');
      if (screen){
        screen.innerHTML = </span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;div class="center" style="display:grid;place-content:center;height:100%;text-align:center;padding:24px"&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;h2 style="margin:0 0 8px"&gt;Sem conteúdo publicado&lt;/h2&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;p class="lead" style="max-width:720px;margin:0 auto;color:#5B677A"&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Publique uma playlist pelo Admin (Template: Diabetes) e recarregue esta página.</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;/p&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;/div&gt;;
      }
      return;
    }

    // Inicia rotação de slides
    nextSlide();
  }catch(e){
    console.error('Falha ao carregar playlist:', e);
    // Feedback mínimo em caso de erro de rede
    const screen = $('#screen');
    if (screen){
      screen.innerHTML = </span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;div class="center" style="display:grid;place-content:center;height:100%;text-align:center;padding:24px"&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;h2 style="margin:0 0 8px"&gt;Erro ao carregar&lt;/h2&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;p class="lead" style="max-width:720px;margin:0 auto;color:#5B677A"&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Verifique a conexão com o backend e recarregue (Ctrl/⌘ + R).</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;/p&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;/div&gt;;
    }
  }
}

// Monta um slide na tela
function mountSlide(item){
  const screen = $('#screen');
  if (!screen) return;
  screen.innerHTML = '';

  if (!item) return; // proteção extra

  const s = document.createElement('div');
  s.className = 'slide active';

  if(item.type === 'imageText'){
    // QR fica dentro do slide; depois de inserir no DOM, preenchemos a URL
    s.innerHTML = </span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;div class="two"&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;div&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;div class="title-xl"&gt;${item.title || ''}&lt;/div&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${item.lead ? <p class="lead">${item.lead}</p>: ''}</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${Array.isArray(item.bullets) ?<ul class="bul">${item.bullets.map(b => &lt;li&gt;${b}&lt;/li&gt;).join('')}</ul>: ''}</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${item.badge ?<span class="badge">${item.badge}</span>: ''}</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${item.qr !== false ?
            <div class="qrbox" style="margin-top:12px">
              <div style="font-weight:700">Aponte a câmera para abrir</div>
              <div class="qrgrid" aria-hidden="true">${'<span></span>'.repeat(36)}</div>
              <div class="qrurl" id="qrurl"></div>
            </div>: ''}</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;/div&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;div class="hero"&gt;${item.image ?<img src="${item.image}" alt="${item.alt || ''}"/> : ''}&lt;/div&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;/div&gt;;

    // Preenche o texto do QR com o hostname do link (se existir o elemento no slide)
    const qrEl = s.querySelector('#qrurl');
    if (qrEl){
      const url = (item.qrUrl || state.qrUrl || '').toString();
      qrEl.textContent = url.replace(/^https?:///, '');
    }
  }
  else if(item.type === 'video'){
    s.innerHTML = </span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;div class="two"&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;div&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;div class="title-xl"&gt;${item.title || ''}&lt;/div&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${item.lead ? <p class="lead">${item.lead}</p>: ''}</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${Array.isArray(item.bullets) ?<ul class="bul">${item.bullets.map(b => &lt;li&gt;${b}&lt;/li&gt;).join('')}</ul> : ''}</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;/div&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;div class="hero"&gt;&lt;video id="v" autoplay muted playsinline src="${item.src || ''}"&gt;&lt;/video&gt;&lt;/div&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;/div&gt;;
    const v = s.querySelector('#v');
    if (v) v.addEventListener('ended', () => nextSlide());
  }
  else if(item.type === 'quiz'){
    s.innerHTML = </span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;div class="slide quiz"&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;div class="two"&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;div&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;span class="badge"&gt;Quiz&lt;/span&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;div class="title-xl" style="margin-top:8px"&gt;${item.question || ''}&lt;/div&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;div class="options"&gt;${(item.options || []).map(o =&gt; <div class="opt">${o}</div>).join('')}&lt;/div&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;div class="reveal"&gt;Resposta: &lt;strong&gt;${item.answer || ''}&lt;/strong&gt;. ${item.explain || ''}&lt;/div&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;/div&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;div class="hero"&gt;${item.image ? <img src="${item.image}"> : ''}&lt;/div&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;/div&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;/div&gt;;
    setTimeout(() => s.classList.add('revealed'), item.revealMs || 6000);
  }
  else {
    // Tipo desconhecido: não quebra, apenas informa
    s.innerHTML = </span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;div class="center" style="display:grid;place-content:center;height:100%;text-align:center;padding:24px"&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;h2 style="margin:0 0 8px"&gt;Conteúdo não suportado&lt;/h2&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;p class="lead" style="max-width:720px;margin:0 auto;color:#5B677A"&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Tipo: &lt;code&gt;${String(item.type)}&lt;/code&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;/p&gt;</span></div><div class="scriptor-paragraph"><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1771113300000,&quot;dataSource&quot;:0}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;/div&gt;;
  }

  screen.appendChild(s);
}

// Avança para o próximo slide com timer
function nextSlide(){
  clearTimeout(state.timer);

  if (!state.playlist.length){
    // Nada a exibir
    return;
  }

  state.idx = (state.idx + 1) % state.playlist.length;
  const item = state.playlist[state.idx];

  mountSlide(item);

  const dur = item && item.type === 'video'
    ? (item.duration || 20000)
    : (item && item.duration) ? item.duration : 16000;

  // Avança automaticamente (vídeo avança no onended)
  if (item && item.type !== 'video'){
    state.timer = setTimeout(nextSlide, dur);
  }

  // Telemetria básica
  track('slide_impression', { idx: state.idx, id: item?.id || null, type: item?.type || 'unknown' });
}

// Relógio do cabeçalho
function updateClock(){
  const el = $('#clock');
  if (!el) return;
  const d = new Date();
  el.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateClock, 1000);
updateClock();

// Telemetria (não bloqueante)
function track(evt, payload){
  try{
    fetch(${API}/api/analytics, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clinic: CLINIC, evt, payload, ts: Date.now() })
    });
  }catch(_){}
}

// Inicializa quando a página carregar
window.addEventListener('load', loadPlaylist);
