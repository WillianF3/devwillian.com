import test from 'node:test';
import assert from 'node:assert/strict';
import ProjectFilter from '../js/components/ProjectFilter.js';
import PortfolioApp from '../js/PortfolioApp.js';

test('filtros mostram as categorias e ocultam as colunas correspondentes', () => {
  const element = dataset => ({dataset, hidden: false, attributes: {},
    classList: {toggle() {}}, setAttribute(k,v) { this.attributes[k]=v; }});
  const buttons = ['all','front-end','javascript'].map(filter => element({filter}));
  const cards = ['front-end javascript','javascript','front-end'].map(category => {
    const card=element({category});
    card.column={hidden:false}; card.closest=()=>card.column;
    return card;
  });
  const status={textContent:''};
  globalThis.document={querySelectorAll: s => s==='.filter-btn' ? buttons : cards, querySelector:()=>status};
  const filter=new ProjectFilter();
  filter.filter('javascript');
  assert.deepEqual(cards.map(c=>c.hidden),[false,false,true]);
  assert.deepEqual(cards.map(c=>c.column.hidden),[false,false,true]);
  assert.equal(buttons[2].attributes['aria-pressed'],'true');
  assert.equal(status.textContent,'2 projetos exibidos.');
  filter.filter('all');
  assert.ok(cards.every(c=>!c.hidden && !c.column.hidden));
  filter.filter('inexistente');
  assert.equal(status.textContent,'0 projetos exibidos.');
  delete globalThis.document;
});

test('aplicação inicializa os componentes recebidos pelo construtor', () => {
  const calls=[];
  new PortfolioApp([{init(){calls.push('navigation');}},{init(){calls.push('filter');}}]).init();
  assert.deepEqual(calls,['navigation','filter']);
});
