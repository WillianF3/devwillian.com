/** Inicialização do portfólio. Cada responsabilidade fica em uma classe. */
class Navigation {
  constructor() {
    this.nav = document.querySelector('#navbar');
    this.toggle = document.querySelector('.menu-toggle');
    this.links = [...document.querySelectorAll('.nav-links a')];
    this.menu = document.querySelector('#nav-links');
  }

  init() {
    this.toggle?.addEventListener('click', () => this.setOpen(!this.menu.classList.contains('is-open')));
    this.links.forEach(link => link.addEventListener('click', () => this.setOpen(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') this.setOpen(false); });
    document.addEventListener('click', e => { if (this.nav && !this.nav.contains(e.target)) this.setOpen(false); });
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        this.links.forEach(link => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, {rootMargin: '-20% 0px -65% 0px'});
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
  }

  setOpen(open) {
    this.menu?.classList.toggle('is-open', open);
    this.toggle?.setAttribute('aria-expanded', String(open));
    this.toggle?.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    if (this.toggle) this.toggle.textContent = open ? '✕' : '☰';
  }
}

/** Filtragem de cards sem apagar elementos do DOM. */
class ProjectFilter {
  constructor() {
    this.buttons = [...document.querySelectorAll('.filter-btn')];
    this.cards = [...document.querySelectorAll('.project-tile')];
  }

  init() {
    this.buttons.forEach(button => button.addEventListener('click', () => this.filter(button.dataset.filter)));
  }

  filter(category) {
    this.buttons.forEach(button => {
      const selected = button.dataset.filter === category;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    this.cards.forEach(card => {
      const categories = (card.dataset.category || '').split(' ');
      card.hidden = category !== 'all' && !categories.includes(category);
    });
  }
}

/** Animação progressiva com respeito a preferências de acessibilidade. */
class ScrollReveal {
  init() {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const elements = document.querySelectorAll('.section-heading, .about-card, .skill-card, .project-tile');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, {threshold: 0.08});
    elements.forEach(el => {
      el.classList.add('reveal-ready');
      observer.observe(el);
    });
  }
}

/** Exibe um botão flutuante ao descer a página. */
class BackToTop {
  constructor() { this.button = document.querySelector('#back-to-top'); }
  init() {
    if (!this.button) return;
    const update = () => this.button.classList.toggle('is-visible', window.scrollY > 450);
    window.addEventListener('scroll', update, {passive: true});
    this.button.addEventListener('click', () => window.scrollTo({top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}));
    update();
  }
}

/** Ponto de entrada: reúne todos os componentes. */
class PortfolioApp {
  constructor() {
    this.components = [new Navigation(), new ProjectFilter(), new ScrollReveal(), new BackToTop()];
  }
  init() { this.components.forEach(component => component.init()); }
}

new PortfolioApp().init();
