(function () {
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  var params = {};
  (location.search.substring(1)||'').split('&').forEach(function(p){
    var kv=p.split('='); if(kv[0]) params[decodeURIComponent(kv[0])]=decodeURIComponent(kv[1]||'');
  });

  var CLINIC = params.clinic||'default';
  var API    = params.api||'http://localhost:4000';
  var state  = { playlist:[], idx:-1, timer:null };

  // ─────────────────────────────────────────────────────────────────────────────
  // 15 SLIDES — linguagem acolhedora, descrições de 2-3 linhas, tom suave
  // Fontes: OMS, Sociedade Brasileira de Cardiologia, Mayo Clinic, AHA
  // ─────────────────────────────────────────────────────────────────────────────
  var SLIDES = [
    {
      title: 'Cuidar do coração começa no dia a dia',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=80',
      duration: 20000,
      sections: [
        { h: 'O que são doenças cardiovasculares?',
          t: 'Doenças cardiovasculares afetam o coração e os vasos sanguíneos. Segundo a OMS, são a principal causa de morte no mundo — e a boa notícia é que até 80% dos casos podem ser evitados com mudanças no estilo de vida.' },
        { h: 'Hábitos que protegem seu coração',
          b: ['Movimente-se pelo menos 30 minutos por dia',
              'Prefira alimentos naturais e variados',
              'Reserve momentos para relaxar e descansar',
              'Considere abandonar o cigarro — cada dia sem fumar já faz diferença',
              'Consulte seu médico regularmente, mesmo sem sintomas'] }
      ]
    },
    {
      title: 'Colesterol: entenda o que realmente importa',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1400&q=80',
      duration: 22000,
      sections: [
        { h: 'O que é?',
          t: 'O colesterol é uma gordura produzida pelo próprio organismo e essencial para a vida. O problema surge quando o LDL ("ruim") se acumula nas artérias, formando placas que dificultam a passagem do sangue. O HDL ("bom"), ao contrário, ajuda a remover esse excesso.' },
        { h: 'Como o corpo avisa',
          b: ['Geralmente não há sintomas — por isso é chamado de inimigo silencioso',
              'O diagnóstico é feito apenas por exame de sangue',
              'Xantomas (depósitos amarelados na pele) podem surgir em casos avançados'] },
        { h: 'Como manter o equilíbrio',
          b: ['Reduza frituras, embutidos e gorduras trans',
              'Inclua mais fibras: aveia, frutas, legumes',
              'Pratique atividade física com regularidade',
              'Peça ao seu médico um perfil lipídico anual'] }
      ]
    },
    {
      title: 'Hipertensão: o inimigo que age em silêncio',
      image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1400&q=80',
      duration: 24000,
      sections: [
        { h: 'O que é?',
          t: 'A hipertensão arterial ocorre quando a força do sangue contra as paredes das artérias se mantém elevada (acima de 140/90 mmHg). Com o tempo, esse esforço extra desgasta o coração e danifica os vasos — podendo levar a infarto ou AVC sem qualquer sinal prévio.' },
        { h: 'Sinais que podem aparecer',
          b: ['Dor de cabeça, especialmente pela manhã',
              'Tontura ou sensação de cabeça pesada',
              'Visão turva ou pontinhos no campo visual',
              'Zumbido nos ouvidos',
              'Na maioria das vezes, porém, não há sintomas'] },
        { h: 'Como cuidar da pressão',
          b: ['Reduza o sal — experimente ervas e limão para realçar o sabor',
              'Mantenha um peso saudável para o seu biotipo',
              'Movimente-se com prazer: caminhadas, dança, natação',
              'Limite o consumo de álcool',
              'Meça a pressão regularmente e anote os valores'] }
      ]
    },
    {
      title: 'Infarto do miocárdio: reconheça os sinais',
      image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1400&q=80',
      duration: 24000,
      sections: [
        { h: 'O que é?',
          t: 'O infarto acontece quando uma artéria coronária é bloqueada, geralmente por uma placa de gordura que se rompe e forma um coágulo. Sem sangue, as células do músculo cardíaco começam a morrer — por isso cada minuto conta. Ligar 192 imediatamente pode salvar vidas.' },
        { h: 'Sinais de alerta — procure ajuda imediata',
          b: ['Dor ou pressão intensa no peito, como um aperto',
              'Dor que irradia para o braço esquerdo, mandíbula ou costas',
              'Suor frio repentino e intensa sensação de mal-estar',
              'Falta de ar mesmo sem esforço',
              'Náusea, tontura ou desmaio'] },
        { h: 'Como reduzir o risco',
          b: ['Mantenha colesterol e pressão arterial sob controle',
              'Cuide da saúde emocional — o estresse crônico pesa no coração',
              'Adote uma alimentação rica em vegetais e pobre em ultraprocessados',
              'Invista em atividade física regular',
              'Abandone o cigarro — o benefício começa nas primeiras 24 horas'] }
      ]
    },
    {
      title: 'AVC: quando o cérebro pede socorro',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1400&q=80',
      duration: 24000,
      sections: [
        { h: 'O que é?',
          t: 'O Acidente Vascular Cerebral (AVC) ocorre quando o fluxo de sangue para uma área do cérebro é interrompido — seja por um vaso entupido (isquêmico) ou rompido (hemorrágico). É uma emergência médica: quanto mais rápido o atendimento, menores as sequelas.' },
        { h: 'Sinais — use o método SAMU (192)',
          b: ['Sorriso torto ou queda de um lado do rosto',
              'Fraqueza ou dormência súbita em um braço ou perna',
              'Dificuldade para falar ou entender o que dizem',
              'Perda repentina de visão em um ou ambos os olhos',
              'Desequilíbrio e dor de cabeça muito intensa sem causa'] },
        { h: 'Como proteger o cérebro',
          b: ['Mantenha a pressão arterial sempre bem controlada',
              'Cuide do diabetes com acompanhamento médico contínuo',
              'Deixar de fumar reduz o risco de AVC em até 50%',
              'Limite o álcool a quantidades moderadas',
              'Pratique atividade física com regularidade'] }
      ]
    },
    {
      title: 'Arritmia: quando o ritmo se perde',
      image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=1400&q=80',
      duration: 22000,
      sections: [
        { h: 'O que é?',
          t: 'Arritmia é qualquer alteração no ritmo normal dos batimentos cardíacos — podendo ser muito rápido, muito lento ou irregular. Muitas são inofensivas, mas algumas aumentam o risco de AVC e insuficiência cardíaca. Um eletrocardiograma (ECG) é o exame que identifica o problema.' },
        { h: 'Como o coração avisa',
          b: ['Sensação de "coração pulando" ou acelerado',
              'Pausa seguida de batida forte no peito',
              'Tontura ou desmaio súbito',
              'Falta de ar fora do comum',
              'Cansaço desproporcional ao esforço realizado'] },
        { h: 'Como reduzir o risco',
          b: ['Evite exageros de cafeína e bebidas energéticas',
              'Priorize noites de sono reparador',
              'Gerencie o estresse com técnicas de respiração e pausas',
              'Siga as orientações médicas se tiver pressão ou problemas cardíacos',
              'Relate ao cardiologista qualquer episódio repetido'] }
      ]
    },
    {
      title: 'Insuficiência cardíaca: quando o coração pede ajuda',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1400&q=80',
      duration: 22000,
      sections: [
        { h: 'O que é?',
          t: 'Na insuficiência cardíaca, o coração perde parte de sua capacidade de bombear sangue adequadamente. Isso faz com que líquido se acumule nos pulmões e pernas. É uma condição crônica que, com tratamento e cuidados, permite uma vida ativa e com qualidade.' },
        { h: 'Sinais que merecem atenção',
          b: ['Falta de ar que piora ao deitar ou ao esforço leve',
              'Inchaço progressivo nos tornozelos, pés ou pernas',
              'Cansaço intenso para atividades que antes eram simples',
              'Tosse persistente, especialmente à noite',
              'Ganho de peso rápido (mais de 2 kg em 2-3 dias)'] },
        { h: 'Como viver bem com o coração',
          b: ['Siga o tratamento prescrito sem interromper por conta própria',
              'Controle o consumo de sal e líquidos conforme orientação',
              'Pratique atividades físicas leves e supervisionadas',
              'Cuide também da pressão arterial e do diabetes',
              'Pese-se diariamente e comunique variações ao médico'] }
      ]
    },
    {
      title: 'Aterosclerose: o entupimento silencioso',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1400&q=80',
      duration: 22000,
      sections: [
        { h: 'O que é?',
          t: 'A aterosclerose é o acúmulo gradual de gordura, colesterol e outras substâncias nas paredes das artérias, formando placas que as estreitam. O processo começa na juventude e avança lentamente — por isso a prevenção desde cedo é tão importante.' },
        { h: 'Sinais (costumam aparecer tarde)',
          b: ['Dor no peito ao se esforçar fisicamente',
              'Dor ou cansaço nas pernas ao caminhar',
              'Fraqueza ou dormência em um lado do corpo',
              'Dificuldade de raciocínio ou memória (em casos avançados)',
              'Frequentemente não há sintomas até que algo grave ocorra'] },
        { h: 'Como desacelerar o processo',
          b: ['Adote uma dieta rica em vegetais, frutas e grãos integrais',
              'Reduza gorduras saturadas presentes em carnes e laticínios gordurosos',
              'Pratique exercícios aeróbicos com regularidade',
              'Abandone o cigarro — ele acelera a doença significativamente',
              'Mantenha colesterol e pressão dentro das metas definidas com seu médico'] }
      ]
    },
    {
      title: 'Angina: o coração pedindo mais oxigênio',
      image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1400&q=80',
      duration: 22000,
      sections: [
        { h: 'O que é?',
          t: 'Angina é uma dor ou pressão no peito causada pela redução temporária do fluxo sanguíneo ao coração. Funciona como um sinal de alerta de que as artérias coronárias estão parcialmente estreitadas. O desconforto costuma surgir ao esforço e aliviar com repouso.' },
        { h: 'Como se manifesta',
          b: ['Pressão, aperto ou queimação no peito',
              'Desconforto que pode se estender ao braço, pescoço ou mandíbula',
              'Falta de ar ao fazer algo que antes era fácil',
              'Sintomas surgem ao esforço e melhoram com repouso',
              'Cansaço e mal-estar após esforços simples'] },
        { h: 'Como conviver com segurança',
          b: ['Evite esforços intensos sem aquecimento adequado',
              'Siga rigorosamente o uso de medicações prescritas',
              'Mantenha pressão, colesterol e glicemia controlados',
              'Encontre formas saudáveis de lidar com o estresse cotidiano',
              'Realize acompanhamento cardiológico regular'] }
      ]
    },
    {
      title: 'Diabetes e coração: uma conexão importante',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1400&q=80',
      duration: 24000,
      sections: [
        { h: 'O que é?',
          t: 'Pessoas com diabetes têm risco até 4 vezes maior de desenvolver doenças cardíacas. Isso porque o excesso de açúcar no sangue inflama e danifica os vasos sanguíneos ao longo do tempo, favorecendo aterosclerose, hipertensão e insuficiência cardíaca.' },
        { h: 'Sinais que merecem atenção',
          b: ['Cansaço desproporcional ao esforço',
              'Falta de ar em atividades leves',
              'Inchaço nos tornozelos e pés',
              'Dor no peito de caráter atípico ou leve',
              'Infartos em diabéticos podem ser silenciosos — sem dor'] },
        { h: 'Como proteger o coração',
          b: ['Mantenha a glicemia próxima das metas definidas com seu médico',
              'Cuide da pressão arterial com alimentação e, se necessário, medicação',
              'Pratique atividade física regular — ela melhora a sensibilidade à insulina',
              'Prefira carboidratos de baixo índice glicêmico: integrais, legumes, frutas',
              'Realize exames de rotina incluindo colesterol e função renal'] }
      ]
    },
    {
      title: 'Obesidade e coração: o peso certo faz diferença',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=80',
      duration: 22000,
      sections: [
        { h: 'O que é?',
          t: 'O excesso de peso, especialmente a gordura abdominal, força o coração a trabalhar mais e eleva o risco de hipertensão, diabetes e colesterol alto. A boa notícia: reduzir apenas 5% a 10% do peso corporal já traz benefícios mensuráveis para a saúde cardiovascular.' },
        { h: 'Sinais de alerta',
          b: ['Pressão arterial elevada',
              'Glicemia acima do normal',
              'Colesterol e triglicerídeos altos',
              'Apneia do sono — que também sobrecarrega o coração',
              'Falta de ar ao subir escadas ou caminhar distâncias curtas'] },
        { h: 'Pequenos passos com grande impacto',
          b: ['Comece com metas realistas — não é necessário ser perfeito',
              'Adote um padrão alimentar sustentável, não uma dieta restritiva',
              'Inclua caminhadas diárias e aumente gradualmente a intensidade',
              'Busque apoio profissional: nutrólogo, nutricionista, psicólogo',
              'Celebre cada pequena conquista — elas somam'] }
      ]
    },
    {
      title: 'Tabagismo: o coração agradece cada dia sem cigarro',
      image: 'https://images.unsplash.com/photo-1605973029521-8154da591cc7?w=1400&q=80',
      duration: 24000,
      sections: [
        { h: 'O que é?',
          t: 'O cigarro libera mais de 7.000 substâncias químicas, das quais ao menos 250 são nocivas ao coração e aos vasos. Fumar triplica o risco de infarto e duplica o de AVC. Mas o corpo começa a se recuperar rapidamente após parar — em 24 horas a pressão e o pulso já melhoram.' },
        { h: 'O que o fumo faz ao coração',
          b: ['Eleva a pressão arterial e a frequência cardíaca',
              'Reduz o oxigênio disponível para os tecidos',
              'Acelera a formação de placas nas artérias',
              'Aumenta a tendência do sangue a coagular',
              'Causa inflamação generalizada nos vasos'] },
        { h: 'Benefícios de parar — começa hoje',
          b: ['Em 20 minutos: pressão e pulso voltam ao normal',
              'Em 24 horas: risco de infarto já começa a cair',
              'Em 1 ano: risco cardiovascular reduz pela metade',
              'Em 5 anos: risco equivale ao de quem nunca fumou',
              'Peça apoio ao seu médico — existem tratamentos eficazes'] }
      ]
    },
    {
      title: 'Sedentarismo: mover-se é cuidar do coração',
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1400&q=80',
      duration: 22000,
      sections: [
        { h: 'O que é?',
          t: 'Passar a maior parte do dia sentado ou deitado sem atividade física é hoje considerado um fator de risco independente para doenças cardíacas. A OMS classifica o sedentarismo como o quarto maior fator de risco para mortalidade global — mas qualquer movimento já ajuda.' },
        { h: 'O que acontece com o corpo',
          b: ['O coração se enfraquece progressivamente',
              'Pressão e colesterol tendem a subir',
              'O metabolismo fica mais lento',
              'Peso aumenta com mais facilidade',
              'Risco de diabetes tipo 2 cresce significativamente'] },
        { h: 'Como começar, no seu ritmo',
          b: ['Inicie com 10 minutos de caminhada e aumente devagar',
              'Use escadas em vez de elevador sempre que possível',
              'Levante-se e se mova a cada 60 minutos de trabalho',
              'Encontre uma atividade que você goste — será mais fácil manter',
              'Converse com seu médico antes de começar exercícios intensos'] }
      ]
    },
    {
      title: 'Estresse crônico: cuide da mente, proteja o coração',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1400&q=80',
      duration: 22000,
      sections: [
        { h: 'O que é?',
          t: 'O estresse prolongado mantém o organismo em estado de alerta constante, elevando cortisol, pressão arterial e inflamação. Segundo a SBC, estresse crônico está associado a maior risco de infarto e arritmias — e afeta mais as pessoas que não têm válvulas emocionais saudáveis.' },
        { h: 'Como o estresse se manifesta',
          b: ['Dor de cabeça frequente e tensão muscular',
              'Palpitações ou sensação de "coração acelerado"',
              'Sono interrompido ou difícil de iniciar',
              'Irritabilidade e dificuldade de concentração',
              'Problemas digestivos sem causa física clara'] },
        { h: 'Estratégias que fazem diferença',
          b: ['Experimente a respiração 4-7-8: inspire 4s, segure 7s, expire 8s',
              'Inclua pausas conscientes ao longo do dia — 5 minutos já ajudam',
              'Priorize o sono: ele regula hormônios do estresse naturalmente',
              'Pratique atividade física — ela é ansiolítica comprovada',
              'Considere psicoterapia se o estresse estiver difícil de gerenciar'] }
      ]
    },
    {
      title: 'Síndrome metabólica: quando os fatores se somam',
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1400&q=80',
      duration: 24000,
      sections: [
        { h: 'O que é?',
          t: 'A síndrome metabólica é a combinação de pelo menos três fatores: obesidade abdominal, pressão alta, glicemia elevada, triglicerídeos altos e HDL baixo. Quem a tem tem risco cardiovascular 2 a 3 vezes maior — mas a condição responde muito bem a mudanças no estilo de vida.' },
        { h: 'Critérios de diagnóstico',
          b: ['Circunferência abdominal > 94 cm (homens) ou > 80 cm (mulheres)',
              'Pressão arterial ≥ 130/85 mmHg',
              'Glicemia em jejum ≥ 100 mg/dL',
              'Triglicerídeos ≥ 150 mg/dL',
              'HDL < 40 mg/dL (homens) ou < 50 mg/dL (mulheres)'] },
        { h: 'Como reverter o quadro',
          b: ['Foque em reduzir a gordura abdominal — ela é a mais perigosa',
              'Adote o padrão mediterrâneo: vegetais, azeite, peixes e grãos integrais',
              'Invista em pelo menos 200 minutos de atividade física por semana',
              'Limite açúcar refinado, farinha branca e alimentos ultraprocessados',
              'Realize check-up anual completo com exames de sangue'] }
      ]
    }
  ];

  // ─── helpers ────────────────────────────────────────────────────────────────
  function hideLoading() {
    var el = $('initialLoading');
    if (el) el.style.display = 'none';
  }
  function showScreen() {
    var el = $('screen');
    if (el) { el.style.display = 'block'; el.classList.add('ready'); }
  }

  function buildSections(sections) {
    if (!sections || !sections.length) return '';
    var html = '';
    for (var i = 0; i < sections.length; i++) {
      var s = sections[i];
      html += '<div class="section">';
      if (s.h) html += '<div class="section-heading">'+esc(s.h)+'</div>';
      if (s.t) html += '<p class="section-text">'+esc(s.t)+'</p>';
      if (s.b && s.b.length) {
        html += '<ul class="bullet-list">';
        for (var j = 0; j < s.b.length; j++)
          html += '<li>'+esc(s.b[j])+'</li>';
        html += '</ul>';
      }
      html += '</div>';
    }
    return html;
  }

  function mountSlide(item) {
    var screen = $('screen');
    if (!screen || !item) return;
    screen.innerHTML = '';

    var s = document.createElement('div');
    s.className = 'slide active';

    var bg = item.image
      ? 'background-image:url('+esc(item.image)+');background-size:cover;background-position:center'
      : 'background:#E5E7EB';

    s.innerHTML =
      '<div class="slide-image" style="'+bg+'">'+
        '<img src="'+esc(item.image||'')+'" alt="" style="width:100%;height:100%;object-fit:cover;display:block" onerror="this.style.display=\'none\'">'+
      '</div>'+
      '<div class="slide-content">'+
        '<div class="text-box">'+
          '<h1 class="slide-title">'+esc(item.title||'')+'</h1>'+
          buildSections(item.sections)+
        '</div>'+
      '</div>';

    screen.appendChild(s);
  }

  function nextSlide() {
    clearTimeout(state.timer);
    if (!state.playlist.length) return;
    state.idx = (state.idx + 1) % state.playlist.length;
    mountSlide(state.playlist[state.idx]);
    state.timer = setTimeout(nextSlide, state.playlist[state.idx].duration || 22000);
  }

  // ─── load ───────────────────────────────────────────────────────────────────
  function useDefault() {
    state.playlist = SLIDES;
    var el = document.getElementById('brandName');
    if (el) el.textContent = 'BiOOH';
    hideLoading();
    showScreen();
    nextSlide();
  }

  function load() {
    var tid = setTimeout(useDefault, 5000);
    fetch(API + '/api/playlist?clinic=' + encodeURIComponent(CLINIC))
      .then(function(r){ clearTimeout(tid); if (!r.ok) throw 0; return r.json(); })
      .then(function(d){
        if (!d || !d.items || !d.items.length) { useDefault(); return; }
        state.playlist = d.items;
        var el = document.getElementById('brandName');
        if (el) el.textContent = (d.brand && d.brand.name) || 'BiOOH';
        hideLoading(); showScreen(); nextSlide();
      })
      .catch(function(){ clearTimeout(tid); useDefault(); });
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', load);
  else
    load();
})();


