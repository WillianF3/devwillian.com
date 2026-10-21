import Navigation from './components/Navigation.js';
import ProjectFilter from './components/ProjectFilter.js';
import BackToTop from './components/BackToTop.js';

/** Composição: cada componente encapsula seu estado e comportamento. */
export default class PortfolioApp {
  constructor(components = [new Navigation(), new ProjectFilter(), new BackToTop()]) {
    this.components = components;
  }
  init() { this.components.forEach(component => component.init()); }
}
