"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var d3Scale = require("d3-scale");
var d3Selection = require("d3-selection");

var events = require("events");
var ns = require("./namespace");
var Segment = require("../shapes/segment");
var SegmentBehavior = require("../behaviors/segment-behavior");

// private item -> id map to force d3 tp keep in sync with the DOM
var _counter = 0;
var _datumIdMap = new _core.Map();

var Layer = (function (_events$EventEmitter) {
  /**
   * Structure of the DOM view of a Layer
   *
   * <g class="layer"> Flip y axis, timeContext.start and top position from params are applied on this elmt
   *   <svg class="bounding-box"> timeContext.duration is applied on this elmt
   *    <g class="layer-interactions"> Contains the timeContext edition elements (a segment)
   *    </g>
   *    <g class="offset items"> The shapes are inserted here, and we apply timeContext.offset on this elmt
   *    </g>
   *   </svg>
   * </g>
   */

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
    this.d3items = null; // d3 collection of the layer items

    this._shapeConfiguration = null; // { ctor, accessors, options }
    this._commonShapeConfiguration = null; // { ctor, accessors, options }

    this._itemElShapeMap = new _core.Map(); // item group <DOMElement> => shape
    this._itemElD3SelectionMap = new _core.Map(); // item group <DOMElement> => shape
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
       * @mandatory define the context in which the layer is drawn
       * @param context {TimeContext} the timeContext in which the layer is displayed
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
      value: function select() {
        var _this = this;

        for (var _len = arguments.length, itemEls = Array(_len), _key = 0; _key < _len; _key++) {
          itemEls[_key] = arguments[_key];
        }

        if (!this._behavior) {
          return;
        }
        if (!itemEls.length) {
          itemEls = this.d3items.nodes();
        }

        itemEls.forEach(function (el) {
          var item = _this._itemElD3SelectionMap.get(el);
          _this._behavior.select(el, item.datum());
          _this._toFront(el);
        });
      }
    },
    unselect: {
      value: function unselect() {
        var _this = this;

        for (var _len = arguments.length, itemEls = Array(_len), _key = 0; _key < _len; _key++) {
          itemEls[_key] = arguments[_key];
        }

        if (!this._behavior) {
          return;
        }
        if (!itemEls.length) {
          itemEls = this.d3items.nodes();
        }

        itemEls.forEach(function (el) {
          var item = _this._itemElD3SelectionMap.get(el);
          _this._behavior.unselect(el, item.datum());
        });
      }
    },
    toggleSelection: {
      value: function toggleSelection() {
        var _this = this;

        for (var _len = arguments.length, itemEls = Array(_len), _key = 0; _key < _len; _key++) {
          itemEls[_key] = arguments[_key];
        }

        if (!this._behavior) {
          return;
        }
        if (!itemEls.length) {
          itemEls = this.d3items.nodes();
        }

        itemEls.forEach(function (el) {
          var item = _this._itemElD3SelectionMap.get(el);
          _this._behavior.toggleSelection(el, item.datum());
        });
      }
    },
    edit: {
      value: function edit(itemEls, dx, dy, target) {
        var _this = this;

        if (!this._behavior) {
          return;
        }
        itemEls = !Array.isArray(itemEls) ? [itemEls] : itemEls;

        itemEls.forEach(function (el) {
          var item = _this._itemElD3SelectionMap.get(el);
          var shape = _this._itemElShapeMap.get(el);
          var datum = item.datum();
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
       *  moves an `el`'s group to the end of the layer (svg z-index...)
       *  @param `el` {DOMElement} the DOMElement to be moved
       */

      value: function _toFront(el) {
        this.group.appendChild(el);
      }
    },
    getItemFromDOMElement: {

      /**
       *  return the d3Selection item to which the given DOMElement belongs
       *  @param `el` {DOMElement} the element to be tested
       *  @return {mixed}
       *    {DOMElelement} item group containing the `el` if belongs to this layer
       *    {null} otherwise
       */

      value: function getItemFromDOMElement(el) {
        var itemEl = undefined;

        do {
          if (el.classList && el.classList.contains("item")) {
            itemEl = el;
          }

          el = el.parentNode;
        } while (el != undefined);

        return this.hasItem(itemEl) ? itemEl : null;
      }
    },
    getDatumFromItem: {

      /**
       *  returns the datum associated to a specific item DOMElement
       *  use d3 internally to retrieve the datum
       *  @param itemEl {DOMElement}
       *  @return {Object|Array} depending on the user data structure
       */

      value: function getDatumFromItem(itemEl) {
        var d3item = this._itemElD3SelectionMap.get(itemEl);
        return d3item ? d3item.datum() : null;
      }
    },
    hasItem: {

      /**
       *  Define if the given d3 selection is an item of the layer
       *  @param item {DOMElement}
       *  @return {bool}
       */

      value: function hasItem(itemEl) {
        var nodes = this.d3items.nodes();
        return nodes.indexOf(itemEl) !== -1;
      }
    },
    hasElement: {

      /**
       *  Define if a given element belongs to the layer
       *  is more general than `hasItem`, can be used to check interaction elements too
       *  @param el {DOMElement}
       *  @return {bool}
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

        var itemShapeMap = this._itemElShapeMap;
        var renderingContext = this._renderingContext;

        var items = this.d3items.filter(function (datum, index) {
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
        this.d3items = d3Selection.select(this.group).selectAll(".item").filter(function () {
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
        this.d3items.enter().append(function (datum, index) {
          // @NOTE: d3 binds `this` to the container group
          var _shapeConfiguration = _this._shapeConfiguration;
          var ctor = _shapeConfiguration.ctor;
          var accessors = _shapeConfiguration.accessors;
          var options = _shapeConfiguration.options;

          var shape = new ctor(options);
          shape.install(accessors);

          var el = shape.render(_this._renderingContext);
          el.classList.add("item", shape.getClassName());
          _this._itemElShapeMap.set(el, shape);
          _this._itemElD3SelectionMap.set(el, d3Selection.select(el));

          return el;
        });

        // ... exit
        var _itemElShapeMap = this._itemElShapeMap;
        var _itemElD3SelectionMap = this._itemElD3SelectionMap;

        this.d3items.exit().each(function (datum, index) {
          var el = this;
          var shape = _itemElShapeMap.get(el);
          // clean all shape/item references
          shape.destroy();
          _datumIdMap["delete"](datum);
          _itemElShapeMap["delete"](el);
          _itemElD3SelectionMap["delete"](el);
        }).remove();
      }
    },
    update: {

      /**
       *  updates Context and Shapes
       */

      value: function update() {
        this.updateContainer();
        this.updateShapes();
      }
    },
    updateContainer: {

      /**
       *  updates the context of the layer
       */

      value: function updateContainer() {
        this._updateRenderingContext();

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

        this._updateRenderingContext();

        var that = this;
        var renderingContext = this._renderingContext;
        var items = item !== null ? d3Selection.select(item) : this.d3items;

        // update common shapes
        this._itemCommonShapeMap.forEach(function (shape, item) {
          shape.update(renderingContext, item, _this.data);
        });

        // d3 update - entity or collection shapes
        items.each(function (datum, index) {
          var el = this;
          var shape = that._itemElShapeMap.get(el);
          shape.update(renderingContext, el, datum, index);
        });
      }
    }
  });

  return Layer;
})(events.EventEmitter);

