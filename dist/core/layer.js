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

// private item -> id map to force d3 tp keep in sync with the DOM
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
    setTimeContext: {

      /**
       *  @mandatory define the context in which the layer is drawn
       *  @param context {TimeContext} the timeContext in which the layer is displayed
       */

      value: function setTimeContext(timeContext) {
        this.timeContext = timeContext;
        // create a mixin to pass to the shapes
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
          // item = this._getItemFromDOMElement(item); // should receive an item
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
      value: function edit(items, dx, dy, target) {
        var _this = this;

        if (!this._behavior || !items) {
          return;
        }
        items = Array.isArray(items) ? items : [items];

        items.forEach(function (item) {
          var datum = d3Selection.select(item).datum();
          var shape = _this._itemShapeMap.get(item);
          _this._behavior.edit(_this._renderingContext, shape, datum, dx, dy, target);
          _this.emit("edit", shape, datum);
        });
      }
    },
    _toFront: {

      // --------------------------------------
      // Helpers
      // --------------------------------------

      /**
       *  moves an `item`'s group to the end of the layer (svg z-index...)
       *  @param `item` {DOMElement} the item to be moved
       */

      value: function _toFront(item) {
        this.group.appendChild(item);
      }
    },
    _getItemFromDOMElement: {
      value: function _getItemFromDOMElement(el) {
        do {
          if (el.classList && el.classList.contains("item")) {
            return el;
          }

          el = el.parentNode;
        } while (el != undefined);

        return null;
      }
    },
    hasItem: {

      // @NOTE `hasItem` and `hasElement` are kind of redondant...
      /**
       *  @API change to `getItemFromElement(el)` ?
       *  Define if an given DOM element belongs to one of the `items`
       *  @param `el` {DOMElement} the element to be tested
       *  @return {mixed}
       *    {d3Selection} item group containing the `el` if belongs to this layer
       *    null otherwise
       */

      value: function hasItem(el) {
        var item = this._getItemFromDOMElement(el);
        return this.items.nodes().indexOf(item) !== -1 ? d3Selection.select(item) : null;
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
        var start = this.timeContext.xScale(this.timeContext.start);
        var duration = this.timeContext.xScale(this.timeContext.duration);
        var offset = this.timeContext.xScale(this.timeContext.offset);
        var top = this.params.top;
        // be aware af context's translations - constrain in working view
        var x1 = Math.max(area.left, start);
        var x2 = Math.min(area.left + area.width, start + duration);
        x1 -= start + offset;
        x2 -= start + offset;
        // keep consistent with context y coordinates system
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
        // clip the context with a `svg` element
        this.boundingBox = document.createElementNS(ns, "svg");
        this.boundingBox.classList.add("bounding-box");
        // group to apply offset
        this.group = document.createElementNS(ns, "g");
        this.group.classList.add("offset", "items");
        // context interactions
        this.interactionsGroup = document.createElementNS(ns, "g");
        this.interactionsGroup.classList.add("layer-interactions");
        this.interactionsGroup.style.display = "none";
        // @NOTE: works but king of ugly... should be cleaned
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
       *  Creates the layer group with a transformation
       *  matrix to flip the coordinate system.
       *  @return {DOMElement}
       */

      value: function render() {
        return this.container;
      }
    },
    draw: {

      /**
       *  Creates the DOM according to given data and shapes
       */

      value: function draw() {
        var _this = this;

        // force d3 to keep data in sync with the DOM with a unique id
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

        // render `commonShape` only once
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

        // ... enter
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

        // ... exit
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
        var width = this.timeContext.xScale(this.timeContext.duration);
        // offset is relative to timeline's timeContext
        var x = this.timeContext.parent.xScale(this.timeContext.start);
        var offset = this.timeContext.xScale(this.timeContext.offset);
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
//# sourceMappingURL=data:application/json;base64,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SUFBSSxDQUFDLENBQUM7QUFDM0MsZUFBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3BELENBQUMsQ0FBQztPQUNKOzs7O1NBaGRHLEtBQUs7R0FBUyxNQUFNLENBQUMsWUFBWTs7QUFtZHZDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDIiwiZmlsZSI6ImVzNi9jb3JlL2xheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgbnMgPSByZXF1aXJlKCcuL25hbWVzcGFjZScpO1xuY29uc3QgZDNTY2FsZSA9IHJlcXVpcmUoJ2QzLXNjYWxlJyk7XG5jb25zdCBkM1NlbGVjdGlvbiA9IHJlcXVpcmUoJ2QzLXNlbGVjdGlvbicpO1xuY29uc3QgU2VnbWVudCA9IHJlcXVpcmUoJy4uL3NoYXBlcy9zZWdtZW50Jyk7XG5jb25zdCBTZWdtZW50QmVoYXZpb3IgPSByZXF1aXJlKCcuLi9iZWhhdmlvcnMvc2VnbWVudC1iZWhhdmlvcicpO1xuY29uc3QgZXZlbnRzID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5cbi8vIHByaXZhdGUgaXRlbSAtPiBpZCBtYXAgdG8gZm9yY2UgZDMgdHAga2VlcCBpbiBzeW5jIHdpdGggdGhlIERPTVxubGV0IF9jb3VudGVyID0gMDtcbmNvbnN0IF9kYXR1bUlkTWFwID0gbmV3IE1hcCgpO1xuXG5cbmNsYXNzIExheWVyIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKGRhdGFUeXBlLCBkYXRhLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZGF0YVR5cGUgPSBkYXRhVHlwZTsgLy8gJ2VudGl0eScgfHwgJ2NvbGxlY3Rpb24nO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGhlaWdodDogMTAwLFxuICAgICAgdG9wOiAwLFxuICAgICAgaWQ6ICcnLFxuICAgICAgeURvbWFpbjogWzAsIDFdLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIGRlYnVnQ29udGV4dDogZmFsc2UsIC8vIHBhc3MgdGhlIGNvbnRleHQgaW4gZGVidWcgbW9kZVxuICAgICAgY29udGV4dEhhbmRsZXJXaWR0aDogMlxuICAgIH07XG5cbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbnVsbDtcblxuICAgIHRoaXMuY29udGFpbmVyID0gbnVsbDsgLy8gb2Zmc2V0IGdyb3VwIG9mIHRoZSBwYXJlbnQgY29udGV4dFxuICAgIHRoaXMuZ3JvdXAgPSBudWxsOyAvLyBncm91cCBjcmVhdGVkIGJ5IHRoZSBsYXllciBpbnNpZGUgdGhlIGNvbnRleHRcbiAgICB0aGlzLml0ZW1zID0gbnVsbDsgLy8gZDMgY29sbGVjdGlvbiBvZiB0aGUgbGF5ZXIgaXRlbXNcblxuICAgIHRoaXMuX3NoYXBlQ29uZmlndXJhdGlvbiA9IG51bGw7IC8vIHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH1cbiAgICB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb24gPSBudWxsOyAvLyB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9XG5cbiAgICB0aGlzLl9pdGVtU2hhcGVNYXAgPSBuZXcgTWFwKCk7IC8vIGl0ZW0gZ3JvdXAgPERPTUVsZW1lbnQ+ID0+IHNoYXBlXG4gICAgdGhpcy5faXRlbUNvbW1vblNoYXBlTWFwID0gbmV3IE1hcCgpOyAvLyBvbmUgZW50cnkgbWF4IGluIHRoaXMgbWFwXG5cbiAgICB0aGlzLl9pc0NvbnRleHRFZGl0YWJsZSA9IGZhbHNlO1xuICAgIHRoaXMuX2JlaGF2aW9yID0gbnVsbDtcblxuICAgIHRoaXMuX3lTY2FsZSA9IGQzU2NhbGUubGluZWFyKClcbiAgICAgIC5kb21haW4odGhpcy5wYXJhbXMueURvbWFpbilcbiAgICAgIC5yYW5nZShbMCwgdGhpcy5wYXJhbXMuaGVpZ2h0XSk7XG5cbiAgICAvLyBpbml0aWFsaXplIHRpbWVDb250ZXh0IGxheW91dFxuICAgIHRoaXMuX3JlbmRlcigpO1xuICB9XG5cbiAgc2V0IHlEb21haW4oZG9tYWluKSB7XG4gICAgdGhpcy5wYXJhbXMueURvbWFpbiA9IGRvbWFpbjtcbiAgICB0aGlzLl95U2NhbGUuZG9tYWluKGRvbWFpbik7XG4gIH1cblxuICBnZXQgeURvbWFpbigpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMueURvbWFpbjtcbiAgfVxuXG4gIHNldCBvcGFjaXR5KHZhbHVlKSB7XG4gICAgdGhpcy5wYXJhbXMub3BhY2l0eSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IG9wYWNpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLm9wYWNpdHk7XG4gIH1cblxuICAvKipcbiAgICogIEBtYW5kYXRvcnkgZGVmaW5lIHRoZSBjb250ZXh0IGluIHdoaWNoIHRoZSBsYXllciBpcyBkcmF3blxuICAgKiAgQHBhcmFtIGNvbnRleHQge1RpbWVDb250ZXh0fSB0aGUgdGltZUNvbnRleHQgaW4gd2hpY2ggdGhlIGxheWVyIGlzIGRpc3BsYXllZFxuICAgKi9cbiAgc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gdGltZUNvbnRleHQ7XG4gICAgLy8gY3JlYXRlIGEgbWl4aW4gdG8gcGFzcyB0byB0aGUgc2hhcGVzXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dCA9IHt9O1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIERhdGFcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBnZXQgZGF0YSgpIHsgcmV0dXJuIHRoaXMuX2RhdGE7IH1cblxuICBzZXQgZGF0YShkYXRhKSB7XG4gICAgc3dpdGNoICh0aGlzLmRhdGFUeXBlKSB7XG4gICAgICBjYXNlICdlbnRpdHknOlxuICAgICAgICBpZiAodGhpcy5fZGF0YSkgeyAgLy8gaWYgZGF0YSBhbHJlYWR5IGV4aXN0cywgcmV1c2UgdGhlIHJlZmVyZW5jZVxuICAgICAgICAgIHRoaXMuX2RhdGFbMF0gPSBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2RhdGEgPSBbZGF0YV07XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2xsZWN0aW9uJzpcbiAgICAgICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbXBvbmVudCBDb25maWd1cmF0aW9uXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqICBSZWdpc3RlciB0aGUgc2hhcGUgYW5kIGl0cyBhY2Nlc3NvcnMgdG8gdXNlIGluIG9yZGVyIHRvIHJlbmRlclxuICAgKiAgdGhlIGVudGl0eSBvciBjb2xsZWN0aW9uXG4gICAqICBAcGFyYW0gY3RvciA8RnVuY3Rpb246QmFzZVNoYXBlPiB0aGUgY29uc3RydWN0b3Igb2YgdGhlIHNoYXBlIHRvIGJlIHVzZWRcbiAgICogIEBwYXJhbSBhY2Nlc3NvcnMgPE9iamVjdD4gYWNjZXNzb3JzIHRvIHVzZSBpbiBvcmRlciB0byBtYXAgdGhlIGRhdGEgc3RydWN0dXJlXG4gICAqL1xuICBjb25maWd1cmVTaGFwZShjdG9yLCBhY2Nlc3NvcnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uID0geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgUmVnaXN0ZXIgdGhlIHNoYXBlIHRvIHVzZSB3aXRoIHRoZSBlbnRpcmUgY29sbGVjdGlvblxuICAgKiAgZXhhbXBsZTogdGhlIGxpbmUgaW4gYSBiZWFrcG9pbnQgZnVuY3Rpb25cbiAgICogIEBwYXJhbSBjdG9yIHtCYXNlU2hhcGV9IHRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgc2hhcGUgdG8gdXNlIHRvIHJlbmRlciBkYXRhXG4gICAqICBAcGFyYW0gYWNjZXNzb3JzIHtPYmplY3R9IGFjY2Vzc29ycyB0byB1c2UgaW4gb3JkZXIgdG8gbWFwIHRoZSBkYXRhIHN0cnVjdHVyZVxuICAgKi9cbiAgY29uZmlndXJlQ29tbW9uU2hhcGUoY3RvciwgYWNjZXNzb3JzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiA9IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH07XG4gIH1cblxuICAvKipcbiAgICogIFJlZ2lzdGVyIHRoZSBiZWhhdmlvciB0byB1c2Ugd2hlbiBpbnRlcmFjdGluZyB3aXRoIHRoZSBzaGFwZVxuICAgKiAgQHBhcmFtIGJlaGF2aW9yIHtCYXNlQmVoYXZpb3J9XG4gICAqL1xuICBzZXRCZWhhdmlvcihiZWhhdmlvcikge1xuICAgIGJlaGF2aW9yLmluaXRpYWxpemUodGhpcyk7XG4gICAgdGhpcy5fYmVoYXZpb3IgPSBiZWhhdmlvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlIHRoZSB2YWx1ZXMgaW4gYF9yZW5kZXJpbmdDb250ZXh0YFxuICAgKiAgaXMgcGFydGljdWxhcnkgbmVlZGVkIHdoZW4gdXBkYXRpbmcgYHN0cmV0Y2hSYXRpb2AgYXMgdGhlIHBvaW50ZXJcbiAgICogIHRvIHRoZSBgeFNjYWxlYCBtYXkgY2hhbmdlXG4gICAqL1xuICBfdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpIHtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnhTY2FsZSA9IHRoaXMudGltZUNvbnRleHQueFNjYWxlO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQueVNjYWxlID0gdGhpcy5feVNjYWxlO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQuaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQud2lkdGggID0gdGhpcy50aW1lQ29udGV4dC54U2NhbGUodGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbik7XG4gICAgLy8gZm9yIGZvcmVpZ24gb2plY3QgaXNzdWUgaW4gY2hyb21lXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5vZmZzZXRYID0gdGhpcy50aW1lQ29udGV4dC54U2NhbGUodGhpcy50aW1lQ29udGV4dC5vZmZzZXQpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQmVoYXZpb3IgQWNjZXNzb3JzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgZ2V0IHNlbGVjdGVkSXRlbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2JlaGF2aW9yID8gdGhpcy5fYmVoYXZpb3Iuc2VsZWN0ZWRJdGVtcyA6IFtdO1xuICB9XG5cbiAgc2VsZWN0KGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcsKgfHzCoCFpdGVtcykgeyByZXR1cm47IH1cbiAgICBpdGVtcyA9IEFycmF5LmlzQXJyYXkoaXRlbXMpID8gaXRlbXMgOiBbaXRlbXNdO1xuXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgLy8gaXRlbSA9IHRoaXMuX2dldEl0ZW1Gcm9tRE9NRWxlbWVudChpdGVtKTsgLy8gc2hvdWxkIHJlY2VpdmUgYW4gaXRlbVxuICAgICAgY29uc3QgZGF0dW0gPSBkM1NlbGVjdGlvbi5zZWxlY3QoaXRlbSkuZGF0dW0oKTtcbiAgICAgIHRoaXMuX2JlaGF2aW9yLnNlbGVjdChpdGVtLCBkYXR1bSk7XG4gICAgICB0aGlzLl90b0Zyb250KGl0ZW0pO1xuICAgIH0pO1xuICB9XG5cbiAgdW5zZWxlY3QoaXRlbXMpIHtcbiAgICBpZiAoIXRoaXMuX2JlaGF2aW9ywqB8fMKgIWl0ZW1zKSB7IHJldHVybjsgfVxuICAgIGl0ZW1zID0gQXJyYXkuaXNBcnJheShpdGVtcykgPyBpdGVtcyA6IFtpdGVtc107XG5cbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBkYXR1bSA9IGQzU2VsZWN0aW9uLnNlbGVjdChpdGVtKS5kYXR1bSgpO1xuICAgICAgdGhpcy5fYmVoYXZpb3IudW5zZWxlY3QoaXRlbSwgZGF0dW0pO1xuICAgIH0pO1xuICB9XG5cbiAgdG9nZ2xlU2VsZWN0aW9uKGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcsKgfHzCoCFpdGVtcykgeyByZXR1cm47IH1cbiAgICBpdGVtcyA9IEFycmF5LmlzQXJyYXkoaXRlbXMpID8gaXRlbXMgOiBbaXRlbXNdO1xuXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgZGF0dW0gPSBkM1NlbGVjdGlvbi5zZWxlY3QoaXRlbSkuZGF0dW0oKTtcbiAgICAgIHRoaXMuX2JlaGF2aW9yLnRvZ2dsZVNlbGVjdGlvbihpdGVtLCBkYXR1bSk7XG4gICAgfSk7XG4gIH1cblxuICBlZGl0KGl0ZW1zLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3LCoHx8wqAhaXRlbXMpIHsgcmV0dXJuOyB9XG4gICAgaXRlbXMgPSBBcnJheS5pc0FycmF5KGl0ZW1zKSA/IGl0ZW1zIDogW2l0ZW1zXTtcblxuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IGRhdHVtID0gZDNTZWxlY3Rpb24uc2VsZWN0KGl0ZW0pLmRhdHVtKCk7XG4gICAgICBjb25zdCBzaGFwZSA9IHRoaXMuX2l0ZW1TaGFwZU1hcC5nZXQoaXRlbSk7XG4gICAgICB0aGlzLl9iZWhhdmlvci5lZGl0KHRoaXMuX3JlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpO1xuICAgICAgdGhpcy5lbWl0KCdlZGl0Jywgc2hhcGUsIGRhdHVtKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEhlbHBlcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIG1vdmVzIGFuIGBpdGVtYCdzIGdyb3VwIHRvIHRoZSBlbmQgb2YgdGhlIGxheWVyIChzdmcgei1pbmRleC4uLilcbiAgICogIEBwYXJhbSBgaXRlbWAge0RPTUVsZW1lbnR9IHRoZSBpdGVtIHRvIGJlIG1vdmVkXG4gICAqL1xuICBfdG9Gcm9udChpdGVtKSB7XG4gICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZChpdGVtKTtcbiAgfVxuXG4gIF9nZXRJdGVtRnJvbURPTUVsZW1lbnQoZWwpIHtcbiAgICBkbyB7XG4gICAgICBpZiAoZWwuY2xhc3NMaXN0ICYmIGVsLmNsYXNzTGlzdC5jb250YWlucygnaXRlbScpKSB7XG4gICAgICAgIHJldHVybiBlbDtcbiAgICAgIH1cblxuICAgICAgZWwgPSBlbC5wYXJlbnROb2RlO1xuICAgIH0gd2hpbGUgKGVsICE9IHVuZGVmaW5lZCk7XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIEBOT1RFIGBoYXNJdGVtYCBhbmQgYGhhc0VsZW1lbnRgIGFyZSBraW5kIG9mIHJlZG9uZGFudC4uLlxuICAvKipcbiAgICogIEBBUEkgY2hhbmdlIHRvIGBnZXRJdGVtRnJvbUVsZW1lbnQoZWwpYCA/XG4gICAqICBEZWZpbmUgaWYgYW4gZ2l2ZW4gRE9NIGVsZW1lbnQgYmVsb25ncyB0byBvbmUgb2YgdGhlIGBpdGVtc2BcbiAgICogIEBwYXJhbSBgZWxgIHtET01FbGVtZW50fSB0aGUgZWxlbWVudCB0byBiZSB0ZXN0ZWRcbiAgICogIEByZXR1cm4ge21peGVkfVxuICAgKiAgICB7ZDNTZWxlY3Rpb259IGl0ZW0gZ3JvdXAgY29udGFpbmluZyB0aGUgYGVsYCBpZiBiZWxvbmdzIHRvIHRoaXMgbGF5ZXJcbiAgICogICAgbnVsbCBvdGhlcndpc2VcbiAgICovXG4gIGhhc0l0ZW0oZWwpIHtcbiAgICBjb25zdCBpdGVtID0gdGhpcy5fZ2V0SXRlbUZyb21ET01FbGVtZW50KGVsKTtcbiAgICByZXR1cm4gKHRoaXMuaXRlbXMubm9kZXMoKS5pbmRleE9mKGl0ZW0pICE9PSAtMSkgPyBkM1NlbGVjdGlvbi5zZWxlY3QoaXRlbSkgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqICBEZWZpbmUgaWYgYSBnaXZlbiBlbGVtZW50IGJlbG9uZ3MgdG8gdGhlIGxheWVyXG4gICAqICBpcyBtb3JlIGdlbmVyYWwgdGhhbiBgaGFzSXRlbWAsIGNhbiBiZSB1c2VkIHRvIGNoZWNrIGludGVyYWN0aW9uIGVsZW1lbnRzIHRvb1xuICAgKi9cbiAgaGFzRWxlbWVudChlbCkge1xuICAgIGRvIHtcbiAgICAgIGlmIChlbCA9PT0gdGhpcy5jb250YWluZXIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGVsID0gZWwucGFyZW50Tm9kZTtcbiAgICB9IHdoaWxlIChlbCAhPSB1bmRlZmluZWQpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqICBAcGFyYW0gYXJlYSB7T2JqZWN0fSBhcmVhIGluIHdoaWNoIHRvIGZpbmQgdGhlIGVsZW1lbnRzXG4gICAqICBAcmV0dXJuIHtBcnJheX0gbGlzdCBvZiB0aGUgRE9NIGVsZW1lbnRzIGluIHRoZSBnaXZlbiBhcmVhXG4gICAqL1xuICBnZXRJdGVtc0luQXJlYShhcmVhKSB7XG4gICAgY29uc3Qgc3RhcnQgICAgPSB0aGlzLnRpbWVDb250ZXh0LnhTY2FsZSh0aGlzLnRpbWVDb250ZXh0LnN0YXJ0KTtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMudGltZUNvbnRleHQueFNjYWxlKHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24pO1xuICAgIGNvbnN0IG9mZnNldCAgID0gdGhpcy50aW1lQ29udGV4dC54U2NhbGUodGhpcy50aW1lQ29udGV4dC5vZmZzZXQpO1xuICAgIGNvbnN0IHRvcCAgICAgID0gdGhpcy5wYXJhbXMudG9wO1xuICAgIC8vIGJlIGF3YXJlIGFmIGNvbnRleHQncyB0cmFuc2xhdGlvbnMgLSBjb25zdHJhaW4gaW4gd29ya2luZyB2aWV3XG4gICAgbGV0IHgxID0gTWF0aC5tYXgoYXJlYS5sZWZ0LCBzdGFydCk7XG4gICAgbGV0IHgyID0gTWF0aC5taW4oYXJlYS5sZWZ0ICsgYXJlYS53aWR0aCwgc3RhcnQgKyBkdXJhdGlvbik7XG4gICAgeDEgLT0gKHN0YXJ0ICsgb2Zmc2V0KTtcbiAgICB4MiAtPSAoc3RhcnQgKyBvZmZzZXQpO1xuICAgIC8vIGtlZXAgY29uc2lzdGVudCB3aXRoIGNvbnRleHQgeSBjb29yZGluYXRlcyBzeXN0ZW1cbiAgICBsZXQgeTEgPSB0aGlzLnBhcmFtcy5oZWlnaHQgLSAoYXJlYS50b3AgKyBhcmVhLmhlaWdodCk7XG4gICAgbGV0IHkyID0gdGhpcy5wYXJhbXMuaGVpZ2h0IC0gYXJlYS50b3A7XG5cbiAgICB5MSArPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgeTIgKz0gdGhpcy5wYXJhbXMudG9wO1xuXG4gICAgY29uc3QgaXRlbVNoYXBlTWFwID0gdGhpcy5faXRlbVNoYXBlTWFwO1xuICAgIGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLl9yZW5kZXJpbmdDb250ZXh0O1xuXG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLml0ZW1zLmZpbHRlcihmdW5jdGlvbihkYXR1bSwgaW5kZXgpIHtcbiAgICAgIGNvbnN0IGdyb3VwID0gdGhpcztcbiAgICAgIGNvbnN0IHNoYXBlID0gaXRlbVNoYXBlTWFwLmdldChncm91cCk7XG4gICAgICByZXR1cm4gc2hhcGUuaW5BcmVhKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaXRlbXNbMF0uc2xpY2UoMCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZW5kZXJpbmcgLyBEaXNwbGF5IG1ldGhvZHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIHJlbmRlciB0aGUgRE9NIGluIG1lbW9yeSBvbiBsYXllciBjcmVhdGlvbiB0byBiZSBhYmxlIHRvIHVzZSBpdCBiZWZvcmVcbiAgICogIHRoZSBsYXllciBpcyBhY3R1YWxseSBpbnNlcnRlZCBpbiB0aGUgRE9NXG4gICAqL1xuICBfcmVuZGVyKCkge1xuICAgIC8vIHdyYXBwZXIgZ3JvdXAgZm9yIGBzdGFydCwgdG9wIGFuZCBjb250ZXh0IGZsaXAgbWF0cml4XG4gICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnbGF5ZXInKTtcbiAgICAvLyBjbGlwIHRoZSBjb250ZXh0IHdpdGggYSBgc3ZnYCBlbGVtZW50XG4gICAgdGhpcy5ib3VuZGluZ0JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3N2ZycpO1xuICAgIHRoaXMuYm91bmRpbmdCb3guY2xhc3NMaXN0LmFkZCgnYm91bmRpbmctYm94Jyk7XG4gICAgLy8gZ3JvdXAgdG8gYXBwbHkgb2Zmc2V0XG4gICAgdGhpcy5ncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLmdyb3VwLmNsYXNzTGlzdC5hZGQoJ29mZnNldCcsICdpdGVtcycpO1xuICAgIC8vIGNvbnRleHQgaW50ZXJhY3Rpb25zXG4gICAgdGhpcy5pbnRlcmFjdGlvbnNHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLmludGVyYWN0aW9uc0dyb3VwLmNsYXNzTGlzdC5hZGQoJ2xheWVyLWludGVyYWN0aW9ucycpO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zR3JvdXAuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAvLyBATk9URTogd29ya3MgYnV0IGtpbmcgb2YgdWdseS4uLiBzaG91bGQgYmUgY2xlYW5lZFxuICAgIHRoaXMuY29udGV4dFNoYXBlID0gbmV3IFNlZ21lbnQoKTtcbiAgICB0aGlzLmNvbnRleHRTaGFwZS5pbnN0YWxsKHtcbiAgICAgIG9wYWNpdHk6ICgpID0+IDAuMSxcbiAgICAgIGNvbG9yICA6ICgpID0+ICcjNzg3ODc4JyxcbiAgICAgIHdpZHRoICA6ICgpID0+IHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24sXG4gICAgICBoZWlnaHQgOiAoKSA9PiB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnlTY2FsZS5kb21haW4oKVsxXSxcbiAgICAgIHkgICAgICA6ICgpID0+IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQueVNjYWxlLmRvbWFpbigpWzBdXG4gICAgfSk7XG5cbiAgICB0aGlzLmludGVyYWN0aW9uc0dyb3VwLmFwcGVuZENoaWxkKHRoaXMuY29udGV4dFNoYXBlLnJlbmRlcigpKTtcbiAgICAvLyBjcmVhdGUgdGhlIERPTSB0cmVlXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5ib3VuZGluZ0JveCk7XG4gICAgdGhpcy5ib3VuZGluZ0JveC5hcHBlbmRDaGlsZCh0aGlzLmludGVyYWN0aW9uc0dyb3VwKTtcbiAgICB0aGlzLmJvdW5kaW5nQm94LmFwcGVuZENoaWxkKHRoaXMuZ3JvdXApO1xuXG4gICAgLy8gZHJhdyBhIFNlZ21lbnQgaW4gY29udGV4dCBiYWNrZ3JvdW5kIHRvIGRlYnVnIGl0J3Mgc2l6ZVxuICAgIGlmICh0aGlzLnBhcmFtcy5kZWJ1Zykge1xuICAgICAgdGhpcy5kZWJ1Z1JlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdTZWdtZW50Jyk7XG4gICAgICB0aGlzLmJvdW5kaW5nQm94LmFwcGVuZENoaWxkKHRoaXMuZGVidWdSZWN0KTtcbiAgICAgIHRoaXMuZGVidWdSZWN0LnN0eWxlLmZpbGwgPSAnI2FiYWJhYic7XG4gICAgICB0aGlzLmRlYnVnUmVjdC5zdHlsZS5maWxsT3BhY2l0eSA9IDAuMTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIENyZWF0ZXMgdGhlIGxheWVyIGdyb3VwIHdpdGggYSB0cmFuc2Zvcm1hdGlvblxuICAgKiAgbWF0cml4IHRvIGZsaXAgdGhlIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgKiAgQHJldHVybiB7RE9NRWxlbWVudH1cbiAgICovXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XG4gIH1cblxuICAvKipcbiAgICogIENyZWF0ZXMgdGhlIERPTSBhY2NvcmRpbmcgdG8gZ2l2ZW4gZGF0YSBhbmQgc2hhcGVzXG4gICAqL1xuICBkcmF3KCkge1xuICAgIC8vIGZvcmNlIGQzIHRvIGtlZXAgZGF0YSBpbiBzeW5jIHdpdGggdGhlIERPTSB3aXRoIGEgdW5pcXVlIGlkXG4gICAgdGhpcy5kYXRhLmZvckVhY2goZnVuY3Rpb24oZGF0dW0pIHtcbiAgICAgIGlmIChfZGF0dW1JZE1hcC5oYXMoZGF0dW0pKSB7IHJldHVybjsgfVxuICAgICAgX2RhdHVtSWRNYXAuc2V0KGRhdHVtLCBfY291bnRlcisrKTtcbiAgICB9KTtcblxuICAgIC8vIHNlbGVjdCBpdGVtc1xuICAgIHRoaXMuaXRlbXMgPSBkM1NlbGVjdGlvbi5zZWxlY3QodGhpcy5ncm91cClcbiAgICAgIC5zZWxlY3RBbGwoJy5pdGVtJylcbiAgICAgIC5maWx0ZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbW1vbicpO1xuICAgICAgfSlcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSwgZnVuY3Rpb24oZGF0dW0pIHtcbiAgICAgICAgcmV0dXJuIF9kYXR1bUlkTWFwLmdldChkYXR1bSk7XG4gICAgICB9KTtcblxuICAgIC8vIHJlbmRlciBgY29tbW9uU2hhcGVgIG9ubHkgb25jZVxuICAgIGlmIChcbiAgICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiAhPT0gbnVsbCAmJlxuICAgICAgdGhpcy5faXRlbUNvbW1vblNoYXBlTWFwLnNpemUgPT09IDBcbiAgICApIHtcbiAgICAgIGNvbnN0IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH0gPSB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb247XG4gICAgICBjb25zdCBncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAgIGNvbnN0IHNoYXBlID0gbmV3IGN0b3Iob3B0aW9ucyk7XG5cbiAgICAgIHNoYXBlLmluc3RhbGwoYWNjZXNzb3JzKTtcbiAgICAgIGdyb3VwLmFwcGVuZENoaWxkKHNoYXBlLnJlbmRlcigpKTtcbiAgICAgIGdyb3VwLmNsYXNzTGlzdC5hZGQoJ2l0ZW0nLCAnY29tbW9uJywgc2hhcGUuZ2V0Q2xhc3NOYW1lKCkpO1xuXG4gICAgICB0aGlzLl9pdGVtQ29tbW9uU2hhcGVNYXAuc2V0KGdyb3VwLCBzaGFwZSk7XG4gICAgICB0aGlzLmdyb3VwLmFwcGVuZENoaWxkKGdyb3VwKTtcbiAgICB9XG5cbiAgICAvLyAuLi4gZW50ZXJcbiAgICB0aGlzLml0ZW1zLmVudGVyKClcbiAgICAgIC5hcHBlbmQoKGRhdHVtLCBpbmRleCkgPT4ge1xuICAgICAgICAvLyBATk9URTogZDMgYmluZHMgYHRoaXNgIHRvIHRoZSBjb250YWluZXIgZ3JvdXBcbiAgICAgICAgY29uc3QgeyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfSA9IHRoaXMuX3NoYXBlQ29uZmlndXJhdGlvbjtcbiAgICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgY3RvcihvcHRpb25zKTtcbiAgICAgICAgc2hhcGUuaW5zdGFsbChhY2Nlc3NvcnMpO1xuXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBzaGFwZS5yZW5kZXIodGhpcy5fcmVuZGVyaW5nQ29udGV4dClcbiAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdpdGVtJywgc2hhcGUuZ2V0Q2xhc3NOYW1lKCkpO1xuICAgICAgICB0aGlzLl9pdGVtU2hhcGVNYXAuc2V0KGl0ZW0sIHNoYXBlKTtcblxuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH0pO1xuXG4gICAgLy8gLi4uIGV4aXRcbiAgICBjb25zdCBfaXRlbVNoYXBlTWFwID0gdGhpcy5faXRlbVNoYXBlTWFwO1xuXG4gICAgdGhpcy5pdGVtcy5leGl0KClcbiAgICAgIC5lYWNoKGZ1bmN0aW9uKGRhdHVtLCBpbmRleCkge1xuICAgICAgICBjb25zdCBpdGVtID0gdGhpcztcbiAgICAgICAgY29uc3Qgc2hhcGUgPSBfaXRlbVNoYXBlTWFwLmdldChpdGVtKTtcbiAgICAgICAgLy8gY2xlYW4gYWxsIHNoYXBlL2l0ZW0gcmVmZXJlbmNlc1xuICAgICAgICBzaGFwZS5kZXN0cm95KCk7XG4gICAgICAgIF9kYXR1bUlkTWFwLmRlbGV0ZShkYXR1bSk7XG4gICAgICAgIF9pdGVtU2hhcGVNYXAuZGVsZXRlKGl0ZW0pO1xuICAgICAgfSlcbiAgICAgIC5yZW1vdmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlcyBDb250ZXh0IGFuZCBTaGFwZXNcbiAgICovXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCk7XG5cbiAgICB0aGlzLnVwZGF0ZUNvbnRhaW5lcigpO1xuICAgIHRoaXMudXBkYXRlU2hhcGVzKCk7XG4gIH1cblxuICAvKipcbiAgICogIHVwZGF0ZXMgdGhlIGNvbnRleHQgb2YgdGhlIGxheWVyXG4gICAqL1xuICB1cGRhdGVDb250YWluZXIoKSB7XG4gICAgY29uc3Qgd2lkdGggID0gdGhpcy50aW1lQ29udGV4dC54U2NhbGUodGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbik7XG4gICAgLy8gb2Zmc2V0IGlzIHJlbGF0aXZlIHRvIHRpbWVsaW5lJ3MgdGltZUNvbnRleHRcbiAgICBjb25zdCB4ICAgICAgPSB0aGlzLnRpbWVDb250ZXh0LnBhcmVudC54U2NhbGUodGhpcy50aW1lQ29udGV4dC5zdGFydCk7XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGhpcy50aW1lQ29udGV4dC54U2NhbGUodGhpcy50aW1lQ29udGV4dC5vZmZzZXQpO1xuICAgIGNvbnN0IHRvcCAgICA9IHRoaXMucGFyYW1zLnRvcDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgLy8gbWF0cml4IHRvIGludmVydCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICBjb25zdCB0cmFuc2xhdGVNYXRyaXggPSBgbWF0cml4KDEsIDAsIDAsIC0xLCAke3h9LCAke3RvcCArIGhlaWdodH0pYDtcblxuICAgIHRoaXMuY29udGFpbmVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGVNYXRyaXgpO1xuXG4gICAgdGhpcy5ib3VuZGluZ0JveC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgdGhpcy5ib3VuZGluZ0JveC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICB0aGlzLmJvdW5kaW5nQm94LnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuXG4gICAgdGhpcy5ncm91cC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke29mZnNldH0sIDApYCk7XG5cbiAgICAvLyBtYWludGFpbiBjb250ZXh0IHNoYXBlXG4gICAgdGhpcy5jb250ZXh0U2hhcGUudXBkYXRlKFxuICAgICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dCxcbiAgICAgIHRoaXMuaW50ZXJhY3Rpb25zR3JvdXAsXG4gICAgICB0aGlzLnRpbWVDb250ZXh0LFxuICAgICAgMFxuICAgICk7XG5cbiAgICAvLyBkZWJ1ZyBjb250ZXh0XG4gICAgaWYgKHRoaXMucGFyYW1zLmRlYnVnKSB7XG4gICAgICB0aGlzLmRlYnVnUmVjdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgICB0aGlzLmRlYnVnUmVjdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIHVwZGF0ZXMgdGhlIFNoYXBlcyB3aGljaCBiZWxvbmdzIHRvIHRoZSBsYXllclxuICAgKiAgQHBhcmFtIGl0ZW0ge0RPTUVsZW1lbnR9XG4gICAqL1xuICB1cGRhdGVTaGFwZXMoaXRlbSA9IG51bGwpIHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICBjb25zdCByZW5kZXJpbmdDb250ZXh0ID0gdGhpcy5fcmVuZGVyaW5nQ29udGV4dDtcbiAgICBjb25zdCBpdGVtcyA9IGl0ZW0gIT09IG51bGwgPyBkM1NlbGVjdGlvbi5zZWxlY3RBbGwoaXRlbSkgOiB0aGlzLml0ZW1zO1xuXG4gICAgLy8gdXBkYXRlIGNvbW1vbiBzaGFwZXNcbiAgICB0aGlzLl9pdGVtQ29tbW9uU2hhcGVNYXAuZm9yRWFjaCgoc2hhcGUsIGl0ZW0pID0+IHtcbiAgICAgIHNoYXBlLnVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBpdGVtLCB0aGlzLmRhdGEpO1xuICAgIH0pO1xuXG4gICAgLy8gdXBkYXRlIGVudGl0eSBvciBjb2xsZWN0aW9uIHNoYXBlc1xuICAgIGl0ZW1zLmVhY2goZnVuY3Rpb24oZGF0dW0sIGluZGV4KSB7XG4gICAgICBjb25zdCBpdGVtID0gdGhpcztcbiAgICAgIGNvbnN0IHNoYXBlID0gdGhhdC5faXRlbVNoYXBlTWFwLmdldChpdGVtKTtcbiAgICAgIHNoYXBlLnVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBpdGVtLCBkYXR1bSwgaW5kZXgpO1xuICAgIH0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGF5ZXI7XG4iXX0=