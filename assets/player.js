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

  // 15 SLIDES ESTILO PATIENTPOINT
  var DEFAULT_CONTENT = [
    // SLIDE 1: Prevenção
    {
      type: 'fullImage',
      title: 'Cuidar do coração é mais fácil do que parece',
      subtitle: 'Pequenas mudanças diárias reduzem até 80% o risco cardiovascular',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920&q=80',
      textOverlay: 'Movimente-se • Coma bem • Controle estresse • Pare de fumar • Faça exames',
      duration: 18000
    },

    // SLIDE 2: Colesterol
    {
      type: 'fullImage',
      title: 'Entenda o Colesterol',
      subtitle: 'LDL (ruim) acumula nas artérias • HDL (bom) limpa as artérias',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1920&q=80',
      textOverlay: 'Cheque seu perfil lipídico ao menos 1 vez ao ano',
      duration: 20000
    },

    // SLIDE 3: Hipertensão
    {
      type: 'fullImage',
      title: 'A pressão alta não dá sinais',
      subtitle: '1 em cada 3 adultos tem hipertensão',
      image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1920&q=80',
      textOverlay: 'Pode causar infarto e AVC • Medir regularmente é a melhor defesa',
      duration: 18000
    },

    // SLIDE 4: Exercício
    {
      type: 'fullImage',
      title: 'Quanto exercício é suficiente?',
      subtitle: '150 minutos por semana de caminhada OU 75 minutos de corrida',
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1920&q=80',
      textOverlay: 'Inclua fortalecimento muscular 2x por semana',
      duration: 20000
    },

    // SLIDE 5: Prato Saudável
    {
      type: 'fullImage',
      title: 'Seu prato influencia seu coração',
      subtitle: '50% vegetais • 25% proteína magra • 25% carboidratos integrais',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920&q=80',
      textOverlay: 'Evite: excesso de sal, frituras e ultraprocessados',
      duration: 20000
    },

    // SLIDE 6: Sal
    {
      type: 'fullImage',
      title: 'Menos sódio, mais vida',
      subtitle: 'Prove alimentos antes de adicionar sal',
      image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=1920&q=80',
      textOverlay: 'Use ervas, limão e especiarias • Evite temperos prontos e embutidos',
      duration: 18000
    },

    // SLIDE 7: Estresse
    {
      type: 'fullImage',
      title: 'Cuide da mente para proteger o coração',
      subtitle: 'Estresse crônico aumenta pressão e inflamação',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1920&q=80',
      textOverlay: 'Respiração 4-7-8 • Pausas no dia • Sono regular • Atividades relaxantes',
      duration: 18000
    },

    // SLIDE 8: Sono
    {
      type: 'fullImage',
      title: 'Dormir bem faz diferença',
      subtitle: '7-9 horas por noite protegem seu coração',
      image: 'https://images.unsplash.com/photo-1541480551145-2370a440d585?w=1920&q=80',
      textOverlay: 'Controla pressão • Regula hormônios • Reduz diabetes • Evite telas 1h antes',
      duration: 18000
    },

    // SLIDE 9: Fumo
    {
      type: 'fullImage',
      title: 'Por que parar de fumar é urgente',
      subtitle: 'Aumenta pressão, frequência cardíaca e formação de placas',
      image: 'https://images.unsplash.com/photo-1605973029521-8154da591cc7?w=1920&q=80',
      textOverlay: 'Parar reduz risco de infarto em poucas semanas',
      duration: 18000
    },

    // SLIDE 10: Peso
    {
      type: 'fullImage',
      title: 'Controle de peso = proteção',
      subtitle: 'Pequenas perdas (5-10% do peso) já reduzem muito o risco',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80',
      textOverlay: 'Excesso aumenta: pressão • colesterol • resistência à insulina',
      duration: 18000
    },

    // SLIDE 11: Exames
    {
      type: 'fullImage',
      title: 'O check-up é seu aliado',
      subtitle: 'Exames que salvam vidas',
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1920&q=80',
      textOverlay: 'Pressão arterial • Colesterol • Glicemia • ECG • Ecocardiograma',
      duration: 22000
    },

    // SLIDE 12: Respiração
    {
      type: 'fullImage',
      title: 'Respire melhor, viva melhor',
      subtitle: 'Técnica 4-7-8 reduz ansiedade e pressão',
      image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=1920&q=80',
      textOverlay: 'Inspire 4s • Segure 7s • Expire 8s • Repita 3-4 vezes',
      duration: 18000
    },

    // SLIDE 13: Anti-inflamatórios
    {
      type: 'fullImage',
      title: 'Alimentos que reduzem inflamação',
      subtitle: 'Inflamação crônica acelera doenças cardíacas',
      image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1920&q=80',
      textOverlay: 'Azeite • Peixes gordos • Frutas vermelhas • Nozes • Cúrcuma',
      duration: 18000
    },

    // SLIDE 14: Arritmias
    {
      type: 'fullImage',
      title: 'Quando o coração foge do ritmo',
      subtitle: 'Reconhecendo arritmias',
      image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=1920&q=80',
      textOverlay: 'Palpitações • Tontura • Falta de ar • Cansaço • Procure avaliação',
      duration: 18000
    },

    // SLIDE 15: Hidratação
    {
      type: 'fullImage',
      title: 'Água também protege',
      subtitle: 'Boa hidratação controla pressão e frequência cardíaca',
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=1920&q=80',
      textOverlay: 'Objetivo: 1.5 a 2 litros por dia',
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
    s.className = 'slide active slide-fullscreen';
    
    var bgStyle = item.image 
      ? 'background-image:url('+escapeHtml(item.image)+');background-size:cover;background-position:center'
      : 'background:linear-gradient(135deg,#667eea,#764ba2)';
    
    s.innerHTML =
      '<div class="fullscreen-bg" style="'+bgStyle+'">'+
        '<div class="overlay"></div>'+
        '<div class="content-box">'+
          '<h1 class="main-title">'+ escapeHtml(item.title||'') +'</h1>'+
          (item.subtitle ? '<p class="subtitle">'+ escapeHtml(item.subtitle) +'</p>' : '')+
          (item.textOverlay ? '<p class="text-overlay">'+ escapeHtml(item.textOverlay) +'</p>' : '')+
        '</div>'+
      '</div>'+
      '<div class="info-footer">'+
        '<div class="location-time">'+
          '<div class="location">'+
            '<span style="font-weight:700">São Paulo</span>'+
            '<span style="opacity:0.7;margin-left:8px">SEGUNDA, Fevereiro 15</span>'+
          '</div>'+
          '<div class="time" id="slideTime">--:--</div>'+
        '</div>'+
        '<div class="weather">'+
          '<div class="today"><div class="label">Hoje</div><div class="temp">23°</div><div class="icon">⛅</div></div>'+
          '<div class="forecast"><div class="label">Terça</div><div class="temp">25°<span class="low">18°</span></div><div class="icon">☀️</div></div>'+
          '<div class="forecast"><div class="label">Quarta</div><div class="temp">22°<span class="low">16°</span></div><div class="icon">🌧️</div></div>'+
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
    var el = $('clock');
    if (el) {
      var d = new Date();
      el.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
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

