export default class ProjectFilter {
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
      const column = card.closest('.project-column');
      if (column) column.hidden = !matches;
      if (matches) count++;
    });
    if (this.status) this.status.textContent = `${count} ${count === 1 ? 'projeto exibido' : 'projetos exibidos'}.`;
  }
}
