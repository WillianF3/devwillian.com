/** Efeitos progressivos: o conteúdo continua visível se JS não carregar. */
class SamuraiExperience {
  constructor() {
    this.reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.progress = document.querySelector('.scroll-progress');
    this.sections = document.querySelectorAll('[data-reveal]');
  }
  init() {
    this.initScrollProgress();
    this.initReveals();
    this.initTilt();
    this.initSkillNavigation();
  }
  initScrollProgress() {
    if (!this.progress) return;
    let scheduled = false;
    const render = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      this.progress.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
      scheduled = false;
    };
    addEventListener('scroll', () => { if (!scheduled) {scheduled = true; requestAnimationFrame(render);} }, {passive:true});
    addEventListener('resize', render);
    render();
  }
  initReveals() {
    if (this.reduceMotion || !('IntersectionObserver' in window)) return;
    // Reveals are only enabled after all targets have been observed.
    const ob = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {entry.target.classList.add('is-visible');ob.unobserve(entry.target);}
    }), {rootMargin:'0px 0px -25px 0px',threshold:0.06});
    this.sections.forEach((node, i) => {
      if (node.getBoundingClientRect().top <= innerHeight * .94) node.classList.add('is-visible');
      ob.observe(node);
    });
    document.documentElement.classList.add('js-motion');
  }
  initTilt() {
    if (this.reduceMotion || matchMedia('(hover: none), (pointer: coarse)').matches) return;
    const cards = document.querySelectorAll('#skills [data-tilt]');
    for (const card of cards) {
      let frame = 0;
      card.addEventListener('pointermove', e => {
        if(frame) return;
        frame = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX-r.left)/r.width-.5; const y = (e.clientY-r.top)/r.height-.5;
          card.style.setProperty('--tilt-x', `${-y*4}deg`);
          card.style.setProperty('--tilt-y', `${x*4}deg`);
          frame=0;
        });
      },{passive:true});
      card.addEventListener('pointerleave', () => {card.style.removeProperty('--tilt-x');card.style.removeProperty('--tilt-y');});
    }
  }
  initSkillNavigation() {
    document.querySelectorAll('[data-skill-filter]').forEach(link=>link.addEventListener('click', ()=> {
      const requested = link.dataset.skillFilter;
      const button = document.querySelector(`#projects [data-filter="${requested}"]`);
      if (button) button.click();
    }));
  }
}
new SamuraiExperience().init();
