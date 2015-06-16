"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var ns = require("./namespace");
var d3 = require("d3");
var Rect = require("../shapes/rect");
var SegmentBehavior = require("../behaviors/segment-behavior");

// create a private item -> id map to force d3 being in sync with the DOM
var _counter = 0;
var _datumIdMap = new _core.Map();

var Layer = (function () {
  function Layer() {
    var dataType = arguments[0] === undefined ? "collection" : arguments[0];
    var data = arguments[1] === undefined ? [] : arguments[1];
    var options = arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, Layer);

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

    this._yScale = d3.scale.linear().domain(this.params.yDomain).range([0, this.params.height]);

    // initialize context
    this._render();
  }

  _createClass(Layer, {
    yDomain: {
      set: function (domain) {
        this.params.yDomain = domain;
        this._yScale.domain(domain);
      }
    },
    opacity: {
      set: function (value) {
        this.params.opacity = value;
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
          default:
            this._data = data;
            break;
        }
      }
    },
    setShape: {

      // --------------------------------------
      // Component Configuration
      // --------------------------------------

      /**
       *  Register the shape and its accessors to use in order to render
       *  the entity or collection
       *  @param ctor <Function:BaseShape> the constructor of the shape to be used
       *  @param accessors <Object> accessors to use in order to map the data structure
       */

      value: function setShape(ctor) {
        var accessors = arguments[1] === undefined ? {} : arguments[1];
        var options = arguments[2] === undefined ? {} : arguments[2];

        this._shapeConfiguration = { ctor: ctor, accessors: accessors, options: options };
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
    setCommonShape: {

      /**
       *  Register the shape to use with the entire collection
       *  example: the line in a beakpoint function
       *  @param ctor {BaseShape} the constructor of the shape to use to render data
       *  @param accessors {Object} accessors to use in order to map the data structure
       */

      value: function setCommonShape(ctor) {
        var accessors = arguments[1] === undefined ? {} : arguments[1];
        var options = arguments[2] === undefined ? {} : arguments[2];

        this._commonShapeConfiguration = { ctor: ctor, accessors: accessors, options: options };
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
          var datum = d3.select(item).datum();
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
          var datum = d3.select(item).datum();
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
          var datum = d3.select(item).datum();
          _this._behavior.toggleSelection(item, datum);
        });
      }
    },
    edit: {

      // @TODO change signature edit(items = [...], dx, dy, target);
      // -> be consistent for all behaviors API

      value: function edit(item, dx, dy, target) {
        var datum = d3.select(item).datum();
        var shape = this._itemShapeMap.get(item);
        this._behavior.edit(this._renderingContext, shape, datum, dx, dy, target);
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

      set: function () {
        var bool = arguments[0] === undefined ? false : arguments[0];

        var display = bool ? "block" : "none";
        this.interactionsGroup.style.display = display;
        this._isContextEditable = bool;
      }
    },
    editContext: {

      // @NOTE create a proper `ContextBehavior` ?

      value: function editContext(dx, dy, target) {
        var contextAttributes = this._contextAttributes;
        var renderingContext = this._renderingContext;
        // dx = dx * contextAttributes.stretchRatio;
        // dy = dy * contextAttributes.stretchRatio;

        if (target.classList.contains("handler") && target.classList.contains("left")) {
          // edit `context.start`, `context.offset` and `context.duration`
          var x = renderingContext.xScale(contextAttributes.start);
          var offset = renderingContext.xScale(contextAttributes.offset);
          var width = renderingContext.xScale(contextAttributes.duration);

          var targetX = x + dx;
          var targetOffset = offset - dx;
          var targetWidth = width - dx;

          this.setContextAttribute("start", renderingContext.xScale.invert(targetX));
          this.setContextAttribute("offset", renderingContext.xScale.invert(targetOffset));
          this.setContextAttribute("duration", renderingContext.xScale.invert(targetWidth));
        } else if (target.classList.contains("handler") && target.classList.contains("right")) {
          // edit `context.duration`
          var width = renderingContext.xScale(contextAttributes.duration);
          var targetWidth = Math.max(width + dx, 0);

          this.setContextAttribute("duration", renderingContext.xScale.invert(targetWidth));
        } else {
          // edit `context.start`
          var x = renderingContext.xScale(contextAttributes.start);
          var targetX = Math.max(x + dx, 0);

          this.setContextAttribute("start", renderingContext.xScale.invert(targetX));
        }
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
        } while (el = el.parentNode);
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
        return this.items[0].indexOf(item) !== -1 ? item : null;
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
        } while (el = el.parentNode);

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
        this.items = d3.select(this.group).selectAll(".item").filter(function () {
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
        var items = item !== null ? d3.selectAll(item) : this.items;

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
})();

module.exports = Layer;
//# sourceMappingURL=data:application/json;base64,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QUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7OztBQUc5RCxZQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFFLElBQUksRUFBSztBQUNoRCxlQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRSxNQUFLLElBQUksQ0FBQyxDQUFDO1NBQ2pELENBQUMsQ0FBQzs7O0FBR0gsWUFBSSxDQUFDLEtBQUssRUFBRTtBQUFFLGlCQUFPO1NBQUU7QUFDdkIsYUFBSyxDQUFDLElBQUksQ0FBQyxVQUFTLEtBQUssRUFBRSxLQUFLLEVBQUU7O0FBRWhDLGNBQU0sS0FBSyxHQUFHLElBQUksQ0FBQztBQUNuQixjQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QyxlQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDckQsQ0FBQyxDQUFDO09BQ0o7Ozs7U0F2akJHLEtBQUs7OztBQTBqQlgsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMiLCJmaWxlIjoiZXM2L2NvcmUvbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBucyA9IHJlcXVpcmUoJy4vbmFtZXNwYWNlJyk7XG5jb25zdCBkMyA9IHJlcXVpcmUoJ2QzJyk7XG5jb25zdCBSZWN0ID0gcmVxdWlyZSgnLi4vc2hhcGVzL3JlY3QnKTtcbmNvbnN0IFNlZ21lbnRCZWhhdmlvciA9IHJlcXVpcmUoJy4uL2JlaGF2aW9ycy9zZWdtZW50LWJlaGF2aW9yJyk7XG5cbi8vIGNyZWF0ZSBhIHByaXZhdGUgaXRlbSAtPiBpZCBtYXAgdG8gZm9yY2UgZDMgYmVpbmcgaW4gc3luYyB3aXRoIHRoZSBET01cbmxldCBfY291bnRlciA9IDA7XG5jb25zdCBfZGF0dW1JZE1hcCA9IG5ldyBNYXAoKTtcblxuY2xhc3MgTGF5ZXIge1xuICBjb25zdHJ1Y3RvcihkYXRhVHlwZSA9ICdjb2xsZWN0aW9uJywgZGF0YSA9IFtdLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmRhdGFUeXBlID0gZGF0YVR5cGU7IC8vICdlbnRpdHknIHx8ICdjb2xsZWN0aW9uJztcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBoZWlnaHQ6IDEwMCwgLy8gc2hvdWxkIGluaGVyaXQgZnJvbSBwYXJlbnRcbiAgICAgIHRvcDogMCxcbiAgICAgIGlkOiAnJyxcbiAgICAgIHlEb21haW46IFswLCAxXSxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICBkZWJ1Z0NvbnRleHQ6IGZhbHNlLCAvLyBwYXNzIHRoZSBjb250ZXh0IGluIGRlYnVnIG1vZGVcbiAgICAgIGNvbnRleHRIYW5kbGVyV2lkdGg6IDJcbiAgICB9O1xuXG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbnRhaW5lciA9IG51bGw7IC8vIG9mZnNldCBncm91cCBvZiB0aGUgcGFyZW50IGNvbnRleHRcbiAgICB0aGlzLmdyb3VwID0gbnVsbDsgLy8gZ3JvdXAgY3JlYXRlZCBieSB0aGUgbGF5ZXIgaW5zaWRlIHRoZSBjb250ZXh0XG4gICAgdGhpcy5pdGVtcyA9IG51bGw7IC8vIGQzIGNvbGxlY3Rpb24gb2YgdGhlIGxheWVyIGl0ZW1zXG5cbiAgICB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb24gPSBudWxsOyAvLyB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9XG4gICAgdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uID0gbnVsbDsgLy8geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfVxuXG4gICAgdGhpcy5faXRlbVNoYXBlTWFwID0gbmV3IE1hcCgpOyAvLyBpdGVtIGdyb3VwIDxET01FbGVtZW50PiA9PiBzaGFwZVxuICAgIHRoaXMuX2l0ZW1Db21tb25TaGFwZU1hcCA9IG5ldyBNYXAoKTsgLy8gb25lIGVudHJ5IG1heCBpbiB0aGlzIG1hcFxuXG4gICAgdGhpcy5faXNDb250ZXh0RWRpdGFibGUgPSBmYWxzZTtcblxuICAgIC8vIGNvbXBvbmVudCBjb25maWd1cmF0aW9uXG4gICAgdGhpcy5fYmVoYXZpb3IgPSBudWxsO1xuICAgIHRoaXMuX2NvbnRleHQgPSBudWxsO1xuICAgIHRoaXMuX2NvbnRleHRBdHRyaWJ1dGVzID0gbnVsbDtcblxuICAgIHRoaXMuX3lTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG4gICAgICAuZG9tYWluKHRoaXMucGFyYW1zLnlEb21haW4pXG4gICAgICAucmFuZ2UoWzAsIHRoaXMucGFyYW1zLmhlaWdodF0pO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSBjb250ZXh0XG4gICAgdGhpcy5fcmVuZGVyKCk7XG4gIH1cblxuICBzZXQgeURvbWFpbihkb21haW4pIHtcbiAgICB0aGlzLnBhcmFtcy55RG9tYWluID0gZG9tYWluO1xuICAgIHRoaXMuX3lTY2FsZS5kb21haW4oZG9tYWluKTtcbiAgfVxuXG4gIHNldCBvcGFjaXR5KHZhbHVlKSB7XG4gICAgdGhpcy5wYXJhbXMub3BhY2l0eSA9IHZhbHVlO1xuICB9XG5cbiAgcGFyYW0obmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtc1tuYW1lXSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqICBAbWFuZGF0b3J5IGRlZmluZSB0aGUgY29udGV4dCBpbiB3aGljaCB0aGUgbGF5ZXIgaXMgZHJhd25cbiAgICogIEBwYXJhbSBjb250ZXh0IHtUaW1lQ29udGV4dH0gdGhlIHRpbWVDb250ZXh0IGluIHdoaWNoIHRoZSBsYXllciBpcyBkaXNwbGF5ZWRcbiAgICovXG4gIHNldENvbnRleHQoY29udGV4dCkge1xuICAgIHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xuXG4gICAgLy8gbWFpbnRhaW4gYSByZWZlcmVuY2Ugb2YgdGhlIGNvbnRleHQgc3RhdGUgdG8gYmUgdXNlZCBpbiBhcHBsaWNhdGlvblxuICAgIHRoaXMuX2NvbnRleHRBdHRyaWJ1dGVzID0ge1xuICAgICAgc3RhcnQ6IHRoaXMuX2NvbnRleHQuc3RhcnQsXG4gICAgICBkdXJhdGlvbjogdGhpcy5fY29udGV4dC5kdXJhdGlvbixcbiAgICAgIG9mZnNldDogdGhpcy5fY29udGV4dC5vZmZzZXQsXG4gICAgICBzdHJldGNoUmF0aW86IHRoaXMuX2NvbnRleHQuc3RyZXRjaFJhdGlvXG4gICAgfTtcblxuICAgIC8vIGNyZWF0ZSBhIG1peGluIHRvIHBhc3MgdG8gc2hhcGVzXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dCA9IHt9O1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIERhdGFcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBnZXQgZGF0YSgpIHsgcmV0dXJuIHRoaXMuX2RhdGE7IH1cblxuICBzZXQgZGF0YShkYXRhKSB7XG4gICAgc3dpdGNoICh0aGlzLmRhdGFUeXBlKSB7XG4gICAgICBjYXNlICdlbnRpdHknOlxuICAgICAgICBpZiAodGhpcy5fZGF0YSkgeyAvLyBpZiBkYXRhIGFscmVhZHkgZXhpc3RzLCByZXVzZSB0aGUgcmVmZXJlbmNlXG4gICAgICAgICAgdGhpcy5fZGF0YVswXSA9IGRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fZGF0YSA9IFtkYXRhXTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbGxlY3Rpb24nOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbXBvbmVudCBDb25maWd1cmF0aW9uXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqICBSZWdpc3RlciB0aGUgc2hhcGUgYW5kIGl0cyBhY2Nlc3NvcnMgdG8gdXNlIGluIG9yZGVyIHRvIHJlbmRlclxuICAgKiAgdGhlIGVudGl0eSBvciBjb2xsZWN0aW9uXG4gICAqICBAcGFyYW0gY3RvciA8RnVuY3Rpb246QmFzZVNoYXBlPiB0aGUgY29uc3RydWN0b3Igb2YgdGhlIHNoYXBlIHRvIGJlIHVzZWRcbiAgICogIEBwYXJhbSBhY2Nlc3NvcnMgPE9iamVjdD4gYWNjZXNzb3JzIHRvIHVzZSBpbiBvcmRlciB0byBtYXAgdGhlIGRhdGEgc3RydWN0dXJlXG4gICAqL1xuICBzZXRTaGFwZShjdG9yLCBhY2Nlc3NvcnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uID0geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgQE5PVEUgc2hvdWxkIGJlIG1lcmdlIGluIHNldFNoYXBlIGZvciBjb25zaXN0ZW5jeSBidXQgcHJvYmxlbSB0byBkZWZpbmUgdGhlIG1ldGhvZCBzaWduYXR1cmVcbiAgICogIFJlZ2lzdGVyIHRoZSBiZWhhdmlvciB0byB1c2Ugd2hlbiBpbnRlcmFjdGluZyB3aXRoIHRoZSBzaGFwZVxuICAgKiAgQHBhcmFtIGJlaGF2aW9yIHtCYXNlQmVoYXZpb3J9XG4gICAqL1xuICBzZXRCZWhhdmlvcihiZWhhdmlvcikge1xuICAgIGJlaGF2aW9yLmluaXRpYWxpemUodGhpcyk7XG4gICAgdGhpcy5fYmVoYXZpb3IgPSBiZWhhdmlvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiAgUmVnaXN0ZXIgdGhlIHNoYXBlIHRvIHVzZSB3aXRoIHRoZSBlbnRpcmUgY29sbGVjdGlvblxuICAgKiAgZXhhbXBsZTogdGhlIGxpbmUgaW4gYSBiZWFrcG9pbnQgZnVuY3Rpb25cbiAgICogIEBwYXJhbSBjdG9yIHtCYXNlU2hhcGV9IHRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgc2hhcGUgdG8gdXNlIHRvIHJlbmRlciBkYXRhXG4gICAqICBAcGFyYW0gYWNjZXNzb3JzIHtPYmplY3R9IGFjY2Vzc29ycyB0byB1c2UgaW4gb3JkZXIgdG8gbWFwIHRoZSBkYXRhIHN0cnVjdHVyZVxuICAgKi9cbiAgc2V0Q29tbW9uU2hhcGUoY3RvciwgYWNjZXNzb3JzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiA9IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH07XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDb250ZXh0IEF0dHJpYnV0ZXMgQWNjZXNzb3JzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqICBVc2UgYW4gZXh0ZXJuYWwgb2JqIHRvIHVzZSBhcyB0aGUgYGNvbnRleHRBdHRyaWJ1dGVgIHdyYXBwZXJcbiAgICogIEBwYXJhbSBvYmoge09iamVjdH1cbiAgICovXG4gIHNldCBjb250ZXh0QXR0cmlidXRlcyhvYmopIHsgdGhpcy5fY29udGV4dEF0dHJpYnV0ZXMgPSBvYmo7IH1cbiAgZ2V0IGNvbnRleHRBdHRyaWJ1dGVzKCkgeyByZXR1cm4gdGhpcy5fY29udGV4dEF0dHJpYnV0ZXM7IH1cblxuICAvKipcbiAgICogIHVwZGF0ZSBhIGdpdmVuIGF0dHJpYnV0ZSBvZiB0aGUgY29udGV4dFxuICAgKiAgQHBhcmFtIG5hbWUge1N0cmluZ30gdGhlIGtleSBvZiB0aGUgYXR0cmlidXRlIHRvIHVwZGF0ZVxuICAgKiAgQHBhcmFtIHZhbHVlIHttaXhlZH1cbiAgICovXG4gIHNldENvbnRleHRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzLl9jb250ZXh0QXR0cmlidXRlc1tuYW1lXSA9IHZhbHVlO1xuICAgIHRoaXMuX2NvbnRleHRbbmFtZV0gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlIHRoZSB2YWx1ZXMgaW4gYF9yZW5kZXJpbmdDb250ZXh0YFxuICAgKiAgaXMgcGFydGljdWxhcnkgbmVlZGVkIHdoZW4gdXBkYXRpbmcgYHN0cmV0Y2hSYXRpb2AgYXMgdGhlIHBvaW50ZXJcbiAgICogIHRvIHRoZSBgeFNjYWxlYCBtYXkgY2hhbmdlXG4gICAqL1xuICBfdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpIHtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnhTY2FsZSA9IHRoaXMuX2NvbnRleHQueFNjYWxlO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQueVNjYWxlID0gdGhpcy5feVNjYWxlO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQuaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQud2lkdGggID0gdGhpcy5fY29udGV4dC54U2NhbGUodGhpcy5fY29udGV4dC5kdXJhdGlvbik7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBCZWhhdmlvciBBY2Nlc3NvcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIEJlaGF2aW9yIGVudHJ5IHBvaW50c1xuICAgKiAgQE5PVEUgQVBJIC0+IGNoYW5nZSBmb3IgYW4gQXJyYXkgYXMgZmlyc3QgYXJndW1lbnRcbiAgICogIEBUT0RPICAgICAtPiBoYW5kbGUgaWYgbm8gYmVoYXZpb3IgaXMgcmVnaXN0ZXJlZFxuICAgKi9cbiAgZ2V0IHNlbGVjdGVkSXRlbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2JlaGF2aW9yID8gdGhpcy5fYmVoYXZpb3Iuc2VsZWN0ZWRJdGVtcyA6IFtdO1xuICB9XG5cbiAgc2VsZWN0KGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcsKgfHzCoCFpdGVtcykgeyByZXR1cm47IH1cbiAgICBpdGVtcyA9IEFycmF5LmlzQXJyYXkoaXRlbXMpID8gaXRlbXMgOiBbaXRlbXNdO1xuXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaXRlbSA9IHRoaXMuX2dldEl0ZW1Gcm9tRE9NRWxlbWVudChpdGVtKTtcbiAgICAgIGNvbnN0IGRhdHVtID0gZDMuc2VsZWN0KGl0ZW0pLmRhdHVtKCk7XG4gICAgICB0aGlzLl9iZWhhdmlvci5zZWxlY3QoaXRlbSwgZGF0dW0pO1xuICAgICAgdGhpcy5fdG9Gcm9udChpdGVtKTtcbiAgICB9KTtcbiAgfVxuXG4gIHVuc2VsZWN0KGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcsKgfHzCoCFpdGVtcykgeyByZXR1cm47IH1cbiAgICBpdGVtcyA9IEFycmF5LmlzQXJyYXkoaXRlbXMpID8gaXRlbXMgOiBbaXRlbXNdO1xuXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgZGF0dW0gPSBkMy5zZWxlY3QoaXRlbSkuZGF0dW0oKTtcbiAgICAgIHRoaXMuX2JlaGF2aW9yLnVuc2VsZWN0KGl0ZW0sIGRhdHVtKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbGVjdEFsbCgpIHtcbiAgICB0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHRoaXMuc2VsZWN0KGl0ZW0pKTtcbiAgfVxuXG4gIHVuc2VsZWN0QWxsKCkge1xuICAgIHRoaXMuc2VsZWN0ZWRJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB0aGlzLnVuc2VsZWN0KGl0ZW0pKTtcbiAgfVxuXG4gIHRvZ2dsZVNlbGVjdGlvbihpdGVtcykge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3LCoHx8wqAhaXRlbXMpIHsgcmV0dXJuOyB9XG4gICAgaXRlbXMgPSBBcnJheS5pc0FycmF5KGl0ZW1zKSA/IGl0ZW1zIDogW2l0ZW1zXTtcblxuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IGRhdHVtID0gZDMuc2VsZWN0KGl0ZW0pLmRhdHVtKCk7XG4gICAgICB0aGlzLl9iZWhhdmlvci50b2dnbGVTZWxlY3Rpb24oaXRlbSwgZGF0dW0pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gQFRPRE8gY2hhbmdlIHNpZ25hdHVyZSBlZGl0KGl0ZW1zID0gWy4uLl0sIGR4LCBkeSwgdGFyZ2V0KTtcbiAgLy8gLT4gYmUgY29uc2lzdGVudCBmb3IgYWxsIGJlaGF2aW9ycyBBUElcbiAgZWRpdChpdGVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IGRhdHVtID0gZDMuc2VsZWN0KGl0ZW0pLmRhdHVtKCk7XG4gICAgY29uc3Qgc2hhcGUgPSB0aGlzLl9pdGVtU2hhcGVNYXAuZ2V0KGl0ZW0pO1xuICAgIHRoaXMuX2JlaGF2aW9yLmVkaXQodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDb250ZXh0IEJlaGF2aW9yXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqICBkcmF3IHRoZSBzaGFwZSB0byBpbnRlcmFjdCB3aXRoIHRoZSBjb250ZXh0XG4gICAqICBAcGFyYW1zIGJvb2wge0Jvb2xlYW59IGRlZmluZSBpZiB0aGUgbGF5ZXIncyBjb250ZXh0IGlzIGVkaXRhYmxlIG9yIG5vdFxuICAgKi9cbiAgc2V0IGVkaXRhYmxlKGJvb2wgPSBmYWxzZSkge1xuICAgIGNvbnN0IGRpc3BsYXkgPSBib29sID8gJ2Jsb2NrJyA6ICdub25lJztcbiAgICB0aGlzLmludGVyYWN0aW9uc0dyb3VwLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xuICAgIHRoaXMuX2lzQ29udGV4dEVkaXRhYmxlID0gYm9vbDtcbiAgfVxuXG4gIC8vIEBOT1RFIGNyZWF0ZSBhIHByb3BlciBgQ29udGV4dEJlaGF2aW9yYCA/XG4gIGVkaXRDb250ZXh0KGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgY29uc3QgY29udGV4dEF0dHJpYnV0ZXMgPSB0aGlzLl9jb250ZXh0QXR0cmlidXRlcztcbiAgICBjb25zdCByZW5kZXJpbmdDb250ZXh0ICA9IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQ7XG4gICAgLy8gZHggPSBkeCAqIGNvbnRleHRBdHRyaWJ1dGVzLnN0cmV0Y2hSYXRpbztcbiAgICAvLyBkeSA9IGR5ICogY29udGV4dEF0dHJpYnV0ZXMuc3RyZXRjaFJhdGlvO1xuXG4gICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2hhbmRsZXInKSAmJiB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdsZWZ0JykpIHtcbiAgICAgIC8vIGVkaXQgYGNvbnRleHQuc3RhcnRgLCBgY29udGV4dC5vZmZzZXRgIGFuZCBgY29udGV4dC5kdXJhdGlvbmBcbiAgICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZShjb250ZXh0QXR0cmlidXRlcy5zdGFydCk7XG4gICAgICBjb25zdCBvZmZzZXQgPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZShjb250ZXh0QXR0cmlidXRlcy5vZmZzZXQpO1xuICAgICAgY29uc3Qgd2lkdGggPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZShjb250ZXh0QXR0cmlidXRlcy5kdXJhdGlvbik7XG5cbiAgICAgIGxldCB0YXJnZXRYID0geCArIGR4O1xuICAgICAgbGV0IHRhcmdldE9mZnNldCA9IG9mZnNldCAtIGR4O1xuICAgICAgbGV0IHRhcmdldFdpZHRoID0gd2lkdGggLSBkeDtcblxuICAgICAgdGhpcy5zZXRDb250ZXh0QXR0cmlidXRlKCdzdGFydCcsIHJlbmRlcmluZ0NvbnRleHQueFNjYWxlLmludmVydCh0YXJnZXRYKSk7XG4gICAgICB0aGlzLnNldENvbnRleHRBdHRyaWJ1dGUoJ29mZnNldCcsIHJlbmRlcmluZ0NvbnRleHQueFNjYWxlLmludmVydCh0YXJnZXRPZmZzZXQpKTtcbiAgICAgIHRoaXMuc2V0Q29udGV4dEF0dHJpYnV0ZSgnZHVyYXRpb24nLCByZW5kZXJpbmdDb250ZXh0LnhTY2FsZS5pbnZlcnQodGFyZ2V0V2lkdGgpKTtcblxuICAgIH0gZWxzZSBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnaGFuZGxlcicpICYmIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3JpZ2h0JykpIHtcbiAgICAgIC8vIGVkaXQgYGNvbnRleHQuZHVyYXRpb25gXG4gICAgICBjb25zdCB3aWR0aCA9IHJlbmRlcmluZ0NvbnRleHQueFNjYWxlKGNvbnRleHRBdHRyaWJ1dGVzLmR1cmF0aW9uKTtcbiAgICAgIGxldCB0YXJnZXRXaWR0aCA9IE1hdGgubWF4KHdpZHRoICsgZHgsIDApO1xuXG4gICAgICB0aGlzLnNldENvbnRleHRBdHRyaWJ1dGUoJ2R1cmF0aW9uJywgcmVuZGVyaW5nQ29udGV4dC54U2NhbGUuaW52ZXJ0KHRhcmdldFdpZHRoKSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZWRpdCBgY29udGV4dC5zdGFydGBcbiAgICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZShjb250ZXh0QXR0cmlidXRlcy5zdGFydCk7XG4gICAgICBsZXQgdGFyZ2V0WCA9IE1hdGgubWF4KHggKyBkeCwgMCk7XG5cbiAgICAgIHRoaXMuc2V0Q29udGV4dEF0dHJpYnV0ZSgnc3RhcnQnLCByZW5kZXJpbmdDb250ZXh0LnhTY2FsZS5pbnZlcnQodGFyZ2V0WCkpO1xuICAgIH1cbiAgfVxuXG4gIHN0cmV0Y2hDb250ZXh0KGR4LCBkeSwgdGFyZ2V0KSB7fVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEhlbHBlcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIEBOT1RFIGlzIG9ubHkgdXNlZCBvbiBgaGFzSXRlbWAgPT4gbm8gbmVlZCB0byBzZXBhcmF0ZSB0aGlzIG1ldGhvZFxuICAgKiAgQHJldHVybiB7RE9NRWxlbWVudH0gdGhlIGNsb3Nlc3QgcGFyZW50IGBpdGVtYCBncm91cCBmb3IgYSBnaXZlbiBET00gZWxlbWVudFxuICAgKi9cbiAgX2dldEl0ZW1Gcm9tRE9NRWxlbWVudChlbCkge1xuICAgIGRvIHtcbiAgICAgIGlmIChlbC5ub2RlTmFtZSA9PT0gJ2cnICYmIGVsLmNsYXNzTGlzdC5jb250YWlucygnaXRlbScpKSB7XG4gICAgICAgIHJldHVybiBlbDtcbiAgICAgIH1cbiAgICB9IHdoaWxlIChlbCA9IGVsLnBhcmVudE5vZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqICBtb3ZlcyBhbiBgaXRlbWAncyBncm91cCB0byB0aGUgZW5kIG9mIHRoZSBsYXllciAoc3ZnIHotaW5kZXguLi4pXG4gICAqICBAcGFyYW0gYGl0ZW1gIHtET01FbGVtZW50fSB0aGUgaXRlbSB0byBiZSBtb3ZlZFxuICAgKi9cbiAgX3RvRnJvbnQoaXRlbSkge1xuICAgIHRoaXMuZ3JvdXAuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogIERlZmluZSBpZiBhbiBnaXZlbiBET00gZWxlbWVudCBiZWxvbmdzIHRvIG9uZSBvZiB0aGUgYGl0ZW1zYFxuICAgKiAgQHBhcmFtIGBlbGAge0RPTUVsZW1lbnR9IHRoZSBlbGVtZW50IHRvIGJlIHRlc3RlZFxuICAgKiAgQHJldHVybiB7bWl4ZWR9XG4gICAqICAgIHtET01FbGVtZW50fSBpdGVtIGdyb3VwIGNvbnRhaW5pbmcgdGhlIGBlbGAgaWYgYmVsb25ncyB0byB0aGlzIGxheWVyXG4gICAqICAgIG51bGwgb3RoZXJ3aXNlXG4gICAqL1xuICBoYXNJdGVtKGVsKSB7XG4gICAgY29uc3QgaXRlbSA9IHRoaXMuX2dldEl0ZW1Gcm9tRE9NRWxlbWVudChlbCk7XG4gICAgcmV0dXJuICh0aGlzLml0ZW1zWzBdLmluZGV4T2YoaXRlbSkgIT09IC0xKSA/IGl0ZW0gOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqICBEZWZpbmUgaWYgYSBnaXZlbiBlbGVtZW50IGJlbG9uZ3MgdG8gdGhlIGxheWVyXG4gICAqICBpcyBtb3JlIGdlbmVyYWwgdGhhbiBgaGFzSXRlbWAsIGNhbiBiZSB1c2VkIHRvIGNoZWNrIGludGVyYWN0aW9uIGVsZW1lbnRzIHRvb1xuICAgKi9cbiAgaGFzRWxlbWVudChlbCkge1xuICAgIGRvIHtcbiAgICAgIGlmIChlbCA9PT0gdGhpcy5jb250YWluZXIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoZWwgPSBlbC5wYXJlbnROb2RlKTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgQHBhcmFtIGFyZWEge09iamVjdH0gYXJlYSBpbiB3aGljaCB0byBmaW5kIHRoZSBlbGVtZW50c1xuICAgKiAgQHJldHVybiB7QXJyYXl9IGxpc3Qgb2YgdGhlIERPTSBlbGVtZW50cyBpbiB0aGUgZ2l2ZW4gYXJlYVxuICAgKi9cbiAgZ2V0SXRlbXNJbkFyZWEoYXJlYSkge1xuICAgIC8vIHdvcmsgaW4gcGl4ZWwgZG9tYWluXG4gICAgY29uc3Qgc3RhcnQgICAgPSB0aGlzLl9jb250ZXh0LnhTY2FsZSh0aGlzLl9jb250ZXh0LnN0YXJ0KTtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMuX2NvbnRleHQueFNjYWxlKHRoaXMuX2NvbnRleHQuZHVyYXRpb24pO1xuICAgIGNvbnN0IG9mZnNldCAgID0gdGhpcy5fY29udGV4dC54U2NhbGUodGhpcy5fY29udGV4dC5vZmZzZXQpO1xuICAgIGNvbnN0IHRvcCAgICAgID0gdGhpcy5wYXJhbXMudG9wO1xuICAgIC8vIG11c3QgYmUgYXdhcmUgb2YgdGhlIGxheWVyJ3MgY29udGV4dCBtb2RpZmljYXRpb25zXG4gICAgLy8gY29uc3RyYWluIGluIHdvcmtpbmcgdmlld1xuICAgIGxldCB4MSA9IE1hdGgubWF4KGFyZWEubGVmdCwgc3RhcnQpO1xuICAgIGxldCB4MiA9IE1hdGgubWluKGFyZWEubGVmdCArIGFyZWEud2lkdGgsIHN0YXJ0ICsgZHVyYXRpb24pO1xuICAgIC8vIGFwcGx5IHN0YXJ0IGFuZCBvZmZzZXRcbiAgICB4MSAtPSAoc3RhcnQgKyBvZmZzZXQpO1xuICAgIHgyIC09IChzdGFydCArIG9mZnNldCk7XG4gICAgLy8gYmUgY29uc2lzdGVudCB3aXRoIGNvbnRleHQgeSBjb29yZGluYXRlcyBzeXN0ZW1cbiAgICBsZXQgeTEgPSB0aGlzLnBhcmFtcy5oZWlnaHQgLSAoYXJlYS50b3AgKyBhcmVhLmhlaWdodCk7XG4gICAgbGV0IHkyID0gdGhpcy5wYXJhbXMuaGVpZ2h0IC0gYXJlYS50b3A7XG5cbiAgICB5MSArPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgeTIgKz0gdGhpcy5wYXJhbXMudG9wO1xuXG4gICAgY29uc3QgaXRlbVNoYXBlTWFwID0gdGhpcy5faXRlbVNoYXBlTWFwO1xuICAgIGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLl9yZW5kZXJpbmdDb250ZXh0O1xuXG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLml0ZW1zLmZpbHRlcihmdW5jdGlvbihkYXR1bSwgaW5kZXgpIHtcbiAgICAgIGNvbnN0IGdyb3VwID0gdGhpcztcbiAgICAgIGNvbnN0IHNoYXBlID0gaXRlbVNoYXBlTWFwLmdldChncm91cCk7XG4gICAgICByZXR1cm4gc2hhcGUuaW5BcmVhKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaXRlbXNbMF0uc2xpY2UoMCk7XG4gIH1cblxuICAvLyBoZWxwZXIgdG8gYWRkIHNvbWUgY2xhc3Mgb3Igc3R1ZmYgb24gaXRlbXNcbiAgLy8gZWFjaChjYWxsYmFjaykgeyB0aGlzLl9lYWNoID0gY2FsbGJhY2sgfVxuXG4gIC8qKlxuICAgKiAgcmVuZGVyIHRoZSBET00gaW4gbWVtb3J5IG9uIGxheWVyIGNyZWF0aW9uIHRvIGJlIGFibGUgdG8gdXNlIGl0IGJlZm9yZVxuICAgKiAgdGhlIGxheWVyIGlzIGFjdHVhbGx5IGluc2VydGVkIGluIHRoZSBET01cbiAgICovXG4gIF9yZW5kZXIoKSB7XG4gICAgLy8gd3JhcHBlciBncm91cCBmb3IgYHN0YXJ0LCB0b3AgYW5kIGNvbnRleHQgZmxpcCBtYXRyaXhcbiAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdsYXllcicpO1xuICAgIC8vIGFwcGVuZCBhIHN2ZyB0byBjbGlwIHRoZSBjb250ZXh0XG4gICAgLy8gQE5PVEU6IGNvdWxkIHVzZSBhIGdyb3VwIHdpdGggYSBgY2xpcFBhdGhgIHByb3BlcnR5XG4gICAgdGhpcy5ib3VuZGluZ0JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3N2ZycpO1xuICAgIHRoaXMuYm91bmRpbmdCb3guY2xhc3NMaXN0LmFkZCgnYm91bmRpbmctYm94Jyk7XG4gICAgLy8gdGhpcy5ib3VuZGluZ0JveC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaWQnLCB0aGlzLnBhcmFtcy5pZCk7XG4gICAgLy8gZ3JvdXAgdG8gYXBwbHkgb2Zmc2V0XG4gICAgdGhpcy5ncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLmdyb3VwLmNsYXNzTGlzdC5hZGQoJ29mZnNldCcsICdpdGVtcycpO1xuXG4gICAgLy8gY29udGV4dCBpbnRlcmFjdGlvbnNcbiAgICB0aGlzLmludGVyYWN0aW9uc0dyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zR3JvdXAuY2xhc3NMaXN0LmFkZCgnbGF5ZXItaW50ZXJhY3Rpb25zJyk7XG4gICAgdGhpcy5pbnRlcmFjdGlvbnNHcm91cC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIC8vIEBOT1RFOiB3b3JrcyBidXQga2luZyBvZiB1Z2x5Li4uIG11c3QgYmUgY2xlYW5lZFxuICAgIHRoaXMuY29udGV4dFNoYXBlID0gbmV3IFJlY3QoKTtcbiAgICB0aGlzLmNvbnRleHRTaGFwZS5pbnN0YWxsKHtcbiAgICAgIG9wYWNpdHk6ICgpID0+IDAuMSxcbiAgICAgIGNvbG9yICA6ICgpID0+ICcjNzg3ODc4JyxcbiAgICAgIHdpZHRoICA6ICgpID0+IHRoaXMuX2NvbnRleHRBdHRyaWJ1dGVzLmR1cmF0aW9uLFxuICAgICAgaGVpZ2h0IDogKCkgPT4gdGhpcy5fcmVuZGVyaW5nQ29udGV4dC55U2NhbGUuZG9tYWluKClbMV0sXG4gICAgICB5ICAgICAgOiAoKSA9PiB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnlTY2FsZS5kb21haW4oKVswXVxuICAgIH0pO1xuXG4gICAgdGhpcy5pbnRlcmFjdGlvbnNHcm91cC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRleHRTaGFwZS5yZW5kZXIoKSk7XG5cbiAgICAvLyBjcmVhdGUgdGhlIERPTSB0cmVlXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5ib3VuZGluZ0JveCk7XG4gICAgdGhpcy5ib3VuZGluZ0JveC5hcHBlbmRDaGlsZCh0aGlzLmludGVyYWN0aW9uc0dyb3VwKTtcbiAgICB0aGlzLmJvdW5kaW5nQm94LmFwcGVuZENoaWxkKHRoaXMuZ3JvdXApO1xuXG4gICAgLy8gZHJhdyBhIHJlY3QgaW4gY29udGV4dCBiYWNrZ3JvdW5kIHRvIGRlYnVnIGl0J3Mgc2l6ZVxuICAgIGlmICh0aGlzLnBhcmFtcy5kZWJ1Zykge1xuICAgICAgdGhpcy5kZWJ1Z1JlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgICB0aGlzLmJvdW5kaW5nQm94LmFwcGVuZENoaWxkKHRoaXMuZGVidWdSZWN0KTtcbiAgICAgIHRoaXMuZGVidWdSZWN0LnN0eWxlLmZpbGwgPSAnI2FiYWJhYic7XG4gICAgICB0aGlzLmRlYnVnUmVjdC5zdHlsZS5maWxsT3BhY2l0eSA9IDAuMTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIGNyZWF0ZXMgdGhlIGxheWVyIGdyb3VwIHdpdGggYSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXggdG8gZmxpcCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW0uXG4gICAqICBAcmV0dXJuIHtET01FbGVtZW50fVxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGUgdGhlIERPTSBhY2NvcmRpbmcgdG8gZ2l2ZW4gZGF0YSBhbmQgc2hhcGVzXG4gICAqL1xuICBkcmF3KCkge1xuICAgIC8vIEBOT1RFOiBjcmVhdGUgYSB1bmlxdWUgaWQgdG8gZm9yY2UgZDMgdG8ga2VlcCBkYXRhIGluIHN5bmMgd2l0aCB0aGUgRE9NXG4gICAgLy8gQFRPRE86IHJlYWQgYWdhaW4gaHR0cDovL2Jvc3Qub2Nrcy5vcmcvbWlrZS9zZWxlY3Rpb24vXG4gICAgdGhpcy5kYXRhLmZvckVhY2goZnVuY3Rpb24oZGF0dW0pIHtcbiAgICAgIGlmIChfZGF0dW1JZE1hcC5oYXMoZGF0dW0pKSB7IHJldHVybjsgfVxuICAgICAgX2RhdHVtSWRNYXAuc2V0KGRhdHVtLCBfY291bnRlcisrKTtcbiAgICB9KTtcblxuICAgIC8vIHNlbGVjdCBpdGVtc1xuICAgIHRoaXMuaXRlbXMgPSBkMy5zZWxlY3QodGhpcy5ncm91cClcbiAgICAgIC5zZWxlY3RBbGwoJy5pdGVtJylcbiAgICAgIC5maWx0ZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbW1vbicpXG4gICAgICB9KVxuICAgICAgLmRhdGEodGhpcy5kYXRhLCBmdW5jdGlvbihkYXR1bSkge1xuICAgICAgICByZXR1cm4gX2RhdHVtSWRNYXAuZ2V0KGRhdHVtKTtcbiAgICAgIH0pO1xuXG4gICAgLy8gaGFuZGxlIGNvbW1vblNoYXBlcyAtPiByZW5kZXIgb25seSBvbmNlXG4gICAgaWYgKFxuICAgICAgdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uICE9PSBudWxsICYmXG4gICAgICB0aGlzLl9pdGVtQ29tbW9uU2hhcGVNYXAuc2l6ZSA9PT0gMFxuICAgICkge1xuICAgICAgY29uc3QgeyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfSA9IHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbjtcbiAgICAgIGNvbnN0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgY3RvcihvcHRpb25zKTtcblxuICAgICAgc2hhcGUuaW5zdGFsbChhY2Nlc3NvcnMpO1xuICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQoc2hhcGUucmVuZGVyKCkpO1xuICAgICAgZ3JvdXAuY2xhc3NMaXN0LmFkZCgnaXRlbScsICdjb21tb24nLCBzaGFwZS5nZXRDbGFzc05hbWUoKSk7XG5cbiAgICAgIHRoaXMuX2l0ZW1Db21tb25TaGFwZU1hcC5zZXQoZ3JvdXAsIHNoYXBlKTtcbiAgICAgIHRoaXMuZ3JvdXAuYXBwZW5kQ2hpbGQoZ3JvdXApO1xuICAgIH1cblxuICAgIC8vIGVudGVyXG4gICAgdGhpcy5pdGVtcy5lbnRlcigpXG4gICAgICAuYXBwZW5kKChkYXR1bSwgaW5kZXgpID0+IHtcbiAgICAgICAgLy8gQE5PVEU6IGQzIGJpbmRzIGB0aGlzYCB0byB0aGUgY29udGFpbmVyIGdyb3VwXG4gICAgICAgIC8vIGNyZWF0ZSBhIGdyb3VwIGZvciB0aGUgaXRlbVxuICAgICAgICBjb25zdCBncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAgICAgY29uc3QgeyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfSA9IHRoaXMuX3NoYXBlQ29uZmlndXJhdGlvbjtcbiAgICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgY3RvcihvcHRpb25zKTtcbiAgICAgICAgLy8gaW5zdGFsbCBhY2Nlc3NvcnMgb24gdGhlIG5ld2x5IGNyZWF0ZWQgc2hhcGVcbiAgICAgICAgc2hhcGUuaW5zdGFsbChhY2Nlc3NvcnMpO1xuXG4gICAgICAgIGdyb3VwLmFwcGVuZENoaWxkKHNoYXBlLnJlbmRlcih0aGlzLl9yZW5kZXJpbmdDb250ZXh0KSk7XG4gICAgICAgIGdyb3VwLmNsYXNzTGlzdC5hZGQoJ2l0ZW0nLCBzaGFwZS5nZXRDbGFzc05hbWUoKSk7XG5cbiAgICAgICAgdGhpcy5faXRlbVNoYXBlTWFwLnNldChncm91cCwgc2hhcGUpO1xuXG4gICAgICAgIHJldHVybiBncm91cDtcbiAgICAgIH0pO1xuXG4gICAgLy8gZXhpdFxuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuXG4gICAgdGhpcy5pdGVtcy5leGl0KClcbiAgICAgIC5lYWNoKGZ1bmN0aW9uKGRhdHVtLCBpbmRleCkge1xuICAgICAgICBjb25zdCBncm91cCA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHNoYXBlID0gdGhhdC5faXRlbVNoYXBlTWFwLmdldChncm91cCk7XG5cbiAgICAgICAgc2hhcGUuZGVzdHJveSgpOyAgICAgICAgICAgICAgICAgIC8vIGNsZWFuIHNoYXBlXG4gICAgICAgIF9kYXR1bUlkTWFwLmRlbGV0ZShkYXR1bSk7ICAgICAgICAvLyBjbGVhbiByZWZlcmVuY2UgaW4gYGlkYCBtYXBcbiAgICAgICAgdGhhdC5faXRlbVNoYXBlTWFwLmRlbGV0ZShncm91cCk7IC8vIGRlc3Ryb3kgcmVmZXJlbmNlIGluIGl0ZW0gc2hhcGUgbWFwXG4gICAgICB9KVxuICAgICAgLnJlbW92ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqICB1cGRhdGVzIENvbnRleHQgYW5kIFNoYXBlc1xuICAgKi9cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcblxuICAgIHRoaXMudXBkYXRlQ29udGV4dCgpO1xuICAgIHRoaXMudXBkYXRlU2hhcGVzKCk7XG4gIH1cblxuICAvKipcbiAgICogIHVwZGF0ZXMgdGhlIGNvbnRleHQgb2YgdGhlIGxheWVyXG4gICAqL1xuICB1cGRhdGVDb250ZXh0KCkge1xuICAgIC8vIEBOT1RFOiByZXBsYWNlZCBgY29udGV4dC5vcmlnaW5hbFhTY2FsZWAgd2l0aCBgY29udGV4dC54U2NhbGVgXG4gICAgLy8gPT4gdGhlIGJlaGF2aW9yIGlzIG5vdCBwcm9wZXIgd2hlbiB0aGUgbGF5ZXIgaXMgc3RyZXRjaGVkXG4gICAgLy8gY29uc3QgeCAgICAgID0gdGhpcy5fY29udGV4dC5fcGFyZW50LnhTY2FsZSh0aGlzLl9jb250ZXh0LnN0YXJ0KTtcbiAgICBjb25zdCB4ICAgICAgPSB0aGlzLl9jb250ZXh0LnhTY2FsZSh0aGlzLl9jb250ZXh0LnN0YXJ0KTtcbiAgICBjb25zdCB3aWR0aCAgPSB0aGlzLl9jb250ZXh0LnhTY2FsZSh0aGlzLl9jb250ZXh0LmR1cmF0aW9uKTtcbiAgICBjb25zdCBvZmZzZXQgPSB0aGlzLl9jb250ZXh0LnhTY2FsZSh0aGlzLl9jb250ZXh0Lm9mZnNldCk7XG4gICAgY29uc3QgdG9wICAgID0gdGhpcy5wYXJhbXMudG9wO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICAvLyBtYXRyaXggdG8gaW52ZXJ0IHRoZSBjb29yZGluYXRlIHN5c3RlbVxuICAgIGNvbnN0IHRyYW5zbGF0ZU1hdHJpeCA9IGBtYXRyaXgoMSwgMCwgMCwgLTEsICR7eH0sICR7dG9wICsgaGVpZ2h0fSlgO1xuXG4gICAgdGhpcy5jb250YWluZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHRyYW5zbGF0ZU1hdHJpeCk7XG5cbiAgICAvLyBjb25zdCBjbGlwUGF0aCA9IGBwb2x5Z29uKDAgMCwgJHt3aWR0aH1weCAwLCAke3dpZHRofXB4ICR7aGVpZ2h0fXB4LCAwICR7aGVpZ2h0fXB4KWA7XG4gICAgLy8gLXdlYmtpdC1jbGlwLXBhdGg6IHBvbHlnb24oMCAwLCA3NDBweCAwLCA3NDBweCAxNjBweCwgMCAxNjBweCk7XG4gICAgLy8gdGhpcy5ib3VuZGluZ0JveC5zdHlsZS53ZWJraXRDbGlwUGF0aCA9IGNsaXBQYXRoO1xuICAgIHRoaXMuYm91bmRpbmdCb3guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgIHRoaXMuYm91bmRpbmdCb3guc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgdGhpcy5ib3VuZGluZ0JveC5zdHlsZS5vcGFjaXR5ID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcblxuICAgIHRoaXMuZ3JvdXAuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHtvZmZzZXR9LCAwKWApO1xuXG4gICAgLy8gbWFpbnRhaW4gY29udGV4dCBzaGFwZVxuICAgIHRoaXMuY29udGV4dFNoYXBlLnVwZGF0ZShcbiAgICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQsXG4gICAgICB0aGlzLmludGVyYWN0aW9uc0dyb3VwLFxuICAgICAgdGhpcy5fY29udGV4dEF0dHJpYnV0ZXMsXG4gICAgICAwXG4gICAgKTtcblxuICAgIC8vIGRlYnVnIGNvbnRleHRcbiAgICBpZiAodGhpcy5wYXJhbXMuZGVidWcpIHtcbiAgICAgIHRoaXMuZGVidWdSZWN0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHdpZHRoKTtcbiAgICAgIHRoaXMuZGVidWdSZWN0LnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlcyB0aGUgU2hhcGVzIHdoaWNoIGJlbG9uZ3MgdG8gdGhlIGxheWVyXG4gICAqICBAcGFyYW0gaXRlbSB7RE9NRWxlbWVudH1cbiAgICovXG4gIHVwZGF0ZVNoYXBlcyhpdGVtID0gbnVsbCkge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLl9yZW5kZXJpbmdDb250ZXh0O1xuICAgIGNvbnN0IGl0ZW1zID0gaXRlbSAhPT0gbnVsbCA/IGQzLnNlbGVjdEFsbChpdGVtKSA6IHRoaXMuaXRlbXM7XG5cbiAgICAvLyB1cGRhdGUgY29tbW9uIHNoYXBlc1xuICAgIHRoaXMuX2l0ZW1Db21tb25TaGFwZU1hcC5mb3JFYWNoKChzaGFwZSwgaXRlbSkgPT4ge1xuICAgICAgc2hhcGUudXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGl0ZW0sIHRoaXMuZGF0YSk7XG4gICAgfSk7XG5cbiAgICAvLyB1cGRhdGUgZW50aXR5IG9yIGNvbGxlY3Rpb24gc2hhcGVzXG4gICAgaWYgKCFpdGVtcykgeyByZXR1cm47IH0gLy8gaWYgbm8gc2hhcGUgaW4gdGhlIGxheWVyLi4uXG4gICAgaXRlbXMuZWFjaChmdW5jdGlvbihkYXR1bSwgaW5kZXgpIHtcbiAgICAgIC8vIHVwZGF0ZSBhbGwgc2hhcGVzIHJlbGF0ZWQgdG8gdGhlIGN1cnJlbnQgaXRlbVxuICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzOyAvLyBjdXJyZW50IGBnLml0ZW1gXG4gICAgICBjb25zdCBzaGFwZSA9IHRoYXQuX2l0ZW1TaGFwZU1hcC5nZXQoZ3JvdXApO1xuICAgICAgc2hhcGUudXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGdyb3VwLCBkYXR1bSwgaW5kZXgpO1xuICAgIH0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGF5ZXI7XG4iXX0=