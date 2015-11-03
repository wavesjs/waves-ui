'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Map = require('babel-runtime/core-js/map')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _namespace = require('./namespace');

var _namespace2 = _interopRequireDefault(_namespace);

var _utilsScales = require('../utils/scales');

var _utilsScales2 = _interopRequireDefault(_utilsScales);

var _shapesSegment = require('../shapes/segment');

var _shapesSegment2 = _interopRequireDefault(_shapesSegment);

var _behaviorsTimeContextBehavior = require('../behaviors/time-context-behavior');

var _behaviorsTimeContextBehavior2 = _interopRequireDefault(_behaviorsTimeContextBehavior);

// time context bahevior
var timeContextBehavior = null;
var timeContextBehaviorCtor = _behaviorsTimeContextBehavior2['default'];

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

var Layer = (function (_events$EventEmitter) {
  _inherits(Layer, _events$EventEmitter);

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
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, Layer);

    _get(Object.getPrototypeOf(Layer.prototype), 'constructor', this).call(this);

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
      overflow: 'hidden' };

    /**
     * Parameters of the layers, `defaults` overrided with options.
     * @type {Object}
     */
    // usefull ?
    this.params = _Object$assign({}, defaults, options);
    /**
     * Defines how the layer should look at the data (`'entity'` or `'collection'`).
     * @type {String}
     */
    this.dataType = dataType; // 'entity' || 'collection';
    /** @type {LayerTimeContext} */
    this.timeContext = null;
    /** @type {Element} */
    this.$el = null;
    /** @type {Element} */
    this.$background = null;
    /** @type {Element} */
    this.$boundingBox = null;
    /** @type {Element} */
    this.$offset = null;
    /** @type {Element} */
    this.$interactions = null;
    /**
     * A Segment instanciated to interact with the Layer itself.
     * @type {Segment}
     */
    this.contextShape = null;

    this._shapeConfiguration = null; // { ctor, accessors, options }
    this._commonShapeConfiguration = null; // { ctor, accessors, options }
    this._$itemShapeMap = new _Map();
    this._$itemDataMap = new _Map();
    this._$itemCommonShapeMap = new _Map();

    this._isContextEditable = false;
    this._behavior = null;

    this.data = data;

    this._valueToPixel = _utilsScales2['default'].linear().domain(this.params.yDomain).range([0, this.params.height]);

    // initialize timeContext layout
    this._renderContainer();
    // creates the timeContextBehavior for all layers
    if (timeContextBehavior === null) {
      timeContextBehavior = new timeContextBehaviorCtor();
    }
  }

  /**
   * Destroy the layer, clear all references.
   */

  _createClass(Layer, [{
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
    key: '_renderContainer',

    // --------------------------------------
    // Initialization
    // --------------------------------------

    /**
     * Renders the DOM in memory on layer creation to be able to use it before
     * the layer is actually inserted in the DOM.
     */
    value: function _renderContainer() {
      var _this = this;

      // wrapper group for `start, top and context flip matrix
      this.$el = document.createElementNS(_namespace2['default'], 'g');
      this.$el.classList.add('layer');
      if (this.params.className !== null) {
        this.$el.classList.add(this.params.className);
      }
      // clip the context with a `svg` element
      this.$boundingBox = document.createElementNS(_namespace2['default'], 'svg');
      this.$boundingBox.classList.add('bounding-box');
      this.$boundingBox.style.overflow = this.params.overflow;
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
      var accessors = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

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
      var accessors = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

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

      this._renderingContext.height = this.params.height;
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
        for (var _iterator = _getIterator($items), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
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
        for (var _iterator2 = _getIterator($items), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var $item = _step2.value;

          var datum = this._$itemDataMap.get($item);
          this._behavior.unselect($item, datum);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
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
        for (var _iterator3 = _getIterator($items), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var $item = _step3.value;

          var datum = this._$itemDataMap.get($item);
          this._behavior.toggleSelection($item, datum);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
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
     * @param {Element|Element[]} $items - The item(s) to edit.
     * @param {Number} dx - The modification to apply in the x axis (in pixels).
     * @param {Number} dy - The modification to apply in the y axis (in pixels).
     * @param {Element} $target - The target of the interaction (for example, left
     *    handler DOM element in a segment).
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
        for (var _iterator4 = _getIterator($items), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
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
          if (!_iteratorNormalCompletion4 && _iterator4['return']) {
            _iterator4['return']();
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
      var bool = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

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
      if ($item === null) {
        return null;
      }
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

      var $filteredItems = [];

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = _getIterator(this._$itemDataMap.entries()), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _step5$value = _slicedToArray(_step5.value, 2);

          var $item = _step5$value[0];
          var datum = _step5$value[1];

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
          if (!_iteratorNormalCompletion5 && _iterator5['return']) {
            _iterator5['return']();
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
      var _this2 = this;

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

      // append elements all at once
      var fragment = document.createDocumentFragment();
      var values = this._$itemDataMap.values(); // iterator

      // enter
      this.data.forEach(function (datum) {
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = _getIterator(values), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
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
            if (!_iteratorNormalCompletion6 && _iterator6['return']) {
              _iterator6['return']();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }

        var _shapeConfiguration = _this2._shapeConfiguration;
        var ctor = _shapeConfiguration.ctor;
        var accessors = _shapeConfiguration.accessors;
        var options = _shapeConfiguration.options;

        var shape = new ctor(options);
        shape.install(accessors);

        var $el = shape.render(_this2._renderingContext);
        $el.classList.add('item', shape.getClassName());

        _this2._$itemShapeMap.set($el, shape);
        _this2._$itemDataMap.set($el, datum);

        fragment.appendChild($el);
      });

      this.$offset.appendChild(fragment);

      // remove
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = _getIterator(this._$itemDataMap.entries()), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var _step7$value = _slicedToArray(_step7.value, 2);

          var $item = _step7$value[0];
          var datum = _step7$value[1];

          if (this.data.indexOf(datum) !== -1) {
            continue;
          }

          var shape = this._$itemShapeMap.get($item);

          this.$offset.removeChild($item);
          shape.destroy();
          // a removed item cannot be selected
          if (this._behavior) {
            this._behavior.unselect($item, datum);
          }

          this._$itemDataMap['delete']($item);
          this._$itemShapeMap['delete']($item);
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7['return']) {
            _iterator7['return']();
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
      var _this3 = this;

      this._updateRenderingContext();
      // update common shapes
      this._$itemCommonShapeMap.forEach(function (shape, $item) {
        shape.update(_this3._renderingContext, _this3.data);
      });

      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = _getIterator(this._$itemDataMap.entries()), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var _step8$value = _slicedToArray(_step8.value, 2);

          var $item = _step8$value[0];
          var datum = _step8$value[1];

          var shape = this._$itemShapeMap.get($item);
          shape.update(this._renderingContext, datum);
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8['return']) {
            _iterator8['return']();
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
    },

    /**
     * Sets `LayerTimeContext`'s `start` time domain value.
     *
     * @type {Number}
     */
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
    },

    /**
     * Sets `LayerTimeContext`'s `offset` time domain value.
     *
     * @type {Number}
     */
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
    },

    /**
     * Sets `LayerTimeContext`'s `duration` time domain value.
     *
     * @type {Number}
     */
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
    },

    /**
     * Sets `LayerTimeContext`'s `stretchRatio` time domain value.
     *
     * @type {Number}
     */
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
    },

    /**
     * Returns the domain boundaries of the data for the y axis.
     *
     * @type {Array}
     */
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
    },

    /**
     * Returns the opacity of the whole layer.
     *
     * @type {Number}
     */
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
      return _Array$from(this._$itemDataMap.keys());
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
    },

    /**
     * Sets the data associated with the layer.
     *
     * @type {Object|Object[]}
     */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jb3JlL2xheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixRQUFROzs7O3lCQUNaLGFBQWE7Ozs7MkJBQ1QsaUJBQWlCOzs7OzZCQUNoQixtQkFBbUI7Ozs7NENBQ1Asb0NBQW9DOzs7OztBQUdwRSxJQUFJLG1CQUFtQixHQUFHLElBQUksQ0FBQztBQUMvQixJQUFJLHVCQUF1Qiw0Q0FBc0IsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTJCN0IsS0FBSztZQUFMLEtBQUs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCYixXQXRCUSxLQUFLLENBc0JaLFFBQVEsRUFBRSxJQUFJLEVBQWdCO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkF0QnJCLEtBQUs7O0FBdUJ0QiwrQkF2QmlCLEtBQUssNkNBdUJkOztBQUVSLFFBQU0sUUFBUSxHQUFHO0FBQ2YsWUFBTSxFQUFFLEdBQUc7QUFDWCxTQUFHLEVBQUUsQ0FBQztBQUNOLGFBQU8sRUFBRSxDQUFDO0FBQ1YsYUFBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNmLGVBQVMsRUFBRSxJQUFJO0FBQ2YsdUJBQWlCLEVBQUUsVUFBVTtBQUM3Qix5QkFBbUIsRUFBRSxDQUFDO0FBQ3RCLGNBQVEsRUFBRSxJQUFJO0FBQ2QsUUFBRSxFQUFFLEVBQUU7QUFDTixjQUFRLEVBQUUsUUFBUSxFQUNuQixDQUFDOzs7Ozs7O0FBTUYsUUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFjLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7Ozs7O0FBS25ELFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOztBQUV6QixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzs7QUFFeEIsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7O0FBRWhCLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDOztBQUV4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QUFPLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDO0tBQ3JDOzs7Ozs7Ozs7U0FPZSxlQUFHO0FBQ2pCLGFBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztLQUMzQjs7Ozs7Ozs7O1NBT1EsZUFBRztBQUNWLGFBQU8sWUFBVyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7S0FDOUM7Ozs7Ozs7OztTQU9PLGVBQUc7QUFBRSxhQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7S0FBRTs7Ozs7OztTQU96QixhQUFDLElBQUksRUFBRTtBQUNiLGNBQVEsSUFBSSxDQUFDLFFBQVE7QUFDbkIsYUFBSyxRQUFRO0FBQ1gsY0FBSSxJQUFJLENBQUMsS0FBSyxFQUFFOztBQUNkLGdCQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztXQUN0QixNQUFNO0FBQ0wsZ0JBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUNyQjtBQUNELGdCQUFNO0FBQUEsQUFDUixhQUFLLFlBQVk7QUFDZixjQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixnQkFBTTtBQUFBLE9BQ1Q7S0FDRjs7O1NBb0lnQixlQUFHO0FBQ2xCLGFBQU8sSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7S0FDM0Q7OztXQTNTa0Msc0NBQUMsSUFBSSxFQUFFO0FBQ3hDLDZCQUF1QixHQUFHLElBQUksQ0FBQztLQUNoQzs7O1NBaEhrQixLQUFLO0dBQVMsb0JBQU8sWUFBWTs7cUJBQWpDLEtBQUsiLCJmaWxlIjoic3JjL2NvcmUvbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgbnMgZnJvbSAnLi9uYW1lc3BhY2UnO1xuaW1wb3J0IHNjYWxlcyBmcm9tICcuLi91dGlscy9zY2FsZXMnO1xuaW1wb3J0IFNlZ21lbnQgZnJvbSAnLi4vc2hhcGVzL3NlZ21lbnQnO1xuaW1wb3J0IFRpbWVDb250ZXh0QmVoYXZpb3IgZnJvbSAnLi4vYmVoYXZpb3JzL3RpbWUtY29udGV4dC1iZWhhdmlvcic7XG5cbi8vIHRpbWUgY29udGV4dCBiYWhldmlvclxubGV0IHRpbWVDb250ZXh0QmVoYXZpb3IgPSBudWxsO1xubGV0IHRpbWVDb250ZXh0QmVoYXZpb3JDdG9yID0gVGltZUNvbnRleHRCZWhhdmlvcjtcblxuLyoqXG4gKiBUaGUgbGF5ZXIgY2xhc3MgaXMgdGhlIG1haW4gdmlzdWFsaXphdGlvbiBjbGFzcy4gSXQgaXMgbWFpbmx5IGRlZmluZXMgYnkgaXRzXG4gKiByZWxhdGVkIGBMYXllclRpbWVDb250ZXh0YCB3aGljaCBkZXRlcm1pbmVzIGl0cyBwb3NpdGlvbiBpbiB0aGUgb3ZlcmFsbFxuICogdGltZWxpbmUgKHRocm91Z2ggdGhlIGBzdGFydGAsIGBkdXJhdGlvbmAsIGBvZmZzZXRgIGFuZCBgc3RyZXRjaFJhdGlvYFxuICogYXR0cmlidXRlcykgYW5kIGJ5IGl0J3MgcmVnaXN0ZXJlZCBTaGFwZSB3aGljaCBkZWZpbmVzIGhvdyB0byBkaXNwbGF5IHRoZVxuICogZGF0YSBhc3NvY2lhdGVkIHRvIHRoZSBsYXllci4gRWFjaCBjcmVhdGVkIGxheWVyIG11c3QgYmUgaW5zZXJ0ZWQgaW50byBhXG4gKiBgVHJhY2tgIGluc3RhbmNlIGluIG9yZGVyIHRvIGJlIGRpc3BsYXllZC5cbiAqXG4gKiBfTm90ZTogaW4gdGhlIGNvbnRleHQgb2YgdGhlIGxheWVyLCBhbiBfX2l0ZW1fXyBpcyB0aGUgU1ZHIGVsZW1lbnRcbiAqIHJldHVybmVkIGJ5IGEgYFNoYXBlYCBpbnN0YW5jZSBhbmQgYXNzb2NpYXRlZCB3aXRoIGEgcGFydGljdWxhciBfX2RhdHVtX18uX1xuICpcbiAqICMjIyBMYXllciBET00gc3RydWN0dXJlXG4gKiBgYGBcbiAqIDxnIGNsYXNzPVwibGF5ZXJcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoJHtzdGFydH0sIDApXCI+XG4gKiAgIDxzdmcgY2xhc3M9XCJib3VuZGluZy1ib3hcIiB3aWR0aD1cIiR7ZHVyYXRpb259XCI+XG4gKiAgICAgPGcgY2xhc3M9XCJvZmZzZXRcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoJHtvZmZzZXQsIDB9KVwiPlxuICogICAgICAgPCEtLSBiYWNrZ3JvdW5kIC0tPlxuICogICAgICAgPHJlY3QgY2xhc3M9XCJiYWNrZ3JvdW5kXCI+PC9yZWN0PlxuICogICAgICAgPCEtLSBzaGFwZXMgYW5kIGNvbW1vbiBzaGFwZXMgYXJlIGluc2VydGVkIGhlcmUgLS0+XG4gKiAgICAgPC9nPlxuICogICAgIDxnIGNsYXNzPVwiaW50ZXJhY3Rpb25zXCI+PCEtLSBmb3IgZmVlZGJhY2sgLS0+PC9nPlxuICogICA8L3N2Zz5cbiAqIDwvZz5cbiAqIGBgYFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXllciBleHRlbmRzIGV2ZW50cy5FdmVudEVtaXR0ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGFUeXBlIC0gRGVmaW5lcyBob3cgdGhlIGxheWVyIHNob3VsZCBsb29rIGF0IHRoZSBkYXRhLlxuICAgKiAgICBDYW4gYmUgJ2VudGl0eScgb3IgJ2NvbGxlY3Rpb24nLlxuICAgKiBAcGFyYW0geyhBcnJheXxPYmplY3QpfSBkYXRhIC0gVGhlIGRhdGEgYXNzb2NpYXRlZCB0byB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQ29uZmlndXJlcyB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5oZWlnaHQ9MTAwXSAtIERlZmluZXMgdGhlIGhlaWdodCBvZiB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy50b3A9MF0gLSBEZWZpbmVzIHRoZSB0b3AgcG9zaXRpb24gb2YgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMub3BhY2l0eT0xXSAtIERlZmluZXMgdGhlIG9wYWNpdHkgb2YgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMueURvbWFpbj1bMCwxXV0gLSBEZWZpbmVzIGJvdW5kYXJpZXMgb2YgdGhlIGRhdGFcbiAgICogICAgdmFsdWVzIGluIHkgYXhpcyAoZm9yIGV4ZW1wbGUgdG8gZGlzcGxheSBhbiBhdWRpbyBidWZmZXIsIHRoaXMgYXR0cmlidXRlXG4gICAqICAgIHNob3VsZCBiZSBzZXQgdG8gWy0xLCAxXS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNsYXNzTmFtZT1udWxsXSAtIEFuIG9wdGlvbm5hbCBjbGFzcyB0byBhZGQgdG8gZWFjaFxuICAgKiAgICBjcmVhdGVkIHNoYXBlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY2xhc3NOYW1lPSdzZWxlY3RlZCddIC0gVGhlIGNsYXNzIHRvIGFkZCB0byBhIHNoYXBlXG4gICAqICAgIHdoZW4gc2VsZWN0ZWQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5jb250ZXh0SGFuZGxlcldpZHRoPTJdIC0gVGhlIHdpZHRoIG9mIHRoZSBoYW5kbGVyc1xuICAgKiAgICBkaXNwbGF5ZWQgdG8gZWRpdCB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5oaXR0YWJsZT1mYWxzZV0gLSBEZWZpbmVzIGlmIHRoZSBsYXllciBjYW4gYmUgaW50ZXJhY3RlZFxuICAgKiAgICB3aXRoLiBCYXNpY2FsbHksIHRoZSBsYXllciBpcyBub3QgcmV0dXJuZWQgYnkgYEJhc2VTdGF0ZS5nZXRIaXRMYXllcnNgIHdoZW5cbiAgICogICAgc2V0IHRvIGZhbHNlIChhIGNvbW1vbiB1c2UgY2FzZSBpcyBhIGxheWVyIHRoYXQgY29udGFpbnMgYSBjdXJzb3IpXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkYXRhVHlwZSwgZGF0YSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgaGVpZ2h0OiAxMDAsXG4gICAgICB0b3A6IDAsXG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgeURvbWFpbjogWzAsIDFdLFxuICAgICAgY2xhc3NOYW1lOiBudWxsLFxuICAgICAgc2VsZWN0ZWRDbGFzc05hbWU6ICdzZWxlY3RlZCcsXG4gICAgICBjb250ZXh0SGFuZGxlcldpZHRoOiAyLFxuICAgICAgaGl0dGFibGU6IHRydWUsIC8vIHdoZW4gZmFsc2UgdGhlIGxheWVyIGlzIG5vdCByZXR1cm5lZCBieSBgQmFzZVN0YXRlLmdldEhpdExheWVyc2BcbiAgICAgIGlkOiAnJywgLy8gdXNlZCA/XG4gICAgICBvdmVyZmxvdzogJ2hpZGRlbicsIC8vIHVzZWZ1bGwgP1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBQYXJhbWV0ZXJzIG9mIHRoZSBsYXllcnMsIGBkZWZhdWx0c2Agb3ZlcnJpZGVkIHdpdGggb3B0aW9ucy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIC8qKlxuICAgICAqIERlZmluZXMgaG93IHRoZSBsYXllciBzaG91bGQgbG9vayBhdCB0aGUgZGF0YSAoYCdlbnRpdHknYCBvciBgJ2NvbGxlY3Rpb24nYCkuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmRhdGFUeXBlID0gZGF0YVR5cGU7IC8vICdlbnRpdHknIHx8ICdjb2xsZWN0aW9uJztcbiAgICAvKiogQHR5cGUge0xheWVyVGltZUNvbnRleHR9ICovXG4gICAgdGhpcy50aW1lQ29udGV4dCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJGVsID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kYmFja2dyb3VuZCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJGJvdW5kaW5nQm94ID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kb2Zmc2V0ID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zID0gbnVsbDtcbiAgICAvKipcbiAgICAgKiBBIFNlZ21lbnQgaW5zdGFuY2lhdGVkIHRvIGludGVyYWN0IHdpdGggdGhlIExheWVyIGl0c2VsZi5cbiAgICAgKiBAdHlwZSB7U2VnbWVudH1cbiAgICAgKi9cbiAgICB0aGlzLmNvbnRleHRTaGFwZSA9IG51bGw7XG5cbiAgICB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb24gPSBudWxsOyAgICAgICAvLyB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9XG4gICAgdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uID0gbnVsbDsgLy8geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfVxuICAgIHRoaXMuXyRpdGVtU2hhcGVNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fJGl0ZW1EYXRhTWFwID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuXyRpdGVtQ29tbW9uU2hhcGVNYXAgPSBuZXcgTWFwKCk7XG5cbiAgICB0aGlzLl9pc0NvbnRleHRFZGl0YWJsZSA9IGZhbHNlO1xuICAgIHRoaXMuX2JlaGF2aW9yID0gbnVsbDtcblxuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG5cbiAgICB0aGlzLl92YWx1ZVRvUGl4ZWwgPSBzY2FsZXMubGluZWFyKClcbiAgICAgIC5kb21haW4odGhpcy5wYXJhbXMueURvbWFpbilcbiAgICAgIC5yYW5nZShbMCwgdGhpcy5wYXJhbXMuaGVpZ2h0XSk7XG5cbiAgICAvLyBpbml0aWFsaXplIHRpbWVDb250ZXh0IGxheW91dFxuICAgIHRoaXMuX3JlbmRlckNvbnRhaW5lcigpO1xuICAgIC8vIGNyZWF0ZXMgdGhlIHRpbWVDb250ZXh0QmVoYXZpb3IgZm9yIGFsbCBsYXllcnNcbiAgICBpZiAodGltZUNvbnRleHRCZWhhdmlvciA9PT0gbnVsbCkge1xuICAgICAgdGltZUNvbnRleHRCZWhhdmlvciA9IG5ldyB0aW1lQ29udGV4dEJlaGF2aW9yQ3RvcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBsYXllciwgY2xlYXIgYWxsIHJlZmVyZW5jZXMuXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMudGltZUNvbnRleHQgPSBudWxsO1xuICAgIHRoaXMuZGF0YSA9IG51bGw7XG4gICAgdGhpcy5wYXJhbXMgPSBudWxsO1xuICAgIHRoaXMuX2JlaGF2aW9yID0gbnVsbDtcblxuICAgIHRoaXMuXyRpdGVtU2hhcGVNYXAuY2xlYXIoKTtcbiAgICB0aGlzLl8kaXRlbURhdGFNYXAuY2xlYXIoKTtcbiAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwLmNsZWFyKCk7XG5cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93cyB0byBvdmVycmlkZSBkZWZhdWx0IHRoZSBgVGltZUNvbnRleHRCZWhhdmlvcmAgdXNlZCB0byBlZGl0IHRoZSBsYXllci5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGN0b3JcbiAgICovXG4gIHN0YXRpYyBjb25maWd1cmVUaW1lQ29udGV4dEJlaGF2aW9yKGN0b3IpIHtcbiAgICB0aW1lQ29udGV4dEJlaGF2aW9yQ3RvciA9IGN0b3I7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgc3RhcnRgIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHN0YXJ0KCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnN0YXJ0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYExheWVyVGltZUNvbnRleHRgJ3MgYHN0YXJ0YCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBzdGFydCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQuc3RhcnQgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGBMYXllclRpbWVDb250ZXh0YCdzIGBvZmZzZXRgIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5vZmZzZXQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgb2Zmc2V0YCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBvZmZzZXQodmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYExheWVyVGltZUNvbnRleHRgJ3MgYGR1cmF0aW9uYCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBkdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGBMYXllclRpbWVDb250ZXh0YCdzIGBkdXJhdGlvbmAgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgZHVyYXRpb24odmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgc3RyZXRjaFJhdGlvYCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBzdHJldGNoUmF0aW8oKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQuc3RyZXRjaFJhdGlvO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYExheWVyVGltZUNvbnRleHRgJ3MgYHN0cmV0Y2hSYXRpb2AgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgc3RyZXRjaFJhdGlvKHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC5zdHJldGNoUmF0aW8gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGRvbWFpbiBib3VuZGFyaWVzIG9mIHRoZSBkYXRhIGZvciB0aGUgeSBheGlzLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqL1xuICBzZXQgeURvbWFpbihkb21haW4pIHtcbiAgICB0aGlzLnBhcmFtcy55RG9tYWluID0gZG9tYWluO1xuICAgIHRoaXMuX3ZhbHVlVG9QaXhlbC5kb21haW4oZG9tYWluKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkb21haW4gYm91bmRhcmllcyBvZiB0aGUgZGF0YSBmb3IgdGhlIHkgYXhpcy5cbiAgICpcbiAgICogQHR5cGUge0FycmF5fVxuICAgKi9cbiAgZ2V0IHlEb21haW4oKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLnlEb21haW47XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgb3BhY2l0eSBvZiB0aGUgd2hvbGUgbGF5ZXIuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgb3BhY2l0eSh2YWx1ZSkge1xuICAgIHRoaXMucGFyYW1zLm9wYWNpdHkgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBvcGFjaXR5IG9mIHRoZSB3aG9sZSBsYXllci5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBvcGFjaXR5KCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRyYW5zZmVydCBmdW5jdGlvbiB1c2VkIHRvIGRpc3BsYXkgdGhlIGRhdGEgaW4gdGhlIHggYXhpcy5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCB0aW1lVG9QaXhlbCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0cmFuc2ZlcnQgZnVuY3Rpb24gdXNlZCB0byBkaXNwbGF5IHRoZSBkYXRhIGluIHRoZSB5IGF4aXMuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgdmFsdWVUb1BpeGVsKCkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZVRvUGl4ZWw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIGFsbCB0aGUgZGlzcGxheWVkIGl0ZW1zLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXk8RWxlbWVudD59XG4gICAqL1xuICBnZXQgaXRlbXMoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fJGl0ZW1EYXRhTWFwLmtleXMoKSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGF0YSBhc3NvY2lhdGVkIHRvIHRoZSBsYXllci5cbiAgICpcbiAgICogQHR5cGUge09iamVjdFtdfVxuICAgKi9cbiAgZ2V0IGRhdGEoKSB7IHJldHVybiB0aGlzLl9kYXRhOyB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGRhdGEgYXNzb2NpYXRlZCB3aXRoIHRoZSBsYXllci5cbiAgICpcbiAgICogQHR5cGUge09iamVjdHxPYmplY3RbXX1cbiAgICovXG4gIHNldCBkYXRhKGRhdGEpIHtcbiAgICBzd2l0Y2ggKHRoaXMuZGF0YVR5cGUpIHtcbiAgICAgIGNhc2UgJ2VudGl0eSc6XG4gICAgICAgIGlmICh0aGlzLl9kYXRhKSB7ICAvLyBpZiBkYXRhIGFscmVhZHkgZXhpc3RzLCByZXVzZSB0aGUgcmVmZXJlbmNlXG4gICAgICAgICAgdGhpcy5fZGF0YVswXSA9IGRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fZGF0YSA9IFtkYXRhXTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbGxlY3Rpb24nOlxuICAgICAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSW5pdGlhbGl6YXRpb25cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogUmVuZGVycyB0aGUgRE9NIGluIG1lbW9yeSBvbiBsYXllciBjcmVhdGlvbiB0byBiZSBhYmxlIHRvIHVzZSBpdCBiZWZvcmVcbiAgICogdGhlIGxheWVyIGlzIGFjdHVhbGx5IGluc2VydGVkIGluIHRoZSBET00uXG4gICAqL1xuICBfcmVuZGVyQ29udGFpbmVyKCkge1xuICAgIC8vIHdyYXBwZXIgZ3JvdXAgZm9yIGBzdGFydCwgdG9wIGFuZCBjb250ZXh0IGZsaXAgbWF0cml4XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZCgnbGF5ZXInKTtcbiAgICBpZiAodGhpcy5wYXJhbXMuY2xhc3NOYW1lICE9PSBudWxsKSB7XG4gICAgICB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKHRoaXMucGFyYW1zLmNsYXNzTmFtZSk7XG4gICAgfVxuICAgIC8vIGNsaXAgdGhlIGNvbnRleHQgd2l0aCBhIGBzdmdgIGVsZW1lbnRcbiAgICB0aGlzLiRib3VuZGluZ0JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3N2ZycpO1xuICAgIHRoaXMuJGJvdW5kaW5nQm94LmNsYXNzTGlzdC5hZGQoJ2JvdW5kaW5nLWJveCcpO1xuICAgIHRoaXMuJGJvdW5kaW5nQm94LnN0eWxlLm92ZXJmbG93ID0gdGhpcy5wYXJhbXMub3ZlcmZsb3c7XG4gICAgLy8gZ3JvdXAgdG8gYXBwbHkgb2Zmc2V0XG4gICAgdGhpcy4kb2Zmc2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuJG9mZnNldC5jbGFzc0xpc3QuYWRkKCdvZmZzZXQnLCAnaXRlbXMnKTtcbiAgICAvLyBsYXllciBiYWNrZ3JvdW5kXG4gICAgdGhpcy4kYmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAnMTAwJScpO1xuICAgIHRoaXMuJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgJzEwMCUnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoJ2JhY2tncm91bmQnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnN0eWxlLmZpbGxPcGFjaXR5ID0gMDtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG4gICAgLy8gY29udGV4dCBpbnRlcmFjdGlvbnNcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zLmNsYXNzTGlzdC5hZGQoJ2ludGVyYWN0aW9ucycpO1xuICAgIHRoaXMuJGludGVyYWN0aW9ucy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIC8vIEBOT1RFOiB3b3JrcyBidXQga2luZyBvZiB1Z2x5Li4uIHNob3VsZCBiZSBjbGVhbmVkXG4gICAgdGhpcy5jb250ZXh0U2hhcGUgPSBuZXcgU2VnbWVudCgpO1xuICAgIHRoaXMuY29udGV4dFNoYXBlLmluc3RhbGwoe1xuICAgICAgb3BhY2l0eTogKCkgPT4gMC4xLFxuICAgICAgY29sb3IgIDogKCkgPT4gJyM3ODc4NzgnLFxuICAgICAgd2lkdGggIDogKCkgPT4gdGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbixcbiAgICAgIGhlaWdodCA6ICgpID0+IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmRvbWFpbigpWzFdLFxuICAgICAgeSAgICAgIDogKCkgPT4gdGhpcy5fcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuZG9tYWluKClbMF1cbiAgICB9KTtcblxuICAgIHRoaXMuJGludGVyYWN0aW9ucy5hcHBlbmRDaGlsZCh0aGlzLmNvbnRleHRTaGFwZS5yZW5kZXIoKSk7XG4gICAgLy8gY3JlYXRlIHRoZSBET00gdHJlZVxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJGJvdW5kaW5nQm94KTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5hcHBlbmRDaGlsZCh0aGlzLiRvZmZzZXQpO1xuICAgIHRoaXMuJG9mZnNldC5hcHBlbmRDaGlsZCh0aGlzLiRiYWNrZ3JvdW5kKTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5hcHBlbmRDaGlsZCh0aGlzLiRpbnRlcmFjdGlvbnMpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ29tcG9uZW50IENvbmZpZ3VyYXRpb25cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogU2V0cyB0aGUgY29udGV4dCBvZiB0aGUgbGF5ZXIsIHRodXMgZGVmaW5pbmcgaXRzIGBzdGFydGAsIGBkdXJhdGlvbmAsXG4gICAqIGBvZmZzZXRgIGFuZCBgc3RyZXRjaFJhdGlvYC5cbiAgICpcbiAgICogQHBhcmFtIHtUaW1lQ29udGV4dH0gdGltZUNvbnRleHQgLSBUaGUgdGltZUNvbnRleHQgaW4gd2hpY2ggdGhlIGxheWVyIGlzIGRpc3BsYXllZC5cbiAgICovXG4gIHNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KSB7XG4gICAgdGhpcy50aW1lQ29udGV4dCA9IHRpbWVDb250ZXh0O1xuICAgIC8vIGNyZWF0ZSBhIG1peGluIHRvIHBhc3MgdG8gdGhlIHNoYXBlc1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQgPSB7fTtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBzaGFwZSBhbmQgaXRzIGNvbmZpZ3VyYXRpb24gdG8gdXNlIGluIG9yZGVyIHRvIHJlbmRlciB0aGUgZGF0YS5cbiAgICpcbiAgICogQHBhcmFtIHtCYXNlU2hhcGV9IGN0b3IgLSBUaGUgY29uc3RydWN0b3Igb2YgdGhlIHNoYXBlIHRvIGJlIHVzZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbYWNjZXNzb3JzPXt9XSAtIERlZmluZXMgaG93IHRoZSBzaGFwZSBzaG91bGQgYWRhcHQgdG8gYSBwYXJ0aWN1bGFyIGRhdGEgc3RydXR1cmUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gLSBHbG9iYWwgY29uZmlndXJhdGlvbiBmb3IgdGhlIHNoYXBlcywgaXMgc3BlY2lmaWMgdG8gZWFjaCBgU2hhcGVgLlxuICAgKi9cbiAgY29uZmlndXJlU2hhcGUoY3RvciwgYWNjZXNzb3JzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX3NoYXBlQ29uZmlndXJhdGlvbiA9IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH07XG4gIH1cblxuICAvKipcbiAgICogT3B0aW9ubmFseSByZWdpc3RlciBhIHNoYXBlIHRvIGJlIHVzZWQgYWNjcm9zIHRoZSBlbnRpcmUgY29sbGVjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtCYXNlU2hhcGV9IGN0b3IgLSBUaGUgY29uc3RydWN0b3Igb2YgdGhlIHNoYXBlIHRvIGJlIHVzZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbYWNjZXNzb3JzPXt9XSAtIERlZmluZXMgaG93IHRoZSBzaGFwZSBzaG91bGQgYWRhcHQgdG8gYSBwYXJ0aWN1bGFyIGRhdGEgc3RydXR1cmUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gLSBHbG9iYWwgY29uZmlndXJhdGlvbiBmb3IgdGhlIHNoYXBlcywgaXMgc3BlY2lmaWMgdG8gZWFjaCBgU2hhcGVgLlxuICAgKi9cbiAgY29uZmlndXJlQ29tbW9uU2hhcGUoY3RvciwgYWNjZXNzb3JzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiA9IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH07XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgdGhlIGJlaGF2aW9yIHRvIHVzZSB3aGVuIGludGVyYWN0aW5nIHdpdGggYSBzaGFwZS5cbiAgICpcbiAgICogQHBhcmFtIHtCYXNlQmVoYXZpb3J9IGJlaGF2aW9yXG4gICAqL1xuICBzZXRCZWhhdmlvcihiZWhhdmlvcikge1xuICAgIGJlaGF2aW9yLmluaXRpYWxpemUodGhpcyk7XG4gICAgdGhpcy5fYmVoYXZpb3IgPSBiZWhhdmlvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB2YWx1ZXMgc3RvcmVkIGludCB0aGUgYF9yZW5kZXJpbmdDb250ZXh0YCBwYXNzZWQgIHRvIHNoYXBlc1xuICAgKiBmb3IgcmVuZGVyaW5nIGFuZCB1cGRhdGluZy5cbiAgICovXG4gIF91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCkge1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwgPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsID0gdGhpcy5fdmFsdWVUb1BpeGVsO1xuXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC53aWR0aCAgPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24pO1xuICAgIC8vIGZvciBmb3JlaWduIG9iamVjdCBpc3N1ZSBpbiBjaHJvbWVcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0Lm9mZnNldFggPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQub2Zmc2V0KTtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnN0YXJ0WCA9IHRoaXMudGltZUNvbnRleHQucGFyZW50LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQuc3RhcnQpO1xuXG4gICAgLy8gQHRvZG8gcmVwbGFjZSB3aXRoIGBtaW5YYCBhbmQgYG1heFhgIHJlcHJlc2VudGluZyB0aGUgdmlzaWJsZSBwaXhlbHMgaW4gd2hpY2hcbiAgICAvLyB0aGUgc2hhcGVzIHNob3VsZCBiZSByZW5kZXJlZCwgY291bGQgYWxsb3cgdG8gbm90IHVwZGF0ZSB0aGUgRE9NIG9mIHNoYXBlc1xuICAgIC8vIHdobyBhcmUgbm90IGluIHRoaXMgYXJlYS5cbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnRyYWNrT2Zmc2V0WCA9IHRoaXMudGltZUNvbnRleHQucGFyZW50LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQucGFyZW50Lm9mZnNldCk7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC52aXNpYmxlV2lkdGggPSB0aGlzLnRpbWVDb250ZXh0LnBhcmVudC52aXNpYmxlV2lkdGg7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBCZWhhdmlvciBBY2Nlc3NvcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaXRlbXMgbWFya2VkIGFzIHNlbGVjdGVkLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXk8RWxlbWVudD59XG4gICAqL1xuICBnZXQgc2VsZWN0ZWRJdGVtcygpIHtcbiAgICByZXR1cm4gdGhpcy5fYmVoYXZpb3IgPyB0aGlzLl9iZWhhdmlvci5zZWxlY3RlZEl0ZW1zIDogW107XG4gIH1cblxuICAvKipcbiAgICogTWFyayBpdGVtKHMpIGFzIHNlbGVjdGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR8RWxlbWVudFtdfSAkaXRlbXNcbiAgICovXG4gIHNlbGVjdCguLi4kaXRlbXMpIHtcbiAgICBpZiAoIXRoaXMuX2JlaGF2aW9yKSB7IHJldHVybjsgfVxuICAgIGlmICghJGl0ZW1zLmxlbmd0aCkgeyAkaXRlbXMgPSB0aGlzLl8kaXRlbURhdGFNYXAua2V5cygpOyB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoJGl0ZW1zWzBdKSkgeyAkaXRlbXMgPSAkaXRlbXNbMF07IH1cblxuICAgIGZvciAobGV0ICRpdGVtIG9mICRpdGVtcykge1xuICAgICAgY29uc3QgZGF0dW0gPSB0aGlzLl8kaXRlbURhdGFNYXAuZ2V0KCRpdGVtKTtcbiAgICAgIHRoaXMuX2JlaGF2aW9yLnNlbGVjdCgkaXRlbSwgZGF0dW0pO1xuICAgICAgdGhpcy5fdG9Gcm9udCgkaXRlbSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgaXRlbShzKSBmcm9tIHNlbGVjdGVkIGl0ZW1zLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR8RWxlbWVudFtdfSAkaXRlbXNcbiAgICovXG4gIHVuc2VsZWN0KC4uLiRpdGVtcykge1xuICAgIGlmICghdGhpcy5fYmVoYXZpb3IpIHsgcmV0dXJuOyB9XG4gICAgaWYgKCEkaXRlbXMubGVuZ3RoKSB7ICRpdGVtcyA9IHRoaXMuXyRpdGVtRGF0YU1hcC5rZXlzKCk7IH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheSgkaXRlbXNbMF0pKSB7ICRpdGVtcyA9ICRpdGVtc1swXTsgfVxuXG4gICAgZm9yIChsZXQgJGl0ZW0gb2YgJGl0ZW1zKSB7XG4gICAgICBjb25zdCBkYXR1bSA9IHRoaXMuXyRpdGVtRGF0YU1hcC5nZXQoJGl0ZW0pO1xuICAgICAgdGhpcy5fYmVoYXZpb3IudW5zZWxlY3QoJGl0ZW0sIGRhdHVtKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlIGl0ZW0ocykgc2VsZWN0aW9uIHN0YXRlIGFjY29yZGluZyB0byB0aGVpciBjdXJyZW50IHN0YXRlLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR8RWxlbWVudFtdfSAkaXRlbXNcbiAgICovXG4gIHRvZ2dsZVNlbGVjdGlvbiguLi4kaXRlbXMpIHtcbiAgICBpZiAoIXRoaXMuX2JlaGF2aW9yKSB7IHJldHVybjsgfVxuICAgIGlmICghJGl0ZW1zLmxlbmd0aCkgeyAkaXRlbXMgPSB0aGlzLl8kaXRlbURhdGFNYXAua2V5cygpOyB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoJGl0ZW1zWzBdKSkgeyAkaXRlbXMgPSAkaXRlbXNbMF07IH1cblxuICAgIGZvciAobGV0ICRpdGVtIG9mICRpdGVtcykge1xuICAgICAgY29uc3QgZGF0dW0gPSB0aGlzLl8kaXRlbURhdGFNYXAuZ2V0KCRpdGVtKTtcbiAgICAgIHRoaXMuX2JlaGF2aW9yLnRvZ2dsZVNlbGVjdGlvbigkaXRlbSwgZGF0dW0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFZGl0IGl0ZW0ocykgYWNjb3JkaW5nIHRvIHRoZSBgZWRpdGAgZGVmaW5lZCBpbiB0aGUgcmVnaXN0ZXJlZCBgQmVoYXZpb3JgLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR8RWxlbWVudFtdfSAkaXRlbXMgLSBUaGUgaXRlbShzKSB0byBlZGl0LlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHggLSBUaGUgbW9kaWZpY2F0aW9uIHRvIGFwcGx5IGluIHRoZSB4IGF4aXMgKGluIHBpeGVscykuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkeSAtIFRoZSBtb2RpZmljYXRpb24gdG8gYXBwbHkgaW4gdGhlIHkgYXhpcyAoaW4gcGl4ZWxzKS5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkdGFyZ2V0IC0gVGhlIHRhcmdldCBvZiB0aGUgaW50ZXJhY3Rpb24gKGZvciBleGFtcGxlLCBsZWZ0XG4gICAqICAgIGhhbmRsZXIgRE9NIGVsZW1lbnQgaW4gYSBzZWdtZW50KS5cbiAgICovXG4gIGVkaXQoJGl0ZW1zLCBkeCwgZHksICR0YXJnZXQpIHtcbiAgICBpZiAoIXRoaXMuX2JlaGF2aW9yKSB7IHJldHVybjsgfVxuICAgICRpdGVtcyA9ICFBcnJheS5pc0FycmF5KCRpdGVtcykgPyBbJGl0ZW1zXSA6ICRpdGVtcztcblxuICAgIGZvciAobGV0ICRpdGVtIG9mICRpdGVtcykge1xuICAgICAgY29uc3Qgc2hhcGUgPSB0aGlzLl8kaXRlbVNoYXBlTWFwLmdldCgkaXRlbSk7XG4gICAgICBjb25zdCBkYXR1bSA9IHRoaXMuXyRpdGVtRGF0YU1hcC5nZXQoJGl0ZW0pO1xuXG4gICAgICB0aGlzLl9iZWhhdmlvci5lZGl0KHRoaXMuX3JlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCAkdGFyZ2V0KTtcbiAgICAgIHRoaXMuZW1pdCgnZWRpdCcsIHNoYXBlLCBkYXR1bSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgaWYgdGhlIGBMYXllcmAsIGFuZCB0aHVzIHRoZSBgTGF5ZXJUaW1lQ29udGV4dGAgaXMgZWRpdGFibGUgb3Igbm90LlxuICAgKlxuICAgKiBAcGFyYW1zIHtCb29sZWFufSBbYm9vbD10cnVlXVxuICAgKi9cbiAgc2V0Q29udGV4dEVkaXRhYmxlKGJvb2wgPSB0cnVlKSB7XG4gICAgY29uc3QgZGlzcGxheSA9IGJvb2wgPyAnYmxvY2snIDogJ25vbmUnO1xuICAgIHRoaXMuJGludGVyYWN0aW9ucy5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheTtcbiAgICB0aGlzLl9pc0NvbnRleHRFZGl0YWJsZSA9IGJvb2w7XG4gIH1cblxuICAvKipcbiAgICogRWRpdCB0aGUgbGF5ZXIgYW5kIHRodXMgaXRzIHJlbGF0ZWQgYExheWVyVGltZUNvbnRleHRgIGF0dHJpYnV0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkeCAtIFRoZSBtb2RpZmljYXRpb24gdG8gYXBwbHkgaW4gdGhlIHggYXhpcyAoaW4gcGl4ZWxzKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR5IC0gVGhlIG1vZGlmaWNhdGlvbiB0byBhcHBseSBpbiB0aGUgeSBheGlzIChpbiBwaXhlbHMpLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICR0YXJnZXQgLSBUaGUgdGFyZ2V0IG9mIHRoZSBldmVudCBvZiB0aGUgaW50ZXJhY3Rpb24uXG4gICAqL1xuICBlZGl0Q29udGV4dChkeCwgZHksICR0YXJnZXQpIHtcbiAgICB0aW1lQ29udGV4dEJlaGF2aW9yLmVkaXQodGhpcywgZHgsIGR5LCAkdGFyZ2V0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdHJldGNoIHRoZSBsYXllciBhbmQgdGh1cyBpdHMgcmVsYXRlZCBgTGF5ZXJUaW1lQ29udGV4dGAgYXR0cmlidXRlcy5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR4IC0gVGhlIG1vZGlmaWNhdGlvbiB0byBhcHBseSBpbiB0aGUgeCBheGlzIChpbiBwaXhlbHMpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHkgLSBUaGUgbW9kaWZpY2F0aW9uIHRvIGFwcGx5IGluIHRoZSB5IGF4aXMgKGluIHBpeGVscykuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJHRhcmdldCAtIFRoZSB0YXJnZXQgb2YgdGhlIGV2ZW50IG9mIHRoZSBpbnRlcmFjdGlvbi5cbiAgICovXG4gIHN0cmV0Y2hDb250ZXh0KGR4LCBkeSwgJHRhcmdldCkge1xuICAgIHRpbWVDb250ZXh0QmVoYXZpb3Iuc3RyZXRjaCh0aGlzLCBkeCwgZHksICR0YXJnZXQpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSGVscGVyc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGl0ZW0gZnJvbSBhIERPTSBlbGVtZW50IHJlbGF0ZWQgdG8gdGhlIHNoYXBlLCBudWxsIG90aGVyd2lzZS5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkZWwgLSB0aGUgZWxlbWVudCB0byBiZSB0ZXN0ZWRcbiAgICogQHJldHVybiB7RWxlbWVudHxudWxsfVxuICAgKi9cbiAgZ2V0SXRlbUZyb21ET01FbGVtZW50KCRlbCkge1xuICAgIGxldCAkaXRlbTtcblxuICAgIGRvIHtcbiAgICAgIGlmICgkZWwuY2xhc3NMaXN0ICYmICRlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2l0ZW0nKSkge1xuICAgICAgICAkaXRlbSA9ICRlbDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgICRlbCA9ICRlbC5wYXJlbnROb2RlO1xuICAgIH0gd2hpbGUgKCRlbCAhPT0gbnVsbCk7XG5cbiAgICByZXR1cm4gdGhpcy5oYXNJdGVtKCRpdGVtKSA/ICRpdGVtIDrCoG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGF0dW0gYXNzb2NpYXRlZCB0byBhIHNwZWNpZmljIGl0ZW0uXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGl0ZW1cbiAgICogQHJldHVybiB7T2JqZWN0fEFycmF5fG51bGx9XG4gICAqL1xuICBnZXREYXR1bUZyb21JdGVtKCRpdGVtKSB7XG4gICAgY29uc3QgZGF0dW0gPSB0aGlzLl8kaXRlbURhdGFNYXAuZ2V0KCRpdGVtKTtcbiAgICByZXR1cm4gZGF0dW0gPyBkYXR1bSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGF0dW0gYXNzb2NpYXRlZCB0byBhIHNwZWNpZmljIGl0ZW0gZnJvbSBhbnkgRE9NIGVsZW1lbnRcbiAgICogY29tcG9zaW5nIHRoZSBzaGFwZS4gQmFzaWNhbGx5IGEgc2hvcnRjdXQgZm9yIGBnZXRJdGVtRnJvbURPTUVsZW1lbnRgIGFuZFxuICAgKiBgZ2V0RGF0dW1Gcm9tSXRlbWAgbWV0aG9kcy5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkZWxcbiAgICogQHJldHVybiB7T2JqZWN0fEFycmF5fG51bGx9XG4gICAqL1xuICBnZXREYXR1bUZyb21ET01FbGVtZW50KCRlbCkge1xuICAgIHZhciAkaXRlbSA9IHRoaXMuZ2V0SXRlbUZyb21ET01FbGVtZW50KCRlbCk7XG4gICAgaWYgKCRpdGVtID09PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG4gICAgcmV0dXJuIHRoaXMuZ2V0RGF0dW1Gcm9tSXRlbSgkaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogVGVzdHMgaWYgdGhlIGdpdmVuIERPTSBlbGVtZW50IGlzIGFuIGl0ZW0gb2YgdGhlIGxheWVyLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRpdGVtIC0gVGhlIGl0ZW0gdG8gYmUgdGVzdGVkLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgaGFzSXRlbSgkaXRlbSkge1xuICAgIHJldHVybiB0aGlzLl8kaXRlbURhdGFNYXAuaGFzKCRpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGlmIGEgZ2l2ZW4gZWxlbWVudCBiZWxvbmdzIHRvIHRoZSBsYXllci4gSXMgbW9yZSBnZW5lcmFsIHRoYW5cbiAgICogYGhhc0l0ZW1gLCBjYW4gbW9zdGx5IHVzZWQgdG8gY2hlY2sgaW50ZXJhY3Rpb25zIGVsZW1lbnRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIFRoZSBET00gZWxlbWVudCB0byBiZSB0ZXN0ZWQuXG4gICAqIEByZXR1cm4ge2Jvb2x9XG4gICAqL1xuICBoYXNFbGVtZW50KCRlbCkge1xuICAgIGRvIHtcbiAgICAgIGlmICgkZWwgPT09IHRoaXMuJGVsKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAkZWwgPSAkZWwucGFyZW50Tm9kZTtcbiAgICB9IHdoaWxlICgkZWwgIT09IG51bGwpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGFsbCB0aGUgaXRlbXMgaW4gYSBnaXZlbiBhcmVhIGFzIGRlZmluZWQgaW4gdGhlIHJlZ2lzdGVyZWQgYFNoYXBlfmluQXJlYWAgbWV0aG9kLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXJlYSAtIFRoZSBhcmVhIGluIHdoaWNoIHRvIGZpbmQgdGhlIGVsZW1lbnRzXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhcmVhLnRvcFxuICAgKiBAcGFyYW0ge051bWJlcn0gYXJlYS5sZWZ0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhcmVhLndpZHRoXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhcmVhLmhlaWdodFxuICAgKiBAcmV0dXJuIHtBcnJheX0gLSBsaXN0IG9mIHRoZSBpdGVtcyBwcmVzZW50cyBpbiB0aGUgYXJlYVxuICAgKi9cbiAgZ2V0SXRlbXNJbkFyZWEoYXJlYSkge1xuICAgIGNvbnN0IHN0YXJ0ICAgID0gdGhpcy50aW1lQ29udGV4dC5wYXJlbnQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5zdGFydCk7XG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24pO1xuICAgIGNvbnN0IG9mZnNldCAgID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCk7XG4gICAgY29uc3QgdG9wICAgICAgPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgLy8gYmUgYXdhcmUgYWYgY29udGV4dCdzIHRyYW5zbGF0aW9ucyAtIGNvbnN0cmFpbiBpbiB3b3JraW5nIHZpZXdcbiAgICBsZXQgeDEgPSBNYXRoLm1heChhcmVhLmxlZnQsIHN0YXJ0KTtcbiAgICBsZXQgeDIgPSBNYXRoLm1pbihhcmVhLmxlZnQgKyBhcmVhLndpZHRoLCBzdGFydCArIGR1cmF0aW9uKTtcbiAgICB4MSAtPSAoc3RhcnQgKyBvZmZzZXQpO1xuICAgIHgyIC09IChzdGFydCArIG9mZnNldCk7XG4gICAgLy8ga2VlcCBjb25zaXN0ZW50IHdpdGggY29udGV4dCB5IGNvb3JkaW5hdGVzIHN5c3RlbVxuICAgIGxldCB5MSA9IHRoaXMucGFyYW1zLmhlaWdodCAtIChhcmVhLnRvcCArIGFyZWEuaGVpZ2h0KTtcbiAgICBsZXQgeTIgPSB0aGlzLnBhcmFtcy5oZWlnaHQgLSBhcmVhLnRvcDtcblxuICAgIHkxICs9IHRoaXMucGFyYW1zLnRvcDtcbiAgICB5MiArPSB0aGlzLnBhcmFtcy50b3A7XG5cbiAgICBjb25zdCAkZmlsdGVyZWRJdGVtcyA9IFtdO1xuXG4gICAgZm9yIChsZXQgWyRpdGVtLCBkYXR1bV0gb2YgdGhpcy5fJGl0ZW1EYXRhTWFwLmVudHJpZXMoKSkge1xuICAgICAgY29uc3Qgc2hhcGUgPSB0aGlzLl8kaXRlbVNoYXBlTWFwLmdldCgkaXRlbSk7XG4gICAgICBjb25zdCBpbkFyZWEgPSBzaGFwZS5pbkFyZWEodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKTtcblxuICAgICAgaWYgKGluQXJlYSkgeyAkZmlsdGVyZWRJdGVtcy5wdXNoKCRpdGVtKTsgfVxuICAgIH1cblxuICAgIHJldHVybiAkZmlsdGVyZWRJdGVtcztcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyAvIERpc3BsYXkgbWV0aG9kc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBNb3ZlcyBhbiBpdGVtIHRvIHRoZSBlbmQgb2YgdGhlIGxheWVyIHRvIGRpc3BsYXkgaXQgZnJvbnQgb2YgaXRzXG4gICAqIHNpYmxpbmdzIChzdmcgei1pbmRleC4uLikuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGl0ZW0gLSBUaGUgaXRlbSB0byBiZSBtb3ZlZC5cbiAgICovXG4gIF90b0Zyb250KCRpdGVtKSB7XG4gICAgdGhpcy4kb2Zmc2V0LmFwcGVuZENoaWxkKCRpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIERPTSBzdHJ1Y3R1cmUgb2YgdGhlIHNoYXBlcyBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIGRhdGEuIEluc3BpcmVkXG4gICAqIGZyb20gdGhlIGBlbnRlcmAgYW5kIGBleGl0YCBkMy5qcyBwYXJhZGlnbSwgdGhpcyBtZXRob2Qgc2hvdWxkIGJlIGNhbGxlZFxuICAgKiBlYWNoIHRpbWUgYSBkYXR1bSBpcyBhZGRlZCBvciByZW1vdmVkIGZyb20gdGhlIGRhdGEuIFdoaWxlIHRoZSBET00gaXNcbiAgICogY3JlYXRlZCB0aGUgYHVwZGF0ZWAgbWV0aG9kIG11c3QgYmUgY2FsbGVkIGluIG9yZGVyIHRvIHVwZGF0ZSB0aGUgc2hhcGVzXG4gICAqIGF0dHJpYnV0ZXMgYW5kIHRodXMgcGxhY2UgdGhlbSB3aGVyZSB0aGV5IHNob3VsZC5cbiAgICovXG4gIHJlbmRlcigpIHtcbiAgICAvLyByZW5kZXIgYGNvbW1vblNoYXBlYCBvbmx5IG9uY2VcbiAgICBpZiAoXG4gICAgICB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb24gIT09IG51bGwgJiZcbiAgICAgIHRoaXMuXyRpdGVtQ29tbW9uU2hhcGVNYXAuc2l6ZSA9PT0gMFxuICAgICkge1xuICAgICAgY29uc3QgeyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfSA9IHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbjtcbiAgICAgIGNvbnN0ICRncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAgIGNvbnN0IHNoYXBlID0gbmV3IGN0b3Iob3B0aW9ucyk7XG5cbiAgICAgIHNoYXBlLmluc3RhbGwoYWNjZXNzb3JzKTtcbiAgICAgICRncm91cC5hcHBlbmRDaGlsZChzaGFwZS5yZW5kZXIoKSk7XG4gICAgICAkZ3JvdXAuY2xhc3NMaXN0LmFkZCgnaXRlbScsICdjb21tb24nLCBzaGFwZS5nZXRDbGFzc05hbWUoKSk7XG5cbiAgICAgIHRoaXMuXyRpdGVtQ29tbW9uU2hhcGVNYXAuc2V0KCRncm91cCwgc2hhcGUpO1xuICAgICAgdGhpcy4kb2Zmc2V0LmFwcGVuZENoaWxkKCRncm91cCk7XG4gICAgfVxuXG4gICAgLy8gYXBwZW5kIGVsZW1lbnRzIGFsbCBhdCBvbmNlXG4gICAgY29uc3QgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5fJGl0ZW1EYXRhTWFwLnZhbHVlcygpOyAvLyBpdGVyYXRvclxuXG4gICAgLy8gZW50ZXJcbiAgICB0aGlzLmRhdGEuZm9yRWFjaCgoZGF0dW0pID0+IHtcbiAgICAgIGZvciAobGV0IHZhbHVlIG9mIHZhbHVlcykgeyBpZiAodmFsdWUgPT09IGRhdHVtKSB7IHJldHVybjsgfSB9XG5cbiAgICAgIGNvbnN0IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH0gPSB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb247XG4gICAgICBjb25zdCBzaGFwZSA9IG5ldyBjdG9yKG9wdGlvbnMpO1xuICAgICAgc2hhcGUuaW5zdGFsbChhY2Nlc3NvcnMpO1xuXG4gICAgICBjb25zdCAkZWwgPSBzaGFwZS5yZW5kZXIodGhpcy5fcmVuZGVyaW5nQ29udGV4dCk7XG4gICAgICAkZWwuY2xhc3NMaXN0LmFkZCgnaXRlbScsIHNoYXBlLmdldENsYXNzTmFtZSgpKTtcblxuICAgICAgdGhpcy5fJGl0ZW1TaGFwZU1hcC5zZXQoJGVsLCBzaGFwZSk7XG4gICAgICB0aGlzLl8kaXRlbURhdGFNYXAuc2V0KCRlbCwgZGF0dW0pO1xuXG4gICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCgkZWwpO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kb2Zmc2V0LmFwcGVuZENoaWxkKGZyYWdtZW50KTtcblxuICAgIC8vIHJlbW92ZVxuICAgIGZvciAobGV0IFskaXRlbSwgZGF0dW1dIG9mIHRoaXMuXyRpdGVtRGF0YU1hcC5lbnRyaWVzKCkpIHtcbiAgICAgIGlmICh0aGlzLmRhdGEuaW5kZXhPZihkYXR1bSkgIT09IC0xKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fJGl0ZW1TaGFwZU1hcC5nZXQoJGl0ZW0pO1xuXG4gICAgICB0aGlzLiRvZmZzZXQucmVtb3ZlQ2hpbGQoJGl0ZW0pO1xuICAgICAgc2hhcGUuZGVzdHJveSgpO1xuICAgICAgLy8gYSByZW1vdmVkIGl0ZW0gY2Fubm90IGJlIHNlbGVjdGVkXG4gICAgICBpZiAodGhpcy5fYmVoYXZpb3IpIHtcbiAgICAgICAgdGhpcy5fYmVoYXZpb3IudW5zZWxlY3QoJGl0ZW0sIGRhdHVtKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fJGl0ZW1EYXRhTWFwLmRlbGV0ZSgkaXRlbSk7XG4gICAgICB0aGlzLl8kaXRlbVNoYXBlTWFwLmRlbGV0ZSgkaXRlbSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGNvbnRhaW5lciBvZiB0aGUgbGF5ZXIgYW5kIHRoZSBhdHRyaWJ1dGVzIG9mIHRoZSBleGlzdGluZyBzaGFwZXMuXG4gICAqL1xuICB1cGRhdGUoKSB7XG4gICAgdGhpcy51cGRhdGVDb250YWluZXIoKTtcbiAgICB0aGlzLnVwZGF0ZVNoYXBlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGNvbnRhaW5lciBvZiB0aGUgbGF5ZXIuXG4gICAqL1xuICB1cGRhdGVDb250YWluZXIoKSB7XG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpO1xuXG4gICAgY29uc3QgdGltZUNvbnRleHQgPSB0aGlzLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IHdpZHRoICA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRpbWVDb250ZXh0LmR1cmF0aW9uKTtcbiAgICAvLyB4IGlzIHJlbGF0aXZlIHRvIHRpbWVsaW5lJ3MgdGltZUNvbnRleHRcbiAgICBjb25zdCB4ICAgICAgPSB0aW1lQ29udGV4dC5wYXJlbnQudGltZVRvUGl4ZWwodGltZUNvbnRleHQuc3RhcnQpO1xuICAgIGNvbnN0IG9mZnNldCA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRpbWVDb250ZXh0Lm9mZnNldCk7XG4gICAgY29uc3QgdG9wICAgID0gdGhpcy5wYXJhbXMudG9wO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICAvLyBtYXRyaXggdG8gaW52ZXJ0IHRoZSBjb29yZGluYXRlIHN5c3RlbVxuICAgIGNvbnN0IHRyYW5zbGF0ZU1hdHJpeCA9IGBtYXRyaXgoMSwgMCwgMCwgLTEsICR7eH0sICR7dG9wICsgaGVpZ2h0fSlgO1xuXG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHRyYW5zbGF0ZU1hdHJpeCk7XG5cbiAgICB0aGlzLiRib3VuZGluZ0JveC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG5cbiAgICB0aGlzLiRvZmZzZXQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHtvZmZzZXR9LCAwKWApO1xuICAgIC8vIG1haW50YWluIGNvbnRleHQgc2hhcGVcbiAgICB0aGlzLmNvbnRleHRTaGFwZS51cGRhdGUodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgdGhpcy50aW1lQ29udGV4dCwgMCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgYXR0cmlidXRlcyBvZiBhbGwgdGhlIGBTaGFwZWAgaW5zdGFuY2VzIHJlbmRlcmVkIGludG8gdGhlIGxheWVyLlxuICAgKlxuICAgKiBAdG9kbyAtIGFsbG93IHRvIGZpbHRlciB3aGljaCBzaGFwZShzKSBzaG91bGQgYmUgdXBkYXRlZC5cbiAgICovXG4gIHVwZGF0ZVNoYXBlcygpIHtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCk7XG4gICAgLy8gdXBkYXRlIGNvbW1vbiBzaGFwZXNcbiAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwLmZvckVhY2goKHNoYXBlLCAkaXRlbSkgPT4ge1xuICAgICAgc2hhcGUudXBkYXRlKHRoaXMuX3JlbmRlcmluZ0NvbnRleHQsIHRoaXMuZGF0YSk7XG4gICAgfSk7XG5cbiAgICBmb3IgKGxldCBbJGl0ZW0sIGRhdHVtXSBvZiB0aGlzLl8kaXRlbURhdGFNYXAuZW50cmllcygpKSB7XG4gICAgICBjb25zdCBzaGFwZSA9IHRoaXMuXyRpdGVtU2hhcGVNYXAuZ2V0KCRpdGVtKTtcbiAgICAgIHNoYXBlLnVwZGF0ZSh0aGlzLl9yZW5kZXJpbmdDb250ZXh0LCBkYXR1bSk7XG4gICAgfVxuICB9XG59XG4iXX0=