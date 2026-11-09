/* ==========================================================================
   StayFit — ecrãs ilustrativos desenhados em HTML/CSS.
   IMPORTANTE: são ilustrações, não capturas reais. Quando existir uma imagem
   em assets/screenshots/<nome>.png (ou .jpg / .webp) ela substitui
   automaticamente a ilustração correspondente.
   ========================================================================== */
(function () {
  const sb = '<div class="ms-sb"><span>9:41</span><span>● ● ▮</span></div>';
  const nav = (a) => '<div class="ms-nav">' + ['⌂', '🏋', '🍽', '📈', '⚙'].map((x, i) => '<b class="' + (i === a ? 'on' : '') + '">' + x + '</b>').join('') + '</div>';
  const wrap = (inner, a) => '<div class="ms">' + sb + inner + (a === undefined ? '' : nav(a)) + '</div>';

  const heat = () => {
    const pat = [0,1,0,0,2,0,1,0,0,3,0,1,0,0, 1,0,2,0,0,1,0,3,0,0,2,0,1,0, 0,2,0,1,0,0,3,0,1,0,2,0,0,1, 2,0,1,0,3,0,0,1,0,2,0,3,0,1];
    return '<div class="ms-heat">' + pat.map(v => '<i class="' + ['', 'a', 'b', 'c'][v] + '"></i>').join('') + '</div>';
  };
  const ex = (n, s) => '<div class="ms-row"><span>• ' + n + '</span><span>' + s + '</span></div>';
  const meal = (ico, n, k) => '<div class="ms-card ms-row"><div class="ms-row" style="gap:3cqw"><div class="ms-ico">' + ico + '</div><div><b style="font-size:3.6cqw">' + n + '</b><small>' + k + '</small></div></div><span>🗑</span></div>';
  const badge = (e, n, lock) => '<div class="ms-card ms-badge' + (lock ? ' lock' : '') + '"><div class="em">' + e + '</div><b>' + n + '</b><small>' + (lock ? '🔒' : '✓ Desbloqueada') + '</small></div>';
  const theme = (bg, n, tag) => '<div class="ms-theme" style="background:' + bg + '"><em>' + tag + '</em>' + n + '</div>';

  const SCREENS = {
    home: {
      title: 'Ecrã inicial',
      desc: 'O resumo do teu dia: calorias, macronutrientes e o treino de hoje, logo ao abrir a app.',
      html: () => wrap(
        '<div class="ms-top"><div><small>Bom dia,</small><b>Atleta 👋</b></div><div class="ms-av">A</div></div>' +
        '<div class="ms-hero"><small>META DIÁRIA</small><strong>1 480</strong><span>de 2 300 kcal</span><div class="ms-ring" style="--p:64%"><em>64%</em></div>' +
        '<div class="ms-pills"><span class="ms-pill">🔥 820 kcal rest.</span><span class="ms-pill">🥩 96g prot.</span></div></div>' +
        '<div class="ms-g2"><div class="ms-card"><b>🥩 96g</b><small>Proteína</small></div><div class="ms-card"><b>🍞 180g</b><small>Hidratos</small></div>' +
        '<div class="ms-card"><b>🥑 54g</b><small>Gordura</small></div><div class="ms-card"><b>🏆 5 dias</b><small>Sequência</small></div></div>' +
        '<div class="ms-h" style="font-size:4.2cqw">Treino de hoje</div>' +
        '<div class="ms-card ms-row"><div class="ms-row" style="gap:3cqw"><div class="ms-ico">🏋</div><div><b style="font-size:3.6cqw">Treino de Peito</b><small>5 exercícios</small></div></div><span>›</span></div>', 0)
    },
    treinos: {
      title: 'Treinos',
      desc: 'O treino do dia com exercícios, séries, repetições e cargas, e o histórico de tudo o que já fizeste.',
      html: () => wrap(
        '<div class="ms-h">Treinos 🏋️</div>' +
        '<div class="ms-card ms-or"><b>🏋️ Treino de hoje · Segunda-feira</b><small style="text-transform:none">🔥 ~310 kcal · ~45 min</small><div style="margin-top:2.4cqw">' +
        ex('Supino reto', '4x8 @ 60kg') + ex('Supino inclinado', '3x10 @ 40kg') + ex('Crucifixo', '3x12 @ 14kg') + ex('Flexões', '3x15') + '</div>' +
        '<div class="ms-btn" style="margin-top:3cqw">✓ Sim, já treinei</div></div>' +
        '<div class="ms-h" style="font-size:4.2cqw">Histórico</div>' +
        '<div class="ms-card"><div class="ms-row"><b style="font-size:3.8cqw">Treino de Costas</b><span>🗑</span></div><small style="text-transform:none">⏱ 48 min · 🔥 290 kcal</small></div>', 1)
    },
    plano: {
      title: 'Plano semanal',
      desc: 'Define os exercícios de cada dia da semana, com séries, repetições e peso, e vê a estimativa de gasto calórico.',
      html: () => wrap(
        '<div class="ms-top"><div class="ms-h">Plano semanal 📅</div><span>✕</span></div>' +
        '<div class="ms-chips">' + ['Seg •', 'Ter', 'Qua •', 'Qui', 'Sex •'].map((d, i) => '<span class="ms-chip' + (i === 0 ? ' on' : '') + '">' + d + '</span>').join('') + '</div>' +
        '<b style="font-size:4cqw">Segunda-feira</b>' +
        ['Supino reto|4x8 @ 60kg · Peito', 'Supino inclinado|3x10 @ 40kg · Peito', 'Elevações laterais|3x12 @ 8kg · Ombros'].map(x => { const p = x.split('|'); return '<div class="ms-card ms-row"><div><b style="font-size:3.6cqw">' + p[0] + '</b><small style="text-transform:none">' + p[1] + '</small></div><span>🗑</span></div>'; }).join('') +
        '<div style="font-size:3.2cqw;font-weight:600">🔥 Estimativa deste dia: ~310 kcal · ~45 min</div>' +
        '<div class="ms-btn ghost">＋ Adicionar exercício</div>')
    },
    nutricao: {
      title: 'Nutrição',
      desc: 'Regista as refeições e acompanha calorias, proteínas, hidratos de carbono e gorduras face às tuas metas.',
      html: () => wrap(
        '<div class="ms-h">Nutrição 🥗</div>' +
        '<div class="ms-card ms-or"><b style="font-size:3.8cqw">📊 Resumo de hoje</b><div class="ms-row" style="margin-top:2cqw"><span style="color:#eee">Calorias</span><span style="color:#fff">1 480 / 2 300 kcal</span></div><div class="ms-bar"><i style="--w:64%"></i></div>' +
        '<div class="ms-g3" style="margin-top:3cqw">' + [['🥩 Proteína', 62], ['🍞 Hidratos', 48], ['🥑 Gordura', 80]].map(m => '<div style="font-size:2.8cqw">' + m[0] + '<div class="ms-bar"><i style="--w:' + m[1] + '%"></i></div></div>').join('') + '</div></div>' +
        '<div class="ms-h" style="font-size:4.2cqw">Refeições de hoje</div>' +
        meal('🥣', 'Aveia com fruta', '420 kcal · P 18g') + meal('🍗', 'Frango com arroz', '640 kcal · P 48g') +
        '<div class="ms-nav" style="display:none"></div>', 2)
    },
    progresso: {
      title: 'Progresso',
      desc: 'Gráficos interativos do peso, estatísticas de treino e o acompanhamento dos teus objetivos.',
      html: () => wrap(
        '<div class="ms-h">Progresso 📈</div>' +
        '<div class="ms-card"><div class="ms-row"><div><small>Peso atual</small><div class="ms-big">72,4 <small>kg</small></div></div><span class="ms-delta" style="color:#4ade80">↓ 1,2 kg</span></div>' +
        '<div class="ms-chips" style="margin:2.4cqw 0">' + ['7D', '30D', '90D', 'Tudo'].map((d, i) => '<span class="ms-chip' + (i === 1 ? ' on' : '') + '">' + d + '</span>').join('') + '</div>' +
        '<svg class="ms-chart" viewBox="0 0 200 70" preserveAspectRatio="none"><defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F97316" stop-opacity=".45"/><stop offset="1" stop-color="#F97316" stop-opacity="0"/></linearGradient></defs>' +
        '<path d="M0 14 C30 12 40 26 65 28 S110 40 130 44 S175 52 200 56 L200 70 L0 70Z" fill="url(#mg)"/><path d="M0 14 C30 12 40 26 65 28 S110 40 130 44 S175 52 200 56" fill="none" stroke="#F97316" stroke-width="2.4" stroke-linecap="round"/><circle cx="200" cy="56" r="3.4" fill="#F97316"/></svg></div>' +
        '<div class="ms-g2"><div class="ms-card"><small>IMC</small><b>23,6</b><small style="text-transform:none">Peso normal</small></div><div class="ms-card"><small>Treinos</small><b>18</b><small style="text-transform:none">3 esta semana</small></div></div>', 3)
    },
    perfil: {
      title: 'Perfil',
      desc: 'O teu perfil com nível, experiência, estatísticas e um calendário de atividade ao estilo GitHub.',
      html: () => wrap(
        '<div class="ms-hero" style="padding:4cqw"><div class="ms-row" style="justify-content:flex-start;gap:3cqw"><div class="ms-av" style="width:14cqw;height:14cqw;font-size:6cqw;background:rgba(255,255,255,.25);border:.6cqw solid rgba(255,255,255,.8)">A</div><div><b style="font-size:5cqw;font-family:var(--display)">Atleta</b> <span class="ms-pill" style="color:#fff">Nv. 3</span><br><span>atleta@exemplo.pt</span></div></div>' +
        '<div class="ms-row" style="margin-top:3cqw;font-weight:600;color:#fff"><span style="color:#fff">Nível 3 · Dedicado</span><span>120/300 XP</span></div><div class="ms-bar" style="background:rgba(255,255,255,.28)"><i style="--w:40%;background:#fff"></i></div></div>' +
        '<div class="ms-g2"><div class="ms-card"><b>18</b><small>Treinos</small></div><div class="ms-card"><b>🔥 5 dias</b><small>Maior sequência</small></div></div>' +
        '<div class="ms-card"><b style="font-size:3.6cqw;margin-bottom:2cqw">🗓️ Calendário de atividade</b>' + heat() + '</div>', undefined)
    },
    conquistas: {
      title: 'Conquistas',
      desc: 'Medalhas desbloqueadas ao atingir marcos: treinos concluídos, dias seguidos e semanas de consistência.',
      html: () => wrap(
        '<div class="ms-h">🏆 Conquistas</div>' +
        '<div class="ms-g3">' + badge('🌱', 'Primeiro Passo') + badge('🥉', 'A Começar') + badge('🥈', 'Determinado', 1) +
        badge('🥇', 'Dedicado', 1) + badge('🔥', 'Em Chamas') + badge('⚡', 'Imparável', 1) +
        badge('🏆', 'Veterano', 1) + badge('📅', 'Consistente', 1) + badge('💎', 'Lenda StayFit', 1) + '</div>' +
        '<div class="ms-card"><div class="ms-row"><b style="font-size:3.4cqw">Próxima: Determinado</b><span>7/10</span></div><div class="ms-bar"><i style="--w:70%"></i></div></div>')
    },
    loja: {
      title: 'Loja de recompensas',
      desc: 'Troca os pontos ganhos em desafios por personalizações visuais e temas exclusivos para a app.',
      html: () => wrap(
        '<div class="ms-top"><div class="ms-h">🛍️ Loja</div><span class="ms-pill" style="background:rgba(249,115,22,.25);color:#ffd2b0;padding:1.6cqw 3cqw">⭐ Pontos</span></div>' +
        '<div class="ms-hero"><small>OS TEUS PONTOS</small><strong>— — —</strong><span>ganha mais a completar desafios</span></div>' +
        '<div class="ms-h" style="font-size:4.2cqw">Temas</div>' +
        '<div class="ms-g2">' + theme('linear-gradient(135deg,#F97316,#EA6A00)', 'Laranja', 'Equipado') + theme('linear-gradient(135deg,#1e293b,#0f172a)', 'Meia-noite', '🔒') +
        theme('linear-gradient(135deg,#34d399,#0ea5e9)', 'Aurora', '🔒') + theme('linear-gradient(135deg,#f472b6,#a855f7)', 'Neon', '🔒') + '</div>', undefined)
    },
    definicoes: {
      title: 'Definições',
      desc: 'Objetivo, nível de atividade, dados pessoais, lembretes e a aparência da app (tema claro ou escuro).',
      html: () => wrap(
        '<div class="ms-top"><div class="ms-h">Definições</div><span class="ms-av" style="background:#3A2820;font-size:4cqw">🌙</span></div>' +
        '<div class="ms-hero2"><div class="ms-row" style="justify-content:flex-start;gap:3cqw"><div class="ms-av" style="width:12cqw;height:12cqw">A</div><div><b style="font-size:4.6cqw;font-family:var(--display)">Atleta</b><br><span style="color:#a3a3a3">💪 Ganhar Músculo</span></div></div></div>' +
        '<div class="ms-seg"><b class="on">💪 Ganhar</b><b>🔥 Perder</b><b>⚖️ Manter</b></div>' +
        '<div class="ms-card"><div class="ms-row"><b style="font-size:3.6cqw">Moderadamente ativo</b><span style="color:#F97316">3/5</span></div><div class="ms-slider"><i></i></div></div>' +
        '<div class="ms-card ms-row"><div class="ms-row" style="gap:3cqw"><div class="ms-ico">💊</div><b style="font-size:3.4cqw">Lembrete de creatina</b></div><div class="ms-sw on"></div></div>' +
        '<div class="ms-card ms-row"><div class="ms-row" style="gap:3cqw"><div class="ms-ico" style="background:rgba(59,130,246,.18)">💧</div><b style="font-size:3.4cqw">Lembrete de água</b></div><div class="ms-sw on"></div></div>', 4)
    }
  };

  const ORDER = ['home', 'treinos', 'plano', 'nutricao', 'progresso', 'perfil', 'conquistas', 'loja', 'definicoes'];

  /* Preenche cada [data-screen] com a ilustração e tenta carregar a captura real */
  function hydrate(root) {
    (root || document).querySelectorAll('[data-screen]').forEach(function (el) {
      const key = el.getAttribute('data-screen');
      const s = SCREENS[key];
      if (!s || el.dataset.hydrated) return;
      el.dataset.hydrated = '1';
      el.innerHTML = s.html() + '<span class="screen-tag">Ilustração</span>';
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', 'Ilustração do ecrã: ' + s.title);

      const exts = ['png', 'jpg', 'jpeg', 'webp'];
      (function tryNext(i) {
        if (i >= exts.length) return;
        const img = new Image();
        img.className = 'shot';
        img.alt = 'Captura de ecrã real: ' + s.title;
        img.decoding = 'async';
        img.onload = function () {
          el.innerHTML = '';
          el.appendChild(img);
          el.dataset.real = '1';
          el.setAttribute('aria-label', 'Captura de ecrã: ' + s.title);
          el.dispatchEvent(new CustomEvent('screen:real', { bubbles: true }));
        };
        img.onerror = function () { tryNext(i + 1); };
        img.src = 'assets/screenshots/' + key + '.' + exts[i];
      })(0);
    });
  }

  window.StayFitMockups = { SCREENS: SCREENS, ORDER: ORDER, hydrate: hydrate };
})();