module.exports = Layer;
//# sourceMappingURL=data:application/json;base64,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QUFBLHdCQUFjOzs7WUFBYixJQUFJLGdDQUFHLElBQUk7O0FBQ3RCLFlBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDOztBQUUvQixZQUFNLElBQUksR0FBRyxJQUFJLENBQUM7QUFDbEIsWUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7QUFDaEQsWUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLElBQUksR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7OztBQUd0RSxZQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFFLElBQUksRUFBSztBQUNoRCxlQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRSxNQUFLLElBQUksQ0FBQyxDQUFDO1NBQ2pELENBQUMsQ0FBQzs7O0FBR0gsYUFBSyxDQUFDLElBQUksQ0FBQyxVQUFTLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDaEMsY0FBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLGNBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNDLGVBQUssQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNsRCxDQUFDLENBQUM7T0FDSjs7OztTQXBmRyxLQUFLO0dBQVMsTUFBTSxDQUFDLFlBQVk7O0FBdWZ2QyxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyIsImZpbGUiOiJlczYvY29yZS9sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGQzU2NhbGUgPSByZXF1aXJlKCdkMy1zY2FsZScpO1xuY29uc3QgZDNTZWxlY3Rpb24gPSByZXF1aXJlKCdkMy1zZWxlY3Rpb24nKTtcblxuY29uc3QgZXZlbnRzID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5jb25zdCBucyA9IHJlcXVpcmUoJy4vbmFtZXNwYWNlJyk7XG5jb25zdCBTZWdtZW50ID0gcmVxdWlyZSgnLi4vc2hhcGVzL3NlZ21lbnQnKTtcbmNvbnN0IFNlZ21lbnRCZWhhdmlvciA9IHJlcXVpcmUoJy4uL2JlaGF2aW9ycy9zZWdtZW50LWJlaGF2aW9yJyk7XG5cblxuLy8gcHJpdmF0ZSBpdGVtIC0+IGlkIG1hcCB0byBmb3JjZSBkMyB0cCBrZWVwIGluIHN5bmMgd2l0aCB0aGUgRE9NXG5sZXQgX2NvdW50ZXIgPSAwO1xuY29uc3QgX2RhdHVtSWRNYXAgPSBuZXcgTWFwKCk7XG5cblxuY2xhc3MgTGF5ZXIgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIFN0cnVjdHVyZSBvZiB0aGUgRE9NIHZpZXcgb2YgYSBMYXllclxuICAgKlxuICAgKiA8ZyBjbGFzcz1cImxheWVyXCI+IEZsaXAgeSBheGlzLCB0aW1lQ29udGV4dC5zdGFydCBhbmQgdG9wIHBvc2l0aW9uIGZyb20gcGFyYW1zIGFyZSBhcHBsaWVkIG9uIHRoaXMgZWxtdFxuICAgKiAgIDxzdmcgY2xhc3M9XCJib3VuZGluZy1ib3hcIj4gdGltZUNvbnRleHQuZHVyYXRpb24gaXMgYXBwbGllZCBvbiB0aGlzIGVsbXRcbiAgICogICAgPGcgY2xhc3M9XCJsYXllci1pbnRlcmFjdGlvbnNcIj4gQ29udGFpbnMgdGhlIHRpbWVDb250ZXh0IGVkaXRpb24gZWxlbWVudHMgKGEgc2VnbWVudClcbiAgICogICAgPC9nPlxuICAgKiAgICA8ZyBjbGFzcz1cIm9mZnNldCBpdGVtc1wiPiBUaGUgc2hhcGVzIGFyZSBpbnNlcnRlZCBoZXJlLCBhbmQgd2UgYXBwbHkgdGltZUNvbnRleHQub2Zmc2V0IG9uIHRoaXMgZWxtdFxuICAgKiAgICA8L2c+XG4gICAqICAgPC9zdmc+XG4gICAqIDwvZz5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRhdGFUeXBlLCBkYXRhLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZGF0YVR5cGUgPSBkYXRhVHlwZTsgLy8gJ2VudGl0eScgfHwgJ2NvbGxlY3Rpb24nO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGhlaWdodDogMTAwLFxuICAgICAgdG9wOiAwLFxuICAgICAgaWQ6ICcnLFxuICAgICAgeURvbWFpbjogWzAsIDFdLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIGRlYnVnQ29udGV4dDogZmFsc2UsIC8vIHBhc3MgdGhlIGNvbnRleHQgaW4gZGVidWcgbW9kZVxuICAgICAgY29udGV4dEhhbmRsZXJXaWR0aDogMlxuICAgIH07XG5cbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbnVsbDtcblxuICAgIHRoaXMuY29udGFpbmVyID0gbnVsbDsgLy8gb2Zmc2V0IGdyb3VwIG9mIHRoZSBwYXJlbnQgY29udGV4dFxuICAgIHRoaXMuZ3JvdXAgPSBudWxsOyAvLyBncm91cCBjcmVhdGVkIGJ5IHRoZSBsYXllciBpbnNpZGUgdGhlIGNvbnRleHRcbiAgICB0aGlzLmQzaXRlbXMgPSBudWxsOyAvLyBkMyBjb2xsZWN0aW9uIG9mIHRoZSBsYXllciBpdGVtc1xuXG4gICAgdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uID0gbnVsbDsgLy8geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfVxuICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiA9IG51bGw7IC8vIHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH1cblxuICAgIHRoaXMuX2l0ZW1FbFNoYXBlTWFwID0gbmV3IE1hcCgpOyAvLyBpdGVtIGdyb3VwIDxET01FbGVtZW50PiA9PiBzaGFwZVxuICAgIHRoaXMuX2l0ZW1FbEQzU2VsZWN0aW9uTWFwID0gbmV3IE1hcCgpOyAvLyBpdGVtIGdyb3VwIDxET01FbGVtZW50PiA9PiBzaGFwZVxuICAgIHRoaXMuX2l0ZW1Db21tb25TaGFwZU1hcCA9IG5ldyBNYXAoKTsgLy8gb25lIGVudHJ5IG1heCBpbiB0aGlzIG1hcFxuXG4gICAgdGhpcy5faXNDb250ZXh0RWRpdGFibGUgPSBmYWxzZTtcbiAgICB0aGlzLl9iZWhhdmlvciA9IG51bGw7XG5cbiAgICB0aGlzLl95U2NhbGUgPSBkM1NjYWxlLmxpbmVhcigpXG4gICAgICAuZG9tYWluKHRoaXMucGFyYW1zLnlEb21haW4pXG4gICAgICAucmFuZ2UoWzAsIHRoaXMucGFyYW1zLmhlaWdodF0pO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSB0aW1lQ29udGV4dCBsYXlvdXRcbiAgICB0aGlzLl9yZW5kZXIoKTtcbiAgfVxuXG4gIHNldCB5RG9tYWluKGRvbWFpbikge1xuICAgIHRoaXMucGFyYW1zLnlEb21haW4gPSBkb21haW47XG4gICAgdGhpcy5feVNjYWxlLmRvbWFpbihkb21haW4pO1xuICB9XG5cbiAgZ2V0IHlEb21haW4oKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLnlEb21haW47XG4gIH1cblxuICBzZXQgb3BhY2l0eSh2YWx1ZSkge1xuICAgIHRoaXMucGFyYW1zLm9wYWNpdHkgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBvcGFjaXR5KCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuICB9XG5cbiAgLyoqXG4gICAqIEBtYW5kYXRvcnkgZGVmaW5lIHRoZSBjb250ZXh0IGluIHdoaWNoIHRoZSBsYXllciBpcyBkcmF3blxuICAgKiBAcGFyYW0gY29udGV4dCB7VGltZUNvbnRleHR9IHRoZSB0aW1lQ29udGV4dCBpbiB3aGljaCB0aGUgbGF5ZXIgaXMgZGlzcGxheWVkXG4gICAqL1xuICBzZXRUaW1lQ29udGV4dCh0aW1lQ29udGV4dCkge1xuICAgIHRoaXMudGltZUNvbnRleHQgPSB0aW1lQ29udGV4dDtcbiAgICAvLyBjcmVhdGUgYSBtaXhpbiB0byBwYXNzIHRvIHRoZSBzaGFwZXNcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0ID0ge307XG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gRGF0YVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGdldCBkYXRhKCkgeyByZXR1cm4gdGhpcy5fZGF0YTsgfVxuXG4gIHNldCBkYXRhKGRhdGEpIHtcbiAgICBzd2l0Y2ggKHRoaXMuZGF0YVR5cGUpIHtcbiAgICAgIGNhc2UgJ2VudGl0eSc6XG4gICAgICAgIGlmICh0aGlzLl9kYXRhKSB7ICAvLyBpZiBkYXRhIGFscmVhZHkgZXhpc3RzLCByZXVzZSB0aGUgcmVmZXJlbmNlXG4gICAgICAgICAgdGhpcy5fZGF0YVswXSA9IGRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fZGF0YSA9IFtkYXRhXTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbGxlY3Rpb24nOlxuICAgICAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ29tcG9uZW50IENvbmZpZ3VyYXRpb25cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIFJlZ2lzdGVyIHRoZSBzaGFwZSBhbmQgaXRzIGFjY2Vzc29ycyB0byB1c2UgaW4gb3JkZXIgdG8gcmVuZGVyXG4gICAqICB0aGUgZW50aXR5IG9yIGNvbGxlY3Rpb25cbiAgICogIEBwYXJhbSBjdG9yIDxGdW5jdGlvbjpCYXNlU2hhcGU+IHRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgc2hhcGUgdG8gYmUgdXNlZFxuICAgKiAgQHBhcmFtIGFjY2Vzc29ycyA8T2JqZWN0PiBhY2Nlc3NvcnMgdG8gdXNlIGluIG9yZGVyIHRvIG1hcCB0aGUgZGF0YSBzdHJ1Y3R1cmVcbiAgICovXG4gIGNvbmZpZ3VyZVNoYXBlKGN0b3IsIGFjY2Vzc29ycyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb24gPSB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9O1xuICB9XG5cbiAgLyoqXG4gICAqICBSZWdpc3RlciB0aGUgc2hhcGUgdG8gdXNlIHdpdGggdGhlIGVudGlyZSBjb2xsZWN0aW9uXG4gICAqICBleGFtcGxlOiB0aGUgbGluZSBpbiBhIGJlYWtwb2ludCBmdW5jdGlvblxuICAgKiAgQHBhcmFtIGN0b3Ige0Jhc2VTaGFwZX0gdGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBzaGFwZSB0byB1c2UgdG8gcmVuZGVyIGRhdGFcbiAgICogIEBwYXJhbSBhY2Nlc3NvcnMge09iamVjdH0gYWNjZXNzb3JzIHRvIHVzZSBpbiBvcmRlciB0byBtYXAgdGhlIGRhdGEgc3RydWN0dXJlXG4gICAqL1xuICBjb25maWd1cmVDb21tb25TaGFwZShjdG9yLCBhY2Nlc3NvcnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uID0geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgUmVnaXN0ZXIgdGhlIGJlaGF2aW9yIHRvIHVzZSB3aGVuIGludGVyYWN0aW5nIHdpdGggdGhlIHNoYXBlXG4gICAqICBAcGFyYW0gYmVoYXZpb3Ige0Jhc2VCZWhhdmlvcn1cbiAgICovXG4gIHNldEJlaGF2aW9yKGJlaGF2aW9yKSB7XG4gICAgYmVoYXZpb3IuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICB0aGlzLl9iZWhhdmlvciA9IGJlaGF2aW9yO1xuICB9XG5cbiAgLyoqXG4gICAqICB1cGRhdGUgdGhlIHZhbHVlcyBpbiBgX3JlbmRlcmluZ0NvbnRleHRgXG4gICAqICBpcyBwYXJ0aWN1bGFyeSBuZWVkZWQgd2hlbiB1cGRhdGluZyBgc3RyZXRjaFJhdGlvYCBhcyB0aGUgcG9pbnRlclxuICAgKiAgdG8gdGhlIGB4U2NhbGVgIG1heSBjaGFuZ2VcbiAgICovXG4gIF91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCkge1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQueFNjYWxlID0gdGhpcy50aW1lQ29udGV4dC54U2NhbGU7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC55U2NhbGUgPSB0aGlzLl95U2NhbGU7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC53aWR0aCAgPSB0aGlzLnRpbWVDb250ZXh0LnhTY2FsZSh0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uKTtcbiAgICAvLyBmb3IgZm9yZWlnbiBvamVjdCBpc3N1ZSBpbiBjaHJvbWVcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0Lm9mZnNldFggPSB0aGlzLnRpbWVDb250ZXh0LnhTY2FsZSh0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBCZWhhdmlvciBBY2Nlc3NvcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBnZXQgc2VsZWN0ZWRJdGVtcygpIHtcbiAgICByZXR1cm4gdGhpcy5fYmVoYXZpb3IgPyB0aGlzLl9iZWhhdmlvci5zZWxlY3RlZEl0ZW1zIDogW107XG4gIH1cblxuICBzZWxlY3QoLi4uaXRlbUVscykge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3IpIHsgcmV0dXJuOyB9XG4gICAgaWYgKCFpdGVtRWxzLmxlbmd0aCkgeyBpdGVtRWxzID0gdGhpcy5kM2l0ZW1zLm5vZGVzKCk7IH1cblxuICAgIGl0ZW1FbHMuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLl9pdGVtRWxEM1NlbGVjdGlvbk1hcC5nZXQoZWwpO1xuICAgICAgdGhpcy5fYmVoYXZpb3Iuc2VsZWN0KGVsLCBpdGVtLmRhdHVtKCkpO1xuICAgICAgdGhpcy5fdG9Gcm9udChlbCk7XG4gICAgfSk7XG4gIH1cblxuICB1bnNlbGVjdCguLi5pdGVtRWxzKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICBpZiAoIWl0ZW1FbHMubGVuZ3RoKSB7IGl0ZW1FbHMgPSB0aGlzLmQzaXRlbXMubm9kZXMoKTsgfVxuXG4gICAgaXRlbUVscy5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgY29uc3QgaXRlbSA9IHRoaXMuX2l0ZW1FbEQzU2VsZWN0aW9uTWFwLmdldChlbCk7XG4gICAgICB0aGlzLl9iZWhhdmlvci51bnNlbGVjdChlbCwgaXRlbS5kYXR1bSgpKTtcbiAgICB9KTtcbiAgfVxuXG4gIHRvZ2dsZVNlbGVjdGlvbiguLi5pdGVtRWxzKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICBpZiAoIWl0ZW1FbHMubGVuZ3RoKSB7IGl0ZW1FbHMgPSB0aGlzLmQzaXRlbXMubm9kZXMoKTsgfVxuXG4gICAgaXRlbUVscy5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgY29uc3QgaXRlbSA9IHRoaXMuX2l0ZW1FbEQzU2VsZWN0aW9uTWFwLmdldChlbCk7XG4gICAgICB0aGlzLl9iZWhhdmlvci50b2dnbGVTZWxlY3Rpb24oZWwsIGl0ZW0uZGF0dW0oKSk7XG4gICAgfSk7XG4gIH1cblxuICBlZGl0KGl0ZW1FbHMsIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICBpdGVtRWxzID0gIUFycmF5LmlzQXJyYXkoaXRlbUVscykgPyBbaXRlbUVsc10gOiBpdGVtRWxzO1xuXG4gICAgaXRlbUVscy5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgY29uc3QgaXRlbSAgPSB0aGlzLl9pdGVtRWxEM1NlbGVjdGlvbk1hcC5nZXQoZWwpO1xuICAgICAgY29uc3Qgc2hhcGUgPSB0aGlzLl9pdGVtRWxTaGFwZU1hcC5nZXQoZWwpO1xuICAgICAgY29uc3QgZGF0dW0gPSBpdGVtLmRhdHVtKCk7XG4gICAgICB0aGlzLl9iZWhhdmlvci5lZGl0KHRoaXMuX3JlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpO1xuICAgICAgdGhpcy5lbWl0KCdlZGl0Jywgc2hhcGUsIGRhdHVtKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEhlbHBlcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIG1vdmVzIGFuIGBlbGAncyBncm91cCB0byB0aGUgZW5kIG9mIHRoZSBsYXllciAoc3ZnIHotaW5kZXguLi4pXG4gICAqICBAcGFyYW0gYGVsYCB7RE9NRWxlbWVudH0gdGhlIERPTUVsZW1lbnQgdG8gYmUgbW92ZWRcbiAgICovXG4gIF90b0Zyb250KGVsKSB7XG4gICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZChlbCk7XG4gIH1cblxuICAvKipcbiAgICogIHJldHVybiB0aGUgZDNTZWxlY3Rpb24gaXRlbSB0byB3aGljaCB0aGUgZ2l2ZW4gRE9NRWxlbWVudCBiZWxvbmdzXG4gICAqICBAcGFyYW0gYGVsYCB7RE9NRWxlbWVudH0gdGhlIGVsZW1lbnQgdG8gYmUgdGVzdGVkXG4gICAqICBAcmV0dXJuIHttaXhlZH1cbiAgICogICAge0RPTUVsZWxlbWVudH0gaXRlbSBncm91cCBjb250YWluaW5nIHRoZSBgZWxgIGlmIGJlbG9uZ3MgdG8gdGhpcyBsYXllclxuICAgKiAgICB7bnVsbH0gb3RoZXJ3aXNlXG4gICAqL1xuICBnZXRJdGVtRnJvbURPTUVsZW1lbnQoZWwpIHtcbiAgICBsZXQgaXRlbUVsO1xuXG4gICAgZG8ge1xuICAgICAgaWYgKGVsLmNsYXNzTGlzdCAmJiBlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2l0ZW0nKSkge1xuICAgICAgICBpdGVtRWwgPSBlbDtcbiAgICAgIH1cblxuICAgICAgZWwgPSBlbC5wYXJlbnROb2RlO1xuICAgIH0gd2hpbGUgKGVsICE9IHVuZGVmaW5lZCk7XG5cbiAgICByZXR1cm4gdGhpcy5oYXNJdGVtKGl0ZW1FbCkgPyBpdGVtRWwgOsKgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiAgcmV0dXJucyB0aGUgZGF0dW0gYXNzb2NpYXRlZCB0byBhIHNwZWNpZmljIGl0ZW0gRE9NRWxlbWVudFxuICAgKiAgdXNlIGQzIGludGVybmFsbHkgdG8gcmV0cmlldmUgdGhlIGRhdHVtXG4gICAqICBAcGFyYW0gaXRlbUVsIHtET01FbGVtZW50fVxuICAgKiAgQHJldHVybiB7T2JqZWN0fEFycmF5fSBkZXBlbmRpbmcgb24gdGhlIHVzZXIgZGF0YSBzdHJ1Y3R1cmVcbiAgICovXG4gIGdldERhdHVtRnJvbUl0ZW0oaXRlbUVsKSB7XG4gICAgY29uc3QgZDNpdGVtID0gdGhpcy5faXRlbUVsRDNTZWxlY3Rpb25NYXAuZ2V0KGl0ZW1FbCk7XG4gICAgcmV0dXJuIGQzaXRlbSA/IGQzaXRlbS5kYXR1bSgpIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRGVmaW5lIGlmIHRoZSBnaXZlbiBkMyBzZWxlY3Rpb24gaXMgYW4gaXRlbSBvZiB0aGUgbGF5ZXJcbiAgICogIEBwYXJhbSBpdGVtIHtET01FbGVtZW50fVxuICAgKiAgQHJldHVybiB7Ym9vbH1cbiAgICovXG4gIGhhc0l0ZW0oaXRlbUVsKSB7XG4gICAgY29uc3Qgbm9kZXMgPSB0aGlzLmQzaXRlbXMubm9kZXMoKTtcbiAgICByZXR1cm4gbm9kZXMuaW5kZXhPZihpdGVtRWwpICE9PSAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRGVmaW5lIGlmIGEgZ2l2ZW4gZWxlbWVudCBiZWxvbmdzIHRvIHRoZSBsYXllclxuICAgKiAgaXMgbW9yZSBnZW5lcmFsIHRoYW4gYGhhc0l0ZW1gLCBjYW4gYmUgdXNlZCB0byBjaGVjayBpbnRlcmFjdGlvbiBlbGVtZW50cyB0b29cbiAgICogIEBwYXJhbSBlbCB7RE9NRWxlbWVudH1cbiAgICogIEByZXR1cm4ge2Jvb2x9XG4gICAqL1xuICBoYXNFbGVtZW50KGVsKSB7XG4gICAgZG8ge1xuICAgICAgaWYgKGVsID09PSB0aGlzLmNvbnRhaW5lcikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgZWwgPSBlbC5wYXJlbnROb2RlO1xuICAgIH0gd2hpbGUgKGVsICE9IHVuZGVmaW5lZCk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogIEBwYXJhbSBhcmVhIHtPYmplY3R9IGFyZWEgaW4gd2hpY2ggdG8gZmluZCB0aGUgZWxlbWVudHNcbiAgICogIEByZXR1cm4ge0FycmF5fSBsaXN0IG9mIHRoZSBET00gZWxlbWVudHMgaW4gdGhlIGdpdmVuIGFyZWFcbiAgICovXG4gIGdldEl0ZW1zSW5BcmVhKGFyZWEpIHtcbiAgICBjb25zdCBzdGFydCAgICA9IHRoaXMudGltZUNvbnRleHQueFNjYWxlKHRoaXMudGltZUNvbnRleHQuc3RhcnQpO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy50aW1lQ29udGV4dC54U2NhbGUodGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbik7XG4gICAgY29uc3Qgb2Zmc2V0ICAgPSB0aGlzLnRpbWVDb250ZXh0LnhTY2FsZSh0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCk7XG4gICAgY29uc3QgdG9wICAgICAgPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgLy8gYmUgYXdhcmUgYWYgY29udGV4dCdzIHRyYW5zbGF0aW9ucyAtIGNvbnN0cmFpbiBpbiB3b3JraW5nIHZpZXdcbiAgICBsZXQgeDEgPSBNYXRoLm1heChhcmVhLmxlZnQsIHN0YXJ0KTtcbiAgICBsZXQgeDIgPSBNYXRoLm1pbihhcmVhLmxlZnQgKyBhcmVhLndpZHRoLCBzdGFydCArIGR1cmF0aW9uKTtcbiAgICB4MSAtPSAoc3RhcnQgKyBvZmZzZXQpO1xuICAgIHgyIC09IChzdGFydCArIG9mZnNldCk7XG4gICAgLy8ga2VlcCBjb25zaXN0ZW50IHdpdGggY29udGV4dCB5IGNvb3JkaW5hdGVzIHN5c3RlbVxuICAgIGxldCB5MSA9IHRoaXMucGFyYW1zLmhlaWdodCAtIChhcmVhLnRvcCArIGFyZWEuaGVpZ2h0KTtcbiAgICBsZXQgeTIgPSB0aGlzLnBhcmFtcy5oZWlnaHQgLSBhcmVhLnRvcDtcblxuICAgIHkxICs9IHRoaXMucGFyYW1zLnRvcDtcbiAgICB5MiArPSB0aGlzLnBhcmFtcy50b3A7XG5cbiAgICBjb25zdCBpdGVtU2hhcGVNYXAgPSB0aGlzLl9pdGVtRWxTaGFwZU1hcDtcbiAgICBjb25zdCByZW5kZXJpbmdDb250ZXh0ID0gdGhpcy5fcmVuZGVyaW5nQ29udGV4dDtcblxuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5kM2l0ZW1zLmZpbHRlcihmdW5jdGlvbihkYXR1bSwgaW5kZXgpIHtcbiAgICAgIGNvbnN0IGdyb3VwID0gdGhpcztcbiAgICAgIGNvbnN0IHNoYXBlID0gaXRlbVNoYXBlTWFwLmdldChncm91cCk7XG4gICAgICByZXR1cm4gc2hhcGUuaW5BcmVhKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaXRlbXNbMF0uc2xpY2UoMCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZW5kZXJpbmcgLyBEaXNwbGF5IG1ldGhvZHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIHJlbmRlciB0aGUgRE9NIGluIG1lbW9yeSBvbiBsYXllciBjcmVhdGlvbiB0byBiZSBhYmxlIHRvIHVzZSBpdCBiZWZvcmVcbiAgICogIHRoZSBsYXllciBpcyBhY3R1YWxseSBpbnNlcnRlZCBpbiB0aGUgRE9NXG4gICAqL1xuICBfcmVuZGVyKCkge1xuICAgIC8vIHdyYXBwZXIgZ3JvdXAgZm9yIGBzdGFydCwgdG9wIGFuZCBjb250ZXh0IGZsaXAgbWF0cml4XG4gICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnbGF5ZXInKTtcbiAgICAvLyBjbGlwIHRoZSBjb250ZXh0IHdpdGggYSBgc3ZnYCBlbGVtZW50XG4gICAgdGhpcy5ib3VuZGluZ0JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3N2ZycpO1xuICAgIHRoaXMuYm91bmRpbmdCb3guY2xhc3NMaXN0LmFkZCgnYm91bmRpbmctYm94Jyk7XG4gICAgLy8gZ3JvdXAgdG8gYXBwbHkgb2Zmc2V0XG4gICAgdGhpcy5ncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLmdyb3VwLmNsYXNzTGlzdC5hZGQoJ29mZnNldCcsICdpdGVtcycpO1xuICAgIC8vIGNvbnRleHQgaW50ZXJhY3Rpb25zXG4gICAgdGhpcy5pbnRlcmFjdGlvbnNHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLmludGVyYWN0aW9uc0dyb3VwLmNsYXNzTGlzdC5hZGQoJ2xheWVyLWludGVyYWN0aW9ucycpO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zR3JvdXAuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAvLyBATk9URTogd29ya3MgYnV0IGtpbmcgb2YgdWdseS4uLiBzaG91bGQgYmUgY2xlYW5lZFxuICAgIHRoaXMuY29udGV4dFNoYXBlID0gbmV3IFNlZ21lbnQoKTtcbiAgICB0aGlzLmNvbnRleHRTaGFwZS5pbnN0YWxsKHtcbiAgICAgIG9wYWNpdHk6ICgpID0+IDAuMSxcbiAgICAgIGNvbG9yICA6ICgpID0+ICcjNzg3ODc4JyxcbiAgICAgIHdpZHRoICA6ICgpID0+IHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24sXG4gICAgICBoZWlnaHQgOiAoKSA9PiB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnlTY2FsZS5kb21haW4oKVsxXSxcbiAgICAgIHkgICAgICA6ICgpID0+IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQueVNjYWxlLmRvbWFpbigpWzBdXG4gICAgfSk7XG5cbiAgICB0aGlzLmludGVyYWN0aW9uc0dyb3VwLmFwcGVuZENoaWxkKHRoaXMuY29udGV4dFNoYXBlLnJlbmRlcigpKTtcbiAgICAvLyBjcmVhdGUgdGhlIERPTSB0cmVlXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5ib3VuZGluZ0JveCk7XG4gICAgdGhpcy5ib3VuZGluZ0JveC5hcHBlbmRDaGlsZCh0aGlzLmludGVyYWN0aW9uc0dyb3VwKTtcbiAgICB0aGlzLmJvdW5kaW5nQm94LmFwcGVuZENoaWxkKHRoaXMuZ3JvdXApO1xuXG4gICAgLy8gZHJhdyBhIFNlZ21lbnQgaW4gY29udGV4dCBiYWNrZ3JvdW5kIHRvIGRlYnVnIGl0J3Mgc2l6ZVxuICAgIGlmICh0aGlzLnBhcmFtcy5kZWJ1Zykge1xuICAgICAgdGhpcy5kZWJ1Z1JlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdTZWdtZW50Jyk7XG4gICAgICB0aGlzLmJvdW5kaW5nQm94LmFwcGVuZENoaWxkKHRoaXMuZGVidWdSZWN0KTtcbiAgICAgIHRoaXMuZGVidWdSZWN0LnN0eWxlLmZpbGwgPSAnI2FiYWJhYic7XG4gICAgICB0aGlzLmRlYnVnUmVjdC5zdHlsZS5maWxsT3BhY2l0eSA9IDAuMTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIENyZWF0ZXMgdGhlIGxheWVyIGdyb3VwIHdpdGggYSB0cmFuc2Zvcm1hdGlvblxuICAgKiAgbWF0cml4IHRvIGZsaXAgdGhlIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgKiAgQHJldHVybiB7RE9NRWxlbWVudH1cbiAgICovXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XG4gIH1cblxuICAvKipcbiAgICogIENyZWF0ZXMgdGhlIERPTSBhY2NvcmRpbmcgdG8gZ2l2ZW4gZGF0YSBhbmQgc2hhcGVzXG4gICAqL1xuICBkcmF3KCkge1xuICAgIC8vIGZvcmNlIGQzIHRvIGtlZXAgZGF0YSBpbiBzeW5jIHdpdGggdGhlIERPTSB3aXRoIGEgdW5pcXVlIGlkXG4gICAgdGhpcy5kYXRhLmZvckVhY2goZnVuY3Rpb24oZGF0dW0pIHtcbiAgICAgIGlmIChfZGF0dW1JZE1hcC5oYXMoZGF0dW0pKSB7IHJldHVybjsgfVxuICAgICAgX2RhdHVtSWRNYXAuc2V0KGRhdHVtLCBfY291bnRlcisrKTtcbiAgICB9KTtcblxuICAgIC8vIHNlbGVjdCBpdGVtc1xuICAgIHRoaXMuZDNpdGVtcyA9IGQzU2VsZWN0aW9uLnNlbGVjdCh0aGlzLmdyb3VwKVxuICAgICAgLnNlbGVjdEFsbCgnLml0ZW0nKVxuICAgICAgLmZpbHRlcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmNsYXNzTGlzdC5jb250YWlucygnY29tbW9uJyk7XG4gICAgICB9KVxuICAgICAgLmRhdGEodGhpcy5kYXRhLCBmdW5jdGlvbihkYXR1bSkge1xuICAgICAgICByZXR1cm4gX2RhdHVtSWRNYXAuZ2V0KGRhdHVtKTtcbiAgICAgIH0pO1xuXG4gICAgLy8gcmVuZGVyIGBjb21tb25TaGFwZWAgb25seSBvbmNlXG4gICAgaWYgKFxuICAgICAgdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uICE9PSBudWxsICYmXG4gICAgICB0aGlzLl9pdGVtQ29tbW9uU2hhcGVNYXAuc2l6ZSA9PT0gMFxuICAgICkge1xuICAgICAgY29uc3QgeyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfSA9IHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbjtcbiAgICAgIGNvbnN0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgY3RvcihvcHRpb25zKTtcblxuICAgICAgc2hhcGUuaW5zdGFsbChhY2Nlc3NvcnMpO1xuICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQoc2hhcGUucmVuZGVyKCkpO1xuICAgICAgZ3JvdXAuY2xhc3NMaXN0LmFkZCgnaXRlbScsICdjb21tb24nLCBzaGFwZS5nZXRDbGFzc05hbWUoKSk7XG5cbiAgICAgIHRoaXMuX2l0ZW1Db21tb25TaGFwZU1hcC5zZXQoZ3JvdXAsIHNoYXBlKTtcbiAgICAgIHRoaXMuZ3JvdXAuYXBwZW5kQ2hpbGQoZ3JvdXApO1xuICAgIH1cblxuICAgIC8vIC4uLiBlbnRlclxuICAgIHRoaXMuZDNpdGVtcy5lbnRlcigpXG4gICAgICAuYXBwZW5kKChkYXR1bSwgaW5kZXgpID0+IHtcbiAgICAgICAgLy8gQE5PVEU6IGQzIGJpbmRzIGB0aGlzYCB0byB0aGUgY29udGFpbmVyIGdyb3VwXG4gICAgICAgIGNvbnN0IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH0gPSB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb247XG4gICAgICAgIGNvbnN0IHNoYXBlID0gbmV3IGN0b3Iob3B0aW9ucyk7XG4gICAgICAgIHNoYXBlLmluc3RhbGwoYWNjZXNzb3JzKTtcblxuICAgICAgICBjb25zdCBlbCA9IHNoYXBlLnJlbmRlcih0aGlzLl9yZW5kZXJpbmdDb250ZXh0KVxuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdpdGVtJywgc2hhcGUuZ2V0Q2xhc3NOYW1lKCkpO1xuICAgICAgICB0aGlzLl9pdGVtRWxTaGFwZU1hcC5zZXQoZWwsIHNoYXBlKTtcbiAgICAgICAgdGhpcy5faXRlbUVsRDNTZWxlY3Rpb25NYXAuc2V0KGVsLCBkM1NlbGVjdGlvbi5zZWxlY3QoZWwpKTtcblxuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9KTtcblxuICAgIC8vIC4uLiBleGl0XG4gICAgY29uc3QgX2l0ZW1FbFNoYXBlTWFwID0gdGhpcy5faXRlbUVsU2hhcGVNYXA7XG4gICAgY29uc3QgX2l0ZW1FbEQzU2VsZWN0aW9uTWFwID0gdGhpcy5faXRlbUVsRDNTZWxlY3Rpb25NYXA7XG5cbiAgICB0aGlzLmQzaXRlbXMuZXhpdCgpXG4gICAgICAuZWFjaChmdW5jdGlvbihkYXR1bSwgaW5kZXgpIHtcbiAgICAgICAgY29uc3QgZWwgPSB0aGlzO1xuICAgICAgICBjb25zdCBzaGFwZSA9IF9pdGVtRWxTaGFwZU1hcC5nZXQoZWwpO1xuICAgICAgICAvLyBjbGVhbiBhbGwgc2hhcGUvaXRlbSByZWZlcmVuY2VzXG4gICAgICAgIHNoYXBlLmRlc3Ryb3koKTtcbiAgICAgICAgX2RhdHVtSWRNYXAuZGVsZXRlKGRhdHVtKTtcbiAgICAgICAgX2l0ZW1FbFNoYXBlTWFwLmRlbGV0ZShlbCk7XG4gICAgICAgIF9pdGVtRWxEM1NlbGVjdGlvbk1hcC5kZWxldGUoZWwpO1xuICAgICAgfSlcbiAgICAgIC5yZW1vdmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlcyBDb250ZXh0IGFuZCBTaGFwZXNcbiAgICovXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLnVwZGF0ZUNvbnRhaW5lcigpO1xuICAgIHRoaXMudXBkYXRlU2hhcGVzKCk7XG4gIH1cblxuICAvKipcbiAgICogIHVwZGF0ZXMgdGhlIGNvbnRleHQgb2YgdGhlIGxheWVyXG4gICAqL1xuICB1cGRhdGVDb250YWluZXIoKSB7XG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpO1xuXG4gICAgY29uc3Qgd2lkdGggID0gdGhpcy50aW1lQ29udGV4dC54U2NhbGUodGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbik7XG4gICAgLy8gb2Zmc2V0IGlzIHJlbGF0aXZlIHRvIHRpbWVsaW5lJ3MgdGltZUNvbnRleHRcbiAgICBjb25zdCB4ICAgICAgPSB0aGlzLnRpbWVDb250ZXh0LnBhcmVudC54U2NhbGUodGhpcy50aW1lQ29udGV4dC5zdGFydCk7XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGhpcy50aW1lQ29udGV4dC54U2NhbGUodGhpcy50aW1lQ29udGV4dC5vZmZzZXQpO1xuICAgIGNvbnN0IHRvcCAgICA9IHRoaXMucGFyYW1zLnRvcDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgLy8gbWF0cml4IHRvIGludmVydCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICBjb25zdCB0cmFuc2xhdGVNYXRyaXggPSBgbWF0cml4KDEsIDAsIDAsIC0xLCAke3h9LCAke3RvcCArIGhlaWdodH0pYDtcblxuICAgIHRoaXMuY29udGFpbmVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGVNYXRyaXgpO1xuXG4gICAgdGhpcy5ib3VuZGluZ0JveC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgdGhpcy5ib3VuZGluZ0JveC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICB0aGlzLmJvdW5kaW5nQm94LnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuXG4gICAgdGhpcy5ncm91cC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke29mZnNldH0sIDApYCk7XG5cbiAgICAvLyBtYWludGFpbiBjb250ZXh0IHNoYXBlXG4gICAgdGhpcy5jb250ZXh0U2hhcGUudXBkYXRlKFxuICAgICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dCxcbiAgICAgIHRoaXMuaW50ZXJhY3Rpb25zR3JvdXAsXG4gICAgICB0aGlzLnRpbWVDb250ZXh0LFxuICAgICAgMFxuICAgICk7XG5cbiAgICAvLyBkZWJ1ZyBjb250ZXh0XG4gICAgaWYgKHRoaXMucGFyYW1zLmRlYnVnKSB7XG4gICAgICB0aGlzLmRlYnVnUmVjdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgICB0aGlzLmRlYnVnUmVjdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIHVwZGF0ZXMgdGhlIFNoYXBlcyB3aGljaCBiZWxvbmdzIHRvIHRoZSBsYXllclxuICAgKiAgQHBhcmFtIGl0ZW0ge0RPTUVsZW1lbnR9XG4gICAqL1xuICB1cGRhdGVTaGFwZXMoaXRlbSA9IG51bGwpIHtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCk7XG5cbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICBjb25zdCByZW5kZXJpbmdDb250ZXh0ID0gdGhpcy5fcmVuZGVyaW5nQ29udGV4dDtcbiAgICBjb25zdCBpdGVtcyA9IGl0ZW0gIT09IG51bGwgPyBkM1NlbGVjdGlvbi5zZWxlY3QoaXRlbSkgOiB0aGlzLmQzaXRlbXM7XG5cbiAgICAvLyB1cGRhdGUgY29tbW9uIHNoYXBlc1xuICAgIHRoaXMuX2l0ZW1Db21tb25TaGFwZU1hcC5mb3JFYWNoKChzaGFwZSwgaXRlbSkgPT4ge1xuICAgICAgc2hhcGUudXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGl0ZW0sIHRoaXMuZGF0YSk7XG4gICAgfSk7XG5cbiAgICAvLyBkMyB1cGRhdGUgLSBlbnRpdHkgb3IgY29sbGVjdGlvbiBzaGFwZXNcbiAgICBpdGVtcy5lYWNoKGZ1bmN0aW9uKGRhdHVtLCBpbmRleCkge1xuICAgICAgY29uc3QgZWwgPSB0aGlzO1xuICAgICAgY29uc3Qgc2hhcGUgPSB0aGF0Ll9pdGVtRWxTaGFwZU1hcC5nZXQoZWwpO1xuICAgICAgc2hhcGUudXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGVsLCBkYXR1bSwgaW5kZXgpO1xuICAgIH0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGF5ZXI7XG4iXX0=