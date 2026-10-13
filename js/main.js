/** Menu responsivo, âncoras e indicação de seção ativa. */
class Navigation {
  constructor() {
    this.nav = document.querySelector('#navbar');
    this.toggle = document.querySelector('.menu-toggle');
    this.menu = document.querySelector('#nav-links');
    this.links = [...document.querySelectorAll('.nav-links a')];
    this.mobile = window.matchMedia('(max-width: 700px)');
  }

  init() {
    this.toggle?.addEventListener('click', () => this.setOpen(!this.menu.classList.contains('is-open')));
    this.links.forEach(link => link.addEventListener('click', () => this.setOpen(false)));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && this.menu?.classList.contains('is-open')) {
        this.setOpen(false);
        this.toggle?.focus();
      }
    });
    document.addEventListener('click', event => {
      if (this.mobile.matches && this.nav && !this.nav.contains(event.target)) this.setOpen(false);
    });
    this.mobile.addEventListener?.('change', () => this.setOpen(false));
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        this.links.forEach(link => {
          const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-active', isCurrent);
          if (isCurrent) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, {rootMargin: '-15% 0px -65% 0px'});
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
  }

  setOpen(open) {
    if (!this.menu || !this.toggle) return;
    this.menu.classList.toggle('is-open', open);
    this.toggle.setAttribute('aria-expanded', String(open));
    this.toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    this.toggle.textContent = open ? '✕' : '☰';
  }
}

/** Filtra sem recriar cards, preservando foco e leitores de tela. */
class ProjectFilter {
  constructor() {
    this.buttons = [...document.querySelectorAll('.filter-btn')];
    this.cards = [...document.querySelectorAll('.project-tile')];
    this.status = document.querySelector('#project-filter-status');
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
    let count = 0;
    this.cards.forEach(card => {
      const matches = category === 'all' || (card.dataset.category || '').split(' ').includes(category);
      card.hidden = !matches;
      if (matches) count++;
    });
    if (this.status) this.status.textContent = `${count} ${count === 1 ? 'projeto exibido' : 'projetos exibidos'}.`;
  }
}

/** O botão é removido da navegação por teclado quando está invisível. */
class BackToTop {
  constructor() { this.button = document.querySelector('#back-to-top'); }
  init() {
    if (!this.button) return;
    const update = () => { this.button.hidden = window.scrollY <= 450; };
    window.addEventListener('scroll', update, {passive: true});
    this.button.addEventListener('click', () => window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    }));
    update();
  }
}

class PortfolioApp {
  constructor() {
    this.components = [new Navigation(), new ProjectFilter(), new BackToTop()];
  }
  init() { this.components.forEach(component => component.init()); }
}

new PortfolioApp().init();
