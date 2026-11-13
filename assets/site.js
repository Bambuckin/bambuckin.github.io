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
