"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var d3Scale = _interopRequire(require("d3-scale"));

var d3Selection = _interopRequire(require("d3-selection"));

var events = _interopRequire(require("events"));

var ns = _interopRequire(require("./namespace"));

var Segment = _interopRequire(require("../shapes/segment"));

var SegmentBehavior = _interopRequire(require("../behaviors/segment-behavior"));

// private item -> id map to force d3 tp keep in sync with the DOM
var _counter = 0;
var _datumIdMap = new _core.Map();

var Layer = (function (_events$EventEmitter) {
  /**
   * Structure of the DOM view of a Layer
   *
   * <g class="layer"> Flip y axis, timeContext.start and top position from params are applied on this $elmt
   *   <svg class="bounding-box"> timeContext.duration is applied on this $elmt
   *    <g class="layer-interactions"> Contains the timeContext edition elements (a segment)
   *    </g>
   *    <g class="offset items"> The shapes are inserted here, and we apply timeContext.offset on this $elmt
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

    // container elements
    this.$el = null; // offset group of the parent context
    this.$boundingBox = null;
    this.$offset = null;
    this.$interactions = null;

    this.d3items = null; // d3 collection of the layer items

    this._shapeConfiguration = null; // { ctor, accessors, options }
    this._commonShapeConfiguration = null; // { ctor, accessors, options }

    this._$itemShapeMap = new _core.Map(); // item group <DOMElement> => shape
    this._$itemD3SelectionMap = new _core.Map(); // item group <DOMElement> => shape
    this._$itemCommonShapeMap = new _core.Map(); // one entry max in this map

    this._isContextEditable = false;
    this._behavior = null;

    this._yScale = d3Scale.linear().domain(this.params.yDomain).range([0, this.params.height]);

    this.contextBehavior = "";

    // initialize timeContext layout
    this._renderContainer();
  }

  _inherits(Layer, _events$EventEmitter);

  _createClass(Layer, {
    yDomain: {

      // destroy() {
      //   this.timeContext = null;
      //   this.d3items = null;
      //   this.data = null;
      //   this.params = null;
      //   this._behavior = null;
      //
      //   // @TODO
      //      - clean Maps
      //      - clean listeners
      //      - clean behavior (behavior._layer)
      // }

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
    _renderContainer: {

      // Initialization

      /**
       *  render the DOM in memory on layer creation to be able to use it before
       *  the layer is actually inserted in the DOM
       */

      value: function _renderContainer() {
        var _this = this;

        // wrapper group for `start, top and context flip matrix
        this.$el = document.createElementNS(ns, "g");
        this.$el.classList.add("layer");
        // clip the context with a `svg` element
        this.$boundingBox = document.createElementNS(ns, "svg");
        this.$boundingBox.classList.add("bounding-box");
        // group to apply offset
        this.$offset = document.createElementNS(ns, "g");
        this.$offset.classList.add("offset", "items");
        // context interactions
        this.$interactions = document.createElementNS(ns, "g");
        this.$interactions.classList.add("interactions");
        this.$interactions.style.display = "none";
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

        this.$interactions.appendChild(this.contextShape.render());
        // create the DOM tree
        this.$el.appendChild(this.$boundingBox);
        this.$boundingBox.appendChild(this.$offset);
        this.$boundingBox.appendChild(this.$interactions);

        // draw a Segment in context background to debug it's size
        if (this.params.debug) {
          this.$debugRect = document.createElementNS(ns, "Segment");
          this.$boundingBox.appendChild(this.$debugRect);
          this.$debugRect.style.fill = "#ababab";
          this.$debugRect.style.fillOpacity = 0.1;
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

        for (var _len = arguments.length, $items = Array(_len), _key = 0; _key < _len; _key++) {
          $items[_key] = arguments[_key];
        }

        if (!this._behavior) {
          return;
        }
        if (!$items.length) {
          $items = this.d3items.nodes();
        }

        $items.forEach(function ($el) {
          var item = _this._$itemD3SelectionMap.get($el);
          _this._behavior.select($el, item.datum());
          _this._toFront($el);
        });
      }
    },
    unselect: {
      value: function unselect() {
        var _this = this;

        for (var _len = arguments.length, $items = Array(_len), _key = 0; _key < _len; _key++) {
          $items[_key] = arguments[_key];
        }

        if (!this._behavior) {
          return;
        }
        if (!$items.length) {
          $items = this.d3items.nodes();
        }

        $items.forEach(function ($el) {
          var item = _this._$itemD3SelectionMap.get($el);
          _this._behavior.unselect($el, item.datum());
        });
      }
    },
    toggleS$election: {
      value: function toggleS$election() {
        var _this = this;

        for (var _len = arguments.length, $items = Array(_len), _key = 0; _key < _len; _key++) {
          $items[_key] = arguments[_key];
        }

        if (!this._behavior) {
          return;
        }
        if (!$items.length) {
          $items = this.d3items.nodes();
        }

        $items.forEach(function ($el) {
          var item = _this._$itemD3SelectionMap.get($el);
          _this._behavior.toggleS$election($el, item.datum());
        });
      }
    },
    edit: {
      value: function edit($items, dx, dy, target) {
        var _this = this;

        if (!this._behavior) {
          return;
        }
        $items = !Array.isArray($items) ? [$items] : $items;

        $items.forEach(function ($el) {
          var item = _this._$itemD3SelectionMap.get($el);
          var shape = _this._$itemShapeMap.get($el);
          var datum = item.datum();
          _this._behavior.edit(_this._renderingContext, shape, datum, dx, dy, target);
          _this.emit("edit", shape, datum);
        });
      }
    },
    editContext: {
      value: function editContext() {
        this.contextBehavior.edit();
      }
    },
    stretchContext: {
      value: function stretchContext() {
        this.contextBehavior.stretch();
      }
    },
    _toFront: {

      // --------------------------------------
      // H$elpers
      // --------------------------------------

      /**
       *  Moves an `$el`'s group to the end of the layer (svg z-index...)
       *  @param `$el` {DOMElement} the DOMElement to be moved
       */

      value: function _toFront($el) {
        this.$offset.appendChild($el);
      }
    },
    getItemFromDOMElement: {

      /**
       *  Returns the d3Selection item to which the given DOMElement b$elongs
       *  @param `$el` {DOMElement} the element to be tested
       *  @return {DOMElement|null} item group containing the `$el` if b$elongs to this layer, null otherwise
       */

      value: function getItemFromDOMElement($el) {
        var $item = undefined;

        do {
          if ($el.classList && $el.classList.contains("item")) {
            $item = $el;
            break;
          }

          $el = $el.parentNode;
        } while ($el !== null);

        return this.hasItem($item) ? $item : null;
      }
    },
    getDatumFromItem: {

      /**
       *  Returns the datum associated to a specific item DOMElement
       *  use d3 internally to retrieve the datum
       *  @param $item {DOMElement}
       *  @return {Object|Array|null} depending on the user data structure
       */

      value: function getDatumFromItem($item) {
        var d3item = this._$itemD3SelectionMap.get($item);
        return d3item ? d3item.datum() : null;
      }
    },
    hasItem: {

      /**
       *  Defines if the given d3 selection is an item of the layer
       *  @param item {DOMElement}
       *  @return {bool}
       */

      value: function hasItem($item) {
        var nodes = this.d3items.nodes();
        return nodes.indexOf($item) !== -1;
      }
    },
    hasElement: {

      /**
       *  Defines if a given element b$elongs to the layer
       *  is more general than `hasItem`, can be used to check interaction elements too
       *  @param $el {DOMElement}
       *  @return {bool}
       */

      value: function hasElement($el) {
        do {
          if ($el === this.$el) {
            return true;
          }

          $el = $el.parentNode;
        } while ($el !== null);

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

        var itemShapeMap = this._$itemShapeMap;
        var renderingContext = this._renderingContext;

        var items = this.d3items.filter(function (datum, index) {
          var group = this;
          var shape = itemShapeMap.get(group);
          return shape.inArea(renderingContext, datum, x1, y1, x2, y2);
        });

        return items[0].slice(0);
      }
    },
    render: {

      // --------------------------------------
      // Rendering / Display methods
      // --------------------------------------

      // /**
      //  *  Returns the previsouly created layer's container
      //  *  @return {DOMElement}
      //  */
      // renderContainer() {
      //   return this.$el;
      // }

      // /**
      //  *  Creates the DOM according to given data and shapes
      //  */
      // render(){
      //   this.drawShapes();
      // }

      value: function render() {
        var _this = this;

        // force d3 to keep data in sync with the DOM with a unique id
        this.data.forEach(function (datum) {
          if (_datumIdMap.has(datum)) {
            return;
          }
          _datumIdMap.set(datum, _counter++);
        });

        // select items
        this.d3items = d3Selection.select(this.$offset).selectAll(".item").filter(function () {
          return !this.classList.contains("common");
        }).data(this.data, function (datum) {
          return _datumIdMap.get(datum);
        });

        // render `commonShape` only once
        if (this._commonShapeConfiguration !== null && this._$itemCommonShapeMap.size === 0) {
          var _commonShapeConfiguration = this._commonShapeConfiguration;
          var ctor = _commonShapeConfiguration.ctor;
          var accessors = _commonShapeConfiguration.accessors;
          var options = _commonShapeConfiguration.options;

          var $group = document.createElementNS(ns, "g");
          var shape = new ctor(options);

          shape.install(accessors);
          $group.appendChild(shape.render());
          $group.classList.add("item", "common", shape.getClassName());

          this._$itemCommonShapeMap.set($group, shape);
          this.$offset.appendChild($group);
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

          var $el = shape.render(_this._renderingContext);
          $el.classList.add("item", shape.getClassName());

          _this._$itemShapeMap.set($el, shape);
          _this._$itemD3SelectionMap.set($el, d3Selection.select($el));

          return $el;
        });

        // ... exit
        var _$itemShapeMap = this._$itemShapeMap;
        var _$itemD3SelectionMap = this._$itemD3SelectionMap;

        this.d3items.exit().each(function (datum, index) {
          var $el = this;
          var shape = _$itemShapeMap.get($el);
          // clean all shape/item references
          shape.destroy();
          _datumIdMap["delete"](datum);
          _$itemShapeMap["delete"]($el);
          _$itemD3SelectionMap["delete"]($el);
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

        var timeContext = this.timeContext;

        var width = timeContext.xScale(timeContext.duration);
        // offset is relative to tim$eline's timeContext
        var x = timeContext.parent.xScale(timeContext.start);
        var offset = timeContext.xScale(timeContext.offset);
        var top = this.params.top;
        var height = this.params.height;
        // matrix to invert the coordinate system
        var translateMatrix = "matrix(1, 0, 0, -1, " + x + ", " + (top + height) + ")";

        this.$el.setAttributeNS(null, "transform", translateMatrix);

        this.$boundingBox.setAttributeNS(null, "width", width);
        this.$boundingBox.setAttributeNS(null, "height", height);
        this.$boundingBox.style.opacity = this.params.opacity;

        this.$offset.setAttributeNS(null, "transform", "translate(" + offset + ", 0)");

        // maintain context shape
        this.contextShape.update(this._renderingContext, this.$interactions, this.timeContext, 0);

        // debug context
        if (this.params.debug) {
          this.$debugRect.setAttributeNS(null, "width", width);
          this.$debugRect.setAttributeNS(null, "height", height);
        }
      }
    },
    updateShapes: {

      /**
       *  updates the Shapes which b$elongs to the layer
       *  @param item {DOMElement}
       */

      value: function updateShapes() {
        var _this = this;

        var $item = arguments[0] === undefined ? null : arguments[0];

        this._updateRenderingContext();

        var that = this;
        var renderingContext = this._renderingContext;
        var items = $item !== null ? this._$itemD3SelectionMap.get($item) : this.d3items;
        // update common shapes
        this._$itemCommonShapeMap.forEach(function (shape, $item) {
          shape.update(renderingContext, _this.data);
        });

        // d3 update - entity or collection shapes
        items.each(function (datum, index) {
          var shape = that._$itemShapeMap.get(this);
          shape.update(renderingContext, datum, index);
        });
      }
    }
  });

  return Layer;
})(events.EventEmitter);

