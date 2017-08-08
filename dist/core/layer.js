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

var _events2 = _interopRequireDefault(_events);

var _namespace = require('./namespace');

var _namespace2 = _interopRequireDefault(_namespace);

var _scales = require('../utils/scales');

var _scales2 = _interopRequireDefault(_scales);

var _segment = require('../shapes/segment');

var _segment2 = _interopRequireDefault(_segment);

var _baseShape = require('../shapes/base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

var _timeContextBehavior = require('../behaviors/time-context-behavior');

var _timeContextBehavior2 = _interopRequireDefault(_timeContextBehavior);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// time context bahevior
var timeContextBehavior = null;
var timeContextBehaviorCtor = _timeContextBehavior2.default;

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

var Layer = function (_events$EventEmitter) {
  (0, _inherits3.default)(Layer, _events$EventEmitter);

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
      overflow: 'hidden' // usefull ?
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

    _this._valueToPixel = _scales2.default.linear().domain(_this.params.yDomain).range([0, _this._height]);

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
      this.contextShape = new _segment2.default();
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

      this._renderingContext.height = this._height;
      this._renderingContext.width = this.timeContext.timeToPixel(this.timeContext.duration);
      // for foreign object issue in chrome
      this._renderingContext.offsetX = this.timeContext.timeToPixel(this.timeContext.offset);
      this._renderingContext.startX = this.timeContext.parent.timeToPixel(this.timeContext.start);

      // @todo replace with `minX` and `maxX` representing the visible pixels in which
      // the shapes should be rendered, could allow to not update the DOM of shapes
      // who are not in this area.
      this._renderingContext.trackOffsetX = this.timeContext.parent.timeToPixel(this.timeContext.parent.offset);
      this._renderingContext.visibleWidth = this.timeContext.parent.visibleWidth;
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
}(_events2.default.EventEmitter);

exports.default = Layer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxheWVyLmpzIl0sIm5hbWVzIjpbInRpbWVDb250ZXh0QmVoYXZpb3IiLCJ0aW1lQ29udGV4dEJlaGF2aW9yQ3RvciIsIkxheWVyIiwiZGF0YVR5cGUiLCJkYXRhIiwib3B0aW9ucyIsImRlZmF1bHRzIiwiaGVpZ2h0IiwidG9wIiwib3BhY2l0eSIsInlEb21haW4iLCJjbGFzc05hbWUiLCJzZWxlY3RlZENsYXNzTmFtZSIsImNvbnRleHRIYW5kbGVyV2lkdGgiLCJoaXR0YWJsZSIsImlkIiwib3ZlcmZsb3ciLCJwYXJhbXMiLCJ0aW1lQ29udGV4dCIsIiRlbCIsIiRiYWNrZ3JvdW5kIiwiJGJvdW5kaW5nQm94IiwiJG9mZnNldCIsIiRpbnRlcmFjdGlvbnMiLCJjb250ZXh0U2hhcGUiLCJfc2hhcGVDb25maWd1cmF0aW9uIiwiX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiIsIl8kaXRlbVNoYXBlTWFwIiwiXyRpdGVtRGF0YU1hcCIsIl8kaXRlbUNvbW1vblNoYXBlTWFwIiwiX2lzQ29udGV4dEVkaXRhYmxlIiwiX2JlaGF2aW9yIiwiX2hlaWdodCIsIl90b3AiLCJfdmFsdWVUb1BpeGVsIiwibGluZWFyIiwiZG9tYWluIiwicmFuZ2UiLCJfcmVuZGVyQ29udGFpbmVyIiwiY2xlYXIiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJwcmV2VHJhY2tIZWlnaHQiLCJuZXdUcmFja0hlaWdodCIsInJhdGlvIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50TlMiLCJjbGFzc0xpc3QiLCJhZGQiLCJzdHlsZSIsInNldEF0dHJpYnV0ZU5TIiwiZmlsbE9wYWNpdHkiLCJwb2ludGVyRXZlbnRzIiwiZGlzcGxheSIsImluc3RhbGwiLCJjb2xvciIsIndpZHRoIiwiZHVyYXRpb24iLCJfcmVuZGVyaW5nQ29udGV4dCIsInZhbHVlVG9QaXhlbCIsInkiLCJhcHBlbmRDaGlsZCIsInJlbmRlciIsIl91cGRhdGVSZW5kZXJpbmdDb250ZXh0IiwiY3RvciIsImFjY2Vzc29ycyIsImJlaGF2aW9yIiwiaW5pdGlhbGl6ZSIsInRpbWVUb1BpeGVsIiwib2Zmc2V0WCIsIm9mZnNldCIsInN0YXJ0WCIsInBhcmVudCIsInN0YXJ0IiwidHJhY2tPZmZzZXRYIiwidmlzaWJsZVdpZHRoIiwiJGl0ZW1zIiwibGVuZ3RoIiwia2V5cyIsIkFycmF5IiwiaXNBcnJheSIsIiRpdGVtIiwiZGF0dW0iLCJnZXQiLCJzZWxlY3QiLCJfdG9Gcm9udCIsInVuc2VsZWN0IiwidG9nZ2xlU2VsZWN0aW9uIiwiZHgiLCJkeSIsIiR0YXJnZXQiLCJzaGFwZSIsImVkaXQiLCJlbWl0IiwiYm9vbCIsInN0cmV0Y2giLCJjb250YWlucyIsInBhcmVudE5vZGUiLCJoYXNJdGVtIiwiZ2V0SXRlbUZyb21ET01FbGVtZW50IiwiZ2V0U2hhcGVGcm9tSXRlbSIsImdldERhdHVtRnJvbUl0ZW0iLCJoYXMiLCJhcmVhIiwieDEiLCJNYXRoIiwibWF4IiwibGVmdCIsIngyIiwibWluIiwieTEiLCJ5MiIsIiRmaWx0ZXJlZEl0ZW1zIiwiZW50cmllcyIsImluQXJlYSIsInB1c2giLCJzaXplIiwiJGdyb3VwIiwiZ2V0Q2xhc3NOYW1lIiwic2V0IiwiZnJhZ21lbnQiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50IiwidmFsdWVzIiwiZm9yRWFjaCIsInZhbHVlIiwiaW5kZXhPZiIsInJlbW92ZUNoaWxkIiwiZGVzdHJveSIsImRlbGV0ZSIsInVwZGF0ZUNvbnRhaW5lciIsInVwZGF0ZVNoYXBlcyIsIngiLCJ0cmFuc2xhdGVNYXRyaXgiLCJ1cGRhdGUiLCJzdHJldGNoUmF0aW8iLCJfZGF0YSIsInNlbGVjdGVkSXRlbXMiLCJFdmVudEVtaXR0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBO0FBQ0EsSUFBSUEsc0JBQXNCLElBQTFCO0FBQ0EsSUFBSUMsdURBQUo7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QVA7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBS1c7QUFBRSxhQUFPLEtBQUt5RCxLQUFaO0FBQW9COztBQUVqQzs7Ozs7O3NCQUtTbEksSSxFQUFNO0FBQ2IsY0FBUSxLQUFLRCxRQUFiO0FBQ0UsYUFBSyxRQUFMO0FBQ0UsY0FBSSxLQUFLbUksS0FBVCxFQUFnQjtBQUFHO0FBQ2pCLGlCQUFLQSxLQUFMLENBQVcsQ0FBWCxJQUFnQmxJLElBQWhCO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsaUJBQUtrSSxLQUFMLEdBQWEsQ0FBQ2xJLElBQUQsQ0FBYjtBQUNEO0FBQ0Q7QUFDRixhQUFLLFlBQUw7QUFDRSxlQUFLa0ksS0FBTCxHQUFhbEksSUFBYjtBQUNBO0FBVko7QUFZRDs7O3dCQTZJbUI7QUFDbEIsYUFBTyxLQUFLMkIsU0FBTCxHQUFpQixLQUFLQSxTQUFMLENBQWV3RyxhQUFoQyxHQUFnRCxFQUF2RDtBQUNEOzs7aURBcFRtQ3hFLEksRUFBTTtBQUN4QzlELGdDQUEwQjhELElBQTFCO0FBQ0Q7OztFQW5IZ0MsaUJBQU95RSxZOztrQkFBckJ0SSxLIiwiZmlsZSI6ImxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV2ZW50cyBmcm9tICdldmVudHMnO1xuaW1wb3J0IG5zIGZyb20gJy4vbmFtZXNwYWNlJztcbmltcG9ydCBzY2FsZXMgZnJvbSAnLi4vdXRpbHMvc2NhbGVzJztcbmltcG9ydCBTZWdtZW50IGZyb20gJy4uL3NoYXBlcy9zZWdtZW50JztcbmltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi4vc2hhcGVzL2Jhc2Utc2hhcGUnO1xuaW1wb3J0IFRpbWVDb250ZXh0QmVoYXZpb3IgZnJvbSAnLi4vYmVoYXZpb3JzL3RpbWUtY29udGV4dC1iZWhhdmlvcic7XG5cbi8vIHRpbWUgY29udGV4dCBiYWhldmlvclxubGV0IHRpbWVDb250ZXh0QmVoYXZpb3IgPSBudWxsO1xubGV0IHRpbWVDb250ZXh0QmVoYXZpb3JDdG9yID0gVGltZUNvbnRleHRCZWhhdmlvcjtcblxuLyoqXG4gKiBUaGUgbGF5ZXIgY2xhc3MgaXMgdGhlIG1haW4gdmlzdWFsaXphdGlvbiBjbGFzcy4gSXQgaXMgbWFpbmx5IGRlZmluZXMgYnkgaXRzXG4gKiByZWxhdGVkIGBMYXllclRpbWVDb250ZXh0YCB3aGljaCBkZXRlcm1pbmVzIGl0cyBwb3NpdGlvbiBpbiB0aGUgb3ZlcmFsbFxuICogdGltZWxpbmUgKHRocm91Z2ggdGhlIGBzdGFydGAsIGBkdXJhdGlvbmAsIGBvZmZzZXRgIGFuZCBgc3RyZXRjaFJhdGlvYFxuICogYXR0cmlidXRlcykgYW5kIGJ5IGl0J3MgcmVnaXN0ZXJlZCBTaGFwZSB3aGljaCBkZWZpbmVzIGhvdyB0byBkaXNwbGF5IHRoZVxuICogZGF0YSBhc3NvY2lhdGVkIHRvIHRoZSBsYXllci4gRWFjaCBjcmVhdGVkIGxheWVyIG11c3QgYmUgaW5zZXJ0ZWQgaW50byBhXG4gKiBgVHJhY2tgIGluc3RhbmNlIGluIG9yZGVyIHRvIGJlIGRpc3BsYXllZC5cbiAqXG4gKiBfTm90ZTogaW4gdGhlIGNvbnRleHQgb2YgdGhlIGxheWVyLCBhbiBfX2l0ZW1fXyBpcyB0aGUgU1ZHIGVsZW1lbnRcbiAqIHJldHVybmVkIGJ5IGEgYFNoYXBlYCBpbnN0YW5jZSBhbmQgYXNzb2NpYXRlZCB3aXRoIGEgcGFydGljdWxhciBfX2RhdHVtX18uX1xuICpcbiAqICMjIyBMYXllciBET00gc3RydWN0dXJlXG4gKiBgYGBcbiAqIDxnIGNsYXNzPVwibGF5ZXJcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoJHtzdGFydH0sIDApXCI+XG4gKiAgIDxzdmcgY2xhc3M9XCJib3VuZGluZy1ib3hcIiB3aWR0aD1cIiR7ZHVyYXRpb259XCI+XG4gKiAgICAgPGcgY2xhc3M9XCJvZmZzZXRcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoJHtvZmZzZXQsIDB9KVwiPlxuICogICAgICAgPCEtLSBiYWNrZ3JvdW5kIC0tPlxuICogICAgICAgPHJlY3QgY2xhc3M9XCJiYWNrZ3JvdW5kXCI+PC9yZWN0PlxuICogICAgICAgPCEtLSBzaGFwZXMgYW5kIGNvbW1vbiBzaGFwZXMgYXJlIGluc2VydGVkIGhlcmUgLS0+XG4gKiAgICAgPC9nPlxuICogICAgIDxnIGNsYXNzPVwiaW50ZXJhY3Rpb25zXCI+PCEtLSBmb3IgZmVlZGJhY2sgLS0+PC9nPlxuICogICA8L3N2Zz5cbiAqIDwvZz5cbiAqIGBgYFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXllciBleHRlbmRzIGV2ZW50cy5FdmVudEVtaXR0ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGFUeXBlIC0gRGVmaW5lcyBob3cgdGhlIGxheWVyIHNob3VsZCBsb29rIGF0IHRoZSBkYXRhLlxuICAgKiAgICBDYW4gYmUgJ2VudGl0eScgb3IgJ2NvbGxlY3Rpb24nLlxuICAgKiBAcGFyYW0geyhBcnJheXxPYmplY3QpfSBkYXRhIC0gVGhlIGRhdGEgYXNzb2NpYXRlZCB0byB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQ29uZmlndXJlcyB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5oZWlnaHQ9MTAwXSAtIERlZmluZXMgdGhlIGhlaWdodCBvZiB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy50b3A9MF0gLSBEZWZpbmVzIHRoZSB0b3AgcG9zaXRpb24gb2YgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMub3BhY2l0eT0xXSAtIERlZmluZXMgdGhlIG9wYWNpdHkgb2YgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMueURvbWFpbj1bMCwxXV0gLSBEZWZpbmVzIGJvdW5kYXJpZXMgb2YgdGhlIGRhdGFcbiAgICogICAgdmFsdWVzIGluIHkgYXhpcyAoZm9yIGV4ZW1wbGUgdG8gZGlzcGxheSBhbiBhdWRpbyBidWZmZXIsIHRoaXMgYXR0cmlidXRlXG4gICAqICAgIHNob3VsZCBiZSBzZXQgdG8gWy0xLCAxXS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNsYXNzTmFtZT1udWxsXSAtIEFuIG9wdGlvbm5hbCBjbGFzcyB0byBhZGQgdG8gZWFjaFxuICAgKiAgICBjcmVhdGVkIHNoYXBlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY2xhc3NOYW1lPSdzZWxlY3RlZCddIC0gVGhlIGNsYXNzIHRvIGFkZCB0byBhIHNoYXBlXG4gICAqICAgIHdoZW4gc2VsZWN0ZWQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5jb250ZXh0SGFuZGxlcldpZHRoPTJdIC0gVGhlIHdpZHRoIG9mIHRoZSBoYW5kbGVyc1xuICAgKiAgICBkaXNwbGF5ZWQgdG8gZWRpdCB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5oaXR0YWJsZT1mYWxzZV0gLSBEZWZpbmVzIGlmIHRoZSBsYXllciBjYW4gYmUgaW50ZXJhY3RlZFxuICAgKiAgICB3aXRoLiBCYXNpY2FsbHksIHRoZSBsYXllciBpcyBub3QgcmV0dXJuZWQgYnkgYEJhc2VTdGF0ZS5nZXRIaXRMYXllcnNgIHdoZW5cbiAgICogICAgc2V0IHRvIGZhbHNlIChhIGNvbW1vbiB1c2UgY2FzZSBpcyBhIGxheWVyIHRoYXQgY29udGFpbnMgYSBjdXJzb3IpXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkYXRhVHlwZSwgZGF0YSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgaGVpZ2h0OiAxMDAsXG4gICAgICB0b3A6IDAsXG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgeURvbWFpbjogWzAsIDFdLFxuICAgICAgY2xhc3NOYW1lOiBudWxsLFxuICAgICAgc2VsZWN0ZWRDbGFzc05hbWU6ICdzZWxlY3RlZCcsXG4gICAgICBjb250ZXh0SGFuZGxlcldpZHRoOiAyLFxuICAgICAgaGl0dGFibGU6IHRydWUsIC8vIHdoZW4gZmFsc2UgdGhlIGxheWVyIGlzIG5vdCByZXR1cm5lZCBieSBgQmFzZVN0YXRlLmdldEhpdExheWVyc2BcbiAgICAgIGlkOiAnJywgLy8gdXNlZCA/XG4gICAgICBvdmVyZmxvdzogJ2hpZGRlbicsIC8vIHVzZWZ1bGwgP1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBQYXJhbWV0ZXJzIG9mIHRoZSBsYXllcnMsIGBkZWZhdWx0c2Agb3ZlcnJpZGVkIHdpdGggb3B0aW9ucy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIC8qKlxuICAgICAqIERlZmluZXMgaG93IHRoZSBsYXllciBzaG91bGQgbG9vayBhdCB0aGUgZGF0YSAoYCdlbnRpdHknYCBvciBgJ2NvbGxlY3Rpb24nYCkuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmRhdGFUeXBlID0gZGF0YVR5cGU7IC8vICdlbnRpdHknIHx8ICdjb2xsZWN0aW9uJztcbiAgICAvKiogQHR5cGUge0xheWVyVGltZUNvbnRleHR9ICovXG4gICAgdGhpcy50aW1lQ29udGV4dCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJGVsID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kYmFja2dyb3VuZCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJGJvdW5kaW5nQm94ID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kb2Zmc2V0ID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zID0gbnVsbDtcbiAgICAvKipcbiAgICAgKiBBIFNlZ21lbnQgaW5zdGFuY2lhdGVkIHRvIGludGVyYWN0IHdpdGggdGhlIExheWVyIGl0c2VsZi5cbiAgICAgKiBAdHlwZSB7U2VnbWVudH1cbiAgICAgKi9cbiAgICB0aGlzLmNvbnRleHRTaGFwZSA9IG51bGw7XG5cbiAgICB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb24gPSBudWxsOyAgICAgICAvLyB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9XG4gICAgdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uID0gbnVsbDsgLy8geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfVxuICAgIHRoaXMuXyRpdGVtU2hhcGVNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fJGl0ZW1EYXRhTWFwID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuXyRpdGVtQ29tbW9uU2hhcGVNYXAgPSBuZXcgTWFwKCk7XG5cbiAgICB0aGlzLl9pc0NvbnRleHRFZGl0YWJsZSA9IGZhbHNlO1xuICAgIHRoaXMuX2JlaGF2aW9yID0gbnVsbDtcblxuICAgIHRoaXMuX2hlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICB0aGlzLl90b3AgPSB0aGlzLnBhcmFtcy50b3A7XG5cbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuXG4gICAgdGhpcy5fdmFsdWVUb1BpeGVsID0gc2NhbGVzLmxpbmVhcigpXG4gICAgICAuZG9tYWluKHRoaXMucGFyYW1zLnlEb21haW4pXG4gICAgICAucmFuZ2UoWzAsIHRoaXMuX2hlaWdodF0pO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSB0aW1lQ29udGV4dCBsYXlvdXRcbiAgICB0aGlzLl9yZW5kZXJDb250YWluZXIoKTtcbiAgICAvLyBjcmVhdGVzIHRoZSB0aW1lQ29udGV4dEJlaGF2aW9yIGZvciBhbGwgbGF5ZXJzXG4gICAgaWYgKHRpbWVDb250ZXh0QmVoYXZpb3IgPT09IG51bGwpIHtcbiAgICAgIHRpbWVDb250ZXh0QmVoYXZpb3IgPSBuZXcgdGltZUNvbnRleHRCZWhhdmlvckN0b3IoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveSB0aGUgbGF5ZXIsIGNsZWFyIGFsbCByZWZlcmVuY2VzLlxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbnVsbDtcbiAgICB0aGlzLmRhdGEgPSBudWxsO1xuICAgIHRoaXMucGFyYW1zID0gbnVsbDtcbiAgICB0aGlzLl9iZWhhdmlvciA9IG51bGw7XG5cbiAgICB0aGlzLl8kaXRlbVNoYXBlTWFwLmNsZWFyKCk7XG4gICAgdGhpcy5fJGl0ZW1EYXRhTWFwLmNsZWFyKCk7XG4gICAgdGhpcy5fJGl0ZW1Db21tb25TaGFwZU1hcC5jbGVhcigpO1xuXG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvd3MgdG8gb3ZlcnJpZGUgZGVmYXVsdCB0aGUgYFRpbWVDb250ZXh0QmVoYXZpb3JgIHVzZWQgdG8gZWRpdCB0aGUgbGF5ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjdG9yXG4gICAqL1xuICBzdGF0aWMgY29uZmlndXJlVGltZUNvbnRleHRCZWhhdmlvcihjdG9yKSB7XG4gICAgdGltZUNvbnRleHRCZWhhdmlvckN0b3IgPSBjdG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYExheWVyVGltZUNvbnRleHRgJ3MgYHN0YXJ0YCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBzdGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5zdGFydDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGBMYXllclRpbWVDb250ZXh0YCdzIGBzdGFydGAgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgc3RhcnQodmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnN0YXJ0ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgb2Zmc2V0YCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQub2Zmc2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYExheWVyVGltZUNvbnRleHRgJ3MgYG9mZnNldGAgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgb2Zmc2V0KHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC5vZmZzZXQgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGBMYXllclRpbWVDb250ZXh0YCdzIGBkdXJhdGlvbmAgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgZHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQuZHVyYXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgZHVyYXRpb25gIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IGR1cmF0aW9uKHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYExheWVyVGltZUNvbnRleHRgJ3MgYHN0cmV0Y2hSYXRpb2AgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgc3RyZXRjaFJhdGlvKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGBMYXllclRpbWVDb250ZXh0YCdzIGBzdHJldGNoUmF0aW9gIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IHN0cmV0Y2hSYXRpbyh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQuc3RyZXRjaFJhdGlvID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBkb21haW4gYm91bmRhcmllcyBvZiB0aGUgZGF0YSBmb3IgdGhlIHkgYXhpcy5cbiAgICpcbiAgICogQHR5cGUge0FycmF5fVxuICAgKi9cbiAgc2V0IHlEb21haW4oZG9tYWluKSB7XG4gICAgdGhpcy5wYXJhbXMueURvbWFpbiA9IGRvbWFpbjtcbiAgICB0aGlzLl92YWx1ZVRvUGl4ZWwuZG9tYWluKGRvbWFpbik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZG9tYWluIGJvdW5kYXJpZXMgb2YgdGhlIGRhdGEgZm9yIHRoZSB5IGF4aXMuXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICovXG4gIGdldCB5RG9tYWluKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy55RG9tYWluO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG9wYWNpdHkgb2YgdGhlIHdob2xlIGxheWVyLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IG9wYWNpdHkodmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcy5vcGFjaXR5ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgb3BhY2l0eSBvZiB0aGUgd2hvbGUgbGF5ZXIuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgb3BhY2l0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMub3BhY2l0eTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0cmFuc2ZlcnQgZnVuY3Rpb24gdXNlZCB0byBkaXNwbGF5IHRoZSBkYXRhIGluIHRoZSB4IGF4aXMuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgdGltZVRvUGl4ZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdHJhbnNmZXJ0IGZ1bmN0aW9uIHVzZWQgdG8gZGlzcGxheSB0aGUgZGF0YSBpbiB0aGUgeSBheGlzLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHZhbHVlVG9QaXhlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVUb1BpeGVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBhbGwgdGhlIGRpc3BsYXllZCBpdGVtcy5cbiAgICpcbiAgICogQHR5cGUge0FycmF5PEVsZW1lbnQ+fVxuICAgKi9cbiAgZ2V0IGl0ZW1zKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuXyRpdGVtRGF0YU1hcC5rZXlzKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRhdGEgYXNzb2NpYXRlZCB0byB0aGUgbGF5ZXIuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3RbXX1cbiAgICovXG4gIGdldCBkYXRhKCkgeyByZXR1cm4gdGhpcy5fZGF0YTsgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgbGF5ZXIuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R8T2JqZWN0W119XG4gICAqL1xuICBzZXQgZGF0YShkYXRhKSB7XG4gICAgc3dpdGNoICh0aGlzLmRhdGFUeXBlKSB7XG4gICAgICBjYXNlICdlbnRpdHknOlxuICAgICAgICBpZiAodGhpcy5fZGF0YSkgeyAgLy8gaWYgZGF0YSBhbHJlYWR5IGV4aXN0cywgcmV1c2UgdGhlIHJlZmVyZW5jZVxuICAgICAgICAgIHRoaXMuX2RhdGFbMF0gPSBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2RhdGEgPSBbZGF0YV07XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2xsZWN0aW9uJzpcbiAgICAgICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUhlaWdodChwcmV2VHJhY2tIZWlnaHQsIG5ld1RyYWNrSGVpZ2h0KSB7XG4gICAgY29uc3QgcmF0aW8gPSBuZXdUcmFja0hlaWdodCAvIHByZXZUcmFja0hlaWdodDtcblxuICAgIHRoaXMuX2hlaWdodCA9IHRoaXMuX2hlaWdodCAqIHJhdGlvO1xuICAgIHRoaXMuX3RvcCA9IHRoaXMuX3RvcCAqIHJhdGlvO1xuICAgIHRoaXMuX3ZhbHVlVG9QaXhlbC5yYW5nZShbMCwgdGhpcy5faGVpZ2h0XSlcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEluaXRpYWxpemF0aW9uXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIFJlbmRlcnMgdGhlIERPTSBpbiBtZW1vcnkgb24gbGF5ZXIgY3JlYXRpb24gdG8gYmUgYWJsZSB0byB1c2UgaXQgYmVmb3JlXG4gICAqIHRoZSBsYXllciBpcyBhY3R1YWxseSBpbnNlcnRlZCBpbiB0aGUgRE9NLlxuICAgKi9cbiAgX3JlbmRlckNvbnRhaW5lcigpIHtcbiAgICAvLyB3cmFwcGVyIGdyb3VwIGZvciBgc3RhcnQsIHRvcCBhbmQgY29udGV4dCBmbGlwIG1hdHJpeFxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQoJ2xheWVyJyk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuY2xhc3NOYW1lICE9PSBudWxsKVxuICAgICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZCh0aGlzLnBhcmFtcy5jbGFzc05hbWUpO1xuXG4gICAgLy8gY2xpcCB0aGUgY29udGV4dCB3aXRoIGEgYHN2Z2AgZWxlbWVudFxuICAgIHRoaXMuJGJvdW5kaW5nQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnc3ZnJyk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guY2xhc3NMaXN0LmFkZCgnYm91bmRpbmctYm94Jyk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guc3R5bGUub3ZlcmZsb3cgPSB0aGlzLnBhcmFtcy5vdmVyZmxvdztcbiAgICAvLyBncm91cCB0byBhcHBseSBvZmZzZXRcbiAgICB0aGlzLiRvZmZzZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy4kb2Zmc2V0LmNsYXNzTGlzdC5hZGQoJ29mZnNldCcsICdpdGVtcycpO1xuICAgIC8vIGxheWVyIGJhY2tncm91bmRcbiAgICB0aGlzLiRiYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncmVjdCcpO1xuICAgIHRoaXMuJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCAnMTAwJScpO1xuICAgIHRoaXMuJGJhY2tncm91bmQuY2xhc3NMaXN0LmFkZCgnYmFja2dyb3VuZCcpO1xuICAgIHRoaXMuJGJhY2tncm91bmQuc3R5bGUuZmlsbE9wYWNpdHkgPSAwO1xuICAgIHRoaXMuJGJhY2tncm91bmQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcbiAgICAvLyBjb250ZXh0IGludGVyYWN0aW9uc1xuICAgIHRoaXMuJGludGVyYWN0aW9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMuY2xhc3NMaXN0LmFkZCgnaW50ZXJhY3Rpb25zJyk7XG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgLy8gQE5PVEU6IHdvcmtzIGJ1dCBraW5nIG9mIHVnbHkuLi4gc2hvdWxkIGJlIGNsZWFuZWRcbiAgICB0aGlzLmNvbnRleHRTaGFwZSA9IG5ldyBTZWdtZW50KCk7XG4gICAgdGhpcy5jb250ZXh0U2hhcGUuaW5zdGFsbCh7XG4gICAgICBvcGFjaXR5OiAoKSA9PiAwLjEsXG4gICAgICBjb2xvciAgOiAoKSA9PiAnIzc4Nzg3OCcsXG4gICAgICB3aWR0aCAgOiAoKSA9PiB0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uLFxuICAgICAgaGVpZ2h0IDogKCkgPT4gdGhpcy5fcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuZG9tYWluKClbMV0sXG4gICAgICB5ICAgICAgOiAoKSA9PiB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbC5kb21haW4oKVswXVxuICAgIH0pO1xuXG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zLmFwcGVuZENoaWxkKHRoaXMuY29udGV4dFNoYXBlLnJlbmRlcigpKTtcbiAgICAvLyBjcmVhdGUgdGhlIERPTSB0cmVlXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kYm91bmRpbmdCb3gpO1xuICAgIHRoaXMuJGJvdW5kaW5nQm94LmFwcGVuZENoaWxkKHRoaXMuJG9mZnNldCk7XG4gICAgdGhpcy4kb2Zmc2V0LmFwcGVuZENoaWxkKHRoaXMuJGJhY2tncm91bmQpO1xuICAgIHRoaXMuJGJvdW5kaW5nQm94LmFwcGVuZENoaWxkKHRoaXMuJGludGVyYWN0aW9ucyk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDb21wb25lbnQgQ29uZmlndXJhdGlvblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjb250ZXh0IG9mIHRoZSBsYXllciwgdGh1cyBkZWZpbmluZyBpdHMgYHN0YXJ0YCwgYGR1cmF0aW9uYCxcbiAgICogYG9mZnNldGAgYW5kIGBzdHJldGNoUmF0aW9gLlxuICAgKlxuICAgKiBAcGFyYW0ge1RpbWVDb250ZXh0fSB0aW1lQ29udGV4dCAtIFRoZSB0aW1lQ29udGV4dCBpbiB3aGljaCB0aGUgbGF5ZXIgaXMgZGlzcGxheWVkLlxuICAgKi9cbiAgc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gdGltZUNvbnRleHQ7XG4gICAgLy8gY3JlYXRlIGEgbWl4aW4gdG8gcGFzcyB0byB0aGUgc2hhcGVzXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dCA9IHt9O1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIHNoYXBlIGFuZCBpdHMgY29uZmlndXJhdGlvbiB0byB1c2UgaW4gb3JkZXIgdG8gcmVuZGVyIHRoZSBkYXRhLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jhc2VTaGFwZX0gY3RvciAtIFRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgc2hhcGUgdG8gYmUgdXNlZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFthY2Nlc3NvcnM9e31dIC0gRGVmaW5lcyBob3cgdGhlIHNoYXBlIHNob3VsZCBhZGFwdCB0byBhIHBhcnRpY3VsYXIgZGF0YSBzdHJ1dHVyZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSAtIEdsb2JhbCBjb25maWd1cmF0aW9uIGZvciB0aGUgc2hhcGVzLCBpcyBzcGVjaWZpYyB0byBlYWNoIGBTaGFwZWAuXG4gICAqL1xuICBjb25maWd1cmVTaGFwZShjdG9yLCBhY2Nlc3NvcnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uID0geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcHRpb25uYWx5IHJlZ2lzdGVyIGEgc2hhcGUgdG8gYmUgdXNlZCBhY2Nyb3MgdGhlIGVudGlyZSBjb2xsZWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jhc2VTaGFwZX0gY3RvciAtIFRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgc2hhcGUgdG8gYmUgdXNlZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFthY2Nlc3NvcnM9e31dIC0gRGVmaW5lcyBob3cgdGhlIHNoYXBlIHNob3VsZCBhZGFwdCB0byBhIHBhcnRpY3VsYXIgZGF0YSBzdHJ1dHVyZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSAtIEdsb2JhbCBjb25maWd1cmF0aW9uIGZvciB0aGUgc2hhcGVzLCBpcyBzcGVjaWZpYyB0byBlYWNoIGBTaGFwZWAuXG4gICAqL1xuICBjb25maWd1cmVDb21tb25TaGFwZShjdG9yLCBhY2Nlc3NvcnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uID0geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGUgYmVoYXZpb3IgdG8gdXNlIHdoZW4gaW50ZXJhY3Rpbmcgd2l0aCBhIHNoYXBlLlxuICAgKlxuICAgKiBAcGFyYW0ge0Jhc2VCZWhhdmlvcn0gYmVoYXZpb3JcbiAgICovXG4gIHNldEJlaGF2aW9yKGJlaGF2aW9yKSB7XG4gICAgYmVoYXZpb3IuaW5pdGlhbGl6ZSh0aGlzKTtcbiAgICB0aGlzLl9iZWhhdmlvciA9IGJlaGF2aW9yO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHZhbHVlcyBzdG9yZWQgaW50IHRoZSBgX3JlbmRlcmluZ0NvbnRleHRgIHBhc3NlZCAgdG8gc2hhcGVzXG4gICAqIGZvciByZW5kZXJpbmcgYW5kIHVwZGF0aW5nLlxuICAgKi9cbiAgX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKSB7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCA9IHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWw7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwgPSB0aGlzLl92YWx1ZVRvUGl4ZWw7XG5cbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LmhlaWdodCA9IHRoaXMuX2hlaWdodDtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LndpZHRoICA9IHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbik7XG4gICAgLy8gZm9yIGZvcmVpZ24gb2JqZWN0IGlzc3VlIGluIGNocm9tZVxuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQub2Zmc2V0WCA9IHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5vZmZzZXQpO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQuc3RhcnRYID0gdGhpcy50aW1lQ29udGV4dC5wYXJlbnQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5zdGFydCk7XG5cbiAgICAvLyBAdG9kbyByZXBsYWNlIHdpdGggYG1pblhgIGFuZCBgbWF4WGAgcmVwcmVzZW50aW5nIHRoZSB2aXNpYmxlIHBpeGVscyBpbiB3aGljaFxuICAgIC8vIHRoZSBzaGFwZXMgc2hvdWxkIGJlIHJlbmRlcmVkLCBjb3VsZCBhbGxvdyB0byBub3QgdXBkYXRlIHRoZSBET00gb2Ygc2hhcGVzXG4gICAgLy8gd2hvIGFyZSBub3QgaW4gdGhpcyBhcmVhLlxuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudHJhY2tPZmZzZXRYID0gdGhpcy50aW1lQ29udGV4dC5wYXJlbnQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5wYXJlbnQub2Zmc2V0KTtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZpc2libGVXaWR0aCA9IHRoaXMudGltZUNvbnRleHQucGFyZW50LnZpc2libGVXaWR0aDtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEJlaGF2aW9yIEFjY2Vzc29yc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpdGVtcyBtYXJrZWQgYXMgc2VsZWN0ZWQuXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheTxFbGVtZW50Pn1cbiAgICovXG4gIGdldCBzZWxlY3RlZEl0ZW1zKCkge1xuICAgIHJldHVybiB0aGlzLl9iZWhhdmlvciA/IHRoaXMuX2JlaGF2aW9yLnNlbGVjdGVkSXRlbXMgOiBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrIGl0ZW0ocykgYXMgc2VsZWN0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W119ICRpdGVtc1xuICAgKi9cbiAgc2VsZWN0KC4uLiRpdGVtcykge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3IpIHsgcmV0dXJuOyB9XG4gICAgaWYgKCEkaXRlbXMubGVuZ3RoKSB7ICRpdGVtcyA9IHRoaXMuXyRpdGVtRGF0YU1hcC5rZXlzKCk7IH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheSgkaXRlbXNbMF0pKSB7ICRpdGVtcyA9ICRpdGVtc1swXTsgfVxuXG4gICAgZm9yIChsZXQgJGl0ZW0gb2YgJGl0ZW1zKSB7XG4gICAgICBjb25zdCBkYXR1bSA9IHRoaXMuXyRpdGVtRGF0YU1hcC5nZXQoJGl0ZW0pO1xuICAgICAgdGhpcy5fYmVoYXZpb3Iuc2VsZWN0KCRpdGVtLCBkYXR1bSk7XG4gICAgICB0aGlzLl90b0Zyb250KCRpdGVtKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBpdGVtKHMpIGZyb20gc2VsZWN0ZWQgaXRlbXMuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W119ICRpdGVtc1xuICAgKi9cbiAgdW5zZWxlY3QoLi4uJGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHsgJGl0ZW1zID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmtleXMoKTsgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KCRpdGVtc1swXSkpIHsgJGl0ZW1zID0gJGl0ZW1zWzBdOyB9XG5cbiAgICBmb3IgKGxldCAkaXRlbSBvZiAkaXRlbXMpIHtcbiAgICAgIGNvbnN0IGRhdHVtID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmdldCgkaXRlbSk7XG4gICAgICB0aGlzLl9iZWhhdmlvci51bnNlbGVjdCgkaXRlbSwgZGF0dW0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgaXRlbShzKSBzZWxlY3Rpb24gc3RhdGUgYWNjb3JkaW5nIHRvIHRoZWlyIGN1cnJlbnQgc3RhdGUuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W119ICRpdGVtc1xuICAgKi9cbiAgdG9nZ2xlU2VsZWN0aW9uKC4uLiRpdGVtcykge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3IpIHsgcmV0dXJuOyB9XG4gICAgaWYgKCEkaXRlbXMubGVuZ3RoKSB7ICRpdGVtcyA9IHRoaXMuXyRpdGVtRGF0YU1hcC5rZXlzKCk7IH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheSgkaXRlbXNbMF0pKSB7ICRpdGVtcyA9ICRpdGVtc1swXTsgfVxuXG4gICAgZm9yIChsZXQgJGl0ZW0gb2YgJGl0ZW1zKSB7XG4gICAgICBjb25zdCBkYXR1bSA9IHRoaXMuXyRpdGVtRGF0YU1hcC5nZXQoJGl0ZW0pO1xuICAgICAgdGhpcy5fYmVoYXZpb3IudG9nZ2xlU2VsZWN0aW9uKCRpdGVtLCBkYXR1bSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVkaXQgaXRlbShzKSBhY2NvcmRpbmcgdG8gdGhlIGBlZGl0YCBkZWZpbmVkIGluIHRoZSByZWdpc3RlcmVkIGBCZWhhdmlvcmAuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxFbGVtZW50W119ICRpdGVtcyAtIEl0ZW0ocykgdG8gZWRpdFxuICAgKiBAcGFyYW0ge051bWJlcn0gZHggLSBNb2RpZmljYXRpb24gdG8gYXBwbHkgaW4gdGhlIHggYXhpcyAoaW4gcGl4ZWwgZG9tYWluKVxuICAgKiBAcGFyYW0ge051bWJlcn0gZHkgLSBNb2RpZmljYXRpb24gdG8gYXBwbHkgaW4gdGhlIHkgYXhpcyAoaW4gcGl4ZWwgZG9tYWluKVxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICR0YXJnZXQgLSBUYXJnZXQgb2YgdGhlIGludGVyYWN0aW9uIChmb3IgZXhhbXBsZSwgbGVmdFxuICAgKiAgaGFuZGxlciBET00gZWxlbWVudCBpbiBhIHNlZ21lbnQpLlxuICAgKi9cbiAgZWRpdCgkaXRlbXMsIGR4LCBkeSwgJHRhcmdldCkge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3IpIHsgcmV0dXJuOyB9XG4gICAgJGl0ZW1zID0gIUFycmF5LmlzQXJyYXkoJGl0ZW1zKSA/IFskaXRlbXNdIDogJGl0ZW1zO1xuXG4gICAgZm9yIChsZXQgJGl0ZW0gb2YgJGl0ZW1zKSB7XG4gICAgICBjb25zdCBzaGFwZSA9IHRoaXMuXyRpdGVtU2hhcGVNYXAuZ2V0KCRpdGVtKTtcbiAgICAgIGNvbnN0IGRhdHVtID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmdldCgkaXRlbSk7XG5cbiAgICAgIHRoaXMuX2JlaGF2aW9yLmVkaXQodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksICR0YXJnZXQpO1xuICAgICAgdGhpcy5lbWl0KCdlZGl0Jywgc2hhcGUsIGRhdHVtKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBpZiB0aGUgYExheWVyYCwgYW5kIHRodXMgdGhlIGBMYXllclRpbWVDb250ZXh0YCBpcyBlZGl0YWJsZSBvciBub3QuXG4gICAqXG4gICAqIEBwYXJhbXMge0Jvb2xlYW59IFtib29sPXRydWVdXG4gICAqL1xuICBzZXRDb250ZXh0RWRpdGFibGUoYm9vbCA9IHRydWUpIHtcbiAgICBjb25zdCBkaXNwbGF5ID0gYm9vbCA/ICdibG9jaycgOiAnbm9uZSc7XG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xuICAgIHRoaXMuX2lzQ29udGV4dEVkaXRhYmxlID0gYm9vbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBFZGl0IHRoZSBsYXllciBhbmQgdGh1cyBpdHMgcmVsYXRlZCBgTGF5ZXJUaW1lQ29udGV4dGAgYXR0cmlidXRlcy5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR4IC0gVGhlIG1vZGlmaWNhdGlvbiB0byBhcHBseSBpbiB0aGUgeCBheGlzIChpbiBwaXhlbHMpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHkgLSBUaGUgbW9kaWZpY2F0aW9uIHRvIGFwcGx5IGluIHRoZSB5IGF4aXMgKGluIHBpeGVscykuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJHRhcmdldCAtIFRoZSB0YXJnZXQgb2YgdGhlIGV2ZW50IG9mIHRoZSBpbnRlcmFjdGlvbi5cbiAgICovXG4gIGVkaXRDb250ZXh0KGR4LCBkeSwgJHRhcmdldCkge1xuICAgIHRpbWVDb250ZXh0QmVoYXZpb3IuZWRpdCh0aGlzLCBkeCwgZHksICR0YXJnZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0cmV0Y2ggdGhlIGxheWVyIGFuZCB0aHVzIGl0cyByZWxhdGVkIGBMYXllclRpbWVDb250ZXh0YCBhdHRyaWJ1dGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHggLSBUaGUgbW9kaWZpY2F0aW9uIHRvIGFwcGx5IGluIHRoZSB4IGF4aXMgKGluIHBpeGVscykuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkeSAtIFRoZSBtb2RpZmljYXRpb24gdG8gYXBwbHkgaW4gdGhlIHkgYXhpcyAoaW4gcGl4ZWxzKS5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkdGFyZ2V0IC0gVGhlIHRhcmdldCBvZiB0aGUgZXZlbnQgb2YgdGhlIGludGVyYWN0aW9uLlxuICAgKi9cbiAgc3RyZXRjaENvbnRleHQoZHgsIGR5LCAkdGFyZ2V0KSB7XG4gICAgdGltZUNvbnRleHRCZWhhdmlvci5zdHJldGNoKHRoaXMsIGR4LCBkeSwgJHRhcmdldCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBIZWxwZXJzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gaXRlbSBmcm9tIGEgRE9NIGVsZW1lbnQgcmVsYXRlZCB0byB0aGUgc2hhcGUsIG51bGwgb3RoZXJ3aXNlLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIHRoZSBlbGVtZW50IHRvIGJlIHRlc3RlZFxuICAgKiBAcmV0dXJuIHtFbGVtZW50fG51bGx9XG4gICAqL1xuICBnZXRJdGVtRnJvbURPTUVsZW1lbnQoJGVsKSB7XG4gICAgbGV0ICRpdGVtO1xuXG4gICAgZG8ge1xuICAgICAgaWYgKCRlbC5jbGFzc0xpc3QgJiYgJGVsLmNsYXNzTGlzdC5jb250YWlucygnaXRlbScpKSB7XG4gICAgICAgICRpdGVtID0gJGVsO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgJGVsID0gJGVsLnBhcmVudE5vZGU7XG4gICAgfSB3aGlsZSAoJGVsICE9PSBudWxsKTtcblxuICAgIHJldHVybiB0aGlzLmhhc0l0ZW0oJGl0ZW0pID8gJGl0ZW0gOsKgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzaGFwZSBhc3NvY2lhdGVkIHRvIGEgc3BlY2lmaWMgaXRlbS5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkaXRlbVxuICAgKiBAcmV0dXJuIHtTaGFwZX1cbiAgICovXG4gIGdldFNoYXBlRnJvbUl0ZW0oJGl0ZW0pIHtcbiAgICByZXR1cm4gdGhpcy5oYXNJdGVtKCRpdGVtKSA/IHRoaXMuXyRpdGVtU2hhcGVNYXAuZ2V0KCRpdGVtKSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc2hhcGUgYXNzb2NpYXRlZCB0byBhIHNwZWNpZmljIGl0ZW0gZnJvbSBhbnkgRE9NIGVsZW1lbnRcbiAgICogY29tcG9zaW5nIHRoZSBzaGFwZS5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkaXRlbVxuICAgKiBAcmV0dXJuIHtTaGFwZX1cbiAgICovXG4gIGdldFNoYXBlRnJvbURPTUVsZW1lbnQoJGVsKSB7XG4gICAgY29uc3QgJGl0ZW0gPSB0aGlzLmdldEl0ZW1Gcm9tRE9NRWxlbWVudCgkZWwpO1xuICAgIHJldHVybiB0aGlzLmdldFNoYXBlRnJvbUl0ZW0oJGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRhdHVtIGFzc29jaWF0ZWQgdG8gYSBzcGVjaWZpYyBpdGVtLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRpdGVtXG4gICAqIEByZXR1cm4ge09iamVjdHxBcnJheXxudWxsfVxuICAgKi9cbiAgZ2V0RGF0dW1Gcm9tSXRlbSgkaXRlbSkge1xuICAgIGNvbnN0IGRhdHVtID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmdldCgkaXRlbSk7XG4gICAgcmV0dXJuIGRhdHVtID8gZGF0dW0gOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRhdHVtIGFzc29jaWF0ZWQgdG8gYSBzcGVjaWZpYyBpdGVtIGZyb20gYW55IERPTSBlbGVtZW50XG4gICAqIGNvbXBvc2luZyB0aGUgc2hhcGUuIEJhc2ljYWxseSBhIHNob3J0Y3V0IGZvciBgZ2V0SXRlbUZyb21ET01FbGVtZW50YCBhbmRcbiAgICogYGdldERhdHVtRnJvbUl0ZW1gIG1ldGhvZHMuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsXG4gICAqIEByZXR1cm4ge09iamVjdHxBcnJheXxudWxsfVxuICAgKi9cbiAgZ2V0RGF0dW1Gcm9tRE9NRWxlbWVudCgkZWwpIHtcbiAgICBjb25zdCAkaXRlbSA9IHRoaXMuZ2V0SXRlbUZyb21ET01FbGVtZW50KCRlbCk7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RGF0dW1Gcm9tSXRlbSgkaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogVGVzdHMgaWYgdGhlIGdpdmVuIERPTSBlbGVtZW50IGlzIGFuIGl0ZW0gb2YgdGhlIGxheWVyLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRpdGVtIC0gVGhlIGl0ZW0gdG8gYmUgdGVzdGVkLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgaGFzSXRlbSgkaXRlbSkge1xuICAgIHJldHVybiB0aGlzLl8kaXRlbURhdGFNYXAuaGFzKCRpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGlmIGEgZ2l2ZW4gZWxlbWVudCBiZWxvbmdzIHRvIHRoZSBsYXllci4gSXMgbW9yZSBnZW5lcmFsIHRoYW5cbiAgICogYGhhc0l0ZW1gLCBjYW4gbW9zdGx5IHVzZWQgdG8gY2hlY2sgaW50ZXJhY3Rpb25zIGVsZW1lbnRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIFRoZSBET00gZWxlbWVudCB0byBiZSB0ZXN0ZWQuXG4gICAqIEByZXR1cm4ge2Jvb2x9XG4gICAqL1xuICBoYXNFbGVtZW50KCRlbCkge1xuICAgIGRvIHtcbiAgICAgIGlmICgkZWwgPT09IHRoaXMuJGVsKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAkZWwgPSAkZWwucGFyZW50Tm9kZTtcbiAgICB9IHdoaWxlICgkZWwgIT09IG51bGwpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGFsbCB0aGUgaXRlbXMgaW4gYSBnaXZlbiBhcmVhIGFzIGRlZmluZWQgaW4gdGhlIHJlZ2lzdGVyZWQgYFNoYXBlfmluQXJlYWAgbWV0aG9kLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXJlYSAtIFRoZSBhcmVhIGluIHdoaWNoIHRvIGZpbmQgdGhlIGVsZW1lbnRzXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhcmVhLnRvcFxuICAgKiBAcGFyYW0ge051bWJlcn0gYXJlYS5sZWZ0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhcmVhLndpZHRoXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhcmVhLmhlaWdodFxuICAgKiBAcmV0dXJuIHtBcnJheX0gLSBsaXN0IG9mIHRoZSBpdGVtcyBwcmVzZW50cyBpbiB0aGUgYXJlYVxuICAgKi9cbiAgZ2V0SXRlbXNJbkFyZWEoYXJlYSkge1xuICAgIGNvbnN0IHN0YXJ0ICAgID0gdGhpcy50aW1lQ29udGV4dC5wYXJlbnQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5zdGFydCk7XG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24pO1xuICAgIGNvbnN0IG9mZnNldCAgID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCk7XG4gICAgY29uc3QgdG9wICAgICAgPSB0aGlzLl90b3A7XG4gICAgLy8gYmUgYXdhcmUgYWYgY29udGV4dCdzIHRyYW5zbGF0aW9ucyAtIGNvbnN0cmFpbiBpbiB3b3JraW5nIHZpZXdcbiAgICBsZXQgeDEgPSBNYXRoLm1heChhcmVhLmxlZnQsIHN0YXJ0KTtcbiAgICBsZXQgeDIgPSBNYXRoLm1pbihhcmVhLmxlZnQgKyBhcmVhLndpZHRoLCBzdGFydCArIGR1cmF0aW9uKTtcbiAgICB4MSAtPSAoc3RhcnQgKyBvZmZzZXQpO1xuICAgIHgyIC09IChzdGFydCArIG9mZnNldCk7XG4gICAgLy8ga2VlcCBjb25zaXN0ZW50IHdpdGggY29udGV4dCB5IGNvb3JkaW5hdGVzIHN5c3RlbVxuICAgIGxldCB5MSA9IHRoaXMuX2hlaWdodCAtIChhcmVhLnRvcCArIGFyZWEuaGVpZ2h0KTtcbiAgICBsZXQgeTIgPSB0aGlzLl9oZWlnaHQgLSBhcmVhLnRvcDtcblxuICAgIHkxICs9IHRoaXMuX3RvcDtcbiAgICB5MiArPSB0aGlzLl90b3A7XG5cbiAgICBjb25zdCAkZmlsdGVyZWRJdGVtcyA9IFtdO1xuXG4gICAgZm9yIChsZXQgWyRpdGVtLCBkYXR1bV0gb2YgdGhpcy5fJGl0ZW1EYXRhTWFwLmVudHJpZXMoKSkge1xuICAgICAgY29uc3Qgc2hhcGUgPSB0aGlzLl8kaXRlbVNoYXBlTWFwLmdldCgkaXRlbSk7XG4gICAgICBjb25zdCBpbkFyZWEgPSBzaGFwZS5pbkFyZWEodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKTtcblxuICAgICAgaWYgKGluQXJlYSkgeyAkZmlsdGVyZWRJdGVtcy5wdXNoKCRpdGVtKTsgfVxuICAgIH1cblxuICAgIHJldHVybiAkZmlsdGVyZWRJdGVtcztcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyAvIERpc3BsYXkgbWV0aG9kc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBNb3ZlcyBhbiBpdGVtIHRvIHRoZSBlbmQgb2YgdGhlIGxheWVyIHRvIGRpc3BsYXkgaXQgZnJvbnQgb2YgaXRzXG4gICAqIHNpYmxpbmdzIChzdmcgei1pbmRleC4uLikuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGl0ZW0gLSBUaGUgaXRlbSB0byBiZSBtb3ZlZC5cbiAgICovXG4gIF90b0Zyb250KCRpdGVtKSB7XG4gICAgdGhpcy4kb2Zmc2V0LmFwcGVuZENoaWxkKCRpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIERPTSBzdHJ1Y3R1cmUgb2YgdGhlIHNoYXBlcyBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIGRhdGEuIEluc3BpcmVkXG4gICAqIGZyb20gdGhlIGBlbnRlcmAgYW5kIGBleGl0YCBkMy5qcyBwYXJhZGlnbSwgdGhpcyBtZXRob2Qgc2hvdWxkIGJlIGNhbGxlZFxuICAgKiBlYWNoIHRpbWUgYSBkYXR1bSBpcyBhZGRlZCBvciByZW1vdmVkIGZyb20gdGhlIGRhdGEuIFdoaWxlIHRoZSBET00gaXNcbiAgICogY3JlYXRlZCB0aGUgYHVwZGF0ZWAgbWV0aG9kIG11c3QgYmUgY2FsbGVkIGluIG9yZGVyIHRvIHVwZGF0ZSB0aGUgc2hhcGVzXG4gICAqIGF0dHJpYnV0ZXMgYW5kIHRodXMgcGxhY2UgdGhlbSB3aGVyZSB0aGV5IHNob3VsZC5cbiAgICovXG4gIHJlbmRlcigpIHtcbiAgICAvLyByZW5kZXIgYGNvbW1vblNoYXBlYCBvbmx5IG9uY2VcbiAgICBpZiAoXG4gICAgICB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb24gIT09IG51bGwgJiZcbiAgICAgIHRoaXMuXyRpdGVtQ29tbW9uU2hhcGVNYXAuc2l6ZSA9PT0gMFxuICAgICkge1xuICAgICAgY29uc3QgeyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfSA9IHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbjtcbiAgICAgIGNvbnN0ICRncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAgIGNvbnN0IHNoYXBlID0gbmV3IGN0b3Iob3B0aW9ucyk7XG5cbiAgICAgIHNoYXBlLmluc3RhbGwoYWNjZXNzb3JzKTtcbiAgICAgICRncm91cC5hcHBlbmRDaGlsZChzaGFwZS5yZW5kZXIoKSk7XG4gICAgICAkZ3JvdXAuY2xhc3NMaXN0LmFkZCgnaXRlbScsICdjb21tb24nLCBzaGFwZS5nZXRDbGFzc05hbWUoKSk7XG5cbiAgICAgIHRoaXMuXyRpdGVtQ29tbW9uU2hhcGVNYXAuc2V0KCRncm91cCwgc2hhcGUpO1xuICAgICAgdGhpcy4kb2Zmc2V0LmFwcGVuZENoaWxkKCRncm91cCk7XG4gICAgfVxuXG4gICAgLy8gYXBwZW5kIGVsZW1lbnRzIGFsbCBhdCBvbmNlXG4gICAgY29uc3QgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5fJGl0ZW1EYXRhTWFwLnZhbHVlcygpOyAvLyBpdGVyYXRvclxuXG4gICAgLy8gZW50ZXJcbiAgICB0aGlzLmRhdGEuZm9yRWFjaCgoZGF0dW0pID0+IHtcbiAgICAgIGZvciAobGV0IHZhbHVlIG9mIHZhbHVlcykgeyBpZiAodmFsdWUgPT09IGRhdHVtKSB7IHJldHVybjsgfSB9XG5cbiAgICAgIGNvbnN0IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH0gPSB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb247XG4gICAgICBjb25zdCBzaGFwZSA9IG5ldyBjdG9yKG9wdGlvbnMpO1xuICAgICAgc2hhcGUuaW5zdGFsbChhY2Nlc3NvcnMpO1xuXG4gICAgICBjb25zdCAkZWwgPSBzaGFwZS5yZW5kZXIodGhpcy5fcmVuZGVyaW5nQ29udGV4dCk7XG4gICAgICAkZWwuY2xhc3NMaXN0LmFkZCgnaXRlbScsIHNoYXBlLmdldENsYXNzTmFtZSgpKTtcblxuICAgICAgdGhpcy5fJGl0ZW1TaGFwZU1hcC5zZXQoJGVsLCBzaGFwZSk7XG4gICAgICB0aGlzLl8kaXRlbURhdGFNYXAuc2V0KCRlbCwgZGF0dW0pO1xuXG4gICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCgkZWwpO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kb2Zmc2V0LmFwcGVuZENoaWxkKGZyYWdtZW50KTtcblxuICAgIC8vIHJlbW92ZVxuICAgIGZvciAobGV0IFskaXRlbSwgZGF0dW1dIG9mIHRoaXMuXyRpdGVtRGF0YU1hcC5lbnRyaWVzKCkpIHtcbiAgICAgIGlmICh0aGlzLmRhdGEuaW5kZXhPZihkYXR1bSkgIT09IC0xKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fJGl0ZW1TaGFwZU1hcC5nZXQoJGl0ZW0pO1xuXG4gICAgICB0aGlzLiRvZmZzZXQucmVtb3ZlQ2hpbGQoJGl0ZW0pO1xuICAgICAgc2hhcGUuZGVzdHJveSgpO1xuICAgICAgLy8gYSByZW1vdmVkIGl0ZW0gY2Fubm90IGJlIHNlbGVjdGVkXG4gICAgICBpZiAodGhpcy5fYmVoYXZpb3IpIHtcbiAgICAgICAgdGhpcy5fYmVoYXZpb3IudW5zZWxlY3QoJGl0ZW0sIGRhdHVtKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fJGl0ZW1EYXRhTWFwLmRlbGV0ZSgkaXRlbSk7XG4gICAgICB0aGlzLl8kaXRlbVNoYXBlTWFwLmRlbGV0ZSgkaXRlbSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGNvbnRhaW5lciBvZiB0aGUgbGF5ZXIgYW5kIHRoZSBhdHRyaWJ1dGVzIG9mIHRoZSBleGlzdGluZyBzaGFwZXMuXG4gICAqL1xuICB1cGRhdGUoKSB7XG4gICAgdGhpcy51cGRhdGVDb250YWluZXIoKTtcbiAgICB0aGlzLnVwZGF0ZVNoYXBlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGNvbnRhaW5lciBvZiB0aGUgbGF5ZXIuXG4gICAqL1xuICB1cGRhdGVDb250YWluZXIoKSB7XG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpO1xuXG4gICAgY29uc3QgdGltZUNvbnRleHQgPSB0aGlzLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IHdpZHRoICA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRpbWVDb250ZXh0LmR1cmF0aW9uKTtcbiAgICAvLyB4IGlzIHJlbGF0aXZlIHRvIHRpbWVsaW5lJ3MgdGltZUNvbnRleHRcbiAgICBjb25zdCB4ICAgICAgPSB0aW1lQ29udGV4dC5wYXJlbnQudGltZVRvUGl4ZWwodGltZUNvbnRleHQuc3RhcnQpO1xuICAgIGNvbnN0IG9mZnNldCA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRpbWVDb250ZXh0Lm9mZnNldCk7XG4gICAgY29uc3QgdG9wICAgID0gdGhpcy5fdG9wO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuX2hlaWdodDtcbiAgICAvLyBtYXRyaXggdG8gaW52ZXJ0IHRoZSBjb29yZGluYXRlIHN5c3RlbVxuICAgIGNvbnN0IHRyYW5zbGF0ZU1hdHJpeCA9IGBtYXRyaXgoMSwgMCwgMCwgLTEsICR7eH0sICR7dG9wICsgaGVpZ2h0fSlgO1xuXG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHRyYW5zbGF0ZU1hdHJpeCk7XG5cbiAgICB0aGlzLiRib3VuZGluZ0JveC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG5cbiAgICB0aGlzLiRvZmZzZXQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHtvZmZzZXR9LCAwKWApO1xuICAgIC8vIG1haW50YWluIGNvbnRleHQgc2hhcGVcbiAgICB0aGlzLmNvbnRleHRTaGFwZS51cGRhdGUodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgdGhpcy50aW1lQ29udGV4dCwgMCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgYXR0cmlidXRlcyBvZiBhbGwgdGhlIGBTaGFwZWAgaW5zdGFuY2VzIHJlbmRlcmVkIGludG8gdGhlIGxheWVyLlxuICAgKlxuICAgKiBAdG9kbyAtIGFsbG93IHRvIGZpbHRlciB3aGljaCBzaGFwZShzKSBzaG91bGQgYmUgdXBkYXRlZC5cbiAgICovXG4gIHVwZGF0ZVNoYXBlcygpIHtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCk7XG4gICAgLy8gdXBkYXRlIGNvbW1vbiBzaGFwZXNcbiAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwLmZvckVhY2goKHNoYXBlLCAkaXRlbSkgPT4ge1xuICAgICAgc2hhcGUudXBkYXRlKHRoaXMuX3JlbmRlcmluZ0NvbnRleHQsIHRoaXMuZGF0YSk7XG4gICAgfSk7XG5cbiAgICBmb3IgKGxldCBbJGl0ZW0sIGRhdHVtXSBvZiB0aGlzLl8kaXRlbURhdGFNYXAuZW50cmllcygpKSB7XG4gICAgICBjb25zdCBzaGFwZSA9IHRoaXMuXyRpdGVtU2hhcGVNYXAuZ2V0KCRpdGVtKTtcbiAgICAgIHNoYXBlLnVwZGF0ZSh0aGlzLl9yZW5kZXJpbmdDb250ZXh0LCBkYXR1bSk7XG4gICAgfVxuICB9XG59XG4iXX0=