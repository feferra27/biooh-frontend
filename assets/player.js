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

  // Conteúdo padrão com imagens que funcionam
  var DEFAULT_CONTENT = [
    {
      type: 'imageText',
      title: 'Bem-vindo à nossa clínica',
      lead: 'Estamos felizes em cuidar da sua saúde com excelência e dedicação.',
      bullets: [
        'Equipe altamente qualificada',
        'Tecnologia de ponta',
        'Atendimento humanizado',
        'Ambiente acolhedor'
      ],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80',
      alt: 'Equipe médica',
      duration: 18000
    },
    {
      type: 'imageText',
      title: 'Diabetes: conheça os sinais',
      lead: 'O diagnóstico precoce faz toda a diferença no tratamento.',
      bullets: [
        'Sede excessiva e boca seca',
        'Fome frequente mesmo após comer',
        'Cansaço e fadiga constante',
        'Visão embaçada',
        'Vontade frequente de urinar'
      ],
      badge: 'Prevenção',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&q=80',
      alt: 'Medição de glicose',
      duration: 20000
    },
    {
      type: 'imageText',
      title: 'Saúde cardiovascular',
      lead: 'Cuide do seu coração com hábitos saudáveis.',
      bullets: [
        'Pratique 150 minutos de exercícios por semana',
        'Reduza sal e gorduras',
        'Controle o estresse',
        'Durma bem (7-8 horas)',
        'Faça check-ups regulares'
      ],
      badge: 'Importante',
      image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=1200&q=80',
      alt: 'Coração saudável',
      duration: 20000
    },
    {
      type: 'quiz',
      question: 'A diabetes tipo 2 sempre apresenta sintomas no início?',
      options: ['Sim, sempre', 'Não, pode ser silenciosa'],
      answer: 'Não, pode ser silenciosa',
      explain: 'Muitos casos são assintomáticos no início. Por isso exames preventivos são essenciais.',
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&q=80',
      duration: 20000,
      revealMs: 8000
    },
    {
      type: 'imageText',
      title: 'Alimentação equilibrada',
      lead: 'Uma dieta balanceada é fundamental para a saúde.',
      bullets: [
        'Coma mais frutas e vegetais',
        'Prefira grãos integrais',
        'Inclua proteínas magras',
        'Beba 2 litros de água por dia',
        'Evite ultraprocessados'
      ],
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80',
      alt: 'Alimentos saudáveis',
      duration: 18000
    },
    {
      type: 'imageText',
      title: 'Exames preventivos salvam vidas',
      lead: 'Mantenha seus exames em dia.',
      bullets: [
        'Hemograma completo (anual)',
        'Glicemia e colesterol (anual)',
        'Pressão arterial (trimestral)',
        'Mamografia (mulheres 40+)',
        'Colonoscopia (50+)'
      ],
      badge: 'Prevenção',
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&q=80',
      alt: 'Exame médico',
      duration: 20000
    },
    {
      type: 'imageText',
      title: 'Saúde mental importa',
      lead: 'Cuide da sua mente tanto quanto do seu corpo.',
      bullets: [
        'Pratique meditação',
        'Mantenha conexões sociais',
        'Procure ajuda quando necessário',
        'Reserve tempo para hobbies',
        'Estabeleça limites saudáveis'
      ],
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80',
      alt: 'Pessoa meditando',
      duration: 18000
    },
    {
      type: 'quiz',
      question: 'Quantos minutos de exercício por semana são recomendados?',
      options: ['30 minutos', '150 minutos', '300 minutos'],
      answer: '150 minutos',
      explain: 'A OMS recomenda 150 minutos de atividade física moderada por semana.',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80',
      duration: 20000,
      revealMs: 8000
    }
  ];

  function hideLoading() {
    var loading = $('initialLoading');
    if (loading) {
      loading.style.display = 'none';
    }
  }

  function showScreen() {
    var screen = $('screen');
    if (screen) {
      screen.style.display = 'block';
    }
  }

  function load() {
    console.log('Iniciando carregamento...');
    
    var url = API + '/api/playlist?clinic=' + encodeURIComponent(CLINIC);
    
    // Timeout de 5 segundos - se não carregar, usa conteúdo padrão
    var timeoutId = setTimeout(function() {
      console.log('Timeout - usando conteúdo padrão');
      useDefaultContent();
    }, 5000);
    
    fetch(url)
      .then(function(r) { 
        clearTimeout(timeoutId);
        if (!r.ok) throw new Error('Backend error');
        return r.json(); 
      })
      .then(function(data) {
        console.log('Dados recebidos do backend:', data);
        clearTimeout(timeoutId);
        
        data = data || {};
        
        // Se não houver items, usar conteúdo padrão
        if (!data.items || !data.items.length) {
          console.log('Backend sem conteúdo - usando padrão');
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
        console.error('Erro ao carregar:', e);
        clearTimeout(timeoutId);
        useDefaultContent();
      });
  }

  function useDefaultContent() {
    console.log('Usando conteúdo padrão');
    
    state.playlist = DEFAULT_CONTENT;
    state.brand = 'BiOOH';
    state.qrUrl = 'https://biooh.link/checkin';
    
    updateBranding();
    updateTicker([
      'Use o QR code para fazer check-in digital',
      'Mantenha seus dados atualizados',
      'Anote suas dúvidas para a consulta',
      'Hidrate-se regularmente',
      'Pratique exercícios diariamente'
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
          'Use o QR para check-in',
          'Anote suas dúvidas',
          'Hidrate-se',
          'Pratique exercícios'
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
            '<div class="qrbox" style="margin-top:16px">'+
              '<div style="font-weight:700;font-size:14px;margin-bottom:8px">📱 Aponte a câmera para check-in</div>'+
              '<div class="qrgrid" aria-hidden="true">'+ new Array(36+1).join('<span></span>') +'</div>'+
              '<div class="qrurl" id="qrurl">biooh.link/checkin</div>'+
            '</div>'+
          '</div>'+
          '<div class="hero loading" id="heroContainer">'+ imgTag(item.image, item.alt) +'</div>'+
        '</div>';

      var qrEl = $qs('#qrurl', s);
      if (qrEl){
        var urlTxt = (item.qrUrl || state.qrUrl || '').toString();
        urlTxt = urlTxt.replace(/^https?:\/\//, '');
        qrEl.textContent = urlTxt;
      }
    }
    else if (item.type === 'quiz'){
      var opts = (item.options||[]).map(function(o){ 
        return '<div class="opt">'+escapeHtml(o)+'</div>'; 
      }).join('');
      
      s.innerHTML =
        '<div class="two">'+
          '<div>'+
            '<span class="badge" style="background:#E8F8EF;color:#0F7A47">Quiz</span>'+
            '<div class="title-xl" style="margin-top:12px">'+ escapeHtml(item.question||'') +'</div>'+
            '<div class="options" style="margin-top:16px">'+ opts +'</div>'+
            '<div class="reveal" style="margin-top:16px;padding:16px;background:#F0FDF4;border-radius:12px;display:none">'+
              '<strong style="color:#0F7A47">✓ Resposta: '+ escapeHtml(item.answer||'') +'</strong><br>'+
              '<span style="color:#374151;margin-top:8px;display:block">'+ escapeHtml(item.explain||'') +'</span>'+
            '</div>'+
          '</div>'+
          '<div class="hero loading" id="heroContainer">'+ imgTag(item.image) +'</div>'+
        '</div>';
      
      setTimeout(function(){ 
        var reveal = s.querySelector('.reveal');
        if (reveal) reveal.style.display = 'block';
      }, item.revealMs || 8000);
    }
    else {
      s.innerHTML =
        '<div class="center">'+
          '<h2>Tipo não suportado</h2>'+
          '<p class="lead">'+ escapeHtml(String(item.type)) +'</p>'+
        '</div>';
    }

    screen.appendChild(s);
  }

  function nextSlide() {
    clearTimeout(state.timer);
    if (!state.playlist.length) return;

    state.idx = (state.idx + 1) % state.playlist.length;
    var item = state.playlist[state.idx];
    
    console.log('Mostrando slide', state.idx + 1, 'de', state.playlist.length);
    
    mountSlide(item);

    var dur = (item && item.duration) ? item.duration : 18000;
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

  // Handlers globais para imagens
  window.handleImageError = function(img) {
    console.log('Erro ao carregar imagem:', img.src);
    var container = img.parentElement;
    if (container && container.classList.contains('hero')) {
      container.classList.remove('loading');
      container.classList.add('error');
      container.innerHTML = '⚠️<br>Imagem não disponível';
    }
  };

  window.handleImageLoad = function(img) {
    console.log('Imagem carregada:', img.src);
    var container = img.parentElement;
    if (container && container.classList.contains('hero')) {
      container.classList.remove('loading');
    }
  };

  // Iniciar quando página carregar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
