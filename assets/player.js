(function () {
  function $(id) { return document.getElementById(id); }
  function $qs(sel, root){ return (root||document).querySelector(sel); }
  function escapeHtml(s){
    return String(s||'')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function imgTag(src, alt){
    if(!src) return '';
    return '<img src="'+escapeHtml(src)+'" alt="'+escapeHtml(alt||'')+'" onerror="handleImageError(this)" onload="handleImageLoad(this)">';
  }

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

  var state = {
    playlist: [],
    idx: -1,
    timer: null,
    brand: 'BiOOH',
    qrUrl: 'https://biooh.link/checkin'
  };

  // CONTEÚDO CARDIOLÓGICO PROFISSIONAL (9 slides)
  var DEFAULT_CONTENT = [
    // SLIDE 1: Bem-vindo
    {
      type: 'imageText',
      title: 'Bem-vindo à Cardiologia',
      lead: 'Sua saúde cardiovascular é nossa prioridade. Aqui você encontra informações essenciais para cuidar do seu coração.',
      bullets: [
        'Equipe especializada em cardiologia',
        'Exames avançados de diagnóstico',
        'Prevenção e tratamento personalizado',
        'Acompanhamento contínuo'
      ],
      badge: 'Cardiologia',
      image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=1200&q=80',
      alt: 'Coração saudável',
      duration: 16000
    },

    // SLIDE 2: Fato Rápido sobre o Coração
    {
      type: 'fact',
      icon: '❤️',
      title: 'Você sabia?',
      fact: 'O seu coração bate cerca de 100 mil vezes por dia',
      subtitle: 'E trabalha sem parar para manter seu corpo funcionando.',
      stats: [
        { label: 'Batidas/dia', value: '100.000' },
        { label: 'Litros/dia', value: '7.500' },
        { label: 'Anos de vida', value: '80+' }
      ],
      image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200&q=80',
      duration: 14000
    },

    // SLIDE 3: Sinais de Alerta de Infarto
    {
      type: 'alert',
      title: '⚠️ Reconheça os sinais de infarto',
      lead: 'Se sentir esses sintomas, procure atendimento IMEDIATAMENTE.',
      alerts: [
        { icon: '💔', text: 'Dor ou pressão forte no peito' },
        { icon: '🫁', text: 'Falta de ar súbita' },
        { icon: '💪', text: 'Dor no braço esquerdo, mandíbula ou costas' },
        { icon: '💦', text: 'Suor frio, náusea ou tontura intensa' }
      ],
      footer: 'LIGUE 192 OU VÁ AO PRONTO-SOCORRO',
      image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1200&q=80',
      duration: 18000
    },

    // SLIDE 4: O que é um ECG
    {
      type: 'exam',
      icon: '🧪',
      title: 'ECG: Rápido e fundamental',
      subtitle: 'Eletrocardiograma',
      description: 'Um eletrocardiograma mede a atividade elétrica do coração. É rápido, indolor e ajuda a detectar arritmias e bloqueios.',
      benefits: [
        'Detecta arritmias cardíacas',
        'Identifica infartos prévios',
        'Avalia ritmo e condução',
        'Exame rápido (5-10 minutos)'
      ],
      badge: 'Exame',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80',
      duration: 15000
    },

    // SLIDE 5: Atividade Física
    {
      type: 'lifestyle',
      icon: '🏃',
      title: 'Movimente-se!',
      lead: 'O exercício é o melhor remédio para o coração.',
      highlight: 'Caminhar 30 minutos por dia, 5x por semana',
      benefit: 'Reduz em até 30% o risco de doenças cardiovasculares',
      tips: [
        'Comece devagar e aumente gradualmente',
        'Escolha atividades que você goste',
        'Consulte seu médico antes de iniciar',
        'Exercícios leves já fazem diferença'
      ],
      badge: 'Prevenção',
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1200&q=80',
      duration: 15000
    },

    // SLIDE 6: Alimentação Amiga do Coração
    {
      type: 'nutrition',
      icon: '🍽️',
      title: 'Comer bem faz diferença',
      lead: 'Escolhas simples, impacto duradouro.',
      foods: [
        { emoji: '🫐', name: 'Frutas vermelhas', benefit: 'Antioxidantes' },
        { emoji: '🐟', name: 'Peixes ricos em ômega-3', benefit: 'Anti-inflamatório' },
        { emoji: '🫒', name: 'Azeite de oliva', benefit: 'Gordura boa' },
        { emoji: '🥜', name: 'Nozes e castanhas', benefit: 'Proteção cardíaca' }
      ],
      footer: 'Inclua esses alimentos no seu dia a dia',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80',
      duration: 18000
    },

    // SLIDE 7: Sono
    {
      type: 'lifestyle',
      icon: '🛌',
      title: 'Seu sono importa',
      lead: 'A qualidade do sono afeta diretamente a saúde do coração.',
      highlight: 'Dormir menos de 6 horas por noite',
      risk: 'Aumenta o risco de hipertensão e arritmias',
      tips: [
        'Estabeleça uma rotina de sono',
        'Evite telas 1 hora antes de dormir',
        'Mantenha o quarto escuro e fresco',
        'Evite cafeína após 16h'
      ],
      badge: 'Importante',
      image: 'https://images.unsplash.com/photo-1541480551145-2370a440d585?w=1200&q=80',
      duration: 15000
    },

    // SLIDE 8: Ecocardiograma
    {
      type: 'exam',
      icon: '🩺',
      title: 'Ecocardiograma',
      subtitle: 'Ultrassom do Coração',
      description: 'É um ultrassom do coração que avalia válvulas, fluxo sanguíneo e força de bombeamento. Exame indolor e sem radiação.',
      benefits: [
        'Avalia válvulas cardíacas',
        'Mede força de bombeamento',
        'Detecta problemas estruturais',
        'Totalmente indolor'
      ],
      badge: 'Exame',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&q=80',
      duration: 15000
    },

    // SLIDE 9: Reduzindo o Estresse
    {
      type: 'wellness',
      icon: '🧘',
      title: 'Pause e respire',
      lead: 'Estresse constante aumenta a pressão arterial.',
      technique: 'Técnica 4-7-8',
      steps: [
        { num: '4', text: 'Inspire pelo nariz (4 segundos)' },
        { num: '7', text: 'Segure a respiração (7 segundos)' },
        { num: '8', text: 'Expire pela boca (8 segundos)' }
      ],
      extra: [
        'Faça alongamentos leves durante o dia',
        'Reserve momentos de pausa',
        'Pratique gratidão diariamente'
      ],
      badge: 'Bem-estar',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80',
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
    console.log('Iniciando carregamento...');
    
    var url = API + '/api/playlist?clinic=' + encodeURIComponent(CLINIC);
    var timeoutId = setTimeout(function() {
      console.log('Timeout - usando conteúdo cardiológico');
      useDefaultContent();
    }, 5000);
    
    fetch(url)
      .then(function(r) { 
        clearTimeout(timeoutId);
        if (!r.ok) throw new Error('Backend error');
        return r.json(); 
      })
      .then(function(data) {
        console.log('Dados recebidos');
        clearTimeout(timeoutId);
        data = data || {};
        
        if (!data.items || !data.items.length) {
          console.log('Backend vazio - usando conteúdo cardiológico');
          useDefaultContent();
          return;
        }
        
        state.playlist = data.items;
        state.brand = (data.brand && data.brand.name) ? data.brand.name : 'BiOOH';
        state.qrUrl = data.qrUrl || 'https://biooh.link/checkin';

        updateBranding();
        updateTicker(data.ticker);
        hideLoading();
        showScreen();
        
        if (state.playlist.length > 0) {
          nextSlide();
        }
      })
      .catch(function(e) {
        console.error('Erro:', e);
        clearTimeout(timeoutId);
        useDefaultContent();
      });
  }

  function useDefaultContent() {
    console.log('Usando conteúdo cardiológico padrão');
    state.playlist = DEFAULT_CONTENT;
    state.brand = 'BiOOH Cardiologia';
    state.qrUrl = 'https://biooh.link/checkin';
    
    updateBranding();
    updateTicker([
      'Use o QR code para fazer check-in',
      'Consulte regularmente seu cardiologista',
      'Mantenha seus exames em dia',
      'Cuide do seu coração com amor'
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
    if (flowEl) {
      if (!msgs || !msgs.length) {
        msgs = [
          'Cardiologia de excelência',
          'Prevenção salva vidas',
          'Cuide do seu coração'
        ];
      }
      var html = '';
      for(var i=0; i<msgs.length; i++){ 
        html += '<span>'+escapeHtml(msgs[i])+'</span>'; 
      }
      flowEl.innerHTML = html + html;
    }
  }

  function mountSlide(item){
    var screen = $('screen');
    if (!screen) return;
    screen.innerHTML = '';
    if (!item) return;

    var s = document.createElement('div');
    s.className = 'slide active';

    // TIPO: imageText (padrão)
    if (item.type === 'imageText'){
      var bulletsHtml = '';
      if (item.bullets && item.bullets.length){
        var li = [];
        for (var i=0; i<item.bullets.length; i++){ 
          li.push('<li>'+escapeHtml(item.bullets[i])+'</li>'); 
        }
        bulletsHtml = '<ul class="bul">'+li.join('')+'</ul>';
      }
      
      s.innerHTML =
        '<div class="two">'+
          '<div>'+
            '<div class="title-xl">'+ escapeHtml(item.title||'') +'</div>'+
            (item.lead ? '<p class="lead">'+ escapeHtml(item.lead) +'</p>' : '')+
            bulletsHtml+
            (item.badge ? '<span class="badge">'+ escapeHtml(item.badge) +'</span>' : '')+
          '</div>'+
          '<div class="hero loading">'+ imgTag(item.image, item.alt) +'</div>'+
        '</div>';
    }
    
    // TIPO: fact (fato rápido)
    else if (item.type === 'fact'){
      var statsHtml = '';
      if (item.stats && item.stats.length){
        statsHtml = '<div class="stats">';
        for(var i=0; i<item.stats.length; i++){
          var st = item.stats[i];
          statsHtml += '<div class="stat"><div class="stat-value">'+escapeHtml(st.value)+'</div><div class="stat-label">'+escapeHtml(st.label)+'</div></div>';
        }
        statsHtml += '</div>';
      }
      
      s.innerHTML =
        '<div class="two">'+
          '<div>'+
            '<div class="fact-icon">'+ escapeHtml(item.icon||'💡') +'</div>'+
            '<div class="title-xl">'+ escapeHtml(item.title||'') +'</div>'+
            '<div class="fact-box">'+
              '<div class="fact-main">'+ escapeHtml(item.fact||'') +'</div>'+
              (item.subtitle ? '<div class="fact-sub">'+ escapeHtml(item.subtitle) +'</div>' : '')+
            '</div>'+
            statsHtml+
          '</div>'+
          '<div class="hero loading">'+ imgTag(item.image) +'</div>'+
        '</div>';
    }
    
    // TIPO: alert (sinais de alerta)
    else if (item.type === 'alert'){
      var alertsHtml = '';
      if (item.alerts && item.alerts.length){
        alertsHtml = '<div class="alerts">';
        for(var i=0; i<item.alerts.length; i++){
          var al = item.alerts[i];
          alertsHtml += '<div class="alert-item"><span class="alert-icon">'+escapeHtml(al.icon)+'</span><span class="alert-text">'+escapeHtml(al.text)+'</span></div>';
        }
        alertsHtml += '</div>';
      }
      
      s.innerHTML =
        '<div class="two">'+
          '<div>'+
            '<div class="title-xl alert-title">'+ escapeHtml(item.title||'') +'</div>'+
            (item.lead ? '<p class="lead alert-lead">'+ escapeHtml(item.lead) +'</p>' : '')+
            alertsHtml+
            (item.footer ? '<div class="alert-footer">'+ escapeHtml(item.footer) +'</div>' : '')+
          '</div>'+
          '<div class="hero loading">'+ imgTag(item.image) +'</div>'+
        '</div>';
    }
    
    // TIPO: exam (exame médico)
    else if (item.type === 'exam'){
      var benefitsHtml = '';
      if (item.benefits && item.benefits.length){
        benefitsHtml = '<ul class="bul">';
        for(var i=0; i<item.benefits.length; i++){
          benefitsHtml += '<li>'+escapeHtml(item.benefits[i])+'</li>';
        }
        benefitsHtml += '</ul>';
      }
      
      s.innerHTML =
        '<div class="two">'+
          '<div>'+
            '<div class="exam-icon">'+ escapeHtml(item.icon||'🧪') +'</div>'+
            '<div class="title-xl">'+ escapeHtml(item.title||'') +'</div>'+
            (item.subtitle ? '<div class="exam-subtitle">'+ escapeHtml(item.subtitle) +'</div>' : '')+
            (item.description ? '<p class="lead">'+ escapeHtml(item.description) +'</p>' : '')+
            benefitsHtml+
            (item.badge ? '<span class="badge">'+ escapeHtml(item.badge) +'</span>' : '')+
          '</div>'+
          '<div class="hero loading">'+ imgTag(item.image) +'</div>'+
        '</div>';
    }
    
    // TIPO: lifestyle (estilo de vida)
    else if (item.type === 'lifestyle'){
      var tipsHtml = '';
      if (item.tips && item.tips.length){
        tipsHtml = '<ul class="tips">';
        for(var i=0; i<item.tips.length; i++){
          tipsHtml += '<li>'+escapeHtml(item.tips[i])+'</li>';
        }
        tipsHtml += '</ul>';
      }
      
      s.innerHTML =
        '<div class="two">'+
          '<div>'+
            '<div class="lifestyle-icon">'+ escapeHtml(item.icon||'💚') +'</div>'+
            '<div class="title-xl">'+ escapeHtml(item.title||'') +'</div>'+
            (item.lead ? '<p class="lead">'+ escapeHtml(item.lead) +'</p>' : '')+
            (item.highlight ? '<div class="highlight-box">'+ escapeHtml(item.highlight) +'</div>' : '')+
            (item.benefit ? '<div class="benefit-text">'+ escapeHtml(item.benefit) +'</div>' : '')+
            (item.risk ? '<div class="risk-text">'+ escapeHtml(item.risk) +'</div>' : '')+
            tipsHtml+
            (item.badge ? '<span class="badge">'+ escapeHtml(item.badge) +'</span>' : '')+
          '</div>'+
          '<div class="hero loading">'+ imgTag(item.image) +'</div>'+
        '</div>';
    }
    
    // TIPO: nutrition (nutrição)
    else if (item.type === 'nutrition'){
      var foodsHtml = '';
      if (item.foods && item.foods.length){
        foodsHtml = '<div class="foods-grid">';
        for(var i=0; i<item.foods.length; i++){
          var food = item.foods[i];
          foodsHtml += '<div class="food-item"><div class="food-emoji">'+escapeHtml(food.emoji)+'</div><div class="food-name">'+escapeHtml(food.name)+'</div><div class="food-benefit">'+escapeHtml(food.benefit)+'</div></div>';
        }
        foodsHtml += '</div>';
      }
      
      s.innerHTML =
        '<div class="two">'+
          '<div>'+
            '<div class="nutrition-icon">'+ escapeHtml(item.icon||'🍽️') +'</div>'+
            '<div class="title-xl">'+ escapeHtml(item.title||'') +'</div>'+
            (item.lead ? '<p class="lead">'+ escapeHtml(item.lead) +'</p>' : '')+
            foodsHtml+
            (item.footer ? '<div class="nutrition-footer">'+ escapeHtml(item.footer) +'</div>' : '')+
          '</div>'+
          '<div class="hero loading">'+ imgTag(item.image) +'</div>'+
        '</div>';
    }
    
    // TIPO: wellness (bem-estar)
    else if (item.type === 'wellness'){
      var stepsHtml = '';
      if (item.steps && item.steps.length){
        stepsHtml = '<div class="breathing-steps">';
        for(var i=0; i<item.steps.length; i++){
          var step = item.steps[i];
          stepsHtml += '<div class="breath-step"><div class="breath-num">'+escapeHtml(step.num)+'</div><div class="breath-text">'+escapeHtml(step.text)+'</div></div>';
        }
        stepsHtml += '</div>';
      }
      
      var extraHtml = '';
      if (item.extra && item.extra.length){
        extraHtml = '<ul class="tips">';
        for(var i=0; i<item.extra.length; i++){
          extraHtml += '<li>'+escapeHtml(item.extra[i])+'</li>';
        }
        extraHtml += '</ul>';
      }
      
      s.innerHTML =
        '<div class="two">'+
          '<div>'+
            '<div class="wellness-icon">'+ escapeHtml(item.icon||'🧘') +'</div>'+
            '<div class="title-xl">'+ escapeHtml(item.title||'') +'</div>'+
            (item.lead ? '<p class="lead">'+ escapeHtml(item.lead) +'</p>' : '')+
            (item.technique ? '<div class="technique-name">'+ escapeHtml(item.technique) +'</div>' : '')+
            stepsHtml+
            extraHtml+
            (item.badge ? '<span class="badge">'+ escapeHtml(item.badge) +'</span>' : '')+
          '</div>'+
          '<div class="hero loading">'+ imgTag(item.image) +'</div>'+
        '</div>';
    }
    
    else {
      s.innerHTML = '<div class="center"><h2>Tipo não suportado</h2></div>';
    }

    screen.appendChild(s);
  }

  function nextSlide() {
    clearTimeout(state.timer);
    if (!state.playlist.length) return;

    state.idx = (state.idx + 1) % state.playlist.length;
    var item = state.playlist[state.idx];
    
    console.log('Slide', state.idx + 1, 'de', state.playlist.length);
    mountSlide(item);

    var dur = (item && item.duration) ? item.duration : 15000;
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

  window.handleImageError = function(img) {
    var container = img.parentElement;
    if (container && container.classList.contains('hero')) {
      container.classList.remove('loading');
      container.classList.add('error');
      container.innerHTML = '⚠️<br>Imagem temporariamente indisponível';
    }
  };

  window.handleImageLoad = function(img) {
    var container = img.parentElement;
    if (container && container.classList.contains('hero')) {
      container.classList.remove('loading');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
