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
  function Layer(context) {
    var dataType = arguments[1] === undefined ? "collection" : arguments[1];
    var data = arguments[2] === undefined ? [] : arguments[2];
    var options = arguments[3] === undefined ? {} : arguments[3];

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
    this.setContext(context);
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
       *  define
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
    setBehavior: {

      /**
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
        this._renderingContext.xScale = this._context.xScale, this._renderingContext.yScale = this._yScale, this._renderingContext.height = this.params.height;
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
        // @NOTE: replaced `context.originalXScale` with `context._parent.xScale`
        // => looks more coherent, but behavior needs to be checked, validated and tested properly
        var x = this._context._parent.xScale(this._context.start);
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
//# sourceMappingURL=data:application/json;base64,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RCxlQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRSxNQUFLLElBQUksQ0FBQyxDQUFDO1NBQ2pELENBQUMsQ0FBQzs7O0FBR0gsWUFBSSxDQUFDLEtBQUssRUFBRTtBQUFFLGlCQUFPO1NBQUU7QUFDdkIsYUFBSyxDQUFDLElBQUksQ0FBQyxVQUFTLEtBQUssRUFBRSxLQUFLLEVBQUU7O0FBRWhDLGNBQU0sS0FBSyxHQUFHLElBQUksQ0FBQztBQUNuQixjQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QyxlQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDckQsQ0FBQyxDQUFDO09BQ0o7Ozs7U0FwakJHLEtBQUs7OztBQXVqQlgsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMiLCJmaWxlIjoiZXM2L2NvcmUvbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBucyA9IHJlcXVpcmUoJy4vbmFtZXNwYWNlJyk7XG5jb25zdCBkMyA9IHJlcXVpcmUoJ2QzJyk7XG5jb25zdCBSZWN0ID0gcmVxdWlyZSgnLi4vc2hhcGVzL3JlY3QnKTtcbmNvbnN0IFNlZ21lbnRCZWhhdmlvciA9IHJlcXVpcmUoJy4uL2JlaGF2aW9ycy9zZWdtZW50LWJlaGF2aW9yJyk7XG5cbi8vIGNyZWF0ZSBhIHByaXZhdGUgaXRlbSAtPiBpZCBtYXAgdG8gZm9yY2UgZDMgYmVpbmcgaW4gc3luYyB3aXRoIHRoZSBET01cbmxldCBfY291bnRlciA9IDA7XG5jb25zdCBfZGF0dW1JZE1hcCA9IG5ldyBNYXAoKTtcblxuY2xhc3MgTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihjb250ZXh0LCBkYXRhVHlwZSA9ICdjb2xsZWN0aW9uJywgZGF0YSA9IFtdLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmRhdGFUeXBlID0gZGF0YVR5cGU7IC8vICdlbnRpdHknIHx8ICdjb2xsZWN0aW9uJztcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBoZWlnaHQ6IDEwMCwgLy8gc2hvdWxkIGluaGVyaXQgZnJvbSBwYXJlbnRcbiAgICAgIHRvcDogMCxcbiAgICAgIGlkOiAnJyxcbiAgICAgIHlEb21haW46IFswLCAxXSxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICBkZWJ1Z0NvbnRleHQ6IGZhbHNlLCAvLyBwYXNzIHRoZSBjb250ZXh0IGluIGRlYnVnIG1vZGVcbiAgICAgIGNvbnRleHRIYW5kbGVyV2lkdGg6IDJcbiAgICB9O1xuXG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbnRhaW5lciA9IG51bGw7IC8vIG9mZnNldCBncm91cCBvZiB0aGUgcGFyZW50IGNvbnRleHRcbiAgICB0aGlzLmdyb3VwID0gbnVsbDsgLy8gZ3JvdXAgY3JlYXRlZCBieSB0aGUgbGF5ZXIgaW5zaWRlIHRoZSBjb250ZXh0XG4gICAgdGhpcy5pdGVtcyA9IG51bGw7IC8vIGQzIGNvbGxlY3Rpb24gb2YgdGhlIGxheWVyIGl0ZW1zXG5cbiAgICB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb24gPSBudWxsOyAvLyB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9XG4gICAgdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uID0gbnVsbDsgLy8geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfVxuXG4gICAgdGhpcy5faXRlbVNoYXBlTWFwID0gbmV3IE1hcCgpOyAvLyBpdGVtIGdyb3VwIDxET01FbGVtZW50PiA9PiBzaGFwZVxuICAgIHRoaXMuX2l0ZW1Db21tb25TaGFwZU1hcCA9IG5ldyBNYXAoKTsgLy8gb25lIGVudHJ5IG1heCBpbiB0aGlzIG1hcFxuXG4gICAgdGhpcy5faXNDb250ZXh0RWRpdGFibGUgPSBmYWxzZTtcblxuICAgIC8vIGNvbXBvbmVudCBjb25maWd1cmF0aW9uXG4gICAgdGhpcy5fYmVoYXZpb3IgPSBudWxsO1xuICAgIHRoaXMuX2NvbnRleHQgPSBudWxsO1xuICAgIHRoaXMuX2NvbnRleHRBdHRyaWJ1dGVzID0gbnVsbDtcblxuICAgIHRoaXMuX3lTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG4gICAgICAuZG9tYWluKHRoaXMucGFyYW1zLnlEb21haW4pXG4gICAgICAucmFuZ2UoWzAsIHRoaXMucGFyYW1zLmhlaWdodF0pO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSBjb250ZXh0XG4gICAgdGhpcy5zZXRDb250ZXh0KGNvbnRleHQpO1xuICAgIHRoaXMuX3JlbmRlcigpO1xuICB9XG5cbiAgc2V0IHlEb21haW4oZG9tYWluKSB7XG4gICAgdGhpcy5wYXJhbXMueURvbWFpbiA9IGRvbWFpbjtcbiAgICB0aGlzLl95U2NhbGUuZG9tYWluKGRvbWFpbik7XG4gIH1cblxuICBzZXQgb3BhY2l0eSh2YWx1ZSkge1xuICAgIHRoaXMucGFyYW1zLm9wYWNpdHkgPSB2YWx1ZTtcbiAgfVxuXG4gIHBhcmFtKG5hbWUsIHZhbHVlKSB7XG4gICAgdGhpcy5wYXJhbXNbbmFtZV0gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgZGVmaW5lXG4gICAqICBAcGFyYW0gY29udGV4dCB7VGltZUNvbnRleHR9IHRoZSB0aW1lQ29udGV4dCBpbiB3aGljaCB0aGUgbGF5ZXIgaXMgZGlzcGxheWVkXG4gICAqL1xuICBzZXRDb250ZXh0KGNvbnRleHQpIHtcbiAgICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcblxuICAgIC8vIG1haW50YWluIGEgcmVmZXJlbmNlIG9mIHRoZSBjb250ZXh0IHN0YXRlIHRvIGJlIHVzZWQgaW4gYXBwbGljYXRpb25cbiAgICB0aGlzLl9jb250ZXh0QXR0cmlidXRlcyA9IHtcbiAgICAgIHN0YXJ0OiB0aGlzLl9jb250ZXh0LnN0YXJ0LFxuICAgICAgZHVyYXRpb246IHRoaXMuX2NvbnRleHQuZHVyYXRpb24sXG4gICAgICBvZmZzZXQ6IHRoaXMuX2NvbnRleHQub2Zmc2V0LFxuICAgICAgc3RyZXRjaFJhdGlvOiB0aGlzLl9jb250ZXh0LnN0cmV0Y2hSYXRpb1xuICAgIH07XG5cbiAgICAvLyBjcmVhdGUgYSBtaXhpbiB0byBwYXNzIHRvIHNoYXBlc1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQgPSB7fTtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBEYXRhXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgZ2V0IGRhdGEoKSB7IHJldHVybiB0aGlzLl9kYXRhOyB9XG5cbiAgc2V0IGRhdGEoZGF0YSkge1xuICAgIHN3aXRjaCAodGhpcy5kYXRhVHlwZSkge1xuICAgICAgY2FzZSAnZW50aXR5JzpcbiAgICAgICAgaWYgKHRoaXMuX2RhdGEpIHsgLy8gaWYgZGF0YSBhbHJlYWR5IGV4aXN0cywgcmV1c2UgdGhlIHJlZmVyZW5jZVxuICAgICAgICAgIHRoaXMuX2RhdGFbMF0gPSBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2RhdGEgPSBbZGF0YV07XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2xsZWN0aW9uJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDb21wb25lbnQgQ29uZmlndXJhdGlvblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiAgUmVnaXN0ZXIgdGhlIHNoYXBlIGFuZCBpdHMgYWNjZXNzb3JzIHRvIHVzZSBpbiBvcmRlciB0byByZW5kZXJcbiAgICogIHRoZSBlbnRpdHkgb3IgY29sbGVjdGlvblxuICAgKiAgQHBhcmFtIGN0b3IgPEZ1bmN0aW9uOkJhc2VTaGFwZT4gdGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBzaGFwZSB0byBiZSB1c2VkXG4gICAqICBAcGFyYW0gYWNjZXNzb3JzIDxPYmplY3Q+IGFjY2Vzc29ycyB0byB1c2UgaW4gb3JkZXIgdG8gbWFwIHRoZSBkYXRhIHN0cnVjdHVyZVxuICAgKi9cbiAgc2V0U2hhcGUoY3RvciwgYWNjZXNzb3JzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX3NoYXBlQ29uZmlndXJhdGlvbiA9IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH07XG4gIH1cblxuICAvKipcbiAgICogIFJlZ2lzdGVyIHRoZSBzaGFwZSB0byB1c2Ugd2l0aCB0aGUgZW50aXJlIGNvbGxlY3Rpb25cbiAgICogIGV4YW1wbGU6IHRoZSBsaW5lIGluIGEgYmVha3BvaW50IGZ1bmN0aW9uXG4gICAqICBAcGFyYW0gY3RvciB7QmFzZVNoYXBlfSB0aGUgY29uc3RydWN0b3Igb2YgdGhlIHNoYXBlIHRvIHVzZSB0byByZW5kZXIgZGF0YVxuICAgKiAgQHBhcmFtIGFjY2Vzc29ycyB7T2JqZWN0fSBhY2Nlc3NvcnMgdG8gdXNlIGluIG9yZGVyIHRvIG1hcCB0aGUgZGF0YSBzdHJ1Y3R1cmVcbiAgICovXG4gIHNldENvbW1vblNoYXBlKGN0b3IsIGFjY2Vzc29ycyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb24gPSB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9O1xuICB9XG5cbiAgLyoqXG4gICAqICBSZWdpc3RlciB0aGUgYmVoYXZpb3IgdG8gdXNlIHdoZW4gaW50ZXJhY3Rpbmcgd2l0aCB0aGUgc2hhcGVcbiAgICogIEBwYXJhbSBiZWhhdmlvciB7QmFzZUJlaGF2aW9yfVxuICAgKi9cbiAgc2V0QmVoYXZpb3IoYmVoYXZpb3IpIHtcbiAgICBiZWhhdmlvci5pbml0aWFsaXplKHRoaXMpO1xuICAgIHRoaXMuX2JlaGF2aW9yID0gYmVoYXZpb3I7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDb250ZXh0IEF0dHJpYnV0ZXMgQWNjZXNzb3JzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqICBVc2UgYW4gZXh0ZXJuYWwgb2JqIHRvIHVzZSBhcyB0aGUgYGNvbnRleHRBdHRyaWJ1dGVgIHdyYXBwZXJcbiAgICogIEBwYXJhbSBvYmoge09iamVjdH1cbiAgICovXG4gIHNldCBjb250ZXh0QXR0cmlidXRlcyhvYmopIHsgdGhpcy5fY29udGV4dEF0dHJpYnV0ZXMgPSBvYmo7IH1cbiAgZ2V0IGNvbnRleHRBdHRyaWJ1dGVzKCkgeyByZXR1cm4gdGhpcy5fY29udGV4dEF0dHJpYnV0ZXM7IH1cblxuICAvKipcbiAgICogIHVwZGF0ZSBhIGdpdmVuIGF0dHJpYnV0ZSBvZiB0aGUgY29udGV4dFxuICAgKiAgQHBhcmFtIG5hbWUge1N0cmluZ30gdGhlIGtleSBvZiB0aGUgYXR0cmlidXRlIHRvIHVwZGF0ZVxuICAgKiAgQHBhcmFtIHZhbHVlIHttaXhlZH1cbiAgICovXG4gIHNldENvbnRleHRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzLl9jb250ZXh0QXR0cmlidXRlc1tuYW1lXSA9IHZhbHVlO1xuICAgIHRoaXMuX2NvbnRleHRbbmFtZV0gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlIHRoZSB2YWx1ZXMgaW4gYF9yZW5kZXJpbmdDb250ZXh0YFxuICAgKiAgaXMgcGFydGljdWxhcnkgbmVlZGVkIHdoZW4gdXBkYXRpbmcgYHN0cmV0Y2hSYXRpb2AgYXMgdGhlIHBvaW50ZXJcbiAgICogIHRvIHRoZSBgeFNjYWxlYCBtYXkgY2hhbmdlXG4gICAqL1xuICBfdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpIHtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnhTY2FsZSA9IHRoaXMuX2NvbnRleHQueFNjYWxlLFxuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQueVNjYWxlID0gdGhpcy5feVNjYWxlLFxuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQuaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBCZWhhdmlvciBBY2Nlc3NvcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIEJlaGF2aW9yIGVudHJ5IHBvaW50c1xuICAgKiAgQE5PVEUgQVBJIC0+IGNoYW5nZSBmb3IgYW4gQXJyYXkgYXMgZmlyc3QgYXJndW1lbnRcbiAgICogIEBUT0RPICAgICAtPiBoYW5kbGUgaWYgbm8gYmVoYXZpb3IgaXMgcmVnaXN0ZXJlZFxuICAgKi9cbiAgZ2V0IHNlbGVjdGVkSXRlbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2JlaGF2aW9yID8gdGhpcy5fYmVoYXZpb3Iuc2VsZWN0ZWRJdGVtcyA6IFtdO1xuICB9XG5cbiAgc2VsZWN0KGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcsKgfHzCoCFpdGVtcykgeyByZXR1cm47IH1cbiAgICBpdGVtcyA9IEFycmF5LmlzQXJyYXkoaXRlbXMpID8gaXRlbXMgOiBbaXRlbXNdO1xuXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgZGF0dW0gPSBkMy5zZWxlY3QoaXRlbSkuZGF0dW0oKTtcbiAgICAgIHRoaXMuX2JlaGF2aW9yLnNlbGVjdChpdGVtLCBkYXR1bSk7XG4gICAgICB0aGlzLl90b0Zyb250KGl0ZW0pO1xuICAgIH0pO1xuICB9XG5cbiAgdW5zZWxlY3QoaXRlbXMpIHtcbiAgICBpZiAoIXRoaXMuX2JlaGF2aW9ywqB8fMKgIWl0ZW1zKSB7IHJldHVybjsgfVxuICAgIGl0ZW1zID0gQXJyYXkuaXNBcnJheShpdGVtcykgPyBpdGVtcyA6IFtpdGVtc107XG5cbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBkYXR1bSA9IGQzLnNlbGVjdChpdGVtKS5kYXR1bSgpO1xuICAgICAgdGhpcy5fYmVoYXZpb3IudW5zZWxlY3QoaXRlbSwgZGF0dW0pO1xuICAgIH0pO1xuICB9XG5cbiAgc2VsZWN0QWxsKCkge1xuICAgIHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4gdGhpcy5zZWxlY3QoaXRlbSkpO1xuICB9XG5cbiAgdW5zZWxlY3RBbGwoKSB7XG4gICAgdGhpcy5zZWxlY3RlZEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHRoaXMudW5zZWxlY3QoaXRlbSkpO1xuICB9XG5cbiAgdG9nZ2xlU2VsZWN0aW9uKGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcsKgfHzCoCFpdGVtcykgeyByZXR1cm47IH1cbiAgICBpdGVtcyA9IEFycmF5LmlzQXJyYXkoaXRlbXMpID8gaXRlbXMgOiBbaXRlbXNdO1xuXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgZGF0dW0gPSBkMy5zZWxlY3QoaXRlbSkuZGF0dW0oKTtcbiAgICAgIHRoaXMuX2JlaGF2aW9yLnRvZ2dsZVNlbGVjdGlvbihpdGVtLCBkYXR1bSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBAVE9ETyBjaGFuZ2Ugc2lnbmF0dXJlIGVkaXQoaXRlbXMgPSBbLi4uXSwgZHgsIGR5LCB0YXJnZXQpO1xuICAvLyAtPiBiZSBjb25zaXN0ZW50IGZvciBhbGwgYmVoYXZpb3JzIEFQSVxuICBlZGl0KGl0ZW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgY29uc3QgZGF0dW0gPSBkMy5zZWxlY3QoaXRlbSkuZGF0dW0oKTtcbiAgICBjb25zdCBzaGFwZSA9IHRoaXMuX2l0ZW1TaGFwZU1hcC5nZXQoaXRlbSk7XG4gICAgdGhpcy5fYmVoYXZpb3IuZWRpdCh0aGlzLl9yZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbnRleHQgQmVoYXZpb3JcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIGRyYXcgdGhlIHNoYXBlIHRvIGludGVyYWN0IHdpdGggdGhlIGNvbnRleHRcbiAgICogIEBwYXJhbXMgYm9vbCB7Qm9vbGVhbn0gZGVmaW5lIGlmIHRoZSBsYXllcidzIGNvbnRleHQgaXMgZWRpdGFibGUgb3Igbm90XG4gICAqL1xuICBzZXQgZWRpdGFibGUoYm9vbCA9IGZhbHNlKSB7XG4gICAgY29uc3QgZGlzcGxheSA9IGJvb2wgPyAnYmxvY2snIDogJ25vbmUnO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zR3JvdXAuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXk7XG4gICAgdGhpcy5faXNDb250ZXh0RWRpdGFibGUgPSBib29sO1xuICB9XG5cbiAgLy8gQE5PVEUgY3JlYXRlIGEgcHJvcGVyIGBDb250ZXh0QmVoYXZpb3JgID9cbiAgZWRpdENvbnRleHQoZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCBjb250ZXh0QXR0cmlidXRlcyA9IHRoaXMuX2NvbnRleHRBdHRyaWJ1dGVzO1xuICAgIGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgID0gdGhpcy5fcmVuZGVyaW5nQ29udGV4dDtcbiAgICAvLyBkeCA9IGR4ICogY29udGV4dEF0dHJpYnV0ZXMuc3RyZXRjaFJhdGlvO1xuICAgIC8vIGR5ID0gZHkgKiBjb250ZXh0QXR0cmlidXRlcy5zdHJldGNoUmF0aW87XG5cbiAgICBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnaGFuZGxlcicpICYmIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2xlZnQnKSkge1xuICAgICAgLy8gZWRpdCBgY29udGV4dC5zdGFydGAsIGBjb250ZXh0Lm9mZnNldGAgYW5kIGBjb250ZXh0LmR1cmF0aW9uYFxuICAgICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQueFNjYWxlKGNvbnRleHRBdHRyaWJ1dGVzLnN0YXJ0KTtcbiAgICAgIGNvbnN0IG9mZnNldCA9IHJlbmRlcmluZ0NvbnRleHQueFNjYWxlKGNvbnRleHRBdHRyaWJ1dGVzLm9mZnNldCk7XG4gICAgICBjb25zdCB3aWR0aCA9IHJlbmRlcmluZ0NvbnRleHQueFNjYWxlKGNvbnRleHRBdHRyaWJ1dGVzLmR1cmF0aW9uKTtcblxuICAgICAgbGV0IHRhcmdldFggPSB4ICsgZHg7XG4gICAgICBsZXQgdGFyZ2V0T2Zmc2V0ID0gb2Zmc2V0IC0gZHg7XG4gICAgICBsZXQgdGFyZ2V0V2lkdGggPSB3aWR0aCAtIGR4O1xuXG4gICAgICB0aGlzLnNldENvbnRleHRBdHRyaWJ1dGUoJ3N0YXJ0JywgcmVuZGVyaW5nQ29udGV4dC54U2NhbGUuaW52ZXJ0KHRhcmdldFgpKTtcbiAgICAgIHRoaXMuc2V0Q29udGV4dEF0dHJpYnV0ZSgnb2Zmc2V0JywgcmVuZGVyaW5nQ29udGV4dC54U2NhbGUuaW52ZXJ0KHRhcmdldE9mZnNldCkpO1xuICAgICAgdGhpcy5zZXRDb250ZXh0QXR0cmlidXRlKCdkdXJhdGlvbicsIHJlbmRlcmluZ0NvbnRleHQueFNjYWxlLmludmVydCh0YXJnZXRXaWR0aCkpO1xuXG4gICAgfSBlbHNlIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoYW5kbGVyJykgJiYgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygncmlnaHQnKSkge1xuICAgICAgLy8gZWRpdCBgY29udGV4dC5kdXJhdGlvbmBcbiAgICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC54U2NhbGUoY29udGV4dEF0dHJpYnV0ZXMuZHVyYXRpb24pO1xuICAgICAgbGV0IHRhcmdldFdpZHRoID0gTWF0aC5tYXgod2lkdGggKyBkeCwgMCk7XG5cbiAgICAgIHRoaXMuc2V0Q29udGV4dEF0dHJpYnV0ZSgnZHVyYXRpb24nLCByZW5kZXJpbmdDb250ZXh0LnhTY2FsZS5pbnZlcnQodGFyZ2V0V2lkdGgpKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBlZGl0IGBjb250ZXh0LnN0YXJ0YFxuICAgICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQueFNjYWxlKGNvbnRleHRBdHRyaWJ1dGVzLnN0YXJ0KTtcbiAgICAgIGxldCB0YXJnZXRYID0gTWF0aC5tYXgoeCArIGR4LCAwKTtcblxuICAgICAgdGhpcy5zZXRDb250ZXh0QXR0cmlidXRlKCdzdGFydCcsIHJlbmRlcmluZ0NvbnRleHQueFNjYWxlLmludmVydCh0YXJnZXRYKSk7XG4gICAgfVxuICB9XG5cbiAgc3RyZXRjaENvbnRleHQoZHgsIGR5LCB0YXJnZXQpIHt9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSGVscGVyc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiAgQE5PVEUgaXMgb25seSB1c2VkIG9uIGBoYXNJdGVtYCA9PiBubyBuZWVkIHRvIHNlcGFyYXRlIHRoaXMgbWV0aG9kXG4gICAqICBAcmV0dXJuIHtET01FbGVtZW50fSB0aGUgY2xvc2VzdCBwYXJlbnQgYGl0ZW1gIGdyb3VwIGZvciBhIGdpdmVuIERPTSBlbGVtZW50XG4gICAqL1xuICBfZ2V0SXRlbUZyb21ET01FbGVtZW50KGVsKSB7XG4gICAgZG8ge1xuICAgICAgaWYgKGVsLm5vZGVOYW1lID09PSAnZycgJiYgZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdpdGVtJykpIHtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKGVsID0gZWwucGFyZW50Tm9kZSk7XG4gIH1cblxuICAvKipcbiAgICogIG1vdmVzIGFuIGBpdGVtYCdzIGdyb3VwIHRvIHRoZSBlbmQgb2YgdGhlIGxheWVyIChzdmcgei1pbmRleC4uLilcbiAgICogIEBwYXJhbSBgaXRlbWAge0RPTUVsZW1lbnR9IHRoZSBpdGVtIHRvIGJlIG1vdmVkXG4gICAqL1xuICBfdG9Gcm9udChpdGVtKSB7XG4gICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZChpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRGVmaW5lIGlmIGFuIGdpdmVuIERPTSBlbGVtZW50IGJlbG9uZ3MgdG8gb25lIG9mIHRoZSBgaXRlbXNgXG4gICAqICBAcGFyYW0gYGVsYCB7RE9NRWxlbWVudH0gdGhlIGVsZW1lbnQgdG8gYmUgdGVzdGVkXG4gICAqICBAcmV0dXJuIHttaXhlZH1cbiAgICogICAge0RPTUVsZW1lbnR9IGl0ZW0gZ3JvdXAgY29udGFpbmluZyB0aGUgYGVsYCBpZiBiZWxvbmdzIHRvIHRoaXMgbGF5ZXJcbiAgICogICAgbnVsbCBvdGhlcndpc2VcbiAgICovXG4gIGhhc0l0ZW0oZWwpIHtcbiAgICBjb25zdCBpdGVtID0gdGhpcy5fZ2V0SXRlbUZyb21ET01FbGVtZW50KGVsKTtcbiAgICByZXR1cm4gKHRoaXMuaXRlbXNbMF0uaW5kZXhPZihpdGVtKSAhPT0gLTEpID8gaXRlbSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogIERlZmluZSBpZiBhIGdpdmVuIGVsZW1lbnQgYmVsb25ncyB0byB0aGUgbGF5ZXJcbiAgICogIGlzIG1vcmUgZ2VuZXJhbCB0aGFuIGBoYXNJdGVtYCwgY2FuIGJlIHVzZWQgdG8gY2hlY2sgaW50ZXJhY3Rpb24gZWxlbWVudHMgdG9vXG4gICAqL1xuICBoYXNFbGVtZW50KGVsKSB7XG4gICAgZG8ge1xuICAgICAgaWYgKGVsID09PSB0aGlzLmNvbnRhaW5lcikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IHdoaWxlIChlbCA9IGVsLnBhcmVudE5vZGUpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqICBAcGFyYW0gYXJlYSB7T2JqZWN0fSBhcmVhIGluIHdoaWNoIHRvIGZpbmQgdGhlIGVsZW1lbnRzXG4gICAqICBAcmV0dXJuIHtBcnJheX0gbGlzdCBvZiB0aGUgRE9NIGVsZW1lbnRzIGluIHRoZSBnaXZlbiBhcmVhXG4gICAqL1xuICBnZXRJdGVtc0luQXJlYShhcmVhKSB7XG4gICAgLy8gd29yayBpbiBwaXhlbCBkb21haW5cbiAgICBjb25zdCBzdGFydCAgICA9IHRoaXMuX2NvbnRleHQueFNjYWxlKHRoaXMuX2NvbnRleHQuc3RhcnQpO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5fY29udGV4dC54U2NhbGUodGhpcy5fY29udGV4dC5kdXJhdGlvbik7XG4gICAgY29uc3Qgb2Zmc2V0ICAgPSB0aGlzLl9jb250ZXh0LnhTY2FsZSh0aGlzLl9jb250ZXh0Lm9mZnNldCk7XG4gICAgY29uc3QgdG9wICAgICAgPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgLy8gbXVzdCBiZSBhd2FyZSBvZiB0aGUgbGF5ZXIncyBjb250ZXh0IG1vZGlmaWNhdGlvbnNcbiAgICAvLyBjb25zdHJhaW4gaW4gd29ya2luZyB2aWV3XG4gICAgbGV0IHgxID0gTWF0aC5tYXgoYXJlYS5sZWZ0LCBzdGFydCk7XG4gICAgbGV0IHgyID0gTWF0aC5taW4oYXJlYS5sZWZ0ICsgYXJlYS53aWR0aCwgc3RhcnQgKyBkdXJhdGlvbik7XG4gICAgLy8gYXBwbHkgc3RhcnQgYW5kIG9mZnNldFxuICAgIHgxIC09IChzdGFydCArIG9mZnNldCk7XG4gICAgeDIgLT0gKHN0YXJ0ICsgb2Zmc2V0KTtcbiAgICAvLyBiZSBjb25zaXN0ZW50IHdpdGggY29udGV4dCB5IGNvb3JkaW5hdGVzIHN5c3RlbVxuICAgIGxldCB5MSA9IHRoaXMucGFyYW1zLmhlaWdodCAtIChhcmVhLnRvcCArIGFyZWEuaGVpZ2h0KTtcbiAgICBsZXQgeTIgPSB0aGlzLnBhcmFtcy5oZWlnaHQgLSBhcmVhLnRvcDtcblxuICAgIHkxICs9IHRoaXMucGFyYW1zLnRvcDtcbiAgICB5MiArPSB0aGlzLnBhcmFtcy50b3A7XG5cbiAgICBjb25zdCBpdGVtU2hhcGVNYXAgPSB0aGlzLl9pdGVtU2hhcGVNYXA7XG4gICAgY29uc3QgcmVuZGVyaW5nQ29udGV4dCA9IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQ7XG5cbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuaXRlbXMuZmlsdGVyKGZ1bmN0aW9uKGRhdHVtLCBpbmRleCkge1xuICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzO1xuICAgICAgY29uc3Qgc2hhcGUgPSBpdGVtU2hhcGVNYXAuZ2V0KGdyb3VwKTtcbiAgICAgIHJldHVybiBzaGFwZS5pbkFyZWEocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBpdGVtc1swXS5zbGljZSgwKTtcbiAgfVxuXG4gIC8vIGhlbHBlciB0byBhZGQgc29tZSBjbGFzcyBvciBzdHVmZiBvbiBpdGVtc1xuICAvLyBlYWNoKGNhbGxiYWNrKSB7IHRoaXMuX2VhY2ggPSBjYWxsYmFjayB9XG5cbiAgLyoqXG4gICAqICByZW5kZXIgdGhlIERPTSBpbiBtZW1vcnkgb24gbGF5ZXIgY3JlYXRpb24gdG8gYmUgYWJsZSB0byB1c2UgaXQgYmVmb3JlXG4gICAqICB0aGUgbGF5ZXIgaXMgYWN0dWFsbHkgaW5zZXJ0ZWQgaW4gdGhlIERPTVxuICAgKi9cbiAgX3JlbmRlcigpIHtcbiAgICAvLyB3cmFwcGVyIGdyb3VwIGZvciBgc3RhcnQsIHRvcCBhbmQgY29udGV4dCBmbGlwIG1hdHJpeFxuICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2xheWVyJyk7XG4gICAgLy8gYXBwZW5kIGEgc3ZnIHRvIGNsaXAgdGhlIGNvbnRleHRcbiAgICAvLyBATk9URTogY291bGQgdXNlIGEgZ3JvdXAgd2l0aCBhIGBjbGlwUGF0aGAgcHJvcGVydHlcbiAgICB0aGlzLmJvdW5kaW5nQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnc3ZnJyk7XG4gICAgdGhpcy5ib3VuZGluZ0JveC5jbGFzc0xpc3QuYWRkKCdib3VuZGluZy1ib3gnKTtcbiAgICAvLyB0aGlzLmJvdW5kaW5nQm94LnNldEF0dHJpYnV0ZU5TKG51bGwsICdpZCcsIHRoaXMucGFyYW1zLmlkKTtcbiAgICAvLyBncm91cCB0byBhcHBseSBvZmZzZXRcbiAgICB0aGlzLmdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuZ3JvdXAuY2xhc3NMaXN0LmFkZCgnb2Zmc2V0JywgJ2l0ZW1zJyk7XG5cbiAgICAvLyBjb250ZXh0IGludGVyYWN0aW9uc1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy5pbnRlcmFjdGlvbnNHcm91cC5jbGFzc0xpc3QuYWRkKCdsYXllci1pbnRlcmFjdGlvbnMnKTtcbiAgICB0aGlzLmludGVyYWN0aW9uc0dyb3VwLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgLy8gQE5PVEU6IHdvcmtzIGJ1dCBraW5nIG9mIHVnbHkuLi4gbXVzdCBiZSBjbGVhbmVkXG4gICAgdGhpcy5jb250ZXh0U2hhcGUgPSBuZXcgUmVjdCgpO1xuICAgIHRoaXMuY29udGV4dFNoYXBlLmluc3RhbGwoe1xuICAgICAgb3BhY2l0eTogKCkgPT4gMC4xLFxuICAgICAgY29sb3IgIDogKCkgPT4gJyM3ODc4NzgnLFxuICAgICAgd2lkdGggIDogKCkgPT4gdGhpcy5fY29udGV4dEF0dHJpYnV0ZXMuZHVyYXRpb24sXG4gICAgICBoZWlnaHQgOiAoKSA9PiB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnlTY2FsZS5kb21haW4oKVsxXSxcbiAgICAgIHkgICAgICA6ICgpID0+IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQueVNjYWxlLmRvbWFpbigpWzBdXG4gICAgfSk7XG5cbiAgICB0aGlzLmludGVyYWN0aW9uc0dyb3VwLmFwcGVuZENoaWxkKHRoaXMuY29udGV4dFNoYXBlLnJlbmRlcigpKTtcblxuICAgIC8vIGNyZWF0ZSB0aGUgRE9NIHRyZWVcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmJvdW5kaW5nQm94KTtcbiAgICB0aGlzLmJvdW5kaW5nQm94LmFwcGVuZENoaWxkKHRoaXMuaW50ZXJhY3Rpb25zR3JvdXApO1xuICAgIHRoaXMuYm91bmRpbmdCb3guYXBwZW5kQ2hpbGQodGhpcy5ncm91cCk7XG5cbiAgICAvLyBkcmF3IGEgcmVjdCBpbiBjb250ZXh0IGJhY2tncm91bmQgdG8gZGVidWcgaXQncyBzaXplXG4gICAgaWYgKHRoaXMucGFyYW1zLmRlYnVnKSB7XG4gICAgICB0aGlzLmRlYnVnUmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICAgIHRoaXMuYm91bmRpbmdCb3guYXBwZW5kQ2hpbGQodGhpcy5kZWJ1Z1JlY3QpO1xuICAgICAgdGhpcy5kZWJ1Z1JlY3Quc3R5bGUuZmlsbCA9ICcjYWJhYmFiJztcbiAgICAgIHRoaXMuZGVidWdSZWN0LnN0eWxlLmZpbGxPcGFjaXR5ID0gMC4xO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgY3JlYXRlcyB0aGUgbGF5ZXIgZ3JvdXAgd2l0aCBhIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCB0byBmbGlwIHRoZSBjb29yZGluYXRlIHN5c3RlbS5cbiAgICogIEByZXR1cm4ge0RPTUVsZW1lbnR9XG4gICAqL1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSB0aGUgRE9NIGFjY29yZGluZyB0byBnaXZlbiBkYXRhIGFuZCBzaGFwZXNcbiAgICovXG4gIGRyYXcoKSB7XG4gICAgLy8gQE5PVEU6IGNyZWF0ZSBhIHVuaXF1ZSBpZCB0byBmb3JjZSBkMyB0byBrZWVwIGRhdGEgaW4gc3luYyB3aXRoIHRoZSBET01cbiAgICAvLyBAVE9ETzogcmVhZCBhZ2FpbiBodHRwOi8vYm9zdC5vY2tzLm9yZy9taWtlL3NlbGVjdGlvbi9cbiAgICB0aGlzLmRhdGEuZm9yRWFjaChmdW5jdGlvbihkYXR1bSkge1xuICAgICAgaWYgKF9kYXR1bUlkTWFwLmhhcyhkYXR1bSkpIHsgcmV0dXJuOyB9XG4gICAgICBfZGF0dW1JZE1hcC5zZXQoZGF0dW0sIF9jb3VudGVyKyspO1xuICAgIH0pO1xuXG4gICAgLy8gc2VsZWN0IGl0ZW1zXG4gICAgdGhpcy5pdGVtcyA9IGQzLnNlbGVjdCh0aGlzLmdyb3VwKVxuICAgICAgLnNlbGVjdEFsbCgnLml0ZW0nKVxuICAgICAgLmZpbHRlcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmNsYXNzTGlzdC5jb250YWlucygnY29tbW9uJylcbiAgICAgIH0pXG4gICAgICAuZGF0YSh0aGlzLmRhdGEsIGZ1bmN0aW9uKGRhdHVtKSB7XG4gICAgICAgIHJldHVybiBfZGF0dW1JZE1hcC5nZXQoZGF0dW0pO1xuICAgICAgfSk7XG5cbiAgICAvLyBoYW5kbGUgY29tbW9uU2hhcGVzIC0+IHJlbmRlciBvbmx5IG9uY2VcbiAgICBpZiAoXG4gICAgICB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb24gIT09IG51bGwgJiZcbiAgICAgIHRoaXMuX2l0ZW1Db21tb25TaGFwZU1hcC5zaXplID09PSAwXG4gICAgKSB7XG4gICAgICBjb25zdCB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9ID0gdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uO1xuICAgICAgY29uc3QgZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgICBjb25zdCBzaGFwZSA9IG5ldyBjdG9yKG9wdGlvbnMpO1xuXG4gICAgICBzaGFwZS5pbnN0YWxsKGFjY2Vzc29ycyk7XG4gICAgICBncm91cC5hcHBlbmRDaGlsZChzaGFwZS5yZW5kZXIoKSk7XG4gICAgICBncm91cC5jbGFzc0xpc3QuYWRkKCdpdGVtJywgJ2NvbW1vbicsIHNoYXBlLmdldENsYXNzTmFtZSgpKTtcblxuICAgICAgdGhpcy5faXRlbUNvbW1vblNoYXBlTWFwLnNldChncm91cCwgc2hhcGUpO1xuICAgICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZChncm91cCk7XG4gICAgfVxuXG4gICAgLy8gZW50ZXJcbiAgICB0aGlzLml0ZW1zLmVudGVyKClcbiAgICAgIC5hcHBlbmQoKGRhdHVtLCBpbmRleCkgPT4ge1xuICAgICAgICAvLyBATk9URTogZDMgYmluZHMgYHRoaXNgIHRvIHRoZSBjb250YWluZXIgZ3JvdXBcbiAgICAgICAgLy8gY3JlYXRlIGEgZ3JvdXAgZm9yIHRoZSBpdGVtXG4gICAgICAgIGNvbnN0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICAgICBjb25zdCB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9ID0gdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uO1xuICAgICAgICBjb25zdCBzaGFwZSA9IG5ldyBjdG9yKG9wdGlvbnMpO1xuICAgICAgICAvLyBpbnN0YWxsIGFjY2Vzc29ycyBvbiB0aGUgbmV3bHkgY3JlYXRlZCBzaGFwZVxuICAgICAgICBzaGFwZS5pbnN0YWxsKGFjY2Vzc29ycyk7XG5cbiAgICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQoc2hhcGUucmVuZGVyKHRoaXMuX3JlbmRlcmluZ0NvbnRleHQpKTtcbiAgICAgICAgZ3JvdXAuY2xhc3NMaXN0LmFkZCgnaXRlbScsIHNoYXBlLmdldENsYXNzTmFtZSgpKTtcblxuICAgICAgICB0aGlzLl9pdGVtU2hhcGVNYXAuc2V0KGdyb3VwLCBzaGFwZSk7XG5cbiAgICAgICAgcmV0dXJuIGdyb3VwO1xuICAgICAgfSk7XG5cbiAgICAvLyBleGl0XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG5cbiAgICB0aGlzLml0ZW1zLmV4aXQoKVxuICAgICAgLmVhY2goZnVuY3Rpb24oZGF0dW0sIGluZGV4KSB7XG4gICAgICAgIGNvbnN0IGdyb3VwID0gdGhpcztcbiAgICAgICAgY29uc3Qgc2hhcGUgPSB0aGF0Ll9pdGVtU2hhcGVNYXAuZ2V0KGdyb3VwKTtcblxuICAgICAgICBzaGFwZS5kZXN0cm95KCk7ICAgICAgICAgICAgICAgICAgLy8gY2xlYW4gc2hhcGVcbiAgICAgICAgX2RhdHVtSWRNYXAuZGVsZXRlKGRhdHVtKTsgICAgICAgIC8vIGNsZWFuIHJlZmVyZW5jZSBpbiBgaWRgIG1hcFxuICAgICAgICB0aGF0Ll9pdGVtU2hhcGVNYXAuZGVsZXRlKGdyb3VwKTsgLy8gZGVzdHJveSByZWZlcmVuY2UgaW4gaXRlbSBzaGFwZSBtYXBcbiAgICAgIH0pXG4gICAgICAucmVtb3ZlKCk7XG4gIH1cblxuICAvKipcbiAgICogIHVwZGF0ZXMgQ29udGV4dCBhbmQgU2hhcGVzXG4gICAqL1xuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpO1xuXG4gICAgdGhpcy51cGRhdGVDb250ZXh0KCk7XG4gICAgdGhpcy51cGRhdGVTaGFwZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlcyB0aGUgY29udGV4dCBvZiB0aGUgbGF5ZXJcbiAgICovXG4gIHVwZGF0ZUNvbnRleHQoKSB7XG4gICAgLy8gQE5PVEU6IHJlcGxhY2VkIGBjb250ZXh0Lm9yaWdpbmFsWFNjYWxlYCB3aXRoIGBjb250ZXh0Ll9wYXJlbnQueFNjYWxlYFxuICAgIC8vID0+IGxvb2tzIG1vcmUgY29oZXJlbnQsIGJ1dCBiZWhhdmlvciBuZWVkcyB0byBiZSBjaGVja2VkLCB2YWxpZGF0ZWQgYW5kIHRlc3RlZCBwcm9wZXJseVxuICAgIGNvbnN0IHggICAgICA9IHRoaXMuX2NvbnRleHQuX3BhcmVudC54U2NhbGUodGhpcy5fY29udGV4dC5zdGFydCk7XG4gICAgY29uc3Qgd2lkdGggID0gdGhpcy5fY29udGV4dC54U2NhbGUodGhpcy5fY29udGV4dC5kdXJhdGlvbik7XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGhpcy5fY29udGV4dC54U2NhbGUodGhpcy5fY29udGV4dC5vZmZzZXQpO1xuICAgIGNvbnN0IHRvcCAgICA9IHRoaXMucGFyYW1zLnRvcDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgLy8gbWF0cml4IHRvIGludmVydCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICBjb25zdCB0cmFuc2xhdGVNYXRyaXggPSBgbWF0cml4KDEsIDAsIDAsIC0xLCAke3h9LCAke3RvcCArIGhlaWdodH0pYDtcblxuICAgIHRoaXMuY29udGFpbmVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGVNYXRyaXgpO1xuXG4gICAgLy8gY29uc3QgY2xpcFBhdGggPSBgcG9seWdvbigwIDAsICR7d2lkdGh9cHggMCwgJHt3aWR0aH1weCAke2hlaWdodH1weCwgMCAke2hlaWdodH1weClgO1xuICAgIC8vIC13ZWJraXQtY2xpcC1wYXRoOiBwb2x5Z29uKDAgMCwgNzQwcHggMCwgNzQwcHggMTYwcHgsIDAgMTYwcHgpO1xuICAgIC8vIHRoaXMuYm91bmRpbmdCb3guc3R5bGUud2Via2l0Q2xpcFBhdGggPSBjbGlwUGF0aDtcbiAgICB0aGlzLmJvdW5kaW5nQm94LnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHdpZHRoKTtcbiAgICB0aGlzLmJvdW5kaW5nQm94LnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgIHRoaXMuYm91bmRpbmdCb3guc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG5cbiAgICB0aGlzLmdyb3VwLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7b2Zmc2V0fSwgMClgKTtcblxuICAgIC8vIG1haW50YWluIGNvbnRleHQgc2hhcGVcbiAgICB0aGlzLmNvbnRleHRTaGFwZS51cGRhdGUoXG4gICAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LFxuICAgICAgdGhpcy5pbnRlcmFjdGlvbnNHcm91cCxcbiAgICAgIHRoaXMuX2NvbnRleHRBdHRyaWJ1dGVzLFxuICAgICAgMFxuICAgICk7XG5cbiAgICAvLyBkZWJ1ZyBjb250ZXh0XG4gICAgaWYgKHRoaXMucGFyYW1zLmRlYnVnKSB7XG4gICAgICB0aGlzLmRlYnVnUmVjdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgICB0aGlzLmRlYnVnUmVjdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIHVwZGF0ZXMgdGhlIFNoYXBlcyB3aGljaCBiZWxvbmdzIHRvIHRoZSBsYXllclxuICAgKiAgQHBhcmFtIGl0ZW0ge0RPTUVsZW1lbnR9XG4gICAqL1xuICB1cGRhdGVTaGFwZXMoaXRlbSA9IG51bGwpIHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICBjb25zdCByZW5kZXJpbmdDb250ZXh0ID0gdGhpcy5fcmVuZGVyaW5nQ29udGV4dDtcbiAgICBjb25zdCBpdGVtcyA9IGl0ZW0gIT09IG51bGwgPyBkMy5zZWxlY3RBbGwoaXRlbSkgOiB0aGlzLml0ZW1zO1xuXG4gICAgLy8gdXBkYXRlIGNvbW1vbiBzaGFwZXNcbiAgICB0aGlzLl9pdGVtQ29tbW9uU2hhcGVNYXAuZm9yRWFjaCgoc2hhcGUsIGl0ZW0pID0+IHtcbiAgICAgIHNoYXBlLnVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBpdGVtLCB0aGlzLmRhdGEpO1xuICAgIH0pO1xuXG4gICAgLy8gdXBkYXRlIGVudGl0eSBvciBjb2xsZWN0aW9uIHNoYXBlc1xuICAgIGlmICghaXRlbXMpIHsgcmV0dXJuOyB9IC8vIGlmIG5vIHNoYXBlIGluIHRoZSBsYXllci4uLlxuICAgIGl0ZW1zLmVhY2goZnVuY3Rpb24oZGF0dW0sIGluZGV4KSB7XG4gICAgICAvLyB1cGRhdGUgYWxsIHNoYXBlcyByZWxhdGVkIHRvIHRoZSBjdXJyZW50IGl0ZW1cbiAgICAgIGNvbnN0IGdyb3VwID0gdGhpczsgLy8gY3VycmVudCBgZy5pdGVtYFxuICAgICAgY29uc3Qgc2hhcGUgPSB0aGF0Ll9pdGVtU2hhcGVNYXAuZ2V0KGdyb3VwKTtcbiAgICAgIHNoYXBlLnVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBncm91cCwgZGF0dW0sIGluZGV4KTtcbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExheWVyO1xuIl19