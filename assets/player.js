(function () {
  function $(id) { return document.getElementById(id); }
  function escapeHtml(s){
    return String(s||'')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  var params = {};
  var search = location.search.substring(1);
  if (search) {
    search.split('&').forEach(function(pair) {
      var kv = pair.split('=');
      params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
    });
  }

  var CLINIC = params.clinic || 'default';
  var API = params.api || 'http://localhost:4000';

  var state = { playlist: [], idx: -1, timer: null, brand: 'BiOOH' };

  // CONTEÚDO PADRÃO COM ILUSTRAÇÕES BONITAS
  var DEFAULT_CONTENT = [
    {
      type: 'imageText',
      title: 'Bem-vindo! A sua consulta começa agora',
      lead: 'Use a espera para organizar sua saúde e aproveitar melhor o tempo com a equipe clínica.',
      bullets: [
        'Atualize sintomas, histórico e medicamentos',
        'Registre dúvidas importantes',
        'Anote metas pessoais de saúde'
      ],
      badge: 'Check-in',
      // SVG embutido ao invés de imagem externa
      useSvg: true,
      svgContent: '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#60A5FA;stop-opacity:1" /><stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" /></linearGradient></defs><circle cx="200" cy="200" r="180" fill="url(#grad1)" opacity="0.1"/><circle cx="200" cy="200" r="120" fill="url(#grad1)" opacity="0.2"/><path d="M200 100 L250 150 L200 200 L150 150 Z" fill="#3B82F6"/><circle cx="200" cy="200" r="40" fill="#60A5FA"/><text x="200" y="340" font-size="48" fill="#1F3A8A" text-anchor="middle" font-weight="bold">🏥</text></svg>',
      duration: 16000
    },
    {
      type: 'imageText',
      title: '❤️ Você sabia?',
      lead: 'O seu coração bate cerca de 100 mil vezes por dia e bombeia 7.500 litros de sangue.',
      bullets: [
        'Trabalha 24 horas sem descanso',
        'Cada batida impulsiona sangue para todo corpo',
        'Com cuidados, pode durar 80+ anos saudável'
      ],
      badge: 'Curiosidade',
      useSvg: true,
      svgContent: '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="heart-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#EF4444;stop-opacity:1" /><stop offset="100%" style="stop-color:#DC2626;stop-opacity:1" /></linearGradient></defs><circle cx="200" cy="200" r="180" fill="#FEE2E2"/><path d="M200 280 C150 240, 120 200, 120 160 C120 120, 160 100, 200 140 C240 100, 280 120, 280 160 C280 200, 250 240, 200 280 Z" fill="url(#heart-grad)" stroke="#B91C1C" stroke-width="4"/><circle cx="170" cy="150" r="8" fill="#FCA5A5" opacity="0.7"/><text x="200" y="360" font-size="36" fill="#991B1B" text-anchor="middle" font-weight="bold">100.000 batidas/dia</text></svg>',
      duration: 15000
    },
    {
      type: 'imageText',
      title: '⚠️ Sinais de alerta de infarto',
      lead: 'Se sentir esses sintomas, procure atendimento IMEDIATAMENTE:',
      bullets: [
        '💔 Dor ou pressão forte no peito',
        '🫁 Falta de ar súbita e intensa',
        '💪 Dor no braço esquerdo, mandíbula ou costas',
        '💦 Suor frio, náusea ou tontura'
      ],
      badge: 'URGENTE - LIGUE 192',
      useSvg: true,
      svgContent: '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="alert-grad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#FCA5A5;stop-opacity:1" /><stop offset="100%" style="stop-color:#FEE2E2;stop-opacity:1" /></linearGradient></defs><rect width="400" height="400" fill="url(#alert-grad)"/><polygon points="200,80 320,320 80,320" fill="#DC2626" opacity="0.9"/><polygon points="200,100 300,300 100,300" fill="#EF4444"/><text x="200" y="220" font-size="120" fill="white" text-anchor="middle" font-weight="bold">!</text><text x="200" y="370" font-size="32" fill="#991B1B" text-anchor="middle" font-weight="bold">LIGUE 192</text></svg>',
      duration: 18000
    },
    {
      type: 'imageText',
      title: '🧪 ECG: Rápido e fundamental',
      lead: 'O eletrocardiograma mede a atividade elétrica do coração. É rápido, indolor e essencial.',
      bullets: [
        'Detecta arritmias e bloqueios cardíacos',
        'Identifica sinais de infartos anteriores',
        'Avalia ritmo e condução elétrica',
        'Exame rápido: apenas 5-10 minutos'
      ],
      badge: 'Exame',
      useSvg: true,
      svgContent: '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ecg-grad"><stop offset="0%" style="stop-color:#DBEAFE" /><stop offset="100%" style="stop-color:#93C5FD" /></linearGradient></defs><rect width="400" height="400" fill="url(#ecg-grad)"/><path d="M50 200 L100 200 L120 150 L140 250 L160 180 L180 200 L350 200" stroke="#1E40AF" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="200" cy="200" r="60" fill="none" stroke="#3B82F6" stroke-width="4"/><text x="200" y="340" font-size="36" fill="#1E3A8A" text-anchor="middle" font-weight="bold">ECG</text></svg>',
      duration: 15000
    },
    {
      type: 'imageText',
      title: '🏃 Movimente-se diariamente!',
      lead: 'Caminhar 30 minutos por dia, 5 vezes por semana, reduz em 30% o risco cardiovascular.',
      bullets: [
        'Comece devagar e aumente gradualmente',
        'Escolha atividades que você goste',
        'Consulte seu médico antes de iniciar',
        'Exercícios leves já fazem grande diferença'
      ],
      badge: 'Prevenção',
      useSvg: true,
      svgContent: '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="run-grad"><stop offset="0%" style="stop-color:#D1FAE5" /><stop offset="100%" style="stop-color:#6EE7B7" /></linearGradient></defs><rect width="400" height="400" fill="url(#run-grad)"/><circle cx="180" cy="120" r="30" fill="#059669"/><path d="M180 150 L180 240 M180 180 L140 200 M180 180 L220 200 M180 240 L150 320 M180 240 L210 320" stroke="#059669" stroke-width="8" stroke-linecap="round"/><text x="200" y="370" font-size="32" fill="#065F46" text-anchor="middle" font-weight="bold">30 min/dia</text></svg>',
      duration: 15000
    },
    {
      type: 'imageText',
      title: '🍽️ Alimentos amigos do coração',
      lead: 'Inclua esses alimentos no seu dia a dia:',
      bullets: [
        '🫐 Frutas vermelhas - Antioxidantes',
        '🐟 Peixes (salmão) - Ômega-3',
        '🫒 Azeite de oliva - Gorduras boas',
        '🥜 Nozes e castanhas - Proteção'
      ],
      badge: 'Nutrição',
      useSvg: true,
      svgContent: '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="food-grad"><stop offset="0%" style="stop-color:#FEF3C7" /><stop offset="100%" style="stop-color:#FCD34D" /></linearGradient></defs><rect width="400" height="400" fill="url(#food-grad)"/><circle cx="150" cy="150" r="40" fill="#DC2626"/><circle cx="250" cy="150" r="40" fill="#0EA5E9"/><circle cx="150" cy="250" r="40" fill="#10B981"/><circle cx="250" cy="250" r="40" fill="#F59E0B"/><text x="200" y="350" font-size="28" fill="#92400E" text-anchor="middle" font-weight="bold">Alimentos saudáveis</text></svg>',
      duration: 18000
    },
    {
      type: 'imageText',
      title: '🛌 Qualidade do sono importa',
      lead: 'Dormir menos de 6 horas aumenta risco de hipertensão.',
      bullets: [
        'Estabeleça rotina regular de sono',
        'Evite telas 1h antes de dormir',
        'Quarto escuro, silencioso e fresco',
        'Evite cafeína após 16h'
      ],
      badge: 'Importante',
      useSvg: true,
      svgContent: '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sleep-grad"><stop offset="0%" style="stop-color:#E0E7FF" /><stop offset="100%" style="stop-color:#A5B4FC" /></linearGradient></defs><rect width="400" height="400" fill="url(#sleep-grad)"/><circle cx="200" cy="180" r="80" fill="#4F46E5" opacity="0.8"/><path d="M240 160 Q260 180 240 200" fill="#818CF8"/><path d="M260 140 Q280 160 260 180" fill="#818CF8"/><path d="M280 120 Q300 140 280 160" fill="#818CF8"/><text x="200" y="340" font-size="32" fill="#3730A3" text-anchor="middle" font-weight="bold">7-8h por noite</text></svg>',
      duration: 15000
    },
    {
      type: 'imageText',
      title: '🩺 Ecocardiograma',
      lead: 'Ultrassom do coração. Indolor e sem radiação.',
      bullets: [
        'Avalia válvulas cardíacas',
        'Mede força de bombeamento',
        'Detecta problemas estruturais',
        'Totalmente seguro e indolor'
      ],
      badge: 'Exame',
      useSvg: true,
      svgContent: '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="#F0F9FF"/><circle cx="200" cy="200" r="100" fill="none" stroke="#0284C7" stroke-width="4"/><circle cx="200" cy="200" r="70" fill="none" stroke="#0EA5E9" stroke-width="3"/><circle cx="200" cy="200" r="40" fill="none" stroke="#38BDF8" stroke-width="2"/><path d="M200 120 L200 280 M120 200 L280 200" stroke="#0284C7" stroke-width="2"/><text x="200" y="350" font-size="30" fill="#075985" text-anchor="middle" font-weight="bold">Ecocardiograma</text></svg>',
      duration: 15000
    },
    {
      type: 'imageText',
      title: '🧘 Técnica 4-7-8',
      lead: 'Respiração para reduzir estresse:',
      bullets: [
        '4️⃣ Inspire pelo nariz (4 segundos)',
        '7️⃣ Segure a respiração (7 segundos)',
        '8️⃣ Expire pela boca (8 segundos)',
        '🔄 Repita 3-4 vezes'
      ],
      badge: 'Bem-estar',
      useSvg: true,
      svgContent: '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="breath-grad"><stop offset="0%" style="stop-color:#D1FAE5" /><stop offset="100%" style="stop-color:#A7F3D0" /></linearGradient></defs><rect width="400" height="400" fill="url(#breath-grad)"/><circle cx="200" cy="150" r="60" fill="#10B981" opacity="0.3"/><circle cx="200" cy="200" r="60" fill="#10B981" opacity="0.5"/><circle cx="200" cy="250" r="60" fill="#10B981" opacity="0.7"/><text x="200" y="350" font-size="48" fill="#065F46" text-anchor="middle" font-weight="bold">4-7-8</text></svg>',
      duration: 16000
    }
  ];

  function hideLoading() {
    var loading = $('initialLoading');
    if (loading) loading.style.display = 'none';
  }

  function showScreen() {
    var screen = $('screen');
    if (screen) {
      screen.style.display = 'block';
      screen.classList.add('ready');
    }
  }

  function load() {
    var timeoutId = setTimeout(function() {
      useDefaultContent();
    }, 5000);
    
    var url = API + '/api/playlist?clinic=' + encodeURIComponent(CLINIC);
    
    fetch(url)
      .then(function(r) { 
        clearTimeout(timeoutId);
        if (!r.ok) throw new Error('Backend error');
        return r.json(); 
      })
      .then(function(data) {
        clearTimeout(timeoutId);
        
        if (!data || !data.items || !data.items.length) {
          useDefaultContent();
          return;
        }
        
        state.playlist = data.items;
        state.brand = (data.brand && data.brand.name) || 'BiOOH';
        
        updateBranding();
        updateTicker(data.ticker);
        hideLoading();
        showScreen();
        nextSlide();
      })
      .catch(function(e) {
        clearTimeout(timeoutId);
        useDefaultContent();
      });
  }

  function useDefaultContent() {
    state.playlist = DEFAULT_CONTENT;
    state.brand = 'BiOOH';
    
    updateBranding();
    updateTicker(['Bem-vindo', 'Saúde em primeiro lugar', 'Estamos aqui para você']);
    
    hideLoading();
    showScreen();
    nextSlide();
  }

  function updateBranding() {
    var brandEl = $('brandName');
    if (brandEl) brandEl.textContent = state.brand;
  }

  function updateTicker(msgs) {
    var flowEl = $('tickerFlow');
    if (!flowEl) return;
    
    if (!msgs || !msgs.length) msgs = ['Bem-vindo', 'Saúde'];
    
    var html = '';
    for(var i=0; i<msgs.length; i++){ 
      html += '<span>'+escapeHtml(msgs[i])+'</span>'; 
    }
    flowEl.innerHTML = html + html;
  }

  function mountSlide(item){
    var screen = $('screen');
    if (!screen) return;
    screen.innerHTML = '';
    if (!item) return;

    var s = document.createElement('div');
    s.className = 'slide active';

    var bulletsHtml = '';
    if (item.bullets && item.bullets.length){
      var li = [];
      for (var i=0; i<item.bullets.length; i++){ 
        li.push('<li>'+escapeHtml(item.bullets[i])+'</li>'); 
      }
      bulletsHtml = '<ul class="bul">'+li.join('')+'</ul>';
    }
    
    // Hero com SVG ou imagem
    var heroContent = '';
    if (item.useSvg && item.svgContent) {
      heroContent = item.svgContent;
    } else if (item.image) {
      heroContent = '<img src="'+escapeHtml(item.image)+'" alt="'+escapeHtml(item.title)+'" style="width:100%;height:100%;object-fit:cover">';
    } else {
      heroContent = '<div style="display:grid;place-content:center;height:100%;font-size:80px">💙</div>';
    }
    
    s.innerHTML =
      '<div class="two">'+
        '<div>'+
          '<div class="title-xl">'+ escapeHtml(item.title||'') +'</div>'+
          (item.lead ? '<p class="lead">'+ escapeHtml(item.lead) +'</p>' : '')+
          bulletsHtml+
          (item.badge ? '<span class="badge">'+ escapeHtml(item.badge) +'</span>' : '')+
        '</div>'+
        '<div class="hero">'+ heroContent +'</div>'+
      '</div>';

    screen.appendChild(s);
  }

  function nextSlide() {
    clearTimeout(state.timer);
    if (!state.playlist.length) return;

    state.idx = (state.idx + 1) % state.playlist.length;
    var item = state.playlist[state.idx];
    
    mountSlide(item);

    var dur = item.duration || 15000;
    state.timer = setTimeout(nextSlide, dur);
  }

  function updateClock() {
    var el = $('clock');
    if (!el) return;
    var d = new Date();
    el.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  setInterval(updateClock, 1000);
  updateClock();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
