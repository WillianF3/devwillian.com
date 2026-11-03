/* DevWillian V7 — scroll cinematográfico adaptado.
   Apenas APIs nativas do navegador. Sem GSAP extra, WebGL, canvas ou build step.
   A seção de Processo V6 continua usando suas dependências próprias e independentes.
*/
(() => {
  'use strict';
  const hero = document.querySelector('.ff-hero-sequence');
  const showcase = document.querySelector('.ff-showcase');
  if (!hero || !showcase) return;
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const lowWidth = () => innerWidth <= 810;
  if (prefersReducedMotion.matches) return;

  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const mix = (a, b, t) => a + (b - a) * t;
  const phase = (x, start, end) => clamp((x - start) / (end - start));
  const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const sel = (selector, parent = document) => parent.querySelector(selector);
  const els = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const stage = sel('.ff-hero-stage', hero);
  const art = sel('.ff-hero-art', stage);
  const figure = sel('.ff-hero-figure', stage);
  const heroCopy = sel('.ff-hero-copy', stage);
  const glows = els('.ff-glow', stage);
  const capsules = els('.ff-capsule', stage);
  const symbol = sel('.ff-capsule-symbol', stage);
  const marquee = sel('.ff-marquee', stage);
  const stats = sel('.ff-stats', stage);
  const statItems = els('.ff-stat', stats);
  const counts = els('[data-count]', stats);
  const showcaseStage = sel('.ff-showcase-stage', showcase);
  const showcaseHeading = sel('.ff-showcase-heading', showcase);
  const showcaseEyebrow = sel('.ff-showcase-eyebrow', showcase);
  const showcaseTitle = sel('h2', showcaseHeading);
  const showcaseCards = els('.ff-showcase-card', showcase);
  const showcaseGlow = sel('.ff-showcase-glow', showcase);
  const showcaseFooter = sel('.ff-showcase-footer', showcase);
  const navbarHeight = () => sel('#navbar')?.offsetHeight || 72;
  const params = new URLSearchParams(location.search);
  const fixedHero = params.has('progress') && !Number.isNaN(Number(params.get('progress'))) ? clamp(Number(params.get('progress'))) : null;
  const fixedShowcase = params.has('showcase') && !Number.isNaN(Number(params.get('showcase'))) ? clamp(Number(params.get('showcase'))) : null;
  let heroTarget = 0;
  let heroCurrent = 0;
  let showcaseTarget = 0;
  let showcaseCurrent = 0;
  let running = false;
  let heroLayout = null;
  let showcaseLayout = null;

  const computeLayout = () => {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const mobile = innerWidth < 810;
    const tablet = innerWidth >= 810 && innerWidth < 1200;
    const cw = width * (mobile ? .46 : tablet ? .30 : .235);
    const ch = cw * .6;
    const gap = width * (mobile ? .03 : .012);
    const rowGap = ch * .16;
    const cell = cw + gap;
    heroLayout = { width, height, cw, ch, cell, mobile, centers: [...Array(13)].map((_, i) => {
      const col = Number(capsules[i].dataset.col);
      const row = Number(capsules[i].dataset.row);
      return { x: width / 2 + (col - 2) * cell,
               y: height / 2 + (row - 1) * (ch + rowGap), row };
    }) };
    showcaseLayout = { width: showcaseStage.clientWidth, height: showcaseStage.clientHeight,
      mobile: innerWidth < 810 };
  };

  const getScrollProgress = (parent, sticky) => {
    const bounds = parent.getBoundingClientRect();
    const travel = Math.max(1, parent.offsetHeight - sticky.offsetHeight);
    return clamp((navbarHeight() - bounds.top) / travel);
  };
  const updateTargets = () => {
    document.body.classList.toggle('ff-hero-active', !lowWidth() && hero.getBoundingClientRect().bottom > navbarHeight());
    if (lowWidth()) return; // No forced cinematic scroll on touch-sized screens.
    heroTarget = fixedHero ?? getScrollProgress(hero, stage);
    showcaseTarget = fixedShowcase ?? getScrollProgress(showcase, showcaseStage);
    requestTick();
  };

  const renderHero = p => {
    if (!heroLayout || lowWidth()) return;
    const { width: w, height: h, cw, ch, cell, mobile, centers } = heroLayout;
    const copyOut = easeInOut(phase(p, .13, .32));
    heroCopy.style.opacity = String(1 - copyOut);
    heroCopy.style.transform = `translateY(${-28 * copyOut}px)`;
    heroCopy.style.visibility = copyOut >= 1 ? 'hidden' : 'visible';
    heroCopy.style.pointerEvents = copyOut >= .9 ? 'none' : 'auto';

    // The decorative figure flows into the empty center slot of the capsule grid.
    const compress = easeInOut(phase(p, .19, .39));
    const heroX = mix(0, w / 2 - cw / 2, compress);
    const heroY = mix(0, h / 2 - ch / 2, compress);
    art.style.left = `${heroX}px`;
    art.style.top = `${heroY}px`;
    art.style.width = `${mix(w, cw, compress)}px`;
    art.style.height = `${mix(h, ch, compress)}px`;
    // iOS Safari: overflow:hidden + border-radius sometimes fails to clip the
    // animated canvas/SVG layers after the hero shrinks into the central capsule.
    // A matching clip-path provides a compositor-safe rounded crop on mobile.
    const clipRadius = mix(0, ch / 2, compress);
    const roundedCrop = `inset(0px round ${clipRadius.toFixed(2)}px)`;
    art.style.borderRadius = `${clipRadius.toFixed(2)}px`;
    art.style.clipPath = roundedCrop;
    art.style.webkitClipPath = roundedCrop;
    art.style.opacity = String(1 - easeInOut(phase(p, .50, .58)));
    // V7.7: independent portrait / scenery retain the original JS capsule transition.
    figure.style.left = `${mix(innerWidth <= 520 ? 7 : mobile ? 17 : 42, 0, compress)}%`;
    figure.style.width = `${mix(innerWidth <= 520 ? 86 : mobile ? 67 : 50, 100, compress)}%`;
    figure.style.height = `${mix(innerWidth <= 520 ? 75 : mobile ? 88 : 109, 100, compress)}%`;
    figure.style.bottom = `${mix(innerWidth <= 520 ? -6 : mobile ? -7 : -12, 0, compress)}%`;
    art.style.setProperty('--ff-scroll-compress', String(compress));
    glows.forEach(g => { g.style.opacity = String((g.classList.contains('ff-glow-red') ? .38 : .19) * (1 - compress)); });

    const gridShift = 2 * cell * easeInOut(phase(p, .40, .58));
    capsules.forEach((card, i) => {
      const { x, y, row } = centers[i];
      const start = row === 0 ? .12 : row === 2 ? .15 : .17;
      const end = row === 0 ? .34 : row === 2 ? .37 : .38;
      const enter = easeOut(phase(p, start + i * .005, end + i * .003));
      const side = row === 0 ? -1 : row === 2 ? 1 : Number(card.dataset.col) < 2 ? -1 : 1;
      const entranceOffset = side * (row === 1 ? .7 * w : w * 1.25) * (1 - enter);
      const exitP = easeInOut(phase(p, .41, .59));
      const exitSide = row === 0 ? 1 : row === 2 ? -1 : 0;
      const exitOffset = exitSide * w * 1.5 * exitP;
      const middleOut = row === 1 ? 1 - easeInOut(phase(p, .50, .58)) : 1;
      card.style.width = `${cw}px`;
      card.style.height = `${ch}px`;
      card.style.left = `${x + entranceOffset + gridShift * -1 + exitOffset}px`;
      card.style.top = `${y}px`;
      card.style.opacity = String(enter * (row === 1 ? middleOut : 1 - phase(p, .63, .72)));
      card.style.transform = `translate(-50%,-50%) scale(${mix(1, .85, row === 1 ? 1 - middleOut : 0)})`;
    });

    // Eighth-direction logo follows the disappearing central grid.
    const limeBaseX = w / 2 + 2 * cell;
    const symEnter = easeOut(phase(p, .18, .38));
    const symOut = easeInOut(phase(p, .92, 1));
    const symScale = mix(1, .72, easeInOut(phase(p, .58, .72)));
    const symUp = .75 * w * easeInOut(phase(p, .62, .74));
    let symX = limeBaseX - 2 * cell * easeInOut(phase(p, .40, .58));
    // Collision safety: after marquee begins, keep symbol to the left.
    if (p > .60) symX = Math.min(symX, w * .26);
    symbol.style.width = `${cw}px`;
    symbol.style.height = `${ch}px`;
    symbol.style.left = `${symX}px`;
    symbol.style.top = `${h / 2 - symUp}px`;
    symbol.style.opacity = String(symEnter * (1 - symOut));
    symbol.style.transform = `translate(-50%,-50%) scale(${symScale})`;

    const textStep = phase(p, .60, .86);
    const measuredTextWidth = marquee.scrollWidth;
    marquee.style.opacity = String(phase(p, .59, .65) * (1 - phase(p, .85, .92)));
    marquee.style.transform = `translate(${mix(w, -measuredTextWidth, textStep)}px,-50%)`;

    const statsIn = phase(p, .74, .84);
    stats.style.opacity = String(statsIn);
    stats.style.pointerEvents = statsIn > .98 ? 'auto' : 'none';
    // Stat cards move individually from the right, not just the parent container.
    statItems.forEach((card, i) => {
      const appear = easeOut(phase(p, .76 + i * .025, .90 + i * .02));
      card.style.opacity = String(phase(p, .76 + i * .025, .84 + i * .025));
      card.style.transform = `translateX(${(1 - appear) * (mobile ? w * .95 : w * .56)}px)`;
    });
    counts.forEach((node, i) => {
      const value = Number(node.dataset.count);
      const digits = Number(node.dataset.digits || 1);
      const countT = easeOut(phase(p, .80 + i * .005, .93));
      node.textContent = String(Math.round(value * countT)).padStart(digits, '0');
    });
  };

  const renderShowcase = p => {
    if (lowWidth() || !showcaseLayout) return;
    const { width, height, mobile } = showcaseLayout;
    const settle = easeInOut(phase(p, .04, .34));
    const left = mix(width / 2, mobile ? 24 : Math.max(35, (width - 1320) / 2), settle);
    const top = mix(height / 2, mobile ? 32 : 44, settle);
    const font = mix(mobile ? Math.min(72, width * .15) : Math.min(144, width * .075), mobile ? Math.min(33, width * .072) : Math.min(58, width * .034), settle);
    showcaseHeading.style.left = `${left}px`;
    showcaseHeading.style.top = `${top}px`;
    showcaseHeading.style.transform = `translate(${-50 * (1 - settle)}%,${-50 * (1 - settle)}%)`;
    showcaseHeading.style.textAlign = settle > .55 ? 'left' : 'center';
    showcaseTitle.style.fontSize = `${font}px`;
    showcaseEyebrow.style.opacity = String(phase(p, .19, .36));
    showcaseCards.forEach((card, i) => {
      const appear = easeInOut(phase(p, .28 + i * .055, .52 + i * .055));
      card.style.opacity = String(appear);
      card.style.transform = `translateY(${110 * (1 - appear)}px)`;
      card.style.pointerEvents = appear > .75 ? 'auto' : 'none';
    });
    showcaseFooter.style.opacity = String(phase(p, .45, .62));
    showcaseGlow.style.opacity = String(1 - phase(p, .66, .96));
  };

  const tick = () => {
    heroCurrent = mix(heroCurrent, heroTarget, .105);
    showcaseCurrent = mix(showcaseCurrent, showcaseTarget, .095);
    if (Math.abs(heroTarget - heroCurrent) < .00002) heroCurrent = heroTarget;
    if (Math.abs(showcaseTarget - showcaseCurrent) < .00002) showcaseCurrent = showcaseTarget;
    renderHero(heroCurrent);
    renderShowcase(showcaseCurrent);
    if (heroCurrent !== heroTarget || showcaseCurrent !== showcaseTarget) {
      requestAnimationFrame(tick);
    } else {
      running = false;
    }
  };
  const requestTick = () => {
    if (running) return;
    running = true;
    requestAnimationFrame(tick);
  };
  const observeReveals = () => {
    const targets = els('[data-ff-reveal]');
    if (!('IntersectionObserver' in window)) { targets.forEach(el => el.classList.add('ff-is-visible')); return; }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('ff-is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: .08, rootMargin: '0px 0px -25px 0px' });
    targets.forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight * .94) el.classList.add('ff-is-visible');
      observer.observe(el);
    });
  };

  // The mobile showcase is deliberately static below 520px: no clipping or sticky card overlap.
  const refresh = () => { computeLayout(); updateTargets(); };
  document.documentElement.classList.add('ff-motion-ready');
  computeLayout();
  observeReveals();
  updateTargets();
  addEventListener('scroll', updateTargets, { passive: true });
  let resizeTimeout;
  addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(refresh, 120);
  }, { passive: true });
  addEventListener('load', refresh, { once: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh).catch(() => {});
})();
