/* StayFit — galeria: carrossel 3D com setas, pontos, miniaturas, teclado e deslize */
(function () {
  const root = document.getElementById('carousel');
  if (!root || !window.StayFitMockups) return;

  const M = window.StayFitMockups;
  const keys = M.ORDER;
  const n = keys.length;
  const stage = root.querySelector('.car-stage');
  const dotsBox = root.querySelector('.car-dots');
  const thumbsBox = document.getElementById('thumbs');
  const capTitle = root.querySelector('.car-caption h3');
  const capDesc = root.querySelector('.car-caption p');
  const capBadge = root.querySelector('.car-caption .badge');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = 0;

  // Slides
  const slides = keys.map(function (k, i) {
    const s = document.createElement('div');
    s.className = 'car-slide';
    s.setAttribute('role', 'group');
    s.setAttribute('aria-roledescription', 'diapositivo');
    s.setAttribute('aria-label', (i + 1) + ' de ' + n + ': ' + M.SCREENS[k].title);
    s.innerHTML = '<div class="phone"><div class="phone-frame"><div class="phone-screen" data-screen="' + k + '"></div><div class="phone-notch"></div><div class="phone-glare"></div></div></div>';
    s.addEventListener('click', function () { if (i !== active) go(i); });
    stage.appendChild(s);
    return s;
  });
  M.hydrate(stage);

  // Pontos e miniaturas
  const dots = keys.map(function (k, i) {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Ver ' + M.SCREENS[k].title);
    b.addEventListener('click', function () { go(i); });
    dotsBox.appendChild(b);
    return b;
  });
  const thumbs = keys.map(function (k, i) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = M.SCREENS[k].title;
    b.addEventListener('click', function () { go(i); });
    thumbsBox.appendChild(b);
    return b;
  });

  function render() {
    const half = n / 2;
    slides.forEach(function (s, i) {
      let d = i - active;
      if (d > half) d -= n;
      if (d < -half) d += n;
      const abs = Math.abs(d);
      s.style.setProperty('--d', d);
      s.style.setProperty('--abs', Math.min(abs, 3));
      s.dataset.hidden = abs > 2 ? 'true' : 'false';
      s.classList.toggle('active', i === active);
      s.setAttribute('aria-hidden', i === active ? 'false' : 'true');
    });
    dots.forEach(function (d, i) { d.classList.toggle('on', i === active); d.setAttribute('aria-current', i === active ? 'true' : 'false'); });
    thumbs.forEach(function (t, i) { t.classList.toggle('on', i === active); });
    caption();
  }

  function caption() {
    const k = keys[active];
    const real = slides[active].querySelector('.phone-screen').dataset.real === '1';
    capTitle.textContent = M.SCREENS[k].title;
    capDesc.textContent = M.SCREENS[k].desc;
    capBadge.textContent = real ? 'Captura de ecrã real' : 'Ilustração — substitui por uma captura real';
    capBadge.classList.toggle('real', real);
  }

  function go(i) { active = (i + n) % n; render(); }
  root.querySelector('.car-prev').addEventListener('click', function () { go(active - 1); });
  root.querySelector('.car-next').addEventListener('click', function () { go(active + 1); });
  stage.addEventListener('screen:real', caption);

  // Teclado
  root.setAttribute('tabindex', '0');
  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
  });

  // Deslizar no telemóvel / arrastar com o rato
  let sx = null;
  stage.addEventListener('pointerdown', function (e) { sx = e.clientX; });
  window.addEventListener('pointerup', function (e) {
    if (sx === null) return;
    const dx = e.clientX - sx;
    sx = null;
    if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
  });
  stage.addEventListener('pointercancel', function () { sx = null; });

  // Abrir diretamente num ecrã (galeria.html#plano)
  const h = location.hash.replace('#', '');
  if (keys.indexOf(h) >= 0) active = keys.indexOf(h);

  render();
})();
