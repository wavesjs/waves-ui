const ns = require('./namespace');
const d3Scale = require('d3-scale');
const d3Selection = require('d3-selection');
const Segment = require('../shapes/segment');
const SegmentBehavior = require('../behaviors/segment-behavior');
const events = require('events');

// create a private item -> id map
// in order to force d3 keeping in sync with the DOM
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
    this.items = null; // d3 collection of the layer items

    this._shapeConfiguration = null; // { ctor, accessors, options }
    this._commonShapeConfiguration = null; // { ctor, accessors, options }

    this._itemShapeMap = new Map(); // item group <DOMElement> => shape
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

  param(name, value) {
    this.params[name] = value;
  }

  /**
   *  @mandatory define the context in which the layer is drawn
   *  @param context {TimeContext} the timeContext in which the layer is displayed
   */
  setTimeContext(timeContext) {
    this.timeContext = timeContext;
    // create a mixin to pass to shapes
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
        if (this._data) { // if data already exists, reuse the reference
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

  /**
   *  Behavior entry points
   *  @NOTE API -> change for an Array as first argument
   *  @TODO     -> handle if no behavior is registered
   */
  get selectedItems() {
    return this._behavior ? this._behavior.selectedItems : [];
  }

  select(items) {
    if (!this._behavior || !items) { return; }
    items = Array.isArray(items) ? items : [items];

    items.forEach((item) => {
      item = this._getItemFromDOMElement(item);
      const datum = d3Selection.select(item).datum();
      this._behavior.select(item, datum);
      this._toFront(item);
    });
  }

  unselect(items) {
    if (!this._behavior || !items) { return; }
    items = Array.isArray(items) ? items : [items];

    items.forEach((item) => {
      const datum = d3Selection.select(item).datum();
      this._behavior.unselect(item, datum);
    });
  }

  selectAll() {
    this.items.forEach((item) => this.select(item));
  }

  unselectAll() {
    this.selectedItems.forEach((item) => this.unselect(item));
  }

  toggleSelection(items) {
    if (!this._behavior || !items) { return; }
    items = Array.isArray(items) ? items : [items];

    items.forEach((item) => {
      const datum = d3Selection.select(item).datum();
      this._behavior.toggleSelection(item, datum);
    });
  }

  // @TODO change signature edit(items = [...], dx, dy, target);
  // -> be consistent for all behaviors API
  edit(item, dx, dy, target) {
    const datum = d3Selection.select(item).datum();
    const shape = this._itemShapeMap.get(item);
    this._behavior.edit(this._renderingContext, shape, datum, dx, dy, target);
    this.emit('edit', shape, datum);
  }

  // --------------------------------------
  // Context Behavior
  // --------------------------------------

  /**
   *  draw the shape to interact with the context
   *  @params bool {Boolean} define if the layer's context is editable or not
   */
  set editable(bool) {
    const display = bool ? 'block' : 'none';
    this.interactionsGroup.style.display = display;
    this._isContextEditable = bool;
  }

  get editable() {
    return this._isContextEditable;
  }

  // @NOTE create a proper `ContextBehavior` ?
  editContext(dx, dy, target) {
    if (target.classList.contains('handler') && target.classList.contains('left')) {
      this._editContextLeft(dx);
    } else if (target.classList.contains('handler') && target.classList.contains('right')) {
      this._editContextRight(dx);
    } else {
      this._moveContext(dx);
    }
  }

  _editContextLeft(dx) {
    const timeContext = this.timeContext;
    const renderingContext  = this._renderingContext;
    // edit `context.start`, `context.offset` and `context.duration`
    const x = renderingContext.xScale(timeContext.start);
    const offset = renderingContext.xScale(timeContext.offset);
    const width = renderingContext.xScale(timeContext.duration);

    const targetX = x + dx;
    const targetOffset = offset - dx;
    const targetWidth = Math.max(width - dx, 0);

    this.timeContext.start = renderingContext.xScale.invert(targetX);
    this.timeContext.offset = renderingContext.xScale.invert(targetOffset);
    this.timeContext.duration = renderingContext.xScale.invert(targetWidth);
  }

  _editContextRight(dx) {
    const timeContext = this.timeContext;
    const renderingContext  = this._renderingContext;
    const width = renderingContext.xScale(timeContext.duration);
    const targetWidth = Math.max(width + dx, 0);

    this.timeContext.duration = renderingContext.xScale.invert(targetWidth);
  }

  _moveContext(dx) {
    const timeContext = this.timeContext;
    const renderingContext  = this._renderingContext;
    // edit `context.start`
    const x = renderingContext.xScale(timeContext.start);
    const targetX = Math.max(x + dx, 0);

    this.timeContext.start = renderingContext.xScale.invert(targetX);
  }

  stretchContext(dx, dy, target) {}

  // --------------------------------------
  // Helpers
  // --------------------------------------

  /**
   *  @NOTE is only used on `hasItem` => no need to separate this method
   *  @return {DOMElement} the closest parent `item` group for a given DOM element
   */
  _getItemFromDOMElement(el) {
    do {
      if (el.classList && el.classList.contains('item')) { return el; }
      el = el.parentNode;
    } while (el != undefined);
  }

  /**
   *  @NOTE bad method name !!!
   *  Define if an given DOM element belongs to one of the `items`
   *  @param `el` {DOMElement} the element to be tested
   *  @return {mixed}
   *    {DOMElement} item group containing the `el` if belongs to this layer
   *    null otherwise
   */
  hasItem(el) {
    const item = this._getItemFromDOMElement(el);
    return (this.items.nodes().indexOf(item) !== -1) ? item : null;
  }

  /**
   *  moves an `item`'s group to the end of the layer (svg z-index...)
   *  @param `item` {DOMElement} the item to be moved
   */
  _toFront(item) {
    this.group.appendChild(item);
  }

  /**
   *  Define if a given element belongs to the layer
   *  is more general than `hasItem`, can be used to check interaction elements too
   */
  hasElement(el) {
    do {
      if (el === this.container) { return true; }
      el = el.parentNode;
    } while (el != undefined);

    return false;
  }

  /**
   *  @param area {Object} area in which to find the elements
   *  @return {Array} list of the DOM elements in the given area
   */
  getItemsInArea(area) {
    // work in pixel domain
    const start    = this.timeContext.xScale(this.timeContext.start);
    const duration = this.timeContext.xScale(this.timeContext.duration);
    const offset   = this.timeContext.xScale(this.timeContext.offset);
    const top      = this.params.top;
    // must be aware of the layer's context modifications
    // constrain in working view
    let x1 = Math.max(area.left, start);
    let x2 = Math.min(area.left + area.width, start + duration);
    // apply start and offset
    x1 -= (start + offset);
    x2 -= (start + offset);
    // be consistent with context y coordinates system
    let y1 = this.params.height - (area.top + area.height);
    let y2 = this.params.height - area.top;

    y1 += this.params.top;
    y2 += this.params.top;

    const itemShapeMap = this._itemShapeMap;
    const renderingContext = this._renderingContext;

    const items = this.items.filter(function(datum, index) {
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
    // append a svg to clip the context
    // @NOTE: could use a group with a `clipPath` property ?
    this.boundingBox = document.createElementNS(ns, 'svg');
    this.boundingBox.classList.add('bounding-box');
    // this.boundingBox.setAttributeNS(null, 'id', this.params.id);
    // group to apply offset
    this.group = document.createElementNS(ns, 'g');
    this.group.classList.add('offset', 'items');

    // context interactions
    this.interactionsGroup = document.createElementNS(ns, 'g');
    this.interactionsGroup.classList.add('layer-interactions');
    this.interactionsGroup.style.display = 'none';
    // @NOTE: works but king of ugly... must be cleaned
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
   *  creates the layer group with a transformation matrix to flip the coordinate system.
   *  @return {DOMElement}
   */
  render() {
    return this.container;
  }

  /**
   * create the DOM according to given data and shapes
   */
  draw() {
    // create a unique id to force d3 to keep data in sync with the DOM
    this.data.forEach(function(datum) {
      if (_datumIdMap.has(datum)) { return; }
      _datumIdMap.set(datum, _counter++);
    });

    // select items
    this.items = d3Selection.select(this.group)
      .selectAll('.item')
      .filter(function() {
        return !this.classList.contains('common');
      })
      .data(this.data, function(datum) {
        return _datumIdMap.get(datum);
      });

    // handle commonShapes -> render only once
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

    // enter
    this.items.enter()
      .append((datum, index) => {
        // @NOTE: d3 binds `this` to the container group
        const { ctor, accessors, options } = this._shapeConfiguration;
        const shape = new ctor(options);
        shape.install(accessors);

        const item = shape.render(this._renderingContext)
        item.classList.add('item', shape.getClassName());
        this._itemShapeMap.set(item, shape);

        return item;
      });

    // exit
    const _itemShapeMap = this._itemShapeMap;

    this.items.exit()
      .each(function(datum, index) {
        const item = this;
        const shape = _itemShapeMap.get(item);
        // clean all shape/item references
        shape.destroy();
        _datumIdMap.delete(datum);
        _itemShapeMap.delete(item);
      })
      .remove();
  }

  /**
   *  updates Context and Shapes
   */
  update() {
    this._updateRenderingContext();

    this.updateContainer();
    this.updateShapes();
  }

  /**
   *  updates the context of the layer
   */
  updateContainer() {
    const x      = this.timeContext.xScale(this.timeContext.start);
    const width  = this.timeContext.xScale(this.timeContext.duration);
    // offset is relative to timeline's timeContext
    const offset = this.timeContext.parent.xScale(this.timeContext.offset);
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
    const that = this;
    const renderingContext = this._renderingContext;
    const items = item !== null ? d3Selection.selectAll(item) : this.items;

    // update common shapes
    this._itemCommonShapeMap.forEach((shape, item) => {
      shape.update(renderingContext, item, this.data);
    });

    // update entity or collection shapes
    items.each(function(datum, index) {
      const item = this;
      const shape = that._itemShapeMap.get(item);
      shape.update(renderingContext, item, datum, index);
    });
  }
}

module.exports = Layer;
