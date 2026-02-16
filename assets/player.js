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

  // 15 SLIDES COM CONTEÚDO COMPLETO
  var DEFAULT_CONTENT = [
    // SLIDE 1
    {
      title: 'Cuidar do coração é mais fácil do que parece',
      subtitle: 'Pequenas mudanças diárias podem reduzir em até 80% o risco de doenças cardiovasculares',
      bullets: [
        'Movimente-se mais',
        'Coma de forma equilibrada',
        'Controle estresse',
        'Pare de fumar',
        'Faça exames regularmente'
      ],
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80',
      duration: 18000
    },

    // SLIDE 2
    {
      title: 'Entenda o colesterol',
      subtitle: 'Colesterol não é vilão — o excesso é',
      bullets: [
        'LDL (ruim) acumula nas artérias',
        'HDL (bom) ajuda a limpar as artérias',
        'Alimentação e hábitos saudáveis mantêm o equilíbrio',
        'Cheque seu perfil lipídico ao menos 1 vez ao ano'
      ],
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1920&q=80',
      duration: 20000
    },

    // SLIDE 3
    {
      title: 'A pressão alta não dá sinais',
      subtitle: 'Hipertensão: o inimigo silencioso',
      bullets: [
        '1 em cada 3 adultos tem hipertensão',
        'Muitas vezes não apresenta sintomas',
        'Pode causar infarto e AVC',
        'Medir regularmente é a melhor defesa',
        'Anote suas medições para acompanhar tendências'
      ],
      image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1920&q=80',
      duration: 18000
    },

    // SLIDE 4
    {
      title: 'Quanto exercício é suficiente?',
      subtitle: 'Para prevenir doenças cardiovasculares',
      bullets: [
        '150 minutos/semana de atividade moderada (caminhada)',
        'OU',
        '75 minutos/semana de atividade intensa (corrida leve)',
        'Inclua fortalecimento muscular 2x por semana'
      ],
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1920&q=80',
      duration: 20000
    },

    // SLIDE 5
    {
      title: 'Seu prato influencia seu coração',
      subtitle: 'Como montar um prato cardioprotetor',
      bullets: [
        '50% verduras e legumes',
        '25% proteína magra (frango, peixe, leguminosas)',
        '25% carboidratos integrais',
        'Evite: excesso de sal, frituras e ultraprocessados'
      ],
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920&q=80',
      duration: 20000
    },

    // SLIDE 6
    {
      title: 'Menos sódio, mais vida',
      subtitle: 'Reduzindo o sal sem perder o sabor',
      bullets: [
        'Prove alimentos antes de adicionar sal',
        'Use ervas, limão e especiarias',
        'Evite temperos prontos e embutidos',
        'Reduza refrigerantes e snacks industrializados'
      ],
      image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=1920&q=80',
      duration: 18000
    },

    // SLIDE 7
    {
      title: 'Cuide da mente para proteger o coração',
      subtitle: 'Estresse crônico aumenta pressão e inflamação. Para reduzir:',
      bullets: [
        'Respiração profunda (4-7-8)',
        'Pausas durante o dia',
        'Sono regular',
        'Atividades relaxantes'
      ],
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1920&q=80',
      duration: 18000
    },

    // SLIDE 8
    {
      title: 'Dormir bem faz diferença',
      subtitle: 'Dormir 7-9 horas por noite ajuda a:',
      bullets: [
        'Controlar pressão arterial',
        'Regular hormônios',
        'Reduzir risco de diabetes',
        'Manter peso saudável',
        'Evite telas 1h antes de dormir'
      ],
      image: 'https://images.unsplash.com/photo-1541480551145-2370a440d585?w=1920&q=80',
      duration: 18000
    },

    // SLIDE 9
    {
      title: 'Por que parar de fumar é urgente',
      subtitle: 'Fumar aumenta:',
      bullets: [
        'Pressão arterial',
        'Frequência cardíaca',
        'Formação de placas nas artérias',
        'Parar reduz risco de infarto em poucas semanas'
      ],
      image: 'https://images.unsplash.com/photo-1605973029521-8154da591cc7?w=1920&q=80',
      duration: 18000
    },

    // SLIDE 10
    {
      title: 'Controle de peso = proteção',
      subtitle: 'Excesso de peso aumenta:',
      bullets: [
        'Pressão arterial',
        'Colesterol',
        'Resistência à insulina',
        'Pequenas perdas (5-10% do peso) já reduzem muito o risco'
      ],
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80',
      duration: 18000
    },

    // SLIDE 11
    {
      title: 'O check-up é seu aliado',
      subtitle: 'Exames recomendados que salvam vidas:',
      bullets: [
        'Pressão arterial',
        'Perfil lipídico (colesterol)',
        'Glicemia',
        'ECG',
        'Ecocardiograma (conforme indicação)',
        'Prevenção é sempre o melhor tratamento'
      ],
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1920&q=80',
      duration: 22000
    },

    // SLIDE 12
    {
      title: 'A técnica 4-7-8',
      subtitle: 'Respire melhor, viva melhor',
      bullets: [
        'Inspire por 4 segundos',
        'Segure por 7 segundos',
        'Expire por 8 segundos',
        'Essa prática reduz ansiedade e pressão arterial'
      ],
      image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=1920&q=80',
      duration: 18000
    },

    // SLIDE 13
    {
      title: 'Inflamação e coração',
      subtitle: 'A inflamação crônica acelera doenças cardíacas. Consuma mais:',
      bullets: [
        'Azeite extra virgem',
        'Peixes gordos',
        'Frutas vermelhas',
        'Nozes',
        'Cúrcuma e gengibre'
      ],
      image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1920&q=80',
      duration: 18000
    },

    // SLIDE 14
    {
      title: 'Quando o coração foge do ritmo',
      subtitle: 'Sintomas comuns de arritmias:',
      bullets: [
        'Palpitações',
        'Tontura',
        'Falta de ar',
        'Cansaço',
        'Se sentir episódios repetidos, procure avaliação'
      ],
      image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=1920&q=80',
      duration: 18000
    },

    // SLIDE 15
    {
      title: 'Água também protege',
      subtitle: 'Boa hidratação ajuda a controlar pressão e frequência cardíaca',
      bullets: [
        'Objetivo: 1.5 a 2 litros por dia',
        'Ajustar conforme recomendação médica'
      ],
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=1920&q=80',
      duration: 15000
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
    setTimeout(function() { useDefaultContent(); }, 5000);
    
    fetch(API + '/api/playlist?clinic=' + encodeURIComponent(CLINIC))
      .then(function(r) { 
        if (!r.ok) throw new Error('Backend error');
        return r.json(); 
      })
      .then(function(data) {
        if (!data || !data.items || !data.items.length) {
          useDefaultContent();
          return;
        }
        state.playlist = data.items;
        state.brand = (data.brand && data.brand.name) || 'BiOOH';
        updateBranding();
        hideLoading();
        showScreen();
        nextSlide();
      })
      .catch(function(e) {
        useDefaultContent();
      });
  }

  function useDefaultContent() {
    state.playlist = DEFAULT_CONTENT;
    state.brand = 'BiOOH';
    updateBranding();
    hideLoading();
    showScreen();
    nextSlide();
  }

  function updateBranding() {
    var brandEl = $('brandName');
    if (brandEl) brandEl.textContent = state.brand;
  }

  function mountSlide(item){
    var screen = $('screen');
    if (!screen) return;
    screen.innerHTML = '';
    if (!item) return;

    var s = document.createElement('div');
    s.className = 'slide active';
    
    var bulletsHtml = '';
    if (item.bullets && item.bullets.length) {
      var lis = [];
      for(var i=0; i<item.bullets.length; i++) {
        lis.push('<li>'+escapeHtml(item.bullets[i])+'</li>');
      }
      bulletsHtml = '<ul class="bullet-list">'+lis.join('')+'</ul>';
    }
    
    var bgStyle = item.image 
      ? 'background-image:url('+escapeHtml(item.image)+');background-size:cover;background-position:center'
      : 'background:linear-gradient(135deg,#667eea,#764ba2)';
    
    s.innerHTML =
      '<div class="slide-image" style="'+bgStyle+'">'+
        '<div class="image-overlay"></div>'+
      '</div>'+
      '<div class="slide-content">'+
        '<div class="text-box">'+
          '<h1 class="slide-title">'+ escapeHtml(item.title||'') +'</h1>'+
          (item.subtitle ? '<p class="slide-subtitle">'+ escapeHtml(item.subtitle) +'</p>' : '')+
          bulletsHtml+
        '</div>'+
      '</div>'+
      '<div class="slide-footer">'+
        '<div class="footer-left">'+
          '<div class="location">São Paulo</div>'+
          '<div class="date">SEGUNDA, Fevereiro 15</div>'+
        '</div>'+
        '<div class="footer-center">'+
          '<div class="time" id="slideTime">--:--</div>'+
        '</div>'+
        '<div class="footer-right">'+
          '<div class="weather-item"><div class="weather-label">Hoje</div><div class="weather-temp">23°</div><div class="weather-icon">⛅</div></div>'+
          '<div class="weather-item"><div class="weather-label">Terça</div><div class="weather-temp">25°</div><div class="weather-icon">☀️</div></div>'+
          '<div class="weather-item"><div class="weather-label">Quarta</div><div class="weather-temp">22°</div><div class="weather-icon">🌧️</div></div>'+
        '</div>'+
      '</div>';

    screen.appendChild(s);
    updateSlideTime();
  }

  function updateSlideTime() {
    var el = document.getElementById('slideTime');
    if (!el) return;
    var d = new Date();
    el.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function nextSlide() {
    clearTimeout(state.timer);
    if (!state.playlist.length) return;

    state.idx = (state.idx + 1) % state.playlist.length;
    var item = state.playlist[state.idx];
    
    mountSlide(item);

    var dur = item.duration || 18000;
    state.timer = setTimeout(nextSlide, dur);
  }

  function updateClock() {
    updateSlideTime();
  }
  setInterval(updateClock, 1000);
  updateClock();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();


