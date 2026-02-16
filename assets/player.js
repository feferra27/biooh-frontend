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

  // 15 SLIDES EXPANDIDOS: DEFINIÇÃO + SINTOMAS + PREVENÇÃO
  var DEFAULT_CONTENT = [
    // SLIDE 1: Prevenção Geral
    {
      title: 'Cuidar do coração é mais fácil do que parece',
      sections: [
        {
          heading: 'O que são doenças cardiovasculares?',
          text: 'Condições que afetam coração e vasos sanguíneos, incluindo infarto, AVC e hipertensão.'
        },
        {
          heading: 'Prevenção (reduz até 80% do risco):',
          bullets: [
            'Movimente-se 30 min/dia',
            'Alimentação equilibrada',
            'Controle o estresse',
            'Não fume',
            'Exames regulares'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80',
      duration: 22000
    },

    // SLIDE 2: Colesterol Alto
    {
      title: 'Colesterol Alto',
      sections: [
        {
          heading: 'O que é?',
          text: 'Excesso de gordura no sangue. LDL (ruim) entope artérias. HDL (bom) as limpa.'
        },
        {
          heading: 'Sintomas:',
          bullets: [
            'Geralmente não há sintomas visíveis',
            'Descoberto apenas por exames de sangue'
          ]
        },
        {
          heading: 'Prevenção:',
          bullets: [
            'Evite frituras e gorduras trans',
            'Coma mais fibras (aveia, frutas)',
            'Pratique exercícios regularmente',
            'Cheque perfil lipídico 1x/ano'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1920&q=80',
      duration: 24000
    },

    // SLIDE 3: Hipertensão
    {
      title: 'Hipertensão (Pressão Alta)',
      sections: [
        {
          heading: 'O que é?',
          text: 'Pressão do sangue nas artérias acima de 140/90 mmHg. Força o coração a trabalhar mais.'
        },
        {
          heading: 'Sintomas (geralmente silenciosa):',
          bullets: [
            'Dor de cabeça persistente',
            'Visão embaçada',
            'Tontura',
            'Falta de ar',
            'Maioria não tem sintomas'
          ]
        },
        {
          heading: 'Prevenção:',
          bullets: [
            'Reduza sal (< 5g/dia)',
            'Mantenha peso saudável',
            'Exercícios 150 min/semana',
            'Limite álcool',
            'Meça pressão regularmente'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1920&q=80',
      duration: 26000
    },

    // SLIDE 4: Infarto
    {
      title: 'Infarto do Miocárdio',
      sections: [
        {
          heading: 'O que é?',
          text: 'Bloqueio de artéria coronária impede sangue chegar ao músculo cardíaco.'
        },
        {
          heading: 'Sintomas (LIGUE 192):',
          bullets: [
            'Dor forte no peito (aperto)',
            'Dor no braço esquerdo/mandíbula',
            'Suor frio intenso',
            'Náusea e falta de ar',
            'Sensação de morte iminente'
          ]
        },
        {
          heading: 'Prevenção:',
          bullets: [
            'Controle colesterol e pressão',
            'Não fume',
            'Exercícios regulares',
            'Dieta saudável',
            'Gerencie estresse'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1920&q=80',
      duration: 26000
    },

    // SLIDE 5: AVC (Derrame)
    {
      title: 'AVC (Derrame Cerebral)',
      sections: [
        {
          heading: 'O que é?',
          text: 'Interrupção do fluxo sanguíneo no cérebro, matando células nervosas.'
        },
        {
          heading: 'Sintomas (SAMU imediato):',
          bullets: [
            'Paralisia facial (sorriso torto)',
            'Fraqueza em braço/perna',
            'Dificuldade para falar',
            'Perda de visão súbita',
            'Tontura e desequilíbrio'
          ]
        },
        {
          heading: 'Prevenção:',
          bullets: [
            'Controle hipertensão',
            'Trate diabetes',
            'Não fume',
            'Reduza álcool',
            'Atividade física regular'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&q=80',
      duration: 26000
    },

    // SLIDE 6: Arritmia
    {
      title: 'Arritmia Cardíaca',
      sections: [
        {
          heading: 'O que é?',
          text: 'Batimentos cardíacos irregulares - muito rápidos, lentos ou descompassados.'
        },
        {
          heading: 'Sintomas:',
          bullets: [
            'Palpitações (coração acelerado)',
            'Sensação de "falha" no peito',
            'Tontura ou desmaio',
            'Falta de ar',
            'Cansaço excessivo'
          ]
        },
        {
          heading: 'Prevenção:',
          bullets: [
            'Evite cafeína em excesso',
            'Não use drogas estimulantes',
            'Controle estresse e ansiedade',
            'Durma bem (7-9h)',
            'Trate problemas cardíacos'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=1920&q=80',
      duration: 24000
    },

    // SLIDE 7: Insuficiência Cardíaca
    {
      title: 'Insuficiência Cardíaca',
      sections: [
        {
          heading: 'O que é?',
          text: 'Coração não consegue bombear sangue suficiente para o corpo.'
        },
        {
          heading: 'Sintomas:',
          bullets: [
            'Falta de ar (piora deitado)',
            'Inchaço nas pernas e pés',
            'Cansaço extremo',
            'Tosse persistente',
            'Ganho de peso rápido'
          ]
        },
        {
          heading: 'Prevenção:',
          bullets: [
            'Trate hipertensão e diabetes',
            'Evite álcool em excesso',
            'Reduza sal drasticamente',
            'Exercícios supervisionados',
            'Tome medicações corretamente'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80',
      duration: 24000
    },

    // SLIDE 8: Aterosclerose
    {
      title: 'Aterosclerose',
      sections: [
        {
          heading: 'O que é?',
          text: 'Acúmulo de placas de gordura nas paredes das artérias, estreitando-as.'
        },
        {
          heading: 'Sintomas (aparecem tarde):',
          bullets: [
            'Dor no peito ao esforço',
            'Dor nas pernas ao caminhar',
            'Fraqueza em um lado do corpo',
            'Confusão mental',
            'Pode ser assintomática'
          ]
        },
        {
          heading: 'Prevenção:',
          bullets: [
            'Dieta rica em vegetais',
            'Reduza gorduras saturadas',
            'Exercícios aeróbicos',
            'Não fume',
            'Controle colesterol e pressão'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1920&q=80',
      duration: 24000
    },

    // SLIDE 9: Angina
    {
      title: 'Angina (Dor no Peito)',
      sections: [
        {
          heading: 'O que é?',
          text: 'Dor torácica causada por redução temporária do fluxo sanguíneo ao coração.'
        },
        {
          heading: 'Sintomas:',
          bullets: [
            'Dor/pressão no peito',
            'Desconforto em braços/pescoço',
            'Falta de ar',
            'Fadiga',
            'Piora com esforço, melhora com repouso'
          ]
        },
        {
          heading: 'Prevenção:',
          bullets: [
            'Evite esforços intensos súbitos',
            'Controle fatores de risco',
            'Medicação preventiva (se prescrita)',
            'Reduza estresse',
            'Faça exames cardiológicos'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1920&q=80',
      duration: 24000
    },

    // SLIDE 10: Diabetes e Coração
    {
      title: 'Diabetes e Coração',
      sections: [
        {
          heading: 'O que é?',
          text: 'Açúcar alto no sangue danifica vasos sanguíneos e nervos do coração.'
        },
        {
          heading: 'Sintomas cardiovasculares:',
          bullets: [
            'Cansaço excessivo',
            'Falta de ar',
            'Dor no peito atípica',
            'Inchaço nas pernas',
            'Infarto pode ser silencioso'
          ]
        },
        {
          heading: 'Prevenção:',
          bullets: [
            'Mantenha glicemia controlada',
            'HbA1c < 7%',
            'Dieta com baixo índice glicêmico',
            'Exercícios 150 min/semana',
            'Monitore pressão e colesterol'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1920&q=80',
      duration: 26000
    },

    // SLIDE 11: Obesidade e Coração
    {
      title: 'Obesidade e Risco Cardíaco',
      sections: [
        {
          heading: 'O que é?',
          text: 'IMC > 30. Excesso de peso sobrecarrega coração e aumenta pressão arterial.'
        },
        {
          heading: 'Complicações:',
          bullets: [
            'Hipertensão',
            'Diabetes tipo 2',
            'Colesterol alto',
            'Apneia do sono',
            'Inflamação crônica'
          ]
        },
        {
          heading: 'Prevenção:',
          bullets: [
            'Perca 5-10% do peso (grande impacto)',
            'Dieta balanceada',
            'Exercícios diários',
            'Acompanhamento nutricional',
            'Trate causas emocionais'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80',
      duration: 24000
    },

    // SLIDE 12: Tabagismo
    {
      title: 'Tabagismo e Coração',
      sections: [
        {
          heading: 'O que é?',
          text: 'Fumar libera substâncias que danificam artérias e aumentam coagulação do sangue.'
        },
        {
          heading: 'Efeitos no coração:',
          bullets: [
            'Aumenta frequência cardíaca',
            'Eleva pressão arterial',
            'Reduz oxigênio no sangue',
            'Acelera aterosclerose',
            'Triplica risco de infarto'
          ]
        },
        {
          heading: 'Benefícios de parar:',
          bullets: [
            '24h: pressão e pulso normalizam',
            '1 ano: risco de infarto cai 50%',
            '5 anos: risco igual a não fumante',
            'Procure apoio médico',
            'Use terapias de reposição se necessário'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1605973029521-8154da591cc7?w=1920&q=80',
      duration: 26000
    },

    // SLIDE 13: Sedentarismo
    {
      title: 'Sedentarismo Mata',
      sections: [
        {
          heading: 'O que é?',
          text: 'Falta de atividade física regular. Músculos e coração enfraquecem.'
        },
        {
          heading: 'Consequências:',
          bullets: [
            'Ganho de peso',
            'Perda de massa muscular',
            'Pressão alta',
            'Colesterol elevado',
            'Maior risco de diabetes'
          ]
        },
        {
          heading: 'Como reverter:',
          bullets: [
            'Comece com 10 min/dia',
            'Caminhe sempre que possível',
            '150 min/semana (moderado)',
            'Inclua musculação 2x/semana',
            'Consulte médico antes de iniciar'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1920&q=80',
      duration: 24000
    },

    // SLIDE 14: Estresse Crônico
    {
      title: 'Estresse Crônico',
      sections: [
        {
          heading: 'O que é?',
          text: 'Tensão prolongada libera cortisol, aumentando pressão e inflamação.'
        },
        {
          heading: 'Sintomas físicos:',
          bullets: [
            'Dor de cabeça constante',
            'Tensão muscular',
            'Palpitações',
            'Fadiga extrema',
            'Problemas digestivos'
          ]
        },
        {
          heading: 'Como controlar:',
          bullets: [
            'Técnica 4-7-8 (respiração)',
            'Meditação diária (10 min)',
            'Exercícios físicos',
            'Sono regular (7-9h)',
            'Psicoterapia se necessário'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1920&q=80',
      duration: 24000
    },

    // SLIDE 15: Síndrome Metabólica
    {
      title: 'Síndrome Metabólica',
      sections: [
        {
          heading: 'O que é?',
          text: 'Combinação de: obesidade abdominal, pressão alta, glicose e colesterol elevados.'
        },
        {
          heading: 'Critérios (3 ou + confirma):',
          bullets: [
            'Cintura > 94cm (H) ou 80cm (M)',
            'Pressão ≥ 130/85',
            'Glicemia ≥ 100 mg/dL',
            'Triglicerídeos ≥ 150',
            'HDL baixo'
          ]
        },
        {
          heading: 'Prevenção:',
          bullets: [
            'Perca peso (foco na cintura)',
            'Dieta mediterrânea',
            'Exercícios 200 min/semana',
            'Evite açúcar e refinados',
            'Check-ups anuais completos'
          ]
        }
      ],
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1920&q=80',
      duration: 26000
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
    
    var sectionsHtml = '';
    if (item.sections && item.sections.length) {
      for(var i=0; i<item.sections.length; i++) {
        var sec = item.sections[i];
        sectionsHtml += '<div class="section">';
        if (sec.heading) {
          sectionsHtml += '<h3 class="section-heading">'+escapeHtml(sec.heading)+'</h3>';
        }
        if (sec.text) {
          sectionsHtml += '<p class="section-text">'+escapeHtml(sec.text)+'</p>';
        }
        if (sec.bullets && sec.bullets.length) {
          sectionsHtml += '<ul class="bullet-list">';
          for(var j=0; j<sec.bullets.length; j++) {
            sectionsHtml += '<li>'+escapeHtml(sec.bullets[j])+'</li>';
          }
          sectionsHtml += '</ul>';
        }
        sectionsHtml += '</div>';
      }
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
          sectionsHtml+
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

    var dur = item.duration || 24000;
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


