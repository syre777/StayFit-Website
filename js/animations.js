/* ==========================================================================
   StayFit — animações em JS puro, inspiradas no React Bits:
   Split Text, Blur Text, Text Reveal, Gooey Text, Scroll Reveal (entra/sai),
   Spotlight Cards, Tilt 3D, Magnetic Buttons, Parallax
   ========================================================================== */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const lite = document.documentElement.classList.contains('lite');

  /* ---------- Split Text: letras em cascata ---------- */
  document.querySelectorAll('[data-split]').forEach(function (el) {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.textContent = '';
    let i = 0;
    text.split(' ').forEach(function (w, wi, arr) {
      const word = document.createElement('span');
      word.className = 'word';
      word.setAttribute('aria-hidden', 'true');
      Array.from(w).forEach(function (c) {
        const s = document.createElement('span');
        s.className = 'ch';
        s.textContent = c;
        s.style.setProperty('--i', i++);
        word.appendChild(s);
      });
      el.appendChild(word);
      if (wi < arr.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });

  /* ---------- Blur Text: palavras que ganham nitidez ---------- */
  document.querySelectorAll('[data-blur]').forEach(function (el) {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.textContent = '';
    text.split(' ').forEach(function (w, i, arr) {
      const s = document.createElement('span');
      s.className = 'bw';
      s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--i', i);
      s.textContent = w + (i < arr.length - 1 ? ' ' : '');
      el.appendChild(s);
    });
  });

  /* ---------- Text Reveal: máscara que sobe (uma linha por <br> ou por elemento) ---------- */
  document.querySelectorAll('[data-textreveal]').forEach(function (el) {
    const lines = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = '';
    lines.forEach(function (l, i) {
      const m = document.createElement('span');
      m.className = 'tr-mask';
      const inn = document.createElement('span');
      inn.className = 'tr-in';
      inn.style.setProperty('--i', i);
      inn.innerHTML = l;
      m.appendChild(inn);
      el.appendChild(m);
    });
  });

  /* ---------- Scroll Reveal: entra e sai ---------- */
  const targets = document.querySelectorAll('.reveal, [data-split], [data-blur], [data-textreveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (t) { t.classList.add('in'); });
  } else {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('in');
        else if (e.target.dataset.once === undefined) {
          // sai apenas quando já está bem fora do ecrã (evita cintilar)
          const r = e.boundingClientRect;
          if (r.bottom < -80 || r.top > window.innerHeight + 80) e.target.classList.remove('in');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------- Gooey Text ---------- */
  document.querySelectorAll('[data-gooey]').forEach(function (el) {
    const texts = el.getAttribute('data-gooey').split('|');
    const a = el.querySelector('.g1');
    const b = el.querySelector('.g2');
    if (!a || !b) return;
    a.textContent = texts[0];
    el.setAttribute('aria-label', texts.join('. '));
    a.setAttribute('aria-hidden', 'true');
    b.setAttribute('aria-hidden', 'true');
    if (reduce || texts.length < 2) { b.textContent = ''; return; }

    const MORPH = 1.3, HOLD = 2.4;
    let idx = 0, morph = 0, hold = HOLD, last = performance.now(), running = true, morphing = false;
    b.textContent = texts[1];

    function frac(f) {
      if (lite) { b.style.opacity = f; a.style.opacity = 1 - f; return; }
      b.style.filter = 'blur(' + Math.min(8 / Math.max(f, 0.0001) - 8, 100) + 'px)';
      b.style.opacity = Math.pow(f, 0.4);
      const g = 1 - f;
      a.style.filter = 'blur(' + Math.min(8 / Math.max(g, 0.0001) - 8, 100) + 'px)';
      a.style.opacity = Math.pow(g, 0.4);
    }
    frac(0);

    function tick(now) {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!morphing) {
        hold -= dt;
        if (hold <= 0) {
          morphing = true; morph = 0;
          a.textContent = texts[idx % texts.length];
          b.textContent = texts[(idx + 1) % texts.length];
        }
      } else {
        morph += dt;
        const f = Math.min(morph / MORPH, 1);
        frac(f);
        if (f >= 1) {
          morphing = false; hold = HOLD; idx = (idx + 1) % texts.length;
          a.textContent = texts[idx];
          b.textContent = texts[(idx + 1) % texts.length];
          frac(0);
        }
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running) { last = performance.now(); requestAnimationFrame(tick); }
    });
  });

  /* ---------- Spotlight Cards ---------- */
  document.querySelectorAll('.spot').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- Tilt Cards 3D ---------- */
  if (canHover && !reduce) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      const max = parseFloat(el.getAttribute('data-tilt')) || 8;
      el.addEventListener('pointerenter', function () { el.classList.add('tilting'); });
      el.addEventListener('pointermove', function (e) {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateX(' + (-py * max) + 'deg) rotateY(' + (px * max) + 'deg) translateZ(0) scale(1.015)';
      });
      el.addEventListener('pointerleave', function () {
        el.classList.remove('tilting');
        el.style.transform = '';
      });
    });

    /* ---------- Botões magnéticos ---------- */
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      const pull = parseFloat(el.getAttribute('data-magnetic')) || 0.3;
      el.addEventListener('pointermove', function (e) {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate(' + (x * pull) + 'px,' + (y * pull) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- Parallax ao scroll ---------- */
  const px = document.querySelectorAll('[data-parallax]');
  if (px.length && !reduce && !lite) {
    let ticking = false;
    function update() {
      const vh = window.innerHeight;
      px.forEach(function (el) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        el.style.transform = 'translate3d(0,' + ((r.top + r.height / 2 - vh / 2) * -speed).toFixed(1) + 'px,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Hero: movimento com o rato (telemóvel 3D + elementos em profundidade) ---------- */
  const hero = document.querySelector('.hero');
  const phone = document.querySelector('[data-hero-phone]');
  if (hero && phone && canHover && !reduce) {
    const depth = hero.querySelectorAll('[data-depth]');
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    hero.addEventListener('pointermove', function (e) {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    hero.addEventListener('pointerleave', function () { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
    function loop() {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      phone.style.transform = 'rotateY(' + (-18 + cx * 14) + 'deg) rotateX(' + (6 - cy * 10) + 'deg)';
      depth.forEach(function (d) {
        const k = parseFloat(d.getAttribute('data-depth'));
        d.style.translate = (cx * k * 30) + 'px ' + (cy * k * 30) + 'px';
      });
      if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) raf = requestAnimationFrame(loop); else raf = null;
    }
    phone.style.transform = 'rotateY(-18deg) rotateX(6deg)';
  } else if (phone) {
    phone.style.transform = 'rotateY(-10deg) rotateX(4deg)';
  }
})();
