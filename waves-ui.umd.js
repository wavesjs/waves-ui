(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.wavesUI = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _namespace = require('../core/namespace');

var _namespace2 = _interopRequireDefault(_namespace);

var _layer = require('../core/layer');

var _layer2 = _interopRequireDefault(_layer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Simplified Layer for Axis. The main difference with a regular layer is that
 * an axis layer use the `Timeline~timeContext` attributes to render it's layout
 * and stay synchronized with the tracks visible area. All getters and setters
 * to the `TimelineTimeContext` attributes are bypassed.
 *
 * It also handle it's own data and its updates. The `_generateData` method is
 * responsible to create some usefull data to visualize
 *
 * [example usage of the layer-axis](./examples/layer-axis.html)
 */
var AxisLayer = function (_Layer) {
  (0, _inherits3.default)(AxisLayer, _Layer);

  /**
   * @param {Function} generator - A function to create data according to
   *    the `Timeline~timeContext`.
   * @param {Object} options - Layer options, cf. Layer for available options.
   */
  function AxisLayer(generator, options) {
    (0, _classCallCheck3.default)(this, AxisLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AxisLayer.__proto__ || (0, _getPrototypeOf2.default)(AxisLayer)).call(this, 'entity', [], options));

    _this._generator = generator;
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(AxisLayer, [{
    key: '_generateData',


    /**
     * This method is the main difference with a classical layer. An `AxisLayer`
     * instance generates and maintains it's own data.
     */
    value: function _generateData() {
      var data = this._generator(this.timeContext);
      // prepend first arguments of splice for an apply
      data.unshift(0, this.data[0].length);
      // make sure to keep the same reference
      Array.prototype.splice.apply(this.data[0], data);
    }

    /**
     * Updates the rendering context for the shapes.
     */

  }, {
    key: '_updateRenderingContext',
    value: function _updateRenderingContext() {
      this._renderingContext.timeToPixel = this.timeContext.timeToPixel;
      this._renderingContext.valueToPixel = this._valueToPixel;
      this._renderingContext.height = this.params.height;
      // this._renderingContext.width  = this.timeContext.timeToPixel(this.timeContext.duration);

      // for foreign object issue in chrome
      this._renderingContext.offsetX = this.timeContext.timeToPixel(this.timeContext.offset);
      this._renderingContext.visibleWidth = this.timeContext.visibleWidth;
    }

    /**
     * Generates the data and update the layer.
     */

  }, {
    key: 'update',
    value: function update() {
      this._generateData();
      (0, _get3.default)(AxisLayer.prototype.__proto__ || (0, _getPrototypeOf2.default)(AxisLayer.prototype), 'update', this).call(this);
    }

    /**
     * Render the DOM in memory on layer creation to be able to use it before
     * the layer is actually inserted in the DOM
     */

  }, {
    key: '_renderContainer',
    value: function _renderContainer() {
      // wrapper group for `start, top and context flip matrix
      this.$el = document.createElementNS(_namespace2.default, 'g');
      if (this.params.className !== null) {
        this.$el.classList.add('layer', this.params.className);
      }

      // group to apply offset
      this.$offset = document.createElementNS(_namespace2.default, 'g');
      this.$offset.classList.add('offset', 'items');
      // layer background
      this.$background = document.createElementNS(_namespace2.default, 'rect');
      this.$background.classList.add('background');
      this.$background.style.fillOpacity = 0;
      this.$background.style.pointerEvents = 'none';
      // create the DOM tree
      this.$el.appendChild(this.$offset);
      this.$offset.appendChild(this.$background);
    }

    /**
     * Updates the layout of the layer.
     */

  }, {
    key: 'updateContainer',
    value: function updateContainer() {
      this._updateRenderingContext();

      var top = this.params.top;
      var height = this.params.height;
      var left = Math.max(0, -this._renderingContext.offsetX);
      // matrix to invert the coordinate system
      var translateMatrix = 'matrix(1, 0, 0, -1, 0, ' + (top + height) + ')';
      this.$el.setAttributeNS(null, 'transform', translateMatrix);

      // keep background on the visible area
      this.$background.setAttributeNS(null, 'height', height);
      this.$background.setAttributeNS(null, 'width', this.timeContext.visibleWidth);
      this.$background.setAttributeNS(null, 'x', left);
    }
  }, {
    key: 'stretchRatio',
    set: function set(value) {
      return;
    }
    /** @private */
    ,

    /** @private */
    get: function get() {
      return;
    }
    /** @private */

  }, {
    key: 'offset',
    set: function set(value) {
      return;
    }
    /** @private */
    ,
    get: function get() {
      return;
    }
    /** @private */

  }, {
    key: 'start',
    set: function set(value) {
      return;
    }
    /** @private */
    ,
    get: function get() {
      return;
    }
    /** @private */

  }, {
    key: 'duration',
    set: function set(value) {
      return;
    },
    get: function get() {
      return;
    }

    /**
     * The generator that creates the data to be rendered to display the axis.
     *
     * @type {Function}
     */

  }, {
    key: 'generator',
    set: function set(func) {
      this._generator = func;
    }

    /**
     * The generator that creates the data to be rendered to display the axis.
     *
     * @type {Function}
     */
    ,
    get: function get() {
      return this._generator;
    }
  }]);
  return AxisLayer;
}(_layer2.default);

exports.default = AxisLayer;

},{"../core/layer":11,"../core/namespace":12,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * A generator to create data for grid axis according to a `bpm` and a `meter`.
 *
 * [example usage](./examples/layer-axis.html)
 *
 * @param {Number} bpm - Number of beats per minutes
 * @param {String} signature - Meter of the mesure (`'4/4'`, `'3/8'`, ...)
 * @return {Function} - Function that generate data to be diplayed
 */
function gridAxisGenerator(bpm, signature) {
  var _bps = bpm / 60; // sec
  var _unit = 1 / parseInt(signature.split('/')[1], 10);
  var _nbrUnitsPerMesure = parseInt(signature.split('/')[0], 10);

  return function (timeContext) {
    var duration = timeContext.visibleDuration;
    var offset = timeContext.offset;
    var data = [];

    // const min = Math.min(-offset, 0);
    var min = -offset;
    // remove the timeline's offset to keep the layer centered
    var max = duration - offset;

    // define pixels for 1 second
    var pixelsPerSecond = timeContext.computedPixelsPerSecond;
    // time for one _unit
    var unitTime = 1 / _bps;
    // define the first tick > min
    var modulo = min % unitTime;
    var mult = (min - modulo) / unitTime;
    var firstTickTime = unitTime * mult;
    // track which position of current beat in the mesure
    var positionInMesure = mult % _nbrUnitsPerMesure;

    // remove not focused beats, if zoomed out
    var pixelsPerTick = pixelsPerSecond / _bps;
    var minStep = 5;

    // time should be
    for (var time = firstTickTime; time < max; time += unitTime) {
      // find first beat
      var focused = positionInMesure++ % _nbrUnitsPerMesure === 0;
      // ignore if pixels per ticks is too small
      if (pixelsPerTick <= minStep && !focused) {
        continue;
      }

      data.push({ time: time, focused: focused });
    }

    return data;
  };
}

exports.default = gridAxisGenerator;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = timeAxisGenerator;

var _format = require('../utils/format');

/**
 * A generator to create data for time axis.
 *
 * [example usage](./examples/layer-axis.html)
 *
 * @return {Function} - The configured function returning the data when called.
 */
function timeAxisGenerator() {
  // add factory to share API with bpmGenerator
  return function (timeContext) {
    var duration = timeContext.visibleDuration;
    var offset = timeContext.offset;
    var data = [];

    // const min = Math.min(-offset, 0);
    var min = -offset;
    // remove the timeline's offset to keep the layer centered
    var max = duration - offset;

    // define pixels for 1 second
    var pixelsPerSecond = timeContext.computedPixelsPerSecond;
    var minStep = 7;

    // define all display information according to the pixelsPerSecond ratio
    var step = void 0,
        type = void 0,
        toFixed = void 0,
        markerModulo = void 0,
        includeModulo = void 0;

    if (pixelsPerSecond * 4 > minStep) {
      step = 1; // the step to use to compute time
      toFixed = 0;
      markerModulo = 60; // a timestamp every 5 stepixelsPerSecond
      includeModulo = 5; // a tick every 5 stepixelsPerSecond
      type = '60sec';
    }

    if (pixelsPerSecond * 2 > minStep) {
      step = 1;
      toFixed = 0;
      markerModulo = 30;
      includeModulo = 1;
      type = '30sec';
    }

    if (pixelsPerSecond > minStep) {
      step = 1;
      toFixed = 0;
      markerModulo = 10;
      includeModulo = 1;
      type = 'sec';
    }

    if (pixelsPerSecond / 10 > minStep) {
      step = 1 / 10;
      toFixed = 1;
      markerModulo = 10;
      includeModulo = 1;
      type = 'ds';
    }

    if (pixelsPerSecond / 100 > minStep) {
      step = 1 / 100;
      toFixed = 2;
      markerModulo = 10;
      includeModulo = 1;
      type = 'cs';
    }

    if (pixelsPerSecond / 1000 > minStep) {
      step = 1 / 1000;
      toFixed = 3;
      markerModulo = 10;
      includeModulo = 1;
      type = 'ms';
    }

    for (var time = min; time < max; time += step) {
      var formattedTime = time.toFixed(toFixed);

      if (Math.round(formattedTime / step) % includeModulo !== 0) {
        continue;
      }

      // avoid floating point errors
      var focused = Math.round(formattedTime / step) % markerModulo === 0 ? true : false;

      var datum = { time: formattedTime, focused: focused };

      if (focused === true) {
        var date = new Date(1000 * formattedTime);
        var _min = (0, _format.padLeft)(date.getMinutes(), 0, 2);
        var sec = (0, _format.padLeft)(date.getSeconds(), 0, 2);
        var milli = (0, _format.padLeft)(date.getMilliseconds(), 0, 3);
        var label = _min + ':' + sec + ':' + milli;

        datum.label = label;
      }

      data.push(datum);
    }

    return data;
  };
}

},{"../utils/format":53}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Is an abstract class or interface to be overriden in order to define the way
 * a given shape should behave when selected or edited by a user. Instances of
 * `BaseBehavior` are internally used by `Layer` instances to modify the data
 * according to a user interaction and a given shape. A single instance of
 * `Behavior` is created in one given shape.
 *
 * By default, the only method to override to define a new behavior for a
 * shape is the `edit` method. However, if needed in special cases, all the
 * selection handling can be overriden too.
 *
 * The flow is the following:
 * `Event`  - (forwarded to) -> `Layer` - (command) -> `Behavior` - (modify) -> `data` - (upates) -> `Shape`
 *
 * The behavior responsability is then to modify the data according to the
 * user interactions, while shapes are always a view of the current state of the
 * data.
 */
var BaseBehavior = function () {
  function BaseBehavior() {
    (0, _classCallCheck3.default)(this, BaseBehavior);

    this._selectedItems = new _set2.default(); // no duplicate in Set
    this._selectedClass = null;
    this._layer = null;
  }

  (0, _createClass3.default)(BaseBehavior, [{
    key: 'initialize',
    value: function initialize(layer) {
      this._layer = layer;
      this._selectedClass = layer.params.selectedClassName;
    }

    /**
     * Destroy the references to the selected items.
     *
     * @type {String}
     * @todo - rename to `clearSelection` (removing the class) ?
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this._selectedItems.clear();
    }

    /**
     * The class to add to the shapes when selected.
     *
     * @type {String}
     */

  }, {
    key: 'select',


    /**
     * @param {Element} $item - The item to select.
     * @param {Object} datum - Not used in this implementation. Could be
     *    used to mark the data as selected.
     * @todo - Pass the shape object to get the accessors ?
     */
    value: function select($item, datum) {
      $item.classList.add(this.selectedClass);
      this._selectedItems.add($item);
    }

    /**
     * @param {Element} $item - The item to unselect.
     * @param {Object} datum - Not used in this implementation. Could be
     *    used to mark the data as selected.
     * @todo - Pass the shape object to get the accessors ?
     */

  }, {
    key: 'unselect',
    value: function unselect($item, datum) {
      $item.classList.remove(this.selectedClass);
      this._selectedItems.delete($item);
    }

    /**
     * @param {Element} $item - The item to toggle selection.
     * @param {Object} datum - Not used in this implementation. Could be
     *    used to mark the data as selected.
     * @todo - Pass the shape object to get the accessors ?
     */

  }, {
    key: 'toggleSelection',
    value: function toggleSelection($item, datum) {
      var method = this._selectedItems.has($item) ? 'unselect' : 'select';
      this[method]($item);
    }

    /**
     * Interface method to override in order to define its particular behavior when
     * interacted with.
     *
     * @param {Object} renderingContext - The layer rendering context.
     * @param {BaseShape} shape - The shape object to be edited.
     * @param {Object|Array} datum - The related datum to modify.
     * @param {Number} dx - The value of the interaction in the x axis (in pixels).
     * @param {Number} dy - The value of the interaction in the y axis (in pixels).
     * @param {Element} $target - The target DOM element of the interaction.
     */

  }, {
    key: 'edit',
    value: function edit(renderingContext, shape, datum, dx, dy, $target) {
      // must be implemented in children
    }
  }, {
    key: 'selectedClass',
    set: function set(value) {
      this._selectedClass = value;
    }

    /**
     * The class to add to the shapes when selected.
     *
     * @type {String}
     */
    ,
    get: function get() {
      return this._selectedClass;
    }

    /**
     * An array containing all the selected items of the layer.
     *
     * @type {Array}
     */

  }, {
    key: 'selectedItems',
    get: function get() {
      return [].concat((0, _toConsumableArray3.default)(this._selectedItems));
    }
  }]);
  return BaseBehavior;
}();

exports.default = BaseBehavior;

},{"babel-runtime/core-js/set":67,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/toConsumableArray":76}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _baseBehavior = require('./base-behavior');

var _baseBehavior2 = _interopRequireDefault(_baseBehavior);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Defines the default behavior for a breakpoint function.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */
var BreakpointBehavior = function (_BaseBehavior) {
  (0, _inherits3.default)(BreakpointBehavior, _BaseBehavior);

  function BreakpointBehavior() {
    (0, _classCallCheck3.default)(this, BreakpointBehavior);
    return (0, _possibleConstructorReturn3.default)(this, (BreakpointBehavior.__proto__ || (0, _getPrototypeOf2.default)(BreakpointBehavior)).apply(this, arguments));
  }

  (0, _createClass3.default)(BreakpointBehavior, [{
    key: 'edit',
    value: function edit(renderingContext, shape, datum, dx, dy, target) {
      var data = this._layer.data;
      var layerHeight = renderingContext.height;
      // current position
      var x = renderingContext.timeToPixel(shape.cx(datum));
      var y = renderingContext.valueToPixel(shape.cy(datum));
      // target position
      var targetX = x + dx;
      var targetY = y - dy;

      if (data.length > 2) {
        // create a sorted map of all `x` positions
        var xMap = data.map(function (d) {
          return renderingContext.timeToPixel(shape.cx(d));
        });
        xMap.sort(function (a, b) {
          return a < b ? -1 : 1;
        });
        // find index of our shape x position
        var index = xMap.indexOf(x);
        // lock to next siblings
        if (targetX < xMap[index - 1] || targetX > xMap[index + 1]) {
          targetX = x;
        }
      }

      // lock in y axis
      if (targetY < 0) {
        targetY = 0;
      } else if (targetY > layerHeight) {
        targetY = layerHeight;
      }

      // update datum with new values
      shape.cx(datum, renderingContext.timeToPixel.invert(targetX));
      shape.cy(datum, renderingContext.valueToPixel.invert(targetY));
    }
  }]);
  return BreakpointBehavior;
}(_baseBehavior2.default);

exports.default = BreakpointBehavior;

},{"./base-behavior":4,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _baseBehavior = require('./base-behavior');

var _baseBehavior2 = _interopRequireDefault(_baseBehavior);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Defines the default behavior for a marker.
 *
 * [example usage](./examples/layer-marker.html)
 */
var MarkerBehavior = function (_BaseBehavior) {
  (0, _inherits3.default)(MarkerBehavior, _BaseBehavior);

  function MarkerBehavior() {
    (0, _classCallCheck3.default)(this, MarkerBehavior);
    return (0, _possibleConstructorReturn3.default)(this, (MarkerBehavior.__proto__ || (0, _getPrototypeOf2.default)(MarkerBehavior)).apply(this, arguments));
  }

  (0, _createClass3.default)(MarkerBehavior, [{
    key: 'edit',
    value: function edit(renderingContext, shape, datum, dx, dy, target) {
      var x = renderingContext.timeToPixel(shape.x(datum));
      var targetX = x + dx > 0 ? x + dx : 0;

      shape.x(datum, renderingContext.timeToPixel.invert(targetX));
    }
  }]);
  return MarkerBehavior;
}(_baseBehavior2.default);

exports.default = MarkerBehavior;

},{"./base-behavior":4,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _baseBehavior = require('./base-behavior');

var _baseBehavior2 = _interopRequireDefault(_baseBehavior);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Defines the default behavior for a segment.
 *
 * [example usage](./examples/layer-marker.html)
 */
var SegmentBehavior = function (_BaseBehavior) {
  (0, _inherits3.default)(SegmentBehavior, _BaseBehavior);

  function SegmentBehavior() {
    (0, _classCallCheck3.default)(this, SegmentBehavior);
    return (0, _possibleConstructorReturn3.default)(this, (SegmentBehavior.__proto__ || (0, _getPrototypeOf2.default)(SegmentBehavior)).apply(this, arguments));
  }

  (0, _createClass3.default)(SegmentBehavior, [{
    key: 'edit',
    value: function edit(renderingContext, shape, datum, dx, dy, target) {
      var classList = target.classList;
      var action = 'move';

      if (classList.contains('handler') && classList.contains('left')) {
        action = 'resizeLeft';
      } else if (classList.contains('handler') && classList.contains('right')) {
        action = 'resizeRight';
      }

      this['_' + action](renderingContext, shape, datum, dx, dy, target);
    }
  }, {
    key: '_move',
    value: function _move(renderingContext, shape, datum, dx, dy, target) {
      var layerHeight = renderingContext.height;
      // current values
      var x = renderingContext.timeToPixel(shape.x(datum));
      var y = renderingContext.valueToPixel(shape.y(datum));
      var height = renderingContext.valueToPixel(shape.height(datum));
      // target values
      var targetX = Math.max(x + dx, 0);
      var targetY = y - dy;

      // lock in layer's y axis
      if (targetY < 0) {
        targetY = 0;
      } else if (targetY + height > layerHeight) {
        targetY = layerHeight - height;
      }

      shape.x(datum, renderingContext.timeToPixel.invert(targetX));
      shape.y(datum, renderingContext.valueToPixel.invert(targetY));
    }
  }, {
    key: '_resizeLeft',
    value: function _resizeLeft(renderingContext, shape, datum, dx, dy, target) {
      // current values
      var x = renderingContext.timeToPixel(shape.x(datum));
      var width = renderingContext.timeToPixel(shape.width(datum));
      // target values
      var maxTargetX = x + width;
      var targetX = x + dx < maxTargetX ? Math.max(x + dx, 0) : x;
      var targetWidth = targetX !== 0 ? Math.max(width - dx, 1) : width;

      shape.x(datum, renderingContext.timeToPixel.invert(targetX));
      shape.width(datum, renderingContext.timeToPixel.invert(targetWidth));
    }
  }, {
    key: '_resizeRight',
    value: function _resizeRight(renderingContext, shape, datum, dx, dy, target) {
      // current values
      var width = renderingContext.timeToPixel(shape.width(datum));
      // target values
      var targetWidth = Math.max(width + dx, 1);

      shape.width(datum, renderingContext.timeToPixel.invert(targetWidth));
    }
  }]);
  return SegmentBehavior;
}(_baseBehavior2.default);

exports.default = SegmentBehavior;

},{"./base-behavior":4,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * TimeContextBehavior is used internally in Layers to modify their TimeContext.
 * This object is different from other Shapes Behaviors and exists mostly to decrease the size of the Layer.
 * All the code here could be considered as part of the layer.
 */
var TimeContextBehavior = function () {
  function TimeContextBehavior() {
    (0, _classCallCheck3.default)(this, TimeContextBehavior);
  }

  (0, _createClass3.default)(TimeContextBehavior, [{
    key: 'edit',
    value: function edit(layer, dx, dy, target) {
      var timeContext = layer.timeContext;

      if (target.classList.contains('handler') && target.classList.contains('left')) {
        this._editLeft(timeContext, dx);
      } else if (target.classList.contains('handler') && target.classList.contains('right')) {
        this._editRight(timeContext, dx);
      } else if (target.classList.contains('segment')) {
        this._move(timeContext, dx);
      }
    }
  }, {
    key: '_editLeft',
    value: function _editLeft(timeContext, dx) {
      // edit `start`, `offset` and `duration`
      var x = timeContext.parent.timeToPixel(timeContext.start);
      var offset = timeContext.timeToPixel(timeContext.offset);
      var width = timeContext.timeToPixel(timeContext.duration);

      var targetX = x + dx;
      var targetOffset = offset - dx;
      var targetWidth = Math.max(width - dx, 1);

      timeContext.start = timeContext.parent.timeToPixel.invert(targetX);
      timeContext.offset = timeContext.timeToPixel.invert(targetOffset);
      timeContext.duration = timeContext.timeToPixel.invert(targetWidth);
    }
  }, {
    key: '_editRight',
    value: function _editRight(timeContext, dx) {
      var width = timeContext.timeToPixel(timeContext.duration);
      var targetWidth = Math.max(width + dx, 1);

      timeContext.duration = timeContext.timeToPixel.invert(targetWidth);
    }
  }, {
    key: '_move',
    value: function _move(timeContext, dx) {
      var x = timeContext.parent.timeToPixel(timeContext.start);
      var targetX = Math.max(x + dx, 0);

      timeContext.start = timeContext.parent.timeToPixel.invert(targetX);
    }
  }, {
    key: 'stretch',
    value: function stretch(layer, dx, dy, target) {
      var timeContext = layer.timeContext;
      var lastDuration = timeContext.duration;
      var lastOffset = timeContext.offset;

      this.edit(layer, dx, dy, target);

      var newDuration = timeContext.duration;
      var ratio = newDuration / lastDuration;

      timeContext.stretchRatio *= ratio;
      timeContext.offset = lastOffset;
      timeContext.duration = lastDuration;
    }
  }]);
  return TimeContextBehavior;
}();

exports.default = TimeContextBehavior;

},{"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _baseBehavior = require('./base-behavior');

var _baseBehavior2 = _interopRequireDefault(_baseBehavior);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Defines the default behavior for a trace visualization.
 *
 * [example usage](./examples/layer-trace.html)
 */
var TraceBehavior = function (_BaseBehavior) {
  (0, _inherits3.default)(TraceBehavior, _BaseBehavior);

  function TraceBehavior() {
    (0, _classCallCheck3.default)(this, TraceBehavior);
    return (0, _possibleConstructorReturn3.default)(this, (TraceBehavior.__proto__ || (0, _getPrototypeOf2.default)(TraceBehavior)).apply(this, arguments));
  }

  (0, _createClass3.default)(TraceBehavior, [{
    key: 'edit',
    value: function edit(renderingContext, shape, datum, dx, dy, target) {
      if (target.classList.contains('min')) {
        this._editRange(renderingContext, shape, datum, dx, dy, 'min');
      } else if (target.classList.contains('max')) {
        this._editRange(renderingContext, shape, datum, dx, dy, 'max');
      } else {
        this._editMean(renderingContext, shape, datum, dx, dy);
      }
    }
  }, {
    key: '_editMean',
    value: function _editMean(renderingContext, shape, datum, dx, dy) {
      // work in pixel domain
      var x = renderingContext.timeToPixel(shape.x(datum));
      var y = renderingContext.valueToPixel(shape.mean(datum));

      var targetX = x + dx;
      var targetY = y - dy;

      shape.x(datum, renderingContext.timeToPixel.invert(targetX));
      shape.mean(datum, renderingContext.valueToPixel.invert(targetY));
    }
  }, {
    key: '_editRange',
    value: function _editRange(renderingContext, shape, datum, dx, dy, rangeSide) {
      var range = renderingContext.valueToPixel(shape.range(datum));

      var targetRange = rangeSide === 'min' ? range + 2 * dy : range - 2 * dy;
      targetRange = Math.max(targetRange, 0);

      shape.range(datum, renderingContext.valueToPixel.invert(targetRange));
    }
  }]);
  return TraceBehavior;
}(_baseBehavior2.default);

exports.default = TraceBehavior;

},{"./base-behavior":4,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _scales = require('../utils/scales');

var _scales2 = _interopRequireDefault(_scales);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A `LayerTimeContext` instance represents a time segment into a `TimelineTimeContext`.
 * It must be attached to a `TimelineTimeContext` (the one of the timeline it
 * belongs to). It relies on its parent's `timeToPixel` (time to pixel transfert
 * function) to create the time to pixel representation of the Layer (the view) it is attached to.
 *
 * The `layerTimeContext` has four important attributes:
 * - `start` represent the time at which temporal data must be represented
 *   in the timeline (for instance the begining of a soundfile in a DAW).
 * - `offset` represents offset time of the data in the context of a Layer.
 *   (@TODO give a use case example here "crop ?", and/or explain that it's not a common use case).
 * - `duration` is the duration of the view on the data.
 * - `stretchRatio` is the stretch applyed to the temporal data contained in
 *   the view (this value can be seen as a local zoom on the data, or as a stretch
 *   on the time components of the data). When applyed, the stretch ratio maintain
 *   the start position of the view in the timeline.
 *
 * ```
 * + timeline -----------------------------------------------------------------
 * 0         5         10          15          20        25          30 seconds
 * +---+*****************+------------------------------------------+*******+--
 *     |*** soundfile ***|Layer (view on the sound file)            |*******|
 *     +*****************+------------------------------------------+*******+
 *
 *     <---- offset ----><--------------- duration ----------------->
 * <-------- start ----->
 *
 * The parts of the sound file represented with '*' are hidden from the view
 * ```
 *
 * [example usage](./examples/time-contexts.html)
 */
var LayerTimeContext = function () {
  /**
   * @param {TimelineTimeContext} parent - The `TimelineTimeContext` instance of the timeline.
   */
  function LayerTimeContext(parent) {
    (0, _classCallCheck3.default)(this, LayerTimeContext);

    if (!parent) {
      throw new Error('LayerTimeContext must have a parent');
    }

    /**
     * The `TimelineTimeContext` instance of the timeline.
     *
     * @type {TimelineTimeContext}
     */
    this.parent = parent;

    this._timeToPixel = null;
    this._start = 0;
    this._duration = parent.visibleDuration;
    this._offset = 0;
    this._stretchRatio = 1;
    // register into the timeline's TimeContext
    this.parent._children.push(this);
  }

  /**
   * Creates a clone of the current time context.
   *
   * @return {LayerTimeContext}
   */


  (0, _createClass3.default)(LayerTimeContext, [{
    key: 'clone',
    value: function clone() {
      var ctx = new this();

      ctx.parent = this.parent;
      ctx.start = this.start;
      ctx.duration = this.duration;
      ctx.offset = this.offset;
      ctx.stretchRatio = this.stretchRatio; // creates the local scale if needed

      return ctx;
    }

    /**
     * Returns the start position of the time context (in seconds).
     *
     * @type {Number}
     */

  }, {
    key: 'pixelToTime',


    /**
     * Helper function to convert pixel to time.
     *
     * @param {Number} px
     * @return {Number}
     */
    value: function pixelToTime(px) {
      if (!this._timeToPixel) {
        return this.parent.timeToPixel.invert(px);
      }

      return this._timeToPixel.invert(px);
    }
  }, {
    key: 'start',
    get: function get() {
      return this._start;
    }

    /**
     * Sets the start position of the time context (in seconds).
     *
     * @type {Number}
     */
    ,
    set: function set(value) {
      this._start = value;
    }

    /**
     * Returns the duration of the time context (in seconds).
     *
     * @type {Number}
     */

  }, {
    key: 'duration',
    get: function get() {
      return this._duration;
    }

    /**
     * Sets the duration of the time context (in seconds).
     *
     * @type {Number}
     */
    ,
    set: function set(value) {
      this._duration = value;
    }

    /**
     * Returns the offset of the time context (in seconds).
     *
     * @type {Number}
     */

  }, {
    key: 'offset',
    get: function get() {
      return this._offset;
    }

    /**
     * Sets the offset of the time context (in seconds).
     *
     * @type {Number}
     */
    ,
    set: function set(value) {
      this._offset = value;
    }

    /**
     * Returns the stretch ratio of the time context.
     *
     * @type {Number}
     */

  }, {
    key: 'stretchRatio',
    get: function get() {
      return this._stretchRatio;
    }

    /**
     * Sets the stretch ratio of the time context.
     *
     * @type {Number}
     */
    ,
    set: function set(value) {
      // remove local scale if ratio = 1
      if (value === 1) {
        this._timeToPixel = null;
        return;
      }
      // reuse previsously created local scale if exists
      var timeToPixel = this._timeToPixel ? this._timeToPixel : _scales2.default.linear().domain([0, 1]);

      timeToPixel.range([0, this.parent.computedPixelsPerSecond * value]);

      this._timeToPixel = timeToPixel;
      this._stretchRatio = value;
    }

    /**
     * Returns the time to pixel transfert function of the time context. If
     * the `stretchRatio` attribute is equal to 1, this function is the global
     * one from the `TimelineTimeContext` instance.
     *
     * @type {Function}
     */

  }, {
    key: 'timeToPixel',
    get: function get() {
      if (!this._timeToPixel) return this.parent.timeToPixel;

      return this._timeToPixel;
    }
  }]);
  return LayerTimeContext;
}();

exports.default = LayerTimeContext;

},{"../utils/scales":55,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71}],11:[function(require,module,exports){
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

},{"../behaviors/time-context-behavior":8,"../shapes/base-shape":35,"../shapes/segment":40,"../utils/scales":55,"./namespace":12,"babel-runtime/core-js/array/from":56,"babel-runtime/core-js/get-iterator":57,"babel-runtime/core-js/map":59,"babel-runtime/core-js/object/assign":60,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74,"babel-runtime/helpers/slicedToArray":75,"events":196}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = 'http://www.w3.org/2000/svg';

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _scales = require('../utils/scales');

var _scales2 = _interopRequireDefault(_scales);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Defines and maintains global aspects of the visualization concerning the
 * relations between time and pixels.
 *
 * The `TimelineTimeContext` instance (unique across a visualization) keeps the
 * main reference on how many pixels should be used to represent one second
 * though its `timeToPixel` method. The attributes `zoom`, `offset` (i.e. from
 * origin) and `visibleWidth` allow for navigating in time and for maintaining
 * view consistency upon the DOM structure (`<svg>` and `<g>` tags) created by
 * the registered tracks.
 *
 * It also maintain an array of all references to `LayerTimeContext` instances
 * to propagate to `layers`, changes made on the time to pixel representation.
 *
 * [example usage](./examples/time-contexts.html)
 */
var TimelineTimeContext = function () {
  /**
   * @param {Number} pixelsPerSecond - The number of pixels that should be
   *    used to display one second.
   * @param {Number} visibleWidth - The default with of the visible area
   *    displayed in `tracks` (in pixels).
   */
  function TimelineTimeContext(pixelsPerSecond, visibleWidth) {
    (0, _classCallCheck3.default)(this, TimelineTimeContext);

    this._children = [];

    this._timeToPixel = null;
    this._offset = 0;
    this._zoom = 1;
    this._computedPixelsPerSecond = pixelsPerSecond;
    // params
    this._visibleWidth = visibleWidth;
    this._maintainVisibleDuration = false;

    // create the timeToPixel scale
    var scale = _scales2.default.linear().domain([0, 1]).range([0, pixelsPerSecond]);

    this._timeToPixel = scale;

    this._originalPixelsPerSecond = this._computedPixelsPerSecond;
  }

  /**
   * Returns the number of pixels per seconds ignoring the current zoom value.
   *
   * @type {Number}
   */


  (0, _createClass3.default)(TimelineTimeContext, [{
    key: '_updateTimeToPixelRange',
    value: function _updateTimeToPixelRange() {
      this.timeToPixel.range([0, this._computedPixelsPerSecond]);
    }
  }, {
    key: 'pixelsPerSecond',
    get: function get() {
      return this._originalPixelsPerSecond;
    }

    /**
     * Updates all the caracteristics of this object according to the new
     * given value of pixels per seconds. Propagates the changes to the
     * `LayerTimeContext` children.
     *
     * @type {Number}
     */
    ,
    set: function set(value) {
      this._computedPixelsPerSecond = value * this.zoom;
      this._originalPixelsPerSecond = value;
      this._updateTimeToPixelRange();

      // force children scale update
      this._children.forEach(function (child) {
        if (child.stretchRatio !== 1) child.stretchRatio = child.stretchRatio;
      });
    }

    /**
     * Returns the number of pixels per seconds including the current zoom value.
     *
     * @type {Number}
     */

  }, {
    key: 'computedPixelsPerSecond',
    get: function get() {
      return this._computedPixelsPerSecond;
    }

    /**
     * Returns the current offset applied to the registered `Track` instances
     * from origin (in seconds).
     *
     * @type {Number}
     */

  }, {
    key: 'offset',
    get: function get() {
      return this._offset;
    }

    /**
     * Sets the offset to apply to the registered `Track` instances from origin
     * (in seconds).
     *
     * @type {Number}
     */
    ,
    set: function set(value) {
      this._offset = value;
    }

    /**
     * Returns the current zoom level applied to the whole visualization.
     *
     * @type {Number}
     */

  }, {
    key: 'zoom',
    get: function get() {
      return this._zoom;
    }

    /**
     * Sets the zoom ratio for the whole visualization.
     *
     * @type {Number}
     */
    ,
    set: function set(value) {
      // Compute change to propagate to children who have their own timeToPixel
      var ratioChange = value / this._zoom;
      this._zoom = value;
      this._computedPixelsPerSecond = this._originalPixelsPerSecond * value;
      this._updateTimeToPixelRange();

      this._children.forEach(function (child) {
        if (child.stretchRatio !== 1) child.stretchRatio = child.stretchRatio * ratioChange;
      });
    }

    /**
     * Returns the visible width of the `Track` instances.
     *
     * @type {Number}
     */

  }, {
    key: 'visibleWidth',
    get: function get() {
      return this._visibleWidth;
    }

    /**
     * Sets the visible width of the `Track` instances.
     *
     * @type {Number}
     */
    ,
    set: function set(value) {
      var widthRatio = value / this._visibleWidth;
      this._visibleWidth = value;

      if (this.maintainVisibleDuration) this.pixelsPerSecond = this.pixelsPerSecond * widthRatio;
    }

    /**
     * Returns the duration displayed by `Track` instances.
     *
     * @type {Number}
     */

  }, {
    key: 'visibleDuration',
    get: function get() {
      return this.visibleWidth / this._computedPixelsPerSecond;
    }

    /**
     * Returns if the duration displayed by tracks should be maintained when
     * their width is updated.
     *
     * @type {Number}
     */

  }, {
    key: 'maintainVisibleDuration',
    get: function get() {
      return this._maintainVisibleDuration;
    }

    /**
     * Defines if the duration displayed by tracks should be maintained when
     * their width is updated.
     *
     * @type {Boolean}
     */
    ,
    set: function set(bool) {
      this._maintainVisibleDuration = bool;
    }

    /**
     * Returns the time to pixel trasfert function.
     *
     * @type {Function}
     */

  }, {
    key: 'timeToPixel',
    get: function get() {
      return this._timeToPixel;
    }
  }]);
  return TimelineTimeContext;
}();

exports.default = TimelineTimeContext;

},{"../utils/scales":55,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

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

var _keyboard = require('../interactions/keyboard');

var _keyboard2 = _interopRequireDefault(_keyboard);

var _layerTimeContext = require('./layer-time-context');

var _layerTimeContext2 = _interopRequireDefault(_layerTimeContext);

var _surface = require('../interactions/surface');

var _surface2 = _interopRequireDefault(_surface);

var _timelineTimeContext = require('./timeline-time-context');

var _timelineTimeContext2 = _interopRequireDefault(_timelineTimeContext);

var _track2 = require('./track');

var _track3 = _interopRequireDefault(_track2);

var _trackCollection = require('./track-collection');

var _trackCollection2 = _interopRequireDefault(_trackCollection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Is the main entry point to create a temporal visualization.
 *
 * A `timeline` instance mainly provides the context for any visualization of
 * temporal data and maintains the hierarchy of `Track`, `Layer` and `Shape`
 * over the entiere visualisation.
 *
 * Its main responsabilites are:
 * - maintaining the temporal consistency accross the visualisation through
 *   its `timeContext` property (instance of `TimelineTimeContext`).
 * - handling interactions to its current state (acting here as a simple
 *   state machine).
 *
 * @TODO insert figure
 *
 * It also contains a reference to all the register track allowing to `render`
 * or `update` all the layer from a single entry point.
 *
 * ## Example Usage
 *
 * ```js
 * const visibleWidth = 500; // default width in pixels for all created `Track`
 * const duration = 10; // the visible area represents 10 seconds
 * const pixelsPerSeconds = visibleWidth / duration;
 * const timeline = new ui.core.Timeline(pixelsPerSecond, width);
 * ```
 */
var Timeline = function (_events$EventEmitter) {
  (0, _inherits3.default)(Timeline, _events$EventEmitter);

  /**
   * @param {Number} [pixelsPerSecond=100] - the default scaling between time and pixels.
   * @param {Number} [visibleWidth=1000] - the default visible area for all registered tracks.
   */
  function Timeline() {
    var pixelsPerSecond = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
    var visibleWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;

    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$registerKeyboard = _ref.registerKeyboard,
        registerKeyboard = _ref$registerKeyboard === undefined ? true : _ref$registerKeyboard;

    (0, _classCallCheck3.default)(this, Timeline);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Timeline.__proto__ || (0, _getPrototypeOf2.default)(Timeline)).call(this));

    _this._tracks = new _trackCollection2.default(_this);
    _this._state = null;

    // default interactions
    _this._surfaceCtor = _surface2.default;

    // stores
    _this._trackById = {};
    _this._groupedLayers = {};
    _this._$elInteractionsMap = new _map2.default();

    /** @type {TimelineTimeContext} - master time context for the visualization. */
    _this.timeContext = new _timelineTimeContext2.default(pixelsPerSecond, visibleWidth);

    if (registerKeyboard) _this.createInteraction(_keyboard2.default, document);
    return _this;
  }

  /**
   * Returns `TimelineTimeContext`'s `offset` time domain value.
   *
   * @type {Number} [offset=0]
   */


  (0, _createClass3.default)(Timeline, [{
    key: 'configureSurface',


    /**
     * Overrides the default `Surface` that is instanciated on each `Track`
     * instance. This methos should be called before adding any `Track` instance
     * to the current `timeline`.
     *
     * @param {EventSource} ctor - The constructor to use in order to catch mouse
     *    events on each `Track` instances.
     */
    value: function configureSurface(ctor) {
      this._surfaceCtor = ctor;
    }

    /**
     * Factory method to add interaction modules the timeline should listen to.
     * By default, the timeline instanciate a global `Keyboard` instance and a
     * `Surface` instance on each container.
     * Should be used to install new interactions implementing the `EventSource` interface.
     *
     * @param {EventSource} ctor - The contructor of the interaction module to instanciate.
     * @param {Element} $el - The DOM element which will be binded to the `EventSource` module.
     * @param {Object} [options={}] - Options to be applied to the `ctor`.
     */

  }, {
    key: 'createInteraction',
    value: function createInteraction(ctor, $el) {
      var _this2 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var interaction = new ctor($el, options);
      interaction.on('event', function (e) {
        return _this2._handleEvent(e);
      });

      // store interaction associated to the DOM element
      if (!this._$elInteractionsMap.has($el)) this._$elInteractionsMap.set($el, new _set2.default());

      var interactionSet = this._$elInteractionsMap.get($el);
      interactionSet.add(interaction);
    }

    /**
     * Returns a list of the layers situated under the position of a `WaveEvent`.
     *
     * @param {WavesEvent} e - An event triggered by a `WaveEvent`
     * @return {Array} - Matched layers
     */

  }, {
    key: 'getHitLayers',
    value: function getHitLayers(e) {
      var clientX = e.originalEvent.clientX;
      var clientY = e.originalEvent.clientY;
      var layers = [];

      this.layers.forEach(function (layer) {
        if (!layer.params.hittable) {
          return;
        }
        var boundingRect = layer.$el.getBoundingClientRect();

        if (clientX > boundingRect.left && clientX < boundingRect.right && clientY > boundingRect.top && clientY < boundingRect.bottom) {
          layers.push(layer);
        }
      });

      return layers;
    }

    /**
     * The callback that is used to listen to interactions modules.
     *
     * @param {WaveEvent} e - An event generated by an interaction modules (`EventSource`).
     */

  }, {
    key: '_handleEvent',
    value: function _handleEvent(e) {
      var hitLayers = e.source === 'surface' ? this.getHitLayers(e) : null;
      // emit event as a middleware
      this.emit('event', e, hitLayers);
      // propagate to the state
      if (this._state) this._state.handleEvent(e, hitLayers);
    }

    /**
     * Updates the state of the timeline.
     *
     * @type {BaseState}
     */

  }, {
    key: 'add',


    /**
     * Adds a new track to the timeline.
     *
     * @param {Track} track - The new track to be registered in the timeline.
     * @param {String} [trackId=null] - Optionnal unique id to associate with
     *    the track, this id only exists in timeline's context and should be used
     *    in conjonction with `addLayer` method.
     */
    value: function add(track) {
      var trackId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (this.tracks.has(track)) throw new Error('track already added to the timeline');

      this._registerTrackId(track, trackId);
      track.configure(this.timeContext);

      this.tracks.add(track);
      this.createInteraction(this._surfaceCtor, track.$el);
    }

    /**
     * Removes a track from the timeline.
     *
     * @param {Track} track - the track to remove from the timeline.
     * @todo not implemented.
     */

  }, {
    key: 'remove',
    value: function remove(track) {
      // should destroy all interactions too, avoid ghost eventListeners
      var $el = track.$el;
      var interactions = this._$elInteractionsMap.get($el);

      if (interactions) interactions.forEach(function (interaction) {
        return interaction.destroy();
      });

      track.destroy();
    }

    /**
     * Helper to create a new `Track` instance. The `track` is added,
     * rendered and updated before being returned.
     *
     * @param {Element} $el - The DOM element where the track should be inserted.
     * @param {Number} trackHeight - The height of the newly created track.
     * @param {String} [trackId=null] - Optionnal unique id to associate with
     *    the track, this id only exists in timeline's context and should be used in
     *    conjonction with `addLayer` method.
     * @return {Track}
     */

  }, {
    key: 'createTrack',
    value: function createTrack($el) {
      var trackHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
      var trackId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var track = new _track3.default($el, trackHeight);
      // Add track to the timeline
      this.add(track, trackId);
      track.render();
      track.update();

      return track;
    }

    /**
     * If track id is defined, associate a track with a unique id.
     */

  }, {
    key: '_registerTrackId',
    value: function _registerTrackId(track, trackId) {
      if (trackId !== null) {
        if (this._trackById[trackId] !== undefined) {
          throw new Error('trackId: "' + trackId + '" is already used');
        }

        this._trackById[trackId] = track;
      }
    }

    /**
     * Helper to add a `Layer` instance into a given `Track`. Is designed to be
     * used in conjonction with the `Timeline~getLayersByGroup` method. The
     * layer is internally rendered and updated.
     *
     * @param {Layer} layer - The `Layer` instance to add into the visualization.
     * @param {(Track|String)} trackOrTrackId - The `Track` instance (or its `id`
     *    as defined in the `createTrack` method) where the `Layer` instance should be inserted.
     * @param {String} [groupId='default'] - An optionnal group id in which the
     *    `Layer` should be inserted.
     * @param {Boolean} [isAxis] - Set to `true` if the added `layer` is an
     *    instance of `AxisLayer` (these layers shares the `TimlineTimeContext` instance
     *    of the timeline).
     */

  }, {
    key: 'addLayer',
    value: function addLayer(layer, trackOrTrackId) {
      var groupId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'default';
      var isAxis = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      var track = trackOrTrackId;

      if (typeof trackOrTrackId === 'string') {
        track = this.getTrackById(trackOrTrackId);
      }

      // creates the `LayerTimeContext` if not present
      if (!layer.timeContext) {
        var timeContext = isAxis ? this.timeContext : new _layerTimeContext2.default(this.timeContext);

        layer.setTimeContext(timeContext);
      }

      // we should have a Track instance at this point
      track.add(layer);

      if (!this._groupedLayers[groupId]) {
        this._groupedLayers[groupId] = [];
      }

      this._groupedLayers[groupId].push(layer);

      layer.render();
      layer.update();
    }

    /**
     * Removes a layer from its track. The layer is detatched from the DOM but
     * can still be reused later.
     *
     * @param {Layer} layer - The layer to remove.
     */

  }, {
    key: 'removeLayer',
    value: function removeLayer(layer) {
      this.tracks.forEach(function (track) {
        var index = track.layers.indexOf(layer);
        if (index !== -1) {
          track.remove(layer);
        }
      });

      // clean references in helpers
      for (var groupId in this._groupedLayers) {
        var group = this._groupedLayers[groupId];
        var index = group.indexOf(layer);

        if (index !== -1) {
          group.splice(layer, 1);
        }

        if (!group.length) {
          delete this._groupedLayers[groupId];
        }
      }
    }

    /**
     * Returns a `Track` instance from it's given id.
     *
     * @param {String} trackId
     * @return {Track}
     */

  }, {
    key: 'getTrackById',
    value: function getTrackById(trackId) {
      return this._trackById[trackId];
    }

    /**
     * Returns the track containing a given DOM Element, returns null if no match found.
     *
     * @param {Element} $el - The DOM Element to be tested.
     * @return {Track}
     */

  }, {
    key: 'getTrackFromDOMElement',
    value: function getTrackFromDOMElement($el) {
      var $svg = null;
      var track = null;
      // find the closest `.track` element
      do {
        if ($el.classList.contains('track')) {
          $svg = $el;
        }
        $el = $el.parentNode;
      } while ($svg === null);
      // find the related `Track`
      this.tracks.forEach(function (_track) {
        if (_track.$svg === $svg) {
          track = _track;
        }
      });

      return track;
    }

    /**
     * Returns an array of layers from their given group id.
     *
     * @param {String} groupId - The id of the group as defined in `addLayer`.
     * @return {(Array|undefined)}
     */

  }, {
    key: 'getLayersByGroup',
    value: function getLayersByGroup(groupId) {
      return this._groupedLayers[groupId];
    }
  }, {
    key: 'offset',
    get: function get() {
      return this.timeContext.offset;
    }

    /**
     * Updates `TimelineTimeContext`'s `offset` time domain value.
     *
     * @type {Number} [offset=0]
     */
    ,
    set: function set(value) {
      this.timeContext.offset = value;
    }

    /**
     * Returns the `TimelineTimeContext`'s `zoom` value.
     *
     * @type {Number} [offset=0]
     */

  }, {
    key: 'zoom',
    get: function get() {
      return this.timeContext.zoom;
    }

    /**
     * Updates the `TimelineTimeContext`'s `zoom` value.
     *
     * @type {Number} [offset=0]
     */
    ,
    set: function set(value) {
      this.timeContext.zoom = value;
    }

    /**
     * Returns the `TimelineTimeContext`'s `pixelsPerSecond` ratio.
     *
     * @type {Number} [offset=0]
     */

  }, {
    key: 'pixelsPerSecond',
    get: function get() {
      return this.timeContext.pixelsPerSecond;
    }

    /**
     * Updates the `TimelineTimeContext`'s `pixelsPerSecond` ratio.
     *
     * @type {Number} [offset=0]
     */
    ,
    set: function set(value) {
      this.timeContext.pixelsPerSecond = value;
    }

    /**
     * Returns the `TimelineTimeContext`'s `visibleWidth` pixel domain value.
     *
     * @type {Number} [offset=0]
     */

  }, {
    key: 'visibleWidth',
    get: function get() {
      return this.timeContext.visibleWidth;
    }

    /**
     * Updates the `TimelineTimeContext`'s `visibleWidth` pixel domain value.
     *
     * @type {Number} [offset=0]
     */
    ,
    set: function set(value) {
      this.timeContext.visibleWidth = value;
    }

    /**
     * Returns `TimelineTimeContext`'s `timeToPixel` transfert function.
     *
     * @type {Function}
     */

  }, {
    key: 'timeToPixel',
    get: function get() {
      return this.timeContext.timeToPixel;
    }

    /**
     * Returns `TimelineTimeContext`'s `visibleDuration` helper value.
     *
     * @type {Number}
     */

  }, {
    key: 'visibleDuration',
    get: function get() {
      return this.timeContext.visibleDuration;
    }

    /**
     * Updates the `TimelineTimeContext`'s `maintainVisibleDuration` value.
     * Defines if the duration of the visible area should be maintain when
     * the `visibleWidth` attribute is updated.
     *
     * @type {Boolean}
     */

  }, {
    key: 'maintainVisibleDuration',
    set: function set(bool) {
      this.timeContext.maintainVisibleDuration = bool;
    }

    /**
     * Returns `TimelineTimeContext`'s `maintainVisibleDuration` current value.
     *
     * @type {Boolean}
     */
    ,
    get: function get() {
      return this.timeContext.maintainVisibleDuration;
    }

    /**
     * Object maintaining arrays of `Layer` instances ordered by their `groupId`.
     * Is used internally by the `TrackCollection` instance.
     *
     * @type {Object}
     */

  }, {
    key: 'groupedLayers',
    get: function get() {
      return this._groupedLayers;
    }
  }, {
    key: 'state',
    set: function set(state) {
      if (this._state) this._state.exit();

      this._state = state;

      if (this._state) this._state.enter();
    }

    /**
     * Returns the current state of the timeline.
     *
     * @type {BaseState}
     */
    ,
    get: function get() {
      return this._state;
    }

    /**
     * Returns the `TrackCollection` instance.
     *
     * @type {TrackCollection}
     */

  }, {
    key: 'tracks',
    get: function get() {
      return this._tracks;
    }

    /**
     * Returns the list of all registered layers.
     *
     * @type {Array}
     */

  }, {
    key: 'layers',
    get: function get() {
      return this._tracks.layers;
    }
  }]);
  return Timeline;
}(_events2.default.EventEmitter);

exports.default = Timeline;

},{"../interactions/keyboard":30,"../interactions/surface":31,"./layer-time-context":10,"./timeline-time-context":13,"./track":16,"./track-collection":15,"babel-runtime/core-js/map":59,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/core-js/set":67,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74,"events":196}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _layer = require('./layer');

var _layer2 = _interopRequireDefault(_layer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Collection hosting all the `Track` instances registered into the timeline.
 * It provides shorcuts to trigger `render` / `update` methods on tracks or
 * layers. Extend built-in Array
 */
var TrackCollection = function () {
  function TrackCollection(timeline) {
    (0, _classCallCheck3.default)(this, TrackCollection);

    this._timeline = timeline;
    this._tracks = new _set2.default();
  }

  // @note - should be in the timeline ?
  // @todo - allow to pass an array of layers


  (0, _createClass3.default)(TrackCollection, [{
    key: '_getLayersOrGroups',
    value: function _getLayersOrGroups() {
      var layerOrGroup = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var layers = null;

      if (typeof layerOrGroup === 'string') {
        layers = this._timeline.groupedLayers[layerOrGroup];
      } else if (layerOrGroup instanceof _layer2.default) {
        layers = [layerOrGroup];
      } else {
        layers = this.layers;
      }

      return layers;
    }

    /**
     * @type {Number} - Updates the height of all tracks at once.
     * @todo - Propagate to layers, not usefull for now.
     */

  }, {
    key: 'has',


    /**
     * Check if a given track belongs to the collection.
     *
     * @param {Track} track - Track to be tested
     * @returns {Boolean}
     */
    value: function has(track) {
      return this._tracks.has(track);
    }

    /**
     * Add a track to the collection.
     *
     * @param {Track} track - Track to add to the collection
     */

  }, {
    key: 'add',
    value: function add(track) {
      this._tracks.add(track);
    }

    // @todo

  }, {
    key: 'remove',
    value: function remove(track) {}
  }, {
    key: 'forEach',
    value: function forEach(callback) {
      this._tracks.forEach(callback);
    }

    /**
     * Render all tracks and layers. When done, the timeline triggers a `render` event.
     */

  }, {
    key: 'render',
    value: function render() {
      this._tracks.forEach(function (track) {
        return track.render();
      });
      this._timeline.emit('render');
    }

    /**
     * Updates all tracks and layers. When done, the timeline triggers a
     * `update` event.
     *
     * @todo - filtering is probably broken...
     * @param {Layer|String} layerOrGroup - Filter the layers to update by
     *    passing the `Layer` instance to update or a `groupId`
     */

  }, {
    key: 'update',
    value: function update(layerOrGroup) {
      var layers = this._getLayersOrGroups(layerOrGroup);
      this._tracks.forEach(function (track) {
        return track.update(layers);
      });
      this._timeline.emit('update', layers);
    }

    /**
     * Updates all `Track` containers, layers are not updated with this method.
     * When done, the timeline triggers a `update:containers` event.
     */

  }, {
    key: 'updateContainer',
    value: function updateContainer() /* trackOrTrackIds */{
      this._tracks.forEach(function (track) {
        return track.updateContainer();
      });
      this._timeline.emit('update:containers');
    }

    /**
     * Updates all layers. When done, the timeline triggers a `update:layers` event.
     *
     * @todo - filtering is probably broken...
     * @param {Layer|String} layerOrGroup - Filter the layers to update by
     *    passing the `Layer` instance to update or a `groupId`
     */

  }, {
    key: 'updateLayers',
    value: function updateLayers(layerOrGroup) {
      var layers = this._getLayersOrGroups(layerOrGroup);
      this._tracks.forEach(function (track) {
        return track.updateLayers(layers);
      });
      this._timeline.emit('update:layers', layers);
    }
  }, {
    key: 'height',
    set: function set(value) {
      this._tracks.forEach(function (track) {
        return track.height = value;
      });
    }

    /**
     * An array of all registered layers.
     *
     * @type {Array<Layer>}
     */

  }, {
    key: 'layers',
    get: function get() {
      var layers = [];
      this._tracks.forEach(function (track) {
        return layers = layers.concat(track.layers);
      });

      return layers;
    }
  }]);
  return TrackCollection;
}();

exports.default = TrackCollection;

},{"./layer":11,"babel-runtime/core-js/set":67,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _iterator2 = require('babel-runtime/core-js/symbol/iterator');

var _iterator3 = _interopRequireDefault(_iterator2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _namespace = require('./namespace');

var _namespace2 = _interopRequireDefault(_namespace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Acts as a placeholder to organize the vertical layout of the visualization
 * and the horizontal alignement to an abscissa that correspond to a common
 * time reference. It basically offer a view on the overall timeline.
 *
 * Tracks are inserted into a given DOM element, allowing to create DAW like
 * representations. Each `Track` instance can host multiple `Layer` instances.
 * A track must be added to a timeline before being updated.
 *
 * ### A timeline with 3 tracks:
 *
 * ```
 * 0                 6                               16
 * +- - - - - - - - -+-------------------------------+- - - - - - -
 * |                 |x track 1 xxxxxxxxxxxxxxxxxxxxx|
 * +- - - - - - - - -+-------------------------------+- - - - - - -
 * |                 |x track 2 xxxxxxxxxxxxxxxxxxxxx|
 * +- - - - - - - - -+-------------------------------+- - - - - - -
 * |                 |x track 3 xxxxxxxxxxxxxxxxxxxxx|
 * +- - - - - - - - ---------------------------------+- - - - - - -
 * +----------------->
 * timeline.timeContext.timeToPixel(timeline.timeContext.offset)
 *
 *                   <------------------------------->
 *                   timeline's tracks defaults to 1000px
 *                   with a default pixelsPerSecond of 100px/s.
 *                   and a default `stretchRatio = 1`
 *                   track1 shows 10 seconds of the timeline
 * ```
 *
 * ### Track DOM structure
 *
 * ```html
 * <svg width="${visibleWidth}">
 *   <!-- background -->
 *   <rect><rect>
 *   <!-- main view -->
 *   <g class="offset" transform="translate(${offset}, 0)">
 *     <g class="layout">
 *       <!-- layers -->
 *     </g>
 *   </g>
 *   <g class="interactions"><!-- for feedback --></g>
 * </svg>
 * ```
 */
var Track = function () {
  /**
   * @param {DOMElement} $el
   * @param {Number} [height = 100]
   */
  function Track($el) {
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
    (0, _classCallCheck3.default)(this, Track);

    this._height = height;

    /**
     * The DOM element in which the track is created.
     * @type {Element}
     */
    this.$el = $el;
    /**
     * A placeholder to add shapes for interactions feedback.
     * @type {Element}
     */
    this.$interactions = null;
    /** @type {Element} */
    this.$layout = null;
    /** @type {Element} */
    this.$offset = null;
    /** @type {Element} */
    this.$svg = null;
    /** @type {Element} */
    this.$background = null;

    /**
     * An array of all the layers belonging to the track.
     * @type {Array<Layer>}
     */
    this.layers = [];
    /**
     * The context used to maintain the DOM structure of the track.
     * @type {TimelineTimeContext}
     */
    this.renderingContext = null;

    this._createContainer();
  }

  /**
   * Returns the height of the track.
   *
   * @type {Number}
   */


  (0, _createClass3.default)(Track, [{
    key: 'configure',


    /**
     * This method is called when the track is added to the timeline. The
     * track cannot be updated without being added to a timeline.
     *
     * @private
     * @param {TimelineTimeContext} renderingContext
     */
    value: function configure(renderingContext) {
      this.renderingContext = renderingContext;
    }

    /**
     * Destroy the track. The layers from this track can still be reused elsewhere.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      var _this = this;

      // Detach everything from the DOM
      this.$el.removeChild(this.$svg);
      this.layers.forEach(function (layer) {
        return _this.$layout.removeChild(layer.$el);
      });
      // clean references
      this.$el = null;
      this.renderingContext = null;
      this.layers.length = 0;
    }

    /**
     * Creates the DOM structure of the track.
     */

  }, {
    key: '_createContainer',
    value: function _createContainer() {
      var $svg = document.createElementNS(_namespace2.default, 'svg');
      $svg.setAttributeNS(null, 'shape-rendering', 'optimizeSpeed');
      $svg.setAttributeNS(null, 'height', this.height);
      $svg.setAttribute('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');
      $svg.classList.add('track');

      var $background = document.createElementNS(_namespace2.default, 'rect');
      $background.setAttributeNS(null, 'height', '100%');
      $background.setAttributeNS(null, 'width', '100%');
      $background.style.fillOpacity = 0;
      // $background.style.pointerEvents = 'none';

      var $defs = document.createElementNS(_namespace2.default, 'defs');

      var $offsetGroup = document.createElementNS(_namespace2.default, 'g');
      $offsetGroup.classList.add('offset');

      var $layoutGroup = document.createElementNS(_namespace2.default, 'g');
      $layoutGroup.classList.add('layout');

      var $interactionsGroup = document.createElementNS(_namespace2.default, 'g');
      $interactionsGroup.classList.add('interactions');

      $offsetGroup.appendChild($layoutGroup);
      $svg.appendChild($defs);
      $svg.appendChild($background);
      $svg.appendChild($offsetGroup);
      $svg.appendChild($interactionsGroup);
      this.$el.appendChild($svg);
      // removes additionnal height added who knows why...
      this.$el.style.fontSize = 0;
      // fixes one of the (many ?) weird canvas rendering bugs in Chrome
      this.$el.style.transform = 'translateZ(0)';

      this.$layout = $layoutGroup;
      this.$offset = $offsetGroup;
      this.$interactions = $interactionsGroup;
      this.$svg = $svg;
      this.$background = $background;
    }

    /**
     * Adds a layer to the track.
     *
     * @param {Layer} layer - the layer to add to the track.
     */

  }, {
    key: 'add',
    value: function add(layer) {
      this.layers.push(layer);
      // Create a default renderingContext for the layer if missing
      this.$layout.appendChild(layer.$el);
    }

    /**
     * Removes a layer from the track. The layer can be reused elsewhere.
     *
     * @param {Layer} layer - the layer to remove from the track.
     */

  }, {
    key: 'remove',
    value: function remove(layer) {
      this.layers.splice(this.layers.indexOf(layer), 1);
      // Removes layer from its container
      this.$layout.removeChild(layer.$el);
    }

    /**
     * Tests if a given element belongs to the track.
     *
     * @param {Element} $el
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
     * Render all the layers added to the track.
     */

  }, {
    key: 'render',
    value: function render() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(this), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var layer = _step.value;
          layer.render();
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
     * Updates the track DOM structure and updates the layers.
     *
     * @param {Array<Layer>} [layers=null] - if not null, a subset of the layers to update.
     */

  }, {
    key: 'update',
    value: function update() {
      var layers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      this.updateContainer();
      this.updateLayers(layers);
    }

    /**
     * Updates the track DOM structure.
     */

  }, {
    key: 'updateContainer',
    value: function updateContainer() {
      var $svg = this.$svg;
      var $offset = this.$offset;
      // Should be in some update layout
      var renderingContext = this.renderingContext;
      var height = this.height;
      var width = Math.round(renderingContext.visibleWidth);
      var offsetX = Math.round(renderingContext.timeToPixel(renderingContext.offset));
      var translate = 'translate(' + offsetX + ', 0)';

      $svg.setAttributeNS(null, 'height', height);
      $svg.setAttributeNS(null, 'width', width);
      $svg.setAttributeNS(null, 'viewbox', '0 0 ' + width + ' ' + height);

      $offset.setAttributeNS(null, 'transform', translate);
    }

    /**
     * Updates the layers.
     *
     * @param {Array<Layer>} [layers=null] - if not null, a subset of the layers to update.
     */

  }, {
    key: 'updateLayers',
    value: function updateLayers() {
      var _this2 = this;

      var layers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      layers = layers === null ? this.layers : layers;

      layers.forEach(function (layer) {
        if (_this2.layers.indexOf(layer) === -1) {
          return;
        }
        layer.update();
      });
    }

    /**
     * Iterates through the added layers.
     */

  }, {
    key: _iterator3.default,
    value: /*#__PURE__*/_regenerator2.default.mark(function value() {
      return _regenerator2.default.wrap(function value$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.delegateYield((0, _getIterator3.default)(this.layers), 't0', 1);

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, value, this);
    })
  }, {
    key: 'height',
    get: function get() {
      return this._height;
    }

    /**
     * Sets the height of the track.
     *
     * @type {Number}
     */
    ,
    set: function set(value) {
      var _this3 = this;

      var prevHeight = this._height;
      this._height = value;

      this.layers.forEach(function (layer) {
        return layer.updateHeight(prevHeight, _this3._height);
      });
    }
  }]);
  return Track;
}();

exports.default = Track;

},{"./namespace":12,"babel-runtime/core-js/get-iterator":57,"babel-runtime/core-js/symbol/iterator":69,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/regenerator":78}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _annotatedMarker = require('../shapes/annotated-marker');

var _annotatedMarker2 = _interopRequireDefault(_annotatedMarker);

var _layer = require('../core/layer');

var _layer2 = _interopRequireDefault(_layer);

var _markerBehavior = require('../behaviors/marker-behavior');

var _markerBehavior2 = _interopRequireDefault(_markerBehavior);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper to create a annotated marker layer
 *
 * [example usage](./examples/layer-marker.html)
 */
var AnnotatedMarkerLayer = function (_Layer) {
  (0, _inherits3.default)(AnnotatedMarkerLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @todo - Add accessors and options for the shape.
   */
  function AnnotatedMarkerLayer(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, AnnotatedMarkerLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AnnotatedMarkerLayer.__proto__ || (0, _getPrototypeOf2.default)(AnnotatedMarkerLayer)).call(this, 'collection', data, options));

    _this.configureShape(_annotatedMarker2.default, {
      displayLabels: true
    });

    _this.setBehavior(new _markerBehavior2.default());
    return _this;
  }

  return AnnotatedMarkerLayer;
}(_layer2.default);

exports.default = AnnotatedMarkerLayer;

},{"../behaviors/marker-behavior":6,"../core/layer":11,"../shapes/annotated-marker":33,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _layer = require('../core/layer');

var _layer2 = _interopRequireDefault(_layer);

var _annotatedSegment = require('../shapes/annotated-segment');

var _annotatedSegment2 = _interopRequireDefault(_annotatedSegment);

var _segmentBehavior = require('../behaviors/segment-behavior');

var _segmentBehavior2 = _interopRequireDefault(_segmentBehavior);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper to create a annotated segment layer.
 *
 * [example usage](./examples/layer-segment.html)
 */
var AnnotatedSegmentLayer = function (_Layer) {
  (0, _inherits3.default)(AnnotatedSegmentLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */
  function AnnotatedSegmentLayer(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck3.default)(this, AnnotatedSegmentLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AnnotatedSegmentLayer.__proto__ || (0, _getPrototypeOf2.default)(AnnotatedSegmentLayer)).call(this, 'collection', data, options));

    options = (0, _assign2.default)({
      displayHandlers: true,
      opacity: 0.6,
      displayLabels: true
    }, options);

    _this.configureShape(_annotatedSegment2.default, accessors, {
      displayHandlers: options.displayHandlers,
      opacity: options.opacity
    });

    _this.setBehavior(new _segmentBehavior2.default());
    return _this;
  }

  return AnnotatedSegmentLayer;
}(_layer2.default);

exports.default = AnnotatedSegmentLayer;

},{"../behaviors/segment-behavior":7,"../core/layer":11,"../shapes/annotated-segment":34,"babel-runtime/core-js/object/assign":60,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _breakpointBehavior = require('../behaviors/breakpoint-behavior');

var _breakpointBehavior2 = _interopRequireDefault(_breakpointBehavior);

var _dot = require('../shapes/dot');

var _dot2 = _interopRequireDefault(_dot);

var _layer = require('../core/layer');

var _layer2 = _interopRequireDefault(_layer);

var _line = require('../shapes/line');

var _line2 = _interopRequireDefault(_line);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper to create a breakpoint function layer.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */
var BreakpointLayer = function (_Layer) {
  (0, _inherits3.default)(BreakpointLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */
  function BreakpointLayer(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck3.default)(this, BreakpointLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (BreakpointLayer.__proto__ || (0, _getPrototypeOf2.default)(BreakpointLayer)).call(this, 'collection', data, options));

    var color = options.color;
    var commonShapeOptions = {};

    if (color) {
      accessors.color = function () {
        return color;
      };
      commonShapeOptions.color = color;
    }

    _this.configureCommonShape(_line2.default, accessors, commonShapeOptions);
    _this.configureShape(_dot2.default, accessors, {});
    _this.setBehavior(new _breakpointBehavior2.default());
    return _this;
  }

  return BreakpointLayer;
}(_layer2.default);

exports.default = BreakpointLayer;

},{"../behaviors/breakpoint-behavior":5,"../core/layer":11,"../shapes/dot":37,"../shapes/line":38,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _layer = require('../core/layer');

var _layer2 = _interopRequireDefault(_layer);

var _cursor = require('../shapes/cursor');

var _cursor2 = _interopRequireDefault(_cursor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper to create a cursor layer.
 *
 * [example usage](./examples/layer-cursor.html)
 */
var CursorLayer = function (_Layer) {
  (0, _inherits3.default)(CursorLayer, _Layer);

  /**
   * @param {Object} options - An object to configure the layer.
   */
  function CursorLayer() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, CursorLayer);

    var defaults = {
      color: 'red',
      hittable: false // kind of pass through layer
    };

    var data = { currentPosition: 0 };

    options = (0, _assign2.default)(defaults, options);

    var _this = (0, _possibleConstructorReturn3.default)(this, (CursorLayer.__proto__ || (0, _getPrototypeOf2.default)(CursorLayer)).call(this, 'entity', data, options));

    _this.configureShape(_cursor2.default, { x: function x(d) {
        return d.currentPosition;
      } }, {
      color: options.color
    });
    return _this;
  }

  (0, _createClass3.default)(CursorLayer, [{
    key: 'currentPosition',
    set: function set(value) {
      this.data[0].currentPosition = value;
    },
    get: function get() {
      return this.data[0].currentPosition;
    }
  }]);
  return CursorLayer;
}(_layer2.default);

exports.default = CursorLayer;

},{"../core/layer":11,"../shapes/cursor":36,"babel-runtime/core-js/object/assign":60,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _axisLayer = require('../axis/axis-layer');

var _axisLayer2 = _interopRequireDefault(_axisLayer);

var _ticks = require('../shapes/ticks');

var _ticks2 = _interopRequireDefault(_ticks);

var _gridAxisGenerator = require('../axis/grid-axis-generator');

var _gridAxisGenerator2 = _interopRequireDefault(_gridAxisGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper to create a grid layer
 *
 * [example usage](./examples/layer-axis.html)
 */
var GridAxisLayer = function (_AxisLayer) {
  (0, _inherits3.default)(GridAxisLayer, _AxisLayer);

  /**
   * @param {Object} options - An object to configure the layer.
   */
  function GridAxisLayer(options) {
    (0, _classCallCheck3.default)(this, GridAxisLayer);

    options = (0, _assign2.default)({
      color: 'steelblue',
      bpm: 60,
      signature: '4/4'
    }, options);

    var _this = (0, _possibleConstructorReturn3.default)(this, (GridAxisLayer.__proto__ || (0, _getPrototypeOf2.default)(GridAxisLayer)).call(this, (0, _gridAxisGenerator2.default)(options.bpm, options.signature), options));

    _this.configureShape(_ticks2.default, {}, {
      color: options.color
    });
    return _this;
  }

  return GridAxisLayer;
}(_axisLayer2.default);

exports.default = GridAxisLayer;

},{"../axis/axis-layer":1,"../axis/grid-axis-generator":2,"../shapes/ticks":41,"babel-runtime/core-js/object/assign":60,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _layer = require('../core/layer');

var _layer2 = _interopRequireDefault(_layer);

var _marker = require('../shapes/marker');

var _marker2 = _interopRequireDefault(_marker);

var _markerBehavior = require('../behaviors/marker-behavior');

var _markerBehavior2 = _interopRequireDefault(_markerBehavior);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper to create a marker layer.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */
var MarkerLayer = function (_Layer) {
  (0, _inherits3.default)(MarkerLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */
  function MarkerLayer(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck3.default)(this, MarkerLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (MarkerLayer.__proto__ || (0, _getPrototypeOf2.default)(MarkerLayer)).call(this, 'collection', data, options));

    options = (0, _assign2.default)({ displayHandlers: true }, options);
    var color = options.color;
    if (color) {
      accessors.color = function () {
        return color;
      };
    }

    _this.configureShape(_marker2.default, accessors, {
      displayHandlers: options.displayHandlers,
      opacity: options.opacity
    });

    _this.setBehavior(new _markerBehavior2.default());
    return _this;
  }

  return MarkerLayer;
}(_layer2.default);

exports.default = MarkerLayer;

},{"../behaviors/marker-behavior":6,"../core/layer":11,"../shapes/marker":39,"babel-runtime/core-js/object/assign":60,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _layer = require('../core/layer');

var _layer2 = _interopRequireDefault(_layer);

var _segment = require('../shapes/segment');

var _segment2 = _interopRequireDefault(_segment);

var _segmentBehavior = require('../behaviors/segment-behavior');

var _segmentBehavior2 = _interopRequireDefault(_segmentBehavior);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper to create a segment layer.
 *
 * [example usage](./examples/layer-segment.html)
 */
var SegmentLayer = function (_Layer) {
  (0, _inherits3.default)(SegmentLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */
  function SegmentLayer(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck3.default)(this, SegmentLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SegmentLayer.__proto__ || (0, _getPrototypeOf2.default)(SegmentLayer)).call(this, 'collection', data, options));

    options = (0, _assign2.default)({
      displayHandlers: true,
      opacity: 0.6
    }, options);

    _this.configureShape(_segment2.default, accessors, {
      displayHandlers: options.displayHandlers,
      opacity: options.opacity
    });

    _this.setBehavior(new _segmentBehavior2.default());
    return _this;
  }

  return SegmentLayer;
}(_layer2.default);

exports.default = SegmentLayer;

},{"../behaviors/segment-behavior":7,"../core/layer":11,"../shapes/segment":40,"babel-runtime/core-js/object/assign":60,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _layer = require('../core/layer');

var _layer2 = _interopRequireDefault(_layer);

var _ticks = require('../shapes/ticks');

var _ticks2 = _interopRequireDefault(_ticks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper to create a tick layer. Can be seen as a grid axis with user defined data
 * or as a marker layer with entity based data.
 */
var TickLayer = function (_Layer) {
  (0, _inherits3.default)(TickLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */
  function TickLayer(data, options, accessors) {
    (0, _classCallCheck3.default)(this, TickLayer);

    options = (0, _assign2.default)({}, options);

    var _this = (0, _possibleConstructorReturn3.default)(this, (TickLayer.__proto__ || (0, _getPrototypeOf2.default)(TickLayer)).call(this, 'entity', data, options));

    var config = options.color ? { color: options.color } : undefined;
    _this.configureShape(_ticks2.default, accessors, config);
    return _this;
  }

  return TickLayer;
}(_layer2.default);

exports.default = TickLayer;

},{"../core/layer":11,"../shapes/ticks":41,"babel-runtime/core-js/object/assign":60,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _axisLayer = require('../axis/axis-layer');

var _axisLayer2 = _interopRequireDefault(_axisLayer);

var _ticks = require('../shapes/ticks');

var _ticks2 = _interopRequireDefault(_ticks);

var _timeAxisGenerator = require('../axis/time-axis-generator');

var _timeAxisGenerator2 = _interopRequireDefault(_timeAxisGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper to create a time axis layer
 *
 * [example usage](./examples/layer-axis.html)
 */
var TimeAxisLayer = function (_AxisLayer) {
  (0, _inherits3.default)(TimeAxisLayer, _AxisLayer);

  /**
   * @param {Object} options - An object to configure the layer.
   */
  function TimeAxisLayer(options) {
    (0, _classCallCheck3.default)(this, TimeAxisLayer);

    options = (0, _assign2.default)({ color: 'steelblue' }, options);

    var _this = (0, _possibleConstructorReturn3.default)(this, (TimeAxisLayer.__proto__ || (0, _getPrototypeOf2.default)(TimeAxisLayer)).call(this, (0, _timeAxisGenerator2.default)(), options));

    _this.configureShape(_ticks2.default, {}, {
      color: options.color
    });
    return _this;
  }

  return TimeAxisLayer;
}(_axisLayer2.default);

exports.default = TimeAxisLayer;

},{"../axis/axis-layer":1,"../axis/time-axis-generator":3,"../shapes/ticks":41,"babel-runtime/core-js/object/assign":60,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _layer = require('../core/layer');

var _layer2 = _interopRequireDefault(_layer);

var _tracePath = require('../shapes/trace-path');

var _tracePath2 = _interopRequireDefault(_tracePath);

var _traceDots = require('../shapes/trace-dots');

var _traceDots2 = _interopRequireDefault(_traceDots);

var _traceBehavior = require('../behaviors/trace-behavior');

var _traceBehavior2 = _interopRequireDefault(_traceBehavior);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper to create a trace layer.
 *
 * [example usage](./examples/layer-trace.html)
 */
var TraceLayer = function (_Layer) {
  (0, _inherits3.default)(TraceLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */
  function TraceLayer(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck3.default)(this, TraceLayer);

    options = (0, _assign2.default)({ displayDots: true }, options);

    var _this = (0, _possibleConstructorReturn3.default)(this, (TraceLayer.__proto__ || (0, _getPrototypeOf2.default)(TraceLayer)).call(this, options.displayDots ? 'collection' : 'entity', data, options));

    var shapeOptions = {};
    if (options.meanColor !== undefined) {
      shapeOptions.meanColor = options.meanColor;
    }
    if (options.rangeColor !== undefined) {
      shapeOptions.rangeColor = options.rangeColor;
    }
    if (options.displayMean !== undefined) {
      shapeOptions.displayMean = options.displayMean;
    }

    if (options.displayDots) {
      _this.configureCommonShape(_tracePath2.default, accessors, shapeOptions);
      _this.configureShape(_traceDots2.default, accessors, shapeOptions);
    } else {
      _this.configureShape(_tracePath2.default, accessors, shapeOptions);
    }

    _this.setBehavior(new _traceBehavior2.default());
    return _this;
  }

  return TraceLayer;
}(_layer2.default);

exports.default = TraceLayer;

},{"../behaviors/trace-behavior":9,"../core/layer":11,"../shapes/trace-dots":42,"../shapes/trace-path":43,"babel-runtime/core-js/object/assign":60,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _layer = require('../core/layer');

var _layer2 = _interopRequireDefault(_layer);

var _waveform = require('../shapes/waveform');

var _waveform2 = _interopRequireDefault(_waveform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
  yDomain: [-1, 1],
  channel: 0,
  color: 'steelblue',
  renderingStrategy: 'svg'
};

/**
 * Helper to create a waveform layer.
 *
 * [example usage](./examples/layer-waveform.html)
 */

var WaveformLayer = function (_Layer) {
  (0, _inherits3.default)(WaveformLayer, _Layer);

  /**
   * @param {AudioBuffer} buffer - The audio buffer to display.
   * @param {Object} options - An object to configure the layer.
   */
  function WaveformLayer(buffer, options) {
    (0, _classCallCheck3.default)(this, WaveformLayer);

    options = (0, _assign2.default)({}, defaults, options);

    var _this = (0, _possibleConstructorReturn3.default)(this, (WaveformLayer.__proto__ || (0, _getPrototypeOf2.default)(WaveformLayer)).call(this, 'entity', buffer.getChannelData(options.channel), options));

    _this.configureShape(_waveform2.default, {}, {
      sampleRate: buffer.sampleRate,
      color: options.color,
      renderingStrategy: options.renderingStrategy
    });
    return _this;
  }

  return WaveformLayer;
}(_layer2.default);

exports.default = WaveformLayer;

},{"../core/layer":11,"../shapes/waveform":44,"babel-runtime/core-js/object/assign":60,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utils = exports.axis = exports.helpers = exports.states = exports.interactions = exports.behaviors = exports.shapes = exports.core = undefined;

var _layerTimeContext = require('./core/layer-time-context');

var _layerTimeContext2 = _interopRequireDefault(_layerTimeContext);

var _layer = require('./core/layer');

var _layer2 = _interopRequireDefault(_layer);

var _namespace = require('./core/namespace');

var _namespace2 = _interopRequireDefault(_namespace);

var _timelineTimeContext = require('./core/timeline-time-context');

var _timelineTimeContext2 = _interopRequireDefault(_timelineTimeContext);

var _timeline = require('./core/timeline');

var _timeline2 = _interopRequireDefault(_timeline);

var _trackCollection = require('./core/track-collection');

var _trackCollection2 = _interopRequireDefault(_trackCollection);

var _track = require('./core/track');

var _track2 = _interopRequireDefault(_track);

var _baseShape = require('./shapes/base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

var _cursor = require('./shapes/cursor');

var _cursor2 = _interopRequireDefault(_cursor);

var _dot = require('./shapes/dot');

var _dot2 = _interopRequireDefault(_dot);

var _line = require('./shapes/line');

var _line2 = _interopRequireDefault(_line);

var _marker = require('./shapes/marker');

var _marker2 = _interopRequireDefault(_marker);

var _segment = require('./shapes/segment');

var _segment2 = _interopRequireDefault(_segment);

var _ticks = require('./shapes/ticks');

var _ticks2 = _interopRequireDefault(_ticks);

var _tracePath = require('./shapes/trace-path');

var _tracePath2 = _interopRequireDefault(_tracePath);

var _traceDots = require('./shapes/trace-dots');

var _traceDots2 = _interopRequireDefault(_traceDots);

var _waveform = require('./shapes/waveform');

var _waveform2 = _interopRequireDefault(_waveform);

var _baseBehavior = require('./behaviors/base-behavior');

var _baseBehavior2 = _interopRequireDefault(_baseBehavior);

var _breakpointBehavior = require('./behaviors/breakpoint-behavior');

var _breakpointBehavior2 = _interopRequireDefault(_breakpointBehavior);

var _markerBehavior = require('./behaviors/marker-behavior');

var _markerBehavior2 = _interopRequireDefault(_markerBehavior);

var _segmentBehavior = require('./behaviors/segment-behavior');

var _segmentBehavior2 = _interopRequireDefault(_segmentBehavior);

var _timeContextBehavior = require('./behaviors/time-context-behavior');

var _timeContextBehavior2 = _interopRequireDefault(_timeContextBehavior);

var _traceBehavior = require('./behaviors/trace-behavior');

var _traceBehavior2 = _interopRequireDefault(_traceBehavior);

var _eventSource = require('./interactions/event-source');

var _eventSource2 = _interopRequireDefault(_eventSource);

var _keyboard = require('./interactions/keyboard');

var _keyboard2 = _interopRequireDefault(_keyboard);

var _surface = require('./interactions/surface');

var _surface2 = _interopRequireDefault(_surface);

var _waveEvent = require('./interactions/wave-event');

var _waveEvent2 = _interopRequireDefault(_waveEvent);

var _baseState = require('./states/base-state');

var _baseState2 = _interopRequireDefault(_baseState);

var _breakpointState = require('./states/breakpoint-state');

var _breakpointState2 = _interopRequireDefault(_breakpointState);

var _brushZoomState = require('./states/brush-zoom-state');

var _brushZoomState2 = _interopRequireDefault(_brushZoomState);

var _centeredZoomState = require('./states/centered-zoom-state');

var _centeredZoomState2 = _interopRequireDefault(_centeredZoomState);

var _contextEditionState = require('./states/context-edition-state');

var _contextEditionState2 = _interopRequireDefault(_contextEditionState);

var _editionState = require('./states/edition-state');

var _editionState2 = _interopRequireDefault(_editionState);

var _selectionState = require('./states/selection-state');

var _selectionState2 = _interopRequireDefault(_selectionState);

var _simpleEditionState = require('./states/simple-edition-state');

var _simpleEditionState2 = _interopRequireDefault(_simpleEditionState);

var _annotatedMarkerLayer = require('./helpers/annotated-marker-layer');

var _annotatedMarkerLayer2 = _interopRequireDefault(_annotatedMarkerLayer);

var _annotatedSegmentLayer = require('./helpers/annotated-segment-layer');

var _annotatedSegmentLayer2 = _interopRequireDefault(_annotatedSegmentLayer);

var _breakpointLayer = require('./helpers/breakpoint-layer');

var _breakpointLayer2 = _interopRequireDefault(_breakpointLayer);

var _cursorLayer = require('./helpers/cursor-layer');

var _cursorLayer2 = _interopRequireDefault(_cursorLayer);

var _gridAxisLayer = require('./helpers/grid-axis-layer');

var _gridAxisLayer2 = _interopRequireDefault(_gridAxisLayer);

var _markerLayer = require('./helpers/marker-layer');

var _markerLayer2 = _interopRequireDefault(_markerLayer);

var _segmentLayer = require('./helpers/segment-layer');

var _segmentLayer2 = _interopRequireDefault(_segmentLayer);

var _tickLayer = require('./helpers/tick-layer');

var _tickLayer2 = _interopRequireDefault(_tickLayer);

var _timeAxisLayer = require('./helpers/time-axis-layer');

var _timeAxisLayer2 = _interopRequireDefault(_timeAxisLayer);

var _traceLayer = require('./helpers/trace-layer');

var _traceLayer2 = _interopRequireDefault(_traceLayer);

var _waveformLayer = require('./helpers/waveform-layer');

var _waveformLayer2 = _interopRequireDefault(_waveformLayer);

var _axisLayer = require('./axis/axis-layer');

var _axisLayer2 = _interopRequireDefault(_axisLayer);

var _timeAxisGenerator = require('./axis/time-axis-generator');

var _timeAxisGenerator2 = _interopRequireDefault(_timeAxisGenerator);

var _gridAxisGenerator = require('./axis/grid-axis-generator');

var _gridAxisGenerator2 = _interopRequireDefault(_gridAxisGenerator);

var _format = require('./utils/format');

var _format2 = _interopRequireDefault(_format);

var _orthogonalData = require('./utils/orthogonal-data');

var _orthogonalData2 = _interopRequireDefault(_orthogonalData);

var _scales = require('./utils/scales');

var _scales2 = _interopRequireDefault(_scales);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// axis
// core
var core = exports.core = {
  LayerTimeContext: _layerTimeContext2.default, Layer: _layer2.default, namespace: _namespace2.default,
  TimelineTimeContext: _timelineTimeContext2.default, Timeline: _timeline2.default, TrackCollection: _trackCollection2.default, Track: _track2.default
};

// utils


// helpers


// states


// interactions


// behaviors


// shapes
var shapes = exports.shapes = {
  BaseShape: _baseShape2.default, Cursor: _cursor2.default, Dot: _dot2.default, Line: _line2.default, Marker: _marker2.default, Segment: _segment2.default,
  Ticks: _ticks2.default, TracePath: _tracePath2.default, TraceDots: _traceDots2.default, Waveform: _waveform2.default
};

var behaviors = exports.behaviors = {
  BaseBehavior: _baseBehavior2.default, BreakpointBehavior: _breakpointBehavior2.default, MarkerBehavior: _markerBehavior2.default, SegmentBehavior: _segmentBehavior2.default,
  TimeContextBehavior: _timeContextBehavior2.default, TraceBehavior: _traceBehavior2.default
};

var interactions = exports.interactions = { EventSource: _eventSource2.default, Keyboard: _keyboard2.default, Surface: _surface2.default, WaveEvent: _waveEvent2.default };

var states = exports.states = {
  BaseState: _baseState2.default, BreakpointState: _breakpointState2.default, BrushZoomState: _brushZoomState2.default, CenteredZoomState: _centeredZoomState2.default,
  ContextEditionState: _contextEditionState2.default, EditionState: _editionState2.default, SelectionState: _selectionState2.default, SimpleEditionState: _simpleEditionState2.default
};

var helpers = exports.helpers = {
  AnnotatedMarkerLayer: _annotatedMarkerLayer2.default, AnnotatedSegmentLayer: _annotatedSegmentLayer2.default, BreakpointLayer: _breakpointLayer2.default,
  CursorLayer: _cursorLayer2.default, GridAxisLayer: _gridAxisLayer2.default, MarkerLayer: _markerLayer2.default, SegmentLayer: _segmentLayer2.default, TickLayer: _tickLayer2.default,
  TimeAxisLayer: _timeAxisLayer2.default, TraceLayer: _traceLayer2.default, WaveformLayer: _waveformLayer2.default
};

var axis = exports.axis = {
  AxisLayer: _axisLayer2.default, timeAxisGenerator: _timeAxisGenerator2.default, gridAxisGenerator: _gridAxisGenerator2.default
};

var utils = exports.utils = {
  format: _format2.default, OrthogonalData: _orthogonalData2.default, scales: _scales2.default
};

},{"./axis/axis-layer":1,"./axis/grid-axis-generator":2,"./axis/time-axis-generator":3,"./behaviors/base-behavior":4,"./behaviors/breakpoint-behavior":5,"./behaviors/marker-behavior":6,"./behaviors/segment-behavior":7,"./behaviors/time-context-behavior":8,"./behaviors/trace-behavior":9,"./core/layer":11,"./core/layer-time-context":10,"./core/namespace":12,"./core/timeline":14,"./core/timeline-time-context":13,"./core/track":16,"./core/track-collection":15,"./helpers/annotated-marker-layer":17,"./helpers/annotated-segment-layer":18,"./helpers/breakpoint-layer":19,"./helpers/cursor-layer":20,"./helpers/grid-axis-layer":21,"./helpers/marker-layer":22,"./helpers/segment-layer":23,"./helpers/tick-layer":24,"./helpers/time-axis-layer":25,"./helpers/trace-layer":26,"./helpers/waveform-layer":27,"./interactions/event-source":29,"./interactions/keyboard":30,"./interactions/surface":31,"./interactions/wave-event":32,"./shapes/base-shape":35,"./shapes/cursor":36,"./shapes/dot":37,"./shapes/line":38,"./shapes/marker":39,"./shapes/segment":40,"./shapes/ticks":41,"./shapes/trace-dots":42,"./shapes/trace-path":43,"./shapes/waveform":44,"./states/base-state":45,"./states/breakpoint-state":46,"./states/brush-zoom-state":47,"./states/centered-zoom-state":48,"./states/context-edition-state":49,"./states/edition-state":50,"./states/selection-state":51,"./states/simple-edition-state":52,"./utils/format":53,"./utils/orthogonal-data":54,"./utils/scales":55}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Abstract class to extend to create new sources of interactions.
 * A `Surface` and `Keyboard` event sources are provided.
 */
var EventSource = function (_events$EventEmitter) {
  (0, _inherits3.default)(EventSource, _events$EventEmitter);

  function EventSource($el) {
    (0, _classCallCheck3.default)(this, EventSource);

    /**
     * The element on which the listener is added
     * @type {Element}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (EventSource.__proto__ || (0, _getPrototypeOf2.default)(EventSource)).call(this));

    _this.$el = $el;
    return _this;
  }

  (0, _createClass3.default)(EventSource, [{
    key: 'destroy',
    value: function destroy() {
      this.unbindEvents();
    }
  }, {
    key: 'createEvent',
    value: function createEvent(type, e) {}
  }, {
    key: 'bindEvents',
    value: function bindEvents() {}
  }, {
    key: 'unbindEvents',
    value: function unbindEvents() {}
  }]);
  return EventSource;
}(_events2.default.EventEmitter);

exports.default = EventSource;

},{"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74,"events":196}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _eventSource = require('./event-source');

var _eventSource2 = _interopRequireDefault(_eventSource);

var _waveEvent = require('./wave-event');

var _waveEvent2 = _interopRequireDefault(_waveEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A global event sourve for the keyboard. Only one instance of this source
 * can be created. The first created timeline instanciate the singleton, each
 * subsequent instanciation returns the first created instance.
 */
var Keyboard = function (_EventSource) {
  (0, _inherits3.default)(Keyboard, _EventSource);

  /**
   * @param {Element} $el - The element on which to install the listener.
   */
  function Keyboard($el) {
    (0, _classCallCheck3.default)(this, Keyboard);

    /**
     * The name of the source
     * @type {String}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (Keyboard.__proto__ || (0, _getPrototypeOf2.default)(Keyboard)).call(this, $el));

    _this.sourceName = 'keyboard';

    _this._onKeyDown = _this._onKeyDown.bind(_this);
    _this._onKeyUp = _this._onKeyUp.bind(_this);

    _this.bindEvents();
    return _this;
  }

  (0, _createClass3.default)(Keyboard, [{
    key: 'createEvent',
    value: function createEvent(type, e) {
      var event = new _waveEvent2.default(this.sourceName, type, e);

      event.shiftKey = e.shiftKey;
      event.ctrlKey = e.ctrlKey;
      event.altKey = e.altKey;
      event.metaKey = e.metaKey;
      event.which = e.which;
      event.char = String.fromCharCode(e.which);

      return event;
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      this.$el.addEventListener('keydown', this._onKeyDown, false);
      this.$el.addEventListener('keyup', this._onKeyUp, false);
    }
  }, {
    key: 'unbindEvents',
    value: function unbindEvents() {
      this.$el.removeEventListener('keydown', this._onKeyDown, false);
      this.$el.removeEventListener('keyup', this._onKeyUp, false);
    }
  }, {
    key: '_onKeyDown',
    value: function _onKeyDown(e) {
      var event = this.createEvent('keydown', e);
      this.emit('event', event);
    }
  }, {
    key: '_onKeyUp',
    value: function _onKeyUp(e) {
      var event = this.createEvent('keyup', e);
      this.emit('event', event);
    }
  }]);
  return Keyboard;
}(_eventSource2.default);

exports.default = Keyboard;

},{"./event-source":29,"./wave-event":32,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _eventSource = require('./event-source');

var _eventSource2 = _interopRequireDefault(_eventSource);

var _waveEvent = require('./wave-event');

var _waveEvent2 = _interopRequireDefault(_waveEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Normalizes mouse user interactions with the timeline upon the DOM
 * container element of `Track` instances. As soon as a `track` is added to a
 * `timeline`, its attached `Surface` instance will emit the mouse events.
 */
var Surface = function (_EventSource) {
  (0, _inherits3.default)(Surface, _EventSource);

  /**
   * @param {DOMElement} el - The DOM element to listen.
   * @todo - Add some padding to the surface.
   */
  function Surface($el) {
    (0, _classCallCheck3.default)(this, Surface);

    /**
     * The name of the event source.
     * @type {String}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (Surface.__proto__ || (0, _getPrototypeOf2.default)(Surface)).call(this, $el));

    _this.sourceName = 'surface';
    _this._mouseDownEvent = null;
    _this._lastEvent = null;

    _this._onMouseDown = _this._onMouseDown.bind(_this);
    _this._onMouseMove = _this._onMouseMove.bind(_this);
    _this._onMouseUp = _this._onMouseUp.bind(_this);
    _this._onClick = _this._onClick.bind(_this);
    _this._onDblClick = _this._onDblClick.bind(_this);
    _this._onMouseOver = _this._onMouseOver.bind(_this);
    _this._onMouseOut = _this._onMouseOut.bind(_this);

    _this.bindEvents();
    return _this;
  }

  /**
   * Factory method for `Event` class
   */


  (0, _createClass3.default)(Surface, [{
    key: 'createEvent',
    value: function createEvent(type, e) {
      var event = new _waveEvent2.default(this.sourceName, type, e);

      var pos = this._getRelativePosition(e);
      event.x = pos.x;
      event.y = pos.y;

      return event;
    }

    /**
     * Keep this private to avoid double event binding. Main logic of the surface
     * is here. Should be extended with needed events (mouseenter, mouseleave,
     * wheel ...).
     *
     * @todo - throttle
     * @private
     */

  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      // Bind callbacks
      this.$el.addEventListener('mousedown', this._onMouseDown, false);
      this.$el.addEventListener('click', this._onClick, false);
      this.$el.addEventListener('dblclick', this._onDblClick, false);
      this.$el.addEventListener('mouseover', this._onMouseOver, false);
      this.$el.addEventListener('mouseout', this._onMouseOut, false);
    }
  }, {
    key: 'unbindEvents',
    value: function unbindEvents() {
      // Bind callbacks
      this.$el.removeEventListener('mousedown', this._onMouseDown, false);
      this.$el.removeEventListener('click', this._onClick, false);
      this.$el.removeEventListener('dblclick', this._onDblClick, false);
      this.$el.removeEventListener('mouseover', this._onMouseOver, false);
      this.$el.removeEventListener('mouseout', this._onMouseOut, false);

      window.removeEventListener('mousemove', this._onMouseMove);
      window.removeEventListener('mouseup', this._onMouseUp);
    }

    /**
     * Returns the x, y coordinates coordinates relative to the surface element.
     *
     * @param {Event} e - Raw event from listener.
     * @return {Object}
     * @todo - handle padding.
     */

  }, {
    key: '_getRelativePosition',
    value: function _getRelativePosition(e) {
      // @TODO: should be able to ignore padding
      var x = 0;
      var y = 0;
      var clientRect = this.$el.getBoundingClientRect();
      var scrollLeft = document.body.scrollLeft + document.documentElement.scrollLeft;
      var scrollTop = document.body.scrollTop + document.documentElement.scrollTop;

      // Adapted from http://www.quirksmode.org/js/events_properties.html#position
      if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
      } else if (e.clientX || e.clientY) {
        // Normalize to pageX, pageY
        x = e.clientX + scrollLeft;
        y = e.clientY + scrollTop;
      }

      // clientRect refers to the client, not to the page
      x = x - (clientRect.left + scrollLeft);
      y = y - (clientRect.top + scrollTop);

      return { x: x, y: y };
    }
  }, {
    key: '_defineArea',
    value: function _defineArea(e, mouseDownEvent, lastEvent) {
      if (!mouseDownEvent || !lastEvent) {
        return;
      }
      e.dx = e.x - lastEvent.x;
      e.dy = e.y - lastEvent.y;

      var left = mouseDownEvent.x < e.x ? mouseDownEvent.x : e.x;
      var top = mouseDownEvent.y < e.y ? mouseDownEvent.y : e.y;
      var width = Math.abs(Math.round(e.x - mouseDownEvent.x));
      var height = Math.abs(Math.round(e.y - mouseDownEvent.y));

      e.area = { left: left, top: top, width: width, height: height };
    }
  }, {
    key: '_onMouseDown',
    value: function _onMouseDown(e) {
      // by removing the previous selection we prevent bypassing the mousemove events coming from SVG in Firefox.
      window.getSelection().removeAllRanges();
      var event = this.createEvent('mousedown', e);

      this._mouseDownEvent = event;
      this._lastEvent = event;
      // Register mousemove and mouseup listeners on window
      window.addEventListener('mousemove', this._onMouseMove, false);
      window.addEventListener('mouseup', this._onMouseUp, false);

      this.emit('event', event);
    }
  }, {
    key: '_onMouseMove',
    value: function _onMouseMove(e) {
      var event = this.createEvent('mousemove', e);
      this._defineArea(event, this._mouseDownEvent, this._lastEvent);
      // Update `lastEvent` for next call
      this._lastEvent = event;

      this.emit('event', event);
    }
  }, {
    key: '_onMouseUp',
    value: function _onMouseUp(e) {
      var event = this.createEvent('mouseup', e);
      this._defineArea(event, this._mouseDownEvent, this._lastEvent);

      this._mouseDownEvent = null;
      this._lastEvent = null;
      // Remove mousemove and mouseup listeners on window
      window.removeEventListener('mousemove', this._onMouseMove);
      window.removeEventListener('mouseup', this._onMouseUp);

      this.emit('event', event);
    }
  }, {
    key: '_onClick',
    value: function _onClick(e) {
      var event = this.createEvent('click', e);
      this.emit('event', event);
    }
  }, {
    key: '_onDblClick',
    value: function _onDblClick(e) {
      var event = this.createEvent('dblclick', e);
      this.emit('event', event);
    }
  }, {
    key: '_onMouseOver',
    value: function _onMouseOver(e) {
      var event = this.createEvent('mouseover', e);
      this.emit('event', event);
    }
  }, {
    key: '_onMouseOut',
    value: function _onMouseOut(e) {
      var event = this.createEvent('mouseout', e);
      this.emit('event', event);
    }
  }]);
  return Surface;
}(_eventSource2.default);

exports.default = Surface;

},{"./event-source":29,"./wave-event":32,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Object template for all events. Event sources should use this event template
 * in order to keep consistency with existing sources.
 */
var WaveEvent =
/**
 * @param {String} source - The name of the source (`keyboard`, `surface`, ...).
 * @param {String} type - The type of the source (`mousedown`, `keyup`, ...).
 * @param {Event} originalEvent - The original event as emitted by the browser.
 */
function WaveEvent(source, type, originalEvent) {
  (0, _classCallCheck3.default)(this, WaveEvent);

  this.source = source;
  this.type = type;
  this.originalEvent = originalEvent;

  this.target = originalEvent.target;
  this.currentTarget = originalEvent.currentTarget;
};

exports.default = WaveEvent;

},{"babel-runtime/helpers/classCallCheck":70}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _marker = require('./marker');

var _marker2 = _interopRequireDefault(_marker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A shape to display a marker with annotation.
 *
 * [example usage](./examples/layer-marker.html)
 */
var AnnotatedMarker = function (_Marker) {
  (0, _inherits3.default)(AnnotatedMarker, _Marker);

  function AnnotatedMarker() {
    (0, _classCallCheck3.default)(this, AnnotatedMarker);
    return (0, _possibleConstructorReturn3.default)(this, (AnnotatedMarker.__proto__ || (0, _getPrototypeOf2.default)(AnnotatedMarker)).apply(this, arguments));
  }

  (0, _createClass3.default)(AnnotatedMarker, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'annotated-marker';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      var list = (0, _get3.default)(AnnotatedMarker.prototype.__proto__ || (0, _getPrototypeOf2.default)(AnnotatedMarker.prototype), '_getAccessorList', this).call(this);
      list.text = 'default';
      return list;
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      this.$el = (0, _get3.default)(AnnotatedMarker.prototype.__proto__ || (0, _getPrototypeOf2.default)(AnnotatedMarker.prototype), 'render', this).call(this, renderingContext);
      var height = renderingContext.height;

      this.$label = document.createElementNS(this.ns, 'text');
      this.$label.setAttributeNS(null, 'x', 8);
      this.$label.setAttributeNS(null, 'y', 8);
      this.$label.setAttributeNS(null, 'transform', 'matrix(1, 0, 0, -1, 0, ' + height + ')');
      this.$label.style.fontSize = '10px';
      this.$label.style.fontFamily = 'monospace';
      this.$label.style.color = '#242424';
      this.$label.style.mozUserSelect = 'none';
      this.$label.style.webkitUserSelect = 'none';
      this.$label.style.userSelect = 'none';

      this.$el.appendChild(this.$label);

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      (0, _get3.default)(AnnotatedMarker.prototype.__proto__ || (0, _getPrototypeOf2.default)(AnnotatedMarker.prototype), 'update', this).call(this, renderingContext, datum);

      if (this.$label.firstChild) {
        this.$label.removeChild(this.$label.firstChild);
      }

      var $text = document.createTextNode(this.text(datum));
      this.$label.appendChild($text);
    }
  }]);
  return AnnotatedMarker;
}(_marker2.default);

exports.default = AnnotatedMarker;

},{"./marker":39,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _segment = require('./segment');

var _segment2 = _interopRequireDefault(_segment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A shape to display a segment with annotation.
 *
 * [example usage](./examples/layer-segment.html)
 */
var AnnotatedSegment = function (_Segment) {
  (0, _inherits3.default)(AnnotatedSegment, _Segment);

  function AnnotatedSegment() {
    (0, _classCallCheck3.default)(this, AnnotatedSegment);
    return (0, _possibleConstructorReturn3.default)(this, (AnnotatedSegment.__proto__ || (0, _getPrototypeOf2.default)(AnnotatedSegment)).apply(this, arguments));
  }

  (0, _createClass3.default)(AnnotatedSegment, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'annotated-segment';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      var list = (0, _get3.default)(AnnotatedSegment.prototype.__proto__ || (0, _getPrototypeOf2.default)(AnnotatedSegment.prototype), '_getAccessorList', this).call(this);
      list.text = 'default';
      return list;
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      this.$el = (0, _get3.default)(AnnotatedSegment.prototype.__proto__ || (0, _getPrototypeOf2.default)(AnnotatedSegment.prototype), 'render', this).call(this, renderingContext);
      var height = renderingContext.height;

      this.$label = document.createElementNS(this.ns, 'text');
      this.$label.setAttributeNS(null, 'x', 3);
      this.$label.setAttributeNS(null, 'y', 11);
      this.$label.setAttributeNS(null, 'transform', 'matrix(1, 0, 0, -1, 0, ' + height + ')');
      this.$label.style.fontSize = '10px';
      this.$label.style.fontFamily = 'monospace';
      this.$label.style.color = '#242424';
      this.$label.style.mozUserSelect = 'none';
      this.$label.style.webkitUserSelect = 'none';
      this.$label.style.userSelect = 'none';

      this.$el.appendChild(this.$label);

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      (0, _get3.default)(AnnotatedSegment.prototype.__proto__ || (0, _getPrototypeOf2.default)(AnnotatedSegment.prototype), 'update', this).call(this, renderingContext, datum);

      if (this.$label.firstChild) {
        this.$label.removeChild(this.$label.firstChild);
      }

      var $text = document.createTextNode(this.text(datum));
      this.$label.appendChild($text);
    }
  }]);
  return AnnotatedSegment;
}(_segment2.default);

exports.default = AnnotatedSegment;

},{"./segment":40,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _namespace = require('../core/namespace');

var _namespace2 = _interopRequireDefault(_namespace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Is an abstract class or interface to be overriden in order to define new
 * shapes. Shapes define the way a given datum should be rendered, they are
 * the smallest unit of rendering into a timeline.
 *
 * All the life cycle of `Shape` instances is handled into the `Layer` instance
 * they are attach to. As a consequence, they should be mainly considered as
 * private objects. The only place they should be interacted with is in `Behavior`
 * definitions, to test which element of the shape is the target of the
 * interaction and define the interaction according to that test.
 *
 * Depending of its implementation a `Shape` can be used along with `entity` or
 * `collection` data type. Some shapes are then created to use data considered
 * as a single entity (Waveform, TracePath, Line), while others are defined to
 * be used with data seen as a collection, each shape rendering a single entry
 * of the collection. The shapes working with entity type data should therefore
 * be used in an `entity` configured `Layer`. Note that if they are registered
 * as "commonShape" in a `collection` type `Layer`, they will behave the exact
 * same way. These kind of shapes are noted: "entity shape".
 *
 * ### Available `collection` shapes:
 * - Marker / Annotated Marker
 * - Segment / Annotated Segment
 * - Dot
 * - TraceDots
 *
 * ### Available `entity` shapes:
 * - Line
 * - Tick (for axis)
 * - Waveform
 * - TracePath
 */
var BaseShape = function () {
  /**
   * @param {Object} options - override default configuration
   */
  function BaseShape() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, BaseShape);

    /** @type {Element} - Svg element to be returned by the `render` method. */
    this.$el = null;
    /** @type {String} - Svg namespace. */
    this.ns = _namespace2.default;
    /** @type {Object} - Object containing the global parameters of the shape */
    this.params = (0, _assign2.default)({}, this._getDefaults(), options);
    // create accessors methods and set default accessor functions
    var accessors = this._getAccessorList();
    this._createAccessors(accessors);
    this._setDefaultAccessors(accessors);
  }

  /**
   * Destroy the shape and clean references. Interface method called from the `layer`.
   */


  (0, _createClass3.default)(BaseShape, [{
    key: 'destroy',
    value: function destroy() {
      // this.group = null;
      this.$el = null;
    }

    /**
     * Interface method to override when extending this base class. The method
     * is called by the `Layer~render` method. Returns the name of the shape,
     * used as a class in the element group (defaults to `'shape'`).
     *
     * @return {String}
     */

  }, {
    key: 'getClassName',
    value: function getClassName() {
      return 'shape';
    }

    /**
     * @todo not implemented
     * allow to install defs in the track svg element. Should be called when
     * adding the `Layer` to the `Track`.
     */
    // setSvgDefinition(defs) {}

    /**
     * Returns the defaults for global configuration of the shape.
     * @protected
     * @return {Object}
     */

  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {};
    }

    /**
     * Returns an object where keys are the accessors methods names to create
     * and values are the default values for each given accessor.
     *
     * @protected
     * @todo rename ?
     * @return {Object}
     */

  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return {};
    }

    /**
     * Interface method called by Layer when creating a shape. Install the
     * given accessors on the shape, overriding the default accessors.
     *
     * @param {Object<String, function>} accessors
     */

  }, {
    key: 'install',
    value: function install(accessors) {
      for (var key in accessors) {
        this[key] = accessors[key];
      }
    }

    /**
     * Generic method to create accessors. Adds getters en setters to the
     * prototype if not already present.
     */

  }, {
    key: '_createAccessors',
    value: function _createAccessors(accessors) {
      this._accessors = {};
      // add it to the prototype
      var proto = (0, _getPrototypeOf2.default)(this);
      // create a getter / setter for each accessors
      // setter : `this.x = callback`
      // getter : `this.x(datum)`
      (0, _keys2.default)(accessors).forEach(function (name) {
        if (proto.hasOwnProperty(name)) {
          return;
        }

        (0, _defineProperty2.default)(proto, name, {
          get: function get() {
            return this._accessors[name];
          },
          set: function set(func) {
            this._accessors[name] = func;
          }
        });
      });
    }

    /**
     * Create a function to be used as a default accessor for each accesors
     */

  }, {
    key: '_setDefaultAccessors',
    value: function _setDefaultAccessors(accessors) {
      var _this = this;

      (0, _keys2.default)(accessors).forEach(function (name) {
        var defaultValue = accessors[name];
        var accessor = function accessor(d) {
          var v = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

          if (v === null) {
            return d[name] || defaultValue;
          }
          d[name] = v;
        };
        // set accessor as the default one
        _this[name] = accessor;
      });
    }

    /**
     * Interface method called by `Layer~render`. Creates the DOM structure of
     * the shape.
     *
     * @param {Object} renderingContext - the renderingContext of the layer
     *    which owns this shape.
     * @return {Element} - the DOM element to insert in the item's group.
     */

  }, {
    key: 'render',
    value: function render(renderingContext) {}

    /**
     * Interface method called by `Layer~update`. Updates the DOM structure of the shape.
     *
     * @param {Object} renderingContext - The `renderingContext` of the layer
     *    which owns this shape.
     * @param {Object|Array} datum - The datum associated to the shape.
     */

  }, {
    key: 'update',
    value: function update(renderingContext, datum) {}

    /**
     * Interface method to override called by `Layer~getItemsInArea`. Defines if
     * the shape is considered to be the given area. Arguments are passed in pixel domain.
     *
     * @param {Object} renderingContext - the renderingContext of the layer which
     *    owns this shape.
     * @param {Object|Array} datum - The datum associated to the shape.
     * @param {Number} x1 - The x component of the top-left corner of the area to test.
     * @param {Number} y1 - The y component of the top-left corner of the area to test.
     * @param {Number} x2 - The x component of the bottom-right corner of the area to test.
     * @param {Number} y2 - The y component of the bottom-right corner of the area to test.
     * @return {Boolean} - Returns `true` if the is considered to be in the given area, `false` otherwise.
     */

  }, {
    key: 'inArea',
    value: function inArea(renderingContext, datum, x1, y1, x2, y2) {}
  }]);
  return BaseShape;
}();

exports.default = BaseShape;

},{"../core/namespace":12,"babel-runtime/core-js/object/assign":60,"babel-runtime/core-js/object/define-property":62,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/core-js/object/keys":65,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

var _namespace = require('../core/namespace');

var _namespace2 = _interopRequireDefault(_namespace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A shape to display a cursor.
 *
 * [example usage](./examples/layer-cursor.html)
 */
var Cursor = function (_BaseShape) {
  (0, _inherits3.default)(Cursor, _BaseShape);

  function Cursor() {
    (0, _classCallCheck3.default)(this, Cursor);
    return (0, _possibleConstructorReturn3.default)(this, (Cursor.__proto__ || (0, _getPrototypeOf2.default)(Cursor)).apply(this, arguments));
  }

  (0, _createClass3.default)(Cursor, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'cursor';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { x: 0 };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        color: '#000000',
        opacity: 1
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      this.$el = document.createElementNS(_namespace2.default, 'line');
      this.$el.setAttributeNS(null, 'x', 0);
      this.$el.setAttributeNS(null, 'y1', 0);
      this.$el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
      this.$el.style.stroke = this.params.color;

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      var floatX = renderingContext.timeToPixel(this.x(datum));
      var x = Math.round(floatX);

      this.$el.setAttributeNS(null, 'transform', 'translate(' + x + ', 0)');
      this.$el.setAttributeNS(null, 'y2', renderingContext.height);
    }

    /**
     * The cursor cannot be selected.
     * @return {Boolean} false
     */

  }, {
    key: 'inArea',
    value: function inArea() {
      return false;
    }
  }]);
  return Cursor;
}(_baseShape2.default);

exports.default = Cursor;

},{"../core/namespace":12,"./base-shape":35,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A shape to display a dot.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */
var Dot = function (_BaseShape) {
  (0, _inherits3.default)(Dot, _BaseShape);

  function Dot() {
    (0, _classCallCheck3.default)(this, Dot);
    return (0, _possibleConstructorReturn3.default)(this, (Dot.__proto__ || (0, _getPrototypeOf2.default)(Dot)).apply(this, arguments));
  }

  (0, _createClass3.default)(Dot, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'dot';
    }

    // @TODO rename : confusion between accessors and meta-accessors

  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { cx: 0, cy: 0, r: 3, color: '#000000' };
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.$el) {
        return this.$el;
      }

      this.$el = document.createElementNS(this.ns, 'circle');

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      var cx = renderingContext.timeToPixel(this.cx(datum));
      var cy = renderingContext.valueToPixel(this.cy(datum));
      var r = this.r(datum);
      var color = this.color(datum);

      this.$el.setAttributeNS(null, 'transform', 'translate(' + cx + ', ' + cy + ')');
      this.$el.setAttributeNS(null, 'r', r);
      this.$el.style.fill = color;
    }

    // x1, x2, y1, y2 => in pixel domain

  }, {
    key: 'inArea',
    value: function inArea(renderingContext, datum, x1, y1, x2, y2) {
      var cx = renderingContext.timeToPixel(this.cx(datum));
      var cy = renderingContext.valueToPixel(this.cy(datum));

      if (cx > x1 && cx < x2 && cy > y1 && cy < y2) {
        return true;
      }

      return false;
    }
  }]);
  return Dot;
}(_baseShape2.default);

exports.default = Dot;

},{"./base-shape":35,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A shape to display a line. Its main use is as common shape to create a
 * breakpoint visualization. (entity shape)
 *
 * [example usage](./examples/layer-breakpoint.html)
 */
var Line = function (_BaseShape) {
  (0, _inherits3.default)(Line, _BaseShape);

  function Line() {
    (0, _classCallCheck3.default)(this, Line);
    return (0, _possibleConstructorReturn3.default)(this, (Line.__proto__ || (0, _getPrototypeOf2.default)(Line)).apply(this, arguments));
  }

  (0, _createClass3.default)(Line, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'line';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { cx: 0, cy: 0 };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return { color: '#000000' };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }

      this.$el = document.createElementNS(this.ns, 'path');
      // this.el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, data) {
      var _this2 = this;

      data = data.slice(0);
      data.sort(function (a, b) {
        return _this2.cx(a) < _this2.cx(b) ? -1 : 1;
      });

      var path = 'M';
      var length = data.length;

      for (var i = 0; i < length; i++) {
        var x = renderingContext.timeToPixel(this.cx(datum));
        var y = renderingContext.valueToPixel(this.cy(datum)) - 0.5;
        path += x + ',' + y;

        if (i < length - 1) path += 'L';
      }

      this.$el.setAttributeNS(null, 'd', this._buildLine(renderingContext, data));
      this.$el.style.stroke = this.params.color;
      this.$el.style.fill = 'none';

      data = null;
    }
  }]);
  return Line;
}(_baseShape2.default);

exports.default = Line;

},{"./base-shape":35,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A shape to display a marker.
 *
 * [example usage](./examples/layer-marker.html)
 */
var Marker = function (_BaseShape) {
  (0, _inherits3.default)(Marker, _BaseShape);

  function Marker() {
    (0, _classCallCheck3.default)(this, Marker);
    return (0, _possibleConstructorReturn3.default)(this, (Marker.__proto__ || (0, _getPrototypeOf2.default)(Marker)).apply(this, arguments));
  }

  (0, _createClass3.default)(Marker, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'marker';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { x: 0, color: '#ff0000', label: '' };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        handlerWidth: 7,
        handlerHeight: 10,
        displayHandlers: true,
        opacity: 1,
        color: 'red',
        displayLabels: false,
        labelWidth: 60
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) return this.$el;

      var height = renderingContext.height;

      this.$el = document.createElementNS(this.ns, 'g');
      this.$line = document.createElementNS(this.ns, 'line');

      // draw line
      this.$line.setAttributeNS(null, 'x', 0);
      this.$line.setAttributeNS(null, 'y1', 0);
      this.$line.setAttributeNS(null, 'shape-rendering', 'crispEdges');

      this.$el.appendChild(this.$line);

      if (this.params.displayHandlers) {
        this.$handler = document.createElementNS(this.ns, 'rect');

        this.$handler.setAttributeNS(null, 'x', -this.params.handlerWidth / 2);
        this.$handler.setAttributeNS(null, 'width', this.params.handlerWidth);
        this.$handler.setAttributeNS(null, 'height', this.params.handlerHeight);
        this.$handler.setAttributeNS(null, 'shape-rendering', 'crispEdges');

        this.$el.appendChild(this.$handler);
      }

      if (this.params.displayLabels) {
        // prefer html `div` over svg `text` tag because we then use the `contenteditable` property
        this.$foreignObject = document.createElementNS(this.ns, 'foreignObject');

        this.$label = document.createElement('div');
        this.$label.style.display = 'block';
        this.$label.style.width = this.params.labelWidth + 'px';
        this.$label.style.fontSize = '12px';
        this.$label.style.fontFamily = 'arial';
        this.$label.style.userSelect = 'none';

        this.$foreignObject.appendChild(this.$label);
        this.$el.appendChild(this.$foreignObject);
      }

      this.$el.style.opacity = this.params.opacity;

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      var x = renderingContext.timeToPixel(this.x(datum)) - 0.5;
      var color = this.color(datum);
      var height = renderingContext.height;

      this.$el.setAttributeNS(null, 'transform', 'translate(' + x + ', 0)');

      this.$line.setAttributeNS(null, 'y2', height);
      this.$line.style.stroke = color;

      if (this.params.displayHandlers) {
        this.$handler.setAttributeNS(null, 'y', height - this.params.handlerHeight);
        this.$handler.style.fill = color;
      }

      if (this.params.displayLabels) {
        var matrix = 'matrix(1, 0, 0, -1, ' + this.params.handlerWidth + ', ' + (height - 2) + ')';
        this.$foreignObject.setAttributeNS(null, 'transform', matrix);
        this.$label.innerHTML = this.label(datum);
      }
    }
  }, {
    key: 'inArea',
    value: function inArea(renderingContext, datum, x1, y1, x2, y2) {
      // handlers only are selectable
      var x = renderingContext.timeToPixel(this.x(datum));
      var shapeX1 = x - (this.params.handlerWidth - 1) / 2;
      var shapeX2 = shapeX1 + this.params.handlerWidth;
      var shapeY1 = renderingContext.height - this.params.handlerHeight;
      var shapeY2 = renderingContext.height;

      var xOverlap = Math.max(0, Math.min(x2, shapeX2) - Math.max(x1, shapeX1));
      var yOverlap = Math.max(0, Math.min(y2, shapeY2) - Math.max(y1, shapeY1));
      var area = xOverlap * yOverlap;

      return area > 0;
    }
  }]);
  return Marker;
}(_baseShape2.default);

exports.default = Marker;

},{"./base-shape":35,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A shape to display a segment.
 *
 * [example usage](./examples/layer-segment.html)
 */
var Segment = function (_BaseShape) {
  (0, _inherits3.default)(Segment, _BaseShape);

  function Segment() {
    (0, _classCallCheck3.default)(this, Segment);
    return (0, _possibleConstructorReturn3.default)(this, (Segment.__proto__ || (0, _getPrototypeOf2.default)(Segment)).apply(this, arguments));
  }

  (0, _createClass3.default)(Segment, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'segment';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { x: 0, y: 0, width: 0, height: 1, color: '#000000', opacity: 1, label: '' };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        displayHandlers: true,
        handlerWidth: 2,
        handlerOpacity: 0.8,
        opacity: 0.6,
        displayLabels: false
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }

      this.$el = document.createElementNS(this.ns, 'g');

      this.$segment = document.createElementNS(this.ns, 'rect');
      this.$segment.classList.add('segment');
      this.$segment.style.opacity = this.params.opacity;
      this.$segment.setAttributeNS(null, 'shape-rendering', 'crispEdges');

      this.$el.appendChild(this.$segment);

      if (this.params.displayHandlers) {
        this.$leftHandler = document.createElementNS(this.ns, 'rect');
        this.$leftHandler.classList.add('left', 'handler');
        this.$leftHandler.setAttributeNS(null, 'width', this.params.handlerWidth);
        this.$leftHandler.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        this.$leftHandler.style.opacity = this.params.handlerOpacity;
        this.$leftHandler.style.cursor = 'ew-resize';

        this.$rightHandler = document.createElementNS(this.ns, 'rect');
        this.$rightHandler.classList.add('right', 'handler');
        this.$rightHandler.setAttributeNS(null, 'width', this.params.handlerWidth);
        this.$rightHandler.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        this.$rightHandler.style.opacity = this.params.handlerOpacity;
        this.$rightHandler.style.cursor = 'ew-resize';

        this.$el.appendChild(this.$leftHandler);
        this.$el.appendChild(this.$rightHandler);
      }

      if (this.params.displayLabels) {
        // prefer html `div` over svg `text` tag because we then use the `contenteditable` property
        this.$foreignObject = document.createElementNS(this.ns, 'foreignObject');

        this.$label = document.createElement('div');
        this.$label.style.display = 'block';
        this.$label.style.width = '50px';
        this.$label.style.fontSize = '12px';
        this.$label.style.fontFamily = 'arial';
        this.$label.style.userSelect = 'none';

        this.$foreignObject.appendChild(this.$label);
        this.$el.appendChild(this.$foreignObject);
      }

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      var x = renderingContext.timeToPixel(this.x(datum));
      var y = renderingContext.valueToPixel(this.y(datum));

      var width = renderingContext.timeToPixel(this.width(datum));
      var height = renderingContext.valueToPixel(this.height(datum));
      var color = this.color(datum);
      var opacity = this.opacity(datum);

      this.$el.setAttributeNS(null, 'transform', 'translate(' + x + ', ' + y + ')');
      this.$el.style.opacity = opacity;

      this.$segment.setAttributeNS(null, 'width', Math.max(width, 0));
      this.$segment.setAttributeNS(null, 'height', height);
      this.$segment.style.fill = color;

      if (this.params.displayHandlers) {
        // display handlers
        this.$leftHandler.setAttributeNS(null, 'height', height);
        this.$leftHandler.setAttributeNS(null, 'transform', 'translate(0, 0)');
        this.$leftHandler.style.fill = color;

        var rightHandlerTranslate = 'translate(' + (width - this.params.handlerWidth) + ', 0)';
        this.$rightHandler.setAttributeNS(null, 'height', height);
        this.$rightHandler.setAttributeNS(null, 'transform', rightHandlerTranslate);
        this.$rightHandler.style.fill = color;
      }

      if (this.params.displayLabels) {
        var matrix = 'matrix(1, 0, 0, -1, 4, ' + (height - 2) + ')';
        this.$foreignObject.setAttributeNS(null, 'transform', matrix);
        this.$label.innerHTML = this.label(datum);
      }
    }
  }, {
    key: 'inArea',
    value: function inArea(renderingContext, datum, x1, y1, x2, y2) {
      var shapeX1 = renderingContext.timeToPixel(this.x(datum));
      var shapeX2 = renderingContext.timeToPixel(this.x(datum) + this.width(datum));
      var shapeY1 = renderingContext.valueToPixel(this.y(datum));
      var shapeY2 = renderingContext.valueToPixel(this.y(datum) + this.height(datum));

      // http://jsfiddle.net/uthyZ/ - check overlaping area
      var xOverlap = Math.max(0, Math.min(x2, shapeX2) - Math.max(x1, shapeX1));
      var yOverlap = Math.max(0, Math.min(y2, shapeY2) - Math.max(y1, shapeY1));
      var area = xOverlap * yOverlap;

      return area > 0;
    }
  }]);
  return Segment;
}(_baseShape2.default);

exports.default = Segment;

},{"./base-shape":35,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Kind of Marker for entity oriented data. Usefull to display a grid.
 */
var Ticks = function (_BaseShape) {
  (0, _inherits3.default)(Ticks, _BaseShape);

  function Ticks() {
    (0, _classCallCheck3.default)(this, Ticks);
    return (0, _possibleConstructorReturn3.default)(this, (Ticks.__proto__ || (0, _getPrototypeOf2.default)(Ticks)).apply(this, arguments));
  }

  (0, _createClass3.default)(Ticks, [{
    key: '_getClassName',
    value: function _getClassName() {
      return 'tick';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { time: 0, focused: true, label: '' };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        color: 'steelblue',
        focusedOpacity: 0.8,
        defaultOpacity: 0.3
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      this.$el = document.createElementNS(this.ns, 'g');
      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, data) {
      var _this2 = this;

      while (this.$el.firstChild) {
        this.$el.removeChild(this.$el.firstChild);
      }

      var fragment = document.createDocumentFragment();
      var layerHeight = renderingContext.height; // valueToPixel(1);

      data.forEach(function (datum) {
        var x = renderingContext.timeToPixel(_this2.time(datum));
        var opacity = _this2.focused(datum) ? _this2.params.focusedOpacity : _this2.params.defaultOpacity;

        var height = layerHeight;

        var tick = document.createElementNS(_this2.ns, 'line');
        tick.classList.add('tick');

        tick.setAttributeNS(null, 'x1', 0);
        tick.setAttributeNS(null, 'x2', 0);
        tick.setAttributeNS(null, 'y1', 0);
        tick.setAttributeNS(null, 'y2', height);

        tick.setAttributeNS(null, 'fill', 'none');
        tick.setAttributeNS(null, 'stroke', _this2.params.color);
        tick.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        tick.setAttributeNS(null, 'transform', 'translate(' + x + ', 0)');
        tick.setAttributeNS(null, 'opacity', opacity);

        _this2.$el.appendChild(tick);

        var label = _this2.label(datum);

        if (label) {
          var $label = document.createElementNS(_this2.ns, 'text');
          $label.classList.add('label');
          var $text = document.createTextNode(label);
          $label.appendChild($text);
          $label.setAttributeNS(null, 'transform', 'matrix(1, 0, 0, -1, ' + (x + 2) + ', ' + (height + 2) + ')');
          // firefox problem here
          // $label.setAttributeNS(null, 'alignment-baseline', 'text-before-edge');
          $label.setAttributeNS(null, 'y', '10');

          $label.style.fontSize = '10px';
          $label.style.lineHeight = '10px';
          $label.style.fontFamily = 'monospace';
          $label.style.color = '#676767';
          $label.style.opacity = 0.9;
          $label.style.mozUserSelect = 'none';
          $label.style.webkitUserSelect = 'none';
          $label.style.userSelect = 'none';

          // const bg = document.createElementNS(this.ns, 'rect');
          // bg.setAttributeNS(null, 'width', '100%');
          // bg.setAttributeNS(null, 'height', '100%');
          // bg.setAttributeNS(null, 'fill', '#ffffff');
          // label.appendChild(bg);

          _this2.$el.appendChild($label);
        }
      });

      this.$el.appendChild(fragment);
    }
  }]);
  return Ticks;
}(_baseShape2.default);

exports.default = Ticks;

},{"./base-shape":35,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A shape to display dots in a trace visualization (mean / range).
 *
 * [example usage](./examples/layer-trace.html)
 */
var TraceDots = function (_BaseShape) {
  (0, _inherits3.default)(TraceDots, _BaseShape);

  function TraceDots() {
    (0, _classCallCheck3.default)(this, TraceDots);
    return (0, _possibleConstructorReturn3.default)(this, (TraceDots.__proto__ || (0, _getPrototypeOf2.default)(TraceDots)).apply(this, arguments));
  }

  (0, _createClass3.default)(TraceDots, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'trace-dots';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { x: 0, mean: 0, range: 0 };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        meanRadius: 3,
        rangeRadius: 3,
        meanColor: '#232323',
        rangeColor: 'steelblue'
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }
      // container
      this.$el = document.createElementNS(this.ns, 'g');
      // draw mean dot
      this.$mean = document.createElementNS(this.ns, 'circle');
      this.$mean.setAttributeNS(null, 'r', this.params.meanRadius);
      this.$mean.setAttributeNS(null, 'stroke', this.params.meanColor);
      this.$mean.setAttributeNS(null, 'fill', 'transparent');
      this.$mean.classList.add('mean');
      // range dots (0 => top, 1 => bottom)
      this.$max = document.createElementNS(this.ns, 'circle');
      this.$max.setAttributeNS(null, 'r', this.params.meanRadius);
      this.$max.setAttributeNS(null, 'stroke', this.params.rangeColor);
      this.$max.setAttributeNS(null, 'fill', 'transparent');
      this.$max.classList.add('max');

      this.$min = document.createElementNS(this.ns, 'circle');
      this.$min.setAttributeNS(null, 'r', this.params.meanRadius);
      this.$min.setAttributeNS(null, 'stroke', this.params.rangeColor);
      this.$min.setAttributeNS(null, 'fill', 'transparent');
      this.$min.classList.add('min');

      this.$el.appendChild(this.$mean);
      this.$el.appendChild(this.$max);
      this.$el.appendChild(this.$min);

      return this.$el;
    }

    // @TODO use accessors

  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      var mean = this.mean(datum);
      var range = this.range(datum);
      var x = this.x(datum);
      // y positions
      var meanPos = '' + renderingContext.valueToPixel(mean);
      this.$mean.setAttributeNS(null, 'transform', 'translate(0, ' + meanPos + ')');

      var halfRange = range / 2;
      var max = renderingContext.valueToPixel(mean + halfRange);
      var min = renderingContext.valueToPixel(mean - halfRange);
      var xPos = renderingContext.timeToPixel(x);

      this.$max.setAttributeNS(null, 'transform', 'translate(0, ' + max + ')');
      this.$min.setAttributeNS(null, 'transform', 'translate(0, ' + min + ')');
      this.$el.setAttributeNS(null, 'transform', 'translate(' + xPos + ', 0)');
    }
  }, {
    key: 'inArea',
    value: function inArea(renderingContext, datum, x1, y1, x2, y2) {
      var x = renderingContext.timeToPixel(this.x(datum));
      var mean = renderingContext.valueToPixel(this.mean(datum));
      var range = renderingContext.valueToPixel(this.range(datum));
      var min = mean - range / 2;
      var max = mean + range / 2;

      if (x > x1 && x < x2 && (min > y1 || max < y2)) {
        return true;
      }

      return false;
    }
  }]);
  return TraceDots;
}(_baseShape2.default);

exports.default = TraceDots;

},{"./base-shape":35,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A shape to display paths in a trace visualization (mean / range). (entity shape)
 *
 * [example usage](./examples/layer-trace.html)
 */
var TracePath = function (_BaseShape) {
  (0, _inherits3.default)(TracePath, _BaseShape);

  function TracePath() {
    (0, _classCallCheck3.default)(this, TracePath);
    return (0, _possibleConstructorReturn3.default)(this, (TracePath.__proto__ || (0, _getPrototypeOf2.default)(TracePath)).apply(this, arguments));
  }

  (0, _createClass3.default)(TracePath, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'trace-common';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { x: 0, mean: 0, range: 0 };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        rangeColor: 'steelblue',
        meanColor: '#232323',
        displayMean: true
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }
      this.$el = document.createElementNS(this.ns, 'g');
      // range path
      this.$range = document.createElementNS(this.ns, 'path');
      this.$el.appendChild(this.$range);

      // mean line
      if (this.params.displayMean) {
        this.$mean = document.createElementNS(this.ns, 'path');
        this.$el.appendChild(this.$mean);
      }

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, data) {
      var _this2 = this;

      // order data by x position
      data = data.slice(0);
      data.sort(function (a, b) {
        return _this2.x(a) < _this2.x(b) ? -1 : 1;
      });

      if (this.params.displayMean) {
        this.$mean.setAttributeNS(null, 'd', this._buildMeanLine(renderingContext, data));
        this.$mean.setAttributeNS(null, 'stroke', this.params.meanColor);
        this.$mean.setAttributeNS(null, 'fill', 'none');
      }

      this.$range.setAttributeNS(null, 'd', this._buildRangeZone(renderingContext, data));
      this.$range.setAttributeNS(null, 'stroke', 'none');
      this.$range.setAttributeNS(null, 'fill', this.params.rangeColor);
      this.$range.setAttributeNS(null, 'opacity', '0.4');

      data = null;
    }
  }, {
    key: '_buildMeanLine',
    value: function _buildMeanLine(renderingContext, data) {
      var _this3 = this;

      var instructions = data.map(function (datum, index) {
        var x = renderingContext.timeToPixel(_this3.x(datum));
        var y = renderingContext.valueToPixel(_this3.mean(datum));
        return x + ',' + y;
      });

      return 'M' + instructions.join('L');
    }
  }, {
    key: '_buildRangeZone',
    value: function _buildRangeZone(renderingContext, data) {
      var length = data.length;
      // const lastIndex = data
      var instructionsStart = '';
      var instructionsEnd = '';

      for (var i = 0; i < length; i++) {
        var datum = data[i];
        var mean = this.mean(datum);
        var halfRange = this.range(datum) / 2;

        var x = renderingContext.timeToPixel(this.x(datum));
        var y0 = renderingContext.valueToPixel(mean + halfRange);
        var y1 = renderingContext.valueToPixel(mean - halfRange);

        var start = x + ',' + y0;
        var end = x + ',' + y1;

        instructionsStart = instructionsStart === '' ? start : instructionsStart + 'L' + start;

        instructionsEnd = instructionsEnd === '' ? end : end + 'L' + instructionsEnd;
      }

      var instructions = 'M' + instructionsStart + 'L' + instructionsEnd + 'Z';
      return instructions;
    }
  }]);
  return TracePath;
}(_baseShape2.default);

exports.default = TracePath;

},{"./base-shape":35,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var xhtmlNS = 'http://www.w3.org/1999/xhtml';

/**
 * A shape to display a waveform. (for entity data)
 *
 * [example usage](./examples/layer-waveform.html)
 *
 * @todo - fix problems with canvas strategy.
 */

var Waveform = function (_BaseShape) {
  (0, _inherits3.default)(Waveform, _BaseShape);

  function Waveform() {
    (0, _classCallCheck3.default)(this, Waveform);
    return (0, _possibleConstructorReturn3.default)(this, (Waveform.__proto__ || (0, _getPrototypeOf2.default)(Waveform)).apply(this, arguments));
  }

  (0, _createClass3.default)(Waveform, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'waveform';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      // return { y: 0 };
      return {};
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        sampleRate: 44100,
        color: '#000000',
        opacity: 1
        // renderingStrategy: 'svg' // canvas is bugged (translation, etc...)
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) return this.$el;

      // if (this.params.renderingStrategy === 'svg') {

      this.$el = document.createElementNS(this.ns, 'path');
      this.$el.setAttributeNS(null, 'fill', 'none');
      this.$el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
      this.$el.setAttributeNS(null, 'stroke', this.params.color);
      this.$el.style.opacity = this.params.opacity;

      // } else if (this.params.renderingStrategy === 'canvas') {

      //   this.$el = document.createElementNS(this.ns, 'foreignObject');
      //   this.$el.setAttributeNS(null, 'width', renderingContext.width);
      //   this.$el.setAttributeNS(null, 'height', renderingContext.height);

      //   const canvas = document.createElementNS(xhtmlNS, 'xhtml:canvas');

      //   this._ctx = canvas.getContext('2d');
      //   this._ctx.canvas.width = renderingContext.width;
      //   this._ctx.canvas.height = renderingContext.height;

      //   this.$el.appendChild(canvas);
      // }

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      // define nbr of samples per pixels
      var sliceMethod = datum instanceof Float32Array ? 'subarray' : 'slice';
      var nbrSamples = datum.length;
      var duration = nbrSamples / this.params.sampleRate;
      var width = renderingContext.timeToPixel(duration);
      var samplesPerPixel = nbrSamples / width;

      if (!samplesPerPixel || datum.length < samplesPerPixel) {
        return;
      }

      // compute/draw visible area only
      // @TODO refactor this ununderstandable mess
      var minX = Math.max(-renderingContext.offsetX, 0);
      var trackDecay = renderingContext.trackOffsetX + renderingContext.startX;
      if (trackDecay < 0) {
        minX = -trackDecay;
      }

      var maxX = minX;
      maxX += renderingContext.width - minX < renderingContext.visibleWidth ? renderingContext.width : renderingContext.visibleWidth;

      // get min/max per pixels, clamped to the visible area
      var invert = renderingContext.timeToPixel.invert;
      var sampleRate = this.params.sampleRate;
      var minMax = [];

      for (var px = minX; px < maxX; px++) {
        var startTime = invert(px);
        var startSample = startTime * sampleRate;
        var extract = datum[sliceMethod](startSample, startSample + samplesPerPixel);

        var min = Infinity;
        var max = -Infinity;

        for (var j = 0, l = extract.length; j < l; j++) {
          var sample = extract[j];
          if (sample < min) min = sample;
          if (sample > max) max = sample;
        }
        // disallow Infinity
        min = !isFinite(min) ? 0 : min;
        max = !isFinite(max) ? 0 : max;

        minMax.push([px, min, max]);
      }

      if (minMax.length) {

        var PIXEL = 0;
        var MIN = 1;
        var MAX = 2;

        // rendering strategies
        // if (this.params.renderingStrategy === 'svg') {

        var d = 'M';

        for (var i = 0, _l = minMax.length; i < _l; i++) {
          var _datum = minMax[i];
          var x = _datum[PIXEL];
          var y1 = Math.round(renderingContext.valueToPixel(_datum[MIN]));
          var y2 = Math.round(renderingContext.valueToPixel(_datum[MAX]));

          d += x + ',' + y1 + 'L' + x + ',' + y2;

          if (i < _l - 1) d += 'L';
        }

        this.$el.setAttributeNS(null, 'd', d);

        // } else if (this.params.renderingStrategy === 'canvas') {

        //   this._ctx.canvas.width = width;
        //   this.$el.setAttribute('width', width);
        //   // fix chrome bug with translate
        //   if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        //     this.$el.setAttribute('x', renderingContext.offsetX);
        //   }

        //   this._ctx.strokeStyle = this.params.color;
        //   this._ctx.globalAlpha = this.params.opacity;
        //   this._ctx.moveTo(renderingContext.timeToPixel(0), renderingContext.valueToPixel(0));

        //   minMax.forEach((datum) => {
        //     const x  = datum[PIXEL];
        //     let y1 = Math.round(renderingContext.valueToPixel(datum[MIN]));
        //     let y2 = Math.round(renderingContext.valueToPixel(datum[MAX]));

        //     this._ctx.moveTo(x, y1);
        //     this._ctx.lineTo(x, y2);
        //   });

        //   this._ctx.stroke();
        // }
      }
    }
  }]);
  return Waveform;
}(_baseShape2.default);

exports.default = Waveform;

},{"./base-shape":35,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],45:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * `State` instances are used to define the application logic by precising
 * specific user interaction cases, and how they impact the overal temporal
 * representation. The abstractions extending this base class should be
 * considered as the main interface between the visualization and the
 * application logic. All provided states should be seen as simple examples for
 * rapid prototyping,
 *
 * States manage interactions like zooming, browsing, or editing the timeline.
 * Customized states should extend this BaseState.
 */
var BaseState = function () {
  /**
   * Returns timeline tracks collection.
   *
   * @type {TrackCollection}
   */
  function BaseState(timeline) {
    (0, _classCallCheck3.default)(this, BaseState);

    /**
     * A reference to the timeline on which the state should be installed.
     * @type {Timeline}
     */
    this.timeline = timeline;
  }

  /**
   * Returns timeline tracks collection.
   *
   * @type {TrackCollection<Track>}
   */


  (0, _createClass3.default)(BaseState, [{
    key: "enter",


    /**
     * Called when the timeline is entering the state.
     */
    value: function enter() {}

    /**
     * Called when the timeline is leaving the state.
     */

  }, {
    key: "exit",
    value: function exit() {}

    /**
     * Main interface method to override when creating a new `State`. Handle event
     * from mouse or keyboard, should define behavior according to the event
     * (aka. mousedown, mouseup, ...).
     *
     * @param {WaveEvent} e - the event to process.
     * @param {Array} hitLayers - the layers hit by the mouse event (if surface
     * event).
     */

  }, {
    key: "handleEvent",
    value: function handleEvent(e, hitLayers) {}
  }, {
    key: "tracks",
    get: function get() {
      return this.timeline.tracks;
    }

    /**
     * Returns all registered layers.
     *
     * @type {Array<Layer>}
     */

  }, {
    key: "layers",
    get: function get() {
      return this.timeline.tracks.layers;
    }
  }]);
  return BaseState;
}();

exports.default = BaseState;

},{"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71}],46:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A state to interact with a breakpoint function, mimicing Max/MSP's
 * breakpoint function interactions.
 *
 * [example usage](./examples/layer-breakpint.html)
 */
var BreakpointState = function (_BaseState) {
  (0, _inherits3.default)(BreakpointState, _BaseState);

  function BreakpointState(timeline, datumGenerator) {
    (0, _classCallCheck3.default)(this, BreakpointState);

    var _this = (0, _possibleConstructorReturn3.default)(this, (BreakpointState.__proto__ || (0, _getPrototypeOf2.default)(BreakpointState)).call(this, timeline));

    _this.datumGenerator = datumGenerator;
    _this.currentEditedLayer = null;
    _this.currentTarget = null;
    return _this;
  }

  (0, _createClass3.default)(BreakpointState, [{
    key: 'enter',
    value: function enter() {}
  }, {
    key: 'exit',
    value: function exit() {}
  }, {
    key: 'handleEvent',
    value: function handleEvent(e, hitLayers) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e, hitLayers);
          break;
        case 'mousemove':
          this.onMouseMove(e, hitLayers);
          break;
        case 'mouseup':
          this.onMouseUp(e, hitLayers);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e, hitLayers) {
      var _this2 = this;

      this.mouseDown = true;
      // keep target consistent with mouse down
      this.currentTarget = e.target;
      var updatedLayer = null;

      var layers = hitLayers;

      layers.forEach(function (layer) {
        layer.unselect();
        var item = layer.getItemFromDOMElement(e.target);

        if (item === null) {
          // create an item
          var time = layer.timeToPixel.invert(e.x) - _this2.timeline.offset;
          var value = layer.valueToPixel.invert(layer.params.height - e.y);
          var datum = _this2.datumGenerator(time, value);

          layer.data.push(datum);
          updatedLayer = layer;
        } else {
          // if shift is pressed, remove the item
          if (e.originalEvent.shiftKey) {
            var data = layer.data;
            var _datum = layer.getDatumFromItem(item);
            data.splice(data.indexOf(_datum), 1);

            updatedLayer = layer;
          } else {
            _this2.currentEditedLayer = layer;
            layer.select(item);
          }
        }
      });

      if (updatedLayer) {
        this.timeline.tracks.render(updatedLayer);
        this.timeline.tracks.update(updatedLayer);
      }
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      var _this3 = this;

      if (!this.mouseDown || !this.currentEditedLayer) {
        return;
      }

      var layer = this.currentEditedLayer;
      var items = layer.selectedItems;
      // the loop should be in layer to match select / unselect API
      items.forEach(function (item) {
        layer.edit(item, e.dx, e.dy, _this3.currentTarget);
      });

      layer.update(items);
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      this.currentEditedLayer = null;
      this.mouseDown = false;
    }
  }]);
  return BreakpointState;
}(_baseState2.default);

exports.default = BreakpointState;

},{"./base-state":45,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],47:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _namespace = require('../core/namespace');

var _namespace2 = _interopRequireDefault(_namespace);

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Protools like zoom with zone selection. Press space bar to reset zoom.
 *
 * [example usage](./examples/states-zoom.html)
 *
 * @todo - could also handle `g` and `h` keys to zoom-in, zoom-out.
 */
var BrushZoomState = function (_BaseState) {
  (0, _inherits3.default)(BrushZoomState, _BaseState);

  function BrushZoomState(timeline) {
    (0, _classCallCheck3.default)(this, BrushZoomState);
    return (0, _possibleConstructorReturn3.default)(this, (BrushZoomState.__proto__ || (0, _getPrototypeOf2.default)(BrushZoomState)).call(this, timeline));
  }

  (0, _createClass3.default)(BrushZoomState, [{
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e);
          break;
        case 'mousemove':
          this.onMouseMove(e);
          break;
        case 'mouseup':
          this.onMouseUp(e);
          break;
        case 'keydown':
          this.onKeyDown(e);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      var _this2 = this;

      this.brushes = [];
      this.startX = e.x;
      // create brush in each containers
      this.tracks.forEach(function (track) {
        var interactions = track.$interactions;

        var brush = document.createElementNS(_namespace2.default, 'rect');
        brush.setAttributeNS(null, 'height', track.height);
        brush.setAttributeNS(null, 'y', 0);
        brush.style.fill = '#787878';
        brush.style.opacity = 0.2;

        interactions.appendChild(brush);

        _this2.brushes.push(brush);
      });
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      // update brush
      var width = Math.abs(e.x - this.startX);
      var x = Math.min(e.x, this.startX);

      this.brushes.forEach(function (brush) {
        brush.setAttributeNS(null, 'width', width);
        brush.setAttributeNS(null, 'x', x);
      });
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      // remove brush
      this.brushes.forEach(function (brush) {
        brush.parentNode.removeChild(brush);
      });

      // update timeContext
      var startX = this.startX;
      var endX = e.x;
      // return if no drag
      if (Math.abs(startX - endX) < 1) {
        return;
      }

      var leftX = Math.max(0, Math.min(startX, endX));
      var rightX = Math.max(startX, endX);

      var minTime = this.timeline.timeToPixel.invert(leftX);
      var maxTime = this.timeline.timeToPixel.invert(rightX);

      var deltaDuration = maxTime - minTime;
      var zoom = this.timeline.visibleDuration / deltaDuration;

      this.timeline.offset -= minTime;
      this.timeline.zoom *= zoom;

      this.tracks.update();
    }
  }, {
    key: 'onKeyDown',
    value: function onKeyDown(e) {
      // reset on space bar
      if (e.originalEvent.keyCode === 32) {
        this.timeline.offset = 0;
        this.timeline.zoom = 1;
        this.tracks.update();
      }
    }
  }]);
  return BrushZoomState;
}(_baseState2.default);

exports.default = BrushZoomState;

},{"../core/namespace":12,"./base-state":45,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],48:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _scales = require('../utils/scales');

var _scales2 = _interopRequireDefault(_scales);

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * `CenteredZoomState` is a timeline state mimicing the `Live` zoom interaction. It allows the user to browse the timeline by clicking on a track, and then
 * - moving down to zoom in
 * - moving up to zoom out
 * - moving left to move in time, after
 * - moving right to move in time, before
 *
 * [example usage](./examples/states-zoom.html)
 */
var CenteredZoomState = function (_BaseState) {
  (0, _inherits3.default)(CenteredZoomState, _BaseState);

  function CenteredZoomState(timeline) {
    (0, _classCallCheck3.default)(this, CenteredZoomState);

    var _this = (0, _possibleConstructorReturn3.default)(this, (CenteredZoomState.__proto__ || (0, _getPrototypeOf2.default)(CenteredZoomState)).call(this, timeline));

    _this.currentLayer = null;
    // Set max/min zoom
    // maxZoom: 1px per sample
    // minZoom: 10 000 px per 1 hour
    // with a default to 44.1kHz sample rate
    _this.maxZoom = 44100 * 1 / _this.timeline.timeContext.pixelsPerSecond;
    _this.minZoom = 10000 / 3600 / _this.timeline.timeContext.pixelsPerSecond;
    return _this;
  }

  (0, _createClass3.default)(CenteredZoomState, [{
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e);
          break;
        case 'mousemove':
          this.onMouseMove(e);
          break;
        case 'mouseup':
          this.onMouseUp(e);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      this.initialZoom = this.timeline.timeContext.zoom;
      this.initialY = e.y;

      this._pixelToExponent = _scales2.default.linear().domain([0, 100]) // 100px => factor 2
      .range([0, 1]);
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      // prevent annoying text selection when dragging
      e.originalEvent.preventDefault();

      var timeContext = this.timeline.timeContext;
      var lastCenterTime = timeContext.timeToPixel.invert(e.x);
      var exponent = this._pixelToExponent(e.y - this.initialY);
      var targetZoom = this.initialZoom * Math.pow(2, exponent); // -1...1 -> 1/2...2

      timeContext.zoom = Math.min(Math.max(targetZoom, this.minZoom), this.maxZoom);

      var newCenterTime = timeContext.timeToPixel.invert(e.x);
      var delta = newCenterTime - lastCenterTime;

      // Apply new offset to keep it centered to the mouse
      timeContext.offset += delta + timeContext.timeToPixel.invert(e.dx);

      // Other possible experiments with centered-zoom-state
      //
      // Example 1: Prevent timeline.offset to be negative
      // timeContext.offset = Math.min(timeContext.offset, 0);
      //
      // Example 2: Keep in container when zoomed out
      // if (timeContext.stretchRatio < 1) {
      //   const minOffset = timeContext.timeToPixel.invert(0);
      //   const maxOffset = timeContext.timeToPixel.invert(view.width - timeContext.timeToPixel(timeContext.duration));
      //   timeContext.offset = Math.max(timeContext.offset, minOffset);
      //   timeContext.offset = Math.min(timeContext.offset, maxOffset);
      // }

      this.timeline.tracks.update();
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {}
  }]);
  return CenteredZoomState;
}(_baseState2.default);

exports.default = CenteredZoomState;

},{"../utils/scales":55,"./base-state":45,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],49:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

var _timeContextBehavior = require('../behaviors/time-context-behavior');

var _timeContextBehavior2 = _interopRequireDefault(_timeContextBehavior);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A state to interact directly with layers time contexts.
 *
 * [example usage, see. advanced usage](./examples/layer-waveform.html)
 */
var ContextEditionState = function (_BaseState) {
  (0, _inherits3.default)(ContextEditionState, _BaseState);

  function ContextEditionState(timeline) {
    (0, _classCallCheck3.default)(this, ContextEditionState);
    return (0, _possibleConstructorReturn3.default)(this, (ContextEditionState.__proto__ || (0, _getPrototypeOf2.default)(ContextEditionState)).call(this, timeline));
  }

  (0, _createClass3.default)(ContextEditionState, [{
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e);
          break;
        case 'mousemove':
          this.onMouseMove(e);
          break;
        case 'mouseup':
          this.onMouseUp(e);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      this.mouseDown = true;
      this.currentTarget = e.target;

      for (var i = 0, l = this.layers.length; i < l; i++) {
        var layer = this.layers[i];
        if (layer.hasElement(e.target)) {
          this.currentLayer = layer;
          break;
        }
      }
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      if (!this.mouseDown || !this.currentLayer) {
        return;
      }

      var layer = this.currentLayer;
      var target = this.currentTarget;

      // in this example the context is stretched when shift is pressed
      if (!e.originalEvent.shiftKey) {
        layer.editContext(e.dx, e.dy, target);
      } else {
        layer.stretchContext(e.dx, e.dy, target);
      }

      this.timeline.tracks.update(layer);
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      this.mouseDown = false;
      this.currentTarget = null;
      this.currentLayer = null;
    }
  }]);
  return ContextEditionState;
}(_baseState2.default);

exports.default = ContextEditionState;

},{"../behaviors/time-context-behavior":8,"./base-state":45,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A state to edit shapes in the more general way. Interact only with selected shapes.
 */
var EditionState = function (_BaseState) {
  (0, _inherits3.default)(EditionState, _BaseState);

  function EditionState(timeline) {
    (0, _classCallCheck3.default)(this, EditionState);

    var _this = (0, _possibleConstructorReturn3.default)(this, (EditionState.__proto__ || (0, _getPrototypeOf2.default)(EditionState)).call(this, timeline));

    _this.currentEditedLayer = null;
    _this.currentTarget = null;
    return _this;
  }

  (0, _createClass3.default)(EditionState, [{
    key: 'enter',
    value: function enter() {}
  }, {
    key: 'exit',
    value: function exit() {}
  }, {
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e);
          break;
        case 'mousemove':
          this.onMouseMove(e);
          break;
        case 'mouseup':
          this.onMouseUp(e);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      this.currentTarget = e.target;
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      var _this2 = this;

      this.layers.forEach(function (layer) {
        var items = layer.selectedItems;

        layer.edit(items, e.dx, e.dy, _this2.currentTarget);
        layer.update(items);
      });
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      this.currentEditedLayer = null;
      this.mouseDown = false;
    }
  }]);
  return EditionState;
}(_baseState2.default);

exports.default = EditionState;

},{"./base-state":45,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],51:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

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

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

var _namespace = require('../core/namespace');

var _namespace2 = _interopRequireDefault(_namespace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A state to select shapes.
 */
var SelectionState = function (_BaseState) {
  (0, _inherits3.default)(SelectionState, _BaseState);

  function SelectionState(timeline /*, options = {} */) {
    (0, _classCallCheck3.default)(this, SelectionState);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SelectionState.__proto__ || (0, _getPrototypeOf2.default)(SelectionState)).call(this, timeline /*, options */));

    _this.currentLayer = null;
    // need a cached
    _this.selectedItems = null;
    _this.mouseDown = false;
    _this.shiftKey = false;

    _this._layerSelectedItemsMap = new _map2.default();
    return _this;
  }

  (0, _createClass3.default)(SelectionState, [{
    key: 'enter',
    value: function enter() {}
  }, {
    key: 'exit',
    value: function exit() {
      var containers = this.timeline.containers;

      for (var id in containers) {
        this._removeBrush(containers[id]);
      }
    }
  }, {
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e);
          break;
        case 'mousemove':
          this.onMouseMove(e);
          break;
        case 'mouseup':
          this.onMouseUp(e);
          break;
        case 'click':
          this.onClick(e);
          break;
        case 'keydown':
          this.onKey(e);
          break;
        case 'keyup':
          this.onKey(e);
          break;
      }
    }
  }, {
    key: '_addBrush',
    value: function _addBrush(track) {
      if (track.$brush) {
        return;
      }

      var brush = document.createElementNS(_namespace2.default, 'rect');
      brush.style.fill = '#686868';
      brush.style.opacity = 0.2;

      track.$interactions.appendChild(brush);
      track.$brush = brush;
    }
  }, {
    key: '_removeBrush',
    value: function _removeBrush(track) {
      if (track.$brush === null) {
        return;
      }

      this._resetBrush(track);
      track.$interactions.removeChild(track.$brush);
      delete track.$brush;
    }
  }, {
    key: '_resetBrush',
    value: function _resetBrush(track) {
      var $brush = track.$brush;
      // reset brush element
      $brush.setAttributeNS(null, 'transform', 'translate(0, 0)');
      $brush.setAttributeNS(null, 'width', 0);
      $brush.setAttributeNS(null, 'height', 0);
    }
  }, {
    key: '_updateBrush',
    value: function _updateBrush(e, track) {
      var $brush = track.$brush;
      var translate = 'translate(' + e.area.left + ', ' + e.area.top + ')';

      $brush.setAttributeNS(null, 'transform', translate);
      $brush.setAttributeNS(null, 'width', e.area.width);
      $brush.setAttributeNS(null, 'height', e.area.height);
    }
  }, {
    key: 'onKey',
    value: function onKey(e) {
      this.shiftKey = e.shiftKey;
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      var _this2 = this;

      this._currentTrack = this.timeline.getTrackFromDOMElement(e.target);
      if (!this._currentTrack) {
        return;
      }

      this._addBrush(this._currentTrack);

      // recreate the map
      this._layerSelectedItemsMap = new _map2.default();
      this._currentTrack.layers.forEach(function (layer) {
        _this2._layerSelectedItemsMap.set(layer, layer.selectedItems.slice(0));
      });
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      var _this3 = this;

      this._updateBrush(e, this._currentTrack);

      this._currentTrack.layers.forEach(function (layer) {
        var currentSelection = layer.selectedItems;
        var currentItems = layer.getItemsInArea(e.area);

        // if is not pressed
        if (!e.originalEvent.shiftKey) {
          layer.unselect(currentSelection);
          layer.select(currentItems);
        } else {
          var toSelect = [];
          var toUnselect = [];
          // use the selection from the previous drag
          var previousSelection = _this3._layerSelectedItemsMap.get(layer);
          // toUnselect = toUnselect.concat(previousSelectedItems);

          currentItems.forEach(function (item) {
            if (previousSelection.indexOf(item) === -1) {
              toSelect.push(item);
            } else {
              toUnselect.push(item);
            }
          });

          currentSelection.forEach(function (item) {
            if (currentItems.indexOf(item) === -1 && previousSelection.indexOf(item) === -1) {
              toUnselect.push(item);
            }
          });

          layer.unselect(toUnselect);
          layer.select(toSelect);
        }
      });
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      this._removeBrush(this._currentTrack);
    }
  }, {
    key: 'onClick',
    value: function onClick(e) {
      if (!this._currentTrack) {
        return;
      }

      this._currentTrack.layers.forEach(function (layer) {
        var item = layer.getItemFromDOMElement(e.target);

        if (!e.originalEvent.shiftKey) {
          layer.unselect();
        }

        if (item) {
          layer.toggleSelection(item);
        }
      });
    }
  }]);
  return SelectionState;
}(_baseState2.default);

exports.default = SelectionState;

},{"../core/namespace":12,"./base-state":45,"babel-runtime/core-js/map":59,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],52:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A state to select and edit shapes in a simple way. (kind of plug n play state)
 */
var SimpleEditionState = function (_BaseState) {
  (0, _inherits3.default)(SimpleEditionState, _BaseState);

  function SimpleEditionState(timeline) {
    (0, _classCallCheck3.default)(this, SimpleEditionState);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SimpleEditionState.__proto__ || (0, _getPrototypeOf2.default)(SimpleEditionState)).call(this, timeline));

    _this.currentEditedLayer = null;
    _this.currentTarget = null;
    return _this;
  }

  (0, _createClass3.default)(SimpleEditionState, [{
    key: 'enter',
    value: function enter() {}
  }, {
    key: 'exit',
    value: function exit() {}
  }, {
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e);
          break;
        case 'mousemove':
          this.onMouseMove(e);
          break;
        case 'mouseup':
          this.onMouseUp(e);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      var _this2 = this;

      // keep target consistent with mouse down
      this.currentTarget = e.target;

      this.layers.forEach(function (layer) {
        if (!layer.hasElement(_this2.currentTarget)) {
          return;
        }

        if (!e.originalEvent.shiftKey) {
          layer.unselect();
        }

        var item = layer.getItemFromDOMElement(_this2.currentTarget);

        if (item === null) {
          return;
        }

        _this2.currentEditedLayer = layer;
        requestAnimationFrame(function () {
          layer.select(item);
        });
      });
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      if (!this.currentEditedLayer) {
        return;
      }

      var layer = this.currentEditedLayer;
      var items = layer.selectedItems;

      layer.edit(items, e.dx, e.dy, this.currentTarget);
      requestAnimationFrame(function () {
        layer.update(items);
      });
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      this.currentEditedLayer = null;
    }
  }]);
  return SimpleEditionState;
}(_baseState2.default);

exports.default = SimpleEditionState;

},{"./base-state":45,"babel-runtime/core-js/object/get-prototype-of":64,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/possibleConstructorReturn":74}],53:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Add `sign` to the left of a given `input` until it matches match `length`
 *
 * @param {String} input - String to format
 * @param {String} sign - Character to add to the left
 * @param {Number} length - Length of the output string
 */
var padLeft = exports.padLeft = function padLeft(input, sign, length) {
  input += ''; // make sure we deal with a string

  while (input.length < length) {
    input = sign + input;
  }return input;
};

},{}],54:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * OrthogonalData transforms an object of arrays `{foo: [1, 2], bar: [3, 4]}`
 * to or from an array of objects `[{foo: 1, bar: 3}, {foo: 2, bar: 4}]`
 */
var OrthogonalData = function () {
  function OrthogonalData() {
    (0, _classCallCheck3.default)(this, OrthogonalData);

    this._cols = null; // Object of arrays
    this._rows = null; // Array of objects
  }

  /**
   * Check the consistency of the data.
   */


  (0, _createClass3.default)(OrthogonalData, [{
    key: "_checkConsistency",
    value: function _checkConsistency() {
      var size = null;

      for (var key in this._cols) {
        var col = this._cols[key];
        var colLength = col.length;

        if (size !== null && size !== colLength) {
          throw new Error(this.prototype.constructor.name + ": inconsistent data");
        } else if (size === null) {
          size = colLength;
        }
      }
    }

    /**
     * Updates array of objects from object of arrays.
     */

  }, {
    key: "updateFromCols",
    value: function updateFromCols() {
      var _this = this;

      var keys = (0, _keys2.default)(this._cols);

      keys.forEach(function (key, i) {
        var col = _this._cols[key];

        col.forEach(function (value, index) {
          if (_this._rows[index] === undefined) _this._rows[index] = {};
          _this._rows[index][key] = value;
        });
      });

      this._checkConsistency();
    }

    /**
     * Updates object of arrays from array of objects.
     */

  }, {
    key: "updateFromRows",
    value: function updateFromRows() {
      var _this2 = this;

      this._rows.forEach(function (obj, index) {
        for (var key in obj) {
          if (index === 0) _this2._cols[key] = [];
          _this2._cols[key].push(obj[key]);
        }
      });

      this._checkConsistency();
    }

    /**
     * Sets an object of arrays.
     *
     * @type {Object<String, Array>}
     */

  }, {
    key: "cols",
    set: function set(obj) {
      this._cols = obj;
      this._rows = [];

      this.updateFromCols();
    }

    /**
     * Returns an object of arrays.
     *
     * @type {Object<String, Array>}
     */
    ,
    get: function get() {
      return this._cols;
    }

    /**
     * Sets an array of objects.
     *
     * @type {Array<Object>}
     */

  }, {
    key: "rows",
    set: function set(arr) {
      this._rows = arr;
      this._cols = {};

      this.updateFromRows();
    }

    /**
     * Returns an array of objects.
     *
     * @type {Array<Object>}
     */
    ,
    get: function get() {
      return this._rows;
    }
  }]);
  return OrthogonalData;
}();

exports.default = OrthogonalData;

},{"babel-runtime/core-js/object/keys":65,"babel-runtime/helpers/classCallCheck":70,"babel-runtime/helpers/createClass":71}],55:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Lightweight scales mimicing the `d3.js` functionnal API.
 */
exports.default = {
  /**
   * A linear scale interpolating values between a `domain` and a `range`.
   * @return {Function}
   */
  linear: function linear() {
    var _domain = [0, 1];
    var _range = [0, 1];

    var _slope = 1;
    var _intercept = 0;

    function _updateCoefs() {
      _slope = (_range[1] - _range[0]) / (_domain[1] - _domain[0]);
      _intercept = _range[0] - _slope * _domain[0];
    }

    function scale(value) {
      return _slope * value + _intercept;
    }

    scale.invert = function (value) {
      return (value - _intercept) / _slope;
    };

    scale.domain = function () {
      var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (arr === null) {
        return _domain;
      }

      _domain = arr;
      _updateCoefs();

      return scale;
    };

    scale.range = function () {
      var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (arr === null) {
        return _range;
      }

      _range = arr;
      _updateCoefs();

      return scale;
    };

    return scale;
  }
};

},{}],56:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/array/from"), __esModule: true };
},{"core-js/library/fn/array/from":79}],57:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":80}],58:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/is-iterable"), __esModule: true };
},{"core-js/library/fn/is-iterable":81}],59:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/map"), __esModule: true };
},{"core-js/library/fn/map":82}],60:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":83}],61:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":84}],62:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":85}],63:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-own-property-descriptor"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-descriptor":86}],64:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/get-prototype-of":87}],65:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":88}],66:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":89}],67:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/set"), __esModule: true };
},{"core-js/library/fn/set":90}],68:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":91}],69:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol/iterator"), __esModule: true };
},{"core-js/library/fn/symbol/iterator":92}],70:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
},{}],71:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _defineProperty = require("../core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
},{"../core-js/object/define-property":62}],72:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _getPrototypeOf = require("../core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _getOwnPropertyDescriptor = require("../core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);

  if (desc === undefined) {
    var parent = (0, _getPrototypeOf2.default)(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};
},{"../core-js/object/get-own-property-descriptor":63,"../core-js/object/get-prototype-of":64}],73:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _setPrototypeOf = require("../core-js/object/set-prototype-of");

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = require("../core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _typeof2 = require("../helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};
},{"../core-js/object/create":61,"../core-js/object/set-prototype-of":66,"../helpers/typeof":77}],74:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _typeof2 = require("../helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};
},{"../helpers/typeof":77}],75:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _isIterable2 = require("../core-js/is-iterable");

var _isIterable3 = _interopRequireDefault(_isIterable2);

var _getIterator2 = require("../core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();
},{"../core-js/get-iterator":57,"../core-js/is-iterable":58}],76:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _from = require("../core-js/array/from");

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};
},{"../core-js/array/from":56}],77:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _iterator = require("../core-js/symbol/iterator");

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = require("../core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
},{"../core-js/symbol":68,"../core-js/symbol/iterator":69}],78:[function(require,module,exports){
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":197}],79:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/_core').Array.from;

},{"../../modules/_core":107,"../../modules/es6.array.from":173,"../../modules/es6.string.iterator":185}],80:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.get-iterator');

},{"../modules/core.get-iterator":171,"../modules/es6.string.iterator":185,"../modules/web.dom.iterable":195}],81:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.is-iterable');

},{"../modules/core.is-iterable":172,"../modules/es6.string.iterator":185,"../modules/web.dom.iterable":195}],82:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.map');
require('../modules/es7.map.to-json');
require('../modules/es7.map.of');
require('../modules/es7.map.from');
module.exports = require('../modules/_core').Map;

},{"../modules/_core":107,"../modules/es6.map":175,"../modules/es6.object.to-string":183,"../modules/es6.string.iterator":185,"../modules/es7.map.from":187,"../modules/es7.map.of":188,"../modules/es7.map.to-json":189,"../modules/web.dom.iterable":195}],83:[function(require,module,exports){
require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;

},{"../../modules/_core":107,"../../modules/es6.object.assign":176}],84:[function(require,module,exports){
require('../../modules/es6.object.create');
var $Object = require('../../modules/_core').Object;
module.exports = function create(P, D) {
  return $Object.create(P, D);
};

},{"../../modules/_core":107,"../../modules/es6.object.create":177}],85:[function(require,module,exports){
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

},{"../../modules/_core":107,"../../modules/es6.object.define-property":178}],86:[function(require,module,exports){
require('../../modules/es6.object.get-own-property-descriptor');
var $Object = require('../../modules/_core').Object;
module.exports = function getOwnPropertyDescriptor(it, key) {
  return $Object.getOwnPropertyDescriptor(it, key);
};

},{"../../modules/_core":107,"../../modules/es6.object.get-own-property-descriptor":179}],87:[function(require,module,exports){
require('../../modules/es6.object.get-prototype-of');
module.exports = require('../../modules/_core').Object.getPrototypeOf;

},{"../../modules/_core":107,"../../modules/es6.object.get-prototype-of":180}],88:[function(require,module,exports){
require('../../modules/es6.object.keys');
module.exports = require('../../modules/_core').Object.keys;

},{"../../modules/_core":107,"../../modules/es6.object.keys":181}],89:[function(require,module,exports){
require('../../modules/es6.object.set-prototype-of');
module.exports = require('../../modules/_core').Object.setPrototypeOf;

},{"../../modules/_core":107,"../../modules/es6.object.set-prototype-of":182}],90:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.set');
require('../modules/es7.set.to-json');
require('../modules/es7.set.of');
require('../modules/es7.set.from');
module.exports = require('../modules/_core').Set;

},{"../modules/_core":107,"../modules/es6.object.to-string":183,"../modules/es6.set":184,"../modules/es6.string.iterator":185,"../modules/es7.set.from":190,"../modules/es7.set.of":191,"../modules/es7.set.to-json":192,"../modules/web.dom.iterable":195}],91:[function(require,module,exports){
require('../../modules/es6.symbol');
require('../../modules/es6.object.to-string');
require('../../modules/es7.symbol.async-iterator');
require('../../modules/es7.symbol.observable');
module.exports = require('../../modules/_core').Symbol;

},{"../../modules/_core":107,"../../modules/es6.object.to-string":183,"../../modules/es6.symbol":186,"../../modules/es7.symbol.async-iterator":193,"../../modules/es7.symbol.observable":194}],92:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/web.dom.iterable');
module.exports = require('../../modules/_wks-ext').f('iterator');

},{"../../modules/_wks-ext":168,"../../modules/es6.string.iterator":185,"../../modules/web.dom.iterable":195}],93:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],94:[function(require,module,exports){
module.exports = function () { /* empty */ };

},{}],95:[function(require,module,exports){
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],96:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":126}],97:[function(require,module,exports){
var forOf = require('./_for-of');

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":117}],98:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":159,"./_to-iobject":161,"./_to-length":162}],99:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = require('./_ctx');
var IObject = require('./_iobject');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var asc = require('./_array-species-create');
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

},{"./_array-species-create":101,"./_ctx":109,"./_iobject":123,"./_to-length":162,"./_to-object":163}],100:[function(require,module,exports){
var isObject = require('./_is-object');
var isArray = require('./_is-array');
var SPECIES = require('./_wks')('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

},{"./_is-array":125,"./_is-object":126,"./_wks":169}],101:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":100}],102:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":103,"./_wks":169}],103:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],104:[function(require,module,exports){
'use strict';
var dP = require('./_object-dp').f;
var create = require('./_object-create');
var redefineAll = require('./_redefine-all');
var ctx = require('./_ctx');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var $iterDefine = require('./_iter-define');
var step = require('./_iter-step');
var setSpecies = require('./_set-species');
var DESCRIPTORS = require('./_descriptors');
var fastKey = require('./_meta').fastKey;
var validate = require('./_validate-collection');
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

},{"./_an-instance":95,"./_ctx":109,"./_descriptors":111,"./_for-of":117,"./_iter-define":129,"./_iter-step":131,"./_meta":134,"./_object-create":136,"./_object-dp":137,"./_redefine-all":149,"./_set-species":154,"./_validate-collection":166}],105:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = require('./_classof');
var from = require('./_array-from-iterable');
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

},{"./_array-from-iterable":97,"./_classof":102}],106:[function(require,module,exports){
'use strict';
var global = require('./_global');
var $export = require('./_export');
var meta = require('./_meta');
var fails = require('./_fails');
var hide = require('./_hide');
var redefineAll = require('./_redefine-all');
var forOf = require('./_for-of');
var anInstance = require('./_an-instance');
var isObject = require('./_is-object');
var setToStringTag = require('./_set-to-string-tag');
var dP = require('./_object-dp').f;
var each = require('./_array-methods')(0);
var DESCRIPTORS = require('./_descriptors');

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  if (!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    C = wrapper(function (target, iterable) {
      anInstance(target, C, NAME, '_c');
      target._c = new Base();
      if (iterable != undefined) forOf(iterable, IS_MAP, target[ADDER], target);
    });
    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','), function (KEY) {
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if (KEY in proto && !(IS_WEAK && KEY == 'clear')) hide(C.prototype, KEY, function (a, b) {
        anInstance(this, C, KEY);
        if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    IS_WEAK || dP(C.prototype, 'size', {
      get: function () {
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F, O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

},{"./_an-instance":95,"./_array-methods":99,"./_descriptors":111,"./_export":115,"./_fails":116,"./_for-of":117,"./_global":118,"./_hide":120,"./_is-object":126,"./_meta":134,"./_object-dp":137,"./_redefine-all":149,"./_set-to-string-tag":155}],107:[function(require,module,exports){
var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],108:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

},{"./_object-dp":137,"./_property-desc":148}],109:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":93}],110:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],111:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":116}],112:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":118,"./_is-object":126}],113:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],114:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

},{"./_object-gops":142,"./_object-keys":145,"./_object-pie":146}],115:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var ctx = require('./_ctx');
var hide = require('./_hide');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":107,"./_ctx":109,"./_global":118,"./_hide":120}],116:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],117:[function(require,module,exports){
var ctx = require('./_ctx');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var anObject = require('./_an-object');
var toLength = require('./_to-length');
var getIterFn = require('./core.get-iterator-method');
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;

},{"./_an-object":96,"./_ctx":109,"./_is-array-iter":124,"./_iter-call":127,"./_to-length":162,"./core.get-iterator-method":170}],118:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],119:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],120:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":111,"./_object-dp":137,"./_property-desc":148}],121:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":118}],122:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":111,"./_dom-create":112,"./_fails":116}],123:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":103}],124:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":132,"./_wks":169}],125:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":103}],126:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],127:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":96}],128:[function(require,module,exports){
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":120,"./_object-create":136,"./_property-desc":148,"./_set-to-string-tag":155,"./_wks":169}],129:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var has = require('./_has');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":115,"./_has":119,"./_hide":120,"./_iter-create":128,"./_iterators":132,"./_library":133,"./_object-gpo":143,"./_redefine":150,"./_set-to-string-tag":155,"./_wks":169}],130:[function(require,module,exports){
var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":169}],131:[function(require,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],132:[function(require,module,exports){
module.exports = {};

},{}],133:[function(require,module,exports){
module.exports = true;

},{}],134:[function(require,module,exports){
var META = require('./_uid')('meta');
var isObject = require('./_is-object');
var has = require('./_has');
var setDesc = require('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !require('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_fails":116,"./_has":119,"./_is-object":126,"./_object-dp":137,"./_uid":165}],135:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

},{"./_fails":116,"./_iobject":123,"./_object-gops":142,"./_object-keys":145,"./_object-pie":146,"./_to-object":163}],136:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":96,"./_dom-create":112,"./_enum-bug-keys":113,"./_html":121,"./_object-dps":138,"./_shared-key":156}],137:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":96,"./_descriptors":111,"./_ie8-dom-define":122,"./_to-primitive":164}],138:[function(require,module,exports){
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":96,"./_descriptors":111,"./_object-dp":137,"./_object-keys":145}],139:[function(require,module,exports){
var pIE = require('./_object-pie');
var createDesc = require('./_property-desc');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var has = require('./_has');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

},{"./_descriptors":111,"./_has":119,"./_ie8-dom-define":122,"./_object-pie":146,"./_property-desc":148,"./_to-iobject":161,"./_to-primitive":164}],140:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject');
var gOPN = require('./_object-gopn').f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":141,"./_to-iobject":161}],141:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal');
var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_enum-bug-keys":113,"./_object-keys-internal":144}],142:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],143:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":119,"./_shared-key":156,"./_to-object":163}],144:[function(require,module,exports){
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":98,"./_has":119,"./_shared-key":156,"./_to-iobject":161}],145:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":113,"./_object-keys-internal":144}],146:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;

},{}],147:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export');
var core = require('./_core');
var fails = require('./_fails');
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};

},{"./_core":107,"./_export":115,"./_fails":116}],148:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],149:[function(require,module,exports){
var hide = require('./_hide');
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};

},{"./_hide":120}],150:[function(require,module,exports){
module.exports = require('./_hide');

},{"./_hide":120}],151:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-setmap-offrom/
var $export = require('./_export');
var aFunction = require('./_a-function');
var ctx = require('./_ctx');
var forOf = require('./_for-of');

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, cb;
    aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      cb = ctx(mapFn, arguments[2], 2);
      forOf(source, false, function (nextItem) {
        A.push(cb(nextItem, n++));
      });
    } else {
      forOf(source, false, A.push, A);
    }
    return new this(A);
  } });
};

},{"./_a-function":93,"./_ctx":109,"./_export":115,"./_for-of":117}],152:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-setmap-offrom/
var $export = require('./_export');

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { of: function of() {
    var length = arguments.length;
    var A = Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  } });
};

},{"./_export":115}],153:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object');
var anObject = require('./_an-object');
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

},{"./_an-object":96,"./_ctx":109,"./_is-object":126,"./_object-gopd":139}],154:[function(require,module,exports){
'use strict';
var global = require('./_global');
var core = require('./_core');
var dP = require('./_object-dp');
var DESCRIPTORS = require('./_descriptors');
var SPECIES = require('./_wks')('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_core":107,"./_descriptors":111,"./_global":118,"./_object-dp":137,"./_wks":169}],155:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":119,"./_object-dp":137,"./_wks":169}],156:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":157,"./_uid":165}],157:[function(require,module,exports){
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};

},{"./_global":118}],158:[function(require,module,exports){
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":110,"./_to-integer":160}],159:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":160}],160:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],161:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":110,"./_iobject":123}],162:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":160}],163:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":110}],164:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":126}],165:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],166:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

},{"./_is-object":126}],167:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var LIBRARY = require('./_library');
var wksExt = require('./_wks-ext');
var defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_core":107,"./_global":118,"./_library":133,"./_object-dp":137,"./_wks-ext":168}],168:[function(require,module,exports){
exports.f = require('./_wks');

},{"./_wks":169}],169:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":118,"./_shared":157,"./_uid":165}],170:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":102,"./_core":107,"./_iterators":132,"./_wks":169}],171:[function(require,module,exports){
var anObject = require('./_an-object');
var get = require('./core.get-iterator-method');
module.exports = require('./_core').getIterator = function (it) {
  var iterFn = get(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};

},{"./_an-object":96,"./_core":107,"./core.get-iterator-method":170}],172:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').isIterable = function (it) {
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    // eslint-disable-next-line no-prototype-builtins
    || Iterators.hasOwnProperty(classof(O));
};

},{"./_classof":102,"./_core":107,"./_iterators":132,"./_wks":169}],173:[function(require,module,exports){
'use strict';
var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":108,"./_ctx":109,"./_export":115,"./_is-array-iter":124,"./_iter-call":127,"./_iter-detect":130,"./_to-length":162,"./_to-object":163,"./core.get-iterator-method":170}],174:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":94,"./_iter-define":129,"./_iter-step":131,"./_iterators":132,"./_to-iobject":161}],175:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var MAP = 'Map';

// 23.1 Map Objects
module.exports = require('./_collection')(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);

},{"./_collection":106,"./_collection-strong":104,"./_validate-collection":166}],176:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });

},{"./_export":115,"./_object-assign":135}],177:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: require('./_object-create') });

},{"./_export":115,"./_object-create":136}],178:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_descriptors":111,"./_export":115,"./_object-dp":137}],179:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./_to-iobject');
var $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});

},{"./_object-gopd":139,"./_object-sap":147,"./_to-iobject":161}],180:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = require('./_to-object');
var $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});

},{"./_object-gpo":143,"./_object-sap":147,"./_to-object":163}],181:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object');
var $keys = require('./_object-keys');

require('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_object-keys":145,"./_object-sap":147,"./_to-object":163}],182:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', { setPrototypeOf: require('./_set-proto').set });

},{"./_export":115,"./_set-proto":153}],183:[function(require,module,exports){

},{}],184:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var SET = 'Set';

// 23.2 Set Objects
module.exports = require('./_collection')(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);

},{"./_collection":106,"./_collection-strong":104,"./_validate-collection":166}],185:[function(require,module,exports){
'use strict';
var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":129,"./_string-at":158}],186:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global = require('./_global');
var has = require('./_has');
var DESCRIPTORS = require('./_descriptors');
var $export = require('./_export');
var redefine = require('./_redefine');
var META = require('./_meta').KEY;
var $fails = require('./_fails');
var shared = require('./_shared');
var setToStringTag = require('./_set-to-string-tag');
var uid = require('./_uid');
var wks = require('./_wks');
var wksExt = require('./_wks-ext');
var wksDefine = require('./_wks-define');
var enumKeys = require('./_enum-keys');
var isArray = require('./_is-array');
var anObject = require('./_an-object');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var createDesc = require('./_property-desc');
var _create = require('./_object-create');
var gOPNExt = require('./_object-gopn-ext');
var $GOPD = require('./_object-gopd');
var $DP = require('./_object-dp');
var $keys = require('./_object-keys');
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    replacer = args[1];
    if (typeof replacer == 'function') $replacer = replacer;
    if ($replacer || !isArray(replacer)) replacer = function (key, value) {
      if ($replacer) value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

},{"./_an-object":96,"./_descriptors":111,"./_enum-keys":114,"./_export":115,"./_fails":116,"./_global":118,"./_has":119,"./_hide":120,"./_is-array":125,"./_library":133,"./_meta":134,"./_object-create":136,"./_object-dp":137,"./_object-gopd":139,"./_object-gopn":141,"./_object-gopn-ext":140,"./_object-gops":142,"./_object-keys":145,"./_object-pie":146,"./_property-desc":148,"./_redefine":150,"./_set-to-string-tag":155,"./_shared":157,"./_to-iobject":161,"./_to-primitive":164,"./_uid":165,"./_wks":169,"./_wks-define":167,"./_wks-ext":168}],187:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
require('./_set-collection-from')('Map');

},{"./_set-collection-from":151}],188:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
require('./_set-collection-of')('Map');

},{"./_set-collection-of":152}],189:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = require('./_export');

$export($export.P + $export.R, 'Map', { toJSON: require('./_collection-to-json')('Map') });

},{"./_collection-to-json":105,"./_export":115}],190:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
require('./_set-collection-from')('Set');

},{"./_set-collection-from":151}],191:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
require('./_set-collection-of')('Set');

},{"./_set-collection-of":152}],192:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = require('./_export');

$export($export.P + $export.R, 'Set', { toJSON: require('./_collection-to-json')('Set') });

},{"./_collection-to-json":105,"./_export":115}],193:[function(require,module,exports){
require('./_wks-define')('asyncIterator');

},{"./_wks-define":167}],194:[function(require,module,exports){
require('./_wks-define')('observable');

},{"./_wks-define":167}],195:[function(require,module,exports){
require('./es6.array.iterator');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var TO_STRING_TAG = require('./_wks')('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

},{"./_global":118,"./_hide":120,"./_iterators":132,"./_wks":169,"./es6.array.iterator":174}],196:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],197:[function(require,module,exports){
// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = require("./runtime");

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

},{"./runtime":198}],198:[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);

},{}]},{},[28])(28)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2F4aXMvYXhpcy1sYXllci5qcyIsImRpc3QvYXhpcy9ncmlkLWF4aXMtZ2VuZXJhdG9yLmpzIiwiZGlzdC9heGlzL3RpbWUtYXhpcy1nZW5lcmF0b3IuanMiLCJkaXN0L2JlaGF2aW9ycy9iYXNlLWJlaGF2aW9yLmpzIiwiZGlzdC9iZWhhdmlvcnMvYnJlYWtwb2ludC1iZWhhdmlvci5qcyIsImRpc3QvYmVoYXZpb3JzL21hcmtlci1iZWhhdmlvci5qcyIsImRpc3QvYmVoYXZpb3JzL3NlZ21lbnQtYmVoYXZpb3IuanMiLCJkaXN0L2JlaGF2aW9ycy90aW1lLWNvbnRleHQtYmVoYXZpb3IuanMiLCJkaXN0L2JlaGF2aW9ycy90cmFjZS1iZWhhdmlvci5qcyIsImRpc3QvY29yZS9sYXllci10aW1lLWNvbnRleHQuanMiLCJkaXN0L2NvcmUvbGF5ZXIuanMiLCJkaXN0L2NvcmUvbmFtZXNwYWNlLmpzIiwiZGlzdC9jb3JlL3RpbWVsaW5lLXRpbWUtY29udGV4dC5qcyIsImRpc3QvY29yZS90aW1lbGluZS5qcyIsImRpc3QvY29yZS90cmFjay1jb2xsZWN0aW9uLmpzIiwiZGlzdC9jb3JlL3RyYWNrLmpzIiwiZGlzdC9oZWxwZXJzL2Fubm90YXRlZC1tYXJrZXItbGF5ZXIuanMiLCJkaXN0L2hlbHBlcnMvYW5ub3RhdGVkLXNlZ21lbnQtbGF5ZXIuanMiLCJkaXN0L2hlbHBlcnMvYnJlYWtwb2ludC1sYXllci5qcyIsImRpc3QvaGVscGVycy9jdXJzb3ItbGF5ZXIuanMiLCJkaXN0L2hlbHBlcnMvZ3JpZC1heGlzLWxheWVyLmpzIiwiZGlzdC9oZWxwZXJzL21hcmtlci1sYXllci5qcyIsImRpc3QvaGVscGVycy9zZWdtZW50LWxheWVyLmpzIiwiZGlzdC9oZWxwZXJzL3RpY2stbGF5ZXIuanMiLCJkaXN0L2hlbHBlcnMvdGltZS1heGlzLWxheWVyLmpzIiwiZGlzdC9oZWxwZXJzL3RyYWNlLWxheWVyLmpzIiwiZGlzdC9oZWxwZXJzL3dhdmVmb3JtLWxheWVyLmpzIiwiZGlzdC9pbmRleC5qcyIsImRpc3QvaW50ZXJhY3Rpb25zL2V2ZW50LXNvdXJjZS5qcyIsImRpc3QvaW50ZXJhY3Rpb25zL2tleWJvYXJkLmpzIiwiZGlzdC9pbnRlcmFjdGlvbnMvc3VyZmFjZS5qcyIsImRpc3QvaW50ZXJhY3Rpb25zL3dhdmUtZXZlbnQuanMiLCJkaXN0L3NoYXBlcy9hbm5vdGF0ZWQtbWFya2VyLmpzIiwiZGlzdC9zaGFwZXMvYW5ub3RhdGVkLXNlZ21lbnQuanMiLCJkaXN0L3NoYXBlcy9iYXNlLXNoYXBlLmpzIiwiZGlzdC9zaGFwZXMvY3Vyc29yLmpzIiwiZGlzdC9zaGFwZXMvZG90LmpzIiwiZGlzdC9zaGFwZXMvbGluZS5qcyIsImRpc3Qvc2hhcGVzL21hcmtlci5qcyIsImRpc3Qvc2hhcGVzL3NlZ21lbnQuanMiLCJkaXN0L3NoYXBlcy90aWNrcy5qcyIsImRpc3Qvc2hhcGVzL3RyYWNlLWRvdHMuanMiLCJkaXN0L3NoYXBlcy90cmFjZS1wYXRoLmpzIiwiZGlzdC9zaGFwZXMvd2F2ZWZvcm0uanMiLCJkaXN0L3N0YXRlcy9iYXNlLXN0YXRlLmpzIiwiZGlzdC9zdGF0ZXMvYnJlYWtwb2ludC1zdGF0ZS5qcyIsImRpc3Qvc3RhdGVzL2JydXNoLXpvb20tc3RhdGUuanMiLCJkaXN0L3N0YXRlcy9jZW50ZXJlZC16b29tLXN0YXRlLmpzIiwiZGlzdC9zdGF0ZXMvY29udGV4dC1lZGl0aW9uLXN0YXRlLmpzIiwiZGlzdC9zdGF0ZXMvZWRpdGlvbi1zdGF0ZS5qcyIsImRpc3Qvc3RhdGVzL3NlbGVjdGlvbi1zdGF0ZS5qcyIsImRpc3Qvc3RhdGVzL3NpbXBsZS1lZGl0aW9uLXN0YXRlLmpzIiwiZGlzdC91dGlscy9mb3JtYXQuanMiLCJkaXN0L3V0aWxzL29ydGhvZ29uYWwtZGF0YS5qcyIsImRpc3QvdXRpbHMvc2NhbGVzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9hcnJheS9mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9nZXQtaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL2lzLWl0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9tYXAuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3Qva2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L3NldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3NldC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9zeW1ib2wvaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvZ2V0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVybi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvc2xpY2VkVG9BcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvdG9Db25zdW1hYmxlQXJyYXkuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL3R5cGVvZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL3JlZ2VuZXJhdG9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9hcnJheS9mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9nZXQtaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL2lzLWl0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9tYXAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9nZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3Qva2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L3NldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL3NldC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vc3ltYm9sL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2EtZnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FkZC10by11bnNjb3BhYmxlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYW4taW5zdGFuY2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FuLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktZnJvbS1pdGVyYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LW1ldGhvZHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LXNwZWNpZXMtY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NvbGxlY3Rpb24tc3Ryb25nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb2xsZWN0aW9uLXRvLWpzb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NvbGxlY3Rpb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NvcmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NyZWF0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY3R4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kZWZpbmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZG9tLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZW51bS1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19leHBvcnQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2ZhaWxzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19mb3Itb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2dsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19odG1sLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtYXJyYXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lzLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jYWxsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1kZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGV0ZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLXN0ZXAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXJhdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fbGlicmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fbWV0YS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ29wZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcG4tZXh0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ29wbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1ncG8uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLWludGVybmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LXBpZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LXNhcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcmVkZWZpbmUtYWxsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19yZWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LWNvbGxlY3Rpb24tZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LWNvbGxlY3Rpb24tb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NldC1wcm90by5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXNwZWNpZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NldC10by1zdHJpbmctdGFnLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQta2V5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3N0cmluZy1hdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tYWJzb2x1dGUtaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWlvYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWxlbmd0aC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1wcmltaXRpdmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3VpZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdmFsaWRhdGUtY29sbGVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLWV4dC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLmlzLWl0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYubWFwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuZGVmaW5lLXByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuZ2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zZXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5tYXAuZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcubWFwLm9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5tYXAudG8tanNvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcuc2V0LmZyb20uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnNldC5vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcuc2V0LnRvLWpzb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnN5bWJvbC5hc3luYy1pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcuc3ltYm9sLm9ic2VydmFibGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZS1tb2R1bGUuanMiLCJub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7QUFDQTs7Ozs7O0FBR0E7Ozs7Ozs7Ozs7O0lBV3FCLFM7OztBQUNuQjs7Ozs7QUFLQSxxQkFBWSxTQUFaLEVBQXVCLE9BQXZCLEVBQWdDO0FBQUE7O0FBQUEsNElBQ3hCLFFBRHdCLEVBQ2QsRUFEYyxFQUNWLE9BRFU7O0FBRTlCLFVBQUssVUFBTCxHQUFrQixTQUFsQjtBQUY4QjtBQUcvQjs7QUFFRDs7Ozs7OztBQW9DQTs7OztvQ0FJZ0I7QUFDZCxVQUFNLE9BQU8sS0FBSyxVQUFMLENBQWdCLEtBQUssV0FBckIsQ0FBYjtBQUNBO0FBQ0EsV0FBSyxPQUFMLENBQWEsQ0FBYixFQUFnQixLQUFLLElBQUwsQ0FBVSxDQUFWLEVBQWEsTUFBN0I7QUFDQTtBQUNBLFlBQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixLQUF2QixDQUE2QixLQUFLLElBQUwsQ0FBVSxDQUFWLENBQTdCLEVBQTJDLElBQTNDO0FBQ0Q7O0FBRUQ7Ozs7Ozs4Q0FHMEI7QUFDeEIsV0FBSyxpQkFBTCxDQUF1QixXQUF2QixHQUFxQyxLQUFLLFdBQUwsQ0FBaUIsV0FBdEQ7QUFDQSxXQUFLLGlCQUFMLENBQXVCLFlBQXZCLEdBQXNDLEtBQUssYUFBM0M7QUFDQSxXQUFLLGlCQUFMLENBQXVCLE1BQXZCLEdBQWdDLEtBQUssTUFBTCxDQUFZLE1BQTVDO0FBQ0E7O0FBRUE7QUFDQSxXQUFLLGlCQUFMLENBQXVCLE9BQXZCLEdBQWlDLEtBQUssV0FBTCxDQUFpQixXQUFqQixDQUE2QixLQUFLLFdBQUwsQ0FBaUIsTUFBOUMsQ0FBakM7QUFDQSxXQUFLLGlCQUFMLENBQXVCLFlBQXZCLEdBQXNDLEtBQUssV0FBTCxDQUFpQixZQUF2RDtBQUNEOztBQUVEOzs7Ozs7NkJBR1M7QUFDUCxXQUFLLGFBQUw7QUFDQTtBQUNEOztBQUVEOzs7Ozs7O3VDQUltQjtBQUNqQjtBQUNBLFdBQUssR0FBTCxHQUFXLFNBQVMsZUFBVCxzQkFBNkIsR0FBN0IsQ0FBWDtBQUNBLFVBQUksS0FBSyxNQUFMLENBQVksU0FBWixLQUEwQixJQUE5QixFQUFvQztBQUNsQyxhQUFLLEdBQUwsQ0FBUyxTQUFULENBQW1CLEdBQW5CLENBQXVCLE9BQXZCLEVBQWdDLEtBQUssTUFBTCxDQUFZLFNBQTVDO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFLLE9BQUwsR0FBZSxTQUFTLGVBQVQsc0JBQTZCLEdBQTdCLENBQWY7QUFDQSxXQUFLLE9BQUwsQ0FBYSxTQUFiLENBQXVCLEdBQXZCLENBQTJCLFFBQTNCLEVBQXFDLE9BQXJDO0FBQ0E7QUFDQSxXQUFLLFdBQUwsR0FBbUIsU0FBUyxlQUFULHNCQUE2QixNQUE3QixDQUFuQjtBQUNBLFdBQUssV0FBTCxDQUFpQixTQUFqQixDQUEyQixHQUEzQixDQUErQixZQUEvQjtBQUNBLFdBQUssV0FBTCxDQUFpQixLQUFqQixDQUF1QixXQUF2QixHQUFxQyxDQUFyQztBQUNBLFdBQUssV0FBTCxDQUFpQixLQUFqQixDQUF1QixhQUF2QixHQUF1QyxNQUF2QztBQUNBO0FBQ0EsV0FBSyxHQUFMLENBQVMsV0FBVCxDQUFxQixLQUFLLE9BQTFCO0FBQ0EsV0FBSyxPQUFMLENBQWEsV0FBYixDQUF5QixLQUFLLFdBQTlCO0FBQ0Q7O0FBRUQ7Ozs7OztzQ0FHa0I7QUFDaEIsV0FBSyx1QkFBTDs7QUFFQSxVQUFNLE1BQU0sS0FBSyxNQUFMLENBQVksR0FBeEI7QUFDQSxVQUFNLFNBQVMsS0FBSyxNQUFMLENBQVksTUFBM0I7QUFDQSxVQUFNLE9BQU8sS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQUMsS0FBSyxpQkFBTCxDQUF1QixPQUFwQyxDQUFiO0FBQ0E7QUFDQSxVQUFNLCtDQUE0QyxNQUFNLE1BQWxELE9BQU47QUFDQSxXQUFLLEdBQUwsQ0FBUyxjQUFULENBQXdCLElBQXhCLEVBQThCLFdBQTlCLEVBQTJDLGVBQTNDOztBQUVBO0FBQ0EsV0FBSyxXQUFMLENBQWlCLGNBQWpCLENBQWdDLElBQWhDLEVBQXNDLFFBQXRDLEVBQWdELE1BQWhEO0FBQ0EsV0FBSyxXQUFMLENBQWlCLGNBQWpCLENBQWdDLElBQWhDLEVBQXNDLE9BQXRDLEVBQStDLEtBQUssV0FBTCxDQUFpQixZQUFoRTtBQUNBLFdBQUssV0FBTCxDQUFpQixjQUFqQixDQUFnQyxJQUFoQyxFQUFzQyxHQUF0QyxFQUEyQyxJQUEzQztBQUNEOzs7c0JBOUdnQixLLEVBQU87QUFBRTtBQUFTO0FBQ25DOzs7QUFNQTt3QkFDbUI7QUFBRTtBQUFTO0FBQzlCOzs7O3NCQVBXLEssRUFBTztBQUFFO0FBQVM7QUFDN0I7O3dCQU9hO0FBQUU7QUFBUztBQUN4Qjs7OztzQkFQVSxLLEVBQU87QUFBRTtBQUFTO0FBQzVCOzt3QkFPWTtBQUFFO0FBQVM7QUFDdkI7Ozs7c0JBUGEsSyxFQUFPO0FBQUU7QUFBUyxLO3dCQVFoQjtBQUFFO0FBQVM7O0FBRzFCOzs7Ozs7OztzQkFLYyxJLEVBQU07QUFDbEIsV0FBSyxVQUFMLEdBQWtCLElBQWxCO0FBQ0Q7O0FBRUQ7Ozs7Ozt3QkFLZ0I7QUFDZCxhQUFPLEtBQUssVUFBWjtBQUNEOzs7OztrQkE3Q2tCLFM7Ozs7Ozs7O0FDZnJCOzs7Ozs7Ozs7QUFTQSxTQUFTLGlCQUFULENBQTJCLEdBQTNCLEVBQWdDLFNBQWhDLEVBQTJDO0FBQ3pDLE1BQU0sT0FBUSxNQUFNLEVBQXBCLENBRHlDLENBQ2pCO0FBQ3hCLE1BQU0sUUFBUSxJQUFJLFNBQVMsVUFBVSxLQUFWLENBQWdCLEdBQWhCLEVBQXFCLENBQXJCLENBQVQsRUFBa0MsRUFBbEMsQ0FBbEI7QUFDQSxNQUFNLHFCQUFxQixTQUFTLFVBQVUsS0FBVixDQUFnQixHQUFoQixFQUFxQixDQUFyQixDQUFULEVBQWtDLEVBQWxDLENBQTNCOztBQUVBLFNBQU8sVUFBUyxXQUFULEVBQXNCO0FBQzNCLFFBQU0sV0FBVyxZQUFZLGVBQTdCO0FBQ0EsUUFBTSxTQUFTLFlBQVksTUFBM0I7QUFDQSxRQUFNLE9BQU8sRUFBYjs7QUFFQTtBQUNBLFFBQU0sTUFBTSxDQUFFLE1BQWQ7QUFDQTtBQUNBLFFBQU0sTUFBTSxXQUFXLE1BQXZCOztBQUVBO0FBQ0EsUUFBTSxrQkFBa0IsWUFBWSx1QkFBcEM7QUFDQTtBQUNBLFFBQU0sV0FBVyxJQUFJLElBQXJCO0FBQ0E7QUFDQSxRQUFNLFNBQVMsTUFBTSxRQUFyQjtBQUNBLFFBQU0sT0FBTyxDQUFDLE1BQU0sTUFBUCxJQUFpQixRQUE5QjtBQUNBLFFBQU0sZ0JBQWdCLFdBQVcsSUFBakM7QUFDQTtBQUNBLFFBQUksbUJBQW1CLE9BQU8sa0JBQTlCOztBQUVBO0FBQ0EsUUFBTSxnQkFBZ0Isa0JBQWtCLElBQXhDO0FBQ0EsUUFBTSxVQUFVLENBQWhCOztBQUVBO0FBQ0EsU0FBSyxJQUFJLE9BQU8sYUFBaEIsRUFBK0IsT0FBTyxHQUF0QyxFQUEyQyxRQUFRLFFBQW5ELEVBQTZEO0FBQzNEO0FBQ0EsVUFBTSxVQUFXLHFCQUFxQixrQkFBckIsS0FBNEMsQ0FBN0Q7QUFDQTtBQUNBLFVBQUssaUJBQWlCLE9BQWxCLElBQThCLENBQUMsT0FBbkMsRUFBNEM7QUFBRTtBQUFXOztBQUV6RCxXQUFLLElBQUwsQ0FBVSxFQUFFLFVBQUYsRUFBUSxnQkFBUixFQUFWO0FBQ0Q7O0FBRUQsV0FBTyxJQUFQO0FBQ0QsR0FwQ0Q7QUFxQ0Q7O2tCQUVjLGlCOzs7Ozs7OztrQkMzQ1MsaUI7O0FBVnhCOztBQUdBOzs7Ozs7O0FBT2UsU0FBUyxpQkFBVCxHQUE2QjtBQUMxQztBQUNBLFNBQU8sVUFBUyxXQUFULEVBQXNCO0FBQzNCLFFBQU0sV0FBVyxZQUFZLGVBQTdCO0FBQ0EsUUFBTSxTQUFTLFlBQVksTUFBM0I7QUFDQSxRQUFNLE9BQU8sRUFBYjs7QUFFQTtBQUNBLFFBQU0sTUFBTSxDQUFFLE1BQWQ7QUFDQTtBQUNBLFFBQU0sTUFBTSxXQUFXLE1BQXZCOztBQUVBO0FBQ0EsUUFBTSxrQkFBa0IsWUFBWSx1QkFBcEM7QUFDQSxRQUFNLFVBQVUsQ0FBaEI7O0FBRUE7QUFDQSxRQUFJLGFBQUo7QUFBQSxRQUFVLGFBQVY7QUFBQSxRQUFnQixnQkFBaEI7QUFBQSxRQUF5QixxQkFBekI7QUFBQSxRQUF1QyxzQkFBdkM7O0FBRUEsUUFBSSxrQkFBa0IsQ0FBbEIsR0FBc0IsT0FBMUIsRUFBbUM7QUFDakMsYUFBTyxDQUFQLENBRGlDLENBQ3ZCO0FBQ1YsZ0JBQVUsQ0FBVjtBQUNBLHFCQUFlLEVBQWYsQ0FIaUMsQ0FHZDtBQUNuQixzQkFBZ0IsQ0FBaEIsQ0FKaUMsQ0FJZDtBQUNuQixhQUFPLE9BQVA7QUFDRDs7QUFFRCxRQUFJLGtCQUFrQixDQUFsQixHQUFzQixPQUExQixFQUFtQztBQUNqQyxhQUFPLENBQVA7QUFDQSxnQkFBVSxDQUFWO0FBQ0EscUJBQWUsRUFBZjtBQUNBLHNCQUFnQixDQUFoQjtBQUNBLGFBQU8sT0FBUDtBQUNEOztBQUVELFFBQUksa0JBQWtCLE9BQXRCLEVBQStCO0FBQzdCLGFBQU8sQ0FBUDtBQUNBLGdCQUFVLENBQVY7QUFDQSxxQkFBZSxFQUFmO0FBQ0Esc0JBQWdCLENBQWhCO0FBQ0EsYUFBTyxLQUFQO0FBQ0Q7O0FBRUQsUUFBSSxrQkFBa0IsRUFBbEIsR0FBdUIsT0FBM0IsRUFBb0M7QUFDbEMsYUFBTyxJQUFJLEVBQVg7QUFDQSxnQkFBVSxDQUFWO0FBQ0EscUJBQWUsRUFBZjtBQUNBLHNCQUFnQixDQUFoQjtBQUNBLGFBQU8sSUFBUDtBQUNEOztBQUVELFFBQUksa0JBQWtCLEdBQWxCLEdBQXdCLE9BQTVCLEVBQXFDO0FBQ25DLGFBQU8sSUFBSSxHQUFYO0FBQ0EsZ0JBQVUsQ0FBVjtBQUNBLHFCQUFlLEVBQWY7QUFDQSxzQkFBZ0IsQ0FBaEI7QUFDQSxhQUFPLElBQVA7QUFDRDs7QUFFRCxRQUFJLGtCQUFrQixJQUFsQixHQUF5QixPQUE3QixFQUFzQztBQUNwQyxhQUFPLElBQUksSUFBWDtBQUNBLGdCQUFVLENBQVY7QUFDQSxxQkFBZSxFQUFmO0FBQ0Esc0JBQWdCLENBQWhCO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQsU0FBSyxJQUFJLE9BQU8sR0FBaEIsRUFBcUIsT0FBTyxHQUE1QixFQUFpQyxRQUFRLElBQXpDLEVBQStDO0FBQzdDLFVBQU0sZ0JBQWdCLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBdEI7O0FBRUEsVUFBSSxLQUFLLEtBQUwsQ0FBVyxnQkFBZ0IsSUFBM0IsSUFBbUMsYUFBbkMsS0FBcUQsQ0FBekQsRUFBNEQ7QUFDMUQ7QUFDRDs7QUFFRDtBQUNBLFVBQU0sVUFBVSxLQUFLLEtBQUwsQ0FBVyxnQkFBZ0IsSUFBM0IsSUFBbUMsWUFBbkMsS0FBb0QsQ0FBcEQsR0FBd0QsSUFBeEQsR0FBK0QsS0FBL0U7O0FBRUEsVUFBTSxRQUFRLEVBQUUsTUFBTSxhQUFSLEVBQXVCLGdCQUF2QixFQUFkOztBQUVBLFVBQUksWUFBWSxJQUFoQixFQUFzQjtBQUNwQixZQUFNLE9BQU8sSUFBSSxJQUFKLENBQVMsT0FBTyxhQUFoQixDQUFiO0FBQ0EsWUFBTSxPQUFNLHFCQUFRLEtBQUssVUFBTCxFQUFSLEVBQTJCLENBQTNCLEVBQThCLENBQTlCLENBQVo7QUFDQSxZQUFNLE1BQU0scUJBQVEsS0FBSyxVQUFMLEVBQVIsRUFBMkIsQ0FBM0IsRUFBOEIsQ0FBOUIsQ0FBWjtBQUNBLFlBQU0sUUFBUSxxQkFBUSxLQUFLLGVBQUwsRUFBUixFQUFnQyxDQUFoQyxFQUFtQyxDQUFuQyxDQUFkO0FBQ0EsWUFBTSxRQUFXLElBQVgsU0FBa0IsR0FBbEIsU0FBeUIsS0FBL0I7O0FBRUEsY0FBTSxLQUFOLEdBQWMsS0FBZDtBQUNEOztBQUVELFdBQUssSUFBTCxDQUFVLEtBQVY7QUFDRDs7QUFFRCxXQUFPLElBQVA7QUFDRCxHQTNGRDtBQTRGRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFrQnFCLFk7QUFDbkIsMEJBQWM7QUFBQTs7QUFDWixTQUFLLGNBQUwsR0FBc0IsbUJBQXRCLENBRFksQ0FDcUI7QUFDakMsU0FBSyxjQUFMLEdBQXNCLElBQXRCO0FBQ0EsU0FBSyxNQUFMLEdBQWMsSUFBZDtBQUNEOzs7OytCQUVVLEssRUFBTztBQUNoQixXQUFLLE1BQUwsR0FBYyxLQUFkO0FBQ0EsV0FBSyxjQUFMLEdBQXNCLE1BQU0sTUFBTixDQUFhLGlCQUFuQztBQUNEOztBQUVEOzs7Ozs7Ozs7OEJBTVU7QUFDUixXQUFLLGNBQUwsQ0FBb0IsS0FBcEI7QUFDRDs7QUFFRDs7Ozs7Ozs7OztBQTJCQTs7Ozs7OzJCQU1PLEssRUFBTyxLLEVBQU87QUFDbkIsWUFBTSxTQUFOLENBQWdCLEdBQWhCLENBQW9CLEtBQUssYUFBekI7QUFDQSxXQUFLLGNBQUwsQ0FBb0IsR0FBcEIsQ0FBd0IsS0FBeEI7QUFDRDs7QUFFRDs7Ozs7Ozs7OzZCQU1TLEssRUFBTyxLLEVBQU87QUFDckIsWUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLEtBQUssYUFBNUI7QUFDQSxXQUFLLGNBQUwsQ0FBb0IsTUFBcEIsQ0FBMkIsS0FBM0I7QUFDRDs7QUFFRDs7Ozs7Ozs7O29DQU1nQixLLEVBQU8sSyxFQUFPO0FBQzVCLFVBQU0sU0FBUyxLQUFLLGNBQUwsQ0FBb0IsR0FBcEIsQ0FBd0IsS0FBeEIsSUFBaUMsVUFBakMsR0FBOEMsUUFBN0Q7QUFDQSxXQUFLLE1BQUwsRUFBYSxLQUFiO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7O3lCQVdLLGdCLEVBQWtCLEssRUFBTyxLLEVBQU8sRSxFQUFJLEUsRUFBSSxPLEVBQVM7QUFDcEQ7QUFDRDs7O3NCQXBFaUIsSyxFQUFPO0FBQ3ZCLFdBQUssY0FBTCxHQUFzQixLQUF0QjtBQUNEOztBQUVEOzs7Ozs7d0JBS29CO0FBQ2xCLGFBQU8sS0FBSyxjQUFaO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUtvQjtBQUNsQix3REFBVyxLQUFLLGNBQWhCO0FBQ0Q7Ozs7O2tCQS9Da0IsWTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQnJCOzs7Ozs7QUFHQTs7Ozs7SUFLcUIsa0I7Ozs7Ozs7Ozs7eUJBQ2QsZ0IsRUFBa0IsSyxFQUFPLEssRUFBTyxFLEVBQUksRSxFQUFJLE0sRUFBUTtBQUNuRCxVQUFNLE9BQVEsS0FBSyxNQUFMLENBQVksSUFBMUI7QUFDQSxVQUFNLGNBQWMsaUJBQWlCLE1BQXJDO0FBQ0E7QUFDQSxVQUFNLElBQUksaUJBQWlCLFdBQWpCLENBQTZCLE1BQU0sRUFBTixDQUFTLEtBQVQsQ0FBN0IsQ0FBVjtBQUNBLFVBQU0sSUFBSSxpQkFBaUIsWUFBakIsQ0FBOEIsTUFBTSxFQUFOLENBQVMsS0FBVCxDQUE5QixDQUFWO0FBQ0E7QUFDQSxVQUFJLFVBQVUsSUFBSSxFQUFsQjtBQUNBLFVBQUksVUFBVSxJQUFJLEVBQWxCOztBQUVBLFVBQUksS0FBSyxNQUFMLEdBQWMsQ0FBbEIsRUFBcUI7QUFDbkI7QUFDQSxZQUFNLE9BQU8sS0FBSyxHQUFMLENBQVMsVUFBQyxDQUFEO0FBQUEsaUJBQU8saUJBQWlCLFdBQWpCLENBQTZCLE1BQU0sRUFBTixDQUFTLENBQVQsQ0FBN0IsQ0FBUDtBQUFBLFNBQVQsQ0FBYjtBQUNBLGFBQUssSUFBTCxDQUFVLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSxpQkFBVSxJQUFJLENBQUosR0FBUSxDQUFDLENBQVQsR0FBYSxDQUF2QjtBQUFBLFNBQVY7QUFDQTtBQUNBLFlBQU0sUUFBUSxLQUFLLE9BQUwsQ0FBYSxDQUFiLENBQWQ7QUFDQTtBQUNBLFlBQUksVUFBVSxLQUFLLFFBQVEsQ0FBYixDQUFWLElBQTZCLFVBQVUsS0FBSyxRQUFRLENBQWIsQ0FBM0MsRUFBNEQ7QUFDMUQsb0JBQVUsQ0FBVjtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQSxVQUFJLFVBQVUsQ0FBZCxFQUFpQjtBQUNmLGtCQUFVLENBQVY7QUFDRCxPQUZELE1BRU8sSUFBSSxVQUFVLFdBQWQsRUFBMkI7QUFDaEMsa0JBQVUsV0FBVjtBQUNEOztBQUVEO0FBQ0EsWUFBTSxFQUFOLENBQVMsS0FBVCxFQUFnQixpQkFBaUIsV0FBakIsQ0FBNkIsTUFBN0IsQ0FBb0MsT0FBcEMsQ0FBaEI7QUFDQSxZQUFNLEVBQU4sQ0FBUyxLQUFULEVBQWdCLGlCQUFpQixZQUFqQixDQUE4QixNQUE5QixDQUFxQyxPQUFyQyxDQUFoQjtBQUNEOzs7OztrQkFqQ2tCLGtCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1JyQjs7Ozs7O0FBR0E7Ozs7O0lBS00sYzs7Ozs7Ozs7Ozt5QkFDQyxnQixFQUFrQixLLEVBQU8sSyxFQUFPLEUsRUFBSSxFLEVBQUksTSxFQUFRO0FBQ25ELFVBQU0sSUFBSSxpQkFBaUIsV0FBakIsQ0FBNkIsTUFBTSxDQUFOLENBQVEsS0FBUixDQUE3QixDQUFWO0FBQ0EsVUFBTSxVQUFXLElBQUksRUFBTCxHQUFXLENBQVgsR0FBZSxJQUFJLEVBQW5CLEdBQXdCLENBQXhDOztBQUVBLFlBQU0sQ0FBTixDQUFRLEtBQVIsRUFBZSxpQkFBaUIsV0FBakIsQ0FBNkIsTUFBN0IsQ0FBb0MsT0FBcEMsQ0FBZjtBQUNEOzs7OztrQkFHWSxjOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pCZjs7Ozs7O0FBR0E7Ozs7O0lBS3FCLGU7Ozs7Ozs7Ozs7eUJBQ2QsZ0IsRUFBa0IsSyxFQUFPLEssRUFBTyxFLEVBQUksRSxFQUFJLE0sRUFBUTtBQUNuRCxVQUFNLFlBQVksT0FBTyxTQUF6QjtBQUNBLFVBQUksU0FBUyxNQUFiOztBQUVBLFVBQUksVUFBVSxRQUFWLENBQW1CLFNBQW5CLEtBQWlDLFVBQVUsUUFBVixDQUFtQixNQUFuQixDQUFyQyxFQUFpRTtBQUMvRCxpQkFBUyxZQUFUO0FBQ0QsT0FGRCxNQUVPLElBQUksVUFBVSxRQUFWLENBQW1CLFNBQW5CLEtBQWlDLFVBQVUsUUFBVixDQUFtQixPQUFuQixDQUFyQyxFQUFrRTtBQUN2RSxpQkFBUyxhQUFUO0FBQ0Q7O0FBRUQsaUJBQVMsTUFBVCxFQUFtQixnQkFBbkIsRUFBcUMsS0FBckMsRUFBNEMsS0FBNUMsRUFBbUQsRUFBbkQsRUFBdUQsRUFBdkQsRUFBMkQsTUFBM0Q7QUFDRDs7OzBCQUVLLGdCLEVBQWtCLEssRUFBTyxLLEVBQU8sRSxFQUFJLEUsRUFBSSxNLEVBQVE7QUFDcEQsVUFBTSxjQUFjLGlCQUFpQixNQUFyQztBQUNBO0FBQ0EsVUFBTSxJQUFJLGlCQUFpQixXQUFqQixDQUE2QixNQUFNLENBQU4sQ0FBUSxLQUFSLENBQTdCLENBQVY7QUFDQSxVQUFNLElBQUksaUJBQWlCLFlBQWpCLENBQThCLE1BQU0sQ0FBTixDQUFRLEtBQVIsQ0FBOUIsQ0FBVjtBQUNBLFVBQU0sU0FBUyxpQkFBaUIsWUFBakIsQ0FBOEIsTUFBTSxNQUFOLENBQWEsS0FBYixDQUE5QixDQUFmO0FBQ0E7QUFDQSxVQUFJLFVBQVUsS0FBSyxHQUFMLENBQVMsSUFBSSxFQUFiLEVBQWlCLENBQWpCLENBQWQ7QUFDQSxVQUFJLFVBQVUsSUFBSSxFQUFsQjs7QUFFQTtBQUNBLFVBQUksVUFBVSxDQUFkLEVBQWlCO0FBQ2Ysa0JBQVUsQ0FBVjtBQUNELE9BRkQsTUFFTyxJQUFJLFVBQVUsTUFBVixHQUFtQixXQUF2QixFQUFvQztBQUN6QyxrQkFBVSxjQUFjLE1BQXhCO0FBQ0Q7O0FBRUQsWUFBTSxDQUFOLENBQVEsS0FBUixFQUFlLGlCQUFpQixXQUFqQixDQUE2QixNQUE3QixDQUFvQyxPQUFwQyxDQUFmO0FBQ0EsWUFBTSxDQUFOLENBQVEsS0FBUixFQUFlLGlCQUFpQixZQUFqQixDQUE4QixNQUE5QixDQUFxQyxPQUFyQyxDQUFmO0FBQ0Q7OztnQ0FFVyxnQixFQUFrQixLLEVBQU8sSyxFQUFPLEUsRUFBSSxFLEVBQUksTSxFQUFRO0FBQzFEO0FBQ0EsVUFBTSxJQUFRLGlCQUFpQixXQUFqQixDQUE2QixNQUFNLENBQU4sQ0FBUSxLQUFSLENBQTdCLENBQWQ7QUFDQSxVQUFNLFFBQVEsaUJBQWlCLFdBQWpCLENBQTZCLE1BQU0sS0FBTixDQUFZLEtBQVosQ0FBN0IsQ0FBZDtBQUNBO0FBQ0EsVUFBSSxhQUFjLElBQUksS0FBdEI7QUFDQSxVQUFJLFVBQWMsSUFBSSxFQUFKLEdBQVMsVUFBVCxHQUFzQixLQUFLLEdBQUwsQ0FBUyxJQUFJLEVBQWIsRUFBaUIsQ0FBakIsQ0FBdEIsR0FBNEMsQ0FBOUQ7QUFDQSxVQUFJLGNBQWMsWUFBWSxDQUFaLEdBQWdCLEtBQUssR0FBTCxDQUFTLFFBQVEsRUFBakIsRUFBcUIsQ0FBckIsQ0FBaEIsR0FBMEMsS0FBNUQ7O0FBRUEsWUFBTSxDQUFOLENBQVEsS0FBUixFQUFlLGlCQUFpQixXQUFqQixDQUE2QixNQUE3QixDQUFvQyxPQUFwQyxDQUFmO0FBQ0EsWUFBTSxLQUFOLENBQVksS0FBWixFQUFtQixpQkFBaUIsV0FBakIsQ0FBNkIsTUFBN0IsQ0FBb0MsV0FBcEMsQ0FBbkI7QUFDRDs7O2lDQUVZLGdCLEVBQWtCLEssRUFBTyxLLEVBQU8sRSxFQUFJLEUsRUFBSSxNLEVBQVE7QUFDM0Q7QUFDQSxVQUFNLFFBQVEsaUJBQWlCLFdBQWpCLENBQTZCLE1BQU0sS0FBTixDQUFZLEtBQVosQ0FBN0IsQ0FBZDtBQUNBO0FBQ0EsVUFBSSxjQUFjLEtBQUssR0FBTCxDQUFTLFFBQVEsRUFBakIsRUFBcUIsQ0FBckIsQ0FBbEI7O0FBRUEsWUFBTSxLQUFOLENBQVksS0FBWixFQUFtQixpQkFBaUIsV0FBakIsQ0FBNkIsTUFBN0IsQ0FBb0MsV0FBcEMsQ0FBbkI7QUFDRDs7Ozs7a0JBdkRrQixlOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDUnJCOzs7OztJQUtxQixtQjs7Ozs7Ozt5QkFDZCxLLEVBQU8sRSxFQUFJLEUsRUFBSSxNLEVBQVE7QUFDMUIsVUFBTSxjQUFjLE1BQU0sV0FBMUI7O0FBRUEsVUFBSSxPQUFPLFNBQVAsQ0FBaUIsUUFBakIsQ0FBMEIsU0FBMUIsS0FBd0MsT0FBTyxTQUFQLENBQWlCLFFBQWpCLENBQTBCLE1BQTFCLENBQTVDLEVBQStFO0FBQzdFLGFBQUssU0FBTCxDQUFlLFdBQWYsRUFBNEIsRUFBNUI7QUFDRCxPQUZELE1BRU8sSUFBSSxPQUFPLFNBQVAsQ0FBaUIsUUFBakIsQ0FBMEIsU0FBMUIsS0FBd0MsT0FBTyxTQUFQLENBQWlCLFFBQWpCLENBQTBCLE9BQTFCLENBQTVDLEVBQWdGO0FBQ3JGLGFBQUssVUFBTCxDQUFnQixXQUFoQixFQUE2QixFQUE3QjtBQUNELE9BRk0sTUFFQSxJQUFJLE9BQU8sU0FBUCxDQUFpQixRQUFqQixDQUEwQixTQUExQixDQUFKLEVBQTBDO0FBQy9DLGFBQUssS0FBTCxDQUFXLFdBQVgsRUFBd0IsRUFBeEI7QUFDRDtBQUNGOzs7OEJBRVMsVyxFQUFhLEUsRUFBSTtBQUN6QjtBQUNBLFVBQU0sSUFBSSxZQUFZLE1BQVosQ0FBbUIsV0FBbkIsQ0FBK0IsWUFBWSxLQUEzQyxDQUFWO0FBQ0EsVUFBTSxTQUFTLFlBQVksV0FBWixDQUF3QixZQUFZLE1BQXBDLENBQWY7QUFDQSxVQUFNLFFBQVEsWUFBWSxXQUFaLENBQXdCLFlBQVksUUFBcEMsQ0FBZDs7QUFFQSxVQUFNLFVBQVUsSUFBSSxFQUFwQjtBQUNBLFVBQU0sZUFBZSxTQUFTLEVBQTlCO0FBQ0EsVUFBTSxjQUFjLEtBQUssR0FBTCxDQUFTLFFBQVEsRUFBakIsRUFBcUIsQ0FBckIsQ0FBcEI7O0FBRUEsa0JBQVksS0FBWixHQUFvQixZQUFZLE1BQVosQ0FBbUIsV0FBbkIsQ0FBK0IsTUFBL0IsQ0FBc0MsT0FBdEMsQ0FBcEI7QUFDQSxrQkFBWSxNQUFaLEdBQXFCLFlBQVksV0FBWixDQUF3QixNQUF4QixDQUErQixZQUEvQixDQUFyQjtBQUNBLGtCQUFZLFFBQVosR0FBdUIsWUFBWSxXQUFaLENBQXdCLE1BQXhCLENBQStCLFdBQS9CLENBQXZCO0FBQ0Q7OzsrQkFFVSxXLEVBQWEsRSxFQUFJO0FBQzFCLFVBQU0sUUFBUSxZQUFZLFdBQVosQ0FBd0IsWUFBWSxRQUFwQyxDQUFkO0FBQ0EsVUFBTSxjQUFjLEtBQUssR0FBTCxDQUFTLFFBQVEsRUFBakIsRUFBcUIsQ0FBckIsQ0FBcEI7O0FBRUEsa0JBQVksUUFBWixHQUF1QixZQUFZLFdBQVosQ0FBd0IsTUFBeEIsQ0FBK0IsV0FBL0IsQ0FBdkI7QUFDRDs7OzBCQUVLLFcsRUFBYSxFLEVBQUk7QUFDckIsVUFBTSxJQUFJLFlBQVksTUFBWixDQUFtQixXQUFuQixDQUErQixZQUFZLEtBQTNDLENBQVY7QUFDQSxVQUFNLFVBQVUsS0FBSyxHQUFMLENBQVMsSUFBSSxFQUFiLEVBQWlCLENBQWpCLENBQWhCOztBQUVBLGtCQUFZLEtBQVosR0FBb0IsWUFBWSxNQUFaLENBQW1CLFdBQW5CLENBQStCLE1BQS9CLENBQXNDLE9BQXRDLENBQXBCO0FBQ0Q7Ozs0QkFFTyxLLEVBQU8sRSxFQUFJLEUsRUFBSSxNLEVBQVE7QUFDN0IsVUFBTSxjQUFjLE1BQU0sV0FBMUI7QUFDQSxVQUFNLGVBQWUsWUFBWSxRQUFqQztBQUNBLFVBQU0sYUFBYSxZQUFZLE1BQS9COztBQUVBLFdBQUssSUFBTCxDQUFVLEtBQVYsRUFBaUIsRUFBakIsRUFBcUIsRUFBckIsRUFBeUIsTUFBekI7O0FBRUEsVUFBTSxjQUFjLFlBQVksUUFBaEM7QUFDQSxVQUFNLFFBQVMsY0FBYyxZQUE3Qjs7QUFFQSxrQkFBWSxZQUFaLElBQTRCLEtBQTVCO0FBQ0Esa0JBQVksTUFBWixHQUFxQixVQUFyQjtBQUNBLGtCQUFZLFFBQVosR0FBdUIsWUFBdkI7QUFDRDs7Ozs7a0JBdkRrQixtQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNMckI7Ozs7OztBQUdBOzs7OztJQUtxQixhOzs7Ozs7Ozs7O3lCQUNkLGdCLEVBQWtCLEssRUFBTyxLLEVBQU8sRSxFQUFJLEUsRUFBSSxNLEVBQVE7QUFDbkQsVUFBSSxPQUFPLFNBQVAsQ0FBaUIsUUFBakIsQ0FBMEIsS0FBMUIsQ0FBSixFQUFzQztBQUNwQyxhQUFLLFVBQUwsQ0FBZ0IsZ0JBQWhCLEVBQWtDLEtBQWxDLEVBQXlDLEtBQXpDLEVBQWdELEVBQWhELEVBQW9ELEVBQXBELEVBQXdELEtBQXhEO0FBQ0QsT0FGRCxNQUVPLElBQUksT0FBTyxTQUFQLENBQWlCLFFBQWpCLENBQTBCLEtBQTFCLENBQUosRUFBc0M7QUFDM0MsYUFBSyxVQUFMLENBQWdCLGdCQUFoQixFQUFrQyxLQUFsQyxFQUF5QyxLQUF6QyxFQUFnRCxFQUFoRCxFQUFvRCxFQUFwRCxFQUF3RCxLQUF4RDtBQUNELE9BRk0sTUFFQTtBQUNMLGFBQUssU0FBTCxDQUFlLGdCQUFmLEVBQWlDLEtBQWpDLEVBQXdDLEtBQXhDLEVBQStDLEVBQS9DLEVBQW1ELEVBQW5EO0FBQ0Q7QUFDRjs7OzhCQUVTLGdCLEVBQWtCLEssRUFBTyxLLEVBQU8sRSxFQUFJLEUsRUFBSTtBQUNoRDtBQUNBLFVBQU0sSUFBSSxpQkFBaUIsV0FBakIsQ0FBNkIsTUFBTSxDQUFOLENBQVEsS0FBUixDQUE3QixDQUFWO0FBQ0EsVUFBTSxJQUFJLGlCQUFpQixZQUFqQixDQUE4QixNQUFNLElBQU4sQ0FBVyxLQUFYLENBQTlCLENBQVY7O0FBRUEsVUFBSSxVQUFVLElBQUksRUFBbEI7QUFDQSxVQUFJLFVBQVUsSUFBSSxFQUFsQjs7QUFFQSxZQUFNLENBQU4sQ0FBUSxLQUFSLEVBQWUsaUJBQWlCLFdBQWpCLENBQTZCLE1BQTdCLENBQW9DLE9BQXBDLENBQWY7QUFDQSxZQUFNLElBQU4sQ0FBVyxLQUFYLEVBQWtCLGlCQUFpQixZQUFqQixDQUE4QixNQUE5QixDQUFxQyxPQUFyQyxDQUFsQjtBQUNEOzs7K0JBRVUsZ0IsRUFBa0IsSyxFQUFPLEssRUFBTyxFLEVBQUksRSxFQUFJLFMsRUFBVztBQUM1RCxVQUFNLFFBQVEsaUJBQWlCLFlBQWpCLENBQThCLE1BQU0sS0FBTixDQUFZLEtBQVosQ0FBOUIsQ0FBZDs7QUFFQSxVQUFJLGNBQWMsY0FBYyxLQUFkLEdBQXNCLFFBQVEsSUFBSSxFQUFsQyxHQUF1QyxRQUFRLElBQUksRUFBckU7QUFDQSxvQkFBYyxLQUFLLEdBQUwsQ0FBUyxXQUFULEVBQXNCLENBQXRCLENBQWQ7O0FBRUEsWUFBTSxLQUFOLENBQVksS0FBWixFQUFtQixpQkFBaUIsWUFBakIsQ0FBOEIsTUFBOUIsQ0FBcUMsV0FBckMsQ0FBbkI7QUFDRDs7Ozs7a0JBOUJrQixhOzs7Ozs7Ozs7Ozs7Ozs7OztBQ1JyQjs7Ozs7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBZ0NxQixnQjtBQUNuQjs7O0FBR0EsNEJBQVksTUFBWixFQUFvQjtBQUFBOztBQUNsQixRQUFJLENBQUMsTUFBTCxFQUFhO0FBQUUsWUFBTSxJQUFJLEtBQUosQ0FBVSxxQ0FBVixDQUFOO0FBQXlEOztBQUV4RTs7Ozs7QUFLQSxTQUFLLE1BQUwsR0FBYyxNQUFkOztBQUVBLFNBQUssWUFBTCxHQUFvQixJQUFwQjtBQUNBLFNBQUssTUFBTCxHQUFjLENBQWQ7QUFDQSxTQUFLLFNBQUwsR0FBaUIsT0FBTyxlQUF4QjtBQUNBLFNBQUssT0FBTCxHQUFlLENBQWY7QUFDQSxTQUFLLGFBQUwsR0FBcUIsQ0FBckI7QUFDQTtBQUNBLFNBQUssTUFBTCxDQUFZLFNBQVosQ0FBc0IsSUFBdEIsQ0FBMkIsSUFBM0I7QUFDRDs7QUFFRDs7Ozs7Ozs7OzRCQUtRO0FBQ04sVUFBTSxNQUFNLElBQUksSUFBSixFQUFaOztBQUVBLFVBQUksTUFBSixHQUFhLEtBQUssTUFBbEI7QUFDQSxVQUFJLEtBQUosR0FBWSxLQUFLLEtBQWpCO0FBQ0EsVUFBSSxRQUFKLEdBQWUsS0FBSyxRQUFwQjtBQUNBLFVBQUksTUFBSixHQUFhLEtBQUssTUFBbEI7QUFDQSxVQUFJLFlBQUosR0FBbUIsS0FBSyxZQUF4QixDQVBNLENBT2dDOztBQUV0QyxhQUFPLEdBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7OztBQWtHQTs7Ozs7O2dDQU1ZLEUsRUFBSTtBQUNkLFVBQUksQ0FBQyxLQUFLLFlBQVYsRUFBd0I7QUFDdEIsZUFBTyxLQUFLLE1BQUwsQ0FBWSxXQUFaLENBQXdCLE1BQXhCLENBQStCLEVBQS9CLENBQVA7QUFDRDs7QUFFRCxhQUFPLEtBQUssWUFBTCxDQUFrQixNQUFsQixDQUF5QixFQUF6QixDQUFQO0FBQ0Q7Ozt3QkF6R1c7QUFDVixhQUFPLEtBQUssTUFBWjtBQUNEOztBQUVEOzs7Ozs7c0JBS1UsSyxFQUFPO0FBQ2YsV0FBSyxNQUFMLEdBQWMsS0FBZDtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLZTtBQUNiLGFBQU8sS0FBSyxTQUFaO0FBQ0Q7O0FBRUQ7Ozs7OztzQkFLYSxLLEVBQU87QUFDbEIsV0FBSyxTQUFMLEdBQWlCLEtBQWpCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUthO0FBQ1gsYUFBTyxLQUFLLE9BQVo7QUFDRDs7QUFFRDs7Ozs7O3NCQUtXLEssRUFBTztBQUNoQixXQUFLLE9BQUwsR0FBZSxLQUFmO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUttQjtBQUNqQixhQUFPLEtBQUssYUFBWjtBQUNEOztBQUVEOzs7Ozs7c0JBS2lCLEssRUFBTztBQUN0QjtBQUNBLFVBQUksVUFBVyxDQUFmLEVBQWtCO0FBQ2hCLGFBQUssWUFBTCxHQUFvQixJQUFwQjtBQUNBO0FBQ0Q7QUFDRDtBQUNBLFVBQU0sY0FBYyxLQUFLLFlBQUwsR0FDbEIsS0FBSyxZQURhLEdBQ0UsaUJBQU8sTUFBUCxHQUFnQixNQUFoQixDQUF1QixDQUFDLENBQUQsRUFBSSxDQUFKLENBQXZCLENBRHRCOztBQUdBLGtCQUFZLEtBQVosQ0FBa0IsQ0FBQyxDQUFELEVBQUksS0FBSyxNQUFMLENBQVksdUJBQVosR0FBc0MsS0FBMUMsQ0FBbEI7O0FBRUEsV0FBSyxZQUFMLEdBQW9CLFdBQXBCO0FBQ0EsV0FBSyxhQUFMLEdBQXFCLEtBQXJCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7d0JBT2tCO0FBQ2hCLFVBQUksQ0FBQyxLQUFLLFlBQVYsRUFDRSxPQUFPLEtBQUssTUFBTCxDQUFZLFdBQW5COztBQUVGLGFBQU8sS0FBSyxZQUFaO0FBQ0Q7Ozs7O2tCQXhJa0IsZ0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQ3JCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7QUFDQSxJQUFJLHNCQUFzQixJQUExQjtBQUNBLElBQUksdURBQUo7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBeUJxQixLOzs7QUFDbkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFCQSxpQkFBWSxRQUFaLEVBQXNCLElBQXRCLEVBQTBDO0FBQUEsUUFBZCxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFBQTs7QUFHeEMsUUFBTSxXQUFXO0FBQ2YsY0FBUSxHQURPO0FBRWYsV0FBSyxDQUZVO0FBR2YsZUFBUyxDQUhNO0FBSWYsZUFBUyxDQUFDLENBQUQsRUFBSSxDQUFKLENBSk07QUFLZixpQkFBVyxJQUxJO0FBTWYseUJBQW1CLFVBTko7QUFPZiwyQkFBcUIsQ0FQTjtBQVFmLGdCQUFVLElBUkssRUFRQztBQUNoQixVQUFJLEVBVFcsRUFTUDtBQUNSLGdCQUFVLFFBVkssQ0FVSztBQVZMLEtBQWpCOztBQWFBOzs7O0FBSUEsVUFBSyxNQUFMLEdBQWMsc0JBQWMsRUFBZCxFQUFrQixRQUFsQixFQUE0QixPQUE1QixDQUFkO0FBQ0E7Ozs7QUFJQSxVQUFLLFFBQUwsR0FBZ0IsUUFBaEIsQ0F6QndDLENBeUJkO0FBQzFCO0FBQ0EsVUFBSyxXQUFMLEdBQW1CLElBQW5CO0FBQ0E7QUFDQSxVQUFLLEdBQUwsR0FBVyxJQUFYO0FBQ0E7QUFDQSxVQUFLLFdBQUwsR0FBbUIsSUFBbkI7QUFDQTtBQUNBLFVBQUssWUFBTCxHQUFvQixJQUFwQjtBQUNBO0FBQ0EsVUFBSyxPQUFMLEdBQWUsSUFBZjtBQUNBO0FBQ0EsVUFBSyxhQUFMLEdBQXFCLElBQXJCO0FBQ0E7Ozs7QUFJQSxVQUFLLFlBQUwsR0FBb0IsSUFBcEI7O0FBRUEsVUFBSyxtQkFBTCxHQUEyQixJQUEzQixDQTVDd0MsQ0E0Q0Q7QUFDdkMsVUFBSyx5QkFBTCxHQUFpQyxJQUFqQyxDQTdDd0MsQ0E2Q0Q7QUFDdkMsVUFBSyxjQUFMLEdBQXNCLG1CQUF0QjtBQUNBLFVBQUssYUFBTCxHQUFxQixtQkFBckI7QUFDQSxVQUFLLG9CQUFMLEdBQTRCLG1CQUE1Qjs7QUFFQSxVQUFLLGtCQUFMLEdBQTBCLEtBQTFCO0FBQ0EsVUFBSyxTQUFMLEdBQWlCLElBQWpCOztBQUVBLFVBQUssT0FBTCxHQUFlLE1BQUssTUFBTCxDQUFZLE1BQTNCO0FBQ0EsVUFBSyxJQUFMLEdBQVksTUFBSyxNQUFMLENBQVksR0FBeEI7O0FBRUEsVUFBSyxJQUFMLEdBQVksSUFBWjs7QUFFQSxVQUFLLGFBQUwsR0FBcUIsaUJBQU8sTUFBUCxHQUNsQixNQURrQixDQUNYLE1BQUssTUFBTCxDQUFZLE9BREQsRUFFbEIsS0FGa0IsQ0FFWixDQUFDLENBQUQsRUFBSSxNQUFLLE9BQVQsQ0FGWSxDQUFyQjs7QUFJQTtBQUNBLFVBQUssZ0JBQUw7QUFDQTtBQUNBLFFBQUksd0JBQXdCLElBQTVCLEVBQWtDO0FBQ2hDLDRCQUFzQixJQUFJLHVCQUFKLEVBQXRCO0FBQ0Q7QUFuRXVDO0FBb0V6Qzs7QUFFRDs7Ozs7Ozs4QkFHVTtBQUNSLFdBQUssV0FBTCxHQUFtQixJQUFuQjtBQUNBLFdBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxXQUFLLE1BQUwsR0FBYyxJQUFkO0FBQ0EsV0FBSyxTQUFMLEdBQWlCLElBQWpCOztBQUVBLFdBQUssY0FBTCxDQUFvQixLQUFwQjtBQUNBLFdBQUssYUFBTCxDQUFtQixLQUFuQjtBQUNBLFdBQUssb0JBQUwsQ0FBMEIsS0FBMUI7O0FBRUEsV0FBSyxrQkFBTDtBQUNEOztBQUVEOzs7Ozs7OztpQ0E0S2EsZSxFQUFpQixjLEVBQWdCO0FBQzVDLFVBQU0sUUFBUSxpQkFBaUIsZUFBL0I7O0FBRUEsV0FBSyxPQUFMLEdBQWUsS0FBSyxPQUFMLEdBQWUsS0FBOUI7QUFDQSxXQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsR0FBWSxLQUF4QjtBQUNBLFdBQUssYUFBTCxDQUFtQixLQUFuQixDQUF5QixDQUFDLENBQUQsRUFBSSxLQUFLLE9BQVQsQ0FBekI7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7dUNBSW1CO0FBQUE7O0FBQ2pCO0FBQ0EsV0FBSyxHQUFMLEdBQVcsU0FBUyxlQUFULHNCQUE2QixHQUE3QixDQUFYO0FBQ0EsV0FBSyxHQUFMLENBQVMsU0FBVCxDQUFtQixHQUFuQixDQUF1QixPQUF2Qjs7QUFFQSxVQUFJLEtBQUssTUFBTCxDQUFZLFNBQVosS0FBMEIsSUFBOUIsRUFDRSxLQUFLLEdBQUwsQ0FBUyxTQUFULENBQW1CLEdBQW5CLENBQXVCLEtBQUssTUFBTCxDQUFZLFNBQW5DOztBQUVGO0FBQ0EsV0FBSyxZQUFMLEdBQW9CLFNBQVMsZUFBVCxzQkFBNkIsS0FBN0IsQ0FBcEI7QUFDQSxXQUFLLFlBQUwsQ0FBa0IsU0FBbEIsQ0FBNEIsR0FBNUIsQ0FBZ0MsY0FBaEM7QUFDQSxXQUFLLFlBQUwsQ0FBa0IsS0FBbEIsQ0FBd0IsUUFBeEIsR0FBbUMsS0FBSyxNQUFMLENBQVksUUFBL0M7QUFDQTtBQUNBLFdBQUssT0FBTCxHQUFlLFNBQVMsZUFBVCxzQkFBNkIsR0FBN0IsQ0FBZjtBQUNBLFdBQUssT0FBTCxDQUFhLFNBQWIsQ0FBdUIsR0FBdkIsQ0FBMkIsUUFBM0IsRUFBcUMsT0FBckM7QUFDQTtBQUNBLFdBQUssV0FBTCxHQUFtQixTQUFTLGVBQVQsc0JBQTZCLE1BQTdCLENBQW5CO0FBQ0EsV0FBSyxXQUFMLENBQWlCLGNBQWpCLENBQWdDLElBQWhDLEVBQXNDLFFBQXRDLEVBQWdELE1BQWhEO0FBQ0EsV0FBSyxXQUFMLENBQWlCLGNBQWpCLENBQWdDLElBQWhDLEVBQXNDLE9BQXRDLEVBQStDLE1BQS9DO0FBQ0EsV0FBSyxXQUFMLENBQWlCLFNBQWpCLENBQTJCLEdBQTNCLENBQStCLFlBQS9CO0FBQ0EsV0FBSyxXQUFMLENBQWlCLEtBQWpCLENBQXVCLFdBQXZCLEdBQXFDLENBQXJDO0FBQ0EsV0FBSyxXQUFMLENBQWlCLEtBQWpCLENBQXVCLGFBQXZCLEdBQXVDLE1BQXZDO0FBQ0E7QUFDQSxXQUFLLGFBQUwsR0FBcUIsU0FBUyxlQUFULHNCQUE2QixHQUE3QixDQUFyQjtBQUNBLFdBQUssYUFBTCxDQUFtQixTQUFuQixDQUE2QixHQUE3QixDQUFpQyxjQUFqQztBQUNBLFdBQUssYUFBTCxDQUFtQixLQUFuQixDQUF5QixPQUF6QixHQUFtQyxNQUFuQztBQUNBO0FBQ0EsV0FBSyxZQUFMLEdBQW9CLHVCQUFwQjtBQUNBLFdBQUssWUFBTCxDQUFrQixPQUFsQixDQUEwQjtBQUN4QixpQkFBUztBQUFBLGlCQUFNLEdBQU47QUFBQSxTQURlO0FBRXhCLGVBQVM7QUFBQSxpQkFBTSxTQUFOO0FBQUEsU0FGZTtBQUd4QixlQUFTO0FBQUEsaUJBQU0sT0FBSyxXQUFMLENBQWlCLFFBQXZCO0FBQUEsU0FIZTtBQUl4QixnQkFBUztBQUFBLGlCQUFNLE9BQUssaUJBQUwsQ0FBdUIsWUFBdkIsQ0FBb0MsTUFBcEMsR0FBNkMsQ0FBN0MsQ0FBTjtBQUFBLFNBSmU7QUFLeEIsV0FBUztBQUFBLGlCQUFNLE9BQUssaUJBQUwsQ0FBdUIsWUFBdkIsQ0FBb0MsTUFBcEMsR0FBNkMsQ0FBN0MsQ0FBTjtBQUFBO0FBTGUsT0FBMUI7O0FBUUEsV0FBSyxhQUFMLENBQW1CLFdBQW5CLENBQStCLEtBQUssWUFBTCxDQUFrQixNQUFsQixFQUEvQjtBQUNBO0FBQ0EsV0FBSyxHQUFMLENBQVMsV0FBVCxDQUFxQixLQUFLLFlBQTFCO0FBQ0EsV0FBSyxZQUFMLENBQWtCLFdBQWxCLENBQThCLEtBQUssT0FBbkM7QUFDQSxXQUFLLE9BQUwsQ0FBYSxXQUFiLENBQXlCLEtBQUssV0FBOUI7QUFDQSxXQUFLLFlBQUwsQ0FBa0IsV0FBbEIsQ0FBOEIsS0FBSyxhQUFuQztBQUNEOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7O21DQU1lLFcsRUFBYTtBQUMxQixXQUFLLFdBQUwsR0FBbUIsV0FBbkI7QUFDQTtBQUNBLFdBQUssaUJBQUwsR0FBeUIsRUFBekI7QUFDQSxXQUFLLHVCQUFMO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7bUNBT2UsSSxFQUFvQztBQUFBLFVBQTlCLFNBQThCLHVFQUFsQixFQUFrQjtBQUFBLFVBQWQsT0FBYyx1RUFBSixFQUFJOztBQUNqRCxXQUFLLG1CQUFMLEdBQTJCLEVBQUUsVUFBRixFQUFRLG9CQUFSLEVBQW1CLGdCQUFuQixFQUEzQjtBQUNEOztBQUVEOzs7Ozs7Ozs7O3lDQU9xQixJLEVBQW9DO0FBQUEsVUFBOUIsU0FBOEIsdUVBQWxCLEVBQWtCO0FBQUEsVUFBZCxPQUFjLHVFQUFKLEVBQUk7O0FBQ3ZELFdBQUsseUJBQUwsR0FBaUMsRUFBRSxVQUFGLEVBQVEsb0JBQVIsRUFBbUIsZ0JBQW5CLEVBQWpDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O2dDQUtZLFEsRUFBVTtBQUNwQixlQUFTLFVBQVQsQ0FBb0IsSUFBcEI7QUFDQSxXQUFLLFNBQUwsR0FBaUIsUUFBakI7QUFDRDs7QUFFRDs7Ozs7Ozs4Q0FJMEI7QUFDeEIsV0FBSyxpQkFBTCxDQUF1QixXQUF2QixHQUFxQyxLQUFLLFdBQUwsQ0FBaUIsV0FBdEQ7QUFDQSxXQUFLLGlCQUFMLENBQXVCLFlBQXZCLEdBQXNDLEtBQUssYUFBM0M7O0FBRUEsV0FBSyxpQkFBTCxDQUF1QixNQUF2QixHQUFnQyxLQUFLLE9BQXJDO0FBQ0EsV0FBSyxpQkFBTCxDQUF1QixLQUF2QixHQUFnQyxLQUFLLFdBQUwsQ0FBaUIsV0FBakIsQ0FBNkIsS0FBSyxXQUFMLENBQWlCLFFBQTlDLENBQWhDO0FBQ0E7QUFDQSxXQUFLLGlCQUFMLENBQXVCLE9BQXZCLEdBQWlDLEtBQUssV0FBTCxDQUFpQixXQUFqQixDQUE2QixLQUFLLFdBQUwsQ0FBaUIsTUFBOUMsQ0FBakM7QUFDQSxXQUFLLGlCQUFMLENBQXVCLE1BQXZCLEdBQWdDLEtBQUssV0FBTCxDQUFpQixNQUFqQixDQUF3QixXQUF4QixDQUFvQyxLQUFLLFdBQUwsQ0FBaUIsS0FBckQsQ0FBaEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBSyxpQkFBTCxDQUF1QixZQUF2QixHQUFzQyxLQUFLLFdBQUwsQ0FBaUIsTUFBakIsQ0FBd0IsV0FBeEIsQ0FBb0MsS0FBSyxXQUFMLENBQWlCLE1BQWpCLENBQXdCLE1BQTVELENBQXRDO0FBQ0EsV0FBSyxpQkFBTCxDQUF1QixZQUF2QixHQUFzQyxLQUFLLFdBQUwsQ0FBaUIsTUFBakIsQ0FBd0IsWUFBOUQ7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUFTQTs7Ozs7NkJBS2tCO0FBQUEsd0NBQVIsTUFBUTtBQUFSLGNBQVE7QUFBQTs7QUFDaEIsVUFBSSxDQUFDLEtBQUssU0FBVixFQUFxQjtBQUFFO0FBQVM7QUFDaEMsVUFBSSxDQUFDLE9BQU8sTUFBWixFQUFvQjtBQUFFLGlCQUFTLEtBQUssYUFBTCxDQUFtQixJQUFuQixFQUFUO0FBQXFDO0FBQzNELFVBQUksTUFBTSxPQUFOLENBQWMsT0FBTyxDQUFQLENBQWQsQ0FBSixFQUE4QjtBQUFFLGlCQUFTLE9BQU8sQ0FBUCxDQUFUO0FBQXFCOztBQUhyQztBQUFBO0FBQUE7O0FBQUE7QUFLaEIsd0RBQWtCLE1BQWxCLDRHQUEwQjtBQUFBLGNBQWpCLEtBQWlCOztBQUN4QixjQUFNLFFBQVEsS0FBSyxhQUFMLENBQW1CLEdBQW5CLENBQXVCLEtBQXZCLENBQWQ7QUFDQSxlQUFLLFNBQUwsQ0FBZSxNQUFmLENBQXNCLEtBQXRCLEVBQTZCLEtBQTdCO0FBQ0EsZUFBSyxRQUFMLENBQWMsS0FBZDtBQUNEO0FBVGU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVVqQjs7QUFFRDs7Ozs7Ozs7K0JBS29CO0FBQUEseUNBQVIsTUFBUTtBQUFSLGNBQVE7QUFBQTs7QUFDbEIsVUFBSSxDQUFDLEtBQUssU0FBVixFQUFxQjtBQUFFO0FBQVM7QUFDaEMsVUFBSSxDQUFDLE9BQU8sTUFBWixFQUFvQjtBQUFFLGlCQUFTLEtBQUssYUFBTCxDQUFtQixJQUFuQixFQUFUO0FBQXFDO0FBQzNELFVBQUksTUFBTSxPQUFOLENBQWMsT0FBTyxDQUFQLENBQWQsQ0FBSixFQUE4QjtBQUFFLGlCQUFTLE9BQU8sQ0FBUCxDQUFUO0FBQXFCOztBQUhuQztBQUFBO0FBQUE7O0FBQUE7QUFLbEIseURBQWtCLE1BQWxCLGlIQUEwQjtBQUFBLGNBQWpCLEtBQWlCOztBQUN4QixjQUFNLFFBQVEsS0FBSyxhQUFMLENBQW1CLEdBQW5CLENBQXVCLEtBQXZCLENBQWQ7QUFDQSxlQUFLLFNBQUwsQ0FBZSxRQUFmLENBQXdCLEtBQXhCLEVBQStCLEtBQS9CO0FBQ0Q7QUFSaUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVNuQjs7QUFFRDs7Ozs7Ozs7c0NBSzJCO0FBQUEseUNBQVIsTUFBUTtBQUFSLGNBQVE7QUFBQTs7QUFDekIsVUFBSSxDQUFDLEtBQUssU0FBVixFQUFxQjtBQUFFO0FBQVM7QUFDaEMsVUFBSSxDQUFDLE9BQU8sTUFBWixFQUFvQjtBQUFFLGlCQUFTLEtBQUssYUFBTCxDQUFtQixJQUFuQixFQUFUO0FBQXFDO0FBQzNELFVBQUksTUFBTSxPQUFOLENBQWMsT0FBTyxDQUFQLENBQWQsQ0FBSixFQUE4QjtBQUFFLGlCQUFTLE9BQU8sQ0FBUCxDQUFUO0FBQXFCOztBQUg1QjtBQUFBO0FBQUE7O0FBQUE7QUFLekIseURBQWtCLE1BQWxCLGlIQUEwQjtBQUFBLGNBQWpCLEtBQWlCOztBQUN4QixjQUFNLFFBQVEsS0FBSyxhQUFMLENBQW1CLEdBQW5CLENBQXVCLEtBQXZCLENBQWQ7QUFDQSxlQUFLLFNBQUwsQ0FBZSxlQUFmLENBQStCLEtBQS9CLEVBQXNDLEtBQXRDO0FBQ0Q7QUFSd0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVMxQjs7QUFFRDs7Ozs7Ozs7Ozs7O3lCQVNLLE0sRUFBUSxFLEVBQUksRSxFQUFJLE8sRUFBUztBQUM1QixVQUFJLENBQUMsS0FBSyxTQUFWLEVBQXFCO0FBQUU7QUFBUztBQUNoQyxlQUFTLENBQUMsTUFBTSxPQUFOLENBQWMsTUFBZCxDQUFELEdBQXlCLENBQUMsTUFBRCxDQUF6QixHQUFvQyxNQUE3Qzs7QUFGNEI7QUFBQTtBQUFBOztBQUFBO0FBSTVCLHlEQUFrQixNQUFsQixpSEFBMEI7QUFBQSxjQUFqQixLQUFpQjs7QUFDeEIsY0FBTSxRQUFRLEtBQUssY0FBTCxDQUFvQixHQUFwQixDQUF3QixLQUF4QixDQUFkO0FBQ0EsY0FBTSxRQUFRLEtBQUssYUFBTCxDQUFtQixHQUFuQixDQUF1QixLQUF2QixDQUFkOztBQUVBLGVBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsS0FBSyxpQkFBekIsRUFBNEMsS0FBNUMsRUFBbUQsS0FBbkQsRUFBMEQsRUFBMUQsRUFBOEQsRUFBOUQsRUFBa0UsT0FBbEU7QUFDQSxlQUFLLElBQUwsQ0FBVSxNQUFWLEVBQWtCLEtBQWxCLEVBQXlCLEtBQXpCO0FBQ0Q7QUFWMkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVc3Qjs7QUFFRDs7Ozs7Ozs7eUNBS2dDO0FBQUEsVUFBYixJQUFhLHVFQUFOLElBQU07O0FBQzlCLFVBQU0sVUFBVSxPQUFPLE9BQVAsR0FBaUIsTUFBakM7QUFDQSxXQUFLLGFBQUwsQ0FBbUIsS0FBbkIsQ0FBeUIsT0FBekIsR0FBbUMsT0FBbkM7QUFDQSxXQUFLLGtCQUFMLEdBQTBCLElBQTFCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Z0NBT1ksRSxFQUFJLEUsRUFBSSxPLEVBQVM7QUFDM0IsMEJBQW9CLElBQXBCLENBQXlCLElBQXpCLEVBQStCLEVBQS9CLEVBQW1DLEVBQW5DLEVBQXVDLE9BQXZDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7bUNBT2UsRSxFQUFJLEUsRUFBSSxPLEVBQVM7QUFDOUIsMEJBQW9CLE9BQXBCLENBQTRCLElBQTVCLEVBQWtDLEVBQWxDLEVBQXNDLEVBQXRDLEVBQTBDLE9BQTFDO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7MENBTXNCLEcsRUFBSztBQUN6QixVQUFJLGNBQUo7O0FBRUEsU0FBRztBQUNELFlBQUksSUFBSSxTQUFKLElBQWlCLElBQUksU0FBSixDQUFjLFFBQWQsQ0FBdUIsTUFBdkIsQ0FBckIsRUFBcUQ7QUFDbkQsa0JBQVEsR0FBUjtBQUNBO0FBQ0Q7O0FBRUQsY0FBTSxJQUFJLFVBQVY7QUFDRCxPQVBELFFBT1MsUUFBUSxJQVBqQjs7QUFTQSxhQUFPLEtBQUssT0FBTCxDQUFhLEtBQWIsSUFBc0IsS0FBdEIsR0FBOEIsSUFBckM7QUFDRDs7QUFFRDs7Ozs7Ozs7O3FDQU1pQixLLEVBQU87QUFDdEIsYUFBTyxLQUFLLE9BQUwsQ0FBYSxLQUFiLElBQXNCLEtBQUssY0FBTCxDQUFvQixHQUFwQixDQUF3QixLQUF4QixDQUF0QixHQUF1RCxJQUE5RDtBQUNEOztBQUVEOzs7Ozs7Ozs7OzJDQU91QixHLEVBQUs7QUFDMUIsVUFBTSxRQUFRLEtBQUsscUJBQUwsQ0FBMkIsR0FBM0IsQ0FBZDtBQUNBLGFBQU8sS0FBSyxnQkFBTCxDQUFzQixLQUF0QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OztxQ0FNaUIsSyxFQUFPO0FBQ3RCLFVBQU0sUUFBUSxLQUFLLGFBQUwsQ0FBbUIsR0FBbkIsQ0FBdUIsS0FBdkIsQ0FBZDtBQUNBLGFBQU8sUUFBUSxLQUFSLEdBQWdCLElBQXZCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7OzJDQVF1QixHLEVBQUs7QUFDMUIsVUFBTSxRQUFRLEtBQUsscUJBQUwsQ0FBMkIsR0FBM0IsQ0FBZDtBQUNBLGFBQU8sS0FBSyxnQkFBTCxDQUFzQixLQUF0QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs0QkFNUSxLLEVBQU87QUFDYixhQUFPLEtBQUssYUFBTCxDQUFtQixHQUFuQixDQUF1QixLQUF2QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7K0JBT1csRyxFQUFLO0FBQ2QsU0FBRztBQUNELFlBQUksUUFBUSxLQUFLLEdBQWpCLEVBQXNCO0FBQ3BCLGlCQUFPLElBQVA7QUFDRDs7QUFFRCxjQUFNLElBQUksVUFBVjtBQUNELE9BTkQsUUFNUyxRQUFRLElBTmpCOztBQVFBLGFBQU8sS0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7O21DQVVlLEksRUFBTTtBQUNuQixVQUFNLFFBQVcsS0FBSyxXQUFMLENBQWlCLE1BQWpCLENBQXdCLFdBQXhCLENBQW9DLEtBQUssV0FBTCxDQUFpQixLQUFyRCxDQUFqQjtBQUNBLFVBQU0sV0FBVyxLQUFLLFdBQUwsQ0FBaUIsV0FBakIsQ0FBNkIsS0FBSyxXQUFMLENBQWlCLFFBQTlDLENBQWpCO0FBQ0EsVUFBTSxTQUFXLEtBQUssV0FBTCxDQUFpQixXQUFqQixDQUE2QixLQUFLLFdBQUwsQ0FBaUIsTUFBOUMsQ0FBakI7QUFDQSxVQUFNLE1BQVcsS0FBSyxJQUF0QjtBQUNBO0FBQ0EsVUFBSSxLQUFLLEtBQUssR0FBTCxDQUFTLEtBQUssSUFBZCxFQUFvQixLQUFwQixDQUFUO0FBQ0EsVUFBSSxLQUFLLEtBQUssR0FBTCxDQUFTLEtBQUssSUFBTCxHQUFZLEtBQUssS0FBMUIsRUFBaUMsUUFBUSxRQUF6QyxDQUFUO0FBQ0EsWUFBTyxRQUFRLE1BQWY7QUFDQSxZQUFPLFFBQVEsTUFBZjtBQUNBO0FBQ0EsVUFBSSxLQUFLLEtBQUssT0FBTCxJQUFnQixLQUFLLEdBQUwsR0FBVyxLQUFLLE1BQWhDLENBQVQ7QUFDQSxVQUFJLEtBQUssS0FBSyxPQUFMLEdBQWUsS0FBSyxHQUE3Qjs7QUFFQSxZQUFNLEtBQUssSUFBWDtBQUNBLFlBQU0sS0FBSyxJQUFYOztBQUVBLFVBQU0saUJBQWlCLEVBQXZCOztBQWpCbUI7QUFBQTtBQUFBOztBQUFBO0FBbUJuQix5REFBMkIsS0FBSyxhQUFMLENBQW1CLE9BQW5CLEVBQTNCLGlIQUF5RDtBQUFBO0FBQUEsY0FBL0MsS0FBK0M7QUFBQSxjQUF4QyxLQUF3Qzs7QUFDdkQsY0FBTSxRQUFRLEtBQUssY0FBTCxDQUFvQixHQUFwQixDQUF3QixLQUF4QixDQUFkO0FBQ0EsY0FBTSxTQUFTLE1BQU0sTUFBTixDQUFhLEtBQUssaUJBQWxCLEVBQXFDLEtBQXJDLEVBQTRDLEVBQTVDLEVBQWdELEVBQWhELEVBQW9ELEVBQXBELEVBQXdELEVBQXhELENBQWY7O0FBRUEsY0FBSSxNQUFKLEVBQVk7QUFBRSwyQkFBZSxJQUFmLENBQW9CLEtBQXBCO0FBQTZCO0FBQzVDO0FBeEJrQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQTBCbkIsYUFBTyxjQUFQO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7NkJBTVMsSyxFQUFPO0FBQ2QsV0FBSyxPQUFMLENBQWEsV0FBYixDQUF5QixLQUF6QjtBQUNEOztBQUVEOzs7Ozs7Ozs7OzZCQU9TO0FBQUE7O0FBQ1A7QUFDQSxVQUNFLEtBQUsseUJBQUwsS0FBbUMsSUFBbkMsSUFDQSxLQUFLLG9CQUFMLENBQTBCLElBQTFCLEtBQW1DLENBRnJDLEVBR0U7QUFBQSxvQ0FDcUMsS0FBSyx5QkFEMUM7QUFBQSxZQUNRLElBRFIseUJBQ1EsSUFEUjtBQUFBLFlBQ2MsU0FEZCx5QkFDYyxTQURkO0FBQUEsWUFDeUIsT0FEekIseUJBQ3lCLE9BRHpCOztBQUVBLFlBQU0sU0FBUyxTQUFTLGVBQVQsc0JBQTZCLEdBQTdCLENBQWY7QUFDQSxZQUFNLFFBQVEsSUFBSSxJQUFKLENBQVMsT0FBVCxDQUFkOztBQUVBLGNBQU0sT0FBTixDQUFjLFNBQWQ7QUFDQSxlQUFPLFdBQVAsQ0FBbUIsTUFBTSxNQUFOLEVBQW5CO0FBQ0EsZUFBTyxTQUFQLENBQWlCLEdBQWpCLENBQXFCLE1BQXJCLEVBQTZCLFFBQTdCLEVBQXVDLE1BQU0sWUFBTixFQUF2Qzs7QUFFQSxhQUFLLG9CQUFMLENBQTBCLEdBQTFCLENBQThCLE1BQTlCLEVBQXNDLEtBQXRDO0FBQ0EsYUFBSyxPQUFMLENBQWEsV0FBYixDQUF5QixNQUF6QjtBQUNEOztBQUVEO0FBQ0EsVUFBTSxXQUFXLFNBQVMsc0JBQVQsRUFBakI7QUFDQSxVQUFNLFNBQVMsS0FBSyxhQUFMLENBQW1CLE1BQW5CLEVBQWYsQ0FwQk8sQ0FvQnFDOztBQUU1QztBQUNBLFdBQUssSUFBTCxDQUFVLE9BQVYsQ0FBa0IsVUFBQyxLQUFELEVBQVc7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDM0IsMkRBQWtCLE1BQWxCLGlIQUEwQjtBQUFBLGdCQUFqQixLQUFpQjtBQUFFLGdCQUFJLFVBQVUsS0FBZCxFQUFxQjtBQUFFO0FBQVM7QUFBRTtBQURuQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBLGtDQUdVLE9BQUssbUJBSGY7QUFBQSxZQUduQixJQUhtQix1QkFHbkIsSUFIbUI7QUFBQSxZQUdiLFNBSGEsdUJBR2IsU0FIYTtBQUFBLFlBR0YsT0FIRSx1QkFHRixPQUhFOztBQUkzQixZQUFNLFFBQVEsSUFBSSxJQUFKLENBQVMsT0FBVCxDQUFkO0FBQ0EsY0FBTSxPQUFOLENBQWMsU0FBZDs7QUFFQSxZQUFNLE1BQU0sTUFBTSxNQUFOLENBQWEsT0FBSyxpQkFBbEIsQ0FBWjtBQUNBLFlBQUksU0FBSixDQUFjLEdBQWQsQ0FBa0IsTUFBbEIsRUFBMEIsTUFBTSxZQUFOLEVBQTFCOztBQUVBLGVBQUssY0FBTCxDQUFvQixHQUFwQixDQUF3QixHQUF4QixFQUE2QixLQUE3QjtBQUNBLGVBQUssYUFBTCxDQUFtQixHQUFuQixDQUF1QixHQUF2QixFQUE0QixLQUE1Qjs7QUFFQSxpQkFBUyxXQUFULENBQXFCLEdBQXJCO0FBQ0QsT0FkRDs7QUFnQkEsV0FBSyxPQUFMLENBQWEsV0FBYixDQUF5QixRQUF6Qjs7QUFFQTtBQXpDTztBQUFBO0FBQUE7O0FBQUE7QUEwQ1AseURBQTJCLEtBQUssYUFBTCxDQUFtQixPQUFuQixFQUEzQixpSEFBeUQ7QUFBQTtBQUFBLGNBQS9DLEtBQStDO0FBQUEsY0FBeEMsS0FBd0M7O0FBQ3ZELGNBQUksS0FBSyxJQUFMLENBQVUsT0FBVixDQUFrQixLQUFsQixNQUE2QixDQUFDLENBQWxDLEVBQXFDO0FBQUU7QUFBVzs7QUFFbEQsY0FBTSxTQUFRLEtBQUssY0FBTCxDQUFvQixHQUFwQixDQUF3QixLQUF4QixDQUFkOztBQUVBLGVBQUssT0FBTCxDQUFhLFdBQWIsQ0FBeUIsS0FBekI7QUFDQSxpQkFBTSxPQUFOO0FBQ0E7QUFDQSxjQUFJLEtBQUssU0FBVCxFQUFvQjtBQUNsQixpQkFBSyxTQUFMLENBQWUsUUFBZixDQUF3QixLQUF4QixFQUErQixLQUEvQjtBQUNEOztBQUVELGVBQUssYUFBTCxDQUFtQixNQUFuQixDQUEwQixLQUExQjtBQUNBLGVBQUssY0FBTCxDQUFvQixNQUFwQixDQUEyQixLQUEzQjtBQUNEO0FBeERNO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUF5RFI7O0FBRUQ7Ozs7Ozs2QkFHUztBQUNQLFdBQUssZUFBTDtBQUNBLFdBQUssWUFBTDtBQUNEOztBQUVEOzs7Ozs7c0NBR2tCO0FBQ2hCLFdBQUssdUJBQUw7O0FBRUEsVUFBTSxjQUFjLEtBQUssV0FBekI7QUFDQSxVQUFNLFFBQVMsWUFBWSxXQUFaLENBQXdCLFlBQVksUUFBcEMsQ0FBZjtBQUNBO0FBQ0EsVUFBTSxJQUFTLFlBQVksTUFBWixDQUFtQixXQUFuQixDQUErQixZQUFZLEtBQTNDLENBQWY7QUFDQSxVQUFNLFNBQVMsWUFBWSxXQUFaLENBQXdCLFlBQVksTUFBcEMsQ0FBZjtBQUNBLFVBQU0sTUFBUyxLQUFLLElBQXBCO0FBQ0EsVUFBTSxTQUFTLEtBQUssT0FBcEI7QUFDQTtBQUNBLFVBQU0sMkNBQXlDLENBQXpDLFdBQStDLE1BQU0sTUFBckQsT0FBTjs7QUFFQSxXQUFLLEdBQUwsQ0FBUyxjQUFULENBQXdCLElBQXhCLEVBQThCLFdBQTlCLEVBQTJDLGVBQTNDOztBQUVBLFdBQUssWUFBTCxDQUFrQixjQUFsQixDQUFpQyxJQUFqQyxFQUF1QyxPQUF2QyxFQUFnRCxLQUFoRDtBQUNBLFdBQUssWUFBTCxDQUFrQixjQUFsQixDQUFpQyxJQUFqQyxFQUF1QyxRQUF2QyxFQUFpRCxNQUFqRDtBQUNBLFdBQUssWUFBTCxDQUFrQixLQUFsQixDQUF3QixPQUF4QixHQUFrQyxLQUFLLE1BQUwsQ0FBWSxPQUE5Qzs7QUFFQSxXQUFLLE9BQUwsQ0FBYSxjQUFiLENBQTRCLElBQTVCLEVBQWtDLFdBQWxDLGlCQUE0RCxNQUE1RDtBQUNBO0FBQ0EsV0FBSyxZQUFMLENBQWtCLE1BQWxCLENBQXlCLEtBQUssaUJBQTlCLEVBQWlELEtBQUssV0FBdEQsRUFBbUUsQ0FBbkU7QUFDRDs7QUFFRDs7Ozs7Ozs7bUNBS2U7QUFBQTs7QUFDYixXQUFLLHVCQUFMO0FBQ0E7QUFDQSxXQUFLLG9CQUFMLENBQTBCLE9BQTFCLENBQWtDLFVBQUMsS0FBRCxFQUFRLEtBQVIsRUFBa0I7QUFDbEQsY0FBTSxNQUFOLENBQWEsT0FBSyxpQkFBbEIsRUFBcUMsT0FBSyxJQUExQztBQUNELE9BRkQ7O0FBSGE7QUFBQTtBQUFBOztBQUFBO0FBT2IseURBQTJCLEtBQUssYUFBTCxDQUFtQixPQUFuQixFQUEzQixpSEFBeUQ7QUFBQTtBQUFBLGNBQS9DLEtBQStDO0FBQUEsY0FBeEMsS0FBd0M7O0FBQ3ZELGNBQU0sUUFBUSxLQUFLLGNBQUwsQ0FBb0IsR0FBcEIsQ0FBd0IsS0FBeEIsQ0FBZDtBQUNBLGdCQUFNLE1BQU4sQ0FBYSxLQUFLLGlCQUFsQixFQUFxQyxLQUFyQztBQUNEO0FBVlk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVdkOzs7OztBQXhxQkQ7Ozs7O3dCQUtZO0FBQ1YsYUFBTyxLQUFLLFdBQUwsQ0FBaUIsS0FBeEI7QUFDRDs7QUFFRDs7Ozs7O3NCQUtVLEssRUFBTztBQUNmLFdBQUssV0FBTCxDQUFpQixLQUFqQixHQUF5QixLQUF6QjtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLYTtBQUNYLGFBQU8sS0FBSyxXQUFMLENBQWlCLE1BQXhCO0FBQ0Q7O0FBRUQ7Ozs7OztzQkFLVyxLLEVBQU87QUFDaEIsV0FBSyxXQUFMLENBQWlCLE1BQWpCLEdBQTBCLEtBQTFCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUtlO0FBQ2IsYUFBTyxLQUFLLFdBQUwsQ0FBaUIsUUFBeEI7QUFDRDs7QUFFRDs7Ozs7O3NCQUthLEssRUFBTztBQUNsQixXQUFLLFdBQUwsQ0FBaUIsUUFBakIsR0FBNEIsS0FBNUI7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBS21CO0FBQ2pCLGFBQU8sS0FBSyxXQUFMLENBQWlCLFlBQXhCO0FBQ0Q7O0FBRUQ7Ozs7OztzQkFLaUIsSyxFQUFPO0FBQ3RCLFdBQUssV0FBTCxDQUFpQixZQUFqQixHQUFnQyxLQUFoQztBQUNEOztBQUVEOzs7Ozs7OztzQkFLWSxNLEVBQVE7QUFDbEIsV0FBSyxNQUFMLENBQVksT0FBWixHQUFzQixNQUF0QjtBQUNBLFdBQUssYUFBTCxDQUFtQixNQUFuQixDQUEwQixNQUExQjtBQUNEOztBQUVEOzs7Ozs7d0JBS2M7QUFDWixhQUFPLEtBQUssTUFBTCxDQUFZLE9BQW5CO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3NCQUtZLEssRUFBTztBQUNqQixXQUFLLE1BQUwsQ0FBWSxPQUFaLEdBQXNCLEtBQXRCO0FBQ0Q7O0FBRUQ7Ozs7Ozt3QkFLYztBQUNaLGFBQU8sS0FBSyxNQUFMLENBQVksT0FBbkI7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBS2tCO0FBQ2hCLGFBQU8sS0FBSyxXQUFMLENBQWlCLFdBQXhCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUttQjtBQUNqQixhQUFPLEtBQUssYUFBWjtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLWTtBQUNWLGFBQU8sb0JBQVcsS0FBSyxhQUFMLENBQW1CLElBQW5CLEVBQVgsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLVztBQUFFLGFBQU8sS0FBSyxLQUFaO0FBQW9COztBQUVqQzs7Ozs7O3NCQUtTLEksRUFBTTtBQUNiLGNBQVEsS0FBSyxRQUFiO0FBQ0UsYUFBSyxRQUFMO0FBQ0UsY0FBSSxLQUFLLEtBQVQsRUFBZ0I7QUFBRztBQUNqQixpQkFBSyxLQUFMLENBQVcsQ0FBWCxJQUFnQixJQUFoQjtBQUNELFdBRkQsTUFFTztBQUNMLGlCQUFLLEtBQUwsR0FBYSxDQUFDLElBQUQsQ0FBYjtBQUNEO0FBQ0Q7QUFDRixhQUFLLFlBQUw7QUFDRSxlQUFLLEtBQUwsR0FBYSxJQUFiO0FBQ0E7QUFWSjtBQVlEOzs7d0JBNkltQjtBQUNsQixhQUFPLEtBQUssU0FBTCxHQUFpQixLQUFLLFNBQUwsQ0FBZSxhQUFoQyxHQUFnRCxFQUF2RDtBQUNEOzs7aURBcFRtQyxJLEVBQU07QUFDeEMsZ0NBQTBCLElBQTFCO0FBQ0Q7OztFQW5IZ0MsaUJBQU8sWTs7a0JBQXJCLEs7Ozs7Ozs7O2tCQ3BDTiw0Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBZjs7Ozs7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQnFCLG1CO0FBQ25COzs7Ozs7QUFNQSwrQkFBWSxlQUFaLEVBQTZCLFlBQTdCLEVBQTJDO0FBQUE7O0FBQ3pDLFNBQUssU0FBTCxHQUFpQixFQUFqQjs7QUFFQSxTQUFLLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxTQUFLLE9BQUwsR0FBZSxDQUFmO0FBQ0EsU0FBSyxLQUFMLEdBQWEsQ0FBYjtBQUNBLFNBQUssd0JBQUwsR0FBZ0MsZUFBaEM7QUFDQTtBQUNBLFNBQUssYUFBTCxHQUFxQixZQUFyQjtBQUNBLFNBQUssd0JBQUwsR0FBZ0MsS0FBaEM7O0FBRUE7QUFDQSxRQUFNLFFBQVEsaUJBQU8sTUFBUCxHQUNYLE1BRFcsQ0FDSixDQUFDLENBQUQsRUFBSSxDQUFKLENBREksRUFFWCxLQUZXLENBRUwsQ0FBQyxDQUFELEVBQUksZUFBSixDQUZLLENBQWQ7O0FBSUEsU0FBSyxZQUFMLEdBQW9CLEtBQXBCOztBQUVBLFNBQUssd0JBQUwsR0FBZ0MsS0FBSyx3QkFBckM7QUFDRDs7QUFFRDs7Ozs7Ozs7OzhDQWdKMEI7QUFDeEIsV0FBSyxXQUFMLENBQWlCLEtBQWpCLENBQXVCLENBQUMsQ0FBRCxFQUFJLEtBQUssd0JBQVQsQ0FBdkI7QUFDRDs7O3dCQTdJcUI7QUFDcEIsYUFBTyxLQUFLLHdCQUFaO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3NCQU9vQixLLEVBQU87QUFDekIsV0FBSyx3QkFBTCxHQUFnQyxRQUFRLEtBQUssSUFBN0M7QUFDQSxXQUFLLHdCQUFMLEdBQWdDLEtBQWhDO0FBQ0EsV0FBSyx1QkFBTDs7QUFFQTtBQUNBLFdBQUssU0FBTCxDQUFlLE9BQWYsQ0FBdUIsVUFBUyxLQUFULEVBQWdCO0FBQ3JDLFlBQUksTUFBTSxZQUFOLEtBQXVCLENBQTNCLEVBQ0UsTUFBTSxZQUFOLEdBQXFCLE1BQU0sWUFBM0I7QUFDSCxPQUhEO0FBSUQ7O0FBRUQ7Ozs7Ozs7O3dCQUs4QjtBQUM1QixhQUFPLEtBQUssd0JBQVo7QUFDRDs7QUFFRDs7Ozs7Ozs7O3dCQU1hO0FBQ1gsYUFBTyxLQUFLLE9BQVo7QUFDRDs7QUFFRDs7Ozs7OztzQkFNVyxLLEVBQU87QUFDaEIsV0FBSyxPQUFMLEdBQWUsS0FBZjtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLVztBQUNULGFBQU8sS0FBSyxLQUFaO0FBQ0Q7O0FBRUQ7Ozs7OztzQkFLUyxLLEVBQU87QUFDZDtBQUNBLFVBQU0sY0FBYyxRQUFRLEtBQUssS0FBakM7QUFDQSxXQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsV0FBSyx3QkFBTCxHQUFnQyxLQUFLLHdCQUFMLEdBQWdDLEtBQWhFO0FBQ0EsV0FBSyx1QkFBTDs7QUFFQSxXQUFLLFNBQUwsQ0FBZSxPQUFmLENBQXVCLFVBQVMsS0FBVCxFQUFnQjtBQUNyQyxZQUFJLE1BQU0sWUFBTixLQUF1QixDQUEzQixFQUNFLE1BQU0sWUFBTixHQUFxQixNQUFNLFlBQU4sR0FBcUIsV0FBMUM7QUFDSCxPQUhEO0FBSUQ7O0FBRUQ7Ozs7Ozs7O3dCQUttQjtBQUNqQixhQUFPLEtBQUssYUFBWjtBQUNEOztBQUVEOzs7Ozs7c0JBS2lCLEssRUFBTztBQUN0QixVQUFNLGFBQWEsUUFBUSxLQUFLLGFBQWhDO0FBQ0EsV0FBSyxhQUFMLEdBQXFCLEtBQXJCOztBQUVBLFVBQUksS0FBSyx1QkFBVCxFQUNFLEtBQUssZUFBTCxHQUF1QixLQUFLLGVBQUwsR0FBdUIsVUFBOUM7QUFDSDs7QUFFRDs7Ozs7Ozs7d0JBS3NCO0FBQ3BCLGFBQU8sS0FBSyxZQUFMLEdBQW9CLEtBQUssd0JBQWhDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozt3QkFNOEI7QUFDNUIsYUFBTyxLQUFLLHdCQUFaO0FBQ0Q7O0FBRUQ7Ozs7Ozs7c0JBTTRCLEksRUFBTTtBQUNoQyxXQUFLLHdCQUFMLEdBQWdDLElBQWhDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUtrQjtBQUNoQixhQUFPLEtBQUssWUFBWjtBQUNEOzs7OztrQkExS2tCLG1COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkJyQjs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTJCTSxROzs7QUFDSjs7OztBQUlBLHNCQUVRO0FBQUEsUUFGSSxlQUVKLHVFQUZzQixHQUV0QjtBQUFBLFFBRjJCLFlBRTNCLHVFQUYwQyxJQUUxQzs7QUFBQSxtRkFBSixFQUFJO0FBQUEscUNBRE4sZ0JBQ007QUFBQSxRQUROLGdCQUNNLHlDQURhLElBQ2I7O0FBQUE7O0FBQUE7O0FBR04sVUFBSyxPQUFMLEdBQWUsb0NBQWY7QUFDQSxVQUFLLE1BQUwsR0FBYyxJQUFkOztBQUVBO0FBQ0EsVUFBSyxZQUFMOztBQUVBO0FBQ0EsVUFBSyxVQUFMLEdBQWtCLEVBQWxCO0FBQ0EsVUFBSyxjQUFMLEdBQXNCLEVBQXRCO0FBQ0EsVUFBSyxtQkFBTCxHQUEyQixtQkFBM0I7O0FBRUE7QUFDQSxVQUFLLFdBQUwsR0FBbUIsa0NBQXdCLGVBQXhCLEVBQXlDLFlBQXpDLENBQW5COztBQUVBLFFBQUksZ0JBQUosRUFDRSxNQUFLLGlCQUFMLHFCQUFpQyxRQUFqQztBQWxCSTtBQW1CUDs7QUFFRDs7Ozs7Ozs7Ozs7QUF3SEE7Ozs7Ozs7O3FDQVFpQixJLEVBQU07QUFDckIsV0FBSyxZQUFMLEdBQW9CLElBQXBCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7c0NBVWtCLEksRUFBTSxHLEVBQW1CO0FBQUE7O0FBQUEsVUFBZCxPQUFjLHVFQUFKLEVBQUk7O0FBQ3pDLFVBQU0sY0FBYyxJQUFJLElBQUosQ0FBUyxHQUFULEVBQWMsT0FBZCxDQUFwQjtBQUNBLGtCQUFZLEVBQVosQ0FBZSxPQUFmLEVBQXdCLFVBQUMsQ0FBRDtBQUFBLGVBQU8sT0FBSyxZQUFMLENBQWtCLENBQWxCLENBQVA7QUFBQSxPQUF4Qjs7QUFFQTtBQUNBLFVBQUksQ0FBQyxLQUFLLG1CQUFMLENBQXlCLEdBQXpCLENBQTZCLEdBQTdCLENBQUwsRUFDRSxLQUFLLG1CQUFMLENBQXlCLEdBQXpCLENBQTZCLEdBQTdCLEVBQWtDLG1CQUFsQzs7QUFFRixVQUFNLGlCQUFpQixLQUFLLG1CQUFMLENBQXlCLEdBQXpCLENBQTZCLEdBQTdCLENBQXZCO0FBQ0EscUJBQWUsR0FBZixDQUFtQixXQUFuQjtBQUNEOztBQUVEOzs7Ozs7Ozs7aUNBTWEsQyxFQUFHO0FBQ2QsVUFBTSxVQUFVLEVBQUUsYUFBRixDQUFnQixPQUFoQztBQUNBLFVBQU0sVUFBVSxFQUFFLGFBQUYsQ0FBZ0IsT0FBaEM7QUFDQSxVQUFJLFNBQVMsRUFBYjs7QUFFQSxXQUFLLE1BQUwsQ0FBWSxPQUFaLENBQW9CLFVBQUMsS0FBRCxFQUFXO0FBQzdCLFlBQUksQ0FBQyxNQUFNLE1BQU4sQ0FBYSxRQUFsQixFQUE0QjtBQUFFO0FBQVM7QUFDdkMsWUFBTSxlQUFlLE1BQU0sR0FBTixDQUFVLHFCQUFWLEVBQXJCOztBQUVBLFlBQ0UsVUFBVSxhQUFhLElBQXZCLElBQStCLFVBQVUsYUFBYSxLQUF0RCxJQUNBLFVBQVUsYUFBYSxHQUR2QixJQUM4QixVQUFVLGFBQWEsTUFGdkQsRUFHRTtBQUNBLGlCQUFPLElBQVAsQ0FBWSxLQUFaO0FBQ0Q7QUFDRixPQVZEOztBQVlBLGFBQU8sTUFBUDtBQUNEOztBQUVEOzs7Ozs7OztpQ0FLYSxDLEVBQUc7QUFDZCxVQUFNLFlBQWEsRUFBRSxNQUFGLEtBQWEsU0FBZCxHQUEyQixLQUFLLFlBQUwsQ0FBa0IsQ0FBbEIsQ0FBM0IsR0FBa0QsSUFBcEU7QUFDQTtBQUNBLFdBQUssSUFBTCxDQUFVLE9BQVYsRUFBbUIsQ0FBbkIsRUFBc0IsU0FBdEI7QUFDQTtBQUNBLFVBQUksS0FBSyxNQUFULEVBQ0UsS0FBSyxNQUFMLENBQVksV0FBWixDQUF3QixDQUF4QixFQUEyQixTQUEzQjtBQUNIOztBQUVEOzs7Ozs7Ozs7O0FBMENBOzs7Ozs7Ozt3QkFRSSxLLEVBQXVCO0FBQUEsVUFBaEIsT0FBZ0IsdUVBQU4sSUFBTTs7QUFDekIsVUFBSSxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLEtBQWhCLENBQUosRUFDRSxNQUFNLElBQUksS0FBSixDQUFVLHFDQUFWLENBQU47O0FBRUYsV0FBSyxnQkFBTCxDQUFzQixLQUF0QixFQUE2QixPQUE3QjtBQUNBLFlBQU0sU0FBTixDQUFnQixLQUFLLFdBQXJCOztBQUVBLFdBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsS0FBaEI7QUFDQSxXQUFLLGlCQUFMLENBQXVCLEtBQUssWUFBNUIsRUFBMEMsTUFBTSxHQUFoRDtBQUNEOztBQUVEOzs7Ozs7Ozs7MkJBTU8sSyxFQUFPO0FBQ1o7QUFDQSxVQUFNLE1BQU0sTUFBTSxHQUFsQjtBQUNBLFVBQU0sZUFBZSxLQUFLLG1CQUFMLENBQXlCLEdBQXpCLENBQTZCLEdBQTdCLENBQXJCOztBQUVBLFVBQUksWUFBSixFQUNFLGFBQWEsT0FBYixDQUFxQjtBQUFBLGVBQWUsWUFBWSxPQUFaLEVBQWY7QUFBQSxPQUFyQjs7QUFFRixZQUFNLE9BQU47QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Z0NBV1ksRyxFQUF3QztBQUFBLFVBQW5DLFdBQW1DLHVFQUFyQixHQUFxQjtBQUFBLFVBQWhCLE9BQWdCLHVFQUFOLElBQU07O0FBQ2xELFVBQU0sUUFBUSxvQkFBVSxHQUFWLEVBQWUsV0FBZixDQUFkO0FBQ0E7QUFDQSxXQUFLLEdBQUwsQ0FBUyxLQUFULEVBQWdCLE9BQWhCO0FBQ0EsWUFBTSxNQUFOO0FBQ0EsWUFBTSxNQUFOOztBQUVBLGFBQU8sS0FBUDtBQUNEOztBQUVEOzs7Ozs7cUNBR2lCLEssRUFBTyxPLEVBQVM7QUFDL0IsVUFBSSxZQUFZLElBQWhCLEVBQXNCO0FBQ3BCLFlBQUksS0FBSyxVQUFMLENBQWdCLE9BQWhCLE1BQTZCLFNBQWpDLEVBQTRDO0FBQzFDLGdCQUFNLElBQUksS0FBSixnQkFBdUIsT0FBdkIsdUJBQU47QUFDRDs7QUFFRCxhQUFLLFVBQUwsQ0FBZ0IsT0FBaEIsSUFBMkIsS0FBM0I7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs2QkFjUyxLLEVBQU8sYyxFQUFxRDtBQUFBLFVBQXJDLE9BQXFDLHVFQUEzQixTQUEyQjtBQUFBLFVBQWhCLE1BQWdCLHVFQUFQLEtBQU87O0FBQ25FLFVBQUksUUFBUSxjQUFaOztBQUVBLFVBQUksT0FBTyxjQUFQLEtBQTBCLFFBQTlCLEVBQXdDO0FBQ3RDLGdCQUFRLEtBQUssWUFBTCxDQUFrQixjQUFsQixDQUFSO0FBQ0Q7O0FBRUQ7QUFDQSxVQUFJLENBQUMsTUFBTSxXQUFYLEVBQXdCO0FBQ3RCLFlBQU0sY0FBYyxTQUNsQixLQUFLLFdBRGEsR0FDQywrQkFBcUIsS0FBSyxXQUExQixDQURyQjs7QUFHQSxjQUFNLGNBQU4sQ0FBcUIsV0FBckI7QUFDRDs7QUFFRDtBQUNBLFlBQU0sR0FBTixDQUFVLEtBQVY7O0FBRUEsVUFBSSxDQUFDLEtBQUssY0FBTCxDQUFvQixPQUFwQixDQUFMLEVBQW1DO0FBQ2pDLGFBQUssY0FBTCxDQUFvQixPQUFwQixJQUErQixFQUEvQjtBQUNEOztBQUVELFdBQUssY0FBTCxDQUFvQixPQUFwQixFQUE2QixJQUE3QixDQUFrQyxLQUFsQzs7QUFFQSxZQUFNLE1BQU47QUFDQSxZQUFNLE1BQU47QUFDRDs7QUFFRDs7Ozs7Ozs7O2dDQU1ZLEssRUFBTztBQUNqQixXQUFLLE1BQUwsQ0FBWSxPQUFaLENBQW9CLFVBQVMsS0FBVCxFQUFnQjtBQUNsQyxZQUFNLFFBQVEsTUFBTSxNQUFOLENBQWEsT0FBYixDQUFxQixLQUFyQixDQUFkO0FBQ0EsWUFBSSxVQUFVLENBQUMsQ0FBZixFQUFrQjtBQUFFLGdCQUFNLE1BQU4sQ0FBYSxLQUFiO0FBQXNCO0FBQzNDLE9BSEQ7O0FBS0E7QUFDQSxXQUFLLElBQUksT0FBVCxJQUFvQixLQUFLLGNBQXpCLEVBQXlDO0FBQ3ZDLFlBQU0sUUFBUSxLQUFLLGNBQUwsQ0FBb0IsT0FBcEIsQ0FBZDtBQUNBLFlBQU0sUUFBUSxNQUFNLE9BQU4sQ0FBYyxLQUFkLENBQWQ7O0FBRUEsWUFBSSxVQUFVLENBQUMsQ0FBZixFQUFrQjtBQUFFLGdCQUFNLE1BQU4sQ0FBYSxLQUFiLEVBQW9CLENBQXBCO0FBQXlCOztBQUU3QyxZQUFJLENBQUMsTUFBTSxNQUFYLEVBQW1CO0FBQ2pCLGlCQUFPLEtBQUssY0FBTCxDQUFvQixPQUFwQixDQUFQO0FBQ0Q7QUFDRjtBQUNGOztBQUVEOzs7Ozs7Ozs7aUNBTWEsTyxFQUFTO0FBQ3BCLGFBQU8sS0FBSyxVQUFMLENBQWdCLE9BQWhCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7OzJDQU11QixHLEVBQUs7QUFDMUIsVUFBSSxPQUFPLElBQVg7QUFDQSxVQUFJLFFBQVEsSUFBWjtBQUNBO0FBQ0EsU0FBRztBQUNELFlBQUksSUFBSSxTQUFKLENBQWMsUUFBZCxDQUF1QixPQUF2QixDQUFKLEVBQXFDO0FBQ25DLGlCQUFPLEdBQVA7QUFDRDtBQUNELGNBQU0sSUFBSSxVQUFWO0FBQ0QsT0FMRCxRQUtTLFNBQVMsSUFMbEI7QUFNQTtBQUNBLFdBQUssTUFBTCxDQUFZLE9BQVosQ0FBb0IsVUFBUyxNQUFULEVBQWlCO0FBQ25DLFlBQUksT0FBTyxJQUFQLEtBQWdCLElBQXBCLEVBQTBCO0FBQUUsa0JBQVEsTUFBUjtBQUFpQjtBQUM5QyxPQUZEOztBQUlBLGFBQU8sS0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7cUNBTWlCLE8sRUFBUztBQUN4QixhQUFPLEtBQUssY0FBTCxDQUFvQixPQUFwQixDQUFQO0FBQ0Q7Ozt3QkExWlk7QUFDWCxhQUFPLEtBQUssV0FBTCxDQUFpQixNQUF4QjtBQUNEOztBQUVEOzs7Ozs7c0JBS1csSyxFQUFPO0FBQ2hCLFdBQUssV0FBTCxDQUFpQixNQUFqQixHQUEwQixLQUExQjtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLVztBQUNULGFBQU8sS0FBSyxXQUFMLENBQWlCLElBQXhCO0FBQ0Q7O0FBRUQ7Ozs7OztzQkFLUyxLLEVBQU87QUFDZCxXQUFLLFdBQUwsQ0FBaUIsSUFBakIsR0FBd0IsS0FBeEI7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBS3NCO0FBQ3BCLGFBQU8sS0FBSyxXQUFMLENBQWlCLGVBQXhCO0FBQ0Q7O0FBRUQ7Ozs7OztzQkFLb0IsSyxFQUFPO0FBQ3pCLFdBQUssV0FBTCxDQUFpQixlQUFqQixHQUFtQyxLQUFuQztBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLbUI7QUFDakIsYUFBTyxLQUFLLFdBQUwsQ0FBaUIsWUFBeEI7QUFDRDs7QUFFRDs7Ozs7O3NCQUtpQixLLEVBQU87QUFDdEIsV0FBSyxXQUFMLENBQWlCLFlBQWpCLEdBQWdDLEtBQWhDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUtrQjtBQUNoQixhQUFPLEtBQUssV0FBTCxDQUFpQixXQUF4QjtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLc0I7QUFDcEIsYUFBTyxLQUFLLFdBQUwsQ0FBaUIsZUFBeEI7QUFDRDs7QUFFRDs7Ozs7Ozs7OztzQkFPNEIsSSxFQUFNO0FBQ2hDLFdBQUssV0FBTCxDQUFpQix1QkFBakIsR0FBMkMsSUFBM0M7QUFDRDs7QUFFRDs7Ozs7O3dCQUs4QjtBQUM1QixhQUFPLEtBQUssV0FBTCxDQUFpQix1QkFBeEI7QUFDRDs7QUFFRDs7Ozs7Ozs7O3dCQU1vQjtBQUNsQixhQUFPLEtBQUssY0FBWjtBQUNEOzs7c0JBaUZTLEssRUFBTztBQUNmLFVBQUksS0FBSyxNQUFULEVBQ0UsS0FBSyxNQUFMLENBQVksSUFBWjs7QUFFRixXQUFLLE1BQUwsR0FBYyxLQUFkOztBQUVBLFVBQUksS0FBSyxNQUFULEVBQ0UsS0FBSyxNQUFMLENBQVksS0FBWjtBQUNIOztBQUVEOzs7Ozs7d0JBS1k7QUFDVixhQUFPLEtBQUssTUFBWjtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLYTtBQUNYLGFBQU8sS0FBSyxPQUFaO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUthO0FBQ1gsYUFBTyxLQUFLLE9BQUwsQ0FBYSxNQUFwQjtBQUNEOzs7RUF0UW9CLGlCQUFPLFk7O2tCQThiZixROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuZWY7Ozs7OztBQUdBOzs7OztJQUtxQixlO0FBQ25CLDJCQUFZLFFBQVosRUFBc0I7QUFBQTs7QUFDcEIsU0FBSyxTQUFMLEdBQWlCLFFBQWpCO0FBQ0EsU0FBSyxPQUFMLEdBQWUsbUJBQWY7QUFDRDs7QUFFRDtBQUNBOzs7Ozt5Q0FDd0M7QUFBQSxVQUFyQixZQUFxQix1RUFBTixJQUFNOztBQUN0QyxVQUFJLFNBQVMsSUFBYjs7QUFFQSxVQUFJLE9BQU8sWUFBUCxLQUF3QixRQUE1QixFQUFzQztBQUNwQyxpQkFBUyxLQUFLLFNBQUwsQ0FBZSxhQUFmLENBQTZCLFlBQTdCLENBQVQ7QUFDRCxPQUZELE1BRU8sSUFBSSx1Q0FBSixFQUFtQztBQUN4QyxpQkFBUyxDQUFDLFlBQUQsQ0FBVDtBQUNELE9BRk0sTUFFQTtBQUNMLGlCQUFTLEtBQUssTUFBZDtBQUNEOztBQUVELGFBQU8sTUFBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7QUFvQkE7Ozs7Ozt3QkFNSSxLLEVBQU87QUFDVCxhQUFPLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsS0FBakIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLSSxLLEVBQU87QUFDVCxXQUFLLE9BQUwsQ0FBYSxHQUFiLENBQWlCLEtBQWpCO0FBQ0Q7O0FBRUQ7Ozs7MkJBQ08sSyxFQUFPLENBQUU7Ozs0QkFFUixRLEVBQVU7QUFDaEIsV0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixRQUFyQjtBQUNEOztBQUVEOzs7Ozs7NkJBR1M7QUFDUCxXQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCO0FBQUEsZUFBUyxNQUFNLE1BQU4sRUFBVDtBQUFBLE9BQXJCO0FBQ0EsV0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixRQUFwQjtBQUNEOztBQUVEOzs7Ozs7Ozs7OzsyQkFRTyxZLEVBQWM7QUFDbkIsVUFBTSxTQUFTLEtBQUssa0JBQUwsQ0FBd0IsWUFBeEIsQ0FBZjtBQUNBLFdBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUI7QUFBQSxlQUFTLE1BQU0sTUFBTixDQUFhLE1BQWIsQ0FBVDtBQUFBLE9BQXJCO0FBQ0EsV0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixRQUFwQixFQUE4QixNQUE5QjtBQUNEOztBQUVEOzs7Ozs7O3NDQUlnQixxQkFBdUI7QUFDckMsV0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQjtBQUFBLGVBQVMsTUFBTSxlQUFOLEVBQVQ7QUFBQSxPQUFyQjtBQUNBLFdBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsbUJBQXBCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7aUNBT2EsWSxFQUFjO0FBQ3pCLFVBQU0sU0FBUyxLQUFLLGtCQUFMLENBQXdCLFlBQXhCLENBQWY7QUFDQSxXQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCO0FBQUEsZUFBUyxNQUFNLFlBQU4sQ0FBbUIsTUFBbkIsQ0FBVDtBQUFBLE9BQXJCO0FBQ0EsV0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixlQUFwQixFQUFxQyxNQUFyQztBQUNEOzs7c0JBcEZVLEssRUFBTztBQUNoQixXQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFVBQUMsS0FBRDtBQUFBLGVBQVcsTUFBTSxNQUFOLEdBQWUsS0FBMUI7QUFBQSxPQUFyQjtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLYTtBQUNYLFVBQUksU0FBUyxFQUFiO0FBQ0EsV0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQjtBQUFBLGVBQVMsU0FBUyxPQUFPLE1BQVAsQ0FBYyxNQUFNLE1BQXBCLENBQWxCO0FBQUEsT0FBckI7O0FBRUEsYUFBTyxNQUFQO0FBQ0Q7Ozs7O2tCQXhDa0IsZTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNSckI7Ozs7OztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBOENxQixLO0FBQ25COzs7O0FBSUEsaUJBQVksR0FBWixFQUErQjtBQUFBLFFBQWQsTUFBYyx1RUFBTCxHQUFLO0FBQUE7O0FBQzdCLFNBQUssT0FBTCxHQUFlLE1BQWY7O0FBRUE7Ozs7QUFJQSxTQUFLLEdBQUwsR0FBVyxHQUFYO0FBQ0E7Ozs7QUFJQSxTQUFLLGFBQUwsR0FBcUIsSUFBckI7QUFDQTtBQUNBLFNBQUssT0FBTCxHQUFlLElBQWY7QUFDQTtBQUNBLFNBQUssT0FBTCxHQUFlLElBQWY7QUFDQTtBQUNBLFNBQUssSUFBTCxHQUFZLElBQVo7QUFDQTtBQUNBLFNBQUssV0FBTCxHQUFtQixJQUFuQjs7QUFFQTs7OztBQUlBLFNBQUssTUFBTCxHQUFjLEVBQWQ7QUFDQTs7OztBQUlBLFNBQUssZ0JBQUwsR0FBd0IsSUFBeEI7O0FBRUEsU0FBSyxnQkFBTDtBQUNEOztBQUVEOzs7Ozs7Ozs7OztBQXFCQTs7Ozs7Ozs4QkFPVSxnQixFQUFrQjtBQUMxQixXQUFLLGdCQUFMLEdBQXdCLGdCQUF4QjtBQUNEOztBQUVEOzs7Ozs7OEJBR1U7QUFBQTs7QUFDUjtBQUNBLFdBQUssR0FBTCxDQUFTLFdBQVQsQ0FBcUIsS0FBSyxJQUExQjtBQUNBLFdBQUssTUFBTCxDQUFZLE9BQVosQ0FBb0I7QUFBQSxlQUFTLE1BQUssT0FBTCxDQUFhLFdBQWIsQ0FBeUIsTUFBTSxHQUEvQixDQUFUO0FBQUEsT0FBcEI7QUFDQTtBQUNBLFdBQUssR0FBTCxHQUFXLElBQVg7QUFDQSxXQUFLLGdCQUFMLEdBQXdCLElBQXhCO0FBQ0EsV0FBSyxNQUFMLENBQVksTUFBWixHQUFxQixDQUFyQjtBQUNEOztBQUVEOzs7Ozs7dUNBR21CO0FBQ2pCLFVBQU0sT0FBTyxTQUFTLGVBQVQsc0JBQTZCLEtBQTdCLENBQWI7QUFDQSxXQUFLLGNBQUwsQ0FBb0IsSUFBcEIsRUFBMEIsaUJBQTFCLEVBQTZDLGVBQTdDO0FBQ0EsV0FBSyxjQUFMLENBQW9CLElBQXBCLEVBQTBCLFFBQTFCLEVBQW9DLEtBQUssTUFBekM7QUFDQSxXQUFLLFlBQUwsQ0FBa0IsYUFBbEIsRUFBaUMsOEJBQWpDO0FBQ0EsV0FBSyxTQUFMLENBQWUsR0FBZixDQUFtQixPQUFuQjs7QUFFQSxVQUFNLGNBQWMsU0FBUyxlQUFULHNCQUE2QixNQUE3QixDQUFwQjtBQUNBLGtCQUFZLGNBQVosQ0FBMkIsSUFBM0IsRUFBaUMsUUFBakMsRUFBMkMsTUFBM0M7QUFDQSxrQkFBWSxjQUFaLENBQTJCLElBQTNCLEVBQWlDLE9BQWpDLEVBQTBDLE1BQTFDO0FBQ0Esa0JBQVksS0FBWixDQUFrQixXQUFsQixHQUFnQyxDQUFoQztBQUNBOztBQUVBLFVBQU0sUUFBUSxTQUFTLGVBQVQsc0JBQTZCLE1BQTdCLENBQWQ7O0FBRUEsVUFBTSxlQUFlLFNBQVMsZUFBVCxzQkFBNkIsR0FBN0IsQ0FBckI7QUFDQSxtQkFBYSxTQUFiLENBQXVCLEdBQXZCLENBQTJCLFFBQTNCOztBQUVBLFVBQU0sZUFBZSxTQUFTLGVBQVQsc0JBQTZCLEdBQTdCLENBQXJCO0FBQ0EsbUJBQWEsU0FBYixDQUF1QixHQUF2QixDQUEyQixRQUEzQjs7QUFFQSxVQUFNLHFCQUFxQixTQUFTLGVBQVQsc0JBQTZCLEdBQTdCLENBQTNCO0FBQ0EseUJBQW1CLFNBQW5CLENBQTZCLEdBQTdCLENBQWlDLGNBQWpDOztBQUVBLG1CQUFhLFdBQWIsQ0FBeUIsWUFBekI7QUFDQSxXQUFLLFdBQUwsQ0FBaUIsS0FBakI7QUFDQSxXQUFLLFdBQUwsQ0FBaUIsV0FBakI7QUFDQSxXQUFLLFdBQUwsQ0FBaUIsWUFBakI7QUFDQSxXQUFLLFdBQUwsQ0FBaUIsa0JBQWpCO0FBQ0EsV0FBSyxHQUFMLENBQVMsV0FBVCxDQUFxQixJQUFyQjtBQUNBO0FBQ0EsV0FBSyxHQUFMLENBQVMsS0FBVCxDQUFlLFFBQWYsR0FBMEIsQ0FBMUI7QUFDQTtBQUNBLFdBQUssR0FBTCxDQUFTLEtBQVQsQ0FBZSxTQUFmLEdBQTJCLGVBQTNCOztBQUVBLFdBQUssT0FBTCxHQUFlLFlBQWY7QUFDQSxXQUFLLE9BQUwsR0FBZSxZQUFmO0FBQ0EsV0FBSyxhQUFMLEdBQXFCLGtCQUFyQjtBQUNBLFdBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxXQUFLLFdBQUwsR0FBbUIsV0FBbkI7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBS0ksSyxFQUFPO0FBQ1QsV0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixLQUFqQjtBQUNBO0FBQ0EsV0FBSyxPQUFMLENBQWEsV0FBYixDQUF5QixNQUFNLEdBQS9CO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzJCQUtPLEssRUFBTztBQUNaLFdBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsS0FBSyxNQUFMLENBQVksT0FBWixDQUFvQixLQUFwQixDQUFuQixFQUErQyxDQUEvQztBQUNBO0FBQ0EsV0FBSyxPQUFMLENBQWEsV0FBYixDQUF5QixNQUFNLEdBQS9CO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzsrQkFNVyxHLEVBQUs7QUFDZCxTQUFHO0FBQ0QsWUFBSSxRQUFRLEtBQUssR0FBakIsRUFBc0I7QUFDcEIsaUJBQU8sSUFBUDtBQUNEOztBQUVELGNBQU0sSUFBSSxVQUFWO0FBQ0QsT0FORCxRQU1TLFFBQVEsSUFOakI7O0FBUUEsYUFBTyxLQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs2QkFHUztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUNQLHdEQUFrQixJQUFsQiw0R0FBd0I7QUFBQSxjQUFmLEtBQWU7QUFBRSxnQkFBTSxNQUFOO0FBQWlCO0FBRHBDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFUjs7QUFFRDs7Ozs7Ozs7NkJBS3NCO0FBQUEsVUFBZixNQUFlLHVFQUFOLElBQU07O0FBQ3BCLFdBQUssZUFBTDtBQUNBLFdBQUssWUFBTCxDQUFrQixNQUFsQjtBQUNEOztBQUVEOzs7Ozs7c0NBR2tCO0FBQ2hCLFVBQU0sT0FBTyxLQUFLLElBQWxCO0FBQ0EsVUFBTSxVQUFVLEtBQUssT0FBckI7QUFDQTtBQUNBLFVBQU0sbUJBQW1CLEtBQUssZ0JBQTlCO0FBQ0EsVUFBTSxTQUFTLEtBQUssTUFBcEI7QUFDQSxVQUFNLFFBQVEsS0FBSyxLQUFMLENBQVcsaUJBQWlCLFlBQTVCLENBQWQ7QUFDQSxVQUFNLFVBQVUsS0FBSyxLQUFMLENBQVcsaUJBQWlCLFdBQWpCLENBQTZCLGlCQUFpQixNQUE5QyxDQUFYLENBQWhCO0FBQ0EsVUFBTSwyQkFBeUIsT0FBekIsU0FBTjs7QUFFQSxXQUFLLGNBQUwsQ0FBb0IsSUFBcEIsRUFBMEIsUUFBMUIsRUFBb0MsTUFBcEM7QUFDQSxXQUFLLGNBQUwsQ0FBb0IsSUFBcEIsRUFBMEIsT0FBMUIsRUFBbUMsS0FBbkM7QUFDQSxXQUFLLGNBQUwsQ0FBb0IsSUFBcEIsRUFBMEIsU0FBMUIsV0FBNEMsS0FBNUMsU0FBcUQsTUFBckQ7O0FBRUEsY0FBUSxjQUFSLENBQXVCLElBQXZCLEVBQTZCLFdBQTdCLEVBQTBDLFNBQTFDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O21DQUs0QjtBQUFBOztBQUFBLFVBQWYsTUFBZSx1RUFBTixJQUFNOztBQUMxQixlQUFVLFdBQVcsSUFBWixHQUFvQixLQUFLLE1BQXpCLEdBQWtDLE1BQTNDOztBQUVBLGFBQU8sT0FBUCxDQUFlLFVBQUMsS0FBRCxFQUFXO0FBQ3hCLFlBQUksT0FBSyxNQUFMLENBQVksT0FBWixDQUFvQixLQUFwQixNQUErQixDQUFDLENBQXBDLEVBQXVDO0FBQUU7QUFBUztBQUNsRCxjQUFNLE1BQU47QUFDRCxPQUhEO0FBSUQ7O0FBRUQ7Ozs7Ozs7Ozs7O3VFQUlTLEtBQUssTTs7Ozs7Ozs7Ozs7d0JBcExEO0FBQ1gsYUFBTyxLQUFLLE9BQVo7QUFDRDs7QUFFRDs7Ozs7O3NCQUtXLEssRUFBTztBQUFBOztBQUNoQixVQUFNLGFBQWEsS0FBSyxPQUF4QjtBQUNBLFdBQUssT0FBTCxHQUFlLEtBQWY7O0FBRUEsV0FBSyxNQUFMLENBQVksT0FBWixDQUFvQjtBQUFBLGVBQVMsTUFBTSxZQUFOLENBQW1CLFVBQW5CLEVBQStCLE9BQUssT0FBcEMsQ0FBVDtBQUFBLE9BQXBCO0FBQ0Q7Ozs7O2tCQTVEa0IsSzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pEckI7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQTs7Ozs7SUFLcUIsb0I7OztBQUNuQjs7Ozs7QUFLQSxnQ0FBWSxJQUFaLEVBQWdDO0FBQUEsUUFBZCxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFBQSxrS0FDeEIsWUFEd0IsRUFDVixJQURVLEVBQ0osT0FESTs7QUFHOUIsVUFBSyxjQUFMLDRCQUFxQztBQUNuQyxxQkFBZTtBQURvQixLQUFyQzs7QUFJQSxVQUFLLFdBQUwsQ0FBaUIsOEJBQWpCO0FBUDhCO0FBUS9COzs7OztrQkFka0Isb0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVnJCOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBR0E7Ozs7O0lBS3FCLHFCOzs7QUFDbkI7Ozs7OztBQU1BLGlDQUFZLElBQVosRUFBZ0Q7QUFBQSxRQUE5QixPQUE4Qix1RUFBcEIsRUFBb0I7QUFBQSxRQUFoQixTQUFnQix1RUFBSixFQUFJO0FBQUE7O0FBQUEsb0tBQ3hDLFlBRHdDLEVBQzFCLElBRDBCLEVBQ3BCLE9BRG9COztBQUc5QyxjQUFVLHNCQUFjO0FBQ3RCLHVCQUFpQixJQURLO0FBRXRCLGVBQVMsR0FGYTtBQUd0QixxQkFBZTtBQUhPLEtBQWQsRUFJUCxPQUpPLENBQVY7O0FBTUEsVUFBSyxjQUFMLDZCQUFzQyxTQUF0QyxFQUFpRDtBQUMvQyx1QkFBaUIsUUFBUSxlQURzQjtBQUUvQyxlQUFTLFFBQVE7QUFGOEIsS0FBakQ7O0FBS0EsVUFBSyxXQUFMLENBQWlCLCtCQUFqQjtBQWQ4QztBQWUvQzs7Ozs7a0JBdEJrQixxQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1ZyQjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBR0E7Ozs7O0lBS3FCLGU7OztBQUNuQjs7Ozs7O0FBTUEsMkJBQVksSUFBWixFQUFnRDtBQUFBLFFBQTlCLE9BQThCLHVFQUFwQixFQUFvQjtBQUFBLFFBQWhCLFNBQWdCLHVFQUFKLEVBQUk7QUFBQTs7QUFBQSx3SkFDeEMsWUFEd0MsRUFDMUIsSUFEMEIsRUFDcEIsT0FEb0I7O0FBRzlDLFFBQU0sUUFBUSxRQUFRLEtBQXRCO0FBQ0EsUUFBSSxxQkFBcUIsRUFBekI7O0FBRUEsUUFBSSxLQUFKLEVBQVc7QUFDVCxnQkFBVSxLQUFWLEdBQWtCLFlBQVc7QUFBRSxlQUFPLEtBQVA7QUFBZSxPQUE5QztBQUNBLHlCQUFtQixLQUFuQixHQUEyQixLQUEzQjtBQUNEOztBQUVELFVBQUssb0JBQUwsaUJBQWdDLFNBQWhDLEVBQTJDLGtCQUEzQztBQUNBLFVBQUssY0FBTCxnQkFBeUIsU0FBekIsRUFBb0MsRUFBcEM7QUFDQSxVQUFLLFdBQUwsQ0FBaUIsa0NBQWpCO0FBYjhDO0FBYy9DOzs7OztrQkFyQmtCLGU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1hyQjs7OztBQUNBOzs7Ozs7QUFHQTs7Ozs7SUFLcUIsVzs7O0FBQ25COzs7QUFHQSx5QkFBMEI7QUFBQSxRQUFkLE9BQWMsdUVBQUosRUFBSTtBQUFBOztBQUN4QixRQUFNLFdBQVc7QUFDZixhQUFPLEtBRFE7QUFFZixnQkFBVSxLQUZLLENBRUU7QUFGRixLQUFqQjs7QUFLQSxRQUFNLE9BQU8sRUFBRSxpQkFBaUIsQ0FBbkIsRUFBYjs7QUFFQSxjQUFVLHNCQUFjLFFBQWQsRUFBd0IsT0FBeEIsQ0FBVjs7QUFSd0IsZ0pBU2xCLFFBVGtCLEVBU1IsSUFUUSxFQVNGLE9BVEU7O0FBV3hCLFVBQUssY0FBTCxtQkFBNEIsRUFBRSxHQUFHLFdBQUMsQ0FBRDtBQUFBLGVBQU8sRUFBRSxlQUFUO0FBQUEsT0FBTCxFQUE1QixFQUE2RDtBQUMzRCxhQUFPLFFBQVE7QUFENEMsS0FBN0Q7QUFYd0I7QUFjekI7Ozs7c0JBRW1CLEssRUFBTztBQUN6QixXQUFLLElBQUwsQ0FBVSxDQUFWLEVBQWEsZUFBYixHQUErQixLQUEvQjtBQUNELEs7d0JBRXFCO0FBQ3BCLGFBQU8sS0FBSyxJQUFMLENBQVUsQ0FBVixFQUFhLGVBQXBCO0FBQ0Q7Ozs7O2tCQTFCa0IsVzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNUckI7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQTs7Ozs7SUFLcUIsYTs7O0FBQ25COzs7QUFHQSx5QkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQ25CLGNBQVUsc0JBQWM7QUFDdEIsYUFBTyxXQURlO0FBRXRCLFdBQUssRUFGaUI7QUFHdEIsaUJBQVc7QUFIVyxLQUFkLEVBSVAsT0FKTyxDQUFWOztBQURtQixvSkFPYixpQ0FBa0IsUUFBUSxHQUExQixFQUErQixRQUFRLFNBQXZDLENBUGEsRUFPc0MsT0FQdEM7O0FBU25CLFVBQUssY0FBTCxrQkFBMkIsRUFBM0IsRUFBK0I7QUFDN0IsYUFBTyxRQUFRO0FBRGMsS0FBL0I7QUFUbUI7QUFZcEI7Ozs7O2tCQWhCa0IsYTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWckI7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQTs7Ozs7SUFLcUIsVzs7O0FBQ25COzs7Ozs7QUFNQSx1QkFBWSxJQUFaLEVBQWdEO0FBQUEsUUFBOUIsT0FBOEIsdUVBQXBCLEVBQW9CO0FBQUEsUUFBaEIsU0FBZ0IsdUVBQUosRUFBSTtBQUFBOztBQUFBLGdKQUN4QyxZQUR3QyxFQUMxQixJQUQwQixFQUNwQixPQURvQjs7QUFHOUMsY0FBVSxzQkFBYyxFQUFFLGlCQUFpQixJQUFuQixFQUFkLEVBQXlDLE9BQXpDLENBQVY7QUFDQSxRQUFNLFFBQVEsUUFBUSxLQUF0QjtBQUNBLFFBQUksS0FBSixFQUFXO0FBQ1QsZ0JBQVUsS0FBVixHQUFrQixZQUFXO0FBQUUsZUFBTyxLQUFQO0FBQWUsT0FBOUM7QUFDRDs7QUFFRCxVQUFLLGNBQUwsbUJBQTRCLFNBQTVCLEVBQXVDO0FBQ3JDLHVCQUFpQixRQUFRLGVBRFk7QUFFckMsZUFBUyxRQUFRO0FBRm9CLEtBQXZDOztBQUtBLFVBQUssV0FBTCxDQUFpQiw4QkFBakI7QUFkOEM7QUFlL0M7Ozs7O2tCQXRCa0IsVzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWckI7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQTs7Ozs7SUFLcUIsWTs7O0FBQ25COzs7Ozs7QUFNQSx3QkFBWSxJQUFaLEVBQWdEO0FBQUEsUUFBOUIsT0FBOEIsdUVBQXBCLEVBQW9CO0FBQUEsUUFBaEIsU0FBZ0IsdUVBQUosRUFBSTtBQUFBOztBQUFBLGtKQUN4QyxZQUR3QyxFQUMxQixJQUQwQixFQUNwQixPQURvQjs7QUFHOUMsY0FBVSxzQkFBYztBQUN0Qix1QkFBaUIsSUFESztBQUV0QixlQUFTO0FBRmEsS0FBZCxFQUdQLE9BSE8sQ0FBVjs7QUFLQSxVQUFLLGNBQUwsb0JBQTZCLFNBQTdCLEVBQXdDO0FBQ3RDLHVCQUFpQixRQUFRLGVBRGE7QUFFdEMsZUFBUyxRQUFRO0FBRnFCLEtBQXhDOztBQUtBLFVBQUssV0FBTCxDQUFpQiwrQkFBakI7QUFiOEM7QUFjL0M7Ozs7O2tCQXJCa0IsWTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWckI7Ozs7QUFDQTs7Ozs7O0FBR0E7Ozs7SUFJcUIsUzs7O0FBQ25COzs7Ozs7QUFNQSxxQkFBWSxJQUFaLEVBQWtCLE9BQWxCLEVBQTJCLFNBQTNCLEVBQXNDO0FBQUE7O0FBQ3BDLGNBQVUsc0JBQWMsRUFBZCxFQUVQLE9BRk8sQ0FBVjs7QUFEb0MsNElBSzlCLFFBTDhCLEVBS3BCLElBTG9CLEVBS2QsT0FMYzs7QUFPcEMsUUFBTSxTQUFTLFFBQVEsS0FBUixHQUFnQixFQUFFLE9BQU8sUUFBUSxLQUFqQixFQUFoQixHQUEyQyxTQUExRDtBQUNBLFVBQUssY0FBTCxrQkFBMkIsU0FBM0IsRUFBc0MsTUFBdEM7QUFSb0M7QUFTckM7Ozs7O2tCQWhCa0IsUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNSckI7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQTs7Ozs7SUFLcUIsYTs7O0FBQ25COzs7QUFHQSx5QkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQ25CLGNBQVUsc0JBQWMsRUFBRSxPQUFPLFdBQVQsRUFBZCxFQUFzQyxPQUF0QyxDQUFWOztBQURtQixvSkFFYixrQ0FGYSxFQUVRLE9BRlI7O0FBSW5CLFVBQUssY0FBTCxrQkFBMkIsRUFBM0IsRUFBK0I7QUFDN0IsYUFBTyxRQUFRO0FBRGMsS0FBL0I7QUFKbUI7QUFPcEI7Ozs7O2tCQVhrQixhOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1ZyQjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBR0E7Ozs7O0lBS3FCLFU7OztBQUNuQjs7Ozs7O0FBTUEsc0JBQVksSUFBWixFQUFnRDtBQUFBLFFBQTlCLE9BQThCLHVFQUFwQixFQUFvQjtBQUFBLFFBQWhCLFNBQWdCLHVFQUFKLEVBQUk7QUFBQTs7QUFDOUMsY0FBVSxzQkFBYyxFQUFFLGFBQWEsSUFBZixFQUFkLEVBQXFDLE9BQXJDLENBQVY7O0FBRDhDLDhJQUV4QyxRQUFRLFdBQVIsR0FBc0IsWUFBdEIsR0FBcUMsUUFGRyxFQUVPLElBRlAsRUFFYSxPQUZiOztBQUk5QyxRQUFNLGVBQWUsRUFBckI7QUFDQSxRQUFJLFFBQVEsU0FBUixLQUFzQixTQUExQixFQUFxQztBQUFFLG1CQUFhLFNBQWIsR0FBeUIsUUFBUSxTQUFqQztBQUE2QztBQUNwRixRQUFJLFFBQVEsVUFBUixLQUF1QixTQUEzQixFQUFzQztBQUFFLG1CQUFhLFVBQWIsR0FBMEIsUUFBUSxVQUFsQztBQUErQztBQUN2RixRQUFJLFFBQVEsV0FBUixLQUF3QixTQUE1QixFQUF1QztBQUFFLG1CQUFhLFdBQWIsR0FBMkIsUUFBUSxXQUFuQztBQUFpRDs7QUFFMUYsUUFBSSxRQUFRLFdBQVosRUFBeUI7QUFDdkIsWUFBSyxvQkFBTCxzQkFBcUMsU0FBckMsRUFBZ0QsWUFBaEQ7QUFDQSxZQUFLLGNBQUwsc0JBQStCLFNBQS9CLEVBQTBDLFlBQTFDO0FBQ0QsS0FIRCxNQUdPO0FBQ0wsWUFBSyxjQUFMLHNCQUErQixTQUEvQixFQUEwQyxZQUExQztBQUNEOztBQUVELFVBQUssV0FBTCxDQUFpQiw2QkFBakI7QUFoQjhDO0FBaUIvQzs7Ozs7a0JBeEJrQixVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1hyQjs7OztBQUNBOzs7Ozs7QUFHQSxJQUFNLFdBQVc7QUFDZixXQUFTLENBQUMsQ0FBQyxDQUFGLEVBQUssQ0FBTCxDQURNO0FBRWYsV0FBUyxDQUZNO0FBR2YsU0FBTyxXQUhRO0FBSWYscUJBQW1CO0FBSkosQ0FBakI7O0FBT0E7Ozs7OztJQUtxQixhOzs7QUFDbkI7Ozs7QUFJQSx5QkFBWSxNQUFaLEVBQW9CLE9BQXBCLEVBQTZCO0FBQUE7O0FBQzNCLGNBQVUsc0JBQWMsRUFBZCxFQUFrQixRQUFsQixFQUE0QixPQUE1QixDQUFWOztBQUQyQixvSkFHckIsUUFIcUIsRUFHWCxPQUFPLGNBQVAsQ0FBc0IsUUFBUSxPQUE5QixDQUhXLEVBRzZCLE9BSDdCOztBQUszQixVQUFLLGNBQUwscUJBQThCLEVBQTlCLEVBQWtDO0FBQ2hDLGtCQUFZLE9BQU8sVUFEYTtBQUVoQyxhQUFPLFFBQVEsS0FGaUI7QUFHaEMseUJBQW1CLFFBQVE7QUFISyxLQUFsQztBQUwyQjtBQVU1Qjs7Ozs7a0JBZmtCLGE7Ozs7Ozs7Ozs7QUNmckI7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFHQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUdBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUdBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBR0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUdBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFHQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFHQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQVJBO0FBMURBO0FBb0VPLElBQU0sc0JBQU87QUFDbEIsOENBRGtCLEVBQ0Esc0JBREEsRUFDTyw4QkFEUDtBQUVsQixvREFGa0IsRUFFRyw0QkFGSCxFQUVhLDBDQUZiLEVBRThCO0FBRjlCLENBQWI7O0FBTFA7OztBQWxCQTs7O0FBVkE7OztBQU5BOzs7QUFSQTs7O0FBWkE7QUFnRU8sSUFBTSwwQkFBUztBQUNwQixnQ0FEb0IsRUFDVCx3QkFEUyxFQUNELGtCQURDLEVBQ0ksb0JBREosRUFDVSx3QkFEVixFQUNrQiwwQkFEbEI7QUFFcEIsd0JBRm9CLEVBRWIsOEJBRmEsRUFFRiw4QkFGRSxFQUVTO0FBRlQsQ0FBZjs7QUFLQSxJQUFNLGdDQUFZO0FBQ3ZCLHNDQUR1QixFQUNULGdEQURTLEVBQ1csd0NBRFgsRUFDMkIsMENBRDNCO0FBRXZCLG9EQUZ1QixFQUVGO0FBRkUsQ0FBbEI7O0FBS0EsSUFBTSxzQ0FBZSxFQUFFLGtDQUFGLEVBQWUsNEJBQWYsRUFBeUIsMEJBQXpCLEVBQWtDLDhCQUFsQyxFQUFyQjs7QUFFQSxJQUFNLDBCQUFTO0FBQ3BCLGdDQURvQixFQUNULDBDQURTLEVBQ1Esd0NBRFIsRUFDd0IsOENBRHhCO0FBRXBCLG9EQUZvQixFQUVDLG9DQUZELEVBRWUsd0NBRmYsRUFFK0I7QUFGL0IsQ0FBZjs7QUFLQSxJQUFNLDRCQUFVO0FBQ3JCLHNEQURxQixFQUNDLHNEQURELEVBQ3dCLDBDQUR4QjtBQUVyQixvQ0FGcUIsRUFFUixzQ0FGUSxFQUVPLGtDQUZQLEVBRW9CLG9DQUZwQixFQUVrQyw4QkFGbEM7QUFHckIsd0NBSHFCLEVBR04sZ0NBSE0sRUFHTTtBQUhOLENBQWhCOztBQU1BLElBQU0sc0JBQU87QUFDbEIsZ0NBRGtCLEVBQ1AsOENBRE8sRUFDWTtBQURaLENBQWI7O0FBSUEsSUFBTSx3QkFBUTtBQUNuQiwwQkFEbUIsRUFDWCx3Q0FEVyxFQUNLO0FBREwsQ0FBZDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwR1A7Ozs7OztBQUdBOzs7O0lBSXFCLFc7OztBQUNuQix1QkFBWSxHQUFaLEVBQWlCO0FBQUE7O0FBRWY7Ozs7QUFGZTs7QUFNZixVQUFLLEdBQUwsR0FBVyxHQUFYO0FBTmU7QUFPaEI7Ozs7OEJBRVM7QUFDUixXQUFLLFlBQUw7QUFDRDs7O2dDQUVXLEksRUFBTSxDLEVBQUcsQ0FBRTs7O2lDQUVWLENBQUU7OzttQ0FFQSxDQUFFOzs7RUFsQnNCLGlCQUFPLFk7O2tCQUEzQixXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1ByQjs7OztBQUNBOzs7Ozs7QUFHQTs7Ozs7SUFLcUIsUTs7O0FBQ25COzs7QUFHQSxvQkFBWSxHQUFaLEVBQWlCO0FBQUE7O0FBRWY7Ozs7QUFGZSwwSUFDVCxHQURTOztBQU1mLFVBQUssVUFBTCxHQUFrQixVQUFsQjs7QUFFQSxVQUFLLFVBQUwsR0FBa0IsTUFBSyxVQUFMLENBQWdCLElBQWhCLE9BQWxCO0FBQ0EsVUFBSyxRQUFMLEdBQWdCLE1BQUssUUFBTCxDQUFjLElBQWQsT0FBaEI7O0FBRUEsVUFBSyxVQUFMO0FBWGU7QUFZaEI7Ozs7Z0NBRVcsSSxFQUFNLEMsRUFBRztBQUNuQixVQUFNLFFBQVEsd0JBQWMsS0FBSyxVQUFuQixFQUErQixJQUEvQixFQUFxQyxDQUFyQyxDQUFkOztBQUVBLFlBQU0sUUFBTixHQUFpQixFQUFFLFFBQW5CO0FBQ0EsWUFBTSxPQUFOLEdBQWdCLEVBQUUsT0FBbEI7QUFDQSxZQUFNLE1BQU4sR0FBZSxFQUFFLE1BQWpCO0FBQ0EsWUFBTSxPQUFOLEdBQWdCLEVBQUUsT0FBbEI7QUFDQSxZQUFNLEtBQU4sR0FBYyxFQUFFLEtBQWhCO0FBQ0EsWUFBTSxJQUFOLEdBQWEsT0FBTyxZQUFQLENBQW9CLEVBQUUsS0FBdEIsQ0FBYjs7QUFFQSxhQUFPLEtBQVA7QUFDRDs7O2lDQUVZO0FBQ1gsV0FBSyxHQUFMLENBQVMsZ0JBQVQsQ0FBMEIsU0FBMUIsRUFBcUMsS0FBSyxVQUExQyxFQUFzRCxLQUF0RDtBQUNBLFdBQUssR0FBTCxDQUFTLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DLEtBQUssUUFBeEMsRUFBa0QsS0FBbEQ7QUFDRDs7O21DQUVjO0FBQ2IsV0FBSyxHQUFMLENBQVMsbUJBQVQsQ0FBNkIsU0FBN0IsRUFBd0MsS0FBSyxVQUE3QyxFQUF5RCxLQUF6RDtBQUNBLFdBQUssR0FBTCxDQUFTLG1CQUFULENBQTZCLE9BQTdCLEVBQXNDLEtBQUssUUFBM0MsRUFBcUQsS0FBckQ7QUFDRDs7OytCQUVVLEMsRUFBRztBQUNaLFVBQUksUUFBUSxLQUFLLFdBQUwsQ0FBaUIsU0FBakIsRUFBNEIsQ0FBNUIsQ0FBWjtBQUNBLFdBQUssSUFBTCxDQUFVLE9BQVYsRUFBbUIsS0FBbkI7QUFDRDs7OzZCQUVRLEMsRUFBRztBQUNWLFVBQUksUUFBUSxLQUFLLFdBQUwsQ0FBaUIsT0FBakIsRUFBMEIsQ0FBMUIsQ0FBWjtBQUNBLFdBQUssSUFBTCxDQUFVLE9BQVYsRUFBbUIsS0FBbkI7QUFDRDs7Ozs7a0JBakRrQixROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1RyQjs7OztBQUNBOzs7Ozs7QUFHQTs7Ozs7SUFLTSxPOzs7QUFDSjs7OztBQUlBLG1CQUFZLEdBQVosRUFBaUI7QUFBQTs7QUFHZjs7OztBQUhlLHdJQUNULEdBRFM7O0FBT2YsVUFBSyxVQUFMLEdBQWtCLFNBQWxCO0FBQ0EsVUFBSyxlQUFMLEdBQXVCLElBQXZCO0FBQ0EsVUFBSyxVQUFMLEdBQWtCLElBQWxCOztBQUVBLFVBQUssWUFBTCxHQUFvQixNQUFLLFlBQUwsQ0FBa0IsSUFBbEIsT0FBcEI7QUFDQSxVQUFLLFlBQUwsR0FBb0IsTUFBSyxZQUFMLENBQWtCLElBQWxCLE9BQXBCO0FBQ0EsVUFBSyxVQUFMLEdBQWtCLE1BQUssVUFBTCxDQUFnQixJQUFoQixPQUFsQjtBQUNBLFVBQUssUUFBTCxHQUFnQixNQUFLLFFBQUwsQ0FBYyxJQUFkLE9BQWhCO0FBQ0EsVUFBSyxXQUFMLEdBQW1CLE1BQUssV0FBTCxDQUFpQixJQUFqQixPQUFuQjtBQUNBLFVBQUssWUFBTCxHQUFvQixNQUFLLFlBQUwsQ0FBa0IsSUFBbEIsT0FBcEI7QUFDQSxVQUFLLFdBQUwsR0FBbUIsTUFBSyxXQUFMLENBQWlCLElBQWpCLE9BQW5COztBQUVBLFVBQUssVUFBTDtBQW5CZTtBQW9CaEI7O0FBRUQ7Ozs7Ozs7Z0NBR1ksSSxFQUFNLEMsRUFBRztBQUNuQixVQUFNLFFBQVEsd0JBQWMsS0FBSyxVQUFuQixFQUErQixJQUEvQixFQUFxQyxDQUFyQyxDQUFkOztBQUVBLFVBQU0sTUFBTSxLQUFLLG9CQUFMLENBQTBCLENBQTFCLENBQVo7QUFDQSxZQUFNLENBQU4sR0FBVSxJQUFJLENBQWQ7QUFDQSxZQUFNLENBQU4sR0FBVSxJQUFJLENBQWQ7O0FBRUEsYUFBTyxLQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7O2lDQVFhO0FBQ1g7QUFDQSxXQUFLLEdBQUwsQ0FBUyxnQkFBVCxDQUEwQixXQUExQixFQUF1QyxLQUFLLFlBQTVDLEVBQTBELEtBQTFEO0FBQ0EsV0FBSyxHQUFMLENBQVMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsS0FBSyxRQUF4QyxFQUFrRCxLQUFsRDtBQUNBLFdBQUssR0FBTCxDQUFTLGdCQUFULENBQTBCLFVBQTFCLEVBQXNDLEtBQUssV0FBM0MsRUFBd0QsS0FBeEQ7QUFDQSxXQUFLLEdBQUwsQ0FBUyxnQkFBVCxDQUEwQixXQUExQixFQUF1QyxLQUFLLFlBQTVDLEVBQTBELEtBQTFEO0FBQ0EsV0FBSyxHQUFMLENBQVMsZ0JBQVQsQ0FBMEIsVUFBMUIsRUFBc0MsS0FBSyxXQUEzQyxFQUF3RCxLQUF4RDtBQUNEOzs7bUNBRWM7QUFDYjtBQUNBLFdBQUssR0FBTCxDQUFTLG1CQUFULENBQTZCLFdBQTdCLEVBQTBDLEtBQUssWUFBL0MsRUFBNkQsS0FBN0Q7QUFDQSxXQUFLLEdBQUwsQ0FBUyxtQkFBVCxDQUE2QixPQUE3QixFQUFzQyxLQUFLLFFBQTNDLEVBQXFELEtBQXJEO0FBQ0EsV0FBSyxHQUFMLENBQVMsbUJBQVQsQ0FBNkIsVUFBN0IsRUFBeUMsS0FBSyxXQUE5QyxFQUEyRCxLQUEzRDtBQUNBLFdBQUssR0FBTCxDQUFTLG1CQUFULENBQTZCLFdBQTdCLEVBQTBDLEtBQUssWUFBL0MsRUFBNkQsS0FBN0Q7QUFDQSxXQUFLLEdBQUwsQ0FBUyxtQkFBVCxDQUE2QixVQUE3QixFQUF5QyxLQUFLLFdBQTlDLEVBQTJELEtBQTNEOztBQUVBLGFBQU8sbUJBQVAsQ0FBMkIsV0FBM0IsRUFBd0MsS0FBSyxZQUE3QztBQUNBLGFBQU8sbUJBQVAsQ0FBMkIsU0FBM0IsRUFBc0MsS0FBSyxVQUEzQztBQUNEOztBQUVEOzs7Ozs7Ozs7O3lDQU9xQixDLEVBQUc7QUFDdEI7QUFDQSxVQUFJLElBQUksQ0FBUjtBQUNBLFVBQUksSUFBSSxDQUFSO0FBQ0EsVUFBTSxhQUFhLEtBQUssR0FBTCxDQUFTLHFCQUFULEVBQW5CO0FBQ0EsVUFBTSxhQUFhLFNBQVMsSUFBVCxDQUFjLFVBQWQsR0FBMkIsU0FBUyxlQUFULENBQXlCLFVBQXZFO0FBQ0EsVUFBTSxZQUFhLFNBQVMsSUFBVCxDQUFjLFNBQWQsR0FBMEIsU0FBUyxlQUFULENBQXlCLFNBQXRFOztBQUVBO0FBQ0EsVUFBSSxFQUFFLEtBQUYsSUFBVyxFQUFFLEtBQWpCLEVBQXdCO0FBQ3RCLFlBQUksRUFBRSxLQUFOO0FBQ0EsWUFBSSxFQUFFLEtBQU47QUFDRCxPQUhELE1BR08sSUFBSSxFQUFFLE9BQUYsSUFBYSxFQUFFLE9BQW5CLEVBQTRCO0FBQ2pDO0FBQ0EsWUFBSSxFQUFFLE9BQUYsR0FBWSxVQUFoQjtBQUNBLFlBQUksRUFBRSxPQUFGLEdBQVksU0FBaEI7QUFDRDs7QUFFRDtBQUNBLFVBQUksS0FBSyxXQUFXLElBQVgsR0FBa0IsVUFBdkIsQ0FBSjtBQUNBLFVBQUksS0FBSyxXQUFXLEdBQVgsR0FBa0IsU0FBdkIsQ0FBSjs7QUFFQSxhQUFPLEVBQUUsSUFBRixFQUFLLElBQUwsRUFBUDtBQUNEOzs7Z0NBRVcsQyxFQUFHLGMsRUFBZ0IsUyxFQUFXO0FBQ3hDLFVBQUksQ0FBQyxjQUFELElBQW1CLENBQUMsU0FBeEIsRUFBbUM7QUFBRTtBQUFTO0FBQzlDLFFBQUUsRUFBRixHQUFPLEVBQUUsQ0FBRixHQUFNLFVBQVUsQ0FBdkI7QUFDQSxRQUFFLEVBQUYsR0FBTyxFQUFFLENBQUYsR0FBTSxVQUFVLENBQXZCOztBQUVBLFVBQU0sT0FBTyxlQUFlLENBQWYsR0FBbUIsRUFBRSxDQUFyQixHQUF5QixlQUFlLENBQXhDLEdBQTRDLEVBQUUsQ0FBM0Q7QUFDQSxVQUFNLE1BQU8sZUFBZSxDQUFmLEdBQW1CLEVBQUUsQ0FBckIsR0FBeUIsZUFBZSxDQUF4QyxHQUE0QyxFQUFFLENBQTNEO0FBQ0EsVUFBTSxRQUFTLEtBQUssR0FBTCxDQUFTLEtBQUssS0FBTCxDQUFXLEVBQUUsQ0FBRixHQUFNLGVBQWUsQ0FBaEMsQ0FBVCxDQUFmO0FBQ0EsVUFBTSxTQUFTLEtBQUssR0FBTCxDQUFTLEtBQUssS0FBTCxDQUFXLEVBQUUsQ0FBRixHQUFNLGVBQWUsQ0FBaEMsQ0FBVCxDQUFmOztBQUVBLFFBQUUsSUFBRixHQUFTLEVBQUUsVUFBRixFQUFRLFFBQVIsRUFBYSxZQUFiLEVBQW9CLGNBQXBCLEVBQVQ7QUFDRDs7O2lDQUVZLEMsRUFBRztBQUNkO0FBQ0EsYUFBTyxZQUFQLEdBQXNCLGVBQXRCO0FBQ0EsVUFBTSxRQUFRLEtBQUssV0FBTCxDQUFpQixXQUFqQixFQUE4QixDQUE5QixDQUFkOztBQUdBLFdBQUssZUFBTCxHQUF1QixLQUF2QjtBQUNBLFdBQUssVUFBTCxHQUFrQixLQUFsQjtBQUNBO0FBQ0EsYUFBTyxnQkFBUCxDQUF3QixXQUF4QixFQUFxQyxLQUFLLFlBQTFDLEVBQXdELEtBQXhEO0FBQ0EsYUFBTyxnQkFBUCxDQUF3QixTQUF4QixFQUFtQyxLQUFLLFVBQXhDLEVBQW9ELEtBQXBEOztBQUVBLFdBQUssSUFBTCxDQUFVLE9BQVYsRUFBbUIsS0FBbkI7QUFDRDs7O2lDQUVZLEMsRUFBRztBQUNkLFVBQUksUUFBUSxLQUFLLFdBQUwsQ0FBaUIsV0FBakIsRUFBOEIsQ0FBOUIsQ0FBWjtBQUNBLFdBQUssV0FBTCxDQUFpQixLQUFqQixFQUF3QixLQUFLLGVBQTdCLEVBQThDLEtBQUssVUFBbkQ7QUFDQTtBQUNBLFdBQUssVUFBTCxHQUFrQixLQUFsQjs7QUFFQSxXQUFLLElBQUwsQ0FBVSxPQUFWLEVBQW1CLEtBQW5CO0FBQ0Q7OzsrQkFFVSxDLEVBQUc7QUFDWixVQUFJLFFBQVEsS0FBSyxXQUFMLENBQWlCLFNBQWpCLEVBQTRCLENBQTVCLENBQVo7QUFDQSxXQUFLLFdBQUwsQ0FBaUIsS0FBakIsRUFBd0IsS0FBSyxlQUE3QixFQUE4QyxLQUFLLFVBQW5EOztBQUdBLFdBQUssZUFBTCxHQUF1QixJQUF2QjtBQUNBLFdBQUssVUFBTCxHQUFrQixJQUFsQjtBQUNBO0FBQ0EsYUFBTyxtQkFBUCxDQUEyQixXQUEzQixFQUF3QyxLQUFLLFlBQTdDO0FBQ0EsYUFBTyxtQkFBUCxDQUEyQixTQUEzQixFQUFzQyxLQUFLLFVBQTNDOztBQUVBLFdBQUssSUFBTCxDQUFVLE9BQVYsRUFBbUIsS0FBbkI7QUFDRDs7OzZCQUVRLEMsRUFBRztBQUNWLFVBQUksUUFBUSxLQUFLLFdBQUwsQ0FBaUIsT0FBakIsRUFBMEIsQ0FBMUIsQ0FBWjtBQUNBLFdBQUssSUFBTCxDQUFVLE9BQVYsRUFBbUIsS0FBbkI7QUFDRDs7O2dDQUVXLEMsRUFBRztBQUNiLFVBQUksUUFBUSxLQUFLLFdBQUwsQ0FBaUIsVUFBakIsRUFBNkIsQ0FBN0IsQ0FBWjtBQUNBLFdBQUssSUFBTCxDQUFVLE9BQVYsRUFBbUIsS0FBbkI7QUFDRDs7O2lDQUVZLEMsRUFBRztBQUNkLFVBQUksUUFBUSxLQUFLLFdBQUwsQ0FBaUIsV0FBakIsRUFBOEIsQ0FBOUIsQ0FBWjtBQUNBLFdBQUssSUFBTCxDQUFVLE9BQVYsRUFBbUIsS0FBbkI7QUFDRDs7O2dDQUVXLEMsRUFBRztBQUNiLFVBQUksUUFBUSxLQUFLLFdBQUwsQ0FBaUIsVUFBakIsRUFBNkIsQ0FBN0IsQ0FBWjtBQUNBLFdBQUssSUFBTCxDQUFVLE9BQVYsRUFBbUIsS0FBbkI7QUFDRDs7Ozs7a0JBR1ksTzs7Ozs7Ozs7Ozs7Ozs7O0FDdExmOzs7O0lBSXFCLFM7QUFDbkI7Ozs7O0FBS0EsbUJBQVksTUFBWixFQUFvQixJQUFwQixFQUEwQixhQUExQixFQUF5QztBQUFBOztBQUN2QyxPQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0EsT0FBSyxJQUFMLEdBQVksSUFBWjtBQUNBLE9BQUssYUFBTCxHQUFxQixhQUFyQjs7QUFFQSxPQUFLLE1BQUwsR0FBYyxjQUFjLE1BQTVCO0FBQ0EsT0FBSyxhQUFMLEdBQXFCLGNBQWMsYUFBbkM7QUFDRCxDOztrQkFia0IsUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSnJCOzs7Ozs7QUFHQTs7Ozs7SUFLcUIsZTs7Ozs7Ozs7OzttQ0FDSjtBQUFFLGFBQU8sa0JBQVA7QUFBNEI7Ozt1Q0FFMUI7QUFDakIsVUFBSSwrSkFBSjtBQUNBLFdBQUssSUFBTCxHQUFZLFNBQVo7QUFDQSxhQUFPLElBQVA7QUFDRDs7OzJCQUVNLGdCLEVBQWtCO0FBQ3ZCLFdBQUssR0FBTCxrSkFBd0IsZ0JBQXhCO0FBQ0EsVUFBTSxTQUFTLGlCQUFpQixNQUFoQzs7QUFFQSxXQUFLLE1BQUwsR0FBYyxTQUFTLGVBQVQsQ0FBeUIsS0FBSyxFQUE5QixFQUFrQyxNQUFsQyxDQUFkO0FBQ0EsV0FBSyxNQUFMLENBQVksY0FBWixDQUEyQixJQUEzQixFQUFpQyxHQUFqQyxFQUFzQyxDQUF0QztBQUNBLFdBQUssTUFBTCxDQUFZLGNBQVosQ0FBMkIsSUFBM0IsRUFBaUMsR0FBakMsRUFBc0MsQ0FBdEM7QUFDQSxXQUFLLE1BQUwsQ0FBWSxjQUFaLENBQTJCLElBQTNCLEVBQWlDLFdBQWpDLDhCQUF3RSxNQUF4RTtBQUNBLFdBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsUUFBbEIsR0FBNkIsTUFBN0I7QUFDQSxXQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLFVBQWxCLEdBQStCLFdBQS9CO0FBQ0EsV0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixLQUFsQixHQUEwQixTQUExQjtBQUNBLFdBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsYUFBbEIsR0FBa0MsTUFBbEM7QUFDQSxXQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLGdCQUFsQixHQUFxQyxNQUFyQztBQUNBLFdBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsVUFBbEIsR0FBK0IsTUFBL0I7O0FBRUEsV0FBSyxHQUFMLENBQVMsV0FBVCxDQUFxQixLQUFLLE1BQTFCOztBQUVBLGFBQU8sS0FBSyxHQUFaO0FBQ0Q7OzsyQkFFTSxnQixFQUFrQixLLEVBQU87QUFDOUIscUpBQWEsZ0JBQWIsRUFBK0IsS0FBL0I7O0FBRUEsVUFBSSxLQUFLLE1BQUwsQ0FBWSxVQUFoQixFQUE0QjtBQUMxQixhQUFLLE1BQUwsQ0FBWSxXQUFaLENBQXdCLEtBQUssTUFBTCxDQUFZLFVBQXBDO0FBQ0Q7O0FBRUQsVUFBTSxRQUFRLFNBQVMsY0FBVCxDQUF3QixLQUFLLElBQUwsQ0FBVSxLQUFWLENBQXhCLENBQWQ7QUFDQSxXQUFLLE1BQUwsQ0FBWSxXQUFaLENBQXdCLEtBQXhCO0FBQ0Q7Ozs7O2tCQXRDa0IsZTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDUnJCOzs7Ozs7QUFHQTs7Ozs7SUFLcUIsZ0I7Ozs7Ozs7Ozs7bUNBQ0o7QUFBRSxhQUFPLG1CQUFQO0FBQTZCOzs7dUNBRTNCO0FBQ2pCLFVBQUksaUtBQUo7QUFDQSxXQUFLLElBQUwsR0FBWSxTQUFaO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7OzsyQkFFTSxnQixFQUFrQjtBQUN2QixXQUFLLEdBQUwsb0pBQXdCLGdCQUF4QjtBQUNBLFVBQU0sU0FBUyxpQkFBaUIsTUFBaEM7O0FBRUEsV0FBSyxNQUFMLEdBQWMsU0FBUyxlQUFULENBQXlCLEtBQUssRUFBOUIsRUFBa0MsTUFBbEMsQ0FBZDtBQUNBLFdBQUssTUFBTCxDQUFZLGNBQVosQ0FBMkIsSUFBM0IsRUFBaUMsR0FBakMsRUFBc0MsQ0FBdEM7QUFDQSxXQUFLLE1BQUwsQ0FBWSxjQUFaLENBQTJCLElBQTNCLEVBQWlDLEdBQWpDLEVBQXNDLEVBQXRDO0FBQ0EsV0FBSyxNQUFMLENBQVksY0FBWixDQUEyQixJQUEzQixFQUFpQyxXQUFqQyw4QkFBd0UsTUFBeEU7QUFDQSxXQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLFFBQWxCLEdBQTZCLE1BQTdCO0FBQ0EsV0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixVQUFsQixHQUErQixXQUEvQjtBQUNBLFdBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsS0FBbEIsR0FBMEIsU0FBMUI7QUFDQSxXQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLGFBQWxCLEdBQWtDLE1BQWxDO0FBQ0EsV0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixnQkFBbEIsR0FBcUMsTUFBckM7QUFDQSxXQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLFVBQWxCLEdBQStCLE1BQS9COztBQUVBLFdBQUssR0FBTCxDQUFTLFdBQVQsQ0FBcUIsS0FBSyxNQUExQjs7QUFFQSxhQUFPLEtBQUssR0FBWjtBQUNEOzs7MkJBRU0sZ0IsRUFBa0IsSyxFQUFPO0FBQzlCLHVKQUFhLGdCQUFiLEVBQStCLEtBQS9COztBQUVBLFVBQUksS0FBSyxNQUFMLENBQVksVUFBaEIsRUFBNEI7QUFDMUIsYUFBSyxNQUFMLENBQVksV0FBWixDQUF3QixLQUFLLE1BQUwsQ0FBWSxVQUFwQztBQUNEOztBQUVELFVBQU0sUUFBUSxTQUFTLGNBQVQsQ0FBd0IsS0FBSyxJQUFMLENBQVUsS0FBVixDQUF4QixDQUFkO0FBQ0EsV0FBSyxNQUFMLENBQVksV0FBWixDQUF3QixLQUF4QjtBQUNEOzs7OztrQkF0Q2tCLGdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNSckI7Ozs7OztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWdDcUIsUztBQUNuQjs7O0FBR0EsdUJBQTBCO0FBQUEsUUFBZCxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFDeEI7QUFDQSxTQUFLLEdBQUwsR0FBVyxJQUFYO0FBQ0E7QUFDQSxTQUFLLEVBQUw7QUFDQTtBQUNBLFNBQUssTUFBTCxHQUFjLHNCQUFjLEVBQWQsRUFBa0IsS0FBSyxZQUFMLEVBQWxCLEVBQXVDLE9BQXZDLENBQWQ7QUFDQTtBQUNBLFFBQU0sWUFBWSxLQUFLLGdCQUFMLEVBQWxCO0FBQ0EsU0FBSyxnQkFBTCxDQUFzQixTQUF0QjtBQUNBLFNBQUssb0JBQUwsQ0FBMEIsU0FBMUI7QUFDRDs7QUFFRDs7Ozs7Ozs4QkFHVTtBQUNSO0FBQ0EsV0FBSyxHQUFMLEdBQVcsSUFBWDtBQUNEOztBQUVEOzs7Ozs7Ozs7O21DQU9lO0FBQUUsYUFBTyxPQUFQO0FBQWlCOztBQUVsQzs7Ozs7QUFLQTs7QUFFQTs7Ozs7Ozs7bUNBS2U7QUFDYixhQUFPLEVBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7dUNBUW1CO0FBQUUsYUFBTyxFQUFQO0FBQVk7O0FBR2pDOzs7Ozs7Ozs7NEJBTVEsUyxFQUFXO0FBQ2pCLFdBQUssSUFBSSxHQUFULElBQWdCLFNBQWhCLEVBQTJCO0FBQUUsYUFBSyxHQUFMLElBQVksVUFBVSxHQUFWLENBQVo7QUFBNkI7QUFDM0Q7O0FBRUQ7Ozs7Ozs7cUNBSWlCLFMsRUFBVztBQUMxQixXQUFLLFVBQUwsR0FBa0IsRUFBbEI7QUFDQTtBQUNBLFVBQU0sUUFBUSw4QkFBc0IsSUFBdEIsQ0FBZDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUFZLFNBQVosRUFBdUIsT0FBdkIsQ0FBK0IsVUFBQyxJQUFELEVBQVU7QUFDdkMsWUFBSSxNQUFNLGNBQU4sQ0FBcUIsSUFBckIsQ0FBSixFQUFnQztBQUFFO0FBQVM7O0FBRTNDLHNDQUFzQixLQUF0QixFQUE2QixJQUE3QixFQUFtQztBQUNqQyxlQUFLLGVBQVc7QUFBRSxtQkFBTyxLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBUDtBQUErQixXQURoQjtBQUVqQyxlQUFLLGFBQVMsSUFBVCxFQUFlO0FBQ2xCLGlCQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsSUFBd0IsSUFBeEI7QUFDRDtBQUpnQyxTQUFuQztBQU1ELE9BVEQ7QUFVRDs7QUFFRDs7Ozs7O3lDQUdxQixTLEVBQVc7QUFBQTs7QUFDOUIsMEJBQVksU0FBWixFQUF1QixPQUF2QixDQUErQixVQUFDLElBQUQsRUFBVTtBQUN2QyxZQUFNLGVBQWUsVUFBVSxJQUFWLENBQXJCO0FBQ0EsWUFBSSxXQUFXLFNBQVgsUUFBVyxDQUFTLENBQVQsRUFBc0I7QUFBQSxjQUFWLENBQVUsdUVBQU4sSUFBTTs7QUFDbkMsY0FBSSxNQUFNLElBQVYsRUFBZ0I7QUFBRSxtQkFBTyxFQUFFLElBQUYsS0FBVyxZQUFsQjtBQUFpQztBQUNuRCxZQUFFLElBQUYsSUFBVSxDQUFWO0FBQ0QsU0FIRDtBQUlBO0FBQ0EsY0FBSyxJQUFMLElBQWEsUUFBYjtBQUNELE9BUkQ7QUFTRDs7QUFFRDs7Ozs7Ozs7Ozs7MkJBUU8sZ0IsRUFBa0IsQ0FBRTs7QUFFM0I7Ozs7Ozs7Ozs7MkJBT08sZ0IsRUFBa0IsSyxFQUFPLENBQUU7O0FBRWxDOzs7Ozs7Ozs7Ozs7Ozs7OzJCQWFPLGdCLEVBQWtCLEssRUFBTyxFLEVBQUksRSxFQUFJLEUsRUFBSSxFLEVBQUksQ0FBRTs7Ozs7a0JBN0kvQixTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25DckI7Ozs7QUFDQTs7Ozs7O0FBR0E7Ozs7O0lBS00sTTs7Ozs7Ozs7OzttQ0FDVztBQUFFLGFBQU8sUUFBUDtBQUFrQjs7O3VDQUVoQjtBQUNqQixhQUFPLEVBQUUsR0FBRyxDQUFMLEVBQVA7QUFDRDs7O21DQUVjO0FBQ2IsYUFBTztBQUNMLGVBQU8sU0FERjtBQUVMLGlCQUFTO0FBRkosT0FBUDtBQUlEOzs7MkJBRU0sZ0IsRUFBa0I7QUFDdkIsV0FBSyxHQUFMLEdBQVcsU0FBUyxlQUFULHNCQUE2QixNQUE3QixDQUFYO0FBQ0EsV0FBSyxHQUFMLENBQVMsY0FBVCxDQUF3QixJQUF4QixFQUE4QixHQUE5QixFQUFtQyxDQUFuQztBQUNBLFdBQUssR0FBTCxDQUFTLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsSUFBOUIsRUFBb0MsQ0FBcEM7QUFDQSxXQUFLLEdBQUwsQ0FBUyxjQUFULENBQXdCLElBQXhCLEVBQThCLGlCQUE5QixFQUFpRCxZQUFqRDtBQUNBLFdBQUssR0FBTCxDQUFTLEtBQVQsQ0FBZSxNQUFmLEdBQXdCLEtBQUssTUFBTCxDQUFZLEtBQXBDOztBQUVBLGFBQU8sS0FBSyxHQUFaO0FBQ0Q7OzsyQkFFTSxnQixFQUFrQixLLEVBQU87QUFDOUIsVUFBTSxTQUFTLGlCQUFpQixXQUFqQixDQUE2QixLQUFLLENBQUwsQ0FBTyxLQUFQLENBQTdCLENBQWY7QUFDQSxVQUFNLElBQUksS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFWOztBQUVBLFdBQUssR0FBTCxDQUFTLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsV0FBOUIsaUJBQXdELENBQXhEO0FBQ0EsV0FBSyxHQUFMLENBQVMsY0FBVCxDQUF3QixJQUF4QixFQUE4QixJQUE5QixFQUFvQyxpQkFBaUIsTUFBckQ7QUFDRDs7QUFFRDs7Ozs7Ozs2QkFJUztBQUFFLGFBQU8sS0FBUDtBQUFlOzs7OztrQkFHYixNOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hEZjs7Ozs7O0FBR0E7Ozs7O0lBS3FCLEc7Ozs7Ozs7Ozs7bUNBQ0o7QUFBRSxhQUFPLEtBQVA7QUFBZTs7QUFFaEM7Ozs7dUNBQ21CO0FBQ2pCLGFBQU8sRUFBRSxJQUFJLENBQU4sRUFBUyxJQUFJLENBQWIsRUFBZ0IsR0FBRyxDQUFuQixFQUFzQixPQUFPLFNBQTdCLEVBQVA7QUFDRDs7OzZCQUVRO0FBQ1AsVUFBSSxLQUFLLEdBQVQsRUFBYztBQUFFLGVBQU8sS0FBSyxHQUFaO0FBQWtCOztBQUVsQyxXQUFLLEdBQUwsR0FBVyxTQUFTLGVBQVQsQ0FBeUIsS0FBSyxFQUE5QixFQUFrQyxRQUFsQyxDQUFYOztBQUVBLGFBQU8sS0FBSyxHQUFaO0FBQ0Q7OzsyQkFFTSxnQixFQUFrQixLLEVBQU87QUFDOUIsVUFBTSxLQUFLLGlCQUFpQixXQUFqQixDQUE2QixLQUFLLEVBQUwsQ0FBUSxLQUFSLENBQTdCLENBQVg7QUFDQSxVQUFNLEtBQUssaUJBQWlCLFlBQWpCLENBQThCLEtBQUssRUFBTCxDQUFRLEtBQVIsQ0FBOUIsQ0FBWDtBQUNBLFVBQU0sSUFBSyxLQUFLLENBQUwsQ0FBTyxLQUFQLENBQVg7QUFDQSxVQUFNLFFBQVEsS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFkOztBQUVBLFdBQUssR0FBTCxDQUFTLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsV0FBOUIsaUJBQXdELEVBQXhELFVBQStELEVBQS9EO0FBQ0EsV0FBSyxHQUFMLENBQVMsY0FBVCxDQUF3QixJQUF4QixFQUE4QixHQUE5QixFQUFtQyxDQUFuQztBQUNBLFdBQUssR0FBTCxDQUFTLEtBQVQsQ0FBZSxJQUFmLEdBQXNCLEtBQXRCO0FBQ0Q7O0FBRUQ7Ozs7MkJBQ08sZ0IsRUFBa0IsSyxFQUFPLEUsRUFBSSxFLEVBQUksRSxFQUFJLEUsRUFBSTtBQUM5QyxVQUFNLEtBQUssaUJBQWlCLFdBQWpCLENBQTZCLEtBQUssRUFBTCxDQUFRLEtBQVIsQ0FBN0IsQ0FBWDtBQUNBLFVBQU0sS0FBSyxpQkFBaUIsWUFBakIsQ0FBOEIsS0FBSyxFQUFMLENBQVEsS0FBUixDQUE5QixDQUFYOztBQUVBLFVBQUssS0FBSyxFQUFMLElBQVcsS0FBSyxFQUFqQixJQUF5QixLQUFLLEVBQUwsSUFBVyxLQUFLLEVBQTdDLEVBQWtEO0FBQ2hELGVBQU8sSUFBUDtBQUNEOztBQUVELGFBQU8sS0FBUDtBQUNEOzs7OztrQkFyQ2tCLEc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDUnJCOzs7Ozs7QUFHQTs7Ozs7O0lBTU0sSTs7Ozs7Ozs7OzttQ0FDVztBQUFFLGFBQU8sTUFBUDtBQUFnQjs7O3VDQUVkO0FBQ2pCLGFBQU8sRUFBRSxJQUFJLENBQU4sRUFBUyxJQUFJLENBQWIsRUFBUDtBQUNEOzs7bUNBRWM7QUFDYixhQUFPLEVBQUUsT0FBTyxTQUFULEVBQVA7QUFDRDs7OzJCQUVNLGdCLEVBQWtCO0FBQ3ZCLFVBQUksS0FBSyxHQUFULEVBQWM7QUFBRSxlQUFPLEtBQUssR0FBWjtBQUFrQjs7QUFFbEMsV0FBSyxHQUFMLEdBQVcsU0FBUyxlQUFULENBQXlCLEtBQUssRUFBOUIsRUFBa0MsTUFBbEMsQ0FBWDtBQUNBO0FBQ0EsYUFBTyxLQUFLLEdBQVo7QUFDRDs7OzJCQUVNLGdCLEVBQWtCLEksRUFBTTtBQUFBOztBQUM3QixhQUFPLEtBQUssS0FBTCxDQUFXLENBQVgsQ0FBUDtBQUNBLFdBQUssSUFBTCxDQUFVLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSxlQUFVLE9BQUssRUFBTCxDQUFRLENBQVIsSUFBYSxPQUFLLEVBQUwsQ0FBUSxDQUFSLENBQWIsR0FBMEIsQ0FBQyxDQUEzQixHQUErQixDQUF6QztBQUFBLE9BQVY7O0FBRUEsVUFBSSxPQUFPLEdBQVg7QUFDQSxVQUFNLFNBQVMsS0FBSyxNQUFwQjs7QUFFQSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBcEIsRUFBNEIsR0FBNUIsRUFBaUM7QUFDL0IsWUFBTSxJQUFJLGlCQUFpQixXQUFqQixDQUE2QixLQUFLLEVBQUwsQ0FBUSxLQUFSLENBQTdCLENBQVY7QUFDQSxZQUFNLElBQUksaUJBQWlCLFlBQWpCLENBQThCLEtBQUssRUFBTCxDQUFRLEtBQVIsQ0FBOUIsSUFBZ0QsR0FBMUQ7QUFDQSxnQkFBVyxDQUFYLFNBQWdCLENBQWhCOztBQUVBLFlBQUksSUFBSSxTQUFTLENBQWpCLEVBQ0UsUUFBUSxHQUFSO0FBQ0g7O0FBRUQsV0FBSyxHQUFMLENBQVMsY0FBVCxDQUF3QixJQUF4QixFQUE4QixHQUE5QixFQUFtQyxLQUFLLFVBQUwsQ0FBZ0IsZ0JBQWhCLEVBQWtDLElBQWxDLENBQW5DO0FBQ0EsV0FBSyxHQUFMLENBQVMsS0FBVCxDQUFlLE1BQWYsR0FBd0IsS0FBSyxNQUFMLENBQVksS0FBcEM7QUFDQSxXQUFLLEdBQUwsQ0FBUyxLQUFULENBQWUsSUFBZixHQUFzQixNQUF0Qjs7QUFFQSxhQUFPLElBQVA7QUFDRDs7Ozs7a0JBR1ksSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwRGY7Ozs7OztBQUdBOzs7OztJQUtxQixNOzs7Ozs7Ozs7O21DQUNKO0FBQUUsYUFBTyxRQUFQO0FBQWtCOzs7dUNBRWhCO0FBQ2pCLGFBQU8sRUFBRSxHQUFHLENBQUwsRUFBUSxPQUFPLFNBQWYsRUFBMEIsT0FBTyxFQUFqQyxFQUFQO0FBQ0Q7OzttQ0FFYztBQUNiLGFBQU87QUFDTCxzQkFBYyxDQURUO0FBRUwsdUJBQWUsRUFGVjtBQUdMLHlCQUFpQixJQUhaO0FBSUwsaUJBQVMsQ0FKSjtBQUtMLGVBQU8sS0FMRjtBQU1MLHVCQUFlLEtBTlY7QUFPTCxvQkFBWTtBQVBQLE9BQVA7QUFTRDs7OzJCQUVNLGdCLEVBQWtCO0FBQ3ZCLFVBQUksS0FBSyxHQUFULEVBQ0UsT0FBTyxLQUFLLEdBQVo7O0FBRUYsVUFBTSxTQUFTLGlCQUFpQixNQUFoQzs7QUFFQSxXQUFLLEdBQUwsR0FBVyxTQUFTLGVBQVQsQ0FBeUIsS0FBSyxFQUE5QixFQUFrQyxHQUFsQyxDQUFYO0FBQ0EsV0FBSyxLQUFMLEdBQWEsU0FBUyxlQUFULENBQXlCLEtBQUssRUFBOUIsRUFBa0MsTUFBbEMsQ0FBYjs7QUFFQTtBQUNBLFdBQUssS0FBTCxDQUFXLGNBQVgsQ0FBMEIsSUFBMUIsRUFBZ0MsR0FBaEMsRUFBcUMsQ0FBckM7QUFDQSxXQUFLLEtBQUwsQ0FBVyxjQUFYLENBQTBCLElBQTFCLEVBQWdDLElBQWhDLEVBQXNDLENBQXRDO0FBQ0EsV0FBSyxLQUFMLENBQVcsY0FBWCxDQUEwQixJQUExQixFQUFnQyxpQkFBaEMsRUFBbUQsWUFBbkQ7O0FBRUEsV0FBSyxHQUFMLENBQVMsV0FBVCxDQUFxQixLQUFLLEtBQTFCOztBQUVBLFVBQUksS0FBSyxNQUFMLENBQVksZUFBaEIsRUFBaUM7QUFDL0IsYUFBSyxRQUFMLEdBQWdCLFNBQVMsZUFBVCxDQUF5QixLQUFLLEVBQTlCLEVBQWtDLE1BQWxDLENBQWhCOztBQUVBLGFBQUssUUFBTCxDQUFjLGNBQWQsQ0FBNkIsSUFBN0IsRUFBbUMsR0FBbkMsRUFBd0MsQ0FBRSxLQUFLLE1BQUwsQ0FBWSxZQUFkLEdBQTZCLENBQXJFO0FBQ0EsYUFBSyxRQUFMLENBQWMsY0FBZCxDQUE2QixJQUE3QixFQUFtQyxPQUFuQyxFQUE0QyxLQUFLLE1BQUwsQ0FBWSxZQUF4RDtBQUNBLGFBQUssUUFBTCxDQUFjLGNBQWQsQ0FBNkIsSUFBN0IsRUFBbUMsUUFBbkMsRUFBNkMsS0FBSyxNQUFMLENBQVksYUFBekQ7QUFDQSxhQUFLLFFBQUwsQ0FBYyxjQUFkLENBQTZCLElBQTdCLEVBQW1DLGlCQUFuQyxFQUFzRCxZQUF0RDs7QUFFQSxhQUFLLEdBQUwsQ0FBUyxXQUFULENBQXFCLEtBQUssUUFBMUI7QUFDRDs7QUFFRCxVQUFJLEtBQUssTUFBTCxDQUFZLGFBQWhCLEVBQStCO0FBQzdCO0FBQ0EsYUFBSyxjQUFMLEdBQXNCLFNBQVMsZUFBVCxDQUF5QixLQUFLLEVBQTlCLEVBQWtDLGVBQWxDLENBQXRCOztBQUVBLGFBQUssTUFBTCxHQUFjLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFkO0FBQ0EsYUFBSyxNQUFMLENBQVksS0FBWixDQUFrQixPQUFsQixHQUE0QixPQUE1QjtBQUNBLGFBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsS0FBbEIsR0FBNkIsS0FBSyxNQUFMLENBQVksVUFBekM7QUFDQSxhQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLFFBQWxCLEdBQTZCLE1BQTdCO0FBQ0EsYUFBSyxNQUFMLENBQVksS0FBWixDQUFrQixVQUFsQixHQUErQixPQUEvQjtBQUNBLGFBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsVUFBbEIsR0FBK0IsTUFBL0I7O0FBRUEsYUFBSyxjQUFMLENBQW9CLFdBQXBCLENBQWdDLEtBQUssTUFBckM7QUFDQSxhQUFLLEdBQUwsQ0FBUyxXQUFULENBQXFCLEtBQUssY0FBMUI7QUFDRDs7QUFFRCxXQUFLLEdBQUwsQ0FBUyxLQUFULENBQWUsT0FBZixHQUF5QixLQUFLLE1BQUwsQ0FBWSxPQUFyQzs7QUFFQSxhQUFPLEtBQUssR0FBWjtBQUNEOzs7MkJBRU0sZ0IsRUFBa0IsSyxFQUFPO0FBQzlCLFVBQU0sSUFBSSxpQkFBaUIsV0FBakIsQ0FBNkIsS0FBSyxDQUFMLENBQU8sS0FBUCxDQUE3QixJQUE4QyxHQUF4RDtBQUNBLFVBQU0sUUFBUSxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWQ7QUFDQSxVQUFNLFNBQVMsaUJBQWlCLE1BQWhDOztBQUVBLFdBQUssR0FBTCxDQUFTLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsV0FBOUIsaUJBQXdELENBQXhEOztBQUVBLFdBQUssS0FBTCxDQUFXLGNBQVgsQ0FBMEIsSUFBMUIsRUFBZ0MsSUFBaEMsRUFBc0MsTUFBdEM7QUFDQSxXQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLE1BQWpCLEdBQTBCLEtBQTFCOztBQUVBLFVBQUksS0FBSyxNQUFMLENBQVksZUFBaEIsRUFBaUM7QUFDL0IsYUFBSyxRQUFMLENBQWMsY0FBZCxDQUE2QixJQUE3QixFQUFtQyxHQUFuQyxFQUF3QyxTQUFTLEtBQUssTUFBTCxDQUFZLGFBQTdEO0FBQ0EsYUFBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixJQUFwQixHQUEyQixLQUEzQjtBQUNEOztBQUVELFVBQUksS0FBSyxNQUFMLENBQVksYUFBaEIsRUFBK0I7QUFDN0IsWUFBTSxrQ0FBZ0MsS0FBSyxNQUFMLENBQVksWUFBNUMsV0FBNkQsU0FBUyxDQUF0RSxPQUFOO0FBQ0EsYUFBSyxjQUFMLENBQW9CLGNBQXBCLENBQW1DLElBQW5DLEVBQXlDLFdBQXpDLEVBQXNELE1BQXREO0FBQ0EsYUFBSyxNQUFMLENBQVksU0FBWixHQUF3QixLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQXhCO0FBQ0Q7QUFDRjs7OzJCQUVNLGdCLEVBQWtCLEssRUFBTyxFLEVBQUksRSxFQUFJLEUsRUFBSSxFLEVBQUk7QUFDOUM7QUFDQSxVQUFNLElBQUksaUJBQWlCLFdBQWpCLENBQTZCLEtBQUssQ0FBTCxDQUFPLEtBQVAsQ0FBN0IsQ0FBVjtBQUNBLFVBQU0sVUFBVSxJQUFJLENBQUMsS0FBSyxNQUFMLENBQVksWUFBWixHQUEyQixDQUE1QixJQUFpQyxDQUFyRDtBQUNBLFVBQU0sVUFBVSxVQUFVLEtBQUssTUFBTCxDQUFZLFlBQXRDO0FBQ0EsVUFBTSxVQUFVLGlCQUFpQixNQUFqQixHQUEwQixLQUFLLE1BQUwsQ0FBWSxhQUF0RDtBQUNBLFVBQU0sVUFBVSxpQkFBaUIsTUFBakM7O0FBRUEsVUFBTSxXQUFXLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxLQUFLLEdBQUwsQ0FBUyxFQUFULEVBQWEsT0FBYixJQUF3QixLQUFLLEdBQUwsQ0FBUyxFQUFULEVBQWEsT0FBYixDQUFwQyxDQUFqQjtBQUNBLFVBQU0sV0FBVyxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksS0FBSyxHQUFMLENBQVMsRUFBVCxFQUFhLE9BQWIsSUFBd0IsS0FBSyxHQUFMLENBQVMsRUFBVCxFQUFhLE9BQWIsQ0FBcEMsQ0FBakI7QUFDQSxVQUFNLE9BQU8sV0FBVyxRQUF4Qjs7QUFFQSxhQUFPLE9BQU8sQ0FBZDtBQUNEOzs7OztrQkFyR2tCLE07Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDUnJCOzs7Ozs7QUFHQTs7Ozs7SUFLcUIsTzs7Ozs7Ozs7OzttQ0FDSjtBQUFFLGFBQU8sU0FBUDtBQUFtQjs7O3VDQUVqQjtBQUNqQixhQUFPLEVBQUUsR0FBRyxDQUFMLEVBQVEsR0FBRyxDQUFYLEVBQWMsT0FBTyxDQUFyQixFQUF3QixRQUFRLENBQWhDLEVBQW1DLE9BQU8sU0FBMUMsRUFBcUQsU0FBUyxDQUE5RCxFQUFpRSxPQUFPLEVBQXhFLEVBQVA7QUFDRDs7O21DQUVjO0FBQ2IsYUFBTztBQUNMLHlCQUFpQixJQURaO0FBRUwsc0JBQWMsQ0FGVDtBQUdMLHdCQUFnQixHQUhYO0FBSUwsaUJBQVMsR0FKSjtBQUtMLHVCQUFlO0FBTFYsT0FBUDtBQU9EOzs7MkJBRU0sZ0IsRUFBa0I7QUFDdkIsVUFBSSxLQUFLLEdBQVQsRUFBYztBQUFFLGVBQU8sS0FBSyxHQUFaO0FBQWtCOztBQUVsQyxXQUFLLEdBQUwsR0FBVyxTQUFTLGVBQVQsQ0FBeUIsS0FBSyxFQUE5QixFQUFrQyxHQUFsQyxDQUFYOztBQUVBLFdBQUssUUFBTCxHQUFnQixTQUFTLGVBQVQsQ0FBeUIsS0FBSyxFQUE5QixFQUFrQyxNQUFsQyxDQUFoQjtBQUNBLFdBQUssUUFBTCxDQUFjLFNBQWQsQ0FBd0IsR0FBeEIsQ0FBNEIsU0FBNUI7QUFDQSxXQUFLLFFBQUwsQ0FBYyxLQUFkLENBQW9CLE9BQXBCLEdBQThCLEtBQUssTUFBTCxDQUFZLE9BQTFDO0FBQ0EsV0FBSyxRQUFMLENBQWMsY0FBZCxDQUE2QixJQUE3QixFQUFtQyxpQkFBbkMsRUFBc0QsWUFBdEQ7O0FBRUEsV0FBSyxHQUFMLENBQVMsV0FBVCxDQUFxQixLQUFLLFFBQTFCOztBQUVBLFVBQUksS0FBSyxNQUFMLENBQVksZUFBaEIsRUFBaUM7QUFDL0IsYUFBSyxZQUFMLEdBQW9CLFNBQVMsZUFBVCxDQUF5QixLQUFLLEVBQTlCLEVBQWtDLE1BQWxDLENBQXBCO0FBQ0EsYUFBSyxZQUFMLENBQWtCLFNBQWxCLENBQTRCLEdBQTVCLENBQWdDLE1BQWhDLEVBQXdDLFNBQXhDO0FBQ0EsYUFBSyxZQUFMLENBQWtCLGNBQWxCLENBQWlDLElBQWpDLEVBQXVDLE9BQXZDLEVBQWdELEtBQUssTUFBTCxDQUFZLFlBQTVEO0FBQ0EsYUFBSyxZQUFMLENBQWtCLGNBQWxCLENBQWlDLElBQWpDLEVBQXVDLGlCQUF2QyxFQUEwRCxZQUExRDtBQUNBLGFBQUssWUFBTCxDQUFrQixLQUFsQixDQUF3QixPQUF4QixHQUFrQyxLQUFLLE1BQUwsQ0FBWSxjQUE5QztBQUNBLGFBQUssWUFBTCxDQUFrQixLQUFsQixDQUF3QixNQUF4QixHQUFpQyxXQUFqQzs7QUFFQSxhQUFLLGFBQUwsR0FBcUIsU0FBUyxlQUFULENBQXlCLEtBQUssRUFBOUIsRUFBa0MsTUFBbEMsQ0FBckI7QUFDQSxhQUFLLGFBQUwsQ0FBbUIsU0FBbkIsQ0FBNkIsR0FBN0IsQ0FBaUMsT0FBakMsRUFBMEMsU0FBMUM7QUFDQSxhQUFLLGFBQUwsQ0FBbUIsY0FBbkIsQ0FBa0MsSUFBbEMsRUFBd0MsT0FBeEMsRUFBaUQsS0FBSyxNQUFMLENBQVksWUFBN0Q7QUFDQSxhQUFLLGFBQUwsQ0FBbUIsY0FBbkIsQ0FBa0MsSUFBbEMsRUFBd0MsaUJBQXhDLEVBQTJELFlBQTNEO0FBQ0EsYUFBSyxhQUFMLENBQW1CLEtBQW5CLENBQXlCLE9BQXpCLEdBQW1DLEtBQUssTUFBTCxDQUFZLGNBQS9DO0FBQ0EsYUFBSyxhQUFMLENBQW1CLEtBQW5CLENBQXlCLE1BQXpCLEdBQWtDLFdBQWxDOztBQUVBLGFBQUssR0FBTCxDQUFTLFdBQVQsQ0FBcUIsS0FBSyxZQUExQjtBQUNBLGFBQUssR0FBTCxDQUFTLFdBQVQsQ0FBcUIsS0FBSyxhQUExQjtBQUNEOztBQUVELFVBQUksS0FBSyxNQUFMLENBQVksYUFBaEIsRUFBK0I7QUFDN0I7QUFDQSxhQUFLLGNBQUwsR0FBc0IsU0FBUyxlQUFULENBQXlCLEtBQUssRUFBOUIsRUFBa0MsZUFBbEMsQ0FBdEI7O0FBRUEsYUFBSyxNQUFMLEdBQWMsU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQWQ7QUFDQSxhQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLE9BQWxCLEdBQTRCLE9BQTVCO0FBQ0EsYUFBSyxNQUFMLENBQVksS0FBWixDQUFrQixLQUFsQixHQUEwQixNQUExQjtBQUNBLGFBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsUUFBbEIsR0FBNkIsTUFBN0I7QUFDQSxhQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLFVBQWxCLEdBQStCLE9BQS9CO0FBQ0EsYUFBSyxNQUFMLENBQVksS0FBWixDQUFrQixVQUFsQixHQUErQixNQUEvQjs7QUFFQSxhQUFLLGNBQUwsQ0FBb0IsV0FBcEIsQ0FBZ0MsS0FBSyxNQUFyQztBQUNBLGFBQUssR0FBTCxDQUFTLFdBQVQsQ0FBcUIsS0FBSyxjQUExQjtBQUNEOztBQUVELGFBQU8sS0FBSyxHQUFaO0FBQ0Q7OzsyQkFFTSxnQixFQUFrQixLLEVBQU87QUFDOUIsVUFBTSxJQUFJLGlCQUFpQixXQUFqQixDQUE2QixLQUFLLENBQUwsQ0FBTyxLQUFQLENBQTdCLENBQVY7QUFDQSxVQUFNLElBQUksaUJBQWlCLFlBQWpCLENBQThCLEtBQUssQ0FBTCxDQUFPLEtBQVAsQ0FBOUIsQ0FBVjs7QUFFQSxVQUFNLFFBQVEsaUJBQWlCLFdBQWpCLENBQTZCLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBN0IsQ0FBZDtBQUNBLFVBQU0sU0FBUyxpQkFBaUIsWUFBakIsQ0FBOEIsS0FBSyxNQUFMLENBQVksS0FBWixDQUE5QixDQUFmO0FBQ0EsVUFBTSxRQUFRLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBZDtBQUNBLFVBQU0sVUFBVSxLQUFLLE9BQUwsQ0FBYSxLQUFiLENBQWhCOztBQUVBLFdBQUssR0FBTCxDQUFTLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsV0FBOUIsaUJBQXdELENBQXhELFVBQThELENBQTlEO0FBQ0EsV0FBSyxHQUFMLENBQVMsS0FBVCxDQUFlLE9BQWYsR0FBeUIsT0FBekI7O0FBRUEsV0FBSyxRQUFMLENBQWMsY0FBZCxDQUE2QixJQUE3QixFQUFtQyxPQUFuQyxFQUE0QyxLQUFLLEdBQUwsQ0FBUyxLQUFULEVBQWdCLENBQWhCLENBQTVDO0FBQ0EsV0FBSyxRQUFMLENBQWMsY0FBZCxDQUE2QixJQUE3QixFQUFtQyxRQUFuQyxFQUE2QyxNQUE3QztBQUNBLFdBQUssUUFBTCxDQUFjLEtBQWQsQ0FBb0IsSUFBcEIsR0FBMkIsS0FBM0I7O0FBR0EsVUFBSSxLQUFLLE1BQUwsQ0FBWSxlQUFoQixFQUFpQztBQUMvQjtBQUNBLGFBQUssWUFBTCxDQUFrQixjQUFsQixDQUFpQyxJQUFqQyxFQUF1QyxRQUF2QyxFQUFpRCxNQUFqRDtBQUNBLGFBQUssWUFBTCxDQUFrQixjQUFsQixDQUFpQyxJQUFqQyxFQUF1QyxXQUF2QyxFQUFvRCxpQkFBcEQ7QUFDQSxhQUFLLFlBQUwsQ0FBa0IsS0FBbEIsQ0FBd0IsSUFBeEIsR0FBK0IsS0FBL0I7O0FBRUEsWUFBTSx3Q0FBcUMsUUFBUSxLQUFLLE1BQUwsQ0FBWSxZQUF6RCxVQUFOO0FBQ0EsYUFBSyxhQUFMLENBQW1CLGNBQW5CLENBQWtDLElBQWxDLEVBQXdDLFFBQXhDLEVBQWtELE1BQWxEO0FBQ0EsYUFBSyxhQUFMLENBQW1CLGNBQW5CLENBQWtDLElBQWxDLEVBQXdDLFdBQXhDLEVBQXFELHFCQUFyRDtBQUNBLGFBQUssYUFBTCxDQUFtQixLQUFuQixDQUF5QixJQUF6QixHQUFnQyxLQUFoQztBQUNEOztBQUVELFVBQUksS0FBSyxNQUFMLENBQVksYUFBaEIsRUFBK0I7QUFDN0IsWUFBTSxzQ0FBbUMsU0FBUyxDQUE1QyxPQUFOO0FBQ0EsYUFBSyxjQUFMLENBQW9CLGNBQXBCLENBQW1DLElBQW5DLEVBQXlDLFdBQXpDLEVBQXNELE1BQXREO0FBQ0EsYUFBSyxNQUFMLENBQVksU0FBWixHQUF3QixLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQXhCO0FBQ0Q7QUFDRjs7OzJCQUVNLGdCLEVBQWtCLEssRUFBTyxFLEVBQUksRSxFQUFJLEUsRUFBSSxFLEVBQUk7QUFDOUMsVUFBTSxVQUFVLGlCQUFpQixXQUFqQixDQUE2QixLQUFLLENBQUwsQ0FBTyxLQUFQLENBQTdCLENBQWhCO0FBQ0EsVUFBTSxVQUFVLGlCQUFpQixXQUFqQixDQUE2QixLQUFLLENBQUwsQ0FBTyxLQUFQLElBQWdCLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBN0MsQ0FBaEI7QUFDQSxVQUFNLFVBQVUsaUJBQWlCLFlBQWpCLENBQThCLEtBQUssQ0FBTCxDQUFPLEtBQVAsQ0FBOUIsQ0FBaEI7QUFDQSxVQUFNLFVBQVUsaUJBQWlCLFlBQWpCLENBQThCLEtBQUssQ0FBTCxDQUFPLEtBQVAsSUFBZ0IsS0FBSyxNQUFMLENBQVksS0FBWixDQUE5QyxDQUFoQjs7QUFFQTtBQUNBLFVBQU0sV0FBVyxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksS0FBSyxHQUFMLENBQVMsRUFBVCxFQUFhLE9BQWIsSUFBd0IsS0FBSyxHQUFMLENBQVMsRUFBVCxFQUFhLE9BQWIsQ0FBcEMsQ0FBakI7QUFDQSxVQUFNLFdBQVcsS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLEtBQUssR0FBTCxDQUFTLEVBQVQsRUFBYSxPQUFiLElBQXdCLEtBQUssR0FBTCxDQUFTLEVBQVQsRUFBYSxPQUFiLENBQXBDLENBQWpCO0FBQ0EsVUFBTSxPQUFPLFdBQVcsUUFBeEI7O0FBRUEsYUFBTyxPQUFPLENBQWQ7QUFDRDs7Ozs7a0JBbEhrQixPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1JyQjs7Ozs7O0FBRUE7OztJQUdxQixLOzs7Ozs7Ozs7O29DQUNIO0FBQ2QsYUFBTyxNQUFQO0FBQ0Q7Ozt1Q0FFa0I7QUFDakIsYUFBTyxFQUFFLE1BQU0sQ0FBUixFQUFXLFNBQVMsSUFBcEIsRUFBMEIsT0FBTyxFQUFqQyxFQUFQO0FBQ0Q7OzttQ0FFYztBQUNiLGFBQU87QUFDTCxlQUFPLFdBREY7QUFFTCx3QkFBZ0IsR0FGWDtBQUdMLHdCQUFnQjtBQUhYLE9BQVA7QUFLRDs7OzJCQUVNLGdCLEVBQWtCO0FBQ3ZCLFdBQUssR0FBTCxHQUFXLFNBQVMsZUFBVCxDQUF5QixLQUFLLEVBQTlCLEVBQWtDLEdBQWxDLENBQVg7QUFDQSxhQUFPLEtBQUssR0FBWjtBQUNEOzs7MkJBRU0sZ0IsRUFBa0IsSSxFQUFNO0FBQUE7O0FBQzdCLGFBQU8sS0FBSyxHQUFMLENBQVMsVUFBaEIsRUFBNEI7QUFDMUIsYUFBSyxHQUFMLENBQVMsV0FBVCxDQUFxQixLQUFLLEdBQUwsQ0FBUyxVQUE5QjtBQUNEOztBQUVELFVBQU0sV0FBVyxTQUFTLHNCQUFULEVBQWpCO0FBQ0EsVUFBTSxjQUFjLGlCQUFpQixNQUFyQyxDQU42QixDQU1nQjs7QUFFN0MsV0FBSyxPQUFMLENBQWEsVUFBQyxLQUFELEVBQVc7QUFDdEIsWUFBTSxJQUFJLGlCQUFpQixXQUFqQixDQUE2QixPQUFLLElBQUwsQ0FBVSxLQUFWLENBQTdCLENBQVY7QUFDQSxZQUFNLFVBQVUsT0FBSyxPQUFMLENBQWEsS0FBYixJQUNkLE9BQUssTUFBTCxDQUFZLGNBREUsR0FDZSxPQUFLLE1BQUwsQ0FBWSxjQUQzQzs7QUFHQSxZQUFNLFNBQVMsV0FBZjs7QUFFQSxZQUFNLE9BQU8sU0FBUyxlQUFULENBQXlCLE9BQUssRUFBOUIsRUFBa0MsTUFBbEMsQ0FBYjtBQUNBLGFBQUssU0FBTCxDQUFlLEdBQWYsQ0FBbUIsTUFBbkI7O0FBRUEsYUFBSyxjQUFMLENBQW9CLElBQXBCLEVBQTBCLElBQTFCLEVBQWdDLENBQWhDO0FBQ0EsYUFBSyxjQUFMLENBQW9CLElBQXBCLEVBQTBCLElBQTFCLEVBQWdDLENBQWhDO0FBQ0EsYUFBSyxjQUFMLENBQW9CLElBQXBCLEVBQTBCLElBQTFCLEVBQWdDLENBQWhDO0FBQ0EsYUFBSyxjQUFMLENBQW9CLElBQXBCLEVBQTBCLElBQTFCLEVBQWdDLE1BQWhDOztBQUVBLGFBQUssY0FBTCxDQUFvQixJQUFwQixFQUEwQixNQUExQixFQUFrQyxNQUFsQztBQUNBLGFBQUssY0FBTCxDQUFvQixJQUFwQixFQUEwQixRQUExQixFQUFvQyxPQUFLLE1BQUwsQ0FBWSxLQUFoRDtBQUNBLGFBQUssY0FBTCxDQUFvQixJQUFwQixFQUEwQixpQkFBMUIsRUFBNkMsWUFBN0M7QUFDQSxhQUFLLGNBQUwsQ0FBb0IsSUFBcEIsRUFBMEIsV0FBMUIsaUJBQW9ELENBQXBEO0FBQ0EsYUFBSyxjQUFMLENBQW9CLElBQXBCLEVBQTBCLFNBQTFCLEVBQXFDLE9BQXJDOztBQUVBLGVBQUssR0FBTCxDQUFTLFdBQVQsQ0FBcUIsSUFBckI7O0FBRUEsWUFBTSxRQUFRLE9BQUssS0FBTCxDQUFXLEtBQVgsQ0FBZDs7QUFFQSxZQUFJLEtBQUosRUFBVztBQUNULGNBQU0sU0FBUyxTQUFTLGVBQVQsQ0FBeUIsT0FBSyxFQUE5QixFQUFrQyxNQUFsQyxDQUFmO0FBQ0EsaUJBQU8sU0FBUCxDQUFpQixHQUFqQixDQUFxQixPQUFyQjtBQUNBLGNBQU0sUUFBUSxTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsQ0FBZDtBQUNBLGlCQUFPLFdBQVAsQ0FBbUIsS0FBbkI7QUFDQSxpQkFBTyxjQUFQLENBQXNCLElBQXRCLEVBQTRCLFdBQTVCLDRCQUFnRSxJQUFJLENBQXBFLFlBQTBFLFNBQVMsQ0FBbkY7QUFDQTtBQUNBO0FBQ0EsaUJBQU8sY0FBUCxDQUFzQixJQUF0QixFQUE0QixHQUE1QixFQUFpQyxJQUFqQzs7QUFFQSxpQkFBTyxLQUFQLENBQWEsUUFBYixHQUF3QixNQUF4QjtBQUNBLGlCQUFPLEtBQVAsQ0FBYSxVQUFiLEdBQTBCLE1BQTFCO0FBQ0EsaUJBQU8sS0FBUCxDQUFhLFVBQWIsR0FBMEIsV0FBMUI7QUFDQSxpQkFBTyxLQUFQLENBQWEsS0FBYixHQUFxQixTQUFyQjtBQUNBLGlCQUFPLEtBQVAsQ0FBYSxPQUFiLEdBQXVCLEdBQXZCO0FBQ0EsaUJBQU8sS0FBUCxDQUFhLGFBQWIsR0FBNkIsTUFBN0I7QUFDQSxpQkFBTyxLQUFQLENBQWEsZ0JBQWIsR0FBZ0MsTUFBaEM7QUFDQSxpQkFBTyxLQUFQLENBQWEsVUFBYixHQUEwQixNQUExQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFLLEdBQUwsQ0FBUyxXQUFULENBQXFCLE1BQXJCO0FBQ0Q7QUFDRixPQXBERDs7QUFzREEsV0FBSyxHQUFMLENBQVMsV0FBVCxDQUFxQixRQUFyQjtBQUNEOzs7OztrQkFyRmtCLEs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTHJCOzs7Ozs7QUFHQTs7Ozs7SUFLcUIsUzs7Ozs7Ozs7OzttQ0FDSjtBQUFFLGFBQU8sWUFBUDtBQUFzQjs7O3VDQUVwQjtBQUNqQixhQUFPLEVBQUUsR0FBRyxDQUFMLEVBQVEsTUFBTSxDQUFkLEVBQWlCLE9BQU8sQ0FBeEIsRUFBUDtBQUNEOzs7bUNBRWM7QUFDYixhQUFPO0FBQ0wsb0JBQVksQ0FEUDtBQUVMLHFCQUFhLENBRlI7QUFHTCxtQkFBVyxTQUhOO0FBSUwsb0JBQVk7QUFKUCxPQUFQO0FBTUQ7OzsyQkFFTSxnQixFQUFrQjtBQUN2QixVQUFJLEtBQUssR0FBVCxFQUFjO0FBQUUsZUFBTyxLQUFLLEdBQVo7QUFBa0I7QUFDbEM7QUFDQSxXQUFLLEdBQUwsR0FBVyxTQUFTLGVBQVQsQ0FBeUIsS0FBSyxFQUE5QixFQUFrQyxHQUFsQyxDQUFYO0FBQ0E7QUFDQSxXQUFLLEtBQUwsR0FBYSxTQUFTLGVBQVQsQ0FBeUIsS0FBSyxFQUE5QixFQUFrQyxRQUFsQyxDQUFiO0FBQ0EsV0FBSyxLQUFMLENBQVcsY0FBWCxDQUEwQixJQUExQixFQUFnQyxHQUFoQyxFQUFxQyxLQUFLLE1BQUwsQ0FBWSxVQUFqRDtBQUNBLFdBQUssS0FBTCxDQUFXLGNBQVgsQ0FBMEIsSUFBMUIsRUFBZ0MsUUFBaEMsRUFBMEMsS0FBSyxNQUFMLENBQVksU0FBdEQ7QUFDQSxXQUFLLEtBQUwsQ0FBVyxjQUFYLENBQTBCLElBQTFCLEVBQWdDLE1BQWhDLEVBQXdDLGFBQXhDO0FBQ0EsV0FBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixHQUFyQixDQUF5QixNQUF6QjtBQUNBO0FBQ0EsV0FBSyxJQUFMLEdBQVksU0FBUyxlQUFULENBQXlCLEtBQUssRUFBOUIsRUFBa0MsUUFBbEMsQ0FBWjtBQUNBLFdBQUssSUFBTCxDQUFVLGNBQVYsQ0FBeUIsSUFBekIsRUFBK0IsR0FBL0IsRUFBb0MsS0FBSyxNQUFMLENBQVksVUFBaEQ7QUFDQSxXQUFLLElBQUwsQ0FBVSxjQUFWLENBQXlCLElBQXpCLEVBQStCLFFBQS9CLEVBQXlDLEtBQUssTUFBTCxDQUFZLFVBQXJEO0FBQ0EsV0FBSyxJQUFMLENBQVUsY0FBVixDQUF5QixJQUF6QixFQUErQixNQUEvQixFQUF1QyxhQUF2QztBQUNBLFdBQUssSUFBTCxDQUFVLFNBQVYsQ0FBb0IsR0FBcEIsQ0FBd0IsS0FBeEI7O0FBRUEsV0FBSyxJQUFMLEdBQVksU0FBUyxlQUFULENBQXlCLEtBQUssRUFBOUIsRUFBa0MsUUFBbEMsQ0FBWjtBQUNBLFdBQUssSUFBTCxDQUFVLGNBQVYsQ0FBeUIsSUFBekIsRUFBK0IsR0FBL0IsRUFBb0MsS0FBSyxNQUFMLENBQVksVUFBaEQ7QUFDQSxXQUFLLElBQUwsQ0FBVSxjQUFWLENBQXlCLElBQXpCLEVBQStCLFFBQS9CLEVBQXlDLEtBQUssTUFBTCxDQUFZLFVBQXJEO0FBQ0EsV0FBSyxJQUFMLENBQVUsY0FBVixDQUF5QixJQUF6QixFQUErQixNQUEvQixFQUF1QyxhQUF2QztBQUNBLFdBQUssSUFBTCxDQUFVLFNBQVYsQ0FBb0IsR0FBcEIsQ0FBd0IsS0FBeEI7O0FBRUEsV0FBSyxHQUFMLENBQVMsV0FBVCxDQUFxQixLQUFLLEtBQTFCO0FBQ0EsV0FBSyxHQUFMLENBQVMsV0FBVCxDQUFxQixLQUFLLElBQTFCO0FBQ0EsV0FBSyxHQUFMLENBQVMsV0FBVCxDQUFxQixLQUFLLElBQTFCOztBQUVBLGFBQU8sS0FBSyxHQUFaO0FBQ0Q7O0FBRUQ7Ozs7MkJBQ08sZ0IsRUFBa0IsSyxFQUFPO0FBQzlCLFVBQU0sT0FBTyxLQUFLLElBQUwsQ0FBVSxLQUFWLENBQWI7QUFDQSxVQUFNLFFBQVEsS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFkO0FBQ0EsVUFBTSxJQUFJLEtBQUssQ0FBTCxDQUFPLEtBQVAsQ0FBVjtBQUNBO0FBQ0EsVUFBTSxlQUFhLGlCQUFpQixZQUFqQixDQUE4QixJQUE5QixDQUFuQjtBQUNBLFdBQUssS0FBTCxDQUFXLGNBQVgsQ0FBMEIsSUFBMUIsRUFBZ0MsV0FBaEMsb0JBQTZELE9BQTdEOztBQUVBLFVBQU0sWUFBWSxRQUFRLENBQTFCO0FBQ0EsVUFBTSxNQUFNLGlCQUFpQixZQUFqQixDQUE4QixPQUFPLFNBQXJDLENBQVo7QUFDQSxVQUFNLE1BQU0saUJBQWlCLFlBQWpCLENBQThCLE9BQU8sU0FBckMsQ0FBWjtBQUNBLFVBQU0sT0FBTyxpQkFBaUIsV0FBakIsQ0FBNkIsQ0FBN0IsQ0FBYjs7QUFFQSxXQUFLLElBQUwsQ0FBVSxjQUFWLENBQXlCLElBQXpCLEVBQStCLFdBQS9CLG9CQUE0RCxHQUE1RDtBQUNBLFdBQUssSUFBTCxDQUFVLGNBQVYsQ0FBeUIsSUFBekIsRUFBK0IsV0FBL0Isb0JBQTRELEdBQTVEO0FBQ0EsV0FBSyxHQUFMLENBQVMsY0FBVCxDQUF3QixJQUF4QixFQUE4QixXQUE5QixpQkFBd0QsSUFBeEQ7QUFDRDs7OzJCQUVNLGdCLEVBQWtCLEssRUFBTyxFLEVBQUksRSxFQUFJLEUsRUFBSSxFLEVBQUk7QUFDOUMsVUFBTSxJQUFJLGlCQUFpQixXQUFqQixDQUE2QixLQUFLLENBQUwsQ0FBTyxLQUFQLENBQTdCLENBQVY7QUFDQSxVQUFNLE9BQU8saUJBQWlCLFlBQWpCLENBQThCLEtBQUssSUFBTCxDQUFVLEtBQVYsQ0FBOUIsQ0FBYjtBQUNBLFVBQU0sUUFBUSxpQkFBaUIsWUFBakIsQ0FBOEIsS0FBSyxLQUFMLENBQVcsS0FBWCxDQUE5QixDQUFkO0FBQ0EsVUFBTSxNQUFNLE9BQVEsUUFBUSxDQUE1QjtBQUNBLFVBQU0sTUFBTSxPQUFRLFFBQVEsQ0FBNUI7O0FBRUEsVUFBSSxJQUFJLEVBQUosSUFBVSxJQUFJLEVBQWQsS0FBcUIsTUFBTSxFQUFOLElBQVksTUFBTSxFQUF2QyxDQUFKLEVBQWdEO0FBQzlDLGVBQU8sSUFBUDtBQUNEOztBQUVELGFBQU8sS0FBUDtBQUNEOzs7OztrQkE3RWtCLFM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDUnJCOzs7Ozs7QUFHQTs7Ozs7SUFLcUIsUzs7Ozs7Ozs7OzttQ0FDSjtBQUFFLGFBQU8sY0FBUDtBQUF3Qjs7O3VDQUV0QjtBQUNqQixhQUFPLEVBQUUsR0FBRyxDQUFMLEVBQVEsTUFBTSxDQUFkLEVBQWlCLE9BQU8sQ0FBeEIsRUFBUDtBQUNEOzs7bUNBRWM7QUFDYixhQUFPO0FBQ0wsb0JBQVksV0FEUDtBQUVMLG1CQUFXLFNBRk47QUFHTCxxQkFBYTtBQUhSLE9BQVA7QUFLRDs7OzJCQUVNLGdCLEVBQWtCO0FBQ3ZCLFVBQUksS0FBSyxHQUFULEVBQWM7QUFBRSxlQUFPLEtBQUssR0FBWjtBQUFrQjtBQUNsQyxXQUFLLEdBQUwsR0FBVyxTQUFTLGVBQVQsQ0FBeUIsS0FBSyxFQUE5QixFQUFrQyxHQUFsQyxDQUFYO0FBQ0E7QUFDQSxXQUFLLE1BQUwsR0FBYyxTQUFTLGVBQVQsQ0FBeUIsS0FBSyxFQUE5QixFQUFrQyxNQUFsQyxDQUFkO0FBQ0EsV0FBSyxHQUFMLENBQVMsV0FBVCxDQUFxQixLQUFLLE1BQTFCOztBQUVBO0FBQ0EsVUFBSSxLQUFLLE1BQUwsQ0FBWSxXQUFoQixFQUE2QjtBQUMzQixhQUFLLEtBQUwsR0FBYSxTQUFTLGVBQVQsQ0FBeUIsS0FBSyxFQUE5QixFQUFrQyxNQUFsQyxDQUFiO0FBQ0EsYUFBSyxHQUFMLENBQVMsV0FBVCxDQUFxQixLQUFLLEtBQTFCO0FBQ0Q7O0FBRUQsYUFBTyxLQUFLLEdBQVo7QUFDRDs7OzJCQUVNLGdCLEVBQWtCLEksRUFBTTtBQUFBOztBQUM3QjtBQUNBLGFBQU8sS0FBSyxLQUFMLENBQVcsQ0FBWCxDQUFQO0FBQ0EsV0FBSyxJQUFMLENBQVUsVUFBQyxDQUFELEVBQUksQ0FBSjtBQUFBLGVBQVUsT0FBSyxDQUFMLENBQU8sQ0FBUCxJQUFZLE9BQUssQ0FBTCxDQUFPLENBQVAsQ0FBWixHQUF3QixDQUFDLENBQXpCLEdBQTZCLENBQXZDO0FBQUEsT0FBVjs7QUFFQSxVQUFJLEtBQUssTUFBTCxDQUFZLFdBQWhCLEVBQTZCO0FBQzNCLGFBQUssS0FBTCxDQUFXLGNBQVgsQ0FBMEIsSUFBMUIsRUFBZ0MsR0FBaEMsRUFBcUMsS0FBSyxjQUFMLENBQW9CLGdCQUFwQixFQUFzQyxJQUF0QyxDQUFyQztBQUNBLGFBQUssS0FBTCxDQUFXLGNBQVgsQ0FBMEIsSUFBMUIsRUFBZ0MsUUFBaEMsRUFBMEMsS0FBSyxNQUFMLENBQVksU0FBdEQ7QUFDQSxhQUFLLEtBQUwsQ0FBVyxjQUFYLENBQTBCLElBQTFCLEVBQWdDLE1BQWhDLEVBQXdDLE1BQXhDO0FBQ0Q7O0FBRUQsV0FBSyxNQUFMLENBQVksY0FBWixDQUEyQixJQUEzQixFQUFpQyxHQUFqQyxFQUFzQyxLQUFLLGVBQUwsQ0FBcUIsZ0JBQXJCLEVBQXVDLElBQXZDLENBQXRDO0FBQ0EsV0FBSyxNQUFMLENBQVksY0FBWixDQUEyQixJQUEzQixFQUFpQyxRQUFqQyxFQUEyQyxNQUEzQztBQUNBLFdBQUssTUFBTCxDQUFZLGNBQVosQ0FBMkIsSUFBM0IsRUFBaUMsTUFBakMsRUFBeUMsS0FBSyxNQUFMLENBQVksVUFBckQ7QUFDQSxXQUFLLE1BQUwsQ0FBWSxjQUFaLENBQTJCLElBQTNCLEVBQWlDLFNBQWpDLEVBQTRDLEtBQTVDOztBQUVBLGFBQU8sSUFBUDtBQUNEOzs7bUNBRWMsZ0IsRUFBa0IsSSxFQUFNO0FBQUE7O0FBQ3JDLFVBQUksZUFBZSxLQUFLLEdBQUwsQ0FBUyxVQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWtCO0FBQzVDLFlBQU0sSUFBSSxpQkFBaUIsV0FBakIsQ0FBNkIsT0FBSyxDQUFMLENBQU8sS0FBUCxDQUE3QixDQUFWO0FBQ0EsWUFBTSxJQUFJLGlCQUFpQixZQUFqQixDQUE4QixPQUFLLElBQUwsQ0FBVSxLQUFWLENBQTlCLENBQVY7QUFDQSxlQUFVLENBQVYsU0FBZSxDQUFmO0FBQ0QsT0FKa0IsQ0FBbkI7O0FBTUEsYUFBTyxNQUFNLGFBQWEsSUFBYixDQUFrQixHQUFsQixDQUFiO0FBQ0Q7OztvQ0FFZSxnQixFQUFrQixJLEVBQU07QUFDdEMsVUFBTSxTQUFTLEtBQUssTUFBcEI7QUFDQTtBQUNBLFVBQUksb0JBQW9CLEVBQXhCO0FBQ0EsVUFBSSxrQkFBa0IsRUFBdEI7O0FBRUEsV0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQXBCLEVBQTRCLEdBQTVCLEVBQWlDO0FBQy9CLFlBQU0sUUFBUSxLQUFLLENBQUwsQ0FBZDtBQUNBLFlBQU0sT0FBTyxLQUFLLElBQUwsQ0FBVSxLQUFWLENBQWI7QUFDQSxZQUFNLFlBQVksS0FBSyxLQUFMLENBQVcsS0FBWCxJQUFvQixDQUF0Qzs7QUFFQSxZQUFNLElBQUssaUJBQWlCLFdBQWpCLENBQTZCLEtBQUssQ0FBTCxDQUFPLEtBQVAsQ0FBN0IsQ0FBWDtBQUNBLFlBQU0sS0FBSyxpQkFBaUIsWUFBakIsQ0FBOEIsT0FBTyxTQUFyQyxDQUFYO0FBQ0EsWUFBTSxLQUFLLGlCQUFpQixZQUFqQixDQUE4QixPQUFPLFNBQXJDLENBQVg7O0FBRUEsWUFBTSxRQUFXLENBQVgsU0FBZ0IsRUFBdEI7QUFDQSxZQUFNLE1BQVcsQ0FBWCxTQUFnQixFQUF0Qjs7QUFFQSw0QkFBb0Isc0JBQXNCLEVBQXRCLEdBQ2xCLEtBRGtCLEdBQ1AsaUJBRE8sU0FDYyxLQURsQzs7QUFHQSwwQkFBa0Isb0JBQW9CLEVBQXBCLEdBQ2hCLEdBRGdCLEdBQ1AsR0FETyxTQUNBLGVBRGxCO0FBRUQ7O0FBRUQsVUFBSSxxQkFBbUIsaUJBQW5CLFNBQXdDLGVBQXhDLE1BQUo7QUFDQSxhQUFPLFlBQVA7QUFDRDs7Ozs7a0JBdkZrQixTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1JyQjs7Ozs7O0FBR0EsSUFBTSxVQUFVLDhCQUFoQjs7QUFFQTs7Ozs7Ozs7SUFPTSxROzs7Ozs7Ozs7O21DQUNXO0FBQUUsYUFBTyxVQUFQO0FBQW9COzs7dUNBRWxCO0FBQ2pCO0FBQ0EsYUFBTyxFQUFQO0FBQ0Q7OzttQ0FFYztBQUNiLGFBQU87QUFDTCxvQkFBWSxLQURQO0FBRUwsZUFBTyxTQUZGO0FBR0wsaUJBQVM7QUFDVDtBQUpLLE9BQVA7QUFNRDs7OzJCQUVNLGdCLEVBQWtCO0FBQ3ZCLFVBQUksS0FBSyxHQUFULEVBQ0UsT0FBTyxLQUFLLEdBQVo7O0FBRUY7O0FBRUEsV0FBSyxHQUFMLEdBQVcsU0FBUyxlQUFULENBQXlCLEtBQUssRUFBOUIsRUFBa0MsTUFBbEMsQ0FBWDtBQUNBLFdBQUssR0FBTCxDQUFTLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsTUFBOUIsRUFBc0MsTUFBdEM7QUFDQSxXQUFLLEdBQUwsQ0FBUyxjQUFULENBQXdCLElBQXhCLEVBQThCLGlCQUE5QixFQUFpRCxZQUFqRDtBQUNBLFdBQUssR0FBTCxDQUFTLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsUUFBOUIsRUFBd0MsS0FBSyxNQUFMLENBQVksS0FBcEQ7QUFDQSxXQUFLLEdBQUwsQ0FBUyxLQUFULENBQWUsT0FBZixHQUF5QixLQUFLLE1BQUwsQ0FBWSxPQUFyQzs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsYUFBTyxLQUFLLEdBQVo7QUFDRDs7OzJCQUVNLGdCLEVBQWtCLEssRUFBTztBQUM5QjtBQUNBLFVBQU0sY0FBYyxpQkFBaUIsWUFBakIsR0FBZ0MsVUFBaEMsR0FBNkMsT0FBakU7QUFDQSxVQUFNLGFBQWEsTUFBTSxNQUF6QjtBQUNBLFVBQU0sV0FBVyxhQUFhLEtBQUssTUFBTCxDQUFZLFVBQTFDO0FBQ0EsVUFBTSxRQUFRLGlCQUFpQixXQUFqQixDQUE2QixRQUE3QixDQUFkO0FBQ0EsVUFBTSxrQkFBa0IsYUFBYSxLQUFyQzs7QUFFQSxVQUFJLENBQUMsZUFBRCxJQUFvQixNQUFNLE1BQU4sR0FBZSxlQUF2QyxFQUF3RDtBQUFFO0FBQVM7O0FBRW5FO0FBQ0E7QUFDQSxVQUFJLE9BQU8sS0FBSyxHQUFMLENBQVMsQ0FBQyxpQkFBaUIsT0FBM0IsRUFBb0MsQ0FBcEMsQ0FBWDtBQUNBLFVBQUksYUFBYSxpQkFBaUIsWUFBakIsR0FBZ0MsaUJBQWlCLE1BQWxFO0FBQ0EsVUFBSSxhQUFhLENBQWpCLEVBQW9CO0FBQUUsZUFBTyxDQUFDLFVBQVI7QUFBcUI7O0FBRTNDLFVBQUksT0FBTyxJQUFYO0FBQ0EsY0FBUyxpQkFBaUIsS0FBakIsR0FBeUIsSUFBekIsR0FBZ0MsaUJBQWlCLFlBQWxELEdBQ04saUJBQWlCLEtBRFgsR0FDbUIsaUJBQWlCLFlBRDVDOztBQUdBO0FBQ0EsVUFBTSxTQUFTLGlCQUFpQixXQUFqQixDQUE2QixNQUE1QztBQUNBLFVBQU0sYUFBYSxLQUFLLE1BQUwsQ0FBWSxVQUEvQjtBQUNBLFVBQU0sU0FBUyxFQUFmOztBQUVBLFdBQUssSUFBSSxLQUFLLElBQWQsRUFBb0IsS0FBSyxJQUF6QixFQUErQixJQUEvQixFQUFxQztBQUNuQyxZQUFNLFlBQVksT0FBTyxFQUFQLENBQWxCO0FBQ0EsWUFBTSxjQUFjLFlBQVksVUFBaEM7QUFDQSxZQUFNLFVBQVUsTUFBTSxXQUFOLEVBQW1CLFdBQW5CLEVBQWdDLGNBQWMsZUFBOUMsQ0FBaEI7O0FBRUEsWUFBSSxNQUFNLFFBQVY7QUFDQSxZQUFJLE1BQU0sQ0FBQyxRQUFYOztBQUVBLGFBQUssSUFBSSxJQUFJLENBQVIsRUFBVyxJQUFJLFFBQVEsTUFBNUIsRUFBb0MsSUFBSSxDQUF4QyxFQUEyQyxHQUEzQyxFQUFnRDtBQUM5QyxjQUFJLFNBQVMsUUFBUSxDQUFSLENBQWI7QUFDQSxjQUFJLFNBQVMsR0FBYixFQUFrQixNQUFNLE1BQU47QUFDbEIsY0FBSSxTQUFTLEdBQWIsRUFBa0IsTUFBTSxNQUFOO0FBQ25CO0FBQ0Q7QUFDQSxjQUFNLENBQUMsU0FBUyxHQUFULENBQUQsR0FBaUIsQ0FBakIsR0FBcUIsR0FBM0I7QUFDQSxjQUFNLENBQUMsU0FBUyxHQUFULENBQUQsR0FBaUIsQ0FBakIsR0FBcUIsR0FBM0I7O0FBRUEsZUFBTyxJQUFQLENBQVksQ0FBQyxFQUFELEVBQUssR0FBTCxFQUFVLEdBQVYsQ0FBWjtBQUNEOztBQUVELFVBQUksT0FBTyxNQUFYLEVBQW1COztBQUVqQixZQUFNLFFBQVEsQ0FBZDtBQUNBLFlBQU0sTUFBUSxDQUFkO0FBQ0EsWUFBTSxNQUFRLENBQWQ7O0FBRUE7QUFDQTs7QUFFQSxZQUFJLElBQUksR0FBUjs7QUFFQSxhQUFLLElBQUksSUFBSSxDQUFSLEVBQVcsS0FBSSxPQUFPLE1BQTNCLEVBQW1DLElBQUksRUFBdkMsRUFBMEMsR0FBMUMsRUFBK0M7QUFDN0MsY0FBTSxTQUFRLE9BQU8sQ0FBUCxDQUFkO0FBQ0EsY0FBTSxJQUFLLE9BQU0sS0FBTixDQUFYO0FBQ0EsY0FBSSxLQUFLLEtBQUssS0FBTCxDQUFXLGlCQUFpQixZQUFqQixDQUE4QixPQUFNLEdBQU4sQ0FBOUIsQ0FBWCxDQUFUO0FBQ0EsY0FBSSxLQUFLLEtBQUssS0FBTCxDQUFXLGlCQUFpQixZQUFqQixDQUE4QixPQUFNLEdBQU4sQ0FBOUIsQ0FBWCxDQUFUOztBQUVBLGVBQVEsQ0FBUixTQUFhLEVBQWIsU0FBbUIsQ0FBbkIsU0FBd0IsRUFBeEI7O0FBRUEsY0FBSSxJQUFJLEtBQUksQ0FBWixFQUNFLEtBQUssR0FBTDtBQUNIOztBQUVELGFBQUssR0FBTCxDQUFTLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsR0FBOUIsRUFBbUMsQ0FBbkM7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNEO0FBQ0Y7Ozs7O2tCQUdZLFE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3SmY7Ozs7Ozs7Ozs7O0lBV3FCLFM7QUFDbkI7Ozs7O0FBS0EscUJBQVksUUFBWixFQUFzQjtBQUFBOztBQUNwQjs7OztBQUlBLFNBQUssUUFBTCxHQUFnQixRQUFoQjtBQUNEOztBQUVEOzs7Ozs7Ozs7OztBQWtCQTs7OzRCQUdRLENBQUU7O0FBRVY7Ozs7OzsyQkFHTyxDQUFFOztBQUVUOzs7Ozs7Ozs7Ozs7Z0NBU1ksQyxFQUFHLFMsRUFBVyxDQUFFOzs7d0JBaENmO0FBQ1gsYUFBTyxLQUFLLFFBQUwsQ0FBYyxNQUFyQjtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLYTtBQUNYLGFBQU8sS0FBSyxRQUFMLENBQWMsTUFBZCxDQUFxQixNQUE1QjtBQUNEOzs7OztrQkE5QmtCLFM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDWHJCOzs7Ozs7QUFHQTs7Ozs7O0lBTXFCLGU7OztBQUNuQiwyQkFBWSxRQUFaLEVBQXNCLGNBQXRCLEVBQXNDO0FBQUE7O0FBQUEsd0pBQzlCLFFBRDhCOztBQUdwQyxVQUFLLGNBQUwsR0FBc0IsY0FBdEI7QUFDQSxVQUFLLGtCQUFMLEdBQTBCLElBQTFCO0FBQ0EsVUFBSyxhQUFMLEdBQXFCLElBQXJCO0FBTG9DO0FBTXJDOzs7OzRCQUVPLENBQUU7OzsyQkFDSCxDQUFFOzs7Z0NBRUcsQyxFQUFHLFMsRUFBVztBQUN4QixjQUFRLEVBQUUsSUFBVjtBQUNFLGFBQUssV0FBTDtBQUNFLGVBQUssV0FBTCxDQUFpQixDQUFqQixFQUFvQixTQUFwQjtBQUNBO0FBQ0YsYUFBSyxXQUFMO0FBQ0UsZUFBSyxXQUFMLENBQWlCLENBQWpCLEVBQW9CLFNBQXBCO0FBQ0E7QUFDRixhQUFLLFNBQUw7QUFDRSxlQUFLLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLFNBQWxCO0FBQ0E7QUFUSjtBQVdEOzs7Z0NBRVcsQyxFQUFHLFMsRUFBVztBQUFBOztBQUN4QixXQUFLLFNBQUwsR0FBaUIsSUFBakI7QUFDQTtBQUNBLFdBQUssYUFBTCxHQUFxQixFQUFFLE1BQXZCO0FBQ0EsVUFBSSxlQUFlLElBQW5COztBQUVBLFVBQU0sU0FBUyxTQUFmOztBQUVBLGFBQU8sT0FBUCxDQUFlLFVBQUMsS0FBRCxFQUFXO0FBQ3hCLGNBQU0sUUFBTjtBQUNBLFlBQU0sT0FBTyxNQUFNLHFCQUFOLENBQTRCLEVBQUUsTUFBOUIsQ0FBYjs7QUFFQSxZQUFJLFNBQVMsSUFBYixFQUFtQjtBQUNqQjtBQUNBLGNBQU0sT0FBTyxNQUFNLFdBQU4sQ0FBa0IsTUFBbEIsQ0FBeUIsRUFBRSxDQUEzQixJQUFnQyxPQUFLLFFBQUwsQ0FBYyxNQUEzRDtBQUNBLGNBQU0sUUFBUSxNQUFNLFlBQU4sQ0FBbUIsTUFBbkIsQ0FBMEIsTUFBTSxNQUFOLENBQWEsTUFBYixHQUFzQixFQUFFLENBQWxELENBQWQ7QUFDQSxjQUFNLFFBQVEsT0FBSyxjQUFMLENBQW9CLElBQXBCLEVBQTBCLEtBQTFCLENBQWQ7O0FBRUEsZ0JBQU0sSUFBTixDQUFXLElBQVgsQ0FBZ0IsS0FBaEI7QUFDQSx5QkFBZSxLQUFmO0FBQ0QsU0FSRCxNQVFPO0FBQ0w7QUFDQSxjQUFJLEVBQUUsYUFBRixDQUFnQixRQUFwQixFQUE4QjtBQUM1QixnQkFBTSxPQUFPLE1BQU0sSUFBbkI7QUFDQSxnQkFBTSxTQUFRLE1BQU0sZ0JBQU4sQ0FBdUIsSUFBdkIsQ0FBZDtBQUNBLGlCQUFLLE1BQUwsQ0FBWSxLQUFLLE9BQUwsQ0FBYSxNQUFiLENBQVosRUFBaUMsQ0FBakM7O0FBRUEsMkJBQWUsS0FBZjtBQUNELFdBTkQsTUFNTztBQUNMLG1CQUFLLGtCQUFMLEdBQTBCLEtBQTFCO0FBQ0Esa0JBQU0sTUFBTixDQUFhLElBQWI7QUFDRDtBQUNGO0FBQ0YsT0F6QkQ7O0FBMkJBLFVBQUksWUFBSixFQUFrQjtBQUNoQixhQUFLLFFBQUwsQ0FBYyxNQUFkLENBQXFCLE1BQXJCLENBQTRCLFlBQTVCO0FBQ0EsYUFBSyxRQUFMLENBQWMsTUFBZCxDQUFxQixNQUFyQixDQUE0QixZQUE1QjtBQUNEO0FBQ0Y7OztnQ0FFVyxDLEVBQUc7QUFBQTs7QUFDYixVQUFJLENBQUMsS0FBSyxTQUFOLElBQW1CLENBQUMsS0FBSyxrQkFBN0IsRUFBaUQ7QUFBRTtBQUFTOztBQUU1RCxVQUFNLFFBQVEsS0FBSyxrQkFBbkI7QUFDQSxVQUFNLFFBQVEsTUFBTSxhQUFwQjtBQUNBO0FBQ0EsWUFBTSxPQUFOLENBQWMsVUFBQyxJQUFELEVBQVU7QUFDdEIsY0FBTSxJQUFOLENBQVcsSUFBWCxFQUFpQixFQUFFLEVBQW5CLEVBQXVCLEVBQUUsRUFBekIsRUFBNkIsT0FBSyxhQUFsQztBQUNELE9BRkQ7O0FBSUEsWUFBTSxNQUFOLENBQWEsS0FBYjtBQUNEOzs7OEJBRVMsQyxFQUFHO0FBQ1gsV0FBSyxrQkFBTCxHQUEwQixJQUExQjtBQUNBLFdBQUssU0FBTCxHQUFpQixLQUFqQjtBQUNEOzs7OztrQkFuRmtCLGU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVHJCOzs7O0FBQ0E7Ozs7OztBQUdBOzs7Ozs7O0lBT3FCLGM7OztBQUNuQiwwQkFBWSxRQUFaLEVBQXNCO0FBQUE7QUFBQSxpSkFDZCxRQURjO0FBRXJCOzs7O2dDQUVXLEMsRUFBRztBQUNiLGNBQU8sRUFBRSxJQUFUO0FBQ0UsYUFBSyxXQUFMO0FBQ0UsZUFBSyxXQUFMLENBQWlCLENBQWpCO0FBQ0E7QUFDRixhQUFLLFdBQUw7QUFDRSxlQUFLLFdBQUwsQ0FBaUIsQ0FBakI7QUFDQTtBQUNGLGFBQUssU0FBTDtBQUNFLGVBQUssU0FBTCxDQUFlLENBQWY7QUFDQTtBQUNGLGFBQUssU0FBTDtBQUNFLGVBQUssU0FBTCxDQUFlLENBQWY7QUFDQTtBQVpKO0FBY0Q7OztnQ0FFVyxDLEVBQUc7QUFBQTs7QUFDYixXQUFLLE9BQUwsR0FBZSxFQUFmO0FBQ0EsV0FBSyxNQUFMLEdBQWMsRUFBRSxDQUFoQjtBQUNBO0FBQ0EsV0FBSyxNQUFMLENBQVksT0FBWixDQUFvQixVQUFDLEtBQUQsRUFBVztBQUM3QixZQUFNLGVBQWUsTUFBTSxhQUEzQjs7QUFFQSxZQUFNLFFBQVEsU0FBUyxlQUFULHNCQUE2QixNQUE3QixDQUFkO0FBQ0EsY0FBTSxjQUFOLENBQXFCLElBQXJCLEVBQTJCLFFBQTNCLEVBQXFDLE1BQU0sTUFBM0M7QUFDQSxjQUFNLGNBQU4sQ0FBcUIsSUFBckIsRUFBMkIsR0FBM0IsRUFBZ0MsQ0FBaEM7QUFDQSxjQUFNLEtBQU4sQ0FBWSxJQUFaLEdBQW1CLFNBQW5CO0FBQ0EsY0FBTSxLQUFOLENBQVksT0FBWixHQUFzQixHQUF0Qjs7QUFFQSxxQkFBYSxXQUFiLENBQXlCLEtBQXpCOztBQUVBLGVBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsS0FBbEI7QUFDRCxPQVpEO0FBYUQ7OztnQ0FFVyxDLEVBQUc7QUFDYjtBQUNBLFVBQU0sUUFBUSxLQUFLLEdBQUwsQ0FBUyxFQUFFLENBQUYsR0FBTSxLQUFLLE1BQXBCLENBQWQ7QUFDQSxVQUFNLElBQUksS0FBSyxHQUFMLENBQVMsRUFBRSxDQUFYLEVBQWMsS0FBSyxNQUFuQixDQUFWOztBQUVBLFdBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsVUFBQyxLQUFELEVBQVc7QUFDOUIsY0FBTSxjQUFOLENBQXFCLElBQXJCLEVBQTJCLE9BQTNCLEVBQW9DLEtBQXBDO0FBQ0EsY0FBTSxjQUFOLENBQXFCLElBQXJCLEVBQTJCLEdBQTNCLEVBQWdDLENBQWhDO0FBQ0QsT0FIRDtBQUlEOzs7OEJBRVMsQyxFQUFHO0FBQ1g7QUFDQSxXQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFVBQUMsS0FBRCxFQUFXO0FBQzlCLGNBQU0sVUFBTixDQUFpQixXQUFqQixDQUE2QixLQUE3QjtBQUNELE9BRkQ7O0FBSUE7QUFDQSxVQUFNLFNBQVMsS0FBSyxNQUFwQjtBQUNBLFVBQU0sT0FBTyxFQUFFLENBQWY7QUFDQTtBQUNBLFVBQUksS0FBSyxHQUFMLENBQVMsU0FBUyxJQUFsQixJQUEwQixDQUE5QixFQUFpQztBQUFFO0FBQVM7O0FBRTVDLFVBQU0sUUFBUSxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksS0FBSyxHQUFMLENBQVMsTUFBVCxFQUFpQixJQUFqQixDQUFaLENBQWQ7QUFDQSxVQUFNLFNBQVMsS0FBSyxHQUFMLENBQVMsTUFBVCxFQUFpQixJQUFqQixDQUFmOztBQUVBLFVBQUksVUFBVSxLQUFLLFFBQUwsQ0FBYyxXQUFkLENBQTBCLE1BQTFCLENBQWlDLEtBQWpDLENBQWQ7QUFDQSxVQUFJLFVBQVUsS0FBSyxRQUFMLENBQWMsV0FBZCxDQUEwQixNQUExQixDQUFpQyxNQUFqQyxDQUFkOztBQUVBLFVBQU0sZ0JBQWdCLFVBQVUsT0FBaEM7QUFDQSxVQUFNLE9BQU8sS0FBSyxRQUFMLENBQWMsZUFBZCxHQUFnQyxhQUE3Qzs7QUFFQSxXQUFLLFFBQUwsQ0FBYyxNQUFkLElBQXdCLE9BQXhCO0FBQ0EsV0FBSyxRQUFMLENBQWMsSUFBZCxJQUFzQixJQUF0Qjs7QUFFQSxXQUFLLE1BQUwsQ0FBWSxNQUFaO0FBQ0Q7Ozs4QkFFUyxDLEVBQUc7QUFDWDtBQUNBLFVBQUksRUFBRSxhQUFGLENBQWdCLE9BQWhCLEtBQTRCLEVBQWhDLEVBQW9DO0FBQ2xDLGFBQUssUUFBTCxDQUFjLE1BQWQsR0FBdUIsQ0FBdkI7QUFDQSxhQUFLLFFBQUwsQ0FBYyxJQUFkLEdBQXFCLENBQXJCO0FBQ0EsYUFBSyxNQUFMLENBQVksTUFBWjtBQUNEO0FBQ0Y7Ozs7O2tCQXRGa0IsYzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNYckI7Ozs7QUFDQTs7Ozs7O0FBR0E7Ozs7Ozs7OztJQVNxQixpQjs7O0FBQ25CLDZCQUFZLFFBQVosRUFBc0I7QUFBQTs7QUFBQSw0SkFDZCxRQURjOztBQUVwQixVQUFLLFlBQUwsR0FBb0IsSUFBcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQUssT0FBTCxHQUFlLFFBQVEsQ0FBUixHQUFZLE1BQUssUUFBTCxDQUFjLFdBQWQsQ0FBMEIsZUFBckQ7QUFDQSxVQUFLLE9BQUwsR0FBZSxRQUFRLElBQVIsR0FBZSxNQUFLLFFBQUwsQ0FBYyxXQUFkLENBQTBCLGVBQXhEO0FBUm9CO0FBU3JCOzs7O2dDQUVXLEMsRUFBRztBQUNiLGNBQU8sRUFBRSxJQUFUO0FBQ0UsYUFBSyxXQUFMO0FBQ0UsZUFBSyxXQUFMLENBQWlCLENBQWpCO0FBQ0E7QUFDRixhQUFLLFdBQUw7QUFDRSxlQUFLLFdBQUwsQ0FBaUIsQ0FBakI7QUFDQTtBQUNGLGFBQUssU0FBTDtBQUNFLGVBQUssU0FBTCxDQUFlLENBQWY7QUFDQTtBQVRKO0FBV0Q7OztnQ0FFVyxDLEVBQUc7QUFDYixXQUFLLFdBQUwsR0FBbUIsS0FBSyxRQUFMLENBQWMsV0FBZCxDQUEwQixJQUE3QztBQUNBLFdBQUssUUFBTCxHQUFnQixFQUFFLENBQWxCOztBQUVBLFdBQUssZ0JBQUwsR0FBd0IsaUJBQU8sTUFBUCxHQUNyQixNQURxQixDQUNkLENBQUMsQ0FBRCxFQUFJLEdBQUosQ0FEYyxFQUNKO0FBREksT0FFckIsS0FGcUIsQ0FFZixDQUFDLENBQUQsRUFBSSxDQUFKLENBRmUsQ0FBeEI7QUFHRDs7O2dDQUVXLEMsRUFBRztBQUNiO0FBQ0EsUUFBRSxhQUFGLENBQWdCLGNBQWhCOztBQUVBLFVBQU0sY0FBYyxLQUFLLFFBQUwsQ0FBYyxXQUFsQztBQUNBLFVBQU0saUJBQWlCLFlBQVksV0FBWixDQUF3QixNQUF4QixDQUErQixFQUFFLENBQWpDLENBQXZCO0FBQ0EsVUFBTSxXQUFXLEtBQUssZ0JBQUwsQ0FBc0IsRUFBRSxDQUFGLEdBQU0sS0FBSyxRQUFqQyxDQUFqQjtBQUNBLFVBQU0sYUFBYSxLQUFLLFdBQUwsR0FBbUIsS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLFFBQVosQ0FBdEMsQ0FQYSxDQU9nRDs7QUFFN0Qsa0JBQVksSUFBWixHQUFtQixLQUFLLEdBQUwsQ0FBUyxLQUFLLEdBQUwsQ0FBUyxVQUFULEVBQXFCLEtBQUssT0FBMUIsQ0FBVCxFQUE2QyxLQUFLLE9BQWxELENBQW5COztBQUVBLFVBQU0sZ0JBQWdCLFlBQVksV0FBWixDQUF3QixNQUF4QixDQUErQixFQUFFLENBQWpDLENBQXRCO0FBQ0EsVUFBTSxRQUFRLGdCQUFnQixjQUE5Qjs7QUFFQTtBQUNBLGtCQUFZLE1BQVosSUFBdUIsUUFBUSxZQUFZLFdBQVosQ0FBd0IsTUFBeEIsQ0FBK0IsRUFBRSxFQUFqQyxDQUEvQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBSyxRQUFMLENBQWMsTUFBZCxDQUFxQixNQUFyQjtBQUNEOzs7OEJBRVMsQyxFQUFHLENBQUU7Ozs7O2tCQXBFSSxpQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNickI7Ozs7QUFDQTs7Ozs7O0FBR0E7Ozs7O0lBS3FCLG1COzs7QUFDbkIsK0JBQVksUUFBWixFQUFzQjtBQUFBO0FBQUEsMkpBQ2QsUUFEYztBQUVyQjs7OztnQ0FFVyxDLEVBQUc7QUFDYixjQUFPLEVBQUUsSUFBVDtBQUNFLGFBQUssV0FBTDtBQUNFLGVBQUssV0FBTCxDQUFpQixDQUFqQjtBQUNBO0FBQ0YsYUFBSyxXQUFMO0FBQ0UsZUFBSyxXQUFMLENBQWlCLENBQWpCO0FBQ0E7QUFDRixhQUFLLFNBQUw7QUFDRSxlQUFLLFNBQUwsQ0FBZSxDQUFmO0FBQ0E7QUFUSjtBQVdEOzs7Z0NBRVcsQyxFQUFHO0FBQ2IsV0FBSyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsV0FBSyxhQUFMLEdBQXFCLEVBQUUsTUFBdkI7O0FBRUEsV0FBSyxJQUFJLElBQUksQ0FBUixFQUFXLElBQUksS0FBSyxNQUFMLENBQVksTUFBaEMsRUFBd0MsSUFBSSxDQUE1QyxFQUErQyxHQUEvQyxFQUFvRDtBQUNsRCxZQUFNLFFBQVEsS0FBSyxNQUFMLENBQVksQ0FBWixDQUFkO0FBQ0EsWUFBSSxNQUFNLFVBQU4sQ0FBaUIsRUFBRSxNQUFuQixDQUFKLEVBQWdDO0FBQzlCLGVBQUssWUFBTCxHQUFvQixLQUFwQjtBQUNBO0FBQ0Q7QUFDRjtBQUNGOzs7Z0NBRVcsQyxFQUFHO0FBQ2IsVUFBSSxDQUFDLEtBQUssU0FBTixJQUFtQixDQUFDLEtBQUssWUFBN0IsRUFBMkM7QUFBRTtBQUFTOztBQUV0RCxVQUFNLFFBQVEsS0FBSyxZQUFuQjtBQUNBLFVBQU0sU0FBUyxLQUFLLGFBQXBCOztBQUVBO0FBQ0EsVUFBSSxDQUFDLEVBQUUsYUFBRixDQUFnQixRQUFyQixFQUErQjtBQUM3QixjQUFNLFdBQU4sQ0FBa0IsRUFBRSxFQUFwQixFQUF3QixFQUFFLEVBQTFCLEVBQThCLE1BQTlCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsY0FBTSxjQUFOLENBQXFCLEVBQUUsRUFBdkIsRUFBMkIsRUFBRSxFQUE3QixFQUFpQyxNQUFqQztBQUNEOztBQUVELFdBQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsTUFBckIsQ0FBNEIsS0FBNUI7QUFDRDs7OzhCQUVTLEMsRUFBRztBQUNYLFdBQUssU0FBTCxHQUFpQixLQUFqQjtBQUNBLFdBQUssYUFBTCxHQUFxQixJQUFyQjtBQUNBLFdBQUssWUFBTCxHQUFvQixJQUFwQjtBQUNEOzs7OztrQkFwRGtCLG1COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1RyQjs7Ozs7O0FBR0E7OztJQUdNLFk7OztBQUNKLHdCQUFZLFFBQVosRUFBc0I7QUFBQTs7QUFBQSxrSkFDZCxRQURjOztBQUdwQixVQUFLLGtCQUFMLEdBQTBCLElBQTFCO0FBQ0EsVUFBSyxhQUFMLEdBQXFCLElBQXJCO0FBSm9CO0FBS3JCOzs7OzRCQUVPLENBQUU7OzsyQkFDSCxDQUFFOzs7Z0NBRUcsQyxFQUFHO0FBQ2IsY0FBUSxFQUFFLElBQVY7QUFDRSxhQUFLLFdBQUw7QUFDRSxlQUFLLFdBQUwsQ0FBaUIsQ0FBakI7QUFDQTtBQUNGLGFBQUssV0FBTDtBQUNFLGVBQUssV0FBTCxDQUFpQixDQUFqQjtBQUNBO0FBQ0YsYUFBSyxTQUFMO0FBQ0UsZUFBSyxTQUFMLENBQWUsQ0FBZjtBQUNBO0FBVEo7QUFXRDs7O2dDQUVXLEMsRUFBRztBQUNiLFdBQUssYUFBTCxHQUFxQixFQUFFLE1BQXZCO0FBQ0Q7OztnQ0FFVyxDLEVBQUc7QUFBQTs7QUFDYixXQUFLLE1BQUwsQ0FBWSxPQUFaLENBQW9CLFVBQUMsS0FBRCxFQUFXO0FBQzdCLFlBQU0sUUFBUSxNQUFNLGFBQXBCOztBQUVBLGNBQU0sSUFBTixDQUFXLEtBQVgsRUFBa0IsRUFBRSxFQUFwQixFQUF3QixFQUFFLEVBQTFCLEVBQThCLE9BQUssYUFBbkM7QUFDQSxjQUFNLE1BQU4sQ0FBYSxLQUFiO0FBQ0QsT0FMRDtBQU1EOzs7OEJBRVMsQyxFQUFHO0FBQ1gsV0FBSyxrQkFBTCxHQUEwQixJQUExQjtBQUNBLFdBQUssU0FBTCxHQUFpQixLQUFqQjtBQUNEOzs7OztrQkFHWSxZOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRGY7Ozs7QUFDQTs7Ozs7O0FBR0E7OztJQUdxQixjOzs7QUFDbkIsMEJBQVksUUFBWixDQUFxQixtQkFBckIsRUFBMEM7QUFBQTs7QUFBQSxzSkFDbEMsUUFEa0MsQ0FDekIsY0FEeUI7O0FBR3hDLFVBQUssWUFBTCxHQUFvQixJQUFwQjtBQUNBO0FBQ0EsVUFBSyxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsVUFBSyxTQUFMLEdBQWlCLEtBQWpCO0FBQ0EsVUFBSyxRQUFMLEdBQWdCLEtBQWhCOztBQUVBLFVBQUssc0JBQUwsR0FBOEIsbUJBQTlCO0FBVHdDO0FBVXpDOzs7OzRCQUVPLENBRVA7OzsyQkFFTTtBQUNMLFVBQU0sYUFBYSxLQUFLLFFBQUwsQ0FBYyxVQUFqQzs7QUFFQSxXQUFLLElBQUksRUFBVCxJQUFlLFVBQWYsRUFBMkI7QUFDekIsYUFBSyxZQUFMLENBQWtCLFdBQVcsRUFBWCxDQUFsQjtBQUNEO0FBQ0Y7OztnQ0FFVyxDLEVBQUc7QUFDYixjQUFRLEVBQUUsSUFBVjtBQUNFLGFBQUssV0FBTDtBQUNFLGVBQUssV0FBTCxDQUFpQixDQUFqQjtBQUNBO0FBQ0YsYUFBSyxXQUFMO0FBQ0UsZUFBSyxXQUFMLENBQWlCLENBQWpCO0FBQ0E7QUFDRixhQUFLLFNBQUw7QUFDRSxlQUFLLFNBQUwsQ0FBZSxDQUFmO0FBQ0E7QUFDRixhQUFLLE9BQUw7QUFDRSxlQUFLLE9BQUwsQ0FBYSxDQUFiO0FBQ0E7QUFDRixhQUFLLFNBQUw7QUFDRSxlQUFLLEtBQUwsQ0FBVyxDQUFYO0FBQ0E7QUFDRixhQUFLLE9BQUw7QUFDRSxlQUFLLEtBQUwsQ0FBVyxDQUFYO0FBQ0E7QUFsQko7QUFvQkQ7Ozs4QkFFUyxLLEVBQU87QUFDZixVQUFJLE1BQU0sTUFBVixFQUFrQjtBQUFFO0FBQVM7O0FBRTdCLFVBQU0sUUFBUSxTQUFTLGVBQVQsc0JBQTZCLE1BQTdCLENBQWQ7QUFDQSxZQUFNLEtBQU4sQ0FBWSxJQUFaLEdBQW1CLFNBQW5CO0FBQ0EsWUFBTSxLQUFOLENBQVksT0FBWixHQUFzQixHQUF0Qjs7QUFFQSxZQUFNLGFBQU4sQ0FBb0IsV0FBcEIsQ0FBZ0MsS0FBaEM7QUFDQSxZQUFNLE1BQU4sR0FBZSxLQUFmO0FBQ0Q7OztpQ0FFWSxLLEVBQU87QUFDbEIsVUFBSSxNQUFNLE1BQU4sS0FBaUIsSUFBckIsRUFBMkI7QUFBRTtBQUFTOztBQUV0QyxXQUFLLFdBQUwsQ0FBaUIsS0FBakI7QUFDQSxZQUFNLGFBQU4sQ0FBb0IsV0FBcEIsQ0FBZ0MsTUFBTSxNQUF0QztBQUNBLGFBQU8sTUFBTSxNQUFiO0FBQ0Q7OztnQ0FFVyxLLEVBQU87QUFDakIsVUFBTSxTQUFTLE1BQU0sTUFBckI7QUFDQTtBQUNBLGFBQU8sY0FBUCxDQUFzQixJQUF0QixFQUE0QixXQUE1QixFQUF5QyxpQkFBekM7QUFDQSxhQUFPLGNBQVAsQ0FBc0IsSUFBdEIsRUFBNEIsT0FBNUIsRUFBcUMsQ0FBckM7QUFDQSxhQUFPLGNBQVAsQ0FBc0IsSUFBdEIsRUFBNEIsUUFBNUIsRUFBc0MsQ0FBdEM7QUFDRDs7O2lDQUVZLEMsRUFBRyxLLEVBQU87QUFDckIsVUFBTSxTQUFTLE1BQU0sTUFBckI7QUFDQSxVQUFNLDJCQUF5QixFQUFFLElBQUYsQ0FBTyxJQUFoQyxVQUF5QyxFQUFFLElBQUYsQ0FBTyxHQUFoRCxNQUFOOztBQUVBLGFBQU8sY0FBUCxDQUFzQixJQUF0QixFQUE0QixXQUE1QixFQUF5QyxTQUF6QztBQUNBLGFBQU8sY0FBUCxDQUFzQixJQUF0QixFQUE0QixPQUE1QixFQUFxQyxFQUFFLElBQUYsQ0FBTyxLQUE1QztBQUNBLGFBQU8sY0FBUCxDQUFzQixJQUF0QixFQUE0QixRQUE1QixFQUFzQyxFQUFFLElBQUYsQ0FBTyxNQUE3QztBQUNEOzs7MEJBRUssQyxFQUFHO0FBQ1AsV0FBSyxRQUFMLEdBQWdCLEVBQUUsUUFBbEI7QUFDRDs7O2dDQUVXLEMsRUFBRztBQUFBOztBQUNiLFdBQUssYUFBTCxHQUFxQixLQUFLLFFBQUwsQ0FBYyxzQkFBZCxDQUFxQyxFQUFFLE1BQXZDLENBQXJCO0FBQ0EsVUFBSSxDQUFDLEtBQUssYUFBVixFQUF5QjtBQUFFO0FBQVM7O0FBRXBDLFdBQUssU0FBTCxDQUFlLEtBQUssYUFBcEI7O0FBRUE7QUFDQSxXQUFLLHNCQUFMLEdBQThCLG1CQUE5QjtBQUNBLFdBQUssYUFBTCxDQUFtQixNQUFuQixDQUEwQixPQUExQixDQUFrQyxVQUFDLEtBQUQsRUFBVztBQUMzQyxlQUFLLHNCQUFMLENBQTRCLEdBQTVCLENBQWdDLEtBQWhDLEVBQXVDLE1BQU0sYUFBTixDQUFvQixLQUFwQixDQUEwQixDQUExQixDQUF2QztBQUNELE9BRkQ7QUFHRDs7O2dDQUVXLEMsRUFBRztBQUFBOztBQUNiLFdBQUssWUFBTCxDQUFrQixDQUFsQixFQUFxQixLQUFLLGFBQTFCOztBQUVBLFdBQUssYUFBTCxDQUFtQixNQUFuQixDQUEwQixPQUExQixDQUFrQyxVQUFDLEtBQUQsRUFBVztBQUMzQyxZQUFNLG1CQUFtQixNQUFNLGFBQS9CO0FBQ0EsWUFBTSxlQUFlLE1BQU0sY0FBTixDQUFxQixFQUFFLElBQXZCLENBQXJCOztBQUVBO0FBQ0EsWUFBSSxDQUFDLEVBQUUsYUFBRixDQUFnQixRQUFyQixFQUErQjtBQUM3QixnQkFBTSxRQUFOLENBQWUsZ0JBQWY7QUFDQSxnQkFBTSxNQUFOLENBQWEsWUFBYjtBQUNELFNBSEQsTUFHTztBQUNMLGNBQU0sV0FBVyxFQUFqQjtBQUNBLGNBQU0sYUFBYSxFQUFuQjtBQUNBO0FBQ0EsY0FBTSxvQkFBb0IsT0FBSyxzQkFBTCxDQUE0QixHQUE1QixDQUFnQyxLQUFoQyxDQUExQjtBQUNBOztBQUVBLHVCQUFhLE9BQWIsQ0FBcUIsVUFBQyxJQUFELEVBQVU7QUFDN0IsZ0JBQUksa0JBQWtCLE9BQWxCLENBQTBCLElBQTFCLE1BQW9DLENBQUMsQ0FBekMsRUFBNEM7QUFDMUMsdUJBQVMsSUFBVCxDQUFjLElBQWQ7QUFDRCxhQUZELE1BRU87QUFDTCx5QkFBVyxJQUFYLENBQWdCLElBQWhCO0FBQ0Q7QUFDRixXQU5EOztBQVFBLDJCQUFpQixPQUFqQixDQUF5QixVQUFDLElBQUQsRUFBVTtBQUNqQyxnQkFDRSxhQUFhLE9BQWIsQ0FBcUIsSUFBckIsTUFBK0IsQ0FBQyxDQUFoQyxJQUNBLGtCQUFrQixPQUFsQixDQUEwQixJQUExQixNQUFvQyxDQUFDLENBRnZDLEVBR0U7QUFDQSx5QkFBVyxJQUFYLENBQWdCLElBQWhCO0FBQ0Q7QUFDRixXQVBEOztBQVNBLGdCQUFNLFFBQU4sQ0FBZSxVQUFmO0FBQ0EsZ0JBQU0sTUFBTixDQUFhLFFBQWI7QUFDRDtBQUNGLE9BbkNEO0FBb0NEOzs7OEJBRVMsQyxFQUFHO0FBQ1gsV0FBSyxZQUFMLENBQWtCLEtBQUssYUFBdkI7QUFDRDs7OzRCQUVPLEMsRUFBRztBQUNULFVBQUksQ0FBQyxLQUFLLGFBQVYsRUFBeUI7QUFBRTtBQUFTOztBQUVwQyxXQUFLLGFBQUwsQ0FBbUIsTUFBbkIsQ0FBMEIsT0FBMUIsQ0FBa0MsVUFBQyxLQUFELEVBQVc7QUFDM0MsWUFBSSxPQUFPLE1BQU0scUJBQU4sQ0FBNEIsRUFBRSxNQUE5QixDQUFYOztBQUVBLFlBQUksQ0FBQyxFQUFFLGFBQUYsQ0FBZ0IsUUFBckIsRUFBK0I7QUFDN0IsZ0JBQU0sUUFBTjtBQUNEOztBQUVELFlBQUksSUFBSixFQUFVO0FBQ1IsZ0JBQU0sZUFBTixDQUFzQixJQUF0QjtBQUNEO0FBQ0YsT0FWRDtBQVdEOzs7OztrQkFoS2tCLGM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDUHJCOzs7Ozs7QUFHQTs7O0lBR3FCLGtCOzs7QUFDbkIsOEJBQVksUUFBWixFQUFzQjtBQUFBOztBQUFBLDhKQUNkLFFBRGM7O0FBR3BCLFVBQUssa0JBQUwsR0FBMEIsSUFBMUI7QUFDQSxVQUFLLGFBQUwsR0FBcUIsSUFBckI7QUFKb0I7QUFLckI7Ozs7NEJBRU8sQ0FBRTs7OzJCQUNILENBQUU7OztnQ0FFRyxDLEVBQUc7QUFDYixjQUFRLEVBQUUsSUFBVjtBQUNFLGFBQUssV0FBTDtBQUNFLGVBQUssV0FBTCxDQUFpQixDQUFqQjtBQUNBO0FBQ0YsYUFBSyxXQUFMO0FBQ0UsZUFBSyxXQUFMLENBQWlCLENBQWpCO0FBQ0E7QUFDRixhQUFLLFNBQUw7QUFDRSxlQUFLLFNBQUwsQ0FBZSxDQUFmO0FBQ0E7QUFUSjtBQVdEOzs7Z0NBRVcsQyxFQUFHO0FBQUE7O0FBQ2I7QUFDQSxXQUFLLGFBQUwsR0FBcUIsRUFBRSxNQUF2Qjs7QUFFQSxXQUFLLE1BQUwsQ0FBWSxPQUFaLENBQW9CLFVBQUMsS0FBRCxFQUFXO0FBQzdCLFlBQUksQ0FBQyxNQUFNLFVBQU4sQ0FBaUIsT0FBSyxhQUF0QixDQUFMLEVBQTJDO0FBQUU7QUFBUzs7QUFFdEQsWUFBSSxDQUFDLEVBQUUsYUFBRixDQUFnQixRQUFyQixFQUErQjtBQUM3QixnQkFBTSxRQUFOO0FBQ0Q7O0FBRUQsWUFBTSxPQUFPLE1BQU0scUJBQU4sQ0FBNEIsT0FBSyxhQUFqQyxDQUFiOztBQUVBLFlBQUksU0FBUyxJQUFiLEVBQW1CO0FBQUU7QUFBUzs7QUFFOUIsZUFBSyxrQkFBTCxHQUEwQixLQUExQjtBQUNBLDhCQUFzQixZQUFXO0FBQUUsZ0JBQU0sTUFBTixDQUFhLElBQWI7QUFBcUIsU0FBeEQ7QUFDRCxPQWJEO0FBY0Q7OztnQ0FFVyxDLEVBQUc7QUFDYixVQUFJLENBQUMsS0FBSyxrQkFBVixFQUE4QjtBQUFFO0FBQVM7O0FBRXpDLFVBQU0sUUFBUSxLQUFLLGtCQUFuQjtBQUNBLFVBQU0sUUFBUSxNQUFNLGFBQXBCOztBQUVBLFlBQU0sSUFBTixDQUFXLEtBQVgsRUFBa0IsRUFBRSxFQUFwQixFQUF3QixFQUFFLEVBQTFCLEVBQThCLEtBQUssYUFBbkM7QUFDQSw0QkFBc0IsWUFBVztBQUFFLGNBQU0sTUFBTixDQUFhLEtBQWI7QUFBc0IsT0FBekQ7QUFDRDs7OzhCQUVTLEMsRUFBRztBQUNYLFdBQUssa0JBQUwsR0FBMEIsSUFBMUI7QUFDRDs7Ozs7a0JBekRrQixrQjs7Ozs7Ozs7O0FDTHJCOzs7Ozs7O0FBT08sSUFBTSw0QkFBVSxTQUFWLE9BQVUsQ0FBQyxLQUFELEVBQVEsSUFBUixFQUFjLE1BQWQsRUFBeUI7QUFDOUMsV0FBUyxFQUFULENBRDhDLENBQ2pDOztBQUViLFNBQU8sTUFBTSxNQUFOLEdBQWUsTUFBdEI7QUFDRSxZQUFRLE9BQU8sS0FBZjtBQURGLEdBR0EsT0FBTyxLQUFQO0FBQ0QsQ0FQTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNSUDs7OztJQUlxQixjO0FBQ25CLDRCQUFjO0FBQUE7O0FBQ1osU0FBSyxLQUFMLEdBQWEsSUFBYixDQURZLENBQ087QUFDbkIsU0FBSyxLQUFMLEdBQWEsSUFBYixDQUZZLENBRU87QUFDcEI7O0FBRUQ7Ozs7Ozs7d0NBR29CO0FBQ2xCLFVBQUksT0FBTyxJQUFYOztBQUVBLFdBQUssSUFBSSxHQUFULElBQWdCLEtBQUssS0FBckIsRUFBNEI7QUFDMUIsWUFBTSxNQUFNLEtBQUssS0FBTCxDQUFXLEdBQVgsQ0FBWjtBQUNBLFlBQU0sWUFBWSxJQUFJLE1BQXRCOztBQUVBLFlBQUksU0FBUyxJQUFULElBQWlCLFNBQVMsU0FBOUIsRUFBeUM7QUFDdkMsZ0JBQU0sSUFBSSxLQUFKLENBQWEsS0FBSyxTQUFMLENBQWUsV0FBZixDQUEyQixJQUF4Qyx5QkFBTjtBQUNELFNBRkQsTUFFTyxJQUFJLFNBQVMsSUFBYixFQUFtQjtBQUN4QixpQkFBTyxTQUFQO0FBQ0Q7QUFDRjtBQUNGOztBQUVEOzs7Ozs7cUNBR2lCO0FBQUE7O0FBQ2YsVUFBSSxPQUFPLG9CQUFZLEtBQUssS0FBakIsQ0FBWDs7QUFFQSxXQUFLLE9BQUwsQ0FBYSxVQUFDLEdBQUQsRUFBTSxDQUFOLEVBQVk7QUFDdkIsWUFBTSxNQUFNLE1BQUssS0FBTCxDQUFXLEdBQVgsQ0FBWjs7QUFFQSxZQUFJLE9BQUosQ0FBWSxVQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWtCO0FBQzVCLGNBQUksTUFBSyxLQUFMLENBQVcsS0FBWCxNQUFzQixTQUExQixFQUFxQyxNQUFLLEtBQUwsQ0FBVyxLQUFYLElBQW9CLEVBQXBCO0FBQ3JDLGdCQUFLLEtBQUwsQ0FBVyxLQUFYLEVBQWtCLEdBQWxCLElBQXlCLEtBQXpCO0FBQ0QsU0FIRDtBQUlELE9BUEQ7O0FBU0EsV0FBSyxpQkFBTDtBQUNEOztBQUVEOzs7Ozs7cUNBR2lCO0FBQUE7O0FBQ2YsV0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixVQUFDLEdBQUQsRUFBTSxLQUFOLEVBQWdCO0FBQ2pDLGFBQUssSUFBSSxHQUFULElBQWdCLEdBQWhCLEVBQXFCO0FBQ25CLGNBQUksVUFBVSxDQUFkLEVBQWlCLE9BQUssS0FBTCxDQUFXLEdBQVgsSUFBa0IsRUFBbEI7QUFDakIsaUJBQUssS0FBTCxDQUFXLEdBQVgsRUFBZ0IsSUFBaEIsQ0FBcUIsSUFBSSxHQUFKLENBQXJCO0FBQ0Q7QUFDRixPQUxEOztBQU9BLFdBQUssaUJBQUw7QUFDRDs7QUFFRDs7Ozs7Ozs7c0JBS1MsRyxFQUFLO0FBQ1osV0FBSyxLQUFMLEdBQWEsR0FBYjtBQUNBLFdBQUssS0FBTCxHQUFhLEVBQWI7O0FBRUEsV0FBSyxjQUFMO0FBQ0Q7O0FBRUQ7Ozs7Ozt3QkFLVztBQUNULGFBQU8sS0FBSyxLQUFaO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3NCQUtTLEcsRUFBSztBQUNaLFdBQUssS0FBTCxHQUFhLEdBQWI7QUFDQSxXQUFLLEtBQUwsR0FBYSxFQUFiOztBQUVBLFdBQUssY0FBTDtBQUNEOztBQUVEOzs7Ozs7d0JBS1c7QUFDVCxhQUFPLEtBQUssS0FBWjtBQUNEOzs7OztrQkFoR2tCLGM7Ozs7Ozs7O0FDSnJCOzs7a0JBR2U7QUFDYjs7OztBQUlBLFFBTGEsb0JBS0o7QUFDUCxRQUFJLFVBQVUsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFkO0FBQ0EsUUFBSSxTQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBYjs7QUFFQSxRQUFJLFNBQVMsQ0FBYjtBQUNBLFFBQUksYUFBYSxDQUFqQjs7QUFFQSxhQUFTLFlBQVQsR0FBd0I7QUFDdEIsZUFBUyxDQUFDLE9BQU8sQ0FBUCxJQUFZLE9BQU8sQ0FBUCxDQUFiLEtBQTJCLFFBQVEsQ0FBUixJQUFhLFFBQVEsQ0FBUixDQUF4QyxDQUFUO0FBQ0EsbUJBQWEsT0FBTyxDQUFQLElBQWEsU0FBUyxRQUFRLENBQVIsQ0FBbkM7QUFDRDs7QUFFRCxhQUFTLEtBQVQsQ0FBZ0IsS0FBaEIsRUFBdUI7QUFDckIsYUFBUSxTQUFTLEtBQVYsR0FBbUIsVUFBMUI7QUFDRDs7QUFFRCxVQUFNLE1BQU4sR0FBZSxVQUFTLEtBQVQsRUFBZ0I7QUFDN0IsYUFBTyxDQUFDLFFBQVEsVUFBVCxJQUF1QixNQUE5QjtBQUNELEtBRkQ7O0FBSUEsVUFBTSxNQUFOLEdBQWUsWUFBcUI7QUFBQSxVQUFaLEdBQVksdUVBQU4sSUFBTTs7QUFDbEMsVUFBSSxRQUFRLElBQVosRUFBa0I7QUFBRSxlQUFPLE9BQVA7QUFBaUI7O0FBRXJDLGdCQUFVLEdBQVY7QUFDQTs7QUFFQSxhQUFPLEtBQVA7QUFDRCxLQVBEOztBQVNBLFVBQU0sS0FBTixHQUFjLFlBQXFCO0FBQUEsVUFBWixHQUFZLHVFQUFOLElBQU07O0FBQ2pDLFVBQUksUUFBUSxJQUFaLEVBQWtCO0FBQUUsZUFBTyxNQUFQO0FBQWdCOztBQUVwQyxlQUFTLEdBQVQ7QUFDQTs7QUFFQSxhQUFPLEtBQVA7QUFDRCxLQVBEOztBQVNBLFdBQU8sS0FBUDtBQUNEO0FBNUNZLEM7OztBQ0hmOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxT0E7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBOztBQ0RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5pbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5cblxuLyoqXG4gKiBTaW1wbGlmaWVkIExheWVyIGZvciBBeGlzLiBUaGUgbWFpbiBkaWZmZXJlbmNlIHdpdGggYSByZWd1bGFyIGxheWVyIGlzIHRoYXRcbiAqIGFuIGF4aXMgbGF5ZXIgdXNlIHRoZSBgVGltZWxpbmV+dGltZUNvbnRleHRgIGF0dHJpYnV0ZXMgdG8gcmVuZGVyIGl0J3MgbGF5b3V0XG4gKiBhbmQgc3RheSBzeW5jaHJvbml6ZWQgd2l0aCB0aGUgdHJhY2tzIHZpc2libGUgYXJlYS4gQWxsIGdldHRlcnMgYW5kIHNldHRlcnNcbiAqIHRvIHRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAgYXR0cmlidXRlcyBhcmUgYnlwYXNzZWQuXG4gKlxuICogSXQgYWxzbyBoYW5kbGUgaXQncyBvd24gZGF0YSBhbmQgaXRzIHVwZGF0ZXMuIFRoZSBgX2dlbmVyYXRlRGF0YWAgbWV0aG9kIGlzXG4gKiByZXNwb25zaWJsZSB0byBjcmVhdGUgc29tZSB1c2VmdWxsIGRhdGEgdG8gdmlzdWFsaXplXG4gKlxuICogW2V4YW1wbGUgdXNhZ2Ugb2YgdGhlIGxheWVyLWF4aXNdKC4vZXhhbXBsZXMvbGF5ZXItYXhpcy5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBeGlzTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBnZW5lcmF0b3IgLSBBIGZ1bmN0aW9uIHRvIGNyZWF0ZSBkYXRhIGFjY29yZGluZyB0b1xuICAgKiAgICB0aGUgYFRpbWVsaW5lfnRpbWVDb250ZXh0YC5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBMYXllciBvcHRpb25zLCBjZi4gTGF5ZXIgZm9yIGF2YWlsYWJsZSBvcHRpb25zLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZ2VuZXJhdG9yLCBvcHRpb25zKSB7XG4gICAgc3VwZXIoJ2VudGl0eScsIFtdLCBvcHRpb25zKTtcbiAgICB0aGlzLl9nZW5lcmF0b3IgPSBnZW5lcmF0b3I7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc2V0IHN0cmV0Y2hSYXRpbyh2YWx1ZSkgeyByZXR1cm47IH1cbiAgLyoqIEBwcml2YXRlICovXG4gIHNldCBvZmZzZXQodmFsdWUpIHsgcmV0dXJuOyB9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzZXQgc3RhcnQodmFsdWUpIHsgcmV0dXJuOyB9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzZXQgZHVyYXRpb24odmFsdWUpIHsgcmV0dXJuOyB9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBnZXQgc3RyZXRjaFJhdGlvKCkgeyByZXR1cm47IH1cbiAgLyoqIEBwcml2YXRlICovXG4gIGdldCBvZmZzZXQoKSB7IHJldHVybjsgfVxuICAvKiogQHByaXZhdGUgKi9cbiAgZ2V0IHN0YXJ0KCkgeyByZXR1cm47IH1cbiAgLyoqIEBwcml2YXRlICovXG4gIGdldCBkdXJhdGlvbigpIHsgcmV0dXJuOyB9XG5cblxuICAvKipcbiAgICogVGhlIGdlbmVyYXRvciB0aGF0IGNyZWF0ZXMgdGhlIGRhdGEgdG8gYmUgcmVuZGVyZWQgdG8gZGlzcGxheSB0aGUgYXhpcy5cbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgc2V0IGdlbmVyYXRvcihmdW5jKSB7XG4gICAgdGhpcy5fZ2VuZXJhdG9yID0gZnVuYztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgZ2VuZXJhdG9yIHRoYXQgY3JlYXRlcyB0aGUgZGF0YSB0byBiZSByZW5kZXJlZCB0byBkaXNwbGF5IHRoZSBheGlzLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBnZXQgZ2VuZXJhdG9yKCkge1xuICAgIHJldHVybiB0aGlzLl9nZW5lcmF0b3I7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgaXMgdGhlIG1haW4gZGlmZmVyZW5jZSB3aXRoIGEgY2xhc3NpY2FsIGxheWVyLiBBbiBgQXhpc0xheWVyYFxuICAgKiBpbnN0YW5jZSBnZW5lcmF0ZXMgYW5kIG1haW50YWlucyBpdCdzIG93biBkYXRhLlxuICAgKi9cbiAgX2dlbmVyYXRlRGF0YSgpIHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5fZ2VuZXJhdG9yKHRoaXMudGltZUNvbnRleHQpO1xuICAgIC8vIHByZXBlbmQgZmlyc3QgYXJndW1lbnRzIG9mIHNwbGljZSBmb3IgYW4gYXBwbHlcbiAgICBkYXRhLnVuc2hpZnQoMCwgdGhpcy5kYXRhWzBdLmxlbmd0aCk7XG4gICAgLy8gbWFrZSBzdXJlIHRvIGtlZXAgdGhlIHNhbWUgcmVmZXJlbmNlXG4gICAgQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseSh0aGlzLmRhdGFbMF0sIGRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHJlbmRlcmluZyBjb250ZXh0IGZvciB0aGUgc2hhcGVzLlxuICAgKi9cbiAgX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKSB7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCA9IHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWw7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwgPSB0aGlzLl92YWx1ZVRvUGl4ZWw7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgLy8gdGhpcy5fcmVuZGVyaW5nQ29udGV4dC53aWR0aCAgPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24pO1xuXG4gICAgLy8gZm9yIGZvcmVpZ24gb2JqZWN0IGlzc3VlIGluIGNocm9tZVxuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQub2Zmc2V0WCA9IHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5vZmZzZXQpO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoID0gdGhpcy50aW1lQ29udGV4dC52aXNpYmxlV2lkdGg7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIHRoZSBkYXRhIGFuZCB1cGRhdGUgdGhlIGxheWVyLlxuICAgKi9cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMuX2dlbmVyYXRlRGF0YSgpO1xuICAgIHN1cGVyLnVwZGF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgRE9NIGluIG1lbW9yeSBvbiBsYXllciBjcmVhdGlvbiB0byBiZSBhYmxlIHRvIHVzZSBpdCBiZWZvcmVcbiAgICogdGhlIGxheWVyIGlzIGFjdHVhbGx5IGluc2VydGVkIGluIHRoZSBET01cbiAgICovXG4gIF9yZW5kZXJDb250YWluZXIoKSB7XG4gICAgLy8gd3JhcHBlciBncm91cCBmb3IgYHN0YXJ0LCB0b3AgYW5kIGNvbnRleHQgZmxpcCBtYXRyaXhcbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICBpZiAodGhpcy5wYXJhbXMuY2xhc3NOYW1lICE9PSBudWxsKSB7XG4gICAgICB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKCdsYXllcicsIHRoaXMucGFyYW1zLmNsYXNzTmFtZSk7XG4gICAgfVxuXG4gICAgLy8gZ3JvdXAgdG8gYXBwbHkgb2Zmc2V0XG4gICAgdGhpcy4kb2Zmc2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuJG9mZnNldC5jbGFzc0xpc3QuYWRkKCdvZmZzZXQnLCAnaXRlbXMnKTtcbiAgICAvLyBsYXllciBiYWNrZ3JvdW5kXG4gICAgdGhpcy4kYmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoJ2JhY2tncm91bmQnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnN0eWxlLmZpbGxPcGFjaXR5ID0gMDtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG4gICAgLy8gY3JlYXRlIHRoZSBET00gdHJlZVxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJG9mZnNldCk7XG4gICAgdGhpcy4kb2Zmc2V0LmFwcGVuZENoaWxkKHRoaXMuJGJhY2tncm91bmQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGxheW91dCBvZiB0aGUgbGF5ZXIuXG4gICAqL1xuICB1cGRhdGVDb250YWluZXIoKSB7XG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpO1xuXG4gICAgY29uc3QgdG9wID0gdGhpcy5wYXJhbXMudG9wO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucGFyYW1zLmhlaWdodDtcbiAgICBjb25zdCBsZWZ0ID0gTWF0aC5tYXgoMCwgLXRoaXMuX3JlbmRlcmluZ0NvbnRleHQub2Zmc2V0WCk7XG4gICAgLy8gbWF0cml4IHRvIGludmVydCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICBjb25zdCB0cmFuc2xhdGVNYXRyaXggPSBgbWF0cml4KDEsIDAsIDAsIC0xLCAwLCAke3RvcCArIGhlaWdodH0pYDtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlTWF0cml4KTtcblxuICAgIC8vIGtlZXAgYmFja2dyb3VuZCBvbiB0aGUgdmlzaWJsZSBhcmVhXG4gICAgdGhpcy4kYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHRoaXMudGltZUNvbnRleHQudmlzaWJsZVdpZHRoKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgbGVmdCk7XG4gIH1cbn1cbiIsIi8qKlxuICogQSBnZW5lcmF0b3IgdG8gY3JlYXRlIGRhdGEgZm9yIGdyaWQgYXhpcyBhY2NvcmRpbmcgdG8gYSBgYnBtYCBhbmQgYSBgbWV0ZXJgLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWF4aXMuaHRtbClcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gYnBtIC0gTnVtYmVyIG9mIGJlYXRzIHBlciBtaW51dGVzXG4gKiBAcGFyYW0ge1N0cmluZ30gc2lnbmF0dXJlIC0gTWV0ZXIgb2YgdGhlIG1lc3VyZSAoYCc0LzQnYCwgYCczLzgnYCwgLi4uKVxuICogQHJldHVybiB7RnVuY3Rpb259IC0gRnVuY3Rpb24gdGhhdCBnZW5lcmF0ZSBkYXRhIHRvIGJlIGRpcGxheWVkXG4gKi9cbmZ1bmN0aW9uIGdyaWRBeGlzR2VuZXJhdG9yKGJwbSwgc2lnbmF0dXJlKSB7XG4gIGNvbnN0IF9icHMgPSAgYnBtIC8gNjA7IC8vIHNlY1xuICBjb25zdCBfdW5pdCA9IDEgLyBwYXJzZUludChzaWduYXR1cmUuc3BsaXQoJy8nKVsxXSwgMTApO1xuICBjb25zdCBfbmJyVW5pdHNQZXJNZXN1cmUgPSBwYXJzZUludChzaWduYXR1cmUuc3BsaXQoJy8nKVswXSwgMTApO1xuXG4gIHJldHVybiBmdW5jdGlvbih0aW1lQ29udGV4dCkge1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGltZUNvbnRleHQudmlzaWJsZUR1cmF0aW9uO1xuICAgIGNvbnN0IG9mZnNldCA9IHRpbWVDb250ZXh0Lm9mZnNldDtcbiAgICBjb25zdCBkYXRhID0gW107XG5cbiAgICAvLyBjb25zdCBtaW4gPSBNYXRoLm1pbigtb2Zmc2V0LCAwKTtcbiAgICBjb25zdCBtaW4gPSAtIG9mZnNldDtcbiAgICAvLyByZW1vdmUgdGhlIHRpbWVsaW5lJ3Mgb2Zmc2V0IHRvIGtlZXAgdGhlIGxheWVyIGNlbnRlcmVkXG4gICAgY29uc3QgbWF4ID0gZHVyYXRpb24gLSBvZmZzZXQ7XG5cbiAgICAvLyBkZWZpbmUgcGl4ZWxzIGZvciAxIHNlY29uZFxuICAgIGNvbnN0IHBpeGVsc1BlclNlY29uZCA9IHRpbWVDb250ZXh0LmNvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuICAgIC8vIHRpbWUgZm9yIG9uZSBfdW5pdFxuICAgIGNvbnN0IHVuaXRUaW1lID0gMSAvIF9icHM7XG4gICAgLy8gZGVmaW5lIHRoZSBmaXJzdCB0aWNrID4gbWluXG4gICAgY29uc3QgbW9kdWxvID0gbWluICUgdW5pdFRpbWU7XG4gICAgY29uc3QgbXVsdCA9IChtaW4gLSBtb2R1bG8pIC8gdW5pdFRpbWU7XG4gICAgY29uc3QgZmlyc3RUaWNrVGltZSA9IHVuaXRUaW1lICogbXVsdDtcbiAgICAvLyB0cmFjayB3aGljaCBwb3NpdGlvbiBvZiBjdXJyZW50IGJlYXQgaW4gdGhlIG1lc3VyZVxuICAgIGxldCBwb3NpdGlvbkluTWVzdXJlID0gbXVsdCAlIF9uYnJVbml0c1Blck1lc3VyZTtcblxuICAgIC8vIHJlbW92ZSBub3QgZm9jdXNlZCBiZWF0cywgaWYgem9vbWVkIG91dFxuICAgIGNvbnN0IHBpeGVsc1BlclRpY2sgPSBwaXhlbHNQZXJTZWNvbmQgLyBfYnBzO1xuICAgIGNvbnN0IG1pblN0ZXAgPSA1O1xuXG4gICAgLy8gdGltZSBzaG91bGQgYmVcbiAgICBmb3IgKGxldCB0aW1lID0gZmlyc3RUaWNrVGltZTsgdGltZSA8IG1heDsgdGltZSArPSB1bml0VGltZSkge1xuICAgICAgLy8gZmluZCBmaXJzdCBiZWF0XG4gICAgICBjb25zdCBmb2N1c2VkID0gKHBvc2l0aW9uSW5NZXN1cmUrKyAlIF9uYnJVbml0c1Blck1lc3VyZSA9PT0gMCk7XG4gICAgICAvLyBpZ25vcmUgaWYgcGl4ZWxzIHBlciB0aWNrcyBpcyB0b28gc21hbGxcbiAgICAgIGlmICgocGl4ZWxzUGVyVGljayA8PSBtaW5TdGVwKSAmJiAhZm9jdXNlZCkgeyBjb250aW51ZTsgfVxuXG4gICAgICBkYXRhLnB1c2goeyB0aW1lLCBmb2N1c2VkIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBncmlkQXhpc0dlbmVyYXRvcjtcbiIsImltcG9ydCB7IHBhZExlZnQgfSBmcm9tICcuLi91dGlscy9mb3JtYXQnO1xuXG5cbi8qKlxuICogQSBnZW5lcmF0b3IgdG8gY3JlYXRlIGRhdGEgZm9yIHRpbWUgYXhpcy5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1heGlzLmh0bWwpXG4gKlxuICogQHJldHVybiB7RnVuY3Rpb259IC0gVGhlIGNvbmZpZ3VyZWQgZnVuY3Rpb24gcmV0dXJuaW5nIHRoZSBkYXRhIHdoZW4gY2FsbGVkLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0aW1lQXhpc0dlbmVyYXRvcigpIHtcbiAgLy8gYWRkIGZhY3RvcnkgdG8gc2hhcmUgQVBJIHdpdGggYnBtR2VuZXJhdG9yXG4gIHJldHVybiBmdW5jdGlvbih0aW1lQ29udGV4dCkge1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGltZUNvbnRleHQudmlzaWJsZUR1cmF0aW9uO1xuICAgIGNvbnN0IG9mZnNldCA9IHRpbWVDb250ZXh0Lm9mZnNldDtcbiAgICBjb25zdCBkYXRhID0gW107XG5cbiAgICAvLyBjb25zdCBtaW4gPSBNYXRoLm1pbigtb2Zmc2V0LCAwKTtcbiAgICBjb25zdCBtaW4gPSAtIG9mZnNldDtcbiAgICAvLyByZW1vdmUgdGhlIHRpbWVsaW5lJ3Mgb2Zmc2V0IHRvIGtlZXAgdGhlIGxheWVyIGNlbnRlcmVkXG4gICAgY29uc3QgbWF4ID0gZHVyYXRpb24gLSBvZmZzZXQ7XG5cbiAgICAvLyBkZWZpbmUgcGl4ZWxzIGZvciAxIHNlY29uZFxuICAgIGNvbnN0IHBpeGVsc1BlclNlY29uZCA9IHRpbWVDb250ZXh0LmNvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuICAgIGNvbnN0IG1pblN0ZXAgPSA3O1xuXG4gICAgLy8gZGVmaW5lIGFsbCBkaXNwbGF5IGluZm9ybWF0aW9uIGFjY29yZGluZyB0byB0aGUgcGl4ZWxzUGVyU2Vjb25kIHJhdGlvXG4gICAgbGV0IHN0ZXAsIHR5cGUsIHRvRml4ZWQsIG1hcmtlck1vZHVsbywgaW5jbHVkZU1vZHVsbztcblxuICAgIGlmIChwaXhlbHNQZXJTZWNvbmQgKiA0ID4gbWluU3RlcCkge1xuICAgICAgc3RlcCA9IDE7IC8vIHRoZSBzdGVwIHRvIHVzZSB0byBjb21wdXRlIHRpbWVcbiAgICAgIHRvRml4ZWQgPSAwO1xuICAgICAgbWFya2VyTW9kdWxvID0gNjA7IC8vIGEgdGltZXN0YW1wIGV2ZXJ5IDUgc3RlcGl4ZWxzUGVyU2Vjb25kXG4gICAgICBpbmNsdWRlTW9kdWxvID0gNTsgLy8gYSB0aWNrIGV2ZXJ5IDUgc3RlcGl4ZWxzUGVyU2Vjb25kXG4gICAgICB0eXBlID0gJzYwc2VjJztcbiAgICB9XG5cbiAgICBpZiAocGl4ZWxzUGVyU2Vjb25kICogMiA+IG1pblN0ZXApIHtcbiAgICAgIHN0ZXAgPSAxO1xuICAgICAgdG9GaXhlZCA9IDA7XG4gICAgICBtYXJrZXJNb2R1bG8gPSAzMDtcbiAgICAgIGluY2x1ZGVNb2R1bG8gPSAxO1xuICAgICAgdHlwZSA9ICczMHNlYyc7XG4gICAgfVxuXG4gICAgaWYgKHBpeGVsc1BlclNlY29uZCA+IG1pblN0ZXApIHtcbiAgICAgIHN0ZXAgPSAxO1xuICAgICAgdG9GaXhlZCA9IDA7XG4gICAgICBtYXJrZXJNb2R1bG8gPSAxMDtcbiAgICAgIGluY2x1ZGVNb2R1bG8gPSAxO1xuICAgICAgdHlwZSA9ICdzZWMnO1xuICAgIH1cblxuICAgIGlmIChwaXhlbHNQZXJTZWNvbmQgLyAxMCA+IG1pblN0ZXApIHtcbiAgICAgIHN0ZXAgPSAxIC8gMTA7XG4gICAgICB0b0ZpeGVkID0gMTtcbiAgICAgIG1hcmtlck1vZHVsbyA9IDEwO1xuICAgICAgaW5jbHVkZU1vZHVsbyA9IDE7XG4gICAgICB0eXBlID0gJ2RzJztcbiAgICB9XG5cbiAgICBpZiAocGl4ZWxzUGVyU2Vjb25kIC8gMTAwID4gbWluU3RlcCkge1xuICAgICAgc3RlcCA9IDEgLyAxMDA7XG4gICAgICB0b0ZpeGVkID0gMjtcbiAgICAgIG1hcmtlck1vZHVsbyA9IDEwO1xuICAgICAgaW5jbHVkZU1vZHVsbyA9IDE7XG4gICAgICB0eXBlID0gJ2NzJztcbiAgICB9XG5cbiAgICBpZiAocGl4ZWxzUGVyU2Vjb25kIC8gMTAwMCA+IG1pblN0ZXApIHtcbiAgICAgIHN0ZXAgPSAxIC8gMTAwMDtcbiAgICAgIHRvRml4ZWQgPSAzO1xuICAgICAgbWFya2VyTW9kdWxvID0gMTA7XG4gICAgICBpbmNsdWRlTW9kdWxvID0gMTtcbiAgICAgIHR5cGUgPSAnbXMnO1xuICAgIH1cblxuICAgIGZvciAobGV0IHRpbWUgPSBtaW47IHRpbWUgPCBtYXg7IHRpbWUgKz0gc3RlcCkge1xuICAgICAgY29uc3QgZm9ybWF0dGVkVGltZSA9IHRpbWUudG9GaXhlZCh0b0ZpeGVkKTtcblxuICAgICAgaWYgKE1hdGgucm91bmQoZm9ybWF0dGVkVGltZSAvIHN0ZXApICUgaW5jbHVkZU1vZHVsbyAhPT0gMCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gYXZvaWQgZmxvYXRpbmcgcG9pbnQgZXJyb3JzXG4gICAgICBjb25zdCBmb2N1c2VkID0gTWF0aC5yb3VuZChmb3JtYXR0ZWRUaW1lIC8gc3RlcCkgJSBtYXJrZXJNb2R1bG8gPT09IDAgPyB0cnVlIDogZmFsc2U7XG5cbiAgICAgIGNvbnN0IGRhdHVtID0geyB0aW1lOiBmb3JtYXR0ZWRUaW1lLCBmb2N1c2VkIH07XG5cbiAgICAgIGlmIChmb2N1c2VkID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgxMDAwICogZm9ybWF0dGVkVGltZSk7XG4gICAgICAgIGNvbnN0IG1pbiA9IHBhZExlZnQoZGF0ZS5nZXRNaW51dGVzKCksIDAsIDIpO1xuICAgICAgICBjb25zdCBzZWMgPSBwYWRMZWZ0KGRhdGUuZ2V0U2Vjb25kcygpLCAwLCAyKTtcbiAgICAgICAgY29uc3QgbWlsbGkgPSBwYWRMZWZ0KGRhdGUuZ2V0TWlsbGlzZWNvbmRzKCksIDAsIDMpO1xuICAgICAgICBjb25zdCBsYWJlbCA9IGAke21pbn06JHtzZWN9OiR7bWlsbGl9YDtcblxuICAgICAgICBkYXR1bS5sYWJlbCA9IGxhYmVsO1xuICAgICAgfVxuXG4gICAgICBkYXRhLnB1c2goZGF0dW0pO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9O1xufSIsIi8qKlxuICogSXMgYW4gYWJzdHJhY3QgY2xhc3Mgb3IgaW50ZXJmYWNlIHRvIGJlIG92ZXJyaWRlbiBpbiBvcmRlciB0byBkZWZpbmUgdGhlIHdheVxuICogYSBnaXZlbiBzaGFwZSBzaG91bGQgYmVoYXZlIHdoZW4gc2VsZWN0ZWQgb3IgZWRpdGVkIGJ5IGEgdXNlci4gSW5zdGFuY2VzIG9mXG4gKiBgQmFzZUJlaGF2aW9yYCBhcmUgaW50ZXJuYWxseSB1c2VkIGJ5IGBMYXllcmAgaW5zdGFuY2VzIHRvIG1vZGlmeSB0aGUgZGF0YVxuICogYWNjb3JkaW5nIHRvIGEgdXNlciBpbnRlcmFjdGlvbiBhbmQgYSBnaXZlbiBzaGFwZS4gQSBzaW5nbGUgaW5zdGFuY2Ugb2ZcbiAqIGBCZWhhdmlvcmAgaXMgY3JlYXRlZCBpbiBvbmUgZ2l2ZW4gc2hhcGUuXG4gKlxuICogQnkgZGVmYXVsdCwgdGhlIG9ubHkgbWV0aG9kIHRvIG92ZXJyaWRlIHRvIGRlZmluZSBhIG5ldyBiZWhhdmlvciBmb3IgYVxuICogc2hhcGUgaXMgdGhlIGBlZGl0YCBtZXRob2QuIEhvd2V2ZXIsIGlmIG5lZWRlZCBpbiBzcGVjaWFsIGNhc2VzLCBhbGwgdGhlXG4gKiBzZWxlY3Rpb24gaGFuZGxpbmcgY2FuIGJlIG92ZXJyaWRlbiB0b28uXG4gKlxuICogVGhlIGZsb3cgaXMgdGhlIGZvbGxvd2luZzpcbiAqIGBFdmVudGAgIC0gKGZvcndhcmRlZCB0bykgLT4gYExheWVyYCAtIChjb21tYW5kKSAtPiBgQmVoYXZpb3JgIC0gKG1vZGlmeSkgLT4gYGRhdGFgIC0gKHVwYXRlcykgLT4gYFNoYXBlYFxuICpcbiAqIFRoZSBiZWhhdmlvciByZXNwb25zYWJpbGl0eSBpcyB0aGVuIHRvIG1vZGlmeSB0aGUgZGF0YSBhY2NvcmRpbmcgdG8gdGhlXG4gKiB1c2VyIGludGVyYWN0aW9ucywgd2hpbGUgc2hhcGVzIGFyZSBhbHdheXMgYSB2aWV3IG9mIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZVxuICogZGF0YS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUJlaGF2aW9yIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fc2VsZWN0ZWRJdGVtcyA9IG5ldyBTZXQoKTsgLy8gbm8gZHVwbGljYXRlIGluIFNldFxuICAgIHRoaXMuX3NlbGVjdGVkQ2xhc3MgPSBudWxsO1xuICAgIHRoaXMuX2xheWVyID0gbnVsbDtcbiAgfVxuXG4gIGluaXRpYWxpemUobGF5ZXIpIHtcbiAgICB0aGlzLl9sYXllciA9IGxheWVyO1xuICAgIHRoaXMuX3NlbGVjdGVkQ2xhc3MgPSBsYXllci5wYXJhbXMuc2VsZWN0ZWRDbGFzc05hbWU7XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveSB0aGUgcmVmZXJlbmNlcyB0byB0aGUgc2VsZWN0ZWQgaXRlbXMuXG4gICAqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqIEB0b2RvIC0gcmVuYW1lIHRvIGBjbGVhclNlbGVjdGlvbmAgKHJlbW92aW5nIHRoZSBjbGFzcykgP1xuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLl9zZWxlY3RlZEl0ZW1zLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNsYXNzIHRvIGFkZCB0byB0aGUgc2hhcGVzIHdoZW4gc2VsZWN0ZWQuXG4gICAqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBzZXQgc2VsZWN0ZWRDbGFzcyh2YWx1ZSkge1xuICAgIHRoaXMuX3NlbGVjdGVkQ2xhc3MgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY2xhc3MgdG8gYWRkIHRvIHRoZSBzaGFwZXMgd2hlbiBzZWxlY3RlZC5cbiAgICpcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIGdldCBzZWxlY3RlZENsYXNzKCkge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZENsYXNzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRoZSBzZWxlY3RlZCBpdGVtcyBvZiB0aGUgbGF5ZXIuXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICovXG4gIGdldCBzZWxlY3RlZEl0ZW1zKCkge1xuICAgIHJldHVybiBbLi4udGhpcy5fc2VsZWN0ZWRJdGVtc107XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkaXRlbSAtIFRoZSBpdGVtIHRvIHNlbGVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdHVtIC0gTm90IHVzZWQgaW4gdGhpcyBpbXBsZW1lbnRhdGlvbi4gQ291bGQgYmVcbiAgICogICAgdXNlZCB0byBtYXJrIHRoZSBkYXRhIGFzIHNlbGVjdGVkLlxuICAgKiBAdG9kbyAtIFBhc3MgdGhlIHNoYXBlIG9iamVjdCB0byBnZXQgdGhlIGFjY2Vzc29ycyA/XG4gICAqL1xuICBzZWxlY3QoJGl0ZW0sIGRhdHVtKSB7XG4gICAgJGl0ZW0uY2xhc3NMaXN0LmFkZCh0aGlzLnNlbGVjdGVkQ2xhc3MpO1xuICAgIHRoaXMuX3NlbGVjdGVkSXRlbXMuYWRkKCRpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRpdGVtIC0gVGhlIGl0ZW0gdG8gdW5zZWxlY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXR1bSAtIE5vdCB1c2VkIGluIHRoaXMgaW1wbGVtZW50YXRpb24uIENvdWxkIGJlXG4gICAqICAgIHVzZWQgdG8gbWFyayB0aGUgZGF0YSBhcyBzZWxlY3RlZC5cbiAgICogQHRvZG8gLSBQYXNzIHRoZSBzaGFwZSBvYmplY3QgdG8gZ2V0IHRoZSBhY2Nlc3NvcnMgP1xuICAgKi9cbiAgdW5zZWxlY3QoJGl0ZW0sIGRhdHVtKSB7XG4gICAgJGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLnNlbGVjdGVkQ2xhc3MpO1xuICAgIHRoaXMuX3NlbGVjdGVkSXRlbXMuZGVsZXRlKCRpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRpdGVtIC0gVGhlIGl0ZW0gdG8gdG9nZ2xlIHNlbGVjdGlvbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdHVtIC0gTm90IHVzZWQgaW4gdGhpcyBpbXBsZW1lbnRhdGlvbi4gQ291bGQgYmVcbiAgICogICAgdXNlZCB0byBtYXJrIHRoZSBkYXRhIGFzIHNlbGVjdGVkLlxuICAgKiBAdG9kbyAtIFBhc3MgdGhlIHNoYXBlIG9iamVjdCB0byBnZXQgdGhlIGFjY2Vzc29ycyA/XG4gICAqL1xuICB0b2dnbGVTZWxlY3Rpb24oJGl0ZW0sIGRhdHVtKSB7XG4gICAgY29uc3QgbWV0aG9kID0gdGhpcy5fc2VsZWN0ZWRJdGVtcy5oYXMoJGl0ZW0pID8gJ3Vuc2VsZWN0JyA6ICdzZWxlY3QnO1xuICAgIHRoaXNbbWV0aG9kXSgkaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCB0byBvdmVycmlkZSBpbiBvcmRlciB0byBkZWZpbmUgaXRzIHBhcnRpY3VsYXIgYmVoYXZpb3Igd2hlblxuICAgKiBpbnRlcmFjdGVkIHdpdGguXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZW5kZXJpbmdDb250ZXh0IC0gVGhlIGxheWVyIHJlbmRlcmluZyBjb250ZXh0LlxuICAgKiBAcGFyYW0ge0Jhc2VTaGFwZX0gc2hhcGUgLSBUaGUgc2hhcGUgb2JqZWN0IHRvIGJlIGVkaXRlZC5cbiAgICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IGRhdHVtIC0gVGhlIHJlbGF0ZWQgZGF0dW0gdG8gbW9kaWZ5LlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHggLSBUaGUgdmFsdWUgb2YgdGhlIGludGVyYWN0aW9uIGluIHRoZSB4IGF4aXMgKGluIHBpeGVscykuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkeSAtIFRoZSB2YWx1ZSBvZiB0aGUgaW50ZXJhY3Rpb24gaW4gdGhlIHkgYXhpcyAoaW4gcGl4ZWxzKS5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkdGFyZ2V0IC0gVGhlIHRhcmdldCBET00gZWxlbWVudCBvZiB0aGUgaW50ZXJhY3Rpb24uXG4gICAqL1xuICBlZGl0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCAkdGFyZ2V0KSB7XG4gICAgLy8gbXVzdCBiZSBpbXBsZW1lbnRlZCBpbiBjaGlsZHJlblxuICB9XG59XG4iLCJpbXBvcnQgQmFzZUJlaGF2aW9yIGZyb20gJy4vYmFzZS1iZWhhdmlvcic7XG5cblxuLyoqXG4gKiBEZWZpbmVzIHRoZSBkZWZhdWx0IGJlaGF2aW9yIGZvciBhIGJyZWFrcG9pbnQgZnVuY3Rpb24uXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYnJlYWtwb2ludC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcmVha3BvaW50QmVoYXZpb3IgZXh0ZW5kcyBCYXNlQmVoYXZpb3Ige1xuICBlZGl0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCBkYXRhICA9IHRoaXMuX2xheWVyLmRhdGE7XG4gICAgY29uc3QgbGF5ZXJIZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcbiAgICAvLyBjdXJyZW50IHBvc2l0aW9uXG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2hhcGUuY3goZGF0dW0pKTtcbiAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoc2hhcGUuY3koZGF0dW0pKTtcbiAgICAvLyB0YXJnZXQgcG9zaXRpb25cbiAgICBsZXQgdGFyZ2V0WCA9IHggKyBkeDtcbiAgICBsZXQgdGFyZ2V0WSA9IHkgLSBkeTtcblxuICAgIGlmIChkYXRhLmxlbmd0aCA+IDIpIHtcbiAgICAgIC8vIGNyZWF0ZSBhIHNvcnRlZCBtYXAgb2YgYWxsIGB4YCBwb3NpdGlvbnNcbiAgICAgIGNvbnN0IHhNYXAgPSBkYXRhLm1hcCgoZCkgPT4gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS5jeChkKSkpO1xuICAgICAgeE1hcC5zb3J0KChhLCBiKSA9PiBhIDwgYiA/IC0xIDogMSk7XG4gICAgICAvLyBmaW5kIGluZGV4IG9mIG91ciBzaGFwZSB4IHBvc2l0aW9uXG4gICAgICBjb25zdCBpbmRleCA9IHhNYXAuaW5kZXhPZih4KTtcbiAgICAgIC8vIGxvY2sgdG8gbmV4dCBzaWJsaW5nc1xuICAgICAgaWYgKHRhcmdldFggPCB4TWFwW2luZGV4IC0gMV0gfHzCoHRhcmdldFggPiB4TWFwW2luZGV4ICsgMV0pIHtcbiAgICAgICAgdGFyZ2V0WCA9IHg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gbG9jayBpbiB5IGF4aXNcbiAgICBpZiAodGFyZ2V0WSA8IDApIHtcbiAgICAgIHRhcmdldFkgPSAwO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0WSA+IGxheWVySGVpZ2h0KSB7XG4gICAgICB0YXJnZXRZID0gbGF5ZXJIZWlnaHQ7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIGRhdHVtIHdpdGggbmV3IHZhbHVlc1xuICAgIHNoYXBlLmN4KGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRYKSk7XG4gICAgc2hhcGUuY3koZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmludmVydCh0YXJnZXRZKSk7XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlQmVoYXZpb3IgZnJvbSAnLi9iYXNlLWJlaGF2aW9yJztcblxuXG4vKipcbiAqIERlZmluZXMgdGhlIGRlZmF1bHQgYmVoYXZpb3IgZm9yIGEgbWFya2VyLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLW1hcmtlci5odG1sKVxuICovXG5jbGFzcyBNYXJrZXJCZWhhdmlvciBleHRlbmRzIEJhc2VCZWhhdmlvciB7XG4gIGVkaXQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLngoZGF0dW0pKTtcbiAgICBjb25zdCB0YXJnZXRYID0gKHggKyBkeCkgPiAwID8geCArIGR4IDogMDtcblxuICAgIHNoYXBlLngoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYXJrZXJCZWhhdmlvcjtcbiIsImltcG9ydCBCYXNlQmVoYXZpb3IgZnJvbSAnLi9iYXNlLWJlaGF2aW9yJztcblxuXG4vKipcbiAqIERlZmluZXMgdGhlIGRlZmF1bHQgYmVoYXZpb3IgZm9yIGEgc2VnbWVudC5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1tYXJrZXIuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VnbWVudEJlaGF2aW9yIGV4dGVuZHMgQmFzZUJlaGF2aW9yIHtcbiAgZWRpdChyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgY29uc3QgY2xhc3NMaXN0ID0gdGFyZ2V0LmNsYXNzTGlzdDtcbiAgICBsZXQgYWN0aW9uID0gJ21vdmUnO1xuXG4gICAgaWYgKGNsYXNzTGlzdC5jb250YWlucygnaGFuZGxlcicpICYmIGNsYXNzTGlzdC5jb250YWlucygnbGVmdCcpKSB7XG4gICAgICBhY3Rpb24gPSAncmVzaXplTGVmdCc7XG4gICAgfSBlbHNlIGlmIChjbGFzc0xpc3QuY29udGFpbnMoJ2hhbmRsZXInKSAmJiBjbGFzc0xpc3QuY29udGFpbnMoJ3JpZ2h0JykpIHtcbiAgICAgIGFjdGlvbiA9ICdyZXNpemVSaWdodCc7XG4gICAgfVxuXG4gICAgdGhpc1tgXyR7YWN0aW9ufWBdKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpO1xuICB9XG5cbiAgX21vdmUocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IGxheWVySGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG4gICAgLy8gY3VycmVudCB2YWx1ZXNcbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS54KGRhdHVtKSk7XG4gICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHNoYXBlLnkoZGF0dW0pKTtcbiAgICBjb25zdCBoZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChzaGFwZS5oZWlnaHQoZGF0dW0pKTtcbiAgICAvLyB0YXJnZXQgdmFsdWVzXG4gICAgbGV0IHRhcmdldFggPSBNYXRoLm1heCh4ICsgZHgsIDApO1xuICAgIGxldCB0YXJnZXRZID0geSAtIGR5O1xuXG4gICAgLy8gbG9jayBpbiBsYXllcidzIHkgYXhpc1xuICAgIGlmICh0YXJnZXRZIDwgMCkge1xuICAgICAgdGFyZ2V0WSA9IDA7XG4gICAgfSBlbHNlIGlmICh0YXJnZXRZICsgaGVpZ2h0ID4gbGF5ZXJIZWlnaHQpIHtcbiAgICAgIHRhcmdldFkgPSBsYXllckhlaWdodCAtIGhlaWdodDtcbiAgICB9XG5cbiAgICBzaGFwZS54KGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRYKSk7XG4gICAgc2hhcGUueShkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFkpKTtcbiAgfVxuXG4gIF9yZXNpemVMZWZ0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICAvLyBjdXJyZW50IHZhbHVlc1xuICAgIGNvbnN0IHggICAgID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS54KGRhdHVtKSk7XG4gICAgY29uc3Qgd2lkdGggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLndpZHRoKGRhdHVtKSk7XG4gICAgLy8gdGFyZ2V0IHZhbHVlc1xuICAgIGxldCBtYXhUYXJnZXRYICA9IHggKyB3aWR0aDtcbiAgICBsZXQgdGFyZ2V0WCAgICAgPSB4ICsgZHggPCBtYXhUYXJnZXRYID8gTWF0aC5tYXgoeCArIGR4LCAwKSA6IHg7XG4gICAgbGV0IHRhcmdldFdpZHRoID0gdGFyZ2V0WCAhPT0gMCA/IE1hdGgubWF4KHdpZHRoIC0gZHgsIDEpIDogd2lkdGg7XG5cbiAgICBzaGFwZS54KGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRYKSk7XG4gICAgc2hhcGUud2lkdGgoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFdpZHRoKSk7XG4gIH1cblxuICBfcmVzaXplUmlnaHQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIC8vIGN1cnJlbnQgdmFsdWVzXG4gICAgY29uc3Qgd2lkdGggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLndpZHRoKGRhdHVtKSk7XG4gICAgLy8gdGFyZ2V0IHZhbHVlc1xuICAgIGxldCB0YXJnZXRXaWR0aCA9IE1hdGgubWF4KHdpZHRoICsgZHgsIDEpO1xuXG4gICAgc2hhcGUud2lkdGgoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFdpZHRoKSk7XG4gIH1cbn1cbiIsIi8qKlxuICogVGltZUNvbnRleHRCZWhhdmlvciBpcyB1c2VkIGludGVybmFsbHkgaW4gTGF5ZXJzIHRvIG1vZGlmeSB0aGVpciBUaW1lQ29udGV4dC5cbiAqIFRoaXMgb2JqZWN0IGlzIGRpZmZlcmVudCBmcm9tIG90aGVyIFNoYXBlcyBCZWhhdmlvcnMgYW5kIGV4aXN0cyBtb3N0bHkgdG8gZGVjcmVhc2UgdGhlIHNpemUgb2YgdGhlIExheWVyLlxuICogQWxsIHRoZSBjb2RlIGhlcmUgY291bGQgYmUgY29uc2lkZXJlZCBhcyBwYXJ0IG9mIHRoZSBsYXllci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZUNvbnRleHRCZWhhdmlvciB7XG4gIGVkaXQobGF5ZXIsIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgY29uc3QgdGltZUNvbnRleHQgPSBsYXllci50aW1lQ29udGV4dDtcblxuICAgIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoYW5kbGVyJykgJiYgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbGVmdCcpKSB7XG4gICAgICB0aGlzLl9lZGl0TGVmdCh0aW1lQ29udGV4dCwgZHgpO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnaGFuZGxlcicpICYmIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3JpZ2h0JykpIHtcbiAgICAgIHRoaXMuX2VkaXRSaWdodCh0aW1lQ29udGV4dCwgZHgpO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnc2VnbWVudCcpKSB7XG4gICAgICB0aGlzLl9tb3ZlKHRpbWVDb250ZXh0LCBkeCk7XG4gICAgfVxuICB9XG5cbiAgX2VkaXRMZWZ0KHRpbWVDb250ZXh0LCBkeCkge1xuICAgIC8vIGVkaXQgYHN0YXJ0YCwgYG9mZnNldGAgYW5kIGBkdXJhdGlvbmBcbiAgICBjb25zdCB4ID0gdGltZUNvbnRleHQucGFyZW50LnRpbWVUb1BpeGVsKHRpbWVDb250ZXh0LnN0YXJ0KTtcbiAgICBjb25zdCBvZmZzZXQgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aW1lQ29udGV4dC5vZmZzZXQpO1xuICAgIGNvbnN0IHdpZHRoID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwodGltZUNvbnRleHQuZHVyYXRpb24pO1xuXG4gICAgY29uc3QgdGFyZ2V0WCA9IHggKyBkeDtcbiAgICBjb25zdCB0YXJnZXRPZmZzZXQgPSBvZmZzZXQgLSBkeDtcbiAgICBjb25zdCB0YXJnZXRXaWR0aCA9IE1hdGgubWF4KHdpZHRoIC0gZHgsIDEpO1xuXG4gICAgdGltZUNvbnRleHQuc3RhcnQgPSB0aW1lQ29udGV4dC5wYXJlbnQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpO1xuICAgIHRpbWVDb250ZXh0Lm9mZnNldCA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRPZmZzZXQpO1xuICAgIHRpbWVDb250ZXh0LmR1cmF0aW9uID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFdpZHRoKTtcbiAgfVxuXG4gIF9lZGl0UmlnaHQodGltZUNvbnRleHQsIGR4KSB7XG4gICAgY29uc3Qgd2lkdGggPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aW1lQ29udGV4dC5kdXJhdGlvbik7XG4gICAgY29uc3QgdGFyZ2V0V2lkdGggPSBNYXRoLm1heCh3aWR0aCArIGR4LCAxKTtcblxuICAgIHRpbWVDb250ZXh0LmR1cmF0aW9uID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFdpZHRoKTtcbiAgfVxuXG4gIF9tb3ZlKHRpbWVDb250ZXh0LCBkeCkge1xuICAgIGNvbnN0IHggPSB0aW1lQ29udGV4dC5wYXJlbnQudGltZVRvUGl4ZWwodGltZUNvbnRleHQuc3RhcnQpO1xuICAgIGNvbnN0IHRhcmdldFggPSBNYXRoLm1heCh4ICsgZHgsIDApO1xuXG4gICAgdGltZUNvbnRleHQuc3RhcnQgPSB0aW1lQ29udGV4dC5wYXJlbnQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpO1xuICB9XG5cbiAgc3RyZXRjaChsYXllciwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IGxheWVyLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IGxhc3REdXJhdGlvbiA9IHRpbWVDb250ZXh0LmR1cmF0aW9uO1xuICAgIGNvbnN0IGxhc3RPZmZzZXQgPSB0aW1lQ29udGV4dC5vZmZzZXQ7XG5cbiAgICB0aGlzLmVkaXQobGF5ZXIsIGR4LCBkeSwgdGFyZ2V0KTtcblxuICAgIGNvbnN0IG5ld0R1cmF0aW9uID0gdGltZUNvbnRleHQuZHVyYXRpb247XG4gICAgY29uc3QgcmF0aW8gPSAobmV3RHVyYXRpb24gLyBsYXN0RHVyYXRpb24pO1xuXG4gICAgdGltZUNvbnRleHQuc3RyZXRjaFJhdGlvICo9IHJhdGlvO1xuICAgIHRpbWVDb250ZXh0Lm9mZnNldCA9IGxhc3RPZmZzZXQ7XG4gICAgdGltZUNvbnRleHQuZHVyYXRpb24gPSBsYXN0RHVyYXRpb247XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlQmVoYXZpb3IgZnJvbSAnLi9iYXNlLWJlaGF2aW9yJztcblxuXG4vKipcbiAqIERlZmluZXMgdGhlIGRlZmF1bHQgYmVoYXZpb3IgZm9yIGEgdHJhY2UgdmlzdWFsaXphdGlvbi5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci10cmFjZS5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFjZUJlaGF2aW9yIGV4dGVuZHMgQmFzZUJlaGF2aW9yIHtcbiAgZWRpdChyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21pbicpKSB7XG4gICAgICB0aGlzLl9lZGl0UmFuZ2UocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksICdtaW4nKTtcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21heCcpKSB7XG4gICAgICB0aGlzLl9lZGl0UmFuZ2UocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksICdtYXgnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZWRpdE1lYW4ocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHkpO1xuICAgIH1cbiAgfVxuXG4gIF9lZGl0TWVhbihyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSkge1xuICAgIC8vIHdvcmsgaW4gcGl4ZWwgZG9tYWluXG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2hhcGUueChkYXR1bSkpO1xuICAgIGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChzaGFwZS5tZWFuKGRhdHVtKSk7XG5cbiAgICBsZXQgdGFyZ2V0WCA9IHggKyBkeDtcbiAgICBsZXQgdGFyZ2V0WSA9IHkgLSBkeTtcblxuICAgIHNoYXBlLngoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpKTtcbiAgICBzaGFwZS5tZWFuKGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbC5pbnZlcnQodGFyZ2V0WSkpO1xuICB9XG5cbiAgX2VkaXRSYW5nZShyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgcmFuZ2VTaWRlKSB7XG4gICAgY29uc3QgcmFuZ2UgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChzaGFwZS5yYW5nZShkYXR1bSkpO1xuXG4gICAgbGV0IHRhcmdldFJhbmdlID0gcmFuZ2VTaWRlID09PSAnbWluJyA/IHJhbmdlICsgMiAqIGR5IDogcmFuZ2UgLSAyICogZHk7XG4gICAgdGFyZ2V0UmFuZ2UgPSBNYXRoLm1heCh0YXJnZXRSYW5nZSwgMCk7XG5cbiAgICBzaGFwZS5yYW5nZShkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFJhbmdlKSk7XG4gIH1cbn1cbiIsImltcG9ydCBzY2FsZXMgZnJvbSAnLi4vdXRpbHMvc2NhbGVzJztcblxuXG4vKipcbiAqIEEgYExheWVyVGltZUNvbnRleHRgIGluc3RhbmNlIHJlcHJlc2VudHMgYSB0aW1lIHNlZ21lbnQgaW50byBhIGBUaW1lbGluZVRpbWVDb250ZXh0YC5cbiAqIEl0IG11c3QgYmUgYXR0YWNoZWQgdG8gYSBgVGltZWxpbmVUaW1lQ29udGV4dGAgKHRoZSBvbmUgb2YgdGhlIHRpbWVsaW5lIGl0XG4gKiBiZWxvbmdzIHRvKS4gSXQgcmVsaWVzIG9uIGl0cyBwYXJlbnQncyBgdGltZVRvUGl4ZWxgICh0aW1lIHRvIHBpeGVsIHRyYW5zZmVydFxuICogZnVuY3Rpb24pIHRvIGNyZWF0ZSB0aGUgdGltZSB0byBwaXhlbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgTGF5ZXIgKHRoZSB2aWV3KSBpdCBpcyBhdHRhY2hlZCB0by5cbiAqXG4gKiBUaGUgYGxheWVyVGltZUNvbnRleHRgIGhhcyBmb3VyIGltcG9ydGFudCBhdHRyaWJ1dGVzOlxuICogLSBgc3RhcnRgIHJlcHJlc2VudCB0aGUgdGltZSBhdCB3aGljaCB0ZW1wb3JhbCBkYXRhIG11c3QgYmUgcmVwcmVzZW50ZWRcbiAqICAgaW4gdGhlIHRpbWVsaW5lIChmb3IgaW5zdGFuY2UgdGhlIGJlZ2luaW5nIG9mIGEgc291bmRmaWxlIGluIGEgREFXKS5cbiAqIC0gYG9mZnNldGAgcmVwcmVzZW50cyBvZmZzZXQgdGltZSBvZiB0aGUgZGF0YSBpbiB0aGUgY29udGV4dCBvZiBhIExheWVyLlxuICogICAoQFRPRE8gZ2l2ZSBhIHVzZSBjYXNlIGV4YW1wbGUgaGVyZSBcImNyb3AgP1wiLCBhbmQvb3IgZXhwbGFpbiB0aGF0IGl0J3Mgbm90IGEgY29tbW9uIHVzZSBjYXNlKS5cbiAqIC0gYGR1cmF0aW9uYCBpcyB0aGUgZHVyYXRpb24gb2YgdGhlIHZpZXcgb24gdGhlIGRhdGEuXG4gKiAtIGBzdHJldGNoUmF0aW9gIGlzIHRoZSBzdHJldGNoIGFwcGx5ZWQgdG8gdGhlIHRlbXBvcmFsIGRhdGEgY29udGFpbmVkIGluXG4gKiAgIHRoZSB2aWV3ICh0aGlzIHZhbHVlIGNhbiBiZSBzZWVuIGFzIGEgbG9jYWwgem9vbSBvbiB0aGUgZGF0YSwgb3IgYXMgYSBzdHJldGNoXG4gKiAgIG9uIHRoZSB0aW1lIGNvbXBvbmVudHMgb2YgdGhlIGRhdGEpLiBXaGVuIGFwcGx5ZWQsIHRoZSBzdHJldGNoIHJhdGlvIG1haW50YWluXG4gKiAgIHRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgdmlldyBpbiB0aGUgdGltZWxpbmUuXG4gKlxuICogYGBgXG4gKiArIHRpbWVsaW5lIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiAwICAgICAgICAgNSAgICAgICAgIDEwICAgICAgICAgIDE1ICAgICAgICAgIDIwICAgICAgICAyNSAgICAgICAgICAzMCBzZWNvbmRzXG4gKiArLS0tKyoqKioqKioqKioqKioqKioqKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSsqKioqKioqKy0tXG4gKiAgICAgfCoqKiBzb3VuZGZpbGUgKioqfExheWVyICh2aWV3IG9uIHRoZSBzb3VuZCBmaWxlKSAgICAgICAgICAgIHwqKioqKioqfFxuICogICAgICsqKioqKioqKioqKioqKioqKistLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rKioqKioqKitcbiAqXG4gKiAgICAgPC0tLS0gb2Zmc2V0IC0tLS0+PC0tLS0tLS0tLS0tLS0tLSBkdXJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLT5cbiAqIDwtLS0tLS0tLSBzdGFydCAtLS0tLT5cbiAqXG4gKiBUaGUgcGFydHMgb2YgdGhlIHNvdW5kIGZpbGUgcmVwcmVzZW50ZWQgd2l0aCAnKicgYXJlIGhpZGRlbiBmcm9tIHRoZSB2aWV3XG4gKiBgYGBcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy90aW1lLWNvbnRleHRzLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExheWVyVGltZUNvbnRleHQge1xuICAvKipcbiAgICogQHBhcmFtIHtUaW1lbGluZVRpbWVDb250ZXh0fSBwYXJlbnQgLSBUaGUgYFRpbWVsaW5lVGltZUNvbnRleHRgIGluc3RhbmNlIG9mIHRoZSB0aW1lbGluZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhcmVudCkge1xuICAgIGlmICghcGFyZW50KSB7IHRocm93IG5ldyBFcnJvcignTGF5ZXJUaW1lQ29udGV4dCBtdXN0IGhhdmUgYSBwYXJlbnQnKTsgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCBpbnN0YW5jZSBvZiB0aGUgdGltZWxpbmUuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7VGltZWxpbmVUaW1lQ29udGV4dH1cbiAgICAgKi9cbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcblxuICAgIHRoaXMuX3RpbWVUb1BpeGVsID0gbnVsbDtcbiAgICB0aGlzLl9zdGFydCA9IDA7XG4gICAgdGhpcy5fZHVyYXRpb24gPSBwYXJlbnQudmlzaWJsZUR1cmF0aW9uO1xuICAgIHRoaXMuX29mZnNldCA9IDA7XG4gICAgdGhpcy5fc3RyZXRjaFJhdGlvID0gMTtcbiAgICAvLyByZWdpc3RlciBpbnRvIHRoZSB0aW1lbGluZSdzIFRpbWVDb250ZXh0XG4gICAgdGhpcy5wYXJlbnQuX2NoaWxkcmVuLnB1c2godGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGNsb25lIG9mIHRoZSBjdXJyZW50IHRpbWUgY29udGV4dC5cbiAgICpcbiAgICogQHJldHVybiB7TGF5ZXJUaW1lQ29udGV4dH1cbiAgICovXG4gIGNsb25lKCkge1xuICAgIGNvbnN0IGN0eCA9IG5ldyB0aGlzKCk7XG5cbiAgICBjdHgucGFyZW50ID0gdGhpcy5wYXJlbnQ7XG4gICAgY3R4LnN0YXJ0ID0gdGhpcy5zdGFydDtcbiAgICBjdHguZHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uO1xuICAgIGN0eC5vZmZzZXQgPSB0aGlzLm9mZnNldDtcbiAgICBjdHguc3RyZXRjaFJhdGlvID0gdGhpcy5zdHJldGNoUmF0aW87IC8vIGNyZWF0ZXMgdGhlIGxvY2FsIHNjYWxlIGlmIG5lZWRlZFxuXG4gICAgcmV0dXJuIGN0eDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgdGltZSBjb250ZXh0IChpbiBzZWNvbmRzKS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBzdGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhcnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHRpbWUgY29udGV4dCAoaW4gc2Vjb25kcykuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgc3RhcnQodmFsdWUpIHtcbiAgICB0aGlzLl9zdGFydCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGR1cmF0aW9uIG9mIHRoZSB0aW1lIGNvbnRleHQgKGluIHNlY29uZHMpLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IGR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9kdXJhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkdXJhdGlvbiBvZiB0aGUgdGltZSBjb250ZXh0IChpbiBzZWNvbmRzKS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBkdXJhdGlvbih2YWx1ZSkge1xuICAgIHRoaXMuX2R1cmF0aW9uID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgb2Zmc2V0IG9mIHRoZSB0aW1lIGNvbnRleHQgKGluIHNlY29uZHMpLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG9mZnNldCBvZiB0aGUgdGltZSBjb250ZXh0IChpbiBzZWNvbmRzKS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBvZmZzZXQodmFsdWUpIHtcbiAgICB0aGlzLl9vZmZzZXQgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzdHJldGNoIHJhdGlvIG9mIHRoZSB0aW1lIGNvbnRleHQuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgc3RyZXRjaFJhdGlvKCkge1xuICAgIHJldHVybiB0aGlzLl9zdHJldGNoUmF0aW87XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc3RyZXRjaCByYXRpbyBvZiB0aGUgdGltZSBjb250ZXh0LlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IHN0cmV0Y2hSYXRpbyh2YWx1ZSkge1xuICAgIC8vIHJlbW92ZSBsb2NhbCBzY2FsZSBpZiByYXRpbyA9IDFcbiAgICBpZiAodmFsdWUgPT09ICAxKSB7XG4gICAgICB0aGlzLl90aW1lVG9QaXhlbCA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIHJldXNlIHByZXZpc291c2x5IGNyZWF0ZWQgbG9jYWwgc2NhbGUgaWYgZXhpc3RzXG4gICAgY29uc3QgdGltZVRvUGl4ZWwgPSB0aGlzLl90aW1lVG9QaXhlbCA/XG4gICAgICB0aGlzLl90aW1lVG9QaXhlbCA6IHNjYWxlcy5saW5lYXIoKS5kb21haW4oWzAsIDFdKTtcblxuICAgIHRpbWVUb1BpeGVsLnJhbmdlKFswLCB0aGlzLnBhcmVudC5jb21wdXRlZFBpeGVsc1BlclNlY29uZCAqIHZhbHVlXSk7XG5cbiAgICB0aGlzLl90aW1lVG9QaXhlbCA9IHRpbWVUb1BpeGVsO1xuICAgIHRoaXMuX3N0cmV0Y2hSYXRpbyA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRpbWUgdG8gcGl4ZWwgdHJhbnNmZXJ0IGZ1bmN0aW9uIG9mIHRoZSB0aW1lIGNvbnRleHQuIElmXG4gICAqIHRoZSBgc3RyZXRjaFJhdGlvYCBhdHRyaWJ1dGUgaXMgZXF1YWwgdG8gMSwgdGhpcyBmdW5jdGlvbiBpcyB0aGUgZ2xvYmFsXG4gICAqIG9uZSBmcm9tIHRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAgaW5zdGFuY2UuXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIGdldCB0aW1lVG9QaXhlbCgpIHtcbiAgICBpZiAoIXRoaXMuX3RpbWVUb1BpeGVsKVxuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnRpbWVUb1BpeGVsO1xuXG4gICAgcmV0dXJuIHRoaXMuX3RpbWVUb1BpeGVsO1xuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciBmdW5jdGlvbiB0byBjb252ZXJ0IHBpeGVsIHRvIHRpbWUuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBweFxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBwaXhlbFRvVGltZShweCkge1xuICAgIGlmICghdGhpcy5fdGltZVRvUGl4ZWwpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC50aW1lVG9QaXhlbC5pbnZlcnQocHgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl90aW1lVG9QaXhlbC5pbnZlcnQocHgpO1xuICB9XG59XG4iLCJpbXBvcnQgZXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgbnMgZnJvbSAnLi9uYW1lc3BhY2UnO1xuaW1wb3J0IHNjYWxlcyBmcm9tICcuLi91dGlscy9zY2FsZXMnO1xuaW1wb3J0IFNlZ21lbnQgZnJvbSAnLi4vc2hhcGVzL3NlZ21lbnQnO1xuaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuLi9zaGFwZXMvYmFzZS1zaGFwZSc7XG5pbXBvcnQgVGltZUNvbnRleHRCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvdGltZS1jb250ZXh0LWJlaGF2aW9yJztcblxuLy8gdGltZSBjb250ZXh0IGJhaGV2aW9yXG5sZXQgdGltZUNvbnRleHRCZWhhdmlvciA9IG51bGw7XG5sZXQgdGltZUNvbnRleHRCZWhhdmlvckN0b3IgPSBUaW1lQ29udGV4dEJlaGF2aW9yO1xuXG4vKipcbiAqIFRoZSBsYXllciBjbGFzcyBpcyB0aGUgbWFpbiB2aXN1YWxpemF0aW9uIGNsYXNzLiBJdCBpcyBtYWlubHkgZGVmaW5lcyBieSBpdHNcbiAqIHJlbGF0ZWQgYExheWVyVGltZUNvbnRleHRgIHdoaWNoIGRldGVybWluZXMgaXRzIHBvc2l0aW9uIGluIHRoZSBvdmVyYWxsXG4gKiB0aW1lbGluZSAodGhyb3VnaCB0aGUgYHN0YXJ0YCwgYGR1cmF0aW9uYCwgYG9mZnNldGAgYW5kIGBzdHJldGNoUmF0aW9gXG4gKiBhdHRyaWJ1dGVzKSBhbmQgYnkgaXQncyByZWdpc3RlcmVkIFNoYXBlIHdoaWNoIGRlZmluZXMgaG93IHRvIGRpc3BsYXkgdGhlXG4gKiBkYXRhIGFzc29jaWF0ZWQgdG8gdGhlIGxheWVyLiBFYWNoIGNyZWF0ZWQgbGF5ZXIgbXVzdCBiZSBpbnNlcnRlZCBpbnRvIGFcbiAqIGBUcmFja2AgaW5zdGFuY2UgaW4gb3JkZXIgdG8gYmUgZGlzcGxheWVkLlxuICpcbiAqIF9Ob3RlOiBpbiB0aGUgY29udGV4dCBvZiB0aGUgbGF5ZXIsIGFuIF9faXRlbV9fIGlzIHRoZSBTVkcgZWxlbWVudFxuICogcmV0dXJuZWQgYnkgYSBgU2hhcGVgIGluc3RhbmNlIGFuZCBhc3NvY2lhdGVkIHdpdGggYSBwYXJ0aWN1bGFyIF9fZGF0dW1fXy5fXG4gKlxuICogIyMjIExheWVyIERPTSBzdHJ1Y3R1cmVcbiAqIGBgYFxuICogPGcgY2xhc3M9XCJsYXllclwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgke3N0YXJ0fSwgMClcIj5cbiAqICAgPHN2ZyBjbGFzcz1cImJvdW5kaW5nLWJveFwiIHdpZHRoPVwiJHtkdXJhdGlvbn1cIj5cbiAqICAgICA8ZyBjbGFzcz1cIm9mZnNldFwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgke29mZnNldCwgMH0pXCI+XG4gKiAgICAgICA8IS0tIGJhY2tncm91bmQgLS0+XG4gKiAgICAgICA8cmVjdCBjbGFzcz1cImJhY2tncm91bmRcIj48L3JlY3Q+XG4gKiAgICAgICA8IS0tIHNoYXBlcyBhbmQgY29tbW9uIHNoYXBlcyBhcmUgaW5zZXJ0ZWQgaGVyZSAtLT5cbiAqICAgICA8L2c+XG4gKiAgICAgPGcgY2xhc3M9XCJpbnRlcmFjdGlvbnNcIj48IS0tIGZvciBmZWVkYmFjayAtLT48L2c+XG4gKiAgIDwvc3ZnPlxuICogPC9nPlxuICogYGBgXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExheWVyIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YVR5cGUgLSBEZWZpbmVzIGhvdyB0aGUgbGF5ZXIgc2hvdWxkIGxvb2sgYXQgdGhlIGRhdGEuXG4gICAqICAgIENhbiBiZSAnZW50aXR5JyBvciAnY29sbGVjdGlvbicuXG4gICAqIEBwYXJhbSB7KEFycmF5fE9iamVjdCl9IGRhdGEgLSBUaGUgZGF0YSBhc3NvY2lhdGVkIHRvIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBDb25maWd1cmVzIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmhlaWdodD0xMDBdIC0gRGVmaW5lcyB0aGUgaGVpZ2h0IG9mIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnRvcD0wXSAtIERlZmluZXMgdGhlIHRvcCBwb3NpdGlvbiBvZiB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5vcGFjaXR5PTFdIC0gRGVmaW5lcyB0aGUgb3BhY2l0eSBvZiB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy55RG9tYWluPVswLDFdXSAtIERlZmluZXMgYm91bmRhcmllcyBvZiB0aGUgZGF0YVxuICAgKiAgICB2YWx1ZXMgaW4geSBheGlzIChmb3IgZXhlbXBsZSB0byBkaXNwbGF5IGFuIGF1ZGlvIGJ1ZmZlciwgdGhpcyBhdHRyaWJ1dGVcbiAgICogICAgc2hvdWxkIGJlIHNldCB0byBbLTEsIDFdLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY2xhc3NOYW1lPW51bGxdIC0gQW4gb3B0aW9ubmFsIGNsYXNzIHRvIGFkZCB0byBlYWNoXG4gICAqICAgIGNyZWF0ZWQgc2hhcGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jbGFzc05hbWU9J3NlbGVjdGVkJ10gLSBUaGUgY2xhc3MgdG8gYWRkIHRvIGEgc2hhcGVcbiAgICogICAgd2hlbiBzZWxlY3RlZC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmNvbnRleHRIYW5kbGVyV2lkdGg9Ml0gLSBUaGUgd2lkdGggb2YgdGhlIGhhbmRsZXJzXG4gICAqICAgIGRpc3BsYXllZCB0byBlZGl0IHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmhpdHRhYmxlPWZhbHNlXSAtIERlZmluZXMgaWYgdGhlIGxheWVyIGNhbiBiZSBpbnRlcmFjdGVkXG4gICAqICAgIHdpdGguIEJhc2ljYWxseSwgdGhlIGxheWVyIGlzIG5vdCByZXR1cm5lZCBieSBgQmFzZVN0YXRlLmdldEhpdExheWVyc2Agd2hlblxuICAgKiAgICBzZXQgdG8gZmFsc2UgKGEgY29tbW9uIHVzZSBjYXNlIGlzIGEgbGF5ZXIgdGhhdCBjb250YWlucyBhIGN1cnNvcilcbiAgICovXG4gIGNvbnN0cnVjdG9yKGRhdGFUeXBlLCBkYXRhLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBoZWlnaHQ6IDEwMCxcbiAgICAgIHRvcDogMCxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICB5RG9tYWluOiBbMCwgMV0sXG4gICAgICBjbGFzc05hbWU6IG51bGwsXG4gICAgICBzZWxlY3RlZENsYXNzTmFtZTogJ3NlbGVjdGVkJyxcbiAgICAgIGNvbnRleHRIYW5kbGVyV2lkdGg6IDIsXG4gICAgICBoaXR0YWJsZTogdHJ1ZSwgLy8gd2hlbiBmYWxzZSB0aGUgbGF5ZXIgaXMgbm90IHJldHVybmVkIGJ5IGBCYXNlU3RhdGUuZ2V0SGl0TGF5ZXJzYFxuICAgICAgaWQ6ICcnLCAvLyB1c2VkID9cbiAgICAgIG92ZXJmbG93OiAnaGlkZGVuJywgLy8gdXNlZnVsbCA/XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFBhcmFtZXRlcnMgb2YgdGhlIGxheWVycywgYGRlZmF1bHRzYCBvdmVycmlkZWQgd2l0aCBvcHRpb25zLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgLyoqXG4gICAgICogRGVmaW5lcyBob3cgdGhlIGxheWVyIHNob3VsZCBsb29rIGF0IHRoZSBkYXRhIChgJ2VudGl0eSdgIG9yIGAnY29sbGVjdGlvbidgKS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuZGF0YVR5cGUgPSBkYXRhVHlwZTsgLy8gJ2VudGl0eScgfHwgJ2NvbGxlY3Rpb24nO1xuICAgIC8qKiBAdHlwZSB7TGF5ZXJUaW1lQ29udGV4dH0gKi9cbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kZWwgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7RWxlbWVudH0gKi9cbiAgICB0aGlzLiRiYWNrZ3JvdW5kID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kYm91bmRpbmdCb3ggPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7RWxlbWVudH0gKi9cbiAgICB0aGlzLiRvZmZzZXQgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7RWxlbWVudH0gKi9cbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMgPSBudWxsO1xuICAgIC8qKlxuICAgICAqIEEgU2VnbWVudCBpbnN0YW5jaWF0ZWQgdG8gaW50ZXJhY3Qgd2l0aCB0aGUgTGF5ZXIgaXRzZWxmLlxuICAgICAqIEB0eXBlIHtTZWdtZW50fVxuICAgICAqL1xuICAgIHRoaXMuY29udGV4dFNoYXBlID0gbnVsbDtcblxuICAgIHRoaXMuX3NoYXBlQ29uZmlndXJhdGlvbiA9IG51bGw7ICAgICAgIC8vIHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH1cbiAgICB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb24gPSBudWxsOyAvLyB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9XG4gICAgdGhpcy5fJGl0ZW1TaGFwZU1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl8kaXRlbURhdGFNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fJGl0ZW1Db21tb25TaGFwZU1hcCA9IG5ldyBNYXAoKTtcblxuICAgIHRoaXMuX2lzQ29udGV4dEVkaXRhYmxlID0gZmFsc2U7XG4gICAgdGhpcy5fYmVoYXZpb3IgPSBudWxsO1xuXG4gICAgdGhpcy5faGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIHRoaXMuX3RvcCA9IHRoaXMucGFyYW1zLnRvcDtcblxuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG5cbiAgICB0aGlzLl92YWx1ZVRvUGl4ZWwgPSBzY2FsZXMubGluZWFyKClcbiAgICAgIC5kb21haW4odGhpcy5wYXJhbXMueURvbWFpbilcbiAgICAgIC5yYW5nZShbMCwgdGhpcy5faGVpZ2h0XSk7XG5cbiAgICAvLyBpbml0aWFsaXplIHRpbWVDb250ZXh0IGxheW91dFxuICAgIHRoaXMuX3JlbmRlckNvbnRhaW5lcigpO1xuICAgIC8vIGNyZWF0ZXMgdGhlIHRpbWVDb250ZXh0QmVoYXZpb3IgZm9yIGFsbCBsYXllcnNcbiAgICBpZiAodGltZUNvbnRleHRCZWhhdmlvciA9PT0gbnVsbCkge1xuICAgICAgdGltZUNvbnRleHRCZWhhdmlvciA9IG5ldyB0aW1lQ29udGV4dEJlaGF2aW9yQ3RvcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBsYXllciwgY2xlYXIgYWxsIHJlZmVyZW5jZXMuXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMudGltZUNvbnRleHQgPSBudWxsO1xuICAgIHRoaXMuZGF0YSA9IG51bGw7XG4gICAgdGhpcy5wYXJhbXMgPSBudWxsO1xuICAgIHRoaXMuX2JlaGF2aW9yID0gbnVsbDtcblxuICAgIHRoaXMuXyRpdGVtU2hhcGVNYXAuY2xlYXIoKTtcbiAgICB0aGlzLl8kaXRlbURhdGFNYXAuY2xlYXIoKTtcbiAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwLmNsZWFyKCk7XG5cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93cyB0byBvdmVycmlkZSBkZWZhdWx0IHRoZSBgVGltZUNvbnRleHRCZWhhdmlvcmAgdXNlZCB0byBlZGl0IHRoZSBsYXllci5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGN0b3JcbiAgICovXG4gIHN0YXRpYyBjb25maWd1cmVUaW1lQ29udGV4dEJlaGF2aW9yKGN0b3IpIHtcbiAgICB0aW1lQ29udGV4dEJlaGF2aW9yQ3RvciA9IGN0b3I7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgc3RhcnRgIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHN0YXJ0KCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnN0YXJ0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYExheWVyVGltZUNvbnRleHRgJ3MgYHN0YXJ0YCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBzdGFydCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQuc3RhcnQgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGBMYXllclRpbWVDb250ZXh0YCdzIGBvZmZzZXRgIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5vZmZzZXQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgb2Zmc2V0YCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBvZmZzZXQodmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYExheWVyVGltZUNvbnRleHRgJ3MgYGR1cmF0aW9uYCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBkdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGBMYXllclRpbWVDb250ZXh0YCdzIGBkdXJhdGlvbmAgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgZHVyYXRpb24odmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgc3RyZXRjaFJhdGlvYCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBzdHJldGNoUmF0aW8oKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQuc3RyZXRjaFJhdGlvO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYExheWVyVGltZUNvbnRleHRgJ3MgYHN0cmV0Y2hSYXRpb2AgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgc3RyZXRjaFJhdGlvKHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC5zdHJldGNoUmF0aW8gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGRvbWFpbiBib3VuZGFyaWVzIG9mIHRoZSBkYXRhIGZvciB0aGUgeSBheGlzLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqL1xuICBzZXQgeURvbWFpbihkb21haW4pIHtcbiAgICB0aGlzLnBhcmFtcy55RG9tYWluID0gZG9tYWluO1xuICAgIHRoaXMuX3ZhbHVlVG9QaXhlbC5kb21haW4oZG9tYWluKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkb21haW4gYm91bmRhcmllcyBvZiB0aGUgZGF0YSBmb3IgdGhlIHkgYXhpcy5cbiAgICpcbiAgICogQHR5cGUge0FycmF5fVxuICAgKi9cbiAgZ2V0IHlEb21haW4oKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLnlEb21haW47XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgb3BhY2l0eSBvZiB0aGUgd2hvbGUgbGF5ZXIuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgb3BhY2l0eSh2YWx1ZSkge1xuICAgIHRoaXMucGFyYW1zLm9wYWNpdHkgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBvcGFjaXR5IG9mIHRoZSB3aG9sZSBsYXllci5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBvcGFjaXR5KCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRyYW5zZmVydCBmdW5jdGlvbiB1c2VkIHRvIGRpc3BsYXkgdGhlIGRhdGEgaW4gdGhlIHggYXhpcy5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCB0aW1lVG9QaXhlbCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0cmFuc2ZlcnQgZnVuY3Rpb24gdXNlZCB0byBkaXNwbGF5IHRoZSBkYXRhIGluIHRoZSB5IGF4aXMuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgdmFsdWVUb1BpeGVsKCkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZVRvUGl4ZWw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIGFsbCB0aGUgZGlzcGxheWVkIGl0ZW1zLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXk8RWxlbWVudD59XG4gICAqL1xuICBnZXQgaXRlbXMoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fJGl0ZW1EYXRhTWFwLmtleXMoKSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGF0YSBhc3NvY2lhdGVkIHRvIHRoZSBsYXllci5cbiAgICpcbiAgICogQHR5cGUge09iamVjdFtdfVxuICAgKi9cbiAgZ2V0IGRhdGEoKSB7IHJldHVybiB0aGlzLl9kYXRhOyB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGRhdGEgYXNzb2NpYXRlZCB3aXRoIHRoZSBsYXllci5cbiAgICpcbiAgICogQHR5cGUge09iamVjdHxPYmplY3RbXX1cbiAgICovXG4gIHNldCBkYXRhKGRhdGEpIHtcbiAgICBzd2l0Y2ggKHRoaXMuZGF0YVR5cGUpIHtcbiAgICAgIGNhc2UgJ2VudGl0eSc6XG4gICAgICAgIGlmICh0aGlzLl9kYXRhKSB7ICAvLyBpZiBkYXRhIGFscmVhZHkgZXhpc3RzLCByZXVzZSB0aGUgcmVmZXJlbmNlXG4gICAgICAgICAgdGhpcy5fZGF0YVswXSA9IGRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fZGF0YSA9IFtkYXRhXTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbGxlY3Rpb24nOlxuICAgICAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlSGVpZ2h0KHByZXZUcmFja0hlaWdodCwgbmV3VHJhY2tIZWlnaHQpIHtcbiAgICBjb25zdCByYXRpbyA9IG5ld1RyYWNrSGVpZ2h0IC8gcHJldlRyYWNrSGVpZ2h0O1xuXG4gICAgdGhpcy5faGVpZ2h0ID0gdGhpcy5faGVpZ2h0ICogcmF0aW87XG4gICAgdGhpcy5fdG9wID0gdGhpcy5fdG9wICogcmF0aW87XG4gICAgdGhpcy5fdmFsdWVUb1BpeGVsLnJhbmdlKFswLCB0aGlzLl9oZWlnaHRdKVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSW5pdGlhbGl6YXRpb25cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogUmVuZGVycyB0aGUgRE9NIGluIG1lbW9yeSBvbiBsYXllciBjcmVhdGlvbiB0byBiZSBhYmxlIHRvIHVzZSBpdCBiZWZvcmVcbiAgICogdGhlIGxheWVyIGlzIGFjdHVhbGx5IGluc2VydGVkIGluIHRoZSBET00uXG4gICAqL1xuICBfcmVuZGVyQ29udGFpbmVyKCkge1xuICAgIC8vIHdyYXBwZXIgZ3JvdXAgZm9yIGBzdGFydCwgdG9wIGFuZCBjb250ZXh0IGZsaXAgbWF0cml4XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZCgnbGF5ZXInKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5jbGFzc05hbWUgIT09IG51bGwpXG4gICAgICB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKHRoaXMucGFyYW1zLmNsYXNzTmFtZSk7XG5cbiAgICAvLyBjbGlwIHRoZSBjb250ZXh0IHdpdGggYSBgc3ZnYCBlbGVtZW50XG4gICAgdGhpcy4kYm91bmRpbmdCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdzdmcnKTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5jbGFzc0xpc3QuYWRkKCdib3VuZGluZy1ib3gnKTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5zdHlsZS5vdmVyZmxvdyA9IHRoaXMucGFyYW1zLm92ZXJmbG93O1xuICAgIC8vIGdyb3VwIHRvIGFwcGx5IG9mZnNldFxuICAgIHRoaXMuJG9mZnNldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLiRvZmZzZXQuY2xhc3NMaXN0LmFkZCgnb2Zmc2V0JywgJ2l0ZW1zJyk7XG4gICAgLy8gbGF5ZXIgYmFja2dyb3VuZFxuICAgIHRoaXMuJGJhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsICcxMDAlJyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kJyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zdHlsZS5maWxsT3BhY2l0eSA9IDA7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuICAgIC8vIGNvbnRleHQgaW50ZXJhY3Rpb25zXG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuJGludGVyYWN0aW9ucy5jbGFzc0xpc3QuYWRkKCdpbnRlcmFjdGlvbnMnKTtcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAvLyBATk9URTogd29ya3MgYnV0IGtpbmcgb2YgdWdseS4uLiBzaG91bGQgYmUgY2xlYW5lZFxuICAgIHRoaXMuY29udGV4dFNoYXBlID0gbmV3IFNlZ21lbnQoKTtcbiAgICB0aGlzLmNvbnRleHRTaGFwZS5pbnN0YWxsKHtcbiAgICAgIG9wYWNpdHk6ICgpID0+IDAuMSxcbiAgICAgIGNvbG9yICA6ICgpID0+ICcjNzg3ODc4JyxcbiAgICAgIHdpZHRoICA6ICgpID0+IHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24sXG4gICAgICBoZWlnaHQgOiAoKSA9PiB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbC5kb21haW4oKVsxXSxcbiAgICAgIHkgICAgICA6ICgpID0+IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmRvbWFpbigpWzBdXG4gICAgfSk7XG5cbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMuYXBwZW5kQ2hpbGQodGhpcy5jb250ZXh0U2hhcGUucmVuZGVyKCkpO1xuICAgIC8vIGNyZWF0ZSB0aGUgRE9NIHRyZWVcbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRib3VuZGluZ0JveCk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guYXBwZW5kQ2hpbGQodGhpcy4kb2Zmc2V0KTtcbiAgICB0aGlzLiRvZmZzZXQuYXBwZW5kQ2hpbGQodGhpcy4kYmFja2dyb3VuZCk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guYXBwZW5kQ2hpbGQodGhpcy4kaW50ZXJhY3Rpb25zKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbXBvbmVudCBDb25maWd1cmF0aW9uXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGNvbnRleHQgb2YgdGhlIGxheWVyLCB0aHVzIGRlZmluaW5nIGl0cyBgc3RhcnRgLCBgZHVyYXRpb25gLFxuICAgKiBgb2Zmc2V0YCBhbmQgYHN0cmV0Y2hSYXRpb2AuXG4gICAqXG4gICAqIEBwYXJhbSB7VGltZUNvbnRleHR9IHRpbWVDb250ZXh0IC0gVGhlIHRpbWVDb250ZXh0IGluIHdoaWNoIHRoZSBsYXllciBpcyBkaXNwbGF5ZWQuXG4gICAqL1xuICBzZXRUaW1lQ29udGV4dCh0aW1lQ29udGV4dCkge1xuICAgIHRoaXMudGltZUNvbnRleHQgPSB0aW1lQ29udGV4dDtcbiAgICAvLyBjcmVhdGUgYSBtaXhpbiB0byBwYXNzIHRvIHRoZSBzaGFwZXNcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0ID0ge307XG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgc2hhcGUgYW5kIGl0cyBjb25maWd1cmF0aW9uIHRvIHVzZSBpbiBvcmRlciB0byByZW5kZXIgdGhlIGRhdGEuXG4gICAqXG4gICAqIEBwYXJhbSB7QmFzZVNoYXBlfSBjdG9yIC0gVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBzaGFwZSB0byBiZSB1c2VkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2FjY2Vzc29ycz17fV0gLSBEZWZpbmVzIGhvdyB0aGUgc2hhcGUgc2hvdWxkIGFkYXB0IHRvIGEgcGFydGljdWxhciBkYXRhIHN0cnV0dXJlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIC0gR2xvYmFsIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBzaGFwZXMsIGlzIHNwZWNpZmljIHRvIGVhY2ggYFNoYXBlYC5cbiAgICovXG4gIGNvbmZpZ3VyZVNoYXBlKGN0b3IsIGFjY2Vzc29ycyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb24gPSB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9O1xuICB9XG5cbiAgLyoqXG4gICAqIE9wdGlvbm5hbHkgcmVnaXN0ZXIgYSBzaGFwZSB0byBiZSB1c2VkIGFjY3JvcyB0aGUgZW50aXJlIGNvbGxlY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7QmFzZVNoYXBlfSBjdG9yIC0gVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBzaGFwZSB0byBiZSB1c2VkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2FjY2Vzc29ycz17fV0gLSBEZWZpbmVzIGhvdyB0aGUgc2hhcGUgc2hvdWxkIGFkYXB0IHRvIGEgcGFydGljdWxhciBkYXRhIHN0cnV0dXJlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIC0gR2xvYmFsIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBzaGFwZXMsIGlzIHNwZWNpZmljIHRvIGVhY2ggYFNoYXBlYC5cbiAgICovXG4gIGNvbmZpZ3VyZUNvbW1vblNoYXBlKGN0b3IsIGFjY2Vzc29ycyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb24gPSB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoZSBiZWhhdmlvciB0byB1c2Ugd2hlbiBpbnRlcmFjdGluZyB3aXRoIGEgc2hhcGUuXG4gICAqXG4gICAqIEBwYXJhbSB7QmFzZUJlaGF2aW9yfSBiZWhhdmlvclxuICAgKi9cbiAgc2V0QmVoYXZpb3IoYmVoYXZpb3IpIHtcbiAgICBiZWhhdmlvci5pbml0aWFsaXplKHRoaXMpO1xuICAgIHRoaXMuX2JlaGF2aW9yID0gYmVoYXZpb3I7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgdmFsdWVzIHN0b3JlZCBpbnQgdGhlIGBfcmVuZGVyaW5nQ29udGV4dGAgcGFzc2VkICB0byBzaGFwZXNcbiAgICogZm9yIHJlbmRlcmluZyBhbmQgdXBkYXRpbmcuXG4gICAqL1xuICBfdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpIHtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbDtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCA9IHRoaXMuX3ZhbHVlVG9QaXhlbDtcblxuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQuaGVpZ2h0ID0gdGhpcy5faGVpZ2h0O1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQud2lkdGggID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uKTtcbiAgICAvLyBmb3IgZm9yZWlnbiBvYmplY3QgaXNzdWUgaW4gY2hyb21lXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5vZmZzZXRYID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCk7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5zdGFydFggPSB0aGlzLnRpbWVDb250ZXh0LnBhcmVudC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0LnN0YXJ0KTtcblxuICAgIC8vIEB0b2RvIHJlcGxhY2Ugd2l0aCBgbWluWGAgYW5kIGBtYXhYYCByZXByZXNlbnRpbmcgdGhlIHZpc2libGUgcGl4ZWxzIGluIHdoaWNoXG4gICAgLy8gdGhlIHNoYXBlcyBzaG91bGQgYmUgcmVuZGVyZWQsIGNvdWxkIGFsbG93IHRvIG5vdCB1cGRhdGUgdGhlIERPTSBvZiBzaGFwZXNcbiAgICAvLyB3aG8gYXJlIG5vdCBpbiB0aGlzIGFyZWEuXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC50cmFja09mZnNldFggPSB0aGlzLnRpbWVDb250ZXh0LnBhcmVudC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0LnBhcmVudC5vZmZzZXQpO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoID0gdGhpcy50aW1lQ29udGV4dC5wYXJlbnQudmlzaWJsZVdpZHRoO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQmVoYXZpb3IgQWNjZXNzb3JzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGl0ZW1zIG1hcmtlZCBhcyBzZWxlY3RlZC5cbiAgICpcbiAgICogQHR5cGUge0FycmF5PEVsZW1lbnQ+fVxuICAgKi9cbiAgZ2V0IHNlbGVjdGVkSXRlbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2JlaGF2aW9yID8gdGhpcy5fYmVoYXZpb3Iuc2VsZWN0ZWRJdGVtcyA6IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmsgaXRlbShzKSBhcyBzZWxlY3RlZC5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fEVsZW1lbnRbXX0gJGl0ZW1zXG4gICAqL1xuICBzZWxlY3QoLi4uJGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHsgJGl0ZW1zID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmtleXMoKTsgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KCRpdGVtc1swXSkpIHsgJGl0ZW1zID0gJGl0ZW1zWzBdOyB9XG5cbiAgICBmb3IgKGxldCAkaXRlbSBvZiAkaXRlbXMpIHtcbiAgICAgIGNvbnN0IGRhdHVtID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmdldCgkaXRlbSk7XG4gICAgICB0aGlzLl9iZWhhdmlvci5zZWxlY3QoJGl0ZW0sIGRhdHVtKTtcbiAgICAgIHRoaXMuX3RvRnJvbnQoJGl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGl0ZW0ocykgZnJvbSBzZWxlY3RlZCBpdGVtcy5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fEVsZW1lbnRbXX0gJGl0ZW1zXG4gICAqL1xuICB1bnNlbGVjdCguLi4kaXRlbXMpIHtcbiAgICBpZiAoIXRoaXMuX2JlaGF2aW9yKSB7IHJldHVybjsgfVxuICAgIGlmICghJGl0ZW1zLmxlbmd0aCkgeyAkaXRlbXMgPSB0aGlzLl8kaXRlbURhdGFNYXAua2V5cygpOyB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoJGl0ZW1zWzBdKSkgeyAkaXRlbXMgPSAkaXRlbXNbMF07IH1cblxuICAgIGZvciAobGV0ICRpdGVtIG9mICRpdGVtcykge1xuICAgICAgY29uc3QgZGF0dW0gPSB0aGlzLl8kaXRlbURhdGFNYXAuZ2V0KCRpdGVtKTtcbiAgICAgIHRoaXMuX2JlaGF2aW9yLnVuc2VsZWN0KCRpdGVtLCBkYXR1bSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSBpdGVtKHMpIHNlbGVjdGlvbiBzdGF0ZSBhY2NvcmRpbmcgdG8gdGhlaXIgY3VycmVudCBzdGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fEVsZW1lbnRbXX0gJGl0ZW1zXG4gICAqL1xuICB0b2dnbGVTZWxlY3Rpb24oLi4uJGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHsgJGl0ZW1zID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmtleXMoKTsgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KCRpdGVtc1swXSkpIHsgJGl0ZW1zID0gJGl0ZW1zWzBdOyB9XG5cbiAgICBmb3IgKGxldCAkaXRlbSBvZiAkaXRlbXMpIHtcbiAgICAgIGNvbnN0IGRhdHVtID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmdldCgkaXRlbSk7XG4gICAgICB0aGlzLl9iZWhhdmlvci50b2dnbGVTZWxlY3Rpb24oJGl0ZW0sIGRhdHVtKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRWRpdCBpdGVtKHMpIGFjY29yZGluZyB0byB0aGUgYGVkaXRgIGRlZmluZWQgaW4gdGhlIHJlZ2lzdGVyZWQgYEJlaGF2aW9yYC5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fEVsZW1lbnRbXX0gJGl0ZW1zIC0gSXRlbShzKSB0byBlZGl0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkeCAtIE1vZGlmaWNhdGlvbiB0byBhcHBseSBpbiB0aGUgeCBheGlzIChpbiBwaXhlbCBkb21haW4pXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkeSAtIE1vZGlmaWNhdGlvbiB0byBhcHBseSBpbiB0aGUgeSBheGlzIChpbiBwaXhlbCBkb21haW4pXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJHRhcmdldCAtIFRhcmdldCBvZiB0aGUgaW50ZXJhY3Rpb24gKGZvciBleGFtcGxlLCBsZWZ0XG4gICAqICBoYW5kbGVyIERPTSBlbGVtZW50IGluIGEgc2VnbWVudCkuXG4gICAqL1xuICBlZGl0KCRpdGVtcywgZHgsIGR5LCAkdGFyZ2V0KSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICAkaXRlbXMgPSAhQXJyYXkuaXNBcnJheSgkaXRlbXMpID8gWyRpdGVtc10gOiAkaXRlbXM7XG5cbiAgICBmb3IgKGxldCAkaXRlbSBvZiAkaXRlbXMpIHtcbiAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fJGl0ZW1TaGFwZU1hcC5nZXQoJGl0ZW0pO1xuICAgICAgY29uc3QgZGF0dW0gPSB0aGlzLl8kaXRlbURhdGFNYXAuZ2V0KCRpdGVtKTtcblxuICAgICAgdGhpcy5fYmVoYXZpb3IuZWRpdCh0aGlzLl9yZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgJHRhcmdldCk7XG4gICAgICB0aGlzLmVtaXQoJ2VkaXQnLCBzaGFwZSwgZGF0dW0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGlmIHRoZSBgTGF5ZXJgLCBhbmQgdGh1cyB0aGUgYExheWVyVGltZUNvbnRleHRgIGlzIGVkaXRhYmxlIG9yIG5vdC5cbiAgICpcbiAgICogQHBhcmFtcyB7Qm9vbGVhbn0gW2Jvb2w9dHJ1ZV1cbiAgICovXG4gIHNldENvbnRleHRFZGl0YWJsZShib29sID0gdHJ1ZSkge1xuICAgIGNvbnN0IGRpc3BsYXkgPSBib29sID8gJ2Jsb2NrJyA6ICdub25lJztcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXk7XG4gICAgdGhpcy5faXNDb250ZXh0RWRpdGFibGUgPSBib29sO1xuICB9XG5cbiAgLyoqXG4gICAqIEVkaXQgdGhlIGxheWVyIGFuZCB0aHVzIGl0cyByZWxhdGVkIGBMYXllclRpbWVDb250ZXh0YCBhdHRyaWJ1dGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHggLSBUaGUgbW9kaWZpY2F0aW9uIHRvIGFwcGx5IGluIHRoZSB4IGF4aXMgKGluIHBpeGVscykuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkeSAtIFRoZSBtb2RpZmljYXRpb24gdG8gYXBwbHkgaW4gdGhlIHkgYXhpcyAoaW4gcGl4ZWxzKS5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkdGFyZ2V0IC0gVGhlIHRhcmdldCBvZiB0aGUgZXZlbnQgb2YgdGhlIGludGVyYWN0aW9uLlxuICAgKi9cbiAgZWRpdENvbnRleHQoZHgsIGR5LCAkdGFyZ2V0KSB7XG4gICAgdGltZUNvbnRleHRCZWhhdmlvci5lZGl0KHRoaXMsIGR4LCBkeSwgJHRhcmdldCk7XG4gIH1cblxuICAvKipcbiAgICogU3RyZXRjaCB0aGUgbGF5ZXIgYW5kIHRodXMgaXRzIHJlbGF0ZWQgYExheWVyVGltZUNvbnRleHRgIGF0dHJpYnV0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkeCAtIFRoZSBtb2RpZmljYXRpb24gdG8gYXBwbHkgaW4gdGhlIHggYXhpcyAoaW4gcGl4ZWxzKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR5IC0gVGhlIG1vZGlmaWNhdGlvbiB0byBhcHBseSBpbiB0aGUgeSBheGlzIChpbiBwaXhlbHMpLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICR0YXJnZXQgLSBUaGUgdGFyZ2V0IG9mIHRoZSBldmVudCBvZiB0aGUgaW50ZXJhY3Rpb24uXG4gICAqL1xuICBzdHJldGNoQ29udGV4dChkeCwgZHksICR0YXJnZXQpIHtcbiAgICB0aW1lQ29udGV4dEJlaGF2aW9yLnN0cmV0Y2godGhpcywgZHgsIGR5LCAkdGFyZ2V0KTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEhlbHBlcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBpdGVtIGZyb20gYSBET00gZWxlbWVudCByZWxhdGVkIHRvIHRoZSBzaGFwZSwgbnVsbCBvdGhlcndpc2UuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsIC0gdGhlIGVsZW1lbnQgdG8gYmUgdGVzdGVkXG4gICAqIEByZXR1cm4ge0VsZW1lbnR8bnVsbH1cbiAgICovXG4gIGdldEl0ZW1Gcm9tRE9NRWxlbWVudCgkZWwpIHtcbiAgICBsZXQgJGl0ZW07XG5cbiAgICBkbyB7XG4gICAgICBpZiAoJGVsLmNsYXNzTGlzdCAmJiAkZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdpdGVtJykpIHtcbiAgICAgICAgJGl0ZW0gPSAkZWw7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICAkZWwgPSAkZWwucGFyZW50Tm9kZTtcbiAgICB9IHdoaWxlICgkZWwgIT09IG51bGwpO1xuXG4gICAgcmV0dXJuIHRoaXMuaGFzSXRlbSgkaXRlbSkgPyAkaXRlbSA6wqBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHNoYXBlIGFzc29jaWF0ZWQgdG8gYSBzcGVjaWZpYyBpdGVtLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRpdGVtXG4gICAqIEByZXR1cm4ge1NoYXBlfVxuICAgKi9cbiAgZ2V0U2hhcGVGcm9tSXRlbSgkaXRlbSkge1xuICAgIHJldHVybiB0aGlzLmhhc0l0ZW0oJGl0ZW0pID8gdGhpcy5fJGl0ZW1TaGFwZU1hcC5nZXQoJGl0ZW0pIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzaGFwZSBhc3NvY2lhdGVkIHRvIGEgc3BlY2lmaWMgaXRlbSBmcm9tIGFueSBET00gZWxlbWVudFxuICAgKiBjb21wb3NpbmcgdGhlIHNoYXBlLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRpdGVtXG4gICAqIEByZXR1cm4ge1NoYXBlfVxuICAgKi9cbiAgZ2V0U2hhcGVGcm9tRE9NRWxlbWVudCgkZWwpIHtcbiAgICBjb25zdCAkaXRlbSA9IHRoaXMuZ2V0SXRlbUZyb21ET01FbGVtZW50KCRlbCk7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U2hhcGVGcm9tSXRlbSgkaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGF0dW0gYXNzb2NpYXRlZCB0byBhIHNwZWNpZmljIGl0ZW0uXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGl0ZW1cbiAgICogQHJldHVybiB7T2JqZWN0fEFycmF5fG51bGx9XG4gICAqL1xuICBnZXREYXR1bUZyb21JdGVtKCRpdGVtKSB7XG4gICAgY29uc3QgZGF0dW0gPSB0aGlzLl8kaXRlbURhdGFNYXAuZ2V0KCRpdGVtKTtcbiAgICByZXR1cm4gZGF0dW0gPyBkYXR1bSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGF0dW0gYXNzb2NpYXRlZCB0byBhIHNwZWNpZmljIGl0ZW0gZnJvbSBhbnkgRE9NIGVsZW1lbnRcbiAgICogY29tcG9zaW5nIHRoZSBzaGFwZS4gQmFzaWNhbGx5IGEgc2hvcnRjdXQgZm9yIGBnZXRJdGVtRnJvbURPTUVsZW1lbnRgIGFuZFxuICAgKiBgZ2V0RGF0dW1Gcm9tSXRlbWAgbWV0aG9kcy5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkZWxcbiAgICogQHJldHVybiB7T2JqZWN0fEFycmF5fG51bGx9XG4gICAqL1xuICBnZXREYXR1bUZyb21ET01FbGVtZW50KCRlbCkge1xuICAgIGNvbnN0ICRpdGVtID0gdGhpcy5nZXRJdGVtRnJvbURPTUVsZW1lbnQoJGVsKTtcbiAgICByZXR1cm4gdGhpcy5nZXREYXR1bUZyb21JdGVtKCRpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUZXN0cyBpZiB0aGUgZ2l2ZW4gRE9NIGVsZW1lbnQgaXMgYW4gaXRlbSBvZiB0aGUgbGF5ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGl0ZW0gLSBUaGUgaXRlbSB0byBiZSB0ZXN0ZWQuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBoYXNJdGVtKCRpdGVtKSB7XG4gICAgcmV0dXJuIHRoaXMuXyRpdGVtRGF0YU1hcC5oYXMoJGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgaWYgYSBnaXZlbiBlbGVtZW50IGJlbG9uZ3MgdG8gdGhlIGxheWVyLiBJcyBtb3JlIGdlbmVyYWwgdGhhblxuICAgKiBgaGFzSXRlbWAsIGNhbiBtb3N0bHkgdXNlZCB0byBjaGVjayBpbnRlcmFjdGlvbnMgZWxlbWVudHMuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsIC0gVGhlIERPTSBlbGVtZW50IHRvIGJlIHRlc3RlZC5cbiAgICogQHJldHVybiB7Ym9vbH1cbiAgICovXG4gIGhhc0VsZW1lbnQoJGVsKSB7XG4gICAgZG8ge1xuICAgICAgaWYgKCRlbCA9PT0gdGhpcy4kZWwpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgICRlbCA9ICRlbC5wYXJlbnROb2RlO1xuICAgIH0gd2hpbGUgKCRlbCAhPT0gbnVsbCk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYWxsIHRoZSBpdGVtcyBpbiBhIGdpdmVuIGFyZWEgYXMgZGVmaW5lZCBpbiB0aGUgcmVnaXN0ZXJlZCBgU2hhcGV+aW5BcmVhYCBtZXRob2QuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhcmVhIC0gVGhlIGFyZWEgaW4gd2hpY2ggdG8gZmluZCB0aGUgZWxlbWVudHNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFyZWEudG9wXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhcmVhLmxlZnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFyZWEud2lkdGhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFyZWEuaGVpZ2h0XG4gICAqIEByZXR1cm4ge0FycmF5fSAtIGxpc3Qgb2YgdGhlIGl0ZW1zIHByZXNlbnRzIGluIHRoZSBhcmVhXG4gICAqL1xuICBnZXRJdGVtc0luQXJlYShhcmVhKSB7XG4gICAgY29uc3Qgc3RhcnQgICAgPSB0aGlzLnRpbWVDb250ZXh0LnBhcmVudC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0LnN0YXJ0KTtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbik7XG4gICAgY29uc3Qgb2Zmc2V0ICAgPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQub2Zmc2V0KTtcbiAgICBjb25zdCB0b3AgICAgICA9IHRoaXMuX3RvcDtcbiAgICAvLyBiZSBhd2FyZSBhZiBjb250ZXh0J3MgdHJhbnNsYXRpb25zIC0gY29uc3RyYWluIGluIHdvcmtpbmcgdmlld1xuICAgIGxldCB4MSA9IE1hdGgubWF4KGFyZWEubGVmdCwgc3RhcnQpO1xuICAgIGxldCB4MiA9IE1hdGgubWluKGFyZWEubGVmdCArIGFyZWEud2lkdGgsIHN0YXJ0ICsgZHVyYXRpb24pO1xuICAgIHgxIC09IChzdGFydCArIG9mZnNldCk7XG4gICAgeDIgLT0gKHN0YXJ0ICsgb2Zmc2V0KTtcbiAgICAvLyBrZWVwIGNvbnNpc3RlbnQgd2l0aCBjb250ZXh0IHkgY29vcmRpbmF0ZXMgc3lzdGVtXG4gICAgbGV0IHkxID0gdGhpcy5faGVpZ2h0IC0gKGFyZWEudG9wICsgYXJlYS5oZWlnaHQpO1xuICAgIGxldCB5MiA9IHRoaXMuX2hlaWdodCAtIGFyZWEudG9wO1xuXG4gICAgeTEgKz0gdGhpcy5fdG9wO1xuICAgIHkyICs9IHRoaXMuX3RvcDtcblxuICAgIGNvbnN0ICRmaWx0ZXJlZEl0ZW1zID0gW107XG5cbiAgICBmb3IgKGxldCBbJGl0ZW0sIGRhdHVtXSBvZiB0aGlzLl8kaXRlbURhdGFNYXAuZW50cmllcygpKSB7XG4gICAgICBjb25zdCBzaGFwZSA9IHRoaXMuXyRpdGVtU2hhcGVNYXAuZ2V0KCRpdGVtKTtcbiAgICAgIGNvbnN0IGluQXJlYSA9IHNoYXBlLmluQXJlYSh0aGlzLl9yZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgeDEsIHkxLCB4MiwgeTIpO1xuXG4gICAgICBpZiAoaW5BcmVhKSB7ICRmaWx0ZXJlZEl0ZW1zLnB1c2goJGl0ZW0pOyB9XG4gICAgfVxuXG4gICAgcmV0dXJuICRmaWx0ZXJlZEl0ZW1zO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyaW5nIC8gRGlzcGxheSBtZXRob2RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIE1vdmVzIGFuIGl0ZW0gdG8gdGhlIGVuZCBvZiB0aGUgbGF5ZXIgdG8gZGlzcGxheSBpdCBmcm9udCBvZiBpdHNcbiAgICogc2libGluZ3MgKHN2ZyB6LWluZGV4Li4uKS5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkaXRlbSAtIFRoZSBpdGVtIHRvIGJlIG1vdmVkLlxuICAgKi9cbiAgX3RvRnJvbnQoJGl0ZW0pIHtcbiAgICB0aGlzLiRvZmZzZXQuYXBwZW5kQ2hpbGQoJGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgRE9NIHN0cnVjdHVyZSBvZiB0aGUgc2hhcGVzIGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gZGF0YS4gSW5zcGlyZWRcbiAgICogZnJvbSB0aGUgYGVudGVyYCBhbmQgYGV4aXRgIGQzLmpzIHBhcmFkaWdtLCB0aGlzIG1ldGhvZCBzaG91bGQgYmUgY2FsbGVkXG4gICAqIGVhY2ggdGltZSBhIGRhdHVtIGlzIGFkZGVkIG9yIHJlbW92ZWQgZnJvbSB0aGUgZGF0YS4gV2hpbGUgdGhlIERPTSBpc1xuICAgKiBjcmVhdGVkIHRoZSBgdXBkYXRlYCBtZXRob2QgbXVzdCBiZSBjYWxsZWQgaW4gb3JkZXIgdG8gdXBkYXRlIHRoZSBzaGFwZXNcbiAgICogYXR0cmlidXRlcyBhbmQgdGh1cyBwbGFjZSB0aGVtIHdoZXJlIHRoZXkgc2hvdWxkLlxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIC8vIHJlbmRlciBgY29tbW9uU2hhcGVgIG9ubHkgb25jZVxuICAgIGlmIChcbiAgICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiAhPT0gbnVsbCAmJlxuICAgICAgdGhpcy5fJGl0ZW1Db21tb25TaGFwZU1hcC5zaXplID09PSAwXG4gICAgKSB7XG4gICAgICBjb25zdCB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9ID0gdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uO1xuICAgICAgY29uc3QgJGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgY3RvcihvcHRpb25zKTtcblxuICAgICAgc2hhcGUuaW5zdGFsbChhY2Nlc3NvcnMpO1xuICAgICAgJGdyb3VwLmFwcGVuZENoaWxkKHNoYXBlLnJlbmRlcigpKTtcbiAgICAgICRncm91cC5jbGFzc0xpc3QuYWRkKCdpdGVtJywgJ2NvbW1vbicsIHNoYXBlLmdldENsYXNzTmFtZSgpKTtcblxuICAgICAgdGhpcy5fJGl0ZW1Db21tb25TaGFwZU1hcC5zZXQoJGdyb3VwLCBzaGFwZSk7XG4gICAgICB0aGlzLiRvZmZzZXQuYXBwZW5kQ2hpbGQoJGdyb3VwKTtcbiAgICB9XG5cbiAgICAvLyBhcHBlbmQgZWxlbWVudHMgYWxsIGF0IG9uY2VcbiAgICBjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLl8kaXRlbURhdGFNYXAudmFsdWVzKCk7IC8vIGl0ZXJhdG9yXG5cbiAgICAvLyBlbnRlclxuICAgIHRoaXMuZGF0YS5mb3JFYWNoKChkYXR1bSkgPT4ge1xuICAgICAgZm9yIChsZXQgdmFsdWUgb2YgdmFsdWVzKSB7IGlmICh2YWx1ZSA9PT0gZGF0dW0pIHsgcmV0dXJuOyB9IH1cblxuICAgICAgY29uc3QgeyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfSA9IHRoaXMuX3NoYXBlQ29uZmlndXJhdGlvbjtcbiAgICAgIGNvbnN0IHNoYXBlID0gbmV3IGN0b3Iob3B0aW9ucyk7XG4gICAgICBzaGFwZS5pbnN0YWxsKGFjY2Vzc29ycyk7XG5cbiAgICAgIGNvbnN0ICRlbCA9IHNoYXBlLnJlbmRlcih0aGlzLl9yZW5kZXJpbmdDb250ZXh0KTtcbiAgICAgICRlbC5jbGFzc0xpc3QuYWRkKCdpdGVtJywgc2hhcGUuZ2V0Q2xhc3NOYW1lKCkpO1xuXG4gICAgICB0aGlzLl8kaXRlbVNoYXBlTWFwLnNldCgkZWwsIHNoYXBlKTtcbiAgICAgIHRoaXMuXyRpdGVtRGF0YU1hcC5zZXQoJGVsLCBkYXR1bSk7XG5cbiAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKCRlbCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLiRvZmZzZXQuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuXG4gICAgLy8gcmVtb3ZlXG4gICAgZm9yIChsZXQgWyRpdGVtLCBkYXR1bV0gb2YgdGhpcy5fJGl0ZW1EYXRhTWFwLmVudHJpZXMoKSkge1xuICAgICAgaWYgKHRoaXMuZGF0YS5pbmRleE9mKGRhdHVtKSAhPT0gLTEpIHsgY29udGludWU7IH1cblxuICAgICAgY29uc3Qgc2hhcGUgPSB0aGlzLl8kaXRlbVNoYXBlTWFwLmdldCgkaXRlbSk7XG5cbiAgICAgIHRoaXMuJG9mZnNldC5yZW1vdmVDaGlsZCgkaXRlbSk7XG4gICAgICBzaGFwZS5kZXN0cm95KCk7XG4gICAgICAvLyBhIHJlbW92ZWQgaXRlbSBjYW5ub3QgYmUgc2VsZWN0ZWRcbiAgICAgIGlmICh0aGlzLl9iZWhhdmlvcikge1xuICAgICAgICB0aGlzLl9iZWhhdmlvci51bnNlbGVjdCgkaXRlbSwgZGF0dW0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl8kaXRlbURhdGFNYXAuZGVsZXRlKCRpdGVtKTtcbiAgICAgIHRoaXMuXyRpdGVtU2hhcGVNYXAuZGVsZXRlKCRpdGVtKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgY29udGFpbmVyIG9mIHRoZSBsYXllciBhbmQgdGhlIGF0dHJpYnV0ZXMgb2YgdGhlIGV4aXN0aW5nIHNoYXBlcy5cbiAgICovXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLnVwZGF0ZUNvbnRhaW5lcigpO1xuICAgIHRoaXMudXBkYXRlU2hhcGVzKCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgY29udGFpbmVyIG9mIHRoZSBsYXllci5cbiAgICovXG4gIHVwZGF0ZUNvbnRhaW5lcigpIHtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCk7XG5cbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IHRoaXMudGltZUNvbnRleHQ7XG4gICAgY29uc3Qgd2lkdGggID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwodGltZUNvbnRleHQuZHVyYXRpb24pO1xuICAgIC8vIHggaXMgcmVsYXRpdmUgdG8gdGltZWxpbmUncyB0aW1lQ29udGV4dFxuICAgIGNvbnN0IHggICAgICA9IHRpbWVDb250ZXh0LnBhcmVudC50aW1lVG9QaXhlbCh0aW1lQ29udGV4dC5zdGFydCk7XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwodGltZUNvbnRleHQub2Zmc2V0KTtcbiAgICBjb25zdCB0b3AgICAgPSB0aGlzLl90b3A7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5faGVpZ2h0O1xuICAgIC8vIG1hdHJpeCB0byBpbnZlcnQgdGhlIGNvb3JkaW5hdGUgc3lzdGVtXG4gICAgY29uc3QgdHJhbnNsYXRlTWF0cml4ID0gYG1hdHJpeCgxLCAwLCAwLCAtMSwgJHt4fSwgJHt0b3AgKyBoZWlnaHR9KWA7XG5cbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlTWF0cml4KTtcblxuICAgIHRoaXMuJGJvdW5kaW5nQm94LnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHdpZHRoKTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5zdHlsZS5vcGFjaXR5ID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcblxuICAgIHRoaXMuJG9mZnNldC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke29mZnNldH0sIDApYCk7XG4gICAgLy8gbWFpbnRhaW4gY29udGV4dCBzaGFwZVxuICAgIHRoaXMuY29udGV4dFNoYXBlLnVwZGF0ZSh0aGlzLl9yZW5kZXJpbmdDb250ZXh0LCB0aGlzLnRpbWVDb250ZXh0LCAwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBhdHRyaWJ1dGVzIG9mIGFsbCB0aGUgYFNoYXBlYCBpbnN0YW5jZXMgcmVuZGVyZWQgaW50byB0aGUgbGF5ZXIuXG4gICAqXG4gICAqIEB0b2RvIC0gYWxsb3cgdG8gZmlsdGVyIHdoaWNoIHNoYXBlKHMpIHNob3VsZCBiZSB1cGRhdGVkLlxuICAgKi9cbiAgdXBkYXRlU2hhcGVzKCkge1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcbiAgICAvLyB1cGRhdGUgY29tbW9uIHNoYXBlc1xuICAgIHRoaXMuXyRpdGVtQ29tbW9uU2hhcGVNYXAuZm9yRWFjaCgoc2hhcGUsICRpdGVtKSA9PiB7XG4gICAgICBzaGFwZS51cGRhdGUodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgdGhpcy5kYXRhKTtcbiAgICB9KTtcblxuICAgIGZvciAobGV0IFskaXRlbSwgZGF0dW1dIG9mIHRoaXMuXyRpdGVtRGF0YU1hcC5lbnRyaWVzKCkpIHtcbiAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fJGl0ZW1TaGFwZU1hcC5nZXQoJGl0ZW0pO1xuICAgICAgc2hhcGUudXBkYXRlKHRoaXMuX3JlbmRlcmluZ0NvbnRleHQsIGRhdHVtKTtcbiAgICB9XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG4iLCJpbXBvcnQgc2NhbGVzIGZyb20gJy4uL3V0aWxzL3NjYWxlcyc7XG5cblxuLyoqXG4gKiBEZWZpbmVzIGFuZCBtYWludGFpbnMgZ2xvYmFsIGFzcGVjdHMgb2YgdGhlIHZpc3VhbGl6YXRpb24gY29uY2VybmluZyB0aGVcbiAqIHJlbGF0aW9ucyBiZXR3ZWVuIHRpbWUgYW5kIHBpeGVscy5cbiAqXG4gKiBUaGUgYFRpbWVsaW5lVGltZUNvbnRleHRgIGluc3RhbmNlICh1bmlxdWUgYWNyb3NzIGEgdmlzdWFsaXphdGlvbikga2VlcHMgdGhlXG4gKiBtYWluIHJlZmVyZW5jZSBvbiBob3cgbWFueSBwaXhlbHMgc2hvdWxkIGJlIHVzZWQgdG8gcmVwcmVzZW50IG9uZSBzZWNvbmRcbiAqIHRob3VnaCBpdHMgYHRpbWVUb1BpeGVsYCBtZXRob2QuIFRoZSBhdHRyaWJ1dGVzIGB6b29tYCwgYG9mZnNldGAgKGkuZS4gZnJvbVxuICogb3JpZ2luKSBhbmQgYHZpc2libGVXaWR0aGAgYWxsb3cgZm9yIG5hdmlnYXRpbmcgaW4gdGltZSBhbmQgZm9yIG1haW50YWluaW5nXG4gKiB2aWV3IGNvbnNpc3RlbmN5IHVwb24gdGhlIERPTSBzdHJ1Y3R1cmUgKGA8c3ZnPmAgYW5kIGA8Zz5gIHRhZ3MpIGNyZWF0ZWQgYnlcbiAqIHRoZSByZWdpc3RlcmVkIHRyYWNrcy5cbiAqXG4gKiBJdCBhbHNvIG1haW50YWluIGFuIGFycmF5IG9mIGFsbCByZWZlcmVuY2VzIHRvIGBMYXllclRpbWVDb250ZXh0YCBpbnN0YW5jZXNcbiAqIHRvIHByb3BhZ2F0ZSB0byBgbGF5ZXJzYCwgY2hhbmdlcyBtYWRlIG9uIHRoZSB0aW1lIHRvIHBpeGVsIHJlcHJlc2VudGF0aW9uLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL3RpbWUtY29udGV4dHMuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWxpbmVUaW1lQ29udGV4dCB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcGl4ZWxzUGVyU2Vjb25kIC0gVGhlIG51bWJlciBvZiBwaXhlbHMgdGhhdCBzaG91bGQgYmVcbiAgICogICAgdXNlZCB0byBkaXNwbGF5IG9uZSBzZWNvbmQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2aXNpYmxlV2lkdGggLSBUaGUgZGVmYXVsdCB3aXRoIG9mIHRoZSB2aXNpYmxlIGFyZWFcbiAgICogICAgZGlzcGxheWVkIGluIGB0cmFja3NgIChpbiBwaXhlbHMpLlxuICAgKi9cbiAgY29uc3RydWN0b3IocGl4ZWxzUGVyU2Vjb25kLCB2aXNpYmxlV2lkdGgpIHtcbiAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xuXG4gICAgdGhpcy5fdGltZVRvUGl4ZWwgPSBudWxsO1xuICAgIHRoaXMuX29mZnNldCA9IDA7XG4gICAgdGhpcy5fem9vbSA9IDE7XG4gICAgdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQgPSBwaXhlbHNQZXJTZWNvbmQ7XG4gICAgLy8gcGFyYW1zXG4gICAgdGhpcy5fdmlzaWJsZVdpZHRoID0gdmlzaWJsZVdpZHRoO1xuICAgIHRoaXMuX21haW50YWluVmlzaWJsZUR1cmF0aW9uID0gZmFsc2U7XG5cbiAgICAvLyBjcmVhdGUgdGhlIHRpbWVUb1BpeGVsIHNjYWxlXG4gICAgY29uc3Qgc2NhbGUgPSBzY2FsZXMubGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIDFdKVxuICAgICAgLnJhbmdlKFswLCBwaXhlbHNQZXJTZWNvbmRdKTtcblxuICAgIHRoaXMuX3RpbWVUb1BpeGVsID0gc2NhbGU7XG5cbiAgICB0aGlzLl9vcmlnaW5hbFBpeGVsc1BlclNlY29uZCA9IHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBwaXhlbHMgcGVyIHNlY29uZHMgaWdub3JpbmcgdGhlIGN1cnJlbnQgem9vbSB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBwaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgYWxsIHRoZSBjYXJhY3RlcmlzdGljcyBvZiB0aGlzIG9iamVjdCBhY2NvcmRpbmcgdG8gdGhlIG5ld1xuICAgKiBnaXZlbiB2YWx1ZSBvZiBwaXhlbHMgcGVyIHNlY29uZHMuIFByb3BhZ2F0ZXMgdGhlIGNoYW5nZXMgdG8gdGhlXG4gICAqIGBMYXllclRpbWVDb250ZXh0YCBjaGlsZHJlbi5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBwaXhlbHNQZXJTZWNvbmQodmFsdWUpIHtcbiAgICB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZCA9IHZhbHVlICogdGhpcy56b29tO1xuICAgIHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kID0gdmFsdWU7XG4gICAgdGhpcy5fdXBkYXRlVGltZVRvUGl4ZWxSYW5nZSgpO1xuXG4gICAgLy8gZm9yY2UgY2hpbGRyZW4gc2NhbGUgdXBkYXRlXG4gICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgaWYgKGNoaWxkLnN0cmV0Y2hSYXRpbyAhPT0gMSlcbiAgICAgICAgY2hpbGQuc3RyZXRjaFJhdGlvID0gY2hpbGQuc3RyZXRjaFJhdGlvO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBwaXhlbHMgcGVyIHNlY29uZHMgaW5jbHVkaW5nIHRoZSBjdXJyZW50IHpvb20gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgb2Zmc2V0IGFwcGxpZWQgdG8gdGhlIHJlZ2lzdGVyZWQgYFRyYWNrYCBpbnN0YW5jZXNcbiAgICogZnJvbSBvcmlnaW4gKGluIHNlY29uZHMpLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG9mZnNldCB0byBhcHBseSB0byB0aGUgcmVnaXN0ZXJlZCBgVHJhY2tgIGluc3RhbmNlcyBmcm9tIG9yaWdpblxuICAgKiAoaW4gc2Vjb25kcykuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgb2Zmc2V0KHZhbHVlKSB7XG4gICAgdGhpcy5fb2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCB6b29tIGxldmVsIGFwcGxpZWQgdG8gdGhlIHdob2xlIHZpc3VhbGl6YXRpb24uXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgem9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy5fem9vbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB6b29tIHJhdGlvIGZvciB0aGUgd2hvbGUgdmlzdWFsaXphdGlvbi5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCB6b29tKHZhbHVlKSB7XG4gICAgLy8gQ29tcHV0ZSBjaGFuZ2UgdG8gcHJvcGFnYXRlIHRvIGNoaWxkcmVuIHdobyBoYXZlIHRoZWlyIG93biB0aW1lVG9QaXhlbFxuICAgIGNvbnN0IHJhdGlvQ2hhbmdlID0gdmFsdWUgLyB0aGlzLl96b29tO1xuICAgIHRoaXMuX3pvb20gPSB2YWx1ZTtcbiAgICB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZCA9IHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kICogdmFsdWU7XG4gICAgdGhpcy5fdXBkYXRlVGltZVRvUGl4ZWxSYW5nZSgpO1xuXG4gICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgaWYgKGNoaWxkLnN0cmV0Y2hSYXRpbyAhPT0gMSlcbiAgICAgICAgY2hpbGQuc3RyZXRjaFJhdGlvID0gY2hpbGQuc3RyZXRjaFJhdGlvICogcmF0aW9DaGFuZ2U7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdmlzaWJsZSB3aWR0aCBvZiB0aGUgYFRyYWNrYCBpbnN0YW5jZXMuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgdmlzaWJsZVdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLl92aXNpYmxlV2lkdGg7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmlzaWJsZSB3aWR0aCBvZiB0aGUgYFRyYWNrYCBpbnN0YW5jZXMuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgdmlzaWJsZVdpZHRoKHZhbHVlKSB7XG4gICAgY29uc3Qgd2lkdGhSYXRpbyA9IHZhbHVlIC8gdGhpcy5fdmlzaWJsZVdpZHRoO1xuICAgIHRoaXMuX3Zpc2libGVXaWR0aCA9IHZhbHVlO1xuXG4gICAgaWYgKHRoaXMubWFpbnRhaW5WaXNpYmxlRHVyYXRpb24pXG4gICAgICB0aGlzLnBpeGVsc1BlclNlY29uZCA9IHRoaXMucGl4ZWxzUGVyU2Vjb25kICogd2lkdGhSYXRpbztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkdXJhdGlvbiBkaXNwbGF5ZWQgYnkgYFRyYWNrYCBpbnN0YW5jZXMuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgdmlzaWJsZUR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnZpc2libGVXaWR0aCAvIHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgaWYgdGhlIGR1cmF0aW9uIGRpc3BsYXllZCBieSB0cmFja3Mgc2hvdWxkIGJlIG1haW50YWluZWQgd2hlblxuICAgKiB0aGVpciB3aWR0aCBpcyB1cGRhdGVkLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9tYWludGFpblZpc2libGVEdXJhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGlmIHRoZSBkdXJhdGlvbiBkaXNwbGF5ZWQgYnkgdHJhY2tzIHNob3VsZCBiZSBtYWludGFpbmVkIHdoZW5cbiAgICogdGhlaXIgd2lkdGggaXMgdXBkYXRlZC5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICBzZXQgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24oYm9vbCkge1xuICAgIHRoaXMuX21haW50YWluVmlzaWJsZUR1cmF0aW9uID0gYm9vbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0aW1lIHRvIHBpeGVsIHRyYXNmZXJ0IGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBnZXQgdGltZVRvUGl4ZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RpbWVUb1BpeGVsO1xuICB9XG5cbiAgX3VwZGF0ZVRpbWVUb1BpeGVsUmFuZ2UoKSB7XG4gICAgdGhpcy50aW1lVG9QaXhlbC5yYW5nZShbMCwgdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmRdKTtcbiAgfVxufVxuIiwiaW1wb3J0IGV2ZW50cyBmcm9tICdldmVudHMnO1xuXG5pbXBvcnQgS2V5Ym9hcmQgZnJvbSAnLi4vaW50ZXJhY3Rpb25zL2tleWJvYXJkJztcbmltcG9ydCBMYXllclRpbWVDb250ZXh0IGZyb20gJy4vbGF5ZXItdGltZS1jb250ZXh0JztcbmltcG9ydCBTdXJmYWNlIGZyb20gJy4uL2ludGVyYWN0aW9ucy9zdXJmYWNlJztcbmltcG9ydCBUaW1lbGluZVRpbWVDb250ZXh0IGZyb20gJy4vdGltZWxpbmUtdGltZS1jb250ZXh0JztcbmltcG9ydCBUcmFjayBmcm9tICcuL3RyYWNrJztcbmltcG9ydCBUcmFja0NvbGxlY3Rpb24gZnJvbSAnLi90cmFjay1jb2xsZWN0aW9uJztcblxuXG4vKipcbiAqIElzIHRoZSBtYWluIGVudHJ5IHBvaW50IHRvIGNyZWF0ZSBhIHRlbXBvcmFsIHZpc3VhbGl6YXRpb24uXG4gKlxuICogQSBgdGltZWxpbmVgIGluc3RhbmNlIG1haW5seSBwcm92aWRlcyB0aGUgY29udGV4dCBmb3IgYW55IHZpc3VhbGl6YXRpb24gb2ZcbiAqIHRlbXBvcmFsIGRhdGEgYW5kIG1haW50YWlucyB0aGUgaGllcmFyY2h5IG9mIGBUcmFja2AsIGBMYXllcmAgYW5kIGBTaGFwZWBcbiAqIG92ZXIgdGhlIGVudGllcmUgdmlzdWFsaXNhdGlvbi5cbiAqXG4gKiBJdHMgbWFpbiByZXNwb25zYWJpbGl0ZXMgYXJlOlxuICogLSBtYWludGFpbmluZyB0aGUgdGVtcG9yYWwgY29uc2lzdGVuY3kgYWNjcm9zcyB0aGUgdmlzdWFsaXNhdGlvbiB0aHJvdWdoXG4gKiAgIGl0cyBgdGltZUNvbnRleHRgIHByb3BlcnR5IChpbnN0YW5jZSBvZiBgVGltZWxpbmVUaW1lQ29udGV4dGApLlxuICogLSBoYW5kbGluZyBpbnRlcmFjdGlvbnMgdG8gaXRzIGN1cnJlbnQgc3RhdGUgKGFjdGluZyBoZXJlIGFzIGEgc2ltcGxlXG4gKiAgIHN0YXRlIG1hY2hpbmUpLlxuICpcbiAqIEBUT0RPIGluc2VydCBmaWd1cmVcbiAqXG4gKiBJdCBhbHNvIGNvbnRhaW5zIGEgcmVmZXJlbmNlIHRvIGFsbCB0aGUgcmVnaXN0ZXIgdHJhY2sgYWxsb3dpbmcgdG8gYHJlbmRlcmBcbiAqIG9yIGB1cGRhdGVgIGFsbCB0aGUgbGF5ZXIgZnJvbSBhIHNpbmdsZSBlbnRyeSBwb2ludC5cbiAqXG4gKiAjIyBFeGFtcGxlIFVzYWdlXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHZpc2libGVXaWR0aCA9IDUwMDsgLy8gZGVmYXVsdCB3aWR0aCBpbiBwaXhlbHMgZm9yIGFsbCBjcmVhdGVkIGBUcmFja2BcbiAqIGNvbnN0IGR1cmF0aW9uID0gMTA7IC8vIHRoZSB2aXNpYmxlIGFyZWEgcmVwcmVzZW50cyAxMCBzZWNvbmRzXG4gKiBjb25zdCBwaXhlbHNQZXJTZWNvbmRzID0gdmlzaWJsZVdpZHRoIC8gZHVyYXRpb247XG4gKiBjb25zdCB0aW1lbGluZSA9IG5ldyB1aS5jb3JlLlRpbWVsaW5lKHBpeGVsc1BlclNlY29uZCwgd2lkdGgpO1xuICogYGBgXG4gKi9cbmNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3BpeGVsc1BlclNlY29uZD0xMDBdIC0gdGhlIGRlZmF1bHQgc2NhbGluZyBiZXR3ZWVuIHRpbWUgYW5kIHBpeGVscy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFt2aXNpYmxlV2lkdGg9MTAwMF0gLSB0aGUgZGVmYXVsdCB2aXNpYmxlIGFyZWEgZm9yIGFsbCByZWdpc3RlcmVkIHRyYWNrcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHBpeGVsc1BlclNlY29uZCA9IDEwMCwgdmlzaWJsZVdpZHRoID0gMTAwMCwge1xuICAgIHJlZ2lzdGVyS2V5Ym9hcmQgPSB0cnVlXG4gIH0gPSB7fSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLl90cmFja3MgPSBuZXcgVHJhY2tDb2xsZWN0aW9uKHRoaXMpO1xuICAgIHRoaXMuX3N0YXRlID0gbnVsbDtcblxuICAgIC8vIGRlZmF1bHQgaW50ZXJhY3Rpb25zXG4gICAgdGhpcy5fc3VyZmFjZUN0b3IgPSBTdXJmYWNlO1xuXG4gICAgLy8gc3RvcmVzXG4gICAgdGhpcy5fdHJhY2tCeUlkID0ge307XG4gICAgdGhpcy5fZ3JvdXBlZExheWVycyA9IHt9O1xuICAgIHRoaXMuXyRlbEludGVyYWN0aW9uc01hcCA9IG5ldyBNYXAoKTtcblxuICAgIC8qKiBAdHlwZSB7VGltZWxpbmVUaW1lQ29udGV4dH0gLSBtYXN0ZXIgdGltZSBjb250ZXh0IGZvciB0aGUgdmlzdWFsaXphdGlvbi4gKi9cbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbmV3IFRpbWVsaW5lVGltZUNvbnRleHQocGl4ZWxzUGVyU2Vjb25kLCB2aXNpYmxlV2lkdGgpO1xuXG4gICAgaWYgKHJlZ2lzdGVyS2V5Ym9hcmQpXG4gICAgICB0aGlzLmNyZWF0ZUludGVyYWN0aW9uKEtleWJvYXJkLCBkb2N1bWVudCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgb2Zmc2V0YCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn0gW29mZnNldD0wXVxuICAgKi9cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5vZmZzZXQ7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgb2Zmc2V0YCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn0gW29mZnNldD0wXVxuICAgKi9cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQub2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYHpvb21gIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfSBbb2Zmc2V0PTBdXG4gICAqL1xuICBnZXQgem9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC56b29tO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGB6b29tYCB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn0gW29mZnNldD0wXVxuICAgKi9cbiAgc2V0IHpvb20odmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0Lnpvb20gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgcGl4ZWxzUGVyU2Vjb25kYCByYXRpby5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn0gW29mZnNldD0wXVxuICAgKi9cbiAgZ2V0IHBpeGVsc1BlclNlY29uZCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5waXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYHBpeGVsc1BlclNlY29uZGAgcmF0aW8uXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9IFtvZmZzZXQ9MF1cbiAgICovXG4gIHNldCBwaXhlbHNQZXJTZWNvbmQodmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnBpeGVsc1BlclNlY29uZCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGB2aXNpYmxlV2lkdGhgIHBpeGVsIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn0gW29mZnNldD0wXVxuICAgKi9cbiAgZ2V0IHZpc2libGVXaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC52aXNpYmxlV2lkdGg7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYHZpc2libGVXaWR0aGAgcGl4ZWwgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfSBbb2Zmc2V0PTBdXG4gICAqL1xuICBzZXQgdmlzaWJsZVdpZHRoKHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC52aXNpYmxlV2lkdGggPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGB0aW1lVG9QaXhlbGAgdHJhbnNmZXJ0IGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBnZXQgdGltZVRvUGl4ZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgdmlzaWJsZUR1cmF0aW9uYCBoZWxwZXIgdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgdmlzaWJsZUR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnZpc2libGVEdXJhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb25gIHZhbHVlLlxuICAgKiBEZWZpbmVzIGlmIHRoZSBkdXJhdGlvbiBvZiB0aGUgdmlzaWJsZSBhcmVhIHNob3VsZCBiZSBtYWludGFpbiB3aGVuXG4gICAqIHRoZSBgdmlzaWJsZVdpZHRoYCBhdHRyaWJ1dGUgaXMgdXBkYXRlZC5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICBzZXQgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24oYm9vbCkge1xuICAgIHRoaXMudGltZUNvbnRleHQubWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSBib29sO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYG1haW50YWluVmlzaWJsZUR1cmF0aW9uYCBjdXJyZW50IHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIGdldCBtYWludGFpblZpc2libGVEdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5tYWludGFpblZpc2libGVEdXJhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBPYmplY3QgbWFpbnRhaW5pbmcgYXJyYXlzIG9mIGBMYXllcmAgaW5zdGFuY2VzIG9yZGVyZWQgYnkgdGhlaXIgYGdyb3VwSWRgLlxuICAgKiBJcyB1c2VkIGludGVybmFsbHkgYnkgdGhlIGBUcmFja0NvbGxlY3Rpb25gIGluc3RhbmNlLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgZ2V0IGdyb3VwZWRMYXllcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dyb3VwZWRMYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGVzIHRoZSBkZWZhdWx0IGBTdXJmYWNlYCB0aGF0IGlzIGluc3RhbmNpYXRlZCBvbiBlYWNoIGBUcmFja2BcbiAgICogaW5zdGFuY2UuIFRoaXMgbWV0aG9zIHNob3VsZCBiZSBjYWxsZWQgYmVmb3JlIGFkZGluZyBhbnkgYFRyYWNrYCBpbnN0YW5jZVxuICAgKiB0byB0aGUgY3VycmVudCBgdGltZWxpbmVgLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50U291cmNlfSBjdG9yIC0gVGhlIGNvbnN0cnVjdG9yIHRvIHVzZSBpbiBvcmRlciB0byBjYXRjaCBtb3VzZVxuICAgKiAgICBldmVudHMgb24gZWFjaCBgVHJhY2tgIGluc3RhbmNlcy5cbiAgICovXG4gIGNvbmZpZ3VyZVN1cmZhY2UoY3Rvcikge1xuICAgIHRoaXMuX3N1cmZhY2VDdG9yID0gY3RvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBGYWN0b3J5IG1ldGhvZCB0byBhZGQgaW50ZXJhY3Rpb24gbW9kdWxlcyB0aGUgdGltZWxpbmUgc2hvdWxkIGxpc3RlbiB0by5cbiAgICogQnkgZGVmYXVsdCwgdGhlIHRpbWVsaW5lIGluc3RhbmNpYXRlIGEgZ2xvYmFsIGBLZXlib2FyZGAgaW5zdGFuY2UgYW5kIGFcbiAgICogYFN1cmZhY2VgIGluc3RhbmNlIG9uIGVhY2ggY29udGFpbmVyLlxuICAgKiBTaG91bGQgYmUgdXNlZCB0byBpbnN0YWxsIG5ldyBpbnRlcmFjdGlvbnMgaW1wbGVtZW50aW5nIHRoZSBgRXZlbnRTb3VyY2VgIGludGVyZmFjZS5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudFNvdXJjZX0gY3RvciAtIFRoZSBjb250cnVjdG9yIG9mIHRoZSBpbnRlcmFjdGlvbiBtb2R1bGUgdG8gaW5zdGFuY2lhdGUuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsIC0gVGhlIERPTSBlbGVtZW50IHdoaWNoIHdpbGwgYmUgYmluZGVkIHRvIHRoZSBgRXZlbnRTb3VyY2VgIG1vZHVsZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSAtIE9wdGlvbnMgdG8gYmUgYXBwbGllZCB0byB0aGUgYGN0b3JgLlxuICAgKi9cbiAgY3JlYXRlSW50ZXJhY3Rpb24oY3RvciwgJGVsLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBpbnRlcmFjdGlvbiA9IG5ldyBjdG9yKCRlbCwgb3B0aW9ucyk7XG4gICAgaW50ZXJhY3Rpb24ub24oJ2V2ZW50JywgKGUpID0+IHRoaXMuX2hhbmRsZUV2ZW50KGUpKTtcblxuICAgIC8vIHN0b3JlIGludGVyYWN0aW9uIGFzc29jaWF0ZWQgdG8gdGhlIERPTSBlbGVtZW50XG4gICAgaWYgKCF0aGlzLl8kZWxJbnRlcmFjdGlvbnNNYXAuaGFzKCRlbCkpXG4gICAgICB0aGlzLl8kZWxJbnRlcmFjdGlvbnNNYXAuc2V0KCRlbCwgbmV3IFNldCgpKTtcblxuICAgIGNvbnN0IGludGVyYWN0aW9uU2V0ID0gdGhpcy5fJGVsSW50ZXJhY3Rpb25zTWFwLmdldCgkZWwpO1xuICAgIGludGVyYWN0aW9uU2V0LmFkZChpbnRlcmFjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGxpc3Qgb2YgdGhlIGxheWVycyBzaXR1YXRlZCB1bmRlciB0aGUgcG9zaXRpb24gb2YgYSBgV2F2ZUV2ZW50YC5cbiAgICpcbiAgICogQHBhcmFtIHtXYXZlc0V2ZW50fSBlIC0gQW4gZXZlbnQgdHJpZ2dlcmVkIGJ5IGEgYFdhdmVFdmVudGBcbiAgICogQHJldHVybiB7QXJyYXl9IC0gTWF0Y2hlZCBsYXllcnNcbiAgICovXG4gIGdldEhpdExheWVycyhlKSB7XG4gICAgY29uc3QgY2xpZW50WCA9IGUub3JpZ2luYWxFdmVudC5jbGllbnRYO1xuICAgIGNvbnN0IGNsaWVudFkgPSBlLm9yaWdpbmFsRXZlbnQuY2xpZW50WTtcbiAgICBsZXQgbGF5ZXJzID0gW107XG5cbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgaWYgKCFsYXllci5wYXJhbXMuaGl0dGFibGUpIHsgcmV0dXJuOyB9XG4gICAgICBjb25zdCBib3VuZGluZ1JlY3QgPSBsYXllci4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgY2xpZW50WCA+IGJvdW5kaW5nUmVjdC5sZWZ0ICYmIGNsaWVudFggPCBib3VuZGluZ1JlY3QucmlnaHQgJiZcbiAgICAgICAgY2xpZW50WSA+IGJvdW5kaW5nUmVjdC50b3AgJiYgY2xpZW50WSA8IGJvdW5kaW5nUmVjdC5ib3R0b21cbiAgICAgICkge1xuICAgICAgICBsYXllcnMucHVzaChsYXllcik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjYWxsYmFjayB0aGF0IGlzIHVzZWQgdG8gbGlzdGVuIHRvIGludGVyYWN0aW9ucyBtb2R1bGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge1dhdmVFdmVudH0gZSAtIEFuIGV2ZW50IGdlbmVyYXRlZCBieSBhbiBpbnRlcmFjdGlvbiBtb2R1bGVzIChgRXZlbnRTb3VyY2VgKS5cbiAgICovXG4gIF9oYW5kbGVFdmVudChlKSB7XG4gICAgY29uc3QgaGl0TGF5ZXJzID0gKGUuc291cmNlID09PSAnc3VyZmFjZScpID8gdGhpcy5nZXRIaXRMYXllcnMoZSkgOiBudWxsO1xuICAgIC8vIGVtaXQgZXZlbnQgYXMgYSBtaWRkbGV3YXJlXG4gICAgdGhpcy5lbWl0KCdldmVudCcsIGUsIGhpdExheWVycyk7XG4gICAgLy8gcHJvcGFnYXRlIHRvIHRoZSBzdGF0ZVxuICAgIGlmICh0aGlzLl9zdGF0ZSlcbiAgICAgIHRoaXMuX3N0YXRlLmhhbmRsZUV2ZW50KGUsIGhpdExheWVycyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgc3RhdGUgb2YgdGhlIHRpbWVsaW5lLlxuICAgKlxuICAgKiBAdHlwZSB7QmFzZVN0YXRlfVxuICAgKi9cbiAgc2V0IHN0YXRlKHN0YXRlKSB7XG4gICAgaWYgKHRoaXMuX3N0YXRlKVxuICAgICAgdGhpcy5fc3RhdGUuZXhpdCgpO1xuXG4gICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcblxuICAgIGlmICh0aGlzLl9zdGF0ZSlcbiAgICAgIHRoaXMuX3N0YXRlLmVudGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgdGltZWxpbmUuXG4gICAqXG4gICAqIEB0eXBlIHtCYXNlU3RhdGV9XG4gICAqL1xuICBnZXQgc3RhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUcmFja0NvbGxlY3Rpb25gIGluc3RhbmNlLlxuICAgKlxuICAgKiBAdHlwZSB7VHJhY2tDb2xsZWN0aW9ufVxuICAgKi9cbiAgZ2V0IHRyYWNrcygpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhY2tzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGxpc3Qgb2YgYWxsIHJlZ2lzdGVyZWQgbGF5ZXJzLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqL1xuICBnZXQgbGF5ZXJzKCkge1xuICAgIHJldHVybiB0aGlzLl90cmFja3MubGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBuZXcgdHJhY2sgdG8gdGhlIHRpbWVsaW5lLlxuICAgKlxuICAgKiBAcGFyYW0ge1RyYWNrfSB0cmFjayAtIFRoZSBuZXcgdHJhY2sgdG8gYmUgcmVnaXN0ZXJlZCBpbiB0aGUgdGltZWxpbmUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbdHJhY2tJZD1udWxsXSAtIE9wdGlvbm5hbCB1bmlxdWUgaWQgdG8gYXNzb2NpYXRlIHdpdGhcbiAgICogICAgdGhlIHRyYWNrLCB0aGlzIGlkIG9ubHkgZXhpc3RzIGluIHRpbWVsaW5lJ3MgY29udGV4dCBhbmQgc2hvdWxkIGJlIHVzZWRcbiAgICogICAgaW4gY29uam9uY3Rpb24gd2l0aCBgYWRkTGF5ZXJgIG1ldGhvZC5cbiAgICovXG4gIGFkZCh0cmFjaywgdHJhY2tJZCA9IG51bGwpIHtcbiAgICBpZiAodGhpcy50cmFja3MuaGFzKHRyYWNrKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcigndHJhY2sgYWxyZWFkeSBhZGRlZCB0byB0aGUgdGltZWxpbmUnKTtcblxuICAgIHRoaXMuX3JlZ2lzdGVyVHJhY2tJZCh0cmFjaywgdHJhY2tJZCk7XG4gICAgdHJhY2suY29uZmlndXJlKHRoaXMudGltZUNvbnRleHQpO1xuXG4gICAgdGhpcy50cmFja3MuYWRkKHRyYWNrKTtcbiAgICB0aGlzLmNyZWF0ZUludGVyYWN0aW9uKHRoaXMuX3N1cmZhY2VDdG9yLCB0cmFjay4kZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSB0cmFjayBmcm9tIHRoZSB0aW1lbGluZS5cbiAgICpcbiAgICogQHBhcmFtIHtUcmFja30gdHJhY2sgLSB0aGUgdHJhY2sgdG8gcmVtb3ZlIGZyb20gdGhlIHRpbWVsaW5lLlxuICAgKiBAdG9kbyBub3QgaW1wbGVtZW50ZWQuXG4gICAqL1xuICByZW1vdmUodHJhY2spIHtcbiAgICAvLyBzaG91bGQgZGVzdHJveSBhbGwgaW50ZXJhY3Rpb25zIHRvbywgYXZvaWQgZ2hvc3QgZXZlbnRMaXN0ZW5lcnNcbiAgICBjb25zdCAkZWwgPSB0cmFjay4kZWw7XG4gICAgY29uc3QgaW50ZXJhY3Rpb25zID0gdGhpcy5fJGVsSW50ZXJhY3Rpb25zTWFwLmdldCgkZWwpO1xuXG4gICAgaWYgKGludGVyYWN0aW9ucylcbiAgICAgIGludGVyYWN0aW9ucy5mb3JFYWNoKGludGVyYWN0aW9uID0+IGludGVyYWN0aW9uLmRlc3Ryb3koKSk7XG5cbiAgICB0cmFjay5kZXN0cm95KCk7XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIHRvIGNyZWF0ZSBhIG5ldyBgVHJhY2tgIGluc3RhbmNlLiBUaGUgYHRyYWNrYCBpcyBhZGRlZCxcbiAgICogcmVuZGVyZWQgYW5kIHVwZGF0ZWQgYmVmb3JlIGJlaW5nIHJldHVybmVkLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIFRoZSBET00gZWxlbWVudCB3aGVyZSB0aGUgdHJhY2sgc2hvdWxkIGJlIGluc2VydGVkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdHJhY2tIZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSBuZXdseSBjcmVhdGVkIHRyYWNrLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3RyYWNrSWQ9bnVsbF0gLSBPcHRpb25uYWwgdW5pcXVlIGlkIHRvIGFzc29jaWF0ZSB3aXRoXG4gICAqICAgIHRoZSB0cmFjaywgdGhpcyBpZCBvbmx5IGV4aXN0cyBpbiB0aW1lbGluZSdzIGNvbnRleHQgYW5kIHNob3VsZCBiZSB1c2VkIGluXG4gICAqICAgIGNvbmpvbmN0aW9uIHdpdGggYGFkZExheWVyYCBtZXRob2QuXG4gICAqIEByZXR1cm4ge1RyYWNrfVxuICAgKi9cbiAgY3JlYXRlVHJhY2soJGVsLCB0cmFja0hlaWdodCA9IDEwMCwgdHJhY2tJZCA9IG51bGwpIHtcbiAgICBjb25zdCB0cmFjayA9IG5ldyBUcmFjaygkZWwsIHRyYWNrSGVpZ2h0KTtcbiAgICAvLyBBZGQgdHJhY2sgdG8gdGhlIHRpbWVsaW5lXG4gICAgdGhpcy5hZGQodHJhY2ssIHRyYWNrSWQpO1xuICAgIHRyYWNrLnJlbmRlcigpO1xuICAgIHRyYWNrLnVwZGF0ZSgpO1xuXG4gICAgcmV0dXJuIHRyYWNrO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRyYWNrIGlkIGlzIGRlZmluZWQsIGFzc29jaWF0ZSBhIHRyYWNrIHdpdGggYSB1bmlxdWUgaWQuXG4gICAqL1xuICBfcmVnaXN0ZXJUcmFja0lkKHRyYWNrLCB0cmFja0lkKSB7XG4gICAgaWYgKHRyYWNrSWQgIT09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLl90cmFja0J5SWRbdHJhY2tJZF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHRyYWNrSWQ6IFwiJHt0cmFja0lkfVwiIGlzIGFscmVhZHkgdXNlZGApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl90cmFja0J5SWRbdHJhY2tJZF0gPSB0cmFjaztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIHRvIGFkZCBhIGBMYXllcmAgaW5zdGFuY2UgaW50byBhIGdpdmVuIGBUcmFja2AuIElzIGRlc2lnbmVkIHRvIGJlXG4gICAqIHVzZWQgaW4gY29uam9uY3Rpb24gd2l0aCB0aGUgYFRpbWVsaW5lfmdldExheWVyc0J5R3JvdXBgIG1ldGhvZC4gVGhlXG4gICAqIGxheWVyIGlzIGludGVybmFsbHkgcmVuZGVyZWQgYW5kIHVwZGF0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7TGF5ZXJ9IGxheWVyIC0gVGhlIGBMYXllcmAgaW5zdGFuY2UgdG8gYWRkIGludG8gdGhlIHZpc3VhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7KFRyYWNrfFN0cmluZyl9IHRyYWNrT3JUcmFja0lkIC0gVGhlIGBUcmFja2AgaW5zdGFuY2UgKG9yIGl0cyBgaWRgXG4gICAqICAgIGFzIGRlZmluZWQgaW4gdGhlIGBjcmVhdGVUcmFja2AgbWV0aG9kKSB3aGVyZSB0aGUgYExheWVyYCBpbnN0YW5jZSBzaG91bGQgYmUgaW5zZXJ0ZWQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbZ3JvdXBJZD0nZGVmYXVsdCddIC0gQW4gb3B0aW9ubmFsIGdyb3VwIGlkIGluIHdoaWNoIHRoZVxuICAgKiAgICBgTGF5ZXJgIHNob3VsZCBiZSBpbnNlcnRlZC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbaXNBeGlzXSAtIFNldCB0byBgdHJ1ZWAgaWYgdGhlIGFkZGVkIGBsYXllcmAgaXMgYW5cbiAgICogICAgaW5zdGFuY2Ugb2YgYEF4aXNMYXllcmAgKHRoZXNlIGxheWVycyBzaGFyZXMgdGhlIGBUaW1saW5lVGltZUNvbnRleHRgIGluc3RhbmNlXG4gICAqICAgIG9mIHRoZSB0aW1lbGluZSkuXG4gICAqL1xuICBhZGRMYXllcihsYXllciwgdHJhY2tPclRyYWNrSWQsIGdyb3VwSWQgPSAnZGVmYXVsdCcsIGlzQXhpcyA9IGZhbHNlKSB7XG4gICAgbGV0IHRyYWNrID0gdHJhY2tPclRyYWNrSWQ7XG5cbiAgICBpZiAodHlwZW9mIHRyYWNrT3JUcmFja0lkID09PSAnc3RyaW5nJykge1xuICAgICAgdHJhY2sgPSB0aGlzLmdldFRyYWNrQnlJZCh0cmFja09yVHJhY2tJZCk7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlcyB0aGUgYExheWVyVGltZUNvbnRleHRgIGlmIG5vdCBwcmVzZW50XG4gICAgaWYgKCFsYXllci50aW1lQ29udGV4dCkge1xuICAgICAgY29uc3QgdGltZUNvbnRleHQgPSBpc0F4aXMgP1xuICAgICAgICB0aGlzLnRpbWVDb250ZXh0IDogbmV3IExheWVyVGltZUNvbnRleHQodGhpcy50aW1lQ29udGV4dCk7XG5cbiAgICAgIGxheWVyLnNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KTtcbiAgICB9XG5cbiAgICAvLyB3ZSBzaG91bGQgaGF2ZSBhIFRyYWNrIGluc3RhbmNlIGF0IHRoaXMgcG9pbnRcbiAgICB0cmFjay5hZGQobGF5ZXIpO1xuXG4gICAgaWYgKCF0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdKSB7XG4gICAgICB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5fZ3JvdXBlZExheWVyc1tncm91cElkXS5wdXNoKGxheWVyKTtcblxuICAgIGxheWVyLnJlbmRlcigpO1xuICAgIGxheWVyLnVwZGF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBsYXllciBmcm9tIGl0cyB0cmFjay4gVGhlIGxheWVyIGlzIGRldGF0Y2hlZCBmcm9tIHRoZSBET00gYnV0XG4gICAqIGNhbiBzdGlsbCBiZSByZXVzZWQgbGF0ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7TGF5ZXJ9IGxheWVyIC0gVGhlIGxheWVyIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZUxheWVyKGxheWVyKSB7XG4gICAgdGhpcy50cmFja3MuZm9yRWFjaChmdW5jdGlvbih0cmFjaykge1xuICAgICAgY29uc3QgaW5kZXggPSB0cmFjay5sYXllcnMuaW5kZXhPZihsYXllcik7XG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7IHRyYWNrLnJlbW92ZShsYXllcik7IH1cbiAgICB9KTtcblxuICAgIC8vIGNsZWFuIHJlZmVyZW5jZXMgaW4gaGVscGVyc1xuICAgIGZvciAobGV0IGdyb3VwSWQgaW4gdGhpcy5fZ3JvdXBlZExheWVycykge1xuICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdO1xuICAgICAgY29uc3QgaW5kZXggPSBncm91cC5pbmRleE9mKGxheWVyKTtcblxuICAgICAgaWYgKGluZGV4ICE9PSAtMSkgeyBncm91cC5zcGxpY2UobGF5ZXIsIDEpOyB9XG5cbiAgICAgIGlmICghZ3JvdXAubGVuZ3RoKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgYFRyYWNrYCBpbnN0YW5jZSBmcm9tIGl0J3MgZ2l2ZW4gaWQuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0cmFja0lkXG4gICAqIEByZXR1cm4ge1RyYWNrfVxuICAgKi9cbiAgZ2V0VHJhY2tCeUlkKHRyYWNrSWQpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhY2tCeUlkW3RyYWNrSWRdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRyYWNrIGNvbnRhaW5pbmcgYSBnaXZlbiBET00gRWxlbWVudCwgcmV0dXJucyBudWxsIGlmIG5vIG1hdGNoIGZvdW5kLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIFRoZSBET00gRWxlbWVudCB0byBiZSB0ZXN0ZWQuXG4gICAqIEByZXR1cm4ge1RyYWNrfVxuICAgKi9cbiAgZ2V0VHJhY2tGcm9tRE9NRWxlbWVudCgkZWwpIHtcbiAgICBsZXQgJHN2ZyA9IG51bGw7XG4gICAgbGV0IHRyYWNrID0gbnVsbDtcbiAgICAvLyBmaW5kIHRoZSBjbG9zZXN0IGAudHJhY2tgIGVsZW1lbnRcbiAgICBkbyB7XG4gICAgICBpZiAoJGVsLmNsYXNzTGlzdC5jb250YWlucygndHJhY2snKSkge1xuICAgICAgICAkc3ZnID0gJGVsO1xuICAgICAgfVxuICAgICAgJGVsID0gJGVsLnBhcmVudE5vZGU7XG4gICAgfSB3aGlsZSAoJHN2ZyA9PT0gbnVsbCk7XG4gICAgLy8gZmluZCB0aGUgcmVsYXRlZCBgVHJhY2tgXG4gICAgdGhpcy50cmFja3MuZm9yRWFjaChmdW5jdGlvbihfdHJhY2spIHtcbiAgICAgIGlmIChfdHJhY2suJHN2ZyA9PT0gJHN2ZykgeyB0cmFjayA9IF90cmFjazsgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRyYWNrO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgbGF5ZXJzIGZyb20gdGhlaXIgZ2l2ZW4gZ3JvdXAgaWQuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBncm91cElkIC0gVGhlIGlkIG9mIHRoZSBncm91cCBhcyBkZWZpbmVkIGluIGBhZGRMYXllcmAuXG4gICAqIEByZXR1cm4geyhBcnJheXx1bmRlZmluZWQpfVxuICAgKi9cbiAgZ2V0TGF5ZXJzQnlHcm91cChncm91cElkKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGltZWxpbmU7XG4iLCJpbXBvcnQgTGF5ZXIgZnJvbSAnLi9sYXllcic7XG5cblxuLyoqXG4gKiBDb2xsZWN0aW9uIGhvc3RpbmcgYWxsIHRoZSBgVHJhY2tgIGluc3RhbmNlcyByZWdpc3RlcmVkIGludG8gdGhlIHRpbWVsaW5lLlxuICogSXQgcHJvdmlkZXMgc2hvcmN1dHMgdG8gdHJpZ2dlciBgcmVuZGVyYCAvIGB1cGRhdGVgIG1ldGhvZHMgb24gdHJhY2tzIG9yXG4gKiBsYXllcnMuIEV4dGVuZCBidWlsdC1pbiBBcnJheVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFja0NvbGxlY3Rpb24ge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHRoaXMuX3RpbWVsaW5lID0gdGltZWxpbmU7XG4gICAgdGhpcy5fdHJhY2tzID0gbmV3IFNldCgpO1xuICB9XG5cbiAgLy8gQG5vdGUgLSBzaG91bGQgYmUgaW4gdGhlIHRpbWVsaW5lID9cbiAgLy8gQHRvZG8gLSBhbGxvdyB0byBwYXNzIGFuIGFycmF5IG9mIGxheWVyc1xuICBfZ2V0TGF5ZXJzT3JHcm91cHMobGF5ZXJPckdyb3VwID0gbnVsbCkge1xuICAgIGxldCBsYXllcnMgPSBudWxsO1xuXG4gICAgaWYgKHR5cGVvZiBsYXllck9yR3JvdXAgPT09ICdzdHJpbmcnKSB7XG4gICAgICBsYXllcnMgPSB0aGlzLl90aW1lbGluZS5ncm91cGVkTGF5ZXJzW2xheWVyT3JHcm91cF07XG4gICAgfSBlbHNlIGlmIChsYXllck9yR3JvdXAgaW5zdGFuY2VvZiBMYXllcikge1xuICAgICAgbGF5ZXJzID0gW2xheWVyT3JHcm91cF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxheWVycyA9IHRoaXMubGF5ZXJzO1xuICAgIH1cblxuICAgIHJldHVybiBsYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGUge051bWJlcn0gLSBVcGRhdGVzIHRoZSBoZWlnaHQgb2YgYWxsIHRyYWNrcyBhdCBvbmNlLlxuICAgKiBAdG9kbyAtIFByb3BhZ2F0ZSB0byBsYXllcnMsIG5vdCB1c2VmdWxsIGZvciBub3cuXG4gICAqL1xuICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgdGhpcy5fdHJhY2tzLmZvckVhY2goKHRyYWNrKSA9PiB0cmFjay5oZWlnaHQgPSB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQW4gYXJyYXkgb2YgYWxsIHJlZ2lzdGVyZWQgbGF5ZXJzLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXk8TGF5ZXI+fVxuICAgKi9cbiAgZ2V0IGxheWVycygpIHtcbiAgICBsZXQgbGF5ZXJzID0gW107XG4gICAgdGhpcy5fdHJhY2tzLmZvckVhY2godHJhY2sgPT4gbGF5ZXJzID0gbGF5ZXJzLmNvbmNhdCh0cmFjay5sYXllcnMpKTtcblxuICAgIHJldHVybiBsYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSBnaXZlbiB0cmFjayBiZWxvbmdzIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge1RyYWNrfSB0cmFjayAtIFRyYWNrIHRvIGJlIHRlc3RlZFxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICovXG4gIGhhcyh0cmFjaykge1xuICAgIHJldHVybiB0aGlzLl90cmFja3MuaGFzKHRyYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSB0cmFjayB0byB0aGUgY29sbGVjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtUcmFja30gdHJhY2sgLSBUcmFjayB0byBhZGQgdG8gdGhlIGNvbGxlY3Rpb25cbiAgICovXG4gIGFkZCh0cmFjaykge1xuICAgIHRoaXMuX3RyYWNrcy5hZGQodHJhY2spO1xuICB9XG5cbiAgLy8gQHRvZG9cbiAgcmVtb3ZlKHRyYWNrKSB7fVxuXG4gIGZvckVhY2goY2FsbGJhY2spIHtcbiAgICB0aGlzLl90cmFja3MuZm9yRWFjaChjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIGFsbCB0cmFja3MgYW5kIGxheWVycy4gV2hlbiBkb25lLCB0aGUgdGltZWxpbmUgdHJpZ2dlcnMgYSBgcmVuZGVyYCBldmVudC5cbiAgICovXG4gIHJlbmRlcigpIHtcbiAgICB0aGlzLl90cmFja3MuZm9yRWFjaCh0cmFjayA9PiB0cmFjay5yZW5kZXIoKSk7XG4gICAgdGhpcy5fdGltZWxpbmUuZW1pdCgncmVuZGVyJyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBhbGwgdHJhY2tzIGFuZCBsYXllcnMuIFdoZW4gZG9uZSwgdGhlIHRpbWVsaW5lIHRyaWdnZXJzIGFcbiAgICogYHVwZGF0ZWAgZXZlbnQuXG4gICAqXG4gICAqIEB0b2RvIC0gZmlsdGVyaW5nIGlzIHByb2JhYmx5IGJyb2tlbi4uLlxuICAgKiBAcGFyYW0ge0xheWVyfFN0cmluZ30gbGF5ZXJPckdyb3VwIC0gRmlsdGVyIHRoZSBsYXllcnMgdG8gdXBkYXRlIGJ5XG4gICAqICAgIHBhc3NpbmcgdGhlIGBMYXllcmAgaW5zdGFuY2UgdG8gdXBkYXRlIG9yIGEgYGdyb3VwSWRgXG4gICAqL1xuICB1cGRhdGUobGF5ZXJPckdyb3VwKSB7XG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5fZ2V0TGF5ZXJzT3JHcm91cHMobGF5ZXJPckdyb3VwKTtcbiAgICB0aGlzLl90cmFja3MuZm9yRWFjaCh0cmFjayA9PiB0cmFjay51cGRhdGUobGF5ZXJzKSk7XG4gICAgdGhpcy5fdGltZWxpbmUuZW1pdCgndXBkYXRlJywgbGF5ZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIGFsbCBgVHJhY2tgIGNvbnRhaW5lcnMsIGxheWVycyBhcmUgbm90IHVwZGF0ZWQgd2l0aCB0aGlzIG1ldGhvZC5cbiAgICogV2hlbiBkb25lLCB0aGUgdGltZWxpbmUgdHJpZ2dlcnMgYSBgdXBkYXRlOmNvbnRhaW5lcnNgIGV2ZW50LlxuICAgKi9cbiAgdXBkYXRlQ29udGFpbmVyKC8qIHRyYWNrT3JUcmFja0lkcyAqLykge1xuICAgIHRoaXMuX3RyYWNrcy5mb3JFYWNoKHRyYWNrID0+IHRyYWNrLnVwZGF0ZUNvbnRhaW5lcigpKTtcbiAgICB0aGlzLl90aW1lbGluZS5lbWl0KCd1cGRhdGU6Y29udGFpbmVycycpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgYWxsIGxheWVycy4gV2hlbiBkb25lLCB0aGUgdGltZWxpbmUgdHJpZ2dlcnMgYSBgdXBkYXRlOmxheWVyc2AgZXZlbnQuXG4gICAqXG4gICAqIEB0b2RvIC0gZmlsdGVyaW5nIGlzIHByb2JhYmx5IGJyb2tlbi4uLlxuICAgKiBAcGFyYW0ge0xheWVyfFN0cmluZ30gbGF5ZXJPckdyb3VwIC0gRmlsdGVyIHRoZSBsYXllcnMgdG8gdXBkYXRlIGJ5XG4gICAqICAgIHBhc3NpbmcgdGhlIGBMYXllcmAgaW5zdGFuY2UgdG8gdXBkYXRlIG9yIGEgYGdyb3VwSWRgXG4gICAqL1xuICB1cGRhdGVMYXllcnMobGF5ZXJPckdyb3VwKSB7XG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5fZ2V0TGF5ZXJzT3JHcm91cHMobGF5ZXJPckdyb3VwKTtcbiAgICB0aGlzLl90cmFja3MuZm9yRWFjaCh0cmFjayA9PiB0cmFjay51cGRhdGVMYXllcnMobGF5ZXJzKSk7XG4gICAgdGhpcy5fdGltZWxpbmUuZW1pdCgndXBkYXRlOmxheWVycycsIGxheWVycyk7XG4gIH1cbn1cbiIsImltcG9ydCBucyBmcm9tICcuL25hbWVzcGFjZSc7XG5cblxuLyoqXG4gKiBBY3RzIGFzIGEgcGxhY2Vob2xkZXIgdG8gb3JnYW5pemUgdGhlIHZlcnRpY2FsIGxheW91dCBvZiB0aGUgdmlzdWFsaXphdGlvblxuICogYW5kIHRoZSBob3Jpem9udGFsIGFsaWduZW1lbnQgdG8gYW4gYWJzY2lzc2EgdGhhdCBjb3JyZXNwb25kIHRvIGEgY29tbW9uXG4gKiB0aW1lIHJlZmVyZW5jZS4gSXQgYmFzaWNhbGx5IG9mZmVyIGEgdmlldyBvbiB0aGUgb3ZlcmFsbCB0aW1lbGluZS5cbiAqXG4gKiBUcmFja3MgYXJlIGluc2VydGVkIGludG8gYSBnaXZlbiBET00gZWxlbWVudCwgYWxsb3dpbmcgdG8gY3JlYXRlIERBVyBsaWtlXG4gKiByZXByZXNlbnRhdGlvbnMuIEVhY2ggYFRyYWNrYCBpbnN0YW5jZSBjYW4gaG9zdCBtdWx0aXBsZSBgTGF5ZXJgIGluc3RhbmNlcy5cbiAqIEEgdHJhY2sgbXVzdCBiZSBhZGRlZCB0byBhIHRpbWVsaW5lIGJlZm9yZSBiZWluZyB1cGRhdGVkLlxuICpcbiAqICMjIyBBIHRpbWVsaW5lIHdpdGggMyB0cmFja3M6XG4gKlxuICogYGBgXG4gKiAwICAgICAgICAgICAgICAgICA2ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDE2XG4gKiArLSAtIC0gLSAtIC0gLSAtIC0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstIC0gLSAtIC0gLSAtXG4gKiB8ICAgICAgICAgICAgICAgICB8eCB0cmFjayAxIHh4eHh4eHh4eHh4eHh4eHh4eHh4eHxcbiAqICstIC0gLSAtIC0gLSAtIC0gLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0gLSAtIC0gLSAtIC1cbiAqIHwgICAgICAgICAgICAgICAgIHx4IHRyYWNrIDIgeHh4eHh4eHh4eHh4eHh4eHh4eHh4fFxuICogKy0gLSAtIC0gLSAtIC0gLSAtKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLSAtIC0gLSAtIC0gLVxuICogfCAgICAgICAgICAgICAgICAgfHggdHJhY2sgMyB4eHh4eHh4eHh4eHh4eHh4eHh4eHh8XG4gKiArLSAtIC0gLSAtIC0gLSAtIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstIC0gLSAtIC0gLSAtXG4gKiArLS0tLS0tLS0tLS0tLS0tLS0+XG4gKiB0aW1lbGluZS50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aW1lbGluZS50aW1lQ29udGV4dC5vZmZzZXQpXG4gKlxuICogICAgICAgICAgICAgICAgICAgPC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XG4gKiAgICAgICAgICAgICAgICAgICB0aW1lbGluZSdzIHRyYWNrcyBkZWZhdWx0cyB0byAxMDAwcHhcbiAqICAgICAgICAgICAgICAgICAgIHdpdGggYSBkZWZhdWx0IHBpeGVsc1BlclNlY29uZCBvZiAxMDBweC9zLlxuICogICAgICAgICAgICAgICAgICAgYW5kIGEgZGVmYXVsdCBgc3RyZXRjaFJhdGlvID0gMWBcbiAqICAgICAgICAgICAgICAgICAgIHRyYWNrMSBzaG93cyAxMCBzZWNvbmRzIG9mIHRoZSB0aW1lbGluZVxuICogYGBgXG4gKlxuICogIyMjIFRyYWNrIERPTSBzdHJ1Y3R1cmVcbiAqXG4gKiBgYGBodG1sXG4gKiA8c3ZnIHdpZHRoPVwiJHt2aXNpYmxlV2lkdGh9XCI+XG4gKiAgIDwhLS0gYmFja2dyb3VuZCAtLT5cbiAqICAgPHJlY3Q+PHJlY3Q+XG4gKiAgIDwhLS0gbWFpbiB2aWV3IC0tPlxuICogICA8ZyBjbGFzcz1cIm9mZnNldFwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgke29mZnNldH0sIDApXCI+XG4gKiAgICAgPGcgY2xhc3M9XCJsYXlvdXRcIj5cbiAqICAgICAgIDwhLS0gbGF5ZXJzIC0tPlxuICogICAgIDwvZz5cbiAqICAgPC9nPlxuICogICA8ZyBjbGFzcz1cImludGVyYWN0aW9uc1wiPjwhLS0gZm9yIGZlZWRiYWNrIC0tPjwvZz5cbiAqIDwvc3ZnPlxuICogYGBgXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNrIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gJGVsXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbaGVpZ2h0ID0gMTAwXVxuICAgKi9cbiAgY29uc3RydWN0b3IoJGVsLCBoZWlnaHQgPSAxMDApIHtcbiAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgRE9NIGVsZW1lbnQgaW4gd2hpY2ggdGhlIHRyYWNrIGlzIGNyZWF0ZWQuXG4gICAgICogQHR5cGUge0VsZW1lbnR9XG4gICAgICovXG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgLyoqXG4gICAgICogQSBwbGFjZWhvbGRlciB0byBhZGQgc2hhcGVzIGZvciBpbnRlcmFjdGlvbnMgZmVlZGJhY2suXG4gICAgICogQHR5cGUge0VsZW1lbnR9XG4gICAgICovXG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kbGF5b3V0ID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kb2Zmc2V0ID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kc3ZnID0gbnVsbDtcbiAgICAvKiogQHR5cGUge0VsZW1lbnR9ICovXG4gICAgdGhpcy4kYmFja2dyb3VuZCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBBbiBhcnJheSBvZiBhbGwgdGhlIGxheWVycyBiZWxvbmdpbmcgdG8gdGhlIHRyYWNrLlxuICAgICAqIEB0eXBlIHtBcnJheTxMYXllcj59XG4gICAgICovXG4gICAgdGhpcy5sYXllcnMgPSBbXTtcbiAgICAvKipcbiAgICAgKiBUaGUgY29udGV4dCB1c2VkIHRvIG1haW50YWluIHRoZSBET00gc3RydWN0dXJlIG9mIHRoZSB0cmFjay5cbiAgICAgKiBAdHlwZSB7VGltZWxpbmVUaW1lQ29udGV4dH1cbiAgICAgKi9cbiAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQgPSBudWxsO1xuXG4gICAgdGhpcy5fY3JlYXRlQ29udGFpbmVyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IG9mIHRoZSB0cmFjay5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBoZWlnaHQgb2YgdGhlIHRyYWNrLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgIGNvbnN0IHByZXZIZWlnaHQgPSB0aGlzLl9oZWlnaHQ7XG4gICAgdGhpcy5faGVpZ2h0ID0gdmFsdWU7XG5cbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKGxheWVyID0+IGxheWVyLnVwZGF0ZUhlaWdodChwcmV2SGVpZ2h0LCB0aGlzLl9oZWlnaHQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgd2hlbiB0aGUgdHJhY2sgaXMgYWRkZWQgdG8gdGhlIHRpbWVsaW5lLiBUaGVcbiAgICogdHJhY2sgY2Fubm90IGJlIHVwZGF0ZWQgd2l0aG91dCBiZWluZyBhZGRlZCB0byBhIHRpbWVsaW5lLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1RpbWVsaW5lVGltZUNvbnRleHR9IHJlbmRlcmluZ0NvbnRleHRcbiAgICovXG4gIGNvbmZpZ3VyZShyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0ID0gcmVuZGVyaW5nQ29udGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSB0cmFjay4gVGhlIGxheWVycyBmcm9tIHRoaXMgdHJhY2sgY2FuIHN0aWxsIGJlIHJldXNlZCBlbHNld2hlcmUuXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIC8vIERldGFjaCBldmVyeXRoaW5nIGZyb20gdGhlIERPTVxuICAgIHRoaXMuJGVsLnJlbW92ZUNoaWxkKHRoaXMuJHN2Zyk7XG4gICAgdGhpcy5sYXllcnMuZm9yRWFjaChsYXllciA9PiB0aGlzLiRsYXlvdXQucmVtb3ZlQ2hpbGQobGF5ZXIuJGVsKSk7XG4gICAgLy8gY2xlYW4gcmVmZXJlbmNlc1xuICAgIHRoaXMuJGVsID0gbnVsbDtcbiAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQgPSBudWxsO1xuICAgIHRoaXMubGF5ZXJzLmxlbmd0aCA9IDA7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgRE9NIHN0cnVjdHVyZSBvZiB0aGUgdHJhY2suXG4gICAqL1xuICBfY3JlYXRlQ29udGFpbmVyKCkge1xuICAgIGNvbnN0ICRzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdzdmcnKTtcbiAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnb3B0aW1pemVTcGVlZCcpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KTtcbiAgICAkc3ZnLnNldEF0dHJpYnV0ZSgneG1sbnM6eGh0bWwnLCAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcpO1xuICAgICRzdmcuY2xhc3NMaXN0LmFkZCgndHJhY2snKTtcblxuICAgIGNvbnN0ICRiYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncmVjdCcpO1xuICAgICRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAnMTAwJScpO1xuICAgICRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsICcxMDAlJyk7XG4gICAgJGJhY2tncm91bmQuc3R5bGUuZmlsbE9wYWNpdHkgPSAwO1xuICAgIC8vICRiYWNrZ3JvdW5kLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG5cbiAgICBjb25zdCAkZGVmcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2RlZnMnKTtcblxuICAgIGNvbnN0ICRvZmZzZXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAkb2Zmc2V0R3JvdXAuY2xhc3NMaXN0LmFkZCgnb2Zmc2V0Jyk7XG5cbiAgICBjb25zdCAkbGF5b3V0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgJGxheW91dEdyb3VwLmNsYXNzTGlzdC5hZGQoJ2xheW91dCcpO1xuXG4gICAgY29uc3QgJGludGVyYWN0aW9uc0dyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICRpbnRlcmFjdGlvbnNHcm91cC5jbGFzc0xpc3QuYWRkKCdpbnRlcmFjdGlvbnMnKTtcblxuICAgICRvZmZzZXRHcm91cC5hcHBlbmRDaGlsZCgkbGF5b3V0R3JvdXApO1xuICAgICRzdmcuYXBwZW5kQ2hpbGQoJGRlZnMpO1xuICAgICRzdmcuYXBwZW5kQ2hpbGQoJGJhY2tncm91bmQpO1xuICAgICRzdmcuYXBwZW5kQ2hpbGQoJG9mZnNldEdyb3VwKTtcbiAgICAkc3ZnLmFwcGVuZENoaWxkKCRpbnRlcmFjdGlvbnNHcm91cCk7XG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQoJHN2Zyk7XG4gICAgLy8gcmVtb3ZlcyBhZGRpdGlvbm5hbCBoZWlnaHQgYWRkZWQgd2hvIGtub3dzIHdoeS4uLlxuICAgIHRoaXMuJGVsLnN0eWxlLmZvbnRTaXplID0gMDtcbiAgICAvLyBmaXhlcyBvbmUgb2YgdGhlIChtYW55ID8pIHdlaXJkIGNhbnZhcyByZW5kZXJpbmcgYnVncyBpbiBDaHJvbWVcbiAgICB0aGlzLiRlbC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWigwKSc7XG5cbiAgICB0aGlzLiRsYXlvdXQgPSAkbGF5b3V0R3JvdXA7XG4gICAgdGhpcy4kb2Zmc2V0ID0gJG9mZnNldEdyb3VwO1xuICAgIHRoaXMuJGludGVyYWN0aW9ucyA9ICRpbnRlcmFjdGlvbnNHcm91cDtcbiAgICB0aGlzLiRzdmcgPSAkc3ZnO1xuICAgIHRoaXMuJGJhY2tncm91bmQgPSAkYmFja2dyb3VuZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbGF5ZXIgdG8gdGhlIHRyYWNrLlxuICAgKlxuICAgKiBAcGFyYW0ge0xheWVyfSBsYXllciAtIHRoZSBsYXllciB0byBhZGQgdG8gdGhlIHRyYWNrLlxuICAgKi9cbiAgYWRkKGxheWVyKSB7XG4gICAgdGhpcy5sYXllcnMucHVzaChsYXllcik7XG4gICAgLy8gQ3JlYXRlIGEgZGVmYXVsdCByZW5kZXJpbmdDb250ZXh0IGZvciB0aGUgbGF5ZXIgaWYgbWlzc2luZ1xuICAgIHRoaXMuJGxheW91dC5hcHBlbmRDaGlsZChsYXllci4kZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBsYXllciBmcm9tIHRoZSB0cmFjay4gVGhlIGxheWVyIGNhbiBiZSByZXVzZWQgZWxzZXdoZXJlLlxuICAgKlxuICAgKiBAcGFyYW0ge0xheWVyfSBsYXllciAtIHRoZSBsYXllciB0byByZW1vdmUgZnJvbSB0aGUgdHJhY2suXG4gICAqL1xuICByZW1vdmUobGF5ZXIpIHtcbiAgICB0aGlzLmxheWVycy5zcGxpY2UodGhpcy5sYXllcnMuaW5kZXhPZihsYXllciksIDEpO1xuICAgIC8vIFJlbW92ZXMgbGF5ZXIgZnJvbSBpdHMgY29udGFpbmVyXG4gICAgdGhpcy4kbGF5b3V0LnJlbW92ZUNoaWxkKGxheWVyLiRlbCk7XG4gIH1cblxuICAvKipcbiAgICogVGVzdHMgaWYgYSBnaXZlbiBlbGVtZW50IGJlbG9uZ3MgdG8gdGhlIHRyYWNrLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbFxuICAgKiBAcmV0dXJuIHtib29sfVxuICAgKi9cbiAgaGFzRWxlbWVudCgkZWwpIHtcbiAgICBkbyB7XG4gICAgICBpZiAoJGVsID09PSB0aGlzLiRlbCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgJGVsID0gJGVsLnBhcmVudE5vZGU7XG4gICAgfSB3aGlsZSAoJGVsICE9PSBudWxsKTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgYWxsIHRoZSBsYXllcnMgYWRkZWQgdG8gdGhlIHRyYWNrLlxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIGZvciAobGV0IGxheWVyIG9mIHRoaXMpIHsgbGF5ZXIucmVuZGVyKCk7IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB0cmFjayBET00gc3RydWN0dXJlIGFuZCB1cGRhdGVzIHRoZSBsYXllcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXk8TGF5ZXI+fSBbbGF5ZXJzPW51bGxdIC0gaWYgbm90IG51bGwsIGEgc3Vic2V0IG9mIHRoZSBsYXllcnMgdG8gdXBkYXRlLlxuICAgKi9cbiAgdXBkYXRlKGxheWVycyA9IG51bGwpIHtcbiAgICB0aGlzLnVwZGF0ZUNvbnRhaW5lcigpO1xuICAgIHRoaXMudXBkYXRlTGF5ZXJzKGxheWVycyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgdHJhY2sgRE9NIHN0cnVjdHVyZS5cbiAgICovXG4gIHVwZGF0ZUNvbnRhaW5lcigpIHtcbiAgICBjb25zdCAkc3ZnID0gdGhpcy4kc3ZnO1xuICAgIGNvbnN0ICRvZmZzZXQgPSB0aGlzLiRvZmZzZXQ7XG4gICAgLy8gU2hvdWxkIGJlIGluIHNvbWUgdXBkYXRlIGxheW91dFxuICAgIGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLnJlbmRlcmluZ0NvbnRleHQ7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgY29uc3Qgd2lkdGggPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoKTtcbiAgICBjb25zdCBvZmZzZXRYID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHJlbmRlcmluZ0NvbnRleHQub2Zmc2V0KSk7XG4gICAgY29uc3QgdHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgke29mZnNldFh9LCAwKWA7XG5cbiAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3ZpZXdib3gnLCBgMCAwICR7d2lkdGh9ICR7aGVpZ2h0fWApO1xuXG4gICAgJG9mZnNldC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBsYXllcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXk8TGF5ZXI+fSBbbGF5ZXJzPW51bGxdIC0gaWYgbm90IG51bGwsIGEgc3Vic2V0IG9mIHRoZSBsYXllcnMgdG8gdXBkYXRlLlxuICAgKi9cbiAgdXBkYXRlTGF5ZXJzKGxheWVycyA9IG51bGwpIHtcbiAgICBsYXllcnMgPSAobGF5ZXJzID09PSBudWxsKSA/IHRoaXMubGF5ZXJzIDogbGF5ZXJzO1xuXG4gICAgbGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBpZiAodGhpcy5sYXllcnMuaW5kZXhPZihsYXllcikgPT09IC0xKSB7IHJldHVybjsgfVxuICAgICAgbGF5ZXIudXBkYXRlKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZXMgdGhyb3VnaCB0aGUgYWRkZWQgbGF5ZXJzLlxuICAgKi9cbiAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHlpZWxkKiB0aGlzLmxheWVyc1tTeW1ib2wuaXRlcmF0b3JdKCk7XG4gIH1cbn1cbiIsImltcG9ydCBBbm5vdGF0ZWRNYXJrZXIgZnJvbSAnLi4vc2hhcGVzL2Fubm90YXRlZC1tYXJrZXInO1xuaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IE1hcmtlckJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9tYXJrZXItYmVoYXZpb3InO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIGFubm90YXRlZCBtYXJrZXIgbGF5ZXJcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1tYXJrZXIuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5ub3RhdGVkTWFya2VyTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhIC0gVGhlIGRhdGEgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKiBAdG9kbyAtIEFkZCBhY2Nlc3NvcnMgYW5kIG9wdGlvbnMgZm9yIHRoZSBzaGFwZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCdjb2xsZWN0aW9uJywgZGF0YSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKEFubm90YXRlZE1hcmtlciwge1xuICAgICAgZGlzcGxheUxhYmVsczogdHJ1ZSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0QmVoYXZpb3IobmV3IE1hcmtlckJlaGF2aW9yKCkpO1xuICB9XG59XG4iLCJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgQW5ub3RhdGVkU2VnbWVudCBmcm9tICcuLi9zaGFwZXMvYW5ub3RhdGVkLXNlZ21lbnQnO1xuaW1wb3J0IFNlZ21lbnRCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvc2VnbWVudC1iZWhhdmlvcic7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgYW5ub3RhdGVkIHNlZ21lbnQgbGF5ZXIuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItc2VnbWVudC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbm5vdGF0ZWRTZWdtZW50TGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhIC0gVGhlIGRhdGEgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYWNjZXNzb3JzIC0gVGhlIGFjY2Vzc29ycyB0byBjb25maWd1cmUgdGhlIG1hcHBpbmdcbiAgICogICAgYmV0d2VlbiBzaGFwZXMgYW5kIGRhdGEuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30sIGFjY2Vzc29ycyA9IHt9KSB7XG4gICAgc3VwZXIoJ2NvbGxlY3Rpb24nLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogdHJ1ZSxcbiAgICAgIG9wYWNpdHk6IDAuNixcbiAgICAgIGRpc3BsYXlMYWJlbHM6IHRydWUsXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKEFubm90YXRlZFNlZ21lbnQsIGFjY2Vzc29ycywge1xuICAgICAgZGlzcGxheUhhbmRsZXJzOiBvcHRpb25zLmRpc3BsYXlIYW5kbGVycyxcbiAgICAgIG9wYWNpdHk6IG9wdGlvbnMub3BhY2l0eSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0QmVoYXZpb3IobmV3IFNlZ21lbnRCZWhhdmlvcigpKTtcbiAgfVxufVxuIiwiaW1wb3J0IEJyZWFrcG9pbnRCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvYnJlYWtwb2ludC1iZWhhdmlvcic7XG5pbXBvcnQgRG90IGZyb20gJy4uL3NoYXBlcy9kb3QnO1xuaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IExpbmUgZnJvbSAnLi4vc2hhcGVzL2xpbmUnO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIGJyZWFrcG9pbnQgZnVuY3Rpb24gbGF5ZXIuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYnJlYWtwb2ludC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcmVha3BvaW50TGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhIC0gVGhlIGRhdGEgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYWNjZXNzb3JzIC0gVGhlIGFjY2Vzc29ycyB0byBjb25maWd1cmUgdGhlIG1hcHBpbmdcbiAgICogICAgYmV0d2VlbiBzaGFwZXMgYW5kIGRhdGEuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30sIGFjY2Vzc29ycyA9IHt9KSB7XG4gICAgc3VwZXIoJ2NvbGxlY3Rpb24nLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IGNvbG9yID0gb3B0aW9ucy5jb2xvcjtcbiAgICBsZXQgY29tbW9uU2hhcGVPcHRpb25zID0ge307XG5cbiAgICBpZiAoY29sb3IpIHtcbiAgICAgIGFjY2Vzc29ycy5jb2xvciA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gY29sb3I7IH07XG4gICAgICBjb21tb25TaGFwZU9wdGlvbnMuY29sb3IgPSBjb2xvcjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ3VyZUNvbW1vblNoYXBlKExpbmUsIGFjY2Vzc29ycywgY29tbW9uU2hhcGVPcHRpb25zKTtcbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKERvdCwgYWNjZXNzb3JzLCB7fSk7XG4gICAgdGhpcy5zZXRCZWhhdmlvcihuZXcgQnJlYWtwb2ludEJlaGF2aW9yKCkpO1xuICB9XG59XG4iLCJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgQ3Vyc29yIGZyb20gJy4uL3NoYXBlcy9jdXJzb3InO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIGN1cnNvciBsYXllci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1jdXJzb3IuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3Vyc29yTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBjb2xvcjogJ3JlZCcsXG4gICAgICBoaXR0YWJsZTogZmFsc2UsIC8vIGtpbmQgb2YgcGFzcyB0aHJvdWdoIGxheWVyXG4gICAgfTtcblxuICAgIGNvbnN0IGRhdGEgPSB7IGN1cnJlbnRQb3NpdGlvbjogMCB9O1xuXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIHN1cGVyKCdlbnRpdHknLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoQ3Vyc29yLCB7IHg6IChkKSA9PiBkLmN1cnJlbnRQb3NpdGlvbiB9LCB7XG4gICAgICBjb2xvcjogb3B0aW9ucy5jb2xvclxuICAgIH0pO1xuICB9XG5cbiAgc2V0IGN1cnJlbnRQb3NpdGlvbih2YWx1ZSkge1xuICAgIHRoaXMuZGF0YVswXS5jdXJyZW50UG9zaXRpb24gPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBjdXJyZW50UG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVswXS5jdXJyZW50UG9zaXRpb247XG4gIH1cbn1cbiIsImltcG9ydCBBeGlzTGF5ZXIgZnJvbSAnLi4vYXhpcy9heGlzLWxheWVyJztcbmltcG9ydCBUaWNrcyBmcm9tICcuLi9zaGFwZXMvdGlja3MnO1xuaW1wb3J0IGdyaWRBeGlzR2VuZXJhdG9yIGZyb20gJy4uL2F4aXMvZ3JpZC1heGlzLWdlbmVyYXRvcic7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgZ3JpZCBsYXllclxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWF4aXMuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZEF4aXNMYXllciBleHRlbmRzIEF4aXNMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGNvbG9yOiAnc3RlZWxibHVlJyxcbiAgICAgIGJwbTogNjAsXG4gICAgICBzaWduYXR1cmU6ICc0LzQnXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICBzdXBlcihncmlkQXhpc0dlbmVyYXRvcihvcHRpb25zLmJwbSwgb3B0aW9ucy5zaWduYXR1cmUpLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoVGlja3MsIHt9LCB7XG4gICAgICBjb2xvcjogb3B0aW9ucy5jb2xvclxuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgTWFya2VyIGZyb20gJy4uL3NoYXBlcy9tYXJrZXInO1xuaW1wb3J0IE1hcmtlckJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9tYXJrZXItYmVoYXZpb3InO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIG1hcmtlciBsYXllci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1icmVha3BvaW50Lmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcmtlckxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtBcnJheX0gZGF0YSAtIFRoZSBkYXRhIHRvIHJlbmRlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBBbiBvYmplY3QgdG8gY29uZmlndXJlIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtPYmplY3R9IGFjY2Vzc29ycyAtIFRoZSBhY2Nlc3NvcnMgdG8gY29uZmlndXJlIHRoZSBtYXBwaW5nXG4gICAqICAgIGJldHdlZW4gc2hhcGVzIGFuZCBkYXRhLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YSwgb3B0aW9ucyA9IHt9LCBhY2Nlc3NvcnMgPSB7fSkge1xuICAgIHN1cGVyKCdjb2xsZWN0aW9uJywgZGF0YSwgb3B0aW9ucyk7XG5cbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGRpc3BsYXlIYW5kbGVyczogdHJ1ZSB9LCBvcHRpb25zKTtcbiAgICBjb25zdCBjb2xvciA9IG9wdGlvbnMuY29sb3I7XG4gICAgaWYgKGNvbG9yKSB7XG4gICAgICBhY2Nlc3NvcnMuY29sb3IgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGNvbG9yOyB9O1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoTWFya2VyLCBhY2Nlc3NvcnMsIHtcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogb3B0aW9ucy5kaXNwbGF5SGFuZGxlcnMsXG4gICAgICBvcGFjaXR5OiBvcHRpb25zLm9wYWNpdHksXG4gICAgfSk7XG5cbiAgICB0aGlzLnNldEJlaGF2aW9yKG5ldyBNYXJrZXJCZWhhdmlvcigpKTtcbiAgfVxufVxuIiwiaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IFNlZ21lbnQgZnJvbSAnLi4vc2hhcGVzL3NlZ21lbnQnO1xuaW1wb3J0IFNlZ21lbnRCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvc2VnbWVudC1iZWhhdmlvcic7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgc2VnbWVudCBsYXllci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1zZWdtZW50Lmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlZ21lbnRMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGRhdGEgLSBUaGUgZGF0YSB0byByZW5kZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhY2Nlc3NvcnMgLSBUaGUgYWNjZXNzb3JzIHRvIGNvbmZpZ3VyZSB0aGUgbWFwcGluZ1xuICAgKiAgICBiZXR3ZWVuIHNoYXBlcyBhbmQgZGF0YS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSwgYWNjZXNzb3JzID0ge30pIHtcbiAgICBzdXBlcignY29sbGVjdGlvbicsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgZGlzcGxheUhhbmRsZXJzOiB0cnVlLFxuICAgICAgb3BhY2l0eTogMC42XG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKFNlZ21lbnQsIGFjY2Vzc29ycywge1xuICAgICAgZGlzcGxheUhhbmRsZXJzOiBvcHRpb25zLmRpc3BsYXlIYW5kbGVycyxcbiAgICAgIG9wYWNpdHk6IG9wdGlvbnMub3BhY2l0eSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0QmVoYXZpb3IobmV3IFNlZ21lbnRCZWhhdmlvcigpKTtcbiAgfVxufVxuIiwiaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IFRpY2tzIGZyb20gJy4uL3NoYXBlcy90aWNrcyc7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgdGljayBsYXllci4gQ2FuIGJlIHNlZW4gYXMgYSBncmlkIGF4aXMgd2l0aCB1c2VyIGRlZmluZWQgZGF0YVxuICogb3IgYXMgYSBtYXJrZXIgbGF5ZXIgd2l0aCBlbnRpdHkgYmFzZWQgZGF0YS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlja0xheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtBcnJheX0gZGF0YSAtIFRoZSBkYXRhIHRvIHJlbmRlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBBbiBvYmplY3QgdG8gY29uZmlndXJlIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtPYmplY3R9IGFjY2Vzc29ycyAtIFRoZSBhY2Nlc3NvcnMgdG8gY29uZmlndXJlIHRoZSBtYXBwaW5nXG4gICAqICAgIGJldHdlZW4gc2hhcGVzIGFuZCBkYXRhLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YSwgb3B0aW9ucywgYWNjZXNzb3JzKSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICBzdXBlcignZW50aXR5JywgZGF0YSwgb3B0aW9ucyk7XG5cbiAgICBjb25zdCBjb25maWcgPSBvcHRpb25zLmNvbG9yID8geyBjb2xvcjogb3B0aW9ucy5jb2xvciB9IDogdW5kZWZpbmVkO1xuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoVGlja3MsIGFjY2Vzc29ycywgY29uZmlnKTtcbiAgfVxufSIsImltcG9ydCBBeGlzTGF5ZXIgZnJvbSAnLi4vYXhpcy9heGlzLWxheWVyJztcbmltcG9ydCBUaWNrcyBmcm9tICcuLi9zaGFwZXMvdGlja3MnO1xuaW1wb3J0IHRpbWVBeGlzR2VuZXJhdG9yIGZyb20gJy4uL2F4aXMvdGltZS1heGlzLWdlbmVyYXRvcic7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgdGltZSBheGlzIGxheWVyXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYXhpcy5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lQXhpc0xheWVyIGV4dGVuZHMgQXhpc0xheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyBjb2xvcjogJ3N0ZWVsYmx1ZScgfSwgb3B0aW9ucyk7XG4gICAgc3VwZXIodGltZUF4aXNHZW5lcmF0b3IoKSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKFRpY2tzLCB7fSwge1xuICAgICAgY29sb3I6IG9wdGlvbnMuY29sb3JcbiAgICB9KTtcbiAgfVxufSIsImltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcbmltcG9ydCBUcmFjZVBhdGggZnJvbSAnLi4vc2hhcGVzL3RyYWNlLXBhdGgnO1xuaW1wb3J0IFRyYWNlRG90cyBmcm9tICcuLi9zaGFwZXMvdHJhY2UtZG90cyc7XG5pbXBvcnQgVHJhY2VCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvdHJhY2UtYmVoYXZpb3InO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIHRyYWNlIGxheWVyLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLXRyYWNlLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNlTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhIC0gVGhlIGRhdGEgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYWNjZXNzb3JzIC0gVGhlIGFjY2Vzc29ycyB0byBjb25maWd1cmUgdGhlIG1hcHBpbmdcbiAgICogICAgYmV0d2VlbiBzaGFwZXMgYW5kIGRhdGEuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30sIGFjY2Vzc29ycyA9IHt9KSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyBkaXNwbGF5RG90czogdHJ1ZSB9LCBvcHRpb25zKTtcbiAgICBzdXBlcihvcHRpb25zLmRpc3BsYXlEb3RzID8gJ2NvbGxlY3Rpb24nIDogJ2VudGl0eScsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgY29uc3Qgc2hhcGVPcHRpb25zID0ge307XG4gICAgaWYgKG9wdGlvbnMubWVhbkNvbG9yICE9PSB1bmRlZmluZWQpIHsgc2hhcGVPcHRpb25zLm1lYW5Db2xvciA9IG9wdGlvbnMubWVhbkNvbG9yOyB9XG4gICAgaWYgKG9wdGlvbnMucmFuZ2VDb2xvciAhPT0gdW5kZWZpbmVkKSB7IHNoYXBlT3B0aW9ucy5yYW5nZUNvbG9yID0gb3B0aW9ucy5yYW5nZUNvbG9yOyB9XG4gICAgaWYgKG9wdGlvbnMuZGlzcGxheU1lYW4gIT09IHVuZGVmaW5lZCkgeyBzaGFwZU9wdGlvbnMuZGlzcGxheU1lYW4gPSBvcHRpb25zLmRpc3BsYXlNZWFuOyB9XG5cbiAgICBpZiAob3B0aW9ucy5kaXNwbGF5RG90cykge1xuICAgICAgdGhpcy5jb25maWd1cmVDb21tb25TaGFwZShUcmFjZVBhdGgsIGFjY2Vzc29ycywgc2hhcGVPcHRpb25zKTtcbiAgICAgIHRoaXMuY29uZmlndXJlU2hhcGUoVHJhY2VEb3RzLCBhY2Nlc3NvcnMsIHNoYXBlT3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29uZmlndXJlU2hhcGUoVHJhY2VQYXRoLCBhY2Nlc3NvcnMsIHNoYXBlT3B0aW9ucyk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRCZWhhdmlvcihuZXcgVHJhY2VCZWhhdmlvcigpKTtcbiAgfVxufSIsImltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcbmltcG9ydCBXYXZlZm9ybSBmcm9tICcuLi9zaGFwZXMvd2F2ZWZvcm0nO1xuXG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICB5RG9tYWluOiBbLTEsIDFdLFxuICBjaGFubmVsOiAwLFxuICBjb2xvcjogJ3N0ZWVsYmx1ZScsXG4gIHJlbmRlcmluZ1N0cmF0ZWd5OiAnc3ZnJ1xufTtcblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgd2F2ZWZvcm0gbGF5ZXIuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItd2F2ZWZvcm0uaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2F2ZWZvcm1MYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXVkaW9CdWZmZXJ9IGJ1ZmZlciAtIFRoZSBhdWRpbyBidWZmZXIgdG8gZGlzcGxheS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBBbiBvYmplY3QgdG8gY29uZmlndXJlIHRoZSBsYXllci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGJ1ZmZlciwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICBzdXBlcignZW50aXR5JywgYnVmZmVyLmdldENoYW5uZWxEYXRhKG9wdGlvbnMuY2hhbm5lbCksIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShXYXZlZm9ybSwge30sIHtcbiAgICAgIHNhbXBsZVJhdGU6IGJ1ZmZlci5zYW1wbGVSYXRlLFxuICAgICAgY29sb3I6IG9wdGlvbnMuY29sb3IsXG4gICAgICByZW5kZXJpbmdTdHJhdGVneTogb3B0aW9ucy5yZW5kZXJpbmdTdHJhdGVneVxuICAgIH0pO1xuICB9XG59XG4iLCIvLyBjb3JlXG5pbXBvcnQgTGF5ZXJUaW1lQ29udGV4dCBmcm9tICcuL2NvcmUvbGF5ZXItdGltZS1jb250ZXh0JztcbmltcG9ydCBMYXllciBmcm9tICcuL2NvcmUvbGF5ZXInO1xuaW1wb3J0IG5hbWVzcGFjZSBmcm9tICcuL2NvcmUvbmFtZXNwYWNlJztcbmltcG9ydCBUaW1lbGluZVRpbWVDb250ZXh0IGZyb20gJy4vY29yZS90aW1lbGluZS10aW1lLWNvbnRleHQnO1xuaW1wb3J0IFRpbWVsaW5lIGZyb20gJy4vY29yZS90aW1lbGluZSc7XG5pbXBvcnQgVHJhY2tDb2xsZWN0aW9uIGZyb20gJy4vY29yZS90cmFjay1jb2xsZWN0aW9uJztcbmltcG9ydCBUcmFjayBmcm9tICcuL2NvcmUvdHJhY2snO1xuXG4vLyBzaGFwZXNcbmltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9zaGFwZXMvYmFzZS1zaGFwZSc7XG5pbXBvcnQgQ3Vyc29yIGZyb20gJy4vc2hhcGVzL2N1cnNvcic7XG5pbXBvcnQgRG90IGZyb20gJy4vc2hhcGVzL2RvdCc7XG5pbXBvcnQgTGluZSBmcm9tICcuL3NoYXBlcy9saW5lJztcbmltcG9ydCBNYXJrZXIgZnJvbSAnLi9zaGFwZXMvbWFya2VyJztcbmltcG9ydCBTZWdtZW50IGZyb20gJy4vc2hhcGVzL3NlZ21lbnQnO1xuaW1wb3J0IFRpY2tzIGZyb20gJy4vc2hhcGVzL3RpY2tzJztcbmltcG9ydCBUcmFjZVBhdGggZnJvbSAnLi9zaGFwZXMvdHJhY2UtcGF0aCc7XG5pbXBvcnQgVHJhY2VEb3RzIGZyb20gJy4vc2hhcGVzL3RyYWNlLWRvdHMnO1xuaW1wb3J0IFdhdmVmb3JtIGZyb20gJy4vc2hhcGVzL3dhdmVmb3JtJztcblxuLy8gYmVoYXZpb3JzXG5pbXBvcnQgQmFzZUJlaGF2aW9yIGZyb20gJy4vYmVoYXZpb3JzL2Jhc2UtYmVoYXZpb3InO1xuaW1wb3J0IEJyZWFrcG9pbnRCZWhhdmlvciBmcm9tICcuL2JlaGF2aW9ycy9icmVha3BvaW50LWJlaGF2aW9yJztcbmltcG9ydCBNYXJrZXJCZWhhdmlvciBmcm9tICcuL2JlaGF2aW9ycy9tYXJrZXItYmVoYXZpb3InO1xuaW1wb3J0IFNlZ21lbnRCZWhhdmlvciBmcm9tICcuL2JlaGF2aW9ycy9zZWdtZW50LWJlaGF2aW9yJztcbmltcG9ydCBUaW1lQ29udGV4dEJlaGF2aW9yIGZyb20gJy4vYmVoYXZpb3JzL3RpbWUtY29udGV4dC1iZWhhdmlvcic7XG5pbXBvcnQgVHJhY2VCZWhhdmlvciBmcm9tICcuL2JlaGF2aW9ycy90cmFjZS1iZWhhdmlvcic7XG5cbi8vIGludGVyYWN0aW9uc1xuaW1wb3J0IEV2ZW50U291cmNlIGZyb20gJy4vaW50ZXJhY3Rpb25zL2V2ZW50LXNvdXJjZSc7XG5pbXBvcnQgS2V5Ym9hcmQgZnJvbSAnLi9pbnRlcmFjdGlvbnMva2V5Ym9hcmQnO1xuaW1wb3J0IFN1cmZhY2UgZnJvbSAnLi9pbnRlcmFjdGlvbnMvc3VyZmFjZSc7XG5pbXBvcnQgV2F2ZUV2ZW50IGZyb20gJy4vaW50ZXJhY3Rpb25zL3dhdmUtZXZlbnQnO1xuXG4vLyBzdGF0ZXNcbmltcG9ydCBCYXNlU3RhdGUgZnJvbSAnLi9zdGF0ZXMvYmFzZS1zdGF0ZSc7XG5pbXBvcnQgQnJlYWtwb2ludFN0YXRlIGZyb20gJy4vc3RhdGVzL2JyZWFrcG9pbnQtc3RhdGUnO1xuaW1wb3J0IEJydXNoWm9vbVN0YXRlIGZyb20gJy4vc3RhdGVzL2JydXNoLXpvb20tc3RhdGUnO1xuaW1wb3J0IENlbnRlcmVkWm9vbVN0YXRlIGZyb20gJy4vc3RhdGVzL2NlbnRlcmVkLXpvb20tc3RhdGUnO1xuaW1wb3J0IENvbnRleHRFZGl0aW9uU3RhdGUgZnJvbSAnLi9zdGF0ZXMvY29udGV4dC1lZGl0aW9uLXN0YXRlJztcbmltcG9ydCBFZGl0aW9uU3RhdGUgZnJvbSAnLi9zdGF0ZXMvZWRpdGlvbi1zdGF0ZSc7XG5pbXBvcnQgU2VsZWN0aW9uU3RhdGUgZnJvbSAnLi9zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlJztcbmltcG9ydCBTaW1wbGVFZGl0aW9uU3RhdGUgZnJvbSAnLi9zdGF0ZXMvc2ltcGxlLWVkaXRpb24tc3RhdGUnO1xuXG4vLyBoZWxwZXJzXG5pbXBvcnQgQW5ub3RhdGVkTWFya2VyTGF5ZXIgZnJvbSAnLi9oZWxwZXJzL2Fubm90YXRlZC1tYXJrZXItbGF5ZXInO1xuaW1wb3J0IEFubm90YXRlZFNlZ21lbnRMYXllciBmcm9tICcuL2hlbHBlcnMvYW5ub3RhdGVkLXNlZ21lbnQtbGF5ZXInO1xuaW1wb3J0IEJyZWFrcG9pbnRMYXllciBmcm9tICcuL2hlbHBlcnMvYnJlYWtwb2ludC1sYXllcic7XG5pbXBvcnQgQ3Vyc29yTGF5ZXIgZnJvbSAnLi9oZWxwZXJzL2N1cnNvci1sYXllcic7XG5pbXBvcnQgR3JpZEF4aXNMYXllciBmcm9tICcuL2hlbHBlcnMvZ3JpZC1heGlzLWxheWVyJztcbmltcG9ydCBNYXJrZXJMYXllciBmcm9tICcuL2hlbHBlcnMvbWFya2VyLWxheWVyJztcbmltcG9ydCBTZWdtZW50TGF5ZXIgZnJvbSAnLi9oZWxwZXJzL3NlZ21lbnQtbGF5ZXInO1xuaW1wb3J0IFRpY2tMYXllciBmcm9tICcuL2hlbHBlcnMvdGljay1sYXllcic7XG5pbXBvcnQgVGltZUF4aXNMYXllciBmcm9tICcuL2hlbHBlcnMvdGltZS1heGlzLWxheWVyJztcbmltcG9ydCBUcmFjZUxheWVyIGZyb20gJy4vaGVscGVycy90cmFjZS1sYXllcic7XG5pbXBvcnQgV2F2ZWZvcm1MYXllciBmcm9tICcuL2hlbHBlcnMvd2F2ZWZvcm0tbGF5ZXInO1xuXG4vLyBheGlzXG5pbXBvcnQgQXhpc0xheWVyIGZyb20gJy4vYXhpcy9heGlzLWxheWVyJztcbmltcG9ydCB0aW1lQXhpc0dlbmVyYXRvciBmcm9tICcuL2F4aXMvdGltZS1heGlzLWdlbmVyYXRvcic7XG5pbXBvcnQgZ3JpZEF4aXNHZW5lcmF0b3IgZnJvbSAnLi9heGlzL2dyaWQtYXhpcy1nZW5lcmF0b3InO1xuXG4vLyB1dGlsc1xuaW1wb3J0IGZvcm1hdCBmcm9tICcuL3V0aWxzL2Zvcm1hdCc7XG5pbXBvcnQgT3J0aG9nb25hbERhdGEgZnJvbSAnLi91dGlscy9vcnRob2dvbmFsLWRhdGEnO1xuaW1wb3J0IHNjYWxlcyBmcm9tICcuL3V0aWxzL3NjYWxlcyc7XG5cbmV4cG9ydCBjb25zdCBjb3JlID0ge1xuICBMYXllclRpbWVDb250ZXh0LCBMYXllciwgbmFtZXNwYWNlLFxuICBUaW1lbGluZVRpbWVDb250ZXh0LCBUaW1lbGluZSwgVHJhY2tDb2xsZWN0aW9uLCBUcmFja1xufTtcblxuZXhwb3J0IGNvbnN0IHNoYXBlcyA9IHtcbiAgQmFzZVNoYXBlLCBDdXJzb3IsIERvdCwgTGluZSwgTWFya2VyLCBTZWdtZW50LFxuICBUaWNrcywgVHJhY2VQYXRoLCBUcmFjZURvdHMsIFdhdmVmb3JtXG59O1xuXG5leHBvcnQgY29uc3QgYmVoYXZpb3JzID0ge1xuICBCYXNlQmVoYXZpb3IsIEJyZWFrcG9pbnRCZWhhdmlvciwgTWFya2VyQmVoYXZpb3IsIFNlZ21lbnRCZWhhdmlvcixcbiAgVGltZUNvbnRleHRCZWhhdmlvciwgVHJhY2VCZWhhdmlvclxufTtcblxuZXhwb3J0IGNvbnN0IGludGVyYWN0aW9ucyA9IHsgRXZlbnRTb3VyY2UsIEtleWJvYXJkLCBTdXJmYWNlLCBXYXZlRXZlbnQgfTtcblxuZXhwb3J0IGNvbnN0IHN0YXRlcyA9IHtcbiAgQmFzZVN0YXRlLCBCcmVha3BvaW50U3RhdGUsIEJydXNoWm9vbVN0YXRlLCBDZW50ZXJlZFpvb21TdGF0ZSxcbiAgQ29udGV4dEVkaXRpb25TdGF0ZSwgRWRpdGlvblN0YXRlLCBTZWxlY3Rpb25TdGF0ZSwgU2ltcGxlRWRpdGlvblN0YXRlXG59O1xuXG5leHBvcnQgY29uc3QgaGVscGVycyA9IHtcbiAgQW5ub3RhdGVkTWFya2VyTGF5ZXIsIEFubm90YXRlZFNlZ21lbnRMYXllciwgQnJlYWtwb2ludExheWVyLFxuICBDdXJzb3JMYXllciwgR3JpZEF4aXNMYXllciwgTWFya2VyTGF5ZXIsIFNlZ21lbnRMYXllciwgVGlja0xheWVyLFxuICBUaW1lQXhpc0xheWVyLCBUcmFjZUxheWVyLCBXYXZlZm9ybUxheWVyXG59O1xuXG5leHBvcnQgY29uc3QgYXhpcyA9IHtcbiAgQXhpc0xheWVyLCB0aW1lQXhpc0dlbmVyYXRvciwgZ3JpZEF4aXNHZW5lcmF0b3Jcbn07XG5cbmV4cG9ydCBjb25zdCB1dGlscyA9IHtcbiAgZm9ybWF0LCBPcnRob2dvbmFsRGF0YSwgc2NhbGVzXG59O1xuIiwiaW1wb3J0IGV2ZW50cyBmcm9tICdldmVudHMnO1xuXG5cbi8qKlxuICogQWJzdHJhY3QgY2xhc3MgdG8gZXh0ZW5kIHRvIGNyZWF0ZSBuZXcgc291cmNlcyBvZiBpbnRlcmFjdGlvbnMuXG4gKiBBIGBTdXJmYWNlYCBhbmQgYEtleWJvYXJkYCBldmVudCBzb3VyY2VzIGFyZSBwcm92aWRlZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRTb3VyY2UgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoJGVsKSB7XG4gICAgc3VwZXIoKTtcbiAgICAvKipcbiAgICAgKiBUaGUgZWxlbWVudCBvbiB3aGljaCB0aGUgbGlzdGVuZXIgaXMgYWRkZWRcbiAgICAgKiBAdHlwZSB7RWxlbWVudH1cbiAgICAgKi9cbiAgICB0aGlzLiRlbCA9ICRlbDtcbiAgfVxuXG4gIGRlc3Ryb3koKcKge1xuICAgIHRoaXMudW5iaW5kRXZlbnRzKCk7XG4gIH1cblxuICBjcmVhdGVFdmVudCh0eXBlLCBlKSB7fVxuXG4gIGJpbmRFdmVudHMoKSB7fVxuXG4gIHVuYmluZEV2ZW50cygpIHt9XG59XG4iLCJpbXBvcnQgRXZlbnRTb3VyY2UgZnJvbSAnLi9ldmVudC1zb3VyY2UnO1xuaW1wb3J0IFdhdmVFdmVudCBmcm9tICcuL3dhdmUtZXZlbnQnO1xuXG5cbi8qKlxuICogQSBnbG9iYWwgZXZlbnQgc291cnZlIGZvciB0aGUga2V5Ym9hcmQuIE9ubHkgb25lIGluc3RhbmNlIG9mIHRoaXMgc291cmNlXG4gKiBjYW4gYmUgY3JlYXRlZC4gVGhlIGZpcnN0IGNyZWF0ZWQgdGltZWxpbmUgaW5zdGFuY2lhdGUgdGhlIHNpbmdsZXRvbiwgZWFjaFxuICogc3Vic2VxdWVudCBpbnN0YW5jaWF0aW9uIHJldHVybnMgdGhlIGZpcnN0IGNyZWF0ZWQgaW5zdGFuY2UuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEtleWJvYXJkIGV4dGVuZHMgRXZlbnRTb3VyY2Uge1xuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkZWwgLSBUaGUgZWxlbWVudCBvbiB3aGljaCB0byBpbnN0YWxsIHRoZSBsaXN0ZW5lci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCRlbCkge1xuICAgIHN1cGVyKCRlbCk7XG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIHNvdXJjZVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5zb3VyY2VOYW1lID0gJ2tleWJvYXJkJztcblxuICAgIHRoaXMuX29uS2V5RG93biA9IHRoaXMuX29uS2V5RG93bi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uS2V5VXAgPSB0aGlzLl9vbktleVVwLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgfVxuXG4gIGNyZWF0ZUV2ZW50KHR5cGUsIGUpIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBXYXZlRXZlbnQodGhpcy5zb3VyY2VOYW1lLCB0eXBlLCBlKTtcblxuICAgIGV2ZW50LnNoaWZ0S2V5ID0gZS5zaGlmdEtleTtcbiAgICBldmVudC5jdHJsS2V5ID0gZS5jdHJsS2V5O1xuICAgIGV2ZW50LmFsdEtleSA9IGUuYWx0S2V5O1xuICAgIGV2ZW50Lm1ldGFLZXkgPSBlLm1ldGFLZXk7XG4gICAgZXZlbnQud2hpY2ggPSBlLndoaWNoO1xuICAgIGV2ZW50LmNoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuXG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5fb25LZXlEb3duLCBmYWxzZSk7XG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLl9vbktleVVwLCBmYWxzZSk7XG4gIH1cblxuICB1bmJpbmRFdmVudHMoKSB7XG4gICAgdGhpcy4kZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuX29uS2V5RG93biwgZmFsc2UpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5fb25LZXlVcCwgZmFsc2UpO1xuICB9XG5cbiAgX29uS2V5RG93bihlKSB7XG4gICAgbGV0IGV2ZW50ID0gdGhpcy5jcmVhdGVFdmVudCgna2V5ZG93bicsIGUpO1xuICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gIH1cblxuICBfb25LZXlVcChlKSB7XG4gICAgbGV0IGV2ZW50ID0gdGhpcy5jcmVhdGVFdmVudCgna2V5dXAnLCBlKTtcbiAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICB9XG59XG4iLCJpbXBvcnQgRXZlbnRTb3VyY2UgZnJvbSAnLi9ldmVudC1zb3VyY2UnO1xuaW1wb3J0IFdhdmVFdmVudCBmcm9tICcuL3dhdmUtZXZlbnQnO1xuXG5cbi8qKlxuICogTm9ybWFsaXplcyBtb3VzZSB1c2VyIGludGVyYWN0aW9ucyB3aXRoIHRoZSB0aW1lbGluZSB1cG9uIHRoZSBET01cbiAqIGNvbnRhaW5lciBlbGVtZW50IG9mIGBUcmFja2AgaW5zdGFuY2VzLiBBcyBzb29uIGFzIGEgYHRyYWNrYCBpcyBhZGRlZCB0byBhXG4gKiBgdGltZWxpbmVgLCBpdHMgYXR0YWNoZWQgYFN1cmZhY2VgIGluc3RhbmNlIHdpbGwgZW1pdCB0aGUgbW91c2UgZXZlbnRzLlxuICovXG5jbGFzcyBTdXJmYWNlIGV4dGVuZHMgRXZlbnRTb3VyY2Uge1xuICAvKipcbiAgICogQHBhcmFtIHtET01FbGVtZW50fSBlbCAtIFRoZSBET00gZWxlbWVudCB0byBsaXN0ZW4uXG4gICAqIEB0b2RvIC0gQWRkIHNvbWUgcGFkZGluZyB0byB0aGUgc3VyZmFjZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCRlbCkge1xuICAgIHN1cGVyKCRlbCk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgc291cmNlLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5zb3VyY2VOYW1lID0gJ3N1cmZhY2UnO1xuICAgIHRoaXMuX21vdXNlRG93bkV2ZW50ID0gbnVsbDtcbiAgICB0aGlzLl9sYXN0RXZlbnQgPSBudWxsO1xuXG4gICAgdGhpcy5fb25Nb3VzZURvd24gPSB0aGlzLl9vbk1vdXNlRG93bi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uTW91c2VNb3ZlID0gdGhpcy5fb25Nb3VzZU1vdmUuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbk1vdXNlVXAgPSB0aGlzLl9vbk1vdXNlVXAuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkNsaWNrID0gdGhpcy5fb25DbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uRGJsQ2xpY2sgPSB0aGlzLl9vbkRibENsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25Nb3VzZU92ZXIgPSB0aGlzLl9vbk1vdXNlT3Zlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uTW91c2VPdXQgPSB0aGlzLl9vbk1vdXNlT3V0LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGYWN0b3J5IG1ldGhvZCBmb3IgYEV2ZW50YCBjbGFzc1xuICAgKi9cbiAgY3JlYXRlRXZlbnQodHlwZSwgZSkge1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IFdhdmVFdmVudCh0aGlzLnNvdXJjZU5hbWUsIHR5cGUsIGUpO1xuXG4gICAgY29uc3QgcG9zID0gdGhpcy5fZ2V0UmVsYXRpdmVQb3NpdGlvbihlKTtcbiAgICBldmVudC54ID0gcG9zLng7XG4gICAgZXZlbnQueSA9IHBvcy55O1xuXG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEtlZXAgdGhpcyBwcml2YXRlIHRvIGF2b2lkIGRvdWJsZSBldmVudCBiaW5kaW5nLiBNYWluIGxvZ2ljIG9mIHRoZSBzdXJmYWNlXG4gICAqIGlzIGhlcmUuIFNob3VsZCBiZSBleHRlbmRlZCB3aXRoIG5lZWRlZCBldmVudHMgKG1vdXNlZW50ZXIsIG1vdXNlbGVhdmUsXG4gICAqIHdoZWVsIC4uLikuXG4gICAqXG4gICAqIEB0b2RvIC0gdGhyb3R0bGVcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgLy8gQmluZCBjYWxsYmFja3NcbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9vbk1vdXNlRG93biwgZmFsc2UpO1xuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25DbGljaywgZmFsc2UpO1xuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgdGhpcy5fb25EYmxDbGljaywgZmFsc2UpO1xuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIHRoaXMuX29uTW91c2VPdmVyLCBmYWxzZSk7XG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB0aGlzLl9vbk1vdXNlT3V0LCBmYWxzZSk7XG4gIH1cblxuICB1bmJpbmRFdmVudHMoKSB7XG4gICAgLy8gQmluZCBjYWxsYmFja3NcbiAgICB0aGlzLiRlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9vbk1vdXNlRG93biwgZmFsc2UpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25DbGljaywgZmFsc2UpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgdGhpcy5fb25EYmxDbGljaywgZmFsc2UpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIHRoaXMuX29uTW91c2VPdmVyLCBmYWxzZSk7XG4gICAgdGhpcy4kZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB0aGlzLl9vbk1vdXNlT3V0LCBmYWxzZSk7XG5cbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fb25Nb3VzZU1vdmUpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fb25Nb3VzZVVwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB4LCB5IGNvb3JkaW5hdGVzIGNvb3JkaW5hdGVzIHJlbGF0aXZlIHRvIHRoZSBzdXJmYWNlIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGUgLSBSYXcgZXZlbnQgZnJvbSBsaXN0ZW5lci5cbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKiBAdG9kbyAtIGhhbmRsZSBwYWRkaW5nLlxuICAgKi9cbiAgX2dldFJlbGF0aXZlUG9zaXRpb24oZSkge1xuICAgIC8vIEBUT0RPOiBzaG91bGQgYmUgYWJsZSB0byBpZ25vcmUgcGFkZGluZ1xuICAgIGxldCB4ID0gMDtcbiAgICBsZXQgeSA9IDA7XG4gICAgY29uc3QgY2xpZW50UmVjdCA9IHRoaXMuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHNjcm9sbExlZnQgPSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdDtcbiAgICBjb25zdCBzY3JvbGxUb3AgID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuXG4gICAgLy8gQWRhcHRlZCBmcm9tIGh0dHA6Ly93d3cucXVpcmtzbW9kZS5vcmcvanMvZXZlbnRzX3Byb3BlcnRpZXMuaHRtbCNwb3NpdGlvblxuICAgIGlmIChlLnBhZ2VYIHx8IGUucGFnZVkpIHtcbiAgICAgIHggPSBlLnBhZ2VYO1xuICAgICAgeSA9IGUucGFnZVk7XG4gICAgfSBlbHNlIGlmIChlLmNsaWVudFggfHwgZS5jbGllbnRZKSB7XG4gICAgICAvLyBOb3JtYWxpemUgdG8gcGFnZVgsIHBhZ2VZXG4gICAgICB4ID0gZS5jbGllbnRYICsgc2Nyb2xsTGVmdDtcbiAgICAgIHkgPSBlLmNsaWVudFkgKyBzY3JvbGxUb3A7XG4gICAgfVxuXG4gICAgLy8gY2xpZW50UmVjdCByZWZlcnMgdG8gdGhlIGNsaWVudCwgbm90IHRvIHRoZSBwYWdlXG4gICAgeCA9IHggLSAoY2xpZW50UmVjdC5sZWZ0ICsgc2Nyb2xsTGVmdCk7XG4gICAgeSA9IHkgLSAoY2xpZW50UmVjdC50b3AgICsgc2Nyb2xsVG9wICk7XG5cbiAgICByZXR1cm4geyB4LCB5IH07XG4gIH1cblxuICBfZGVmaW5lQXJlYShlLCBtb3VzZURvd25FdmVudCwgbGFzdEV2ZW50KSB7XG4gICAgaWYgKCFtb3VzZURvd25FdmVudCB8fMKgIWxhc3RFdmVudCkgeyByZXR1cm47IH1cbiAgICBlLmR4ID0gZS54IC0gbGFzdEV2ZW50Lng7XG4gICAgZS5keSA9IGUueSAtIGxhc3RFdmVudC55O1xuXG4gICAgY29uc3QgbGVmdCA9IG1vdXNlRG93bkV2ZW50LnggPCBlLnggPyBtb3VzZURvd25FdmVudC54IDogZS54O1xuICAgIGNvbnN0IHRvcCAgPSBtb3VzZURvd25FdmVudC55IDwgZS55ID8gbW91c2VEb3duRXZlbnQueSA6IGUueTtcbiAgICBjb25zdCB3aWR0aCAgPSBNYXRoLmFicyhNYXRoLnJvdW5kKGUueCAtIG1vdXNlRG93bkV2ZW50LngpKTtcbiAgICBjb25zdCBoZWlnaHQgPSBNYXRoLmFicyhNYXRoLnJvdW5kKGUueSAtIG1vdXNlRG93bkV2ZW50LnkpKTtcblxuICAgIGUuYXJlYSA9IHsgbGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0IH07XG4gIH1cblxuICBfb25Nb3VzZURvd24oZSkge1xuICAgIC8vIGJ5IHJlbW92aW5nIHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gd2UgcHJldmVudCBieXBhc3NpbmcgdGhlIG1vdXNlbW92ZSBldmVudHMgY29taW5nIGZyb20gU1ZHIGluIEZpcmVmb3guXG4gICAgd2luZG93LmdldFNlbGVjdGlvbigpLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5jcmVhdGVFdmVudCgnbW91c2Vkb3duJywgZSk7XG5cblxuICAgIHRoaXMuX21vdXNlRG93bkV2ZW50ID0gZXZlbnQ7XG4gICAgdGhpcy5fbGFzdEV2ZW50ID0gZXZlbnQ7XG4gICAgLy8gUmVnaXN0ZXIgbW91c2Vtb3ZlIGFuZCBtb3VzZXVwIGxpc3RlbmVycyBvbiB3aW5kb3dcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fb25Nb3VzZU1vdmUsIGZhbHNlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX29uTW91c2VVcCwgZmFsc2UpO1xuXG4gICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgfVxuXG4gIF9vbk1vdXNlTW92ZShlKSB7XG4gICAgbGV0IGV2ZW50ID0gdGhpcy5jcmVhdGVFdmVudCgnbW91c2Vtb3ZlJywgZSk7XG4gICAgdGhpcy5fZGVmaW5lQXJlYShldmVudCwgdGhpcy5fbW91c2VEb3duRXZlbnQsIHRoaXMuX2xhc3RFdmVudCk7XG4gICAgLy8gVXBkYXRlIGBsYXN0RXZlbnRgIGZvciBuZXh0IGNhbGxcbiAgICB0aGlzLl9sYXN0RXZlbnQgPSBldmVudDtcblxuICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gIH1cblxuICBfb25Nb3VzZVVwKGUpIHtcbiAgICBsZXQgZXZlbnQgPSB0aGlzLmNyZWF0ZUV2ZW50KCdtb3VzZXVwJywgZSk7XG4gICAgdGhpcy5fZGVmaW5lQXJlYShldmVudCwgdGhpcy5fbW91c2VEb3duRXZlbnQsIHRoaXMuX2xhc3RFdmVudCk7XG5cblxuICAgIHRoaXMuX21vdXNlRG93bkV2ZW50ID0gbnVsbDtcbiAgICB0aGlzLl9sYXN0RXZlbnQgPSBudWxsO1xuICAgIC8vIFJlbW92ZSBtb3VzZW1vdmUgYW5kIG1vdXNldXAgbGlzdGVuZXJzIG9uIHdpbmRvd1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9vbk1vdXNlTW92ZSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9vbk1vdXNlVXApO1xuXG4gICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgfVxuXG4gIF9vbkNsaWNrKGUpIHtcbiAgICBsZXQgZXZlbnQgPSB0aGlzLmNyZWF0ZUV2ZW50KCdjbGljaycsIGUpO1xuICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gIH1cblxuICBfb25EYmxDbGljayhlKSB7XG4gICAgbGV0IGV2ZW50ID0gdGhpcy5jcmVhdGVFdmVudCgnZGJsY2xpY2snLCBlKTtcbiAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICB9XG5cbiAgX29uTW91c2VPdmVyKGUpIHtcbiAgICBsZXQgZXZlbnQgPSB0aGlzLmNyZWF0ZUV2ZW50KCdtb3VzZW92ZXInLCBlKTtcbiAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICB9XG5cbiAgX29uTW91c2VPdXQoZSkge1xuICAgIGxldCBldmVudCA9IHRoaXMuY3JlYXRlRXZlbnQoJ21vdXNlb3V0JywgZSk7XG4gICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTdXJmYWNlO1xuIiwiLyoqXG4gKiBPYmplY3QgdGVtcGxhdGUgZm9yIGFsbCBldmVudHMuIEV2ZW50IHNvdXJjZXMgc2hvdWxkIHVzZSB0aGlzIGV2ZW50IHRlbXBsYXRlXG4gKiBpbiBvcmRlciB0byBrZWVwIGNvbnNpc3RlbmN5IHdpdGggZXhpc3Rpbmcgc291cmNlcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2F2ZUV2ZW50IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzb3VyY2UgLSBUaGUgbmFtZSBvZiB0aGUgc291cmNlIChga2V5Ym9hcmRgLCBgc3VyZmFjZWAsIC4uLikuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gVGhlIHR5cGUgb2YgdGhlIHNvdXJjZSAoYG1vdXNlZG93bmAsIGBrZXl1cGAsIC4uLikuXG4gICAqIEBwYXJhbSB7RXZlbnR9IG9yaWdpbmFsRXZlbnQgLSBUaGUgb3JpZ2luYWwgZXZlbnQgYXMgZW1pdHRlZCBieSB0aGUgYnJvd3Nlci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHNvdXJjZSwgdHlwZSwgb3JpZ2luYWxFdmVudCkge1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5vcmlnaW5hbEV2ZW50ID0gb3JpZ2luYWxFdmVudDtcblxuICAgIHRoaXMudGFyZ2V0ID0gb3JpZ2luYWxFdmVudC50YXJnZXQ7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gb3JpZ2luYWxFdmVudC5jdXJyZW50VGFyZ2V0O1xuICB9XG59XG4iLCJpbXBvcnQgTWFya2VyIGZyb20gJy4vbWFya2VyJztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIG1hcmtlciB3aXRoIGFubm90YXRpb24uXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItbWFya2VyLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFubm90YXRlZE1hcmtlciBleHRlbmRzIE1hcmtlciB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdhbm5vdGF0ZWQtbWFya2VyJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgbGV0IGxpc3QgPSBzdXBlci5fZ2V0QWNjZXNzb3JMaXN0KCk7XG4gICAgbGlzdC50ZXh0ID0gJ2RlZmF1bHQnO1xuICAgIHJldHVybiBsaXN0O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICB0aGlzLiRlbCA9IHN1cGVyLnJlbmRlcihyZW5kZXJpbmdDb250ZXh0KTtcbiAgICBjb25zdCBoZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcblxuICAgIHRoaXMuJGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICd0ZXh0Jyk7XG4gICAgdGhpcy4kbGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCA4KTtcbiAgICB0aGlzLiRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIDgpO1xuICAgIHRoaXMuJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgbWF0cml4KDEsIDAsIDAsIC0xLCAwLCAke2hlaWdodH0pYCk7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUuZm9udFNpemUgPSAnMTBweCc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUuZm9udEZhbWlseSA9ICdtb25vc3BhY2UnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLmNvbG9yID0gJyMyNDI0MjQnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLm1velVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJztcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbGFiZWwpO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgc3VwZXIudXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKTtcblxuICAgIGlmICh0aGlzLiRsYWJlbC5maXJzdENoaWxkKSB7XG4gICAgICB0aGlzLiRsYWJlbC5yZW1vdmVDaGlsZCh0aGlzLiRsYWJlbC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBjb25zdCAkdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMudGV4dChkYXR1bSkpO1xuICAgIHRoaXMuJGxhYmVsLmFwcGVuZENoaWxkKCR0ZXh0KTtcbiAgfVxufVxuIiwiaW1wb3J0IFNlZ21lbnQgZnJvbSAnLi9zZWdtZW50JztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIHNlZ21lbnQgd2l0aCBhbm5vdGF0aW9uLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLXNlZ21lbnQuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5ub3RhdGVkU2VnbWVudCBleHRlbmRzIFNlZ21lbnQge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnYW5ub3RhdGVkLXNlZ21lbnQnOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICBsZXQgbGlzdCA9IHN1cGVyLl9nZXRBY2Nlc3Nvckxpc3QoKTtcbiAgICBsaXN0LnRleHQgPSAnZGVmYXVsdCc7XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIHRoaXMuJGVsID0gc3VwZXIucmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpO1xuICAgIGNvbnN0IGhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuXG4gICAgdGhpcy4kbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3RleHQnKTtcbiAgICB0aGlzLiRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIDMpO1xuICAgIHRoaXMuJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgMTEpO1xuICAgIHRoaXMuJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgbWF0cml4KDEsIDAsIDAsIC0xLCAwLCAke2hlaWdodH0pYCk7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUuZm9udFNpemUgPSAnMTBweCc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUuZm9udEZhbWlseSA9ICdtb25vc3BhY2UnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLmNvbG9yID0gJyMyNDI0MjQnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLm1velVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJztcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbGFiZWwpO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgc3VwZXIudXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKTtcblxuICAgIGlmICh0aGlzLiRsYWJlbC5maXJzdENoaWxkKSB7XG4gICAgICB0aGlzLiRsYWJlbC5yZW1vdmVDaGlsZCh0aGlzLiRsYWJlbC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBjb25zdCAkdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMudGV4dChkYXR1bSkpO1xuICAgIHRoaXMuJGxhYmVsLmFwcGVuZENoaWxkKCR0ZXh0KTtcbiAgfVxufVxuIiwiaW1wb3J0IG5zIGZyb20gJy4uL2NvcmUvbmFtZXNwYWNlJztcblxuXG4vKipcbiAqIElzIGFuIGFic3RyYWN0IGNsYXNzIG9yIGludGVyZmFjZSB0byBiZSBvdmVycmlkZW4gaW4gb3JkZXIgdG8gZGVmaW5lIG5ld1xuICogc2hhcGVzLiBTaGFwZXMgZGVmaW5lIHRoZSB3YXkgYSBnaXZlbiBkYXR1bSBzaG91bGQgYmUgcmVuZGVyZWQsIHRoZXkgYXJlXG4gKiB0aGUgc21hbGxlc3QgdW5pdCBvZiByZW5kZXJpbmcgaW50byBhIHRpbWVsaW5lLlxuICpcbiAqIEFsbCB0aGUgbGlmZSBjeWNsZSBvZiBgU2hhcGVgIGluc3RhbmNlcyBpcyBoYW5kbGVkIGludG8gdGhlIGBMYXllcmAgaW5zdGFuY2VcbiAqIHRoZXkgYXJlIGF0dGFjaCB0by4gQXMgYSBjb25zZXF1ZW5jZSwgdGhleSBzaG91bGQgYmUgbWFpbmx5IGNvbnNpZGVyZWQgYXNcbiAqIHByaXZhdGUgb2JqZWN0cy4gVGhlIG9ubHkgcGxhY2UgdGhleSBzaG91bGQgYmUgaW50ZXJhY3RlZCB3aXRoIGlzIGluIGBCZWhhdmlvcmBcbiAqIGRlZmluaXRpb25zLCB0byB0ZXN0IHdoaWNoIGVsZW1lbnQgb2YgdGhlIHNoYXBlIGlzIHRoZSB0YXJnZXQgb2YgdGhlXG4gKiBpbnRlcmFjdGlvbiBhbmQgZGVmaW5lIHRoZSBpbnRlcmFjdGlvbiBhY2NvcmRpbmcgdG8gdGhhdCB0ZXN0LlxuICpcbiAqIERlcGVuZGluZyBvZiBpdHMgaW1wbGVtZW50YXRpb24gYSBgU2hhcGVgIGNhbiBiZSB1c2VkIGFsb25nIHdpdGggYGVudGl0eWAgb3JcbiAqIGBjb2xsZWN0aW9uYCBkYXRhIHR5cGUuIFNvbWUgc2hhcGVzIGFyZSB0aGVuIGNyZWF0ZWQgdG8gdXNlIGRhdGEgY29uc2lkZXJlZFxuICogYXMgYSBzaW5nbGUgZW50aXR5IChXYXZlZm9ybSwgVHJhY2VQYXRoLCBMaW5lKSwgd2hpbGUgb3RoZXJzIGFyZSBkZWZpbmVkIHRvXG4gKiBiZSB1c2VkIHdpdGggZGF0YSBzZWVuIGFzIGEgY29sbGVjdGlvbiwgZWFjaCBzaGFwZSByZW5kZXJpbmcgYSBzaW5nbGUgZW50cnlcbiAqIG9mIHRoZSBjb2xsZWN0aW9uLiBUaGUgc2hhcGVzIHdvcmtpbmcgd2l0aCBlbnRpdHkgdHlwZSBkYXRhIHNob3VsZCB0aGVyZWZvcmVcbiAqIGJlIHVzZWQgaW4gYW4gYGVudGl0eWAgY29uZmlndXJlZCBgTGF5ZXJgLiBOb3RlIHRoYXQgaWYgdGhleSBhcmUgcmVnaXN0ZXJlZFxuICogYXMgXCJjb21tb25TaGFwZVwiIGluIGEgYGNvbGxlY3Rpb25gIHR5cGUgYExheWVyYCwgdGhleSB3aWxsIGJlaGF2ZSB0aGUgZXhhY3RcbiAqIHNhbWUgd2F5LiBUaGVzZSBraW5kIG9mIHNoYXBlcyBhcmUgbm90ZWQ6IFwiZW50aXR5IHNoYXBlXCIuXG4gKlxuICogIyMjIEF2YWlsYWJsZSBgY29sbGVjdGlvbmAgc2hhcGVzOlxuICogLSBNYXJrZXIgLyBBbm5vdGF0ZWQgTWFya2VyXG4gKiAtIFNlZ21lbnQgLyBBbm5vdGF0ZWQgU2VnbWVudFxuICogLSBEb3RcbiAqIC0gVHJhY2VEb3RzXG4gKlxuICogIyMjIEF2YWlsYWJsZSBgZW50aXR5YCBzaGFwZXM6XG4gKiAtIExpbmVcbiAqIC0gVGljayAoZm9yIGF4aXMpXG4gKiAtIFdhdmVmb3JtXG4gKiAtIFRyYWNlUGF0aFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlU2hhcGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBvdmVycmlkZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIC8qKiBAdHlwZSB7RWxlbWVudH0gLSBTdmcgZWxlbWVudCB0byBiZSByZXR1cm5lZCBieSB0aGUgYHJlbmRlcmAgbWV0aG9kLiAqL1xuICAgIHRoaXMuJGVsID0gbnVsbDtcbiAgICAvKiogQHR5cGUge1N0cmluZ30gLSBTdmcgbmFtZXNwYWNlLiAqL1xuICAgIHRoaXMubnMgPSBucztcbiAgICAvKiogQHR5cGUge09iamVjdH0gLSBPYmplY3QgY29udGFpbmluZyB0aGUgZ2xvYmFsIHBhcmFtZXRlcnMgb2YgdGhlIHNoYXBlICovXG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9nZXREZWZhdWx0cygpLCBvcHRpb25zKTtcbiAgICAvLyBjcmVhdGUgYWNjZXNzb3JzIG1ldGhvZHMgYW5kIHNldCBkZWZhdWx0IGFjY2Vzc29yIGZ1bmN0aW9uc1xuICAgIGNvbnN0IGFjY2Vzc29ycyA9IHRoaXMuX2dldEFjY2Vzc29yTGlzdCgpO1xuICAgIHRoaXMuX2NyZWF0ZUFjY2Vzc29ycyhhY2Nlc3NvcnMpO1xuICAgIHRoaXMuX3NldERlZmF1bHRBY2Nlc3NvcnMoYWNjZXNzb3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBzaGFwZSBhbmQgY2xlYW4gcmVmZXJlbmNlcy4gSW50ZXJmYWNlIG1ldGhvZCBjYWxsZWQgZnJvbSB0aGUgYGxheWVyYC5cbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgLy8gdGhpcy5ncm91cCA9IG51bGw7XG4gICAgdGhpcy4kZWwgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gb3ZlcnJpZGUgd2hlbiBleHRlbmRpbmcgdGhpcyBiYXNlIGNsYXNzLiBUaGUgbWV0aG9kXG4gICAqIGlzIGNhbGxlZCBieSB0aGUgYExheWVyfnJlbmRlcmAgbWV0aG9kLiBSZXR1cm5zIHRoZSBuYW1lIG9mIHRoZSBzaGFwZSxcbiAgICogdXNlZCBhcyBhIGNsYXNzIGluIHRoZSBlbGVtZW50IGdyb3VwIChkZWZhdWx0cyB0byBgJ3NoYXBlJ2ApLlxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnc2hhcGUnOyB9XG5cbiAgLyoqXG4gICAqIEB0b2RvIG5vdCBpbXBsZW1lbnRlZFxuICAgKiBhbGxvdyB0byBpbnN0YWxsIGRlZnMgaW4gdGhlIHRyYWNrIHN2ZyBlbGVtZW50LiBTaG91bGQgYmUgY2FsbGVkIHdoZW5cbiAgICogYWRkaW5nIHRoZSBgTGF5ZXJgIHRvIHRoZSBgVHJhY2tgLlxuICAgKi9cbiAgLy8gc2V0U3ZnRGVmaW5pdGlvbihkZWZzKSB7fVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkZWZhdWx0cyBmb3IgZ2xvYmFsIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHNoYXBlLlxuICAgKiBAcHJvdGVjdGVkXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBvYmplY3Qgd2hlcmUga2V5cyBhcmUgdGhlIGFjY2Vzc29ycyBtZXRob2RzIG5hbWVzIHRvIGNyZWF0ZVxuICAgKiBhbmQgdmFsdWVzIGFyZSB0aGUgZGVmYXVsdCB2YWx1ZXMgZm9yIGVhY2ggZ2l2ZW4gYWNjZXNzb3IuXG4gICAqXG4gICAqIEBwcm90ZWN0ZWRcbiAgICogQHRvZG8gcmVuYW1lID9cbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHsgcmV0dXJuIHt9OyB9XG5cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCBjYWxsZWQgYnkgTGF5ZXIgd2hlbiBjcmVhdGluZyBhIHNoYXBlLiBJbnN0YWxsIHRoZVxuICAgKiBnaXZlbiBhY2Nlc3NvcnMgb24gdGhlIHNoYXBlLCBvdmVycmlkaW5nIHRoZSBkZWZhdWx0IGFjY2Vzc29ycy5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3Q8U3RyaW5nLCBmdW5jdGlvbj59IGFjY2Vzc29yc1xuICAgKi9cbiAgaW5zdGFsbChhY2Nlc3NvcnMpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gYWNjZXNzb3JzKSB7IHRoaXNba2V5XSA9IGFjY2Vzc29yc1trZXldOyB9XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJpYyBtZXRob2QgdG8gY3JlYXRlIGFjY2Vzc29ycy4gQWRkcyBnZXR0ZXJzIGVuIHNldHRlcnMgdG8gdGhlXG4gICAqIHByb3RvdHlwZSBpZiBub3QgYWxyZWFkeSBwcmVzZW50LlxuICAgKi9cbiAgX2NyZWF0ZUFjY2Vzc29ycyhhY2Nlc3NvcnMpIHtcbiAgICB0aGlzLl9hY2Nlc3NvcnMgPSB7fTtcbiAgICAvLyBhZGQgaXQgdG8gdGhlIHByb3RvdHlwZVxuICAgIGNvbnN0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpO1xuICAgIC8vIGNyZWF0ZSBhIGdldHRlciAvIHNldHRlciBmb3IgZWFjaCBhY2Nlc3NvcnNcbiAgICAvLyBzZXR0ZXIgOiBgdGhpcy54ID0gY2FsbGJhY2tgXG4gICAgLy8gZ2V0dGVyIDogYHRoaXMueChkYXR1bSlgXG4gICAgT2JqZWN0LmtleXMoYWNjZXNzb3JzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBpZiAocHJvdG8uaGFzT3duUHJvcGVydHkobmFtZSkpIHsgcmV0dXJuOyB9XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90bywgbmFtZSwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fYWNjZXNzb3JzW25hbWVdOyB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgICAgICB0aGlzLl9hY2Nlc3NvcnNbbmFtZV0gPSBmdW5jO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBmdW5jdGlvbiB0byBiZSB1c2VkIGFzIGEgZGVmYXVsdCBhY2Nlc3NvciBmb3IgZWFjaCBhY2Nlc29yc1xuICAgKi9cbiAgX3NldERlZmF1bHRBY2Nlc3NvcnMoYWNjZXNzb3JzKSB7XG4gICAgT2JqZWN0LmtleXMoYWNjZXNzb3JzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBjb25zdCBkZWZhdWx0VmFsdWUgPSBhY2Nlc3NvcnNbbmFtZV07XG4gICAgICBsZXQgYWNjZXNzb3IgPSBmdW5jdGlvbihkLCB2ID0gbnVsbCkge1xuICAgICAgICBpZiAodiA9PT0gbnVsbCkgeyByZXR1cm4gZFtuYW1lXSB8fCBkZWZhdWx0VmFsdWU7IH1cbiAgICAgICAgZFtuYW1lXSA9IHY7XG4gICAgICB9O1xuICAgICAgLy8gc2V0IGFjY2Vzc29yIGFzIHRoZSBkZWZhdWx0IG9uZVxuICAgICAgdGhpc1tuYW1lXSA9IGFjY2Vzc29yO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgY2FsbGVkIGJ5IGBMYXllcn5yZW5kZXJgLiBDcmVhdGVzIHRoZSBET00gc3RydWN0dXJlIG9mXG4gICAqIHRoZSBzaGFwZS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlbmRlcmluZ0NvbnRleHQgLSB0aGUgcmVuZGVyaW5nQ29udGV4dCBvZiB0aGUgbGF5ZXJcbiAgICogICAgd2hpY2ggb3ducyB0aGlzIHNoYXBlLlxuICAgKiBAcmV0dXJuIHtFbGVtZW50fSAtIHRoZSBET00gZWxlbWVudCB0byBpbnNlcnQgaW4gdGhlIGl0ZW0ncyBncm91cC5cbiAgICovXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7fVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIGNhbGxlZCBieSBgTGF5ZXJ+dXBkYXRlYC4gVXBkYXRlcyB0aGUgRE9NIHN0cnVjdHVyZSBvZiB0aGUgc2hhcGUuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZW5kZXJpbmdDb250ZXh0IC0gVGhlIGByZW5kZXJpbmdDb250ZXh0YCBvZiB0aGUgbGF5ZXJcbiAgICogICAgd2hpY2ggb3ducyB0aGlzIHNoYXBlLlxuICAgKiBAcGFyYW0ge09iamVjdHxBcnJheX0gZGF0dW0gLSBUaGUgZGF0dW0gYXNzb2NpYXRlZCB0byB0aGUgc2hhcGUuXG4gICAqL1xuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0pIHt9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gb3ZlcnJpZGUgY2FsbGVkIGJ5IGBMYXllcn5nZXRJdGVtc0luQXJlYWAuIERlZmluZXMgaWZcbiAgICogdGhlIHNoYXBlIGlzIGNvbnNpZGVyZWQgdG8gYmUgdGhlIGdpdmVuIGFyZWEuIEFyZ3VtZW50cyBhcmUgcGFzc2VkIGluIHBpeGVsIGRvbWFpbi5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlbmRlcmluZ0NvbnRleHQgLSB0aGUgcmVuZGVyaW5nQ29udGV4dCBvZiB0aGUgbGF5ZXIgd2hpY2hcbiAgICogICAgb3ducyB0aGlzIHNoYXBlLlxuICAgKiBAcGFyYW0ge09iamVjdHxBcnJheX0gZGF0dW0gLSBUaGUgZGF0dW0gYXNzb2NpYXRlZCB0byB0aGUgc2hhcGUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4MSAtIFRoZSB4IGNvbXBvbmVudCBvZiB0aGUgdG9wLWxlZnQgY29ybmVyIG9mIHRoZSBhcmVhIHRvIHRlc3QuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5MSAtIFRoZSB5IGNvbXBvbmVudCBvZiB0aGUgdG9wLWxlZnQgY29ybmVyIG9mIHRoZSBhcmVhIHRvIHRlc3QuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4MiAtIFRoZSB4IGNvbXBvbmVudCBvZiB0aGUgYm90dG9tLXJpZ2h0IGNvcm5lciBvZiB0aGUgYXJlYSB0byB0ZXN0LlxuICAgKiBAcGFyYW0ge051bWJlcn0geTIgLSBUaGUgeSBjb21wb25lbnQgb2YgdGhlIGJvdHRvbS1yaWdodCBjb3JuZXIgb2YgdGhlIGFyZWEgdG8gdGVzdC5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gLSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgaXMgY29uc2lkZXJlZCB0byBiZSBpbiB0aGUgZ2l2ZW4gYXJlYSwgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAqL1xuICBpbkFyZWEocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKSB7fVxufVxuIiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuaW1wb3J0IG5zIGZyb20gJy4uL2NvcmUvbmFtZXNwYWNlJztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIGN1cnNvci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1jdXJzb3IuaHRtbClcbiAqL1xuY2xhc3MgQ3Vyc29yIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ2N1cnNvcic7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IHg6IDAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29sb3I6ICcjMDAwMDAwJyxcbiAgICAgIG9wYWNpdHk6IDFcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2xpbmUnKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIDApO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5MScsIDApO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgIHRoaXMuJGVsLnN0eWxlLnN0cm9rZSA9IHRoaXMucGFyYW1zLmNvbG9yO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgY29uc3QgZmxvYXRYID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLngoZGF0dW0pKTtcbiAgICBjb25zdCB4ID0gTWF0aC5yb3VuZChmbG9hdFgpO1xuXG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHt4fSwgMClgKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneTInLCByZW5kZXJpbmdDb250ZXh0LmhlaWdodCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGN1cnNvciBjYW5ub3QgYmUgc2VsZWN0ZWQuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IGZhbHNlXG4gICAqL1xuICBpbkFyZWEoKSB7IHJldHVybiBmYWxzZTsgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDdXJzb3I7XG4iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgYSBkb3QuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYnJlYWtwb2ludC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3QgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnZG90JzsgfVxuXG4gIC8vIEBUT0RPIHJlbmFtZSA6IGNvbmZ1c2lvbiBiZXR3ZWVuIGFjY2Vzc29ycyBhbmQgbWV0YS1hY2Nlc3NvcnNcbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyBjeDogMCwgY3k6IDAsIHI6IDMsIGNvbG9yOiAnIzAwMDAwMCfCoH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2NpcmNsZScpO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgY29uc3QgY3ggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMuY3goZGF0dW0pKTtcbiAgICBjb25zdCBjeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMuY3koZGF0dW0pKTtcbiAgICBjb25zdCByICA9IHRoaXMucihkYXR1bSk7XG4gICAgY29uc3QgY29sb3IgPSB0aGlzLmNvbG9yKGRhdHVtKTtcblxuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7Y3h9LCAke2N5fSlgKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncicsIHIpO1xuICAgIHRoaXMuJGVsLnN0eWxlLmZpbGwgPSBjb2xvcjtcbiAgfVxuXG4gIC8vIHgxLCB4MiwgeTEsIHkyID0+IGluIHBpeGVsIGRvbWFpblxuICBpbkFyZWEocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgY29uc3QgY3ggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMuY3goZGF0dW0pKTtcbiAgICBjb25zdCBjeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMuY3koZGF0dW0pKTtcblxuICAgIGlmICgoY3ggPiB4MSAmJiBjeCA8IHgyKSAmJiAoY3kgPiB5MSAmJiBjeSA8IHkyKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgYSBsaW5lLiBJdHMgbWFpbiB1c2UgaXMgYXMgY29tbW9uIHNoYXBlIHRvIGNyZWF0ZSBhXG4gKiBicmVha3BvaW50IHZpc3VhbGl6YXRpb24uIChlbnRpdHkgc2hhcGUpXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYnJlYWtwb2ludC5odG1sKVxuICovXG5jbGFzcyBMaW5lIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ2xpbmUnOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyBjeDogMCwgY3k6IDAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4geyBjb2xvcjogJyMwMDAwMDAnIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbCkgeyByZXR1cm4gdGhpcy4kZWw7IH1cblxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgLy8gdGhpcy5lbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIGRhdGEgPSBkYXRhLnNsaWNlKDApO1xuICAgIGRhdGEuc29ydCgoYSwgYikgPT4gdGhpcy5jeChhKSA8IHRoaXMuY3goYikgPyAtMSA6IDEpO1xuXG4gICAgbGV0IHBhdGggPSAnTSc7XG4gICAgY29uc3QgbGVuZ3RoID0gZGF0YS5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLmN4KGRhdHVtKSk7XG4gICAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy5jeShkYXR1bSkpIC0gMC41O1xuICAgICAgcGF0aCArPSBgJHt4fSwke3l9YDtcblxuICAgICAgaWYgKGkgPCBsZW5ndGggLSAxKVxuICAgICAgICBwYXRoICs9ICdMJztcbiAgICB9XG5cbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIHRoaXMuX2J1aWxkTGluZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSk7XG4gICAgdGhpcy4kZWwuc3R5bGUuc3Ryb2tlID0gdGhpcy5wYXJhbXMuY29sb3I7XG4gICAgdGhpcy4kZWwuc3R5bGUuZmlsbCA9ICdub25lJztcblxuICAgIGRhdGEgPSBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExpbmU7XG4iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgYSBtYXJrZXIuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItbWFya2VyLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcmtlciBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdtYXJrZXInOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyB4OiAwLCBjb2xvcjogJyNmZjAwMDAnLCBsYWJlbDogJycgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGFuZGxlcldpZHRoOiA3LFxuICAgICAgaGFuZGxlckhlaWdodDogMTAsXG4gICAgICBkaXNwbGF5SGFuZGxlcnM6IHRydWUsXG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgY29sb3I6ICdyZWQnLFxuICAgICAgZGlzcGxheUxhYmVsczogZmFsc2UsXG4gICAgICBsYWJlbFdpZHRoOiA2MCxcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpXG4gICAgICByZXR1cm4gdGhpcy4kZWw7XG5cbiAgICBjb25zdCBoZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcblxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdnJyk7XG4gICAgdGhpcy4kbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnbGluZScpO1xuXG4gICAgLy8gZHJhdyBsaW5lXG4gICAgdGhpcy4kbGluZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIDApO1xuICAgIHRoaXMuJGxpbmUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3kxJywgMCk7XG4gICAgdGhpcy4kbGluZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcblxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJGxpbmUpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmRpc3BsYXlIYW5kbGVycykge1xuICAgICAgdGhpcy4kaGFuZGxlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncmVjdCcpO1xuXG4gICAgICB0aGlzLiRoYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgLSB0aGlzLnBhcmFtcy5oYW5kbGVyV2lkdGggLyAyKTtcbiAgICAgIHRoaXMuJGhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgdGhpcy5wYXJhbXMuaGFuZGxlcldpZHRoKTtcbiAgICAgIHRoaXMuJGhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHRoaXMucGFyYW1zLmhhbmRsZXJIZWlnaHQpO1xuICAgICAgdGhpcy4kaGFuZGxlci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcblxuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kaGFuZGxlcik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyYW1zLmRpc3BsYXlMYWJlbHMpIHtcbiAgICAgIC8vIHByZWZlciBodG1sIGBkaXZgIG92ZXIgc3ZnIGB0ZXh0YCB0YWcgYmVjYXVzZSB3ZSB0aGVuIHVzZSB0aGUgYGNvbnRlbnRlZGl0YWJsZWAgcHJvcGVydHlcbiAgICAgIHRoaXMuJGZvcmVpZ25PYmplY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2ZvcmVpZ25PYmplY3QnKTtcblxuICAgICAgdGhpcy4kbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRoaXMuJGxhYmVsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgdGhpcy4kbGFiZWwuc3R5bGUud2lkdGggPSBgJHt0aGlzLnBhcmFtcy5sYWJlbFdpZHRofXB4YDtcbiAgICAgIHRoaXMuJGxhYmVsLnN0eWxlLmZvbnRTaXplID0gJzEycHgnO1xuICAgICAgdGhpcy4kbGFiZWwuc3R5bGUuZm9udEZhbWlseSA9ICdhcmlhbCc7XG4gICAgICB0aGlzLiRsYWJlbC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuXG4gICAgICB0aGlzLiRmb3JlaWduT2JqZWN0LmFwcGVuZENoaWxkKHRoaXMuJGxhYmVsKTtcbiAgICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJGZvcmVpZ25PYmplY3QpO1xuICAgIH1cblxuICAgIHRoaXMuJGVsLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSkgLSAwLjU7XG4gICAgY29uc3QgY29sb3IgPSB0aGlzLmNvbG9yKGRhdHVtKTtcbiAgICBjb25zdCBoZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcblxuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7eH0sIDApYCk7XG5cbiAgICB0aGlzLiRsaW5lLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5MicsIGhlaWdodCk7XG4gICAgdGhpcy4kbGluZS5zdHlsZS5zdHJva2UgPSBjb2xvcjtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5kaXNwbGF5SGFuZGxlcnMpIHtcbiAgICAgIHRoaXMuJGhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCBoZWlnaHQgLSB0aGlzLnBhcmFtcy5oYW5kbGVySGVpZ2h0KTtcbiAgICAgIHRoaXMuJGhhbmRsZXIuc3R5bGUuZmlsbCA9IGNvbG9yO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcmFtcy5kaXNwbGF5TGFiZWxzKSB7XG4gICAgICBjb25zdCBtYXRyaXggPSBgbWF0cml4KDEsIDAsIDAsIC0xLCAke3RoaXMucGFyYW1zLmhhbmRsZXJXaWR0aH0sICR7aGVpZ2h0IC0gMn0pYDtcbiAgICAgIHRoaXMuJGZvcmVpZ25PYmplY3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIG1hdHJpeCk7XG4gICAgICB0aGlzLiRsYWJlbC5pbm5lckhUTUwgPSB0aGlzLmxhYmVsKGRhdHVtKTtcbiAgICB9XG4gIH1cblxuICBpbkFyZWEocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgLy8gaGFuZGxlcnMgb25seSBhcmUgc2VsZWN0YWJsZVxuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkYXR1bSkpO1xuICAgIGNvbnN0IHNoYXBlWDEgPSB4IC0gKHRoaXMucGFyYW1zLmhhbmRsZXJXaWR0aCAtIDEpIC8gMjtcbiAgICBjb25zdCBzaGFwZVgyID0gc2hhcGVYMSArIHRoaXMucGFyYW1zLmhhbmRsZXJXaWR0aDtcbiAgICBjb25zdCBzaGFwZVkxID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQgLSB0aGlzLnBhcmFtcy5oYW5kbGVySGVpZ2h0O1xuICAgIGNvbnN0IHNoYXBlWTIgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcblxuICAgIGNvbnN0IHhPdmVybGFwID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oeDIsIHNoYXBlWDIpIC0gTWF0aC5tYXgoeDEsIHNoYXBlWDEpKTtcbiAgICBjb25zdCB5T3ZlcmxhcCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHkyLCBzaGFwZVkyKSAtIE1hdGgubWF4KHkxLCBzaGFwZVkxKSk7XG4gICAgY29uc3QgYXJlYSA9IHhPdmVybGFwICogeU92ZXJsYXA7XG5cbiAgICByZXR1cm4gYXJlYSA+IDA7XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIHNlZ21lbnQuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItc2VnbWVudC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWdtZW50IGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3NlZ21lbnQnOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyB4OiAwLCB5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAxLCBjb2xvcjogJyMwMDAwMDAnLCBvcGFjaXR5OiAxLCBsYWJlbDogJycgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGlzcGxheUhhbmRsZXJzOiB0cnVlLFxuICAgICAgaGFuZGxlcldpZHRoOiAyLFxuICAgICAgaGFuZGxlck9wYWNpdHk6IDAuOCxcbiAgICAgIG9wYWNpdHk6IDAuNixcbiAgICAgIGRpc3BsYXlMYWJlbHM6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbCkgeyByZXR1cm4gdGhpcy4kZWw7IH1cblxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdnJyk7XG5cbiAgICB0aGlzLiRzZWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdyZWN0Jyk7XG4gICAgdGhpcy4kc2VnbWVudC5jbGFzc0xpc3QuYWRkKCdzZWdtZW50Jyk7XG4gICAgdGhpcy4kc2VnbWVudC5zdHlsZS5vcGFjaXR5ID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcbiAgICB0aGlzLiRzZWdtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kc2VnbWVudCk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZGlzcGxheUhhbmRsZXJzKSB7XG4gICAgICB0aGlzLiRsZWZ0SGFuZGxlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncmVjdCcpO1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuY2xhc3NMaXN0LmFkZCgnbGVmdCcsICdoYW5kbGVyJyk7XG4gICAgICB0aGlzLiRsZWZ0SGFuZGxlci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB0aGlzLnBhcmFtcy5oYW5kbGVyV2lkdGgpO1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG4gICAgICB0aGlzLiRsZWZ0SGFuZGxlci5zdHlsZS5vcGFjaXR5ID0gdGhpcy5wYXJhbXMuaGFuZGxlck9wYWNpdHk7XG4gICAgICB0aGlzLiRsZWZ0SGFuZGxlci5zdHlsZS5jdXJzb3IgPSAnZXctcmVzaXplJztcblxuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdyZWN0Jyk7XG4gICAgICB0aGlzLiRyaWdodEhhbmRsZXIuY2xhc3NMaXN0LmFkZCgncmlnaHQnLCAnaGFuZGxlcicpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHRoaXMucGFyYW1zLmhhbmRsZXJXaWR0aCk7XG4gICAgICB0aGlzLiRyaWdodEhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG4gICAgICB0aGlzLiRyaWdodEhhbmRsZXIuc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLmhhbmRsZXJPcGFjaXR5O1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnN0eWxlLmN1cnNvciA9ICdldy1yZXNpemUnO1xuXG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRsZWZ0SGFuZGxlcik7XG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRyaWdodEhhbmRsZXIpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcmFtcy5kaXNwbGF5TGFiZWxzKSB7XG4gICAgICAvLyBwcmVmZXIgaHRtbCBgZGl2YCBvdmVyIHN2ZyBgdGV4dGAgdGFnIGJlY2F1c2Ugd2UgdGhlbiB1c2UgdGhlIGBjb250ZW50ZWRpdGFibGVgIHByb3BlcnR5XG4gICAgICB0aGlzLiRmb3JlaWduT2JqZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdmb3JlaWduT2JqZWN0Jyk7XG5cbiAgICAgIHRoaXMuJGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0aGlzLiRsYWJlbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIHRoaXMuJGxhYmVsLnN0eWxlLndpZHRoID0gJzUwcHgnO1xuICAgICAgdGhpcy4kbGFiZWwuc3R5bGUuZm9udFNpemUgPSAnMTJweCc7XG4gICAgICB0aGlzLiRsYWJlbC5zdHlsZS5mb250RmFtaWx5ID0gJ2FyaWFsJztcbiAgICAgIHRoaXMuJGxhYmVsLnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XG5cbiAgICAgIHRoaXMuJGZvcmVpZ25PYmplY3QuYXBwZW5kQ2hpbGQodGhpcy4kbGFiZWwpO1xuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kZm9yZWlnbk9iamVjdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSk7XG4gICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMueShkYXR1bSkpO1xuXG4gICAgY29uc3Qgd2lkdGggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMud2lkdGgoZGF0dW0pKTtcbiAgICBjb25zdCBoZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLmhlaWdodChkYXR1bSkpO1xuICAgIGNvbnN0IGNvbG9yID0gdGhpcy5jb2xvcihkYXR1bSk7XG4gICAgY29uc3Qgb3BhY2l0eSA9IHRoaXMub3BhY2l0eShkYXR1bSk7XG5cbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3h9LCAke3l9KWApO1xuICAgIHRoaXMuJGVsLnN0eWxlLm9wYWNpdHkgPSBvcGFjaXR5O1xuXG4gICAgdGhpcy4kc2VnbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCBNYXRoLm1heCh3aWR0aCwgMCkpO1xuICAgIHRoaXMuJHNlZ21lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgdGhpcy4kc2VnbWVudC5zdHlsZS5maWxsID0gY29sb3I7XG5cblxuICAgIGlmICh0aGlzLnBhcmFtcy5kaXNwbGF5SGFuZGxlcnMpIHtcbiAgICAgIC8vIGRpc3BsYXkgaGFuZGxlcnNcbiAgICAgIHRoaXMuJGxlZnRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwgMCknKTtcbiAgICAgIHRoaXMuJGxlZnRIYW5kbGVyLnN0eWxlLmZpbGwgPSBjb2xvcjtcblxuICAgICAgY29uc3QgcmlnaHRIYW5kbGVyVHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgke3dpZHRoIC0gdGhpcy5wYXJhbXMuaGFuZGxlcldpZHRofSwgMClgO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCByaWdodEhhbmRsZXJUcmFuc2xhdGUpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnN0eWxlLmZpbGwgPSBjb2xvcjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZGlzcGxheUxhYmVscykge1xuICAgICAgY29uc3QgbWF0cml4ID0gYG1hdHJpeCgxLCAwLCAwLCAtMSwgNCwgJHtoZWlnaHQgLSAyfSlgXG4gICAgICB0aGlzLiRmb3JlaWduT2JqZWN0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBtYXRyaXgpO1xuICAgICAgdGhpcy4kbGFiZWwuaW5uZXJIVE1MID0gdGhpcy5sYWJlbChkYXR1bSk7XG4gICAgfVxuICB9XG5cbiAgaW5BcmVhKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mikge1xuICAgIGNvbnN0IHNoYXBlWDEgPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkYXR1bSkpO1xuICAgIGNvbnN0IHNoYXBlWDIgPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkYXR1bSkgKyB0aGlzLndpZHRoKGRhdHVtKSk7XG4gICAgY29uc3Qgc2hhcGVZMSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMueShkYXR1bSkpO1xuICAgIGNvbnN0IHNoYXBlWTIgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLnkoZGF0dW0pICsgdGhpcy5oZWlnaHQoZGF0dW0pKTtcblxuICAgIC8vIGh0dHA6Ly9qc2ZpZGRsZS5uZXQvdXRoeVovIC0gY2hlY2sgb3ZlcmxhcGluZyBhcmVhXG4gICAgY29uc3QgeE92ZXJsYXAgPSBNYXRoLm1heCgwLCBNYXRoLm1pbih4Miwgc2hhcGVYMikgLSBNYXRoLm1heCh4MSwgc2hhcGVYMSkpO1xuICAgIGNvbnN0IHlPdmVybGFwID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oeTIsIHNoYXBlWTIpIC0gTWF0aC5tYXgoeTEsIHNoYXBlWTEpKTtcbiAgICBjb25zdCBhcmVhID0geE92ZXJsYXAgKiB5T3ZlcmxhcDtcblxuICAgIHJldHVybiBhcmVhID4gMDtcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuXG4vKipcbiAqIEtpbmQgb2YgTWFya2VyIGZvciBlbnRpdHkgb3JpZW50ZWQgZGF0YS4gVXNlZnVsbCB0byBkaXNwbGF5IGEgZ3JpZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlja3MgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBfZ2V0Q2xhc3NOYW1lKCkge1xuICAgIHJldHVybiAndGljayc7XG4gIH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IHRpbWU6IDAsIGZvY3VzZWQ6IHRydWUsIGxhYmVsOiAnJyB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb2xvcjogJ3N0ZWVsYmx1ZScsXG4gICAgICBmb2N1c2VkT3BhY2l0eTogMC44LFxuICAgICAgZGVmYXVsdE9wYWNpdHk6IDAuM1xuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdnJyk7XG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpIHtcbiAgICB3aGlsZSAodGhpcy4kZWwuZmlyc3RDaGlsZCkge1xuICAgICAgdGhpcy4kZWwucmVtb3ZlQ2hpbGQodGhpcy4kZWwuZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgY29uc3QgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgY29uc3QgbGF5ZXJIZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDsgLy8gdmFsdWVUb1BpeGVsKDEpO1xuXG4gICAgZGF0YS5mb3JFYWNoKChkYXR1bSkgPT4ge1xuICAgICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy50aW1lKGRhdHVtKSk7XG4gICAgICBjb25zdCBvcGFjaXR5ID0gdGhpcy5mb2N1c2VkKGRhdHVtKSA/XG4gICAgICAgIHRoaXMucGFyYW1zLmZvY3VzZWRPcGFjaXR5IDogdGhpcy5wYXJhbXMuZGVmYXVsdE9wYWNpdHk7XG5cbiAgICAgIGNvbnN0IGhlaWdodCA9IGxheWVySGVpZ2h0O1xuXG4gICAgICBjb25zdCB0aWNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdsaW5lJyk7XG4gICAgICB0aWNrLmNsYXNzTGlzdC5hZGQoJ3RpY2snKTtcblxuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneDEnLCAwKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gyJywgMCk7XG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5MScsIDApO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneTInLCBoZWlnaHQpO1xuXG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLmNvbG9yKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7eH0sIDApYCk7XG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICdvcGFjaXR5Jywgb3BhY2l0eSk7XG5cbiAgICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRpY2spO1xuXG4gICAgICBjb25zdCBsYWJlbCA9IHRoaXMubGFiZWwoZGF0dW0pO1xuXG4gICAgICBpZiAobGFiZWwpIHtcbiAgICAgICAgY29uc3QgJGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICd0ZXh0Jyk7XG4gICAgICAgICRsYWJlbC5jbGFzc0xpc3QuYWRkKCdsYWJlbCcpO1xuICAgICAgICBjb25zdCAkdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGxhYmVsKTtcbiAgICAgICAgJGxhYmVsLmFwcGVuZENoaWxkKCR0ZXh0KTtcbiAgICAgICAgJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgbWF0cml4KDEsIDAsIDAsIC0xLCAke3ggKyAyfSwgJHtoZWlnaHQgKyAyfSlgKTtcbiAgICAgICAgLy8gZmlyZWZveCBwcm9ibGVtIGhlcmVcbiAgICAgICAgLy8gJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdhbGlnbm1lbnQtYmFzZWxpbmUnLCAndGV4dC1iZWZvcmUtZWRnZScpO1xuICAgICAgICAkbGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCAnMTAnKTtcblxuICAgICAgICAkbGFiZWwuc3R5bGUuZm9udFNpemUgPSAnMTBweCc7XG4gICAgICAgICRsYWJlbC5zdHlsZS5saW5lSGVpZ2h0ID0gJzEwcHgnO1xuICAgICAgICAkbGFiZWwuc3R5bGUuZm9udEZhbWlseSA9ICdtb25vc3BhY2UnO1xuICAgICAgICAkbGFiZWwuc3R5bGUuY29sb3IgPSAnIzY3Njc2Nyc7XG4gICAgICAgICRsYWJlbC5zdHlsZS5vcGFjaXR5ID0gMC45O1xuICAgICAgICAkbGFiZWwuc3R5bGUubW96VXNlclNlbGVjdCA9ICdub25lJztcbiAgICAgICAgJGxhYmVsLnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICAgICRsYWJlbC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuXG4gICAgICAgIC8vIGNvbnN0IGJnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdyZWN0Jyk7XG4gICAgICAgIC8vIGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsICcxMDAlJyk7XG4gICAgICAgIC8vIGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAnMTAwJScpO1xuICAgICAgICAvLyBiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICcjZmZmZmZmJyk7XG4gICAgICAgIC8vIGxhYmVsLmFwcGVuZENoaWxkKGJnKTtcblxuICAgICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCgkbGFiZWwpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuICB9XG59XG4iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgZG90cyBpbiBhIHRyYWNlIHZpc3VhbGl6YXRpb24gKG1lYW4gLyByYW5nZSkuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItdHJhY2UuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2VEb3RzIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3RyYWNlLWRvdHMnOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyB4OiAwLCBtZWFuOiAwLCByYW5nZTogMCB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtZWFuUmFkaXVzOiAzLFxuICAgICAgcmFuZ2VSYWRpdXM6IDMsXG4gICAgICBtZWFuQ29sb3I6ICcjMjMyMzIzJyxcbiAgICAgIHJhbmdlQ29sb3I6ICdzdGVlbGJsdWUnXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuICAgIC8vIGNvbnRhaW5lclxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdnJyk7XG4gICAgLy8gZHJhdyBtZWFuIGRvdFxuICAgIHRoaXMuJG1lYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2NpcmNsZScpO1xuICAgIHRoaXMuJG1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3InLCB0aGlzLnBhcmFtcy5tZWFuUmFkaXVzKTtcbiAgICB0aGlzLiRtZWFuLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5tZWFuQ29sb3IpO1xuICAgIHRoaXMuJG1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAndHJhbnNwYXJlbnQnKTtcbiAgICB0aGlzLiRtZWFuLmNsYXNzTGlzdC5hZGQoJ21lYW4nKTtcbiAgICAvLyByYW5nZSBkb3RzICgwID0+IHRvcCwgMSA9PiBib3R0b20pXG4gICAgdGhpcy4kbWF4ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdjaXJjbGUnKTtcbiAgICB0aGlzLiRtYXguc2V0QXR0cmlidXRlTlMobnVsbCwgJ3InLCB0aGlzLnBhcmFtcy5tZWFuUmFkaXVzKTtcbiAgICB0aGlzLiRtYXguc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLnJhbmdlQ29sb3IpO1xuICAgIHRoaXMuJG1heC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICd0cmFuc3BhcmVudCcpO1xuICAgIHRoaXMuJG1heC5jbGFzc0xpc3QuYWRkKCdtYXgnKTtcblxuICAgIHRoaXMuJG1pbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnY2lyY2xlJyk7XG4gICAgdGhpcy4kbWluLnNldEF0dHJpYnV0ZU5TKG51bGwsICdyJywgdGhpcy5wYXJhbXMubWVhblJhZGl1cyk7XG4gICAgdGhpcy4kbWluLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5yYW5nZUNvbG9yKTtcbiAgICB0aGlzLiRtaW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAndHJhbnNwYXJlbnQnKTtcbiAgICB0aGlzLiRtaW4uY2xhc3NMaXN0LmFkZCgnbWluJyk7XG5cbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRtZWFuKTtcbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRtYXgpO1xuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJG1pbik7XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICAvLyBAVE9ETyB1c2UgYWNjZXNzb3JzXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSkge1xuICAgIGNvbnN0IG1lYW4gPSB0aGlzLm1lYW4oZGF0dW0pO1xuICAgIGNvbnN0IHJhbmdlID0gdGhpcy5yYW5nZShkYXR1bSk7XG4gICAgY29uc3QgeCA9IHRoaXMueChkYXR1bSk7XG4gICAgLy8geSBwb3NpdGlvbnNcbiAgICBjb25zdCBtZWFuUG9zID0gYCR7cmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwobWVhbil9YDtcbiAgICB0aGlzLiRtZWFuLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7bWVhblBvc30pYCk7XG5cbiAgICBjb25zdCBoYWxmUmFuZ2UgPSByYW5nZSAvIDI7XG4gICAgY29uc3QgbWF4ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwobWVhbiArIGhhbGZSYW5nZSk7XG4gICAgY29uc3QgbWluID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwobWVhbiAtIGhhbGZSYW5nZSk7XG4gICAgY29uc3QgeFBvcyA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoeCk7XG5cbiAgICB0aGlzLiRtYXguc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHttYXh9KWApO1xuICAgIHRoaXMuJG1pbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke21pbn0pYCk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHt4UG9zfSwgMClgKTtcbiAgfVxuXG4gIGluQXJlYShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgeDEsIHkxLCB4MiwgeTIpIHtcbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLngoZGF0dW0pKTtcbiAgICBjb25zdCBtZWFuID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy5tZWFuKGRhdHVtKSk7XG4gICAgY29uc3QgcmFuZ2UgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLnJhbmdlKGRhdHVtKSk7XG4gICAgY29uc3QgbWluID0gbWVhbiAtIChyYW5nZSAvIDIpO1xuICAgIGNvbnN0IG1heCA9IG1lYW4gKyAocmFuZ2UgLyAyKTtcblxuICAgIGlmICh4ID4geDEgJiYgeCA8IHgyICYmIChtaW4gPiB5MSB8fCBtYXggPCB5MikpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuXG5cbi8qKlxuICogQSBzaGFwZSB0byBkaXNwbGF5IHBhdGhzIGluIGEgdHJhY2UgdmlzdWFsaXphdGlvbiAobWVhbiAvIHJhbmdlKS4gKGVudGl0eSBzaGFwZSlcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci10cmFjZS5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFjZVBhdGggZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAndHJhY2UtY29tbW9uJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgeDogMCwgbWVhbjogMCwgcmFuZ2U6IDAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmFuZ2VDb2xvcjogJ3N0ZWVsYmx1ZScsXG4gICAgICBtZWFuQ29sb3I6ICcjMjMyMzIzJyxcbiAgICAgIGRpc3BsYXlNZWFuOiB0cnVlXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdnJyk7XG4gICAgLy8gcmFuZ2UgcGF0aFxuICAgIHRoaXMuJHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kcmFuZ2UpO1xuXG4gICAgLy8gbWVhbiBsaW5lXG4gICAgaWYgKHRoaXMucGFyYW1zLmRpc3BsYXlNZWFuKSB7XG4gICAgICB0aGlzLiRtZWFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRtZWFuKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIC8vIG9yZGVyIGRhdGEgYnkgeCBwb3NpdGlvblxuICAgIGRhdGEgPSBkYXRhLnNsaWNlKDApO1xuICAgIGRhdGEuc29ydCgoYSwgYikgPT4gdGhpcy54KGEpIDwgdGhpcy54KGIpID8gLTEgOiAxKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5kaXNwbGF5TWVhbikge1xuICAgICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIHRoaXMuX2J1aWxkTWVhbkxpbmUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkpO1xuICAgICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMubWVhbkNvbG9yKTtcbiAgICAgIHRoaXMuJG1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnbm9uZScpO1xuICAgIH1cblxuICAgIHRoaXMuJHJhbmdlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgdGhpcy5fYnVpbGRSYW5nZVpvbmUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkpO1xuICAgIHRoaXMuJHJhbmdlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCAnbm9uZScpO1xuICAgIHRoaXMuJHJhbmdlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgdGhpcy5wYXJhbXMucmFuZ2VDb2xvcik7XG4gICAgdGhpcy4kcmFuZ2Uuc2V0QXR0cmlidXRlTlMobnVsbCwgJ29wYWNpdHknLCAnMC40Jyk7XG5cbiAgICBkYXRhID0gbnVsbDtcbiAgfVxuXG4gIF9idWlsZE1lYW5MaW5lKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpIHtcbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gZGF0YS5tYXAoKGRhdHVtLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSk7XG4gICAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy5tZWFuKGRhdHVtKSk7XG4gICAgICByZXR1cm4gYCR7eH0sJHt5fWA7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gJ00nICsgaW5zdHJ1Y3Rpb25zLmpvaW4oJ0wnKTtcbiAgfVxuXG4gIF9idWlsZFJhbmdlWm9uZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gZGF0YS5sZW5ndGg7XG4gICAgLy8gY29uc3QgbGFzdEluZGV4ID0gZGF0YVxuICAgIGxldCBpbnN0cnVjdGlvbnNTdGFydCA9ICcnO1xuICAgIGxldCBpbnN0cnVjdGlvbnNFbmQgPSAnJztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGRhdHVtID0gZGF0YVtpXTtcbiAgICAgIGNvbnN0IG1lYW4gPSB0aGlzLm1lYW4oZGF0dW0pO1xuICAgICAgY29uc3QgaGFsZlJhbmdlID0gdGhpcy5yYW5nZShkYXR1bSkgLyAyO1xuXG4gICAgICBjb25zdCB4ICA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSk7XG4gICAgICBjb25zdCB5MCA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKG1lYW4gKyBoYWxmUmFuZ2UpO1xuICAgICAgY29uc3QgeTEgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChtZWFuIC0gaGFsZlJhbmdlKTtcblxuICAgICAgY29uc3Qgc3RhcnQgPSBgJHt4fSwke3kwfWA7XG4gICAgICBjb25zdCBlbmQgICA9IGAke3h9LCR7eTF9YDtcblxuICAgICAgaW5zdHJ1Y3Rpb25zU3RhcnQgPSBpbnN0cnVjdGlvbnNTdGFydCA9PT0gJycgP1xuICAgICAgICBzdGFydCA6IGAke2luc3RydWN0aW9uc1N0YXJ0fUwke3N0YXJ0fWA7XG5cbiAgICAgIGluc3RydWN0aW9uc0VuZCA9IGluc3RydWN0aW9uc0VuZCA9PT0gJycgP1xuICAgICAgICBlbmQgOiBgJHtlbmR9TCR7aW5zdHJ1Y3Rpb25zRW5kfWA7XG4gICAgfVxuXG4gICAgbGV0IGluc3RydWN0aW9ucyA9IGBNJHtpbnN0cnVjdGlvbnNTdGFydH1MJHtpbnN0cnVjdGlvbnNFbmR9WmA7XG4gICAgcmV0dXJuIGluc3RydWN0aW9ucztcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuXG5cbmNvbnN0IHhodG1sTlMgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCc7XG5cbi8qKlxuICogQSBzaGFwZSB0byBkaXNwbGF5IGEgd2F2ZWZvcm0uIChmb3IgZW50aXR5IGRhdGEpXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItd2F2ZWZvcm0uaHRtbClcbiAqXG4gKiBAdG9kbyAtIGZpeCBwcm9ibGVtcyB3aXRoIGNhbnZhcyBzdHJhdGVneS5cbiAqL1xuY2xhc3MgV2F2ZWZvcm0gZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnd2F2ZWZvcm0nOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICAvLyByZXR1cm4geyB5OiAwIH07XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzYW1wbGVSYXRlOiA0NDEwMCxcbiAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgLy8gcmVuZGVyaW5nU3RyYXRlZ3k6ICdzdmcnIC8vIGNhbnZhcyBpcyBidWdnZWQgKHRyYW5zbGF0aW9uLCBldGMuLi4pXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKVxuICAgICAgcmV0dXJuIHRoaXMuJGVsO1xuXG4gICAgLy8gaWYgKHRoaXMucGFyYW1zLnJlbmRlcmluZ1N0cmF0ZWd5ID09PSAnc3ZnJykge1xuXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3BhdGgnKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICdub25lJyk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLmNvbG9yKTtcbiAgICB0aGlzLiRlbC5zdHlsZS5vcGFjaXR5ID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcblxuICAgIC8vIH0gZWxzZSBpZiAodGhpcy5wYXJhbXMucmVuZGVyaW5nU3RyYXRlZ3kgPT09ICdjYW52YXMnKSB7XG5cbiAgICAvLyAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdmb3JlaWduT2JqZWN0Jyk7XG4gICAgLy8gICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCByZW5kZXJpbmdDb250ZXh0LndpZHRoKTtcbiAgICAvLyAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCByZW5kZXJpbmdDb250ZXh0LmhlaWdodCk7XG5cbiAgICAvLyAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh4aHRtbE5TLCAneGh0bWw6Y2FudmFzJyk7XG5cbiAgICAvLyAgIHRoaXMuX2N0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIC8vICAgdGhpcy5fY3R4LmNhbnZhcy53aWR0aCA9IHJlbmRlcmluZ0NvbnRleHQud2lkdGg7XG4gICAgLy8gICB0aGlzLl9jdHguY2FudmFzLmhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuXG4gICAgLy8gICB0aGlzLiRlbC5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAgIC8vIH1cblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSkge1xuICAgIC8vIGRlZmluZSBuYnIgb2Ygc2FtcGxlcyBwZXIgcGl4ZWxzXG4gICAgY29uc3Qgc2xpY2VNZXRob2QgPSBkYXR1bSBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSA/ICdzdWJhcnJheScgOiAnc2xpY2UnO1xuICAgIGNvbnN0IG5iclNhbXBsZXMgPSBkYXR1bS5sZW5ndGg7XG4gICAgY29uc3QgZHVyYXRpb24gPSBuYnJTYW1wbGVzIC8gdGhpcy5wYXJhbXMuc2FtcGxlUmF0ZTtcbiAgICBjb25zdCB3aWR0aCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoZHVyYXRpb24pO1xuICAgIGNvbnN0IHNhbXBsZXNQZXJQaXhlbCA9IG5iclNhbXBsZXMgLyB3aWR0aDtcblxuICAgIGlmICghc2FtcGxlc1BlclBpeGVsIHx8IGRhdHVtLmxlbmd0aCA8IHNhbXBsZXNQZXJQaXhlbCkgeyByZXR1cm47IH1cblxuICAgIC8vIGNvbXB1dGUvZHJhdyB2aXNpYmxlIGFyZWEgb25seVxuICAgIC8vIEBUT0RPIHJlZmFjdG9yIHRoaXMgdW51bmRlcnN0YW5kYWJsZSBtZXNzXG4gICAgbGV0IG1pblggPSBNYXRoLm1heCgtcmVuZGVyaW5nQ29udGV4dC5vZmZzZXRYLCAwKTtcbiAgICBsZXQgdHJhY2tEZWNheSA9IHJlbmRlcmluZ0NvbnRleHQudHJhY2tPZmZzZXRYICsgcmVuZGVyaW5nQ29udGV4dC5zdGFydFg7XG4gICAgaWYgKHRyYWNrRGVjYXkgPCAwKSB7IG1pblggPSAtdHJhY2tEZWNheTsgfVxuXG4gICAgbGV0IG1heFggPSBtaW5YO1xuICAgIG1heFggKz0gKHJlbmRlcmluZ0NvbnRleHQud2lkdGggLSBtaW5YIDwgcmVuZGVyaW5nQ29udGV4dC52aXNpYmxlV2lkdGgpID9cbiAgICAgIHJlbmRlcmluZ0NvbnRleHQud2lkdGggOiByZW5kZXJpbmdDb250ZXh0LnZpc2libGVXaWR0aDtcblxuICAgIC8vIGdldCBtaW4vbWF4IHBlciBwaXhlbHMsIGNsYW1wZWQgdG8gdGhlIHZpc2libGUgYXJlYVxuICAgIGNvbnN0IGludmVydCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0O1xuICAgIGNvbnN0IHNhbXBsZVJhdGUgPSB0aGlzLnBhcmFtcy5zYW1wbGVSYXRlO1xuICAgIGNvbnN0IG1pbk1heCA9IFtdO1xuXG4gICAgZm9yIChsZXQgcHggPSBtaW5YOyBweCA8IG1heFg7IHB4KyspIHtcbiAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IGludmVydChweCk7XG4gICAgICBjb25zdCBzdGFydFNhbXBsZSA9IHN0YXJ0VGltZSAqIHNhbXBsZVJhdGU7XG4gICAgICBjb25zdCBleHRyYWN0ID0gZGF0dW1bc2xpY2VNZXRob2RdKHN0YXJ0U2FtcGxlLCBzdGFydFNhbXBsZSArIHNhbXBsZXNQZXJQaXhlbCk7XG5cbiAgICAgIGxldCBtaW4gPSBJbmZpbml0eTtcbiAgICAgIGxldCBtYXggPSAtSW5maW5pdHk7XG5cbiAgICAgIGZvciAobGV0IGogPSAwLCBsID0gZXh0cmFjdC5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgICAgbGV0IHNhbXBsZSA9IGV4dHJhY3Rbal07XG4gICAgICAgIGlmIChzYW1wbGUgPCBtaW4pIG1pbiA9IHNhbXBsZTtcbiAgICAgICAgaWYgKHNhbXBsZSA+IG1heCkgbWF4ID0gc2FtcGxlO1xuICAgICAgfVxuICAgICAgLy8gZGlzYWxsb3cgSW5maW5pdHlcbiAgICAgIG1pbiA9ICFpc0Zpbml0ZShtaW4pID8gMCA6IG1pbjtcbiAgICAgIG1heCA9ICFpc0Zpbml0ZShtYXgpID8gMCA6IG1heDtcblxuICAgICAgbWluTWF4LnB1c2goW3B4LCBtaW4sIG1heF0pO1xuICAgIH1cblxuICAgIGlmIChtaW5NYXgubGVuZ3RoKSB7XG5cbiAgICAgIGNvbnN0IFBJWEVMID0gMDtcbiAgICAgIGNvbnN0IE1JTiAgID0gMTtcbiAgICAgIGNvbnN0IE1BWCAgID0gMjtcblxuICAgICAgLy8gcmVuZGVyaW5nIHN0cmF0ZWdpZXNcbiAgICAgIC8vIGlmICh0aGlzLnBhcmFtcy5yZW5kZXJpbmdTdHJhdGVneSA9PT0gJ3N2ZycpIHtcblxuICAgICAgbGV0IGQgPSAnTSc7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gbWluTWF4Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBjb25zdCBkYXR1bSA9IG1pbk1heFtpXTtcbiAgICAgICAgY29uc3QgeCAgPSBkYXR1bVtQSVhFTF07XG4gICAgICAgIGxldCB5MSA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoZGF0dW1bTUlOXSkpO1xuICAgICAgICBsZXQgeTIgPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKGRhdHVtW01BWF0pKTtcblxuICAgICAgICBkICs9IGAke3h9LCR7eTF9TCR7eH0sJHt5Mn1gO1xuXG4gICAgICAgIGlmIChpIDwgbCAtIDEpXG4gICAgICAgICAgZCArPSAnTCc7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgZCk7XG5cbiAgICAgIC8vIH0gZWxzZSBpZiAodGhpcy5wYXJhbXMucmVuZGVyaW5nU3RyYXRlZ3kgPT09ICdjYW52YXMnKSB7XG5cbiAgICAgIC8vICAgdGhpcy5fY3R4LmNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgICAgLy8gICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgd2lkdGgpO1xuICAgICAgLy8gICAvLyBmaXggY2hyb21lIGJ1ZyB3aXRoIHRyYW5zbGF0ZVxuICAgICAgLy8gICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2Nocm9tZScpID4gLTEpIHtcbiAgICAgIC8vICAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGUoJ3gnLCByZW5kZXJpbmdDb250ZXh0Lm9mZnNldFgpO1xuICAgICAgLy8gICB9XG5cbiAgICAgIC8vICAgdGhpcy5fY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5wYXJhbXMuY29sb3I7XG4gICAgICAvLyAgIHRoaXMuX2N0eC5nbG9iYWxBbHBoYSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG4gICAgICAvLyAgIHRoaXMuX2N0eC5tb3ZlVG8ocmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCgwKSwgcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoMCkpO1xuXG4gICAgICAvLyAgIG1pbk1heC5mb3JFYWNoKChkYXR1bSkgPT4ge1xuICAgICAgLy8gICAgIGNvbnN0IHggID0gZGF0dW1bUElYRUxdO1xuICAgICAgLy8gICAgIGxldCB5MSA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoZGF0dW1bTUlOXSkpO1xuICAgICAgLy8gICAgIGxldCB5MiA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoZGF0dW1bTUFYXSkpO1xuXG4gICAgICAvLyAgICAgdGhpcy5fY3R4Lm1vdmVUbyh4LCB5MSk7XG4gICAgICAvLyAgICAgdGhpcy5fY3R4LmxpbmVUbyh4LCB5Mik7XG4gICAgICAvLyAgIH0pO1xuXG4gICAgICAvLyAgIHRoaXMuX2N0eC5zdHJva2UoKTtcbiAgICAgIC8vIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgV2F2ZWZvcm07XG4iLCIvKipcbiAqIGBTdGF0ZWAgaW5zdGFuY2VzIGFyZSB1c2VkIHRvIGRlZmluZSB0aGUgYXBwbGljYXRpb24gbG9naWMgYnkgcHJlY2lzaW5nXG4gKiBzcGVjaWZpYyB1c2VyIGludGVyYWN0aW9uIGNhc2VzLCBhbmQgaG93IHRoZXkgaW1wYWN0IHRoZSBvdmVyYWwgdGVtcG9yYWxcbiAqIHJlcHJlc2VudGF0aW9uLiBUaGUgYWJzdHJhY3Rpb25zIGV4dGVuZGluZyB0aGlzIGJhc2UgY2xhc3Mgc2hvdWxkIGJlXG4gKiBjb25zaWRlcmVkIGFzIHRoZSBtYWluIGludGVyZmFjZSBiZXR3ZWVuIHRoZSB2aXN1YWxpemF0aW9uIGFuZCB0aGVcbiAqIGFwcGxpY2F0aW9uIGxvZ2ljLiBBbGwgcHJvdmlkZWQgc3RhdGVzIHNob3VsZCBiZSBzZWVuIGFzIHNpbXBsZSBleGFtcGxlcyBmb3JcbiAqIHJhcGlkIHByb3RvdHlwaW5nLFxuICpcbiAqIFN0YXRlcyBtYW5hZ2UgaW50ZXJhY3Rpb25zIGxpa2Ugem9vbWluZywgYnJvd3NpbmcsIG9yIGVkaXRpbmcgdGhlIHRpbWVsaW5lLlxuICogQ3VzdG9taXplZCBzdGF0ZXMgc2hvdWxkIGV4dGVuZCB0aGlzIEJhc2VTdGF0ZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZVN0YXRlIHtcbiAgLyoqXG4gICAqIFJldHVybnMgdGltZWxpbmUgdHJhY2tzIGNvbGxlY3Rpb24uXG4gICAqXG4gICAqIEB0eXBlIHtUcmFja0NvbGxlY3Rpb259XG4gICAqL1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIC8qKlxuICAgICAqIEEgcmVmZXJlbmNlIHRvIHRoZSB0aW1lbGluZSBvbiB3aGljaCB0aGUgc3RhdGUgc2hvdWxkIGJlIGluc3RhbGxlZC5cbiAgICAgKiBAdHlwZSB7VGltZWxpbmV9XG4gICAgICovXG4gICAgdGhpcy50aW1lbGluZSA9IHRpbWVsaW5lO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGltZWxpbmUgdHJhY2tzIGNvbGxlY3Rpb24uXG4gICAqXG4gICAqIEB0eXBlIHtUcmFja0NvbGxlY3Rpb248VHJhY2s+fVxuICAgKi9cbiAgZ2V0IHRyYWNrcygpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lbGluZS50cmFja3M7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbGwgcmVnaXN0ZXJlZCBsYXllcnMuXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheTxMYXllcj59XG4gICAqL1xuICBnZXQgbGF5ZXJzKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVsaW5lLnRyYWNrcy5sYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHRpbWVsaW5lIGlzIGVudGVyaW5nIHRoZSBzdGF0ZS5cbiAgICovXG4gIGVudGVyKCkge31cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHRpbWVsaW5lIGlzIGxlYXZpbmcgdGhlIHN0YXRlLlxuICAgKi9cbiAgZXhpdCgpIHt9XG5cbiAgLyoqXG4gICAqIE1haW4gaW50ZXJmYWNlIG1ldGhvZCB0byBvdmVycmlkZSB3aGVuIGNyZWF0aW5nIGEgbmV3IGBTdGF0ZWAuIEhhbmRsZSBldmVudFxuICAgKiBmcm9tIG1vdXNlIG9yIGtleWJvYXJkLCBzaG91bGQgZGVmaW5lIGJlaGF2aW9yIGFjY29yZGluZyB0byB0aGUgZXZlbnRcbiAgICogKGFrYS4gbW91c2Vkb3duLCBtb3VzZXVwLCAuLi4pLlxuICAgKlxuICAgKiBAcGFyYW0ge1dhdmVFdmVudH0gZSAtIHRoZSBldmVudCB0byBwcm9jZXNzLlxuICAgKiBAcGFyYW0ge0FycmF5fSBoaXRMYXllcnMgLSB0aGUgbGF5ZXJzIGhpdCBieSB0aGUgbW91c2UgZXZlbnQgKGlmIHN1cmZhY2VcbiAgICogZXZlbnQpLlxuICAgKi9cbiAgaGFuZGxlRXZlbnQoZSwgaGl0TGF5ZXJzKSB7fVxufVxuIiwiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuXG5cbi8qKlxuICogQSBzdGF0ZSB0byBpbnRlcmFjdCB3aXRoIGEgYnJlYWtwb2ludCBmdW5jdGlvbiwgbWltaWNpbmcgTWF4L01TUCdzXG4gKiBicmVha3BvaW50IGZ1bmN0aW9uIGludGVyYWN0aW9ucy5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1icmVha3BpbnQuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJlYWtwb2ludFN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUsIGRhdHVtR2VuZXJhdG9yKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5kYXR1bUdlbmVyYXRvciA9IGRhdHVtR2VuZXJhdG9yO1xuICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICB9XG5cbiAgZW50ZXIoKSB7fVxuICBleGl0KCkge31cblxuICBoYW5kbGVFdmVudChlLCBoaXRMYXllcnMpIHtcbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlLCBoaXRMYXllcnMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSwgaGl0TGF5ZXJzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSwgaGl0TGF5ZXJzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSwgaGl0TGF5ZXJzKSB7XG4gICAgdGhpcy5tb3VzZURvd24gPSB0cnVlO1xuICAgIC8vIGtlZXAgdGFyZ2V0IGNvbnNpc3RlbnQgd2l0aCBtb3VzZSBkb3duXG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgbGV0IHVwZGF0ZWRMYXllciA9IG51bGw7XG5cbiAgICBjb25zdCBsYXllcnMgPSBoaXRMYXllcnM7XG5cbiAgICBsYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGxheWVyLnVuc2VsZWN0KCk7XG4gICAgICBjb25zdCBpdGVtID0gbGF5ZXIuZ2V0SXRlbUZyb21ET01FbGVtZW50KGUudGFyZ2V0KTtcblxuICAgICAgaWYgKGl0ZW0gPT09IG51bGwpIHtcbiAgICAgICAgLy8gY3JlYXRlIGFuIGl0ZW1cbiAgICAgICAgY29uc3QgdGltZSA9IGxheWVyLnRpbWVUb1BpeGVsLmludmVydChlLngpIC0gdGhpcy50aW1lbGluZS5vZmZzZXQ7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gbGF5ZXIudmFsdWVUb1BpeGVsLmludmVydChsYXllci5wYXJhbXMuaGVpZ2h0IC0gZS55KTtcbiAgICAgICAgY29uc3QgZGF0dW0gPSB0aGlzLmRhdHVtR2VuZXJhdG9yKHRpbWUsIHZhbHVlKTtcblxuICAgICAgICBsYXllci5kYXRhLnB1c2goZGF0dW0pO1xuICAgICAgICB1cGRhdGVkTGF5ZXIgPSBsYXllcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIHNoaWZ0IGlzIHByZXNzZWQsIHJlbW92ZSB0aGUgaXRlbVxuICAgICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgY29uc3QgZGF0YSA9IGxheWVyLmRhdGE7XG4gICAgICAgICAgY29uc3QgZGF0dW0gPSBsYXllci5nZXREYXR1bUZyb21JdGVtKGl0ZW0pO1xuICAgICAgICAgIGRhdGEuc3BsaWNlKGRhdGEuaW5kZXhPZihkYXR1bSksIDEpO1xuXG4gICAgICAgICAgdXBkYXRlZExheWVyID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIgPSBsYXllcjtcbiAgICAgICAgICBsYXllci5zZWxlY3QoaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh1cGRhdGVkTGF5ZXIpIHtcbiAgICAgIHRoaXMudGltZWxpbmUudHJhY2tzLnJlbmRlcih1cGRhdGVkTGF5ZXIpO1xuICAgICAgdGhpcy50aW1lbGluZS50cmFja3MudXBkYXRlKHVwZGF0ZWRMYXllcik7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIGlmICghdGhpcy5tb3VzZURvd24gfHzCoCF0aGlzLmN1cnJlbnRFZGl0ZWRMYXllcikgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGxheWVyID0gdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXI7XG4gICAgY29uc3QgaXRlbXMgPSBsYXllci5zZWxlY3RlZEl0ZW1zO1xuICAgIC8vIHRoZSBsb29wIHNob3VsZCBiZSBpbiBsYXllciB0byBtYXRjaCBzZWxlY3QgLyB1bnNlbGVjdCBBUElcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBsYXllci5lZGl0KGl0ZW0sIGUuZHgsIGUuZHksIHRoaXMuY3VycmVudFRhcmdldCk7XG4gICAgfSk7XG5cbiAgICBsYXllci51cGRhdGUoaXRlbXMpO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IG51bGw7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IG5zIGZyb20gJy4uL2NvcmUvbmFtZXNwYWNlJztcbmltcG9ydCBCYXNlU3RhdGUgZnJvbSAnLi9iYXNlLXN0YXRlJztcblxuXG4vKipcbiAqIFByb3Rvb2xzIGxpa2Ugem9vbSB3aXRoIHpvbmUgc2VsZWN0aW9uLiBQcmVzcyBzcGFjZSBiYXIgdG8gcmVzZXQgem9vbS5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9zdGF0ZXMtem9vbS5odG1sKVxuICpcbiAqIEB0b2RvIC0gY291bGQgYWxzbyBoYW5kbGUgYGdgIGFuZCBgaGAga2V5cyB0byB6b29tLWluLCB6b29tLW91dC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJ1c2hab29tU3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2goZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2tleWRvd24nOlxuICAgICAgICB0aGlzLm9uS2V5RG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMuYnJ1c2hlcyA9IFtdO1xuICAgIHRoaXMuc3RhcnRYID0gZS54O1xuICAgIC8vIGNyZWF0ZSBicnVzaCBpbiBlYWNoIGNvbnRhaW5lcnNcbiAgICB0aGlzLnRyYWNrcy5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgY29uc3QgaW50ZXJhY3Rpb25zID0gdHJhY2suJGludGVyYWN0aW9ucztcblxuICAgICAgY29uc3QgYnJ1c2ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgICBicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgdHJhY2suaGVpZ2h0KTtcbiAgICAgIGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgMCk7XG4gICAgICBicnVzaC5zdHlsZS5maWxsID0gJyM3ODc4NzgnO1xuICAgICAgYnJ1c2guc3R5bGUub3BhY2l0eSA9IDAuMjtcblxuICAgICAgaW50ZXJhY3Rpb25zLmFwcGVuZENoaWxkKGJydXNoKTtcblxuICAgICAgdGhpcy5icnVzaGVzLnB1c2goYnJ1c2gpO1xuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIC8vIHVwZGF0ZSBicnVzaFxuICAgIGNvbnN0IHdpZHRoID0gTWF0aC5hYnMoZS54IC0gdGhpcy5zdGFydFgpO1xuICAgIGNvbnN0IHggPSBNYXRoLm1pbihlLngsIHRoaXMuc3RhcnRYKTtcblxuICAgIHRoaXMuYnJ1c2hlcy5mb3JFYWNoKChicnVzaCkgPT4ge1xuICAgICAgYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgICAgYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCB4KTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgLy8gcmVtb3ZlIGJydXNoXG4gICAgdGhpcy5icnVzaGVzLmZvckVhY2goKGJydXNoKSA9PiB7XG4gICAgICBicnVzaC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGJydXNoKTtcbiAgICB9KTtcblxuICAgIC8vIHVwZGF0ZSB0aW1lQ29udGV4dFxuICAgIGNvbnN0IHN0YXJ0WCA9IHRoaXMuc3RhcnRYO1xuICAgIGNvbnN0IGVuZFggPSBlLng7XG4gICAgLy8gcmV0dXJuIGlmIG5vIGRyYWdcbiAgICBpZiAoTWF0aC5hYnMoc3RhcnRYIC0gZW5kWCkgPCAxKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgbGVmdFggPSBNYXRoLm1heCgwLCBNYXRoLm1pbihzdGFydFgsIGVuZFgpKTtcbiAgICBjb25zdCByaWdodFggPSBNYXRoLm1heChzdGFydFgsIGVuZFgpO1xuXG4gICAgbGV0IG1pblRpbWUgPSB0aGlzLnRpbWVsaW5lLnRpbWVUb1BpeGVsLmludmVydChsZWZ0WCk7XG4gICAgbGV0IG1heFRpbWUgPSB0aGlzLnRpbWVsaW5lLnRpbWVUb1BpeGVsLmludmVydChyaWdodFgpO1xuXG4gICAgY29uc3QgZGVsdGFEdXJhdGlvbiA9IG1heFRpbWUgLSBtaW5UaW1lO1xuICAgIGNvbnN0IHpvb20gPSB0aGlzLnRpbWVsaW5lLnZpc2libGVEdXJhdGlvbiAvIGRlbHRhRHVyYXRpb247XG5cbiAgICB0aGlzLnRpbWVsaW5lLm9mZnNldCAtPSBtaW5UaW1lO1xuICAgIHRoaXMudGltZWxpbmUuem9vbSAqPSB6b29tO1xuXG4gICAgdGhpcy50cmFja3MudXBkYXRlKCk7XG4gIH1cblxuICBvbktleURvd24oZSkge1xuICAgIC8vIHJlc2V0IG9uIHNwYWNlIGJhclxuICAgIGlmIChlLm9yaWdpbmFsRXZlbnQua2V5Q29kZSA9PT0gMzIpIHtcbiAgICAgIHRoaXMudGltZWxpbmUub2Zmc2V0ID0gMDtcbiAgICAgIHRoaXMudGltZWxpbmUuem9vbSA9IDE7XG4gICAgICB0aGlzLnRyYWNrcy51cGRhdGUoKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBzY2FsZXMgZnJvbSAnLi4vdXRpbHMvc2NhbGVzJztcbmltcG9ydCBCYXNlU3RhdGUgZnJvbSAnLi9iYXNlLXN0YXRlJztcblxuXG4vKipcbiAqIGBDZW50ZXJlZFpvb21TdGF0ZWAgaXMgYSB0aW1lbGluZSBzdGF0ZSBtaW1pY2luZyB0aGUgYExpdmVgIHpvb20gaW50ZXJhY3Rpb24uIEl0IGFsbG93cyB0aGUgdXNlciB0byBicm93c2UgdGhlIHRpbWVsaW5lIGJ5IGNsaWNraW5nIG9uIGEgdHJhY2ssIGFuZCB0aGVuXG4gKiAtIG1vdmluZyBkb3duIHRvIHpvb20gaW5cbiAqIC0gbW92aW5nIHVwIHRvIHpvb20gb3V0XG4gKiAtIG1vdmluZyBsZWZ0IHRvIG1vdmUgaW4gdGltZSwgYWZ0ZXJcbiAqIC0gbW92aW5nIHJpZ2h0IHRvIG1vdmUgaW4gdGltZSwgYmVmb3JlXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvc3RhdGVzLXpvb20uaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2VudGVyZWRab29tU3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcbiAgICB0aGlzLmN1cnJlbnRMYXllciA9IG51bGw7XG4gICAgLy8gU2V0IG1heC9taW4gem9vbVxuICAgIC8vIG1heFpvb206IDFweCBwZXIgc2FtcGxlXG4gICAgLy8gbWluWm9vbTogMTAgMDAwIHB4IHBlciAxIGhvdXJcbiAgICAvLyB3aXRoIGEgZGVmYXVsdCB0byA0NC4xa0h6IHNhbXBsZSByYXRlXG4gICAgdGhpcy5tYXhab29tID0gNDQxMDAgKiAxIC8gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC5waXhlbHNQZXJTZWNvbmQ7XG4gICAgdGhpcy5taW5ab29tID0gMTAwMDAgLyAzNjAwIC8gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC5waXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMuaW5pdGlhbFpvb20gPSB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0Lnpvb207XG4gICAgdGhpcy5pbml0aWFsWSA9IGUueTtcblxuICAgIHRoaXMuX3BpeGVsVG9FeHBvbmVudCA9IHNjYWxlcy5saW5lYXIoKVxuICAgICAgLmRvbWFpbihbMCwgMTAwXSkgLy8gMTAwcHggPT4gZmFjdG9yIDJcbiAgICAgIC5yYW5nZShbMCwgMV0pO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIC8vIHByZXZlbnQgYW5ub3lpbmcgdGV4dCBzZWxlY3Rpb24gd2hlbiBkcmFnZ2luZ1xuICAgIGUub3JpZ2luYWxFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3QgdGltZUNvbnRleHQgPSB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IGxhc3RDZW50ZXJUaW1lID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KGUueCk7XG4gICAgY29uc3QgZXhwb25lbnQgPSB0aGlzLl9waXhlbFRvRXhwb25lbnQoZS55IC0gdGhpcy5pbml0aWFsWSk7XG4gICAgY29uc3QgdGFyZ2V0Wm9vbSA9IHRoaXMuaW5pdGlhbFpvb20gKiBNYXRoLnBvdygyLCBleHBvbmVudCk7IC8vIC0xLi4uMSAtPiAxLzIuLi4yXG5cbiAgICB0aW1lQ29udGV4dC56b29tID0gTWF0aC5taW4oTWF0aC5tYXgodGFyZ2V0Wm9vbSwgdGhpcy5taW5ab29tKSwgdGhpcy5tYXhab29tKTtcblxuICAgIGNvbnN0IG5ld0NlbnRlclRpbWUgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoZS54KTtcbiAgICBjb25zdCBkZWx0YSA9IG5ld0NlbnRlclRpbWUgLSBsYXN0Q2VudGVyVGltZTtcblxuICAgIC8vIEFwcGx5IG5ldyBvZmZzZXQgdG8ga2VlcCBpdCBjZW50ZXJlZCB0byB0aGUgbW91c2VcbiAgICB0aW1lQ29udGV4dC5vZmZzZXQgKz0gKGRlbHRhICsgdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KGUuZHgpKTtcblxuICAgIC8vIE90aGVyIHBvc3NpYmxlIGV4cGVyaW1lbnRzIHdpdGggY2VudGVyZWQtem9vbS1zdGF0ZVxuICAgIC8vXG4gICAgLy8gRXhhbXBsZSAxOiBQcmV2ZW50IHRpbWVsaW5lLm9mZnNldCB0byBiZSBuZWdhdGl2ZVxuICAgIC8vIHRpbWVDb250ZXh0Lm9mZnNldCA9IE1hdGgubWluKHRpbWVDb250ZXh0Lm9mZnNldCwgMCk7XG4gICAgLy9cbiAgICAvLyBFeGFtcGxlIDI6IEtlZXAgaW4gY29udGFpbmVyIHdoZW4gem9vbWVkIG91dFxuICAgIC8vIGlmICh0aW1lQ29udGV4dC5zdHJldGNoUmF0aW8gPCAxKcKge1xuICAgIC8vICAgY29uc3QgbWluT2Zmc2V0ID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KDApO1xuICAgIC8vICAgY29uc3QgbWF4T2Zmc2V0ID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHZpZXcud2lkdGggLSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aW1lQ29udGV4dC5kdXJhdGlvbikpO1xuICAgIC8vICAgdGltZUNvbnRleHQub2Zmc2V0ID0gTWF0aC5tYXgodGltZUNvbnRleHQub2Zmc2V0LCBtaW5PZmZzZXQpO1xuICAgIC8vICAgdGltZUNvbnRleHQub2Zmc2V0ID0gTWF0aC5taW4odGltZUNvbnRleHQub2Zmc2V0LCBtYXhPZmZzZXQpO1xuICAgIC8vIH1cblxuICAgIHRoaXMudGltZWxpbmUudHJhY2tzLnVwZGF0ZSgpO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHt9XG59XG4iLCJpbXBvcnQgQmFzZVN0YXRlIGZyb20gJy4vYmFzZS1zdGF0ZSc7XG5pbXBvcnQgVGltZUNvbnRleHRCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvdGltZS1jb250ZXh0LWJlaGF2aW9yJztcblxuXG4vKipcbiAqIEEgc3RhdGUgdG8gaW50ZXJhY3QgZGlyZWN0bHkgd2l0aCBsYXllcnMgdGltZSBjb250ZXh0cy5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZSwgc2VlLiBhZHZhbmNlZCB1c2FnZV0oLi9leGFtcGxlcy9sYXllci13YXZlZm9ybS5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZXh0RWRpdGlvblN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMubW91c2VEb3duID0gdHJ1ZTtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBlLnRhcmdldDtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5sYXllcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBjb25zdCBsYXllciA9IHRoaXMubGF5ZXJzW2ldO1xuICAgICAgaWYgKGxheWVyLmhhc0VsZW1lbnQoZS50YXJnZXQpKSB7XG4gICAgICAgIHRoaXMuY3VycmVudExheWVyID0gbGF5ZXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICBpZiAoIXRoaXMubW91c2VEb3duIHx8wqAhdGhpcy5jdXJyZW50TGF5ZXIpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBsYXllciA9IHRoaXMuY3VycmVudExheWVyO1xuICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuY3VycmVudFRhcmdldDtcblxuICAgIC8vIGluIHRoaXMgZXhhbXBsZSB0aGUgY29udGV4dCBpcyBzdHJldGNoZWQgd2hlbiBzaGlmdCBpcyBwcmVzc2VkXG4gICAgaWYgKCFlLm9yaWdpbmFsRXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgIGxheWVyLmVkaXRDb250ZXh0KGUuZHgsIGUuZHksIHRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxheWVyLnN0cmV0Y2hDb250ZXh0KGUuZHgsIGUuZHksIHRhcmdldCk7XG4gICAgfVxuXG4gICAgdGhpcy50aW1lbGluZS50cmFja3MudXBkYXRlKGxheWVyKTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudExheWVyID0gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuXG5cbi8qKlxuICogQSBzdGF0ZSB0byBlZGl0IHNoYXBlcyBpbiB0aGUgbW9yZSBnZW5lcmFsIHdheS4gSW50ZXJhY3Qgb25seSB3aXRoIHNlbGVjdGVkIHNoYXBlcy5cbiAqL1xuY2xhc3MgRWRpdGlvblN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG5cbiAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgfVxuXG4gIGVudGVyKCkge31cbiAgZXhpdCgpIHt9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gZS50YXJnZXQ7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgdGhpcy5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGNvbnN0IGl0ZW1zID0gbGF5ZXIuc2VsZWN0ZWRJdGVtcztcblxuICAgICAgbGF5ZXIuZWRpdChpdGVtcywgZS5keCwgZS5keSwgdGhpcy5jdXJyZW50VGFyZ2V0KTtcbiAgICAgIGxheWVyLnVwZGF0ZShpdGVtcyk7XG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge1xuICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbnVsbDtcbiAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEVkaXRpb25TdGF0ZTtcbiIsImltcG9ydCBCYXNlU3RhdGUgZnJvbSAnLi9iYXNlLXN0YXRlJztcbmltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5cblxuLyoqXG4gKiBBIHN0YXRlIHRvIHNlbGVjdCBzaGFwZXMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdGlvblN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUgLyosIG9wdGlvbnMgPSB7fSAqLykge1xuICAgIHN1cGVyKHRpbWVsaW5lIC8qLCBvcHRpb25zICovKTtcblxuICAgIHRoaXMuY3VycmVudExheWVyID0gbnVsbDtcbiAgICAvLyBuZWVkIGEgY2FjaGVkXG4gICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gbnVsbDtcbiAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICAgIHRoaXMuc2hpZnRLZXkgPSBmYWxzZTtcblxuICAgIHRoaXMuX2xheWVyU2VsZWN0ZWRJdGVtc01hcCA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIGVudGVyKCkge1xuXG4gIH1cblxuICBleGl0KCkge1xuICAgIGNvbnN0IGNvbnRhaW5lcnMgPSB0aGlzLnRpbWVsaW5lLmNvbnRhaW5lcnM7XG5cbiAgICBmb3IgKGxldCBpZCBpbiBjb250YWluZXJzKSB7XG4gICAgICB0aGlzLl9yZW1vdmVCcnVzaChjb250YWluZXJzW2lkXSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NsaWNrJzpcbiAgICAgICAgdGhpcy5vbkNsaWNrKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2tleWRvd24nOlxuICAgICAgICB0aGlzLm9uS2V5KGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2tleXVwJzpcbiAgICAgICAgdGhpcy5vbktleShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgX2FkZEJydXNoKHRyYWNrKSB7XG4gICAgaWYgKHRyYWNrLiRicnVzaCkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGJydXNoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncmVjdCcpO1xuICAgIGJydXNoLnN0eWxlLmZpbGwgPSAnIzY4Njg2OCc7XG4gICAgYnJ1c2guc3R5bGUub3BhY2l0eSA9IDAuMjtcblxuICAgIHRyYWNrLiRpbnRlcmFjdGlvbnMuYXBwZW5kQ2hpbGQoYnJ1c2gpO1xuICAgIHRyYWNrLiRicnVzaCA9IGJydXNoO1xuICB9XG5cbiAgX3JlbW92ZUJydXNoKHRyYWNrKSB7XG4gICAgaWYgKHRyYWNrLiRicnVzaCA9PT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgIHRoaXMuX3Jlc2V0QnJ1c2godHJhY2spO1xuICAgIHRyYWNrLiRpbnRlcmFjdGlvbnMucmVtb3ZlQ2hpbGQodHJhY2suJGJydXNoKTtcbiAgICBkZWxldGUgdHJhY2suJGJydXNoO1xuICB9XG5cbiAgX3Jlc2V0QnJ1c2godHJhY2spIHtcbiAgICBjb25zdCAkYnJ1c2ggPSB0cmFjay4kYnJ1c2g7XG4gICAgLy8gcmVzZXQgYnJ1c2ggZWxlbWVudFxuICAgICRicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCAwKScpO1xuICAgICRicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCAwKTtcbiAgICAkYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIDApO1xuICB9XG5cbiAgX3VwZGF0ZUJydXNoKGUsIHRyYWNrKSB7XG4gICAgY29uc3QgJGJydXNoID0gdHJhY2suJGJydXNoO1xuICAgIGNvbnN0IHRyYW5zbGF0ZSA9IGB0cmFuc2xhdGUoJHtlLmFyZWEubGVmdH0sICR7ZS5hcmVhLnRvcH0pYDtcblxuICAgICRicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlKTtcbiAgICAkYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgZS5hcmVhLndpZHRoKTtcbiAgICAkYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGUuYXJlYS5oZWlnaHQpO1xuICB9XG5cbiAgb25LZXkoZSkge1xuICAgIHRoaXMuc2hpZnRLZXkgPSBlLnNoaWZ0S2V5O1xuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMuX2N1cnJlbnRUcmFjayA9IHRoaXMudGltZWxpbmUuZ2V0VHJhY2tGcm9tRE9NRWxlbWVudChlLnRhcmdldCk7XG4gICAgaWYgKCF0aGlzLl9jdXJyZW50VHJhY2spIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl9hZGRCcnVzaCh0aGlzLl9jdXJyZW50VHJhY2spO1xuXG4gICAgLy8gcmVjcmVhdGUgdGhlIG1hcFxuICAgIHRoaXMuX2xheWVyU2VsZWN0ZWRJdGVtc01hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9jdXJyZW50VHJhY2subGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICB0aGlzLl9sYXllclNlbGVjdGVkSXRlbXNNYXAuc2V0KGxheWVyLCBsYXllci5zZWxlY3RlZEl0ZW1zLnNsaWNlKDApKTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICB0aGlzLl91cGRhdGVCcnVzaChlLCB0aGlzLl9jdXJyZW50VHJhY2spO1xuXG4gICAgdGhpcy5fY3VycmVudFRyYWNrLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgY29uc3QgY3VycmVudFNlbGVjdGlvbiA9IGxheWVyLnNlbGVjdGVkSXRlbXM7XG4gICAgICBjb25zdCBjdXJyZW50SXRlbXMgPSBsYXllci5nZXRJdGVtc0luQXJlYShlLmFyZWEpO1xuXG4gICAgICAvLyBpZiBpcyBub3QgcHJlc3NlZFxuICAgICAgaWYgKCFlLm9yaWdpbmFsRXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgbGF5ZXIudW5zZWxlY3QoY3VycmVudFNlbGVjdGlvbik7XG4gICAgICAgIGxheWVyLnNlbGVjdChjdXJyZW50SXRlbXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdG9TZWxlY3QgPSBbXTtcbiAgICAgICAgY29uc3QgdG9VbnNlbGVjdCA9IFtdO1xuICAgICAgICAvLyB1c2UgdGhlIHNlbGVjdGlvbiBmcm9tIHRoZSBwcmV2aW91cyBkcmFnXG4gICAgICAgIGNvbnN0IHByZXZpb3VzU2VsZWN0aW9uID0gdGhpcy5fbGF5ZXJTZWxlY3RlZEl0ZW1zTWFwLmdldChsYXllcik7XG4gICAgICAgIC8vIHRvVW5zZWxlY3QgPSB0b1Vuc2VsZWN0LmNvbmNhdChwcmV2aW91c1NlbGVjdGVkSXRlbXMpO1xuXG4gICAgICAgIGN1cnJlbnRJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgaWYgKHByZXZpb3VzU2VsZWN0aW9uLmluZGV4T2YoaXRlbSkgPT09IC0xKSB7XG4gICAgICAgICAgICB0b1NlbGVjdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b1Vuc2VsZWN0LnB1c2goaXRlbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjdXJyZW50U2VsZWN0aW9uLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBjdXJyZW50SXRlbXMuaW5kZXhPZihpdGVtKSA9PT0gLTEgJiZcbiAgICAgICAgICAgIHByZXZpb3VzU2VsZWN0aW9uLmluZGV4T2YoaXRlbSkgPT09IC0xXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0b1Vuc2VsZWN0LnB1c2goaXRlbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBsYXllci51bnNlbGVjdCh0b1Vuc2VsZWN0KTtcbiAgICAgICAgbGF5ZXIuc2VsZWN0KHRvU2VsZWN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgdGhpcy5fcmVtb3ZlQnJ1c2godGhpcy5fY3VycmVudFRyYWNrKTtcbiAgfVxuXG4gIG9uQ2xpY2soZSkge1xuICAgIGlmICghdGhpcy5fY3VycmVudFRyYWNrKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5fY3VycmVudFRyYWNrLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgbGV0IGl0ZW0gPSBsYXllci5nZXRJdGVtRnJvbURPTUVsZW1lbnQoZS50YXJnZXQpO1xuXG4gICAgICBpZiAoIWUub3JpZ2luYWxFdmVudC5zaGlmdEtleSkge1xuICAgICAgICBsYXllci51bnNlbGVjdCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbSkge1xuICAgICAgICBsYXllci50b2dnbGVTZWxlY3Rpb24oaXRlbSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlU3RhdGUgZnJvbSAnLi9iYXNlLXN0YXRlJztcblxuXG4vKipcbiAqIEEgc3RhdGUgdG8gc2VsZWN0IGFuZCBlZGl0IHNoYXBlcyBpbiBhIHNpbXBsZSB3YXkuIChraW5kIG9mIHBsdWcgbiBwbGF5IHN0YXRlKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaW1wbGVFZGl0aW9uU3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcblxuICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICB9XG5cbiAgZW50ZXIoKSB7fVxuICBleGl0KCkge31cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICAvLyBrZWVwIHRhcmdldCBjb25zaXN0ZW50IHdpdGggbW91c2UgZG93blxuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IGUudGFyZ2V0O1xuXG4gICAgdGhpcy5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGlmICghbGF5ZXIuaGFzRWxlbWVudCh0aGlzLmN1cnJlbnRUYXJnZXQpKSB7IHJldHVybjsgfVxuXG4gICAgICBpZiAoIWUub3JpZ2luYWxFdmVudC5zaGlmdEtleSkge1xuICAgICAgICBsYXllci51bnNlbGVjdCgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpdGVtID0gbGF5ZXIuZ2V0SXRlbUZyb21ET01FbGVtZW50KHRoaXMuY3VycmVudFRhcmdldCk7XG5cbiAgICAgIGlmIChpdGVtID09PSBudWxsKSB7IHJldHVybjsgfVxuXG4gICAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IGxheWVyO1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkgeyBsYXllci5zZWxlY3QoaXRlbSk7IH0pO1xuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIGlmICghdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBsYXllciA9IHRoaXMuY3VycmVudEVkaXRlZExheWVyO1xuICAgIGNvbnN0IGl0ZW1zID0gbGF5ZXIuc2VsZWN0ZWRJdGVtcztcblxuICAgIGxheWVyLmVkaXQoaXRlbXMsIGUuZHgsIGUuZHksIHRoaXMuY3VycmVudFRhcmdldCk7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkgeyBsYXllci51cGRhdGUoaXRlbXMpOyB9KTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIgPSBudWxsO1xuICB9XG59XG4iLCJcbi8qKlxuICogQWRkIGBzaWduYCB0byB0aGUgbGVmdCBvZiBhIGdpdmVuIGBpbnB1dGAgdW50aWwgaXQgbWF0Y2hlcyBtYXRjaCBgbGVuZ3RoYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCAtIFN0cmluZyB0byBmb3JtYXRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzaWduIC0gQ2hhcmFjdGVyIHRvIGFkZCB0byB0aGUgbGVmdFxuICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCAtIExlbmd0aCBvZiB0aGUgb3V0cHV0IHN0cmluZ1xuICovXG5leHBvcnQgY29uc3QgcGFkTGVmdCA9IChpbnB1dCwgc2lnbiwgbGVuZ3RoKSA9PiB7XG4gIGlucHV0ICs9ICcnOyAvLyBtYWtlIHN1cmUgd2UgZGVhbCB3aXRoIGEgc3RyaW5nXG5cbiAgd2hpbGUgKGlucHV0Lmxlbmd0aCA8IGxlbmd0aClcbiAgICBpbnB1dCA9IHNpZ24gKyBpbnB1dDtcblxuICByZXR1cm4gaW5wdXQ7XG59XG4iLCIvKipcbiAqIE9ydGhvZ29uYWxEYXRhIHRyYW5zZm9ybXMgYW4gb2JqZWN0IG9mIGFycmF5cyBge2ZvbzogWzEsIDJdLCBiYXI6IFszLCA0XX1gXG4gKiB0byBvciBmcm9tIGFuIGFycmF5IG9mIG9iamVjdHMgYFt7Zm9vOiAxLCBiYXI6IDN9LCB7Zm9vOiAyLCBiYXI6IDR9XWBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3J0aG9nb25hbERhdGEge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9jb2xzID0gbnVsbDsgLy8gT2JqZWN0IG9mIGFycmF5c1xuICAgIHRoaXMuX3Jvd3MgPSBudWxsOyAvLyBBcnJheSBvZiBvYmplY3RzXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgdGhlIGNvbnNpc3RlbmN5IG9mIHRoZSBkYXRhLlxuICAgKi9cbiAgX2NoZWNrQ29uc2lzdGVuY3koKSB7XG4gICAgbGV0IHNpemUgPSBudWxsO1xuXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuX2NvbHMpIHtcbiAgICAgIGNvbnN0IGNvbCA9IHRoaXMuX2NvbHNba2V5XTtcbiAgICAgIGNvbnN0IGNvbExlbmd0aCA9IGNvbC5sZW5ndGg7XG5cbiAgICAgIGlmIChzaXplICE9PSBudWxsICYmIHNpemUgIT09IGNvbExlbmd0aCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpcy5wcm90b3R5cGUuY29uc3RydWN0b3IubmFtZX06IGluY29uc2lzdGVudCBkYXRhYCk7XG4gICAgICB9IGVsc2UgaWYgKHNpemUgPT09IG51bGwpIHtcbiAgICAgICAgc2l6ZSA9IGNvbExlbmd0aDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBhcnJheSBvZiBvYmplY3RzIGZyb20gb2JqZWN0IG9mIGFycmF5cy5cbiAgICovXG4gIHVwZGF0ZUZyb21Db2xzKCkge1xuICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXModGhpcy5fY29scyk7XG5cbiAgICBrZXlzLmZvckVhY2goKGtleSwgaSkgPT4ge1xuICAgICAgY29uc3QgY29sID0gdGhpcy5fY29sc1trZXldO1xuXG4gICAgICBjb2wuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9yb3dzW2luZGV4XSA9PT0gdW5kZWZpbmVkKSB0aGlzLl9yb3dzW2luZGV4XSA9IHt9O1xuICAgICAgICB0aGlzLl9yb3dzW2luZGV4XVtrZXldID0gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2NoZWNrQ29uc2lzdGVuY3koKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIG9iamVjdCBvZiBhcnJheXMgZnJvbSBhcnJheSBvZiBvYmplY3RzLlxuICAgKi9cbiAgdXBkYXRlRnJvbVJvd3MoKSB7XG4gICAgdGhpcy5fcm93cy5mb3JFYWNoKChvYmosIGluZGV4KSA9PiB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkgdGhpcy5fY29sc1trZXldID0gW107XG4gICAgICAgIHRoaXMuX2NvbHNba2V5XS5wdXNoKG9ialtrZXldKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuX2NoZWNrQ29uc2lzdGVuY3koKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGFuIG9iamVjdCBvZiBhcnJheXMuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3Q8U3RyaW5nLCBBcnJheT59XG4gICAqL1xuICBzZXQgY29scyhvYmopIHtcbiAgICB0aGlzLl9jb2xzID0gb2JqO1xuICAgIHRoaXMuX3Jvd3MgPSBbXTtcblxuICAgIHRoaXMudXBkYXRlRnJvbUNvbHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIG9iamVjdCBvZiBhcnJheXMuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3Q8U3RyaW5nLCBBcnJheT59XG4gICAqL1xuICBnZXQgY29scygpIHtcbiAgICByZXR1cm4gdGhpcy5fY29scztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGFuIGFycmF5IG9mIG9iamVjdHMuXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheTxPYmplY3Q+fVxuICAgKi9cbiAgc2V0IHJvd3MoYXJyKSB7XG4gICAgdGhpcy5fcm93cyA9IGFycjtcbiAgICB0aGlzLl9jb2xzID0ge307XG5cbiAgICB0aGlzLnVwZGF0ZUZyb21Sb3dzKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBvYmplY3RzLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXk8T2JqZWN0Pn1cbiAgICovXG4gIGdldCByb3dzKCkge1xuICAgIHJldHVybiB0aGlzLl9yb3dzO1xuICB9XG59XG4iLCIvKipcbiAqIExpZ2h0d2VpZ2h0IHNjYWxlcyBtaW1pY2luZyB0aGUgYGQzLmpzYCBmdW5jdGlvbm5hbCBBUEkuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyoqXG4gICAqIEEgbGluZWFyIHNjYWxlIGludGVycG9sYXRpbmcgdmFsdWVzIGJldHdlZW4gYSBgZG9tYWluYCBhbmQgYSBgcmFuZ2VgLlxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICovXG4gIGxpbmVhcigpIHtcbiAgICBsZXQgX2RvbWFpbiA9IFswLCAxXTtcbiAgICBsZXQgX3JhbmdlID0gWzAsIDFdO1xuXG4gICAgbGV0IF9zbG9wZSA9IDE7XG4gICAgbGV0IF9pbnRlcmNlcHQgPSAwO1xuXG4gICAgZnVuY3Rpb24gX3VwZGF0ZUNvZWZzKCkge1xuICAgICAgX3Nsb3BlID0gKF9yYW5nZVsxXSAtIF9yYW5nZVswXSkgLyAoX2RvbWFpblsxXSAtIF9kb21haW5bMF0pO1xuICAgICAgX2ludGVyY2VwdCA9IF9yYW5nZVswXSAtIChfc2xvcGUgKiBfZG9tYWluWzBdKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2FsZSAodmFsdWUpIHtcbiAgICAgIHJldHVybiAoX3Nsb3BlICogdmFsdWUpICsgX2ludGVyY2VwdDtcbiAgICB9XG5cbiAgICBzY2FsZS5pbnZlcnQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuICh2YWx1ZSAtIF9pbnRlcmNlcHQpIC8gX3Nsb3BlO1xuICAgIH07XG5cbiAgICBzY2FsZS5kb21haW4gPSBmdW5jdGlvbihhcnIgPSBudWxsKSB7XG4gICAgICBpZiAoYXJyID09PSBudWxsKSB7IHJldHVybiBfZG9tYWluOyB9XG5cbiAgICAgIF9kb21haW4gPSBhcnI7XG4gICAgICBfdXBkYXRlQ29lZnMoKTtcblxuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH07XG5cbiAgICBzY2FsZS5yYW5nZSA9IGZ1bmN0aW9uKGFyciA9IG51bGwpIHtcbiAgICAgIGlmIChhcnIgPT09IG51bGwpIHsgcmV0dXJuIF9yYW5nZTsgfVxuXG4gICAgICBfcmFuZ2UgPSBhcnI7XG4gICAgICBfdXBkYXRlQ29lZnMoKTtcblxuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH07XG5cbiAgICByZXR1cm4gc2NhbGU7XG4gIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vYXJyYXkvZnJvbVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9nZXQtaXRlcmF0b3JcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vaXMtaXRlcmFibGVcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vbWFwXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9hc3NpZ25cIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2NyZWF0ZVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZGVmaW5lLXByb3BlcnR5XCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2dldC1wcm90b3R5cGUtb2ZcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2tleXNcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L3NldC1wcm90b3R5cGUtb2ZcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vc2V0XCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbFwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaXRlcmF0b3JcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9vYmplY3QvZGVmaW5lLXByb3BlcnR5XCIpO1xuXG52YXIgX2RlZmluZVByb3BlcnR5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlZmluZVByb3BlcnR5KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgICgwLCBfZGVmaW5lUHJvcGVydHkyLmRlZmF1bHQpKHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gIH07XG59KCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZlwiKTtcblxudmFyIF9nZXRQcm90b3R5cGVPZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRQcm90b3R5cGVPZik7XG5cbnZhciBfZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L2dldC1vd24tcHJvcGVydHktZGVzY3JpcHRvclwiKTtcblxudmFyIF9nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gZ2V0KG9iamVjdCwgcHJvcGVydHksIHJlY2VpdmVyKSB7XG4gIGlmIChvYmplY3QgPT09IG51bGwpIG9iamVjdCA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbiAgdmFyIGRlc2MgPSAoMCwgX2dldE93blByb3BlcnR5RGVzY3JpcHRvcjIuZGVmYXVsdCkob2JqZWN0LCBwcm9wZXJ0eSk7XG5cbiAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkge1xuICAgIHZhciBwYXJlbnQgPSAoMCwgX2dldFByb3RvdHlwZU9mMi5kZWZhdWx0KShvYmplY3QpO1xuXG4gICAgaWYgKHBhcmVudCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGdldChwYXJlbnQsIHByb3BlcnR5LCByZWNlaXZlcik7XG4gICAgfVxuICB9IGVsc2UgaWYgKFwidmFsdWVcIiBpbiBkZXNjKSB7XG4gICAgcmV0dXJuIGRlc2MudmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGdldHRlciA9IGRlc2MuZ2V0O1xuXG4gICAgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfc2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9vYmplY3Qvc2V0LXByb3RvdHlwZS1vZlwiKTtcblxudmFyIF9zZXRQcm90b3R5cGVPZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zZXRQcm90b3R5cGVPZik7XG5cbnZhciBfY3JlYXRlID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L2NyZWF0ZVwiKTtcblxudmFyIF9jcmVhdGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlKTtcblxudmFyIF90eXBlb2YyID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvdHlwZW9mXCIpO1xuXG52YXIgX3R5cGVvZjMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90eXBlb2YyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArICh0eXBlb2Ygc3VwZXJDbGFzcyA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiAoMCwgX3R5cGVvZjMuZGVmYXVsdCkoc3VwZXJDbGFzcykpKTtcbiAgfVxuXG4gIHN1YkNsYXNzLnByb3RvdHlwZSA9ICgwLCBfY3JlYXRlMi5kZWZhdWx0KShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xuICBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mMi5kZWZhdWx0ID8gKDAsIF9zZXRQcm90b3R5cGVPZjIuZGVmYXVsdCkoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzcztcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfdHlwZW9mMiA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzL3R5cGVvZlwiKTtcblxudmFyIF90eXBlb2YzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdHlwZW9mMik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChzZWxmLCBjYWxsKSB7XG4gIGlmICghc2VsZikge1xuICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtcbiAgfVxuXG4gIHJldHVybiBjYWxsICYmICgodHlwZW9mIGNhbGwgPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogKDAsIF90eXBlb2YzLmRlZmF1bHQpKGNhbGwpKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9pc0l0ZXJhYmxlMiA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL2lzLWl0ZXJhYmxlXCIpO1xuXG52YXIgX2lzSXRlcmFibGUzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNJdGVyYWJsZTIpO1xuXG52YXIgX2dldEl0ZXJhdG9yMiA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL2dldC1pdGVyYXRvclwiKTtcblxudmFyIF9nZXRJdGVyYXRvcjMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRJdGVyYXRvcjIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIHNsaWNlSXRlcmF0b3IoYXJyLCBpKSB7XG4gICAgdmFyIF9hcnIgPSBbXTtcbiAgICB2YXIgX24gPSB0cnVlO1xuICAgIHZhciBfZCA9IGZhbHNlO1xuICAgIHZhciBfZSA9IHVuZGVmaW5lZDtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfaSA9ICgwLCBfZ2V0SXRlcmF0b3IzLmRlZmF1bHQpKGFyciksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7XG4gICAgICAgIF9hcnIucHVzaChfcy52YWx1ZSk7XG5cbiAgICAgICAgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgX2QgPSB0cnVlO1xuICAgICAgX2UgPSBlcnI7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICghX24gJiYgX2lbXCJyZXR1cm5cIl0pIF9pW1wicmV0dXJuXCJdKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoX2QpIHRocm93IF9lO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBfYXJyO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChhcnIsIGkpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgICByZXR1cm4gYXJyO1xuICAgIH0gZWxzZSBpZiAoKDAsIF9pc0l0ZXJhYmxlMy5kZWZhdWx0KShPYmplY3QoYXJyKSkpIHtcbiAgICAgIHJldHVybiBzbGljZUl0ZXJhdG9yKGFyciwgaSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpO1xuICAgIH1cbiAgfTtcbn0oKTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9mcm9tID0gcmVxdWlyZShcIi4uL2NvcmUtanMvYXJyYXkvZnJvbVwiKTtcblxudmFyIF9mcm9tMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Zyb20pO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcnIyW2ldID0gYXJyW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBhcnIyO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAoMCwgX2Zyb20yLmRlZmF1bHQpKGFycik7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfaXRlcmF0b3IgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9zeW1ib2wvaXRlcmF0b3JcIik7XG5cbnZhciBfaXRlcmF0b3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXRlcmF0b3IpO1xuXG52YXIgX3N5bWJvbCA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL3N5bWJvbFwiKTtcblxudmFyIF9zeW1ib2wyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3ltYm9sKTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgX3N5bWJvbDIuZGVmYXVsdCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBfaXRlcmF0b3IyLmRlZmF1bHQgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBfc3ltYm9sMi5kZWZhdWx0ID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBfc3ltYm9sMi5kZWZhdWx0ICYmIG9iaiAhPT0gX3N5bWJvbDIuZGVmYXVsdC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gdHlwZW9mIF9zeW1ib2wyLmRlZmF1bHQgPT09IFwiZnVuY3Rpb25cIiAmJiBfdHlwZW9mKF9pdGVyYXRvcjIuZGVmYXVsdCkgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2Yob2JqKTtcbn0gOiBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogJiYgdHlwZW9mIF9zeW1ib2wyLmRlZmF1bHQgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IF9zeW1ib2wyLmRlZmF1bHQgJiYgb2JqICE9PSBfc3ltYm9sMi5kZWZhdWx0LnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2Yob2JqKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVnZW5lcmF0b3ItcnVudGltZVwiKTtcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuYXJyYXkuZnJvbScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuQXJyYXkuZnJvbTtcbiIsInJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3InKTtcbiIsInJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvY29yZS5pcy1pdGVyYWJsZScpO1xuIiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm1hcCcpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcubWFwLnRvLWpzb24nKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM3Lm1hcC5vZicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcubWFwLmZyb20nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9fY29yZScpLk1hcDtcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdC5hc3NpZ247XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuY3JlYXRlJyk7XG52YXIgJE9iamVjdCA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3Q7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZShQLCBEKSB7XG4gIHJldHVybiAkT2JqZWN0LmNyZWF0ZShQLCBEKTtcbn07XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuZGVmaW5lLXByb3BlcnR5Jyk7XG52YXIgJE9iamVjdCA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3Q7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGl0LCBrZXksIGRlc2MpIHtcbiAgcmV0dXJuICRPYmplY3QuZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgZGVzYyk7XG59O1xuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcicpO1xudmFyICRPYmplY3QgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSkge1xuICByZXR1cm4gJE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSk7XG59O1xuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmdldC1wcm90b3R5cGUtb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5rZXlzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3Qua2V5cztcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3Quc2V0UHJvdG90eXBlT2Y7XG4iLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc2V0Jyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5zZXQudG8tanNvbicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcuc2V0Lm9mJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5zZXQuZnJvbScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL19jb3JlJykuU2V0O1xuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3ltYm9sJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNy5zeW1ib2wuYXN5bmMtaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM3LnN5bWJvbC5vYnNlcnZhYmxlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5TeW1ib2w7XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL193a3MtZXh0JykuZignaXRlcmF0b3InKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICh0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJykgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIENvbnN0cnVjdG9yLCBuYW1lLCBmb3JiaWRkZW5GaWVsZCkge1xuICBpZiAoIShpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSB8fCAoZm9yYmlkZGVuRmllbGQgIT09IHVuZGVmaW5lZCAmJiBmb3JiaWRkZW5GaWVsZCBpbiBpdCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IobmFtZSArICc6IGluY29ycmVjdCBpbnZvY2F0aW9uIScpO1xuICB9IHJldHVybiBpdDtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCJ2YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlciwgSVRFUkFUT1IpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3JPZihpdGVyLCBmYWxzZSwgcmVzdWx0LnB1c2gsIHJlc3VsdCwgSVRFUkFUT1IpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi9fdG8tYWJzb2x1dGUtaW5kZXgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKElTX0lOQ0xVREVTKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGVsLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgTyA9IHRvSU9iamVjdCgkdGhpcyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpO1xuICAgIHZhciB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIGlmIChJU19JTkNMVURFUyAmJiBlbCAhPSBlbCkgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSB7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgICBpZiAodmFsdWUgIT0gdmFsdWUpIHJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I2luZGV4T2YgaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKSB7XG4gICAgICBpZiAoT1tpbmRleF0gPT09IGVsKSByZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59O1xuIiwiLy8gMCAtPiBBcnJheSNmb3JFYWNoXG4vLyAxIC0+IEFycmF5I21hcFxuLy8gMiAtPiBBcnJheSNmaWx0ZXJcbi8vIDMgLT4gQXJyYXkjc29tZVxuLy8gNCAtPiBBcnJheSNldmVyeVxuLy8gNSAtPiBBcnJheSNmaW5kXG4vLyA2IC0+IEFycmF5I2ZpbmRJbmRleFxudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGFzYyA9IHJlcXVpcmUoJy4vX2FycmF5LXNwZWNpZXMtY3JlYXRlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChUWVBFLCAkY3JlYXRlKSB7XG4gIHZhciBJU19NQVAgPSBUWVBFID09IDE7XG4gIHZhciBJU19GSUxURVIgPSBUWVBFID09IDI7XG4gIHZhciBJU19TT01FID0gVFlQRSA9PSAzO1xuICB2YXIgSVNfRVZFUlkgPSBUWVBFID09IDQ7XG4gIHZhciBJU19GSU5EX0lOREVYID0gVFlQRSA9PSA2O1xuICB2YXIgTk9fSE9MRVMgPSBUWVBFID09IDUgfHwgSVNfRklORF9JTkRFWDtcbiAgdmFyIGNyZWF0ZSA9ICRjcmVhdGUgfHwgYXNjO1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBjYWxsYmFja2ZuLCB0aGF0KSB7XG4gICAgdmFyIE8gPSB0b09iamVjdCgkdGhpcyk7XG4gICAgdmFyIHNlbGYgPSBJT2JqZWN0KE8pO1xuICAgIHZhciBmID0gY3R4KGNhbGxiYWNrZm4sIHRoYXQsIDMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChzZWxmLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgcmVzdWx0ID0gSVNfTUFQID8gY3JlYXRlKCR0aGlzLCBsZW5ndGgpIDogSVNfRklMVEVSID8gY3JlYXRlKCR0aGlzLCAwKSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgdmFsLCByZXM7XG4gICAgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChOT19IT0xFUyB8fCBpbmRleCBpbiBzZWxmKSB7XG4gICAgICB2YWwgPSBzZWxmW2luZGV4XTtcbiAgICAgIHJlcyA9IGYodmFsLCBpbmRleCwgTyk7XG4gICAgICBpZiAoVFlQRSkge1xuICAgICAgICBpZiAoSVNfTUFQKSByZXN1bHRbaW5kZXhdID0gcmVzOyAgIC8vIG1hcFxuICAgICAgICBlbHNlIGlmIChyZXMpIHN3aXRjaCAoVFlQRSkge1xuICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgIC8vIHNvbWVcbiAgICAgICAgICBjYXNlIDU6IHJldHVybiB2YWw7ICAgICAgICAgICAgICAvLyBmaW5kXG4gICAgICAgICAgY2FzZSA2OiByZXR1cm4gaW5kZXg7ICAgICAgICAgICAgLy8gZmluZEluZGV4XG4gICAgICAgICAgY2FzZSAyOiByZXN1bHQucHVzaCh2YWwpOyAgICAgICAgLy8gZmlsdGVyXG4gICAgICAgIH0gZWxzZSBpZiAoSVNfRVZFUlkpIHJldHVybiBmYWxzZTsgLy8gZXZlcnlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIElTX0ZJTkRfSU5ERVggPyAtMSA6IElTX1NPTUUgfHwgSVNfRVZFUlkgPyBJU19FVkVSWSA6IHJlc3VsdDtcbiAgfTtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9faXMtYXJyYXknKTtcbnZhciBTUEVDSUVTID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3JpZ2luYWwpIHtcbiAgdmFyIEM7XG4gIGlmIChpc0FycmF5KG9yaWdpbmFsKSkge1xuICAgIEMgPSBvcmlnaW5hbC5jb25zdHJ1Y3RvcjtcbiAgICAvLyBjcm9zcy1yZWFsbSBmYWxsYmFja1xuICAgIGlmICh0eXBlb2YgQyA9PSAnZnVuY3Rpb24nICYmIChDID09PSBBcnJheSB8fCBpc0FycmF5KEMucHJvdG90eXBlKSkpIEMgPSB1bmRlZmluZWQ7XG4gICAgaWYgKGlzT2JqZWN0KEMpKSB7XG4gICAgICBDID0gQ1tTUEVDSUVTXTtcbiAgICAgIGlmIChDID09PSBudWxsKSBDID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSByZXR1cm4gQyA9PT0gdW5kZWZpbmVkID8gQXJyYXkgOiBDO1xufTtcbiIsIi8vIDkuNC4yLjMgQXJyYXlTcGVjaWVzQ3JlYXRlKG9yaWdpbmFsQXJyYXksIGxlbmd0aClcbnZhciBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9yaWdpbmFsLCBsZW5ndGgpIHtcbiAgcmV0dXJuIG5ldyAoc3BlY2llc0NvbnN0cnVjdG9yKG9yaWdpbmFsKSkobGVuZ3RoKTtcbn07XG4iLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuLy8gRVMzIHdyb25nIGhlcmVcbnZhciBBUkcgPSBjb2YoZnVuY3Rpb24gKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBTY3JpcHQgQWNjZXNzIERlbmllZCBlcnJvclxudmFyIHRyeUdldCA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gdHJ5R2V0KE8gPSBPYmplY3QoaXQpLCBUQUcpKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKTtcbnZhciByZWRlZmluZUFsbCA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGFuSW5zdGFuY2UgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpO1xudmFyIGZvck9mID0gcmVxdWlyZSgnLi9fZm9yLW9mJyk7XG52YXIgJGl0ZXJEZWZpbmUgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpO1xudmFyIHN0ZXAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKTtcbnZhciBzZXRTcGVjaWVzID0gcmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgZmFzdEtleSA9IHJlcXVpcmUoJy4vX21ldGEnKS5mYXN0S2V5O1xudmFyIHZhbGlkYXRlID0gcmVxdWlyZSgnLi9fdmFsaWRhdGUtY29sbGVjdGlvbicpO1xudmFyIFNJWkUgPSBERVNDUklQVE9SUyA/ICdfcycgOiAnc2l6ZSc7XG5cbnZhciBnZXRFbnRyeSA9IGZ1bmN0aW9uICh0aGF0LCBrZXkpIHtcbiAgLy8gZmFzdCBjYXNlXG4gIHZhciBpbmRleCA9IGZhc3RLZXkoa2V5KTtcbiAgdmFyIGVudHJ5O1xuICBpZiAoaW5kZXggIT09ICdGJykgcmV0dXJuIHRoYXQuX2lbaW5kZXhdO1xuICAvLyBmcm96ZW4gb2JqZWN0IGNhc2VcbiAgZm9yIChlbnRyeSA9IHRoYXQuX2Y7IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pIHtcbiAgICBpZiAoZW50cnkuayA9PSBrZXkpIHJldHVybiBlbnRyeTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbiAod3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUikge1xuICAgIHZhciBDID0gd3JhcHBlcihmdW5jdGlvbiAodGhhdCwgaXRlcmFibGUpIHtcbiAgICAgIGFuSW5zdGFuY2UodGhhdCwgQywgTkFNRSwgJ19pJyk7XG4gICAgICB0aGF0Ll90ID0gTkFNRTsgICAgICAgICAvLyBjb2xsZWN0aW9uIHR5cGVcbiAgICAgIHRoYXQuX2kgPSBjcmVhdGUobnVsbCk7IC8vIGluZGV4XG4gICAgICB0aGF0Ll9mID0gdW5kZWZpbmVkOyAgICAvLyBmaXJzdCBlbnRyeVxuICAgICAgdGhhdC5fbCA9IHVuZGVmaW5lZDsgICAgLy8gbGFzdCBlbnRyeVxuICAgICAgdGhhdFtTSVpFXSA9IDA7ICAgICAgICAgLy8gc2l6ZVxuICAgICAgaWYgKGl0ZXJhYmxlICE9IHVuZGVmaW5lZCkgZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xuICAgIH0pO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCB7XG4gICAgICAvLyAyMy4xLjMuMSBNYXAucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIC8vIDIzLjIuMy4yIFNldC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgICBmb3IgKHZhciB0aGF0ID0gdmFsaWRhdGUodGhpcywgTkFNRSksIGRhdGEgPSB0aGF0Ll9pLCBlbnRyeSA9IHRoYXQuX2Y7IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pIHtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoZW50cnkucCkgZW50cnkucCA9IGVudHJ5LnAubiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBkZWxldGUgZGF0YVtlbnRyeS5pXTtcbiAgICAgICAgfVxuICAgICAgICB0aGF0Ll9mID0gdGhhdC5fbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhhdFtTSVpFXSA9IDA7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjMgTWFwLnByb3RvdHlwZS5kZWxldGUoa2V5KVxuICAgICAgLy8gMjMuMi4zLjQgU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXG4gICAgICAnZGVsZXRlJzogZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgdGhhdCA9IHZhbGlkYXRlKHRoaXMsIE5BTUUpO1xuICAgICAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpO1xuICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICB2YXIgbmV4dCA9IGVudHJ5Lm47XG4gICAgICAgICAgdmFyIHByZXYgPSBlbnRyeS5wO1xuICAgICAgICAgIGRlbGV0ZSB0aGF0Ll9pW2VudHJ5LmldO1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmIChwcmV2KSBwcmV2Lm4gPSBuZXh0O1xuICAgICAgICAgIGlmIChuZXh0KSBuZXh0LnAgPSBwcmV2O1xuICAgICAgICAgIGlmICh0aGF0Ll9mID09IGVudHJ5KSB0aGF0Ll9mID0gbmV4dDtcbiAgICAgICAgICBpZiAodGhhdC5fbCA9PSBlbnRyeSkgdGhhdC5fbCA9IHByZXY7XG4gICAgICAgICAgdGhhdFtTSVpFXS0tO1xuICAgICAgICB9IHJldHVybiAhIWVudHJ5O1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjIuMy42IFNldC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgLy8gMjMuMS4zLjUgTWFwLnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICBmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrZm4gLyogLCB0aGF0ID0gdW5kZWZpbmVkICovKSB7XG4gICAgICAgIHZhbGlkYXRlKHRoaXMsIE5BTUUpO1xuICAgICAgICB2YXIgZiA9IGN0eChjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgMyk7XG4gICAgICAgIHZhciBlbnRyeTtcbiAgICAgICAgd2hpbGUgKGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhpcy5fZikge1xuICAgICAgICAgIGYoZW50cnkudiwgZW50cnkuaywgdGhpcyk7XG4gICAgICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICAgICAgd2hpbGUgKGVudHJ5ICYmIGVudHJ5LnIpIGVudHJ5ID0gZW50cnkucDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy43IE1hcC5wcm90b3R5cGUuaGFzKGtleSlcbiAgICAgIC8vIDIzLjIuMy43IFNldC5wcm90b3R5cGUuaGFzKHZhbHVlKVxuICAgICAgaGFzOiBmdW5jdGlvbiBoYXMoa2V5KSB7XG4gICAgICAgIHJldHVybiAhIWdldEVudHJ5KHZhbGlkYXRlKHRoaXMsIE5BTUUpLCBrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChERVNDUklQVE9SUykgZFAoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZSh0aGlzLCBOQU1FKVtTSVpFXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQztcbiAgfSxcbiAgZGVmOiBmdW5jdGlvbiAodGhhdCwga2V5LCB2YWx1ZSkge1xuICAgIHZhciBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSk7XG4gICAgdmFyIHByZXYsIGluZGV4O1xuICAgIC8vIGNoYW5nZSBleGlzdGluZyBlbnRyeVxuICAgIGlmIChlbnRyeSkge1xuICAgICAgZW50cnkudiA9IHZhbHVlO1xuICAgIC8vIGNyZWF0ZSBuZXcgZW50cnlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhhdC5fbCA9IGVudHJ5ID0ge1xuICAgICAgICBpOiBpbmRleCA9IGZhc3RLZXkoa2V5LCB0cnVlKSwgLy8gPC0gaW5kZXhcbiAgICAgICAgazoga2V5LCAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGtleVxuICAgICAgICB2OiB2YWx1ZSwgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcbiAgICAgICAgcDogcHJldiA9IHRoYXQuX2wsICAgICAgICAgICAgIC8vIDwtIHByZXZpb3VzIGVudHJ5XG4gICAgICAgIG46IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAvLyA8LSBuZXh0IGVudHJ5XG4gICAgICAgIHI6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSByZW1vdmVkXG4gICAgICB9O1xuICAgICAgaWYgKCF0aGF0Ll9mKSB0aGF0Ll9mID0gZW50cnk7XG4gICAgICBpZiAocHJldikgcHJldi5uID0gZW50cnk7XG4gICAgICB0aGF0W1NJWkVdKys7XG4gICAgICAvLyBhZGQgdG8gaW5kZXhcbiAgICAgIGlmIChpbmRleCAhPT0gJ0YnKSB0aGF0Ll9pW2luZGV4XSA9IGVudHJ5O1xuICAgIH0gcmV0dXJuIHRoYXQ7XG4gIH0sXG4gIGdldEVudHJ5OiBnZXRFbnRyeSxcbiAgc2V0U3Ryb25nOiBmdW5jdGlvbiAoQywgTkFNRSwgSVNfTUFQKSB7XG4gICAgLy8gYWRkIC5rZXlzLCAudmFsdWVzLCAuZW50cmllcywgW0BAaXRlcmF0b3JdXG4gICAgLy8gMjMuMS4zLjQsIDIzLjEuMy44LCAyMy4xLjMuMTEsIDIzLjEuMy4xMiwgMjMuMi4zLjUsIDIzLjIuMy44LCAyMy4yLjMuMTAsIDIzLjIuMy4xMVxuICAgICRpdGVyRGVmaW5lKEMsIE5BTUUsIGZ1bmN0aW9uIChpdGVyYXRlZCwga2luZCkge1xuICAgICAgdGhpcy5fdCA9IHZhbGlkYXRlKGl0ZXJhdGVkLCBOQU1FKTsgLy8gdGFyZ2V0XG4gICAgICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgICAgICAvLyBraW5kXG4gICAgICB0aGlzLl9sID0gdW5kZWZpbmVkOyAgICAgICAgICAgICAgICAvLyBwcmV2aW91c1xuICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgIHZhciBraW5kID0gdGhhdC5faztcbiAgICAgIHZhciBlbnRyeSA9IHRoYXQuX2w7XG4gICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgIHdoaWxlIChlbnRyeSAmJiBlbnRyeS5yKSBlbnRyeSA9IGVudHJ5LnA7XG4gICAgICAvLyBnZXQgbmV4dCBlbnRyeVxuICAgICAgaWYgKCF0aGF0Ll90IHx8ICEodGhhdC5fbCA9IGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhhdC5fdC5fZikpIHtcbiAgICAgICAgLy8gb3IgZmluaXNoIHRoZSBpdGVyYXRpb25cbiAgICAgICAgdGhhdC5fdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHN0ZXAoMSk7XG4gICAgICB9XG4gICAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXG4gICAgICBpZiAoa2luZCA9PSAna2V5cycpIHJldHVybiBzdGVwKDAsIGVudHJ5LmspO1xuICAgICAgaWYgKGtpbmQgPT0gJ3ZhbHVlcycpIHJldHVybiBzdGVwKDAsIGVudHJ5LnYpO1xuICAgICAgcmV0dXJuIHN0ZXAoMCwgW2VudHJ5LmssIGVudHJ5LnZdKTtcbiAgICB9LCBJU19NQVAgPyAnZW50cmllcycgOiAndmFsdWVzJywgIUlTX01BUCwgdHJ1ZSk7XG5cbiAgICAvLyBhZGQgW0BAc3BlY2llc10sIDIzLjEuMi4yLCAyMy4yLjIuMlxuICAgIHNldFNwZWNpZXMoTkFNRSk7XG4gIH1cbn07XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciBmcm9tID0gcmVxdWlyZSgnLi9fYXJyYXktZnJvbS1pdGVyYWJsZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTkFNRSkge1xuICByZXR1cm4gZnVuY3Rpb24gdG9KU09OKCkge1xuICAgIGlmIChjbGFzc29mKHRoaXMpICE9IE5BTUUpIHRocm93IFR5cGVFcnJvcihOQU1FICsgXCIjdG9KU09OIGlzbid0IGdlbmVyaWNcIik7XG4gICAgcmV0dXJuIGZyb20odGhpcyk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBtZXRhID0gcmVxdWlyZSgnLi9fbWV0YScpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIHJlZGVmaW5lQWxsID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJyk7XG52YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcbnZhciBhbkluc3RhbmNlID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgZWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5LW1ldGhvZHMnKSgwKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE5BTUUsIHdyYXBwZXIsIG1ldGhvZHMsIGNvbW1vbiwgSVNfTUFQLCBJU19XRUFLKSB7XG4gIHZhciBCYXNlID0gZ2xvYmFsW05BTUVdO1xuICB2YXIgQyA9IEJhc2U7XG4gIHZhciBBRERFUiA9IElTX01BUCA/ICdzZXQnIDogJ2FkZCc7XG4gIHZhciBwcm90byA9IEMgJiYgQy5wcm90b3R5cGU7XG4gIHZhciBPID0ge307XG4gIGlmICghREVTQ1JJUFRPUlMgfHwgdHlwZW9mIEMgIT0gJ2Z1bmN0aW9uJyB8fCAhKElTX1dFQUsgfHwgcHJvdG8uZm9yRWFjaCAmJiAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIG5ldyBDKCkuZW50cmllcygpLm5leHQoKTtcbiAgfSkpKSB7XG4gICAgLy8gY3JlYXRlIGNvbGxlY3Rpb24gY29uc3RydWN0b3JcbiAgICBDID0gY29tbW9uLmdldENvbnN0cnVjdG9yKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCBtZXRob2RzKTtcbiAgICBtZXRhLk5FRUQgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIEMgPSB3cmFwcGVyKGZ1bmN0aW9uICh0YXJnZXQsIGl0ZXJhYmxlKSB7XG4gICAgICBhbkluc3RhbmNlKHRhcmdldCwgQywgTkFNRSwgJ19jJyk7XG4gICAgICB0YXJnZXQuX2MgPSBuZXcgQmFzZSgpO1xuICAgICAgaWYgKGl0ZXJhYmxlICE9IHVuZGVmaW5lZCkgZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGFyZ2V0W0FEREVSXSwgdGFyZ2V0KTtcbiAgICB9KTtcbiAgICBlYWNoKCdhZGQsY2xlYXIsZGVsZXRlLGZvckVhY2gsZ2V0LGhhcyxzZXQsa2V5cyx2YWx1ZXMsZW50cmllcyx0b0pTT04nLnNwbGl0KCcsJyksIGZ1bmN0aW9uIChLRVkpIHtcbiAgICAgIHZhciBJU19BRERFUiA9IEtFWSA9PSAnYWRkJyB8fCBLRVkgPT0gJ3NldCc7XG4gICAgICBpZiAoS0VZIGluIHByb3RvICYmICEoSVNfV0VBSyAmJiBLRVkgPT0gJ2NsZWFyJykpIGhpZGUoQy5wcm90b3R5cGUsIEtFWSwgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgYW5JbnN0YW5jZSh0aGlzLCBDLCBLRVkpO1xuICAgICAgICBpZiAoIUlTX0FEREVSICYmIElTX1dFQUsgJiYgIWlzT2JqZWN0KGEpKSByZXR1cm4gS0VZID09ICdnZXQnID8gdW5kZWZpbmVkIDogZmFsc2U7XG4gICAgICAgIHZhciByZXN1bHQgPSB0aGlzLl9jW0tFWV0oYSA9PT0gMCA/IDAgOiBhLCBiKTtcbiAgICAgICAgcmV0dXJuIElTX0FEREVSID8gdGhpcyA6IHJlc3VsdDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIElTX1dFQUsgfHwgZFAoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jLnNpemU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZXRUb1N0cmluZ1RhZyhDLCBOQU1FKTtcblxuICBPW05BTUVdID0gQztcbiAgJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYsIE8pO1xuXG4gIGlmICghSVNfV0VBSykgY29tbW9uLnNldFN0cm9uZyhDLCBOQU1FLCBJU19NQVApO1xuXG4gIHJldHVybiBDO1xufTtcbiIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7IHZlcnNpb246ICcyLjUuMScgfTtcbmlmICh0eXBlb2YgX19lID09ICdudW1iZXInKSBfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBpbmRleCwgdmFsdWUpIHtcbiAgaWYgKGluZGV4IGluIG9iamVjdCkgJGRlZmluZVByb3BlcnR5LmYob2JqZWN0LCBpbmRleCwgY3JlYXRlRGVzYygwLCB2YWx1ZSkpO1xuICBlbHNlIG9iamVjdFtpbmRleF0gPSB2YWx1ZTtcbn07XG4iLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbiwgdGhhdCwgbGVuZ3RoKSB7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmICh0aGF0ID09PSB1bmRlZmluZWQpIHJldHVybiBmbjtcbiAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKC8qIC4uLmFyZ3MgKi8pIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ID09IHVuZGVmaW5lZCkgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xuLy8gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCcgaW4gb2xkIElFXG52YXIgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTtcbiIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpO1xuIiwiLy8gYWxsIGVudW1lcmFibGUgb2JqZWN0IGtleXMsIGluY2x1ZGVzIHN5bWJvbHNcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciBnT1BTID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKTtcbnZhciBwSUUgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgcmVzdWx0ID0gZ2V0S2V5cyhpdCk7XG4gIHZhciBnZXRTeW1ib2xzID0gZ09QUy5mO1xuICBpZiAoZ2V0U3ltYm9scykge1xuICAgIHZhciBzeW1ib2xzID0gZ2V0U3ltYm9scyhpdCk7XG4gICAgdmFyIGlzRW51bSA9IHBJRS5mO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIga2V5O1xuICAgIHdoaWxlIChzeW1ib2xzLmxlbmd0aCA+IGkpIGlmIChpc0VudW0uY2FsbChpdCwga2V5ID0gc3ltYm9sc1tpKytdKSkgcmVzdWx0LnB1c2goa2V5KTtcbiAgfSByZXR1cm4gcmVzdWx0O1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24gKHR5cGUsIG5hbWUsIHNvdXJjZSkge1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRjtcbiAgdmFyIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0Lkc7XG4gIHZhciBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TO1xuICB2YXIgSVNfUFJPVE8gPSB0eXBlICYgJGV4cG9ydC5QO1xuICB2YXIgSVNfQklORCA9IHR5cGUgJiAkZXhwb3J0LkI7XG4gIHZhciBJU19XUkFQID0gdHlwZSAmICRleHBvcnQuVztcbiAgdmFyIGV4cG9ydHMgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KTtcbiAgdmFyIGV4cFByb3RvID0gZXhwb3J0c1tQUk9UT1RZUEVdO1xuICB2YXIgdGFyZ2V0ID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXTtcbiAgdmFyIGtleSwgb3duLCBvdXQ7XG4gIGlmIChJU19HTE9CQUwpIHNvdXJjZSA9IG5hbWU7XG4gIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgaWYgKG93biAmJiBrZXkgaW4gZXhwb3J0cykgY29udGludWU7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSBvd24gPyB0YXJnZXRba2V5XSA6IHNvdXJjZVtrZXldO1xuICAgIC8vIHByZXZlbnQgZ2xvYmFsIHBvbGx1dGlvbiBmb3IgbmFtZXNwYWNlc1xuICAgIGV4cG9ydHNba2V5XSA9IElTX0dMT0JBTCAmJiB0eXBlb2YgdGFyZ2V0W2tleV0gIT0gJ2Z1bmN0aW9uJyA/IHNvdXJjZVtrZXldXG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICA6IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKVxuICAgIC8vIHdyYXAgZ2xvYmFsIGNvbnN0cnVjdG9ycyBmb3IgcHJldmVudCBjaGFuZ2UgdGhlbSBpbiBsaWJyYXJ5XG4gICAgOiBJU19XUkFQICYmIHRhcmdldFtrZXldID09IG91dCA/IChmdW5jdGlvbiAoQykge1xuICAgICAgdmFyIEYgPSBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIEMpIHtcbiAgICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIG5ldyBDKCk7XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBuZXcgQyhhKTtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBDKGEsIGIpO1xuICAgICAgICAgIH0gcmV0dXJuIG5ldyBDKGEsIGIsIGMpO1xuICAgICAgICB9IHJldHVybiBDLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgRltQUk9UT1RZUEVdID0gQ1tQUk9UT1RZUEVdO1xuICAgICAgcmV0dXJuIEY7XG4gICAgLy8gbWFrZSBzdGF0aWMgdmVyc2lvbnMgZm9yIHByb3RvdHlwZSBtZXRob2RzXG4gICAgfSkob3V0KSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5tZXRob2RzLiVOQU1FJVxuICAgIGlmIChJU19QUk9UTykge1xuICAgICAgKGV4cG9ydHMudmlydHVhbCB8fCAoZXhwb3J0cy52aXJ0dWFsID0ge30pKVtrZXldID0gb3V0O1xuICAgICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLnByb3RvdHlwZS4lTkFNRSVcbiAgICAgIGlmICh0eXBlICYgJGV4cG9ydC5SICYmIGV4cFByb3RvICYmICFleHBQcm90b1trZXldKSBoaWRlKGV4cFByb3RvLCBrZXksIG91dCk7XG4gICAgfVxuICB9XG59O1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuIiwidmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKTtcbnZhciBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgZ2V0SXRlckZuID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcbnZhciBCUkVBSyA9IHt9O1xudmFyIFJFVFVSTiA9IHt9O1xudmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYWJsZSwgZW50cmllcywgZm4sIHRoYXQsIElURVJBVE9SKSB7XG4gIHZhciBpdGVyRm4gPSBJVEVSQVRPUiA/IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGl0ZXJhYmxlOyB9IDogZ2V0SXRlckZuKGl0ZXJhYmxlKTtcbiAgdmFyIGYgPSBjdHgoZm4sIHRoYXQsIGVudHJpZXMgPyAyIDogMSk7XG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBsZW5ndGgsIHN0ZXAsIGl0ZXJhdG9yLCByZXN1bHQ7XG4gIGlmICh0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdGVyYWJsZSArICcgaXMgbm90IGl0ZXJhYmxlIScpO1xuICAvLyBmYXN0IGNhc2UgZm9yIGFycmF5cyB3aXRoIGRlZmF1bHQgaXRlcmF0b3JcbiAgaWYgKGlzQXJyYXlJdGVyKGl0ZXJGbikpIGZvciAobGVuZ3RoID0gdG9MZW5ndGgoaXRlcmFibGUubGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICByZXN1bHQgPSBlbnRyaWVzID8gZihhbk9iamVjdChzdGVwID0gaXRlcmFibGVbaW5kZXhdKVswXSwgc3RlcFsxXSkgOiBmKGl0ZXJhYmxlW2luZGV4XSk7XG4gICAgaWYgKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSBmb3IgKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoaXRlcmFibGUpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7KSB7XG4gICAgcmVzdWx0ID0gY2FsbChpdGVyYXRvciwgZiwgc3RlcC52YWx1ZSwgZW50cmllcyk7XG4gICAgaWYgKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pIHJldHVybiByZXN1bHQ7XG4gIH1cbn07XG5leHBvcnRzLkJSRUFLID0gQlJFQUs7XG5leHBvcnRzLlJFVFVSTiA9IFJFVFVSTjtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGZcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmICh0eXBlb2YgX19nID09ICdudW1iZXInKSBfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJ2YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07XG4iLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTtcbiIsIi8vIDcuMi4yIElzQXJyYXkoYXJndW1lbnQpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gaXNBcnJheShhcmcpIHtcbiAgcmV0dXJuIGNvZihhcmcpID09ICdBcnJheSc7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07XG4iLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoIChlKSB7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQpIGFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyk7XG52YXIgZGVzY3JpcHRvciA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCkge1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHsgbmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KSB9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyICRpdGVyQ3JlYXRlID0gcmVxdWlyZSgnLi9faXRlci1jcmVhdGUnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBCVUdHWSA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKTsgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxudmFyIEZGX0lURVJBVE9SID0gJ0BAaXRlcmF0b3InO1xudmFyIEtFWVMgPSAna2V5cyc7XG52YXIgVkFMVUVTID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKSB7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uIChraW5kKSB7XG4gICAgaWYgKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKSByZXR1cm4gcHJvdG9ba2luZF07XG4gICAgc3dpdGNoIChraW5kKSB7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyA9IE5BTUUgKyAnIEl0ZXJhdG9yJztcbiAgdmFyIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFUztcbiAgdmFyIFZBTFVFU19CVUcgPSBmYWxzZTtcbiAgdmFyIHByb3RvID0gQmFzZS5wcm90b3R5cGU7XG4gIHZhciAkbmF0aXZlID0gcHJvdG9bSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdO1xuICB2YXIgJGRlZmF1bHQgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKTtcbiAgdmFyICRlbnRyaWVzID0gREVGQVVMVCA/ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKSA6IHVuZGVmaW5lZDtcbiAgdmFyICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlO1xuICB2YXIgbWV0aG9kcywga2V5LCBJdGVyYXRvclByb3RvdHlwZTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZiAoJGFueU5hdGl2ZSkge1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKCkpKTtcbiAgICBpZiAoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUgJiYgSXRlcmF0b3JQcm90b3R5cGUubmV4dCkge1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmICghTElCUkFSWSAmJiAhaGFzKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUikpIGhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZiAoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKSB7XG4gICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmICgoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSkge1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gPSByZXR1cm5UaGlzO1xuICBpZiAoREVGQVVMVCkge1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6IERFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogSVNfU0VUID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYgKEZPUkNFRCkgZm9yIChrZXkgaW4gbWV0aG9kcykge1xuICAgICAgaWYgKCEoa2V5IGluIHByb3RvKSkgcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTtcbiIsInZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uICgpIHsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXRocm93LWxpdGVyYWxcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24gKCkgeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjLCBza2lwQ2xvc2luZykge1xuICBpZiAoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpIHJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyID0gWzddO1xuICAgIHZhciBpdGVyID0gYXJyW0lURVJBVE9SXSgpO1xuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHsgZG9uZTogc2FmZSA9IHRydWUgfTsgfTtcbiAgICBhcnJbSVRFUkFUT1JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gaXRlcjsgfTtcbiAgICBleGVjKGFycik7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkb25lLCB2YWx1ZSkge1xuICByZXR1cm4geyB2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZSB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge307XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHRydWU7XG4iLCJ2YXIgTUVUQSA9IHJlcXVpcmUoJy4vX3VpZCcpKCdtZXRhJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBzZXREZXNjID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBpZCA9IDA7XG52YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0cnVlO1xufTtcbnZhciBGUkVFWkUgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBpc0V4dGVuc2libGUoT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKHt9KSk7XG59KTtcbnZhciBzZXRNZXRhID0gZnVuY3Rpb24gKGl0KSB7XG4gIHNldERlc2MoaXQsIE1FVEEsIHsgdmFsdWU6IHtcbiAgICBpOiAnTycgKyArK2lkLCAvLyBvYmplY3QgSURcbiAgICB3OiB7fSAgICAgICAgICAvLyB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IH0pO1xufTtcbnZhciBmYXN0S2V5ID0gZnVuY3Rpb24gKGl0LCBjcmVhdGUpIHtcbiAgLy8gcmV0dXJuIHByaW1pdGl2ZSB3aXRoIHByZWZpeFxuICBpZiAoIWlzT2JqZWN0KGl0KSkgcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJyA/IGl0IDogKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcbiAgaWYgKCFoYXMoaXQsIE1FVEEpKSB7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZiAoIWlzRXh0ZW5zaWJsZShpdCkpIHJldHVybiAnRic7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZiAoIWNyZWF0ZSkgcmV0dXJuICdFJztcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gb2JqZWN0IElEXG4gIH0gcmV0dXJuIGl0W01FVEFdLmk7XG59O1xudmFyIGdldFdlYWsgPSBmdW5jdGlvbiAoaXQsIGNyZWF0ZSkge1xuICBpZiAoIWhhcyhpdCwgTUVUQSkpIHtcbiAgICAvLyBjYW4ndCBzZXQgbWV0YWRhdGEgdG8gdW5jYXVnaHQgZnJvemVuIG9iamVjdFxuICAgIGlmICghaXNFeHRlbnNpYmxlKGl0KSkgcmV0dXJuIHRydWU7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZiAoIWNyZWF0ZSkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBoYXNoIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH0gcmV0dXJuIGl0W01FVEFdLnc7XG59O1xuLy8gYWRkIG1ldGFkYXRhIG9uIGZyZWV6ZS1mYW1pbHkgbWV0aG9kcyBjYWxsaW5nXG52YXIgb25GcmVlemUgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKEZSRUVaRSAmJiBtZXRhLk5FRUQgJiYgaXNFeHRlbnNpYmxlKGl0KSAmJiAhaGFzKGl0LCBNRVRBKSkgc2V0TWV0YShpdCk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgbWV0YSA9IG1vZHVsZS5leHBvcnRzID0ge1xuICBLRVk6IE1FVEEsXG4gIE5FRUQ6IGZhbHNlLFxuICBmYXN0S2V5OiBmYXN0S2V5LFxuICBnZXRXZWFrOiBnZXRXZWFrLFxuICBvbkZyZWV6ZTogb25GcmVlemVcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgZ09QUyA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJyk7XG52YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciAkYXNzaWduID0gT2JqZWN0LmFzc2lnbjtcblxuLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG5tb2R1bGUuZXhwb3J0cyA9ICEkYXNzaWduIHx8IHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICB2YXIgQSA9IHt9O1xuICB2YXIgQiA9IHt9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgdmFyIFMgPSBTeW1ib2woKTtcbiAgdmFyIEsgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3QnO1xuICBBW1NdID0gNztcbiAgSy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAoaykgeyBCW2tdID0gazsgfSk7XG4gIHJldHVybiAkYXNzaWduKHt9LCBBKVtTXSAhPSA3IHx8IE9iamVjdC5rZXlzKCRhc3NpZ24oe30sIEIpKS5qb2luKCcnKSAhPSBLO1xufSkgPyBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgVCA9IHRvT2JqZWN0KHRhcmdldCk7XG4gIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgdmFyIGluZGV4ID0gMTtcbiAgdmFyIGdldFN5bWJvbHMgPSBnT1BTLmY7XG4gIHZhciBpc0VudW0gPSBwSUUuZjtcbiAgd2hpbGUgKGFMZW4gPiBpbmRleCkge1xuICAgIHZhciBTID0gSU9iamVjdChhcmd1bWVudHNbaW5kZXgrK10pO1xuICAgIHZhciBrZXlzID0gZ2V0U3ltYm9scyA/IGdldEtleXMoUykuY29uY2F0KGdldFN5bWJvbHMoUykpIDogZ2V0S2V5cyhTKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIGogPSAwO1xuICAgIHZhciBrZXk7XG4gICAgd2hpbGUgKGxlbmd0aCA+IGopIGlmIChpc0VudW0uY2FsbChTLCBrZXkgPSBrZXlzW2orK10pKSBUW2tleV0gPSBTW2tleV07XG4gIH0gcmV0dXJuIFQ7XG59IDogJGFzc2lnbjtcbiIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZFBzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwcycpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIEVtcHR5ID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnaWZyYW1lJyk7XG4gIHZhciBpID0gZW51bUJ1Z0tleXMubGVuZ3RoO1xuICB2YXIgbHQgPSAnPCc7XG4gIHZhciBndCA9ICc+JztcbiAgdmFyIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgcmVxdWlyZSgnLi9faHRtbCcpLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgJ3NjcmlwdCcgKyBndCArICdkb2N1bWVudC5GPU9iamVjdCcgKyBsdCArICcvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlIChpLS0pIGRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChPICE9PSBudWxsKSB7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eSgpO1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xudmFyIGRQID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcykge1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIGlmICgnZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpIHRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQhJyk7XG4gIGlmICgndmFsdWUnIGluIEF0dHJpYnV0ZXMpIE9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcykge1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgPSBnZXRLZXlzKFByb3BlcnRpZXMpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciBpID0gMDtcbiAgdmFyIFA7XG4gIHdoaWxlIChsZW5ndGggPiBpKSBkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIGdPUEQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZ09QRCA6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKSB7XG4gIE8gPSB0b0lPYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBnT1BEKE8sIFApO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKGhhcyhPLCBQKSkgcmV0dXJuIGNyZWF0ZURlc2MoIXBJRS5mLmNhbGwoTywgUCksIE9bUF0pO1xufTtcbiIsIi8vIGZhbGxiYWNrIGZvciBJRTExIGJ1Z2d5IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHdpdGggaWZyYW1lIGFuZCB3aW5kb3dcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgZ09QTiA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuJykuZjtcbnZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG52YXIgd2luZG93TmFtZXMgPSB0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvdyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc1xuICA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHdpbmRvdykgOiBbXTtcblxudmFyIGdldFdpbmRvd05hbWVzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGdPUE4oaXQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHdpbmRvd05hbWVzLnNsaWNlKCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLmYgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KSB7XG4gIHJldHVybiB3aW5kb3dOYW1lcyAmJiB0b1N0cmluZy5jYWxsKGl0KSA9PSAnW29iamVjdCBXaW5kb3ddJyA/IGdldFdpbmRvd05hbWVzKGl0KSA6IGdPUE4odG9JT2JqZWN0KGl0KSk7XG59O1xuIiwiLy8gMTkuMS4yLjcgLyAxNS4yLjMuNCBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpLmNvbmNhdCgnbGVuZ3RoJywgJ3Byb3RvdHlwZScpO1xuXG5leHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKE8pIHtcbiAgcmV0dXJuICRrZXlzKE8sIGhpZGRlbktleXMpO1xufTtcbiIsImV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4iLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgT2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiAoTykge1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmIChoYXMoTywgSUVfUFJPVE8pKSByZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmICh0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xufTtcbiIsInZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZXMpIHtcbiAgdmFyIE8gPSB0b0lPYmplY3Qob2JqZWN0KTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIE8pIGlmIChrZXkgIT0gSUVfUFJPVE8pIGhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIGlmIChoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpIHtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTykge1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcbiIsImV4cG9ydHMuZiA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuIiwiLy8gbW9zdCBPYmplY3QgbWV0aG9kcyBieSBFUzYgc2hvdWxkIGFjY2VwdCBwcmltaXRpdmVzXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoS0VZLCBleGVjKSB7XG4gIHZhciBmbiA9IChjb3JlLk9iamVjdCB8fCB7fSlbS0VZXSB8fCBPYmplY3RbS0VZXTtcbiAgdmFyIGV4cCA9IHt9O1xuICBleHBbS0VZXSA9IGV4ZWMoZm4pO1xuICAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIGZhaWxzKGZ1bmN0aW9uICgpIHsgZm4oMSk7IH0pLCAnT2JqZWN0JywgZXhwKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChiaXRtYXAsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZTogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGU6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWU6IHZhbHVlXG4gIH07XG59O1xuIiwidmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0YXJnZXQsIHNyYywgc2FmZSkge1xuICBmb3IgKHZhciBrZXkgaW4gc3JjKSB7XG4gICAgaWYgKHNhZmUgJiYgdGFyZ2V0W2tleV0pIHRhcmdldFtrZXldID0gc3JjW2tleV07XG4gICAgZWxzZSBoaWRlKHRhcmdldCwga2V5LCBzcmNba2V5XSk7XG4gIH0gcmV0dXJuIHRhcmdldDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vcHJvcG9zYWwtc2V0bWFwLW9mZnJvbS9cbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGZvck9mID0gcmVxdWlyZSgnLi9fZm9yLW9mJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENPTExFQ1RJT04pIHtcbiAgJGV4cG9ydCgkZXhwb3J0LlMsIENPTExFQ1RJT04sIHsgZnJvbTogZnVuY3Rpb24gZnJvbShzb3VyY2UgLyogLCBtYXBGbiwgdGhpc0FyZyAqLykge1xuICAgIHZhciBtYXBGbiA9IGFyZ3VtZW50c1sxXTtcbiAgICB2YXIgbWFwcGluZywgQSwgbiwgY2I7XG4gICAgYUZ1bmN0aW9uKHRoaXMpO1xuICAgIG1hcHBpbmcgPSBtYXBGbiAhPT0gdW5kZWZpbmVkO1xuICAgIGlmIChtYXBwaW5nKSBhRnVuY3Rpb24obWFwRm4pO1xuICAgIGlmIChzb3VyY2UgPT0gdW5kZWZpbmVkKSByZXR1cm4gbmV3IHRoaXMoKTtcbiAgICBBID0gW107XG4gICAgaWYgKG1hcHBpbmcpIHtcbiAgICAgIG4gPSAwO1xuICAgICAgY2IgPSBjdHgobWFwRm4sIGFyZ3VtZW50c1syXSwgMik7XG4gICAgICBmb3JPZihzb3VyY2UsIGZhbHNlLCBmdW5jdGlvbiAobmV4dEl0ZW0pIHtcbiAgICAgICAgQS5wdXNoKGNiKG5leHRJdGVtLCBuKyspKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3JPZihzb3VyY2UsIGZhbHNlLCBBLnB1c2gsIEEpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IHRoaXMoQSk7XG4gIH0gfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9wcm9wb3NhbC1zZXRtYXAtb2Zmcm9tL1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ09MTEVDVElPTikge1xuICAkZXhwb3J0KCRleHBvcnQuUywgQ09MTEVDVElPTiwgeyBvZjogZnVuY3Rpb24gb2YoKSB7XG4gICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgdmFyIEEgPSBBcnJheShsZW5ndGgpO1xuICAgIHdoaWxlIChsZW5ndGgtLSkgQVtsZW5ndGhdID0gYXJndW1lbnRzW2xlbmd0aF07XG4gICAgcmV0dXJuIG5ldyB0aGlzKEEpO1xuICB9IH0pO1xufTtcbiIsIi8vIFdvcmtzIHdpdGggX19wcm90b19fIG9ubHkuIE9sZCB2OCBjYW4ndCB3b3JrIHdpdGggbnVsbCBwcm90byBvYmplY3RzLlxuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgY2hlY2sgPSBmdW5jdGlvbiAoTywgcHJvdG8pIHtcbiAgYW5PYmplY3QoTyk7XG4gIGlmICghaXNPYmplY3QocHJvdG8pICYmIHByb3RvICE9PSBudWxsKSB0aHJvdyBUeXBlRXJyb3IocHJvdG8gKyBcIjogY2FuJ3Qgc2V0IGFzIHByb3RvdHlwZSFcIik7XG59O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8ICgnX19wcm90b19fJyBpbiB7fSA/IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICBmdW5jdGlvbiAodGVzdCwgYnVnZ3ksIHNldCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgc2V0ID0gcmVxdWlyZSgnLi9fY3R4JykoRnVuY3Rpb24uY2FsbCwgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKS5mKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQsIDIpO1xuICAgICAgICBzZXQodGVzdCwgW10pO1xuICAgICAgICBidWdneSA9ICEodGVzdCBpbnN0YW5jZW9mIEFycmF5KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgYnVnZ3kgPSB0cnVlOyB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pIHtcbiAgICAgICAgY2hlY2soTywgcHJvdG8pO1xuICAgICAgICBpZiAoYnVnZ3kpIE8uX19wcm90b19fID0gcHJvdG87XG4gICAgICAgIGVsc2Ugc2V0KE8sIHByb3RvKTtcbiAgICAgICAgcmV0dXJuIE87XG4gICAgICB9O1xuICAgIH0oe30sIGZhbHNlKSA6IHVuZGVmaW5lZCksXG4gIGNoZWNrOiBjaGVja1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyIFNQRUNJRVMgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChLRVkpIHtcbiAgdmFyIEMgPSB0eXBlb2YgY29yZVtLRVldID09ICdmdW5jdGlvbicgPyBjb3JlW0tFWV0gOiBnbG9iYWxbS0VZXTtcbiAgaWYgKERFU0NSSVBUT1JTICYmIEMgJiYgIUNbU1BFQ0lFU10pIGRQLmYoQywgU1BFQ0lFUywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH1cbiAgfSk7XG59O1xuIiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCB0YWcsIHN0YXQpIHtcbiAgaWYgKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpIGRlZihpdCwgVEFHLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZyB9KTtcbn07XG4iLCJ2YXIgc2hhcmVkID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ2tleXMnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gc2hhcmVkW2tleV0gfHwgKHNoYXJlZFtrZXldID0gdWlkKGtleSkpO1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJztcbnZhciBzdG9yZSA9IGdsb2JhbFtTSEFSRURdIHx8IChnbG9iYWxbU0hBUkVEXSA9IHt9KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVE9fU1RSSU5HKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGhhdCwgcG9zKSB7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSk7XG4gICAgdmFyIGkgPSB0b0ludGVnZXIocG9zKTtcbiAgICB2YXIgbCA9IHMubGVuZ3RoO1xuICAgIHZhciBhLCBiO1xuICAgIGlmIChpIDwgMCB8fCBpID49IGwpIHJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07XG4iLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsID0gTWF0aC5jZWlsO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTtcbiIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTtcbiIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIFMpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmIChTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGlkID0gMDtcbnZhciBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBUWVBFKSB7XG4gIGlmICghaXNPYmplY3QoaXQpIHx8IGl0Ll90ICE9PSBUWVBFKSB0aHJvdyBUeXBlRXJyb3IoJ0luY29tcGF0aWJsZSByZWNlaXZlciwgJyArIFRZUEUgKyAnIHJlcXVpcmVkIScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgTElCUkFSWSA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKTtcbnZhciB3a3NFeHQgPSByZXF1aXJlKCcuL193a3MtZXh0Jyk7XG52YXIgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICB2YXIgJFN5bWJvbCA9IGNvcmUuU3ltYm9sIHx8IChjb3JlLlN5bWJvbCA9IExJQlJBUlkgPyB7fSA6IGdsb2JhbC5TeW1ib2wgfHwge30pO1xuICBpZiAobmFtZS5jaGFyQXQoMCkgIT0gJ18nICYmICEobmFtZSBpbiAkU3ltYm9sKSkgZGVmaW5lUHJvcGVydHkoJFN5bWJvbCwgbmFtZSwgeyB2YWx1ZTogd2tzRXh0LmYobmFtZSkgfSk7XG59O1xuIiwiZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fd2tzJyk7XG4iLCJ2YXIgc3RvcmUgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnd2tzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG52YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuU3ltYm9sO1xudmFyIFVTRV9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09ICdmdW5jdGlvbic7XG5cbnZhciAkZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgVVNFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV0gfHwgKFVTRV9TWU1CT0wgPyBTeW1ib2wgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07XG5cbiRleHBvcnRzLnN0b3JlID0gc3RvcmU7XG4iLCJ2YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ICE9IHVuZGVmaW5lZCkgcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGdldCA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvciA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgaXRlckZuID0gZ2V0KGl0KTtcbiAgaWYgKHR5cGVvZiBpdGVyRm4gIT0gJ2Z1bmN0aW9uJykgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgaXRlcmFibGUhJyk7XG4gIHJldHVybiBhbk9iamVjdChpdGVyRm4uY2FsbChpdCkpO1xufTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5pc0l0ZXJhYmxlID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciBPID0gT2JqZWN0KGl0KTtcbiAgcmV0dXJuIE9bSVRFUkFUT1JdICE9PSB1bmRlZmluZWRcbiAgICB8fCAnQEBpdGVyYXRvcicgaW4gT1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbiAgICB8fCBJdGVyYXRvcnMuaGFzT3duUHJvcGVydHkoY2xhc3NvZihPKSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKTtcbnZhciBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGNyZWF0ZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fY3JlYXRlLXByb3BlcnR5Jyk7XG52YXIgZ2V0SXRlckZuID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbiAoaXRlcikgeyBBcnJheS5mcm9tKGl0ZXIpOyB9KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gIGZyb206IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlIC8qICwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQgKi8pIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KGFycmF5TGlrZSk7XG4gICAgdmFyIEMgPSB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5O1xuICAgIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgbWFwZm4gPSBhTGVuID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWQ7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgaXRlckZuID0gZ2V0SXRlckZuKE8pO1xuICAgIHZhciBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gICAgaWYgKG1hcHBpbmcpIG1hcGZuID0gY3R4KG1hcGZuLCBhTGVuID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZCwgMik7XG4gICAgLy8gaWYgb2JqZWN0IGlzbid0IGl0ZXJhYmxlIG9yIGl0J3MgYXJyYXkgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yIC0gdXNlIHNpbXBsZSBjYXNlXG4gICAgaWYgKGl0ZXJGbiAhPSB1bmRlZmluZWQgJiYgIShDID09IEFycmF5ICYmIGlzQXJyYXlJdGVyKGl0ZXJGbikpKSB7XG4gICAgICBmb3IgKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoTyksIHJlc3VsdCA9IG5ldyBDKCk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaW5kZXgrKykge1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gY2FsbChpdGVyYXRvciwgbWFwZm4sIFtzdGVwLnZhbHVlLCBpbmRleF0sIHRydWUpIDogc3RlcC52YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICAgIGZvciAocmVzdWx0ID0gbmV3IEMobGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IG1hcGZuKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5sZW5ndGggPSBpbmRleDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJyk7XG52YXIgc3RlcCA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcblxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcbi8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbiAoaXRlcmF0ZWQsIGtpbmQpIHtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGtpbmQgPSB0aGlzLl9rO1xuICB2YXIgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmICghTyB8fCBpbmRleCA+PSBPLmxlbmd0aCkge1xuICAgIHRoaXMuX3QgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN0ZXAoMSk7XG4gIH1cbiAgaWYgKGtpbmQgPT0gJ2tleXMnKSByZXR1cm4gc3RlcCgwLCBpbmRleCk7XG4gIGlmIChraW5kID09ICd2YWx1ZXMnKSByZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi1zdHJvbmcnKTtcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vX3ZhbGlkYXRlLWNvbGxlY3Rpb24nKTtcbnZhciBNQVAgPSAnTWFwJztcblxuLy8gMjMuMSBNYXAgT2JqZWN0c1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoTUFQLCBmdW5jdGlvbiAoZ2V0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBNYXAoKSB7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4xLjMuNiBNYXAucHJvdG90eXBlLmdldChrZXkpXG4gIGdldDogZnVuY3Rpb24gZ2V0KGtleSkge1xuICAgIHZhciBlbnRyeSA9IHN0cm9uZy5nZXRFbnRyeSh2YWxpZGF0ZSh0aGlzLCBNQVApLCBrZXkpO1xuICAgIHJldHVybiBlbnRyeSAmJiBlbnRyeS52O1xuICB9LFxuICAvLyAyMy4xLjMuOSBNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxuICBzZXQ6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodmFsaWRhdGUodGhpcywgTUFQKSwga2V5ID09PSAwID8gMCA6IGtleSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcsIHRydWUpO1xuIiwiLy8gMTkuMS4zLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GLCAnT2JqZWN0JywgeyBhc3NpZ246IHJlcXVpcmUoJy4vX29iamVjdC1hc3NpZ24nKSB9KTtcbiIsInZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG4vLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0JywgeyBjcmVhdGU6IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKSB9KTtcbiIsInZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG4vLyAxOS4xLjIuNCAvIDE1LjIuMy42IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKVxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSwgJ09iamVjdCcsIHsgZGVmaW5lUHJvcGVydHk6IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmYgfSk7XG4iLCIvLyAxOS4xLjIuNiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpLmY7XG5cbnJlcXVpcmUoJy4vX29iamVjdC1zYXAnKSgnZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJywgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpIHtcbiAgICByZXR1cm4gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0b0lPYmplY3QoaXQpLCBrZXkpO1xuICB9O1xufSk7XG4iLCIvLyAxOS4xLjIuOSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyICRnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKTtcblxucmVxdWlyZSgnLi9fb2JqZWN0LXNhcCcpKCdnZXRQcm90b3R5cGVPZicsIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGdldFByb3RvdHlwZU9mKGl0KSB7XG4gICAgcmV0dXJuICRnZXRQcm90b3R5cGVPZih0b09iamVjdChpdCkpO1xuICB9O1xufSk7XG4iLCIvLyAxOS4xLjIuMTQgT2JqZWN0LmtleXMoTylcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxucmVxdWlyZSgnLi9fb2JqZWN0LXNhcCcpKCdrZXlzJywgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZnVuY3Rpb24ga2V5cyhpdCkge1xuICAgIHJldHVybiAka2V5cyh0b09iamVjdChpdCkpO1xuICB9O1xufSk7XG4iLCIvLyAxOS4xLjMuMTkgT2JqZWN0LnNldFByb3RvdHlwZU9mKE8sIHByb3RvKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0JywgeyBzZXRQcm90b3R5cGVPZjogcmVxdWlyZSgnLi9fc2V0LXByb3RvJykuc2V0IH0pO1xuIiwiIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tc3Ryb25nJyk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL192YWxpZGF0ZS1jb2xsZWN0aW9uJyk7XG52YXIgU0VUID0gJ1NldCc7XG5cbi8vIDIzLjIgU2V0IE9iamVjdHNcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbicpKFNFVCwgZnVuY3Rpb24gKGdldCkge1xuICByZXR1cm4gZnVuY3Rpb24gU2V0KCkgeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuMi4zLjEgU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXG4gIGFkZDogZnVuY3Rpb24gYWRkKHZhbHVlKSB7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodmFsaWRhdGUodGhpcywgU0VUKSwgdmFsdWUgPSB2YWx1ZSA9PT0gMCA/IDAgOiB2YWx1ZSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcpO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uIChpdGVyYXRlZCkge1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGluZGV4ID0gdGhpcy5faTtcbiAgdmFyIHBvaW50O1xuICBpZiAoaW5kZXggPj0gTy5sZW5ndGgpIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHsgdmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZSB9O1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG4vLyBFQ01BU2NyaXB0IDYgc3ltYm9scyBzaGltXG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgTUVUQSA9IHJlcXVpcmUoJy4vX21ldGEnKS5LRVk7XG52YXIgJGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbnZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG52YXIgd2tzID0gcmVxdWlyZSgnLi9fd2tzJyk7XG52YXIgd2tzRXh0ID0gcmVxdWlyZSgnLi9fd2tzLWV4dCcpO1xudmFyIHdrc0RlZmluZSA9IHJlcXVpcmUoJy4vX3drcy1kZWZpbmUnKTtcbnZhciBlbnVtS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0ta2V5cycpO1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL19pcy1hcnJheScpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciBfY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIGdPUE5FeHQgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wbi1leHQnKTtcbnZhciAkR09QRCA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJyk7XG52YXIgJERQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xudmFyIGdPUEQgPSAkR09QRC5mO1xudmFyIGRQID0gJERQLmY7XG52YXIgZ09QTiA9IGdPUE5FeHQuZjtcbnZhciAkU3ltYm9sID0gZ2xvYmFsLlN5bWJvbDtcbnZhciAkSlNPTiA9IGdsb2JhbC5KU09OO1xudmFyIF9zdHJpbmdpZnkgPSAkSlNPTiAmJiAkSlNPTi5zdHJpbmdpZnk7XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG52YXIgSElEREVOID0gd2tzKCdfaGlkZGVuJyk7XG52YXIgVE9fUFJJTUlUSVZFID0gd2tzKCd0b1ByaW1pdGl2ZScpO1xudmFyIGlzRW51bSA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xudmFyIFN5bWJvbFJlZ2lzdHJ5ID0gc2hhcmVkKCdzeW1ib2wtcmVnaXN0cnknKTtcbnZhciBBbGxTeW1ib2xzID0gc2hhcmVkKCdzeW1ib2xzJyk7XG52YXIgT1BTeW1ib2xzID0gc2hhcmVkKCdvcC1zeW1ib2xzJyk7XG52YXIgT2JqZWN0UHJvdG8gPSBPYmplY3RbUFJPVE9UWVBFXTtcbnZhciBVU0VfTkFUSVZFID0gdHlwZW9mICRTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcbnZhciBRT2JqZWN0ID0gZ2xvYmFsLlFPYmplY3Q7XG4vLyBEb24ndCB1c2Ugc2V0dGVycyBpbiBRdCBTY3JpcHQsIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy8xNzNcbnZhciBzZXR0ZXIgPSAhUU9iamVjdCB8fCAhUU9iamVjdFtQUk9UT1RZUEVdIHx8ICFRT2JqZWN0W1BST1RPVFlQRV0uZmluZENoaWxkO1xuXG4vLyBmYWxsYmFjayBmb3Igb2xkIEFuZHJvaWQsIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD02ODdcbnZhciBzZXRTeW1ib2xEZXNjID0gREVTQ1JJUFRPUlMgJiYgJGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIF9jcmVhdGUoZFAoe30sICdhJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gZFAodGhpcywgJ2EnLCB7IHZhbHVlOiA3IH0pLmE7IH1cbiAgfSkpLmEgIT0gNztcbn0pID8gZnVuY3Rpb24gKGl0LCBrZXksIEQpIHtcbiAgdmFyIHByb3RvRGVzYyA9IGdPUEQoT2JqZWN0UHJvdG8sIGtleSk7XG4gIGlmIChwcm90b0Rlc2MpIGRlbGV0ZSBPYmplY3RQcm90b1trZXldO1xuICBkUChpdCwga2V5LCBEKTtcbiAgaWYgKHByb3RvRGVzYyAmJiBpdCAhPT0gT2JqZWN0UHJvdG8pIGRQKE9iamVjdFByb3RvLCBrZXksIHByb3RvRGVzYyk7XG59IDogZFA7XG5cbnZhciB3cmFwID0gZnVuY3Rpb24gKHRhZykge1xuICB2YXIgc3ltID0gQWxsU3ltYm9sc1t0YWddID0gX2NyZWF0ZSgkU3ltYm9sW1BST1RPVFlQRV0pO1xuICBzeW0uX2sgPSB0YWc7XG4gIHJldHVybiBzeW07XG59O1xuXG52YXIgaXNTeW1ib2wgPSBVU0VfTkFUSVZFICYmIHR5cGVvZiAkU3ltYm9sLml0ZXJhdG9yID09ICdzeW1ib2wnID8gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCc7XG59IDogZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCBpbnN0YW5jZW9mICRTeW1ib2w7XG59O1xuXG52YXIgJGRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgRCkge1xuICBpZiAoaXQgPT09IE9iamVjdFByb3RvKSAkZGVmaW5lUHJvcGVydHkoT1BTeW1ib2xzLCBrZXksIEQpO1xuICBhbk9iamVjdChpdCk7XG4gIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEQpO1xuICBpZiAoaGFzKEFsbFN5bWJvbHMsIGtleSkpIHtcbiAgICBpZiAoIUQuZW51bWVyYWJsZSkge1xuICAgICAgaWYgKCFoYXMoaXQsIEhJRERFTikpIGRQKGl0LCBISURERU4sIGNyZWF0ZURlc2MoMSwge30pKTtcbiAgICAgIGl0W0hJRERFTl1ba2V5XSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKSBpdFtISURERU5dW2tleV0gPSBmYWxzZTtcbiAgICAgIEQgPSBfY3JlYXRlKEQsIHsgZW51bWVyYWJsZTogY3JlYXRlRGVzYygwLCBmYWxzZSkgfSk7XG4gICAgfSByZXR1cm4gc2V0U3ltYm9sRGVzYyhpdCwga2V5LCBEKTtcbiAgfSByZXR1cm4gZFAoaXQsIGtleSwgRCk7XG59O1xudmFyICRkZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhpdCwgUCkge1xuICBhbk9iamVjdChpdCk7XG4gIHZhciBrZXlzID0gZW51bUtleXMoUCA9IHRvSU9iamVjdChQKSk7XG4gIHZhciBpID0gMDtcbiAgdmFyIGwgPSBrZXlzLmxlbmd0aDtcbiAgdmFyIGtleTtcbiAgd2hpbGUgKGwgPiBpKSAkZGVmaW5lUHJvcGVydHkoaXQsIGtleSA9IGtleXNbaSsrXSwgUFtrZXldKTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciAkY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGl0LCBQKSB7XG4gIHJldHVybiBQID09PSB1bmRlZmluZWQgPyBfY3JlYXRlKGl0KSA6ICRkZWZpbmVQcm9wZXJ0aWVzKF9jcmVhdGUoaXQpLCBQKTtcbn07XG52YXIgJHByb3BlcnR5SXNFbnVtZXJhYmxlID0gZnVuY3Rpb24gcHJvcGVydHlJc0VudW1lcmFibGUoa2V5KSB7XG4gIHZhciBFID0gaXNFbnVtLmNhbGwodGhpcywga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKSk7XG4gIGlmICh0aGlzID09PSBPYmplY3RQcm90byAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhaGFzKE9QU3ltYm9scywga2V5KSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gRSB8fCAhaGFzKHRoaXMsIGtleSkgfHwgIWhhcyhBbGxTeW1ib2xzLCBrZXkpIHx8IGhhcyh0aGlzLCBISURERU4pICYmIHRoaXNbSElEREVOXVtrZXldID8gRSA6IHRydWU7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSkge1xuICBpdCA9IHRvSU9iamVjdChpdCk7XG4gIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSk7XG4gIGlmIChpdCA9PT0gT2JqZWN0UHJvdG8gJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIWhhcyhPUFN5bWJvbHMsIGtleSkpIHJldHVybjtcbiAgdmFyIEQgPSBnT1BEKGl0LCBrZXkpO1xuICBpZiAoRCAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0pKSBELmVudW1lcmFibGUgPSB0cnVlO1xuICByZXR1cm4gRDtcbn07XG52YXIgJGdldE93blByb3BlcnR5TmFtZXMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KSB7XG4gIHZhciBuYW1lcyA9IGdPUE4odG9JT2JqZWN0KGl0KSk7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGkgPSAwO1xuICB2YXIga2V5O1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkge1xuICAgIGlmICghaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIGtleSAhPSBISURERU4gJiYga2V5ICE9IE1FVEEpIHJlc3VsdC5wdXNoKGtleSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgJGdldE93blByb3BlcnR5U3ltYm9scyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhpdCkge1xuICB2YXIgSVNfT1AgPSBpdCA9PT0gT2JqZWN0UHJvdG87XG4gIHZhciBuYW1lcyA9IGdPUE4oSVNfT1AgPyBPUFN5bWJvbHMgOiB0b0lPYmplY3QoaXQpKTtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIgaSA9IDA7XG4gIHZhciBrZXk7XG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSB7XG4gICAgaWYgKGhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSAmJiAoSVNfT1AgPyBoYXMoT2JqZWN0UHJvdG8sIGtleSkgOiB0cnVlKSkgcmVzdWx0LnB1c2goQWxsU3ltYm9sc1trZXldKTtcbiAgfSByZXR1cm4gcmVzdWx0O1xufTtcblxuLy8gMTkuNC4xLjEgU3ltYm9sKFtkZXNjcmlwdGlvbl0pXG5pZiAoIVVTRV9OQVRJVkUpIHtcbiAgJFN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbCgpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mICRTeW1ib2wpIHRocm93IFR5cGVFcnJvcignU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yIScpO1xuICAgIHZhciB0YWcgPSB1aWQoYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpO1xuICAgIHZhciAkc2V0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAodGhpcyA9PT0gT2JqZWN0UHJvdG8pICRzZXQuY2FsbChPUFN5bWJvbHMsIHZhbHVlKTtcbiAgICAgIGlmIChoYXModGhpcywgSElEREVOKSAmJiBoYXModGhpc1tISURERU5dLCB0YWcpKSB0aGlzW0hJRERFTl1bdGFnXSA9IGZhbHNlO1xuICAgICAgc2V0U3ltYm9sRGVzYyh0aGlzLCB0YWcsIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbiAgICB9O1xuICAgIGlmIChERVNDUklQVE9SUyAmJiBzZXR0ZXIpIHNldFN5bWJvbERlc2MoT2JqZWN0UHJvdG8sIHRhZywgeyBjb25maWd1cmFibGU6IHRydWUsIHNldDogJHNldCB9KTtcbiAgICByZXR1cm4gd3JhcCh0YWcpO1xuICB9O1xuICByZWRlZmluZSgkU3ltYm9sW1BST1RPVFlQRV0sICd0b1N0cmluZycsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLl9rO1xuICB9KTtcblxuICAkR09QRC5mID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgJERQLmYgPSAkZGVmaW5lUHJvcGVydHk7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1nb3BuJykuZiA9IGdPUE5FeHQuZiA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzO1xuICByZXF1aXJlKCcuL19vYmplY3QtcGllJykuZiA9ICRwcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKS5mID0gJGdldE93blByb3BlcnR5U3ltYm9scztcblxuICBpZiAoREVTQ1JJUFRPUlMgJiYgIXJlcXVpcmUoJy4vX2xpYnJhcnknKSkge1xuICAgIHJlZGVmaW5lKE9iamVjdFByb3RvLCAncHJvcGVydHlJc0VudW1lcmFibGUnLCAkcHJvcGVydHlJc0VudW1lcmFibGUsIHRydWUpO1xuICB9XG5cbiAgd2tzRXh0LmYgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHJldHVybiB3cmFwKHdrcyhuYW1lKSk7XG4gIH07XG59XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIHsgU3ltYm9sOiAkU3ltYm9sIH0pO1xuXG5mb3IgKHZhciBlczZTeW1ib2xzID0gKFxuICAvLyAxOS40LjIuMiwgMTkuNC4yLjMsIDE5LjQuMi40LCAxOS40LjIuNiwgMTkuNC4yLjgsIDE5LjQuMi45LCAxOS40LjIuMTAsIDE5LjQuMi4xMSwgMTkuNC4yLjEyLCAxOS40LjIuMTMsIDE5LjQuMi4xNFxuICAnaGFzSW5zdGFuY2UsaXNDb25jYXRTcHJlYWRhYmxlLGl0ZXJhdG9yLG1hdGNoLHJlcGxhY2Usc2VhcmNoLHNwZWNpZXMsc3BsaXQsdG9QcmltaXRpdmUsdG9TdHJpbmdUYWcsdW5zY29wYWJsZXMnXG4pLnNwbGl0KCcsJyksIGogPSAwOyBlczZTeW1ib2xzLmxlbmd0aCA+IGo7KXdrcyhlczZTeW1ib2xzW2orK10pO1xuXG5mb3IgKHZhciB3ZWxsS25vd25TeW1ib2xzID0gJGtleXMod2tzLnN0b3JlKSwgayA9IDA7IHdlbGxLbm93blN5bWJvbHMubGVuZ3RoID4gazspIHdrc0RlZmluZSh3ZWxsS25vd25TeW1ib2xzW2srK10pO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCAnU3ltYm9sJywge1xuICAvLyAxOS40LjIuMSBTeW1ib2wuZm9yKGtleSlcbiAgJ2Zvcic6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gaGFzKFN5bWJvbFJlZ2lzdHJ5LCBrZXkgKz0gJycpXG4gICAgICA/IFN5bWJvbFJlZ2lzdHJ5W2tleV1cbiAgICAgIDogU3ltYm9sUmVnaXN0cnlba2V5XSA9ICRTeW1ib2woa2V5KTtcbiAgfSxcbiAgLy8gMTkuNC4yLjUgU3ltYm9sLmtleUZvcihzeW0pXG4gIGtleUZvcjogZnVuY3Rpb24ga2V5Rm9yKHN5bSkge1xuICAgIGlmICghaXNTeW1ib2woc3ltKSkgdGhyb3cgVHlwZUVycm9yKHN5bSArICcgaXMgbm90IGEgc3ltYm9sIScpO1xuICAgIGZvciAodmFyIGtleSBpbiBTeW1ib2xSZWdpc3RyeSkgaWYgKFN5bWJvbFJlZ2lzdHJ5W2tleV0gPT09IHN5bSkgcmV0dXJuIGtleTtcbiAgfSxcbiAgdXNlU2V0dGVyOiBmdW5jdGlvbiAoKSB7IHNldHRlciA9IHRydWU7IH0sXG4gIHVzZVNpbXBsZTogZnVuY3Rpb24gKCkgeyBzZXR0ZXIgPSBmYWxzZTsgfVxufSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsICdPYmplY3QnLCB7XG4gIC8vIDE5LjEuMi4yIE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiAgY3JlYXRlOiAkY3JlYXRlLFxuICAvLyAxOS4xLjIuNCBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiAgZGVmaW5lUHJvcGVydHk6ICRkZWZpbmVQcm9wZXJ0eSxcbiAgLy8gMTkuMS4yLjMgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcylcbiAgZGVmaW5lUHJvcGVydGllczogJGRlZmluZVByb3BlcnRpZXMsXG4gIC8vIDE5LjEuMi42IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICAvLyAxOS4xLjIuNyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxuICBnZXRPd25Qcm9wZXJ0eU5hbWVzOiAkZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgLy8gMTkuMS4yLjggT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhPKVxuICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHNcbn0pO1xuXG4vLyAyNC4zLjIgSlNPTi5zdHJpbmdpZnkodmFsdWUgWywgcmVwbGFjZXIgWywgc3BhY2VdXSlcbiRKU09OICYmICRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKCFVU0VfTkFUSVZFIHx8ICRmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHZhciBTID0gJFN5bWJvbCgpO1xuICAvLyBNUyBFZGdlIGNvbnZlcnRzIHN5bWJvbCB2YWx1ZXMgdG8gSlNPTiBhcyB7fVxuICAvLyBXZWJLaXQgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIG51bGxcbiAgLy8gVjggdGhyb3dzIG9uIGJveGVkIHN5bWJvbHNcbiAgcmV0dXJuIF9zdHJpbmdpZnkoW1NdKSAhPSAnW251bGxdJyB8fCBfc3RyaW5naWZ5KHsgYTogUyB9KSAhPSAne30nIHx8IF9zdHJpbmdpZnkoT2JqZWN0KFMpKSAhPSAne30nO1xufSkpLCAnSlNPTicsIHtcbiAgc3RyaW5naWZ5OiBmdW5jdGlvbiBzdHJpbmdpZnkoaXQpIHtcbiAgICBpZiAoaXQgPT09IHVuZGVmaW5lZCB8fCBpc1N5bWJvbChpdCkpIHJldHVybjsgLy8gSUU4IHJldHVybnMgc3RyaW5nIG9uIHVuZGVmaW5lZFxuICAgIHZhciBhcmdzID0gW2l0XTtcbiAgICB2YXIgaSA9IDE7XG4gICAgdmFyIHJlcGxhY2VyLCAkcmVwbGFjZXI7XG4gICAgd2hpbGUgKGFyZ3VtZW50cy5sZW5ndGggPiBpKSBhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xuICAgIHJlcGxhY2VyID0gYXJnc1sxXTtcbiAgICBpZiAodHlwZW9mIHJlcGxhY2VyID09ICdmdW5jdGlvbicpICRyZXBsYWNlciA9IHJlcGxhY2VyO1xuICAgIGlmICgkcmVwbGFjZXIgfHwgIWlzQXJyYXkocmVwbGFjZXIpKSByZXBsYWNlciA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICBpZiAoJHJlcGxhY2VyKSB2YWx1ZSA9ICRyZXBsYWNlci5jYWxsKHRoaXMsIGtleSwgdmFsdWUpO1xuICAgICAgaWYgKCFpc1N5bWJvbCh2YWx1ZSkpIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICAgIGFyZ3NbMV0gPSByZXBsYWNlcjtcbiAgICByZXR1cm4gX3N0cmluZ2lmeS5hcHBseSgkSlNPTiwgYXJncyk7XG4gIH1cbn0pO1xuXG4vLyAxOS40LjMuNCBTeW1ib2wucHJvdG90eXBlW0BAdG9QcmltaXRpdmVdKGhpbnQpXG4kU3ltYm9sW1BST1RPVFlQRV1bVE9fUFJJTUlUSVZFXSB8fCByZXF1aXJlKCcuL19oaWRlJykoJFN5bWJvbFtQUk9UT1RZUEVdLCBUT19QUklNSVRJVkUsICRTeW1ib2xbUFJPVE9UWVBFXS52YWx1ZU9mKTtcbi8vIDE5LjQuMy41IFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKCRTeW1ib2wsICdTeW1ib2wnKTtcbi8vIDIwLjIuMS45IE1hdGhbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKE1hdGgsICdNYXRoJywgdHJ1ZSk7XG4vLyAyNC4zLjMgSlNPTltAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoZ2xvYmFsLkpTT04sICdKU09OJywgdHJ1ZSk7XG4iLCIvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL3Byb3Bvc2FsLXNldG1hcC1vZmZyb20vI3NlYy1tYXAuZnJvbVxucmVxdWlyZSgnLi9fc2V0LWNvbGxlY3Rpb24tZnJvbScpKCdNYXAnKTtcbiIsIi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vcHJvcG9zYWwtc2V0bWFwLW9mZnJvbS8jc2VjLW1hcC5vZlxucmVxdWlyZSgnLi9fc2V0LWNvbGxlY3Rpb24tb2YnKSgnTWFwJyk7XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuUiwgJ01hcCcsIHsgdG9KU09OOiByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXRvLWpzb24nKSgnTWFwJykgfSk7XG4iLCIvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL3Byb3Bvc2FsLXNldG1hcC1vZmZyb20vI3NlYy1zZXQuZnJvbVxucmVxdWlyZSgnLi9fc2V0LWNvbGxlY3Rpb24tZnJvbScpKCdTZXQnKTtcbiIsIi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vcHJvcG9zYWwtc2V0bWFwLW9mZnJvbS8jc2VjLXNldC5vZlxucmVxdWlyZSgnLi9fc2V0LWNvbGxlY3Rpb24tb2YnKSgnU2V0Jyk7XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuUiwgJ1NldCcsIHsgdG9KU09OOiByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXRvLWpzb24nKSgnU2V0JykgfSk7XG4iLCJyZXF1aXJlKCcuL193a3MtZGVmaW5lJykoJ2FzeW5jSXRlcmF0b3InKTtcbiIsInJlcXVpcmUoJy4vX3drcy1kZWZpbmUnKSgnb2JzZXJ2YWJsZScpO1xuIiwicmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIFRPX1NUUklOR19UQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxudmFyIERPTUl0ZXJhYmxlcyA9ICgnQ1NTUnVsZUxpc3QsQ1NTU3R5bGVEZWNsYXJhdGlvbixDU1NWYWx1ZUxpc3QsQ2xpZW50UmVjdExpc3QsRE9NUmVjdExpc3QsRE9NU3RyaW5nTGlzdCwnICtcbiAgJ0RPTVRva2VuTGlzdCxEYXRhVHJhbnNmZXJJdGVtTGlzdCxGaWxlTGlzdCxIVE1MQWxsQ29sbGVjdGlvbixIVE1MQ29sbGVjdGlvbixIVE1MRm9ybUVsZW1lbnQsSFRNTFNlbGVjdEVsZW1lbnQsJyArXG4gICdNZWRpYUxpc3QsTWltZVR5cGVBcnJheSxOYW1lZE5vZGVNYXAsTm9kZUxpc3QsUGFpbnRSZXF1ZXN0TGlzdCxQbHVnaW4sUGx1Z2luQXJyYXksU1ZHTGVuZ3RoTGlzdCxTVkdOdW1iZXJMaXN0LCcgK1xuICAnU1ZHUGF0aFNlZ0xpc3QsU1ZHUG9pbnRMaXN0LFNWR1N0cmluZ0xpc3QsU1ZHVHJhbnNmb3JtTGlzdCxTb3VyY2VCdWZmZXJMaXN0LFN0eWxlU2hlZXRMaXN0LFRleHRUcmFja0N1ZUxpc3QsJyArXG4gICdUZXh0VHJhY2tMaXN0LFRvdWNoTGlzdCcpLnNwbGl0KCcsJyk7XG5cbmZvciAodmFyIGkgPSAwOyBpIDwgRE9NSXRlcmFibGVzLmxlbmd0aDsgaSsrKSB7XG4gIHZhciBOQU1FID0gRE9NSXRlcmFibGVzW2ldO1xuICB2YXIgQ29sbGVjdGlvbiA9IGdsb2JhbFtOQU1FXTtcbiAgdmFyIHByb3RvID0gQ29sbGVjdGlvbiAmJiBDb2xsZWN0aW9uLnByb3RvdHlwZTtcbiAgaWYgKHByb3RvICYmICFwcm90b1tUT19TVFJJTkdfVEFHXSkgaGlkZShwcm90bywgVE9fU1RSSU5HX1RBRywgTkFNRSk7XG4gIEl0ZXJhdG9yc1tOQU1FXSA9IEl0ZXJhdG9ycy5BcnJheTtcbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuICgnICsgZXIgKyAnKScpO1xuICAgICAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAodGhpcy5fZXZlbnRzKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgICBpZiAoaXNGdW5jdGlvbihldmxpc3RlbmVyKSlcbiAgICAgIHJldHVybiAxO1xuICAgIGVsc2UgaWYgKGV2bGlzdGVuZXIpXG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsIi8vIFRoaXMgbWV0aG9kIG9mIG9idGFpbmluZyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdCBuZWVkcyB0byBiZVxuLy8ga2VwdCBpZGVudGljYWwgdG8gdGhlIHdheSBpdCBpcyBvYnRhaW5lZCBpbiBydW50aW1lLmpzXG52YXIgZyA9IChmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMgfSkoKSB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XG5cbi8vIFVzZSBgZ2V0T3duUHJvcGVydHlOYW1lc2AgYmVjYXVzZSBub3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgY2FsbGluZ1xuLy8gYGhhc093blByb3BlcnR5YCBvbiB0aGUgZ2xvYmFsIGBzZWxmYCBvYmplY3QgaW4gYSB3b3JrZXIuIFNlZSAjMTgzLlxudmFyIGhhZFJ1bnRpbWUgPSBnLnJlZ2VuZXJhdG9yUnVudGltZSAmJlxuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhnKS5pbmRleE9mKFwicmVnZW5lcmF0b3JSdW50aW1lXCIpID49IDA7XG5cbi8vIFNhdmUgdGhlIG9sZCByZWdlbmVyYXRvclJ1bnRpbWUgaW4gY2FzZSBpdCBuZWVkcyB0byBiZSByZXN0b3JlZCBsYXRlci5cbnZhciBvbGRSdW50aW1lID0gaGFkUnVudGltZSAmJiBnLnJlZ2VuZXJhdG9yUnVudGltZTtcblxuLy8gRm9yY2UgcmVldmFsdXRhdGlvbiBvZiBydW50aW1lLmpzLlxuZy5yZWdlbmVyYXRvclJ1bnRpbWUgPSB1bmRlZmluZWQ7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vcnVudGltZVwiKTtcblxuaWYgKGhhZFJ1bnRpbWUpIHtcbiAgLy8gUmVzdG9yZSB0aGUgb3JpZ2luYWwgcnVudGltZS5cbiAgZy5yZWdlbmVyYXRvclJ1bnRpbWUgPSBvbGRSdW50aW1lO1xufSBlbHNlIHtcbiAgLy8gUmVtb3ZlIHRoZSBnbG9iYWwgcHJvcGVydHkgYWRkZWQgYnkgcnVudGltZS5qcy5cbiAgdHJ5IHtcbiAgICBkZWxldGUgZy5yZWdlbmVyYXRvclJ1bnRpbWU7XG4gIH0gY2F0Y2goZSkge1xuICAgIGcucmVnZW5lcmF0b3JSdW50aW1lID0gdW5kZWZpbmVkO1xuICB9XG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBodHRwczovL3Jhdy5naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL21hc3Rlci9MSUNFTlNFIGZpbGUuIEFuXG4gKiBhZGRpdGlvbmFsIGdyYW50IG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW5cbiAqIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4hKGZ1bmN0aW9uKGdsb2JhbCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIHZhciBpbk1vZHVsZSA9IHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCI7XG4gIHZhciBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZTtcbiAgaWYgKHJ1bnRpbWUpIHtcbiAgICBpZiAoaW5Nb2R1bGUpIHtcbiAgICAgIC8vIElmIHJlZ2VuZXJhdG9yUnVudGltZSBpcyBkZWZpbmVkIGdsb2JhbGx5IGFuZCB3ZSdyZSBpbiBhIG1vZHVsZSxcbiAgICAgIC8vIG1ha2UgdGhlIGV4cG9ydHMgb2JqZWN0IGlkZW50aWNhbCB0byByZWdlbmVyYXRvclJ1bnRpbWUuXG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IHJ1bnRpbWU7XG4gICAgfVxuICAgIC8vIERvbid0IGJvdGhlciBldmFsdWF0aW5nIHRoZSByZXN0IG9mIHRoaXMgZmlsZSBpZiB0aGUgcnVudGltZSB3YXNcbiAgICAvLyBhbHJlYWR5IGRlZmluZWQgZ2xvYmFsbHkuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRGVmaW5lIHRoZSBydW50aW1lIGdsb2JhbGx5IChhcyBleHBlY3RlZCBieSBnZW5lcmF0ZWQgY29kZSkgYXMgZWl0aGVyXG4gIC8vIG1vZHVsZS5leHBvcnRzIChpZiB3ZSdyZSBpbiBhIG1vZHVsZSkgb3IgYSBuZXcsIGVtcHR5IG9iamVjdC5cbiAgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWUgPSBpbk1vZHVsZSA/IG1vZHVsZS5leHBvcnRzIDoge307XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQgYW5kIG91dGVyRm4ucHJvdG90eXBlIGlzIGEgR2VuZXJhdG9yLCB0aGVuIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yLlxuICAgIHZhciBwcm90b0dlbmVyYXRvciA9IG91dGVyRm4gJiYgb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IgPyBvdXRlckZuIDogR2VuZXJhdG9yO1xuICAgIHZhciBnZW5lcmF0b3IgPSBPYmplY3QuY3JlYXRlKHByb3RvR2VuZXJhdG9yLnByb3RvdHlwZSk7XG4gICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSk7XG5cbiAgICAvLyBUaGUgLl9pbnZva2UgbWV0aG9kIHVuaWZpZXMgdGhlIGltcGxlbWVudGF0aW9ucyBvZiB0aGUgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzLlxuICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cbiAgcnVudGltZS53cmFwID0gd3JhcDtcblxuICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cbiAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG4gIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcbiAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcbiAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG4gIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG4gICAgfVxuICB9XG5cbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXG4gIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcbiAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXG4gIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cbiAgLy8gVGhpcyBpcyBhIHBvbHlmaWxsIGZvciAlSXRlcmF0b3JQcm90b3R5cGUlIGZvciBlbnZpcm9ubWVudHMgdGhhdFxuICAvLyBkb24ndCBuYXRpdmVseSBzdXBwb3J0IGl0LlxuICB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcbiAgSXRlcmF0b3JQcm90b3R5cGVbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcbiAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG4gICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR3AuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGVbdG9TdHJpbmdUYWdTeW1ib2xdID1cbiAgICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcblxuICAvLyBIZWxwZXIgZm9yIGRlZmluaW5nIHRoZSAubmV4dCwgLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzIG9mIHRoZVxuICAvLyBJdGVyYXRvciBpbnRlcmZhY2UgaW4gdGVybXMgb2YgYSBzaW5nbGUgLl9pbnZva2UgbWV0aG9kLlxuICBmdW5jdGlvbiBkZWZpbmVJdGVyYXRvck1ldGhvZHMocHJvdG90eXBlKSB7XG4gICAgW1wibmV4dFwiLCBcInRocm93XCIsIFwicmV0dXJuXCJdLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICBwcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKGFyZykge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBydW50aW1lLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGlmICghKHRvU3RyaW5nVGFnU3ltYm9sIGluIGdlbkZ1bikpIHtcbiAgICAgICAgZ2VuRnVuW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07XG5cbiAgLy8gV2l0aGluIHRoZSBib2R5IG9mIGFueSBhc3luYyBmdW5jdGlvbiwgYGF3YWl0IHhgIGlzIHRyYW5zZm9ybWVkIHRvXG4gIC8vIGB5aWVsZCByZWdlbmVyYXRvclJ1bnRpbWUuYXdyYXAoeClgLCBzbyB0aGF0IHRoZSBydW50aW1lIGNhbiB0ZXN0XG4gIC8vIGBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpYCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcbiAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC5cbiAgcnVudGltZS5hd3JhcCA9IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB7IF9fYXdhaXQ6IGFyZyB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlICYmXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uKHVud3JhcHBlZCkge1xuICAgICAgICAgIC8vIFdoZW4gYSB5aWVsZGVkIFByb21pc2UgaXMgcmVzb2x2ZWQsIGl0cyBmaW5hbCB2YWx1ZSBiZWNvbWVzXG4gICAgICAgICAgLy8gdGhlIC52YWx1ZSBvZiB0aGUgUHJvbWlzZTx7dmFsdWUsZG9uZX0+IHJlc3VsdCBmb3IgdGhlXG4gICAgICAgICAgLy8gY3VycmVudCBpdGVyYXRpb24uIElmIHRoZSBQcm9taXNlIGlzIHJlamVjdGVkLCBob3dldmVyLCB0aGVcbiAgICAgICAgICAvLyByZXN1bHQgZm9yIHRoaXMgaXRlcmF0aW9uIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aCB0aGUgc2FtZVxuICAgICAgICAgIC8vIHJlYXNvbi4gTm90ZSB0aGF0IHJlamVjdGlvbnMgb2YgeWllbGRlZCBQcm9taXNlcyBhcmUgbm90XG4gICAgICAgICAgLy8gdGhyb3duIGJhY2sgaW50byB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uLCBhcyBpcyB0aGUgY2FzZVxuICAgICAgICAgIC8vIHdoZW4gYW4gYXdhaXRlZCBQcm9taXNlIGlzIHJlamVjdGVkLiBUaGlzIGRpZmZlcmVuY2UgaW5cbiAgICAgICAgICAvLyBiZWhhdmlvciBiZXR3ZWVuIHlpZWxkIGFuZCBhd2FpdCBpcyBpbXBvcnRhbnQsIGJlY2F1c2UgaXRcbiAgICAgICAgICAvLyBhbGxvd3MgdGhlIGNvbnN1bWVyIHRvIGRlY2lkZSB3aGF0IHRvIGRvIHdpdGggdGhlIHlpZWxkZWRcbiAgICAgICAgICAvLyByZWplY3Rpb24gKHN3YWxsb3cgaXQgYW5kIGNvbnRpbnVlLCBtYW51YWxseSAudGhyb3cgaXQgYmFja1xuICAgICAgICAgIC8vIGludG8gdGhlIGdlbmVyYXRvciwgYWJhbmRvbiBpdGVyYXRpb24sIHdoYXRldmVyKS4gV2l0aFxuICAgICAgICAgIC8vIGF3YWl0LCBieSBjb250cmFzdCwgdGhlcmUgaXMgbm8gb3Bwb3J0dW5pdHkgdG8gZXhhbWluZSB0aGVcbiAgICAgICAgICAvLyByZWplY3Rpb24gcmVhc29uIG91dHNpZGUgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgc28gdGhlXG4gICAgICAgICAgLy8gb25seSBvcHRpb24gaXMgdG8gdGhyb3cgaXQgZnJvbSB0aGUgYXdhaXQgZXhwcmVzc2lvbiwgYW5kXG4gICAgICAgICAgLy8gbGV0IHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24gaGFuZGxlIHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG4gICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG4gIEFzeW5jSXRlcmF0b3IucHJvdG90eXBlW2FzeW5jSXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBydW50aW1lLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBydW50aW1lLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdClcbiAgICApO1xuXG4gICAgcmV0dXJuIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKVxuICAgICAgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICAgICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcbiAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG4gIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG4gICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvci5yZXR1cm4pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBHcFt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvclwiO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIHJ1bnRpbWUua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBydW50aW1lLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG4gICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cbiAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xufSkoXG4gIC8vIEluIHNsb3BweSBtb2RlLCB1bmJvdW5kIGB0aGlzYCByZWZlcnMgdG8gdGhlIGdsb2JhbCBvYmplY3QsIGZhbGxiYWNrIHRvXG4gIC8vIEZ1bmN0aW9uIGNvbnN0cnVjdG9yIGlmIHdlJ3JlIGluIGdsb2JhbCBzdHJpY3QgbW9kZS4gVGhhdCBpcyBzYWRseSBhIGZvcm1cbiAgLy8gb2YgaW5kaXJlY3QgZXZhbCB3aGljaCB2aW9sYXRlcyBDb250ZW50IFNlY3VyaXR5IFBvbGljeS5cbiAgKGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcyB9KSgpIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKVxuKTtcbiJdfQ==
