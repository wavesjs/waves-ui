'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Map = require('babel-runtime/core-js/map')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utilsScales = require('../utils/scales');

var _utilsScales2 = _interopRequireDefault(_utilsScales);

var _d3Selection = require('d3-selection');

var _d3Selection2 = _interopRequireDefault(_d3Selection);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _namespace = require('./namespace');

var _namespace2 = _interopRequireDefault(_namespace);

var _shapesSegment = require('../shapes/segment');

var _shapesSegment2 = _interopRequireDefault(_shapesSegment);

var _behaviorsTimeContextBehavior = require('../behaviors/time-context-behavior');

// time context bahevior

var _behaviorsTimeContextBehavior2 = _interopRequireDefault(_behaviorsTimeContextBehavior);

var timeContextBehavior = null;
var timeContextBehaviorCtor = _behaviorsTimeContextBehavior2['default'];

// private item -> id map to force d3 tp keep in sync with the DOM
var _counter = 0;
var _datumIdMap = new _Map();

var Layer = (function (_events$EventEmitter) {
  _inherits(Layer, _events$EventEmitter);

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
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, Layer);

    _get(Object.getPrototypeOf(Layer.prototype), 'constructor', this).call(this);
    this.dataType = dataType; // 'entity' || 'collection';
    this.data = data;

    var defaults = {
      height: 100,
      top: 0,
      id: '',
      yDomain: [0, 1],
      opacity: 1,
      debugContext: false, // pass the context in debug mode
      contextHandlerWidth: 2,
      className: null
    };

    this.params = _Object$assign({}, defaults, options);
    this.timeContext = null;

    // container elements
    this.$el = null; // offset group of the parent context
    this.$boundingBox = null;
    this.$offset = null;
    this.$interactions = null;

    this.d3items = null; // d3 collection of the layer items

    this._shapeConfiguration = null; // { ctor, accessors, options }
    this._commonShapeConfiguration = null; // { ctor, accessors, options }

    this._$itemShapeMap = new _Map(); // item group <DOMElement> => shape
    this._$itemD3SelectionMap = new _Map(); // item group <DOMElement> => shape
    this._$itemCommonShapeMap = new _Map(); // one entry max in this map

    this._isContextEditable = false;
    this._behavior = null;

    this._valueToPixel = _utilsScales2['default'].linear().domain(this.params.yDomain).range([0, this.params.height]);

    this.contextBehavior = '';

    // initialize timeContext layout
    this._renderContainer();

    // creates the timeContextBehavior for all layer, lazy instanciation
    if (timeContextBehavior === null) {
      timeContextBehavior = new timeContextBehaviorCtor();
    }
  }

  /**
   *  allows to override default the TimeContextBehavior
   */

  _createClass(Layer, [{
    key: 'setTimeContext',

    /**
     * TimeContext accessors
     */

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

    // --------------------------------------
    // Data
    // --------------------------------------

  }, {
    key: '_renderContainer',

    // Initialization

    /**
     *  render the DOM in memory on layer creation to be able to use it before
     *  the layer is actually inserted in the DOM
     */
    value: function _renderContainer() {
      var _this = this;

      // wrapper group for `start, top and context flip matrix
      this.$el = document.createElementNS(_namespace2['default'], 'g');
      if (this.params.className !== null) {
        this.$el.classList.add('layer', this.params.className);
      }
      // clip the context with a `svg` element
      this.$boundingBox = document.createElementNS(_namespace2['default'], 'svg');
      this.$boundingBox.classList.add('bounding-box');
      // group to apply offset
      this.$offset = document.createElementNS(_namespace2['default'], 'g');
      this.$offset.classList.add('offset', 'items');
      // layer background
      this.$background = document.createElementNS(_namespace2['default'], 'rect');
      this.$background.setAttributeNS(null, 'height', '100%');
      this.$background.setAttributeNS(null, 'width', '100%');
      this.$background.classList.add('background');
      this.$background.style.fillOpacity = 0;
      this.$background.style.pointerEvents = 'none';
      // context interactions
      this.$interactions = document.createElementNS(_namespace2['default'], 'g');
      this.$interactions.classList.add('interactions');
      this.$interactions.style.display = 'none';
      // @NOTE: works but king of ugly... should be cleaned
      this.contextShape = new _shapesSegment2['default']();
      this.contextShape.install({
        opacity: function opacity() {
          return 0.1;
        },
        color: function color() {
          return '#787878';
        },
        width: function width() {
          return _this.timeContext.duration;
        },
        height: function height() {
          return _this._renderingContext.valueToPixel.domain()[1];
        },
        y: function y() {
          return _this._renderingContext.valueToPixel.domain()[0];
        }
      });

      this.$interactions.appendChild(this.contextShape.render());
      // create the DOM tree
      this.$el.appendChild(this.$boundingBox);
      this.$boundingBox.appendChild(this.$offset);
      this.$offset.appendChild(this.$background);
      this.$boundingBox.appendChild(this.$interactions);

      // draw a Segment in context background to debug it's size
      if (this.params.debug) {
        this.$debugRect = document.createElementNS(_namespace2['default'], 'Segment');
        this.$boundingBox.appendChild(this.$debugRect);
        this.$debugRect.style.fill = '#ababab';
        this.$debugRect.style.fillOpacity = 0.1;
      }
    }

    // --------------------------------------
    // Component Configuration
    // --------------------------------------

    /**
     *  Register the shape and its accessors to use in order to render
     *  the entity or collection
     *  @param ctor <Function:BaseShape> the constructor of the shape to be used
     *  @param accessors <Object> accessors to use in order to map the data structure
     */
  }, {
    key: 'configureShape',
    value: function configureShape(ctor) {
      var accessors = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      this._shapeConfiguration = { ctor: ctor, accessors: accessors, options: options };
    }

    /**
     *  Register the shape to use with the entire collection
     *  example: the line in a beakpoint function
     *  @param ctor {BaseShape} the constructor of the shape to use to render data
     *  @param accessors {Object} accessors to use in order to map the data structure
     */
  }, {
    key: 'configureCommonShape',
    value: function configureCommonShape(ctor) {
      var accessors = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      this._commonShapeConfiguration = { ctor: ctor, accessors: accessors, options: options };
    }

    /**
     *  Register the behavior to use when interacting with the shape
     *  @param behavior {BaseBehavior}
     */
  }, {
    key: 'setBehavior',
    value: function setBehavior(behavior) {
      behavior.initialize(this);
      this._behavior = behavior;
    }

    /**
     *  update the values in `_renderingContext`
     *  is particulary needed when updating `stretchRatio` as the pointer
     *  to the `timeToPixel` scale may change
     */
  }, {
    key: '_updateRenderingContext',
    value: function _updateRenderingContext() {
      this._renderingContext.timeToPixel = this.timeContext.timeToPixel;
      this._renderingContext.valueToPixel = this._valueToPixel;
      this._renderingContext.height = this.params.height;
      this._renderingContext.width = this.timeContext.timeToPixel(this.timeContext.duration);
      // for foreign object issue in chrome
      this._renderingContext.offsetX = this.timeContext.timeToPixel(this.timeContext.offset);
    }

    // --------------------------------------
    // Behavior Accessors
    // --------------------------------------

  }, {
    key: 'select',
    value: function select() {
      var _this2 = this;

      for (var _len = arguments.length, $items = Array(_len), _key = 0; _key < _len; _key++) {
        $items[_key] = arguments[_key];
      }

      if (!this._behavior) {
        return;
      }
      if (!$items.length) {
        $items = this.d3items.nodes();
      }
      if (Array.isArray($items[0])) {
        $items = $items[0];
      }

      $items.forEach(function ($el) {
        var item = _this2._$itemD3SelectionMap.get($el);
        _this2._behavior.select($el, item.datum());
        _this2._toFront($el);
      });
    }
  }, {
    key: 'unselect',
    value: function unselect() {
      var _this3 = this;

      for (var _len2 = arguments.length, $items = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        $items[_key2] = arguments[_key2];
      }

      if (!this._behavior) {
        return;
      }
      if (!$items.length) {
        $items = this.d3items.nodes();
      }
      if (Array.isArray($items[0])) {
        $items = $items[0];
      }

      $items.forEach(function ($el) {
        var item = _this3._$itemD3SelectionMap.get($el);
        _this3._behavior.unselect($el, item.datum());
      });
    }
  }, {
    key: 'toggleSelection',
    value: function toggleSelection() {
      var _this4 = this;

      for (var _len3 = arguments.length, $items = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        $items[_key3] = arguments[_key3];
      }

      if (!this._behavior) {
        return;
      }
      if (!$items.length) {
        $items = this.d3items.nodes();
      }
      if (Array.isArray($items[0])) {
        $items = $items[0];
      }

      $items.forEach(function ($el) {
        var item = _this4._$itemD3SelectionMap.get($el);
        _this4._behavior.toggleSelection($el, item.datum());
      });
    }
  }, {
    key: 'edit',
    value: function edit($items, dx, dy, target) {
      var _this5 = this;

      if (!this._behavior) {
        return;
      }
      $items = !Array.isArray($items) ? [$items] : $items;

      $items.forEach(function ($el) {
        var item = _this5._$itemD3SelectionMap.get($el);
        var shape = _this5._$itemShapeMap.get($el);
        var datum = item.datum();
        _this5._behavior.edit(_this5._renderingContext, shape, datum, dx, dy, target);
        _this5.emit('edit', shape, datum);
      });
    }

    /**
     *  draws the shape to interact with the context
     *  @params {Boolean} [bool=true] - defines if the layer's context is editable or not
     */
  }, {
    key: 'setContextEditable',
    value: function setContextEditable() {
      var bool = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      var display = bool ? 'block' : 'none';
      this.$interactions.style.display = display;
      this._isContextEditable = bool;
    }
  }, {
    key: 'editContext',
    value: function editContext(dx, dy, target) {
      timeContextBehavior.edit(this, dx, dy, target);
    }
  }, {
    key: 'stretchContext',
    value: function stretchContext(dx, dy, target) {
      timeContextBehavior.stretch(this, dx, dy, target);
    }

    // --------------------------------------
    // Helpers
    // --------------------------------------

    /**
     *  Moves an `$el`'s group to the end of the layer (svg z-index...)
     *  @param `$el` {DOMElement} the DOMElement to be moved
     */
  }, {
    key: '_toFront',
    value: function _toFront($el) {
      this.$offset.appendChild($el);
    }

    /**
     *  Returns the d3Selection item to which the given DOMElement b$elongs
     *  @param `$el` {DOMElement} the element to be tested
     *  @return {DOMElement|null} item group containing the `$el` if b$elongs to this layer, null otherwise
     */
  }, {
    key: 'getItemFromDOMElement',
    value: function getItemFromDOMElement($el) {
      var $item = undefined;

      do {
        if ($el.classList && $el.classList.contains('item')) {
          $item = $el;
          break;
        }

        $el = $el.parentNode;
      } while ($el !== null);

      return this.hasItem($item) ? $item : null;
    }

    /**
     *  Returns the datum associated to a specific item DOMElement
     *  use d3 internally to retrieve the datum
     *  @param $item {DOMElement}
     *  @return {Object|Array|null} depending on the user data structure
     */
  }, {
    key: 'getDatumFromItem',
    value: function getDatumFromItem($item) {
      var d3item = this._$itemD3SelectionMap.get($item);
      return d3item ? d3item.datum() : null;
    }

    /**
     *  Defines if the given d3 selection is an item of the layer
     *  @param item {DOMElement}
     *  @return {bool}
     */
  }, {
    key: 'hasItem',
    value: function hasItem($item) {
      var nodes = this.d3items.nodes();
      return nodes.indexOf($item) !== -1;
    }

    /**
     *  Defines if a given element b$elongs to the layer
     *  is more general than `hasItem`, can be used to check interaction elements too
     *  @param $el {DOMElement}
     *  @return {bool}
     */
  }, {
    key: 'hasElement',
    value: function hasElement($el) {
      do {
        if ($el === this.$el) {
          return true;
        }

        $el = $el.parentNode;
      } while ($el !== null);

      return false;
    }

    /**
     *  @param area {Object} area in which to find the elements
     *  @return {Array} list of the DOM elements in the given area
     */
  }, {
    key: 'getItemsInArea',
    value: function getItemsInArea(area) {
      var start = this.timeContext.timeToPixel(this.timeContext.start);
      var duration = this.timeContext.timeToPixel(this.timeContext.duration);
      var offset = this.timeContext.timeToPixel(this.timeContext.offset);
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

      return items.nodes().slice(0);
    }

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

  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      // force d3 to keep data in sync with the DOM with a unique id
      this.data.forEach(function (datum) {
        if (_datumIdMap.has(datum)) {
          return;
        }
        _datumIdMap.set(datum, _counter++);
      });

      // select items
      this.d3items = _d3Selection2['default'].select(this.$offset).selectAll('.item').filter(function () {
        return !this.classList.contains('common');
      }).data(this.data, function (datum) {
        return _datumIdMap.get(datum);
      });

      // render `commonShape` only once
      if (this._commonShapeConfiguration !== null && this._$itemCommonShapeMap.size === 0) {
        var _commonShapeConfiguration = this._commonShapeConfiguration;
        var ctor = _commonShapeConfiguration.ctor;
        var accessors = _commonShapeConfiguration.accessors;
        var options = _commonShapeConfiguration.options;

        var $group = document.createElementNS(_namespace2['default'], 'g');
        var shape = new ctor(options);

        shape.install(accessors);
        $group.appendChild(shape.render());
        $group.classList.add('item', 'common', shape.getClassName());

        this._$itemCommonShapeMap.set($group, shape);
        this.$offset.appendChild($group);
      }

      // ... enter
      this.d3items.enter().append(function (datum, index) {
        // @NOTE: d3 binds `this` to the container group
        var _shapeConfiguration = _this6._shapeConfiguration;
        var ctor = _shapeConfiguration.ctor;
        var accessors = _shapeConfiguration.accessors;
        var options = _shapeConfiguration.options;

        var shape = new ctor(options);
        shape.install(accessors);

        var $el = shape.render(_this6._renderingContext);
        $el.classList.add('item', shape.getClassName());

        _this6._$itemShapeMap.set($el, shape);
        _this6._$itemD3SelectionMap.set($el, _d3Selection2['default'].select($el));

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
        _datumIdMap['delete'](datum);
        _$itemShapeMap['delete']($el);
        _$itemD3SelectionMap['delete']($el);
      }).remove();
    }

    /**
     *  updates Context and Shapes
     */
  }, {
    key: 'update',
    value: function update() {
      this.updateContainer();
      this.updateShapes();
    }

    /**
     *  updates the context of the layer
     */
  }, {
    key: 'updateContainer',
    value: function updateContainer() {
      this._updateRenderingContext();

      var timeContext = this.timeContext;

      var width = timeContext.timeToPixel(timeContext.duration);
      // offset is relative to tim$eline's timeContext
      var x = timeContext.parent.timeToPixel(timeContext.start);
      var offset = timeContext.timeToPixel(timeContext.offset);
      var top = this.params.top;
      var height = this.params.height;
      // matrix to invert the coordinate system
      var translateMatrix = 'matrix(1, 0, 0, -1, ' + x + ', ' + (top + height) + ')';

      this.$el.setAttributeNS(null, 'transform', translateMatrix);

      this.$boundingBox.setAttributeNS(null, 'width', width);
      this.$boundingBox.setAttributeNS(null, 'height', height);
      this.$boundingBox.style.opacity = this.params.opacity;

      this.$offset.setAttributeNS(null, 'transform', 'translate(' + offset + ', 0)');

      // maintain context shape
      this.contextShape.update(this._renderingContext, this.$interactions, this.timeContext, 0);

      // debug context
      if (this.params.debug) {
        this.$debugRect.setAttributeNS(null, 'width', width);
        this.$debugRect.setAttributeNS(null, 'height', height);
      }
    }

    /**
     *  updates the Shapes which b$elongs to the layer
     *  @param item {DOMElement}
     */
  }, {
    key: 'updateShapes',
    value: function updateShapes() {
      var _this7 = this;

      var $item = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      this._updateRenderingContext();

      var that = this;
      var renderingContext = this._renderingContext;
      var items = $item !== null ? this._$itemD3SelectionMap.get($item) : this.d3items;
      // update common shapes
      this._$itemCommonShapeMap.forEach(function (shape, $item) {
        shape.update(renderingContext, _this7.data);
      });

      // d3 update - entity or collection shapes
      items.each(function (datum, index) {
        var shape = that._$itemShapeMap.get(this);
        shape.update(renderingContext, datum, index);
      });
    }
  }, {
    key: 'start',
    get: function get() {
      return this.timeContext.start;
    },
    set: function set(value) {
      this.timeContext.start = value;
    }
  }, {
    key: 'offset',
    get: function get() {
      return this.timeContext.offset;
    },
    set: function set(value) {
      this.timeContext.offset = value;
    }
  }, {
    key: 'duration',
    get: function get() {
      return this.timeContext.duration;
    },
    set: function set(value) {
      this.timeContext.duration = value;
    }
  }, {
    key: 'stretchRatio',
    get: function get() {
      return this.timeContext.stretchRatio;
    },
    set: function set(value) {
      this.timeContext.stretchRatio = value;
    }

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

  }, {
    key: 'yDomain',
    set: function set(domain) {
      this.params.yDomain = domain;
      this._valueToPixel.domain(domain);
    },
    get: function get() {
      return this.params.yDomain;
    }
  }, {
    key: 'opacity',
    set: function set(value) {
      this.params.opacity = value;
    },
    get: function get() {
      return this.params.opacity;
    }
  }, {
    key: 'data',
    get: function get() {
      return this._data;
    },
    set: function set(data) {
      switch (this.dataType) {
        case 'entity':
          if (this._data) {
            // if data already exists, reuse the reference
            this._data[0] = data;
          } else {
            this._data = [data];
          }
          break;
        case 'collection':
          this._data = data;
          break;
      }
    }
  }, {
    key: 'selectedItems',
    get: function get() {
      return this._behavior ? this._behavior.selectedItems : [];
    }
  }], [{
    key: 'configureTimeContextBehavior',
    value: function configureTimeContextBehavior(ctor) {
      timeContextBehaviorCtor = ctor;
    }
  }]);

  return Layer;
})(_events2['default'].EventEmitter);

exports['default'] = Layer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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TUFBTTtBQUNMLGdCQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7V0FDckI7QUFDRCxnQkFBTTtBQUFBLEFBQ1IsYUFBSyxZQUFZO0FBQ2YsY0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsZ0JBQU07QUFBQSxPQUNUO0tBQ0Y7OztTQTRHZ0IsZUFBRztBQUNsQixhQUFPLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO0tBQzNEOzs7V0FsTmtDLHNDQUFDLElBQUksRUFBRTtBQUN4Qyw2QkFBdUIsR0FBRyxJQUFJLENBQUM7S0FDaEM7OztTQXRFa0IsS0FBSztHQUFTLG9CQUFPLFlBQVk7O3FCQUFqQyxLQUFLIiwiZmlsZSI6ImVzNi9jb3JlL2xheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNjYWxlcyBmcm9tICcuLi91dGlscy9zY2FsZXMnO1xuaW1wb3J0IGQzU2VsZWN0aW9uIGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQgZXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5cbmltcG9ydCBucyBmcm9tICcuL25hbWVzcGFjZSc7XG5pbXBvcnQgU2VnbWVudCBmcm9tICcuLi9zaGFwZXMvc2VnbWVudCc7XG5pbXBvcnQgVGltZUNvbnRleHRCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvdGltZS1jb250ZXh0LWJlaGF2aW9yJztcblxuLy8gdGltZSBjb250ZXh0IGJhaGV2aW9yXG5sZXQgdGltZUNvbnRleHRCZWhhdmlvciA9IG51bGw7XG5sZXQgdGltZUNvbnRleHRCZWhhdmlvckN0b3IgPSBUaW1lQ29udGV4dEJlaGF2aW9yO1xuXG4vLyBwcml2YXRlIGl0ZW0gLT4gaWQgbWFwIHRvIGZvcmNlIGQzIHRwIGtlZXAgaW4gc3luYyB3aXRoIHRoZSBET01cbmxldCAgIF9jb3VudGVyID0gMDtcbmNvbnN0IF9kYXR1bUlkTWFwID0gbmV3IE1hcCgpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXllciBleHRlbmRzIGV2ZW50cy5FdmVudEVtaXR0ZXIge1xuICAvKipcbiAgICogU3RydWN0dXJlIG9mIHRoZSBET00gdmlldyBvZiBhIExheWVyXG4gICAqXG4gICAqIDxnIGNsYXNzPVwibGF5ZXJcIj4gRmxpcCB5IGF4aXMsIHRpbWVDb250ZXh0LnN0YXJ0IGFuZCB0b3AgcG9zaXRpb24gZnJvbSBwYXJhbXMgYXJlIGFwcGxpZWQgb24gdGhpcyAkZWxtdFxuICAgKiAgIDxzdmcgY2xhc3M9XCJib3VuZGluZy1ib3hcIj4gdGltZUNvbnRleHQuZHVyYXRpb24gaXMgYXBwbGllZCBvbiB0aGlzICRlbG10XG4gICAqICAgIDxnIGNsYXNzPVwibGF5ZXItaW50ZXJhY3Rpb25zXCI+IENvbnRhaW5zIHRoZSB0aW1lQ29udGV4dCBlZGl0aW9uIGVsZW1lbnRzIChhIHNlZ21lbnQpXG4gICAqICAgIDwvZz5cbiAgICogICAgPGcgY2xhc3M9XCJvZmZzZXQgaXRlbXNcIj4gVGhlIHNoYXBlcyBhcmUgaW5zZXJ0ZWQgaGVyZSwgYW5kIHdlIGFwcGx5IHRpbWVDb250ZXh0Lm9mZnNldCBvbiB0aGlzICRlbG10XG4gICAqICAgIDwvZz5cbiAgICogICA8L3N2Zz5cbiAgICogPC9nPlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YVR5cGUsIGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5kYXRhVHlwZSA9IGRhdGFUeXBlOyAvLyAnZW50aXR5JyB8fCAnY29sbGVjdGlvbic7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgaGVpZ2h0OiAxMDAsXG4gICAgICB0b3A6IDAsXG4gICAgICBpZDogJycsXG4gICAgICB5RG9tYWluOiBbMCwgMV0sXG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgZGVidWdDb250ZXh0OiBmYWxzZSwgLy8gcGFzcyB0aGUgY29udGV4dCBpbiBkZWJ1ZyBtb2RlXG4gICAgICBjb250ZXh0SGFuZGxlcldpZHRoOiAyLFxuICAgICAgY2xhc3NOYW1lOiBudWxsXG4gICAgfTtcblxuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIHRoaXMudGltZUNvbnRleHQgPSBudWxsO1xuXG4gICAgLy8gY29udGFpbmVyIGVsZW1lbnRzXG4gICAgdGhpcy4kZWwgPSBudWxsOyAvLyBvZmZzZXQgZ3JvdXAgb2YgdGhlIHBhcmVudCBjb250ZXh0XG4gICAgdGhpcy4kYm91bmRpbmdCb3ggPSBudWxsO1xuICAgIHRoaXMuJG9mZnNldCA9IG51bGw7XG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zID0gbnVsbDtcblxuICAgIHRoaXMuZDNpdGVtcyA9IG51bGw7IC8vIGQzIGNvbGxlY3Rpb24gb2YgdGhlIGxheWVyIGl0ZW1zXG5cbiAgICB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb24gPSBudWxsOyAvLyB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9XG4gICAgdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uID0gbnVsbDsgLy8geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfVxuXG4gICAgdGhpcy5fJGl0ZW1TaGFwZU1hcCA9IG5ldyBNYXAoKTsgLy8gaXRlbSBncm91cCA8RE9NRWxlbWVudD4gPT4gc2hhcGVcbiAgICB0aGlzLl8kaXRlbUQzU2VsZWN0aW9uTWFwID0gbmV3IE1hcCgpOyAvLyBpdGVtIGdyb3VwIDxET01FbGVtZW50PiA9PiBzaGFwZVxuICAgIHRoaXMuXyRpdGVtQ29tbW9uU2hhcGVNYXAgPSBuZXcgTWFwKCk7IC8vIG9uZSBlbnRyeSBtYXggaW4gdGhpcyBtYXBcblxuICAgIHRoaXMuX2lzQ29udGV4dEVkaXRhYmxlID0gZmFsc2U7XG4gICAgdGhpcy5fYmVoYXZpb3IgPSBudWxsO1xuXG4gICAgdGhpcy5fdmFsdWVUb1BpeGVsID0gc2NhbGVzLmxpbmVhcigpXG4gICAgICAuZG9tYWluKHRoaXMucGFyYW1zLnlEb21haW4pXG4gICAgICAucmFuZ2UoWzAsIHRoaXMucGFyYW1zLmhlaWdodF0pO1xuXG4gICAgdGhpcy5jb250ZXh0QmVoYXZpb3IgPSAnJztcblxuICAgIC8vIGluaXRpYWxpemUgdGltZUNvbnRleHQgbGF5b3V0XG4gICAgdGhpcy5fcmVuZGVyQ29udGFpbmVyKCk7XG5cbiAgICAvLyBjcmVhdGVzIHRoZSB0aW1lQ29udGV4dEJlaGF2aW9yIGZvciBhbGwgbGF5ZXIsIGxhenkgaW5zdGFuY2lhdGlvblxuICAgIGlmICh0aW1lQ29udGV4dEJlaGF2aW9yID09PSBudWxsKSB7XG4gICAgICB0aW1lQ29udGV4dEJlaGF2aW9yID0gbmV3IHRpbWVDb250ZXh0QmVoYXZpb3JDdG9yKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBhbGxvd3MgdG8gb3ZlcnJpZGUgZGVmYXVsdCB0aGUgVGltZUNvbnRleHRCZWhhdmlvclxuICAgKi9cbiAgc3RhdGljIGNvbmZpZ3VyZVRpbWVDb250ZXh0QmVoYXZpb3IoY3Rvcikge1xuICAgIHRpbWVDb250ZXh0QmVoYXZpb3JDdG9yID0gY3RvcjtcbiAgfVxuXG4gIGdldCBzdGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5zdGFydDtcbiAgfVxuXG4gIHNldCBzdGFydCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQuc3RhcnQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQub2Zmc2V0O1xuICB9XG5cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQub2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQuZHVyYXRpb247XG4gIH1cblxuICBzZXQgZHVyYXRpb24odmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc3RyZXRjaFJhdGlvKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbztcbiAgfVxuXG4gIHNldCBzdHJldGNoUmF0aW8odmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbyA9IHZhbHVlO1xuICB9XG5cbiAgLy8gZGVzdHJveSgpIHtcbiAgLy8gICB0aGlzLnRpbWVDb250ZXh0ID0gbnVsbDtcbiAgLy8gICB0aGlzLmQzaXRlbXMgPSBudWxsO1xuICAvLyAgIHRoaXMuZGF0YSA9IG51bGw7XG4gIC8vICAgdGhpcy5wYXJhbXMgPSBudWxsO1xuICAvLyAgIHRoaXMuX2JlaGF2aW9yID0gbnVsbDtcbiAgLy9cbiAgLy8gICAvLyBAVE9ET1xuICAvLyAgICAgIC0gY2xlYW4gTWFwc1xuICAvLyAgICAgIC0gY2xlYW4gbGlzdGVuZXJzXG4gIC8vICAgICAgLSBjbGVhbiBiZWhhdmlvciAoYmVoYXZpb3IuX2xheWVyKVxuICAvLyB9XG5cbiAgc2V0IHlEb21haW4oZG9tYWluKSB7XG4gICAgdGhpcy5wYXJhbXMueURvbWFpbiA9IGRvbWFpbjtcbiAgICB0aGlzLl92YWx1ZVRvUGl4ZWwuZG9tYWluKGRvbWFpbik7XG4gIH1cblxuICBnZXQgeURvbWFpbigpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMueURvbWFpbjtcbiAgfVxuXG4gIHNldCBvcGFjaXR5KHZhbHVlKSB7XG4gICAgdGhpcy5wYXJhbXMub3BhY2l0eSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IG9wYWNpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLm9wYWNpdHk7XG4gIH1cblxuICAvKipcbiAgICogVGltZUNvbnRleHQgYWNjZXNzb3JzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAbWFuZGF0b3J5IGRlZmluZSB0aGUgY29udGV4dCBpbiB3aGljaCB0aGUgbGF5ZXIgaXMgZHJhd25cbiAgICogQHBhcmFtIGNvbnRleHQge1RpbWVDb250ZXh0fSB0aGUgdGltZUNvbnRleHQgaW4gd2hpY2ggdGhlIGxheWVyIGlzIGRpc3BsYXllZFxuICAgKi9cbiAgc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gdGltZUNvbnRleHQ7XG4gICAgLy8gY3JlYXRlIGEgbWl4aW4gdG8gcGFzcyB0byB0aGUgc2hhcGVzXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dCA9IHt9O1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIERhdGFcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBnZXQgZGF0YSgpIHsgcmV0dXJuIHRoaXMuX2RhdGE7IH1cblxuICBzZXQgZGF0YShkYXRhKSB7XG4gICAgc3dpdGNoICh0aGlzLmRhdGFUeXBlKSB7XG4gICAgICBjYXNlICdlbnRpdHknOlxuICAgICAgICBpZiAodGhpcy5fZGF0YSkgeyAgLy8gaWYgZGF0YSBhbHJlYWR5IGV4aXN0cywgcmV1c2UgdGhlIHJlZmVyZW5jZVxuICAgICAgICAgIHRoaXMuX2RhdGFbMF0gPSBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2RhdGEgPSBbZGF0YV07XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2xsZWN0aW9uJzpcbiAgICAgICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIEluaXRpYWxpemF0aW9uXG5cbiAgLyoqXG4gICAqICByZW5kZXIgdGhlIERPTSBpbiBtZW1vcnkgb24gbGF5ZXIgY3JlYXRpb24gdG8gYmUgYWJsZSB0byB1c2UgaXQgYmVmb3JlXG4gICAqICB0aGUgbGF5ZXIgaXMgYWN0dWFsbHkgaW5zZXJ0ZWQgaW4gdGhlIERPTVxuICAgKi9cbiAgX3JlbmRlckNvbnRhaW5lcigpIHtcbiAgICAvLyB3cmFwcGVyIGdyb3VwIGZvciBgc3RhcnQsIHRvcCBhbmQgY29udGV4dCBmbGlwIG1hdHJpeFxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIGlmICh0aGlzLnBhcmFtcy5jbGFzc05hbWUgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQoJ2xheWVyJywgdGhpcy5wYXJhbXMuY2xhc3NOYW1lKTtcbiAgICB9XG4gICAgLy8gY2xpcCB0aGUgY29udGV4dCB3aXRoIGEgYHN2Z2AgZWxlbWVudFxuICAgIHRoaXMuJGJvdW5kaW5nQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnc3ZnJyk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guY2xhc3NMaXN0LmFkZCgnYm91bmRpbmctYm94Jyk7XG4gICAgLy8gZ3JvdXAgdG8gYXBwbHkgb2Zmc2V0XG4gICAgdGhpcy4kb2Zmc2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuJG9mZnNldC5jbGFzc0xpc3QuYWRkKCdvZmZzZXQnLCAnaXRlbXMnKTtcbiAgICAvLyBsYXllciBiYWNrZ3JvdW5kXG4gICAgdGhpcy4kYmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAnMTAwJScpO1xuICAgIHRoaXMuJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgJzEwMCUnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoJ2JhY2tncm91bmQnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnN0eWxlLmZpbGxPcGFjaXR5ID0gMDtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG4gICAgLy8gY29udGV4dCBpbnRlcmFjdGlvbnNcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zLmNsYXNzTGlzdC5hZGQoJ2ludGVyYWN0aW9ucycpO1xuICAgIHRoaXMuJGludGVyYWN0aW9ucy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIC8vIEBOT1RFOiB3b3JrcyBidXQga2luZyBvZiB1Z2x5Li4uIHNob3VsZCBiZSBjbGVhbmVkXG4gICAgdGhpcy5jb250ZXh0U2hhcGUgPSBuZXcgU2VnbWVudCgpO1xuICAgIHRoaXMuY29udGV4dFNoYXBlLmluc3RhbGwoe1xuICAgICAgb3BhY2l0eTogKCkgPT4gMC4xLFxuICAgICAgY29sb3IgIDogKCkgPT4gJyM3ODc4NzgnLFxuICAgICAgd2lkdGggIDogKCkgPT4gdGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbixcbiAgICAgIGhlaWdodCA6ICgpID0+IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmRvbWFpbigpWzFdLFxuICAgICAgeSAgICAgIDogKCkgPT4gdGhpcy5fcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuZG9tYWluKClbMF1cbiAgICB9KTtcblxuICAgIHRoaXMuJGludGVyYWN0aW9ucy5hcHBlbmRDaGlsZCh0aGlzLmNvbnRleHRTaGFwZS5yZW5kZXIoKSk7XG4gICAgLy8gY3JlYXRlIHRoZSBET00gdHJlZVxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJGJvdW5kaW5nQm94KTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5hcHBlbmRDaGlsZCh0aGlzLiRvZmZzZXQpO1xuICAgIHRoaXMuJG9mZnNldC5hcHBlbmRDaGlsZCh0aGlzLiRiYWNrZ3JvdW5kKTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5hcHBlbmRDaGlsZCh0aGlzLiRpbnRlcmFjdGlvbnMpO1xuXG4gICAgLy8gZHJhdyBhIFNlZ21lbnQgaW4gY29udGV4dCBiYWNrZ3JvdW5kIHRvIGRlYnVnIGl0J3Mgc2l6ZVxuICAgIGlmICh0aGlzLnBhcmFtcy5kZWJ1Zykge1xuICAgICAgdGhpcy4kZGVidWdSZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnU2VnbWVudCcpO1xuICAgICAgdGhpcy4kYm91bmRpbmdCb3guYXBwZW5kQ2hpbGQodGhpcy4kZGVidWdSZWN0KTtcbiAgICAgIHRoaXMuJGRlYnVnUmVjdC5zdHlsZS5maWxsID0gJyNhYmFiYWInO1xuICAgICAgdGhpcy4kZGVidWdSZWN0LnN0eWxlLmZpbGxPcGFjaXR5ID0gMC4xO1xuICAgIH1cbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbXBvbmVudCBDb25maWd1cmF0aW9uXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqICBSZWdpc3RlciB0aGUgc2hhcGUgYW5kIGl0cyBhY2Nlc3NvcnMgdG8gdXNlIGluIG9yZGVyIHRvIHJlbmRlclxuICAgKiAgdGhlIGVudGl0eSBvciBjb2xsZWN0aW9uXG4gICAqICBAcGFyYW0gY3RvciA8RnVuY3Rpb246QmFzZVNoYXBlPiB0aGUgY29uc3RydWN0b3Igb2YgdGhlIHNoYXBlIHRvIGJlIHVzZWRcbiAgICogIEBwYXJhbSBhY2Nlc3NvcnMgPE9iamVjdD4gYWNjZXNzb3JzIHRvIHVzZSBpbiBvcmRlciB0byBtYXAgdGhlIGRhdGEgc3RydWN0dXJlXG4gICAqL1xuICBjb25maWd1cmVTaGFwZShjdG9yLCBhY2Nlc3NvcnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uID0geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgUmVnaXN0ZXIgdGhlIHNoYXBlIHRvIHVzZSB3aXRoIHRoZSBlbnRpcmUgY29sbGVjdGlvblxuICAgKiAgZXhhbXBsZTogdGhlIGxpbmUgaW4gYSBiZWFrcG9pbnQgZnVuY3Rpb25cbiAgICogIEBwYXJhbSBjdG9yIHtCYXNlU2hhcGV9IHRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgc2hhcGUgdG8gdXNlIHRvIHJlbmRlciBkYXRhXG4gICAqICBAcGFyYW0gYWNjZXNzb3JzIHtPYmplY3R9IGFjY2Vzc29ycyB0byB1c2UgaW4gb3JkZXIgdG8gbWFwIHRoZSBkYXRhIHN0cnVjdHVyZVxuICAgKi9cbiAgY29uZmlndXJlQ29tbW9uU2hhcGUoY3RvciwgYWNjZXNzb3JzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiA9IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH07XG4gIH1cblxuICAvKipcbiAgICogIFJlZ2lzdGVyIHRoZSBiZWhhdmlvciB0byB1c2Ugd2hlbiBpbnRlcmFjdGluZyB3aXRoIHRoZSBzaGFwZVxuICAgKiAgQHBhcmFtIGJlaGF2aW9yIHtCYXNlQmVoYXZpb3J9XG4gICAqL1xuICBzZXRCZWhhdmlvcihiZWhhdmlvcikge1xuICAgIGJlaGF2aW9yLmluaXRpYWxpemUodGhpcyk7XG4gICAgdGhpcy5fYmVoYXZpb3IgPSBiZWhhdmlvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlIHRoZSB2YWx1ZXMgaW4gYF9yZW5kZXJpbmdDb250ZXh0YFxuICAgKiAgaXMgcGFydGljdWxhcnkgbmVlZGVkIHdoZW4gdXBkYXRpbmcgYHN0cmV0Y2hSYXRpb2AgYXMgdGhlIHBvaW50ZXJcbiAgICogIHRvIHRoZSBgdGltZVRvUGl4ZWxgIHNjYWxlIG1heSBjaGFuZ2VcbiAgICovXG4gIF91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCkge1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwgPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsID0gdGhpcy5fdmFsdWVUb1BpeGVsO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQuaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQud2lkdGggID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uKTtcbiAgICAvLyBmb3IgZm9yZWlnbiBvYmplY3QgaXNzdWUgaW4gY2hyb21lXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5vZmZzZXRYID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBCZWhhdmlvciBBY2Nlc3NvcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBnZXQgc2VsZWN0ZWRJdGVtcygpIHtcbiAgICByZXR1cm4gdGhpcy5fYmVoYXZpb3IgPyB0aGlzLl9iZWhhdmlvci5zZWxlY3RlZEl0ZW1zIDogW107XG4gIH1cblxuICBzZWxlY3QoLi4uJGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHsgJGl0ZW1zID0gdGhpcy5kM2l0ZW1zLm5vZGVzKCk7IH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheSgkaXRlbXNbMF0pKSB7ICRpdGVtcyA9ICRpdGVtc1swXTsgfVxuXG4gICAgJGl0ZW1zLmZvckVhY2goKCRlbCkgPT4ge1xuICAgICAgY29uc3QgaXRlbSA9IHRoaXMuXyRpdGVtRDNTZWxlY3Rpb25NYXAuZ2V0KCRlbCk7XG4gICAgICB0aGlzLl9iZWhhdmlvci5zZWxlY3QoJGVsLCBpdGVtLmRhdHVtKCkpO1xuICAgICAgdGhpcy5fdG9Gcm9udCgkZWwpO1xuICAgIH0pO1xuICB9XG5cbiAgdW5zZWxlY3QoLi4uJGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHsgJGl0ZW1zID0gdGhpcy5kM2l0ZW1zLm5vZGVzKCk7IH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheSgkaXRlbXNbMF0pKSB7ICRpdGVtcyA9ICRpdGVtc1swXTsgfVxuXG4gICAgJGl0ZW1zLmZvckVhY2goKCRlbCkgPT4ge1xuICAgICAgY29uc3QgaXRlbSA9IHRoaXMuXyRpdGVtRDNTZWxlY3Rpb25NYXAuZ2V0KCRlbCk7XG4gICAgICB0aGlzLl9iZWhhdmlvci51bnNlbGVjdCgkZWwsIGl0ZW0uZGF0dW0oKSk7XG4gICAgfSk7XG4gIH1cblxuICB0b2dnbGVTZWxlY3Rpb24oLi4uJGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHsgJGl0ZW1zID0gdGhpcy5kM2l0ZW1zLm5vZGVzKCk7IH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheSgkaXRlbXNbMF0pKSB7ICRpdGVtcyA9ICRpdGVtc1swXTsgfVxuXG4gICAgJGl0ZW1zLmZvckVhY2goKCRlbCkgPT4ge1xuICAgICAgY29uc3QgaXRlbSA9IHRoaXMuXyRpdGVtRDNTZWxlY3Rpb25NYXAuZ2V0KCRlbCk7XG4gICAgICB0aGlzLl9iZWhhdmlvci50b2dnbGVTZWxlY3Rpb24oJGVsLCBpdGVtLmRhdHVtKCkpO1xuICAgIH0pO1xuICB9XG5cbiAgZWRpdCgkaXRlbXMsIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICAkaXRlbXMgPSAhQXJyYXkuaXNBcnJheSgkaXRlbXMpID8gWyRpdGVtc10gOiAkaXRlbXM7XG5cbiAgICAkaXRlbXMuZm9yRWFjaCgoJGVsKSA9PiB7XG4gICAgICBjb25zdCBpdGVtICA9IHRoaXMuXyRpdGVtRDNTZWxlY3Rpb25NYXAuZ2V0KCRlbCk7XG4gICAgICBjb25zdCBzaGFwZSA9IHRoaXMuXyRpdGVtU2hhcGVNYXAuZ2V0KCRlbCk7XG4gICAgICBjb25zdCBkYXR1bSA9IGl0ZW0uZGF0dW0oKTtcbiAgICAgIHRoaXMuX2JlaGF2aW9yLmVkaXQodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCk7XG4gICAgICB0aGlzLmVtaXQoJ2VkaXQnLCBzaGFwZSwgZGF0dW0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBkcmF3cyB0aGUgc2hhcGUgdG8gaW50ZXJhY3Qgd2l0aCB0aGUgY29udGV4dFxuICAgKiAgQHBhcmFtcyB7Qm9vbGVhbn0gW2Jvb2w9dHJ1ZV0gLSBkZWZpbmVzIGlmIHRoZSBsYXllcidzIGNvbnRleHQgaXMgZWRpdGFibGUgb3Igbm90XG4gICAqL1xuICBzZXRDb250ZXh0RWRpdGFibGUoYm9vbCA9IHRydWUpIHtcbiAgICBjb25zdCBkaXNwbGF5ID0gYm9vbCA/ICdibG9jaycgOiAnbm9uZSc7XG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xuICAgIHRoaXMuX2lzQ29udGV4dEVkaXRhYmxlID0gYm9vbDtcbiAgfVxuXG4gIGVkaXRDb250ZXh0KGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgdGltZUNvbnRleHRCZWhhdmlvci5lZGl0KHRoaXMsIGR4LCBkeSwgdGFyZ2V0KTtcbiAgfVxuXG4gIHN0cmV0Y2hDb250ZXh0KGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgdGltZUNvbnRleHRCZWhhdmlvci5zdHJldGNoKHRoaXMsIGR4LCBkeSwgdGFyZ2V0KTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEhlbHBlcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIE1vdmVzIGFuIGAkZWxgJ3MgZ3JvdXAgdG8gdGhlIGVuZCBvZiB0aGUgbGF5ZXIgKHN2ZyB6LWluZGV4Li4uKVxuICAgKiAgQHBhcmFtIGAkZWxgIHtET01FbGVtZW50fSB0aGUgRE9NRWxlbWVudCB0byBiZSBtb3ZlZFxuICAgKi9cbiAgX3RvRnJvbnQoJGVsKSB7XG4gICAgdGhpcy4kb2Zmc2V0LmFwcGVuZENoaWxkKCRlbCk7XG4gIH1cblxuICAvKipcbiAgICogIFJldHVybnMgdGhlIGQzU2VsZWN0aW9uIGl0ZW0gdG8gd2hpY2ggdGhlIGdpdmVuIERPTUVsZW1lbnQgYiRlbG9uZ3NcbiAgICogIEBwYXJhbSBgJGVsYCB7RE9NRWxlbWVudH0gdGhlIGVsZW1lbnQgdG8gYmUgdGVzdGVkXG4gICAqICBAcmV0dXJuIHtET01FbGVtZW50fG51bGx9IGl0ZW0gZ3JvdXAgY29udGFpbmluZyB0aGUgYCRlbGAgaWYgYiRlbG9uZ3MgdG8gdGhpcyBsYXllciwgbnVsbCBvdGhlcndpc2VcbiAgICovXG4gIGdldEl0ZW1Gcm9tRE9NRWxlbWVudCgkZWwpIHtcbiAgICBsZXQgJGl0ZW07XG5cbiAgICBkbyB7XG4gICAgICBpZiAoJGVsLmNsYXNzTGlzdCAmJiAkZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdpdGVtJykpIHtcbiAgICAgICAgJGl0ZW0gPSAkZWw7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICAkZWwgPSAkZWwucGFyZW50Tm9kZTtcbiAgICB9IHdoaWxlICgkZWwgIT09IG51bGwpO1xuXG4gICAgcmV0dXJuIHRoaXMuaGFzSXRlbSgkaXRlbSkgPyAkaXRlbSA6wqBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqICBSZXR1cm5zIHRoZSBkYXR1bSBhc3NvY2lhdGVkIHRvIGEgc3BlY2lmaWMgaXRlbSBET01FbGVtZW50XG4gICAqICB1c2UgZDMgaW50ZXJuYWxseSB0byByZXRyaWV2ZSB0aGUgZGF0dW1cbiAgICogIEBwYXJhbSAkaXRlbSB7RE9NRWxlbWVudH1cbiAgICogIEByZXR1cm4ge09iamVjdHxBcnJheXxudWxsfSBkZXBlbmRpbmcgb24gdGhlIHVzZXIgZGF0YSBzdHJ1Y3R1cmVcbiAgICovXG4gIGdldERhdHVtRnJvbUl0ZW0oJGl0ZW0pIHtcbiAgICBjb25zdCBkM2l0ZW0gPSB0aGlzLl8kaXRlbUQzU2VsZWN0aW9uTWFwLmdldCgkaXRlbSk7XG4gICAgcmV0dXJuIGQzaXRlbSA/IGQzaXRlbS5kYXR1bSgpIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRGVmaW5lcyBpZiB0aGUgZ2l2ZW4gZDMgc2VsZWN0aW9uIGlzIGFuIGl0ZW0gb2YgdGhlIGxheWVyXG4gICAqICBAcGFyYW0gaXRlbSB7RE9NRWxlbWVudH1cbiAgICogIEByZXR1cm4ge2Jvb2x9XG4gICAqL1xuICBoYXNJdGVtKCRpdGVtKSB7XG4gICAgY29uc3Qgbm9kZXMgPSB0aGlzLmQzaXRlbXMubm9kZXMoKTtcbiAgICByZXR1cm4gbm9kZXMuaW5kZXhPZigkaXRlbSkgIT09IC0xO1xuICB9XG5cbiAgLyoqXG4gICAqICBEZWZpbmVzIGlmIGEgZ2l2ZW4gZWxlbWVudCBiJGVsb25ncyB0byB0aGUgbGF5ZXJcbiAgICogIGlzIG1vcmUgZ2VuZXJhbCB0aGFuIGBoYXNJdGVtYCwgY2FuIGJlIHVzZWQgdG8gY2hlY2sgaW50ZXJhY3Rpb24gZWxlbWVudHMgdG9vXG4gICAqICBAcGFyYW0gJGVsIHtET01FbGVtZW50fVxuICAgKiAgQHJldHVybiB7Ym9vbH1cbiAgICovXG4gIGhhc0VsZW1lbnQoJGVsKSB7XG4gICAgZG8ge1xuICAgICAgaWYgKCRlbCA9PT0gdGhpcy4kZWwpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgICRlbCA9ICRlbC5wYXJlbnROb2RlO1xuICAgIH0gd2hpbGUgKCRlbCAhPT0gbnVsbCk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogIEBwYXJhbSBhcmVhIHtPYmplY3R9IGFyZWEgaW4gd2hpY2ggdG8gZmluZCB0aGUgZWxlbWVudHNcbiAgICogIEByZXR1cm4ge0FycmF5fSBsaXN0IG9mIHRoZSBET00gZWxlbWVudHMgaW4gdGhlIGdpdmVuIGFyZWFcbiAgICovXG4gIGdldEl0ZW1zSW5BcmVhKGFyZWEpIHtcbiAgICBjb25zdCBzdGFydCAgICA9IHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5zdGFydCk7XG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24pO1xuICAgIGNvbnN0IG9mZnNldCAgID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCk7XG4gICAgY29uc3QgdG9wICAgICAgPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgLy8gYmUgYXdhcmUgYWYgY29udGV4dCdzIHRyYW5zbGF0aW9ucyAtIGNvbnN0cmFpbiBpbiB3b3JraW5nIHZpZXdcbiAgICBsZXQgeDEgPSBNYXRoLm1heChhcmVhLmxlZnQsIHN0YXJ0KTtcbiAgICBsZXQgeDIgPSBNYXRoLm1pbihhcmVhLmxlZnQgKyBhcmVhLndpZHRoLCBzdGFydCArIGR1cmF0aW9uKTtcbiAgICB4MSAtPSAoc3RhcnQgKyBvZmZzZXQpO1xuICAgIHgyIC09IChzdGFydCArIG9mZnNldCk7XG4gICAgLy8ga2VlcCBjb25zaXN0ZW50IHdpdGggY29udGV4dCB5IGNvb3JkaW5hdGVzIHN5c3RlbVxuICAgIGxldCB5MSA9IHRoaXMucGFyYW1zLmhlaWdodCAtIChhcmVhLnRvcCArIGFyZWEuaGVpZ2h0KTtcbiAgICBsZXQgeTIgPSB0aGlzLnBhcmFtcy5oZWlnaHQgLSBhcmVhLnRvcDtcblxuICAgIHkxICs9IHRoaXMucGFyYW1zLnRvcDtcbiAgICB5MiArPSB0aGlzLnBhcmFtcy50b3A7XG5cbiAgICBjb25zdCBpdGVtU2hhcGVNYXAgPSB0aGlzLl8kaXRlbVNoYXBlTWFwO1xuICAgIGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLl9yZW5kZXJpbmdDb250ZXh0O1xuXG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLmQzaXRlbXMuZmlsdGVyKGZ1bmN0aW9uKGRhdHVtLCBpbmRleCkge1xuICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzO1xuICAgICAgY29uc3Qgc2hhcGUgPSBpdGVtU2hhcGVNYXAuZ2V0KGdyb3VwKTtcbiAgICAgIHJldHVybiBzaGFwZS5pbkFyZWEocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBpdGVtcy5ub2RlcygpLnNsaWNlKDApO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyaW5nIC8gRGlzcGxheSBtZXRob2RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gLyoqXG4gIC8vICAqICBSZXR1cm5zIHRoZSBwcmV2aXNvdWx5IGNyZWF0ZWQgbGF5ZXIncyBjb250YWluZXJcbiAgLy8gICogIEByZXR1cm4ge0RPTUVsZW1lbnR9XG4gIC8vICAqL1xuICAvLyByZW5kZXJDb250YWluZXIoKSB7XG4gIC8vICAgcmV0dXJuIHRoaXMuJGVsO1xuICAvLyB9XG5cbiAgLy8gLyoqXG4gIC8vICAqICBDcmVhdGVzIHRoZSBET00gYWNjb3JkaW5nIHRvIGdpdmVuIGRhdGEgYW5kIHNoYXBlc1xuICAvLyAgKi9cbiAgLy8gcmVuZGVyKCl7XG4gIC8vICAgdGhpcy5kcmF3U2hhcGVzKCk7XG4gIC8vIH1cblxuICByZW5kZXIoKSB7XG4gICAgLy8gZm9yY2UgZDMgdG8ga2VlcCBkYXRhIGluIHN5bmMgd2l0aCB0aGUgRE9NIHdpdGggYSB1bmlxdWUgaWRcbiAgICB0aGlzLmRhdGEuZm9yRWFjaChmdW5jdGlvbihkYXR1bSkge1xuICAgICAgaWYgKF9kYXR1bUlkTWFwLmhhcyhkYXR1bSkpIHsgcmV0dXJuOyB9XG4gICAgICBfZGF0dW1JZE1hcC5zZXQoZGF0dW0sIF9jb3VudGVyKyspO1xuICAgIH0pO1xuXG4gICAgLy8gc2VsZWN0IGl0ZW1zXG4gICAgdGhpcy5kM2l0ZW1zID0gZDNTZWxlY3Rpb24uc2VsZWN0KHRoaXMuJG9mZnNldClcbiAgICAgIC5zZWxlY3RBbGwoJy5pdGVtJylcbiAgICAgIC5maWx0ZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbW1vbicpO1xuICAgICAgfSlcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSwgZnVuY3Rpb24oZGF0dW0pIHtcbiAgICAgICAgcmV0dXJuIF9kYXR1bUlkTWFwLmdldChkYXR1bSk7XG4gICAgICB9KTtcblxuICAgIC8vIHJlbmRlciBgY29tbW9uU2hhcGVgIG9ubHkgb25jZVxuICAgIGlmIChcbiAgICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiAhPT0gbnVsbCAmJlxuICAgICAgdGhpcy5fJGl0ZW1Db21tb25TaGFwZU1hcC5zaXplID09PSAwXG4gICAgKSB7XG4gICAgICBjb25zdCB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9ID0gdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uO1xuICAgICAgY29uc3QgJGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgY3RvcihvcHRpb25zKTtcblxuICAgICAgc2hhcGUuaW5zdGFsbChhY2Nlc3NvcnMpO1xuICAgICAgJGdyb3VwLmFwcGVuZENoaWxkKHNoYXBlLnJlbmRlcigpKTtcbiAgICAgICRncm91cC5jbGFzc0xpc3QuYWRkKCdpdGVtJywgJ2NvbW1vbicsIHNoYXBlLmdldENsYXNzTmFtZSgpKTtcblxuICAgICAgdGhpcy5fJGl0ZW1Db21tb25TaGFwZU1hcC5zZXQoJGdyb3VwLCBzaGFwZSk7XG4gICAgICB0aGlzLiRvZmZzZXQuYXBwZW5kQ2hpbGQoJGdyb3VwKTtcbiAgICB9XG5cbiAgICAvLyAuLi4gZW50ZXJcbiAgICB0aGlzLmQzaXRlbXMuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgoZGF0dW0sIGluZGV4KSA9PiB7XG4gICAgICAgIC8vIEBOT1RFOiBkMyBiaW5kcyBgdGhpc2AgdG8gdGhlIGNvbnRhaW5lciBncm91cFxuICAgICAgICBjb25zdCB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9ID0gdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uO1xuICAgICAgICBjb25zdCBzaGFwZSA9IG5ldyBjdG9yKG9wdGlvbnMpO1xuICAgICAgICBzaGFwZS5pbnN0YWxsKGFjY2Vzc29ycyk7XG5cbiAgICAgICAgY29uc3QgJGVsID0gc2hhcGUucmVuZGVyKHRoaXMuX3JlbmRlcmluZ0NvbnRleHQpO1xuICAgICAgICAkZWwuY2xhc3NMaXN0LmFkZCgnaXRlbScsIHNoYXBlLmdldENsYXNzTmFtZSgpKTtcblxuICAgICAgICB0aGlzLl8kaXRlbVNoYXBlTWFwLnNldCgkZWwsIHNoYXBlKTtcbiAgICAgICAgdGhpcy5fJGl0ZW1EM1NlbGVjdGlvbk1hcC5zZXQoJGVsLCBkM1NlbGVjdGlvbi5zZWxlY3QoJGVsKSk7XG5cbiAgICAgICAgcmV0dXJuICRlbDtcbiAgICAgIH0pO1xuXG4gICAgLy8gLi4uIGV4aXRcbiAgICBjb25zdCBfJGl0ZW1TaGFwZU1hcCA9IHRoaXMuXyRpdGVtU2hhcGVNYXA7XG4gICAgY29uc3QgXyRpdGVtRDNTZWxlY3Rpb25NYXAgPSB0aGlzLl8kaXRlbUQzU2VsZWN0aW9uTWFwO1xuXG4gICAgdGhpcy5kM2l0ZW1zLmV4aXQoKVxuICAgICAgLmVhY2goZnVuY3Rpb24oZGF0dW0sIGluZGV4KSB7XG4gICAgICAgIGNvbnN0ICRlbCA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHNoYXBlID0gXyRpdGVtU2hhcGVNYXAuZ2V0KCRlbCk7XG4gICAgICAgIC8vIGNsZWFuIGFsbCBzaGFwZS9pdGVtIHJlZmVyZW5jZXNcbiAgICAgICAgc2hhcGUuZGVzdHJveSgpO1xuICAgICAgICBfZGF0dW1JZE1hcC5kZWxldGUoZGF0dW0pO1xuICAgICAgICBfJGl0ZW1TaGFwZU1hcC5kZWxldGUoJGVsKTtcbiAgICAgICAgXyRpdGVtRDNTZWxlY3Rpb25NYXAuZGVsZXRlKCRlbCk7XG4gICAgICB9KVxuICAgICAgLnJlbW92ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqICB1cGRhdGVzIENvbnRleHQgYW5kIFNoYXBlc1xuICAgKi9cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMudXBkYXRlQ29udGFpbmVyKCk7XG4gICAgdGhpcy51cGRhdGVTaGFwZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlcyB0aGUgY29udGV4dCBvZiB0aGUgbGF5ZXJcbiAgICovXG4gIHVwZGF0ZUNvbnRhaW5lcigpIHtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCk7XG5cbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IHRoaXMudGltZUNvbnRleHQ7XG5cbiAgICBjb25zdCB3aWR0aCAgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aW1lQ29udGV4dC5kdXJhdGlvbik7XG4gICAgLy8gb2Zmc2V0IGlzIHJlbGF0aXZlIHRvIHRpbSRlbGluZSdzIHRpbWVDb250ZXh0XG4gICAgY29uc3QgeCAgICAgID0gdGltZUNvbnRleHQucGFyZW50LnRpbWVUb1BpeGVsKHRpbWVDb250ZXh0LnN0YXJ0KTtcbiAgICBjb25zdCBvZmZzZXQgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aW1lQ29udGV4dC5vZmZzZXQpO1xuICAgIGNvbnN0IHRvcCAgICA9IHRoaXMucGFyYW1zLnRvcDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgLy8gbWF0cml4IHRvIGludmVydCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICBjb25zdCB0cmFuc2xhdGVNYXRyaXggPSBgbWF0cml4KDEsIDAsIDAsIC0xLCAke3h9LCAke3RvcCArIGhlaWdodH0pYDtcblxuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGVNYXRyaXgpO1xuXG4gICAgdGhpcy4kYm91bmRpbmdCb3guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgIHRoaXMuJGJvdW5kaW5nQm94LnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgIHRoaXMuJGJvdW5kaW5nQm94LnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuXG4gICAgdGhpcy4kb2Zmc2V0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7b2Zmc2V0fSwgMClgKTtcblxuICAgIC8vIG1haW50YWluIGNvbnRleHQgc2hhcGVcbiAgICB0aGlzLmNvbnRleHRTaGFwZS51cGRhdGUoXG4gICAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LFxuICAgICAgdGhpcy4kaW50ZXJhY3Rpb25zLFxuICAgICAgdGhpcy50aW1lQ29udGV4dCxcbiAgICAgIDBcbiAgICApO1xuXG4gICAgLy8gZGVidWcgY29udGV4dFxuICAgIGlmICh0aGlzLnBhcmFtcy5kZWJ1Zykge1xuICAgICAgdGhpcy4kZGVidWdSZWN0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHdpZHRoKTtcbiAgICAgIHRoaXMuJGRlYnVnUmVjdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIHVwZGF0ZXMgdGhlIFNoYXBlcyB3aGljaCBiJGVsb25ncyB0byB0aGUgbGF5ZXJcbiAgICogIEBwYXJhbSBpdGVtIHtET01FbGVtZW50fVxuICAgKi9cbiAgdXBkYXRlU2hhcGVzKCRpdGVtID0gbnVsbCkge1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcblxuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLl9yZW5kZXJpbmdDb250ZXh0O1xuICAgIGNvbnN0IGl0ZW1zID0gJGl0ZW0gIT09IG51bGwgPyB0aGlzLl8kaXRlbUQzU2VsZWN0aW9uTWFwLmdldCgkaXRlbSkgOiB0aGlzLmQzaXRlbXM7XG4gICAgLy8gdXBkYXRlIGNvbW1vbiBzaGFwZXNcbiAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwLmZvckVhY2goKHNoYXBlLCAkaXRlbSkgPT4ge1xuICAgICAgc2hhcGUudXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIHRoaXMuZGF0YSk7XG4gICAgfSk7XG5cbiAgICAvLyBkMyB1cGRhdGUgLSBlbnRpdHkgb3IgY29sbGVjdGlvbiBzaGFwZXNcbiAgICBpdGVtcy5lYWNoKGZ1bmN0aW9uKGRhdHVtLCBpbmRleCkge1xuICAgICAgY29uc3Qgc2hhcGUgPSB0aGF0Ll8kaXRlbVNoYXBlTWFwLmdldCh0aGlzKTtcbiAgICAgIHNoYXBlLnVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgaW5kZXgpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=