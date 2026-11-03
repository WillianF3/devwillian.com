(() => {
  // Mantém o mesmo fechamento por teclado e clique externo do portfólio.
  const nav = document.querySelector('#navbar');
  const menu = document.querySelector('#nav-links');
  const toggle = document.querySelector('.navbar-toggler');
  const collapse = menu && window.bootstrap?.Collapse.getOrCreateInstance(menu, {toggle: false});
  if (collapse) {
    menu.addEventListener('show.bs.collapse', () => toggle?.setAttribute('aria-label', 'Fechar menu'));
    menu.addEventListener('hide.bs.collapse', () => toggle?.setAttribute('aria-label', 'Abrir menu'));
    document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => collapse.hide()));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.classList.contains('show')) { collapse.hide(); toggle?.focus(); }
    });
    document.addEventListener('click', event => {
      if (window.matchMedia('(max-width: 767.98px)').matches && nav && !nav.contains(event.target)) collapse.hide();
    });
  }
  const cards = [...document.querySelectorAll('.certificate-card')];
  const search = document.querySelector('#certificate-search');
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const count = document.querySelector('#certificate-count');
  const empty = document.querySelector('#certificate-empty');
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  let category = 'Todos';
  function filter() {
    const query = normalize(search.value.trim());
    let visible = 0;
    cards.forEach(card => {
      const match = (category === 'Todos' || card.dataset.category === category) && normalize(card.dataset.search).includes(query);
      card.hidden = !match;
      if (match) visible++;
    });
    count.textContent = `Exibindo ${visible} de ${cards.length} certificados`;
    empty.hidden = visible > 0;
    buttons.forEach(button => {
      const active = button.dataset.filter === category;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  document.querySelector('.certificate-controls').hidden = false;
  search.addEventListener('input', filter);
  buttons.forEach(button => button.addEventListener('click', () => { category = button.dataset.filter; filter(); }));
  document.querySelector('#clear-search').addEventListener('click', () => { category = 'Todos'; search.value = ''; filter(); search.focus(); });
  const dialog = document.querySelector('#certificate-dialog');
  const image = document.querySelector('#dialog-image');
  let trigger;
  document.querySelectorAll('[data-open-certificate]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !dialog.showModal) return;
    event.preventDefault();
    trigger = link;
    const card = link.closest('.certificate-card');
    document.querySelector('#dialog-title').textContent = card.querySelector('h2').textContent;
    image.src = link.href;
    image.alt = card.querySelector('img').alt;
    document.querySelector('#original-certificate').href = link.href;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }));
  document.querySelector('#close-certificate').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; image.removeAttribute('src'); trigger?.focus(); });
  filter();
})();
