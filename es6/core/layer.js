const Context = require('./context');
const ns = require('./namespace');

// create a private item -> id map to force d3 being in sync with the DOM
let _counter = 0;
const _datumIdMap = new Map();

class Layer {
  constructor(dataType = 'collection', data = [], options = {}) {
    this.dataType = dataType; // 'entity' || 'collection';
    this.data = data;

    const defaults = {
      height: 100, // should inherit from parent
      top: 0,
      debugContext: false, // pass the context in debug mode
    }

    this.params = Object.assign({}, defaults, options);

    // this.container = null; // offset group of the parent context
    this.group = null; // group created by the layer inside the context
    this.items = null; // d3 collection of the layer items

    // @NOTE remove in favor of LayerGroup ?
    // @private ?
    this.innerLayers = [];

    // ctor => accessors
    this._shapeConfiguration = null; // { ctor, accessors }
    this._commonShapeConfiguration = null; // { ctor, accessors }
    // item group <DOMElement> => shape
    this._itemShapeMap = new Map();
    this._itemCommonShapeMap = new Map(); // one entry max in this map

    this._behavior = null;
  }

  initialize(parentContext) {
    this.context = new Context(parentContext, {
      height: this.params.height,
      top: this.params.top,
      debug: this.params.debugContext
    });

    this.context.addClass('layer');
  }

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
      default:
        this._data = data;
        break;
    }
  }

  // @NOTE remove in favor of layer's Group ?
  addLayer(layer) {
    // @TODO insert a layer inside an already existing layers
    layer.initialize(this.context);
    this.innerLayers.push(layer);
  }

  // --------------------------------------
  // Configure Component
  // --------------------------------------

  /**
   *  Register the shape and its accessors to use in order to render
   *  the entity or collection
   *  @param ctor <Function:BaseShape> the constructor of the shape to be used
   *  @param accessors <Object> accessors to use in order to map the data structure
   */
  setShape(ctor, accessors = {}, options = {}) {
    this._shapeConfiguration = { ctor, accessors };
  }

  /**
   *  Register the shape to use with the entire collection
   *  example: the line in a beakpoint function
   *  @param ctor <BaseShape> the constructor of the shape to use to render data
   *  @param accessors <Object> accessors to use in order to map the data structure
   */
  setCommonShape(ctor, accessors = {}, options = {}) {
    this._commonShapeConfiguration = { ctor, accessors };
  }

  /**
   *  Register the behavior to use when interacting with the shape
   *  @param behavior <BaseBehavior>
   */
  setBehavior(behavior) {
    behavior.initialize(this);
    this._behavior = behavior;
  }

  // --------------------------------------
  // Context Accessors
  // --------------------------------------

  // @TODO setContextParameters
  // @TODO use an object to share a reference with application code

  // context accessors - these are only commands
  get contextConfiguration() {}

  // these parameters should be in an object to work with references
  get start() { return this.context.start; }
  set start(value) { this.context.start = value; }

  get duration() { return this.context.duration; }
  set duration(value) { this.context.duration = value; }

  get offset() { return this.context.offset; }
  set offset(value) { this.context.offset = value; }

  get stretchRatio() { return this.context.stretchRatio; }
  set stretchRatio(value) { this.context.stretchRatio = value; }

  get yDomain() { return this.context.yDomain; }
  set yDomain(value) { this.context.yDomain = value; }

  get opacity() { return this.context.opacity; }
  set opacity(value) { this.context.opacity = value; }

  // @NOTE : move this in higher abstraction level ? => probably yes
  // apply the stretch ration on the data, reset stretch to 1
  // applyStretch() {}

  // --------------------------------------
  // Behavior Accessors
  // --------------------------------------

  /**
   *  Behavior entry points
   *  @NOTE API -> change for an Array as first argument
   *  @TODO     -> handle if no behavior is registered
   */
  get selectedItems() { return this._behavior.selectedItems; }

  select(...items) {
    items.forEach((item) => {
      const datum = d3.select(item).datum();
      this._behavior.select(item, datum);
    });
  }

  unselect(...items) {
    items.forEach((item) => {
      const datum = d3.select(item).datum();
      this._behavior.unselect(item, datum);
    });
  }
  // @TODO test
  selectAll() {
    this.items.forEach((item) => this.select(item));
  }

  unselectAll() {
    this.selectedItems.forEach((item) => this.unselect(item));
  }

  toggleSelection(...items) {
    items.forEach((item) => {
      const datum = d3.select(item).datum();
      this._behavior.toggleSelection(item, datum);
    });
  }

  // @TODO change signature edit(items = [...], dx, dy, target);
  // -> be consistent for all behaviors API
  edit(item, dx, dy, target) {
    const datum = d3.select(item).datum();
    const shape = this._itemShapeMap.get(item);
    this._behavior.edit(this.context, shape, datum, dx, dy, target);
  }

  // --------------------------------------
  // Helpers
  // --------------------------------------

  /**
   * @return <DOMElement> the closest parent `item` group for a given DOM element
   */
  getItemFromDOMElement(el) {
    do {
      if (el.nodeName === 'g' && el.classList.contains('item')) {
        return el;
      }
    } while (el = el.parentNode);
  }

  /**
   *  @param <DOMElement> the element we want to find the closest `.item` group
   *  @return <mixed>
   *    <DOMElement> item group containing the el if belongs to this layer
   *    null otherwise
   */
  hasItem(el) {
    const item = this.getItemFromDOMElement(el);
    return (this.items[0].indexOf(item) !== -1) ? item : null;
  }

  /**
   *  @param area <Object> area in which to find the elements
   *  @return <Array> list of the DOM elements in the given area
   */
  getItemsInArea(area) {
    // work in pixel domain
    const start    = this.context.xScale(this.context.start);
    const duration = this.context.xScale(this.context.duration);
    const offset   = this.context.xScale(this.context.offset);
    const top      = this.params.top;
    // must be aware of the layer's context modifications
    // constrain in working view
    let x1 = Math.max(area.left, start);
    let x2 = Math.min(area.left + area.width, start + duration);
    // apply start and offset
    x1 -= (start + offset);
    x2 -= (start + offset);
    // @FIXME stretchRatio breaks selection
    // x2 *= this.context.stretchRatio;
    // be consistent with context y coordinates system
    let y1 = this.params.height - (area.top + area.height);
    let y2 = this.params.height - area.top;

    y1 += this.params.top;
    y2 += this.params.top;

    const itemShapeMap = this._itemShapeMap;
    const context = this.context;

    const items = this.items.filter(function(datum, index) {
      const group = this;
      const shape = itemShapeMap.get(group);
      return shape.inArea(context, datum, x1, y1, x2, y2);
    });

    return items[0].slice(0);
  }

  // helper to add some class or stuff on items
  each(callback = null) {}

  /**
   *  creates the layer group with a transformation matrix to flip the coordinate system.
   *  @NOTE: put the context inside the layer group ? reverse the DOM order
   */
  render() {
    const height = this.params.height;
    const top    = this.params.top;
    // matrix to invert the coordinate system
    const invertMatrix = `matrix(1, 0, 0, -1, 0, ${height})`;
    // create the DOM of the context
    const el = this.context.render();
    // create a group to flip the context of the layer
    this.group = document.createElementNS(ns, 'g');
    this.group.classList.add('items');
    this.group.setAttributeNS(null, 'transform', invertMatrix);
    // append the group to the context
    this.context.offsetGroup.appendChild(this.group);
    const innerGroup = this.context.offsetGroup;

    this.innerLayers.forEach((layer) => {
      innerGroup.appendChild(layer.render())
    });

    return el;
  }

  /**
   * create the DOM according to given data and shapes
   */
  draw() {
    // @NOTE: create a unique id to force d3 to keep data in sync with the DOM
    // @TODO: read again http://bost.ocks.org/mike/selection/
    this.data.forEach(function(datum) {
      if (_datumIdMap.has(datum)) { return; }
      _datumIdMap.set(datum, _counter++);
    });

    // select items
    this.items = d3.select(this.group)
      .selectAll('.item')
      .filter(function() {
        return !this.classList.contains('common')
      })
      .data(this.data, function(datum) {
        return _datumIdMap.get(datum);
      });

    // handle commonShapes
    if (this._commonShapeConfiguration !== null) {
      const { ctor, accessors } = this._commonShapeConfiguration;
      const group = document.createElementNS(ns, 'g');
      const shape = new ctor(group);

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
        // create a group for the item
        const group = document.createElementNS(ns, 'g');
        const { ctor, accessors } = this._shapeConfiguration;
        const shape = new ctor();
        // install accessors on the newly created shape
        shape.install(accessors);

        group.appendChild(shape.render(this.context));
        group.classList.add('item', shape.getClassName());

        this._itemShapeMap.set(group, shape);

        return group;
      });

    // exit
    const that = this;

    this.items.exit()
      .each(function(datum, index) {
        const group = this;
        const shape = that._itemShapesMap.get(group);

        shape.destroy(); // clean shape
        _datumIdMap.delete(datum); // clean reference in `id` map
        that._itemShapeMap.delete(group); // destroy reference in item shape map
      })
      .remove();

    // render innerLayers
    this.innerLayers.forEach((layer) => layer.draw());
  }

  /**
   *  updates DOM context and shapes
   */
  update() {
    this.updateContext();
    this.updateShapes();
  }

  /**
   *  updates DOM context only
   */
  updateContext() {
    // update context
    this.context.update();
    // update innerLayers
    this.innerLayers.forEach((layer) => layer.updateContext());
  }

  /**
   *  updates DOM context and Shapes
   *  @param
   */
  updateShapes(item = null) {
    const that = this;
    const context = this.context;
    const items = item !== null ? d3.selectAll(item) : this.items;

    // update common shapes
    this._itemCommonShapeMap.forEach((shape, item) => {
      shape.update(context, item, this.data);
    });

    // update entity or collection shapes
    items.each(function(datum, index) {
      // update all shapes related to the current item
      const group = this; // current `g.item`
      const shape = that._itemShapeMap.get(group);
      shape.update(context, group, datum, index);
    });

    // update innerLayers
    this.innerLayers.forEach((layer) => layer.updateShapes());
  }
}

module.exports = Layer;
