(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.wavesUI = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  core: {
    LayerTimeContext     : require('./dist/core/layer-time-context'),
    Layer                : require('./dist/core/layer'),
    namespace            : require('./dist/core/namespace'),
    TimelineTimeContext  : require('./dist/core/timeline-time-context'),
    Timeline             : require('./dist/core/timeline'),
    TrackCollection      : require('./dist/core/track-collection'),
    Track                : require('./dist/core/track'),
  },
  shapes: {
    AnnotatedMarker      : require('./dist/shapes/annotated-marker'),
    AnnotatedSegment     : require('./dist/shapes/annotated-segment'),
    BaseShape            : require('./dist/shapes/base-shape'),
    Cursor               : require('./dist/shapes/cursor'),
    Dot                  : require('./dist/shapes/dot'),
    Line                 : require('./dist/shapes/line'),
    Marker               : require('./dist/shapes/marker'),
    Segment              : require('./dist/shapes/segment'),
    Ticks                : require('./dist/shapes/ticks'),
    TracePath            : require('./dist/shapes/trace-path'),
    TraceDots            : require('./dist/shapes/trace-dots'),
    Waveform             : require('./dist/shapes/waveform'),
  },
  behaviors: {
    BaseBehavior         : require('./dist/behaviors/base-behavior'),
    BreakpointBehavior   : require('./dist/behaviors/breakpoint-behavior'),
    MarkerBehavior       : require('./dist/behaviors/marker-behavior'),
    SegmentBehavior      : require('./dist/behaviors/segment-behavior'),
    TimeContextBehavior  : require('./dist/behaviors/time-context-behavior'),
    TraceBehavior        : require('./dist/behaviors/trace-behavior'),
  },
  interactions: {
    EventSource          : require('./dist/interactions/event-source'),
    Keyboard             : require('./dist/interactions/keyboard'),
    Surface              : require('./dist/interactions/surface'),
    WaveEvent            : require('./dist/interactions/wave-event'),
  },
  // rename folder ?
  states: {
    BaseState            : require('./dist/states/base-state'),
    BrushZoomState       : require('./dist/states/brush-zoom-state'),
    CenteredZoomState    : require('./dist/states/centered-zoom-state'),
    ContextEditionState  : require('./dist/states/context-edition-state'),
    EditionState         : require('./dist/states/edition-state'),
    SelectionState       : require('./dist/states/selection-state'),
    SimpleEditionState   : require('./dist/states/simple-edition-state'),
  },
  helpers: {
    AnnotatedMarkerLayer : require('./dist/helpers/annotated-marker-layer'),
    CursorLayer          : require('./dist/helpers/cursor-layer'),
    BreakpointLayer      : require('./dist/helpers/breakpoint-layer'),
    MarkerLayer          : require('./dist/helpers/marker-layer'),
    SegmentLayer         : require('./dist/helpers/segment-layer'),
    TraceLayer           : require('./dist/helpers/trace-layer'),
    WaveformLayer        : require('./dist/helpers/waveform-layer'),
  },
  axis: {
    AxisLayer            : require('./dist/axis/axis-layer'),
    timeAxisGenerator    : require('./dist/axis/time-axis-generator'),
  },
  utils: {
    format               : require('./dist/utils/format'),
    OrthogonalData       : require('./dist/utils/orthogonal-data'),
    scales               : require('./dist/utils/scales'),
  }
}

},{"./dist/axis/axis-layer":2,"./dist/axis/time-axis-generator":3,"./dist/behaviors/base-behavior":4,"./dist/behaviors/breakpoint-behavior":5,"./dist/behaviors/marker-behavior":6,"./dist/behaviors/segment-behavior":7,"./dist/behaviors/time-context-behavior":8,"./dist/behaviors/trace-behavior":9,"./dist/core/layer":11,"./dist/core/layer-time-context":10,"./dist/core/namespace":12,"./dist/core/timeline":14,"./dist/core/timeline-time-context":13,"./dist/core/track":16,"./dist/core/track-collection":15,"./dist/helpers/annotated-marker-layer":17,"./dist/helpers/breakpoint-layer":18,"./dist/helpers/cursor-layer":19,"./dist/helpers/marker-layer":20,"./dist/helpers/segment-layer":21,"./dist/helpers/trace-layer":22,"./dist/helpers/waveform-layer":23,"./dist/interactions/event-source":24,"./dist/interactions/keyboard":25,"./dist/interactions/surface":26,"./dist/interactions/wave-event":27,"./dist/shapes/annotated-marker":28,"./dist/shapes/annotated-segment":29,"./dist/shapes/base-shape":30,"./dist/shapes/cursor":31,"./dist/shapes/dot":32,"./dist/shapes/line":33,"./dist/shapes/marker":34,"./dist/shapes/segment":35,"./dist/shapes/ticks":36,"./dist/shapes/trace-dots":37,"./dist/shapes/trace-path":38,"./dist/shapes/waveform":39,"./dist/states/base-state":40,"./dist/states/brush-zoom-state":41,"./dist/states/centered-zoom-state":42,"./dist/states/context-edition-state":43,"./dist/states/edition-state":44,"./dist/states/selection-state":45,"./dist/states/simple-edition-state":46,"./dist/utils/format":47,"./dist/utils/orthogonal-data":48,"./dist/utils/scales":49}],2:[function(require,module,exports){
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

/**
 *  Simplified Layer for Axis
 *
 *  This layer should stay into the timeline's visibleArea (no offset)
 *  It also handle it's own data and its updates
 *  `_generateData` is responsible to create some usefull data to visualize
 */

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var AxisLayer = (function (_Layer) {
  _inherits(AxisLayer, _Layer);

  /**
   *  @param {Function} generator - a function to create data according the a timeContext
   *  @param {Object} options - layer options
   */

  function AxisLayer(generator, options) {
    _classCallCheck(this, AxisLayer);

    _get(Object.getPrototypeOf(AxisLayer.prototype), 'constructor', this).call(this, 'entity', [], options);
    this._generator = generator;
  }

  /**
   *  This method is the main difference with a classical layer
   *  This one generates and maintains it's own data
   */

  _createClass(AxisLayer, [{
    key: '_generateData',
    value: function _generateData() {
      var data = this._generator(this.timeContext);
      // prepend first arguments of splice for an apply
      data.unshift(0, this.data[0].length);
      // make sure to keep the same reference
      Array.prototype.splice.apply(this.data[0], data);
    }

    // can't access timeContext from outside
  }, {
    key: 'render',
    value: function render() {
      _get(Object.getPrototypeOf(AxisLayer.prototype), 'render', this).call(this);
    }
  }, {
    key: 'update',
    value: function update() {
      this._generateData();
      _get(Object.getPrototypeOf(AxisLayer.prototype), 'update', this).call(this);
    }

    /**
     *  render the DOM in memory on layer creation to be able to use it before
     *  the layer is actually inserted in the DOM
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
      this.$background.setAttributeNS(null, 'width', '100%');
      this.$background.classList.add('background');
      this.$background.style.fillOpacity = 0;
      this.$background.style.pointerEvents = 'none';
      // create the DOM tree
      this.$el.appendChild(this.$offset);
      this.$offset.appendChild(this.$background);
    }

    /**
     *  updates the context of the layer
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
    }
  }, {
    key: 'stretchRatio',
    set: function set(value) {
      return;
    },
    get: function get() {
      return;
    }
  }, {
    key: 'offset',
    set: function set(value) {
      console.log(value);return;
    },
    get: function get() {
      return;
    }
  }, {
    key: 'start',
    set: function set(value) {
      return;
    },
    get: function get() {
      return;
    }
  }, {
    key: 'duration',
    set: function set(value) {
      return;
    },
    get: function get() {
      return;
    }
  }]);

  return AxisLayer;
})(_coreLayer2['default']);

exports['default'] = AxisLayer;
module.exports = exports['default'];

},{"../core/layer":11,"../core/namespace":12,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = timeGenerator;

var _utilsFormat = require('../utils/format');

/**
 * maybe create a factory to give some parameters
 * create time serie data, to visualize a time scale
 */

function timeGenerator(timeContext) {
  var duration = timeContext.visibleDuration;
  var offset = timeContext.offset;
  var data = [];

  // const min = Math.min(-offset, 0);
  var min = -offset;
  // remove the timeline's offset to keep the layer centered
  var max = duration - offset;

  // define pixels for 1 second
  var ps = timeContext.computedPixelsPerSecond;
  var minStep = 7;

  // define all display information according to the pixelsPerSecond ratio
  var step = undefined,
      type = undefined,
      toFixed = undefined,
      markerModulo = undefined,
      includeModulo = undefined;

  if (ps * 4 > minStep) {
    step = 1; // the step to use to compute time
    toFixed = 0;
    markerModulo = 60; // a timestamp every 5 steps
    includeModulo = 5; // a tick every 5 steps
    type = '60sec';
  }

  if (ps * 2 > minStep) {
    step = 1;
    toFixed = 0;
    markerModulo = 30;
    includeModulo = 2;
    type = '30sec';
  }

  if (ps > minStep) {
    step = 1;
    toFixed = 0;
    markerModulo = 10;
    includeModulo = 1;
    type = 'sec';
  }

  if (ps / 10 > minStep) {
    step = 1 / 10;
    toFixed = 1;
    markerModulo = 10;
    includeModulo = 1;
    type = 'ds';
  }

  if (ps / 100 > minStep) {
    step = 1 / 100;
    toFixed = 2;
    markerModulo = 10;
    includeModulo = 1;
    type = 'cs';
  }

  if (ps / 1000 > minStep) {
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

    var datum = { x: formattedTime, focused: focused };

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
}

module.exports = exports['default'];

},{"../utils/format":47}],4:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _Set = require('babel-runtime/core-js/set')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var BaseBehavior = (function () {
  function BaseBehavior() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BaseBehavior);

    this._selectedItems = new _Set(); // no duplicate in Set
    this._selectedClass = options.selectedClass || 'selected';
    this._layer = null;

    this._params = _Object$assign({}, this.getDefaults(), options);
  }

  _createClass(BaseBehavior, [{
    key: 'initialize',
    value: function initialize(layer) {
      this._layer = layer;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      // clean all items in `this._selectedItems`
    }
  }, {
    key: 'getDefaults',
    value: function getDefaults() {
      return {};
    }
  }, {
    key: 'select',

    /**
     *  @param item {DOMElement} the item to select
     *  @param datum {Object} the related datum (@NOTE remove it ?)
     */
    value: function select($item, datum) {
      $item.classList.add(this.selectedClass);
      this._selectedItems.add($item);
    }

    /**
     *  @param item {DOMElement} the item to select
     *  @param datum {Object} the related datum (@NOTE remove it ?)
     */
  }, {
    key: 'unselect',
    value: function unselect($item, datum) {
      $item.classList.remove(this.selectedClass);
      this._selectedItems['delete']($item);
    }

    /**
     *  @NOTE is this really usefull ?
     *  @param item {DOMElement} the item to select
     *  @param datum {Object} the related datum (@NOTE remove it ?)
     */
  }, {
    key: 'toggleSelection',
    value: function toggleSelection($item, datum) {
      var method = this._selectedItems.has($item) ? 'unselect' : 'select';
      this[method]($item);
    }

    /**
     *  Edition behavior
     */
  }, {
    key: 'edit',
    value: function edit(renderingContext, shape, datum, dx, dy, target) {
      // must be implemented in children
    }
  }, {
    key: 'selectedClass',
    set: function set(value) {
      this._selectedClass = value;
    },
    get: function get() {
      return this._selectedClass;
    }
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

},{"babel-runtime/core-js/object/assign":53,"babel-runtime/core-js/set":60,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/to-consumable-array":68}],5:[function(require,module,exports){
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

},{"./base-behavior":4,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],6:[function(require,module,exports){
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

},{"./base-behavior":4,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],7:[function(require,module,exports){
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

},{"./base-behavior":4,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],8:[function(require,module,exports){
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

},{"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64}],9:[function(require,module,exports){
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

},{"./base-behavior":4,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],10:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utilsScales = require('../utils/scales');

/**
 *  @class LayerTimeContext
 *
 *  A `LayerTimeContext` instance represent a time segment into a `TimelineTimeContext`. It must be attached to a `TimelineTimeContext` (the one of the timeline it belongs to). It relies on its parent's `timeToPixel` (time to pixel transfert function) to create the time to pixel representation of the Layer (the view) it is attached to.
 *
 *  The `layerTimeContext` has four important attributes
 *  - `timeContext.start` represent the time at which temporal data must be represented in the timeline (for instance the begining of a soundfile in a DAW)
 *  - `timeContext.offset` represents offset time of the data in the context of a Layer. (@TODO give a use case example here "crop ?", and/or explain that it's not a common use case)
 *  - `timeContext.duration` is the duration of the view on the data
 *  - `timeContext.stretchRatio` is the stretch applyed to the temporal data contained in the view (this value can be seen as a local zoom on the data, or as a stretch on the time components of the data). When applyed, the stretch ratio maintain the start position of the view in the timeline.
 *
 *
 * + timeline -----------------------------------------------------------------
 * 0         5         10          15          20        25          30 seconds
 * +---+*****************+------------------------------------------+*******+--
 *     |*** soundfile ***|Layer (view on the sound file)            |*******|
 *     +*****************+------------------------------------------+*******+
 *
 *     <---- offset ----><--------------- duration ----------------->
 * <-------- start ----->
 *
 *      The parts of the sound file represented with '*' are hidden from the view
 *
 */

var _utilsScales2 = _interopRequireDefault(_utilsScales);

var LayerTimeContext = (function () {
  function LayerTimeContext(parent) {
    _classCallCheck(this, LayerTimeContext);

    if (!parent) {
      throw new Error('LayerTimeContext must have a parent');
    }

    this.parent = parent;

    this._timeToPixel = null;

    this._start = 0;
    this._duration = parent.visibleDuration;
    this._offset = 0;
    this._stretchRatio = 1;
    // register into the timeline's TimeContext
    this.parent._children.push(this);
  }

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
  }, {
    key: 'start',
    get: function get() {
      return this._start;
    },
    set: function set(value) {
      this._start = value;
    }
  }, {
    key: 'duration',
    get: function get() {
      return this._duration;
    },
    set: function set(value) {
      this._duration = value;
    }
  }, {
    key: 'offset',
    get: function get() {
      return this._offset;
    },
    set: function set(value) {
      this._offset = value;
    }
  }, {
    key: 'stretchRatio',
    get: function get() {
      return this._stretchRatio;
    },
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

    // read only
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

},{"../utils/scales":49,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/interop-require-default":67}],11:[function(require,module,exports){
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
      this.contextShape.update(this._renderingContext, this.timeContext, 0);

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

},{"../behaviors/time-context-behavior":8,"../shapes/segment":35,"../utils/scales":49,"./namespace":12,"babel-runtime/core-js/map":52,"babel-runtime/core-js/object/assign":53,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67,"d3-selection":130,"events":131}],12:[function(require,module,exports){
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

/**
 *  @class ViewTimeContext
 *
 *  A ViewTimeContext instance represents the mapping between the time and the pixel domains
 *
 *  The `TimelineTimeContext` has 3 important attributes:
 *  - `timeContext.timeToPixel` which defines the time to pixel transfert function, itself defined by the `pixelsPerSecond` attribute of the timeline
 *  - `timeContext.offset` defines a decay (in time domain) applied to all the views on the timeline. This allow to navigate inside visibleDurations longer than what can be represented in Layers (views) containers (e.g. horizontal scroll)
 *  - `timeContext.zoom` defines the zoom factor applyed to the timeline
 *
 *  It also maintains an helper (`visibleDuration`) which represent how much time the `tracks` are displaying
 *
 *  It also maintain an array of references to all the LayerTimeContext attached to the timeline to propagate changes on the time to pixel representation
 */

var _utilsScales2 = _interopRequireDefault(_utilsScales);

var TimelineTimeContext = (function () {
  function TimelineTimeContext(pixelsPerSecond, visibleWidth) {
    _classCallCheck(this, TimelineTimeContext);

    this._children = [];

    // @rename to timeToPixel
    this._timeToPixel = null;
    // this._originalXScale = null;

    this._offset = 0;
    this._zoom = 1;
    this._computedPixelsPerSecond = pixelsPerSecond;
    // params
    this._visibleWidth = visibleWidth;
    this._visibleDuration = this.visibleWidth / this._computedPixelsPerSecond;
    this._maintainVisibleDuration = false;

    // create the timeToPixel scale
    var scale = _utilsScales2['default'].linear().domain([0, 1]).range([0, pixelsPerSecond]);

    this.timeToPixel = scale;
    // this.originalXScale = this.timeToPixel.copy();

    this._originalPixelsPerSecond = this._computedPixelsPerSecond;
  }

  _createClass(TimelineTimeContext, [{
    key: '_updateTimeToPixelRange',
    value: function _updateTimeToPixelRange() {
      this._visibleDuration = this.visibleWidth / this._computedPixelsPerSecond;
      this.timeToPixel.range([0, this._computedPixelsPerSecond]);
    }
  }, {
    key: 'pixelsPerSecond',
    get: function get() {
      return this._originalPixelsPerSecond;
    },
    set: function set(value) {
      this._computedPixelsPerSecond = value * this.zoom;
      this._originalPixelsPerSecond = value;
      this._updateTimeToPixelRange();

      // force children scale update
      this._children.forEach(function (child) {
        if (!child._timeToPixel) {
          return;
        }
        child.stretchRatio = child.stretchRatio;
      });
    }
  }, {
    key: 'computedPixelsPerSecond',
    get: function get() {
      return this._computedPixelsPerSecond;
    }
  }, {
    key: 'offset',
    get: function get() {
      return this._offset;
    },
    set: function set(value) {
      this._offset = value;
    }
  }, {
    key: 'zoom',
    get: function get() {
      return this._zoom;
    },
    set: function set(value) {
      // Compute change to propagate to children who have their own timeToPixel
      var ratioChange = value / this._zoom;
      this._zoom = value;
      this._computedPixelsPerSecond = this._originalPixelsPerSecond * value;
      this._updateTimeToPixelRange();

      this._children.forEach(function (child) {
        if (!child._timeToPixel) {
          return;
        }
        child.stretchRatio = child.stretchRatio * ratioChange;
      });
    }
  }, {
    key: 'visibleWidth',
    get: function get() {
      return this._visibleWidth;
    },
    set: function set(value) {
      var widthRatio = value / this.visibleWidth;

      this._visibleWidth = value;
      this._visibleDuration = this.visibleWidth / this._computedPixelsPerSecond;

      if (this.maintainVisibleDuration) {
        this.pixelsPerSecond = this._computedPixelsPerSecond * widthRatio;
      }
    }

    /** @readonly */
  }, {
    key: 'visibleDuration',
    get: function get() {
      return this._visibleDuration;
    }
  }, {
    key: 'maintainVisibleDuration',
    get: function get() {
      return this._maintainVisibleDuration;
    },
    set: function set(bool) {
      this._maintainVisibleDuration = bool;
    }
  }, {
    key: 'timeToPixel',
    get: function get() {
      return this._timeToPixel;
    },
    set: function set(scale) {
      this._timeToPixel = scale;
    }
  }]);

  return TimelineTimeContext;
})();

exports['default'] = TimelineTimeContext;
module.exports = exports['default'];

},{"../utils/scales":49,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/interop-require-default":67}],14:[function(require,module,exports){
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

/**
 * The `timeline` is the main entry point of a temporal visualization, it:
 * - contains factories to manage its `tracks` and `layers`,
 * - get or set the view window overs its `tracks` through `offset`, `zoom`,  * `pixelsPerSecond`, `visibleWidth`,
 * - is the central hub for all user interaction events (keyboard, mouse),
 * - holds the current interaction `state` which defines how the different timeline elements (tracks, layers, shapes) respond to user interactions.
 */

var _trackCollection2 = _interopRequireDefault(_trackCollection);

var Timeline = (function (_events$EventEmitter) {
  _inherits(Timeline, _events$EventEmitter);

  /**
   * Creates a new `Timeline` instance
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
      this.createInteraction(_interactionsKeyboard2['default'], document.body);
    }

    // stores
    this._trackById = {};
    this._groupedLayers = {};

    this.timeContext = new _timelineTimeContext2['default'](pixelsPerSecond, visibleWidth);
  }

  /**
   *  TimeContext accessors
   */

  _createClass(Timeline, [{
    key: 'configureSurface',

    /**
     *  Override the default Surface that is instanciated on each
     *  @param {EventSource} ctor - the constructor to use to build surfaces
     */
    value: function configureSurface(ctor) {
      this._surfaceCtor = ctor;
    }

    /**
     * Factory method to add interaction modules the timeline should listen to.
     * By default, the timeline listen to Keyboard, and instanciate a `Surface` on each container.
     * Can be used to install any interaction implementing the `EventSource` interface
     * @param {EventSource} ctor - the contructor of the interaction module to instanciate
     * @param el {DOMElement} the DOM element to bind to the EventSource module
     * @param options {Object} options to be applied to the ctor (defaults to `{}`)
     */
  }, {
    key: 'createInteraction',
    value: function createInteraction(ctor, el) {
      var _this = this;

      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var interaction = new ctor(el, options);
      interaction.on('event', function (e) {
        return _this._handleEvent(e);
      });
    }

    /**
     * The callback that is used to listen to interactions modules
     * @params {Event} e - a custom event generated by interaction modules
     */
  }, {
    key: '_handleEvent',
    value: function _handleEvent(e) {
      // emit event as a middleware
      this.emit('event', e);
      // propagate to the state
      if (!this._state) {
        return;
      }
      this._state.handleEvent(e);
    }

    /**
     * Changes the state of the timeline
     * @param {BaseState} state - the state in which the timeline must be setted
     */
  }, {
    key: 'add',

    /**
     * Adds a track to the timeline
     * Tracks display a view window on the timeline in theirs own SVG element.
     * @param {Track} track
     */
    value: function add(track) {
      if (this.tracks.indexOf(track) !== -1) {
        throw new Error('track already added to the timeline');
      }

      track.configure(this.timeContext);

      this.tracks.push(track);
      this.createInteraction(this._surfaceCtor, track.$el);
    }

    /**
     *  Removes a track from the timeline
     *  @TODO
     */
  }, {
    key: 'remove',
    value: function remove(track) {}
    // should destroy interaction too, avoid ghost eventListeners

    /**
     *  Creates a new track from the configuration define in `configureTracks`
     *  @param {DOMElement} $el - the element to insert the track inside
     *  @param {Object} options - override the defaults options if necessary
     *  @param {String} [trackId=null] - optionnal id to give to the track, only exists in timeline's context
     *  @return {Track}
     */

  }, {
    key: 'createTrack',
    value: function createTrack($el) {
      var trackHeight = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];
      var trackId = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      var track = new _track3['default']($el, trackHeight);

      if (trackId !== null) {
        if (this._trackById[trackId] !== undefined) {
          throw new Error('trackId: "' + trackId + '" is already used');
        }

        this._trackById[trackId] = track;
      }

      // Add track to the timeline
      this.add(track);
      track.render();
      track.update();

      return track;
    }

    /**
     *  Adds a layer to a track, allow to group track arbitrarily inside groups. Basically a wrapper for `track.add(layer)`
     *  @param {Layer} layer - the layer to add
     *  @param {Track} track - the track to the insert the layer in
     *  @param {String} [groupId='default'] - the group in which associate the layer
     */
  }, {
    key: 'addLayer',
    value: function addLayer(layer, trackOrTrackId) {
      var groupId = arguments.length <= 2 || arguments[2] === undefined ? 'default' : arguments[2];

      var track = trackOrTrackId;

      if (typeof trackOrTrackId === 'string') {
        track = this.getTrackById(trackOrTrackId);
      }

      // creates the `LayerTimeContext` if not present
      if (!layer.timeContext) {
        var timeContext = new _layerTimeContext2['default'](this.timeContext);
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
     *  Removes a layer from its track (the layer is detatched from the DOM but can still be reused)
     *  @param {Layer} layer - the layer to remove
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
     *  Returns a track from it's id
     *  @param {String} trackId
     *  @return {Track}
     */
  }, {
    key: 'getTrackById',
    value: function getTrackById(trackId) {
      return this._trackById[trackId];
    }

    /**
     *  Returns the track containing a given DOM Element, if no match found return null
     *  @param {DOMElement} $el
     *  @return {Track|null}
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
     * Returns an array of layers from their group Id
     * @param {String} groupId
     * @return {Array}
     */
  }, {
    key: 'getLayersByGroup',
    value: function getLayersByGroup(groupId) {
      return this._groupedLayers[groupId];
    }
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
    set: function set(value) {
      this.timeContext.offset = value;
    }
  }, {
    key: 'zoom',
    get: function get() {
      return this.timeContext.zoom;
    },
    set: function set(value) {
      this.timeContext.zoom = value;
    }
  }, {
    key: 'pixelsPerSecond',
    get: function get() {
      return this.timeContext.pixelsPerSecond;
    },
    set: function set(value) {
      this.timeContext.pixelsPerSecond = value;
    }
  }, {
    key: 'visibleWidth',
    get: function get() {
      return this.timeContext.visibleWidth;
    },
    set: function set(value) {
      this.timeContext.visibleWidth = value;
    }
  }, {
    key: 'timeToPixel',
    get: function get() {
      return this.timeContext.timeToPixel;
    }

    /**
     *  @readonly
     */
  }, {
    key: 'visibleDuration',
    get: function get() {
      return this.timeContext.visibleDuration;
    }

    // @NOTE maybe expose as public instead of get/set for nothing...
  }, {
    key: 'maintainVisibleDuration',
    set: function set(bool) {
      this.timeContext.maintainVisibleDuration = bool;
    },
    get: function get() {
      return this.timeContext.maintainVisibleDuration;
    }

    // @readonly - used in track collection
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
      this._state.enter();
    },
    get: function get() {
      return this._state;
    }

    /**
     *  Shortcut to access the Track collection
     *  @return {TrackCollection}
     */
  }, {
    key: 'tracks',
    get: function get() {
      return this._tracks;
    }

    /**
     * Shortcut to access the Layer list
     * @return {Array}
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

},{"../interactions/keyboard":25,"../interactions/surface":26,"./layer-time-context":10,"./timeline-time-context":13,"./track":16,"./track-collection":15,"babel-runtime/core-js/get-iterator":51,"babel-runtime/core-js/symbol/iterator":62,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67,"babel-runtime/regenerator":128,"events":131}],15:[function(require,module,exports){
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

/**
 * The `TrackCollection` class allow to update all timeline's tracks at once
 */

var _layer2 = _interopRequireDefault(_layer);

var TrackCollection = (function (_Array) {
  _inherits(TrackCollection, _Array);

  function TrackCollection(timeline) {
    _classCallCheck(this, TrackCollection);

    _get(Object.getPrototypeOf(TrackCollection.prototype), 'constructor', this).call(this);

    this._timeline = timeline;
  }

  // @TODO
  // this should be in the timeline

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

  }, {
    key: 'render',
    value: function render() {
      this.forEach(function (track) {
        return track.render();
      });
      this._timeline.emit('render');
    }

    // should be update(...layersOrGroups)
  }, {
    key: 'update',
    value: function update(layerOrGroup) {
      var layers = this._getLayersOrGroups(layerOrGroup);
      this.forEach(function (track) {
        return track.update(layers);
      });
      this._timeline.emit('update', layers);
    }
  }, {
    key: 'updateContainer',
    value: function updateContainer(trackOrTrackIds) {
      this.forEach(function (track) {
        return track.updateContainer();
      });
      this._timeline.emit('update:containers');
    }
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

    // access layers
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

},{"./layer":11,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],16:[function(require,module,exports){
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

/**
* As a temporal representation, a track establishes a relation between *time* in seconds and *space* in pixels.
*
* A `Track` instance can have multiple `Layer` instances.
*
* Tracks inside a timeline
*
* A temporal representation can be rendered upon multiple DOM elements, the tracks (eg multiple <li> for a DAW like representation) that belong to the same timeline using the `add` method. These tracks are like windows on the overall and basically unending timeline.
*
* A timeline with 3 tracks:
*
* +-----------------+-------------------------------+-- - -  -  -   -
* |track 1          |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
* +-----------------+-------------------------------+-- - -  -  -   -
* |track 2          |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
* +-----------------+-------------------------------+-- - -  -  -   -
* |track 3          |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
* +-------------------------------------------------+-- - -  -  -   -
*
* +----------------->
* timeline.timeContext.timeToPixel(timeline.timeContext.offset)
*
*                   <------------------------------->
*                   timeline's tracks defaults to 1000px
*                   with a default pixelsPerSecond of 100px/s.
*                   and a default `stretchRatio = 1`
*                   track1 shows 10 seconds of the timeline
*
* Layers inside a track
*
* Within a track, a `Layer` keeps up-to-date and renders the data. The track's `add` method adds a `Layer` instance to a track. A Layer
*
* The track renderingContext
*
* When one modify the timeline renderingContext:
* - timeline.renderingContext.offset (in seconds) modify the containers track x position
* - timeline.renderingContext.stretchRatio modify timeline's zoom
* Each time you set new value of offset or stretchRatio, you need to do `timeline.update()` to update the values.
* Track SVG structure
* <svg class="track" xmlns:xhtml="http://www.w3.org/1999/xhtml" height="100" shape-rendering="optimizeSpeed">
*  <defs></defs> Unused for the moment, could be used to define custom shapes for use with layers
*  <rect style="fill-opacity:0" width="100%" height="100%"></rect>
*  <g class="offset">
*    <g class="layout"></g> The layers are inserted here
*  </g>
*  <g class="interactions"></g> Placeholder to visualize interactions (eg. brush)
* </svg>
*/

var _namespace2 = _interopRequireDefault(_namespace);

var Track = (function () {
  function Track($el) {
    var height = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];

    _classCallCheck(this, Track);

    this.$el = $el;
    this.layers = [];
    this._height = height;

    // are set when added to the timeline
    this.renderingContext = null;

    this._createContainer();
  }

  _createClass(Track, [{
    key: 'configure',

    // @NOTE: propagate to layers, keeping ratio ?

    /**
     * This method is called when the track is added to the timeline
     * The track cannot be updated without being added to a timeline
     */
    value: function configure(renderingContext) {
      this.renderingContext = renderingContext;
    }

    /**
     * Destroy a track
     * The layers from this track can still be reused elsewhere
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
     * Creates the container for the track
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
      $background.setAttributeNS(null, 'style', 'fill-opacity:0');

      var $defs = document.createElementNS(_namespace2['default'], 'defs');

      var $offsetGroup = document.createElementNS(_namespace2['default'], 'g');
      $offsetGroup.classList.add('offset');

      var $layoutGroup = document.createElementNS(_namespace2['default'], 'g');
      $layoutGroup.classList.add('layout');

      var $interactionsGroup = document.createElementNS(_namespace2['default'], 'g');
      $interactionsGroup.classList.add('interactions');

      $svg.appendChild($defs);
      $svg.appendChild($background);
      $offsetGroup.appendChild($layoutGroup);
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
     * Adds a layer to the track
     */
  }, {
    key: 'add',
    value: function add(layer) {
      this.layers.push(layer);
      // Create a default renderingContext for the layer if missing
      this.$layout.appendChild(layer.$el);
    }

    /**
     * Removes a layer
     */
  }, {
    key: 'remove',
    value: function remove(layer) {
      this.layers.splice(this.layers.indexOf(layer), 1);
      // Removes layer from its container
      this.$layout.removeChild(layer.$el);
    }

    /**
     * Draw tracks, and the layers in cascade
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
     * Update the layers
     */
  }, {
    key: 'update',
    value: function update() {
      var layers = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      this.updateContainer();
      this.updateLayers(layers);
    }
  }, {
    key: 'updateContainer',
    value: function updateContainer() {
      var $svg = this.$svg;
      var $offset = this.$offset;
      // Should be in some update layout
      var renderingContext = this.renderingContext;
      var height = this.height;
      var width = renderingContext.visibleWidth;
      var offsetX = renderingContext.timeToPixel(renderingContext.offset);
      var translate = 'translate(' + offsetX + ', 0)';

      $svg.setAttributeNS(null, 'height', height);
      $svg.setAttributeNS(null, 'width', width);
      $svg.setAttributeNS(null, 'viewbox', '0 0 ' + width + ' ' + height);

      $offset.setAttributeNS(null, 'transform', translate);
    }
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
    set: function set(value) {
      this._height = value;
    }
  }]);

  return Track;
})();

exports['default'] = Track;
module.exports = exports['default'];

},{"./namespace":12,"babel-runtime/core-js/get-iterator":51,"babel-runtime/core-js/symbol/iterator":62,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/interop-require-default":67,"babel-runtime/regenerator":128}],17:[function(require,module,exports){
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

var AnnotatedMarkerLayer = (function (_Layer) {
  _inherits(AnnotatedMarkerLayer, _Layer);

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

},{"../behaviors/marker-behavior":6,"../core/layer":11,"../shapes/annotated-marker":28,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],18:[function(require,module,exports){
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

var BreakpointLayer = (function (_Layer) {
  _inherits(BreakpointLayer, _Layer);

  function BreakpointLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var accessors = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, BreakpointLayer);

    _get(Object.getPrototypeOf(BreakpointLayer.prototype), 'constructor', this).call(this, 'collection', data, options);

    var color = options.color;

    if (color) {
      accessors.color = function () {
        return color;
      };
    }

    this.configureCommonShape(_shapesLine2['default'], accessors, { color: color });
    this.configureShape(_shapesDot2['default'], accessors, {});
    this.setBehavior(new _behaviorsBreakpointBehavior2['default']());
  }

  return BreakpointLayer;
})(_coreLayer2['default']);

exports['default'] = BreakpointLayer;
module.exports = exports['default'];

},{"../behaviors/breakpoint-behavior":5,"../core/layer":11,"../shapes/dot":32,"../shapes/line":33,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],19:[function(require,module,exports){
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

var CursorLayer = (function (_Layer) {
  _inherits(CursorLayer, _Layer);

  function CursorLayer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, CursorLayer);

    var data = { currentPosition: 0 };
    options = _Object$assign({ color: 'red' }, options);

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

},{"../core/layer":11,"../shapes/cursor":31,"babel-runtime/core-js/object/assign":53,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],20:[function(require,module,exports){
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

var MarkerLayer = (function (_Layer) {
  _inherits(MarkerLayer, _Layer);

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

},{"../behaviors/marker-behavior":6,"../core/layer":11,"../shapes/marker":34,"babel-runtime/core-js/object/assign":53,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],21:[function(require,module,exports){
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

var SegmentLayer = (function (_Layer) {
  _inherits(SegmentLayer, _Layer);

  function SegmentLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var accessors = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, SegmentLayer);

    _get(Object.getPrototypeOf(SegmentLayer.prototype), 'constructor', this).call(this, 'collection', data, options);

    options = _Object$assign({ displayHandlers: true }, options);

    this.configureShape(_shapesSegment2['default'], {}, {
      displayHandlers: options.displayHandlers
    });

    this.setBehavior(new _behaviorsSegmentBehavior2['default']());
  }

  return SegmentLayer;
})(_coreLayer2['default']);

exports['default'] = SegmentLayer;
module.exports = exports['default'];

},{"../behaviors/segment-behavior":7,"../core/layer":11,"../shapes/segment":35,"babel-runtime/core-js/object/assign":53,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],22:[function(require,module,exports){
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

var TraceLayer = (function (_Layer) {
  _inherits(TraceLayer, _Layer);

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

},{"../behaviors/trace-behavior":9,"../core/layer":11,"../shapes/trace-dots":37,"../shapes/trace-path":38,"babel-runtime/core-js/object/assign":53,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],23:[function(require,module,exports){
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
  color: 'steelblue'
};

var WaveformLayer = (function (_Layer) {
  _inherits(WaveformLayer, _Layer);

  function WaveformLayer(buffer, options) {
    _classCallCheck(this, WaveformLayer);

    options = _Object$assign({}, defaults, options);

    _get(Object.getPrototypeOf(WaveformLayer.prototype), 'constructor', this).call(this, 'entity', buffer.getChannelData(options.channel), options);

    this.configureShape(_shapesWaveform2['default'], {
      y: function y(d) {
        var v = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        if (v !== null) {
          d = v;
        }
        return d;
      }
    }, {
      sampleRate: buffer.sampleRate,
      color: options.color
    });
  }

  return WaveformLayer;
})(_coreLayer2['default']);

exports['default'] = WaveformLayer;
module.exports = exports['default'];

},{"../core/layer":11,"../shapes/waveform":39,"babel-runtime/core-js/object/assign":53,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],24:[function(require,module,exports){
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

/**
 * Main interface for event source
 */

var _events2 = _interopRequireDefault(_events);

var EventSource = (function (_events$EventEmitter) {
  _inherits(EventSource, _events$EventEmitter);

  function EventSource(el) {
    _classCallCheck(this, EventSource);

    _get(Object.getPrototypeOf(EventSource.prototype), 'constructor', this).call(this);
    this.el = el;

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

},{"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67,"events":131}],25:[function(require,module,exports){
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

var body = window.document.body;

/**
 * http://javascript.info/tutorial/keyboard-events
 */

var Keyboard = (function (_EventSource) {
  _inherits(Keyboard, _EventSource);

  function Keyboard(el) {
    _classCallCheck(this, Keyboard);

    _get(Object.getPrototypeOf(Keyboard.prototype), 'constructor', this).call(this, el);
  }

  _createClass(Keyboard, [{
    key: '_createEvent',
    value: function _createEvent(type, e) {
      var event = new _waveEvent2['default'](type, e);

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

      this.el.onkeydown = onKeyDown;
      this.el.onkeyup = onKeyUp;
    }
  }]);

  return Keyboard;
})(_eventSource2['default']);

exports['default'] = Keyboard;
module.exports = exports['default'];

},{"./event-source":24,"./wave-event":27,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],26:[function(require,module,exports){
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

var body = window.document.body;

/**
 * `Surface` normalizes mouse user interactions with the timeline upon the DOM container element of `Track` instances.
 * As soon as a `track` is added to a `timeline`, its attached `Surface` instance will emit the mouse events.
 */

var Surface = (function (_EventSource) {
  _inherits(Surface, _EventSource);

  /**
   * @param {DOMElement} el - the DOM element to monitor
   */

  function Surface(el /*, padding of the current surface @TODO */) {
    _classCallCheck(this, Surface);

    _get(Object.getPrototypeOf(Surface.prototype), 'constructor', this).call(this, el);

    // this.isMouseDown = false;
    this.mouseDownEvent = null;
    this.lastEvent = null;
  }

  /**
   * Factory method for `Event` class
   */

  _createClass(Surface, [{
    key: '_createEvent',
    value: function _createEvent(type, e) {
      var event = new _waveEvent2['default'](type, e);

      var pos = this._getRelativePosition(e);
      event.x = pos.x;
      event.y = pos.y;
      this.dx = null;
      this.dy = null;
      this.area = null; // @TODO rename

      return event;
    }

    /**
     * @param {Event} e - raw event from listener
     * @return {Object} The x, y coordinates coordinates relative to the surface element
     */
  }, {
    key: '_getRelativePosition',
    value: function _getRelativePosition(e) {
      // @TODO: should be able to ignore padding
      var x = 0;
      var y = 0;
      var clientRect = this.el.getBoundingClientRect();
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

      // Should handle padding

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
     * Keep this private to avoid double event binding
     * Main logic of the surface is here
     * Should be extended with needed events (mouseenter, mouseleave, wheel ...)
     */
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this = this;

      var onMouseDown = function onMouseDown(e) {
        // By removing the previous selection we prevent bypassing the mousemove events coming from SVG in Firefox.
        window.getSelection().removeAllRanges();
        var event = _this._createEvent('mousedown', e);

        _this.isMouseDown = true;
        _this.mouseDownEvent = event;
        _this.lastEvent = event;
        // Register mousemove and mouseup listeners on window
        window.addEventListener('mousemove', onMouseMove, false);
        window.addEventListener('mouseup', onMouseUp, false);

        _this.emit('event', event);
      };

      var onMouseMove = function onMouseMove(e) {
        var event = _this._createEvent('mousemove', e);
        _this._defineArea(event, _this.mouseDownEvent, _this.lastEvent);
        // Update `lastEvent` for next call
        _this.lastEvent = event;

        _this.emit('event', event);
      };

      var onMouseUp = function onMouseUp(e) {
        var event = _this._createEvent('mouseup', e);
        _this._defineArea(event, _this.mouseDownEvent, _this.lastEvent);

        _this.isMouseDown = false;
        _this.mouseDownEvent = null;
        _this.lastEvent = null;
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

      // Bind callbacks
      this.el.addEventListener('mousedown', onMouseDown, false);
      this.el.addEventListener('click', onClick, false);
      this.el.addEventListener('dblclick', onDblClick, false);
    }
  }]);

  return Surface;
})(_eventSource2['default']);

exports['default'] = Surface;
module.exports = exports['default'];

},{"./event-source":24,"./wave-event":27,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],27:[function(require,module,exports){
// base class for all Events
// @NOTE: use a single Event per Surface
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var WaveEvent = function WaveEvent(type, originalEvent) {
  _classCallCheck(this, WaveEvent);

  this.type = type;
  this.originalEvent = originalEvent;

  this.target = originalEvent.target;
  this.currentTarget = originalEvent.currentTarget;
};

exports["default"] = WaveEvent;
module.exports = exports["default"];

},{"babel-runtime/helpers/class-call-check":63}],28:[function(require,module,exports){
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
      this.$label.setAttributeNS(null, 'x', 10);
      this.$label.setAttributeNS(null, 'y', 10);
      this.$label.setAttributeNS(null, 'transform', 'matrix(1, 0, 0, -1, 0, ' + height + ')');
      this.$label.style.fontSize = '10px';
      this.$label.style.fontFamily = 'monospace';
      this.$label.style.color = '#676767';
      this.$label.style.mozUserSelect = 'none';
      this.$label.style.webkitUserSelect = 'none';
      this.$label.style.userSelect = 'none';

      this.$el.appendChild(this.$label);

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum, index) {
      _get(Object.getPrototypeOf(AnnotatedMarker.prototype), 'update', this).call(this, renderingContext, datum, index);

      this.$label.innerHTML = this.text(datum);
    }
  }]);

  return AnnotatedMarker;
})(_marker2['default']);

exports['default'] = AnnotatedMarker;
module.exports = exports['default'];

},{"./marker":34,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],29:[function(require,module,exports){
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
      this.$label.setAttributeNS(null, 'x', 1);
      this.$label.setAttributeNS(null, 'y', 11);
      this.$label.setAttributeNS(null, 'transform', 'matrix(1, 0, 0, -1, 0, ' + height + ')');
      this.$label.style.fontSize = '10px';
      this.$label.style.fontFamily = 'monospace';
      this.$label.style.color = '#676767';
      this.$label.style.mozUserSelect = 'none';
      this.$label.style.webkitUserSelect = 'none';
      this.$label.style.userSelect = 'none';

      this.$el.appendChild(this.$label);

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum, index) {
      _get(Object.getPrototypeOf(AnnotatedSegment.prototype), 'update', this).call(this, renderingContext, datum, index);

      this.$label.innerHTML = this.text(datum);
    }
  }]);

  return AnnotatedSegment;
})(_segment2['default']);

exports['default'] = AnnotatedSegment;
module.exports = exports['default'];

},{"./segment":35,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],30:[function(require,module,exports){
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

// @NOTE: accessors should receive datum index as argument
// to allow the use of sampleRate to define x position

var _coreNamespace2 = _interopRequireDefault(_coreNamespace);

var BaseShape = (function () {
  /**
   *  @param options {Object} override default configuration
   */

  function BaseShape() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BaseShape);

    this.$el = null;
    this.ns = _coreNamespace2['default'];
    this.params = _Object$assign({}, this._getDefaults(), options);
    // create accessors methods and set default accessor functions
    var accessors = this._getAccessorList();
    this._createAccessors(accessors);
    this._setDefaultAccessors(accessors);
  }

  _createClass(BaseShape, [{
    key: '_getDefaults',
    value: function _getDefaults() {
      return {};
    }

    /**
     *  clean references, is called from the `layer`
     */
  }, {
    key: 'destroy',
    value: function destroy() {
      // this.group = null;
      this.$el = null;
    }

    /**
     * @return {String} the name of the shape, used as a class in the element group
     */
  }, {
    key: 'getClassName',
    value: function getClassName() {
      return 'shape';
    }

    // should only be called once
    // setSvgDefinition(defs) {}

    /**
     * @TODO rename
     * @return {Object}
     *    keys are the accessors methods names to create
     *    values are the default values for each given accessor
     */
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return {};
    }

    /**
     *  install the given accessors on the shape
     */
  }, {
    key: 'install',
    value: function install(accessors) {
      for (var key in accessors) {
        this[key] = accessors[key];
      }
    }

    /**
     * generic method to create accessors
     * adds accessor to the prototype if not already present
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
     * create a function to be used as a default
     * accessor for each accesors
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
     * @param  renderingContext {Context} the renderingContext the layer which owns this item
     * @return  {DOMElement} the DOM element to insert in the item's group
     */
  }, {
    key: 'render',
    value: function render(renderingContext) {}

    /**
     * @param  group {DOMElement} group of the item in which the shape is drawn
     * @param  renderingContext {Context} the renderingContext the layer which owns this item
     * @param
     *    simpleShape : datum {Object} the datum related to this item's group
     *    commonShape : datum {Array} the associated to the Layer
     * @param
     *    simpleShape : index {Number} the current index of the datum
     *    commonShape : undefined
     * @return  void
     */
  }, {
    key: 'update',
    value: function update(renderingContext, datum, index) {}

    /**
     *  define if the shape is considered to be the given area
     *  arguments are passed in domain unit (time, whatever)
     *  @return {Boolean}
     */
  }, {
    key: 'inArea',
    value: function inArea(renderingContext, datum, x1, y1, x2, y2) {}
  }]);

  return BaseShape;
})();

exports['default'] = BaseShape;
module.exports = exports['default'];

},{"../core/namespace":12,"babel-runtime/core-js/object/assign":53,"babel-runtime/core-js/object/define-property":55,"babel-runtime/core-js/object/keys":57,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/interop-require-default":67}],31:[function(require,module,exports){
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
    value: function update(renderingContext, datum, index) {
      var x = renderingContext.timeToPixel(this.x(datum));
      this.$el.setAttributeNS(null, 'transform', 'translate(' + x + ', 0)');
    }

    // not selectable with a drag
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

},{"../core/namespace":12,"./base-shape":30,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],32:[function(require,module,exports){
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
    value: function update(renderingContext, datum, index) {
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

},{"./base-shape":30,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],33:[function(require,module,exports){
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
        var y = renderingContext.valueToPixel(_this2.cy(datum));
        return x + ',' + y;
      });

      return 'M' + instructions.join('L');
    }
  }]);

  return Line;
})(_baseShape2['default']);

exports['default'] = Line;
module.exports = exports['default'];

},{"./base-shape":30,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],34:[function(require,module,exports){
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
      return { x: 0, color: '#000000' };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        handlerWidth: 7,
        handlerHeight: 10,
        displayHandlers: true,
        opacity: 1
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
      this.$line = document.createElementNS(this.ns, 'rect');

      // draw line
      this.$line.setAttributeNS(null, 'x', 0);
      this.$line.setAttributeNS(null, 'y', 0);
      this.$line.setAttributeNS(null, 'width', 1);
      this.$line.setAttributeNS(null, 'height', height);
      this.$line.setAttributeNS(null, 'shape-rendering', 'optimizeSpeed');

      this.$el.appendChild(this.$line);

      if (this.params.displayHandlers) {
        this.$handler = document.createElementNS(this.ns, 'rect');

        this.$handler.setAttributeNS(null, 'x', -((this.params.handlerWidth - 1) / 2));
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
    value: function update(renderingContext, datum, index) {
      var x = renderingContext.timeToPixel(this.x(datum)) - 0.5;
      var color = this.color(datum);

      this.$el.setAttributeNS(null, 'transform', 'translate(' + x + ', 0)');
      this.$line.style.fill = color;

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

},{"./base-shape":30,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],35:[function(require,module,exports){
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
    value: function update(renderingContext, datum, index) {
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

},{"./base-shape":30,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],36:[function(require,module,exports){
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

var Axis = (function (_BaseShape) {
  _inherits(Axis, _BaseShape);

  function Axis() {
    _classCallCheck(this, Axis);

    _get(Object.getPrototypeOf(Axis.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Axis, [{
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
        var x = renderingContext.timeToPixel(datum.x);
        var opacity = datum.focused ? 0.8 : 0.3;
        // const height = datum.marker ? layerHeight : layerHeight - 10;
        var height = layerHeight;

        var tick = document.createElementNS(_this.ns, 'line');
        tick.classList.add('tick');

        tick.setAttributeNS(null, 'x1', 0);
        tick.setAttributeNS(null, 'x2', 0);
        tick.setAttributeNS(null, 'y1', 0);
        tick.setAttributeNS(null, 'y2', height);

        tick.setAttributeNS(null, 'fill', 'none');
        tick.setAttributeNS(null, 'stroke', 'steelblue');
        tick.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        tick.setAttributeNS(null, 'transform', 'translate(' + x + ', 0)');
        tick.setAttributeNS(null, 'opacity', opacity);

        _this.$el.appendChild(tick);

        if (datum.label) {
          var label = document.createElementNS(_this.ns, 'text');
          label.classList.add('label');

          label.innerHTML = datum.label;
          label.setAttributeNS(null, 'transform', 'matrix(1, 0, 0, -1, ' + (x + 2) + ', ' + (height + 2) + ')');
          label.setAttributeNS(null, 'alignment-baseline', 'text-before-edge');
          label.style.fontSize = '10px';
          label.style.lineHeight = '10px';
          label.style.fontFamily = 'monospace';
          label.style.color = '#676767';
          label.style.opacity = 0.9;
          label.style.mozUserSelect = 'none';
          label.style.webkitUserSelect = 'none';
          label.style.userSelect = 'none';

          // const bg = document.createElementNS(this.ns, 'rect');
          // bg.setAttributeNS(null, 'width', '100%');
          // bg.setAttributeNS(null, 'height', '100%');
          // bg.setAttributeNS(null, 'fill', '#ffffff');
          // label.appendChild(bg);

          _this.$el.appendChild(label);
        }
      });

      this.$el.appendChild(fragment);
    }
  }]);

  return Axis;
})(_baseShape2['default']);

exports['default'] = Axis;
module.exports = exports['default'];

},{"./base-shape":30,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],37:[function(require,module,exports){
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
    value: function update(renderingContext, datum, index) {
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

},{"./base-shape":30,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],38:[function(require,module,exports){
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

},{"./base-shape":30,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],39:[function(require,module,exports){
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

// @TODO create strategies object to clean the `if...else` mess
// var svgStrategy = {
//   render() {},
//   update() {}
// };

// var canvasStrategy = {
//   render() {},
//   update() {}
// };

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
      return { y: 0 };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        sampleRate: 44100,
        color: '#000000',
        opacity: 1,
        renderingStrategy: 'svg' // canvas is bugged (translation, etc...)
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }

      if (this.params.renderingStrategy === 'svg') {

        this.$el = document.createElementNS(this.ns, 'path');
        this.$el.setAttributeNS(null, 'fill', 'none');
        this.$el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        this.$el.setAttributeNS(null, 'stroke', this.params.color);
        this.$el.style.opacity = this.params.opacity;
      } else if (this.params.renderingStrategy === 'canvas') {

        this.$el = document.createElementNS(this.ns, 'foreignObject');
        this.$el.setAttributeNS(null, 'width', renderingContext.width);
        this.$el.setAttributeNS(null, 'height', renderingContext.height);

        var canvas = document.createElementNS(xhtmlNS, 'xhtml:canvas');

        this._ctx = canvas.getContext('2d');
        this._ctx.canvas.width = renderingContext.width;
        this._ctx.canvas.height = renderingContext.height;

        this.$el.appendChild(canvas);
      }

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum, index) {
      var _this = this;

      // define nbr of samples per pixels
      var sliceMethod = datum instanceof Float32Array ? 'subarray' : 'slice';
      var nbrSamples = datum.length;
      var duration = nbrSamples / this.params.sampleRate;
      var width = renderingContext.timeToPixel(duration);
      var samplesPerPixel = nbrSamples / width;
      var minMax = [];
      // get min/max per pixels
      for (var i = 0; i <= width; i++) {
        var startTime = renderingContext.timeToPixel.invert(i);
        var startSample = startTime * this.params.sampleRate;

        var extract = datum[sliceMethod](startSample, startSample + samplesPerPixel);
        var min = Infinity;
        var max = -Infinity;
        for (var j = 0; j < extract.length; j++) {
          var sample = extract[j];
          if (sample < min) {
            min = sample;
          }
          if (sample > max) {
            max = sample;
          }
        }
        // disallow Infinity
        min = min === Infinity || min === -Infinity ? 0 : min;
        max = max === Infinity || max === -Infinity ? 0 : max;

        minMax.push({ time: startTime, values: [min, max] });
      }

      var MIN = 0;
      var MAX = 1;

      // rednering strategies
      if (this.params.renderingStrategy === 'svg') {

        var instructions = minMax.map(function (datum, index) {
          var x = Math.floor(renderingContext.timeToPixel(datum.time));
          var y1 = Math.round(renderingContext.valueToPixel(_this.y(datum.values[MIN])));
          var y2 = Math.round(renderingContext.valueToPixel(_this.y(datum.values[MAX])));

          return x + ',' + y1 + 'L' + x + ',' + y2;
        });

        var d = 'M' + instructions.join('L');
        this.$el.setAttributeNS(null, 'd', d);
      } else if (this.params.renderingStrategy === 'canvas') {

        this._ctx.canvas.width = width;
        this.$el.setAttribute('width', width);
        // fix chrome bug with translate
        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
          this.$el.setAttribute('x', renderingContext.offsetX);
        }

        this._ctx.strokeStyle = this.params.color;
        this._ctx.globalAlpha = this.params.opacity;
        this._ctx.moveTo(renderingContext.timeToPixel(0), renderingContext.valueToPixel(0));

        minMax.forEach(function (datum) {
          var x = renderingContext.timeToPixel(datum.time);
          var y1 = renderingContext.valueToPixel(_this.y(datum.values[MIN]));
          var y2 = renderingContext.valueToPixel(_this.y(datum.values[MAX]));

          _this._ctx.moveTo(x, y1);
          _this._ctx.lineTo(x, y2);
        });

        this._ctx.stroke();
      }
    }
  }]);

  return Waveform;
})(_baseShape2['default']);

exports['default'] = Waveform;
module.exports = exports['default'];

},{"./base-shape":30,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],40:[function(require,module,exports){
/**
* `State` instances are used to define the application logic by precising specific user interaction cases, and how they impact the overal temporal representation.
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
  function BaseState(timeline) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, BaseState);

    this.timeline = timeline;
  }

  /**
   * Get timeline views
   */

  _createClass(BaseState, [{
    key: "enter",

    /**
     * Called when the timeline is entering the state
     */
    value: function enter() {}

    /**
     * Called when the timeline is leaving the state
     */
  }, {
    key: "exit",
    value: function exit() {}

    /**
     * handle registered inputs from mouse and keyboard
     * @param {Event} e - the event to process
     */
  }, {
    key: "handleEvent",
    value: function handleEvent(e) {}
  }, {
    key: "tracks",
    get: function get() {
      return this.timeline.tracks;
    }

    /**
     * Get timeline layers
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

},{"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64}],41:[function(require,module,exports){
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

/**
 * Protools like zoom with zone selection
 * Press space bar to reset zoom default (1)
 * @TODO could also handle 'g' and 'h' key to zoom, de-zoom
 */

var _baseState2 = _interopRequireDefault(_baseState);

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

},{"../core/namespace":12,"./base-state":40,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],42:[function(require,module,exports){
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

/**
 * `CenteredZoomState` is a timeline state that allows the user to browse the timeline by clicking on a track, and then
 * - moving down to zoom in
 * - moving up to zoom out
 * - moving left to move in time, after
 * - moving right to move in time, before
 */

var _baseState2 = _interopRequireDefault(_baseState);

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

},{"../utils/scales":49,"./base-state":40,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],43:[function(require,module,exports){
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

},{"../behaviors/time-context-behavior":8,"./base-state":40,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],44:[function(require,module,exports){
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

/**
 *  Does not handle selection, must be used in conjonction with a selectionState of some sort
 *  could maybe be merged with the SelectionState
 */

var _baseState2 = _interopRequireDefault(_baseState);

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

},{"./base-state":40,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],45:[function(require,module,exports){
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

},{"../core/namespace":12,"./base-state":40,"babel-runtime/core-js/map":52,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],46:[function(require,module,exports){
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

/**
 *  a simple plug and play state - select and edit
 */

var _baseState2 = _interopRequireDefault(_baseState);

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
        layer.select(item);
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
      layer.update(items);
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

},{"./base-state":40,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64,"babel-runtime/helpers/get":65,"babel-runtime/helpers/inherits":66,"babel-runtime/helpers/interop-require-default":67}],47:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  padLeft: function padLeft(input, sign, length) {
    input += '';
    while (input.length < length) {
      input = sign + input;
    }
    return input;
  }
};
module.exports = exports['default'];

},{}],48:[function(require,module,exports){
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

  // verify that data are consistents

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
     * Update array of objects from object of arrays
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
     * Update object of arrays from array of objects
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
     * Set an object of arrays
     */
  }, {
    key: "cols",
    set: function set(obj) {
      this._cols = obj;
      this._rows = [];

      this.updateFromCols();
    },

    /**
     * Set an array of objects
     */

    /**
     * Get an object of arrays
     */
    get: function get() {
      return this._cols;
    }

    /**
     * Get an array of objects
     */
  }, {
    key: "rows",
    set: function set(arr) {
      this._rows = arr;
      this._cols = {};

      this.updateFromRows();
    },
    get: function get() {
      return this._rows;
    }
  }]);

  return OrthogonalData;
})();

exports["default"] = OrthogonalData;
module.exports = exports["default"];

},{"babel-runtime/core-js/object/keys":57,"babel-runtime/helpers/class-call-check":63,"babel-runtime/helpers/create-class":64}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = {
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

},{}],50:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/array/from"), __esModule: true };
},{"core-js/library/fn/array/from":69}],51:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":70}],52:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/map"), __esModule: true };
},{"core-js/library/fn/map":71}],53:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":72}],54:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":73}],55:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":74}],56:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-own-property-descriptor"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-descriptor":75}],57:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":76}],58:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":77}],59:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/promise"), __esModule: true };
},{"core-js/library/fn/promise":78}],60:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/set"), __esModule: true };
},{"core-js/library/fn/set":79}],61:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":80}],62:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol/iterator"), __esModule: true };
},{"core-js/library/fn/symbol/iterator":81}],63:[function(require,module,exports){
"use strict";

exports["default"] = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

exports.__esModule = true;
},{}],64:[function(require,module,exports){
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
},{"babel-runtime/core-js/object/define-property":55}],65:[function(require,module,exports){
"use strict";

var _Object$getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor")["default"];

exports["default"] = function get(_x, _x2, _x3) {
  var _again = true;

  _function: while (_again) {
    var object = _x,
        property = _x2,
        receiver = _x3;
    desc = parent = getter = undefined;
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
},{"babel-runtime/core-js/object/get-own-property-descriptor":56}],66:[function(require,module,exports){
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
},{"babel-runtime/core-js/object/create":54,"babel-runtime/core-js/object/set-prototype-of":58}],67:[function(require,module,exports){
"use strict";

exports["default"] = function (obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
};

exports.__esModule = true;
},{}],68:[function(require,module,exports){
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
},{"babel-runtime/core-js/array/from":50}],69:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/$').core.Array.from;
},{"../../modules/$":100,"../../modules/es6.array.from":114,"../../modules/es6.string.iterator":123}],70:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
require('../modules/core.iter-helpers');
module.exports = require('../modules/$').core.getIterator;
},{"../modules/$":100,"../modules/core.iter-helpers":113,"../modules/es6.string.iterator":123,"../modules/web.dom.iterable":127}],71:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.map');
require('../modules/es7.map.to-json');
module.exports = require('../modules/$').core.Map;
},{"../modules/$":100,"../modules/es6.map":116,"../modules/es6.object.to-string":120,"../modules/es6.string.iterator":123,"../modules/es7.map.to-json":125,"../modules/web.dom.iterable":127}],72:[function(require,module,exports){
require('../../modules/es6.object.assign');
module.exports = require('../../modules/$').core.Object.assign;
},{"../../modules/$":100,"../../modules/es6.object.assign":117}],73:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function create(P, D){
  return $.create(P, D);
};
},{"../../modules/$":100}],74:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function defineProperty(it, key, desc){
  return $.setDesc(it, key, desc);
};
},{"../../modules/$":100}],75:[function(require,module,exports){
var $ = require('../../modules/$');
require('../../modules/es6.object.statics-accept-primitives');
module.exports = function getOwnPropertyDescriptor(it, key){
  return $.getDesc(it, key);
};
},{"../../modules/$":100,"../../modules/es6.object.statics-accept-primitives":119}],76:[function(require,module,exports){
require('../../modules/es6.object.statics-accept-primitives');
module.exports = require('../../modules/$').core.Object.keys;
},{"../../modules/$":100,"../../modules/es6.object.statics-accept-primitives":119}],77:[function(require,module,exports){
require('../../modules/es6.object.set-prototype-of');
module.exports = require('../../modules/$').core.Object.setPrototypeOf;
},{"../../modules/$":100,"../../modules/es6.object.set-prototype-of":118}],78:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.promise');
module.exports = require('../modules/$').core.Promise;
},{"../modules/$":100,"../modules/es6.object.to-string":120,"../modules/es6.promise":121,"../modules/es6.string.iterator":123,"../modules/web.dom.iterable":127}],79:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.set');
require('../modules/es7.set.to-json');
module.exports = require('../modules/$').core.Set;
},{"../modules/$":100,"../modules/es6.object.to-string":120,"../modules/es6.set":122,"../modules/es6.string.iterator":123,"../modules/es7.set.to-json":126,"../modules/web.dom.iterable":127}],80:[function(require,module,exports){
require('../../modules/es6.symbol');
module.exports = require('../../modules/$').core.Symbol;
},{"../../modules/$":100,"../../modules/es6.symbol":124}],81:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/web.dom.iterable');
module.exports = require('../../modules/$.wks')('iterator');
},{"../../modules/$.wks":112,"../../modules/es6.string.iterator":123,"../../modules/web.dom.iterable":127}],82:[function(require,module,exports){
var $ = require('./$');
function assert(condition, msg1, msg2){
  if(!condition)throw TypeError(msg2 ? msg1 + msg2 : msg1);
}
assert.def = $.assertDefined;
assert.fn = function(it){
  if(!$.isFunction(it))throw TypeError(it + ' is not a function!');
  return it;
};
assert.obj = function(it){
  if(!$.isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
assert.inst = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
module.exports = assert;
},{"./$":100}],83:[function(require,module,exports){
var $        = require('./$')
  , enumKeys = require('./$.enum-keys');
// 19.1.2.1 Object.assign(target, source, ...)
/* eslint-disable no-unused-vars */
module.exports = Object.assign || function assign(target, source){
/* eslint-enable no-unused-vars */
  var T = Object($.assertDefined(target))
    , l = arguments.length
    , i = 1;
  while(l > i){
    var S      = $.ES5Object(arguments[i++])
      , keys   = enumKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)T[key = keys[j++]] = S[key];
  }
  return T;
};
},{"./$":100,"./$.enum-keys":91}],84:[function(require,module,exports){
var $        = require('./$')
  , TAG      = require('./$.wks')('toStringTag')
  , toString = {}.toString;
function cof(it){
  return toString.call(it).slice(8, -1);
}
cof.classof = function(it){
  var O, T;
  return it == undefined ? it === undefined ? 'Undefined' : 'Null'
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T : cof(O);
};
cof.set = function(it, tag, stat){
  if(it && !$.has(it = stat ? it : it.prototype, TAG))$.hide(it, TAG, tag);
};
module.exports = cof;
},{"./$":100,"./$.wks":112}],85:[function(require,module,exports){
'use strict';
var $        = require('./$')
  , ctx      = require('./$.ctx')
  , safe     = require('./$.uid').safe
  , assert   = require('./$.assert')
  , forOf    = require('./$.for-of')
  , step     = require('./$.iter').step
  , $has     = $.has
  , set      = $.set
  , isObject = $.isObject
  , hide     = $.hide
  , isExtensible = Object.isExtensible || isObject
  , ID       = safe('id')
  , O1       = safe('O1')
  , LAST     = safe('last')
  , FIRST    = safe('first')
  , ITER     = safe('iter')
  , SIZE     = $.DESC ? safe('size') : 'size'
  , id       = 0;

function fastKey(it, create){
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
}

function getEntry(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that[O1][index];
  // frozen object case
  for(entry = that[FIRST]; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
}

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      assert.inst(that, C, NAME);
      set(that, O1, $.create(null));
      set(that, SIZE, 0);
      set(that, LAST, undefined);
      set(that, FIRST, undefined);
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    require('./$.mix')(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that[O1], entry = that[FIRST]; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that[FIRST] = that[LAST] = undefined;
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
          delete that[O1][entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that[FIRST] == entry)that[FIRST] = next;
          if(that[LAST] == entry)that[LAST] = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        var f = ctx(callbackfn, arguments[1], 3)
          , entry;
        while(entry = entry ? entry.n : this[FIRST]){
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
    if($.DESC)$.setDesc(C.prototype, 'size', {
      get: function(){
        return assert.def(this[SIZE]);
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
      that[LAST] = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that[LAST],          // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that[FIRST])that[FIRST] = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that[O1][index] = entry;
    } return that;
  },
  getEntry: getEntry,
  // add .keys, .values, .entries, [@@iterator]
  // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
  setIter: function(C, NAME, IS_MAP){
    require('./$.iter-define')(C, NAME, function(iterated, kind){
      set(this, ITER, {o: iterated, k: kind});
    }, function(){
      var iter  = this[ITER]
        , kind  = iter.k
        , entry = iter.l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!iter.o || !(iter.l = entry = entry ? entry.n : iter.o[FIRST])){
        // or finish the iteration
        iter.o = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);
  }
};
},{"./$":100,"./$.assert":82,"./$.ctx":88,"./$.for-of":92,"./$.iter":99,"./$.iter-define":97,"./$.mix":102,"./$.uid":110}],86:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $def  = require('./$.def')
  , forOf = require('./$.for-of');
module.exports = function(NAME){
  $def($def.P, NAME, {
    toJSON: function toJSON(){
      var arr = [];
      forOf(this, false, arr.push, arr);
      return arr;
    }
  });
};
},{"./$.def":89,"./$.for-of":92}],87:[function(require,module,exports){
'use strict';
var $     = require('./$')
  , $def  = require('./$.def')
  , $iter = require('./$.iter')
  , BUGGY = $iter.BUGGY
  , forOf = require('./$.for-of')
  , assertInstance = require('./$.assert').inst
  , INTERNAL = require('./$.uid').safe('internal');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = $.g[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  if(!$.DESC || !$.isFunction(C) || !(IS_WEAK || !BUGGY && proto.forEach && proto.entries)){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    require('./$.mix')(C.prototype, methods);
  } else {
    C = wrapper(function(target, iterable){
      assertInstance(target, C, NAME);
      target[INTERNAL] = new Base;
      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
    });
    $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries'.split(','),function(KEY){
      var chain = KEY == 'add' || KEY == 'set';
      if(KEY in proto)$.hide(C.prototype, KEY, function(a, b){
        var result = this[INTERNAL][KEY](a === 0 ? 0 : a, b);
        return chain ? this : result;
      });
    });
    if('size' in proto)$.setDesc(C.prototype, 'size', {
      get: function(){
        return this[INTERNAL].size;
      }
    });
  }

  require('./$.cof').set(C, NAME);

  O[NAME] = C;
  $def($def.G + $def.W + $def.F, O);
  require('./$.species')(C);

  if(!IS_WEAK)common.setIter(C, NAME, IS_MAP);

  return C;
};
},{"./$":100,"./$.assert":82,"./$.cof":84,"./$.def":89,"./$.for-of":92,"./$.iter":99,"./$.mix":102,"./$.species":107,"./$.uid":110}],88:[function(require,module,exports){
// Optional / simple context binding
var assertFunction = require('./$.assert').fn;
module.exports = function(fn, that, length){
  assertFunction(fn);
  if(~length && that === undefined)return fn;
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
  } return function(/* ...args */){
      return fn.apply(that, arguments);
    };
};
},{"./$.assert":82}],89:[function(require,module,exports){
var $          = require('./$')
  , global     = $.g
  , core       = $.core
  , isFunction = $.isFunction;
function ctx(fn, that){
  return function(){
    return fn.apply(that, arguments);
  };
}
// type bitmap
$def.F = 1;  // forced
$def.G = 2;  // global
$def.S = 4;  // static
$def.P = 8;  // proto
$def.B = 16; // bind
$def.W = 32; // wrap
function $def(type, name, source){
  var key, own, out, exp
    , isGlobal = type & $def.G
    , isProto  = type & $def.P
    , target   = isGlobal ? global : type & $def.S
        ? global[name] : (global[name] || {}).prototype
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // contains in native
    own = !(type & $def.F) && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    if(isGlobal && !isFunction(target[key]))exp = source[key];
    // bind timers to global for call from export context
    else if(type & $def.B && own)exp = ctx(out, global);
    // wrap global constructors for prevent change them in library
    else if(type & $def.W && target[key] == out)!function(C){
      exp = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      exp.prototype = C.prototype;
    }(out);
    else exp = isProto && isFunction(out) ? ctx(Function.call, out) : out;
    // export
    exports[key] = exp;
    if(isProto)(exports.prototype || (exports.prototype = {}))[key] = out;
  }
}
module.exports = $def;
},{"./$":100}],90:[function(require,module,exports){
var $        = require('./$')
  , document = $.g.document
  , isObject = $.isObject
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./$":100}],91:[function(require,module,exports){
var $ = require('./$');
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getDesc    = $.getDesc
    , getSymbols = $.getSymbols;
  if(getSymbols)$.each.call(getSymbols(it), function(key){
    if(getDesc(it, key).enumerable)keys.push(key);
  });
  return keys;
};
},{"./$":100}],92:[function(require,module,exports){
var ctx  = require('./$.ctx')
  , get  = require('./$.iter').get
  , call = require('./$.iter-call');
module.exports = function(iterable, entries, fn, that){
  var iterator = get(iterable)
    , f        = ctx(fn, that, entries ? 2 : 1)
    , step;
  while(!(step = iterator.next()).done){
    if(call(iterator, f, step.value, entries) === false){
      return call.close(iterator);
    }
  }
};
},{"./$.ctx":88,"./$.iter":99,"./$.iter-call":96}],93:[function(require,module,exports){
module.exports = function($){
  $.FW   = false;
  $.path = $.core;
  return $;
};
},{}],94:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var $ = require('./$')
  , toString = {}.toString
  , getNames = $.getNames;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

function getWindowNames(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
}

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames($.toObject(it));
};
},{"./$":100}],95:[function(require,module,exports){
// Fast apply
// http://jsperf.lnkit.com/fast-apply/5
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
    case 5: return un ? fn(args[0], args[1], args[2], args[3], args[4])
                      : fn.call(that, args[0], args[1], args[2], args[3], args[4]);
  } return              fn.apply(that, args);
};
},{}],96:[function(require,module,exports){
var assertObject = require('./$.assert').obj;
function close(iterator){
  var ret = iterator['return'];
  if(ret !== undefined)assertObject(ret.call(iterator));
}
function call(iterator, fn, value, entries){
  try {
    return entries ? fn(assertObject(value)[0], value[1]) : fn(value);
  } catch(e){
    close(iterator);
    throw e;
  }
}
call.close = close;
module.exports = call;
},{"./$.assert":82}],97:[function(require,module,exports){
var $def            = require('./$.def')
  , $redef          = require('./$.redef')
  , $               = require('./$')
  , cof             = require('./$.cof')
  , $iter           = require('./$.iter')
  , SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , FF_ITERATOR     = '@@iterator'
  , KEYS            = 'keys'
  , VALUES          = 'values'
  , Iterators       = $iter.Iterators;
module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
  $iter.create(Constructor, NAME, next);
  function createMethod(kind){
    function $$(that){
      return new Constructor(that, kind);
    }
    switch(kind){
      case KEYS: return function keys(){ return $$(this); };
      case VALUES: return function values(){ return $$(this); };
    } return function entries(){ return $$(this); };
  }
  var TAG      = NAME + ' Iterator'
    , proto    = Base.prototype
    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , _default = _native || createMethod(DEFAULT)
    , methods, key;
  // Fix native
  if(_native){
    var IteratorPrototype = $.getProto(_default.call(new Base));
    // Set @@toStringTag to native iterators
    cof.set(IteratorPrototype, TAG, true);
    // FF fix
    if($.FW && $.has(proto, FF_ITERATOR))$iter.set(IteratorPrototype, $.that);
  }
  // Define iterator
  if($.FW || FORCE)$iter.set(proto, _default);
  // Plug for library
  Iterators[NAME] = _default;
  Iterators[TAG]  = $.that;
  if(DEFAULT){
    methods = {
      keys:    IS_SET            ? _default : createMethod(KEYS),
      values:  DEFAULT == VALUES ? _default : createMethod(VALUES),
      entries: DEFAULT != VALUES ? _default : createMethod('entries')
    };
    if(FORCE)for(key in methods){
      if(!(key in proto))$redef(proto, key, methods[key]);
    } else $def($def.P + $def.F * $iter.BUGGY, NAME, methods);
  }
};
},{"./$":100,"./$.cof":84,"./$.def":89,"./$.iter":99,"./$.redef":103,"./$.wks":112}],98:[function(require,module,exports){
var SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , SAFE_CLOSING    = false;
try {
  var riter = [7][SYMBOL_ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }
module.exports = function(exec){
  if(!SAFE_CLOSING)return false;
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
},{"./$.wks":112}],99:[function(require,module,exports){
'use strict';
var $                 = require('./$')
  , cof               = require('./$.cof')
  , classof           = cof.classof
  , assert            = require('./$.assert')
  , assertObject      = assert.obj
  , SYMBOL_ITERATOR   = require('./$.wks')('iterator')
  , FF_ITERATOR       = '@@iterator'
  , Iterators         = require('./$.shared')('iterators')
  , IteratorPrototype = {};
// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
setIterator(IteratorPrototype, $.that);
function setIterator(O, value){
  $.hide(O, SYMBOL_ITERATOR, value);
  // Add iterator for FF iterator protocol
  if(FF_ITERATOR in [])$.hide(O, FF_ITERATOR, value);
}

module.exports = {
  // Safari has buggy iterators w/o `next`
  BUGGY: 'keys' in [] && !('next' in [].keys()),
  Iterators: Iterators,
  step: function(done, value){
    return {value: value, done: !!done};
  },
  is: function(it){
    var O      = Object(it)
      , Symbol = $.g.Symbol;
    return (Symbol && Symbol.iterator || FF_ITERATOR) in O
      || SYMBOL_ITERATOR in O
      || $.has(Iterators, classof(O));
  },
  get: function(it){
    var Symbol = $.g.Symbol
      , getIter;
    if(it != undefined){
      getIter = it[Symbol && Symbol.iterator || FF_ITERATOR]
        || it[SYMBOL_ITERATOR]
        || Iterators[classof(it)];
    }
    assert($.isFunction(getIter), it, ' is not iterable!');
    return assertObject(getIter.call(it));
  },
  set: setIterator,
  create: function(Constructor, NAME, next, proto){
    Constructor.prototype = $.create(proto || IteratorPrototype, {next: $.desc(1, next)});
    cof.set(Constructor, NAME + ' Iterator');
  }
};
},{"./$":100,"./$.assert":82,"./$.cof":84,"./$.shared":106,"./$.wks":112}],100:[function(require,module,exports){
'use strict';
var global = typeof self != 'undefined' ? self : Function('return this')()
  , core   = {}
  , defineProperty = Object.defineProperty
  , hasOwnProperty = {}.hasOwnProperty
  , ceil  = Math.ceil
  , floor = Math.floor
  , max   = Math.max
  , min   = Math.min;
// The engine works fine with descriptors? Thank's IE8 for his funny defineProperty.
var DESC = !!function(){
  try {
    return defineProperty({}, 'a', {get: function(){ return 2; }}).a == 2;
  } catch(e){ /* empty */ }
}();
var hide = createDefiner(1);
// 7.1.4 ToInteger
function toInteger(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
}
function desc(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
}
function simpleSet(object, key, value){
  object[key] = value;
  return object;
}
function createDefiner(bitmap){
  return DESC ? function(object, key, value){
    return $.setDesc(object, key, desc(bitmap, value));
  } : simpleSet;
}

function isObject(it){
  return it !== null && (typeof it == 'object' || typeof it == 'function');
}
function isFunction(it){
  return typeof it == 'function';
}
function assertDefined(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
}

var $ = module.exports = require('./$.fw')({
  g: global,
  core: core,
  html: global.document && document.documentElement,
  // http://jsperf.com/core-js-isobject
  isObject:   isObject,
  isFunction: isFunction,
  that: function(){
    return this;
  },
  // 7.1.4 ToInteger
  toInteger: toInteger,
  // 7.1.15 ToLength
  toLength: function(it){
    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  },
  toIndex: function(index, length){
    index = toInteger(index);
    return index < 0 ? max(index + length, 0) : min(index, length);
  },
  has: function(it, key){
    return hasOwnProperty.call(it, key);
  },
  create:     Object.create,
  getProto:   Object.getPrototypeOf,
  DESC:       DESC,
  desc:       desc,
  getDesc:    Object.getOwnPropertyDescriptor,
  setDesc:    defineProperty,
  setDescs:   Object.defineProperties,
  getKeys:    Object.keys,
  getNames:   Object.getOwnPropertyNames,
  getSymbols: Object.getOwnPropertySymbols,
  assertDefined: assertDefined,
  // Dummy, fix for not array-like ES3 string in es5 module
  ES5Object: Object,
  toObject: function(it){
    return $.ES5Object(assertDefined(it));
  },
  hide: hide,
  def: createDefiner(0),
  set: global.Symbol ? simpleSet : hide,
  each: [].forEach
});
/* eslint-disable no-undef */
if(typeof __e != 'undefined')__e = core;
if(typeof __g != 'undefined')__g = global;
},{"./$.fw":93}],101:[function(require,module,exports){
var $ = require('./$');
module.exports = function(object, el){
  var O      = $.toObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./$":100}],102:[function(require,module,exports){
var $redef = require('./$.redef');
module.exports = function(target, src){
  for(var key in src)$redef(target, key, src[key]);
  return target;
};
},{"./$.redef":103}],103:[function(require,module,exports){
module.exports = require('./$').hide;
},{"./$":100}],104:[function(require,module,exports){
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],105:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var $      = require('./$')
  , assert = require('./$.assert');
function check(O, proto){
  assert.obj(O);
  assert(proto === null || $.isObject(proto), proto, ": can't set as prototype!");
}
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} // eslint-disable-line
    ? function(buggy, set){
        try {
          set = require('./$.ctx')(Function.call, $.getDesc(Object.prototype, '__proto__').set, 2);
          set({}, []);
        } catch(e){ buggy = true; }
        return function setPrototypeOf(O, proto){
          check(O, proto);
          if(buggy)O.__proto__ = proto;
          else set(O, proto);
          return O;
        };
      }()
    : undefined),
  check: check
};
},{"./$":100,"./$.assert":82,"./$.ctx":88}],106:[function(require,module,exports){
var $      = require('./$')
  , SHARED = '__core-js_shared__'
  , store  = $.g[SHARED] || ($.g[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$":100}],107:[function(require,module,exports){
var $       = require('./$')
  , SPECIES = require('./$.wks')('species');
module.exports = function(C){
  if($.DESC && !(SPECIES in C))$.setDesc(C, SPECIES, {
    configurable: true,
    get: $.that
  });
};
},{"./$":100,"./$.wks":112}],108:[function(require,module,exports){
// true  -> String#at
// false -> String#codePointAt
var $ = require('./$');
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String($.assertDefined(that))
      , i = $.toInteger(pos)
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
},{"./$":100}],109:[function(require,module,exports){
'use strict';
var $      = require('./$')
  , ctx    = require('./$.ctx')
  , cof    = require('./$.cof')
  , invoke = require('./$.invoke')
  , cel    = require('./$.dom-create')
  , global             = $.g
  , isFunction         = $.isFunction
  , html               = $.html
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
function run(){
  var id = +this;
  if($.has(queue, id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
}
function listner(event){
  run.call(event.data);
}
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!isFunction(setTask) || !isFunction(clearTask)){
  setTask = function(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(isFunction(fn) ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(cof(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Modern browsers, skip implementation for WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is object
  } else if(global.addEventListener && isFunction(global.postMessage) && !global.importScripts){
    defer = function(id){
      global.postMessage(id, '*');
    };
    global.addEventListener('message', listner, false);
  // WebWorkers
  } else if(isFunction(MessageChannel)){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
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
},{"./$":100,"./$.cof":84,"./$.ctx":88,"./$.dom-create":90,"./$.invoke":95}],110:[function(require,module,exports){
var sid = 0;
function uid(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++sid + Math.random()).toString(36));
}
uid.safe = require('./$').g.Symbol || uid;
module.exports = uid;
},{"./$":100}],111:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],112:[function(require,module,exports){
var global = require('./$').g
  , store  = require('./$.shared')('wks');
module.exports = function(name){
  return store[name] || (store[name] =
    global.Symbol && global.Symbol[name] || require('./$.uid').safe('Symbol.' + name));
};
},{"./$":100,"./$.shared":106,"./$.uid":110}],113:[function(require,module,exports){
var core  = require('./$').core
  , $iter = require('./$.iter');
core.isIterable  = $iter.is;
core.getIterator = $iter.get;
},{"./$":100,"./$.iter":99}],114:[function(require,module,exports){
var $     = require('./$')
  , ctx   = require('./$.ctx')
  , $def  = require('./$.def')
  , $iter = require('./$.iter')
  , call  = require('./$.iter-call');
$def($def.S + $def.F * !require('./$.iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = Object($.assertDefined(arrayLike))
      , mapfn   = arguments[1]
      , mapping = mapfn !== undefined
      , f       = mapping ? ctx(mapfn, arguments[2], 2) : undefined
      , index   = 0
      , length, result, step, iterator;
    if($iter.is(O)){
      iterator = $iter.get(O);
      // strange IE quirks mode bug -> use typeof instead of isFunction
      result   = new (typeof this == 'function' ? this : Array);
      for(; !(step = iterator.next()).done; index++){
        result[index] = mapping ? call(iterator, f, [step.value, index], true) : step.value;
      }
    } else {
      // strange IE quirks mode bug -> use typeof instead of isFunction
      result = new (typeof this == 'function' ? this : Array)(length = $.toLength(O.length));
      for(; length > index; index++){
        result[index] = mapping ? f(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});
},{"./$":100,"./$.ctx":88,"./$.def":89,"./$.iter":99,"./$.iter-call":96,"./$.iter-detect":98}],115:[function(require,module,exports){
var $          = require('./$')
  , setUnscope = require('./$.unscope')
  , ITER       = require('./$.uid').safe('iter')
  , $iter      = require('./$.iter')
  , step       = $iter.step
  , Iterators  = $iter.Iterators;

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
require('./$.iter-define')(Array, 'Array', function(iterated, kind){
  $.set(this, ITER, {o: $.toObject(iterated), i: 0, k: kind});
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var iter  = this[ITER]
    , O     = iter.o
    , kind  = iter.k
    , index = iter.i++;
  if(!O || index >= O.length){
    iter.o = undefined;
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
},{"./$":100,"./$.iter":99,"./$.iter-define":97,"./$.uid":110,"./$.unscope":111}],116:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.1 Map Objects
require('./$.collection')('Map', function(get){
  return function Map(){ return get(this, arguments[0]); };
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
},{"./$.collection":87,"./$.collection-strong":85}],117:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $def = require('./$.def');
$def($def.S, 'Object', {assign: require('./$.assign')});
},{"./$.assign":83,"./$.def":89}],118:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $def = require('./$.def');
$def($def.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.def":89,"./$.set-proto":105}],119:[function(require,module,exports){
var $        = require('./$')
  , $def     = require('./$.def')
  , isObject = $.isObject
  , toObject = $.toObject;
$.each.call(('freeze,seal,preventExtensions,isFrozen,isSealed,isExtensible,' +
  'getOwnPropertyDescriptor,getPrototypeOf,keys,getOwnPropertyNames').split(',')
, function(KEY, ID){
  var fn     = ($.core.Object || {})[KEY] || Object[KEY]
    , forced = 0
    , method = {};
  method[KEY] = ID == 0 ? function freeze(it){
    return isObject(it) ? fn(it) : it;
  } : ID == 1 ? function seal(it){
    return isObject(it) ? fn(it) : it;
  } : ID == 2 ? function preventExtensions(it){
    return isObject(it) ? fn(it) : it;
  } : ID == 3 ? function isFrozen(it){
    return isObject(it) ? fn(it) : true;
  } : ID == 4 ? function isSealed(it){
    return isObject(it) ? fn(it) : true;
  } : ID == 5 ? function isExtensible(it){
    return isObject(it) ? fn(it) : false;
  } : ID == 6 ? function getOwnPropertyDescriptor(it, key){
    return fn(toObject(it), key);
  } : ID == 7 ? function getPrototypeOf(it){
    return fn(Object($.assertDefined(it)));
  } : ID == 8 ? function keys(it){
    return fn(toObject(it));
  } : require('./$.get-names').get;
  try {
    fn('z');
  } catch(e){
    forced = 1;
  }
  $def($def.S + $def.F * forced, 'Object', method);
});
},{"./$":100,"./$.def":89,"./$.get-names":94}],120:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var cof = require('./$.cof')
  , tmp = {};
tmp[require('./$.wks')('toStringTag')] = 'z';
if(require('./$').FW && cof(tmp) != 'z'){
  require('./$.redef')(Object.prototype, 'toString', function toString(){
    return '[object ' + cof.classof(this) + ']';
  }, true);
}
},{"./$":100,"./$.cof":84,"./$.redef":103,"./$.wks":112}],121:[function(require,module,exports){
'use strict';
var $        = require('./$')
  , ctx      = require('./$.ctx')
  , cof      = require('./$.cof')
  , $def     = require('./$.def')
  , assert   = require('./$.assert')
  , forOf    = require('./$.for-of')
  , setProto = require('./$.set-proto').set
  , same     = require('./$.same')
  , species  = require('./$.species')
  , SPECIES  = require('./$.wks')('species')
  , RECORD   = require('./$.uid').safe('record')
  , PROMISE  = 'Promise'
  , global   = $.g
  , process  = global.process
  , isNode   = cof(process) == 'process'
  , asap     = process && process.nextTick || require('./$.task').set
  , P        = global[PROMISE]
  , isFunction     = $.isFunction
  , isObject       = $.isObject
  , assertFunction = assert.fn
  , assertObject   = assert.obj
  , Wrapper;

function testResolve(sub){
  var test = new P(function(){});
  if(sub)test.constructor = Object;
  return P.resolve(test) === test;
}

var useNative = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = isFunction(P) && isFunction(P.resolve) && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && $.DESC){
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
function isPromise(it){
  return isObject(it) && (useNative ? cof.classof(it) == 'Promise' : RECORD in it);
}
function sameConstructor(a, b){
  // library wrapper special case
  if(!$.FW && a === P && b === Wrapper)return true;
  return same(a, b);
}
function getConstructor(C){
  var S = assertObject(C)[SPECIES];
  return S != undefined ? S : C;
}
function isThenable(it){
  var then;
  if(isObject(it))then = it.then;
  return isFunction(then) ? then : false;
}
function notify(record){
  var chain = record.c;
  // strange IE + webpack dev server bug - use .call(global)
  if(chain.length)asap.call(global, function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    function run(react){
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
    }
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    chain.length = 0;
  });
}
function isUnhandled(promise){
  var record = promise[RECORD]
    , chain  = record.a || record.c
    , i      = 0
    , react;
  if(record.h)return false;
  while(chain.length > i){
    react = chain[i++];
    if(react.fail || !isUnhandled(react.P))return false;
  } return true;
}
function $reject(value){
  var record = this
    , promise;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  setTimeout(function(){
    // strange IE + webpack dev server bug - use .call(global)
    asap.call(global, function(){
      if(isUnhandled(promise = record.p)){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(global.console && console.error){
          console.error('Unhandled promise rejection', value);
        }
      }
      record.a = undefined;
    });
  }, 1);
  notify(record);
}
function $resolve(value){
  var record = this
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(then = isThenable(value)){
      // strange IE + webpack dev server bug - use .call(global)
      asap.call(global, function(){
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
      notify(record);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
  }
}

// constructor polyfill
if(!useNative){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    assertFunction(executor);
    var record = {
      p: assert.inst(this, P, PROMISE),       // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false                                // <- handled rejection
    };
    $.hide(this, RECORD, record);
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  require('./$.mix')(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var S = assertObject(assertObject(this).constructor)[SPECIES];
      var react = {
        ok:   isFunction(onFulfilled) ? onFulfilled : true,
        fail: isFunction(onRejected)  ? onRejected  : false
      };
      var promise = react.P = new (S != undefined ? S : P)(function(res, rej){
        react.res = assertFunction(res);
        react.rej = assertFunction(rej);
      });
      var record = this[RECORD];
      record.c.push(react);
      if(record.a)record.a.push(react);
      if(record.s)notify(record);
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
cof.set(P, PROMISE);
species(P);
species(Wrapper = $.core[PROMISE]);

// statics
$def($def.S + $def.F * !useNative, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    return new (getConstructor(this))(function(res, rej){ rej(r); });
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
},{"./$":100,"./$.assert":82,"./$.cof":84,"./$.ctx":88,"./$.def":89,"./$.for-of":92,"./$.iter-detect":98,"./$.mix":102,"./$.same":104,"./$.set-proto":105,"./$.species":107,"./$.task":109,"./$.uid":110,"./$.wks":112}],122:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.2 Set Objects
require('./$.collection')('Set', function(get){
  return function Set(){ return get(this, arguments[0]); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./$.collection":87,"./$.collection-strong":85}],123:[function(require,module,exports){
var set   = require('./$').set
  , $at   = require('./$.string-at')(true)
  , ITER  = require('./$.uid').safe('iter')
  , $iter = require('./$.iter')
  , step  = $iter.step;

// 21.1.3.27 String.prototype[@@iterator]()
require('./$.iter-define')(String, 'String', function(iterated){
  set(this, ITER, {o: String(iterated), i: 0});
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var iter  = this[ITER]
    , O     = iter.o
    , index = iter.i
    , point;
  if(index >= O.length)return step(1);
  point = $at(O, index);
  iter.i += point.length;
  return step(0, point);
});
},{"./$":100,"./$.iter":99,"./$.iter-define":97,"./$.string-at":108,"./$.uid":110}],124:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $        = require('./$')
  , setTag   = require('./$.cof').set
  , uid      = require('./$.uid')
  , shared   = require('./$.shared')
  , $def     = require('./$.def')
  , $redef   = require('./$.redef')
  , keyOf    = require('./$.keyof')
  , enumKeys = require('./$.enum-keys')
  , assertObject = require('./$.assert').obj
  , ObjectProto = Object.prototype
  , DESC     = $.DESC
  , has      = $.has
  , $create  = $.create
  , getDesc  = $.getDesc
  , setDesc  = $.setDesc
  , desc     = $.desc
  , $names   = require('./$.get-names')
  , getNames = $names.get
  , toObject = $.toObject
  , $Symbol  = $.g.Symbol
  , setter   = false
  , TAG      = uid('tag')
  , HIDDEN   = uid('hidden')
  , _propertyIsEnumerable = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols = shared('symbols')
  , useNative = $.isFunction($Symbol);

var setSymbolDesc = DESC ? function(){ // fallback for old Android
  try {
    return $create(setDesc({}, HIDDEN, {
      get: function(){
        return setDesc(this, HIDDEN, {value: false})[HIDDEN];
      }
    }))[HIDDEN] || setDesc;
  } catch(e){
    return function(it, key, D){
      var protoDesc = getDesc(ObjectProto, key);
      if(protoDesc)delete ObjectProto[key];
      setDesc(it, key, D);
      if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
    };
  }
}() : setDesc;

function wrap(tag){
  var sym = AllSymbols[tag] = $.set($create($Symbol.prototype), TAG, tag);
  DESC && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, desc(1, value));
    }
  });
  return sym;
}

function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, desc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = $create(D, {enumerable: desc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return setDesc(it, key, D);
}
function defineProperties(it, P){
  assertObject(it);
  var keys = enumKeys(P = toObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)defineProperty(it, key = keys[i++], P[key]);
  return it;
}
function create(it, P){
  return P === undefined ? $create(it) : defineProperties($create(it), P);
}
function propertyIsEnumerable(key){
  var E = _propertyIsEnumerable.call(this, key);
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
    ? E : true;
}
function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
}
function getOwnPropertyNames(it){
  var names  = getNames(toObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
}
function getOwnPropertySymbols(it){
  var names  = getNames(toObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
}

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments[0]));
  };
  $redef($Symbol.prototype, 'toString', function(){
    return this[TAG];
  });

  $.create     = create;
  $.setDesc    = defineProperty;
  $.getDesc    = getOwnPropertyDescriptor;
  $.setDescs   = defineProperties;
  $.getNames   = $names.get = getOwnPropertyNames;
  $.getSymbols = getOwnPropertySymbols;

  if($.DESC && $.FW)$redef(ObjectProto, 'propertyIsEnumerable', propertyIsEnumerable, true);
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
    var sym = require('./$.wks')(it);
    symbolStatics[it] = useNative ? sym : wrap(sym);
  }
);

setter = true;

$def($def.G + $def.W, {Symbol: $Symbol});

$def($def.S, 'Symbol', symbolStatics);

$def($def.S + $def.F * !useNative, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: getOwnPropertySymbols
});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setTag($.g.JSON, 'JSON', true);
},{"./$":100,"./$.assert":82,"./$.cof":84,"./$.def":89,"./$.enum-keys":91,"./$.get-names":94,"./$.keyof":101,"./$.redef":103,"./$.shared":106,"./$.uid":110,"./$.wks":112}],125:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
require('./$.collection-to-json')('Map');
},{"./$.collection-to-json":86}],126:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
require('./$.collection-to-json')('Set');
},{"./$.collection-to-json":86}],127:[function(require,module,exports){
require('./es6.array.iterator');
var $           = require('./$')
  , Iterators   = require('./$.iter').Iterators
  , ITERATOR    = require('./$.wks')('iterator')
  , ArrayValues = Iterators.Array
  , NL          = $.g.NodeList
  , HTC         = $.g.HTMLCollection
  , NLProto     = NL && NL.prototype
  , HTCProto    = HTC && HTC.prototype;
if($.FW){
  if(NL && !(ITERATOR in NLProto))$.hide(NLProto, ITERATOR, ArrayValues);
  if(HTC && !(ITERATOR in HTCProto))$.hide(HTCProto, ITERATOR, ArrayValues);
}
Iterators.NodeList = Iterators.HTMLCollection = ArrayValues;
},{"./$":100,"./$.iter":99,"./$.wks":112,"./es6.array.iterator":115}],128:[function(require,module,exports){
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
  delete g.regeneratorRuntime;
}

module.exports = { "default": module.exports, __esModule: true };

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./runtime":129}],129:[function(require,module,exports){
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

},{"_process":132,"babel-runtime/core-js/object/create":54,"babel-runtime/core-js/promise":59,"babel-runtime/core-js/symbol":61,"babel-runtime/core-js/symbol/iterator":62}],130:[function(require,module,exports){
if (typeof Map === "undefined") {
  Map = function() {};
  Map.prototype = {
    set: function(k, v) { this["$" + k] = v; return this; },
    get: function(k) { return this["$" + k]; },
    has: function(k) { return "$" + k in this; }
  };
}

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.d3 = factory();
}(this, function () { 'use strict';

    var bug44083 = typeof navigator !== "undefined" && /WebKit/.test(navigator.userAgent) ? -1 : 0; // https://bugs.webkit.org/show_bug.cgi?id=44083// When depth = 1, root = [Node, …].
    // When depth = 2, root = [[Node, …], …].
    // When depth = 3, root = [[[Node, …], …], …]. etc.
    // Note that [Node, …] and NodeList are used interchangeably; see arrayify.

    function Selection(root, depth) {
      this._root = root;
      this._depth = depth;
      this._enter = this._update = this._exit = null;
    }
    var defaultView = function(node) {
      return node
          && ((node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
              || (node.document && node) // node is a Window
              || node.defaultView); // node is a Document
    }

    function dispatchEvent(node, type, params) {
      var window = defaultView(node),
          event = window.CustomEvent;

      if (event) {
        event = new event(type, params);
      } else {
        event = window.document.createEvent("Event");
        if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
        else event.initEvent(type, false, false);
      }

      node.dispatchEvent(event);
    }

    var selection_dispatch = function(type, params) {

      function dispatchConstant() {
        return dispatchEvent(this, type, params);
      }

      function dispatchFunction() {
        return dispatchEvent(this, type, params.apply(this, arguments));
      }

      return this.each(typeof params === "function" ? dispatchFunction : dispatchConstant);
    }

    function noop() {}
    var requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

    var requote = function(string) {
      return string.replace(requoteRe, "\\$&");
    }

    function filterListenerOf(listener) {
      return function(event) {
        var related = event.relatedTarget;
        if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
          listener(event);
        }
      };
    }

    var event = null;

    function listenerOf(listener, ancestors, args) {
      return function(event1) {
        var i = ancestors.length, event0 = event; // Events can be reentrant (e.g., focus).
        while (--i >= 0) args[i << 1] = ancestors[i].__data__;
        event = event1;
        try {
          listener.apply(ancestors[0], args);
        } finally {
          event = event0;
        }
      };
    }

    var filterEvents = new Map;

    var selection_event = function(type, listener, capture) {
      var n = arguments.length,
          key = "__on" + type,
          filter,
          root = this._root;

      if (n < 2) return (n = this.node()[key]) && n._listener;

      if (n < 3) capture = false;
      if ((n = type.indexOf(".")) > 0) type = type.slice(0, n);
      if (filter = filterEvents.has(type)) type = filterEvents.get(type);

      function add() {
        var ancestor = root, i = arguments.length >> 1, ancestors = new Array(i);
        while (--i >= 0) ancestor = ancestor[arguments[(i << 1) + 1]], ancestors[i] = i ? ancestor._parent : ancestor;
        var l = listenerOf(listener, ancestors, arguments);
        if (filter) l = filterListenerOf(l);
        remove.call(this);
        this.addEventListener(type, this[key] = l, l._capture = capture);
        l._listener = listener;
      }

      function remove() {
        var l = this[key];
        if (l) {
          this.removeEventListener(type, l, l._capture);
          delete this[key];
        }
      }

      function removeAll() {
        var re = new RegExp("^__on([^.]+)" + requote(type) + "$"), match;
        for (var name in this) {
          if (match = name.match(re)) {
            var l = this[name];
            this.removeEventListener(match[1], l, l._capture);
            delete this[name];
          }
        }
      }

      return this.each(listener
          ? (n ? add : noop) // Attempt to add untyped listener is ignored.
          : (n ? remove : removeAll));
    }
    var selection_datum = function(value) {
      return arguments.length ? this.property("__data__", value) : this.node().__data__;
    }
    var selection_remove = function() {
      return this.each(function() {
        var parent = this.parentNode;
        if (parent) parent.removeChild(this);
      });
    }
    var selectorOf = function(selector) {
      return function() {
        return this.querySelector(selector);
      };
    }
    var namespaces = (new Map)
        .set("svg", "http://www.w3.org/2000/svg")
        .set("xhtml", "http://www.w3.org/1999/xhtml")
        .set("xlink", "http://www.w3.org/1999/xlink")
        .set("xml", "http://www.w3.org/XML/1998/namespace")
        .set("xmlns", "http://www.w3.org/2000/xmlns/");

    var namespace = function(name) {
      var i = name.indexOf(":"), prefix = name;
      if (i >= 0) prefix = name.slice(0, i), name = name.slice(i + 1);
      return namespaces.has(prefix) ? {space: namespaces.get(prefix), local: name} : name;
    }

    function creatorOf(name) {
      name = namespace(name);

      function creator() {
        var document = this.ownerDocument,
            uri = this.namespaceURI;
        return uri
            ? document.createElementNS(uri, name)
            : document.createElement(name);
      }

      function creatorNS() {
        return this.ownerDocument.createElementNS(name.space, name.local);
      }

      return name.local ? creatorNS : creator;
    }

    var selection_append = function(creator, selector) {
      if (typeof creator !== "function") creator = creatorOf(creator);

      function append() {
        return this.appendChild(creator.apply(this, arguments));
      }

      function insert() {
        return this.insertBefore(creator.apply(this, arguments), selector.apply(this, arguments) || null);
      }

      return this.select(arguments.length < 2
          ? append
          : (typeof selector !== "function" && (selector = selectorOf(selector)), insert));
    }
    var selection_html = function(value) {
      if (!arguments.length) return this.node().innerHTML;

      function setConstant() {
        this.innerHTML = value;
      }

      function setFunction() {
        var v = value.apply(this, arguments);
        this.innerHTML = v == null ? "" : v;
      }

      if (value == null) value = "";

      return this.each(typeof value === "function" ? setFunction : setConstant);
    }
    var selection_text = function(value) {
      if (!arguments.length) return this.node().textContent;

      function setConstant() {
        this.textContent = value;
      }

      function setFunction() {
        var v = value.apply(this, arguments);
        this.textContent = v == null ? "" : v;
      }

      if (value == null) value = "";

      return this.each(typeof value === "function" ? setFunction : setConstant);
    }

    function collapse(string) {
      return string.trim().replace(/\s+/g, " ");
    }

    function classerOf(name) {
      var re;
      return function(node, value) {
        if (c = node.classList) return value ? c.add(name) : c.remove(name);
        if (!re) re = new RegExp("(?:^|\\s+)" + requote(name) + "(?:\\s+|$)", "g");
        var c = node.getAttribute("class") || "";
        if (value) {
          re.lastIndex = 0;
          if (!re.test(c)) node.setAttribute("class", collapse(c + " " + name));
        } else {
          node.setAttribute("class", collapse(c.replace(re, " ")));
        }
      };
    }

    var selection_class = function(name, value) {
      name = (name + "").trim().split(/^|\s+/);
      var n = name.length;

      if (arguments.length < 2) {
        var node = this.node(), i = -1;
        if (value = node.classList) { // SVG elements may not support DOMTokenList!
          while (++i < n) if (!value.contains(name[i])) return false;
        } else {
          value = node.getAttribute("class");
          while (++i < n) if (!classedRe(name[i]).test(value)) return false;
        }
        return true;
      }

      name = name.map(classerOf);

      function setConstant() {
        var i = -1;
        while (++i < n) name[i](this, value);
      }

      function setFunction() {
        var i = -1, x = value.apply(this, arguments);
        while (++i < n) name[i](this, x);
      }

      return this.each(typeof value === "function" ? setFunction : setConstant);
    }
    var selection_property = function(name, value) {
      if (arguments.length < 2) return this.node()[name];

      function remove() {
        delete this[name];
      }

      function setConstant() {
        this[name] = value;
      }

      function setFunction() {
        var x = value.apply(this, arguments);
        if (x == null) delete this[name];
        else this[name] = x;
      }

      return this.each(value == null ? remove : typeof value === "function" ? setFunction : setConstant);
    }

    var selection_style = function(name, value, priority) {
      var n = arguments.length;

      if (n < 2) return defaultView(n = this.node()).getComputedStyle(n, null).getPropertyValue(name);

      if (n < 3) priority = "";

      function remove() {
        this.style.removeProperty(name);
      }

      function setConstant() {
        this.style.setProperty(name, value, priority);
      }

      function setFunction() {
        var x = value.apply(this, arguments);
        if (x == null) this.style.removeProperty(name);
        else this.style.setProperty(name, x, priority);
      }

      return this.each(value == null ? remove : typeof value === "function" ? setFunction : setConstant);
    }

    var selection_attr = function(name, value) {
      name = namespace(name);

      if (arguments.length < 2) {
        var node = this.node();
        return name.local
            ? node.getAttributeNS(name.space, name.local)
            : node.getAttribute(name);
      }

      function remove() {
        this.removeAttribute(name);
      }

      function removeNS() {
        this.removeAttributeNS(name.space, name.local);
      }

      function setConstant() {
        this.setAttribute(name, value);
      }

      function setConstantNS() {
        this.setAttributeNS(name.space, name.local, value);
      }

      function setFunction() {
        var x = value.apply(this, arguments);
        if (x == null) this.removeAttribute(name);
        else this.setAttribute(name, x);
      }

      function setFunctionNS() {
        var x = value.apply(this, arguments);
        if (x == null) this.removeAttributeNS(name.space, name.local);
        else this.setAttributeNS(name.space, name.local, x);
      }

      return this.each(value == null
          ? (name.local ? removeNS : remove)
          : (typeof value === "function"
              ? (name.local ? setFunctionNS : setFunction)
              : (name.local ? setConstantNS : setConstant)));
    }
    var selection_each = function(callback) {
      var depth = this._depth,
          stack = new Array(depth);

      function visit(nodes, depth) {
        var i = -1,
            n = nodes.length,
            node;

        if (--depth) {
          var stack0 = depth * 2,
              stack1 = stack0 + 1;
          while (++i < n) {
            if (node = nodes[i]) {
              stack[stack0] = node._parent.__data__, stack[stack1] = i;
              visit(node, depth);
            }
          }
        }

        else {
          while (++i < n) {
            if (node = nodes[i]) {
              stack[0] = node.__data__, stack[1] = i;
              callback.apply(node, stack);
            }
          }
        }
      }

      visit(this._root, depth);
      return this;
    }
    var selection_empty = function() {
      return !this.node();
    }
    var selection_size = function() {
      var size = 0;
      this.each(function() { ++size; });
      return size;
    }

    function firstNode(nodes, depth) {
      var i = -1,
          n = nodes.length,
          node;

      if (--depth) {
        while (++i < n) {
          if (node = nodes[i]) {
            if (node = firstNode(node, depth)) {
              return node;
            }
          }
        }
      }

      else {
        while (++i < n) {
          if (node = nodes[i]) {
            return node;
          }
        }
      }
    }
    var selection_node = function() {
      return firstNode(this._root, this._depth);
    }
    var selection_nodes = function() {
      var nodes = new Array(this.size()), i = -1;
      this.each(function() { nodes[++i] = this; });
      return nodes;
    }
    var selection_call = function() {
      var callback = arguments[0];
      callback.apply(arguments[0] = this, arguments);
      return this;
    }

    function arrayifyNode(nodes, depth) {
      var i = -1,
          n = nodes.length,
          node;

      if (--depth) {
        while (++i < n) {
          if (node = nodes[i]) {
            nodes[i] = arrayifyNode(node, depth);
          }
        }
      }

      else if (!Array.isArray(nodes)) {
        var array = new Array(n);
        while (++i < n) array[i] = nodes[i];
        array._parent = nodes._parent;
        nodes = array;
      }

      return nodes;
    }// The leaf groups of the selection hierarchy are initially NodeList,
    // and then lazily converted to arrays when mutation is required.
    var arrayify = function(selection) {
      return selection._root = arrayifyNode(selection._root, selection._depth);
    }

    function ascending(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    var selection_sort = function(comparator) {
      if (!comparator) comparator = ascending;

      function compare(a, b) {
        return a && b ? comparator(a.__data__, b.__data__) : !a - !b;
      }

      function visit(nodes, depth) {
        if (--depth) {
          var i = -1,
              n = nodes.length,
              node;
          while (++i < n) {
            if (node = nodes[i]) {
              visit(node, depth);
            }
          }
        }

        else {
          nodes.sort(compare);
        }
      }

      visit(arrayify(this), this._depth);
      return this.order();
    }

    function orderNode(nodes, depth) {
      var i = nodes.length,
          node,
          next;

      if (--depth) {
        while (--i >= 0) {
          if (node = nodes[i]) {
            orderNode(node, depth);
          }
        }
      }

      else {
        next = nodes[--i];
        while (--i >= 0) {
          if (node = nodes[i]) {
            if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
            next = node;
          }
        }
      }
    }
    var selection_order = function() {
      orderNode(this._root, this._depth);
      return this;
    }

    function emptyNode(nodes, depth) {
      var i = -1,
          n = nodes.length,
          node,
          empty = new Array(n);

      if (--depth) {
        while (++i < n) {
          if (node = nodes[i]) {
            empty[i] = emptyNode(node, depth);
          }
        }
      }

      empty._parent = nodes._parent;
      return empty;
    }

    var emptyOf = function(selection) {
      return new Selection(emptyNode(arrayify(selection), selection._depth), selection._depth);
    }// Lazily constructs the exit selection for this (update) selection.
    // Until this selection is joined to data, the exit selection will be empty.

    var selection_exit = function() {
      return this._exit || (this._exit = emptyOf(this));
    }// Lazily constructs the enter selection for this (update) selection.
    // Until this selection is joined to data, the enter selection will be empty.

    var selection_enter = function() {
      if (!this._enter) {
        this._enter = emptyOf(this);
        this._enter._update = this;
      }
      return this._enter;
    }

    function EnterNode(parent, datum) {
      this.ownerDocument = parent.ownerDocument;
      this.namespaceURI = parent.namespaceURI;
      this._next = null;
      this._parent = parent;
      this.__data__ = datum;
    }

    EnterNode.prototype = {
      appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
      insertBefore: function(child, next) { return this._parent.insertBefore(child, next || this._next); }
    };

    function valueOf_(value) { // XXX https://github.com/rollup/rollup/issues/12
      return function() {
        return value;
      };
    }// The value may either be an array or a function that returns an array.
    // An optional key function may be specified to control how data is bound;
    // if no key function is specified, data is bound to nodes by index.
    // Or, if no arguments are specified, this method returns all bound data.
    var selection_data = function(value, key) {
      if (!value) {
        var data = new Array(this.size()), i = -1;
        this.each(function(d) { data[++i] = d; });
        return data;
      }

      var depth = this._depth - 1,
          stack = new Array(depth * 2),
          bind = key ? bindKey : bindIndex;

      if (typeof value !== "function") value = valueOf_(value);
      visit(this._root, this.enter()._root, this.exit()._root, depth);

      function visit(update, enter, exit, depth) {
        var i = -1,
            n,
            node;

        if (depth--) {
          var stack0 = depth * 2,
              stack1 = stack0 + 1;

          n = update.length;

          while (++i < n) {
            if (node = update[i]) {
              stack[stack0] = node._parent.__data__, stack[stack1] = i;
              visit(node, enter[i], exit[i], depth);
            }
          }
        }

        else {
          var j = 0,
              before;

          bind(update, enter, exit, value.apply(update._parent, stack));
          n = update.length;

          // Now connect the enter nodes to their following update node, such that
          // appendChild can insert the materialized enter node before this node,
          // rather than at the end of the parent node.
          while (++i < n) {
            if (before = enter[i]) {
              if (i >= j) j = i + 1;
              while (!(node = update[j]) && ++j < n);
              before._next = node || null;
            }
          }
        }
      }

      function bindIndex(update, enter, exit, data) {
        var i = 0,
            node,
            nodeLength = update.length,
            dataLength = data.length,
            minLength = Math.min(nodeLength, dataLength);

        // Clear the enter and exit arrays, and then initialize to the new length.
        enter.length = 0, enter.length = dataLength;
        exit.length = 0, exit.length = nodeLength;

        for (; i < minLength; ++i) {
          if (node = update[i]) {
            node.__data__ = data[i];
          } else {
            enter[i] = new EnterNode(update._parent, data[i]);
          }
        }

        // Note: we don’t need to delete update[i] here because this loop only
        // runs when the data length is greater than the node length.
        for (; i < dataLength; ++i) {
          enter[i] = new EnterNode(update._parent, data[i]);
        }

        // Note: and, we don’t need to delete update[i] here because immediately
        // following this loop we set the update length to data length.
        for (; i < nodeLength; ++i) {
          if (node = update[i]) {
            exit[i] = update[i];
          }
        }

        update.length = dataLength;
      }

      function bindKey(update, enter, exit, data) {
        var i,
            node,
            dataLength = data.length,
            nodeLength = update.length,
            nodeByKeyValue = new Map,
            keyStack = new Array(2).concat(stack),
            keyValues = new Array(nodeLength),
            keyValue;

        // Clear the enter and exit arrays, and then initialize to the new length.
        enter.length = 0, enter.length = dataLength;
        exit.length = 0, exit.length = nodeLength;

        // Compute the keys for each node.
        for (i = 0; i < nodeLength; ++i) {
          if (node = update[i]) {
            keyStack[0] = node.__data__, keyStack[1] = i;
            keyValues[i] = keyValue = key.apply(node, keyStack);

            // Is this a duplicate of a key we’ve previously seen?
            // If so, this node is moved to the exit selection.
            if (nodeByKeyValue.has(keyValue)) {
              exit[i] = node;
            }

            // Otherwise, record the mapping from key to node.
            else {
              nodeByKeyValue.set(keyValue, node);
            }
          }
        }

        // Now clear the update array and initialize to the new length.
        update.length = 0, update.length = dataLength;

        // Compute the keys for each datum.
        for (i = 0; i < dataLength; ++i) {
          keyStack[0] = data[i], keyStack[1] = i;
          keyValue = key.apply(update._parent, keyStack);

          // Is there a node associated with this key?
          // If not, this datum is added to the enter selection.
          if (!(node = nodeByKeyValue.get(keyValue))) {
            enter[i] = new EnterNode(update._parent, data[i]);
          }

          // Did we already bind a node using this key? (Or is a duplicate?)
          // If unique, the node and datum are joined in the update selection.
          // Otherwise, the datum is ignored, neither entering nor exiting.
          else if (node !== true) {
            update[i] = node;
            node.__data__ = data[i];
          }

          // Record that we consumed this key, either to enter or update.
          nodeByKeyValue.set(keyValue, true);
        }

        // Take any remaining nodes that were not bound to data,
        // and place them in the exit selection.
        for (i = 0; i < nodeLength; ++i) {
          if ((node = nodeByKeyValue.get(keyValues[i])) !== true) {
            exit[i] = node;
          }
        }
      }

      return this;
    }

    var filterOf = function(selector) {
      return function() {
        return this.matches(selector);
      };
    };

    if (typeof document !== "undefined") {
      var element = document.documentElement;
      if (!element.matches) {
        var vendorMatches = element.webkitMatchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector;
        filterOf = function(selector) { return function() { return vendorMatches.call(this, selector); }; };
      }
    }// The filter may either be a selector string (e.g., ".foo")
    // or a function that returns a boolean.

    var selection_filter = function(filter) {
      var depth = this._depth,
          stack = new Array(depth * 2);

      if (typeof filter !== "function") filter = filterOf(filter);

      function visit(nodes, depth) {
        var i = -1,
            n = nodes.length,
            node,
            subnodes;

        if (--depth) {
          var stack0 = depth * 2,
              stack1 = stack0 + 1;
          subnodes = new Array(n);
          while (++i < n) {
            if (node = nodes[i]) {
              stack[stack0] = node._parent.__data__, stack[stack1] = i;
              subnodes[i] = visit(node, depth);
            }
          }
        }

        // The filter operation does not preserve the original index,
        // so the resulting leaf groups are dense (not sparse).
        else {
          subnodes = [];
          while (++i < n) {
            if (node = nodes[i]) {
              stack[0] = node.__data__, stack[1] = i;
              if (filter.apply(node, stack)) {
                subnodes.push(node);
              }
            }
          }
        }

        subnodes._parent = nodes._parent;
        return subnodes;
      }

      return new Selection(visit(this._root, depth), depth);
    }

    function selectorAllOf(selector) {
      return function() {
        return this.querySelectorAll(selector);
      };
    }// The selector may either be a selector string (e.g., ".foo")
    // or a function that optionally returns an array of nodes to select.
    // This is the only operation that increases the depth of a selection.

    var selection_selectAll = function(selector) {
      var depth = this._depth,
          stack = new Array(depth * 2);

      if (typeof selector !== "function") selector = selectorAllOf(selector);

      function visit(nodes, depth) {
        var i = -1,
            n = nodes.length,
            node,
            subnode,
            subnodes = new Array(n);

        if (--depth) {
          var stack0 = depth * 2,
              stack1 = stack0 + 1;
          while (++i < n) {
            if (node = nodes[i]) {
              stack[stack0] = node._parent.__data__, stack[stack1] = i;
              subnodes[i] = visit(node, depth);
            }
          }
        }

        // Data is not propagated since there is a one-to-many mapping.
        // The parent of the new leaf group is the old node.
        else {
          while (++i < n) {
            if (node = nodes[i]) {
              stack[0] = node.__data__, stack[1] = i;
              subnodes[i] = subnode = selector.apply(node, stack);
              subnode._parent = node;
            }
          }
        }

        subnodes._parent = nodes._parent;
        return subnodes;
      }

      return new Selection(visit(this._root, depth), depth + 1);
    }// The selector may either be a selector string (e.g., ".foo")
    // or a function that optionally returns the node to select.

    var selection_select = function(selector) {
      var depth = this._depth,
          stack = new Array(depth * 2);

      if (typeof selector !== "function") selector = selectorOf(selector);

      function visit(nodes, update, depth) {
        var i = -1,
            n = nodes.length,
            node,
            subnode,
            subnodes = new Array(n);

        if (--depth) {
          var stack0 = depth * 2,
              stack1 = stack0 + 1;
          while (++i < n) {
            if (node = nodes[i]) {
              stack[stack0] = node._parent.__data__, stack[stack1] = i;
              subnodes[i] = visit(node, update && update[i], depth);
            }
          }
        }

        // The leaf group may be sparse if the selector returns a falsey value;
        // this preserves the index of nodes (unlike selection.filter).
        // Propagate data to the new node only if it is defined on the old.
        // If this is an enter selection, materialized nodes are moved to update.
        else {
          while (++i < n) {
            if (node = nodes[i]) {
              stack[0] = node.__data__, stack[1] = i;
              if (subnode = selector.apply(node, stack)) {
                if ("__data__" in node) subnode.__data__ = node.__data__;
                if (update) update[i] = subnode, delete nodes[i];
                subnodes[i] = subnode;
              }
            }
          }
        }

        subnodes._parent = nodes._parent;
        return subnodes;
      }

      return new Selection(visit(this._root, this._update && this._update._root, depth), depth);
    }

    function selection() {
      return new Selection([document.documentElement], 1);
    }

    Selection.prototype = selection.prototype = {
      select: selection_select,
      selectAll: selection_selectAll,
      filter: selection_filter,
      data: selection_data,
      enter: selection_enter,
      exit: selection_exit,
      order: selection_order,
      sort: selection_sort,
      call: selection_call,
      nodes: selection_nodes,
      node: selection_node,
      size: selection_size,
      empty: selection_empty,
      each: selection_each,
      attr: selection_attr,
      style: selection_style,
      property: selection_property,
      class: selection_class,
      classed: selection_class, // deprecated alias
      text: selection_text,
      html: selection_html,
      append: selection_append,
      insert: selection_append, // deprecated alias
      remove: selection_remove,
      datum: selection_datum,
      event: selection_event,
      on: selection_event, // deprecated alias
      dispatch: selection_dispatch
    };

    var select = function(selector) {
      return new Selection([typeof selector === "string" ? document.querySelector(selector) : selector], 1);
    }

    var point = function(node, event) {
      var svg = node.ownerSVGElement || node;
      if (svg.createSVGPoint) {
        var point = svg.createSVGPoint();
        if (bug44083 < 0) {
          var window = defaultView(node);
          if (window.scrollX || window.scrollY) {
            svg = select(window.document.body).append("svg").style({position: "absolute", top: 0, left: 0, margin: 0, padding: 0, border: "none"}, "important");
            var ctm = svg.node().getScreenCTM();
            bug44083 = !(ctm.f || ctm.e);
            svg.remove();
          }
        }
        if (bug44083) point.x = event.pageX, point.y = event.pageY;
        else point.x = event.clientX, point.y = event.clientY;
        point = point.matrixTransform(node.getScreenCTM().inverse());
        return [point.x, point.y];
      }
      var rect = node.getBoundingClientRect();
      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
    }

    var sourceEvent = function() {
      var current = event, source;
      while (source = current.sourceEvent) current = source;
      return current;
    }

    var touches = function(node, touches) {
      if (arguments.length < 2) touches = sourceEvent().touches;
      for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
        points[i] = point(node, touches[i]);
      }
      return points;
    }

    var touch = function(node, touches, identifier) {
      if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;
      for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
        if ((touch = touches[i]).identifier === identifier) {
          return point(node, touch);
        }
      }
      return null;
    }

    var selectAll = function(selector) {
      return new Selection(typeof selector === "string" ? document.querySelectorAll(selector) : selector, 1);
    }

    var mouse = function(node, event) {
      if (arguments.length < 2) event = sourceEvent();
      if (event.changedTouches) event = event.changedTouches[0];
      return point(node, event);
    }

    var d3 = {
      get event() { return event; },
      mouse: mouse,
      namespace: namespace,
      namespaces: namespaces,
      requote: requote,
      select: select,
      selectAll: selectAll,
      selection: selection,
      touch: touch,
      touches: touches
    };

    return d3;

}));
},{}],131:[function(require,module,exports){
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

},{}],132:[function(require,module,exports){
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
            currentQueue[queueIndex].run();
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
    if (!draining) {
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

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIndhdmVzLXVpLmpzIiwiZGlzdC9heGlzL2VzNi9heGlzL2F4aXMtbGF5ZXIuanMiLCJkaXN0L2F4aXMvZXM2L2F4aXMvdGltZS1heGlzLWdlbmVyYXRvci5qcyIsImRpc3QvYmVoYXZpb3JzL2VzNi9iZWhhdmlvcnMvYmFzZS1iZWhhdmlvci5qcyIsImRpc3QvYmVoYXZpb3JzL2VzNi9iZWhhdmlvcnMvYnJlYWtwb2ludC1iZWhhdmlvci5qcyIsImRpc3QvYmVoYXZpb3JzL2VzNi9iZWhhdmlvcnMvbWFya2VyLWJlaGF2aW9yLmpzIiwiZGlzdC9iZWhhdmlvcnMvZXM2L2JlaGF2aW9ycy9zZWdtZW50LWJlaGF2aW9yLmpzIiwiZGlzdC9iZWhhdmlvcnMvZXM2L2JlaGF2aW9ycy90aW1lLWNvbnRleHQtYmVoYXZpb3IuanMiLCJkaXN0L2JlaGF2aW9ycy9lczYvYmVoYXZpb3JzL3RyYWNlLWJlaGF2aW9yLmpzIiwiZGlzdC9jb3JlL2VzNi9jb3JlL2xheWVyLXRpbWUtY29udGV4dC5qcyIsImRpc3QvY29yZS9lczYvY29yZS9sYXllci5qcyIsImRpc3QvY29yZS9lczYvY29yZS9uYW1lc3BhY2UuanMiLCJkaXN0L2NvcmUvZXM2L2NvcmUvdGltZWxpbmUtdGltZS1jb250ZXh0LmpzIiwiZGlzdC9jb3JlL2VzNi9jb3JlL3RpbWVsaW5lLmpzIiwiZGlzdC9jb3JlL2VzNi9jb3JlL3RyYWNrLWNvbGxlY3Rpb24uanMiLCJkaXN0L2NvcmUvZXM2L2NvcmUvdHJhY2suanMiLCJkaXN0L2hlbHBlcnMvZXM2L2hlbHBlcnMvYW5ub3RhdGVkLW1hcmtlci1sYXllci5qcyIsImRpc3QvaGVscGVycy9lczYvaGVscGVycy9icmVha3BvaW50LWxheWVyLmpzIiwiZGlzdC9oZWxwZXJzL2VzNi9oZWxwZXJzL2N1cnNvci1sYXllci5qcyIsImRpc3QvaGVscGVycy9lczYvaGVscGVycy9tYXJrZXItbGF5ZXIuanMiLCJkaXN0L2hlbHBlcnMvZXM2L2hlbHBlcnMvc2VnbWVudC1sYXllci5qcyIsImRpc3QvaGVscGVycy9lczYvaGVscGVycy90cmFjZS1sYXllci5qcyIsImRpc3QvaGVscGVycy9lczYvaGVscGVycy93YXZlZm9ybS1sYXllci5qcyIsImRpc3QvaW50ZXJhY3Rpb25zL2VzNi9pbnRlcmFjdGlvbnMvZXZlbnQtc291cmNlLmpzIiwiZGlzdC9pbnRlcmFjdGlvbnMvZXM2L2ludGVyYWN0aW9ucy9rZXlib2FyZC5qcyIsImRpc3QvaW50ZXJhY3Rpb25zL2VzNi9pbnRlcmFjdGlvbnMvc3VyZmFjZS5qcyIsImRpc3QvaW50ZXJhY3Rpb25zL2VzNi9pbnRlcmFjdGlvbnMvd2F2ZS1ldmVudC5qcyIsImRpc3Qvc2hhcGVzL2VzNi9zaGFwZXMvYW5ub3RhdGVkLW1hcmtlci5qcyIsImRpc3Qvc2hhcGVzL2VzNi9zaGFwZXMvYW5ub3RhdGVkLXNlZ21lbnQuanMiLCJkaXN0L3NoYXBlcy9lczYvc2hhcGVzL2Jhc2Utc2hhcGUuanMiLCJkaXN0L3NoYXBlcy9lczYvc2hhcGVzL2N1cnNvci5qcyIsImRpc3Qvc2hhcGVzL2VzNi9zaGFwZXMvZG90LmpzIiwiZGlzdC9zaGFwZXMvZXM2L3NoYXBlcy9saW5lLmpzIiwiZGlzdC9zaGFwZXMvZXM2L3NoYXBlcy9tYXJrZXIuanMiLCJkaXN0L3NoYXBlcy9lczYvc2hhcGVzL3NlZ21lbnQuanMiLCJkaXN0L3NoYXBlcy9lczYvc2hhcGVzL3RpY2tzLmpzIiwiZGlzdC9zaGFwZXMvZXM2L3NoYXBlcy90cmFjZS1kb3RzLmpzIiwiZGlzdC9zaGFwZXMvZXM2L3NoYXBlcy90cmFjZS1wYXRoLmpzIiwiZGlzdC9zaGFwZXMvZXM2L3NoYXBlcy93YXZlZm9ybS5qcyIsImRpc3Qvc3RhdGVzL2VzNi9zdGF0ZXMvYmFzZS1zdGF0ZS5qcyIsImRpc3Qvc3RhdGVzL2VzNi9zdGF0ZXMvYnJ1c2gtem9vbS1zdGF0ZS5qcyIsImRpc3Qvc3RhdGVzL2VzNi9zdGF0ZXMvY2VudGVyZWQtem9vbS1zdGF0ZS5qcyIsImRpc3Qvc3RhdGVzL2VzNi9zdGF0ZXMvY29udGV4dC1lZGl0aW9uLXN0YXRlLmpzIiwiZGlzdC9zdGF0ZXMvZXM2L3N0YXRlcy9lZGl0aW9uLXN0YXRlLmpzIiwiZGlzdC9zdGF0ZXMvZXM2L3N0YXRlcy9zZWxlY3Rpb24tc3RhdGUuanMiLCJkaXN0L3N0YXRlcy9lczYvc3RhdGVzL3NpbXBsZS1lZGl0aW9uLXN0YXRlLmpzIiwiZGlzdC91dGlscy9lczYvdXRpbHMvZm9ybWF0LmpzIiwiZGlzdC91dGlscy9lczYvdXRpbHMvb3J0aG9nb25hbC1kYXRhLmpzIiwiZGlzdC91dGlscy9lczYvdXRpbHMvc2NhbGVzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9hcnJheS9mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9nZXQtaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL21hcC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2Fzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2NyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1vd24tcHJvcGVydHktZGVzY3JpcHRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2tleXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9wcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9zZXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3N5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvc3ltYm9sL2l0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzcy1jYWxsLWNoZWNrLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGUtY2xhc3MuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2dldC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2ludGVyb3AtcmVxdWlyZS1kZWZhdWx0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy90by1jb25zdW1hYmxlLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9hcnJheS9mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9nZXQtaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL21hcC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2Fzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2NyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2dldC1vd24tcHJvcGVydHktZGVzY3JpcHRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2tleXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9wcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9zZXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vc3ltYm9sL2l0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuYXNzZXJ0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY29mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY29sbGVjdGlvbi1zdHJvbmcuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jb2xsZWN0aW9uLXRvLWpzb24uanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jb2xsZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY3R4LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZGVmLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZG9tLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmVudW0ta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmZvci1vZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmZ3LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZ2V0LW5hbWVzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaW52b2tlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1jYWxsLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1kZWZpbmUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLWRldGVjdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLml0ZXIuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmtleW9mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQubWl4LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQucmVkZWYuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zYW1lLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc2V0LXByb3RvLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc2hhcmVkLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc3BlY2llcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnN0cmluZy1hdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnRhc2suanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC51aWQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC51bnNjb3BlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQud2tzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuaXRlci1oZWxwZXJzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYubWFwLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnN0YXRpY3MtYWNjZXB0LXByaW1pdGl2ZXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnByb21pc2UuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnNldC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zeW1ib2wuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3Lm1hcC50by1qc29uLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5zZXQudG8tanNvbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvcmVnZW5lcmF0b3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9yZWdlbmVyYXRvci9ydW50aW1lLmpzIiwibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9idWlsZC9kMy5qcyIsIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCIuLi8uLi8uLi8uLi8uLi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7NkJDbkVlLG1CQUFtQjs7Ozt5QkFDaEIsZUFBZTs7Ozs7Ozs7Ozs7O0lBVVosU0FBUztZQUFULFNBQVM7Ozs7Ozs7QUFLakIsV0FMUSxTQUFTLENBS2hCLFNBQVMsRUFBRSxPQUFPLEVBQUU7MEJBTGIsU0FBUzs7QUFNMUIsK0JBTmlCLFNBQVMsNkNBTXBCLFFBQVEsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFO0FBQzdCLFFBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0dBQzdCOzs7Ozs7O2VBUmtCLFNBQVM7O1dBY2YseUJBQUc7QUFDZCxVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFL0MsVUFBSSxDQUFDLE9BQU8sQ0FBQyxD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O0FDQUE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBOztBQ0RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBOztBQ0FBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TEE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2puQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNS9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29yZToge1xuICAgIExheWVyVGltZUNvbnRleHQgICAgIDogcmVxdWlyZSgnLi9kaXN0L2NvcmUvbGF5ZXItdGltZS1jb250ZXh0JyksXG4gICAgTGF5ZXIgICAgICAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvY29yZS9sYXllcicpLFxuICAgIG5hbWVzcGFjZSAgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L2NvcmUvbmFtZXNwYWNlJyksXG4gICAgVGltZWxpbmVUaW1lQ29udGV4dCAgOiByZXF1aXJlKCcuL2Rpc3QvY29yZS90aW1lbGluZS10aW1lLWNvbnRleHQnKSxcbiAgICBUaW1lbGluZSAgICAgICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9jb3JlL3RpbWVsaW5lJyksXG4gICAgVHJhY2tDb2xsZWN0aW9uICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvY29yZS90cmFjay1jb2xsZWN0aW9uJyksXG4gICAgVHJhY2sgICAgICAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvY29yZS90cmFjaycpLFxuICB9LFxuICBzaGFwZXM6IHtcbiAgICBBbm5vdGF0ZWRNYXJrZXIgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9zaGFwZXMvYW5ub3RhdGVkLW1hcmtlcicpLFxuICAgIEFubm90YXRlZFNlZ21lbnQgICAgIDogcmVxdWlyZSgnLi9kaXN0L3NoYXBlcy9hbm5vdGF0ZWQtc2VnbWVudCcpLFxuICAgIEJhc2VTaGFwZSAgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L3NoYXBlcy9iYXNlLXNoYXBlJyksXG4gICAgQ3Vyc29yICAgICAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3Qvc2hhcGVzL2N1cnNvcicpLFxuICAgIERvdCAgICAgICAgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L3NoYXBlcy9kb3QnKSxcbiAgICBMaW5lICAgICAgICAgICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9zaGFwZXMvbGluZScpLFxuICAgIE1hcmtlciAgICAgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L3NoYXBlcy9tYXJrZXInKSxcbiAgICBTZWdtZW50ICAgICAgICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9zaGFwZXMvc2VnbWVudCcpLFxuICAgIFRpY2tzICAgICAgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L3NoYXBlcy90aWNrcycpLFxuICAgIFRyYWNlUGF0aCAgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L3NoYXBlcy90cmFjZS1wYXRoJyksXG4gICAgVHJhY2VEb3RzICAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3Qvc2hhcGVzL3RyYWNlLWRvdHMnKSxcbiAgICBXYXZlZm9ybSAgICAgICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9zaGFwZXMvd2F2ZWZvcm0nKSxcbiAgfSxcbiAgYmVoYXZpb3JzOiB7XG4gICAgQmFzZUJlaGF2aW9yICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvYmVoYXZpb3JzL2Jhc2UtYmVoYXZpb3InKSxcbiAgICBCcmVha3BvaW50QmVoYXZpb3IgICA6IHJlcXVpcmUoJy4vZGlzdC9iZWhhdmlvcnMvYnJlYWtwb2ludC1iZWhhdmlvcicpLFxuICAgIE1hcmtlckJlaGF2aW9yICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L2JlaGF2aW9ycy9tYXJrZXItYmVoYXZpb3InKSxcbiAgICBTZWdtZW50QmVoYXZpb3IgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9iZWhhdmlvcnMvc2VnbWVudC1iZWhhdmlvcicpLFxuICAgIFRpbWVDb250ZXh0QmVoYXZpb3IgIDogcmVxdWlyZSgnLi9kaXN0L2JlaGF2aW9ycy90aW1lLWNvbnRleHQtYmVoYXZpb3InKSxcbiAgICBUcmFjZUJlaGF2aW9yICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9iZWhhdmlvcnMvdHJhY2UtYmVoYXZpb3InKSxcbiAgfSxcbiAgaW50ZXJhY3Rpb25zOiB7XG4gICAgRXZlbnRTb3VyY2UgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvaW50ZXJhY3Rpb25zL2V2ZW50LXNvdXJjZScpLFxuICAgIEtleWJvYXJkICAgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L2ludGVyYWN0aW9ucy9rZXlib2FyZCcpLFxuICAgIFN1cmZhY2UgICAgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L2ludGVyYWN0aW9ucy9zdXJmYWNlJyksXG4gICAgV2F2ZUV2ZW50ICAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvaW50ZXJhY3Rpb25zL3dhdmUtZXZlbnQnKSxcbiAgfSxcbiAgLy8gcmVuYW1lIGZvbGRlciA/XG4gIHN0YXRlczoge1xuICAgIEJhc2VTdGF0ZSAgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L3N0YXRlcy9iYXNlLXN0YXRlJyksXG4gICAgQnJ1c2hab29tU3RhdGUgICAgICAgOiByZXF1aXJlKCcuL2Rpc3Qvc3RhdGVzL2JydXNoLXpvb20tc3RhdGUnKSxcbiAgICBDZW50ZXJlZFpvb21TdGF0ZSAgICA6IHJlcXVpcmUoJy4vZGlzdC9zdGF0ZXMvY2VudGVyZWQtem9vbS1zdGF0ZScpLFxuICAgIENvbnRleHRFZGl0aW9uU3RhdGUgIDogcmVxdWlyZSgnLi9kaXN0L3N0YXRlcy9jb250ZXh0LWVkaXRpb24tc3RhdGUnKSxcbiAgICBFZGl0aW9uU3RhdGUgICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9zdGF0ZXMvZWRpdGlvbi1zdGF0ZScpLFxuICAgIFNlbGVjdGlvblN0YXRlICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L3N0YXRlcy9zZWxlY3Rpb24tc3RhdGUnKSxcbiAgICBTaW1wbGVFZGl0aW9uU3RhdGUgICA6IHJlcXVpcmUoJy4vZGlzdC9zdGF0ZXMvc2ltcGxlLWVkaXRpb24tc3RhdGUnKSxcbiAgfSxcbiAgaGVscGVyczoge1xuICAgIEFubm90YXRlZE1hcmtlckxheWVyIDogcmVxdWlyZSgnLi9kaXN0L2hlbHBlcnMvYW5ub3RhdGVkLW1hcmtlci1sYXllcicpLFxuICAgIEN1cnNvckxheWVyICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L2hlbHBlcnMvY3Vyc29yLWxheWVyJyksXG4gICAgQnJlYWtwb2ludExheWVyICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvaGVscGVycy9icmVha3BvaW50LWxheWVyJyksXG4gICAgTWFya2VyTGF5ZXIgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvaGVscGVycy9tYXJrZXItbGF5ZXInKSxcbiAgICBTZWdtZW50TGF5ZXIgICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9oZWxwZXJzL3NlZ21lbnQtbGF5ZXInKSxcbiAgICBUcmFjZUxheWVyICAgICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9oZWxwZXJzL3RyYWNlLWxheWVyJyksXG4gICAgV2F2ZWZvcm1MYXllciAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvaGVscGVycy93YXZlZm9ybS1sYXllcicpLFxuICB9LFxuICBheGlzOiB7XG4gICAgQXhpc0xheWVyICAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvYXhpcy9heGlzLWxheWVyJyksXG4gICAgdGltZUF4aXNHZW5lcmF0b3IgICAgOiByZXF1aXJlKCcuL2Rpc3QvYXhpcy90aW1lLWF4aXMtZ2VuZXJhdG9yJyksXG4gIH0sXG4gIHV0aWxzOiB7XG4gICAgZm9ybWF0ICAgICAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvdXRpbHMvZm9ybWF0JyksXG4gICAgT3J0aG9nb25hbERhdGEgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvdXRpbHMvb3J0aG9nb25hbC1kYXRhJyksXG4gICAgc2NhbGVzICAgICAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvdXRpbHMvc2NhbGVzJyksXG4gIH1cbn1cbiIsImltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5pbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5cblxuLyoqXG4gKiAgU2ltcGxpZmllZCBMYXllciBmb3IgQXhpc1xuICpcbiAqICBUaGlzIGxheWVyIHNob3VsZCBzdGF5IGludG8gdGhlIHRpbWVsaW5lJ3MgdmlzaWJsZUFyZWEgKG5vIG9mZnNldClcbiAqICBJdCBhbHNvIGhhbmRsZSBpdCdzIG93biBkYXRhIGFuZCBpdHMgdXBkYXRlc1xuICogIGBfZ2VuZXJhdGVEYXRhYCBpcyByZXNwb25zaWJsZSB0byBjcmVhdGUgc29tZSB1c2VmdWxsIGRhdGEgdG8gdmlzdWFsaXplXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF4aXNMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqICBAcGFyYW0ge0Z1bmN0aW9ufSBnZW5lcmF0b3IgLSBhIGZ1bmN0aW9uIHRvIGNyZWF0ZSBkYXRhIGFjY29yZGluZyB0aGUgYSB0aW1lQ29udGV4dFxuICAgKiAgQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBsYXllciBvcHRpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvcihnZW5lcmF0b3IsIG9wdGlvbnMpIHtcbiAgICBzdXBlcignZW50aXR5JywgW10sIG9wdGlvbnMpO1xuICAgIHRoaXMuX2dlbmVyYXRvciA9IGdlbmVyYXRvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiAgVGhpcyBtZXRob2QgaXMgdGhlIG1haW4gZGlmZmVyZW5jZSB3aXRoIGEgY2xhc3NpY2FsIGxheWVyXG4gICAqICBUaGlzIG9uZSBnZW5lcmF0ZXMgYW5kIG1haW50YWlucyBpdCdzIG93biBkYXRhXG4gICAqL1xuICBfZ2VuZXJhdGVEYXRhKCkge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLl9nZW5lcmF0b3IodGhpcy50aW1lQ29udGV4dCk7XG4gICAgLy8gcHJlcGVuZCBmaXJzdCBhcmd1bWVudHMgb2Ygc3BsaWNlIGZvciBhbiBhcHBseVxuICAgIGRhdGEudW5zaGlmdCgwLCB0aGlzLmRhdGFbMF0ubGVuZ3RoKTtcbiAgICAvLyBtYWtlIHN1cmUgdG8ga2VlcCB0aGUgc2FtZSByZWZlcmVuY2VcbiAgICBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KHRoaXMuZGF0YVswXSwgZGF0YSk7XG4gIH1cblxuICAvLyBjYW4ndCBhY2Nlc3MgdGltZUNvbnRleHQgZnJvbSBvdXRzaWRlXG4gIHNldCBzdHJldGNoUmF0aW8odmFsdWUpIHsgcmV0dXJuOyB9XG4gIHNldCBvZmZzZXQodmFsdWUpIHsgY29uc29sZS5sb2codmFsdWUpOyByZXR1cm47IH1cbiAgc2V0IHN0YXJ0KHZhbHVlKSB7IHJldHVybjsgfVxuICBzZXQgZHVyYXRpb24odmFsdWUpIHsgcmV0dXJuOyB9XG4gIGdldCBzdHJldGNoUmF0aW8oKSB7IHJldHVybjsgfVxuICBnZXQgb2Zmc2V0KCkgeyByZXR1cm47IH1cbiAgZ2V0IHN0YXJ0KCkgeyByZXR1cm47IH1cbiAgZ2V0IGR1cmF0aW9uKCkgeyByZXR1cm47IH1cblxuICByZW5kZXIoKSB7XG4gICAgc3VwZXIucmVuZGVyKCk7XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5fZ2VuZXJhdGVEYXRhKCk7XG4gICAgc3VwZXIudXBkYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogIHJlbmRlciB0aGUgRE9NIGluIG1lbW9yeSBvbiBsYXllciBjcmVhdGlvbiB0byBiZSBhYmxlIHRvIHVzZSBpdCBiZWZvcmVcbiAgICogIHRoZSBsYXllciBpcyBhY3R1YWxseSBpbnNlcnRlZCBpbiB0aGUgRE9NXG4gICAqL1xuICBfcmVuZGVyQ29udGFpbmVyKCkge1xuICAgIC8vIHdyYXBwZXIgZ3JvdXAgZm9yIGBzdGFydCwgdG9wIGFuZCBjb250ZXh0IGZsaXAgbWF0cml4XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgaWYgKHRoaXMucGFyYW1zLmNsYXNzTmFtZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZCgnbGF5ZXInLCB0aGlzLnBhcmFtcy5jbGFzc05hbWUpO1xuICAgIH1cblxuICAgIC8vIGdyb3VwIHRvIGFwcGx5IG9mZnNldFxuICAgIHRoaXMuJG9mZnNldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLiRvZmZzZXQuY2xhc3NMaXN0LmFkZCgnb2Zmc2V0JywgJ2l0ZW1zJyk7XG4gICAgLy8gbGF5ZXIgYmFja2dyb3VuZFxuICAgIHRoaXMuJGJhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsICcxMDAlJyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdiYWNrZ3JvdW5kJyk7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zdHlsZS5maWxsT3BhY2l0eSA9IDA7XG4gICAgdGhpcy4kYmFja2dyb3VuZC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuICAgIC8vIGNyZWF0ZSB0aGUgRE9NIHRyZWVcbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRvZmZzZXQpO1xuICAgIHRoaXMuJG9mZnNldC5hcHBlbmRDaGlsZCh0aGlzLiRiYWNrZ3JvdW5kKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlcyB0aGUgY29udGV4dCBvZiB0aGUgbGF5ZXJcbiAgICovXG4gIHVwZGF0ZUNvbnRhaW5lcigpIHtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCk7XG5cbiAgICBjb25zdCB0b3AgICAgPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIC8vIG1hdHJpeCB0byBpbnZlcnQgdGhlIGNvb3JkaW5hdGUgc3lzdGVtXG4gICAgY29uc3QgdHJhbnNsYXRlTWF0cml4ID0gYG1hdHJpeCgxLCAwLCAwLCAtMSwgMCwgJHt0b3AgKyBoZWlnaHR9KWA7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHRyYW5zbGF0ZU1hdHJpeCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IHBhZExlZnQgfSBmcm9tICcuLi91dGlscy9mb3JtYXQnO1xuLyoqXG4gKiBtYXliZSBjcmVhdGUgYSBmYWN0b3J5IHRvIGdpdmUgc29tZSBwYXJhbWV0ZXJzXG4gKiBjcmVhdGUgdGltZSBzZXJpZSBkYXRhLCB0byB2aXN1YWxpemUgYSB0aW1lIHNjYWxlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRpbWVHZW5lcmF0b3IodGltZUNvbnRleHQpIHtcbiAgY29uc3QgZHVyYXRpb24gPSB0aW1lQ29udGV4dC52aXNpYmxlRHVyYXRpb247XG4gIGNvbnN0IG9mZnNldCA9IHRpbWVDb250ZXh0Lm9mZnNldDtcbiAgY29uc3QgZGF0YSA9IFtdO1xuXG4gIC8vIGNvbnN0IG1pbiA9IE1hdGgubWluKC1vZmZzZXQsIDApO1xuICBjb25zdCBtaW4gPSAtIG9mZnNldDtcbiAgLy8gcmVtb3ZlIHRoZSB0aW1lbGluZSdzIG9mZnNldCB0byBrZWVwIHRoZSBsYXllciBjZW50ZXJlZFxuICBjb25zdCBtYXggPSBkdXJhdGlvbiAtIG9mZnNldDtcblxuICAvLyBkZWZpbmUgcGl4ZWxzIGZvciAxIHNlY29uZFxuICBjb25zdCBwcyA9IHRpbWVDb250ZXh0LmNvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuICBjb25zdCBtaW5TdGVwID0gNztcblxuICAvLyBkZWZpbmUgYWxsIGRpc3BsYXkgaW5mb3JtYXRpb24gYWNjb3JkaW5nIHRvIHRoZSBwaXhlbHNQZXJTZWNvbmQgcmF0aW9cbiAgbGV0IHN0ZXAsIHR5cGUsIHRvRml4ZWQsIG1hcmtlck1vZHVsbywgaW5jbHVkZU1vZHVsbztcblxuICBpZiAocHMgKiA0ID4gbWluU3RlcCkge1xuICAgIHN0ZXAgPSAxOyAvLyB0aGUgc3RlcCB0byB1c2UgdG8gY29tcHV0ZSB0aW1lXG4gICAgdG9GaXhlZCA9IDA7XG4gICAgbWFya2VyTW9kdWxvID0gNjA7IC8vIGEgdGltZXN0YW1wIGV2ZXJ5IDUgc3RlcHNcbiAgICBpbmNsdWRlTW9kdWxvID0gNTsgLy8gYSB0aWNrIGV2ZXJ5IDUgc3RlcHNcbiAgICB0eXBlID0gJzYwc2VjJztcbiAgfVxuXG4gIGlmIChwcyAqIDIgPiBtaW5TdGVwKSB7XG4gICAgc3RlcCA9IDE7XG4gICAgdG9GaXhlZCA9IDA7XG4gICAgbWFya2VyTW9kdWxvID0gMzA7XG4gICAgaW5jbHVkZU1vZHVsbyA9IDI7XG4gICAgdHlwZSA9ICczMHNlYyc7XG4gIH1cblxuICBpZiAocHMgPiBtaW5TdGVwKSB7XG4gICAgc3RlcCA9IDE7XG4gICAgdG9GaXhlZCA9IDA7XG4gICAgbWFya2VyTW9kdWxvID0gMTA7XG4gICAgaW5jbHVkZU1vZHVsbyA9IDE7XG4gICAgdHlwZSA9ICdzZWMnO1xuICB9XG5cbiAgaWYgKHBzIC8gMTAgPiBtaW5TdGVwKSB7XG4gICAgc3RlcCA9IDEgLyAxMDtcbiAgICB0b0ZpeGVkID0gMTtcbiAgICBtYXJrZXJNb2R1bG8gPSAxMDtcbiAgICBpbmNsdWRlTW9kdWxvID0gMTtcbiAgICB0eXBlID0gJ2RzJztcbiAgfVxuXG4gIGlmIChwcyAvIDEwMCA+IG1pblN0ZXApIHtcbiAgICBzdGVwID0gMSAvIDEwMDtcbiAgICB0b0ZpeGVkID0gMjtcbiAgICBtYXJrZXJNb2R1bG8gPSAxMDtcbiAgICBpbmNsdWRlTW9kdWxvID0gMTtcbiAgICB0eXBlID0gJ2NzJztcbiAgfVxuXG4gIGlmIChwcyAvIDEwMDAgPiBtaW5TdGVwKSB7XG4gICAgc3RlcCA9IDEgLyAxMDAwO1xuICAgIHRvRml4ZWQgPSAzO1xuICAgIG1hcmtlck1vZHVsbyA9IDEwO1xuICAgIGluY2x1ZGVNb2R1bG8gPSAxO1xuICAgIHR5cGUgPSAnbXMnO1xuICB9XG5cbiAgZm9yIChsZXQgdGltZSA9IG1pbjsgdGltZSA8IG1heDsgdGltZSArPSBzdGVwKSB7XG4gICAgY29uc3QgZm9ybWF0dGVkVGltZSA9IHRpbWUudG9GaXhlZCh0b0ZpeGVkKTtcblxuICAgIGlmIChNYXRoLnJvdW5kKGZvcm1hdHRlZFRpbWUgLyBzdGVwKSAlIGluY2x1ZGVNb2R1bG8gIT09IDApIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGF2b2lkIGZsb2F0aW5nIHBvaW50IGVycm9yc1xuICAgIGNvbnN0IGZvY3VzZWQgPSBNYXRoLnJvdW5kKGZvcm1hdHRlZFRpbWUgLyBzdGVwKSAlIG1hcmtlck1vZHVsbyA9PT0gMCA/IHRydWUgOiBmYWxzZTtcblxuICAgIGNvbnN0IGRhdHVtID0geyB4OiBmb3JtYXR0ZWRUaW1lLCBmb2N1c2VkIH07XG5cbiAgICBpZiAoZm9jdXNlZCA9PT0gdHJ1ZSkge1xuICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKDEwMDAgKiBmb3JtYXR0ZWRUaW1lKTtcbiAgICAgIGNvbnN0IG1pbiA9IHBhZExlZnQoZGF0ZS5nZXRNaW51dGVzKCksIDAsIDIpO1xuICAgICAgY29uc3Qgc2VjID0gcGFkTGVmdChkYXRlLmdldFNlY29uZHMoKSwgMCwgMik7XG4gICAgICBjb25zdCBtaWxsaSA9IHBhZExlZnQoZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSwgMCwgMyk7XG4gICAgICBjb25zdCBsYWJlbCA9IGAke21pbn06JHtzZWN9OiR7bWlsbGl9YDtcblxuICAgICAgZGF0dW0ubGFiZWwgPSBsYWJlbDtcbiAgICB9XG5cbiAgICBkYXRhLnB1c2goZGF0dW0pO1xuICB9XG5cbiAgcmV0dXJuIGRhdGE7XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUJlaGF2aW9yIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5fc2VsZWN0ZWRJdGVtcyA9IG5ldyBTZXQoKTsgLy8gbm8gZHVwbGljYXRlIGluIFNldFxuICAgIHRoaXMuX3NlbGVjdGVkQ2xhc3MgPSBvcHRpb25zLnNlbGVjdGVkQ2xhc3MgfHzCoCdzZWxlY3RlZCc7XG4gICAgdGhpcy5fbGF5ZXIgPSBudWxsO1xuXG4gICAgdGhpcy5fcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nZXREZWZhdWx0cygpLCBvcHRpb25zKTtcbiAgfVxuXG4gIGluaXRpYWxpemUobGF5ZXIpIHtcbiAgICB0aGlzLl9sYXllciA9IGxheWVyO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICAvLyBjbGVhbiBhbGwgaXRlbXMgaW4gYHRoaXMuX3NlbGVjdGVkSXRlbXNgXG4gIH1cblxuICBnZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBzZXQgc2VsZWN0ZWRDbGFzcyh2YWx1ZSkge1xuICAgIHRoaXMuX3NlbGVjdGVkQ2xhc3MgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBzZWxlY3RlZENsYXNzKCkge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZENsYXNzO1xuICB9XG5cbiAgZ2V0IHNlbGVjdGVkSXRlbXMoKSB7XG4gICAgcmV0dXJuIFsuLi50aGlzLl9zZWxlY3RlZEl0ZW1zXTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgQHBhcmFtIGl0ZW0ge0RPTUVsZW1lbnR9IHRoZSBpdGVtIHRvIHNlbGVjdFxuICAgKiAgQHBhcmFtIGRhdHVtIHtPYmplY3R9IHRoZSByZWxhdGVkIGRhdHVtIChATk9URSByZW1vdmUgaXQgPylcbiAgICovXG4gIHNlbGVjdCgkaXRlbSwgZGF0dW0pIHtcbiAgICAkaXRlbS5jbGFzc0xpc3QuYWRkKHRoaXMuc2VsZWN0ZWRDbGFzcyk7XG4gICAgdGhpcy5fc2VsZWN0ZWRJdGVtcy5hZGQoJGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBAcGFyYW0gaXRlbSB7RE9NRWxlbWVudH0gdGhlIGl0ZW0gdG8gc2VsZWN0XG4gICAqICBAcGFyYW0gZGF0dW0ge09iamVjdH0gdGhlIHJlbGF0ZWQgZGF0dW0gKEBOT1RFIHJlbW92ZSBpdCA/KVxuICAgKi9cbiAgdW5zZWxlY3QoJGl0ZW0sIGRhdHVtKSB7XG4gICAgJGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLnNlbGVjdGVkQ2xhc3MpO1xuICAgIHRoaXMuX3NlbGVjdGVkSXRlbXMuZGVsZXRlKCRpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgQE5PVEUgaXMgdGhpcyByZWFsbHkgdXNlZnVsbCA/XG4gICAqICBAcGFyYW0gaXRlbSB7RE9NRWxlbWVudH0gdGhlIGl0ZW0gdG8gc2VsZWN0XG4gICAqICBAcGFyYW0gZGF0dW0ge09iamVjdH0gdGhlIHJlbGF0ZWQgZGF0dW0gKEBOT1RFIHJlbW92ZSBpdCA/KVxuICAgKi9cbiAgdG9nZ2xlU2VsZWN0aW9uKCRpdGVtLCBkYXR1bSkge1xuICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMuX3NlbGVjdGVkSXRlbXMuaGFzKCRpdGVtKSA/ICd1bnNlbGVjdCcgOiAnc2VsZWN0JztcbiAgICB0aGlzW21ldGhvZF0oJGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBFZGl0aW9uIGJlaGF2aW9yXG4gICAqL1xuICBlZGl0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICAvLyBtdXN0IGJlIGltcGxlbWVudGVkIGluIGNoaWxkcmVuXG4gIH1cbn1cbiIsImltcG9ydCBCYXNlQmVoYXZpb3IgZnJvbSAnLi9iYXNlLWJlaGF2aW9yJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcmVha3BvaW50QmVoYXZpb3IgZXh0ZW5kcyBCYXNlQmVoYXZpb3Ige1xuXG4gIGVkaXQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IGRhdGEgID0gdGhpcy5fbGF5ZXIuZGF0YTtcbiAgICBjb25zdCBsYXllckhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuICAgIC8vIGN1cnJlbnQgcG9zaXRpb25cbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS5jeChkYXR1bSkpO1xuICAgIGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChzaGFwZS5jeShkYXR1bSkpO1xuICAgIC8vIHRhcmdldCBwb3NpdGlvblxuICAgIGxldCB0YXJnZXRYID0geCArIGR4O1xuICAgIGxldCB0YXJnZXRZID0geSAtIGR5O1xuXG4gICAgaWYgKGRhdGEubGVuZ3RoID4gMikge1xuICAgICAgLy8gY3JlYXRlIGEgc29ydGVkIG1hcCBvZiBhbGwgYHhgIHBvc2l0aW9uc1xuICAgICAgY29uc3QgeE1hcCA9IGRhdGEubWFwKChkKSA9PiByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLmN4KGQpKSk7XG4gICAgICB4TWFwLnNvcnQoKGEsIGIpID0+IGEgPCBiID8gLTEgOiAxKTtcbiAgICAgIC8vIGZpbmQgaW5kZXggb2Ygb3VyIHNoYXBlIHggcG9zaXRpb25cbiAgICAgIGNvbnN0IGluZGV4ID0geE1hcC5pbmRleE9mKHgpO1xuICAgICAgLy8gbG9jayB0byBuZXh0IHNpYmxpbmdzXG4gICAgICBpZiAodGFyZ2V0WCA8IHhNYXBbaW5kZXggLSAxXSB8fMKgdGFyZ2V0WCA+IHhNYXBbaW5kZXggKyAxXSkge1xuICAgICAgICB0YXJnZXRYID0geDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBsb2NrIGluIHkgYXhpc1xuICAgIGlmICh0YXJnZXRZIDwgMCkge1xuICAgICAgdGFyZ2V0WSA9IDA7XG4gICAgfSBlbHNlIGlmICh0YXJnZXRZID4gbGF5ZXJIZWlnaHQpIHtcbiAgICAgIHRhcmdldFkgPSBsYXllckhlaWdodDtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgZGF0dW0gd2l0aCBuZXcgdmFsdWVzXG4gICAgc2hhcGUuY3goZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpKTtcbiAgICBzaGFwZS5jeShkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFkpKTtcbiAgfVxuXG59XG4iLCJpbXBvcnQgQmFzZUJlaGF2aW9yIGZyb20gJy4vYmFzZS1iZWhhdmlvcic7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFya2VyQmVoYXZpb3IgZXh0ZW5kcyBCYXNlQmVoYXZpb3Ige1xuXG4gIGVkaXQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLngoZGF0dW0pKTtcbiAgICBsZXQgdGFyZ2V0WCA9ICh4ICsgZHgpID4gMCA/IHggKyBkeCA6IDA7XG5cbiAgICBzaGFwZS54KGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRYKSk7XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlQmVoYXZpb3IgZnJvbSAnLi9iYXNlLWJlaGF2aW9yJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWdtZW50QmVoYXZpb3IgZXh0ZW5kcyBCYXNlQmVoYXZpb3Ige1xuICBlZGl0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCBjbGFzc0xpc3QgPSB0YXJnZXQuY2xhc3NMaXN0O1xuICAgIGxldCBhY3Rpb24gPSAnbW92ZSc7XG5cbiAgICBpZiAoY2xhc3NMaXN0LmNvbnRhaW5zKCdoYW5kbGVyJykgJiYgY2xhc3NMaXN0LmNvbnRhaW5zKCdsZWZ0JykpIHtcbiAgICAgIGFjdGlvbiA9ICdyZXNpemVMZWZ0JztcbiAgICB9IGVsc2UgaWYgKGNsYXNzTGlzdC5jb250YWlucygnaGFuZGxlcicpICYmIGNsYXNzTGlzdC5jb250YWlucygncmlnaHQnKSkge1xuICAgICAgYWN0aW9uID0gJ3Jlc2l6ZVJpZ2h0JztcbiAgICB9XG5cbiAgICB0aGlzW2BfJHthY3Rpb259YF0ocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCk7XG4gIH1cblxuICBfbW92ZShyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgY29uc3QgbGF5ZXJIZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcbiAgICAvLyBjdXJyZW50IHZhbHVlc1xuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLngoZGF0dW0pKTtcbiAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoc2hhcGUueShkYXR1bSkpO1xuICAgIGNvbnN0IGhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHNoYXBlLmhlaWdodChkYXR1bSkpO1xuICAgIC8vIHRhcmdldCB2YWx1ZXNcbiAgICBsZXQgdGFyZ2V0WCA9IE1hdGgubWF4KHggKyBkeCwgMCk7XG4gICAgbGV0IHRhcmdldFkgPSB5IC0gZHk7XG5cbiAgICAvLyBsb2NrIGluIGxheWVyJ3MgeSBheGlzXG4gICAgaWYgKHRhcmdldFkgPCAwKSB7XG4gICAgICB0YXJnZXRZID0gMDtcbiAgICB9IGVsc2UgaWYgKHRhcmdldFkgKyBoZWlnaHQgPiBsYXllckhlaWdodCkge1xuICAgICAgdGFyZ2V0WSA9IGxheWVySGVpZ2h0IC0gaGVpZ2h0O1xuICAgIH1cblxuICAgIHNoYXBlLngoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpKTtcbiAgICBzaGFwZS55KGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbC5pbnZlcnQodGFyZ2V0WSkpO1xuICB9XG5cbiAgX3Jlc2l6ZUxlZnQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIC8vIGN1cnJlbnQgdmFsdWVzXG4gICAgY29uc3QgeCAgICAgPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLngoZGF0dW0pKTtcbiAgICBjb25zdCB3aWR0aCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2hhcGUud2lkdGgoZGF0dW0pKTtcbiAgICAvLyB0YXJnZXQgdmFsdWVzXG4gICAgbGV0IG1heFRhcmdldFggID0geCArIHdpZHRoO1xuICAgIGxldCB0YXJnZXRYICAgICA9IHggKyBkeCA8IG1heFRhcmdldFggPyBNYXRoLm1heCh4ICsgZHgsIDApIDogeDtcbiAgICBsZXQgdGFyZ2V0V2lkdGggPSB0YXJnZXRYICE9PSAwID8gTWF0aC5tYXgod2lkdGggLSBkeCwgMSkgOiB3aWR0aDtcblxuICAgIHNoYXBlLngoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpKTtcbiAgICBzaGFwZS53aWR0aChkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0V2lkdGgpKTtcbiAgfVxuXG4gIF9yZXNpemVSaWdodChyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgLy8gY3VycmVudCB2YWx1ZXNcbiAgICBjb25zdCB3aWR0aCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2hhcGUud2lkdGgoZGF0dW0pKTtcbiAgICAvLyB0YXJnZXQgdmFsdWVzXG4gICAgbGV0IHRhcmdldFdpZHRoID0gTWF0aC5tYXgod2lkdGggKyBkeCwgMSk7XG5cbiAgICBzaGFwZS53aWR0aChkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0V2lkdGgpKTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZUNvbnRleHRCZWhhdmlvciB7XG4gIGVkaXQobGF5ZXIsIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgY29uc3QgdGltZUNvbnRleHQgPSBsYXllci50aW1lQ29udGV4dDtcblxuICAgIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoYW5kbGVyJykgJiYgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbGVmdCcpKSB7XG4gICAgICB0aGlzLl9lZGl0TGVmdCh0aW1lQ29udGV4dCwgZHgpO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnaGFuZGxlcicpICYmIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3JpZ2h0JykpIHtcbiAgICAgIHRoaXMuX2VkaXRSaWdodCh0aW1lQ29udGV4dCwgZHgpO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnc2VnbWVudCcpKSB7XG4gICAgICB0aGlzLl9tb3ZlKHRpbWVDb250ZXh0LCBkeCk7XG4gICAgfVxuICB9XG5cbiAgX2VkaXRMZWZ0KHRpbWVDb250ZXh0LCBkeCkge1xuICAgIC8vIGVkaXQgYHN0YXJ0YCwgYG9mZnNldGAgYW5kIGBkdXJhdGlvbmBcbiAgICBjb25zdCB4ID0gdGltZUNvbnRleHQucGFyZW50LnRpbWVUb1BpeGVsKHRpbWVDb250ZXh0LnN0YXJ0KTtcbiAgICBjb25zdCBvZmZzZXQgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aW1lQ29udGV4dC5vZmZzZXQpO1xuICAgIGNvbnN0IHdpZHRoID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwodGltZUNvbnRleHQuZHVyYXRpb24pO1xuXG4gICAgY29uc3QgdGFyZ2V0WCA9IHggKyBkeDtcbiAgICBjb25zdCB0YXJnZXRPZmZzZXQgPSBvZmZzZXQgLSBkeDtcbiAgICBjb25zdCB0YXJnZXRXaWR0aCA9IE1hdGgubWF4KHdpZHRoIC0gZHgsIDEpO1xuXG4gICAgdGltZUNvbnRleHQuc3RhcnQgPSB0aW1lQ29udGV4dC5wYXJlbnQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpO1xuICAgIHRpbWVDb250ZXh0Lm9mZnNldCA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRPZmZzZXQpO1xuICAgIHRpbWVDb250ZXh0LmR1cmF0aW9uID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFdpZHRoKTtcbiAgfVxuXG4gIF9lZGl0UmlnaHQodGltZUNvbnRleHQsIGR4KSB7XG4gICAgY29uc3Qgd2lkdGggPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aW1lQ29udGV4dC5kdXJhdGlvbik7XG4gICAgY29uc3QgdGFyZ2V0V2lkdGggPSBNYXRoLm1heCh3aWR0aCArIGR4LCAxKTtcblxuICAgIHRpbWVDb250ZXh0LmR1cmF0aW9uID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFdpZHRoKTtcbiAgfVxuXG4gIF9tb3ZlKHRpbWVDb250ZXh0LCBkeCkge1xuICAgIGNvbnN0IHggPSB0aW1lQ29udGV4dC5wYXJlbnQudGltZVRvUGl4ZWwodGltZUNvbnRleHQuc3RhcnQpO1xuICAgIGNvbnN0IHRhcmdldFggPSBNYXRoLm1heCh4ICsgZHgsIDApO1xuXG4gICAgdGltZUNvbnRleHQuc3RhcnQgPSB0aW1lQ29udGV4dC5wYXJlbnQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpO1xuICB9XG5cbiAgc3RyZXRjaChsYXllciwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IGxheWVyLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IGxhc3REdXJhdGlvbiA9IHRpbWVDb250ZXh0LmR1cmF0aW9uO1xuICAgIGNvbnN0IGxhc3RPZmZzZXQgPSB0aW1lQ29udGV4dC5vZmZzZXQ7XG5cbiAgICB0aGlzLmVkaXQobGF5ZXIsIGR4LCBkeSwgdGFyZ2V0KTtcblxuICAgIGNvbnN0IG5ld0R1cmF0aW9uID0gdGltZUNvbnRleHQuZHVyYXRpb247XG4gICAgY29uc3QgcmF0aW8gPSAobmV3RHVyYXRpb24gLyBsYXN0RHVyYXRpb24pO1xuXG4gICAgdGltZUNvbnRleHQuc3RyZXRjaFJhdGlvICo9IHJhdGlvO1xuICAgIHRpbWVDb250ZXh0Lm9mZnNldCA9IGxhc3RPZmZzZXQ7XG4gICAgdGltZUNvbnRleHQuZHVyYXRpb24gPSBsYXN0RHVyYXRpb247XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlQmVoYXZpb3IgZnJvbSAnLi9iYXNlLWJlaGF2aW9yJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFjZUJlaGF2aW9yIGV4dGVuZHMgQmFzZUJlaGF2aW9yIHtcbiAgZWRpdChyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21pbicpKSB7XG4gICAgICB0aGlzLl9lZGl0UmFuZ2UocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksICdtaW4nKTtcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21heCcpKSB7XG4gICAgICB0aGlzLl9lZGl0UmFuZ2UocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksICdtYXgnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZWRpdE1lYW4ocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHkpO1xuICAgIH1cbiAgfVxuXG4gIF9lZGl0TWVhbihyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSkge1xuICAgIC8vIHdvcmsgaW4gcGl4ZWwgZG9tYWluXG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2hhcGUueChkYXR1bSkpO1xuICAgIGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChzaGFwZS5tZWFuKGRhdHVtKSk7XG5cbiAgICBsZXQgdGFyZ2V0WCA9IHggKyBkeDtcbiAgICBsZXQgdGFyZ2V0WSA9IHkgLSBkeTtcblxuICAgIHNoYXBlLngoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpKTtcbiAgICBzaGFwZS5tZWFuKGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbC5pbnZlcnQodGFyZ2V0WSkpO1xuICB9XG5cbiAgX2VkaXRSYW5nZShyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgcmFuZ2VTaWRlKSB7XG4gICAgY29uc3QgcmFuZ2UgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChzaGFwZS5yYW5nZShkYXR1bSkpO1xuXG4gICAgbGV0IHRhcmdldFJhbmdlID0gcmFuZ2VTaWRlID09PSAnbWluJyA/IHJhbmdlICsgMiAqIGR5IDogcmFuZ2UgLSAyICogZHk7XG4gICAgdGFyZ2V0UmFuZ2UgPSBNYXRoLm1heCh0YXJnZXRSYW5nZSwgMCk7XG5cbiAgICBzaGFwZS5yYW5nZShkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFJhbmdlKSk7XG4gIH1cbn1cbiIsImltcG9ydCBzY2FsZXMgZnJvbSAnLi4vdXRpbHMvc2NhbGVzJztcblxuXG4vKipcbiAqICBAY2xhc3MgTGF5ZXJUaW1lQ29udGV4dFxuICpcbiAqICBBIGBMYXllclRpbWVDb250ZXh0YCBpbnN0YW5jZSByZXByZXNlbnQgYSB0aW1lIHNlZ21lbnQgaW50byBhIGBUaW1lbGluZVRpbWVDb250ZXh0YC4gSXQgbXVzdCBiZSBhdHRhY2hlZCB0byBhIGBUaW1lbGluZVRpbWVDb250ZXh0YCAodGhlIG9uZSBvZiB0aGUgdGltZWxpbmUgaXQgYmVsb25ncyB0bykuIEl0IHJlbGllcyBvbiBpdHMgcGFyZW50J3MgYHRpbWVUb1BpeGVsYCAodGltZSB0byBwaXhlbCB0cmFuc2ZlcnQgZnVuY3Rpb24pIHRvIGNyZWF0ZSB0aGUgdGltZSB0byBwaXhlbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgTGF5ZXIgKHRoZSB2aWV3KSBpdCBpcyBhdHRhY2hlZCB0by5cbiAqXG4gKiAgVGhlIGBsYXllclRpbWVDb250ZXh0YCBoYXMgZm91ciBpbXBvcnRhbnQgYXR0cmlidXRlc1xuICogIC0gYHRpbWVDb250ZXh0LnN0YXJ0YCByZXByZXNlbnQgdGhlIHRpbWUgYXQgd2hpY2ggdGVtcG9yYWwgZGF0YSBtdXN0IGJlIHJlcHJlc2VudGVkIGluIHRoZSB0aW1lbGluZSAoZm9yIGluc3RhbmNlIHRoZSBiZWdpbmluZyBvZiBhIHNvdW5kZmlsZSBpbiBhIERBVylcbiAqICAtIGB0aW1lQ29udGV4dC5vZmZzZXRgIHJlcHJlc2VudHMgb2Zmc2V0IHRpbWUgb2YgdGhlIGRhdGEgaW4gdGhlIGNvbnRleHQgb2YgYSBMYXllci4gKEBUT0RPIGdpdmUgYSB1c2UgY2FzZSBleGFtcGxlIGhlcmUgXCJjcm9wID9cIiwgYW5kL29yIGV4cGxhaW4gdGhhdCBpdCdzIG5vdCBhIGNvbW1vbiB1c2UgY2FzZSlcbiAqICAtIGB0aW1lQ29udGV4dC5kdXJhdGlvbmAgaXMgdGhlIGR1cmF0aW9uIG9mIHRoZSB2aWV3IG9uIHRoZSBkYXRhXG4gKiAgLSBgdGltZUNvbnRleHQuc3RyZXRjaFJhdGlvYCBpcyB0aGUgc3RyZXRjaCBhcHBseWVkIHRvIHRoZSB0ZW1wb3JhbCBkYXRhIGNvbnRhaW5lZCBpbiB0aGUgdmlldyAodGhpcyB2YWx1ZSBjYW4gYmUgc2VlbiBhcyBhIGxvY2FsIHpvb20gb24gdGhlIGRhdGEsIG9yIGFzIGEgc3RyZXRjaCBvbiB0aGUgdGltZSBjb21wb25lbnRzIG9mIHRoZSBkYXRhKS4gV2hlbiBhcHBseWVkLCB0aGUgc3RyZXRjaCByYXRpbyBtYWludGFpbiB0aGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHZpZXcgaW4gdGhlIHRpbWVsaW5lLlxuICpcbiAqXG4gKiArIHRpbWVsaW5lIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiAwICAgICAgICAgNSAgICAgICAgIDEwICAgICAgICAgIDE1ICAgICAgICAgIDIwICAgICAgICAyNSAgICAgICAgICAzMCBzZWNvbmRzXG4gKiArLS0tKyoqKioqKioqKioqKioqKioqKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSsqKioqKioqKy0tXG4gKiAgICAgfCoqKiBzb3VuZGZpbGUgKioqfExheWVyICh2aWV3IG9uIHRoZSBzb3VuZCBmaWxlKSAgICAgICAgICAgIHwqKioqKioqfFxuICogICAgICsqKioqKioqKioqKioqKioqKistLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rKioqKioqKitcbiAqXG4gKiAgICAgPC0tLS0gb2Zmc2V0IC0tLS0+PC0tLS0tLS0tLS0tLS0tLSBkdXJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLT5cbiAqIDwtLS0tLS0tLSBzdGFydCAtLS0tLT5cbiAqXG4gKiAgICAgIFRoZSBwYXJ0cyBvZiB0aGUgc291bmQgZmlsZSByZXByZXNlbnRlZCB3aXRoICcqJyBhcmUgaGlkZGVuIGZyb20gdGhlIHZpZXdcbiAqXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExheWVyVGltZUNvbnRleHQge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQpIHtcbiAgICBpZiAoIXBhcmVudCkgeyB0aHJvdyBuZXcgRXJyb3IoJ0xheWVyVGltZUNvbnRleHQgbXVzdCBoYXZlIGEgcGFyZW50Jyk7IH1cblxuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuXG4gICAgdGhpcy5fdGltZVRvUGl4ZWwgPSBudWxsO1xuXG4gICAgdGhpcy5fc3RhcnQgPSAwO1xuICAgIHRoaXMuX2R1cmF0aW9uID0gcGFyZW50LnZpc2libGVEdXJhdGlvbjtcbiAgICB0aGlzLl9vZmZzZXQgPSAwO1xuICAgIHRoaXMuX3N0cmV0Y2hSYXRpbyA9IDE7XG4gICAgLy8gcmVnaXN0ZXIgaW50byB0aGUgdGltZWxpbmUncyBUaW1lQ29udGV4dFxuICAgIHRoaXMucGFyZW50Ll9jaGlsZHJlbi5wdXNoKHRoaXMpO1xuICB9XG5cbiAgY2xvbmUoKSB7XG4gICAgY29uc3QgY3R4ID0gbmV3IHRoaXMoKTtcblxuICAgIGN0eC5wYXJlbnQgPSB0aGlzLnBhcmVudDtcbiAgICBjdHguc3RhcnQgPSB0aGlzLnN0YXJ0O1xuICAgIGN0eC5kdXJhdGlvbiA9IHRoaXMuZHVyYXRpb247XG4gICAgY3R4Lm9mZnNldCA9IHRoaXMub2Zmc2V0O1xuICAgIGN0eC5zdHJldGNoUmF0aW8gPSB0aGlzLnN0cmV0Y2hSYXRpbzsgLy8gY3JlYXRlcyB0aGUgbG9jYWwgc2NhbGUgaWYgbmVlZGVkXG5cbiAgICByZXR1cm4gY3R4O1xuICB9XG5cbiAgZ2V0IHN0YXJ0KCkge1xuICAgIHJldHVybiB0aGlzLl9zdGFydDtcbiAgfVxuXG4gIHNldCBzdGFydCh2YWx1ZSkge1xuICAgIHRoaXMuX3N0YXJ0ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2R1cmF0aW9uO1xuICB9XG5cbiAgc2V0IGR1cmF0aW9uKHZhbHVlKSB7XG4gICAgdGhpcy5fZHVyYXRpb24gPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29mZnNldDtcbiAgfVxuXG4gIHNldCBvZmZzZXQodmFsdWUpIHtcbiAgICB0aGlzLl9vZmZzZXQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBzdHJldGNoUmF0aW8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0cmV0Y2hSYXRpbztcbiAgfVxuXG4gIHNldCBzdHJldGNoUmF0aW8odmFsdWUpIHtcbiAgICAvLyByZW1vdmUgbG9jYWwgc2NhbGUgaWYgcmF0aW8gPSAxXG4gICAgaWYgKHZhbHVlID09PSAgMSkge1xuICAgICAgdGhpcy5fdGltZVRvUGl4ZWwgPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyByZXVzZSBwcmV2aXNvdXNseSBjcmVhdGVkIGxvY2FsIHNjYWxlIGlmIGV4aXN0c1xuICAgIGNvbnN0IHRpbWVUb1BpeGVsID0gdGhpcy5fdGltZVRvUGl4ZWwgP1xuICAgICAgdGhpcy5fdGltZVRvUGl4ZWwgOiBzY2FsZXMubGluZWFyKCkuZG9tYWluKFswLCAxXSk7XG5cbiAgICB0aW1lVG9QaXhlbC5yYW5nZShbMCwgdGhpcy5wYXJlbnQuY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQgKiB2YWx1ZV0pO1xuXG4gICAgdGhpcy5fdGltZVRvUGl4ZWwgPSB0aW1lVG9QaXhlbDtcbiAgICB0aGlzLl9zdHJldGNoUmF0aW8gPSB2YWx1ZTtcbiAgfVxuXG4gIC8vIHJlYWQgb25seVxuICBnZXQgdGltZVRvUGl4ZWwoKSB7XG4gICAgaWYgKCF0aGlzLl90aW1lVG9QaXhlbCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnRpbWVUb1BpeGVsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl90aW1lVG9QaXhlbDtcbiAgfVxufVxuIiwiaW1wb3J0IHNjYWxlcyBmcm9tICcuLi91dGlscy9zY2FsZXMnO1xuaW1wb3J0IGQzU2VsZWN0aW9uIGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQgZXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5cbmltcG9ydCBucyBmcm9tICcuL25hbWVzcGFjZSc7XG5pbXBvcnQgU2VnbWVudCBmcm9tICcuLi9zaGFwZXMvc2VnbWVudCc7XG5pbXBvcnQgVGltZUNvbnRleHRCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvdGltZS1jb250ZXh0LWJlaGF2aW9yJztcblxuLy8gdGltZSBjb250ZXh0IGJhaGV2aW9yXG5sZXQgdGltZUNvbnRleHRCZWhhdmlvciA9IG51bGw7XG5sZXQgdGltZUNvbnRleHRCZWhhdmlvckN0b3IgPSBUaW1lQ29udGV4dEJlaGF2aW9yO1xuXG4vLyBwcml2YXRlIGl0ZW0gLT4gaWQgbWFwIHRvIGZvcmNlIGQzIHRwIGtlZXAgaW4gc3luYyB3aXRoIHRoZSBET01cbmxldCAgIF9jb3VudGVyID0gMDtcbmNvbnN0IF9kYXR1bUlkTWFwID0gbmV3IE1hcCgpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXllciBleHRlbmRzIGV2ZW50cy5FdmVudEVtaXR0ZXIge1xuICAvKipcbiAgICogU3RydWN0dXJlIG9mIHRoZSBET00gdmlldyBvZiBhIExheWVyXG4gICAqXG4gICAqIDxnIGNsYXNzPVwibGF5ZXJcIj4gRmxpcCB5IGF4aXMsIHRpbWVDb250ZXh0LnN0YXJ0IGFuZCB0b3AgcG9zaXRpb24gZnJvbSBwYXJhbXMgYXJlIGFwcGxpZWQgb24gdGhpcyAkZWxtdFxuICAgKiAgIDxzdmcgY2xhc3M9XCJib3VuZGluZy1ib3hcIj4gdGltZUNvbnRleHQuZHVyYXRpb24gaXMgYXBwbGllZCBvbiB0aGlzICRlbG10XG4gICAqICAgIDxnIGNsYXNzPVwibGF5ZXItaW50ZXJhY3Rpb25zXCI+IENvbnRhaW5zIHRoZSB0aW1lQ29udGV4dCBlZGl0aW9uIGVsZW1lbnRzIChhIHNlZ21lbnQpXG4gICAqICAgIDwvZz5cbiAgICogICAgPGcgY2xhc3M9XCJvZmZzZXQgaXRlbXNcIj4gVGhlIHNoYXBlcyBhcmUgaW5zZXJ0ZWQgaGVyZSwgYW5kIHdlIGFwcGx5IHRpbWVDb250ZXh0Lm9mZnNldCBvbiB0aGlzICRlbG10XG4gICAqICAgIDwvZz5cbiAgICogICA8L3N2Zz5cbiAgICogPC9nPlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YVR5cGUsIGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5kYXRhVHlwZSA9IGRhdGFUeXBlOyAvLyAnZW50aXR5JyB8fCAnY29sbGVjdGlvbic7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgaGVpZ2h0OiAxMDAsXG4gICAgICB0b3A6IDAsXG4gICAgICBpZDogJycsXG4gICAgICB5RG9tYWluOiBbMCwgMV0sXG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgZGVidWdDb250ZXh0OiBmYWxzZSwgLy8gcGFzcyB0aGUgY29udGV4dCBpbiBkZWJ1ZyBtb2RlXG4gICAgICBjb250ZXh0SGFuZGxlcldpZHRoOiAyLFxuICAgICAgY2xhc3NOYW1lOiBudWxsXG4gICAgfTtcblxuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIHRoaXMudGltZUNvbnRleHQgPSBudWxsO1xuXG4gICAgLy8gY29udGFpbmVyIGVsZW1lbnRzXG4gICAgdGhpcy4kZWwgPSBudWxsOyAvLyBvZmZzZXQgZ3JvdXAgb2YgdGhlIHBhcmVudCBjb250ZXh0XG4gICAgdGhpcy4kYm91bmRpbmdCb3ggPSBudWxsO1xuICAgIHRoaXMuJG9mZnNldCA9IG51bGw7XG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zID0gbnVsbDtcblxuICAgIHRoaXMuZDNpdGVtcyA9IG51bGw7IC8vIGQzIGNvbGxlY3Rpb24gb2YgdGhlIGxheWVyIGl0ZW1zXG5cbiAgICB0aGlzLl9zaGFwZUNvbmZpZ3VyYXRpb24gPSBudWxsOyAvLyB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9XG4gICAgdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uID0gbnVsbDsgLy8geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfVxuXG4gICAgdGhpcy5fJGl0ZW1TaGFwZU1hcCA9IG5ldyBNYXAoKTsgLy8gaXRlbSBncm91cCA8RE9NRWxlbWVudD4gPT4gc2hhcGVcbiAgICB0aGlzLl8kaXRlbUQzU2VsZWN0aW9uTWFwID0gbmV3IE1hcCgpOyAvLyBpdGVtIGdyb3VwIDxET01FbGVtZW50PiA9PiBzaGFwZVxuICAgIHRoaXMuXyRpdGVtQ29tbW9uU2hhcGVNYXAgPSBuZXcgTWFwKCk7IC8vIG9uZSBlbnRyeSBtYXggaW4gdGhpcyBtYXBcblxuICAgIHRoaXMuX2lzQ29udGV4dEVkaXRhYmxlID0gZmFsc2U7XG4gICAgdGhpcy5fYmVoYXZpb3IgPSBudWxsO1xuXG4gICAgdGhpcy5fdmFsdWVUb1BpeGVsID0gc2NhbGVzLmxpbmVhcigpXG4gICAgICAuZG9tYWluKHRoaXMucGFyYW1zLnlEb21haW4pXG4gICAgICAucmFuZ2UoWzAsIHRoaXMucGFyYW1zLmhlaWdodF0pO1xuXG4gICAgdGhpcy5jb250ZXh0QmVoYXZpb3IgPSAnJztcblxuICAgIC8vIGluaXRpYWxpemUgdGltZUNvbnRleHQgbGF5b3V0XG4gICAgdGhpcy5fcmVuZGVyQ29udGFpbmVyKCk7XG5cbiAgICAvLyBjcmVhdGVzIHRoZSB0aW1lQ29udGV4dEJlaGF2aW9yIGZvciBhbGwgbGF5ZXIsIGxhenkgaW5zdGFuY2lhdGlvblxuICAgIGlmICh0aW1lQ29udGV4dEJlaGF2aW9yID09PSBudWxsKSB7XG4gICAgICB0aW1lQ29udGV4dEJlaGF2aW9yID0gbmV3IHRpbWVDb250ZXh0QmVoYXZpb3JDdG9yKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBhbGxvd3MgdG8gb3ZlcnJpZGUgZGVmYXVsdCB0aGUgVGltZUNvbnRleHRCZWhhdmlvclxuICAgKi9cbiAgc3RhdGljIGNvbmZpZ3VyZVRpbWVDb250ZXh0QmVoYXZpb3IoY3Rvcikge1xuICAgIHRpbWVDb250ZXh0QmVoYXZpb3JDdG9yID0gY3RvcjtcbiAgfVxuXG4gIGdldCBzdGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5zdGFydDtcbiAgfVxuXG4gIHNldCBzdGFydCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQuc3RhcnQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQub2Zmc2V0O1xuICB9XG5cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQub2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQuZHVyYXRpb247XG4gIH1cblxuICBzZXQgZHVyYXRpb24odmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc3RyZXRjaFJhdGlvKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbztcbiAgfVxuXG4gIHNldCBzdHJldGNoUmF0aW8odmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbyA9IHZhbHVlO1xuICB9XG5cbiAgLy8gZGVzdHJveSgpIHtcbiAgLy8gICB0aGlzLnRpbWVDb250ZXh0ID0gbnVsbDtcbiAgLy8gICB0aGlzLmQzaXRlbXMgPSBudWxsO1xuICAvLyAgIHRoaXMuZGF0YSA9IG51bGw7XG4gIC8vICAgdGhpcy5wYXJhbXMgPSBudWxsO1xuICAvLyAgIHRoaXMuX2JlaGF2aW9yID0gbnVsbDtcbiAgLy9cbiAgLy8gICAvLyBAVE9ET1xuICAvLyAgICAgIC0gY2xlYW4gTWFwc1xuICAvLyAgICAgIC0gY2xlYW4gbGlzdGVuZXJzXG4gIC8vICAgICAgLSBjbGVhbiBiZWhhdmlvciAoYmVoYXZpb3IuX2xheWVyKVxuICAvLyB9XG5cbiAgc2V0IHlEb21haW4oZG9tYWluKSB7XG4gICAgdGhpcy5wYXJhbXMueURvbWFpbiA9IGRvbWFpbjtcbiAgICB0aGlzLl92YWx1ZVRvUGl4ZWwuZG9tYWluKGRvbWFpbik7XG4gIH1cblxuICBnZXQgeURvbWFpbigpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMueURvbWFpbjtcbiAgfVxuXG4gIHNldCBvcGFjaXR5KHZhbHVlKSB7XG4gICAgdGhpcy5wYXJhbXMub3BhY2l0eSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IG9wYWNpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLm9wYWNpdHk7XG4gIH1cblxuICAvKipcbiAgICogVGltZUNvbnRleHQgYWNjZXNzb3JzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAbWFuZGF0b3J5IGRlZmluZSB0aGUgY29udGV4dCBpbiB3aGljaCB0aGUgbGF5ZXIgaXMgZHJhd25cbiAgICogQHBhcmFtIGNvbnRleHQge1RpbWVDb250ZXh0fSB0aGUgdGltZUNvbnRleHQgaW4gd2hpY2ggdGhlIGxheWVyIGlzIGRpc3BsYXllZFxuICAgKi9cbiAgc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gdGltZUNvbnRleHQ7XG4gICAgLy8gY3JlYXRlIGEgbWl4aW4gdG8gcGFzcyB0byB0aGUgc2hhcGVzXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dCA9IHt9O1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIERhdGFcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBnZXQgZGF0YSgpIHsgcmV0dXJuIHRoaXMuX2RhdGE7IH1cblxuICBzZXQgZGF0YShkYXRhKSB7XG4gICAgc3dpdGNoICh0aGlzLmRhdGFUeXBlKSB7XG4gICAgICBjYXNlICdlbnRpdHknOlxuICAgICAgICBpZiAodGhpcy5fZGF0YSkgeyAgLy8gaWYgZGF0YSBhbHJlYWR5IGV4aXN0cywgcmV1c2UgdGhlIHJlZmVyZW5jZVxuICAgICAgICAgIHRoaXMuX2RhdGFbMF0gPSBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2RhdGEgPSBbZGF0YV07XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2xsZWN0aW9uJzpcbiAgICAgICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIEluaXRpYWxpemF0aW9uXG5cbiAgLyoqXG4gICAqICByZW5kZXIgdGhlIERPTSBpbiBtZW1vcnkgb24gbGF5ZXIgY3JlYXRpb24gdG8gYmUgYWJsZSB0byB1c2UgaXQgYmVmb3JlXG4gICAqICB0aGUgbGF5ZXIgaXMgYWN0dWFsbHkgaW5zZXJ0ZWQgaW4gdGhlIERPTVxuICAgKi9cbiAgX3JlbmRlckNvbnRhaW5lcigpIHtcbiAgICAvLyB3cmFwcGVyIGdyb3VwIGZvciBgc3RhcnQsIHRvcCBhbmQgY29udGV4dCBmbGlwIG1hdHJpeFxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIGlmICh0aGlzLnBhcmFtcy5jbGFzc05hbWUgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQoJ2xheWVyJywgdGhpcy5wYXJhbXMuY2xhc3NOYW1lKTtcbiAgICB9XG4gICAgLy8gY2xpcCB0aGUgY29udGV4dCB3aXRoIGEgYHN2Z2AgZWxlbWVudFxuICAgIHRoaXMuJGJvdW5kaW5nQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnc3ZnJyk7XG4gICAgdGhpcy4kYm91bmRpbmdCb3guY2xhc3NMaXN0LmFkZCgnYm91bmRpbmctYm94Jyk7XG4gICAgLy8gZ3JvdXAgdG8gYXBwbHkgb2Zmc2V0XG4gICAgdGhpcy4kb2Zmc2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIHRoaXMuJG9mZnNldC5jbGFzc0xpc3QuYWRkKCdvZmZzZXQnLCAnaXRlbXMnKTtcbiAgICAvLyBsYXllciBiYWNrZ3JvdW5kXG4gICAgdGhpcy4kYmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAnMTAwJScpO1xuICAgIHRoaXMuJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgJzEwMCUnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoJ2JhY2tncm91bmQnKTtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnN0eWxlLmZpbGxPcGFjaXR5ID0gMDtcbiAgICB0aGlzLiRiYWNrZ3JvdW5kLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG4gICAgLy8gY29udGV4dCBpbnRlcmFjdGlvbnNcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zLmNsYXNzTGlzdC5hZGQoJ2ludGVyYWN0aW9ucycpO1xuICAgIHRoaXMuJGludGVyYWN0aW9ucy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIC8vIEBOT1RFOiB3b3JrcyBidXQga2luZyBvZiB1Z2x5Li4uIHNob3VsZCBiZSBjbGVhbmVkXG4gICAgdGhpcy5jb250ZXh0U2hhcGUgPSBuZXcgU2VnbWVudCgpO1xuICAgIHRoaXMuY29udGV4dFNoYXBlLmluc3RhbGwoe1xuICAgICAgb3BhY2l0eTogKCkgPT4gMC4xLFxuICAgICAgY29sb3IgIDogKCkgPT4gJyM3ODc4NzgnLFxuICAgICAgd2lkdGggIDogKCkgPT4gdGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbixcbiAgICAgIGhlaWdodCA6ICgpID0+IHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmRvbWFpbigpWzFdLFxuICAgICAgeSAgICAgIDogKCkgPT4gdGhpcy5fcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuZG9tYWluKClbMF1cbiAgICB9KTtcblxuICAgIHRoaXMuJGludGVyYWN0aW9ucy5hcHBlbmRDaGlsZCh0aGlzLmNvbnRleHRTaGFwZS5yZW5kZXIoKSk7XG4gICAgLy8gY3JlYXRlIHRoZSBET00gdHJlZVxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJGJvdW5kaW5nQm94KTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5hcHBlbmRDaGlsZCh0aGlzLiRvZmZzZXQpO1xuICAgIHRoaXMuJG9mZnNldC5hcHBlbmRDaGlsZCh0aGlzLiRiYWNrZ3JvdW5kKTtcbiAgICB0aGlzLiRib3VuZGluZ0JveC5hcHBlbmRDaGlsZCh0aGlzLiRpbnRlcmFjdGlvbnMpO1xuXG4gICAgLy8gZHJhdyBhIFNlZ21lbnQgaW4gY29udGV4dCBiYWNrZ3JvdW5kIHRvIGRlYnVnIGl0J3Mgc2l6ZVxuICAgIGlmICh0aGlzLnBhcmFtcy5kZWJ1Zykge1xuICAgICAgdGhpcy4kZGVidWdSZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnU2VnbWVudCcpO1xuICAgICAgdGhpcy4kYm91bmRpbmdCb3guYXBwZW5kQ2hpbGQodGhpcy4kZGVidWdSZWN0KTtcbiAgICAgIHRoaXMuJGRlYnVnUmVjdC5zdHlsZS5maWxsID0gJyNhYmFiYWInO1xuICAgICAgdGhpcy4kZGVidWdSZWN0LnN0eWxlLmZpbGxPcGFjaXR5ID0gMC4xO1xuICAgIH1cbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbXBvbmVudCBDb25maWd1cmF0aW9uXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqICBSZWdpc3RlciB0aGUgc2hhcGUgYW5kIGl0cyBhY2Nlc3NvcnMgdG8gdXNlIGluIG9yZGVyIHRvIHJlbmRlclxuICAgKiAgdGhlIGVudGl0eSBvciBjb2xsZWN0aW9uXG4gICAqICBAcGFyYW0gY3RvciA8RnVuY3Rpb246QmFzZVNoYXBlPiB0aGUgY29uc3RydWN0b3Igb2YgdGhlIHNoYXBlIHRvIGJlIHVzZWRcbiAgICogIEBwYXJhbSBhY2Nlc3NvcnMgPE9iamVjdD4gYWNjZXNzb3JzIHRvIHVzZSBpbiBvcmRlciB0byBtYXAgdGhlIGRhdGEgc3RydWN0dXJlXG4gICAqL1xuICBjb25maWd1cmVTaGFwZShjdG9yLCBhY2Nlc3NvcnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uID0geyBjdG9yLCBhY2Nlc3NvcnMsIG9wdGlvbnMgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgUmVnaXN0ZXIgdGhlIHNoYXBlIHRvIHVzZSB3aXRoIHRoZSBlbnRpcmUgY29sbGVjdGlvblxuICAgKiAgZXhhbXBsZTogdGhlIGxpbmUgaW4gYSBiZWFrcG9pbnQgZnVuY3Rpb25cbiAgICogIEBwYXJhbSBjdG9yIHtCYXNlU2hhcGV9IHRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgc2hhcGUgdG8gdXNlIHRvIHJlbmRlciBkYXRhXG4gICAqICBAcGFyYW0gYWNjZXNzb3JzIHtPYmplY3R9IGFjY2Vzc29ycyB0byB1c2UgaW4gb3JkZXIgdG8gbWFwIHRoZSBkYXRhIHN0cnVjdHVyZVxuICAgKi9cbiAgY29uZmlndXJlQ29tbW9uU2hhcGUoY3RvciwgYWNjZXNzb3JzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiA9IHsgY3RvciwgYWNjZXNzb3JzLCBvcHRpb25zIH07XG4gIH1cblxuICAvKipcbiAgICogIFJlZ2lzdGVyIHRoZSBiZWhhdmlvciB0byB1c2Ugd2hlbiBpbnRlcmFjdGluZyB3aXRoIHRoZSBzaGFwZVxuICAgKiAgQHBhcmFtIGJlaGF2aW9yIHtCYXNlQmVoYXZpb3J9XG4gICAqL1xuICBzZXRCZWhhdmlvcihiZWhhdmlvcikge1xuICAgIGJlaGF2aW9yLmluaXRpYWxpemUodGhpcyk7XG4gICAgdGhpcy5fYmVoYXZpb3IgPSBiZWhhdmlvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlIHRoZSB2YWx1ZXMgaW4gYF9yZW5kZXJpbmdDb250ZXh0YFxuICAgKiAgaXMgcGFydGljdWxhcnkgbmVlZGVkIHdoZW4gdXBkYXRpbmcgYHN0cmV0Y2hSYXRpb2AgYXMgdGhlIHBvaW50ZXJcbiAgICogIHRvIHRoZSBgdGltZVRvUGl4ZWxgIHNjYWxlIG1heSBjaGFuZ2VcbiAgICovXG4gIF91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCkge1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwgPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsID0gdGhpcy5fdmFsdWVUb1BpeGVsO1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQuaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIHRoaXMuX3JlbmRlcmluZ0NvbnRleHQud2lkdGggID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uKTtcbiAgICAvLyBmb3IgZm9yZWlnbiBvYmplY3QgaXNzdWUgaW4gY2hyb21lXG4gICAgdGhpcy5fcmVuZGVyaW5nQ29udGV4dC5vZmZzZXRYID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBCZWhhdmlvciBBY2Nlc3NvcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBnZXQgc2VsZWN0ZWRJdGVtcygpIHtcbiAgICByZXR1cm4gdGhpcy5fYmVoYXZpb3IgPyB0aGlzLl9iZWhhdmlvci5zZWxlY3RlZEl0ZW1zIDogW107XG4gIH1cblxuICBzZWxlY3QoLi4uJGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHsgJGl0ZW1zID0gdGhpcy5kM2l0ZW1zLm5vZGVzKCk7IH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheSgkaXRlbXNbMF0pKSB7ICRpdGVtcyA9ICRpdGVtc1swXTsgfVxuXG4gICAgJGl0ZW1zLmZvckVhY2goKCRlbCkgPT4ge1xuICAgICAgY29uc3QgaXRlbSA9IHRoaXMuXyRpdGVtRDNTZWxlY3Rpb25NYXAuZ2V0KCRlbCk7XG4gICAgICB0aGlzLl9iZWhhdmlvci5zZWxlY3QoJGVsLCBpdGVtLmRhdHVtKCkpO1xuICAgICAgdGhpcy5fdG9Gcm9udCgkZWwpO1xuICAgIH0pO1xuICB9XG5cbiAgdW5zZWxlY3QoLi4uJGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHsgJGl0ZW1zID0gdGhpcy5kM2l0ZW1zLm5vZGVzKCk7IH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheSgkaXRlbXNbMF0pKSB7ICRpdGVtcyA9ICRpdGVtc1swXTsgfVxuXG4gICAgJGl0ZW1zLmZvckVhY2goKCRlbCkgPT4ge1xuICAgICAgY29uc3QgaXRlbSA9IHRoaXMuXyRpdGVtRDNTZWxlY3Rpb25NYXAuZ2V0KCRlbCk7XG4gICAgICB0aGlzLl9iZWhhdmlvci51bnNlbGVjdCgkZWwsIGl0ZW0uZGF0dW0oKSk7XG4gICAgfSk7XG4gIH1cblxuICB0b2dnbGVTZWxlY3Rpb24oLi4uJGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHsgJGl0ZW1zID0gdGhpcy5kM2l0ZW1zLm5vZGVzKCk7IH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheSgkaXRlbXNbMF0pKSB7ICRpdGVtcyA9ICRpdGVtc1swXTsgfVxuXG4gICAgJGl0ZW1zLmZvckVhY2goKCRlbCkgPT4ge1xuICAgICAgY29uc3QgaXRlbSA9IHRoaXMuXyRpdGVtRDNTZWxlY3Rpb25NYXAuZ2V0KCRlbCk7XG4gICAgICB0aGlzLl9iZWhhdmlvci50b2dnbGVTZWxlY3Rpb24oJGVsLCBpdGVtLmRhdHVtKCkpO1xuICAgIH0pO1xuICB9XG5cbiAgZWRpdCgkaXRlbXMsIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgaWYgKCF0aGlzLl9iZWhhdmlvcikgeyByZXR1cm47IH1cbiAgICAkaXRlbXMgPSAhQXJyYXkuaXNBcnJheSgkaXRlbXMpID8gWyRpdGVtc10gOiAkaXRlbXM7XG5cbiAgICAkaXRlbXMuZm9yRWFjaCgoJGVsKSA9PiB7XG4gICAgICBjb25zdCBpdGVtICA9IHRoaXMuXyRpdGVtRDNTZWxlY3Rpb25NYXAuZ2V0KCRlbCk7XG4gICAgICBjb25zdCBzaGFwZSA9IHRoaXMuXyRpdGVtU2hhcGVNYXAuZ2V0KCRlbCk7XG4gICAgICBjb25zdCBkYXR1bSA9IGl0ZW0uZGF0dW0oKTtcbiAgICAgIHRoaXMuX2JlaGF2aW9yLmVkaXQodGhpcy5fcmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCk7XG4gICAgICB0aGlzLmVtaXQoJ2VkaXQnLCBzaGFwZSwgZGF0dW0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBkcmF3cyB0aGUgc2hhcGUgdG8gaW50ZXJhY3Qgd2l0aCB0aGUgY29udGV4dFxuICAgKiAgQHBhcmFtcyB7Qm9vbGVhbn0gW2Jvb2w9dHJ1ZV0gLSBkZWZpbmVzIGlmIHRoZSBsYXllcidzIGNvbnRleHQgaXMgZWRpdGFibGUgb3Igbm90XG4gICAqL1xuICBzZXRDb250ZXh0RWRpdGFibGUoYm9vbCA9IHRydWUpIHtcbiAgICBjb25zdCBkaXNwbGF5ID0gYm9vbCA/ICdibG9jaycgOiAnbm9uZSc7XG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xuICAgIHRoaXMuX2lzQ29udGV4dEVkaXRhYmxlID0gYm9vbDtcbiAgfVxuXG4gIGVkaXRDb250ZXh0KGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgdGltZUNvbnRleHRCZWhhdmlvci5lZGl0KHRoaXMsIGR4LCBkeSwgdGFyZ2V0KTtcbiAgfVxuXG4gIHN0cmV0Y2hDb250ZXh0KGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgdGltZUNvbnRleHRCZWhhdmlvci5zdHJldGNoKHRoaXMsIGR4LCBkeSwgdGFyZ2V0KTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEhlbHBlcnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogIE1vdmVzIGFuIGAkZWxgJ3MgZ3JvdXAgdG8gdGhlIGVuZCBvZiB0aGUgbGF5ZXIgKHN2ZyB6LWluZGV4Li4uKVxuICAgKiAgQHBhcmFtIGAkZWxgIHtET01FbGVtZW50fSB0aGUgRE9NRWxlbWVudCB0byBiZSBtb3ZlZFxuICAgKi9cbiAgX3RvRnJvbnQoJGVsKSB7XG4gICAgdGhpcy4kb2Zmc2V0LmFwcGVuZENoaWxkKCRlbCk7XG4gIH1cblxuICAvKipcbiAgICogIFJldHVybnMgdGhlIGQzU2VsZWN0aW9uIGl0ZW0gdG8gd2hpY2ggdGhlIGdpdmVuIERPTUVsZW1lbnQgYiRlbG9uZ3NcbiAgICogIEBwYXJhbSBgJGVsYCB7RE9NRWxlbWVudH0gdGhlIGVsZW1lbnQgdG8gYmUgdGVzdGVkXG4gICAqICBAcmV0dXJuIHtET01FbGVtZW50fG51bGx9IGl0ZW0gZ3JvdXAgY29udGFpbmluZyB0aGUgYCRlbGAgaWYgYiRlbG9uZ3MgdG8gdGhpcyBsYXllciwgbnVsbCBvdGhlcndpc2VcbiAgICovXG4gIGdldEl0ZW1Gcm9tRE9NRWxlbWVudCgkZWwpIHtcbiAgICBsZXQgJGl0ZW07XG5cbiAgICBkbyB7XG4gICAgICBpZiAoJGVsLmNsYXNzTGlzdCAmJiAkZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdpdGVtJykpIHtcbiAgICAgICAgJGl0ZW0gPSAkZWw7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICAkZWwgPSAkZWwucGFyZW50Tm9kZTtcbiAgICB9IHdoaWxlICgkZWwgIT09IG51bGwpO1xuXG4gICAgcmV0dXJuIHRoaXMuaGFzSXRlbSgkaXRlbSkgPyAkaXRlbSA6wqBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqICBSZXR1cm5zIHRoZSBkYXR1bSBhc3NvY2lhdGVkIHRvIGEgc3BlY2lmaWMgaXRlbSBET01FbGVtZW50XG4gICAqICB1c2UgZDMgaW50ZXJuYWxseSB0byByZXRyaWV2ZSB0aGUgZGF0dW1cbiAgICogIEBwYXJhbSAkaXRlbSB7RE9NRWxlbWVudH1cbiAgICogIEByZXR1cm4ge09iamVjdHxBcnJheXxudWxsfSBkZXBlbmRpbmcgb24gdGhlIHVzZXIgZGF0YSBzdHJ1Y3R1cmVcbiAgICovXG4gIGdldERhdHVtRnJvbUl0ZW0oJGl0ZW0pIHtcbiAgICBjb25zdCBkM2l0ZW0gPSB0aGlzLl8kaXRlbUQzU2VsZWN0aW9uTWFwLmdldCgkaXRlbSk7XG4gICAgcmV0dXJuIGQzaXRlbSA/IGQzaXRlbS5kYXR1bSgpIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRGVmaW5lcyBpZiB0aGUgZ2l2ZW4gZDMgc2VsZWN0aW9uIGlzIGFuIGl0ZW0gb2YgdGhlIGxheWVyXG4gICAqICBAcGFyYW0gaXRlbSB7RE9NRWxlbWVudH1cbiAgICogIEByZXR1cm4ge2Jvb2x9XG4gICAqL1xuICBoYXNJdGVtKCRpdGVtKSB7XG4gICAgY29uc3Qgbm9kZXMgPSB0aGlzLmQzaXRlbXMubm9kZXMoKTtcbiAgICByZXR1cm4gbm9kZXMuaW5kZXhPZigkaXRlbSkgIT09IC0xO1xuICB9XG5cbiAgLyoqXG4gICAqICBEZWZpbmVzIGlmIGEgZ2l2ZW4gZWxlbWVudCBiJGVsb25ncyB0byB0aGUgbGF5ZXJcbiAgICogIGlzIG1vcmUgZ2VuZXJhbCB0aGFuIGBoYXNJdGVtYCwgY2FuIGJlIHVzZWQgdG8gY2hlY2sgaW50ZXJhY3Rpb24gZWxlbWVudHMgdG9vXG4gICAqICBAcGFyYW0gJGVsIHtET01FbGVtZW50fVxuICAgKiAgQHJldHVybiB7Ym9vbH1cbiAgICovXG4gIGhhc0VsZW1lbnQoJGVsKSB7XG4gICAgZG8ge1xuICAgICAgaWYgKCRlbCA9PT0gdGhpcy4kZWwpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgICRlbCA9ICRlbC5wYXJlbnROb2RlO1xuICAgIH0gd2hpbGUgKCRlbCAhPT0gbnVsbCk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogIEBwYXJhbSBhcmVhIHtPYmplY3R9IGFyZWEgaW4gd2hpY2ggdG8gZmluZCB0aGUgZWxlbWVudHNcbiAgICogIEByZXR1cm4ge0FycmF5fSBsaXN0IG9mIHRoZSBET00gZWxlbWVudHMgaW4gdGhlIGdpdmVuIGFyZWFcbiAgICovXG4gIGdldEl0ZW1zSW5BcmVhKGFyZWEpIHtcbiAgICBjb25zdCBzdGFydCAgICA9IHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWwodGhpcy50aW1lQ29udGV4dC5zdGFydCk7XG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24pO1xuICAgIGNvbnN0IG9mZnNldCAgID0gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCk7XG4gICAgY29uc3QgdG9wICAgICAgPSB0aGlzLnBhcmFtcy50b3A7XG4gICAgLy8gYmUgYXdhcmUgYWYgY29udGV4dCdzIHRyYW5zbGF0aW9ucyAtIGNvbnN0cmFpbiBpbiB3b3JraW5nIHZpZXdcbiAgICBsZXQgeDEgPSBNYXRoLm1heChhcmVhLmxlZnQsIHN0YXJ0KTtcbiAgICBsZXQgeDIgPSBNYXRoLm1pbihhcmVhLmxlZnQgKyBhcmVhLndpZHRoLCBzdGFydCArIGR1cmF0aW9uKTtcbiAgICB4MSAtPSAoc3RhcnQgKyBvZmZzZXQpO1xuICAgIHgyIC09IChzdGFydCArIG9mZnNldCk7XG4gICAgLy8ga2VlcCBjb25zaXN0ZW50IHdpdGggY29udGV4dCB5IGNvb3JkaW5hdGVzIHN5c3RlbVxuICAgIGxldCB5MSA9IHRoaXMucGFyYW1zLmhlaWdodCAtIChhcmVhLnRvcCArIGFyZWEuaGVpZ2h0KTtcbiAgICBsZXQgeTIgPSB0aGlzLnBhcmFtcy5oZWlnaHQgLSBhcmVhLnRvcDtcblxuICAgIHkxICs9IHRoaXMucGFyYW1zLnRvcDtcbiAgICB5MiArPSB0aGlzLnBhcmFtcy50b3A7XG5cbiAgICBjb25zdCBpdGVtU2hhcGVNYXAgPSB0aGlzLl8kaXRlbVNoYXBlTWFwO1xuICAgIGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLl9yZW5kZXJpbmdDb250ZXh0O1xuXG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLmQzaXRlbXMuZmlsdGVyKGZ1bmN0aW9uKGRhdHVtLCBpbmRleCkge1xuICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzO1xuICAgICAgY29uc3Qgc2hhcGUgPSBpdGVtU2hhcGVNYXAuZ2V0KGdyb3VwKTtcbiAgICAgIHJldHVybiBzaGFwZS5pbkFyZWEocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBpdGVtcy5ub2RlcygpLnNsaWNlKDApO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyaW5nIC8gRGlzcGxheSBtZXRob2RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gLyoqXG4gIC8vICAqICBSZXR1cm5zIHRoZSBwcmV2aXNvdWx5IGNyZWF0ZWQgbGF5ZXIncyBjb250YWluZXJcbiAgLy8gICogIEByZXR1cm4ge0RPTUVsZW1lbnR9XG4gIC8vICAqL1xuICAvLyByZW5kZXJDb250YWluZXIoKSB7XG4gIC8vICAgcmV0dXJuIHRoaXMuJGVsO1xuICAvLyB9XG5cbiAgLy8gLyoqXG4gIC8vICAqICBDcmVhdGVzIHRoZSBET00gYWNjb3JkaW5nIHRvIGdpdmVuIGRhdGEgYW5kIHNoYXBlc1xuICAvLyAgKi9cbiAgLy8gcmVuZGVyKCl7XG4gIC8vICAgdGhpcy5kcmF3U2hhcGVzKCk7XG4gIC8vIH1cblxuICByZW5kZXIoKSB7XG4gICAgLy8gZm9yY2UgZDMgdG8ga2VlcCBkYXRhIGluIHN5bmMgd2l0aCB0aGUgRE9NIHdpdGggYSB1bmlxdWUgaWRcbiAgICB0aGlzLmRhdGEuZm9yRWFjaChmdW5jdGlvbihkYXR1bSkge1xuICAgICAgaWYgKF9kYXR1bUlkTWFwLmhhcyhkYXR1bSkpIHsgcmV0dXJuOyB9XG4gICAgICBfZGF0dW1JZE1hcC5zZXQoZGF0dW0sIF9jb3VudGVyKyspO1xuICAgIH0pO1xuXG4gICAgLy8gc2VsZWN0IGl0ZW1zXG4gICAgdGhpcy5kM2l0ZW1zID0gZDNTZWxlY3Rpb24uc2VsZWN0KHRoaXMuJG9mZnNldClcbiAgICAgIC5zZWxlY3RBbGwoJy5pdGVtJylcbiAgICAgIC5maWx0ZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbW1vbicpO1xuICAgICAgfSlcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSwgZnVuY3Rpb24oZGF0dW0pIHtcbiAgICAgICAgcmV0dXJuIF9kYXR1bUlkTWFwLmdldChkYXR1bSk7XG4gICAgICB9KTtcblxuICAgIC8vIHJlbmRlciBgY29tbW9uU2hhcGVgIG9ubHkgb25jZVxuICAgIGlmIChcbiAgICAgIHRoaXMuX2NvbW1vblNoYXBlQ29uZmlndXJhdGlvbiAhPT0gbnVsbCAmJlxuICAgICAgdGhpcy5fJGl0ZW1Db21tb25TaGFwZU1hcC5zaXplID09PSAwXG4gICAgKSB7XG4gICAgICBjb25zdCB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9ID0gdGhpcy5fY29tbW9uU2hhcGVDb25maWd1cmF0aW9uO1xuICAgICAgY29uc3QgJGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgY3RvcihvcHRpb25zKTtcblxuICAgICAgc2hhcGUuaW5zdGFsbChhY2Nlc3NvcnMpO1xuICAgICAgJGdyb3VwLmFwcGVuZENoaWxkKHNoYXBlLnJlbmRlcigpKTtcbiAgICAgICRncm91cC5jbGFzc0xpc3QuYWRkKCdpdGVtJywgJ2NvbW1vbicsIHNoYXBlLmdldENsYXNzTmFtZSgpKTtcblxuICAgICAgdGhpcy5fJGl0ZW1Db21tb25TaGFwZU1hcC5zZXQoJGdyb3VwLCBzaGFwZSk7XG4gICAgICB0aGlzLiRvZmZzZXQuYXBwZW5kQ2hpbGQoJGdyb3VwKTtcbiAgICB9XG5cbiAgICAvLyAuLi4gZW50ZXJcbiAgICB0aGlzLmQzaXRlbXMuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgoZGF0dW0sIGluZGV4KSA9PiB7XG4gICAgICAgIC8vIEBOT1RFOiBkMyBiaW5kcyBgdGhpc2AgdG8gdGhlIGNvbnRhaW5lciBncm91cFxuICAgICAgICBjb25zdCB7IGN0b3IsIGFjY2Vzc29ycywgb3B0aW9ucyB9ID0gdGhpcy5fc2hhcGVDb25maWd1cmF0aW9uO1xuICAgICAgICBjb25zdCBzaGFwZSA9IG5ldyBjdG9yKG9wdGlvbnMpO1xuICAgICAgICBzaGFwZS5pbnN0YWxsKGFjY2Vzc29ycyk7XG5cbiAgICAgICAgY29uc3QgJGVsID0gc2hhcGUucmVuZGVyKHRoaXMuX3JlbmRlcmluZ0NvbnRleHQpO1xuICAgICAgICAkZWwuY2xhc3NMaXN0LmFkZCgnaXRlbScsIHNoYXBlLmdldENsYXNzTmFtZSgpKTtcblxuICAgICAgICB0aGlzLl8kaXRlbVNoYXBlTWFwLnNldCgkZWwsIHNoYXBlKTtcbiAgICAgICAgdGhpcy5fJGl0ZW1EM1NlbGVjdGlvbk1hcC5zZXQoJGVsLCBkM1NlbGVjdGlvbi5zZWxlY3QoJGVsKSk7XG5cbiAgICAgICAgcmV0dXJuICRlbDtcbiAgICAgIH0pO1xuXG4gICAgLy8gLi4uIGV4aXRcbiAgICBjb25zdCBfJGl0ZW1TaGFwZU1hcCA9IHRoaXMuXyRpdGVtU2hhcGVNYXA7XG4gICAgY29uc3QgXyRpdGVtRDNTZWxlY3Rpb25NYXAgPSB0aGlzLl8kaXRlbUQzU2VsZWN0aW9uTWFwO1xuXG4gICAgdGhpcy5kM2l0ZW1zLmV4aXQoKVxuICAgICAgLmVhY2goZnVuY3Rpb24oZGF0dW0sIGluZGV4KSB7XG4gICAgICAgIGNvbnN0ICRlbCA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHNoYXBlID0gXyRpdGVtU2hhcGVNYXAuZ2V0KCRlbCk7XG4gICAgICAgIC8vIGNsZWFuIGFsbCBzaGFwZS9pdGVtIHJlZmVyZW5jZXNcbiAgICAgICAgc2hhcGUuZGVzdHJveSgpO1xuICAgICAgICBfZGF0dW1JZE1hcC5kZWxldGUoZGF0dW0pO1xuICAgICAgICBfJGl0ZW1TaGFwZU1hcC5kZWxldGUoJGVsKTtcbiAgICAgICAgXyRpdGVtRDNTZWxlY3Rpb25NYXAuZGVsZXRlKCRlbCk7XG4gICAgICB9KVxuICAgICAgLnJlbW92ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqICB1cGRhdGVzIENvbnRleHQgYW5kIFNoYXBlc1xuICAgKi9cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMudXBkYXRlQ29udGFpbmVyKCk7XG4gICAgdGhpcy51cGRhdGVTaGFwZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgdXBkYXRlcyB0aGUgY29udGV4dCBvZiB0aGUgbGF5ZXJcbiAgICovXG4gIHVwZGF0ZUNvbnRhaW5lcigpIHtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJpbmdDb250ZXh0KCk7XG5cbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IHRoaXMudGltZUNvbnRleHQ7XG5cbiAgICBjb25zdCB3aWR0aCAgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aW1lQ29udGV4dC5kdXJhdGlvbik7XG4gICAgLy8gb2Zmc2V0IGlzIHJlbGF0aXZlIHRvIHRpbSRlbGluZSdzIHRpbWVDb250ZXh0XG4gICAgY29uc3QgeCAgICAgID0gdGltZUNvbnRleHQucGFyZW50LnRpbWVUb1BpeGVsKHRpbWVDb250ZXh0LnN0YXJ0KTtcbiAgICBjb25zdCBvZmZzZXQgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aW1lQ29udGV4dC5vZmZzZXQpO1xuICAgIGNvbnN0IHRvcCAgICA9IHRoaXMucGFyYW1zLnRvcDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBhcmFtcy5oZWlnaHQ7XG4gICAgLy8gbWF0cml4IHRvIGludmVydCB0aGUgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICBjb25zdCB0cmFuc2xhdGVNYXRyaXggPSBgbWF0cml4KDEsIDAsIDAsIC0xLCAke3h9LCAke3RvcCArIGhlaWdodH0pYDtcblxuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGVNYXRyaXgpO1xuXG4gICAgdGhpcy4kYm91bmRpbmdCb3guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgIHRoaXMuJGJvdW5kaW5nQm94LnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgIHRoaXMuJGJvdW5kaW5nQm94LnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuXG4gICAgdGhpcy4kb2Zmc2V0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7b2Zmc2V0fSwgMClgKTtcblxuICAgIC8vIG1haW50YWluIGNvbnRleHQgc2hhcGVcbiAgICB0aGlzLmNvbnRleHRTaGFwZS51cGRhdGUoXG4gICAgICB0aGlzLl9yZW5kZXJpbmdDb250ZXh0LFxuICAgICAgdGhpcy50aW1lQ29udGV4dCxcbiAgICAgIDBcbiAgICApO1xuXG4gICAgLy8gZGVidWcgY29udGV4dFxuICAgIGlmICh0aGlzLnBhcmFtcy5kZWJ1Zykge1xuICAgICAgdGhpcy4kZGVidWdSZWN0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHdpZHRoKTtcbiAgICAgIHRoaXMuJGRlYnVnUmVjdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIHVwZGF0ZXMgdGhlIFNoYXBlcyB3aGljaCBiJGVsb25ncyB0byB0aGUgbGF5ZXJcbiAgICogIEBwYXJhbSBpdGVtIHtET01FbGVtZW50fVxuICAgKi9cbiAgdXBkYXRlU2hhcGVzKCRpdGVtID0gbnVsbCkge1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcblxuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLl9yZW5kZXJpbmdDb250ZXh0O1xuICAgIGNvbnN0IGl0ZW1zID0gJGl0ZW0gIT09IG51bGwgPyB0aGlzLl8kaXRlbUQzU2VsZWN0aW9uTWFwLmdldCgkaXRlbSkgOiB0aGlzLmQzaXRlbXM7XG4gICAgLy8gdXBkYXRlIGNvbW1vbiBzaGFwZXNcbiAgICB0aGlzLl8kaXRlbUNvbW1vblNoYXBlTWFwLmZvckVhY2goKHNoYXBlLCAkaXRlbSkgPT4ge1xuICAgICAgc2hhcGUudXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIHRoaXMuZGF0YSk7XG4gICAgfSk7XG5cbiAgICAvLyBkMyB1cGRhdGUgLSBlbnRpdHkgb3IgY29sbGVjdGlvbiBzaGFwZXNcbiAgICBpdGVtcy5lYWNoKGZ1bmN0aW9uKGRhdHVtLCBpbmRleCkge1xuICAgICAgY29uc3Qgc2hhcGUgPSB0aGF0Ll8kaXRlbVNoYXBlTWFwLmdldCh0aGlzKTtcbiAgICAgIHNoYXBlLnVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgaW5kZXgpO1xuICAgIH0pO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuIiwiaW1wb3J0IHNjYWxlcyBmcm9tICcuLi91dGlscy9zY2FsZXMnO1xuXG5cbi8qKlxuICogIEBjbGFzcyBWaWV3VGltZUNvbnRleHRcbiAqXG4gKiAgQSBWaWV3VGltZUNvbnRleHQgaW5zdGFuY2UgcmVwcmVzZW50cyB0aGUgbWFwcGluZyBiZXR3ZWVuIHRoZSB0aW1lIGFuZCB0aGUgcGl4ZWwgZG9tYWluc1xuICpcbiAqICBUaGUgYFRpbWVsaW5lVGltZUNvbnRleHRgIGhhcyAzIGltcG9ydGFudCBhdHRyaWJ1dGVzOlxuICogIC0gYHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsYCB3aGljaCBkZWZpbmVzIHRoZSB0aW1lIHRvIHBpeGVsIHRyYW5zZmVydCBmdW5jdGlvbiwgaXRzZWxmIGRlZmluZWQgYnkgdGhlIGBwaXhlbHNQZXJTZWNvbmRgIGF0dHJpYnV0ZSBvZiB0aGUgdGltZWxpbmVcbiAqICAtIGB0aW1lQ29udGV4dC5vZmZzZXRgIGRlZmluZXMgYSBkZWNheSAoaW4gdGltZSBkb21haW4pIGFwcGxpZWQgdG8gYWxsIHRoZSB2aWV3cyBvbiB0aGUgdGltZWxpbmUuIFRoaXMgYWxsb3cgdG8gbmF2aWdhdGUgaW5zaWRlIHZpc2libGVEdXJhdGlvbnMgbG9uZ2VyIHRoYW4gd2hhdCBjYW4gYmUgcmVwcmVzZW50ZWQgaW4gTGF5ZXJzICh2aWV3cykgY29udGFpbmVycyAoZS5nLiBob3Jpem9udGFsIHNjcm9sbClcbiAqICAtIGB0aW1lQ29udGV4dC56b29tYCBkZWZpbmVzIHRoZSB6b29tIGZhY3RvciBhcHBseWVkIHRvIHRoZSB0aW1lbGluZVxuICpcbiAqICBJdCBhbHNvIG1haW50YWlucyBhbiBoZWxwZXIgKGB2aXNpYmxlRHVyYXRpb25gKSB3aGljaCByZXByZXNlbnQgaG93IG11Y2ggdGltZSB0aGUgYHRyYWNrc2AgYXJlIGRpc3BsYXlpbmdcbiAqXG4gKiAgSXQgYWxzbyBtYWludGFpbiBhbiBhcnJheSBvZiByZWZlcmVuY2VzIHRvIGFsbCB0aGUgTGF5ZXJUaW1lQ29udGV4dCBhdHRhY2hlZCB0byB0aGUgdGltZWxpbmUgdG8gcHJvcGFnYXRlIGNoYW5nZXMgb24gdGhlIHRpbWUgdG8gcGl4ZWwgcmVwcmVzZW50YXRpb25cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWxpbmVUaW1lQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKHBpeGVsc1BlclNlY29uZCwgdmlzaWJsZVdpZHRoKSB7XG4gICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcblxuICAgIC8vIEByZW5hbWUgdG8gdGltZVRvUGl4ZWxcbiAgICB0aGlzLl90aW1lVG9QaXhlbCA9IG51bGw7XG4gICAgLy8gdGhpcy5fb3JpZ2luYWxYU2NhbGUgPSBudWxsO1xuXG4gICAgdGhpcy5fb2Zmc2V0ID0gMDtcbiAgICB0aGlzLl96b29tID0gMTtcbiAgICB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZCA9IHBpeGVsc1BlclNlY29uZDtcbiAgICAvLyBwYXJhbXNcbiAgICB0aGlzLl92aXNpYmxlV2lkdGggPSB2aXNpYmxlV2lkdGg7XG4gICAgdGhpcy5fdmlzaWJsZUR1cmF0aW9uID0gdGhpcy52aXNpYmxlV2lkdGggLyB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZDtcbiAgICB0aGlzLl9tYWludGFpblZpc2libGVEdXJhdGlvbiA9IGZhbHNlO1xuXG4gICAgLy8gY3JlYXRlIHRoZSB0aW1lVG9QaXhlbCBzY2FsZVxuICAgIGNvbnN0IHNjYWxlID0gc2NhbGVzLmxpbmVhcigpXG4gICAgICAuZG9tYWluKFswLCAxXSlcbiAgICAgIC5yYW5nZShbMCwgcGl4ZWxzUGVyU2Vjb25kXSk7XG5cbiAgICB0aGlzLnRpbWVUb1BpeGVsID0gc2NhbGU7XG4gICAgLy8gdGhpcy5vcmlnaW5hbFhTY2FsZSA9IHRoaXMudGltZVRvUGl4ZWwuY29weSgpO1xuXG4gICAgdGhpcy5fb3JpZ2luYWxQaXhlbHNQZXJTZWNvbmQgPSB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZDtcbiAgfVxuXG4gIGdldCBwaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgc2V0IHBpeGVsc1BlclNlY29uZCh2YWx1ZSkge1xuICAgIHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kID0gdmFsdWUgKiB0aGlzLnpvb207XG4gICAgdGhpcy5fb3JpZ2luYWxQaXhlbHNQZXJTZWNvbmQgPSB2YWx1ZTtcbiAgICB0aGlzLl91cGRhdGVUaW1lVG9QaXhlbFJhbmdlKCk7XG5cbiAgICAvLyBmb3JjZSBjaGlsZHJlbiBzY2FsZSB1cGRhdGVcbiAgICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICBpZiAoIWNoaWxkLl90aW1lVG9QaXhlbCkgeyByZXR1cm47IH1cbiAgICAgIGNoaWxkLnN0cmV0Y2hSYXRpbyA9IGNoaWxkLnN0cmV0Y2hSYXRpbztcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBjb21wdXRlZFBpeGVsc1BlclNlY29uZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICBnZXQgb2Zmc2V0KCkge1xuICAgIHJldHVybiB0aGlzLl9vZmZzZXQ7XG4gIH1cblxuICBzZXQgb2Zmc2V0KHZhbHVlKSB7XG4gICAgdGhpcy5fb2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgem9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy5fem9vbTtcbiAgfVxuXG4gIHNldCB6b29tKHZhbHVlKSB7XG4gICAgLy8gQ29tcHV0ZSBjaGFuZ2UgdG8gcHJvcGFnYXRlIHRvIGNoaWxkcmVuIHdobyBoYXZlIHRoZWlyIG93biB0aW1lVG9QaXhlbFxuICAgIGNvbnN0IHJhdGlvQ2hhbmdlID0gdmFsdWUgLyB0aGlzLl96b29tO1xuICAgIHRoaXMuX3pvb20gPSB2YWx1ZTtcbiAgICB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZCA9IHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kICogdmFsdWU7XG4gICAgdGhpcy5fdXBkYXRlVGltZVRvUGl4ZWxSYW5nZSgpO1xuXG4gICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgaWYgKCFjaGlsZC5fdGltZVRvUGl4ZWwpIHsgcmV0dXJuOyB9XG4gICAgICBjaGlsZC5zdHJldGNoUmF0aW8gPSBjaGlsZC5zdHJldGNoUmF0aW8gKiByYXRpb0NoYW5nZTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCB2aXNpYmxlV2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Zpc2libGVXaWR0aDtcbiAgfVxuXG4gIHNldCB2aXNpYmxlV2lkdGgodmFsdWUpIHtcbiAgICBjb25zdCB3aWR0aFJhdGlvID0gdmFsdWUgLyB0aGlzLnZpc2libGVXaWR0aDtcblxuICAgIHRoaXMuX3Zpc2libGVXaWR0aCA9IHZhbHVlO1xuICAgIHRoaXMuX3Zpc2libGVEdXJhdGlvbiA9IHRoaXMudmlzaWJsZVdpZHRoIC8gdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQ7XG5cbiAgICBpZiAodGhpcy5tYWludGFpblZpc2libGVEdXJhdGlvbikge1xuICAgICAgdGhpcy5waXhlbHNQZXJTZWNvbmQgPSB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZCAqIHdpZHRoUmF0aW87XG4gICAgfVxuICB9XG5cbiAgLyoqIEByZWFkb25seSAqL1xuICBnZXQgdmlzaWJsZUR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl92aXNpYmxlRHVyYXRpb247XG4gIH1cblxuICBnZXQgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX21haW50YWluVmlzaWJsZUR1cmF0aW9uO1xuICB9XG5cbiAgc2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKGJvb2wpIHtcbiAgICB0aGlzLl9tYWludGFpblZpc2libGVEdXJhdGlvbiA9IGJvb2w7XG4gIH1cblxuICBnZXQgdGltZVRvUGl4ZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RpbWVUb1BpeGVsO1xuICB9XG5cbiAgc2V0IHRpbWVUb1BpeGVsKHNjYWxlKSB7XG4gICAgdGhpcy5fdGltZVRvUGl4ZWwgPSBzY2FsZTtcbiAgfVxuXG4gIF91cGRhdGVUaW1lVG9QaXhlbFJhbmdlKCkge1xuICAgIHRoaXMuX3Zpc2libGVEdXJhdGlvbiA9IHRoaXMudmlzaWJsZVdpZHRoIC8gdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQ7XG4gICAgdGhpcy50aW1lVG9QaXhlbC5yYW5nZShbMCwgdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmRdKTtcbiAgfVxufVxuIiwiaW1wb3J0IGV2ZW50cyBmcm9tICdldmVudHMnO1xuXG5pbXBvcnQgS2V5Ym9hcmQgZnJvbSAnLi4vaW50ZXJhY3Rpb25zL2tleWJvYXJkJztcbmltcG9ydCBMYXllclRpbWVDb250ZXh0IGZyb20gJy4vbGF5ZXItdGltZS1jb250ZXh0JztcbmltcG9ydCBTdXJmYWNlIGZyb20gJy4uL2ludGVyYWN0aW9ucy9zdXJmYWNlJztcbmltcG9ydCBUaW1lbGluZVRpbWVDb250ZXh0IGZyb20gJy4vdGltZWxpbmUtdGltZS1jb250ZXh0JztcbmltcG9ydCBUcmFjayBmcm9tICcuL3RyYWNrJztcbmltcG9ydCBUcmFja0NvbGxlY3Rpb24gZnJvbSAnLi90cmFjay1jb2xsZWN0aW9uJztcblxuXG4vKipcbiAqIFRoZSBgdGltZWxpbmVgIGlzIHRoZSBtYWluIGVudHJ5IHBvaW50IG9mIGEgdGVtcG9yYWwgdmlzdWFsaXphdGlvbiwgaXQ6XG4gKiAtIGNvbnRhaW5zIGZhY3RvcmllcyB0byBtYW5hZ2UgaXRzIGB0cmFja3NgIGFuZCBgbGF5ZXJzYCxcbiAqIC0gZ2V0IG9yIHNldCB0aGUgdmlldyB3aW5kb3cgb3ZlcnMgaXRzIGB0cmFja3NgIHRocm91Z2ggYG9mZnNldGAsIGB6b29tYCwgICogYHBpeGVsc1BlclNlY29uZGAsIGB2aXNpYmxlV2lkdGhgLFxuICogLSBpcyB0aGUgY2VudHJhbCBodWIgZm9yIGFsbCB1c2VyIGludGVyYWN0aW9uIGV2ZW50cyAoa2V5Ym9hcmQsIG1vdXNlKSxcbiAqIC0gaG9sZHMgdGhlIGN1cnJlbnQgaW50ZXJhY3Rpb24gYHN0YXRlYCB3aGljaCBkZWZpbmVzIGhvdyB0aGUgZGlmZmVyZW50IHRpbWVsaW5lIGVsZW1lbnRzICh0cmFja3MsIGxheWVycywgc2hhcGVzKSByZXNwb25kIHRvIHVzZXIgaW50ZXJhY3Rpb25zLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lbGluZSBleHRlbmRzIGV2ZW50cy5FdmVudEVtaXR0ZXIge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgVGltZWxpbmVgIGluc3RhbmNlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwaXhlbHNQZXJTZWNvbmQgPSAxMDAsIHZpc2libGVXaWR0aCA9IDEwMDAsIHtcbiAgICByZWdpc3RlcktleWJvYXJkID0gdHJ1ZVxuICB9ID0ge30pIHtcblxuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLl90cmFja3MgPSBuZXcgVHJhY2tDb2xsZWN0aW9uKHRoaXMpO1xuICAgIHRoaXMuX3N0YXRlID0gbnVsbDtcblxuICAgIC8vIGRlZmF1bHQgaW50ZXJhY3Rpb25zXG4gICAgdGhpcy5fc3VyZmFjZUN0b3IgPSBTdXJmYWNlO1xuICAgIGlmIChyZWdpc3RlcktleWJvYXJkKSB7XG4gICAgICB0aGlzLmNyZWF0ZUludGVyYWN0aW9uKEtleWJvYXJkLCBkb2N1bWVudC5ib2R5KTtcbiAgICB9XG5cbiAgICAvLyBzdG9yZXNcbiAgICB0aGlzLl90cmFja0J5SWQgPSB7fTtcbiAgICB0aGlzLl9ncm91cGVkTGF5ZXJzID0ge307XG5cbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbmV3IFRpbWVsaW5lVGltZUNvbnRleHQocGl4ZWxzUGVyU2Vjb25kLCB2aXNpYmxlV2lkdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqICBUaW1lQ29udGV4dCBhY2Nlc3NvcnNcbiAgICovXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQub2Zmc2V0O1xuICB9XG5cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQub2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgem9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC56b29tO1xuICB9XG5cbiAgc2V0IHpvb20odmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0Lnpvb20gPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBwaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQucGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgc2V0IHBpeGVsc1BlclNlY29uZCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQucGl4ZWxzUGVyU2Vjb25kID0gdmFsdWU7XG4gIH1cblxuICBnZXQgdmlzaWJsZVdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnZpc2libGVXaWR0aDtcbiAgfVxuXG4gIHNldCB2aXNpYmxlV2lkdGgodmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnZpc2libGVXaWR0aCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHRpbWVUb1BpeGVsKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsO1xuICB9XG5cbiAgLyoqXG4gICAqICBAcmVhZG9ubHlcbiAgICovXG4gIGdldCB2aXNpYmxlRHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQudmlzaWJsZUR1cmF0aW9uO1xuICB9XG5cbiAgLy8gQE5PVEUgbWF5YmUgZXhwb3NlIGFzIHB1YmxpYyBpbnN0ZWFkIG9mIGdldC9zZXQgZm9yIG5vdGhpbmcuLi5cbiAgc2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKGJvb2wpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0Lm1haW50YWluVmlzaWJsZUR1cmF0aW9uID0gYm9vbDtcbiAgfVxuXG4gIGdldCBtYWludGFpblZpc2libGVEdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5tYWludGFpblZpc2libGVEdXJhdGlvbjtcbiAgfVxuXG4gIC8vIEByZWFkb25seSAtIHVzZWQgaW4gdHJhY2sgY29sbGVjdGlvblxuICBnZXQgZ3JvdXBlZExheWVycygpIHtcbiAgICByZXR1cm4gdGhpcy5fZ3JvdXBlZExheWVycztcbiAgfVxuXG4gIC8qKlxuICAgKiAgT3ZlcnJpZGUgdGhlIGRlZmF1bHQgU3VyZmFjZSB0aGF0IGlzIGluc3RhbmNpYXRlZCBvbiBlYWNoXG4gICAqICBAcGFyYW0ge0V2ZW50U291cmNlfSBjdG9yIC0gdGhlIGNvbnN0cnVjdG9yIHRvIHVzZSB0byBidWlsZCBzdXJmYWNlc1xuICAgKi9cbiAgY29uZmlndXJlU3VyZmFjZShjdG9yKSB7XG4gICAgdGhpcy5fc3VyZmFjZUN0b3IgPSBjdG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIEZhY3RvcnkgbWV0aG9kIHRvIGFkZCBpbnRlcmFjdGlvbiBtb2R1bGVzIHRoZSB0aW1lbGluZSBzaG91bGQgbGlzdGVuIHRvLlxuICAgKiBCeSBkZWZhdWx0LCB0aGUgdGltZWxpbmUgbGlzdGVuIHRvIEtleWJvYXJkLCBhbmQgaW5zdGFuY2lhdGUgYSBgU3VyZmFjZWAgb24gZWFjaCBjb250YWluZXIuXG4gICAqIENhbiBiZSB1c2VkIHRvIGluc3RhbGwgYW55IGludGVyYWN0aW9uIGltcGxlbWVudGluZyB0aGUgYEV2ZW50U291cmNlYCBpbnRlcmZhY2VcbiAgICogQHBhcmFtIHtFdmVudFNvdXJjZX0gY3RvciAtIHRoZSBjb250cnVjdG9yIG9mIHRoZSBpbnRlcmFjdGlvbiBtb2R1bGUgdG8gaW5zdGFuY2lhdGVcbiAgICogQHBhcmFtIGVsIHtET01FbGVtZW50fSB0aGUgRE9NIGVsZW1lbnQgdG8gYmluZCB0byB0aGUgRXZlbnRTb3VyY2UgbW9kdWxlXG4gICAqIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IG9wdGlvbnMgdG8gYmUgYXBwbGllZCB0byB0aGUgY3RvciAoZGVmYXVsdHMgdG8gYHt9YClcbiAgICovXG4gIGNyZWF0ZUludGVyYWN0aW9uKGN0b3IsIGVsLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBpbnRlcmFjdGlvbiA9IG5ldyBjdG9yKGVsLCBvcHRpb25zKTtcbiAgICBpbnRlcmFjdGlvbi5vbignZXZlbnQnLCAoZSkgPT4gdGhpcy5faGFuZGxlRXZlbnQoZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjYWxsYmFjayB0aGF0IGlzIHVzZWQgdG8gbGlzdGVuIHRvIGludGVyYWN0aW9ucyBtb2R1bGVzXG4gICAqIEBwYXJhbXMge0V2ZW50fSBlIC0gYSBjdXN0b20gZXZlbnQgZ2VuZXJhdGVkIGJ5IGludGVyYWN0aW9uIG1vZHVsZXNcbiAgICovXG4gIF9oYW5kbGVFdmVudChlKSB7XG4gICAgLy8gZW1pdCBldmVudCBhcyBhIG1pZGRsZXdhcmVcbiAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZSk7XG4gICAgLy8gcHJvcGFnYXRlIHRvIHRoZSBzdGF0ZVxuICAgIGlmICghdGhpcy5fc3RhdGUpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5fc3RhdGUuaGFuZGxlRXZlbnQoZSk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBDaGFuZ2VzIHRoZSBzdGF0ZSBvZiB0aGUgdGltZWxpbmVcbiAgICogQHBhcmFtIHtCYXNlU3RhdGV9IHN0YXRlIC0gdGhlIHN0YXRlIGluIHdoaWNoIHRoZSB0aW1lbGluZSBtdXN0IGJlIHNldHRlZFxuICAgKi9cbiAgc2V0IHN0YXRlKHN0YXRlKSB7XG4gICAgaWYgKHRoaXMuX3N0YXRlKSB7IHRoaXMuX3N0YXRlLmV4aXQoKTsgfVxuICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgdGhpcy5fc3RhdGUuZW50ZXIoKTtcbiAgfVxuXG4gIGdldCBzdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogIFNob3J0Y3V0IHRvIGFjY2VzcyB0aGUgVHJhY2sgY29sbGVjdGlvblxuICAgKiAgQHJldHVybiB7VHJhY2tDb2xsZWN0aW9ufVxuICAgKi9cbiAgZ2V0IHRyYWNrcygpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhY2tzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3J0Y3V0IHRvIGFjY2VzcyB0aGUgTGF5ZXIgbGlzdFxuICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICovXG4gIGdldCBsYXllcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYWNrcy5sYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHRyYWNrIHRvIHRoZSB0aW1lbGluZVxuICAgKiBUcmFja3MgZGlzcGxheSBhIHZpZXcgd2luZG93IG9uIHRoZSB0aW1lbGluZSBpbiB0aGVpcnMgb3duIFNWRyBlbGVtZW50LlxuICAgKiBAcGFyYW0ge1RyYWNrfSB0cmFja1xuICAgKi9cbiAgYWRkKHRyYWNrKSB7XG4gICAgaWYgKHRoaXMudHJhY2tzLmluZGV4T2YodHJhY2spICE9PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd0cmFjayBhbHJlYWR5IGFkZGVkIHRvIHRoZSB0aW1lbGluZScpO1xuICAgIH1cblxuICAgIHRyYWNrLmNvbmZpZ3VyZSh0aGlzLnRpbWVDb250ZXh0KTtcblxuICAgIHRoaXMudHJhY2tzLnB1c2godHJhY2spO1xuICAgIHRoaXMuY3JlYXRlSW50ZXJhY3Rpb24odGhpcy5fc3VyZmFjZUN0b3IsIHRyYWNrLiRlbCk7XG4gIH1cblxuICAvKipcbiAgICogIFJlbW92ZXMgYSB0cmFjayBmcm9tIHRoZSB0aW1lbGluZVxuICAgKiAgQFRPRE9cbiAgICovXG4gIHJlbW92ZSh0cmFjaykge1xuICAgIC8vIHNob3VsZCBkZXN0cm95IGludGVyYWN0aW9uIHRvbywgYXZvaWQgZ2hvc3QgZXZlbnRMaXN0ZW5lcnNcbiAgfVxuXG4gIC8qKlxuICAgKiAgQ3JlYXRlcyBhIG5ldyB0cmFjayBmcm9tIHRoZSBjb25maWd1cmF0aW9uIGRlZmluZSBpbiBgY29uZmlndXJlVHJhY2tzYFxuICAgKiAgQHBhcmFtIHtET01FbGVtZW50fSAkZWwgLSB0aGUgZWxlbWVudCB0byBpbnNlcnQgdGhlIHRyYWNrIGluc2lkZVxuICAgKiAgQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBvdmVycmlkZSB0aGUgZGVmYXVsdHMgb3B0aW9ucyBpZiBuZWNlc3NhcnlcbiAgICogIEBwYXJhbSB7U3RyaW5nfSBbdHJhY2tJZD1udWxsXSAtIG9wdGlvbm5hbCBpZCB0byBnaXZlIHRvIHRoZSB0cmFjaywgb25seSBleGlzdHMgaW4gdGltZWxpbmUncyBjb250ZXh0XG4gICAqICBAcmV0dXJuIHtUcmFja31cbiAgICovXG4gIGNyZWF0ZVRyYWNrKCRlbCwgdHJhY2tIZWlnaHQgPSAxMDAsIHRyYWNrSWQgPSBudWxsKSB7XG4gICAgY29uc3QgdHJhY2sgPSBuZXcgVHJhY2soJGVsLCB0cmFja0hlaWdodCk7XG5cbiAgICBpZiAodHJhY2tJZCAhPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuX3RyYWNrQnlJZFt0cmFja0lkXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgdHJhY2tJZDogXCIke3RyYWNrSWR9XCIgaXMgYWxyZWFkeSB1c2VkYCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3RyYWNrQnlJZFt0cmFja0lkXSA9IHRyYWNrO1xuICAgIH1cblxuICAgIC8vIEFkZCB0cmFjayB0byB0aGUgdGltZWxpbmVcbiAgICB0aGlzLmFkZCh0cmFjayk7XG4gICAgdHJhY2sucmVuZGVyKCk7XG4gICAgdHJhY2sudXBkYXRlKCk7XG5cbiAgICByZXR1cm4gdHJhY2s7XG4gIH1cblxuICAvKipcbiAgICogIEFkZHMgYSBsYXllciB0byBhIHRyYWNrLCBhbGxvdyB0byBncm91cCB0cmFjayBhcmJpdHJhcmlseSBpbnNpZGUgZ3JvdXBzLiBCYXNpY2FsbHkgYSB3cmFwcGVyIGZvciBgdHJhY2suYWRkKGxheWVyKWBcbiAgICogIEBwYXJhbSB7TGF5ZXJ9IGxheWVyIC0gdGhlIGxheWVyIHRvIGFkZFxuICAgKiAgQHBhcmFtIHtUcmFja30gdHJhY2sgLSB0aGUgdHJhY2sgdG8gdGhlIGluc2VydCB0aGUgbGF5ZXIgaW5cbiAgICogIEBwYXJhbSB7U3RyaW5nfSBbZ3JvdXBJZD0nZGVmYXVsdCddIC0gdGhlIGdyb3VwIGluIHdoaWNoIGFzc29jaWF0ZSB0aGUgbGF5ZXJcbiAgICovXG4gIGFkZExheWVyKGxheWVyLCB0cmFja09yVHJhY2tJZCwgZ3JvdXBJZCA9ICdkZWZhdWx0Jykge1xuICAgIGxldCB0cmFjayA9IHRyYWNrT3JUcmFja0lkO1xuXG4gICAgaWYgKHR5cGVvZiB0cmFja09yVHJhY2tJZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRyYWNrID0gdGhpcy5nZXRUcmFja0J5SWQodHJhY2tPclRyYWNrSWQpO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZXMgdGhlIGBMYXllclRpbWVDb250ZXh0YCBpZiBub3QgcHJlc2VudFxuICAgIGlmICghbGF5ZXIudGltZUNvbnRleHQpIHtcbiAgICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gbmV3IExheWVyVGltZUNvbnRleHQodGhpcy50aW1lQ29udGV4dCk7XG4gICAgICBsYXllci5zZXRUaW1lQ29udGV4dCh0aW1lQ29udGV4dCk7XG4gICAgfVxuXG4gICAgLy8gd2Ugc2hvdWxkIGhhdmUgYSBUcmFjayBpbnN0YW5jZSBhdCB0aGlzIHBvaW50XG4gICAgdHJhY2suYWRkKGxheWVyKTtcblxuICAgIGlmICghdGhpcy5fZ3JvdXBlZExheWVyc1tncm91cElkXSkge1xuICAgICAgdGhpcy5fZ3JvdXBlZExheWVyc1tncm91cElkXSA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF0ucHVzaChsYXllcik7XG5cbiAgICBsYXllci5yZW5kZXIoKTtcbiAgICBsYXllci51cGRhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgUmVtb3ZlcyBhIGxheWVyIGZyb20gaXRzIHRyYWNrICh0aGUgbGF5ZXIgaXMgZGV0YXRjaGVkIGZyb20gdGhlIERPTSBidXQgY2FuIHN0aWxsIGJlIHJldXNlZClcbiAgICogIEBwYXJhbSB7TGF5ZXJ9IGxheWVyIC0gdGhlIGxheWVyIHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlTGF5ZXIobGF5ZXIpIHtcbiAgICB0aGlzLnRyYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKHRyYWNrKSB7XG4gICAgICBjb25zdCBpbmRleCA9IHRyYWNrLmxheWVycy5pbmRleE9mKGxheWVyKTtcbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHsgdHJhY2sucmVtb3ZlKGxheWVyKTsgfVxuICAgIH0pO1xuXG4gICAgLy8gY2xlYW4gcmVmZXJlbmNlcyBpbiBoZWxwZXJzXG4gICAgZm9yIChsZXQgZ3JvdXBJZCBpbiB0aGlzLl9ncm91cGVkTGF5ZXJzKSB7XG4gICAgICBjb25zdCBncm91cCA9IHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF07XG4gICAgICBjb25zdCBpbmRleCA9IGdyb3VwLmluZGV4T2YobGF5ZXIpO1xuXG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7IGdyb3VwLnNwbGljZShsYXllciwgMSk7IH1cblxuICAgICAgaWYgKCFncm91cC5sZW5ndGgpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBSZXR1cm5zIGEgdHJhY2sgZnJvbSBpdCdzIGlkXG4gICAqICBAcGFyYW0ge1N0cmluZ30gdHJhY2tJZFxuICAgKiAgQHJldHVybiB7VHJhY2t9XG4gICAqL1xuICBnZXRUcmFja0J5SWQodHJhY2tJZCkge1xuICAgIHJldHVybiB0aGlzLl90cmFja0J5SWRbdHJhY2tJZF07XG4gIH1cblxuICAvKipcbiAgICogIFJldHVybnMgdGhlIHRyYWNrIGNvbnRhaW5pbmcgYSBnaXZlbiBET00gRWxlbWVudCwgaWYgbm8gbWF0Y2ggZm91bmQgcmV0dXJuIG51bGxcbiAgICogIEBwYXJhbSB7RE9NRWxlbWVudH0gJGVsXG4gICAqICBAcmV0dXJuIHtUcmFja3xudWxsfVxuICAgKi9cbiAgZ2V0VHJhY2tGcm9tRE9NRWxlbWVudCgkZWwpIHtcbiAgICBsZXQgJHN2ZyA9IG51bGw7XG4gICAgbGV0IHRyYWNrID0gbnVsbDtcbiAgICAvLyBmaW5kIHRoZSBjbG9zZXN0IGAudHJhY2tgIGVsZW1lbnRcbiAgICBkbyB7XG4gICAgICBpZiAoJGVsLmNsYXNzTGlzdC5jb250YWlucygndHJhY2snKSkge1xuICAgICAgICAkc3ZnID0gJGVsO1xuICAgICAgfVxuICAgICAgJGVsID0gJGVsLnBhcmVudE5vZGU7XG4gICAgfSB3aGlsZSAoJHN2ZyA9PT0gbnVsbCk7XG4gICAgLy8gZmluZCB0aGUgcmVsYXRlZCBgVHJhY2tgXG4gICAgdGhpcy50cmFja3MuZm9yRWFjaChmdW5jdGlvbihfdHJhY2spIHtcbiAgICAgIGlmIChfdHJhY2suJHN2ZyA9PT0gJHN2ZykgeyB0cmFjayA9IF90cmFjazsgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRyYWNrO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgbGF5ZXJzIGZyb20gdGhlaXIgZ3JvdXAgSWRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGdyb3VwSWRcbiAgICogQHJldHVybiB7QXJyYXl9XG4gICAqL1xuICBnZXRMYXllcnNCeUdyb3VwKGdyb3VwSWQpIHtcbiAgICByZXR1cm4gdGhpcy5fZ3JvdXBlZExheWVyc1tncm91cElkXTtcbiAgfVxuXG4gICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICB5aWVsZCogdGhpcy50cmFja3NbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICB9XG59XG4iLCJpbXBvcnQgTGF5ZXIgZnJvbSAnLi9sYXllcic7XG5cblxuLyoqXG4gKiBUaGUgYFRyYWNrQ29sbGVjdGlvbmAgY2xhc3MgYWxsb3cgdG8gdXBkYXRlIGFsbCB0aW1lbGluZSdzIHRyYWNrcyBhdCBvbmNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNrQ29sbGVjdGlvbiBleHRlbmRzIEFycmF5IHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5fdGltZWxpbmUgPSB0aW1lbGluZTtcbiAgfVxuXG4gIC8vIEBUT0RPXG4gIC8vIHRoaXMgc2hvdWxkIGJlIGluIHRoZSB0aW1lbGluZVxuICBfZ2V0TGF5ZXJzT3JHcm91cHMobGF5ZXJPckdyb3VwID0gbnVsbCkge1xuICAgIGxldCBsYXllcnMgPSBudWxsO1xuXG4gICAgaWYgKHR5cGVvZiBsYXllck9yR3JvdXAgPT09ICdzdHJpbmcnKSB7XG4gICAgICBsYXllcnMgPSB0aGlzLl90aW1lbGluZS5ncm91cGVkTGF5ZXJzW2xheWVyT3JHcm91cF07XG4gICAgfSBlbHNlIGlmIChsYXllck9yR3JvdXAgaW5zdGFuY2VvZiBMYXllcikge1xuICAgICAgbGF5ZXJzID0gW2xheWVyT3JHcm91cF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxheWVycyA9IHRoaXMubGF5ZXJzO1xuICAgIH1cblxuICAgIHJldHVybiBsYXllcnM7XG4gIH1cblxuICAvLyBATk9URSBrZWVwIHRoaXMgP1xuICAvLyBjb3VsZCBwcmVwYXJlIHNvbWUgdmVydGljYWwgcmVzaXppbmcgYWJpbGl0eVxuICAvLyB0aGlzIHNob3VsZCBiZSBhYmxlIHRvIG1vZGlmeSB0aGUgbGF5ZXJzIHlTY2FsZSB0byBiZSByZWFsbHkgdXNlZnVsbFxuXG4gIHNldCBoZWlnaHQodmFsdWUpIHtcbiAgICB0aGlzLmZvckVhY2goKHRyYWNrKSA9PiB0cmFjay5oZWlnaHQgPSB2YWx1ZSk7XG4gIH1cblxuICAvLyBhY2Nlc3MgbGF5ZXJzXG4gIGdldCBsYXllcnMoKSB7XG4gICAgbGV0IGxheWVycyA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaCgodHJhY2spID0+IGxheWVycyA9IGxheWVycy5jb25jYXQodHJhY2subGF5ZXJzKSk7XG5cbiAgICByZXR1cm4gbGF5ZXJzO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHRoaXMuZm9yRWFjaCgodHJhY2spID0+IHRyYWNrLnJlbmRlcigpKTtcbiAgICB0aGlzLl90aW1lbGluZS5lbWl0KCdyZW5kZXInKTtcbiAgfVxuXG4gIC8vIHNob3VsZCBiZSB1cGRhdGUoLi4ubGF5ZXJzT3JHcm91cHMpXG4gIHVwZGF0ZShsYXllck9yR3JvdXApIHtcbiAgICBjb25zdCBsYXllcnMgPSB0aGlzLl9nZXRMYXllcnNPckdyb3VwcyhsYXllck9yR3JvdXApO1xuICAgIHRoaXMuZm9yRWFjaCgodHJhY2spID0+IHRyYWNrLnVwZGF0ZShsYXllcnMpKTtcbiAgICB0aGlzLl90aW1lbGluZS5lbWl0KCd1cGRhdGUnLCBsYXllcnMpO1xuICB9XG5cbiAgdXBkYXRlQ29udGFpbmVyKHRyYWNrT3JUcmFja0lkcykge1xuICAgIHRoaXMuZm9yRWFjaCgodHJhY2spID0+IHRyYWNrLnVwZGF0ZUNvbnRhaW5lcigpKTtcbiAgICB0aGlzLl90aW1lbGluZS5lbWl0KCd1cGRhdGU6Y29udGFpbmVycycpO1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJzKGxheWVyT3JHcm91cCkge1xuICAgIGNvbnN0IGxheWVycyA9IHRoaXMuX2dldExheWVyc09yR3JvdXBzKGxheWVyT3JHcm91cCk7XG4gICAgdGhpcy5mb3JFYWNoKCh0cmFjaykgPT4gdHJhY2sudXBkYXRlTGF5ZXJzKGxheWVycykpO1xuICAgIHRoaXMuX3RpbWVsaW5lLmVtaXQoJ3VwZGF0ZTpsYXllcnMnLCBsYXllcnMpO1xuICB9XG59XG4iLCJpbXBvcnQgbnMgZnJvbSAnLi9uYW1lc3BhY2UnO1xuXG5cbi8qKlxuKiBBcyBhIHRlbXBvcmFsIHJlcHJlc2VudGF0aW9uLCBhIHRyYWNrIGVzdGFibGlzaGVzIGEgcmVsYXRpb24gYmV0d2VlbiAqdGltZSogaW4gc2Vjb25kcyBhbmQgKnNwYWNlKiBpbiBwaXhlbHMuXG4qXG4qIEEgYFRyYWNrYCBpbnN0YW5jZSBjYW4gaGF2ZSBtdWx0aXBsZSBgTGF5ZXJgIGluc3RhbmNlcy5cbipcbiogVHJhY2tzIGluc2lkZSBhIHRpbWVsaW5lXG4qXG4qIEEgdGVtcG9yYWwgcmVwcmVzZW50YXRpb24gY2FuIGJlIHJlbmRlcmVkIHVwb24gbXVsdGlwbGUgRE9NIGVsZW1lbnRzLCB0aGUgdHJhY2tzIChlZyBtdWx0aXBsZSA8bGk+IGZvciBhIERBVyBsaWtlIHJlcHJlc2VudGF0aW9uKSB0aGF0IGJlbG9uZyB0byB0aGUgc2FtZSB0aW1lbGluZSB1c2luZyB0aGUgYGFkZGAgbWV0aG9kLiBUaGVzZSB0cmFja3MgYXJlIGxpa2Ugd2luZG93cyBvbiB0aGUgb3ZlcmFsbCBhbmQgYmFzaWNhbGx5IHVuZW5kaW5nIHRpbWVsaW5lLlxuKlxuKiBBIHRpbWVsaW5lIHdpdGggMyB0cmFja3M6XG4qXG4qICstLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0tIC0gLSAgLSAgLSAgIC1cbiogfHRyYWNrIDEgICAgICAgICAgfHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh8XG4qICstLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0tIC0gLSAgLSAgLSAgIC1cbiogfHRyYWNrIDIgICAgICAgICAgfHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh8XG4qICstLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0tIC0gLSAgLSAgLSAgIC1cbiogfHRyYWNrIDMgICAgICAgICAgfHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh8XG4qICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0tIC0gLSAgLSAgLSAgIC1cbipcbiogKy0tLS0tLS0tLS0tLS0tLS0tPlxuKiB0aW1lbGluZS50aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aW1lbGluZS50aW1lQ29udGV4dC5vZmZzZXQpXG4qXG4qICAgICAgICAgICAgICAgICAgIDwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPlxuKiAgICAgICAgICAgICAgICAgICB0aW1lbGluZSdzIHRyYWNrcyBkZWZhdWx0cyB0byAxMDAwcHhcbiogICAgICAgICAgICAgICAgICAgd2l0aCBhIGRlZmF1bHQgcGl4ZWxzUGVyU2Vjb25kIG9mIDEwMHB4L3MuXG4qICAgICAgICAgICAgICAgICAgIGFuZCBhIGRlZmF1bHQgYHN0cmV0Y2hSYXRpbyA9IDFgXG4qICAgICAgICAgICAgICAgICAgIHRyYWNrMSBzaG93cyAxMCBzZWNvbmRzIG9mIHRoZSB0aW1lbGluZVxuKlxuKiBMYXllcnMgaW5zaWRlIGEgdHJhY2tcbipcbiogV2l0aGluIGEgdHJhY2ssIGEgYExheWVyYCBrZWVwcyB1cC10by1kYXRlIGFuZCByZW5kZXJzIHRoZSBkYXRhLiBUaGUgdHJhY2sncyBgYWRkYCBtZXRob2QgYWRkcyBhIGBMYXllcmAgaW5zdGFuY2UgdG8gYSB0cmFjay4gQSBMYXllclxuKlxuKiBUaGUgdHJhY2sgcmVuZGVyaW5nQ29udGV4dFxuKlxuKiBXaGVuIG9uZSBtb2RpZnkgdGhlIHRpbWVsaW5lIHJlbmRlcmluZ0NvbnRleHQ6XG4qIC0gdGltZWxpbmUucmVuZGVyaW5nQ29udGV4dC5vZmZzZXQgKGluIHNlY29uZHMpIG1vZGlmeSB0aGUgY29udGFpbmVycyB0cmFjayB4IHBvc2l0aW9uXG4qIC0gdGltZWxpbmUucmVuZGVyaW5nQ29udGV4dC5zdHJldGNoUmF0aW8gbW9kaWZ5IHRpbWVsaW5lJ3Mgem9vbVxuKiBFYWNoIHRpbWUgeW91IHNldCBuZXcgdmFsdWUgb2Ygb2Zmc2V0IG9yIHN0cmV0Y2hSYXRpbywgeW91IG5lZWQgdG8gZG8gYHRpbWVsaW5lLnVwZGF0ZSgpYCB0byB1cGRhdGUgdGhlIHZhbHVlcy5cbiogVHJhY2sgU1ZHIHN0cnVjdHVyZVxuKiA8c3ZnIGNsYXNzPVwidHJhY2tcIiB4bWxuczp4aHRtbD1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIiBoZWlnaHQ9XCIxMDBcIiBzaGFwZS1yZW5kZXJpbmc9XCJvcHRpbWl6ZVNwZWVkXCI+XG4qICA8ZGVmcz48L2RlZnM+IFVudXNlZCBmb3IgdGhlIG1vbWVudCwgY291bGQgYmUgdXNlZCB0byBkZWZpbmUgY3VzdG9tIHNoYXBlcyBmb3IgdXNlIHdpdGggbGF5ZXJzXG4qICA8cmVjdCBzdHlsZT1cImZpbGwtb3BhY2l0eTowXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiPjwvcmVjdD5cbiogIDxnIGNsYXNzPVwib2Zmc2V0XCI+XG4qICAgIDxnIGNsYXNzPVwibGF5b3V0XCI+PC9nPiBUaGUgbGF5ZXJzIGFyZSBpbnNlcnRlZCBoZXJlXG4qICA8L2c+XG4qICA8ZyBjbGFzcz1cImludGVyYWN0aW9uc1wiPjwvZz4gUGxhY2Vob2xkZXIgdG8gdmlzdWFsaXplIGludGVyYWN0aW9ucyAoZWcuIGJydXNoKVxuKiA8L3N2Zz5cbiovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNrIHtcbiAgY29uc3RydWN0b3IoJGVsLCBoZWlnaHQgPSAxMDApIHtcbiAgICB0aGlzLiRlbCA9ICRlbDtcbiAgICB0aGlzLmxheWVycyA9IFtdO1xuICAgIHRoaXMuX2hlaWdodCA9IGhlaWdodDtcblxuICAgIC8vIGFyZSBzZXQgd2hlbiBhZGRlZCB0byB0aGUgdGltZWxpbmVcbiAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQgPSBudWxsO1xuXG4gICAgdGhpcy5fY3JlYXRlQ29udGFpbmVyKCk7XG4gIH1cblxuICBnZXQgaGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gIH1cblxuICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgdGhpcy5faGVpZ2h0ID0gdmFsdWU7XG4gICAgLy8gQE5PVEU6IHByb3BhZ2F0ZSB0byBsYXllcnMsIGtlZXBpbmcgcmF0aW8gP1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCB3aGVuIHRoZSB0cmFjayBpcyBhZGRlZCB0byB0aGUgdGltZWxpbmVcbiAgICogVGhlIHRyYWNrIGNhbm5vdCBiZSB1cGRhdGVkIHdpdGhvdXQgYmVpbmcgYWRkZWQgdG8gYSB0aW1lbGluZVxuICAgKi9cbiAgY29uZmlndXJlKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQgPSByZW5kZXJpbmdDb250ZXh0O1xuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgYSB0cmFja1xuICAgKiBUaGUgbGF5ZXJzIGZyb20gdGhpcyB0cmFjayBjYW4gc3RpbGwgYmUgcmV1c2VkIGVsc2V3aGVyZVxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICAvLyBEZXRhY2ggZXZlcnl0aGluZyBmcm9tIHRoZSBET01cbiAgICB0aGlzLiRlbC5yZW1vdmVDaGlsZCh0aGlzLiRzdmcpO1xuICAgIHRoaXMubGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB0aGlzLiRsYXlvdXQucmVtb3ZlQ2hpbGQobGF5ZXIuJGVsKSk7XG4gICAgLy8gY2xlYW4gcmVmZXJlbmNlc1xuICAgIHRoaXMuJGVsID0gbnVsbDtcbiAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQgPSBudWxsO1xuICAgIHRoaXMubGF5ZXJzLmxlbmd0aCA9IDA7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgY29udGFpbmVyIGZvciB0aGUgdHJhY2tcbiAgICovXG4gIF9jcmVhdGVDb250YWluZXIoKSB7XG4gICAgY29uc3QgJHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3N2ZycpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdvcHRpbWl6ZVNwZWVkJyk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgdGhpcy5oZWlnaHQpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlKCd4bWxuczp4aHRtbCcsICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJyk7XG4gICAgJHN2Zy5jbGFzc0xpc3QuYWRkKCd0cmFjaycpO1xuXG4gICAgY29uc3QgJGJhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgJGJhY2tncm91bmQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgJzEwMCUnKTtcbiAgICAkYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3R5bGUnLCAnZmlsbC1vcGFjaXR5OjAnKTtcblxuICAgIGNvbnN0ICRkZWZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZGVmcycpO1xuXG4gICAgY29uc3QgJG9mZnNldEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICRvZmZzZXRHcm91cC5jbGFzc0xpc3QuYWRkKCdvZmZzZXQnKTtcblxuICAgIGNvbnN0ICRsYXlvdXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAkbGF5b3V0R3JvdXAuY2xhc3NMaXN0LmFkZCgnbGF5b3V0Jyk7XG5cbiAgICBjb25zdCAkaW50ZXJhY3Rpb25zR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgJGludGVyYWN0aW9uc0dyb3VwLmNsYXNzTGlzdC5hZGQoJ2ludGVyYWN0aW9ucycpO1xuXG4gICAgJHN2Zy5hcHBlbmRDaGlsZCgkZGVmcyk7XG4gICAgJHN2Zy5hcHBlbmRDaGlsZCgkYmFja2dyb3VuZCk7XG4gICAgJG9mZnNldEdyb3VwLmFwcGVuZENoaWxkKCRsYXlvdXRHcm91cCk7XG4gICAgJHN2Zy5hcHBlbmRDaGlsZCgkb2Zmc2V0R3JvdXApO1xuICAgICRzdmcuYXBwZW5kQ2hpbGQoJGludGVyYWN0aW9uc0dyb3VwKTtcblxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKCRzdmcpO1xuICAgIC8vIHJlbW92ZXMgYWRkaXRpb25uYWwgaGVpZ2h0IGFkZGVkIHdobyBrbm93cyB3aHkuLi5cbiAgICB0aGlzLiRlbC5zdHlsZS5mb250U2l6ZSA9IDA7XG4gICAgLy8gZml4ZXMgb25lIG9mIHRoZSAobWFueSA/KSB3ZWlyZCBjYW52YXMgcmVuZGVyaW5nIGJ1Z3MgaW4gQ2hyb21lXG4gICAgdGhpcy4kZWwuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVooMCknO1xuXG4gICAgdGhpcy4kbGF5b3V0ID0gJGxheW91dEdyb3VwO1xuICAgIHRoaXMuJG9mZnNldCA9ICRvZmZzZXRHcm91cDtcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMgPSAkaW50ZXJhY3Rpb25zR3JvdXA7XG4gICAgdGhpcy4kc3ZnID0gJHN2ZztcbiAgICB0aGlzLiRiYWNrZ3JvdW5kID0gJGJhY2tncm91bmQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGxheWVyIHRvIHRoZSB0cmFja1xuICAgKi9cbiAgYWRkKGxheWVyKSB7XG4gICAgdGhpcy5sYXllcnMucHVzaChsYXllcik7XG4gICAgLy8gQ3JlYXRlIGEgZGVmYXVsdCByZW5kZXJpbmdDb250ZXh0IGZvciB0aGUgbGF5ZXIgaWYgbWlzc2luZ1xuICAgIHRoaXMuJGxheW91dC5hcHBlbmRDaGlsZChsYXllci4kZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBsYXllclxuICAgKi9cbiAgcmVtb3ZlKGxheWVyKSB7XG4gICAgdGhpcy5sYXllcnMuc3BsaWNlKHRoaXMubGF5ZXJzLmluZGV4T2YobGF5ZXIpLCAxKTtcbiAgICAvLyBSZW1vdmVzIGxheWVyIGZyb20gaXRzIGNvbnRhaW5lclxuICAgIHRoaXMuJGxheW91dC5yZW1vdmVDaGlsZChsYXllci4kZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIERyYXcgdHJhY2tzLCBhbmQgdGhlIGxheWVycyBpbiBjYXNjYWRlXG4gICAqL1xuICByZW5kZXIoKSB7XG4gICAgZm9yIChsZXQgbGF5ZXIgb2YgdGhpcykgeyBsYXllci5yZW5kZXIoKTsgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgbGF5ZXJzXG4gICAqL1xuICB1cGRhdGUobGF5ZXJzID0gbnVsbCkge1xuICAgIHRoaXMudXBkYXRlQ29udGFpbmVyKCk7XG4gICAgdGhpcy51cGRhdGVMYXllcnMobGF5ZXJzKTtcbiAgfVxuXG4gIHVwZGF0ZUNvbnRhaW5lcigpIHtcbiAgICBjb25zdCAkc3ZnID0gdGhpcy4kc3ZnO1xuICAgIGNvbnN0ICRvZmZzZXQgPSB0aGlzLiRvZmZzZXQ7XG4gICAgLy8gU2hvdWxkIGJlIGluIHNvbWUgdXBkYXRlIGxheW91dFxuICAgIGNvbnN0IHJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLnJlbmRlcmluZ0NvbnRleHQ7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgY29uc3Qgd2lkdGggPSByZW5kZXJpbmdDb250ZXh0LnZpc2libGVXaWR0aDtcbiAgICBjb25zdCBvZmZzZXRYID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChyZW5kZXJpbmdDb250ZXh0Lm9mZnNldCk7XG4gICAgY29uc3QgdHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgke29mZnNldFh9LCAwKWA7XG5cbiAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3ZpZXdib3gnLCBgMCAwICR7d2lkdGh9ICR7aGVpZ2h0fWApO1xuXG4gICAgJG9mZnNldC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlKTtcbiAgfVxuXG4gIHVwZGF0ZUxheWVycyhsYXllcnMgPSBudWxsKSB7XG4gICAgbGF5ZXJzID0gKGxheWVycyA9PT0gbnVsbCkgPyB0aGlzLmxheWVycyA6IGxheWVycztcblxuICAgIGxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgaWYgKHRoaXMubGF5ZXJzLmluZGV4T2YobGF5ZXIpID09PSAtMSkgeyByZXR1cm47IH1cbiAgICAgIGxheWVyLnVwZGF0ZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHlpZWxkKiB0aGlzLmxheWVyc1tTeW1ib2wuaXRlcmF0b3JdKCk7XG4gIH1cbn1cbiIsImltcG9ydCBBbm5vdGF0ZWRNYXJrZXIgZnJvbSAnLi4vc2hhcGVzL2Fubm90YXRlZC1tYXJrZXInO1xuaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IE1hcmtlckJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9tYXJrZXItYmVoYXZpb3InO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFubm90YXRlZE1hcmtlckxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcignY29sbGVjdGlvbicsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShBbm5vdGF0ZWRNYXJrZXIpO1xuICAgIHRoaXMuc2V0QmVoYXZpb3IobmV3IE1hcmtlckJlaGF2aW9yKCkpO1xuICB9XG59XG4iLCJpbXBvcnQgQnJlYWtwb2ludEJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9icmVha3BvaW50LWJlaGF2aW9yJztcbmltcG9ydCBEb3QgZnJvbSAnLi4vc2hhcGVzL2RvdCc7XG5pbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgTGluZSBmcm9tICcuLi9zaGFwZXMvbGluZSc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJlYWtwb2ludExheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30sIGFjY2Vzc29ycyA9IHt9KSB7XG4gICAgc3VwZXIoJ2NvbGxlY3Rpb24nLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IGNvbG9yID0gb3B0aW9ucy5jb2xvcjtcblxuICAgIGlmIChjb2xvcikge1xuICAgICAgYWNjZXNzb3JzLmNvbG9yID0gZnVuY3Rpb24oKSB7IHJldHVybiBjb2xvcjsgfTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ3VyZUNvbW1vblNoYXBlKExpbmUsIGFjY2Vzc29ycywgeyBjb2xvciB9KTtcbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKERvdCwgYWNjZXNzb3JzLCB7fSk7XG4gICAgdGhpcy5zZXRCZWhhdmlvcihuZXcgQnJlYWtwb2ludEJlaGF2aW9yKCkpO1xuICB9XG59XG4iLCJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgQ3Vyc29yIGZyb20gJy4uL3NoYXBlcy9jdXJzb3InO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1cnNvckxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBkYXRhID0geyBjdXJyZW50UG9zaXRpb246IDAgfTtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGNvbG9yOiAncmVkJyB9LCBvcHRpb25zKTtcblxuICAgIHN1cGVyKCdlbnRpdHknLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoQ3Vyc29yLCB7IHg6IChkKSA9PiBkLmN1cnJlbnRQb3NpdGlvbiB9LCB7XG4gICAgICBjb2xvcjogb3B0aW9ucy5jb2xvclxuICAgIH0pO1xuICB9XG5cbiAgc2V0IGN1cnJlbnRQb3NpdGlvbih2YWx1ZSkge1xuICAgIHRoaXMuZGF0YVswXS5jdXJyZW50UG9zaXRpb24gPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBjdXJyZW50UG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVswXS5jdXJyZW50UG9zaXRpb247XG4gIH1cbn1cbiIsImltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcbmltcG9ydCBNYXJrZXIgZnJvbSAnLi4vc2hhcGVzL21hcmtlcic7XG5pbXBvcnQgTWFya2VyQmVoYXZpb3IgZnJvbSAnLi4vYmVoYXZpb3JzL21hcmtlci1iZWhhdmlvcic7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFya2VyTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSwgYWNjZXNzb3JzID0ge30pIHtcbiAgICBzdXBlcignY29sbGVjdGlvbicsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyBkaXNwbGF5SGFuZGxlcnM6IHRydWUgfSwgb3B0aW9ucyk7XG4gICAgY29uc3QgY29sb3IgPSBvcHRpb25zLmNvbG9yO1xuICAgIGlmIChjb2xvcikge1xuICAgICAgYWNjZXNzb3JzLmNvbG9yID0gZnVuY3Rpb24oKSB7IHJldHVybiBjb2xvcjsgfTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKE1hcmtlciwgYWNjZXNzb3JzLCB7XG4gICAgICBkaXNwbGF5SGFuZGxlcnM6IG9wdGlvbnMuZGlzcGxheUhhbmRsZXJzXG4gICAgfSk7XG5cbiAgICB0aGlzLnNldEJlaGF2aW9yKG5ldyBNYXJrZXJCZWhhdmlvcigpKTtcbiAgfVxufVxuIiwiaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IFNlZ21lbnQgZnJvbSAnLi4vc2hhcGVzL3NlZ21lbnQnO1xuaW1wb3J0IFNlZ21lbnRCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvc2VnbWVudC1iZWhhdmlvcic7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VnbWVudExheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30sIGFjY2Vzc29ycyA9IHt9KSB7XG4gICAgc3VwZXIoJ2NvbGxlY3Rpb24nLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHsgZGlzcGxheUhhbmRsZXJzOiB0cnVlIH0sIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShTZWdtZW50LCB7fSwge1xuICAgICAgZGlzcGxheUhhbmRsZXJzOiBvcHRpb25zLmRpc3BsYXlIYW5kbGVyc1xuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRCZWhhdmlvcihuZXcgU2VnbWVudEJlaGF2aW9yKCkpO1xuICB9XG59XG4iLCJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgVHJhY2VQYXRoIGZyb20gJy4uL3NoYXBlcy90cmFjZS1wYXRoJztcbmltcG9ydCBUcmFjZURvdHMgZnJvbSAnLi4vc2hhcGVzL3RyYWNlLWRvdHMnO1xuaW1wb3J0IFRyYWNlQmVoYXZpb3IgZnJvbSAnLi4vYmVoYXZpb3JzL3RyYWNlLWJlaGF2aW9yJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFjZUxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30sIGFjY2Vzc29ycyA9IHt9KSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyBkaXNwbGF5RG90czogdHJ1ZSB9LCBvcHRpb25zKTtcbiAgICBzdXBlcihvcHRpb25zLmRpc3BsYXlEb3RzID8gJ2NvbGxlY3Rpb24nIDogJ2VudGl0eScsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgY29uc3Qgc2hhcGVPcHRpb25zID0ge307XG4gICAgaWYgKG9wdGlvbnMubWVhbkNvbG9yICE9PSB1bmRlZmluZWQpIHsgc2hhcGVPcHRpb25zLm1lYW5Db2xvciA9IG9wdGlvbnMubWVhbkNvbG9yOyB9XG4gICAgaWYgKG9wdGlvbnMucmFuZ2VDb2xvciAhPT0gdW5kZWZpbmVkKSB7IHNoYXBlT3B0aW9ucy5yYW5nZUNvbG9yID0gb3B0aW9ucy5yYW5nZUNvbG9yOyB9XG4gICAgaWYgKG9wdGlvbnMuZGlzcGxheU1lYW4gIT09IHVuZGVmaW5lZCkgeyBzaGFwZU9wdGlvbnMuZGlzcGxheU1lYW4gPSBvcHRpb25zLmRpc3BsYXlNZWFuOyB9XG5cbiAgICBpZiAob3B0aW9ucy5kaXNwbGF5RG90cykge1xuICAgICAgdGhpcy5jb25maWd1cmVDb21tb25TaGFwZShUcmFjZVBhdGgsIGFjY2Vzc29ycywgc2hhcGVPcHRpb25zKTtcbiAgICAgIHRoaXMuY29uZmlndXJlU2hhcGUoVHJhY2VEb3RzLCBhY2Nlc3NvcnMsIHNoYXBlT3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29uZmlndXJlU2hhcGUoVHJhY2VQYXRoLCBhY2Nlc3NvcnMsIHNoYXBlT3B0aW9ucyk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRCZWhhdmlvcihuZXcgVHJhY2VCZWhhdmlvcigpKTtcbiAgfVxufSIsImltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcbmltcG9ydCBXYXZlZm9ybSBmcm9tICcuLi9zaGFwZXMvd2F2ZWZvcm0nO1xuXG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICB5RG9tYWluOiBbLTEsIDFdLFxuICBjaGFubmVsOiAwLFxuICBjb2xvcjogJ3N0ZWVsYmx1ZSdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhdmVmb3JtTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKGJ1ZmZlciwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICBzdXBlcignZW50aXR5JywgYnVmZmVyLmdldENoYW5uZWxEYXRhKG9wdGlvbnMuY2hhbm5lbCksIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShXYXZlZm9ybSwge1xuICAgICAgeTogZnVuY3Rpb24oZCwgdiA9IG51bGwpIHtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpIHsgZCA9IHY7IH1cbiAgICAgICAgcmV0dXJuIGQ7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgc2FtcGxlUmF0ZTogYnVmZmVyLnNhbXBsZVJhdGUsXG4gICAgICBjb2xvcjogb3B0aW9ucy5jb2xvclxuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgZXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5cblxuLyoqXG4gKiBNYWluIGludGVyZmFjZSBmb3IgZXZlbnQgc291cmNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50U291cmNlIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKGVsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmVsID0gZWw7XG5cbiAgICB0aGlzLl9iaW5kRXZlbnRzKCk7XG4gIH1cblxuICBfY3JlYXRlRXZlbnQodHlwZSwgZSkge31cblxuICBfYmluZEV2ZW50cygpIHt9XG59XG4iLCJpbXBvcnQgRXZlbnRTb3VyY2UgZnJvbSAnLi9ldmVudC1zb3VyY2UnO1xuaW1wb3J0IFdhdmVFdmVudCBmcm9tICcuL3dhdmUtZXZlbnQnO1xuXG5cbmNvbnN0IGJvZHkgPSB3aW5kb3cuZG9jdW1lbnQuYm9keTtcblxuLyoqXG4gKiBodHRwOi8vamF2YXNjcmlwdC5pbmZvL3R1dG9yaWFsL2tleWJvYXJkLWV2ZW50c1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBLZXlib2FyZCBleHRlbmRzIEV2ZW50U291cmNlIHtcbiAgY29uc3RydWN0b3IoZWwpIHtcbiAgICBzdXBlcihlbCk7XG4gIH1cblxuICBfY3JlYXRlRXZlbnQodHlwZSwgZSkge1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IFdhdmVFdmVudCh0eXBlLCBlKTtcblxuICAgIGV2ZW50LnNoaWZ0S2V5ID0gZS5zaGlmdEtleTtcbiAgICBldmVudC5jdHJsS2V5ID0gZS5jdHJsS2V5O1xuICAgIGV2ZW50LmFsdEtleSA9IGUuYWx0S2V5O1xuICAgIGV2ZW50Lm1ldGFLZXkgPSBlLm1ldGFLZXk7XG4gICAgZXZlbnQuY2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS5rZXlDb2RlKTtcblxuICAgIHJldHVybiBldmVudDtcbiAgfVxuXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIGNvbnN0IG9uS2V5RG93biA9IChlKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgna2V5ZG93bicsIGUpO1xuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25LZXlVcCA9IChlKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgna2V5dXAnLCBlKTtcbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfTtcblxuICAgIHRoaXMuZWwub25rZXlkb3duID0gb25LZXlEb3duO1xuICAgIHRoaXMuZWwub25rZXl1cCA9IG9uS2V5VXA7XG4gIH1cbn1cbiIsImltcG9ydCBFdmVudFNvdXJjZSBmcm9tICcuL2V2ZW50LXNvdXJjZSc7XG5pbXBvcnQgV2F2ZUV2ZW50IGZyb20gJy4vd2F2ZS1ldmVudCc7XG5cblxuY29uc3QgYm9keSA9IHdpbmRvdy5kb2N1bWVudC5ib2R5O1xuXG4vKipcbiAqIGBTdXJmYWNlYCBub3JtYWxpemVzIG1vdXNlIHVzZXIgaW50ZXJhY3Rpb25zIHdpdGggdGhlIHRpbWVsaW5lIHVwb24gdGhlIERPTSBjb250YWluZXIgZWxlbWVudCBvZiBgVHJhY2tgIGluc3RhbmNlcy5cbiAqIEFzIHNvb24gYXMgYSBgdHJhY2tgIGlzIGFkZGVkIHRvIGEgYHRpbWVsaW5lYCwgaXRzIGF0dGFjaGVkIGBTdXJmYWNlYCBpbnN0YW5jZSB3aWxsIGVtaXQgdGhlIG1vdXNlIGV2ZW50cy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3VyZmFjZSBleHRlbmRzIEV2ZW50U291cmNlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gZWwgLSB0aGUgRE9NIGVsZW1lbnQgdG8gbW9uaXRvclxuICAgKi9cbiAgY29uc3RydWN0b3IoZWwgLyosIHBhZGRpbmcgb2YgdGhlIGN1cnJlbnQgc3VyZmFjZSBAVE9ETyAqLykge1xuICAgIHN1cGVyKGVsKTtcblxuICAgIC8vIHRoaXMuaXNNb3VzZURvd24gPSBmYWxzZTtcbiAgICB0aGlzLm1vdXNlRG93bkV2ZW50ID0gbnVsbDtcbiAgICB0aGlzLmxhc3RFdmVudCA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogRmFjdG9yeSBtZXRob2QgZm9yIGBFdmVudGAgY2xhc3NcbiAgICovXG4gIF9jcmVhdGVFdmVudCh0eXBlLCBlKSB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgV2F2ZUV2ZW50KHR5cGUsIGUpO1xuXG4gICAgY29uc3QgcG9zID0gdGhpcy5fZ2V0UmVsYXRpdmVQb3NpdGlvbihlKTtcbiAgICBldmVudC54ID0gcG9zLng7XG4gICAgZXZlbnQueSA9IHBvcy55O1xuICAgIHRoaXMuZHggPSBudWxsO1xuICAgIHRoaXMuZHkgPSBudWxsO1xuICAgIHRoaXMuYXJlYSA9IG51bGw7IC8vIEBUT0RPIHJlbmFtZVxuXG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGUgLSByYXcgZXZlbnQgZnJvbSBsaXN0ZW5lclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB4LCB5IGNvb3JkaW5hdGVzIGNvb3JkaW5hdGVzIHJlbGF0aXZlIHRvIHRoZSBzdXJmYWNlIGVsZW1lbnRcbiAgICovXG4gIF9nZXRSZWxhdGl2ZVBvc2l0aW9uKGUpIHtcbiAgICAvLyBAVE9ETzogc2hvdWxkIGJlIGFibGUgdG8gaWdub3JlIHBhZGRpbmdcbiAgICBsZXQgeCA9IDA7XG4gICAgbGV0IHkgPSAwO1xuICAgIGNvbnN0IGNsaWVudFJlY3QgPSB0aGlzLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHNjcm9sbExlZnQgPSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdDtcbiAgICBjb25zdCBzY3JvbGxUb3AgID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuXG4gICAgLy8gQWRhcHRlZCBmcm9tIGh0dHA6Ly93d3cucXVpcmtzbW9kZS5vcmcvanMvZXZlbnRzX3Byb3BlcnRpZXMuaHRtbCNwb3NpdGlvblxuICAgIGlmIChlLnBhZ2VYIHx8IGUucGFnZVkpIHtcbiAgICAgIHggPSBlLnBhZ2VYO1xuICAgICAgeSA9IGUucGFnZVk7XG4gICAgfSBlbHNlIGlmIChlLmNsaWVudFggfHwgZS5jbGllbnRZKSB7XG4gICAgICAvLyBOb3JtYWxpemUgdG8gcGFnZVgsIHBhZ2VZXG4gICAgICB4ID0gZS5jbGllbnRYICsgc2Nyb2xsTGVmdDtcbiAgICAgIHkgPSBlLmNsaWVudFkgKyBzY3JvbGxUb3A7XG4gICAgfVxuXG4gICAgLy8gY2xpZW50UmVjdCByZWZlcnMgdG8gdGhlIGNsaWVudCwgbm90IHRvIHRoZSBwYWdlXG4gICAgeCA9IHggLSAoY2xpZW50UmVjdC5sZWZ0ICsgc2Nyb2xsTGVmdCk7XG4gICAgeSA9IHkgLSAoY2xpZW50UmVjdC50b3AgICsgc2Nyb2xsVG9wICk7XG5cbiAgICAvLyBTaG91bGQgaGFuZGxlIHBhZGRpbmdcblxuICAgIHJldHVybiB7IHgsIHkgfTtcbiAgfVxuXG4gIF9kZWZpbmVBcmVhKGUsIG1vdXNlRG93bkV2ZW50LCBsYXN0RXZlbnQpIHtcbiAgICBpZiAoIW1vdXNlRG93bkV2ZW50IHx8wqAhbGFzdEV2ZW50KSB7IHJldHVybjsgfVxuICAgIGUuZHggPSBlLnggLSBsYXN0RXZlbnQueDtcbiAgICBlLmR5ID0gZS55IC0gbGFzdEV2ZW50Lnk7XG5cbiAgICBjb25zdCBsZWZ0ID0gbW91c2VEb3duRXZlbnQueCA8IGUueCA/IG1vdXNlRG93bkV2ZW50LnggOiBlLng7XG4gICAgY29uc3QgdG9wICA9IG1vdXNlRG93bkV2ZW50LnkgPCBlLnkgPyBtb3VzZURvd25FdmVudC55IDogZS55O1xuICAgIGNvbnN0IHdpZHRoICA9IE1hdGguYWJzKE1hdGgucm91bmQoZS54IC0gbW91c2VEb3duRXZlbnQueCkpO1xuICAgIGNvbnN0IGhlaWdodCA9IE1hdGguYWJzKE1hdGgucm91bmQoZS55IC0gbW91c2VEb3duRXZlbnQueSkpO1xuXG4gICAgZS5hcmVhID0geyBsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHQgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBLZWVwIHRoaXMgcHJpdmF0ZSB0byBhdm9pZCBkb3VibGUgZXZlbnQgYmluZGluZ1xuICAgKiBNYWluIGxvZ2ljIG9mIHRoZSBzdXJmYWNlIGlzIGhlcmVcbiAgICogU2hvdWxkIGJlIGV4dGVuZGVkIHdpdGggbmVlZGVkIGV2ZW50cyAobW91c2VlbnRlciwgbW91c2VsZWF2ZSwgd2hlZWwgLi4uKVxuICAgKi9cbiAgX2JpbmRFdmVudHMoKSB7XG4gICAgY29uc3Qgb25Nb3VzZURvd24gPSAoZSkgPT4ge1xuICAgICAgLy8gQnkgcmVtb3ZpbmcgdGhlIHByZXZpb3VzIHNlbGVjdGlvbiB3ZSBwcmV2ZW50IGJ5cGFzc2luZyB0aGUgbW91c2Vtb3ZlIGV2ZW50cyBjb21pbmcgZnJvbSBTVkcgaW4gRmlyZWZveC5cbiAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5fY3JlYXRlRXZlbnQoJ21vdXNlZG93bicsIGUpO1xuXG4gICAgICB0aGlzLmlzTW91c2VEb3duID0gdHJ1ZTtcbiAgICAgIHRoaXMubW91c2VEb3duRXZlbnQgPSBldmVudDtcbiAgICAgIHRoaXMubGFzdEV2ZW50ID0gZXZlbnQ7XG4gICAgICAvLyBSZWdpc3RlciBtb3VzZW1vdmUgYW5kIG1vdXNldXAgbGlzdGVuZXJzIG9uIHdpbmRvd1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlLCBmYWxzZSk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCwgZmFsc2UpO1xuXG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH07XG5cbiAgICBjb25zdCBvbk1vdXNlTW92ZSA9IChlKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnbW91c2Vtb3ZlJywgZSk7XG4gICAgICB0aGlzLl9kZWZpbmVBcmVhKGV2ZW50LCB0aGlzLm1vdXNlRG93bkV2ZW50LCB0aGlzLmxhc3RFdmVudCk7XG4gICAgICAvLyBVcGRhdGUgYGxhc3RFdmVudGAgZm9yIG5leHQgY2FsbFxuICAgICAgdGhpcy5sYXN0RXZlbnQgPSBldmVudDtcblxuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25Nb3VzZVVwID0gKGUpID0+IHtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdtb3VzZXVwJywgZSk7XG4gICAgICB0aGlzLl9kZWZpbmVBcmVhKGV2ZW50LCB0aGlzLm1vdXNlRG93bkV2ZW50LCB0aGlzLmxhc3RFdmVudCk7XG5cbiAgICAgIHRoaXMuaXNNb3VzZURvd24gPSBmYWxzZTtcbiAgICAgIHRoaXMubW91c2VEb3duRXZlbnQgPSBudWxsO1xuICAgICAgdGhpcy5sYXN0RXZlbnQgPSBudWxsO1xuICAgICAgLy8gUmVtb3ZlIG1vdXNlbW92ZSBhbmQgbW91c2V1cCBsaXN0ZW5lcnMgb24gd2luZG93XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXApO1xuXG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH07XG5cbiAgICBjb25zdCBvbkNsaWNrID0gKGUpID0+IHtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdjbGljaycsIGUpO1xuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25EYmxDbGljayA9IChlKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnZGJsY2xpY2snLCBlKTtcbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfTtcblxuICAgIC8vIEJpbmQgY2FsbGJhY2tzXG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbk1vdXNlRG93biwgZmFsc2UpO1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrLCBmYWxzZSk7XG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIG9uRGJsQ2xpY2ssIGZhbHNlKTtcbiAgfVxufVxuIiwiLy8gYmFzZSBjbGFzcyBmb3IgYWxsIEV2ZW50c1xuLy8gQE5PVEU6IHVzZSBhIHNpbmdsZSBFdmVudCBwZXIgU3VyZmFjZVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2F2ZUV2ZW50IHtcbiAgY29uc3RydWN0b3IodHlwZSwgb3JpZ2luYWxFdmVudCkge1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5vcmlnaW5hbEV2ZW50ID0gb3JpZ2luYWxFdmVudDtcblxuICAgIHRoaXMudGFyZ2V0ID0gb3JpZ2luYWxFdmVudC50YXJnZXQ7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gb3JpZ2luYWxFdmVudC5jdXJyZW50VGFyZ2V0O1xuICB9XG59XG4iLCJpbXBvcnQgTWFya2VyIGZyb20gJy4vbWFya2VyJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbm5vdGF0ZWRNYXJrZXIgZXh0ZW5kcyBNYXJrZXIge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnYW5ub3RhdGVkLW1hcmtlcic7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIGxldCBsaXN0ID0gc3VwZXIuX2dldEFjY2Vzc29yTGlzdCgpO1xuICAgIGxpc3QudGV4dCA9ICdkZWZhdWx0JztcbiAgICByZXR1cm4gbGlzdDtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgdGhpcy4kZWwgPSBzdXBlci5yZW5kZXIocmVuZGVyaW5nQ29udGV4dCk7XG4gICAgY29uc3QgaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG5cbiAgICB0aGlzLiRsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAndGV4dCcpO1xuICAgIHRoaXMuJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgMTApO1xuICAgIHRoaXMuJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgMTApO1xuICAgIHRoaXMuJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgbWF0cml4KDEsIDAsIDAsIC0xLCAwLCAke2hlaWdodH0pYCk7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUuZm9udFNpemUgPSAnMTBweCc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUuZm9udEZhbWlseSA9ICdtb25vc3BhY2UnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLmNvbG9yID0gJyM2NzY3NjcnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLm1velVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJztcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbGFiZWwpO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCBpbmRleCkge1xuICAgIHN1cGVyLnVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgaW5kZXgpO1xuXG4gICAgdGhpcy4kbGFiZWwuaW5uZXJIVE1MID0gdGhpcy50ZXh0KGRhdHVtKTtcbiAgfVxufVxuIiwiaW1wb3J0IFNlZ21lbnQgZnJvbSAnLi9zZWdtZW50JztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbm5vdGF0ZWRTZWdtZW50IGV4dGVuZHMgU2VnbWVudCB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdhbm5vdGF0ZWQtc2VnbWVudCc7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIGxldCBsaXN0ID0gc3VwZXIuX2dldEFjY2Vzc29yTGlzdCgpO1xuICAgIGxpc3QudGV4dCA9ICdkZWZhdWx0JztcbiAgICByZXR1cm4gbGlzdDtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgdGhpcy4kZWwgPSBzdXBlci5yZW5kZXIocmVuZGVyaW5nQ29udGV4dCk7XG4gICAgY29uc3QgaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG5cbiAgICB0aGlzLiRsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAndGV4dCcpO1xuICAgIHRoaXMuJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgMSk7XG4gICAgdGhpcy4kbGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCAxMSk7XG4gICAgdGhpcy4kbGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGBtYXRyaXgoMSwgMCwgMCwgLTEsIDAsICR7aGVpZ2h0fSlgKTtcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS5mb250U2l6ZSA9ICcxMHB4JztcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS5mb250RmFtaWx5ID0gJ21vbm9zcGFjZSc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUuY29sb3IgPSAnIzY3Njc2Nyc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUubW96VXNlclNlbGVjdCA9ICdub25lJztcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XG5cbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRsYWJlbCk7XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIGluZGV4KSB7XG4gICAgc3VwZXIudXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCBpbmRleCk7XG5cbiAgICB0aGlzLiRsYWJlbC5pbm5lckhUTUwgPSB0aGlzLnRleHQoZGF0dW0pO1xuICB9XG59XG4iLCJpbXBvcnQgbnMgZnJvbSAnLi4vY29yZS9uYW1lc3BhY2UnO1xuXG5cbi8vIEBOT1RFOiBhY2Nlc3NvcnMgc2hvdWxkIHJlY2VpdmUgZGF0dW0gaW5kZXggYXMgYXJndW1lbnRcbi8vIHRvIGFsbG93IHRoZSB1c2Ugb2Ygc2FtcGxlUmF0ZSB0byBkZWZpbmUgeCBwb3NpdGlvblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlU2hhcGUge1xuICAvKipcbiAgICogIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IG92ZXJyaWRlIGRlZmF1bHQgY29uZmlndXJhdGlvblxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy4kZWwgPSBudWxsO1xuICAgIHRoaXMubnMgPSBucztcbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX2dldERlZmF1bHRzKCksIG9wdGlvbnMpO1xuICAgIC8vIGNyZWF0ZSBhY2Nlc3NvcnMgbWV0aG9kcyBhbmQgc2V0IGRlZmF1bHQgYWNjZXNzb3IgZnVuY3Rpb25zXG4gICAgY29uc3QgYWNjZXNzb3JzID0gdGhpcy5fZ2V0QWNjZXNzb3JMaXN0KCk7XG4gICAgdGhpcy5fY3JlYXRlQWNjZXNzb3JzKGFjY2Vzc29ycyk7XG4gICAgdGhpcy5fc2V0RGVmYXVsdEFjY2Vzc29ycyhhY2Nlc3NvcnMpO1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgY2xlYW4gcmVmZXJlbmNlcywgaXMgY2FsbGVkIGZyb20gdGhlIGBsYXllcmBcbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgLy8gdGhpcy5ncm91cCA9IG51bGw7XG4gICAgdGhpcy4kZWwgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge1N0cmluZ30gdGhlIG5hbWUgb2YgdGhlIHNoYXBlLCB1c2VkIGFzIGEgY2xhc3MgaW4gdGhlIGVsZW1lbnQgZ3JvdXBcbiAgICovXG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdzaGFwZSc7IH1cblxuICAvLyBzaG91bGQgb25seSBiZSBjYWxsZWQgb25jZVxuICAvLyBzZXRTdmdEZWZpbml0aW9uKGRlZnMpIHt9XG5cbiAgLyoqXG4gICAqIEBUT0RPIHJlbmFtZVxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqICAgIGtleXMgYXJlIHRoZSBhY2Nlc3NvcnMgbWV0aG9kcyBuYW1lcyB0byBjcmVhdGVcbiAgICogICAgdmFsdWVzIGFyZSB0aGUgZGVmYXVsdCB2YWx1ZXMgZm9yIGVhY2ggZ2l2ZW4gYWNjZXNzb3JcbiAgICovXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7IHJldHVybiB7fTsgfVxuXG5cbiAgLyoqXG4gICAqICBpbnN0YWxsIHRoZSBnaXZlbiBhY2Nlc3NvcnMgb24gdGhlIHNoYXBlXG4gICAqL1xuICBpbnN0YWxsKGFjY2Vzc29ycykge1xuICAgIGZvciAobGV0IGtleSBpbiBhY2Nlc3NvcnMpIHsgdGhpc1trZXldID0gYWNjZXNzb3JzW2tleV07IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBnZW5lcmljIG1ldGhvZCB0byBjcmVhdGUgYWNjZXNzb3JzXG4gICAqIGFkZHMgYWNjZXNzb3IgdG8gdGhlIHByb3RvdHlwZSBpZiBub3QgYWxyZWFkeSBwcmVzZW50XG4gICAqL1xuICBfY3JlYXRlQWNjZXNzb3JzKGFjY2Vzc29ycykge1xuICAgIHRoaXMuX2FjY2Vzc29ycyA9IHt9O1xuICAgIC8vIGFkZCBpdCB0byB0aGUgcHJvdG90eXBlXG4gICAgY29uc3QgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcyk7XG4gICAgLy8gY3JlYXRlIGEgZ2V0dGVyIC8gc2V0dGVyIGZvciBlYWNoIGFjY2Vzc29yc1xuICAgIC8vIHNldHRlciA6IGB0aGlzLnggPSBjYWxsYmFja2BcbiAgICAvLyBnZXR0ZXIgOiBgdGhpcy54KGRhdHVtKWBcbiAgICBPYmplY3Qua2V5cyhhY2Nlc3NvcnMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgIGlmIChwcm90by5oYXNPd25Qcm9wZXJ0eShuYW1lKSkgeyByZXR1cm47IH1cblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCBuYW1lLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9hY2Nlc3NvcnNbbmFtZV07IH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24oZnVuYykge1xuICAgICAgICAgIHRoaXMuX2FjY2Vzc29yc1tuYW1lXSA9IGZ1bmM7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSBhIGZ1bmN0aW9uIHRvIGJlIHVzZWQgYXMgYSBkZWZhdWx0XG4gICAqIGFjY2Vzc29yIGZvciBlYWNoIGFjY2Vzb3JzXG4gICAqL1xuICBfc2V0RGVmYXVsdEFjY2Vzc29ycyhhY2Nlc3NvcnMpIHtcbiAgICBPYmplY3Qua2V5cyhhY2Nlc3NvcnMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IGFjY2Vzc29yc1tuYW1lXTtcbiAgICAgIGxldCBhY2Nlc3NvciA9IGZ1bmN0aW9uKGQsIHYgPSBudWxsKSB7XG4gICAgICAgIGlmICh2ID09PSBudWxsKSB7IHJldHVybiBkW25hbWVdIHx8IGRlZmF1bHRWYWx1ZTsgfVxuICAgICAgICBkW25hbWVdID0gdjtcbiAgICAgIH07XG4gICAgICAvLyBzZXQgYWNjZXNzb3IgYXMgdGhlIGRlZmF1bHQgb25lXG4gICAgICB0aGlzW25hbWVdID0gYWNjZXNzb3I7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtICByZW5kZXJpbmdDb250ZXh0IHtDb250ZXh0fSB0aGUgcmVuZGVyaW5nQ29udGV4dCB0aGUgbGF5ZXIgd2hpY2ggb3ducyB0aGlzIGl0ZW1cbiAgICogQHJldHVybiAge0RPTUVsZW1lbnR9IHRoZSBET00gZWxlbWVudCB0byBpbnNlcnQgaW4gdGhlIGl0ZW0ncyBncm91cFxuICAgKi9cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHt9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSAgZ3JvdXAge0RPTUVsZW1lbnR9IGdyb3VwIG9mIHRoZSBpdGVtIGluIHdoaWNoIHRoZSBzaGFwZSBpcyBkcmF3blxuICAgKiBAcGFyYW0gIHJlbmRlcmluZ0NvbnRleHQge0NvbnRleHR9IHRoZSByZW5kZXJpbmdDb250ZXh0IHRoZSBsYXllciB3aGljaCBvd25zIHRoaXMgaXRlbVxuICAgKiBAcGFyYW1cbiAgICogICAgc2ltcGxlU2hhcGUgOiBkYXR1bSB7T2JqZWN0fSB0aGUgZGF0dW0gcmVsYXRlZCB0byB0aGlzIGl0ZW0ncyBncm91cFxuICAgKiAgICBjb21tb25TaGFwZSA6IGRhdHVtIHtBcnJheX0gdGhlIGFzc29jaWF0ZWQgdG8gdGhlIExheWVyXG4gICAqIEBwYXJhbVxuICAgKiAgICBzaW1wbGVTaGFwZSA6IGluZGV4IHtOdW1iZXJ9IHRoZSBjdXJyZW50IGluZGV4IG9mIHRoZSBkYXR1bVxuICAgKiAgICBjb21tb25TaGFwZSA6IHVuZGVmaW5lZFxuICAgKiBAcmV0dXJuICB2b2lkXG4gICAqL1xuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIGluZGV4KSB7fVxuXG4gIC8qKlxuICAgKiAgZGVmaW5lIGlmIHRoZSBzaGFwZSBpcyBjb25zaWRlcmVkIHRvIGJlIHRoZSBnaXZlbiBhcmVhXG4gICAqICBhcmd1bWVudHMgYXJlIHBhc3NlZCBpbiBkb21haW4gdW5pdCAodGltZSwgd2hhdGV2ZXIpXG4gICAqICBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgaW5BcmVhKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mikge31cbn1cbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcbmltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3Vyc29yIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ2N1cnNvcic7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IHg6IDAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29sb3I6ICcjMDAwMDAwJyxcbiAgICAgIG9wYWNpdHk6IDFcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2xpbmUnKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIDApO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5MScsIDApO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5MicsIHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0KTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcbiAgICB0aGlzLiRlbC5zdHlsZS5zdHJva2UgPSB0aGlzLnBhcmFtcy5jb2xvcjtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgaW5kZXgpIHtcbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLngoZGF0dW0pKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3h9LCAwKWApO1xuICB9XG5cbiAgLy8gbm90IHNlbGVjdGFibGUgd2l0aCBhIGRyYWdcbiAgaW5BcmVhKCkgeyByZXR1cm4gZmFsc2U7IH1cbn1cbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3QgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnZG90JzsgfVxuXG4gIC8vIEBUT0RPIHJlbmFtZSA6IGNvbmZ1c2lvbiBiZXR3ZWVuIGFjY2Vzc29ycyBhbmQgbWV0YS1hY2Nlc3NvcnNcbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyBjeDogMCwgY3k6IDAsIHI6IDMsIGNvbG9yOiAnIzAwMDAwMCfCoH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2NpcmNsZScpO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCBpbmRleCkge1xuICAgIGNvbnN0IGN4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLmN4KGRhdHVtKSk7XG4gICAgY29uc3QgY3kgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLmN5KGRhdHVtKSk7XG4gICAgY29uc3QgciAgPSB0aGlzLnIoZGF0dW0pO1xuICAgIGNvbnN0IGNvbG9yID0gdGhpcy5jb2xvcihkYXR1bSk7XG5cbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke2N4fSwgJHtjeX0pYCk7XG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3InLCByKTtcbiAgICB0aGlzLiRlbC5zdHlsZS5maWxsID0gY29sb3I7XG4gIH1cblxuICAvLyB4MSwgeDIsIHkxLCB5MiA9PiBpbiBwaXhlbCBkb21haW5cbiAgaW5BcmVhKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mikge1xuICAgIGNvbnN0IGN4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLmN4KGRhdHVtKSk7XG4gICAgY29uc3QgY3kgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLmN5KGRhdHVtKSk7XG5cbiAgICBpZiAoKGN4ID4geDEgJiYgY3ggPCB4MikgJiYgKGN5ID4geTEgJiYgY3kgPCB5MikpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmUgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnbGluZSc7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IGN4OiAwLCBjeTogMCB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7IGNvbG9yOiAnIzAwMDAwMCcgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3BhdGgnKTtcbiAgICAvLyB0aGlzLmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEuc2xpY2UoMCk7XG4gICAgZGF0YS5zb3J0KChhLCBiKSA9PiB0aGlzLmN4KGEpIDwgdGhpcy5jeChiKSA/IC0xIDogMSk7XG5cbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIHRoaXMuX2J1aWxkTGluZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSk7XG4gICAgdGhpcy4kZWwuc3R5bGUuc3Ryb2tlID0gdGhpcy5wYXJhbXMuY29sb3I7XG4gICAgdGhpcy4kZWwuc3R5bGUuZmlsbCA9ICdub25lJztcblxuICAgIGRhdGEgPSBudWxsO1xuICB9XG5cbiAgLy8gYnVpbGRzIHRoZSBgcGF0aC5kYCBhdHRyaWJ1dGVcbiAgLy8gQFRPRE8gY3JlYXRlIHNvbWUgU2hhcGVIZWxwZXIgP1xuICBfYnVpbGRMaW5lKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpIHtcbiAgICBpZiAoIWRhdGEubGVuZ3RoKSB7IHJldHVybiAnJzsgfVxuICAgIC8vIHNvcnQgZGF0YVxuICAgIGxldCBpbnN0cnVjdGlvbnMgPSBkYXRhLm1hcCgoZGF0dW0sIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLmN4KGRhdHVtKSk7XG4gICAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy5jeShkYXR1bSkpO1xuICAgICAgcmV0dXJuIGAke3h9LCR7eX1gO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuICdNJyArIGluc3RydWN0aW9ucy5qb2luKCdMJyk7XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXJrZXIgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnbWFya2VyJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgeDogMCwgY29sb3I6ICcjMDAwMDAwJyB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoYW5kbGVyV2lkdGg6IDcsXG4gICAgICBoYW5kbGVySGVpZ2h0OiAxMCxcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogdHJ1ZSxcbiAgICAgIG9wYWNpdHk6IDFcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICBjb25zdCBoZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcblxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdnJyk7XG4gICAgdGhpcy4kbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncmVjdCcpO1xuXG4gICAgLy8gZHJhdyBsaW5lXG4gICAgdGhpcy4kbGluZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIDApO1xuICAgIHRoaXMuJGxpbmUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCAwKTtcbiAgICB0aGlzLiRsaW5lLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIDEpO1xuICAgIHRoaXMuJGxpbmUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgdGhpcy4kbGluZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ29wdGltaXplU3BlZWQnKTtcblxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJGxpbmUpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmRpc3BsYXlIYW5kbGVycykge1xuICAgICAgdGhpcy4kaGFuZGxlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncmVjdCcpO1xuXG4gICAgICB0aGlzLiRoYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgLSgodGhpcy5wYXJhbXMuaGFuZGxlcldpZHRoIC0gMSkgLyAyKSk7XG4gICAgICB0aGlzLiRoYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQgLSB0aGlzLnBhcmFtcy5oYW5kbGVySGVpZ2h0KTtcbiAgICAgIHRoaXMuJGhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgdGhpcy5wYXJhbXMuaGFuZGxlcldpZHRoKTtcbiAgICAgIHRoaXMuJGhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHRoaXMucGFyYW1zLmhhbmRsZXJIZWlnaHQpO1xuICAgICAgdGhpcy4kaGFuZGxlci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcblxuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kaGFuZGxlcik7XG4gICAgfVxuXG4gICAgdGhpcy4kZWwuc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIGluZGV4KSB7XG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSkgLSAwLjU7XG4gICAgY29uc3QgY29sb3IgPSB0aGlzLmNvbG9yKGRhdHVtKTtcblxuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7eH0sIDApYCk7XG4gICAgdGhpcy4kbGluZS5zdHlsZS5maWxsID0gY29sb3I7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZGlzcGxheUhhbmRsZXJzKSB7XG4gICAgICB0aGlzLiRoYW5kbGVyLnN0eWxlLmZpbGwgPSBjb2xvcjtcbiAgICB9XG4gIH1cblxuICBpbkFyZWEocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgLy8gaGFuZGxlcnMgb25seSBhcmUgc2VsZWN0YWJsZVxuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkYXR1bSkpO1xuICAgIGNvbnN0IHNoYXBlWDEgPSB4IC0gKHRoaXMucGFyYW1zLmhhbmRsZXJXaWR0aCAtIDEpIC8gMjtcbiAgICBjb25zdCBzaGFwZVgyID0gc2hhcGVYMSArIHRoaXMucGFyYW1zLmhhbmRsZXJXaWR0aDtcbiAgICBjb25zdCBzaGFwZVkxID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQgLSB0aGlzLnBhcmFtcy5oYW5kbGVySGVpZ2h0O1xuICAgIGNvbnN0IHNoYXBlWTIgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcblxuICAgIGNvbnN0IHhPdmVybGFwID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oeDIsIHNoYXBlWDIpIC0gTWF0aC5tYXgoeDEsIHNoYXBlWDEpKTtcbiAgICBjb25zdCB5T3ZlcmxhcCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHkyLCBzaGFwZVkyKSAtIE1hdGgubWF4KHkxLCBzaGFwZVkxKSk7XG4gICAgY29uc3QgYXJlYSA9IHhPdmVybGFwICogeU92ZXJsYXA7XG5cbiAgICByZXR1cm4gYXJlYSA+IDA7XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWdtZW50IGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3NlZ21lbnQnOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyB4OiAwLCB5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAxLCBjb2xvcjogJyMwMDAwMDAnLCBvcGFjaXR5OiAxIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogdHJ1ZSxcbiAgICAgIGhhbmRsZXJXaWR0aDogMixcbiAgICAgIGhhbmRsZXJPcGFjaXR5OiAwLjgsXG4gICAgICBvcGFjaXR5OiAwLjZcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZycpO1xuXG4gICAgdGhpcy4kc2VnbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncmVjdCcpO1xuICAgIHRoaXMuJHNlZ21lbnQuY2xhc3NMaXN0LmFkZCgnc2VnbWVudCcpO1xuICAgIHRoaXMuJHNlZ21lbnQuc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG4gICAgdGhpcy4kc2VnbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcblxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJHNlZ21lbnQpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmRpc3BsYXlIYW5kbGVycykge1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3JlY3QnKTtcbiAgICAgIHRoaXMuJGxlZnRIYW5kbGVyLmNsYXNzTGlzdC5hZGQoJ2xlZnQnLCAnaGFuZGxlcicpO1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgdGhpcy5wYXJhbXMuaGFuZGxlcldpZHRoKTtcbiAgICAgIHRoaXMuJGxlZnRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLmhhbmRsZXJPcGFjaXR5O1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuc3R5bGUuY3Vyc29yID0gJ2V3LXJlc2l6ZSc7XG5cbiAgICAgIHRoaXMuJHJpZ2h0SGFuZGxlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncmVjdCcpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLmNsYXNzTGlzdC5hZGQoJ3JpZ2h0JywgJ2hhbmRsZXInKTtcbiAgICAgIHRoaXMuJHJpZ2h0SGFuZGxlci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB0aGlzLnBhcmFtcy5oYW5kbGVyV2lkdGgpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5oYW5kbGVyT3BhY2l0eTtcbiAgICAgIHRoaXMuJHJpZ2h0SGFuZGxlci5zdHlsZS5jdXJzb3IgPSAnZXctcmVzaXplJztcblxuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbGVmdEhhbmRsZXIpO1xuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kcmlnaHRIYW5kbGVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIGluZGV4KSB7XG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSk7XG4gICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMueShkYXR1bSkpO1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLndpZHRoKGRhdHVtKSk7XG4gICAgY29uc3QgaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy5oZWlnaHQoZGF0dW0pKTtcbiAgICBjb25zdCBjb2xvciA9IHRoaXMuY29sb3IoZGF0dW0pO1xuICAgIGNvbnN0IG9wYWNpdHkgPSB0aGlzLm9wYWNpdHkoZGF0dW0pO1xuXG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHt4fSwgJHt5fSlgKTtcbiAgICB0aGlzLiRlbC5zdHlsZS5vcGFjaXR5ID0gb3BhY2l0eTtcblxuICAgIHRoaXMuJHNlZ21lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgTWF0aC5tYXgod2lkdGgsIDApKTtcbiAgICB0aGlzLiRzZWdtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgIHRoaXMuJHNlZ21lbnQuc3R5bGUuZmlsbCA9IGNvbG9yO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmRpc3BsYXlIYW5kbGVycykge1xuICAgICAgLy8gZGlzcGxheSBoYW5kbGVyc1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgICB0aGlzLiRsZWZ0SGFuZGxlci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLCAwKScpO1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuc3R5bGUuZmlsbCA9IGNvbG9yO1xuXG4gICAgICBjb25zdCByaWdodEhhbmRsZXJUcmFuc2xhdGUgPSBgdHJhbnNsYXRlKCR7d2lkdGggLSB0aGlzLnBhcmFtcy5oYW5kbGVyV2lkdGh9LCAwKWA7XG4gICAgICB0aGlzLiRyaWdodEhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgICB0aGlzLiRyaWdodEhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHJpZ2h0SGFuZGxlclRyYW5zbGF0ZSk7XG4gICAgICB0aGlzLiRyaWdodEhhbmRsZXIuc3R5bGUuZmlsbCA9IGNvbG9yO1xuICAgIH1cbiAgfVxuXG4gIGluQXJlYShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgeDEsIHkxLCB4MiwgeTIpIHtcbiAgICBjb25zdCBzaGFwZVgxID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLngoZGF0dW0pKTtcbiAgICBjb25zdCBzaGFwZVgyID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLngoZGF0dW0pICsgdGhpcy53aWR0aChkYXR1bSkpO1xuICAgIGNvbnN0IHNoYXBlWTEgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLnkoZGF0dW0pKTtcbiAgICBjb25zdCBzaGFwZVkyID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy55KGRhdHVtKSArIHRoaXMuaGVpZ2h0KGRhdHVtKSk7XG5cbiAgICAvLyBodHRwOi8vanNmaWRkbGUubmV0L3V0aHlaLyAtIGNoZWNrIG92ZXJsYXBpbmcgYXJlYVxuICAgIGNvbnN0IHhPdmVybGFwID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oeDIsIHNoYXBlWDIpIC0gTWF0aC5tYXgoeDEsIHNoYXBlWDEpKTtcbiAgICBjb25zdCB5T3ZlcmxhcCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHkyLCBzaGFwZVkyKSAtIE1hdGgubWF4KHkxLCBzaGFwZVkxKSk7XG4gICAgY29uc3QgYXJlYSA9IHhPdmVybGFwICogeU92ZXJsYXA7XG5cbiAgICByZXR1cm4gYXJlYSA+IDA7XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBeGlzIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZycpO1xuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7XG4gICAgd2hpbGUgKHRoaXMuJGVsLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHRoaXMuJGVsLnJlbW92ZUNoaWxkKHRoaXMuJGVsLmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGNvbnN0IGxheWVySGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7IC8vIHZhbHVlVG9QaXhlbCgxKTtcblxuICAgIGRhdGEuZm9yRWFjaCgoZGF0dW0pID0+IHtcbiAgICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKGRhdHVtLngpO1xuICAgICAgY29uc3Qgb3BhY2l0eSA9IGRhdHVtLmZvY3VzZWQgPyAwLjggOiAwLjM7XG4gICAgICAvLyBjb25zdCBoZWlnaHQgPSBkYXR1bS5tYXJrZXIgPyBsYXllckhlaWdodCA6IGxheWVySGVpZ2h0IC0gMTA7XG4gICAgICBjb25zdCBoZWlnaHQgPSBsYXllckhlaWdodDtcblxuICAgICAgY29uc3QgdGljayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnbGluZScpO1xuICAgICAgdGljay5jbGFzc0xpc3QuYWRkKCd0aWNrJyk7XG5cbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gxJywgMCk7XG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4MicsIDApO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneTEnLCAwKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3kyJywgaGVpZ2h0KTtcblxuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICdub25lJyk7XG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCAnc3RlZWxibHVlJyk7XG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3h9LCAwKWApO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnb3BhY2l0eScsIG9wYWNpdHkpO1xuXG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aWNrKTtcblxuICAgICAgaWYgKGRhdHVtLmxhYmVsKSB7XG4gICAgICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICd0ZXh0Jyk7XG4gICAgICAgIGxhYmVsLmNsYXNzTGlzdC5hZGQoJ2xhYmVsJyk7XG5cbiAgICAgICAgbGFiZWwuaW5uZXJIVE1MID0gZGF0dW0ubGFiZWw7XG4gICAgICAgIGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgbWF0cml4KDEsIDAsIDAsIC0xLCAke3ggKyAyfSwgJHtoZWlnaHQgKyAyfSlgKTtcbiAgICAgICAgbGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2FsaWdubWVudC1iYXNlbGluZScsICd0ZXh0LWJlZm9yZS1lZGdlJyk7XG4gICAgICAgIGxhYmVsLnN0eWxlLmZvbnRTaXplID0gJzEwcHgnO1xuICAgICAgICBsYWJlbC5zdHlsZS5saW5lSGVpZ2h0ID0gJzEwcHgnO1xuICAgICAgICBsYWJlbC5zdHlsZS5mb250RmFtaWx5ID0gJ21vbm9zcGFjZSc7XG4gICAgICAgIGxhYmVsLnN0eWxlLmNvbG9yID0gJyM2NzY3NjcnO1xuICAgICAgICBsYWJlbC5zdHlsZS5vcGFjaXR5ID0gMC45O1xuICAgICAgICBsYWJlbC5zdHlsZS5tb3pVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgICAgICBsYWJlbC5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgICAgICBsYWJlbC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuXG4gICAgICAgIC8vIGNvbnN0IGJnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdyZWN0Jyk7XG4gICAgICAgIC8vIGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsICcxMDAlJyk7XG4gICAgICAgIC8vIGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCAnMTAwJScpO1xuICAgICAgICAvLyBiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICcjZmZmZmZmJyk7XG4gICAgICAgIC8vIGxhYmVsLmFwcGVuZENoaWxkKGJnKTtcblxuICAgICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG4gIH1cbn0iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2VEb3RzIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3RyYWNlLWRvdHMnOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyB4OiAwLCBtZWFuOiAwLCByYW5nZTogMCB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtZWFuUmFkaXVzOiAzLFxuICAgICAgcmFuZ2VSYWRpdXM6IDMsXG4gICAgICBtZWFuQ29sb3I6ICcjMjMyMzIzJyxcbiAgICAgIHJhbmdlQ29sb3I6ICdzdGVlbGJsdWUnXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuICAgIC8vIGNvbnRhaW5lclxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdnJyk7XG4gICAgLy8gZHJhdyBtZWFuIGRvdFxuICAgIHRoaXMuJG1lYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2NpcmNsZScpO1xuICAgIHRoaXMuJG1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3InLCB0aGlzLnBhcmFtcy5tZWFuUmFkaXVzKTtcbiAgICB0aGlzLiRtZWFuLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5tZWFuQ29sb3IpO1xuICAgIHRoaXMuJG1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAndHJhbnNwYXJlbnQnKTtcbiAgICB0aGlzLiRtZWFuLmNsYXNzTGlzdC5hZGQoJ21lYW4nKTtcbiAgICAvLyByYW5nZSBkb3RzICgwID0+IHRvcCwgMSA9PiBib3R0b20pXG4gICAgdGhpcy4kbWF4ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdjaXJjbGUnKTtcbiAgICB0aGlzLiRtYXguc2V0QXR0cmlidXRlTlMobnVsbCwgJ3InLCB0aGlzLnBhcmFtcy5tZWFuUmFkaXVzKTtcbiAgICB0aGlzLiRtYXguc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLnJhbmdlQ29sb3IpO1xuICAgIHRoaXMuJG1heC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICd0cmFuc3BhcmVudCcpO1xuICAgIHRoaXMuJG1heC5jbGFzc0xpc3QuYWRkKCdtYXgnKTtcblxuICAgIHRoaXMuJG1pbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnY2lyY2xlJyk7XG4gICAgdGhpcy4kbWluLnNldEF0dHJpYnV0ZU5TKG51bGwsICdyJywgdGhpcy5wYXJhbXMubWVhblJhZGl1cyk7XG4gICAgdGhpcy4kbWluLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5yYW5nZUNvbG9yKTtcbiAgICB0aGlzLiRtaW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAndHJhbnNwYXJlbnQnKTtcbiAgICB0aGlzLiRtaW4uY2xhc3NMaXN0LmFkZCgnbWluJyk7XG5cbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRtZWFuKTtcbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRtYXgpO1xuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJG1pbik7XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICAvLyBAVE9ETyB1c2UgYWNjZXNzb3JzXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgaW5kZXgpIHtcbiAgICBjb25zdCBtZWFuID0gdGhpcy5tZWFuKGRhdHVtKTtcbiAgICBjb25zdCByYW5nZSA9IHRoaXMucmFuZ2UoZGF0dW0pO1xuICAgIGNvbnN0IHggPSB0aGlzLngoZGF0dW0pO1xuICAgIC8vIHkgcG9zaXRpb25zXG4gICAgY29uc3QgbWVhblBvcyA9IGAke3JlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKG1lYW4pfWA7XG4gICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke21lYW5Qb3N9KWApO1xuXG4gICAgY29uc3QgaGFsZlJhbmdlID0gcmFuZ2UgLyAyO1xuICAgIGNvbnN0IG1heCA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKG1lYW4gKyBoYWxmUmFuZ2UpO1xuICAgIGNvbnN0IG1pbiA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKG1lYW4gLSBoYWxmUmFuZ2UpO1xuICAgIGNvbnN0IHhQb3MgPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHgpO1xuXG4gICAgdGhpcy4kbWF4LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7bWF4fSlgKTtcbiAgICB0aGlzLiRtaW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHttaW59KWApO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7eFBvc30sIDApYCk7XG4gIH1cblxuICBpbkFyZWEocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSk7XG4gICAgY29uc3QgbWVhbiA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMubWVhbihkYXR1bSkpO1xuICAgIGNvbnN0IHJhbmdlID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy5yYW5nZShkYXR1bSkpO1xuICAgIGNvbnN0IG1pbiA9IG1lYW4gLSAocmFuZ2UgLyAyKTtcbiAgICBjb25zdCBtYXggPSBtZWFuICsgKHJhbmdlIC8gMik7XG5cbiAgICBpZiAoeCA+IHgxICYmIHggPCB4MiAmJiAobWluID4geTEgfHwgbWF4IDwgeTIpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFjZVBhdGggZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAndHJhY2UtY29tbW9uJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgeDogMCwgbWVhbjogMCwgcmFuZ2U6IDAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmFuZ2VDb2xvcjogJ3N0ZWVsYmx1ZScsXG4gICAgICBtZWFuQ29sb3I6ICcjMjMyMzIzJyxcbiAgICAgIGRpc3BsYXlNZWFuOiB0cnVlXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdnJyk7XG4gICAgLy8gcmFuZ2UgcGF0aFxuICAgIHRoaXMuJHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kcmFuZ2UpO1xuXG4gICAgLy8gbWVhbiBsaW5lXG4gICAgaWYgKHRoaXMucGFyYW1zLmRpc3BsYXlNZWFuKSB7XG4gICAgICB0aGlzLiRtZWFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRtZWFuKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIC8vIG9yZGVyIGRhdGEgYnkgeCBwb3NpdGlvblxuICAgIGRhdGEgPSBkYXRhLnNsaWNlKDApO1xuICAgIGRhdGEuc29ydCgoYSwgYikgPT4gdGhpcy54KGEpIDwgdGhpcy54KGIpID8gLTEgOiAxKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5kaXNwbGF5TWVhbikge1xuICAgICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIHRoaXMuX2J1aWxkTWVhbkxpbmUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkpO1xuICAgICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMubWVhbkNvbG9yKTtcbiAgICAgIHRoaXMuJG1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnbm9uZScpO1xuICAgIH1cblxuICAgIHRoaXMuJHJhbmdlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgdGhpcy5fYnVpbGRSYW5nZVpvbmUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkpO1xuICAgIHRoaXMuJHJhbmdlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCAnbm9uZScpO1xuICAgIHRoaXMuJHJhbmdlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgdGhpcy5wYXJhbXMucmFuZ2VDb2xvcik7XG4gICAgdGhpcy4kcmFuZ2Uuc2V0QXR0cmlidXRlTlMobnVsbCwgJ29wYWNpdHknLCAnMC40Jyk7XG5cbiAgICBkYXRhID0gbnVsbDtcbiAgfVxuXG4gIF9idWlsZE1lYW5MaW5lKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpIHtcbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gZGF0YS5tYXAoKGRhdHVtLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSk7XG4gICAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy5tZWFuKGRhdHVtKSk7XG4gICAgICByZXR1cm4gYCR7eH0sJHt5fWA7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gJ00nICsgaW5zdHJ1Y3Rpb25zLmpvaW4oJ0wnKTtcbiAgfVxuXG4gIF9idWlsZFJhbmdlWm9uZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gZGF0YS5sZW5ndGg7XG4gICAgLy8gY29uc3QgbGFzdEluZGV4ID0gZGF0YVxuICAgIGxldCBpbnN0cnVjdGlvbnNTdGFydCA9ICcnO1xuICAgIGxldCBpbnN0cnVjdGlvbnNFbmQgPSAnJztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGRhdHVtID0gZGF0YVtpXTtcbiAgICAgIGNvbnN0IG1lYW4gPSB0aGlzLm1lYW4oZGF0dW0pO1xuICAgICAgY29uc3QgaGFsZlJhbmdlID0gdGhpcy5yYW5nZShkYXR1bSkgLyAyO1xuXG4gICAgICBjb25zdCB4ICA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSk7XG4gICAgICBjb25zdCB5MCA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKG1lYW4gKyBoYWxmUmFuZ2UpO1xuICAgICAgY29uc3QgeTEgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChtZWFuIC0gaGFsZlJhbmdlKTtcblxuICAgICAgY29uc3Qgc3RhcnQgPSBgJHt4fSwke3kwfWA7XG4gICAgICBjb25zdCBlbmQgICA9IGAke3h9LCR7eTF9YDtcblxuICAgICAgaW5zdHJ1Y3Rpb25zU3RhcnQgPSBpbnN0cnVjdGlvbnNTdGFydCA9PT0gJycgP1xuICAgICAgICBzdGFydCA6IGAke2luc3RydWN0aW9uc1N0YXJ0fUwke3N0YXJ0fWA7XG5cbiAgICAgIGluc3RydWN0aW9uc0VuZCA9IGluc3RydWN0aW9uc0VuZCA9PT0gJycgP1xuICAgICAgICBlbmQgOiBgJHtlbmR9TCR7aW5zdHJ1Y3Rpb25zRW5kfWA7XG4gICAgfVxuXG4gICAgbGV0IGluc3RydWN0aW9ucyA9IGBNJHtpbnN0cnVjdGlvbnNTdGFydH1MJHtpbnN0cnVjdGlvbnNFbmR9WmA7XG4gICAgcmV0dXJuIGluc3RydWN0aW9ucztcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuXG5cbmNvbnN0IHhodG1sTlMgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCc7XG5cbi8vIEBUT0RPIGNyZWF0ZSBzdHJhdGVnaWVzIG9iamVjdCB0byBjbGVhbiB0aGUgYGlmLi4uZWxzZWAgbWVzc1xuLy8gdmFyIHN2Z1N0cmF0ZWd5ID0ge1xuLy8gICByZW5kZXIoKSB7fSxcbi8vICAgdXBkYXRlKCkge31cbi8vIH07XG5cbi8vIHZhciBjYW52YXNTdHJhdGVneSA9IHtcbi8vICAgcmVuZGVyKCkge30sXG4vLyAgIHVwZGF0ZSgpIHt9XG4vLyB9O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXZlZm9ybSBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICd3YXZlZm9ybSc7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IHk6IDAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2FtcGxlUmF0ZTogNDQxMDAsXG4gICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIHJlbmRlcmluZ1N0cmF0ZWd5OiAnc3ZnJyAvLyBjYW52YXMgaXMgYnVnZ2VkICh0cmFuc2xhdGlvbiwgZXRjLi4uKVxuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbCkgeyByZXR1cm4gdGhpcy4kZWw7IH1cblxuICAgIGlmICh0aGlzLnBhcmFtcy5yZW5kZXJpbmdTdHJhdGVneSA9PT0gJ3N2ZycpIHtcblxuICAgICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3BhdGgnKTtcbiAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcbiAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLmNvbG9yKTtcbiAgICAgIHRoaXMuJGVsLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuXG4gICAgfSBlbHNlIGlmICh0aGlzLnBhcmFtcy5yZW5kZXJpbmdTdHJhdGVneSA9PT0gJ2NhbnZhcycpIHtcblxuICAgICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2ZvcmVpZ25PYmplY3QnKTtcbiAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHJlbmRlcmluZ0NvbnRleHQud2lkdGgpO1xuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0KTtcblxuICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHhodG1sTlMsICd4aHRtbDpjYW52YXMnKTtcblxuICAgICAgdGhpcy5fY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICB0aGlzLl9jdHguY2FudmFzLndpZHRoID0gcmVuZGVyaW5nQ29udGV4dC53aWR0aDtcbiAgICAgIHRoaXMuX2N0eC5jYW52YXMuaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG5cbiAgICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCBpbmRleCkge1xuICAgIC8vIGRlZmluZSBuYnIgb2Ygc2FtcGxlcyBwZXIgcGl4ZWxzXG4gICAgY29uc3Qgc2xpY2VNZXRob2QgPSBkYXR1bSBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSA/ICdzdWJhcnJheScgOiAnc2xpY2UnO1xuICAgIGNvbnN0IG5iclNhbXBsZXMgPSBkYXR1bS5sZW5ndGg7XG4gICAgY29uc3QgZHVyYXRpb24gPSBuYnJTYW1wbGVzIC8gdGhpcy5wYXJhbXMuc2FtcGxlUmF0ZTtcbiAgICBjb25zdCB3aWR0aCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoZHVyYXRpb24pO1xuICAgIGNvbnN0IHNhbXBsZXNQZXJQaXhlbCA9IG5iclNhbXBsZXMgLyB3aWR0aDtcbiAgICBsZXQgbWluTWF4ID0gW107XG4gICAgLy8gZ2V0IG1pbi9tYXggcGVyIHBpeGVsc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHdpZHRoOyBpKyspIHtcbiAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KGkpO1xuICAgICAgY29uc3Qgc3RhcnRTYW1wbGUgPSBzdGFydFRpbWUgKiB0aGlzLnBhcmFtcy5zYW1wbGVSYXRlO1xuXG4gICAgICBjb25zdCBleHRyYWN0ID0gZGF0dW1bc2xpY2VNZXRob2RdKHN0YXJ0U2FtcGxlLCBzdGFydFNhbXBsZSArIHNhbXBsZXNQZXJQaXhlbCk7XG4gICAgICBsZXQgbWluID0gSW5maW5pdHk7XG4gICAgICBsZXQgbWF4ID0gLUluZmluaXR5O1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBleHRyYWN0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGxldCBzYW1wbGUgPSBleHRyYWN0W2pdO1xuICAgICAgICBpZiAoc2FtcGxlIDwgbWluKSB7IG1pbiA9IHNhbXBsZTsgfVxuICAgICAgICBpZiAoc2FtcGxlID4gbWF4KSB7IG1heCA9IHNhbXBsZTsgfVxuICAgICAgfVxuICAgICAgLy8gZGlzYWxsb3cgSW5maW5pdHlcbiAgICAgIG1pbiA9IChtaW4gPT09IEluZmluaXR5IHx8IG1pbiA9PT0gLUluZmluaXR5KSA/IDAgOiBtaW47XG4gICAgICBtYXggPSAobWF4ID09PSBJbmZpbml0eSB8fCBtYXggPT09IC1JbmZpbml0eSkgPyAwIDogbWF4O1xuXG4gICAgICBtaW5NYXgucHVzaCh7IHRpbWU6IHN0YXJ0VGltZSwgdmFsdWVzOiBbbWluLCBtYXhdIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IE1JTiA9IDA7XG4gICAgY29uc3QgTUFYID0gMTtcblxuICAgIC8vIHJlZG5lcmluZyBzdHJhdGVnaWVzXG4gICAgaWYgKHRoaXMucGFyYW1zLnJlbmRlcmluZ1N0cmF0ZWd5ID09PSAnc3ZnJykge1xuXG4gICAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gbWluTWF4Lm1hcCgoZGF0dW0sIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IHggID0gTWF0aC5mbG9vcihyZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKGRhdHVtLnRpbWUpKTtcbiAgICAgICAgbGV0IHkxID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLnkoZGF0dW0udmFsdWVzW01JTl0pKSk7XG4gICAgICAgIGxldCB5MiA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy55KGRhdHVtLnZhbHVlc1tNQVhdKSkpO1xuXG4gICAgICAgIHJldHVybiBgJHt4fSwke3kxfUwke3h9LCR7eTJ9YDtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBkID0gJ00nICsgaW5zdHJ1Y3Rpb25zLmpvaW4oJ0wnKTtcbiAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgZCk7XG5cbiAgICB9IGVsc2UgaWYgKHRoaXMucGFyYW1zLnJlbmRlcmluZ1N0cmF0ZWd5ID09PSAnY2FudmFzJykge1xuXG4gICAgICB0aGlzLl9jdHguY2FudmFzLndpZHRoID0gd2lkdGg7XG4gICAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgd2lkdGgpO1xuICAgICAgLy8gZml4IGNocm9tZSBidWcgd2l0aCB0cmFuc2xhdGVcbiAgICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignY2hyb21lJykgPiAtMSkge1xuICAgICAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGUoJ3gnLCByZW5kZXJpbmdDb250ZXh0Lm9mZnNldFgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9jdHguc3Ryb2tlU3R5bGUgPSB0aGlzLnBhcmFtcy5jb2xvcjtcbiAgICAgIHRoaXMuX2N0eC5nbG9iYWxBbHBoYSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG4gICAgICB0aGlzLl9jdHgubW92ZVRvKHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoMCksIHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKDApKTtcblxuICAgICAgbWluTWF4LmZvckVhY2goKGRhdHVtKSA9PiB7XG4gICAgICAgIGNvbnN0IHggID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChkYXR1bS50aW1lKTtcbiAgICAgICAgY29uc3QgeTEgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLnkoZGF0dW0udmFsdWVzW01JTl0pKTtcbiAgICAgICAgY29uc3QgeTIgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLnkoZGF0dW0udmFsdWVzW01BWF0pKTtcblxuICAgICAgICB0aGlzLl9jdHgubW92ZVRvKHgsIHkxKTtcbiAgICAgICAgdGhpcy5fY3R4LmxpbmVUbyh4LCB5Mik7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fY3R4LnN0cm9rZSgpO1xuICAgIH1cbiAgfVxufVxuIiwiLyoqXG4qIGBTdGF0ZWAgaW5zdGFuY2VzIGFyZSB1c2VkIHRvIGRlZmluZSB0aGUgYXBwbGljYXRpb24gbG9naWMgYnkgcHJlY2lzaW5nIHNwZWNpZmljIHVzZXIgaW50ZXJhY3Rpb24gY2FzZXMsIGFuZCBob3cgdGhleSBpbXBhY3QgdGhlIG92ZXJhbCB0ZW1wb3JhbCByZXByZXNlbnRhdGlvbi5cbiogU3RhdGVzIG1hbmFnZSBpbnRlcmFjdGlvbnMgbGlrZSB6b29taW5nLCBicm93c2luZywgb3IgZWRpdGluZyB0aGUgdGltZWxpbmUuXG4qIEN1c3RvbWl6ZWQgc3RhdGVzIHNob3VsZCBleHRlbmQgdGhpcyBCYXNlU3RhdGUuXG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMudGltZWxpbmUgPSB0aW1lbGluZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGltZWxpbmUgdmlld3NcbiAgICovXG4gIGdldCB0cmFja3MoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZWxpbmUudHJhY2tzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aW1lbGluZSBsYXllcnNcbiAgICovXG4gIGdldCBsYXllcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZWxpbmUudHJhY2tzLmxheWVycztcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgdGltZWxpbmUgaXMgZW50ZXJpbmcgdGhlIHN0YXRlXG4gICAqL1xuICBlbnRlcigpIHt9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSB0aW1lbGluZSBpcyBsZWF2aW5nIHRoZSBzdGF0ZVxuICAgKi9cbiAgZXhpdCgpIHt9XG5cbiAgLyoqXG4gICAqIGhhbmRsZSByZWdpc3RlcmVkIGlucHV0cyBmcm9tIG1vdXNlIGFuZCBrZXlib2FyZFxuICAgKiBAcGFyYW0ge0V2ZW50fSBlIC0gdGhlIGV2ZW50IHRvIHByb2Nlc3NcbiAgICovXG4gIGhhbmRsZUV2ZW50KGUpIHt9XG59XG4iLCJpbXBvcnQgbnMgZnJvbSAnLi4vY29yZS9uYW1lc3BhY2UnO1xuaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuXG5cbi8qKlxuICogUHJvdG9vbHMgbGlrZSB6b29tIHdpdGggem9uZSBzZWxlY3Rpb25cbiAqIFByZXNzIHNwYWNlIGJhciB0byByZXNldCB6b29tIGRlZmF1bHQgKDEpXG4gKiBAVE9ETyBjb3VsZCBhbHNvIGhhbmRsZSAnZycgYW5kICdoJyBrZXkgdG8gem9vbSwgZGUtem9vbVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcnVzaFpvb21TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAna2V5ZG93bic6XG4gICAgICAgIHRoaXMub25LZXlEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgdGhpcy5icnVzaGVzID0gW107XG4gICAgdGhpcy5zdGFydFggPSBlLng7XG4gICAgLy8gY3JlYXRlIGJydXNoIGluIGVhY2ggY29udGFpbmVyc1xuICAgIHRoaXMudHJhY2tzLmZvckVhY2goKHRyYWNrKSA9PiB7XG4gICAgICBjb25zdCBpbnRlcmFjdGlvbnMgPSB0cmFjay4kaW50ZXJhY3Rpb25zO1xuXG4gICAgICBjb25zdCBicnVzaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICAgIGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCB0cmFjay5oZWlnaHQpO1xuICAgICAgYnJ1c2guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCAwKTtcbiAgICAgIGJydXNoLnN0eWxlLmZpbGwgPSAnIzc4Nzg3OCc7XG4gICAgICBicnVzaC5zdHlsZS5vcGFjaXR5ID0gMC4yO1xuXG4gICAgICBpbnRlcmFjdGlvbnMuYXBwZW5kQ2hpbGQoYnJ1c2gpO1xuXG4gICAgICB0aGlzLmJydXNoZXMucHVzaChicnVzaCk7XG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgLy8gdXBkYXRlIGJydXNoXG4gICAgY29uc3Qgd2lkdGggPSBNYXRoLmFicyhlLnggLSB0aGlzLnN0YXJ0WCk7XG4gICAgY29uc3QgeCA9IE1hdGgubWluKGUueCwgdGhpcy5zdGFydFgpO1xuXG4gICAgdGhpcy5icnVzaGVzLmZvckVhY2goKGJydXNoKSA9PiB7XG4gICAgICBicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgICBicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIHgpO1xuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICAvLyByZW1vdmUgYnJ1c2hcbiAgICB0aGlzLmJydXNoZXMuZm9yRWFjaCgoYnJ1c2gpID0+IHtcbiAgICAgIGJydXNoLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYnJ1c2gpO1xuICAgIH0pO1xuXG4gICAgLy8gdXBkYXRlIHRpbWVDb250ZXh0XG4gICAgY29uc3Qgc3RhcnRYID0gdGhpcy5zdGFydFg7XG4gICAgY29uc3QgZW5kWCA9IGUueDtcbiAgICAvLyByZXR1cm4gaWYgbm8gZHJhZ1xuICAgIGlmIChNYXRoLmFicyhzdGFydFggLSBlbmRYKSA8IDEpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBsZWZ0WCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHN0YXJ0WCwgZW5kWCkpO1xuICAgIGNvbnN0IHJpZ2h0WCA9IE1hdGgubWF4KHN0YXJ0WCwgZW5kWCk7XG5cbiAgICBsZXQgbWluVGltZSA9IHRoaXMudGltZWxpbmUudGltZVRvUGl4ZWwuaW52ZXJ0KGxlZnRYKTtcbiAgICBsZXQgbWF4VGltZSA9IHRoaXMudGltZWxpbmUudGltZVRvUGl4ZWwuaW52ZXJ0KHJpZ2h0WCk7XG5cbiAgICBjb25zdCBkZWx0YUR1cmF0aW9uID0gbWF4VGltZSAtIG1pblRpbWU7XG4gICAgY29uc3Qgem9vbSA9IHRoaXMudGltZWxpbmUudmlzaWJsZUR1cmF0aW9uIC8gZGVsdGFEdXJhdGlvbjtcblxuICAgIHRoaXMudGltZWxpbmUub2Zmc2V0IC09IG1pblRpbWU7XG4gICAgdGhpcy50aW1lbGluZS56b29tICo9IHpvb207XG5cbiAgICB0aGlzLnRyYWNrcy51cGRhdGUoKTtcbiAgfVxuXG4gIG9uS2V5RG93bihlKSB7XG4gICAgLy8gcmVzZXQgb24gc3BhY2UgYmFyXG4gICAgaWYgKGUub3JpZ2luYWxFdmVudC5rZXlDb2RlID09PSAzMikge1xuICAgICAgdGhpcy50aW1lbGluZS5vZmZzZXQgPSAwO1xuICAgICAgdGhpcy50aW1lbGluZS56b29tID0gMTtcbiAgICAgIHRoaXMudHJhY2tzLnVwZGF0ZSgpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHNjYWxlcyBmcm9tICcuLi91dGlscy9zY2FsZXMnO1xuaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuXG5cbi8qKlxuICogYENlbnRlcmVkWm9vbVN0YXRlYCBpcyBhIHRpbWVsaW5lIHN0YXRlIHRoYXQgYWxsb3dzIHRoZSB1c2VyIHRvIGJyb3dzZSB0aGUgdGltZWxpbmUgYnkgY2xpY2tpbmcgb24gYSB0cmFjaywgYW5kIHRoZW5cbiAqIC0gbW92aW5nIGRvd24gdG8gem9vbSBpblxuICogLSBtb3ZpbmcgdXAgdG8gem9vbSBvdXRcbiAqIC0gbW92aW5nIGxlZnQgdG8gbW92ZSBpbiB0aW1lLCBhZnRlclxuICogLSBtb3ZpbmcgcmlnaHQgdG8gbW92ZSBpbiB0aW1lLCBiZWZvcmVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2VudGVyZWRab29tU3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcbiAgICB0aGlzLmN1cnJlbnRMYXllciA9IG51bGw7XG4gICAgLy8gU2V0IG1heC9taW4gem9vbVxuICAgIC8vIG1heFpvb206IDFweCBwZXIgc2FtcGxlXG4gICAgLy8gbWluWm9vbTogMTAgMDAwIHB4IHBlciAxIGhvdXJcbiAgICAvLyB3aXRoIGEgZGVmYXVsdCB0byA0NC4xa0h6IHNhbXBsZSByYXRlXG4gICAgdGhpcy5tYXhab29tID0gNDQxMDAgKiAxIC8gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC5waXhlbHNQZXJTZWNvbmQ7XG4gICAgdGhpcy5taW5ab29tID0gMTAwMDAgLyAzNjAwIC8gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC5waXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMuaW5pdGlhbFpvb20gPSB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0Lnpvb207XG4gICAgdGhpcy5pbml0aWFsWSA9IGUueTtcblxuICAgIHRoaXMuX3BpeGVsVG9FeHBvbmVudCA9IHNjYWxlcy5saW5lYXIoKVxuICAgICAgLmRvbWFpbihbMCwgMTAwXSkgLy8gMTAwcHggPT4gZmFjdG9yIDJcbiAgICAgIC5yYW5nZShbMCwgMV0pO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dDtcbiAgICBjb25zdCBsYXN0Q2VudGVyVGltZSA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChlLngpO1xuICAgIGNvbnN0IGV4cG9uZW50ID0gdGhpcy5fcGl4ZWxUb0V4cG9uZW50KGUueSAtIHRoaXMuaW5pdGlhbFkpO1xuICAgIGNvbnN0IHRhcmdldFpvb20gPSB0aGlzLmluaXRpYWxab29tICogTWF0aC5wb3coMiwgZXhwb25lbnQpOyAvLyAtMS4uLjEgLT4gMS8yLi4uMlxuXG4gICAgdGltZUNvbnRleHQuem9vbSA9IE1hdGgubWluKE1hdGgubWF4KHRhcmdldFpvb20sIHRoaXMubWluWm9vbSksIHRoaXMubWF4Wm9vbSk7XG5cbiAgICBjb25zdCBuZXdDZW50ZXJUaW1lID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KGUueCk7XG4gICAgY29uc3QgZGVsdGEgPSBuZXdDZW50ZXJUaW1lIC0gbGFzdENlbnRlclRpbWU7XG5cbiAgICAvLyBBcHBseSBuZXcgb2Zmc2V0IHRvIGtlZXAgaXQgY2VudGVyZWQgdG8gdGhlIG1vdXNlXG4gICAgdGltZUNvbnRleHQub2Zmc2V0ICs9IChkZWx0YSArIHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChlLmR4KSk7XG5cbiAgICAvLyBPdGhlciBwb3NzaWJsZSBleHBlcmltZW50cyB3aXRoIGNlbnRlcmVkLXpvb20tc3RhdGVcbiAgICAvL1xuICAgIC8vIEV4YW1wbGUgMTogUHJldmVudCB0aW1lbGluZS5vZmZzZXQgdG8gYmUgbmVnYXRpdmVcbiAgICAvLyB0aW1lQ29udGV4dC5vZmZzZXQgPSBNYXRoLm1pbih0aW1lQ29udGV4dC5vZmZzZXQsIDApO1xuICAgIC8vXG4gICAgLy8gRXhhbXBsZSAyOiBLZWVwIGluIGNvbnRhaW5lciB3aGVuIHpvb21lZCBvdXRcbiAgICAvLyBpZiAodGltZUNvbnRleHQuc3RyZXRjaFJhdGlvIDwgMSnCoHtcbiAgICAvLyAgIGNvbnN0IG1pbk9mZnNldCA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCgwKTtcbiAgICAvLyAgIGNvbnN0IG1heE9mZnNldCA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh2aWV3LndpZHRoIC0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwodGltZUNvbnRleHQuZHVyYXRpb24pKTtcbiAgICAvLyAgIHRpbWVDb250ZXh0Lm9mZnNldCA9IE1hdGgubWF4KHRpbWVDb250ZXh0Lm9mZnNldCwgbWluT2Zmc2V0KTtcbiAgICAvLyAgIHRpbWVDb250ZXh0Lm9mZnNldCA9IE1hdGgubWluKHRpbWVDb250ZXh0Lm9mZnNldCwgbWF4T2Zmc2V0KTtcbiAgICAvLyB9XG5cbiAgICB0aGlzLnRpbWVsaW5lLnRyYWNrcy51cGRhdGUoKTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7fVxufVxuIiwiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuaW1wb3J0IFRpbWVDb250ZXh0QmVoYXZpb3IgZnJvbSAnLi4vYmVoYXZpb3JzL3RpbWUtY29udGV4dC1iZWhhdmlvcic7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGV4dEVkaXRpb25TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLm1vdXNlRG93biA9IHRydWU7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gZS50YXJnZXQ7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubGF5ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgbGF5ZXIgPSB0aGlzLmxheWVyc1tpXTtcbiAgICAgIGlmIChsYXllci5oYXNFbGVtZW50KGUudGFyZ2V0KSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRMYXllciA9IGxheWVyO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgaWYgKCF0aGlzLm1vdXNlRG93biB8fMKgIXRoaXMuY3VycmVudExheWVyKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgbGF5ZXIgPSB0aGlzLmN1cnJlbnRMYXllcjtcbiAgICBjb25zdCB0YXJnZXQgPSB0aGlzLmN1cnJlbnRUYXJnZXQ7XG5cbiAgICAvLyBpbiB0aGlzIGV4YW1wbGUgdGhlIGNvbnRleHQgaXMgc3RyZXRjaGVkIHdoZW4gc2hpZnQgaXMgcHJlc3NlZFxuICAgIGlmICghZS5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICBsYXllci5lZGl0Q29udGV4dChlLmR4LCBlLmR5LCB0YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXllci5zdHJldGNoQ29udGV4dChlLmR4LCBlLmR5LCB0YXJnZXQpO1xuICAgIH1cblxuICAgIHRoaXMudGltZWxpbmUudHJhY2tzLnVwZGF0ZShsYXllcik7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRMYXllciA9IG51bGw7XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlU3RhdGUgZnJvbSAnLi9iYXNlLXN0YXRlJztcblxuXG4vKipcbiAqICBEb2VzIG5vdCBoYW5kbGUgc2VsZWN0aW9uLCBtdXN0IGJlIHVzZWQgaW4gY29uam9uY3Rpb24gd2l0aCBhIHNlbGVjdGlvblN0YXRlIG9mIHNvbWUgc29ydFxuICogIGNvdWxkIG1heWJlIGJlIG1lcmdlZCB3aXRoIHRoZSBTZWxlY3Rpb25TdGF0ZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0aW9uU3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcblxuICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICB9XG5cbiAgZW50ZXIoKSB7fVxuICBleGl0KCkge31cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBlLnRhcmdldDtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgY29uc3QgaXRlbXMgPSBsYXllci5zZWxlY3RlZEl0ZW1zO1xuXG4gICAgICBsYXllci5lZGl0KGl0ZW1zLCBlLmR4LCBlLmR5LCB0aGlzLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgbGF5ZXIudXBkYXRlKGl0ZW1zKTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIgPSBudWxsO1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydCBCYXNlU3RhdGUgZnJvbSAnLi9iYXNlLXN0YXRlJztcbmltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VsZWN0aW9uU3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSAvKiwgb3B0aW9ucyA9IHt9ICovKSB7XG4gICAgc3VwZXIodGltZWxpbmUgLyosIG9wdGlvbnMgKi8pO1xuXG4gICAgdGhpcy5jdXJyZW50TGF5ZXIgPSBudWxsO1xuICAgIC8vIG5lZWQgYSBjYWNoZWRcbiAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSBudWxsO1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gICAgdGhpcy5zaGlmdEtleSA9IGZhbHNlO1xuXG4gICAgdGhpcy5fbGF5ZXJTZWxlY3RlZEl0ZW1zTWFwID0gbmV3IE1hcCgpO1xuICB9XG5cbiAgZW50ZXIoKSB7XG5cbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgY29uc3QgY29udGFpbmVycyA9IHRoaXMudGltZWxpbmUuY29udGFpbmVycztcblxuICAgIGZvciAobGV0IGlkIGluIGNvbnRhaW5lcnMpIHtcbiAgICAgIHRoaXMuX3JlbW92ZUJydXNoKGNvbnRhaW5lcnNbaWRdKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY2xpY2snOlxuICAgICAgICB0aGlzLm9uQ2xpY2soZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAna2V5ZG93bic6XG4gICAgICAgIHRoaXMub25LZXkoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAna2V5dXAnOlxuICAgICAgICB0aGlzLm9uS2V5KGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBfYWRkQnJ1c2godHJhY2spIHtcbiAgICBpZiAodHJhY2suJGJydXNoKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgYnJ1c2ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdyZWN0Jyk7XG4gICAgYnJ1c2guc3R5bGUuZmlsbCA9ICcjNjg2ODY4JztcbiAgICBicnVzaC5zdHlsZS5vcGFjaXR5ID0gMC4yO1xuXG4gICAgdHJhY2suJGludGVyYWN0aW9ucy5hcHBlbmRDaGlsZChicnVzaCk7XG4gICAgdHJhY2suJGJydXNoID0gYnJ1c2g7XG4gIH1cblxuICBfcmVtb3ZlQnJ1c2godHJhY2spIHtcbiAgICBpZiAodHJhY2suJGJydXNoID09PSBudWxsKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5fcmVzZXRCcnVzaCh0cmFjayk7XG4gICAgdHJhY2suJGludGVyYWN0aW9ucy5yZW1vdmVDaGlsZCh0cmFjay4kYnJ1c2gpO1xuICAgIGRlbGV0ZSB0cmFjay4kYnJ1c2g7XG4gIH1cblxuICBfcmVzZXRCcnVzaCh0cmFjaykge1xuICAgIGNvbnN0ICRicnVzaCA9IHRyYWNrLiRicnVzaDtcbiAgICAvLyByZXNldCBicnVzaCBlbGVtZW50XG4gICAgJGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsIDApJyk7XG4gICAgJGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIDApO1xuICAgICRicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgMCk7XG4gIH1cblxuICBfdXBkYXRlQnJ1c2goZSwgdHJhY2spIHtcbiAgICBjb25zdCAkYnJ1c2ggPSB0cmFjay4kYnJ1c2g7XG4gICAgY29uc3QgdHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgke2UuYXJlYS5sZWZ0fSwgJHtlLmFyZWEudG9wfSlgO1xuXG4gICAgJGJydXNoLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGUpO1xuICAgICRicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCBlLmFyZWEud2lkdGgpO1xuICAgICRicnVzaC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgZS5hcmVhLmhlaWdodCk7XG4gIH1cblxuICBvbktleShlKSB7XG4gICAgdGhpcy5zaGlmdEtleSA9IGUuc2hpZnRLZXk7XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgdGhpcy5fY3VycmVudFRyYWNrID0gdGhpcy50aW1lbGluZS5nZXRUcmFja0Zyb21ET01FbGVtZW50KGUudGFyZ2V0KTtcbiAgICBpZiAoIXRoaXMuX2N1cnJlbnRUcmFjaykgeyByZXR1cm47IH1cblxuICAgIHRoaXMuX2FkZEJydXNoKHRoaXMuX2N1cnJlbnRUcmFjayk7XG5cbiAgICAvLyByZWNyZWF0ZSB0aGUgbWFwXG4gICAgdGhpcy5fbGF5ZXJTZWxlY3RlZEl0ZW1zTWFwID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX2N1cnJlbnRUcmFjay5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIHRoaXMuX2xheWVyU2VsZWN0ZWRJdGVtc01hcC5zZXQobGF5ZXIsIGxheWVyLnNlbGVjdGVkSXRlbXMuc2xpY2UoMCkpO1xuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIHRoaXMuX3VwZGF0ZUJydXNoKGUsIHRoaXMuX2N1cnJlbnRUcmFjayk7XG5cbiAgICB0aGlzLl9jdXJyZW50VHJhY2subGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50U2VsZWN0aW9uID0gbGF5ZXIuc2VsZWN0ZWRJdGVtcztcbiAgICAgIGNvbnN0IGN1cnJlbnRJdGVtcyA9IGxheWVyLmdldEl0ZW1zSW5BcmVhKGUuYXJlYSk7XG5cbiAgICAgIC8vIGlmIGlzIG5vdCBwcmVzc2VkXG4gICAgICBpZiAoIWUub3JpZ2luYWxFdmVudC5zaGlmdEtleSkge1xuICAgICAgICBsYXllci51bnNlbGVjdChjdXJyZW50U2VsZWN0aW9uKTtcbiAgICAgICAgbGF5ZXIuc2VsZWN0KGN1cnJlbnRJdGVtcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0b1NlbGVjdCA9IFtdO1xuICAgICAgICBjb25zdCB0b1Vuc2VsZWN0ID0gW107XG4gICAgICAgIC8vIHVzZSB0aGUgc2VsZWN0aW9uIGZyb20gdGhlIHByZXZpb3VzIGRyYWdcbiAgICAgICAgY29uc3QgcHJldmlvdXNTZWxlY3Rpb24gPSB0aGlzLl9sYXllclNlbGVjdGVkSXRlbXNNYXAuZ2V0KGxheWVyKTtcbiAgICAgICAgLy8gdG9VbnNlbGVjdCA9IHRvVW5zZWxlY3QuY29uY2F0KHByZXZpb3VzU2VsZWN0ZWRJdGVtcyk7XG5cbiAgICAgICAgY3VycmVudEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICBpZiAocHJldmlvdXNTZWxlY3Rpb24uaW5kZXhPZihpdGVtKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHRvU2VsZWN0LnB1c2goaXRlbSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvVW5zZWxlY3QucHVzaChpdGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGN1cnJlbnRTZWxlY3Rpb24uZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGN1cnJlbnRJdGVtcy5pbmRleE9mKGl0ZW0pID09PSAtMSAmJlxuICAgICAgICAgICAgcHJldmlvdXNTZWxlY3Rpb24uaW5kZXhPZihpdGVtKSA9PT0gLTFcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRvVW5zZWxlY3QucHVzaChpdGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxheWVyLnVuc2VsZWN0KHRvVW5zZWxlY3QpO1xuICAgICAgICBsYXllci5zZWxlY3QodG9TZWxlY3QpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICB0aGlzLl9yZW1vdmVCcnVzaCh0aGlzLl9jdXJyZW50VHJhY2spO1xuICB9XG5cbiAgb25DbGljayhlKSB7XG4gICAgaWYgKCF0aGlzLl9jdXJyZW50VHJhY2spIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl9jdXJyZW50VHJhY2subGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBsZXQgaXRlbSA9IGxheWVyLmdldEl0ZW1Gcm9tRE9NRWxlbWVudChlLnRhcmdldCk7XG5cbiAgICAgIGlmICghZS5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgIGxheWVyLnVuc2VsZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgIGxheWVyLnRvZ2dsZVNlbGVjdGlvbihpdGVtKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuXG5cbi8qKlxuICogIGEgc2ltcGxlIHBsdWcgYW5kIHBsYXkgc3RhdGUgLSBzZWxlY3QgYW5kIGVkaXRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2ltcGxlRWRpdGlvblN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG5cbiAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgfVxuXG4gIGVudGVyKCkge31cbiAgZXhpdCgpIHt9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgLy8ga2VlcCB0YXJnZXQgY29uc2lzdGVudCB3aXRoIG1vdXNlIGRvd25cbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBlLnRhcmdldDtcblxuICAgIHRoaXMubGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBpZiAoIWxheWVyLmhhc0VsZW1lbnQodGhpcy5jdXJyZW50VGFyZ2V0KSkgeyByZXR1cm47IH1cblxuICAgICAgaWYgKCFlLm9yaWdpbmFsRXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgbGF5ZXIudW5zZWxlY3QoKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaXRlbSA9IGxheWVyLmdldEl0ZW1Gcm9tRE9NRWxlbWVudCh0aGlzLmN1cnJlbnRUYXJnZXQpO1xuXG4gICAgICBpZiAoaXRlbSA9PT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgICAgdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIgPSBsYXllcjtcbiAgICAgIGxheWVyLnNlbGVjdChpdGVtKTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICBpZiAoIXRoaXMuY3VycmVudEVkaXRlZExheWVyKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgbGF5ZXIgPSB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllcjtcbiAgICBjb25zdCBpdGVtcyA9IGxheWVyLnNlbGVjdGVkSXRlbXM7XG5cbiAgICBsYXllci5lZGl0KGl0ZW1zLCBlLmR4LCBlLmR5LCB0aGlzLmN1cnJlbnRUYXJnZXQpO1xuICAgIGxheWVyLnVwZGF0ZShpdGVtcyk7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge1xuICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbnVsbDtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQge1xuICBwYWRMZWZ0KGlucHV0LCBzaWduLCBsZW5ndGgpIHtcbiAgICBpbnB1dCArPSAnJztcbiAgICB3aGlsZSAoaW5wdXQubGVuZ3RoIDwgbGVuZ3RoKSB7XG4gICAgICBpbnB1dCA9IHNpZ24gKyBpbnB1dDtcbiAgICB9XG4gICAgcmV0dXJuIGlucHV0O1xuICB9XG59OyIsIi8qKlxuICogT3J0aG9nb25hbERhdGEgdHJhbnNmb3JtcyBhbiBvYmplY3Qgb2YgYXJyYXlzIGB7Zm9vOiBbMSwgMl0sIGJhcjogWzMsIDRdfWBcbiAqIHRvIG9yIGZyb20gYW4gYXJyYXkgb2Ygb2JqZWN0cyBgW3tmb286IDEsIGJhcjogM30sIHtmb286IDIsIGJhcjogNH1dYFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPcnRob2dvbmFsRGF0YSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2NvbHMgPSBudWxsOyAvLyBPYmplY3Qgb2YgYXJyYXlzXG4gICAgdGhpcy5fcm93cyA9IG51bGw7IC8vIEFycmF5IG9mIG9iamVjdHNcbiAgfVxuXG4gIC8vIHZlcmlmeSB0aGF0IGRhdGEgYXJlIGNvbnNpc3RlbnRzXG4gIF9jaGVja0NvbnNpc3RlbmN5KCkge1xuICAgIGxldCBzaXplID0gbnVsbDtcblxuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLl9jb2xzKSB7XG4gICAgICBjb25zdCBjb2wgPSB0aGlzLl9jb2xzW2tleV07XG4gICAgICBjb25zdCBjb2xMZW5ndGggPSBjb2wubGVuZ3RoO1xuXG4gICAgICBpZiAoc2l6ZSAhPT0gbnVsbCAmJiBzaXplICE9PSBjb2xMZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMucHJvdG90eXBlLmNvbnN0cnVjdG9yLm5hbWV9OiBpbmNvbnNpc3RlbnQgZGF0YWApO1xuICAgICAgfSBlbHNlIGlmIChzaXplID09PSBudWxsKSB7XG4gICAgICAgIHNpemUgPSBjb2xMZW5ndGg7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhcnJheSBvZiBvYmplY3RzIGZyb20gb2JqZWN0IG9mIGFycmF5c1xuICAgKi9cbiAgdXBkYXRlRnJvbUNvbHMoKSB7XG4gICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLl9jb2xzKTtcblxuICAgIGtleXMuZm9yRWFjaCgoa2V5LCBpKSA9PiB7XG4gICAgICBjb25zdCBjb2wgPSB0aGlzLl9jb2xzW2tleV07XG5cbiAgICAgIGNvbC5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX3Jvd3NbaW5kZXhdID09PSB1bmRlZmluZWQpIHRoaXMuX3Jvd3NbaW5kZXhdID0ge307XG4gICAgICAgIHRoaXMuX3Jvd3NbaW5kZXhdW2tleV0gPSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fY2hlY2tDb25zaXN0ZW5jeSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBvYmplY3Qgb2YgYXJyYXlzIGZyb20gYXJyYXkgb2Ygb2JqZWN0c1xuICAgKi9cbiAgdXBkYXRlRnJvbVJvd3MoKSB7XG4gICAgdGhpcy5fcm93cy5mb3JFYWNoKChvYmosIGluZGV4KSA9PiB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkgdGhpcy5fY29sc1trZXldID0gW107XG4gICAgICAgIHRoaXMuX2NvbHNba2V5XS5wdXNoKG9ialtrZXldKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuX2NoZWNrQ29uc2lzdGVuY3koKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgYW4gb2JqZWN0IG9mIGFycmF5c1xuICAgKi9cbiAgc2V0IGNvbHMob2JqKSB7XG4gICAgdGhpcy5fY29scyA9IG9iajtcbiAgICB0aGlzLl9yb3dzID0gW107XG5cbiAgICB0aGlzLnVwZGF0ZUZyb21Db2xzKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IGFuIGFycmF5IG9mIG9iamVjdHNcbiAgICovXG4gIHNldCByb3dzKGFycikge1xuICAgIHRoaXMuX3Jvd3MgPSBhcnI7XG4gICAgdGhpcy5fY29scyA9IHt9O1xuXG4gICAgdGhpcy51cGRhdGVGcm9tUm93cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbiBvYmplY3Qgb2YgYXJyYXlzXG4gICAqL1xuICBnZXQgY29scygpIHtcbiAgICByZXR1cm4gdGhpcy5fY29scztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYW4gYXJyYXkgb2Ygb2JqZWN0c1xuICAgKi9cbiAgZ2V0IHJvd3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Jvd3M7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgbGluZWFyKCkge1xuICAgIGxldCBfZG9tYWluID0gWzAsIDFdO1xuICAgIGxldCBfcmFuZ2UgPSBbMCwgMV07XG5cbiAgICBsZXQgX3Nsb3BlID0gMTtcbiAgICBsZXQgX2ludGVyY2VwdCA9IDA7XG5cbiAgICBmdW5jdGlvbiBfdXBkYXRlQ29lZnMoKSB7XG4gICAgICBfc2xvcGUgPSAoX3JhbmdlWzFdIC0gX3JhbmdlWzBdKSAvIChfZG9tYWluWzFdIC0gX2RvbWFpblswXSk7XG4gICAgICBfaW50ZXJjZXB0ID0gX3JhbmdlWzBdIC0gKF9zbG9wZSAqIF9kb21haW5bMF0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjYWxlICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIChfc2xvcGUgKiB2YWx1ZSkgKyBfaW50ZXJjZXB0O1xuICAgIH1cblxuICAgIHNjYWxlLmludmVydCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gKHZhbHVlIC0gX2ludGVyY2VwdCkgLyBfc2xvcGU7XG4gICAgfTtcblxuICAgIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKGFyciA9IG51bGwpIHtcbiAgICAgIGlmIChhcnIgPT09IG51bGwpIHsgcmV0dXJuIF9kb21haW47IH1cblxuICAgICAgX2RvbWFpbiA9IGFycjtcbiAgICAgIF91cGRhdGVDb2VmcygpO1xuXG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIHNjYWxlLnJhbmdlID0gZnVuY3Rpb24oYXJyID0gbnVsbCkge1xuICAgICAgaWYgKGFyciA9PT0gbnVsbCkgeyByZXR1cm4gX3JhbmdlOyB9XG5cbiAgICAgIF9yYW5nZSA9IGFycjtcbiAgICAgIF91cGRhdGVDb2VmcygpO1xuXG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIHJldHVybiBzY2FsZTtcbiAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9hcnJheS9mcm9tXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL2dldC1pdGVyYXRvclwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9tYXBcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2Fzc2lnblwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvY3JlYXRlXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9kZWZpbmUtcHJvcGVydHlcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2dldC1vd24tcHJvcGVydHktZGVzY3JpcHRvclwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3Qva2V5c1wiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3Qvc2V0LXByb3RvdHlwZS1vZlwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9wcm9taXNlXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL3NldFwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9zeW1ib2xcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vc3ltYm9sL2l0ZXJhdG9yXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfT2JqZWN0JGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZGVmaW5lLXByb3BlcnR5XCIpW1wiZGVmYXVsdFwiXTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSAoZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcblxuICAgICAgX09iamVjdCRkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9O1xufSkoKTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9PYmplY3QkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yXCIpW1wiZGVmYXVsdFwiXTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBmdW5jdGlvbiBnZXQoX3gsIF94MiwgX3gzKSB7XG4gIHZhciBfYWdhaW4gPSB0cnVlO1xuXG4gIF9mdW5jdGlvbjogd2hpbGUgKF9hZ2Fpbikge1xuICAgIHZhciBvYmplY3QgPSBfeCxcbiAgICAgICAgcHJvcGVydHkgPSBfeDIsXG4gICAgICAgIHJlY2VpdmVyID0gX3gzO1xuICAgIGRlc2MgPSBwYXJlbnQgPSBnZXR0ZXIgPSB1bmRlZmluZWQ7XG4gICAgX2FnYWluID0gZmFsc2U7XG4gICAgaWYgKG9iamVjdCA9PT0gbnVsbCkgb2JqZWN0ID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4gICAgdmFyIGRlc2MgPSBfT2JqZWN0JGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTtcblxuICAgIGlmIChkZXNjID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBwYXJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3ggPSBwYXJlbnQ7XG4gICAgICAgIF94MiA9IHByb3BlcnR5O1xuICAgICAgICBfeDMgPSByZWNlaXZlcjtcbiAgICAgICAgX2FnYWluID0gdHJ1ZTtcbiAgICAgICAgY29udGludWUgX2Z1bmN0aW9uO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIHtcbiAgICAgIHJldHVybiBkZXNjLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7XG5cbiAgICAgIGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9PYmplY3QkY3JlYXRlID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvY3JlYXRlXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9PYmplY3Qkc2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9zZXQtcHJvdG90eXBlLW9mXCIpW1wiZGVmYXVsdFwiXTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBmdW5jdGlvbiAoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gX09iamVjdCRjcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIF9PYmplY3Qkc2V0UHJvdG90eXBlT2YgPyBfT2JqZWN0JHNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG59O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICBcImRlZmF1bHRcIjogb2JqXG4gIH07XG59O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX0FycmF5JGZyb20gPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL2FycmF5L2Zyb21cIilbXCJkZWZhdWx0XCJdO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIGFycjJbaV0gPSBhcnJbaV07XG5cbiAgICByZXR1cm4gYXJyMjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gX0FycmF5JGZyb20oYXJyKTtcbiAgfVxufTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LmFycmF5LmZyb20nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kJykuY29yZS5BcnJheS5mcm9tOyIsInJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2NvcmUuaXRlci1oZWxwZXJzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvJCcpLmNvcmUuZ2V0SXRlcmF0b3I7IiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm1hcCcpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcubWFwLnRvLWpzb24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy8kJykuY29yZS5NYXA7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzLyQnKS5jb3JlLk9iamVjdC5hc3NpZ247IiwidmFyICQgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzLyQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlKFAsIEQpe1xuICByZXR1cm4gJC5jcmVhdGUoUCwgRCk7XG59OyIsInZhciAkID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGl0LCBrZXksIGRlc2Mpe1xuICByZXR1cm4gJC5zZXREZXNjKGl0LCBrZXksIGRlc2MpO1xufTsiLCJ2YXIgJCA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvJCcpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LnN0YXRpY3MtYWNjZXB0LXByaW1pdGl2ZXMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpe1xuICByZXR1cm4gJC5nZXREZXNjKGl0LCBrZXkpO1xufTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3Quc3RhdGljcy1hY2NlcHQtcHJpbWl0aXZlcycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzLyQnKS5jb3JlLk9iamVjdC5rZXlzOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvJCcpLmNvcmUuT2JqZWN0LnNldFByb3RvdHlwZU9mOyIsInJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5wcm9taXNlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvJCcpLmNvcmUuUHJvbWlzZTsiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc2V0Jyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5zZXQudG8tanNvbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzLyQnKS5jb3JlLlNldDsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5zeW1ib2wnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kJykuY29yZS5TeW1ib2w7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kLndrcycpKCdpdGVyYXRvcicpOyIsInZhciAkID0gcmVxdWlyZSgnLi8kJyk7XG5mdW5jdGlvbiBhc3NlcnQoY29uZGl0aW9uLCBtc2cxLCBtc2cyKXtcbiAgaWYoIWNvbmRpdGlvbil0aHJvdyBUeXBlRXJyb3IobXNnMiA/IG1zZzEgKyBtc2cyIDogbXNnMSk7XG59XG5hc3NlcnQuZGVmID0gJC5hc3NlcnREZWZpbmVkO1xuYXNzZXJ0LmZuID0gZnVuY3Rpb24oaXQpe1xuICBpZighJC5pc0Z1bmN0aW9uKGl0KSl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59O1xuYXNzZXJ0Lm9iaiA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoISQuaXNPYmplY3QoaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbmFzc2VydC5pbnN0ID0gZnVuY3Rpb24oaXQsIENvbnN0cnVjdG9yLCBuYW1lKXtcbiAgaWYoIShpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSl0aHJvdyBUeXBlRXJyb3IobmFtZSArIFwiOiB1c2UgdGhlICduZXcnIG9wZXJhdG9yIVwiKTtcbiAgcmV0dXJuIGl0O1xufTtcbm1vZHVsZS5leHBvcnRzID0gYXNzZXJ0OyIsInZhciAkICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgZW51bUtleXMgPSByZXF1aXJlKCcuLyQuZW51bS1rZXlzJyk7XG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSl7XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG4gIHZhciBUID0gT2JqZWN0KCQuYXNzZXJ0RGVmaW5lZCh0YXJnZXQpKVxuICAgICwgbCA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAsIGkgPSAxO1xuICB3aGlsZShsID4gaSl7XG4gICAgdmFyIFMgICAgICA9ICQuRVM1T2JqZWN0KGFyZ3VtZW50c1tpKytdKVxuICAgICAgLCBrZXlzICAgPSBlbnVtS2V5cyhTKVxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICAgLCBqICAgICAgPSAwXG4gICAgICAsIGtleTtcbiAgICB3aGlsZShsZW5ndGggPiBqKVRba2V5ID0ga2V5c1tqKytdXSA9IFNba2V5XTtcbiAgfVxuICByZXR1cm4gVDtcbn07IiwidmFyICQgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBUQUcgICAgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgndG9TdHJpbmdUYWcnKVxuICAsIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5mdW5jdGlvbiBjb2YoaXQpe1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufVxuY29mLmNsYXNzb2YgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBPLCBUO1xuICByZXR1cm4gaXQgPT0gdW5kZWZpbmVkID8gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogJ051bGwnXG4gICAgOiB0eXBlb2YgKFQgPSAoTyA9IE9iamVjdChpdCkpW1RBR10pID09ICdzdHJpbmcnID8gVCA6IGNvZihPKTtcbn07XG5jb2Yuc2V0ID0gZnVuY3Rpb24oaXQsIHRhZywgc3RhdCl7XG4gIGlmKGl0ICYmICEkLmhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSkkLmhpZGUoaXQsIFRBRywgdGFnKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IGNvZjsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGN0eCAgICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgc2FmZSAgICAgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZVxuICAsIGFzc2VydCAgID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpXG4gICwgZm9yT2YgICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCBzdGVwICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyJykuc3RlcFxuICAsICRoYXMgICAgID0gJC5oYXNcbiAgLCBzZXQgICAgICA9ICQuc2V0XG4gICwgaXNPYmplY3QgPSAkLmlzT2JqZWN0XG4gICwgaGlkZSAgICAgPSAkLmhpZGVcbiAgLCBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGlzT2JqZWN0XG4gICwgSUQgICAgICAgPSBzYWZlKCdpZCcpXG4gICwgTzEgICAgICAgPSBzYWZlKCdPMScpXG4gICwgTEFTVCAgICAgPSBzYWZlKCdsYXN0JylcbiAgLCBGSVJTVCAgICA9IHNhZmUoJ2ZpcnN0JylcbiAgLCBJVEVSICAgICA9IHNhZmUoJ2l0ZXInKVxuICAsIFNJWkUgICAgID0gJC5ERVNDID8gc2FmZSgnc2l6ZScpIDogJ3NpemUnXG4gICwgaWQgICAgICAgPSAwO1xuXG5mdW5jdGlvbiBmYXN0S2V5KGl0LCBjcmVhdGUpe1xuICAvLyByZXR1cm4gcHJpbWl0aXZlIHdpdGggcHJlZml4XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJyA/IGl0IDogKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcbiAgaWYoISRoYXMoaXQsIElEKSl7XG4gICAgLy8gY2FuJ3Qgc2V0IGlkIHRvIGZyb3plbiBvYmplY3RcbiAgICBpZighaXNFeHRlbnNpYmxlKGl0KSlyZXR1cm4gJ0YnO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIGlkXG4gICAgaWYoIWNyZWF0ZSlyZXR1cm4gJ0UnO1xuICAgIC8vIGFkZCBtaXNzaW5nIG9iamVjdCBpZFxuICAgIGhpZGUoaXQsIElELCArK2lkKTtcbiAgLy8gcmV0dXJuIG9iamVjdCBpZCB3aXRoIHByZWZpeFxuICB9IHJldHVybiAnTycgKyBpdFtJRF07XG59XG5cbmZ1bmN0aW9uIGdldEVudHJ5KHRoYXQsIGtleSl7XG4gIC8vIGZhc3QgY2FzZVxuICB2YXIgaW5kZXggPSBmYXN0S2V5KGtleSksIGVudHJ5O1xuICBpZihpbmRleCAhPT0gJ0YnKXJldHVybiB0aGF0W08xXVtpbmRleF07XG4gIC8vIGZyb3plbiBvYmplY3QgY2FzZVxuICBmb3IoZW50cnkgPSB0aGF0W0ZJUlNUXTsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XG4gICAgaWYoZW50cnkuayA9PSBrZXkpcmV0dXJuIGVudHJ5O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRDb25zdHJ1Y3RvcjogZnVuY3Rpb24od3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUil7XG4gICAgdmFyIEMgPSB3cmFwcGVyKGZ1bmN0aW9uKHRoYXQsIGl0ZXJhYmxlKXtcbiAgICAgIGFzc2VydC5pbnN0KHRoYXQsIEMsIE5BTUUpO1xuICAgICAgc2V0KHRoYXQsIE8xLCAkLmNyZWF0ZShudWxsKSk7XG4gICAgICBzZXQodGhhdCwgU0laRSwgMCk7XG4gICAgICBzZXQodGhhdCwgTEFTVCwgdW5kZWZpbmVkKTtcbiAgICAgIHNldCh0aGF0LCBGSVJTVCwgdW5kZWZpbmVkKTtcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgfSk7XG4gICAgcmVxdWlyZSgnLi8kLm1peCcpKEMucHJvdG90eXBlLCB7XG4gICAgICAvLyAyMy4xLjMuMSBNYXAucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIC8vIDIzLjIuMy4yIFNldC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCl7XG4gICAgICAgIGZvcih2YXIgdGhhdCA9IHRoaXMsIGRhdGEgPSB0aGF0W08xXSwgZW50cnkgPSB0aGF0W0ZJUlNUXTsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYoZW50cnkucCllbnRyeS5wID0gZW50cnkucC5uID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGRlbGV0ZSBkYXRhW2VudHJ5LmldO1xuICAgICAgICB9XG4gICAgICAgIHRoYXRbRklSU1RdID0gdGhhdFtMQVNUXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhhdFtTSVpFXSA9IDA7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjMgTWFwLnByb3RvdHlwZS5kZWxldGUoa2V5KVxuICAgICAgLy8gMjMuMi4zLjQgU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXG4gICAgICAnZGVsZXRlJzogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgdmFyIHRoYXQgID0gdGhpc1xuICAgICAgICAgICwgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpO1xuICAgICAgICBpZihlbnRyeSl7XG4gICAgICAgICAgdmFyIG5leHQgPSBlbnRyeS5uXG4gICAgICAgICAgICAsIHByZXYgPSBlbnRyeS5wO1xuICAgICAgICAgIGRlbGV0ZSB0aGF0W08xXVtlbnRyeS5pXTtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZihwcmV2KXByZXYubiA9IG5leHQ7XG4gICAgICAgICAgaWYobmV4dCluZXh0LnAgPSBwcmV2O1xuICAgICAgICAgIGlmKHRoYXRbRklSU1RdID09IGVudHJ5KXRoYXRbRklSU1RdID0gbmV4dDtcbiAgICAgICAgICBpZih0aGF0W0xBU1RdID09IGVudHJ5KXRoYXRbTEFTVF0gPSBwcmV2O1xuICAgICAgICAgIHRoYXRbU0laRV0tLTtcbiAgICAgICAgfSByZXR1cm4gISFlbnRyeTtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4yLjMuNiBTZXQucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIC8vIDIzLjEuMy41IE1hcC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgZm9yRWFjaDogZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuIC8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcbiAgICAgICAgdmFyIGYgPSBjdHgoY2FsbGJhY2tmbiwgYXJndW1lbnRzWzFdLCAzKVxuICAgICAgICAgICwgZW50cnk7XG4gICAgICAgIHdoaWxlKGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhpc1tGSVJTVF0pe1xuICAgICAgICAgIGYoZW50cnkudiwgZW50cnkuaywgdGhpcyk7XG4gICAgICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICAgICAgd2hpbGUoZW50cnkgJiYgZW50cnkucillbnRyeSA9IGVudHJ5LnA7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuNyBNYXAucHJvdG90eXBlLmhhcyhrZXkpXG4gICAgICAvLyAyMy4yLjMuNyBTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcbiAgICAgIGhhczogZnVuY3Rpb24gaGFzKGtleSl7XG4gICAgICAgIHJldHVybiAhIWdldEVudHJ5KHRoaXMsIGtleSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYoJC5ERVNDKSQuc2V0RGVzYyhDLnByb3RvdHlwZSwgJ3NpemUnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBhc3NlcnQuZGVmKHRoaXNbU0laRV0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBDO1xuICB9LFxuICBkZWY6IGZ1bmN0aW9uKHRoYXQsIGtleSwgdmFsdWUpe1xuICAgIHZhciBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSlcbiAgICAgICwgcHJldiwgaW5kZXg7XG4gICAgLy8gY2hhbmdlIGV4aXN0aW5nIGVudHJ5XG4gICAgaWYoZW50cnkpe1xuICAgICAgZW50cnkudiA9IHZhbHVlO1xuICAgIC8vIGNyZWF0ZSBuZXcgZW50cnlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhhdFtMQVNUXSA9IGVudHJ5ID0ge1xuICAgICAgICBpOiBpbmRleCA9IGZhc3RLZXkoa2V5LCB0cnVlKSwgLy8gPC0gaW5kZXhcbiAgICAgICAgazoga2V5LCAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGtleVxuICAgICAgICB2OiB2YWx1ZSwgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcbiAgICAgICAgcDogcHJldiA9IHRoYXRbTEFTVF0sICAgICAgICAgIC8vIDwtIHByZXZpb3VzIGVudHJ5XG4gICAgICAgIG46IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAvLyA8LSBuZXh0IGVudHJ5XG4gICAgICAgIHI6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSByZW1vdmVkXG4gICAgICB9O1xuICAgICAgaWYoIXRoYXRbRklSU1RdKXRoYXRbRklSU1RdID0gZW50cnk7XG4gICAgICBpZihwcmV2KXByZXYubiA9IGVudHJ5O1xuICAgICAgdGhhdFtTSVpFXSsrO1xuICAgICAgLy8gYWRkIHRvIGluZGV4XG4gICAgICBpZihpbmRleCAhPT0gJ0YnKXRoYXRbTzFdW2luZGV4XSA9IGVudHJ5O1xuICAgIH0gcmV0dXJuIHRoYXQ7XG4gIH0sXG4gIGdldEVudHJ5OiBnZXRFbnRyeSxcbiAgLy8gYWRkIC5rZXlzLCAudmFsdWVzLCAuZW50cmllcywgW0BAaXRlcmF0b3JdXG4gIC8vIDIzLjEuMy40LCAyMy4xLjMuOCwgMjMuMS4zLjExLCAyMy4xLjMuMTIsIDIzLjIuMy41LCAyMy4yLjMuOCwgMjMuMi4zLjEwLCAyMy4yLjMuMTFcbiAgc2V0SXRlcjogZnVuY3Rpb24oQywgTkFNRSwgSVNfTUFQKXtcbiAgICByZXF1aXJlKCcuLyQuaXRlci1kZWZpbmUnKShDLCBOQU1FLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XG4gICAgICBzZXQodGhpcywgSVRFUiwge286IGl0ZXJhdGVkLCBrOiBraW5kfSk7XG4gICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgIHZhciBpdGVyICA9IHRoaXNbSVRFUl1cbiAgICAgICAgLCBraW5kICA9IGl0ZXIua1xuICAgICAgICAsIGVudHJ5ID0gaXRlci5sO1xuICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcbiAgICAgIC8vIGdldCBuZXh0IGVudHJ5XG4gICAgICBpZighaXRlci5vIHx8ICEoaXRlci5sID0gZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiBpdGVyLm9bRklSU1RdKSl7XG4gICAgICAgIC8vIG9yIGZpbmlzaCB0aGUgaXRlcmF0aW9uXG4gICAgICAgIGl0ZXIubyA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHN0ZXAoMSk7XG4gICAgICB9XG4gICAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXG4gICAgICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGVudHJ5LmspO1xuICAgICAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBlbnRyeS52KTtcbiAgICAgIHJldHVybiBzdGVwKDAsIFtlbnRyeS5rLCBlbnRyeS52XSk7XG4gICAgfSwgSVNfTUFQID8gJ2VudHJpZXMnIDogJ3ZhbHVlcycgLCAhSVNfTUFQLCB0cnVlKTtcbiAgfVxufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgJGRlZiAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCBmb3JPZiA9IHJlcXVpcmUoJy4vJC5mb3Itb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTkFNRSl7XG4gICRkZWYoJGRlZi5QLCBOQU1FLCB7XG4gICAgdG9KU09OOiBmdW5jdGlvbiB0b0pTT04oKXtcbiAgICAgIHZhciBhcnIgPSBbXTtcbiAgICAgIGZvck9mKHRoaXMsIGZhbHNlLCBhcnIucHVzaCwgYXJyKTtcbiAgICAgIHJldHVybiBhcnI7XG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCAkZGVmICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsICRpdGVyID0gcmVxdWlyZSgnLi8kLml0ZXInKVxuICAsIEJVR0dZID0gJGl0ZXIuQlVHR1lcbiAgLCBmb3JPZiA9IHJlcXVpcmUoJy4vJC5mb3Itb2YnKVxuICAsIGFzc2VydEluc3RhbmNlID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpLmluc3RcbiAgLCBJTlRFUk5BTCA9IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdpbnRlcm5hbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE5BTUUsIHdyYXBwZXIsIG1ldGhvZHMsIGNvbW1vbiwgSVNfTUFQLCBJU19XRUFLKXtcbiAgdmFyIEJhc2UgID0gJC5nW05BTUVdXG4gICAgLCBDICAgICA9IEJhc2VcbiAgICAsIEFEREVSID0gSVNfTUFQID8gJ3NldCcgOiAnYWRkJ1xuICAgICwgcHJvdG8gPSBDICYmIEMucHJvdG90eXBlXG4gICAgLCBPICAgICA9IHt9O1xuICBpZighJC5ERVNDIHx8ICEkLmlzRnVuY3Rpb24oQykgfHwgIShJU19XRUFLIHx8ICFCVUdHWSAmJiBwcm90by5mb3JFYWNoICYmIHByb3RvLmVudHJpZXMpKXtcbiAgICAvLyBjcmVhdGUgY29sbGVjdGlvbiBjb25zdHJ1Y3RvclxuICAgIEMgPSBjb21tb24uZ2V0Q29uc3RydWN0b3Iod3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUik7XG4gICAgcmVxdWlyZSgnLi8kLm1peCcpKEMucHJvdG90eXBlLCBtZXRob2RzKTtcbiAgfSBlbHNlIHtcbiAgICBDID0gd3JhcHBlcihmdW5jdGlvbih0YXJnZXQsIGl0ZXJhYmxlKXtcbiAgICAgIGFzc2VydEluc3RhbmNlKHRhcmdldCwgQywgTkFNRSk7XG4gICAgICB0YXJnZXRbSU5URVJOQUxdID0gbmV3IEJhc2U7XG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGFyZ2V0W0FEREVSXSwgdGFyZ2V0KTtcbiAgICB9KTtcbiAgICAkLmVhY2guY2FsbCgnYWRkLGNsZWFyLGRlbGV0ZSxmb3JFYWNoLGdldCxoYXMsc2V0LGtleXMsdmFsdWVzLGVudHJpZXMnLnNwbGl0KCcsJyksZnVuY3Rpb24oS0VZKXtcbiAgICAgIHZhciBjaGFpbiA9IEtFWSA9PSAnYWRkJyB8fCBLRVkgPT0gJ3NldCc7XG4gICAgICBpZihLRVkgaW4gcHJvdG8pJC5oaWRlKEMucHJvdG90eXBlLCBLRVksIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpc1tJTlRFUk5BTF1bS0VZXShhID09PSAwID8gMCA6IGEsIGIpO1xuICAgICAgICByZXR1cm4gY2hhaW4gPyB0aGlzIDogcmVzdWx0O1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYoJ3NpemUnIGluIHByb3RvKSQuc2V0RGVzYyhDLnByb3RvdHlwZSwgJ3NpemUnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzW0lOVEVSTkFMXS5zaXplO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmVxdWlyZSgnLi8kLmNvZicpLnNldChDLCBOQU1FKTtcblxuICBPW05BTUVdID0gQztcbiAgJGRlZigkZGVmLkcgKyAkZGVmLlcgKyAkZGVmLkYsIE8pO1xuICByZXF1aXJlKCcuLyQuc3BlY2llcycpKEMpO1xuXG4gIGlmKCFJU19XRUFLKWNvbW1vbi5zZXRJdGVyKEMsIE5BTUUsIElTX01BUCk7XG5cbiAgcmV0dXJuIEM7XG59OyIsIi8vIE9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFzc2VydEZ1bmN0aW9uID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpLmZuO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhhdCwgbGVuZ3RoKXtcbiAgYXNzZXJ0RnVuY3Rpb24oZm4pO1xuICBpZih+bGVuZ3RoICYmIHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XG4gIHN3aXRjaChsZW5ndGgpe1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9IHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICAgIH07XG59OyIsInZhciAkICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBnbG9iYWwgICAgID0gJC5nXG4gICwgY29yZSAgICAgICA9ICQuY29yZVxuICAsIGlzRnVuY3Rpb24gPSAkLmlzRnVuY3Rpb247XG5mdW5jdGlvbiBjdHgoZm4sIHRoYXQpe1xuICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn1cbi8vIHR5cGUgYml0bWFwXG4kZGVmLkYgPSAxOyAgLy8gZm9yY2VkXG4kZGVmLkcgPSAyOyAgLy8gZ2xvYmFsXG4kZGVmLlMgPSA0OyAgLy8gc3RhdGljXG4kZGVmLlAgPSA4OyAgLy8gcHJvdG9cbiRkZWYuQiA9IDE2OyAvLyBiaW5kXG4kZGVmLlcgPSAzMjsgLy8gd3JhcFxuZnVuY3Rpb24gJGRlZih0eXBlLCBuYW1lLCBzb3VyY2Upe1xuICB2YXIga2V5LCBvd24sIG91dCwgZXhwXG4gICAgLCBpc0dsb2JhbCA9IHR5cGUgJiAkZGVmLkdcbiAgICAsIGlzUHJvdG8gID0gdHlwZSAmICRkZWYuUFxuICAgICwgdGFyZ2V0ICAgPSBpc0dsb2JhbCA/IGdsb2JhbCA6IHR5cGUgJiAkZGVmLlNcbiAgICAgICAgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KS5wcm90b3R5cGVcbiAgICAsIGV4cG9ydHMgID0gaXNHbG9iYWwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KTtcbiAgaWYoaXNHbG9iYWwpc291cmNlID0gbmFtZTtcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICEodHlwZSAmICRkZWYuRikgJiYgdGFyZ2V0ICYmIGtleSBpbiB0YXJnZXQ7XG4gICAgaWYob3duICYmIGtleSBpbiBleHBvcnRzKWNvbnRpbnVlO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gb3duID8gdGFyZ2V0W2tleV0gOiBzb3VyY2Vba2V5XTtcbiAgICAvLyBwcmV2ZW50IGdsb2JhbCBwb2xsdXRpb24gZm9yIG5hbWVzcGFjZXNcbiAgICBpZihpc0dsb2JhbCAmJiAhaXNGdW5jdGlvbih0YXJnZXRba2V5XSkpZXhwID0gc291cmNlW2tleV07XG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICBlbHNlIGlmKHR5cGUgJiAkZGVmLkIgJiYgb3duKWV4cCA9IGN0eChvdXQsIGdsb2JhbCk7XG4gICAgLy8gd3JhcCBnbG9iYWwgY29uc3RydWN0b3JzIGZvciBwcmV2ZW50IGNoYW5nZSB0aGVtIGluIGxpYnJhcnlcbiAgICBlbHNlIGlmKHR5cGUgJiAkZGVmLlcgJiYgdGFyZ2V0W2tleV0gPT0gb3V0KSFmdW5jdGlvbihDKXtcbiAgICAgIGV4cCA9IGZ1bmN0aW9uKHBhcmFtKXtcbiAgICAgICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBDID8gbmV3IEMocGFyYW0pIDogQyhwYXJhbSk7XG4gICAgICB9O1xuICAgICAgZXhwLnByb3RvdHlwZSA9IEMucHJvdG90eXBlO1xuICAgIH0ob3V0KTtcbiAgICBlbHNlIGV4cCA9IGlzUHJvdG8gJiYgaXNGdW5jdGlvbihvdXQpID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXhwb3J0XG4gICAgZXhwb3J0c1trZXldID0gZXhwO1xuICAgIGlmKGlzUHJvdG8pKGV4cG9ydHMucHJvdG90eXBlIHx8IChleHBvcnRzLnByb3RvdHlwZSA9IHt9KSlba2V5XSA9IG91dDtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSAkZGVmOyIsInZhciAkICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgZG9jdW1lbnQgPSAkLmcuZG9jdW1lbnRcbiAgLCBpc09iamVjdCA9ICQuaXNPYmplY3RcbiAgLy8gaW4gb2xkIElFIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnXG4gICwgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07IiwidmFyICQgPSByZXF1aXJlKCcuLyQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICB2YXIga2V5cyAgICAgICA9ICQuZ2V0S2V5cyhpdClcbiAgICAsIGdldERlc2MgICAgPSAkLmdldERlc2NcbiAgICAsIGdldFN5bWJvbHMgPSAkLmdldFN5bWJvbHM7XG4gIGlmKGdldFN5bWJvbHMpJC5lYWNoLmNhbGwoZ2V0U3ltYm9scyhpdCksIGZ1bmN0aW9uKGtleSl7XG4gICAgaWYoZ2V0RGVzYyhpdCwga2V5KS5lbnVtZXJhYmxlKWtleXMucHVzaChrZXkpO1xuICB9KTtcbiAgcmV0dXJuIGtleXM7XG59OyIsInZhciBjdHggID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgZ2V0ICA9IHJlcXVpcmUoJy4vJC5pdGVyJykuZ2V0XG4gICwgY2FsbCA9IHJlcXVpcmUoJy4vJC5pdGVyLWNhbGwnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmFibGUsIGVudHJpZXMsIGZuLCB0aGF0KXtcbiAgdmFyIGl0ZXJhdG9yID0gZ2V0KGl0ZXJhYmxlKVxuICAgICwgZiAgICAgICAgPSBjdHgoZm4sIHRoYXQsIGVudHJpZXMgPyAyIDogMSlcbiAgICAsIHN0ZXA7XG4gIHdoaWxlKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSl7XG4gICAgaWYoY2FsbChpdGVyYXRvciwgZiwgc3RlcC52YWx1ZSwgZW50cmllcykgPT09IGZhbHNlKXtcbiAgICAgIHJldHVybiBjYWxsLmNsb3NlKGl0ZXJhdG9yKTtcbiAgICB9XG4gIH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkKXtcbiAgJC5GVyAgID0gZmFsc2U7XG4gICQucGF0aCA9ICQuY29yZTtcbiAgcmV0dXJuICQ7XG59OyIsIi8vIGZhbGxiYWNrIGZvciBJRTExIGJ1Z2d5IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHdpdGggaWZyYW1lIGFuZCB3aW5kb3dcclxudmFyICQgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgdG9TdHJpbmcgPSB7fS50b1N0cmluZ1xyXG4gICwgZ2V0TmFtZXMgPSAkLmdldE5hbWVzO1xyXG5cclxudmFyIHdpbmRvd05hbWVzID0gdHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0JyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc1xyXG4gID8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMod2luZG93KSA6IFtdO1xyXG5cclxuZnVuY3Rpb24gZ2V0V2luZG93TmFtZXMoaXQpe1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gZ2V0TmFtZXMoaXQpO1xyXG4gIH0gY2F0Y2goZSl7XHJcbiAgICByZXR1cm4gd2luZG93TmFtZXMuc2xpY2UoKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmdldCA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpe1xyXG4gIGlmKHdpbmRvd05hbWVzICYmIHRvU3RyaW5nLmNhbGwoaXQpID09ICdbb2JqZWN0IFdpbmRvd10nKXJldHVybiBnZXRXaW5kb3dOYW1lcyhpdCk7XHJcbiAgcmV0dXJuIGdldE5hbWVzKCQudG9PYmplY3QoaXQpKTtcclxufTsiLCIvLyBGYXN0IGFwcGx5XG4vLyBodHRwOi8vanNwZXJmLmxua2l0LmNvbS9mYXN0LWFwcGx5LzVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIGFyZ3MsIHRoYXQpe1xuICB2YXIgdW4gPSB0aGF0ID09PSB1bmRlZmluZWQ7XG4gIHN3aXRjaChhcmdzLmxlbmd0aCl7XG4gICAgY2FzZSAwOiByZXR1cm4gdW4gPyBmbigpXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQpO1xuICAgIGNhc2UgMTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgIGNhc2UgNDogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSk7XG4gICAgY2FzZSA1OiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdLCBhcmdzWzRdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdLCBhcmdzWzRdKTtcbiAgfSByZXR1cm4gICAgICAgICAgICAgIGZuLmFwcGx5KHRoYXQsIGFyZ3MpO1xufTsiLCJ2YXIgYXNzZXJ0T2JqZWN0ID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpLm9iajtcbmZ1bmN0aW9uIGNsb3NlKGl0ZXJhdG9yKXtcbiAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgaWYocmV0ICE9PSB1bmRlZmluZWQpYXNzZXJ0T2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG59XG5mdW5jdGlvbiBjYWxsKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpe1xuICB0cnkge1xuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYXNzZXJ0T2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICB9IGNhdGNoKGUpe1xuICAgIGNsb3NlKGl0ZXJhdG9yKTtcbiAgICB0aHJvdyBlO1xuICB9XG59XG5jYWxsLmNsb3NlID0gY2xvc2U7XG5tb2R1bGUuZXhwb3J0cyA9IGNhbGw7IiwidmFyICRkZWYgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsICRyZWRlZiAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5yZWRlZicpXG4gICwgJCAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBjb2YgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuY29mJylcbiAgLCAkaXRlciAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaXRlcicpXG4gICwgU1lNQk9MX0lURVJBVE9SID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXG4gICwgRkZfSVRFUkFUT1IgICAgID0gJ0BAaXRlcmF0b3InXG4gICwgS0VZUyAgICAgICAgICAgID0gJ2tleXMnXG4gICwgVkFMVUVTICAgICAgICAgID0gJ3ZhbHVlcydcbiAgLCBJdGVyYXRvcnMgICAgICAgPSAkaXRlci5JdGVyYXRvcnM7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFKXtcbiAgJGl0ZXIuY3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgZnVuY3Rpb24gY3JlYXRlTWV0aG9kKGtpbmQpe1xuICAgIGZ1bmN0aW9uICQkKHRoYXQpe1xuICAgICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGF0LCBraW5kKTtcbiAgICB9XG4gICAgc3dpdGNoKGtpbmQpe1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpeyByZXR1cm4gJCQodGhpcyk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gJCQodGhpcyk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpeyByZXR1cm4gJCQodGhpcyk7IH07XG4gIH1cbiAgdmFyIFRBRyAgICAgID0gTkFNRSArICcgSXRlcmF0b3InXG4gICAgLCBwcm90byAgICA9IEJhc2UucHJvdG90eXBlXG4gICAgLCBfbmF0aXZlICA9IHByb3RvW1NZTUJPTF9JVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF1cbiAgICAsIF9kZWZhdWx0ID0gX25hdGl2ZSB8fCBjcmVhdGVNZXRob2QoREVGQVVMVClcbiAgICAsIG1ldGhvZHMsIGtleTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZihfbmF0aXZlKXtcbiAgICB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSAkLmdldFByb3RvKF9kZWZhdWx0LmNhbGwobmV3IEJhc2UpKTtcbiAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgY29mLnNldChJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAvLyBGRiBmaXhcbiAgICBpZigkLkZXICYmICQuaGFzKHByb3RvLCBGRl9JVEVSQVRPUikpJGl0ZXIuc2V0KEl0ZXJhdG9yUHJvdG90eXBlLCAkLnRoYXQpO1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZigkLkZXIHx8IEZPUkNFKSRpdGVyLnNldChwcm90bywgX2RlZmF1bHQpO1xuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9IF9kZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSAgPSAkLnRoYXQ7XG4gIGlmKERFRkFVTFQpe1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICBrZXlzOiAgICBJU19TRVQgICAgICAgICAgICA/IF9kZWZhdWx0IDogY3JlYXRlTWV0aG9kKEtFWVMpLFxuICAgICAgdmFsdWVzOiAgREVGQVVMVCA9PSBWQUxVRVMgPyBfZGVmYXVsdCA6IGNyZWF0ZU1ldGhvZChWQUxVRVMpLFxuICAgICAgZW50cmllczogREVGQVVMVCAhPSBWQUxVRVMgPyBfZGVmYXVsdCA6IGNyZWF0ZU1ldGhvZCgnZW50cmllcycpXG4gICAgfTtcbiAgICBpZihGT1JDRSlmb3Ioa2V5IGluIG1ldGhvZHMpe1xuICAgICAgaWYoIShrZXkgaW4gcHJvdG8pKSRyZWRlZihwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZGVmKCRkZWYuUCArICRkZWYuRiAqICRpdGVyLkJVR0dZLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxufTsiLCJ2YXIgU1lNQk9MX0lURVJBVE9SID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXG4gICwgU0FGRV9DTE9TSU5HICAgID0gZmFsc2U7XG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bU1lNQk9MX0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbigpeyBTQUZFX0NMT1NJTkcgPSB0cnVlOyB9O1xuICBBcnJheS5mcm9tKHJpdGVyLCBmdW5jdGlvbigpeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYyl7XG4gIGlmKCFTQUZFX0NMT1NJTkcpcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgID0gWzddXG4gICAgICAsIGl0ZXIgPSBhcnJbU1lNQk9MX0lURVJBVE9SXSgpO1xuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uKCl7IHNhZmUgPSB0cnVlOyB9O1xuICAgIGFycltTWU1CT0xfSVRFUkFUT1JdID0gZnVuY3Rpb24oKXsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBzYWZlO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGNvZiAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmNvZicpXG4gICwgY2xhc3NvZiAgICAgICAgICAgPSBjb2YuY2xhc3NvZlxuICAsIGFzc2VydCAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpXG4gICwgYXNzZXJ0T2JqZWN0ICAgICAgPSBhc3NlcnQub2JqXG4gICwgU1lNQk9MX0lURVJBVE9SICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBGRl9JVEVSQVRPUiAgICAgICA9ICdAQGl0ZXJhdG9yJ1xuICAsIEl0ZXJhdG9ycyAgICAgICAgID0gcmVxdWlyZSgnLi8kLnNoYXJlZCcpKCdpdGVyYXRvcnMnKVxuICAsIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxuc2V0SXRlcmF0b3IoSXRlcmF0b3JQcm90b3R5cGUsICQudGhhdCk7XG5mdW5jdGlvbiBzZXRJdGVyYXRvcihPLCB2YWx1ZSl7XG4gICQuaGlkZShPLCBTWU1CT0xfSVRFUkFUT1IsIHZhbHVlKTtcbiAgLy8gQWRkIGl0ZXJhdG9yIGZvciBGRiBpdGVyYXRvciBwcm90b2NvbFxuICBpZihGRl9JVEVSQVRPUiBpbiBbXSkkLmhpZGUoTywgRkZfSVRFUkFUT1IsIHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbiAgQlVHR1k6ICdrZXlzJyBpbiBbXSAmJiAhKCduZXh0JyBpbiBbXS5rZXlzKCkpLFxuICBJdGVyYXRvcnM6IEl0ZXJhdG9ycyxcbiAgc3RlcDogZnVuY3Rpb24oZG9uZSwgdmFsdWUpe1xuICAgIHJldHVybiB7dmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmV9O1xuICB9LFxuICBpczogZnVuY3Rpb24oaXQpe1xuICAgIHZhciBPICAgICAgPSBPYmplY3QoaXQpXG4gICAgICAsIFN5bWJvbCA9ICQuZy5TeW1ib2w7XG4gICAgcmV0dXJuIChTeW1ib2wgJiYgU3ltYm9sLml0ZXJhdG9yIHx8IEZGX0lURVJBVE9SKSBpbiBPXG4gICAgICB8fCBTWU1CT0xfSVRFUkFUT1IgaW4gT1xuICAgICAgfHwgJC5oYXMoSXRlcmF0b3JzLCBjbGFzc29mKE8pKTtcbiAgfSxcbiAgZ2V0OiBmdW5jdGlvbihpdCl7XG4gICAgdmFyIFN5bWJvbCA9ICQuZy5TeW1ib2xcbiAgICAgICwgZ2V0SXRlcjtcbiAgICBpZihpdCAhPSB1bmRlZmluZWQpe1xuICAgICAgZ2V0SXRlciA9IGl0W1N5bWJvbCAmJiBTeW1ib2wuaXRlcmF0b3IgfHwgRkZfSVRFUkFUT1JdXG4gICAgICAgIHx8IGl0W1NZTUJPTF9JVEVSQVRPUl1cbiAgICAgICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbiAgICB9XG4gICAgYXNzZXJ0KCQuaXNGdW5jdGlvbihnZXRJdGVyKSwgaXQsICcgaXMgbm90IGl0ZXJhYmxlIScpO1xuICAgIHJldHVybiBhc3NlcnRPYmplY3QoZ2V0SXRlci5jYWxsKGl0KSk7XG4gIH0sXG4gIHNldDogc2V0SXRlcmF0b3IsXG4gIGNyZWF0ZTogZnVuY3Rpb24oQ29uc3RydWN0b3IsIE5BTUUsIG5leHQsIHByb3RvKXtcbiAgICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSAkLmNyZWF0ZShwcm90byB8fCBJdGVyYXRvclByb3RvdHlwZSwge25leHQ6ICQuZGVzYygxLCBuZXh0KX0pO1xuICAgIGNvZi5zZXQoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnID8gc2VsZiA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKClcbiAgLCBjb3JlICAgPSB7fVxuICAsIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5XG4gICwgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eVxuICAsIGNlaWwgID0gTWF0aC5jZWlsXG4gICwgZmxvb3IgPSBNYXRoLmZsb29yXG4gICwgbWF4ICAgPSBNYXRoLm1heFxuICAsIG1pbiAgID0gTWF0aC5taW47XG4vLyBUaGUgZW5naW5lIHdvcmtzIGZpbmUgd2l0aCBkZXNjcmlwdG9ycz8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eS5cbnZhciBERVNDID0gISFmdW5jdGlvbigpe1xuICB0cnkge1xuICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gMjsgfX0pLmEgPT0gMjtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxufSgpO1xudmFyIGhpZGUgPSBjcmVhdGVEZWZpbmVyKDEpO1xuLy8gNy4xLjQgVG9JbnRlZ2VyXG5mdW5jdGlvbiB0b0ludGVnZXIoaXQpe1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn1cbmZ1bmN0aW9uIGRlc2MoYml0bWFwLCB2YWx1ZSl7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZSAgOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZSAgICA6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWUgICAgICAgOiB2YWx1ZVxuICB9O1xufVxuZnVuY3Rpb24gc2ltcGxlU2V0KG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59XG5mdW5jdGlvbiBjcmVhdGVEZWZpbmVyKGJpdG1hcCl7XG4gIHJldHVybiBERVNDID8gZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgICByZXR1cm4gJC5zZXREZXNjKG9iamVjdCwga2V5LCBkZXNjKGJpdG1hcCwgdmFsdWUpKTtcbiAgfSA6IHNpbXBsZVNldDtcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoaXQpe1xuICByZXR1cm4gaXQgIT09IG51bGwgJiYgKHR5cGVvZiBpdCA9PSAnb2JqZWN0JyB8fCB0eXBlb2YgaXQgPT0gJ2Z1bmN0aW9uJyk7XG59XG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnZnVuY3Rpb24nO1xufVxuZnVuY3Rpb24gYXNzZXJ0RGVmaW5lZChpdCl7XG4gIGlmKGl0ID09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiAgXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn1cblxudmFyICQgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5mdycpKHtcbiAgZzogZ2xvYmFsLFxuICBjb3JlOiBjb3JlLFxuICBodG1sOiBnbG9iYWwuZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAvLyBodHRwOi8vanNwZXJmLmNvbS9jb3JlLWpzLWlzb2JqZWN0XG4gIGlzT2JqZWN0OiAgIGlzT2JqZWN0LFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICB0aGF0OiBmdW5jdGlvbigpe1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICAvLyA3LjEuNCBUb0ludGVnZXJcbiAgdG9JbnRlZ2VyOiB0b0ludGVnZXIsXG4gIC8vIDcuMS4xNSBUb0xlbmd0aFxuICB0b0xlbmd0aDogZnVuY3Rpb24oaXQpe1xuICAgIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG4gIH0sXG4gIHRvSW5kZXg6IGZ1bmN0aW9uKGluZGV4LCBsZW5ndGgpe1xuICAgIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcbiAgICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbiAgfSxcbiAgaGFzOiBmdW5jdGlvbihpdCwga2V5KXtcbiAgICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbiAgfSxcbiAgY3JlYXRlOiAgICAgT2JqZWN0LmNyZWF0ZSxcbiAgZ2V0UHJvdG86ICAgT2JqZWN0LmdldFByb3RvdHlwZU9mLFxuICBERVNDOiAgICAgICBERVNDLFxuICBkZXNjOiAgICAgICBkZXNjLFxuICBnZXREZXNjOiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICBzZXREZXNjOiAgICBkZWZpbmVQcm9wZXJ0eSxcbiAgc2V0RGVzY3M6ICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMsXG4gIGdldEtleXM6ICAgIE9iamVjdC5rZXlzLFxuICBnZXROYW1lczogICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgZ2V0U3ltYm9sczogT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxcbiAgYXNzZXJ0RGVmaW5lZDogYXNzZXJ0RGVmaW5lZCxcbiAgLy8gRHVtbXksIGZpeCBmb3Igbm90IGFycmF5LWxpa2UgRVMzIHN0cmluZyBpbiBlczUgbW9kdWxlXG4gIEVTNU9iamVjdDogT2JqZWN0LFxuICB0b09iamVjdDogZnVuY3Rpb24oaXQpe1xuICAgIHJldHVybiAkLkVTNU9iamVjdChhc3NlcnREZWZpbmVkKGl0KSk7XG4gIH0sXG4gIGhpZGU6IGhpZGUsXG4gIGRlZjogY3JlYXRlRGVmaW5lcigwKSxcbiAgc2V0OiBnbG9iYWwuU3ltYm9sID8gc2ltcGxlU2V0IDogaGlkZSxcbiAgZWFjaDogW10uZm9yRWFjaFxufSk7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuaWYodHlwZW9mIF9fZSAhPSAndW5kZWZpbmVkJylfX2UgPSBjb3JlO1xuaWYodHlwZW9mIF9fZyAhPSAndW5kZWZpbmVkJylfX2cgPSBnbG9iYWw7IiwidmFyICQgPSByZXF1aXJlKCcuLyQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBlbCl7XG4gIHZhciBPICAgICAgPSAkLnRvT2JqZWN0KG9iamVjdClcbiAgICAsIGtleXMgICA9ICQuZ2V0S2V5cyhPKVxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAsIGluZGV4ICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobGVuZ3RoID4gaW5kZXgpaWYoT1trZXkgPSBrZXlzW2luZGV4KytdXSA9PT0gZWwpcmV0dXJuIGtleTtcbn07IiwidmFyICRyZWRlZiA9IHJlcXVpcmUoJy4vJC5yZWRlZicpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRhcmdldCwgc3JjKXtcclxuICBmb3IodmFyIGtleSBpbiBzcmMpJHJlZGVmKHRhcmdldCwga2V5LCBzcmNba2V5XSk7XHJcbiAgcmV0dXJuIHRhcmdldDtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJCcpLmhpZGU7IiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuaXMgfHwgZnVuY3Rpb24gaXMoeCwgeSl7XHJcbiAgcmV0dXJuIHggPT09IHkgPyB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geSA6IHggIT0geCAmJiB5ICE9IHk7XHJcbn07IiwiLy8gV29ya3Mgd2l0aCBfX3Byb3RvX18gb25seS4gT2xkIHY4IGNhbid0IHdvcmsgd2l0aCBudWxsIHByb3RvIG9iamVjdHMuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xudmFyICQgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgYXNzZXJ0ID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpO1xuZnVuY3Rpb24gY2hlY2soTywgcHJvdG8pe1xuICBhc3NlcnQub2JqKE8pO1xuICBhc3NlcnQocHJvdG8gPT09IG51bGwgfHwgJC5pc09iamVjdChwcm90byksIHByb3RvLCBcIjogY2FuJ3Qgc2V0IGFzIHByb3RvdHlwZSFcIik7XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgKCdfX3Byb3RvX18nIGluIHt9IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICA/IGZ1bmN0aW9uKGJ1Z2d5LCBzZXQpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHNldCA9IHJlcXVpcmUoJy4vJC5jdHgnKShGdW5jdGlvbi5jYWxsLCAkLmdldERlc2MoT2JqZWN0LnByb3RvdHlwZSwgJ19fcHJvdG9fXycpLnNldCwgMik7XG4gICAgICAgICAgc2V0KHt9LCBbXSk7XG4gICAgICAgIH0gY2F0Y2goZSl7IGJ1Z2d5ID0gdHJ1ZTsgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pe1xuICAgICAgICAgIGNoZWNrKE8sIHByb3RvKTtcbiAgICAgICAgICBpZihidWdneSlPLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgICAgICAgIGVsc2Ugc2V0KE8sIHByb3RvKTtcbiAgICAgICAgICByZXR1cm4gTztcbiAgICAgICAgfTtcbiAgICAgIH0oKVxuICAgIDogdW5kZWZpbmVkKSxcbiAgY2hlY2s6IGNoZWNrXG59OyIsInZhciAkICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXydcclxuICAsIHN0b3JlICA9ICQuZ1tTSEFSRURdIHx8ICgkLmdbU0hBUkVEXSA9IHt9KTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xyXG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0ge30pO1xyXG59OyIsInZhciAkICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBTUEVDSUVTID0gcmVxdWlyZSgnLi8kLndrcycpKCdzcGVjaWVzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEMpe1xuICBpZigkLkRFU0MgJiYgIShTUEVDSUVTIGluIEMpKSQuc2V0RGVzYyhDLCBTUEVDSUVTLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogJC50aGF0XG4gIH0pO1xufTsiLCIvLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxudmFyICQgPSByZXF1aXJlKCcuLyQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVE9fU1RSSU5HKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRoYXQsIHBvcyl7XG4gICAgdmFyIHMgPSBTdHJpbmcoJC5hc3NlcnREZWZpbmVkKHRoYXQpKVxuICAgICAgLCBpID0gJC50b0ludGVnZXIocG9zKVxuICAgICAgLCBsID0gcy5sZW5ndGhcbiAgICAgICwgYSwgYjtcbiAgICBpZihpIDwgMCB8fCBpID49IGwpcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbFxuICAgICAgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBjdHggICAgPSByZXF1aXJlKCcuLyQuY3R4JylcbiAgLCBjb2YgICAgPSByZXF1aXJlKCcuLyQuY29mJylcbiAgLCBpbnZva2UgPSByZXF1aXJlKCcuLyQuaW52b2tlJylcbiAgLCBjZWwgICAgPSByZXF1aXJlKCcuLyQuZG9tLWNyZWF0ZScpXG4gICwgZ2xvYmFsICAgICAgICAgICAgID0gJC5nXG4gICwgaXNGdW5jdGlvbiAgICAgICAgID0gJC5pc0Z1bmN0aW9uXG4gICwgaHRtbCAgICAgICAgICAgICAgID0gJC5odG1sXG4gICwgcHJvY2VzcyAgICAgICAgICAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBzZXRUYXNrICAgICAgICAgICAgPSBnbG9iYWwuc2V0SW1tZWRpYXRlXG4gICwgY2xlYXJUYXNrICAgICAgICAgID0gZ2xvYmFsLmNsZWFySW1tZWRpYXRlXG4gICwgTWVzc2FnZUNoYW5uZWwgICAgID0gZ2xvYmFsLk1lc3NhZ2VDaGFubmVsXG4gICwgY291bnRlciAgICAgICAgICAgID0gMFxuICAsIHF1ZXVlICAgICAgICAgICAgICA9IHt9XG4gICwgT05SRUFEWVNUQVRFQ0hBTkdFID0gJ29ucmVhZHlzdGF0ZWNoYW5nZSdcbiAgLCBkZWZlciwgY2hhbm5lbCwgcG9ydDtcbmZ1bmN0aW9uIHJ1bigpe1xuICB2YXIgaWQgPSArdGhpcztcbiAgaWYoJC5oYXMocXVldWUsIGlkKSl7XG4gICAgdmFyIGZuID0gcXVldWVbaWRdO1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gICAgZm4oKTtcbiAgfVxufVxuZnVuY3Rpb24gbGlzdG5lcihldmVudCl7XG4gIHJ1bi5jYWxsKGV2ZW50LmRhdGEpO1xufVxuLy8gTm9kZS5qcyAwLjkrICYgSUUxMCsgaGFzIHNldEltbWVkaWF0ZSwgb3RoZXJ3aXNlOlxuaWYoIWlzRnVuY3Rpb24oc2V0VGFzaykgfHwgIWlzRnVuY3Rpb24oY2xlYXJUYXNrKSl7XG4gIHNldFRhc2sgPSBmdW5jdGlvbihmbil7XG4gICAgdmFyIGFyZ3MgPSBbXSwgaSA9IDE7XG4gICAgd2hpbGUoYXJndW1lbnRzLmxlbmd0aCA+IGkpYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICBxdWV1ZVsrK2NvdW50ZXJdID0gZnVuY3Rpb24oKXtcbiAgICAgIGludm9rZShpc0Z1bmN0aW9uKGZuKSA/IGZuIDogRnVuY3Rpb24oZm4pLCBhcmdzKTtcbiAgICB9O1xuICAgIGRlZmVyKGNvdW50ZXIpO1xuICAgIHJldHVybiBjb3VudGVyO1xuICB9O1xuICBjbGVhclRhc2sgPSBmdW5jdGlvbihpZCl7XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgfTtcbiAgLy8gTm9kZS5qcyAwLjgtXG4gIGlmKGNvZihwcm9jZXNzKSA9PSAncHJvY2Vzcycpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhjdHgocnVuLCBpZCwgMSkpO1xuICAgIH07XG4gIC8vIE1vZGVybiBicm93c2Vycywgc2tpcCBpbXBsZW1lbnRhdGlvbiBmb3IgV2ViV29ya2Vyc1xuICAvLyBJRTggaGFzIHBvc3RNZXNzYWdlLCBidXQgaXQncyBzeW5jICYgdHlwZW9mIGl0cyBwb3N0TWVzc2FnZSBpcyBvYmplY3RcbiAgfSBlbHNlIGlmKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyICYmIGlzRnVuY3Rpb24oZ2xvYmFsLnBvc3RNZXNzYWdlKSAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKGlkLCAnKicpO1xuICAgIH07XG4gICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBsaXN0bmVyLCBmYWxzZSk7XG4gIC8vIFdlYldvcmtlcnNcbiAgfSBlbHNlIGlmKGlzRnVuY3Rpb24oTWVzc2FnZUNoYW5uZWwpKXtcbiAgICBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsO1xuICAgIHBvcnQgICAgPSBjaGFubmVsLnBvcnQyO1xuICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gbGlzdG5lcjtcbiAgICBkZWZlciA9IGN0eChwb3J0LnBvc3RNZXNzYWdlLCBwb3J0LCAxKTtcbiAgLy8gSUU4LVxuICB9IGVsc2UgaWYoT05SRUFEWVNUQVRFQ0hBTkdFIGluIGNlbCgnc2NyaXB0Jykpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgaHRtbC5hcHBlbmRDaGlsZChjZWwoJ3NjcmlwdCcpKVtPTlJFQURZU1RBVEVDSEFOR0VdID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaHRtbC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgcnVuLmNhbGwoaWQpO1xuICAgICAgfTtcbiAgICB9O1xuICAvLyBSZXN0IG9sZCBicm93c2Vyc1xuICB9IGVsc2Uge1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgc2V0VGltZW91dChjdHgocnVuLCBpZCwgMSksIDApO1xuICAgIH07XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6ICAgc2V0VGFzayxcbiAgY2xlYXI6IGNsZWFyVGFza1xufTsiLCJ2YXIgc2lkID0gMDtcbmZ1bmN0aW9uIHVpZChrZXkpe1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytzaWQgKyBNYXRoLnJhbmRvbSgpKS50b1N0cmluZygzNikpO1xufVxudWlkLnNhZmUgPSByZXF1aXJlKCcuLyQnKS5nLlN5bWJvbCB8fCB1aWQ7XG5tb2R1bGUuZXhwb3J0cyA9IHVpZDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH07IiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vJCcpLmdcbiAgLCBzdG9yZSAgPSByZXF1aXJlKCcuLyQuc2hhcmVkJykoJ3drcycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuYW1lKXtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgZ2xvYmFsLlN5bWJvbCAmJiBnbG9iYWwuU3ltYm9sW25hbWVdIHx8IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07IiwidmFyIGNvcmUgID0gcmVxdWlyZSgnLi8kJykuY29yZVxuICAsICRpdGVyID0gcmVxdWlyZSgnLi8kLml0ZXInKTtcbmNvcmUuaXNJdGVyYWJsZSAgPSAkaXRlci5pcztcbmNvcmUuZ2V0SXRlcmF0b3IgPSAkaXRlci5nZXQ7IiwidmFyICQgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBjdHggICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsICRkZWYgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgJGl0ZXIgPSByZXF1aXJlKCcuLyQuaXRlcicpXG4gICwgY2FsbCAgPSByZXF1aXJlKCcuLyQuaXRlci1jYWxsJyk7XG4kZGVmKCRkZWYuUyArICRkZWYuRiAqICFyZXF1aXJlKCcuLyQuaXRlci1kZXRlY3QnKShmdW5jdGlvbihpdGVyKXsgQXJyYXkuZnJvbShpdGVyKTsgfSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4yLjEgQXJyYXkuZnJvbShhcnJheUxpa2UsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICBmcm9tOiBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZS8qLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZCovKXtcbiAgICB2YXIgTyAgICAgICA9IE9iamVjdCgkLmFzc2VydERlZmluZWQoYXJyYXlMaWtlKSlcbiAgICAgICwgbWFwZm4gICA9IGFyZ3VtZW50c1sxXVxuICAgICAgLCBtYXBwaW5nID0gbWFwZm4gIT09IHVuZGVmaW5lZFxuICAgICAgLCBmICAgICAgID0gbWFwcGluZyA/IGN0eChtYXBmbiwgYXJndW1lbnRzWzJdLCAyKSA6IHVuZGVmaW5lZFxuICAgICAgLCBpbmRleCAgID0gMFxuICAgICAgLCBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gICAgaWYoJGl0ZXIuaXMoTykpe1xuICAgICAgaXRlcmF0b3IgPSAkaXRlci5nZXQoTyk7XG4gICAgICAvLyBzdHJhbmdlIElFIHF1aXJrcyBtb2RlIGJ1ZyAtPiB1c2UgdHlwZW9mIGluc3RlYWQgb2YgaXNGdW5jdGlvblxuICAgICAgcmVzdWx0ICAgPSBuZXcgKHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXkpO1xuICAgICAgZm9yKDsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyBpbmRleCsrKXtcbiAgICAgICAgcmVzdWx0W2luZGV4XSA9IG1hcHBpbmcgPyBjYWxsKGl0ZXJhdG9yLCBmLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKSA6IHN0ZXAudmFsdWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHN0cmFuZ2UgSUUgcXVpcmtzIG1vZGUgYnVnIC0+IHVzZSB0eXBlb2YgaW5zdGVhZCBvZiBpc0Z1bmN0aW9uXG4gICAgICByZXN1bHQgPSBuZXcgKHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXkpKGxlbmd0aCA9ICQudG9MZW5ndGgoTy5sZW5ndGgpKTtcbiAgICAgIGZvcig7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKXtcbiAgICAgICAgcmVzdWx0W2luZGV4XSA9IG1hcHBpbmcgPyBmKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0Lmxlbmd0aCA9IGluZGV4O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pOyIsInZhciAkICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBzZXRVbnNjb3BlID0gcmVxdWlyZSgnLi8kLnVuc2NvcGUnKVxuICAsIElURVIgICAgICAgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZSgnaXRlcicpXG4gICwgJGl0ZXIgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyJylcbiAgLCBzdGVwICAgICAgID0gJGl0ZXIuc3RlcFxuICAsIEl0ZXJhdG9ycyAgPSAkaXRlci5JdGVyYXRvcnM7XG5cbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vJC5pdGVyLWRlZmluZScpKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XG4gICQuc2V0KHRoaXMsIElURVIsIHtvOiAkLnRvT2JqZWN0KGl0ZXJhdGVkKSwgaTogMCwgazoga2luZH0pO1xuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgaXRlciAgPSB0aGlzW0lURVJdXG4gICAgLCBPICAgICA9IGl0ZXIub1xuICAgICwga2luZCAgPSBpdGVyLmtcbiAgICAsIGluZGV4ID0gaXRlci5pKys7XG4gIGlmKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKXtcbiAgICBpdGVyLm8gPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN0ZXAoMSk7XG4gIH1cbiAgaWYoa2luZCA9PSAna2V5cycgIClyZXR1cm4gc3RlcCgwLCBpbmRleCk7XG4gIGlmKGtpbmQgPT0gJ3ZhbHVlcycpcmV0dXJuIHN0ZXAoMCwgT1tpbmRleF0pO1xuICByZXR1cm4gc3RlcCgwLCBbaW5kZXgsIE9baW5kZXhdXSk7XG59LCAndmFsdWVzJyk7XG5cbi8vIGFyZ3VtZW50c0xpc3RbQEBpdGVyYXRvcl0gaXMgJUFycmF5UHJvdG9fdmFsdWVzJSAoOS40LjQuNiwgOS40LjQuNylcbkl0ZXJhdG9ycy5Bcmd1bWVudHMgPSBJdGVyYXRvcnMuQXJyYXk7XG5cbnNldFVuc2NvcGUoJ2tleXMnKTtcbnNldFVuc2NvcGUoJ3ZhbHVlcycpO1xuc2V0VW5zY29wZSgnZW50cmllcycpOyIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuLyQuY29sbGVjdGlvbi1zdHJvbmcnKTtcblxuLy8gMjMuMSBNYXAgT2JqZWN0c1xucmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24nKSgnTWFwJywgZnVuY3Rpb24oZ2V0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIE1hcCgpeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50c1swXSk7IH07XG59LCB7XG4gIC8vIDIzLjEuMy42IE1hcC5wcm90b3R5cGUuZ2V0KGtleSlcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoa2V5KXtcbiAgICB2YXIgZW50cnkgPSBzdHJvbmcuZ2V0RW50cnkodGhpcywga2V5KTtcbiAgICByZXR1cm4gZW50cnkgJiYgZW50cnkudjtcbiAgfSxcbiAgLy8gMjMuMS4zLjkgTWFwLnByb3RvdHlwZS5zZXQoa2V5LCB2YWx1ZSlcbiAgc2V0OiBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSl7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodGhpcywga2V5ID09PSAwID8gMCA6IGtleSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcsIHRydWUpOyIsIi8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcbiRkZWYoJGRlZi5TLCAnT2JqZWN0Jywge2Fzc2lnbjogcmVxdWlyZSgnLi8kLmFzc2lnbicpfSk7IiwiLy8gMTkuMS4zLjE5IE9iamVjdC5zZXRQcm90b3R5cGVPZihPLCBwcm90bylcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xuJGRlZigkZGVmLlMsICdPYmplY3QnLCB7c2V0UHJvdG90eXBlT2Y6IHJlcXVpcmUoJy4vJC5zZXQtcHJvdG8nKS5zZXR9KTsiLCJ2YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgaXNPYmplY3QgPSAkLmlzT2JqZWN0XG4gICwgdG9PYmplY3QgPSAkLnRvT2JqZWN0O1xuJC5lYWNoLmNhbGwoKCdmcmVlemUsc2VhbCxwcmV2ZW50RXh0ZW5zaW9ucyxpc0Zyb3plbixpc1NlYWxlZCxpc0V4dGVuc2libGUsJyArXG4gICdnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsZ2V0UHJvdG90eXBlT2Ysa2V5cyxnZXRPd25Qcm9wZXJ0eU5hbWVzJykuc3BsaXQoJywnKVxuLCBmdW5jdGlvbihLRVksIElEKXtcbiAgdmFyIGZuICAgICA9ICgkLmNvcmUuT2JqZWN0IHx8IHt9KVtLRVldIHx8IE9iamVjdFtLRVldXG4gICAgLCBmb3JjZWQgPSAwXG4gICAgLCBtZXRob2QgPSB7fTtcbiAgbWV0aG9kW0tFWV0gPSBJRCA9PSAwID8gZnVuY3Rpb24gZnJlZXplKGl0KXtcbiAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gZm4oaXQpIDogaXQ7XG4gIH0gOiBJRCA9PSAxID8gZnVuY3Rpb24gc2VhbChpdCl7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGl0KSA/IGZuKGl0KSA6IGl0O1xuICB9IDogSUQgPT0gMiA/IGZ1bmN0aW9uIHByZXZlbnRFeHRlbnNpb25zKGl0KXtcbiAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gZm4oaXQpIDogaXQ7XG4gIH0gOiBJRCA9PSAzID8gZnVuY3Rpb24gaXNGcm96ZW4oaXQpe1xuICAgIHJldHVybiBpc09iamVjdChpdCkgPyBmbihpdCkgOiB0cnVlO1xuICB9IDogSUQgPT0gNCA/IGZ1bmN0aW9uIGlzU2VhbGVkKGl0KXtcbiAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gZm4oaXQpIDogdHJ1ZTtcbiAgfSA6IElEID09IDUgPyBmdW5jdGlvbiBpc0V4dGVuc2libGUoaXQpe1xuICAgIHJldHVybiBpc09iamVjdChpdCkgPyBmbihpdCkgOiBmYWxzZTtcbiAgfSA6IElEID09IDYgPyBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gICAgcmV0dXJuIGZuKHRvT2JqZWN0KGl0KSwga2V5KTtcbiAgfSA6IElEID09IDcgPyBmdW5jdGlvbiBnZXRQcm90b3R5cGVPZihpdCl7XG4gICAgcmV0dXJuIGZuKE9iamVjdCgkLmFzc2VydERlZmluZWQoaXQpKSk7XG4gIH0gOiBJRCA9PSA4ID8gZnVuY3Rpb24ga2V5cyhpdCl7XG4gICAgcmV0dXJuIGZuKHRvT2JqZWN0KGl0KSk7XG4gIH0gOiByZXF1aXJlKCcuLyQuZ2V0LW5hbWVzJykuZ2V0O1xuICB0cnkge1xuICAgIGZuKCd6Jyk7XG4gIH0gY2F0Y2goZSl7XG4gICAgZm9yY2VkID0gMTtcbiAgfVxuICAkZGVmKCRkZWYuUyArICRkZWYuRiAqIGZvcmNlZCwgJ09iamVjdCcsIG1ldGhvZCk7XG59KTsiLCIndXNlIHN0cmljdCc7XG4vLyAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuLyQuY29mJylcbiAgLCB0bXAgPSB7fTtcbnRtcFtyZXF1aXJlKCcuLyQud2tzJykoJ3RvU3RyaW5nVGFnJyldID0gJ3onO1xuaWYocmVxdWlyZSgnLi8kJykuRlcgJiYgY29mKHRtcCkgIT0gJ3onKXtcbiAgcmVxdWlyZSgnLi8kLnJlZGVmJykoT2JqZWN0LnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKXtcbiAgICByZXR1cm4gJ1tvYmplY3QgJyArIGNvZi5jbGFzc29mKHRoaXMpICsgJ10nO1xuICB9LCB0cnVlKTtcbn0iLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGN0eCAgICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgY29mICAgICAgPSByZXF1aXJlKCcuLyQuY29mJylcbiAgLCAkZGVmICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIGFzc2VydCAgID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpXG4gICwgZm9yT2YgICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCBzZXRQcm90byA9IHJlcXVpcmUoJy4vJC5zZXQtcHJvdG8nKS5zZXRcbiAgLCBzYW1lICAgICA9IHJlcXVpcmUoJy4vJC5zYW1lJylcbiAgLCBzcGVjaWVzICA9IHJlcXVpcmUoJy4vJC5zcGVjaWVzJylcbiAgLCBTUEVDSUVTICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnc3BlY2llcycpXG4gICwgUkVDT1JEICAgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZSgncmVjb3JkJylcbiAgLCBQUk9NSVNFICA9ICdQcm9taXNlJ1xuICAsIGdsb2JhbCAgID0gJC5nXG4gICwgcHJvY2VzcyAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIGlzTm9kZSAgID0gY29mKHByb2Nlc3MpID09ICdwcm9jZXNzJ1xuICAsIGFzYXAgICAgID0gcHJvY2VzcyAmJiBwcm9jZXNzLm5leHRUaWNrIHx8IHJlcXVpcmUoJy4vJC50YXNrJykuc2V0XG4gICwgUCAgICAgICAgPSBnbG9iYWxbUFJPTUlTRV1cbiAgLCBpc0Z1bmN0aW9uICAgICA9ICQuaXNGdW5jdGlvblxuICAsIGlzT2JqZWN0ICAgICAgID0gJC5pc09iamVjdFxuICAsIGFzc2VydEZ1bmN0aW9uID0gYXNzZXJ0LmZuXG4gICwgYXNzZXJ0T2JqZWN0ICAgPSBhc3NlcnQub2JqXG4gICwgV3JhcHBlcjtcblxuZnVuY3Rpb24gdGVzdFJlc29sdmUoc3ViKXtcbiAgdmFyIHRlc3QgPSBuZXcgUChmdW5jdGlvbigpe30pO1xuICBpZihzdWIpdGVzdC5jb25zdHJ1Y3RvciA9IE9iamVjdDtcbiAgcmV0dXJuIFAucmVzb2x2ZSh0ZXN0KSA9PT0gdGVzdDtcbn1cblxudmFyIHVzZU5hdGl2ZSA9IGZ1bmN0aW9uKCl7XG4gIHZhciB3b3JrcyA9IGZhbHNlO1xuICBmdW5jdGlvbiBQMih4KXtcbiAgICB2YXIgc2VsZiA9IG5ldyBQKHgpO1xuICAgIHNldFByb3RvKHNlbGYsIFAyLnByb3RvdHlwZSk7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH1cbiAgdHJ5IHtcbiAgICB3b3JrcyA9IGlzRnVuY3Rpb24oUCkgJiYgaXNGdW5jdGlvbihQLnJlc29sdmUpICYmIHRlc3RSZXNvbHZlKCk7XG4gICAgc2V0UHJvdG8oUDIsIFApO1xuICAgIFAyLnByb3RvdHlwZSA9ICQuY3JlYXRlKFAucHJvdG90eXBlLCB7Y29uc3RydWN0b3I6IHt2YWx1ZTogUDJ9fSk7XG4gICAgLy8gYWN0dWFsIEZpcmVmb3ggaGFzIGJyb2tlbiBzdWJjbGFzcyBzdXBwb3J0LCB0ZXN0IHRoYXRcbiAgICBpZighKFAyLnJlc29sdmUoNSkudGhlbihmdW5jdGlvbigpe30pIGluc3RhbmNlb2YgUDIpKXtcbiAgICAgIHdvcmtzID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIGFjdHVhbCBWOCBidWcsIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTYyXG4gICAgaWYod29ya3MgJiYgJC5ERVNDKXtcbiAgICAgIHZhciB0aGVuYWJsZVRoZW5Hb3R0ZW4gPSBmYWxzZTtcbiAgICAgIFAucmVzb2x2ZSgkLnNldERlc2Moe30sICd0aGVuJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCl7IHRoZW5hYmxlVGhlbkdvdHRlbiA9IHRydWU7IH1cbiAgICAgIH0pKTtcbiAgICAgIHdvcmtzID0gdGhlbmFibGVUaGVuR290dGVuO1xuICAgIH1cbiAgfSBjYXRjaChlKXsgd29ya3MgPSBmYWxzZTsgfVxuICByZXR1cm4gd29ya3M7XG59KCk7XG5cbi8vIGhlbHBlcnNcbmZ1bmN0aW9uIGlzUHJvbWlzZShpdCl7XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgKHVzZU5hdGl2ZSA/IGNvZi5jbGFzc29mKGl0KSA9PSAnUHJvbWlzZScgOiBSRUNPUkQgaW4gaXQpO1xufVxuZnVuY3Rpb24gc2FtZUNvbnN0cnVjdG9yKGEsIGIpe1xuICAvLyBsaWJyYXJ5IHdyYXBwZXIgc3BlY2lhbCBjYXNlXG4gIGlmKCEkLkZXICYmIGEgPT09IFAgJiYgYiA9PT0gV3JhcHBlcilyZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIHNhbWUoYSwgYik7XG59XG5mdW5jdGlvbiBnZXRDb25zdHJ1Y3RvcihDKXtcbiAgdmFyIFMgPSBhc3NlcnRPYmplY3QoQylbU1BFQ0lFU107XG4gIHJldHVybiBTICE9IHVuZGVmaW5lZCA/IFMgOiBDO1xufVxuZnVuY3Rpb24gaXNUaGVuYWJsZShpdCl7XG4gIHZhciB0aGVuO1xuICBpZihpc09iamVjdChpdCkpdGhlbiA9IGl0LnRoZW47XG4gIHJldHVybiBpc0Z1bmN0aW9uKHRoZW4pID8gdGhlbiA6IGZhbHNlO1xufVxuZnVuY3Rpb24gbm90aWZ5KHJlY29yZCl7XG4gIHZhciBjaGFpbiA9IHJlY29yZC5jO1xuICAvLyBzdHJhbmdlIElFICsgd2VicGFjayBkZXYgc2VydmVyIGJ1ZyAtIHVzZSAuY2FsbChnbG9iYWwpXG4gIGlmKGNoYWluLmxlbmd0aClhc2FwLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbigpe1xuICAgIHZhciB2YWx1ZSA9IHJlY29yZC52XG4gICAgICAsIG9rICAgID0gcmVjb3JkLnMgPT0gMVxuICAgICAgLCBpICAgICA9IDA7XG4gICAgZnVuY3Rpb24gcnVuKHJlYWN0KXtcbiAgICAgIHZhciBjYiA9IG9rID8gcmVhY3Qub2sgOiByZWFjdC5mYWlsXG4gICAgICAgICwgcmV0LCB0aGVuO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYoY2Ipe1xuICAgICAgICAgIGlmKCFvaylyZWNvcmQuaCA9IHRydWU7XG4gICAgICAgICAgcmV0ID0gY2IgPT09IHRydWUgPyB2YWx1ZSA6IGNiKHZhbHVlKTtcbiAgICAgICAgICBpZihyZXQgPT09IHJlYWN0LlApe1xuICAgICAgICAgICAgcmVhY3QucmVqKFR5cGVFcnJvcignUHJvbWlzZS1jaGFpbiBjeWNsZScpKTtcbiAgICAgICAgICB9IGVsc2UgaWYodGhlbiA9IGlzVGhlbmFibGUocmV0KSl7XG4gICAgICAgICAgICB0aGVuLmNhbGwocmV0LCByZWFjdC5yZXMsIHJlYWN0LnJlaik7XG4gICAgICAgICAgfSBlbHNlIHJlYWN0LnJlcyhyZXQpO1xuICAgICAgICB9IGVsc2UgcmVhY3QucmVqKHZhbHVlKTtcbiAgICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICAgcmVhY3QucmVqKGVycik7XG4gICAgICB9XG4gICAgfVxuICAgIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpcnVuKGNoYWluW2krK10pOyAvLyB2YXJpYWJsZSBsZW5ndGggLSBjYW4ndCB1c2UgZm9yRWFjaFxuICAgIGNoYWluLmxlbmd0aCA9IDA7XG4gIH0pO1xufVxuZnVuY3Rpb24gaXNVbmhhbmRsZWQocHJvbWlzZSl7XG4gIHZhciByZWNvcmQgPSBwcm9taXNlW1JFQ09SRF1cbiAgICAsIGNoYWluICA9IHJlY29yZC5hIHx8IHJlY29yZC5jXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCByZWFjdDtcbiAgaWYocmVjb3JkLmgpcmV0dXJuIGZhbHNlO1xuICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXtcbiAgICByZWFjdCA9IGNoYWluW2krK107XG4gICAgaWYocmVhY3QuZmFpbCB8fCAhaXNVbmhhbmRsZWQocmVhY3QuUCkpcmV0dXJuIGZhbHNlO1xuICB9IHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gJHJlamVjdCh2YWx1ZSl7XG4gIHZhciByZWNvcmQgPSB0aGlzXG4gICAgLCBwcm9taXNlO1xuICBpZihyZWNvcmQuZClyZXR1cm47XG4gIHJlY29yZC5kID0gdHJ1ZTtcbiAgcmVjb3JkID0gcmVjb3JkLnIgfHwgcmVjb3JkOyAvLyB1bndyYXBcbiAgcmVjb3JkLnYgPSB2YWx1ZTtcbiAgcmVjb3JkLnMgPSAyO1xuICByZWNvcmQuYSA9IHJlY29yZC5jLnNsaWNlKCk7XG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAvLyBzdHJhbmdlIElFICsgd2VicGFjayBkZXYgc2VydmVyIGJ1ZyAtIHVzZSAuY2FsbChnbG9iYWwpXG4gICAgYXNhcC5jYWxsKGdsb2JhbCwgZnVuY3Rpb24oKXtcbiAgICAgIGlmKGlzVW5oYW5kbGVkKHByb21pc2UgPSByZWNvcmQucCkpe1xuICAgICAgICBpZihpc05vZGUpe1xuICAgICAgICAgIHByb2Nlc3MuZW1pdCgndW5oYW5kbGVkUmVqZWN0aW9uJywgdmFsdWUsIHByb21pc2UpO1xuICAgICAgICB9IGVsc2UgaWYoZ2xvYmFsLmNvbnNvbGUgJiYgY29uc29sZS5lcnJvcil7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uJywgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZWNvcmQuYSA9IHVuZGVmaW5lZDtcbiAgICB9KTtcbiAgfSwgMSk7XG4gIG5vdGlmeShyZWNvcmQpO1xufVxuZnVuY3Rpb24gJHJlc29sdmUodmFsdWUpe1xuICB2YXIgcmVjb3JkID0gdGhpc1xuICAgICwgdGhlbjtcbiAgaWYocmVjb3JkLmQpcmV0dXJuO1xuICByZWNvcmQuZCA9IHRydWU7XG4gIHJlY29yZCA9IHJlY29yZC5yIHx8IHJlY29yZDsgLy8gdW53cmFwXG4gIHRyeSB7XG4gICAgaWYodGhlbiA9IGlzVGhlbmFibGUodmFsdWUpKXtcbiAgICAgIC8vIHN0cmFuZ2UgSUUgKyB3ZWJwYWNrIGRldiBzZXJ2ZXIgYnVnIC0gdXNlIC5jYWxsKGdsb2JhbClcbiAgICAgIGFzYXAuY2FsbChnbG9iYWwsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB3cmFwcGVyID0ge3I6IHJlY29yZCwgZDogZmFsc2V9OyAvLyB3cmFwXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhlbi5jYWxsKHZhbHVlLCBjdHgoJHJlc29sdmUsIHdyYXBwZXIsIDEpLCBjdHgoJHJlamVjdCwgd3JhcHBlciwgMSkpO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICRyZWplY3QuY2FsbCh3cmFwcGVyLCBlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlY29yZC52ID0gdmFsdWU7XG4gICAgICByZWNvcmQucyA9IDE7XG4gICAgICBub3RpZnkocmVjb3JkKTtcbiAgICB9XG4gIH0gY2F0Y2goZSl7XG4gICAgJHJlamVjdC5jYWxsKHtyOiByZWNvcmQsIGQ6IGZhbHNlfSwgZSk7IC8vIHdyYXBcbiAgfVxufVxuXG4vLyBjb25zdHJ1Y3RvciBwb2x5ZmlsbFxuaWYoIXVzZU5hdGl2ZSl7XG4gIC8vIDI1LjQuMy4xIFByb21pc2UoZXhlY3V0b3IpXG4gIFAgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKXtcbiAgICBhc3NlcnRGdW5jdGlvbihleGVjdXRvcik7XG4gICAgdmFyIHJlY29yZCA9IHtcbiAgICAgIHA6IGFzc2VydC5pbnN0KHRoaXMsIFAsIFBST01JU0UpLCAgICAgICAvLyA8LSBwcm9taXNlXG4gICAgICBjOiBbXSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gYXdhaXRpbmcgcmVhY3Rpb25zXG4gICAgICBhOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gY2hlY2tlZCBpbiBpc1VuaGFuZGxlZCByZWFjdGlvbnNcbiAgICAgIHM6IDAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBzdGF0ZVxuICAgICAgZDogZmFsc2UsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGRvbmVcbiAgICAgIHY6IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSB2YWx1ZVxuICAgICAgaDogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGhhbmRsZWQgcmVqZWN0aW9uXG4gICAgfTtcbiAgICAkLmhpZGUodGhpcywgUkVDT1JELCByZWNvcmQpO1xuICAgIHRyeSB7XG4gICAgICBleGVjdXRvcihjdHgoJHJlc29sdmUsIHJlY29yZCwgMSksIGN0eCgkcmVqZWN0LCByZWNvcmQsIDEpKTtcbiAgICB9IGNhdGNoKGVycil7XG4gICAgICAkcmVqZWN0LmNhbGwocmVjb3JkLCBlcnIpO1xuICAgIH1cbiAgfTtcbiAgcmVxdWlyZSgnLi8kLm1peCcpKFAucHJvdG90eXBlLCB7XG4gICAgLy8gMjUuNC41LjMgUHJvbWlzZS5wcm90b3R5cGUudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZClcbiAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKXtcbiAgICAgIHZhciBTID0gYXNzZXJ0T2JqZWN0KGFzc2VydE9iamVjdCh0aGlzKS5jb25zdHJ1Y3RvcilbU1BFQ0lFU107XG4gICAgICB2YXIgcmVhY3QgPSB7XG4gICAgICAgIG9rOiAgIGlzRnVuY3Rpb24ob25GdWxmaWxsZWQpID8gb25GdWxmaWxsZWQgOiB0cnVlLFxuICAgICAgICBmYWlsOiBpc0Z1bmN0aW9uKG9uUmVqZWN0ZWQpICA/IG9uUmVqZWN0ZWQgIDogZmFsc2VcbiAgICAgIH07XG4gICAgICB2YXIgcHJvbWlzZSA9IHJlYWN0LlAgPSBuZXcgKFMgIT0gdW5kZWZpbmVkID8gUyA6IFApKGZ1bmN0aW9uKHJlcywgcmVqKXtcbiAgICAgICAgcmVhY3QucmVzID0gYXNzZXJ0RnVuY3Rpb24ocmVzKTtcbiAgICAgICAgcmVhY3QucmVqID0gYXNzZXJ0RnVuY3Rpb24ocmVqKTtcbiAgICAgIH0pO1xuICAgICAgdmFyIHJlY29yZCA9IHRoaXNbUkVDT1JEXTtcbiAgICAgIHJlY29yZC5jLnB1c2gocmVhY3QpO1xuICAgICAgaWYocmVjb3JkLmEpcmVjb3JkLmEucHVzaChyZWFjdCk7XG4gICAgICBpZihyZWNvcmQucylub3RpZnkocmVjb3JkKTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH0sXG4gICAgLy8gMjUuNC41LjEgUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2gob25SZWplY3RlZClcbiAgICAnY2F0Y2gnOiBmdW5jdGlvbihvblJlamVjdGVkKXtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGVkKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vLyBleHBvcnRcbiRkZWYoJGRlZi5HICsgJGRlZi5XICsgJGRlZi5GICogIXVzZU5hdGl2ZSwge1Byb21pc2U6IFB9KTtcbmNvZi5zZXQoUCwgUFJPTUlTRSk7XG5zcGVjaWVzKFApO1xuc3BlY2llcyhXcmFwcGVyID0gJC5jb3JlW1BST01JU0VdKTtcblxuLy8gc3RhdGljc1xuJGRlZigkZGVmLlMgKyAkZGVmLkYgKiAhdXNlTmF0aXZlLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC41IFByb21pc2UucmVqZWN0KHIpXG4gIHJlamVjdDogZnVuY3Rpb24gcmVqZWN0KHIpe1xuICAgIHJldHVybiBuZXcgKGdldENvbnN0cnVjdG9yKHRoaXMpKShmdW5jdGlvbihyZXMsIHJlail7IHJlaihyKTsgfSk7XG4gIH1cbn0pO1xuJGRlZigkZGVmLlMgKyAkZGVmLkYgKiAoIXVzZU5hdGl2ZSB8fCB0ZXN0UmVzb2x2ZSh0cnVlKSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjYgUHJvbWlzZS5yZXNvbHZlKHgpXG4gIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoeCl7XG4gICAgcmV0dXJuIGlzUHJvbWlzZSh4KSAmJiBzYW1lQ29uc3RydWN0b3IoeC5jb25zdHJ1Y3RvciwgdGhpcylcbiAgICAgID8geCA6IG5ldyB0aGlzKGZ1bmN0aW9uKHJlcyl7IHJlcyh4KTsgfSk7XG4gIH1cbn0pO1xuJGRlZigkZGVmLlMgKyAkZGVmLkYgKiAhKHVzZU5hdGl2ZSAmJiByZXF1aXJlKCcuLyQuaXRlci1kZXRlY3QnKShmdW5jdGlvbihpdGVyKXtcbiAgUC5hbGwoaXRlcilbJ2NhdGNoJ10oZnVuY3Rpb24oKXt9KTtcbn0pKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuMSBQcm9taXNlLmFsbChpdGVyYWJsZSlcbiAgYWxsOiBmdW5jdGlvbiBhbGwoaXRlcmFibGUpe1xuICAgIHZhciBDICAgICAgPSBnZXRDb25zdHJ1Y3Rvcih0aGlzKVxuICAgICAgLCB2YWx1ZXMgPSBbXTtcbiAgICByZXR1cm4gbmV3IEMoZnVuY3Rpb24ocmVzLCByZWope1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCB2YWx1ZXMucHVzaCwgdmFsdWVzKTtcbiAgICAgIHZhciByZW1haW5pbmcgPSB2YWx1ZXMubGVuZ3RoXG4gICAgICAgICwgcmVzdWx0cyAgID0gQXJyYXkocmVtYWluaW5nKTtcbiAgICAgIGlmKHJlbWFpbmluZykkLmVhY2guY2FsbCh2YWx1ZXMsIGZ1bmN0aW9uKHByb21pc2UsIGluZGV4KXtcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgIHJlc3VsdHNbaW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgLS1yZW1haW5pbmcgfHwgcmVzKHJlc3VsdHMpO1xuICAgICAgICB9LCByZWopO1xuICAgICAgfSk7XG4gICAgICBlbHNlIHJlcyhyZXN1bHRzKTtcbiAgICB9KTtcbiAgfSxcbiAgLy8gMjUuNC40LjQgUHJvbWlzZS5yYWNlKGl0ZXJhYmxlKVxuICByYWNlOiBmdW5jdGlvbiByYWNlKGl0ZXJhYmxlKXtcbiAgICB2YXIgQyA9IGdldENvbnN0cnVjdG9yKHRoaXMpO1xuICAgIHJldHVybiBuZXcgQyhmdW5jdGlvbihyZXMsIHJlail7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihyZXMsIHJlaik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uLXN0cm9uZycpO1xuXG4vLyAyMy4yIFNldCBPYmplY3RzXG5yZXF1aXJlKCcuLyQuY29sbGVjdGlvbicpKCdTZXQnLCBmdW5jdGlvbihnZXQpe1xuICByZXR1cm4gZnVuY3Rpb24gU2V0KCl7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzWzBdKTsgfTtcbn0sIHtcbiAgLy8gMjMuMi4zLjEgU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXG4gIGFkZDogZnVuY3Rpb24gYWRkKHZhbHVlKXtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih0aGlzLCB2YWx1ZSA9IHZhbHVlID09PSAwID8gMCA6IHZhbHVlLCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZyk7IiwidmFyIHNldCAgID0gcmVxdWlyZSgnLi8kJykuc2V0XG4gICwgJGF0ICAgPSByZXF1aXJlKCcuLyQuc3RyaW5nLWF0JykodHJ1ZSlcbiAgLCBJVEVSICA9IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdpdGVyJylcbiAgLCAkaXRlciA9IHJlcXVpcmUoJy4vJC5pdGVyJylcbiAgLCBzdGVwICA9ICRpdGVyLnN0ZXA7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vJC5pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uKGl0ZXJhdGVkKXtcbiAgc2V0KHRoaXMsIElURVIsIHtvOiBTdHJpbmcoaXRlcmF0ZWQpLCBpOiAwfSk7XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgaXRlciAgPSB0aGlzW0lURVJdXG4gICAgLCBPICAgICA9IGl0ZXIub1xuICAgICwgaW5kZXggPSBpdGVyLmlcbiAgICAsIHBvaW50O1xuICBpZihpbmRleCA+PSBPLmxlbmd0aClyZXR1cm4gc3RlcCgxKTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICBpdGVyLmkgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4gc3RlcCgwLCBwb2ludCk7XG59KTsiLCIndXNlIHN0cmljdCc7XG4vLyBFQ01BU2NyaXB0IDYgc3ltYm9scyBzaGltXG52YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIHNldFRhZyAgID0gcmVxdWlyZSgnLi8kLmNvZicpLnNldFxuICAsIHVpZCAgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpXG4gICwgc2hhcmVkICAgPSByZXF1aXJlKCcuLyQuc2hhcmVkJylcbiAgLCAkZGVmICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsICRyZWRlZiAgID0gcmVxdWlyZSgnLi8kLnJlZGVmJylcbiAgLCBrZXlPZiAgICA9IHJlcXVpcmUoJy4vJC5rZXlvZicpXG4gICwgZW51bUtleXMgPSByZXF1aXJlKCcuLyQuZW51bS1rZXlzJylcbiAgLCBhc3NlcnRPYmplY3QgPSByZXF1aXJlKCcuLyQuYXNzZXJ0Jykub2JqXG4gICwgT2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlXG4gICwgREVTQyAgICAgPSAkLkRFU0NcbiAgLCBoYXMgICAgICA9ICQuaGFzXG4gICwgJGNyZWF0ZSAgPSAkLmNyZWF0ZVxuICAsIGdldERlc2MgID0gJC5nZXREZXNjXG4gICwgc2V0RGVzYyAgPSAkLnNldERlc2NcbiAgLCBkZXNjICAgICA9ICQuZGVzY1xuICAsICRuYW1lcyAgID0gcmVxdWlyZSgnLi8kLmdldC1uYW1lcycpXG4gICwgZ2V0TmFtZXMgPSAkbmFtZXMuZ2V0XG4gICwgdG9PYmplY3QgPSAkLnRvT2JqZWN0XG4gICwgJFN5bWJvbCAgPSAkLmcuU3ltYm9sXG4gICwgc2V0dGVyICAgPSBmYWxzZVxuICAsIFRBRyAgICAgID0gdWlkKCd0YWcnKVxuICAsIEhJRERFTiAgID0gdWlkKCdoaWRkZW4nKVxuICAsIF9wcm9wZXJ0eUlzRW51bWVyYWJsZSA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlXG4gICwgU3ltYm9sUmVnaXN0cnkgPSBzaGFyZWQoJ3N5bWJvbC1yZWdpc3RyeScpXG4gICwgQWxsU3ltYm9scyA9IHNoYXJlZCgnc3ltYm9scycpXG4gICwgdXNlTmF0aXZlID0gJC5pc0Z1bmN0aW9uKCRTeW1ib2wpO1xuXG52YXIgc2V0U3ltYm9sRGVzYyA9IERFU0MgPyBmdW5jdGlvbigpeyAvLyBmYWxsYmFjayBmb3Igb2xkIEFuZHJvaWRcbiAgdHJ5IHtcbiAgICByZXR1cm4gJGNyZWF0ZShzZXREZXNjKHt9LCBISURERU4sIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHNldERlc2ModGhpcywgSElEREVOLCB7dmFsdWU6IGZhbHNlfSlbSElEREVOXTtcbiAgICAgIH1cbiAgICB9KSlbSElEREVOXSB8fCBzZXREZXNjO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiBmdW5jdGlvbihpdCwga2V5LCBEKXtcbiAgICAgIHZhciBwcm90b0Rlc2MgPSBnZXREZXNjKE9iamVjdFByb3RvLCBrZXkpO1xuICAgICAgaWYocHJvdG9EZXNjKWRlbGV0ZSBPYmplY3RQcm90b1trZXldO1xuICAgICAgc2V0RGVzYyhpdCwga2V5LCBEKTtcbiAgICAgIGlmKHByb3RvRGVzYyAmJiBpdCAhPT0gT2JqZWN0UHJvdG8pc2V0RGVzYyhPYmplY3RQcm90bywga2V5LCBwcm90b0Rlc2MpO1xuICAgIH07XG4gIH1cbn0oKSA6IHNldERlc2M7XG5cbmZ1bmN0aW9uIHdyYXAodGFnKXtcbiAgdmFyIHN5bSA9IEFsbFN5bWJvbHNbdGFnXSA9ICQuc2V0KCRjcmVhdGUoJFN5bWJvbC5wcm90b3R5cGUpLCBUQUcsIHRhZyk7XG4gIERFU0MgJiYgc2V0dGVyICYmIHNldFN5bWJvbERlc2MoT2JqZWN0UHJvdG8sIHRhZywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIGlmKGhhcyh0aGlzLCBISURERU4pICYmIGhhcyh0aGlzW0hJRERFTl0sIHRhZykpdGhpc1tISURERU5dW3RhZ10gPSBmYWxzZTtcbiAgICAgIHNldFN5bWJvbERlc2ModGhpcywgdGFnLCBkZXNjKDEsIHZhbHVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHN5bTtcbn1cblxuZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgRCl7XG4gIGlmKEQgJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkpe1xuICAgIGlmKCFELmVudW1lcmFibGUpe1xuICAgICAgaWYoIWhhcyhpdCwgSElEREVOKSlzZXREZXNjKGl0LCBISURERU4sIGRlc2MoMSwge30pKTtcbiAgICAgIGl0W0hJRERFTl1ba2V5XSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0paXRbSElEREVOXVtrZXldID0gZmFsc2U7XG4gICAgICBEID0gJGNyZWF0ZShELCB7ZW51bWVyYWJsZTogZGVzYygwLCBmYWxzZSl9KTtcbiAgICB9IHJldHVybiBzZXRTeW1ib2xEZXNjKGl0LCBrZXksIEQpO1xuICB9IHJldHVybiBzZXREZXNjKGl0LCBrZXksIEQpO1xufVxuZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhpdCwgUCl7XG4gIGFzc2VydE9iamVjdChpdCk7XG4gIHZhciBrZXlzID0gZW51bUtleXMoUCA9IHRvT2JqZWN0KFApKVxuICAgICwgaSAgICA9IDBcbiAgICAsIGwgPSBrZXlzLmxlbmd0aFxuICAgICwga2V5O1xuICB3aGlsZShsID4gaSlkZWZpbmVQcm9wZXJ0eShpdCwga2V5ID0ga2V5c1tpKytdLCBQW2tleV0pO1xuICByZXR1cm4gaXQ7XG59XG5mdW5jdGlvbiBjcmVhdGUoaXQsIFApe1xuICByZXR1cm4gUCA9PT0gdW5kZWZpbmVkID8gJGNyZWF0ZShpdCkgOiBkZWZpbmVQcm9wZXJ0aWVzKCRjcmVhdGUoaXQpLCBQKTtcbn1cbmZ1bmN0aW9uIHByb3BlcnR5SXNFbnVtZXJhYmxlKGtleSl7XG4gIHZhciBFID0gX3Byb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodGhpcywga2V5KTtcbiAgcmV0dXJuIEUgfHwgIWhhcyh0aGlzLCBrZXkpIHx8ICFoYXMoQWxsU3ltYm9scywga2V5KSB8fCBoYXModGhpcywgSElEREVOKSAmJiB0aGlzW0hJRERFTl1ba2V5XVxuICAgID8gRSA6IHRydWU7XG59XG5mdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gIHZhciBEID0gZ2V0RGVzYyhpdCA9IHRvT2JqZWN0KGl0KSwga2V5KTtcbiAgaWYoRCAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0pKUQuZW51bWVyYWJsZSA9IHRydWU7XG4gIHJldHVybiBEO1xufVxuZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCl7XG4gIHZhciBuYW1lcyAgPSBnZXROYW1lcyh0b09iamVjdChpdCkpXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwgaSAgICAgID0gMFxuICAgICwga2V5O1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKCFoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYga2V5ICE9IEhJRERFTilyZXN1bHQucHVzaChrZXkpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGl0KXtcbiAgdmFyIG5hbWVzICA9IGdldE5hbWVzKHRvT2JqZWN0KGl0KSlcbiAgICAsIHJlc3VsdCA9IFtdXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpaWYoaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pKXJlc3VsdC5wdXNoKEFsbFN5bWJvbHNba2V5XSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIDE5LjQuMS4xIFN5bWJvbChbZGVzY3JpcHRpb25dKVxuaWYoIXVzZU5hdGl2ZSl7XG4gICRTeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2woKXtcbiAgICBpZih0aGlzIGluc3RhbmNlb2YgJFN5bWJvbCl0aHJvdyBUeXBlRXJyb3IoJ1N5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xuICAgIHJldHVybiB3cmFwKHVpZChhcmd1bWVudHNbMF0pKTtcbiAgfTtcbiAgJHJlZGVmKCRTeW1ib2wucHJvdG90eXBlLCAndG9TdHJpbmcnLCBmdW5jdGlvbigpe1xuICAgIHJldHVybiB0aGlzW1RBR107XG4gIH0pO1xuXG4gICQuY3JlYXRlICAgICA9IGNyZWF0ZTtcbiAgJC5zZXREZXNjICAgID0gZGVmaW5lUHJvcGVydHk7XG4gICQuZ2V0RGVzYyAgICA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgJC5zZXREZXNjcyAgID0gZGVmaW5lUHJvcGVydGllcztcbiAgJC5nZXROYW1lcyAgID0gJG5hbWVzLmdldCA9IGdldE93blByb3BlcnR5TmFtZXM7XG4gICQuZ2V0U3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scztcblxuICBpZigkLkRFU0MgJiYgJC5GVykkcmVkZWYoT2JqZWN0UHJvdG8sICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsIHByb3BlcnR5SXNFbnVtZXJhYmxlLCB0cnVlKTtcbn1cblxudmFyIHN5bWJvbFN0YXRpY3MgPSB7XG4gIC8vIDE5LjQuMi4xIFN5bWJvbC5mb3Ioa2V5KVxuICAnZm9yJzogZnVuY3Rpb24oa2V5KXtcbiAgICByZXR1cm4gaGFzKFN5bWJvbFJlZ2lzdHJ5LCBrZXkgKz0gJycpXG4gICAgICA/IFN5bWJvbFJlZ2lzdHJ5W2tleV1cbiAgICAgIDogU3ltYm9sUmVnaXN0cnlba2V5XSA9ICRTeW1ib2woa2V5KTtcbiAgfSxcbiAgLy8gMTkuNC4yLjUgU3ltYm9sLmtleUZvcihzeW0pXG4gIGtleUZvcjogZnVuY3Rpb24ga2V5Rm9yKGtleSl7XG4gICAgcmV0dXJuIGtleU9mKFN5bWJvbFJlZ2lzdHJ5LCBrZXkpO1xuICB9LFxuICB1c2VTZXR0ZXI6IGZ1bmN0aW9uKCl7IHNldHRlciA9IHRydWU7IH0sXG4gIHVzZVNpbXBsZTogZnVuY3Rpb24oKXsgc2V0dGVyID0gZmFsc2U7IH1cbn07XG4vLyAxOS40LjIuMiBTeW1ib2wuaGFzSW5zdGFuY2Vcbi8vIDE5LjQuMi4zIFN5bWJvbC5pc0NvbmNhdFNwcmVhZGFibGVcbi8vIDE5LjQuMi40IFN5bWJvbC5pdGVyYXRvclxuLy8gMTkuNC4yLjYgU3ltYm9sLm1hdGNoXG4vLyAxOS40LjIuOCBTeW1ib2wucmVwbGFjZVxuLy8gMTkuNC4yLjkgU3ltYm9sLnNlYXJjaFxuLy8gMTkuNC4yLjEwIFN5bWJvbC5zcGVjaWVzXG4vLyAxOS40LjIuMTEgU3ltYm9sLnNwbGl0XG4vLyAxOS40LjIuMTIgU3ltYm9sLnRvUHJpbWl0aXZlXG4vLyAxOS40LjIuMTMgU3ltYm9sLnRvU3RyaW5nVGFnXG4vLyAxOS40LjIuMTQgU3ltYm9sLnVuc2NvcGFibGVzXG4kLmVhY2guY2FsbCgoXG4gICAgJ2hhc0luc3RhbmNlLGlzQ29uY2F0U3ByZWFkYWJsZSxpdGVyYXRvcixtYXRjaCxyZXBsYWNlLHNlYXJjaCwnICtcbiAgICAnc3BlY2llcyxzcGxpdCx0b1ByaW1pdGl2ZSx0b1N0cmluZ1RhZyx1bnNjb3BhYmxlcydcbiAgKS5zcGxpdCgnLCcpLCBmdW5jdGlvbihpdCl7XG4gICAgdmFyIHN5bSA9IHJlcXVpcmUoJy4vJC53a3MnKShpdCk7XG4gICAgc3ltYm9sU3RhdGljc1tpdF0gPSB1c2VOYXRpdmUgPyBzeW0gOiB3cmFwKHN5bSk7XG4gIH1cbik7XG5cbnNldHRlciA9IHRydWU7XG5cbiRkZWYoJGRlZi5HICsgJGRlZi5XLCB7U3ltYm9sOiAkU3ltYm9sfSk7XG5cbiRkZWYoJGRlZi5TLCAnU3ltYm9sJywgc3ltYm9sU3RhdGljcyk7XG5cbiRkZWYoJGRlZi5TICsgJGRlZi5GICogIXVzZU5hdGl2ZSwgJ09iamVjdCcsIHtcbiAgLy8gMTkuMS4yLjIgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxuICBjcmVhdGU6IGNyZWF0ZSxcbiAgLy8gMTkuMS4yLjQgT2JqZWN0LmRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpXG4gIGRlZmluZVByb3BlcnR5OiBkZWZpbmVQcm9wZXJ0eSxcbiAgLy8gMTkuMS4yLjMgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcylcbiAgZGVmaW5lUHJvcGVydGllczogZGVmaW5lUHJvcGVydGllcyxcbiAgLy8gMTkuMS4yLjYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKVxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IGdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgLy8gMTkuMS4yLjcgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcbiAgZ2V0T3duUHJvcGVydHlOYW1lczogZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgLy8gMTkuMS4yLjggT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhPKVxuICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6IGdldE93blByb3BlcnR5U3ltYm9sc1xufSk7XG5cbi8vIDE5LjQuMy41IFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ11cbnNldFRhZygkU3ltYm9sLCAnU3ltYm9sJyk7XG4vLyAyMC4yLjEuOSBNYXRoW0BAdG9TdHJpbmdUYWddXG5zZXRUYWcoTWF0aCwgJ01hdGgnLCB0cnVlKTtcbi8vIDI0LjMuMyBKU09OW0BAdG9TdHJpbmdUYWddXG5zZXRUYWcoJC5nLkpTT04sICdKU09OJywgdHJ1ZSk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxucmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24tdG8tanNvbicpKCdNYXAnKTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG5yZXF1aXJlKCcuLyQuY29sbGVjdGlvbi10by1qc29uJykoJ1NldCcpOyIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgJCAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIEl0ZXJhdG9ycyAgID0gcmVxdWlyZSgnLi8kLml0ZXInKS5JdGVyYXRvcnNcbiAgLCBJVEVSQVRPUiAgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIEFycmF5VmFsdWVzID0gSXRlcmF0b3JzLkFycmF5XG4gICwgTkwgICAgICAgICAgPSAkLmcuTm9kZUxpc3RcbiAgLCBIVEMgICAgICAgICA9ICQuZy5IVE1MQ29sbGVjdGlvblxuICAsIE5MUHJvdG8gICAgID0gTkwgJiYgTkwucHJvdG90eXBlXG4gICwgSFRDUHJvdG8gICAgPSBIVEMgJiYgSFRDLnByb3RvdHlwZTtcbmlmKCQuRlcpe1xuICBpZihOTCAmJiAhKElURVJBVE9SIGluIE5MUHJvdG8pKSQuaGlkZShOTFByb3RvLCBJVEVSQVRPUiwgQXJyYXlWYWx1ZXMpO1xuICBpZihIVEMgJiYgIShJVEVSQVRPUiBpbiBIVENQcm90bykpJC5oaWRlKEhUQ1Byb3RvLCBJVEVSQVRPUiwgQXJyYXlWYWx1ZXMpO1xufVxuSXRlcmF0b3JzLk5vZGVMaXN0ID0gSXRlcmF0b3JzLkhUTUxDb2xsZWN0aW9uID0gQXJyYXlWYWx1ZXM7IiwiLy8gVGhpcyBtZXRob2Qgb2Ygb2J0YWluaW5nIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0IG5lZWRzIHRvIGJlXG4vLyBrZXB0IGlkZW50aWNhbCB0byB0aGUgd2F5IGl0IGlzIG9idGFpbmVkIGluIHJ1bnRpbWUuanNcbnZhciBnID1cbiAgdHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiA/IGdsb2JhbCA6XG4gIHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIgPyB3aW5kb3cgOlxuICB0eXBlb2Ygc2VsZiA9PT0gXCJvYmplY3RcIiA/IHNlbGYgOiB0aGlzO1xuXG4vLyBVc2UgYGdldE93blByb3BlcnR5TmFtZXNgIGJlY2F1c2Ugbm90IGFsbCBicm93c2VycyBzdXBwb3J0IGNhbGxpbmdcbi8vIGBoYXNPd25Qcm9wZXJ0eWAgb24gdGhlIGdsb2JhbCBgc2VsZmAgb2JqZWN0IGluIGEgd29ya2VyLiBTZWUgIzE4My5cbnZhciBoYWRSdW50aW1lID0gZy5yZWdlbmVyYXRvclJ1bnRpbWUgJiZcbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZykuaW5kZXhPZihcInJlZ2VuZXJhdG9yUnVudGltZVwiKSA+PSAwO1xuXG4vLyBTYXZlIHRoZSBvbGQgcmVnZW5lcmF0b3JSdW50aW1lIGluIGNhc2UgaXQgbmVlZHMgdG8gYmUgcmVzdG9yZWQgbGF0ZXIuXG52YXIgb2xkUnVudGltZSA9IGhhZFJ1bnRpbWUgJiYgZy5yZWdlbmVyYXRvclJ1bnRpbWU7XG5cbi8vIEZvcmNlIHJlZXZhbHV0YXRpb24gb2YgcnVudGltZS5qcy5cbmcucmVnZW5lcmF0b3JSdW50aW1lID0gdW5kZWZpbmVkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL3J1bnRpbWVcIik7XG5cbmlmIChoYWRSdW50aW1lKSB7XG4gIC8vIFJlc3RvcmUgdGhlIG9yaWdpbmFsIHJ1bnRpbWUuXG4gIGcucmVnZW5lcmF0b3JSdW50aW1lID0gb2xkUnVudGltZTtcbn0gZWxzZSB7XG4gIC8vIFJlbW92ZSB0aGUgZ2xvYmFsIHByb3BlcnR5IGFkZGVkIGJ5IHJ1bnRpbWUuanMuXG4gIGRlbGV0ZSBnLnJlZ2VuZXJhdG9yUnVudGltZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiBtb2R1bGUuZXhwb3J0cywgX19lc01vZHVsZTogdHJ1ZSB9O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9tYXN0ZXIvTElDRU5TRSBmaWxlLiBBblxuICogYWRkaXRpb25hbCBncmFudCBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluXG4gKiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfU3ltYm9sID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9zeW1ib2xcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX1N5bWJvbCRpdGVyYXRvciA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvc3ltYm9sL2l0ZXJhdG9yXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9PYmplY3QkY3JlYXRlID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvY3JlYXRlXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIF9Qcm9taXNlID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9wcm9taXNlXCIpW1wiZGVmYXVsdFwiXTtcblxuIShmdW5jdGlvbiAoZ2xvYmFsKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gdHlwZW9mIF9TeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBfU3ltYm9sJGl0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuXG4gIHZhciBpbk1vZHVsZSA9IHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCI7XG4gIHZhciBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZTtcbiAgaWYgKHJ1bnRpbWUpIHtcbiAgICBpZiAoaW5Nb2R1bGUpIHtcbiAgICAgIC8vIElmIHJlZ2VuZXJhdG9yUnVudGltZSBpcyBkZWZpbmVkIGdsb2JhbGx5IGFuZCB3ZSdyZSBpbiBhIG1vZHVsZSxcbiAgICAgIC8vIG1ha2UgdGhlIGV4cG9ydHMgb2JqZWN0IGlkZW50aWNhbCB0byByZWdlbmVyYXRvclJ1bnRpbWUuXG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IHJ1bnRpbWU7XG4gICAgfVxuICAgIC8vIERvbid0IGJvdGhlciBldmFsdWF0aW5nIHRoZSByZXN0IG9mIHRoaXMgZmlsZSBpZiB0aGUgcnVudGltZSB3YXNcbiAgICAvLyBhbHJlYWR5IGRlZmluZWQgZ2xvYmFsbHkuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRGVmaW5lIHRoZSBydW50aW1lIGdsb2JhbGx5IChhcyBleHBlY3RlZCBieSBnZW5lcmF0ZWQgY29kZSkgYXMgZWl0aGVyXG4gIC8vIG1vZHVsZS5leHBvcnRzIChpZiB3ZSdyZSBpbiBhIG1vZHVsZSkgb3IgYSBuZXcsIGVtcHR5IG9iamVjdC5cbiAgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWUgPSBpbk1vZHVsZSA/IG1vZHVsZS5leHBvcnRzIDoge307XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIGdlbmVyYXRvciA9IF9PYmplY3QkY3JlYXRlKChvdXRlckZuIHx8IEdlbmVyYXRvcikucHJvdG90eXBlKTtcblxuICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmIHx8IG51bGwsIG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKSk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIHJ1bnRpbWUud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9IEdlbmVyYXRvci5wcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgICBwcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgcnVudGltZS5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24gKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvciA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCIgOiBmYWxzZTtcbiAgfTtcblxuICBydW50aW1lLm1hcmsgPSBmdW5jdGlvbiAoZ2VuRnVuKSB7XG4gICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBfT2JqZWN0JGNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYHZhbHVlIGluc3RhbmNlb2YgQXdhaXRBcmd1bWVudGAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuIFNvbWUgbWF5IGNvbnNpZGVyIHRoZSBuYW1lIG9mIHRoaXMgbWV0aG9kIHRvb1xuICAvLyBjdXRlc3ksIGJ1dCB0aGV5IGFyZSBjdXJtdWRnZW9ucy5cbiAgcnVudGltZS5hd3JhcCA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgICByZXR1cm4gbmV3IEF3YWl0QXJndW1lbnQoYXJnKTtcbiAgfTtcblxuICBmdW5jdGlvbiBBd2FpdEFyZ3VtZW50KGFyZykge1xuICAgIHRoaXMuYXJnID0gYXJnO1xuICB9XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IpIHtcbiAgICAvLyBUaGlzIGludm9rZSBmdW5jdGlvbiBpcyB3cml0dGVuIGluIGEgc3R5bGUgdGhhdCBhc3N1bWVzIHNvbWVcbiAgICAvLyBjYWxsaW5nIGZ1bmN0aW9uIChvciBQcm9taXNlKSB3aWxsIGhhbmRsZSBleGNlcHRpb25zLlxuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgdmFyIHJlc3VsdCA9IGdlbmVyYXRvclttZXRob2RdKGFyZyk7XG4gICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBBd2FpdEFyZ3VtZW50ID8gX1Byb21pc2UucmVzb2x2ZSh2YWx1ZS5hcmcpLnRoZW4oaW52b2tlTmV4dCwgaW52b2tlVGhyb3cpIDogX1Byb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbiAodW53cmFwcGVkKSB7XG4gICAgICAgIC8vIFdoZW4gYSB5aWVsZGVkIFByb21pc2UgaXMgcmVzb2x2ZWQsIGl0cyBmaW5hbCB2YWx1ZSBiZWNvbWVzXG4gICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi4gSWYgdGhlIFByb21pc2UgaXMgcmVqZWN0ZWQsIGhvd2V2ZXIsIHRoZVxuICAgICAgICAvLyByZXN1bHQgZm9yIHRoaXMgaXRlcmF0aW9uIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aCB0aGUgc2FtZVxuICAgICAgICAvLyByZWFzb24uIE5vdGUgdGhhdCByZWplY3Rpb25zIG9mIHlpZWxkZWQgUHJvbWlzZXMgYXJlIG5vdFxuICAgICAgICAvLyB0aHJvd24gYmFjayBpbnRvIHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24sIGFzIGlzIHRoZSBjYXNlXG4gICAgICAgIC8vIHdoZW4gYW4gYXdhaXRlZCBQcm9taXNlIGlzIHJlamVjdGVkLiBUaGlzIGRpZmZlcmVuY2UgaW5cbiAgICAgICAgLy8gYmVoYXZpb3IgYmV0d2VlbiB5aWVsZCBhbmQgYXdhaXQgaXMgaW1wb3J0YW50LCBiZWNhdXNlIGl0XG4gICAgICAgIC8vIGFsbG93cyB0aGUgY29uc3VtZXIgdG8gZGVjaWRlIHdoYXQgdG8gZG8gd2l0aCB0aGUgeWllbGRlZFxuICAgICAgICAvLyByZWplY3Rpb24gKHN3YWxsb3cgaXQgYW5kIGNvbnRpbnVlLCBtYW51YWxseSAudGhyb3cgaXQgYmFja1xuICAgICAgICAvLyBpbnRvIHRoZSBnZW5lcmF0b3IsIGFiYW5kb24gaXRlcmF0aW9uLCB3aGF0ZXZlcikuIFdpdGhcbiAgICAgICAgLy8gYXdhaXQsIGJ5IGNvbnRyYXN0LCB0aGVyZSBpcyBubyBvcHBvcnR1bml0eSB0byBleGFtaW5lIHRoZVxuICAgICAgICAvLyByZWplY3Rpb24gcmVhc29uIG91dHNpZGUgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgc28gdGhlXG4gICAgICAgIC8vIG9ubHkgb3B0aW9uIGlzIHRvIHRocm93IGl0IGZyb20gdGhlIGF3YWl0IGV4cHJlc3Npb24sIGFuZFxuICAgICAgICAvLyBsZXQgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiBoYW5kbGUgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSBcIm9iamVjdFwiICYmIHByb2Nlc3MuZG9tYWluKSB7XG4gICAgICBpbnZva2UgPSBwcm9jZXNzLmRvbWFpbi5iaW5kKGludm9rZSk7XG4gICAgfVxuXG4gICAgdmFyIGludm9rZU5leHQgPSBpbnZva2UuYmluZChnZW5lcmF0b3IsIFwibmV4dFwiKTtcbiAgICB2YXIgaW52b2tlVGhyb3cgPSBpbnZva2UuYmluZChnZW5lcmF0b3IsIFwidGhyb3dcIik7XG4gICAgdmFyIGludm9rZVJldHVybiA9IGludm9rZS5iaW5kKGdlbmVyYXRvciwgXCJyZXR1cm5cIik7XG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIHZhciBlbnF1ZXVlUmVzdWx0ID1cbiAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBpbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfSkgOiBuZXcgX1Byb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgcmVzb2x2ZShpbnZva2UobWV0aG9kLCBhcmcpKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBlbnF1ZXVlUmVzdWx0IGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5XG4gICAgICAvLyBsYXRlciBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICBwcmV2aW91c1Byb21pc2UgPSBlbnF1ZXVlUmVzdWx0W1wiY2F0Y2hcIl0oZnVuY3Rpb24gKGlnbm9yZWQpIHt9KTtcblxuICAgICAgcmV0dXJuIGVucXVldWVSZXN1bHQ7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgcnVudGltZS5hc3luYyA9IGZ1bmN0aW9uIChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3Iod3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkpO1xuXG4gICAgcmV0dXJuIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKSA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJyZXR1cm5cIiB8fCBtZXRob2QgPT09IFwidGhyb3dcIiAmJiBkZWxlZ2F0ZS5pdGVyYXRvclttZXRob2RdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIEEgcmV0dXJuIG9yIHRocm93ICh3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gdGhyb3dcbiAgICAgICAgICAgIC8vIG1ldGhvZCkgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cbiAgICAgICAgICAgIHZhciByZXR1cm5NZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltcInJldHVyblwiXTtcbiAgICAgICAgICAgIGlmIChyZXR1cm5NZXRob2QpIHtcbiAgICAgICAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKHJldHVybk1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGFyZyk7XG4gICAgICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHJldHVybiBtZXRob2QgdGhyZXcgYW4gZXhjZXB0aW9uLCBsZXQgdGhhdFxuICAgICAgICAgICAgICAgIC8vIGV4Y2VwdGlvbiBwcmV2YWlsIG92ZXIgdGhlIG9yaWdpbmFsIHJldHVybiBvciB0aHJvdy5cbiAgICAgICAgICAgICAgICBtZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgICAgICAgYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgICAgIC8vIENvbnRpbnVlIHdpdGggdGhlIG91dGVyIHJldHVybiwgbm93IHRoYXQgdGhlIGRlbGVnYXRlXG4gICAgICAgICAgICAgIC8vIGl0ZXJhdG9yIGhhcyBiZWVuIHRlcm1pbmF0ZWQuXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChkZWxlZ2F0ZS5pdGVyYXRvclttZXRob2RdLCBkZWxlZ2F0ZS5pdGVyYXRvciwgYXJnKTtcblxuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgICAgICAgLy8gTGlrZSByZXR1cm5pbmcgZ2VuZXJhdG9yLnRocm93KHVuY2F1Z2h0KSwgYnV0IHdpdGhvdXQgdGhlXG4gICAgICAgICAgICAvLyBvdmVyaGVhZCBvZiBhbiBleHRyYSBmdW5jdGlvbiBjYWxsLlxuICAgICAgICAgICAgbWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgICAgYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIERlbGVnYXRlIGdlbmVyYXRvciByYW4gYW5kIGhhbmRsZWQgaXRzIG93biBleGNlcHRpb25zIHNvXG4gICAgICAgICAgLy8gcmVnYXJkbGVzcyBvZiB3aGF0IHRoZSBtZXRob2Qgd2FzLCB3ZSBjb250aW51ZSBhcyBpZiBpdCBpc1xuICAgICAgICAgIC8vIFwibmV4dFwiIHdpdGggYW4gdW5kZWZpbmVkIGFyZy5cbiAgICAgICAgICBtZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG4gICAgICAgICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG4gICAgICAgICAgICByZXR1cm4gaW5mbztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkKSB7XG4gICAgICAgICAgICBjb250ZXh0LnNlbnQgPSBhcmc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRleHQuc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oYXJnKSkge1xuICAgICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgICBtZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICAgIGFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lID8gR2VuU3RhdGVDb21wbGV0ZWQgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgdmFyIGluZm8gPSB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgaWYgKGNvbnRleHQuZGVsZWdhdGUgJiYgbWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgICAgICAgIGFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGluZm87XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBtZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgcnVudGltZS5rZXlzID0gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsXG4gICAgICAgICAgICBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgcnVudGltZS52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbiByZXNldChza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIHRoaXMuc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uIGRpc3BhdGNoRXhjZXB0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuICAgICAgICByZXR1cm4gISFjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24gYWJydXB0KHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiYgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmICh0eXBlID09PSBcImJyZWFrXCIgfHwgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJiBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJiBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZShyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fCByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uIGZpbmlzaChmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uIF9jYXRjaCh0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24gZGVsZWdhdGVZaWVsZChpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcbn0pKFxuLy8gQW1vbmcgdGhlIHZhcmlvdXMgdHJpY2tzIGZvciBvYnRhaW5pbmcgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbFxuLy8gb2JqZWN0LCB0aGlzIHNlZW1zIHRvIGJlIHRoZSBtb3N0IHJlbGlhYmxlIHRlY2huaXF1ZSB0aGF0IGRvZXMgbm90XG4vLyB1c2UgaW5kaXJlY3QgZXZhbCAod2hpY2ggdmlvbGF0ZXMgQ29udGVudCBTZWN1cml0eSBQb2xpY3kpLlxudHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiA/IGdsb2JhbCA6IHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiA9PT0gXCJvYmplY3RcIiA/IHNlbGYgOiB1bmRlZmluZWQpOyIsImlmICh0eXBlb2YgTWFwID09PSBcInVuZGVmaW5lZFwiKSB7XG4gIE1hcCA9IGZ1bmN0aW9uKCkge307XG4gIE1hcC5wcm90b3R5cGUgPSB7XG4gICAgc2V0OiBmdW5jdGlvbihrLCB2KSB7IHRoaXNbXCIkXCIgKyBrXSA9IHY7IHJldHVybiB0aGlzOyB9LFxuICAgIGdldDogZnVuY3Rpb24oaykgeyByZXR1cm4gdGhpc1tcIiRcIiArIGtdOyB9LFxuICAgIGhhczogZnVuY3Rpb24oaykgeyByZXR1cm4gXCIkXCIgKyBrIGluIHRoaXM7IH1cbiAgfTtcbn1cblxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgICBnbG9iYWwuZDMgPSBmYWN0b3J5KCk7XG59KHRoaXMsIGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGJ1ZzQ0MDgzID0gdHlwZW9mIG5hdmlnYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiAvV2ViS2l0Ly50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpID8gLTEgOiAwOyAvLyBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NDQwODMvLyBXaGVuIGRlcHRoID0gMSwgcm9vdCA9IFtOb2RlLCDigKZdLlxuICAgIC8vIFdoZW4gZGVwdGggPSAyLCByb290ID0gW1tOb2RlLCDigKZdLCDigKZdLlxuICAgIC8vIFdoZW4gZGVwdGggPSAzLCByb290ID0gW1tbTm9kZSwg4oCmXSwg4oCmXSwg4oCmXS4gZXRjLlxuICAgIC8vIE5vdGUgdGhhdCBbTm9kZSwg4oCmXSBhbmQgTm9kZUxpc3QgYXJlIHVzZWQgaW50ZXJjaGFuZ2VhYmx5OyBzZWUgYXJyYXlpZnkuXG5cbiAgICBmdW5jdGlvbiBTZWxlY3Rpb24ocm9vdCwgZGVwdGgpIHtcbiAgICAgIHRoaXMuX3Jvb3QgPSByb290O1xuICAgICAgdGhpcy5fZGVwdGggPSBkZXB0aDtcbiAgICAgIHRoaXMuX2VudGVyID0gdGhpcy5fdXBkYXRlID0gdGhpcy5fZXhpdCA9IG51bGw7XG4gICAgfVxuICAgIHZhciBkZWZhdWx0VmlldyA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgIHJldHVybiBub2RlXG4gICAgICAgICAgJiYgKChub2RlLm93bmVyRG9jdW1lbnQgJiYgbm9kZS5vd25lckRvY3VtZW50LmRlZmF1bHRWaWV3KSAvLyBub2RlIGlzIGEgTm9kZVxuICAgICAgICAgICAgICB8fCAobm9kZS5kb2N1bWVudCAmJiBub2RlKSAvLyBub2RlIGlzIGEgV2luZG93XG4gICAgICAgICAgICAgIHx8IG5vZGUuZGVmYXVsdFZpZXcpOyAvLyBub2RlIGlzIGEgRG9jdW1lbnRcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkaXNwYXRjaEV2ZW50KG5vZGUsIHR5cGUsIHBhcmFtcykge1xuICAgICAgdmFyIHdpbmRvdyA9IGRlZmF1bHRWaWV3KG5vZGUpLFxuICAgICAgICAgIGV2ZW50ID0gd2luZG93LkN1c3RvbUV2ZW50O1xuXG4gICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQgPSBuZXcgZXZlbnQodHlwZSwgcGFyYW1zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGV2ZW50ID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiRXZlbnRcIik7XG4gICAgICAgIGlmIChwYXJhbXMpIGV2ZW50LmluaXRFdmVudCh0eXBlLCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUpLCBldmVudC5kZXRhaWwgPSBwYXJhbXMuZGV0YWlsO1xuICAgICAgICBlbHNlIGV2ZW50LmluaXRFdmVudCh0eXBlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgfVxuXG4gICAgICBub2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIH1cblxuICAgIHZhciBzZWxlY3Rpb25fZGlzcGF0Y2ggPSBmdW5jdGlvbih0eXBlLCBwYXJhbXMpIHtcblxuICAgICAgZnVuY3Rpb24gZGlzcGF0Y2hDb25zdGFudCgpIHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoRXZlbnQodGhpcywgdHlwZSwgcGFyYW1zKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZGlzcGF0Y2hGdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoRXZlbnQodGhpcywgdHlwZSwgcGFyYW1zLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5lYWNoKHR5cGVvZiBwYXJhbXMgPT09IFwiZnVuY3Rpb25cIiA/IGRpc3BhdGNoRnVuY3Rpb24gOiBkaXNwYXRjaENvbnN0YW50KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub29wKCkge31cbiAgICB2YXIgcmVxdW90ZVJlID0gL1tcXFxcXFxeXFwkXFwqXFwrXFw/XFx8XFxbXFxdXFwoXFwpXFwuXFx7XFx9XS9nO1xuXG4gICAgdmFyIHJlcXVvdGUgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgIHJldHVybiBzdHJpbmcucmVwbGFjZShyZXF1b3RlUmUsIFwiXFxcXCQmXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckxpc3RlbmVyT2YobGlzdGVuZXIpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgcmVsYXRlZCA9IGV2ZW50LnJlbGF0ZWRUYXJnZXQ7XG4gICAgICAgIGlmICghcmVsYXRlZCB8fCAocmVsYXRlZCAhPT0gdGhpcyAmJiAhKHJlbGF0ZWQuY29tcGFyZURvY3VtZW50UG9zaXRpb24odGhpcykgJiA4KSkpIHtcbiAgICAgICAgICBsaXN0ZW5lcihldmVudCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIGV2ZW50ID0gbnVsbDtcblxuICAgIGZ1bmN0aW9uIGxpc3RlbmVyT2YobGlzdGVuZXIsIGFuY2VzdG9ycywgYXJncykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGV2ZW50MSkge1xuICAgICAgICB2YXIgaSA9IGFuY2VzdG9ycy5sZW5ndGgsIGV2ZW50MCA9IGV2ZW50OyAvLyBFdmVudHMgY2FuIGJlIHJlZW50cmFudCAoZS5nLiwgZm9jdXMpLlxuICAgICAgICB3aGlsZSAoLS1pID49IDApIGFyZ3NbaSA8PCAxXSA9IGFuY2VzdG9yc1tpXS5fX2RhdGFfXztcbiAgICAgICAgZXZlbnQgPSBldmVudDE7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgbGlzdGVuZXIuYXBwbHkoYW5jZXN0b3JzWzBdLCBhcmdzKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBldmVudCA9IGV2ZW50MDtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgZmlsdGVyRXZlbnRzID0gbmV3IE1hcDtcblxuICAgIHZhciBzZWxlY3Rpb25fZXZlbnQgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lciwgY2FwdHVyZSkge1xuICAgICAgdmFyIG4gPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgICAgIGtleSA9IFwiX19vblwiICsgdHlwZSxcbiAgICAgICAgICBmaWx0ZXIsXG4gICAgICAgICAgcm9vdCA9IHRoaXMuX3Jvb3Q7XG5cbiAgICAgIGlmIChuIDwgMikgcmV0dXJuIChuID0gdGhpcy5ub2RlKClba2V5XSkgJiYgbi5fbGlzdGVuZXI7XG5cbiAgICAgIGlmIChuIDwgMykgY2FwdHVyZSA9IGZhbHNlO1xuICAgICAgaWYgKChuID0gdHlwZS5pbmRleE9mKFwiLlwiKSkgPiAwKSB0eXBlID0gdHlwZS5zbGljZSgwLCBuKTtcbiAgICAgIGlmIChmaWx0ZXIgPSBmaWx0ZXJFdmVudHMuaGFzKHR5cGUpKSB0eXBlID0gZmlsdGVyRXZlbnRzLmdldCh0eXBlKTtcblxuICAgICAgZnVuY3Rpb24gYWRkKCkge1xuICAgICAgICB2YXIgYW5jZXN0b3IgPSByb290LCBpID0gYXJndW1lbnRzLmxlbmd0aCA+PiAxLCBhbmNlc3RvcnMgPSBuZXcgQXJyYXkoaSk7XG4gICAgICAgIHdoaWxlICgtLWkgPj0gMCkgYW5jZXN0b3IgPSBhbmNlc3Rvclthcmd1bWVudHNbKGkgPDwgMSkgKyAxXV0sIGFuY2VzdG9yc1tpXSA9IGkgPyBhbmNlc3Rvci5fcGFyZW50IDogYW5jZXN0b3I7XG4gICAgICAgIHZhciBsID0gbGlzdGVuZXJPZihsaXN0ZW5lciwgYW5jZXN0b3JzLCBhcmd1bWVudHMpO1xuICAgICAgICBpZiAoZmlsdGVyKSBsID0gZmlsdGVyTGlzdGVuZXJPZihsKTtcbiAgICAgICAgcmVtb3ZlLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCB0aGlzW2tleV0gPSBsLCBsLl9jYXB0dXJlID0gY2FwdHVyZSk7XG4gICAgICAgIGwuX2xpc3RlbmVyID0gbGlzdGVuZXI7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgICAgdmFyIGwgPSB0aGlzW2tleV07XG4gICAgICAgIGlmIChsKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGwsIGwuX2NhcHR1cmUpO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVtb3ZlQWxsKCkge1xuICAgICAgICB2YXIgcmUgPSBuZXcgUmVnRXhwKFwiXl9fb24oW14uXSspXCIgKyByZXF1b3RlKHR5cGUpICsgXCIkXCIpLCBtYXRjaDtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgaWYgKG1hdGNoID0gbmFtZS5tYXRjaChyZSkpIHtcbiAgICAgICAgICAgIHZhciBsID0gdGhpc1tuYW1lXTtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihtYXRjaFsxXSwgbCwgbC5fY2FwdHVyZSk7XG4gICAgICAgICAgICBkZWxldGUgdGhpc1tuYW1lXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZWFjaChsaXN0ZW5lclxuICAgICAgICAgID8gKG4gPyBhZGQgOiBub29wKSAvLyBBdHRlbXB0IHRvIGFkZCB1bnR5cGVkIGxpc3RlbmVyIGlzIGlnbm9yZWQuXG4gICAgICAgICAgOiAobiA/IHJlbW92ZSA6IHJlbW92ZUFsbCkpO1xuICAgIH1cbiAgICB2YXIgc2VsZWN0aW9uX2RhdHVtID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gdGhpcy5wcm9wZXJ0eShcIl9fZGF0YV9fXCIsIHZhbHVlKSA6IHRoaXMubm9kZSgpLl9fZGF0YV9fO1xuICAgIH1cbiAgICB2YXIgc2VsZWN0aW9uX3JlbW92ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcbiAgICAgICAgaWYgKHBhcmVudCkgcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHZhciBzZWxlY3Rvck9mID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICB9O1xuICAgIH1cbiAgICB2YXIgbmFtZXNwYWNlcyA9IChuZXcgTWFwKVxuICAgICAgICAuc2V0KFwic3ZnXCIsIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIilcbiAgICAgICAgLnNldChcInhodG1sXCIsIFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiKVxuICAgICAgICAuc2V0KFwieGxpbmtcIiwgXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIpXG4gICAgICAgIC5zZXQoXCJ4bWxcIiwgXCJodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2VcIilcbiAgICAgICAgLnNldChcInhtbG5zXCIsIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy9cIik7XG5cbiAgICB2YXIgbmFtZXNwYWNlID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIGkgPSBuYW1lLmluZGV4T2YoXCI6XCIpLCBwcmVmaXggPSBuYW1lO1xuICAgICAgaWYgKGkgPj0gMCkgcHJlZml4ID0gbmFtZS5zbGljZSgwLCBpKSwgbmFtZSA9IG5hbWUuc2xpY2UoaSArIDEpO1xuICAgICAgcmV0dXJuIG5hbWVzcGFjZXMuaGFzKHByZWZpeCkgPyB7c3BhY2U6IG5hbWVzcGFjZXMuZ2V0KHByZWZpeCksIGxvY2FsOiBuYW1lfSA6IG5hbWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRvck9mKG5hbWUpIHtcbiAgICAgIG5hbWUgPSBuYW1lc3BhY2UobmFtZSk7XG5cbiAgICAgIGZ1bmN0aW9uIGNyZWF0b3IoKSB7XG4gICAgICAgIHZhciBkb2N1bWVudCA9IHRoaXMub3duZXJEb2N1bWVudCxcbiAgICAgICAgICAgIHVyaSA9IHRoaXMubmFtZXNwYWNlVVJJO1xuICAgICAgICByZXR1cm4gdXJpXG4gICAgICAgICAgICA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh1cmksIG5hbWUpXG4gICAgICAgICAgICA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGNyZWF0b3JOUygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuYW1lLmxvY2FsID8gY3JlYXRvck5TIDogY3JlYXRvcjtcbiAgICB9XG5cbiAgICB2YXIgc2VsZWN0aW9uX2FwcGVuZCA9IGZ1bmN0aW9uKGNyZWF0b3IsIHNlbGVjdG9yKSB7XG4gICAgICBpZiAodHlwZW9mIGNyZWF0b3IgIT09IFwiZnVuY3Rpb25cIikgY3JlYXRvciA9IGNyZWF0b3JPZihjcmVhdG9yKTtcblxuICAgICAgZnVuY3Rpb24gYXBwZW5kKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHBlbmRDaGlsZChjcmVhdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBpbnNlcnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluc2VydEJlZm9yZShjcmVhdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHNlbGVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgbnVsbCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdChhcmd1bWVudHMubGVuZ3RoIDwgMlxuICAgICAgICAgID8gYXBwZW5kXG4gICAgICAgICAgOiAodHlwZW9mIHNlbGVjdG9yICE9PSBcImZ1bmN0aW9uXCIgJiYgKHNlbGVjdG9yID0gc2VsZWN0b3JPZihzZWxlY3RvcikpLCBpbnNlcnQpKTtcbiAgICB9XG4gICAgdmFyIHNlbGVjdGlvbl9odG1sID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRoaXMubm9kZSgpLmlubmVySFRNTDtcblxuICAgICAgZnVuY3Rpb24gc2V0Q29uc3RhbnQoKSB7XG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNldEZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gdiA9PSBudWxsID8gXCJcIiA6IHY7XG4gICAgICB9XG5cbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB2YWx1ZSA9IFwiXCI7XG5cbiAgICAgIHJldHVybiB0aGlzLmVhY2godHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIgPyBzZXRGdW5jdGlvbiA6IHNldENvbnN0YW50KTtcbiAgICB9XG4gICAgdmFyIHNlbGVjdGlvbl90ZXh0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRoaXMubm9kZSgpLnRleHRDb250ZW50O1xuXG4gICAgICBmdW5jdGlvbiBzZXRDb25zdGFudCgpIHtcbiAgICAgICAgdGhpcy50ZXh0Q29udGVudCA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzZXRGdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB0aGlzLnRleHRDb250ZW50ID0gdiA9PSBudWxsID8gXCJcIiA6IHY7XG4gICAgICB9XG5cbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB2YWx1ZSA9IFwiXCI7XG5cbiAgICAgIHJldHVybiB0aGlzLmVhY2godHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIgPyBzZXRGdW5jdGlvbiA6IHNldENvbnN0YW50KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb2xsYXBzZShzdHJpbmcpIHtcbiAgICAgIHJldHVybiBzdHJpbmcudHJpbSgpLnJlcGxhY2UoL1xccysvZywgXCIgXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsYXNzZXJPZihuYW1lKSB7XG4gICAgICB2YXIgcmU7XG4gICAgICByZXR1cm4gZnVuY3Rpb24obm9kZSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKGMgPSBub2RlLmNsYXNzTGlzdCkgcmV0dXJuIHZhbHVlID8gYy5hZGQobmFtZSkgOiBjLnJlbW92ZShuYW1lKTtcbiAgICAgICAgaWYgKCFyZSkgcmUgPSBuZXcgUmVnRXhwKFwiKD86XnxcXFxccyspXCIgKyByZXF1b3RlKG5hbWUpICsgXCIoPzpcXFxccyt8JClcIiwgXCJnXCIpO1xuICAgICAgICB2YXIgYyA9IG5vZGUuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIjtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgcmUubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICBpZiAoIXJlLnRlc3QoYykpIG5vZGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgY29sbGFwc2UoYyArIFwiIFwiICsgbmFtZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgY29sbGFwc2UoYy5yZXBsYWNlKHJlLCBcIiBcIikpKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgc2VsZWN0aW9uX2NsYXNzID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICAgIG5hbWUgPSAobmFtZSArIFwiXCIpLnRyaW0oKS5zcGxpdCgvXnxcXHMrLyk7XG4gICAgICB2YXIgbiA9IG5hbWUubGVuZ3RoO1xuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGUoKSwgaSA9IC0xO1xuICAgICAgICBpZiAodmFsdWUgPSBub2RlLmNsYXNzTGlzdCkgeyAvLyBTVkcgZWxlbWVudHMgbWF5IG5vdCBzdXBwb3J0IERPTVRva2VuTGlzdCFcbiAgICAgICAgICB3aGlsZSAoKytpIDwgbikgaWYgKCF2YWx1ZS5jb250YWlucyhuYW1lW2ldKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gbm9kZS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKTtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgbikgaWYgKCFjbGFzc2VkUmUobmFtZVtpXSkudGVzdCh2YWx1ZSkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgbmFtZSA9IG5hbWUubWFwKGNsYXNzZXJPZik7XG5cbiAgICAgIGZ1bmN0aW9uIHNldENvbnN0YW50KCkge1xuICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICB3aGlsZSAoKytpIDwgbikgbmFtZVtpXSh0aGlzLCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNldEZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaSA9IC0xLCB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgd2hpbGUgKCsraSA8IG4pIG5hbWVbaV0odGhpcywgeCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmVhY2godHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIgPyBzZXRGdW5jdGlvbiA6IHNldENvbnN0YW50KTtcbiAgICB9XG4gICAgdmFyIHNlbGVjdGlvbl9wcm9wZXJ0eSA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHJldHVybiB0aGlzLm5vZGUoKVtuYW1lXTtcblxuICAgICAgZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgICBkZWxldGUgdGhpc1tuYW1lXTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2V0Q29uc3RhbnQoKSB7XG4gICAgICAgIHRoaXNbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2V0RnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgaWYgKHggPT0gbnVsbCkgZGVsZXRlIHRoaXNbbmFtZV07XG4gICAgICAgIGVsc2UgdGhpc1tuYW1lXSA9IHg7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmVhY2godmFsdWUgPT0gbnVsbCA/IHJlbW92ZSA6IHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiID8gc2V0RnVuY3Rpb24gOiBzZXRDb25zdGFudCk7XG4gICAgfVxuXG4gICAgdmFyIHNlbGVjdGlvbl9zdHlsZSA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICAgICAgdmFyIG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuXG4gICAgICBpZiAobiA8IDIpIHJldHVybiBkZWZhdWx0VmlldyhuID0gdGhpcy5ub2RlKCkpLmdldENvbXB1dGVkU3R5bGUobiwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKTtcblxuICAgICAgaWYgKG4gPCAzKSBwcmlvcml0eSA9IFwiXCI7XG5cbiAgICAgIGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgICAgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2V0Q29uc3RhbnQoKSB7XG4gICAgICAgIHRoaXMuc3R5bGUuc2V0UHJvcGVydHkobmFtZSwgdmFsdWUsIHByaW9yaXR5KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2V0RnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgaWYgKHggPT0gbnVsbCkgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKTtcbiAgICAgICAgZWxzZSB0aGlzLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHgsIHByaW9yaXR5KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZWFjaCh2YWx1ZSA9PSBudWxsID8gcmVtb3ZlIDogdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIgPyBzZXRGdW5jdGlvbiA6IHNldENvbnN0YW50KTtcbiAgICB9XG5cbiAgICB2YXIgc2VsZWN0aW9uX2F0dHIgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgICAgbmFtZSA9IG5hbWVzcGFjZShuYW1lKTtcblxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICAgIHZhciBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgICAgIHJldHVybiBuYW1lLmxvY2FsXG4gICAgICAgICAgICA/IG5vZGUuZ2V0QXR0cmlidXRlTlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbClcbiAgICAgICAgICAgIDogbm9kZS5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHJlbW92ZU5TKCkge1xuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzZXRDb25zdGFudCgpIHtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzZXRDb25zdGFudE5TKCkge1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2V0RnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgaWYgKHggPT0gbnVsbCkgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgIGVsc2UgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgeCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNldEZ1bmN0aW9uTlMoKSB7XG4gICAgICAgIHZhciB4ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgaWYgKHggPT0gbnVsbCkgdGhpcy5yZW1vdmVBdHRyaWJ1dGVOUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsKTtcbiAgICAgICAgZWxzZSB0aGlzLnNldEF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwsIHgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5lYWNoKHZhbHVlID09IG51bGxcbiAgICAgICAgICA/IChuYW1lLmxvY2FsID8gcmVtb3ZlTlMgOiByZW1vdmUpXG4gICAgICAgICAgOiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICAgICAgPyAobmFtZS5sb2NhbCA/IHNldEZ1bmN0aW9uTlMgOiBzZXRGdW5jdGlvbilcbiAgICAgICAgICAgICAgOiAobmFtZS5sb2NhbCA/IHNldENvbnN0YW50TlMgOiBzZXRDb25zdGFudCkpKTtcbiAgICB9XG4gICAgdmFyIHNlbGVjdGlvbl9lYWNoID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgIHZhciBkZXB0aCA9IHRoaXMuX2RlcHRoLFxuICAgICAgICAgIHN0YWNrID0gbmV3IEFycmF5KGRlcHRoKTtcblxuICAgICAgZnVuY3Rpb24gdmlzaXQobm9kZXMsIGRlcHRoKSB7XG4gICAgICAgIHZhciBpID0gLTEsXG4gICAgICAgICAgICBuID0gbm9kZXMubGVuZ3RoLFxuICAgICAgICAgICAgbm9kZTtcblxuICAgICAgICBpZiAoLS1kZXB0aCkge1xuICAgICAgICAgIHZhciBzdGFjazAgPSBkZXB0aCAqIDIsXG4gICAgICAgICAgICAgIHN0YWNrMSA9IHN0YWNrMCArIDE7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICAgIGlmIChub2RlID0gbm9kZXNbaV0pIHtcbiAgICAgICAgICAgICAgc3RhY2tbc3RhY2swXSA9IG5vZGUuX3BhcmVudC5fX2RhdGFfXywgc3RhY2tbc3RhY2sxXSA9IGk7XG4gICAgICAgICAgICAgIHZpc2l0KG5vZGUsIGRlcHRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgICAgaWYgKG5vZGUgPSBub2Rlc1tpXSkge1xuICAgICAgICAgICAgICBzdGFja1swXSA9IG5vZGUuX19kYXRhX18sIHN0YWNrWzFdID0gaTtcbiAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkobm9kZSwgc3RhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2aXNpdCh0aGlzLl9yb290LCBkZXB0aCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgdmFyIHNlbGVjdGlvbl9lbXB0eSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICF0aGlzLm5vZGUoKTtcbiAgICB9XG4gICAgdmFyIHNlbGVjdGlvbl9zaXplID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2l6ZSA9IDA7XG4gICAgICB0aGlzLmVhY2goZnVuY3Rpb24oKSB7ICsrc2l6ZTsgfSk7XG4gICAgICByZXR1cm4gc2l6ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaXJzdE5vZGUobm9kZXMsIGRlcHRoKSB7XG4gICAgICB2YXIgaSA9IC0xLFxuICAgICAgICAgIG4gPSBub2Rlcy5sZW5ndGgsXG4gICAgICAgICAgbm9kZTtcblxuICAgICAgaWYgKC0tZGVwdGgpIHtcbiAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICBpZiAobm9kZSA9IG5vZGVzW2ldKSB7XG4gICAgICAgICAgICBpZiAobm9kZSA9IGZpcnN0Tm9kZShub2RlLCBkZXB0aCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGVsc2Uge1xuICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgIGlmIChub2RlID0gbm9kZXNbaV0pIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB2YXIgc2VsZWN0aW9uX25vZGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmaXJzdE5vZGUodGhpcy5fcm9vdCwgdGhpcy5fZGVwdGgpO1xuICAgIH1cbiAgICB2YXIgc2VsZWN0aW9uX25vZGVzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbm9kZXMgPSBuZXcgQXJyYXkodGhpcy5zaXplKCkpLCBpID0gLTE7XG4gICAgICB0aGlzLmVhY2goZnVuY3Rpb24oKSB7IG5vZGVzWysraV0gPSB0aGlzOyB9KTtcbiAgICAgIHJldHVybiBub2RlcztcbiAgICB9XG4gICAgdmFyIHNlbGVjdGlvbl9jYWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHNbMF07XG4gICAgICBjYWxsYmFjay5hcHBseShhcmd1bWVudHNbMF0gPSB0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXJyYXlpZnlOb2RlKG5vZGVzLCBkZXB0aCkge1xuICAgICAgdmFyIGkgPSAtMSxcbiAgICAgICAgICBuID0gbm9kZXMubGVuZ3RoLFxuICAgICAgICAgIG5vZGU7XG5cbiAgICAgIGlmICgtLWRlcHRoKSB7XG4gICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgaWYgKG5vZGUgPSBub2Rlc1tpXSkge1xuICAgICAgICAgICAgbm9kZXNbaV0gPSBhcnJheWlmeU5vZGUobm9kZSwgZGVwdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlbHNlIGlmICghQXJyYXkuaXNBcnJheShub2RlcykpIHtcbiAgICAgICAgdmFyIGFycmF5ID0gbmV3IEFycmF5KG4pO1xuICAgICAgICB3aGlsZSAoKytpIDwgbikgYXJyYXlbaV0gPSBub2Rlc1tpXTtcbiAgICAgICAgYXJyYXkuX3BhcmVudCA9IG5vZGVzLl9wYXJlbnQ7XG4gICAgICAgIG5vZGVzID0gYXJyYXk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBub2RlcztcbiAgICB9Ly8gVGhlIGxlYWYgZ3JvdXBzIG9mIHRoZSBzZWxlY3Rpb24gaGllcmFyY2h5IGFyZSBpbml0aWFsbHkgTm9kZUxpc3QsXG4gICAgLy8gYW5kIHRoZW4gbGF6aWx5IGNvbnZlcnRlZCB0byBhcnJheXMgd2hlbiBtdXRhdGlvbiBpcyByZXF1aXJlZC5cbiAgICB2YXIgYXJyYXlpZnkgPSBmdW5jdGlvbihzZWxlY3Rpb24pIHtcbiAgICAgIHJldHVybiBzZWxlY3Rpb24uX3Jvb3QgPSBhcnJheWlmeU5vZGUoc2VsZWN0aW9uLl9yb290LCBzZWxlY3Rpb24uX2RlcHRoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhc2NlbmRpbmcoYSwgYikge1xuICAgICAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiBhID49IGIgPyAwIDogTmFOO1xuICAgIH1cblxuICAgIHZhciBzZWxlY3Rpb25fc29ydCA9IGZ1bmN0aW9uKGNvbXBhcmF0b3IpIHtcbiAgICAgIGlmICghY29tcGFyYXRvcikgY29tcGFyYXRvciA9IGFzY2VuZGluZztcblxuICAgICAgZnVuY3Rpb24gY29tcGFyZShhLCBiKSB7XG4gICAgICAgIHJldHVybiBhICYmIGIgPyBjb21wYXJhdG9yKGEuX19kYXRhX18sIGIuX19kYXRhX18pIDogIWEgLSAhYjtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gdmlzaXQobm9kZXMsIGRlcHRoKSB7XG4gICAgICAgIGlmICgtLWRlcHRoKSB7XG4gICAgICAgICAgdmFyIGkgPSAtMSxcbiAgICAgICAgICAgICAgbiA9IG5vZGVzLmxlbmd0aCxcbiAgICAgICAgICAgICAgbm9kZTtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgICAgaWYgKG5vZGUgPSBub2Rlc1tpXSkge1xuICAgICAgICAgICAgICB2aXNpdChub2RlLCBkZXB0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgbm9kZXMuc29ydChjb21wYXJlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2aXNpdChhcnJheWlmeSh0aGlzKSwgdGhpcy5fZGVwdGgpO1xuICAgICAgcmV0dXJuIHRoaXMub3JkZXIoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvcmRlck5vZGUobm9kZXMsIGRlcHRoKSB7XG4gICAgICB2YXIgaSA9IG5vZGVzLmxlbmd0aCxcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIG5leHQ7XG5cbiAgICAgIGlmICgtLWRlcHRoKSB7XG4gICAgICAgIHdoaWxlICgtLWkgPj0gMCkge1xuICAgICAgICAgIGlmIChub2RlID0gbm9kZXNbaV0pIHtcbiAgICAgICAgICAgIG9yZGVyTm9kZShub2RlLCBkZXB0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGVsc2Uge1xuICAgICAgICBuZXh0ID0gbm9kZXNbLS1pXTtcbiAgICAgICAgd2hpbGUgKC0taSA+PSAwKSB7XG4gICAgICAgICAgaWYgKG5vZGUgPSBub2Rlc1tpXSkge1xuICAgICAgICAgICAgaWYgKG5leHQgJiYgbmV4dCAhPT0gbm9kZS5uZXh0U2libGluZykgbmV4dC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBuZXh0KTtcbiAgICAgICAgICAgIG5leHQgPSBub2RlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB2YXIgc2VsZWN0aW9uX29yZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBvcmRlck5vZGUodGhpcy5fcm9vdCwgdGhpcy5fZGVwdGgpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW1wdHlOb2RlKG5vZGVzLCBkZXB0aCkge1xuICAgICAgdmFyIGkgPSAtMSxcbiAgICAgICAgICBuID0gbm9kZXMubGVuZ3RoLFxuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgZW1wdHkgPSBuZXcgQXJyYXkobik7XG5cbiAgICAgIGlmICgtLWRlcHRoKSB7XG4gICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgaWYgKG5vZGUgPSBub2Rlc1tpXSkge1xuICAgICAgICAgICAgZW1wdHlbaV0gPSBlbXB0eU5vZGUobm9kZSwgZGVwdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlbXB0eS5fcGFyZW50ID0gbm9kZXMuX3BhcmVudDtcbiAgICAgIHJldHVybiBlbXB0eTtcbiAgICB9XG5cbiAgICB2YXIgZW1wdHlPZiA9IGZ1bmN0aW9uKHNlbGVjdGlvbikge1xuICAgICAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oZW1wdHlOb2RlKGFycmF5aWZ5KHNlbGVjdGlvbiksIHNlbGVjdGlvbi5fZGVwdGgpLCBzZWxlY3Rpb24uX2RlcHRoKTtcbiAgICB9Ly8gTGF6aWx5IGNvbnN0cnVjdHMgdGhlIGV4aXQgc2VsZWN0aW9uIGZvciB0aGlzICh1cGRhdGUpIHNlbGVjdGlvbi5cbiAgICAvLyBVbnRpbCB0aGlzIHNlbGVjdGlvbiBpcyBqb2luZWQgdG8gZGF0YSwgdGhlIGV4aXQgc2VsZWN0aW9uIHdpbGwgYmUgZW1wdHkuXG5cbiAgICB2YXIgc2VsZWN0aW9uX2V4aXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9leGl0IHx8ICh0aGlzLl9leGl0ID0gZW1wdHlPZih0aGlzKSk7XG4gICAgfS8vIExhemlseSBjb25zdHJ1Y3RzIHRoZSBlbnRlciBzZWxlY3Rpb24gZm9yIHRoaXMgKHVwZGF0ZSkgc2VsZWN0aW9uLlxuICAgIC8vIFVudGlsIHRoaXMgc2VsZWN0aW9uIGlzIGpvaW5lZCB0byBkYXRhLCB0aGUgZW50ZXIgc2VsZWN0aW9uIHdpbGwgYmUgZW1wdHkuXG5cbiAgICB2YXIgc2VsZWN0aW9uX2VudGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXRoaXMuX2VudGVyKSB7XG4gICAgICAgIHRoaXMuX2VudGVyID0gZW1wdHlPZih0aGlzKTtcbiAgICAgICAgdGhpcy5fZW50ZXIuX3VwZGF0ZSA9IHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fZW50ZXI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gRW50ZXJOb2RlKHBhcmVudCwgZGF0dW0pIHtcbiAgICAgIHRoaXMub3duZXJEb2N1bWVudCA9IHBhcmVudC5vd25lckRvY3VtZW50O1xuICAgICAgdGhpcy5uYW1lc3BhY2VVUkkgPSBwYXJlbnQubmFtZXNwYWNlVVJJO1xuICAgICAgdGhpcy5fbmV4dCA9IG51bGw7XG4gICAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICB0aGlzLl9fZGF0YV9fID0gZGF0dW07XG4gICAgfVxuXG4gICAgRW50ZXJOb2RlLnByb3RvdHlwZSA9IHtcbiAgICAgIGFwcGVuZENoaWxkOiBmdW5jdGlvbihjaGlsZCkgeyByZXR1cm4gdGhpcy5fcGFyZW50Lmluc2VydEJlZm9yZShjaGlsZCwgdGhpcy5fbmV4dCk7IH0sXG4gICAgICBpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKGNoaWxkLCBuZXh0KSB7IHJldHVybiB0aGlzLl9wYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLCBuZXh0IHx8IHRoaXMuX25leHQpOyB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHZhbHVlT2ZfKHZhbHVlKSB7IC8vIFhYWCBodHRwczovL2dpdGh1Yi5jb20vcm9sbHVwL3JvbGx1cC9pc3N1ZXMvMTJcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfTtcbiAgICB9Ly8gVGhlIHZhbHVlIG1heSBlaXRoZXIgYmUgYW4gYXJyYXkgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gYXJyYXkuXG4gICAgLy8gQW4gb3B0aW9uYWwga2V5IGZ1bmN0aW9uIG1heSBiZSBzcGVjaWZpZWQgdG8gY29udHJvbCBob3cgZGF0YSBpcyBib3VuZDtcbiAgICAvLyBpZiBubyBrZXkgZnVuY3Rpb24gaXMgc3BlY2lmaWVkLCBkYXRhIGlzIGJvdW5kIHRvIG5vZGVzIGJ5IGluZGV4LlxuICAgIC8vIE9yLCBpZiBubyBhcmd1bWVudHMgYXJlIHNwZWNpZmllZCwgdGhpcyBtZXRob2QgcmV0dXJucyBhbGwgYm91bmQgZGF0YS5cbiAgICB2YXIgc2VsZWN0aW9uX2RhdGEgPSBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHZhciBkYXRhID0gbmV3IEFycmF5KHRoaXMuc2l6ZSgpKSwgaSA9IC0xO1xuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oZCkgeyBkYXRhWysraV0gPSBkOyB9KTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICB9XG5cbiAgICAgIHZhciBkZXB0aCA9IHRoaXMuX2RlcHRoIC0gMSxcbiAgICAgICAgICBzdGFjayA9IG5ldyBBcnJheShkZXB0aCAqIDIpLFxuICAgICAgICAgIGJpbmQgPSBrZXkgPyBiaW5kS2V5IDogYmluZEluZGV4O1xuXG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcImZ1bmN0aW9uXCIpIHZhbHVlID0gdmFsdWVPZl8odmFsdWUpO1xuICAgICAgdmlzaXQodGhpcy5fcm9vdCwgdGhpcy5lbnRlcigpLl9yb290LCB0aGlzLmV4aXQoKS5fcm9vdCwgZGVwdGgpO1xuXG4gICAgICBmdW5jdGlvbiB2aXNpdCh1cGRhdGUsIGVudGVyLCBleGl0LCBkZXB0aCkge1xuICAgICAgICB2YXIgaSA9IC0xLFxuICAgICAgICAgICAgbixcbiAgICAgICAgICAgIG5vZGU7XG5cbiAgICAgICAgaWYgKGRlcHRoLS0pIHtcbiAgICAgICAgICB2YXIgc3RhY2swID0gZGVwdGggKiAyLFxuICAgICAgICAgICAgICBzdGFjazEgPSBzdGFjazAgKyAxO1xuXG4gICAgICAgICAgbiA9IHVwZGF0ZS5sZW5ndGg7XG5cbiAgICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgICAgaWYgKG5vZGUgPSB1cGRhdGVbaV0pIHtcbiAgICAgICAgICAgICAgc3RhY2tbc3RhY2swXSA9IG5vZGUuX3BhcmVudC5fX2RhdGFfXywgc3RhY2tbc3RhY2sxXSA9IGk7XG4gICAgICAgICAgICAgIHZpc2l0KG5vZGUsIGVudGVyW2ldLCBleGl0W2ldLCBkZXB0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFyIGogPSAwLFxuICAgICAgICAgICAgICBiZWZvcmU7XG5cbiAgICAgICAgICBiaW5kKHVwZGF0ZSwgZW50ZXIsIGV4aXQsIHZhbHVlLmFwcGx5KHVwZGF0ZS5fcGFyZW50LCBzdGFjaykpO1xuICAgICAgICAgIG4gPSB1cGRhdGUubGVuZ3RoO1xuXG4gICAgICAgICAgLy8gTm93IGNvbm5lY3QgdGhlIGVudGVyIG5vZGVzIHRvIHRoZWlyIGZvbGxvd2luZyB1cGRhdGUgbm9kZSwgc3VjaCB0aGF0XG4gICAgICAgICAgLy8gYXBwZW5kQ2hpbGQgY2FuIGluc2VydCB0aGUgbWF0ZXJpYWxpemVkIGVudGVyIG5vZGUgYmVmb3JlIHRoaXMgbm9kZSxcbiAgICAgICAgICAvLyByYXRoZXIgdGhhbiBhdCB0aGUgZW5kIG9mIHRoZSBwYXJlbnQgbm9kZS5cbiAgICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgICAgaWYgKGJlZm9yZSA9IGVudGVyW2ldKSB7XG4gICAgICAgICAgICAgIGlmIChpID49IGopIGogPSBpICsgMTtcbiAgICAgICAgICAgICAgd2hpbGUgKCEobm9kZSA9IHVwZGF0ZVtqXSkgJiYgKytqIDwgbik7XG4gICAgICAgICAgICAgIGJlZm9yZS5fbmV4dCA9IG5vZGUgfHwgbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYmluZEluZGV4KHVwZGF0ZSwgZW50ZXIsIGV4aXQsIGRhdGEpIHtcbiAgICAgICAgdmFyIGkgPSAwLFxuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG5vZGVMZW5ndGggPSB1cGRhdGUubGVuZ3RoLFxuICAgICAgICAgICAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoLFxuICAgICAgICAgICAgbWluTGVuZ3RoID0gTWF0aC5taW4obm9kZUxlbmd0aCwgZGF0YUxlbmd0aCk7XG5cbiAgICAgICAgLy8gQ2xlYXIgdGhlIGVudGVyIGFuZCBleGl0IGFycmF5cywgYW5kIHRoZW4gaW5pdGlhbGl6ZSB0byB0aGUgbmV3IGxlbmd0aC5cbiAgICAgICAgZW50ZXIubGVuZ3RoID0gMCwgZW50ZXIubGVuZ3RoID0gZGF0YUxlbmd0aDtcbiAgICAgICAgZXhpdC5sZW5ndGggPSAwLCBleGl0Lmxlbmd0aCA9IG5vZGVMZW5ndGg7XG5cbiAgICAgICAgZm9yICg7IGkgPCBtaW5MZW5ndGg7ICsraSkge1xuICAgICAgICAgIGlmIChub2RlID0gdXBkYXRlW2ldKSB7XG4gICAgICAgICAgICBub2RlLl9fZGF0YV9fID0gZGF0YVtpXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW50ZXJbaV0gPSBuZXcgRW50ZXJOb2RlKHVwZGF0ZS5fcGFyZW50LCBkYXRhW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3RlOiB3ZSBkb27igJl0IG5lZWQgdG8gZGVsZXRlIHVwZGF0ZVtpXSBoZXJlIGJlY2F1c2UgdGhpcyBsb29wIG9ubHlcbiAgICAgICAgLy8gcnVucyB3aGVuIHRoZSBkYXRhIGxlbmd0aCBpcyBncmVhdGVyIHRoYW4gdGhlIG5vZGUgbGVuZ3RoLlxuICAgICAgICBmb3IgKDsgaSA8IGRhdGFMZW5ndGg7ICsraSkge1xuICAgICAgICAgIGVudGVyW2ldID0gbmV3IEVudGVyTm9kZSh1cGRhdGUuX3BhcmVudCwgZGF0YVtpXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3RlOiBhbmQsIHdlIGRvbuKAmXQgbmVlZCB0byBkZWxldGUgdXBkYXRlW2ldIGhlcmUgYmVjYXVzZSBpbW1lZGlhdGVseVxuICAgICAgICAvLyBmb2xsb3dpbmcgdGhpcyBsb29wIHdlIHNldCB0aGUgdXBkYXRlIGxlbmd0aCB0byBkYXRhIGxlbmd0aC5cbiAgICAgICAgZm9yICg7IGkgPCBub2RlTGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICBpZiAobm9kZSA9IHVwZGF0ZVtpXSkge1xuICAgICAgICAgICAgZXhpdFtpXSA9IHVwZGF0ZVtpXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUubGVuZ3RoID0gZGF0YUxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYmluZEtleSh1cGRhdGUsIGVudGVyLCBleGl0LCBkYXRhKSB7XG4gICAgICAgIHZhciBpLFxuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIGRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aCxcbiAgICAgICAgICAgIG5vZGVMZW5ndGggPSB1cGRhdGUubGVuZ3RoLFxuICAgICAgICAgICAgbm9kZUJ5S2V5VmFsdWUgPSBuZXcgTWFwLFxuICAgICAgICAgICAga2V5U3RhY2sgPSBuZXcgQXJyYXkoMikuY29uY2F0KHN0YWNrKSxcbiAgICAgICAgICAgIGtleVZhbHVlcyA9IG5ldyBBcnJheShub2RlTGVuZ3RoKSxcbiAgICAgICAgICAgIGtleVZhbHVlO1xuXG4gICAgICAgIC8vIENsZWFyIHRoZSBlbnRlciBhbmQgZXhpdCBhcnJheXMsIGFuZCB0aGVuIGluaXRpYWxpemUgdG8gdGhlIG5ldyBsZW5ndGguXG4gICAgICAgIGVudGVyLmxlbmd0aCA9IDAsIGVudGVyLmxlbmd0aCA9IGRhdGFMZW5ndGg7XG4gICAgICAgIGV4aXQubGVuZ3RoID0gMCwgZXhpdC5sZW5ndGggPSBub2RlTGVuZ3RoO1xuXG4gICAgICAgIC8vIENvbXB1dGUgdGhlIGtleXMgZm9yIGVhY2ggbm9kZS5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG5vZGVMZW5ndGg7ICsraSkge1xuICAgICAgICAgIGlmIChub2RlID0gdXBkYXRlW2ldKSB7XG4gICAgICAgICAgICBrZXlTdGFja1swXSA9IG5vZGUuX19kYXRhX18sIGtleVN0YWNrWzFdID0gaTtcbiAgICAgICAgICAgIGtleVZhbHVlc1tpXSA9IGtleVZhbHVlID0ga2V5LmFwcGx5KG5vZGUsIGtleVN0YWNrKTtcblxuICAgICAgICAgICAgLy8gSXMgdGhpcyBhIGR1cGxpY2F0ZSBvZiBhIGtleSB3ZeKAmXZlIHByZXZpb3VzbHkgc2Vlbj9cbiAgICAgICAgICAgIC8vIElmIHNvLCB0aGlzIG5vZGUgaXMgbW92ZWQgdG8gdGhlIGV4aXQgc2VsZWN0aW9uLlxuICAgICAgICAgICAgaWYgKG5vZGVCeUtleVZhbHVlLmhhcyhrZXlWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgZXhpdFtpXSA9IG5vZGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgcmVjb3JkIHRoZSBtYXBwaW5nIGZyb20ga2V5IHRvIG5vZGUuXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgbm9kZUJ5S2V5VmFsdWUuc2V0KGtleVZhbHVlLCBub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3cgY2xlYXIgdGhlIHVwZGF0ZSBhcnJheSBhbmQgaW5pdGlhbGl6ZSB0byB0aGUgbmV3IGxlbmd0aC5cbiAgICAgICAgdXBkYXRlLmxlbmd0aCA9IDAsIHVwZGF0ZS5sZW5ndGggPSBkYXRhTGVuZ3RoO1xuXG4gICAgICAgIC8vIENvbXB1dGUgdGhlIGtleXMgZm9yIGVhY2ggZGF0dW0uXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBkYXRhTGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICBrZXlTdGFja1swXSA9IGRhdGFbaV0sIGtleVN0YWNrWzFdID0gaTtcbiAgICAgICAgICBrZXlWYWx1ZSA9IGtleS5hcHBseSh1cGRhdGUuX3BhcmVudCwga2V5U3RhY2spO1xuXG4gICAgICAgICAgLy8gSXMgdGhlcmUgYSBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGtleT9cbiAgICAgICAgICAvLyBJZiBub3QsIHRoaXMgZGF0dW0gaXMgYWRkZWQgdG8gdGhlIGVudGVyIHNlbGVjdGlvbi5cbiAgICAgICAgICBpZiAoIShub2RlID0gbm9kZUJ5S2V5VmFsdWUuZ2V0KGtleVZhbHVlKSkpIHtcbiAgICAgICAgICAgIGVudGVyW2ldID0gbmV3IEVudGVyTm9kZSh1cGRhdGUuX3BhcmVudCwgZGF0YVtpXSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gRGlkIHdlIGFscmVhZHkgYmluZCBhIG5vZGUgdXNpbmcgdGhpcyBrZXk/IChPciBpcyBhIGR1cGxpY2F0ZT8pXG4gICAgICAgICAgLy8gSWYgdW5pcXVlLCB0aGUgbm9kZSBhbmQgZGF0dW0gYXJlIGpvaW5lZCBpbiB0aGUgdXBkYXRlIHNlbGVjdGlvbi5cbiAgICAgICAgICAvLyBPdGhlcndpc2UsIHRoZSBkYXR1bSBpcyBpZ25vcmVkLCBuZWl0aGVyIGVudGVyaW5nIG5vciBleGl0aW5nLlxuICAgICAgICAgIGVsc2UgaWYgKG5vZGUgIT09IHRydWUpIHtcbiAgICAgICAgICAgIHVwZGF0ZVtpXSA9IG5vZGU7XG4gICAgICAgICAgICBub2RlLl9fZGF0YV9fID0gZGF0YVtpXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBSZWNvcmQgdGhhdCB3ZSBjb25zdW1lZCB0aGlzIGtleSwgZWl0aGVyIHRvIGVudGVyIG9yIHVwZGF0ZS5cbiAgICAgICAgICBub2RlQnlLZXlWYWx1ZS5zZXQoa2V5VmFsdWUsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGFrZSBhbnkgcmVtYWluaW5nIG5vZGVzIHRoYXQgd2VyZSBub3QgYm91bmQgdG8gZGF0YSxcbiAgICAgICAgLy8gYW5kIHBsYWNlIHRoZW0gaW4gdGhlIGV4aXQgc2VsZWN0aW9uLlxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbm9kZUxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgaWYgKChub2RlID0gbm9kZUJ5S2V5VmFsdWUuZ2V0KGtleVZhbHVlc1tpXSkpICE9PSB0cnVlKSB7XG4gICAgICAgICAgICBleGl0W2ldID0gbm9kZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdmFyIGZpbHRlck9mID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2hlcyhzZWxlY3Rvcik7XG4gICAgICB9O1xuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgIGlmICghZWxlbWVudC5tYXRjaGVzKSB7XG4gICAgICAgIHZhciB2ZW5kb3JNYXRjaGVzID0gZWxlbWVudC53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHwgZWxlbWVudC5tc01hdGNoZXNTZWxlY3RvciB8fCBlbGVtZW50Lm1vek1hdGNoZXNTZWxlY3RvciB8fCBlbGVtZW50Lm9NYXRjaGVzU2VsZWN0b3I7XG4gICAgICAgIGZpbHRlck9mID0gZnVuY3Rpb24oc2VsZWN0b3IpIHsgcmV0dXJuIGZ1bmN0aW9uKCkgeyByZXR1cm4gdmVuZG9yTWF0Y2hlcy5jYWxsKHRoaXMsIHNlbGVjdG9yKTsgfTsgfTtcbiAgICAgIH1cbiAgICB9Ly8gVGhlIGZpbHRlciBtYXkgZWl0aGVyIGJlIGEgc2VsZWN0b3Igc3RyaW5nIChlLmcuLCBcIi5mb29cIilcbiAgICAvLyBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIGJvb2xlYW4uXG5cbiAgICB2YXIgc2VsZWN0aW9uX2ZpbHRlciA9IGZ1bmN0aW9uKGZpbHRlcikge1xuICAgICAgdmFyIGRlcHRoID0gdGhpcy5fZGVwdGgsXG4gICAgICAgICAgc3RhY2sgPSBuZXcgQXJyYXkoZGVwdGggKiAyKTtcblxuICAgICAgaWYgKHR5cGVvZiBmaWx0ZXIgIT09IFwiZnVuY3Rpb25cIikgZmlsdGVyID0gZmlsdGVyT2YoZmlsdGVyKTtcblxuICAgICAgZnVuY3Rpb24gdmlzaXQobm9kZXMsIGRlcHRoKSB7XG4gICAgICAgIHZhciBpID0gLTEsXG4gICAgICAgICAgICBuID0gbm9kZXMubGVuZ3RoLFxuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIHN1Ym5vZGVzO1xuXG4gICAgICAgIGlmICgtLWRlcHRoKSB7XG4gICAgICAgICAgdmFyIHN0YWNrMCA9IGRlcHRoICogMixcbiAgICAgICAgICAgICAgc3RhY2sxID0gc3RhY2swICsgMTtcbiAgICAgICAgICBzdWJub2RlcyA9IG5ldyBBcnJheShuKTtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgICAgaWYgKG5vZGUgPSBub2Rlc1tpXSkge1xuICAgICAgICAgICAgICBzdGFja1tzdGFjazBdID0gbm9kZS5fcGFyZW50Ll9fZGF0YV9fLCBzdGFja1tzdGFjazFdID0gaTtcbiAgICAgICAgICAgICAgc3Vibm9kZXNbaV0gPSB2aXNpdChub2RlLCBkZXB0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIGZpbHRlciBvcGVyYXRpb24gZG9lcyBub3QgcHJlc2VydmUgdGhlIG9yaWdpbmFsIGluZGV4LFxuICAgICAgICAvLyBzbyB0aGUgcmVzdWx0aW5nIGxlYWYgZ3JvdXBzIGFyZSBkZW5zZSAobm90IHNwYXJzZSkuXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHN1Ym5vZGVzID0gW107XG4gICAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICAgIGlmIChub2RlID0gbm9kZXNbaV0pIHtcbiAgICAgICAgICAgICAgc3RhY2tbMF0gPSBub2RlLl9fZGF0YV9fLCBzdGFja1sxXSA9IGk7XG4gICAgICAgICAgICAgIGlmIChmaWx0ZXIuYXBwbHkobm9kZSwgc3RhY2spKSB7XG4gICAgICAgICAgICAgICAgc3Vibm9kZXMucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN1Ym5vZGVzLl9wYXJlbnQgPSBub2Rlcy5fcGFyZW50O1xuICAgICAgICByZXR1cm4gc3Vibm9kZXM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgU2VsZWN0aW9uKHZpc2l0KHRoaXMuX3Jvb3QsIGRlcHRoKSwgZGVwdGgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNlbGVjdG9yQWxsT2Yoc2VsZWN0b3IpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gICAgICB9O1xuICAgIH0vLyBUaGUgc2VsZWN0b3IgbWF5IGVpdGhlciBiZSBhIHNlbGVjdG9yIHN0cmluZyAoZS5nLiwgXCIuZm9vXCIpXG4gICAgLy8gb3IgYSBmdW5jdGlvbiB0aGF0IG9wdGlvbmFsbHkgcmV0dXJucyBhbiBhcnJheSBvZiBub2RlcyB0byBzZWxlY3QuXG4gICAgLy8gVGhpcyBpcyB0aGUgb25seSBvcGVyYXRpb24gdGhhdCBpbmNyZWFzZXMgdGhlIGRlcHRoIG9mIGEgc2VsZWN0aW9uLlxuXG4gICAgdmFyIHNlbGVjdGlvbl9zZWxlY3RBbGwgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICAgICAgdmFyIGRlcHRoID0gdGhpcy5fZGVwdGgsXG4gICAgICAgICAgc3RhY2sgPSBuZXcgQXJyYXkoZGVwdGggKiAyKTtcblxuICAgICAgaWYgKHR5cGVvZiBzZWxlY3RvciAhPT0gXCJmdW5jdGlvblwiKSBzZWxlY3RvciA9IHNlbGVjdG9yQWxsT2Yoc2VsZWN0b3IpO1xuXG4gICAgICBmdW5jdGlvbiB2aXNpdChub2RlcywgZGVwdGgpIHtcbiAgICAgICAgdmFyIGkgPSAtMSxcbiAgICAgICAgICAgIG4gPSBub2Rlcy5sZW5ndGgsXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgc3Vibm9kZSxcbiAgICAgICAgICAgIHN1Ym5vZGVzID0gbmV3IEFycmF5KG4pO1xuXG4gICAgICAgIGlmICgtLWRlcHRoKSB7XG4gICAgICAgICAgdmFyIHN0YWNrMCA9IGRlcHRoICogMixcbiAgICAgICAgICAgICAgc3RhY2sxID0gc3RhY2swICsgMTtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgICAgaWYgKG5vZGUgPSBub2Rlc1tpXSkge1xuICAgICAgICAgICAgICBzdGFja1tzdGFjazBdID0gbm9kZS5fcGFyZW50Ll9fZGF0YV9fLCBzdGFja1tzdGFjazFdID0gaTtcbiAgICAgICAgICAgICAgc3Vibm9kZXNbaV0gPSB2aXNpdChub2RlLCBkZXB0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGF0YSBpcyBub3QgcHJvcGFnYXRlZCBzaW5jZSB0aGVyZSBpcyBhIG9uZS10by1tYW55IG1hcHBpbmcuXG4gICAgICAgIC8vIFRoZSBwYXJlbnQgb2YgdGhlIG5ldyBsZWFmIGdyb3VwIGlzIHRoZSBvbGQgbm9kZS5cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICAgIGlmIChub2RlID0gbm9kZXNbaV0pIHtcbiAgICAgICAgICAgICAgc3RhY2tbMF0gPSBub2RlLl9fZGF0YV9fLCBzdGFja1sxXSA9IGk7XG4gICAgICAgICAgICAgIHN1Ym5vZGVzW2ldID0gc3Vibm9kZSA9IHNlbGVjdG9yLmFwcGx5KG5vZGUsIHN0YWNrKTtcbiAgICAgICAgICAgICAgc3Vibm9kZS5fcGFyZW50ID0gbm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdWJub2Rlcy5fcGFyZW50ID0gbm9kZXMuX3BhcmVudDtcbiAgICAgICAgcmV0dXJuIHN1Ym5vZGVzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFNlbGVjdGlvbih2aXNpdCh0aGlzLl9yb290LCBkZXB0aCksIGRlcHRoICsgMSk7XG4gICAgfS8vIFRoZSBzZWxlY3RvciBtYXkgZWl0aGVyIGJlIGEgc2VsZWN0b3Igc3RyaW5nIChlLmcuLCBcIi5mb29cIilcbiAgICAvLyBvciBhIGZ1bmN0aW9uIHRoYXQgb3B0aW9uYWxseSByZXR1cm5zIHRoZSBub2RlIHRvIHNlbGVjdC5cblxuICAgIHZhciBzZWxlY3Rpb25fc2VsZWN0ID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICAgIHZhciBkZXB0aCA9IHRoaXMuX2RlcHRoLFxuICAgICAgICAgIHN0YWNrID0gbmV3IEFycmF5KGRlcHRoICogMik7XG5cbiAgICAgIGlmICh0eXBlb2Ygc2VsZWN0b3IgIT09IFwiZnVuY3Rpb25cIikgc2VsZWN0b3IgPSBzZWxlY3Rvck9mKHNlbGVjdG9yKTtcblxuICAgICAgZnVuY3Rpb24gdmlzaXQobm9kZXMsIHVwZGF0ZSwgZGVwdGgpIHtcbiAgICAgICAgdmFyIGkgPSAtMSxcbiAgICAgICAgICAgIG4gPSBub2Rlcy5sZW5ndGgsXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgc3Vibm9kZSxcbiAgICAgICAgICAgIHN1Ym5vZGVzID0gbmV3IEFycmF5KG4pO1xuXG4gICAgICAgIGlmICgtLWRlcHRoKSB7XG4gICAgICAgICAgdmFyIHN0YWNrMCA9IGRlcHRoICogMixcbiAgICAgICAgICAgICAgc3RhY2sxID0gc3RhY2swICsgMTtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgICAgaWYgKG5vZGUgPSBub2Rlc1tpXSkge1xuICAgICAgICAgICAgICBzdGFja1tzdGFjazBdID0gbm9kZS5fcGFyZW50Ll9fZGF0YV9fLCBzdGFja1tzdGFjazFdID0gaTtcbiAgICAgICAgICAgICAgc3Vibm9kZXNbaV0gPSB2aXNpdChub2RlLCB1cGRhdGUgJiYgdXBkYXRlW2ldLCBkZXB0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIGxlYWYgZ3JvdXAgbWF5IGJlIHNwYXJzZSBpZiB0aGUgc2VsZWN0b3IgcmV0dXJucyBhIGZhbHNleSB2YWx1ZTtcbiAgICAgICAgLy8gdGhpcyBwcmVzZXJ2ZXMgdGhlIGluZGV4IG9mIG5vZGVzICh1bmxpa2Ugc2VsZWN0aW9uLmZpbHRlcikuXG4gICAgICAgIC8vIFByb3BhZ2F0ZSBkYXRhIHRvIHRoZSBuZXcgbm9kZSBvbmx5IGlmIGl0IGlzIGRlZmluZWQgb24gdGhlIG9sZC5cbiAgICAgICAgLy8gSWYgdGhpcyBpcyBhbiBlbnRlciBzZWxlY3Rpb24sIG1hdGVyaWFsaXplZCBub2RlcyBhcmUgbW92ZWQgdG8gdXBkYXRlLlxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgICAgaWYgKG5vZGUgPSBub2Rlc1tpXSkge1xuICAgICAgICAgICAgICBzdGFja1swXSA9IG5vZGUuX19kYXRhX18sIHN0YWNrWzFdID0gaTtcbiAgICAgICAgICAgICAgaWYgKHN1Ym5vZGUgPSBzZWxlY3Rvci5hcHBseShub2RlLCBzdGFjaykpIHtcbiAgICAgICAgICAgICAgICBpZiAoXCJfX2RhdGFfX1wiIGluIG5vZGUpIHN1Ym5vZGUuX19kYXRhX18gPSBub2RlLl9fZGF0YV9fO1xuICAgICAgICAgICAgICAgIGlmICh1cGRhdGUpIHVwZGF0ZVtpXSA9IHN1Ym5vZGUsIGRlbGV0ZSBub2Rlc1tpXTtcbiAgICAgICAgICAgICAgICBzdWJub2Rlc1tpXSA9IHN1Ym5vZGU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdWJub2Rlcy5fcGFyZW50ID0gbm9kZXMuX3BhcmVudDtcbiAgICAgICAgcmV0dXJuIHN1Ym5vZGVzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFNlbGVjdGlvbih2aXNpdCh0aGlzLl9yb290LCB0aGlzLl91cGRhdGUgJiYgdGhpcy5fdXBkYXRlLl9yb290LCBkZXB0aCksIGRlcHRoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZWxlY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IFNlbGVjdGlvbihbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XSwgMSk7XG4gICAgfVxuXG4gICAgU2VsZWN0aW9uLnByb3RvdHlwZSA9IHNlbGVjdGlvbi5wcm90b3R5cGUgPSB7XG4gICAgICBzZWxlY3Q6IHNlbGVjdGlvbl9zZWxlY3QsXG4gICAgICBzZWxlY3RBbGw6IHNlbGVjdGlvbl9zZWxlY3RBbGwsXG4gICAgICBmaWx0ZXI6IHNlbGVjdGlvbl9maWx0ZXIsXG4gICAgICBkYXRhOiBzZWxlY3Rpb25fZGF0YSxcbiAgICAgIGVudGVyOiBzZWxlY3Rpb25fZW50ZXIsXG4gICAgICBleGl0OiBzZWxlY3Rpb25fZXhpdCxcbiAgICAgIG9yZGVyOiBzZWxlY3Rpb25fb3JkZXIsXG4gICAgICBzb3J0OiBzZWxlY3Rpb25fc29ydCxcbiAgICAgIGNhbGw6IHNlbGVjdGlvbl9jYWxsLFxuICAgICAgbm9kZXM6IHNlbGVjdGlvbl9ub2RlcyxcbiAgICAgIG5vZGU6IHNlbGVjdGlvbl9ub2RlLFxuICAgICAgc2l6ZTogc2VsZWN0aW9uX3NpemUsXG4gICAgICBlbXB0eTogc2VsZWN0aW9uX2VtcHR5LFxuICAgICAgZWFjaDogc2VsZWN0aW9uX2VhY2gsXG4gICAgICBhdHRyOiBzZWxlY3Rpb25fYXR0cixcbiAgICAgIHN0eWxlOiBzZWxlY3Rpb25fc3R5bGUsXG4gICAgICBwcm9wZXJ0eTogc2VsZWN0aW9uX3Byb3BlcnR5LFxuICAgICAgY2xhc3M6IHNlbGVjdGlvbl9jbGFzcyxcbiAgICAgIGNsYXNzZWQ6IHNlbGVjdGlvbl9jbGFzcywgLy8gZGVwcmVjYXRlZCBhbGlhc1xuICAgICAgdGV4dDogc2VsZWN0aW9uX3RleHQsXG4gICAgICBodG1sOiBzZWxlY3Rpb25faHRtbCxcbiAgICAgIGFwcGVuZDogc2VsZWN0aW9uX2FwcGVuZCxcbiAgICAgIGluc2VydDogc2VsZWN0aW9uX2FwcGVuZCwgLy8gZGVwcmVjYXRlZCBhbGlhc1xuICAgICAgcmVtb3ZlOiBzZWxlY3Rpb25fcmVtb3ZlLFxuICAgICAgZGF0dW06IHNlbGVjdGlvbl9kYXR1bSxcbiAgICAgIGV2ZW50OiBzZWxlY3Rpb25fZXZlbnQsXG4gICAgICBvbjogc2VsZWN0aW9uX2V2ZW50LCAvLyBkZXByZWNhdGVkIGFsaWFzXG4gICAgICBkaXNwYXRjaDogc2VsZWN0aW9uX2Rpc3BhdGNoXG4gICAgfTtcblxuICAgIHZhciBzZWxlY3QgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICAgICAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oW3R5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIiA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpIDogc2VsZWN0b3JdLCAxKTtcbiAgICB9XG5cbiAgICB2YXIgcG9pbnQgPSBmdW5jdGlvbihub2RlLCBldmVudCkge1xuICAgICAgdmFyIHN2ZyA9IG5vZGUub3duZXJTVkdFbGVtZW50IHx8IG5vZGU7XG4gICAgICBpZiAoc3ZnLmNyZWF0ZVNWR1BvaW50KSB7XG4gICAgICAgIHZhciBwb2ludCA9IHN2Zy5jcmVhdGVTVkdQb2ludCgpO1xuICAgICAgICBpZiAoYnVnNDQwODMgPCAwKSB7XG4gICAgICAgICAgdmFyIHdpbmRvdyA9IGRlZmF1bHRWaWV3KG5vZGUpO1xuICAgICAgICAgIGlmICh3aW5kb3cuc2Nyb2xsWCB8fCB3aW5kb3cuc2Nyb2xsWSkge1xuICAgICAgICAgICAgc3ZnID0gc2VsZWN0KHdpbmRvdy5kb2N1bWVudC5ib2R5KS5hcHBlbmQoXCJzdmdcIikuc3R5bGUoe3Bvc2l0aW9uOiBcImFic29sdXRlXCIsIHRvcDogMCwgbGVmdDogMCwgbWFyZ2luOiAwLCBwYWRkaW5nOiAwLCBib3JkZXI6IFwibm9uZVwifSwgXCJpbXBvcnRhbnRcIik7XG4gICAgICAgICAgICB2YXIgY3RtID0gc3ZnLm5vZGUoKS5nZXRTY3JlZW5DVE0oKTtcbiAgICAgICAgICAgIGJ1ZzQ0MDgzID0gIShjdG0uZiB8fCBjdG0uZSk7XG4gICAgICAgICAgICBzdmcucmVtb3ZlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChidWc0NDA4MykgcG9pbnQueCA9IGV2ZW50LnBhZ2VYLCBwb2ludC55ID0gZXZlbnQucGFnZVk7XG4gICAgICAgIGVsc2UgcG9pbnQueCA9IGV2ZW50LmNsaWVudFgsIHBvaW50LnkgPSBldmVudC5jbGllbnRZO1xuICAgICAgICBwb2ludCA9IHBvaW50Lm1hdHJpeFRyYW5zZm9ybShub2RlLmdldFNjcmVlbkNUTSgpLmludmVyc2UoKSk7XG4gICAgICAgIHJldHVybiBbcG9pbnQueCwgcG9pbnQueV07XG4gICAgICB9XG4gICAgICB2YXIgcmVjdCA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICByZXR1cm4gW2V2ZW50LmNsaWVudFggLSByZWN0LmxlZnQgLSBub2RlLmNsaWVudExlZnQsIGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcCAtIG5vZGUuY2xpZW50VG9wXTtcbiAgICB9XG5cbiAgICB2YXIgc291cmNlRXZlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjdXJyZW50ID0gZXZlbnQsIHNvdXJjZTtcbiAgICAgIHdoaWxlIChzb3VyY2UgPSBjdXJyZW50LnNvdXJjZUV2ZW50KSBjdXJyZW50ID0gc291cmNlO1xuICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgfVxuXG4gICAgdmFyIHRvdWNoZXMgPSBmdW5jdGlvbihub2RlLCB0b3VjaGVzKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHRvdWNoZXMgPSBzb3VyY2VFdmVudCgpLnRvdWNoZXM7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbiA9IHRvdWNoZXMgPyB0b3VjaGVzLmxlbmd0aCA6IDAsIHBvaW50cyA9IG5ldyBBcnJheShuKTsgaSA8IG47ICsraSkge1xuICAgICAgICBwb2ludHNbaV0gPSBwb2ludChub2RlLCB0b3VjaGVzW2ldKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwb2ludHM7XG4gICAgfVxuXG4gICAgdmFyIHRvdWNoID0gZnVuY3Rpb24obm9kZSwgdG91Y2hlcywgaWRlbnRpZmllcikge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSBpZGVudGlmaWVyID0gdG91Y2hlcywgdG91Y2hlcyA9IHNvdXJjZUV2ZW50KCkuY2hhbmdlZFRvdWNoZXM7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbiA9IHRvdWNoZXMgPyB0b3VjaGVzLmxlbmd0aCA6IDAsIHRvdWNoOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIGlmICgodG91Y2ggPSB0b3VjaGVzW2ldKS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICAgICAgcmV0dXJuIHBvaW50KG5vZGUsIHRvdWNoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIHNlbGVjdEFsbCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgICByZXR1cm4gbmV3IFNlbGVjdGlvbih0eXBlb2Ygc2VsZWN0b3IgPT09IFwic3RyaW5nXCIgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSA6IHNlbGVjdG9yLCAxKTtcbiAgICB9XG5cbiAgICB2YXIgbW91c2UgPSBmdW5jdGlvbihub2RlLCBldmVudCkge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSBldmVudCA9IHNvdXJjZUV2ZW50KCk7XG4gICAgICBpZiAoZXZlbnQuY2hhbmdlZFRvdWNoZXMpIGV2ZW50ID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF07XG4gICAgICByZXR1cm4gcG9pbnQobm9kZSwgZXZlbnQpO1xuICAgIH1cblxuICAgIHZhciBkMyA9IHtcbiAgICAgIGdldCBldmVudCgpIHsgcmV0dXJuIGV2ZW50OyB9LFxuICAgICAgbW91c2U6IG1vdXNlLFxuICAgICAgbmFtZXNwYWNlOiBuYW1lc3BhY2UsXG4gICAgICBuYW1lc3BhY2VzOiBuYW1lc3BhY2VzLFxuICAgICAgcmVxdW90ZTogcmVxdW90ZSxcbiAgICAgIHNlbGVjdDogc2VsZWN0LFxuICAgICAgc2VsZWN0QWxsOiBzZWxlY3RBbGwsXG4gICAgICBzZWxlY3Rpb246IHNlbGVjdGlvbixcbiAgICAgIHRvdWNoOiB0b3VjaCxcbiAgICAgIHRvdWNoZXM6IHRvdWNoZXNcbiAgICB9O1xuXG4gICAgcmV0dXJuIGQzO1xuXG59KSk7IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKCFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiJdfQ==
