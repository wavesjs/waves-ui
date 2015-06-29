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
        // @NOTE: replaced `context.originalXScale` with `context.xScale`
        // => the behavior is not proper when the layer is stretched
        // const x      = this.timeContext._parent.xScale(this.timeContext.start);
        var x = this.timeContext.xScale(this.timeContext.start);
        var width = this.timeContext.xScale(this.timeContext.duration);
        var offset = this.timeContext.xScale(this.timeContext.offset);
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
        if (!items) {
          return;
        } // if no shape in the layer...
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
//# sourceMappingURL=data:application/json;base64,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QUFDLENBQUM7U0FDdkQ7T0FDRjs7QUFNRCxnQkFBWTs7Ozs7OzthQUFBLHdCQUFjOzs7WUFBYixJQUFJLGdDQUFHLElBQUk7O0FBQ3RCLFlBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztBQUNsQixZQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztBQUNoRCxZQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssSUFBSSxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQzs7O0FBR3ZFLFlBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFLO0FBQ2hELGVBQUssQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLE1BQUssSUFBSSxDQUFDLENBQUM7U0FDakQsQ0FBQyxDQUFDOzs7QUFHSCxZQUFJLENBQUMsS0FBSyxFQUFFO0FBQUUsaUJBQU87U0FBRTtBQUN2QixhQUFLLENBQUMsSUFBSSxDQUFDLFVBQVMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUNoQyxjQUFNLElBQUksR0FBRyxJQUFJLENBQUM7QUFDbEIsY0FBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDM0MsZUFBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3BELENBQUMsQ0FBQztPQUNKOzs7O1NBM2lCRyxLQUFLO0dBQVMsTUFBTSxDQUFDLFlBQVk7O0FBOGlCdkMsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMiLCJmaWxlIjoiZXM2L2NvcmUvbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBucyA9IHJlcXVpcmUoJy4vbmFtZXNwYWNlJyk7XG5jb25zdCBkM1NjYWxlID0gcmVxdWlyZSgnZDMtc2NhbGUnKTtcbmNvbnN0IGQzU2VsZWN0aW9uID0gcmVxdWlyZSgnZDMtc2VsZWN0aW9uJyk7XG5jb25zdCBTZWdtZW50ID0gcmVxdWlyZSgnLi4vc2hhcGVzL3NlZ21lbnQnKTtcbmNvbnN0IFNlZ21lbnRCZWhhdmlvciA9IHJlcXVpcmUoJy4uL2JlaGF2aW9ycy9zZWdtZW50LWJlaGF2aW9yJyk7XG5jb25zdCBldmVudHMgPSByZXF1aXJlKCdldmVudHMnKTtcblxuLy8gY3JlYXRlIGEgcHJpdmF0ZSBpdGVtIC0+IGlkIG1hcFxuLy8gaW4gb3JkZXIgdG8gZm9yY2UgZDMga2VlcGluZyBpbiBzeW5jIHdpdGggdGhlIERPTVxubGV0IF9jb3VudGVyID0gMDtcbmNvbnN0IF9kYXR1bUlkTWFwID0gbmV3IE1hcCgpO1xuXG5jbGFzcyBMYXllciBleHRlbmRzIGV2ZW50cy5FdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcihkYXRhVHlwZSwgZGF0YSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmRhdGFUeXBlID0gZGF0YVR5cGU7IC8vICdlbnRpdHknIHx8ICdjb2xsZWN0aW9uJztcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBoZWlnaHQ6IDEwMCxcbiAgICAgIHRvcDogMCxcbiAgICAgIGlkOiAnJyxcbiAgICAgIHlEb21haW46IFswLCAxXSxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICBkZWJ1Z0NvbnRleHQ6IGZhbHNlLCAvLyBwYXNzIHRoZSBjb250ZXh0IGluIGRlYnVnIG1vZGVcbiAgICAgIGNvbnRleHRIYW5kbGVyV2lkdGg6IDJcbiAgICB9O1xuXG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgdGhpcy50aW1lQ29udGV4dCA9IG51bGw7XG5cbiAgICB0aGlzLmNvbnRhaW5lciA9IG51bGw7IC8vIG9mZnNldCBncm91cCBvZiB0aGUgcGFyZW50IGNvbnRleHRcbiAgICB0aGlzLmdyb3VwID0gbnVsbDsgLy8gZ3JvdXAgY3JlYXRlZCBieSB0aGUgbGF5ZXIgaW5zaWRlIHRoZSBjb250ZXh0XG4gICAgdGhpcy5pdGVtcyA9IG51bGw7IC8vIGQzIGNvbGxlY3Rpb24gb2YgdGhlIGxheWVyIGl0ZW1zXG5cbiAgICB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb24gPSBudWxsOyAvLyB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9XG4gICAgdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uID0gbnVsbDsgLy8geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfVxuXG4gICAgdGhpcy5faXRlbVNoYXBlTWFwID0gbmV3IE1hcCgpOyAvLyBpdGVtIGdyb3VwIDxET01FbGVtZW50PiA9PiBzaGFwZVxuICAgIHRoaXMuX2l0ZW1Db21tb25TaGFwZU1hcCA9IG5ldyBNYXAoKTsgLy8gb25lIGVudHJ5IG1heCBpbiB0aGlzIG1hcFxuXG4gICAgdGhpcy5faXNDb250ZXh0RWRpdGFibGUgPSBmYWxzZTtcbiAgICB0aGlzLl9iZWhhdmlvciA9IG51bGw7XG5cbiAgICB0aGlzLl95U2NhbGUgPSBkM1NjYWxlLmxpbmVhcigpXG4gICAgICAuZG9tYWluKHRoaXMucGFyYW1zLnlEb21haW4pXG4gICAgICAucmFuZ2UoWzAsIHRoaXMucGFyYW1zLmhlaWdodF0pO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSB0aW1lQ29udGV4dCBsYXlvdXRcbiAgICB0aGlzLl9yZW5kZXIoKTtcbiAgfVxuXG4gIHNldCB5RG9tYWluKGRvbWFpbikge1xuICAgIHRoaXMucGFyYW1zLnlEb21haW4gPSBkb21haW47XG4gICAgdGhpcy5feVNjYWxlLmRvbWFpbihkb21haW4pO1xuICB9XG5cbiAgZ2V0IHlEb21haW4oKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLnlEb21haW47XG4gIH1cblxuICBzZXQgb3BhY2l0eSh2YWx1ZSkge1xuICAgIHRoaXMucGFyYW1zLm9wYWNpdHkgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBvcGFjaXR5KCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuICB9XG5cbiAgcGFyYW0obmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtc1tuYW1lXSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqICBAbWFuZGF0b3J5IGRlZmluZSB0aGUgY29udGV4dCBpbiB3aGljaCB0aGUgbGF5ZXIgaXMgZHJhd25cbiAgICogIEBwYXJhbSBjb250ZXh0IHtUaW1lQ29udGV4dH0gdGhlIHRpbWVDb250ZXh0IGluIHdoaWNoIHRoZSBsYXllciBpcyBkaXNwbGF5ZWRcbiAgICovXG4gIHNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KSB7XG4gICAgdGhpcy50aW1lQ29udGV4dCA9IHRpbWVDb250ZXh0O1xuICAgIC8vIGNyZWF0ZSBhIG1peGluIHRvIHBhc3MgdG8gc2hhcGVzXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dCA9IHt9O1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIERhdGFcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBnZXQgZGF0YSgpIHsgcmV0dXJuIHRoaXMuX2RhdGE7IH1cblxuICBzZXQgZGF0YShkYXRhKSB7XG4gICAgc3dpdGNoICh0aGlzLmRhdGFUeXBlKSB7XG4gICAgICBjYXNlICdlbnRpdHknOlxuICAgICAgICBpZiAodGhpcy5fZGF0YSkgeyAvLyBpZiBkYXRhIGFscmVhZHkgZXhpc3RzLCByZXVzZSB0aGUgcmVmZXJlbmNlXG4gICAgICAgICAgdGhpcy5fZGF0YVswXSA9IGRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fZGF0YSA9IFtkYXRhXTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbGxlY3Rpb24nOlxuICAgICAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ29tcG9uZW50IENvbmZpZ3VyYXRpb25cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIFJlZ2lzdGVyIHRoZSBzaGFwZSBhbmQgaXRzIGFjY2Vzc29ycyB0byB1c2UgaW4gb3JkZXIgdG8gcmVuZGVyXG4gICAqICB0aGUgZW50aXR5IG9yIGNvbGxlY3Rpb25cbiAgICogIEBwYXJhbSBjdG9yIDxGdW5jdGlvbjpCYXNlU2hhcGU+IHRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgc2hhcGUgdG8gYmUgdXNlZFxuICAgKiAgQHBhcmFtIGFjY2Vzc29ycyA8T2JqZWN0PiBhY2Nlc3NvcnMgdG8gdXNlIGluIG9yZGVyIHRvIG1hcCB0aGUgZGF0YSBzdHJ1Y3R1cmVcbiAgICovXG4gIGNvbmZpZ3VyZVNoYXBlKGN0b3IsIGFjY2Vzc29ycyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb24gPSB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9O1xuICB9XG5cblxuICAvKipcbiAgICogIFJlZ2lzdGVyIHRoZSBzaGFwZSB0byB1c2Ugd2l0aCB0aGUgZW50aXJlIGNvbGxlY3Rpb25cbiAgICogIGV4YW1wbGU6IHRoZSBsaW5lIGluIGEgYmVha3BvaW50IGZ1bmN0aW9uXG4gICAqICBAcGFyYW0gY3RvciB7QmFzZVNoYXBlfSB0aGUgY29uc3RydWN0b3Igb2YgdGhlIHNoYXBlIHRvIHVzZSB0byByZW5kZXIgZGF0YVxuICAgKiAgQHBhcmFtIGFjY2Vzc29ycyB7T2JqZWN0fSBhY2Nlc3NvcnMgdG8gdXNlIGluIG9yZGVyIHRvIG1hcCB0aGUgZGF0YSBzdHJ1Y3R1cmVcbiAgICovXG4gIGNvbmZpZ3VyZUNvbW1vblNoYXBlKGN0b3IsIGFjY2Vzc29ycyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb24gPSB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9O1xuICB9XG5cbiAgLyoqXG4gICAqICBSZWdpc3RlciB0aGUgYmVoYXZpb3IgdG8gdXNlIHdoZW4gaW50ZXJhY3Rpbmcgd2l0aCB0aGUgc2hhcGVcbiAgICogIEBwYXJhbSBiZWhhdmlvciB7QmFzZUJlaGF2aW9yfVxuICAgKi9cbiAgc2V0QmVoYXZpb3IoYmVoYXZpb3IpIHtcbiAgICBiZWhhdmlvci5pbml0aWFsaXplKHRoaXMpO1xuICAgIHRoaXMuX2JlaGF2aW9yID0gYmVoYXZpb3I7XG4gIH1cblxuICAvKipcbiAgICogIHVwZGF0ZSB0aGUgdmFsdWVzIGluIGBfcmVuZGVyaW5nQ29udGV4dGBcbiAgICogIGlzIHBhcnRpY3VsYXJ5IG5lZWRlZCB3aGVuIHVwZGF0aW5nIGBzdHJldGNoUmF0aW9gIGFzIHRoZSBwb2ludGVyXG4gICAqICB0byB0aGUgYHhTY2FsZWAgbWF5IGNoYW5nZVxuICAgKi9cbiAgX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKSB7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC54U2NhbGUgPSB0aGlzLnRpbWVDb250ZXh0LnhTY2FsZTtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnlTY2FsZSA9IHRoaXMuX3lTY2FsZTtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LmhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LndpZHRoICA9IHRoaXMudGltZUNvbnRleHQueFNjYWxlKHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24pO1xuICAgIC8vIGZvciBmb3JlaWduIG9qZWN0IGlzc3VlIGluIGNocm9tZVxuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQub2Zmc2V0WCA9IHRoaXMudGltZUNvbnRleHQueFNjYWxlKHRoaXMudGltZUNvbnRleHQub2Zmc2V0KTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEJlaGF2aW9yIEFjY2Vzc29yc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiAgQmVoYXZpb3IgZW50cnkgcG9pbnRzXG4gICAqICBATk9URSBBUEkgLT4gY2hhbmdlIGZvciBhbiBBcnJheSBhcyBmaXJzdCBhcmd1bWVudFxuICAgKiAgQFRPRE8gICAgIC0+IGhhbmRsZSBpZiBubyBiZWhhdmlvciBpcyByZWdpc3RlcmVkXG4gICAqL1xuICBnZXQgc2VsZWN0ZWRJdGVtcygpIHtcbiAgICByZXR1cm4gdGhpcy5fYmVoYXZpb3IgPyB0aGlzLl9iZWhhdmlvci5zZWxlY3RlZEl0ZW1zIDogW107XG4gIH1cblxuICBzZWxlY3QoaXRlbXMpIHtcbiAgICBpZiAoIXRoaXMuX2JlaGF2aW9ywqB8fMKgIWl0ZW1zKSB7IHJldHVybjsgfVxuICAgIGl0ZW1zID0gQXJyYXkuaXNBcnJheShpdGVtcykgPyBpdGVtcyA6IFtpdGVtc107XG5cbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpdGVtID0gdGhpcy5fZ2V0SXRlbUZyb21ET01FbGVtZW50KGl0ZW0pO1xuICAgICAgY29uc3QgZGF0dW0gPSBkM1NlbGVjdGlvbi5zZWxlY3QoaXRlbSkuZGF0dW0oKTtcbiAgICAgIHRoaXMuX2JlaGF2aW9yLnNlbGVjdChpdGVtLCBkYXR1bSk7XG4gICAgICB0aGlzLl90b0Zyb250KGl0ZW0pO1xuICAgIH0pO1xuICB9XG5cbiAgdW5zZWxlY3QoaXRlbXMpIHtcbiAgICBpZiAoIXRoaXMuX2JlaGF2aW9ywqB8fMKgIWl0ZW1zKSB7IHJldHVybjsgfVxuICAgIGl0ZW1zID0gQXJyYXkuaXNBcnJheShpdGVtcykgPyBpdGVtcyA6IFtpdGVtc107XG5cbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBkYXR1bSA9IGQzU2VsZWN0aW9uLnNlbGVjdChpdGVtKS5kYXR1bSgpO1xuICAgICAgdGhpcy5fYmVoYXZpb3IudW5zZWxlY3QoaXRlbSwgZGF0dW0pO1xuICAgIH0pO1xuICB9XG5cbiAgc2VsZWN0QWxsKCkge1xuICAgIHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4gdGhpcy5zZWxlY3QoaXRlbSkpO1xuICB9XG5cbiAgdW5zZWxlY3RBbGwoKSB7XG4gICAgdGhpcy5zZWxlY3RlZEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHRoaXMudW5zZWxlY3QoaXRlbSkpO1xuICB9XG5cbiAgdG9nZ2xlU2VsZWN0aW9uKGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcsKgfHzCoCFpdGVtcykgeyByZXR1cm47IH1cbiAgICBpdGVtcyA9IEFycmF5LmlzQXJyYXkoaXRlbXMpID8gaXRlbXMgOiBbaXRlbXNdO1xuXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgZGF0dW0gPSBkM1NlbGVjdGlvbi5zZWxlY3QoaXRlbSkuZGF0dW0oKTtcbiAgICAgIHRoaXMuX2JlaGF2aW9yLnRvZ2dsZVNlbGVjdGlvbihpdGVtLCBkYXR1bSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBAVE9ETyBjaGFuZ2Ugc2lnbmF0dXJlIGVkaXQoaXRlbXMgPSBbLi4uXSwgZHgsIGR5LCB0YXJnZXQpO1xuICAvLyAtPiBiZSBjb25zaXN0ZW50IGZvciBhbGwgYmVoYXZpb3JzIEFQSVxuICBlZGl0KGl0ZW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgY29uc3QgZGF0dW0gPSBkM1NlbGVjdGlvbi5zZWxlY3QoaXRlbSkuZGF0dW0oKTtcbiAgICBjb25zdCBzaGFwZSA9IHRoaXMuX2l0ZW1TaGFwZU1hcC5nZXQoaXRlbSk7XG4gICAgdGhpcy5fYmVoYXZpb3IuZWRpdCh0aGlzLl9yZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KTtcbiAgICB0aGlzLmVtaXQoJ2VkaXQnLCBzaGFwZSwgZGF0dW0pO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ29udGV4dCBCZWhhdmlvclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiAgZHJhdyB0aGUgc2hhcGUgdG8gaW50ZXJhY3Qgd2l0aCB0aGUgY29udGV4dFxuICAgKiAgQHBhcmFtcyBib29sIHtCb29sZWFufSBkZWZpbmUgaWYgdGhlIGxheWVyJ3MgY29udGV4dCBpcyBlZGl0YWJsZSBvciBub3RcbiAgICovXG4gIHNldCBlZGl0YWJsZShib29sKSB7XG4gICAgY29uc3QgZGlzcGxheSA9IGJvb2wgPyAnYmxvY2snIDogJ25vbmUnO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zR3JvdXAuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXk7XG4gICAgdGhpcy5faXNDb250ZXh0RWRpdGFibGUgPSBib29sO1xuICB9XG5cbiAgZ2V0IGVkaXRhYmxlKCkge1xuICAgIHJldHVybiB0aGlzLl9pc0NvbnRleHRFZGl0YWJsZTtcbiAgfVxuXG4gIC8vIEBOT1RFIGNyZWF0ZSBhIHByb3BlciBgQ29udGV4dEJlaGF2aW9yYCA/XG4gIGVkaXRDb250ZXh0KGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2hhbmRsZXInKSAmJiB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdsZWZ0JykpIHtcbiAgICAgIHRoaXMuX2VkaXRDb250ZXh0TGVmdChkeCk7XG4gICAgfSBlbHNlIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoYW5kbGVyJykgJiYgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygncmlnaHQnKSkge1xuICAgICAgdGhpcy5fZWRpdENvbnRleHRSaWdodChkeCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX21vdmVDb250ZXh0KGR4KTtcbiAgICB9XG4gIH1cblxuICBfZWRpdENvbnRleHRMZWZ0KGR4KSB7XG4gICAgY29uc3QgdGltZUNvbnRleHQgPSB0aGlzLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgID0gdGhpcy5fcmVuZGVyaW5nQ29udGV4dDtcbiAgICAvLyBlZGl0IGBjb250ZXh0LnN0YXJ0YCwgYGNvbnRleHQub2Zmc2V0YCBhbmQgYGNvbnRleHQuZHVyYXRpb25gXG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQueFNjYWxlKHRpbWVDb250ZXh0LnN0YXJ0KTtcbiAgICBjb25zdCBvZmZzZXQgPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZSh0aW1lQ29udGV4dC5vZmZzZXQpO1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC54U2NhbGUodGltZUNvbnRleHQuZHVyYXRpb24pO1xuXG4gICAgbGV0IHRhcmdldFggPSB4ICsgZHg7XG4gICAgbGV0IHRhcmdldE9mZnNldCA9IG9mZnNldCAtIGR4O1xuICAgIGxldCB0YXJnZXRXaWR0aCA9IE1hdGgubWF4KHdpZHRoIC0gZHgsIDApO1xuXG4gICAgdGhpcy50aW1lQ29udGV4dC5zdGFydCA9IHJlbmRlcmluZ0NvbnRleHQueFNjYWxlLmludmVydCh0YXJnZXRYKTtcbiAgICB0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCA9IHJlbmRlcmluZ0NvbnRleHQueFNjYWxlLmludmVydCh0YXJnZXRPZmZzZXQpO1xuICAgIHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24gPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZS5pbnZlcnQodGFyZ2V0V2lkdGgpO1xuICB9XG5cbiAgX2VkaXRDb250ZXh0UmlnaHQoZHgpIHtcbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IHRoaXMudGltZUNvbnRleHQ7XG4gICAgY29uc3QgcmVuZGVyaW5nQ29udGV4dCAgPSB0aGlzLl9yZW5kZXJpbmdDb250ZXh0O1xuICAgIC8vIGVkaXQgYGNvbnRleHQuZHVyYXRpb25gXG4gICAgY29uc3Qgd2lkdGggPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZSh0aW1lQ29udGV4dC5kdXJhdGlvbik7XG4gICAgbGV0IHRhcmdldFdpZHRoID0gTWF0aC5tYXgod2lkdGggKyBkeCwgMCk7XG5cbiAgICB0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uID0gcmVuZGVyaW5nQ29udGV4dC54U2NhbGUuaW52ZXJ0KHRhcmdldFdpZHRoKTtcbiAgfVxuXG4gIF9tb3ZlQ29udGV4dChkeCkge1xuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gdGhpcy50aW1lQ29udGV4dDtcbiAgICBjb25zdCByZW5kZXJpbmdDb250ZXh0ICA9IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQ7XG4gICAgLy8gZWRpdCBgY29udGV4dC5zdGFydGBcbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC54U2NhbGUodGltZUNvbnRleHQuc3RhcnQpO1xuICAgIGxldCB0YXJnZXRYID0gTWF0aC5tYXgoeCArIGR4LCAwKTtcblxuICAgIHRoaXMudGltZUNvbnRleHQuc3RhcnQgPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZS5pbnZlcnQodGFyZ2V0WCk7XG4gIH1cblxuICBzdHJldGNoQ29udGV4dChkeCwgZHksIHRhcmdldCkge31cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBIZWxwZXJzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqICBATk9URSBpcyBvbmx5IHVzZWQgb24gYGhhc0l0ZW1gID0+IG5vIG5lZWQgdG8gc2VwYXJhdGUgdGhpcyBtZXRob2RcbiAgICogIEByZXR1cm4ge0RPTUVsZW1lbnR9IHRoZSBjbG9zZXN0IHBhcmVudCBgaXRlbWAgZ3JvdXAgZm9yIGEgZ2l2ZW4gRE9NIGVsZW1lbnRcbiAgICovXG4gIF9nZXRJdGVtRnJvbURPTUVsZW1lbnQoZWwpIHtcbiAgICBkbyB7XG4gICAgICBpZiAoZWwuY2xhc3NMaXN0ICYmIGVsLmNsYXNzTGlzdC5jb250YWlucygnaXRlbScpKSB7IHJldHVybiBlbDsgfVxuICAgICAgZWwgPSBlbC5wYXJlbnROb2RlO1xuICAgIH0gd2hpbGUgKGVsICE9IHVuZGVmaW5lZCk7XG4gIH1cblxuICAvKipcbiAgICogIEBOT1RFIGJhZCBtZXRob2QgbmFtZSAhISFcbiAgICogIERlZmluZSBpZiBhbiBnaXZlbiBET00gZWxlbWVudCBiZWxvbmdzIHRvIG9uZSBvZiB0aGUgYGl0ZW1zYFxuICAgKiAgQHBhcmFtIGBlbGAge0RPTUVsZW1lbnR9IHRoZSBlbGVtZW50IHRvIGJlIHRlc3RlZFxuICAgKiAgQHJldHVybiB7bWl4ZWR9XG4gICAqICAgIHtET01FbGVtZW50fSBpdGVtIGdyb3VwIGNvbnRhaW5pbmcgdGhlIGBlbGAgaWYgYmVsb25ncyB0byB0aGlzIGxheWVyXG4gICAqICAgIG51bGwgb3RoZXJ3aXNlXG4gICAqL1xuICBoYXNJdGVtKGVsKSB7XG4gICAgY29uc3QgaXRlbSA9IHRoaXMuX2dldEl0ZW1Gcm9tRE9NRWxlbWVudChlbCk7XG4gICAgcmV0dXJuICh0aGlzLml0ZW1zLm5vZGVzKCkuaW5kZXhPZihpdGVtKSAhPT0gLTEpID8gaXRlbSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogIG1vdmVzIGFuIGBpdGVtYCdzIGdyb3VwIHRvIHRoZSBlbmQgb2YgdGhlIGxheWVyIChzdmcgei1pbmRleC4uLilcbiAgICogIEBwYXJhbSBgaXRlbWAge0RPTUVsZW1lbnR9IHRoZSBpdGVtIHRvIGJlIG1vdmVkXG4gICAqL1xuICBfdG9Gcm9udChpdGVtKSB7XG4gICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZChpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRGVmaW5lIGlmIGEgZ2l2ZW4gZWxlbWVudCBiZWxvbmdzIHRvIHRoZSBsYXllclxuICAgKiAgaXMgbW9yZSBnZW5lcmFsIHRoYW4gYGhhc0l0ZW1gLCBjYW4gYmUgdXNlZCB0byBjaGVjayBpbnRlcmFjdGlvbiBlbGVtZW50cyB0b29cbiAgICovXG4gIGhhc0VsZW1lbnQoZWwpIHtcbiAgICBkbyB7XG4gICAgICBpZiAoZWwgPT09IHRoaXMuY29udGFpbmVyKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICBlbCA9IGVsLnBhcmVudE5vZGU7XG4gICAgfSB3aGlsZSAoZWwgIT0gdW5kZWZpbmVkKTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgQHBhcmFtIGFyZWEge09iamVjdH0gYXJlYSBpbiB3aGljaCB0byBmaW5kIHRoZSBlbGVtZW50c1xuICAgKiAgQHJldHVybiB7QXJyYXl9IGxpc3Qgb2YgdGhlIERPTSBlbGVtZW50cyBpbiB0aGUgZ2l2ZW4gYXJlYVxuICAgKi9cbiAgZ2V0SXRlbXNJbkFyZWEoYXJlYSkge1xuICAgIC8vIHdvcmsgaW4gcGl4ZWwgZG9tYWluXG4gICAgY29uc3Qgc3RhcnQgICAgPSB0aGlzLnRpbWVDb250ZXh0LnhTY2FsZSh0aGlzLnRpbWVDb250ZXh0LnN0YXJ0KTtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMudGltZUNvbnRleHQueFNjYWxlKHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24pO1xuICAgIGNvbnN0IG9mZnNldCAgID0gdGhpcy50aW1lQ29udGV4dC54U2NhbGUodGhpcy50aW1lQ29udGV4dC5vZmZzZXQpO1xuICAgIGNvbnN0IHRvcCAgICAgID0gdGhpcy5wYXJhbXMudG9wO1xuICAgIC8vIG11c3QgYmUgYXdhcmUgb2YgdGhlIGxheWVyJ3MgY29udGV4dCBtb2RpZmljYXRpb25zXG4gICAgLy8gY29uc3RyYWluIGluIHdvcmtpbmcgdmlld1xuICAgIGxldCB4MSA9IE1hdGgubWF4KGFyZWEubGVmdCwgc3RhcnQpO1xuICAgIGxldCB4MiA9IE1hdGgubWluKGFyZWEubGVmdCArIGFyZWEud2lkdGgsIHN0YXJ0ICsgZHVyYXRpb24pO1xuICAgIC8vIGFwcGx5IHN0YXJ0IGFuZCBvZmZzZXRcbiAgICB4MSAtPSAoc3RhcnQgKyBvZmZzZXQpO1xuICAgIHgyIC09IChzdGFydCArIG9mZnNldCk7XG4gICAgLy8gYmUgY29uc2lzdGVudCB3aXRoIGNvbnRleHQgeSBjb29yZGluYXRlcyBzeXN0ZW1cbiAgICBsZXQgeTEgPSB0aGlzLnBhcmFtcy5oZWlnaHQgLSAoYXJlYS50b3AgKyBhcmVhLmhlaWdodCk7XG4gICAgbGV0IHkyID0gdGhpcy5wYXJhbXMuaGVpZ2h0IC0gYXJlYS50b3A7XG5cbiAgICB5MSArPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgeTIgKz0gdGhpcy5wYXJhbXMudG9wO1xuXG4gICAgY29uc3QgaXRlbVNoYXBlTWFwID0gdGhpcy5faXRlbVNoYXBlTWFwO1xuICAgIGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLl9yZW5kZXJpbmdDb250ZXh0O1xuXG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLml0ZW1zLmZpbHRlcihmdW5jdGlvbihkYXR1bSwgaW5kZXgpIHtcbiAgICAgIGNvbnN0IGdyb3VwID0gdGhpcztcbiAgICAgIGNvbnN0IHNoYXBlID0gaXRlbVNoYXBlTWFwLmdldChncm91cCk7XG4gICAgICByZXR1cm4gc2hhcGUuaW5BcmVhKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaXRlbXNbMF0uc2xpY2UoMCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZW5kZXJpbmcgLyBEaXNwbGF5IG1ldGhvZHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIHJlbmRlciB0aGUgRE9NIGluIG1lbW9yeSBvbiBsYXllciBjcmVhdGlvbiB0byBiZSBhYmxlIHRvIHVzZSBpdCBiZWZvcmVcbiAgICogIHRoZSBsYXllciBpcyBhY3R1YWxseSBpbnNlcnRlZCBpbiB0aGUgRE9NXG4gICAqL1xuICBfcmVuZGVyKCkge1xuICAgIC8vIHdyYXBwZXIgZ3JvdXAgZm9yIGBzdGFydCwgdG9wIGFuZCBjb250ZXh0IGZsaXAgbWF0cml4XG4gICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnbGF5ZXInKTtcbiAgICAvLyBhcHBlbmQgYSBzdmcgdG8gY2xpcCB0aGUgY29udGV4dFxuICAgIC8vIEBOT1RFOiBjb3VsZCB1c2UgYSBncm91cCB3aXRoIGEgYGNsaXBQYXRoYCBwcm9wZXJ0eVxuICAgIHRoaXMuYm91bmRpbmdCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdzdmcnKTtcbiAgICB0aGlzLmJvdW5kaW5nQm94LmNsYXNzTGlzdC5hZGQoJ2JvdW5kaW5nLWJveCcpO1xuICAgIC8vIHRoaXMuYm91bmRpbmdCb3guc2V0QXR0cmlidXRlTlMobnVsbCwgJ2lkJywgdGhpcy5wYXJhbXMuaWQpO1xuICAgIC8vIGdyb3VwIHRvIGFwcGx5IG9mZnNldFxuICAgIHRoaXMuZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy5ncm91cC5jbGFzc0xpc3QuYWRkKCdvZmZzZXQnLCAnaXRlbXMnKTtcblxuICAgIC8vIGNvbnRleHQgaW50ZXJhY3Rpb25zXG4gICAgdGhpcy5pbnRlcmFjdGlvbnNHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLmludGVyYWN0aW9uc0dyb3VwLmNsYXNzTGlzdC5hZGQoJ2xheWVyLWludGVyYWN0aW9ucycpO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zR3JvdXAuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAvLyBATk9URTogd29ya3MgYnV0IGtpbmcgb2YgdWdseS4uLiBtdXN0IGJlIGNsZWFuZWRcbiAgICB0aGlzLmNvbnRleHRTaGFwZSA9IG5ldyBTZWdtZW50KCk7XG4gICAgdGhpcy5jb250ZXh0U2hhcGUuaW5zdGFsbCh7XG4gICAgICBvcGFjaXR5OiAoKSA9PiAwLjEsXG4gICAgICBjb2xvciAgOiAoKSA9PiAnIzc4Nzg3OCcsXG4gICAgICB3aWR0aCAgOiAoKSA9PiB0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uLFxuICAgICAgaGVpZ2h0IDogKCkgPT4gdGhpcy5fcmVuZGVyaW5nQ29udGV4dC55U2NhbGUuZG9tYWluKClbMV0sXG4gICAgICB5ICAgICAgOiAoKSA9PiB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnlTY2FsZS5kb21haW4oKVswXVxuICAgIH0pO1xuXG4gICAgdGhpcy5pbnRlcmFjdGlvbnNHcm91cC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRleHRTaGFwZS5yZW5kZXIoKSk7XG5cbiAgICAvLyBjcmVhdGUgdGhlIERPTSB0cmVlXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5ib3VuZGluZ0JveCk7XG4gICAgdGhpcy5ib3VuZGluZ0JveC5hcHBlbmRDaGlsZCh0aGlzLmludGVyYWN0aW9uc0dyb3VwKTtcbiAgICB0aGlzLmJvdW5kaW5nQm94LmFwcGVuZENoaWxkKHRoaXMuZ3JvdXApO1xuXG4gICAgLy8gZHJhdyBhIFNlZ21lbnQgaW4gY29udGV4dCBiYWNrZ3JvdW5kIHRvIGRlYnVnIGl0J3Mgc2l6ZVxuICAgIGlmICh0aGlzLnBhcmFtcy5kZWJ1Zykge1xuICAgICAgdGhpcy5kZWJ1Z1JlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdTZWdtZW50Jyk7XG4gICAgICB0aGlzLmJvdW5kaW5nQm94LmFwcGVuZENoaWxkKHRoaXMuZGVidWdSZWN0KTtcbiAgICAgIHRoaXMuZGVidWdSZWN0LnN0eWxlLmZpbGwgPSAnI2FiYWJhYic7XG4gICAgICB0aGlzLmRlYnVnUmVjdC5zdHlsZS5maWxsT3BhY2l0eSA9IDAuMTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIGNyZWF0ZXMgdGhlIGxheWVyIGdyb3VwIHdpdGggYSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXggdG8gZmxpcCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW0uXG4gICAqICBAcmV0dXJuIHtET01FbGVtZW50fVxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGUgdGhlIERPTSBhY2NvcmRpbmcgdG8gZ2l2ZW4gZGF0YSBhbmQgc2hhcGVzXG4gICAqL1xuICBkcmF3KCkge1xuICAgIC8vIGNyZWF0ZSBhIHVuaXF1ZSBpZCB0byBmb3JjZSBkMyB0byBrZWVwIGRhdGEgaW4gc3luYyB3aXRoIHRoZSBET01cbiAgICB0aGlzLmRhdGEuZm9yRWFjaChmdW5jdGlvbihkYXR1bSkge1xuICAgICAgaWYgKF9kYXR1bUlkTWFwLmhhcyhkYXR1bSkpIHsgcmV0dXJuOyB9XG4gICAgICBfZGF0dW1JZE1hcC5zZXQoZGF0dW0sIF9jb3VudGVyKyspO1xuICAgIH0pO1xuXG4gICAgLy8gc2VsZWN0IGl0ZW1zXG4gICAgdGhpcy5pdGVtcyA9IGQzU2VsZWN0aW9uLnNlbGVjdCh0aGlzLmdyb3VwKVxuICAgICAgLnNlbGVjdEFsbCgnLml0ZW0nKVxuICAgICAgLmZpbHRlcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmNsYXNzTGlzdC5jb250YWlucygnY29tbW9uJyk7XG4gICAgICB9KVxuICAgICAgLmRhdGEodGhpcy5kYXRhLCBmdW5jdGlvbihkYXR1bSkge1xuICAgICAgICByZXR1cm4gX2RhdHVtSWRNYXAuZ2V0KGRhdHVtKTtcbiAgICAgIH0pO1xuXG4gICAgLy8gaGFuZGxlIGNvbW1vblNoYXBlcyAtPiByZW5kZXIgb25seSBvbmNlXG4gICAgaWYgKFxuICAgICAgdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uICE9PSBudWxsICYmXG4gICAgICB0aGlzLl9pdGVtQ29tbW9uU2hhcGVNYXAuc2l6ZSA9PT0gMFxuICAgICkge1xuICAgICAgY29uc3QgeyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfSA9IHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbjtcbiAgICAgIGNvbnN0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgY3RvcihvcHRpb25zKTtcblxuICAgICAgc2hhcGUuaW5zdGFsbChhY2Nlc3NvcnMpO1xuICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQoc2hhcGUucmVuZGVyKCkpO1xuICAgICAgZ3JvdXAuY2xhc3NMaXN0LmFkZCgnaXRlbScsICdjb21tb24nLCBzaGFwZS5nZXRDbGFzc05hbWUoKSk7XG5cbiAgICAgIHRoaXMuX2l0ZW1Db21tb25TaGFwZU1hcC5zZXQoZ3JvdXAsIHNoYXBlKTtcbiAgICAgIHRoaXMuZ3JvdXAuYXBwZW5kQ2hpbGQoZ3JvdXApO1xuICAgIH1cblxuICAgIC8vIGVudGVyXG4gICAgdGhpcy5pdGVtcy5lbnRlcigpXG4gICAgICAuYXBwZW5kKChkYXR1bSwgaW5kZXgpID0+IHtcbiAgICAgICAgLy8gQE5PVEU6IGQzIGJpbmRzIGB0aGlzYCB0byB0aGUgY29udGFpbmVyIGdyb3VwXG4gICAgICAgIGNvbnN0IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH0gPSB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb247XG4gICAgICAgIGNvbnN0IHNoYXBlID0gbmV3IGN0b3Iob3B0aW9ucyk7XG4gICAgICAgIHNoYXBlLmluc3RhbGwoYWNjZXNzb3JzKTtcblxuICAgICAgICBjb25zdCBpdGVtID0gc2hhcGUucmVuZGVyKHRoaXMuX3JlbmRlcmluZ0NvbnRleHQpXG4gICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnaXRlbScsIHNoYXBlLmdldENsYXNzTmFtZSgpKTtcbiAgICAgICAgdGhpcy5faXRlbVNoYXBlTWFwLnNldChpdGVtLCBzaGFwZSk7XG5cbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9KTtcblxuICAgIC8vIGV4aXRcbiAgICBjb25zdCBfaXRlbVNoYXBlTWFwID0gdGhpcy5faXRlbVNoYXBlTWFwO1xuXG4gICAgdGhpcy5pdGVtcy5leGl0KClcbiAgICAgIC5lYWNoKGZ1bmN0aW9uKGRhdHVtLCBpbmRleCkge1xuICAgICAgICBjb25zdCBpdGVtID0gdGhpcztcbiAgICAgICAgY29uc3Qgc2hhcGUgPSBfaXRlbVNoYXBlTWFwLmdldChpdGVtKTtcbiAgICAgICAgLy8gY2xlYW4gYWxsIHNoYXBlL2l0ZW0gcmVmZXJlbmNlc1xuICAgICAgICBzaGFwZS5kZXN0cm95KCk7XG4gICAgICAgIF9kYXR1bUlkTWFwLmRlbGV0ZShkYXR1bSk7XG4gICAgICAgIF9pdGVtU2hhcGVNYXAuZGVsZXRlKGl0ZW0pO1xuICAgICAgfSlcbiAgICAgIC5yZW1vdmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlcyBDb250ZXh0IGFuZCBTaGFwZXNcbiAgICovXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCk7XG5cbiAgICB0aGlzLnVwZGF0ZUNvbnRhaW5lcigpO1xuICAgIHRoaXMudXBkYXRlU2hhcGVzKCk7XG4gIH1cblxuICAvKipcbiAgICogIHVwZGF0ZXMgdGhlIGNvbnRleHQgb2YgdGhlIGxheWVyXG4gICAqL1xuICB1cGRhdGVDb250YWluZXIoKSB7XG4gICAgLy8gQE5PVEU6IHJlcGxhY2VkIGBjb250ZXh0Lm9yaWdpbmFsWFNjYWxlYCB3aXRoIGBjb250ZXh0LnhTY2FsZWBcbiAgICAvLyA9PiB0aGUgYmVoYXZpb3IgaXMgbm90IHByb3BlciB3aGVuIHRoZSBsYXllciBpcyBzdHJldGNoZWRcbiAgICAvLyBjb25zdCB4ICAgICAgPSB0aGlzLnRpbWVDb250ZXh0Ll9wYXJlbnQueFNjYWxlKHRoaXMudGltZUNvbnRleHQuc3RhcnQpO1xuICAgIGNvbnN0IHggICAgICA9IHRoaXMudGltZUNvbnRleHQueFNjYWxlKHRoaXMudGltZUNvbnRleHQuc3RhcnQpO1xuICAgIGNvbnN0IHdpZHRoICA9IHRoaXMudGltZUNvbnRleHQueFNjYWxlKHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24pO1xuICAgIGNvbnN0IG9mZnNldCA9IHRoaXMudGltZUNvbnRleHQueFNjYWxlKHRoaXMudGltZUNvbnRleHQub2Zmc2V0KTtcbiAgICBjb25zdCB0b3AgICAgPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIC8vIG1hdHJpeCB0byBpbnZlcnQgdGhlIGNvb3JkaW5hdGUgc3lzdGVtXG4gICAgY29uc3QgdHJhbnNsYXRlTWF0cml4ID0gYG1hdHJpeCgxLCAwLCAwLCAtMSwgJHt4fSwgJHt0b3AgKyBoZWlnaHR9KWA7XG5cbiAgICB0aGlzLmNvbnRhaW5lci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlTWF0cml4KTtcblxuICAgIC8vIGNvbnN0IGNsaXBQYXRoID0gYHBvbHlnb24oMCAwLCAke3dpZHRofXB4IDAsICR7d2lkdGh9cHggJHtoZWlnaHR9cHgsIDAgJHtoZWlnaHR9cHgpYDtcbiAgICAvLyAtd2Via2l0LWNsaXAtcGF0aDogcG9seWdvbigwIDAsIDc0MHB4IDAsIDc0MHB4IDE2MHB4LCAwIDE2MHB4KTtcbiAgICAvLyB0aGlzLmJvdW5kaW5nQm94LnN0eWxlLndlYmtpdENsaXBQYXRoID0gY2xpcFBhdGg7XG5cbiAgICB0aGlzLmJvdW5kaW5nQm94LnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHdpZHRoKTtcbiAgICB0aGlzLmJvdW5kaW5nQm94LnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgIHRoaXMuYm91bmRpbmdCb3guc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG5cbiAgICB0aGlzLmdyb3VwLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7b2Zmc2V0fSwgMClgKTtcblxuICAgIC8vIG1haW50YWluIGNvbnRleHQgc2hhcGVcbiAgICB0aGlzLmNvbnRleHRTaGFwZS51cGRhdGUoXG4gICAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LFxuICAgICAgdGhpcy5pbnRlcmFjdGlvbnNHcm91cCxcbiAgICAgIHRoaXMudGltZUNvbnRleHQsXG4gICAgICAwXG4gICAgKTtcblxuICAgIC8vIGRlYnVnIGNvbnRleHRcbiAgICBpZiAodGhpcy5wYXJhbXMuZGVidWcpIHtcbiAgICAgIHRoaXMuZGVidWdSZWN0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHdpZHRoKTtcbiAgICAgIHRoaXMuZGVidWdSZWN0LnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlcyB0aGUgU2hhcGVzIHdoaWNoIGJlbG9uZ3MgdG8gdGhlIGxheWVyXG4gICAqICBAcGFyYW0gaXRlbSB7RE9NRWxlbWVudH1cbiAgICovXG4gIHVwZGF0ZVNoYXBlcyhpdGVtID0gbnVsbCkge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLl9yZW5kZXJpbmdDb250ZXh0O1xuICAgIGNvbnN0IGl0ZW1zID0gaXRlbSAhPT0gbnVsbCA/IGQzU2VsZWN0aW9uLnNlbGVjdEFsbChpdGVtKSA6IHRoaXMuaXRlbXM7XG5cbiAgICAvLyB1cGRhdGUgY29tbW9uIHNoYXBlc1xuICAgIHRoaXMuX2l0ZW1Db21tb25TaGFwZU1hcC5mb3JFYWNoKChzaGFwZSwgaXRlbSkgPT4ge1xuICAgICAgc2hhcGUudXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGl0ZW0sIHRoaXMuZGF0YSk7XG4gICAgfSk7XG5cbiAgICAvLyB1cGRhdGUgZW50aXR5IG9yIGNvbGxlY3Rpb24gc2hhcGVzXG4gICAgaWYgKCFpdGVtcykgeyByZXR1cm47IH0gLy8gaWYgbm8gc2hhcGUgaW4gdGhlIGxheWVyLi4uXG4gICAgaXRlbXMuZWFjaChmdW5jdGlvbihkYXR1bSwgaW5kZXgpIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzO1xuICAgICAgY29uc3Qgc2hhcGUgPSB0aGF0Ll9pdGVtU2hhcGVNYXAuZ2V0KGl0ZW0pO1xuICAgICAgc2hhcGUudXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGl0ZW0sIGRhdHVtLCBpbmRleCk7XG4gICAgfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMYXllcjtcbiJdfQ==