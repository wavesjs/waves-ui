"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var ns = require("./namespace");
var d3Scale = require("d3-scale");
var d3Selection = require("d3-selection");
var Rect = require("../shapes/rect");
var SegmentBehavior = require("../behaviors/segment-behavior");
var events = require("events");

// create a private item -> id map to force d3 being in sync with the DOM
var _counter = 0;
var _datumIdMap = new _core.Map();

var Layer = (function (_events$EventEmitter) {
  function Layer() {
    var dataType = arguments[0] === undefined ? "collection" : arguments[0];
    var data = arguments[1] === undefined ? [] : arguments[1];
    var options = arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, Layer);

    _get(_core.Object.getPrototypeOf(Layer.prototype), "constructor", this).call(this);
    this.dataType = dataType; // 'entity' || 'collection';
    this.data = data;

    var defaults = {
      height: 100, // should inherit from parent
      top: 0,
      id: "",
      yDomain: [0, 1],
      opacity: 1,
      debugContext: false, // pass the context in debug mode
      contextHandlerWidth: 2
    };

    this.params = _core.Object.assign({}, defaults, options);

    this.container = null; // offset group of the parent context
    this.group = null; // group created by the layer inside the context
    this.items = null; // d3 collection of the layer items

    this._shapeConfiguration = null; // { ctor, accessors, options }
    this._commonShapeConfiguration = null; // { ctor, accessors, options }

    this._itemShapeMap = new _core.Map(); // item group <DOMElement> => shape
    this._itemCommonShapeMap = new _core.Map(); // one entry max in this map

    this._isContextEditable = false;

    // component configuration
    this._behavior = null;
    this._context = null;
    this._contextAttributes = null;

    this._yScale = d3Scale.linear().domain(this.params.yDomain).range([0, this.params.height]);

    // initialize context
    this._render();
  }

  _inherits(Layer, _events$EventEmitter);

  _createClass(Layer, {
    yDomain: {
      set: function (domain) {
        this.params.yDomain = domain;
        this._yScale.domain(domain);
      },
      get: function () {
        return this.params.yDomain;
      }
    },
    opacity: {
      set: function (value) {
        this.params.opacity = value;
      },
      get: function () {
        return this.params.opacity;
      }
    },
    param: {
      value: function param(name, value) {
        this.params[name] = value;
      }
    },
    setContext: {

      /**
       *  @mandatory define the context in which the layer is drawn
       *  @param context {TimeContext} the timeContext in which the layer is displayed
       */

      value: function setContext(context) {
        this._context = context;

        // maintain a reference of the context state to be used in application
        this._contextAttributes = {
          start: this._context.start,
          duration: this._context.duration,
          offset: this._context.offset,
          stretchRatio: this._context.stretchRatio
        };

        // create a mixin to pass to shapes
        this._renderingContext = {};
        this._updateRenderingContext();
      }
    },
    data: {

      // --------------------------------------
      // Data
      // --------------------------------------

      get: function () {
        return this._data;
      },
      set: function (data) {
        switch (this.dataType) {
          case "entity":
            if (this._data) {
              // if data already exists, reuse the reference
              this._data[0] = data;
            } else {
              this._data = [data];
            }
            break;
          case "collection":
            this._data = data;
            break;
        }
      }
    },
    configureShape: {

      // --------------------------------------
      // Component Configuration
      // --------------------------------------

      /**
       *  Register the shape and its accessors to use in order to render
       *  the entity or collection
       *  @param ctor <Function:BaseShape> the constructor of the shape to be used
       *  @param accessors <Object> accessors to use in order to map the data structure
       */

      value: function configureShape(ctor) {
        var accessors = arguments[1] === undefined ? {} : arguments[1];
        var options = arguments[2] === undefined ? {} : arguments[2];

        this._shapeConfiguration = { ctor: ctor, accessors: accessors, options: options };
      }
    },
    configureCommonShape: {

      /**
       *  Register the shape to use with the entire collection
       *  example: the line in a beakpoint function
       *  @param ctor {BaseShape} the constructor of the shape to use to render data
       *  @param accessors {Object} accessors to use in order to map the data structure
       */

      value: function configureCommonShape(ctor) {
        var accessors = arguments[1] === undefined ? {} : arguments[1];
        var options = arguments[2] === undefined ? {} : arguments[2];

        this._commonShapeConfiguration = { ctor: ctor, accessors: accessors, options: options };
      }
    },
    setBehavior: {

      /**
       *  @NOTE should be merge in setShape for consistency but problem to define the method signature
       *  Register the behavior to use when interacting with the shape
       *  @param behavior {BaseBehavior}
       */

      value: function setBehavior(behavior) {
        behavior.initialize(this);
        this._behavior = behavior;
      }
    },
    contextAttributes: {

      // --------------------------------------
      // Context Attributes Accessors
      // --------------------------------------

      /**
       *  Use an external obj to use as the `contextAttribute` wrapper
       *  @param obj {Object}
       */

      set: function (obj) {
        this._contextAttributes = obj;
      },
      get: function () {
        return this._contextAttributes;
      }
    },
    setContextAttribute: {

      /**
       *  update a given attribute of the context
       *  @param name {String} the key of the attribute to update
       *  @param value {mixed}
       */

      value: function setContextAttribute(name, value) {
        this._contextAttributes[name] = value;
        this._context[name] = value;
      }
    },
    _updateRenderingContext: {

      /**
       *  update the values in `_renderingContext`
       *  is particulary needed when updating `stretchRatio` as the pointer
       *  to the `xScale` may change
       */

      value: function _updateRenderingContext() {
        this._renderingContext.xScale = this._context.xScale;
        this._renderingContext.yScale = this._yScale;
        this._renderingContext.height = this.params.height;
        this._renderingContext.width = this._context.xScale(this._context.duration);
        // for foreign oject issue in chrome
        this._renderingContext.offsetX = this._context.xScale(this._context.offset);
      }
    },
    selectedItems: {

      // --------------------------------------
      // Behavior Accessors
      // --------------------------------------

      /**
       *  Behavior entry points
       *  @NOTE API -> change for an Array as first argument
       *  @TODO     -> handle if no behavior is registered
       */

      get: function () {
        return this._behavior ? this._behavior.selectedItems : [];
      }
    },
    select: {
      value: function select(items) {
        var _this = this;

        if (!this._behavior || !items) {
          return;
        }
        items = Array.isArray(items) ? items : [items];

        items.forEach(function (item) {
          item = _this._getItemFromDOMElement(item);
          var datum = d3Selection.select(item).datum();
          _this._behavior.select(item, datum);
          _this._toFront(item);
        });
      }
    },
    unselect: {
      value: function unselect(items) {
        var _this = this;

        if (!this._behavior || !items) {
          return;
        }
        items = Array.isArray(items) ? items : [items];

        items.forEach(function (item) {
          var datum = d3Selection.select(item).datum();
          _this._behavior.unselect(item, datum);
        });
      }
    },
    selectAll: {
      value: function selectAll() {
        var _this = this;

        this.items.forEach(function (item) {
          return _this.select(item);
        });
      }
    },
    unselectAll: {
      value: function unselectAll() {
        var _this = this;

        this.selectedItems.forEach(function (item) {
          return _this.unselect(item);
        });
      }
    },
    toggleSelection: {
      value: function toggleSelection(items) {
        var _this = this;

        if (!this._behavior || !items) {
          return;
        }
        items = Array.isArray(items) ? items : [items];

        items.forEach(function (item) {
          var datum = d3Selection.select(item).datum();
          _this._behavior.toggleSelection(item, datum);
        });
      }
    },
    edit: {

      // @TODO change signature edit(items = [...], dx, dy, target);
      // -> be consistent for all behaviors API

      value: function edit(item, dx, dy, target) {
        var datum = d3Selection.select(item).datum();
        var shape = this._itemShapeMap.get(item);
        this._behavior.edit(this._renderingContext, shape, datum, dx, dy, target);
        this.emit("edit", shape, datum);
      }
    },
    editable: {

      // --------------------------------------
      // Context Behavior
      // --------------------------------------

      /**
       *  draw the shape to interact with the context
       *  @params bool {Boolean} define if the layer's context is editable or not
       */

      set: function (bool) {
        var display = bool ? "block" : "none";
        this.interactionsGroup.style.display = display;
        this._isContextEditable = bool;
      },
      get: function () {
        return this._isContextEditable;
      }
    },
    editContext: {

      // @NOTE create a proper `ContextBehavior` ?

      value: function editContext(dx, dy, target) {
        if (target.classList.contains("handler") && target.classList.contains("left")) {
          this._editContextLeft(dx);
        } else if (target.classList.contains("handler") && target.classList.contains("right")) {
          this._editContextRight(dx);
        } else {
          this._moveContext(dx);
        }
      }
    },
    _editContextLeft: {
      value: function _editContextLeft(dx) {
        var contextAttributes = this._contextAttributes;
        var renderingContext = this._renderingContext;
        // edit `context.start`, `context.offset` and `context.duration`
        var x = renderingContext.xScale(contextAttributes.start);
        var offset = renderingContext.xScale(contextAttributes.offset);
        var width = renderingContext.xScale(contextAttributes.duration);

        var targetX = x + dx;
        var targetOffset = offset - dx;
        var targetWidth = Math.max(width - dx, 0);

        this.setContextAttribute("start", renderingContext.xScale.invert(targetX));
        this.setContextAttribute("offset", renderingContext.xScale.invert(targetOffset));
        this.setContextAttribute("duration", renderingContext.xScale.invert(targetWidth));
      }
    },
    _editContextRight: {
      value: function _editContextRight(dx) {
        var contextAttributes = this._contextAttributes;
        var renderingContext = this._renderingContext;
        // edit `context.duration`
        var width = renderingContext.xScale(contextAttributes.duration);
        var targetWidth = Math.max(width + dx, 0);

        this.setContextAttribute("duration", renderingContext.xScale.invert(targetWidth));
      }
    },
    _moveContext: {
      value: function _moveContext(dx) {
        var contextAttributes = this._contextAttributes;
        var renderingContext = this._renderingContext;
        // edit `context.start`
        var x = renderingContext.xScale(contextAttributes.start);
        var targetX = Math.max(x + dx, 0);

        this.setContextAttribute("start", renderingContext.xScale.invert(targetX));
      }
    },
    stretchContext: {
      value: function stretchContext(dx, dy, target) {}
    },
    _getItemFromDOMElement: {

      // --------------------------------------
      // Helpers
      // --------------------------------------

      /**
       *  @NOTE is only used on `hasItem` => no need to separate this method
       *  @return {DOMElement} the closest parent `item` group for a given DOM element
       */

      value: function _getItemFromDOMElement(el) {
        do {
          if (el.nodeName === "g" && el.classList.contains("item")) {
            return el;
          }

          el = el.parentNode;
        } while (el != undefined);
      }
    },
    _toFront: {

      /**
       *  moves an `item`'s group to the end of the layer (svg z-index...)
       *  @param `item` {DOMElement} the item to be moved
       */

      value: function _toFront(item) {
        this.group.appendChild(item);
      }
    },
    hasItem: {

      /**
       *  Define if an given DOM element belongs to one of the `items`
       *  @param `el` {DOMElement} the element to be tested
       *  @return {mixed}
       *    {DOMElement} item group containing the `el` if belongs to this layer
       *    null otherwise
       */

      value: function hasItem(el) {
        var item = this._getItemFromDOMElement(el);
        return this.items.nodes().indexOf(item) !== -1 ? item : null;
      }
    },
    hasElement: {

      /**
       *  Define if a given element belongs to the layer
       *  is more general than `hasItem`, can be used to check interaction elements too
       */

      value: function hasElement(el) {
        do {
          if (el === this.container) {
            return true;
          }

          el = el.parentNode;
        } while (el != undefined);

        return false;
      }
    },
    getItemsInArea: {

      /**
       *  @param area {Object} area in which to find the elements
       *  @return {Array} list of the DOM elements in the given area
       */

      value: function getItemsInArea(area) {
        // work in pixel domain
        var start = this._context.xScale(this._context.start);
        var duration = this._context.xScale(this._context.duration);
        var offset = this._context.xScale(this._context.offset);
        var top = this.params.top;
        // must be aware of the layer's context modifications
        // constrain in working view
        var x1 = Math.max(area.left, start);
        var x2 = Math.min(area.left + area.width, start + duration);
        // apply start and offset
        x1 -= start + offset;
        x2 -= start + offset;
        // be consistent with context y coordinates system
        var y1 = this.params.height - (area.top + area.height);
        var y2 = this.params.height - area.top;

        y1 += this.params.top;
        y2 += this.params.top;

        var itemShapeMap = this._itemShapeMap;
        var renderingContext = this._renderingContext;

        var items = this.items.filter(function (datum, index) {
          var group = this;
          var shape = itemShapeMap.get(group);
          return shape.inArea(renderingContext, datum, x1, y1, x2, y2);
        });

        return items[0].slice(0);
      }
    },
    _render: {

      // helper to add some class or stuff on items
      // each(callback) { this._each = callback }

      /**
       *  render the DOM in memory on layer creation to be able to use it before
       *  the layer is actually inserted in the DOM
       */

      value: function _render() {
        var _this = this;

        // wrapper group for `start, top and context flip matrix
        this.container = document.createElementNS(ns, "g");
        this.container.classList.add("layer");
        // append a svg to clip the context
        // @NOTE: could use a group with a `clipPath` property
        this.boundingBox = document.createElementNS(ns, "svg");
        this.boundingBox.classList.add("bounding-box");
        // this.boundingBox.setAttributeNS(null, 'id', this.params.id);
        // group to apply offset
        this.group = document.createElementNS(ns, "g");
        this.group.classList.add("offset", "items");

        // context interactions
        this.interactionsGroup = document.createElementNS(ns, "g");
        this.interactionsGroup.classList.add("layer-interactions");
        this.interactionsGroup.style.display = "none";
        // @NOTE: works but king of ugly... must be cleaned
        this.contextShape = new Rect();
        this.contextShape.install({
          opacity: function () {
            return 0.1;
          },
          color: function () {
            return "#787878";
          },
          width: function () {
            return _this._contextAttributes.duration;
          },
          height: function () {
            return _this._renderingContext.yScale.domain()[1];
          },
          y: function () {
            return _this._renderingContext.yScale.domain()[0];
          }
        });

        this.interactionsGroup.appendChild(this.contextShape.render());

        // create the DOM tree
        this.container.appendChild(this.boundingBox);
        this.boundingBox.appendChild(this.interactionsGroup);
        this.boundingBox.appendChild(this.group);

        // draw a rect in context background to debug it's size
        if (this.params.debug) {
          this.debugRect = document.createElementNS(ns, "rect");
          this.boundingBox.appendChild(this.debugRect);
          this.debugRect.style.fill = "#ababab";
          this.debugRect.style.fillOpacity = 0.1;
        }
      }
    },
    render: {

      /**
       *  creates the layer group with a transformation matrix to flip the coordinate system.
       *  @return {DOMElement}
       */

      value: function render() {
        return this.container;
      }
    },
    draw: {

      /**
       * create the DOM according to given data and shapes
       */

      value: function draw() {
        var _this = this;

        // @NOTE: create a unique id to force d3 to keep data in sync with the DOM
        // @TODO: read again http://bost.ocks.org/mike/selection/
        this.data.forEach(function (datum) {
          if (_datumIdMap.has(datum)) {
            return;
          }
          _datumIdMap.set(datum, _counter++);
        });

        // select items
        this.items = d3Selection.select(this.group).selectAll(".item").filter(function () {
          return !this.classList.contains("common");
        }).data(this.data, function (datum) {
          return _datumIdMap.get(datum);
        });

        // handle commonShapes -> render only once
        if (this._commonShapeConfiguration !== null && this._itemCommonShapeMap.size === 0) {
          var _commonShapeConfiguration = this._commonShapeConfiguration;
          var ctor = _commonShapeConfiguration.ctor;
          var accessors = _commonShapeConfiguration.accessors;
          var options = _commonShapeConfiguration.options;

          var group = document.createElementNS(ns, "g");
          var shape = new ctor(options);

          shape.install(accessors);
          group.appendChild(shape.render());
          group.classList.add("item", "common", shape.getClassName());

          this._itemCommonShapeMap.set(group, shape);
          this.group.appendChild(group);
        }

        // enter
        this.items.enter().append(function (datum, index) {
          // @NOTE: d3 binds `this` to the container group
          // create a group for the item
          var group = document.createElementNS(ns, "g");
          var _shapeConfiguration = _this._shapeConfiguration;
          var ctor = _shapeConfiguration.ctor;
          var accessors = _shapeConfiguration.accessors;
          var options = _shapeConfiguration.options;

          var shape = new ctor(options);
          // install accessors on the newly created shape
          shape.install(accessors);

          group.appendChild(shape.render(_this._renderingContext));
          group.classList.add("item", shape.getClassName());

          _this._itemShapeMap.set(group, shape);

          return group;
        });

        // exit
        var that = this;

        this.items.exit().each(function (datum, index) {
          var group = this;
          var shape = that._itemShapeMap.get(group);

          shape.destroy(); // clean shape
          _datumIdMap["delete"](datum); // clean reference in `id` map
          that._itemShapeMap["delete"](group); // destroy reference in item shape map
        }).remove();
      }
    },
    update: {

      /**
       *  updates Context and Shapes
       */

      value: function update() {
        this._updateRenderingContext();

        this.updateContext();
        this.updateShapes();
      }
    },
    updateContext: {

      /**
       *  updates the context of the layer
       */

      value: function updateContext() {
        // @NOTE: replaced `context.originalXScale` with `context.xScale`
        // => the behavior is not proper when the layer is stretched
        // const x      = this._context._parent.xScale(this._context.start);
        var x = this._context.xScale(this._context.start);
        var width = this._context.xScale(this._context.duration);
        var offset = this._context.xScale(this._context.offset);
        var top = this.params.top;
        var height = this.params.height;
        // matrix to invert the coordinate system
        var translateMatrix = "matrix(1, 0, 0, -1, " + x + ", " + (top + height) + ")";

        this.container.setAttributeNS(null, "transform", translateMatrix);

        // const clipPath = `polygon(0 0, ${width}px 0, ${width}px ${height}px, 0 ${height}px)`;
        // -webkit-clip-path: polygon(0 0, 740px 0, 740px 160px, 0 160px);
        // this.boundingBox.style.webkitClipPath = clipPath;

        this.boundingBox.setAttributeNS(null, "width", width);
        this.boundingBox.setAttributeNS(null, "height", height);
        this.boundingBox.style.opacity = this.params.opacity;

        this.group.setAttributeNS(null, "transform", "translate(" + offset + ", 0)");

        // maintain context shape
        this.contextShape.update(this._renderingContext, this.interactionsGroup, this._contextAttributes, 0);

        // debug context
        if (this.params.debug) {
          this.debugRect.setAttributeNS(null, "width", width);
          this.debugRect.setAttributeNS(null, "height", height);
        }
      }
    },
    updateShapes: {

      /**
       *  updates the Shapes which belongs to the layer
       *  @param item {DOMElement}
       */

      value: function updateShapes() {
        var _this = this;

        var item = arguments[0] === undefined ? null : arguments[0];

        var that = this;
        var renderingContext = this._renderingContext;
        var items = item !== null ? d3Selection.selectAll(item) : this.items;

        // update common shapes
        this._itemCommonShapeMap.forEach(function (shape, item) {
          shape.update(renderingContext, item, _this.data);
        });

        // update entity or collection shapes
        if (!items) {
          return;
        } // if no shape in the layer...
        items.each(function (datum, index) {
          // update all shapes related to the current item
          var group = this; // current `g.item`
          var shape = that._itemShapeMap.get(group);
          shape.update(renderingContext, group, datum, index);
        });
      }
    }
  });

  return Layer;
})(events.EventEmitter);

