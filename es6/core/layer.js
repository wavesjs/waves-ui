const Context = require('./context');
const ns = require('./namespace');

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

    this.innerLayers = []; // not used yet

    this.commonShapes = new Map; // { ctor: [instance], ... }

    this._shapes = new Map();
    this._itemShapesMap = new Map();

    // @TODO
    this.shapeAccessorsMap = new Map();

    // maintain a list of the layers selected items
    // @TODO change for a raw array - easier to consume outside
    // this.selectedItems = new Set();
  }

  get data() { return this._data; }

  set data(data) {
    if (this.dataType === 'entity') { data = [data]; }
    this._data = data;
  }

  initialize(parentContext) {
    this.context = new Context(parentContext, {
      height: this.params.height,
      top: this.params.top,
      debug: this.params.debugContext
    });

    this.context.addClass('layer');
  }

  // @NOTE remove in favor of layer's Group ?
  addLayer(layer) {
    // @TODO insert a layer inside an already existing layers
    layer.initialize(this.context);
    this.innerLayers.push(layer);
  }

  // register the shape(s) and its accessors to use in order to render the entity or collection
  useShape(ctor, accessors = {}) {
    this._shapes = this._shapes.set(ctor, accessors);
  }

  // register the shape(s) to use that is common to the entire collection
  // example: the line in a beakpoint function
  useCommonShape(...shapes /*, accessors */) {
    shapes.forEach((ctor) => {
      // initialize the value to null, is used to test
      // if the common shape must be rendered (if null) or not
      this.commonShapes.set(ctor, null);
    });
  }

  configureBehavior(behavior) {
    behavior.initialize(this);
    this.behavior = behavior;
  }

  // @TODO rename ?
  // configureShape(ctor, accessors) {}
  // configureCommonShape(ctor, accessors) {}

  // @TODO setParam

  // context accessors - these are only commands
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

  // @WARNING: be careful with method profusion

  // @NOTE : move this in higher abstraction level ? => probably yes
  // apply the stretch ration on the data, reset stretch to 1
  // applyStretch() {}

  // store key/function pairs to set accessors for one shape
  // setShapeAccessors(ctor, accessors = {}) {}

  // helper to add some class or stuff on items
  each(callback = null) {}

  /**
   * returns the closest `item` form a given DOM element
   */
  _getItemFromDOMElement(el) {
    do {
      if (el.nodeName === 'g' && el.classList.contains('item')) {
        return el;
      }
    } while (el = el.parentNode);
  }

  /**
   *  @param <DOMElement> the element we want to find the closest `.item` group
   *  @return
   *    <DOMElement> item group containing the el if belongs to this layer
   *    null otherwise
   */
  hasItem(el) {
    const item = this._getItemFromDOMElement(el);
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

    const itemShapesMap = this._itemShapesMap;
    const context = this.context;

    const items = this.items.filter(function(datum, index) {
      const group = this;
      const shapes = itemShapesMap.get(group);

      const inArea = shapes.map(function(shape) {
        return shape.inArea(context, datum, x1, x2, y1, y2);
      });

      return inArea.indexOf(true) !== -1;
    });

    return items[0].slice(0);
  }

  // execute(command /*, params, event ? */) {
  //   switch(command) {

  //   }

  //   this.innerLayers.forEach((layer) => {
  //     layer.execute(command);
  //   });
  // }

  // @TODO move in BaseBehavior

  // handleSelectionShape =
  /**
   *  Behavior entry points
   *  @NOTE API -> change for an Array as first argument
   */
  select(...items) {
    items.forEach((item) => {
      const datum = d3.select(item).datum();
      this.behavior.select(item, datum);
    });
  }

  unselect(...items) {
    items.forEach((item) => {
      const datum = d3.select(item).datum();
      this.behavior.unselect(item, datum);
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
      this.behavior.toggleSelection(item, datum);
    });
  }

  get selectedItems() { return this.behavior.selectedItems; }

  // - shape edition
  // ------------------------------------------------
  // move(item, dx, dy, target) {}
  // resize(item, dx, dy, target) {}
  edit(item, dx, dy, target) {
    const datum = d3.select(item).datum();
    this.behavior.edit(item, datum, dx, dy, target);
  }

  // move(item, dx, dy, target) {}
  // resize(item, dx, dy, target) {}

  // END REWRITE


  /**
   *  creates the layer group with a transformation matrix
   *  to flip the coordinate system.
   *  @NOTE: put the context inside the layer group ?
   *         reverse the DOM order
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
    this.commonShapes.forEach((shape, ctor) => {
      if (shape !== null) { return; }

      const group = document.createElementNS(ns, 'g');
      const shape = new ctor(group);

      group.appendChild(shape.render());
      group.classList.add('item', 'common', shape.getClassName());
      // store instance inside the commonShapes Map
      this.commonShapes.set(ctor, { group, shape });
      this.group.appendChild(group);
    });

    // enter
    this.items.enter()
      .append((datum, index) => {
        // @NOTE: d3 binds `this` to the container group
        // create a group for the item
        const group = document.createElementNS(ns, 'g');
        group.classList.add('item');

        // create all the shapes related to the current item
        let shapes = [];

        this._shapes.forEach((accessors, ctor, map) => {
          const shape = new ctor();
          // install accessors on the newly created shape
          shape.install(accessors);

          group.appendChild(shape.render());
          group.classList.add(shape.getClassName());
          shapes.push(shape);
        });

        this._itemShapesMap.set(group, shapes);

        return group;
      });

    // exit
    const that = this;

    this.items.exit()
      .each(function(datum, index) {
        const group = this;
        const shapes = that._itemShapesMap.get(group);
        // clean shapes
        shapes.forEach((shape) => shape.destroy());
        // delete reference in `id` map
        _datumIdMap.delete(datum);
        // destroy references in item shapes map
        that._itemShapesMap.delete(group)
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
   */
  updateShapes(item = null) {
    const that = this;
    const context = this.context;
    const items = item !== null ? d3.selectAll(item) : this.items;

    // update common shapes
    this.commonShapes.forEach((details, ctor) => {
      details.shape.update(context, details.group, this.data);
    });

    // update entity or collection shapes
    this.items.each(function(datum, index) {
      // update all shapes related to the current item
      const group = this; // current `g.item`
      const shapes = that._itemShapesMap.get(group);
      shapes.forEach((shape) => shape.update(context, group, datum, index));
    });

    // update innerLayers
    this.innerLayers.forEach((layer) => layer.updateShapes());
  }
}

module.exports = Layer;