module.exports = Layer;
//# sourceMappingURL=data:application/json;base64,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QUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3hEO09BQ0Y7O0FBTUQsZ0JBQVk7Ozs7Ozs7YUFBQSx3QkFBZTs7O1lBQWQsS0FBSyxnQ0FBRyxJQUFJOztBQUN2QixZQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQzs7QUFFL0IsWUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFlBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDO0FBQ2hELFlBQU0sS0FBSyxHQUFHLEtBQUssS0FBSyxJQUFJLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDOztBQUVuRixZQUFJLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFFLEtBQUssRUFBSztBQUNsRCxlQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLE1BQUssSUFBSSxDQUFDLENBQUM7U0FDM0MsQ0FBQyxDQUFDOzs7QUFHSCxhQUFLLENBQUMsSUFBSSxDQUFDLFVBQVMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUNoQyxjQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QyxlQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM5QyxDQUFDLENBQUM7T0FDSjs7OztTQXBoQmtCLEtBQUs7R0FBUyxNQUFNLENBQUMsWUFBWTs7aUJBQWpDLEtBQUsiLCJmaWxlIjoiZXM2L2NvcmUvbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZDNTY2FsZSBmcm9tICdkMy1zY2FsZSc7XG5pbXBvcnQgZDNTZWxlY3Rpb24gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCBldmVudHMgZnJvbSAnZXZlbnRzJztcblxuaW1wb3J0IG5zIGZyb20gJy4vbmFtZXNwYWNlJztcbmltcG9ydCBTZWdtZW50IGZyb20gJy4uL3NoYXBlcy9zZWdtZW50JztcbmltcG9ydCBTZWdtZW50QmVoYXZpb3IgZnJvbSAnLi4vYmVoYXZpb3JzL3NlZ21lbnQtYmVoYXZpb3InO1xuXG5cbi8vIHByaXZhdGUgaXRlbSAtPiBpZCBtYXAgdG8gZm9yY2UgZDMgdHAga2VlcCBpbiBzeW5jIHdpdGggdGhlIERPTVxubGV0ICAgX2NvdW50ZXIgPSAwO1xuY29uc3QgX2RhdHVtSWRNYXAgPSBuZXcgTWFwKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExheWVyIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgKiBTdHJ1Y3R1cmUgb2YgdGhlIERPTSB2aWV3IG9mIGEgTGF5ZXJcbiAgICpcbiAgICogPGcgY2xhc3M9XCJsYXllclwiPiBGbGlwIHkgYXhpcywgdGltZUNvbnRleHQuc3RhcnQgYW5kIHRvcCBwb3NpdGlvbiBmcm9tIHBhcmFtcyBhcmUgYXBwbGllZCBvbiB0aGlzICRlbG10XG4gICAqICAgPHN2ZyBjbGFzcz1cImJvdW5kaW5nLWJveFwiPiB0aW1lQ29udGV4dC5kdXJhdGlvbiBpcyBhcHBsaWVkIG9uIHRoaXMgJGVsbXRcbiAgICogICAgPGcgY2xhc3M9XCJsYXllci1pbnRlcmFjdGlvbnNcIj4gQ29udGFpbnMgdGhlIHRpbWVDb250ZXh0IGVkaXRpb24gZWxlbWVudHMgKGEgc2VnbWVudClcbiAgICogICAgPC9nPlxuICAgKiAgICA8ZyBjbGFzcz1cIm9mZnNldCBpdGVtc1wiPiBUaGUgc2hhcGVzIGFyZSBpbnNlcnRlZCBoZXJlLCBhbmQgd2UgYXBwbHkgdGltZUNvbnRleHQub2Zmc2V0IG9uIHRoaXMgJGVsbXRcbiAgICogICAgPC9nPlxuICAgKiAgIDwvc3ZnPlxuICAgKiA8L2c+XG4gICAqL1xuICBjb25zdHJ1Y3RvcihkYXRhVHlwZSwgZGF0YSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmRhdGFUeXBlID0gZGF0YVR5cGU7IC8vICdlbnRpdHknIHx8ICdjb2xsZWN0aW9uJztcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBoZWlnaHQ6IDEwMCxcbiAgICAgIHRvcDogMCxcbiAgICAgIGlkOiAnJyxcbiAgICAgIHlEb21haW46IFswLCAxXSxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICBkZWJ1Z0NvbnRleHQ6IGZhbHNlLCAvLyBwYXNzIHRoZSBjb250ZXh0IGluIGRlYnVnIG1vZGVcbiAgICAgIGNvbnRleHRIYW5kbGVyV2lkdGg6IDJcbiAgICB9O1xuXG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgdGhpcy50aW1lQ29udGV4dCA9IG51bGw7XG5cbiAgICAvLyBjb250YWluZXIgZWxlbWVudHNcbiAgICB0aGlzLiRlbCA9IG51bGw7IC8vIG9mZnNldCBncm91cCBvZiB0aGUgcGFyZW50IGNvbnRleHRcbiAgICB0aGlzLiRib3VuZGluZ0JveCA9IG51bGw7XG4gICAgdGhpcy4kb2Zmc2V0ID0gbnVsbDtcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMgPSBudWxsO1xuXG4gICAgdGhpcy5kM2l0ZW1zID0gbnVsbDsgLy8gZDMgY29sbGVjdGlvbiBvZiB0aGUgbGF5ZXIgaXRlbXNcblxuICAgIHRoaXMuX3NoYXBlQ29uZmlndXJhdGlvbiA9IG51bGw7IC8vIHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH1cbiAgICB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb24gPSBudWxsOyAvLyB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9XG5cbiAgICB0aGlzLl8kaXRlbVNoYXBlTWFwID0gbmV3IE1hcCgpOyAvLyBpdGVtIGdyb3VwIDxET01FbGVtZW50PiA9PiBzaGFwZVxuICAgIHRoaXMuXyRpdGVtRDNTZWxlY3Rpb25NYXAgPSBuZXcgTWFwKCk7IC8vIGl0ZW0gZ3JvdXAgPERPTUVsZW1lbnQ+ID0+IHNoYXBlXG4gICAgdGhpcy5fJGl0ZW1Db21tb25TaGFwZU1hcCA9IG5ldyBNYXAoKTsgLy8gb25lIGVudHJ5IG1heCBpbiB0aGlzIG1hcFxuXG4gICAgdGhpcy5faXNDb250ZXh0RWRpdGFibGUgPSBmYWxzZTtcbiAgICB0aGlzLl9iZWhhdmlvciA9IG51bGw7XG5cbiAgICB0aGlzLl95U2NhbGUgPSBkM1NjYWxlLmxpbmVhcigpXG4gICAgICAuZG9tYWluKHRoaXMucGFyYW1zLnlEb21haW4pXG4gICAgICAucmFuZ2UoWzAsIHRoaXMucGFyYW1zLmhlaWdodF0pO1xuXG4gICAgdGhpcy5jb250ZXh0QmVoYXZpb3IgPSAnJztcblxuICAgIC8vIGluaXRpYWxpemUgdGltZUNvbnRleHQgbGF5b3V0XG4gICAgdGhpcy5fcmVuZGVyQ29udGFpbmVyKCk7XG4gIH1cblxuICAvLyBkZXN0cm95KCkge1xuICAvLyAgIHRoaXMudGltZUNvbnRleHQgPSBudWxsO1xuICAvLyAgIHRoaXMuZDNpdGVtcyA9IG51bGw7XG4gIC8vICAgdGhpcy5kYXRhID0gbnVsbDtcbiAgLy8gICB0aGlzLnBhcmFtcyA9IG51bGw7XG4gIC8vICAgdGhpcy5fYmVoYXZpb3IgPSBudWxsO1xuICAvL1xuICAvLyAgIC8vIEBUT0RPXG4gIC8vICAgICAgLSBjbGVhbiBNYXBzXG4gIC8vICAgICAgLSBjbGVhbiBsaXN0ZW5lcnNcbiAgLy8gICAgICAtIGNsZWFuIGJlaGF2aW9yIChiZWhhdmlvci5fbGF5ZXIpXG4gIC8vIH1cblxuICBzZXQgeURvbWFpbihkb21haW4pIHtcbiAgICB0aGlzLnBhcmFtcy55RG9tYWluID0gZG9tYWluO1xuICAgIHRoaXMuX3lTY2FsZS5kb21haW4oZG9tYWluKTtcbiAgfVxuXG4gIGdldCB5RG9tYWluKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy55RG9tYWluO1xuICB9XG5cbiAgc2V0IG9wYWNpdHkodmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcy5vcGFjaXR5ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgb3BhY2l0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMub3BhY2l0eTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWFuZGF0b3J5IGRlZmluZSB0aGUgY29udGV4dCBpbiB3aGljaCB0aGUgbGF5ZXIgaXMgZHJhd25cbiAgICogQHBhcmFtIGNvbnRleHQge1RpbWVDb250ZXh0fSB0aGUgdGltZUNvbnRleHQgaW4gd2hpY2ggdGhlIGxheWVyIGlzIGRpc3BsYXllZFxuICAgKi9cbiAgc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gdGltZUNvbnRleHQ7XG4gICAgLy8gY3JlYXRlIGEgbWl4aW4gdG8gcGFzcyB0byB0aGUgc2hhcGVzXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dCA9IHt9O1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIERhdGFcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBnZXQgZGF0YSgpIHsgcmV0dXJuIHRoaXMuX2RhdGE7IH1cblxuICBzZXQgZGF0YShkYXRhKSB7XG4gICAgc3dpdGNoICh0aGlzLmRhdGFUeXBlKSB7XG4gICAgICBjYXNlICdlbnRpdHknOlxuICAgICAgICBpZiAodGhpcy5fZGF0YSkgeyAgLy8gaWYgZGF0YSBhbHJlYWR5IGV4aXN0cywgcmV1c2UgdGhlIHJlZmVyZW5jZVxuICAgICAgICAgIHRoaXMuX2RhdGFbMF0gPSBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2RhdGEgPSBbZGF0YV07XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2xsZWN0aW9uJzpcbiAgICAgICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIEluaXRpYWxpemF0aW9uXG5cbiAgLyoqXG4gICAqICByZW5kZXIgdGhlIERPTSBpbiBtZW1vcnkgb24gbGF5ZXIgY3JlYXRpb24gdG8gYmUgYWJsZSB0byB1c2UgaXQgYmVmb3JlXG4gICAqICB0aGUgbGF5ZXIgaXMgYWN0dWFsbHkgaW5zZXJ0ZWQgaW4gdGhlIERPTVxuICAgKi9cbiAgX3JlbmRlckNvbnRhaW5lcigpIHtcbiAgICAvLyB3cmFwcGVyIGdyb3VwIGZvciBgc3RhcnQsIHRvcCBhbmQgY29udGV4dCBmbGlwIG1hdHJpeFxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQoJ2xheWVyJyk7XG4gICAgLy8gY2xpcCB0aGUgY29udGV4dCB3aXRoIGEgYHN2Z2AgZWxlbWVudFxuICAgIHRoaXMuJGJvdW5kaW5nQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnc3ZnJyk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guY2xhc3NMaXN0LmFkZCgnYm91bmRpbmctYm94Jyk7XG4gICAgLy8gZ3JvdXAgdG8gYXBwbHkgb2Zmc2V0XG4gICAgdGhpcy4kb2Zmc2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuJG9mZnNldC5jbGFzc0xpc3QuYWRkKCdvZmZzZXQnLCAnaXRlbXMnKTtcbiAgICAvLyBjb250ZXh0IGludGVyYWN0aW9uc1xuICAgIHRoaXMuJGludGVyYWN0aW9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMuY2xhc3NMaXN0LmFkZCgnaW50ZXJhY3Rpb25zJyk7XG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgLy8gQE5PVEU6IHdvcmtzIGJ1dCBraW5nIG9mIHVnbHkuLi4gc2hvdWxkIGJlIGNsZWFuZWRcbiAgICB0aGlzLmNvbnRleHRTaGFwZSA9IG5ldyBTZWdtZW50KCk7XG4gICAgdGhpcy5jb250ZXh0U2hhcGUuaW5zdGFsbCh7XG4gICAgICBvcGFjaXR5OiAoKSA9PiAwLjEsXG4gICAgICBjb2xvciAgOiAoKSA9PiAnIzc4Nzg3OCcsXG4gICAgICB3aWR0aCAgOiAoKSA9PiB0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uLFxuICAgICAgaGVpZ2h0IDogKCkgPT4gdGhpcy5fcmVuZGVyaW5nQ29udGV4dC55U2NhbGUuZG9tYWluKClbMV0sXG4gICAgICB5ICAgICAgOiAoKSA9PiB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnlTY2FsZS5kb21haW4oKVswXVxuICAgIH0pO1xuXG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zLmFwcGVuZENoaWxkKHRoaXMuY29udGV4dFNoYXBlLnJlbmRlcigpKTtcbiAgICAvLyBjcmVhdGUgdGhlIERPTSB0cmVlXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kYm91bmRpbmdCb3gpO1xuICAgIHRoaXMuJGJvdW5kaW5nQm94LmFwcGVuZENoaWxkKHRoaXMuJG9mZnNldCk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guYXBwZW5kQ2hpbGQodGhpcy4kaW50ZXJhY3Rpb25zKTtcblxuICAgIC8vIGRyYXcgYSBTZWdtZW50IGluIGNvbnRleHQgYmFja2dyb3VuZCB0byBkZWJ1ZyBpdCdzIHNpemVcbiAgICBpZiAodGhpcy5wYXJhbXMuZGVidWcpIHtcbiAgICAgIHRoaXMuJGRlYnVnUmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ1NlZ21lbnQnKTtcbiAgICAgIHRoaXMuJGJvdW5kaW5nQm94LmFwcGVuZENoaWxkKHRoaXMuJGRlYnVnUmVjdCk7XG4gICAgICB0aGlzLiRkZWJ1Z1JlY3Quc3R5bGUuZmlsbCA9ICcjYWJhYmFiJztcbiAgICAgIHRoaXMuJGRlYnVnUmVjdC5zdHlsZS5maWxsT3BhY2l0eSA9IDAuMTtcbiAgICB9XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDb21wb25lbnQgQ29uZmlndXJhdGlvblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiAgUmVnaXN0ZXIgdGhlIHNoYXBlIGFuZCBpdHMgYWNjZXNzb3JzIHRvIHVzZSBpbiBvcmRlciB0byByZW5kZXJcbiAgICogIHRoZSBlbnRpdHkgb3IgY29sbGVjdGlvblxuICAgKiAgQHBhcmFtIGN0b3IgPEZ1bmN0aW9uOkJhc2VTaGFwZT4gdGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBzaGFwZSB0byBiZSB1c2VkXG4gICAqICBAcGFyYW0gYWNjZXNzb3JzIDxPYmplY3Q+IGFjY2Vzc29ycyB0byB1c2UgaW4gb3JkZXIgdG8gbWFwIHRoZSBkYXRhIHN0cnVjdHVyZVxuICAgKi9cbiAgY29uZmlndXJlU2hhcGUoY3RvciwgYWNjZXNzb3JzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX3NoYXBlQ29uZmlndXJhdGlvbiA9IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH07XG4gIH1cblxuICAvKipcbiAgICogIFJlZ2lzdGVyIHRoZSBzaGFwZSB0byB1c2Ugd2l0aCB0aGUgZW50aXJlIGNvbGxlY3Rpb25cbiAgICogIGV4YW1wbGU6IHRoZSBsaW5lIGluIGEgYmVha3BvaW50IGZ1bmN0aW9uXG4gICAqICBAcGFyYW0gY3RvciB7QmFzZVNoYXBlfSB0aGUgY29uc3RydWN0b3Igb2YgdGhlIHNoYXBlIHRvIHVzZSB0byByZW5kZXIgZGF0YVxuICAgKiAgQHBhcmFtIGFjY2Vzc29ycyB7T2JqZWN0fSBhY2Nlc3NvcnMgdG8gdXNlIGluIG9yZGVyIHRvIG1hcCB0aGUgZGF0YSBzdHJ1Y3R1cmVcbiAgICovXG4gIGNvbmZpZ3VyZUNvbW1vblNoYXBlKGN0b3IsIGFjY2Vzc29ycyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb24gPSB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9O1xuICB9XG5cbiAgLyoqXG4gICAqICBSZWdpc3RlciB0aGUgYmVoYXZpb3IgdG8gdXNlIHdoZW4gaW50ZXJhY3Rpbmcgd2l0aCB0aGUgc2hhcGVcbiAgICogIEBwYXJhbSBiZWhhdmlvciB7QmFzZUJlaGF2aW9yfVxuICAgKi9cbiAgc2V0QmVoYXZpb3IoYmVoYXZpb3IpIHtcbiAgICBiZWhhdmlvci5pbml0aWFsaXplKHRoaXMpO1xuICAgIHRoaXMuX2JlaGF2aW9yID0gYmVoYXZpb3I7XG4gIH1cblxuICAvKipcbiAgICogIHVwZGF0ZSB0aGUgdmFsdWVzIGluIGBfcmVuZGVyaW5nQ29udGV4dGBcbiAgICogIGlzIHBhcnRpY3VsYXJ5IG5lZWRlZCB3aGVuIHVwZGF0aW5nIGBzdHJldGNoUmF0aW9gIGFzIHRoZSBwb2ludGVyXG4gICAqICB0byB0aGUgYHhTY2FsZWAgbWF5IGNoYW5nZVxuICAgKi9cbiAgX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKSB7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC54U2NhbGUgPSB0aGlzLnRpbWVDb250ZXh0LnhTY2FsZTtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnlTY2FsZSA9IHRoaXMuX3lTY2FsZTtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LmhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LndpZHRoICA9IHRoaXMudGltZUNvbnRleHQueFNjYWxlKHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24pO1xuICAgIC8vIGZvciBmb3JlaWduIG9qZWN0IGlzc3VlIGluIGNocm9tZVxuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQub2Zmc2V0WCA9IHRoaXMudGltZUNvbnRleHQueFNjYWxlKHRoaXMudGltZUNvbnRleHQub2Zmc2V0KTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEJlaGF2aW9yIEFjY2Vzc29yc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGdldCBzZWxlY3RlZEl0ZW1zKCkge1xuICAgIHJldHVybiB0aGlzLl9iZWhhdmlvciA/IHRoaXMuX2JlaGF2aW9yLnNlbGVjdGVkSXRlbXMgOiBbXTtcbiAgfVxuXG4gIHNlbGVjdCguLi4kaXRlbXMpIHtcbiAgICBpZiAoIXRoaXMuX2JlaGF2aW9yKSB7IHJldHVybjsgfVxuICAgIGlmICghJGl0ZW1zLmxlbmd0aCkgeyAkaXRlbXMgPSB0aGlzLmQzaXRlbXMubm9kZXMoKTsgfVxuXG4gICAgJGl0ZW1zLmZvckVhY2goKCRlbCkgPT4ge1xuICAgICAgY29uc3QgaXRlbSA9IHRoaXMuXyRpdGVtRDNTZWxlY3Rpb25NYXAuZ2V0KCRlbCk7XG4gICAgICB0aGlzLl9iZWhhdmlvci5zZWxlY3QoJGVsLCBpdGVtLmRhdHVtKCkpO1xuICAgICAgdGhpcy5fdG9Gcm9udCgkZWwpO1xuICAgIH0pO1xuICB9XG5cbiAgdW5zZWxlY3QoLi4uJGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHsgJGl0ZW1zID0gdGhpcy5kM2l0ZW1zLm5vZGVzKCk7IH1cblxuICAgICRpdGVtcy5mb3JFYWNoKCgkZWwpID0+IHtcbiAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLl8kaXRlbUQzU2VsZWN0aW9uTWFwLmdldCgkZWwpO1xuICAgICAgdGhpcy5fYmVoYXZpb3IudW5zZWxlY3QoJGVsLCBpdGVtLmRhdHVtKCkpO1xuICAgIH0pO1xuICB9XG5cbiAgdG9nZ2xlUyRlbGVjdGlvbiguLi4kaXRlbXMpIHtcbiAgICBpZiAoIXRoaXMuX2JlaGF2aW9yKSB7IHJldHVybjsgfVxuICAgIGlmICghJGl0ZW1zLmxlbmd0aCkgeyAkaXRlbXMgPSB0aGlzLmQzaXRlbXMubm9kZXMoKTsgfVxuXG4gICAgJGl0ZW1zLmZvckVhY2goKCRlbCkgPT4ge1xuICAgICAgY29uc3QgaXRlbSA9IHRoaXMuXyRpdGVtRDNTZWxlY3Rpb25NYXAuZ2V0KCRlbCk7XG4gICAgICB0aGlzLl9iZWhhdmlvci50b2dnbGVTJGVsZWN0aW9uKCRlbCwgaXRlbS5kYXR1bSgpKTtcbiAgICB9KTtcbiAgfVxuXG4gIGVkaXQoJGl0ZW1zLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3IpIHsgcmV0dXJuOyB9XG4gICAgJGl0ZW1zID0gIUFycmF5LmlzQXJyYXkoJGl0ZW1zKSA/IFskaXRlbXNdIDogJGl0ZW1zO1xuXG4gICAgJGl0ZW1zLmZvckVhY2goKCRlbCkgPT4ge1xuICAgICAgY29uc3QgaXRlbSAgPSB0aGlzLl8kaXRlbUQzU2VsZWN0aW9uTWFwLmdldCgkZWwpO1xuICAgICAgY29uc3Qgc2hhcGUgPSB0aGlzLl8kaXRlbVNoYXBlTWFwLmdldCgkZWwpO1xuICAgICAgY29uc3QgZGF0dW0gPSBpdGVtLmRhdHVtKCk7XG4gICAgICB0aGlzLl9iZWhhdmlvci5lZGl0KHRoaXMuX3JlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpO1xuICAgICAgdGhpcy5lbWl0KCdlZGl0Jywgc2hhcGUsIGRhdHVtKTtcbiAgICB9KTtcbiAgfVxuXG4gIGVkaXRDb250ZXh0KCkge1xuICAgIHRoaXMuY29udGV4dEJlaGF2aW9yLmVkaXQoKTtcbiAgfVxuXG4gIHN0cmV0Y2hDb250ZXh0KCkge1xuICAgIHRoaXMuY29udGV4dEJlaGF2aW9yLnN0cmV0Y2goKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEgkZWxwZXJzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqICBNb3ZlcyBhbiBgJGVsYCdzIGdyb3VwIHRvIHRoZSBlbmQgb2YgdGhlIGxheWVyIChzdmcgei1pbmRleC4uLilcbiAgICogIEBwYXJhbSBgJGVsYCB7RE9NRWxlbWVudH0gdGhlIERPTUVsZW1lbnQgdG8gYmUgbW92ZWRcbiAgICovXG4gIF90b0Zyb250KCRlbCkge1xuICAgIHRoaXMuJG9mZnNldC5hcHBlbmRDaGlsZCgkZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqICBSZXR1cm5zIHRoZSBkM1NlbGVjdGlvbiBpdGVtIHRvIHdoaWNoIHRoZSBnaXZlbiBET01FbGVtZW50IGIkZWxvbmdzXG4gICAqICBAcGFyYW0gYCRlbGAge0RPTUVsZW1lbnR9IHRoZSBlbGVtZW50IHRvIGJlIHRlc3RlZFxuICAgKiAgQHJldHVybiB7RE9NRWxlbWVudHxudWxsfSBpdGVtIGdyb3VwIGNvbnRhaW5pbmcgdGhlIGAkZWxgIGlmIGIkZWxvbmdzIHRvIHRoaXMgbGF5ZXIsIG51bGwgb3RoZXJ3aXNlXG4gICAqL1xuICBnZXRJdGVtRnJvbURPTUVsZW1lbnQoJGVsKSB7XG4gICAgbGV0ICRpdGVtO1xuXG4gICAgZG8ge1xuICAgICAgaWYgKCRlbC5jbGFzc0xpc3QgJiYgJGVsLmNsYXNzTGlzdC5jb250YWlucygnaXRlbScpKSB7XG4gICAgICAgICRpdGVtID0gJGVsO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgJGVsID0gJGVsLnBhcmVudE5vZGU7XG4gICAgfSB3aGlsZSAoJGVsICE9PSBudWxsKTtcblxuICAgIHJldHVybiB0aGlzLmhhc0l0ZW0oJGl0ZW0pID8gJGl0ZW0gOsKgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiAgUmV0dXJucyB0aGUgZGF0dW0gYXNzb2NpYXRlZCB0byBhIHNwZWNpZmljIGl0ZW0gRE9NRWxlbWVudFxuICAgKiAgdXNlIGQzIGludGVybmFsbHkgdG8gcmV0cmlldmUgdGhlIGRhdHVtXG4gICAqICBAcGFyYW0gJGl0ZW0ge0RPTUVsZW1lbnR9XG4gICAqICBAcmV0dXJuIHtPYmplY3R8QXJyYXl8bnVsbH0gZGVwZW5kaW5nIG9uIHRoZSB1c2VyIGRhdGEgc3RydWN0dXJlXG4gICAqL1xuICBnZXREYXR1bUZyb21JdGVtKCRpdGVtKSB7XG4gICAgY29uc3QgZDNpdGVtID0gdGhpcy5fJGl0ZW1EM1NlbGVjdGlvbk1hcC5nZXQoJGl0ZW0pO1xuICAgIHJldHVybiBkM2l0ZW0gPyBkM2l0ZW0uZGF0dW0oKSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogIERlZmluZXMgaWYgdGhlIGdpdmVuIGQzIHNlbGVjdGlvbiBpcyBhbiBpdGVtIG9mIHRoZSBsYXllclxuICAgKiAgQHBhcmFtIGl0ZW0ge0RPTUVsZW1lbnR9XG4gICAqICBAcmV0dXJuIHtib29sfVxuICAgKi9cbiAgaGFzSXRlbSgkaXRlbSkge1xuICAgIGNvbnN0IG5vZGVzID0gdGhpcy5kM2l0ZW1zLm5vZGVzKCk7XG4gICAgcmV0dXJuIG5vZGVzLmluZGV4T2YoJGl0ZW0pICE9PSAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRGVmaW5lcyBpZiBhIGdpdmVuIGVsZW1lbnQgYiRlbG9uZ3MgdG8gdGhlIGxheWVyXG4gICAqICBpcyBtb3JlIGdlbmVyYWwgdGhhbiBgaGFzSXRlbWAsIGNhbiBiZSB1c2VkIHRvIGNoZWNrIGludGVyYWN0aW9uIGVsZW1lbnRzIHRvb1xuICAgKiAgQHBhcmFtICRlbCB7RE9NRWxlbWVudH1cbiAgICogIEByZXR1cm4ge2Jvb2x9XG4gICAqL1xuICBoYXNFbGVtZW50KCRlbCkge1xuICAgIGRvIHtcbiAgICAgIGlmICgkZWwgPT09IHRoaXMuJGVsKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAkZWwgPSAkZWwucGFyZW50Tm9kZTtcbiAgICB9IHdoaWxlICgkZWwgIT09IG51bGwpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqICBAcGFyYW0gYXJlYSB7T2JqZWN0fSBhcmVhIGluIHdoaWNoIHRvIGZpbmQgdGhlIGVsZW1lbnRzXG4gICAqICBAcmV0dXJuIHtBcnJheX0gbGlzdCBvZiB0aGUgRE9NIGVsZW1lbnRzIGluIHRoZSBnaXZlbiBhcmVhXG4gICAqL1xuICBnZXRJdGVtc0luQXJlYShhcmVhKSB7XG4gICAgY29uc3Qgc3RhcnQgICAgPSB0aGlzLnRpbWVDb250ZXh0LnhTY2FsZSh0aGlzLnRpbWVDb250ZXh0LnN0YXJ0KTtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMudGltZUNvbnRleHQueFNjYWxlKHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24pO1xuICAgIGNvbnN0IG9mZnNldCAgID0gdGhpcy50aW1lQ29udGV4dC54U2NhbGUodGhpcy50aW1lQ29udGV4dC5vZmZzZXQpO1xuICAgIGNvbnN0IHRvcCAgICAgID0gdGhpcy5wYXJhbXMudG9wO1xuICAgIC8vIGJlIGF3YXJlIGFmIGNvbnRleHQncyB0cmFuc2xhdGlvbnMgLSBjb25zdHJhaW4gaW4gd29ya2luZyB2aWV3XG4gICAgbGV0IHgxID0gTWF0aC5tYXgoYXJlYS5sZWZ0LCBzdGFydCk7XG4gICAgbGV0IHgyID0gTWF0aC5taW4oYXJlYS5sZWZ0ICsgYXJlYS53aWR0aCwgc3RhcnQgKyBkdXJhdGlvbik7XG4gICAgeDEgLT0gKHN0YXJ0ICsgb2Zmc2V0KTtcbiAgICB4MiAtPSAoc3RhcnQgKyBvZmZzZXQpO1xuICAgIC8vIGtlZXAgY29uc2lzdGVudCB3aXRoIGNvbnRleHQgeSBjb29yZGluYXRlcyBzeXN0ZW1cbiAgICBsZXQgeTEgPSB0aGlzLnBhcmFtcy5oZWlnaHQgLSAoYXJlYS50b3AgKyBhcmVhLmhlaWdodCk7XG4gICAgbGV0IHkyID0gdGhpcy5wYXJhbXMuaGVpZ2h0IC0gYXJlYS50b3A7XG5cbiAgICB5MSArPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgeTIgKz0gdGhpcy5wYXJhbXMudG9wO1xuXG4gICAgY29uc3QgaXRlbVNoYXBlTWFwID0gdGhpcy5fJGl0ZW1TaGFwZU1hcDtcbiAgICBjb25zdCByZW5kZXJpbmdDb250ZXh0ID0gdGhpcy5fcmVuZGVyaW5nQ29udGV4dDtcblxuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5kM2l0ZW1zLmZpbHRlcihmdW5jdGlvbihkYXR1bSwgaW5kZXgpIHtcbiAgICAgIGNvbnN0IGdyb3VwID0gdGhpcztcbiAgICAgIGNvbnN0IHNoYXBlID0gaXRlbVNoYXBlTWFwLmdldChncm91cCk7XG4gICAgICByZXR1cm4gc2hhcGUuaW5BcmVhKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaXRlbXNbMF0uc2xpY2UoMCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZW5kZXJpbmcgLyBEaXNwbGF5IG1ldGhvZHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyAvKipcbiAgLy8gICogIFJldHVybnMgdGhlIHByZXZpc291bHkgY3JlYXRlZCBsYXllcidzIGNvbnRhaW5lclxuICAvLyAgKiAgQHJldHVybiB7RE9NRWxlbWVudH1cbiAgLy8gICovXG4gIC8vIHJlbmRlckNvbnRhaW5lcigpIHtcbiAgLy8gICByZXR1cm4gdGhpcy4kZWw7XG4gIC8vIH1cblxuICAvLyAvKipcbiAgLy8gICogIENyZWF0ZXMgdGhlIERPTSBhY2NvcmRpbmcgdG8gZ2l2ZW4gZGF0YSBhbmQgc2hhcGVzXG4gIC8vICAqL1xuICAvLyByZW5kZXIoKXtcbiAgLy8gICB0aGlzLmRyYXdTaGFwZXMoKTtcbiAgLy8gfVxuXG4gIHJlbmRlcigpIHtcbiAgICAvLyBmb3JjZSBkMyB0byBrZWVwIGRhdGEgaW4gc3luYyB3aXRoIHRoZSBET00gd2l0aCBhIHVuaXF1ZSBpZFxuICAgIHRoaXMuZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGRhdHVtKSB7XG4gICAgICBpZiAoX2RhdHVtSWRNYXAuaGFzKGRhdHVtKSkgeyByZXR1cm47IH1cbiAgICAgIF9kYXR1bUlkTWFwLnNldChkYXR1bSwgX2NvdW50ZXIrKyk7XG4gICAgfSk7XG5cbiAgICAvLyBzZWxlY3QgaXRlbXNcbiAgICB0aGlzLmQzaXRlbXMgPSBkM1NlbGVjdGlvbi5zZWxlY3QodGhpcy4kb2Zmc2V0KVxuICAgICAgLnNlbGVjdEFsbCgnLml0ZW0nKVxuICAgICAgLmZpbHRlcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmNsYXNzTGlzdC5jb250YWlucygnY29tbW9uJyk7XG4gICAgICB9KVxuICAgICAgLmRhdGEodGhpcy5kYXRhLCBmdW5jdGlvbihkYXR1bSkge1xuICAgICAgICByZXR1cm4gX2RhdHVtSWRNYXAuZ2V0KGRhdHVtKTtcbiAgICAgIH0pO1xuXG4gICAgLy8gcmVuZGVyIGBjb21tb25TaGFwZWAgb25seSBvbmNlXG4gICAgaWYgKFxuICAgICAgdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uICE9PSBudWxsICYmXG4gICAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwLnNpemUgPT09IDBcbiAgICApIHtcbiAgICAgIGNvbnN0IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH0gPSB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb247XG4gICAgICBjb25zdCAkZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgICBjb25zdCBzaGFwZSA9IG5ldyBjdG9yKG9wdGlvbnMpO1xuXG4gICAgICBzaGFwZS5pbnN0YWxsKGFjY2Vzc29ycyk7XG4gICAgICAkZ3JvdXAuYXBwZW5kQ2hpbGQoc2hhcGUucmVuZGVyKCkpO1xuICAgICAgJGdyb3VwLmNsYXNzTGlzdC5hZGQoJ2l0ZW0nLCAnY29tbW9uJywgc2hhcGUuZ2V0Q2xhc3NOYW1lKCkpO1xuXG4gICAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwLnNldCgkZ3JvdXAsIHNoYXBlKTtcbiAgICAgIHRoaXMuJG9mZnNldC5hcHBlbmRDaGlsZCgkZ3JvdXApO1xuICAgIH1cblxuICAgIC8vIC4uLiBlbnRlclxuICAgIHRoaXMuZDNpdGVtcy5lbnRlcigpXG4gICAgICAuYXBwZW5kKChkYXR1bSwgaW5kZXgpID0+IHtcbiAgICAgICAgLy8gQE5PVEU6IGQzIGJpbmRzIGB0aGlzYCB0byB0aGUgY29udGFpbmVyIGdyb3VwXG4gICAgICAgIGNvbnN0IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH0gPSB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb247XG4gICAgICAgIGNvbnN0IHNoYXBlID0gbmV3IGN0b3Iob3B0aW9ucyk7XG4gICAgICAgIHNoYXBlLmluc3RhbGwoYWNjZXNzb3JzKTtcblxuICAgICAgICBjb25zdCAkZWwgPSBzaGFwZS5yZW5kZXIodGhpcy5fcmVuZGVyaW5nQ29udGV4dCk7XG4gICAgICAgICRlbC5jbGFzc0xpc3QuYWRkKCdpdGVtJywgc2hhcGUuZ2V0Q2xhc3NOYW1lKCkpO1xuXG4gICAgICAgIHRoaXMuXyRpdGVtU2hhcGVNYXAuc2V0KCRlbCwgc2hhcGUpO1xuICAgICAgICB0aGlzLl8kaXRlbUQzU2VsZWN0aW9uTWFwLnNldCgkZWwsIGQzU2VsZWN0aW9uLnNlbGVjdCgkZWwpKTtcblxuICAgICAgICByZXR1cm4gJGVsO1xuICAgICAgfSk7XG5cbiAgICAvLyAuLi4gZXhpdFxuICAgIGNvbnN0IF8kaXRlbVNoYXBlTWFwID0gdGhpcy5fJGl0ZW1TaGFwZU1hcDtcbiAgICBjb25zdCBfJGl0ZW1EM1NlbGVjdGlvbk1hcCA9IHRoaXMuXyRpdGVtRDNTZWxlY3Rpb25NYXA7XG5cbiAgICB0aGlzLmQzaXRlbXMuZXhpdCgpXG4gICAgICAuZWFjaChmdW5jdGlvbihkYXR1bSwgaW5kZXgpIHtcbiAgICAgICAgY29uc3QgJGVsID0gdGhpcztcbiAgICAgICAgY29uc3Qgc2hhcGUgPSBfJGl0ZW1TaGFwZU1hcC5nZXQoJGVsKTtcbiAgICAgICAgLy8gY2xlYW4gYWxsIHNoYXBlL2l0ZW0gcmVmZXJlbmNlc1xuICAgICAgICBzaGFwZS5kZXN0cm95KCk7XG4gICAgICAgIF9kYXR1bUlkTWFwLmRlbGV0ZShkYXR1bSk7XG4gICAgICAgIF8kaXRlbVNoYXBlTWFwLmRlbGV0ZSgkZWwpO1xuICAgICAgICBfJGl0ZW1EM1NlbGVjdGlvbk1hcC5kZWxldGUoJGVsKTtcbiAgICAgIH0pXG4gICAgICAucmVtb3ZlKCk7XG4gIH1cblxuICAvKipcbiAgICogIHVwZGF0ZXMgQ29udGV4dCBhbmQgU2hhcGVzXG4gICAqL1xuICB1cGRhdGUoKSB7XG4gICAgdGhpcy51cGRhdGVDb250YWluZXIoKTtcbiAgICB0aGlzLnVwZGF0ZVNoYXBlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqICB1cGRhdGVzIHRoZSBjb250ZXh0IG9mIHRoZSBsYXllclxuICAgKi9cbiAgdXBkYXRlQ29udGFpbmVyKCkge1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcblxuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gdGhpcy50aW1lQ29udGV4dDtcblxuICAgIGNvbnN0IHdpZHRoICA9IHRpbWVDb250ZXh0LnhTY2FsZSh0aW1lQ29udGV4dC5kdXJhdGlvbik7XG4gICAgLy8gb2Zmc2V0IGlzIHJlbGF0aXZlIHRvIHRpbSRlbGluZSdzIHRpbWVDb250ZXh0XG4gICAgY29uc3QgeCAgICAgID0gdGltZUNvbnRleHQucGFyZW50LnhTY2FsZSh0aW1lQ29udGV4dC5zdGFydCk7XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGltZUNvbnRleHQueFNjYWxlKHRpbWVDb250ZXh0Lm9mZnNldCk7XG4gICAgY29uc3QgdG9wICAgID0gdGhpcy5wYXJhbXMudG9wO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICAvLyBtYXRyaXggdG8gaW52ZXJ0IHRoZSBjb29yZGluYXRlIHN5c3RlbVxuICAgIGNvbnN0IHRyYW5zbGF0ZU1hdHJpeCA9IGBtYXRyaXgoMSwgMCwgMCwgLTEsICR7eH0sICR7dG9wICsgaGVpZ2h0fSlgO1xuXG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHRyYW5zbGF0ZU1hdHJpeCk7XG5cbiAgICB0aGlzLiRib3VuZGluZ0JveC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG5cbiAgICB0aGlzLiRvZmZzZXQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHtvZmZzZXR9LCAwKWApO1xuXG4gICAgLy8gbWFpbnRhaW4gY29udGV4dCBzaGFwZVxuICAgIHRoaXMuY29udGV4dFNoYXBlLnVwZGF0ZShcbiAgICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQsXG4gICAgICB0aGlzLiRpbnRlcmFjdGlvbnMsXG4gICAgICB0aGlzLnRpbWVDb250ZXh0LFxuICAgICAgMFxuICAgICk7XG5cbiAgICAvLyBkZWJ1ZyBjb250ZXh0XG4gICAgaWYgKHRoaXMucGFyYW1zLmRlYnVnKSB7XG4gICAgICB0aGlzLiRkZWJ1Z1JlY3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgICAgdGhpcy4kZGVidWdSZWN0LnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlcyB0aGUgU2hhcGVzIHdoaWNoIGIkZWxvbmdzIHRvIHRoZSBsYXllclxuICAgKiAgQHBhcmFtIGl0ZW0ge0RPTUVsZW1lbnR9XG4gICAqL1xuICB1cGRhdGVTaGFwZXMoJGl0ZW0gPSBudWxsKSB7XG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpO1xuXG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgY29uc3QgcmVuZGVyaW5nQ29udGV4dCA9IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQ7XG4gICAgY29uc3QgaXRlbXMgPSAkaXRlbSAhPT0gbnVsbCA/IHRoaXMuXyRpdGVtRDNTZWxlY3Rpb25NYXAuZ2V0KCRpdGVtKSA6IHRoaXMuZDNpdGVtcztcbiAgICAvLyB1cGRhdGUgY29tbW9uIHNoYXBlc1xuICAgIHRoaXMuXyRpdGVtQ29tbW9uU2hhcGVNYXAuZm9yRWFjaCgoc2hhcGUsICRpdGVtKSA9PiB7XG4gICAgICBzaGFwZS51cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgdGhpcy5kYXRhKTtcbiAgICB9KTtcblxuICAgIC8vIGQzIHVwZGF0ZSAtIGVudGl0eSBvciBjb2xsZWN0aW9uIHNoYXBlc1xuICAgIGl0ZW1zLmVhY2goZnVuY3Rpb24oZGF0dW0sIGluZGV4KSB7XG4gICAgICBjb25zdCBzaGFwZSA9IHRoYXQuXyRpdGVtU2hhcGVNYXAuZ2V0KHRoaXMpO1xuICAgICAgc2hhcGUudXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCBpbmRleCk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==