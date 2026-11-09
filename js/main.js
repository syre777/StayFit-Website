/* StayFit — scripts gerais: config, ecrãs, contadores, FAQ, scroll suave, partículas */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CFG = window.STAYFIT_CONFIG || {};

  /* ---------- Ano no rodapé ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Valores da configuração ---------- */
  document.querySelectorAll('[data-config]').forEach(function (el) {
    const path = el.getAttribute('data-config').split('.');
    let v = CFG;
    path.forEach(function (k) { v = v && v[k]; });
    if (v) el.textContent = v;
    else if (el.hasAttribute('data-hide-empty')) el.closest('[data-hide-wrap]') ? (el.closest('[data-hide-wrap]').hidden = true) : (el.hidden = true);
  });

  /* ---------- Ecrãs ilustrativos / capturas reais ---------- */
  if (window.StayFitMockups) window.StayFitMockups.hydrate(document);

  /* ---------- Contadores animados ---------- */
  const counters = document.querySelectorAll('[data-count]');
  function runCounter(el) {
    const end = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduce) { el.textContent = end; return; }
    const dur = 1700, t0 = performance.now();
    (function step(now) {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  if ('IntersectionObserver' in window && counters.length) {
    const io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { runCounter(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { c.textContent = '0'; io.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute('data-count'); });
  }

  /* ---------- Acordeão (FAQ) ---------- */
  document.querySelectorAll('.accordion').forEach(function (acc) {
    const items = acc.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      const btn = item.querySelector('.faq-q');
      btn.addEventListener('click', function () {
        const open = !item.classList.contains('open');
        items.forEach(function (o) {
          o.classList.remove('open');
          o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        });
        if (open) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
      });
    });
    // Abrir a pergunta indicada no endereço (#pontos, etc.)
    if (location.hash) {
      const t = acc.querySelector(location.hash);
      if (t && t.classList.contains('faq-item')) t.querySelector('.faq-q').click();
    }
  });

  /* ---------- Scroll suave com compensação do menu (links #âncora) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  });

  /* ---------- Partículas de fundo (canvas) ---------- */
  const canvas = document.getElementById('particles');
  if (canvas && !reduce) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 1.5), parts = [], raf = null;
    const mouse = { x: -999, y: -999 };

    function resize() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(70, Math.max(24, (w * h) / 26000)));
      parts = Array.from({ length: n }, function () {
        return { x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: Math.random() * 1.8 + .6 };
      });
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 14000) { p.x += dx * 0.012; p.y += dy * 0.012; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx.fillStyle = 'rgba(255,140,50,.75)';
        ctx.fill();
        for (let j = i + 1; j < parts.length; j++) {
          const q = parts[j], ax = p.x - q.x, ay = p.y - q.y, dd = ax * ax + ay * ay;
          if (dd < 11000) {
            ctx.strokeStyle = 'rgba(255,107,0,' + (0.2 * (1 - dd / 11000)) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    resize();
    draw();
    let rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(resize, 150); });
    window.addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { cancelAnimationFrame(raf); raf = null; } else if (!raf) draw();
    });
  }
})();
