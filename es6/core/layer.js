import scales from '../utils/scales';
import events from 'events';

import ns from './namespace';
import Segment from '../shapes/segment';
import TimeContextBehavior from '../behaviors/time-context-behavior';

// time context bahevior
let timeContextBehavior = null;
let timeContextBehaviorCtor = TimeContextBehavior;

export default class Layer extends events.EventEmitter {
  /**
   * Structure of the DOM view of a Layer
   *
   * <g class="layer"> Flip y axis, timeContext.start and top position from params are applied on this $elmt
   *   <svg class="bounding-box"> timeContext.duration is applied on this $elmt
   *    <g class="layer-interactions"> Contains the timeContext edition elements (a segment) </g>
   *    <g class="offset items"> The shapes are inserted here, and we apply timeContext.offset on this $elmt </g>
   *   </svg>
   * </g>
   */
  constructor(dataType, data, options = {}) {
    super();
    this.dataType = dataType; // 'entity' || 'collection';
    this.data = data;

    const defaults = {
      height: 100,
      top: 0,
      id: '',
      yDomain: [0, 1],
      opacity: 1,
      contextHandlerWidth: 2,
      className: null
    };

    this.params = Object.assign({}, defaults, options);
    this.timeContext = null;

    // container elements
    this.$el = null; // offset group of the parent context
    this.$boundingBox = null;
    this.$offset = null;
    this.$interactions = null;

    this._shapeConfiguration = null; // { ctor, accessors, options }
    this._commonShapeConfiguration = null; // { ctor, accessors, options }
    // map to associate datums, $items, and shapes
    this._$itemShapeMap = new Map(); // item group <DOMElement> => shape
    this._$itemDataMap = new Map();
    this._$itemCommonShapeMap = new Map(); // one entry max in this map

    this._isContextEditable = false;
    this._behavior = null;

    this._valueToPixel = scales.linear()
      .domain(this.params.yDomain)
      .range([0, this.params.height]);

    this.contextBehavior = '';

    // initialize timeContext layout
    this._renderContainer();

    // creates the timeContextBehavior for all layer, lazy instanciation
    if (timeContextBehavior === null) {
      timeContextBehavior = new timeContextBehaviorCtor();
    }
  }

  /**
   *  allows to override default the TimeContextBehavior
   */
  static configureTimeContextBehavior(ctor) {
    timeContextBehaviorCtor = ctor;
  }

  get start() {
    return this.timeContext.start;
  }

  set start(value) {
    this.timeContext.start = value;
  }

  get offset() {
    return this.timeContext.offset;
  }

  set offset(value) {
    this.timeContext.offset = value;
  }

  get duration() {
    return this.timeContext.duration;
  }

  set duration(value) {
    this.timeContext.duration = value;
  }

  get stretchRatio() {
    return this.timeContext.stretchRatio;
  }

  set stretchRatio(value) {
    this.timeContext.stretchRatio = value;
  }

  set yDomain(domain) {
    this.params.yDomain = domain;
    this._valueToPixel.domain(domain);
  }

  get yDomain() {
    return this.params.yDomain;
  }

  set opacity(value) {
    this.params.opacity = value;
  }

  get opacity() {
    return this.params.opacity;
  }

  // destroy() {
  //   this.timeContext = null;
  //   this.data = null;
  //   this.params = null;
  //   this._behavior = null;
  //
  //   // @TODO
  //      - clean Maps
  //      - clean listeners
  //      - clean behavior (behavior._layer)
  // }

  /**
   * @mandatory define the context in which the layer is drawn
   * @param context {TimeContext} the timeContext in which the layer is displayed
   */
  setTimeContext(timeContext) {
    this.timeContext = timeContext;
    // create a mixin to pass to the shapes
    this._renderingContext = {};
    this._updateRenderingContext();
  }

  // --------------------------------------
  // Data
  // --------------------------------------

  get data() { return this._data; }

  set data(data) {
    switch (this.dataType) {
      case 'entity':
        if (this._data) {  // if data already exists, reuse the reference
          this._data[0] = data;
        } else {
          this._data = [data];
        }
        break;
      case 'collection':
        this._data = data;
        break;
    }
  }

