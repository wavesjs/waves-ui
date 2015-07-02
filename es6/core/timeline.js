const d3Scale = require('d3-scale');
const events = require('events');

const Keyboard = require('../interactions/keyboard');
const Layer = require('./layer');
const ns = require('./namespace');
const Surface  = require('../interactions/surface');
const TimeContextBehavior = require('../behaviors/time-context-behavior');
const TimeContext = require('./time-context');


/**
 * @class Timeline
 *
 * A Timeline instance is the main entry point to create a temporal data representation.
 *
 * As a temporal representation, a timeline establishes a relation between time and space through a `width` and a `duration`.
 *
 * A temporal representation can be created upon multiple DOM elements (eg multiple <li> for a DAW like representation) that belong to the same timeline (and thus share same time and space relation) using `registerContainer` method.
 *
 * Within a container, a `Layer` keep up-to-date and render the data. The timeline `addLayer` method is used to add a `Layer` instance to a previously created container.
 *
 * When one modify the timeline timeContext:
 * - timeline.timeContext.offset (in seconds) modify the containers view x position
 * - timeline.timeContext.stretchRatio modify containers zoom
 * - timeline.timeContext.start (in seconds) has no effect
 *
 * +--------------------------------------------------------+
 * |timeline                                                |
 * +-----------------+-------------------------------+------+
 * |container1       |                               |      |
 * +--------------------------------------------------------+
 * |container2       |                               |      |
 * +--------------------------------------------------------+
 * |container3       |                               |      |
 * +-----------------+-------------------------------+------+
 *
 * <-------------------------------------------------------->
 * timeline.width (and its related timeline.duration)
 *
 *                   <------------------------------->
 *                   Container view based on
 *                   timeline.timeContext.offset and
 *                   timeline.timeContext.stretchRatio
 *
 */
class Timeline extends events.EventEmitter {
  /**
   * Creates a new Timeline instance
   * @param params {Object} an object to override defaults parameters
   */
  constructor(params = {}) {
    super();

    this._defaults = {
     pixelsPerSecond: 100,
     containersWidth: 1000,
    }

    // public attributes
    this.params = Object.assign({}, this._defaults, params);
    this.timeContext = null;
    this.layers = [];
    this.containers = {};
    // @NOTE realy needed ?
    this.groupedLayers = {}; // group layer by categories
    this.timeContextBehavior = new TimeContextBehavior();
    // private attributes
    this._state = null;
    this._layerContainerMap = new Map();
    this._handleEvent = this._handleEvent.bind(this);

    this._createTimeContext();
    this._createInteraction(Keyboard, 'body');
  }

  set pixelsPerSecond(value) {
    this.params.pixelsPerSecond = value;
    this.timeContext.xScaleRange = [0, this.params.pixelsPerSecond];
  }

  get pixelsPerSecond() {
    return this.params.pixelsPerSecond;
  }

  get containersWidth() {
    return this.params.containersWidth;
  }

  set containersWidth(value) {
    this.setContainersWidth(value);
  }

  setContainersWidth(value, maintainVisibleDuration = false) {
    const lastContainersWidth = this.params.containersWidth;
    const lastPixelsPerSecond = this.params.pixelsPerSecond;

    this.params.containersWidth = value;

    if (maintainVisibleDuration) {
      const ratio = lastPixelsPerSecond / lastContainersWidth;
      this.pixelsPerSecond = ratio * this.params.containersWidth;
    }
  }

  /**
   * Factory method to add interaction modules the timeline should listen to
   * by default, the timeline listen to Keyboard, and instance a Surface on each
   * container
   * @param ctor {EventSource} the contructor of the interaction module to instanciate
   * @param el {DOMElement} the DOM element to bind to the EventSource module
   */
  _createInteraction(ctor, el, options = {}) {
    const interaction = new ctor(el, options);
    interaction.on('event', this._handleEvent);
  }

  /**
   * Creates a new TimeContext for the visualisation, this `TimeContext`
   * will be at the top of the `TimeContext` tree
   */
  _createTimeContext() {
    const pixelsPerSecond = this.params.pixelsPerSecond;
    const containersWidth = this.params.containersWidth;

    const xScale = d3Scale.linear()
      .domain([0, 1])
      .range([0, pixelsPerSecond]);

    this.timeContext = new TimeContext();
    // all child context inherits the max duration allowed in container per default
    this.timeContext.duration = containersWidth / pixelsPerSecond;
    this.timeContext.xScale = xScale;
  }

  /**
   * Change the state of the timeline, `States` are the main entry point between
   * application logic, interactions, ..., and the library
   * @param state {BaseState} the state in which the timeline must be setted
   */
  setState(state) {
    if (this._state) { this._state.exit(); }
    this._state = state;
    this._state.enter();
  }

  /**
   * @private
   * The callback that is used to listen to interactions modules
   * @params e {Event} a custom event generated by interaction modules
   */
  _handleEvent(e) {
    if (!this._state) { return; }
    this._state.handleEvent(e);
  }

