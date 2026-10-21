export default class Navigation {
  constructor() {
    this.nav = document.querySelector('#navbar');
    this.toggle = document.querySelector('.navbar-toggler');
    this.menu = document.querySelector('#nav-links');
    this.links = [...document.querySelectorAll('.nav-links a')];
    this.mobile = window.matchMedia('(max-width: 767.98px)');
    this.collapse = this.menu && window.bootstrap ? window.bootstrap.Collapse.getOrCreateInstance(this.menu, {toggle: false}) : null;
  }

  init() {
    if (!this.collapse) return;
    this.menu.addEventListener('show.bs.collapse', () => this.toggle?.setAttribute('aria-label', 'Fechar menu'));
    this.menu.addEventListener('hide.bs.collapse', () => this.toggle?.setAttribute('aria-label', 'Abrir menu'));
    this.links.forEach(link => link.addEventListener('click', () => this.setOpen(false)));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && this.menu?.classList.contains('show')) {
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
    if (!this.collapse) return;
    if (open) this.collapse.show();
    else this.collapse.hide();
  }
}