  // Initialization

  /**
   *  render the DOM in memory on layer creation to be able to use it before
   *  the layer is actually inserted in the DOM
   */
  _renderContainer() {
    // wrapper group for `start, top and context flip matrix
    this.$el = document.createElementNS(ns, 'g');
    if (this.params.className !== null) {
      this.$el.classList.add('layer', this.params.className);
    }
    // clip the context with a `svg` element
    this.$boundingBox = document.createElementNS(ns, 'svg');
    this.$boundingBox.classList.add('bounding-box');
    // group to apply offset
    this.$offset = document.createElementNS(ns, 'g');
    this.$offset.classList.add('offset', 'items');
    // layer background
    this.$background = document.createElementNS(ns, 'rect');
    this.$background.setAttributeNS(null, 'height', '100%');
    this.$background.setAttributeNS(null, 'width', '100%');
    this.$background.classList.add('background');
    this.$background.style.fillOpacity = 0;
    this.$background.style.pointerEvents = 'none';
    // context interactions
    this.$interactions = document.createElementNS(ns, 'g');
    this.$interactions.classList.add('interactions');
    this.$interactions.style.display = 'none';
    // @NOTE: works but king of ugly... should be cleaned
    this.contextShape = new Segment();
    this.contextShape.install({
      opacity: () => 0.1,
      color  : () => '#787878',
      width  : () => this.timeContext.duration,
      height : () => this._renderingContext.valueToPixel.domain()[1],
      y      : () => this._renderingContext.valueToPixel.domain()[0]
    });

    this.$interactions.appendChild(this.contextShape.render());
    // create the DOM tree
    this.$el.appendChild(this.$boundingBox);
    this.$boundingBox.appendChild(this.$offset);
    this.$offset.appendChild(this.$background);
    this.$boundingBox.appendChild(this.$interactions);
  }

  // --------------------------------------
  // Component Configuration
  // --------------------------------------

  /**
   *  Register the shape and its accessors to use in order to render
   *  the entity or collection
   *  @param ctor <Function:BaseShape> the constructor of the shape to be used
   *  @param accessors <Object> accessors to use in order to map the data structure
   */
  configureShape(ctor, accessors = {}, options = {}) {
    this._shapeConfiguration = { ctor, accessors, options };
  }

  /**
   *  Register the shape to use with the entire collection
   *  example: the line in a beakpoint function
   *  @param ctor {BaseShape} the constructor of the shape to use to render data
   *  @param accessors {Object} accessors to use in order to map the data structure
   */
  configureCommonShape(ctor, accessors = {}, options = {}) {
    this._commonShapeConfiguration = { ctor, accessors, options };
  }

  /**
   *  Register the behavior to use when interacting with the shape
   *  @param behavior {BaseBehavior}
   */
  setBehavior(behavior) {
    behavior.initialize(this);
    this._behavior = behavior;
  }

  /**
   *  update the values in `_renderingContext`
   *  is particulary needed when updating `stretchRatio` as the pointer
   *  to the `timeToPixel` scale may change
   */
  _updateRenderingContext() {
    this._renderingContext.timeToPixel = this.timeContext.timeToPixel;
    this._renderingContext.valueToPixel = this._valueToPixel;
    this._renderingContext.height = this.params.height;
    this._renderingContext.width  = this.timeContext.timeToPixel(this.timeContext.duration);
    // for foreign object issue in chrome
    this._renderingContext.offsetX = this.timeContext.timeToPixel(this.timeContext.offset);
    // expose some timeline attributes - allow to improve perf in some cases - cf. Waveform
    this._renderingContext.trackOffsetX = this.timeContext.parent.timeToPixel(this.timeContext.parent.offset);
    this._renderingContext.visibleWidth = this.timeContext.parent.visibleWidth;
  }

  // --------------------------------------
  // Behavior Accessors
  // --------------------------------------

  get selectedItems() {
    return this._behavior ? this._behavior.selectedItems : [];
  }

  select(...$items) {
    if (!this._behavior) { return; }
    if (!$items.length) { $items = this._$itemDataMap.keys(); }
    if (Array.isArray($items[0])) { $items = $items[0]; }

    for (let $item of $items) {
      const datum = this._$itemDataMap.get($item);
      this._behavior.select($item, datum);
      this._toFront($item);
    }
  }

  unselect(...$items) {
    if (!this._behavior) { return; }
    if (!$items.length) { $items = this._$itemDataMap.keys(); }
    if (Array.isArray($items[0])) { $items = $items[0]; }

    for (let $item of $items) {
      const datum = this._$itemDataMap.get($item);
      this._behavior.unselect($item, datum);
    }
  }

  toggleSelection(...$items) {
    if (!this._behavior) { return; }
    if (!$items.length) { $items = this._$itemDataMap.keys(); }
    if (Array.isArray($items[0])) { $items = $items[0]; }

    for (let $item of $items) {
      const datum = this._$itemDataMap.get($item);
      this._behavior.toggleSelection($item, datum);
    }
  }

  edit($items, dx, dy, target) {
    if (!this._behavior) { return; }
    $items = !Array.isArray($items) ? [$items] : $items;

    for (let $item of $items) {
      const shape = this._$itemShapeMap.get($item);
      const datum = this._$itemDataMap.get($item);

      this._behavior.edit(this._renderingContext, shape, datum, dx, dy, target);
      this.emit('edit', shape, datum);
    }
  }

  /**
   *  draws the shape to interact with the context
   *  @params {Boolean} [bool=true] - defines if the layer's context is editable or not
   */
  setContextEditable(bool = true) {
    const display = bool ? 'block' : 'none';
    this.$interactions.style.display = display;
    this._isContextEditable = bool;
  }

  editContext(dx, dy, target) {
    timeContextBehavior.edit(this, dx, dy, target);
  }

  stretchContext(dx, dy, target) {
    timeContextBehavior.stretch(this, dx, dy, target);
  }

  // --------------------------------------
  // Helpers
  // --------------------------------------

  /**
   *  Moves an `$el`'s group to the end of the layer (svg z-index...)
   *  @param `$el` {DOMElement} the DOMElement to be moved
   */
  _toFront($item) {
    this.$offset.appendChild($item);
  }

  /**
   *  Returns the $item to which the given DOMElement belongs
   *  @param {DOMElement} $el the element to be tested
   *  @return {DOMElement|null} item group containing the `$el` if belongs to this layer, null otherwise
   */
  getItemFromDOMElement($el) {
    let $item;

    do {
      if ($el.classList && $el.classList.contains('item')) {
        $item = $el;
        break;
      }

      $el = $el.parentNode;
    } while ($el !== null);

    return this.hasItem($item) ? $item : null;
  }

  /**
   *  Returns the datum associated to a specific item DOMElement
   *  @param {DOMElement} $item
   *  @return {Object|Array|null} depending on the user data structure
   */
  getDatumFromItem($item) {
    return this._$itemDataMap.get($item);
  }

  /**
   *  Defines if the given DOMElement is an item of the layer
   *  @param {DOMElement} $item
   *  @return {bool}
   */
  hasItem($item) {
    return this._$itemDataMap.has($item);
  }

  /**
   *  Defines if a given element belongs to the layer
   *  is more general than `hasItem`, can be used to check interactions elements too
   *  @param {DOMElement} $el
   *  @return {bool}
   */
  hasElement($el) {
    do {
      if ($el === this.$el) {
        return true;
      }

      $el = $el.parentNode;
    } while ($el !== null);

    return false;
  }

