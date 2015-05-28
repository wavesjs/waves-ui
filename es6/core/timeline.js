const ns = require('./namespace');
const TimeContext = require('./time-context');
const Surface  = require('../interactions/surface');
const Keyboard = require('../interactions/keyboard');


class Timeline {
  constructor(params) {
    this._defaults = {
      width: 1000,
      duration: 60
    };

    this.params = Object.assign({}, this._defaults, params);
    this._createContext();
    this._state = null;

    this._containers = {};
    this._layerContainerMap = new Map();

    this.layers = [];
    this._handleEvent = this._handleEvent.bind(this);

    this._createInteraction(Keyboard, 'body');
  }

  setState(state) {
    if (this._state) { this._state.exit(); }
    this._state = state;
    this._state.enter();
  }

  /**
   *  Interactions
   */
  _handleEvent(e) {
    if (!this._state) { return; }
    console.log(e);
    this._state.handleEvent(e);
  }

  _createInteraction(ctor, el) {
    const interaction = new ctor(el);
    interaction.on('event', this._handleEvent);
  }

  _createContext() {
    const duration = this.params.duration;
    const width = this.params.width;

    const xScale = d3.scale.linear()
      .domain([0, duration])
      .range([0, width]);

    this.context = new TimeContext();
    this.context.duration =  duration;
    this.context.xScale = xScale;
  }

  get xScale() {
    return this.context.xScale;
  }

  add(layer, containerId, context = null) {
    const layerContext = context || new TimeContext(this.context);
    layer.setContext(layerContext);

    this._layerContainerMap.set(layer, containerId);
    this.layers.push(layer);
  }

  remove(layer) {

  }

  registerContainer(id, el, options = {}) {
    const width = this.params.width;
    const height = options.height || 120;

    const svg = document.createElementNS(ns, 'svg');
    svg.setAttributeNS(null, 'width', width);
    svg.setAttributeNS(null, 'height', height);
    svg.setAttributeNS(null, 'viewbox', `0 0 ${width} ${height}`);

    const defs = document.createElementNS(ns, 'defs');

    const layoutGroup = document.createElementNS(ns, 'g');
    layoutGroup.classList.add('layout');

    const interactionsGroup = document.createElementNS(null, 'g');
    interactionsGroup.classList.add('interactions');

    svg.appendChild(defs)
    svg.appendChild(layoutGroup)
    svg.appendChild(interactionsGroup);

    el.appendChild(svg);

    this._containers[id] = { layoutGroup, interactionsGroup, DOMElement: el };
    this._createInteraction(Surface, svg);
  }

  render() {
    this.layers.forEach((layer) => {
      const containerId = this._layerContainerMap.get(layer);
      const layout = this._containers[containerId].layoutGroup;

      layout.appendChild(layer.render());
    });
  }

  draw() {
    this.layers.forEach((layer) => layer.draw());
  }

  update() {
    this.layers.forEach((layer) => layer.update());
  }
}

module.exports = Timeline;