module.exports = Layer;
//# sourceMappingURL=data:application/json;base64,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QUFLLElBQUksR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7OztBQUd2RSxZQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFFLElBQUksRUFBSztBQUNoRCxlQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRSxNQUFLLElBQUksQ0FBQyxDQUFDO1NBQ2pELENBQUMsQ0FBQzs7O0FBR0gsWUFBSSxDQUFDLEtBQUssRUFBRTtBQUFFLGlCQUFPO1NBQUU7QUFDdkIsYUFBSyxDQUFDLElBQUksQ0FBQyxVQUFTLEtBQUssRUFBRSxLQUFLLEVBQUU7O0FBRWhDLGNBQU0sS0FBSyxHQUFHLElBQUksQ0FBQztBQUNuQixjQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QyxlQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDckQsQ0FBQyxDQUFDO09BQ0o7Ozs7U0F2bEJHLEtBQUs7R0FBUyxNQUFNLENBQUMsWUFBWTs7QUEwbEJ2QyxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyIsImZpbGUiOiJlczYvY29yZS9sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG5zID0gcmVxdWlyZSgnLi9uYW1lc3BhY2UnKTtcbmNvbnN0IGQzU2NhbGUgPSByZXF1aXJlKCdkMy1zY2FsZScpO1xuY29uc3QgZDNTZWxlY3Rpb24gPSByZXF1aXJlKCdkMy1zZWxlY3Rpb24nKTtcbmNvbnN0IFJlY3QgPSByZXF1aXJlKCcuLi9zaGFwZXMvcmVjdCcpO1xuY29uc3QgU2VnbWVudEJlaGF2aW9yID0gcmVxdWlyZSgnLi4vYmVoYXZpb3JzL3NlZ21lbnQtYmVoYXZpb3InKTtcbmNvbnN0IGV2ZW50cyA9IHJlcXVpcmUoJ2V2ZW50cycpO1xuXG4vLyBjcmVhdGUgYSBwcml2YXRlIGl0ZW0gLT4gaWQgbWFwIHRvIGZvcmNlIGQzIGJlaW5nIGluIHN5bmMgd2l0aCB0aGUgRE9NXG5sZXQgX2NvdW50ZXIgPSAwO1xuY29uc3QgX2RhdHVtSWRNYXAgPSBuZXcgTWFwKCk7XG5cbmNsYXNzIExheWVyIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKGRhdGFUeXBlID0gJ2NvbGxlY3Rpb24nLCBkYXRhID0gW10sIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5kYXRhVHlwZSA9IGRhdGFUeXBlOyAvLyAnZW50aXR5JyB8fCAnY29sbGVjdGlvbic7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgaGVpZ2h0OiAxMDAsIC8vIHNob3VsZCBpbmhlcml0IGZyb20gcGFyZW50XG4gICAgICB0b3A6IDAsXG4gICAgICBpZDogJycsXG4gICAgICB5RG9tYWluOiBbMCwgMV0sXG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgZGVidWdDb250ZXh0OiBmYWxzZSwgLy8gcGFzcyB0aGUgY29udGV4dCBpbiBkZWJ1ZyBtb2RlXG4gICAgICBjb250ZXh0SGFuZGxlcldpZHRoOiAyXG4gICAgfTtcblxuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb250YWluZXIgPSBudWxsOyAvLyBvZmZzZXQgZ3JvdXAgb2YgdGhlIHBhcmVudCBjb250ZXh0XG4gICAgdGhpcy5ncm91cCA9IG51bGw7IC8vIGdyb3VwIGNyZWF0ZWQgYnkgdGhlIGxheWVyIGluc2lkZSB0aGUgY29udGV4dFxuICAgIHRoaXMuaXRlbXMgPSBudWxsOyAvLyBkMyBjb2xsZWN0aW9uIG9mIHRoZSBsYXllciBpdGVtc1xuXG4gICAgdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uID0gbnVsbDsgLy8geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfVxuICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiA9IG51bGw7IC8vIHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH1cblxuICAgIHRoaXMuX2l0ZW1TaGFwZU1hcCA9IG5ldyBNYXAoKTsgLy8gaXRlbSBncm91cCA8RE9NRWxlbWVudD4gPT4gc2hhcGVcbiAgICB0aGlzLl9pdGVtQ29tbW9uU2hhcGVNYXAgPSBuZXcgTWFwKCk7IC8vIG9uZSBlbnRyeSBtYXggaW4gdGhpcyBtYXBcblxuICAgIHRoaXMuX2lzQ29udGV4dEVkaXRhYmxlID0gZmFsc2U7XG5cbiAgICAvLyBjb21wb25lbnQgY29uZmlndXJhdGlvblxuICAgIHRoaXMuX2JlaGF2aW9yID0gbnVsbDtcbiAgICB0aGlzLl9jb250ZXh0ID0gbnVsbDtcbiAgICB0aGlzLl9jb250ZXh0QXR0cmlidXRlcyA9IG51bGw7XG5cbiAgICB0aGlzLl95U2NhbGUgPSBkM1NjYWxlLmxpbmVhcigpXG4gICAgICAuZG9tYWluKHRoaXMucGFyYW1zLnlEb21haW4pXG4gICAgICAucmFuZ2UoWzAsIHRoaXMucGFyYW1zLmhlaWdodF0pO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSBjb250ZXh0XG4gICAgdGhpcy5fcmVuZGVyKCk7XG4gIH1cblxuICBzZXQgeURvbWFpbihkb21haW4pIHtcbiAgICB0aGlzLnBhcmFtcy55RG9tYWluID0gZG9tYWluO1xuICAgIHRoaXMuX3lTY2FsZS5kb21haW4oZG9tYWluKTtcbiAgfVxuXG4gIGdldCB5RG9tYWluKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy55RG9tYWluO1xuICB9XG5cbiAgc2V0IG9wYWNpdHkodmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcy5vcGFjaXR5ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgb3BhY2l0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMub3BhY2l0eTtcbiAgfVxuXG4gIHBhcmFtKG5hbWUsIHZhbHVlKSB7XG4gICAgdGhpcy5wYXJhbXNbbmFtZV0gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgQG1hbmRhdG9yeSBkZWZpbmUgdGhlIGNvbnRleHQgaW4gd2hpY2ggdGhlIGxheWVyIGlzIGRyYXduXG4gICAqICBAcGFyYW0gY29udGV4dCB7VGltZUNvbnRleHR9IHRoZSB0aW1lQ29udGV4dCBpbiB3aGljaCB0aGUgbGF5ZXIgaXMgZGlzcGxheWVkXG4gICAqL1xuICBzZXRDb250ZXh0KGNvbnRleHQpIHtcbiAgICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcblxuICAgIC8vIG1haW50YWluIGEgcmVmZXJlbmNlIG9mIHRoZSBjb250ZXh0IHN0YXRlIHRvIGJlIHVzZWQgaW4gYXBwbGljYXRpb25cbiAgICB0aGlzLl9jb250ZXh0QXR0cmlidXRlcyA9IHtcbiAgICAgIHN0YXJ0OiB0aGlzLl9jb250ZXh0LnN0YXJ0LFxuICAgICAgZHVyYXRpb246IHRoaXMuX2NvbnRleHQuZHVyYXRpb24sXG4gICAgICBvZmZzZXQ6IHRoaXMuX2NvbnRleHQub2Zmc2V0LFxuICAgICAgc3RyZXRjaFJhdGlvOiB0aGlzLl9jb250ZXh0LnN0cmV0Y2hSYXRpb1xuICAgIH07XG5cbiAgICAvLyBjcmVhdGUgYSBtaXhpbiB0byBwYXNzIHRvIHNoYXBlc1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQgPSB7fTtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBEYXRhXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgZ2V0IGRhdGEoKSB7IHJldHVybiB0aGlzLl9kYXRhOyB9XG5cbiAgc2V0IGRhdGEoZGF0YSkge1xuICAgIHN3aXRjaCAodGhpcy5kYXRhVHlwZSkge1xuICAgICAgY2FzZSAnZW50aXR5JzpcbiAgICAgICAgaWYgKHRoaXMuX2RhdGEpIHsgLy8gaWYgZGF0YSBhbHJlYWR5IGV4aXN0cywgcmV1c2UgdGhlIHJlZmVyZW5jZVxuICAgICAgICAgIHRoaXMuX2RhdGFbMF0gPSBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2RhdGEgPSBbZGF0YV07XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2xsZWN0aW9uJzpcbiAgICAgICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbXBvbmVudCBDb25maWd1cmF0aW9uXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqICBSZWdpc3RlciB0aGUgc2hhcGUgYW5kIGl0cyBhY2Nlc3NvcnMgdG8gdXNlIGluIG9yZGVyIHRvIHJlbmRlclxuICAgKiAgdGhlIGVudGl0eSBvciBjb2xsZWN0aW9uXG4gICAqICBAcGFyYW0gY3RvciA8RnVuY3Rpb246QmFzZVNoYXBlPiB0aGUgY29uc3RydWN0b3Igb2YgdGhlIHNoYXBlIHRvIGJlIHVzZWRcbiAgICogIEBwYXJhbSBhY2Nlc3NvcnMgPE9iamVjdD4gYWNjZXNzb3JzIHRvIHVzZSBpbiBvcmRlciB0byBtYXAgdGhlIGRhdGEgc3RydWN0dXJlXG4gICAqL1xuICBjb25maWd1cmVTaGFwZShjdG9yLCBhY2Nlc3NvcnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uID0geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqICBSZWdpc3RlciB0aGUgc2hhcGUgdG8gdXNlIHdpdGggdGhlIGVudGlyZSBjb2xsZWN0aW9uXG4gICAqICBleGFtcGxlOiB0aGUgbGluZSBpbiBhIGJlYWtwb2ludCBmdW5jdGlvblxuICAgKiAgQHBhcmFtIGN0b3Ige0Jhc2VTaGFwZX0gdGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBzaGFwZSB0byB1c2UgdG8gcmVuZGVyIGRhdGFcbiAgICogIEBwYXJhbSBhY2Nlc3NvcnMge09iamVjdH0gYWNjZXNzb3JzIHRvIHVzZSBpbiBvcmRlciB0byBtYXAgdGhlIGRhdGEgc3RydWN0dXJlXG4gICAqL1xuICBjb25maWd1cmVDb21tb25TaGFwZShjdG9yLCBhY2Nlc3NvcnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uID0geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgQE5PVEUgc2hvdWxkIGJlIG1lcmdlIGluIHNldFNoYXBlIGZvciBjb25zaXN0ZW5jeSBidXQgcHJvYmxlbSB0byBkZWZpbmUgdGhlIG1ldGhvZCBzaWduYXR1cmVcbiAgICogIFJlZ2lzdGVyIHRoZSBiZWhhdmlvciB0byB1c2Ugd2hlbiBpbnRlcmFjdGluZyB3aXRoIHRoZSBzaGFwZVxuICAgKiAgQHBhcmFtIGJlaGF2aW9yIHtCYXNlQmVoYXZpb3J9XG4gICAqL1xuICBzZXRCZWhhdmlvcihiZWhhdmlvcikge1xuICAgIGJlaGF2aW9yLmluaXRpYWxpemUodGhpcyk7XG4gICAgdGhpcy5fYmVoYXZpb3IgPSBiZWhhdmlvcjtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbnRleHQgQXR0cmlidXRlcyBBY2Nlc3NvcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIFVzZSBhbiBleHRlcm5hbCBvYmogdG8gdXNlIGFzIHRoZSBgY29udGV4dEF0dHJpYnV0ZWAgd3JhcHBlclxuICAgKiAgQHBhcmFtIG9iaiB7T2JqZWN0fVxuICAgKi9cbiAgc2V0IGNvbnRleHRBdHRyaWJ1dGVzKG9iaikgeyB0aGlzLl9jb250ZXh0QXR0cmlidXRlcyA9IG9iajsgfVxuICBnZXQgY29udGV4dEF0dHJpYnV0ZXMoKSB7IHJldHVybiB0aGlzLl9jb250ZXh0QXR0cmlidXRlczsgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlIGEgZ2l2ZW4gYXR0cmlidXRlIG9mIHRoZSBjb250ZXh0XG4gICAqICBAcGFyYW0gbmFtZSB7U3RyaW5nfSB0aGUga2V5IG9mIHRoZSBhdHRyaWJ1dGUgdG8gdXBkYXRlXG4gICAqICBAcGFyYW0gdmFsdWUge21peGVkfVxuICAgKi9cbiAgc2V0Q29udGV4dEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSkge1xuICAgIHRoaXMuX2NvbnRleHRBdHRyaWJ1dGVzW25hbWVdID0gdmFsdWU7XG4gICAgdGhpcy5fY29udGV4dFtuYW1lXSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqICB1cGRhdGUgdGhlIHZhbHVlcyBpbiBgX3JlbmRlcmluZ0NvbnRleHRgXG4gICAqICBpcyBwYXJ0aWN1bGFyeSBuZWVkZWQgd2hlbiB1cGRhdGluZyBgc3RyZXRjaFJhdGlvYCBhcyB0aGUgcG9pbnRlclxuICAgKiAgdG8gdGhlIGB4U2NhbGVgIG1heSBjaGFuZ2VcbiAgICovXG4gIF91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCkge1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQueFNjYWxlID0gdGhpcy5fY29udGV4dC54U2NhbGU7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC55U2NhbGUgPSB0aGlzLl95U2NhbGU7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC53aWR0aCAgPSB0aGlzLl9jb250ZXh0LnhTY2FsZSh0aGlzLl9jb250ZXh0LmR1cmF0aW9uKTtcbiAgICAvLyBmb3IgZm9yZWlnbiBvamVjdCBpc3N1ZSBpbiBjaHJvbWVcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0Lm9mZnNldFggPSB0aGlzLl9jb250ZXh0LnhTY2FsZSh0aGlzLl9jb250ZXh0Lm9mZnNldCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBCZWhhdmlvciBBY2Nlc3NvcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIEJlaGF2aW9yIGVudHJ5IHBvaW50c1xuICAgKiAgQE5PVEUgQVBJIC0+IGNoYW5nZSBmb3IgYW4gQXJyYXkgYXMgZmlyc3QgYXJndW1lbnRcbiAgICogIEBUT0RPICAgICAtPiBoYW5kbGUgaWYgbm8gYmVoYXZpb3IgaXMgcmVnaXN0ZXJlZFxuICAgKi9cbiAgZ2V0IHNlbGVjdGVkSXRlbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2JlaGF2aW9yID8gdGhpcy5fYmVoYXZpb3Iuc2VsZWN0ZWRJdGVtcyA6IFtdO1xuICB9XG5cbiAgc2VsZWN0KGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcsKgfHzCoCFpdGVtcykgeyByZXR1cm47IH1cbiAgICBpdGVtcyA9IEFycmF5LmlzQXJyYXkoaXRlbXMpID8gaXRlbXMgOiBbaXRlbXNdO1xuXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaXRlbSA9IHRoaXMuX2dldEl0ZW1Gcm9tRE9NRWxlbWVudChpdGVtKTtcbiAgICAgIGNvbnN0IGRhdHVtID0gZDNTZWxlY3Rpb24uc2VsZWN0KGl0ZW0pLmRhdHVtKCk7XG4gICAgICB0aGlzLl9iZWhhdmlvci5zZWxlY3QoaXRlbSwgZGF0dW0pO1xuICAgICAgdGhpcy5fdG9Gcm9udChpdGVtKTtcbiAgICB9KTtcbiAgfVxuXG4gIHVuc2VsZWN0KGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcsKgfHzCoCFpdGVtcykgeyByZXR1cm47IH1cbiAgICBpdGVtcyA9IEFycmF5LmlzQXJyYXkoaXRlbXMpID8gaXRlbXMgOiBbaXRlbXNdO1xuXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgZGF0dW0gPSBkM1NlbGVjdGlvbi5zZWxlY3QoaXRlbSkuZGF0dW0oKTtcbiAgICAgIHRoaXMuX2JlaGF2aW9yLnVuc2VsZWN0KGl0ZW0sIGRhdHVtKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbGVjdEFsbCgpIHtcbiAgICB0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHRoaXMuc2VsZWN0KGl0ZW0pKTtcbiAgfVxuXG4gIHVuc2VsZWN0QWxsKCkge1xuICAgIHRoaXMuc2VsZWN0ZWRJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB0aGlzLnVuc2VsZWN0KGl0ZW0pKTtcbiAgfVxuXG4gIHRvZ2dsZVNlbGVjdGlvbihpdGVtcykge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3LCoHx8wqAhaXRlbXMpIHsgcmV0dXJuOyB9XG4gICAgaXRlbXMgPSBBcnJheS5pc0FycmF5KGl0ZW1zKSA/IGl0ZW1zIDogW2l0ZW1zXTtcblxuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IGRhdHVtID0gZDNTZWxlY3Rpb24uc2VsZWN0KGl0ZW0pLmRhdHVtKCk7XG4gICAgICB0aGlzLl9iZWhhdmlvci50b2dnbGVTZWxlY3Rpb24oaXRlbSwgZGF0dW0pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gQFRPRE8gY2hhbmdlIHNpZ25hdHVyZSBlZGl0KGl0ZW1zID0gWy4uLl0sIGR4LCBkeSwgdGFyZ2V0KTtcbiAgLy8gLT4gYmUgY29uc2lzdGVudCBmb3IgYWxsIGJlaGF2aW9ycyBBUElcbiAgZWRpdChpdGVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IGRhdHVtID0gZDNTZWxlY3Rpb24uc2VsZWN0KGl0ZW0pLmRhdHVtKCk7XG4gICAgY29uc3Qgc2hhcGUgPSB0aGlzLl9pdGVtU2hhcGVNYXAuZ2V0KGl0ZW0pO1xuICAgIHRoaXMuX2JlaGF2aW9yLmVkaXQodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCk7XG4gICAgdGhpcy5lbWl0KCdlZGl0Jywgc2hhcGUsIGRhdHVtKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbnRleHQgQmVoYXZpb3JcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIGRyYXcgdGhlIHNoYXBlIHRvIGludGVyYWN0IHdpdGggdGhlIGNvbnRleHRcbiAgICogIEBwYXJhbXMgYm9vbCB7Qm9vbGVhbn0gZGVmaW5lIGlmIHRoZSBsYXllcidzIGNvbnRleHQgaXMgZWRpdGFibGUgb3Igbm90XG4gICAqL1xuICBzZXQgZWRpdGFibGUoYm9vbCkge1xuICAgIGNvbnN0IGRpc3BsYXkgPSBib29sID8gJ2Jsb2NrJyA6ICdub25lJztcbiAgICB0aGlzLmludGVyYWN0aW9uc0dyb3VwLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xuICAgIHRoaXMuX2lzQ29udGV4dEVkaXRhYmxlID0gYm9vbDtcbiAgfVxuXG4gIGdldCBlZGl0YWJsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5faXNDb250ZXh0RWRpdGFibGU7XG4gIH1cblxuICAvLyBATk9URSBjcmVhdGUgYSBwcm9wZXIgYENvbnRleHRCZWhhdmlvcmAgP1xuICBlZGl0Q29udGV4dChkeCwgZHksIHRhcmdldCkge1xuICAgIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoYW5kbGVyJykgJiYgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbGVmdCcpKSB7XG4gICAgICB0aGlzLl9lZGl0Q29udGV4dExlZnQoZHgpO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnaGFuZGxlcicpICYmIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3JpZ2h0JykpIHtcbiAgICAgIHRoaXMuX2VkaXRDb250ZXh0UmlnaHQoZHgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9tb3ZlQ29udGV4dChkeCk7XG4gICAgfVxuICB9XG5cbiAgX2VkaXRDb250ZXh0TGVmdChkeCkge1xuICAgIGNvbnN0IGNvbnRleHRBdHRyaWJ1dGVzID0gdGhpcy5fY29udGV4dEF0dHJpYnV0ZXM7XG4gICAgY29uc3QgcmVuZGVyaW5nQ29udGV4dCAgPSB0aGlzLl9yZW5kZXJpbmdDb250ZXh0O1xuICAgIC8vIGVkaXQgYGNvbnRleHQuc3RhcnRgLCBgY29udGV4dC5vZmZzZXRgIGFuZCBgY29udGV4dC5kdXJhdGlvbmBcbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC54U2NhbGUoY29udGV4dEF0dHJpYnV0ZXMuc3RhcnQpO1xuICAgIGNvbnN0IG9mZnNldCA9IHJlbmRlcmluZ0NvbnRleHQueFNjYWxlKGNvbnRleHRBdHRyaWJ1dGVzLm9mZnNldCk7XG4gICAgY29uc3Qgd2lkdGggPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZShjb250ZXh0QXR0cmlidXRlcy5kdXJhdGlvbik7XG5cbiAgICBsZXQgdGFyZ2V0WCA9IHggKyBkeDtcbiAgICBsZXQgdGFyZ2V0T2Zmc2V0ID0gb2Zmc2V0IC0gZHg7XG4gICAgbGV0IHRhcmdldFdpZHRoID0gTWF0aC5tYXgod2lkdGggLSBkeCwgMCk7XG5cbiAgICB0aGlzLnNldENvbnRleHRBdHRyaWJ1dGUoJ3N0YXJ0JywgcmVuZGVyaW5nQ29udGV4dC54U2NhbGUuaW52ZXJ0KHRhcmdldFgpKTtcbiAgICB0aGlzLnNldENvbnRleHRBdHRyaWJ1dGUoJ29mZnNldCcsIHJlbmRlcmluZ0NvbnRleHQueFNjYWxlLmludmVydCh0YXJnZXRPZmZzZXQpKTtcbiAgICB0aGlzLnNldENvbnRleHRBdHRyaWJ1dGUoJ2R1cmF0aW9uJywgcmVuZGVyaW5nQ29udGV4dC54U2NhbGUuaW52ZXJ0KHRhcmdldFdpZHRoKSk7XG4gIH1cblxuICBfZWRpdENvbnRleHRSaWdodChkeCkge1xuICAgIGNvbnN0IGNvbnRleHRBdHRyaWJ1dGVzID0gdGhpcy5fY29udGV4dEF0dHJpYnV0ZXM7XG4gICAgY29uc3QgcmVuZGVyaW5nQ29udGV4dCAgPSB0aGlzLl9yZW5kZXJpbmdDb250ZXh0O1xuICAgIC8vIGVkaXQgYGNvbnRleHQuZHVyYXRpb25gXG4gICAgY29uc3Qgd2lkdGggPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZShjb250ZXh0QXR0cmlidXRlcy5kdXJhdGlvbik7XG4gICAgbGV0IHRhcmdldFdpZHRoID0gTWF0aC5tYXgod2lkdGggKyBkeCwgMCk7XG5cbiAgICB0aGlzLnNldENvbnRleHRBdHRyaWJ1dGUoJ2R1cmF0aW9uJywgcmVuZGVyaW5nQ29udGV4dC54U2NhbGUuaW52ZXJ0KHRhcmdldFdpZHRoKSk7XG4gIH1cblxuICBfbW92ZUNvbnRleHQoZHgpIHtcbiAgICBjb25zdCBjb250ZXh0QXR0cmlidXRlcyA9IHRoaXMuX2NvbnRleHRBdHRyaWJ1dGVzO1xuICAgIGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgID0gdGhpcy5fcmVuZGVyaW5nQ29udGV4dDtcbiAgICAvLyBlZGl0IGBjb250ZXh0LnN0YXJ0YFxuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZShjb250ZXh0QXR0cmlidXRlcy5zdGFydCk7XG4gICAgbGV0IHRhcmdldFggPSBNYXRoLm1heCh4ICsgZHgsIDApO1xuXG4gICAgdGhpcy5zZXRDb250ZXh0QXR0cmlidXRlKCdzdGFydCcsIHJlbmRlcmluZ0NvbnRleHQueFNjYWxlLmludmVydCh0YXJnZXRYKSk7XG4gIH1cblxuICBzdHJldGNoQ29udGV4dChkeCwgZHksIHRhcmdldCkge31cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBIZWxwZXJzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqICBATk9URSBpcyBvbmx5IHVzZWQgb24gYGhhc0l0ZW1gID0+IG5vIG5lZWQgdG8gc2VwYXJhdGUgdGhpcyBtZXRob2RcbiAgICogIEByZXR1cm4ge0RPTUVsZW1lbnR9IHRoZSBjbG9zZXN0IHBhcmVudCBgaXRlbWAgZ3JvdXAgZm9yIGEgZ2l2ZW4gRE9NIGVsZW1lbnRcbiAgICovXG4gIF9nZXRJdGVtRnJvbURPTUVsZW1lbnQoZWwpIHtcbiAgICBkbyB7XG4gICAgICBpZiAoZWwubm9kZU5hbWUgPT09ICdnJyAmJiBlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2l0ZW0nKSkge1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9XG5cbiAgICAgIGVsID0gZWwucGFyZW50Tm9kZTtcbiAgICB9IHdoaWxlIChlbCAhPSB1bmRlZmluZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqICBtb3ZlcyBhbiBgaXRlbWAncyBncm91cCB0byB0aGUgZW5kIG9mIHRoZSBsYXllciAoc3ZnIHotaW5kZXguLi4pXG4gICAqICBAcGFyYW0gYGl0ZW1gIHtET01FbGVtZW50fSB0aGUgaXRlbSB0byBiZSBtb3ZlZFxuICAgKi9cbiAgX3RvRnJvbnQoaXRlbSkge1xuICAgIHRoaXMuZ3JvdXAuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogIERlZmluZSBpZiBhbiBnaXZlbiBET00gZWxlbWVudCBiZWxvbmdzIHRvIG9uZSBvZiB0aGUgYGl0ZW1zYFxuICAgKiAgQHBhcmFtIGBlbGAge0RPTUVsZW1lbnR9IHRoZSBlbGVtZW50IHRvIGJlIHRlc3RlZFxuICAgKiAgQHJldHVybiB7bWl4ZWR9XG4gICAqICAgIHtET01FbGVtZW50fSBpdGVtIGdyb3VwIGNvbnRhaW5pbmcgdGhlIGBlbGAgaWYgYmVsb25ncyB0byB0aGlzIGxheWVyXG4gICAqICAgIG51bGwgb3RoZXJ3aXNlXG4gICAqL1xuICBoYXNJdGVtKGVsKSB7XG4gICAgY29uc3QgaXRlbSA9IHRoaXMuX2dldEl0ZW1Gcm9tRE9NRWxlbWVudChlbCk7XG4gICAgcmV0dXJuICh0aGlzLml0ZW1zLm5vZGVzKCkuaW5kZXhPZihpdGVtKSAhPT0gLTEpID8gaXRlbSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogIERlZmluZSBpZiBhIGdpdmVuIGVsZW1lbnQgYmVsb25ncyB0byB0aGUgbGF5ZXJcbiAgICogIGlzIG1vcmUgZ2VuZXJhbCB0aGFuIGBoYXNJdGVtYCwgY2FuIGJlIHVzZWQgdG8gY2hlY2sgaW50ZXJhY3Rpb24gZWxlbWVudHMgdG9vXG4gICAqL1xuICBoYXNFbGVtZW50KGVsKSB7XG4gICAgZG8ge1xuICAgICAgaWYgKGVsID09PSB0aGlzLmNvbnRhaW5lcikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgZWwgPSBlbC5wYXJlbnROb2RlO1xuICAgIH0gd2hpbGUgKGVsICE9IHVuZGVmaW5lZCk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogIEBwYXJhbSBhcmVhIHtPYmplY3R9IGFyZWEgaW4gd2hpY2ggdG8gZmluZCB0aGUgZWxlbWVudHNcbiAgICogIEByZXR1cm4ge0FycmF5fSBsaXN0IG9mIHRoZSBET00gZWxlbWVudHMgaW4gdGhlIGdpdmVuIGFyZWFcbiAgICovXG4gIGdldEl0ZW1zSW5BcmVhKGFyZWEpIHtcbiAgICAvLyB3b3JrIGluIHBpeGVsIGRvbWFpblxuICAgIGNvbnN0IHN0YXJ0ICAgID0gdGhpcy5fY29udGV4dC54U2NhbGUodGhpcy5fY29udGV4dC5zdGFydCk7XG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLl9jb250ZXh0LnhTY2FsZSh0aGlzLl9jb250ZXh0LmR1cmF0aW9uKTtcbiAgICBjb25zdCBvZmZzZXQgICA9IHRoaXMuX2NvbnRleHQueFNjYWxlKHRoaXMuX2NvbnRleHQub2Zmc2V0KTtcbiAgICBjb25zdCB0b3AgICAgICA9IHRoaXMucGFyYW1zLnRvcDtcbiAgICAvLyBtdXN0IGJlIGF3YXJlIG9mIHRoZSBsYXllcidzIGNvbnRleHQgbW9kaWZpY2F0aW9uc1xuICAgIC8vIGNvbnN0cmFpbiBpbiB3b3JraW5nIHZpZXdcbiAgICBsZXQgeDEgPSBNYXRoLm1heChhcmVhLmxlZnQsIHN0YXJ0KTtcbiAgICBsZXQgeDIgPSBNYXRoLm1pbihhcmVhLmxlZnQgKyBhcmVhLndpZHRoLCBzdGFydCArIGR1cmF0aW9uKTtcbiAgICAvLyBhcHBseSBzdGFydCBhbmQgb2Zmc2V0XG4gICAgeDEgLT0gKHN0YXJ0ICsgb2Zmc2V0KTtcbiAgICB4MiAtPSAoc3RhcnQgKyBvZmZzZXQpO1xuICAgIC8vIGJlIGNvbnNpc3RlbnQgd2l0aCBjb250ZXh0IHkgY29vcmRpbmF0ZXMgc3lzdGVtXG4gICAgbGV0IHkxID0gdGhpcy5wYXJhbXMuaGVpZ2h0IC0gKGFyZWEudG9wICsgYXJlYS5oZWlnaHQpO1xuICAgIGxldCB5MiA9IHRoaXMucGFyYW1zLmhlaWdodCAtIGFyZWEudG9wO1xuXG4gICAgeTEgKz0gdGhpcy5wYXJhbXMudG9wO1xuICAgIHkyICs9IHRoaXMucGFyYW1zLnRvcDtcblxuICAgIGNvbnN0IGl0ZW1TaGFwZU1hcCA9IHRoaXMuX2l0ZW1TaGFwZU1hcDtcbiAgICBjb25zdCByZW5kZXJpbmdDb250ZXh0ID0gdGhpcy5fcmVuZGVyaW5nQ29udGV4dDtcblxuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5pdGVtcy5maWx0ZXIoZnVuY3Rpb24oZGF0dW0sIGluZGV4KSB7XG4gICAgICBjb25zdCBncm91cCA9IHRoaXM7XG4gICAgICBjb25zdCBzaGFwZSA9IGl0ZW1TaGFwZU1hcC5nZXQoZ3JvdXApO1xuICAgICAgcmV0dXJuIHNoYXBlLmluQXJlYShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgeDEsIHkxLCB4MiwgeTIpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGl0ZW1zWzBdLnNsaWNlKDApO1xuICB9XG5cbiAgLy8gaGVscGVyIHRvIGFkZCBzb21lIGNsYXNzIG9yIHN0dWZmIG9uIGl0ZW1zXG4gIC8vIGVhY2goY2FsbGJhY2spIHsgdGhpcy5fZWFjaCA9IGNhbGxiYWNrIH1cblxuICAvKipcbiAgICogIHJlbmRlciB0aGUgRE9NIGluIG1lbW9yeSBvbiBsYXllciBjcmVhdGlvbiB0byBiZSBhYmxlIHRvIHVzZSBpdCBiZWZvcmVcbiAgICogIHRoZSBsYXllciBpcyBhY3R1YWxseSBpbnNlcnRlZCBpbiB0aGUgRE9NXG4gICAqL1xuICBfcmVuZGVyKCkge1xuICAgIC8vIHdyYXBwZXIgZ3JvdXAgZm9yIGBzdGFydCwgdG9wIGFuZCBjb250ZXh0IGZsaXAgbWF0cml4XG4gICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnbGF5ZXInKTtcbiAgICAvLyBhcHBlbmQgYSBzdmcgdG8gY2xpcCB0aGUgY29udGV4dFxuICAgIC8vIEBOT1RFOiBjb3VsZCB1c2UgYSBncm91cCB3aXRoIGEgYGNsaXBQYXRoYCBwcm9wZXJ0eVxuICAgIHRoaXMuYm91bmRpbmdCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdzdmcnKTtcbiAgICB0aGlzLmJvdW5kaW5nQm94LmNsYXNzTGlzdC5hZGQoJ2JvdW5kaW5nLWJveCcpO1xuICAgIC8vIHRoaXMuYm91bmRpbmdCb3guc2V0QXR0cmlidXRlTlMobnVsbCwgJ2lkJywgdGhpcy5wYXJhbXMuaWQpO1xuICAgIC8vIGdyb3VwIHRvIGFwcGx5IG9mZnNldFxuICAgIHRoaXMuZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy5ncm91cC5jbGFzc0xpc3QuYWRkKCdvZmZzZXQnLCAnaXRlbXMnKTtcblxuICAgIC8vIGNvbnRleHQgaW50ZXJhY3Rpb25zXG4gICAgdGhpcy5pbnRlcmFjdGlvbnNHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLmludGVyYWN0aW9uc0dyb3VwLmNsYXNzTGlzdC5hZGQoJ2xheWVyLWludGVyYWN0aW9ucycpO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zR3JvdXAuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAvLyBATk9URTogd29ya3MgYnV0IGtpbmcgb2YgdWdseS4uLiBtdXN0IGJlIGNsZWFuZWRcbiAgICB0aGlzLmNvbnRleHRTaGFwZSA9IG5ldyBSZWN0KCk7XG4gICAgdGhpcy5jb250ZXh0U2hhcGUuaW5zdGFsbCh7XG4gICAgICBvcGFjaXR5OiAoKSA9PiAwLjEsXG4gICAgICBjb2xvciAgOiAoKSA9PiAnIzc4Nzg3OCcsXG4gICAgICB3aWR0aCAgOiAoKSA9PiB0aGlzLl9jb250ZXh0QXR0cmlidXRlcy5kdXJhdGlvbixcbiAgICAgIGhlaWdodCA6ICgpID0+IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQueVNjYWxlLmRvbWFpbigpWzFdLFxuICAgICAgeSAgICAgIDogKCkgPT4gdGhpcy5fcmVuZGVyaW5nQ29udGV4dC55U2NhbGUuZG9tYWluKClbMF1cbiAgICB9KTtcblxuICAgIHRoaXMuaW50ZXJhY3Rpb25zR3JvdXAuYXBwZW5kQ2hpbGQodGhpcy5jb250ZXh0U2hhcGUucmVuZGVyKCkpO1xuXG4gICAgLy8gY3JlYXRlIHRoZSBET00gdHJlZVxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuYm91bmRpbmdCb3gpO1xuICAgIHRoaXMuYm91bmRpbmdCb3guYXBwZW5kQ2hpbGQodGhpcy5pbnRlcmFjdGlvbnNHcm91cCk7XG4gICAgdGhpcy5ib3VuZGluZ0JveC5hcHBlbmRDaGlsZCh0aGlzLmdyb3VwKTtcblxuICAgIC8vIGRyYXcgYSByZWN0IGluIGNvbnRleHQgYmFja2dyb3VuZCB0byBkZWJ1ZyBpdCdzIHNpemVcbiAgICBpZiAodGhpcy5wYXJhbXMuZGVidWcpIHtcbiAgICAgIHRoaXMuZGVidWdSZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncmVjdCcpO1xuICAgICAgdGhpcy5ib3VuZGluZ0JveC5hcHBlbmRDaGlsZCh0aGlzLmRlYnVnUmVjdCk7XG4gICAgICB0aGlzLmRlYnVnUmVjdC5zdHlsZS5maWxsID0gJyNhYmFiYWInO1xuICAgICAgdGhpcy5kZWJ1Z1JlY3Quc3R5bGUuZmlsbE9wYWNpdHkgPSAwLjE7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBjcmVhdGVzIHRoZSBsYXllciBncm91cCB3aXRoIGEgdHJhbnNmb3JtYXRpb24gbWF0cml4IHRvIGZsaXAgdGhlIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgKiAgQHJldHVybiB7RE9NRWxlbWVudH1cbiAgICovXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XG4gIH1cblxuICAvKipcbiAgICogY3JlYXRlIHRoZSBET00gYWNjb3JkaW5nIHRvIGdpdmVuIGRhdGEgYW5kIHNoYXBlc1xuICAgKi9cbiAgZHJhdygpIHtcbiAgICAvLyBATk9URTogY3JlYXRlIGEgdW5pcXVlIGlkIHRvIGZvcmNlIGQzIHRvIGtlZXAgZGF0YSBpbiBzeW5jIHdpdGggdGhlIERPTVxuICAgIC8vIEBUT0RPOiByZWFkIGFnYWluIGh0dHA6Ly9ib3N0Lm9ja3Mub3JnL21pa2Uvc2VsZWN0aW9uL1xuICAgIHRoaXMuZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGRhdHVtKSB7XG4gICAgICBpZiAoX2RhdHVtSWRNYXAuaGFzKGRhdHVtKSkgeyByZXR1cm47IH1cbiAgICAgIF9kYXR1bUlkTWFwLnNldChkYXR1bSwgX2NvdW50ZXIrKyk7XG4gICAgfSk7XG5cbiAgICAvLyBzZWxlY3QgaXRlbXNcbiAgICB0aGlzLml0ZW1zID0gZDNTZWxlY3Rpb24uc2VsZWN0KHRoaXMuZ3JvdXApXG4gICAgICAuc2VsZWN0QWxsKCcuaXRlbScpXG4gICAgICAuZmlsdGVyKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb21tb24nKTtcbiAgICAgIH0pXG4gICAgICAuZGF0YSh0aGlzLmRhdGEsIGZ1bmN0aW9uKGRhdHVtKSB7XG4gICAgICAgIHJldHVybiBfZGF0dW1JZE1hcC5nZXQoZGF0dW0pO1xuICAgICAgfSk7XG5cbiAgICAvLyBoYW5kbGUgY29tbW9uU2hhcGVzIC0+IHJlbmRlciBvbmx5IG9uY2VcbiAgICBpZiAoXG4gICAgICB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb24gIT09IG51bGwgJiZcbiAgICAgIHRoaXMuX2l0ZW1Db21tb25TaGFwZU1hcC5zaXplID09PSAwXG4gICAgKSB7XG4gICAgICBjb25zdCB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9ID0gdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uO1xuICAgICAgY29uc3QgZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgICBjb25zdCBzaGFwZSA9IG5ldyBjdG9yKG9wdGlvbnMpO1xuXG4gICAgICBzaGFwZS5pbnN0YWxsKGFjY2Vzc29ycyk7XG4gICAgICBncm91cC5hcHBlbmRDaGlsZChzaGFwZS5yZW5kZXIoKSk7XG4gICAgICBncm91cC5jbGFzc0xpc3QuYWRkKCdpdGVtJywgJ2NvbW1vbicsIHNoYXBlLmdldENsYXNzTmFtZSgpKTtcblxuICAgICAgdGhpcy5faXRlbUNvbW1vblNoYXBlTWFwLnNldChncm91cCwgc2hhcGUpO1xuICAgICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZChncm91cCk7XG4gICAgfVxuXG4gICAgLy8gZW50ZXJcbiAgICB0aGlzLml0ZW1zLmVudGVyKClcbiAgICAgIC5hcHBlbmQoKGRhdHVtLCBpbmRleCkgPT4ge1xuICAgICAgICAvLyBATk9URTogZDMgYmluZHMgYHRoaXNgIHRvIHRoZSBjb250YWluZXIgZ3JvdXBcbiAgICAgICAgLy8gY3JlYXRlIGEgZ3JvdXAgZm9yIHRoZSBpdGVtXG4gICAgICAgIGNvbnN0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICAgICBjb25zdCB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9ID0gdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uO1xuICAgICAgICBjb25zdCBzaGFwZSA9IG5ldyBjdG9yKG9wdGlvbnMpO1xuICAgICAgICAvLyBpbnN0YWxsIGFjY2Vzc29ycyBvbiB0aGUgbmV3bHkgY3JlYXRlZCBzaGFwZVxuICAgICAgICBzaGFwZS5pbnN0YWxsKGFjY2Vzc29ycyk7XG5cbiAgICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQoc2hhcGUucmVuZGVyKHRoaXMuX3JlbmRlcmluZ0NvbnRleHQpKTtcbiAgICAgICAgZ3JvdXAuY2xhc3NMaXN0LmFkZCgnaXRlbScsIHNoYXBlLmdldENsYXNzTmFtZSgpKTtcblxuICAgICAgICB0aGlzLl9pdGVtU2hhcGVNYXAuc2V0KGdyb3VwLCBzaGFwZSk7XG5cbiAgICAgICAgcmV0dXJuIGdyb3VwO1xuICAgICAgfSk7XG5cbiAgICAvLyBleGl0XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG5cbiAgICB0aGlzLml0ZW1zLmV4aXQoKVxuICAgICAgLmVhY2goZnVuY3Rpb24oZGF0dW0sIGluZGV4KSB7XG4gICAgICAgIGNvbnN0IGdyb3VwID0gdGhpcztcbiAgICAgICAgY29uc3Qgc2hhcGUgPSB0aGF0Ll9pdGVtU2hhcGVNYXAuZ2V0KGdyb3VwKTtcblxuICAgICAgICBzaGFwZS5kZXN0cm95KCk7ICAgICAgICAgICAgICAgICAgLy8gY2xlYW4gc2hhcGVcbiAgICAgICAgX2RhdHVtSWRNYXAuZGVsZXRlKGRhdHVtKTsgICAgICAgIC8vIGNsZWFuIHJlZmVyZW5jZSBpbiBgaWRgIG1hcFxuICAgICAgICB0aGF0Ll9pdGVtU2hhcGVNYXAuZGVsZXRlKGdyb3VwKTsgLy8gZGVzdHJveSByZWZlcmVuY2UgaW4gaXRlbSBzaGFwZSBtYXBcbiAgICAgIH0pXG4gICAgICAucmVtb3ZlKCk7XG4gIH1cblxuICAvKipcbiAgICogIHVwZGF0ZXMgQ29udGV4dCBhbmQgU2hhcGVzXG4gICAqL1xuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpO1xuXG4gICAgdGhpcy51cGRhdGVDb250ZXh0KCk7XG4gICAgdGhpcy51cGRhdGVTaGFwZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlcyB0aGUgY29udGV4dCBvZiB0aGUgbGF5ZXJcbiAgICovXG4gIHVwZGF0ZUNvbnRleHQoKSB7XG4gICAgLy8gQE5PVEU6IHJlcGxhY2VkIGBjb250ZXh0Lm9yaWdpbmFsWFNjYWxlYCB3aXRoIGBjb250ZXh0LnhTY2FsZWBcbiAgICAvLyA9PiB0aGUgYmVoYXZpb3IgaXMgbm90IHByb3BlciB3aGVuIHRoZSBsYXllciBpcyBzdHJldGNoZWRcbiAgICAvLyBjb25zdCB4ICAgICAgPSB0aGlzLl9jb250ZXh0Ll9wYXJlbnQueFNjYWxlKHRoaXMuX2NvbnRleHQuc3RhcnQpO1xuICAgIGNvbnN0IHggICAgICA9IHRoaXMuX2NvbnRleHQueFNjYWxlKHRoaXMuX2NvbnRleHQuc3RhcnQpO1xuICAgIGNvbnN0IHdpZHRoICA9IHRoaXMuX2NvbnRleHQueFNjYWxlKHRoaXMuX2NvbnRleHQuZHVyYXRpb24pO1xuICAgIGNvbnN0IG9mZnNldCA9IHRoaXMuX2NvbnRleHQueFNjYWxlKHRoaXMuX2NvbnRleHQub2Zmc2V0KTtcbiAgICBjb25zdCB0b3AgICAgPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIC8vIG1hdHJpeCB0byBpbnZlcnQgdGhlIGNvb3JkaW5hdGUgc3lzdGVtXG4gICAgY29uc3QgdHJhbnNsYXRlTWF0cml4ID0gYG1hdHJpeCgxLCAwLCAwLCAtMSwgJHt4fSwgJHt0b3AgKyBoZWlnaHR9KWA7XG5cbiAgICB0aGlzLmNvbnRhaW5lci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlTWF0cml4KTtcblxuICAgIC8vIGNvbnN0IGNsaXBQYXRoID0gYHBvbHlnb24oMCAwLCAke3dpZHRofXB4IDAsICR7d2lkdGh9cHggJHtoZWlnaHR9cHgsIDAgJHtoZWlnaHR9cHgpYDtcbiAgICAvLyAtd2Via2l0LWNsaXAtcGF0aDogcG9seWdvbigwIDAsIDc0MHB4IDAsIDc0MHB4IDE2MHB4LCAwIDE2MHB4KTtcbiAgICAvLyB0aGlzLmJvdW5kaW5nQm94LnN0eWxlLndlYmtpdENsaXBQYXRoID0gY2xpcFBhdGg7XG5cbiAgICB0aGlzLmJvdW5kaW5nQm94LnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHdpZHRoKTtcbiAgICB0aGlzLmJvdW5kaW5nQm94LnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgIHRoaXMuYm91bmRpbmdCb3guc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG5cbiAgICB0aGlzLmdyb3VwLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7b2Zmc2V0fSwgMClgKTtcblxuICAgIC8vIG1haW50YWluIGNvbnRleHQgc2hhcGVcbiAgICB0aGlzLmNvbnRleHRTaGFwZS51cGRhdGUoXG4gICAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LFxuICAgICAgdGhpcy5pbnRlcmFjdGlvbnNHcm91cCxcbiAgICAgIHRoaXMuX2NvbnRleHRBdHRyaWJ1dGVzLFxuICAgICAgMFxuICAgICk7XG5cbiAgICAvLyBkZWJ1ZyBjb250ZXh0XG4gICAgaWYgKHRoaXMucGFyYW1zLmRlYnVnKSB7XG4gICAgICB0aGlzLmRlYnVnUmVjdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgICB0aGlzLmRlYnVnUmVjdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIHVwZGF0ZXMgdGhlIFNoYXBlcyB3aGljaCBiZWxvbmdzIHRvIHRoZSBsYXllclxuICAgKiAgQHBhcmFtIGl0ZW0ge0RPTUVsZW1lbnR9XG4gICAqL1xuICB1cGRhdGVTaGFwZXMoaXRlbSA9IG51bGwpIHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICBjb25zdCByZW5kZXJpbmdDb250ZXh0ID0gdGhpcy5fcmVuZGVyaW5nQ29udGV4dDtcbiAgICBjb25zdCBpdGVtcyA9IGl0ZW0gIT09IG51bGwgPyBkM1NlbGVjdGlvbi5zZWxlY3RBbGwoaXRlbSkgOiB0aGlzLml0ZW1zO1xuXG4gICAgLy8gdXBkYXRlIGNvbW1vbiBzaGFwZXNcbiAgICB0aGlzLl9pdGVtQ29tbW9uU2hhcGVNYXAuZm9yRWFjaCgoc2hhcGUsIGl0ZW0pID0+IHtcbiAgICAgIHNoYXBlLnVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBpdGVtLCB0aGlzLmRhdGEpO1xuICAgIH0pO1xuXG4gICAgLy8gdXBkYXRlIGVudGl0eSBvciBjb2xsZWN0aW9uIHNoYXBlc1xuICAgIGlmICghaXRlbXMpIHsgcmV0dXJuOyB9IC8vIGlmIG5vIHNoYXBlIGluIHRoZSBsYXllci4uLlxuICAgIGl0ZW1zLmVhY2goZnVuY3Rpb24oZGF0dW0sIGluZGV4KSB7XG4gICAgICAvLyB1cGRhdGUgYWxsIHNoYXBlcyByZWxhdGVkIHRvIHRoZSBjdXJyZW50IGl0ZW1cbiAgICAgIGNvbnN0IGdyb3VwID0gdGhpczsgLy8gY3VycmVudCBgZy5pdGVtYFxuICAgICAgY29uc3Qgc2hhcGUgPSB0aGF0Ll9pdGVtU2hhcGVNYXAuZ2V0KGdyb3VwKTtcbiAgICAgIHNoYXBlLnVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBncm91cCwgZGF0dW0sIGluZGV4KTtcbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExheWVyO1xuIl19