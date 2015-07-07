const d3Scale = require('d3-scale');
const events = require('events');

const Keyboard = require('../interactions/keyboard');
const Layer = require('./layer');
const ns = require('./namespace');
const Surface  = require('../interactions/surface');
const TimeContextBehavior = require('../behaviors/time-context-behavior');
const TimelineTimeContext = require('./timeline-time-context');


/**
 * @class Timeline
 * @description
 *
 * A Timeline instance is the main entry point to create a temporal data representation. As a temporal representation, a timeline establishes a relation between *time* - in seconds - and *space* - in pixels -.
 *
 *
 * Containers inside a timeline
 *
 * A temporal representation can be rendered upon multiple DOM elements, called containers (eg multiple <li> for a DAW like representation) that belong to the same timeline (and thus share same time and space relation) using the `registerContainer` method. These containers are like windows on the overall and basically unending timeline. They have a defined width and they show content from the specified offset (converted to pixel).
 *
 * A timeline with 3 containers:
 *
 * +-----------------+-------------------------------+-- - -  -  -   -
 * |container 1      |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
 * +-----------------+-------------------------------+-- - -  -  -   -
 * |container 2      |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
 * +-----------------+-------------------------------+-- - -  -  -   -
 * |container 3      |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
 * +-----------------+-------------------------------+-- - -  -  -   -
 *
 * +----------------->
 * timeline.timeContext.xScale(timeline.timeContext.offset)
 *
 *                   <------------------------------->
 *                   Containers view defaults to 1000px
 *                   timeline ratio default is 100px/s.
 *                   with a default `stretchRatio = 1`
 *                   Default containers show 10 seconds of the timeline
 *
 *
 * Layers inside a timeline
 *
 * Within a container, a `Layer` keeps up-to-date and renders the data. The timeline's `addLayer` method adds a `Layer` instance to a previously created container.
 *
 *
 * timeline render/draw/update
 *
 * @TODO
 *
 *
 * timeline timeContext
 *
 * When one modify the timeline timeContext:
 * - timeline.timeContext.offset (in seconds) modify the containers view x position
 * - timeline.timeContext.stretchRatio modify timeline's zoom
 * Each time you set new value of offset or stretchRatio, you need to do `timeline.update()` to update the values.
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
    };

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
    this.timeContext.containersDuration = this.params.containersWidth / value;
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
    this.timeContext.containersDuration = value / this.params.pixelsPerSecond;

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
   * @param options {Object} options to be applied to the ctor (defaults to `{}`)
   */
  _createInteraction(ctor, el, options = {}) {
    const interaction = new ctor(el, options);
    interaction.on('event', this._handleEvent);
  }

  /**
   * @private
   * @description Creates a new TimeContext for the visualisation, this `TimeContext`
   * will be at the top of the `TimeContext` tree
   */
  _createTimeContext() {
    const pixelsPerSecond = this.params.pixelsPerSecond;
    const containersWidth = this.params.containersWidth;

    const xScale = d3Scale.linear()
      .domain([0, 1])
      .range([0, pixelsPerSecond]);

    this.timeContext = new TimelineTimeContext();
    // all child context inherits the max duration allowed in container per default
    this.timeContext.containersDuration = containersWidth / pixelsPerSecond;
    this.timeContext.xScale = xScale;
  }

  /**
   * Change the state of the timeline, `States` are the main entry point between
   * application logic, interactions, ..., and the library
   * @param {BaseState} state - the state in which the timeline must be setted
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
    // emit event as a middleware
    this.emit('event', e);
    // propagate to the state
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
  registerContainer(el, options = {}, containerId = 'default') {
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
    el.style.transform = 'translateZ(0)'; // fixes one of the (many ?) weird canvas rendering bugs in Chrome

    // store all informations about this container
    const container = {
      id: containerId,
      height: height,
      layoutElement: layoutGroup,
      offsetElement: offsetGroup,
      interactionsElement: interactionsGroup,
      svgElement: svg,
      DOMElement: el,
      brushElement: null
    };

    this.containers[containerId] = container;
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
  addLayer(layer, containerId = 'default', group = 'default') {
    const container = this.containers[containerId];
    this._layerContainerMap.set(layer, container);
    this.layers.push(layer);

    if (!this.groupedLayers[group]) {
      this.groupedLayers[group] = [];
    }

    this.groupedLayers[group].push(layer);
    // render the layer's container inside the container
    container.layoutElement.appendChild(layer.renderContainer());
  }

  /**
   * Remove a layer from the timeline
   * @param layer {Layer} the layer to remove
   */
  removeLayer(layer) {
    // @TODO
  }

  // // TimecontextBehavior
  // editLayer(layer, dx, dy, target) {
  //   this.timeContextBehavior.edit(layer, dx, dy, target);
  //   // this.emit('edit:timeContext', layer, layer.timeContext);
  // }

  // stretchLayer(layer, dx, dy, target) {
  //   this.timeContextBehavior.stretch(layer, dx, dy, target);
  //   // this.emit('edit:timeContext', layer, layer.timeContext);
  // }

  // setEditableLayer(layer, bool) {
  //   this.timeContextBehavior.setEditable(layer, bool);
  //   // this.emit('edit:timeContext', layer, layer.timeContext);
  // }

  // -----------------------------------------------
  // @NOTE remove those helpers ?
  // -----------------------------------------------

  // @NOTE change to `getContainer(el || id || layer)` ?
  getContainerFromDOMElement(el) {
    for (let id in this.containers) {
      const container = this.containers[id];
      if (container.DOMElement === el) { return container; }
    }

    return null;
  }

  /**
   * Returns an array of layers given some group
   * @param group {String} name of the group
   * @return {Array} an array of layers which belongs to the group
   */
  getLayersFromGroup(group = 'default') {
    return this.groupedLayers[group] || [];
  }

  getLayerContainer(layer) {
    return this._layerContainerMap.get(layer);
  }

  // getContainerPerId(id) {
  //   return this.containers[id];
  // }

  // -----------------------------------------------

  /**
   * @param layerOrGroup {mixed} defaults null
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
   * Draw all the layers in the timeline
   */
  drawLayerShapes(layerOrGroup = null) {
    const layers = this._getLayers(layerOrGroup);
    layers.forEach((layer) => layer.drawShapes());
  }

  /**
   * Update all the containers according to `this.timeContext`
   */
  update(layerOrGroup = null) {
    const layers = this._getLayers(layerOrGroup);

    this.updateTimelineContainers();
    this.updateLayerContainers(layerOrGroup);
    this.updateLayerShapes(layerOrGroup);

    this.emit('update', layers);
  }

  updateTimelineContainers() {
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

  updateLayerContainers(layerOrGroup = null) {
    const layers = this._getLayers(layerOrGroup);
    layers.forEach((layer) => layer.updateContainer());
  }

  updateLayerShapes(layerOrGroup = null) {
    const layers = this._getLayers(layerOrGroup);
    layers.forEach((layer) => layer.updateShapes());
  }
}

module.exports = Timeline;