  /**
   *  retrieve all the $items in a given area
   *  @param {Object} area - The area in which to find the elements
   *  @return {Array} - list of the DOM elements in the given area
   */
  getItemsInArea(area) {
    const start    = this.timeContext.timeToPixel(this.timeContext.start);
    const duration = this.timeContext.timeToPixel(this.timeContext.duration);
    const offset   = this.timeContext.timeToPixel(this.timeContext.offset);
    const top      = this.params.top;
    // be aware af context's translations - constrain in working view
    let x1 = Math.max(area.left, start);
    let x2 = Math.min(area.left + area.width, start + duration);
    x1 -= (start + offset);
    x2 -= (start + offset);
    // keep consistent with context y coordinates system
    let y1 = this.params.height - (area.top + area.height);
    let y2 = this.params.height - area.top;

    y1 += this.params.top;
    y2 += this.params.top;

    const $filteredItems = [];

    for (let [$item, datum] of this._$itemDataMap.entries()) {
      const shape = this._$itemShapeMap.get($item);
      const inArea = shape.inArea(this._renderingContext, datum, x1, y1, x2, y2);

      if (inArea) { $filteredItems.push($item); }
    }

    return $filteredItems;
  }

  // --------------------------------------
  // Rendering / Display methods
  // --------------------------------------

  render() {
    // render `commonShape` only once
    if (
      this._commonShapeConfiguration !== null &&
      this._$itemCommonShapeMap.size === 0
    ) {
      const { ctor, accessors, options } = this._commonShapeConfiguration;
      const $group = document.createElementNS(ns, 'g');
      const shape = new ctor(options);

      shape.install(accessors);
      $group.appendChild(shape.render());
      $group.classList.add('item', 'common', shape.getClassName());

      this._$itemCommonShapeMap.set($group, shape);
      this.$offset.appendChild($group);
    }

    // append elements all at once
    const fragment = document.createDocumentFragment();
    const values = this._$itemDataMap.values(); // iterator

    // enter
    this.data.forEach((datum) => {
      for (let value of values) { if (value === datum) { return; } }

      const { ctor, accessors, options } = this._shapeConfiguration;
      const shape = new ctor(options);
      shape.install(accessors);

      const $el = shape.render(this._renderingContext);
      $el.classList.add('item', shape.getClassName());

      this._$itemShapeMap.set($el, shape);
      this._$itemDataMap.set($el, datum);

      fragment.appendChild($el);
    });

    this.$offset.appendChild(fragment);

    // remove
    for (let [$item, datum] of this._$itemDataMap.entries()) {
      if (this.data.indexOf(datum) !== -1) { continue; }

      this.$offset.removeChild($item);
      const shape = this._$itemShapeMap.get($item);
      shape.destroy();

      this._$itemDataMap.delete($item);
      this._$itemShapeMap.delete($item);
    }
  }

  /**
   *  updates Context and Shapes
   */
  update() {
    this.updateContainer();
    this.updateShapes();
  }

  /**
   *  updates the layer's container
   */
  updateContainer() {
    this._updateRenderingContext();

    const timeContext = this.timeContext;
    const width  = timeContext.timeToPixel(timeContext.duration);
    // x is relative to timeline's timeContext
    const x      = timeContext.parent.timeToPixel(timeContext.start);
    const offset = timeContext.timeToPixel(timeContext.offset);
    const top    = this.params.top;
    const height = this.params.height;
    // matrix to invert the coordinate system
    const translateMatrix = `matrix(1, 0, 0, -1, ${x}, ${top + height})`;

    this.$el.setAttributeNS(null, 'transform', translateMatrix);

    this.$boundingBox.setAttributeNS(null, 'width', width);
    this.$boundingBox.setAttributeNS(null, 'height', height);
    this.$boundingBox.style.opacity = this.params.opacity;

    this.$offset.setAttributeNS(null, 'transform', `translate(${offset}, 0)`);
    // maintain context shape
    this.contextShape.update(this._renderingContext, this.timeContext, 0);
  }

  /**
   *  updates the Shapes which belongs to the layer
   *  @param {DOMElement} $el - Not implemented
   */
  updateShapes($el = null) {
    this._updateRenderingContext();
    // update common shapes
    this._$itemCommonShapeMap.forEach((shape, $item) => {
      shape.update(this._renderingContext, this.data);
    });

    for (let [$item, datum] of this._$itemDataMap.entries()) {
      const shape = this._$itemShapeMap.get($item);
      shape.update(this._renderingContext, datum);
    }
  }
}
