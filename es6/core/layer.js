const d3Scale = require('d3-scale');
const d3Selection = require('d3-selection');

const events = require('events');
const ns = require('./namespace');
const Segment = require('../shapes/segment');
const SegmentBehavior = require('../behaviors/segment-behavior');


// private item -> id map to force d3 tp keep in sync with the DOM
let _counter = 0;
const _datumIdMap = new Map();


class Layer extends events.EventEmitter {
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

    this.container = null; // offset group of the parent context
    this.group = null; // group created by the layer inside the context
    this.d3items = null; // d3 collection of the layer items

    this._shapeConfiguration = null; // { ctor, accessors, options }
    this._commonShapeConfiguration = null; // { ctor, accessors, options }

    this._itemElShapeMap = new Map(); // item group <DOMElement> => shape
    this._itemElD3SelectionMap = new Map(); // item group <DOMElement> => shape
    this._itemCommonShapeMap = new Map(); // one entry max in this map

    this._isContextEditable = false;
    this._behavior = null;

    this._yScale = d3Scale.linear()
      .domain(this.params.yDomain)
      .range([0, this.params.height]);

    // initialize timeContext layout
    this._render();
  }

  set yDomain(domain) {
    this.params.yDomain = domain;
    this._yScale.domain(domain);
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
   *  @mandatory define the context in which the layer is drawn
   *  @param context {TimeContext} the timeContext in which the layer is displayed
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
   *  to the `xScale` may change
   */
  _updateRenderingContext() {
    this._renderingContext.xScale = this.timeContext.xScale;
    this._renderingContext.yScale = this._yScale;
    this._renderingContext.height = this.params.height;
    this._renderingContext.width  = this.timeContext.xScale(this.timeContext.duration);
    // for foreign oject issue in chrome
    this._renderingContext.offsetX = this.timeContext.xScale(this.timeContext.offset);
  }

  // --------------------------------------
  // Behavior Accessors
  // --------------------------------------

  get selectedItems() {
    return this._behavior ? this._behavior.selectedItems : [];
  }

  select(...itemEls) {
    if (!this._behavior) { return; }
    if (!itemEls.length) { itemEls = this.d3items.nodes(); }

    itemEls.forEach((el) => {
      const item = this._itemElD3SelectionMap.get(el);
      this._behavior.select(el, item.datum());
      this._toFront(el);
    });
  }

  unselect(...itemEls) {
    if (!this._behavior) { return; }
    if (!itemEls.length) { itemEls = this.d3items.nodes(); }

    itemEls.forEach((el) => {
      const item = this._itemElD3SelectionMap.get(el);
      this._behavior.unselect(el, item.datum());
    });
  }

  toggleSelection(...itemEls) {
    if (!this._behavior) { return; }
    if (!itemEls.length) { itemEls = this.d3items.nodes(); }

    itemEls.forEach((el) => {
      const item = this._itemElD3SelectionMap.get(el);
      this._behavior.toggleSelection(el, item.datum());
    });
  }

  edit(itemEls, dx, dy, target) {
    if (!this._behavior) { return; }
    itemEls = !Array.isArray(itemEls) ? [itemEls] : itemEls;

    itemEls.forEach((el) => {
      const item  = this._itemElD3SelectionMap.get(el);
      const shape = this._itemElShapeMap.get(el);
      const datum = item.datum();
      this._behavior.edit(this._renderingContext, shape, datum, dx, dy, target);
      this.emit('edit', shape, datum);
    });
  }

  // --------------------------------------
  // Helpers
  // --------------------------------------

  /**
   *  moves an `el`'s group to the end of the layer (svg z-index...)
   *  @param `el` {DOMElement} the DOMElement to be moved
   */
  _toFront(el) {
    this.group.appendChild(el);
  }

  /**
   *  return the d3Selection item to which the given DOMElement belongs
   *  @param `el` {DOMElement} the element to be tested
   *  @return {mixed}
   *    {DOMElelement} item group containing the `el` if belongs to this layer
   *    {null} otherwise
   */
  getItemFromDOMElement(el) {
    let itemEl;

    do {
      if (el.classList && el.classList.contains('item')) {
        itemEl = el;
      }

      el = el.parentNode;
    } while (el != undefined);

    return this.hasItem(itemEl) ? itemEl : null;
  }


  /**
   *  Define if the given d3 selection is an item of the layer
   *  @param item {DOMElement}
   *  @return {bool}
   */
  hasItem(itemEl) {
    const nodes = this.d3items.nodes();
    return nodes.indexOf(itemEl) !== -1;
  }

  /**
   *  Define if a given element belongs to the layer
   *  is more general than `hasItem`, can be used to check interaction elements too
   *  @param el {DOMElement}
   *  @return {bool}
   */
  hasElement(el) {
    do {
      if (el === this.container) {
        return true;
      }

      el = el.parentNode;
    } while (el != undefined);

    return false;
  }

  /**
   *  @param area {Object} area in which to find the elements
   *  @return {Array} list of the DOM elements in the given area
   */
  getItemsInArea(area) {
    const start    = this.timeContext.xScale(this.timeContext.start);
    const duration = this.timeContext.xScale(this.timeContext.duration);
    const offset   = this.timeContext.xScale(this.timeContext.offset);
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

    const itemShapeMap = this._itemElShapeMap;
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

  /**
   *  render the DOM in memory on layer creation to be able to use it before
   *  the layer is actually inserted in the DOM
   */
  _render() {
    // wrapper group for `start, top and context flip matrix
    this.container = document.createElementNS(ns, 'g');
    this.container.classList.add('layer');
    // clip the context with a `svg` element
    this.boundingBox = document.createElementNS(ns, 'svg');
    this.boundingBox.classList.add('bounding-box');
    // group to apply offset
    this.group = document.createElementNS(ns, 'g');
    this.group.classList.add('offset', 'items');
    // context interactions
    this.interactionsGroup = document.createElementNS(ns, 'g');
    this.interactionsGroup.classList.add('layer-interactions');
    this.interactionsGroup.style.display = 'none';
    // @NOTE: works but king of ugly... should be cleaned
    this.contextShape = new Segment();
    this.contextShape.install({
      opacity: () => 0.1,
      color  : () => '#787878',
      width  : () => this.timeContext.duration,
      height : () => this._renderingContext.yScale.domain()[1],
      y      : () => this._renderingContext.yScale.domain()[0]
    });

    this.interactionsGroup.appendChild(this.contextShape.render());
    // create the DOM tree
    this.container.appendChild(this.boundingBox);
    this.boundingBox.appendChild(this.interactionsGroup);
    this.boundingBox.appendChild(this.group);

    // draw a Segment in context background to debug it's size
    if (this.params.debug) {
      this.debugRect = document.createElementNS(ns, 'Segment');
      this.boundingBox.appendChild(this.debugRect);
      this.debugRect.style.fill = '#ababab';
      this.debugRect.style.fillOpacity = 0.1;
    }
  }

  /**
   *  Creates the layer group with a transformation
   *  matrix to flip the coordinate system.
   *  @return {DOMElement}
   */
  render() {
    return this.container;
  }

  /**
   *  Creates the DOM according to given data and shapes
   */
  draw() {
    // force d3 to keep data in sync with the DOM with a unique id
    this.data.forEach(function(datum) {
      if (_datumIdMap.has(datum)) { return; }
      _datumIdMap.set(datum, _counter++);
    });

    // select items
    this.d3items = d3Selection.select(this.group)
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
      this._itemCommonShapeMap.size === 0
    ) {
      const { ctor, accessors, options } = this._commonShapeConfiguration;
      const group = document.createElementNS(ns, 'g');
      const shape = new ctor(options);

      shape.install(accessors);
      group.appendChild(shape.render());
      group.classList.add('item', 'common', shape.getClassName());

      this._itemCommonShapeMap.set(group, shape);
      this.group.appendChild(group);
    }

    // ... enter
    this.d3items.enter()
      .append((datum, index) => {
        // @NOTE: d3 binds `this` to the container group
        const { ctor, accessors, options } = this._shapeConfiguration;
        const shape = new ctor(options);
        shape.install(accessors);

        const el = shape.render(this._renderingContext)
        el.classList.add('item', shape.getClassName());
        this._itemElShapeMap.set(el, shape);
        this._itemElD3SelectionMap.set(el, d3Selection.select(el));

        return el;
      });

    // ... exit
    const _itemElShapeMap = this._itemElShapeMap;
    const _itemElD3SelectionMap = this._itemElD3SelectionMap;

    this.d3items.exit()
      .each(function(datum, index) {
        const el = this;
        const shape = _itemElShapeMap.get(el);
        // clean all shape/item references
        shape.destroy();
        _datumIdMap.delete(datum);
        _itemElShapeMap.delete(el);
        _itemElD3SelectionMap.delete(el);
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

    const width  = this.timeContext.xScale(this.timeContext.duration);
    // offset is relative to timeline's timeContext
    const x      = this.timeContext.parent.xScale(this.timeContext.start);
    const offset = this.timeContext.xScale(this.timeContext.offset);
    const top    = this.params.top;
    const height = this.params.height;
    // matrix to invert the coordinate system
    const translateMatrix = `matrix(1, 0, 0, -1, ${x}, ${top + height})`;

    this.container.setAttributeNS(null, 'transform', translateMatrix);

    this.boundingBox.setAttributeNS(null, 'width', width);
    this.boundingBox.setAttributeNS(null, 'height', height);
    this.boundingBox.style.opacity = this.params.opacity;

    this.group.setAttributeNS(null, 'transform', `translate(${offset}, 0)`);

    // maintain context shape
    this.contextShape.update(
      this._renderingContext,
      this.interactionsGroup,
      this.timeContext,
      0
    );

    // debug context
    if (this.params.debug) {
      this.debugRect.setAttributeNS(null, 'width', width);
      this.debugRect.setAttributeNS(null, 'height', height);
    }
  }

  /**
   *  updates the Shapes which belongs to the layer
   *  @param item {DOMElement}
   */
  updateShapes(item = null) {
    this._updateRenderingContext();

    const that = this;
    const renderingContext = this._renderingContext;
    const items = item !== null ? d3Selection.select(item) : this.d3items;

    // update common shapes
    this._itemCommonShapeMap.forEach((shape, item) => {
      shape.update(renderingContext, item, this.data);
    });

    // d3 update - entity or collection shapes
    items.each(function(datum, index) {
      const el = this;
      const shape = that._itemElShapeMap.get(el);
      shape.update(renderingContext, el, datum, index);
    });
  }
}

module.exports = Layer;
