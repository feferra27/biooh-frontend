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

  var state = {
    playlist: [],
    idx: -1,
    timer: null,
    brand: 'BiOOH'
  };

  // Conteúdo padrão rico
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
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80',
      fallbackColor: '#EEF6FF',
      fallbackEmoji: '🏥',
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
      image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=1200&q=80',
      fallbackColor: '#FEE2E2',
      fallbackEmoji: '❤️',
      duration: 15000
    },
    {
      type: 'imageText',
      title: '⚠️ Reconheça os sinais de infarto',
      lead: 'Se sentir esses sintomas, procure atendimento médico IMEDIATAMENTE:',
      bullets: [
        '💔 Dor ou pressão forte no peito',
        '🫁 Falta de ar súbita e intensa',
        '💪 Dor no braço esquerdo, mandíbula ou costas',
        '💦 Suor frio, náusea ou tontura'
      ],
      badge: 'URGENTE - LIGUE 192',
      image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1200&q=80',
      fallbackColor: '#FEE2E2',
      fallbackEmoji: '⚠️',
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
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80',
      fallbackColor: '#DBEAFE',
      fallbackEmoji: '🧪',
      duration: 15000
    },
    {
      type: 'imageText',
      title: '🏃 Movimente-se diariamente!',
      lead: 'Caminhar 30 minutos por dia, 5 vezes por semana, reduz em até 30% o risco cardiovascular.',
      bullets: [
        'Comece devagar e aumente gradualmente',
        'Escolha atividades que você goste',
        'Consulte seu médico antes de iniciar',
        'Exercícios leves já fazem grande diferença'
      ],
      badge: 'Prevenção',
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1200&q=80',
      fallbackColor: '#D1FAE5',
      fallbackEmoji: '🏃',
      duration: 15000
    },
    {
      type: 'imageText',
      title: '🍽️ Alimentos amigos do coração',
      lead: 'Inclua esses alimentos no seu dia a dia para proteger seu sistema cardiovascular:',
      bullets: [
        '🫐 Frutas vermelhas - Ricos em antioxidantes',
        '🐟 Peixes (salmão, sardinha) - Ômega-3 anti-inflamatório',
        '🫒 Azeite de oliva extra virgem - Gorduras saudáveis',
        '🥜 Nozes, castanhas e amêndoas - Proteção cardíaca'
      ],
      badge: 'Nutrição',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80',
      fallbackColor: '#FEF3C7',
      fallbackEmoji: '🍽️',
      duration: 18000
    },
    {
      type: 'imageText',
      title: '🛌 A qualidade do seu sono importa',
      lead: 'Dormir menos de 6 horas por noite aumenta significativamente o risco de hipertensão.',
      bullets: [
        'Estabeleça uma rotina regular de sono',
        'Evite telas pelo menos 1 hora antes de dormir',
        'Mantenha o quarto escuro, silencioso e fresco',
        'Evite cafeína depois das 16h'
      ],
      badge: 'Importante',
      image: 'https://images.unsplash.com/photo-1541480551145-2370a440d585?w=1200&q=80',
      fallbackColor: '#E0E7FF',
      fallbackEmoji: '🛌',
      duration: 15000
    },
    {
      type: 'imageText',
      title: '🩺 Ecocardiograma: Ultrassom do coração',
      lead: 'Exame que avalia válvulas, fluxo sanguíneo e força de bombeamento. Indolor e sem radiação.',
      bullets: [
        'Avalia funcionamento das válvulas cardíacas',
        'Mede a força de bombeamento do coração',
        'Detecta problemas estruturais precocemente',
        'Procedimento totalmente seguro e indolor'
      ],
      badge: 'Exame',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&q=80',
      fallbackColor: '#DBEAFE',
      fallbackEmoji: '🩺',
      duration: 15000
    },
    {
      type: 'imageText',
      title: '🧘 Técnica de respiração 4-7-8',
      lead: 'Estresse constante aumenta a pressão arterial. Pratique esta técnica simples:',
      bullets: [
        '4️⃣ Inspire profundamente pelo nariz (4 segundos)',
        '7️⃣ Segure a respiração com calma (7 segundos)',
        '8️⃣ Expire completamente pela boca (8 segundos)',
        '🔄 Repita o ciclo 3-4 vezes quando sentir estresse'
      ],
      badge: 'Bem-estar',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80',
      fallbackColor: '#D1FAE5',
      fallbackEmoji: '🧘',
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
    console.log('Carregando playlist...');
    
    var timeoutId = setTimeout(function() {
      console.log('Usando conteúdo padrão');
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
        console.log('Dados recebidos:', data);
        
        if (!data || !data.items || !data.items.length) {
          console.log('Sem items, usando padrão');
          useDefaultContent();
          return;
        }
        
        // Adicionar fallback colors aos items do backend
        data.items = data.items.map(function(item) {
          if (!item.fallbackColor) item.fallbackColor = '#EEF6FF';
          if (!item.fallbackEmoji) item.fallbackEmoji = '💙';
          return item;
        });
        
        state.playlist = data.items;
        state.brand = (data.brand && data.brand.name) || 'BiOOH';
        
        updateBranding();
        updateTicker(data.ticker);
        hideLoading();
        showScreen();
        nextSlide();
      })
      .catch(function(e) {
        console.error('Erro:', e);
        clearTimeout(timeoutId);
        useDefaultContent();
      });
  }

  function useDefaultContent() {
    state.playlist = DEFAULT_CONTENT;
    state.brand = 'BiOOH';
    
    updateBranding();
    updateTicker([
      'Bem-vindo à nossa clínica',
      'Sua saúde é nossa prioridade',
      'Estamos aqui para cuidar de você'
    ]);
    
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
    
    if (!msgs || !msgs.length) {
      msgs = ['Bem-vindo', 'Saúde em primeiro lugar', 'Cuidado com você'];
    }
    
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

    console.log('Montando:', item.title);

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
    
    // Hero com fallback visual bonito
    var heroContent = '';
    if (item.image) {
      var fallbackBg = item.fallbackColor || '#EEF6FF';
      var fallbackIcon = item.fallbackEmoji || '💙';
      
      heroContent = 
        '<img src="'+escapeHtml(item.image)+'" '+
        'alt="'+escapeHtml(item.title)+'" '+
        'onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'grid\'" '+
        'onload="this.parentElement.classList.remove(\'loading\')"'+
        '>'+
        '<div class="hero-fallback" style="display:none;background:'+fallbackBg+';grid-template-rows:1fr auto;padding:40px;text-align:center;">'+
          '<div style="font-size:120px;line-height:1">'+fallbackIcon+'</div>'+
          '<div style="font-size:18px;font-weight:600;color:#374151;margin-top:20px">'+escapeHtml(item.title)+'</div>'+
        '</div>';
    } else {
      var fallbackBg = item.fallbackColor || '#EEF6FF';
      var fallbackIcon = item.fallbackEmoji || '💙';
      heroContent = 
        '<div class="hero-fallback" style="display:grid;background:'+fallbackBg+';grid-template-rows:1fr auto;padding:40px;text-align:center;">'+
          '<div style="font-size:120px;line-height:1">'+fallbackIcon+'</div>'+
          '<div style="font-size:18px;font-weight:600;color:#374151;margin-top:20px">'+escapeHtml(item.title)+'</div>'+
        '</div>';
    }
    
    s.innerHTML =
      '<div class="two">'+
        '<div>'+
          '<div class="title-xl">'+ escapeHtml(item.title||'') +'</div>'+
          (item.lead ? '<p class="lead">'+ escapeHtml(item.lead) +'</p>' : '')+
          bulletsHtml+
          (item.badge ? '<span class="badge">'+ escapeHtml(item.badge) +'</span>' : '')+
        '</div>'+
        '<div class="hero loading">'+ heroContent +'</div>'+
      '</div>';

    screen.appendChild(s);
  }

  function nextSlide() {
    clearTimeout(state.timer);
    if (!state.playlist.length) return;

    state.idx = (state.idx + 1) % state.playlist.length;
    var item = state.playlist[state.idx];
    
    console.log('Slide', (state.idx + 1), '/', state.playlist.length);
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


