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
    brand: 'BiOOH Cardiologia'
  };

  // CONTEÚDO CARDIOLÓGICO (9 slides testados)
  var DEFAULT_CONTENT = [
    // SLIDE 1: Bem-vindo
    {
      type: 'imageText',
      title: 'Bem-vindo à Cardiologia',
      lead: 'Sua saúde cardiovascular é nossa prioridade.',
      bullets: [
        'Equipe especializada',
        'Exames avançados',
        'Prevenção personalizada',
        'Acompanhamento contínuo'
      ],
      image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=1200&q=80',
      duration: 16000
    },

    // SLIDE 2: Fato sobre o Coração
    {
      type: 'imageText',
      title: '❤️ Você sabia?',
      lead: 'O seu coração bate cerca de 100 mil vezes por dia e trabalha sem parar para manter seu corpo funcionando.',
      bullets: [
        'Bombeia cerca de 7.500 litros de sangue por dia',
        'Trabalha 24 horas sem descanso',
        'Pode durar mais de 80 anos com cuidados'
      ],
      badge: 'Curiosidade',
      image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200&q=80',
      duration: 14000
    },

    // SLIDE 3: Sinais de Alerta
    {
      type: 'imageText',
      title: '⚠️ Reconheça os sinais de infarto',
      lead: 'Se sentir esses sintomas, procure atendimento IMEDIATAMENTE:',
      bullets: [
        '💔 Dor ou pressão forte no peito',
        '🫁 Falta de ar súbita',
        '💪 Dor no braço esquerdo, mandíbula ou costas',
        '💦 Suor frio, náusea ou tontura intensa'
      ],
      badge: 'URGENTE - LIGUE 192',
      image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1200&q=80',
      duration: 18000
    },

    // SLIDE 4: ECG
    {
      type: 'imageText',
      title: '🧪 ECG: Rápido e fundamental',
      lead: 'O eletrocardiograma mede a atividade elétrica do coração. É rápido, indolor e ajuda a detectar arritmias e bloqueios.',
      bullets: [
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
      type: 'imageText',
      title: '🏃 Movimente-se!',
      lead: 'Caminhar 30 minutos por dia, 5 vezes por semana, reduz em até 30% o risco de doenças cardiovasculares.',
      bullets: [
        'Comece devagar e aumente gradualmente',
        'Escolha atividades que você goste',
        'Consulte seu médico antes de iniciar',
        'Exercícios leves já fazem diferença'
      ],
      badge: 'Prevenção',
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1200&q=80',
      duration: 15000
    },

    // SLIDE 6: Alimentação
    {
      type: 'imageText',
      title: '🍽️ Comer bem faz diferença',
      lead: 'Inclua esses alimentos no seu dia a dia:',
      bullets: [
        '🫐 Frutas vermelhas - Antioxidantes poderosos',
        '🐟 Peixes ricos em ômega-3 - Anti-inflamatório',
        '🫒 Azeite de oliva - Gordura boa para o coração',
        '🥜 Nozes e castanhas - Proteção cardiovascular'
      ],
      badge: 'Nutrição',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80',
      duration: 18000
    },

    // SLIDE 7: Sono
    {
      type: 'imageText',
      title: '🛌 Seu sono importa',
      lead: 'Dormir menos de 6 horas por noite aumenta o risco de hipertensão e arritmias.',
      bullets: [
        'Estabeleça uma rotina de sono regular',
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
      type: 'imageText',
      title: '🩺 Ecocardiograma',
      lead: 'É um ultrassom do coração que avalia válvulas, fluxo sanguíneo e força de bombeamento. Exame indolor e sem radiação.',
      bullets: [
        'Avalia válvulas cardíacas',
        'Mede força de bombeamento',
        'Detecta problemas estruturais',
        'Totalmente indolor e seguro'
      ],
      badge: 'Exame',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&q=80',
      duration: 15000
    },

    // SLIDE 9: Reduzindo Estresse
    {
      type: 'imageText',
      title: '🧘 Pause e respire',
      lead: 'Estresse constante aumenta a pressão arterial. Experimente a técnica de respiração 4-7-8:',
      bullets: [
        '4️⃣ Inspire pelo nariz por 4 segundos',
        '7️⃣ Segure a respiração por 7 segundos',
        '8️⃣ Expire pela boca por 8 segundos',
        'Repita 3-4 vezes quando sentir estresse'
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
    console.log('Carregando conteúdo...');
    
    var timeoutId = setTimeout(function() {
      console.log('Usando conteúdo cardiológico padrão');
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
        state.brand = (data.brand && data.brand.name) || 'BiOOH Cardiologia';
        
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
    state.brand = 'BiOOH Cardiologia';
    
    updateBranding();
    updateTicker([
      'Cardiologia de excelência',
      'Prevenção salva vidas',
      'Cuide do seu coração'
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
      msgs = ['Cardiologia', 'Prevenção', 'Saúde'];
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

    console.log('Montando slide:', item.title, 'Tipo:', item.type);

    var s = document.createElement('div');
    s.className = 'slide active';

    // Todos os slides usam o layout imageText
    var bulletsHtml = '';
    if (item.bullets && item.bullets.length){
      var li = [];
      for (var i=0; i<item.bullets.length; i++){ 
        li.push('<li>'+escapeHtml(item.bullets[i])+'</li>'); 
      }
      bulletsHtml = '<ul class="bul">'+li.join('')+'</ul>';
    }
    
    var imgHtml = '';
    if (item.image) {
      imgHtml = '<img src="'+escapeHtml(item.image)+'" alt="'+escapeHtml(item.title)+'" onerror="this.parentElement.innerHTML=\'⚠️<br>Imagem indisponível\'" onload="this.parentElement.classList.remove(\'loading\')">';
    }
    
    s.innerHTML =
      '<div class="two">'+
        '<div>'+
          '<div class="title-xl">'+ escapeHtml(item.title||'') +'</div>'+
          (item.lead ? '<p class="lead">'+ escapeHtml(item.lead) +'</p>' : '')+
          bulletsHtml+
          (item.badge ? '<span class="badge">'+ escapeHtml(item.badge) +'</span>' : '')+
        '</div>'+
        '<div class="hero loading">'+ imgHtml +'</div>'+
      '</div>';

    screen.appendChild(s);
  }

  function nextSlide() {
    clearTimeout(state.timer);
    if (!state.playlist.length) return;

    state.idx = (state.idx + 1) % state.playlist.length;
    var item = state.playlist[state.idx];
    
    console.log('Exibindo slide', (state.idx + 1), 'de', state.playlist.length);
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

