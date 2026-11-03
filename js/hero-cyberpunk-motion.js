/* DevWillian V7.7 — partículas e parallax do hero. Apenas JavaScript nativo.
   Não altera os elementos controlados pela animação de scroll do arquivo flowers-futuristic-adaptado.js.
   Respeita prefers-reduced-motion, aba em segundo plano, resize e telas touch. */
(() => {
  'use strict';
  const scene = document.querySelector('.ff-cyberpunk-art');
  const stage = document.querySelector('.ff-hero-stage');
  const canvas = scene?.querySelector('.ff-cyber-particles');
  if (!scene || !stage || !canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;
  const desktopFine = matchMedia('(pointer:fine)');
  let width = 0, height = 0, ratio = 1;
  let active = false, raf = 0, last = 0, px = 0, py = 0, tx = 0, ty = 0;
  const points = [];
  const pointCount = window.innerWidth <= 810 ? 12 : 30;
  const random = (a, b) => Math.random() * (b - a) + a;

  const resetPoints = () => {
    points.length = 0;
    for (let i = 0; i < pointCount; i++) points.push({
      x: random(0, width), y: random(0, height),
      vx: random(-.12, .12), vy: random(-.18, -.04),
      r: random(.6, 1.8), opacity: random(.18, .67),
      phase: random(0, Math.PI * 2), cyan: i % 2 === 0
    });
  };
  const resize = () => {
    const box = scene.getBoundingClientRect();
    width = Math.max(1, box.width);
    height = Math.max(1, box.height);
    ratio = Math.min(window.devicePixelRatio || 1, window.innerWidth <= 810 ? 1.25 : 1.6);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    resetPoints();
  };
  const onPointer = e => {
    if (!desktopFine.matches) return;
    const b = stage.getBoundingClientRect();
    tx = ((e.clientX - b.left) / b.width - .5) * 36;
    ty = ((e.clientY - b.top) / b.height - .5) * 27;
  };
  const paint = time => {
    raf = 0;
    if (!active || document.hidden) return;
    const delta = Math.min(45, time - (last || time)) / 16.67;
    last = time;
    px += (tx - px) * .065;
    py += (ty - py) * .065;
    scene.style.setProperty('--ff-mouse-x', `${px.toFixed(2)}px`);
    scene.style.setProperty('--ff-mouse-y', `${py.toFixed(2)}px`);
    scene.style.setProperty('--ff-circuit-x', `${(-px * .18).toFixed(2)}px`);
    scene.style.setProperty('--ff-circuit-y', `${(-py * .18).toFixed(2)}px`);
    scene.style.setProperty('--ff-portrait-x', `${(px * .21).toFixed(2)}px`);
    scene.style.setProperty('--ff-portrait-y', `${(py * .17).toFixed(2)}px`);
    ctx.clearRect(0, 0, width, height);
    const clock = time * .001;
    points.forEach(p => {
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      if (p.x < -5) p.x = width + 5;
      if (p.x > width + 5) p.x = -5;
      if (p.y < -5) p.y = height + 5;
      const alpha = p.opacity * (.74 + Math.sin(clock * 1.8 + p.phase) * .26);
      const rgb = p.cyan ? '11,224,243' : '255,40,94';
      ctx.beginPath();ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb},${alpha})`;ctx.fill();
      if (p.r > 1.35) {
        ctx.beginPath();ctx.moveTo(p.x, p.y + p.r);ctx.lineTo(p.x - 1.5, p.y + 10);
        ctx.strokeStyle = `rgba(${rgb},${alpha * .25})`;ctx.lineWidth = .8;ctx.stroke();
      }
    });
    raf = requestAnimationFrame(paint);
  };
  const start = () => {
    if (document.hidden) return;
    if (!width || !height) resize();
    active = true;
    if (!raf) raf = requestAnimationFrame(paint);
  };
  const stop = () => {
    active = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
  };
  const visibility = () => document.hidden ? stop() : (stage.getBoundingClientRect().bottom > 0 && stage.getBoundingClientRect().top < innerHeight && start());
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) start(); else stop();
  }, { threshold: 0 });
  observer.observe(stage);
  resize();
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(scene);
  else addEventListener('resize', resize, { passive: true });
  stage.addEventListener('pointermove', onPointer, { passive: true });
  stage.addEventListener('pointerleave', () => { tx = 0; ty = 0; }, { passive: true });
  document.addEventListener('visibilitychange', visibility);
})();
