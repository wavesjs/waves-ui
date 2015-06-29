"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var ns = require("./namespace");
var d3Scale = require("d3-scale");
var d3Selection = require("d3-selection");
var Segment = require("../shapes/segment");
var SegmentBehavior = require("../behaviors/segment-behavior");
var events = require("events");

// create a private item -> id map
// in order to force d3 keeping in sync with the DOM
var _counter = 0;
var _datumIdMap = new _core.Map();

var Layer = (function (_events$EventEmitter) {
  function Layer(dataType, data) {
    var options = arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, Layer);

    _get(_core.Object.getPrototypeOf(Layer.prototype), "constructor", this).call(this);
    this.dataType = dataType; // 'entity' || 'collection';
    this.data = data;

    var defaults = {
      height: 100,
      top: 0,
      id: "",
      yDomain: [0, 1],
      opacity: 1,
      debugContext: false, // pass the context in debug mode
      contextHandlerWidth: 2
    };

    this.params = _core.Object.assign({}, defaults, options);
    this.timeContext = null;

    this.container = null; // offset group of the parent context
    this.group = null; // group created by the layer inside the context
    this.items = null; // d3 collection of the layer items

    this._shapeConfiguration = null; // { ctor, accessors, options }
    this._commonShapeConfiguration = null; // { ctor, accessors, options }

    this._itemShapeMap = new _core.Map(); // item group <DOMElement> => shape
    this._itemCommonShapeMap = new _core.Map(); // one entry max in this map

    this._isContextEditable = false;
    this._behavior = null;

    this._yScale = d3Scale.linear().domain(this.params.yDomain).range([0, this.params.height]);

    // initialize timeContext layout
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
    setTimeContext: {

      /**
       *  @mandatory define the context in which the layer is drawn
       *  @param context {TimeContext} the timeContext in which the layer is displayed
       */

      value: function setTimeContext(timeContext) {
        this.timeContext = timeContext;
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
       *  Register the behavior to use when interacting with the shape
       *  @param behavior {BaseBehavior}
       */

      value: function setBehavior(behavior) {
        behavior.initialize(this);
        this._behavior = behavior;
      }
    },
    _updateRenderingContext: {

      /**
       *  update the values in `_renderingContext`
       *  is particulary needed when updating `stretchRatio` as the pointer
       *  to the `xScale` may change
       */

      value: function _updateRenderingContext() {
        this._renderingContext.xScale = this.timeContext.xScale;
        this._renderingContext.yScale = this._yScale;
        this._renderingContext.height = this.params.height;
        this._renderingContext.width = this.timeContext.xScale(this.timeContext.duration);
        // for foreign oject issue in chrome
        this._renderingContext.offsetX = this.timeContext.xScale(this.timeContext.offset);
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
        var timeContext = this.timeContext;
        var renderingContext = this._renderingContext;
        // edit `context.start`, `context.offset` and `context.duration`
        var x = renderingContext.xScale(timeContext.start);
        var offset = renderingContext.xScale(timeContext.offset);
        var width = renderingContext.xScale(timeContext.duration);

        var targetX = x + dx;
        var targetOffset = offset - dx;
        var targetWidth = Math.max(width - dx, 0);

        this.timeContext.start = renderingContext.xScale.invert(targetX);
        this.timeContext.offset = renderingContext.xScale.invert(targetOffset);
        this.timeContext.duration = renderingContext.xScale.invert(targetWidth);
      }
    },
    _editContextRight: {
      value: function _editContextRight(dx) {
        var timeContext = this.timeContext;
        var renderingContext = this._renderingContext;
        // edit `context.duration`
        var width = renderingContext.xScale(timeContext.duration);
        var targetWidth = Math.max(width + dx, 0);

        this.timeContext.duration = renderingContext.xScale.invert(targetWidth);
      }
    },
    _moveContext: {
      value: function _moveContext(dx) {
        var timeContext = this.timeContext;
        var renderingContext = this._renderingContext;
        // edit `context.start`
        var x = renderingContext.xScale(timeContext.start);
        var targetX = Math.max(x + dx, 0);

        this.timeContext.start = renderingContext.xScale.invert(targetX);
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
          if (el.classList && el.classList.contains("item")) {
            return el;
          }
          el = el.parentNode;
        } while (el != undefined);
      }
    },
    hasItem: {

      /**
       *  @NOTE bad method name !!!
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
    _toFront: {

      /**
       *  moves an `item`'s group to the end of the layer (svg z-index...)
       *  @param `item` {DOMElement} the item to be moved
       */

      value: function _toFront(item) {
        this.group.appendChild(item);
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
        var start = this.timeContext.xScale(this.timeContext.start);
        var duration = this.timeContext.xScale(this.timeContext.duration);
        var offset = this.timeContext.xScale(this.timeContext.offset);
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

      // --------------------------------------
      // Rendering / Display methods
      // --------------------------------------

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
        this.contextShape = new Segment();
        this.contextShape.install({
          opacity: function () {
            return 0.1;
          },
          color: function () {
            return "#787878";
          },
          width: function () {
            return _this.timeContext.duration;
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

        // draw a Segment in context background to debug it's size
        if (this.params.debug) {
          this.debugRect = document.createElementNS(ns, "Segment");
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

        // create a unique id to force d3 to keep data in sync with the DOM
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
          var _shapeConfiguration = _this._shapeConfiguration;
          var ctor = _shapeConfiguration.ctor;
          var accessors = _shapeConfiguration.accessors;
          var options = _shapeConfiguration.options;

          var shape = new ctor(options);
          shape.install(accessors);

          var item = shape.render(_this._renderingContext);
          item.classList.add("item", shape.getClassName());
          _this._itemShapeMap.set(item, shape);

          return item;
        });

        // exit
        var _itemShapeMap = this._itemShapeMap;

        this.items.exit().each(function (datum, index) {
          var item = this;
          var shape = _itemShapeMap.get(item);
          // clean all shape/item references
          shape.destroy();
          _datumIdMap["delete"](datum);
          _itemShapeMap["delete"](item);
        }).remove();
      }
    },
    update: {

      /**
       *  updates Context and Shapes
       */

      value: function update() {
        this._updateRenderingContext();

        this.updateContainer();
        this.updateShapes();
      }
    },
    updateContainer: {

      /**
       *  updates the context of the layer
       */

      value: function updateContainer() {
        var x = this.timeContext.xScale(this.timeContext.start);
        var width = this.timeContext.xScale(this.timeContext.duration);
        // offset is relative to timeline's timeContext
        var offset = this.timeContext.parent.xScale(this.timeContext.offset);
        var top = this.params.top;
        var height = this.params.height;
        // matrix to invert the coordinate system
        var translateMatrix = "matrix(1, 0, 0, -1, " + x + ", " + (top + height) + ")";

        this.container.setAttributeNS(null, "transform", translateMatrix);

        this.boundingBox.setAttributeNS(null, "width", width);
        this.boundingBox.setAttributeNS(null, "height", height);
        this.boundingBox.style.opacity = this.params.opacity;

        this.group.setAttributeNS(null, "transform", "translate(" + offset + ", 0)");

        // maintain context shape
        this.contextShape.update(this._renderingContext, this.interactionsGroup, this.timeContext, 0);

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
        items.each(function (datum, index) {
          var item = this;
          var shape = that._itemShapeMap.get(item);
          shape.update(renderingContext, item, datum, index);
        });
      }
    }
  });

  return Layer;
})(events.EventEmitter);

