'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _events = require('events');

var _namespace = require('./namespace');

var _namespace2 = _interopRequireDefault(_namespace);

var _scales = require('../utils/scales');

var _scales2 = _interopRequireDefault(_scales);

var _Segment = require('../shapes/Segment');

var _Segment2 = _interopRequireDefault(_Segment);

var _BaseShape = require('../shapes/BaseShape');

var _BaseShape2 = _interopRequireDefault(_BaseShape);

var _TimeContextBehavior = require('../behaviors/TimeContextBehavior');

var _TimeContextBehavior2 = _interopRequireDefault(_TimeContextBehavior);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// time context bahevior
var timeContextBehavior = null;
var timeContextBehaviorCtor = _TimeContextBehavior2.default;

/**
 * The layer class is the main visualization class. It is mainly defines by its
 * related `LayerTimeContext` which determines its position in the overall
 * timeline (through the `start`, `duration`, `offset` and `stretchRatio`
 * attributes) and by it's registered Shape which defines how to display the
 * data associated to the layer. Each created layer must be inserted into a
 * `Track` instance in order to be displayed.
 *
 * _Note: in the context of the layer, an __item__ is the SVG element
 * returned by a `Shape` instance and associated with a particular __datum__._
 *
 * ### Layer DOM structure
 * ```
 * <g class="layer" transform="translate(${start}, 0)">
 *   <svg class="bounding-box" width="${duration}">
 *     <g class="offset" transform="translate(${offset, 0})">
 *       <!-- background -->
 *       <rect class="background"></rect>
 *       <!-- shapes and common shapes are inserted here -->
 *     </g>
 *     <g class="interactions"><!-- for feedback --></g>
 *   </svg>
 * </g>
 * ```
 */

