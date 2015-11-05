(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.wavesUI = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreNamespace = require('../core/namespace');

var _coreNamespace2 = _interopRequireDefault(_coreNamespace);

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

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

var AxisLayer = (function (_Layer) {
  _inherits(AxisLayer, _Layer);

  /**
   * @param {Function} generator - A function to create data according to
   *    the `Timeline~timeContext`.
   * @param {Object} options - Layer options, cf. Layer for available options.
   */

  function AxisLayer(generator, options) {
    _classCallCheck(this, AxisLayer);

    _get(Object.getPrototypeOf(AxisLayer.prototype), 'constructor', this).call(this, 'entity', [], options);
    this._generator = generator;
  }

  /** @private */

  _createClass(AxisLayer, [{
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
      this._renderingContext.width = this.timeContext.timeToPixel(this.timeContext.duration);

      // for foreign object issue in chrome
      this._renderingContext.offsetX = this.timeContext.timeToPixel(this.timeContext.offset);

      // expose some timeline attributes - allow to improve perf in some cases - cf. Waveform
      this._renderingContext.trackOffsetX = this.timeContext.timeToPixel(this.timeContext.offset);
      this._renderingContext.visibleWidth = this.timeContext.visibleWidth;
    }

    /**
     * Generates the data and update the layer.
     */
  }, {
    key: 'update',
    value: function update() {
      this._generateData();
      _get(Object.getPrototypeOf(AxisLayer.prototype), 'update', this).call(this);
    }

    /**
     * Render the DOM in memory on layer creation to be able to use it before
     * the layer is actually inserted in the DOM
     */
  }, {
    key: '_renderContainer',
    value: function _renderContainer() {
      // wrapper group for `start, top and context flip matrix
      this.$el = document.createElementNS(_coreNamespace2['default'], 'g');
      if (this.params.className !== null) {
        this.$el.classList.add('layer', this.params.className);
      }

      // group to apply offset
      this.$offset = document.createElementNS(_coreNamespace2['default'], 'g');
      this.$offset.classList.add('offset', 'items');
      // layer background
      this.$background = document.createElementNS(_coreNamespace2['default'], 'rect');
      this.$background.setAttributeNS(null, 'height', '100%');
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
      // matrix to invert the coordinate system
      var translateMatrix = 'matrix(1, 0, 0, -1, 0, ' + (top + height) + ')';
      this.$el.setAttributeNS(null, 'transform', translateMatrix);

      this.$background.setAttributeNS(null, 'width', height);
    }
  }, {
    key: 'stretchRatio',
    set: function set(value) {
      return;
    },

    /** @private */

    /** @private */
    get: function get() {
      return;
    }

    /** @private */
  }, {
    key: 'offset',
    set: function set(value) {
      return;
    },

    /** @private */
    get: function get() {
      return;
    }

    /** @private */
  }, {
    key: 'start',
    set: function set(value) {
      return;
    },

    /** @private */
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
    },

    /**
     * The generator that creates the data to be rendered to display the axis.
     *
     * @type {Function}
     */
    get: function get() {
      return this._generator;
    }
  }]);

  return AxisLayer;
})(_coreLayer2['default']);

exports['default'] = AxisLayer;
module.exports = exports['default'];

},{"../core/layer":11,"../core/namespace":12,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],2:[function(require,module,exports){
/**
 * A generator to create data for grid axis according to a `bpm` and a `meter`.
 *
 * [example usage](./examples/layer-axis.html)
 *
 * @param {Number} bpm - The number of beats per minutes.
 * @param {String} signature - The meter of the mesure (`'4/4'`, `'3/8'`, ...).
 * @return {Function} - The configured function returning the data when called.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = gridAxisGenerator;

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

module.exports = exports['default'];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = timeAxisGenerator;

var _utilsFormat = require('../utils/format');

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
    var step = undefined,
        type = undefined,
        toFixed = undefined,
        markerModulo = undefined,
        includeModulo = undefined;

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
        var _min = (0, _utilsFormat.padLeft)(date.getMinutes(), 0, 2);
        var sec = (0, _utilsFormat.padLeft)(date.getSeconds(), 0, 2);
        var milli = (0, _utilsFormat.padLeft)(date.getMilliseconds(), 0, 3);
        var label = _min + ':' + sec + ':' + milli;

        datum.label = label;
      }

      data.push(datum);
    }

    return data;
  };
}

module.exports = exports['default'];

},{"../utils/format":52}],4:[function(require,module,exports){
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
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _Set = require('babel-runtime/core-js/set')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var BaseBehavior = (function () {
  function BaseBehavior() {
    _classCallCheck(this, BaseBehavior);

    this._selectedItems = new _Set(); // no duplicate in Set
    this._selectedClass = null;
    this._layer = null;
  }

  _createClass(BaseBehavior, [{
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
      this._selectedItems['delete']($item);
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
    },

    /**
     * The class to add to the shapes when selected.
     *
     * @type {String}
     */
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
      return [].concat(_toConsumableArray(this._selectedItems));
    }
  }]);

  return BaseBehavior;
})();

exports['default'] = BaseBehavior;
module.exports = exports['default'];

},{"babel-runtime/core-js/set":67,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/to-consumable-array":76}],5:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseBehavior = require('./base-behavior');

var _baseBehavior2 = _interopRequireDefault(_baseBehavior);

/**
 * Defines the default behavior for a breakpoint function.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */

var BreakpointBehavior = (function (_BaseBehavior) {
  _inherits(BreakpointBehavior, _BaseBehavior);

  function BreakpointBehavior() {
    _classCallCheck(this, BreakpointBehavior);

    _get(Object.getPrototypeOf(BreakpointBehavior.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(BreakpointBehavior, [{
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
})(_baseBehavior2['default']);

exports['default'] = BreakpointBehavior;
module.exports = exports['default'];

},{"./base-behavior":4,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],6:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseBehavior = require('./base-behavior');

var _baseBehavior2 = _interopRequireDefault(_baseBehavior);

/**
 * Defines the default behavior for a marker.
 *
 * [example usage](./examples/layer-marker.html)
 */

var MarkerBehavior = (function (_BaseBehavior) {
  _inherits(MarkerBehavior, _BaseBehavior);

  function MarkerBehavior() {
    _classCallCheck(this, MarkerBehavior);

    _get(Object.getPrototypeOf(MarkerBehavior.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(MarkerBehavior, [{
    key: 'edit',
    value: function edit(renderingContext, shape, datum, dx, dy, target) {
      var x = renderingContext.timeToPixel(shape.x(datum));
      var targetX = x + dx > 0 ? x + dx : 0;

      shape.x(datum, renderingContext.timeToPixel.invert(targetX));
    }
  }]);

  return MarkerBehavior;
})(_baseBehavior2['default']);

exports['default'] = MarkerBehavior;
module.exports = exports['default'];

},{"./base-behavior":4,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],7:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseBehavior = require('./base-behavior');

var _baseBehavior2 = _interopRequireDefault(_baseBehavior);

/**
 * Defines the default behavior for a segment.
 *
 * [example usage](./examples/layer-marker.html)
 */

var SegmentBehavior = (function (_BaseBehavior) {
  _inherits(SegmentBehavior, _BaseBehavior);

  function SegmentBehavior() {
    _classCallCheck(this, SegmentBehavior);

    _get(Object.getPrototypeOf(SegmentBehavior.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SegmentBehavior, [{
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
})(_baseBehavior2['default']);

exports['default'] = SegmentBehavior;
module.exports = exports['default'];

},{"./base-behavior":4,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],8:[function(require,module,exports){
/**
 * TimeContextBehavior is used internally in Layers to modify their TimeContext.
 * This object is different from other Shapes Behaviors and exists mostly to decrease the size of the Layer.
 * All the code here could be considered as part of the layer.
 */
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var TimeContextBehavior = (function () {
  function TimeContextBehavior() {
    _classCallCheck(this, TimeContextBehavior);
  }

  _createClass(TimeContextBehavior, [{
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
})();

exports['default'] = TimeContextBehavior;
module.exports = exports['default'];

},{"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71}],9:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseBehavior = require('./base-behavior');

var _baseBehavior2 = _interopRequireDefault(_baseBehavior);

/**
 * Defines the default behavior for a trace visualization.
 *
 * [example usage](./examples/layer-trace.html)
 */

var TraceBehavior = (function (_BaseBehavior) {
  _inherits(TraceBehavior, _BaseBehavior);

  function TraceBehavior() {
    _classCallCheck(this, TraceBehavior);

    _get(Object.getPrototypeOf(TraceBehavior.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(TraceBehavior, [{
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
})(_baseBehavior2['default']);

exports['default'] = TraceBehavior;
module.exports = exports['default'];

},{"./base-behavior":4,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],10:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utilsScales = require('../utils/scales');

var _utilsScales2 = _interopRequireDefault(_utilsScales);

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

var LayerTimeContext = (function () {
  /**
   * @param {TimelineTimeContext} parent - The `TimelineTimeContext` instance of the timeline.
   */

  function LayerTimeContext(parent) {
    _classCallCheck(this, LayerTimeContext);

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

  _createClass(LayerTimeContext, [{
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
    },

    /**
     * Sets the start position of the time context (in seconds).
     *
     * @type {Number}
     */
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
    },

    /**
     * Sets the duration of the time context (in seconds).
     *
     * @type {Number}
     */
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
    },

    /**
     * Sets the offset of the time context (in seconds).
     *
     * @type {Number}
     */
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
    },

    /**
     * Sets the stretch ratio of the time context.
     *
     * @type {Number}
     */
    set: function set(value) {
      // remove local scale if ratio = 1
      if (value === 1) {
        this._timeToPixel = null;
        return;
      }
      // reuse previsously created local scale if exists
      var timeToPixel = this._timeToPixel ? this._timeToPixel : _utilsScales2['default'].linear().domain([0, 1]);

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
      if (!this._timeToPixel) {
        return this.parent.timeToPixel;
      }

      return this._timeToPixel;
    }
  }]);

  return LayerTimeContext;
})();

exports['default'] = LayerTimeContext;
module.exports = exports['default'];

},{"../utils/scales":54,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/interop-require-default":74}],11:[function(require,module,exports){
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

},{"../behaviors/time-context-behavior":8,"../shapes/segment":39,"../utils/scales":54,"./namespace":12,"babel-runtime/core-js/array/from":56,"babel-runtime/core-js/get-iterator":57,"babel-runtime/core-js/map":59,"babel-runtime/core-js/object/assign":60,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74,"babel-runtime/helpers/sliced-to-array":75,"events":168}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = 'http://www.w3.org/2000/svg';
module.exports = exports['default'];

},{}],13:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utilsScales = require('../utils/scales');

var _utilsScales2 = _interopRequireDefault(_utilsScales);

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

var TimelineTimeContext = (function () {
  /**
   * @param {Number} pixelsPerSecond - The number of pixels that should be
   *    used to display one second.
   * @param {Number} visibleWidth - The default with of the visible area
   *    displayed in `tracks` (in pixels).
   */

  function TimelineTimeContext(pixelsPerSecond, visibleWidth) {
    _classCallCheck(this, TimelineTimeContext);

    this._children = [];

    this._timeToPixel = null;
    this._offset = 0;
    this._zoom = 1;
    this._computedPixelsPerSecond = pixelsPerSecond;
    // params
    this._visibleWidth = visibleWidth;
    this._maintainVisibleDuration = false;

    // create the timeToPixel scale
    var scale = _utilsScales2['default'].linear().domain([0, 1]).range([0, pixelsPerSecond]);

    this._timeToPixel = scale;

    this._originalPixelsPerSecond = this._computedPixelsPerSecond;
  }

  /**
   * Returns the number of pixels per seconds ignoring the current zoom value.
   *
   * @type {Number}
   */

  _createClass(TimelineTimeContext, [{
    key: '_updateTimeToPixelRange',
    value: function _updateTimeToPixelRange() {
      this.timeToPixel.range([0, this._computedPixelsPerSecond]);
    }
  }, {
    key: 'pixelsPerSecond',
    get: function get() {
      return this._originalPixelsPerSecond;
    },

    /**
     * Updates all the caracteristics of this object according to the new
     * given value of pixels per seconds. Propagates the changes to the
     * `LayerTimeContext` children.
     *
     * @type {Number}
     */
    set: function set(value) {
      this._computedPixelsPerSecond = value * this.zoom;
      this._originalPixelsPerSecond = value;
      this._updateTimeToPixelRange();

      // force children scale update
      this._children.forEach(function (child) {
        if (child.stretchRatio === 1) {
          return;
        }
        child.stretchRatio = child.stretchRatio;
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
    },

    /**
     * Sets the offset to apply to the registered `Track` instances from origin
     * (in seconds).
     *
     * @type {Number}
     */
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
    },

    /**
     * Sets the zoom ratio for the whole visualization.
     *
     * @type {Number}
     */
    set: function set(value) {
      // Compute change to propagate to children who have their own timeToPixel
      var ratioChange = value / this._zoom;
      this._zoom = value;
      this._computedPixelsPerSecond = this._originalPixelsPerSecond * value;
      this._updateTimeToPixelRange();

      this._children.forEach(function (child) {
        if (child.stretchRatio === 1) {
          return;
        }
        child.stretchRatio = child.stretchRatio * ratioChange;
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
    },

    /**
     * Sets the visible width of the `Track` instances.
     *
     * @type {Number}
     */
    set: function set(value) {
      var widthRatio = value / this.visibleWidth;
      this._visibleWidth = value;

      if (this.maintainVisibleDuration) {
        this.pixelsPerSecond = this._computedPixelsPerSecond * widthRatio;
      }
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
    },

    /**
     * Defines if the duration displayed by tracks should be maintained when
     * their width is updated.
     *
     * @type {Boolean}
     */
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
})();

exports['default'] = TimelineTimeContext;
module.exports = exports['default'];

},{"../utils/scales":54,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/interop-require-default":74}],14:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Symbol$iterator = require('babel-runtime/core-js/symbol/iterator')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _interactionsKeyboard = require('../interactions/keyboard');

var _interactionsKeyboard2 = _interopRequireDefault(_interactionsKeyboard);

var _layerTimeContext = require('./layer-time-context');

var _layerTimeContext2 = _interopRequireDefault(_layerTimeContext);

var _interactionsSurface = require('../interactions/surface');

var _interactionsSurface2 = _interopRequireDefault(_interactionsSurface);

var _timelineTimeContext = require('./timeline-time-context');

var _timelineTimeContext2 = _interopRequireDefault(_timelineTimeContext);

var _track2 = require('./track');

var _track3 = _interopRequireDefault(_track2);

var _trackCollection = require('./track-collection');

var _trackCollection2 = _interopRequireDefault(_trackCollection);

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

var Timeline = (function (_events$EventEmitter) {
  _inherits(Timeline, _events$EventEmitter);

  /**
   * @param {Number} [pixelsPerSecond=100] - the default scaling between time and pixels.
   * @param {Number} [visibleWidth=1000] - the default visible area for all registered tracks.
   */

  function Timeline() {
    var pixelsPerSecond = arguments.length <= 0 || arguments[0] === undefined ? 100 : arguments[0];
    var visibleWidth = arguments.length <= 1 || arguments[1] === undefined ? 1000 : arguments[1];

    var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var _ref$registerKeyboard = _ref.registerKeyboard;
    var registerKeyboard = _ref$registerKeyboard === undefined ? true : _ref$registerKeyboard;

    _classCallCheck(this, Timeline);

    _get(Object.getPrototypeOf(Timeline.prototype), 'constructor', this).call(this);

    this._tracks = new _trackCollection2['default'](this);
    this._state = null;

    // default interactions
    this._surfaceCtor = _interactionsSurface2['default'];

    if (registerKeyboard) {
      this.createInteraction(_interactionsKeyboard2['default'], document);
    }

    // stores
    this._trackById = {};
    this._groupedLayers = {};

    /** @type {TimelineTimeContext} - master time context for the visualization. */
    this.timeContext = new _timelineTimeContext2['default'](pixelsPerSecond, visibleWidth);
  }

  /**
   * Returns `TimelineTimeContext`'s `offset` time domain value.
   *
   * @type {Number} [offset=0]
   */

  _createClass(Timeline, [{
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
      var _this = this;

      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var interaction = new ctor($el, options);
      interaction.on('event', function (e) {
        return _this._handleEvent(e);
      });
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
        var br = layer.$el.getBoundingClientRect();

        if (clientX > br.left && clientX < br.right && clientY > br.top && clientY < br.bottom) {
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
      if (!this._state) {
        return;
      }
      this._state.handleEvent(e, hitLayers);
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
      var trackId = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      if (this.tracks.indexOf(track) !== -1) {
        throw new Error('track already added to the timeline');
      }

      this._registerTrackId(track, trackId);
      track.configure(this.timeContext);

      this.tracks.push(track);
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
    value: function remove(track) {}
    // should destroy interaction too, avoid ghost eventListeners

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
      var trackHeight = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];
      var trackId = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      var track = new _track3['default']($el, trackHeight);
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
      var groupId = arguments.length <= 2 || arguments[2] === undefined ? 'default' : arguments[2];
      var isAxis = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

      var track = trackOrTrackId;

      if (typeof trackOrTrackId === 'string') {
        track = this.getTrackById(trackOrTrackId);
      }

      // creates the `LayerTimeContext` if not present
      if (!layer.timeContext) {
        var timeContext = isAxis ? this.timeContext : new _layerTimeContext2['default'](this.timeContext);

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

    /**
     * Iterates through the added tracks.
     */
  }, {
    key: _Symbol$iterator,
    value: _regeneratorRuntime.mark(function value() {
      return _regeneratorRuntime.wrap(function value$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.delegateYield(_getIterator(this.tracks), 't0', 1);

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, value, this);
    })
  }, {
    key: 'offset',
    get: function get() {
      return this.timeContext.offset;
    },

    /**
     * Updates `TimelineTimeContext`'s `offset` time domain value.
     *
     * @type {Number} [offset=0]
     */
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
    },

    /**
     * Updates the `TimelineTimeContext`'s `zoom` value.
     *
     * @type {Number} [offset=0]
     */
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
    },

    /**
     * Updates the `TimelineTimeContext`'s `pixelsPerSecond` ratio.
     *
     * @type {Number} [offset=0]
     */
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
    },

    /**
     * Updates the `TimelineTimeContext`'s `visibleWidth` pixel domain value.
     *
     * @type {Number} [offset=0]
     */
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
    },

    /**
     * Returns `TimelineTimeContext`'s `maintainVisibleDuration` current value.
     *
     * @type {Boolean}
     */
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
      if (this._state) {
        this._state.exit();
      }
      this._state = state;
      if (this._state) {
        this._state.enter();
      }
    },

    /**
     * Returns the current state of the timeline.
     *
     * @type {BaseState}
     */
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
})(_events2['default'].EventEmitter);

exports['default'] = Timeline;
module.exports = exports['default'];

},{"../interactions/keyboard":29,"../interactions/surface":30,"./layer-time-context":10,"./timeline-time-context":13,"./track":16,"./track-collection":15,"babel-runtime/core-js/get-iterator":57,"babel-runtime/core-js/symbol/iterator":69,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74,"babel-runtime/regenerator":166,"events":168}],15:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _layer = require('./layer');

var _layer2 = _interopRequireDefault(_layer);

/**
 * Collection hosting all the `Track` instances registered into the timeline.
 * It provides shorcuts to trigger `render` / `update` methods on tracks or
 * layers. Extend built-in Array
 */

var TrackCollection = (function (_Array) {
  _inherits(TrackCollection, _Array);

  function TrackCollection(timeline) {
    _classCallCheck(this, TrackCollection);

    _get(Object.getPrototypeOf(TrackCollection.prototype), 'constructor', this).call(this);

    this._timeline = timeline;
  }

  // @note - should be in the timeline ?
  // @todo - allow to pass an array of layers

  _createClass(TrackCollection, [{
    key: '_getLayersOrGroups',
    value: function _getLayersOrGroups() {
      var layerOrGroup = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      var layers = null;

      if (typeof layerOrGroup === 'string') {
        layers = this._timeline.groupedLayers[layerOrGroup];
      } else if (layerOrGroup instanceof _layer2['default']) {
        layers = [layerOrGroup];
      } else {
        layers = this.layers;
      }

      return layers;
    }

    // @NOTE keep this ?
    // could prepare some vertical resizing ability
    // this should be able to modify the layers yScale to be really usefull

    /**
     * @type {Number} - Updates the height of all tracks at once.
     * @todo - Propagate to layers, not usefull for now.
     */
  }, {
    key: 'render',

    /**
     * Render all tracks and layers. When done, the timeline triggers a `render` event.
     */
    value: function render() {
      this.forEach(function (track) {
        return track.render();
      });
      this._timeline.emit('render');
    }

    /**
     * Updates all tracks and layers. When done, the timeline triggers a
     * `update` event.
     *
     * @param {Layer|String} layerOrGroup - Filter the layers to update by
     *    passing the `Layer` instance to update or a `groupId`
     */
  }, {
    key: 'update',
    value: function update(layerOrGroup) {
      var layers = this._getLayersOrGroups(layerOrGroup);
      this.forEach(function (track) {
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
      this.forEach(function (track) {
        return track.updateContainer();
      });
      this._timeline.emit('update:containers');
    }

    /**
     * Updates all layers. When done, the timeline triggers a `update:layers` event.
     *
     * @param {Layer|String} layerOrGroup - Filter the layers to update by
     *    passing the `Layer` instance to update or a `groupId`
     */
  }, {
    key: 'updateLayers',
    value: function updateLayers(layerOrGroup) {
      var layers = this._getLayersOrGroups(layerOrGroup);
      this.forEach(function (track) {
        return track.updateLayers(layers);
      });
      this._timeline.emit('update:layers', layers);
    }
  }, {
    key: 'height',
    set: function set(value) {
      this.forEach(function (track) {
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
      this.forEach(function (track) {
        return layers = layers.concat(track.layers);
      });

      return layers;
    }
  }]);

  return TrackCollection;
})(Array);

exports['default'] = TrackCollection;
module.exports = exports['default'];

},{"./layer":11,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],16:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Symbol$iterator = require('babel-runtime/core-js/symbol/iterator')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _namespace = require('./namespace');

var _namespace2 = _interopRequireDefault(_namespace);

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

var Track = (function () {
  /**
   * @param {DOMElement} $el
   * @param {Number} [height = 100]
   */

  function Track($el) {
    var height = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];

    _classCallCheck(this, Track);

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

  _createClass(Track, [{
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
      var $svg = document.createElementNS(_namespace2['default'], 'svg');
      $svg.setAttributeNS(null, 'shape-rendering', 'optimizeSpeed');
      $svg.setAttributeNS(null, 'height', this.height);
      $svg.setAttribute('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');
      $svg.classList.add('track');

      var $background = document.createElementNS(_namespace2['default'], 'rect');
      $background.setAttributeNS(null, 'height', '100%');
      $background.setAttributeNS(null, 'width', '100%');
      $background.style.fillOpacity = 0;
      // $background.style.pointerEvents = 'none';

      var $defs = document.createElementNS(_namespace2['default'], 'defs');

      var $offsetGroup = document.createElementNS(_namespace2['default'], 'g');
      $offsetGroup.classList.add('offset');

      var $layoutGroup = document.createElementNS(_namespace2['default'], 'g');
      $layoutGroup.classList.add('layout');

      var $interactionsGroup = document.createElementNS(_namespace2['default'], 'g');
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
      console.log(layer);
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
        for (var _iterator = _getIterator(this), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var layer = _step.value;
          layer.render();
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
     * Updates the track DOM structure and updates the layers.
     *
     * @param {Array<Layer>} [layers=null] - if not null, a subset of the layers to update.
     */
  }, {
    key: 'update',
    value: function update() {
      var layers = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

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

      var layers = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

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
    key: _Symbol$iterator,
    value: _regeneratorRuntime.mark(function value() {
      return _regeneratorRuntime.wrap(function value$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.delegateYield(_getIterator(this.layers), 't0', 1);

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, value, this);
    })
  }, {
    key: 'height',
    get: function get() {
      return this._height;
    },

    /**
     * Sets the height of the track.
     *
     * @todo propagate to layers, keeping ratio? could be handy for vertical
     *    resize. This is why a set/get is implemented here.
     * @type {Number}
     */
    set: function set(value) {
      this._height = value;
    }
  }]);

  return Track;
})();

exports['default'] = Track;
module.exports = exports['default'];

},{"./namespace":12,"babel-runtime/core-js/get-iterator":57,"babel-runtime/core-js/symbol/iterator":69,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/interop-require-default":74,"babel-runtime/regenerator":166}],17:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _shapesAnnotatedMarker = require('../shapes/annotated-marker');

var _shapesAnnotatedMarker2 = _interopRequireDefault(_shapesAnnotatedMarker);

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _behaviorsMarkerBehavior = require('../behaviors/marker-behavior');

var _behaviorsMarkerBehavior2 = _interopRequireDefault(_behaviorsMarkerBehavior);

/**
 * Helper to create a annotated marker layer
 *
 * [example usage](./examples/layer-marker.html)
 */

var AnnotatedMarkerLayer = (function (_Layer) {
  _inherits(AnnotatedMarkerLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @todo - Add accessors and options for the shape.
   */

  function AnnotatedMarkerLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, AnnotatedMarkerLayer);

    _get(Object.getPrototypeOf(AnnotatedMarkerLayer.prototype), 'constructor', this).call(this, 'collection', data, options);

    this.configureShape(_shapesAnnotatedMarker2['default']);
    this.setBehavior(new _behaviorsMarkerBehavior2['default']());
  }

  return AnnotatedMarkerLayer;
})(_coreLayer2['default']);

exports['default'] = AnnotatedMarkerLayer;
module.exports = exports['default'];

},{"../behaviors/marker-behavior":6,"../core/layer":11,"../shapes/annotated-marker":32,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],18:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesAnnotatedSegment = require('../shapes/annotated-segment');

var _shapesAnnotatedSegment2 = _interopRequireDefault(_shapesAnnotatedSegment);

var _behaviorsSegmentBehavior = require('../behaviors/segment-behavior');

var _behaviorsSegmentBehavior2 = _interopRequireDefault(_behaviorsSegmentBehavior);

/**
 * Helper to create a annotated segment layer.
 *
 * [example usage](./examples/layer-segment.html)
 */

var AnnotatedSegmentLayer = (function (_Layer) {
  _inherits(AnnotatedSegmentLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */

  function AnnotatedSegmentLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var accessors = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, AnnotatedSegmentLayer);

    _get(Object.getPrototypeOf(AnnotatedSegmentLayer.prototype), 'constructor', this).call(this, 'collection', data, options);

    options = _Object$assign({
      displayHandlers: true,
      opacity: 0.6
    }, options);

    this.configureShape(_shapesAnnotatedSegment2['default'], accessors, {
      displayHandlers: options.displayHandlers,
      opacity: options.opacity
    });

    this.setBehavior(new _behaviorsSegmentBehavior2['default']());
  }

  return AnnotatedSegmentLayer;
})(_coreLayer2['default']);

exports['default'] = AnnotatedSegmentLayer;
module.exports = exports['default'];

},{"../behaviors/segment-behavior":7,"../core/layer":11,"../shapes/annotated-segment":33,"babel-runtime/core-js/object/assign":60,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],19:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _behaviorsBreakpointBehavior = require('../behaviors/breakpoint-behavior');

var _behaviorsBreakpointBehavior2 = _interopRequireDefault(_behaviorsBreakpointBehavior);

var _shapesDot = require('../shapes/dot');

var _shapesDot2 = _interopRequireDefault(_shapesDot);

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesLine = require('../shapes/line');

var _shapesLine2 = _interopRequireDefault(_shapesLine);

/**
 * Helper to create a breakpoint function layer.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */

var BreakpointLayer = (function (_Layer) {
  _inherits(BreakpointLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */

  function BreakpointLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var accessors = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, BreakpointLayer);

    _get(Object.getPrototypeOf(BreakpointLayer.prototype), 'constructor', this).call(this, 'collection', data, options);

    var color = options.color;
    var commonShapeOptions = {};

    if (color) {
      accessors.color = function () {
        return color;
      };
      commonShapeOptions.color = color;
    }

    this.configureCommonShape(_shapesLine2['default'], accessors, commonShapeOptions);
    this.configureShape(_shapesDot2['default'], accessors, {});
    this.setBehavior(new _behaviorsBreakpointBehavior2['default']());
  }

  return BreakpointLayer;
})(_coreLayer2['default']);

exports['default'] = BreakpointLayer;
module.exports = exports['default'];

},{"../behaviors/breakpoint-behavior":5,"../core/layer":11,"../shapes/dot":36,"../shapes/line":37,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],20:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesCursor = require('../shapes/cursor');

var _shapesCursor2 = _interopRequireDefault(_shapesCursor);

/**
 * Helper to create a cursor layer.
 *
 * [example usage](./examples/layer-cursor.html)
 */

var CursorLayer = (function (_Layer) {
  _inherits(CursorLayer, _Layer);

  /**
   * @param {Object} options - An object to configure the layer.
   */

  function CursorLayer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, CursorLayer);

    var defaults = {
      color: 'red',
      hittable: false };

    // kind of pass through layer
    var data = { currentPosition: 0 };

    options = _Object$assign(defaults, options);
    _get(Object.getPrototypeOf(CursorLayer.prototype), 'constructor', this).call(this, 'entity', data, options);

    this.configureShape(_shapesCursor2['default'], { x: function x(d) {
        return d.currentPosition;
      } }, {
      color: options.color
    });
  }

  _createClass(CursorLayer, [{
    key: 'currentPosition',
    set: function set(value) {
      this.data[0].currentPosition = value;
    },
    get: function get() {
      return this.data[0].currentPosition;
    }
  }]);

  return CursorLayer;
})(_coreLayer2['default']);

exports['default'] = CursorLayer;
module.exports = exports['default'];

},{"../core/layer":11,"../shapes/cursor":35,"babel-runtime/core-js/object/assign":60,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],21:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _axisAxisLayer = require('../axis/axis-layer');

var _axisAxisLayer2 = _interopRequireDefault(_axisAxisLayer);

var _shapesTicks = require('../shapes/ticks');

var _shapesTicks2 = _interopRequireDefault(_shapesTicks);

var _axisGridAxisGenerator = require('../axis/grid-axis-generator');

var _axisGridAxisGenerator2 = _interopRequireDefault(_axisGridAxisGenerator);

/**
 * Helper to create a grid layer
 *
 * [example usage](./examples/layer-axis.html)
 */

var GridAxisLayer = (function (_AxisLayer) {
  _inherits(GridAxisLayer, _AxisLayer);

  /**
   * @param {Object} options - An object to configure the layer.
   */

  function GridAxisLayer(options) {
    _classCallCheck(this, GridAxisLayer);

    options = _Object$assign({
      color: 'steelblue',
      bpm: 60,
      signature: '4/4'
    }, options);

    _get(Object.getPrototypeOf(GridAxisLayer.prototype), 'constructor', this).call(this, (0, _axisGridAxisGenerator2['default'])(options.bpm, options.signature), options);

    this.configureShape(_shapesTicks2['default'], {}, {
      color: options.color
    });
  }

  return GridAxisLayer;
})(_axisAxisLayer2['default']);

exports['default'] = GridAxisLayer;
module.exports = exports['default'];

},{"../axis/axis-layer":1,"../axis/grid-axis-generator":2,"../shapes/ticks":40,"babel-runtime/core-js/object/assign":60,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],22:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesMarker = require('../shapes/marker');

var _shapesMarker2 = _interopRequireDefault(_shapesMarker);

var _behaviorsMarkerBehavior = require('../behaviors/marker-behavior');

var _behaviorsMarkerBehavior2 = _interopRequireDefault(_behaviorsMarkerBehavior);

/**
 * Helper to create a marker layer.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */

var MarkerLayer = (function (_Layer) {
  _inherits(MarkerLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */

  function MarkerLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var accessors = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, MarkerLayer);

    _get(Object.getPrototypeOf(MarkerLayer.prototype), 'constructor', this).call(this, 'collection', data, options);

    options = _Object$assign({ displayHandlers: true }, options);
    var color = options.color;
    if (color) {
      accessors.color = function () {
        return color;
      };
    }

    this.configureShape(_shapesMarker2['default'], accessors, {
      displayHandlers: options.displayHandlers
    });

    this.setBehavior(new _behaviorsMarkerBehavior2['default']());
  }

  return MarkerLayer;
})(_coreLayer2['default']);

exports['default'] = MarkerLayer;
module.exports = exports['default'];

},{"../behaviors/marker-behavior":6,"../core/layer":11,"../shapes/marker":38,"babel-runtime/core-js/object/assign":60,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],23:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesSegment = require('../shapes/segment');

var _shapesSegment2 = _interopRequireDefault(_shapesSegment);

var _behaviorsSegmentBehavior = require('../behaviors/segment-behavior');

var _behaviorsSegmentBehavior2 = _interopRequireDefault(_behaviorsSegmentBehavior);

/**
 * Helper to create a segment layer.
 *
 * [example usage](./examples/layer-segment.html)
 */

var SegmentLayer = (function (_Layer) {
  _inherits(SegmentLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */

  function SegmentLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var accessors = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, SegmentLayer);

    _get(Object.getPrototypeOf(SegmentLayer.prototype), 'constructor', this).call(this, 'collection', data, options);

    options = _Object$assign({
      displayHandlers: true,
      opacity: 0.6
    }, options);

    this.configureShape(_shapesSegment2['default'], accessors, {
      displayHandlers: options.displayHandlers,
      opacity: options.opacity
    });

    this.setBehavior(new _behaviorsSegmentBehavior2['default']());
  }

  return SegmentLayer;
})(_coreLayer2['default']);

exports['default'] = SegmentLayer;
module.exports = exports['default'];

},{"../behaviors/segment-behavior":7,"../core/layer":11,"../shapes/segment":39,"babel-runtime/core-js/object/assign":60,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],24:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesTicks = require('../shapes/ticks');

var _shapesTicks2 = _interopRequireDefault(_shapesTicks);

/**
 * Helper to create a tick layer. Can be seen as a grid axis with user defined data
 * or as a marker layer with entity based data.
 */

var TickLayer = (function (_Layer) {
  _inherits(TickLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */

  function TickLayer(data, options, accessors) {
    _classCallCheck(this, TickLayer);

    options = _Object$assign({}, options);

    _get(Object.getPrototypeOf(TickLayer.prototype), 'constructor', this).call(this, 'entity', data, options);

    var config = options.color ? { color: options.color } : undefined;
    this.configureShape(_shapesTicks2['default'], accessors, config);
  }

  return TickLayer;
})(_coreLayer2['default']);

exports['default'] = TickLayer;
module.exports = exports['default'];

},{"../core/layer":11,"../shapes/ticks":40,"babel-runtime/core-js/object/assign":60,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],25:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _axisAxisLayer = require('../axis/axis-layer');

var _axisAxisLayer2 = _interopRequireDefault(_axisAxisLayer);

var _shapesTicks = require('../shapes/ticks');

var _shapesTicks2 = _interopRequireDefault(_shapesTicks);

var _axisTimeAxisGenerator = require('../axis/time-axis-generator');

var _axisTimeAxisGenerator2 = _interopRequireDefault(_axisTimeAxisGenerator);

/**
 * Helper to create a time axis layer
 *
 * [example usage](./examples/layer-axis.html)
 */

var TimeAxisLayer = (function (_AxisLayer) {
  _inherits(TimeAxisLayer, _AxisLayer);

  /**
   * @param {Object} options - An object to configure the layer.
   */

  function TimeAxisLayer(options) {
    _classCallCheck(this, TimeAxisLayer);

    options = _Object$assign({ color: 'steelblue' }, options);
    _get(Object.getPrototypeOf(TimeAxisLayer.prototype), 'constructor', this).call(this, (0, _axisTimeAxisGenerator2['default'])(), options);

    this.configureShape(_shapesTicks2['default'], {}, {
      color: options.color
    });
  }

  return TimeAxisLayer;
})(_axisAxisLayer2['default']);

exports['default'] = TimeAxisLayer;
module.exports = exports['default'];

},{"../axis/axis-layer":1,"../axis/time-axis-generator":3,"../shapes/ticks":40,"babel-runtime/core-js/object/assign":60,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],26:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesTracePath = require('../shapes/trace-path');

var _shapesTracePath2 = _interopRequireDefault(_shapesTracePath);

var _shapesTraceDots = require('../shapes/trace-dots');

var _shapesTraceDots2 = _interopRequireDefault(_shapesTraceDots);

var _behaviorsTraceBehavior = require('../behaviors/trace-behavior');

var _behaviorsTraceBehavior2 = _interopRequireDefault(_behaviorsTraceBehavior);

/**
 * Helper to create a trace layer.
 *
 * [example usage](./examples/layer-trace.html)
 */

var TraceLayer = (function (_Layer) {
  _inherits(TraceLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */

  function TraceLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var accessors = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, TraceLayer);

    options = _Object$assign({ displayDots: true }, options);
    _get(Object.getPrototypeOf(TraceLayer.prototype), 'constructor', this).call(this, options.displayDots ? 'collection' : 'entity', data, options);

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
      this.configureCommonShape(_shapesTracePath2['default'], accessors, shapeOptions);
      this.configureShape(_shapesTraceDots2['default'], accessors, shapeOptions);
    } else {
      this.configureShape(_shapesTracePath2['default'], accessors, shapeOptions);
    }

    this.setBehavior(new _behaviorsTraceBehavior2['default']());
  }

  return TraceLayer;
})(_coreLayer2['default']);

exports['default'] = TraceLayer;
module.exports = exports['default'];

},{"../behaviors/trace-behavior":9,"../core/layer":11,"../shapes/trace-dots":41,"../shapes/trace-path":42,"babel-runtime/core-js/object/assign":60,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],27:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesWaveform = require('../shapes/waveform');

var _shapesWaveform2 = _interopRequireDefault(_shapesWaveform);

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

var WaveformLayer = (function (_Layer) {
  _inherits(WaveformLayer, _Layer);

  /**
   * @param {AudioBuffer} buffer - The audio buffer to display.
   * @param {Object} options - An object to configure the layer.
   */

  function WaveformLayer(buffer, options) {
    _classCallCheck(this, WaveformLayer);

    options = _Object$assign({}, defaults, options);

    _get(Object.getPrototypeOf(WaveformLayer.prototype), 'constructor', this).call(this, 'entity', buffer.getChannelData(options.channel), options);

    this.configureShape(_shapesWaveform2['default'], {}, {
      sampleRate: buffer.sampleRate,
      color: options.color,
      renderingStrategy: options.renderingStrategy
    });
  }

  return WaveformLayer;
})(_coreLayer2['default']);

exports['default'] = WaveformLayer;
module.exports = exports['default'];

},{"../core/layer":11,"../shapes/waveform":43,"babel-runtime/core-js/object/assign":60,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],28:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

/**
 * Abstract class to extend to create new sources of interactions.
 * A `Surface` and `Keyboard` event sources are provided.
 */

var EventSource = (function (_events$EventEmitter) {
  _inherits(EventSource, _events$EventEmitter);

  function EventSource($el) {
    _classCallCheck(this, EventSource);

    _get(Object.getPrototypeOf(EventSource.prototype), 'constructor', this).call(this);
    /**
     * The element on which the listener is added
     * @type {Element}
     */
    this.$el = $el;

    this._bindEvents();
  }

  _createClass(EventSource, [{
    key: '_createEvent',
    value: function _createEvent(type, e) {}
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {}
  }]);

  return EventSource;
})(_events2['default'].EventEmitter);

exports['default'] = EventSource;
module.exports = exports['default'];

},{"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74,"events":168}],29:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _eventSource = require('./event-source');

var _eventSource2 = _interopRequireDefault(_eventSource);

var _waveEvent = require('./wave-event');

var _waveEvent2 = _interopRequireDefault(_waveEvent);

/**
 * A global event sourve for the keyboard. Only one instance of this source
 * can be created. The first created timeline instanciate the singleton, each
 * subsequent instanciation returns the first created instance.
 */

var Keyboard = (function (_EventSource) {
  _inherits(Keyboard, _EventSource);

  /**
   * @param {Element} $el - The element on which to install the listener.
   */

  function Keyboard($el) {
    _classCallCheck(this, Keyboard);

    // kind of singleton
    if (Keyboard._instance) {
      return Keyboard._instance;
    }

    _get(Object.getPrototypeOf(Keyboard.prototype), 'constructor', this).call(this, $el);
    /**
     * The name of the source
     * @type {String}
     */
    this.sourceName = 'keyboard';

    Keyboard._instance = this;
  }

  _createClass(Keyboard, [{
    key: '_createEvent',
    value: function _createEvent(type, e) {
      var event = new _waveEvent2['default'](this.sourceName, type, e);

      event.shiftKey = e.shiftKey;
      event.ctrlKey = e.ctrlKey;
      event.altKey = e.altKey;
      event.metaKey = e.metaKey;
      event.char = String.fromCharCode(e.keyCode);

      return event;
    }
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this = this;

      var onKeyDown = function onKeyDown(e) {
        var event = _this._createEvent('keydown', e);
        _this.emit('event', event);
      };

      var onKeyUp = function onKeyUp(e) {
        var event = _this._createEvent('keyup', e);
        _this.emit('event', event);
      };

      this.$el.addEventListener('keydown', onKeyDown, false);
      this.$el.addEventListener('keyup', onKeyUp, false);
    }
  }]);

  return Keyboard;
})(_eventSource2['default']);

exports['default'] = Keyboard;
module.exports = exports['default'];

},{"./event-source":28,"./wave-event":31,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],30:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _eventSource = require('./event-source');

var _eventSource2 = _interopRequireDefault(_eventSource);

var _waveEvent = require('./wave-event');

var _waveEvent2 = _interopRequireDefault(_waveEvent);

/**
 * Normalizes mouse user interactions with the timeline upon the DOM
 * container element of `Track` instances. As soon as a `track` is added to a
 * `timeline`, its attached `Surface` instance will emit the mouse events.
 */

var Surface = (function (_EventSource) {
  _inherits(Surface, _EventSource);

  /**
   * @param {DOMElement} el - The DOM element to listen.
   * @todo - Add some padding to the surface.
   */

  function Surface($el) {
    _classCallCheck(this, Surface);

    _get(Object.getPrototypeOf(Surface.prototype), 'constructor', this).call(this, $el);

    /**
     * The name of the event source.
     * @type {String}
     */
    this.sourceName = 'surface';
    this._mouseDownEvent = null;
    this._lastEvent = null;
  }

  /**
   * Factory method for `Event` class
   */

  _createClass(Surface, [{
    key: '_createEvent',
    value: function _createEvent(type, e) {
      var event = new _waveEvent2['default'](this.sourceName, type, e);

      var pos = this._getRelativePosition(e);
      event.x = pos.x;
      event.y = pos.y;

      return event;
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

    /**
     * Keep this private to avoid double event binding. Main logic of the surface
     * is here. Should be extended with needed events (mouseenter, mouseleave,
     * wheel ...).
     */
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this = this;

      var onMouseDown = function onMouseDown(e) {
        // By removing the previous selection we prevent bypassing the mousemove events coming from SVG in Firefox.
        window.getSelection().removeAllRanges();
        var event = _this._createEvent('mousedown', e);

        _this._mouseDownEvent = event;
        _this._lastEvent = event;
        // Register mousemove and mouseup listeners on window
        window.addEventListener('mousemove', onMouseMove, false);
        window.addEventListener('mouseup', onMouseUp, false);

        _this.emit('event', event);
      };

      var onMouseMove = function onMouseMove(e) {
        var event = _this._createEvent('mousemove', e);
        _this._defineArea(event, _this._mouseDownEvent, _this._lastEvent);
        // Update `lastEvent` for next call
        _this._lastEvent = event;

        _this.emit('event', event);
      };

      var onMouseUp = function onMouseUp(e) {
        var event = _this._createEvent('mouseup', e);
        _this._defineArea(event, _this._mouseDownEvent, _this._lastEvent);

        _this._mouseDownEvent = null;
        _this._lastEvent = null;
        // Remove mousemove and mouseup listeners on window
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);

        _this.emit('event', event);
      };

      var onClick = function onClick(e) {
        var event = _this._createEvent('click', e);
        _this.emit('event', event);
      };

      var onDblClick = function onDblClick(e) {
        var event = _this._createEvent('dblclick', e);
        _this.emit('event', event);
      };

      var onMouseOver = function onMouseOver(e) {
        var event = _this._createEvent('mouseover', e);
        _this.emit('event', event);
      };

      var onMouseOut = function onMouseOut(e) {
        var event = _this._createEvent('mouseout', e);
        _this.emit('event', event);
      };

      // Bind callbacks
      this.$el.addEventListener('mousedown', onMouseDown, false);
      this.$el.addEventListener('click', onClick, false);
      this.$el.addEventListener('dblclick', onDblClick, false);
      this.$el.addEventListener('mouseover', onMouseOver, false);
      this.$el.addEventListener('mouseout', onMouseOut, false);
    }
  }]);

  return Surface;
})(_eventSource2['default']);

exports['default'] = Surface;
module.exports = exports['default'];

},{"./event-source":28,"./wave-event":31,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],31:[function(require,module,exports){
/**
 * Object template for all events. Event sources should use this event template
 * in order to keep consistency with existing sources.
 */
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var WaveEvent =
/**
 * @param {String} source - The name of the source (`keyboard`, `surface`, ...).
 * @param {String} type - The type of the source (`mousedown`, `keyup`, ...).
 * @param {Event} originalEvent - The original event as emitted by the browser.
 */
function WaveEvent(source, type, originalEvent) {
  _classCallCheck(this, WaveEvent);

  this.source = source;
  this.type = type;
  this.originalEvent = originalEvent;

  this.target = originalEvent.target;
  this.currentTarget = originalEvent.currentTarget;
};

exports["default"] = WaveEvent;
module.exports = exports["default"];

},{"babel-runtime/helpers/class-call-check":70}],32:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _marker = require('./marker');

var _marker2 = _interopRequireDefault(_marker);

/**
 * A shape to display a marker with annotation.
 *
 * [example usage](./examples/layer-marker.html)
 */

var AnnotatedMarker = (function (_Marker) {
  _inherits(AnnotatedMarker, _Marker);

  function AnnotatedMarker() {
    _classCallCheck(this, AnnotatedMarker);

    _get(Object.getPrototypeOf(AnnotatedMarker.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(AnnotatedMarker, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'annotated-marker';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      var list = _get(Object.getPrototypeOf(AnnotatedMarker.prototype), '_getAccessorList', this).call(this);
      list.text = 'default';
      return list;
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      this.$el = _get(Object.getPrototypeOf(AnnotatedMarker.prototype), 'render', this).call(this, renderingContext);
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
      _get(Object.getPrototypeOf(AnnotatedMarker.prototype), 'update', this).call(this, renderingContext, datum);

      if (this.$label.firstChild) {
        this.$label.removeChild(this.$label.firstChild);
      }

      var $text = document.createTextNode(this.text(datum));
      this.$label.appendChild($text);
    }
  }]);

  return AnnotatedMarker;
})(_marker2['default']);

exports['default'] = AnnotatedMarker;
module.exports = exports['default'];

},{"./marker":38,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],33:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _segment = require('./segment');

var _segment2 = _interopRequireDefault(_segment);

/**
 * A shape to display a segment with annotation.
 *
 * [example usage](./examples/layer-segment.html)
 */

var AnnotatedSegment = (function (_Segment) {
  _inherits(AnnotatedSegment, _Segment);

  function AnnotatedSegment() {
    _classCallCheck(this, AnnotatedSegment);

    _get(Object.getPrototypeOf(AnnotatedSegment.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(AnnotatedSegment, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'annotated-segment';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      var list = _get(Object.getPrototypeOf(AnnotatedSegment.prototype), '_getAccessorList', this).call(this);
      list.text = 'default';
      return list;
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      this.$el = _get(Object.getPrototypeOf(AnnotatedSegment.prototype), 'render', this).call(this, renderingContext);
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
      _get(Object.getPrototypeOf(AnnotatedSegment.prototype), 'update', this).call(this, renderingContext, datum);

      if (this.$label.firstChild) {
        this.$label.removeChild(this.$label.firstChild);
      }

      var $text = document.createTextNode(this.text(datum));
      this.$label.appendChild($text);
    }
  }]);

  return AnnotatedSegment;
})(_segment2['default']);

exports['default'] = AnnotatedSegment;
module.exports = exports['default'];

},{"./segment":39,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],34:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreNamespace = require('../core/namespace');

var _coreNamespace2 = _interopRequireDefault(_coreNamespace);

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

var BaseShape = (function () {
  /**
   * @param {Object} options - override default configuration
   */

  function BaseShape() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BaseShape);

    /** @type {Element} - Svg element to be returned by the `render` method. */
    this.$el = null;
    /** @type {String} - Svg namespace. */
    this.ns = _coreNamespace2['default'];
    /** @type {Object} - Object containing the global parameters of the shape */
    this.params = _Object$assign({}, this._getDefaults(), options);
    // create accessors methods and set default accessor functions
    var accessors = this._getAccessorList();
    this._createAccessors(accessors);
    this._setDefaultAccessors(accessors);
  }

  /**
   * Destroy the shape and clean references. Interface method called from the `layer`.
   */

  _createClass(BaseShape, [{
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
      var proto = Object.getPrototypeOf(this);
      // create a getter / setter for each accessors
      // setter : `this.x = callback`
      // getter : `this.x(datum)`
      _Object$keys(accessors).forEach(function (name) {
        if (proto.hasOwnProperty(name)) {
          return;
        }

        _Object$defineProperty(proto, name, {
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

      _Object$keys(accessors).forEach(function (name) {
        var defaultValue = accessors[name];
        var accessor = function accessor(d) {
          var v = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

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
})();

exports['default'] = BaseShape;
module.exports = exports['default'];

},{"../core/namespace":12,"babel-runtime/core-js/object/assign":60,"babel-runtime/core-js/object/define-property":62,"babel-runtime/core-js/object/keys":64,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/interop-require-default":74}],35:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

var _coreNamespace = require('../core/namespace');

var _coreNamespace2 = _interopRequireDefault(_coreNamespace);

/**
 * A shape to display a cursor.
 *
 * [example usage](./examples/layer-cursor.html)
 */

var Cursor = (function (_BaseShape) {
  _inherits(Cursor, _BaseShape);

  function Cursor() {
    _classCallCheck(this, Cursor);

    _get(Object.getPrototypeOf(Cursor.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Cursor, [{
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
      if (this.$el) {
        return this.$el;
      }

      this.$el = document.createElementNS(_coreNamespace2['default'], 'line');
      this.$el.setAttributeNS(null, 'x', 0);
      this.$el.setAttributeNS(null, 'y1', 0);
      this.$el.setAttributeNS(null, 'y2', renderingContext.height);
      this.$el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
      this.$el.style.stroke = this.params.color;

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      var x = Math.round(renderingContext.timeToPixel(this.x(datum))) + 0.5;
      this.$el.setAttributeNS(null, 'transform', 'translate(' + x + ', 0)');
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
})(_baseShape2['default']);

exports['default'] = Cursor;
module.exports = exports['default'];

},{"../core/namespace":12,"./base-shape":34,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],36:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

/**
 * A shape to display a dot.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */

var Dot = (function (_BaseShape) {
  _inherits(Dot, _BaseShape);

  function Dot() {
    _classCallCheck(this, Dot);

    _get(Object.getPrototypeOf(Dot.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Dot, [{
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

      if (cx > x1 && cx < x2 && (cy > y1 && cy < y2)) {
        return true;
      }

      return false;
    }
  }]);

  return Dot;
})(_baseShape2['default']);

exports['default'] = Dot;
module.exports = exports['default'];

},{"./base-shape":34,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],37:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

/**
 * A shape to display a line. Its main use is as common shape to create a
 * breakpoint visualization. (entity shape)
 *
 * [example usage](./examples/layer-breakpoint.html)
 */

var Line = (function (_BaseShape) {
  _inherits(Line, _BaseShape);

  function Line() {
    _classCallCheck(this, Line);

    _get(Object.getPrototypeOf(Line.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Line, [{
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
      var _this = this;

      data = data.slice(0);
      data.sort(function (a, b) {
        return _this.cx(a) < _this.cx(b) ? -1 : 1;
      });

      this.$el.setAttributeNS(null, 'd', this._buildLine(renderingContext, data));
      this.$el.style.stroke = this.params.color;
      this.$el.style.fill = 'none';

      data = null;
    }

    // builds the `path.d` attribute
    // @TODO create some ShapeHelper ?
  }, {
    key: '_buildLine',
    value: function _buildLine(renderingContext, data) {
      var _this2 = this;

      if (!data.length) {
        return '';
      }
      // sort data
      var instructions = data.map(function (datum, index) {
        var x = renderingContext.timeToPixel(_this2.cx(datum));
        var y = renderingContext.valueToPixel(_this2.cy(datum)) - 0.5;
        return x + ',' + y;
      });

      return 'M' + instructions.join('L');
    }
  }]);

  return Line;
})(_baseShape2['default']);

exports['default'] = Line;
module.exports = exports['default'];

},{"./base-shape":34,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],38:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

/**
 * A shape to display a marker.
 *
 * [example usage](./examples/layer-marker.html)
 */

var Marker = (function (_BaseShape) {
  _inherits(Marker, _BaseShape);

  function Marker() {
    _classCallCheck(this, Marker);

    _get(Object.getPrototypeOf(Marker.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Marker, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'marker';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { x: 0, color: '#ff0000' };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        handlerWidth: 7,
        handlerHeight: 10,
        displayHandlers: true,
        opacity: 1,
        color: 'red'
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }

      var height = renderingContext.height;

      this.$el = document.createElementNS(this.ns, 'g');
      this.$line = document.createElementNS(this.ns, 'line');

      // draw line
      this.$line.setAttributeNS(null, 'x', 0);
      this.$line.setAttributeNS(null, 'y1', 0);
      this.$line.setAttributeNS(null, 'y2', height);
      this.$line.setAttributeNS(null, 'shape-rendering', 'crispEdges');

      this.$el.appendChild(this.$line);

      if (this.params.displayHandlers) {
        this.$handler = document.createElementNS(this.ns, 'rect');

        this.$handler.setAttributeNS(null, 'x', -(this.params.handlerWidth / 2));
        this.$handler.setAttributeNS(null, 'y', renderingContext.height - this.params.handlerHeight);
        this.$handler.setAttributeNS(null, 'width', this.params.handlerWidth);
        this.$handler.setAttributeNS(null, 'height', this.params.handlerHeight);
        this.$handler.setAttributeNS(null, 'shape-rendering', 'crispEdges');

        this.$el.appendChild(this.$handler);
      }

      this.$el.style.opacity = this.params.opacity;

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      var x = renderingContext.timeToPixel(this.x(datum)) - 0.5;
      var color = this.color(datum);

      this.$el.setAttributeNS(null, 'transform', 'translate(' + x + ', 0)');
      this.$line.style.stroke = color;

      if (this.params.displayHandlers) {
        this.$handler.style.fill = color;
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
})(_baseShape2['default']);

exports['default'] = Marker;
module.exports = exports['default'];

},{"./base-shape":34,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],39:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

/**
 * A shape to display a segment.
 *
 * [example usage](./examples/layer-segment.html)
 */

var Segment = (function (_BaseShape) {
  _inherits(Segment, _BaseShape);

  function Segment() {
    _classCallCheck(this, Segment);

    _get(Object.getPrototypeOf(Segment.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Segment, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'segment';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { x: 0, y: 0, width: 0, height: 1, color: '#000000', opacity: 1 };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        displayHandlers: true,
        handlerWidth: 2,
        handlerOpacity: 0.8,
        opacity: 0.6
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
})(_baseShape2['default']);

exports['default'] = Segment;
module.exports = exports['default'];

},{"./base-shape":34,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],40:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

/**
 * Kind of Marker for entity oriented data. Usefull to display a grid.
 */

var Ticks = (function (_BaseShape) {
  _inherits(Ticks, _BaseShape);

  function Ticks() {
    _classCallCheck(this, Ticks);

    _get(Object.getPrototypeOf(Ticks.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Ticks, [{
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
      var _this = this;

      while (this.$el.firstChild) {
        this.$el.removeChild(this.$el.firstChild);
      }

      var fragment = document.createDocumentFragment();
      var layerHeight = renderingContext.height; // valueToPixel(1);

      data.forEach(function (datum) {
        var x = renderingContext.timeToPixel(_this.time(datum));
        var opacity = _this.focused(datum) ? _this.params.focusedOpacity : _this.params.defaultOpacity;

        var height = layerHeight;

        var tick = document.createElementNS(_this.ns, 'line');
        tick.classList.add('tick');

        tick.setAttributeNS(null, 'x1', 0);
        tick.setAttributeNS(null, 'x2', 0);
        tick.setAttributeNS(null, 'y1', 0);
        tick.setAttributeNS(null, 'y2', height);

        tick.setAttributeNS(null, 'fill', 'none');
        tick.setAttributeNS(null, 'stroke', _this.params.color);
        tick.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        tick.setAttributeNS(null, 'transform', 'translate(' + x + ', 0)');
        tick.setAttributeNS(null, 'opacity', opacity);

        _this.$el.appendChild(tick);

        var label = _this.label(datum);
        if (label) {
          var $label = document.createElementNS(_this.ns, 'text');
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

          _this.$el.appendChild($label);
        }
      });

      this.$el.appendChild(fragment);
    }
  }]);

  return Ticks;
})(_baseShape2['default']);

exports['default'] = Ticks;
module.exports = exports['default'];

},{"./base-shape":34,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],41:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

/**
 * A shape to display dots in a trace visualization (mean / range).
 *
 * [example usage](./examples/layer-trace.html)
 */

var TraceDots = (function (_BaseShape) {
  _inherits(TraceDots, _BaseShape);

  function TraceDots() {
    _classCallCheck(this, TraceDots);

    _get(Object.getPrototypeOf(TraceDots.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(TraceDots, [{
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
})(_baseShape2['default']);

exports['default'] = TraceDots;
module.exports = exports['default'];

},{"./base-shape":34,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],42:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

/**
 * A shape to display paths in a trace visualization (mean / range). (entity shape)
 *
 * [example usage](./examples/layer-trace.html)
 */

var TracePath = (function (_BaseShape) {
  _inherits(TracePath, _BaseShape);

  function TracePath() {
    _classCallCheck(this, TracePath);

    _get(Object.getPrototypeOf(TracePath.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(TracePath, [{
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
      var _this = this;

      // order data by x position
      data = data.slice(0);
      data.sort(function (a, b) {
        return _this.x(a) < _this.x(b) ? -1 : 1;
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
      var _this2 = this;

      var instructions = data.map(function (datum, index) {
        var x = renderingContext.timeToPixel(_this2.x(datum));
        var y = renderingContext.valueToPixel(_this2.mean(datum));
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
})(_baseShape2['default']);

exports['default'] = TracePath;
module.exports = exports['default'];

},{"./base-shape":34,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],43:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

var xhtmlNS = 'http://www.w3.org/1999/xhtml';

/**
 * A shape to display a waveform. (for entity data)
 *
 * [example usage](./examples/layer-waveform.html)
 *
 * @todo - fix problems with canvas strategy.
 */

var Waveform = (function (_BaseShape) {
  _inherits(Waveform, _BaseShape);

  function Waveform() {
    _classCallCheck(this, Waveform);

    _get(Object.getPrototypeOf(Waveform.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Waveform, [{
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
      };
    }
  }, {
    key: 'render',
    // renderingStrategy: 'svg' // canvas is bugged (translation, etc...)
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }

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
          if (sample < min) {
            min = sample;
          }
          if (sample > max) {
            max = sample;
          }
        }
        // disallow Infinity
        min = !isFinite(min) ? 0 : min;
        max = !isFinite(max) ? 0 : max;
        if (min === 0 && max === 0) {
          continue;
        }

        minMax.push([px, min, max]);
      }

      if (!minMax.length) {
        return;
      }

      var PIXEL = 0;
      var MIN = 1;
      var MAX = 2;
      var ZERO = renderingContext.valueToPixel(0);
      // rendering strategies
      // if (this.params.renderingStrategy === 'svg') {

      var instructions = minMax.map(function (datum, index) {
        var x = datum[PIXEL];
        var y1 = Math.round(renderingContext.valueToPixel(datum[MIN]));
        var y2 = Math.round(renderingContext.valueToPixel(datum[MAX]));
        // return `${x},${ZERO}L${x},${y1}L${x},${y2}L${x},${ZERO}`;
        return x + ',' + y1 + 'L' + x + ',' + y2;
      });

      var d = 'M' + instructions.join('L');
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
  }]);

  return Waveform;
})(_baseShape2['default']);

exports['default'] = Waveform;
module.exports = exports['default'];

},{"./base-shape":34,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],44:[function(require,module,exports){
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
"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var BaseState = (function () {
  /**
   * Returns timeline tracks collection.
   *
   * @type {TrackCollection}
   */

  function BaseState(timeline) {
    _classCallCheck(this, BaseState);

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

  _createClass(BaseState, [{
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
})();

exports["default"] = BaseState;
module.exports = exports["default"];

},{"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71}],45:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

/**
 * A state to interact with a breakpoint function, mimicing Max/MSP's
 * breakpoint function interactions.
 *
 * [example usage](./examples/layer-breakpint.html)
 */

var BreakpointState = (function (_BaseState) {
  _inherits(BreakpointState, _BaseState);

  function BreakpointState(timeline, datumGenerator) {
    _classCallCheck(this, BreakpointState);

    _get(Object.getPrototypeOf(BreakpointState.prototype), 'constructor', this).call(this, timeline);

    this.datumGenerator = datumGenerator;
    this.currentEditedLayer = null;
    this.currentTarget = null;
  }

  _createClass(BreakpointState, [{
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
      var _this = this;

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
          var time = layer.timeToPixel.invert(e.x) - _this.timeline.offset;
          var value = layer.valueToPixel.invert(layer.params.height - e.y);
          var datum = _this.datumGenerator(time, value);

          layer.data.push(datum);
          updatedLayer = layer;
        } else {
          // if shift is pressed, remove the item
          if (e.originalEvent.shiftKey) {
            var data = layer.data;
            var datum = layer.getDatumFromItem(item);
            data.splice(data.indexOf(datum), 1);

            updatedLayer = layer;
          } else {
            _this.currentEditedLayer = layer;
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
      var _this2 = this;

      if (!this.mouseDown || !this.currentEditedLayer) {
        return;
      }

      var layer = this.currentEditedLayer;
      var items = layer.selectedItems;
      // the loop should be in layer to match select / unselect API
      items.forEach(function (item) {
        layer.edit(item, e.dx, e.dy, _this2.currentTarget);
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
})(_baseState2['default']);

exports['default'] = BreakpointState;
module.exports = exports['default'];

},{"./base-state":44,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],46:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreNamespace = require('../core/namespace');

var _coreNamespace2 = _interopRequireDefault(_coreNamespace);

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

/**
 * Protools like zoom with zone selection. Press space bar to reset zoom.
 *
 * [example usage](./examples/states-zoom.html)
 *
 * @todo - could also handle `g` and `h` keys to zoom-in, zoom-out.
 */

var BrushZoomState = (function (_BaseState) {
  _inherits(BrushZoomState, _BaseState);

  function BrushZoomState(timeline) {
    _classCallCheck(this, BrushZoomState);

    _get(Object.getPrototypeOf(BrushZoomState.prototype), 'constructor', this).call(this, timeline);
  }

  _createClass(BrushZoomState, [{
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
      var _this = this;

      this.brushes = [];
      this.startX = e.x;
      // create brush in each containers
      this.tracks.forEach(function (track) {
        var interactions = track.$interactions;

        var brush = document.createElementNS(_coreNamespace2['default'], 'rect');
        brush.setAttributeNS(null, 'height', track.height);
        brush.setAttributeNS(null, 'y', 0);
        brush.style.fill = '#787878';
        brush.style.opacity = 0.2;

        interactions.appendChild(brush);

        _this.brushes.push(brush);
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
})(_baseState2['default']);

exports['default'] = BrushZoomState;
module.exports = exports['default'];

},{"../core/namespace":12,"./base-state":44,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],47:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utilsScales = require('../utils/scales');

var _utilsScales2 = _interopRequireDefault(_utilsScales);

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

/**
 * `CenteredZoomState` is a timeline state mimicing the `Live` zoom interaction. It allows the user to browse the timeline by clicking on a track, and then
 * - moving down to zoom in
 * - moving up to zoom out
 * - moving left to move in time, after
 * - moving right to move in time, before
 *
 * [example usage](./examples/states-zoom.html)
 */

var CenteredZoomState = (function (_BaseState) {
  _inherits(CenteredZoomState, _BaseState);

  function CenteredZoomState(timeline) {
    _classCallCheck(this, CenteredZoomState);

    _get(Object.getPrototypeOf(CenteredZoomState.prototype), 'constructor', this).call(this, timeline);
    this.currentLayer = null;
    // Set max/min zoom
    // maxZoom: 1px per sample
    // minZoom: 10 000 px per 1 hour
    // with a default to 44.1kHz sample rate
    this.maxZoom = 44100 * 1 / this.timeline.timeContext.pixelsPerSecond;
    this.minZoom = 10000 / 3600 / this.timeline.timeContext.pixelsPerSecond;
  }

  _createClass(CenteredZoomState, [{
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

      this._pixelToExponent = _utilsScales2['default'].linear().domain([0, 100]) // 100px => factor 2
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
})(_baseState2['default']);

exports['default'] = CenteredZoomState;
module.exports = exports['default'];

},{"../utils/scales":54,"./base-state":44,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],48:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

var _behaviorsTimeContextBehavior = require('../behaviors/time-context-behavior');

var _behaviorsTimeContextBehavior2 = _interopRequireDefault(_behaviorsTimeContextBehavior);

/**
 * A state to interact directly with layers time contexts.
 *
 * [example usage, see. advanced usage](./examples/layer-waveform.html)
 */

var ContextEditionState = (function (_BaseState) {
  _inherits(ContextEditionState, _BaseState);

  function ContextEditionState(timeline) {
    _classCallCheck(this, ContextEditionState);

    _get(Object.getPrototypeOf(ContextEditionState.prototype), 'constructor', this).call(this, timeline);
  }

  _createClass(ContextEditionState, [{
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
})(_baseState2['default']);

exports['default'] = ContextEditionState;
module.exports = exports['default'];

},{"../behaviors/time-context-behavior":8,"./base-state":44,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],49:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

/**
 * A state to edit shapes in the more general way. Interact only with selected shapes.
 */

var EditionState = (function (_BaseState) {
  _inherits(EditionState, _BaseState);

  function EditionState(timeline) {
    _classCallCheck(this, EditionState);

    _get(Object.getPrototypeOf(EditionState.prototype), 'constructor', this).call(this, timeline);

    this.currentEditedLayer = null;
    this.currentTarget = null;
  }

  _createClass(EditionState, [{
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
      var _this = this;

      this.layers.forEach(function (layer) {
        var items = layer.selectedItems;

        layer.edit(items, e.dx, e.dy, _this.currentTarget);
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
})(_baseState2['default']);

exports['default'] = EditionState;
module.exports = exports['default'];

},{"./base-state":44,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],50:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Map = require('babel-runtime/core-js/map')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

var _coreNamespace = require('../core/namespace');

var _coreNamespace2 = _interopRequireDefault(_coreNamespace);

/**
 * A state to select shapes.
 */

var SelectionState = (function (_BaseState) {
  _inherits(SelectionState, _BaseState);

  function SelectionState(timeline /*, options = {} */) {
    _classCallCheck(this, SelectionState);

    _get(Object.getPrototypeOf(SelectionState.prototype), 'constructor', this).call(this, timeline /*, options */);

    this.currentLayer = null;
    // need a cached
    this.selectedItems = null;
    this.mouseDown = false;
    this.shiftKey = false;

    this._layerSelectedItemsMap = new _Map();
  }

  _createClass(SelectionState, [{
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

      var brush = document.createElementNS(_coreNamespace2['default'], 'rect');
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
      var _this = this;

      this._currentTrack = this.timeline.getTrackFromDOMElement(e.target);
      if (!this._currentTrack) {
        return;
      }

      this._addBrush(this._currentTrack);

      // recreate the map
      this._layerSelectedItemsMap = new _Map();
      this._currentTrack.layers.forEach(function (layer) {
        _this._layerSelectedItemsMap.set(layer, layer.selectedItems.slice(0));
      });
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      var _this2 = this;

      this._updateBrush(e, this._currentTrack);

      this._currentTrack.layers.forEach(function (layer) {
        var currentSelection = layer.selectedItems;
        var currentItems = layer.getItemsInArea(e.area);

        // if is not pressed
        if (!e.originalEvent.shiftKey) {
          layer.unselect(currentSelection);
          layer.select(currentItems);
        } else {
          (function () {
            var toSelect = [];
            var toUnselect = [];
            // use the selection from the previous drag
            var previousSelection = _this2._layerSelectedItemsMap.get(layer);
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
          })();
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
})(_baseState2['default']);

exports['default'] = SelectionState;
module.exports = exports['default'];

},{"../core/namespace":12,"./base-state":44,"babel-runtime/core-js/map":59,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],51:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

/**
 * A state to select and edit shapes in a simple way. (kind of plug n play state)
 */

var SimpleEditionState = (function (_BaseState) {
  _inherits(SimpleEditionState, _BaseState);

  function SimpleEditionState(timeline) {
    _classCallCheck(this, SimpleEditionState);

    _get(Object.getPrototypeOf(SimpleEditionState.prototype), 'constructor', this).call(this, timeline);

    this.currentEditedLayer = null;
    this.currentTarget = null;
  }

  _createClass(SimpleEditionState, [{
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
      var _this = this;

      // keep target consistent with mouse down
      this.currentTarget = e.target;

      this.layers.forEach(function (layer) {
        if (!layer.hasElement(_this.currentTarget)) {
          return;
        }

        if (!e.originalEvent.shiftKey) {
          layer.unselect();
        }

        var item = layer.getItemFromDOMElement(_this.currentTarget);

        if (item === null) {
          return;
        }

        _this.currentEditedLayer = layer;
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
})(_baseState2['default']);

exports['default'] = SimpleEditionState;
module.exports = exports['default'];

},{"./base-state":44,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71,"babel-runtime/helpers/get":72,"babel-runtime/helpers/inherits":73,"babel-runtime/helpers/interop-require-default":74}],52:[function(require,module,exports){
/**
 * Formatting helpers functions.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  /**
   * Add a `sign` to the left of a given `input` to match `length`
   *
   * @param {String} input - The string to format.
   * @param {String} sign - The character to add to the left.
   * @param {Number} length - The length of the output string.
   */
  padLeft: function padLeft(input, sign, length) {
    input += '';
    while (input.length < length) {
      input = sign + input;
    }
    return input;
  }
};
module.exports = exports['default'];

},{}],53:[function(require,module,exports){
/**
 * OrthogonalData transforms an object of arrays `{foo: [1, 2], bar: [3, 4]}`
 * to or from an array of objects `[{foo: 1, bar: 3}, {foo: 2, bar: 4}]`
 */
"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _Object$keys = require("babel-runtime/core-js/object/keys")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var OrthogonalData = (function () {
  function OrthogonalData() {
    _classCallCheck(this, OrthogonalData);

    this._cols = null; // Object of arrays
    this._rows = null; // Array of objects
  }

  /**
   * Check the consistency of the data.
   */

  _createClass(OrthogonalData, [{
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

      var keys = _Object$keys(this._cols);

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
    },

    /**
     * Returns an object of arrays.
     *
     * @type {Object<String, Array>}
     */
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
    },

    /**
     * Returns an array of objects.
     *
     * @type {Array<Object>}
     */
    get: function get() {
      return this._rows;
    }
  }]);

  return OrthogonalData;
})();

exports["default"] = OrthogonalData;
module.exports = exports["default"];

},{"babel-runtime/core-js/object/keys":64,"babel-runtime/helpers/class-call-check":70,"babel-runtime/helpers/create-class":71}],54:[function(require,module,exports){
/**
 * Lightweight scales mimicing the `d3.js` functionnal API.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = {
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
      var arr = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (arr === null) {
        return _domain;
      }

      _domain = arr;
      _updateCoefs();

      return scale;
    };

    scale.range = function () {
      var arr = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

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
module.exports = exports["default"];

},{}],55:[function(require,module,exports){
// core
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayerTimeContext = require('./core/layer-time-context');

var _coreLayerTimeContext2 = _interopRequireDefault(_coreLayerTimeContext);

var _coreLayer = require('./core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _coreNamespace = require('./core/namespace');

var _coreNamespace2 = _interopRequireDefault(_coreNamespace);

var _coreTimelineTimeContext = require('./core/timeline-time-context');

var _coreTimelineTimeContext2 = _interopRequireDefault(_coreTimelineTimeContext);

var _coreTimeline = require('./core/timeline');

var _coreTimeline2 = _interopRequireDefault(_coreTimeline);

var _coreTrackCollection = require('./core/track-collection');

var _coreTrackCollection2 = _interopRequireDefault(_coreTrackCollection);

var _coreTrack = require('./core/track');

var _coreTrack2 = _interopRequireDefault(_coreTrack);

// shapes

var _shapesAnnotatedMarker = require('./shapes/annotated-marker');

var _shapesAnnotatedMarker2 = _interopRequireDefault(_shapesAnnotatedMarker);

var _shapesAnnotatedSegment = require('./shapes/annotated-segment');

var _shapesAnnotatedSegment2 = _interopRequireDefault(_shapesAnnotatedSegment);

var _shapesBaseShape = require('./shapes/base-shape');

var _shapesBaseShape2 = _interopRequireDefault(_shapesBaseShape);

var _shapesCursor = require('./shapes/cursor');

var _shapesCursor2 = _interopRequireDefault(_shapesCursor);

var _shapesDot = require('./shapes/dot');

var _shapesDot2 = _interopRequireDefault(_shapesDot);

var _shapesLine = require('./shapes/line');

var _shapesLine2 = _interopRequireDefault(_shapesLine);

var _shapesMarker = require('./shapes/marker');

var _shapesMarker2 = _interopRequireDefault(_shapesMarker);

var _shapesSegment = require('./shapes/segment');

var _shapesSegment2 = _interopRequireDefault(_shapesSegment);

var _shapesTicks = require('./shapes/ticks');

var _shapesTicks2 = _interopRequireDefault(_shapesTicks);

var _shapesTracePath = require('./shapes/trace-path');

var _shapesTracePath2 = _interopRequireDefault(_shapesTracePath);

var _shapesTraceDots = require('./shapes/trace-dots');

var _shapesTraceDots2 = _interopRequireDefault(_shapesTraceDots);

var _shapesWaveform = require('./shapes/waveform');

var _shapesWaveform2 = _interopRequireDefault(_shapesWaveform);

// behaviors

var _behaviorsBaseBehavior = require('./behaviors/base-behavior');

var _behaviorsBaseBehavior2 = _interopRequireDefault(_behaviorsBaseBehavior);

var _behaviorsBreakpointBehavior = require('./behaviors/breakpoint-behavior');

var _behaviorsBreakpointBehavior2 = _interopRequireDefault(_behaviorsBreakpointBehavior);

var _behaviorsMarkerBehavior = require('./behaviors/marker-behavior');

var _behaviorsMarkerBehavior2 = _interopRequireDefault(_behaviorsMarkerBehavior);

var _behaviorsSegmentBehavior = require('./behaviors/segment-behavior');

var _behaviorsSegmentBehavior2 = _interopRequireDefault(_behaviorsSegmentBehavior);

var _behaviorsTimeContextBehavior = require('./behaviors/time-context-behavior');

var _behaviorsTimeContextBehavior2 = _interopRequireDefault(_behaviorsTimeContextBehavior);

var _behaviorsTraceBehavior = require('./behaviors/trace-behavior');

var _behaviorsTraceBehavior2 = _interopRequireDefault(_behaviorsTraceBehavior);

// interactions

var _interactionsEventSource = require('./interactions/event-source');

var _interactionsEventSource2 = _interopRequireDefault(_interactionsEventSource);

var _interactionsKeyboard = require('./interactions/keyboard');

var _interactionsKeyboard2 = _interopRequireDefault(_interactionsKeyboard);

var _interactionsSurface = require('./interactions/surface');

var _interactionsSurface2 = _interopRequireDefault(_interactionsSurface);

var _interactionsWaveEvent = require('./interactions/wave-event');

var _interactionsWaveEvent2 = _interopRequireDefault(_interactionsWaveEvent);

// states

var _statesBaseState = require('./states/base-state');

var _statesBaseState2 = _interopRequireDefault(_statesBaseState);

var _statesBreakpointState = require('./states/breakpoint-state');

var _statesBreakpointState2 = _interopRequireDefault(_statesBreakpointState);

var _statesBrushZoomState = require('./states/brush-zoom-state');

var _statesBrushZoomState2 = _interopRequireDefault(_statesBrushZoomState);

var _statesCenteredZoomState = require('./states/centered-zoom-state');

var _statesCenteredZoomState2 = _interopRequireDefault(_statesCenteredZoomState);

var _statesContextEditionState = require('./states/context-edition-state');

var _statesContextEditionState2 = _interopRequireDefault(_statesContextEditionState);

var _statesEditionState = require('./states/edition-state');

var _statesEditionState2 = _interopRequireDefault(_statesEditionState);

var _statesSelectionState = require('./states/selection-state');

var _statesSelectionState2 = _interopRequireDefault(_statesSelectionState);

var _statesSimpleEditionState = require('./states/simple-edition-state');

var _statesSimpleEditionState2 = _interopRequireDefault(_statesSimpleEditionState);

// helpers

var _helpersAnnotatedMarkerLayer = require('./helpers/annotated-marker-layer');

var _helpersAnnotatedMarkerLayer2 = _interopRequireDefault(_helpersAnnotatedMarkerLayer);

var _helpersAnnotatedSegmentLayer = require('./helpers/annotated-segment-layer');

var _helpersAnnotatedSegmentLayer2 = _interopRequireDefault(_helpersAnnotatedSegmentLayer);

var _helpersBreakpointLayer = require('./helpers/breakpoint-layer');

var _helpersBreakpointLayer2 = _interopRequireDefault(_helpersBreakpointLayer);

var _helpersCursorLayer = require('./helpers/cursor-layer');

var _helpersCursorLayer2 = _interopRequireDefault(_helpersCursorLayer);

var _helpersGridAxisLayer = require('./helpers/grid-axis-layer');

var _helpersGridAxisLayer2 = _interopRequireDefault(_helpersGridAxisLayer);

var _helpersMarkerLayer = require('./helpers/marker-layer');

var _helpersMarkerLayer2 = _interopRequireDefault(_helpersMarkerLayer);

var _helpersSegmentLayer = require('./helpers/segment-layer');

var _helpersSegmentLayer2 = _interopRequireDefault(_helpersSegmentLayer);

var _helpersTickLayer = require('./helpers/tick-layer');

var _helpersTickLayer2 = _interopRequireDefault(_helpersTickLayer);

var _helpersTimeAxisLayer = require('./helpers/time-axis-layer');

var _helpersTimeAxisLayer2 = _interopRequireDefault(_helpersTimeAxisLayer);

var _helpersTraceLayer = require('./helpers/trace-layer');

var _helpersTraceLayer2 = _interopRequireDefault(_helpersTraceLayer);

var _helpersWaveformLayer = require('./helpers/waveform-layer');

var _helpersWaveformLayer2 = _interopRequireDefault(_helpersWaveformLayer);

// axis

var _axisAxisLayer = require('./axis/axis-layer');

var _axisAxisLayer2 = _interopRequireDefault(_axisAxisLayer);

var _axisTimeAxisGenerator = require('./axis/time-axis-generator');

var _axisTimeAxisGenerator2 = _interopRequireDefault(_axisTimeAxisGenerator);

var _axisGridAxisGenerator = require('./axis/grid-axis-generator');

var _axisGridAxisGenerator2 = _interopRequireDefault(_axisGridAxisGenerator);

// utils

var _utilsFormat = require('./utils/format');

var _utilsFormat2 = _interopRequireDefault(_utilsFormat);

var _utilsOrthogonalData = require('./utils/orthogonal-data');

var _utilsOrthogonalData2 = _interopRequireDefault(_utilsOrthogonalData);

var _utilsScales = require('./utils/scales');

var _utilsScales2 = _interopRequireDefault(_utilsScales);

exports['default'] = {
  core: {
    LayerTimeContext: _coreLayerTimeContext2['default'], Layer: _coreLayer2['default'], namespace: _coreNamespace2['default'],
    TimelineTimeContext: _coreTimelineTimeContext2['default'], Timeline: _coreTimeline2['default'], TrackCollection: _coreTrackCollection2['default'], Track: _coreTrack2['default']
  },
  shapes: {
    AnnotatedMarker: _shapesAnnotatedMarker2['default'], AnnotatedSegment: _shapesAnnotatedSegment2['default'], BaseShape: _shapesBaseShape2['default'], Cursor: _shapesCursor2['default'],
    Dot: _shapesDot2['default'], Line: _shapesLine2['default'], Marker: _shapesMarker2['default'], Segment: _shapesSegment2['default'], Ticks: _shapesTicks2['default'], TracePath: _shapesTracePath2['default'], TraceDots: _shapesTraceDots2['default'], Waveform: _shapesWaveform2['default']
  },
  behaviors: {
    BaseBehavior: _behaviorsBaseBehavior2['default'], BreakpointBehavior: _behaviorsBreakpointBehavior2['default'], MarkerBehavior: _behaviorsMarkerBehavior2['default'], SegmentBehavior: _behaviorsSegmentBehavior2['default'],
    TimeContextBehavior: _behaviorsTimeContextBehavior2['default'], TraceBehavior: _behaviorsTraceBehavior2['default']
  },
  interactions: { EventSource: _interactionsEventSource2['default'], Keyboard: _interactionsKeyboard2['default'], Surface: _interactionsSurface2['default'], WaveEvent: _interactionsWaveEvent2['default'] },
  states: {
    BaseState: _statesBaseState2['default'], BreakpointState: _statesBreakpointState2['default'], BrushZoomState: _statesBrushZoomState2['default'], CenteredZoomState: _statesCenteredZoomState2['default'],
    ContextEditionState: _statesContextEditionState2['default'], EditionState: _statesEditionState2['default'], SelectionState: _statesSelectionState2['default'], SimpleEditionState: _statesSimpleEditionState2['default']
  },
  helpers: {
    AnnotatedMarkerLayer: _helpersAnnotatedMarkerLayer2['default'], AnnotatedSegmentLayer: _helpersAnnotatedSegmentLayer2['default'], BreakpointLayer: _helpersBreakpointLayer2['default'],
    CursorLayer: _helpersCursorLayer2['default'], GridAxisLayer: _helpersGridAxisLayer2['default'], MarkerLayer: _helpersMarkerLayer2['default'], SegmentLayer: _helpersSegmentLayer2['default'], TickLayer: _helpersTickLayer2['default'],
    TimeAxisLayer: _helpersTimeAxisLayer2['default'], TraceLayer: _helpersTraceLayer2['default'], WaveformLayer: _helpersWaveformLayer2['default']
  },
  axis: {
    AxisLayer: _axisAxisLayer2['default'], timeAxisGenerator: _axisTimeAxisGenerator2['default'], gridAxisGenerator: _axisGridAxisGenerator2['default']
  },
  utils: {
    format: _utilsFormat2['default'], OrthogonalData: _utilsOrthogonalData2['default'], scales: _utilsScales2['default']
  }
};
module.exports = exports['default'];

},{"./axis/axis-layer":1,"./axis/grid-axis-generator":2,"./axis/time-axis-generator":3,"./behaviors/base-behavior":4,"./behaviors/breakpoint-behavior":5,"./behaviors/marker-behavior":6,"./behaviors/segment-behavior":7,"./behaviors/time-context-behavior":8,"./behaviors/trace-behavior":9,"./core/layer":11,"./core/layer-time-context":10,"./core/namespace":12,"./core/timeline":14,"./core/timeline-time-context":13,"./core/track":16,"./core/track-collection":15,"./helpers/annotated-marker-layer":17,"./helpers/annotated-segment-layer":18,"./helpers/breakpoint-layer":19,"./helpers/cursor-layer":20,"./helpers/grid-axis-layer":21,"./helpers/marker-layer":22,"./helpers/segment-layer":23,"./helpers/tick-layer":24,"./helpers/time-axis-layer":25,"./helpers/trace-layer":26,"./helpers/waveform-layer":27,"./interactions/event-source":28,"./interactions/keyboard":29,"./interactions/surface":30,"./interactions/wave-event":31,"./shapes/annotated-marker":32,"./shapes/annotated-segment":33,"./shapes/base-shape":34,"./shapes/cursor":35,"./shapes/dot":36,"./shapes/line":37,"./shapes/marker":38,"./shapes/segment":39,"./shapes/ticks":40,"./shapes/trace-dots":41,"./shapes/trace-path":42,"./shapes/waveform":43,"./states/base-state":44,"./states/breakpoint-state":45,"./states/brush-zoom-state":46,"./states/centered-zoom-state":47,"./states/context-edition-state":48,"./states/edition-state":49,"./states/selection-state":50,"./states/simple-edition-state":51,"./utils/format":52,"./utils/orthogonal-data":53,"./utils/scales":54,"babel-runtime/helpers/interop-require-default":74}],56:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/array/from"), __esModule: true };
},{"core-js/library/fn/array/from":77}],57:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":78}],58:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/is-iterable"), __esModule: true };
},{"core-js/library/fn/is-iterable":79}],59:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/map"), __esModule: true };
},{"core-js/library/fn/map":80}],60:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":81}],61:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":82}],62:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":83}],63:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-own-property-descriptor"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-descriptor":84}],64:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":85}],65:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":86}],66:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/promise"), __esModule: true };
},{"core-js/library/fn/promise":87}],67:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/set"), __esModule: true };
},{"core-js/library/fn/set":88}],68:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":89}],69:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol/iterator"), __esModule: true };
},{"core-js/library/fn/symbol/iterator":90}],70:[function(require,module,exports){
"use strict";

exports["default"] = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

exports.__esModule = true;
},{}],71:[function(require,module,exports){
"use strict";

var _Object$defineProperty = require("babel-runtime/core-js/object/define-property")["default"];

exports["default"] = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;

      _Object$defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

exports.__esModule = true;
},{"babel-runtime/core-js/object/define-property":62}],72:[function(require,module,exports){
"use strict";

var _Object$getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor")["default"];

exports["default"] = function get(_x, _x2, _x3) {
  var _again = true;

  _function: while (_again) {
    var object = _x,
        property = _x2,
        receiver = _x3;
    _again = false;
    if (object === null) object = Function.prototype;

    var desc = _Object$getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        _x = parent;
        _x2 = property;
        _x3 = receiver;
        _again = true;
        desc = parent = undefined;
        continue _function;
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
  }
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/get-own-property-descriptor":63}],73:[function(require,module,exports){
"use strict";

var _Object$create = require("babel-runtime/core-js/object/create")["default"];

var _Object$setPrototypeOf = require("babel-runtime/core-js/object/set-prototype-of")["default"];

exports["default"] = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = _Object$create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/create":61,"babel-runtime/core-js/object/set-prototype-of":65}],74:[function(require,module,exports){
"use strict";

exports["default"] = function (obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
};

exports.__esModule = true;
},{}],75:[function(require,module,exports){
"use strict";

var _getIterator = require("babel-runtime/core-js/get-iterator")["default"];

var _isIterable = require("babel-runtime/core-js/is-iterable")["default"];

exports["default"] = (function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = _getIterator(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
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
    } else if (_isIterable(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
})();

exports.__esModule = true;
},{"babel-runtime/core-js/get-iterator":57,"babel-runtime/core-js/is-iterable":58}],76:[function(require,module,exports){
"use strict";

var _Array$from = require("babel-runtime/core-js/array/from")["default"];

exports["default"] = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return _Array$from(arr);
  }
};

exports.__esModule = true;
},{"babel-runtime/core-js/array/from":56}],77:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/$.core').Array.from;
},{"../../modules/$.core":99,"../../modules/es6.array.from":151,"../../modules/es6.string.iterator":161}],78:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.get-iterator');
},{"../modules/core.get-iterator":149,"../modules/es6.string.iterator":161,"../modules/web.dom.iterable":165}],79:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.is-iterable');
},{"../modules/core.is-iterable":150,"../modules/es6.string.iterator":161,"../modules/web.dom.iterable":165}],80:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.map');
require('../modules/es7.map.to-json');
module.exports = require('../modules/$.core').Map;
},{"../modules/$.core":99,"../modules/es6.map":153,"../modules/es6.object.to-string":158,"../modules/es6.string.iterator":161,"../modules/es7.map.to-json":163,"../modules/web.dom.iterable":165}],81:[function(require,module,exports){
require('../../modules/es6.object.assign');
module.exports = require('../../modules/$.core').Object.assign;
},{"../../modules/$.core":99,"../../modules/es6.object.assign":154}],82:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function create(P, D){
  return $.create(P, D);
};
},{"../../modules/$":123}],83:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function defineProperty(it, key, desc){
  return $.setDesc(it, key, desc);
};
},{"../../modules/$":123}],84:[function(require,module,exports){
var $ = require('../../modules/$');
require('../../modules/es6.object.get-own-property-descriptor');
module.exports = function getOwnPropertyDescriptor(it, key){
  return $.getDesc(it, key);
};
},{"../../modules/$":123,"../../modules/es6.object.get-own-property-descriptor":155}],85:[function(require,module,exports){
require('../../modules/es6.object.keys');
module.exports = require('../../modules/$.core').Object.keys;
},{"../../modules/$.core":99,"../../modules/es6.object.keys":156}],86:[function(require,module,exports){
require('../../modules/es6.object.set-prototype-of');
module.exports = require('../../modules/$.core').Object.setPrototypeOf;
},{"../../modules/$.core":99,"../../modules/es6.object.set-prototype-of":157}],87:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.promise');
module.exports = require('../modules/$.core').Promise;
},{"../modules/$.core":99,"../modules/es6.object.to-string":158,"../modules/es6.promise":159,"../modules/es6.string.iterator":161,"../modules/web.dom.iterable":165}],88:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.set');
require('../modules/es7.set.to-json');
module.exports = require('../modules/$.core').Set;
},{"../modules/$.core":99,"../modules/es6.object.to-string":158,"../modules/es6.set":160,"../modules/es6.string.iterator":161,"../modules/es7.set.to-json":164,"../modules/web.dom.iterable":165}],89:[function(require,module,exports){
require('../../modules/es6.symbol');
module.exports = require('../../modules/$.core').Symbol;
},{"../../modules/$.core":99,"../../modules/es6.symbol":162}],90:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/web.dom.iterable');
module.exports = require('../../modules/$.wks')('iterator');
},{"../../modules/$.wks":147,"../../modules/es6.string.iterator":161,"../../modules/web.dom.iterable":165}],91:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],92:[function(require,module,exports){
var isObject = require('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":116}],93:[function(require,module,exports){
// 19.1.2.1 Object.assign(target, source, ...)
var $        = require('./$')
  , toObject = require('./$.to-object')
  , IObject  = require('./$.iobject');

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = require('./$.fails')(function(){
  var a = Object.assign
    , A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , $$    = arguments
    , $$len = $$.length
    , index = 1
    , getKeys    = $.getKeys
    , getSymbols = $.getSymbols
    , isEnum     = $.isEnum;
  while($$len > index){
    var S      = IObject($$[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  }
  return T;
} : Object.assign;
},{"./$":123,"./$.fails":105,"./$.iobject":113,"./$.to-object":144}],94:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./$.cof')
  , TAG = require('./$.wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./$.cof":95,"./$.wks":147}],95:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],96:[function(require,module,exports){
'use strict';
var $            = require('./$')
  , hide         = require('./$.hide')
  , ctx          = require('./$.ctx')
  , species      = require('./$.species')
  , strictNew    = require('./$.strict-new')
  , defined      = require('./$.defined')
  , forOf        = require('./$.for-of')
  , step         = require('./$.iter-step')
  , ID           = require('./$.uid')('id')
  , $has         = require('./$.has')
  , isObject     = require('./$.is-object')
  , isExtensible = Object.isExtensible || isObject
  , SUPPORT_DESC = require('./$.support-desc')
  , SIZE         = SUPPORT_DESC ? '_s' : 'size'
  , id           = 0;

var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!$has(it, ID)){
    // can't set id to frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add id
    if(!create)return 'E';
    // add missing object id
    hide(it, ID, ++id);
  // return object id with prefix
  } return 'O' + it[ID];
};

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      strictNew(that, C, NAME);
      that._i = $.create(null); // index
      that._f = undefined;      // first entry
      that._l = undefined;      // last entry
      that[SIZE] = 0;           // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    require('./$.mix')(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(SUPPORT_DESC)$.setDesc(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
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
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    require('./$.iter-define')(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    species(C);
    species(require('./$.core')[NAME]); // for wrapper
  }
};
},{"./$":123,"./$.core":99,"./$.ctx":100,"./$.defined":102,"./$.for-of":106,"./$.has":109,"./$.hide":110,"./$.is-object":116,"./$.iter-define":119,"./$.iter-step":121,"./$.mix":127,"./$.species":135,"./$.strict-new":136,"./$.support-desc":138,"./$.uid":145}],97:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var forOf   = require('./$.for-of')
  , classof = require('./$.classof');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    var arr = [];
    forOf(this, false, arr.push, arr);
    return arr;
  };
};
},{"./$.classof":94,"./$.for-of":106}],98:[function(require,module,exports){
'use strict';
var $          = require('./$')
  , $def       = require('./$.def')
  , hide       = require('./$.hide')
  , forOf      = require('./$.for-of')
  , strictNew  = require('./$.strict-new');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = require('./$.global')[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  if(!require('./$.support-desc') || typeof C != 'function'
    || !(IS_WEAK || proto.forEach && !require('./$.fails')(function(){ new C().entries().next(); }))
  ){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    require('./$.mix')(C.prototype, methods);
  } else {
    C = wrapper(function(target, iterable){
      strictNew(target, C, NAME);
      target._c = new Base;
      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
    });
    $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries'.split(','),function(KEY){
      var chain = KEY == 'add' || KEY == 'set';
      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return chain ? this : result;
      });
    });
    if('size' in proto)$.setDesc(C.prototype, 'size', {
      get: function(){
        return this._c.size;
      }
    });
  }

  require('./$.tag')(C, NAME);

  O[NAME] = C;
  $def($def.G + $def.W + $def.F, O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./$":123,"./$.def":101,"./$.fails":105,"./$.for-of":106,"./$.global":108,"./$.hide":110,"./$.mix":127,"./$.strict-new":136,"./$.support-desc":138,"./$.tag":139}],99:[function(require,module,exports){
var core = module.exports = {version: '1.2.3'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],100:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./$.a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./$.a-function":91}],101:[function(require,module,exports){
var global    = require('./$.global')
  , core      = require('./$.core')
  , PROTOTYPE = 'prototype';
var ctx = function(fn, that){
  return function(){
    return fn.apply(that, arguments);
  };
};
var $def = function(type, name, source){
  var key, own, out, exp
    , isGlobal = type & $def.G
    , isProto  = type & $def.P
    , target   = isGlobal ? global : type & $def.S
        ? global[name] : (global[name] || {})[PROTOTYPE]
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // contains in native
    own = !(type & $def.F) && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    if(isGlobal && typeof target[key] != 'function')exp = source[key];
    // bind timers to global for call from export context
    else if(type & $def.B && own)exp = ctx(out, global);
    // wrap global constructors for prevent change them in library
    else if(type & $def.W && target[key] == out)!function(C){
      exp = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      exp[PROTOTYPE] = C[PROTOTYPE];
    }(out);
    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export
    exports[key] = exp;
    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
// type bitmap
$def.F = 1;  // forced
$def.G = 2;  // global
$def.S = 4;  // static
$def.P = 8;  // proto
$def.B = 16; // bind
$def.W = 32; // wrap
module.exports = $def;
},{"./$.core":99,"./$.global":108}],102:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],103:[function(require,module,exports){
var isObject = require('./$.is-object')
  , document = require('./$.global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./$.global":108,"./$.is-object":116}],104:[function(require,module,exports){
// all enumerable object keys, includes symbols
var $ = require('./$');
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getSymbols = $.getSymbols;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = $.isEnum
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
  }
  return keys;
};
},{"./$":123}],105:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],106:[function(require,module,exports){
var ctx         = require('./$.ctx')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , anObject    = require('./$.an-object')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
module.exports = function(iterable, entries, fn, that){
  var iterFn = getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};
},{"./$.an-object":92,"./$.ctx":100,"./$.is-array-iter":114,"./$.iter-call":117,"./$.to-length":143,"./core.get-iterator-method":148}],107:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toString  = {}.toString
  , toIObject = require('./$.to-iobject')
  , getNames  = require('./$').getNames;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames(toIObject(it));
};
},{"./$":123,"./$.to-iobject":142}],108:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],109:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],110:[function(require,module,exports){
var $          = require('./$')
  , createDesc = require('./$.property-desc');
module.exports = require('./$.support-desc') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":123,"./$.property-desc":129,"./$.support-desc":138}],111:[function(require,module,exports){
module.exports = require('./$.global').document && document.documentElement;
},{"./$.global":108}],112:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],113:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./$.cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":95}],114:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./$.iterators')
  , ITERATOR  = require('./$.wks')('iterator');
module.exports = function(it){
  return (Iterators.Array || Array.prototype[ITERATOR]) === it;
};
},{"./$.iterators":122,"./$.wks":147}],115:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./$.cof');
module.exports = Array.isArray || function(arg){
  return cof(arg) == 'Array';
};
},{"./$.cof":95}],116:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],117:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./$.an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./$.an-object":92}],118:[function(require,module,exports){
'use strict';
var $ = require('./$')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./$.hide')(IteratorPrototype, require('./$.wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: require('./$.property-desc')(1,next)});
  require('./$.tag')(Constructor, NAME + ' Iterator');
};
},{"./$":123,"./$.hide":110,"./$.property-desc":129,"./$.tag":139,"./$.wks":147}],119:[function(require,module,exports){
'use strict';
var LIBRARY         = require('./$.library')
  , $def            = require('./$.def')
  , $redef          = require('./$.redef')
  , hide            = require('./$.hide')
  , has             = require('./$.has')
  , SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , Iterators       = require('./$.iterators')
  , BUGGY           = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR     = '@@iterator'
  , KEYS            = 'keys'
  , VALUES          = 'values';
var returnThis = function(){ return this; };
module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
  require('./$.iter-create')(Constructor, NAME, next);
  var createMethod = function(kind){
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG      = NAME + ' Iterator'
    , proto    = Base.prototype
    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , _default = _native || createMethod(DEFAULT)
    , methods, key;
  // Fix native
  if(_native){
    var IteratorPrototype = require('./$').getProto(_default.call(new Base));
    // Set @@toStringTag to native iterators
    require('./$.tag')(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, SYMBOL_ITERATOR, returnThis);
  }
  // Define iterator
  if(!LIBRARY || FORCE)hide(proto, SYMBOL_ITERATOR, _default);
  // Plug for library
  Iterators[NAME] = _default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEFAULT == VALUES ? _default : createMethod(VALUES),
      keys:    IS_SET            ? _default : createMethod(KEYS),
      entries: DEFAULT != VALUES ? _default : createMethod('entries')
    };
    if(FORCE)for(key in methods){
      if(!(key in proto))$redef(proto, key, methods[key]);
    } else $def($def.P + $def.F * BUGGY, NAME, methods);
  }
};
},{"./$":123,"./$.def":101,"./$.has":109,"./$.hide":110,"./$.iter-create":118,"./$.iterators":122,"./$.library":125,"./$.redef":130,"./$.tag":139,"./$.wks":147}],120:[function(require,module,exports){
var SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , SAFE_CLOSING    = false;
try {
  var riter = [7][SYMBOL_ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }
module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[SYMBOL_ITERATOR]();
    iter.next = function(){ safe = true; };
    arr[SYMBOL_ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./$.wks":147}],121:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],122:[function(require,module,exports){
module.exports = {};
},{}],123:[function(require,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],124:[function(require,module,exports){
var $         = require('./$')
  , toIObject = require('./$.to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./$":123,"./$.to-iobject":142}],125:[function(require,module,exports){
module.exports = true;
},{}],126:[function(require,module,exports){
var global    = require('./$.global')
  , macrotask = require('./$.task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , isNode    = require('./$.cof')(process) == 'process'
  , head, last, notify;

var flush = function(){
  var parent, domain;
  if(isNode && (parent = process.domain)){
    process.domain = null;
    parent.exit();
  }
  while(head){
    domain = head.domain;
    if(domain)domain.enter();
    head.fn.call(); // <- currently we use it only for Promise - try / catch not required
    if(domain)domain.exit();
    head = head.next;
  } last = undefined;
  if(parent)parent.enter();
};

// Node.js
if(isNode){
  notify = function(){
    process.nextTick(flush);
  };
// browsers with MutationObserver
} else if(Observer){
  var toggle = 1
    , node   = document.createTextNode('');
  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
  notify = function(){
    node.data = toggle = -toggle;
  };
// for other environments - macrotask based on:
// - setImmediate
// - MessageChannel
// - window.postMessag
// - onreadystatechange
// - setTimeout
} else {
  notify = function(){
    // strange IE + webpack dev server bug - use .call(global)
    macrotask.call(global, flush);
  };
}

module.exports = function asap(fn){
  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
  if(last)last.next = task;
  if(!head){
    head = task;
    notify();
  } last = task;
};
},{"./$.cof":95,"./$.global":108,"./$.task":140}],127:[function(require,module,exports){
var $redef = require('./$.redef');
module.exports = function(target, src){
  for(var key in src)$redef(target, key, src[key]);
  return target;
};
},{"./$.redef":130}],128:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
module.exports = function(KEY, exec){
  var $def = require('./$.def')
    , fn   = (require('./$.core').Object || {})[KEY] || Object[KEY]
    , exp  = {};
  exp[KEY] = exec(fn);
  $def($def.S + $def.F * require('./$.fails')(function(){ fn(1); }), 'Object', exp);
};
},{"./$.core":99,"./$.def":101,"./$.fails":105}],129:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],130:[function(require,module,exports){
module.exports = require('./$.hide');
},{"./$.hide":110}],131:[function(require,module,exports){
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],132:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = require('./$').getDesc
  , isObject = require('./$.is-object')
  , anObject = require('./$.an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./$.ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./$":123,"./$.an-object":92,"./$.ctx":100,"./$.is-object":116}],133:[function(require,module,exports){
var global = require('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":108}],134:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = require('./$.an-object')
  , aFunction = require('./$.a-function')
  , SPECIES   = require('./$.wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./$.a-function":91,"./$.an-object":92,"./$.wks":147}],135:[function(require,module,exports){
'use strict';
var $       = require('./$')
  , SPECIES = require('./$.wks')('species');
module.exports = function(C){
  if(require('./$.support-desc') && !(SPECIES in C))$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./$":123,"./$.support-desc":138,"./$.wks":147}],136:[function(require,module,exports){
module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
},{}],137:[function(require,module,exports){
// true  -> String#at
// false -> String#codePointAt
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l
      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./$.defined":102,"./$.to-integer":141}],138:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":105}],139:[function(require,module,exports){
var def = require('./$').setDesc
  , has = require('./$.has')
  , TAG = require('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./$":123,"./$.has":109,"./$.wks":147}],140:[function(require,module,exports){
'use strict';
var ctx                = require('./$.ctx')
  , invoke             = require('./$.invoke')
  , html               = require('./$.html')
  , cel                = require('./$.dom-create')
  , global             = require('./$.global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listner = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require('./$.cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listner, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./$.cof":95,"./$.ctx":100,"./$.dom-create":103,"./$.global":108,"./$.html":111,"./$.invoke":112}],141:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],142:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./$.iobject')
  , defined = require('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":102,"./$.iobject":113}],143:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./$.to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./$.to-integer":141}],144:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./$.defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./$.defined":102}],145:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],146:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],147:[function(require,module,exports){
var store  = require('./$.shared')('wks')
  , Symbol = require('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || require('./$.uid'))('Symbol.' + name));
};
},{"./$.global":108,"./$.shared":133,"./$.uid":145}],148:[function(require,module,exports){
var classof   = require('./$.classof')
  , ITERATOR  = require('./$.wks')('iterator')
  , Iterators = require('./$.iterators');
module.exports = require('./$.core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./$.classof":94,"./$.core":99,"./$.iterators":122,"./$.wks":147}],149:[function(require,module,exports){
var anObject = require('./$.an-object')
  , get      = require('./core.get-iterator-method');
module.exports = require('./$.core').getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};
},{"./$.an-object":92,"./$.core":99,"./core.get-iterator-method":148}],150:[function(require,module,exports){
var classof   = require('./$.classof')
  , ITERATOR  = require('./$.wks')('iterator')
  , Iterators = require('./$.iterators');
module.exports = require('./$.core').isIterable = function(it){
  var O = Object(it);
  return ITERATOR in O
    || '@@iterator' in O
    || Iterators.hasOwnProperty(classof(O));
};
},{"./$.classof":94,"./$.core":99,"./$.iterators":122,"./$.wks":147}],151:[function(require,module,exports){
'use strict';
var ctx         = require('./$.ctx')
  , $def        = require('./$.def')
  , toObject    = require('./$.to-object')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
$def($def.S + $def.F * !require('./$.iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , $$      = arguments
      , $$len   = $$.length
      , mapfn   = $$len > 1 ? $$[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        result[index] = mapping ? mapfn(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});

},{"./$.ctx":100,"./$.def":101,"./$.is-array-iter":114,"./$.iter-call":117,"./$.iter-detect":120,"./$.to-length":143,"./$.to-object":144,"./core.get-iterator-method":148}],152:[function(require,module,exports){
'use strict';
var setUnscope = require('./$.unscope')
  , step       = require('./$.iter-step')
  , Iterators  = require('./$.iterators')
  , toIObject  = require('./$.to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
require('./$.iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

setUnscope('keys');
setUnscope('values');
setUnscope('entries');
},{"./$.iter-define":119,"./$.iter-step":121,"./$.iterators":122,"./$.to-iobject":142,"./$.unscope":146}],153:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.1 Map Objects
require('./$.collection')('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./$.collection":98,"./$.collection-strong":96}],154:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $def = require('./$.def');

$def($def.S + $def.F, 'Object', {assign: require('./$.assign')});
},{"./$.assign":93,"./$.def":101}],155:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./$.to-iobject');

require('./$.object-sap')('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./$.object-sap":128,"./$.to-iobject":142}],156:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./$.to-object');

require('./$.object-sap')('keys', function($keys){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./$.object-sap":128,"./$.to-object":144}],157:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $def = require('./$.def');
$def($def.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.def":101,"./$.set-proto":132}],158:[function(require,module,exports){

},{}],159:[function(require,module,exports){
'use strict';
var $          = require('./$')
  , LIBRARY    = require('./$.library')
  , global     = require('./$.global')
  , ctx        = require('./$.ctx')
  , classof    = require('./$.classof')
  , $def       = require('./$.def')
  , isObject   = require('./$.is-object')
  , anObject   = require('./$.an-object')
  , aFunction  = require('./$.a-function')
  , strictNew  = require('./$.strict-new')
  , forOf      = require('./$.for-of')
  , setProto   = require('./$.set-proto').set
  , same       = require('./$.same')
  , species    = require('./$.species')
  , SPECIES    = require('./$.wks')('species')
  , speciesConstructor = require('./$.species-constructor')
  , RECORD     = require('./$.uid')('record')
  , asap       = require('./$.microtask')
  , PROMISE    = 'Promise'
  , process    = global.process
  , isNode     = classof(process) == 'process'
  , P          = global[PROMISE]
  , Wrapper;

var testResolve = function(sub){
  var test = new P(function(){});
  if(sub)test.constructor = Object;
  return P.resolve(test) === test;
};

var useNative = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = P && P.resolve && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && require('./$.support-desc')){
      var thenableThenGotten = false;
      P.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
var isPromise = function(it){
  return isObject(it) && (useNative ? classof(it) == 'Promise' : RECORD in it);
};
var sameConstructor = function(a, b){
  // library wrapper special case
  if(LIBRARY && a === P && b === Wrapper)return true;
  return same(a, b);
};
var getConstructor = function(C){
  var S = anObject(C)[SPECIES];
  return S != undefined ? S : C;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function(record, isReject){
  if(record.n)return;
  record.n = true;
  var chain = record.c;
  asap(function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    var run = function(react){
      var cb = ok ? react.ok : react.fail
        , ret, then;
      try {
        if(cb){
          if(!ok)record.h = true;
          ret = cb === true ? value : cb(value);
          if(ret === react.P){
            react.rej(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(ret)){
            then.call(ret, react.res, react.rej);
          } else react.res(ret);
        } else react.rej(value);
      } catch(err){
        react.rej(err);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    chain.length = 0;
    record.n = false;
    if(isReject)setTimeout(function(){
      var promise = record.p
        , handler, console;
      if(isUnhandled(promise)){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      } record.a = undefined;
    }, 1);
  });
};
var isUnhandled = function(promise){
  var record = promise[RECORD]
    , chain  = record.a || record.c
    , i      = 0
    , react;
  if(record.h)return false;
  while(chain.length > i){
    react = chain[i++];
    if(react.fail || !isUnhandled(react.P))return false;
  } return true;
};
var $reject = function(value){
  var record = this;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  notify(record, true);
};
var $resolve = function(value){
  var record = this
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(then = isThenable(value)){
      asap(function(){
        var wrapper = {r: record, d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      record.v = value;
      record.s = 1;
      notify(record, false);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
  }
};

// constructor polyfill
if(!useNative){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    aFunction(executor);
    var record = {
      p: strictNew(this, P, PROMISE),         // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false,                               // <- handled rejection
      n: false                                // <- notify
    };
    this[RECORD] = record;
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  require('./$.mix')(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var react = {
        ok:   typeof onFulfilled == 'function' ? onFulfilled : true,
        fail: typeof onRejected == 'function'  ? onRejected  : false
      };
      var promise = react.P = new (speciesConstructor(this, P))(function(res, rej){
        react.res = res;
        react.rej = rej;
      });
      aFunction(react.res);
      aFunction(react.rej);
      var record = this[RECORD];
      record.c.push(react);
      if(record.a)record.a.push(react);
      if(record.s)notify(record, false);
      return promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}

// export
$def($def.G + $def.W + $def.F * !useNative, {Promise: P});
require('./$.tag')(P, PROMISE);
species(P);
species(Wrapper = require('./$.core')[PROMISE]);

// statics
$def($def.S + $def.F * !useNative, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    return new this(function(res, rej){ rej(r); });
  }
});
$def($def.S + $def.F * (!useNative || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    return isPromise(x) && sameConstructor(x.constructor, this)
      ? x : new this(function(res){ res(x); });
  }
});
$def($def.S + $def.F * !(useNative && require('./$.iter-detect')(function(iter){
  P.all(iter)['catch'](function(){});
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C      = getConstructor(this)
      , values = [];
    return new C(function(res, rej){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        C.resolve(promise).then(function(value){
          results[index] = value;
          --remaining || res(results);
        }, rej);
      });
      else res(results);
    });
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C = getConstructor(this);
    return new C(function(res, rej){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(res, rej);
      });
    });
  }
});
},{"./$":123,"./$.a-function":91,"./$.an-object":92,"./$.classof":94,"./$.core":99,"./$.ctx":100,"./$.def":101,"./$.for-of":106,"./$.global":108,"./$.is-object":116,"./$.iter-detect":120,"./$.library":125,"./$.microtask":126,"./$.mix":127,"./$.same":131,"./$.set-proto":132,"./$.species":135,"./$.species-constructor":134,"./$.strict-new":136,"./$.support-desc":138,"./$.tag":139,"./$.uid":145,"./$.wks":147}],160:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.2 Set Objects
require('./$.collection')('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./$.collection":98,"./$.collection-strong":96}],161:[function(require,module,exports){
'use strict';
var $at  = require('./$.string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./$.iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./$.iter-define":119,"./$.string-at":137}],162:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $              = require('./$')
  , global         = require('./$.global')
  , has            = require('./$.has')
  , SUPPORT_DESC   = require('./$.support-desc')
  , $def           = require('./$.def')
  , $redef         = require('./$.redef')
  , $fails         = require('./$.fails')
  , shared         = require('./$.shared')
  , setTag         = require('./$.tag')
  , uid            = require('./$.uid')
  , wks            = require('./$.wks')
  , keyOf          = require('./$.keyof')
  , $names         = require('./$.get-names')
  , enumKeys       = require('./$.enum-keys')
  , isArray        = require('./$.is-array')
  , anObject       = require('./$.an-object')
  , toIObject      = require('./$.to-iobject')
  , createDesc     = require('./$.property-desc')
  , getDesc        = $.getDesc
  , setDesc        = $.setDesc
  , _create        = $.create
  , getNames       = $names.get
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , setter         = false
  , HIDDEN         = wks('_hidden')
  , isEnum         = $.isEnum
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , useNative      = typeof $Symbol == 'function'
  , ObjectProto    = Object.prototype;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = SUPPORT_DESC && $fails(function(){
  return _create(setDesc({}, 'a', {
    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = getDesc(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  setDesc(it, key, D);
  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
} : setDesc;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol.prototype);
  sym._k = tag;
  SUPPORT_DESC && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    }
  });
  return sym;
};

var isSymbol = function(it){
  return typeof it == 'symbol';
};

var $defineProperty = function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return setDesc(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key);
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
    ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toIObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
};
var $stringify = function stringify(it){
  var args = [it]
    , i    = 1
    , $$   = arguments
    , replacer, $replacer;
  while($$.length > i)args.push($$[i++]);
  replacer = args[1];
  if(typeof replacer == 'function')$replacer = replacer;
  if($replacer || !isArray(replacer))replacer = function(key, value){
    if($replacer)value = $replacer.call(this, key, value);
    if(!isSymbol(value))return value;
  };
  args[1] = replacer;
  return _stringify.apply($JSON, args);
};
var buggyJSON = $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
});

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
  };
  $redef($Symbol.prototype, 'toString', function toString(){
    return this._k;
  });

  isSymbol = function(it){
    return it instanceof $Symbol;
  };

  $.create     = $create;
  $.isEnum     = $propertyIsEnumerable;
  $.getDesc    = $getOwnPropertyDescriptor;
  $.setDesc    = $defineProperty;
  $.setDescs   = $defineProperties;
  $.getNames   = $names.get = $getOwnPropertyNames;
  $.getSymbols = $getOwnPropertySymbols;

  if(SUPPORT_DESC && !require('./$.library')){
    $redef(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }
}

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call((
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
  'species,split,toPrimitive,toStringTag,unscopables'
).split(','), function(it){
  var sym = wks(it);
  symbolStatics[it] = useNative ? sym : wrap(sym);
});

setter = true;

$def($def.G + $def.W, {Symbol: $Symbol});

$def($def.S, 'Symbol', symbolStatics);

$def($def.S + $def.F * !useNative, 'Object', {
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
$JSON && $def($def.S + $def.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setTag(global.JSON, 'JSON', true);
},{"./$":123,"./$.an-object":92,"./$.def":101,"./$.enum-keys":104,"./$.fails":105,"./$.get-names":107,"./$.global":108,"./$.has":109,"./$.is-array":115,"./$.keyof":124,"./$.library":125,"./$.property-desc":129,"./$.redef":130,"./$.shared":133,"./$.support-desc":138,"./$.tag":139,"./$.to-iobject":142,"./$.uid":145,"./$.wks":147}],163:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $def  = require('./$.def');

$def($def.P, 'Map', {toJSON: require('./$.collection-to-json')('Map')});
},{"./$.collection-to-json":97,"./$.def":101}],164:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $def  = require('./$.def');

$def($def.P, 'Set', {toJSON: require('./$.collection-to-json')('Set')});
},{"./$.collection-to-json":97,"./$.def":101}],165:[function(require,module,exports){
require('./es6.array.iterator');
var Iterators = require('./$.iterators');
Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
},{"./$.iterators":122,"./es6.array.iterator":152}],166:[function(require,module,exports){
(function (global){
// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g =
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this;

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

module.exports = { "default": module.exports, __esModule: true };

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./runtime":167}],167:[function(require,module,exports){
(function (process,global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

"use strict";

var _Symbol = require("babel-runtime/core-js/symbol")["default"];

var _Symbol$iterator = require("babel-runtime/core-js/symbol/iterator")["default"];

var _Object$create = require("babel-runtime/core-js/object/create")["default"];

var _Promise = require("babel-runtime/core-js/promise")["default"];

!(function (global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol = typeof _Symbol === "function" && _Symbol$iterator || "@@iterator";

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
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = _Object$create((outerFn || Generator).prototype);

    generator._invoke = makeInvokeMethod(innerFn, self || null, new Context(tryLocsList || []));

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

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      prototype[method] = function (arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction ||
    // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  runtime.mark = function (genFun) {
    genFun.__proto__ = GeneratorFunctionPrototype;
    genFun.prototype = _Object$create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function (arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    // This invoke function is written in a style that assumes some
    // calling function (or Promise) will handle exceptions.
    function invoke(method, arg) {
      var result = generator[method](arg);
      var value = result.value;
      return value instanceof AwaitArgument ? _Promise.resolve(value.arg).then(invokeNext, invokeThrow) : _Promise.resolve(value).then(function (unwrapped) {
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
        return result;
      });
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var invokeNext = invoke.bind(generator, "next");
    var invokeThrow = invoke.bind(generator, "throw");
    var invokeReturn = invoke.bind(generator, "return");
    var previousPromise;

    function enqueue(method, arg) {
      var enqueueResult =
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
      previousPromise ? previousPromise.then(function () {
        return invoke(method, arg);
      }) : new _Promise(function (resolve) {
        resolve(invoke(method, arg));
      });

      // Avoid propagating enqueueResult failures to Promises returned by
      // later invocations of the iterator.
      previousPromise = enqueueResult["catch"](function (ignored) {});

      return enqueueResult;
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function (innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

    return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
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

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" || method === "throw" && delegate.iterator[method] === undefined) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(delegate.iterator[method], delegate.iterator, arg);

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            context.sent = undefined;
          }
        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }
        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }
        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function () {
    return this;
  };

  Gp.toString = function () {
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

  runtime.keys = function (object) {
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
        var i = -1,
            next = function next() {
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

    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function stop() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
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

    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function _catch(tryLoc) {
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

    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
// Among the various tricks for obtaining a reference to the global
// object, this seems to be the most reliable technique that does not
// use indirect eval (which violates Content Security Policy).
typeof global === "object" ? global : typeof window === "object" ? window : typeof self === "object" ? self : undefined);
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":169,"babel-runtime/core-js/object/create":61,"babel-runtime/core-js/promise":66,"babel-runtime/core-js/symbol":68,"babel-runtime/core-js/symbol/iterator":69}],168:[function(require,module,exports){
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
      }
      throw TypeError('Uncaught, unspecified "error" event.');
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
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

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
    var m;
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
  } else {
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

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
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

},{}],169:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[55])(55)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImRpc3QvYXhpcy9zcmMvYXhpcy9heGlzLWxheWVyLmpzIiwiZGlzdC9heGlzL3NyYy9heGlzL2dyaWQtYXhpcy1nZW5lcmF0b3IuanMiLCJkaXN0L2F4aXMvc3JjL2F4aXMvdGltZS1heGlzLWdlbmVyYXRvci5qcyIsImRpc3QvYmVoYXZpb3JzL3NyYy9iZWhhdmlvcnMvYmFzZS1iZWhhdmlvci5qcyIsImRpc3QvYmVoYXZpb3JzL3NyYy9iZWhhdmlvcnMvYnJlYWtwb2ludC1iZWhhdmlvci5qcyIsImRpc3QvYmVoYXZpb3JzL3NyYy9iZWhhdmlvcnMvbWFya2VyLWJlaGF2aW9yLmpzIiwiZGlzdC9iZWhhdmlvcnMvc3JjL2JlaGF2aW9ycy9zZWdtZW50LWJlaGF2aW9yLmpzIiwiZGlzdC9iZWhhdmlvcnMvc3JjL2JlaGF2aW9ycy90aW1lLWNvbnRleHQtYmVoYXZpb3IuanMiLCJkaXN0L2JlaGF2aW9ycy9zcmMvYmVoYXZpb3JzL3RyYWNlLWJlaGF2aW9yLmpzIiwiZGlzdC9jb3JlL3NyYy9jb3JlL2xheWVyLXRpbWUtY29udGV4dC5qcyIsImRpc3QvY29yZS9zcmMvY29yZS9sYXllci5qcyIsImRpc3QvY29yZS9zcmMvY29yZS9uYW1lc3BhY2UuanMiLCJkaXN0L2NvcmUvc3JjL2NvcmUvdGltZWxpbmUtdGltZS1jb250ZXh0LmpzIiwiZGlzdC9jb3JlL3NyYy9jb3JlL3RpbWVsaW5lLmpzIiwiZGlzdC9jb3JlL3NyYy9jb3JlL3RyYWNrLWNvbGxlY3Rpb24uanMiLCJkaXN0L2NvcmUvc3JjL2NvcmUvdHJhY2suanMiLCJkaXN0L2hlbHBlcnMvc3JjL2hlbHBlcnMvYW5ub3RhdGVkLW1hcmtlci1sYXllci5qcyIsImRpc3QvaGVscGVycy9zcmMvaGVscGVycy9hbm5vdGF0ZWQtc2VnbWVudC1sYXllci5qcyIsImRpc3QvaGVscGVycy9zcmMvaGVscGVycy9icmVha3BvaW50LWxheWVyLmpzIiwiZGlzdC9oZWxwZXJzL3NyYy9oZWxwZXJzL2N1cnNvci1sYXllci5qcyIsImRpc3QvaGVscGVycy9zcmMvaGVscGVycy9ncmlkLWF4aXMtbGF5ZXIuanMiLCJkaXN0L2hlbHBlcnMvc3JjL2hlbHBlcnMvbWFya2VyLWxheWVyLmpzIiwiZGlzdC9oZWxwZXJzL3NyYy9oZWxwZXJzL3NlZ21lbnQtbGF5ZXIuanMiLCJkaXN0L2hlbHBlcnMvc3JjL2hlbHBlcnMvdGljay1sYXllci5qcyIsImRpc3QvaGVscGVycy9zcmMvaGVscGVycy90aW1lLWF4aXMtbGF5ZXIuanMiLCJkaXN0L2hlbHBlcnMvc3JjL2hlbHBlcnMvdHJhY2UtbGF5ZXIuanMiLCJkaXN0L2hlbHBlcnMvc3JjL2hlbHBlcnMvd2F2ZWZvcm0tbGF5ZXIuanMiLCJkaXN0L2ludGVyYWN0aW9ucy9zcmMvaW50ZXJhY3Rpb25zL2V2ZW50LXNvdXJjZS5qcyIsImRpc3QvaW50ZXJhY3Rpb25zL3NyYy9pbnRlcmFjdGlvbnMva2V5Ym9hcmQuanMiLCJkaXN0L2ludGVyYWN0aW9ucy9zcmMvaW50ZXJhY3Rpb25zL3N1cmZhY2UuanMiLCJkaXN0L2ludGVyYWN0aW9ucy9zcmMvaW50ZXJhY3Rpb25zL3dhdmUtZXZlbnQuanMiLCJkaXN0L3NoYXBlcy9zcmMvc2hhcGVzL2Fubm90YXRlZC1tYXJrZXIuanMiLCJkaXN0L3NoYXBlcy9zcmMvc2hhcGVzL2Fubm90YXRlZC1zZWdtZW50LmpzIiwiZGlzdC9zaGFwZXMvc3JjL3NoYXBlcy9iYXNlLXNoYXBlLmpzIiwiZGlzdC9zaGFwZXMvc3JjL3NoYXBlcy9jdXJzb3IuanMiLCJkaXN0L3NoYXBlcy9zcmMvc2hhcGVzL2RvdC5qcyIsImRpc3Qvc2hhcGVzL3NyYy9zaGFwZXMvbGluZS5qcyIsImRpc3Qvc2hhcGVzL3NyYy9zaGFwZXMvbWFya2VyLmpzIiwiZGlzdC9zaGFwZXMvc3JjL3NoYXBlcy9zZWdtZW50LmpzIiwiZGlzdC9zaGFwZXMvc3JjL3NoYXBlcy90aWNrcy5qcyIsImRpc3Qvc2hhcGVzL3NyYy9zaGFwZXMvdHJhY2UtZG90cy5qcyIsImRpc3Qvc2hhcGVzL3NyYy9zaGFwZXMvdHJhY2UtcGF0aC5qcyIsImRpc3Qvc2hhcGVzL3NyYy9zaGFwZXMvd2F2ZWZvcm0uanMiLCJkaXN0L3N0YXRlcy9zcmMvc3RhdGVzL2Jhc2Utc3RhdGUuanMiLCJkaXN0L3N0YXRlcy9zcmMvc3RhdGVzL2JyZWFrcG9pbnQtc3RhdGUuanMiLCJkaXN0L3N0YXRlcy9zcmMvc3RhdGVzL2JydXNoLXpvb20tc3RhdGUuanMiLCJkaXN0L3N0YXRlcy9zcmMvc3RhdGVzL2NlbnRlcmVkLXpvb20tc3RhdGUuanMiLCJkaXN0L3N0YXRlcy9zcmMvc3RhdGVzL2NvbnRleHQtZWRpdGlvbi1zdGF0ZS5qcyIsImRpc3Qvc3RhdGVzL3NyYy9zdGF0ZXMvZWRpdGlvbi1zdGF0ZS5qcyIsImRpc3Qvc3RhdGVzL3NyYy9zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIiwiZGlzdC9zdGF0ZXMvc3JjL3N0YXRlcy9zaW1wbGUtZWRpdGlvbi1zdGF0ZS5qcyIsImRpc3QvdXRpbHMvc3JjL3V0aWxzL2Zvcm1hdC5qcyIsImRpc3QvdXRpbHMvc3JjL3V0aWxzL29ydGhvZ29uYWwtZGF0YS5qcyIsImRpc3QvdXRpbHMvc3JjL3V0aWxzL3NjYWxlcy5qcyIsImRpc3Qvc3JjL3dhdmVzLXVpLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9hcnJheS9mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9nZXQtaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL2lzLWl0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9tYXAuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3Qvc2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvcHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvc2V0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9zeW1ib2wuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3N5bWJvbC9pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3MtY2FsbC1jaGVjay5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlLWNsYXNzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9nZXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2luaGVyaXRzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbnRlcm9wLXJlcXVpcmUtZGVmYXVsdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvc2xpY2VkLXRvLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy90by1jb25zdW1hYmxlLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9hcnJheS9mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9nZXQtaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL2lzLWl0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9tYXAuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3Qvc2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vcHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vc2V0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbC9pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmEtZnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5hbi1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY29mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY29sbGVjdGlvbi1zdHJvbmcuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jb2xsZWN0aW9uLXRvLWpzb24uanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jb2xsZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmN0eC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmRlZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmRlZmluZWQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZW51bS1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZmFpbHMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5mb3Itb2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5nZXQtbmFtZXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5oYXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmludm9rZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmlvYmplY3QuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pcy1hcnJheS1pdGVyLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXMtYXJyYXkuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLWNhbGwuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLml0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLXN0ZXAuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyYXRvcnMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmtleW9mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQubGlicmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLm1pY3JvdGFzay5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLm1peC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLm9iamVjdC1zYXAuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQucmVkZWYuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zYW1lLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc2V0LXByb3RvLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc2hhcmVkLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc3BlY2llcy1jb25zdHJ1Y3Rvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnNwZWNpZXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zdHJpY3QtbmV3LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc3RyaW5nLWF0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc3VwcG9ydC1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudGFnLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudGFzay5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnRvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC50by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudWlkLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudW5zY29wZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLndrcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5pcy1pdGVyYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuYXJyYXkuZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm1hcC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmtleXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5wcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zZXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5tYXAudG8tanNvbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcuc2V0LnRvLWpzb24uanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL3JlZ2VuZXJhdG9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvcmVnZW5lcmF0b3IvcnVudGltZS5qcyIsIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCIuLi8uLi8uLi8uLi8uLi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OzZCQ0FlLG1CQUFtQjs7Ozt5QkFDaEIsZUFBZTs7Ozs7Ozs7Ozs7Ozs7OztJQWNaLFNBQVM7WUFBVCxTQUFTOzs7Ozs7OztBQU1qQixXQU5RLFNBQVMsQ0FNaEIsU0FBUyxFQUFFLE9BQU8sRUFBRTswQkFOYixTQUFTOztBQU8xQiwrQkFQaUIsU0FBUyw2Q0FPcEIsUUFBUSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUU7QUFDN0IsUUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7R0FDN0I7Ozs7ZUFUa0IsU0FBUzs7Ozs7OztXQW1EZix5QkFBRztBQUNkLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUUvQyxVQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVyQyxXQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNsRDs7Ozs7OztXQUtzQixtQ0FBRztBQUN4QixVQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFX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LFdBQVcsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzVELFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFNUMsaUJBQVcsQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDcEU7OztXQUVJLGVBQUMsV0FBVyxFQUFFLEVBQUUsRUFBRTtBQUNyQixVQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUQsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVwQyxpQkFBVyxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDcEU7OztXQUVNLGlCQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtBQUM3QixVQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO0FBQ3RDLFVBQU0sWUFBWSxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUM7QUFDMUMsVUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQzs7QUFFdEMsVUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFakMsVUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQztBQUN6QyxVQUFNLEtBQUssR0FBSSxXQUFXLEdBQUcsWUFBWSxBQUFDLENBQUM7O0FBRTNDLGlCQUFXLENBQUMsWUFBWSxJQUFJLEtBQUssQ0FBQztBQUNsQyxpQkFBVyxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUM7QUFDaEMsaUJBQVcsQ0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBOztBQ0RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7O0FDRkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTs7QUNBQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBOztBQ0ZBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqT0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBOzs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2puQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgbnMgZnJvbSAnLi4vY29yZS9uYW1lc3BhY2UnO1xuaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuXG5cbi8qKlxuICogU2ltcGxpZmllZCBMYXllciBmb3IgQXhpcy4gVGhlIG1haW4gZGlmZmVyZW5jZSB3aXRoIGEgcmVndWxhciBsYXllciBpcyB0aGF0XG4gKiBhbiBheGlzIGxheWVyIHVzZSB0aGUgYFRpbWVsaW5lfnRpbWVDb250ZXh0YCBhdHRyaWJ1dGVzIHRvIHJlbmRlciBpdCdzIGxheW91dFxuICogYW5kIHN0YXkgc3luY2hyb25pemVkIHdpdGggdGhlIHRyYWNrcyB2aXNpYmxlIGFyZWEuIEFsbCBnZXR0ZXJzIGFuZCBzZXR0ZXJzXG4gKiB0byB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgIGF0dHJpYnV0ZXMgYXJlIGJ5cGFzc2VkLlxuICpcbiAqIEl0IGFsc28gaGFuZGxlIGl0J3Mgb3duIGRhdGEgYW5kIGl0cyB1cGRhdGVzLiBUaGUgYF9nZW5lcmF0ZURhdGFgIG1ldGhvZCBpc1xuICogcmVzcG9uc2libGUgdG8gY3JlYXRlIHNvbWUgdXNlZnVsbCBkYXRhIHRvIHZpc3VhbGl6ZVxuICpcbiAqIFtleGFtcGxlIHVzYWdlIG9mIHRoZSBsYXllci1heGlzXSguL2V4YW1wbGVzL2xheWVyLWF4aXMuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXhpc0xheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZ2VuZXJhdG9yIC0gQSBmdW5jdGlvbiB0byBjcmVhdGUgZGF0YSBhY2NvcmRpbmcgdG9cbiAgICogICAgdGhlIGBUaW1lbGluZX50aW1lQ29udGV4dGAuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gTGF5ZXIgb3B0aW9ucywgY2YuIExheWVyIGZvciBhdmFpbGFibGUgb3B0aW9ucy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGdlbmVyYXRvciwgb3B0aW9ucykge1xuICAgIHN1cGVyKCdlbnRpdHknLCBbXSwgb3B0aW9ucyk7XG4gICAgdGhpcy5fZ2VuZXJhdG9yID0gZ2VuZXJhdG9yO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHNldCBzdHJldGNoUmF0aW8odmFsdWUpIHsgcmV0dXJuOyB9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzZXQgb2Zmc2V0KHZhbHVlKSB7IHJldHVybjsgfVxuICAvKiogQHByaXZhdGUgKi9cbiAgc2V0IHN0YXJ0KHZhbHVlKSB7IHJldHVybjsgfVxuICAvKiogQHByaXZhdGUgKi9cbiAgc2V0IGR1cmF0aW9uKHZhbHVlKSB7IHJldHVybjsgfVxuICAvKiogQHByaXZhdGUgKi9cbiAgZ2V0IHN0cmV0Y2hSYXRpbygpIHsgcmV0dXJuOyB9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBnZXQgb2Zmc2V0KCkgeyByZXR1cm47IH1cbiAgLyoqIEBwcml2YXRlICovXG4gIGdldCBzdGFydCgpIHsgcmV0dXJuOyB9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBnZXQgZHVyYXRpb24oKSB7IHJldHVybjsgfVxuXG5cbiAgLyoqXG4gICAqIFRoZSBnZW5lcmF0b3IgdGhhdCBjcmVhdGVzIHRoZSBkYXRhIHRvIGJlIHJlbmRlcmVkIHRvIGRpc3BsYXkgdGhlIGF4aXMuXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIHNldCBnZW5lcmF0b3IoZnVuYykge1xuICAgIHRoaXMuX2dlbmVyYXRvciA9IGZ1bmM7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGdlbmVyYXRvciB0aGF0IGNyZWF0ZXMgdGhlIGRhdGEgdG8gYmUgcmVuZGVyZWQgdG8gZGlzcGxheSB0aGUgYXhpcy5cbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgZ2V0IGdlbmVyYXRvcigpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2VuZXJhdG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGlzIHRoZSBtYWluIGRpZmZlcmVuY2Ugd2l0aCBhIGNsYXNzaWNhbCBsYXllci4gQW4gYEF4aXNMYXllcmBcbiAgICogaW5zdGFuY2UgZ2VuZXJhdGVzIGFuZCBtYWludGFpbnMgaXQncyBvd24gZGF0YS5cbiAgICovXG4gIF9nZW5lcmF0ZURhdGEoKSB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuX2dlbmVyYXRvcih0aGlzLnRpbWVDb250ZXh0KTtcbiAgICAvLyBwcmVwZW5kIGZpcnN0IGFyZ3VtZW50cyBvZiBzcGxpY2UgZm9yIGFuIGFwcGx5XG4gICAgZGF0YS51bnNoaWZ0KDAsIHRoaXMuZGF0YVswXS5sZW5ndGgpO1xuICAgIC8vIG1ha2Ugc3VyZSB0byBrZWVwIHRoZSBzYW1lIHJlZmVyZW5jZVxuICAgIEFycmF5LnByb3RvdHlwZS5zcGxpY2UuYXBwbHkodGhpcy5kYXRhWzBdLCBkYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSByZW5kZXJpbmcgY29udGV4dCBmb3IgdGhlIHNoYXBlcy5cbiAgICovXG4gIF91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCkge1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwgPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsID0gdGhpcy5fdmFsdWVUb1BpeGVsO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQuaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQud2lkdGggID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uKTtcblxuICAgIC8vIGZvciBmb3JlaWduIG9iamVjdCBpc3N1ZSBpbiBjaHJvbWVcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0Lm9mZnNldFggPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQub2Zmc2V0KTtcblxuICAgIC8vIGV4cG9zZSBzb21lIHRpbWVsaW5lIGF0dHJpYnV0ZXMgLSBhbGxvdyB0byBpbXByb3ZlIHBlcmYgaW4gc29tZSBjYXNlcyAtIGNmLiBXYXZlZm9ybVxuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudHJhY2tPZmZzZXRYID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCk7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC52aXNpYmxlV2lkdGggPSB0aGlzLnRpbWVDb250ZXh0LnZpc2libGVXaWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgdGhlIGRhdGEgYW5kIHVwZGF0ZSB0aGUgbGF5ZXIuXG4gICAqL1xuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5fZ2VuZXJhdGVEYXRhKCk7XG4gICAgc3VwZXIudXBkYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBET00gaW4gbWVtb3J5IG9uIGxheWVyIGNyZWF0aW9uIHRvIGJlIGFibGUgdG8gdXNlIGl0IGJlZm9yZVxuICAgKiB0aGUgbGF5ZXIgaXMgYWN0dWFsbHkgaW5zZXJ0ZWQgaW4gdGhlIERPTVxuICAgKi9cbiAgX3JlbmRlckNvbnRhaW5lcigpIHtcbiAgICAvLyB3cmFwcGVyIGdyb3VwIGZvciBgc3RhcnQsIHRvcCBhbmQgY29udGV4dCBmbGlwIG1hdHJpeFxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIGlmICh0aGlzLnBhcmFtcy5jbGFzc05hbWUgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQoJ2xheWVyJywgdGhpcy5wYXJhbXMuY2xhc3NOYW1lKTtcbiAgICB9XG5cbiAgICAvLyBncm91cCB0byBhcHBseSBvZmZzZXRcbiAgICB0aGlzLiRvZmZzZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy4kb2Zmc2V0LmNsYXNzTGlzdC5hZGQoJ29mZnNldCcsICdpdGVtcycpO1xuICAgIC8vIGxheWVyIGJhY2tncm91bmRcbiAgICB0aGlzLiRiYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncmVjdCcpO1xuICAgIHRoaXMuJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kJyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zdHlsZS5maWxsT3BhY2l0eSA9IDA7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuICAgIC8vIGNyZWF0ZSB0aGUgRE9NIHRyZWVcbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRvZmZzZXQpO1xuICAgIHRoaXMuJG9mZnNldC5hcHBlbmRDaGlsZCh0aGlzLiRiYWNrZ3JvdW5kKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBsYXlvdXQgb2YgdGhlIGxheWVyLlxuICAgKi9cbiAgdXBkYXRlQ29udGFpbmVyKCkge1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcblxuICAgIGNvbnN0IHRvcCAgICA9IHRoaXMucGFyYW1zLnRvcDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgLy8gbWF0cml4IHRvIGludmVydCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICBjb25zdCB0cmFuc2xhdGVNYXRyaXggPSBgbWF0cml4KDEsIDAsIDAsIC0xLCAwLCAke3RvcCArIGhlaWdodH0pYDtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlTWF0cml4KTtcblxuICAgIHRoaXMuJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgaGVpZ2h0KTtcbiAgfVxufVxuIiwiLyoqXG4gKiBBIGdlbmVyYXRvciB0byBjcmVhdGUgZGF0YSBmb3IgZ3JpZCBheGlzIGFjY29yZGluZyB0byBhIGBicG1gIGFuZCBhIGBtZXRlcmAuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYXhpcy5odG1sKVxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBicG0gLSBUaGUgbnVtYmVyIG9mIGJlYXRzIHBlciBtaW51dGVzLlxuICogQHBhcmFtIHtTdHJpbmd9IHNpZ25hdHVyZSAtIFRoZSBtZXRlciBvZiB0aGUgbWVzdXJlIChgJzQvNCdgLCBgJzMvOCdgLCAuLi4pLlxuICogQHJldHVybiB7RnVuY3Rpb259IC0gVGhlIGNvbmZpZ3VyZWQgZnVuY3Rpb24gcmV0dXJuaW5nIHRoZSBkYXRhIHdoZW4gY2FsbGVkLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBncmlkQXhpc0dlbmVyYXRvcihicG0sIHNpZ25hdHVyZSkge1xuICBjb25zdCBfYnBzID0gIGJwbSAvIDYwOyAvLyBzZWNcbiAgY29uc3QgX3VuaXQgPSAxIC8gcGFyc2VJbnQoc2lnbmF0dXJlLnNwbGl0KCcvJylbMV0sIDEwKTtcbiAgY29uc3QgX25iclVuaXRzUGVyTWVzdXJlID0gcGFyc2VJbnQoc2lnbmF0dXJlLnNwbGl0KCcvJylbMF0sIDEwKTtcblxuICByZXR1cm4gZnVuY3Rpb24odGltZUNvbnRleHQpIHtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRpbWVDb250ZXh0LnZpc2libGVEdXJhdGlvbjtcbiAgICBjb25zdCBvZmZzZXQgPSB0aW1lQ29udGV4dC5vZmZzZXQ7XG4gICAgY29uc3QgZGF0YSA9IFtdO1xuXG4gICAgLy8gY29uc3QgbWluID0gTWF0aC5taW4oLW9mZnNldCwgMCk7XG4gICAgY29uc3QgbWluID0gLSBvZmZzZXQ7XG4gICAgLy8gcmVtb3ZlIHRoZSB0aW1lbGluZSdzIG9mZnNldCB0byBrZWVwIHRoZSBsYXllciBjZW50ZXJlZFxuICAgIGNvbnN0IG1heCA9IGR1cmF0aW9uIC0gb2Zmc2V0O1xuXG4gICAgLy8gZGVmaW5lIHBpeGVscyBmb3IgMSBzZWNvbmRcbiAgICBjb25zdCBwaXhlbHNQZXJTZWNvbmQgPSB0aW1lQ29udGV4dC5jb21wdXRlZFBpeGVsc1BlclNlY29uZDtcbiAgICAvLyB0aW1lIGZvciBvbmUgX3VuaXRcbiAgICBjb25zdCB1bml0VGltZSA9IDEgLyBfYnBzO1xuICAgIC8vIGRlZmluZSB0aGUgZmlyc3QgdGljayA+IG1pblxuICAgIGNvbnN0IG1vZHVsbyA9IG1pbiAlIHVuaXRUaW1lO1xuICAgIGNvbnN0IG11bHQgPSAobWluIC0gbW9kdWxvKSAvIHVuaXRUaW1lO1xuICAgIGNvbnN0IGZpcnN0VGlja1RpbWUgPSB1bml0VGltZSAqIG11bHQ7XG4gICAgLy8gdHJhY2sgd2hpY2ggcG9zaXRpb24gb2YgY3VycmVudCBiZWF0IGluIHRoZSBtZXN1cmVcbiAgICBsZXQgcG9zaXRpb25Jbk1lc3VyZSA9IG11bHQgJSBfbmJyVW5pdHNQZXJNZXN1cmU7XG5cbiAgICAvLyByZW1vdmUgbm90IGZvY3VzZWQgYmVhdHMsIGlmIHpvb21lZCBvdXRcbiAgICBjb25zdCBwaXhlbHNQZXJUaWNrID0gcGl4ZWxzUGVyU2Vjb25kIC8gX2JwcztcbiAgICBjb25zdCBtaW5TdGVwID0gNTtcblxuICAgIC8vIHRpbWUgc2hvdWxkIGJlXG4gICAgZm9yIChsZXQgdGltZSA9IGZpcnN0VGlja1RpbWU7IHRpbWUgPCBtYXg7IHRpbWUgKz0gdW5pdFRpbWUpIHtcbiAgICAgIC8vIGZpbmQgZmlyc3QgYmVhdFxuICAgICAgY29uc3QgZm9jdXNlZCA9IChwb3NpdGlvbkluTWVzdXJlKysgJSBfbmJyVW5pdHNQZXJNZXN1cmUgPT09IDApO1xuICAgICAgLy8gaWdub3JlIGlmIHBpeGVscyBwZXIgdGlja3MgaXMgdG9vIHNtYWxsXG4gICAgICBpZiAoKHBpeGVsc1BlclRpY2sgPD0gbWluU3RlcCkgJiYgIWZvY3VzZWQpIHsgY29udGludWU7IH1cblxuICAgICAgZGF0YS5wdXNoKHsgdGltZSwgZm9jdXNlZCB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcbn0iLCJpbXBvcnQgeyBwYWRMZWZ0IH0gZnJvbSAnLi4vdXRpbHMvZm9ybWF0JztcblxuXG4vKipcbiAqIEEgZ2VuZXJhdG9yIHRvIGNyZWF0ZSBkYXRhIGZvciB0aW1lIGF4aXMuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYXhpcy5odG1sKVxuICpcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSAtIFRoZSBjb25maWd1cmVkIGZ1bmN0aW9uIHJldHVybmluZyB0aGUgZGF0YSB3aGVuIGNhbGxlZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdGltZUF4aXNHZW5lcmF0b3IoKSB7XG4gIC8vIGFkZCBmYWN0b3J5IHRvIHNoYXJlIEFQSSB3aXRoIGJwbUdlbmVyYXRvclxuICByZXR1cm4gZnVuY3Rpb24odGltZUNvbnRleHQpIHtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRpbWVDb250ZXh0LnZpc2libGVEdXJhdGlvbjtcbiAgICBjb25zdCBvZmZzZXQgPSB0aW1lQ29udGV4dC5vZmZzZXQ7XG4gICAgY29uc3QgZGF0YSA9IFtdO1xuXG4gICAgLy8gY29uc3QgbWluID0gTWF0aC5taW4oLW9mZnNldCwgMCk7XG4gICAgY29uc3QgbWluID0gLSBvZmZzZXQ7XG4gICAgLy8gcmVtb3ZlIHRoZSB0aW1lbGluZSdzIG9mZnNldCB0byBrZWVwIHRoZSBsYXllciBjZW50ZXJlZFxuICAgIGNvbnN0IG1heCA9IGR1cmF0aW9uIC0gb2Zmc2V0O1xuXG4gICAgLy8gZGVmaW5lIHBpeGVscyBmb3IgMSBzZWNvbmRcbiAgICBjb25zdCBwaXhlbHNQZXJTZWNvbmQgPSB0aW1lQ29udGV4dC5jb21wdXRlZFBpeGVsc1BlclNlY29uZDtcbiAgICBjb25zdCBtaW5TdGVwID0gNztcblxuICAgIC8vIGRlZmluZSBhbGwgZGlzcGxheSBpbmZvcm1hdGlvbiBhY2NvcmRpbmcgdG8gdGhlIHBpeGVsc1BlclNlY29uZCByYXRpb1xuICAgIGxldCBzdGVwLCB0eXBlLCB0b0ZpeGVkLCBtYXJrZXJNb2R1bG8sIGluY2x1ZGVNb2R1bG87XG5cbiAgICBpZiAocGl4ZWxzUGVyU2Vjb25kICogNCA+IG1pblN0ZXApIHtcbiAgICAgIHN0ZXAgPSAxOyAvLyB0aGUgc3RlcCB0byB1c2UgdG8gY29tcHV0ZSB0aW1lXG4gICAgICB0b0ZpeGVkID0gMDtcbiAgICAgIG1hcmtlck1vZHVsbyA9IDYwOyAvLyBhIHRpbWVzdGFtcCBldmVyeSA1IHN0ZXBpeGVsc1BlclNlY29uZFxuICAgICAgaW5jbHVkZU1vZHVsbyA9IDU7IC8vIGEgdGljayBldmVyeSA1IHN0ZXBpeGVsc1BlclNlY29uZFxuICAgICAgdHlwZSA9ICc2MHNlYyc7XG4gICAgfVxuXG4gICAgaWYgKHBpeGVsc1BlclNlY29uZCAqIDIgPiBtaW5TdGVwKSB7XG4gICAgICBzdGVwID0gMTtcbiAgICAgIHRvRml4ZWQgPSAwO1xuICAgICAgbWFya2VyTW9kdWxvID0gMzA7XG4gICAgICBpbmNsdWRlTW9kdWxvID0gMTtcbiAgICAgIHR5cGUgPSAnMzBzZWMnO1xuICAgIH1cblxuICAgIGlmIChwaXhlbHNQZXJTZWNvbmQgPiBtaW5TdGVwKSB7XG4gICAgICBzdGVwID0gMTtcbiAgICAgIHRvRml4ZWQgPSAwO1xuICAgICAgbWFya2VyTW9kdWxvID0gMTA7XG4gICAgICBpbmNsdWRlTW9kdWxvID0gMTtcbiAgICAgIHR5cGUgPSAnc2VjJztcbiAgICB9XG5cbiAgICBpZiAocGl4ZWxzUGVyU2Vjb25kIC8gMTAgPiBtaW5TdGVwKSB7XG4gICAgICBzdGVwID0gMSAvIDEwO1xuICAgICAgdG9GaXhlZCA9IDE7XG4gICAgICBtYXJrZXJNb2R1bG8gPSAxMDtcbiAgICAgIGluY2x1ZGVNb2R1bG8gPSAxO1xuICAgICAgdHlwZSA9ICdkcyc7XG4gICAgfVxuXG4gICAgaWYgKHBpeGVsc1BlclNlY29uZCAvIDEwMCA+IG1pblN0ZXApIHtcbiAgICAgIHN0ZXAgPSAxIC8gMTAwO1xuICAgICAgdG9GaXhlZCA9IDI7XG4gICAgICBtYXJrZXJNb2R1bG8gPSAxMDtcbiAgICAgIGluY2x1ZGVNb2R1bG8gPSAxO1xuICAgICAgdHlwZSA9ICdjcyc7XG4gICAgfVxuXG4gICAgaWYgKHBpeGVsc1BlclNlY29uZCAvIDEwMDAgPiBtaW5TdGVwKSB7XG4gICAgICBzdGVwID0gMSAvIDEwMDA7XG4gICAgICB0b0ZpeGVkID0gMztcbiAgICAgIG1hcmtlck1vZHVsbyA9IDEwO1xuICAgICAgaW5jbHVkZU1vZHVsbyA9IDE7XG4gICAgICB0eXBlID0gJ21zJztcbiAgICB9XG5cbiAgICBmb3IgKGxldCB0aW1lID0gbWluOyB0aW1lIDwgbWF4OyB0aW1lICs9IHN0ZXApIHtcbiAgICAgIGNvbnN0IGZvcm1hdHRlZFRpbWUgPSB0aW1lLnRvRml4ZWQodG9GaXhlZCk7XG5cbiAgICAgIGlmIChNYXRoLnJvdW5kKGZvcm1hdHRlZFRpbWUgLyBzdGVwKSAlIGluY2x1ZGVNb2R1bG8gIT09IDApIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGF2b2lkIGZsb2F0aW5nIHBvaW50IGVycm9yc1xuICAgICAgY29uc3QgZm9jdXNlZCA9IE1hdGgucm91bmQoZm9ybWF0dGVkVGltZSAvIHN0ZXApICUgbWFya2VyTW9kdWxvID09PSAwID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgICBjb25zdCBkYXR1bSA9IHsgdGltZTogZm9ybWF0dGVkVGltZSwgZm9jdXNlZCB9O1xuXG4gICAgICBpZiAoZm9jdXNlZCA9PT0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoMTAwMCAqIGZvcm1hdHRlZFRpbWUpO1xuICAgICAgICBjb25zdCBtaW4gPSBwYWRMZWZ0KGRhdGUuZ2V0TWludXRlcygpLCAwLCAyKTtcbiAgICAgICAgY29uc3Qgc2VjID0gcGFkTGVmdChkYXRlLmdldFNlY29uZHMoKSwgMCwgMik7XG4gICAgICAgIGNvbnN0IG1pbGxpID0gcGFkTGVmdChkYXRlLmdldE1pbGxpc2Vjb25kcygpLCAwLCAzKTtcbiAgICAgICAgY29uc3QgbGFiZWwgPSBgJHttaW59OiR7c2VjfToke21pbGxpfWA7XG5cbiAgICAgICAgZGF0dW0ubGFiZWwgPSBsYWJlbDtcbiAgICAgIH1cblxuICAgICAgZGF0YS5wdXNoKGRhdHVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcbn0iLCIvKipcbiAqIElzIGFuIGFic3RyYWN0IGNsYXNzIG9yIGludGVyZmFjZSB0byBiZSBvdmVycmlkZW4gaW4gb3JkZXIgdG8gZGVmaW5lIHRoZSB3YXlcbiAqIGEgZ2l2ZW4gc2hhcGUgc2hvdWxkIGJlaGF2ZSB3aGVuIHNlbGVjdGVkIG9yIGVkaXRlZCBieSBhIHVzZXIuIEluc3RhbmNlcyBvZlxuICogYEJhc2VCZWhhdmlvcmAgYXJlIGludGVybmFsbHkgdXNlZCBieSBgTGF5ZXJgIGluc3RhbmNlcyB0byBtb2RpZnkgdGhlIGRhdGFcbiAqIGFjY29yZGluZyB0byBhIHVzZXIgaW50ZXJhY3Rpb24gYW5kIGEgZ2l2ZW4gc2hhcGUuIEEgc2luZ2xlIGluc3RhbmNlIG9mXG4gKiBgQmVoYXZpb3JgIGlzIGNyZWF0ZWQgaW4gb25lIGdpdmVuIHNoYXBlLlxuICpcbiAqIEJ5IGRlZmF1bHQsIHRoZSBvbmx5IG1ldGhvZCB0byBvdmVycmlkZSB0byBkZWZpbmUgYSBuZXcgYmVoYXZpb3IgZm9yIGFcbiAqIHNoYXBlIGlzIHRoZSBgZWRpdGAgbWV0aG9kLiBIb3dldmVyLCBpZiBuZWVkZWQgaW4gc3BlY2lhbCBjYXNlcywgYWxsIHRoZVxuICogc2VsZWN0aW9uIGhhbmRsaW5nIGNhbiBiZSBvdmVycmlkZW4gdG9vLlxuICpcbiAqIFRoZSBmbG93IGlzIHRoZSBmb2xsb3dpbmc6XG4gKiBgRXZlbnRgICAtIChmb3J3YXJkZWQgdG8pIC0+IGBMYXllcmAgLSAoY29tbWFuZCkgLT4gYEJlaGF2aW9yYCAtIChtb2RpZnkpIC0+IGBkYXRhYCAtICh1cGF0ZXMpIC0+IGBTaGFwZWBcbiAqXG4gKiBUaGUgYmVoYXZpb3IgcmVzcG9uc2FiaWxpdHkgaXMgdGhlbiB0byBtb2RpZnkgdGhlIGRhdGEgYWNjb3JkaW5nIHRvIHRoZVxuICogdXNlciBpbnRlcmFjdGlvbnMsIHdoaWxlIHNoYXBlcyBhcmUgYWx3YXlzIGEgdmlldyBvZiB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGVcbiAqIGRhdGEuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VCZWhhdmlvciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3NlbGVjdGVkSXRlbXMgPSBuZXcgU2V0KCk7IC8vIG5vIGR1cGxpY2F0ZSBpbiBTZXRcbiAgICB0aGlzLl9zZWxlY3RlZENsYXNzID0gbnVsbDtcbiAgICB0aGlzLl9sYXllciA9IG51bGw7XG4gIH1cblxuICBpbml0aWFsaXplKGxheWVyKSB7XG4gICAgdGhpcy5fbGF5ZXIgPSBsYXllcjtcbiAgICB0aGlzLl9zZWxlY3RlZENsYXNzID0gbGF5ZXIucGFyYW1zLnNlbGVjdGVkQ2xhc3NOYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgdGhlIHJlZmVyZW5jZXMgdG8gdGhlIHNlbGVjdGVkIGl0ZW1zLlxuICAgKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKiBAdG9kbyAtIHJlbmFtZSB0byBgY2xlYXJTZWxlY3Rpb25gIChyZW1vdmluZyB0aGUgY2xhc3MpID9cbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc2VsZWN0ZWRJdGVtcy5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjbGFzcyB0byBhZGQgdG8gdGhlIHNoYXBlcyB3aGVuIHNlbGVjdGVkLlxuICAgKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgc2V0IHNlbGVjdGVkQ2xhc3ModmFsdWUpIHtcbiAgICB0aGlzLl9zZWxlY3RlZENsYXNzID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNsYXNzIHRvIGFkZCB0byB0aGUgc2hhcGVzIHdoZW4gc2VsZWN0ZWQuXG4gICAqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBnZXQgc2VsZWN0ZWRDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDbGFzcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBjb250YWluaW5nIGFsbCB0aGUgc2VsZWN0ZWQgaXRlbXMgb2YgdGhlIGxheWVyLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqL1xuICBnZXQgc2VsZWN0ZWRJdGVtcygpIHtcbiAgICByZXR1cm4gWy4uLnRoaXMuX3NlbGVjdGVkSXRlbXNdO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGl0ZW0gLSBUaGUgaXRlbSB0byBzZWxlY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXR1bSAtIE5vdCB1c2VkIGluIHRoaXMgaW1wbGVtZW50YXRpb24uIENvdWxkIGJlXG4gICAqICAgIHVzZWQgdG8gbWFyayB0aGUgZGF0YSBhcyBzZWxlY3RlZC5cbiAgICogQHRvZG8gLSBQYXNzIHRoZSBzaGFwZSBvYmplY3QgdG8gZ2V0IHRoZSBhY2Nlc3NvcnMgP1xuICAgKi9cbiAgc2VsZWN0KCRpdGVtLCBkYXR1bSkge1xuICAgICRpdGVtLmNsYXNzTGlzdC5hZGQodGhpcy5zZWxlY3RlZENsYXNzKTtcbiAgICB0aGlzLl9zZWxlY3RlZEl0ZW1zLmFkZCgkaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkaXRlbSAtIFRoZSBpdGVtIHRvIHVuc2VsZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0dW0gLSBOb3QgdXNlZCBpbiB0aGlzIGltcGxlbWVudGF0aW9uLiBDb3VsZCBiZVxuICAgKiAgICB1c2VkIHRvIG1hcmsgdGhlIGRhdGEgYXMgc2VsZWN0ZWQuXG4gICAqIEB0b2RvIC0gUGFzcyB0aGUgc2hhcGUgb2JqZWN0IHRvIGdldCB0aGUgYWNjZXNzb3JzID9cbiAgICovXG4gIHVuc2VsZWN0KCRpdGVtLCBkYXR1bSkge1xuICAgICRpdGVtLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5zZWxlY3RlZENsYXNzKTtcbiAgICB0aGlzLl9zZWxlY3RlZEl0ZW1zLmRlbGV0ZSgkaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkaXRlbSAtIFRoZSBpdGVtIHRvIHRvZ2dsZSBzZWxlY3Rpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXR1bSAtIE5vdCB1c2VkIGluIHRoaXMgaW1wbGVtZW50YXRpb24uIENvdWxkIGJlXG4gICAqICAgIHVzZWQgdG8gbWFyayB0aGUgZGF0YSBhcyBzZWxlY3RlZC5cbiAgICogQHRvZG8gLSBQYXNzIHRoZSBzaGFwZSBvYmplY3QgdG8gZ2V0IHRoZSBhY2Nlc3NvcnMgP1xuICAgKi9cbiAgdG9nZ2xlU2VsZWN0aW9uKCRpdGVtLCBkYXR1bSkge1xuICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMuX3NlbGVjdGVkSXRlbXMuaGFzKCRpdGVtKSA/ICd1bnNlbGVjdCcgOiAnc2VsZWN0JztcbiAgICB0aGlzW21ldGhvZF0oJGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gb3ZlcnJpZGUgaW4gb3JkZXIgdG8gZGVmaW5lIGl0cyBwYXJ0aWN1bGFyIGJlaGF2aW9yIHdoZW5cbiAgICogaW50ZXJhY3RlZCB3aXRoLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyaW5nQ29udGV4dCAtIFRoZSBsYXllciByZW5kZXJpbmcgY29udGV4dC5cbiAgICogQHBhcmFtIHtCYXNlU2hhcGV9IHNoYXBlIC0gVGhlIHNoYXBlIG9iamVjdCB0byBiZSBlZGl0ZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBkYXR1bSAtIFRoZSByZWxhdGVkIGRhdHVtIHRvIG1vZGlmeS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR4IC0gVGhlIHZhbHVlIG9mIHRoZSBpbnRlcmFjdGlvbiBpbiB0aGUgeCBheGlzIChpbiBwaXhlbHMpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHkgLSBUaGUgdmFsdWUgb2YgdGhlIGludGVyYWN0aW9uIGluIHRoZSB5IGF4aXMgKGluIHBpeGVscykuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJHRhcmdldCAtIFRoZSB0YXJnZXQgRE9NIGVsZW1lbnQgb2YgdGhlIGludGVyYWN0aW9uLlxuICAgKi9cbiAgZWRpdChyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgJHRhcmdldCkge1xuICAgIC8vIG11c3QgYmUgaW1wbGVtZW50ZWQgaW4gY2hpbGRyZW5cbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VCZWhhdmlvciBmcm9tICcuL2Jhc2UtYmVoYXZpb3InO1xuXG5cbi8qKlxuICogRGVmaW5lcyB0aGUgZGVmYXVsdCBiZWhhdmlvciBmb3IgYSBicmVha3BvaW50IGZ1bmN0aW9uLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWJyZWFrcG9pbnQuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJlYWtwb2ludEJlaGF2aW9yIGV4dGVuZHMgQmFzZUJlaGF2aW9yIHtcbiAgZWRpdChyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgY29uc3QgZGF0YSAgPSB0aGlzLl9sYXllci5kYXRhO1xuICAgIGNvbnN0IGxheWVySGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG4gICAgLy8gY3VycmVudCBwb3NpdGlvblxuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLmN4KGRhdHVtKSk7XG4gICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHNoYXBlLmN5KGRhdHVtKSk7XG4gICAgLy8gdGFyZ2V0IHBvc2l0aW9uXG4gICAgbGV0IHRhcmdldFggPSB4ICsgZHg7XG4gICAgbGV0IHRhcmdldFkgPSB5IC0gZHk7XG5cbiAgICBpZiAoZGF0YS5sZW5ndGggPiAyKSB7XG4gICAgICAvLyBjcmVhdGUgYSBzb3J0ZWQgbWFwIG9mIGFsbCBgeGAgcG9zaXRpb25zXG4gICAgICBjb25zdCB4TWFwID0gZGF0YS5tYXAoKGQpID0+IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2hhcGUuY3goZCkpKTtcbiAgICAgIHhNYXAuc29ydCgoYSwgYikgPT4gYSA8IGIgPyAtMSA6IDEpO1xuICAgICAgLy8gZmluZCBpbmRleCBvZiBvdXIgc2hhcGUgeCBwb3NpdGlvblxuICAgICAgY29uc3QgaW5kZXggPSB4TWFwLmluZGV4T2YoeCk7XG4gICAgICAvLyBsb2NrIHRvIG5leHQgc2libGluZ3NcbiAgICAgIGlmICh0YXJnZXRYIDwgeE1hcFtpbmRleCAtIDFdIHx8wqB0YXJnZXRYID4geE1hcFtpbmRleCArIDFdKSB7XG4gICAgICAgIHRhcmdldFggPSB4O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGxvY2sgaW4geSBheGlzXG4gICAgaWYgKHRhcmdldFkgPCAwKSB7XG4gICAgICB0YXJnZXRZID0gMDtcbiAgICB9IGVsc2UgaWYgKHRhcmdldFkgPiBsYXllckhlaWdodCkge1xuICAgICAgdGFyZ2V0WSA9IGxheWVySGVpZ2h0O1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBkYXR1bSB3aXRoIG5ldyB2YWx1ZXNcbiAgICBzaGFwZS5jeChkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0WCkpO1xuICAgIHNoYXBlLmN5KGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbC5pbnZlcnQodGFyZ2V0WSkpO1xuICB9XG59XG4iLCJpbXBvcnQgQmFzZUJlaGF2aW9yIGZyb20gJy4vYmFzZS1iZWhhdmlvcic7XG5cblxuLyoqXG4gKiBEZWZpbmVzIHRoZSBkZWZhdWx0IGJlaGF2aW9yIGZvciBhIG1hcmtlci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1tYXJrZXIuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFya2VyQmVoYXZpb3IgZXh0ZW5kcyBCYXNlQmVoYXZpb3Ige1xuICBlZGl0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS54KGRhdHVtKSk7XG4gICAgbGV0IHRhcmdldFggPSAoeCArIGR4KSA+IDAgPyB4ICsgZHggOiAwO1xuXG4gICAgc2hhcGUueChkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0WCkpO1xuICB9XG59XG4iLCJpbXBvcnQgQmFzZUJlaGF2aW9yIGZyb20gJy4vYmFzZS1iZWhhdmlvcic7XG5cblxuLyoqXG4gKiBEZWZpbmVzIHRoZSBkZWZhdWx0IGJlaGF2aW9yIGZvciBhIHNlZ21lbnQuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItbWFya2VyLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlZ21lbnRCZWhhdmlvciBleHRlbmRzIEJhc2VCZWhhdmlvciB7XG4gIGVkaXQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IHRhcmdldC5jbGFzc0xpc3Q7XG4gICAgbGV0IGFjdGlvbiA9ICdtb3ZlJztcblxuICAgIGlmIChjbGFzc0xpc3QuY29udGFpbnMoJ2hhbmRsZXInKSAmJiBjbGFzc0xpc3QuY29udGFpbnMoJ2xlZnQnKSkge1xuICAgICAgYWN0aW9uID0gJ3Jlc2l6ZUxlZnQnO1xuICAgIH0gZWxzZSBpZiAoY2xhc3NMaXN0LmNvbnRhaW5zKCdoYW5kbGVyJykgJiYgY2xhc3NMaXN0LmNvbnRhaW5zKCdyaWdodCcpKSB7XG4gICAgICBhY3Rpb24gPSAncmVzaXplUmlnaHQnO1xuICAgIH1cblxuICAgIHRoaXNbYF8ke2FjdGlvbn1gXShyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KTtcbiAgfVxuXG4gIF9tb3ZlKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCBsYXllckhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuICAgIC8vIGN1cnJlbnQgdmFsdWVzXG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2hhcGUueChkYXR1bSkpO1xuICAgIGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChzaGFwZS55KGRhdHVtKSk7XG4gICAgY29uc3QgaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoc2hhcGUuaGVpZ2h0KGRhdHVtKSk7XG4gICAgLy8gdGFyZ2V0IHZhbHVlc1xuICAgIGxldCB0YXJnZXRYID0gTWF0aC5tYXgoeCArIGR4LCAwKTtcbiAgICBsZXQgdGFyZ2V0WSA9IHkgLSBkeTtcblxuICAgIC8vIGxvY2sgaW4gbGF5ZXIncyB5IGF4aXNcbiAgICBpZiAodGFyZ2V0WSA8IDApIHtcbiAgICAgIHRhcmdldFkgPSAwO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0WSArIGhlaWdodCA+IGxheWVySGVpZ2h0KSB7XG4gICAgICB0YXJnZXRZID0gbGF5ZXJIZWlnaHQgLSBoZWlnaHQ7XG4gICAgfVxuXG4gICAgc2hhcGUueChkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0WCkpO1xuICAgIHNoYXBlLnkoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmludmVydCh0YXJnZXRZKSk7XG4gIH1cblxuICBfcmVzaXplTGVmdChyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgLy8gY3VycmVudCB2YWx1ZXNcbiAgICBjb25zdCB4ICAgICA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2hhcGUueChkYXR1bSkpO1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS53aWR0aChkYXR1bSkpO1xuICAgIC8vIHRhcmdldCB2YWx1ZXNcbiAgICBsZXQgbWF4VGFyZ2V0WCAgPSB4ICsgd2lkdGg7XG4gICAgbGV0IHRhcmdldFggICAgID0geCArIGR4IDwgbWF4VGFyZ2V0WCA/IE1hdGgubWF4KHggKyBkeCwgMCkgOiB4O1xuICAgIGxldCB0YXJnZXRXaWR0aCA9IHRhcmdldFggIT09IDAgPyBNYXRoLm1heCh3aWR0aCAtIGR4LCAxKSA6IHdpZHRoO1xuXG4gICAgc2hhcGUueChkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0WCkpO1xuICAgIHNoYXBlLndpZHRoKGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRXaWR0aCkpO1xuICB9XG5cbiAgX3Jlc2l6ZVJpZ2h0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICAvLyBjdXJyZW50IHZhbHVlc1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS53aWR0aChkYXR1bSkpO1xuICAgIC8vIHRhcmdldCB2YWx1ZXNcbiAgICBsZXQgdGFyZ2V0V2lkdGggPSBNYXRoLm1heCh3aWR0aCArIGR4LCAxKTtcblxuICAgIHNoYXBlLndpZHRoKGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRXaWR0aCkpO1xuICB9XG59XG4iLCIvKipcbiAqIFRpbWVDb250ZXh0QmVoYXZpb3IgaXMgdXNlZCBpbnRlcm5hbGx5IGluIExheWVycyB0byBtb2RpZnkgdGhlaXIgVGltZUNvbnRleHQuXG4gKiBUaGlzIG9iamVjdCBpcyBkaWZmZXJlbnQgZnJvbSBvdGhlciBTaGFwZXMgQmVoYXZpb3JzIGFuZCBleGlzdHMgbW9zdGx5IHRvIGRlY3JlYXNlIHRoZSBzaXplIG9mIHRoZSBMYXllci5cbiAqIEFsbCB0aGUgY29kZSBoZXJlIGNvdWxkIGJlIGNvbnNpZGVyZWQgYXMgcGFydCBvZiB0aGUgbGF5ZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVDb250ZXh0QmVoYXZpb3Ige1xuICBlZGl0KGxheWVyLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gbGF5ZXIudGltZUNvbnRleHQ7XG5cbiAgICBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnaGFuZGxlcicpICYmIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2xlZnQnKSkge1xuICAgICAgdGhpcy5fZWRpdExlZnQodGltZUNvbnRleHQsIGR4KTtcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2hhbmRsZXInKSAmJiB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdyaWdodCcpKSB7XG4gICAgICB0aGlzLl9lZGl0UmlnaHQodGltZUNvbnRleHQsIGR4KTtcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3NlZ21lbnQnKSkge1xuICAgICAgdGhpcy5fbW92ZSh0aW1lQ29udGV4dCwgZHgpO1xuICAgIH1cbiAgfVxuXG4gIF9lZGl0TGVmdCh0aW1lQ29udGV4dCwgZHgpIHtcbiAgICAvLyBlZGl0IGBzdGFydGAsIGBvZmZzZXRgIGFuZCBgZHVyYXRpb25gXG4gICAgY29uc3QgeCA9IHRpbWVDb250ZXh0LnBhcmVudC50aW1lVG9QaXhlbCh0aW1lQ29udGV4dC5zdGFydCk7XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwodGltZUNvbnRleHQub2Zmc2V0KTtcbiAgICBjb25zdCB3aWR0aCA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRpbWVDb250ZXh0LmR1cmF0aW9uKTtcblxuICAgIGNvbnN0IHRhcmdldFggPSB4ICsgZHg7XG4gICAgY29uc3QgdGFyZ2V0T2Zmc2V0ID0gb2Zmc2V0IC0gZHg7XG4gICAgY29uc3QgdGFyZ2V0V2lkdGggPSBNYXRoLm1heCh3aWR0aCAtIGR4LCAxKTtcblxuICAgIHRpbWVDb250ZXh0LnN0YXJ0ID0gdGltZUNvbnRleHQucGFyZW50LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRYKTtcbiAgICB0aW1lQ29udGV4dC5vZmZzZXQgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0T2Zmc2V0KTtcbiAgICB0aW1lQ29udGV4dC5kdXJhdGlvbiA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRXaWR0aCk7XG4gIH1cblxuICBfZWRpdFJpZ2h0KHRpbWVDb250ZXh0LCBkeCkge1xuICAgIGNvbnN0IHdpZHRoID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwodGltZUNvbnRleHQuZHVyYXRpb24pO1xuICAgIGNvbnN0IHRhcmdldFdpZHRoID0gTWF0aC5tYXgod2lkdGggKyBkeCwgMSk7XG5cbiAgICB0aW1lQ29udGV4dC5kdXJhdGlvbiA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRXaWR0aCk7XG4gIH1cblxuICBfbW92ZSh0aW1lQ29udGV4dCwgZHgpIHtcbiAgICBjb25zdCB4ID0gdGltZUNvbnRleHQucGFyZW50LnRpbWVUb1BpeGVsKHRpbWVDb250ZXh0LnN0YXJ0KTtcbiAgICBjb25zdCB0YXJnZXRYID0gTWF0aC5tYXgoeCArIGR4LCAwKTtcblxuICAgIHRpbWVDb250ZXh0LnN0YXJ0ID0gdGltZUNvbnRleHQucGFyZW50LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRYKTtcbiAgfVxuXG4gIHN0cmV0Y2gobGF5ZXIsIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgY29uc3QgdGltZUNvbnRleHQgPSBsYXllci50aW1lQ29udGV4dDtcbiAgICBjb25zdCBsYXN0RHVyYXRpb24gPSB0aW1lQ29udGV4dC5kdXJhdGlvbjtcbiAgICBjb25zdCBsYXN0T2Zmc2V0ID0gdGltZUNvbnRleHQub2Zmc2V0O1xuXG4gICAgdGhpcy5lZGl0KGxheWVyLCBkeCwgZHksIHRhcmdldCk7XG5cbiAgICBjb25zdCBuZXdEdXJhdGlvbiA9IHRpbWVDb250ZXh0LmR1cmF0aW9uO1xuICAgIGNvbnN0IHJhdGlvID0gKG5ld0R1cmF0aW9uIC8gbGFzdER1cmF0aW9uKTtcblxuICAgIHRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbyAqPSByYXRpbztcbiAgICB0aW1lQ29udGV4dC5vZmZzZXQgPSBsYXN0T2Zmc2V0O1xuICAgIHRpbWVDb250ZXh0LmR1cmF0aW9uID0gbGFzdER1cmF0aW9uO1xuICB9XG59XG4iLCJpbXBvcnQgQmFzZUJlaGF2aW9yIGZyb20gJy4vYmFzZS1iZWhhdmlvcic7XG5cblxuLyoqXG4gKiBEZWZpbmVzIHRoZSBkZWZhdWx0IGJlaGF2aW9yIGZvciBhIHRyYWNlIHZpc3VhbGl6YXRpb24uXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItdHJhY2UuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2VCZWhhdmlvciBleHRlbmRzIEJhc2VCZWhhdmlvciB7XG4gIGVkaXQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtaW4nKSkge1xuICAgICAgdGhpcy5fZWRpdFJhbmdlKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCAnbWluJyk7XG4gICAgfSBlbHNlIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXgnKSkge1xuICAgICAgdGhpcy5fZWRpdFJhbmdlKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCAnbWF4Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VkaXRNZWFuKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5KTtcbiAgICB9XG4gIH1cblxuICBfZWRpdE1lYW4ocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHkpIHtcbiAgICAvLyB3b3JrIGluIHBpeGVsIGRvbWFpblxuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLngoZGF0dW0pKTtcbiAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoc2hhcGUubWVhbihkYXR1bSkpO1xuXG4gICAgbGV0IHRhcmdldFggPSB4ICsgZHg7XG4gICAgbGV0IHRhcmdldFkgPSB5IC0gZHk7XG5cbiAgICBzaGFwZS54KGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRYKSk7XG4gICAgc2hhcGUubWVhbihkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFkpKTtcbiAgfVxuXG4gIF9lZGl0UmFuZ2UocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHJhbmdlU2lkZSkge1xuICAgIGNvbnN0IHJhbmdlID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoc2hhcGUucmFuZ2UoZGF0dW0pKTtcblxuICAgIGxldCB0YXJnZXRSYW5nZSA9IHJhbmdlU2lkZSA9PT0gJ21pbicgPyByYW5nZSArIDIgKiBkeSA6IHJhbmdlIC0gMiAqIGR5O1xuICAgIHRhcmdldFJhbmdlID0gTWF0aC5tYXgodGFyZ2V0UmFuZ2UsIDApO1xuXG4gICAgc2hhcGUucmFuZ2UoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmludmVydCh0YXJnZXRSYW5nZSkpO1xuICB9XG59XG4iLCJpbXBvcnQgc2NhbGVzIGZyb20gJy4uL3V0aWxzL3NjYWxlcyc7XG5cblxuLyoqXG4gKiBBIGBMYXllclRpbWVDb250ZXh0YCBpbnN0YW5jZSByZXByZXNlbnRzIGEgdGltZSBzZWdtZW50IGludG8gYSBgVGltZWxpbmVUaW1lQ29udGV4dGAuXG4gKiBJdCBtdXN0IGJlIGF0dGFjaGVkIHRvIGEgYFRpbWVsaW5lVGltZUNvbnRleHRgICh0aGUgb25lIG9mIHRoZSB0aW1lbGluZSBpdFxuICogYmVsb25ncyB0bykuIEl0IHJlbGllcyBvbiBpdHMgcGFyZW50J3MgYHRpbWVUb1BpeGVsYCAodGltZSB0byBwaXhlbCB0cmFuc2ZlcnRcbiAqIGZ1bmN0aW9uKSB0byBjcmVhdGUgdGhlIHRpbWUgdG8gcGl4ZWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIExheWVyICh0aGUgdmlldykgaXQgaXMgYXR0YWNoZWQgdG8uXG4gKlxuICogVGhlIGBsYXllclRpbWVDb250ZXh0YCBoYXMgZm91ciBpbXBvcnRhbnQgYXR0cmlidXRlczpcbiAqIC0gYHN0YXJ0YCByZXByZXNlbnQgdGhlIHRpbWUgYXQgd2hpY2ggdGVtcG9yYWwgZGF0YSBtdXN0IGJlIHJlcHJlc2VudGVkXG4gKiAgIGluIHRoZSB0aW1lbGluZSAoZm9yIGluc3RhbmNlIHRoZSBiZWdpbmluZyBvZiBhIHNvdW5kZmlsZSBpbiBhIERBVykuXG4gKiAtIGBvZmZzZXRgIHJlcHJlc2VudHMgb2Zmc2V0IHRpbWUgb2YgdGhlIGRhdGEgaW4gdGhlIGNvbnRleHQgb2YgYSBMYXllci5cbiAqICAgKEBUT0RPIGdpdmUgYSB1c2UgY2FzZSBleGFtcGxlIGhlcmUgXCJjcm9wID9cIiwgYW5kL29yIGV4cGxhaW4gdGhhdCBpdCdzIG5vdCBhIGNvbW1vbiB1c2UgY2FzZSkuXG4gKiAtIGBkdXJhdGlvbmAgaXMgdGhlIGR1cmF0aW9uIG9mIHRoZSB2aWV3IG9uIHRoZSBkYXRhLlxuICogLSBgc3RyZXRjaFJhdGlvYCBpcyB0aGUgc3RyZXRjaCBhcHBseWVkIHRvIHRoZSB0ZW1wb3JhbCBkYXRhIGNvbnRhaW5lZCBpblxuICogICB0aGUgdmlldyAodGhpcyB2YWx1ZSBjYW4gYmUgc2VlbiBhcyBhIGxvY2FsIHpvb20gb24gdGhlIGRhdGEsIG9yIGFzIGEgc3RyZXRjaFxuICogICBvbiB0aGUgdGltZSBjb21wb25lbnRzIG9mIHRoZSBkYXRhKS4gV2hlbiBhcHBseWVkLCB0aGUgc3RyZXRjaCByYXRpbyBtYWludGFpblxuICogICB0aGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHZpZXcgaW4gdGhlIHRpbWVsaW5lLlxuICpcbiAqIGBgYFxuICogKyB0aW1lbGluZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogMCAgICAgICAgIDUgICAgICAgICAxMCAgICAgICAgICAxNSAgICAgICAgICAyMCAgICAgICAgMjUgICAgICAgICAgMzAgc2Vjb25kc1xuICogKy0tLSsqKioqKioqKioqKioqKioqKistLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rKioqKioqKistLVxuICogICAgIHwqKiogc291bmRmaWxlICoqKnxMYXllciAodmlldyBvbiB0aGUgc291bmQgZmlsZSkgICAgICAgICAgICB8KioqKioqKnxcbiAqICAgICArKioqKioqKioqKioqKioqKiorLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKyoqKioqKiorXG4gKlxuICogICAgIDwtLS0tIG9mZnNldCAtLS0tPjwtLS0tLS0tLS0tLS0tLS0gZHVyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS0+XG4gKiA8LS0tLS0tLS0gc3RhcnQgLS0tLS0+XG4gKlxuICogVGhlIHBhcnRzIG9mIHRoZSBzb3VuZCBmaWxlIHJlcHJlc2VudGVkIHdpdGggJyonIGFyZSBoaWRkZW4gZnJvbSB0aGUgdmlld1xuICogYGBgXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvdGltZS1jb250ZXh0cy5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXllclRpbWVDb250ZXh0IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7VGltZWxpbmVUaW1lQ29udGV4dH0gcGFyZW50IC0gVGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCBpbnN0YW5jZSBvZiB0aGUgdGltZWxpbmUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJlbnQpIHtcbiAgICBpZiAoIXBhcmVudCkgeyB0aHJvdyBuZXcgRXJyb3IoJ0xheWVyVGltZUNvbnRleHQgbXVzdCBoYXZlIGEgcGFyZW50Jyk7IH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAgaW5zdGFuY2Ugb2YgdGhlIHRpbWVsaW5lLlxuICAgICAqXG4gICAgICogQHR5cGUge1RpbWVsaW5lVGltZUNvbnRleHR9XG4gICAgICovXG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG5cbiAgICB0aGlzLl90aW1lVG9QaXhlbCA9IG51bGw7XG4gICAgdGhpcy5fc3RhcnQgPSAwO1xuICAgIHRoaXMuX2R1cmF0aW9uID0gcGFyZW50LnZpc2libGVEdXJhdGlvbjtcbiAgICB0aGlzLl9vZmZzZXQgPSAwO1xuICAgIHRoaXMuX3N0cmV0Y2hSYXRpbyA9IDE7XG4gICAgLy8gcmVnaXN0ZXIgaW50byB0aGUgdGltZWxpbmUncyBUaW1lQ29udGV4dFxuICAgIHRoaXMucGFyZW50Ll9jaGlsZHJlbi5wdXNoKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGUgY3VycmVudCB0aW1lIGNvbnRleHQuXG4gICAqXG4gICAqIEByZXR1cm4ge0xheWVyVGltZUNvbnRleHR9XG4gICAqL1xuICBjbG9uZSgpIHtcbiAgICBjb25zdCBjdHggPSBuZXcgdGhpcygpO1xuXG4gICAgY3R4LnBhcmVudCA9IHRoaXMucGFyZW50O1xuICAgIGN0eC5zdGFydCA9IHRoaXMuc3RhcnQ7XG4gICAgY3R4LmR1cmF0aW9uID0gdGhpcy5kdXJhdGlvbjtcbiAgICBjdHgub2Zmc2V0ID0gdGhpcy5vZmZzZXQ7XG4gICAgY3R4LnN0cmV0Y2hSYXRpbyA9IHRoaXMuc3RyZXRjaFJhdGlvOyAvLyBjcmVhdGVzIHRoZSBsb2NhbCBzY2FsZSBpZiBuZWVkZWRcblxuICAgIHJldHVybiBjdHg7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHRpbWUgY29udGV4dCAoaW4gc2Vjb25kcykuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgc3RhcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSB0aW1lIGNvbnRleHQgKGluIHNlY29uZHMpLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IHN0YXJ0KHZhbHVlKSB7XG4gICAgdGhpcy5fc3RhcnQgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkdXJhdGlvbiBvZiB0aGUgdGltZSBjb250ZXh0IChpbiBzZWNvbmRzKS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBkdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fZHVyYXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgZHVyYXRpb24gb2YgdGhlIHRpbWUgY29udGV4dCAoaW4gc2Vjb25kcykuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgZHVyYXRpb24odmFsdWUpIHtcbiAgICB0aGlzLl9kdXJhdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG9mZnNldCBvZiB0aGUgdGltZSBjb250ZXh0IChpbiBzZWNvbmRzKS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29mZnNldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBvZmZzZXQgb2YgdGhlIHRpbWUgY29udGV4dCAoaW4gc2Vjb25kcykuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgb2Zmc2V0KHZhbHVlKSB7XG4gICAgdGhpcy5fb2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc3RyZXRjaCByYXRpbyBvZiB0aGUgdGltZSBjb250ZXh0LlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHN0cmV0Y2hSYXRpbygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RyZXRjaFJhdGlvO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHN0cmV0Y2ggcmF0aW8gb2YgdGhlIHRpbWUgY29udGV4dC5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBzdHJldGNoUmF0aW8odmFsdWUpIHtcbiAgICAvLyByZW1vdmUgbG9jYWwgc2NhbGUgaWYgcmF0aW8gPSAxXG4gICAgaWYgKHZhbHVlID09PSAgMSkge1xuICAgICAgdGhpcy5fdGltZVRvUGl4ZWwgPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyByZXVzZSBwcmV2aXNvdXNseSBjcmVhdGVkIGxvY2FsIHNjYWxlIGlmIGV4aXN0c1xuICAgIGNvbnN0IHRpbWVUb1BpeGVsID0gdGhpcy5fdGltZVRvUGl4ZWwgP1xuICAgICAgdGhpcy5fdGltZVRvUGl4ZWwgOiBzY2FsZXMubGluZWFyKCkuZG9tYWluKFswLCAxXSk7XG5cbiAgICB0aW1lVG9QaXhlbC5yYW5nZShbMCwgdGhpcy5wYXJlbnQuY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQgKiB2YWx1ZV0pO1xuXG4gICAgdGhpcy5fdGltZVRvUGl4ZWwgPSB0aW1lVG9QaXhlbDtcbiAgICB0aGlzLl9zdHJldGNoUmF0aW8gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0aW1lIHRvIHBpeGVsIHRyYW5zZmVydCBmdW5jdGlvbiBvZiB0aGUgdGltZSBjb250ZXh0LiBJZlxuICAgKiB0aGUgYHN0cmV0Y2hSYXRpb2AgYXR0cmlidXRlIGlzIGVxdWFsIHRvIDEsIHRoaXMgZnVuY3Rpb24gaXMgdGhlIGdsb2JhbFxuICAgKiBvbmUgZnJvbSB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgIGluc3RhbmNlLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBnZXQgdGltZVRvUGl4ZWwoKSB7XG4gICAgaWYgKCF0aGlzLl90aW1lVG9QaXhlbCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnRpbWVUb1BpeGVsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl90aW1lVG9QaXhlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gY29udmVydCBwaXhlbCB0byB0aW1lLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcHhcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgcGl4ZWxUb1RpbWUocHgpIHtcbiAgICBpZiAoIXRoaXMuX3RpbWVUb1BpeGVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQudGltZVRvUGl4ZWwuaW52ZXJ0KHB4KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdGltZVRvUGl4ZWwuaW52ZXJ0KHB4KTtcbiAgfVxufVxuIiwiaW1wb3J0IGV2ZW50cyBmcm9tICdldmVudHMnO1xuaW1wb3J0IG5zIGZyb20gJy4vbmFtZXNwYWNlJztcbmltcG9ydCBzY2FsZXMgZnJvbSAnLi4vdXRpbHMvc2NhbGVzJztcbmltcG9ydCBTZWdtZW50IGZyb20gJy4uL3NoYXBlcy9zZWdtZW50JztcbmltcG9ydCBUaW1lQ29udGV4dEJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy90aW1lLWNvbnRleHQtYmVoYXZpb3InO1xuXG4vLyB0aW1lIGNvbnRleHQgYmFoZXZpb3JcbmxldCB0aW1lQ29udGV4dEJlaGF2aW9yID0gbnVsbDtcbmxldCB0aW1lQ29udGV4dEJlaGF2aW9yQ3RvciA9IFRpbWVDb250ZXh0QmVoYXZpb3I7XG5cbi8qKlxuICogVGhlIGxheWVyIGNsYXNzIGlzIHRoZSBtYWluIHZpc3VhbGl6YXRpb24gY2xhc3MuIEl0IGlzIG1haW5seSBkZWZpbmVzIGJ5IGl0c1xuICogcmVsYXRlZCBgTGF5ZXJUaW1lQ29udGV4dGAgd2hpY2ggZGV0ZXJtaW5lcyBpdHMgcG9zaXRpb24gaW4gdGhlIG92ZXJhbGxcbiAqIHRpbWVsaW5lICh0aHJvdWdoIHRoZSBgc3RhcnRgLCBgZHVyYXRpb25gLCBgb2Zmc2V0YCBhbmQgYHN0cmV0Y2hSYXRpb2BcbiAqIGF0dHJpYnV0ZXMpIGFuZCBieSBpdCdzIHJlZ2lzdGVyZWQgU2hhcGUgd2hpY2ggZGVmaW5lcyBob3cgdG8gZGlzcGxheSB0aGVcbiAqIGRhdGEgYXNzb2NpYXRlZCB0byB0aGUgbGF5ZXIuIEVhY2ggY3JlYXRlZCBsYXllciBtdXN0IGJlIGluc2VydGVkIGludG8gYVxuICogYFRyYWNrYCBpbnN0YW5jZSBpbiBvcmRlciB0byBiZSBkaXNwbGF5ZWQuXG4gKlxuICogX05vdGU6IGluIHRoZSBjb250ZXh0IG9mIHRoZSBsYXllciwgYW4gX19pdGVtX18gaXMgdGhlIFNWRyBlbGVtZW50XG4gKiByZXR1cm5lZCBieSBhIGBTaGFwZWAgaW5zdGFuY2UgYW5kIGFzc29jaWF0ZWQgd2l0aCBhIHBhcnRpY3VsYXIgX19kYXR1bV9fLl9cbiAqXG4gKiAjIyMgTGF5ZXIgRE9NIHN0cnVjdHVyZVxuICogYGBgXG4gKiA8ZyBjbGFzcz1cImxheWVyXCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKCR7c3RhcnR9LCAwKVwiPlxuICogICA8c3ZnIGNsYXNzPVwiYm91bmRpbmctYm94XCIgd2lkdGg9XCIke2R1cmF0aW9ufVwiPlxuICogICAgIDxnIGNsYXNzPVwib2Zmc2V0XCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKCR7b2Zmc2V0LCAwfSlcIj5cbiAqICAgICAgIDwhLS0gYmFja2dyb3VuZCAtLT5cbiAqICAgICAgIDxyZWN0IGNsYXNzPVwiYmFja2dyb3VuZFwiPjwvcmVjdD5cbiAqICAgICAgIDwhLS0gc2hhcGVzIGFuZCBjb21tb24gc2hhcGVzIGFyZSBpbnNlcnRlZCBoZXJlIC0tPlxuICogICAgIDwvZz5cbiAqICAgICA8ZyBjbGFzcz1cImludGVyYWN0aW9uc1wiPjwhLS0gZm9yIGZlZWRiYWNrIC0tPjwvZz5cbiAqICAgPC9zdmc+XG4gKiA8L2c+XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF5ZXIgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhVHlwZSAtIERlZmluZXMgaG93IHRoZSBsYXllciBzaG91bGQgbG9vayBhdCB0aGUgZGF0YS5cbiAgICogICAgQ2FuIGJlICdlbnRpdHknIG9yICdjb2xsZWN0aW9uJy5cbiAgICogQHBhcmFtIHsoQXJyYXl8T2JqZWN0KX0gZGF0YSAtIFRoZSBkYXRhIGFzc29jaWF0ZWQgdG8gdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIENvbmZpZ3VyZXMgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGVpZ2h0PTEwMF0gLSBEZWZpbmVzIHRoZSBoZWlnaHQgb2YgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMudG9wPTBdIC0gRGVmaW5lcyB0aGUgdG9wIHBvc2l0aW9uIG9mIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm9wYWNpdHk9MV0gLSBEZWZpbmVzIHRoZSBvcGFjaXR5IG9mIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnlEb21haW49WzAsMV1dIC0gRGVmaW5lcyBib3VuZGFyaWVzIG9mIHRoZSBkYXRhXG4gICAqICAgIHZhbHVlcyBpbiB5IGF4aXMgKGZvciBleGVtcGxlIHRvIGRpc3BsYXkgYW4gYXVkaW8gYnVmZmVyLCB0aGlzIGF0dHJpYnV0ZVxuICAgKiAgICBzaG91bGQgYmUgc2V0IHRvIFstMSwgMV0uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jbGFzc05hbWU9bnVsbF0gLSBBbiBvcHRpb25uYWwgY2xhc3MgdG8gYWRkIHRvIGVhY2hcbiAgICogICAgY3JlYXRlZCBzaGFwZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNsYXNzTmFtZT0nc2VsZWN0ZWQnXSAtIFRoZSBjbGFzcyB0byBhZGQgdG8gYSBzaGFwZVxuICAgKiAgICB3aGVuIHNlbGVjdGVkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuY29udGV4dEhhbmRsZXJXaWR0aD0yXSAtIFRoZSB3aWR0aCBvZiB0aGUgaGFuZGxlcnNcbiAgICogICAgZGlzcGxheWVkIHRvIGVkaXQgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGl0dGFibGU9ZmFsc2VdIC0gRGVmaW5lcyBpZiB0aGUgbGF5ZXIgY2FuIGJlIGludGVyYWN0ZWRcbiAgICogICAgd2l0aC4gQmFzaWNhbGx5LCB0aGUgbGF5ZXIgaXMgbm90IHJldHVybmVkIGJ5IGBCYXNlU3RhdGUuZ2V0SGl0TGF5ZXJzYCB3aGVuXG4gICAqICAgIHNldCB0byBmYWxzZSAoYSBjb21tb24gdXNlIGNhc2UgaXMgYSBsYXllciB0aGF0IGNvbnRhaW5zIGEgY3Vyc29yKVxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YVR5cGUsIGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGhlaWdodDogMTAwLFxuICAgICAgdG9wOiAwLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIHlEb21haW46IFswLCAxXSxcbiAgICAgIGNsYXNzTmFtZTogbnVsbCxcbiAgICAgIHNlbGVjdGVkQ2xhc3NOYW1lOiAnc2VsZWN0ZWQnLFxuICAgICAgY29udGV4dEhhbmRsZXJXaWR0aDogMixcbiAgICAgIGhpdHRhYmxlOiB0cnVlLCAvLyB3aGVuIGZhbHNlIHRoZSBsYXllciBpcyBub3QgcmV0dXJuZWQgYnkgYEJhc2VTdGF0ZS5nZXRIaXRMYXllcnNgXG4gICAgICBpZDogJycsIC8vIHVzZWQgP1xuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLCAvLyB1c2VmdWxsID9cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUGFyYW1ldGVycyBvZiB0aGUgbGF5ZXJzLCBgZGVmYXVsdHNgIG92ZXJyaWRlZCB3aXRoIG9wdGlvbnMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIGhvdyB0aGUgbGF5ZXIgc2hvdWxkIGxvb2sgYXQgdGhlIGRhdGEgKGAnZW50aXR5J2Agb3IgYCdjb2xsZWN0aW9uJ2ApLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5kYXRhVHlwZSA9IGRhdGFUeXBlOyAvLyAnZW50aXR5JyB8fCAnY29sbGVjdGlvbic7XG4gICAgLyoqIEB0eXBlIHtMYXllclRpbWVDb250ZXh0fSAqL1xuICAgIHRoaXMudGltZUNvbnRleHQgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7RWxlbWVudH0gKi9cbiAgICB0aGlzLiRlbCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJGJhY2tncm91bmQgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7RWxlbWVudH0gKi9cbiAgICB0aGlzLiRib3VuZGluZ0JveCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJG9mZnNldCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtFbGVtZW50fSAqL1xuICAgIHRoaXMuJGludGVyYWN0aW9ucyA9IG51bGw7XG4gICAgLyoqXG4gICAgICogQSBTZWdtZW50IGluc3RhbmNpYXRlZCB0byBpbnRlcmFjdCB3aXRoIHRoZSBMYXllciBpdHNlbGYuXG4gICAgICogQHR5cGUge1NlZ21lbnR9XG4gICAgICovXG4gICAgdGhpcy5jb250ZXh0U2hhcGUgPSBudWxsO1xuXG4gICAgdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uID0gbnVsbDsgICAgICAgLy8geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfVxuICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiA9IG51bGw7IC8vIHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH1cbiAgICB0aGlzLl8kaXRlbVNoYXBlTWFwID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuXyRpdGVtRGF0YU1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwID0gbmV3IE1hcCgpO1xuXG4gICAgdGhpcy5faXNDb250ZXh0RWRpdGFibGUgPSBmYWxzZTtcbiAgICB0aGlzLl9iZWhhdmlvciA9IG51bGw7XG5cbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuXG4gICAgdGhpcy5fdmFsdWVUb1BpeGVsID0gc2NhbGVzLmxpbmVhcigpXG4gICAgICAuZG9tYWluKHRoaXMucGFyYW1zLnlEb21haW4pXG4gICAgICAucmFuZ2UoWzAsIHRoaXMucGFyYW1zLmhlaWdodF0pO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSB0aW1lQ29udGV4dCBsYXlvdXRcbiAgICB0aGlzLl9yZW5kZXJDb250YWluZXIoKTtcbiAgICAvLyBjcmVhdGVzIHRoZSB0aW1lQ29udGV4dEJlaGF2aW9yIGZvciBhbGwgbGF5ZXJzXG4gICAgaWYgKHRpbWVDb250ZXh0QmVoYXZpb3IgPT09IG51bGwpIHtcbiAgICAgIHRpbWVDb250ZXh0QmVoYXZpb3IgPSBuZXcgdGltZUNvbnRleHRCZWhhdmlvckN0b3IoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveSB0aGUgbGF5ZXIsIGNsZWFyIGFsbCByZWZlcmVuY2VzLlxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbnVsbDtcbiAgICB0aGlzLmRhdGEgPSBudWxsO1xuICAgIHRoaXMucGFyYW1zID0gbnVsbDtcbiAgICB0aGlzLl9iZWhhdmlvciA9IG51bGw7XG5cbiAgICB0aGlzLl8kaXRlbVNoYXBlTWFwLmNsZWFyKCk7XG4gICAgdGhpcy5fJGl0ZW1EYXRhTWFwLmNsZWFyKCk7XG4gICAgdGhpcy5fJGl0ZW1Db21tb25TaGFwZU1hcC5jbGVhcigpO1xuXG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvd3MgdG8gb3ZlcnJpZGUgZGVmYXVsdCB0aGUgYFRpbWVDb250ZXh0QmVoYXZpb3JgIHVzZWQgdG8gZWRpdCB0aGUgbGF5ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjdG9yXG4gICAqL1xuICBzdGF0aWMgY29uZmlndXJlVGltZUNvbnRleHRCZWhhdmlvcihjdG9yKSB7XG4gICAgdGltZUNvbnRleHRCZWhhdmlvckN0b3IgPSBjdG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYExheWVyVGltZUNvbnRleHRgJ3MgYHN0YXJ0YCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBzdGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5zdGFydDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGBMYXllclRpbWVDb250ZXh0YCdzIGBzdGFydGAgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgc3RhcnQodmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnN0YXJ0ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgb2Zmc2V0YCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQub2Zmc2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYExheWVyVGltZUNvbnRleHRgJ3MgYG9mZnNldGAgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgb2Zmc2V0KHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC5vZmZzZXQgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGBMYXllclRpbWVDb250ZXh0YCdzIGBkdXJhdGlvbmAgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgZHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQuZHVyYXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBgTGF5ZXJUaW1lQ29udGV4dGAncyBgZHVyYXRpb25gIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IGR1cmF0aW9uKHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYExheWVyVGltZUNvbnRleHRgJ3MgYHN0cmV0Y2hSYXRpb2AgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgc3RyZXRjaFJhdGlvKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGBMYXllclRpbWVDb250ZXh0YCdzIGBzdHJldGNoUmF0aW9gIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IHN0cmV0Y2hSYXRpbyh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQuc3RyZXRjaFJhdGlvID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBkb21haW4gYm91bmRhcmllcyBvZiB0aGUgZGF0YSBmb3IgdGhlIHkgYXhpcy5cbiAgICpcbiAgICogQHR5cGUge0FycmF5fVxuICAgKi9cbiAgc2V0IHlEb21haW4oZG9tYWluKSB7XG4gICAgdGhpcy5wYXJhbXMueURvbWFpbiA9IGRvbWFpbjtcbiAgICB0aGlzLl92YWx1ZVRvUGl4ZWwuZG9tYWluKGRvbWFpbik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZG9tYWluIGJvdW5kYXJpZXMgb2YgdGhlIGRhdGEgZm9yIHRoZSB5IGF4aXMuXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICovXG4gIGdldCB5RG9tYWluKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy55RG9tYWluO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG9wYWNpdHkgb2YgdGhlIHdob2xlIGxheWVyLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IG9wYWNpdHkodmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcy5vcGFjaXR5ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgb3BhY2l0eSBvZiB0aGUgd2hvbGUgbGF5ZXIuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgb3BhY2l0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMub3BhY2l0eTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0cmFuc2ZlcnQgZnVuY3Rpb24gdXNlZCB0byBkaXNwbGF5IHRoZSBkYXRhIGluIHRoZSB4IGF4aXMuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgdGltZVRvUGl4ZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdHJhbnNmZXJ0IGZ1bmN0aW9uIHVzZWQgdG8gZGlzcGxheSB0aGUgZGF0YSBpbiB0aGUgeSBheGlzLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHZhbHVlVG9QaXhlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVUb1BpeGVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBhbGwgdGhlIGRpc3BsYXllZCBpdGVtcy5cbiAgICpcbiAgICogQHR5cGUge0FycmF5PEVsZW1lbnQ+fVxuICAgKi9cbiAgZ2V0IGl0ZW1zKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuXyRpdGVtRGF0YU1hcC5rZXlzKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRhdGEgYXNzb2NpYXRlZCB0byB0aGUgbGF5ZXIuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3RbXX1cbiAgICovXG4gIGdldCBkYXRhKCkgeyByZXR1cm4gdGhpcy5fZGF0YTsgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgbGF5ZXIuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R8T2JqZWN0W119XG4gICAqL1xuICBzZXQgZGF0YShkYXRhKSB7XG4gICAgc3dpdGNoICh0aGlzLmRhdGFUeXBlKSB7XG4gICAgICBjYXNlICdlbnRpdHknOlxuICAgICAgICBpZiAodGhpcy5fZGF0YSkgeyAgLy8gaWYgZGF0YSBhbHJlYWR5IGV4aXN0cywgcmV1c2UgdGhlIHJlZmVyZW5jZVxuICAgICAgICAgIHRoaXMuX2RhdGFbMF0gPSBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2RhdGEgPSBbZGF0YV07XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2xsZWN0aW9uJzpcbiAgICAgICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEluaXRpYWxpemF0aW9uXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIFJlbmRlcnMgdGhlIERPTSBpbiBtZW1vcnkgb24gbGF5ZXIgY3JlYXRpb24gdG8gYmUgYWJsZSB0byB1c2UgaXQgYmVmb3JlXG4gICAqIHRoZSBsYXllciBpcyBhY3R1YWxseSBpbnNlcnRlZCBpbiB0aGUgRE9NLlxuICAgKi9cbiAgX3JlbmRlckNvbnRhaW5lcigpIHtcbiAgICAvLyB3cmFwcGVyIGdyb3VwIGZvciBgc3RhcnQsIHRvcCBhbmQgY29udGV4dCBmbGlwIG1hdHJpeFxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQoJ2xheWVyJyk7XG4gICAgaWYgKHRoaXMucGFyYW1zLmNsYXNzTmFtZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZCh0aGlzLnBhcmFtcy5jbGFzc05hbWUpO1xuICAgIH1cbiAgICAvLyBjbGlwIHRoZSBjb250ZXh0IHdpdGggYSBgc3ZnYCBlbGVtZW50XG4gICAgdGhpcy4kYm91bmRpbmdCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdzdmcnKTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5jbGFzc0xpc3QuYWRkKCdib3VuZGluZy1ib3gnKTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5zdHlsZS5vdmVyZmxvdyA9IHRoaXMucGFyYW1zLm92ZXJmbG93O1xuICAgIC8vIGdyb3VwIHRvIGFwcGx5IG9mZnNldFxuICAgIHRoaXMuJG9mZnNldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLiRvZmZzZXQuY2xhc3NMaXN0LmFkZCgnb2Zmc2V0JywgJ2l0ZW1zJyk7XG4gICAgLy8gbGF5ZXIgYmFja2dyb3VuZFxuICAgIHRoaXMuJGJhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsICcxMDAlJyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kJyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zdHlsZS5maWxsT3BhY2l0eSA9IDA7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuICAgIC8vIGNvbnRleHQgaW50ZXJhY3Rpb25zXG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuJGludGVyYWN0aW9ucy5jbGFzc0xpc3QuYWRkKCdpbnRlcmFjdGlvbnMnKTtcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAvLyBATk9URTogd29ya3MgYnV0IGtpbmcgb2YgdWdseS4uLiBzaG91bGQgYmUgY2xlYW5lZFxuICAgIHRoaXMuY29udGV4dFNoYXBlID0gbmV3IFNlZ21lbnQoKTtcbiAgICB0aGlzLmNvbnRleHRTaGFwZS5pbnN0YWxsKHtcbiAgICAgIG9wYWNpdHk6ICgpID0+IDAuMSxcbiAgICAgIGNvbG9yICA6ICgpID0+ICcjNzg3ODc4JyxcbiAgICAgIHdpZHRoICA6ICgpID0+IHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24sXG4gICAgICBoZWlnaHQgOiAoKSA9PiB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbC5kb21haW4oKVsxXSxcbiAgICAgIHkgICAgICA6ICgpID0+IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmRvbWFpbigpWzBdXG4gICAgfSk7XG5cbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMuYXBwZW5kQ2hpbGQodGhpcy5jb250ZXh0U2hhcGUucmVuZGVyKCkpO1xuICAgIC8vIGNyZWF0ZSB0aGUgRE9NIHRyZWVcbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRib3VuZGluZ0JveCk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guYXBwZW5kQ2hpbGQodGhpcy4kb2Zmc2V0KTtcbiAgICB0aGlzLiRvZmZzZXQuYXBwZW5kQ2hpbGQodGhpcy4kYmFja2dyb3VuZCk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guYXBwZW5kQ2hpbGQodGhpcy4kaW50ZXJhY3Rpb25zKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbXBvbmVudCBDb25maWd1cmF0aW9uXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGNvbnRleHQgb2YgdGhlIGxheWVyLCB0aHVzIGRlZmluaW5nIGl0cyBgc3RhcnRgLCBgZHVyYXRpb25gLFxuICAgKiBgb2Zmc2V0YCBhbmQgYHN0cmV0Y2hSYXRpb2AuXG4gICAqXG4gICAqIEBwYXJhbSB7VGltZUNvbnRleHR9IHRpbWVDb250ZXh0IC0gVGhlIHRpbWVDb250ZXh0IGluIHdoaWNoIHRoZSBsYXllciBpcyBkaXNwbGF5ZWQuXG4gICAqL1xuICBzZXRUaW1lQ29udGV4dCh0aW1lQ29udGV4dCkge1xuICAgIHRoaXMudGltZUNvbnRleHQgPSB0aW1lQ29udGV4dDtcbiAgICAvLyBjcmVhdGUgYSBtaXhpbiB0byBwYXNzIHRvIHRoZSBzaGFwZXNcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0ID0ge307XG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgc2hhcGUgYW5kIGl0cyBjb25maWd1cmF0aW9uIHRvIHVzZSBpbiBvcmRlciB0byByZW5kZXIgdGhlIGRhdGEuXG4gICAqXG4gICAqIEBwYXJhbSB7QmFzZVNoYXBlfSBjdG9yIC0gVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBzaGFwZSB0byBiZSB1c2VkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2FjY2Vzc29ycz17fV0gLSBEZWZpbmVzIGhvdyB0aGUgc2hhcGUgc2hvdWxkIGFkYXB0IHRvIGEgcGFydGljdWxhciBkYXRhIHN0cnV0dXJlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIC0gR2xvYmFsIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBzaGFwZXMsIGlzIHNwZWNpZmljIHRvIGVhY2ggYFNoYXBlYC5cbiAgICovXG4gIGNvbmZpZ3VyZVNoYXBlKGN0b3IsIGFjY2Vzc29ycyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb24gPSB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9O1xuICB9XG5cbiAgLyoqXG4gICAqIE9wdGlvbm5hbHkgcmVnaXN0ZXIgYSBzaGFwZSB0byBiZSB1c2VkIGFjY3JvcyB0aGUgZW50aXJlIGNvbGxlY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7QmFzZVNoYXBlfSBjdG9yIC0gVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBzaGFwZSB0byBiZSB1c2VkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2FjY2Vzc29ycz17fV0gLSBEZWZpbmVzIGhvdyB0aGUgc2hhcGUgc2hvdWxkIGFkYXB0IHRvIGEgcGFydGljdWxhciBkYXRhIHN0cnV0dXJlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIC0gR2xvYmFsIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBzaGFwZXMsIGlzIHNwZWNpZmljIHRvIGVhY2ggYFNoYXBlYC5cbiAgICovXG4gIGNvbmZpZ3VyZUNvbW1vblNoYXBlKGN0b3IsIGFjY2Vzc29ycyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb24gPSB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoZSBiZWhhdmlvciB0byB1c2Ugd2hlbiBpbnRlcmFjdGluZyB3aXRoIGEgc2hhcGUuXG4gICAqXG4gICAqIEBwYXJhbSB7QmFzZUJlaGF2aW9yfSBiZWhhdmlvclxuICAgKi9cbiAgc2V0QmVoYXZpb3IoYmVoYXZpb3IpIHtcbiAgICBiZWhhdmlvci5pbml0aWFsaXplKHRoaXMpO1xuICAgIHRoaXMuX2JlaGF2aW9yID0gYmVoYXZpb3I7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgdmFsdWVzIHN0b3JlZCBpbnQgdGhlIGBfcmVuZGVyaW5nQ29udGV4dGAgcGFzc2VkICB0byBzaGFwZXNcbiAgICogZm9yIHJlbmRlcmluZyBhbmQgdXBkYXRpbmcuXG4gICAqL1xuICBfdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpIHtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbDtcbiAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCA9IHRoaXMuX3ZhbHVlVG9QaXhlbDtcblxuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQuaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQud2lkdGggID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uKTtcbiAgICAvLyBmb3IgZm9yZWlnbiBvYmplY3QgaXNzdWUgaW4gY2hyb21lXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5vZmZzZXRYID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCk7XG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5zdGFydFggPSB0aGlzLnRpbWVDb250ZXh0LnBhcmVudC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0LnN0YXJ0KTtcblxuICAgIC8vIEB0b2RvIHJlcGxhY2Ugd2l0aCBgbWluWGAgYW5kIGBtYXhYYCByZXByZXNlbnRpbmcgdGhlIHZpc2libGUgcGl4ZWxzIGluIHdoaWNoXG4gICAgLy8gdGhlIHNoYXBlcyBzaG91bGQgYmUgcmVuZGVyZWQsIGNvdWxkIGFsbG93IHRvIG5vdCB1cGRhdGUgdGhlIERPTSBvZiBzaGFwZXNcbiAgICAvLyB3aG8gYXJlIG5vdCBpbiB0aGlzIGFyZWEuXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC50cmFja09mZnNldFggPSB0aGlzLnRpbWVDb250ZXh0LnBhcmVudC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0LnBhcmVudC5vZmZzZXQpO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoID0gdGhpcy50aW1lQ29udGV4dC5wYXJlbnQudmlzaWJsZVdpZHRoO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQmVoYXZpb3IgQWNjZXNzb3JzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGl0ZW1zIG1hcmtlZCBhcyBzZWxlY3RlZC5cbiAgICpcbiAgICogQHR5cGUge0FycmF5PEVsZW1lbnQ+fVxuICAgKi9cbiAgZ2V0IHNlbGVjdGVkSXRlbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2JlaGF2aW9yID8gdGhpcy5fYmVoYXZpb3Iuc2VsZWN0ZWRJdGVtcyA6IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmsgaXRlbShzKSBhcyBzZWxlY3RlZC5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fEVsZW1lbnRbXX0gJGl0ZW1zXG4gICAqL1xuICBzZWxlY3QoLi4uJGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHsgJGl0ZW1zID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmtleXMoKTsgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KCRpdGVtc1swXSkpIHsgJGl0ZW1zID0gJGl0ZW1zWzBdOyB9XG5cbiAgICBmb3IgKGxldCAkaXRlbSBvZiAkaXRlbXMpIHtcbiAgICAgIGNvbnN0IGRhdHVtID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmdldCgkaXRlbSk7XG4gICAgICB0aGlzLl9iZWhhdmlvci5zZWxlY3QoJGl0ZW0sIGRhdHVtKTtcbiAgICAgIHRoaXMuX3RvRnJvbnQoJGl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGl0ZW0ocykgZnJvbSBzZWxlY3RlZCBpdGVtcy5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fEVsZW1lbnRbXX0gJGl0ZW1zXG4gICAqL1xuICB1bnNlbGVjdCguLi4kaXRlbXMpIHtcbiAgICBpZiAoIXRoaXMuX2JlaGF2aW9yKSB7IHJldHVybjsgfVxuICAgIGlmICghJGl0ZW1zLmxlbmd0aCkgeyAkaXRlbXMgPSB0aGlzLl8kaXRlbURhdGFNYXAua2V5cygpOyB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoJGl0ZW1zWzBdKSkgeyAkaXRlbXMgPSAkaXRlbXNbMF07IH1cblxuICAgIGZvciAobGV0ICRpdGVtIG9mICRpdGVtcykge1xuICAgICAgY29uc3QgZGF0dW0gPSB0aGlzLl8kaXRlbURhdGFNYXAuZ2V0KCRpdGVtKTtcbiAgICAgIHRoaXMuX2JlaGF2aW9yLnVuc2VsZWN0KCRpdGVtLCBkYXR1bSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSBpdGVtKHMpIHNlbGVjdGlvbiBzdGF0ZSBhY2NvcmRpbmcgdG8gdGhlaXIgY3VycmVudCBzdGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fEVsZW1lbnRbXX0gJGl0ZW1zXG4gICAqL1xuICB0b2dnbGVTZWxlY3Rpb24oLi4uJGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHsgJGl0ZW1zID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmtleXMoKTsgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KCRpdGVtc1swXSkpIHsgJGl0ZW1zID0gJGl0ZW1zWzBdOyB9XG5cbiAgICBmb3IgKGxldCAkaXRlbSBvZiAkaXRlbXMpIHtcbiAgICAgIGNvbnN0IGRhdHVtID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmdldCgkaXRlbSk7XG4gICAgICB0aGlzLl9iZWhhdmlvci50b2dnbGVTZWxlY3Rpb24oJGl0ZW0sIGRhdHVtKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRWRpdCBpdGVtKHMpIGFjY29yZGluZyB0byB0aGUgYGVkaXRgIGRlZmluZWQgaW4gdGhlIHJlZ2lzdGVyZWQgYEJlaGF2aW9yYC5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fEVsZW1lbnRbXX0gJGl0ZW1zIC0gVGhlIGl0ZW0ocykgdG8gZWRpdC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR4IC0gVGhlIG1vZGlmaWNhdGlvbiB0byBhcHBseSBpbiB0aGUgeCBheGlzIChpbiBwaXhlbHMpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHkgLSBUaGUgbW9kaWZpY2F0aW9uIHRvIGFwcGx5IGluIHRoZSB5IGF4aXMgKGluIHBpeGVscykuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJHRhcmdldCAtIFRoZSB0YXJnZXQgb2YgdGhlIGludGVyYWN0aW9uIChmb3IgZXhhbXBsZSwgbGVmdFxuICAgKiAgICBoYW5kbGVyIERPTSBlbGVtZW50IGluIGEgc2VnbWVudCkuXG4gICAqL1xuICBlZGl0KCRpdGVtcywgZHgsIGR5LCAkdGFyZ2V0KSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICAkaXRlbXMgPSAhQXJyYXkuaXNBcnJheSgkaXRlbXMpID8gWyRpdGVtc10gOiAkaXRlbXM7XG5cbiAgICBmb3IgKGxldCAkaXRlbSBvZiAkaXRlbXMpIHtcbiAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fJGl0ZW1TaGFwZU1hcC5nZXQoJGl0ZW0pO1xuICAgICAgY29uc3QgZGF0dW0gPSB0aGlzLl8kaXRlbURhdGFNYXAuZ2V0KCRpdGVtKTtcblxuICAgICAgdGhpcy5fYmVoYXZpb3IuZWRpdCh0aGlzLl9yZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgJHRhcmdldCk7XG4gICAgICB0aGlzLmVtaXQoJ2VkaXQnLCBzaGFwZSwgZGF0dW0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGlmIHRoZSBgTGF5ZXJgLCBhbmQgdGh1cyB0aGUgYExheWVyVGltZUNvbnRleHRgIGlzIGVkaXRhYmxlIG9yIG5vdC5cbiAgICpcbiAgICogQHBhcmFtcyB7Qm9vbGVhbn0gW2Jvb2w9dHJ1ZV1cbiAgICovXG4gIHNldENvbnRleHRFZGl0YWJsZShib29sID0gdHJ1ZSkge1xuICAgIGNvbnN0IGRpc3BsYXkgPSBib29sID8gJ2Jsb2NrJyA6ICdub25lJztcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXk7XG4gICAgdGhpcy5faXNDb250ZXh0RWRpdGFibGUgPSBib29sO1xuICB9XG5cbiAgLyoqXG4gICAqIEVkaXQgdGhlIGxheWVyIGFuZCB0aHVzIGl0cyByZWxhdGVkIGBMYXllclRpbWVDb250ZXh0YCBhdHRyaWJ1dGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHggLSBUaGUgbW9kaWZpY2F0aW9uIHRvIGFwcGx5IGluIHRoZSB4IGF4aXMgKGluIHBpeGVscykuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkeSAtIFRoZSBtb2RpZmljYXRpb24gdG8gYXBwbHkgaW4gdGhlIHkgYXhpcyAoaW4gcGl4ZWxzKS5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkdGFyZ2V0IC0gVGhlIHRhcmdldCBvZiB0aGUgZXZlbnQgb2YgdGhlIGludGVyYWN0aW9uLlxuICAgKi9cbiAgZWRpdENvbnRleHQoZHgsIGR5LCAkdGFyZ2V0KSB7XG4gICAgdGltZUNvbnRleHRCZWhhdmlvci5lZGl0KHRoaXMsIGR4LCBkeSwgJHRhcmdldCk7XG4gIH1cblxuICAvKipcbiAgICogU3RyZXRjaCB0aGUgbGF5ZXIgYW5kIHRodXMgaXRzIHJlbGF0ZWQgYExheWVyVGltZUNvbnRleHRgIGF0dHJpYnV0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkeCAtIFRoZSBtb2RpZmljYXRpb24gdG8gYXBwbHkgaW4gdGhlIHggYXhpcyAoaW4gcGl4ZWxzKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR5IC0gVGhlIG1vZGlmaWNhdGlvbiB0byBhcHBseSBpbiB0aGUgeSBheGlzIChpbiBwaXhlbHMpLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICR0YXJnZXQgLSBUaGUgdGFyZ2V0IG9mIHRoZSBldmVudCBvZiB0aGUgaW50ZXJhY3Rpb24uXG4gICAqL1xuICBzdHJldGNoQ29udGV4dChkeCwgZHksICR0YXJnZXQpIHtcbiAgICB0aW1lQ29udGV4dEJlaGF2aW9yLnN0cmV0Y2godGhpcywgZHgsIGR5LCAkdGFyZ2V0KTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEhlbHBlcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBpdGVtIGZyb20gYSBET00gZWxlbWVudCByZWxhdGVkIHRvIHRoZSBzaGFwZSwgbnVsbCBvdGhlcndpc2UuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsIC0gdGhlIGVsZW1lbnQgdG8gYmUgdGVzdGVkXG4gICAqIEByZXR1cm4ge0VsZW1lbnR8bnVsbH1cbiAgICovXG4gIGdldEl0ZW1Gcm9tRE9NRWxlbWVudCgkZWwpIHtcbiAgICBsZXQgJGl0ZW07XG5cbiAgICBkbyB7XG4gICAgICBpZiAoJGVsLmNsYXNzTGlzdCAmJiAkZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdpdGVtJykpIHtcbiAgICAgICAgJGl0ZW0gPSAkZWw7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICAkZWwgPSAkZWwucGFyZW50Tm9kZTtcbiAgICB9IHdoaWxlICgkZWwgIT09IG51bGwpO1xuXG4gICAgcmV0dXJuIHRoaXMuaGFzSXRlbSgkaXRlbSkgPyAkaXRlbSA6wqBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRhdHVtIGFzc29jaWF0ZWQgdG8gYSBzcGVjaWZpYyBpdGVtLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRpdGVtXG4gICAqIEByZXR1cm4ge09iamVjdHxBcnJheXxudWxsfVxuICAgKi9cbiAgZ2V0RGF0dW1Gcm9tSXRlbSgkaXRlbSkge1xuICAgIGNvbnN0IGRhdHVtID0gdGhpcy5fJGl0ZW1EYXRhTWFwLmdldCgkaXRlbSk7XG4gICAgcmV0dXJuIGRhdHVtID8gZGF0dW0gOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRhdHVtIGFzc29jaWF0ZWQgdG8gYSBzcGVjaWZpYyBpdGVtIGZyb20gYW55IERPTSBlbGVtZW50XG4gICAqIGNvbXBvc2luZyB0aGUgc2hhcGUuIEJhc2ljYWxseSBhIHNob3J0Y3V0IGZvciBgZ2V0SXRlbUZyb21ET01FbGVtZW50YCBhbmRcbiAgICogYGdldERhdHVtRnJvbUl0ZW1gIG1ldGhvZHMuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsXG4gICAqIEByZXR1cm4ge09iamVjdHxBcnJheXxudWxsfVxuICAgKi9cbiAgZ2V0RGF0dW1Gcm9tRE9NRWxlbWVudCgkZWwpIHtcbiAgICB2YXIgJGl0ZW0gPSB0aGlzLmdldEl0ZW1Gcm9tRE9NRWxlbWVudCgkZWwpO1xuICAgIGlmICgkaXRlbSA9PT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiB0aGlzLmdldERhdHVtRnJvbUl0ZW0oJGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRlc3RzIGlmIHRoZSBnaXZlbiBET00gZWxlbWVudCBpcyBhbiBpdGVtIG9mIHRoZSBsYXllci5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkaXRlbSAtIFRoZSBpdGVtIHRvIGJlIHRlc3RlZC5cbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIGhhc0l0ZW0oJGl0ZW0pIHtcbiAgICByZXR1cm4gdGhpcy5fJGl0ZW1EYXRhTWFwLmhhcygkaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBpZiBhIGdpdmVuIGVsZW1lbnQgYmVsb25ncyB0byB0aGUgbGF5ZXIuIElzIG1vcmUgZ2VuZXJhbCB0aGFuXG4gICAqIGBoYXNJdGVtYCwgY2FuIG1vc3RseSB1c2VkIHRvIGNoZWNrIGludGVyYWN0aW9ucyBlbGVtZW50cy5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkZWwgLSBUaGUgRE9NIGVsZW1lbnQgdG8gYmUgdGVzdGVkLlxuICAgKiBAcmV0dXJuIHtib29sfVxuICAgKi9cbiAgaGFzRWxlbWVudCgkZWwpIHtcbiAgICBkbyB7XG4gICAgICBpZiAoJGVsID09PSB0aGlzLiRlbCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgJGVsID0gJGVsLnBhcmVudE5vZGU7XG4gICAgfSB3aGlsZSAoJGVsICE9PSBudWxsKTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhbGwgdGhlIGl0ZW1zIGluIGEgZ2l2ZW4gYXJlYSBhcyBkZWZpbmVkIGluIHRoZSByZWdpc3RlcmVkIGBTaGFwZX5pbkFyZWFgIG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGFyZWEgLSBUaGUgYXJlYSBpbiB3aGljaCB0byBmaW5kIHRoZSBlbGVtZW50c1xuICAgKiBAcGFyYW0ge051bWJlcn0gYXJlYS50b3BcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFyZWEubGVmdFxuICAgKiBAcGFyYW0ge051bWJlcn0gYXJlYS53aWR0aFxuICAgKiBAcGFyYW0ge051bWJlcn0gYXJlYS5oZWlnaHRcbiAgICogQHJldHVybiB7QXJyYXl9IC0gbGlzdCBvZiB0aGUgaXRlbXMgcHJlc2VudHMgaW4gdGhlIGFyZWFcbiAgICovXG4gIGdldEl0ZW1zSW5BcmVhKGFyZWEpIHtcbiAgICBjb25zdCBzdGFydCAgICA9IHRoaXMudGltZUNvbnRleHQucGFyZW50LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQuc3RhcnQpO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uKTtcbiAgICBjb25zdCBvZmZzZXQgICA9IHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5vZmZzZXQpO1xuICAgIGNvbnN0IHRvcCAgICAgID0gdGhpcy5wYXJhbXMudG9wO1xuICAgIC8vIGJlIGF3YXJlIGFmIGNvbnRleHQncyB0cmFuc2xhdGlvbnMgLSBjb25zdHJhaW4gaW4gd29ya2luZyB2aWV3XG4gICAgbGV0IHgxID0gTWF0aC5tYXgoYXJlYS5sZWZ0LCBzdGFydCk7XG4gICAgbGV0IHgyID0gTWF0aC5taW4oYXJlYS5sZWZ0ICsgYXJlYS53aWR0aCwgc3RhcnQgKyBkdXJhdGlvbik7XG4gICAgeDEgLT0gKHN0YXJ0ICsgb2Zmc2V0KTtcbiAgICB4MiAtPSAoc3RhcnQgKyBvZmZzZXQpO1xuICAgIC8vIGtlZXAgY29uc2lzdGVudCB3aXRoIGNvbnRleHQgeSBjb29yZGluYXRlcyBzeXN0ZW1cbiAgICBsZXQgeTEgPSB0aGlzLnBhcmFtcy5oZWlnaHQgLSAoYXJlYS50b3AgKyBhcmVhLmhlaWdodCk7XG4gICAgbGV0IHkyID0gdGhpcy5wYXJhbXMuaGVpZ2h0IC0gYXJlYS50b3A7XG5cbiAgICB5MSArPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgeTIgKz0gdGhpcy5wYXJhbXMudG9wO1xuXG4gICAgY29uc3QgJGZpbHRlcmVkSXRlbXMgPSBbXTtcblxuICAgIGZvciAobGV0IFskaXRlbSwgZGF0dW1dIG9mIHRoaXMuXyRpdGVtRGF0YU1hcC5lbnRyaWVzKCkpIHtcbiAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fJGl0ZW1TaGFwZU1hcC5nZXQoJGl0ZW0pO1xuICAgICAgY29uc3QgaW5BcmVhID0gc2hhcGUuaW5BcmVhKHRoaXMuX3JlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mik7XG5cbiAgICAgIGlmIChpbkFyZWEpIHsgJGZpbHRlcmVkSXRlbXMucHVzaCgkaXRlbSk7IH1cbiAgICB9XG5cbiAgICByZXR1cm4gJGZpbHRlcmVkSXRlbXM7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZW5kZXJpbmcgLyBEaXNwbGF5IG1ldGhvZHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogTW92ZXMgYW4gaXRlbSB0byB0aGUgZW5kIG9mIHRoZSBsYXllciB0byBkaXNwbGF5IGl0IGZyb250IG9mIGl0c1xuICAgKiBzaWJsaW5ncyAoc3ZnIHotaW5kZXguLi4pLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRpdGVtIC0gVGhlIGl0ZW0gdG8gYmUgbW92ZWQuXG4gICAqL1xuICBfdG9Gcm9udCgkaXRlbSkge1xuICAgIHRoaXMuJG9mZnNldC5hcHBlbmRDaGlsZCgkaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIHRoZSBET00gc3RydWN0dXJlIG9mIHRoZSBzaGFwZXMgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiBkYXRhLiBJbnNwaXJlZFxuICAgKiBmcm9tIHRoZSBgZW50ZXJgIGFuZCBgZXhpdGAgZDMuanMgcGFyYWRpZ20sIHRoaXMgbWV0aG9kIHNob3VsZCBiZSBjYWxsZWRcbiAgICogZWFjaCB0aW1lIGEgZGF0dW0gaXMgYWRkZWQgb3IgcmVtb3ZlZCBmcm9tIHRoZSBkYXRhLiBXaGlsZSB0aGUgRE9NIGlzXG4gICAqIGNyZWF0ZWQgdGhlIGB1cGRhdGVgIG1ldGhvZCBtdXN0IGJlIGNhbGxlZCBpbiBvcmRlciB0byB1cGRhdGUgdGhlIHNoYXBlc1xuICAgKiBhdHRyaWJ1dGVzIGFuZCB0aHVzIHBsYWNlIHRoZW0gd2hlcmUgdGhleSBzaG91bGQuXG4gICAqL1xuICByZW5kZXIoKSB7XG4gICAgLy8gcmVuZGVyIGBjb21tb25TaGFwZWAgb25seSBvbmNlXG4gICAgaWYgKFxuICAgICAgdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uICE9PSBudWxsICYmXG4gICAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwLnNpemUgPT09IDBcbiAgICApIHtcbiAgICAgIGNvbnN0IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH0gPSB0aGlzLl9jb21tb25TaGFwZUNvbmZpZ3VyYXRpb247XG4gICAgICBjb25zdCAkZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgICBjb25zdCBzaGFwZSA9IG5ldyBjdG9yKG9wdGlvbnMpO1xuXG4gICAgICBzaGFwZS5pbnN0YWxsKGFjY2Vzc29ycyk7XG4gICAgICAkZ3JvdXAuYXBwZW5kQ2hpbGQoc2hhcGUucmVuZGVyKCkpO1xuICAgICAgJGdyb3VwLmNsYXNzTGlzdC5hZGQoJ2l0ZW0nLCAnY29tbW9uJywgc2hhcGUuZ2V0Q2xhc3NOYW1lKCkpO1xuXG4gICAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwLnNldCgkZ3JvdXAsIHNoYXBlKTtcbiAgICAgIHRoaXMuJG9mZnNldC5hcHBlbmRDaGlsZCgkZ3JvdXApO1xuICAgIH1cblxuICAgIC8vIGFwcGVuZCBlbGVtZW50cyBhbGwgYXQgb25jZVxuICAgIGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuXyRpdGVtRGF0YU1hcC52YWx1ZXMoKTsgLy8gaXRlcmF0b3JcblxuICAgIC8vIGVudGVyXG4gICAgdGhpcy5kYXRhLmZvckVhY2goKGRhdHVtKSA9PiB7XG4gICAgICBmb3IgKGxldCB2YWx1ZSBvZiB2YWx1ZXMpIHsgaWYgKHZhbHVlID09PSBkYXR1bSkgeyByZXR1cm47IH0gfVxuXG4gICAgICBjb25zdCB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9ID0gdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uO1xuICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgY3RvcihvcHRpb25zKTtcbiAgICAgIHNoYXBlLmluc3RhbGwoYWNjZXNzb3JzKTtcblxuICAgICAgY29uc3QgJGVsID0gc2hhcGUucmVuZGVyKHRoaXMuX3JlbmRlcmluZ0NvbnRleHQpO1xuICAgICAgJGVsLmNsYXNzTGlzdC5hZGQoJ2l0ZW0nLCBzaGFwZS5nZXRDbGFzc05hbWUoKSk7XG5cbiAgICAgIHRoaXMuXyRpdGVtU2hhcGVNYXAuc2V0KCRlbCwgc2hhcGUpO1xuICAgICAgdGhpcy5fJGl0ZW1EYXRhTWFwLnNldCgkZWwsIGRhdHVtKTtcblxuICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoJGVsKTtcbiAgICB9KTtcblxuICAgIHRoaXMuJG9mZnNldC5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG5cbiAgICAvLyByZW1vdmVcbiAgICBmb3IgKGxldCBbJGl0ZW0sIGRhdHVtXSBvZiB0aGlzLl8kaXRlbURhdGFNYXAuZW50cmllcygpKSB7XG4gICAgICBpZiAodGhpcy5kYXRhLmluZGV4T2YoZGF0dW0pICE9PSAtMSkgeyBjb250aW51ZTsgfVxuXG4gICAgICBjb25zdCBzaGFwZSA9IHRoaXMuXyRpdGVtU2hhcGVNYXAuZ2V0KCRpdGVtKTtcblxuICAgICAgdGhpcy4kb2Zmc2V0LnJlbW92ZUNoaWxkKCRpdGVtKTtcbiAgICAgIHNoYXBlLmRlc3Ryb3koKTtcbiAgICAgIC8vIGEgcmVtb3ZlZCBpdGVtIGNhbm5vdCBiZSBzZWxlY3RlZFxuICAgICAgaWYgKHRoaXMuX2JlaGF2aW9yKSB7XG4gICAgICAgIHRoaXMuX2JlaGF2aW9yLnVuc2VsZWN0KCRpdGVtLCBkYXR1bSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuXyRpdGVtRGF0YU1hcC5kZWxldGUoJGl0ZW0pO1xuICAgICAgdGhpcy5fJGl0ZW1TaGFwZU1hcC5kZWxldGUoJGl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBjb250YWluZXIgb2YgdGhlIGxheWVyIGFuZCB0aGUgYXR0cmlidXRlcyBvZiB0aGUgZXhpc3Rpbmcgc2hhcGVzLlxuICAgKi9cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMudXBkYXRlQ29udGFpbmVyKCk7XG4gICAgdGhpcy51cGRhdGVTaGFwZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBjb250YWluZXIgb2YgdGhlIGxheWVyLlxuICAgKi9cbiAgdXBkYXRlQ29udGFpbmVyKCkge1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcblxuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gdGhpcy50aW1lQ29udGV4dDtcbiAgICBjb25zdCB3aWR0aCAgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aW1lQ29udGV4dC5kdXJhdGlvbik7XG4gICAgLy8geCBpcyByZWxhdGl2ZSB0byB0aW1lbGluZSdzIHRpbWVDb250ZXh0XG4gICAgY29uc3QgeCAgICAgID0gdGltZUNvbnRleHQucGFyZW50LnRpbWVUb1BpeGVsKHRpbWVDb250ZXh0LnN0YXJ0KTtcbiAgICBjb25zdCBvZmZzZXQgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aW1lQ29udGV4dC5vZmZzZXQpO1xuICAgIGNvbnN0IHRvcCAgICA9IHRoaXMucGFyYW1zLnRvcDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgLy8gbWF0cml4IHRvIGludmVydCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICBjb25zdCB0cmFuc2xhdGVNYXRyaXggPSBgbWF0cml4KDEsIDAsIDAsIC0xLCAke3h9LCAke3RvcCArIGhlaWdodH0pYDtcblxuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGVNYXRyaXgpO1xuXG4gICAgdGhpcy4kYm91bmRpbmdCb3guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgIHRoaXMuJGJvdW5kaW5nQm94LnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgIHRoaXMuJGJvdW5kaW5nQm94LnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuXG4gICAgdGhpcy4kb2Zmc2V0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7b2Zmc2V0fSwgMClgKTtcbiAgICAvLyBtYWludGFpbiBjb250ZXh0IHNoYXBlXG4gICAgdGhpcy5jb250ZXh0U2hhcGUudXBkYXRlKHRoaXMuX3JlbmRlcmluZ0NvbnRleHQsIHRoaXMudGltZUNvbnRleHQsIDApO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGF0dHJpYnV0ZXMgb2YgYWxsIHRoZSBgU2hhcGVgIGluc3RhbmNlcyByZW5kZXJlZCBpbnRvIHRoZSBsYXllci5cbiAgICpcbiAgICogQHRvZG8gLSBhbGxvdyB0byBmaWx0ZXIgd2hpY2ggc2hhcGUocykgc2hvdWxkIGJlIHVwZGF0ZWQuXG4gICAqL1xuICB1cGRhdGVTaGFwZXMoKSB7XG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyaW5nQ29udGV4dCgpO1xuICAgIC8vIHVwZGF0ZSBjb21tb24gc2hhcGVzXG4gICAgdGhpcy5fJGl0ZW1Db21tb25TaGFwZU1hcC5mb3JFYWNoKChzaGFwZSwgJGl0ZW0pID0+IHtcbiAgICAgIHNoYXBlLnVwZGF0ZSh0aGlzLl9yZW5kZXJpbmdDb250ZXh0LCB0aGlzLmRhdGEpO1xuICAgIH0pO1xuXG4gICAgZm9yIChsZXQgWyRpdGVtLCBkYXR1bV0gb2YgdGhpcy5fJGl0ZW1EYXRhTWFwLmVudHJpZXMoKSkge1xuICAgICAgY29uc3Qgc2hhcGUgPSB0aGlzLl8kaXRlbVNoYXBlTWFwLmdldCgkaXRlbSk7XG4gICAgICBzaGFwZS51cGRhdGUodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgZGF0dW0pO1xuICAgIH1cbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcbiIsImltcG9ydCBzY2FsZXMgZnJvbSAnLi4vdXRpbHMvc2NhbGVzJztcblxuXG4vKipcbiAqIERlZmluZXMgYW5kIG1haW50YWlucyBnbG9iYWwgYXNwZWN0cyBvZiB0aGUgdmlzdWFsaXphdGlvbiBjb25jZXJuaW5nIHRoZVxuICogcmVsYXRpb25zIGJldHdlZW4gdGltZSBhbmQgcGl4ZWxzLlxuICpcbiAqIFRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAgaW5zdGFuY2UgKHVuaXF1ZSBhY3Jvc3MgYSB2aXN1YWxpemF0aW9uKSBrZWVwcyB0aGVcbiAqIG1haW4gcmVmZXJlbmNlIG9uIGhvdyBtYW55IHBpeGVscyBzaG91bGQgYmUgdXNlZCB0byByZXByZXNlbnQgb25lIHNlY29uZFxuICogdGhvdWdoIGl0cyBgdGltZVRvUGl4ZWxgIG1ldGhvZC4gVGhlIGF0dHJpYnV0ZXMgYHpvb21gLCBgb2Zmc2V0YCAoaS5lLiBmcm9tXG4gKiBvcmlnaW4pIGFuZCBgdmlzaWJsZVdpZHRoYCBhbGxvdyBmb3IgbmF2aWdhdGluZyBpbiB0aW1lIGFuZCBmb3IgbWFpbnRhaW5pbmdcbiAqIHZpZXcgY29uc2lzdGVuY3kgdXBvbiB0aGUgRE9NIHN0cnVjdHVyZSAoYDxzdmc+YCBhbmQgYDxnPmAgdGFncykgY3JlYXRlZCBieVxuICogdGhlIHJlZ2lzdGVyZWQgdHJhY2tzLlxuICpcbiAqIEl0IGFsc28gbWFpbnRhaW4gYW4gYXJyYXkgb2YgYWxsIHJlZmVyZW5jZXMgdG8gYExheWVyVGltZUNvbnRleHRgIGluc3RhbmNlc1xuICogdG8gcHJvcGFnYXRlIHRvIGBsYXllcnNgLCBjaGFuZ2VzIG1hZGUgb24gdGhlIHRpbWUgdG8gcGl4ZWwgcmVwcmVzZW50YXRpb24uXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvdGltZS1jb250ZXh0cy5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lbGluZVRpbWVDb250ZXh0IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwaXhlbHNQZXJTZWNvbmQgLSBUaGUgbnVtYmVyIG9mIHBpeGVscyB0aGF0IHNob3VsZCBiZVxuICAgKiAgICB1c2VkIHRvIGRpc3BsYXkgb25lIHNlY29uZC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZpc2libGVXaWR0aCAtIFRoZSBkZWZhdWx0IHdpdGggb2YgdGhlIHZpc2libGUgYXJlYVxuICAgKiAgICBkaXNwbGF5ZWQgaW4gYHRyYWNrc2AgKGluIHBpeGVscykuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwaXhlbHNQZXJTZWNvbmQsIHZpc2libGVXaWR0aCkge1xuICAgIHRoaXMuX2NoaWxkcmVuID0gW107XG5cbiAgICB0aGlzLl90aW1lVG9QaXhlbCA9IG51bGw7XG4gICAgdGhpcy5fb2Zmc2V0ID0gMDtcbiAgICB0aGlzLl96b29tID0gMTtcbiAgICB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZCA9IHBpeGVsc1BlclNlY29uZDtcbiAgICAvLyBwYXJhbXNcbiAgICB0aGlzLl92aXNpYmxlV2lkdGggPSB2aXNpYmxlV2lkdGg7XG4gICAgdGhpcy5fbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSBmYWxzZTtcblxuICAgIC8vIGNyZWF0ZSB0aGUgdGltZVRvUGl4ZWwgc2NhbGVcbiAgICBjb25zdCBzY2FsZSA9IHNjYWxlcy5saW5lYXIoKVxuICAgICAgLmRvbWFpbihbMCwgMV0pXG4gICAgICAucmFuZ2UoWzAsIHBpeGVsc1BlclNlY29uZF0pO1xuXG4gICAgdGhpcy5fdGltZVRvUGl4ZWwgPSBzY2FsZTtcblxuICAgIHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kID0gdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIHBpeGVscyBwZXIgc2Vjb25kcyBpZ25vcmluZyB0aGUgY3VycmVudCB6b29tIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHBpeGVsc1BlclNlY29uZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fb3JpZ2luYWxQaXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBhbGwgdGhlIGNhcmFjdGVyaXN0aWNzIG9mIHRoaXMgb2JqZWN0IGFjY29yZGluZyB0byB0aGUgbmV3XG4gICAqIGdpdmVuIHZhbHVlIG9mIHBpeGVscyBwZXIgc2Vjb25kcy4gUHJvcGFnYXRlcyB0aGUgY2hhbmdlcyB0byB0aGVcbiAgICogYExheWVyVGltZUNvbnRleHRgIGNoaWxkcmVuLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IHBpeGVsc1BlclNlY29uZCh2YWx1ZSkge1xuICAgIHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kID0gdmFsdWUgKiB0aGlzLnpvb207XG4gICAgdGhpcy5fb3JpZ2luYWxQaXhlbHNQZXJTZWNvbmQgPSB2YWx1ZTtcbiAgICB0aGlzLl91cGRhdGVUaW1lVG9QaXhlbFJhbmdlKCk7XG5cbiAgICAvLyBmb3JjZSBjaGlsZHJlbiBzY2FsZSB1cGRhdGVcbiAgICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICBpZiAoY2hpbGQuc3RyZXRjaFJhdGlvID09PSAxKSB7IHJldHVybjsgfVxuICAgICAgY2hpbGQuc3RyZXRjaFJhdGlvID0gY2hpbGQuc3RyZXRjaFJhdGlvO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBwaXhlbHMgcGVyIHNlY29uZHMgaW5jbHVkaW5nIHRoZSBjdXJyZW50IHpvb20gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgb2Zmc2V0IGFwcGxpZWQgdG8gdGhlIHJlZ2lzdGVyZWQgYFRyYWNrYCBpbnN0YW5jZXNcbiAgICogZnJvbSBvcmlnaW4gKGluIHNlY29uZHMpLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG9mZnNldCB0byBhcHBseSB0byB0aGUgcmVnaXN0ZXJlZCBgVHJhY2tgIGluc3RhbmNlcyBmcm9tIG9yaWdpblxuICAgKiAoaW4gc2Vjb25kcykuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgb2Zmc2V0KHZhbHVlKSB7XG4gICAgdGhpcy5fb2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCB6b29tIGxldmVsIGFwcGxpZWQgdG8gdGhlIHdob2xlIHZpc3VhbGl6YXRpb24uXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgem9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy5fem9vbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB6b29tIHJhdGlvIGZvciB0aGUgd2hvbGUgdmlzdWFsaXphdGlvbi5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCB6b29tKHZhbHVlKSB7XG4gICAgLy8gQ29tcHV0ZSBjaGFuZ2UgdG8gcHJvcGFnYXRlIHRvIGNoaWxkcmVuIHdobyBoYXZlIHRoZWlyIG93biB0aW1lVG9QaXhlbFxuICAgIGNvbnN0IHJhdGlvQ2hhbmdlID0gdmFsdWUgLyB0aGlzLl96b29tO1xuICAgIHRoaXMuX3pvb20gPSB2YWx1ZTtcbiAgICB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZCA9IHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kICogdmFsdWU7XG4gICAgdGhpcy5fdXBkYXRlVGltZVRvUGl4ZWxSYW5nZSgpO1xuXG4gICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgaWYgKGNoaWxkLnN0cmV0Y2hSYXRpbyA9PT0gMSkgeyByZXR1cm47IH1cbiAgICAgIGNoaWxkLnN0cmV0Y2hSYXRpbyA9IGNoaWxkLnN0cmV0Y2hSYXRpbyAqIHJhdGlvQ2hhbmdlO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZpc2libGUgd2lkdGggb2YgdGhlIGBUcmFja2AgaW5zdGFuY2VzLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHZpc2libGVXaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmlzaWJsZVdpZHRoO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZpc2libGUgd2lkdGggb2YgdGhlIGBUcmFja2AgaW5zdGFuY2VzLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IHZpc2libGVXaWR0aCh2YWx1ZSkge1xuICAgIGNvbnN0IHdpZHRoUmF0aW8gPSB2YWx1ZSAvIHRoaXMudmlzaWJsZVdpZHRoO1xuICAgIHRoaXMuX3Zpc2libGVXaWR0aCA9IHZhbHVlO1xuXG4gICAgaWYgKHRoaXMubWFpbnRhaW5WaXNpYmxlRHVyYXRpb24pIHtcbiAgICAgIHRoaXMucGl4ZWxzUGVyU2Vjb25kID0gdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQgKiB3aWR0aFJhdGlvO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkdXJhdGlvbiBkaXNwbGF5ZWQgYnkgYFRyYWNrYCBpbnN0YW5jZXMuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgdmlzaWJsZUR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnZpc2libGVXaWR0aCAvIHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgaWYgdGhlIGR1cmF0aW9uIGRpc3BsYXllZCBieSB0cmFja3Mgc2hvdWxkIGJlIG1haW50YWluZWQgd2hlblxuICAgKiB0aGVpciB3aWR0aCBpcyB1cGRhdGVkLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9tYWludGFpblZpc2libGVEdXJhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGlmIHRoZSBkdXJhdGlvbiBkaXNwbGF5ZWQgYnkgdHJhY2tzIHNob3VsZCBiZSBtYWludGFpbmVkIHdoZW5cbiAgICogdGhlaXIgd2lkdGggaXMgdXBkYXRlZC5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICBzZXQgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24oYm9vbCkge1xuICAgIHRoaXMuX21haW50YWluVmlzaWJsZUR1cmF0aW9uID0gYm9vbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0aW1lIHRvIHBpeGVsIHRyYXNmZXJ0IGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBnZXQgdGltZVRvUGl4ZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RpbWVUb1BpeGVsO1xuICB9XG5cbiAgX3VwZGF0ZVRpbWVUb1BpeGVsUmFuZ2UoKSB7XG4gICAgdGhpcy50aW1lVG9QaXhlbC5yYW5nZShbMCwgdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmRdKTtcbiAgfVxufVxuIiwiaW1wb3J0IGV2ZW50cyBmcm9tICdldmVudHMnO1xuXG5pbXBvcnQgS2V5Ym9hcmQgZnJvbSAnLi4vaW50ZXJhY3Rpb25zL2tleWJvYXJkJztcbmltcG9ydCBMYXllclRpbWVDb250ZXh0IGZyb20gJy4vbGF5ZXItdGltZS1jb250ZXh0JztcbmltcG9ydCBTdXJmYWNlIGZyb20gJy4uL2ludGVyYWN0aW9ucy9zdXJmYWNlJztcbmltcG9ydCBUaW1lbGluZVRpbWVDb250ZXh0IGZyb20gJy4vdGltZWxpbmUtdGltZS1jb250ZXh0JztcbmltcG9ydCBUcmFjayBmcm9tICcuL3RyYWNrJztcbmltcG9ydCBUcmFja0NvbGxlY3Rpb24gZnJvbSAnLi90cmFjay1jb2xsZWN0aW9uJztcblxuXG4vKipcbiAqIElzIHRoZSBtYWluIGVudHJ5IHBvaW50IHRvIGNyZWF0ZSBhIHRlbXBvcmFsIHZpc3VhbGl6YXRpb24uXG4gKlxuICogQSBgdGltZWxpbmVgIGluc3RhbmNlIG1haW5seSBwcm92aWRlcyB0aGUgY29udGV4dCBmb3IgYW55IHZpc3VhbGl6YXRpb24gb2ZcbiAqIHRlbXBvcmFsIGRhdGEgYW5kIG1haW50YWlucyB0aGUgaGllcmFyY2h5IG9mIGBUcmFja2AsIGBMYXllcmAgYW5kIGBTaGFwZWBcbiAqIG92ZXIgdGhlIGVudGllcmUgdmlzdWFsaXNhdGlvbi5cbiAqXG4gKiBJdHMgbWFpbiByZXNwb25zYWJpbGl0ZXMgYXJlOlxuICogLSBtYWludGFpbmluZyB0aGUgdGVtcG9yYWwgY29uc2lzdGVuY3kgYWNjcm9zcyB0aGUgdmlzdWFsaXNhdGlvbiB0aHJvdWdoXG4gKiAgIGl0cyBgdGltZUNvbnRleHRgIHByb3BlcnR5IChpbnN0YW5jZSBvZiBgVGltZWxpbmVUaW1lQ29udGV4dGApLlxuICogLSBoYW5kbGluZyBpbnRlcmFjdGlvbnMgdG8gaXRzIGN1cnJlbnQgc3RhdGUgKGFjdGluZyBoZXJlIGFzIGEgc2ltcGxlXG4gKiAgIHN0YXRlIG1hY2hpbmUpLlxuICpcbiAqIEBUT0RPIGluc2VydCBmaWd1cmVcbiAqXG4gKiBJdCBhbHNvIGNvbnRhaW5zIGEgcmVmZXJlbmNlIHRvIGFsbCB0aGUgcmVnaXN0ZXIgdHJhY2sgYWxsb3dpbmcgdG8gYHJlbmRlcmBcbiAqIG9yIGB1cGRhdGVgIGFsbCB0aGUgbGF5ZXIgZnJvbSBhIHNpbmdsZSBlbnRyeSBwb2ludC5cbiAqXG4gKiAjIyBFeGFtcGxlIFVzYWdlXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHZpc2libGVXaWR0aCA9IDUwMDsgLy8gZGVmYXVsdCB3aWR0aCBpbiBwaXhlbHMgZm9yIGFsbCBjcmVhdGVkIGBUcmFja2BcbiAqIGNvbnN0IGR1cmF0aW9uID0gMTA7IC8vIHRoZSB2aXNpYmxlIGFyZWEgcmVwcmVzZW50cyAxMCBzZWNvbmRzXG4gKiBjb25zdCBwaXhlbHNQZXJTZWNvbmRzID0gdmlzaWJsZVdpZHRoIC8gZHVyYXRpb247XG4gKiBjb25zdCB0aW1lbGluZSA9IG5ldyB1aS5jb3JlLlRpbWVsaW5lKHBpeGVsc1BlclNlY29uZCwgd2lkdGgpO1xuICogYGBgXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3BpeGVsc1BlclNlY29uZD0xMDBdIC0gdGhlIGRlZmF1bHQgc2NhbGluZyBiZXR3ZWVuIHRpbWUgYW5kIHBpeGVscy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFt2aXNpYmxlV2lkdGg9MTAwMF0gLSB0aGUgZGVmYXVsdCB2aXNpYmxlIGFyZWEgZm9yIGFsbCByZWdpc3RlcmVkIHRyYWNrcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHBpeGVsc1BlclNlY29uZCA9IDEwMCwgdmlzaWJsZVdpZHRoID0gMTAwMCwge1xuICAgIHJlZ2lzdGVyS2V5Ym9hcmQgPSB0cnVlXG4gIH0gPSB7fSkge1xuXG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX3RyYWNrcyA9IG5ldyBUcmFja0NvbGxlY3Rpb24odGhpcyk7XG4gICAgdGhpcy5fc3RhdGUgPSBudWxsO1xuXG4gICAgLy8gZGVmYXVsdCBpbnRlcmFjdGlvbnNcbiAgICB0aGlzLl9zdXJmYWNlQ3RvciA9IFN1cmZhY2U7XG5cbiAgICBpZiAocmVnaXN0ZXJLZXlib2FyZCkge1xuICAgICAgdGhpcy5jcmVhdGVJbnRlcmFjdGlvbihLZXlib2FyZCwgZG9jdW1lbnQpO1xuICAgIH1cblxuICAgIC8vIHN0b3Jlc1xuICAgIHRoaXMuX3RyYWNrQnlJZCA9IHt9O1xuICAgIHRoaXMuX2dyb3VwZWRMYXllcnMgPSB7fTtcblxuICAgIC8qKiBAdHlwZSB7VGltZWxpbmVUaW1lQ29udGV4dH0gLSBtYXN0ZXIgdGltZSBjb250ZXh0IGZvciB0aGUgdmlzdWFsaXphdGlvbi4gKi9cbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbmV3IFRpbWVsaW5lVGltZUNvbnRleHQocGl4ZWxzUGVyU2Vjb25kLCB2aXNpYmxlV2lkdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYG9mZnNldGAgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9IFtvZmZzZXQ9MF1cbiAgICovXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQub2Zmc2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYG9mZnNldGAgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9IFtvZmZzZXQ9MF1cbiAgICovXG4gIHNldCBvZmZzZXQodmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGB6b29tYCB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn0gW29mZnNldD0wXVxuICAgKi9cbiAgZ2V0IHpvb20oKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQuem9vbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgem9vbWAgdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9IFtvZmZzZXQ9MF1cbiAgICovXG4gIHNldCB6b29tKHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC56b29tID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYHBpeGVsc1BlclNlY29uZGAgcmF0aW8uXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9IFtvZmZzZXQ9MF1cbiAgICovXG4gIGdldCBwaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQucGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGBwaXhlbHNQZXJTZWNvbmRgIHJhdGlvLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfSBbb2Zmc2V0PTBdXG4gICAqL1xuICBzZXQgcGl4ZWxzUGVyU2Vjb25kKHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC5waXhlbHNQZXJTZWNvbmQgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgdmlzaWJsZVdpZHRoYCBwaXhlbCBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9IFtvZmZzZXQ9MF1cbiAgICovXG4gIGdldCB2aXNpYmxlV2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQudmlzaWJsZVdpZHRoO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGB2aXNpYmxlV2lkdGhgIHBpeGVsIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn0gW29mZnNldD0wXVxuICAgKi9cbiAgc2V0IHZpc2libGVXaWR0aCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQudmlzaWJsZVdpZHRoID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgdGltZVRvUGl4ZWxgIHRyYW5zZmVydCBmdW5jdGlvbi5cbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgZ2V0IHRpbWVUb1BpeGVsKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYHZpc2libGVEdXJhdGlvbmAgaGVscGVyIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHZpc2libGVEdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC52aXNpYmxlRHVyYXRpb247XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYG1haW50YWluVmlzaWJsZUR1cmF0aW9uYCB2YWx1ZS5cbiAgICogRGVmaW5lcyBpZiB0aGUgZHVyYXRpb24gb2YgdGhlIHZpc2libGUgYXJlYSBzaG91bGQgYmUgbWFpbnRhaW4gd2hlblxuICAgKiB0aGUgYHZpc2libGVXaWR0aGAgYXR0cmlidXRlIGlzIHVwZGF0ZWQuXG4gICAqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgc2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKGJvb2wpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0Lm1haW50YWluVmlzaWJsZUR1cmF0aW9uID0gYm9vbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGBtYWludGFpblZpc2libGVEdXJhdGlvbmAgY3VycmVudCB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICBnZXQgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQubWFpbnRhaW5WaXNpYmxlRHVyYXRpb247XG4gIH1cblxuICAvKipcbiAgICogT2JqZWN0IG1haW50YWluaW5nIGFycmF5cyBvZiBgTGF5ZXJgIGluc3RhbmNlcyBvcmRlcmVkIGJ5IHRoZWlyIGBncm91cElkYC5cbiAgICogSXMgdXNlZCBpbnRlcm5hbGx5IGJ5IHRoZSBgVHJhY2tDb2xsZWN0aW9uYCBpbnN0YW5jZS5cbiAgICpcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGdldCBncm91cGVkTGF5ZXJzKCkge1xuICAgIHJldHVybiB0aGlzLl9ncm91cGVkTGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlcyB0aGUgZGVmYXVsdCBgU3VyZmFjZWAgdGhhdCBpcyBpbnN0YW5jaWF0ZWQgb24gZWFjaCBgVHJhY2tgXG4gICAqIGluc3RhbmNlLiBUaGlzIG1ldGhvcyBzaG91bGQgYmUgY2FsbGVkIGJlZm9yZSBhZGRpbmcgYW55IGBUcmFja2AgaW5zdGFuY2VcbiAgICogdG8gdGhlIGN1cnJlbnQgYHRpbWVsaW5lYC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudFNvdXJjZX0gY3RvciAtIFRoZSBjb25zdHJ1Y3RvciB0byB1c2UgaW4gb3JkZXIgdG8gY2F0Y2ggbW91c2VcbiAgICogICAgZXZlbnRzIG9uIGVhY2ggYFRyYWNrYCBpbnN0YW5jZXMuXG4gICAqL1xuICBjb25maWd1cmVTdXJmYWNlKGN0b3IpIHtcbiAgICB0aGlzLl9zdXJmYWNlQ3RvciA9IGN0b3I7XG4gIH1cblxuICAvKipcbiAgICogRmFjdG9yeSBtZXRob2QgdG8gYWRkIGludGVyYWN0aW9uIG1vZHVsZXMgdGhlIHRpbWVsaW5lIHNob3VsZCBsaXN0ZW4gdG8uXG4gICAqIEJ5IGRlZmF1bHQsIHRoZSB0aW1lbGluZSBpbnN0YW5jaWF0ZSBhIGdsb2JhbCBgS2V5Ym9hcmRgIGluc3RhbmNlIGFuZCBhXG4gICAqIGBTdXJmYWNlYCBpbnN0YW5jZSBvbiBlYWNoIGNvbnRhaW5lci5cbiAgICogU2hvdWxkIGJlIHVzZWQgdG8gaW5zdGFsbCBuZXcgaW50ZXJhY3Rpb25zIGltcGxlbWVudGluZyB0aGUgYEV2ZW50U291cmNlYCBpbnRlcmZhY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnRTb3VyY2V9IGN0b3IgLSBUaGUgY29udHJ1Y3RvciBvZiB0aGUgaW50ZXJhY3Rpb24gbW9kdWxlIHRvIGluc3RhbmNpYXRlLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIFRoZSBET00gZWxlbWVudCB3aGljaCB3aWxsIGJlIGJpbmRlZCB0byB0aGUgYEV2ZW50U291cmNlYCBtb2R1bGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gLSBPcHRpb25zIHRvIGJlIGFwcGxpZWQgdG8gdGhlIGBjdG9yYC5cbiAgICovXG4gIGNyZWF0ZUludGVyYWN0aW9uKGN0b3IsICRlbCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgaW50ZXJhY3Rpb24gPSBuZXcgY3RvcigkZWwsIG9wdGlvbnMpO1xuICAgIGludGVyYWN0aW9uLm9uKCdldmVudCcsIChlKSA9PiB0aGlzLl9oYW5kbGVFdmVudChlKSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGxpc3Qgb2YgdGhlIGxheWVycyBzaXR1YXRlZCB1bmRlciB0aGUgcG9zaXRpb24gb2YgYSBgV2F2ZUV2ZW50YC5cbiAgICpcbiAgICogQHBhcmFtIHtXYXZlc0V2ZW50fSBlIC0gQW4gZXZlbnQgdHJpZ2dlcmVkIGJ5IGEgYFdhdmVFdmVudGBcbiAgICogQHJldHVybiB7QXJyYXl9IC0gTWF0Y2hlZCBsYXllcnNcbiAgICovXG4gIGdldEhpdExheWVycyhlKSB7XG4gICAgY29uc3QgY2xpZW50WCA9IGUub3JpZ2luYWxFdmVudC5jbGllbnRYO1xuICAgIGNvbnN0IGNsaWVudFkgPSBlLm9yaWdpbmFsRXZlbnQuY2xpZW50WTtcbiAgICBsZXQgbGF5ZXJzID0gW107XG5cbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgaWYgKCFsYXllci5wYXJhbXMuaGl0dGFibGUpIHsgcmV0dXJuOyB9XG4gICAgICBjb25zdCBiciA9IGxheWVyLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgaWYgKFxuICAgICAgICBjbGllbnRYID4gYnIubGVmdCAmJiBjbGllbnRYIDwgYnIucmlnaHQgJiZcbiAgICAgICAgY2xpZW50WSA+IGJyLnRvcCAmJiBjbGllbnRZIDwgYnIuYm90dG9tXG4gICAgICApIHtcbiAgICAgICAgbGF5ZXJzLnB1c2gobGF5ZXIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGxheWVycztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY2FsbGJhY2sgdGhhdCBpcyB1c2VkIHRvIGxpc3RlbiB0byBpbnRlcmFjdGlvbnMgbW9kdWxlcy5cbiAgICpcbiAgICogQHBhcmFtIHtXYXZlRXZlbnR9IGUgLSBBbiBldmVudCBnZW5lcmF0ZWQgYnkgYW4gaW50ZXJhY3Rpb24gbW9kdWxlcyAoYEV2ZW50U291cmNlYCkuXG4gICAqL1xuICBfaGFuZGxlRXZlbnQoZSkge1xuICAgIGNvbnN0IGhpdExheWVycyA9IChlLnNvdXJjZSA9PT0gJ3N1cmZhY2UnKSA/XG4gICAgICB0aGlzLmdldEhpdExheWVycyhlKSA6IG51bGw7XG4gICAgLy8gZW1pdCBldmVudCBhcyBhIG1pZGRsZXdhcmVcbiAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZSwgaGl0TGF5ZXJzKTtcbiAgICAvLyBwcm9wYWdhdGUgdG8gdGhlIHN0YXRlXG4gICAgaWYgKCF0aGlzLl9zdGF0ZSkgeyByZXR1cm47IH1cbiAgICB0aGlzLl9zdGF0ZS5oYW5kbGVFdmVudChlLCBoaXRMYXllcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHN0YXRlIG9mIHRoZSB0aW1lbGluZS5cbiAgICpcbiAgICogQHR5cGUge0Jhc2VTdGF0ZX1cbiAgICovXG4gIHNldCBzdGF0ZShzdGF0ZSkge1xuICAgIGlmICh0aGlzLl9zdGF0ZSkgeyB0aGlzLl9zdGF0ZS5leGl0KCk7IH1cbiAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuICAgIGlmICh0aGlzLl9zdGF0ZSkgeyB0aGlzLl9zdGF0ZS5lbnRlcigpOyB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgdGltZWxpbmUuXG4gICAqXG4gICAqIEB0eXBlIHtCYXNlU3RhdGV9XG4gICAqL1xuICBnZXQgc3RhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUcmFja0NvbGxlY3Rpb25gIGluc3RhbmNlLlxuICAgKlxuICAgKiBAdHlwZSB7VHJhY2tDb2xsZWN0aW9ufVxuICAgKi9cbiAgZ2V0IHRyYWNrcygpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhY2tzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGxpc3Qgb2YgYWxsIHJlZ2lzdGVyZWQgbGF5ZXJzLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqL1xuICBnZXQgbGF5ZXJzKCkge1xuICAgIHJldHVybiB0aGlzLl90cmFja3MubGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBuZXcgdHJhY2sgdG8gdGhlIHRpbWVsaW5lLlxuICAgKlxuICAgKiBAcGFyYW0ge1RyYWNrfSB0cmFjayAtIFRoZSBuZXcgdHJhY2sgdG8gYmUgcmVnaXN0ZXJlZCBpbiB0aGUgdGltZWxpbmUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbdHJhY2tJZD1udWxsXSAtIE9wdGlvbm5hbCB1bmlxdWUgaWQgdG8gYXNzb2NpYXRlIHdpdGhcbiAgICogICAgdGhlIHRyYWNrLCB0aGlzIGlkIG9ubHkgZXhpc3RzIGluIHRpbWVsaW5lJ3MgY29udGV4dCBhbmQgc2hvdWxkIGJlIHVzZWRcbiAgICogICAgaW4gY29uam9uY3Rpb24gd2l0aCBgYWRkTGF5ZXJgIG1ldGhvZC5cbiAgICovXG4gIGFkZCh0cmFjaywgdHJhY2tJZCA9IG51bGwpIHtcbiAgICBpZiAodGhpcy50cmFja3MuaW5kZXhPZih0cmFjaykgIT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RyYWNrIGFscmVhZHkgYWRkZWQgdG8gdGhlIHRpbWVsaW5lJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVnaXN0ZXJUcmFja0lkKHRyYWNrLCB0cmFja0lkKTtcbiAgICB0cmFjay5jb25maWd1cmUodGhpcy50aW1lQ29udGV4dCk7XG5cbiAgICB0aGlzLnRyYWNrcy5wdXNoKHRyYWNrKTtcbiAgICB0aGlzLmNyZWF0ZUludGVyYWN0aW9uKHRoaXMuX3N1cmZhY2VDdG9yLCB0cmFjay4kZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSB0cmFjayBmcm9tIHRoZSB0aW1lbGluZS5cbiAgICpcbiAgICogQHBhcmFtIHtUcmFja30gdHJhY2sgLSB0aGUgdHJhY2sgdG8gcmVtb3ZlIGZyb20gdGhlIHRpbWVsaW5lLlxuICAgKiBAdG9kbyBub3QgaW1wbGVtZW50ZWQuXG4gICAqL1xuICByZW1vdmUodHJhY2spIHtcbiAgICAvLyBzaG91bGQgZGVzdHJveSBpbnRlcmFjdGlvbiB0b28sIGF2b2lkIGdob3N0IGV2ZW50TGlzdGVuZXJzXG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIHRvIGNyZWF0ZSBhIG5ldyBgVHJhY2tgIGluc3RhbmNlLiBUaGUgYHRyYWNrYCBpcyBhZGRlZCxcbiAgICogcmVuZGVyZWQgYW5kIHVwZGF0ZWQgYmVmb3JlIGJlaW5nIHJldHVybmVkLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIFRoZSBET00gZWxlbWVudCB3aGVyZSB0aGUgdHJhY2sgc2hvdWxkIGJlIGluc2VydGVkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdHJhY2tIZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSBuZXdseSBjcmVhdGVkIHRyYWNrLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3RyYWNrSWQ9bnVsbF0gLSBPcHRpb25uYWwgdW5pcXVlIGlkIHRvIGFzc29jaWF0ZSB3aXRoXG4gICAqICAgIHRoZSB0cmFjaywgdGhpcyBpZCBvbmx5IGV4aXN0cyBpbiB0aW1lbGluZSdzIGNvbnRleHQgYW5kIHNob3VsZCBiZSB1c2VkIGluXG4gICAqICAgIGNvbmpvbmN0aW9uIHdpdGggYGFkZExheWVyYCBtZXRob2QuXG4gICAqIEByZXR1cm4ge1RyYWNrfVxuICAgKi9cbiAgY3JlYXRlVHJhY2soJGVsLCB0cmFja0hlaWdodCA9IDEwMCwgdHJhY2tJZCA9IG51bGwpIHtcbiAgICBjb25zdCB0cmFjayA9IG5ldyBUcmFjaygkZWwsIHRyYWNrSGVpZ2h0KTtcbiAgICAvLyBBZGQgdHJhY2sgdG8gdGhlIHRpbWVsaW5lXG4gICAgdGhpcy5hZGQodHJhY2ssIHRyYWNrSWQpO1xuICAgIHRyYWNrLnJlbmRlcigpO1xuICAgIHRyYWNrLnVwZGF0ZSgpO1xuXG4gICAgcmV0dXJuIHRyYWNrO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRyYWNrIGlkIGlzIGRlZmluZWQsIGFzc29jaWF0ZSBhIHRyYWNrIHdpdGggYSB1bmlxdWUgaWQuXG4gICAqL1xuICBfcmVnaXN0ZXJUcmFja0lkKHRyYWNrLCB0cmFja0lkKSB7XG4gICAgaWYgKHRyYWNrSWQgIT09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLl90cmFja0J5SWRbdHJhY2tJZF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHRyYWNrSWQ6IFwiJHt0cmFja0lkfVwiIGlzIGFscmVhZHkgdXNlZGApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl90cmFja0J5SWRbdHJhY2tJZF0gPSB0cmFjaztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIHRvIGFkZCBhIGBMYXllcmAgaW5zdGFuY2UgaW50byBhIGdpdmVuIGBUcmFja2AuIElzIGRlc2lnbmVkIHRvIGJlXG4gICAqIHVzZWQgaW4gY29uam9uY3Rpb24gd2l0aCB0aGUgYFRpbWVsaW5lfmdldExheWVyc0J5R3JvdXBgIG1ldGhvZC4gVGhlXG4gICAqIGxheWVyIGlzIGludGVybmFsbHkgcmVuZGVyZWQgYW5kIHVwZGF0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7TGF5ZXJ9IGxheWVyIC0gVGhlIGBMYXllcmAgaW5zdGFuY2UgdG8gYWRkIGludG8gdGhlIHZpc3VhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7KFRyYWNrfFN0cmluZyl9IHRyYWNrT3JUcmFja0lkIC0gVGhlIGBUcmFja2AgaW5zdGFuY2UgKG9yIGl0cyBgaWRgXG4gICAqICAgIGFzIGRlZmluZWQgaW4gdGhlIGBjcmVhdGVUcmFja2AgbWV0aG9kKSB3aGVyZSB0aGUgYExheWVyYCBpbnN0YW5jZSBzaG91bGQgYmUgaW5zZXJ0ZWQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbZ3JvdXBJZD0nZGVmYXVsdCddIC0gQW4gb3B0aW9ubmFsIGdyb3VwIGlkIGluIHdoaWNoIHRoZVxuICAgKiAgICBgTGF5ZXJgIHNob3VsZCBiZSBpbnNlcnRlZC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbaXNBeGlzXSAtIFNldCB0byBgdHJ1ZWAgaWYgdGhlIGFkZGVkIGBsYXllcmAgaXMgYW5cbiAgICogICAgaW5zdGFuY2Ugb2YgYEF4aXNMYXllcmAgKHRoZXNlIGxheWVycyBzaGFyZXMgdGhlIGBUaW1saW5lVGltZUNvbnRleHRgIGluc3RhbmNlXG4gICAqICAgIG9mIHRoZSB0aW1lbGluZSkuXG4gICAqL1xuICBhZGRMYXllcihsYXllciwgdHJhY2tPclRyYWNrSWQsIGdyb3VwSWQgPSAnZGVmYXVsdCcsIGlzQXhpcyA9IGZhbHNlKSB7XG4gICAgbGV0IHRyYWNrID0gdHJhY2tPclRyYWNrSWQ7XG5cbiAgICBpZiAodHlwZW9mIHRyYWNrT3JUcmFja0lkID09PSAnc3RyaW5nJykge1xuICAgICAgdHJhY2sgPSB0aGlzLmdldFRyYWNrQnlJZCh0cmFja09yVHJhY2tJZCk7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlcyB0aGUgYExheWVyVGltZUNvbnRleHRgIGlmIG5vdCBwcmVzZW50XG4gICAgaWYgKCFsYXllci50aW1lQ29udGV4dCkge1xuICAgICAgY29uc3QgdGltZUNvbnRleHQgPSBpc0F4aXMgP1xuICAgICAgICB0aGlzLnRpbWVDb250ZXh0IDogbmV3IExheWVyVGltZUNvbnRleHQodGhpcy50aW1lQ29udGV4dCk7XG5cbiAgICAgIGxheWVyLnNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KTtcbiAgICB9XG5cbiAgICAvLyB3ZSBzaG91bGQgaGF2ZSBhIFRyYWNrIGluc3RhbmNlIGF0IHRoaXMgcG9pbnRcbiAgICB0cmFjay5hZGQobGF5ZXIpO1xuXG4gICAgaWYgKCF0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdKSB7XG4gICAgICB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5fZ3JvdXBlZExheWVyc1tncm91cElkXS5wdXNoKGxheWVyKTtcblxuICAgIGxheWVyLnJlbmRlcigpO1xuICAgIGxheWVyLnVwZGF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBsYXllciBmcm9tIGl0cyB0cmFjay4gVGhlIGxheWVyIGlzIGRldGF0Y2hlZCBmcm9tIHRoZSBET00gYnV0XG4gICAqIGNhbiBzdGlsbCBiZSByZXVzZWQgbGF0ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7TGF5ZXJ9IGxheWVyIC0gVGhlIGxheWVyIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZUxheWVyKGxheWVyKSB7XG4gICAgdGhpcy50cmFja3MuZm9yRWFjaChmdW5jdGlvbih0cmFjaykge1xuICAgICAgY29uc3QgaW5kZXggPSB0cmFjay5sYXllcnMuaW5kZXhPZihsYXllcik7XG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7IHRyYWNrLnJlbW92ZShsYXllcik7IH1cbiAgICB9KTtcblxuICAgIC8vIGNsZWFuIHJlZmVyZW5jZXMgaW4gaGVscGVyc1xuICAgIGZvciAobGV0IGdyb3VwSWQgaW4gdGhpcy5fZ3JvdXBlZExheWVycykge1xuICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdO1xuICAgICAgY29uc3QgaW5kZXggPSBncm91cC5pbmRleE9mKGxheWVyKTtcblxuICAgICAgaWYgKGluZGV4ICE9PSAtMSkgeyBncm91cC5zcGxpY2UobGF5ZXIsIDEpOyB9XG5cbiAgICAgIGlmICghZ3JvdXAubGVuZ3RoKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgYFRyYWNrYCBpbnN0YW5jZSBmcm9tIGl0J3MgZ2l2ZW4gaWQuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0cmFja0lkXG4gICAqIEByZXR1cm4ge1RyYWNrfVxuICAgKi9cbiAgZ2V0VHJhY2tCeUlkKHRyYWNrSWQpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhY2tCeUlkW3RyYWNrSWRdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRyYWNrIGNvbnRhaW5pbmcgYSBnaXZlbiBET00gRWxlbWVudCwgcmV0dXJucyBudWxsIGlmIG5vIG1hdGNoIGZvdW5kLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIFRoZSBET00gRWxlbWVudCB0byBiZSB0ZXN0ZWQuXG4gICAqIEByZXR1cm4ge1RyYWNrfVxuICAgKi9cbiAgZ2V0VHJhY2tGcm9tRE9NRWxlbWVudCgkZWwpIHtcbiAgICBsZXQgJHN2ZyA9IG51bGw7XG4gICAgbGV0IHRyYWNrID0gbnVsbDtcbiAgICAvLyBmaW5kIHRoZSBjbG9zZXN0IGAudHJhY2tgIGVsZW1lbnRcbiAgICBkbyB7XG4gICAgICBpZiAoJGVsLmNsYXNzTGlzdC5jb250YWlucygndHJhY2snKSkge1xuICAgICAgICAkc3ZnID0gJGVsO1xuICAgICAgfVxuICAgICAgJGVsID0gJGVsLnBhcmVudE5vZGU7XG4gICAgfSB3aGlsZSAoJHN2ZyA9PT0gbnVsbCk7XG4gICAgLy8gZmluZCB0aGUgcmVsYXRlZCBgVHJhY2tgXG4gICAgdGhpcy50cmFja3MuZm9yRWFjaChmdW5jdGlvbihfdHJhY2spIHtcbiAgICAgIGlmIChfdHJhY2suJHN2ZyA9PT0gJHN2ZykgeyB0cmFjayA9IF90cmFjazsgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRyYWNrO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgbGF5ZXJzIGZyb20gdGhlaXIgZ2l2ZW4gZ3JvdXAgaWQuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBncm91cElkIC0gVGhlIGlkIG9mIHRoZSBncm91cCBhcyBkZWZpbmVkIGluIGBhZGRMYXllcmAuXG4gICAqIEByZXR1cm4geyhBcnJheXx1bmRlZmluZWQpfVxuICAgKi9cbiAgZ2V0TGF5ZXJzQnlHcm91cChncm91cElkKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF07XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZXMgdGhyb3VnaCB0aGUgYWRkZWQgdHJhY2tzLlxuICAgKi9cbiAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHlpZWxkKiB0aGlzLnRyYWNrc1tTeW1ib2wuaXRlcmF0b3JdKCk7XG4gIH1cbn1cbiIsImltcG9ydCBMYXllciBmcm9tICcuL2xheWVyJztcblxuXG4vKipcbiAqIENvbGxlY3Rpb24gaG9zdGluZyBhbGwgdGhlIGBUcmFja2AgaW5zdGFuY2VzIHJlZ2lzdGVyZWQgaW50byB0aGUgdGltZWxpbmUuXG4gKiBJdCBwcm92aWRlcyBzaG9yY3V0cyB0byB0cmlnZ2VyIGByZW5kZXJgIC8gYHVwZGF0ZWAgbWV0aG9kcyBvbiB0cmFja3Mgb3JcbiAqIGxheWVycy4gRXh0ZW5kIGJ1aWx0LWluIEFycmF5XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNrQ29sbGVjdGlvbiBleHRlbmRzIEFycmF5IHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5fdGltZWxpbmUgPSB0aW1lbGluZTtcbiAgfVxuXG4gIC8vIEBub3RlIC0gc2hvdWxkIGJlIGluIHRoZSB0aW1lbGluZSA/XG4gIC8vIEB0b2RvIC0gYWxsb3cgdG8gcGFzcyBhbiBhcnJheSBvZiBsYXllcnNcbiAgX2dldExheWVyc09yR3JvdXBzKGxheWVyT3JHcm91cCA9IG51bGwpIHtcbiAgICBsZXQgbGF5ZXJzID0gbnVsbDtcblxuICAgIGlmICh0eXBlb2YgbGF5ZXJPckdyb3VwID09PSAnc3RyaW5nJykge1xuICAgICAgbGF5ZXJzID0gdGhpcy5fdGltZWxpbmUuZ3JvdXBlZExheWVyc1tsYXllck9yR3JvdXBdO1xuICAgIH0gZWxzZSBpZiAobGF5ZXJPckdyb3VwIGluc3RhbmNlb2YgTGF5ZXIpIHtcbiAgICAgIGxheWVycyA9IFtsYXllck9yR3JvdXBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXllcnMgPSB0aGlzLmxheWVycztcbiAgICB9XG5cbiAgICByZXR1cm4gbGF5ZXJzO1xuICB9XG5cbiAgLy8gQE5PVEUga2VlcCB0aGlzID9cbiAgLy8gY291bGQgcHJlcGFyZSBzb21lIHZlcnRpY2FsIHJlc2l6aW5nIGFiaWxpdHlcbiAgLy8gdGhpcyBzaG91bGQgYmUgYWJsZSB0byBtb2RpZnkgdGhlIGxheWVycyB5U2NhbGUgdG8gYmUgcmVhbGx5IHVzZWZ1bGxcblxuICAvKipcbiAgICogQHR5cGUge051bWJlcn0gLSBVcGRhdGVzIHRoZSBoZWlnaHQgb2YgYWxsIHRyYWNrcyBhdCBvbmNlLlxuICAgKiBAdG9kbyAtIFByb3BhZ2F0ZSB0byBsYXllcnMsIG5vdCB1c2VmdWxsIGZvciBub3cuXG4gICAqL1xuICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgdGhpcy5mb3JFYWNoKCh0cmFjaykgPT4gdHJhY2suaGVpZ2h0ID0gdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIGFsbCByZWdpc3RlcmVkIGxheWVycy5cbiAgICpcbiAgICogQHR5cGUge0FycmF5PExheWVyPn1cbiAgICovXG4gIGdldCBsYXllcnMoKSB7XG4gICAgbGV0IGxheWVycyA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaCgodHJhY2spID0+IGxheWVycyA9IGxheWVycy5jb25jYXQodHJhY2subGF5ZXJzKSk7XG5cbiAgICByZXR1cm4gbGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciBhbGwgdHJhY2tzIGFuZCBsYXllcnMuIFdoZW4gZG9uZSwgdGhlIHRpbWVsaW5lIHRyaWdnZXJzIGEgYHJlbmRlcmAgZXZlbnQuXG4gICAqL1xuICByZW5kZXIoKSB7XG4gICAgdGhpcy5mb3JFYWNoKCh0cmFjaykgPT4gdHJhY2sucmVuZGVyKCkpO1xuICAgIHRoaXMuX3RpbWVsaW5lLmVtaXQoJ3JlbmRlcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgYWxsIHRyYWNrcyBhbmQgbGF5ZXJzLiBXaGVuIGRvbmUsIHRoZSB0aW1lbGluZSB0cmlnZ2VycyBhXG4gICAqIGB1cGRhdGVgIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge0xheWVyfFN0cmluZ30gbGF5ZXJPckdyb3VwIC0gRmlsdGVyIHRoZSBsYXllcnMgdG8gdXBkYXRlIGJ5XG4gICAqICAgIHBhc3NpbmcgdGhlIGBMYXllcmAgaW5zdGFuY2UgdG8gdXBkYXRlIG9yIGEgYGdyb3VwSWRgXG4gICAqL1xuICB1cGRhdGUobGF5ZXJPckdyb3VwKSB7XG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5fZ2V0TGF5ZXJzT3JHcm91cHMobGF5ZXJPckdyb3VwKTtcbiAgICB0aGlzLmZvckVhY2goKHRyYWNrKSA9PiB0cmFjay51cGRhdGUobGF5ZXJzKSk7XG4gICAgdGhpcy5fdGltZWxpbmUuZW1pdCgndXBkYXRlJywgbGF5ZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIGFsbCBgVHJhY2tgIGNvbnRhaW5lcnMsIGxheWVycyBhcmUgbm90IHVwZGF0ZWQgd2l0aCB0aGlzIG1ldGhvZC5cbiAgICogV2hlbiBkb25lLCB0aGUgdGltZWxpbmUgdHJpZ2dlcnMgYSBgdXBkYXRlOmNvbnRhaW5lcnNgIGV2ZW50LlxuICAgKi9cbiAgdXBkYXRlQ29udGFpbmVyKC8qIHRyYWNrT3JUcmFja0lkcyAqLykge1xuICAgIHRoaXMuZm9yRWFjaCgodHJhY2spID0+IHRyYWNrLnVwZGF0ZUNvbnRhaW5lcigpKTtcbiAgICB0aGlzLl90aW1lbGluZS5lbWl0KCd1cGRhdGU6Y29udGFpbmVycycpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgYWxsIGxheWVycy4gV2hlbiBkb25lLCB0aGUgdGltZWxpbmUgdHJpZ2dlcnMgYSBgdXBkYXRlOmxheWVyc2AgZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7TGF5ZXJ8U3RyaW5nfSBsYXllck9yR3JvdXAgLSBGaWx0ZXIgdGhlIGxheWVycyB0byB1cGRhdGUgYnlcbiAgICogICAgcGFzc2luZyB0aGUgYExheWVyYCBpbnN0YW5jZSB0byB1cGRhdGUgb3IgYSBgZ3JvdXBJZGBcbiAgICovXG4gIHVwZGF0ZUxheWVycyhsYXllck9yR3JvdXApIHtcbiAgICBjb25zdCBsYXllcnMgPSB0aGlzLl9nZXRMYXllcnNPckdyb3VwcyhsYXllck9yR3JvdXApO1xuICAgIHRoaXMuZm9yRWFjaCgodHJhY2spID0+IHRyYWNrLnVwZGF0ZUxheWVycyhsYXllcnMpKTtcbiAgICB0aGlzLl90aW1lbGluZS5lbWl0KCd1cGRhdGU6bGF5ZXJzJywgbGF5ZXJzKTtcbiAgfVxufVxuIiwiaW1wb3J0IG5zIGZyb20gJy4vbmFtZXNwYWNlJztcblxuXG4vKipcbiAqIEFjdHMgYXMgYSBwbGFjZWhvbGRlciB0byBvcmdhbml6ZSB0aGUgdmVydGljYWwgbGF5b3V0IG9mIHRoZSB2aXN1YWxpemF0aW9uXG4gKiBhbmQgdGhlIGhvcml6b250YWwgYWxpZ25lbWVudCB0byBhbiBhYnNjaXNzYSB0aGF0IGNvcnJlc3BvbmQgdG8gYSBjb21tb25cbiAqIHRpbWUgcmVmZXJlbmNlLiBJdCBiYXNpY2FsbHkgb2ZmZXIgYSB2aWV3IG9uIHRoZSBvdmVyYWxsIHRpbWVsaW5lLlxuICpcbiAqIFRyYWNrcyBhcmUgaW5zZXJ0ZWQgaW50byBhIGdpdmVuIERPTSBlbGVtZW50LCBhbGxvd2luZyB0byBjcmVhdGUgREFXIGxpa2VcbiAqIHJlcHJlc2VudGF0aW9ucy4gRWFjaCBgVHJhY2tgIGluc3RhbmNlIGNhbiBob3N0IG11bHRpcGxlIGBMYXllcmAgaW5zdGFuY2VzLlxuICogQSB0cmFjayBtdXN0IGJlIGFkZGVkIHRvIGEgdGltZWxpbmUgYmVmb3JlIGJlaW5nIHVwZGF0ZWQuXG4gKlxuICogIyMjIEEgdGltZWxpbmUgd2l0aCAzIHRyYWNrczpcbiAqXG4gKiBgYGBcbiAqIDAgICAgICAgICAgICAgICAgIDYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMTZcbiAqICstIC0gLSAtIC0gLSAtIC0gLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0gLSAtIC0gLSAtIC1cbiAqIHwgICAgICAgICAgICAgICAgIHx4IHRyYWNrIDEgeHh4eHh4eHh4eHh4eHh4eHh4eHh4fFxuICogKy0gLSAtIC0gLSAtIC0gLSAtKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLSAtIC0gLSAtIC0gLVxuICogfCAgICAgICAgICAgICAgICAgfHggdHJhY2sgMiB4eHh4eHh4eHh4eHh4eHh4eHh4eHh8XG4gKiArLSAtIC0gLSAtIC0gLSAtIC0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstIC0gLSAtIC0gLSAtXG4gKiB8ICAgICAgICAgICAgICAgICB8eCB0cmFjayAzIHh4eHh4eHh4eHh4eHh4eHh4eHh4eHxcbiAqICstIC0gLSAtIC0gLSAtIC0gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0gLSAtIC0gLSAtIC1cbiAqICstLS0tLS0tLS0tLS0tLS0tLT5cbiAqIHRpbWVsaW5lLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRpbWVsaW5lLnRpbWVDb250ZXh0Lm9mZnNldClcbiAqXG4gKiAgICAgICAgICAgICAgICAgICA8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT5cbiAqICAgICAgICAgICAgICAgICAgIHRpbWVsaW5lJ3MgdHJhY2tzIGRlZmF1bHRzIHRvIDEwMDBweFxuICogICAgICAgICAgICAgICAgICAgd2l0aCBhIGRlZmF1bHQgcGl4ZWxzUGVyU2Vjb25kIG9mIDEwMHB4L3MuXG4gKiAgICAgICAgICAgICAgICAgICBhbmQgYSBkZWZhdWx0IGBzdHJldGNoUmF0aW8gPSAxYFxuICogICAgICAgICAgICAgICAgICAgdHJhY2sxIHNob3dzIDEwIHNlY29uZHMgb2YgdGhlIHRpbWVsaW5lXG4gKiBgYGBcbiAqXG4gKiAjIyMgVHJhY2sgRE9NIHN0cnVjdHVyZVxuICpcbiAqIGBgYGh0bWxcbiAqIDxzdmcgd2lkdGg9XCIke3Zpc2libGVXaWR0aH1cIj5cbiAqICAgPCEtLSBiYWNrZ3JvdW5kIC0tPlxuICogICA8cmVjdD48cmVjdD5cbiAqICAgPCEtLSBtYWluIHZpZXcgLS0+XG4gKiAgIDxnIGNsYXNzPVwib2Zmc2V0XCIgdHJhbnNmb3JtPVwidHJhbnNsYXRlKCR7b2Zmc2V0fSwgMClcIj5cbiAqICAgICA8ZyBjbGFzcz1cImxheW91dFwiPlxuICogICAgICAgPCEtLSBsYXllcnMgLS0+XG4gKiAgICAgPC9nPlxuICogICA8L2c+XG4gKiAgIDxnIGNsYXNzPVwiaW50ZXJhY3Rpb25zXCI+PCEtLSBmb3IgZmVlZGJhY2sgLS0+PC9nPlxuICogPC9zdmc+XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2sge1xuICAvKipcbiAgICogQHBhcmFtIHtET01FbGVtZW50fSAkZWxcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtoZWlnaHQgPSAxMDBdXG4gICAqL1xuICBjb25zdHJ1Y3RvcigkZWwsIGhlaWdodCA9IDEwMCkge1xuICAgIHRoaXMuX2hlaWdodCA9IGhlaWdodDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBET00gZWxlbWVudCBpbiB3aGljaCB0aGUgdHJhY2sgaXMgY3JlYXRlZC5cbiAgICAgKiBAdHlwZSB7RWxlbWVudH1cbiAgICAgKi9cbiAgICB0aGlzLiRlbCA9ICRlbDtcbiAgICAvKipcbiAgICAgKiBBIHBsYWNlaG9sZGVyIHRvIGFkZCBzaGFwZXMgZm9yIGludGVyYWN0aW9ucyBmZWVkYmFjay5cbiAgICAgKiBAdHlwZSB7RWxlbWVudH1cbiAgICAgKi9cbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7RWxlbWVudH0gKi9cbiAgICB0aGlzLiRsYXlvdXQgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7RWxlbWVudH0gKi9cbiAgICB0aGlzLiRvZmZzZXQgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7RWxlbWVudH0gKi9cbiAgICB0aGlzLiRzdmcgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7RWxlbWVudH0gKi9cbiAgICB0aGlzLiRiYWNrZ3JvdW5kID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEFuIGFycmF5IG9mIGFsbCB0aGUgbGF5ZXJzIGJlbG9uZ2luZyB0byB0aGUgdHJhY2suXG4gICAgICogQHR5cGUge0FycmF5PExheWVyPn1cbiAgICAgKi9cbiAgICB0aGlzLmxheWVycyA9IFtdO1xuICAgIC8qKlxuICAgICAqIFRoZSBjb250ZXh0IHVzZWQgdG8gbWFpbnRhaW4gdGhlIERPTSBzdHJ1Y3R1cmUgb2YgdGhlIHRyYWNrLlxuICAgICAqIEB0eXBlIHtUaW1lbGluZVRpbWVDb250ZXh0fVxuICAgICAqL1xuICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dCA9IG51bGw7XG5cbiAgICB0aGlzLl9jcmVhdGVDb250YWluZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgb2YgdGhlIHRyYWNrLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IGhlaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGhlaWdodCBvZiB0aGUgdHJhY2suXG4gICAqXG4gICAqIEB0b2RvIHByb3BhZ2F0ZSB0byBsYXllcnMsIGtlZXBpbmcgcmF0aW8/IGNvdWxkIGJlIGhhbmR5IGZvciB2ZXJ0aWNhbFxuICAgKiAgICByZXNpemUuIFRoaXMgaXMgd2h5IGEgc2V0L2dldCBpcyBpbXBsZW1lbnRlZCBoZXJlLlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgIHRoaXMuX2hlaWdodCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCB3aGVuIHRoZSB0cmFjayBpcyBhZGRlZCB0byB0aGUgdGltZWxpbmUuIFRoZVxuICAgKiB0cmFjayBjYW5ub3QgYmUgdXBkYXRlZCB3aXRob3V0IGJlaW5nIGFkZGVkIHRvIGEgdGltZWxpbmUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7VGltZWxpbmVUaW1lQ29udGV4dH0gcmVuZGVyaW5nQ29udGV4dFxuICAgKi9cbiAgY29uZmlndXJlKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQgPSByZW5kZXJpbmdDb250ZXh0O1xuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgdGhlIHRyYWNrLiBUaGUgbGF5ZXJzIGZyb20gdGhpcyB0cmFjayBjYW4gc3RpbGwgYmUgcmV1c2VkIGVsc2V3aGVyZS5cbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgLy8gRGV0YWNoIGV2ZXJ5dGhpbmcgZnJvbSB0aGUgRE9NXG4gICAgdGhpcy4kZWwucmVtb3ZlQ2hpbGQodGhpcy4kc3ZnKTtcbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4gdGhpcy4kbGF5b3V0LnJlbW92ZUNoaWxkKGxheWVyLiRlbCkpO1xuICAgIC8vIGNsZWFuIHJlZmVyZW5jZXNcbiAgICB0aGlzLiRlbCA9IG51bGw7XG4gICAgdGhpcy5yZW5kZXJpbmdDb250ZXh0ID0gbnVsbDtcbiAgICB0aGlzLmxheWVycy5sZW5ndGggPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIERPTSBzdHJ1Y3R1cmUgb2YgdGhlIHRyYWNrLlxuICAgKi9cbiAgX2NyZWF0ZUNvbnRhaW5lcigpIHtcbiAgICBjb25zdCAkc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnc3ZnJyk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ29wdGltaXplU3BlZWQnKTtcbiAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCB0aGlzLmhlaWdodCk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGUoJ3htbG5zOnhodG1sJywgJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnKTtcbiAgICAkc3ZnLmNsYXNzTGlzdC5hZGQoJ3RyYWNrJyk7XG5cbiAgICBjb25zdCAkYmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICAkYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICAkYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCAnMTAwJScpO1xuICAgICRiYWNrZ3JvdW5kLnN0eWxlLmZpbGxPcGFjaXR5ID0gMDtcbiAgICAvLyAkYmFja2dyb3VuZC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuXG4gICAgY29uc3QgJGRlZnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdkZWZzJyk7XG5cbiAgICBjb25zdCAkb2Zmc2V0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgJG9mZnNldEdyb3VwLmNsYXNzTGlzdC5hZGQoJ29mZnNldCcpO1xuXG4gICAgY29uc3QgJGxheW91dEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICRsYXlvdXRHcm91cC5jbGFzc0xpc3QuYWRkKCdsYXlvdXQnKTtcblxuICAgIGNvbnN0ICRpbnRlcmFjdGlvbnNHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAkaW50ZXJhY3Rpb25zR3JvdXAuY2xhc3NMaXN0LmFkZCgnaW50ZXJhY3Rpb25zJyk7XG5cbiAgICAkb2Zmc2V0R3JvdXAuYXBwZW5kQ2hpbGQoJGxheW91dEdyb3VwKTtcbiAgICAkc3ZnLmFwcGVuZENoaWxkKCRkZWZzKTtcbiAgICAkc3ZnLmFwcGVuZENoaWxkKCRiYWNrZ3JvdW5kKTtcbiAgICAkc3ZnLmFwcGVuZENoaWxkKCRvZmZzZXRHcm91cCk7XG4gICAgJHN2Zy5hcHBlbmRDaGlsZCgkaW50ZXJhY3Rpb25zR3JvdXApO1xuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKCRzdmcpO1xuICAgIC8vIHJlbW92ZXMgYWRkaXRpb25uYWwgaGVpZ2h0IGFkZGVkIHdobyBrbm93cyB3aHkuLi5cbiAgICB0aGlzLiRlbC5zdHlsZS5mb250U2l6ZSA9IDA7XG4gICAgLy8gZml4ZXMgb25lIG9mIHRoZSAobWFueSA/KSB3ZWlyZCBjYW52YXMgcmVuZGVyaW5nIGJ1Z3MgaW4gQ2hyb21lXG4gICAgdGhpcy4kZWwuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVooMCknO1xuXG4gICAgdGhpcy4kbGF5b3V0ID0gJGxheW91dEdyb3VwO1xuICAgIHRoaXMuJG9mZnNldCA9ICRvZmZzZXRHcm91cDtcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMgPSAkaW50ZXJhY3Rpb25zR3JvdXA7XG4gICAgdGhpcy4kc3ZnID0gJHN2ZztcbiAgICB0aGlzLiRiYWNrZ3JvdW5kID0gJGJhY2tncm91bmQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGxheWVyIHRvIHRoZSB0cmFjay5cbiAgICpcbiAgICogQHBhcmFtIHtMYXllcn0gbGF5ZXIgLSB0aGUgbGF5ZXIgdG8gYWRkIHRvIHRoZSB0cmFjay5cbiAgICovXG4gIGFkZChsYXllcikge1xuICAgIGNvbnNvbGUubG9nKGxheWVyKTtcbiAgICB0aGlzLmxheWVycy5wdXNoKGxheWVyKTtcbiAgICAvLyBDcmVhdGUgYSBkZWZhdWx0IHJlbmRlcmluZ0NvbnRleHQgZm9yIHRoZSBsYXllciBpZiBtaXNzaW5nXG4gICAgdGhpcy4kbGF5b3V0LmFwcGVuZENoaWxkKGxheWVyLiRlbCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGxheWVyIGZyb20gdGhlIHRyYWNrLiBUaGUgbGF5ZXIgY2FuIGJlIHJldXNlZCBlbHNld2hlcmUuXG4gICAqXG4gICAqIEBwYXJhbSB7TGF5ZXJ9IGxheWVyIC0gdGhlIGxheWVyIHRvIHJlbW92ZSBmcm9tIHRoZSB0cmFjay5cbiAgICovXG4gIHJlbW92ZShsYXllcikge1xuICAgIHRoaXMubGF5ZXJzLnNwbGljZSh0aGlzLmxheWVycy5pbmRleE9mKGxheWVyKSwgMSk7XG4gICAgLy8gUmVtb3ZlcyBsYXllciBmcm9tIGl0cyBjb250YWluZXJcbiAgICB0aGlzLiRsYXlvdXQucmVtb3ZlQ2hpbGQobGF5ZXIuJGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUZXN0cyBpZiBhIGdpdmVuIGVsZW1lbnQgYmVsb25ncyB0byB0aGUgdHJhY2suXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsXG4gICAqIEByZXR1cm4ge2Jvb2x9XG4gICAqL1xuICBoYXNFbGVtZW50KCRlbCkge1xuICAgIGRvIHtcbiAgICAgIGlmICgkZWwgPT09IHRoaXMuJGVsKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAkZWwgPSAkZWwucGFyZW50Tm9kZTtcbiAgICB9IHdoaWxlICgkZWwgIT09IG51bGwpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciBhbGwgdGhlIGxheWVycyBhZGRlZCB0byB0aGUgdHJhY2suXG4gICAqL1xuICByZW5kZXIoKSB7XG4gICAgZm9yIChsZXQgbGF5ZXIgb2YgdGhpcykgeyBsYXllci5yZW5kZXIoKTsgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHRyYWNrIERPTSBzdHJ1Y3R1cmUgYW5kIHVwZGF0ZXMgdGhlIGxheWVycy5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxMYXllcj59IFtsYXllcnM9bnVsbF0gLSBpZiBub3QgbnVsbCwgYSBzdWJzZXQgb2YgdGhlIGxheWVycyB0byB1cGRhdGUuXG4gICAqL1xuICB1cGRhdGUobGF5ZXJzID0gbnVsbCkge1xuICAgIHRoaXMudXBkYXRlQ29udGFpbmVyKCk7XG4gICAgdGhpcy51cGRhdGVMYXllcnMobGF5ZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB0cmFjayBET00gc3RydWN0dXJlLlxuICAgKi9cbiAgdXBkYXRlQ29udGFpbmVyKCkge1xuICAgIGNvbnN0ICRzdmcgPSB0aGlzLiRzdmc7XG4gICAgY29uc3QgJG9mZnNldCA9IHRoaXMuJG9mZnNldDtcbiAgICAvLyBTaG91bGQgYmUgaW4gc29tZSB1cGRhdGUgbGF5b3V0XG4gICAgY29uc3QgcmVuZGVyaW5nQ29udGV4dCA9IHRoaXMucmVuZGVyaW5nQ29udGV4dDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICBjb25zdCB3aWR0aCA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52aXNpYmxlV2lkdGgpO1xuICAgIGNvbnN0IG9mZnNldFggPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwocmVuZGVyaW5nQ29udGV4dC5vZmZzZXQpKTtcbiAgICBjb25zdCB0cmFuc2xhdGUgPSBgdHJhbnNsYXRlKCR7b2Zmc2V0WH0sIDApYDtcblxuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlld2JveCcsIGAwIDAgJHt3aWR0aH0gJHtoZWlnaHR9YCk7XG5cbiAgICAkb2Zmc2V0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGxheWVycy5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxMYXllcj59IFtsYXllcnM9bnVsbF0gLSBpZiBub3QgbnVsbCwgYSBzdWJzZXQgb2YgdGhlIGxheWVycyB0byB1cGRhdGUuXG4gICAqL1xuICB1cGRhdGVMYXllcnMobGF5ZXJzID0gbnVsbCkge1xuICAgIGxheWVycyA9IChsYXllcnMgPT09IG51bGwpID8gdGhpcy5sYXllcnMgOiBsYXllcnM7XG5cbiAgICBsYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGlmICh0aGlzLmxheWVycy5pbmRleE9mKGxheWVyKSA9PT0gLTEpIHsgcmV0dXJuOyB9XG4gICAgICBsYXllci51cGRhdGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlcyB0aHJvdWdoIHRoZSBhZGRlZCBsYXllcnMuXG4gICAqL1xuICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgeWllbGQqIHRoaXMubGF5ZXJzW1N5bWJvbC5pdGVyYXRvcl0oKTtcbiAgfVxufVxuIiwiaW1wb3J0IEFubm90YXRlZE1hcmtlciBmcm9tICcuLi9zaGFwZXMvYW5ub3RhdGVkLW1hcmtlcic7XG5pbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgTWFya2VyQmVoYXZpb3IgZnJvbSAnLi4vYmVoYXZpb3JzL21hcmtlci1iZWhhdmlvcic7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgYW5ub3RhdGVkIG1hcmtlciBsYXllclxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLW1hcmtlci5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbm5vdGF0ZWRNYXJrZXJMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGRhdGEgLSBUaGUgZGF0YSB0byByZW5kZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqIEB0b2RvIC0gQWRkIGFjY2Vzc29ycyBhbmQgb3B0aW9ucyBmb3IgdGhlIHNoYXBlLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoJ2NvbGxlY3Rpb24nLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoQW5ub3RhdGVkTWFya2VyKTtcbiAgICB0aGlzLnNldEJlaGF2aW9yKG5ldyBNYXJrZXJCZWhhdmlvcigpKTtcbiAgfVxufVxuIiwiaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IEFubm90YXRlZFNlZ21lbnQgZnJvbSAnLi4vc2hhcGVzL2Fubm90YXRlZC1zZWdtZW50JztcbmltcG9ydCBTZWdtZW50QmVoYXZpb3IgZnJvbSAnLi4vYmVoYXZpb3JzL3NlZ21lbnQtYmVoYXZpb3InO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIGFubm90YXRlZCBzZWdtZW50IGxheWVyLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLXNlZ21lbnQuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5ub3RhdGVkU2VnbWVudExheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtBcnJheX0gZGF0YSAtIFRoZSBkYXRhIHRvIHJlbmRlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBBbiBvYmplY3QgdG8gY29uZmlndXJlIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtPYmplY3R9IGFjY2Vzc29ycyAtIFRoZSBhY2Nlc3NvcnMgdG8gY29uZmlndXJlIHRoZSBtYXBwaW5nXG4gICAqICAgIGJldHdlZW4gc2hhcGVzIGFuZCBkYXRhLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YSwgb3B0aW9ucyA9IHt9LCBhY2Nlc3NvcnMgPSB7fSkge1xuICAgIHN1cGVyKCdjb2xsZWN0aW9uJywgZGF0YSwgb3B0aW9ucyk7XG5cbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBkaXNwbGF5SGFuZGxlcnM6IHRydWUsXG4gICAgICBvcGFjaXR5OiAwLjZcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoQW5ub3RhdGVkU2VnbWVudCwgYWNjZXNzb3JzLCB7XG4gICAgICBkaXNwbGF5SGFuZGxlcnM6IG9wdGlvbnMuZGlzcGxheUhhbmRsZXJzLFxuICAgICAgb3BhY2l0eTogb3B0aW9ucy5vcGFjaXR5LFxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRCZWhhdmlvcihuZXcgU2VnbWVudEJlaGF2aW9yKCkpO1xuICB9XG59XG4iLCJpbXBvcnQgQnJlYWtwb2ludEJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9icmVha3BvaW50LWJlaGF2aW9yJztcbmltcG9ydCBEb3QgZnJvbSAnLi4vc2hhcGVzL2RvdCc7XG5pbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgTGluZSBmcm9tICcuLi9zaGFwZXMvbGluZSc7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgYnJlYWtwb2ludCBmdW5jdGlvbiBsYXllci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1icmVha3BvaW50Lmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJyZWFrcG9pbnRMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGRhdGEgLSBUaGUgZGF0YSB0byByZW5kZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhY2Nlc3NvcnMgLSBUaGUgYWNjZXNzb3JzIHRvIGNvbmZpZ3VyZSB0aGUgbWFwcGluZ1xuICAgKiAgICBiZXR3ZWVuIHNoYXBlcyBhbmQgZGF0YS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSwgYWNjZXNzb3JzID0ge30pIHtcbiAgICBzdXBlcignY29sbGVjdGlvbicsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgY29sb3IgPSBvcHRpb25zLmNvbG9yO1xuICAgIGxldCBjb21tb25TaGFwZU9wdGlvbnMgPSB7fTtcblxuICAgIGlmIChjb2xvcikge1xuICAgICAgYWNjZXNzb3JzLmNvbG9yID0gZnVuY3Rpb24oKSB7IHJldHVybiBjb2xvcjsgfTtcbiAgICAgIGNvbW1vblNoYXBlT3B0aW9ucy5jb2xvciA9IGNvbG9yO1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlndXJlQ29tbW9uU2hhcGUoTGluZSwgYWNjZXNzb3JzLCBjb21tb25TaGFwZU9wdGlvbnMpO1xuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoRG90LCBhY2Nlc3NvcnMsIHt9KTtcbiAgICB0aGlzLnNldEJlaGF2aW9yKG5ldyBCcmVha3BvaW50QmVoYXZpb3IoKSk7XG4gIH1cbn1cbiIsImltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcbmltcG9ydCBDdXJzb3IgZnJvbSAnLi4vc2hhcGVzL2N1cnNvcic7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgY3Vyc29yIGxheWVyLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWN1cnNvci5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDdXJzb3JMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGNvbG9yOiAncmVkJyxcbiAgICAgIGhpdHRhYmxlOiBmYWxzZSwgLy8ga2luZCBvZiBwYXNzIHRocm91Z2ggbGF5ZXJcbiAgICB9O1xuXG4gICAgY29uc3QgZGF0YSA9IHsgY3VycmVudFBvc2l0aW9uOiAwIH07XG5cbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgc3VwZXIoJ2VudGl0eScsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShDdXJzb3IsIHsgeDogKGQpID0+IGQuY3VycmVudFBvc2l0aW9uIH0sIHtcbiAgICAgIGNvbG9yOiBvcHRpb25zLmNvbG9yXG4gICAgfSk7XG4gIH1cblxuICBzZXQgY3VycmVudFBvc2l0aW9uKHZhbHVlKSB7XG4gICAgdGhpcy5kYXRhWzBdLmN1cnJlbnRQb3NpdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhWzBdLmN1cnJlbnRQb3NpdGlvbjtcbiAgfVxufVxuIiwiaW1wb3J0IEF4aXNMYXllciBmcm9tICcuLi9heGlzL2F4aXMtbGF5ZXInO1xuaW1wb3J0IFRpY2tzIGZyb20gJy4uL3NoYXBlcy90aWNrcyc7XG5pbXBvcnQgZ3JpZEF4aXNHZW5lcmF0b3IgZnJvbSAnLi4vYXhpcy9ncmlkLWF4aXMtZ2VuZXJhdG9yJztcblxuXG4vKipcbiAqIEhlbHBlciB0byBjcmVhdGUgYSBncmlkIGxheWVyXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYXhpcy5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmlkQXhpc0xheWVyIGV4dGVuZHMgQXhpc0xheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgY29sb3I6ICdzdGVlbGJsdWUnLFxuICAgICAgYnBtOiA2MCxcbiAgICAgIHNpZ25hdHVyZTogJzQvNCdcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHN1cGVyKGdyaWRBeGlzR2VuZXJhdG9yKG9wdGlvbnMuYnBtLCBvcHRpb25zLnNpZ25hdHVyZSksIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShUaWNrcywge30sIHtcbiAgICAgIGNvbG9yOiBvcHRpb25zLmNvbG9yXG4gICAgfSk7XG4gIH1cbn0iLCJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgTWFya2VyIGZyb20gJy4uL3NoYXBlcy9tYXJrZXInO1xuaW1wb3J0IE1hcmtlckJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9tYXJrZXItYmVoYXZpb3InO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIG1hcmtlciBsYXllci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1icmVha3BvaW50Lmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcmtlckxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtBcnJheX0gZGF0YSAtIFRoZSBkYXRhIHRvIHJlbmRlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBBbiBvYmplY3QgdG8gY29uZmlndXJlIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtPYmplY3R9IGFjY2Vzc29ycyAtIFRoZSBhY2Nlc3NvcnMgdG8gY29uZmlndXJlIHRoZSBtYXBwaW5nXG4gICAqICAgIGJldHdlZW4gc2hhcGVzIGFuZCBkYXRhLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YSwgb3B0aW9ucyA9IHt9LCBhY2Nlc3NvcnMgPSB7fSkge1xuICAgIHN1cGVyKCdjb2xsZWN0aW9uJywgZGF0YSwgb3B0aW9ucyk7XG5cbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGRpc3BsYXlIYW5kbGVyczogdHJ1ZSB9LCBvcHRpb25zKTtcbiAgICBjb25zdCBjb2xvciA9IG9wdGlvbnMuY29sb3I7XG4gICAgaWYgKGNvbG9yKSB7XG4gICAgICBhY2Nlc3NvcnMuY29sb3IgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGNvbG9yOyB9O1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoTWFya2VyLCBhY2Nlc3NvcnMsIHtcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogb3B0aW9ucy5kaXNwbGF5SGFuZGxlcnNcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0QmVoYXZpb3IobmV3IE1hcmtlckJlaGF2aW9yKCkpO1xuICB9XG59XG4iLCJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgU2VnbWVudCBmcm9tICcuLi9zaGFwZXMvc2VnbWVudCc7XG5pbXBvcnQgU2VnbWVudEJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9zZWdtZW50LWJlaGF2aW9yJztcblxuXG4vKipcbiAqIEhlbHBlciB0byBjcmVhdGUgYSBzZWdtZW50IGxheWVyLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLXNlZ21lbnQuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VnbWVudExheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtBcnJheX0gZGF0YSAtIFRoZSBkYXRhIHRvIHJlbmRlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBBbiBvYmplY3QgdG8gY29uZmlndXJlIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtPYmplY3R9IGFjY2Vzc29ycyAtIFRoZSBhY2Nlc3NvcnMgdG8gY29uZmlndXJlIHRoZSBtYXBwaW5nXG4gICAqICAgIGJldHdlZW4gc2hhcGVzIGFuZCBkYXRhLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YSwgb3B0aW9ucyA9IHt9LCBhY2Nlc3NvcnMgPSB7fSkge1xuICAgIHN1cGVyKCdjb2xsZWN0aW9uJywgZGF0YSwgb3B0aW9ucyk7XG5cbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBkaXNwbGF5SGFuZGxlcnM6IHRydWUsXG4gICAgICBvcGFjaXR5OiAwLjZcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoU2VnbWVudCwgYWNjZXNzb3JzLCB7XG4gICAgICBkaXNwbGF5SGFuZGxlcnM6IG9wdGlvbnMuZGlzcGxheUhhbmRsZXJzLFxuICAgICAgb3BhY2l0eTogb3B0aW9ucy5vcGFjaXR5LFxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRCZWhhdmlvcihuZXcgU2VnbWVudEJlaGF2aW9yKCkpO1xuICB9XG59XG4iLCJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgVGlja3MgZnJvbSAnLi4vc2hhcGVzL3RpY2tzJztcblxuXG4vKipcbiAqIEhlbHBlciB0byBjcmVhdGUgYSB0aWNrIGxheWVyLiBDYW4gYmUgc2VlbiBhcyBhIGdyaWQgYXhpcyB3aXRoIHVzZXIgZGVmaW5lZCBkYXRhXG4gKiBvciBhcyBhIG1hcmtlciBsYXllciB3aXRoIGVudGl0eSBiYXNlZCBkYXRhLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWNrTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhIC0gVGhlIGRhdGEgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYWNjZXNzb3JzIC0gVGhlIGFjY2Vzc29ycyB0byBjb25maWd1cmUgdGhlIG1hcHBpbmdcbiAgICogICAgYmV0d2VlbiBzaGFwZXMgYW5kIGRhdGEuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zLCBhY2Nlc3NvcnMpIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG5cbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHN1cGVyKCdlbnRpdHknLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IGNvbmZpZyA9IG9wdGlvbnMuY29sb3IgPyB7IGNvbG9yOiBvcHRpb25zLmNvbG9yIH0gOiB1bmRlZmluZWQ7XG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShUaWNrcywgYWNjZXNzb3JzLCBjb25maWcpO1xuICB9XG59IiwiaW1wb3J0IEF4aXNMYXllciBmcm9tICcuLi9heGlzL2F4aXMtbGF5ZXInO1xuaW1wb3J0IFRpY2tzIGZyb20gJy4uL3NoYXBlcy90aWNrcyc7XG5pbXBvcnQgdGltZUF4aXNHZW5lcmF0b3IgZnJvbSAnLi4vYXhpcy90aW1lLWF4aXMtZ2VuZXJhdG9yJztcblxuXG4vKipcbiAqIEhlbHBlciB0byBjcmVhdGUgYSB0aW1lIGF4aXMgbGF5ZXJcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1heGlzLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVBeGlzTGF5ZXIgZXh0ZW5kcyBBeGlzTGF5ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBBbiBvYmplY3QgdG8gY29uZmlndXJlIHRoZSBsYXllci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGNvbG9yOiAnc3RlZWxibHVlJyB9LCBvcHRpb25zKTtcbiAgICBzdXBlcih0aW1lQXhpc0dlbmVyYXRvcigpLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoVGlja3MsIHt9LCB7XG4gICAgICBjb2xvcjogb3B0aW9ucy5jb2xvclxuICAgIH0pO1xuICB9XG59IiwiaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IFRyYWNlUGF0aCBmcm9tICcuLi9zaGFwZXMvdHJhY2UtcGF0aCc7XG5pbXBvcnQgVHJhY2VEb3RzIGZyb20gJy4uL3NoYXBlcy90cmFjZS1kb3RzJztcbmltcG9ydCBUcmFjZUJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy90cmFjZS1iZWhhdmlvcic7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgdHJhY2UgbGF5ZXIuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItdHJhY2UuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2VMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGRhdGEgLSBUaGUgZGF0YSB0byByZW5kZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhY2Nlc3NvcnMgLSBUaGUgYWNjZXNzb3JzIHRvIGNvbmZpZ3VyZSB0aGUgbWFwcGluZ1xuICAgKiAgICBiZXR3ZWVuIHNoYXBlcyBhbmQgZGF0YS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSwgYWNjZXNzb3JzID0ge30pIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGRpc3BsYXlEb3RzOiB0cnVlIH0sIG9wdGlvbnMpO1xuICAgIHN1cGVyKG9wdGlvbnMuZGlzcGxheURvdHMgPyAnY29sbGVjdGlvbicgOiAnZW50aXR5JywgZGF0YSwgb3B0aW9ucyk7XG5cbiAgICBjb25zdCBzaGFwZU9wdGlvbnMgPSB7fTtcbiAgICBpZiAob3B0aW9ucy5tZWFuQ29sb3IgIT09IHVuZGVmaW5lZCkgeyBzaGFwZU9wdGlvbnMubWVhbkNvbG9yID0gb3B0aW9ucy5tZWFuQ29sb3I7IH1cbiAgICBpZiAob3B0aW9ucy5yYW5nZUNvbG9yICE9PSB1bmRlZmluZWQpIHsgc2hhcGVPcHRpb25zLnJhbmdlQ29sb3IgPSBvcHRpb25zLnJhbmdlQ29sb3I7IH1cbiAgICBpZiAob3B0aW9ucy5kaXNwbGF5TWVhbiAhPT0gdW5kZWZpbmVkKSB7IHNoYXBlT3B0aW9ucy5kaXNwbGF5TWVhbiA9IG9wdGlvbnMuZGlzcGxheU1lYW47IH1cblxuICAgIGlmIChvcHRpb25zLmRpc3BsYXlEb3RzKSB7XG4gICAgICB0aGlzLmNvbmZpZ3VyZUNvbW1vblNoYXBlKFRyYWNlUGF0aCwgYWNjZXNzb3JzLCBzaGFwZU9wdGlvbnMpO1xuICAgICAgdGhpcy5jb25maWd1cmVTaGFwZShUcmFjZURvdHMsIGFjY2Vzc29ycywgc2hhcGVPcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb25maWd1cmVTaGFwZShUcmFjZVBhdGgsIGFjY2Vzc29ycywgc2hhcGVPcHRpb25zKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldEJlaGF2aW9yKG5ldyBUcmFjZUJlaGF2aW9yKCkpO1xuICB9XG59IiwiaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IFdhdmVmb3JtIGZyb20gJy4uL3NoYXBlcy93YXZlZm9ybSc7XG5cblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gIHlEb21haW46IFstMSwgMV0sXG4gIGNoYW5uZWw6IDAsXG4gIGNvbG9yOiAnc3RlZWxibHVlJyxcbiAgcmVuZGVyaW5nU3RyYXRlZ3k6ICdzdmcnXG59O1xuXG4vKipcbiAqIEhlbHBlciB0byBjcmVhdGUgYSB3YXZlZm9ybSBsYXllci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci13YXZlZm9ybS5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXZlZm9ybUxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtBdWRpb0J1ZmZlcn0gYnVmZmVyIC0gVGhlIGF1ZGlvIGJ1ZmZlciB0byBkaXNwbGF5LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKi9cbiAgY29uc3RydWN0b3IoYnVmZmVyLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIHN1cGVyKCdlbnRpdHknLCBidWZmZXIuZ2V0Q2hhbm5lbERhdGEob3B0aW9ucy5jaGFubmVsKSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKFdhdmVmb3JtLCB7fSwge1xuICAgICAgc2FtcGxlUmF0ZTogYnVmZmVyLnNhbXBsZVJhdGUsXG4gICAgICBjb2xvcjogb3B0aW9ucy5jb2xvcixcbiAgICAgIHJlbmRlcmluZ1N0cmF0ZWd5OiBvcHRpb25zLnJlbmRlcmluZ1N0cmF0ZWd5XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCBldmVudHMgZnJvbSAnZXZlbnRzJztcblxuXG4vKipcbiAqIEFic3RyYWN0IGNsYXNzIHRvIGV4dGVuZCB0byBjcmVhdGUgbmV3IHNvdXJjZXMgb2YgaW50ZXJhY3Rpb25zLlxuICogQSBgU3VyZmFjZWAgYW5kIGBLZXlib2FyZGAgZXZlbnQgc291cmNlcyBhcmUgcHJvdmlkZWQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50U291cmNlIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKCRlbCkge1xuICAgIHN1cGVyKCk7XG4gICAgLyoqXG4gICAgICogVGhlIGVsZW1lbnQgb24gd2hpY2ggdGhlIGxpc3RlbmVyIGlzIGFkZGVkXG4gICAgICogQHR5cGUge0VsZW1lbnR9XG4gICAgICovXG4gICAgdGhpcy4kZWwgPSAkZWw7XG5cbiAgICB0aGlzLl9iaW5kRXZlbnRzKCk7XG4gIH1cblxuICBfY3JlYXRlRXZlbnQodHlwZSwgZSkge31cblxuICBfYmluZEV2ZW50cygpIHt9XG59XG4iLCJpbXBvcnQgRXZlbnRTb3VyY2UgZnJvbSAnLi9ldmVudC1zb3VyY2UnO1xuaW1wb3J0IFdhdmVFdmVudCBmcm9tICcuL3dhdmUtZXZlbnQnO1xuXG5cbi8qKlxuICogQSBnbG9iYWwgZXZlbnQgc291cnZlIGZvciB0aGUga2V5Ym9hcmQuIE9ubHkgb25lIGluc3RhbmNlIG9mIHRoaXMgc291cmNlXG4gKiBjYW4gYmUgY3JlYXRlZC4gVGhlIGZpcnN0IGNyZWF0ZWQgdGltZWxpbmUgaW5zdGFuY2lhdGUgdGhlIHNpbmdsZXRvbiwgZWFjaFxuICogc3Vic2VxdWVudCBpbnN0YW5jaWF0aW9uIHJldHVybnMgdGhlIGZpcnN0IGNyZWF0ZWQgaW5zdGFuY2UuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEtleWJvYXJkIGV4dGVuZHMgRXZlbnRTb3VyY2Uge1xuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkZWwgLSBUaGUgZWxlbWVudCBvbiB3aGljaCB0byBpbnN0YWxsIHRoZSBsaXN0ZW5lci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCRlbCkge1xuICAgIC8vIGtpbmQgb2Ygc2luZ2xldG9uXG4gICAgaWYgKEtleWJvYXJkLl9pbnN0YW5jZSkgeyByZXR1cm4gS2V5Ym9hcmQuX2luc3RhbmNlOyB9XG5cbiAgICBzdXBlcigkZWwpO1xuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBzb3VyY2VcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuc291cmNlTmFtZSA9ICdrZXlib2FyZCc7XG5cbiAgICBLZXlib2FyZC5faW5zdGFuY2UgPSB0aGlzO1xuICB9XG5cbiAgX2NyZWF0ZUV2ZW50KHR5cGUsIGUpIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBXYXZlRXZlbnQodGhpcy5zb3VyY2VOYW1lLCB0eXBlLCBlKTtcblxuICAgIGV2ZW50LnNoaWZ0S2V5ID0gZS5zaGlmdEtleTtcbiAgICBldmVudC5jdHJsS2V5ID0gZS5jdHJsS2V5O1xuICAgIGV2ZW50LmFsdEtleSA9IGUuYWx0S2V5O1xuICAgIGV2ZW50Lm1ldGFLZXkgPSBlLm1ldGFLZXk7XG4gICAgZXZlbnQuY2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS5rZXlDb2RlKTtcblxuICAgIHJldHVybiBldmVudDtcbiAgfVxuXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIGNvbnN0IG9uS2V5RG93biA9IChlKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgna2V5ZG93bicsIGUpO1xuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25LZXlVcCA9IChlKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgna2V5dXAnLCBlKTtcbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfTtcblxuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleURvd24sIGZhbHNlKTtcbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIG9uS2V5VXAsIGZhbHNlKTtcbiAgfVxufVxuIiwiaW1wb3J0IEV2ZW50U291cmNlIGZyb20gJy4vZXZlbnQtc291cmNlJztcbmltcG9ydCBXYXZlRXZlbnQgZnJvbSAnLi93YXZlLWV2ZW50JztcblxuXG4vKipcbiAqIE5vcm1hbGl6ZXMgbW91c2UgdXNlciBpbnRlcmFjdGlvbnMgd2l0aCB0aGUgdGltZWxpbmUgdXBvbiB0aGUgRE9NXG4gKiBjb250YWluZXIgZWxlbWVudCBvZiBgVHJhY2tgIGluc3RhbmNlcy4gQXMgc29vbiBhcyBhIGB0cmFja2AgaXMgYWRkZWQgdG8gYVxuICogYHRpbWVsaW5lYCwgaXRzIGF0dGFjaGVkIGBTdXJmYWNlYCBpbnN0YW5jZSB3aWxsIGVtaXQgdGhlIG1vdXNlIGV2ZW50cy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3VyZmFjZSBleHRlbmRzIEV2ZW50U291cmNlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gZWwgLSBUaGUgRE9NIGVsZW1lbnQgdG8gbGlzdGVuLlxuICAgKiBAdG9kbyAtIEFkZCBzb21lIHBhZGRpbmcgdG8gdGhlIHN1cmZhY2UuXG4gICAqL1xuICBjb25zdHJ1Y3RvcigkZWwpIHtcbiAgICBzdXBlcigkZWwpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHNvdXJjZS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuc291cmNlTmFtZSA9ICdzdXJmYWNlJztcbiAgICB0aGlzLl9tb3VzZURvd25FdmVudCA9IG51bGw7XG4gICAgdGhpcy5fbGFzdEV2ZW50ID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGYWN0b3J5IG1ldGhvZCBmb3IgYEV2ZW50YCBjbGFzc1xuICAgKi9cbiAgX2NyZWF0ZUV2ZW50KHR5cGUsIGUpIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBXYXZlRXZlbnQodGhpcy5zb3VyY2VOYW1lLCB0eXBlLCBlKTtcblxuICAgIGNvbnN0IHBvcyA9IHRoaXMuX2dldFJlbGF0aXZlUG9zaXRpb24oZSk7XG4gICAgZXZlbnQueCA9IHBvcy54O1xuICAgIGV2ZW50LnkgPSBwb3MueTtcblxuICAgIHJldHVybiBldmVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB4LCB5IGNvb3JkaW5hdGVzIGNvb3JkaW5hdGVzIHJlbGF0aXZlIHRvIHRoZSBzdXJmYWNlIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGUgLSBSYXcgZXZlbnQgZnJvbSBsaXN0ZW5lci5cbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKiBAdG9kbyAtIGhhbmRsZSBwYWRkaW5nLlxuICAgKi9cbiAgX2dldFJlbGF0aXZlUG9zaXRpb24oZSkge1xuICAgIC8vIEBUT0RPOiBzaG91bGQgYmUgYWJsZSB0byBpZ25vcmUgcGFkZGluZ1xuICAgIGxldCB4ID0gMDtcbiAgICBsZXQgeSA9IDA7XG4gICAgY29uc3QgY2xpZW50UmVjdCA9IHRoaXMuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHNjcm9sbExlZnQgPSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdDtcbiAgICBjb25zdCBzY3JvbGxUb3AgID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuXG4gICAgLy8gQWRhcHRlZCBmcm9tIGh0dHA6Ly93d3cucXVpcmtzbW9kZS5vcmcvanMvZXZlbnRzX3Byb3BlcnRpZXMuaHRtbCNwb3NpdGlvblxuICAgIGlmIChlLnBhZ2VYIHx8IGUucGFnZVkpIHtcbiAgICAgIHggPSBlLnBhZ2VYO1xuICAgICAgeSA9IGUucGFnZVk7XG4gICAgfSBlbHNlIGlmIChlLmNsaWVudFggfHwgZS5jbGllbnRZKSB7XG4gICAgICAvLyBOb3JtYWxpemUgdG8gcGFnZVgsIHBhZ2VZXG4gICAgICB4ID0gZS5jbGllbnRYICsgc2Nyb2xsTGVmdDtcbiAgICAgIHkgPSBlLmNsaWVudFkgKyBzY3JvbGxUb3A7XG4gICAgfVxuXG4gICAgLy8gY2xpZW50UmVjdCByZWZlcnMgdG8gdGhlIGNsaWVudCwgbm90IHRvIHRoZSBwYWdlXG4gICAgeCA9IHggLSAoY2xpZW50UmVjdC5sZWZ0ICsgc2Nyb2xsTGVmdCk7XG4gICAgeSA9IHkgLSAoY2xpZW50UmVjdC50b3AgICsgc2Nyb2xsVG9wICk7XG5cbiAgICByZXR1cm4geyB4LCB5IH07XG4gIH1cblxuICBfZGVmaW5lQXJlYShlLCBtb3VzZURvd25FdmVudCwgbGFzdEV2ZW50KSB7XG4gICAgaWYgKCFtb3VzZURvd25FdmVudCB8fMKgIWxhc3RFdmVudCkgeyByZXR1cm47IH1cbiAgICBlLmR4ID0gZS54IC0gbGFzdEV2ZW50Lng7XG4gICAgZS5keSA9IGUueSAtIGxhc3RFdmVudC55O1xuXG4gICAgY29uc3QgbGVmdCA9IG1vdXNlRG93bkV2ZW50LnggPCBlLnggPyBtb3VzZURvd25FdmVudC54IDogZS54O1xuICAgIGNvbnN0IHRvcCAgPSBtb3VzZURvd25FdmVudC55IDwgZS55ID8gbW91c2VEb3duRXZlbnQueSA6IGUueTtcbiAgICBjb25zdCB3aWR0aCAgPSBNYXRoLmFicyhNYXRoLnJvdW5kKGUueCAtIG1vdXNlRG93bkV2ZW50LngpKTtcbiAgICBjb25zdCBoZWlnaHQgPSBNYXRoLmFicyhNYXRoLnJvdW5kKGUueSAtIG1vdXNlRG93bkV2ZW50LnkpKTtcblxuICAgIGUuYXJlYSA9IHsgbGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0IH07XG4gIH1cblxuICAvKipcbiAgICogS2VlcCB0aGlzIHByaXZhdGUgdG8gYXZvaWQgZG91YmxlIGV2ZW50IGJpbmRpbmcuIE1haW4gbG9naWMgb2YgdGhlIHN1cmZhY2VcbiAgICogaXMgaGVyZS4gU2hvdWxkIGJlIGV4dGVuZGVkIHdpdGggbmVlZGVkIGV2ZW50cyAobW91c2VlbnRlciwgbW91c2VsZWF2ZSxcbiAgICogd2hlZWwgLi4uKS5cbiAgICovXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIGNvbnN0IG9uTW91c2VEb3duID0gKGUpID0+IHtcbiAgICAgIC8vIEJ5IHJlbW92aW5nIHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gd2UgcHJldmVudCBieXBhc3NpbmcgdGhlIG1vdXNlbW92ZSBldmVudHMgY29taW5nIGZyb20gU1ZHIGluIEZpcmVmb3guXG4gICAgICB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICBjb25zdCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdtb3VzZWRvd24nLCBlKTtcblxuXG4gICAgICB0aGlzLl9tb3VzZURvd25FdmVudCA9IGV2ZW50O1xuICAgICAgdGhpcy5fbGFzdEV2ZW50ID0gZXZlbnQ7XG4gICAgICAvLyBSZWdpc3RlciBtb3VzZW1vdmUgYW5kIG1vdXNldXAgbGlzdGVuZXJzIG9uIHdpbmRvd1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlLCBmYWxzZSk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCwgZmFsc2UpO1xuXG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH07XG5cbiAgICBjb25zdCBvbk1vdXNlTW92ZSA9IChlKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnbW91c2Vtb3ZlJywgZSk7XG4gICAgICB0aGlzLl9kZWZpbmVBcmVhKGV2ZW50LCB0aGlzLl9tb3VzZURvd25FdmVudCwgdGhpcy5fbGFzdEV2ZW50KTtcbiAgICAgIC8vIFVwZGF0ZSBgbGFzdEV2ZW50YCBmb3IgbmV4dCBjYWxsXG4gICAgICB0aGlzLl9sYXN0RXZlbnQgPSBldmVudDtcblxuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25Nb3VzZVVwID0gKGUpID0+IHtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdtb3VzZXVwJywgZSk7XG4gICAgICB0aGlzLl9kZWZpbmVBcmVhKGV2ZW50LCB0aGlzLl9tb3VzZURvd25FdmVudCwgdGhpcy5fbGFzdEV2ZW50KTtcblxuXG4gICAgICB0aGlzLl9tb3VzZURvd25FdmVudCA9IG51bGw7XG4gICAgICB0aGlzLl9sYXN0RXZlbnQgPSBudWxsO1xuICAgICAgLy8gUmVtb3ZlIG1vdXNlbW92ZSBhbmQgbW91c2V1cCBsaXN0ZW5lcnMgb24gd2luZG93XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXApO1xuXG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH07XG5cbiAgICBjb25zdCBvbkNsaWNrID0gKGUpID0+IHtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdjbGljaycsIGUpO1xuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25EYmxDbGljayA9IChlKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnZGJsY2xpY2snLCBlKTtcbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfTtcblxuICAgIGNvbnN0IG9uTW91c2VPdmVyID0gKGUpID0+IHtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdtb3VzZW92ZXInLCBlKTtcbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfTtcblxuICAgIGNvbnN0IG9uTW91c2VPdXQgPSAoZSkgPT4ge1xuICAgICAgbGV0IGV2ZW50ID0gdGhpcy5fY3JlYXRlRXZlbnQoJ21vdXNlb3V0JywgZSk7XG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH07XG5cbiAgICAvLyBCaW5kIGNhbGxiYWNrc1xuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2VEb3duLCBmYWxzZSk7XG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrLCBmYWxzZSk7XG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBvbkRibENsaWNrLCBmYWxzZSk7XG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgb25Nb3VzZU92ZXIsIGZhbHNlKTtcbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIG9uTW91c2VPdXQsIGZhbHNlKTtcbiAgfVxufVxuIiwiLyoqXG4gKiBPYmplY3QgdGVtcGxhdGUgZm9yIGFsbCBldmVudHMuIEV2ZW50IHNvdXJjZXMgc2hvdWxkIHVzZSB0aGlzIGV2ZW50IHRlbXBsYXRlXG4gKiBpbiBvcmRlciB0byBrZWVwIGNvbnNpc3RlbmN5IHdpdGggZXhpc3Rpbmcgc291cmNlcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2F2ZUV2ZW50IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzb3VyY2UgLSBUaGUgbmFtZSBvZiB0aGUgc291cmNlIChga2V5Ym9hcmRgLCBgc3VyZmFjZWAsIC4uLikuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gVGhlIHR5cGUgb2YgdGhlIHNvdXJjZSAoYG1vdXNlZG93bmAsIGBrZXl1cGAsIC4uLikuXG4gICAqIEBwYXJhbSB7RXZlbnR9IG9yaWdpbmFsRXZlbnQgLSBUaGUgb3JpZ2luYWwgZXZlbnQgYXMgZW1pdHRlZCBieSB0aGUgYnJvd3Nlci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHNvdXJjZSwgdHlwZSwgb3JpZ2luYWxFdmVudCkge1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5vcmlnaW5hbEV2ZW50ID0gb3JpZ2luYWxFdmVudDtcblxuICAgIHRoaXMudGFyZ2V0ID0gb3JpZ2luYWxFdmVudC50YXJnZXQ7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gb3JpZ2luYWxFdmVudC5jdXJyZW50VGFyZ2V0O1xuICB9XG59XG4iLCJpbXBvcnQgTWFya2VyIGZyb20gJy4vbWFya2VyJztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIG1hcmtlciB3aXRoIGFubm90YXRpb24uXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItbWFya2VyLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFubm90YXRlZE1hcmtlciBleHRlbmRzIE1hcmtlciB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdhbm5vdGF0ZWQtbWFya2VyJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgbGV0IGxpc3QgPSBzdXBlci5fZ2V0QWNjZXNzb3JMaXN0KCk7XG4gICAgbGlzdC50ZXh0ID0gJ2RlZmF1bHQnO1xuICAgIHJldHVybiBsaXN0O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICB0aGlzLiRlbCA9IHN1cGVyLnJlbmRlcihyZW5kZXJpbmdDb250ZXh0KTtcbiAgICBjb25zdCBoZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcblxuICAgIHRoaXMuJGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICd0ZXh0Jyk7XG4gICAgdGhpcy4kbGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCA4KTtcbiAgICB0aGlzLiRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIDgpO1xuICAgIHRoaXMuJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgbWF0cml4KDEsIDAsIDAsIC0xLCAwLCAke2hlaWdodH0pYCk7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUuZm9udFNpemUgPSAnMTBweCc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUuZm9udEZhbWlseSA9ICdtb25vc3BhY2UnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLmNvbG9yID0gJyMyNDI0MjQnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLm1velVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJztcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbGFiZWwpO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgc3VwZXIudXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKTtcblxuICAgIGlmICh0aGlzLiRsYWJlbC5maXJzdENoaWxkKSB7XG4gICAgICB0aGlzLiRsYWJlbC5yZW1vdmVDaGlsZCh0aGlzLiRsYWJlbC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBjb25zdCAkdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMudGV4dChkYXR1bSkpO1xuICAgIHRoaXMuJGxhYmVsLmFwcGVuZENoaWxkKCR0ZXh0KTtcbiAgfVxufVxuIiwiaW1wb3J0IFNlZ21lbnQgZnJvbSAnLi9zZWdtZW50JztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIHNlZ21lbnQgd2l0aCBhbm5vdGF0aW9uLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLXNlZ21lbnQuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5ub3RhdGVkU2VnbWVudCBleHRlbmRzIFNlZ21lbnQge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnYW5ub3RhdGVkLXNlZ21lbnQnOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICBsZXQgbGlzdCA9IHN1cGVyLl9nZXRBY2Nlc3Nvckxpc3QoKTtcbiAgICBsaXN0LnRleHQgPSAnZGVmYXVsdCc7XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIHRoaXMuJGVsID0gc3VwZXIucmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpO1xuICAgIGNvbnN0IGhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuXG4gICAgdGhpcy4kbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3RleHQnKTtcbiAgICB0aGlzLiRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIDMpO1xuICAgIHRoaXMuJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgMTEpO1xuICAgIHRoaXMuJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgbWF0cml4KDEsIDAsIDAsIC0xLCAwLCAke2hlaWdodH0pYCk7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUuZm9udFNpemUgPSAnMTBweCc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUuZm9udEZhbWlseSA9ICdtb25vc3BhY2UnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLmNvbG9yID0gJyMyNDI0MjQnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLm1velVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJztcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbGFiZWwpO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgc3VwZXIudXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKTtcblxuICAgIGlmICh0aGlzLiRsYWJlbC5maXJzdENoaWxkKSB7XG4gICAgICB0aGlzLiRsYWJlbC5yZW1vdmVDaGlsZCh0aGlzLiRsYWJlbC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBjb25zdCAkdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMudGV4dChkYXR1bSkpO1xuICAgIHRoaXMuJGxhYmVsLmFwcGVuZENoaWxkKCR0ZXh0KTtcbiAgfVxufVxuIiwiaW1wb3J0IG5zIGZyb20gJy4uL2NvcmUvbmFtZXNwYWNlJztcblxuXG4vKipcbiAqIElzIGFuIGFic3RyYWN0IGNsYXNzIG9yIGludGVyZmFjZSB0byBiZSBvdmVycmlkZW4gaW4gb3JkZXIgdG8gZGVmaW5lIG5ld1xuICogc2hhcGVzLiBTaGFwZXMgZGVmaW5lIHRoZSB3YXkgYSBnaXZlbiBkYXR1bSBzaG91bGQgYmUgcmVuZGVyZWQsIHRoZXkgYXJlXG4gKiB0aGUgc21hbGxlc3QgdW5pdCBvZiByZW5kZXJpbmcgaW50byBhIHRpbWVsaW5lLlxuICpcbiAqIEFsbCB0aGUgbGlmZSBjeWNsZSBvZiBgU2hhcGVgIGluc3RhbmNlcyBpcyBoYW5kbGVkIGludG8gdGhlIGBMYXllcmAgaW5zdGFuY2VcbiAqIHRoZXkgYXJlIGF0dGFjaCB0by4gQXMgYSBjb25zZXF1ZW5jZSwgdGhleSBzaG91bGQgYmUgbWFpbmx5IGNvbnNpZGVyZWQgYXNcbiAqIHByaXZhdGUgb2JqZWN0cy4gVGhlIG9ubHkgcGxhY2UgdGhleSBzaG91bGQgYmUgaW50ZXJhY3RlZCB3aXRoIGlzIGluIGBCZWhhdmlvcmBcbiAqIGRlZmluaXRpb25zLCB0byB0ZXN0IHdoaWNoIGVsZW1lbnQgb2YgdGhlIHNoYXBlIGlzIHRoZSB0YXJnZXQgb2YgdGhlXG4gKiBpbnRlcmFjdGlvbiBhbmQgZGVmaW5lIHRoZSBpbnRlcmFjdGlvbiBhY2NvcmRpbmcgdG8gdGhhdCB0ZXN0LlxuICpcbiAqIERlcGVuZGluZyBvZiBpdHMgaW1wbGVtZW50YXRpb24gYSBgU2hhcGVgIGNhbiBiZSB1c2VkIGFsb25nIHdpdGggYGVudGl0eWAgb3JcbiAqIGBjb2xsZWN0aW9uYCBkYXRhIHR5cGUuIFNvbWUgc2hhcGVzIGFyZSB0aGVuIGNyZWF0ZWQgdG8gdXNlIGRhdGEgY29uc2lkZXJlZFxuICogYXMgYSBzaW5nbGUgZW50aXR5IChXYXZlZm9ybSwgVHJhY2VQYXRoLCBMaW5lKSwgd2hpbGUgb3RoZXJzIGFyZSBkZWZpbmVkIHRvXG4gKiBiZSB1c2VkIHdpdGggZGF0YSBzZWVuIGFzIGEgY29sbGVjdGlvbiwgZWFjaCBzaGFwZSByZW5kZXJpbmcgYSBzaW5nbGUgZW50cnlcbiAqIG9mIHRoZSBjb2xsZWN0aW9uLiBUaGUgc2hhcGVzIHdvcmtpbmcgd2l0aCBlbnRpdHkgdHlwZSBkYXRhIHNob3VsZCB0aGVyZWZvcmVcbiAqIGJlIHVzZWQgaW4gYW4gYGVudGl0eWAgY29uZmlndXJlZCBgTGF5ZXJgLiBOb3RlIHRoYXQgaWYgdGhleSBhcmUgcmVnaXN0ZXJlZFxuICogYXMgXCJjb21tb25TaGFwZVwiIGluIGEgYGNvbGxlY3Rpb25gIHR5cGUgYExheWVyYCwgdGhleSB3aWxsIGJlaGF2ZSB0aGUgZXhhY3RcbiAqIHNhbWUgd2F5LiBUaGVzZSBraW5kIG9mIHNoYXBlcyBhcmUgbm90ZWQ6IFwiZW50aXR5IHNoYXBlXCIuXG4gKlxuICogIyMjIEF2YWlsYWJsZSBgY29sbGVjdGlvbmAgc2hhcGVzOlxuICogLSBNYXJrZXIgLyBBbm5vdGF0ZWQgTWFya2VyXG4gKiAtIFNlZ21lbnQgLyBBbm5vdGF0ZWQgU2VnbWVudFxuICogLSBEb3RcbiAqIC0gVHJhY2VEb3RzXG4gKlxuICogIyMjIEF2YWlsYWJsZSBgZW50aXR5YCBzaGFwZXM6XG4gKiAtIExpbmVcbiAqIC0gVGljayAoZm9yIGF4aXMpXG4gKiAtIFdhdmVmb3JtXG4gKiAtIFRyYWNlUGF0aFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlU2hhcGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBvdmVycmlkZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIC8qKiBAdHlwZSB7RWxlbWVudH0gLSBTdmcgZWxlbWVudCB0byBiZSByZXR1cm5lZCBieSB0aGUgYHJlbmRlcmAgbWV0aG9kLiAqL1xuICAgIHRoaXMuJGVsID0gbnVsbDtcbiAgICAvKiogQHR5cGUge1N0cmluZ30gLSBTdmcgbmFtZXNwYWNlLiAqL1xuICAgIHRoaXMubnMgPSBucztcbiAgICAvKiogQHR5cGUge09iamVjdH0gLSBPYmplY3QgY29udGFpbmluZyB0aGUgZ2xvYmFsIHBhcmFtZXRlcnMgb2YgdGhlIHNoYXBlICovXG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9nZXREZWZhdWx0cygpLCBvcHRpb25zKTtcbiAgICAvLyBjcmVhdGUgYWNjZXNzb3JzIG1ldGhvZHMgYW5kIHNldCBkZWZhdWx0IGFjY2Vzc29yIGZ1bmN0aW9uc1xuICAgIGNvbnN0IGFjY2Vzc29ycyA9IHRoaXMuX2dldEFjY2Vzc29yTGlzdCgpO1xuICAgIHRoaXMuX2NyZWF0ZUFjY2Vzc29ycyhhY2Nlc3NvcnMpO1xuICAgIHRoaXMuX3NldERlZmF1bHRBY2Nlc3NvcnMoYWNjZXNzb3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBzaGFwZSBhbmQgY2xlYW4gcmVmZXJlbmNlcy4gSW50ZXJmYWNlIG1ldGhvZCBjYWxsZWQgZnJvbSB0aGUgYGxheWVyYC5cbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgLy8gdGhpcy5ncm91cCA9IG51bGw7XG4gICAgdGhpcy4kZWwgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gb3ZlcnJpZGUgd2hlbiBleHRlbmRpbmcgdGhpcyBiYXNlIGNsYXNzLiBUaGUgbWV0aG9kXG4gICAqIGlzIGNhbGxlZCBieSB0aGUgYExheWVyfnJlbmRlcmAgbWV0aG9kLiBSZXR1cm5zIHRoZSBuYW1lIG9mIHRoZSBzaGFwZSxcbiAgICogdXNlZCBhcyBhIGNsYXNzIGluIHRoZSBlbGVtZW50IGdyb3VwIChkZWZhdWx0cyB0byBgJ3NoYXBlJ2ApLlxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnc2hhcGUnOyB9XG5cbiAgLyoqXG4gICAqIEB0b2RvIG5vdCBpbXBsZW1lbnRlZFxuICAgKiBhbGxvdyB0byBpbnN0YWxsIGRlZnMgaW4gdGhlIHRyYWNrIHN2ZyBlbGVtZW50LiBTaG91bGQgYmUgY2FsbGVkIHdoZW5cbiAgICogYWRkaW5nIHRoZSBgTGF5ZXJgIHRvIHRoZSBgVHJhY2tgLlxuICAgKi9cbiAgLy8gc2V0U3ZnRGVmaW5pdGlvbihkZWZzKSB7fVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkZWZhdWx0cyBmb3IgZ2xvYmFsIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHNoYXBlLlxuICAgKiBAcHJvdGVjdGVkXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBvYmplY3Qgd2hlcmUga2V5cyBhcmUgdGhlIGFjY2Vzc29ycyBtZXRob2RzIG5hbWVzIHRvIGNyZWF0ZVxuICAgKiBhbmQgdmFsdWVzIGFyZSB0aGUgZGVmYXVsdCB2YWx1ZXMgZm9yIGVhY2ggZ2l2ZW4gYWNjZXNzb3IuXG4gICAqXG4gICAqIEBwcm90ZWN0ZWRcbiAgICogQHRvZG8gcmVuYW1lID9cbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHsgcmV0dXJuIHt9OyB9XG5cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCBjYWxsZWQgYnkgTGF5ZXIgd2hlbiBjcmVhdGluZyBhIHNoYXBlLiBJbnN0YWxsIHRoZVxuICAgKiBnaXZlbiBhY2Nlc3NvcnMgb24gdGhlIHNoYXBlLCBvdmVycmlkaW5nIHRoZSBkZWZhdWx0IGFjY2Vzc29ycy5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3Q8U3RyaW5nLCBmdW5jdGlvbj59IGFjY2Vzc29yc1xuICAgKi9cbiAgaW5zdGFsbChhY2Nlc3NvcnMpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gYWNjZXNzb3JzKSB7IHRoaXNba2V5XSA9IGFjY2Vzc29yc1trZXldOyB9XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJpYyBtZXRob2QgdG8gY3JlYXRlIGFjY2Vzc29ycy4gQWRkcyBnZXR0ZXJzIGVuIHNldHRlcnMgdG8gdGhlXG4gICAqIHByb3RvdHlwZSBpZiBub3QgYWxyZWFkeSBwcmVzZW50LlxuICAgKi9cbiAgX2NyZWF0ZUFjY2Vzc29ycyhhY2Nlc3NvcnMpIHtcbiAgICB0aGlzLl9hY2Nlc3NvcnMgPSB7fTtcbiAgICAvLyBhZGQgaXQgdG8gdGhlIHByb3RvdHlwZVxuICAgIGNvbnN0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpO1xuICAgIC8vIGNyZWF0ZSBhIGdldHRlciAvIHNldHRlciBmb3IgZWFjaCBhY2Nlc3NvcnNcbiAgICAvLyBzZXR0ZXIgOiBgdGhpcy54ID0gY2FsbGJhY2tgXG4gICAgLy8gZ2V0dGVyIDogYHRoaXMueChkYXR1bSlgXG4gICAgT2JqZWN0LmtleXMoYWNjZXNzb3JzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBpZiAocHJvdG8uaGFzT3duUHJvcGVydHkobmFtZSkpIHsgcmV0dXJuOyB9XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90bywgbmFtZSwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fYWNjZXNzb3JzW25hbWVdOyB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgICAgICB0aGlzLl9hY2Nlc3NvcnNbbmFtZV0gPSBmdW5jO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBmdW5jdGlvbiB0byBiZSB1c2VkIGFzIGEgZGVmYXVsdCBhY2Nlc3NvciBmb3IgZWFjaCBhY2Nlc29yc1xuICAgKi9cbiAgX3NldERlZmF1bHRBY2Nlc3NvcnMoYWNjZXNzb3JzKSB7XG4gICAgT2JqZWN0LmtleXMoYWNjZXNzb3JzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBjb25zdCBkZWZhdWx0VmFsdWUgPSBhY2Nlc3NvcnNbbmFtZV07XG4gICAgICBsZXQgYWNjZXNzb3IgPSBmdW5jdGlvbihkLCB2ID0gbnVsbCkge1xuICAgICAgICBpZiAodiA9PT0gbnVsbCkgeyByZXR1cm4gZFtuYW1lXSB8fCBkZWZhdWx0VmFsdWU7IH1cbiAgICAgICAgZFtuYW1lXSA9IHY7XG4gICAgICB9O1xuICAgICAgLy8gc2V0IGFjY2Vzc29yIGFzIHRoZSBkZWZhdWx0IG9uZVxuICAgICAgdGhpc1tuYW1lXSA9IGFjY2Vzc29yO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgY2FsbGVkIGJ5IGBMYXllcn5yZW5kZXJgLiBDcmVhdGVzIHRoZSBET00gc3RydWN0dXJlIG9mXG4gICAqIHRoZSBzaGFwZS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlbmRlcmluZ0NvbnRleHQgLSB0aGUgcmVuZGVyaW5nQ29udGV4dCBvZiB0aGUgbGF5ZXJcbiAgICogICAgd2hpY2ggb3ducyB0aGlzIHNoYXBlLlxuICAgKiBAcmV0dXJuIHtFbGVtZW50fSAtIHRoZSBET00gZWxlbWVudCB0byBpbnNlcnQgaW4gdGhlIGl0ZW0ncyBncm91cC5cbiAgICovXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7fVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIGNhbGxlZCBieSBgTGF5ZXJ+dXBkYXRlYC4gVXBkYXRlcyB0aGUgRE9NIHN0cnVjdHVyZSBvZiB0aGUgc2hhcGUuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZW5kZXJpbmdDb250ZXh0IC0gVGhlIGByZW5kZXJpbmdDb250ZXh0YCBvZiB0aGUgbGF5ZXJcbiAgICogICAgd2hpY2ggb3ducyB0aGlzIHNoYXBlLlxuICAgKiBAcGFyYW0ge09iamVjdHxBcnJheX0gZGF0dW0gLSBUaGUgZGF0dW0gYXNzb2NpYXRlZCB0byB0aGUgc2hhcGUuXG4gICAqL1xuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0pIHt9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gb3ZlcnJpZGUgY2FsbGVkIGJ5IGBMYXllcn5nZXRJdGVtc0luQXJlYWAuIERlZmluZXMgaWZcbiAgICogdGhlIHNoYXBlIGlzIGNvbnNpZGVyZWQgdG8gYmUgdGhlIGdpdmVuIGFyZWEuIEFyZ3VtZW50cyBhcmUgcGFzc2VkIGluIHBpeGVsIGRvbWFpbi5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlbmRlcmluZ0NvbnRleHQgLSB0aGUgcmVuZGVyaW5nQ29udGV4dCBvZiB0aGUgbGF5ZXIgd2hpY2hcbiAgICogICAgb3ducyB0aGlzIHNoYXBlLlxuICAgKiBAcGFyYW0ge09iamVjdHxBcnJheX0gZGF0dW0gLSBUaGUgZGF0dW0gYXNzb2NpYXRlZCB0byB0aGUgc2hhcGUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4MSAtIFRoZSB4IGNvbXBvbmVudCBvZiB0aGUgdG9wLWxlZnQgY29ybmVyIG9mIHRoZSBhcmVhIHRvIHRlc3QuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5MSAtIFRoZSB5IGNvbXBvbmVudCBvZiB0aGUgdG9wLWxlZnQgY29ybmVyIG9mIHRoZSBhcmVhIHRvIHRlc3QuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4MiAtIFRoZSB4IGNvbXBvbmVudCBvZiB0aGUgYm90dG9tLXJpZ2h0IGNvcm5lciBvZiB0aGUgYXJlYSB0byB0ZXN0LlxuICAgKiBAcGFyYW0ge051bWJlcn0geTIgLSBUaGUgeSBjb21wb25lbnQgb2YgdGhlIGJvdHRvbS1yaWdodCBjb3JuZXIgb2YgdGhlIGFyZWEgdG8gdGVzdC5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gLSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgaXMgY29uc2lkZXJlZCB0byBiZSBpbiB0aGUgZ2l2ZW4gYXJlYSwgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAqL1xuICBpbkFyZWEocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKSB7fVxufVxuIiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuaW1wb3J0IG5zIGZyb20gJy4uL2NvcmUvbmFtZXNwYWNlJztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIGN1cnNvci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1jdXJzb3IuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3Vyc29yIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ2N1cnNvcic7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IHg6IDAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29sb3I6ICcjMDAwMDAwJyxcbiAgICAgIG9wYWNpdHk6IDFcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2xpbmUnKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIDApO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5MScsIDApO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5MicsIHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0KTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcbiAgICB0aGlzLiRlbC5zdHlsZS5zdHJva2UgPSB0aGlzLnBhcmFtcy5jb2xvcjtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSkge1xuICAgIGNvbnN0IHggPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSkpICsgMC41O1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7eH0sIDApYCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGN1cnNvciBjYW5ub3QgYmUgc2VsZWN0ZWQuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IGZhbHNlXG4gICAqL1xuICBpbkFyZWEoKSB7IHJldHVybiBmYWxzZTsgfVxufVxuIiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuXG5cbi8qKlxuICogQSBzaGFwZSB0byBkaXNwbGF5IGEgZG90LlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWJyZWFrcG9pbnQuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG90IGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ2RvdCc7IH1cblxuICAvLyBAVE9ETyByZW5hbWUgOiBjb25mdXNpb24gYmV0d2VlbiBhY2Nlc3NvcnMgYW5kIG1ldGEtYWNjZXNzb3JzXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgY3g6IDAsIGN5OiAwLCByOiAzLCBjb2xvcjogJyMwMDAwMDAnwqB9O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLiRlbCkgeyByZXR1cm4gdGhpcy4kZWw7IH1cblxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdjaXJjbGUnKTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSkge1xuICAgIGNvbnN0IGN4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLmN4KGRhdHVtKSk7XG4gICAgY29uc3QgY3kgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLmN5KGRhdHVtKSk7XG4gICAgY29uc3QgciAgPSB0aGlzLnIoZGF0dW0pO1xuICAgIGNvbnN0IGNvbG9yID0gdGhpcy5jb2xvcihkYXR1bSk7XG5cbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke2N4fSwgJHtjeX0pYCk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3InLCByKTtcbiAgICB0aGlzLiRlbC5zdHlsZS5maWxsID0gY29sb3I7XG4gIH1cblxuICAvLyB4MSwgeDIsIHkxLCB5MiA9PiBpbiBwaXhlbCBkb21haW5cbiAgaW5BcmVhKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mikge1xuICAgIGNvbnN0IGN4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLmN4KGRhdHVtKSk7XG4gICAgY29uc3QgY3kgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLmN5KGRhdHVtKSk7XG5cbiAgICBpZiAoKGN4ID4geDEgJiYgY3ggPCB4MikgJiYgKGN5ID4geTEgJiYgY3kgPCB5MikpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuXG5cbi8qKlxuICogQSBzaGFwZSB0byBkaXNwbGF5IGEgbGluZS4gSXRzIG1haW4gdXNlIGlzIGFzIGNvbW1vbiBzaGFwZSB0byBjcmVhdGUgYVxuICogYnJlYWtwb2ludCB2aXN1YWxpemF0aW9uLiAoZW50aXR5IHNoYXBlKVxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWJyZWFrcG9pbnQuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluZSBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdsaW5lJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgY3g6IDAsIGN5OiAwIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHsgY29sb3I6ICcjMDAwMDAwJyB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncGF0aCcpO1xuICAgIC8vIHRoaXMuZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpIHtcbiAgICBkYXRhID0gZGF0YS5zbGljZSgwKTtcbiAgICBkYXRhLnNvcnQoKGEsIGIpID0+IHRoaXMuY3goYSkgPCB0aGlzLmN4KGIpID8gLTEgOiAxKTtcblxuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgdGhpcy5fYnVpbGRMaW5lKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpKTtcbiAgICB0aGlzLiRlbC5zdHlsZS5zdHJva2UgPSB0aGlzLnBhcmFtcy5jb2xvcjtcbiAgICB0aGlzLiRlbC5zdHlsZS5maWxsID0gJ25vbmUnO1xuXG4gICAgZGF0YSA9IG51bGw7XG4gIH1cblxuICAvLyBidWlsZHMgdGhlIGBwYXRoLmRgIGF0dHJpYnV0ZVxuICAvLyBAVE9ETyBjcmVhdGUgc29tZSBTaGFwZUhlbHBlciA/XG4gIF9idWlsZExpbmUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIGlmICghZGF0YS5sZW5ndGgpIHsgcmV0dXJuICcnOyB9XG4gICAgLy8gc29ydCBkYXRhXG4gICAgbGV0IGluc3RydWN0aW9ucyA9IGRhdGEubWFwKChkYXR1bSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMuY3goZGF0dW0pKTtcbiAgICAgIGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLmN5KGRhdHVtKSkgLSAwLjU7XG4gICAgICByZXR1cm4gYCR7eH0sJHt5fWA7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gJ00nICsgaW5zdHJ1Y3Rpb25zLmpvaW4oJ0wnKTtcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuXG5cbi8qKlxuICogQSBzaGFwZSB0byBkaXNwbGF5IGEgbWFya2VyLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLW1hcmtlci5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXJrZXIgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnbWFya2VyJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgeDogMCwgY29sb3I6ICcjZmYwMDAwJyB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoYW5kbGVyV2lkdGg6IDcsXG4gICAgICBoYW5kbGVySGVpZ2h0OiAxMCxcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogdHJ1ZSxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICBjb2xvcjogJ3JlZCcsXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuXG4gICAgY29uc3QgaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZycpO1xuICAgIHRoaXMuJGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2xpbmUnKTtcblxuICAgIC8vIGRyYXcgbGluZVxuICAgIHRoaXMuJGxpbmUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCAwKTtcbiAgICB0aGlzLiRsaW5lLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5MScsIDApO1xuICAgIHRoaXMuJGxpbmUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3kyJywgaGVpZ2h0KTtcbiAgICB0aGlzLiRsaW5lLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbGluZSk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZGlzcGxheUhhbmRsZXJzKSB7XG4gICAgICB0aGlzLiRoYW5kbGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdyZWN0Jyk7XG5cbiAgICAgIHRoaXMuJGhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCAtKCh0aGlzLnBhcmFtcy5oYW5kbGVyV2lkdGgpIC8gMiApKTtcbiAgICAgIHRoaXMuJGhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCByZW5kZXJpbmdDb250ZXh0LmhlaWdodCAtIHRoaXMucGFyYW1zLmhhbmRsZXJIZWlnaHQpO1xuICAgICAgdGhpcy4kaGFuZGxlci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB0aGlzLnBhcmFtcy5oYW5kbGVyV2lkdGgpO1xuICAgICAgdGhpcy4kaGFuZGxlci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgdGhpcy5wYXJhbXMuaGFuZGxlckhlaWdodCk7XG4gICAgICB0aGlzLiRoYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuXG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRoYW5kbGVyKTtcbiAgICB9XG5cbiAgICB0aGlzLiRlbC5zdHlsZS5vcGFjaXR5ID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSkge1xuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkYXR1bSkpIC0gMC41O1xuICAgIGNvbnN0IGNvbG9yID0gdGhpcy5jb2xvcihkYXR1bSk7XG5cbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3h9LCAwKWApO1xuICAgIHRoaXMuJGxpbmUuc3R5bGUuc3Ryb2tlID0gY29sb3I7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZGlzcGxheUhhbmRsZXJzKSB7XG4gICAgICB0aGlzLiRoYW5kbGVyLnN0eWxlLmZpbGwgPSBjb2xvcjtcbiAgICB9XG4gIH1cblxuICBpbkFyZWEocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgLy8gaGFuZGxlcnMgb25seSBhcmUgc2VsZWN0YWJsZVxuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkYXR1bSkpO1xuICAgIGNvbnN0IHNoYXBlWDEgPSB4IC0gKHRoaXMucGFyYW1zLmhhbmRsZXJXaWR0aCAtIDEpIC8gMjtcbiAgICBjb25zdCBzaGFwZVgyID0gc2hhcGVYMSArIHRoaXMucGFyYW1zLmhhbmRsZXJXaWR0aDtcbiAgICBjb25zdCBzaGFwZVkxID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQgLSB0aGlzLnBhcmFtcy5oYW5kbGVySGVpZ2h0O1xuICAgIGNvbnN0IHNoYXBlWTIgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcblxuICAgIGNvbnN0IHhPdmVybGFwID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oeDIsIHNoYXBlWDIpIC0gTWF0aC5tYXgoeDEsIHNoYXBlWDEpKTtcbiAgICBjb25zdCB5T3ZlcmxhcCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHkyLCBzaGFwZVkyKSAtIE1hdGgubWF4KHkxLCBzaGFwZVkxKSk7XG4gICAgY29uc3QgYXJlYSA9IHhPdmVybGFwICogeU92ZXJsYXA7XG5cbiAgICByZXR1cm4gYXJlYSA+IDA7XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIHNlZ21lbnQuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItc2VnbWVudC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWdtZW50IGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3NlZ21lbnQnOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyB4OiAwLCB5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAxLCBjb2xvcjogJyMwMDAwMDAnLCBvcGFjaXR5OiAxIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogdHJ1ZSxcbiAgICAgIGhhbmRsZXJXaWR0aDogMixcbiAgICAgIGhhbmRsZXJPcGFjaXR5OiAwLjgsXG4gICAgICBvcGFjaXR5OiAwLjZcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZycpO1xuXG4gICAgdGhpcy4kc2VnbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncmVjdCcpO1xuICAgIHRoaXMuJHNlZ21lbnQuY2xhc3NMaXN0LmFkZCgnc2VnbWVudCcpO1xuICAgIHRoaXMuJHNlZ21lbnQuc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG4gICAgdGhpcy4kc2VnbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcblxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJHNlZ21lbnQpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmRpc3BsYXlIYW5kbGVycykge1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3JlY3QnKTtcbiAgICAgIHRoaXMuJGxlZnRIYW5kbGVyLmNsYXNzTGlzdC5hZGQoJ2xlZnQnLCAnaGFuZGxlcicpO1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgdGhpcy5wYXJhbXMuaGFuZGxlcldpZHRoKTtcbiAgICAgIHRoaXMuJGxlZnRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLmhhbmRsZXJPcGFjaXR5O1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuc3R5bGUuY3Vyc29yID0gJ2V3LXJlc2l6ZSc7XG5cbiAgICAgIHRoaXMuJHJpZ2h0SGFuZGxlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncmVjdCcpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLmNsYXNzTGlzdC5hZGQoJ3JpZ2h0JywgJ2hhbmRsZXInKTtcbiAgICAgIHRoaXMuJHJpZ2h0SGFuZGxlci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB0aGlzLnBhcmFtcy5oYW5kbGVyV2lkdGgpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5oYW5kbGVyT3BhY2l0eTtcbiAgICAgIHRoaXMuJHJpZ2h0SGFuZGxlci5zdHlsZS5jdXJzb3IgPSAnZXctcmVzaXplJztcblxuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbGVmdEhhbmRsZXIpO1xuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kcmlnaHRIYW5kbGVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0pIHtcbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLngoZGF0dW0pKTtcbiAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy55KGRhdHVtKSk7XG5cbiAgICBjb25zdCB3aWR0aCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy53aWR0aChkYXR1bSkpO1xuICAgIGNvbnN0IGhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMuaGVpZ2h0KGRhdHVtKSk7XG4gICAgY29uc3QgY29sb3IgPSB0aGlzLmNvbG9yKGRhdHVtKTtcbiAgICBjb25zdCBvcGFjaXR5ID0gdGhpcy5vcGFjaXR5KGRhdHVtKTtcblxuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7eH0sICR7eX0pYCk7XG4gICAgdGhpcy4kZWwuc3R5bGUub3BhY2l0eSA9IG9wYWNpdHk7XG5cbiAgICB0aGlzLiRzZWdtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIE1hdGgubWF4KHdpZHRoLCAwKSk7XG4gICAgdGhpcy4kc2VnbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICB0aGlzLiRzZWdtZW50LnN0eWxlLmZpbGwgPSBjb2xvcjtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5kaXNwbGF5SGFuZGxlcnMpIHtcbiAgICAgIC8vIGRpc3BsYXkgaGFuZGxlcnNcbiAgICAgIHRoaXMuJGxlZnRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwgMCknKTtcbiAgICAgIHRoaXMuJGxlZnRIYW5kbGVyLnN0eWxlLmZpbGwgPSBjb2xvcjtcblxuICAgICAgY29uc3QgcmlnaHRIYW5kbGVyVHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgke3dpZHRoIC0gdGhpcy5wYXJhbXMuaGFuZGxlcldpZHRofSwgMClgO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCByaWdodEhhbmRsZXJUcmFuc2xhdGUpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnN0eWxlLmZpbGwgPSBjb2xvcjtcbiAgICB9XG4gIH1cblxuICBpbkFyZWEocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgY29uc3Qgc2hhcGVYMSA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSk7XG4gICAgY29uc3Qgc2hhcGVYMiA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSArIHRoaXMud2lkdGgoZGF0dW0pKTtcbiAgICBjb25zdCBzaGFwZVkxID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy55KGRhdHVtKSk7XG4gICAgY29uc3Qgc2hhcGVZMiA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMueShkYXR1bSkgKyB0aGlzLmhlaWdodChkYXR1bSkpO1xuXG4gICAgLy8gaHR0cDovL2pzZmlkZGxlLm5ldC91dGh5Wi8gLSBjaGVjayBvdmVybGFwaW5nIGFyZWFcbiAgICBjb25zdCB4T3ZlcmxhcCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHgyLCBzaGFwZVgyKSAtIE1hdGgubWF4KHgxLCBzaGFwZVgxKSk7XG4gICAgY29uc3QgeU92ZXJsYXAgPSBNYXRoLm1heCgwLCBNYXRoLm1pbih5Miwgc2hhcGVZMikgLSBNYXRoLm1heCh5MSwgc2hhcGVZMSkpO1xuICAgIGNvbnN0IGFyZWEgPSB4T3ZlcmxhcCAqIHlPdmVybGFwO1xuXG4gICAgcmV0dXJuIGFyZWEgPiAwO1xuICB9XG59XG4iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cbi8qKlxuICogS2luZCBvZiBNYXJrZXIgZm9yIGVudGl0eSBvcmllbnRlZCBkYXRhLiBVc2VmdWxsIHRvIGRpc3BsYXkgYSBncmlkLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWNrcyBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIF9nZXRDbGFzc05hbWUoKSB7XG4gICAgcmV0dXJuICd0aWNrJztcbiAgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgdGltZTogMCwgZm9jdXNlZDogdHJ1ZSwgbGFiZWw6ICcnIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbG9yOiAnc3RlZWxibHVlJyxcbiAgICAgIGZvY3VzZWRPcGFjaXR5OiAwLjgsXG4gICAgICBkZWZhdWx0T3BhY2l0eTogMC4zXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIHdoaWxlICh0aGlzLiRlbC5maXJzdENoaWxkKSB7XG4gICAgICB0aGlzLiRlbC5yZW1vdmVDaGlsZCh0aGlzLiRlbC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICBjb25zdCBsYXllckhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0OyAvLyB2YWx1ZVRvUGl4ZWwoMSk7XG5cbiAgICBkYXRhLmZvckVhY2goKGRhdHVtKSA9PiB7XG4gICAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWUoZGF0dW0pKTtcbiAgICAgIGNvbnN0IG9wYWNpdHkgPSB0aGlzLmZvY3VzZWQoZGF0dW0pID9cbiAgICAgICAgdGhpcy5wYXJhbXMuZm9jdXNlZE9wYWNpdHkgOiB0aGlzLnBhcmFtcy5kZWZhdWx0T3BhY2l0eTtcblxuICAgICAgY29uc3QgaGVpZ2h0ID0gbGF5ZXJIZWlnaHQ7XG5cbiAgICAgIGNvbnN0IHRpY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2xpbmUnKTtcbiAgICAgIHRpY2suY2xhc3NMaXN0LmFkZCgndGljaycpO1xuXG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4MScsIDApO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneDInLCAwKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3kxJywgMCk7XG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5MicsIGhlaWdodCk7XG5cbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnbm9uZScpO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMuY29sb3IpO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHt4fSwgMClgKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ29wYWNpdHknLCBvcGFjaXR5KTtcblxuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGljayk7XG5cbiAgICAgIGNvbnN0IGxhYmVsID0gdGhpcy5sYWJlbChkYXR1bSk7XG4gICAgICBpZiAobGFiZWwpIHtcbiAgICAgICAgY29uc3QgJGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICd0ZXh0Jyk7XG4gICAgICAgICRsYWJlbC5jbGFzc0xpc3QuYWRkKCdsYWJlbCcpO1xuICAgICAgICBjb25zdCAkdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGxhYmVsKTtcbiAgICAgICAgJGxhYmVsLmFwcGVuZENoaWxkKCR0ZXh0KTtcbiAgICAgICAgJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgbWF0cml4KDEsIDAsIDAsIC0xLCAke3ggKyAyfSwgJHtoZWlnaHQgKyAyfSlgKTtcbiAgICAgICAgLy8gZmlyZWZveCBwcm9ibGVtIGhlcmVcbiAgICAgICAgLy8gJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdhbGlnbm1lbnQtYmFzZWxpbmUnLCAndGV4dC1iZWZvcmUtZWRnZScpO1xuICAgICAgICAkbGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCAnMTAnKTtcblxuICAgICAgICAkbGFiZWwuc3R5bGUuZm9udFNpemUgPSAnMTBweCc7XG4gICAgICAgICRsYWJlbC5zdHlsZS5saW5lSGVpZ2h0ID0gJzEwcHgnO1xuICAgICAgICAkbGFiZWwuc3R5bGUuZm9udEZhbWlseSA9ICdtb25vc3BhY2UnO1xuICAgICAgICAkbGFiZWwuc3R5bGUuY29sb3IgPSAnIzY3Njc2Nyc7XG4gICAgICAgICRsYWJlbC5zdHlsZS5vcGFjaXR5ID0gMC45O1xuICAgICAgICAkbGFiZWwuc3R5bGUubW96VXNlclNlbGVjdCA9ICdub25lJztcbiAgICAgICAgJGxhYmVsLnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICAgICRsYWJlbC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuXG4gICAgICAgIC8vIGNvbnN0IGJnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdyZWN0Jyk7XG4gICAgICAgIC8vIGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsICcxMDAlJyk7XG4gICAgICAgIC8vIGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAnMTAwJScpO1xuICAgICAgICAvLyBiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICcjZmZmZmZmJyk7XG4gICAgICAgIC8vIGxhYmVsLmFwcGVuZENoaWxkKGJnKTtcblxuICAgICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCgkbGFiZWwpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuICB9XG59IiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuXG5cbi8qKlxuICogQSBzaGFwZSB0byBkaXNwbGF5IGRvdHMgaW4gYSB0cmFjZSB2aXN1YWxpemF0aW9uIChtZWFuIC8gcmFuZ2UpLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLXRyYWNlLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNlRG90cyBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICd0cmFjZS1kb3RzJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgeDogMCwgbWVhbjogMCwgcmFuZ2U6IDAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWVhblJhZGl1czogMyxcbiAgICAgIHJhbmdlUmFkaXVzOiAzLFxuICAgICAgbWVhbkNvbG9yOiAnIzIzMjMyMycsXG4gICAgICByYW5nZUNvbG9yOiAnc3RlZWxibHVlJ1xuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbCkgeyByZXR1cm4gdGhpcy4kZWw7IH1cbiAgICAvLyBjb250YWluZXJcbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZycpO1xuICAgIC8vIGRyYXcgbWVhbiBkb3RcbiAgICB0aGlzLiRtZWFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdjaXJjbGUnKTtcbiAgICB0aGlzLiRtZWFuLnNldEF0dHJpYnV0ZU5TKG51bGwsICdyJywgdGhpcy5wYXJhbXMubWVhblJhZGl1cyk7XG4gICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMubWVhbkNvbG9yKTtcbiAgICB0aGlzLiRtZWFuLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ3RyYW5zcGFyZW50Jyk7XG4gICAgdGhpcy4kbWVhbi5jbGFzc0xpc3QuYWRkKCdtZWFuJyk7XG4gICAgLy8gcmFuZ2UgZG90cyAoMCA9PiB0b3AsIDEgPT4gYm90dG9tKVxuICAgIHRoaXMuJG1heCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnY2lyY2xlJyk7XG4gICAgdGhpcy4kbWF4LnNldEF0dHJpYnV0ZU5TKG51bGwsICdyJywgdGhpcy5wYXJhbXMubWVhblJhZGl1cyk7XG4gICAgdGhpcy4kbWF4LnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5yYW5nZUNvbG9yKTtcbiAgICB0aGlzLiRtYXguc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAndHJhbnNwYXJlbnQnKTtcbiAgICB0aGlzLiRtYXguY2xhc3NMaXN0LmFkZCgnbWF4Jyk7XG5cbiAgICB0aGlzLiRtaW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2NpcmNsZScpO1xuICAgIHRoaXMuJG1pbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncicsIHRoaXMucGFyYW1zLm1lYW5SYWRpdXMpO1xuICAgIHRoaXMuJG1pbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMucmFuZ2VDb2xvcik7XG4gICAgdGhpcy4kbWluLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ3RyYW5zcGFyZW50Jyk7XG4gICAgdGhpcy4kbWluLmNsYXNzTGlzdC5hZGQoJ21pbicpO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbWVhbik7XG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbWF4KTtcbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRtaW4pO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgLy8gQFRPRE8gdXNlIGFjY2Vzc29yc1xuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0pIHtcbiAgICBjb25zdCBtZWFuID0gdGhpcy5tZWFuKGRhdHVtKTtcbiAgICBjb25zdCByYW5nZSA9IHRoaXMucmFuZ2UoZGF0dW0pO1xuICAgIGNvbnN0IHggPSB0aGlzLngoZGF0dW0pO1xuICAgIC8vIHkgcG9zaXRpb25zXG4gICAgY29uc3QgbWVhblBvcyA9IGAke3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKG1lYW4pfWA7XG4gICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke21lYW5Qb3N9KWApO1xuXG4gICAgY29uc3QgaGFsZlJhbmdlID0gcmFuZ2UgLyAyO1xuICAgIGNvbnN0IG1heCA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKG1lYW4gKyBoYWxmUmFuZ2UpO1xuICAgIGNvbnN0IG1pbiA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKG1lYW4gLSBoYWxmUmFuZ2UpO1xuICAgIGNvbnN0IHhQb3MgPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHgpO1xuXG4gICAgdGhpcy4kbWF4LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7bWF4fSlgKTtcbiAgICB0aGlzLiRtaW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHttaW59KWApO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7eFBvc30sIDApYCk7XG4gIH1cblxuICBpbkFyZWEocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSk7XG4gICAgY29uc3QgbWVhbiA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMubWVhbihkYXR1bSkpO1xuICAgIGNvbnN0IHJhbmdlID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy5yYW5nZShkYXR1bSkpO1xuICAgIGNvbnN0IG1pbiA9IG1lYW4gLSAocmFuZ2UgLyAyKTtcbiAgICBjb25zdCBtYXggPSBtZWFuICsgKHJhbmdlIC8gMik7XG5cbiAgICBpZiAoeCA+IHgxICYmIHggPCB4MiAmJiAobWluID4geTEgfHwgbWF4IDwgeTIpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBwYXRocyBpbiBhIHRyYWNlIHZpc3VhbGl6YXRpb24gKG1lYW4gLyByYW5nZSkuIChlbnRpdHkgc2hhcGUpXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItdHJhY2UuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2VQYXRoIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3RyYWNlLWNvbW1vbic7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IHg6IDAsIG1lYW46IDAsIHJhbmdlOiAwIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJhbmdlQ29sb3I6ICdzdGVlbGJsdWUnLFxuICAgICAgbWVhbkNvbG9yOiAnIzIzMjMyMycsXG4gICAgICBkaXNwbGF5TWVhbjogdHJ1ZVxuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbCkgeyByZXR1cm4gdGhpcy4kZWw7IH1cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZycpO1xuICAgIC8vIHJhbmdlIHBhdGhcbiAgICB0aGlzLiRyYW5nZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncGF0aCcpO1xuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJHJhbmdlKTtcblxuICAgIC8vIG1lYW4gbGluZVxuICAgIGlmICh0aGlzLnBhcmFtcy5kaXNwbGF5TWVhbikge1xuICAgICAgdGhpcy4kbWVhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncGF0aCcpO1xuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbWVhbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpIHtcbiAgICAvLyBvcmRlciBkYXRhIGJ5IHggcG9zaXRpb25cbiAgICBkYXRhID0gZGF0YS5zbGljZSgwKTtcbiAgICBkYXRhLnNvcnQoKGEsIGIpID0+IHRoaXMueChhKSA8IHRoaXMueChiKSA/IC0xIDogMSk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZGlzcGxheU1lYW4pIHtcbiAgICAgIHRoaXMuJG1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCB0aGlzLl9idWlsZE1lYW5MaW5lKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpKTtcbiAgICAgIHRoaXMuJG1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLm1lYW5Db2xvcik7XG4gICAgICB0aGlzLiRtZWFuLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcbiAgICB9XG5cbiAgICB0aGlzLiRyYW5nZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIHRoaXMuX2J1aWxkUmFuZ2Vab25lKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpKTtcbiAgICB0aGlzLiRyYW5nZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgJ25vbmUnKTtcbiAgICB0aGlzLiRyYW5nZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsIHRoaXMucGFyYW1zLnJhbmdlQ29sb3IpO1xuICAgIHRoaXMuJHJhbmdlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdvcGFjaXR5JywgJzAuNCcpO1xuXG4gICAgZGF0YSA9IG51bGw7XG4gIH1cblxuICBfYnVpbGRNZWFuTGluZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7XG4gICAgbGV0IGluc3RydWN0aW9ucyA9IGRhdGEubWFwKChkYXR1bSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkYXR1bSkpO1xuICAgICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMubWVhbihkYXR1bSkpO1xuICAgICAgcmV0dXJuIGAke3h9LCR7eX1gO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuICdNJyArIGluc3RydWN0aW9ucy5qb2luKCdMJyk7XG4gIH1cblxuICBfYnVpbGRSYW5nZVpvbmUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIGNvbnN0IGxlbmd0aCA9IGRhdGEubGVuZ3RoO1xuICAgIC8vIGNvbnN0IGxhc3RJbmRleCA9IGRhdGFcbiAgICBsZXQgaW5zdHJ1Y3Rpb25zU3RhcnQgPSAnJztcbiAgICBsZXQgaW5zdHJ1Y3Rpb25zRW5kID0gJyc7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBkYXR1bSA9IGRhdGFbaV07XG4gICAgICBjb25zdCBtZWFuID0gdGhpcy5tZWFuKGRhdHVtKTtcbiAgICAgIGNvbnN0IGhhbGZSYW5nZSA9IHRoaXMucmFuZ2UoZGF0dW0pIC8gMjtcblxuICAgICAgY29uc3QgeCAgPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkYXR1bSkpO1xuICAgICAgY29uc3QgeTAgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChtZWFuICsgaGFsZlJhbmdlKTtcbiAgICAgIGNvbnN0IHkxID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwobWVhbiAtIGhhbGZSYW5nZSk7XG5cbiAgICAgIGNvbnN0IHN0YXJ0ID0gYCR7eH0sJHt5MH1gO1xuICAgICAgY29uc3QgZW5kICAgPSBgJHt4fSwke3kxfWA7XG5cbiAgICAgIGluc3RydWN0aW9uc1N0YXJ0ID0gaW5zdHJ1Y3Rpb25zU3RhcnQgPT09ICcnID9cbiAgICAgICAgc3RhcnQgOiBgJHtpbnN0cnVjdGlvbnNTdGFydH1MJHtzdGFydH1gO1xuXG4gICAgICBpbnN0cnVjdGlvbnNFbmQgPSBpbnN0cnVjdGlvbnNFbmQgPT09ICcnID9cbiAgICAgICAgZW5kIDogYCR7ZW5kfUwke2luc3RydWN0aW9uc0VuZH1gO1xuICAgIH1cblxuICAgIGxldCBpbnN0cnVjdGlvbnMgPSBgTSR7aW5zdHJ1Y3Rpb25zU3RhcnR9TCR7aW5zdHJ1Y3Rpb25zRW5kfVpgO1xuICAgIHJldHVybiBpbnN0cnVjdGlvbnM7XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuXG5jb25zdCB4aHRtbE5TID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnO1xuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIHdhdmVmb3JtLiAoZm9yIGVudGl0eSBkYXRhKVxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLXdhdmVmb3JtLmh0bWwpXG4gKlxuICogQHRvZG8gLSBmaXggcHJvYmxlbXMgd2l0aCBjYW52YXMgc3RyYXRlZ3kuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhdmVmb3JtIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3dhdmVmb3JtJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgLy8gcmV0dXJuIHsgeTogMCB9O1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2FtcGxlUmF0ZTogNDQxMDAsXG4gICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIC8vIHJlbmRlcmluZ1N0cmF0ZWd5OiAnc3ZnJyAvLyBjYW52YXMgaXMgYnVnZ2VkICh0cmFuc2xhdGlvbiwgZXRjLi4uKVxuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbCkgeyByZXR1cm4gdGhpcy4kZWw7IH1cblxuICAgIC8vIGlmICh0aGlzLnBhcmFtcy5yZW5kZXJpbmdTdHJhdGVneSA9PT0gJ3N2ZycpIHtcblxuICAgICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3BhdGgnKTtcbiAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcbiAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLmNvbG9yKTtcbiAgICAgIHRoaXMuJGVsLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuXG4gICAgLy8gfSBlbHNlIGlmICh0aGlzLnBhcmFtcy5yZW5kZXJpbmdTdHJhdGVneSA9PT0gJ2NhbnZhcycpIHtcblxuICAgIC8vICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2ZvcmVpZ25PYmplY3QnKTtcbiAgICAvLyAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHJlbmRlcmluZ0NvbnRleHQud2lkdGgpO1xuICAgIC8vICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0KTtcblxuICAgIC8vICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHhodG1sTlMsICd4aHRtbDpjYW52YXMnKTtcblxuICAgIC8vICAgdGhpcy5fY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgLy8gICB0aGlzLl9jdHguY2FudmFzLndpZHRoID0gcmVuZGVyaW5nQ29udGV4dC53aWR0aDtcbiAgICAvLyAgIHRoaXMuX2N0eC5jYW52YXMuaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG5cbiAgICAvLyAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgLy8gfVxuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgLy8gZGVmaW5lIG5iciBvZiBzYW1wbGVzIHBlciBwaXhlbHNcbiAgICBjb25zdCBzbGljZU1ldGhvZCA9IGRhdHVtIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5ID8gJ3N1YmFycmF5JyA6ICdzbGljZSc7XG4gICAgY29uc3QgbmJyU2FtcGxlcyA9IGRhdHVtLmxlbmd0aDtcbiAgICBjb25zdCBkdXJhdGlvbiA9IG5iclNhbXBsZXMgLyB0aGlzLnBhcmFtcy5zYW1wbGVSYXRlO1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChkdXJhdGlvbik7XG4gICAgY29uc3Qgc2FtcGxlc1BlclBpeGVsID0gbmJyU2FtcGxlcyAvIHdpZHRoO1xuXG4gICAgaWYgKCFzYW1wbGVzUGVyUGl4ZWwgfHwgZGF0dW0ubGVuZ3RoIDwgc2FtcGxlc1BlclBpeGVsKSB7IHJldHVybjsgfVxuXG4gICAgLy8gY29tcHV0ZS9kcmF3IHZpc2libGUgYXJlYSBvbmx5XG4gICAgLy8gQFRPRE8gcmVmYWN0b3IgdGhpcyB1bnVuZGVyc3RhbmRhYmxlIG1lc3NcbiAgICBsZXQgbWluWCA9IE1hdGgubWF4KC1yZW5kZXJpbmdDb250ZXh0Lm9mZnNldFgsIDApO1xuICAgIGxldCB0cmFja0RlY2F5ID0gcmVuZGVyaW5nQ29udGV4dC50cmFja09mZnNldFggKyByZW5kZXJpbmdDb250ZXh0LnN0YXJ0WDtcbiAgICBpZiAodHJhY2tEZWNheSA8IDApIHsgbWluWCA9IC10cmFja0RlY2F5OyB9XG5cbiAgICBsZXQgbWF4WCA9IG1pblg7XG4gICAgbWF4WCArPSAocmVuZGVyaW5nQ29udGV4dC53aWR0aCAtIG1pblggPCByZW5kZXJpbmdDb250ZXh0LnZpc2libGVXaWR0aCkgP1xuICAgICAgcmVuZGVyaW5nQ29udGV4dC53aWR0aCA6IHJlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoO1xuXG4gICAgLy8gZ2V0IG1pbi9tYXggcGVyIHBpeGVscywgY2xhbXBlZCB0byB0aGUgdmlzaWJsZSBhcmVhXG4gICAgY29uc3QgaW52ZXJ0ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQ7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMucGFyYW1zLnNhbXBsZVJhdGU7XG4gICAgY29uc3QgbWluTWF4ID0gW107XG5cbiAgICBmb3IgKGxldCBweCA9IG1pblg7IHB4IDwgbWF4WDsgcHgrKykge1xuICAgICAgY29uc3Qgc3RhcnRUaW1lID0gaW52ZXJ0KHB4KTtcbiAgICAgIGNvbnN0IHN0YXJ0U2FtcGxlID0gc3RhcnRUaW1lICogc2FtcGxlUmF0ZTtcbiAgICAgIGNvbnN0IGV4dHJhY3QgPSBkYXR1bVtzbGljZU1ldGhvZF0oc3RhcnRTYW1wbGUsIHN0YXJ0U2FtcGxlICsgc2FtcGxlc1BlclBpeGVsKTtcblxuICAgICAgbGV0IG1pbiA9IEluZmluaXR5O1xuICAgICAgbGV0IG1heCA9IC1JbmZpbml0eTtcblxuICAgICAgZm9yIChsZXQgaiA9IDAsIGwgPSBleHRyYWN0Lmxlbmd0aDsgaiA8IGw7IGorKykge1xuICAgICAgICBsZXQgc2FtcGxlID0gZXh0cmFjdFtqXTtcbiAgICAgICAgaWYgKHNhbXBsZSA8IG1pbikgeyBtaW4gPSBzYW1wbGU7IH1cbiAgICAgICAgaWYgKHNhbXBsZSA+IG1heCkgeyBtYXggPSBzYW1wbGU7IH1cbiAgICAgIH1cbiAgICAgIC8vIGRpc2FsbG93IEluZmluaXR5XG4gICAgICBtaW4gPSAhaXNGaW5pdGUobWluKSA/IDAgOiBtaW47XG4gICAgICBtYXggPSAhaXNGaW5pdGUobWF4KSA/IDAgOiBtYXg7XG4gICAgICBpZiAobWluID09PSAwICYmIG1heCA9PT0gMCkgeyBjb250aW51ZTsgfVxuXG4gICAgICBtaW5NYXgucHVzaChbcHgsIG1pbiwgbWF4XSk7XG4gICAgfVxuXG4gICAgaWYgKCFtaW5NYXgubGVuZ3RoKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgUElYRUwgPSAwO1xuICAgIGNvbnN0IE1JTiAgID0gMTtcbiAgICBjb25zdCBNQVggICA9IDI7XG4gICAgY29uc3QgWkVSTyAgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCgwKTtcbiAgICAvLyByZW5kZXJpbmcgc3RyYXRlZ2llc1xuICAgIC8vIGlmICh0aGlzLnBhcmFtcy5yZW5kZXJpbmdTdHJhdGVneSA9PT0gJ3N2ZycpIHtcblxuICAgICAgbGV0IGluc3RydWN0aW9ucyA9IG1pbk1heC5tYXAoKGRhdHVtLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCB4ICA9IGRhdHVtW1BJWEVMXTtcbiAgICAgICAgbGV0IHkxID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChkYXR1bVtNSU5dKSk7XG4gICAgICAgIGxldCB5MiA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoZGF0dW1bTUFYXSkpO1xuICAgICAgICAvLyByZXR1cm4gYCR7eH0sJHtaRVJPfUwke3h9LCR7eTF9TCR7eH0sJHt5Mn1MJHt4fSwke1pFUk99YDtcbiAgICAgICAgcmV0dXJuIGAke3h9LCR7eTF9TCR7eH0sJHt5Mn1gO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGQgPSAnTScgKyBpbnN0cnVjdGlvbnMuam9pbignTCcpO1xuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCBkKTtcblxuICAgIC8vIH0gZWxzZSBpZiAodGhpcy5wYXJhbXMucmVuZGVyaW5nU3RyYXRlZ3kgPT09ICdjYW52YXMnKSB7XG5cbiAgICAvLyAgIHRoaXMuX2N0eC5jYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICAvLyAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCB3aWR0aCk7XG4gICAgLy8gICAvLyBmaXggY2hyb21lIGJ1ZyB3aXRoIHRyYW5zbGF0ZVxuICAgIC8vICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdjaHJvbWUnKSA+IC0xKSB7XG4gICAgLy8gICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZSgneCcsIHJlbmRlcmluZ0NvbnRleHQub2Zmc2V0WCk7XG4gICAgLy8gICB9XG5cbiAgICAvLyAgIHRoaXMuX2N0eC5zdHJva2VTdHlsZSA9IHRoaXMucGFyYW1zLmNvbG9yO1xuICAgIC8vICAgdGhpcy5fY3R4Lmdsb2JhbEFscGhhID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcbiAgICAvLyAgIHRoaXMuX2N0eC5tb3ZlVG8ocmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCgwKSwgcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoMCkpO1xuXG4gICAgLy8gICBtaW5NYXguZm9yRWFjaCgoZGF0dW0pID0+IHtcbiAgICAvLyAgICAgY29uc3QgeCAgPSBkYXR1bVtQSVhFTF07XG4gICAgLy8gICAgIGxldCB5MSA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoZGF0dW1bTUlOXSkpO1xuICAgIC8vICAgICBsZXQgeTIgPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKGRhdHVtW01BWF0pKTtcblxuICAgIC8vICAgICB0aGlzLl9jdHgubW92ZVRvKHgsIHkxKTtcbiAgICAvLyAgICAgdGhpcy5fY3R4LmxpbmVUbyh4LCB5Mik7XG4gICAgLy8gICB9KTtcblxuICAgIC8vICAgdGhpcy5fY3R4LnN0cm9rZSgpO1xuICAgIC8vIH1cbiAgfVxufVxuIiwiLyoqXG4gKiBgU3RhdGVgIGluc3RhbmNlcyBhcmUgdXNlZCB0byBkZWZpbmUgdGhlIGFwcGxpY2F0aW9uIGxvZ2ljIGJ5IHByZWNpc2luZ1xuICogc3BlY2lmaWMgdXNlciBpbnRlcmFjdGlvbiBjYXNlcywgYW5kIGhvdyB0aGV5IGltcGFjdCB0aGUgb3ZlcmFsIHRlbXBvcmFsXG4gKiByZXByZXNlbnRhdGlvbi4gVGhlIGFic3RyYWN0aW9ucyBleHRlbmRpbmcgdGhpcyBiYXNlIGNsYXNzIHNob3VsZCBiZVxuICogY29uc2lkZXJlZCBhcyB0aGUgbWFpbiBpbnRlcmZhY2UgYmV0d2VlbiB0aGUgdmlzdWFsaXphdGlvbiBhbmQgdGhlXG4gKiBhcHBsaWNhdGlvbiBsb2dpYy4gQWxsIHByb3ZpZGVkIHN0YXRlcyBzaG91bGQgYmUgc2VlbiBhcyBzaW1wbGUgZXhhbXBsZXMgZm9yXG4gKiByYXBpZCBwcm90b3R5cGluZyxcbiAqXG4gKiBTdGF0ZXMgbWFuYWdlIGludGVyYWN0aW9ucyBsaWtlIHpvb21pbmcsIGJyb3dzaW5nLCBvciBlZGl0aW5nIHRoZSB0aW1lbGluZS5cbiAqIEN1c3RvbWl6ZWQgc3RhdGVzIHNob3VsZCBleHRlbmQgdGhpcyBCYXNlU3RhdGUuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VTdGF0ZSB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRpbWVsaW5lIHRyYWNrcyBjb2xsZWN0aW9uLlxuICAgKlxuICAgKiBAdHlwZSB7VHJhY2tDb2xsZWN0aW9ufVxuICAgKi9cbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICAvKipcbiAgICAgKiBBIHJlZmVyZW5jZSB0byB0aGUgdGltZWxpbmUgb24gd2hpY2ggdGhlIHN0YXRlIHNob3VsZCBiZSBpbnN0YWxsZWQuXG4gICAgICogQHR5cGUge1RpbWVsaW5lfVxuICAgICAqL1xuICAgIHRoaXMudGltZWxpbmUgPSB0aW1lbGluZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRpbWVsaW5lIHRyYWNrcyBjb2xsZWN0aW9uLlxuICAgKlxuICAgKiBAdHlwZSB7VHJhY2tDb2xsZWN0aW9uPFRyYWNrPn1cbiAgICovXG4gIGdldCB0cmFja3MoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZWxpbmUudHJhY2tzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYWxsIHJlZ2lzdGVyZWQgbGF5ZXJzLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXk8TGF5ZXI+fVxuICAgKi9cbiAgZ2V0IGxheWVycygpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lbGluZS50cmFja3MubGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSB0aW1lbGluZSBpcyBlbnRlcmluZyB0aGUgc3RhdGUuXG4gICAqL1xuICBlbnRlcigpIHt9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSB0aW1lbGluZSBpcyBsZWF2aW5nIHRoZSBzdGF0ZS5cbiAgICovXG4gIGV4aXQoKSB7fVxuXG4gIC8qKlxuICAgKiBNYWluIGludGVyZmFjZSBtZXRob2QgdG8gb3ZlcnJpZGUgd2hlbiBjcmVhdGluZyBhIG5ldyBgU3RhdGVgLiBIYW5kbGUgZXZlbnRcbiAgICogZnJvbSBtb3VzZSBvciBrZXlib2FyZCwgc2hvdWxkIGRlZmluZSBiZWhhdmlvciBhY2NvcmRpbmcgdG8gdGhlIGV2ZW50XG4gICAqIChha2EuIG1vdXNlZG93biwgbW91c2V1cCwgLi4uKS5cbiAgICpcbiAgICogQHBhcmFtIHtXYXZlRXZlbnR9IGUgLSB0aGUgZXZlbnQgdG8gcHJvY2Vzcy5cbiAgICogQHBhcmFtIHtBcnJheX0gaGl0TGF5ZXJzIC0gdGhlIGxheWVycyBoaXQgYnkgdGhlIG1vdXNlIGV2ZW50IChpZiBzdXJmYWNlXG4gICAqIGV2ZW50KS5cbiAgICovXG4gIGhhbmRsZUV2ZW50KGUsIGhpdExheWVycykge31cbn1cbiIsImltcG9ydCBCYXNlU3RhdGUgZnJvbSAnLi9iYXNlLXN0YXRlJztcblxuXG4vKipcbiAqIEEgc3RhdGUgdG8gaW50ZXJhY3Qgd2l0aCBhIGJyZWFrcG9pbnQgZnVuY3Rpb24sIG1pbWljaW5nIE1heC9NU1Anc1xuICogYnJlYWtwb2ludCBmdW5jdGlvbiBpbnRlcmFjdGlvbnMuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYnJlYWtwaW50Lmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJyZWFrcG9pbnRTdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lLCBkYXR1bUdlbmVyYXRvcikge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcblxuICAgIHRoaXMuZGF0dW1HZW5lcmF0b3IgPSBkYXR1bUdlbmVyYXRvcjtcbiAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgfVxuXG4gIGVudGVyKCkge31cbiAgZXhpdCgpIHt9XG5cbiAgaGFuZGxlRXZlbnQoZSwgaGl0TGF5ZXJzKSB7XG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSwgaGl0TGF5ZXJzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUsIGhpdExheWVycyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUsIGhpdExheWVycyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUsIGhpdExheWVycykge1xuICAgIHRoaXMubW91c2VEb3duID0gdHJ1ZTtcbiAgICAvLyBrZWVwIHRhcmdldCBjb25zaXN0ZW50IHdpdGggbW91c2UgZG93blxuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IGUudGFyZ2V0O1xuICAgIGxldCB1cGRhdGVkTGF5ZXIgPSBudWxsO1xuXG4gICAgY29uc3QgbGF5ZXJzID0gaGl0TGF5ZXJzO1xuXG4gICAgbGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBsYXllci51bnNlbGVjdCgpO1xuICAgICAgY29uc3QgaXRlbSA9IGxheWVyLmdldEl0ZW1Gcm9tRE9NRWxlbWVudChlLnRhcmdldCk7XG5cbiAgICAgIGlmIChpdGVtID09PSBudWxsKSB7XG4gICAgICAgIC8vIGNyZWF0ZSBhbiBpdGVtXG4gICAgICAgIGNvbnN0IHRpbWUgPSBsYXllci50aW1lVG9QaXhlbC5pbnZlcnQoZS54KSAtIHRoaXMudGltZWxpbmUub2Zmc2V0O1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGxheWVyLnZhbHVlVG9QaXhlbC5pbnZlcnQobGF5ZXIucGFyYW1zLmhlaWdodCAtIGUueSk7XG4gICAgICAgIGNvbnN0IGRhdHVtID0gdGhpcy5kYXR1bUdlbmVyYXRvcih0aW1lLCB2YWx1ZSk7XG5cbiAgICAgICAgbGF5ZXIuZGF0YS5wdXNoKGRhdHVtKTtcbiAgICAgICAgdXBkYXRlZExheWVyID0gbGF5ZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBzaGlmdCBpcyBwcmVzc2VkLCByZW1vdmUgdGhlIGl0ZW1cbiAgICAgICAgaWYgKGUub3JpZ2luYWxFdmVudC5zaGlmdEtleSkge1xuICAgICAgICAgIGNvbnN0IGRhdGEgPSBsYXllci5kYXRhO1xuICAgICAgICAgIGNvbnN0IGRhdHVtID0gbGF5ZXIuZ2V0RGF0dW1Gcm9tSXRlbShpdGVtKTtcbiAgICAgICAgICBkYXRhLnNwbGljZShkYXRhLmluZGV4T2YoZGF0dW0pLCAxKTtcblxuICAgICAgICAgIHVwZGF0ZWRMYXllciA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbGF5ZXI7XG4gICAgICAgICAgbGF5ZXIuc2VsZWN0KGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodXBkYXRlZExheWVyKSB7XG4gICAgICB0aGlzLnRpbWVsaW5lLnRyYWNrcy5yZW5kZXIodXBkYXRlZExheWVyKTtcbiAgICAgIHRoaXMudGltZWxpbmUudHJhY2tzLnVwZGF0ZSh1cGRhdGVkTGF5ZXIpO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICBpZiAoIXRoaXMubW91c2VEb3duIHx8wqAhdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBsYXllciA9IHRoaXMuY3VycmVudEVkaXRlZExheWVyO1xuICAgIGNvbnN0IGl0ZW1zID0gbGF5ZXIuc2VsZWN0ZWRJdGVtcztcbiAgICAvLyB0aGUgbG9vcCBzaG91bGQgYmUgaW4gbGF5ZXIgdG8gbWF0Y2ggc2VsZWN0IC8gdW5zZWxlY3QgQVBJXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgbGF5ZXIuZWRpdChpdGVtLCBlLmR4LCBlLmR5LCB0aGlzLmN1cnJlbnRUYXJnZXQpO1xuICAgIH0pO1xuXG4gICAgbGF5ZXIudXBkYXRlKGl0ZW1zKTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIgPSBudWxsO1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5pbXBvcnQgQmFzZVN0YXRlIGZyb20gJy4vYmFzZS1zdGF0ZSc7XG5cblxuLyoqXG4gKiBQcm90b29scyBsaWtlIHpvb20gd2l0aCB6b25lIHNlbGVjdGlvbi4gUHJlc3Mgc3BhY2UgYmFyIHRvIHJlc2V0IHpvb20uXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvc3RhdGVzLXpvb20uaHRtbClcbiAqXG4gKiBAdG9kbyAtIGNvdWxkIGFsc28gaGFuZGxlIGBnYCBhbmQgYGhgIGtleXMgdG8gem9vbS1pbiwgem9vbS1vdXQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJydXNoWm9vbVN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdrZXlkb3duJzpcbiAgICAgICAgdGhpcy5vbktleURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLmJydXNoZXMgPSBbXTtcbiAgICB0aGlzLnN0YXJ0WCA9IGUueDtcbiAgICAvLyBjcmVhdGUgYnJ1c2ggaW4gZWFjaCBjb250YWluZXJzXG4gICAgdGhpcy50cmFja3MuZm9yRWFjaCgodHJhY2spID0+IHtcbiAgICAgIGNvbnN0IGludGVyYWN0aW9ucyA9IHRyYWNrLiRpbnRlcmFjdGlvbnM7XG5cbiAgICAgIGNvbnN0IGJydXNoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncmVjdCcpO1xuICAgICAgYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHRyYWNrLmhlaWdodCk7XG4gICAgICBicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIDApO1xuICAgICAgYnJ1c2guc3R5bGUuZmlsbCA9ICcjNzg3ODc4JztcbiAgICAgIGJydXNoLnN0eWxlLm9wYWNpdHkgPSAwLjI7XG5cbiAgICAgIGludGVyYWN0aW9ucy5hcHBlbmRDaGlsZChicnVzaCk7XG5cbiAgICAgIHRoaXMuYnJ1c2hlcy5wdXNoKGJydXNoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICAvLyB1cGRhdGUgYnJ1c2hcbiAgICBjb25zdCB3aWR0aCA9IE1hdGguYWJzKGUueCAtIHRoaXMuc3RhcnRYKTtcbiAgICBjb25zdCB4ID0gTWF0aC5taW4oZS54LCB0aGlzLnN0YXJ0WCk7XG5cbiAgICB0aGlzLmJydXNoZXMuZm9yRWFjaCgoYnJ1c2gpID0+IHtcbiAgICAgIGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHdpZHRoKTtcbiAgICAgIGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgeCk7XG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge1xuICAgIC8vIHJlbW92ZSBicnVzaFxuICAgIHRoaXMuYnJ1c2hlcy5mb3JFYWNoKChicnVzaCkgPT4ge1xuICAgICAgYnJ1c2gucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChicnVzaCk7XG4gICAgfSk7XG5cbiAgICAvLyB1cGRhdGUgdGltZUNvbnRleHRcbiAgICBjb25zdCBzdGFydFggPSB0aGlzLnN0YXJ0WDtcbiAgICBjb25zdCBlbmRYID0gZS54O1xuICAgIC8vIHJldHVybiBpZiBubyBkcmFnXG4gICAgaWYgKE1hdGguYWJzKHN0YXJ0WCAtIGVuZFgpIDwgMSkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGxlZnRYID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oc3RhcnRYLCBlbmRYKSk7XG4gICAgY29uc3QgcmlnaHRYID0gTWF0aC5tYXgoc3RhcnRYLCBlbmRYKTtcblxuICAgIGxldCBtaW5UaW1lID0gdGhpcy50aW1lbGluZS50aW1lVG9QaXhlbC5pbnZlcnQobGVmdFgpO1xuICAgIGxldCBtYXhUaW1lID0gdGhpcy50aW1lbGluZS50aW1lVG9QaXhlbC5pbnZlcnQocmlnaHRYKTtcblxuICAgIGNvbnN0IGRlbHRhRHVyYXRpb24gPSBtYXhUaW1lIC0gbWluVGltZTtcbiAgICBjb25zdCB6b29tID0gdGhpcy50aW1lbGluZS52aXNpYmxlRHVyYXRpb24gLyBkZWx0YUR1cmF0aW9uO1xuXG4gICAgdGhpcy50aW1lbGluZS5vZmZzZXQgLT0gbWluVGltZTtcbiAgICB0aGlzLnRpbWVsaW5lLnpvb20gKj0gem9vbTtcblxuICAgIHRoaXMudHJhY2tzLnVwZGF0ZSgpO1xuICB9XG5cbiAgb25LZXlEb3duKGUpIHtcbiAgICAvLyByZXNldCBvbiBzcGFjZSBiYXJcbiAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LmtleUNvZGUgPT09IDMyKSB7XG4gICAgICB0aGlzLnRpbWVsaW5lLm9mZnNldCA9IDA7XG4gICAgICB0aGlzLnRpbWVsaW5lLnpvb20gPSAxO1xuICAgICAgdGhpcy50cmFja3MudXBkYXRlKCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgc2NhbGVzIGZyb20gJy4uL3V0aWxzL3NjYWxlcyc7XG5pbXBvcnQgQmFzZVN0YXRlIGZyb20gJy4vYmFzZS1zdGF0ZSc7XG5cblxuLyoqXG4gKiBgQ2VudGVyZWRab29tU3RhdGVgIGlzIGEgdGltZWxpbmUgc3RhdGUgbWltaWNpbmcgdGhlIGBMaXZlYCB6b29tIGludGVyYWN0aW9uLiBJdCBhbGxvd3MgdGhlIHVzZXIgdG8gYnJvd3NlIHRoZSB0aW1lbGluZSBieSBjbGlja2luZyBvbiBhIHRyYWNrLCBhbmQgdGhlblxuICogLSBtb3ZpbmcgZG93biB0byB6b29tIGluXG4gKiAtIG1vdmluZyB1cCB0byB6b29tIG91dFxuICogLSBtb3ZpbmcgbGVmdCB0byBtb3ZlIGluIHRpbWUsIGFmdGVyXG4gKiAtIG1vdmluZyByaWdodCB0byBtb3ZlIGluIHRpbWUsIGJlZm9yZVxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL3N0YXRlcy16b29tLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENlbnRlcmVkWm9vbVN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG4gICAgdGhpcy5jdXJyZW50TGF5ZXIgPSBudWxsO1xuICAgIC8vIFNldCBtYXgvbWluIHpvb21cbiAgICAvLyBtYXhab29tOiAxcHggcGVyIHNhbXBsZVxuICAgIC8vIG1pblpvb206IDEwIDAwMCBweCBwZXIgMSBob3VyXG4gICAgLy8gd2l0aCBhIGRlZmF1bHQgdG8gNDQuMWtIeiBzYW1wbGUgcmF0ZVxuICAgIHRoaXMubWF4Wm9vbSA9IDQ0MTAwICogMSAvIHRoaXMudGltZWxpbmUudGltZUNvbnRleHQucGl4ZWxzUGVyU2Vjb25kO1xuICAgIHRoaXMubWluWm9vbSA9IDEwMDAwIC8gMzYwMCAvIHRoaXMudGltZWxpbmUudGltZUNvbnRleHQucGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLmluaXRpYWxab29tID0gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC56b29tO1xuICAgIHRoaXMuaW5pdGlhbFkgPSBlLnk7XG5cbiAgICB0aGlzLl9waXhlbFRvRXhwb25lbnQgPSBzY2FsZXMubGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIDEwMF0pIC8vIDEwMHB4ID0+IGZhY3RvciAyXG4gICAgICAucmFuZ2UoWzAsIDFdKTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICAvLyBwcmV2ZW50IGFubm95aW5nIHRleHQgc2VsZWN0aW9uIHdoZW4gZHJhZ2dpbmdcbiAgICBlLm9yaWdpbmFsRXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dDtcbiAgICBjb25zdCBsYXN0Q2VudGVyVGltZSA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChlLngpO1xuICAgIGNvbnN0IGV4cG9uZW50ID0gdGhpcy5fcGl4ZWxUb0V4cG9uZW50KGUueSAtIHRoaXMuaW5pdGlhbFkpO1xuICAgIGNvbnN0IHRhcmdldFpvb20gPSB0aGlzLmluaXRpYWxab29tICogTWF0aC5wb3coMiwgZXhwb25lbnQpOyAvLyAtMS4uLjEgLT4gMS8yLi4uMlxuXG4gICAgdGltZUNvbnRleHQuem9vbSA9IE1hdGgubWluKE1hdGgubWF4KHRhcmdldFpvb20sIHRoaXMubWluWm9vbSksIHRoaXMubWF4Wm9vbSk7XG5cbiAgICBjb25zdCBuZXdDZW50ZXJUaW1lID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KGUueCk7XG4gICAgY29uc3QgZGVsdGEgPSBuZXdDZW50ZXJUaW1lIC0gbGFzdENlbnRlclRpbWU7XG5cbiAgICAvLyBBcHBseSBuZXcgb2Zmc2V0IHRvIGtlZXAgaXQgY2VudGVyZWQgdG8gdGhlIG1vdXNlXG4gICAgdGltZUNvbnRleHQub2Zmc2V0ICs9IChkZWx0YSArIHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChlLmR4KSk7XG5cbiAgICAvLyBPdGhlciBwb3NzaWJsZSBleHBlcmltZW50cyB3aXRoIGNlbnRlcmVkLXpvb20tc3RhdGVcbiAgICAvL1xuICAgIC8vIEV4YW1wbGUgMTogUHJldmVudCB0aW1lbGluZS5vZmZzZXQgdG8gYmUgbmVnYXRpdmVcbiAgICAvLyB0aW1lQ29udGV4dC5vZmZzZXQgPSBNYXRoLm1pbih0aW1lQ29udGV4dC5vZmZzZXQsIDApO1xuICAgIC8vXG4gICAgLy8gRXhhbXBsZSAyOiBLZWVwIGluIGNvbnRhaW5lciB3aGVuIHpvb21lZCBvdXRcbiAgICAvLyBpZiAodGltZUNvbnRleHQuc3RyZXRjaFJhdGlvIDwgMSnCoHtcbiAgICAvLyAgIGNvbnN0IG1pbk9mZnNldCA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCgwKTtcbiAgICAvLyAgIGNvbnN0IG1heE9mZnNldCA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh2aWV3LndpZHRoIC0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwodGltZUNvbnRleHQuZHVyYXRpb24pKTtcbiAgICAvLyAgIHRpbWVDb250ZXh0Lm9mZnNldCA9IE1hdGgubWF4KHRpbWVDb250ZXh0Lm9mZnNldCwgbWluT2Zmc2V0KTtcbiAgICAvLyAgIHRpbWVDb250ZXh0Lm9mZnNldCA9IE1hdGgubWluKHRpbWVDb250ZXh0Lm9mZnNldCwgbWF4T2Zmc2V0KTtcbiAgICAvLyB9XG5cbiAgICB0aGlzLnRpbWVsaW5lLnRyYWNrcy51cGRhdGUoKTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7fVxufVxuIiwiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuaW1wb3J0IFRpbWVDb250ZXh0QmVoYXZpb3IgZnJvbSAnLi4vYmVoYXZpb3JzL3RpbWUtY29udGV4dC1iZWhhdmlvcic7XG5cblxuLyoqXG4gKiBBIHN0YXRlIHRvIGludGVyYWN0IGRpcmVjdGx5IHdpdGggbGF5ZXJzIHRpbWUgY29udGV4dHMuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2UsIHNlZS4gYWR2YW5jZWQgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItd2F2ZWZvcm0uaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGV4dEVkaXRpb25TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLm1vdXNlRG93biA9IHRydWU7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gZS50YXJnZXQ7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubGF5ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgbGF5ZXIgPSB0aGlzLmxheWVyc1tpXTtcbiAgICAgIGlmIChsYXllci5oYXNFbGVtZW50KGUudGFyZ2V0KSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRMYXllciA9IGxheWVyO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgaWYgKCF0aGlzLm1vdXNlRG93biB8fMKgIXRoaXMuY3VycmVudExheWVyKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgbGF5ZXIgPSB0aGlzLmN1cnJlbnRMYXllcjtcbiAgICBjb25zdCB0YXJnZXQgPSB0aGlzLmN1cnJlbnRUYXJnZXQ7XG5cbiAgICAvLyBpbiB0aGlzIGV4YW1wbGUgdGhlIGNvbnRleHQgaXMgc3RyZXRjaGVkIHdoZW4gc2hpZnQgaXMgcHJlc3NlZFxuICAgIGlmICghZS5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICBsYXllci5lZGl0Q29udGV4dChlLmR4LCBlLmR5LCB0YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXllci5zdHJldGNoQ29udGV4dChlLmR4LCBlLmR5LCB0YXJnZXQpO1xuICAgIH1cblxuICAgIHRoaXMudGltZWxpbmUudHJhY2tzLnVwZGF0ZShsYXllcik7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRMYXllciA9IG51bGw7XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlU3RhdGUgZnJvbSAnLi9iYXNlLXN0YXRlJztcblxuXG4vKipcbiAqIEEgc3RhdGUgdG8gZWRpdCBzaGFwZXMgaW4gdGhlIG1vcmUgZ2VuZXJhbCB3YXkuIEludGVyYWN0IG9ubHkgd2l0aCBzZWxlY3RlZCBzaGFwZXMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRpb25TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XG4gIH1cblxuICBlbnRlcigpIHt9XG4gIGV4aXQoKSB7fVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IGUudGFyZ2V0O1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIHRoaXMubGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBjb25zdCBpdGVtcyA9IGxheWVyLnNlbGVjdGVkSXRlbXM7XG5cbiAgICAgIGxheWVyLmVkaXQoaXRlbXMsIGUuZHgsIGUuZHksIHRoaXMuY3VycmVudFRhcmdldCk7XG4gICAgICBsYXllci51cGRhdGUoaXRlbXMpO1xuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IG51bGw7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuaW1wb3J0IG5zIGZyb20gJy4uL2NvcmUvbmFtZXNwYWNlJztcblxuXG4vKipcbiAqIEEgc3RhdGUgdG8gc2VsZWN0IHNoYXBlcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VsZWN0aW9uU3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSAvKiwgb3B0aW9ucyA9IHt9ICovKSB7XG4gICAgc3VwZXIodGltZWxpbmUgLyosIG9wdGlvbnMgKi8pO1xuXG4gICAgdGhpcy5jdXJyZW50TGF5ZXIgPSBudWxsO1xuICAgIC8vIG5lZWQgYSBjYWNoZWRcbiAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSBudWxsO1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gICAgdGhpcy5zaGlmdEtleSA9IGZhbHNlO1xuXG4gICAgdGhpcy5fbGF5ZXJTZWxlY3RlZEl0ZW1zTWFwID0gbmV3IE1hcCgpO1xuICB9XG5cbiAgZW50ZXIoKSB7XG5cbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgY29uc3QgY29udGFpbmVycyA9IHRoaXMudGltZWxpbmUuY29udGFpbmVycztcblxuICAgIGZvciAobGV0IGlkIGluIGNvbnRhaW5lcnMpIHtcbiAgICAgIHRoaXMuX3JlbW92ZUJydXNoKGNvbnRhaW5lcnNbaWRdKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY2xpY2snOlxuICAgICAgICB0aGlzLm9uQ2xpY2soZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAna2V5ZG93bic6XG4gICAgICAgIHRoaXMub25LZXkoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAna2V5dXAnOlxuICAgICAgICB0aGlzLm9uS2V5KGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBfYWRkQnJ1c2godHJhY2spIHtcbiAgICBpZiAodHJhY2suJGJydXNoKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgYnJ1c2ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgYnJ1c2guc3R5bGUuZmlsbCA9ICcjNjg2ODY4JztcbiAgICBicnVzaC5zdHlsZS5vcGFjaXR5ID0gMC4yO1xuXG4gICAgdHJhY2suJGludGVyYWN0aW9ucy5hcHBlbmRDaGlsZChicnVzaCk7XG4gICAgdHJhY2suJGJydXNoID0gYnJ1c2g7XG4gIH1cblxuICBfcmVtb3ZlQnJ1c2godHJhY2spIHtcbiAgICBpZiAodHJhY2suJGJydXNoID09PSBudWxsKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5fcmVzZXRCcnVzaCh0cmFjayk7XG4gICAgdHJhY2suJGludGVyYWN0aW9ucy5yZW1vdmVDaGlsZCh0cmFjay4kYnJ1c2gpO1xuICAgIGRlbGV0ZSB0cmFjay4kYnJ1c2g7XG4gIH1cblxuICBfcmVzZXRCcnVzaCh0cmFjaykge1xuICAgIGNvbnN0ICRicnVzaCA9IHRyYWNrLiRicnVzaDtcbiAgICAvLyByZXNldCBicnVzaCBlbGVtZW50XG4gICAgJGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsIDApJyk7XG4gICAgJGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIDApO1xuICAgICRicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgMCk7XG4gIH1cblxuICBfdXBkYXRlQnJ1c2goZSwgdHJhY2spIHtcbiAgICBjb25zdCAkYnJ1c2ggPSB0cmFjay4kYnJ1c2g7XG4gICAgY29uc3QgdHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgke2UuYXJlYS5sZWZ0fSwgJHtlLmFyZWEudG9wfSlgO1xuXG4gICAgJGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGUpO1xuICAgICRicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCBlLmFyZWEud2lkdGgpO1xuICAgICRicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgZS5hcmVhLmhlaWdodCk7XG4gIH1cblxuICBvbktleShlKSB7XG4gICAgdGhpcy5zaGlmdEtleSA9IGUuc2hpZnRLZXk7XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgdGhpcy5fY3VycmVudFRyYWNrID0gdGhpcy50aW1lbGluZS5nZXRUcmFja0Zyb21ET01FbGVtZW50KGUudGFyZ2V0KTtcbiAgICBpZiAoIXRoaXMuX2N1cnJlbnRUcmFjaykgeyByZXR1cm47IH1cblxuICAgIHRoaXMuX2FkZEJydXNoKHRoaXMuX2N1cnJlbnRUcmFjayk7XG5cbiAgICAvLyByZWNyZWF0ZSB0aGUgbWFwXG4gICAgdGhpcy5fbGF5ZXJTZWxlY3RlZEl0ZW1zTWFwID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX2N1cnJlbnRUcmFjay5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIHRoaXMuX2xheWVyU2VsZWN0ZWRJdGVtc01hcC5zZXQobGF5ZXIsIGxheWVyLnNlbGVjdGVkSXRlbXMuc2xpY2UoMCkpO1xuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIHRoaXMuX3VwZGF0ZUJydXNoKGUsIHRoaXMuX2N1cnJlbnRUcmFjayk7XG5cbiAgICB0aGlzLl9jdXJyZW50VHJhY2subGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50U2VsZWN0aW9uID0gbGF5ZXIuc2VsZWN0ZWRJdGVtcztcbiAgICAgIGNvbnN0IGN1cnJlbnRJdGVtcyA9IGxheWVyLmdldEl0ZW1zSW5BcmVhKGUuYXJlYSk7XG5cbiAgICAgIC8vIGlmIGlzIG5vdCBwcmVzc2VkXG4gICAgICBpZiAoIWUub3JpZ2luYWxFdmVudC5zaGlmdEtleSkge1xuICAgICAgICBsYXllci51bnNlbGVjdChjdXJyZW50U2VsZWN0aW9uKTtcbiAgICAgICAgbGF5ZXIuc2VsZWN0KGN1cnJlbnRJdGVtcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0b1NlbGVjdCA9IFtdO1xuICAgICAgICBjb25zdCB0b1Vuc2VsZWN0ID0gW107XG4gICAgICAgIC8vIHVzZSB0aGUgc2VsZWN0aW9uIGZyb20gdGhlIHByZXZpb3VzIGRyYWdcbiAgICAgICAgY29uc3QgcHJldmlvdXNTZWxlY3Rpb24gPSB0aGlzLl9sYXllclNlbGVjdGVkSXRlbXNNYXAuZ2V0KGxheWVyKTtcbiAgICAgICAgLy8gdG9VbnNlbGVjdCA9IHRvVW5zZWxlY3QuY29uY2F0KHByZXZpb3VzU2VsZWN0ZWRJdGVtcyk7XG5cbiAgICAgICAgY3VycmVudEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICBpZiAocHJldmlvdXNTZWxlY3Rpb24uaW5kZXhPZihpdGVtKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHRvU2VsZWN0LnB1c2goaXRlbSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvVW5zZWxlY3QucHVzaChpdGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGN1cnJlbnRTZWxlY3Rpb24uZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGN1cnJlbnRJdGVtcy5pbmRleE9mKGl0ZW0pID09PSAtMSAmJlxuICAgICAgICAgICAgcHJldmlvdXNTZWxlY3Rpb24uaW5kZXhPZihpdGVtKSA9PT0gLTFcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRvVW5zZWxlY3QucHVzaChpdGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxheWVyLnVuc2VsZWN0KHRvVW5zZWxlY3QpO1xuICAgICAgICBsYXllci5zZWxlY3QodG9TZWxlY3QpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICB0aGlzLl9yZW1vdmVCcnVzaCh0aGlzLl9jdXJyZW50VHJhY2spO1xuICB9XG5cbiAgb25DbGljayhlKSB7XG4gICAgaWYgKCF0aGlzLl9jdXJyZW50VHJhY2spIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl9jdXJyZW50VHJhY2subGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBsZXQgaXRlbSA9IGxheWVyLmdldEl0ZW1Gcm9tRE9NRWxlbWVudChlLnRhcmdldCk7XG5cbiAgICAgIGlmICghZS5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgIGxheWVyLnVuc2VsZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgIGxheWVyLnRvZ2dsZVNlbGVjdGlvbihpdGVtKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuXG5cbi8qKlxuICogQSBzdGF0ZSB0byBzZWxlY3QgYW5kIGVkaXQgc2hhcGVzIGluIGEgc2ltcGxlIHdheS4gKGtpbmQgb2YgcGx1ZyBuIHBsYXkgc3RhdGUpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpbXBsZUVkaXRpb25TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XG4gIH1cblxuICBlbnRlcigpIHt9XG4gIGV4aXQoKSB7fVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIC8vIGtlZXAgdGFyZ2V0IGNvbnNpc3RlbnQgd2l0aCBtb3VzZSBkb3duXG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gZS50YXJnZXQ7XG5cbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgaWYgKCFsYXllci5oYXNFbGVtZW50KHRoaXMuY3VycmVudFRhcmdldCkpIHsgcmV0dXJuOyB9XG5cbiAgICAgIGlmICghZS5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgIGxheWVyLnVuc2VsZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGl0ZW0gPSBsYXllci5nZXRJdGVtRnJvbURPTUVsZW1lbnQodGhpcy5jdXJyZW50VGFyZ2V0KTtcblxuICAgICAgaWYgKGl0ZW0gPT09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbGF5ZXI7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7IGxheWVyLnNlbGVjdChpdGVtKTsgfSk7XG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgaWYgKCF0aGlzLmN1cnJlbnRFZGl0ZWRMYXllcikgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGxheWVyID0gdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXI7XG4gICAgY29uc3QgaXRlbXMgPSBsYXllci5zZWxlY3RlZEl0ZW1zO1xuXG4gICAgbGF5ZXIuZWRpdChpdGVtcywgZS5keCwgZS5keSwgdGhpcy5jdXJyZW50VGFyZ2V0KTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7IGxheWVyLnVwZGF0ZShpdGVtcyk7IH0pO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IG51bGw7XG4gIH1cbn1cbiIsIi8qKlxuICogRm9ybWF0dGluZyBoZWxwZXJzIGZ1bmN0aW9ucy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogQWRkIGEgYHNpZ25gIHRvIHRoZSBsZWZ0IG9mIGEgZ2l2ZW4gYGlucHV0YCB0byBtYXRjaCBgbGVuZ3RoYFxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgLSBUaGUgc3RyaW5nIHRvIGZvcm1hdC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHNpZ24gLSBUaGUgY2hhcmFjdGVyIHRvIGFkZCB0byB0aGUgbGVmdC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIG91dHB1dCBzdHJpbmcuXG4gICAqL1xuICBwYWRMZWZ0KGlucHV0LCBzaWduLCBsZW5ndGgpIHtcbiAgICBpbnB1dCArPSAnJztcbiAgICB3aGlsZSAoaW5wdXQubGVuZ3RoIDwgbGVuZ3RoKSB7XG4gICAgICBpbnB1dCA9IHNpZ24gKyBpbnB1dDtcbiAgICB9XG4gICAgcmV0dXJuIGlucHV0O1xuICB9XG59O1xuIiwiLyoqXG4gKiBPcnRob2dvbmFsRGF0YSB0cmFuc2Zvcm1zIGFuIG9iamVjdCBvZiBhcnJheXMgYHtmb286IFsxLCAyXSwgYmFyOiBbMywgNF19YFxuICogdG8gb3IgZnJvbSBhbiBhcnJheSBvZiBvYmplY3RzIGBbe2ZvbzogMSwgYmFyOiAzfSwge2ZvbzogMiwgYmFyOiA0fV1gXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9ydGhvZ29uYWxEYXRhIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fY29scyA9IG51bGw7IC8vIE9iamVjdCBvZiBhcnJheXNcbiAgICB0aGlzLl9yb3dzID0gbnVsbDsgLy8gQXJyYXkgb2Ygb2JqZWN0c1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHRoZSBjb25zaXN0ZW5jeSBvZiB0aGUgZGF0YS5cbiAgICovXG4gIF9jaGVja0NvbnNpc3RlbmN5KCkge1xuICAgIGxldCBzaXplID0gbnVsbDtcblxuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLl9jb2xzKSB7XG4gICAgICBjb25zdCBjb2wgPSB0aGlzLl9jb2xzW2tleV07XG4gICAgICBjb25zdCBjb2xMZW5ndGggPSBjb2wubGVuZ3RoO1xuXG4gICAgICBpZiAoc2l6ZSAhPT0gbnVsbCAmJiBzaXplICE9PSBjb2xMZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMucHJvdG90eXBlLmNvbnN0cnVjdG9yLm5hbWV9OiBpbmNvbnNpc3RlbnQgZGF0YWApO1xuICAgICAgfSBlbHNlIGlmIChzaXplID09PSBudWxsKSB7XG4gICAgICAgIHNpemUgPSBjb2xMZW5ndGg7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgYXJyYXkgb2Ygb2JqZWN0cyBmcm9tIG9iamVjdCBvZiBhcnJheXMuXG4gICAqL1xuICB1cGRhdGVGcm9tQ29scygpIHtcbiAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuX2NvbHMpO1xuXG4gICAga2V5cy5mb3JFYWNoKChrZXksIGkpID0+IHtcbiAgICAgIGNvbnN0IGNvbCA9IHRoaXMuX2NvbHNba2V5XTtcblxuICAgICAgY29sLmZvckVhY2goKHZhbHVlLCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fcm93c1tpbmRleF0gPT09IHVuZGVmaW5lZCkgdGhpcy5fcm93c1tpbmRleF0gPSB7fTtcbiAgICAgICAgdGhpcy5fcm93c1tpbmRleF1ba2V5XSA9IHZhbHVlO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9jaGVja0NvbnNpc3RlbmN5KCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBvYmplY3Qgb2YgYXJyYXlzIGZyb20gYXJyYXkgb2Ygb2JqZWN0cy5cbiAgICovXG4gIHVwZGF0ZUZyb21Sb3dzKCkge1xuICAgIHRoaXMuX3Jvd3MuZm9yRWFjaCgob2JqLCBpbmRleCkgPT4ge1xuICAgICAgZm9yIChsZXQga2V5IGluIG9iaikge1xuICAgICAgICBpZiAoaW5kZXggPT09IDApIHRoaXMuX2NvbHNba2V5XSA9IFtdO1xuICAgICAgICB0aGlzLl9jb2xzW2tleV0ucHVzaChvYmpba2V5XSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9jaGVja0NvbnNpc3RlbmN5KCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhbiBvYmplY3Qgb2YgYXJyYXlzLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0PFN0cmluZywgQXJyYXk+fVxuICAgKi9cbiAgc2V0IGNvbHMob2JqKSB7XG4gICAgdGhpcy5fY29scyA9IG9iajtcbiAgICB0aGlzLl9yb3dzID0gW107XG5cbiAgICB0aGlzLnVwZGF0ZUZyb21Db2xzKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBvYmplY3Qgb2YgYXJyYXlzLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0PFN0cmluZywgQXJyYXk+fVxuICAgKi9cbiAgZ2V0IGNvbHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbHM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhbiBhcnJheSBvZiBvYmplY3RzLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXk8T2JqZWN0Pn1cbiAgICovXG4gIHNldCByb3dzKGFycikge1xuICAgIHRoaXMuX3Jvd3MgPSBhcnI7XG4gICAgdGhpcy5fY29scyA9IHt9O1xuXG4gICAgdGhpcy51cGRhdGVGcm9tUm93cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2Ygb2JqZWN0cy5cbiAgICpcbiAgICogQHR5cGUge0FycmF5PE9iamVjdD59XG4gICAqL1xuICBnZXQgcm93cygpIHtcbiAgICByZXR1cm4gdGhpcy5fcm93cztcbiAgfVxufVxuIiwiLyoqXG4gKiBMaWdodHdlaWdodCBzY2FsZXMgbWltaWNpbmcgdGhlIGBkMy5qc2AgZnVuY3Rpb25uYWwgQVBJLlxuICovXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBBIGxpbmVhciBzY2FsZSBpbnRlcnBvbGF0aW5nIHZhbHVlcyBiZXR3ZWVuIGEgYGRvbWFpbmAgYW5kIGEgYHJhbmdlYC5cbiAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAqL1xuICBsaW5lYXIoKSB7XG4gICAgbGV0IF9kb21haW4gPSBbMCwgMV07XG4gICAgbGV0IF9yYW5nZSA9IFswLCAxXTtcblxuICAgIGxldCBfc2xvcGUgPSAxO1xuICAgIGxldCBfaW50ZXJjZXB0ID0gMDtcblxuICAgIGZ1bmN0aW9uIF91cGRhdGVDb2VmcygpIHtcbiAgICAgIF9zbG9wZSA9IChfcmFuZ2VbMV0gLSBfcmFuZ2VbMF0pIC8gKF9kb21haW5bMV0gLSBfZG9tYWluWzBdKTtcbiAgICAgIF9pbnRlcmNlcHQgPSBfcmFuZ2VbMF0gLSAoX3Nsb3BlICogX2RvbWFpblswXSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2NhbGUgKHZhbHVlKSB7XG4gICAgICByZXR1cm4gKF9zbG9wZSAqIHZhbHVlKSArIF9pbnRlcmNlcHQ7XG4gICAgfVxuXG4gICAgc2NhbGUuaW52ZXJ0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiAodmFsdWUgLSBfaW50ZXJjZXB0KSAvIF9zbG9wZTtcbiAgICB9O1xuXG4gICAgc2NhbGUuZG9tYWluID0gZnVuY3Rpb24oYXJyID0gbnVsbCkge1xuICAgICAgaWYgKGFyciA9PT0gbnVsbCkgeyByZXR1cm4gX2RvbWFpbjsgfVxuXG4gICAgICBfZG9tYWluID0gYXJyO1xuICAgICAgX3VwZGF0ZUNvZWZzKCk7XG5cbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9O1xuXG4gICAgc2NhbGUucmFuZ2UgPSBmdW5jdGlvbihhcnIgPSBudWxsKSB7XG4gICAgICBpZiAoYXJyID09PSBudWxsKSB7IHJldHVybiBfcmFuZ2U7IH1cblxuICAgICAgX3JhbmdlID0gYXJyO1xuICAgICAgX3VwZGF0ZUNvZWZzKCk7XG5cbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHNjYWxlO1xuICB9XG59O1xuIiwiLy8gY29yZVxuaW1wb3J0IExheWVyVGltZUNvbnRleHQgZnJvbSAnLi9jb3JlL2xheWVyLXRpbWUtY29udGV4dCc7XG5pbXBvcnQgTGF5ZXIgZnJvbSAnLi9jb3JlL2xheWVyJztcbmltcG9ydCBuYW1lc3BhY2UgZnJvbSAnLi9jb3JlL25hbWVzcGFjZSc7XG5pbXBvcnQgVGltZWxpbmVUaW1lQ29udGV4dCBmcm9tICcuL2NvcmUvdGltZWxpbmUtdGltZS1jb250ZXh0JztcbmltcG9ydCBUaW1lbGluZSBmcm9tICcuL2NvcmUvdGltZWxpbmUnO1xuaW1wb3J0IFRyYWNrQ29sbGVjdGlvbiBmcm9tICcuL2NvcmUvdHJhY2stY29sbGVjdGlvbic7XG5pbXBvcnQgVHJhY2sgZnJvbSAnLi9jb3JlL3RyYWNrJztcblxuLy8gc2hhcGVzXG5pbXBvcnQgQW5ub3RhdGVkTWFya2VyIGZyb20gJy4vc2hhcGVzL2Fubm90YXRlZC1tYXJrZXInO1xuaW1wb3J0IEFubm90YXRlZFNlZ21lbnQgZnJvbSAnLi9zaGFwZXMvYW5ub3RhdGVkLXNlZ21lbnQnO1xuaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL3NoYXBlcy9iYXNlLXNoYXBlJztcbmltcG9ydCBDdXJzb3IgZnJvbSAnLi9zaGFwZXMvY3Vyc29yJztcbmltcG9ydCBEb3QgZnJvbSAnLi9zaGFwZXMvZG90JztcbmltcG9ydCBMaW5lIGZyb20gJy4vc2hhcGVzL2xpbmUnO1xuaW1wb3J0IE1hcmtlciBmcm9tICcuL3NoYXBlcy9tYXJrZXInO1xuaW1wb3J0IFNlZ21lbnQgZnJvbSAnLi9zaGFwZXMvc2VnbWVudCc7XG5pbXBvcnQgVGlja3MgZnJvbSAnLi9zaGFwZXMvdGlja3MnO1xuaW1wb3J0IFRyYWNlUGF0aCBmcm9tICcuL3NoYXBlcy90cmFjZS1wYXRoJztcbmltcG9ydCBUcmFjZURvdHMgZnJvbSAnLi9zaGFwZXMvdHJhY2UtZG90cyc7XG5pbXBvcnQgV2F2ZWZvcm0gZnJvbSAnLi9zaGFwZXMvd2F2ZWZvcm0nO1xuXG4vLyBiZWhhdmlvcnNcbmltcG9ydCBCYXNlQmVoYXZpb3IgZnJvbSAnLi9iZWhhdmlvcnMvYmFzZS1iZWhhdmlvcic7XG5pbXBvcnQgQnJlYWtwb2ludEJlaGF2aW9yIGZyb20gJy4vYmVoYXZpb3JzL2JyZWFrcG9pbnQtYmVoYXZpb3InO1xuaW1wb3J0IE1hcmtlckJlaGF2aW9yIGZyb20gJy4vYmVoYXZpb3JzL21hcmtlci1iZWhhdmlvcic7XG5pbXBvcnQgU2VnbWVudEJlaGF2aW9yIGZyb20gJy4vYmVoYXZpb3JzL3NlZ21lbnQtYmVoYXZpb3InO1xuaW1wb3J0IFRpbWVDb250ZXh0QmVoYXZpb3IgZnJvbSAnLi9iZWhhdmlvcnMvdGltZS1jb250ZXh0LWJlaGF2aW9yJztcbmltcG9ydCBUcmFjZUJlaGF2aW9yIGZyb20gJy4vYmVoYXZpb3JzL3RyYWNlLWJlaGF2aW9yJztcblxuLy8gaW50ZXJhY3Rpb25zXG5pbXBvcnQgRXZlbnRTb3VyY2UgZnJvbSAnLi9pbnRlcmFjdGlvbnMvZXZlbnQtc291cmNlJztcbmltcG9ydCBLZXlib2FyZCBmcm9tICcuL2ludGVyYWN0aW9ucy9rZXlib2FyZCc7XG5pbXBvcnQgU3VyZmFjZSBmcm9tICcuL2ludGVyYWN0aW9ucy9zdXJmYWNlJztcbmltcG9ydCBXYXZlRXZlbnQgZnJvbSAnLi9pbnRlcmFjdGlvbnMvd2F2ZS1ldmVudCc7XG5cbi8vIHN0YXRlc1xuaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL3N0YXRlcy9iYXNlLXN0YXRlJztcbmltcG9ydCBCcmVha3BvaW50U3RhdGUgZnJvbSAnLi9zdGF0ZXMvYnJlYWtwb2ludC1zdGF0ZSc7XG5pbXBvcnQgQnJ1c2hab29tU3RhdGUgZnJvbSAnLi9zdGF0ZXMvYnJ1c2gtem9vbS1zdGF0ZSc7XG5pbXBvcnQgQ2VudGVyZWRab29tU3RhdGUgZnJvbSAnLi9zdGF0ZXMvY2VudGVyZWQtem9vbS1zdGF0ZSc7XG5pbXBvcnQgQ29udGV4dEVkaXRpb25TdGF0ZSBmcm9tICcuL3N0YXRlcy9jb250ZXh0LWVkaXRpb24tc3RhdGUnO1xuaW1wb3J0IEVkaXRpb25TdGF0ZSBmcm9tICcuL3N0YXRlcy9lZGl0aW9uLXN0YXRlJztcbmltcG9ydCBTZWxlY3Rpb25TdGF0ZSBmcm9tICcuL3N0YXRlcy9zZWxlY3Rpb24tc3RhdGUnO1xuaW1wb3J0IFNpbXBsZUVkaXRpb25TdGF0ZSBmcm9tICcuL3N0YXRlcy9zaW1wbGUtZWRpdGlvbi1zdGF0ZSc7XG5cbi8vIGhlbHBlcnNcbmltcG9ydCBBbm5vdGF0ZWRNYXJrZXJMYXllciBmcm9tICcuL2hlbHBlcnMvYW5ub3RhdGVkLW1hcmtlci1sYXllcic7XG5pbXBvcnQgQW5ub3RhdGVkU2VnbWVudExheWVyIGZyb20gJy4vaGVscGVycy9hbm5vdGF0ZWQtc2VnbWVudC1sYXllcic7XG5pbXBvcnQgQnJlYWtwb2ludExheWVyIGZyb20gJy4vaGVscGVycy9icmVha3BvaW50LWxheWVyJztcbmltcG9ydCBDdXJzb3JMYXllciBmcm9tICcuL2hlbHBlcnMvY3Vyc29yLWxheWVyJztcbmltcG9ydCBHcmlkQXhpc0xheWVyIGZyb20gJy4vaGVscGVycy9ncmlkLWF4aXMtbGF5ZXInO1xuaW1wb3J0IE1hcmtlckxheWVyIGZyb20gJy4vaGVscGVycy9tYXJrZXItbGF5ZXInO1xuaW1wb3J0IFNlZ21lbnRMYXllciBmcm9tICcuL2hlbHBlcnMvc2VnbWVudC1sYXllcic7XG5pbXBvcnQgVGlja0xheWVyIGZyb20gJy4vaGVscGVycy90aWNrLWxheWVyJztcbmltcG9ydCBUaW1lQXhpc0xheWVyIGZyb20gJy4vaGVscGVycy90aW1lLWF4aXMtbGF5ZXInO1xuaW1wb3J0IFRyYWNlTGF5ZXIgZnJvbSAnLi9oZWxwZXJzL3RyYWNlLWxheWVyJztcbmltcG9ydCBXYXZlZm9ybUxheWVyIGZyb20gJy4vaGVscGVycy93YXZlZm9ybS1sYXllcic7XG5cbi8vIGF4aXNcbmltcG9ydCBBeGlzTGF5ZXIgZnJvbSAnLi9heGlzL2F4aXMtbGF5ZXInO1xuaW1wb3J0IHRpbWVBeGlzR2VuZXJhdG9yIGZyb20gJy4vYXhpcy90aW1lLWF4aXMtZ2VuZXJhdG9yJztcbmltcG9ydCBncmlkQXhpc0dlbmVyYXRvciBmcm9tICcuL2F4aXMvZ3JpZC1heGlzLWdlbmVyYXRvcic7XG5cbi8vIHV0aWxzXG5pbXBvcnQgZm9ybWF0IGZyb20gJy4vdXRpbHMvZm9ybWF0JztcbmltcG9ydCBPcnRob2dvbmFsRGF0YSBmcm9tICcuL3V0aWxzL29ydGhvZ29uYWwtZGF0YSc7XG5pbXBvcnQgc2NhbGVzIGZyb20gJy4vdXRpbHMvc2NhbGVzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb3JlOiB7XG4gICAgTGF5ZXJUaW1lQ29udGV4dCwgTGF5ZXIsIG5hbWVzcGFjZSxcbiAgICBUaW1lbGluZVRpbWVDb250ZXh0LCBUaW1lbGluZSwgVHJhY2tDb2xsZWN0aW9uLCBUcmFja1xuICB9LFxuICBzaGFwZXM6IHtcbiAgICBBbm5vdGF0ZWRNYXJrZXIsIEFubm90YXRlZFNlZ21lbnQsIEJhc2VTaGFwZSwgQ3Vyc29yLFxuICAgIERvdCwgTGluZSwgTWFya2VyLCBTZWdtZW50LCBUaWNrcywgVHJhY2VQYXRoLCBUcmFjZURvdHMsIFdhdmVmb3JtXG4gIH0sXG4gIGJlaGF2aW9yczoge1xuICAgIEJhc2VCZWhhdmlvciwgQnJlYWtwb2ludEJlaGF2aW9yLCBNYXJrZXJCZWhhdmlvciwgU2VnbWVudEJlaGF2aW9yLFxuICAgIFRpbWVDb250ZXh0QmVoYXZpb3IsIFRyYWNlQmVoYXZpb3JcbiAgfSxcbiAgaW50ZXJhY3Rpb25zOiB7IEV2ZW50U291cmNlLCBLZXlib2FyZCwgU3VyZmFjZSwgV2F2ZUV2ZW50IH0sXG4gIHN0YXRlczoge1xuICAgIEJhc2VTdGF0ZSwgQnJlYWtwb2ludFN0YXRlLCBCcnVzaFpvb21TdGF0ZSwgQ2VudGVyZWRab29tU3RhdGUsXG4gICAgQ29udGV4dEVkaXRpb25TdGF0ZSwgRWRpdGlvblN0YXRlLCBTZWxlY3Rpb25TdGF0ZSwgU2ltcGxlRWRpdGlvblN0YXRlXG4gIH0sXG4gIGhlbHBlcnM6IHtcbiAgICBBbm5vdGF0ZWRNYXJrZXJMYXllciwgQW5ub3RhdGVkU2VnbWVudExheWVyLCBCcmVha3BvaW50TGF5ZXIsXG4gICAgQ3Vyc29yTGF5ZXIsIEdyaWRBeGlzTGF5ZXIsIE1hcmtlckxheWVyLCBTZWdtZW50TGF5ZXIsIFRpY2tMYXllcixcbiAgICBUaW1lQXhpc0xheWVyLCBUcmFjZUxheWVyLCBXYXZlZm9ybUxheWVyXG4gIH0sXG4gIGF4aXM6IHtcbiAgICBBeGlzTGF5ZXIsIHRpbWVBeGlzR2VuZXJhdG9yLCBncmlkQXhpc0dlbmVyYXRvclxuICB9LFxuICB1dGlsczoge1xuICAgIGZvcm1hdCwgT3J0aG9nb25hbERhdGEsIHNjYWxlc1xuICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL2FycmF5L2Zyb21cIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vZ2V0LWl0ZXJhdG9yXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL2lzLWl0ZXJhYmxlXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL21hcFwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvYXNzaWduXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9jcmVhdGVcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9rZXlzXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9zZXQtcHJvdG90eXBlLW9mXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL3Byb21pc2VcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vc2V0XCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbFwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaXRlcmF0b3JcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9PYmplY3QkZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9kZWZpbmUtcHJvcGVydHlcIilbXCJkZWZhdWx0XCJdO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IChmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuXG4gICAgICBfT2JqZWN0JGRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gIH07XG59KSgpO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX09iamVjdCRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JcIilbXCJkZWZhdWx0XCJdO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uIGdldChfeCwgX3gyLCBfeDMpIHtcbiAgdmFyIF9hZ2FpbiA9IHRydWU7XG5cbiAgX2Z1bmN0aW9uOiB3aGlsZSAoX2FnYWluKSB7XG4gICAgdmFyIG9iamVjdCA9IF94LFxuICAgICAgICBwcm9wZXJ0eSA9IF94MixcbiAgICAgICAgcmVjZWl2ZXIgPSBfeDM7XG4gICAgX2FnYWluID0gZmFsc2U7XG4gICAgaWYgKG9iamVjdCA9PT0gbnVsbCkgb2JqZWN0ID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4gICAgdmFyIGRlc2MgPSBfT2JqZWN0JGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTtcblxuICAgIGlmIChkZXNjID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBwYXJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3ggPSBwYXJlbnQ7XG4gICAgICAgIF94MiA9IHByb3BlcnR5O1xuICAgICAgICBfeDMgPSByZWNlaXZlcjtcbiAgICAgICAgX2FnYWluID0gdHJ1ZTtcbiAgICAgICAgZGVzYyA9IHBhcmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgY29udGludWUgX2Z1bmN0aW9uO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIHtcbiAgICAgIHJldHVybiBkZXNjLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7XG5cbiAgICAgIGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9PYmplY3QkY3JlYXRlID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvY3JlYXRlXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9PYmplY3Qkc2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9zZXQtcHJvdG90eXBlLW9mXCIpW1wiZGVmYXVsdFwiXTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBmdW5jdGlvbiAoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gX09iamVjdCRjcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIF9PYmplY3Qkc2V0UHJvdG90eXBlT2YgPyBfT2JqZWN0JHNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG59O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICBcImRlZmF1bHRcIjogb2JqXG4gIH07XG59O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2dldEl0ZXJhdG9yID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9nZXQtaXRlcmF0b3JcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2lzSXRlcmFibGUgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL2lzLWl0ZXJhYmxlXCIpW1wiZGVmYXVsdFwiXTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSAoZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBzbGljZUl0ZXJhdG9yKGFyciwgaSkge1xuICAgIHZhciBfYXJyID0gW107XG4gICAgdmFyIF9uID0gdHJ1ZTtcbiAgICB2YXIgX2QgPSBmYWxzZTtcbiAgICB2YXIgX2UgPSB1bmRlZmluZWQ7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2kgPSBfZ2V0SXRlcmF0b3IoYXJyKSwgX3M7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHtcbiAgICAgICAgX2Fyci5wdXNoKF9zLnZhbHVlKTtcblxuICAgICAgICBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBfZCA9IHRydWU7XG4gICAgICBfZSA9IGVycjtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCFfbiAmJiBfaVtcInJldHVyblwiXSkgX2lbXCJyZXR1cm5cIl0oKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChfZCkgdGhyb3cgX2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIF9hcnI7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKGFyciwgaSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgIHJldHVybiBhcnI7XG4gICAgfSBlbHNlIGlmIChfaXNJdGVyYWJsZShPYmplY3QoYXJyKSkpIHtcbiAgICAgIHJldHVybiBzbGljZUl0ZXJhdG9yKGFyciwgaSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpO1xuICAgIH1cbiAgfTtcbn0pKCk7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfQXJyYXkkZnJvbSA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvYXJyYXkvZnJvbVwiKVtcImRlZmF1bHRcIl07XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZnVuY3Rpb24gKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgYXJyMltpXSA9IGFycltpXTtcblxuICAgIHJldHVybiBhcnIyO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBfQXJyYXkkZnJvbShhcnIpO1xuICB9XG59O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuYXJyYXkuZnJvbScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzLyQuY29yZScpLkFycmF5LmZyb207IiwicmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvcicpOyIsInJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvY29yZS5pcy1pdGVyYWJsZScpOyIsInJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5tYXAnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM3Lm1hcC50by1qc29uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvJC5jb3JlJykuTWFwOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kLmNvcmUnKS5PYmplY3QuYXNzaWduOyIsInZhciAkID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZShQLCBEKXtcbiAgcmV0dXJuICQuY3JlYXRlKFAsIEQpO1xufTsiLCJ2YXIgJCA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvJCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBkZXNjKXtcbiAgcmV0dXJuICQuc2V0RGVzYyhpdCwga2V5LCBkZXNjKTtcbn07IiwidmFyICQgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzLyQnKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpe1xuICByZXR1cm4gJC5nZXREZXNjKGl0LCBrZXkpO1xufTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3Qua2V5cycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzLyQuY29yZScpLk9iamVjdC5rZXlzOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvJC5jb3JlJykuT2JqZWN0LnNldFByb3RvdHlwZU9mOyIsInJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5wcm9taXNlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvJC5jb3JlJykuUHJvbWlzZTsiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc2V0Jyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5zZXQudG8tanNvbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzLyQuY29yZScpLlNldDsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5zeW1ib2wnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kLmNvcmUnKS5TeW1ib2w7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kLndrcycpKCdpdGVyYXRvcicpOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZih0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZighaXNPYmplY3QoaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXG52YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi8kLnRvLW9iamVjdCcpXG4gICwgSU9iamVjdCAgPSByZXF1aXJlKCcuLyQuaW9iamVjdCcpO1xuXG4vLyBzaG91bGQgd29yayB3aXRoIHN5bWJvbHMgYW5kIHNob3VsZCBoYXZlIGRldGVybWluaXN0aWMgcHJvcGVydHkgb3JkZXIgKFY4IGJ1Zylcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi8kLmZhaWxzJykoZnVuY3Rpb24oKXtcbiAgdmFyIGEgPSBPYmplY3QuYXNzaWduXG4gICAgLCBBID0ge31cbiAgICAsIEIgPSB7fVxuICAgICwgUyA9IFN5bWJvbCgpXG4gICAgLCBLID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0JztcbiAgQVtTXSA9IDc7XG4gIEsuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24oayl7IEJba10gPSBrOyB9KTtcbiAgcmV0dXJuIGEoe30sIEEpW1NdICE9IDcgfHwgT2JqZWN0LmtleXMoYSh7fSwgQikpLmpvaW4oJycpICE9IEs7XG59KSA/IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSl7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgdmFyIFQgICAgID0gdG9PYmplY3QodGFyZ2V0KVxuICAgICwgJCQgICAgPSBhcmd1bWVudHNcbiAgICAsICQkbGVuID0gJCQubGVuZ3RoXG4gICAgLCBpbmRleCA9IDFcbiAgICAsIGdldEtleXMgICAgPSAkLmdldEtleXNcbiAgICAsIGdldFN5bWJvbHMgPSAkLmdldFN5bWJvbHNcbiAgICAsIGlzRW51bSAgICAgPSAkLmlzRW51bTtcbiAgd2hpbGUoJCRsZW4gPiBpbmRleCl7XG4gICAgdmFyIFMgICAgICA9IElPYmplY3QoJCRbaW5kZXgrK10pXG4gICAgICAsIGtleXMgICA9IGdldFN5bWJvbHMgPyBnZXRLZXlzKFMpLmNvbmNhdChnZXRTeW1ib2xzKFMpKSA6IGdldEtleXMoUylcbiAgICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAgICwgaiAgICAgID0gMFxuICAgICAgLCBrZXk7XG4gICAgd2hpbGUobGVuZ3RoID4gailpZihpc0VudW0uY2FsbChTLCBrZXkgPSBrZXlzW2orK10pKVRba2V5XSA9IFNba2V5XTtcbiAgfVxuICByZXR1cm4gVDtcbn0gOiBPYmplY3QuYXNzaWduOyIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi8kLmNvZicpXG4gICwgVEFHID0gcmVxdWlyZSgnLi8kLndrcycpKCd0b1N0cmluZ1RhZycpXG4gIC8vIEVTMyB3cm9uZyBoZXJlXG4gICwgQVJHID0gY29mKGZ1bmN0aW9uKCl7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSAoTyA9IE9iamVjdChpdCkpW1RBR10pID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTsiLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGhpZGUgICAgICAgICA9IHJlcXVpcmUoJy4vJC5oaWRlJylcbiAgLCBjdHggICAgICAgICAgPSByZXF1aXJlKCcuLyQuY3R4JylcbiAgLCBzcGVjaWVzICAgICAgPSByZXF1aXJlKCcuLyQuc3BlY2llcycpXG4gICwgc3RyaWN0TmV3ICAgID0gcmVxdWlyZSgnLi8kLnN0cmljdC1uZXcnKVxuICAsIGRlZmluZWQgICAgICA9IHJlcXVpcmUoJy4vJC5kZWZpbmVkJylcbiAgLCBmb3JPZiAgICAgICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCBzdGVwICAgICAgICAgPSByZXF1aXJlKCcuLyQuaXRlci1zdGVwJylcbiAgLCBJRCAgICAgICAgICAgPSByZXF1aXJlKCcuLyQudWlkJykoJ2lkJylcbiAgLCAkaGFzICAgICAgICAgPSByZXF1aXJlKCcuLyQuaGFzJylcbiAgLCBpc09iamVjdCAgICAgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGlzT2JqZWN0XG4gICwgU1VQUE9SVF9ERVNDID0gcmVxdWlyZSgnLi8kLnN1cHBvcnQtZGVzYycpXG4gICwgU0laRSAgICAgICAgID0gU1VQUE9SVF9ERVNDID8gJ19zJyA6ICdzaXplJ1xuICAsIGlkICAgICAgICAgICA9IDA7XG5cbnZhciBmYXN0S2V5ID0gZnVuY3Rpb24oaXQsIGNyZWF0ZSl7XG4gIC8vIHJldHVybiBwcmltaXRpdmUgd2l0aCBwcmVmaXhcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnID8gaXQgOiAodHlwZW9mIGl0ID09ICdzdHJpbmcnID8gJ1MnIDogJ1AnKSArIGl0O1xuICBpZighJGhhcyhpdCwgSUQpKXtcbiAgICAvLyBjYW4ndCBzZXQgaWQgdG8gZnJvemVuIG9iamVjdFxuICAgIGlmKCFpc0V4dGVuc2libGUoaXQpKXJldHVybiAnRic7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgaWRcbiAgICBpZighY3JlYXRlKXJldHVybiAnRSc7XG4gICAgLy8gYWRkIG1pc3Npbmcgb2JqZWN0IGlkXG4gICAgaGlkZShpdCwgSUQsICsraWQpO1xuICAvLyByZXR1cm4gb2JqZWN0IGlkIHdpdGggcHJlZml4XG4gIH0gcmV0dXJuICdPJyArIGl0W0lEXTtcbn07XG5cbnZhciBnZXRFbnRyeSA9IGZ1bmN0aW9uKHRoYXQsIGtleSl7XG4gIC8vIGZhc3QgY2FzZVxuICB2YXIgaW5kZXggPSBmYXN0S2V5KGtleSksIGVudHJ5O1xuICBpZihpbmRleCAhPT0gJ0YnKXJldHVybiB0aGF0Ll9pW2luZGV4XTtcbiAgLy8gZnJvemVuIG9iamVjdCBjYXNlXG4gIGZvcihlbnRyeSA9IHRoYXQuX2Y7IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xuICAgIGlmKGVudHJ5LmsgPT0ga2V5KXJldHVybiBlbnRyeTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbih3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKXtcbiAgICB2YXIgQyA9IHdyYXBwZXIoZnVuY3Rpb24odGhhdCwgaXRlcmFibGUpe1xuICAgICAgc3RyaWN0TmV3KHRoYXQsIEMsIE5BTUUpO1xuICAgICAgdGhhdC5faSA9ICQuY3JlYXRlKG51bGwpOyAvLyBpbmRleFxuICAgICAgdGhhdC5fZiA9IHVuZGVmaW5lZDsgICAgICAvLyBmaXJzdCBlbnRyeVxuICAgICAgdGhhdC5fbCA9IHVuZGVmaW5lZDsgICAgICAvLyBsYXN0IGVudHJ5XG4gICAgICB0aGF0W1NJWkVdID0gMDsgICAgICAgICAgIC8vIHNpemVcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgfSk7XG4gICAgcmVxdWlyZSgnLi8kLm1peCcpKEMucHJvdG90eXBlLCB7XG4gICAgICAvLyAyMy4xLjMuMSBNYXAucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIC8vIDIzLjIuMy4yIFNldC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCl7XG4gICAgICAgIGZvcih2YXIgdGhhdCA9IHRoaXMsIGRhdGEgPSB0aGF0Ll9pLCBlbnRyeSA9IHRoYXQuX2Y7IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmKGVudHJ5LnApZW50cnkucCA9IGVudHJ5LnAubiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBkZWxldGUgZGF0YVtlbnRyeS5pXTtcbiAgICAgICAgfVxuICAgICAgICB0aGF0Ll9mID0gdGhhdC5fbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhhdFtTSVpFXSA9IDA7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjMgTWFwLnByb3RvdHlwZS5kZWxldGUoa2V5KVxuICAgICAgLy8gMjMuMi4zLjQgU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXG4gICAgICAnZGVsZXRlJzogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgdmFyIHRoYXQgID0gdGhpc1xuICAgICAgICAgICwgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpO1xuICAgICAgICBpZihlbnRyeSl7XG4gICAgICAgICAgdmFyIG5leHQgPSBlbnRyeS5uXG4gICAgICAgICAgICAsIHByZXYgPSBlbnRyeS5wO1xuICAgICAgICAgIGRlbGV0ZSB0aGF0Ll9pW2VudHJ5LmldO1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmKHByZXYpcHJldi5uID0gbmV4dDtcbiAgICAgICAgICBpZihuZXh0KW5leHQucCA9IHByZXY7XG4gICAgICAgICAgaWYodGhhdC5fZiA9PSBlbnRyeSl0aGF0Ll9mID0gbmV4dDtcbiAgICAgICAgICBpZih0aGF0Ll9sID09IGVudHJ5KXRoYXQuX2wgPSBwcmV2O1xuICAgICAgICAgIHRoYXRbU0laRV0tLTtcbiAgICAgICAgfSByZXR1cm4gISFlbnRyeTtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4yLjMuNiBTZXQucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIC8vIDIzLjEuMy41IE1hcC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgZm9yRWFjaDogZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuIC8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcbiAgICAgICAgdmFyIGYgPSBjdHgoY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIDMpXG4gICAgICAgICAgLCBlbnRyeTtcbiAgICAgICAgd2hpbGUoZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGlzLl9mKXtcbiAgICAgICAgICBmKGVudHJ5LnYsIGVudHJ5LmssIHRoaXMpO1xuICAgICAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgICAgIHdoaWxlKGVudHJ5ICYmIGVudHJ5LnIpZW50cnkgPSBlbnRyeS5wO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjcgTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxuICAgICAgLy8gMjMuMi4zLjcgU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXG4gICAgICBoYXM6IGZ1bmN0aW9uIGhhcyhrZXkpe1xuICAgICAgICByZXR1cm4gISFnZXRFbnRyeSh0aGlzLCBrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmKFNVUFBPUlRfREVTQykkLnNldERlc2MoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gZGVmaW5lZCh0aGlzW1NJWkVdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQztcbiAgfSxcbiAgZGVmOiBmdW5jdGlvbih0aGF0LCBrZXksIHZhbHVlKXtcbiAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpXG4gICAgICAsIHByZXYsIGluZGV4O1xuICAgIC8vIGNoYW5nZSBleGlzdGluZyBlbnRyeVxuICAgIGlmKGVudHJ5KXtcbiAgICAgIGVudHJ5LnYgPSB2YWx1ZTtcbiAgICAvLyBjcmVhdGUgbmV3IGVudHJ5XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQuX2wgPSBlbnRyeSA9IHtcbiAgICAgICAgaTogaW5kZXggPSBmYXN0S2V5KGtleSwgdHJ1ZSksIC8vIDwtIGluZGV4XG4gICAgICAgIGs6IGtleSwgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBrZXlcbiAgICAgICAgdjogdmFsdWUsICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXG4gICAgICAgIHA6IHByZXYgPSB0aGF0Ll9sLCAgICAgICAgICAgICAvLyA8LSBwcmV2aW91cyBlbnRyeVxuICAgICAgICBuOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgLy8gPC0gbmV4dCBlbnRyeVxuICAgICAgICByOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gcmVtb3ZlZFxuICAgICAgfTtcbiAgICAgIGlmKCF0aGF0Ll9mKXRoYXQuX2YgPSBlbnRyeTtcbiAgICAgIGlmKHByZXYpcHJldi5uID0gZW50cnk7XG4gICAgICB0aGF0W1NJWkVdKys7XG4gICAgICAvLyBhZGQgdG8gaW5kZXhcbiAgICAgIGlmKGluZGV4ICE9PSAnRicpdGhhdC5faVtpbmRleF0gPSBlbnRyeTtcbiAgICB9IHJldHVybiB0aGF0O1xuICB9LFxuICBnZXRFbnRyeTogZ2V0RW50cnksXG4gIHNldFN0cm9uZzogZnVuY3Rpb24oQywgTkFNRSwgSVNfTUFQKXtcbiAgICAvLyBhZGQgLmtleXMsIC52YWx1ZXMsIC5lbnRyaWVzLCBbQEBpdGVyYXRvcl1cbiAgICAvLyAyMy4xLjMuNCwgMjMuMS4zLjgsIDIzLjEuMy4xMSwgMjMuMS4zLjEyLCAyMy4yLjMuNSwgMjMuMi4zLjgsIDIzLjIuMy4xMCwgMjMuMi4zLjExXG4gICAgcmVxdWlyZSgnLi8kLml0ZXItZGVmaW5lJykoQywgTkFNRSwgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICAgICAgdGhpcy5fdCA9IGl0ZXJhdGVkOyAgLy8gdGFyZ2V0XG4gICAgICB0aGlzLl9rID0ga2luZDsgICAgICAvLyBraW5kXG4gICAgICB0aGlzLl9sID0gdW5kZWZpbmVkOyAvLyBwcmV2aW91c1xuICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgdGhhdCAgPSB0aGlzXG4gICAgICAgICwga2luZCAgPSB0aGF0Ll9rXG4gICAgICAgICwgZW50cnkgPSB0aGF0Ll9sO1xuICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcbiAgICAgIC8vIGdldCBuZXh0IGVudHJ5XG4gICAgICBpZighdGhhdC5fdCB8fCAhKHRoYXQuX2wgPSBlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoYXQuX3QuX2YpKXtcbiAgICAgICAgLy8gb3IgZmluaXNoIHRoZSBpdGVyYXRpb25cbiAgICAgICAgdGhhdC5fdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHN0ZXAoMSk7XG4gICAgICB9XG4gICAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXG4gICAgICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGVudHJ5LmspO1xuICAgICAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBlbnRyeS52KTtcbiAgICAgIHJldHVybiBzdGVwKDAsIFtlbnRyeS5rLCBlbnRyeS52XSk7XG4gICAgfSwgSVNfTUFQID8gJ2VudHJpZXMnIDogJ3ZhbHVlcycgLCAhSVNfTUFQLCB0cnVlKTtcblxuICAgIC8vIGFkZCBbQEBzcGVjaWVzXSwgMjMuMS4yLjIsIDIzLjIuMi4yXG4gICAgc3BlY2llcyhDKTtcbiAgICBzcGVjaWVzKHJlcXVpcmUoJy4vJC5jb3JlJylbTkFNRV0pOyAvLyBmb3Igd3JhcHBlclxuICB9XG59OyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cbnZhciBmb3JPZiAgID0gcmVxdWlyZSgnLi8kLmZvci1vZicpXG4gICwgY2xhc3NvZiA9IHJlcXVpcmUoJy4vJC5jbGFzc29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE5BTUUpe1xuICByZXR1cm4gZnVuY3Rpb24gdG9KU09OKCl7XG4gICAgaWYoY2xhc3NvZih0aGlzKSAhPSBOQU1FKXRocm93IFR5cGVFcnJvcihOQU1FICsgXCIjdG9KU09OIGlzbid0IGdlbmVyaWNcIik7XG4gICAgdmFyIGFyciA9IFtdO1xuICAgIGZvck9mKHRoaXMsIGZhbHNlLCBhcnIucHVzaCwgYXJyKTtcbiAgICByZXR1cm4gYXJyO1xuICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgJGRlZiAgICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIGhpZGUgICAgICAgPSByZXF1aXJlKCcuLyQuaGlkZScpXG4gICwgZm9yT2YgICAgICA9IHJlcXVpcmUoJy4vJC5mb3Itb2YnKVxuICAsIHN0cmljdE5ldyAgPSByZXF1aXJlKCcuLyQuc3RyaWN0LW5ldycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE5BTUUsIHdyYXBwZXIsIG1ldGhvZHMsIGNvbW1vbiwgSVNfTUFQLCBJU19XRUFLKXtcbiAgdmFyIEJhc2UgID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpW05BTUVdXG4gICAgLCBDICAgICA9IEJhc2VcbiAgICAsIEFEREVSID0gSVNfTUFQID8gJ3NldCcgOiAnYWRkJ1xuICAgICwgcHJvdG8gPSBDICYmIEMucHJvdG90eXBlXG4gICAgLCBPICAgICA9IHt9O1xuICBpZighcmVxdWlyZSgnLi8kLnN1cHBvcnQtZGVzYycpIHx8IHR5cGVvZiBDICE9ICdmdW5jdGlvbidcbiAgICB8fCAhKElTX1dFQUsgfHwgcHJvdG8uZm9yRWFjaCAmJiAhcmVxdWlyZSgnLi8kLmZhaWxzJykoZnVuY3Rpb24oKXsgbmV3IEMoKS5lbnRyaWVzKCkubmV4dCgpOyB9KSlcbiAgKXtcbiAgICAvLyBjcmVhdGUgY29sbGVjdGlvbiBjb25zdHJ1Y3RvclxuICAgIEMgPSBjb21tb24uZ2V0Q29uc3RydWN0b3Iod3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUik7XG4gICAgcmVxdWlyZSgnLi8kLm1peCcpKEMucHJvdG90eXBlLCBtZXRob2RzKTtcbiAgfSBlbHNlIHtcbiAgICBDID0gd3JhcHBlcihmdW5jdGlvbih0YXJnZXQsIGl0ZXJhYmxlKXtcbiAgICAgIHN0cmljdE5ldyh0YXJnZXQsIEMsIE5BTUUpO1xuICAgICAgdGFyZ2V0Ll9jID0gbmV3IEJhc2U7XG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGFyZ2V0W0FEREVSXSwgdGFyZ2V0KTtcbiAgICB9KTtcbiAgICAkLmVhY2guY2FsbCgnYWRkLGNsZWFyLGRlbGV0ZSxmb3JFYWNoLGdldCxoYXMsc2V0LGtleXMsdmFsdWVzLGVudHJpZXMnLnNwbGl0KCcsJyksZnVuY3Rpb24oS0VZKXtcbiAgICAgIHZhciBjaGFpbiA9IEtFWSA9PSAnYWRkJyB8fCBLRVkgPT0gJ3NldCc7XG4gICAgICBpZihLRVkgaW4gcHJvdG8gJiYgIShJU19XRUFLICYmIEtFWSA9PSAnY2xlYXInKSloaWRlKEMucHJvdG90eXBlLCBLRVksIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5fY1tLRVldKGEgPT09IDAgPyAwIDogYSwgYik7XG4gICAgICAgIHJldHVybiBjaGFpbiA/IHRoaXMgOiByZXN1bHQ7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZignc2l6ZScgaW4gcHJvdG8pJC5zZXREZXNjKEMucHJvdG90eXBlLCAnc2l6ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Muc2l6ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlcXVpcmUoJy4vJC50YWcnKShDLCBOQU1FKTtcblxuICBPW05BTUVdID0gQztcbiAgJGRlZigkZGVmLkcgKyAkZGVmLlcgKyAkZGVmLkYsIE8pO1xuXG4gIGlmKCFJU19XRUFLKWNvbW1vbi5zZXRTdHJvbmcoQywgTkFNRSwgSVNfTUFQKTtcblxuICByZXR1cm4gQztcbn07IiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHt2ZXJzaW9uOiAnMS4yLjMnfTtcbmlmKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vJC5hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aGF0LCBsZW5ndGgpe1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZih0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xuICBzd2l0Y2gobGVuZ3RoKXtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYil7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59OyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgPSByZXF1aXJlKCcuLyQuY29yZScpXG4gICwgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG52YXIgY3R4ID0gZnVuY3Rpb24oZm4sIHRoYXQpe1xuICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG52YXIgJGRlZiA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBrZXksIG93biwgb3V0LCBleHBcbiAgICAsIGlzR2xvYmFsID0gdHlwZSAmICRkZWYuR1xuICAgICwgaXNQcm90byAgPSB0eXBlICYgJGRlZi5QXG4gICAgLCB0YXJnZXQgICA9IGlzR2xvYmFsID8gZ2xvYmFsIDogdHlwZSAmICRkZWYuU1xuICAgICAgICA/IGdsb2JhbFtuYW1lXSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV1cbiAgICAsIGV4cG9ydHMgID0gaXNHbG9iYWwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KTtcbiAgaWYoaXNHbG9iYWwpc291cmNlID0gbmFtZTtcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICEodHlwZSAmICRkZWYuRikgJiYgdGFyZ2V0ICYmIGtleSBpbiB0YXJnZXQ7XG4gICAgaWYob3duICYmIGtleSBpbiBleHBvcnRzKWNvbnRpbnVlO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gb3duID8gdGFyZ2V0W2tleV0gOiBzb3VyY2Vba2V5XTtcbiAgICAvLyBwcmV2ZW50IGdsb2JhbCBwb2xsdXRpb24gZm9yIG5hbWVzcGFjZXNcbiAgICBpZihpc0dsb2JhbCAmJiB0eXBlb2YgdGFyZ2V0W2tleV0gIT0gJ2Z1bmN0aW9uJylleHAgPSBzb3VyY2Vba2V5XTtcbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIGVsc2UgaWYodHlwZSAmICRkZWYuQiAmJiBvd24pZXhwID0gY3R4KG91dCwgZ2xvYmFsKTtcbiAgICAvLyB3cmFwIGdsb2JhbCBjb25zdHJ1Y3RvcnMgZm9yIHByZXZlbnQgY2hhbmdlIHRoZW0gaW4gbGlicmFyeVxuICAgIGVsc2UgaWYodHlwZSAmICRkZWYuVyAmJiB0YXJnZXRba2V5XSA9PSBvdXQpIWZ1bmN0aW9uKEMpe1xuICAgICAgZXhwID0gZnVuY3Rpb24ocGFyYW0pe1xuICAgICAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIEMgPyBuZXcgQyhwYXJhbSkgOiBDKHBhcmFtKTtcbiAgICAgIH07XG4gICAgICBleHBbUFJPVE9UWVBFXSA9IENbUFJPVE9UWVBFXTtcbiAgICB9KG91dCk7XG4gICAgZWxzZSBleHAgPSBpc1Byb3RvICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4cG9ydFxuICAgIGV4cG9ydHNba2V5XSA9IGV4cDtcbiAgICBpZihpc1Byb3RvKShleHBvcnRzW1BST1RPVFlQRV0gfHwgKGV4cG9ydHNbUFJPVE9UWVBFXSA9IHt9KSlba2V5XSA9IG91dDtcbiAgfVxufTtcbi8vIHR5cGUgYml0bWFwXG4kZGVmLkYgPSAxOyAgLy8gZm9yY2VkXG4kZGVmLkcgPSAyOyAgLy8gZ2xvYmFsXG4kZGVmLlMgPSA0OyAgLy8gc3RhdGljXG4kZGVmLlAgPSA4OyAgLy8gcHJvdG9cbiRkZWYuQiA9IDE2OyAvLyBiaW5kXG4kZGVmLlcgPSAzMjsgLy8gd3JhcFxubW9kdWxlLmV4cG9ydHMgPSAkZGVmOyIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBkb2N1bWVudCA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKS5kb2N1bWVudFxuICAvLyBpbiBvbGQgSUUgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCdcbiAgLCBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTsiLCIvLyBhbGwgZW51bWVyYWJsZSBvYmplY3Qga2V5cywgaW5jbHVkZXMgc3ltYm9sc1xudmFyICQgPSByZXF1aXJlKCcuLyQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICB2YXIga2V5cyAgICAgICA9ICQuZ2V0S2V5cyhpdClcbiAgICAsIGdldFN5bWJvbHMgPSAkLmdldFN5bWJvbHM7XG4gIGlmKGdldFN5bWJvbHMpe1xuICAgIHZhciBzeW1ib2xzID0gZ2V0U3ltYm9scyhpdClcbiAgICAgICwgaXNFbnVtICA9ICQuaXNFbnVtXG4gICAgICAsIGkgICAgICAgPSAwXG4gICAgICAsIGtleTtcbiAgICB3aGlsZShzeW1ib2xzLmxlbmd0aCA+IGkpaWYoaXNFbnVtLmNhbGwoaXQsIGtleSA9IHN5bWJvbHNbaSsrXSkpa2V5cy5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIGtleXM7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59OyIsInZhciBjdHggICAgICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIGNhbGwgICAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXItY2FsbCcpXG4gICwgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuLyQuaXMtYXJyYXktaXRlcicpXG4gICwgYW5PYmplY3QgICAgPSByZXF1aXJlKCcuLyQuYW4tb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgICA9IHJlcXVpcmUoJy4vJC50by1sZW5ndGgnKVxuICAsIGdldEl0ZXJGbiAgID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmFibGUsIGVudHJpZXMsIGZuLCB0aGF0KXtcbiAgdmFyIGl0ZXJGbiA9IGdldEl0ZXJGbihpdGVyYWJsZSlcbiAgICAsIGYgICAgICA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKVxuICAgICwgaW5kZXggID0gMFxuICAgICwgbGVuZ3RoLCBzdGVwLCBpdGVyYXRvcjtcbiAgaWYodHlwZW9mIGl0ZXJGbiAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdGVyYWJsZSArICcgaXMgbm90IGl0ZXJhYmxlIScpO1xuICAvLyBmYXN0IGNhc2UgZm9yIGFycmF5cyB3aXRoIGRlZmF1bHQgaXRlcmF0b3JcbiAgaWYoaXNBcnJheUl0ZXIoaXRlckZuKSlmb3IobGVuZ3RoID0gdG9MZW5ndGgoaXRlcmFibGUubGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4Kyspe1xuICAgIGVudHJpZXMgPyBmKGFuT2JqZWN0KHN0ZXAgPSBpdGVyYWJsZVtpbmRleF0pWzBdLCBzdGVwWzFdKSA6IGYoaXRlcmFibGVbaW5kZXhdKTtcbiAgfSBlbHNlIGZvcihpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKGl0ZXJhYmxlKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyApe1xuICAgIGNhbGwoaXRlcmF0b3IsIGYsIHN0ZXAudmFsdWUsIGVudHJpZXMpO1xuICB9XG59OyIsIi8vIGZhbGxiYWNrIGZvciBJRTExIGJ1Z2d5IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHdpdGggaWZyYW1lIGFuZCB3aW5kb3dcbnZhciB0b1N0cmluZyAgPSB7fS50b1N0cmluZ1xuICAsIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vJC50by1pb2JqZWN0JylcbiAgLCBnZXROYW1lcyAgPSByZXF1aXJlKCcuLyQnKS5nZXROYW1lcztcblxudmFyIHdpbmRvd05hbWVzID0gdHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0JyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc1xuICA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHdpbmRvdykgOiBbXTtcblxudmFyIGdldFdpbmRvd05hbWVzID0gZnVuY3Rpb24oaXQpe1xuICB0cnkge1xuICAgIHJldHVybiBnZXROYW1lcyhpdCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHdpbmRvd05hbWVzLnNsaWNlKCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLmdldCA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpe1xuICBpZih3aW5kb3dOYW1lcyAmJiB0b1N0cmluZy5jYWxsKGl0KSA9PSAnW29iamVjdCBXaW5kb3ddJylyZXR1cm4gZ2V0V2luZG93TmFtZXMoaXQpO1xuICByZXR1cm4gZ2V0TmFtZXModG9JT2JqZWN0KGl0KSk7XG59OyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGYgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYodHlwZW9mIF9fZyA9PSAnbnVtYmVyJylfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIGtleSl7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTsiLCJ2YXIgJCAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vJC5wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5zdXBwb3J0LWRlc2MnKSA/IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIHJldHVybiAkLnNldERlc2Mob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKS5kb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7IiwiLy8gZmFzdCBhcHBseSwgaHR0cDovL2pzcGVyZi5sbmtpdC5jb20vZmFzdC1hcHBseS81XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCBhcmdzLCB0aGF0KXtcbiAgdmFyIHVuID0gdGhhdCA9PT0gdW5kZWZpbmVkO1xuICBzd2l0Y2goYXJncy5sZW5ndGgpe1xuICAgIGNhc2UgMDogcmV0dXJuIHVuID8gZm4oKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0KTtcbiAgICBjYXNlIDE6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICBjYXNlIDQ6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xuICB9IHJldHVybiAgICAgICAgICAgICAgZm4uYXBwbHkodGhhdCwgYXJncyk7XG59OyIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi8kLmNvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTsiLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpXG4gICwgSVRFUkFUT1IgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiAoSXRlcmF0b3JzLkFycmF5IHx8IEFycmF5LnByb3RvdHlwZVtJVEVSQVRPUl0pID09PSBpdDtcbn07IiwiLy8gNy4yLjIgSXNBcnJheShhcmd1bWVudClcbnZhciBjb2YgPSByZXF1aXJlKCcuLyQuY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24oYXJnKXtcbiAgcmV0dXJuIGNvZihhcmcpID09ICdBcnJheSc7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTsiLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLyQuYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpe1xuICB0cnkge1xuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2goZSl7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZihyZXQgIT09IHVuZGVmaW5lZClhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLyQnKVxuICAsIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuLyQuaGlkZScpKEl0ZXJhdG9yUHJvdG90eXBlLCByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCl7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9ICQuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7bmV4dDogcmVxdWlyZSgnLi8kLnByb3BlcnR5LWRlc2MnKSgxLG5leHQpfSk7XG4gIHJlcXVpcmUoJy4vJC50YWcnKShDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgICAgICAgICA9IHJlcXVpcmUoJy4vJC5saWJyYXJ5JylcbiAgLCAkZGVmICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCAkcmVkZWYgICAgICAgICAgPSByZXF1aXJlKCcuLyQucmVkZWYnKVxuICAsIGhpZGUgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5oaWRlJylcbiAgLCBoYXMgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaGFzJylcbiAgLCBTWU1CT0xfSVRFUkFUT1IgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBJdGVyYXRvcnMgICAgICAgPSByZXF1aXJlKCcuLyQuaXRlcmF0b3JzJylcbiAgLCBCVUdHWSAgICAgICAgICAgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSkgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxuICAsIEZGX0lURVJBVE9SICAgICA9ICdAQGl0ZXJhdG9yJ1xuICAsIEtFWVMgICAgICAgICAgICA9ICdrZXlzJ1xuICAsIFZBTFVFUyAgICAgICAgICA9ICd2YWx1ZXMnO1xudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0Upe1xuICByZXF1aXJlKCcuLyQuaXRlci1jcmVhdGUnKShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBjcmVhdGVNZXRob2QgPSBmdW5jdGlvbihraW5kKXtcbiAgICBzd2l0Y2goa2luZCl7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyAgICAgID0gTkFNRSArICcgSXRlcmF0b3InXG4gICAgLCBwcm90byAgICA9IEJhc2UucHJvdG90eXBlXG4gICAgLCBfbmF0aXZlICA9IHByb3RvW1NZTUJPTF9JVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF1cbiAgICAsIF9kZWZhdWx0ID0gX25hdGl2ZSB8fCBjcmVhdGVNZXRob2QoREVGQVVMVClcbiAgICAsIG1ldGhvZHMsIGtleTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZihfbmF0aXZlKXtcbiAgICB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSByZXF1aXJlKCcuLyQnKS5nZXRQcm90byhfZGVmYXVsdC5jYWxsKG5ldyBCYXNlKSk7XG4gICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgIHJlcXVpcmUoJy4vJC50YWcnKShJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAvLyBGRiBmaXhcbiAgICBpZighTElCUkFSWSAmJiBoYXMocHJvdG8sIEZGX0lURVJBVE9SKSloaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBTWU1CT0xfSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZighTElCUkFSWSB8fCBGT1JDRSloaWRlKHByb3RvLCBTWU1CT0xfSVRFUkFUT1IsIF9kZWZhdWx0KTtcbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSBfZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gID0gcmV0dXJuVGhpcztcbiAgaWYoREVGQVVMVCl7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogIERFRkFVTFQgPT0gVkFMVUVTID8gX2RlZmF1bHQgOiBjcmVhdGVNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6ICAgIElTX1NFVCAgICAgICAgICAgID8gX2RlZmF1bHQgOiBjcmVhdGVNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiBERUZBVUxUICE9IFZBTFVFUyA/IF9kZWZhdWx0IDogY3JlYXRlTWV0aG9kKCdlbnRyaWVzJylcbiAgICB9O1xuICAgIGlmKEZPUkNFKWZvcihrZXkgaW4gbWV0aG9kcyl7XG4gICAgICBpZighKGtleSBpbiBwcm90bykpJHJlZGVmKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRkZWYoJGRlZi5QICsgJGRlZi5GICogQlVHR1ksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG59OyIsInZhciBTWU1CT0xfSVRFUkFUT1IgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBTQUZFX0NMT1NJTkcgICAgPSBmYWxzZTtcbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtTWU1CT0xfSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uKCl7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uKCl7IHRocm93IDI7IH0pO1xufSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjLCBza2lwQ2xvc2luZyl7XG4gIGlmKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKXJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyICA9IFs3XVxuICAgICAgLCBpdGVyID0gYXJyW1NZTUJPTF9JVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbigpeyBzYWZlID0gdHJ1ZTsgfTtcbiAgICBhcnJbU1lNQk9MX0lURVJBVE9SXSA9IGZ1bmN0aW9uKCl7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkb25lLCB2YWx1ZSl7XG4gIHJldHVybiB7dmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmV9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHt9OyIsInZhciAkT2JqZWN0ID0gT2JqZWN0O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZTogICAgICRPYmplY3QuY3JlYXRlLFxuICBnZXRQcm90bzogICAkT2JqZWN0LmdldFByb3RvdHlwZU9mLFxuICBpc0VudW06ICAgICB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZSxcbiAgZ2V0RGVzYzogICAgJE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIHNldERlc2M6ICAgICRPYmplY3QuZGVmaW5lUHJvcGVydHksXG4gIHNldERlc2NzOiAgICRPYmplY3QuZGVmaW5lUHJvcGVydGllcyxcbiAgZ2V0S2V5czogICAgJE9iamVjdC5rZXlzLFxuICBnZXROYW1lczogICAkT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMsXG4gIGdldFN5bWJvbHM6ICRPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzLFxuICBlYWNoOiAgICAgICBbXS5mb3JFYWNoXG59OyIsInZhciAkICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vJC50by1pb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgZWwpe1xuICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KG9iamVjdClcbiAgICAsIGtleXMgICA9ICQuZ2V0S2V5cyhPKVxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAsIGluZGV4ICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobGVuZ3RoID4gaW5kZXgpaWYoT1trZXkgPSBrZXlzW2luZGV4KytdXSA9PT0gZWwpcmV0dXJuIGtleTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB0cnVlOyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCBtYWNyb3Rhc2sgPSByZXF1aXJlKCcuLyQudGFzaycpLnNldFxuICAsIE9ic2VydmVyICA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyXG4gICwgcHJvY2VzcyAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBpc05vZGUgICAgPSByZXF1aXJlKCcuLyQuY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnXG4gICwgaGVhZCwgbGFzdCwgbm90aWZ5O1xuXG52YXIgZmx1c2ggPSBmdW5jdGlvbigpe1xuICB2YXIgcGFyZW50LCBkb21haW47XG4gIGlmKGlzTm9kZSAmJiAocGFyZW50ID0gcHJvY2Vzcy5kb21haW4pKXtcbiAgICBwcm9jZXNzLmRvbWFpbiA9IG51bGw7XG4gICAgcGFyZW50LmV4aXQoKTtcbiAgfVxuICB3aGlsZShoZWFkKXtcbiAgICBkb21haW4gPSBoZWFkLmRvbWFpbjtcbiAgICBpZihkb21haW4pZG9tYWluLmVudGVyKCk7XG4gICAgaGVhZC5mbi5jYWxsKCk7IC8vIDwtIGN1cnJlbnRseSB3ZSB1c2UgaXQgb25seSBmb3IgUHJvbWlzZSAtIHRyeSAvIGNhdGNoIG5vdCByZXF1aXJlZFxuICAgIGlmKGRvbWFpbilkb21haW4uZXhpdCgpO1xuICAgIGhlYWQgPSBoZWFkLm5leHQ7XG4gIH0gbGFzdCA9IHVuZGVmaW5lZDtcbiAgaWYocGFyZW50KXBhcmVudC5lbnRlcigpO1xufTtcblxuLy8gTm9kZS5qc1xuaWYoaXNOb2RlKXtcbiAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgfTtcbi8vIGJyb3dzZXJzIHdpdGggTXV0YXRpb25PYnNlcnZlclxufSBlbHNlIGlmKE9ic2VydmVyKXtcbiAgdmFyIHRvZ2dsZSA9IDFcbiAgICAsIG5vZGUgICA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgbmV3IE9ic2VydmVyKGZsdXNoKS5vYnNlcnZlKG5vZGUsIHtjaGFyYWN0ZXJEYXRhOiB0cnVlfSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgbm9kZS5kYXRhID0gdG9nZ2xlID0gLXRvZ2dsZTtcbiAgfTtcbi8vIGZvciBvdGhlciBlbnZpcm9ubWVudHMgLSBtYWNyb3Rhc2sgYmFzZWQgb246XG4vLyAtIHNldEltbWVkaWF0ZVxuLy8gLSBNZXNzYWdlQ2hhbm5lbFxuLy8gLSB3aW5kb3cucG9zdE1lc3NhZ1xuLy8gLSBvbnJlYWR5c3RhdGVjaGFuZ2Vcbi8vIC0gc2V0VGltZW91dFxufSBlbHNlIHtcbiAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICAvLyBzdHJhbmdlIElFICsgd2VicGFjayBkZXYgc2VydmVyIGJ1ZyAtIHVzZSAuY2FsbChnbG9iYWwpXG4gICAgbWFjcm90YXNrLmNhbGwoZ2xvYmFsLCBmbHVzaCk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXNhcChmbil7XG4gIHZhciB0YXNrID0ge2ZuOiBmbiwgbmV4dDogdW5kZWZpbmVkLCBkb21haW46IGlzTm9kZSAmJiBwcm9jZXNzLmRvbWFpbn07XG4gIGlmKGxhc3QpbGFzdC5uZXh0ID0gdGFzaztcbiAgaWYoIWhlYWQpe1xuICAgIGhlYWQgPSB0YXNrO1xuICAgIG5vdGlmeSgpO1xuICB9IGxhc3QgPSB0YXNrO1xufTsiLCJ2YXIgJHJlZGVmID0gcmVxdWlyZSgnLi8kLnJlZGVmJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRhcmdldCwgc3JjKXtcbiAgZm9yKHZhciBrZXkgaW4gc3JjKSRyZWRlZih0YXJnZXQsIGtleSwgc3JjW2tleV0pO1xuICByZXR1cm4gdGFyZ2V0O1xufTsiLCIvLyBtb3N0IE9iamVjdCBtZXRob2RzIGJ5IEVTNiBzaG91bGQgYWNjZXB0IHByaW1pdGl2ZXNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZLCBleGVjKXtcbiAgdmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgICAsIGZuICAgPSAocmVxdWlyZSgnLi8kLmNvcmUnKS5PYmplY3QgfHwge30pW0tFWV0gfHwgT2JqZWN0W0tFWV1cbiAgICAsIGV4cCAgPSB7fTtcbiAgZXhwW0tFWV0gPSBleGVjKGZuKTtcbiAgJGRlZigkZGVmLlMgKyAkZGVmLkYgKiByZXF1aXJlKCcuLyQuZmFpbHMnKShmdW5jdGlvbigpeyBmbigxKTsgfSksICdPYmplY3QnLCBleHApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGJpdG1hcCwgdmFsdWUpe1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGUgIDogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGUgICAgOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlICAgICAgIDogdmFsdWVcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuaGlkZScpOyIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmlzIHx8IGZ1bmN0aW9uIGlzKHgsIHkpe1xuICByZXR1cm4geCA9PT0geSA/IHggIT09IDAgfHwgMSAvIHggPT09IDEgLyB5IDogeCAhPSB4ICYmIHkgIT0geTtcbn07IiwiLy8gV29ya3Mgd2l0aCBfX3Byb3RvX18gb25seS4gT2xkIHY4IGNhbid0IHdvcmsgd2l0aCBudWxsIHByb3RvIG9iamVjdHMuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xudmFyIGdldERlc2MgID0gcmVxdWlyZSgnLi8kJykuZ2V0RGVzY1xuICAsIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi8kLmlzLW9iamVjdCcpXG4gICwgYW5PYmplY3QgPSByZXF1aXJlKCcuLyQuYW4tb2JqZWN0Jyk7XG52YXIgY2hlY2sgPSBmdW5jdGlvbihPLCBwcm90byl7XG4gIGFuT2JqZWN0KE8pO1xuICBpZighaXNPYmplY3QocHJvdG8pICYmIHByb3RvICE9PSBudWxsKXRocm93IFR5cGVFcnJvcihwcm90byArIFwiOiBjYW4ndCBzZXQgYXMgcHJvdG90eXBlIVwiKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgKCdfX3Byb3RvX18nIGluIHt9ID8gLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIGZ1bmN0aW9uKHRlc3QsIGJ1Z2d5LCBzZXQpe1xuICAgICAgdHJ5IHtcbiAgICAgICAgc2V0ID0gcmVxdWlyZSgnLi8kLmN0eCcpKEZ1bmN0aW9uLmNhbGwsIGdldERlc2MoT2JqZWN0LnByb3RvdHlwZSwgJ19fcHJvdG9fXycpLnNldCwgMik7XG4gICAgICAgIHNldCh0ZXN0LCBbXSk7XG4gICAgICAgIGJ1Z2d5ID0gISh0ZXN0IGluc3RhbmNlb2YgQXJyYXkpO1xuICAgICAgfSBjYXRjaChlKXsgYnVnZ3kgPSB0cnVlOyB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pe1xuICAgICAgICBjaGVjayhPLCBwcm90byk7XG4gICAgICAgIGlmKGJ1Z2d5KU8uX19wcm90b19fID0gcHJvdG87XG4gICAgICAgIGVsc2Ugc2V0KE8sIHByb3RvKTtcbiAgICAgICAgcmV0dXJuIE87XG4gICAgICB9O1xuICAgIH0oe30sIGZhbHNlKSA6IHVuZGVmaW5lZCksXG4gIGNoZWNrOiBjaGVja1xufTsiLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXydcbiAgLCBzdG9yZSAgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0ge30pO1xufTsiLCIvLyA3LjMuMjAgU3BlY2llc0NvbnN0cnVjdG9yKE8sIGRlZmF1bHRDb25zdHJ1Y3RvcilcclxudmFyIGFuT2JqZWN0ICA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKVxyXG4gICwgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi8kLmEtZnVuY3Rpb24nKVxyXG4gICwgU1BFQ0lFUyAgID0gcmVxdWlyZSgnLi8kLndrcycpKCdzcGVjaWVzJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTywgRCl7XHJcbiAgdmFyIEMgPSBhbk9iamVjdChPKS5jb25zdHJ1Y3RvciwgUztcclxuICByZXR1cm4gQyA9PT0gdW5kZWZpbmVkIHx8IChTID0gYW5PYmplY3QoQylbU1BFQ0lFU10pID09IHVuZGVmaW5lZCA/IEQgOiBhRnVuY3Rpb24oUyk7XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIFNQRUNJRVMgPSByZXF1aXJlKCcuLyQud2tzJykoJ3NwZWNpZXMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQyl7XG4gIGlmKHJlcXVpcmUoJy4vJC5zdXBwb3J0LWRlc2MnKSAmJiAhKFNQRUNJRVMgaW4gQykpJC5zZXREZXNjKEMsIFNQRUNJRVMsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfVxuICB9KTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgQ29uc3RydWN0b3IsIG5hbWUpe1xuICBpZighKGl0IGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKXRocm93IFR5cGVFcnJvcihuYW1lICsgXCI6IHVzZSB0aGUgJ25ldycgb3BlcmF0b3IhXCIpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi8kLnRvLWludGVnZXInKVxuICAsIGRlZmluZWQgICA9IHJlcXVpcmUoJy4vJC5kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFRPX1NUUklORyl7XG4gIHJldHVybiBmdW5jdGlvbih0aGF0LCBwb3Mpe1xuICAgIHZhciBzID0gU3RyaW5nKGRlZmluZWQodGhhdCkpXG4gICAgICAsIGkgPSB0b0ludGVnZXIocG9zKVxuICAgICAgLCBsID0gcy5sZW5ndGhcbiAgICAgICwgYSwgYjtcbiAgICBpZihpIDwgMCB8fCBpID49IGwpcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbFxuICAgICAgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTsiLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuLyQuZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vJCcpLnNldERlc2NcbiAgLCBoYXMgPSByZXF1aXJlKCcuLyQuaGFzJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuLyQud2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIHRhZywgc3RhdCl7XG4gIGlmKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpZGVmKGl0LCBUQUcsIHtjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWd9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGN0eCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIGludm9rZSAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5pbnZva2UnKVxuICAsIGh0bWwgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5odG1sJylcbiAgLCBjZWwgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZG9tLWNyZWF0ZScpXG4gICwgZ2xvYmFsICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgcHJvY2VzcyAgICAgICAgICAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBzZXRUYXNrICAgICAgICAgICAgPSBnbG9iYWwuc2V0SW1tZWRpYXRlXG4gICwgY2xlYXJUYXNrICAgICAgICAgID0gZ2xvYmFsLmNsZWFySW1tZWRpYXRlXG4gICwgTWVzc2FnZUNoYW5uZWwgICAgID0gZ2xvYmFsLk1lc3NhZ2VDaGFubmVsXG4gICwgY291bnRlciAgICAgICAgICAgID0gMFxuICAsIHF1ZXVlICAgICAgICAgICAgICA9IHt9XG4gICwgT05SRUFEWVNUQVRFQ0hBTkdFID0gJ29ucmVhZHlzdGF0ZWNoYW5nZSdcbiAgLCBkZWZlciwgY2hhbm5lbCwgcG9ydDtcbnZhciBydW4gPSBmdW5jdGlvbigpe1xuICB2YXIgaWQgPSArdGhpcztcbiAgaWYocXVldWUuaGFzT3duUHJvcGVydHkoaWQpKXtcbiAgICB2YXIgZm4gPSBxdWV1ZVtpZF07XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgICBmbigpO1xuICB9XG59O1xudmFyIGxpc3RuZXIgPSBmdW5jdGlvbihldmVudCl7XG4gIHJ1bi5jYWxsKGV2ZW50LmRhdGEpO1xufTtcbi8vIE5vZGUuanMgMC45KyAmIElFMTArIGhhcyBzZXRJbW1lZGlhdGUsIG90aGVyd2lzZTpcbmlmKCFzZXRUYXNrIHx8ICFjbGVhclRhc2spe1xuICBzZXRUYXNrID0gZnVuY3Rpb24gc2V0SW1tZWRpYXRlKGZuKXtcbiAgICB2YXIgYXJncyA9IFtdLCBpID0gMTtcbiAgICB3aGlsZShhcmd1bWVudHMubGVuZ3RoID4gaSlhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xuICAgIHF1ZXVlWysrY291bnRlcl0gPSBmdW5jdGlvbigpe1xuICAgICAgaW52b2tlKHR5cGVvZiBmbiA9PSAnZnVuY3Rpb24nID8gZm4gOiBGdW5jdGlvbihmbiksIGFyZ3MpO1xuICAgIH07XG4gICAgZGVmZXIoY291bnRlcik7XG4gICAgcmV0dXJuIGNvdW50ZXI7XG4gIH07XG4gIGNsZWFyVGFzayA9IGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGlkKXtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICB9O1xuICAvLyBOb2RlLmpzIDAuOC1cbiAgaWYocmVxdWlyZSgnLi8kLmNvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJyl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGN0eChydW4sIGlkLCAxKSk7XG4gICAgfTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBNZXNzYWdlQ2hhbm5lbCwgaW5jbHVkZXMgV2ViV29ya2Vyc1xuICB9IGVsc2UgaWYoTWVzc2FnZUNoYW5uZWwpe1xuICAgIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWw7XG4gICAgcG9ydCAgICA9IGNoYW5uZWwucG9ydDI7XG4gICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBsaXN0bmVyO1xuICAgIGRlZmVyID0gY3R4KHBvcnQucG9zdE1lc3NhZ2UsIHBvcnQsIDEpO1xuICAvLyBCcm93c2VycyB3aXRoIHBvc3RNZXNzYWdlLCBza2lwIFdlYldvcmtlcnNcbiAgLy8gSUU4IGhhcyBwb3N0TWVzc2FnZSwgYnV0IGl0J3Mgc3luYyAmIHR5cGVvZiBpdHMgcG9zdE1lc3NhZ2UgaXMgJ29iamVjdCdcbiAgfSBlbHNlIGlmKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyICYmIHR5cGVvZiBwb3N0TWVzc2FnZSA9PSAnZnVuY3Rpb24nICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cyl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoaWQgKyAnJywgJyonKTtcbiAgICB9O1xuICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgbGlzdG5lciwgZmFsc2UpO1xuICAvLyBJRTgtXG4gIH0gZWxzZSBpZihPTlJFQURZU1RBVEVDSEFOR0UgaW4gY2VsKCdzY3JpcHQnKSl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBodG1sLmFwcGVuZENoaWxkKGNlbCgnc2NyaXB0JykpW09OUkVBRFlTVEFURUNIQU5HRV0gPSBmdW5jdGlvbigpe1xuICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgICAgICBydW4uY2FsbChpZCk7XG4gICAgICB9O1xuICAgIH07XG4gIC8vIFJlc3Qgb2xkIGJyb3dzZXJzXG4gIH0gZWxzZSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBzZXRUaW1lb3V0KGN0eChydW4sIGlkLCAxKSwgMCk7XG4gICAgfTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogICBzZXRUYXNrLFxuICBjbGVhcjogY2xlYXJUYXNrXG59OyIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgID0gTWF0aC5jZWlsXG4gICwgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTsiLCIvLyB0byBpbmRleGVkIG9iamVjdCwgdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi8kLmlvYmplY3QnKVxuICAsIGRlZmluZWQgPSByZXF1aXJlKCcuLyQuZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07IiwiLy8gNy4xLjE1IFRvTGVuZ3RoXG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi8kLnRvLWludGVnZXInKVxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59OyIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi8kLmRlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07IiwidmFyIGlkID0gMFxuICAsIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9OyIsInZhciBzdG9yZSAgPSByZXF1aXJlKCcuLyQuc2hhcmVkJykoJ3drcycpXG4gICwgU3ltYm9sID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpLlN5bWJvbDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmFtZSl7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFN5bWJvbCAmJiBTeW1ib2xbbmFtZV0gfHwgKFN5bWJvbCB8fCByZXF1aXJlKCcuLyQudWlkJykpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07IiwidmFyIGNsYXNzb2YgICA9IHJlcXVpcmUoJy4vJC5jbGFzc29mJylcbiAgLCBJVEVSQVRPUiAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBJdGVyYXRvcnMgPSByZXF1aXJlKCcuLyQuaXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbihpdCl7XG4gIGlmKGl0ICE9IHVuZGVmaW5lZClyZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59OyIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKVxuICAsIGdldCAgICAgID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi8kLmNvcmUnKS5nZXRJdGVyYXRvciA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIGl0ZXJGbiA9IGdldChpdCk7XG4gIGlmKHR5cGVvZiBpdGVyRm4gIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBpdGVyYWJsZSEnKTtcbiAgcmV0dXJuIGFuT2JqZWN0KGl0ZXJGbi5jYWxsKGl0KSk7XG59OyIsInZhciBjbGFzc29mICAgPSByZXF1aXJlKCcuLyQuY2xhc3NvZicpXG4gICwgSVRFUkFUT1IgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXG4gICwgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuY29yZScpLmlzSXRlcmFibGUgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBPID0gT2JqZWN0KGl0KTtcbiAgcmV0dXJuIElURVJBVE9SIGluIE9cbiAgICB8fCAnQEBpdGVyYXRvcicgaW4gT1xuICAgIHx8IEl0ZXJhdG9ycy5oYXNPd25Qcm9wZXJ0eShjbGFzc29mKE8pKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGN0eCAgICAgICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgJGRlZiAgICAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCB0b09iamVjdCAgICA9IHJlcXVpcmUoJy4vJC50by1vYmplY3QnKVxuICAsIGNhbGwgICAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXItY2FsbCcpXG4gICwgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuLyQuaXMtYXJyYXktaXRlcicpXG4gICwgdG9MZW5ndGggICAgPSByZXF1aXJlKCcuLyQudG8tbGVuZ3RoJylcbiAgLCBnZXRJdGVyRm4gICA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG4kZGVmKCRkZWYuUyArICRkZWYuRiAqICFyZXF1aXJlKCcuLyQuaXRlci1kZXRlY3QnKShmdW5jdGlvbihpdGVyKXsgQXJyYXkuZnJvbShpdGVyKTsgfSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4yLjEgQXJyYXkuZnJvbShhcnJheUxpa2UsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICBmcm9tOiBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZS8qLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZCovKXtcbiAgICB2YXIgTyAgICAgICA9IHRvT2JqZWN0KGFycmF5TGlrZSlcbiAgICAgICwgQyAgICAgICA9IHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXlcbiAgICAgICwgJCQgICAgICA9IGFyZ3VtZW50c1xuICAgICAgLCAkJGxlbiAgID0gJCQubGVuZ3RoXG4gICAgICAsIG1hcGZuICAgPSAkJGxlbiA+IDEgPyAkJFsxXSA6IHVuZGVmaW5lZFxuICAgICAgLCBtYXBwaW5nID0gbWFwZm4gIT09IHVuZGVmaW5lZFxuICAgICAgLCBpbmRleCAgID0gMFxuICAgICAgLCBpdGVyRm4gID0gZ2V0SXRlckZuKE8pXG4gICAgICAsIGxlbmd0aCwgcmVzdWx0LCBzdGVwLCBpdGVyYXRvcjtcbiAgICBpZihtYXBwaW5nKW1hcGZuID0gY3R4KG1hcGZuLCAkJGxlbiA+IDIgPyAkJFsyXSA6IHVuZGVmaW5lZCwgMik7XG4gICAgLy8gaWYgb2JqZWN0IGlzbid0IGl0ZXJhYmxlIG9yIGl0J3MgYXJyYXkgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yIC0gdXNlIHNpbXBsZSBjYXNlXG4gICAgaWYoaXRlckZuICE9IHVuZGVmaW5lZCAmJiAhKEMgPT0gQXJyYXkgJiYgaXNBcnJheUl0ZXIoaXRlckZuKSkpe1xuICAgICAgZm9yKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoTyksIHJlc3VsdCA9IG5ldyBDOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7IGluZGV4Kyspe1xuICAgICAgICByZXN1bHRbaW5kZXhdID0gbWFwcGluZyA/IGNhbGwoaXRlcmF0b3IsIG1hcGZuLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKSA6IHN0ZXAudmFsdWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICAgIGZvcihyZXN1bHQgPSBuZXcgQyhsZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKyl7XG4gICAgICAgIHJlc3VsdFtpbmRleF0gPSBtYXBwaW5nID8gbWFwZm4oT1tpbmRleF0sIGluZGV4KSA6IE9baW5kZXhdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQubGVuZ3RoID0gaW5kZXg7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgc2V0VW5zY29wZSA9IHJlcXVpcmUoJy4vJC51bnNjb3BlJylcbiAgLCBzdGVwICAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXItc3RlcCcpXG4gICwgSXRlcmF0b3JzICA9IHJlcXVpcmUoJy4vJC5pdGVyYXRvcnMnKVxuICAsIHRvSU9iamVjdCAgPSByZXF1aXJlKCcuLyQudG8taW9iamVjdCcpO1xuXG4vLyAyMi4xLjMuNCBBcnJheS5wcm90b3R5cGUuZW50cmllcygpXG4vLyAyMi4xLjMuMTMgQXJyYXkucHJvdG90eXBlLmtleXMoKVxuLy8gMjIuMS4zLjI5IEFycmF5LnByb3RvdHlwZS52YWx1ZXMoKVxuLy8gMjIuMS4zLjMwIEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuLyQuaXRlci1kZWZpbmUnKShBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICB0aGlzLl90ID0gdG9JT2JqZWN0KGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAvLyBraW5kXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGtpbmQgID0gdGhpcy5fa1xuICAgICwgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKXtcbiAgICB0aGlzLl90ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiBzdGVwKDEpO1xuICB9XG4gIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgaW5kZXgpO1xuICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xufSwgJ3ZhbHVlcycpO1xuXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xuXG5zZXRVbnNjb3BlKCdrZXlzJyk7XG5zZXRVbnNjb3BlKCd2YWx1ZXMnKTtcbnNldFVuc2NvcGUoJ2VudHJpZXMnKTsiLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24tc3Ryb25nJyk7XG5cbi8vIDIzLjEgTWFwIE9iamVjdHNcbnJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uJykoJ01hcCcsIGZ1bmN0aW9uKGdldCl7XG4gIHJldHVybiBmdW5jdGlvbiBNYXAoKXsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7IH07XG59LCB7XG4gIC8vIDIzLjEuMy42IE1hcC5wcm90b3R5cGUuZ2V0KGtleSlcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoa2V5KXtcbiAgICB2YXIgZW50cnkgPSBzdHJvbmcuZ2V0RW50cnkodGhpcywga2V5KTtcbiAgICByZXR1cm4gZW50cnkgJiYgZW50cnkudjtcbiAgfSxcbiAgLy8gMjMuMS4zLjkgTWFwLnByb3RvdHlwZS5zZXQoa2V5LCB2YWx1ZSlcbiAgc2V0OiBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSl7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodGhpcywga2V5ID09PSAwID8gMCA6IGtleSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcsIHRydWUpOyIsIi8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcblxuJGRlZigkZGVmLlMgKyAkZGVmLkYsICdPYmplY3QnLCB7YXNzaWduOiByZXF1aXJlKCcuLyQuYXNzaWduJyl9KTsiLCIvLyAxOS4xLjIuNiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi8kLnRvLWlvYmplY3QnKTtcblxucmVxdWlyZSgnLi8kLm9iamVjdC1zYXAnKSgnZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJywgZnVuY3Rpb24oJGdldE93blByb3BlcnR5RGVzY3JpcHRvcil7XG4gIHJldHVybiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gICAgcmV0dXJuICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodG9JT2JqZWN0KGl0KSwga2V5KTtcbiAgfTtcbn0pOyIsIi8vIDE5LjEuMi4xNCBPYmplY3Qua2V5cyhPKVxudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi8kLnRvLW9iamVjdCcpO1xuXG5yZXF1aXJlKCcuLyQub2JqZWN0LXNhcCcpKCdrZXlzJywgZnVuY3Rpb24oJGtleXMpe1xuICByZXR1cm4gZnVuY3Rpb24ga2V5cyhpdCl7XG4gICAgcmV0dXJuICRrZXlzKHRvT2JqZWN0KGl0KSk7XG4gIH07XG59KTsiLCIvLyAxOS4xLjMuMTkgT2JqZWN0LnNldFByb3RvdHlwZU9mKE8sIHByb3RvKVxudmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHtzZXRQcm90b3R5cGVPZjogcmVxdWlyZSgnLi8kLnNldC1wcm90bycpLnNldH0pOyIsbnVsbCwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIExJQlJBUlkgICAgPSByZXF1aXJlKCcuLyQubGlicmFyeScpXG4gICwgZ2xvYmFsICAgICA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsIGN0eCAgICAgICAgPSByZXF1aXJlKCcuLyQuY3R4JylcbiAgLCBjbGFzc29mICAgID0gcmVxdWlyZSgnLi8kLmNsYXNzb2YnKVxuICAsICRkZWYgICAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCBpc09iamVjdCAgID0gcmVxdWlyZSgnLi8kLmlzLW9iamVjdCcpXG4gICwgYW5PYmplY3QgICA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKVxuICAsIGFGdW5jdGlvbiAgPSByZXF1aXJlKCcuLyQuYS1mdW5jdGlvbicpXG4gICwgc3RyaWN0TmV3ICA9IHJlcXVpcmUoJy4vJC5zdHJpY3QtbmV3JylcbiAgLCBmb3JPZiAgICAgID0gcmVxdWlyZSgnLi8kLmZvci1vZicpXG4gICwgc2V0UHJvdG8gICA9IHJlcXVpcmUoJy4vJC5zZXQtcHJvdG8nKS5zZXRcbiAgLCBzYW1lICAgICAgID0gcmVxdWlyZSgnLi8kLnNhbWUnKVxuICAsIHNwZWNpZXMgICAgPSByZXF1aXJlKCcuLyQuc3BlY2llcycpXG4gICwgU1BFQ0lFUyAgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnc3BlY2llcycpXG4gICwgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi8kLnNwZWNpZXMtY29uc3RydWN0b3InKVxuICAsIFJFQ09SRCAgICAgPSByZXF1aXJlKCcuLyQudWlkJykoJ3JlY29yZCcpXG4gICwgYXNhcCAgICAgICA9IHJlcXVpcmUoJy4vJC5taWNyb3Rhc2snKVxuICAsIFBST01JU0UgICAgPSAnUHJvbWlzZSdcbiAgLCBwcm9jZXNzICAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBpc05vZGUgICAgID0gY2xhc3NvZihwcm9jZXNzKSA9PSAncHJvY2VzcydcbiAgLCBQICAgICAgICAgID0gZ2xvYmFsW1BST01JU0VdXG4gICwgV3JhcHBlcjtcblxudmFyIHRlc3RSZXNvbHZlID0gZnVuY3Rpb24oc3ViKXtcbiAgdmFyIHRlc3QgPSBuZXcgUChmdW5jdGlvbigpe30pO1xuICBpZihzdWIpdGVzdC5jb25zdHJ1Y3RvciA9IE9iamVjdDtcbiAgcmV0dXJuIFAucmVzb2x2ZSh0ZXN0KSA9PT0gdGVzdDtcbn07XG5cbnZhciB1c2VOYXRpdmUgPSBmdW5jdGlvbigpe1xuICB2YXIgd29ya3MgPSBmYWxzZTtcbiAgZnVuY3Rpb24gUDIoeCl7XG4gICAgdmFyIHNlbGYgPSBuZXcgUCh4KTtcbiAgICBzZXRQcm90byhzZWxmLCBQMi5wcm90b3R5cGUpO1xuICAgIHJldHVybiBzZWxmO1xuICB9XG4gIHRyeSB7XG4gICAgd29ya3MgPSBQICYmIFAucmVzb2x2ZSAmJiB0ZXN0UmVzb2x2ZSgpO1xuICAgIHNldFByb3RvKFAyLCBQKTtcbiAgICBQMi5wcm90b3R5cGUgPSAkLmNyZWF0ZShQLnByb3RvdHlwZSwge2NvbnN0cnVjdG9yOiB7dmFsdWU6IFAyfX0pO1xuICAgIC8vIGFjdHVhbCBGaXJlZm94IGhhcyBicm9rZW4gc3ViY2xhc3Mgc3VwcG9ydCwgdGVzdCB0aGF0XG4gICAgaWYoIShQMi5yZXNvbHZlKDUpLnRoZW4oZnVuY3Rpb24oKXt9KSBpbnN0YW5jZW9mIFAyKSl7XG4gICAgICB3b3JrcyA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBhY3R1YWwgVjggYnVnLCBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDE2MlxuICAgIGlmKHdvcmtzICYmIHJlcXVpcmUoJy4vJC5zdXBwb3J0LWRlc2MnKSl7XG4gICAgICB2YXIgdGhlbmFibGVUaGVuR290dGVuID0gZmFsc2U7XG4gICAgICBQLnJlc29sdmUoJC5zZXREZXNjKHt9LCAndGhlbicsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpeyB0aGVuYWJsZVRoZW5Hb3R0ZW4gPSB0cnVlOyB9XG4gICAgICB9KSk7XG4gICAgICB3b3JrcyA9IHRoZW5hYmxlVGhlbkdvdHRlbjtcbiAgICB9XG4gIH0gY2F0Y2goZSl7IHdvcmtzID0gZmFsc2U7IH1cbiAgcmV0dXJuIHdvcmtzO1xufSgpO1xuXG4vLyBoZWxwZXJzXG52YXIgaXNQcm9taXNlID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXNPYmplY3QoaXQpICYmICh1c2VOYXRpdmUgPyBjbGFzc29mKGl0KSA9PSAnUHJvbWlzZScgOiBSRUNPUkQgaW4gaXQpO1xufTtcbnZhciBzYW1lQ29uc3RydWN0b3IgPSBmdW5jdGlvbihhLCBiKXtcbiAgLy8gbGlicmFyeSB3cmFwcGVyIHNwZWNpYWwgY2FzZVxuICBpZihMSUJSQVJZICYmIGEgPT09IFAgJiYgYiA9PT0gV3JhcHBlcilyZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIHNhbWUoYSwgYik7XG59O1xudmFyIGdldENvbnN0cnVjdG9yID0gZnVuY3Rpb24oQyl7XG4gIHZhciBTID0gYW5PYmplY3QoQylbU1BFQ0lFU107XG4gIHJldHVybiBTICE9IHVuZGVmaW5lZCA/IFMgOiBDO1xufTtcbnZhciBpc1RoZW5hYmxlID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgdGhlbjtcbiAgcmV0dXJuIGlzT2JqZWN0KGl0KSAmJiB0eXBlb2YgKHRoZW4gPSBpdC50aGVuKSA9PSAnZnVuY3Rpb24nID8gdGhlbiA6IGZhbHNlO1xufTtcbnZhciBub3RpZnkgPSBmdW5jdGlvbihyZWNvcmQsIGlzUmVqZWN0KXtcbiAgaWYocmVjb3JkLm4pcmV0dXJuO1xuICByZWNvcmQubiA9IHRydWU7XG4gIHZhciBjaGFpbiA9IHJlY29yZC5jO1xuICBhc2FwKGZ1bmN0aW9uKCl7XG4gICAgdmFyIHZhbHVlID0gcmVjb3JkLnZcbiAgICAgICwgb2sgICAgPSByZWNvcmQucyA9PSAxXG4gICAgICAsIGkgICAgID0gMDtcbiAgICB2YXIgcnVuID0gZnVuY3Rpb24ocmVhY3Qpe1xuICAgICAgdmFyIGNiID0gb2sgPyByZWFjdC5vayA6IHJlYWN0LmZhaWxcbiAgICAgICAgLCByZXQsIHRoZW47XG4gICAgICB0cnkge1xuICAgICAgICBpZihjYil7XG4gICAgICAgICAgaWYoIW9rKXJlY29yZC5oID0gdHJ1ZTtcbiAgICAgICAgICByZXQgPSBjYiA9PT0gdHJ1ZSA/IHZhbHVlIDogY2IodmFsdWUpO1xuICAgICAgICAgIGlmKHJldCA9PT0gcmVhY3QuUCl7XG4gICAgICAgICAgICByZWFjdC5yZWooVHlwZUVycm9yKCdQcm9taXNlLWNoYWluIGN5Y2xlJykpO1xuICAgICAgICAgIH0gZWxzZSBpZih0aGVuID0gaXNUaGVuYWJsZShyZXQpKXtcbiAgICAgICAgICAgIHRoZW4uY2FsbChyZXQsIHJlYWN0LnJlcywgcmVhY3QucmVqKTtcbiAgICAgICAgICB9IGVsc2UgcmVhY3QucmVzKHJldCk7XG4gICAgICAgIH0gZWxzZSByZWFjdC5yZWoodmFsdWUpO1xuICAgICAgfSBjYXRjaChlcnIpe1xuICAgICAgICByZWFjdC5yZWooZXJyKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpcnVuKGNoYWluW2krK10pOyAvLyB2YXJpYWJsZSBsZW5ndGggLSBjYW4ndCB1c2UgZm9yRWFjaFxuICAgIGNoYWluLmxlbmd0aCA9IDA7XG4gICAgcmVjb3JkLm4gPSBmYWxzZTtcbiAgICBpZihpc1JlamVjdClzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgcHJvbWlzZSA9IHJlY29yZC5wXG4gICAgICAgICwgaGFuZGxlciwgY29uc29sZTtcbiAgICAgIGlmKGlzVW5oYW5kbGVkKHByb21pc2UpKXtcbiAgICAgICAgaWYoaXNOb2RlKXtcbiAgICAgICAgICBwcm9jZXNzLmVtaXQoJ3VuaGFuZGxlZFJlamVjdGlvbicsIHZhbHVlLCBwcm9taXNlKTtcbiAgICAgICAgfSBlbHNlIGlmKGhhbmRsZXIgPSBnbG9iYWwub251bmhhbmRsZWRyZWplY3Rpb24pe1xuICAgICAgICAgIGhhbmRsZXIoe3Byb21pc2U6IHByb21pc2UsIHJlYXNvbjogdmFsdWV9KTtcbiAgICAgICAgfSBlbHNlIGlmKChjb25zb2xlID0gZ2xvYmFsLmNvbnNvbGUpICYmIGNvbnNvbGUuZXJyb3Ipe1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvbicsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSByZWNvcmQuYSA9IHVuZGVmaW5lZDtcbiAgICB9LCAxKTtcbiAgfSk7XG59O1xudmFyIGlzVW5oYW5kbGVkID0gZnVuY3Rpb24ocHJvbWlzZSl7XG4gIHZhciByZWNvcmQgPSBwcm9taXNlW1JFQ09SRF1cbiAgICAsIGNoYWluICA9IHJlY29yZC5hIHx8IHJlY29yZC5jXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCByZWFjdDtcbiAgaWYocmVjb3JkLmgpcmV0dXJuIGZhbHNlO1xuICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXtcbiAgICByZWFjdCA9IGNoYWluW2krK107XG4gICAgaWYocmVhY3QuZmFpbCB8fCAhaXNVbmhhbmRsZWQocmVhY3QuUCkpcmV0dXJuIGZhbHNlO1xuICB9IHJldHVybiB0cnVlO1xufTtcbnZhciAkcmVqZWN0ID0gZnVuY3Rpb24odmFsdWUpe1xuICB2YXIgcmVjb3JkID0gdGhpcztcbiAgaWYocmVjb3JkLmQpcmV0dXJuO1xuICByZWNvcmQuZCA9IHRydWU7XG4gIHJlY29yZCA9IHJlY29yZC5yIHx8IHJlY29yZDsgLy8gdW53cmFwXG4gIHJlY29yZC52ID0gdmFsdWU7XG4gIHJlY29yZC5zID0gMjtcbiAgcmVjb3JkLmEgPSByZWNvcmQuYy5zbGljZSgpO1xuICBub3RpZnkocmVjb3JkLCB0cnVlKTtcbn07XG52YXIgJHJlc29sdmUgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHZhciByZWNvcmQgPSB0aGlzXG4gICAgLCB0aGVuO1xuICBpZihyZWNvcmQuZClyZXR1cm47XG4gIHJlY29yZC5kID0gdHJ1ZTtcbiAgcmVjb3JkID0gcmVjb3JkLnIgfHwgcmVjb3JkOyAvLyB1bndyYXBcbiAgdHJ5IHtcbiAgICBpZih0aGVuID0gaXNUaGVuYWJsZSh2YWx1ZSkpe1xuICAgICAgYXNhcChmdW5jdGlvbigpe1xuICAgICAgICB2YXIgd3JhcHBlciA9IHtyOiByZWNvcmQsIGQ6IGZhbHNlfTsgLy8gd3JhcFxuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgY3R4KCRyZXNvbHZlLCB3cmFwcGVyLCAxKSwgY3R4KCRyZWplY3QsIHdyYXBwZXIsIDEpKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAkcmVqZWN0LmNhbGwod3JhcHBlciwgZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWNvcmQudiA9IHZhbHVlO1xuICAgICAgcmVjb3JkLnMgPSAxO1xuICAgICAgbm90aWZ5KHJlY29yZCwgZmFsc2UpO1xuICAgIH1cbiAgfSBjYXRjaChlKXtcbiAgICAkcmVqZWN0LmNhbGwoe3I6IHJlY29yZCwgZDogZmFsc2V9LCBlKTsgLy8gd3JhcFxuICB9XG59O1xuXG4vLyBjb25zdHJ1Y3RvciBwb2x5ZmlsbFxuaWYoIXVzZU5hdGl2ZSl7XG4gIC8vIDI1LjQuMy4xIFByb21pc2UoZXhlY3V0b3IpXG4gIFAgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKXtcbiAgICBhRnVuY3Rpb24oZXhlY3V0b3IpO1xuICAgIHZhciByZWNvcmQgPSB7XG4gICAgICBwOiBzdHJpY3ROZXcodGhpcywgUCwgUFJPTUlTRSksICAgICAgICAgLy8gPC0gcHJvbWlzZVxuICAgICAgYzogW10sICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGF3YWl0aW5nIHJlYWN0aW9uc1xuICAgICAgYTogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGNoZWNrZWQgaW4gaXNVbmhhbmRsZWQgcmVhY3Rpb25zXG4gICAgICBzOiAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gc3RhdGVcbiAgICAgIGQ6IGZhbHNlLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBkb25lXG4gICAgICB2OiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcbiAgICAgIGg6IGZhbHNlLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBoYW5kbGVkIHJlamVjdGlvblxuICAgICAgbjogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIG5vdGlmeVxuICAgIH07XG4gICAgdGhpc1tSRUNPUkRdID0gcmVjb3JkO1xuICAgIHRyeSB7XG4gICAgICBleGVjdXRvcihjdHgoJHJlc29sdmUsIHJlY29yZCwgMSksIGN0eCgkcmVqZWN0LCByZWNvcmQsIDEpKTtcbiAgICB9IGNhdGNoKGVycil7XG4gICAgICAkcmVqZWN0LmNhbGwocmVjb3JkLCBlcnIpO1xuICAgIH1cbiAgfTtcbiAgcmVxdWlyZSgnLi8kLm1peCcpKFAucHJvdG90eXBlLCB7XG4gICAgLy8gMjUuNC41LjMgUHJvbWlzZS5wcm90b3R5cGUudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZClcbiAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKXtcbiAgICAgIHZhciByZWFjdCA9IHtcbiAgICAgICAgb2s6ICAgdHlwZW9mIG9uRnVsZmlsbGVkID09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IHRydWUsXG4gICAgICAgIGZhaWw6IHR5cGVvZiBvblJlamVjdGVkID09ICdmdW5jdGlvbicgID8gb25SZWplY3RlZCAgOiBmYWxzZVxuICAgICAgfTtcbiAgICAgIHZhciBwcm9taXNlID0gcmVhY3QuUCA9IG5ldyAoc3BlY2llc0NvbnN0cnVjdG9yKHRoaXMsIFApKShmdW5jdGlvbihyZXMsIHJlail7XG4gICAgICAgIHJlYWN0LnJlcyA9IHJlcztcbiAgICAgICAgcmVhY3QucmVqID0gcmVqO1xuICAgICAgfSk7XG4gICAgICBhRnVuY3Rpb24ocmVhY3QucmVzKTtcbiAgICAgIGFGdW5jdGlvbihyZWFjdC5yZWopO1xuICAgICAgdmFyIHJlY29yZCA9IHRoaXNbUkVDT1JEXTtcbiAgICAgIHJlY29yZC5jLnB1c2gocmVhY3QpO1xuICAgICAgaWYocmVjb3JkLmEpcmVjb3JkLmEucHVzaChyZWFjdCk7XG4gICAgICBpZihyZWNvcmQucylub3RpZnkocmVjb3JkLCBmYWxzZSk7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9LFxuICAgIC8vIDI1LjQuNS4xIFByb21pc2UucHJvdG90eXBlLmNhdGNoKG9uUmVqZWN0ZWQpXG4gICAgJ2NhdGNoJzogZnVuY3Rpb24ob25SZWplY3RlZCl7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XG4gICAgfVxuICB9KTtcbn1cblxuLy8gZXhwb3J0XG4kZGVmKCRkZWYuRyArICRkZWYuVyArICRkZWYuRiAqICF1c2VOYXRpdmUsIHtQcm9taXNlOiBQfSk7XG5yZXF1aXJlKCcuLyQudGFnJykoUCwgUFJPTUlTRSk7XG5zcGVjaWVzKFApO1xuc3BlY2llcyhXcmFwcGVyID0gcmVxdWlyZSgnLi8kLmNvcmUnKVtQUk9NSVNFXSk7XG5cbi8vIHN0YXRpY3NcbiRkZWYoJGRlZi5TICsgJGRlZi5GICogIXVzZU5hdGl2ZSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNSBQcm9taXNlLnJlamVjdChyKVxuICByZWplY3Q6IGZ1bmN0aW9uIHJlamVjdChyKXtcbiAgICByZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24ocmVzLCByZWopeyByZWoocik7IH0pO1xuICB9XG59KTtcbiRkZWYoJGRlZi5TICsgJGRlZi5GICogKCF1c2VOYXRpdmUgfHwgdGVzdFJlc29sdmUodHJ1ZSkpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC42IFByb21pc2UucmVzb2x2ZSh4KVxuICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKHgpe1xuICAgIHJldHVybiBpc1Byb21pc2UoeCkgJiYgc2FtZUNvbnN0cnVjdG9yKHguY29uc3RydWN0b3IsIHRoaXMpXG4gICAgICA/IHggOiBuZXcgdGhpcyhmdW5jdGlvbihyZXMpeyByZXMoeCk7IH0pO1xuICB9XG59KTtcbiRkZWYoJGRlZi5TICsgJGRlZi5GICogISh1c2VOYXRpdmUgJiYgcmVxdWlyZSgnLi8kLml0ZXItZGV0ZWN0JykoZnVuY3Rpb24oaXRlcil7XG4gIFAuYWxsKGl0ZXIpWydjYXRjaCddKGZ1bmN0aW9uKCl7fSk7XG59KSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjEgUHJvbWlzZS5hbGwoaXRlcmFibGUpXG4gIGFsbDogZnVuY3Rpb24gYWxsKGl0ZXJhYmxlKXtcbiAgICB2YXIgQyAgICAgID0gZ2V0Q29uc3RydWN0b3IodGhpcylcbiAgICAgICwgdmFsdWVzID0gW107XG4gICAgcmV0dXJuIG5ldyBDKGZ1bmN0aW9uKHJlcywgcmVqKXtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgdmFsdWVzLnB1c2gsIHZhbHVlcyk7XG4gICAgICB2YXIgcmVtYWluaW5nID0gdmFsdWVzLmxlbmd0aFxuICAgICAgICAsIHJlc3VsdHMgICA9IEFycmF5KHJlbWFpbmluZyk7XG4gICAgICBpZihyZW1haW5pbmcpJC5lYWNoLmNhbGwodmFsdWVzLCBmdW5jdGlvbihwcm9taXNlLCBpbmRleCl7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICByZXN1bHRzW2luZGV4XSA9IHZhbHVlO1xuICAgICAgICAgIC0tcmVtYWluaW5nIHx8IHJlcyhyZXN1bHRzKTtcbiAgICAgICAgfSwgcmVqKTtcbiAgICAgIH0pO1xuICAgICAgZWxzZSByZXMocmVzdWx0cyk7XG4gICAgfSk7XG4gIH0sXG4gIC8vIDI1LjQuNC40IFByb21pc2UucmFjZShpdGVyYWJsZSlcbiAgcmFjZTogZnVuY3Rpb24gcmFjZShpdGVyYWJsZSl7XG4gICAgdmFyIEMgPSBnZXRDb25zdHJ1Y3Rvcih0aGlzKTtcbiAgICByZXR1cm4gbmV3IEMoZnVuY3Rpb24ocmVzLCByZWope1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4ocmVzLCByZWopO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuLyQuY29sbGVjdGlvbi1zdHJvbmcnKTtcblxuLy8gMjMuMiBTZXQgT2JqZWN0c1xucmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24nKSgnU2V0JywgZnVuY3Rpb24oZ2V0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIFNldCgpeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuMi4zLjEgU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXG4gIGFkZDogZnVuY3Rpb24gYWRkKHZhbHVlKXtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih0aGlzLCB2YWx1ZSA9IHZhbHVlID09PSAwID8gMCA6IHZhbHVlLCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZyk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCAgPSByZXF1aXJlKCcuLyQuc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vJC5pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uKGl0ZXJhdGVkKXtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwgaW5kZXggPSB0aGlzLl9pXG4gICAgLCBwb2ludDtcbiAgaWYoaW5kZXggPj0gTy5sZW5ndGgpcmV0dXJuIHt2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHt2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlfTtcbn0pOyIsIid1c2Ugc3RyaWN0Jztcbi8vIEVDTUFTY3JpcHQgNiBzeW1ib2xzIHNoaW1cbnZhciAkICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgZ2xvYmFsICAgICAgICAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5oYXMnKVxuICAsIFNVUFBPUlRfREVTQyAgID0gcmVxdWlyZSgnLi8kLnN1cHBvcnQtZGVzYycpXG4gICwgJGRlZiAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCAkcmVkZWYgICAgICAgICA9IHJlcXVpcmUoJy4vJC5yZWRlZicpXG4gICwgJGZhaWxzICAgICAgICAgPSByZXF1aXJlKCcuLyQuZmFpbHMnKVxuICAsIHNoYXJlZCAgICAgICAgID0gcmVxdWlyZSgnLi8kLnNoYXJlZCcpXG4gICwgc2V0VGFnICAgICAgICAgPSByZXF1aXJlKCcuLyQudGFnJylcbiAgLCB1aWQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC51aWQnKVxuICAsIHdrcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLndrcycpXG4gICwga2V5T2YgICAgICAgICAgPSByZXF1aXJlKCcuLyQua2V5b2YnKVxuICAsICRuYW1lcyAgICAgICAgID0gcmVxdWlyZSgnLi8kLmdldC1uYW1lcycpXG4gICwgZW51bUtleXMgICAgICAgPSByZXF1aXJlKCcuLyQuZW51bS1rZXlzJylcbiAgLCBpc0FycmF5ICAgICAgICA9IHJlcXVpcmUoJy4vJC5pcy1hcnJheScpXG4gICwgYW5PYmplY3QgICAgICAgPSByZXF1aXJlKCcuLyQuYW4tb2JqZWN0JylcbiAgLCB0b0lPYmplY3QgICAgICA9IHJlcXVpcmUoJy4vJC50by1pb2JqZWN0JylcbiAgLCBjcmVhdGVEZXNjICAgICA9IHJlcXVpcmUoJy4vJC5wcm9wZXJ0eS1kZXNjJylcbiAgLCBnZXREZXNjICAgICAgICA9ICQuZ2V0RGVzY1xuICAsIHNldERlc2MgICAgICAgID0gJC5zZXREZXNjXG4gICwgX2NyZWF0ZSAgICAgICAgPSAkLmNyZWF0ZVxuICAsIGdldE5hbWVzICAgICAgID0gJG5hbWVzLmdldFxuICAsICRTeW1ib2wgICAgICAgID0gZ2xvYmFsLlN5bWJvbFxuICAsICRKU09OICAgICAgICAgID0gZ2xvYmFsLkpTT05cbiAgLCBfc3RyaW5naWZ5ICAgICA9ICRKU09OICYmICRKU09OLnN0cmluZ2lmeVxuICAsIHNldHRlciAgICAgICAgID0gZmFsc2VcbiAgLCBISURERU4gICAgICAgICA9IHdrcygnX2hpZGRlbicpXG4gICwgaXNFbnVtICAgICAgICAgPSAkLmlzRW51bVxuICAsIFN5bWJvbFJlZ2lzdHJ5ID0gc2hhcmVkKCdzeW1ib2wtcmVnaXN0cnknKVxuICAsIEFsbFN5bWJvbHMgICAgID0gc2hhcmVkKCdzeW1ib2xzJylcbiAgLCB1c2VOYXRpdmUgICAgICA9IHR5cGVvZiAkU3ltYm9sID09ICdmdW5jdGlvbidcbiAgLCBPYmplY3RQcm90byAgICA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8vIGZhbGxiYWNrIGZvciBvbGQgQW5kcm9pZCwgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTY4N1xudmFyIHNldFN5bWJvbERlc2MgPSBTVVBQT1JUX0RFU0MgJiYgJGZhaWxzKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBfY3JlYXRlKHNldERlc2Moe30sICdhJywge1xuICAgIGdldDogZnVuY3Rpb24oKXsgcmV0dXJuIHNldERlc2ModGhpcywgJ2EnLCB7dmFsdWU6IDd9KS5hOyB9XG4gIH0pKS5hICE9IDc7XG59KSA/IGZ1bmN0aW9uKGl0LCBrZXksIEQpe1xuICB2YXIgcHJvdG9EZXNjID0gZ2V0RGVzYyhPYmplY3RQcm90bywga2V5KTtcbiAgaWYocHJvdG9EZXNjKWRlbGV0ZSBPYmplY3RQcm90b1trZXldO1xuICBzZXREZXNjKGl0LCBrZXksIEQpO1xuICBpZihwcm90b0Rlc2MgJiYgaXQgIT09IE9iamVjdFByb3RvKXNldERlc2MoT2JqZWN0UHJvdG8sIGtleSwgcHJvdG9EZXNjKTtcbn0gOiBzZXREZXNjO1xuXG52YXIgd3JhcCA9IGZ1bmN0aW9uKHRhZyl7XG4gIHZhciBzeW0gPSBBbGxTeW1ib2xzW3RhZ10gPSBfY3JlYXRlKCRTeW1ib2wucHJvdG90eXBlKTtcbiAgc3ltLl9rID0gdGFnO1xuICBTVVBQT1JUX0RFU0MgJiYgc2V0dGVyICYmIHNldFN5bWJvbERlc2MoT2JqZWN0UHJvdG8sIHRhZywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIGlmKGhhcyh0aGlzLCBISURERU4pICYmIGhhcyh0aGlzW0hJRERFTl0sIHRhZykpdGhpc1tISURERU5dW3RhZ10gPSBmYWxzZTtcbiAgICAgIHNldFN5bWJvbERlc2ModGhpcywgdGFnLCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHN5bTtcbn07XG5cbnZhciBpc1N5bWJvbCA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJztcbn07XG5cbnZhciAkZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBEKXtcbiAgaWYoRCAmJiBoYXMoQWxsU3ltYm9scywga2V5KSl7XG4gICAgaWYoIUQuZW51bWVyYWJsZSl7XG4gICAgICBpZighaGFzKGl0LCBISURERU4pKXNldERlc2MoaXQsIEhJRERFTiwgY3JlYXRlRGVzYygxLCB7fSkpO1xuICAgICAgaXRbSElEREVOXVtrZXldID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSlpdFtISURERU5dW2tleV0gPSBmYWxzZTtcbiAgICAgIEQgPSBfY3JlYXRlKEQsIHtlbnVtZXJhYmxlOiBjcmVhdGVEZXNjKDAsIGZhbHNlKX0pO1xuICAgIH0gcmV0dXJuIHNldFN5bWJvbERlc2MoaXQsIGtleSwgRCk7XG4gIH0gcmV0dXJuIHNldERlc2MoaXQsIGtleSwgRCk7XG59O1xudmFyICRkZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhpdCwgUCl7XG4gIGFuT2JqZWN0KGl0KTtcbiAgdmFyIGtleXMgPSBlbnVtS2V5cyhQID0gdG9JT2JqZWN0KFApKVxuICAgICwgaSAgICA9IDBcbiAgICAsIGwgPSBrZXlzLmxlbmd0aFxuICAgICwga2V5O1xuICB3aGlsZShsID4gaSkkZGVmaW5lUHJvcGVydHkoaXQsIGtleSA9IGtleXNbaSsrXSwgUFtrZXldKTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciAkY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGl0LCBQKXtcbiAgcmV0dXJuIFAgPT09IHVuZGVmaW5lZCA/IF9jcmVhdGUoaXQpIDogJGRlZmluZVByb3BlcnRpZXMoX2NyZWF0ZShpdCksIFApO1xufTtcbnZhciAkcHJvcGVydHlJc0VudW1lcmFibGUgPSBmdW5jdGlvbiBwcm9wZXJ0eUlzRW51bWVyYWJsZShrZXkpe1xuICB2YXIgRSA9IGlzRW51bS5jYWxsKHRoaXMsIGtleSk7XG4gIHJldHVybiBFIHx8ICFoYXModGhpcywga2V5KSB8fCAhaGFzKEFsbFN5bWJvbHMsIGtleSkgfHwgaGFzKHRoaXMsIEhJRERFTikgJiYgdGhpc1tISURERU5dW2tleV1cbiAgICA/IEUgOiB0cnVlO1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpe1xuICB2YXIgRCA9IGdldERlc2MoaXQgPSB0b0lPYmplY3QoaXQpLCBrZXkpO1xuICBpZihEICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICEoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSkpRC5lbnVtZXJhYmxlID0gdHJ1ZTtcbiAgcmV0dXJuIEQ7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCl7XG4gIHZhciBuYW1lcyAgPSBnZXROYW1lcyh0b0lPYmplY3QoaXQpKVxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGkgICAgICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSlpZighaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIGtleSAhPSBISURERU4pcmVzdWx0LnB1c2goa2V5KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgJGdldE93blByb3BlcnR5U3ltYm9scyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhpdCl7XG4gIHZhciBuYW1lcyAgPSBnZXROYW1lcyh0b0lPYmplY3QoaXQpKVxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGkgICAgICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSlpZihoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkpcmVzdWx0LnB1c2goQWxsU3ltYm9sc1trZXldKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgJHN0cmluZ2lmeSA9IGZ1bmN0aW9uIHN0cmluZ2lmeShpdCl7XG4gIHZhciBhcmdzID0gW2l0XVxuICAgICwgaSAgICA9IDFcbiAgICAsICQkICAgPSBhcmd1bWVudHNcbiAgICAsIHJlcGxhY2VyLCAkcmVwbGFjZXI7XG4gIHdoaWxlKCQkLmxlbmd0aCA+IGkpYXJncy5wdXNoKCQkW2krK10pO1xuICByZXBsYWNlciA9IGFyZ3NbMV07XG4gIGlmKHR5cGVvZiByZXBsYWNlciA9PSAnZnVuY3Rpb24nKSRyZXBsYWNlciA9IHJlcGxhY2VyO1xuICBpZigkcmVwbGFjZXIgfHwgIWlzQXJyYXkocmVwbGFjZXIpKXJlcGxhY2VyID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XG4gICAgaWYoJHJlcGxhY2VyKXZhbHVlID0gJHJlcGxhY2VyLmNhbGwodGhpcywga2V5LCB2YWx1ZSk7XG4gICAgaWYoIWlzU3ltYm9sKHZhbHVlKSlyZXR1cm4gdmFsdWU7XG4gIH07XG4gIGFyZ3NbMV0gPSByZXBsYWNlcjtcbiAgcmV0dXJuIF9zdHJpbmdpZnkuYXBwbHkoJEpTT04sIGFyZ3MpO1xufTtcbnZhciBidWdneUpTT04gPSAkZmFpbHMoZnVuY3Rpb24oKXtcbiAgdmFyIFMgPSAkU3ltYm9sKCk7XG4gIC8vIE1TIEVkZ2UgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIHt9XG4gIC8vIFdlYktpdCBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMgbnVsbFxuICAvLyBWOCB0aHJvd3Mgb24gYm94ZWQgc3ltYm9sc1xuICByZXR1cm4gX3N0cmluZ2lmeShbU10pICE9ICdbbnVsbF0nIHx8IF9zdHJpbmdpZnkoe2E6IFN9KSAhPSAne30nIHx8IF9zdHJpbmdpZnkoT2JqZWN0KFMpKSAhPSAne30nO1xufSk7XG5cbi8vIDE5LjQuMS4xIFN5bWJvbChbZGVzY3JpcHRpb25dKVxuaWYoIXVzZU5hdGl2ZSl7XG4gICRTeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2woKXtcbiAgICBpZihpc1N5bWJvbCh0aGlzKSl0aHJvdyBUeXBlRXJyb3IoJ1N5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xuICAgIHJldHVybiB3cmFwKHVpZChhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCkpO1xuICB9O1xuICAkcmVkZWYoJFN5bWJvbC5wcm90b3R5cGUsICd0b1N0cmluZycsIGZ1bmN0aW9uIHRvU3RyaW5nKCl7XG4gICAgcmV0dXJuIHRoaXMuX2s7XG4gIH0pO1xuXG4gIGlzU3ltYm9sID0gZnVuY3Rpb24oaXQpe1xuICAgIHJldHVybiBpdCBpbnN0YW5jZW9mICRTeW1ib2w7XG4gIH07XG5cbiAgJC5jcmVhdGUgICAgID0gJGNyZWF0ZTtcbiAgJC5pc0VudW0gICAgID0gJHByb3BlcnR5SXNFbnVtZXJhYmxlO1xuICAkLmdldERlc2MgICAgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICAkLnNldERlc2MgICAgPSAkZGVmaW5lUHJvcGVydHk7XG4gICQuc2V0RGVzY3MgICA9ICRkZWZpbmVQcm9wZXJ0aWVzO1xuICAkLmdldE5hbWVzICAgPSAkbmFtZXMuZ2V0ID0gJGdldE93blByb3BlcnR5TmFtZXM7XG4gICQuZ2V0U3ltYm9scyA9ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbiAgaWYoU1VQUE9SVF9ERVNDICYmICFyZXF1aXJlKCcuLyQubGlicmFyeScpKXtcbiAgICAkcmVkZWYoT2JqZWN0UHJvdG8sICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICRwcm9wZXJ0eUlzRW51bWVyYWJsZSwgdHJ1ZSk7XG4gIH1cbn1cblxudmFyIHN5bWJvbFN0YXRpY3MgPSB7XG4gIC8vIDE5LjQuMi4xIFN5bWJvbC5mb3Ioa2V5KVxuICAnZm9yJzogZnVuY3Rpb24oa2V5KXtcbiAgICByZXR1cm4gaGFzKFN5bWJvbFJlZ2lzdHJ5LCBrZXkgKz0gJycpXG4gICAgICA/IFN5bWJvbFJlZ2lzdHJ5W2tleV1cbiAgICAgIDogU3ltYm9sUmVnaXN0cnlba2V5XSA9ICRTeW1ib2woa2V5KTtcbiAgfSxcbiAgLy8gMTkuNC4yLjUgU3ltYm9sLmtleUZvcihzeW0pXG4gIGtleUZvcjogZnVuY3Rpb24ga2V5Rm9yKGtleSl7XG4gICAgcmV0dXJuIGtleU9mKFN5bWJvbFJlZ2lzdHJ5LCBrZXkpO1xuICB9LFxuICB1c2VTZXR0ZXI6IGZ1bmN0aW9uKCl7IHNldHRlciA9IHRydWU7IH0sXG4gIHVzZVNpbXBsZTogZnVuY3Rpb24oKXsgc2V0dGVyID0gZmFsc2U7IH1cbn07XG4vLyAxOS40LjIuMiBTeW1ib2wuaGFzSW5zdGFuY2Vcbi8vIDE5LjQuMi4zIFN5bWJvbC5pc0NvbmNhdFNwcmVhZGFibGVcbi8vIDE5LjQuMi40IFN5bWJvbC5pdGVyYXRvclxuLy8gMTkuNC4yLjYgU3ltYm9sLm1hdGNoXG4vLyAxOS40LjIuOCBTeW1ib2wucmVwbGFjZVxuLy8gMTkuNC4yLjkgU3ltYm9sLnNlYXJjaFxuLy8gMTkuNC4yLjEwIFN5bWJvbC5zcGVjaWVzXG4vLyAxOS40LjIuMTEgU3ltYm9sLnNwbGl0XG4vLyAxOS40LjIuMTIgU3ltYm9sLnRvUHJpbWl0aXZlXG4vLyAxOS40LjIuMTMgU3ltYm9sLnRvU3RyaW5nVGFnXG4vLyAxOS40LjIuMTQgU3ltYm9sLnVuc2NvcGFibGVzXG4kLmVhY2guY2FsbCgoXG4gICdoYXNJbnN0YW5jZSxpc0NvbmNhdFNwcmVhZGFibGUsaXRlcmF0b3IsbWF0Y2gscmVwbGFjZSxzZWFyY2gsJyArXG4gICdzcGVjaWVzLHNwbGl0LHRvUHJpbWl0aXZlLHRvU3RyaW5nVGFnLHVuc2NvcGFibGVzJ1xuKS5zcGxpdCgnLCcpLCBmdW5jdGlvbihpdCl7XG4gIHZhciBzeW0gPSB3a3MoaXQpO1xuICBzeW1ib2xTdGF0aWNzW2l0XSA9IHVzZU5hdGl2ZSA/IHN5bSA6IHdyYXAoc3ltKTtcbn0pO1xuXG5zZXR0ZXIgPSB0cnVlO1xuXG4kZGVmKCRkZWYuRyArICRkZWYuVywge1N5bWJvbDogJFN5bWJvbH0pO1xuXG4kZGVmKCRkZWYuUywgJ1N5bWJvbCcsIHN5bWJvbFN0YXRpY3MpO1xuXG4kZGVmKCRkZWYuUyArICRkZWYuRiAqICF1c2VOYXRpdmUsICdPYmplY3QnLCB7XG4gIC8vIDE5LjEuMi4yIE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiAgY3JlYXRlOiAkY3JlYXRlLFxuICAvLyAxOS4xLjIuNCBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiAgZGVmaW5lUHJvcGVydHk6ICRkZWZpbmVQcm9wZXJ0eSxcbiAgLy8gMTkuMS4yLjMgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcylcbiAgZGVmaW5lUHJvcGVydGllczogJGRlZmluZVByb3BlcnRpZXMsXG4gIC8vIDE5LjEuMi42IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICAvLyAxOS4xLjIuNyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxuICBnZXRPd25Qcm9wZXJ0eU5hbWVzOiAkZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgLy8gMTkuMS4yLjggT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhPKVxuICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHNcbn0pO1xuXG4vLyAyNC4zLjIgSlNPTi5zdHJpbmdpZnkodmFsdWUgWywgcmVwbGFjZXIgWywgc3BhY2VdXSlcbiRKU09OICYmICRkZWYoJGRlZi5TICsgJGRlZi5GICogKCF1c2VOYXRpdmUgfHwgYnVnZ3lKU09OKSwgJ0pTT04nLCB7c3RyaW5naWZ5OiAkc3RyaW5naWZ5fSk7XG5cbi8vIDE5LjQuMy41IFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ11cbnNldFRhZygkU3ltYm9sLCAnU3ltYm9sJyk7XG4vLyAyMC4yLjEuOSBNYXRoW0BAdG9TdHJpbmdUYWddXG5zZXRUYWcoTWF0aCwgJ01hdGgnLCB0cnVlKTtcbi8vIDI0LjMuMyBKU09OW0BAdG9TdHJpbmdUYWddXG5zZXRUYWcoZ2xvYmFsLkpTT04sICdKU09OJywgdHJ1ZSk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxudmFyICRkZWYgID0gcmVxdWlyZSgnLi8kLmRlZicpO1xuXG4kZGVmKCRkZWYuUCwgJ01hcCcsIHt0b0pTT046IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uLXRvLWpzb24nKSgnTWFwJyl9KTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgJGRlZiAgPSByZXF1aXJlKCcuLyQuZGVmJyk7XG5cbiRkZWYoJGRlZi5QLCAnU2V0Jywge3RvSlNPTjogcmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24tdG8tanNvbicpKCdTZXQnKX0pOyIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpO1xuSXRlcmF0b3JzLk5vZGVMaXN0ID0gSXRlcmF0b3JzLkhUTUxDb2xsZWN0aW9uID0gSXRlcmF0b3JzLkFycmF5OyIsIi8vIFRoaXMgbWV0aG9kIG9mIG9idGFpbmluZyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdCBuZWVkcyB0byBiZVxuLy8ga2VwdCBpZGVudGljYWwgdG8gdGhlIHdheSBpdCBpcyBvYnRhaW5lZCBpbiBydW50aW1lLmpzXG52YXIgZyA9XG4gIHR5cGVvZiBnbG9iYWwgPT09IFwib2JqZWN0XCIgPyBnbG9iYWwgOlxuICB0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiID8gd2luZG93IDpcbiAgdHlwZW9mIHNlbGYgPT09IFwib2JqZWN0XCIgPyBzZWxmIDogdGhpcztcblxuLy8gVXNlIGBnZXRPd25Qcm9wZXJ0eU5hbWVzYCBiZWNhdXNlIG5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCBjYWxsaW5nXG4vLyBgaGFzT3duUHJvcGVydHlgIG9uIHRoZSBnbG9iYWwgYHNlbGZgIG9iamVjdCBpbiBhIHdvcmtlci4gU2VlICMxODMuXG52YXIgaGFkUnVudGltZSA9IGcucmVnZW5lcmF0b3JSdW50aW1lICYmXG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGcpLmluZGV4T2YoXCJyZWdlbmVyYXRvclJ1bnRpbWVcIikgPj0gMDtcblxuLy8gU2F2ZSB0aGUgb2xkIHJlZ2VuZXJhdG9yUnVudGltZSBpbiBjYXNlIGl0IG5lZWRzIHRvIGJlIHJlc3RvcmVkIGxhdGVyLlxudmFyIG9sZFJ1bnRpbWUgPSBoYWRSdW50aW1lICYmIGcucmVnZW5lcmF0b3JSdW50aW1lO1xuXG4vLyBGb3JjZSByZWV2YWx1dGF0aW9uIG9mIHJ1bnRpbWUuanMuXG5nLnJlZ2VuZXJhdG9yUnVudGltZSA9IHVuZGVmaW5lZDtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9ydW50aW1lXCIpO1xuXG5pZiAoaGFkUnVudGltZSkge1xuICAvLyBSZXN0b3JlIHRoZSBvcmlnaW5hbCBydW50aW1lLlxuICBnLnJlZ2VuZXJhdG9yUnVudGltZSA9IG9sZFJ1bnRpbWU7XG59IGVsc2Uge1xuICAvLyBSZW1vdmUgdGhlIGdsb2JhbCBwcm9wZXJ0eSBhZGRlZCBieSBydW50aW1lLmpzLlxuICB0cnkge1xuICAgIGRlbGV0ZSBnLnJlZ2VuZXJhdG9yUnVudGltZTtcbiAgfSBjYXRjaChlKSB7XG4gICAgZy5yZWdlbmVyYXRvclJ1bnRpbWUgPSB1bmRlZmluZWQ7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiBtb2R1bGUuZXhwb3J0cywgX19lc01vZHVsZTogdHJ1ZSB9O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9tYXN0ZXIvTElDRU5TRSBmaWxlLiBBblxuICogYWRkaXRpb25hbCBncmFudCBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluXG4gKiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfU3ltYm9sID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9zeW1ib2xcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX1N5bWJvbCRpdGVyYXRvciA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvc3ltYm9sL2l0ZXJhdG9yXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9PYmplY3QkY3JlYXRlID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvY3JlYXRlXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9Qcm9taXNlID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9wcm9taXNlXCIpW1wiZGVmYXVsdFwiXTtcblxuIShmdW5jdGlvbiAoZ2xvYmFsKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gdHlwZW9mIF9TeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBfU3ltYm9sJGl0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuXG4gIHZhciBpbk1vZHVsZSA9IHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCI7XG4gIHZhciBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZTtcbiAgaWYgKHJ1bnRpbWUpIHtcbiAgICBpZiAoaW5Nb2R1bGUpIHtcbiAgICAgIC8vIElmIHJlZ2VuZXJhdG9yUnVudGltZSBpcyBkZWZpbmVkIGdsb2JhbGx5IGFuZCB3ZSdyZSBpbiBhIG1vZHVsZSxcbiAgICAgIC8vIG1ha2UgdGhlIGV4cG9ydHMgb2JqZWN0IGlkZW50aWNhbCB0byByZWdlbmVyYXRvclJ1bnRpbWUuXG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IHJ1bnRpbWU7XG4gICAgfVxuICAgIC8vIERvbid0IGJvdGhlciBldmFsdWF0aW5nIHRoZSByZXN0IG9mIHRoaXMgZmlsZSBpZiB0aGUgcnVudGltZSB3YXNcbiAgICAvLyBhbHJlYWR5IGRlZmluZWQgZ2xvYmFsbHkuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRGVmaW5lIHRoZSBydW50aW1lIGdsb2JhbGx5IChhcyBleHBlY3RlZCBieSBnZW5lcmF0ZWQgY29kZSkgYXMgZWl0aGVyXG4gIC8vIG1vZHVsZS5leHBvcnRzIChpZiB3ZSdyZSBpbiBhIG1vZHVsZSkgb3IgYSBuZXcsIGVtcHR5IG9iamVjdC5cbiAgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWUgPSBpbk1vZHVsZSA/IG1vZHVsZS5leHBvcnRzIDoge307XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIGdlbmVyYXRvciA9IF9PYmplY3QkY3JlYXRlKChvdXRlckZuIHx8IEdlbmVyYXRvcikucHJvdG90eXBlKTtcblxuICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmIHx8IG51bGwsIG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKSk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIHJ1bnRpbWUud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9IEdlbmVyYXRvci5wcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgICBwcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgcnVudGltZS5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24gKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvciA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCIgOiBmYWxzZTtcbiAgfTtcblxuICBydW50aW1lLm1hcmsgPSBmdW5jdGlvbiAoZ2VuRnVuKSB7XG4gICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBfT2JqZWN0JGNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYHZhbHVlIGluc3RhbmNlb2YgQXdhaXRBcmd1bWVudGAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuIFNvbWUgbWF5IGNvbnNpZGVyIHRoZSBuYW1lIG9mIHRoaXMgbWV0aG9kIHRvb1xuICAvLyBjdXRlc3ksIGJ1dCB0aGV5IGFyZSBjdXJtdWRnZW9ucy5cbiAgcnVudGltZS5hd3JhcCA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgICByZXR1cm4gbmV3IEF3YWl0QXJndW1lbnQoYXJnKTtcbiAgfTtcblxuICBmdW5jdGlvbiBBd2FpdEFyZ3VtZW50KGFyZykge1xuICAgIHRoaXMuYXJnID0gYXJnO1xuICB9XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IpIHtcbiAgICAvLyBUaGlzIGludm9rZSBmdW5jdGlvbiBpcyB3cml0dGVuIGluIGEgc3R5bGUgdGhhdCBhc3N1bWVzIHNvbWVcbiAgICAvLyBjYWxsaW5nIGZ1bmN0aW9uIChvciBQcm9taXNlKSB3aWxsIGhhbmRsZSBleGNlcHRpb25zLlxuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgdmFyIHJlc3VsdCA9IGdlbmVyYXRvclttZXRob2RdKGFyZyk7XG4gICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBBd2FpdEFyZ3VtZW50ID8gX1Byb21pc2UucmVzb2x2ZSh2YWx1ZS5hcmcpLnRoZW4oaW52b2tlTmV4dCwgaW52b2tlVGhyb3cpIDogX1Byb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbiAodW53cmFwcGVkKSB7XG4gICAgICAgIC8vIFdoZW4gYSB5aWVsZGVkIFByb21pc2UgaXMgcmVzb2x2ZWQsIGl0cyBmaW5hbCB2YWx1ZSBiZWNvbWVzXG4gICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi4gSWYgdGhlIFByb21pc2UgaXMgcmVqZWN0ZWQsIGhvd2V2ZXIsIHRoZVxuICAgICAgICAvLyByZXN1bHQgZm9yIHRoaXMgaXRlcmF0aW9uIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aCB0aGUgc2FtZVxuICAgICAgICAvLyByZWFzb24uIE5vdGUgdGhhdCByZWplY3Rpb25zIG9mIHlpZWxkZWQgUHJvbWlzZXMgYXJlIG5vdFxuICAgICAgICAvLyB0aHJvd24gYmFjayBpbnRvIHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24sIGFzIGlzIHRoZSBjYXNlXG4gICAgICAgIC8vIHdoZW4gYW4gYXdhaXRlZCBQcm9taXNlIGlzIHJlamVjdGVkLiBUaGlzIGRpZmZlcmVuY2UgaW5cbiAgICAgICAgLy8gYmVoYXZpb3IgYmV0d2VlbiB5aWVsZCBhbmQgYXdhaXQgaXMgaW1wb3J0YW50LCBiZWNhdXNlIGl0XG4gICAgICAgIC8vIGFsbG93cyB0aGUgY29uc3VtZXIgdG8gZGVjaWRlIHdoYXQgdG8gZG8gd2l0aCB0aGUgeWllbGRlZFxuICAgICAgICAvLyByZWplY3Rpb24gKHN3YWxsb3cgaXQgYW5kIGNvbnRpbnVlLCBtYW51YWxseSAudGhyb3cgaXQgYmFja1xuICAgICAgICAvLyBpbnRvIHRoZSBnZW5lcmF0b3IsIGFiYW5kb24gaXRlcmF0aW9uLCB3aGF0ZXZlcikuIFdpdGhcbiAgICAgICAgLy8gYXdhaXQsIGJ5IGNvbnRyYXN0LCB0aGVyZSBpcyBubyBvcHBvcnR1bml0eSB0byBleGFtaW5lIHRoZVxuICAgICAgICAvLyByZWplY3Rpb24gcmVhc29uIG91dHNpZGUgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgc28gdGhlXG4gICAgICAgIC8vIG9ubHkgb3B0aW9uIGlzIHRvIHRocm93IGl0IGZyb20gdGhlIGF3YWl0IGV4cHJlc3Npb24sIGFuZFxuICAgICAgICAvLyBsZXQgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiBoYW5kbGUgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSBcIm9iamVjdFwiICYmIHByb2Nlc3MuZG9tYWluKSB7XG4gICAgICBpbnZva2UgPSBwcm9jZXNzLmRvbWFpbi5iaW5kKGludm9rZSk7XG4gICAgfVxuXG4gICAgdmFyIGludm9rZU5leHQgPSBpbnZva2UuYmluZChnZW5lcmF0b3IsIFwibmV4dFwiKTtcbiAgICB2YXIgaW52b2tlVGhyb3cgPSBpbnZva2UuYmluZChnZW5lcmF0b3IsIFwidGhyb3dcIik7XG4gICAgdmFyIGludm9rZVJldHVybiA9IGludm9rZS5iaW5kKGdlbmVyYXRvciwgXCJyZXR1cm5cIik7XG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIHZhciBlbnF1ZXVlUmVzdWx0ID1cbiAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBpbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfSkgOiBuZXcgX1Byb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgcmVzb2x2ZShpbnZva2UobWV0aG9kLCBhcmcpKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBlbnF1ZXVlUmVzdWx0IGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5XG4gICAgICAvLyBsYXRlciBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICBwcmV2aW91c1Byb21pc2UgPSBlbnF1ZXVlUmVzdWx0W1wiY2F0Y2hcIl0oZnVuY3Rpb24gKGlnbm9yZWQpIHt9KTtcblxuICAgICAgcmV0dXJuIGVucXVldWVSZXN1bHQ7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgcnVudGltZS5hc3luYyA9IGZ1bmN0aW9uIChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3Iod3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkpO1xuXG4gICAgcmV0dXJuIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKSA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJyZXR1cm5cIiB8fCBtZXRob2QgPT09IFwidGhyb3dcIiAmJiBkZWxlZ2F0ZS5pdGVyYXRvclttZXRob2RdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIEEgcmV0dXJuIG9yIHRocm93ICh3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gdGhyb3dcbiAgICAgICAgICAgIC8vIG1ldGhvZCkgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cbiAgICAgICAgICAgIHZhciByZXR1cm5NZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltcInJldHVyblwiXTtcbiAgICAgICAgICAgIGlmIChyZXR1cm5NZXRob2QpIHtcbiAgICAgICAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKHJldHVybk1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGFyZyk7XG4gICAgICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHJldHVybiBtZXRob2QgdGhyZXcgYW4gZXhjZXB0aW9uLCBsZXQgdGhhdFxuICAgICAgICAgICAgICAgIC8vIGV4Y2VwdGlvbiBwcmV2YWlsIG92ZXIgdGhlIG9yaWdpbmFsIHJldHVybiBvciB0aHJvdy5cbiAgICAgICAgICAgICAgICBtZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgICAgICAgYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgICAgIC8vIENvbnRpbnVlIHdpdGggdGhlIG91dGVyIHJldHVybiwgbm93IHRoYXQgdGhlIGRlbGVnYXRlXG4gICAgICAgICAgICAgIC8vIGl0ZXJhdG9yIGhhcyBiZWVuIHRlcm1pbmF0ZWQuXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChkZWxlZ2F0ZS5pdGVyYXRvclttZXRob2RdLCBkZWxlZ2F0ZS5pdGVyYXRvciwgYXJnKTtcblxuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgICAgICAgLy8gTGlrZSByZXR1cm5pbmcgZ2VuZXJhdG9yLnRocm93KHVuY2F1Z2h0KSwgYnV0IHdpdGhvdXQgdGhlXG4gICAgICAgICAgICAvLyBvdmVyaGVhZCBvZiBhbiBleHRyYSBmdW5jdGlvbiBjYWxsLlxuICAgICAgICAgICAgbWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgICAgYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIERlbGVnYXRlIGdlbmVyYXRvciByYW4gYW5kIGhhbmRsZWQgaXRzIG93biBleGNlcHRpb25zIHNvXG4gICAgICAgICAgLy8gcmVnYXJkbGVzcyBvZiB3aGF0IHRoZSBtZXRob2Qgd2FzLCB3ZSBjb250aW51ZSBhcyBpZiBpdCBpc1xuICAgICAgICAgIC8vIFwibmV4dFwiIHdpdGggYW4gdW5kZWZpbmVkIGFyZy5cbiAgICAgICAgICBtZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG4gICAgICAgICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG4gICAgICAgICAgICByZXR1cm4gaW5mbztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkKSB7XG4gICAgICAgICAgICBjb250ZXh0LnNlbnQgPSBhcmc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRleHQuc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oYXJnKSkge1xuICAgICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgICBtZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICAgIGFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lID8gR2VuU3RhdGVDb21wbGV0ZWQgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgdmFyIGluZm8gPSB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgaWYgKGNvbnRleHQuZGVsZWdhdGUgJiYgbWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgICAgICAgIGFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGluZm87XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBtZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgcnVudGltZS5rZXlzID0gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsXG4gICAgICAgICAgICBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgcnVudGltZS52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbiByZXNldChza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIHRoaXMuc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uIGRpc3BhdGNoRXhjZXB0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuICAgICAgICByZXR1cm4gISFjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24gYWJydXB0KHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiYgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmICh0eXBlID09PSBcImJyZWFrXCIgfHwgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJiBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJiBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZShyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fCByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uIGZpbmlzaChmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uIF9jYXRjaCh0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24gZGVsZWdhdGVZaWVsZChpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcbn0pKFxuLy8gQW1vbmcgdGhlIHZhcmlvdXMgdHJpY2tzIGZvciBvYnRhaW5pbmcgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbFxuLy8gb2JqZWN0LCB0aGlzIHNlZW1zIHRvIGJlIHRoZSBtb3N0IHJlbGlhYmxlIHRlY2huaXF1ZSB0aGF0IGRvZXMgbm90XG4vLyB1c2UgaW5kaXJlY3QgZXZhbCAod2hpY2ggdmlvbGF0ZXMgQ29udGVudCBTZWN1cml0eSBQb2xpY3kpLlxudHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiA/IGdsb2JhbCA6IHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiA9PT0gXCJvYmplY3RcIiA/IHNlbGYgOiB1bmRlZmluZWQpOyIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICB2YXIgbTtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2Uge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IDA7XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIl19