module.exports = Layer;
//# sourceMappingURL=data:application/json;base64,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QU0sQ0FBQyxDQUFDO1NBQ3ZEO09BQ0Y7O0FBTUQsZ0JBQVk7Ozs7Ozs7YUFBQSx3QkFBYzs7O1lBQWIsSUFBSSxnQ0FBRyxJQUFJOztBQUN0QixZQUFNLElBQUksR0FBRyxJQUFJLENBQUM7QUFDbEIsWUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7QUFDaEQsWUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLElBQUksR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7OztBQUd2RSxZQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFFLElBQUksRUFBSztBQUNoRCxlQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRSxNQUFLLElBQUksQ0FBQyxDQUFDO1NBQ2pELENBQUMsQ0FBQzs7O0FBR0gsYUFBSyxDQUFDLElBQUksQ0FBQyxVQUFTLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDaEMsY0FBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLGNBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNDLGVBQUssQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNwRCxDQUFDLENBQUM7T0FDSjs7OztTQXBpQkcsS0FBSztHQUFTLE1BQU0sQ0FBQyxZQUFZOztBQXVpQnZDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDIiwiZmlsZSI6ImVzNi9jb3JlL2xheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgbnMgPSByZXF1aXJlKCcuL25hbWVzcGFjZScpO1xuY29uc3QgZDNTY2FsZSA9IHJlcXVpcmUoJ2QzLXNjYWxlJyk7XG5jb25zdCBkM1NlbGVjdGlvbiA9IHJlcXVpcmUoJ2QzLXNlbGVjdGlvbicpO1xuY29uc3QgU2VnbWVudCA9IHJlcXVpcmUoJy4uL3NoYXBlcy9zZWdtZW50Jyk7XG5jb25zdCBTZWdtZW50QmVoYXZpb3IgPSByZXF1aXJlKCcuLi9iZWhhdmlvcnMvc2VnbWVudC1iZWhhdmlvcicpO1xuY29uc3QgZXZlbnRzID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5cbi8vIGNyZWF0ZSBhIHByaXZhdGUgaXRlbSAtPiBpZCBtYXBcbi8vIGluIG9yZGVyIHRvIGZvcmNlIGQzIGtlZXBpbmcgaW4gc3luYyB3aXRoIHRoZSBET01cbmxldCBfY291bnRlciA9IDA7XG5jb25zdCBfZGF0dW1JZE1hcCA9IG5ldyBNYXAoKTtcblxuY2xhc3MgTGF5ZXIgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoZGF0YVR5cGUsIGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5kYXRhVHlwZSA9IGRhdGFUeXBlOyAvLyAnZW50aXR5JyB8fCAnY29sbGVjdGlvbic7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgaGVpZ2h0OiAxMDAsXG4gICAgICB0b3A6IDAsXG4gICAgICBpZDogJycsXG4gICAgICB5RG9tYWluOiBbMCwgMV0sXG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgZGVidWdDb250ZXh0OiBmYWxzZSwgLy8gcGFzcyB0aGUgY29udGV4dCBpbiBkZWJ1ZyBtb2RlXG4gICAgICBjb250ZXh0SGFuZGxlcldpZHRoOiAyXG4gICAgfTtcblxuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIHRoaXMudGltZUNvbnRleHQgPSBudWxsO1xuXG4gICAgdGhpcy5jb250YWluZXIgPSBudWxsOyAvLyBvZmZzZXQgZ3JvdXAgb2YgdGhlIHBhcmVudCBjb250ZXh0XG4gICAgdGhpcy5ncm91cCA9IG51bGw7IC8vIGdyb3VwIGNyZWF0ZWQgYnkgdGhlIGxheWVyIGluc2lkZSB0aGUgY29udGV4dFxuICAgIHRoaXMuaXRlbXMgPSBudWxsOyAvLyBkMyBjb2xsZWN0aW9uIG9mIHRoZSBsYXllciBpdGVtc1xuXG4gICAgdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uID0gbnVsbDsgLy8geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfVxuICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiA9IG51bGw7IC8vIHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH1cblxuICAgIHRoaXMuX2l0ZW1TaGFwZU1hcCA9IG5ldyBNYXAoKTsgLy8gaXRlbSBncm91cCA8RE9NRWxlbWVudD4gPT4gc2hhcGVcbiAgICB0aGlzLl9pdGVtQ29tbW9uU2hhcGVNYXAgPSBuZXcgTWFwKCk7IC8vIG9uZSBlbnRyeSBtYXggaW4gdGhpcyBtYXBcblxuICAgIHRoaXMuX2lzQ29udGV4dEVkaXRhYmxlID0gZmFsc2U7XG4gICAgdGhpcy5fYmVoYXZpb3IgPSBudWxsO1xuXG4gICAgdGhpcy5feVNjYWxlID0gZDNTY2FsZS5saW5lYXIoKVxuICAgICAgLmRvbWFpbih0aGlzLnBhcmFtcy55RG9tYWluKVxuICAgICAgLnJhbmdlKFswLCB0aGlzLnBhcmFtcy5oZWlnaHRdKTtcblxuICAgIC8vIGluaXRpYWxpemUgdGltZUNvbnRleHQgbGF5b3V0XG4gICAgdGhpcy5fcmVuZGVyKCk7XG4gIH1cblxuICBzZXQgeURvbWFpbihkb21haW4pIHtcbiAgICB0aGlzLnBhcmFtcy55RG9tYWluID0gZG9tYWluO1xuICAgIHRoaXMuX3lTY2FsZS5kb21haW4oZG9tYWluKTtcbiAgfVxuXG4gIGdldCB5RG9tYWluKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy55RG9tYWluO1xuICB9XG5cbiAgc2V0IG9wYWNpdHkodmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcy5vcGFjaXR5ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgb3BhY2l0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMub3BhY2l0eTtcbiAgfVxuXG4gIHBhcmFtKG5hbWUsIHZhbHVlKSB7XG4gICAgdGhpcy5wYXJhbXNbbmFtZV0gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgQG1hbmRhdG9yeSBkZWZpbmUgdGhlIGNvbnRleHQgaW4gd2hpY2ggdGhlIGxheWVyIGlzIGRyYXduXG4gICAqICBAcGFyYW0gY29udGV4dCB7VGltZUNvbnRleHR9IHRoZSB0aW1lQ29udGV4dCBpbiB3aGljaCB0aGUgbGF5ZXIgaXMgZGlzcGxheWVkXG4gICAqL1xuICBzZXRUaW1lQ29udGV4dCh0aW1lQ29udGV4dCkge1xuICAgIHRoaXMudGltZUNvbnRleHQgPSB0aW1lQ29udGV4dDtcbiAgICAvLyBjcmVhdGUgYSBtaXhpbiB0byBwYXNzIHRvIHNoYXBlc1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQgPSB7fTtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBEYXRhXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgZ2V0IGRhdGEoKSB7IHJldHVybiB0aGlzLl9kYXRhOyB9XG5cbiAgc2V0IGRhdGEoZGF0YSkge1xuICAgIHN3aXRjaCAodGhpcy5kYXRhVHlwZSkge1xuICAgICAgY2FzZSAnZW50aXR5JzpcbiAgICAgICAgaWYgKHRoaXMuX2RhdGEpIHsgLy8gaWYgZGF0YSBhbHJlYWR5IGV4aXN0cywgcmV1c2UgdGhlIHJlZmVyZW5jZVxuICAgICAgICAgIHRoaXMuX2RhdGFbMF0gPSBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2RhdGEgPSBbZGF0YV07XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2xsZWN0aW9uJzpcbiAgICAgICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbXBvbmVudCBDb25maWd1cmF0aW9uXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqICBSZWdpc3RlciB0aGUgc2hhcGUgYW5kIGl0cyBhY2Nlc3NvcnMgdG8gdXNlIGluIG9yZGVyIHRvIHJlbmRlclxuICAgKiAgdGhlIGVudGl0eSBvciBjb2xsZWN0aW9uXG4gICAqICBAcGFyYW0gY3RvciA8RnVuY3Rpb246QmFzZVNoYXBlPiB0aGUgY29uc3RydWN0b3Igb2YgdGhlIHNoYXBlIHRvIGJlIHVzZWRcbiAgICogIEBwYXJhbSBhY2Nlc3NvcnMgPE9iamVjdD4gYWNjZXNzb3JzIHRvIHVzZSBpbiBvcmRlciB0byBtYXAgdGhlIGRhdGEgc3RydWN0dXJlXG4gICAqL1xuICBjb25maWd1cmVTaGFwZShjdG9yLCBhY2Nlc3NvcnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uID0geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqICBSZWdpc3RlciB0aGUgc2hhcGUgdG8gdXNlIHdpdGggdGhlIGVudGlyZSBjb2xsZWN0aW9uXG4gICAqICBleGFtcGxlOiB0aGUgbGluZSBpbiBhIGJlYWtwb2ludCBmdW5jdGlvblxuICAgKiAgQHBhcmFtIGN0b3Ige0Jhc2VTaGFwZX0gdGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBzaGFwZSB0byB1c2UgdG8gcmVuZGVyIGRhdGFcbiAgICogIEBwYXJhbSBhY2Nlc3NvcnMge09iamVjdH0gYWNjZXNzb3JzIHRvIHVzZSBpbiBvcmRlciB0byBtYXAgdGhlIGRhdGEgc3RydWN0dXJlXG4gICAqL1xuICBjb25maWd1cmVDb21tb25TaGFwZShjdG9yLCBhY2Nlc3NvcnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uID0geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgUmVnaXN0ZXIgdGhlIGJlaGF2aW9yIHRvIHVzZSB3aGVuIGludGVyYWN0aW5nIHdpdGggdGhlIHNoYXBlXG4gICAqICBAcGFyYW0gYmVoYXZpb3Ige0Jhc2VCZWhhdmlvcn1cbiAgICovXG4gIHNldEJlaGF2aW9yKGJlaGF2aW9yKSB7XG4gICAgYmVoYXZpb3IuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICB0aGlzLl9iZWhhdmlvciA9IGJlaGF2aW9yO1xuICB9XG5cbiAgLyoqXG4gICAqICB1cGRhdGUgdGhlIHZhbHVlcyBpbiBgX3JlbmRlcmluZ0NvbnRleHRgXG4gICAqICBpcyBwYXJ0aWN1bGFyeSBuZWVkZWQgd2hlbiB1cGRhdGluZyBgc3RyZXRjaFJhdGlvYCBhcyB0aGUgcG9pbnRlclxuICAgKiAgdG8gdGhlIGB4U2NhbGVgIG1heSBjaGFuZ2VcbiAgICovXG4gIF91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCkge1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQueFNjYWxlID0gdGhpcy50aW1lQ29udGV4dC54U2NhbGU7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC55U2NhbGUgPSB0aGlzLl95U2NhbGU7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC53aWR0aCAgPSB0aGlzLnRpbWVDb250ZXh0LnhTY2FsZSh0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uKTtcbiAgICAvLyBmb3IgZm9yZWlnbiBvamVjdCBpc3N1ZSBpbiBjaHJvbWVcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0Lm9mZnNldFggPSB0aGlzLnRpbWVDb250ZXh0LnhTY2FsZSh0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBCZWhhdmlvciBBY2Nlc3NvcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIEJlaGF2aW9yIGVudHJ5IHBvaW50c1xuICAgKiAgQE5PVEUgQVBJIC0+IGNoYW5nZSBmb3IgYW4gQXJyYXkgYXMgZmlyc3QgYXJndW1lbnRcbiAgICogIEBUT0RPICAgICAtPiBoYW5kbGUgaWYgbm8gYmVoYXZpb3IgaXMgcmVnaXN0ZXJlZFxuICAgKi9cbiAgZ2V0IHNlbGVjdGVkSXRlbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2JlaGF2aW9yID8gdGhpcy5fYmVoYXZpb3Iuc2VsZWN0ZWRJdGVtcyA6IFtdO1xuICB9XG5cbiAgc2VsZWN0KGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcsKgfHzCoCFpdGVtcykgeyByZXR1cm47IH1cbiAgICBpdGVtcyA9IEFycmF5LmlzQXJyYXkoaXRlbXMpID8gaXRlbXMgOiBbaXRlbXNdO1xuXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaXRlbSA9IHRoaXMuX2dldEl0ZW1Gcm9tRE9NRWxlbWVudChpdGVtKTtcbiAgICAgIGNvbnN0IGRhdHVtID0gZDNTZWxlY3Rpb24uc2VsZWN0KGl0ZW0pLmRhdHVtKCk7XG4gICAgICB0aGlzLl9iZWhhdmlvci5zZWxlY3QoaXRlbSwgZGF0dW0pO1xuICAgICAgdGhpcy5fdG9Gcm9udChpdGVtKTtcbiAgICB9KTtcbiAgfVxuXG4gIHVuc2VsZWN0KGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcsKgfHzCoCFpdGVtcykgeyByZXR1cm47IH1cbiAgICBpdGVtcyA9IEFycmF5LmlzQXJyYXkoaXRlbXMpID8gaXRlbXMgOiBbaXRlbXNdO1xuXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgZGF0dW0gPSBkM1NlbGVjdGlvbi5zZWxlY3QoaXRlbSkuZGF0dW0oKTtcbiAgICAgIHRoaXMuX2JlaGF2aW9yLnVuc2VsZWN0KGl0ZW0sIGRhdHVtKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbGVjdEFsbCgpIHtcbiAgICB0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHRoaXMuc2VsZWN0KGl0ZW0pKTtcbiAgfVxuXG4gIHVuc2VsZWN0QWxsKCkge1xuICAgIHRoaXMuc2VsZWN0ZWRJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB0aGlzLnVuc2VsZWN0KGl0ZW0pKTtcbiAgfVxuXG4gIHRvZ2dsZVNlbGVjdGlvbihpdGVtcykge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3LCoHx8wqAhaXRlbXMpIHsgcmV0dXJuOyB9XG4gICAgaXRlbXMgPSBBcnJheS5pc0FycmF5KGl0ZW1zKSA/IGl0ZW1zIDogW2l0ZW1zXTtcblxuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IGRhdHVtID0gZDNTZWxlY3Rpb24uc2VsZWN0KGl0ZW0pLmRhdHVtKCk7XG4gICAgICB0aGlzLl9iZWhhdmlvci50b2dnbGVTZWxlY3Rpb24oaXRlbSwgZGF0dW0pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gQFRPRE8gY2hhbmdlIHNpZ25hdHVyZSBlZGl0KGl0ZW1zID0gWy4uLl0sIGR4LCBkeSwgdGFyZ2V0KTtcbiAgLy8gLT4gYmUgY29uc2lzdGVudCBmb3IgYWxsIGJlaGF2aW9ycyBBUElcbiAgZWRpdChpdGVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IGRhdHVtID0gZDNTZWxlY3Rpb24uc2VsZWN0KGl0ZW0pLmRhdHVtKCk7XG4gICAgY29uc3Qgc2hhcGUgPSB0aGlzLl9pdGVtU2hhcGVNYXAuZ2V0KGl0ZW0pO1xuICAgIHRoaXMuX2JlaGF2aW9yLmVkaXQodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCk7XG4gICAgdGhpcy5lbWl0KCdlZGl0Jywgc2hhcGUsIGRhdHVtKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbnRleHQgQmVoYXZpb3JcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIGRyYXcgdGhlIHNoYXBlIHRvIGludGVyYWN0IHdpdGggdGhlIGNvbnRleHRcbiAgICogIEBwYXJhbXMgYm9vbCB7Qm9vbGVhbn0gZGVmaW5lIGlmIHRoZSBsYXllcidzIGNvbnRleHQgaXMgZWRpdGFibGUgb3Igbm90XG4gICAqL1xuICBzZXQgZWRpdGFibGUoYm9vbCkge1xuICAgIGNvbnN0IGRpc3BsYXkgPSBib29sID8gJ2Jsb2NrJyA6ICdub25lJztcbiAgICB0aGlzLmludGVyYWN0aW9uc0dyb3VwLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xuICAgIHRoaXMuX2lzQ29udGV4dEVkaXRhYmxlID0gYm9vbDtcbiAgfVxuXG4gIGdldCBlZGl0YWJsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5faXNDb250ZXh0RWRpdGFibGU7XG4gIH1cblxuICAvLyBATk9URSBjcmVhdGUgYSBwcm9wZXIgYENvbnRleHRCZWhhdmlvcmAgP1xuICBlZGl0Q29udGV4dChkeCwgZHksIHRhcmdldCkge1xuICAgIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoYW5kbGVyJykgJiYgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbGVmdCcpKSB7XG4gICAgICB0aGlzLl9lZGl0Q29udGV4dExlZnQoZHgpO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnaGFuZGxlcicpICYmIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3JpZ2h0JykpIHtcbiAgICAgIHRoaXMuX2VkaXRDb250ZXh0UmlnaHQoZHgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9tb3ZlQ29udGV4dChkeCk7XG4gICAgfVxuICB9XG5cbiAgX2VkaXRDb250ZXh0TGVmdChkeCkge1xuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gdGhpcy50aW1lQ29udGV4dDtcbiAgICBjb25zdCByZW5kZXJpbmdDb250ZXh0ICA9IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQ7XG4gICAgLy8gZWRpdCBgY29udGV4dC5zdGFydGAsIGBjb250ZXh0Lm9mZnNldGAgYW5kIGBjb250ZXh0LmR1cmF0aW9uYFxuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZSh0aW1lQ29udGV4dC5zdGFydCk7XG4gICAgY29uc3Qgb2Zmc2V0ID0gcmVuZGVyaW5nQ29udGV4dC54U2NhbGUodGltZUNvbnRleHQub2Zmc2V0KTtcbiAgICBjb25zdCB3aWR0aCA9IHJlbmRlcmluZ0NvbnRleHQueFNjYWxlKHRpbWVDb250ZXh0LmR1cmF0aW9uKTtcblxuICAgIGxldCB0YXJnZXRYID0geCArIGR4O1xuICAgIGxldCB0YXJnZXRPZmZzZXQgPSBvZmZzZXQgLSBkeDtcbiAgICBsZXQgdGFyZ2V0V2lkdGggPSBNYXRoLm1heCh3aWR0aCAtIGR4LCAwKTtcblxuICAgIHRoaXMudGltZUNvbnRleHQuc3RhcnQgPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZS5pbnZlcnQodGFyZ2V0WCk7XG4gICAgdGhpcy50aW1lQ29udGV4dC5vZmZzZXQgPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZS5pbnZlcnQodGFyZ2V0T2Zmc2V0KTtcbiAgICB0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uID0gcmVuZGVyaW5nQ29udGV4dC54U2NhbGUuaW52ZXJ0KHRhcmdldFdpZHRoKTtcbiAgfVxuXG4gIF9lZGl0Q29udGV4dFJpZ2h0KGR4KSB7XG4gICAgY29uc3QgdGltZUNvbnRleHQgPSB0aGlzLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgID0gdGhpcy5fcmVuZGVyaW5nQ29udGV4dDtcbiAgICAvLyBlZGl0IGBjb250ZXh0LmR1cmF0aW9uYFxuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC54U2NhbGUodGltZUNvbnRleHQuZHVyYXRpb24pO1xuICAgIGxldCB0YXJnZXRXaWR0aCA9IE1hdGgubWF4KHdpZHRoICsgZHgsIDApO1xuXG4gICAgdGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbiA9IHJlbmRlcmluZ0NvbnRleHQueFNjYWxlLmludmVydCh0YXJnZXRXaWR0aCk7XG4gIH1cblxuICBfbW92ZUNvbnRleHQoZHgpIHtcbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IHRoaXMudGltZUNvbnRleHQ7XG4gICAgY29uc3QgcmVuZGVyaW5nQ29udGV4dCAgPSB0aGlzLl9yZW5kZXJpbmdDb250ZXh0O1xuICAgIC8vIGVkaXQgYGNvbnRleHQuc3RhcnRgXG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQueFNjYWxlKHRpbWVDb250ZXh0LnN0YXJ0KTtcbiAgICBsZXQgdGFyZ2V0WCA9IE1hdGgubWF4KHggKyBkeCwgMCk7XG5cbiAgICB0aGlzLnRpbWVDb250ZXh0LnN0YXJ0ID0gcmVuZGVyaW5nQ29udGV4dC54U2NhbGUuaW52ZXJ0KHRhcmdldFgpO1xuICB9XG5cbiAgc3RyZXRjaENvbnRleHQoZHgsIGR5LCB0YXJnZXQpIHt9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSGVscGVyc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiAgQE5PVEUgaXMgb25seSB1c2VkIG9uIGBoYXNJdGVtYCA9PiBubyBuZWVkIHRvIHNlcGFyYXRlIHRoaXMgbWV0aG9kXG4gICAqICBAcmV0dXJuIHtET01FbGVtZW50fSB0aGUgY2xvc2VzdCBwYXJlbnQgYGl0ZW1gIGdyb3VwIGZvciBhIGdpdmVuIERPTSBlbGVtZW50XG4gICAqL1xuICBfZ2V0SXRlbUZyb21ET01FbGVtZW50KGVsKSB7XG4gICAgZG8ge1xuICAgICAgaWYgKGVsLmNsYXNzTGlzdCAmJiBlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2l0ZW0nKSkgeyByZXR1cm4gZWw7IH1cbiAgICAgIGVsID0gZWwucGFyZW50Tm9kZTtcbiAgICB9IHdoaWxlIChlbCAhPSB1bmRlZmluZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqICBATk9URSBiYWQgbWV0aG9kIG5hbWUgISEhXG4gICAqICBEZWZpbmUgaWYgYW4gZ2l2ZW4gRE9NIGVsZW1lbnQgYmVsb25ncyB0byBvbmUgb2YgdGhlIGBpdGVtc2BcbiAgICogIEBwYXJhbSBgZWxgIHtET01FbGVtZW50fSB0aGUgZWxlbWVudCB0byBiZSB0ZXN0ZWRcbiAgICogIEByZXR1cm4ge21peGVkfVxuICAgKiAgICB7RE9NRWxlbWVudH0gaXRlbSBncm91cCBjb250YWluaW5nIHRoZSBgZWxgIGlmIGJlbG9uZ3MgdG8gdGhpcyBsYXllclxuICAgKiAgICBudWxsIG90aGVyd2lzZVxuICAgKi9cbiAgaGFzSXRlbShlbCkge1xuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLl9nZXRJdGVtRnJvbURPTUVsZW1lbnQoZWwpO1xuICAgIHJldHVybiAodGhpcy5pdGVtcy5ub2RlcygpLmluZGV4T2YoaXRlbSkgIT09IC0xKSA/IGl0ZW0gOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqICBtb3ZlcyBhbiBgaXRlbWAncyBncm91cCB0byB0aGUgZW5kIG9mIHRoZSBsYXllciAoc3ZnIHotaW5kZXguLi4pXG4gICAqICBAcGFyYW0gYGl0ZW1gIHtET01FbGVtZW50fSB0aGUgaXRlbSB0byBiZSBtb3ZlZFxuICAgKi9cbiAgX3RvRnJvbnQoaXRlbSkge1xuICAgIHRoaXMuZ3JvdXAuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogIERlZmluZSBpZiBhIGdpdmVuIGVsZW1lbnQgYmVsb25ncyB0byB0aGUgbGF5ZXJcbiAgICogIGlzIG1vcmUgZ2VuZXJhbCB0aGFuIGBoYXNJdGVtYCwgY2FuIGJlIHVzZWQgdG8gY2hlY2sgaW50ZXJhY3Rpb24gZWxlbWVudHMgdG9vXG4gICAqL1xuICBoYXNFbGVtZW50KGVsKSB7XG4gICAgZG8ge1xuICAgICAgaWYgKGVsID09PSB0aGlzLmNvbnRhaW5lcikgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgZWwgPSBlbC5wYXJlbnROb2RlO1xuICAgIH0gd2hpbGUgKGVsICE9IHVuZGVmaW5lZCk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogIEBwYXJhbSBhcmVhIHtPYmplY3R9IGFyZWEgaW4gd2hpY2ggdG8gZmluZCB0aGUgZWxlbWVudHNcbiAgICogIEByZXR1cm4ge0FycmF5fSBsaXN0IG9mIHRoZSBET00gZWxlbWVudHMgaW4gdGhlIGdpdmVuIGFyZWFcbiAgICovXG4gIGdldEl0ZW1zSW5BcmVhKGFyZWEpIHtcbiAgICAvLyB3b3JrIGluIHBpeGVsIGRvbWFpblxuICAgIGNvbnN0IHN0YXJ0ICAgID0gdGhpcy50aW1lQ29udGV4dC54U2NhbGUodGhpcy50aW1lQ29udGV4dC5zdGFydCk7XG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLnRpbWVDb250ZXh0LnhTY2FsZSh0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uKTtcbiAgICBjb25zdCBvZmZzZXQgICA9IHRoaXMudGltZUNvbnRleHQueFNjYWxlKHRoaXMudGltZUNvbnRleHQub2Zmc2V0KTtcbiAgICBjb25zdCB0b3AgICAgICA9IHRoaXMucGFyYW1zLnRvcDtcbiAgICAvLyBtdXN0IGJlIGF3YXJlIG9mIHRoZSBsYXllcidzIGNvbnRleHQgbW9kaWZpY2F0aW9uc1xuICAgIC8vIGNvbnN0cmFpbiBpbiB3b3JraW5nIHZpZXdcbiAgICBsZXQgeDEgPSBNYXRoLm1heChhcmVhLmxlZnQsIHN0YXJ0KTtcbiAgICBsZXQgeDIgPSBNYXRoLm1pbihhcmVhLmxlZnQgKyBhcmVhLndpZHRoLCBzdGFydCArIGR1cmF0aW9uKTtcbiAgICAvLyBhcHBseSBzdGFydCBhbmQgb2Zmc2V0XG4gICAgeDEgLT0gKHN0YXJ0ICsgb2Zmc2V0KTtcbiAgICB4MiAtPSAoc3RhcnQgKyBvZmZzZXQpO1xuICAgIC8vIGJlIGNvbnNpc3RlbnQgd2l0aCBjb250ZXh0IHkgY29vcmRpbmF0ZXMgc3lzdGVtXG4gICAgbGV0IHkxID0gdGhpcy5wYXJhbXMuaGVpZ2h0IC0gKGFyZWEudG9wICsgYXJlYS5oZWlnaHQpO1xuICAgIGxldCB5MiA9IHRoaXMucGFyYW1zLmhlaWdodCAtIGFyZWEudG9wO1xuXG4gICAgeTEgKz0gdGhpcy5wYXJhbXMudG9wO1xuICAgIHkyICs9IHRoaXMucGFyYW1zLnRvcDtcblxuICAgIGNvbnN0IGl0ZW1TaGFwZU1hcCA9IHRoaXMuX2l0ZW1TaGFwZU1hcDtcbiAgICBjb25zdCByZW5kZXJpbmdDb250ZXh0ID0gdGhpcy5fcmVuZGVyaW5nQ29udGV4dDtcblxuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5pdGVtcy5maWx0ZXIoZnVuY3Rpb24oZGF0dW0sIGluZGV4KSB7XG4gICAgICBjb25zdCBncm91cCA9IHRoaXM7XG4gICAgICBjb25zdCBzaGFwZSA9IGl0ZW1TaGFwZU1hcC5nZXQoZ3JvdXApO1xuICAgICAgcmV0dXJuIHNoYXBlLmluQXJlYShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgeDEsIHkxLCB4MiwgeTIpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGl0ZW1zWzBdLnNsaWNlKDApO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyaW5nIC8gRGlzcGxheSBtZXRob2RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqICByZW5kZXIgdGhlIERPTSBpbiBtZW1vcnkgb24gbGF5ZXIgY3JlYXRpb24gdG8gYmUgYWJsZSB0byB1c2UgaXQgYmVmb3JlXG4gICAqICB0aGUgbGF5ZXIgaXMgYWN0dWFsbHkgaW5zZXJ0ZWQgaW4gdGhlIERPTVxuICAgKi9cbiAgX3JlbmRlcigpIHtcbiAgICAvLyB3cmFwcGVyIGdyb3VwIGZvciBgc3RhcnQsIHRvcCBhbmQgY29udGV4dCBmbGlwIG1hdHJpeFxuICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2xheWVyJyk7XG4gICAgLy8gYXBwZW5kIGEgc3ZnIHRvIGNsaXAgdGhlIGNvbnRleHRcbiAgICAvLyBATk9URTogY291bGQgdXNlIGEgZ3JvdXAgd2l0aCBhIGBjbGlwUGF0aGAgcHJvcGVydHlcbiAgICB0aGlzLmJvdW5kaW5nQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnc3ZnJyk7XG4gICAgdGhpcy5ib3VuZGluZ0JveC5jbGFzc0xpc3QuYWRkKCdib3VuZGluZy1ib3gnKTtcbiAgICAvLyB0aGlzLmJvdW5kaW5nQm94LnNldEF0dHJpYnV0ZU5TKG51bGwsICdpZCcsIHRoaXMucGFyYW1zLmlkKTtcbiAgICAvLyBncm91cCB0byBhcHBseSBvZmZzZXRcbiAgICB0aGlzLmdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuZ3JvdXAuY2xhc3NMaXN0LmFkZCgnb2Zmc2V0JywgJ2l0ZW1zJyk7XG5cbiAgICAvLyBjb250ZXh0IGludGVyYWN0aW9uc1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy5pbnRlcmFjdGlvbnNHcm91cC5jbGFzc0xpc3QuYWRkKCdsYXllci1pbnRlcmFjdGlvbnMnKTtcbiAgICB0aGlzLmludGVyYWN0aW9uc0dyb3VwLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgLy8gQE5PVEU6IHdvcmtzIGJ1dCBraW5nIG9mIHVnbHkuLi4gbXVzdCBiZSBjbGVhbmVkXG4gICAgdGhpcy5jb250ZXh0U2hhcGUgPSBuZXcgU2VnbWVudCgpO1xuICAgIHRoaXMuY29udGV4dFNoYXBlLmluc3RhbGwoe1xuICAgICAgb3BhY2l0eTogKCkgPT4gMC4xLFxuICAgICAgY29sb3IgIDogKCkgPT4gJyM3ODc4NzgnLFxuICAgICAgd2lkdGggIDogKCkgPT4gdGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbixcbiAgICAgIGhlaWdodCA6ICgpID0+IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQueVNjYWxlLmRvbWFpbigpWzFdLFxuICAgICAgeSAgICAgIDogKCkgPT4gdGhpcy5fcmVuZGVyaW5nQ29udGV4dC55U2NhbGUuZG9tYWluKClbMF1cbiAgICB9KTtcblxuICAgIHRoaXMuaW50ZXJhY3Rpb25zR3JvdXAuYXBwZW5kQ2hpbGQodGhpcy5jb250ZXh0U2hhcGUucmVuZGVyKCkpO1xuXG4gICAgLy8gY3JlYXRlIHRoZSBET00gdHJlZVxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuYm91bmRpbmdCb3gpO1xuICAgIHRoaXMuYm91bmRpbmdCb3guYXBwZW5kQ2hpbGQodGhpcy5pbnRlcmFjdGlvbnNHcm91cCk7XG4gICAgdGhpcy5ib3VuZGluZ0JveC5hcHBlbmRDaGlsZCh0aGlzLmdyb3VwKTtcblxuICAgIC8vIGRyYXcgYSBTZWdtZW50IGluIGNvbnRleHQgYmFja2dyb3VuZCB0byBkZWJ1ZyBpdCdzIHNpemVcbiAgICBpZiAodGhpcy5wYXJhbXMuZGVidWcpIHtcbiAgICAgIHRoaXMuZGVidWdSZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnU2VnbWVudCcpO1xuICAgICAgdGhpcy5ib3VuZGluZ0JveC5hcHBlbmRDaGlsZCh0aGlzLmRlYnVnUmVjdCk7XG4gICAgICB0aGlzLmRlYnVnUmVjdC5zdHlsZS5maWxsID0gJyNhYmFiYWInO1xuICAgICAgdGhpcy5kZWJ1Z1JlY3Quc3R5bGUuZmlsbE9wYWNpdHkgPSAwLjE7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBjcmVhdGVzIHRoZSBsYXllciBncm91cCB3aXRoIGEgdHJhbnNmb3JtYXRpb24gbWF0cml4IHRvIGZsaXAgdGhlIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgKiAgQHJldHVybiB7RE9NRWxlbWVudH1cbiAgICovXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XG4gIH1cblxuICAvKipcbiAgICogY3JlYXRlIHRoZSBET00gYWNjb3JkaW5nIHRvIGdpdmVuIGRhdGEgYW5kIHNoYXBlc1xuICAgKi9cbiAgZHJhdygpIHtcbiAgICAvLyBjcmVhdGUgYSB1bmlxdWUgaWQgdG8gZm9yY2UgZDMgdG8ga2VlcCBkYXRhIGluIHN5bmMgd2l0aCB0aGUgRE9NXG4gICAgdGhpcy5kYXRhLmZvckVhY2goZnVuY3Rpb24oZGF0dW0pIHtcbiAgICAgIGlmIChfZGF0dW1JZE1hcC5oYXMoZGF0dW0pKSB7IHJldHVybjsgfVxuICAgICAgX2RhdHVtSWRNYXAuc2V0KGRhdHVtLCBfY291bnRlcisrKTtcbiAgICB9KTtcblxuICAgIC8vIHNlbGVjdCBpdGVtc1xuICAgIHRoaXMuaXRlbXMgPSBkM1NlbGVjdGlvbi5zZWxlY3QodGhpcy5ncm91cClcbiAgICAgIC5zZWxlY3RBbGwoJy5pdGVtJylcbiAgICAgIC5maWx0ZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbW1vbicpO1xuICAgICAgfSlcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSwgZnVuY3Rpb24oZGF0dW0pIHtcbiAgICAgICAgcmV0dXJuIF9kYXR1bUlkTWFwLmdldChkYXR1bSk7XG4gICAgICB9KTtcblxuICAgIC8vIGhhbmRsZSBjb21tb25TaGFwZXMgLT4gcmVuZGVyIG9ubHkgb25jZVxuICAgIGlmIChcbiAgICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiAhPT0gbnVsbCAmJlxuICAgICAgdGhpcy5faXRlbUNvbW1vblNoYXBlTWFwLnNpemUgPT09IDBcbiAgICApIHtcbiAgICAgIGNvbnN0IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH0gPSB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb247XG4gICAgICBjb25zdCBncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAgIGNvbnN0IHNoYXBlID0gbmV3IGN0b3Iob3B0aW9ucyk7XG5cbiAgICAgIHNoYXBlLmluc3RhbGwoYWNjZXNzb3JzKTtcbiAgICAgIGdyb3VwLmFwcGVuZENoaWxkKHNoYXBlLnJlbmRlcigpKTtcbiAgICAgIGdyb3VwLmNsYXNzTGlzdC5hZGQoJ2l0ZW0nLCAnY29tbW9uJywgc2hhcGUuZ2V0Q2xhc3NOYW1lKCkpO1xuXG4gICAgICB0aGlzLl9pdGVtQ29tbW9uU2hhcGVNYXAuc2V0KGdyb3VwLCBzaGFwZSk7XG4gICAgICB0aGlzLmdyb3VwLmFwcGVuZENoaWxkKGdyb3VwKTtcbiAgICB9XG5cbiAgICAvLyBlbnRlclxuICAgIHRoaXMuaXRlbXMuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgoZGF0dW0sIGluZGV4KSA9PiB7XG4gICAgICAgIC8vIEBOT1RFOiBkMyBiaW5kcyBgdGhpc2AgdG8gdGhlIGNvbnRhaW5lciBncm91cFxuICAgICAgICBjb25zdCB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9ID0gdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uO1xuICAgICAgICBjb25zdCBzaGFwZSA9IG5ldyBjdG9yKG9wdGlvbnMpO1xuICAgICAgICBzaGFwZS5pbnN0YWxsKGFjY2Vzc29ycyk7XG5cbiAgICAgICAgY29uc3QgaXRlbSA9IHNoYXBlLnJlbmRlcih0aGlzLl9yZW5kZXJpbmdDb250ZXh0KVxuICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ2l0ZW0nLCBzaGFwZS5nZXRDbGFzc05hbWUoKSk7XG4gICAgICAgIHRoaXMuX2l0ZW1TaGFwZU1hcC5zZXQoaXRlbSwgc2hhcGUpO1xuXG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfSk7XG5cbiAgICAvLyBleGl0XG4gICAgY29uc3QgX2l0ZW1TaGFwZU1hcCA9IHRoaXMuX2l0ZW1TaGFwZU1hcDtcblxuICAgIHRoaXMuaXRlbXMuZXhpdCgpXG4gICAgICAuZWFjaChmdW5jdGlvbihkYXR1bSwgaW5kZXgpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHNoYXBlID0gX2l0ZW1TaGFwZU1hcC5nZXQoaXRlbSk7XG4gICAgICAgIC8vIGNsZWFuIGFsbCBzaGFwZS9pdGVtIHJlZmVyZW5jZXNcbiAgICAgICAgc2hhcGUuZGVzdHJveSgpO1xuICAgICAgICBfZGF0dW1JZE1hcC5kZWxldGUoZGF0dW0pO1xuICAgICAgICBfaXRlbVNoYXBlTWFwLmRlbGV0ZShpdGVtKTtcbiAgICAgIH0pXG4gICAgICAucmVtb3ZlKCk7XG4gIH1cblxuICAvKipcbiAgICogIHVwZGF0ZXMgQ29udGV4dCBhbmQgU2hhcGVzXG4gICAqL1xuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpO1xuXG4gICAgdGhpcy51cGRhdGVDb250YWluZXIoKTtcbiAgICB0aGlzLnVwZGF0ZVNoYXBlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqICB1cGRhdGVzIHRoZSBjb250ZXh0IG9mIHRoZSBsYXllclxuICAgKi9cbiAgdXBkYXRlQ29udGFpbmVyKCkge1xuICAgIGNvbnN0IHggICAgICA9IHRoaXMudGltZUNvbnRleHQueFNjYWxlKHRoaXMudGltZUNvbnRleHQuc3RhcnQpO1xuICAgIGNvbnN0IHdpZHRoICA9IHRoaXMudGltZUNvbnRleHQueFNjYWxlKHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24pO1xuICAgIC8vIG9mZnNldCBpcyByZWxhdGl2ZSB0byB0aW1lbGluZSdzIHRpbWVDb250ZXh0XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGhpcy50aW1lQ29udGV4dC5wYXJlbnQueFNjYWxlKHRoaXMudGltZUNvbnRleHQub2Zmc2V0KTtcbiAgICBjb25zdCB0b3AgICAgPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIC8vIG1hdHJpeCB0byBpbnZlcnQgdGhlIGNvb3JkaW5hdGUgc3lzdGVtXG4gICAgY29uc3QgdHJhbnNsYXRlTWF0cml4ID0gYG1hdHJpeCgxLCAwLCAwLCAtMSwgJHt4fSwgJHt0b3AgKyBoZWlnaHR9KWA7XG5cbiAgICB0aGlzLmNvbnRhaW5lci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlTWF0cml4KTtcblxuICAgIHRoaXMuYm91bmRpbmdCb3guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgIHRoaXMuYm91bmRpbmdCb3guc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgdGhpcy5ib3VuZGluZ0JveC5zdHlsZS5vcGFjaXR5ID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcblxuICAgIHRoaXMuZ3JvdXAuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHtvZmZzZXR9LCAwKWApO1xuXG4gICAgLy8gbWFpbnRhaW4gY29udGV4dCBzaGFwZVxuICAgIHRoaXMuY29udGV4dFNoYXBlLnVwZGF0ZShcbiAgICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQsXG4gICAgICB0aGlzLmludGVyYWN0aW9uc0dyb3VwLFxuICAgICAgdGhpcy50aW1lQ29udGV4dCxcbiAgICAgIDBcbiAgICApO1xuXG4gICAgLy8gZGVidWcgY29udGV4dFxuICAgIGlmICh0aGlzLnBhcmFtcy5kZWJ1Zykge1xuICAgICAgdGhpcy5kZWJ1Z1JlY3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgICAgdGhpcy5kZWJ1Z1JlY3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICB1cGRhdGVzIHRoZSBTaGFwZXMgd2hpY2ggYmVsb25ncyB0byB0aGUgbGF5ZXJcbiAgICogIEBwYXJhbSBpdGVtIHtET01FbGVtZW50fVxuICAgKi9cbiAgdXBkYXRlU2hhcGVzKGl0ZW0gPSBudWxsKSB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgY29uc3QgcmVuZGVyaW5nQ29udGV4dCA9IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQ7XG4gICAgY29uc3QgaXRlbXMgPSBpdGVtICE9PSBudWxsID8gZDNTZWxlY3Rpb24uc2VsZWN0QWxsKGl0ZW0pIDogdGhpcy5pdGVtcztcblxuICAgIC8vIHVwZGF0ZSBjb21tb24gc2hhcGVzXG4gICAgdGhpcy5faXRlbUNvbW1vblNoYXBlTWFwLmZvckVhY2goKHNoYXBlLCBpdGVtKSA9PiB7XG4gICAgICBzaGFwZS51cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgaXRlbSwgdGhpcy5kYXRhKTtcbiAgICB9KTtcblxuICAgIC8vIHVwZGF0ZSBlbnRpdHkgb3IgY29sbGVjdGlvbiBzaGFwZXNcbiAgICBpdGVtcy5lYWNoKGZ1bmN0aW9uKGRhdHVtLCBpbmRleCkge1xuICAgICAgY29uc3QgaXRlbSA9IHRoaXM7XG4gICAgICBjb25zdCBzaGFwZSA9IHRoYXQuX2l0ZW1TaGFwZU1hcC5nZXQoaXRlbSk7XG4gICAgICBzaGFwZS51cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgaXRlbSwgZGF0dW0sIGluZGV4KTtcbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExheWVyO1xuIl19