var Layer = function (_EventEmitter) {
  (0, _inherits3.default)(Layer, _EventEmitter);

  /**
   * @param {String} dataType - Defines how the layer should look at the data.
   *    Can be 'entity' or 'collection'.
   * @param {(Array|Object)} data - The data associated to the layer.
   * @param {Object} options - Configures the layer.
   * @param {Number} [options.height=100] - Defines the height of the layer.
   * @param {Number} [options.top=0] - Defines the top position of the layer.
   * @param {Number} [options.opacity=1] - Defines the opacity of the layer.
   * @param {Number} [options.yDomain=[0,1]] - Defines boundaries of the data
   *    values in y axis (for exemple to display an audio buffer, this attribute
   *    should be set to [-1, 1].
   * @param {String} [options.className=null] - An optionnal class to add to each
   *    created shape.
   * @param {String} [options.className='selected'] - The class to add to a shape
   *    when selected.
   * @param {Number} [options.contextHandlerWidth=2] - The width of the handlers
   *    displayed to edit the layer.
   * @param {Number} [options.hittable=false] - Defines if the layer can be interacted
   *    with. Basically, the layer is not returned by `BaseState.getHitLayers` when
   *    set to false (a common use case is a layer that contains a cursor)
   * @param {Number} [zIndex=0] - zIndex of the layer, should be >= 0
   */
  function Layer(dataType, data) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck3.default)(this, Layer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Layer.__proto__ || (0, _getPrototypeOf2.default)(Layer)).call(this));

    var defaults = {
      height: 100,
      top: 0,
      opacity: 1,
      yDomain: [0, 1],
      className: null,
      selectedClassName: 'selected',
      contextHandlerWidth: 2,
      hittable: true, // when false the layer is not returned by `BaseState.getHitLayers`
      id: '', // used ?
      overflow: 'hidden', // usefull ?
      zIndex: 0 // zIndex of the layer, cannot be negative
    };

    /**
     * Parameters of the layers, `defaults` overrided with options.
     * @type {Object}
     */
    _this.params = (0, _assign2.default)({}, defaults, options);
    /**
     * Defines how the layer should look at the data (`'entity'` or `'collection'`).
     * @type {String}
     */
    _this.dataType = dataType; // 'entity' || 'collection';
    /** @type {LayerTimeContext} */
    _this.timeContext = null;
    /** @type {Element} */
    _this.$el = null;
    /** @type {Element} */
    _this.$background = null;
    /** @type {Element} */
    _this.$boundingBox = null;
    /** @type {Element} */
    _this.$offset = null;
    /** @type {Element} */
    _this.$interactions = null;
    /**
     * A Segment instanciated to interact with the Layer itself.
     * @type {Segment}
     */
    _this.contextShape = null;

    _this._shapeConfiguration = null; // { ctor, accessors, options }
    _this._commonShapeConfiguration = null; // { ctor, accessors, options }
    _this._$itemShapeMap = new _map2.default();
    _this._$itemDataMap = new _map2.default();
    _this._$itemCommonShapeMap = new _map2.default();

    _this._isContextEditable = false;
    _this._behavior = null;

    _this._height = _this.params.height;
    _this._top = _this.params.top;

    _this.data = data;

    // console.log(this.params.yDomain);
    // console.log([this._height, 0])
    _this._valueToPixel = _scales2.default.linear().domain(_this.params.yDomain).range([0, _this._height]);
    // .range([this._height, 0]);

    // initialize timeContext layout
    _this._renderContainer();
    // creates the timeContextBehavior for all layers
    if (timeContextBehavior === null) {
      timeContextBehavior = new timeContextBehaviorCtor();
    }
    return _this;
  }

  /**
   * Destroy the layer, clear all references.
   */


  (0, _createClass3.default)(Layer, [{
    key: 'destroy',
    value: function destroy() {
      this.timeContext = null;
      this.data = null;
      this.params = null;
      this._behavior = null;

      this._$itemShapeMap.clear();
      this._$itemDataMap.clear();
      this._$itemCommonShapeMap.clear();

      this.removeAllListeners();
    }

    /**
     * Allows to override default the `TimeContextBehavior` used to edit the layer.
     *
     * @param {Object} ctor
     */

  }, {
    key: 'updateHeight',
    value: function updateHeight(prevTrackHeight, newTrackHeight) {
      var ratio = newTrackHeight / prevTrackHeight;

      this._height = this._height * ratio;
      this._top = this._top * ratio;
      this._valueToPixel.range([0, this._height]);
    }

    // --------------------------------------
    // Initialization
    // --------------------------------------

    /**
     * Renders the DOM in memory on layer creation to be able to use it before
     * the layer is actually inserted in the DOM.
     */

  }, {
    key: '_renderContainer',
    value: function _renderContainer() {
      var _this2 = this;

      // wrapper group for `start, top and context flip matrix
      this.$el = document.createElementNS(_namespace2.default, 'g');
      this.$el.classList.add('layer');

      if (this.params.className !== null) this.$el.classList.add(this.params.className);

      // clip the context with a `svg` element
      this.$boundingBox = document.createElementNS(_namespace2.default, 'svg');
      this.$boundingBox.classList.add('bounding-box');
      this.$boundingBox.style.overflow = this.params.overflow;
      // group to apply offset
      this.$offset = document.createElementNS(_namespace2.default, 'g');
      this.$offset.classList.add('offset', 'items');
      // layer background
      this.$background = document.createElementNS(_namespace2.default, 'rect');
      this.$background.setAttributeNS(null, 'height', '100%');
      this.$background.setAttributeNS(null, 'width', '100%');
      this.$background.classList.add('background');
      this.$background.style.fillOpacity = 0;
      this.$background.style.pointerEvents = 'none';
      // context interactions
      this.$interactions = document.createElementNS(_namespace2.default, 'g');
      this.$interactions.classList.add('interactions');
      this.$interactions.style.display = 'none';
      // @NOTE: works but king of ugly... should be cleaned
      this.contextShape = new _Segment2.default();
      this.contextShape.install({
        opacity: function opacity() {
          return 0.1;
        },
        color: function color() {
          return '#787878';
        },
        width: function width() {
          return _this2.timeContext.duration;
        },
        height: function height() {
          return _this2._renderingContext.valueToPixel.domain()[1];
        },
        y: function y() {
          return _this2._renderingContext.valueToPixel.domain()[0];
        }
      });

      this.$interactions.appendChild(this.contextShape.render());
      // create the DOM tree
      this.$el.appendChild(this.$boundingBox);
      this.$boundingBox.appendChild(this.$offset);
      this.$offset.appendChild(this.$background);
      this.$boundingBox.appendChild(this.$interactions);
    }

    // --------------------------------------
    // Component Configuration
    // --------------------------------------

    /**
     * Sets the context of the layer, thus defining its `start`, `duration`,
     * `offset` and `stretchRatio`.
     *
     * @param {TimeContext} timeContext - The timeContext in which the layer is displayed.
     */

  }, {
    key: 'setTimeContext',
    value: function setTimeContext(timeContext) {
      this.timeContext = timeContext;
      // create a mixin to pass to the shapes
      this._renderingContext = {};
      this._updateRenderingContext();
    }

    /**
     * Register a shape and its configuration to use in order to render the data.
     *
     * @param {BaseShape} ctor - The constructor of the shape to be used.
     * @param {Object} [accessors={}] - Defines how the shape should adapt to a particular data struture.
     * @param {Object} [options={}] - Global configuration for the shapes, is specific to each `Shape`.
     */

  }, {
    key: 'configureShape',
    value: function configureShape(ctor) {
      var accessors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      this._shapeConfiguration = { ctor: ctor, accessors: accessors, options: options };
    }

    /**
     * Optionnaly register a shape to be used accros the entire collection.
     *
     * @param {BaseShape} ctor - The constructor of the shape to be used.
     * @param {Object} [accessors={}] - Defines how the shape should adapt to a particular data struture.
     * @param {Object} [options={}] - Global configuration for the shapes, is specific to each `Shape`.
     */

  }, {
    key: 'configureCommonShape',
    value: function configureCommonShape(ctor) {
      var accessors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      this._commonShapeConfiguration = { ctor: ctor, accessors: accessors, options: options };
    }

    /**
     * Register the behavior to use when interacting with a shape.
     *
     * @param {BaseBehavior} behavior
     */

  }, {
    key: 'setBehavior',
    value: function setBehavior(behavior) {
      behavior.initialize(this);
      this._behavior = behavior;
    }

    /**
     * Updates the values stored int the `_renderingContext` passed  to shapes
     * for rendering and updating.
     */

  }, {
    key: '_updateRenderingContext',
    value: function _updateRenderingContext() {
      this._renderingContext.timeToPixel = this.timeContext.timeToPixel;
      this._renderingContext.valueToPixel = this._valueToPixel;

      var height = this._height;
      var width = this.timeContext.timeToPixel(this.timeContext.duration);
      var offsetX = this.timeContext.timeToPixel(this.timeContext.offset);
      var startX = this.timeContext.parent.timeToPixel(this.timeContext.start);
      var trackOffsetX = this.timeContext.parent.timeToPixel(this.timeContext.parent.offset);
      var visibleWidth = this.timeContext.parent.visibleWidth;

      // @todo - make this mess more readable
      var minX = Math.max(-offsetX, 0);
      var trackDecay = trackOffsetX + startX;
      if (trackDecay < 0) minX = -trackDecay;

      var maxX = minX;
      maxX += width - minX < visibleWidth ? width : visibleWidth;

      this._renderingContext.width = width;
      this._renderingContext.height = height;
      this._renderingContext.offsetX = offsetX;
      this._renderingContext.startX = startX;
      this._renderingContext.minX = minX;
      this._renderingContext.maxX = maxX;
      // needed for canvas foreignObjects in chrome and safari
      this._renderingContext.trackOffsetX = trackOffsetX;
      // this._renderingContext.visibleWidth = visibleWidth;
    }

    // --------------------------------------
    // Behavior Accessors
    // --------------------------------------

    /**
     * Returns the items marked as selected.
     *
     * @type {Array<Element>}
     */

  }, {
    key: 'select',


    /**
     * Mark item(s) as selected.
     *
     * @param {Element|Element[]} $items
     */
    value: function select() {
      for (var _len = arguments.length, $items = Array(_len), _key = 0; _key < _len; _key++) {
        $items[_key] = arguments[_key];
      }

      if (!this._behavior) {
        return;
      }
      if (!$items.length) {
        $items = this._$itemDataMap.keys();
      }
      if (Array.isArray($items[0])) {
        $items = $items[0];
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)($items), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var $item = _step.value;

          var datum = this._$itemDataMap.get($item);
          this._behavior.select($item, datum);
          this._toFront($item);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * Removes item(s) from selected items.
     *
     * @param {Element|Element[]} $items
     */

  }, {
    key: 'unselect',
    value: function unselect() {
      for (var _len2 = arguments.length, $items = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        $items[_key2] = arguments[_key2];
      }

      if (!this._behavior) {
        return;
      }
      if (!$items.length) {
        $items = this._$itemDataMap.keys();
      }
      if (Array.isArray($items[0])) {
        $items = $items[0];
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)($items), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var $item = _step2.value;

          var datum = this._$itemDataMap.get($item);
          this._behavior.unselect($item, datum);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    /**
     * Toggle item(s) selection state according to their current state.
     *
     * @param {Element|Element[]} $items
     */

  }, {
    key: 'toggleSelection',
    value: function toggleSelection() {
      for (var _len3 = arguments.length, $items = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        $items[_key3] = arguments[_key3];
      }

      if (!this._behavior) {
        return;
      }
      if (!$items.length) {
        $items = this._$itemDataMap.keys();
      }
      if (Array.isArray($items[0])) {
        $items = $items[0];
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = (0, _getIterator3.default)($items), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var $item = _step3.value;

          var datum = this._$itemDataMap.get($item);
          this._behavior.toggleSelection($item, datum);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }

    /**
     * Edit item(s) according to the `edit` defined in the registered `Behavior`.
     *
     * @param {Element|Element[]} $items - Item(s) to edit
     * @param {Number} dx - Modification to apply in the x axis (in pixel domain)
     * @param {Number} dy - Modification to apply in the y axis (in pixel domain)
     * @param {Element} $target - Target of the interaction (for example, left
     *  handler DOM element in a segment).
     */

  }, {
    key: 'edit',
    value: function edit($items, dx, dy, $target) {
      if (!this._behavior) {
        return;
      }
      $items = !Array.isArray($items) ? [$items] : $items;

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = (0, _getIterator3.default)($items), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var $item = _step4.value;

          var shape = this._$itemShapeMap.get($item);
          var datum = this._$itemDataMap.get($item);

          this._behavior.edit(this._renderingContext, shape, datum, dx, dy, $target);
          this.emit('edit', shape, datum);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }

    /**
     * Defines if the `Layer`, and thus the `LayerTimeContext` is editable or not.
     *
     * @params {Boolean} [bool=true]
     */

  }, {
    key: 'setContextEditable',
    value: function setContextEditable() {
      var bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var display = bool ? 'block' : 'none';
      this.$interactions.style.display = display;
      this._isContextEditable = bool;
    }

    /**
     * Edit the layer and thus its related `LayerTimeContext` attributes.
     *
     * @param {Number} dx - The modification to apply in the x axis (in pixels).
     * @param {Number} dy - The modification to apply in the y axis (in pixels).
     * @param {Element} $target - The target of the event of the interaction.
     */

  }, {
    key: 'editContext',
    value: function editContext(dx, dy, $target) {
      timeContextBehavior.edit(this, dx, dy, $target);
    }

    /**
     * Stretch the layer and thus its related `LayerTimeContext` attributes.
     *
     * @param {Number} dx - The modification to apply in the x axis (in pixels).
     * @param {Number} dy - The modification to apply in the y axis (in pixels).
     * @param {Element} $target - The target of the event of the interaction.
     */

  }, {
    key: 'stretchContext',
    value: function stretchContext(dx, dy, $target) {
      timeContextBehavior.stretch(this, dx, dy, $target);
    }

    // --------------------------------------
    // Helpers
    // --------------------------------------

    /**
     * Returns an item from a DOM element related to the shape, null otherwise.
     *
     * @param {Element} $el - the element to be tested
     * @return {Element|null}
     */

  }, {
    key: 'getItemFromDOMElement',
    value: function getItemFromDOMElement($el) {
      var $item = void 0;

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
     * Returns the shape associated to a specific item.
     *
     * @param {Element} $item
     * @return {Shape}
     */

  }, {
    key: 'getShapeFromItem',
    value: function getShapeFromItem($item) {
      return this.hasItem($item) ? this._$itemShapeMap.get($item) : null;
    }

    /**
     * Returns the shape associated to a specific item from any DOM element
     * composing the shape.
     *
     * @param {Element} $item
     * @return {Shape}
     */

  }, {
    key: 'getShapeFromDOMElement',
    value: function getShapeFromDOMElement($el) {
      var $item = this.getItemFromDOMElement($el);
      return this.getShapeFromItem($item);
    }

    /**
     * Returns the datum associated to a specific item.
     *
     * @param {Element} $item
     * @return {Object|Array|null}
     */

  }, {
    key: 'getDatumFromItem',
    value: function getDatumFromItem($item) {
      var datum = this._$itemDataMap.get($item);
      return datum ? datum : null;
    }

    /**
     * Returns the datum associated to a specific item from any DOM element
     * composing the shape. Basically a shortcut for `getItemFromDOMElement` and
     * `getDatumFromItem` methods.
     *
     * @param {Element} $el
     * @return {Object|Array|null}
     */

  }, {
    key: 'getDatumFromDOMElement',
    value: function getDatumFromDOMElement($el) {
      var $item = this.getItemFromDOMElement($el);
      return this.getDatumFromItem($item);
    }

    /**
     * Tests if the given DOM element is an item of the layer.
     *
     * @param {Element} $item - The item to be tested.
     * @return {Boolean}
     */

  }, {
    key: 'hasItem',
    value: function hasItem($item) {
      return this._$itemDataMap.has($item);
    }

    /**
     * Defines if a given element belongs to the layer. Is more general than
     * `hasItem`, can mostly used to check interactions elements.
     *
     * @param {Element} $el - The DOM element to be tested.
     * @return {bool}
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
     * Retrieve all the items in a given area as defined in the registered `Shape~inArea` method.
     *
     * @param {Object} area - The area in which to find the elements
     * @param {Number} area.top
     * @param {Number} area.left
     * @param {Number} area.width
     * @param {Number} area.height
     * @return {Array} - list of the items presents in the area
     */

  }, {
    key: 'getItemsInArea',
    value: function getItemsInArea(area) {
      var start = this.timeContext.parent.timeToPixel(this.timeContext.start);
      var duration = this.timeContext.timeToPixel(this.timeContext.duration);
      var offset = this.timeContext.timeToPixel(this.timeContext.offset);
      var top = this._top;
      // be aware af context's translations - constrain in working view
      var x1 = Math.max(area.left, start);
      var x2 = Math.min(area.left + area.width, start + duration);
      x1 -= start + offset;
      x2 -= start + offset;
      // keep consistent with context y coordinates system
      var y1 = this._height - (area.top + area.height);
      var y2 = this._height - area.top;

      y1 += this._top;
      y2 += this._top;

      var $filteredItems = [];

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = (0, _getIterator3.default)(this._$itemDataMap.entries()), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _step5$value = (0, _slicedToArray3.default)(_step5.value, 2),
              $item = _step5$value[0],
              datum = _step5$value[1];

          var shape = this._$itemShapeMap.get($item);
          var inArea = shape.inArea(this._renderingContext, datum, x1, y1, x2, y2);

          if (inArea) {
            $filteredItems.push($item);
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return $filteredItems;
    }

    // --------------------------------------
    // Rendering / Display methods
    // --------------------------------------

    /**
     * Moves an item to the end of the layer to display it front of its
     * siblings (svg z-index...).
     *
     * @param {Element} $item - The item to be moved.
     */

  }, {
    key: '_toFront',
    value: function _toFront($item) {
      this.$offset.appendChild($item);
    }

    /**
     * Create the DOM structure of the shapes according to the given data. Inspired
     * from the `enter` and `exit` d3.js paradigm, this method should be called
     * each time a datum is added or removed from the data. While the DOM is
     * created the `update` method must be called in order to update the shapes
     * attributes and thus place them where they should.
     */

  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      // render `commonShape` only once
      if (this._commonShapeConfiguration !== null && this._$itemCommonShapeMap.size === 0) {
        var _commonShapeConfigura = this._commonShapeConfiguration,
            ctor = _commonShapeConfigura.ctor,
            accessors = _commonShapeConfigura.accessors,
            options = _commonShapeConfigura.options;

        var $group = document.createElementNS(_namespace2.default, 'g');
        var shape = new ctor(options);

        shape.install(accessors);
        $group.appendChild(shape.render());
        $group.classList.add('item', 'common', shape.getClassName());

        this._$itemCommonShapeMap.set($group, shape);
        this.$offset.appendChild($group);
      }

      // append elements all at once
      var fragment = document.createDocumentFragment();
      var values = this._$itemDataMap.values(); // iterator

      // enter
      this.data.forEach(function (datum) {
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = (0, _getIterator3.default)(values), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var value = _step6.value;
            if (value === datum) {
              return;
            }
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6.return) {
              _iterator6.return();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }

        var _shapeConfiguration = _this3._shapeConfiguration,
            ctor = _shapeConfiguration.ctor,
            accessors = _shapeConfiguration.accessors,
            options = _shapeConfiguration.options;

        var shape = new ctor(options);
        shape.install(accessors);

        var $el = shape.render(_this3._renderingContext);
        $el.classList.add('item', shape.getClassName());

        _this3._$itemShapeMap.set($el, shape);
        _this3._$itemDataMap.set($el, datum);

        fragment.appendChild($el);
      });

      this.$offset.appendChild(fragment);

      // remove
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = (0, _getIterator3.default)(this._$itemDataMap.entries()), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var _step7$value = (0, _slicedToArray3.default)(_step7.value, 2),
              $item = _step7$value[0],
              datum = _step7$value[1];

          if (this.data.indexOf(datum) !== -1) {
            continue;
          }

          var _shape = this._$itemShapeMap.get($item);

          this.$offset.removeChild($item);
          _shape.destroy();
          // a removed item cannot be selected
          if (this._behavior) {
            this._behavior.unselect($item, datum);
          }

          this._$itemDataMap.delete($item);
          this._$itemShapeMap.delete($item);
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }
    }

    /**
     * Updates the container of the layer and the attributes of the existing shapes.
     */

  }, {
    key: 'update',
    value: function update() {
      this.updateContainer();
      this.updateShapes();
    }

    /**
     * Updates the container of the layer.
     */

  }, {
    key: 'updateContainer',
    value: function updateContainer() {
      this._updateRenderingContext();

      var timeContext = this.timeContext;
      var width = timeContext.timeToPixel(timeContext.duration);
      // x is relative to timeline's timeContext
      var x = timeContext.parent.timeToPixel(timeContext.start);
      var offset = timeContext.timeToPixel(timeContext.offset);
      var top = this._top;
      var height = this._height;
      // matrix to invert the coordinate system
      var translateMatrix = 'matrix(1, 0, 0, -1, ' + x + ', ' + (top + height) + ')';
      this.$el.setAttributeNS(null, 'transform', translateMatrix);
      // this.$el.setAttributeNS(null, 'transform', `translate(${x}, ${top})`);

      this.$boundingBox.setAttributeNS(null, 'width', width);
      this.$boundingBox.setAttributeNS(null, 'height', height);
      this.$boundingBox.style.opacity = this.params.opacity;

      this.$offset.setAttributeNS(null, 'transform', 'translate(' + offset + ', 0)');
      // maintain context shape
      this.contextShape.update(this._renderingContext, this.timeContext, 0);
    }

    /**
     * Updates the attributes of all the `Shape` instances rendered into the layer.
     *
     * @todo - allow to filter which shape(s) should be updated.
     */

  }, {
    key: 'updateShapes',
    value: function updateShapes() {
      var _this4 = this;

      this._updateRenderingContext();
      // update common shapes
      this._$itemCommonShapeMap.forEach(function (shape, $item) {
        shape.update(_this4._renderingContext, _this4.data);
      });

      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = (0, _getIterator3.default)(this._$itemDataMap.entries()), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var _step8$value = (0, _slicedToArray3.default)(_step8.value, 2),
              $item = _step8$value[0],
              datum = _step8$value[1];

          var shape = this._$itemShapeMap.get($item);
          shape.update(this._renderingContext, datum);
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }
    }
  }, {
    key: 'start',


    /**
     * Returns `LayerTimeContext`'s `start` time domain value.
     *
     * @type {Number}
     */
    get: function get() {
      return this.timeContext.start;
    }

    /**
     * Sets `LayerTimeContext`'s `start` time domain value.
     *
     * @type {Number}
     */
    ,
    set: function set(value) {
      this.timeContext.start = value;
    }

    /**
     * Returns `LayerTimeContext`'s `offset` time domain value.
     *
     * @type {Number}
     */

  }, {
    key: 'offset',
    get: function get() {
      return this.timeContext.offset;
    }

    /**
     * Sets `LayerTimeContext`'s `offset` time domain value.
     *
     * @type {Number}
     */
    ,
    set: function set(value) {
      this.timeContext.offset = value;
    }

    /**
     * Returns `LayerTimeContext`'s `duration` time domain value.
     *
     * @type {Number}
     */

  }, {
    key: 'duration',
    get: function get() {
      return this.timeContext.duration;
    }

    /**
     * Sets `LayerTimeContext`'s `duration` time domain value.
     *
     * @type {Number}
     */
    ,
    set: function set(value) {
      this.timeContext.duration = value;
    }

    /**
     * Returns `LayerTimeContext`'s `stretchRatio` time domain value.
     *
     * @type {Number}
     */

  }, {
    key: 'stretchRatio',
    get: function get() {
      return this.timeContext.stretchRatio;
    }

    /**
     * Sets `LayerTimeContext`'s `stretchRatio` time domain value.
     *
     * @type {Number}
     */
    ,
    set: function set(value) {
      this.timeContext.stretchRatio = value;
    }

    /**
     * Set the domain boundaries of the data for the y axis.
     *
     * @type {Array}
     */

  }, {
    key: 'yDomain',
    set: function set(domain) {
      this.params.yDomain = domain;
      this._valueToPixel.domain(domain);
    }

    /**
     * Returns the domain boundaries of the data for the y axis.
     *
     * @type {Array}
     */
    ,
    get: function get() {
      return this.params.yDomain;
    }

    /**
     * Sets the opacity of the whole layer.
     *
     * @type {Number}
     */

  }, {
    key: 'opacity',
    set: function set(value) {
      this.params.opacity = value;
    }

    /**
     * Returns the opacity of the whole layer.
     *
     * @type {Number}
     */
    ,
    get: function get() {
      return this.params.opacity;
    }

    /**
     * Returns the transfert function used to display the data in the x axis.
     *
     * @type {Number}
     */

  }, {
    key: 'timeToPixel',
    get: function get() {
      return this.timeContext.timeToPixel;
    }

    /**
     * Returns the transfert function used to display the data in the y axis.
     *
     * @type {Number}
     */

  }, {
    key: 'valueToPixel',
    get: function get() {
      return this._valueToPixel;
    }

    /**
     * Returns an array containing all the displayed items.
     *
     * @type {Array<Element>}
     */

  }, {
    key: 'items',
    get: function get() {
      return (0, _from2.default)(this._$itemDataMap.keys());
    }

    /**
     * Returns the data associated to the layer.
     *
     * @type {Object[]}
     */

  }, {
    key: 'data',
    get: function get() {
      return this._data;
    }

    /**
     * Sets the data associated with the layer.
     *
     * @type {Object|Object[]}
     */
    ,
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
}(_events.EventEmitter);

exports.default = Layer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxheWVyLmpzIl0sIm5hbWVzIjpbInRpbWVDb250ZXh0QmVoYXZpb3IiLCJ0aW1lQ29udGV4dEJlaGF2aW9yQ3RvciIsIkxheWVyIiwiZGF0YVR5cGUiLCJkYXRhIiwib3B0aW9ucyIsImRlZmF1bHRzIiwiaGVpZ2h0IiwidG9wIiwib3BhY2l0eSIsInlEb21haW4iLCJjbGFzc05hbWUiLCJzZWxlY3RlZENsYXNzTmFtZSIsImNvbnRleHRIYW5kbGVyV2lkdGgiLCJoaXR0YWJsZSIsImlkIiwib3ZlcmZsb3ciLCJ6SW5kZXgiLCJwYXJhbXMiLCJ0aW1lQ29udGV4dCIsIiRlbCIsIiRiYWNrZ3JvdW5kIiwiJGJvdW5kaW5nQm94IiwiJG9mZnNldCIsIiRpbnRlcmFjdGlvbnMiLCJjb250ZXh0U2hhcGUiLCJfc2hhcGVDb25maWd1cmF0aW9uIiwiX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiIsIl8kaXRlbVNoYXBlTWFwIiwiXyRpdGVtRGF0YU1hcCIsIl8kaXRlbUNvbW1vblNoYXBlTWFwIiwiX2lzQ29udGV4dEVkaXRhYmxlIiwiX2JlaGF2aW9yIiwiX2hlaWdodCIsIl90b3AiLCJfdmFsdWVUb1BpeGVsIiwibGluZWFyIiwiZG9tYWluIiwicmFuZ2UiLCJfcmVuZGVyQ29udGFpbmVyIiwiY2xlYXIiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJwcmV2VHJhY2tIZWlnaHQiLCJuZXdUcmFja0hlaWdodCIsInJhdGlvIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50TlMiLCJjbGFzc0xpc3QiLCJhZGQiLCJzdHlsZSIsInNldEF0dHJpYnV0ZU5TIiwiZmlsbE9wYWNpdHkiLCJwb2ludGVyRXZlbnRzIiwiZGlzcGxheSIsImluc3RhbGwiLCJjb2xvciIsIndpZHRoIiwiZHVyYXRpb24iLCJfcmVuZGVyaW5nQ29udGV4dCIsInZhbHVlVG9QaXhlbCIsInkiLCJhcHBlbmRDaGlsZCIsInJlbmRlciIsIl91cGRhdGVSZW5kZXJpbmdDb250ZXh0IiwiY3RvciIsImFjY2Vzc29ycyIsImJlaGF2aW9yIiwiaW5pdGlhbGl6ZSIsInRpbWVUb1BpeGVsIiwib2Zmc2V0WCIsIm9mZnNldCIsInN0YXJ0WCIsInBhcmVudCIsInN0YXJ0IiwidHJhY2tPZmZzZXRYIiwidmlzaWJsZVdpZHRoIiwibWluWCIsIk1hdGgiLCJtYXgiLCJ0cmFja0RlY2F5IiwibWF4WCIsIiRpdGVtcyIsImxlbmd0aCIsImtleXMiLCJBcnJheSIsImlzQXJyYXkiLCIkaXRlbSIsImRhdHVtIiwiZ2V0Iiwic2VsZWN0IiwiX3RvRnJvbnQiLCJ1bnNlbGVjdCIsInRvZ2dsZVNlbGVjdGlvbiIsImR4IiwiZHkiLCIkdGFyZ2V0Iiwic2hhcGUiLCJlZGl0IiwiZW1pdCIsImJvb2wiLCJzdHJldGNoIiwiY29udGFpbnMiLCJwYXJlbnROb2RlIiwiaGFzSXRlbSIsImdldEl0ZW1Gcm9tRE9NRWxlbWVudCIsImdldFNoYXBlRnJvbUl0ZW0iLCJnZXREYXR1bUZyb21JdGVtIiwiaGFzIiwiYXJlYSIsIngxIiwibGVmdCIsIngyIiwibWluIiwieTEiLCJ5MiIsIiRmaWx0ZXJlZEl0ZW1zIiwiZW50cmllcyIsImluQXJlYSIsInB1c2giLCJzaXplIiwiJGdyb3VwIiwiZ2V0Q2xhc3NOYW1lIiwic2V0IiwiZnJhZ21lbnQiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50IiwidmFsdWVzIiwiZm9yRWFjaCIsInZhbHVlIiwiaW5kZXhPZiIsInJlbW92ZUNoaWxkIiwiZGVzdHJveSIsImRlbGV0ZSIsInVwZGF0ZUNvbnRhaW5lciIsInVwZGF0ZVNoYXBlcyIsIngiLCJ0cmFuc2xhdGVNYXRyaXgiLCJ1cGRhdGUiLCJzdHJldGNoUmF0aW8iLCJfZGF0YSIsInNlbGVjdGVkSXRlbXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTtBQUNBLElBQUlBLHNCQUFzQixJQUEx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QUExQjtBQUNEOzs7OztrQkEyckJZOUQsSyIsImZpbGUiOiJsYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgbnMgZnJvbSAnLi9uYW1lc3BhY2UnO1xuaW1wb3J0IHNjYWxlcyBmcm9tICcuLi91dGlscy9zY2FsZXMnO1xuaW1wb3J0IFNlZ21lbnQgZnJvbSAnLi4vc2hhcGVzL1NlZ21lbnQnO1xuaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuLi9zaGFwZXMvQmFzZVNoYXBlJztcbmltcG9ydCBUaW1lQ29udGV4dEJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9UaW1lQ29udGV4dEJlaGF2aW9yJztcblxuLy8gdGltZSBjb250ZXh0IGJhaGV2aW9yXG5sZXQgdGltZUNvbnRleHRCZWhhdmlvciA9IG51bGw7XG5sZXQgdGltZUNvbnRleHRCZWhhdmlvckN0b3IgPSBUaW1lQ29udGV4dEJlaGF2aW9yO1xuXG4vKipcbiAqIFRoZSBsYXllciBjbGFzcyBpcyB0aGUgbWFpbiB2aXN1YWxpemF0aW9uIGNsYXNzLiBJdCBpcyBtYWlubHkgZGVmaW5lcyBieSBpdHNcbiAqIHJlbGF0ZWQgYExheWVyVGltZUNvbnRleHRgIHdoaWNoIGRldGVybWluZXMgaXRzIHBvc2l0aW9uIGluIHRoZSBvdmVyYWxsXG4gKiB0aW1lbGluZSAodGhyb3VnaCB0aGUgYHN0YXJ0YCwgYGR1cmF0aW9uYCwgYG9mZnNldGAgYW5kIGBzdHJldGNoUmF0aW9gXG4gKiBhdHRyaWJ1dGVzKSBhbmQgYnkgaXQncyByZWdpc3RlcmVkIFNoYXBlIHdoaWNoIGRlZmluZXMgaG93IHRvIGRpc3BsYXkgdGhlXG4gKiBkYXRhIGFzc29jaWF0ZWQgdG8gdGhlIGxheWVyLiBFYWNoIGNyZWF0ZWQgbGF5ZXIgbXVzdCBiZSBpbnNlcnRlZCBpbnRvIGFcbiAqIGBUcmFja2AgaW5zdGFuY2UgaW4gb3JkZXIgdG8gYmUgZGlzcGxheWVkLlxuICpcbiAqIF9Ob3RlOiBpbiB0aGUgY29udGV4dCBvZiB0aGUgbGF5ZXIsIGFuIF9faXRlbV9fIGlzIHRoZSBTVkcgZWxlbWVudFxuICogcmV0dXJuZWQgYnkgYSBgU2hhcGVgIGluc3RhbmNlIGFuZCBhc3NvY2lhdGVkIHdpdGggYSBwYXJ0aWN1bGFyIF9fZGF0dW1fXy5fXG4gKlxuICogIyMjIExheWVyIERPTSBzdHJ1Y3R1cmVcbiAqIGBgYFxuICogPGcgY2xhc3M9XCJsYXllclwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgke3N0YXJ0fSwgMClcIj5cbiAqICAgPHN2ZyBjbGFzcz1cImJvdW5kaW5nLWJveFwiIHdpZHRoPVwiJHtkdXJhdGlvbn1cIj5cbiAqICAgICA8ZyBjbGFzcz1cIm9mZnNldFwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgke29mZnNldCwgMH0pXCI+XG4gKiAgICAgICA8IS0tIGJhY2tncm91bmQgLS0+XG4gKiAgICAgICA8cmVjdCBjbGFzcz1cImJhY2tncm91bmRcIj48L3JlY3Q+XG4gKiAgICAgICA8IS0tIHNoYXBlcyBhbmQgY29tbW9uIHNoYXBlcyBhcmUgaW5zZXJ0ZWQgaGVyZSAtLT5cbiAqICAgICA8L2c+XG4gKiAgICAgPGcgY2xhc3M9XCJpbnRlcmFjdGlvbnNcIj48IS0tIGZvciBmZWVkYmFjayAtLT48L2c+XG4gKiAgIDwvc3ZnPlxuICogPC9nPlxuICogYGBgXG4gKi9cbmNsYXNzIExheWVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhVHlwZSAtIERlZmluZXMgaG93IHRoZSBsYXllciBzaG91bGQgbG9vayBhdCB0aGUgZGF0YS5cbiAgICogICAgQ2FuIGJlICdlbnRpdHknIG9yICdjb2xsZWN0aW9uJy5cbiAgICogQHBhcmFtIHsoQXJyYXl8T2JqZWN0KX0gZGF0YSAtIFRoZSBkYXRhIGFzc29jaWF0ZWQgdG8gdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIENvbmZpZ3VyZXMgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGVpZ2h0PTEwMF0gLSBEZWZpbmVzIHRoZSBoZWlnaHQgb2YgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMudG9wPTBdIC0gRGVmaW5lcyB0aGUgdG9wIHBvc2l0aW9uIG9mIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm9wYWNpdHk9MV0gLSBEZWZpbmVzIHRoZSBvcGFjaXR5IG9mIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnlEb21haW49WzAsMV1dIC0gRGVmaW5lcyBib3VuZGFyaWVzIG9mIHRoZSBkYXRhXG4gICAqICAgIHZhbHVlcyBpbiB5IGF4aXMgKGZvciBleGVtcGxlIHRvIGRpc3BsYXkgYW4gYXVkaW8gYnVmZmVyLCB0aGlzIGF0dHJpYnV0ZVxuICAgKiAgICBzaG91bGQgYmUgc2V0IHRvIFstMSwgMV0uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jbGFzc05hbWU9bnVsbF0gLSBBbiBvcHRpb25uYWwgY2xhc3MgdG8gYWRkIHRvIGVhY2hcbiAgICogICAgY3JlYXRlZCBzaGFwZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNsYXNzTmFtZT0nc2VsZWN0ZWQnXSAtIFRoZSBjbGFzcyB0byBhZGQgdG8gYSBzaGFwZVxuICAgKiAgICB3aGVuIHNlbGVjdGVkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuY29udGV4dEhhbmRsZXJXaWR0aD0yXSAtIFRoZSB3aWR0aCBvZiB0aGUgaGFuZGxlcnNcbiAgICogICAgZGlzcGxheWVkIHRvIGVkaXQgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGl0dGFibGU9ZmFsc2VdIC0gRGVmaW5lcyBpZiB0aGUgbGF5ZXIgY2FuIGJlIGludGVyYWN0ZWRcbiAgICogICAgd2l0aC4gQmFzaWNhbGx5LCB0aGUgbGF5ZXIgaXMgbm90IHJldHVybmVkIGJ5IGBCYXNlU3RhdGUuZ2V0SGl0TGF5ZXJzYCB3aGVuXG4gICAqICAgIHNldCB0byBmYWxzZSAoYSBjb21tb24gdXNlIGNhc2UgaXMgYSBsYXllciB0aGF0IGNvbnRhaW5zIGEgY3Vyc29yKVxuICAgKiBAcGFyYW0ge051bWJlcn0gW3pJbmRleD0wXSAtIHpJbmRleCBvZiB0aGUgbGF5ZXIsIHNob3VsZCBiZSA+PSAwXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkYXRhVHlwZSwgZGF0YSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgaGVpZ2h0OiAxMDAsXG4gICAgICB0b3A6IDAsXG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgeURvbWFpbjogWzAsIDFdLFxuICAgICAgY2xhc3NOYW1lOiBudWxsLFxuICAgICAgc2VsZWN0ZWRDbGFzc05hbWU6ICdzZWxlY3RlZCcsXG4gICAgICBjb250ZXh0SGFuZGxlcldpZHRoOiAyLFxuICAgICAgaGl0dGFibGU6IHRydWUsIC8vIHdoZW4gZmFsc2UgdGhlIGxheWVyIGlzIG5vdCByZXR1cm5lZCBieSBgQmFzZVN0YXRlLmdldEhpdExheWVyc2BcbiAgICAgIGlkOiAnJywgLy8gdXNlZCA/XG4gICAgICBvdmVyZmxvdzogJ2hpZGRlbicsIC8vIHVzZWZ1bGwgP1xuICAgICAgekluZGV4OiAwLCAvLyB6SW5kZXggb2YgdGhlIGxheWVyLCBjYW5ub3QgYmUgbmVnYXRpdmVcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUGFyYW1ldGVycyBvZiB0aGUgbGF5ZXJzLCBgZGVmYXVsdHNgIG92ZXJyaWRlZCB3aXRoIG9wdGlvbnMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIGhvdyB0aGUgbGF5ZXIgc2hvdWxkIGxvb2sgYXQgdGhlIGRhdGEgKGAnZW50aXR5J2Agb3IgYCdjb2xsZWN0aW9uJ2ApLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5kYXRhVHlwZSA9IGRhdGFUeXBlOyAvLyAnZW50aXR5JyB8fCAnY29sbGVjdGlvbic7XG4gICAgLyoqIEB0eXBlIHtMYXllclRpbWVDb250ZXh0fSAqL1xuICAgIHRoaXMudGltZUNvbnRleHQgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7RWxlbWVudH0gKi9cbiAgICB0aGlzLiRlbCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJGJhY2tncm91bmQgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7RWxlbWVudH0gKi9cbiAgICB0aGlzLiRib3VuZGluZ0JveCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJG9mZnNldCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJGludGVyYWN0aW9ucyA9IG51bGw7XG4gICAgLyoqXG4gICAgICogQSBTZWdtZW50IGluc3RhbmNpYXRlZCB0byBpbnRlcmFjdCB3aXRoIHRoZSBMYXllciBpdHNlbGYuXG4gICAgICogQHR5cGUge1NlZ21lbnR9XG4gICAgICovXG4gICAgdGhpcy5jb250ZXh0U2hhcGUgPSBudWxsO1xuXG4gICAgdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uID0gbnVsbDsgICAgICAgLy8geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfVxuICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiA9IG51bGw7IC8vIHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH1cbiAgICB0aGlzLl8kaXRlbVNoYXBlTWFwID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuXyRpdGVtRGF0YU1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwID0gbmV3IE1hcCgpO1xuXG4gICAgdGhpcy5faXNDb250ZXh0RWRpdGFibGUgPSBmYWxzZTtcbiAgICB0aGlzLl9iZWhhdmlvciA9IG51bGw7XG5cbiAgICB0aGlzLl9oZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgdGhpcy5fdG9wID0gdGhpcy5wYXJhbXMudG9wO1xuXG4gICAgdGhpcy5kYXRhID0gZGF0YTtcblxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMucGFyYW1zLnlEb21haW4pO1xuICAgIC8vIGNvbnNvbGUubG9nKFt0aGlzLl9oZWlnaHQsIDBdKVxuICAgIHRoaXMuX3ZhbHVlVG9QaXhlbCA9IHNjYWxlcy5saW5lYXIoKVxuICAgICAgLmRvbWFpbih0aGlzLnBhcmFtcy55RG9tYWluKVxuICAgICAgLnJhbmdlKFswLCB0aGlzLl9oZWlnaHRdKTtcbiAgICAgIC8vIC5yYW5nZShbdGhpcy5faGVpZ2h0LCAwXSk7XG5cbiAgICAvLyBpbml0aWFsaXplIHRpbWVDb250ZXh0IGxheW91dFxuICAgIHRoaXMuX3JlbmRlckNvbnRhaW5lcigpO1xuICAgIC8vIGNyZWF0ZXMgdGhlIHRpbWVDb250ZXh0QmVoYXZpb3IgZm9yIGFsbCBsYXllcnNcbiAgICBpZiAodGltZUNvbnRleHRCZWhhdmlvciA9PT0gbnVsbCkge1xuICAgICAgdGltZUNvbnRleHRCZWhhdmlvciA9IG5ldyB0aW1lQ29udGV4dEJlaGF2aW9yQ3RvcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBsYXllciwgY2xlYXIgYWxsIHJlZmVyZW5jZXMuXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMudGltZUNvbnRleHQgPSBudWxsO1xuICAgIHRoaXMuZGF0YSA9IG51bGw7XG4gICAgdGhpcy5wYXJhbXMgPSBudWxsO1xuICAgIHRoaXMuX2JlaGF2aW9yID0gbnVsbDtcblxuICAgIHRoaXMuXyRpdGVtU2hhcGVNYXAuY2xlYXIoKTtcbiAgICB0aGlzLl8kaXRlbURhdGFNYXAuY2xlYXIoKTtcbiAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwLmNsZWFyKCk7XG5cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93cyB0byBvdmVycmlkZSBkZWZhdWx0IHRoZSBgVGltZUNvbnRleHRCZWhhdmlvcmAgdXNlZCB0byBlZGl0IHRoZSBsYXllci5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGN0b3JcbiAgICovXG4gIHN0YXRpYyBjb25maWd1cmVUaW1lQ29udGV4dEJlaGF2aW9yKGN0b3IpIHtcbiAgICB0aW1lQ29udGV4dEJlaGF2aW9yQ3RvciA9IGN0b3I7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgc3RhcnRgIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHN0YXJ0KCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnN0YXJ0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYExheWVyVGltZUNvbnRleHRgJ3MgYHN0YXJ0YCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBzdGFydCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQuc3RhcnQgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGBMYXllclRpbWVDb250ZXh0YCdzIGBvZmZzZXRgIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5vZmZzZXQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgb2Zmc2V0YCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBvZmZzZXQodmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYExheWVyVGltZUNvbnRleHRgJ3MgYGR1cmF0aW9uYCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBkdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGBMYXllclRpbWVDb250ZXh0YCdzIGBkdXJhdGlvbmAgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgZHVyYXRpb24odmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgc3RyZXRjaFJhdGlvYCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBzdHJldGNoUmF0aW8oKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQuc3RyZXRjaFJhdGlvO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYExheWVyVGltZUNvbnRleHRgJ3MgYHN0cmV0Y2hSYXRpb2AgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgc3RyZXRjaFJhdGlvKHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC5zdHJldGNoUmF0aW8gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGRvbWFpbiBib3VuZGFyaWVzIG9mIHRoZSBkYXRhIGZvciB0aGUgeSBheGlzLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqL1xuICBzZXQgeURvbWFpbihkb21haW4pIHtcbiAgICB0aGlzLnBhcmFtcy55RG9tYWluID0gZG9tYWluO1xuICAgIHRoaXMuX3ZhbHVlVG9QaXhlbC5kb21haW4oZG9tYWluKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkb21haW4gYm91bmRhcmllcyBvZiB0aGUgZGF0YSBmb3IgdGhlIHkgYXhpcy5cbiAgICpcbiAgICogQHR5cGUge0FycmF5fVxuICAgKi9cbiAgZ2V0IHlEb21haW4oKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLnlEb21haW47XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgb3BhY2l0eSBvZiB0aGUgd2hvbGUgbGF5ZXIuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgb3BhY2l0eSh2YWx1ZSkge1xuICAgIHRoaXMucGFyYW1zLm9wYWNpdHkgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBvcGFjaXR5IG9mIHRoZSB3aG9sZSBsYXllci5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBvcGFjaXR5KCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRyYW5zZmVydCBmdW5jdGlvbiB1c2VkIHRvIGRpc3BsYXkgdGhlIGRhdGEgaW4gdGhlIHggYXhpcy5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCB0aW1lVG9QaXhlbCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0cmFuc2ZlcnQgZnVuY3Rpb24gdXNlZCB0byBkaXNwbGF5IHRoZSBkYXRhIGluIHRoZSB5IGF4aXMuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgdmFsdWVUb1BpeGVsKCkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZVRvUGl4ZWw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIGFsbCB0aGUgZGlzcGxheWVkIGl0ZW1zLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXk8RWxlbWVudD59XG4gICAqL1xuICBnZXQgaXRlbXMoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fJGl0ZW1EYXRhTWFwLmtleXMoKSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGF0YSBhc3NvY2lhdGVkIHRvIHRoZSBsYXllci5cbiAgICpcbiAgICogQHR5cGUge09iamVjdFtdfVxuICAgKi9cbiAgZ2V0IGRhdGEoKSB7IHJldHVybiB0aGlzLl9kYXRhOyB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGRhdGEgYXNzb2NpYXRlZCB3aXRoIHRoZSBsYXllci5cbiAgICpcbiAgICogQHR5cGUge09iamVjdHxPYmplY3RbXX1cbiAgICovXG4gIHNldCBkYXRhKGRhdGEpIHtcbiAgICBzd2l0Y2ggKHRoaXMuZGF0YVR5cGUpIHtcbiAgICAgIGNhc2UgJ2VudGl0eSc6XG4gICAgICAgIGlmICh0aGlzLl9kYXRhKSB7ICAvLyBpZiBkYXRhIGFscmVhZHkgZXhpc3RzLCByZXVzZSB0aGUgcmVmZXJlbmNlXG4gICAgICAgICAgdGhpcy5fZGF0YVswXSA9IGRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fZGF0YSA9IFtkYXRhXTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbGxlY3Rpb24nOlxuICAgICAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlSGVpZ2h0KHByZXZUcmFja0hlaWdodCwgbmV3VHJhY2tIZWlnaHQpIHtcbiAgICBjb25zdCByYXRpbyA9IG5ld1RyYWNrSGVpZ2h0IC8gcHJldlRyYWNrSGVpZ2h0O1xuXG4gICAgdGhpcy5faGVpZ2h0ID0gdGhpcy5faGVpZ2h0ICogcmF0aW87XG4gICAgdGhpcy5fdG9wID0gdGhpcy5fdG9wICogcmF0aW87XG4gICAgdGhpcy5fdmFsdWVUb1BpeGVsLnJhbmdlKFswLCB0aGlzLl9oZWlnaHRdKVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSW5pdGlhbGl6YXRpb25cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogUmVuZGVycyB0aGUgRE9NIGluIG1lbW9yeSBvbiBsYXllciBjcmVhdGlvbiB0byBiZSBhYmxlIHRvIHVzZSBpdCBiZWZvcmVcbiAgICogdGhlIGxheWVyIGlzIGFjdHVhbGx5IGluc2VydGVkIGluIHRoZSBET00uXG4gICAqL1xuICBfcmVuZGVyQ29udGFpbmVyKCkge1xuICAgIC8vIHdyYXBwZXIgZ3JvdXAgZm9yIGBzdGFydCwgdG9wIGFuZCBjb250ZXh0IGZsaXAgbWF0cml4XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZCgnbGF5ZXInKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5jbGFzc05hbWUgIT09IG51bGwpXG4gICAgICB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKHRoaXMucGFyYW1zLmNsYXNzTmFtZSk7XG5cbiAgICAvLyBjbGlwIHRoZSBjb250ZXh0IHdpdGggYSBgc3ZnYCBlbGVtZW50XG4gICAgdGhpcy4kYm91bmRpbmdCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdzdmcnKTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5jbGFzc0xpc3QuYWRkKCdib3VuZGluZy1ib3gnKTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5zdHlsZS5vdmVyZmxvdyA9IHRoaXMucGFyYW1zLm92ZXJmbG93O1xuICAgIC8vIGdyb3VwIHRvIGFwcGx5IG9mZnNldFxuICAgIHRoaXMuJG9mZnNldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLiRvZmZzZXQuY2xhc3NMaXN0LmFkZCgnb2Zmc2V0JywgJ2l0ZW1zJyk7XG4gICAgLy8gbGF5ZXIgYmFja2dyb3VuZFxuICAgIHRoaXMuJGJhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsICcxMDAlJyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kJyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zdHlsZS5maWxsT3BhY2l0eSA9IDA7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuICAgIC8vIGNvbnRleHQgaW50ZXJhY3Rpb25zXG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuJGludGVyYWN0aW9ucy5jbGFzc0xpc3QuYWRkKCdpbnRlcmFjdGlvbnMnKTtcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAvLyBATk9URTogd29ya3MgYnV0IGtpbmcgb2YgdWdseS4uLiBzaG91bGQgYmUgY2xlYW5lZFxuICAgIHRoaXMuY29udGV4dFNoYXBlID0gbmV3IFNlZ21lbnQoKTtcbiAgICB0aGlzLmNvbnRleHRTaGFwZS5pbnN0YWxsKHtcbiAgICAgIG9wYWNpdHk6ICgpID0+IDAuMSxcbiAgICAgIGNvbG9yICA6ICgpID0+ICcjNzg3ODc4JyxcbiAgICAgIHdpZHRoICA6ICgpID0+IHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24sXG4gICAgICBoZWlnaHQgOiAoKSA9PiB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbC5kb21haW4oKVsxXSxcbiAgICAgIHkgICAgICA6ICgpID0+IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmRvbWFpbigpWzBdXG4gICAgfSk7XG5cbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMuYXBwZW5kQ2hpbGQodGhpcy5jb250ZXh0U2hhcGUucmVuZGVyKCkpO1xuICAgIC8vIGNyZWF0ZSB0aGUgRE9NIHRyZWVcbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRib3VuZGluZ0JveCk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guYXBwZW5kQ2hpbGQodGhpcy4kb2Zmc2V0KTtcbiAgICB0aGlzLiRvZmZzZXQuYXBwZW5kQ2hpbGQodGhpcy4kYmFja2dyb3VuZCk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guYXBwZW5kQ2hpbGQodGhpcy4kaW50ZXJhY3Rpb25zKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbXBvbmVudCBDb25maWd1cmF0aW9uXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGNvbnRleHQgb2YgdGhlIGxheWVyLCB0aHVzIGRlZmluaW5nIGl0cyBgc3RhcnRgLCBgZHVyYXRpb25gLFxuICAgKiBgb2Zmc2V0YCBhbmQgYHN0cmV0Y2hSYXRpb2AuXG4gICAqXG4gICAqIEBwYXJhbSB7VGltZUNvbnRleHR9IHRpbWVDb250ZXh0IC0gVGhlIHRpbWVDb250ZXh0IGluIHdoaWNoIHRoZSBsYXllciBpcyBkaXNwbGF5ZWQuXG4gICAqL1xuICBzZXRUaW1lQ29udGV4dCh0aW1lQ29udGV4dCkge1xuICAgIHRoaXMudGltZUNvbnRleHQgPSB0aW1lQ29udGV4dDtcbiAgICAvLyBjcmVhdGUgYSBtaXhpbiB0byBwYXNzIHRvIHRoZSBzaGFwZXNcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0ID0ge307XG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgc2hhcGUgYW5kIGl0cyBjb25maWd1cmF0aW9uIHRvIHVzZSBpbiBvcmRlciB0byByZW5kZXIgdGhlIGRhdGEuXG4gICAqXG4gICAqIEBwYXJhbSB7QmFzZVNoYXBlfSBjdG9yIC0gVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBzaGFwZSB0byBiZSB1c2VkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2FjY2Vzc29ycz17fV0gLSBEZWZpbmVzIGhvdyB0aGUgc2hhcGUgc2hvdWxkIGFkYXB0IHRvIGEgcGFydGljdWxhciBkYXRhIHN0cnV0dXJlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIC0gR2xvYmFsIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBzaGFwZXMsIGlzIHNwZWNpZmljIHRvIGVhY2ggYFNoYXBlYC5cbiAgICovXG4gIGNvbmZpZ3VyZVNoYXBlKGN0b3IsIGFjY2Vzc29ycyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb24gPSB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9O1xuICB9XG5cbiAgLyoqXG4gICAqIE9wdGlvbm5hbHkgcmVnaXN0ZXIgYSBzaGFwZSB0byBiZSB1c2VkIGFjY3JvcyB0aGUgZW50aXJlIGNvbGxlY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7QmFzZVNoYXBlfSBjdG9yIC0gVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBzaGFwZSB0byBiZSB1c2VkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2FjY2Vzc29ycz17fV0gLSBEZWZpbmVzIGhvdyB0aGUgc2hhcGUgc2hvdWxkIGFkYXB0IHRvIGEgcGFydGljdWxhciBkYXRhIHN0cnV0dXJlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIC0gR2xvYmFsIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBzaGFwZXMsIGlzIHNwZWNpZmljIHRvIGVhY2ggYFNoYXBlYC5cbiAgICovXG4gIGNvbmZpZ3VyZUNvbW1vblNoYXBlKGN0b3IsIGFjY2Vzc29ycyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb24gPSB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoZSBiZWhhdmlvciB0byB1c2Ugd2hlbiBpbnRlcmFjdGluZyB3aXRoIGEgc2hhcGUuXG4gICAqXG4gICAqIEBwYXJhbSB7QmFzZUJlaGF2aW9yfSBiZWhhdmlvclxuICAgKi9cbiAgc2V0QmVoYXZpb3IoYmVoYXZpb3IpIHtcbiAgICBiZWhhdmlvci5pbml0aWFsaXplKHRoaXMpO1xuICAgIHRoaXMuX2JlaGF2aW9yID0gYmVoYXZpb3I7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgdmFsdWVzIHN0b3JlZCBpbnQgdGhlIGBfcmVuZGVyaW5nQ29udGV4dGAgcGFzc2VkICB0byBzaGFwZXNcbiAgICogZm9yIHJlbmRlcmluZyBhbmQgdXBkYXRpbmcuXG4gICAqL1xuICBfdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpIHtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbDtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCA9IHRoaXMuX3ZhbHVlVG9QaXhlbDtcblxuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuX2hlaWdodDtcbiAgICBjb25zdCB3aWR0aCAgPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24pO1xuICAgIGNvbnN0IG9mZnNldFggPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQub2Zmc2V0KTtcbiAgICBjb25zdCBzdGFydFggPSB0aGlzLnRpbWVDb250ZXh0LnBhcmVudC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0LnN0YXJ0KTtcbiAgICBjb25zdCB0cmFja09mZnNldFggPSB0aGlzLnRpbWVDb250ZXh0LnBhcmVudC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0LnBhcmVudC5vZmZzZXQpO1xuICAgIGNvbnN0IHZpc2libGVXaWR0aCA9IHRoaXMudGltZUNvbnRleHQucGFyZW50LnZpc2libGVXaWR0aDtcblxuICAgIC8vIEB0b2RvIC0gbWFrZSB0aGlzIG1lc3MgbW9yZSByZWFkYWJsZVxuICAgIGxldCBtaW5YID0gTWF0aC5tYXgoLW9mZnNldFgsIDApO1xuICAgIGxldCB0cmFja0RlY2F5ID0gdHJhY2tPZmZzZXRYICsgc3RhcnRYO1xuICAgIGlmICh0cmFja0RlY2F5IDwgMClcbiAgICAgIG1pblggPSAtdHJhY2tEZWNheTtcblxuICAgIGxldCBtYXhYID0gbWluWDtcbiAgICBtYXhYICs9ICh3aWR0aCAtIG1pblggPCB2aXNpYmxlV2lkdGgpID8gd2lkdGggOiB2aXNpYmxlV2lkdGg7XG5cbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5vZmZzZXRYID0gb2Zmc2V0WDtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnN0YXJ0WCA9IHN0YXJ0WDtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0Lm1pblggPSBtaW5YO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQubWF4WCA9IG1heFg7XG4gICAgLy8gbmVlZGVkIGZvciBjYW52YXMgZm9yZWlnbk9iamVjdHMgaW4gY2hyb21lIGFuZCBzYWZhcmlcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnRyYWNrT2Zmc2V0WCA9IHRyYWNrT2Zmc2V0WDtcbiAgICAvLyB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZpc2libGVXaWR0aCA9IHZpc2libGVXaWR0aDtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEJlaGF2aW9yIEFjY2Vzc29yc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpdGVtcyBtYXJrZWQgYXMgc2VsZWN0ZWQuXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheTxFbGVtZW50Pn1cbiAgICovXG4gIGdldCBzZWxlY3RlZEl0ZW1zKCkge1xuICAgIHJldHVybiB0aGlzLl9iZWhhdmlvciA/IHRoaXMuX2JlaGF2aW9yLnNlbGVjdGVkSXRlbXMgOiBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrIGl0ZW0ocykgYXMgc2VsZWN0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W119ICRpdGVtc1xuICAgKi9cbiAgc2VsZWN0KC4uLiRpdGVtcykge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3IpIHsgcmV0dXJuOyB9XG4gICAgaWYgKCEkaXRlbXMubGVuZ3RoKSB7ICRpdGVtcyA9IHRoaXMuXyRpdGVtRGF0YU1hcC5rZXlzKCk7IH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheSgkaXRlbXNbMF0pKSB7ICRpdGVtcyA9ICRpdGVtc1swXTsgfVxuXG4gICAgZm9yIChsZXQgJGl0ZW0gb2YgJGl0ZW1zKSB7XG4gICAgICBjb25zdCBkYXR1bSA9IHRoaXMuXyRpdGVtRGF0YU1hcC5nZXQoJGl0ZW0pO1xuICAgICAgdGhpcy5fYmVoYXZpb3Iuc2VsZWN0KCRpdGVtLCBkYXR1bSk7XG4gICAgICB0aGlzLl90b0Zyb250KCRpdGVtKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBpdGVtKHMpIGZyb20gc2VsZWN0ZWQgaXRlbXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W119ICRpdGVtc1xuICAgKi9cbiAgdW5zZWxlY3QoLi4uJGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHsgJGl0ZW1zID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmtleXMoKTsgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KCRpdGVtc1swXSkpIHsgJGl0ZW1zID0gJGl0ZW1zWzBdOyB9XG5cbiAgICBmb3IgKGxldCAkaXRlbSBvZiAkaXRlbXMpIHtcbiAgICAgIGNvbnN0IGRhdHVtID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmdldCgkaXRlbSk7XG4gICAgICB0aGlzLl9iZWhhdmlvci51bnNlbGVjdCgkaXRlbSwgZGF0dW0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgaXRlbShzKSBzZWxlY3Rpb24gc3RhdGUgYWNjb3JkaW5nIHRvIHRoZWlyIGN1cnJlbnQgc3RhdGUuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W119ICRpdGVtc1xuICAgKi9cbiAgdG9nZ2xlU2VsZWN0aW9uKC4uLiRpdGVtcykge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3IpIHsgcmV0dXJuOyB9XG4gICAgaWYgKCEkaXRlbXMubGVuZ3RoKSB7ICRpdGVtcyA9IHRoaXMuXyRpdGVtRGF0YU1hcC5rZXlzKCk7IH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheSgkaXRlbXNbMF0pKSB7ICRpdGVtcyA9ICRpdGVtc1swXTsgfVxuXG4gICAgZm9yIChsZXQgJGl0ZW0gb2YgJGl0ZW1zKSB7XG4gICAgICBjb25zdCBkYXR1bSA9IHRoaXMuXyRpdGVtRGF0YU1hcC5nZXQoJGl0ZW0pO1xuICAgICAgdGhpcy5fYmVoYXZpb3IudG9nZ2xlU2VsZWN0aW9uKCRpdGVtLCBkYXR1bSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVkaXQgaXRlbShzKSBhY2NvcmRpbmcgdG8gdGhlIGBlZGl0YCBkZWZpbmVkIGluIHRoZSByZWdpc3RlcmVkIGBCZWhhdmlvcmAuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W119ICRpdGVtcyAtIEl0ZW0ocykgdG8gZWRpdFxuICAgKiBAcGFyYW0ge051bWJlcn0gZHggLSBNb2RpZmljYXRpb24gdG8gYXBwbHkgaW4gdGhlIHggYXhpcyAoaW4gcGl4ZWwgZG9tYWluKVxuICAgKiBAcGFyYW0ge051bWJlcn0gZHkgLSBNb2RpZmljYXRpb24gdG8gYXBwbHkgaW4gdGhlIHkgYXhpcyAoaW4gcGl4ZWwgZG9tYWluKVxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICR0YXJnZXQgLSBUYXJnZXQgb2YgdGhlIGludGVyYWN0aW9uIChmb3IgZXhhbXBsZSwgbGVmdFxuICAgKiAgaGFuZGxlciBET00gZWxlbWVudCBpbiBhIHNlZ21lbnQpLlxuICAgKi9cbiAgZWRpdCgkaXRlbXMsIGR4LCBkeSwgJHRhcmdldCkge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3IpIHsgcmV0dXJuOyB9XG4gICAgJGl0ZW1zID0gIUFycmF5LmlzQXJyYXkoJGl0ZW1zKSA/IFskaXRlbXNdIDogJGl0ZW1zO1xuXG4gICAgZm9yIChsZXQgJGl0ZW0gb2YgJGl0ZW1zKSB7XG4gICAgICBjb25zdCBzaGFwZSA9IHRoaXMuXyRpdGVtU2hhcGVNYXAuZ2V0KCRpdGVtKTtcbiAgICAgIGNvbnN0IGRhdHVtID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmdldCgkaXRlbSk7XG5cbiAgICAgIHRoaXMuX2JlaGF2aW9yLmVkaXQodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksICR0YXJnZXQpO1xuICAgICAgdGhpcy5lbWl0KCdlZGl0Jywgc2hhcGUsIGRhdHVtKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBpZiB0aGUgYExheWVyYCwgYW5kIHRodXMgdGhlIGBMYXllclRpbWVDb250ZXh0YCBpcyBlZGl0YWJsZSBvciBub3QuXG4gICAqXG4gICAqIEBwYXJhbXMge0Jvb2xlYW59IFtib29sPXRydWVdXG4gICAqL1xuICBzZXRDb250ZXh0RWRpdGFibGUoYm9vbCA9IHRydWUpIHtcbiAgICBjb25zdCBkaXNwbGF5ID0gYm9vbCA/ICdibG9jaycgOiAnbm9uZSc7XG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xuICAgIHRoaXMuX2lzQ29udGV4dEVkaXRhYmxlID0gYm9vbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBFZGl0IHRoZSBsYXllciBhbmQgdGh1cyBpdHMgcmVsYXRlZCBgTGF5ZXJUaW1lQ29udGV4dGAgYXR0cmlidXRlcy5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR4IC0gVGhlIG1vZGlmaWNhdGlvbiB0byBhcHBseSBpbiB0aGUgeCBheGlzIChpbiBwaXhlbHMpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHkgLSBUaGUgbW9kaWZpY2F0aW9uIHRvIGFwcGx5IGluIHRoZSB5IGF4aXMgKGluIHBpeGVscykuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJHRhcmdldCAtIFRoZSB0YXJnZXQgb2YgdGhlIGV2ZW50IG9mIHRoZSBpbnRlcmFjdGlvbi5cbiAgICovXG4gIGVkaXRDb250ZXh0KGR4LCBkeSwgJHRhcmdldCkge1xuICAgIHRpbWVDb250ZXh0QmVoYXZpb3IuZWRpdCh0aGlzLCBkeCwgZHksICR0YXJnZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0cmV0Y2ggdGhlIGxheWVyIGFuZCB0aHVzIGl0cyByZWxhdGVkIGBMYXllclRpbWVDb250ZXh0YCBhdHRyaWJ1dGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHggLSBUaGUgbW9kaWZpY2F0aW9uIHRvIGFwcGx5IGluIHRoZSB4IGF4aXMgKGluIHBpeGVscykuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkeSAtIFRoZSBtb2RpZmljYXRpb24gdG8gYXBwbHkgaW4gdGhlIHkgYXhpcyAoaW4gcGl4ZWxzKS5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkdGFyZ2V0IC0gVGhlIHRhcmdldCBvZiB0aGUgZXZlbnQgb2YgdGhlIGludGVyYWN0aW9uLlxuICAgKi9cbiAgc3RyZXRjaENvbnRleHQoZHgsIGR5LCAkdGFyZ2V0KSB7XG4gICAgdGltZUNvbnRleHRCZWhhdmlvci5zdHJldGNoKHRoaXMsIGR4LCBkeSwgJHRhcmdldCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBIZWxwZXJzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gaXRlbSBmcm9tIGEgRE9NIGVsZW1lbnQgcmVsYXRlZCB0byB0aGUgc2hhcGUsIG51bGwgb3RoZXJ3aXNlLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIHRoZSBlbGVtZW50IHRvIGJlIHRlc3RlZFxuICAgKiBAcmV0dXJuIHtFbGVtZW50fG51bGx9XG4gICAqL1xuICBnZXRJdGVtRnJvbURPTUVsZW1lbnQoJGVsKSB7XG4gICAgbGV0ICRpdGVtO1xuXG4gICAgZG8ge1xuICAgICAgaWYgKCRlbC5jbGFzc0xpc3QgJiYgJGVsLmNsYXNzTGlzdC5jb250YWlucygnaXRlbScpKSB7XG4gICAgICAgICRpdGVtID0gJGVsO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgJGVsID0gJGVsLnBhcmVudE5vZGU7XG4gICAgfSB3aGlsZSAoJGVsICE9PSBudWxsKTtcblxuICAgIHJldHVybiB0aGlzLmhhc0l0ZW0oJGl0ZW0pID8gJGl0ZW0gOsKgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzaGFwZSBhc3NvY2lhdGVkIHRvIGEgc3BlY2lmaWMgaXRlbS5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkaXRlbVxuICAgKiBAcmV0dXJuIHtTaGFwZX1cbiAgICovXG4gIGdldFNoYXBlRnJvbUl0ZW0oJGl0ZW0pIHtcbiAgICByZXR1cm4gdGhpcy5oYXNJdGVtKCRpdGVtKSA/IHRoaXMuXyRpdGVtU2hhcGVNYXAuZ2V0KCRpdGVtKSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc2hhcGUgYXNzb2NpYXRlZCB0byBhIHNwZWNpZmljIGl0ZW0gZnJvbSBhbnkgRE9NIGVsZW1lbnRcbiAgICogY29tcG9zaW5nIHRoZSBzaGFwZS5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkaXRlbVxuICAgKiBAcmV0dXJuIHtTaGFwZX1cbiAgICovXG4gIGdldFNoYXBlRnJvbURPTUVsZW1lbnQoJGVsKSB7XG4gICAgY29uc3QgJGl0ZW0gPSB0aGlzLmdldEl0ZW1Gcm9tRE9NRWxlbWVudCgkZWwpO1xuICAgIHJldHVybiB0aGlzLmdldFNoYXBlRnJvbUl0ZW0oJGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRhdHVtIGFzc29jaWF0ZWQgdG8gYSBzcGVjaWZpYyBpdGVtLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRpdGVtXG4gICAqIEByZXR1cm4ge09iamVjdHxBcnJheXxudWxsfVxuICAgKi9cbiAgZ2V0RGF0dW1Gcm9tSXRlbSgkaXRlbSkge1xuICAgIGNvbnN0IGRhdHVtID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmdldCgkaXRlbSk7XG4gICAgcmV0dXJuIGRhdHVtID8gZGF0dW0gOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRhdHVtIGFzc29jaWF0ZWQgdG8gYSBzcGVjaWZpYyBpdGVtIGZyb20gYW55IERPTSBlbGVtZW50XG4gICAqIGNvbXBvc2luZyB0aGUgc2hhcGUuIEJhc2ljYWxseSBhIHNob3J0Y3V0IGZvciBgZ2V0SXRlbUZyb21ET01FbGVtZW50YCBhbmRcbiAgICogYGdldERhdHVtRnJvbUl0ZW1gIG1ldGhvZHMuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsXG4gICAqIEByZXR1cm4ge09iamVjdHxBcnJheXxudWxsfVxuICAgKi9cbiAgZ2V0RGF0dW1Gcm9tRE9NRWxlbWVudCgkZWwpIHtcbiAgICBjb25zdCAkaXRlbSA9IHRoaXMuZ2V0SXRlbUZyb21ET01FbGVtZW50KCRlbCk7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RGF0dW1Gcm9tSXRlbSgkaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogVGVzdHMgaWYgdGhlIGdpdmVuIERPTSBlbGVtZW50IGlzIGFuIGl0ZW0gb2YgdGhlIGxheWVyLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRpdGVtIC0gVGhlIGl0ZW0gdG8gYmUgdGVzdGVkLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgaGFzSXRlbSgkaXRlbSkge1xuICAgIHJldHVybiB0aGlzLl8kaXRlbURhdGFNYXAuaGFzKCRpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGlmIGEgZ2l2ZW4gZWxlbWVudCBiZWxvbmdzIHRvIHRoZSBsYXllci4gSXMgbW9yZSBnZW5lcmFsIHRoYW5cbiAgICogYGhhc0l0ZW1gLCBjYW4gbW9zdGx5IHVzZWQgdG8gY2hlY2sgaW50ZXJhY3Rpb25zIGVsZW1lbnRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIFRoZSBET00gZWxlbWVudCB0byBiZSB0ZXN0ZWQuXG4gICAqIEByZXR1cm4ge2Jvb2x9XG4gICAqL1xuICBoYXNFbGVtZW50KCRlbCkge1xuICAgIGRvIHtcbiAgICAgIGlmICgkZWwgPT09IHRoaXMuJGVsKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAkZWwgPSAkZWwucGFyZW50Tm9kZTtcbiAgICB9IHdoaWxlICgkZWwgIT09IG51bGwpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGFsbCB0aGUgaXRlbXMgaW4gYSBnaXZlbiBhcmVhIGFzIGRlZmluZWQgaW4gdGhlIHJlZ2lzdGVyZWQgYFNoYXBlfmluQXJlYWAgbWV0aG9kLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXJlYSAtIFRoZSBhcmVhIGluIHdoaWNoIHRvIGZpbmQgdGhlIGVsZW1lbnRzXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhcmVhLnRvcFxuICAgKiBAcGFyYW0ge051bWJlcn0gYXJlYS5sZWZ0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhcmVhLndpZHRoXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhcmVhLmhlaWdodFxuICAgKiBAcmV0dXJuIHtBcnJheX0gLSBsaXN0IG9mIHRoZSBpdGVtcyBwcmVzZW50cyBpbiB0aGUgYXJlYVxuICAgKi9cbiAgZ2V0SXRlbXNJbkFyZWEoYXJlYSkge1xuICAgIGNvbnN0IHN0YXJ0ICAgID0gdGhpcy50aW1lQ29udGV4dC5wYXJlbnQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5zdGFydCk7XG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24pO1xuICAgIGNvbnN0IG9mZnNldCAgID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCk7XG4gICAgY29uc3QgdG9wICAgICAgPSB0aGlzLl90b3A7XG4gICAgLy8gYmUgYXdhcmUgYWYgY29udGV4dCdzIHRyYW5zbGF0aW9ucyAtIGNvbnN0cmFpbiBpbiB3b3JraW5nIHZpZXdcbiAgICBsZXQgeDEgPSBNYXRoLm1heChhcmVhLmxlZnQsIHN0YXJ0KTtcbiAgICBsZXQgeDIgPSBNYXRoLm1pbihhcmVhLmxlZnQgKyBhcmVhLndpZHRoLCBzdGFydCArIGR1cmF0aW9uKTtcbiAgICB4MSAtPSAoc3RhcnQgKyBvZmZzZXQpO1xuICAgIHgyIC09IChzdGFydCArIG9mZnNldCk7XG4gICAgLy8ga2VlcCBjb25zaXN0ZW50IHdpdGggY29udGV4dCB5IGNvb3JkaW5hdGVzIHN5c3RlbVxuICAgIGxldCB5MSA9IHRoaXMuX2hlaWdodCAtIChhcmVhLnRvcCArIGFyZWEuaGVpZ2h0KTtcbiAgICBsZXQgeTIgPSB0aGlzLl9oZWlnaHQgLSBhcmVhLnRvcDtcblxuICAgIHkxICs9IHRoaXMuX3RvcDtcbiAgICB5MiArPSB0aGlzLl90b3A7XG5cbiAgICBjb25zdCAkZmlsdGVyZWRJdGVtcyA9IFtdO1xuXG4gICAgZm9yIChsZXQgWyRpdGVtLCBkYXR1bV0gb2YgdGhpcy5fJGl0ZW1EYXRhTWFwLmVudHJpZXMoKSkge1xuICAgICAgY29uc3Qgc2hhcGUgPSB0aGlzLl8kaXRlbVNoYXBlTWFwLmdldCgkaXRlbSk7XG4gICAgICBjb25zdCBpbkFyZWEgPSBzaGFwZS5pbkFyZWEodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKTtcblxuICAgICAgaWYgKGluQXJlYSkgeyAkZmlsdGVyZWRJdGVtcy5wdXNoKCRpdGVtKTsgfVxuICAgIH1cblxuICAgIHJldHVybiAkZmlsdGVyZWRJdGVtcztcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyAvIERpc3BsYXkgbWV0aG9kc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBNb3ZlcyBhbiBpdGVtIHRvIHRoZSBlbmQgb2YgdGhlIGxheWVyIHRvIGRpc3BsYXkgaXQgZnJvbnQgb2YgaXRzXG4gICAqIHNpYmxpbmdzIChzdmcgei1pbmRleC4uLikuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGl0ZW0gLSBUaGUgaXRlbSB0byBiZSBtb3ZlZC5cbiAgICovXG4gIF90b0Zyb250KCRpdGVtKSB7XG4gICAgdGhpcy4kb2Zmc2V0LmFwcGVuZENoaWxkKCRpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIERPTSBzdHJ1Y3R1cmUgb2YgdGhlIHNoYXBlcyBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIGRhdGEuIEluc3BpcmVkXG4gICAqIGZyb20gdGhlIGBlbnRlcmAgYW5kIGBleGl0YCBkMy5qcyBwYXJhZGlnbSwgdGhpcyBtZXRob2Qgc2hvdWxkIGJlIGNhbGxlZFxuICAgKiBlYWNoIHRpbWUgYSBkYXR1bSBpcyBhZGRlZCBvciByZW1vdmVkIGZyb20gdGhlIGRhdGEuIFdoaWxlIHRoZSBET00gaXNcbiAgICogY3JlYXRlZCB0aGUgYHVwZGF0ZWAgbWV0aG9kIG11c3QgYmUgY2FsbGVkIGluIG9yZGVyIHRvIHVwZGF0ZSB0aGUgc2hhcGVzXG4gICAqIGF0dHJpYnV0ZXMgYW5kIHRodXMgcGxhY2UgdGhlbSB3aGVyZSB0aGV5IHNob3VsZC5cbiAgICovXG4gIHJlbmRlcigpIHtcbiAgICAvLyByZW5kZXIgYGNvbW1vblNoYXBlYCBvbmx5IG9uY2VcbiAgICBpZiAoXG4gICAgICB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb24gIT09IG51bGwgJiZcbiAgICAgIHRoaXMuXyRpdGVtQ29tbW9uU2hhcGVNYXAuc2l6ZSA9PT0gMFxuICAgICkge1xuICAgICAgY29uc3QgeyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfSA9IHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbjtcbiAgICAgIGNvbnN0ICRncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAgIGNvbnN0IHNoYXBlID0gbmV3IGN0b3Iob3B0aW9ucyk7XG5cbiAgICAgIHNoYXBlLmluc3RhbGwoYWNjZXNzb3JzKTtcbiAgICAgICRncm91cC5hcHBlbmRDaGlsZChzaGFwZS5yZW5kZXIoKSk7XG4gICAgICAkZ3JvdXAuY2xhc3NMaXN0LmFkZCgnaXRlbScsICdjb21tb24nLCBzaGFwZS5nZXRDbGFzc05hbWUoKSk7XG5cbiAgICAgIHRoaXMuXyRpdGVtQ29tbW9uU2hhcGVNYXAuc2V0KCRncm91cCwgc2hhcGUpO1xuICAgICAgdGhpcy4kb2Zmc2V0LmFwcGVuZENoaWxkKCRncm91cCk7XG4gICAgfVxuXG4gICAgLy8gYXBwZW5kIGVsZW1lbnRzIGFsbCBhdCBvbmNlXG4gICAgY29uc3QgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5fJGl0ZW1EYXRhTWFwLnZhbHVlcygpOyAvLyBpdGVyYXRvclxuXG4gICAgLy8gZW50ZXJcbiAgICB0aGlzLmRhdGEuZm9yRWFjaCgoZGF0dW0pID0+IHtcbiAgICAgIGZvciAobGV0IHZhbHVlIG9mIHZhbHVlcykgeyBpZiAodmFsdWUgPT09IGRhdHVtKSB7IHJldHVybjsgfSB9XG5cbiAgICAgIGNvbnN0IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH0gPSB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb247XG4gICAgICBjb25zdCBzaGFwZSA9IG5ldyBjdG9yKG9wdGlvbnMpO1xuICAgICAgc2hhcGUuaW5zdGFsbChhY2Nlc3NvcnMpO1xuXG4gICAgICBjb25zdCAkZWwgPSBzaGFwZS5yZW5kZXIodGhpcy5fcmVuZGVyaW5nQ29udGV4dCk7XG4gICAgICAkZWwuY2xhc3NMaXN0LmFkZCgnaXRlbScsIHNoYXBlLmdldENsYXNzTmFtZSgpKTtcblxuICAgICAgdGhpcy5fJGl0ZW1TaGFwZU1hcC5zZXQoJGVsLCBzaGFwZSk7XG4gICAgICB0aGlzLl8kaXRlbURhdGFNYXAuc2V0KCRlbCwgZGF0dW0pO1xuXG4gICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCgkZWwpO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kb2Zmc2V0LmFwcGVuZENoaWxkKGZyYWdtZW50KTtcblxuICAgIC8vIHJlbW92ZVxuICAgIGZvciAobGV0IFskaXRlbSwgZGF0dW1dIG9mIHRoaXMuXyRpdGVtRGF0YU1hcC5lbnRyaWVzKCkpIHtcbiAgICAgIGlmICh0aGlzLmRhdGEuaW5kZXhPZihkYXR1bSkgIT09IC0xKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fJGl0ZW1TaGFwZU1hcC5nZXQoJGl0ZW0pO1xuXG4gICAgICB0aGlzLiRvZmZzZXQucmVtb3ZlQ2hpbGQoJGl0ZW0pO1xuICAgICAgc2hhcGUuZGVzdHJveSgpO1xuICAgICAgLy8gYSByZW1vdmVkIGl0ZW0gY2Fubm90IGJlIHNlbGVjdGVkXG4gICAgICBpZiAodGhpcy5fYmVoYXZpb3IpIHtcbiAgICAgICAgdGhpcy5fYmVoYXZpb3IudW5zZWxlY3QoJGl0ZW0sIGRhdHVtKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fJGl0ZW1EYXRhTWFwLmRlbGV0ZSgkaXRlbSk7XG4gICAgICB0aGlzLl8kaXRlbVNoYXBlTWFwLmRlbGV0ZSgkaXRlbSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGNvbnRhaW5lciBvZiB0aGUgbGF5ZXIgYW5kIHRoZSBhdHRyaWJ1dGVzIG9mIHRoZSBleGlzdGluZyBzaGFwZXMuXG4gICAqL1xuICB1cGRhdGUoKSB7XG4gICAgdGhpcy51cGRhdGVDb250YWluZXIoKTtcbiAgICB0aGlzLnVwZGF0ZVNoYXBlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGNvbnRhaW5lciBvZiB0aGUgbGF5ZXIuXG4gICAqL1xuICB1cGRhdGVDb250YWluZXIoKSB7XG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpO1xuXG4gICAgY29uc3QgdGltZUNvbnRleHQgPSB0aGlzLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IHdpZHRoICA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRpbWVDb250ZXh0LmR1cmF0aW9uKTtcbiAgICAvLyB4IGlzIHJlbGF0aXZlIHRvIHRpbWVsaW5lJ3MgdGltZUNvbnRleHRcbiAgICBjb25zdCB4ID0gdGltZUNvbnRleHQucGFyZW50LnRpbWVUb1BpeGVsKHRpbWVDb250ZXh0LnN0YXJ0KTtcbiAgICBjb25zdCBvZmZzZXQgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aW1lQ29udGV4dC5vZmZzZXQpO1xuICAgIGNvbnN0IHRvcCA9IHRoaXMuX3RvcDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLl9oZWlnaHQ7XG4gICAgLy8gbWF0cml4IHRvIGludmVydCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICBjb25zdCB0cmFuc2xhdGVNYXRyaXggPSBgbWF0cml4KDEsIDAsIDAsIC0xLCAke3h9LCAke3RvcCArIGhlaWdodH0pYDtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlTWF0cml4KTtcbiAgICAvLyB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3h9LCAke3RvcH0pYCk7XG5cbiAgICB0aGlzLiRib3VuZGluZ0JveC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG5cbiAgICB0aGlzLiRvZmZzZXQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHtvZmZzZXR9LCAwKWApO1xuICAgIC8vIG1haW50YWluIGNvbnRleHQgc2hhcGVcbiAgICB0aGlzLmNvbnRleHRTaGFwZS51cGRhdGUodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgdGhpcy50aW1lQ29udGV4dCwgMCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgYXR0cmlidXRlcyBvZiBhbGwgdGhlIGBTaGFwZWAgaW5zdGFuY2VzIHJlbmRlcmVkIGludG8gdGhlIGxheWVyLlxuICAgKlxuICAgKiBAdG9kbyAtIGFsbG93IHRvIGZpbHRlciB3aGljaCBzaGFwZShzKSBzaG91bGQgYmUgdXBkYXRlZC5cbiAgICovXG4gIHVwZGF0ZVNoYXBlcygpIHtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCk7XG4gICAgLy8gdXBkYXRlIGNvbW1vbiBzaGFwZXNcbiAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwLmZvckVhY2goKHNoYXBlLCAkaXRlbSkgPT4ge1xuICAgICAgc2hhcGUudXBkYXRlKHRoaXMuX3JlbmRlcmluZ0NvbnRleHQsIHRoaXMuZGF0YSk7XG4gICAgfSk7XG5cbiAgICBmb3IgKGxldCBbJGl0ZW0sIGRhdHVtXSBvZiB0aGlzLl8kaXRlbURhdGFNYXAuZW50cmllcygpKSB7XG4gICAgICBjb25zdCBzaGFwZSA9IHRoaXMuXyRpdGVtU2hhcGVNYXAuZ2V0KCRpdGVtKTtcbiAgICAgIHNoYXBlLnVwZGF0ZSh0aGlzLl9yZW5kZXJpbmdDb250ZXh0LCBkYXR1bSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExheWVyO1xuIl19