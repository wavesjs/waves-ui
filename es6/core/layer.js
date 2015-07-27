import d3Scale from 'd3-scale';
import d3Selection from 'd3-selection';
import events from 'events';

import ns from './namespace';
import Segment from '../shapes/segment';
import TimeContextBehavior from '../behaviors/time-context-behavior';

// time context bahevior
let timeContextBehavior = null;
let timeContextBehaviorCtor = TimeContextBehavior;

// private item -> id map to force d3 tp keep in sync with the DOM
let   _counter = 0;
const _datumIdMap = new Map();

export default class Layer extends events.EventEmitter {
  /**
   * Structure of the DOM view of a Layer
   *
   * <g class="layer"> Flip y axis, timeContext.start and top position from params are applied on this $elmt
   *   <svg class="bounding-box"> timeContext.duration is applied on this $elmt
   *    <g class="layer-interactions"> Contains the timeContext edition elements (a segment)
   *    </g>
   *    <g class="offset items"> The shapes are inserted here, and we apply timeContext.offset on this $elmt
   *    </g>
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
      debugContext: false, // pass the context in debug mode
      contextHandlerWidth: 2
    };

    this.params = Object.assign({}, defaults, options);
    this.timeContext = null;

    // container elements
    this.$el = null; // offset group of the parent context
    this.$boundingBox = null;
    this.$offset = null;
    this.$interactions = null;

    this.d3items = null; // d3 collection of the layer items

    this._shapeConfiguration = null; // { ctor, accessors, options }
    this._commonShapeConfiguration = null; // { ctor, accessors, options }

    this._$itemShapeMap = new Map(); // item group <DOMElement> => shape
    this._$itemD3SelectionMap = new Map(); // item group <DOMElement> => shape
    this._$itemCommonShapeMap = new Map(); // one entry max in this map

    this._isContextEditable = false;
    this._behavior = null;

    this._valueToPixel = d3Scale.linear()
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

  // destroy() {
  //   this.timeContext = null;
  //   this.d3items = null;
  //   this.data = null;
  //   this.params = null;
  //   this._behavior = null;
  //
  //   // @TODO
  //      - clean Maps
  //      - clean listeners
  //      - clean behavior (behavior._layer)
  // }

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

  /**
   * TimeContext accessors
   */

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
    this.$el.classList.add('layer');
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

