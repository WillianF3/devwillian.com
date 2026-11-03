export default class BackToTop {
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