  /**
   * Register a container and prepare the DOM svg element for the timeline's layers
   *
   * Containers display the view on the timeline in theirs DOM svg element.
   * The timeline timeContext offset set all the containers to display temporal representation from that offset time.
   *
   * Container SVG structure
   * <svg>
   *  <defs> Unused for the moment, could be used to define custom shapes for use with layers
   *  </defs>
   *  <g class="offset">
   *   <g class="layout"> The layers are inserted here
   *   </g>
   *  </g>
   *  <g class="interactions"> Placeholder to visualize interactions (eg. brush)
   *  </g>
   * </svg>
   * @param id {String} a user defined id for the container
   * @param el {DOMElement} the DOMElement to use as a container
   * @param options {Object} the options to apply to the container
   */
  registerContainer(id, el, options = {}) {
    const height = options.height || 120;
    const width = this.params.containersWidth;
    const svg = document.createElementNS(ns, 'svg');

    svg.setAttributeNS(null, 'height', height);
    svg.setAttributeNS(null, 'shape-rendering', 'optimizeSpeed');
    svg.setAttribute('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');
    svg.setAttributeNS(null, 'width', width);
    svg.setAttributeNS(null, 'viewbox', `0 0 ${width} ${height}`);

    const defs = document.createElementNS(ns, 'defs');

    const offsetGroup = document.createElementNS(ns, 'g');
    offsetGroup.classList.add('offset');

    const layoutGroup = document.createElementNS(ns, 'g');
    layoutGroup.classList.add('layout');

    const interactionsGroup = document.createElementNS(ns, 'g');
    interactionsGroup.classList.add('interactions');

    svg.appendChild(defs);
    offsetGroup.appendChild(layoutGroup);
    svg.appendChild(offsetGroup);
    svg.appendChild(interactionsGroup);

    el.appendChild(svg);
    el.style.fontSize = 0; // removes additionnal height added who knows why...
    el.style.transform = 'translateZ(0)'; // fixes one of the weird canvas rendering bugs in chrome

    // store all informations about this container
    const container = {
      id: id,
      height: height,
      layoutElement: layoutGroup,
      offsetElement: offsetGroup,
      interactionsElement: interactionsGroup,
      svgElement: svg,
      DOMElement: el,
      brushElement: null
    };

    this.containers[id] = container;
    this._createInteraction(Surface, el);
  }

  /**
   * Adds a `Layer` to the Timeline
   * @param layer {Layer} the layer to register
   * @param containerId {String} a valid id of a previsouly registered container
   * @param group {String} insert the layer into some user defined group of layers
   * @param timeContext {TimeContext} a `TimeContext` the layer is associated with
   *     if null given, a new `TimeContext` will be created for the layer
   */
  addLayer(layer, containerId, group = 'default') {
    this._layerContainerMap.set(layer, this.containers[containerId]);
    this.layers.push(layer);

    if (!this.groupedLayers[group]) {
      this.groupedLayers[group] = [];
    }

    this.groupedLayers[group].push(layer);
  }

  /**
   * Remove a layer from the timeline
   * @param layer {Layer} the layer to remove
   */
  removeLayer(layer) {

  }

  // @NOTE bad API => method name
  /**
   * Returns an array of layers given some group
   * @param group {String} name of the group
   * @return {Array} an array of layers which belongs to the group
   */
  getLayersFromGroup(group = 'default') {
    return this.groupedLayers[group] || [];
  }

  // -----------------------------------------------
  // @NOTE remove those helpers ?
  // -----------------------------------------------

  // @NOTE change to `getContainer(el || id || layer)` ?
  getContainerPerElement(el) {
    for (let id in this.containers) {
      const container = this.containers[id];
      if (container.DOMElement === el) { return container; }
    }

    return null;
  }

  getLayerContainer(layer) {
    return this._layerContainerMap.get(layer);
  }

  // getContainerPerId(id) {
  //   return this.containers[id];
  // }

  // -----------------------------------------------

  /**
   * @param LayerOrGroup{mixed} defaults null
   * @return an array of layers
   */
  _getLayers(layerOrGroup = null) {
    let layers = null;

    if (typeof layerOrGroup === 'string') {
      layers = this.groupedLayers[layerOrGroup];
    } else if (layerOrGroup instanceof Layer) {
      layers = [layerOrGroup];
    } else {
      layers = this.layers;
    }

    return layers;
  }

  /**
   * Update all the containers according to `this.timeContext`
   */
  updateContainers() {
    const timeContext = this.timeContext;
    const width = this.params.containersWidth;

    for (let id in this.containers) {
      const container = this.containers[id];
      const $offset   = container.offsetElement;
      const $svg      = container.svgElement;
      const height    = container.height;
      const translate = `translate(${timeContext.xScale(timeContext.offset)}, 0)`;

      $svg.setAttributeNS(null, 'width', width);
      $svg.setAttributeNS(null, 'viewbox', `0 0 ${width} ${height}`);

      $offset.setAttributeNS(null, 'transform', translate);
    }
  }

  updateLayerContainers() {
    this.layers.forEach((layer) => layer.updateContainer());
  }

  /**
   * Render all the layers in the timeline
   */
  render() {
    this.layers.forEach((layer) => {
      const container = this._layerContainerMap.get(layer);
      container.layoutElement.appendChild(layer.render());
    });
  }

  /**
   *  Draw all the layers in the timeline
   */
  draw(layerOrGroup = null) {
    const layers = this._getLayers(layerOrGroup);
    layers.forEach((layer) => layer.draw());
  }

  /**
   *  Update all the layers in the timeline
   *  @NOTE accept several `layers` or `categories` as arguments ?
   */
  update(layerOrGroup = null) {
    const layers = this._getLayers(layerOrGroup);

    this.updateContainers();
    layers.forEach((layer) => layer.update());

    this.emit('update', layers);
  }
}

module.exports = Timeline;
