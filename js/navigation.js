/* StayFit — navegação: menu fixo, hamburger, página ativa, barra de progresso, transições entre páginas */
(function () {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Página ativa (caso o HTML não a tenha marcado)
  if (menu && !menu.querySelector('[aria-current]')) {
    const file = location.pathname.split('/').pop() || 'index.html';
    menu.querySelectorAll('a').forEach(function (a) {
      if (a.getAttribute('href') === file) a.setAttribute('aria-current', 'page');
    });
  }

  // Fundo "glass" + barra de progresso ao fazer scroll
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 12);
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    header.style.setProperty('--progress', (max > 0 ? (window.scrollY / max) * 100 : 0) + '%');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger
  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('open', open);
    document.body.style.overflow = open && window.innerWidth <= 960 ? 'hidden' : '';
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); toggle.focus(); } });
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('open') && !menu.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 960) setMenu(false); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  }

  // Entrada/saída suave entre páginas
  requestAnimationFrame(function () { document.body.classList.add('ready'); });
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { document.body.classList.remove('leaving'); document.body.classList.add('ready'); }
  });
  if (!reduce) {
    document.addEventListener('click', function (e) {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (a.target && a.target !== '_self') return;
      if (a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      if (!/\.html?$|\/$/.test(url.pathname)) return;
      e.preventDefault();
      document.body.classList.add('leaving');
      setTimeout(function () { location.href = a.href; }, 220);
    });
  }
})();
