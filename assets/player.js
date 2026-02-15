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
  var API = params.api || 'http' + String.fromCharCode(58) + '//localhost' + String.fromCharCode(58) + '4000';

  var state = {
    playlist: [],
    idx: -1,
    timer: null,
    brand: 'BiOOH',
    qrUrl: 'https' + String.fromCharCode(58) + '//biooh.link/checkin'
  };

  // Conteúdo padrão de fallback com imagens que funcionam
  var DEFAULT_CONTENT = {
    brand: { name: 'BiOOH' },
    qrUrl: 'https://biooh.link/checkin',
    ticker: [
      'Use o QR code para fazer check-in digital',
      'Mantenha seus dados cadastrais atualizados',
      'Anote suas dúvidas para a consulta',
      'Hidrate-se regularmente',
      'Pratique exercícios físicos diariamente'
    ],
    items: [
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
        alt: 'Equipe médica sorrindo',
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
        lead: 'Cuide do seu coração com hábitos saudáveis e acompanhamento médico.',
        bullets: [
          'Pratique 150 minutos de exercícios por semana',
          'Reduza o consumo de sal e gorduras',
          'Controle o estresse',
          'Durma bem (7-8 horas por noite)',
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
        explain: 'Muitos casos de diabetes tipo 2 são assintomáticos no início, por isso exames preventivos são essenciais.',
        image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&q=80',
        duration: 20000,
        revealMs: 8000
      },
      {
        type: 'imageText',
        title: 'Alimentação equilibrada',
        lead: 'Uma dieta balanceada é fundamental para uma vida saudável.',
        bullets: [
          'Coma mais frutas e vegetais',
          'Prefira grãos integrais',
          'Inclua proteínas magras',
          'Beba pelo menos 2 litros de água',
          'Evite ultraprocessados'
        ],
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80',
        alt: 'Alimentos saudáveis',
        duration: 18000
      },
      {
        type: 'imageText',
        title: 'Exames preventivos salvam vidas',
        lead: 'Mantenha seus exames em dia e previna doenças graves.',
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
        lead: 'Cuide da sua mente tanto quanto cuida do seu corpo.',
        bullets: [
          'Pratique mindfulness ou meditação',
          'Mantenha conexões sociais',
          'Procure ajuda profissional quando necessário',
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
        explain: 'A OMS recomenda pelo menos 150 minutos de atividade física moderada por semana para adultos.',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80',
        duration: 20000,
        revealMs: 8000
      }
    ]
  };

  function load() {
    var initialLoading = $('initialLoading');
    if (initialLoading) initialLoading.style.display = 'grid';

    var url = API + '/api/playlist?clinic=' + encodeURIComponent(CLINIC);
    
    fetch(url)
      .then(function(r) { 
        if (!r.ok) throw new Error('Backend error');
        return r.json(); 
      })
      .then(function(data) {
        data = data || {};
        
        // Se não houver items no backend, usar conteúdo padrão
        if (!data.items || !data.items.length) {
          console.log('Usando conteúdo padrão (backend vazio)');
          data = DEFAULT_CONTENT;
        }
        
        state.playlist = data.items || [];
        state.brand = (data.brand && data.brand.name) ? data.brand.name : 'BiOOH';
        state.qrUrl = data.qrUrl || 'https://biooh.link/checkin';

        var brandEl = $('brandName');
        if (brandEl) brandEl.textContent = state.brand;

        var flowEl = $('tickerFlow');
        if (flowEl){
          var msgs = (data.ticker && data.ticker.length) ? data.ticker : DEFAULT_CONTENT.ticker;
          var html = '';
          for(var i=0;i<msgs.length;i++){ 
            html += '<span>'+escapeHtml(msgs[i])+'</span>'; 
          }
          flowEl.innerHTML = html + html;
        }

        var screen = $('screen');
        if (!screen) return;
        
        if (initialLoading) initialLoading.style.display = 'none';

        if (!state.playlist.length) {
          showEmptyState(screen);
          return;
        }

        nextSlide();
      })
      .catch(function(e) {
        console.error('Erro ao carregar do backend:', e);
        console.log('Usando conteúdo padrão (erro de conexão)');
        
        // Usar conteúdo padrão em caso de erro
        state.playlist = DEFAULT_CONTENT.items;
        state.brand = DEFAULT_CONTENT.brand.name;
        state.qrUrl = DEFAULT_CONTENT.qrUrl;
        
        var brandEl = $('brandName');
        if (brandEl) brandEl.textContent = state.brand;
        
        var flowEl = $('tickerFlow');
        if (flowEl){
          var html = '';
          for(var i=0;i<DEFAULT_CONTENT.ticker.length;i++){ 
            html += '<span>'+escapeHtml(DEFAULT_CONTENT.ticker[i])+'</span>'; 
          }
          flowEl.innerHTML = html + html;
        }
        
        var initialLoading = $('initialLoading');
        if (initialLoading) initialLoading.style.display = 'none';
        
        var screen = $('screen');
        if (screen && state.playlist.length) {
          nextSlide();
        }
      });
  }

  function showEmptyState(screen) {
    screen.innerHTML =
      '<div class="empty-state">' +
        '<h2>Nenhum conteúdo disponível</h2>' +
        '<p>Ainda não há slides configurados para esta clínica. Use o painel Admin para adicionar conteúdo educacional.</p>' +
        '<a href="admin/index.html" class="cta-btn">Ir para o Admin</a>' +
      '</div>';
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
      if (Object.prototype.toString.call(item.bullets)==='[object Array]' && item.bullets.length){
        var li = [];
        for (var i=0;i<item.bullets.length;i++){ 
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
            ((item.qr !== false) ? (
              '<div class="qrbox" style="margin-top:16px">'+
                '<div style="font-weight:700;font-size:14px;margin-bottom:8px">📱 Aponte a câmera para fazer check-in</div>'+
                '<div class="qrgrid" aria-hidden="true">'+ new Array(36+1).join('<span></span>') +'</div>'+
                '<div class="qrurl" id="qrurl"></div>'+
              '</div>'
            ) : '')+
          '</div>'+
          '<div class="hero loading" id="heroContainer">'+ imgTag(item.image, item.alt) +'</div>'+
        '</div>';

      var qrEl = $qs('#qrurl', s);
      if (qrEl){
        var urlTxt = (item.qrUrl || state.qrUrl || '').toString();
        var httpPos = urlTxt.indexOf('http' + String.fromCharCode(58));
        if (httpPos >= 0) {
          urlTxt = urlTxt.substring(httpPos + 7);
        }
        qrEl.textContent = urlTxt;
      }
    }
    else if (item.type === 'video'){
      s.innerHTML =
        '<div class="two">'+
          '<div>'+
            '<div class="title-xl">'+ escapeHtml(item.title||'') +'</div>'+
            (item.lead ? '<p class="lead">'+ escapeHtml(item.lead) +'</p>' : '')+
            (Object.prototype.toString.call(item.bullets)==='[object Array]' && item.bullets.length
              ? '<ul class="bul">'+ item.bullets.map(function(b){return '<li>'+escapeHtml(b)+'</li>';}).join('') +'</ul>' : ''
            )+
          '</div>'+
          '<div class="hero"><video id="v" autoplay muted playsinline src="'+ escapeHtml(item.src||'') +'" onerror="handleVideoError(this)"></video></div>'+
        '</div>';
      var v = $qs('#v', s);
      if (v){
        v.addEventListener('ended', function(){ nextSlide(); });
      }
    }
    else if (item.type === 'quiz'){
      var opts = (item.options||[]).map(function(o){ return '<div class="opt">'+escapeHtml(o)+'</div>'; }).join('');
      s.innerHTML =
        '<div class="slide quiz">'+
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
          '</div>'+
        '</div>';
      setTimeout(function(){ 
        var reveal = s.querySelector('.reveal');
        if (reveal) reveal.style.display = 'block';
      }, item.revealMs || 8000);
    }
    else {
      s.innerHTML =
        '<div class="center">'+
          '<h2 style="margin:0 0 12px">Conteúdo não suportado</h2>'+
          '<p class="lead" style="max-width:720px;margin:0 auto;color:#5B677A">Tipo: <code style="background:#F3F4F6;padding:4px 8px;border-radius:4px">'+ escapeHtml(String(item.type)) +'</code></p>'+
        '</div>';
    }

    screen.appendChild(s);
  }

  function nextSlide() {
    clearTimeout(state.timer);
    if (!state.playlist.length) return;

    state.idx = (state.idx + 1) % state.playlist.length;
    var item = state.playlist[state.idx];
    mountSlide(item);

    var dur = (item && item.type === 'video') ? 0 : (item && item.duration) ? item.duration : 18000;

    if (dur > 0) {
      state.timer = setTimeout(nextSlide, dur);
    }

    track('slide_impression', { 
      idx: state.idx, 
      id: (item && item.id) || null, 
      type: (item && item.type) || 'unknown' 
    });
  }

  function updateClock() {
    var el = $('clock');
    if (!el) return;
    var d = new Date();
    el.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  setInterval(updateClock, 1000);
  updateClock();

  function track(evt, payload){
    try{
      fetch(API + '/api/analytics', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ 
          clinic: CLINIC, 
          evt: evt, 
          payload: payload, 
          ts: Date.now() 
        })
      }).catch(function(){});
    }catch(_){}
  }

  // Tratamento de erro de imagem
  window.handleImageError = function(img) {
    var container = img.parentElement;
    if (container && container.classList.contains('hero')) {
      container.classList.remove('loading');
      container.classList.add('error');
      container.innerHTML = '⚠️<br>Imagem não disponível<br><small style="opacity:0.7">Verifique a URL</small>';
    }
  };

  window.handleImageLoad = function(img) {
    var container = img.parentElement;
    if (container && container.classList.contains('hero')) {
      container.classList.remove('loading');
    }
  };

  window.handleVideoError = function(video) {
    var container = video.parentElement;
    if (container) {
      container.classList.add('error');
      container.innerHTML = '⚠️<br>Vídeo não disponível<br><small style="opacity:0.7">Verifique a URL</small>';
    }
  };

  window.addEventListener('load', load);
})();


  window.addEventListener('load', load);
})();
