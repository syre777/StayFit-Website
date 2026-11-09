/* StayFit — download do APK: ligação real + verificação de disponibilidade (sem simular nada) */
(function () {
  const CFG = window.STAYFIT_CONFIG || {};
  const btns = document.querySelectorAll('[data-apk-btn]');
  const status = document.getElementById('dl-status');
  if (!btns.length) return;

  const apk = CFG.apkPath || 'assets/downloads/StayFit.apk';

  // Ligação HTML real (funciona sem JavaScript)
  btns.forEach(function (b) {
    b.setAttribute('href', apk);
    b.setAttribute('download', CFG.apkDownloadName || 'StayFit.apk');
  });

  // Requisitos configuráveis
  const list = document.getElementById('requirements');
  if (list && Array.isArray(CFG.requirements)) {
    list.innerHTML = '';
    CFG.requirements.forEach(function (r) {
      const li = document.createElement('li');
      const a = document.createElement('span');
      const b = document.createElement('span');
      a.textContent = r.label; b.textContent = r.value;
      li.appendChild(a); li.appendChild(b);
      list.appendChild(li);
    });
  }

  const ICON_WARN = '<svg viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/></svg>';
  const ICON_OK = '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>';

  function setStatus(kind, html) {
    if (!status) return;
    status.className = 'dl-status show ' + kind;
    status.innerHTML = (kind === 'ok' ? ICON_OK : ICON_WARN) + '<div>' + html + '</div>';
  }

  let available = null;

  function markUnavailable() {
    available = false;
    btns.forEach(function (b) { b.setAttribute('aria-disabled', 'true'); b.removeAttribute('download'); });
    setStatus('warn', '<strong>O APK ainda não está disponível.</strong><br>O ficheiro <code>' + apk + '</code> não foi encontrado neste site. Volta a tentar mais tarde.');
  }
  function markAvailable(size) {
    available = true;
    btns.forEach(function (b) { b.removeAttribute('aria-disabled'); });
    const sizeEl = document.querySelector('[data-apk-size]');
    if (sizeEl && size) sizeEl.textContent = size;
    setStatus('ok', '<strong>APK disponível.</strong> Versão ' + (CFG.version || '') + (size ? ' · ' + size : '') + '.');
  }

  // O botão não faz nada enquanto o ficheiro não existir
  btns.forEach(function (b) {
    b.addEventListener('click', function (e) {
      if (available === false) {
        e.preventDefault();
        markUnavailable();
        if (status) status.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // Verifica se o ficheiro existe (HEAD). Em file:// não é possível verificar.
  if (location.protocol === 'file:') {
    setStatus('warn', 'Abre o site com o <strong>Live Server</strong> (ou num servidor) para o botão de download poder verificar o APK.');
    return;
  }
  fetch(apk, { method: 'HEAD', cache: 'no-store' }).then(function (res) {
    const type = (res.headers.get('content-type') || '').toLowerCase();
    if (!res.ok || type.indexOf('text/html') === 0) return markUnavailable();
    const len = parseInt(res.headers.get('content-length') || '0', 10);
    markAvailable(len > 0 ? (len / 1048576).toFixed(1).replace('.', ',') + ' MB' : '');
  }).catch(markUnavailable);
})();