    // draw a Segment in context background to debug it's size
    if (this.params.debug) {
      this.$debugRect = document.createElementNS(ns, 'Segment');
      this.$boundingBox.appendChild(this.$debugRect);
      this.$debugRect.style.fill = '#ababab';
      this.$debugRect.style.fillOpacity = 0.1;
    }
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
  }

  // --------------------------------------
  // Behavior Accessors
  // --------------------------------------

  get selectedItems() {
    return this._behavior ? this._behavior.selectedItems : [];
  }

  select(...$items) {
    if (!this._behavior) { return; }
    if (!$items.length) { $items = this.d3items.nodes(); }

    $items.forEach(($el) => {
      const item = this._$itemD3SelectionMap.get($el);
      this._behavior.select($el, item.datum());
      this._toFront($el);
    });
  }

  unselect(...$items) {
    if (!this._behavior) { return; }
    if (!$items.length) { $items = this.d3items.nodes(); }

    $items.forEach(($el) => {
      const item = this._$itemD3SelectionMap.get($el);
      this._behavior.unselect($el, item.datum());
    });
  }

  toggleS$election(...$items) {
    if (!this._behavior) { return; }
    if (!$items.length) { $items = this.d3items.nodes(); }

    $items.forEach(($el) => {
      const item = this._$itemD3SelectionMap.get($el);
      this._behavior.toggleS$election($el, item.datum());
    });
  }

  edit($items, dx, dy, target) {
    if (!this._behavior) { return; }
    $items = !Array.isArray($items) ? [$items] : $items;

    $items.forEach(($el) => {
      const item  = this._$itemD3SelectionMap.get($el);
      const shape = this._$itemShapeMap.get($el);
      const datum = item.datum();
      this._behavior.edit(this._renderingContext, shape, datum, dx, dy, target);
      this.emit('edit', shape, datum);
    });
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
  _toFront($el) {
    this.$offset.appendChild($el);
  }

  /**
   *  Returns the d3Selection item to which the given DOMElement b$elongs
   *  @param `$el` {DOMElement} the element to be tested
   *  @return {DOMElement|null} item group containing the `$el` if b$elongs to this layer, null otherwise
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
   *  use d3 internally to retrieve the datum
   *  @param $item {DOMElement}
   *  @return {Object|Array|null} depending on the user data structure
   */
  getDatumFromItem($item) {
    const d3item = this._$itemD3SelectionMap.get($item);
    return d3item ? d3item.datum() : null;
  }

  /**
   *  Defines if the given d3 selection is an item of the layer
   *  @param item {DOMElement}
   *  @return {bool}
   */
  hasItem($item) {
    const nodes = this.d3items.nodes();
    return nodes.indexOf($item) !== -1;
  }

  /**
   *  Defines if a given element b$elongs to the layer
   *  is more general than `hasItem`, can be used to check interaction elements too
   *  @param $el {DOMElement}
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
   *  @param area {Object} area in which to find the elements
   *  @return {Array} list of the DOM elements in the given area
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

    const itemShapeMap = this._$itemShapeMap;
    const renderingContext = this._renderingContext;

    const items = this.d3items.filter(function(datum, index) {
      const group = this;
      const shape = itemShapeMap.get(group);
      return shape.inArea(renderingContext, datum, x1, y1, x2, y2);
    });

    return items[0].slice(0);
  }

  // --------------------------------------
  // Rendering / Display methods
  // --------------------------------------

  // /**
  //  *  Returns the previsouly created layer's container
  //  *  @return {DOMElement}
  //  */
  // renderContainer() {
  //   return this.$el;
  // }

  // /**
  //  *  Creates the DOM according to given data and shapes
  //  */
  // render(){
  //   this.drawShapes();
  // }

  render() {
    // force d3 to keep data in sync with the DOM with a unique id
    this.data.forEach(function(datum) {
      if (_datumIdMap.has(datum)) { return; }
      _datumIdMap.set(datum, _counter++);
    });

    // select items
    this.d3items = d3Selection.select(this.$offset)
      .selectAll('.item')
      .filter(function() {
        return !this.classList.contains('common');
      })
      .data(this.data, function(datum) {
        return _datumIdMap.get(datum);
      });

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

    // ... enter
    this.d3items.enter()
      .append((datum, index) => {
        // @NOTE: d3 binds `this` to the container group
        const { ctor, accessors, options } = this._shapeConfiguration;
        const shape = new ctor(options);
        shape.install(accessors);

        const $el = shape.render(this._renderingContext);
        $el.classList.add('item', shape.getClassName());

        this._$itemShapeMap.set($el, shape);
        this._$itemD3SelectionMap.set($el, d3Selection.select($el));

        return $el;
      });

    // ... exit
    const _$itemShapeMap = this._$itemShapeMap;
    const _$itemD3SelectionMap = this._$itemD3SelectionMap;

    this.d3items.exit()
      .each(function(datum, index) {
        const $el = this;
        const shape = _$itemShapeMap.get($el);
        // clean all shape/item references
        shape.destroy();
        _datumIdMap.delete(datum);
        _$itemShapeMap.delete($el);
        _$itemD3SelectionMap.delete($el);
      })
      .remove();
  }

  /**
   *  updates Context and Shapes
   */
  update() {
    this.updateContainer();
    this.updateShapes();
  }

  /**
   *  updates the context of the layer
   */
  updateContainer() {
    this._updateRenderingContext();

    const timeContext = this.timeContext;

    const width  = timeContext.timeToPixel(timeContext.duration);
    // offset is relative to tim$eline's timeContext
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
    this.contextShape.update(
      this._renderingContext,
      this.$interactions,
      this.timeContext,
      0
    );

    // debug context
    if (this.params.debug) {
      this.$debugRect.setAttributeNS(null, 'width', width);
      this.$debugRect.setAttributeNS(null, 'height', height);
    }
  }

  /**
   *  updates the Shapes which b$elongs to the layer
   *  @param item {DOMElement}
   */
  updateShapes($item = null) {
    this._updateRenderingContext();

    const that = this;
    const renderingContext = this._renderingContext;
    const items = $item !== null ? this._$itemD3SelectionMap.get($item) : this.d3items;
    // update common shapes
    this._$itemCommonShapeMap.forEach((shape, $item) => {
      shape.update(renderingContext, this.data);
    });

    // d3 update - entity or collection shapes
    items.each(function(datum, index) {
      const shape = that._$itemShapeMap.get(this);
      shape.update(renderingContext, datum, index);
    });
  }
}
