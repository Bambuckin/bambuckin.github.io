(() => {
  // Растущие полосы шкалы — единственное движение ниже первого экрана
  const grow = [...document.querySelectorAll('.grow')];
  const show = (el) => el.classList.add('in');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    grow.forEach(show);
  } else {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -10% 0px' });
    grow.forEach((el) => io.observe(el));
    setTimeout(() => grow.forEach(show), 4000);
  }
  window.addEventListener('beforeprint', () => grow.forEach(show));

  // Копирование номера (для MAX)
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    const hint = btn;
    const base = btn.textContent;
    btn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(btn.dataset.copy); if (hint) hint.textContent = btn.dataset.done; }
      catch (_) { hint.textContent = btn.dataset.copy; }
      setTimeout(() => { if (hint) hint.textContent = base; }, 2200);
    });
  });
})();

/* s29d: где пиджак касается боковых краёв фото (с учётом object-fit: cover) → --jl / --jr в % высоты карточки */
(() => {
  const fig = document.querySelector('.page-ai .hero__media, .page-cv .hero__media');
  const img = fig && fig.querySelector('img');
  if (!img) return;
  let data, N = 400;
  const prep = () => {
    try { const c = document.createElement('canvas'); c.width = c.height = N; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0, N, N); data = x.getImageData(0, 0, N, N).data; } catch (_) { data = null; }
  };
  const edgeY = (sx) => { // первая сверху тёмная точка в столбце исходника sx (0..N-1)
    for (let y = 0; y < N; y++) { const i = (y * N + sx) * 4; if (data[i] + data[i + 1] + data[i + 2] < 360) return y; }
    return N;
  };
  const place = () => {
    if (!data || innerWidth < 861) return;
    const W = fig.clientWidth, H = fig.clientHeight, s = Math.max(W, H) / N, ox = (W - N * s) / 2;
    const col = (px) => Math.min(N - 1, Math.max(0, Math.round((px - ox) / s)));
    const pct = (sy) => Math.min(100, (sy * s / H) * 100).toFixed(2) + '%';
    fig.style.setProperty('--jl', pct(edgeY(col(3))));
    fig.style.setProperty('--jr', pct(edgeY(col(W - 4))));
  };
  const go = () => { prep(); place(); };
  if (img.complete && img.naturalWidth) go(); else img.addEventListener('load', go, { once: true });
  addEventListener('resize', place);
})();
