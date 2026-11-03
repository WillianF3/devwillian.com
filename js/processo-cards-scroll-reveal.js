/* DevWillian / Processo Scroll Reveal — GSAP 3.13 (ScrollTrigger + SplitText)
 * O conteúdo permanece acessível e visível sem JS/CDN ou com movimento reduzido.
 * As instâncias são totalmente revertidas antes de reconstruir no resize.
 */
(() => {
  'use strict';

  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => fn(...args), delay);
    };
  }

  function initProcessoCardsScrollReveal(root = document) {
    const sections = [...root.querySelectorAll('[data-effect="processo-cards-scroll-reveal"]')];
    const { gsap, ScrollTrigger, SplitText } = window;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!sections.length || !gsap || !ScrollTrigger || !SplitText || reduceMotion) {
      return () => {};
    }

    gsap.registerPlugin(ScrollTrigger, SplitText);
    const contexts = [];
    const splits = [];

    for (const section of sections) {
      const context = gsap.context(() => {
        const title = section.querySelector('.effect-title');
        const subtitle = section.querySelector('.effect-subtitle');
        const cards = [...section.querySelectorAll('.effect-card')];
        if (title) {
          const split = new SplitText(title, {
            type: 'lines, words, chars', mask: 'lines', autoSplit: true,
            linesClass: 'line-split', wordDelimiter: '\u200D'
          });
          splits.push(split);
          const tween = gsap.from(split.chars, {
            yPercent: 100, opacity: 0, duration: .8,
            stagger: { amount: .2 }, ease: 'power4.out', paused: true
          });
          ScrollTrigger.create({
            trigger: title, start: 'top 80%', once: true,
            onEnter: () => tween.play()
          });
        }
        if (subtitle) {
          const split = new SplitText(subtitle, {
            type: 'lines', mask: 'lines', autoSplit: true,
            linesClass: 'line-split', wordDelimiter: '\u200D'
          });
          splits.push(split);
          const tween = gsap.from(split.lines, {
            yPercent: 100, opacity: 0, duration: .8,
            stagger: .1, ease: 'power4.out', paused: true
          });
          ScrollTrigger.create({
            trigger: subtitle, start: 'top 80%', once: true,
            onEnter: () => tween.play()
          });
        }
        if (cards.length) {
          const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
          const xStep = isDesktop ? 150 : 75;
          const yStep = isDesktop ? 200 : 100;
          gsap.from(cards, {
            x: i => (i + 1) * xStep,
            y: i => (i + 1) * yStep,
            rotate: i => gsap.utils.wrap([-1, 1], i) * gsap.utils.random(10, 25),
            stagger: { each: .1, ease: 'power2.out' },
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: isDesktop ? 'bottom 50%' : 'bottom bottom',
              scrub: true,
              invalidateOnRefresh: true
            }
          });
        }
      }, section);
      contexts.push(context);
    }

    return () => {
      contexts.forEach(context => context.revert());
      splits.reverse().forEach(split => split.revert());
    };
  }

  let cleanUp = () => {};
  const refresh = () => {
    cleanUp();
    cleanUp = initProcessoCardsScrollReveal();
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  };
  const start = () => {
    refresh();
    window.addEventListener('resize', debounce(refresh, 200), { passive: true });
  };

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start).catch(start);
  } else {
    start();
  }
})();
