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
      //   // can't do `this = null` from here...
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

        var item = arguments[0] === undefined ? null : arguments[0];

        this._updateRenderingContext();

        var that = this;
        var renderingContext = this._renderingContext;
        var items = item !== null ? d3Selection.select(item) : this.d3items;
        // update common shapes
        this._$itemCommonShapeMap.forEach(function (shape, item) {
          shape.update(renderingContext, item, _this.data);
        });

        // d3 update - entity or collection shapes
        items.each(function (datum, index) {
          var $el = this;
          var shape = that._$itemShapeMap.get($el);
          shape.update(renderingContext, $el, datum, index);
        });
      }
    }
  });

  return Layer;
})(events.EventEmitter);

module.exports = Layer;
//# sourceMappingURL=data:application/json;base64,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QkFBZ0IsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7QUFDaEQsWUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLElBQUksR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7O0FBRXRFLFlBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFLO0FBQ2pELGVBQUssQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLE1BQUssSUFBSSxDQUFDLENBQUM7U0FDakQsQ0FBQyxDQUFDOzs7QUFHSCxhQUFLLENBQUMsSUFBSSxDQUFDLFVBQVMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUNoQyxjQUFNLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDakIsY0FBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0MsZUFBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ25ELENBQUMsQ0FBQztPQUNKOzs7O1NBMWdCa0IsS0FBSztHQUFTLE1BQU0sQ0FBQyxZQUFZOztpQkFBakMsS0FBSyIsImZpbGUiOiJlczYvY29yZS9sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkM1NjYWxlIGZyb20gJ2QzLXNjYWxlJztcbmltcG9ydCBkM1NlbGVjdGlvbiBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IGV2ZW50cyBmcm9tICdldmVudHMnO1xuXG5pbXBvcnQgbnMgZnJvbSAnLi9uYW1lc3BhY2UnO1xuaW1wb3J0IFNlZ21lbnQgZnJvbSAnLi4vc2hhcGVzL3NlZ21lbnQnO1xuaW1wb3J0IFNlZ21lbnRCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvc2VnbWVudC1iZWhhdmlvcic7XG5cblxuLy8gcHJpdmF0ZSBpdGVtIC0+IGlkIG1hcCB0byBmb3JjZSBkMyB0cCBrZWVwIGluIHN5bmMgd2l0aCB0aGUgRE9NXG5sZXQgICBfY291bnRlciA9IDA7XG5jb25zdCBfZGF0dW1JZE1hcCA9IG5ldyBNYXAoKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF5ZXIgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIFN0cnVjdHVyZSBvZiB0aGUgRE9NIHZpZXcgb2YgYSBMYXllclxuICAgKlxuICAgKiA8ZyBjbGFzcz1cImxheWVyXCI+IEZsaXAgeSBheGlzLCB0aW1lQ29udGV4dC5zdGFydCBhbmQgdG9wIHBvc2l0aW9uIGZyb20gcGFyYW1zIGFyZSBhcHBsaWVkIG9uIHRoaXMgJGVsbXRcbiAgICogICA8c3ZnIGNsYXNzPVwiYm91bmRpbmctYm94XCI+IHRpbWVDb250ZXh0LmR1cmF0aW9uIGlzIGFwcGxpZWQgb24gdGhpcyAkZWxtdFxuICAgKiAgICA8ZyBjbGFzcz1cImxheWVyLWludGVyYWN0aW9uc1wiPiBDb250YWlucyB0aGUgdGltZUNvbnRleHQgZWRpdGlvbiBlbGVtZW50cyAoYSBzZWdtZW50KVxuICAgKiAgICA8L2c+XG4gICAqICAgIDxnIGNsYXNzPVwib2Zmc2V0IGl0ZW1zXCI+IFRoZSBzaGFwZXMgYXJlIGluc2VydGVkIGhlcmUsIGFuZCB3ZSBhcHBseSB0aW1lQ29udGV4dC5vZmZzZXQgb24gdGhpcyAkZWxtdFxuICAgKiAgICA8L2c+XG4gICAqICAgPC9zdmc+XG4gICAqIDwvZz5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRhdGFUeXBlLCBkYXRhLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZGF0YVR5cGUgPSBkYXRhVHlwZTsgLy8gJ2VudGl0eScgfHwgJ2NvbGxlY3Rpb24nO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGhlaWdodDogMTAwLFxuICAgICAgdG9wOiAwLFxuICAgICAgaWQ6ICcnLFxuICAgICAgeURvbWFpbjogWzAsIDFdLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIGRlYnVnQ29udGV4dDogZmFsc2UsIC8vIHBhc3MgdGhlIGNvbnRleHQgaW4gZGVidWcgbW9kZVxuICAgICAgY29udGV4dEhhbmRsZXJXaWR0aDogMlxuICAgIH07XG5cbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbnVsbDtcblxuICAgIC8vIGNvbnRhaW5lciBlbGVtZW50c1xuICAgIHRoaXMuJGVsID0gbnVsbDsgLy8gb2Zmc2V0IGdyb3VwIG9mIHRoZSBwYXJlbnQgY29udGV4dFxuICAgIHRoaXMuJGJvdW5kaW5nQm94ID0gbnVsbDtcbiAgICB0aGlzLiRvZmZzZXQgPSBudWxsO1xuICAgIHRoaXMuJGludGVyYWN0aW9ucyA9IG51bGw7XG5cbiAgICB0aGlzLmQzaXRlbXMgPSBudWxsOyAvLyBkMyBjb2xsZWN0aW9uIG9mIHRoZSBsYXllciBpdGVtc1xuXG4gICAgdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uID0gbnVsbDsgLy8geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfVxuICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiA9IG51bGw7IC8vIHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH1cblxuICAgIHRoaXMuXyRpdGVtU2hhcGVNYXAgPSBuZXcgTWFwKCk7IC8vIGl0ZW0gZ3JvdXAgPERPTUVsZW1lbnQ+ID0+IHNoYXBlXG4gICAgdGhpcy5fJGl0ZW1EM1NlbGVjdGlvbk1hcCA9IG5ldyBNYXAoKTsgLy8gaXRlbSBncm91cCA8RE9NRWxlbWVudD4gPT4gc2hhcGVcbiAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwID0gbmV3IE1hcCgpOyAvLyBvbmUgZW50cnkgbWF4IGluIHRoaXMgbWFwXG5cbiAgICB0aGlzLl9pc0NvbnRleHRFZGl0YWJsZSA9IGZhbHNlO1xuICAgIHRoaXMuX2JlaGF2aW9yID0gbnVsbDtcblxuICAgIHRoaXMuX3lTY2FsZSA9IGQzU2NhbGUubGluZWFyKClcbiAgICAgIC5kb21haW4odGhpcy5wYXJhbXMueURvbWFpbilcbiAgICAgIC5yYW5nZShbMCwgdGhpcy5wYXJhbXMuaGVpZ2h0XSk7XG5cbiAgICAvLyBpbml0aWFsaXplIHRpbWVDb250ZXh0IGxheW91dFxuICAgIHRoaXMuX3JlbmRlckNvbnRhaW5lcigpO1xuICB9XG5cbiAgLy8gZGVzdHJveSgpIHtcbiAgLy8gICB0aGlzLnRpbWVDb250ZXh0ID0gbnVsbDtcbiAgLy8gICB0aGlzLmQzaXRlbXMgPSBudWxsO1xuICAvLyAgIHRoaXMuZGF0YSA9IG51bGw7XG4gIC8vICAgdGhpcy5wYXJhbXMgPSBudWxsO1xuICAvLyAgIHRoaXMuX2JlaGF2aW9yID0gbnVsbDtcbiAgLy9cbiAgLy8gICAvLyBAVE9ET1xuICAvLyAgICAgIC0gY2xlYW4gTWFwc1xuICAvLyAgICAgIC0gY2xlYW4gbGlzdGVuZXJzXG4gIC8vICAgLy8gY2FuJ3QgZG8gYHRoaXMgPSBudWxsYCBmcm9tIGhlcmUuLi5cbiAgLy8gfVxuXG4gIHNldCB5RG9tYWluKGRvbWFpbikge1xuICAgIHRoaXMucGFyYW1zLnlEb21haW4gPSBkb21haW47XG4gICAgdGhpcy5feVNjYWxlLmRvbWFpbihkb21haW4pO1xuICB9XG5cbiAgZ2V0IHlEb21haW4oKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLnlEb21haW47XG4gIH1cblxuICBzZXQgb3BhY2l0eSh2YWx1ZSkge1xuICAgIHRoaXMucGFyYW1zLm9wYWNpdHkgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBvcGFjaXR5KCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuICB9XG5cbiAgLyoqXG4gICAqIEBtYW5kYXRvcnkgZGVmaW5lIHRoZSBjb250ZXh0IGluIHdoaWNoIHRoZSBsYXllciBpcyBkcmF3blxuICAgKiBAcGFyYW0gY29udGV4dCB7VGltZUNvbnRleHR9IHRoZSB0aW1lQ29udGV4dCBpbiB3aGljaCB0aGUgbGF5ZXIgaXMgZGlzcGxheWVkXG4gICAqL1xuICBzZXRUaW1lQ29udGV4dCh0aW1lQ29udGV4dCkge1xuICAgIHRoaXMudGltZUNvbnRleHQgPSB0aW1lQ29udGV4dDtcbiAgICAvLyBjcmVhdGUgYSBtaXhpbiB0byBwYXNzIHRvIHRoZSBzaGFwZXNcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0ID0ge307XG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gRGF0YVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGdldCBkYXRhKCkgeyByZXR1cm4gdGhpcy5fZGF0YTsgfVxuXG4gIHNldCBkYXRhKGRhdGEpIHtcbiAgICBzd2l0Y2ggKHRoaXMuZGF0YVR5cGUpIHtcbiAgICAgIGNhc2UgJ2VudGl0eSc6XG4gICAgICAgIGlmICh0aGlzLl9kYXRhKSB7ICAvLyBpZiBkYXRhIGFscmVhZHkgZXhpc3RzLCByZXVzZSB0aGUgcmVmZXJlbmNlXG4gICAgICAgICAgdGhpcy5fZGF0YVswXSA9IGRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fZGF0YSA9IFtkYXRhXTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbGxlY3Rpb24nOlxuICAgICAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gSW5pdGlhbGl6YXRpb25cblxuICAvKipcbiAgICogIHJlbmRlciB0aGUgRE9NIGluIG1lbW9yeSBvbiBsYXllciBjcmVhdGlvbiB0byBiZSBhYmxlIHRvIHVzZSBpdCBiZWZvcmVcbiAgICogIHRoZSBsYXllciBpcyBhY3R1YWxseSBpbnNlcnRlZCBpbiB0aGUgRE9NXG4gICAqL1xuICBfcmVuZGVyQ29udGFpbmVyKCkge1xuICAgIC8vIHdyYXBwZXIgZ3JvdXAgZm9yIGBzdGFydCwgdG9wIGFuZCBjb250ZXh0IGZsaXAgbWF0cml4XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZCgnbGF5ZXInKTtcbiAgICAvLyBjbGlwIHRoZSBjb250ZXh0IHdpdGggYSBgc3ZnYCBlbGVtZW50XG4gICAgdGhpcy4kYm91bmRpbmdCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdzdmcnKTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5jbGFzc0xpc3QuYWRkKCdib3VuZGluZy1ib3gnKTtcbiAgICAvLyBncm91cCB0byBhcHBseSBvZmZzZXRcbiAgICB0aGlzLiRvZmZzZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy4kb2Zmc2V0LmNsYXNzTGlzdC5hZGQoJ29mZnNldCcsICdpdGVtcycpO1xuICAgIC8vIGNvbnRleHQgaW50ZXJhY3Rpb25zXG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuJGludGVyYWN0aW9ucy5jbGFzc0xpc3QuYWRkKCdpbnRlcmFjdGlvbnMnKTtcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAvLyBATk9URTogd29ya3MgYnV0IGtpbmcgb2YgdWdseS4uLiBzaG91bGQgYmUgY2xlYW5lZFxuICAgIHRoaXMuY29udGV4dFNoYXBlID0gbmV3IFNlZ21lbnQoKTtcbiAgICB0aGlzLmNvbnRleHRTaGFwZS5pbnN0YWxsKHtcbiAgICAgIG9wYWNpdHk6ICgpID0+IDAuMSxcbiAgICAgIGNvbG9yICA6ICgpID0+ICcjNzg3ODc4JyxcbiAgICAgIHdpZHRoICA6ICgpID0+IHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24sXG4gICAgICBoZWlnaHQgOiAoKSA9PiB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnlTY2FsZS5kb21haW4oKVsxXSxcbiAgICAgIHkgICAgICA6ICgpID0+IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQueVNjYWxlLmRvbWFpbigpWzBdXG4gICAgfSk7XG5cbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMuYXBwZW5kQ2hpbGQodGhpcy5jb250ZXh0U2hhcGUucmVuZGVyKCkpO1xuICAgIC8vIGNyZWF0ZSB0aGUgRE9NIHRyZWVcbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRib3VuZGluZ0JveCk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guYXBwZW5kQ2hpbGQodGhpcy4kb2Zmc2V0KTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5hcHBlbmRDaGlsZCh0aGlzLiRpbnRlcmFjdGlvbnMpO1xuXG4gICAgLy8gZHJhdyBhIFNlZ21lbnQgaW4gY29udGV4dCBiYWNrZ3JvdW5kIHRvIGRlYnVnIGl0J3Mgc2l6ZVxuICAgIGlmICh0aGlzLnBhcmFtcy5kZWJ1Zykge1xuICAgICAgdGhpcy4kZGVidWdSZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnU2VnbWVudCcpO1xuICAgICAgdGhpcy4kYm91bmRpbmdCb3guYXBwZW5kQ2hpbGQodGhpcy4kZGVidWdSZWN0KTtcbiAgICAgIHRoaXMuJGRlYnVnUmVjdC5zdHlsZS5maWxsID0gJyNhYmFiYWInO1xuICAgICAgdGhpcy4kZGVidWdSZWN0LnN0eWxlLmZpbGxPcGFjaXR5ID0gMC4xO1xuICAgIH1cbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbXBvbmVudCBDb25maWd1cmF0aW9uXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqICBSZWdpc3RlciB0aGUgc2hhcGUgYW5kIGl0cyBhY2Nlc3NvcnMgdG8gdXNlIGluIG9yZGVyIHRvIHJlbmRlclxuICAgKiAgdGhlIGVudGl0eSBvciBjb2xsZWN0aW9uXG4gICAqICBAcGFyYW0gY3RvciA8RnVuY3Rpb246QmFzZVNoYXBlPiB0aGUgY29uc3RydWN0b3Igb2YgdGhlIHNoYXBlIHRvIGJlIHVzZWRcbiAgICogIEBwYXJhbSBhY2Nlc3NvcnMgPE9iamVjdD4gYWNjZXNzb3JzIHRvIHVzZSBpbiBvcmRlciB0byBtYXAgdGhlIGRhdGEgc3RydWN0dXJlXG4gICAqL1xuICBjb25maWd1cmVTaGFwZShjdG9yLCBhY2Nlc3NvcnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uID0geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgUmVnaXN0ZXIgdGhlIHNoYXBlIHRvIHVzZSB3aXRoIHRoZSBlbnRpcmUgY29sbGVjdGlvblxuICAgKiAgZXhhbXBsZTogdGhlIGxpbmUgaW4gYSBiZWFrcG9pbnQgZnVuY3Rpb25cbiAgICogIEBwYXJhbSBjdG9yIHtCYXNlU2hhcGV9IHRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgc2hhcGUgdG8gdXNlIHRvIHJlbmRlciBkYXRhXG4gICAqICBAcGFyYW0gYWNjZXNzb3JzIHtPYmplY3R9IGFjY2Vzc29ycyB0byB1c2UgaW4gb3JkZXIgdG8gbWFwIHRoZSBkYXRhIHN0cnVjdHVyZVxuICAgKi9cbiAgY29uZmlndXJlQ29tbW9uU2hhcGUoY3RvciwgYWNjZXNzb3JzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiA9IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH07XG4gIH1cblxuICAvKipcbiAgICogIFJlZ2lzdGVyIHRoZSBiZWhhdmlvciB0byB1c2Ugd2hlbiBpbnRlcmFjdGluZyB3aXRoIHRoZSBzaGFwZVxuICAgKiAgQHBhcmFtIGJlaGF2aW9yIHtCYXNlQmVoYXZpb3J9XG4gICAqL1xuICBzZXRCZWhhdmlvcihiZWhhdmlvcikge1xuICAgIGJlaGF2aW9yLmluaXRpYWxpemUodGhpcyk7XG4gICAgdGhpcy5fYmVoYXZpb3IgPSBiZWhhdmlvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlIHRoZSB2YWx1ZXMgaW4gYF9yZW5kZXJpbmdDb250ZXh0YFxuICAgKiAgaXMgcGFydGljdWxhcnkgbmVlZGVkIHdoZW4gdXBkYXRpbmcgYHN0cmV0Y2hSYXRpb2AgYXMgdGhlIHBvaW50ZXJcbiAgICogIHRvIHRoZSBgeFNjYWxlYCBtYXkgY2hhbmdlXG4gICAqL1xuICBfdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpIHtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnhTY2FsZSA9IHRoaXMudGltZUNvbnRleHQueFNjYWxlO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQueVNjYWxlID0gdGhpcy5feVNjYWxlO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQuaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQud2lkdGggID0gdGhpcy50aW1lQ29udGV4dC54U2NhbGUodGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbik7XG4gICAgLy8gZm9yIGZvcmVpZ24gb2plY3QgaXNzdWUgaW4gY2hyb21lXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5vZmZzZXRYID0gdGhpcy50aW1lQ29udGV4dC54U2NhbGUodGhpcy50aW1lQ29udGV4dC5vZmZzZXQpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQmVoYXZpb3IgQWNjZXNzb3JzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgZ2V0IHNlbGVjdGVkSXRlbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2JlaGF2aW9yID8gdGhpcy5fYmVoYXZpb3Iuc2VsZWN0ZWRJdGVtcyA6IFtdO1xuICB9XG5cbiAgc2VsZWN0KC4uLiRpdGVtcykge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3IpIHsgcmV0dXJuOyB9XG4gICAgaWYgKCEkaXRlbXMubGVuZ3RoKSB7ICRpdGVtcyA9IHRoaXMuZDNpdGVtcy5ub2RlcygpOyB9XG5cbiAgICAkaXRlbXMuZm9yRWFjaCgoJGVsKSA9PiB7XG4gICAgICBjb25zdCBpdGVtID0gdGhpcy5fJGl0ZW1EM1NlbGVjdGlvbk1hcC5nZXQoJGVsKTtcbiAgICAgIHRoaXMuX2JlaGF2aW9yLnNlbGVjdCgkZWwsIGl0ZW0uZGF0dW0oKSk7XG4gICAgICB0aGlzLl90b0Zyb250KCRlbCk7XG4gICAgfSk7XG4gIH1cblxuICB1bnNlbGVjdCguLi4kaXRlbXMpIHtcbiAgICBpZiAoIXRoaXMuX2JlaGF2aW9yKSB7IHJldHVybjsgfVxuICAgIGlmICghJGl0ZW1zLmxlbmd0aCkgeyAkaXRlbXMgPSB0aGlzLmQzaXRlbXMubm9kZXMoKTsgfVxuXG4gICAgJGl0ZW1zLmZvckVhY2goKCRlbCkgPT4ge1xuICAgICAgY29uc3QgaXRlbSA9IHRoaXMuXyRpdGVtRDNTZWxlY3Rpb25NYXAuZ2V0KCRlbCk7XG4gICAgICB0aGlzLl9iZWhhdmlvci51bnNlbGVjdCgkZWwsIGl0ZW0uZGF0dW0oKSk7XG4gICAgfSk7XG4gIH1cblxuICB0b2dnbGVTJGVsZWN0aW9uKC4uLiRpdGVtcykge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3IpIHsgcmV0dXJuOyB9XG4gICAgaWYgKCEkaXRlbXMubGVuZ3RoKSB7ICRpdGVtcyA9IHRoaXMuZDNpdGVtcy5ub2RlcygpOyB9XG5cbiAgICAkaXRlbXMuZm9yRWFjaCgoJGVsKSA9PiB7XG4gICAgICBjb25zdCBpdGVtID0gdGhpcy5fJGl0ZW1EM1NlbGVjdGlvbk1hcC5nZXQoJGVsKTtcbiAgICAgIHRoaXMuX2JlaGF2aW9yLnRvZ2dsZVMkZWxlY3Rpb24oJGVsLCBpdGVtLmRhdHVtKCkpO1xuICAgIH0pO1xuICB9XG5cbiAgZWRpdCgkaXRlbXMsIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICAkaXRlbXMgPSAhQXJyYXkuaXNBcnJheSgkaXRlbXMpID8gWyRpdGVtc10gOiAkaXRlbXM7XG5cbiAgICAkaXRlbXMuZm9yRWFjaCgoJGVsKSA9PiB7XG4gICAgICBjb25zdCBpdGVtICA9IHRoaXMuXyRpdGVtRDNTZWxlY3Rpb25NYXAuZ2V0KCRlbCk7XG4gICAgICBjb25zdCBzaGFwZSA9IHRoaXMuXyRpdGVtU2hhcGVNYXAuZ2V0KCRlbCk7XG4gICAgICBjb25zdCBkYXR1bSA9IGl0ZW0uZGF0dW0oKTtcbiAgICAgIHRoaXMuX2JlaGF2aW9yLmVkaXQodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCk7XG4gICAgICB0aGlzLmVtaXQoJ2VkaXQnLCBzaGFwZSwgZGF0dW0pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSCRlbHBlcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIE1vdmVzIGFuIGAkZWxgJ3MgZ3JvdXAgdG8gdGhlIGVuZCBvZiB0aGUgbGF5ZXIgKHN2ZyB6LWluZGV4Li4uKVxuICAgKiAgQHBhcmFtIGAkZWxgIHtET01FbGVtZW50fSB0aGUgRE9NRWxlbWVudCB0byBiZSBtb3ZlZFxuICAgKi9cbiAgX3RvRnJvbnQoJGVsKSB7XG4gICAgdGhpcy4kb2Zmc2V0LmFwcGVuZENoaWxkKCRlbCk7XG4gIH1cblxuICAvKipcbiAgICogIFJldHVybnMgdGhlIGQzU2VsZWN0aW9uIGl0ZW0gdG8gd2hpY2ggdGhlIGdpdmVuIERPTUVsZW1lbnQgYiRlbG9uZ3NcbiAgICogIEBwYXJhbSBgJGVsYCB7RE9NRWxlbWVudH0gdGhlIGVsZW1lbnQgdG8gYmUgdGVzdGVkXG4gICAqICBAcmV0dXJuIHtET01FbGVtZW50fG51bGx9IGl0ZW0gZ3JvdXAgY29udGFpbmluZyB0aGUgYCRlbGAgaWYgYiRlbG9uZ3MgdG8gdGhpcyBsYXllciwgbnVsbCBvdGhlcndpc2VcbiAgICovXG4gIGdldEl0ZW1Gcm9tRE9NRWxlbWVudCgkZWwpIHtcbiAgICBsZXQgJGl0ZW07XG5cbiAgICBkbyB7XG4gICAgICBpZiAoJGVsLmNsYXNzTGlzdCAmJiAkZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdpdGVtJykpIHtcbiAgICAgICAgJGl0ZW0gPSAkZWw7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICAkZWwgPSAkZWwucGFyZW50Tm9kZTtcbiAgICB9IHdoaWxlICgkZWwgIT09IG51bGwpO1xuXG4gICAgcmV0dXJuIHRoaXMuaGFzSXRlbSgkaXRlbSkgPyAkaXRlbSA6wqBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqICBSZXR1cm5zIHRoZSBkYXR1bSBhc3NvY2lhdGVkIHRvIGEgc3BlY2lmaWMgaXRlbSBET01FbGVtZW50XG4gICAqICB1c2UgZDMgaW50ZXJuYWxseSB0byByZXRyaWV2ZSB0aGUgZGF0dW1cbiAgICogIEBwYXJhbSAkaXRlbSB7RE9NRWxlbWVudH1cbiAgICogIEByZXR1cm4ge09iamVjdHxBcnJheXxudWxsfSBkZXBlbmRpbmcgb24gdGhlIHVzZXIgZGF0YSBzdHJ1Y3R1cmVcbiAgICovXG4gIGdldERhdHVtRnJvbUl0ZW0oJGl0ZW0pIHtcbiAgICBjb25zdCBkM2l0ZW0gPSB0aGlzLl8kaXRlbUQzU2VsZWN0aW9uTWFwLmdldCgkaXRlbSk7XG4gICAgcmV0dXJuIGQzaXRlbSA/IGQzaXRlbS5kYXR1bSgpIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRGVmaW5lcyBpZiB0aGUgZ2l2ZW4gZDMgc2VsZWN0aW9uIGlzIGFuIGl0ZW0gb2YgdGhlIGxheWVyXG4gICAqICBAcGFyYW0gaXRlbSB7RE9NRWxlbWVudH1cbiAgICogIEByZXR1cm4ge2Jvb2x9XG4gICAqL1xuICBoYXNJdGVtKCRpdGVtKSB7XG4gICAgY29uc3Qgbm9kZXMgPSB0aGlzLmQzaXRlbXMubm9kZXMoKTtcbiAgICByZXR1cm4gbm9kZXMuaW5kZXhPZigkaXRlbSkgIT09IC0xO1xuICB9XG5cbiAgLyoqXG4gICAqICBEZWZpbmVzIGlmIGEgZ2l2ZW4gZWxlbWVudCBiJGVsb25ncyB0byB0aGUgbGF5ZXJcbiAgICogIGlzIG1vcmUgZ2VuZXJhbCB0aGFuIGBoYXNJdGVtYCwgY2FuIGJlIHVzZWQgdG8gY2hlY2sgaW50ZXJhY3Rpb24gZWxlbWVudHMgdG9vXG4gICAqICBAcGFyYW0gJGVsIHtET01FbGVtZW50fVxuICAgKiAgQHJldHVybiB7Ym9vbH1cbiAgICovXG4gIGhhc0VsZW1lbnQoJGVsKSB7XG4gICAgZG8ge1xuICAgICAgaWYgKCRlbCA9PT0gdGhpcy4kZWwpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgICRlbCA9ICRlbC5wYXJlbnROb2RlO1xuICAgIH0gd2hpbGUgKCRlbCAhPT0gbnVsbCk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogIEBwYXJhbSBhcmVhIHtPYmplY3R9IGFyZWEgaW4gd2hpY2ggdG8gZmluZCB0aGUgZWxlbWVudHNcbiAgICogIEByZXR1cm4ge0FycmF5fSBsaXN0IG9mIHRoZSBET00gZWxlbWVudHMgaW4gdGhlIGdpdmVuIGFyZWFcbiAgICovXG4gIGdldEl0ZW1zSW5BcmVhKGFyZWEpIHtcbiAgICBjb25zdCBzdGFydCAgICA9IHRoaXMudGltZUNvbnRleHQueFNjYWxlKHRoaXMudGltZUNvbnRleHQuc3RhcnQpO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy50aW1lQ29udGV4dC54U2NhbGUodGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbik7XG4gICAgY29uc3Qgb2Zmc2V0ICAgPSB0aGlzLnRpbWVDb250ZXh0LnhTY2FsZSh0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCk7XG4gICAgY29uc3QgdG9wICAgICAgPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgLy8gYmUgYXdhcmUgYWYgY29udGV4dCdzIHRyYW5zbGF0aW9ucyAtIGNvbnN0cmFpbiBpbiB3b3JraW5nIHZpZXdcbiAgICBsZXQgeDEgPSBNYXRoLm1heChhcmVhLmxlZnQsIHN0YXJ0KTtcbiAgICBsZXQgeDIgPSBNYXRoLm1pbihhcmVhLmxlZnQgKyBhcmVhLndpZHRoLCBzdGFydCArIGR1cmF0aW9uKTtcbiAgICB4MSAtPSAoc3RhcnQgKyBvZmZzZXQpO1xuICAgIHgyIC09IChzdGFydCArIG9mZnNldCk7XG4gICAgLy8ga2VlcCBjb25zaXN0ZW50IHdpdGggY29udGV4dCB5IGNvb3JkaW5hdGVzIHN5c3RlbVxuICAgIGxldCB5MSA9IHRoaXMucGFyYW1zLmhlaWdodCAtIChhcmVhLnRvcCArIGFyZWEuaGVpZ2h0KTtcbiAgICBsZXQgeTIgPSB0aGlzLnBhcmFtcy5oZWlnaHQgLSBhcmVhLnRvcDtcblxuICAgIHkxICs9IHRoaXMucGFyYW1zLnRvcDtcbiAgICB5MiArPSB0aGlzLnBhcmFtcy50b3A7XG5cbiAgICBjb25zdCBpdGVtU2hhcGVNYXAgPSB0aGlzLl8kaXRlbVNoYXBlTWFwO1xuICAgIGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLl9yZW5kZXJpbmdDb250ZXh0O1xuXG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLmQzaXRlbXMuZmlsdGVyKGZ1bmN0aW9uKGRhdHVtLCBpbmRleCkge1xuICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzO1xuICAgICAgY29uc3Qgc2hhcGUgPSBpdGVtU2hhcGVNYXAuZ2V0KGdyb3VwKTtcbiAgICAgIHJldHVybiBzaGFwZS5pbkFyZWEocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBpdGVtc1swXS5zbGljZSgwKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyAvIERpc3BsYXkgbWV0aG9kc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIC8qKlxuICAvLyAgKiAgUmV0dXJucyB0aGUgcHJldmlzb3VseSBjcmVhdGVkIGxheWVyJ3MgY29udGFpbmVyXG4gIC8vICAqICBAcmV0dXJuIHtET01FbGVtZW50fVxuICAvLyAgKi9cbiAgLy8gcmVuZGVyQ29udGFpbmVyKCkge1xuICAvLyAgIHJldHVybiB0aGlzLiRlbDtcbiAgLy8gfVxuXG4gIC8vIC8qKlxuICAvLyAgKiAgQ3JlYXRlcyB0aGUgRE9NIGFjY29yZGluZyB0byBnaXZlbiBkYXRhIGFuZCBzaGFwZXNcbiAgLy8gICovXG4gIC8vIHJlbmRlcigpe1xuICAvLyAgIHRoaXMuZHJhd1NoYXBlcygpO1xuICAvLyB9XG5cbiAgcmVuZGVyKCkge1xuICAgIC8vIGZvcmNlIGQzIHRvIGtlZXAgZGF0YSBpbiBzeW5jIHdpdGggdGhlIERPTSB3aXRoIGEgdW5pcXVlIGlkXG4gICAgdGhpcy5kYXRhLmZvckVhY2goZnVuY3Rpb24oZGF0dW0pIHtcbiAgICAgIGlmIChfZGF0dW1JZE1hcC5oYXMoZGF0dW0pKSB7IHJldHVybjsgfVxuICAgICAgX2RhdHVtSWRNYXAuc2V0KGRhdHVtLCBfY291bnRlcisrKTtcbiAgICB9KTtcblxuICAgIC8vIHNlbGVjdCBpdGVtc1xuICAgIHRoaXMuZDNpdGVtcyA9IGQzU2VsZWN0aW9uLnNlbGVjdCh0aGlzLiRvZmZzZXQpXG4gICAgICAuc2VsZWN0QWxsKCcuaXRlbScpXG4gICAgICAuZmlsdGVyKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb21tb24nKTtcbiAgICAgIH0pXG4gICAgICAuZGF0YSh0aGlzLmRhdGEsIGZ1bmN0aW9uKGRhdHVtKSB7XG4gICAgICAgIHJldHVybiBfZGF0dW1JZE1hcC5nZXQoZGF0dW0pO1xuICAgICAgfSk7XG5cbiAgICAvLyByZW5kZXIgYGNvbW1vblNoYXBlYCBvbmx5IG9uY2VcbiAgICBpZiAoXG4gICAgICB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb24gIT09IG51bGwgJiZcbiAgICAgIHRoaXMuXyRpdGVtQ29tbW9uU2hhcGVNYXAuc2l6ZSA9PT0gMFxuICAgICkge1xuICAgICAgY29uc3QgeyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfSA9IHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbjtcbiAgICAgIGNvbnN0ICRncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAgIGNvbnN0IHNoYXBlID0gbmV3IGN0b3Iob3B0aW9ucyk7XG5cbiAgICAgIHNoYXBlLmluc3RhbGwoYWNjZXNzb3JzKTtcbiAgICAgICRncm91cC5hcHBlbmRDaGlsZChzaGFwZS5yZW5kZXIoKSk7XG4gICAgICAkZ3JvdXAuY2xhc3NMaXN0LmFkZCgnaXRlbScsICdjb21tb24nLCBzaGFwZS5nZXRDbGFzc05hbWUoKSk7XG5cbiAgICAgIHRoaXMuXyRpdGVtQ29tbW9uU2hhcGVNYXAuc2V0KCRncm91cCwgc2hhcGUpO1xuICAgICAgdGhpcy4kb2Zmc2V0LmFwcGVuZENoaWxkKCRncm91cCk7XG4gICAgfVxuXG4gICAgLy8gLi4uIGVudGVyXG4gICAgdGhpcy5kM2l0ZW1zLmVudGVyKClcbiAgICAgIC5hcHBlbmQoKGRhdHVtLCBpbmRleCkgPT4ge1xuICAgICAgICAvLyBATk9URTogZDMgYmluZHMgYHRoaXNgIHRvIHRoZSBjb250YWluZXIgZ3JvdXBcbiAgICAgICAgY29uc3QgeyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfSA9IHRoaXMuX3NoYXBlQ29uZmlndXJhdGlvbjtcbiAgICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgY3RvcihvcHRpb25zKTtcbiAgICAgICAgc2hhcGUuaW5zdGFsbChhY2Nlc3NvcnMpO1xuXG4gICAgICAgIGNvbnN0ICRlbCA9IHNoYXBlLnJlbmRlcih0aGlzLl9yZW5kZXJpbmdDb250ZXh0KTtcbiAgICAgICAgJGVsLmNsYXNzTGlzdC5hZGQoJ2l0ZW0nLCBzaGFwZS5nZXRDbGFzc05hbWUoKSk7XG4gICAgICAgIHRoaXMuXyRpdGVtU2hhcGVNYXAuc2V0KCRlbCwgc2hhcGUpO1xuICAgICAgICB0aGlzLl8kaXRlbUQzU2VsZWN0aW9uTWFwLnNldCgkZWwsIGQzU2VsZWN0aW9uLnNlbGVjdCgkZWwpKTtcblxuICAgICAgICByZXR1cm4gJGVsO1xuICAgICAgfSk7XG5cbiAgICAvLyAuLi4gZXhpdFxuICAgIGNvbnN0IF8kaXRlbVNoYXBlTWFwID0gdGhpcy5fJGl0ZW1TaGFwZU1hcDtcbiAgICBjb25zdCBfJGl0ZW1EM1NlbGVjdGlvbk1hcCA9IHRoaXMuXyRpdGVtRDNTZWxlY3Rpb25NYXA7XG5cbiAgICB0aGlzLmQzaXRlbXMuZXhpdCgpXG4gICAgICAuZWFjaChmdW5jdGlvbihkYXR1bSwgaW5kZXgpIHtcbiAgICAgICAgY29uc3QgJGVsID0gdGhpcztcbiAgICAgICAgY29uc3Qgc2hhcGUgPSBfJGl0ZW1TaGFwZU1hcC5nZXQoJGVsKTtcbiAgICAgICAgLy8gY2xlYW4gYWxsIHNoYXBlL2l0ZW0gcmVmZXJlbmNlc1xuICAgICAgICBzaGFwZS5kZXN0cm95KCk7XG4gICAgICAgIF9kYXR1bUlkTWFwLmRlbGV0ZShkYXR1bSk7XG4gICAgICAgIF8kaXRlbVNoYXBlTWFwLmRlbGV0ZSgkZWwpO1xuICAgICAgICBfJGl0ZW1EM1NlbGVjdGlvbk1hcC5kZWxldGUoJGVsKTtcbiAgICAgIH0pXG4gICAgICAucmVtb3ZlKCk7XG4gIH1cblxuICAvKipcbiAgICogIHVwZGF0ZXMgQ29udGV4dCBhbmQgU2hhcGVzXG4gICAqL1xuICB1cGRhdGUoKSB7XG4gICAgdGhpcy51cGRhdGVDb250YWluZXIoKTtcbiAgICB0aGlzLnVwZGF0ZVNoYXBlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqICB1cGRhdGVzIHRoZSBjb250ZXh0IG9mIHRoZSBsYXllclxuICAgKi9cbiAgdXBkYXRlQ29udGFpbmVyKCkge1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcblxuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gdGhpcy50aW1lQ29udGV4dDtcblxuICAgIGNvbnN0IHdpZHRoICA9IHRpbWVDb250ZXh0LnhTY2FsZSh0aW1lQ29udGV4dC5kdXJhdGlvbik7XG4gICAgLy8gb2Zmc2V0IGlzIHJlbGF0aXZlIHRvIHRpbSRlbGluZSdzIHRpbWVDb250ZXh0XG4gICAgY29uc3QgeCAgICAgID0gdGltZUNvbnRleHQucGFyZW50LnhTY2FsZSh0aW1lQ29udGV4dC5zdGFydCk7XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGltZUNvbnRleHQueFNjYWxlKHRpbWVDb250ZXh0Lm9mZnNldCk7XG4gICAgY29uc3QgdG9wICAgID0gdGhpcy5wYXJhbXMudG9wO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICAvLyBtYXRyaXggdG8gaW52ZXJ0IHRoZSBjb29yZGluYXRlIHN5c3RlbVxuICAgIGNvbnN0IHRyYW5zbGF0ZU1hdHJpeCA9IGBtYXRyaXgoMSwgMCwgMCwgLTEsICR7eH0sICR7dG9wICsgaGVpZ2h0fSlgO1xuXG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHRyYW5zbGF0ZU1hdHJpeCk7XG5cbiAgICB0aGlzLiRib3VuZGluZ0JveC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG5cbiAgICB0aGlzLiRvZmZzZXQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHtvZmZzZXR9LCAwKWApO1xuXG4gICAgLy8gbWFpbnRhaW4gY29udGV4dCBzaGFwZVxuICAgIHRoaXMuY29udGV4dFNoYXBlLnVwZGF0ZShcbiAgICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQsXG4gICAgICB0aGlzLiRpbnRlcmFjdGlvbnMsXG4gICAgICB0aGlzLnRpbWVDb250ZXh0LFxuICAgICAgMFxuICAgICk7XG5cbiAgICAvLyBkZWJ1ZyBjb250ZXh0XG4gICAgaWYgKHRoaXMucGFyYW1zLmRlYnVnKSB7XG4gICAgICB0aGlzLiRkZWJ1Z1JlY3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgICAgdGhpcy4kZGVidWdSZWN0LnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlcyB0aGUgU2hhcGVzIHdoaWNoIGIkZWxvbmdzIHRvIHRoZSBsYXllclxuICAgKiAgQHBhcmFtIGl0ZW0ge0RPTUVsZW1lbnR9XG4gICAqL1xuICB1cGRhdGVTaGFwZXMoaXRlbSA9IG51bGwpIHtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCk7XG5cbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICBjb25zdCByZW5kZXJpbmdDb250ZXh0ID0gdGhpcy5fcmVuZGVyaW5nQ29udGV4dDtcbiAgICBjb25zdCBpdGVtcyA9IGl0ZW0gIT09IG51bGwgPyBkM1NlbGVjdGlvbi5zZWxlY3QoaXRlbSkgOiB0aGlzLmQzaXRlbXM7XG4gICAgLy8gdXBkYXRlIGNvbW1vbiBzaGFwZXNcbiAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwLmZvckVhY2goKHNoYXBlLCBpdGVtKSA9PiB7XG4gICAgICBzaGFwZS51cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgaXRlbSwgdGhpcy5kYXRhKTtcbiAgICB9KTtcblxuICAgIC8vIGQzIHVwZGF0ZSAtIGVudGl0eSBvciBjb2xsZWN0aW9uIHNoYXBlc1xuICAgIGl0ZW1zLmVhY2goZnVuY3Rpb24oZGF0dW0sIGluZGV4KSB7XG4gICAgICBjb25zdCAkZWwgPSB0aGlzO1xuICAgICAgY29uc3Qgc2hhcGUgPSB0aGF0Ll8kaXRlbVNoYXBlTWFwLmdldCgkZWwpO1xuICAgICAgc2hhcGUudXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsICRlbCwgZGF0dW0sIGluZGV4KTtcbiAgICB9KTtcbiAgfVxufVxuIl19