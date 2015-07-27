(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.wavesUI = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  core: {
    LayerTimeContext    : require('./dist/core/layer-time-context'),
    Layer               : require('./dist/core/layer'),
    namespace           : require('./dist/core/namespace'),
    TimelineTimeContext : require('./dist/core/timeline-time-context'),
    Timeline            : require('./dist/core/timeline'),
    TrackCollection     : require('./dist/core/track-collection'),
    Track               : require('./dist/core/track'),
  },
  shapes: {
    AnnotatedMarker     : require('./dist/shapes/annotated-marker'),
    AnnotatedSegment    : require('./dist/shapes/annotated-segment'),
    BaseShape           : require('./dist/shapes/base-shape'),
    Cursor              : require('./dist/shapes/cursor'),
    Dot                 : require('./dist/shapes/dot'),
    Line                : require('./dist/shapes/line'),
    Marker              : require('./dist/shapes/marker'),
    Segment             : require('./dist/shapes/segment'),
    TraceCommon         : require('./dist/shapes/trace-common'),
    TraceDots           : require('./dist/shapes/trace-dots'),
    Waveform            : require('./dist/shapes/waveform'),
  },
  behaviors: {
    BaseBehavior        : require('./dist/behaviors/base-behavior'),
    BreakpointBehavior  : require('./dist/behaviors/breakpoint-behavior'),
    MarkerBehavior      : require('./dist/behaviors/marker-behavior'),
    SegmentBehavior     : require('./dist/behaviors/segment-behavior'),
    TimeContextBehavior : require('./dist/behaviors/time-context-behavior'),
    TraceBehavior       : require('./dist/behaviors/trace-behavior'),
  },
  interactions: {
    EventSource         : require('./dist/interactions/event-source'),
    Keyboard            : require('./dist/interactions/keyboard'),
    Surface             : require('./dist/interactions/surface'),
    WaveEvent           : require('./dist/interactions/wave-event'),
  },
  // rename folder ?
  states: {
    BaseState           : require('./dist/timeline-states/base-state'),
    BrushZoomState      : require('./dist/timeline-states/brush-zoom-state'),
    CenteredZoomState   : require('./dist/timeline-states/centered-zoom-state'),
    ContextEditionState : require('./dist/timeline-states/context-edition-state'),
    EditionState        : require('./dist/timeline-states/edition-state'),
    SelectionState      : require('./dist/timeline-states/selection-state'),
  },
  helpers: {
    AnnotatedMarkerLayer: require('./dist/helpers/annotated-marker-layer'),
    CursorLayer         : require('./dist/helpers/cursor-layer'),
    DotLayer            : require('./dist/helpers/dot-layer'),
    MarkerLayer         : require('./dist/helpers/marker-layer'),
    SegmentLayer        : require('./dist/helpers/segment-layer'),
    WaveformLayer       : require('./dist/helpers/waveform-layer'),
  },
  utils: {
    OrthogonalData      : require('./dist/utils/orthogonal-data'),
  }
}

},{"./dist/behaviors/base-behavior":2,"./dist/behaviors/breakpoint-behavior":3,"./dist/behaviors/marker-behavior":4,"./dist/behaviors/segment-behavior":5,"./dist/behaviors/time-context-behavior":6,"./dist/behaviors/trace-behavior":7,"./dist/core/layer":9,"./dist/core/layer-time-context":8,"./dist/core/namespace":10,"./dist/core/timeline":12,"./dist/core/timeline-time-context":11,"./dist/core/track":14,"./dist/core/track-collection":13,"./dist/helpers/annotated-marker-layer":15,"./dist/helpers/cursor-layer":16,"./dist/helpers/dot-layer":17,"./dist/helpers/marker-layer":18,"./dist/helpers/segment-layer":19,"./dist/helpers/waveform-layer":20,"./dist/interactions/event-source":21,"./dist/interactions/keyboard":22,"./dist/interactions/surface":23,"./dist/interactions/wave-event":24,"./dist/shapes/annotated-marker":25,"./dist/shapes/annotated-segment":26,"./dist/shapes/base-shape":27,"./dist/shapes/cursor":28,"./dist/shapes/dot":29,"./dist/shapes/line":30,"./dist/shapes/marker":31,"./dist/shapes/segment":32,"./dist/shapes/trace-common":33,"./dist/shapes/trace-dots":34,"./dist/shapes/waveform":35,"./dist/timeline-states/base-state":36,"./dist/timeline-states/brush-zoom-state":37,"./dist/timeline-states/centered-zoom-state":38,"./dist/timeline-states/context-edition-state":39,"./dist/timeline-states/edition-state":40,"./dist/timeline-states/selection-state":41,"./dist/utils/orthogonal-data":42}],2:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _toConsumableArray = require("babel-runtime/helpers/to-consumable-array")["default"];

var _core = require("babel-runtime/core-js")["default"];

var BaseBehavior = (function () {
  function BaseBehavior() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BaseBehavior);

    this._selectedItems = new _core.Set(); // no duplicate in Set
    this._selectedClass = options.selectedClass || "selected";
    this._layer = null;

    this._params = _core.Object.assign({}, this.getDefaults(), options);
  }

  _createClass(BaseBehavior, {
    initialize: {
      value: function initialize(layer) {
        this._layer = layer;
      }
    },
    destroy: {
      value: function destroy() {}
    },
    getDefaults: {
      value: function getDefaults() {
        return {};
      }
    },
    selectedClass: {
      set: function (value) {
        this._selectedClass = value;
      },
      get: function () {
        return this._selectedClass;
      }
    },
    selectedItems: {
      get: function () {
        return [].concat(_toConsumableArray(this._selectedItems));
      }
    },
    select: {

      /**
       *  @param item {DOMElement} the item to select
       *  @param datum {Object} the related datum (@NOTE remove it ?)
       */

      value: function select($item, datum) {
        $item.classList.add(this.selectedClass);
        this._selectedItems.add($item);
      }
    },
    unselect: {

      /**
       *  @param item {DOMElement} the item to select
       *  @param datum {Object} the related datum (@NOTE remove it ?)
       */

      value: function unselect($item, datum) {
        $item.classList.remove(this.selectedClass);
        this._selectedItems["delete"]($item);
      }
    },
    toggleSelection: {

      /**
       *  @NOTE is this really usefull ?
       *  @param item {DOMElement} the item to select
       *  @param datum {Object} the related datum (@NOTE remove it ?)
       */

      value: function toggleSelection($item, datum) {
        var method = this._selectedItems.has($item) ? "unselect" : "select";
        this[method]($item);
      }
    },
    edit: {

      /**
       *  Edition behavior
       */

      value: function edit(renderingContext, shape, datum, dx, dy, target) {}
    }
  });

  return BaseBehavior;
})();

module.exports = BaseBehavior;

// clean all items in `this._selectedItems`

// must be implemented in children

},{"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/to-consumable-array":50}],3:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseBehavior = _interopRequire(require("./base-behavior"));

var BreakpointBehavior = (function (_BaseBehavior) {
  function BreakpointBehavior() {
    _classCallCheck(this, BreakpointBehavior);

    if (_BaseBehavior != null) {
      _BaseBehavior.apply(this, arguments);
    }
  }

  _inherits(BreakpointBehavior, _BaseBehavior);

  _createClass(BreakpointBehavior, {
    edit: {
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
    }
  });

  return BreakpointBehavior;
})(BaseBehavior);

module.exports = BreakpointBehavior;

},{"./base-behavior":2,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],4:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseBehavior = _interopRequire(require("./base-behavior"));

var MarkerBehavior = (function (_BaseBehavior) {
  function MarkerBehavior() {
    _classCallCheck(this, MarkerBehavior);

    if (_BaseBehavior != null) {
      _BaseBehavior.apply(this, arguments);
    }
  }

  _inherits(MarkerBehavior, _BaseBehavior);

  _createClass(MarkerBehavior, {
    edit: {
      value: function edit(renderingContext, shape, datum, dx, dy, target) {
        var x = renderingContext.timeToPixel(shape.x(datum));
        var targetX = x + dx > 0 ? x + dx : 0;

        shape.x(datum, renderingContext.timeToPixel.invert(targetX));
      }
    }
  });

  return MarkerBehavior;
})(BaseBehavior);

module.exports = MarkerBehavior;

},{"./base-behavior":2,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],5:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseBehavior = _interopRequire(require("./base-behavior"));

var SegmentBehavior = (function (_BaseBehavior) {
  function SegmentBehavior() {
    _classCallCheck(this, SegmentBehavior);

    if (_BaseBehavior != null) {
      _BaseBehavior.apply(this, arguments);
    }
  }

  _inherits(SegmentBehavior, _BaseBehavior);

  _createClass(SegmentBehavior, {
    edit: {
      value: function edit(renderingContext, shape, datum, dx, dy, target) {
        var classList = target.classList;
        var action = "move";

        if (classList.contains("handler") && classList.contains("left")) {
          action = "resizeLeft";
        } else if (classList.contains("handler") && classList.contains("right")) {
          action = "resizeRight";
        }

        this["_" + action](renderingContext, shape, datum, dx, dy, target);
      }
    },
    _move: {
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
    },
    _resizeLeft: {
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
    },
    _resizeRight: {
      value: function _resizeRight(renderingContext, shape, datum, dx, dy, target) {
        // current values
        var width = renderingContext.timeToPixel(shape.width(datum));
        // target values
        var targetWidth = Math.max(width + dx, 1);

        shape.width(datum, renderingContext.timeToPixel.invert(targetWidth));
      }
    }
  });

  return SegmentBehavior;
})(BaseBehavior);

module.exports = SegmentBehavior;

},{"./base-behavior":2,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],6:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var TimeContextBehavior = (function () {
  function TimeContextBehavior() {
    _classCallCheck(this, TimeContextBehavior);
  }

  _createClass(TimeContextBehavior, {
    edit: {
      value: function edit(layer, dx, dy, target) {
        var timeContext = layer.timeContext;

        if (target.classList.contains("handler") && target.classList.contains("left")) {
          this._editLeft(timeContext, dx);
        } else if (target.classList.contains("handler") && target.classList.contains("right")) {
          this._editRight(timeContext, dx);
        } else if (target.classList.contains("segment")) {
          this._move(timeContext, dx);
        }
      }
    },
    _editLeft: {
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
    },
    _editRight: {
      value: function _editRight(timeContext, dx) {
        var width = timeContext.timeToPixel(timeContext.duration);
        var targetWidth = Math.max(width + dx, 1);

        timeContext.duration = timeContext.timeToPixel.invert(targetWidth);
      }
    },
    _move: {
      value: function _move(timeContext, dx) {
        var x = timeContext.parent.timeToPixel(timeContext.start);
        var targetX = Math.max(x + dx, 0);

        timeContext.start = timeContext.parent.timeToPixel.invert(targetX);
      }
    },
    stretch: {
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
    }
  });

  return TimeContextBehavior;
})();

module.exports = TimeContextBehavior;

},{"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45}],7:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseBehavior = _interopRequire(require("./base-behavior"));

var TraceBehavior = (function (_BaseBehavior) {
  function TraceBehavior() {
    _classCallCheck(this, TraceBehavior);

    if (_BaseBehavior != null) {
      _BaseBehavior.apply(this, arguments);
    }
  }

  _inherits(TraceBehavior, _BaseBehavior);

  _createClass(TraceBehavior, {
    edit: {
      value: function edit(renderingContext, shape, datum, dx, dy, target) {
        // rely on element doesn't allow to edit several shapes at once...
        // classes are not the best solution neither, but works
        if (target.classList.contains("mean")) {
          this._editMean(renderingContext, shape, datum, dx, dy);
        } else if (target.classList.contains("min")) {
          this._editRange(renderingContext, shape, datum, dx, dy, "min");
        } else if (target.classList.contains("max")) {
          this._editRange(renderingContext, shape, datum, dx, dy, "max");
        }
      }
    },
    _editMean: {
      value: function _editMean(renderingContext, shape, datum, dx, dy) {
        // work in pixel domain
        var x = renderingContext.timeToPixel(shape.x(datum));
        var y = renderingContext.valueToPixel(shape.mean(datum));

        var targetX = x + dx;
        var targetY = y - dy;

        shape.x(datum, renderingContext.timeToPixel.invert(targetX));
        shape.mean(datum, renderingContext.valueToPixel.invert(targetY));
      }
    },
    _editRange: {
      value: function _editRange(renderingContext, shape, datum, dx, dy, rangeSide) {
        var range = renderingContext.valueToPixel(shape.range(datum));

        var targetRange = rangeSide === "min" ? range + 2 * dy : range - 2 * dy;
        targetRange = Math.max(targetRange, 0);

        shape.range(datum, renderingContext.valueToPixel.invert(targetRange));
      }
    }
  });

  return TraceBehavior;
})(BaseBehavior);

module.exports = TraceBehavior;

},{"./base-behavior":2,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],8:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var d3Scale = _interopRequire(require("d3-scale"));

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

var LayerTimeContext = (function () {
  function LayerTimeContext(parent) {
    _classCallCheck(this, LayerTimeContext);

    if (!parent) {
      throw new Error("LayerTimeContext must have a parent");
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

  _createClass(LayerTimeContext, {
    clone: {
      value: function clone() {
        var ctx = new this();

        ctx.parent = this.parent;
        ctx.start = this.start;
        ctx.duration = this.duration;
        ctx.offset = this.offset;
        ctx.stretchRatio = this.stretchRatio; // creates the local scale if needed

        return ctx;
      }
    },
    start: {
      get: function () {
        return this._start;
      },
      set: function (value) {
        this._start = value;
      }
    },
    duration: {
      get: function () {
        return this._duration;
      },
      set: function (value) {
        this._duration = value;
      }
    },
    offset: {
      get: function () {
        return this._offset;
      },
      set: function (value) {
        this._offset = value;
      }
    },
    stretchRatio: {
      get: function () {
        return this._stretchRatio;
      },
      set: function (value) {
        // remove local scale if ratio = 1
        if (value === 1) {
          this._timeToPixel = null;
          return;
        }
        // reuse previsously created local scale if exists
        var timeToPixel = this._timeToPixel ? this._timeToPixel : d3Scale.linear().domain([0, 1]);

        timeToPixel.range([0, this.parent.computedPixelsPerSecond * value]);

        this._timeToPixel = timeToPixel;
        this._stretchRatio = value;
      }
    },
    timeToPixel: {

      // read only

      get: function () {
        if (!this._timeToPixel) {
          return this.parent.timeToPixel;
        }

        return this._timeToPixel;
      }
    }
  });

  return LayerTimeContext;
})();

module.exports = LayerTimeContext;

},{"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/interop-require":49,"d3-scale":54}],9:[function(require,module,exports){
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

var TimeContextBehavior = _interopRequire(require("../behaviors/time-context-behavior"));

// time context bahevior
var timeContextBehavior = null;
var timeContextBehaviorCtor = TimeContextBehavior;

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

    this._valueToPixel = d3Scale.linear().domain(this.params.yDomain).range([0, this.params.height]);

    this.contextBehavior = "";

    // initialize timeContext layout
    this._renderContainer();

    // creates the timeContextBehavior for all layer, lazy instanciation
    if (timeContextBehavior === null) {
      timeContextBehavior = new timeContextBehaviorCtor();
    }
  }

  _inherits(Layer, _events$EventEmitter);

  _createClass(Layer, {
    start: {
      get: function () {
        return this.timeContext.start;
      },
      set: function (value) {
        this.timeContext.start = value;
      }
    },
    offset: {
      get: function () {
        return this.timeContext.offset;
      },
      set: function (value) {
        this.timeContext.offset = value;
      }
    },
    duration: {
      get: function () {
        return this.timeContext.duration;
      },
      set: function (value) {
        this.timeContext.duration = value;
      }
    },
    stretchRatio: {
      get: function () {
        return this.timeContext.stretchRatio;
      },
      set: function (value) {
        this.timeContext.stretchRatio = value;
      }
    },
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
        this._valueToPixel.domain(domain);
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
        // layer background
        this.$background = document.createElementNS(ns, "rect");
        this.$background.setAttributeNS(null, "height", "100%");
        this.$background.setAttributeNS(null, "width", "100%");
        this.$background.classList.add("background");
        this.$background.style.fillOpacity = 0;
        this.$background.style.pointerEvents = "none";
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
            return _this._renderingContext.valueToPixel.domain()[1];
          },
          y: function () {
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
       *  to the `timeToPixel` scale may change
       */

      value: function _updateRenderingContext() {
        this._renderingContext.timeToPixel = this.timeContext.timeToPixel;
        this._renderingContext.valueToPixel = this._valueToPixel;
        this._renderingContext.height = this.params.height;
        this._renderingContext.width = this.timeContext.timeToPixel(this.timeContext.duration);
        // for foreign object issue in chrome
        this._renderingContext.offsetX = this.timeContext.timeToPixel(this.timeContext.offset);
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
    setContextEditable: {

      /**
       *  draws the shape to interact with the context
       *  @params {Boolean} [bool=true] - defines if the layer's context is editable or not
       */

      value: function setContextEditable() {
        var bool = arguments[0] === undefined ? true : arguments[0];

        var display = bool ? "block" : "none";
        this.$interactions.style.display = display;
        this._isContextEditable = bool;
      }
    },
    editContext: {
      value: function editContext(dx, dy, target) {
        timeContextBehavior.edit(this, dx, dy, target);
      }
    },
    stretchContext: {
      value: function stretchContext(dx, dy, target) {
        timeContextBehavior.stretch(this, dx, dy, target);
      }
    },
    _toFront: {

      // --------------------------------------
      // Helpers
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

        var width = timeContext.timeToPixel(timeContext.duration);
        // offset is relative to tim$eline's timeContext
        var x = timeContext.parent.timeToPixel(timeContext.start);
        var offset = timeContext.timeToPixel(timeContext.offset);
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
  }, {
    configureTimeContextBehavior: {

      /**
       *  allows to override default the TimeContextBehavior
       */

      value: function configureTimeContextBehavior(ctor) {
        timeContextBehaviorCtor = ctor;
      }
    }
  });

  return Layer;
})(events.EventEmitter);

module.exports = Layer;

},{"../behaviors/time-context-behavior":6,"../shapes/segment":32,"./namespace":10,"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/get":47,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49,"d3-scale":54,"d3-selection":55,"events":53}],10:[function(require,module,exports){
"use strict";

module.exports = "http://www.w3.org/2000/svg";

},{}],11:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var d3Scale = _interopRequire(require("d3-scale"));

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
    var scale = d3Scale.linear().domain([0, 1]).range([0, pixelsPerSecond]);

    this.timeToPixel = scale;
    // this.originalXScale = this.timeToPixel.copy();

    this._originalPixelsPerSecond = this._computedPixelsPerSecond;
  }

  _createClass(TimelineTimeContext, {
    pixelsPerSecond: {
      get: function () {
        return this._originalPixelsPerSecond;
      },
      set: function (value) {
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
    },
    computedPixelsPerSecond: {
      get: function () {
        return this._computedPixelsPerSecond;
      }
    },
    offset: {
      get: function () {
        return this._offset;
      },
      set: function (value) {
        this._offset = value;
      }
    },
    zoom: {
      get: function () {
        return this._zoom;
      },
      set: function (value) {
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
    },
    visibleWidth: {
      get: function () {
        return this._visibleWidth;
      },
      set: function (value) {
        var widthRatio = value / this.visibleWidth;

        this._visibleWidth = value;
        this._visibleDuration = this.visibleWidth / this._computedPixelsPerSecond;

        if (this.maintainVisibleDuration) {
          this.pixelsPerSecond = this._computedPixelsPerSecond * widthRatio;
        }
      }
    },
    visibleDuration: {

      /** @readonly */

      get: function () {
        return this._visibleDuration;
      }
    },
    maintainVisibleDuration: {
      get: function () {
        return this._maintainVisibleDuration;
      },
      set: function (bool) {
        this._maintainVisibleDuration = bool;
      }
    },
    timeToPixel: {
      get: function () {
        return this._timeToPixel;
      },
      set: function (scale) {
        this._timeToPixel = scale;
      }
    },
    _updateTimeToPixelRange: {
      value: function _updateTimeToPixelRange() {
        this._visibleDuration = this.visibleWidth / this._computedPixelsPerSecond;
        this.timeToPixel.range([0, this._computedPixelsPerSecond]);
      }
    }
  });

  return TimelineTimeContext;
})();

module.exports = TimelineTimeContext;

},{"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/interop-require":49,"d3-scale":54}],12:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createComputedClass = require("babel-runtime/helpers/create-computed-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _regeneratorRuntime = require("babel-runtime/regenerator")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var events = _interopRequire(require("events"));

var Keyboard = _interopRequire(require("../interactions/keyboard"));

var LayerTimeContext = _interopRequire(require("./layer-time-context"));

var Surface = _interopRequire(require("../interactions/surface"));

var TimelineTimeContext = _interopRequire(require("./timeline-time-context"));

var Track = _interopRequire(require("./track"));

var TrackCollection = _interopRequire(require("./track-collection"));

/**
 * The `timeline` is the main entry point of a temporal visualization, it:
 * - contains factories to manage its `tracks` and `layers`,
 * - get or set the view window overs its `tracks` through `offset`, `zoom`,  * `pixelsPerSecond`, `visibleWidth`,
 * - is the central hub for all user interaction events (keyboard, mouse),
 * - holds the current interaction `state` which defines how the different timeline elements (tracks, layers, shapes) respond to user interactions.
 */

var Timeline = (function (_events$EventEmitter) {
  /**
   * Creates a new `Timeline` instance
   */

  function Timeline() {
    var pixelsPerSecond = arguments[0] === undefined ? 100 : arguments[0];
    var visibleWidth = arguments[1] === undefined ? 1000 : arguments[1];

    _classCallCheck(this, Timeline);

    _get(_core.Object.getPrototypeOf(Timeline.prototype), "constructor", this).call(this);

    this._tracks = new TrackCollection(this);
    this._state = null;

    // default interactions
    this._surfaceCtor = Surface;
    this.createInteraction(Keyboard, "body");

    // stores
    this._trackById = {};
    this._groupedLayers = {};

    this.timeContext = new TimelineTimeContext(pixelsPerSecond, visibleWidth);
  }

  _inherits(Timeline, _events$EventEmitter);

  _createComputedClass(Timeline, [{
    key: "offset",

    /**
     *  TimeContext accessors
     */
    get: function () {
      return this.timeContext.offset;
    },
    set: function (value) {
      this.timeContext.offset = value;
    }
  }, {
    key: "zoom",
    get: function () {
      return this.timeContext.zoom;
    },
    set: function (value) {
      this.timeContext.zoom = value;
    }
  }, {
    key: "pixelsPerSecond",
    get: function () {
      return this.timeContext.pixelsPerSecond;
    },
    set: function (value) {
      this.timeContext.pixelsPerSecond = value;
    }
  }, {
    key: "visibleWidth",
    get: function () {
      return this.timeContext.visibleWidth;
    },
    set: function (value) {
      this.timeContext.visibleWidth = value;
    }
  }, {
    key: "timeToPixel",
    get: function () {
      return this.timeContext.timeToPixel;
    }
  }, {
    key: "visibleDuration",

    /**
     *  @readonly
     */
    get: function () {
      return this.timeContext.visibleDuration;
    }
  }, {
    key: "maintainVisibleDuration",

    // @NOTE maybe expose as public instead of get/set for nothing...
    set: function (bool) {
      this.timeContext.maintainVisibleDuration = bool;
    },
    get: function () {
      return this.timeContext.maintainVisibleDuration;
    }
  }, {
    key: "groupedLayers",

    // @readonly - used in track collection
    get: function () {
      return this._groupedLayers;
    }
  }, {
    key: "configureSurface",

    /**
     *  Override the default Surface that is instanciated on each
     *  @param {EventSource} ctor - the constructor to use to build surfaces
     */
    value: function configureSurface(ctor) {
      this._surfaceCtor = ctor;
    }
  }, {
    key: "createInteraction",

    /**
     * Factory method to add interaction modules the timeline should listen to.
     * By default, the timeline listen to Keyboard, and instanciate a `Surface` on each container.
     * Can be used to install any interaction implementing the `EventSource` interface
     * @param {EventSource} ctor - the contructor of the interaction module to instanciate
     * @param el {DOMElement} the DOM element to bind to the EventSource module
     * @param options {Object} options to be applied to the ctor (defaults to `{}`)
     */
    value: function createInteraction(ctor, el) {
      var _this = this;

      var options = arguments[2] === undefined ? {} : arguments[2];

      var interaction = new ctor(el, options);
      interaction.on("event", function (e) {
        return _this._handleEvent(e);
      });
    }
  }, {
    key: "_handleEvent",

    /**
     * The callback that is used to listen to interactions modules
     * @params {Event} e - a custom event generated by interaction modules
     */
    value: function _handleEvent(e) {
      // emit event as a middleware
      this.emit("event", e);
      // propagate to the state
      if (!this._state) {
        return;
      }
      this._state.handleEvent(e);
    }
  }, {
    key: "state",

    /**
     * Changes the state of the timeline
     * @param {BaseState} state - the state in which the timeline must be setted
     */
    set: function (state) {
      if (this._state) {
        this._state.exit();
      }
      this._state = state;
      this._state.enter();
    },
    get: function () {
      return this._state;
    }
  }, {
    key: "tracks",

    /**
     *  Shortcut to access the Track collection
     *  @return {TrackCollection}
     */
    get: function () {
      return this._tracks;
    }
  }, {
    key: "layers",

    /**
     * Shortcut to access the Layer list
     * @return {Array}
     */
    get: function () {
      return this._tracks.layers;
    }
  }, {
    key: "add",

    /**
     * Adds a track to the timeline
     * Tracks display a view window on the timeline in theirs own SVG element.
     * @param {Track} track
     */
    value: function add(track) {
      if (this.tracks.indexOf(track) !== -1) {
        throw new Error("track already added to the timeline");
      }

      track.configure(this.timeContext);

      this.tracks.push(track);
      this.createInteraction(this._surfaceCtor, track.$el);
    }
  }, {
    key: "remove",

    /**
     *  Removes a track from the timeline
     *  @TODO
     */
    value: function remove(track) {}
  }, {
    key: "createTrack",

    /**
     *  Creates a new track from the configuration define in `configureTracks`
     *  @param {DOMElement} $el - the element to insert the track inside
     *  @param {Object} options - override the defaults options if necessary
     *  @param {String} [trackId=null] - optionnal id to give to the track, only exists in timeline's context
     *  @return {Track}
     */
    value: function createTrack($el) {
      var trackHeight = arguments[1] === undefined ? 100 : arguments[1];
      var trackId = arguments[2] === undefined ? null : arguments[2];

      var track = new Track($el, trackHeight);

      if (trackId !== null) {
        if (this._trackById[trackId] !== undefined) {
          throw new Error("trackId: \"" + trackId + "\" is already used");
        }

        this._trackById[trackId] = track;
      }

      // Add track to the timeline
      this.add(track);
      track.render();
      track.update();

      return track;
    }
  }, {
    key: "addLayer",

    /**
     *  Adds a layer to a track, allow to group track arbitrarily inside groups. Basically a wrapper for `track.add(layer)`
     *  @param {Layer} layer - the layer to add
     *  @param {Track} track - the track to the insert the layer in
     *  @param {String} [groupId='default'] - the group in which associate the layer
     */
    value: function addLayer(layer, trackOrTrackId) {
      var groupId = arguments[2] === undefined ? "default" : arguments[2];

      var track = trackOrTrackId;

      if (typeof trackOrTrackId === "string") {
        track = this.getTrackById(trackOrTrackId);
      }

      // creates the `LayerTimeContext` if not present
      if (!layer.timeContext) {
        var timeContext = new LayerTimeContext(this.timeContext);
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
  }, {
    key: "removeLayer",

    /**
     *  Removes a layer from its track (the layer is detatched from the DOM but can still be reused)
     *  @param {Layer} layer - the layer to remove
     */
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
  }, {
    key: "getTrackById",

    /**
     *  Returns a track from it's id
     *  @param {String} trackId
     *  @return {Track}
     */
    value: function getTrackById(trackId) {
      return this._trackById[trackId];
    }
  }, {
    key: "getLayersByGroup",

    /**
     * Returns an array of layers from their group Id
     * @param {String} groupId
     * @return {Array}
     */
    value: function getLayersByGroup(groupId) {
      return this._groupedLayers[groupId];
    }
  }, {
    key: _core.Symbol.iterator,
    value: _regeneratorRuntime.mark(function callee$1$0() {
      var _this = this;

      return _regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.delegateYield(_core.$for.getIterator(_this.tracks), "t0", 1);

          case 1:
          case "end":
            return context$2$0.stop();
        }
      }, callee$1$0, this);
    })
  }]);

  return Timeline;
})(events.EventEmitter);

module.exports = Timeline;

// should destroy interaction too, avoid ghost eventListeners

},{"../interactions/keyboard":22,"../interactions/surface":23,"./layer-time-context":8,"./timeline-time-context":11,"./track":14,"./track-collection":13,"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-computed-class":46,"babel-runtime/helpers/get":47,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49,"babel-runtime/regenerator":51,"events":53}],13:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var Layer = _interopRequire(require("./layer"));

/**
 * The `TrackCollection` class allow to update all timeline's tracks at once
 */

var TrackCollection = (function (_Array) {
  function TrackCollection(timeline) {
    _classCallCheck(this, TrackCollection);

    _get(_core.Object.getPrototypeOf(TrackCollection.prototype), "constructor", this).call(this);

    this._timeline = timeline;
  }

  _inherits(TrackCollection, _Array);

  _createClass(TrackCollection, {
    _getLayersOrGroups: {

      // @TODO
      // this should be in the timeline

      value: function _getLayersOrGroups() {
        var layerOrGroup = arguments[0] === undefined ? null : arguments[0];

        var layers = null;

        if (typeof layerOrGroup === "string") {
          layers = this._timeline.groupedLayers[layerOrGroup];
        } else if (layerOrGroup instanceof Layer) {
          layers = [layerOrGroup];
        } else {
          layers = this.layers;
        }

        return layers;
      }
    },
    height: {

      // @NOTE keep this ?
      // could prepare some vertical resizing ability
      // this should be able to modify the layers yScale to be really usefull

      set: function (value) {
        this.forEach(function (track) {
          return track.height = value;
        });
      }
    },
    layers: {

      // access layers

      get: function () {
        var layers = [];
        this.forEach(function (track) {
          return layers = layers.concat(track.layers);
        });

        return layers;
      }
    },
    render: {
      value: function render() {
        this.forEach(function (track) {
          return track.render();
        });
        this._timeline.emit("render");
      }
    },
    update: {

      // should be update(...layersOrGroups)

      value: function update(layerOrGroup) {
        var layers = this._getLayersOrGroups(layerOrGroup);
        this.forEach(function (track) {
          return track.update(layers);
        });
        this._timeline.emit("update", layers);
      }
    },
    updateContainer: {
      value: function updateContainer(trackOrTrackIds) {
        this.forEach(function (track) {
          return track.updateContainer();
        });
        this._timeline.emit("update:containers");
      }
    },
    updateLayers: {
      value: function updateLayers(layerOrGroup) {
        var layers = this._getLayersOrGroups(layerOrGroup);
        this.forEach(function (track) {
          return track.updateLayers(layers);
        });
        this._timeline.emit("update:layers", layers);
      }
    }
  });

  return TrackCollection;
})(Array);

module.exports = TrackCollection;

},{"./layer":9,"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/get":47,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],14:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createComputedClass = require("babel-runtime/helpers/create-computed-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _regeneratorRuntime = require("babel-runtime/regenerator")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var d3Scale = _interopRequire(require("d3-scale"));

var ns = _interopRequire(require("./namespace"));

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
* <svg>
*  <defs> Unused for the moment, could be used to define custom shapes for use with layers
*  </defs>
*  <g class="offset">
*   <g class="layout"> The layers are inserted here
*   </g>
*  </g>
*  <g class="interactions"> Placeholder to visualize interactions (eg. brush)
*  </g>
* </svg>
*/

var Track = (function () {
  function Track($el) {
    var height = arguments[1] === undefined ? 100 : arguments[1];

    _classCallCheck(this, Track);

    this.$el = $el;
    this.layers = [];
    this._height = height;

    // are set when added to the timeline
    this.renderingContext = null;

    this._createContainer();
  }

  _createComputedClass(Track, [{
    key: "height",
    get: function () {
      return this._height;
    },
    set: function (value) {
      this._height = value;
      // @NOTE: propagate to layers, keeping ratio ?
    }
  }, {
    key: "configure",

    /**
     *  This method is called when the track is added to the timeline
     *  The track cannot be updated without being added to a timeline
     */
    value: function configure(renderingContext) {
      this.renderingContext = renderingContext;
    }
  }, {
    key: "destroy",

    /**
     *  Destroy a track
     *  The layers from this track can still be reused elsewhere
     */
    value: function destroy() {
      var _this = this;

      // detatch everything from the DOM
      this.$el.removeChild(this.$svg);
      this.layers.forEach(function (layer) {
        return _this.$layout.removeChild(layer.$el);
      });
      // clean references
      this.$el = null;
      this.renderingContext = null;
      this.layers.length = 0;
    }
  }, {
    key: "_createContainer",

    /**
     *  Creates the container for the track
     */
    value: function _createContainer() {
      var $svg = document.createElementNS(ns, "svg");
      $svg.setAttributeNS(null, "shape-rendering", "optimizeSpeed");
      $svg.setAttributeNS(null, "height", this.height);
      $svg.setAttribute("xmlns:xhtml", "http://www.w3.org/1999/xhtml");

      var $background = document.createElementNS(ns, "rect");
      $background.setAttributeNS(null, "height", "100%");
      $background.setAttributeNS(null, "width", "100%");
      $background.setAttributeNS(null, "style", "fill-opacity:0");

      var $defs = document.createElementNS(ns, "defs");

      var $offsetGroup = document.createElementNS(ns, "g");
      $offsetGroup.classList.add("offset");

      var $layoutGroup = document.createElementNS(ns, "g");
      $layoutGroup.classList.add("layout");

      var $interactionsGroup = document.createElementNS(ns, "g");
      $interactionsGroup.classList.add("interactions");

      $svg.appendChild($defs);
      $svg.appendChild($background);
      $offsetGroup.appendChild($layoutGroup);
      $svg.appendChild($offsetGroup);
      $svg.appendChild($interactionsGroup);

      this.$el.appendChild($svg);
      // removes additionnal height added who knows why...
      this.$el.style.fontSize = 0;
      // fixes one of the (many ?) weird canvas rendering bugs in Chrome
      this.$el.style.transform = "translateZ(0)";

      this.$layout = $layoutGroup;
      this.$offset = $offsetGroup;
      this.$interactions = $interactionsGroup;
      this.$svg = $svg;
      this.$background = $background;
    }
  }, {
    key: "add",

    /**
     * Adds a layer to the track
     */
    value: function add(layer) {
      this.layers.push(layer);
      // Create a default renderingContext for the layer if missing
      this.$layout.appendChild(layer.$el);
    }
  }, {
    key: "remove",

    /**
     * Removes a layer
     */
    value: function remove(layer) {
      this.layers.splice(this.layers.indexOf(layer), 1);
      // Removes layer from its container
      this.$layout.removeChild(layer.$el);
    }
  }, {
    key: "render",

    /**
     * Draw tracks, and the layers in cascade
     */
    value: function render() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _core.$for.getIterator(this), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var layer = _step.value;
          layer.render();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "update",

    /**
     * Update the layers
     */
    value: function update() {
      var layers = arguments[0] === undefined ? null : arguments[0];

      this.updateContainer();
      this.updateLayers(layers);
    }
  }, {
    key: "updateContainer",
    value: function updateContainer() {
      var $svg = this.$svg;
      var $offset = this.$offset;
      // should be in some update layout
      var renderingContext = this.renderingContext;
      var height = this.height;
      var width = renderingContext.visibleWidth;
      var offsetX = renderingContext.timeToPixel(renderingContext.offset);
      var translate = "translate(" + offsetX + ", 0)";

      $svg.setAttributeNS(null, "height", height);
      $svg.setAttributeNS(null, "width", width);
      $svg.setAttributeNS(null, "viewbox", "0 0 " + width + " " + height);

      $offset.setAttributeNS(null, "transform", translate);
    }
  }, {
    key: "updateLayers",
    value: function updateLayers() {
      var _this = this;

      var layers = arguments[0] === undefined ? null : arguments[0];

      layers = layers === null ? this.layers : layers;

      layers.forEach(function (layer) {
        if (_this.layers.indexOf(layer) === -1) {
          return;
        }
        layer.update();
      });
    }
  }, {
    key: _core.Symbol.iterator,
    value: _regeneratorRuntime.mark(function callee$1$0() {
      var _this = this;

      return _regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.delegateYield(_core.$for.getIterator(_this.layers), "t1", 1);

          case 1:
          case "end":
            return context$2$0.stop();
        }
      }, callee$1$0, this);
    })
  }]);

  return Track;
})();

module.exports = Track;

},{"./namespace":10,"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-computed-class":46,"babel-runtime/helpers/interop-require":49,"babel-runtime/regenerator":51,"d3-scale":54}],15:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var AnnotatedMarker = _interopRequire(require("../shapes/annotated-marker"));

var Layer = _interopRequire(require("../core/layer"));

var MarkerBehavior = _interopRequire(require("../behaviors/marker-behavior"));

var AnnotatedMarkerLayer = (function (_Layer) {
  function AnnotatedMarkerLayer(data) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, AnnotatedMarkerLayer);

    _get(_core.Object.getPrototypeOf(AnnotatedMarkerLayer.prototype), "constructor", this).call(this, "collection", data, options);

    this.configureShape(AnnotatedMarker);
    this.setBehavior(new MarkerBehavior());
  }

  _inherits(AnnotatedMarkerLayer, _Layer);

  return AnnotatedMarkerLayer;
})(Layer);

module.exports = AnnotatedMarkerLayer;

},{"../behaviors/marker-behavior":4,"../core/layer":9,"../shapes/annotated-marker":25,"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/get":47,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],16:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var Layer = _interopRequire(require("../core/layer"));

var Cursor = _interopRequire(require("../shapes/cursor"));

var CursorLayer = (function (_Layer) {
  function CursorLayer() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, CursorLayer);

    var data = { currentPosition: 0 };

    _get(_core.Object.getPrototypeOf(CursorLayer.prototype), "constructor", this).call(this, "entity", data, options);

    this.configureShape(Cursor, { x: function (d) {
        return d.currentPosition;
      } }, {
      color: options.color
    });
  }

  _inherits(CursorLayer, _Layer);

  _createClass(CursorLayer, {
    currentPosition: {
      set: function (value) {
        this.data.currentPosition = value;
      },
      get: function () {
        return this.data.currentPosition;
      }
    }
  });

  return CursorLayer;
})(Layer);

module.exports = CursorLayer;

},{"../core/layer":9,"../shapes/cursor":28,"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/get":47,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],17:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BreakpointBehavior = _interopRequire(require("../behaviors/breakpoint-behavior"));

var Dot = _interopRequire(require("../shapes/dot"));

var Layer = _interopRequire(require("../core/layer"));

var DotLayer = (function (_Layer) {
  function DotLayer(data) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, DotLayer);

    _get(_core.Object.getPrototypeOf(DotLayer.prototype), "constructor", this).call(this, "collection", data, options);

    this.configureShape(Dot);
    this.setBehavior(new BreakpointBehavior());
  }

  _inherits(DotLayer, _Layer);

  return DotLayer;
})(Layer);

module.exports = DotLayer;

},{"../behaviors/breakpoint-behavior":3,"../core/layer":9,"../shapes/dot":29,"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/get":47,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],18:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var Layer = _interopRequire(require("../core/layer"));

var Marker = _interopRequire(require("../shapes/marker"));

var MarkerBehavior = _interopRequire(require("../behaviors/marker-behavior"));

var MarkerLayer = (function (_Layer) {
  function MarkerLayer(data) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, MarkerLayer);

    _get(_core.Object.getPrototypeOf(MarkerLayer.prototype), "constructor", this).call(this, "collection", data, options);

    this.configureShape(Marker, {}, {
      displayHandler: options.displayHandler
    });
    this.setBehavior(new MarkerBehavior());
  }

  _inherits(MarkerLayer, _Layer);

  return MarkerLayer;
})(Layer);

module.exports = MarkerLayer;

},{"../behaviors/marker-behavior":4,"../core/layer":9,"../shapes/marker":31,"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/get":47,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],19:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var Layer = _interopRequire(require("../core/layer"));

var Segment = _interopRequire(require("../shapes/segment"));

var SegmentBehavior = _interopRequire(require("../behaviors/segment-behavior"));

var SegmentLayer = (function (_Layer) {
  function SegmentLayer(data) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, SegmentLayer);

    _get(_core.Object.getPrototypeOf(SegmentLayer.prototype), "constructor", this).call(this, "collection", data, options);

    this.configureShape(Segment, {}, {
      displayHandlers: options.displayHandlers
    });
    this.setBehavior(new SegmentBehavior());
  }

  _inherits(SegmentLayer, _Layer);

  return SegmentLayer;
})(Layer);

module.exports = SegmentLayer;

},{"../behaviors/segment-behavior":5,"../core/layer":9,"../shapes/segment":32,"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/get":47,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],20:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var Layer = _interopRequire(require("../core/layer"));

var Waveform = _interopRequire(require("../shapes/waveform"));

var defaults = {
  yDomain: [-1, 1],
  channel: 0,
  color: "steelblue"
};

var WaveformLayer = (function (_Layer) {
  function WaveformLayer(buffer, options) {
    _classCallCheck(this, WaveformLayer);

    options = _core.Object.assign({}, defaults, options);

    _get(_core.Object.getPrototypeOf(WaveformLayer.prototype), "constructor", this).call(this, "entity", buffer.getChannelData(options.channel), options);

    this.configureShape(Waveform, {
      y: function y(d) {
        var v = arguments[1] === undefined ? null : arguments[1];

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

  _inherits(WaveformLayer, _Layer);

  return WaveformLayer;
})(Layer);

module.exports = WaveformLayer;

},{"../core/layer":9,"../shapes/waveform":35,"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/get":47,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],21:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var events = _interopRequire(require("events"));

/**
 * Main interface for event source
 */

var EventSource = (function (_events$EventEmitter) {
  function EventSource(el) {
    _classCallCheck(this, EventSource);

    _get(_core.Object.getPrototypeOf(EventSource.prototype), "constructor", this).call(this);
    this.el = el;

    this._bindEvents();
  }

  _inherits(EventSource, _events$EventEmitter);

  _createClass(EventSource, {
    _createEvent: {
      value: function _createEvent(type, e) {}
    },
    _bindEvents: {
      value: function _bindEvents() {}
    }
  });

  return EventSource;
})(events.EventEmitter);

module.exports = EventSource;

},{"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/get":47,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49,"events":53}],22:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var EventSource = _interopRequire(require("./event-source"));

var WaveEvent = _interopRequire(require("./wave-event"));

var body = window.document.body;

/**
 * http://javascript.info/tutorial/keyboard-events
 */

var Keyboard = (function (_EventSource) {
  function Keyboard() {
    var el = arguments[0] === undefined ? body : arguments[0];

    _classCallCheck(this, Keyboard);

    _get(_core.Object.getPrototypeOf(Keyboard.prototype), "constructor", this).call(this, body);
  }

  _inherits(Keyboard, _EventSource);

  _createClass(Keyboard, {
    _createEvent: {
      value: function _createEvent(type, e) {
        var event = new WaveEvent(type, e);

        event.shiftKey = e.shiftKey;
        event.ctrlKey = e.ctrlKey;
        event.altKey = e.altKey;
        event.metaKey = e.metaKey;
        event.char = String.fromCharCode(e.keyCode);

        return event;
      }
    },
    _bindEvents: {
      value: function _bindEvents() {
        var _this = this;

        var onKeyDown = function (e) {
          var event = _this._createEvent("keydown", e);
          _this.emit("event", event);
        };

        var onKeyUp = function (e) {
          var event = _this._createEvent("keyup", e);
          _this.emit("event", event);
        };

        this.el.onkeydown = onKeyDown;
        this.el.onkeyup = onKeyUp;
      }
    }
  });

  return Keyboard;
})(EventSource);

module.exports = Keyboard;

},{"./event-source":21,"./wave-event":24,"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/get":47,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],23:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var EventSource = _interopRequire(require("./event-source"));

var WaveEvent = _interopRequire(require("./wave-event"));

var body = window.document.body;

/**
 * `Surface` normalizes mouse user interactions with the timeline upon the DOM container element of `Track` instances.
 * As soon as a `track` is added to a `timeline`, its attached `Surface` instance will emit the mouse events.
 */

var Surface = (function (_EventSource) {
  /**
   * @param {DOMElement} el - the DOM element to monitor
   */

  function Surface(el /*, padding of the current surface @TODO */) {
    _classCallCheck(this, Surface);

    _get(_core.Object.getPrototypeOf(Surface.prototype), "constructor", this).call(this, el);

    // this.isMouseDown = false;
    this.mouseDownEvent = null;
    this.lastEvent = null;
  }

  _inherits(Surface, _EventSource);

  _createClass(Surface, {
    _createEvent: {

      /**
       * Factory method for `Event` class
       */

      value: function _createEvent(type, e) {
        var event = new WaveEvent(type, e);

        var pos = this._getRelativePosition(e);
        event.x = pos.x;
        event.y = pos.y;

        return event;
      }
    },
    _getRelativePosition: {

      /**
       * @param {Event} e - raw event from listener
       * @return {Object} The x, y coordinates coordinates relative to the surface element
       */

      value: function _getRelativePosition(e) {
        // @TODO: should be able to ignore padding
        var x = 0;
        var y = 0;
        var clientRect = this.el.getBoundingClientRect();
        var scrollLeft = body.scrollLeft + document.documentElement.scrollLeft;
        var scrollTop = body.scrollTop + document.documentElement.scrollTop;

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
    },
    _bindEvents: {

      /**
       * Keep this private to avoid double event binding
       * Main logic of the surface is here
       * Should be extended with needed events (mouseenter, mouseleave, wheel ...)
       */

      value: function _bindEvents() {
        var _this = this;

        var onMouseDown = function (e) {
          // By removing the previous selection we prevent bypassing the mousemove events coming from SVG in Firefox.
          window.getSelection().removeAllRanges();
          var event = _this._createEvent("mousedown", e);

          _this.isMouseDown = true;
          _this.mouseDownEvent = event;
          _this.lastEvent = event;
          // Register mousemove and mouseup listeners on window
          window.addEventListener("mousemove", onMouseMove, false);
          window.addEventListener("mouseup", onMouseUp, false);

          _this.emit("event", event);
        };

        var onMouseMove = function (e) {
          var event = _this._createEvent("mousemove", e);
          event.defineArea(_this.mouseDownEvent, _this.lastEvent);
          // Update `lastEvent` for next call
          _this.lastEvent = event;

          _this.emit("event", event);
        };

        var onMouseUp = function (e) {
          var event = _this._createEvent("mouseup", e);
          event.defineArea(_this.mouseDownEvent, _this.lastEvent);

          _this.isMouseDown = false;
          _this.mouseDownEvent = null;
          _this.lastEvent = null;
          // Remove mousemove and mouseup listeners on window
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);

          _this.emit("event", event);
        };

        var onClick = function (e) {
          var event = _this._createEvent("click", e);
          _this.emit("event", event);
        };

        var onDblClick = function (e) {
          var event = _this._createEvent("dblclick", e);
          _this.emit("event", event);
        };

        // Bind callbacks
        this.el.addEventListener("mousedown", onMouseDown, false);
        this.el.addEventListener("click", onClick, false);
        this.el.addEventListener("dblclick", onDblClick, false);
      }
    }
  });

  return Surface;
})(EventSource);

module.exports = Surface;

},{"./event-source":21,"./wave-event":24,"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/get":47,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],24:[function(require,module,exports){
// base class for all Events
// @NOTE: use a single Event per Surface
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var WaveEvent = (function () {
  function WaveEvent(type, originalEvent) {
    _classCallCheck(this, WaveEvent);

    this.type = type;
    this.target = originalEvent.target;
    this.currentTarget = originalEvent.currentTarget;
    this.originalEvent = originalEvent;

    // is setted in timeline's states
    // this.currentTarget = null;
    this.x = null;
    this.y = null;
    this.dx = null;
    this.dy = null;
    this.area = null; // @TODO rename
  }

  _createClass(WaveEvent, {
    defineArea: {
      value: function defineArea(mouseDownEvent, lastEvent) {
        if (!mouseDownEvent || !lastEvent) {
          return;
        }
        this.dx = this.x - lastEvent.x;
        this.dy = this.y - lastEvent.y;

        var left = mouseDownEvent.x < this.x ? mouseDownEvent.x : this.x;
        var top = mouseDownEvent.y < this.y ? mouseDownEvent.y : this.y;
        var width = Math.abs(Math.round(this.x - mouseDownEvent.x));
        var height = Math.abs(Math.round(this.y - mouseDownEvent.y));

        this.area = { left: left, top: top, width: width, height: height };
      }
    }
  });

  return WaveEvent;
})();

module.exports = WaveEvent;

},{"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45}],25:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var Marker = _interopRequire(require("./marker"));

var AnnotatedMarker = (function (_Marker) {
  function AnnotatedMarker() {
    _classCallCheck(this, AnnotatedMarker);

    if (_Marker != null) {
      _Marker.apply(this, arguments);
    }
  }

  _inherits(AnnotatedMarker, _Marker);

  _createClass(AnnotatedMarker, {
    getClassName: {
      value: function getClassName() {
        return "annotated-marker";
      }
    },
    _getAccessorList: {
      value: function _getAccessorList() {
        var list = _get(_core.Object.getPrototypeOf(AnnotatedMarker.prototype), "_getAccessorList", this).call(this);
        list.text = "default";
        return list;
      }
    },
    render: {
      value: function render(renderingContext) {
        this.$el = _get(_core.Object.getPrototypeOf(AnnotatedMarker.prototype), "render", this).call(this, renderingContext);
        var height = renderingContext.height;

        this.$label = document.createElementNS(this.ns, "text");
        this.$label.setAttributeNS(null, "x", 10);
        this.$label.setAttributeNS(null, "y", 10);
        this.$label.setAttributeNS(null, "transform", "matrix(1, 0, 0, -1, 0, " + height + ")");
        this.$label.style.fontSize = "10px";
        this.$label.style.fontFamily = "monospace";
        this.$label.style.color = "#676767";
        this.$label.style.mozUserSelect = "none";
        this.$label.style.webkitUserSelect = "none";
        this.$label.style.userSelect = "none";

        this.$el.appendChild(this.$label);

        return this.$el;
      }
    },
    update: {
      value: function update(renderingContext, datum, index) {
        _get(_core.Object.getPrototypeOf(AnnotatedMarker.prototype), "update", this).call(this, renderingContext, datum, index);

        this.$label.innerHTML = this.text(datum);
      }
    }
  });

  return AnnotatedMarker;
})(Marker);

module.exports = AnnotatedMarker;

},{"./marker":31,"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/get":47,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],26:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var Segment = _interopRequire(require("./segment"));

var AnnotatedSegment = (function (_Segment) {
  function AnnotatedSegment() {
    _classCallCheck(this, AnnotatedSegment);

    if (_Segment != null) {
      _Segment.apply(this, arguments);
    }
  }

  _inherits(AnnotatedSegment, _Segment);

  _createClass(AnnotatedSegment, {
    getClassName: {
      value: function getClassName() {
        return "annotated-segment";
      }
    },
    _getAccessorList: {
      value: function _getAccessorList() {
        var list = _get(_core.Object.getPrototypeOf(AnnotatedSegment.prototype), "_getAccessorList", this).call(this);
        list.text = "default";
        return list;
      }
    },
    render: {
      value: function render(renderingContext) {
        this.$el = _get(_core.Object.getPrototypeOf(AnnotatedSegment.prototype), "render", this).call(this, renderingContext);
        var height = renderingContext.height;

        this.$label = document.createElementNS(this.ns, "text");
        this.$label.setAttributeNS(null, "x", 1);
        this.$label.setAttributeNS(null, "y", 11);
        this.$label.setAttributeNS(null, "transform", "matrix(1, 0, 0, -1, 0, " + height + ")");
        this.$label.style.fontSize = "10px";
        this.$label.style.fontFamily = "monospace";
        this.$label.style.color = "#676767";
        this.$label.style.mozUserSelect = "none";
        this.$label.style.webkitUserSelect = "none";
        this.$label.style.userSelect = "none";

        this.$el.appendChild(this.$label);

        return this.$el;
      }
    },
    update: {
      value: function update(renderingContext, datum, index) {
        _get(_core.Object.getPrototypeOf(AnnotatedSegment.prototype), "update", this).call(this, renderingContext, datum, index);

        this.$label.innerHTML = this.text(datum);
      }
    }
  });

  return AnnotatedSegment;
})(Segment);

module.exports = AnnotatedSegment;

},{"./segment":32,"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/get":47,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],27:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var ns = _interopRequire(require("../core/namespace"));

// @NOTE: accessors should receive datum index as argument
// to allow the use of sampleRate to define x position

var BaseShape = (function () {
  /**
   *  @param options {Object} override default configuration
   */

  function BaseShape() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BaseShape);

    this.$el = null;
    this.ns = ns;
    this.params = _core.Object.assign({}, this._getDefaults(), options);
    // create accessors methods and set default accessor functions
    var accessors = this._getAccessorList();
    this._createAccessors(accessors);
    this._setDefaultAccessors(accessors);
  }

  _createClass(BaseShape, {
    _getDefaults: {
      value: function _getDefaults() {
        return {};
      }
    },
    destroy: {

      /**
       *  clean references, is called from the `layer`
       */

      value: function destroy() {
        // this.group = null;
        this.$el = null;
      }
    },
    getClassName: {

      /**
       * @return {String} the name of the shape, used as a class in the element group
       */

      value: function getClassName() {
        return "shape";
      }
    },
    _getAccessorList: {

      // should only be called once
      // setSvgDefinition(defs) {}

      /**
       * @TODO rename
       * @return {Object}
       *    keys are the accessors methods names to create
       *    values are the default values for each given accessor
       */

      value: function _getAccessorList() {
        return {};
      }
    },
    install: {

      /**
       *  install the given accessors on the shape
       */

      value: function install(accessors) {
        for (var key in accessors) {
          this[key] = accessors[key];
        }
      }
    },
    _createAccessors: {

      /**
       * generic method to create accessors
       * adds accessor to the prototype if not already present
       */

      value: function _createAccessors(accessors) {
        this._accessors = {};
        // add it to the prototype
        var proto = _core.Object.getPrototypeOf(this);
        // create a getter / setter for each accessors
        // setter : `this.x = callback`
        // getter : `this.x(datum)`
        _core.Object.keys(accessors).forEach(function (name) {
          if (proto.hasOwnProperty(name)) {
            return;
          }

          Object.defineProperty(proto, name, {
            get: function get() {
              return this._accessors[name];
            },
            set: function set(func) {
              this._accessors[name] = func;
            }
          });
        });
      }
    },
    _setDefaultAccessors: {

      /**
       * create a function to be used as a default
       * accessor for each accesors
       */

      value: function _setDefaultAccessors(accessors) {
        var _this = this;

        _core.Object.keys(accessors).forEach(function (name) {
          var defaultValue = accessors[name];
          var accessor = function accessor(d) {
            var v = arguments[1] === undefined ? null : arguments[1];

            if (v === null) {
              return d[name] || defaultValue;
            }
            d[name] = v;
          };
          // set accessor as the default one
          _this[name] = accessor;
        });
      }
    },
    render: {

      /**
       * @param  renderingContext {Context} the renderingContext the layer which owns this item
       * @return  {DOMElement} the DOM element to insert in the item's group
       */

      value: function render(renderingContext) {}
    },
    update: {

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

      value: function update(renderingContext, datum, index) {}
    },
    inArea: {

      /**
       *  define if the shape is considered to be the given area
       *  arguments are passed in domain unit (time, whatever)
       *  @return {Boolean}
       */

      value: function inArea(renderingContext, datum, x1, y1, x2, y2) {}
    }
  });

  return BaseShape;
})();

module.exports = BaseShape;

},{"../core/namespace":10,"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/interop-require":49}],28:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseShape = _interopRequire(require("./base-shape"));

var ns = _interopRequire(require("../core/namespace"));

var Cursor = (function (_BaseShape) {
  function Cursor() {
    _classCallCheck(this, Cursor);

    if (_BaseShape != null) {
      _BaseShape.apply(this, arguments);
    }
  }

  _inherits(Cursor, _BaseShape);

  _createClass(Cursor, {
    getClassName: {
      value: function getClassName() {
        return "cursor";
      }
    },
    _getAccessorList: {
      value: function _getAccessorList() {
        return { x: 0 };
      }
    },
    _getDefaults: {
      value: function _getDefaults() {
        return {
          color: "#000000",
          opacity: 1
        };
      }
    },
    render: {
      value: function render(renderingContext) {
        if (this.$el) {
          return this.$el;
        }

        this.$el = document.createElementNS(ns, "line");
        this.$el.setAttributeNS(null, "x", 0);
        this.$el.setAttributeNS(null, "y1", 0);
        this.$el.setAttributeNS(null, "y2", renderingContext.height);
        this.$el.setAttributeNS(null, "shape-rendering", "crispEdges");

        return this.$el;
      }
    },
    update: {
      value: function update(renderingContext, datum, index) {
        var x = renderingContext.timeToPixel(this.x(datum));
        var color = this.params.color;

        this.$el.setAttributeNS(null, "transform", "translate(" + x + ", 0)");
        this.$el.style.stroke = color;
      }
    },
    inArea: {

      // not selectable with a drag

      value: function inArea() {
        return false;
      }
    }
  });

  return Cursor;
})(BaseShape);

module.exports = Cursor;

},{"../core/namespace":10,"./base-shape":27,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],29:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseShape = _interopRequire(require("./base-shape"));

var Dot = (function (_BaseShape) {
  function Dot() {
    _classCallCheck(this, Dot);

    if (_BaseShape != null) {
      _BaseShape.apply(this, arguments);
    }
  }

  _inherits(Dot, _BaseShape);

  _createClass(Dot, {
    getClassName: {
      value: function getClassName() {
        return "dot";
      }
    },
    _getAccessorList: {

      // @TODO rename : confusion between accessors and meta-accessors

      value: function _getAccessorList() {
        return { cx: 0, cy: 0, r: 3, color: "#000000" };
      }
    },
    render: {
      value: function render() {
        if (this.$el) {
          return this.$el;
        }

        this.$el = document.createElementNS(this.ns, "circle");

        return this.$el;
      }
    },
    update: {
      value: function update(renderingContext, datum, index) {
        var cx = renderingContext.timeToPixel(this.cx(datum));
        var cy = renderingContext.valueToPixel(this.cy(datum));
        var r = this.r(datum);
        var color = this.color(datum);

        this.$el.setAttributeNS(null, "transform", "translate(" + cx + ", " + cy + ")");
        this.$el.setAttributeNS(null, "r", r);
        this.$el.style.fill = color;
      }
    },
    inArea: {

      // x1, x2, y1, y2 => in pixel domain

      value: function inArea(renderingContext, datum, x1, y1, x2, y2) {
        var cx = renderingContext.timeToPixel(this.cx(datum));
        var cy = renderingContext.valueToPixel(this.cy(datum));

        if (cx > x1 && cx < x2 && (cy > y1 && cy < y2)) {
          return true;
        }

        return false;
      }
    }
  });

  return Dot;
})(BaseShape);

module.exports = Dot;

},{"./base-shape":27,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],30:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseShape = _interopRequire(require("./base-shape"));

var Line = (function (_BaseShape) {
  function Line() {
    _classCallCheck(this, Line);

    if (_BaseShape != null) {
      _BaseShape.apply(this, arguments);
    }
  }

  _inherits(Line, _BaseShape);

  _createClass(Line, {
    getClassName: {
      value: function getClassName() {
        return "line";
      }
    },
    _getAccessorList: {
      value: function _getAccessorList() {
        return { cx: 0, cy: 0 };
      }
    },
    _getDefaults: {
      value: function _getDefaults() {
        return { color: "#000000" };
      }
    },
    render: {
      value: function render(renderingContext) {
        if (this.$el) {
          return this.$el;
        }

        this.$el = document.createElementNS(this.ns, "path");
        // this.el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        return this.$el;
      }
    },
    update: {
      value: function update(renderingContext, data) {
        var _this = this;

        data = data.slice(0);
        data.sort(function (a, b) {
          return _this.cx(a) < _this.cx(b) ? -1 : 1;
        });

        this.$el.setAttributeNS(null, "d", this._buildLine(renderingContext, data));
        this.$el.style.stroke = this.params.color;
        this.$el.style.fill = "none";

        data = null;
      }
    },
    _buildLine: {

      // builds the `path.d` attribute
      // @TODO create some ShapeHelper ?

      value: function _buildLine(renderingContext, data) {
        var _this = this;

        if (!data.length) {
          return "";
        }
        // sort data
        var instructions = data.map(function (datum, index) {
          var x = renderingContext.timeToPixel(_this.cx(datum));
          var y = renderingContext.valueToPixel(_this.cy(datum));
          return "" + x + "," + y;
        });

        return "M" + instructions.join("L");
      }
    }
  });

  return Line;
})(BaseShape);

module.exports = Line;

},{"./base-shape":27,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],31:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseShape = _interopRequire(require("./base-shape"));

var Marker = (function (_BaseShape) {
  function Marker() {
    _classCallCheck(this, Marker);

    if (_BaseShape != null) {
      _BaseShape.apply(this, arguments);
    }
  }

  _inherits(Marker, _BaseShape);

  _createClass(Marker, {
    getClassName: {
      value: function getClassName() {
        return "marker";
      }
    },
    _getAccessorList: {
      value: function _getAccessorList() {
        return { x: 0, color: "#000000" };
      }
    },
    _getDefaults: {
      value: function _getDefaults() {
        return {
          handlerWidth: 7,
          handlerHeight: 10,
          displayHandler: true,
          opacity: 1
        };
      }
    },
    render: {
      value: function render(renderingContext) {
        if (this.$el) {
          return this.$el;
        }

        var height = renderingContext.height;

        this.$el = document.createElementNS(this.ns, "g");
        this.$line = document.createElementNS(this.ns, "rect");

        // draw line
        this.$line.setAttributeNS(null, "x", 0);
        this.$line.setAttributeNS(null, "y", 0);
        this.$line.setAttributeNS(null, "width", 1);
        this.$line.setAttributeNS(null, "height", height);
        this.$line.setAttributeNS(null, "shape-rendering", "optimizeSpeed");

        this.$el.appendChild(this.$line);

        if (this.params.displayHandlers) {
          this.$handler = document.createElementNS(this.ns, "rect");

          this.$handler.setAttributeNS(null, "x", -((this.params.handlerWidth - 1) / 2));
          this.$handler.setAttributeNS(null, "y", renderingContext.height - this.params.handlerHeight);
          this.$handler.setAttributeNS(null, "width", this.params.handlerWidth);
          this.$handler.setAttributeNS(null, "height", this.params.handlerHeight);
          this.$handler.setAttributeNS(null, "shape-rendering", "crispEdges");

          this.$el.appendChild(this.$handler);
        }

        this.$el.style.opacity = this.params.opacity;

        return this.$el;
      }
    },
    update: {
      value: function update(renderingContext, datum, index) {
        var x = renderingContext.timeToPixel(this.x(datum)) - 0.5;
        var color = this.color(datum);

        this.$el.setAttributeNS(null, "transform", "translate(" + x + ", 0)");
        this.$line.style.fill = color;

        if (this.params.displayHandlers) {
          this.$handler.style.fill = color;
        }
      }
    },
    inArea: {
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
    }
  });

  return Marker;
})(BaseShape);

module.exports = Marker;

},{"./base-shape":27,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],32:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseShape = _interopRequire(require("./base-shape"));

var Segment = (function (_BaseShape) {
  function Segment() {
    _classCallCheck(this, Segment);

    if (_BaseShape != null) {
      _BaseShape.apply(this, arguments);
    }
  }

  _inherits(Segment, _BaseShape);

  _createClass(Segment, {
    getClassName: {
      value: function getClassName() {
        return "segment";
      }
    },
    _getAccessorList: {
      value: function _getAccessorList() {
        return { x: 0, y: 0, width: 0, height: 1, color: "#000000", opacity: 1 };
      }
    },
    _getDefaults: {
      value: function _getDefaults() {
        return {
          displayHandlers: true,
          handlerWidth: 2,
          handlerOpacity: 0.8,
          opacity: 0.6
        };
      }
    },
    render: {
      value: function render(renderingContext) {
        if (this.$el) {
          return this.$el;
        }

        this.$el = document.createElementNS(this.ns, "g");

        this.$segment = document.createElementNS(this.ns, "rect");
        this.$segment.classList.add("segment");
        this.$segment.style.opacity = this.params.opacity;
        this.$segment.setAttributeNS(null, "shape-rendering", "crispEdges");

        this.$el.appendChild(this.$segment);

        if (this.params.displayHandlers) {
          this.$leftHandler = document.createElementNS(this.ns, "rect");
          this.$leftHandler.classList.add("left", "handler");
          this.$leftHandler.setAttributeNS(null, "width", this.params.handlerWidth);
          this.$leftHandler.setAttributeNS(null, "shape-rendering", "crispEdges");
          this.$leftHandler.style.opacity = this.params.handlerOpacity;
          this.$leftHandler.style.cursor = "ew-resize";

          this.$rightHandler = document.createElementNS(this.ns, "rect");
          this.$rightHandler.classList.add("right", "handler");
          this.$rightHandler.setAttributeNS(null, "width", this.params.handlerWidth);
          this.$rightHandler.setAttributeNS(null, "shape-rendering", "crispEdges");
          this.$rightHandler.style.opacity = this.params.handlerOpacity;
          this.$rightHandler.style.cursor = "ew-resize";

          this.$el.appendChild(this.$leftHandler);
          this.$el.appendChild(this.$rightHandler);
        }

        return this.$el;
      }
    },
    update: {
      value: function update(renderingContext, datum, index) {
        var x = renderingContext.timeToPixel(this.x(datum));
        var y = renderingContext.valueToPixel(this.y(datum));
        var width = renderingContext.timeToPixel(this.width(datum));
        var height = renderingContext.valueToPixel(this.height(datum));
        var color = this.color(datum);
        var opacity = this.opacity(datum);

        this.$el.setAttributeNS(null, "transform", "translate(" + x + ", " + y + ")");
        this.$el.style.opacity = opacity;

        this.$segment.setAttributeNS(null, "width", Math.max(width, 0));
        this.$segment.setAttributeNS(null, "height", height);
        this.$segment.style.fill = color;

        if (this.params.displayHandlers) {
          // display handlers
          this.$leftHandler.setAttributeNS(null, "height", height);
          this.$leftHandler.setAttributeNS(null, "transform", "translate(0, 0)");
          this.$leftHandler.style.fill = color;

          var rightHandlerTranslate = "translate(" + (width - this.params.handlerWidth) + ", 0)";
          this.$rightHandler.setAttributeNS(null, "height", height);
          this.$rightHandler.setAttributeNS(null, "transform", rightHandlerTranslate);
          this.$rightHandler.style.fill = color;
        }
      }
    },
    inArea: {
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
    }
  });

  return Segment;
})(BaseShape);

module.exports = Segment;

},{"./base-shape":27,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],33:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseShape = _interopRequire(require("./base-shape"));

var TraceCommon = (function (_BaseShape) {
  function TraceCommon() {
    _classCallCheck(this, TraceCommon);

    if (_BaseShape != null) {
      _BaseShape.apply(this, arguments);
    }
  }

  _inherits(TraceCommon, _BaseShape);

  _createClass(TraceCommon, {
    getClassName: {
      value: function getClassName() {
        return "trace-common";
      }
    },
    _getAccessorList: {
      value: function _getAccessorList() {
        return { x: 0, mean: 0, range: 0 };
      }
    },
    _getDefaults: {
      value: function _getDefaults() {
        return {
          rangeColor: "steelblue",
          meanColor: "#232323",
          displayMean: true
        };
      }
    },
    render: {
      value: function render(renderingContext) {
        if (this.$el) {
          return this.$el;
        }
        this.$el = document.createElementNS(this.ns, "g");
        // range path
        this.$range = document.createElementNS(this.ns, "path");
        this.$el.appendChild(this.$range);

        // mean line
        if (this.params.displayMean) {
          this.$mean = document.createElementNS(this.ns, "path");
          this.$el.appendChild(this.$mean);
        }

        return this.$el;
      }
    },
    update: {
      value: function update(renderingContext, data) {
        var _this = this;

        // order data by x position
        data = data.slice(0);
        data.sort(function (a, b) {
          return _this.x(a) < _this.x(b) ? -1 : 1;
        });

        if (this.params.displayMean) {
          this.$mean.setAttributeNS(null, "d", this._buildMeanLine(renderingContext, data));
          this.$mean.setAttributeNS(null, "stroke", this.params.meanColor);
          this.$mean.setAttributeNS(null, "fill", "none");
        }

        this.$range.setAttributeNS(null, "d", this._buildRangeZone(renderingContext, data));
        this.$range.setAttributeNS(null, "stroke", "none");
        this.$range.setAttributeNS(null, "fill", this.params.rangeColor);
        this.$range.setAttributeNS(null, "opacity", "0.4");

        data = null;
      }
    },
    _buildMeanLine: {
      value: function _buildMeanLine(renderingContext, data) {
        var _this = this;

        var instructions = data.map(function (datum, index) {
          var x = renderingContext.timeToPixel(_this.x(datum));
          var y = renderingContext.valueToPixel(_this.mean(datum));
          return "" + x + "," + y;
        });

        return "M" + instructions.join("L");
      }
    },
    _buildRangeZone: {
      value: function _buildRangeZone(renderingContext, data) {
        var length = data.length;
        // const lastIndex = data
        var instructionsStart = "";
        var instructionsEnd = "";

        for (var i = 0; i < length; i++) {
          var datum = data[i];
          var mean = this.mean(datum);
          var halfRange = this.range(datum) / 2;

          var x = renderingContext.timeToPixel(this.x(datum));
          var y0 = renderingContext.valueToPixel(mean + halfRange);
          var y1 = renderingContext.valueToPixel(mean - halfRange);

          var start = "" + x + "," + y0;
          var end = "" + x + "," + y1;

          instructionsStart = instructionsStart === "" ? start : "" + instructionsStart + "L" + start;

          instructionsEnd = instructionsEnd === "" ? end : "" + end + "L" + instructionsEnd;
        }

        var instructions = "M" + instructionsStart + "L" + instructionsEnd + "Z";
        return instructions;
      }
    }
  });

  return TraceCommon;
})(BaseShape);

module.exports = TraceCommon;

},{"./base-shape":27,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],34:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseShape = _interopRequire(require("./base-shape"));

var TraceDots = (function (_BaseShape) {
  function TraceDots() {
    _classCallCheck(this, TraceDots);

    if (_BaseShape != null) {
      _BaseShape.apply(this, arguments);
    }
  }

  _inherits(TraceDots, _BaseShape);

  _createClass(TraceDots, {
    getClassName: {
      value: function getClassName() {
        return "trace-dots";
      }
    },
    _getAccessorList: {
      value: function _getAccessorList() {
        return { x: 0, mean: 0, range: 0 };
      }
    },
    _getDefaults: {
      value: function _getDefaults() {
        return {
          meanRadius: 3,
          rangeRadius: 3,
          meanColor: "#232323",
          rangeColor: "steelblue"
        };
      }
    },
    render: {
      value: function render(renderingContext) {
        if (this.$el) {
          return this.$el;
        }
        // container
        this.$el = document.createElementNS(this.ns, "g");
        // draw mean dot
        this.$mean = document.createElementNS(this.ns, "circle");
        this.$mean.setAttributeNS(null, "r", this.params.meanRadius);
        this.$mean.setAttributeNS(null, "stroke", this.params.meanColor);
        this.$mean.setAttributeNS(null, "fill", "transparent");
        this.$mean.classList.add("mean");
        // range dots (0 => top, 1 => bottom)
        this.$max = document.createElementNS(this.ns, "circle");
        this.$max.setAttributeNS(null, "r", this.params.meanRadius);
        this.$max.setAttributeNS(null, "stroke", this.params.rangeColor);
        this.$max.setAttributeNS(null, "fill", "transparent");
        this.$max.classList.add("max");

        this.$min = document.createElementNS(this.ns, "circle");
        this.$min.setAttributeNS(null, "r", this.params.meanRadius);
        this.$min.setAttributeNS(null, "stroke", this.params.rangeColor);
        this.$min.setAttributeNS(null, "fill", "transparent");
        this.$min.classList.add("min");

        this.$el.appendChild(this.$mean);
        this.$el.appendChild(this.$max);
        this.$el.appendChild(this.$min);

        return this.$el;
      }
    },
    update: {

      // @TODO use accessors

      value: function update(renderingContext, datum, index) {
        var mean = this.mean(datum);
        var range = this.range(datum);
        var x = this.x(datum);
        // y positions
        var meanPos = "" + renderingContext.yScale(mean);
        this.$mean.setAttributeNS(null, "transform", "translate(0, " + meanPos + ")");

        var halfRange = range / 2;
        var max = renderingContext.valueToPixel(mean + halfRange);
        var min = renderingContext.valueToPixel(mean - halfRange);
        var xPos = renderingContext.timeToPixel(x);

        this.$max.setAttributeNS(null, "transform", "translate(0, " + max + ")");
        this.$min.setAttributeNS(null, "transform", "translate(0, " + min + ")");
        this.$el.setAttributeNS(null, "transform", "translate(" + xPos + ", 0)");
      }
    }
  });

  return TraceDots;
})(BaseShape);

module.exports = TraceDots;

},{"./base-shape":27,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],35:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseShape = _interopRequire(require("./base-shape"));

var xhtmlNS = "http://www.w3.org/1999/xhtml";

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
  function Waveform() {
    _classCallCheck(this, Waveform);

    if (_BaseShape != null) {
      _BaseShape.apply(this, arguments);
    }
  }

  _inherits(Waveform, _BaseShape);

  _createClass(Waveform, {
    getClassName: {
      value: function getClassName() {
        return "waveform";
      }
    },
    _getAccessorList: {
      value: function _getAccessorList() {
        return { y: 0 };
      }
    },
    _getDefaults: {
      value: function _getDefaults() {
        return {
          sampleRate: 44100,
          color: "#000000",
          opacity: 1,
          renderingStrategy: "svg" // canvas is bugged (translation, etc...)
        };
      }
    },
    render: {
      value: function render(renderingContext) {
        if (this.$el) {
          return this.$el;
        }

        if (this.params.renderingStrategy === "svg") {

          this.$el = document.createElementNS(this.ns, "path");
          this.$el.setAttributeNS(null, "fill", "none");
          this.$el.setAttributeNS(null, "shape-rendering", "crispEdges");
          this.$el.setAttributeNS(null, "stroke", this.params.color);
          this.$el.style.opacity = this.params.opacity;
        } else if (this.params.renderingStrategy === "canvas") {

          this.$el = document.createElementNS(this.ns, "foreignObject");
          this.$el.setAttributeNS(null, "width", renderingContext.width);
          this.$el.setAttributeNS(null, "height", renderingContext.height);

          var canvas = document.createElementNS(xhtmlNS, "xhtml:canvas");

          this._ctx = canvas.getContext("2d");
          this._ctx.canvas.width = renderingContext.width;
          this._ctx.canvas.height = renderingContext.height;

          this.$el.appendChild(canvas);
        }

        return this.$el;
      }
    },
    update: {
      value: function update(renderingContext, datum, index) {
        var _this = this;

        // define nbr of samples per pixels
        var sliceMethod = datum instanceof Float32Array ? "subarray" : "slice";
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
        if (this.params.renderingStrategy === "svg") {

          var instructions = minMax.map(function (datum, index) {
            var x = Math.floor(renderingContext.timeToPixel(datum.time));
            var y1 = Math.round(renderingContext.valueToPixel(_this.y(datum.values[MIN])));
            var y2 = Math.round(renderingContext.valueToPixel(_this.y(datum.values[MAX])));

            return "" + x + "," + y1 + "L" + x + "," + y2;
          });

          var d = "M" + instructions.join("L");
          this.$el.setAttributeNS(null, "d", d);
        } else if (this.params.renderingStrategy === "canvas") {

          this._ctx.canvas.width = width;
          this.$el.setAttribute("width", width);
          // fix chrome bug with translate
          if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
            this.$el.setAttribute("x", renderingContext.offsetX);
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
    }
  });

  return Waveform;
})(BaseShape);

module.exports = Waveform;

},{"./base-shape":27,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],36:[function(require,module,exports){
/**
* `State` instances are used to define the application logic by precising specific user interaction cases, and how they impact the overal temporal representation.
* States manage interactions like zooming, browsing, or editing the timeline.
* Customized states should extend this BaseState.
*/
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var BaseState = (function () {
  function BaseState(timeline) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, BaseState);

    this.timeline = timeline;
  }

  _createClass(BaseState, {
    tracks: {

      /**
       * Get timeline views
       */

      get: function () {
        return this.timeline.tracks;
      }
    },
    layers: {

      /**
       * Get timeline layers
       */

      get: function () {
        return this.timeline.tracks.layers;
      }
    },
    enter: {

      /**
       * Called when the timeline is entering the state
       */

      value: function enter() {}
    },
    exit: {

      /**
       * Called when the timeline is leaving the state
       */

      value: function exit() {}
    },
    handleEvent: {

      /**
       * handle registered inputs from mouse and keyboard
       * @param {Event} e - the event to process
       */

      value: function handleEvent(e) {}
    }
  });

  return BaseState;
})();

module.exports = BaseState;

},{"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45}],37:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var ns = _interopRequire(require("../core/namespace"));

var BaseState = _interopRequire(require("./base-state"));

/**
 * Protools like zoom with zone selection
 * Press space bar to reset zoom default (1)
 * @TODO could also handle 'g' and 'h' key to zoom, de-zoom
 */

var BrushZoomState = (function (_BaseState) {
  function BrushZoomState(timeline) {
    _classCallCheck(this, BrushZoomState);

    _get(_core.Object.getPrototypeOf(BrushZoomState.prototype), "constructor", this).call(this, timeline);
  }

  _inherits(BrushZoomState, _BaseState);

  _createClass(BrushZoomState, {
    handleEvent: {
      value: function handleEvent(e) {
        switch (e.type) {
          case "mousedown":
            this.onMouseDown(e);
            break;
          case "mousemove":
            this.onMouseMove(e);
            break;
          case "mouseup":
            this.onMouseUp(e);
            break;
          case "keydown":
            this.onKeyDown(e);
            break;
        }
      }
    },
    onMouseDown: {
      value: function onMouseDown(e) {
        var _this = this;

        this.brushes = [];
        this.startX = e.x;
        // create brush in each containers
        this.tracks.forEach(function (track) {
          var interactions = track.$interactions;

          var brush = document.createElementNS(ns, "rect");
          brush.setAttributeNS(null, "height", track.height);
          brush.setAttributeNS(null, "y", 0);
          brush.style.fill = "#787878";
          brush.style.opacity = 0.2;

          interactions.appendChild(brush);

          _this.brushes.push(brush);
        });
      }
    },
    onMouseMove: {
      value: function onMouseMove(e) {
        // update brush
        var width = Math.abs(e.x - this.startX);
        var x = Math.min(e.x, this.startX);

        this.brushes.forEach(function (brush) {
          brush.setAttributeNS(null, "width", width);
          brush.setAttributeNS(null, "x", x);
        });
      }
    },
    onMouseUp: {
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
    },
    onKeyDown: {
      value: function onKeyDown(e) {
        // reset on space bar
        if (e.originalEvent.keyCode === 32) {
          this.timeline.offset = 0;
          this.timeline.zoom = 1;
          this.tracks.update();
        }
      }
    }
  });

  return BrushZoomState;
})(BaseState);

module.exports = BrushZoomState;

},{"../core/namespace":10,"./base-state":36,"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/get":47,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],38:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var d3Scale = _interopRequire(require("d3-scale"));

var BaseState = _interopRequire(require("./base-state"));

/**
 * `CenteredZoomState` is a timeline state that allows the user to browse the timeline by clicking on a track, and then
 * - moving down to zoom in
 * - moving up to zoom out
 * - moving left to move in time, after
 * - moving right to move in time, before
 */

var CenteredZoomState = (function (_BaseState) {
  function CenteredZoomState(timeline) {
    _classCallCheck(this, CenteredZoomState);

    _get(_core.Object.getPrototypeOf(CenteredZoomState.prototype), "constructor", this).call(this, timeline);
    this.currentLayer = null;
    // Set max/min zoom
    // maxZoom: 1px per sample
    // minZoom: 10 000 px per 1 hour
    // with a default to 44.1kHz sample rate
    this.maxZoom = 44100 * 1 / this.timeline.timeContext.pixelsPerSecond;
    this.minZoom = 10000 / 3600 / this.timeline.timeContext.pixelsPerSecond;
  }

  _inherits(CenteredZoomState, _BaseState);

  _createClass(CenteredZoomState, {
    handleEvent: {
      value: function handleEvent(e) {
        switch (e.type) {
          case "mousedown":
            this.onMouseDown(e);
            break;
          case "mousemove":
            this.onMouseMove(e);
            break;
          case "mouseup":
            this.onMouseUp(e);
            break;
        }
      }
    },
    onMouseDown: {
      value: function onMouseDown(e) {
        this.mouseDown = true; // is done in surface

        var actualZoom = this.timeline.timeContext.zoom;
        var initialY = e.y;

        this.valueToPixel = d3Scale.linear().domain([initialY, 0]).range([actualZoom, -2 * actualZoom]);
      }
    },
    onMouseMove: {
      value: function onMouseMove(e) {
        if (!this.mouseDown) {
          return;
        }

        var timeContext = this.timeline.timeContext;
        var lastCenterTime = timeContext.timeToPixel.invert(e.x);

        timeContext.zoom = Math.min(Math.max(this.valueToPixel(e.y), this.minZoom), this.maxZoom);

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
    },
    onMouseUp: {
      value: function onMouseUp(e) {
        this.mouseDown = false;
      }
    }
  });

  return CenteredZoomState;
})(BaseState);

module.exports = CenteredZoomState;

},{"./base-state":36,"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/get":47,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49,"d3-scale":54}],39:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseState = _interopRequire(require("./base-state"));

var TimeContextBehavior = _interopRequire(require("../behaviors/time-context-behavior"));

var ContextEditionState = (function (_BaseState) {
  function ContextEditionState(timeline) {
    _classCallCheck(this, ContextEditionState);

    _get(_core.Object.getPrototypeOf(ContextEditionState.prototype), "constructor", this).call(this, timeline);
  }

  _inherits(ContextEditionState, _BaseState);

  _createClass(ContextEditionState, {
    handleEvent: {
      value: function handleEvent(e) {
        switch (e.type) {
          case "mousedown":
            this.onMouseDown(e);
            break;
          case "mousemove":
            this.onMouseMove(e);
            break;
          case "mouseup":
            this.onMouseUp(e);
            break;
        }
      }
    },
    onMouseDown: {
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
    },
    onMouseMove: {
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
    },
    onMouseUp: {
      value: function onMouseUp(e) {
        this.mouseDown = false;
        this.currentTarget = null;
        this.currentLayer = null;
      }
    }
  });

  return ContextEditionState;
})(BaseState);

module.exports = ContextEditionState;

},{"../behaviors/time-context-behavior":6,"./base-state":36,"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/get":47,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],40:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseState = _interopRequire(require("./base-state"));

// works
// @NOTE => overlaps SelectionBehavior in some way...

var EditionState = (function (_BaseState) {
  function EditionState(timeline) {
    _classCallCheck(this, EditionState);

    _get(_core.Object.getPrototypeOf(EditionState.prototype), "constructor", this).call(this, timeline);

    this.currentEditedLayer = null;
    this.currentTarget = null;
  }

  _inherits(EditionState, _BaseState);

  _createClass(EditionState, {
    enter: {
      value: function enter() {}
    },
    exit: {
      value: function exit() {}
    },
    handleEvent: {
      value: function handleEvent(e) {
        switch (e.type) {
          case "mousedown":
            this.onMouseDown(e);
            break;
          case "mousemove":
            this.onMouseMove(e);
            break;
          case "mouseup":
            this.onMouseUp(e);
            break;
        }
      }
    },
    onMouseDown: {
      value: function onMouseDown(e) {
        var _this = this;

        this.mouseDown = true;
        // keep target consistent with mouse down
        // @NOTE: move this to Surface ?
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
    },
    onMouseMove: {
      value: function onMouseMove(e) {
        if (!this.mouseDown || !this.currentEditedLayer) {
          return;
        }

        var layer = this.currentEditedLayer;
        var items = layer.selectedItems;

        layer.edit(items, e.dx, e.dy, this.currentTarget);
        layer.update(items);
      }
    },
    onMouseUp: {
      value: function onMouseUp(e) {
        this.currentEditedLayer = null;
        this.mouseDown = false;
      }
    }
  });

  return EditionState;
})(BaseState);

module.exports = EditionState;

},{"./base-state":36,"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/get":47,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],41:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseState = _interopRequire(require("./base-state"));

var ns = _interopRequire(require("../core/namespace"));

/**
 *  @NOTE Broken
 */

var SelectionState = (function (_BaseState) {
  function SelectionState(timeline /*, options = {} */) {
    _classCallCheck(this, SelectionState);

    _get(_core.Object.getPrototypeOf(SelectionState.prototype), "constructor", this).call(this, timeline /*, options */);

    this.currentLayer = null;
    // need a cached
    this.selectedItems = null;
    this.mouseDown = false;
    this.shiftKey = false;
  }

  _inherits(SelectionState, _BaseState);

  _createClass(SelectionState, {
    enter: {
      value: function enter() {}
    },
    exit: {
      value: function exit() {
        var containers = this.timeline.containers;

        for (var id in containers) {
          this._removeBrush(containers[id]);
        }
      }
    },
    handleEvent: {
      value: function handleEvent(e) {
        switch (e.type) {
          case "mousedown":
            this.onMouseDown(e);
            break;
          case "mousemove":
            this.onMouseMove(e);
            break;
          case "mouseup":
            this.onMouseUp(e);
            break;
          case "click":
            this.onClick(e);
            break;
          case "keydown":
            this.onKey(e);
            break;
          case "keyup":
            this.onKey(e);
            break;
        }
      }
    },
    _addBrush: {
      value: function _addBrush(container) {
        if (container.brushElement !== null) {
          return;
        }

        var brush = document.createElementNS(ns, "rect");
        brush.style.fill = "#686868";
        brush.style.opacity = 0.2;

        container.interactionsElement.appendChild(brush);
        container.brushElement = brush;
      }
    },
    _removeBrush: {
      value: function _removeBrush(container) {
        if (container.brushElement === null) {
          return;
        }

        this._resetBrush(container.brushElement);
        container.interactionsElement.removeChild(container.brushElement);
        container.brushElement = null;
      }
    },
    _resetBrush: {
      value: function _resetBrush(container) {
        var brushElement = container.brushElement;
        // reset brush element
        brushElement.setAttributeNS(null, "transform", "translate(0, 0)");
        brushElement.setAttributeNS(null, "width", 0);
        brushElement.setAttributeNS(null, "height", 0);
      }
    },
    _updateBrush: {
      value: function _updateBrush(e, container) {
        var brushElement = container.brushElement;
        var translate = "translate(" + e.area.left + ", " + e.area.top + ")";

        brushElement.setAttributeNS(null, "transform", translate);
        brushElement.setAttributeNS(null, "width", e.area.width);
        brushElement.setAttributeNS(null, "height", e.area.height);
      }
    },
    onKey: {
      value: function onKey(e) {
        this.shiftKey = e.shiftKey;
      }
    },
    onMouseDown: {
      value: function onMouseDown(e) {
        this.mouseDown = true;

        var container = this.timeline.getContainerFromDOMElement(e.currentTarget);
        this.currentContainer = container;
        this._addBrush(container);

        var newLayer = undefined;
        // find the layer
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _core.$for.getIterator(this.layers), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var layer = _step.value;

            if (layer.hasItem(e.target)) {
              newLayer = layer;
              break;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"]) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (this.currentLayer && newLayer && newLayer !== this.currentLayer) {
          this.currentLayer.unselectAll();
        }

        if (newLayer && newLayer !== this.currentLayer) {
          this.currentLayer = newLayer;
        }

        if (!this.currentLayer) {
          return;
        }

        this.previousSelection = this.currentLayer.selectedItems.slice(0);
        // create brush
        if (!this.shiftKey) {
          this.currentLayer.unselect();
        }
      }
    },
    onMouseMove: {
      value: function onMouseMove(e) {
        var _this = this;

        if (!this.mouseDown) {
          return;
        }

        var container = this.timeline.getContainerFromDOMElement(this.currentLayer);
        // update brush
        this._updateBrush(e, this.currentContainer);

        if (this.currentLayer) {
          (function () {
            // select all dots in area
            var items = _this.currentLayer.getItemsInArea(e.area);
            var currentSelection = _this.currentLayer.selectedItems;
            // 1. select all items
            items.forEach(function (item) {
              return _this.currentLayer.select(item);
            });
            // handle shift key
            if (_this.shiftKey) {
              _this.previousSelection.forEach(function (item) {
                if (items.indexOf(item) !== -1) {
                  // 2.1  if the item was is not in item, unselect it
                  _this.currentLayer.unselect(item);
                } else {
                  // 2.2  else select it
                  _this.currentLayer.select(item);
                }
              });
            }

            // 3. if an item of the current selection is no more in the items
            //    and is not in previous selection, unselect it
            currentSelection.forEach(function (item) {
              if (items.indexOf(item) === -1 && _this.previousSelection.indexOf(item) === -1) {
                _this.currentLayer.unselect(item);
              }
            });
          })();
        }
      }
    },
    onMouseUp: {
      value: function onMouseUp(e) {
        if (!this.mouseDown) {
          return;
        }
        this.mouseDown = false;
        // reset brushElement
        this._resetBrush(this.currentContainer);
      }
    },
    onClick: {

      // @NOTE: 'mousedown' and 'mouseup' are called before 'click'

      value: function onClick(e) {
        if (!this.currentLayer) {
          return;
        }

        var item = this.currentLayer.hasItem(e.target);
        // if no item - unselect all
        if (this.previousSelection.length !== 0 && !this.shiftKey) {
          this.currentLayer.unselectAll();
        }

        // toggle otherwise
        if (item) {
          if (this.previousSelection.indexOf(item) === -1) {
            this.currentLayer.select(item);
          } else {
            this.currentLayer.unselect(item);
          }
        }
      }
    }
  });

  return SelectionState;
})(BaseState);

module.exports = SelectionState;

},{"../core/namespace":10,"./base-state":36,"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45,"babel-runtime/helpers/get":47,"babel-runtime/helpers/inherits":48,"babel-runtime/helpers/interop-require":49}],42:[function(require,module,exports){
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var OrthogonalData = (function () {
  function OrthogonalData() {
    _classCallCheck(this, OrthogonalData);

    this._cols = null; // object of arrays
    this._rows = null; // array of objects
  }

  _createClass(OrthogonalData, {
    _checkConsistency: {

      // verify that data are consistents

      value: function _checkConsistency() {
        var size = null;

        for (var key in this._cols) {
          var col = this._cols[key];
          var colLength = col.length;

          if (size !== null && size !== colLength) {
            throw new Error("" + this.prototype.constructor.name + ": inconsistent data");
          } else if (size === null) {
            size = colLength;
          }
        }
      }
    },
    updateFromCols: {
      value: function updateFromCols() {
        var _this = this;

        var keys = _core.Object.keys(this._cols);

        keys.forEach(function (key, i) {
          var col = _this._cols[key];

          col.forEach(function (value, index) {
            if (_this._rows[index] === undefined) _this._rows[index] = {};
            _this._rows[index][key] = value;
          });
        });

        this._checkConsistency();
      }
    },
    updateFromRows: {
      value: function updateFromRows() {
        var _this = this;

        this._rows.forEach(function (obj, index) {
          for (var key in obj) {
            if (index === 0) _this._cols[key] = [];
            _this._cols[key].push(obj[key]);
          }
        });

        this._checkConsistency();
      }
    },
    cols: {
      set: function (obj) {
        this._cols = obj;
        this._rows = [];

        this.updateFromCols();
      },
      get: function () {
        return this._cols;
      }
    },
    rows: {
      set: function (arr) {
        this._rows = arr;
        this._cols = {};

        this.updateFromRows();
      },
      get: function () {
        return this._rows;
      }
    }
  });

  return OrthogonalData;
})();

module.exports = OrthogonalData;

},{"babel-runtime/core-js":43,"babel-runtime/helpers/class-call-check":44,"babel-runtime/helpers/create-class":45}],43:[function(require,module,exports){
/**
 * Core.js 0.6.1
 * https://github.com/zloirock/core-js
 * License: http://rock.mit-license.org
 * © 2015 Denis Pushkarev
 */
!function(global, framework, undefined){
'use strict';

/******************************************************************************
 * Module : common                                                            *
 ******************************************************************************/

  // Shortcuts for [[Class]] & property names
var OBJECT          = 'Object'
  , FUNCTION        = 'Function'
  , ARRAY           = 'Array'
  , STRING          = 'String'
  , NUMBER          = 'Number'
  , REGEXP          = 'RegExp'
  , DATE            = 'Date'
  , MAP             = 'Map'
  , SET             = 'Set'
  , WEAKMAP         = 'WeakMap'
  , WEAKSET         = 'WeakSet'
  , SYMBOL          = 'Symbol'
  , PROMISE         = 'Promise'
  , MATH            = 'Math'
  , ARGUMENTS       = 'Arguments'
  , PROTOTYPE       = 'prototype'
  , CONSTRUCTOR     = 'constructor'
  , TO_STRING       = 'toString'
  , TO_STRING_TAG   = TO_STRING + 'Tag'
  , TO_LOCALE       = 'toLocaleString'
  , HAS_OWN         = 'hasOwnProperty'
  , FOR_EACH        = 'forEach'
  , ITERATOR        = 'iterator'
  , FF_ITERATOR     = '@@' + ITERATOR
  , PROCESS         = 'process'
  , CREATE_ELEMENT  = 'createElement'
  // Aliases global objects and prototypes
  , Function        = global[FUNCTION]
  , Object          = global[OBJECT]
  , Array           = global[ARRAY]
  , String          = global[STRING]
  , Number          = global[NUMBER]
  , RegExp          = global[REGEXP]
  , Date            = global[DATE]
  , Map             = global[MAP]
  , Set             = global[SET]
  , WeakMap         = global[WEAKMAP]
  , WeakSet         = global[WEAKSET]
  , Symbol          = global[SYMBOL]
  , Math            = global[MATH]
  , TypeError       = global.TypeError
  , RangeError      = global.RangeError
  , setTimeout      = global.setTimeout
  , setImmediate    = global.setImmediate
  , clearImmediate  = global.clearImmediate
  , parseInt        = global.parseInt
  , isFinite        = global.isFinite
  , process         = global[PROCESS]
  , nextTick        = process && process.nextTick
  , document        = global.document
  , html            = document && document.documentElement
  , navigator       = global.navigator
  , define          = global.define
  , console         = global.console || {}
  , ArrayProto      = Array[PROTOTYPE]
  , ObjectProto     = Object[PROTOTYPE]
  , FunctionProto   = Function[PROTOTYPE]
  , Infinity        = 1 / 0
  , DOT             = '.';

// http://jsperf.com/core-js-isobject
function isObject(it){
  return it !== null && (typeof it == 'object' || typeof it == 'function');
}
function isFunction(it){
  return typeof it == 'function';
}
// Native function?
var isNative = ctx(/./.test, /\[native code\]\s*\}\s*$/, 1);

// Object internal [[Class]] or toStringTag
// http://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring
var toString = ObjectProto[TO_STRING];
function setToStringTag(it, tag, stat){
  if(it && !has(it = stat ? it : it[PROTOTYPE], SYMBOL_TAG))hidden(it, SYMBOL_TAG, tag);
}
function cof(it){
  return toString.call(it).slice(8, -1);
}
function classof(it){
  var O, T;
  return it == undefined ? it === undefined ? 'Undefined' : 'Null'
    : typeof (T = (O = Object(it))[SYMBOL_TAG]) == 'string' ? T : cof(O);
}

// Function
var call  = FunctionProto.call
  , apply = FunctionProto.apply
  , REFERENCE_GET;
// Partial apply
function part(/* ...args */){
  var fn     = assertFunction(this)
    , length = arguments.length
    , args   = Array(length)
    , i      = 0
    , _      = path._
    , holder = false;
  while(length > i)if((args[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that    = this
      , _length = arguments.length
      , i = 0, j = 0, _args;
    if(!holder && !_length)return invoke(fn, args, that);
    _args = args.slice();
    if(holder)for(;length > i; i++)if(_args[i] === _)_args[i] = arguments[j++];
    while(_length > j)_args.push(arguments[j++]);
    return invoke(fn, _args, that);
  }
}
// Optional / simple context binding
function ctx(fn, that, length){
  assertFunction(fn);
  if(~length && that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    }
    case 2: return function(a, b){
      return fn.call(that, a, b);
    }
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    }
  } return function(/* ...args */){
      return fn.apply(that, arguments);
  }
}
// Fast apply
// http://jsperf.lnkit.com/fast-apply/5
function invoke(fn, args, that){
  var un = that === undefined;
  switch(args.length | 0){
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
}

// Object:
var create           = Object.create
  , getPrototypeOf   = Object.getPrototypeOf
  , setPrototypeOf   = Object.setPrototypeOf
  , defineProperty   = Object.defineProperty
  , defineProperties = Object.defineProperties
  , getOwnDescriptor = Object.getOwnPropertyDescriptor
  , getKeys          = Object.keys
  , getNames         = Object.getOwnPropertyNames
  , getSymbols       = Object.getOwnPropertySymbols
  , isFrozen         = Object.isFrozen
  , has              = ctx(call, ObjectProto[HAS_OWN], 2)
  // Dummy, fix for not array-like ES3 string in es5 module
  , ES5Object        = Object
  , Dict;
function toObject(it){
  return ES5Object(assertDefined(it));
}
function returnIt(it){
  return it;
}
function returnThis(){
  return this;
}
function get(object, key){
  if(has(object, key))return object[key];
}
function ownKeys(it){
  assertObject(it);
  return getSymbols ? getNames(it).concat(getSymbols(it)) : getNames(it);
}
// 19.1.2.1 Object.assign(target, source, ...)
var assign = Object.assign || function(target, source){
  var T = Object(assertDefined(target))
    , l = arguments.length
    , i = 1;
  while(l > i){
    var S      = ES5Object(arguments[i++])
      , keys   = getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)T[key = keys[j++]] = S[key];
  }
  return T;
}
function keyOf(object, el){
  var O      = toObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
}

// Array
// array('str1,str2,str3') => ['str1', 'str2', 'str3']
function array(it){
  return String(it).split(',');
}
var push    = ArrayProto.push
  , unshift = ArrayProto.unshift
  , slice   = ArrayProto.slice
  , splice  = ArrayProto.splice
  , indexOf = ArrayProto.indexOf
  , forEach = ArrayProto[FOR_EACH];
/*
 * 0 -> forEach
 * 1 -> map
 * 2 -> filter
 * 3 -> some
 * 4 -> every
 * 5 -> find
 * 6 -> findIndex
 */
function createArrayMethod(type){
  var isMap       = type == 1
    , isFilter    = type == 2
    , isSome      = type == 3
    , isEvery     = type == 4
    , isFindIndex = type == 6
    , noholes     = type == 5 || isFindIndex;
  return function(callbackfn/*, that = undefined */){
    var O      = Object(assertDefined(this))
      , that   = arguments[1]
      , self   = ES5Object(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = isMap ? Array(length) : isFilter ? [] : undefined
      , val, res;
    for(;length > index; index++)if(noholes || index in self){
      val = self[index];
      res = f(val, index, O);
      if(type){
        if(isMap)result[index] = res;             // map
        else if(res)switch(type){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(isEvery)return false;           // every
      }
    }
    return isFindIndex ? -1 : isSome || isEvery ? isEvery : result;
  }
}
function createArrayContains(isContains){
  return function(el /*, fromIndex = 0 */){
    var O      = toObject(this)
      , length = toLength(O.length)
      , index  = toIndex(arguments[1], length);
    if(isContains && el != el){
      for(;length > index; index++)if(sameNaN(O[index]))return isContains || index;
    } else for(;length > index; index++)if(isContains || index in O){
      if(O[index] === el)return isContains || index;
    } return !isContains && -1;
  }
}
function generic(A, B){
  // strange IE quirks mode bug -> use typeof vs isFunction
  return typeof A == 'function' ? A : B;
}

// Math
var MAX_SAFE_INTEGER = 0x1fffffffffffff // pow(2, 53) - 1 == 9007199254740991
  , pow    = Math.pow
  , abs    = Math.abs
  , ceil   = Math.ceil
  , floor  = Math.floor
  , max    = Math.max
  , min    = Math.min
  , random = Math.random
  , trunc  = Math.trunc || function(it){
      return (it > 0 ? floor : ceil)(it);
    }
// 20.1.2.4 Number.isNaN(number)
function sameNaN(number){
  return number != number;
}
// 7.1.4 ToInteger
function toInteger(it){
  return isNaN(it) ? 0 : trunc(it);
}
// 7.1.15 ToLength
function toLength(it){
  return it > 0 ? min(toInteger(it), MAX_SAFE_INTEGER) : 0;
}
function toIndex(index, length){
  var index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
}
function lz(num){
  return num > 9 ? num : '0' + num;
}

function createReplacer(regExp, replace, isStatic){
  var replacer = isObject(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(isStatic ? it : this).replace(regExp, replacer);
  }
}
function createPointAt(toString){
  return function(pos){
    var s = String(assertDefined(this))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return toString ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? toString ? s.charAt(i) : a
      : toString ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  }
}

// Assertion & errors
var REDUCE_ERROR = 'Reduce of empty object with no initial value';
function assert(condition, msg1, msg2){
  if(!condition)throw TypeError(msg2 ? msg1 + msg2 : msg1);
}
function assertDefined(it){
  if(it == undefined)throw TypeError('Function called on null or undefined');
  return it;
}
function assertFunction(it){
  assert(isFunction(it), it, ' is not a function!');
  return it;
}
function assertObject(it){
  assert(isObject(it), it, ' is not an object!');
  return it;
}
function assertInstance(it, Constructor, name){
  assert(it instanceof Constructor, name, ": use the 'new' operator!");
}

// Property descriptors & Symbol
function descriptor(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  }
}
function simpleSet(object, key, value){
  object[key] = value;
  return object;
}
function createDefiner(bitmap){
  return DESC ? function(object, key, value){
    return defineProperty(object, key, descriptor(bitmap, value));
  } : simpleSet;
}
function uid(key){
  return SYMBOL + '(' + key + ')_' + (++sid + random())[TO_STRING](36);
}
function getWellKnownSymbol(name, setter){
  return (Symbol && Symbol[name]) || (setter ? Symbol : safeSymbol)(SYMBOL + DOT + name);
}
// The engine works fine with descriptors? Thank's IE8 for his funny defineProperty.
var DESC = !!function(){
      try {
        return defineProperty({}, 'a', {get: function(){ return 2 }}).a == 2;
      } catch(e){}
    }()
  , sid    = 0
  , hidden = createDefiner(1)
  , set    = Symbol ? simpleSet : hidden
  , safeSymbol = Symbol || uid;
function assignHidden(target, src){
  for(var key in src)hidden(target, key, src[key]);
  return target;
}

var SYMBOL_UNSCOPABLES = getWellKnownSymbol('unscopables')
  , ArrayUnscopables   = ArrayProto[SYMBOL_UNSCOPABLES] || {}
  , SYMBOL_TAG         = getWellKnownSymbol(TO_STRING_TAG)
  , SYMBOL_SPECIES     = getWellKnownSymbol('species')
  , SYMBOL_ITERATOR;
function setSpecies(C){
  if(DESC && (framework || !isNative(C)))defineProperty(C, SYMBOL_SPECIES, {
    configurable: true,
    get: returnThis
  });
}

/******************************************************************************
 * Module : common.export                                                     *
 ******************************************************************************/

var NODE = cof(process) == PROCESS
  , core = {}
  , path = framework ? global : core
  , old  = global.core
  , exportGlobal
  // type bitmap
  , FORCED = 1
  , GLOBAL = 2
  , STATIC = 4
  , PROTO  = 8
  , BIND   = 16
  , WRAP   = 32;
function $define(type, name, source){
  var key, own, out, exp
    , isGlobal = type & GLOBAL
    , target   = isGlobal ? global : (type & STATIC)
        ? global[name] : (global[name] || ObjectProto)[PROTOTYPE]
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // there is a similar native
    own = !(type & FORCED) && target && key in target
      && (!isFunction(target[key]) || isNative(target[key]));
    // export native or passed
    out = (own ? target : source)[key];
    // prevent global pollution for namespaces
    if(!framework && isGlobal && !isFunction(target[key]))exp = source[key];
    // bind timers to global for call from export context
    else if(type & BIND && own)exp = ctx(out, global);
    // wrap global constructors for prevent change them in library
    else if(type & WRAP && !framework && target[key] == out){
      exp = function(param){
        return this instanceof out ? new out(param) : out(param);
      }
      exp[PROTOTYPE] = out[PROTOTYPE];
    } else exp = type & PROTO && isFunction(out) ? ctx(call, out) : out;
    // extend global
    if(framework && target && !own){
      if(isGlobal)target[key] = out;
      else delete target[key] && hidden(target, key, out);
    }
    // export
    if(exports[key] != out)hidden(exports, key, exp);
  }
}
// CommonJS export
if(typeof module != 'undefined' && module.exports)module.exports = core;
// RequireJS export
else if(isFunction(define) && define.amd)define(function(){return core});
// Export to global object
else exportGlobal = true;
if(exportGlobal || framework){
  core.noConflict = function(){
    global.core = old;
    return core;
  }
  global.core = core;
}

/******************************************************************************
 * Module : common.iterators                                                  *
 ******************************************************************************/

SYMBOL_ITERATOR = getWellKnownSymbol(ITERATOR);
var ITER  = safeSymbol('iter')
  , KEY   = 1
  , VALUE = 2
  , Iterators = {}
  , IteratorPrototype = {}
    // Safari has byggy iterators w/o `next`
  , BUGGY_ITERATORS = 'keys' in ArrayProto && !('next' in [].keys());
// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
setIterator(IteratorPrototype, returnThis);
function setIterator(O, value){
  hidden(O, SYMBOL_ITERATOR, value);
  // Add iterator for FF iterator protocol
  FF_ITERATOR in ArrayProto && hidden(O, FF_ITERATOR, value);
}
function createIterator(Constructor, NAME, next, proto){
  Constructor[PROTOTYPE] = create(proto || IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
}
function defineIterator(Constructor, NAME, value, DEFAULT){
  var proto = Constructor[PROTOTYPE]
    , iter  = get(proto, SYMBOL_ITERATOR) || get(proto, FF_ITERATOR) || (DEFAULT && get(proto, DEFAULT)) || value;
  if(framework){
    // Define iterator
    setIterator(proto, iter);
    if(iter !== value){
      var iterProto = getPrototypeOf(iter.call(new Constructor));
      // Set @@toStringTag to native iterators
      setToStringTag(iterProto, NAME + ' Iterator', true);
      // FF fix
      has(proto, FF_ITERATOR) && setIterator(iterProto, returnThis);
    }
  }
  // Plug for library
  Iterators[NAME] = iter;
  // FF & v8 fix
  Iterators[NAME + ' Iterator'] = returnThis;
  return iter;
}
function defineStdIterators(Base, NAME, Constructor, next, DEFAULT, IS_SET){
  function createIter(kind){
    return function(){
      return new Constructor(this, kind);
    }
  }
  createIterator(Constructor, NAME, next);
  var entries = createIter(KEY+VALUE)
    , values  = createIter(VALUE);
  if(DEFAULT == VALUE)values = defineIterator(Base, NAME, values, 'values');
  else entries = defineIterator(Base, NAME, entries, 'entries');
  if(DEFAULT){
    $define(PROTO + FORCED * BUGGY_ITERATORS, NAME, {
      entries: entries,
      keys: IS_SET ? values : createIter(KEY),
      values: values
    });
  }
}
function iterResult(done, value){
  return {value: value, done: !!done};
}
function isIterable(it){
  var O      = Object(it)
    , Symbol = global[SYMBOL]
    , hasExt = (Symbol && Symbol[ITERATOR] || FF_ITERATOR) in O;
  return hasExt || SYMBOL_ITERATOR in O || has(Iterators, classof(O));
}
function getIterator(it){
  var Symbol  = global[SYMBOL]
    , ext     = it[Symbol && Symbol[ITERATOR] || FF_ITERATOR]
    , getIter = ext || it[SYMBOL_ITERATOR] || Iterators[classof(it)];
  return assertObject(getIter.call(it));
}
function stepCall(fn, value, entries){
  return entries ? invoke(fn, value) : fn(value);
}
function checkDangerIterClosing(fn){
  var danger = true;
  var O = {
    next: function(){ throw 1 },
    'return': function(){ danger = false }
  };
  O[SYMBOL_ITERATOR] = returnThis;
  try {
    fn(O);
  } catch(e){}
  return danger;
}
function closeIterator(iterator){
  var ret = iterator['return'];
  if(ret !== undefined)ret.call(iterator);
}
function safeIterClose(exec, iterator){
  try {
    exec(iterator);
  } catch(e){
    closeIterator(iterator);
    throw e;
  }
}
function forOf(iterable, entries, fn, that){
  safeIterClose(function(iterator){
    var f = ctx(fn, that, entries ? 2 : 1)
      , step;
    while(!(step = iterator.next()).done)if(stepCall(f, step.value, entries) === false){
      return closeIterator(iterator);
    }
  }, getIterator(iterable));
}

/******************************************************************************
 * Module : es6.symbol                                                        *
 ******************************************************************************/

// ECMAScript 6 symbols shim
!function(TAG, SymbolRegistry, AllSymbols, setter){
  // 19.4.1.1 Symbol([description])
  if(!isNative(Symbol)){
    Symbol = function(description){
      assert(!(this instanceof Symbol), SYMBOL + ' is not a ' + CONSTRUCTOR);
      var tag = uid(description)
        , sym = set(create(Symbol[PROTOTYPE]), TAG, tag);
      AllSymbols[tag] = sym;
      DESC && setter && defineProperty(ObjectProto, tag, {
        configurable: true,
        set: function(value){
          hidden(this, tag, value);
        }
      });
      return sym;
    }
    hidden(Symbol[PROTOTYPE], TO_STRING, function(){
      return this[TAG];
    });
  }
  $define(GLOBAL + WRAP, {Symbol: Symbol});
  
  var symbolStatics = {
    // 19.4.2.1 Symbol.for(key)
    'for': function(key){
      return has(SymbolRegistry, key += '')
        ? SymbolRegistry[key]
        : SymbolRegistry[key] = Symbol(key);
    },
    // 19.4.2.4 Symbol.iterator
    iterator: SYMBOL_ITERATOR || getWellKnownSymbol(ITERATOR),
    // 19.4.2.5 Symbol.keyFor(sym)
    keyFor: part.call(keyOf, SymbolRegistry),
    // 19.4.2.10 Symbol.species
    species: SYMBOL_SPECIES,
    // 19.4.2.13 Symbol.toStringTag
    toStringTag: SYMBOL_TAG = getWellKnownSymbol(TO_STRING_TAG, true),
    // 19.4.2.14 Symbol.unscopables
    unscopables: SYMBOL_UNSCOPABLES,
    pure: safeSymbol,
    set: set,
    useSetter: function(){setter = true},
    useSimple: function(){setter = false}
  };
  // 19.4.2.2 Symbol.hasInstance
  // 19.4.2.3 Symbol.isConcatSpreadable
  // 19.4.2.6 Symbol.match
  // 19.4.2.8 Symbol.replace
  // 19.4.2.9 Symbol.search
  // 19.4.2.11 Symbol.split
  // 19.4.2.12 Symbol.toPrimitive
  forEach.call(array('hasInstance,isConcatSpreadable,match,replace,search,split,toPrimitive'),
    function(it){
      symbolStatics[it] = getWellKnownSymbol(it);
    }
  );
  $define(STATIC, SYMBOL, symbolStatics);
  
  setToStringTag(Symbol, SYMBOL);
  
  $define(STATIC + FORCED * !isNative(Symbol), OBJECT, {
    // 19.1.2.7 Object.getOwnPropertyNames(O)
    getOwnPropertyNames: function(it){
      var names = getNames(toObject(it)), result = [], key, i = 0;
      while(names.length > i)has(AllSymbols, key = names[i++]) || result.push(key);
      return result;
    },
    // 19.1.2.8 Object.getOwnPropertySymbols(O)
    getOwnPropertySymbols: function(it){
      var names = getNames(toObject(it)), result = [], key, i = 0;
      while(names.length > i)has(AllSymbols, key = names[i++]) && result.push(AllSymbols[key]);
      return result;
    }
  });
  
  // 20.2.1.9 Math[@@toStringTag]
  setToStringTag(Math, MATH, true);
  // 24.3.3 JSON[@@toStringTag]
  setToStringTag(global.JSON, 'JSON', true);
}(safeSymbol('tag'), {}, {}, true);

/******************************************************************************
 * Module : es6.object.statics                                                *
 ******************************************************************************/

!function(){
  var objectStatic = {
    // 19.1.3.1 Object.assign(target, source)
    assign: assign,
    // 19.1.3.10 Object.is(value1, value2)
    is: function(x, y){
      return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
    }
  };
  // 19.1.3.19 Object.setPrototypeOf(O, proto)
  // Works with __proto__ only. Old v8 can't works with null proto objects.
  '__proto__' in ObjectProto && function(buggy, set){
    try {
      set = ctx(call, getOwnDescriptor(ObjectProto, '__proto__').set, 2);
      set({}, ArrayProto);
    } catch(e){ buggy = true }
    objectStatic.setPrototypeOf = setPrototypeOf = setPrototypeOf || function(O, proto){
      assertObject(O);
      assert(proto === null || isObject(proto), proto, ": can't set as prototype!");
      if(buggy)O.__proto__ = proto;
      else set(O, proto);
      return O;
    }
  }();
  $define(STATIC, OBJECT, objectStatic);
}();

/******************************************************************************
 * Module : es6.object.statics-accept-primitives                              *
 ******************************************************************************/

!function(){
  // Object static methods accept primitives
  function wrapObjectMethod(key, MODE){
    var fn  = Object[key]
      , exp = core[OBJECT][key]
      , f   = 0
      , o   = {};
    if(!exp || isNative(exp)){
      o[key] = MODE == 1 ? function(it){
        return isObject(it) ? fn(it) : it;
      } : MODE == 2 ? function(it){
        return isObject(it) ? fn(it) : true;
      } : MODE == 3 ? function(it){
        return isObject(it) ? fn(it) : false;
      } : MODE == 4 ? function(it, key){
        return fn(toObject(it), key);
      } : function(it){
        return fn(toObject(it));
      };
      try { fn(DOT) }
      catch(e){ f = 1 }
      $define(STATIC + FORCED * f, OBJECT, o);
    }
  }
  wrapObjectMethod('freeze', 1);
  wrapObjectMethod('seal', 1);
  wrapObjectMethod('preventExtensions', 1);
  wrapObjectMethod('isFrozen', 2);
  wrapObjectMethod('isSealed', 2);
  wrapObjectMethod('isExtensible', 3);
  wrapObjectMethod('getOwnPropertyDescriptor', 4);
  wrapObjectMethod('getPrototypeOf');
  wrapObjectMethod('keys');
  wrapObjectMethod('getOwnPropertyNames');
}();

/******************************************************************************
 * Module : es6.number.statics                                                *
 ******************************************************************************/

!function(isInteger){
  $define(STATIC, NUMBER, {
    // 20.1.2.1 Number.EPSILON
    EPSILON: pow(2, -52),
    // 20.1.2.2 Number.isFinite(number)
    isFinite: function(it){
      return typeof it == 'number' && isFinite(it);
    },
    // 20.1.2.3 Number.isInteger(number)
    isInteger: isInteger,
    // 20.1.2.4 Number.isNaN(number)
    isNaN: sameNaN,
    // 20.1.2.5 Number.isSafeInteger(number)
    isSafeInteger: function(number){
      return isInteger(number) && abs(number) <= MAX_SAFE_INTEGER;
    },
    // 20.1.2.6 Number.MAX_SAFE_INTEGER
    MAX_SAFE_INTEGER: MAX_SAFE_INTEGER,
    // 20.1.2.10 Number.MIN_SAFE_INTEGER
    MIN_SAFE_INTEGER: -MAX_SAFE_INTEGER,
    // 20.1.2.12 Number.parseFloat(string)
    parseFloat: parseFloat,
    // 20.1.2.13 Number.parseInt(string, radix)
    parseInt: parseInt
  });
// 20.1.2.3 Number.isInteger(number)
}(Number.isInteger || function(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
});

/******************************************************************************
 * Module : es6.math                                                          *
 ******************************************************************************/

// ECMAScript 6 shim
!function(){
  // 20.2.2.28 Math.sign(x)
  var E    = Math.E
    , exp  = Math.exp
    , log  = Math.log
    , sqrt = Math.sqrt
    , sign = Math.sign || function(x){
        return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
      };
  
  // 20.2.2.5 Math.asinh(x)
  function asinh(x){
    return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log(x + sqrt(x * x + 1));
  }
  // 20.2.2.14 Math.expm1(x)
  function expm1(x){
    return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1;
  }
    
  $define(STATIC, MATH, {
    // 20.2.2.3 Math.acosh(x)
    acosh: function(x){
      return (x = +x) < 1 ? NaN : isFinite(x) ? log(x / E + sqrt(x + 1) * sqrt(x - 1) / E) + 1 : x;
    },
    // 20.2.2.5 Math.asinh(x)
    asinh: asinh,
    // 20.2.2.7 Math.atanh(x)
    atanh: function(x){
      return (x = +x) == 0 ? x : log((1 + x) / (1 - x)) / 2;
    },
    // 20.2.2.9 Math.cbrt(x)
    cbrt: function(x){
      return sign(x = +x) * pow(abs(x), 1 / 3);
    },
    // 20.2.2.11 Math.clz32(x)
    clz32: function(x){
      return (x >>>= 0) ? 32 - x[TO_STRING](2).length : 32;
    },
    // 20.2.2.12 Math.cosh(x)
    cosh: function(x){
      return (exp(x = +x) + exp(-x)) / 2;
    },
    // 20.2.2.14 Math.expm1(x)
    expm1: expm1,
    // 20.2.2.16 Math.fround(x)
    // TODO: fallback for IE9-
    fround: function(x){
      return new Float32Array([x])[0];
    },
    // 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
    hypot: function(value1, value2){
      var sum  = 0
        , len1 = arguments.length
        , len2 = len1
        , args = Array(len1)
        , larg = -Infinity
        , arg;
      while(len1--){
        arg = args[len1] = +arguments[len1];
        if(arg == Infinity || arg == -Infinity)return Infinity;
        if(arg > larg)larg = arg;
      }
      larg = arg || 1;
      while(len2--)sum += pow(args[len2] / larg, 2);
      return larg * sqrt(sum);
    },
    // 20.2.2.18 Math.imul(x, y)
    imul: function(x, y){
      var UInt16 = 0xffff
        , xn = +x
        , yn = +y
        , xl = UInt16 & xn
        , yl = UInt16 & yn;
      return 0 | xl * yl + ((UInt16 & xn >>> 16) * yl + xl * (UInt16 & yn >>> 16) << 16 >>> 0);
    },
    // 20.2.2.20 Math.log1p(x)
    log1p: function(x){
      return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log(1 + x);
    },
    // 20.2.2.21 Math.log10(x)
    log10: function(x){
      return log(x) / Math.LN10;
    },
    // 20.2.2.22 Math.log2(x)
    log2: function(x){
      return log(x) / Math.LN2;
    },
    // 20.2.2.28 Math.sign(x)
    sign: sign,
    // 20.2.2.30 Math.sinh(x)
    sinh: function(x){
      return (abs(x = +x) < 1) ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (E / 2);
    },
    // 20.2.2.33 Math.tanh(x)
    tanh: function(x){
      var a = expm1(x = +x)
        , b = expm1(-x);
      return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
    },
    // 20.2.2.34 Math.trunc(x)
    trunc: trunc
  });
}();

/******************************************************************************
 * Module : es6.string                                                        *
 ******************************************************************************/

!function(fromCharCode){
  function assertNotRegExp(it){
    if(cof(it) == REGEXP)throw TypeError();
  }
  
  $define(STATIC, STRING, {
    // 21.1.2.2 String.fromCodePoint(...codePoints)
    fromCodePoint: function(x){
      var res = []
        , len = arguments.length
        , i   = 0
        , code
      while(len > i){
        code = +arguments[i++];
        if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
        res.push(code < 0x10000
          ? fromCharCode(code)
          : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
        );
      } return res.join('');
    },
    // 21.1.2.4 String.raw(callSite, ...substitutions)
    raw: function(callSite){
      var raw = toObject(callSite.raw)
        , len = toLength(raw.length)
        , sln = arguments.length
        , res = []
        , i   = 0;
      while(len > i){
        res.push(String(raw[i++]));
        if(i < sln)res.push(String(arguments[i]));
      } return res.join('');
    }
  });
  
  $define(PROTO, STRING, {
    // 21.1.3.3 String.prototype.codePointAt(pos)
    codePointAt: createPointAt(false),
    // 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
    endsWith: function(searchString /*, endPosition = @length */){
      assertNotRegExp(searchString);
      var that = String(assertDefined(this))
        , endPosition = arguments[1]
        , len = toLength(that.length)
        , end = endPosition === undefined ? len : min(toLength(endPosition), len);
      searchString += '';
      return that.slice(end - searchString.length, end) === searchString;
    },
    // 21.1.3.7 String.prototype.includes(searchString, position = 0)
    includes: function(searchString /*, position = 0 */){
      assertNotRegExp(searchString);
      return !!~String(assertDefined(this)).indexOf(searchString, arguments[1]);
    },
    // 21.1.3.13 String.prototype.repeat(count)
    repeat: function(count){
      var str = String(assertDefined(this))
        , res = ''
        , n   = toInteger(count);
      if(0 > n || n == Infinity)throw RangeError("Count can't be negative");
      for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
      return res;
    },
    // 21.1.3.18 String.prototype.startsWith(searchString [, position ])
    startsWith: function(searchString /*, position = 0 */){
      assertNotRegExp(searchString);
      var that  = String(assertDefined(this))
        , index = toLength(min(arguments[1], that.length));
      searchString += '';
      return that.slice(index, index + searchString.length) === searchString;
    }
  });
}(String.fromCharCode);

/******************************************************************************
 * Module : es6.array.statics                                                 *
 ******************************************************************************/

!function(){
  $define(STATIC + FORCED * checkDangerIterClosing(Array.from), ARRAY, {
    // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
    from: function(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
      var O       = Object(assertDefined(arrayLike))
        , mapfn   = arguments[1]
        , mapping = mapfn !== undefined
        , f       = mapping ? ctx(mapfn, arguments[2], 2) : undefined
        , index   = 0
        , length, result, step;
      if(isIterable(O)){
        result = new (generic(this, Array));
        safeIterClose(function(iterator){
          for(; !(step = iterator.next()).done; index++){
            result[index] = mapping ? f(step.value, index) : step.value;
          }
        }, getIterator(O));
      } else {
        result = new (generic(this, Array))(length = toLength(O.length));
        for(; length > index; index++){
          result[index] = mapping ? f(O[index], index) : O[index];
        }
      }
      result.length = index;
      return result;
    }
  });
  
  $define(STATIC, ARRAY, {
    // 22.1.2.3 Array.of( ...items)
    of: function(/* ...args */){
      var index  = 0
        , length = arguments.length
        , result = new (generic(this, Array))(length);
      while(length > index)result[index] = arguments[index++];
      result.length = length;
      return result;
    }
  });
  
  setSpecies(Array);
}();

/******************************************************************************
 * Module : es6.array.prototype                                               *
 ******************************************************************************/

!function(){
  $define(PROTO, ARRAY, {
    // 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
    copyWithin: function(target /* = 0 */, start /* = 0, end = @length */){
      var O     = Object(assertDefined(this))
        , len   = toLength(O.length)
        , to    = toIndex(target, len)
        , from  = toIndex(start, len)
        , end   = arguments[2]
        , fin   = end === undefined ? len : toIndex(end, len)
        , count = min(fin - from, len - to)
        , inc   = 1;
      if(from < to && to < from + count){
        inc  = -1;
        from = from + count - 1;
        to   = to + count - 1;
      }
      while(count-- > 0){
        if(from in O)O[to] = O[from];
        else delete O[to];
        to += inc;
        from += inc;
      } return O;
    },
    // 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
    fill: function(value /*, start = 0, end = @length */){
      var O      = Object(assertDefined(this))
        , length = toLength(O.length)
        , index  = toIndex(arguments[1], length)
        , end    = arguments[2]
        , endPos = end === undefined ? length : toIndex(end, length);
      while(endPos > index)O[index++] = value;
      return O;
    },
    // 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
    find: createArrayMethod(5),
    // 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
    findIndex: createArrayMethod(6)
  });
  
  if(framework){
    // 22.1.3.31 Array.prototype[@@unscopables]
    forEach.call(array('find,findIndex,fill,copyWithin,entries,keys,values'), function(it){
      ArrayUnscopables[it] = true;
    });
    SYMBOL_UNSCOPABLES in ArrayProto || hidden(ArrayProto, SYMBOL_UNSCOPABLES, ArrayUnscopables);
  }
}();

/******************************************************************************
 * Module : es6.iterators                                                     *
 ******************************************************************************/

!function(at){
  // 22.1.3.4 Array.prototype.entries()
  // 22.1.3.13 Array.prototype.keys()
  // 22.1.3.29 Array.prototype.values()
  // 22.1.3.30 Array.prototype[@@iterator]()
  defineStdIterators(Array, ARRAY, function(iterated, kind){
    set(this, ITER, {o: toObject(iterated), i: 0, k: kind});
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
  }, function(){
    var iter  = this[ITER]
      , O     = iter.o
      , kind  = iter.k
      , index = iter.i++;
    if(!O || index >= O.length){
      iter.o = undefined;
      return iterResult(1);
    }
    if(kind == KEY)  return iterResult(0, index);
    if(kind == VALUE)return iterResult(0, O[index]);
                     return iterResult(0, [index, O[index]]);
  }, VALUE);
  
  // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
  Iterators[ARGUMENTS] = Iterators[ARRAY];
  
  // 21.1.3.27 String.prototype[@@iterator]()
  defineStdIterators(String, STRING, function(iterated){
    set(this, ITER, {o: String(iterated), i: 0});
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
  }, function(){
    var iter  = this[ITER]
      , O     = iter.o
      , index = iter.i
      , point;
    if(index >= O.length)return iterResult(1);
    point = at.call(O, index);
    iter.i += point.length;
    return iterResult(0, point);
  });
}(createPointAt(true));

/******************************************************************************
 * Module : web.immediate                                                     *
 ******************************************************************************/

// setImmediate shim
// Node.js 0.9+ & IE10+ has setImmediate, else:
isFunction(setImmediate) && isFunction(clearImmediate) || function(ONREADYSTATECHANGE){
  var postMessage      = global.postMessage
    , addEventListener = global.addEventListener
    , MessageChannel   = global.MessageChannel
    , counter          = 0
    , queue            = {}
    , defer, channel, port;
  setImmediate = function(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(isFunction(fn) ? fn : Function(fn), args);
    }
    defer(counter);
    return counter;
  }
  clearImmediate = function(id){
    delete queue[id];
  }
  function run(id){
    if(has(queue, id)){
      var fn = queue[id];
      delete queue[id];
      fn();
    }
  }
  function listner(event){
    run(event.data);
  }
  // Node.js 0.8-
  if(NODE){
    defer = function(id){
      nextTick(part.call(run, id));
    }
  // Modern browsers, skip implementation for WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is object
  } else if(addEventListener && isFunction(postMessage) && !global.importScripts){
    defer = function(id){
      postMessage(id, '*');
    }
    addEventListener('message', listner, false);
  // WebWorkers
  } else if(isFunction(MessageChannel)){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // IE8-
  } else if(document && ONREADYSTATECHANGE in document[CREATE_ELEMENT]('script')){
    defer = function(id){
      html.appendChild(document[CREATE_ELEMENT]('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run(id);
      }
    }
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(run, 0, id);
    }
  }
}('onreadystatechange');
$define(GLOBAL + BIND, {
  setImmediate:   setImmediate,
  clearImmediate: clearImmediate
});

/******************************************************************************
 * Module : es6.promise                                                       *
 ******************************************************************************/

// ES6 promises shim
// Based on https://github.com/getify/native-promise-only/
!function(Promise, test){
  isFunction(Promise) && isFunction(Promise.resolve)
  && Promise.resolve(test = new Promise(function(){})) == test
  || function(asap, RECORD){
    function isThenable(it){
      var then;
      if(isObject(it))then = it.then;
      return isFunction(then) ? then : false;
    }
    function handledRejectionOrHasOnRejected(promise){
      var record = promise[RECORD]
        , chain  = record.c
        , i      = 0
        , react;
      if(record.h)return true;
      while(chain.length > i){
        react = chain[i++];
        if(react.fail || handledRejectionOrHasOnRejected(react.P))return true;
      }
    }
    function notify(record, reject){
      var chain = record.c;
      if(reject || chain.length)asap(function(){
        var promise = record.p
          , value   = record.v
          , ok      = record.s == 1
          , i       = 0;
        if(reject && !handledRejectionOrHasOnRejected(promise)){
          setTimeout(function(){
            if(!handledRejectionOrHasOnRejected(promise)){
              if(NODE){
                if(!process.emit('unhandledRejection', value, promise)){
                  // default node.js behavior
                }
              } else if(isFunction(console.error)){
                console.error('Unhandled promise rejection', value);
              }
            }
          }, 1e3);
        } else while(chain.length > i)!function(react){
          var cb = ok ? react.ok : react.fail
            , ret, then;
          try {
            if(cb){
              if(!ok)record.h = true;
              ret = cb === true ? value : cb(value);
              if(ret === react.P){
                react.rej(TypeError(PROMISE + '-chain cycle'));
              } else if(then = isThenable(ret)){
                then.call(ret, react.res, react.rej);
              } else react.res(ret);
            } else react.rej(value);
          } catch(err){
            react.rej(err);
          }
        }(chain[i++]);
        chain.length = 0;
      });
    }
    function resolve(value){
      var record = this
        , then, wrapper;
      if(record.d)return;
      record.d = true;
      record = record.r || record; // unwrap
      try {
        if(then = isThenable(value)){
          wrapper = {r: record, d: false}; // wrap
          then.call(value, ctx(resolve, wrapper, 1), ctx(reject, wrapper, 1));
        } else {
          record.v = value;
          record.s = 1;
          notify(record);
        }
      } catch(err){
        reject.call(wrapper || {r: record, d: false}, err); // wrap
      }
    }
    function reject(value){
      var record = this;
      if(record.d)return;
      record.d = true;
      record = record.r || record; // unwrap
      record.v = value;
      record.s = 2;
      notify(record, true);
    }
    function getConstructor(C){
      var S = assertObject(C)[SYMBOL_SPECIES];
      return S != undefined ? S : C;
    }
    // 25.4.3.1 Promise(executor)
    Promise = function(executor){
      assertFunction(executor);
      assertInstance(this, Promise, PROMISE);
      var record = {
        p: this,      // promise
        c: [],        // chain
        s: 0,         // state
        d: false,     // done
        v: undefined, // value
        h: false      // handled rejection
      };
      hidden(this, RECORD, record);
      try {
        executor(ctx(resolve, record, 1), ctx(reject, record, 1));
      } catch(err){
        reject.call(record, err);
      }
    }
    assignHidden(Promise[PROTOTYPE], {
      // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
      then: function(onFulfilled, onRejected){
        var S = assertObject(assertObject(this)[CONSTRUCTOR])[SYMBOL_SPECIES];
        var react = {
          ok:   isFunction(onFulfilled) ? onFulfilled : true,
          fail: isFunction(onRejected)  ? onRejected  : false
        } , P = react.P = new (S != undefined ? S : Promise)(function(resolve, reject){
          react.res = assertFunction(resolve);
          react.rej = assertFunction(reject);
        }), record = this[RECORD];
        record.c.push(react);
        record.s && notify(record);
        return P;
      },
      // 25.4.5.1 Promise.prototype.catch(onRejected)
      'catch': function(onRejected){
        return this.then(undefined, onRejected);
      }
    });
    assignHidden(Promise, {
      // 25.4.4.1 Promise.all(iterable)
      all: function(iterable){
        var Promise = getConstructor(this)
          , values  = [];
        return new Promise(function(resolve, reject){
          forOf(iterable, false, push, values);
          var remaining = values.length
            , results   = Array(remaining);
          if(remaining)forEach.call(values, function(promise, index){
            Promise.resolve(promise).then(function(value){
              results[index] = value;
              --remaining || resolve(results);
            }, reject);
          });
          else resolve(results);
        });
      },
      // 25.4.4.4 Promise.race(iterable)
      race: function(iterable){
        var Promise = getConstructor(this);
        return new Promise(function(resolve, reject){
          forOf(iterable, false, function(promise){
            Promise.resolve(promise).then(resolve, reject);
          });
        });
      },
      // 25.4.4.5 Promise.reject(r)
      reject: function(r){
        return new (getConstructor(this))(function(resolve, reject){
          reject(r);
        });
      },
      // 25.4.4.6 Promise.resolve(x)
      resolve: function(x){
        return isObject(x) && RECORD in x && getPrototypeOf(x) === this[PROTOTYPE]
          ? x : new (getConstructor(this))(function(resolve, reject){
            resolve(x);
          });
      }
    });
  }(nextTick || setImmediate, safeSymbol('record'));
  setToStringTag(Promise, PROMISE);
  setSpecies(Promise);
  $define(GLOBAL + FORCED * !isNative(Promise), {Promise: Promise});
}(global[PROMISE]);

/******************************************************************************
 * Module : es6.collections                                                   *
 ******************************************************************************/

// ECMAScript 6 collections shim
!function(){
  var UID   = safeSymbol('uid')
    , O1    = safeSymbol('O1')
    , WEAK  = safeSymbol('weak')
    , LEAK  = safeSymbol('leak')
    , LAST  = safeSymbol('last')
    , FIRST = safeSymbol('first')
    , SIZE  = DESC ? safeSymbol('size') : 'size'
    , uid   = 0
    , tmp   = {};
  
  function getCollection(C, NAME, methods, commonMethods, isMap, isWeak){
    var ADDER = isMap ? 'set' : 'add'
      , proto = C && C[PROTOTYPE]
      , O     = {};
    function initFromIterable(that, iterable){
      if(iterable != undefined)forOf(iterable, isMap, that[ADDER], that);
      return that;
    }
    function fixSVZ(key, chain){
      var method = proto[key];
      if(framework)proto[key] = function(a, b){
        var result = method.call(this, a === 0 ? 0 : a, b);
        return chain ? this : result;
      };
    }
    if(!isNative(C) || !(isWeak || (!BUGGY_ITERATORS && has(proto, FOR_EACH) && has(proto, 'entries')))){
      // create collection constructor
      C = isWeak
        ? function(iterable){
            assertInstance(this, C, NAME);
            set(this, UID, uid++);
            initFromIterable(this, iterable);
          }
        : function(iterable){
            var that = this;
            assertInstance(that, C, NAME);
            set(that, O1, create(null));
            set(that, SIZE, 0);
            set(that, LAST, undefined);
            set(that, FIRST, undefined);
            initFromIterable(that, iterable);
          };
      assignHidden(assignHidden(C[PROTOTYPE], methods), commonMethods);
      isWeak || !DESC || defineProperty(C[PROTOTYPE], 'size', {get: function(){
        return assertDefined(this[SIZE]);
      }});
    } else {
      var Native = C
        , inst   = new C
        , chain  = inst[ADDER](isWeak ? {} : -0, 1)
        , buggyZero;
      // wrap to init collections from iterable
      if(checkDangerIterClosing(function(O){ new C(O) })){
        C = function(iterable){
          assertInstance(this, C, NAME);
          return initFromIterable(new Native, iterable);
        }
        C[PROTOTYPE] = proto;
        if(framework)proto[CONSTRUCTOR] = C;
      }
      isWeak || inst[FOR_EACH](function(val, key){
        buggyZero = 1 / key === -Infinity;
      });
      // fix converting -0 key to +0
      if(buggyZero){
        fixSVZ('delete');
        fixSVZ('has');
        isMap && fixSVZ('get');
      }
      // + fix .add & .set for chaining
      if(buggyZero || chain !== inst)fixSVZ(ADDER, true);
    }
    setToStringTag(C, NAME);
    setSpecies(C);
    
    O[NAME] = C;
    $define(GLOBAL + WRAP + FORCED * !isNative(C), O);
    
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    isWeak || defineStdIterators(C, NAME, function(iterated, kind){
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
        return iterResult(1);
      }
      // return step by kind
      if(kind == KEY)  return iterResult(0, entry.k);
      if(kind == VALUE)return iterResult(0, entry.v);
                       return iterResult(0, [entry.k, entry.v]);   
    }, isMap ? KEY+VALUE : VALUE, !isMap);
    
    return C;
  }
  
  function fastKey(it, create){
    // return primitive with prefix
    if(!isObject(it))return (typeof it == 'string' ? 'S' : 'P') + it;
    // can't set id to frozen object
    if(isFrozen(it))return 'F';
    if(!has(it, UID)){
      // not necessary to add id
      if(!create)return 'E';
      // add missing object id
      hidden(it, UID, ++uid);
    // return object id with prefix
    } return 'O' + it[UID];
  }
  function getEntry(that, key){
    // fast case
    var index = fastKey(key), entry;
    if(index != 'F')return that[O1][index];
    // frozen object case
    for(entry = that[FIRST]; entry; entry = entry.n){
      if(entry.k == key)return entry;
    }
  }
  function def(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry)entry.v = value;
    // create new entry
    else {
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
      if(index != 'F')that[O1][index] = entry;
    } return that;
  }

  var collectionMethods = {
    // 23.1.3.1 Map.prototype.clear()
    // 23.2.3.2 Set.prototype.clear()
    clear: function(){
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
    forEach: function(callbackfn /*, that = undefined */){
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
    has: function(key){
      return !!getEntry(this, key);
    }
  }
  
  // 23.1 Map Objects
  Map = getCollection(Map, MAP, {
    // 23.1.3.6 Map.prototype.get(key)
    get: function(key){
      var entry = getEntry(this, key);
      return entry && entry.v;
    },
    // 23.1.3.9 Map.prototype.set(key, value)
    set: function(key, value){
      return def(this, key === 0 ? 0 : key, value);
    }
  }, collectionMethods, true);
  
  // 23.2 Set Objects
  Set = getCollection(Set, SET, {
    // 23.2.3.1 Set.prototype.add(value)
    add: function(value){
      return def(this, value = value === 0 ? 0 : value, value);
    }
  }, collectionMethods);
  
  function defWeak(that, key, value){
    if(isFrozen(assertObject(key)))leakStore(that).set(key, value);
    else {
      has(key, WEAK) || hidden(key, WEAK, {});
      key[WEAK][that[UID]] = value;
    } return that;
  }
  function leakStore(that){
    return that[LEAK] || hidden(that, LEAK, new Map)[LEAK];
  }
  
  var weakMethods = {
    // 23.3.3.2 WeakMap.prototype.delete(key)
    // 23.4.3.3 WeakSet.prototype.delete(value)
    'delete': function(key){
      if(!isObject(key))return false;
      if(isFrozen(key))return leakStore(this)['delete'](key);
      return has(key, WEAK) && has(key[WEAK], this[UID]) && delete key[WEAK][this[UID]];
    },
    // 23.3.3.4 WeakMap.prototype.has(key)
    // 23.4.3.4 WeakSet.prototype.has(value)
    has: function(key){
      if(!isObject(key))return false;
      if(isFrozen(key))return leakStore(this).has(key);
      return has(key, WEAK) && has(key[WEAK], this[UID]);
    }
  };
  
  // 23.3 WeakMap Objects
  WeakMap = getCollection(WeakMap, WEAKMAP, {
    // 23.3.3.3 WeakMap.prototype.get(key)
    get: function(key){
      if(isObject(key)){
        if(isFrozen(key))return leakStore(this).get(key);
        if(has(key, WEAK))return key[WEAK][this[UID]];
      }
    },
    // 23.3.3.5 WeakMap.prototype.set(key, value)
    set: function(key, value){
      return defWeak(this, key, value);
    }
  }, weakMethods, true, true);
  
  // IE11 WeakMap frozen keys fix
  if(framework && new WeakMap().set(Object.freeze(tmp), 7).get(tmp) != 7){
    forEach.call(array('delete,has,get,set'), function(key){
      var method = WeakMap[PROTOTYPE][key];
      WeakMap[PROTOTYPE][key] = function(a, b){
        // store frozen objects on leaky map
        if(isObject(a) && isFrozen(a)){
          var result = leakStore(this)[key](a, b);
          return key == 'set' ? this : result;
        // store all the rest on native weakmap
        } return method.call(this, a, b);
      };
    });
  }
  
  // 23.4 WeakSet Objects
  WeakSet = getCollection(WeakSet, WEAKSET, {
    // 23.4.3.1 WeakSet.prototype.add(value)
    add: function(value){
      return defWeak(this, value, true);
    }
  }, weakMethods, false, true);
}();

/******************************************************************************
 * Module : es6.reflect                                                       *
 ******************************************************************************/

!function(){
  function Enumerate(iterated){
    var keys = [], key;
    for(key in iterated)keys.push(key);
    set(this, ITER, {o: iterated, a: keys, i: 0});
  }
  createIterator(Enumerate, OBJECT, function(){
    var iter = this[ITER]
      , keys = iter.a
      , key;
    do {
      if(iter.i >= keys.length)return iterResult(1);
    } while(!((key = keys[iter.i++]) in iter.o));
    return iterResult(0, key);
  });
  
  function wrap(fn){
    return function(it){
      assertObject(it);
      try {
        return fn.apply(undefined, arguments), true;
      } catch(e){
        return false;
      }
    }
  }
  
  function reflectGet(target, propertyKey/*, receiver*/){
    var receiver = arguments.length < 3 ? target : arguments[2]
      , desc = getOwnDescriptor(assertObject(target), propertyKey), proto;
    if(desc)return has(desc, 'value')
      ? desc.value
      : desc.get === undefined
        ? undefined
        : desc.get.call(receiver);
    return isObject(proto = getPrototypeOf(target))
      ? reflectGet(proto, propertyKey, receiver)
      : undefined;
  }
  function reflectSet(target, propertyKey, V/*, receiver*/){
    var receiver = arguments.length < 4 ? target : arguments[3]
      , ownDesc  = getOwnDescriptor(assertObject(target), propertyKey)
      , existingDescriptor, proto;
    if(!ownDesc){
      if(isObject(proto = getPrototypeOf(target))){
        return reflectSet(proto, propertyKey, V, receiver);
      }
      ownDesc = descriptor(0);
    }
    if(has(ownDesc, 'value')){
      if(ownDesc.writable === false || !isObject(receiver))return false;
      existingDescriptor = getOwnDescriptor(receiver, propertyKey) || descriptor(0);
      existingDescriptor.value = V;
      return defineProperty(receiver, propertyKey, existingDescriptor), true;
    }
    return ownDesc.set === undefined
      ? false
      : (ownDesc.set.call(receiver, V), true);
  }
  var isExtensible = Object.isExtensible || returnIt;
  
  var reflect = {
    // 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
    apply: ctx(call, apply, 3),
    // 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
    construct: function(target, argumentsList /*, newTarget*/){
      var proto    = assertFunction(arguments.length < 3 ? target : arguments[2])[PROTOTYPE]
        , instance = create(isObject(proto) ? proto : ObjectProto)
        , result   = apply.call(target, instance, argumentsList);
      return isObject(result) ? result : instance;
    },
    // 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
    defineProperty: wrap(defineProperty),
    // 26.1.4 Reflect.deleteProperty(target, propertyKey)
    deleteProperty: function(target, propertyKey){
      var desc = getOwnDescriptor(assertObject(target), propertyKey);
      return desc && !desc.configurable ? false : delete target[propertyKey];
    },
    // 26.1.5 Reflect.enumerate(target)
    enumerate: function(target){
      return new Enumerate(assertObject(target));
    },
    // 26.1.6 Reflect.get(target, propertyKey [, receiver])
    get: reflectGet,
    // 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
    getOwnPropertyDescriptor: function(target, propertyKey){
      return getOwnDescriptor(assertObject(target), propertyKey);
    },
    // 26.1.8 Reflect.getPrototypeOf(target)
    getPrototypeOf: function(target){
      return getPrototypeOf(assertObject(target));
    },
    // 26.1.9 Reflect.has(target, propertyKey)
    has: function(target, propertyKey){
      return propertyKey in target;
    },
    // 26.1.10 Reflect.isExtensible(target)
    isExtensible: function(target){
      return !!isExtensible(assertObject(target));
    },
    // 26.1.11 Reflect.ownKeys(target)
    ownKeys: ownKeys,
    // 26.1.12 Reflect.preventExtensions(target)
    preventExtensions: wrap(Object.preventExtensions || returnIt),
    // 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
    set: reflectSet
  }
  // 26.1.14 Reflect.setPrototypeOf(target, proto)
  if(setPrototypeOf)reflect.setPrototypeOf = function(target, proto){
    return setPrototypeOf(assertObject(target), proto), true;
  };
  
  $define(GLOBAL, {Reflect: {}});
  $define(STATIC, 'Reflect', reflect);
}();

/******************************************************************************
 * Module : es7.proposals                                                     *
 ******************************************************************************/

!function(){
  $define(PROTO, ARRAY, {
    // https://github.com/domenic/Array.prototype.includes
    includes: createArrayContains(true)
  });
  $define(PROTO, STRING, {
    // https://github.com/mathiasbynens/String.prototype.at
    at: createPointAt(true)
  });
  
  function createObjectToArray(isEntries){
    return function(object){
      var O      = toObject(object)
        , keys   = getKeys(object)
        , length = keys.length
        , i      = 0
        , result = Array(length)
        , key;
      if(isEntries)while(length > i)result[i] = [key = keys[i++], O[key]];
      else while(length > i)result[i] = O[keys[i++]];
      return result;
    }
  }
  $define(STATIC, OBJECT, {
    // https://gist.github.com/WebReflection/9353781
    getOwnPropertyDescriptors: function(object){
      var O      = toObject(object)
        , result = {};
      forEach.call(ownKeys(O), function(key){
        defineProperty(result, key, descriptor(0, getOwnDescriptor(O, key)));
      });
      return result;
    },
    // https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-04/apr-9.md#51-objectentries-objectvalues
    values:  createObjectToArray(false),
    entries: createObjectToArray(true)
  });
  $define(STATIC, REGEXP, {
    // https://gist.github.com/kangax/9698100
    escape: createReplacer(/([\\\-[\]{}()*+?.,^$|])/g, '\\$1', true)
  });
}();

/******************************************************************************
 * Module : es7.abstract-refs                                                 *
 ******************************************************************************/

// https://github.com/zenparsing/es-abstract-refs
!function(REFERENCE){
  REFERENCE_GET = getWellKnownSymbol(REFERENCE+'Get', true);
  var REFERENCE_SET = getWellKnownSymbol(REFERENCE+SET, true)
    , REFERENCE_DELETE = getWellKnownSymbol(REFERENCE+'Delete', true);
  
  $define(STATIC, SYMBOL, {
    referenceGet: REFERENCE_GET,
    referenceSet: REFERENCE_SET,
    referenceDelete: REFERENCE_DELETE
  });
  
  hidden(FunctionProto, REFERENCE_GET, returnThis);
  
  function setMapMethods(Constructor){
    if(Constructor){
      var MapProto = Constructor[PROTOTYPE];
      hidden(MapProto, REFERENCE_GET, MapProto.get);
      hidden(MapProto, REFERENCE_SET, MapProto.set);
      hidden(MapProto, REFERENCE_DELETE, MapProto['delete']);
    }
  }
  setMapMethods(Map);
  setMapMethods(WeakMap);
}('reference');

/******************************************************************************
 * Module : core.dict                                                         *
 ******************************************************************************/

!function(DICT){
  Dict = function(iterable){
    var dict = create(null);
    if(iterable != undefined){
      if(isIterable(iterable)){
        forOf(iterable, true, function(key, value){
          dict[key] = value;
        });
      } else assign(dict, iterable);
    }
    return dict;
  }
  Dict[PROTOTYPE] = null;
  
  function DictIterator(iterated, kind){
    set(this, ITER, {o: toObject(iterated), a: getKeys(iterated), i: 0, k: kind});
  }
  createIterator(DictIterator, DICT, function(){
    var iter = this[ITER]
      , O    = iter.o
      , keys = iter.a
      , kind = iter.k
      , key;
    do {
      if(iter.i >= keys.length){
        iter.o = undefined;
        return iterResult(1);
      }
    } while(!has(O, key = keys[iter.i++]));
    if(kind == KEY)  return iterResult(0, key);
    if(kind == VALUE)return iterResult(0, O[key]);
                     return iterResult(0, [key, O[key]]);
  });
  function createDictIter(kind){
    return function(it){
      return new DictIterator(it, kind);
    }
  }
  
  /*
   * 0 -> forEach
   * 1 -> map
   * 2 -> filter
   * 3 -> some
   * 4 -> every
   * 5 -> find
   * 6 -> findKey
   * 7 -> mapPairs
   */
  function createDictMethod(type){
    var isMap    = type == 1
      , isEvery  = type == 4;
    return function(object, callbackfn, that /* = undefined */){
      var f      = ctx(callbackfn, that, 3)
        , O      = toObject(object)
        , result = isMap || type == 7 || type == 2 ? new (generic(this, Dict)) : undefined
        , key, val, res;
      for(key in O)if(has(O, key)){
        val = O[key];
        res = f(val, key, object);
        if(type){
          if(isMap)result[key] = res;             // map
          else if(res)switch(type){
            case 2: result[key] = val; break      // filter
            case 3: return true;                  // some
            case 5: return val;                   // find
            case 6: return key;                   // findKey
            case 7: result[res[0]] = res[1];      // mapPairs
          } else if(isEvery)return false;         // every
        }
      }
      return type == 3 || isEvery ? isEvery : result;
    }
  }
  function createDictReduce(isTurn){
    return function(object, mapfn, init){
      assertFunction(mapfn);
      var O      = toObject(object)
        , keys   = getKeys(O)
        , length = keys.length
        , i      = 0
        , memo, key, result;
      if(isTurn)memo = init == undefined ? new (generic(this, Dict)) : Object(init);
      else if(arguments.length < 3){
        assert(length, REDUCE_ERROR);
        memo = O[keys[i++]];
      } else memo = Object(init);
      while(length > i)if(has(O, key = keys[i++])){
        result = mapfn(memo, O[key], key, object);
        if(isTurn){
          if(result === false)break;
        } else memo = result;
      }
      return memo;
    }
  }
  var findKey = createDictMethod(6);
  function includes(object, el){
    return (el == el ? keyOf(object, el) : findKey(object, sameNaN)) !== undefined;
  }
  
  var dictMethods = {
    keys:    createDictIter(KEY),
    values:  createDictIter(VALUE),
    entries: createDictIter(KEY+VALUE),
    forEach: createDictMethod(0),
    map:     createDictMethod(1),
    filter:  createDictMethod(2),
    some:    createDictMethod(3),
    every:   createDictMethod(4),
    find:    createDictMethod(5),
    findKey: findKey,
    mapPairs:createDictMethod(7),
    reduce:  createDictReduce(false),
    turn:    createDictReduce(true),
    keyOf:   keyOf,
    includes:includes,
    // Has / get / set own property
    has: has,
    get: get,
    set: createDefiner(0),
    isDict: function(it){
      return isObject(it) && getPrototypeOf(it) === Dict[PROTOTYPE];
    }
  };
  
  if(REFERENCE_GET)for(var key in dictMethods)!function(fn){
    function method(){
      for(var args = [this], i = 0; i < arguments.length;)args.push(arguments[i++]);
      return invoke(fn, args);
    }
    fn[REFERENCE_GET] = function(){
      return method;
    }
  }(dictMethods[key]);
  
  $define(GLOBAL + FORCED, {Dict: assignHidden(Dict, dictMethods)});
}('Dict');

/******************************************************************************
 * Module : core.$for                                                         *
 ******************************************************************************/

!function(ENTRIES, FN){  
  function $for(iterable, entries){
    if(!(this instanceof $for))return new $for(iterable, entries);
    this[ITER]    = getIterator(iterable);
    this[ENTRIES] = !!entries;
  }
  
  createIterator($for, 'Wrapper', function(){
    return this[ITER].next();
  });
  var $forProto = $for[PROTOTYPE];
  setIterator($forProto, function(){
    return this[ITER]; // unwrap
  });
  
  function createChainIterator(next){
    function Iter(I, fn, that){
      this[ITER]    = getIterator(I);
      this[ENTRIES] = I[ENTRIES];
      this[FN]      = ctx(fn, that, I[ENTRIES] ? 2 : 1);
    }
    createIterator(Iter, 'Chain', next, $forProto);
    setIterator(Iter[PROTOTYPE], returnThis); // override $forProto iterator
    return Iter;
  }
  
  var MapIter = createChainIterator(function(){
    var step = this[ITER].next();
    return step.done ? step : iterResult(0, stepCall(this[FN], step.value, this[ENTRIES]));
  });
  
  var FilterIter = createChainIterator(function(){
    for(;;){
      var step = this[ITER].next();
      if(step.done || stepCall(this[FN], step.value, this[ENTRIES]))return step;
    }
  });
  
  assignHidden($forProto, {
    of: function(fn, that){
      forOf(this, this[ENTRIES], fn, that);
    },
    array: function(fn, that){
      var result = [];
      forOf(fn != undefined ? this.map(fn, that) : this, false, push, result);
      return result;
    },
    filter: function(fn, that){
      return new FilterIter(this, fn, that);
    },
    map: function(fn, that){
      return new MapIter(this, fn, that);
    }
  });
  
  $for.isIterable  = isIterable;
  $for.getIterator = getIterator;
  
  $define(GLOBAL + FORCED, {$for: $for});
}('entries', safeSymbol('fn'));

/******************************************************************************
 * Module : core.delay                                                        *
 ******************************************************************************/

// https://esdiscuss.org/topic/promise-returning-delay-function
$define(GLOBAL + FORCED, {
  delay: function(time){
    return new Promise(function(resolve){
      setTimeout(resolve, time, true);
    });
  }
});

/******************************************************************************
 * Module : core.binding                                                      *
 ******************************************************************************/

!function(_, toLocaleString){
  // Placeholder
  core._ = path._ = path._ || {};

  $define(PROTO + FORCED, FUNCTION, {
    part: part,
    only: function(numberArguments, that /* = @ */){
      var fn     = assertFunction(this)
        , n      = toLength(numberArguments)
        , isThat = arguments.length > 1;
      return function(/* ...args */){
        var length = min(n, arguments.length)
          , args   = Array(length)
          , i      = 0;
        while(length > i)args[i] = arguments[i++];
        return invoke(fn, args, isThat ? that : this);
      }
    }
  });
  
  function tie(key){
    var that  = this
      , bound = {};
    return hidden(that, _, function(key){
      if(key === undefined || !(key in that))return toLocaleString.call(that);
      return has(bound, key) ? bound[key] : (bound[key] = ctx(that[key], that, -1));
    })[_](key);
  }
  
  hidden(path._, TO_STRING, function(){
    return _;
  });
  
  hidden(ObjectProto, _, tie);
  DESC || hidden(ArrayProto, _, tie);
  // IE8- dirty hack - redefined toLocaleString is not enumerable
}(DESC ? uid('tie') : TO_LOCALE, ObjectProto[TO_LOCALE]);

/******************************************************************************
 * Module : core.object                                                       *
 ******************************************************************************/

!function(){
  function define(target, mixin){
    var keys   = ownKeys(toObject(mixin))
      , length = keys.length
      , i = 0, key;
    while(length > i)defineProperty(target, key = keys[i++], getOwnDescriptor(mixin, key));
    return target;
  };
  $define(STATIC + FORCED, OBJECT, {
    isObject: isObject,
    classof: classof,
    define: define,
    make: function(proto, mixin){
      return define(create(proto), mixin);
    }
  });
}();

/******************************************************************************
 * Module : core.array                                                        *
 ******************************************************************************/

$define(PROTO + FORCED, ARRAY, {
  turn: function(fn, target /* = [] */){
    assertFunction(fn);
    var memo   = target == undefined ? [] : Object(target)
      , O      = ES5Object(this)
      , length = toLength(O.length)
      , index  = 0;
    while(length > index)if(fn(memo, O[index], index++, this) === false)break;
    return memo;
  }
});
if(framework)ArrayUnscopables.turn = true;

/******************************************************************************
 * Module : core.number                                                       *
 ******************************************************************************/

!function(numberMethods){  
  function NumberIterator(iterated){
    set(this, ITER, {l: toLength(iterated), i: 0});
  }
  createIterator(NumberIterator, NUMBER, function(){
    var iter = this[ITER]
      , i    = iter.i++;
    return i < iter.l ? iterResult(0, i) : iterResult(1);
  });
  defineIterator(Number, NUMBER, function(){
    return new NumberIterator(this);
  });
  
  numberMethods.random = function(lim /* = 0 */){
    var a = +this
      , b = lim == undefined ? 0 : +lim
      , m = min(a, b);
    return random() * (max(a, b) - m) + m;
  };

  forEach.call(array(
      // ES3:
      'round,floor,ceil,abs,sin,asin,cos,acos,tan,atan,exp,sqrt,max,min,pow,atan2,' +
      // ES6:
      'acosh,asinh,atanh,cbrt,clz32,cosh,expm1,hypot,imul,log1p,log10,log2,sign,sinh,tanh,trunc'
    ), function(key){
      var fn = Math[key];
      if(fn)numberMethods[key] = function(/* ...args */){
        // ie9- dont support strict mode & convert `this` to object -> convert it to number
        var args = [+this]
          , i    = 0;
        while(arguments.length > i)args.push(arguments[i++]);
        return invoke(fn, args);
      }
    }
  );
  
  $define(PROTO + FORCED, NUMBER, numberMethods);
}({});

/******************************************************************************
 * Module : core.string                                                       *
 ******************************************************************************/

!function(){
  var escapeHTMLDict = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
  }, unescapeHTMLDict = {}, key;
  for(key in escapeHTMLDict)unescapeHTMLDict[escapeHTMLDict[key]] = key;
  $define(PROTO + FORCED, STRING, {
    escapeHTML:   createReplacer(/[&<>"']/g, escapeHTMLDict),
    unescapeHTML: createReplacer(/&(?:amp|lt|gt|quot|apos);/g, unescapeHTMLDict)
  });
}();

/******************************************************************************
 * Module : core.date                                                         *
 ******************************************************************************/

!function(formatRegExp, flexioRegExp, locales, current, SECONDS, MINUTES, HOURS, MONTH, YEAR){
  function createFormat(prefix){
    return function(template, locale /* = current */){
      var that = this
        , dict = locales[has(locales, locale) ? locale : current];
      function get(unit){
        return that[prefix + unit]();
      }
      return String(template).replace(formatRegExp, function(part){
        switch(part){
          case 's'  : return get(SECONDS);                  // Seconds : 0-59
          case 'ss' : return lz(get(SECONDS));              // Seconds : 00-59
          case 'm'  : return get(MINUTES);                  // Minutes : 0-59
          case 'mm' : return lz(get(MINUTES));              // Minutes : 00-59
          case 'h'  : return get(HOURS);                    // Hours   : 0-23
          case 'hh' : return lz(get(HOURS));                // Hours   : 00-23
          case 'D'  : return get(DATE);                     // Date    : 1-31
          case 'DD' : return lz(get(DATE));                 // Date    : 01-31
          case 'W'  : return dict[0][get('Day')];           // Day     : Понедельник
          case 'N'  : return get(MONTH) + 1;                // Month   : 1-12
          case 'NN' : return lz(get(MONTH) + 1);            // Month   : 01-12
          case 'M'  : return dict[2][get(MONTH)];           // Month   : Январь
          case 'MM' : return dict[1][get(MONTH)];           // Month   : Января
          case 'Y'  : return get(YEAR);                     // Year    : 2014
          case 'YY' : return lz(get(YEAR) % 100);           // Year    : 14
        } return part;
      });
    }
  }
  function addLocale(lang, locale){
    function split(index){
      var result = [];
      forEach.call(array(locale.months), function(it){
        result.push(it.replace(flexioRegExp, '$' + index));
      });
      return result;
    }
    locales[lang] = [array(locale.weekdays), split(1), split(2)];
    return core;
  }
  $define(PROTO + FORCED, DATE, {
    format:    createFormat('get'),
    formatUTC: createFormat('getUTC')
  });
  addLocale(current, {
    weekdays: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
    months: 'January,February,March,April,May,June,July,August,September,October,November,December'
  });
  addLocale('ru', {
    weekdays: 'Воскресенье,Понедельник,Вторник,Среда,Четверг,Пятница,Суббота',
    months: 'Январ:я|ь,Феврал:я|ь,Март:а|,Апрел:я|ь,Ма:я|й,Июн:я|ь,' +
            'Июл:я|ь,Август:а|,Сентябр:я|ь,Октябр:я|ь,Ноябр:я|ь,Декабр:я|ь'
  });
  core.locale = function(locale){
    return has(locales, locale) ? current = locale : current;
  };
  core.addLocale = addLocale;
}(/\b\w\w?\b/g, /:(.*)\|(.*)$/, {}, 'en', 'Seconds', 'Minutes', 'Hours', 'Month', 'FullYear');

/******************************************************************************
 * Module : core.global                                                       *
 ******************************************************************************/

$define(GLOBAL + FORCED, {global: global});

/******************************************************************************
 * Module : js.array.statics                                                  *
 ******************************************************************************/

// JavaScript 1.6 / Strawman array statics shim
!function(arrayStatics){
  function setArrayStatics(keys, length){
    forEach.call(array(keys), function(key){
      if(key in ArrayProto)arrayStatics[key] = ctx(call, ArrayProto[key], length);
    });
  }
  setArrayStatics('pop,reverse,shift,keys,values,entries', 1);
  setArrayStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
  setArrayStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' +
                  'reduce,reduceRight,copyWithin,fill,turn');
  $define(STATIC, ARRAY, arrayStatics);
}({});

/******************************************************************************
 * Module : web.dom.itarable                                                  *
 ******************************************************************************/

!function(NodeList){
  if(framework && NodeList && !(SYMBOL_ITERATOR in NodeList[PROTOTYPE])){
    hidden(NodeList[PROTOTYPE], SYMBOL_ITERATOR, Iterators[ARRAY]);
  }
  Iterators.NodeList = Iterators[ARRAY];
}(global.NodeList);

/******************************************************************************
 * Module : core.log                                                          *
 ******************************************************************************/

!function(log, enabled){
  // Methods from https://github.com/DeveloperToolsWG/console-object/blob/master/api.md
  forEach.call(array('assert,clear,count,debug,dir,dirxml,error,exception,' +
      'group,groupCollapsed,groupEnd,info,isIndependentlyComposed,log,' +
      'markTimeline,profile,profileEnd,table,time,timeEnd,timeline,' +
      'timelineEnd,timeStamp,trace,warn'), function(key){
    log[key] = function(){
      if(enabled && key in console)return apply.call(console[key], console, arguments);
    };
  });
  $define(GLOBAL + FORCED, {log: assign(log.log, log, {
    enable: function(){
      enabled = true;
    },
    disable: function(){
      enabled = false;
    }
  })});
}({}, true);
}(typeof self != 'undefined' && self.Math === Math ? self : Function('return this')(), false);
module.exports = { "default": module.exports, __esModule: true };

},{}],44:[function(require,module,exports){
"use strict";

exports["default"] = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

exports.__esModule = true;
},{}],45:[function(require,module,exports){
"use strict";

exports["default"] = (function () {
  function defineProperties(target, props) {
    for (var key in props) {
      var prop = props[key];
      prop.configurable = true;
      if (prop.value) prop.writable = true;
    }

    Object.defineProperties(target, props);
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

exports.__esModule = true;
},{}],46:[function(require,module,exports){
"use strict";

exports["default"] = (function () {
  function defineProperties(target, rawProps) {
    var props = {};

    for (var i = 0; i < rawProps.length; i++) {
      var prop = rawProps[i];
      prop.configurable = true;
      if (prop.value) prop.writable = true;
      props[prop.key] = prop;
    }

    Object.defineProperties(target, props);
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

exports.__esModule = true;
},{}],47:[function(require,module,exports){
"use strict";

var _core = require("babel-runtime/core-js")["default"];

exports["default"] = function get(_x, _x2, _x3) {
  var _again = true;

  _function: while (_again) {
    _again = false;
    var object = _x,
        property = _x2,
        receiver = _x3;
    desc = parent = getter = undefined;

    var desc = _core.Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = _core.Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        _x = parent;
        _x2 = property;
        _x3 = receiver;
        _again = true;
        continue _function;
      }
    } else if ("value" in desc && desc.writable) {
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
},{"babel-runtime/core-js":43}],48:[function(require,module,exports){
"use strict";

exports["default"] = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) subClass.__proto__ = superClass;
};

exports.__esModule = true;
},{}],49:[function(require,module,exports){
"use strict";

exports["default"] = function (obj) {
  return obj && obj.__esModule ? obj["default"] : obj;
};

exports.__esModule = true;
},{}],50:[function(require,module,exports){
"use strict";

var _core = require("babel-runtime/core-js")["default"];

exports["default"] = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return _core.Array.from(arr);
  }
};

exports.__esModule = true;
},{"babel-runtime/core-js":43}],51:[function(require,module,exports){
(function (global){
// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g =
  typeof global === "object" ? global :
  typeof window === "object" ? window : this;

var hasOwn = Object.prototype.hasOwnProperty;
var hadRuntime = hasOwn.call(g, "regeneratorRuntime");
var oldRuntime = hadRuntime && g.regeneratorRuntime;
delete g.regeneratorRuntime; // Force reevalutation of runtime.js.

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL3JlZ2VuZXJhdG9yL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGlzIG1ldGhvZCBvZiBvYnRhaW5pbmcgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QgbmVlZHMgdG8gYmVcbi8vIGtlcHQgaWRlbnRpY2FsIHRvIHRoZSB3YXkgaXQgaXMgb2J0YWluZWQgaW4gcnVudGltZS5qc1xudmFyIGcgPVxuICB0eXBlb2YgZ2xvYmFsID09PSBcIm9iamVjdFwiID8gZ2xvYmFsIDpcbiAgdHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIiA/IHdpbmRvdyA6IHRoaXM7XG5cbnZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIGhhZFJ1bnRpbWUgPSBoYXNPd24uY2FsbChnLCBcInJlZ2VuZXJhdG9yUnVudGltZVwiKTtcbnZhciBvbGRSdW50aW1lID0gaGFkUnVudGltZSAmJiBnLnJlZ2VuZXJhdG9yUnVudGltZTtcbmRlbGV0ZSBnLnJlZ2VuZXJhdG9yUnVudGltZTsgLy8gRm9yY2UgcmVldmFsdXRhdGlvbiBvZiBydW50aW1lLmpzLlxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL3J1bnRpbWVcIik7XG5cbmlmIChoYWRSdW50aW1lKSB7XG4gIC8vIFJlc3RvcmUgdGhlIG9yaWdpbmFsIHJ1bnRpbWUuXG4gIGcucmVnZW5lcmF0b3JSdW50aW1lID0gb2xkUnVudGltZTtcbn0gZWxzZSB7XG4gIC8vIFJlbW92ZSB0aGUgZ2xvYmFsIHByb3BlcnR5IGFkZGVkIGJ5IHJ1bnRpbWUuanMuXG4gIGRlbGV0ZSBnLnJlZ2VuZXJhdG9yUnVudGltZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiBtb2R1bGUuZXhwb3J0cywgX19lc01vZHVsZTogdHJ1ZSB9O1xuIl19
},{"./runtime":52}],52:[function(require,module,exports){
(function (global){
"use strict";

var _core = require("babel-runtime/core-js")["default"];

/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function (global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol = typeof _core.Symbol === "function" && _core.Symbol.iterator || "@@iterator";

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
    return new Generator(innerFn, outerFn, self || null, tryLocsList || []);
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
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = "GeneratorFunction";

  runtime.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction ||
    // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  runtime.mark = function (genFun) {
    genFun.__proto__ = GeneratorFunctionPrototype;
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  runtime.async = function (innerFn, outerFn, self, tryLocsList) {
    return new _core.Promise(function (resolve, reject) {
      var generator = wrap(innerFn, outerFn, self, tryLocsList);
      var callNext = step.bind(generator.next);
      var callThrow = step.bind(generator["throw"]);

      function step(arg) {
        var record = tryCatch(this, null, arg);
        if (record.type === "throw") {
          reject(record.arg);
          return;
        }

        var info = record.arg;
        if (info.done) {
          resolve(info.value);
        } else {
          _core.Promise.resolve(info.value).then(callNext, callThrow);
        }
      }

      callNext();
    });
  };

  function Generator(innerFn, outerFn, self, tryLocsList) {
    var generator = outerFn ? Object.create(outerFn.prototype) : this;
    var context = new Context(tryLocsList);
    var state = GenStateSuspendedStart;

    function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
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
          if (state === GenStateSuspendedStart && typeof arg !== "undefined") {
            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
            throw new TypeError("attempt to send " + JSON.stringify(arg) + " to newborn generator");
          }

          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            delete context.sent;
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

          if (method === "next") {
            context.dispatchException(record.arg);
          } else {
            arg = record.arg;
          }
        }
      }
    }

    generator.next = invoke.bind(generator, "next");
    generator["throw"] = invoke.bind(generator, "throw");
    generator["return"] = invoke.bind(generator, "return");

    return generator;
  }

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
    this.reset();
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

    reset: function reset() {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      // Pre-initialize at least 20 temporary variables to enable hidden
      // class optimizations for simple generators.
      for (var tempIndex = 0, tempName; hasOwn.call(this, tempName = "t" + tempIndex) || tempIndex < 20; ++tempIndex) {
        this[tempName] = null;
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

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg < finallyEntry.finallyLoc) {
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

      return ContinueSentinel;
    },

    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          return this.complete(entry.completion, entry.afterLoc);
        }
      }
    },

    "catch": function (tryLoc) {
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
typeof global === "object" ? global : typeof window === "object" ? window : undefined);
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL3JlZ2VuZXJhdG9yL3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfY29yZSA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanNcIilbXCJkZWZhdWx0XCJdO1xuXG4vKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBodHRwczovL3Jhdy5naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL21hc3Rlci9MSUNFTlNFIGZpbGUuIEFuXG4gKiBhZGRpdGlvbmFsIGdyYW50IG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW5cbiAqIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4hKGZ1bmN0aW9uIChnbG9iYWwpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSB0eXBlb2YgX2NvcmUuU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgX2NvcmUuU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuXG4gIHZhciBpbk1vZHVsZSA9IHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCI7XG4gIHZhciBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZTtcbiAgaWYgKHJ1bnRpbWUpIHtcbiAgICBpZiAoaW5Nb2R1bGUpIHtcbiAgICAgIC8vIElmIHJlZ2VuZXJhdG9yUnVudGltZSBpcyBkZWZpbmVkIGdsb2JhbGx5IGFuZCB3ZSdyZSBpbiBhIG1vZHVsZSxcbiAgICAgIC8vIG1ha2UgdGhlIGV4cG9ydHMgb2JqZWN0IGlkZW50aWNhbCB0byByZWdlbmVyYXRvclJ1bnRpbWUuXG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IHJ1bnRpbWU7XG4gICAgfVxuICAgIC8vIERvbid0IGJvdGhlciBldmFsdWF0aW5nIHRoZSByZXN0IG9mIHRoaXMgZmlsZSBpZiB0aGUgcnVudGltZSB3YXNcbiAgICAvLyBhbHJlYWR5IGRlZmluZWQgZ2xvYmFsbHkuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRGVmaW5lIHRoZSBydW50aW1lIGdsb2JhbGx5IChhcyBleHBlY3RlZCBieSBnZW5lcmF0ZWQgY29kZSkgYXMgZWl0aGVyXG4gIC8vIG1vZHVsZS5leHBvcnRzIChpZiB3ZSdyZSBpbiBhIG1vZHVsZSkgb3IgYSBuZXcsIGVtcHR5IG9iamVjdC5cbiAgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWUgPSBpbk1vZHVsZSA/IG1vZHVsZS5leHBvcnRzIDoge307XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIHJldHVybiBuZXcgR2VuZXJhdG9yKGlubmVyRm4sIG91dGVyRm4sIHNlbGYgfHwgbnVsbCwgdHJ5TG9jc0xpc3QgfHwgW10pO1xuICB9XG4gIHJ1bnRpbWUud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9IEdlbmVyYXRvci5wcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uIChnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3IgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiIDogZmFsc2U7XG4gIH07XG5cbiAgcnVudGltZS5tYXJrID0gZnVuY3Rpb24gKGdlbkZ1bikge1xuICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICBydW50aW1lLmFzeW5jID0gZnVuY3Rpb24gKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgcmV0dXJuIG5ldyBfY29yZS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciBnZW5lcmF0b3IgPSB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KTtcbiAgICAgIHZhciBjYWxsTmV4dCA9IHN0ZXAuYmluZChnZW5lcmF0b3IubmV4dCk7XG4gICAgICB2YXIgY2FsbFRocm93ID0gc3RlcC5iaW5kKGdlbmVyYXRvcltcInRocm93XCJdKTtcblxuICAgICAgZnVuY3Rpb24gc3RlcChhcmcpIHtcbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKHRoaXMsIG51bGwsIGFyZyk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcbiAgICAgICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgICAgIHJlc29sdmUoaW5mby52YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX2NvcmUuUHJvbWlzZS5yZXNvbHZlKGluZm8udmFsdWUpLnRoZW4oY2FsbE5leHQsIGNhbGxUaHJvdyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY2FsbE5leHQoKTtcbiAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBHZW5lcmF0b3IoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICB2YXIgZ2VuZXJhdG9yID0gb3V0ZXJGbiA/IE9iamVjdC5jcmVhdGUob3V0ZXJGbi5wcm90b3R5cGUpIDogdGhpcztcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0KTtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZGVsZWdhdGUuaXRlcmF0b3JbbWV0aG9kXSwgZGVsZWdhdGUuaXRlcmF0b3IsIGFyZyk7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgICAgICAgIC8vIExpa2UgcmV0dXJuaW5nIGdlbmVyYXRvci50aHJvdyh1bmNhdWdodCksIGJ1dCB3aXRob3V0IHRoZVxuICAgICAgICAgICAgLy8gb3ZlcmhlYWQgb2YgYW4gZXh0cmEgZnVuY3Rpb24gY2FsbC5cbiAgICAgICAgICAgIG1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICAgIGFyZyA9IHJlY29yZC5hcmc7XG5cbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIERlbGVnYXRlIGdlbmVyYXRvciByYW4gYW5kIGhhbmRsZWQgaXRzIG93biBleGNlcHRpb25zIHNvXG4gICAgICAgICAgLy8gcmVnYXJkbGVzcyBvZiB3aGF0IHRoZSBtZXRob2Qgd2FzLCB3ZSBjb250aW51ZSBhcyBpZiBpdCBpc1xuICAgICAgICAgIC8vIFwibmV4dFwiIHdpdGggYW4gdW5kZWZpbmVkIGFyZy5cbiAgICAgICAgICBtZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG4gICAgICAgICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG4gICAgICAgICAgICByZXR1cm4gaW5mbztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ICYmIHR5cGVvZiBhcmcgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0IHRvIHNlbmQgXCIgKyBKU09OLnN0cmluZ2lmeShhcmcpICsgXCIgdG8gbmV3Ym9ybiBnZW5lcmF0b3JcIik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkKSB7XG4gICAgICAgICAgICBjb250ZXh0LnNlbnQgPSBhcmc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0LnNlbnQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGFyZykpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgICAgbWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZSA/IEdlblN0YXRlQ29tcGxldGVkIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIHZhciBpbmZvID0ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGlmIChjb250ZXh0LmRlbGVnYXRlICYmIG1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbmZvO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcblxuICAgICAgICAgIGlmIChtZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKHJlY29yZC5hcmcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRvci5uZXh0ID0gaW52b2tlLmJpbmQoZ2VuZXJhdG9yLCBcIm5leHRcIik7XG4gICAgZ2VuZXJhdG9yW1widGhyb3dcIl0gPSBpbnZva2UuYmluZChnZW5lcmF0b3IsIFwidGhyb3dcIik7XG4gICAgZ2VuZXJhdG9yW1wicmV0dXJuXCJdID0gaW52b2tlLmJpbmQoZ2VuZXJhdG9yLCBcInJldHVyblwiKTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cblxuICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJ1bnRpbWUua2V5cyA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLFxuICAgICAgICAgICAgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIHJ1bnRpbWUudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIHRoaXMuc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICAvLyBQcmUtaW5pdGlhbGl6ZSBhdCBsZWFzdCAyMCB0ZW1wb3JhcnkgdmFyaWFibGVzIHRvIGVuYWJsZSBoaWRkZW5cbiAgICAgIC8vIGNsYXNzIG9wdGltaXphdGlvbnMgZm9yIHNpbXBsZSBnZW5lcmF0b3JzLlxuICAgICAgZm9yICh2YXIgdGVtcEluZGV4ID0gMCwgdGVtcE5hbWU7IGhhc093bi5jYWxsKHRoaXMsIHRlbXBOYW1lID0gXCJ0XCIgKyB0ZW1wSW5kZXgpIHx8IHRlbXBJbmRleCA8IDIwOyArK3RlbXBJbmRleCkge1xuICAgICAgICB0aGlzW3RlbXBOYW1lXSA9IG51bGw7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uIGRpc3BhdGNoRXhjZXB0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuICAgICAgICByZXR1cm4gISFjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24gYWJydXB0KHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiYgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmICh0eXBlID09PSBcImJyZWFrXCIgfHwgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJiBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJiBhcmcgPCBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uIGNvbXBsZXRlKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8IHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uIGZpbmlzaChmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbiAodHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uIGRlbGVnYXRlWWllbGQoaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG59KShcbi8vIEFtb25nIHRoZSB2YXJpb3VzIHRyaWNrcyBmb3Igb2J0YWluaW5nIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWxcbi8vIG9iamVjdCwgdGhpcyBzZWVtcyB0byBiZSB0aGUgbW9zdCByZWxpYWJsZSB0ZWNobmlxdWUgdGhhdCBkb2VzIG5vdFxuLy8gdXNlIGluZGlyZWN0IGV2YWwgKHdoaWNoIHZpb2xhdGVzIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5KS5cbnR5cGVvZiBnbG9iYWwgPT09IFwib2JqZWN0XCIgPyBnbG9iYWwgOiB0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiID8gd2luZG93IDogdW5kZWZpbmVkKTsiXX0=
},{"babel-runtime/core-js":43}],53:[function(require,module,exports){
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

},{}],54:[function(require,module,exports){
if (typeof Map === "undefined") {
  Map = function() { this.clear(); };
  Map.prototype = {
    set: function(k, v) { this._[k] = v; return this; },
    get: function(k) { return this._[k]; },
    has: function(k) { return k in this._; },
    delete: function(k) { return k in this._ && delete this._[k]; },
    clear: function() { this._ = Object.create(null); },
    get size() { var n = 0; for (var k in this._) ++n; return n; },
    forEach: function(c) { for (var k in this._) c(this._[k], k, this); }
  };
}

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  factory((global.scale = {}));
}(this, function (exports) { 'use strict';

  function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function ascendingComparator(f) {
    return function(d, x) {
      return ascending(f(d), x);
    };
  }

  function bisector(compare) {
    if (compare.length === 1) compare = ascendingComparator(compare);
    return {
      left: function(a, x, lo, hi) {
        if (arguments.length < 3) lo = 0;
        if (arguments.length < 4) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1;
          else hi = mid;
        }
        return lo;
      },
      right: function(a, x, lo, hi) {
        if (arguments.length < 3) lo = 0;
        if (arguments.length < 4) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) > 0) hi = mid;
          else lo = mid + 1;
        }
        return lo;
      }
    };
  }

  var ascendingBisect = bisector(ascending);
  var bisectRight = ascendingBisect.right;

  var bisect = bisectRight;

  function newThreshold(domain, range, n) {

    function scale(x) {
      if (x <= x) return range[bisect(domain, x, 0, n)];
    }

    scale.domain = function(x) {
      if (!arguments.length) return domain.slice();
      domain = x.slice(), n = Math.min(domain.length, range.length - 1);
      return scale;
    };

    scale.range = function(x) {
      if (!arguments.length) return range.slice();
      range = x.slice(), n = Math.min(domain.length, range.length - 1);
      return scale;
    };

    scale.invertExtent = function(y) {
      return y = range.indexOf(y), [domain[y - 1], domain[y]];
    };

    scale.copy = function() {
      return newThreshold(domain, range);
    };

    return scale;
  }

  function threshold() {
    return newThreshold([.5], [0, 1], 1);
  }

  function interpolateNumber(a, b) {
    return a = +a, b -= a, function(t) {
      return a + b * t;
    };
  }

  function interpolateObject(a, b) {
    var i = {},
        c = {},
        k;

    for (k in a) {
      if (k in b) {
        i[k] = interpolate(a[k], b[k]);
      } else {
        c[k] = a[k];
      }
    }

    for (k in b) {
      if (!(k in a)) {
        c[k] = b[k];
      }
    }

    return function(t) {
      for (k in i) c[k] = i[k](t);
      return c;
    };
  }


  // TODO sparse arrays?
  function interpolateArray(a, b) {
    var x = [],
        c = [],
        na = a.length,
        nb = b.length,
        n0 = Math.min(a.length, b.length),
        i;

    for (i = 0; i < n0; ++i) x.push(interpolate(a[i], b[i]));
    for (; i < na; ++i) c[i] = a[i];
    for (; i < nb; ++i) c[i] = b[i];

    return function(t) {
      for (i = 0; i < n0; ++i) c[i] = x[i](t);
      return c;
    };
  }

  function _format(r, g, b) {
    if (isNaN(r)) r = 0;
    if (isNaN(g)) g = 0;
    if (isNaN(b)) b = 0;
    return "#"
        + (r < 16 ? "0" + r.toString(16) : r.toString(16))
        + (g < 16 ? "0" + g.toString(16) : g.toString(16))
        + (b < 16 ? "0" + b.toString(16) : b.toString(16));
  }

  function Rgb(r, g, b) {
    this.r = Math.max(0, Math.min(255, Math.round(r)));
    this.g = Math.max(0, Math.min(255, Math.round(g)));
    this.b = Math.max(0, Math.min(255, Math.round(b)));
  }

  function Color() {}

  Color.prototype = {
    toString: function() {
      return this.rgb() + "";
    }
  };

  var _prototype = Rgb.prototype = new Color;

  var darker = .7;

  _prototype.darker = function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k);
  };

  var brighter = 1 / darker;

  _prototype.brighter = function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k);
  };

  _prototype.rgb = function() {
    return this;
  };

  _prototype.toString = function() {
    return _format(this.r, this.g, this.b);
  };

  var named = (new Map)
      .set("aliceblue", 0xf0f8ff)
      .set("antiquewhite", 0xfaebd7)
      .set("aqua", 0x00ffff)
      .set("aquamarine", 0x7fffd4)
      .set("azure", 0xf0ffff)
      .set("beige", 0xf5f5dc)
      .set("bisque", 0xffe4c4)
      .set("black", 0x000000)
      .set("blanchedalmond", 0xffebcd)
      .set("blue", 0x0000ff)
      .set("blueviolet", 0x8a2be2)
      .set("brown", 0xa52a2a)
      .set("burlywood", 0xdeb887)
      .set("cadetblue", 0x5f9ea0)
      .set("chartreuse", 0x7fff00)
      .set("chocolate", 0xd2691e)
      .set("coral", 0xff7f50)
      .set("cornflowerblue", 0x6495ed)
      .set("cornsilk", 0xfff8dc)
      .set("crimson", 0xdc143c)
      .set("cyan", 0x00ffff)
      .set("darkblue", 0x00008b)
      .set("darkcyan", 0x008b8b)
      .set("darkgoldenrod", 0xb8860b)
      .set("darkgray", 0xa9a9a9)
      .set("darkgreen", 0x006400)
      .set("darkgrey", 0xa9a9a9)
      .set("darkkhaki", 0xbdb76b)
      .set("darkmagenta", 0x8b008b)
      .set("darkolivegreen", 0x556b2f)
      .set("darkorange", 0xff8c00)
      .set("darkorchid", 0x9932cc)
      .set("darkred", 0x8b0000)
      .set("darksalmon", 0xe9967a)
      .set("darkseagreen", 0x8fbc8f)
      .set("darkslateblue", 0x483d8b)
      .set("darkslategray", 0x2f4f4f)
      .set("darkslategrey", 0x2f4f4f)
      .set("darkturquoise", 0x00ced1)
      .set("darkviolet", 0x9400d3)
      .set("deeppink", 0xff1493)
      .set("deepskyblue", 0x00bfff)
      .set("dimgray", 0x696969)
      .set("dimgrey", 0x696969)
      .set("dodgerblue", 0x1e90ff)
      .set("firebrick", 0xb22222)
      .set("floralwhite", 0xfffaf0)
      .set("forestgreen", 0x228b22)
      .set("fuchsia", 0xff00ff)
      .set("gainsboro", 0xdcdcdc)
      .set("ghostwhite", 0xf8f8ff)
      .set("gold", 0xffd700)
      .set("goldenrod", 0xdaa520)
      .set("gray", 0x808080)
      .set("green", 0x008000)
      .set("greenyellow", 0xadff2f)
      .set("grey", 0x808080)
      .set("honeydew", 0xf0fff0)
      .set("hotpink", 0xff69b4)
      .set("indianred", 0xcd5c5c)
      .set("indigo", 0x4b0082)
      .set("ivory", 0xfffff0)
      .set("khaki", 0xf0e68c)
      .set("lavender", 0xe6e6fa)
      .set("lavenderblush", 0xfff0f5)
      .set("lawngreen", 0x7cfc00)
      .set("lemonchiffon", 0xfffacd)
      .set("lightblue", 0xadd8e6)
      .set("lightcoral", 0xf08080)
      .set("lightcyan", 0xe0ffff)
      .set("lightgoldenrodyellow", 0xfafad2)
      .set("lightgray", 0xd3d3d3)
      .set("lightgreen", 0x90ee90)
      .set("lightgrey", 0xd3d3d3)
      .set("lightpink", 0xffb6c1)
      .set("lightsalmon", 0xffa07a)
      .set("lightseagreen", 0x20b2aa)
      .set("lightskyblue", 0x87cefa)
      .set("lightslategray", 0x778899)
      .set("lightslategrey", 0x778899)
      .set("lightsteelblue", 0xb0c4de)
      .set("lightyellow", 0xffffe0)
      .set("lime", 0x00ff00)
      .set("limegreen", 0x32cd32)
      .set("linen", 0xfaf0e6)
      .set("magenta", 0xff00ff)
      .set("maroon", 0x800000)
      .set("mediumaquamarine", 0x66cdaa)
      .set("mediumblue", 0x0000cd)
      .set("mediumorchid", 0xba55d3)
      .set("mediumpurple", 0x9370db)
      .set("mediumseagreen", 0x3cb371)
      .set("mediumslateblue", 0x7b68ee)
      .set("mediumspringgreen", 0x00fa9a)
      .set("mediumturquoise", 0x48d1cc)
      .set("mediumvioletred", 0xc71585)
      .set("midnightblue", 0x191970)
      .set("mintcream", 0xf5fffa)
      .set("mistyrose", 0xffe4e1)
      .set("moccasin", 0xffe4b5)
      .set("navajowhite", 0xffdead)
      .set("navy", 0x000080)
      .set("oldlace", 0xfdf5e6)
      .set("olive", 0x808000)
      .set("olivedrab", 0x6b8e23)
      .set("orange", 0xffa500)
      .set("orangered", 0xff4500)
      .set("orchid", 0xda70d6)
      .set("palegoldenrod", 0xeee8aa)
      .set("palegreen", 0x98fb98)
      .set("paleturquoise", 0xafeeee)
      .set("palevioletred", 0xdb7093)
      .set("papayawhip", 0xffefd5)
      .set("peachpuff", 0xffdab9)
      .set("peru", 0xcd853f)
      .set("pink", 0xffc0cb)
      .set("plum", 0xdda0dd)
      .set("powderblue", 0xb0e0e6)
      .set("purple", 0x800080)
      .set("rebeccapurple", 0x663399)
      .set("red", 0xff0000)
      .set("rosybrown", 0xbc8f8f)
      .set("royalblue", 0x4169e1)
      .set("saddlebrown", 0x8b4513)
      .set("salmon", 0xfa8072)
      .set("sandybrown", 0xf4a460)
      .set("seagreen", 0x2e8b57)
      .set("seashell", 0xfff5ee)
      .set("sienna", 0xa0522d)
      .set("silver", 0xc0c0c0)
      .set("skyblue", 0x87ceeb)
      .set("slateblue", 0x6a5acd)
      .set("slategray", 0x708090)
      .set("slategrey", 0x708090)
      .set("snow", 0xfffafa)
      .set("springgreen", 0x00ff7f)
      .set("steelblue", 0x4682b4)
      .set("tan", 0xd2b48c)
      .set("teal", 0x008080)
      .set("thistle", 0xd8bfd8)
      .set("tomato", 0xff6347)
      .set("turquoise", 0x40e0d0)
      .set("violet", 0xee82ee)
      .set("wheat", 0xf5deb3)
      .set("white", 0xffffff)
      .set("whitesmoke", 0xf5f5f5)
      .set("yellow", 0xffff00)
      .set("yellowgreen", 0x9acd32);

  function rgbn(n) {
    return rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff);
  }

  function Hsl(h, s, l) {
    this.h = +h;
    this.s = Math.max(0, Math.min(1, +s));
    this.l = Math.max(0, Math.min(1, +l));
  }

  var prototype = Hsl.prototype = new Color;

  prototype.brighter = function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k);
  };

  prototype.darker = function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k);
  };


  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60
        : h < 180 ? m2
        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
        : m1) * 255;
  }

  prototype.rgb = function() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l <= .5 ? l * (1 + s) : l + s - l * s,
        m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2)
    );
  };

  function hsl(h, s, l) {
    if (arguments.length === 1) {
      if (h instanceof Hsl) {
        l = h.l;
        s = h.s;
        h = h.h;
      } else {
        if (!(h instanceof Color)) h = color(h);
        if (h) {
          if (h instanceof Hsl) return h;
          h = h.rgb();
          var r = h.r / 255,
              g = h.g / 255,
              b = h.b / 255,
              min = Math.min(r, g, b),
              max = Math.max(r, g, b),
              range = max - min;
          l = (max + min) / 2;
          if (range) {
            s = l < .5 ? range / (max + min) : range / (2 - max - min);
            if (r === max) h = (g - b) / range + (g < b) * 6;
            else if (g === max) h = (b - r) / range + 2;
            else h = (r - g) / range + 4;
            h *= 60;
          } else {
            h = NaN;
            s = l > 0 && l < 1 ? 0 : h;
          }
        } else {
          h = s = l = NaN;
        }
      }
    }
    return new Hsl(h, s, l);
  }

  var reHslPercent = /^hsl\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;

  var reRgbPercent = /^rgb\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;

  var reRgbInteger = /^rgb\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*\)$/;

  var reHex6 = /^#([0-9a-f]{6})$/;

  var reHex3 = /^#([0-9a-f]{3})$/;

  function color(format) {
    var m;
    format = (format + "").trim().toLowerCase();
    return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf))) // #f00
        : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
        : (m = reRgbInteger.exec(format)) ? rgb(m[1], m[2], m[3]) // rgb(255,0,0)
        : (m = reRgbPercent.exec(format)) ? rgb(m[1] * 2.55, m[2] * 2.55, m[3] * 2.55) // rgb(100%,0%,0%)
        : (m = reHslPercent.exec(format)) ? hsl(m[1], m[2] * .01, m[3] * .01) // hsl(120,50%,50%)
        : named.has(format) ? rgbn(named.get(format))
        : null;
  }

  function rgb(r, g, b) {
    if (arguments.length === 1) {
      if (!(r instanceof Color)) r = color(r);
      if (r) {
        r = r.rgb();
        b = r.b;
        g = r.g;
        r = r.r;
      } else {
        r = g = b = NaN;
      }
    }
    return new Rgb(r, g, b);
  }

  function interpolateRgb(a, b) {
    a = rgb(a);
    b = rgb(b);
    var ar = a.r,
        ag = a.g,
        ab = a.b,
        br = b.r - ar,
        bg = b.g - ag,
        bb = b.b - ab;
    return function(t) {
      return _format(Math.round(ar + br * t), Math.round(ag + bg * t), Math.round(ab + bb * t));
    };
  }

  function interpolate0(b) {
    return function() {
      return b;
    };
  }

  function interpolate1(b) {
    return function(t) {
      return b(t) + "";
    };
  }

  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
  var reB = new RegExp(reA.source, "g");

  function interpolateString(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
        am, // current match in a
        bm, // current match in b
        bs, // string preceding current number in b, if any
        i = -1, // index in s
        s = [], // string constants and placeholders
        q = []; // number interpolators

    // Coerce inputs to strings.
    a = a + "", b = b + "";

    // Interpolate pairs of numbers in a & b.
    while ((am = reA.exec(a))
        && (bm = reB.exec(b))) {
      if ((bs = bm.index) > bi) { // a string precedes the next number in b
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
        if (s[i]) s[i] += bm; // coalesce with previous string
        else s[++i] = bm;
      } else { // interpolate non-matching numbers
        s[++i] = null;
        q.push({i: i, x: interpolateNumber(am, bm)});
      }
      bi = reB.lastIndex;
    }

    // Add remains of b.
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? (q[0]
        ? interpolate1(q[0].x)
        : interpolate0(b))
        : (b = q.length, function(t) {
            for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
            return s.join("");
          });
  }

  var interpolators = [
    function(a, b) {
      var t = typeof b, c;
      return (t === "string" ? ((c = color(b)) ? (b = c, interpolateRgb) : interpolateString)
          : b instanceof color ? interpolateRgb
          : Array.isArray(b) ? interpolateArray
          : t === "object" && isNaN(b) ? interpolateObject
          : interpolateNumber)(a, b);
    }
  ];

  function interpolate(a, b) {
    var i = interpolators.length, f;
    while (--i >= 0 && !(f = interpolators[i](a, b)));
    return f;
  }

  var e2 = Math.sqrt(2);

  var e5 = Math.sqrt(10);

  var e10 = Math.sqrt(50);

  function tickRange(domain, count) {
    if (count == null) count = 10;

    var start = domain[0],
        stop = domain[domain.length - 1];

    if (stop < start) error = stop, stop = start, start = error;

    var span = stop - start,
        step = Math.pow(10, Math.floor(Math.log(span / count) / Math.LN10)),
        error = span / count / step;

    // Filter ticks to get closer to the desired count.
    if (error >= e10) step *= 10;
    else if (error >= e5) step *= 5;
    else if (error >= e2) step *= 2;

    // Round start and stop values to step interval.
    return [
      Math.ceil(start / step) * step,
      Math.floor(stop / step) * step + step / 2, // inclusive
      step
    ];
  }

  function nice(domain, step) {
    domain = domain.slice();
    if (!step) return domain;

    var i0 = 0,
        i1 = domain.length - 1,
        x0 = domain[i0],
        x1 = domain[i1],
        dx;

    if (x1 < x0) {
      dx = i0, i0 = i1, i1 = dx;
      dx = x0, x0 = x1, x1 = dx;
    }

    domain[i0] = Math.floor(x0 / step) * step;
    domain[i1] = Math.ceil(x1 / step) * step;
    return domain;
  }

  var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];


  // Computes the decimal coefficient and exponent of the specified number x with
  // significant digits p, where x is positive and p is in [1, 21] or undefined.
  // For example, formatDecimal(1.23) returns ["123", 0].
  function formatDecimal(x, p) {
    if ((i = (x = x.toExponential(p && p - 1)).indexOf("e")) < 0) return null; // NaN, ±Infinity
    var i, coefficient = x.slice(0, i);

    // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
    // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
    return [
      coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
      +x.slice(i + 1)
    ];
  }

  function exponent(x) {
    return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
  }

  var prefixExponent;

  function formatPrefixAuto(x, p) {
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1],
        i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
        n = coefficient.length;
    return i === n ? coefficient
        : i > n ? coefficient + new Array(i - n + 1).join("0")
        : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
        : "0." + new Array(1 - i).join("0") + formatDecimal(x, p + i - 1)[0]; // less than 1y!
  }

  function formatRounded(x, p) {
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1];
    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
        : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
        : coefficient + new Array(exponent - coefficient.length + 2).join("0");
  }

  function formatDefault(x, p) {
    x = x.toPrecision(p);

    out: for (var n = x.length, i = 1, i0 = -1, i1; i < n; ++i) {
      switch (x[i]) {
        case ".": i0 = i1 = i; break;
        case "0": if (i0 === 0) i0 = i; i1 = i; break;
        case "e": break out;
        default: if (i0 > 0) i0 = 0; break;
      }
    }

    return i0 > 0 ? x.slice(0, i0) + x.slice(i1 + 1) : x;
  }

  var formatTypes = {
    "": formatDefault,
    "%": function(x, p) { return (x * 100).toFixed(p); },
    "b": function(x) { return Math.round(x).toString(2); },
    "c": function(x) { return x + ""; },
    "d": function(x) { return Math.round(x).toString(10); },
    "e": function(x, p) { return x.toExponential(p); },
    "f": function(x, p) { return x.toFixed(p); },
    "g": function(x, p) { return x.toPrecision(p); },
    "o": function(x) { return Math.round(x).toString(8); },
    "p": function(x, p) { return formatRounded(x * 100, p); },
    "r": formatRounded,
    "s": formatPrefixAuto,
    "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
    "x": function(x) { return Math.round(x).toString(16); }
  };


  // [[fill]align][sign][symbol][0][width][,][.precision][type]
  var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;

  function FormatSpecifier(specifier) {
    if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);

    var match,
        fill = match[1] || " ",
        align = match[2] || ">",
        sign = match[3] || "-",
        symbol = match[4] || "",
        zero = !!match[5],
        width = match[6] && +match[6],
        comma = !!match[7],
        precision = match[8] && +match[8].slice(1),
        type = match[9] || "";

    // The "n" type is an alias for ",g".
    if (type === "n") comma = true, type = "g";

    // Map invalid types to the default format.
    else if (!formatTypes[type]) type = "";

    // If zero fill is specified, padding goes after sign and before digits.
    if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

    this.fill = fill;
    this.align = align;
    this.sign = sign;
    this.symbol = symbol;
    this.zero = zero;
    this.width = width;
    this.comma = comma;
    this.precision = precision;
    this.type = type;
  }

  FormatSpecifier.prototype.toString = function() {
    return this.fill
        + this.align
        + this.sign
        + this.symbol
        + (this.zero ? "0" : "")
        + (this.width == null ? "" : Math.max(1, this.width | 0))
        + (this.comma ? "," : "")
        + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
        + this.type;
  };

  function formatSpecifier(specifier) {
    return new FormatSpecifier(specifier);
  }

  function _identity(x) {
    return x;
  }

  function formatGroup(grouping, thousands) {
    return function(value, width) {
      var i = value.length,
          t = [],
          j = 0,
          g = grouping[0],
          length = 0;

      while (i > 0 && g > 0) {
        if (length + g + 1 > width) g = Math.max(1, width - length);
        t.push(value.substring(i -= g, i + g));
        if ((length += g + 1) > width) break;
        g = grouping[j = (j + 1) % grouping.length];
      }

      return t.reverse().join(thousands);
    };
  }

  function localeFormat(locale) {
    var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : _identity,
        currency = locale.currency,
        decimal = locale.decimal;

    function format(specifier) {
      specifier = formatSpecifier(specifier);

      var fill = specifier.fill,
          align = specifier.align,
          sign = specifier.sign,
          symbol = specifier.symbol,
          zero = specifier.zero,
          width = specifier.width,
          comma = specifier.comma,
          precision = specifier.precision,
          type = specifier.type;

      // Compute the prefix and suffix.
      // For SI-prefix, the suffix is lazily computed.
      var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
          suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? "%" : "";

      // What format function should we use?
      // Is this an integer type?
      // Can this type generate exponential notation?
      var formatType = formatTypes[type],
          maybeSuffix = !type || /[defgprs%]/.test(type);

      // Set the default precision if not specified,
      // or clamp the specified precision to the supported range.
      // For significant precision, it must be in [1, 21].
      // For fixed precision, it must be in [0, 20].
      precision = precision == null ? (type ? 6 : 12)
          : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
          : Math.max(0, Math.min(20, precision));

      return function(value) {
        var valuePrefix = prefix,
            valueSuffix = suffix;

        if (type === "c") {
          valueSuffix = formatType(value) + valueSuffix;
          value = "";
        } else {
          value = +value;

          // Convert negative to positive, and compute the prefix.
          // Note that -0 is not less than 0, but 1 / -0 is!
          var valueNegative = (value < 0 || 1 / value < 0) && (value *= -1, true);

          // Perform the initial formatting.
          value = formatType(value, precision);

          // Compute the prefix and suffix.
          valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
          valueSuffix = valueSuffix + (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + (valueNegative && sign === "(" ? ")" : "");

          // Break the formatted value into the integer “value” part that can be
          // grouped, and fractional or exponential “suffix” part that is not.
          if (maybeSuffix) {
            var i = -1, n = value.length, c;
            while (++i < n) {
              if (c = value.charCodeAt(i), 48 > c || c > 57) {
                valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                value = value.slice(0, i);
                break;
              }
            }
          }
        }

        // If the fill character is not "0", grouping is applied before padding.
        if (comma && !zero) value = group(value, Infinity);

        // Compute the padding.
        var length = valuePrefix.length + value.length + valueSuffix.length,
            padding = length < width ? new Array(width - length + 1).join(fill) : "";

        // If the fill character is "0", grouping is applied after padding.
        if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

        // Reconstruct the final output based on the desired alignment.
        switch (align) {
          case "<": return valuePrefix + value + valueSuffix + padding;
          case "=": return valuePrefix + padding + value + valueSuffix;
          case "^": return padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
        }
        return padding + valuePrefix + value + valueSuffix;
      };
    }

    function formatPrefix(specifier, value) {
      var f = format((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
          e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
          k = Math.pow(10, -e),
          prefix = prefixes[8 + e / 3];
      return function(value) {
        return f(k * value) + prefix;
      };
    }

    return {
      format: format,
      formatPrefix: formatPrefix
    };
  }

  var locale = localeFormat({
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["$", ""]
  });

  var format = locale.format;

  function precisionFixed(step) {
    return Math.max(0, -exponent(Math.abs(step)));
  }

  function precisionRound(step, max) {
    return Math.max(0, exponent(Math.abs(max)) - exponent(Math.abs(step))) + 1;
  }

  var formatPrefix = locale.formatPrefix;

  function precisionPrefix(step, value) {
    return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
  }

  function tickFormat(domain, count, specifier) {
    var range = tickRange(domain, count);
    if (specifier == null) {
      specifier = ",." + precisionFixed(range[2]) + "f";
    } else {
      switch (specifier = formatSpecifier(specifier), specifier.type) {
        case "s": {
          var value = Math.max(Math.abs(range[0]), Math.abs(range[1]));
          if (specifier.precision == null) specifier.precision = precisionPrefix(range[2], value);
          return formatPrefix(specifier, value);
        }
        case "":
        case "e":
        case "g":
        case "p":
        case "r": {
          if (specifier.precision == null) specifier.precision = precisionRound(range[2], Math.max(Math.abs(range[0]), Math.abs(range[1]))) - (specifier.type === "e");
          break;
        }
        case "f":
        case "%": {
          if (specifier.precision == null) specifier.precision = precisionFixed(range[2]) - (specifier.type === "%") * 2;
          break;
        }
      }
    }
    return format(specifier);
  }

  function scale(x) {
    var k = 1;
    while (x * k % 1) k *= 10;
    return k;
  }

  function range(start, stop, step) {
    if ((n = arguments.length) < 3) {
      step = 1;
      if (n < 2) {
        stop = start;
        start = 0;
      }
    }

    var i = -1,
        n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
        k = scale(Math.abs(step)),
        range = new Array(n);

    start *= k;
    step *= k;
    while (++i < n) {
      range[i] = (start + i * step) / k;
    }

    return range;
  }

  function ticks(domain, count) {
    return range.apply(null, tickRange(domain, count));
  }

  function interpolateRound(a, b) {
    return a = +a, b -= a, function(t) {
      return Math.round(a + b * t);
    };
  }

  function uninterpolateNumber(a, b) {
    b = (b -= a = +a) || 1 / b;
    return function(x) {
      return (x - a) / b;
    };
  }

  function uninterpolateClamp(a, b) {
    b = (b -= a = +a) || 1 / b;
    return function(x) {
      return Math.max(0, Math.min(1, (x - a) / b));
    };
  }

  function bilinear(domain, range, uninterpolate, interpolate) {
    var u = uninterpolate(domain[0], domain[1]),
        i = interpolate(range[0], range[1]);
    return function(x) {
      return i(u(x));
    };
  }

  function polylinear(domain, range, uninterpolate, interpolate) {
    var k = Math.min(domain.length, range.length) - 1,
        u = new Array(k),
        i = new Array(k),
        j = -1;

    // Handle descending domains.
    if (domain[k] < domain[0]) {
      domain = domain.slice().reverse();
      range = range.slice().reverse();
    }

    while (++j < k) {
      u[j] = uninterpolate(domain[j], domain[j + 1]);
      i[j] = interpolate(range[j], range[j + 1]);
    }

    return function(x) {
      var j = bisect(domain, x, 1, k) - 1;
      return i[j](u[j](x));
    };
  }

  function newLinear(domain, range, interpolate, clamp) {
    var output,
        input;

    function rescale() {
      var linear = Math.min(domain.length, range.length) > 2 ? polylinear : bilinear,
          uninterpolate = clamp ? uninterpolateClamp : uninterpolateNumber;
      output = linear(domain, range, uninterpolate, interpolate);
      input = linear(range, domain, uninterpolate, interpolateNumber);
      return scale;
    }

    function scale(x) {
      return output(x);
    }

    scale.invert = function(y) {
      return input(y);
    };

    scale.domain = function(x) {
      if (!arguments.length) return domain.slice();
      domain = x.map(Number);
      return rescale();
    };

    scale.range = function(x) {
      if (!arguments.length) return range.slice();
      range = x.slice();
      return rescale();
    };

    scale.rangeRound = function(x) {
      return scale.range(x).interpolate(interpolateRound);
    };

    scale.clamp = function(x) {
      if (!arguments.length) return clamp;
      clamp = !!x;
      return rescale();
    };

    scale.interpolate = function(x) {
      if (!arguments.length) return interpolate;
      interpolate = x;
      return rescale();
    };

    scale.ticks = function(count) {
      return ticks(domain, count);
    };

    scale.tickFormat = function(count, specifier) {
      return tickFormat(domain, count, specifier);
    };

    scale.nice = function(count) {
      domain = nice(domain, tickRange(domain, count)[2]);
      return rescale();
    };

    scale.copy = function() {
      return newLinear(domain, range, interpolate, clamp);
    };

    return rescale();
  }

  function linear() {
    return newLinear([0, 1], [0, 1], interpolate, false);
  }

  function rebind(scale, linear) {
    scale.range = function() {
      var x = linear.range.apply(linear, arguments);
      return x === linear ? scale : x;
    };

    scale.rangeRound = function() {
      var x = linear.rangeRound.apply(linear, arguments);
      return x === linear ? scale : x;
    };

    scale.clamp = function() {
      var x = linear.clamp.apply(linear, arguments);
      return x === linear ? scale : x;
    };

    scale.interpolate = function() {
      var x = linear.interpolate.apply(linear, arguments);
      return x === linear ? scale : x;
    };

    return scale;
  }

  function newPow(linear, exponent, domain) {

    function powp(x) {
      return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
    }

    function powb(x) {
      return x < 0 ? -Math.pow(-x, 1 / exponent) : Math.pow(x, 1 / exponent);
    }

    function scale(x) {
      return linear(powp(x));
    }

    scale.invert = function(x) {
      return powb(linear.invert(x));
    };

    scale.exponent = function(x) {
      if (!arguments.length) return exponent;
      exponent = +x;
      return scale.domain(domain);
    };

    scale.domain = function(x) {
      if (!arguments.length) return domain.slice();
      domain = x.map(Number);
      linear.domain(domain.map(powp));
      return scale;
    };

    scale.ticks = function(count) {
      return ticks(domain, count);
    };

    scale.tickFormat = function(count, specifier) {
      return tickFormat(domain, count, specifier);
    };

    scale.nice = function(count) {
      return scale.domain(nice(domain, tickRange(domain, count)[2]));
    };

    scale.copy = function() {
      return newPow(linear.copy(), exponent, domain);
    };

    return rebind(scale, linear);
  }

  function sqrt() {
    return newPow(linear(), .5, [0, 1]);
  }

  function newQuantize(x0, x1, range) {
    var kx, i;

    function scale(x) {
      return range[Math.max(0, Math.min(i, Math.floor(kx * (x - x0))))];
    }

    function rescale() {
      kx = range.length / (x1 - x0);
      i = range.length - 1;
      return scale;
    }

    scale.domain = function(x) {
      if (!arguments.length) return [x0, x1];
      x0 = +x[0];
      x1 = +x[x.length - 1];
      return rescale();
    };

    scale.range = function(x) {
      if (!arguments.length) return range.slice();
      range = x.slice();
      return rescale();
    };

    scale.invertExtent = function(y) {
      y = range.indexOf(y);
      y = y < 0 ? NaN : y / kx + x0;
      return [y, y + 1 / kx];
    };

    scale.copy = function() {
      return newQuantize(x0, x1, range); // copy on write
    };

    return rescale();
  }

  function quantize() {
    return newQuantize(0, 1, [0, 1]);
  }


  // R-7 per <http://en.wikipedia.org/wiki/Quantile>
  function quantile(values, p) {
    var H = (values.length - 1) * p + 1,
        h = Math.floor(H),
        v = +values[h - 1],
        e = H - h;
    return e ? v + e * (values[h] - v) : v;
  }

  function newQuantile(domain, range) {
    var thresholds;

    function rescale() {
      var k = 0,
          q = range.length;
      thresholds = [];
      while (++k < q) thresholds[k - 1] = quantile(domain, k / q);
      return scale;
    }

    function scale(x) {
      if (!isNaN(x = +x)) return range[bisect(thresholds, x)];
    }

    scale.domain = function(x) {
      if (!arguments.length) return domain;
      domain = [];
      for (var i = 0, n = x.length, v; i < n; ++i) if (v = x[i], v != null && !isNaN(v = +v)) domain.push(v);
      domain.sort(ascending);
      return rescale();
    };

    scale.range = function(x) {
      if (!arguments.length) return range.slice();
      range = x.slice();
      return rescale();
    };

    scale.quantiles = function() {
      return thresholds;
    };

    scale.invertExtent = function(y) {
      y = range.indexOf(y);
      return y < 0 ? [NaN, NaN] : [
        y > 0 ? thresholds[y - 1] : domain[0],
        y < thresholds.length ? thresholds[y] : domain[domain.length - 1]
      ];
    };

    scale.copy = function() {
      return newQuantile(domain, range); // copy on write!
    };

    return rescale();
  }

  function _quantile() {
    return newQuantile([], []);
  }

  function pow() {
    return newPow(linear(), 1, [0, 1]);
  }

  function steps(length, start, step) {
    var steps = new Array(length), i = -1;
    while (++i < length) steps[i] = start + step * i;
    return steps;
  }

  function newOrdinal(domain, ranger) {
    var index,
        range,
        rangeBand;

    function scale(x) {
      var k = x + "", i = index.get(k);
      if (!i) {
        if (ranger.t !== "range") return;
        index.set(k, i = domain.push(x));
      }
      return range[(i - 1) % range.length];
    }

    scale.domain = function(x) {
      if (!arguments.length) return domain.slice();
      domain = [];
      index = new Map;
      var i = -1, n = x.length, xi, xk;
      while (++i < n) if (!index.has(xk = (xi = x[i]) + "")) index.set(xk, domain.push(xi));
      return scale[ranger.t].apply(scale, ranger.a);
    };

    scale.range = function(x) {
      if (!arguments.length) return range.slice();
      range = x.slice();
      rangeBand = 0;
      ranger = {t: "range", a: arguments};
      return scale;
    };

    scale.rangePoints = function(x, padding) {
      padding = arguments.length < 2 ? 0 : +padding;
      var start = +x[0],
          stop = +x[1],
          step = domain.length < 2 ? (start = (start + stop) / 2, 0) : (stop - start) / (domain.length - 1 + padding);
      range = steps(domain.length, start + step * padding / 2, step);
      rangeBand = 0;
      ranger = {t: "rangePoints", a: arguments};
      return scale;
    };

    scale.rangeRoundPoints = function(x, padding) {
      padding = arguments.length < 2 ? 0 : +padding;
      var start = +x[0],
          stop = +x[1],
          step = domain.length < 2 ? (start = stop = Math.round((start + stop) / 2), 0) : (stop - start) / (domain.length - 1 + padding) | 0; // bitwise floor for symmetry
      range = steps(domain.length, start + Math.round(step * padding / 2 + (stop - start - (domain.length - 1 + padding) * step) / 2), step);
      rangeBand = 0;
      ranger = {t: "rangeRoundPoints", a: arguments};
      return scale;
    };

    scale.rangeBands = function(x, padding, outerPadding) {
      padding = arguments.length < 2 ? 0 : +padding;
      outerPadding = arguments.length < 3 ? padding : +outerPadding;
      var reverse = +x[1] < +x[0],
          start = +x[reverse - 0],
          stop = +x[1 - reverse],
          step = (stop - start) / (domain.length - padding + 2 * outerPadding);
      range = steps(domain.length, start + step * outerPadding, step);
      if (reverse) range.reverse();
      rangeBand = step * (1 - padding);
      ranger = {t: "rangeBands", a: arguments};
      return scale;
    };

    scale.rangeRoundBands = function(x, padding, outerPadding) {
      padding = arguments.length < 2 ? 0 : +padding;
      outerPadding = arguments.length < 3 ? padding : +outerPadding;
      var reverse = +x[1] < +x[0],
          start = +x[reverse - 0],
          stop = +x[1 - reverse],
          step = Math.floor((stop - start) / (domain.length - padding + 2 * outerPadding));
      range = steps(domain.length, start + Math.round((stop - start - (domain.length - padding) * step) / 2), step);
      if (reverse) range.reverse();
      rangeBand = Math.round(step * (1 - padding));
      ranger = {t: "rangeRoundBands", a: arguments};
      return scale;
    };

    scale.rangeBand = function() {
      return rangeBand;
    };

    scale.rangeExtent = function() {
      var t = ranger.a[0], start = t[0], stop = t[t.length - 1];
      if (stop < start) t = stop, stop = start, start = t;
      return [start, stop];
    };

    scale.copy = function() {
      return newOrdinal(domain, ranger);
    };

    return scale.domain(domain);
  }

  function ordinal() {
    return newOrdinal([], {t: "range", a: [[]]});
  }

  var tickFormatOther = format(",");

  var tickFormat10 = format(".0e");

  function newLog(linear, base, domain) {

    function log(x) {
      return (domain[0] < 0 ? -Math.log(x > 0 ? 0 : -x) : Math.log(x < 0 ? 0 : x)) / Math.log(base);
    }

    function pow(x) {
      return domain[0] < 0 ? -Math.pow(base, -x) : Math.pow(base, x);
    }

    function scale(x) {
      return linear(log(x));
    }

    scale.invert = function(x) {
      return pow(linear.invert(x));
    };

    scale.base = function(x) {
      if (!arguments.length) return base;
      base = +x;
      return scale.domain(domain);
    };

    scale.domain = function(x) {
      if (!arguments.length) return domain.slice();
      domain = x.map(Number);
      linear.domain(domain.map(log));
      return scale;
    };

    scale.nice = function() {
      var x = nice(linear.domain(), 1);
      linear.domain(x);
      domain = x.map(pow);
      return scale;
    };

    scale.ticks = function() {
      var u = domain[0],
          v = domain[domain.length - 1];
      if (v < u) i = u, u = v, v = i;
      var i = Math.floor(log(u)),
          j = Math.ceil(log(v)),
          k,
          t,
          n = base % 1 ? 2 : base,
          ticks = [];

      if (isFinite(j - i)) {
        if (u > 0) {
          for (--j, k = 1; k < n; ++k) if ((t = pow(i) * k) < u) continue; else ticks.push(t);
          while (++i < j) for (k = 1; k < n; ++k) ticks.push(pow(i) * k);
          for (k = 1; k < n; ++k) if ((t = pow(i) * k) > v) break; else ticks.push(t);
        } else {
          for (++i, k = n - 1; k >= 1; --k) if ((t = pow(i) * k) < u) continue; else ticks.push(t);
          while (++i < j) for (k = n - 1; k >= 1; --k) ticks.push(pow(i) * k);
          for (k = n - 1; k >= 1; --k) if ((t = pow(i) * k) > v) break; else ticks.push(t);
        }
      }

      return ticks;
    };

    scale.tickFormat = function(count, specifier) {
      if (specifier == null) specifier = base === 10 ? tickFormat10 : tickFormatOther;
      else if (typeof specifier !== "function") specifier = format(specifier);
      if (count == null) return specifier;
      var k = Math.min(base, scale.ticks().length / count),
          f = domain[0] > 0 ? (e = 1e-12, Math.ceil) : (e = -1e-12, Math.floor),
          e;
      return function(d) {
        return pow(f(log(d) + e)) / d >= k ? specifier(d) : "";
      };
    };

    scale.copy = function() {
      return newLog(linear.copy(), base, domain);
    };

    return rebind(scale, linear);
  }

  function log() {
    return newLog(linear(), 10, [1, 10]);
  }

  function newIdentity(domain) {

    function scale(x) {
      return +x;
    }

    scale.invert = scale;

    scale.domain = scale.range = function(x) {
      if (!arguments.length) return domain.slice();
      domain = x.map(Number);
      return scale;
    };

    scale.ticks = function(count) {
      return ticks(domain, count);
    };

    scale.tickFormat = function(count, specifier) {
      return tickFormat(domain, count, specifier);
    };

    scale.copy = function() {
      return newIdentity(domain);
    };

    return scale;
  }

  function identity() {
    return newIdentity([0, 1]);
  }

  function category20c() {
    return ordinal().range([
      "#3182bd", "#6baed6", "#9ecae1", "#c6dbef",
      "#e6550d", "#fd8d3c", "#fdae6b", "#fdd0a2",
      "#31a354", "#74c476", "#a1d99b", "#c7e9c0",
      "#756bb1", "#9e9ac8", "#bcbddc", "#dadaeb",
      "#636363", "#969696", "#bdbdbd", "#d9d9d9"
    ]);
  }

  function category20b() {
    return ordinal().range([
      "#393b79", "#5254a3", "#6b6ecf", "#9c9ede",
      "#637939", "#8ca252", "#b5cf6b", "#cedb9c",
      "#8c6d31", "#bd9e39", "#e7ba52", "#e7cb94",
      "#843c39", "#ad494a", "#d6616b", "#e7969c",
      "#7b4173", "#a55194", "#ce6dbd", "#de9ed6"
    ]);
  }

  function category20() {
    return ordinal().range([
      "#1f77b4", "#aec7e8",
      "#ff7f0e", "#ffbb78",
      "#2ca02c", "#98df8a",
      "#d62728", "#ff9896",
      "#9467bd", "#c5b0d5",
      "#8c564b", "#c49c94",
      "#e377c2", "#f7b6d2",
      "#7f7f7f", "#c7c7c7",
      "#bcbd22", "#dbdb8d",
      "#17becf", "#9edae5"
    ]);
  }

  function category10() {
    return ordinal().range([
      "#1f77b4",
      "#ff7f0e",
      "#2ca02c",
      "#d62728",
      "#9467bd",
      "#8c564b",
      "#e377c2",
      "#7f7f7f",
      "#bcbd22",
      "#17becf"
    ]);
  }

  exports.category10 = category10;
  exports.category20 = category20;
  exports.category20b = category20b;
  exports.category20c = category20c;
  exports.identity = identity;
  exports.linear = linear;
  exports.log = log;
  exports.ordinal = ordinal;
  exports.pow = pow;
  exports.quantile = _quantile;
  exports.quantize = quantize;
  exports.sqrt = sqrt;
  exports.threshold = threshold;

}));
},{}],55:[function(require,module,exports){
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
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3YXZlcy11aS5qcyIsImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzcy1jYWxsLWNoZWNrLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGUtY2xhc3MuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZS1jb21wdXRlZC1jbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvZ2V0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvaW50ZXJvcC1yZXF1aXJlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy90by1jb25zdW1hYmxlLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvcmVnZW5lcmF0b3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9yZWdlbmVyYXRvci9ydW50aW1lLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvZDMtc2NhbGUvYnVpbGQvc2NhbGUuanMiLCJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL2J1aWxkL2QzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0lDMURxQixZQUFZO0FBQ3BCLFdBRFEsWUFBWSxHQUNMO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFETCxZQUFZOztBQUU3QixRQUFJLENBQUMsY0FBYyxHQUFHLFVBQUksR0FBRyxFQUFFLENBQUM7QUFDaEMsUUFBSSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsYUFBYSxJQUFJLFVBQVUsQ0FBQztBQUMxRCxRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQzs7QUFFbkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztHQUMvRDs7ZUFQa0IsWUFBWTtBQVMvQixjQUFVO2FBQUEsb0JBQUMsS0FBSyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO09BQ3JCOztBQUVELFdBQU87YUFBQSxtQkFBRyxFQUVUOztBQUVELGVBQVc7YUFBQSx1QkFBRztBQUNaLGVBQU8sRUFBRSxDQUFDO09BQ1g7O0FBTUcsaUJBQWE7V0FKQSxVQUFDLEtBQUssRUFBRTtBQUN2QixZQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztPQUM3QjtXQUVnQixZQUFHO0FBQ2xCLGVBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztPQUM1Qjs7QUFFRyxpQkFBYTtXQUFBLFlBQUc7QUFDbEIsNENBQVcsSUFBSSxDQUFDLGNBQWMsR0FBRTtPQUNqQzs7QUFNRCxVQUFNOzs7Ozs7O2FBQUEsZ0JBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUNuQixhQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDeEMsWUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDaEM7O0FBTUQsWUFBUTs7Ozs7OzthQUFBLGtCQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDckIsYUFBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzNDLFlBQUksQ0FBQyxjQUFjLFVBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUNuQzs7QUFPRCxtQkFBZTs7Ozs7Ozs7YUFBQSx5QkFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQzVCLFlBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLFVBQVUsR0FBRyxRQUFRLENBQUM7QUFDdEUsWUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ3JCOztBQUtELFFBQUk7Ozs7OzthQUFBLGNBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUVwRDs7OztTQWxFa0IsWUFBWTs7O2lCQUFaLFlBQVk7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQTFCLFlBQVksMkJBQU0saUJBQWlCOztJQUdyQixrQkFBa0I7V0FBbEIsa0JBQWtCOzBCQUFsQixrQkFBa0I7Ozs7Ozs7WUFBbEIsa0JBQWtCOztlQUFsQixrQkFBa0I7QUFFckMsUUFBSTthQUFBLGNBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtBQUNuRCxZQUFNLElBQUksR0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztBQUMvQixZQUFNLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7O0FBRTVDLFlBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDeEQsWUFBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFekQsWUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNyQixZQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUVyQixZQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOztBQUVuQixjQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQzttQkFBSyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztXQUFBLENBQUMsQ0FBQztBQUN4RSxjQUFJLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7bUJBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDO1dBQUEsQ0FBQyxDQUFDOztBQUVwQyxjQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUU5QixjQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQzFELG1CQUFPLEdBQUcsQ0FBQyxDQUFDO1dBQ2I7U0FDRjs7O0FBR0QsWUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO0FBQ2YsaUJBQU8sR0FBRyxDQUFDLENBQUM7U0FDYixNQUFNLElBQUksT0FBTyxHQUFHLFdBQVcsRUFBRTtBQUNoQyxpQkFBTyxHQUFHLFdBQVcsQ0FBQztTQUN2Qjs7O0FBR0QsYUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQzlELGFBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztPQUNoRTs7OztTQWxDa0Isa0JBQWtCO0dBQVMsWUFBWTs7aUJBQXZDLGtCQUFrQjs7Ozs7Ozs7Ozs7OztJQUhoQyxZQUFZLDJCQUFNLGlCQUFpQjs7SUFHckIsY0FBYztXQUFkLGNBQWM7MEJBQWQsY0FBYzs7Ozs7OztZQUFkLGNBQWM7O2VBQWQsY0FBYztBQUVqQyxRQUFJO2FBQUEsY0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFO0FBQ25ELFlBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdkQsWUFBSSxPQUFPLEdBQUcsQUFBQyxDQUFDLEdBQUcsRUFBRSxHQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFeEMsYUFBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO09BQzlEOzs7O1NBUGtCLGNBQWM7R0FBUyxZQUFZOztpQkFBbkMsY0FBYzs7Ozs7Ozs7Ozs7OztJQUg1QixZQUFZLDJCQUFNLGlCQUFpQjs7SUFHckIsZUFBZTtXQUFmLGVBQWU7MEJBQWYsZUFBZTs7Ozs7OztZQUFmLGVBQWU7O2VBQWYsZUFBZTtBQUNsQyxRQUFJO2FBQUEsY0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFO0FBQ25ELFlBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDbkMsWUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUVwQixZQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUMvRCxnQkFBTSxHQUFHLFlBQVksQ0FBQztTQUN2QixNQUFNLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ3ZFLGdCQUFNLEdBQUcsYUFBYSxDQUFDO1NBQ3hCOztBQUVELFlBQUksT0FBSyxNQUFNLENBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7T0FDcEU7O0FBRUQsU0FBSzthQUFBLGVBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtBQUNwRCxZQUFNLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7O0FBRTVDLFlBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdkQsWUFBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN4RCxZQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUVsRSxZQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsWUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7O0FBR3JCLFlBQUksT0FBTyxHQUFHLENBQUMsRUFBRTtBQUNmLGlCQUFPLEdBQUcsQ0FBQyxDQUFDO1NBQ2IsTUFBTSxJQUFJLE9BQU8sR0FBRyxNQUFNLEdBQUcsV0FBVyxFQUFFO0FBQ3pDLGlCQUFPLEdBQUcsV0FBVyxHQUFHLE1BQU0sQ0FBQztTQUNoQzs7QUFFRCxhQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDN0QsYUFBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO09BQy9EOztBQUVELGVBQVc7YUFBQSxxQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFOztBQUUxRCxZQUFNLENBQUMsR0FBTyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQzNELFlBQU0sS0FBSyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7O0FBRS9ELFlBQUksVUFBVSxHQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDNUIsWUFBSSxPQUFPLEdBQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoRSxZQUFJLFdBQVcsR0FBRyxPQUFPLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7O0FBRWxFLGFBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUM3RCxhQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7T0FDdEU7O0FBRUQsZ0JBQVk7YUFBQSxzQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFOztBQUUzRCxZQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUUvRCxZQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRTFDLGFBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztPQUN0RTs7OztTQXZEa0IsZUFBZTtHQUFTLFlBQVk7O2lCQUFwQyxlQUFlOzs7Ozs7Ozs7SUFIZixtQkFBbUI7V0FBbkIsbUJBQW1COzBCQUFuQixtQkFBbUI7OztlQUFuQixtQkFBbUI7QUFDdEMsUUFBSTthQUFBLGNBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFO0FBQzFCLFlBQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7O0FBRXRDLFlBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDN0UsY0FBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDakMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ3JGLGNBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ2xDLE1BQU0sSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUMvQyxjQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUM3QjtPQUNGOztBQUVELGFBQVM7YUFBQSxtQkFBQyxXQUFXLEVBQUUsRUFBRSxFQUFFOztBQUV6QixZQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUQsWUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0QsWUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRTVELFlBQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdkIsWUFBTSxZQUFZLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNqQyxZQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRTVDLG1CQUFXLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNuRSxtQkFBVyxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNsRSxtQkFBVyxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztPQUNwRTs7QUFFRCxjQUFVO2FBQUEsb0JBQUMsV0FBVyxFQUFFLEVBQUUsRUFBRTtBQUMxQixZQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM1RCxZQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRTVDLG1CQUFXLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO09BQ3BFOztBQUVELFNBQUs7YUFBQSxlQUFDLFdBQVcsRUFBRSxFQUFFLEVBQUU7QUFDckIsWUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVELFlBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFcEMsbUJBQVcsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQ3BFOztBQUVELFdBQU87YUFBQSxpQkFBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7QUFDN0IsWUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztBQUN0QyxZQUFNLFlBQVksR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDO0FBQzFDLFlBQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7O0FBRXRDLFlBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRWpDLFlBQU0sV0FBVyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUM7QUFDekMsWUFBTSxLQUFLLEdBQUksV0FBVyxHQUFHLFlBQVksQUFBQyxDQUFDOztBQUUzQyxtQkFBVyxDQUFDLFlBQVksSUFBSSxLQUFLLENBQUM7QUFDbEMsbUJBQVcsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO0FBQ2hDLG1CQUFXLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQztPQUNyQzs7OztTQXZEa0IsbUJBQW1COzs7aUJBQW5CLG1CQUFtQjs7Ozs7Ozs7Ozs7OztJQUFqQyxZQUFZLDJCQUFNLGlCQUFpQjs7SUFHckIsYUFBYTtXQUFiLGFBQWE7MEJBQWIsYUFBYTs7Ozs7OztZQUFiLGFBQWE7O2VBQWIsYUFBYTtBQUNoQyxRQUFJO2FBQUEsY0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFOzs7QUFHbkQsWUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUNyQyxjQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ3hELE1BQU0sSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUMzQyxjQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNoRSxNQUFNLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDM0MsY0FBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDaEU7T0FDRjs7QUFFRCxhQUFTO2FBQUEsbUJBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFOztBQUVoRCxZQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELFlBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7O0FBRTNELFlBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDckIsWUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7QUFFckIsYUFBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQzdELGFBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztPQUNsRTs7QUFFRCxjQUFVO2FBQUEsb0JBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRTtBQUM1RCxZQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUVoRSxZQUFJLFdBQVcsR0FBRyxTQUFTLEtBQUssS0FBSyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3hFLG1CQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRXZDLGFBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztPQUN2RTs7OztTQWhDa0IsYUFBYTtHQUFTLFlBQVk7O2lCQUFsQyxhQUFhOzs7Ozs7Ozs7OztJQUgzQixPQUFPLDJCQUFNLFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTJCVCxnQkFBZ0I7QUFDeEIsV0FEUSxnQkFBZ0IsQ0FDdkIsTUFBTSxFQUFFOzBCQURELGdCQUFnQjs7QUFFakMsUUFBSSxDQUFDLE1BQU0sRUFBRTtBQUFFLFlBQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztLQUFFOztBQUV4RSxRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFckIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7O0FBRXpCLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQztBQUN4QyxRQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztBQUNqQixRQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQzs7QUFFdkIsUUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ2xDOztlQWRrQixnQkFBZ0I7QUFnQm5DLFNBQUs7YUFBQSxpQkFBRztBQUNOLFlBQU0sR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7O0FBRXZCLFdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUN6QixXQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDdkIsV0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQzdCLFdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUN6QixXQUFHLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7O0FBRXJDLGVBQU8sR0FBRyxDQUFDO09BQ1o7O0FBTUcsU0FBSztXQUpBLFlBQUc7QUFDVixlQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7T0FDcEI7V0FFUSxVQUFDLEtBQUssRUFBRTtBQUNmLFlBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO09BQ3JCOztBQU1HLFlBQVE7V0FKQSxZQUFHO0FBQ2IsZUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDO09BQ3ZCO1dBRVcsVUFBQyxLQUFLLEVBQUU7QUFDbEIsWUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7T0FDeEI7O0FBTUcsVUFBTTtXQUpBLFlBQUc7QUFDWCxlQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7T0FDckI7V0FFUyxVQUFDLEtBQUssRUFBRTtBQUNoQixZQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztPQUN0Qjs7QUFNRyxnQkFBWTtXQUpBLFlBQUc7QUFDakIsZUFBTyxJQUFJLENBQUMsYUFBYSxDQUFDO09BQzNCO1dBRWUsVUFBQyxLQUFLLEVBQUU7O0FBRXRCLFlBQUksS0FBSyxLQUFNLENBQUMsRUFBRTtBQUNoQixjQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztBQUN6QixpQkFBTztTQUNSOztBQUVELFlBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQ25DLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV0RCxtQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLHVCQUF1QixHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7O0FBRXBFLFlBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO0FBQ2hDLFlBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO09BQzVCOztBQUdHLGVBQVc7Ozs7V0FBQSxZQUFHO0FBQ2hCLFlBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ3RCLGlCQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO1NBQ2hDOztBQUVELGVBQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztPQUMxQjs7OztTQS9Fa0IsZ0JBQWdCOzs7aUJBQWhCLGdCQUFnQjs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEzQjlCLE9BQU8sMkJBQU0sVUFBVTs7SUFDdkIsV0FBVywyQkFBTSxjQUFjOztJQUMvQixNQUFNLDJCQUFNLFFBQVE7O0lBRXBCLEVBQUUsMkJBQU0sYUFBYTs7SUFDckIsT0FBTywyQkFBTSxtQkFBbUI7O0lBQ2hDLG1CQUFtQiwyQkFBTSxvQ0FBb0M7OztBQUdwRSxJQUFJLG1CQUFtQixHQUFHLElBQUksQ0FBQztBQUMvQixJQUFJLHVCQUF1QixHQUFHLG1CQUFtQixDQUFDOzs7QUFHbEQsSUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLElBQU0sV0FBVyxHQUFHLFVBQUksR0FBRyxFQUFFLENBQUM7O0lBRVQsS0FBSzs7Ozs7Ozs7Ozs7Ozs7QUFhYixXQWJRLEtBQUssQ0FhWixRQUFRLEVBQUUsSUFBSSxFQUFnQjtRQUFkLE9BQU8sZ0NBQUcsRUFBRTs7MEJBYnJCLEtBQUs7O0FBY3RCLHFDQWRpQixLQUFLLDZDQWNkO0FBQ1IsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDekIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWpCLFFBQU0sUUFBUSxHQUFHO0FBQ2YsWUFBTSxFQUFFLEdBQUc7QUFDWCxTQUFHLEVBQUUsQ0FBQztBQUNOLFFBQUUsRUFBRSxFQUFFO0FBQ04sYUFBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNmLGFBQU8sRUFBRSxDQUFDO0FBQ1Ysa0JBQVksRUFBRSxLQUFLO0FBQ25CLHlCQUFtQixFQUFFLENBQUM7S0FDdkIsQ0FBQzs7QUFFRixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ25ELFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDOzs7QUFHeEIsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDaEIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDekIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEIsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7O0FBRTFCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOztBQUVwQixRQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0FBQ2hDLFFBQUksQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLENBQUM7O0FBRXRDLFFBQUksQ0FBQyxjQUFjLEdBQUcsVUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNoQyxRQUFJLENBQUMsb0JBQW9CLEdBQUcsVUFBSSxHQUFHLEVBQUUsQ0FBQztBQUN0QyxRQUFJLENBQUMsb0JBQW9CLEdBQUcsVUFBSSxHQUFHLEVBQUUsQ0FBQzs7QUFFdEMsUUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztBQUNoQyxRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzs7QUFFdEIsUUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUMzQixLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOztBQUVsQyxRQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQzs7O0FBRzFCLFFBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDOzs7QUFHeEIsUUFBSSxtQkFBbUIsS0FBSyxJQUFJLEVBQUU7QUFDaEMseUJBQW1CLEdBQUcsSUFBSSx1QkFBdUIsRUFBRSxDQUFDO0tBQ3JEO0dBQ0Y7O1lBOURrQixLQUFLOztlQUFMLEtBQUs7QUEyRXBCLFNBQUs7V0FKQSxZQUFHO0FBQ1YsZUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztPQUMvQjtXQUVRLFVBQUMsS0FBSyxFQUFFO0FBQ2YsWUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO09BQ2hDOztBQU1HLFVBQU07V0FKQSxZQUFHO0FBQ1gsZUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztPQUNoQztXQUVTLFVBQUMsS0FBSyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztPQUNqQzs7QUFNRyxZQUFRO1dBSkEsWUFBRztBQUNiLGVBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7T0FDbEM7V0FFVyxVQUFDLEtBQUssRUFBRTtBQUNsQixZQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7T0FDbkM7O0FBTUcsZ0JBQVk7V0FKQSxZQUFHO0FBQ2pCLGVBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUM7T0FDdEM7V0FFZSxVQUFDLEtBQUssRUFBRTtBQUN0QixZQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7T0FDdkM7O0FBb0JHLFdBQU87Ozs7Ozs7Ozs7Ozs7OztXQUxBLFVBQUMsTUFBTSxFQUFFO0FBQ2xCLFlBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUM3QixZQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUNuQztXQUVVLFlBQUc7QUFDWixlQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO09BQzVCOztBQU1HLFdBQU87V0FKQSxVQUFDLEtBQUssRUFBRTtBQUNqQixZQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7T0FDN0I7V0FFVSxZQUFHO0FBQ1osZUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztPQUM1Qjs7QUFVRCxrQkFBYzs7Ozs7Ozs7Ozs7YUFBQSx3QkFBQyxXQUFXLEVBQUU7QUFDMUIsWUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7O0FBRS9CLFlBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7QUFDNUIsWUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7T0FDaEM7O0FBUUcsUUFBSTs7Ozs7O1dBRkEsWUFBRztBQUFFLGVBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztPQUFFO1dBRXpCLFVBQUMsSUFBSSxFQUFFO0FBQ2IsZ0JBQVEsSUFBSSxDQUFDLFFBQVE7QUFDbkIsZUFBSyxRQUFRO0FBQ1gsZ0JBQUksSUFBSSxDQUFDLEtBQUssRUFBRTs7QUFDZCxrQkFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDdEIsTUFBTTtBQUNMLGtCQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDckI7QUFDRCxrQkFBTTtBQUFBLEFBQ1IsZUFBSyxZQUFZO0FBQ2YsZ0JBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLGtCQUFNO0FBQUEsU0FDVDtPQUNGOztBQVFELG9CQUFnQjs7Ozs7Ozs7O2FBQUEsNEJBQUc7Ozs7QUFFakIsWUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM3QyxZQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRWhDLFlBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDeEQsWUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUVoRCxZQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2pELFlBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRTlDLFlBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDeEQsWUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN4RCxZQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZELFlBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM3QyxZQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDLFlBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUM7O0FBRTlDLFlBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdkQsWUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ2pELFlBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7O0FBRTFDLFlBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUNsQyxZQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQztBQUN4QixpQkFBTyxFQUFFO21CQUFNLEdBQUc7V0FBQTtBQUNsQixlQUFLLEVBQUk7bUJBQU0sU0FBUztXQUFBO0FBQ3hCLGVBQUssRUFBSTttQkFBTSxNQUFLLFdBQVcsQ0FBQyxRQUFRO1dBQUE7QUFDeEMsZ0JBQU0sRUFBRzttQkFBTSxNQUFLLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7V0FBQTtBQUM5RCxXQUFDLEVBQVE7bUJBQU0sTUFBSyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1dBQUE7U0FDL0QsQ0FBQyxDQUFDOztBQUVILFlBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzs7QUFFM0QsWUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3hDLFlBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM1QyxZQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDM0MsWUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDOzs7QUFHbEQsWUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtBQUNyQixjQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzFELGNBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMvQyxjQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3ZDLGNBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7U0FDekM7T0FDRjs7QUFZRCxrQkFBYzs7Ozs7Ozs7Ozs7OzthQUFBLHdCQUFDLElBQUksRUFBZ0M7WUFBOUIsU0FBUyxnQ0FBRyxFQUFFO1lBQUUsT0FBTyxnQ0FBRyxFQUFFOztBQUMvQyxZQUFJLENBQUMsbUJBQW1CLEdBQUcsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLFNBQVMsRUFBVCxTQUFTLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxDQUFDO09BQ3pEOztBQVFELHdCQUFvQjs7Ozs7Ozs7O2FBQUEsOEJBQUMsSUFBSSxFQUFnQztZQUE5QixTQUFTLGdDQUFHLEVBQUU7WUFBRSxPQUFPLGdDQUFHLEVBQUU7O0FBQ3JELFlBQUksQ0FBQyx5QkFBeUIsR0FBRyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsU0FBUyxFQUFULFNBQVMsRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLENBQUM7T0FDL0Q7O0FBTUQsZUFBVzs7Ozs7OzthQUFBLHFCQUFDLFFBQVEsRUFBRTtBQUNwQixnQkFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxQixZQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztPQUMzQjs7QUFPRCwyQkFBdUI7Ozs7Ozs7O2FBQUEsbUNBQUc7QUFDeEIsWUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQztBQUNsRSxZQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7QUFDekQsWUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNuRCxZQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxHQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXhGLFlBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUN4Rjs7QUFNRyxpQkFBYTs7Ozs7O1dBQUEsWUFBRztBQUNsQixlQUFPLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO09BQzNEOztBQUVELFVBQU07YUFBQSxrQkFBWTs7OzBDQUFSLE1BQU07QUFBTixnQkFBTTs7O0FBQ2QsWUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFBRSxpQkFBTztTQUFFO0FBQ2hDLFlBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQUUsZ0JBQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQUU7O0FBRXRELGNBQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDdEIsY0FBTSxJQUFJLEdBQUcsTUFBSyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEQsZ0JBQUssU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDekMsZ0JBQUssUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3BCLENBQUMsQ0FBQztPQUNKOztBQUVELFlBQVE7YUFBQSxvQkFBWTs7OzBDQUFSLE1BQU07QUFBTixnQkFBTTs7O0FBQ2hCLFlBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQUUsaUJBQU87U0FBRTtBQUNoQyxZQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtBQUFFLGdCQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUFFOztBQUV0RCxjQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQ3RCLGNBQU0sSUFBSSxHQUFHLE1BQUssb0JBQW9CLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hELGdCQUFLLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQzVDLENBQUMsQ0FBQztPQUNKOztBQUVELG9CQUFnQjthQUFBLDRCQUFZOzs7MENBQVIsTUFBTTtBQUFOLGdCQUFNOzs7QUFDeEIsWUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFBRSxpQkFBTztTQUFFO0FBQ2hDLFlBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQUUsZ0JBQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQUU7O0FBRXRELGNBQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDdEIsY0FBTSxJQUFJLEdBQUcsTUFBSyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEQsZ0JBQUssU0FBUyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUNwRCxDQUFDLENBQUM7T0FDSjs7QUFFRCxRQUFJO2FBQUEsY0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7OztBQUMzQixZQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGlCQUFPO1NBQUU7QUFDaEMsY0FBTSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQzs7QUFFcEQsY0FBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUN0QixjQUFNLElBQUksR0FBSSxNQUFLLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqRCxjQUFNLEtBQUssR0FBRyxNQUFLLGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0MsY0FBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzNCLGdCQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBSyxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDMUUsZ0JBQUssSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDakMsQ0FBQyxDQUFDO09BQ0o7O0FBTUQsc0JBQWtCOzs7Ozs7O2FBQUEsOEJBQWM7WUFBYixJQUFJLGdDQUFHLElBQUk7O0FBQzVCLFlBQU0sT0FBTyxHQUFHLElBQUksR0FBRyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3hDLFlBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDM0MsWUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztPQUNoQzs7QUFFRCxlQUFXO2FBQUEscUJBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7QUFDMUIsMkJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQ2hEOztBQUVELGtCQUFjO2FBQUEsd0JBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7QUFDN0IsMkJBQW1CLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQ25EOztBQVVELFlBQVE7Ozs7Ozs7Ozs7O2FBQUEsa0JBQUMsR0FBRyxFQUFFO0FBQ1osWUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDL0I7O0FBT0QseUJBQXFCOzs7Ozs7OzthQUFBLCtCQUFDLEdBQUcsRUFBRTtBQUN6QixZQUFJLEtBQUssWUFBQSxDQUFDOztBQUVWLFdBQUc7QUFDRCxjQUFJLEdBQUcsQ0FBQyxTQUFTLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDbkQsaUJBQUssR0FBRyxHQUFHLENBQUM7QUFDWixrQkFBTTtXQUNQOztBQUVELGFBQUcsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDO1NBQ3RCLFFBQVEsR0FBRyxLQUFLLElBQUksRUFBRTs7QUFFdkIsZUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7T0FDM0M7O0FBUUQsb0JBQWdCOzs7Ozs7Ozs7YUFBQSwwQkFBQyxLQUFLLEVBQUU7QUFDdEIsWUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwRCxlQUFPLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDO09BQ3ZDOztBQU9ELFdBQU87Ozs7Ozs7O2FBQUEsaUJBQUMsS0FBSyxFQUFFO0FBQ2IsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNuQyxlQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7T0FDcEM7O0FBUUQsY0FBVTs7Ozs7Ozs7O2FBQUEsb0JBQUMsR0FBRyxFQUFFO0FBQ2QsV0FBRztBQUNELGNBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFDcEIsbUJBQU8sSUFBSSxDQUFDO1dBQ2I7O0FBRUQsYUFBRyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUM7U0FDdEIsUUFBUSxHQUFHLEtBQUssSUFBSSxFQUFFOztBQUV2QixlQUFPLEtBQUssQ0FBQztPQUNkOztBQU1ELGtCQUFjOzs7Ozs7O2FBQUEsd0JBQUMsSUFBSSxFQUFFO0FBQ25CLFlBQU0sS0FBSyxHQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdEUsWUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN6RSxZQUFNLE1BQU0sR0FBSyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZFLFlBQU0sR0FBRyxHQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDOztBQUVqQyxZQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDcEMsWUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDO0FBQzVELFVBQUUsSUFBSyxLQUFLLEdBQUcsTUFBTSxBQUFDLENBQUM7QUFDdkIsVUFBRSxJQUFLLEtBQUssR0FBRyxNQUFNLEFBQUMsQ0FBQzs7QUFFdkIsWUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFBLEFBQUMsQ0FBQztBQUN2RCxZQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDOztBQUV2QyxVQUFFLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDdEIsVUFBRSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDOztBQUV0QixZQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO0FBQ3pDLFlBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDOztBQUVoRCxZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFTLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDdkQsY0FBTSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ25CLGNBQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdEMsaUJBQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDOUQsQ0FBQyxDQUFDOztBQUVILGVBQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUMxQjs7QUFxQkQsVUFBTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2FBQUEsa0JBQUc7Ozs7QUFFUCxZQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFTLEtBQUssRUFBRTtBQUNoQyxjQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFBRSxtQkFBTztXQUFFO0FBQ3ZDLHFCQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQ3BDLENBQUMsQ0FBQzs7O0FBR0gsWUFBSSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FDNUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUNsQixNQUFNLENBQUMsWUFBVztBQUNqQixpQkFBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzNDLENBQUMsQ0FDRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFTLEtBQUssRUFBRTtBQUMvQixpQkFBTyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQy9CLENBQUMsQ0FBQzs7O0FBR0wsWUFDRSxJQUFJLENBQUMseUJBQXlCLEtBQUssSUFBSSxJQUN2QyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFDcEM7MENBQ3FDLElBQUksQ0FBQyx5QkFBeUI7Y0FBM0QsSUFBSSw2QkFBSixJQUFJO2NBQUUsU0FBUyw2QkFBVCxTQUFTO2NBQUUsT0FBTyw2QkFBUCxPQUFPOztBQUNoQyxjQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNqRCxjQUFNLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFaEMsZUFBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN6QixnQkFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUNuQyxnQkFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQzs7QUFFN0QsY0FBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDN0MsY0FBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbEM7OztBQUdELFlBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQ2pCLE1BQU0sQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLLEVBQUs7O29DQUVhLE1BQUssbUJBQW1CO2NBQXJELElBQUksdUJBQUosSUFBSTtjQUFFLFNBQVMsdUJBQVQsU0FBUztjQUFFLE9BQU8sdUJBQVAsT0FBTzs7QUFDaEMsY0FBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDaEMsZUFBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFekIsY0FBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFLLGlCQUFpQixDQUFDLENBQUM7QUFDakQsYUFBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDOztBQUVoRCxnQkFBSyxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNwQyxnQkFBSyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFNUQsaUJBQU8sR0FBRyxDQUFDO1NBQ1osQ0FBQyxDQUFDOzs7QUFHTCxZQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO0FBQzNDLFlBQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDOztBQUV2RCxZQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUNoQixJQUFJLENBQUMsVUFBUyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQzNCLGNBQU0sR0FBRyxHQUFHLElBQUksQ0FBQztBQUNqQixjQUFNLEtBQUssR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUV0QyxlQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDaEIscUJBQVcsVUFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFCLHdCQUFjLFVBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzQiw4QkFBb0IsVUFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xDLENBQUMsQ0FDRCxNQUFNLEVBQUUsQ0FBQztPQUNiOztBQUtELFVBQU07Ozs7OzthQUFBLGtCQUFHO0FBQ1AsWUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3ZCLFlBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztPQUNyQjs7QUFLRCxtQkFBZTs7Ozs7O2FBQUEsMkJBQUc7QUFDaEIsWUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7O0FBRS9CLFlBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7O0FBRXJDLFlBQU0sS0FBSyxHQUFJLFdBQVcsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUU3RCxZQUFNLENBQUMsR0FBUSxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakUsWUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0QsWUFBTSxHQUFHLEdBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDL0IsWUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7O0FBRWxDLFlBQU0sZUFBZSw0QkFBMEIsQ0FBQyxXQUFLLEdBQUcsR0FBRyxNQUFNLENBQUEsTUFBRyxDQUFDOztBQUVyRSxZQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLGVBQWUsQ0FBQyxDQUFDOztBQUU1RCxZQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3ZELFlBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDekQsWUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDOztBQUV0RCxZQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxpQkFBZSxNQUFNLFVBQU8sQ0FBQzs7O0FBRzFFLFlBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUN0QixJQUFJLENBQUMsaUJBQWlCLEVBQ3RCLElBQUksQ0FBQyxhQUFhLEVBQ2xCLElBQUksQ0FBQyxXQUFXLEVBQ2hCLENBQUMsQ0FDRixDQUFDOzs7QUFHRixZQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQ3JCLGNBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDckQsY0FBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUN4RDtPQUNGOztBQU1ELGdCQUFZOzs7Ozs7O2FBQUEsd0JBQWU7OztZQUFkLEtBQUssZ0NBQUcsSUFBSTs7QUFDdkIsWUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7O0FBRS9CLFlBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztBQUNsQixZQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztBQUNoRCxZQUFNLEtBQUssR0FBRyxLQUFLLEtBQUssSUFBSSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQzs7QUFFbkYsWUFBSSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLLEVBQUs7QUFDbEQsZUFBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxNQUFLLElBQUksQ0FBQyxDQUFDO1NBQzNDLENBQUMsQ0FBQzs7O0FBR0gsYUFBSyxDQUFDLElBQUksQ0FBQyxVQUFTLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDaEMsY0FBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUMsZUFBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDOUMsQ0FBQyxDQUFDO09BQ0o7OztBQW5oQk0sZ0NBQTRCOzs7Ozs7YUFBQSxzQ0FBQyxJQUFJLEVBQUU7QUFDeEMsK0JBQXVCLEdBQUcsSUFBSSxDQUFDO09BQ2hDOzs7O1NBckVrQixLQUFLO0dBQVMsTUFBTSxDQUFDLFlBQVk7O2lCQUFqQyxLQUFLOzs7OztpQkFoQlgsNEJBQTRCOzs7Ozs7Ozs7OztJQUFwQyxPQUFPLDJCQUFNLFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBaUJULG1CQUFtQjtBQUMzQixXQURRLG1CQUFtQixDQUMxQixlQUFlLEVBQUUsWUFBWSxFQUFFOzBCQUR4QixtQkFBbUI7O0FBRXBDLFFBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDOzs7QUFHcEIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7OztBQUd6QixRQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztBQUNqQixRQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNmLFFBQUksQ0FBQyx3QkFBd0IsR0FBRyxlQUFlLENBQUM7O0FBRWhELFFBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO0FBQ2xDLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQztBQUMxRSxRQUFJLENBQUMsd0JBQXdCLEdBQUcsS0FBSyxDQUFDOzs7QUFHdEMsUUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUMzQixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FDZCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQzs7QUFFL0IsUUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7OztBQUd6QixRQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDO0dBQy9EOztlQXpCa0IsbUJBQW1CO0FBK0JsQyxtQkFBZTtXQUpBLFlBQUc7QUFDcEIsZUFBTyxJQUFJLENBQUMsd0JBQXdCLENBQUM7T0FDdEM7V0FFa0IsVUFBQyxLQUFLLEVBQUU7QUFDekIsWUFBSSxDQUFDLHdCQUF3QixHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ2xELFlBQUksQ0FBQyx3QkFBd0IsR0FBRyxLQUFLLENBQUM7QUFDdEMsWUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7OztBQUcvQixZQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFTLEtBQUssRUFBRTtBQUNyQyxjQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRTtBQUFFLG1CQUFPO1dBQUU7QUFDcEMsZUFBSyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO1NBQ3pDLENBQUMsQ0FBQztPQUNKOztBQUVHLDJCQUF1QjtXQUFBLFlBQUc7QUFDNUIsZUFBTyxJQUFJLENBQUMsd0JBQXdCLENBQUM7T0FDdEM7O0FBTUcsVUFBTTtXQUpBLFlBQUc7QUFDWCxlQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7T0FDckI7V0FFUyxVQUFDLEtBQUssRUFBRTtBQUNoQixZQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztPQUN0Qjs7QUFNRyxRQUFJO1dBSkEsWUFBRztBQUNULGVBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztPQUNuQjtXQUVPLFVBQUMsS0FBSyxFQUFFOztBQUVkLFlBQU0sV0FBVyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3ZDLFlBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLFlBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsd0JBQXdCLEdBQUcsS0FBSyxDQUFDO0FBQ3RFLFlBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDOztBQUUvQixZQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFTLEtBQUssRUFBRTtBQUNyQyxjQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRTtBQUFFLG1CQUFPO1dBQUU7QUFDcEMsZUFBSyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztTQUN2RCxDQUFDLENBQUM7T0FDSjs7QUFNRyxnQkFBWTtXQUpBLFlBQUc7QUFDakIsZUFBTyxJQUFJLENBQUMsYUFBYSxDQUFDO09BQzNCO1dBRWUsVUFBQyxLQUFLLEVBQUU7QUFDdEIsWUFBTSxVQUFVLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7O0FBRTdDLFlBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO0FBQzNCLFlBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQzs7QUFFMUUsWUFBSSxJQUFJLENBQUMsdUJBQXVCLEVBQUU7QUFDaEMsY0FBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsd0JBQXdCLEdBQUcsVUFBVSxDQUFDO1NBQ25FO09BQ0Y7O0FBR0csbUJBQWU7Ozs7V0FBQSxZQUFHO0FBQ3BCLGVBQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDO09BQzlCOztBQU1HLDJCQUF1QjtXQUpBLFlBQUc7QUFDNUIsZUFBTyxJQUFJLENBQUMsd0JBQXdCLENBQUM7T0FDdEM7V0FFMEIsVUFBQyxJQUFJLEVBQUU7QUFDaEMsWUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQztPQUN0Qzs7QUFNRyxlQUFXO1dBSkEsWUFBRztBQUNoQixlQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7T0FDMUI7V0FFYyxVQUFDLEtBQUssRUFBRTtBQUNyQixZQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztPQUMzQjs7QUFFRCwyQkFBdUI7YUFBQSxtQ0FBRztBQUN4QixZQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUM7QUFDMUUsWUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQztPQUM1RDs7OztTQS9Ha0IsbUJBQW1COzs7aUJBQW5CLG1CQUFtQjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWpCakMsTUFBTSwyQkFBTSxRQUFROztJQUVwQixRQUFRLDJCQUFNLDBCQUEwQjs7SUFDeEMsZ0JBQWdCLDJCQUFNLHNCQUFzQjs7SUFDNUMsT0FBTywyQkFBTSx5QkFBeUI7O0lBQ3RDLG1CQUFtQiwyQkFBTSx5QkFBeUI7O0lBQ2xELEtBQUssMkJBQU0sU0FBUzs7SUFDcEIsZUFBZSwyQkFBTSxvQkFBb0I7Ozs7Ozs7Ozs7SUFVM0IsUUFBUTs7Ozs7QUFJaEIsV0FKUSxRQUFRLEdBSTZCO1FBQTVDLGVBQWUsZ0NBQUcsR0FBRztRQUFFLFlBQVksZ0NBQUcsSUFBSTs7MEJBSm5DLFFBQVE7O0FBS3pCLHFDQUxpQixRQUFRLDZDQUtqQjs7QUFFUixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pDLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDOzs7QUFHbkIsUUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUM7QUFDNUIsUUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQzs7O0FBR3pDLFFBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDOztBQUV6QixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksbUJBQW1CLENBQUMsZUFBZSxFQUFFLFlBQVksQ0FBQyxDQUFDO0dBQzNFOztZQW5Ca0IsUUFBUTs7dUJBQVIsUUFBUTs7Ozs7O1NBd0JqQixZQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztLQUNoQztTQUVTLFVBQUMsS0FBSyxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztLQUNqQzs7O1NBRU8sWUFBRztBQUNULGFBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7S0FDOUI7U0FFTyxVQUFDLEtBQUssRUFBRTtBQUNkLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztLQUMvQjs7O1NBRWtCLFlBQUc7QUFDcEIsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQztLQUN6QztTQUVrQixVQUFDLEtBQUssRUFBRTtBQUN6QixVQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7S0FDMUM7OztTQUVlLFlBQUc7QUFDakIsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQztLQUN0QztTQUVlLFVBQUMsS0FBSyxFQUFFO0FBQ3RCLFVBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztLQUN2Qzs7O1NBRWMsWUFBRztBQUNoQixhQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDO0tBQ3JDOzs7Ozs7O1NBS2tCLFlBQUc7QUFDcEIsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQztLQUN6Qzs7Ozs7U0FHMEIsVUFBQyxJQUFJLEVBQUU7QUFDaEMsVUFBSSxDQUFDLFdBQVcsQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUM7S0FDakQ7U0FFMEIsWUFBRztBQUM1QixhQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsdUJBQXVCLENBQUM7S0FDakQ7Ozs7O1NBR2dCLFlBQUc7QUFDbEIsYUFBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0tBQzVCOzs7Ozs7OztXQU1lLDBCQUFDLElBQUksRUFBRTtBQUNyQixVQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztLQUMxQjs7Ozs7Ozs7Ozs7O1dBVWdCLDJCQUFDLElBQUksRUFBRSxFQUFFLEVBQWdCOzs7VUFBZCxPQUFPLGdDQUFHLEVBQUU7O0FBQ3RDLFVBQU0sV0FBVyxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMxQyxpQkFBVyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBQyxDQUFDO2VBQUssTUFBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUFDO0tBQ3REOzs7Ozs7OztXQU1XLHNCQUFDLENBQUMsRUFBRTs7QUFFZCxVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFdEIsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFBRSxlQUFPO09BQUU7QUFDN0IsVUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDNUI7Ozs7Ozs7O1NBT1EsVUFBQyxLQUFLLEVBQUU7QUFDZixVQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFBRSxZQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO09BQUU7QUFDeEMsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDcEIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNyQjtTQUVRLFlBQUc7QUFDVixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7S0FDcEI7Ozs7Ozs7O1NBTVMsWUFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztLQUNyQjs7Ozs7Ozs7U0FNUyxZQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztLQUM1Qjs7Ozs7Ozs7O1dBT0UsYUFBQyxLQUFLLEVBQUU7QUFDVCxVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3JDLGNBQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztPQUN4RDs7QUFFRCxXQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFbEMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEIsVUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3REOzs7Ozs7OztXQU1LLGdCQUFDLEtBQUssRUFBRSxFQUViOzs7Ozs7Ozs7OztXQVNVLHFCQUFDLEdBQUcsRUFBcUM7VUFBbkMsV0FBVyxnQ0FBRyxHQUFHO1VBQUUsT0FBTyxnQ0FBRyxJQUFJOztBQUNoRCxVQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7O0FBRTFDLFVBQUksT0FBTyxLQUFLLElBQUksRUFBRTtBQUNwQixZQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssU0FBUyxFQUFFO0FBQzFDLGdCQUFNLElBQUksS0FBSyxpQkFBYyxPQUFPLHdCQUFvQixDQUFDO1NBQzFEOztBQUVELFlBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDO09BQ2xDOzs7QUFHRCxVQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hCLFdBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNmLFdBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7QUFFZixhQUFPLEtBQUssQ0FBQztLQUNkOzs7Ozs7Ozs7O1dBUU8sa0JBQUMsS0FBSyxFQUFFLGNBQWMsRUFBdUI7VUFBckIsT0FBTyxnQ0FBRyxTQUFTOztBQUNqRCxVQUFJLEtBQUssR0FBRyxjQUFjLENBQUM7O0FBRTNCLFVBQUksT0FBTyxjQUFjLEtBQUssUUFBUSxFQUFFO0FBQ3RDLGFBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDO09BQzNDOzs7QUFHRCxVQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRTtBQUN0QixZQUFNLFdBQVcsR0FBRyxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUMzRCxhQUFLLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO09BQ25DOzs7QUFHRCxXQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVqQixVQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNqQyxZQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztPQUNuQzs7QUFFRCxVQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFekMsV0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2YsV0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2hCOzs7Ozs7OztXQU1VLHFCQUFDLEtBQUssRUFBRTtBQUNqQixVQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFTLEtBQUssRUFBRTtBQUNsQyxZQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxQyxZQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtBQUFFLGVBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FBRTtPQUMzQyxDQUFDLENBQUM7OztBQUdILFdBQUssSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtBQUN2QyxZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNDLFlBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRW5DLFlBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FBRTs7QUFFN0MsWUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDakIsaUJBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNyQztPQUNGO0tBQ0Y7Ozs7Ozs7OztXQU9XLHNCQUFDLE9BQU8sRUFBRTtBQUNwQixhQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDakM7Ozs7Ozs7OztXQU9lLDBCQUFDLE9BQU8sRUFBRTtBQUN4QixhQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDckM7O1NBRUMsTUFBQSxNQUFNLENBQUMsUUFBUTtvQ0FBQzs7Ozs7O29FQUNULE1BQUssTUFBTTs7Ozs7OztLQUNuQjs7O1NBOVFrQixRQUFRO0dBQVMsTUFBTSxDQUFDLFlBQVk7O2lCQUFwQyxRQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBakJ0QixLQUFLLDJCQUFNLFNBQVM7Ozs7OztJQUlOLGVBQWU7QUFDdkIsV0FEUSxlQUFlLENBQ3RCLFFBQVEsRUFBRTswQkFESCxlQUFlOztBQUVoQyxxQ0FGaUIsZUFBZSw2Q0FFeEI7O0FBRVIsUUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7R0FDM0I7O1lBTGtCLGVBQWU7O2VBQWYsZUFBZTtBQVNsQyxzQkFBa0I7Ozs7O2FBQUEsOEJBQXNCO1lBQXJCLFlBQVksZ0NBQUcsSUFBSTs7QUFDcEMsWUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDOztBQUVsQixZQUFJLE9BQU8sWUFBWSxLQUFLLFFBQVEsRUFBRTtBQUNwQyxnQkFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ3JELE1BQU0sSUFBSSxZQUFZLFlBQVksS0FBSyxFQUFFO0FBQ3hDLGdCQUFNLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUN6QixNQUFNO0FBQ0wsZ0JBQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQ3RCOztBQUVELGVBQU8sTUFBTSxDQUFDO09BQ2Y7O0FBTUcsVUFBTTs7Ozs7O1dBQUEsVUFBQyxLQUFLLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7aUJBQUssS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLO1NBQUEsQ0FBQyxDQUFDO09BQy9DOztBQUdHLFVBQU07Ozs7V0FBQSxZQUFHO0FBQ1gsWUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFlBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2lCQUFLLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7U0FBQSxDQUFDLENBQUM7O0FBRTlELGVBQU8sTUFBTSxDQUFDO09BQ2Y7O0FBRUQsVUFBTTthQUFBLGtCQUFHO0FBQ1AsWUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7aUJBQUssS0FBSyxDQUFDLE1BQU0sRUFBRTtTQUFBLENBQUMsQ0FBQztBQUN4QyxZQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUMvQjs7QUFHRCxVQUFNOzs7O2FBQUEsZ0JBQUMsWUFBWSxFQUFFO0FBQ25CLFlBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNyRCxZQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztpQkFBSyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztTQUFBLENBQUMsQ0FBQztBQUM5QyxZQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7T0FDdkM7O0FBRUQsbUJBQWU7YUFBQSx5QkFBQyxlQUFlLEVBQUU7QUFDL0IsWUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7aUJBQUssS0FBSyxDQUFDLGVBQWUsRUFBRTtTQUFBLENBQUMsQ0FBQztBQUNqRCxZQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO09BQzFDOztBQUVELGdCQUFZO2FBQUEsc0JBQUMsWUFBWSxFQUFFO0FBQ3pCLFlBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNyRCxZQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztpQkFBSyxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztTQUFBLENBQUMsQ0FBQztBQUNwRCxZQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDLENBQUM7T0FDOUM7Ozs7U0E1RGtCLGVBQWU7R0FBUyxLQUFLOztpQkFBN0IsZUFBZTs7Ozs7Ozs7Ozs7Ozs7O0lBSjdCLE9BQU8sMkJBQU0sVUFBVTs7SUFDdkIsRUFBRSwyQkFBTSxhQUFhOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXNEUCxLQUFLO0FBQ2IsV0FEUSxLQUFLLENBQ1osR0FBRyxFQUFnQjtRQUFkLE1BQU0sZ0NBQUcsR0FBRzs7MEJBRFYsS0FBSzs7QUFFdEIsUUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNqQixRQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQzs7O0FBR3RCLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7O0FBRTdCLFFBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0dBQ3pCOzt1QkFWa0IsS0FBSzs7U0FZZCxZQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0tBQ3JCO1NBRVMsVUFBQyxLQUFLLEVBQUU7QUFDaEIsVUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7O0tBRXRCOzs7Ozs7OztXQU1RLG1CQUFDLGdCQUFnQixFQUFFO0FBQzFCLFVBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztLQUMxQzs7Ozs7Ozs7V0FNTSxtQkFBRzs7OztBQUVSLFVBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQyxVQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7ZUFBSyxNQUFLLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztPQUFBLENBQUMsQ0FBQzs7QUFFcEUsVUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDaEIsVUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztBQUM3QixVQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7S0FDeEI7Ozs7Ozs7V0FLZSw0QkFBRztBQUNqQixVQUFNLElBQUksR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNqRCxVQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUM5RCxVQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2pELFVBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLDhCQUE4QixDQUFDLENBQUM7O0FBRWpFLFVBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3pELGlCQUFXLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbkQsaUJBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNsRCxpQkFBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGdCQUFnQixDQUFDLENBQUM7O0FBRTVELFVBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUVuRCxVQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN2RCxrQkFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXJDLFVBQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZELGtCQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFckMsVUFBTSxrQkFBa0IsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM3RCx3QkFBa0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUVqRCxVQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hCLFVBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDOUIsa0JBQVksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdkMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMvQixVQUFJLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLENBQUM7O0FBRXJDLFVBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUUzQixVQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDOztBQUU1QixVQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsZUFBZSxDQUFDOztBQUUzQyxVQUFJLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQztBQUM1QixVQUFJLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQztBQUM1QixVQUFJLENBQUMsYUFBYSxHQUFHLGtCQUFrQixDQUFDO0FBQ3hDLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFVBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0tBQ2hDOzs7Ozs7O1dBS0UsYUFBQyxLQUFLLEVBQUU7QUFDVCxVQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFeEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3JDOzs7Ozs7O1dBS0ssZ0JBQUMsS0FBSyxFQUFFO0FBQ1osVUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRWxELFVBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNyQzs7Ozs7OztXQUtLLGtCQUFHOzs7Ozs7QUFDUCxvREFBa0IsSUFBSTtjQUFiLEtBQUs7QUFBWSxlQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7U0FBRTs7Ozs7Ozs7Ozs7Ozs7O0tBQzVDOzs7Ozs7O1dBS0ssa0JBQWdCO1VBQWYsTUFBTSxnQ0FBRyxJQUFJOztBQUNsQixVQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDdkIsVUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMzQjs7O1dBRWMsMkJBQUc7QUFDaEIsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUN2QixVQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDOztBQUU3QixVQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztBQUMvQyxVQUFNLE1BQU0sR0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzVCLFVBQU0sS0FBSyxHQUFLLGdCQUFnQixDQUFDLFlBQVksQ0FBQztBQUM5QyxVQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEUsVUFBTSxTQUFTLGtCQUFnQixPQUFPLFNBQU0sQ0FBQzs7QUFFN0MsVUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzVDLFVBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxQyxVQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxTQUFTLFdBQVMsS0FBSyxTQUFJLE1BQU0sQ0FBRyxDQUFDOztBQUUvRCxhQUFPLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDdEQ7OztXQUVXLHdCQUFnQjs7O1VBQWYsTUFBTSxnQ0FBRyxJQUFJOztBQUN4QixZQUFNLEdBQUcsQUFBQyxNQUFNLEtBQUssSUFBSSxHQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUVsRCxZQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQ3hCLFlBQUksTUFBSyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQUUsaUJBQU87U0FBRTtBQUNsRCxhQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDaEIsQ0FBQyxDQUFDO0tBQ0o7O1NBRUMsTUFBQSxNQUFNLENBQUMsUUFBUTtvQ0FBQzs7Ozs7O29FQUNULE1BQUssTUFBTTs7Ozs7OztLQUNuQjs7O1NBcEprQixLQUFLOzs7aUJBQUwsS0FBSzs7Ozs7Ozs7Ozs7Ozs7O0lBdkRuQixlQUFlLDJCQUFNLDRCQUE0Qjs7SUFDakQsS0FBSywyQkFBTSxlQUFlOztJQUMxQixjQUFjLDJCQUFNLDhCQUE4Qjs7SUFHcEMsb0JBQW9CO0FBQzVCLFdBRFEsb0JBQW9CLENBQzNCLElBQUksRUFBZ0I7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQURYLG9CQUFvQjs7QUFFckMscUNBRmlCLG9CQUFvQiw2Q0FFL0IsWUFBWSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7O0FBRW5DLFFBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDckMsUUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLGNBQWMsRUFBRSxDQUFDLENBQUM7R0FDeEM7O1lBTmtCLG9CQUFvQjs7U0FBcEIsb0JBQW9CO0dBQVMsS0FBSzs7aUJBQWxDLG9CQUFvQjs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFMbEMsS0FBSywyQkFBTSxlQUFlOztJQUMxQixNQUFNLDJCQUFNLGtCQUFrQjs7SUFHaEIsV0FBVztBQUNuQixXQURRLFdBQVcsR0FDSjtRQUFkLE9BQU8sZ0NBQUcsRUFBRTs7MEJBREwsV0FBVzs7QUFFNUIsUUFBTSxJQUFJLEdBQUcsRUFBRSxlQUFlLEVBQUUsQ0FBQyxFQUFFLENBQUM7O0FBRXBDLHFDQUppQixXQUFXLDZDQUl0QixRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTs7QUFFL0IsUUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsVUFBQyxDQUFDO2VBQUssQ0FBQyxDQUFDLGVBQWU7T0FBQSxFQUFFLEVBQUU7QUFDM0QsV0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO0tBQ3JCLENBQUMsQ0FBQztHQUNKOztZQVRrQixXQUFXOztlQUFYLFdBQVc7QUFlMUIsbUJBQWU7V0FKQSxVQUFDLEtBQUssRUFBRTtBQUN6QixZQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7T0FDbkM7V0FFa0IsWUFBRztBQUNwQixlQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO09BQ2xDOzs7O1NBakJrQixXQUFXO0dBQVMsS0FBSzs7aUJBQXpCLFdBQVc7Ozs7Ozs7Ozs7Ozs7OztJQUp6QixrQkFBa0IsMkJBQU0sa0NBQWtDOztJQUMxRCxHQUFHLDJCQUFNLGVBQWU7O0lBQ3hCLEtBQUssMkJBQU0sZUFBZTs7SUFHWixRQUFRO0FBQ2hCLFdBRFEsUUFBUSxDQUNmLElBQUksRUFBZ0I7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQURYLFFBQVE7O0FBRXpCLHFDQUZpQixRQUFRLDZDQUVuQixZQUFZLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTs7QUFFbkMsUUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QixRQUFJLENBQUMsV0FBVyxDQUFDLElBQUksa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO0dBQzVDOztZQU5rQixRQUFROztTQUFSLFFBQVE7R0FBUyxLQUFLOztpQkFBdEIsUUFBUTs7Ozs7Ozs7Ozs7Ozs7O0lBTHRCLEtBQUssMkJBQU0sZUFBZTs7SUFDMUIsTUFBTSwyQkFBTSxrQkFBa0I7O0lBQzlCLGNBQWMsMkJBQU0sOEJBQThCOztJQUdwQyxXQUFXO0FBQ25CLFdBRFEsV0FBVyxDQUNsQixJQUFJLEVBQWdCO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFEWCxXQUFXOztBQUU1QixxQ0FGaUIsV0FBVyw2Q0FFdEIsWUFBWSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7O0FBRW5DLFFBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRTtBQUM5QixvQkFBYyxFQUFFLE9BQU8sQ0FBQyxjQUFjO0tBQ3ZDLENBQUMsQ0FBQztBQUNILFFBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxjQUFjLEVBQUUsQ0FBQyxDQUFDO0dBQ3hDOztZQVJrQixXQUFXOztTQUFYLFdBQVc7R0FBUyxLQUFLOztpQkFBekIsV0FBVzs7Ozs7Ozs7Ozs7Ozs7O0lBTHpCLEtBQUssMkJBQU0sZUFBZTs7SUFDMUIsT0FBTywyQkFBTSxtQkFBbUI7O0lBQ2hDLGVBQWUsMkJBQU0sK0JBQStCOztJQUd0QyxZQUFZO0FBQ3BCLFdBRFEsWUFBWSxDQUNuQixJQUFJLEVBQWdCO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFEWCxZQUFZOztBQUU3QixxQ0FGaUIsWUFBWSw2Q0FFdkIsWUFBWSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7O0FBRW5DLFFBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRTtBQUMvQixxQkFBZSxFQUFFLE9BQU8sQ0FBQyxlQUFlO0tBQ3pDLENBQUMsQ0FBQztBQUNILFFBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxlQUFlLEVBQUUsQ0FBQyxDQUFDO0dBQ3pDOztZQVJrQixZQUFZOztTQUFaLFlBQVk7R0FBUyxLQUFLOztpQkFBMUIsWUFBWTs7Ozs7Ozs7Ozs7Ozs7O0lBTDFCLEtBQUssMkJBQU0sZUFBZTs7SUFDMUIsUUFBUSwyQkFBTSxvQkFBb0I7O0FBR3pDLElBQU0sUUFBUSxHQUFHO0FBQ2YsU0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2hCLFNBQU8sRUFBRSxDQUFDO0FBQ1YsT0FBSyxFQUFFLFdBQVc7Q0FDbkIsQ0FBQzs7SUFFbUIsYUFBYTtBQUNyQixXQURRLGFBQWEsQ0FDcEIsTUFBTSxFQUFFLE9BQU8sRUFBRTswQkFEVixhQUFhOztBQUU5QixXQUFPLEdBQUcsTUFBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRS9DLHFDQUppQixhQUFhLDZDQUl4QixRQUFRLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFOztBQUVqRSxRQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRTtBQUM1QixPQUFDLEVBQUUsV0FBUyxDQUFDLEVBQVk7WUFBVixDQUFDLGdDQUFHLElBQUk7O0FBQ3JCLFlBQUksQ0FBQyxLQUFLLElBQUksRUFBRTtBQUFFLFdBQUMsR0FBRyxDQUFDLENBQUM7U0FBRTtBQUMxQixlQUFPLENBQUMsQ0FBQztPQUNWO0tBQ0YsRUFBRTtBQUNELGdCQUFVLEVBQUUsTUFBTSxDQUFDLFVBQVU7QUFDN0IsV0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO0tBQ3JCLENBQUMsQ0FBQztHQUNKOztZQWZrQixhQUFhOztTQUFiLGFBQWE7R0FBUyxLQUFLOztpQkFBM0IsYUFBYTs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFWM0IsTUFBTSwyQkFBTSxRQUFROzs7Ozs7SUFNTixXQUFXO0FBQ25CLFdBRFEsV0FBVyxDQUNsQixFQUFFLEVBQUU7MEJBREcsV0FBVzs7QUFFNUIscUNBRmlCLFdBQVcsNkNBRXBCO0FBQ1IsUUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7O0FBRWIsUUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0dBQ3BCOztZQU5rQixXQUFXOztlQUFYLFdBQVc7QUFROUIsZ0JBQVk7YUFBQSxzQkFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O0FBRXhCLGVBQVc7YUFBQSx1QkFBRyxFQUFFOzs7O1NBVkcsV0FBVztHQUFTLE1BQU0sQ0FBQyxZQUFZOztpQkFBdkMsV0FBVzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFOekIsV0FBVywyQkFBTSxnQkFBZ0I7O0lBQ2pDLFNBQVMsMkJBQU0sY0FBYzs7QUFHcEMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7Ozs7OztJQU1iLFFBQVE7QUFDaEIsV0FEUSxRQUFRLEdBQ0o7UUFBWCxFQUFFLGdDQUFHLElBQUk7OzBCQURGLFFBQVE7O0FBRXpCLHFDQUZpQixRQUFRLDZDQUVuQixJQUFJLEVBQUU7R0FDYjs7WUFIa0IsUUFBUTs7ZUFBUixRQUFRO0FBSzNCLGdCQUFZO2FBQUEsc0JBQUMsSUFBSSxFQUFFLENBQUMsRUFBRTtBQUNwQixZQUFNLEtBQUssR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRXJDLGFBQUssQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztBQUM1QixhQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDMUIsYUFBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3hCLGFBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUMxQixhQUFLLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU1QyxlQUFPLEtBQUssQ0FBQztPQUNkOztBQUVELGVBQVc7YUFBQSx1QkFBRzs7O0FBQ1osWUFBTSxTQUFTLEdBQUcsVUFBQyxDQUFDLEVBQUs7QUFDdkIsY0FBSSxLQUFLLEdBQUcsTUFBSyxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVDLGdCQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDM0IsQ0FBQzs7QUFFRixZQUFNLE9BQU8sR0FBRyxVQUFDLENBQUMsRUFBSztBQUNyQixjQUFJLEtBQUssR0FBRyxNQUFLLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUMsZ0JBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUMzQixDQUFDOztBQUVGLFlBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUM5QixZQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7T0FDM0I7Ozs7U0E5QmtCLFFBQVE7R0FBUyxXQUFXOztpQkFBNUIsUUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFWdEIsV0FBVywyQkFBTSxnQkFBZ0I7O0lBQ2pDLFNBQVMsMkJBQU0sY0FBYzs7QUFHcEMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7Ozs7Ozs7SUFNYixPQUFPOzs7OztBQUlmLFdBSlEsT0FBTyxDQUlkLEVBQUUsOENBQThDOzBCQUp6QyxPQUFPOztBQUt4QixxQ0FMaUIsT0FBTyw2Q0FLbEIsRUFBRSxFQUFFOzs7QUFHVixRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztBQUMzQixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztHQUN2Qjs7WUFWa0IsT0FBTzs7ZUFBUCxPQUFPO0FBZTFCLGdCQUFZOzs7Ozs7YUFBQSxzQkFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFO0FBQ3BCLFlBQU0sS0FBSyxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFckMsWUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLGFBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNoQixhQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0FBRWhCLGVBQU8sS0FBSyxDQUFDO09BQ2Q7O0FBTUQsd0JBQW9COzs7Ozs7O2FBQUEsOEJBQUMsQ0FBQyxFQUFFOztBQUV0QixZQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDVixZQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDVixZQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLHFCQUFxQixFQUFFLENBQUM7QUFDbkQsWUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQztBQUN6RSxZQUFNLFNBQVMsR0FBSSxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDOzs7QUFHdkUsWUFBSSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUU7QUFDdEIsV0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDWixXQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztTQUNiLE1BQU0sSUFBSSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUU7O0FBRWpDLFdBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQztBQUMzQixXQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7U0FDM0I7OztBQUdELFNBQUMsR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUEsQUFBQyxDQUFDO0FBQ3ZDLFNBQUMsR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDLEdBQUcsR0FBSSxTQUFTLENBQUEsQUFBRSxDQUFDOzs7O0FBSXZDLGVBQU8sRUFBRSxDQUFDLEVBQUQsQ0FBQyxFQUFFLENBQUMsRUFBRCxDQUFDLEVBQUUsQ0FBQztPQUNqQjs7QUFPRCxlQUFXOzs7Ozs7OzthQUFBLHVCQUFHOzs7QUFDWixZQUFNLFdBQVcsR0FBRyxVQUFDLENBQUMsRUFBSzs7QUFFekIsZ0JBQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUN4QyxjQUFNLEtBQUssR0FBRyxNQUFLLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRWhELGdCQUFLLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDeEIsZ0JBQUssY0FBYyxHQUFHLEtBQUssQ0FBQztBQUM1QixnQkFBSyxTQUFTLEdBQUcsS0FBSyxDQUFDOztBQUV2QixnQkFBTSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDekQsZ0JBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUVyRCxnQkFBSyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzNCLENBQUM7O0FBRUYsWUFBTSxXQUFXLEdBQUcsVUFBQyxDQUFDLEVBQUs7QUFDekIsY0FBSSxLQUFLLEdBQUcsTUFBSyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlDLGVBQUssQ0FBQyxVQUFVLENBQUMsTUFBSyxjQUFjLEVBQUUsTUFBSyxTQUFTLENBQUMsQ0FBQzs7QUFFdEQsZ0JBQUssU0FBUyxHQUFHLEtBQUssQ0FBQzs7QUFFdkIsZ0JBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUMzQixDQUFDOztBQUVGLFlBQU0sU0FBUyxHQUFHLFVBQUMsQ0FBQyxFQUFLO0FBQ3ZCLGNBQUksS0FBSyxHQUFHLE1BQUssWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QyxlQUFLLENBQUMsVUFBVSxDQUFDLE1BQUssY0FBYyxFQUFFLE1BQUssU0FBUyxDQUFDLENBQUM7O0FBRXRELGdCQUFLLFdBQVcsR0FBRyxLQUFLLENBQUM7QUFDekIsZ0JBQUssY0FBYyxHQUFHLElBQUksQ0FBQztBQUMzQixnQkFBSyxTQUFTLEdBQUcsSUFBSSxDQUFDOztBQUV0QixnQkFBTSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUNyRCxnQkFBTSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQzs7QUFFakQsZ0JBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUMzQixDQUFDOztBQUVGLFlBQU0sT0FBTyxHQUFHLFVBQUMsQ0FBQyxFQUFLO0FBQ3JCLGNBQUksS0FBSyxHQUFHLE1BQUssWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMxQyxnQkFBSyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzNCLENBQUM7O0FBRUYsWUFBTSxVQUFVLEdBQUcsVUFBQyxDQUFDLEVBQUs7QUFDeEIsY0FBSSxLQUFLLEdBQUcsTUFBSyxZQUFZLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzdDLGdCQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDM0IsQ0FBQzs7O0FBR0YsWUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzFELFlBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNsRCxZQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7T0FDekQ7Ozs7U0FsSGtCLE9BQU87R0FBUyxXQUFXOztpQkFBM0IsT0FBTzs7Ozs7Ozs7Ozs7SUFSUCxTQUFTO0FBQ2pCLFdBRFEsU0FBUyxDQUNoQixJQUFJLEVBQUUsYUFBYSxFQUFFOzBCQURkLFNBQVM7O0FBRTFCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztBQUNuQyxRQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUM7QUFDakQsUUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7Ozs7QUFJbkMsUUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDZCxRQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNkLFFBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ2YsUUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDZixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztHQUNsQjs7ZUFka0IsU0FBUztBQWdCNUIsY0FBVTthQUFBLG9CQUFDLGNBQWMsRUFBRSxTQUFTLEVBQUU7QUFDcEMsWUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGlCQUFPO1NBQUU7QUFDOUMsWUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsWUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUM7O0FBRS9CLFlBQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbkUsWUFBTSxHQUFHLEdBQUksY0FBYyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNuRSxZQUFNLEtBQUssR0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvRCxZQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFL0QsWUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsR0FBRyxFQUFILEdBQUcsRUFBRSxLQUFLLEVBQUwsS0FBSyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsQ0FBQztPQUMxQzs7OztTQTNCa0IsU0FBUzs7O2lCQUFULFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRnZCLE1BQU0sMkJBQU0sVUFBVTs7SUFHUixlQUFlO1dBQWYsZUFBZTswQkFBZixlQUFlOzs7Ozs7O1lBQWYsZUFBZTs7ZUFBZixlQUFlO0FBQ2xDLGdCQUFZO2FBQUEsd0JBQUc7QUFBRSxlQUFPLGtCQUFrQixDQUFDO09BQUU7O0FBRTdDLG9CQUFnQjthQUFBLDRCQUFHO0FBQ2pCLFlBQUksSUFBSSxvQ0FKUyxlQUFlLGlEQUlHLENBQUM7QUFDcEMsWUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7QUFDdEIsZUFBTyxJQUFJLENBQUM7T0FDYjs7QUFFRCxVQUFNO2FBQUEsZ0JBQUMsZ0JBQWdCLEVBQUU7QUFDdkIsWUFBSSxDQUFDLEdBQUcsb0NBVlMsZUFBZSx3Q0FVUixnQkFBZ0IsQ0FBQyxDQUFDO0FBQzFDLFlBQU0sTUFBTSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQzs7QUFFdkMsWUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDeEQsWUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMxQyxZQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzFDLFlBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLDhCQUE0QixNQUFNLE9BQUksQ0FBQztBQUNuRixZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO0FBQ3BDLFlBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUM7QUFDM0MsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztBQUNwQyxZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDO0FBQ3pDLFlBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQixHQUFHLE1BQU0sQ0FBQztBQUM1QyxZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDOztBQUV0QyxZQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRWxDLGVBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztPQUNqQjs7QUFFRCxVQUFNO2FBQUEsZ0JBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUNyQyx5Q0E5QmlCLGVBQWUsd0NBOEJuQixnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFOztBQUU3QyxZQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQzFDOzs7O1NBakNrQixlQUFlO0dBQVMsTUFBTTs7aUJBQTlCLGVBQWU7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBSDdCLE9BQU8sMkJBQU0sV0FBVzs7SUFHVixnQkFBZ0I7V0FBaEIsZ0JBQWdCOzBCQUFoQixnQkFBZ0I7Ozs7Ozs7WUFBaEIsZ0JBQWdCOztlQUFoQixnQkFBZ0I7QUFDbkMsZ0JBQVk7YUFBQSx3QkFBRztBQUFFLGVBQU8sbUJBQW1CLENBQUM7T0FBRTs7QUFFOUMsb0JBQWdCO2FBQUEsNEJBQUc7QUFDakIsWUFBSSxJQUFJLG9DQUpTLGdCQUFnQixpREFJRSxDQUFDO0FBQ3BDLFlBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3RCLGVBQU8sSUFBSSxDQUFDO09BQ2I7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFO0FBQ3ZCLFlBQUksQ0FBQyxHQUFHLG9DQVZTLGdCQUFnQix3Q0FVVCxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzFDLFlBQU0sTUFBTSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQzs7QUFFdkMsWUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDeEQsWUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QyxZQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzFDLFlBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLDhCQUE0QixNQUFNLE9BQUksQ0FBQztBQUNuRixZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO0FBQ3BDLFlBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUM7QUFDM0MsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztBQUNwQyxZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDO0FBQ3pDLFlBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQixHQUFHLE1BQU0sQ0FBQztBQUM1QyxZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDOztBQUV0QyxZQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRWxDLGVBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztPQUNqQjs7QUFFRCxVQUFNO2FBQUEsZ0JBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUNyQyx5Q0E5QmlCLGdCQUFnQix3Q0E4QnBCLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7O0FBRTdDLFlBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDMUM7Ozs7U0FqQ2tCLGdCQUFnQjtHQUFTLE9BQU87O2lCQUFoQyxnQkFBZ0I7Ozs7Ozs7Ozs7Ozs7SUFIOUIsRUFBRSwyQkFBTSxtQkFBbUI7Ozs7O0lBTWIsU0FBUzs7Ozs7QUFJakIsV0FKUSxTQUFTLEdBSUY7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQUpMLFNBQVM7O0FBSzFCLFFBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2IsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFOUQsUUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7QUFDMUMsUUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztHQUN0Qzs7ZUFaa0IsU0FBUztBQWM1QixnQkFBWTthQUFBLHdCQUFHO0FBQ2IsZUFBTyxFQUFFLENBQUM7T0FDWDs7QUFLRCxXQUFPOzs7Ozs7YUFBQSxtQkFBRzs7QUFFUixZQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztPQUNqQjs7QUFLRCxnQkFBWTs7Ozs7O2FBQUEsd0JBQUc7QUFBRSxlQUFPLE9BQU8sQ0FBQztPQUFFOztBQVdsQyxvQkFBZ0I7Ozs7Ozs7Ozs7OzthQUFBLDRCQUFHO0FBQUUsZUFBTyxFQUFFLENBQUM7T0FBRTs7QUFNakMsV0FBTzs7Ozs7O2FBQUEsaUJBQUMsU0FBUyxFQUFFO0FBQ2pCLGFBQUssSUFBSSxHQUFHLElBQUksU0FBUyxFQUFFO0FBQUUsY0FBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUFFO09BQzNEOztBQU1ELG9CQUFnQjs7Ozs7OzthQUFBLDBCQUFDLFNBQVMsRUFBRTtBQUMxQixZQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQzs7QUFFckIsWUFBTSxLQUFLLEdBQUcsTUFBQSxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDOzs7O0FBSTFDLGNBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDdkMsY0FBSSxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQUUsbUJBQU87V0FBRTs7QUFFM0MsZ0JBQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtBQUNqQyxlQUFHLEVBQUUsZUFBVztBQUFFLHFCQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7YUFBRTtBQUNqRCxlQUFHLEVBQUUsYUFBUyxJQUFJLEVBQUU7QUFDbEIsa0JBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO2FBQzlCO1dBQ0YsQ0FBQyxDQUFDO1NBQ0osQ0FBQyxDQUFDO09BQ0o7O0FBTUQsd0JBQW9COzs7Ozs7O2FBQUEsOEJBQUMsU0FBUyxFQUFFOzs7QUFDOUIsY0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUN2QyxjQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckMsY0FBSSxRQUFRLEdBQUcsa0JBQVMsQ0FBQyxFQUFZO2dCQUFWLENBQUMsZ0NBQUcsSUFBSTs7QUFDakMsZ0JBQUksQ0FBQyxLQUFLLElBQUksRUFBRTtBQUFFLHFCQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxZQUFZLENBQUM7YUFBRTtBQUNuRCxhQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1dBQ2IsQ0FBQzs7QUFFRixnQkFBSyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUM7U0FDdkIsQ0FBQyxDQUFDO09BQ0o7O0FBTUQsVUFBTTs7Ozs7OzthQUFBLGdCQUFDLGdCQUFnQixFQUFFLEVBQUU7O0FBYTNCLFVBQU07Ozs7Ozs7Ozs7Ozs7O2FBQUEsZ0JBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFOztBQU96QyxVQUFNOzs7Ozs7OzthQUFBLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTs7OztTQWpIL0IsU0FBUzs7O2lCQUFULFNBQVM7Ozs7Ozs7Ozs7Ozs7SUFOdkIsU0FBUywyQkFBTSxjQUFjOztJQUM3QixFQUFFLDJCQUFNLG1CQUFtQjs7SUFHYixNQUFNO1dBQU4sTUFBTTswQkFBTixNQUFNOzs7Ozs7O1lBQU4sTUFBTTs7ZUFBTixNQUFNO0FBQ3pCLGdCQUFZO2FBQUEsd0JBQUc7QUFBRSxlQUFPLFFBQVEsQ0FBQztPQUFFOztBQUVuQyxvQkFBZ0I7YUFBQSw0QkFBRztBQUNqQixlQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO09BQ2pCOztBQUVELGdCQUFZO2FBQUEsd0JBQUc7QUFDYixlQUFPO0FBQ0wsZUFBSyxFQUFFLFNBQVM7QUFDaEIsaUJBQU8sRUFBRSxDQUFDO1NBQ1gsQ0FBQztPQUNIOztBQUVELFVBQU07YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRTtBQUN2QixZQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFBRSxpQkFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO1NBQUU7O0FBRWxDLFlBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDaEQsWUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0QyxZQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFlBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0QsWUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLFlBQVksQ0FBQyxDQUFDOztBQUUvRCxlQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7T0FDakI7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDckMsWUFBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN0RCxZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQzs7QUFFaEMsWUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsaUJBQWUsQ0FBQyxVQUFPLENBQUM7QUFDakUsWUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztPQUMvQjs7QUFHRCxVQUFNOzs7O2FBQUEsa0JBQUc7QUFBRSxlQUFPLEtBQUssQ0FBQztPQUFFOzs7O1NBbkNQLE1BQU07R0FBUyxTQUFTOztpQkFBeEIsTUFBTTs7Ozs7Ozs7Ozs7OztJQUpwQixTQUFTLDJCQUFNLGNBQWM7O0lBR2YsR0FBRztXQUFILEdBQUc7MEJBQUgsR0FBRzs7Ozs7OztZQUFILEdBQUc7O2VBQUgsR0FBRztBQUN0QixnQkFBWTthQUFBLHdCQUFHO0FBQUUsZUFBTyxLQUFLLENBQUM7T0FBRTs7QUFHaEMsb0JBQWdCOzs7O2FBQUEsNEJBQUc7QUFDakIsZUFBTyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQztPQUNqRDs7QUFFRCxVQUFNO2FBQUEsa0JBQUc7QUFDUCxZQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFBRSxpQkFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO1NBQUU7O0FBRWxDLFlBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDOztBQUV2RCxlQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7T0FDakI7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDckMsWUFBTSxFQUFFLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN4RCxZQUFNLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3pELFlBQU0sQ0FBQyxHQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekIsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFaEMsWUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsaUJBQWUsRUFBRSxVQUFLLEVBQUUsT0FBSSxDQUFDO0FBQ3RFLFlBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEMsWUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztPQUM3Qjs7QUFHRCxVQUFNOzs7O2FBQUEsZ0JBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUM5QyxZQUFNLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3hELFlBQU0sRUFBRSxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7O0FBRXpELFlBQUksQUFBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsRUFBRTtBQUNoRCxpQkFBTyxJQUFJLENBQUM7U0FDYjs7QUFFRCxlQUFPLEtBQUssQ0FBQztPQUNkOzs7O1NBckNrQixHQUFHO0dBQVMsU0FBUzs7aUJBQXJCLEdBQUc7Ozs7Ozs7Ozs7Ozs7SUFIakIsU0FBUywyQkFBTSxjQUFjOztJQUdmLElBQUk7V0FBSixJQUFJOzBCQUFKLElBQUk7Ozs7Ozs7WUFBSixJQUFJOztlQUFKLElBQUk7QUFDdkIsZ0JBQVk7YUFBQSx3QkFBRztBQUFFLGVBQU8sTUFBTSxDQUFDO09BQUU7O0FBRWpDLG9CQUFnQjthQUFBLDRCQUFHO0FBQ2pCLGVBQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztPQUN6Qjs7QUFFRCxnQkFBWTthQUFBLHdCQUFHO0FBQ2IsZUFBTyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQztPQUM3Qjs7QUFFRCxVQUFNO2FBQUEsZ0JBQUMsZ0JBQWdCLEVBQUU7QUFDdkIsWUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQUUsaUJBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUFFOztBQUVsQyxZQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFckQsZUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO09BQ2pCOztBQUVELFVBQU07YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUU7OztBQUM3QixZQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQixZQUFJLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7aUJBQUssTUFBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQztTQUFBLENBQUMsQ0FBQzs7QUFFdEQsWUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDNUUsWUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQzFDLFlBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7O0FBRTdCLFlBQUksR0FBRyxJQUFJLENBQUM7T0FDYjs7QUFJRCxjQUFVOzs7OzthQUFBLG9CQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRTs7O0FBQ2pDLFlBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQUUsaUJBQU8sRUFBRSxDQUFDO1NBQUU7O0FBRWhDLFlBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFLO0FBQzVDLGNBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxNQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELGNBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxNQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3hELHNCQUFVLENBQUMsU0FBSSxDQUFDLENBQUc7U0FDcEIsQ0FBQyxDQUFDOztBQUVILGVBQU8sR0FBRyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDckM7Ozs7U0ExQ2tCLElBQUk7R0FBUyxTQUFTOztpQkFBdEIsSUFBSTs7Ozs7Ozs7Ozs7OztJQUhsQixTQUFTLDJCQUFNLGNBQWM7O0lBR2YsTUFBTTtXQUFOLE1BQU07MEJBQU4sTUFBTTs7Ozs7OztZQUFOLE1BQU07O2VBQU4sTUFBTTtBQUN6QixnQkFBWTthQUFBLHdCQUFHO0FBQUUsZUFBTyxRQUFRLENBQUM7T0FBRTs7QUFFbkMsb0JBQWdCO2FBQUEsNEJBQUc7QUFDakIsZUFBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDO09BQ25DOztBQUVELGdCQUFZO2FBQUEsd0JBQUc7QUFDYixlQUFPO0FBQ0wsc0JBQVksRUFBRSxDQUFDO0FBQ2YsdUJBQWEsRUFBRSxFQUFFO0FBQ2pCLHdCQUFjLEVBQUUsSUFBSTtBQUNwQixpQkFBTyxFQUFFLENBQUM7U0FDWCxDQUFDO09BQ0g7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFO0FBQ3ZCLFlBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUFFLGlCQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7U0FBRTs7QUFFbEMsWUFBTSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDOztBQUV2QyxZQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNsRCxZQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQzs7O0FBR3ZELFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEMsWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4QyxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVDLFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbEQsWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLGVBQWUsQ0FBQyxDQUFDOztBQUVwRSxZQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRWpDLFlBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUU7QUFDL0IsY0FBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRTFELGNBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQSxHQUFJLENBQUMsQ0FBQSxBQUFDLENBQUMsQ0FBQztBQUMvRSxjQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzdGLGNBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN0RSxjQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDeEUsY0FBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLFlBQVksQ0FBQyxDQUFDOztBQUVwRSxjQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDckM7O0FBRUQsWUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDOztBQUU3QyxlQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7T0FDakI7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDckMsWUFBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDNUQsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFaEMsWUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsaUJBQWUsQ0FBQyxVQUFPLENBQUM7QUFDakUsWUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQzs7QUFFOUIsWUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRTtBQUMvQixjQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1NBQ2xDO09BQ0Y7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7O0FBRTlDLFlBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdEQsWUFBTSxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFBLEdBQUksQ0FBQyxDQUFDO0FBQ3ZELFlBQU0sT0FBTyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztBQUNuRCxZQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUM7QUFDcEUsWUFBTSxPQUFPLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDOztBQUV4QyxZQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQzVFLFlBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDNUUsWUFBTSxJQUFJLEdBQUcsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFakMsZUFBTyxJQUFJLEdBQUcsQ0FBQyxDQUFDO09BQ2pCOzs7O1NBM0VrQixNQUFNO0dBQVMsU0FBUzs7aUJBQXhCLE1BQU07Ozs7Ozs7Ozs7Ozs7SUFIcEIsU0FBUywyQkFBTSxjQUFjOztJQUdmLE9BQU87V0FBUCxPQUFPOzBCQUFQLE9BQU87Ozs7Ozs7WUFBUCxPQUFPOztlQUFQLE9BQU87QUFDMUIsZ0JBQVk7YUFBQSx3QkFBRztBQUFFLGVBQU8sU0FBUyxDQUFDO09BQUU7O0FBRXBDLG9CQUFnQjthQUFBLDRCQUFHO0FBQ2pCLGVBQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDO09BQzFFOztBQUVELGdCQUFZO2FBQUEsd0JBQUc7QUFDYixlQUFPO0FBQ0wseUJBQWUsRUFBRSxJQUFJO0FBQ3JCLHNCQUFZLEVBQUUsQ0FBQztBQUNmLHdCQUFjLEVBQUUsR0FBRztBQUNuQixpQkFBTyxFQUFFLEdBQUc7U0FDYixDQUFDO09BQ0g7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFO0FBQ3ZCLFlBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUFFLGlCQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7U0FBRTs7QUFFbEMsWUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRWxELFlBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzFELFlBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN2QyxZQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDbEQsWUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLFlBQVksQ0FBQyxDQUFDOztBQUVwRSxZQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXBDLFlBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUU7QUFDL0IsY0FBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDOUQsY0FBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNuRCxjQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDMUUsY0FBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ3hFLGNBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQztBQUM3RCxjQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDOztBQUU3QyxjQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMvRCxjQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3JELGNBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMzRSxjQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDekUsY0FBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDO0FBQzlELGNBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUM7O0FBRTlDLGNBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN4QyxjQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDMUM7O0FBRUQsZUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO09BQ2pCOztBQUVELFVBQU07YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ3JDLFlBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdEQsWUFBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN2RCxZQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQzlELFlBQU0sTUFBTSxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDakUsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoQyxZQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVwQyxZQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxpQkFBZSxDQUFDLFVBQUssQ0FBQyxPQUFJLENBQUM7QUFDcEUsWUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7QUFFakMsWUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hFLFlBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDckQsWUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQzs7QUFFakMsWUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRTs7QUFFL0IsY0FBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN6RCxjQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixDQUFDLENBQUM7QUFDdkUsY0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQzs7QUFFckMsY0FBTSxxQkFBcUIsbUJBQWdCLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQSxTQUFNLENBQUM7QUFDbEYsY0FBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMxRCxjQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLHFCQUFxQixDQUFDLENBQUM7QUFDNUUsY0FBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztTQUN2QztPQUNGOztBQUVELFVBQU07YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQzlDLFlBQU0sT0FBTyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDNUQsWUFBTSxPQUFPLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2hGLFlBQU0sT0FBTyxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDN0QsWUFBTSxPQUFPLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7QUFHbEYsWUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUM1RSxZQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQzVFLFlBQU0sSUFBSSxHQUFHLFFBQVEsR0FBRyxRQUFRLENBQUM7O0FBRWpDLGVBQU8sSUFBSSxHQUFHLENBQUMsQ0FBQztPQUNqQjs7OztTQTFGa0IsT0FBTztHQUFTLFNBQVM7O2lCQUF6QixPQUFPOzs7Ozs7Ozs7Ozs7O0lBSHJCLFNBQVMsMkJBQU0sY0FBYzs7SUFHZixXQUFXO1dBQVgsV0FBVzswQkFBWCxXQUFXOzs7Ozs7O1lBQVgsV0FBVzs7ZUFBWCxXQUFXO0FBQzlCLGdCQUFZO2FBQUEsd0JBQUc7QUFBRSxlQUFPLGNBQWMsQ0FBQztPQUFFOztBQUV6QyxvQkFBZ0I7YUFBQSw0QkFBRztBQUNqQixlQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQztPQUNwQzs7QUFFRCxnQkFBWTthQUFBLHdCQUFHO0FBQ2IsZUFBTztBQUNMLG9CQUFVLEVBQUUsV0FBVztBQUN2QixtQkFBUyxFQUFFLFNBQVM7QUFDcEIscUJBQVcsRUFBRSxJQUFJO1NBQ2xCLENBQUM7T0FDSDs7QUFFRCxVQUFNO2FBQUEsZ0JBQUMsZ0JBQWdCLEVBQUU7QUFDdkIsWUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQUUsaUJBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUFFO0FBQ2xDLFlBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUVsRCxZQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN4RCxZQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7OztBQUdsQyxZQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFO0FBQzNCLGNBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZELGNBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNsQzs7QUFFRCxlQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7T0FDakI7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRTs7OztBQUU3QixZQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQixZQUFJLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7aUJBQUssTUFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQztTQUFBLENBQUMsQ0FBQzs7QUFFcEQsWUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRTtBQUMzQixjQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNsRixjQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakUsY0FBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNqRDs7QUFFRCxZQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNwRixZQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ25ELFlBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNqRSxZQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUVuRCxZQUFJLEdBQUcsSUFBSSxDQUFDO09BQ2I7O0FBRUQsa0JBQWM7YUFBQSx3QkFBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUU7OztBQUNyQyxZQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSyxFQUFFLEtBQUssRUFBSztBQUM1QyxjQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsTUFBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN0RCxjQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsTUFBSyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUMxRCxzQkFBVSxDQUFDLFNBQUksQ0FBQyxDQUFHO1NBQ3BCLENBQUMsQ0FBQzs7QUFFSCxlQUFPLEdBQUcsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ3JDOztBQUVELG1CQUFlO2FBQUEseUJBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFO0FBQ3RDLFlBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7O0FBRTNCLFlBQUksaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBQzNCLFlBQUksZUFBZSxHQUFHLEVBQUUsQ0FBQzs7QUFFekIsYUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMvQixjQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsY0FBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5QixjQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFeEMsY0FBTSxDQUFDLEdBQUksZ0JBQWdCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN2RCxjQUFNLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFDO0FBQzNELGNBQU0sRUFBRSxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUM7O0FBRTNELGNBQU0sS0FBSyxRQUFNLENBQUMsU0FBSSxFQUFFLEFBQUUsQ0FBQztBQUMzQixjQUFNLEdBQUcsUUFBUSxDQUFDLFNBQUksRUFBRSxBQUFFLENBQUM7O0FBRTNCLDJCQUFpQixHQUFHLGlCQUFpQixLQUFLLEVBQUUsR0FDMUMsS0FBSyxRQUFNLGlCQUFpQixTQUFJLEtBQUssQUFBRSxDQUFDOztBQUUxQyx5QkFBZSxHQUFHLGVBQWUsS0FBSyxFQUFFLEdBQ3RDLEdBQUcsUUFBTSxHQUFHLFNBQUksZUFBZSxBQUFFLENBQUM7U0FDckM7O0FBRUQsWUFBSSxZQUFZLFNBQU8saUJBQWlCLFNBQUksZUFBZSxNQUFHLENBQUM7QUFDL0QsZUFBTyxZQUFZLENBQUM7T0FDckI7Ozs7U0F2RmtCLFdBQVc7R0FBUyxTQUFTOztpQkFBN0IsV0FBVzs7Ozs7Ozs7Ozs7OztJQUh6QixTQUFTLDJCQUFNLGNBQWM7O0lBR2YsU0FBUztXQUFULFNBQVM7MEJBQVQsU0FBUzs7Ozs7OztZQUFULFNBQVM7O2VBQVQsU0FBUztBQUM1QixnQkFBWTthQUFBLHdCQUFHO0FBQUUsZUFBTyxZQUFZLENBQUM7T0FBRTs7QUFFdkMsb0JBQWdCO2FBQUEsNEJBQUc7QUFDakIsZUFBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUM7T0FDcEM7O0FBRUQsZ0JBQVk7YUFBQSx3QkFBRztBQUNiLGVBQU87QUFDTCxvQkFBVSxFQUFFLENBQUM7QUFDYixxQkFBVyxFQUFFLENBQUM7QUFDZCxtQkFBUyxFQUFFLFNBQVM7QUFDcEIsb0JBQVUsRUFBRSxXQUFXO1NBQ3hCLENBQUM7T0FDSDs7QUFFRCxVQUFNO2FBQUEsZ0JBQUMsZ0JBQWdCLEVBQUU7QUFDdkIsWUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQUUsaUJBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUFFOztBQUVsQyxZQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFbEQsWUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDekQsWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzdELFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqRSxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQ3ZELFlBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFakMsWUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDeEQsWUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzVELFlBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNqRSxZQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQ3RELFlBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFL0IsWUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDeEQsWUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzVELFlBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUs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RWhCLFlBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztPQUN2QjtXQU1PLFlBQUc7QUFDVCxlQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7T0FDbkI7Ozs7U0FwRWtCLGNBQWM7OztpQkFBZCxjQUFjOzs7QUNBbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcHlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuZ0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2aERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBjb3JlOiB7XG4gICAgTGF5ZXJUaW1lQ29udGV4dCAgICA6IHJlcXVpcmUoJy4vZGlzdC9jb3JlL2xheWVyLXRpbWUtY29udGV4dCcpLFxuICAgIExheWVyICAgICAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvY29yZS9sYXllcicpLFxuICAgIG5hbWVzcGFjZSAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvY29yZS9uYW1lc3BhY2UnKSxcbiAgICBUaW1lbGluZVRpbWVDb250ZXh0IDogcmVxdWlyZSgnLi9kaXN0L2NvcmUvdGltZWxpbmUtdGltZS1jb250ZXh0JyksXG4gICAgVGltZWxpbmUgICAgICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9jb3JlL3RpbWVsaW5lJyksXG4gICAgVHJhY2tDb2xsZWN0aW9uICAgICA6IHJlcXVpcmUoJy4vZGlzdC9jb3JlL3RyYWNrLWNvbGxlY3Rpb24nKSxcbiAgICBUcmFjayAgICAgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L2NvcmUvdHJhY2snKSxcbiAgfSxcbiAgc2hhcGVzOiB7XG4gICAgQW5ub3RhdGVkTWFya2VyICAgICA6IHJlcXVpcmUoJy4vZGlzdC9zaGFwZXMvYW5ub3RhdGVkLW1hcmtlcicpLFxuICAgIEFubm90YXRlZFNlZ21lbnQgICAgOiByZXF1aXJlKCcuL2Rpc3Qvc2hhcGVzL2Fubm90YXRlZC1zZWdtZW50JyksXG4gICAgQmFzZVNoYXBlICAgICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9zaGFwZXMvYmFzZS1zaGFwZScpLFxuICAgIEN1cnNvciAgICAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3Qvc2hhcGVzL2N1cnNvcicpLFxuICAgIERvdCAgICAgICAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3Qvc2hhcGVzL2RvdCcpLFxuICAgIExpbmUgICAgICAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3Qvc2hhcGVzL2xpbmUnKSxcbiAgICBNYXJrZXIgICAgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L3NoYXBlcy9tYXJrZXInKSxcbiAgICBTZWdtZW50ICAgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L3NoYXBlcy9zZWdtZW50JyksXG4gICAgVHJhY2VDb21tb24gICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9zaGFwZXMvdHJhY2UtY29tbW9uJyksXG4gICAgVHJhY2VEb3RzICAgICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9zaGFwZXMvdHJhY2UtZG90cycpLFxuICAgIFdhdmVmb3JtICAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3Qvc2hhcGVzL3dhdmVmb3JtJyksXG4gIH0sXG4gIGJlaGF2aW9yczoge1xuICAgIEJhc2VCZWhhdmlvciAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvYmVoYXZpb3JzL2Jhc2UtYmVoYXZpb3InKSxcbiAgICBCcmVha3BvaW50QmVoYXZpb3IgIDogcmVxdWlyZSgnLi9kaXN0L2JlaGF2aW9ycy9icmVha3BvaW50LWJlaGF2aW9yJyksXG4gICAgTWFya2VyQmVoYXZpb3IgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9iZWhhdmlvcnMvbWFya2VyLWJlaGF2aW9yJyksXG4gICAgU2VnbWVudEJlaGF2aW9yICAgICA6IHJlcXVpcmUoJy4vZGlzdC9iZWhhdmlvcnMvc2VnbWVudC1iZWhhdmlvcicpLFxuICAgIFRpbWVDb250ZXh0QmVoYXZpb3IgOiByZXF1aXJlKCcuL2Rpc3QvYmVoYXZpb3JzL3RpbWUtY29udGV4dC1iZWhhdmlvcicpLFxuICAgIFRyYWNlQmVoYXZpb3IgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvYmVoYXZpb3JzL3RyYWNlLWJlaGF2aW9yJyksXG4gIH0sXG4gIGludGVyYWN0aW9uczoge1xuICAgIEV2ZW50U291cmNlICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvaW50ZXJhY3Rpb25zL2V2ZW50LXNvdXJjZScpLFxuICAgIEtleWJvYXJkICAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvaW50ZXJhY3Rpb25zL2tleWJvYXJkJyksXG4gICAgU3VyZmFjZSAgICAgICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9pbnRlcmFjdGlvbnMvc3VyZmFjZScpLFxuICAgIFdhdmVFdmVudCAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvaW50ZXJhY3Rpb25zL3dhdmUtZXZlbnQnKSxcbiAgfSxcbiAgLy8gcmVuYW1lIGZvbGRlciA/XG4gIHN0YXRlczoge1xuICAgIEJhc2VTdGF0ZSAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvdGltZWxpbmUtc3RhdGVzL2Jhc2Utc3RhdGUnKSxcbiAgICBCcnVzaFpvb21TdGF0ZSAgICAgIDogcmVxdWlyZSgnLi9kaXN0L3RpbWVsaW5lLXN0YXRlcy9icnVzaC16b29tLXN0YXRlJyksXG4gICAgQ2VudGVyZWRab29tU3RhdGUgICA6IHJlcXVpcmUoJy4vZGlzdC90aW1lbGluZS1zdGF0ZXMvY2VudGVyZWQtem9vbS1zdGF0ZScpLFxuICAgIENvbnRleHRFZGl0aW9uU3RhdGUgOiByZXF1aXJlKCcuL2Rpc3QvdGltZWxpbmUtc3RhdGVzL2NvbnRleHQtZWRpdGlvbi1zdGF0ZScpLFxuICAgIEVkaXRpb25TdGF0ZSAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvdGltZWxpbmUtc3RhdGVzL2VkaXRpb24tc3RhdGUnKSxcbiAgICBTZWxlY3Rpb25TdGF0ZSAgICAgIDogcmVxdWlyZSgnLi9kaXN0L3RpbWVsaW5lLXN0YXRlcy9zZWxlY3Rpb24tc3RhdGUnKSxcbiAgfSxcbiAgaGVscGVyczoge1xuICAgIEFubm90YXRlZE1hcmtlckxheWVyOiByZXF1aXJlKCcuL2Rpc3QvaGVscGVycy9hbm5vdGF0ZWQtbWFya2VyLWxheWVyJyksXG4gICAgQ3Vyc29yTGF5ZXIgICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9oZWxwZXJzL2N1cnNvci1sYXllcicpLFxuICAgIERvdExheWVyICAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvaGVscGVycy9kb3QtbGF5ZXInKSxcbiAgICBNYXJrZXJMYXllciAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L2hlbHBlcnMvbWFya2VyLWxheWVyJyksXG4gICAgU2VnbWVudExheWVyICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9oZWxwZXJzL3NlZ21lbnQtbGF5ZXInKSxcbiAgICBXYXZlZm9ybUxheWVyICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L2hlbHBlcnMvd2F2ZWZvcm0tbGF5ZXInKSxcbiAgfSxcbiAgdXRpbHM6IHtcbiAgICBPcnRob2dvbmFsRGF0YSAgICAgIDogcmVxdWlyZSgnLi9kaXN0L3V0aWxzL29ydGhvZ29uYWwtZGF0YScpLFxuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBPcnRob2dvbmFsRGF0YSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2NvbHMgPSBudWxsOyAvLyBvYmplY3Qgb2YgYXJyYXlzXG4gICAgdGhpcy5fcm93cyA9IG51bGw7IC8vIGFycmF5IG9mIG9iamVjdHNcbiAgfVxuXG4gIC8vIHZlcmlmeSB0aGF0IGRhdGEgYXJlIGNvbnNpc3RlbnRzXG4gIF9jaGVja0NvbnNpc3RlbmN5KCkge1xuICAgIGxldCBzaXplID0gbnVsbDtcblxuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLl9jb2xzKSB7XG4gICAgICBjb25zdCBjb2wgPSB0aGlzLl9jb2xzW2tleV07XG4gICAgICBjb25zdCBjb2xMZW5ndGggPSBjb2wubGVuZ3RoO1xuXG4gICAgICBpZiAoc2l6ZSAhPT0gbnVsbCAmJiBzaXplICE9PSBjb2xMZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMucHJvdG90eXBlLmNvbnN0cnVjdG9yLm5hbWV9OiBpbmNvbnNpc3RlbnQgZGF0YWApO1xuICAgICAgfSBlbHNlIGlmIChzaXplID09PSBudWxsKSB7XG4gICAgICAgIHNpemUgPSBjb2xMZW5ndGg7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlRnJvbUNvbHMoKSB7XG4gICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLl9jb2xzKTtcblxuICAgIGtleXMuZm9yRWFjaCgoa2V5LCBpKSA9PiB7XG4gICAgICBjb25zdCBjb2wgPSB0aGlzLl9jb2xzW2tleV07XG5cbiAgICAgIGNvbC5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX3Jvd3NbaW5kZXhdID09PSB1bmRlZmluZWQpIHRoaXMuX3Jvd3NbaW5kZXhdID0ge307XG4gICAgICAgIHRoaXMuX3Jvd3NbaW5kZXhdW2tleV0gPSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fY2hlY2tDb25zaXN0ZW5jeSgpO1xuICB9XG5cbiAgdXBkYXRlRnJvbVJvd3MoKSB7XG4gICAgdGhpcy5fcm93cy5mb3JFYWNoKChvYmosIGluZGV4KSA9PiB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkgdGhpcy5fY29sc1trZXldID0gW107XG4gICAgICAgIHRoaXMuX2NvbHNba2V5XS5wdXNoKG9ialtrZXldKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuX2NoZWNrQ29uc2lzdGVuY3koKTtcbiAgfVxuXG4gIHNldCBjb2xzKG9iaikge1xuICAgIHRoaXMuX2NvbHMgPSBvYmo7XG4gICAgdGhpcy5fcm93cyA9IFtdO1xuXG4gICAgdGhpcy51cGRhdGVGcm9tQ29scygpO1xuICB9XG5cbiAgc2V0IHJvd3MoYXJyKSB7XG4gICAgdGhpcy5fcm93cyA9IGFycjtcbiAgICB0aGlzLl9jb2xzID0ge307XG5cbiAgICB0aGlzLnVwZGF0ZUZyb21Sb3dzKCk7XG4gIH1cblxuICBnZXQgY29scygpIHtcbiAgICByZXR1cm4gdGhpcy5fY29scztcbiAgfVxuXG4gIGdldCByb3dzKCkge1xuICAgIHJldHVybiB0aGlzLl9yb3dzO1xuICB9XG59XG4iLCIvKipcbiAqIENvcmUuanMgMC42LjFcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzXG4gKiBMaWNlbnNlOiBodHRwOi8vcm9jay5taXQtbGljZW5zZS5vcmdcbiAqIMKpIDIwMTUgRGVuaXMgUHVzaGthcmV2XG4gKi9cbiFmdW5jdGlvbihnbG9iYWwsIGZyYW1ld29yaywgdW5kZWZpbmVkKXtcbid1c2Ugc3RyaWN0JztcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogY29tbW9uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAvLyBTaG9ydGN1dHMgZm9yIFtbQ2xhc3NdXSAmIHByb3BlcnR5IG5hbWVzXHJcbnZhciBPQkpFQ1QgICAgICAgICAgPSAnT2JqZWN0J1xyXG4gICwgRlVOQ1RJT04gICAgICAgID0gJ0Z1bmN0aW9uJ1xyXG4gICwgQVJSQVkgICAgICAgICAgID0gJ0FycmF5J1xyXG4gICwgU1RSSU5HICAgICAgICAgID0gJ1N0cmluZydcclxuICAsIE5VTUJFUiAgICAgICAgICA9ICdOdW1iZXInXHJcbiAgLCBSRUdFWFAgICAgICAgICAgPSAnUmVnRXhwJ1xyXG4gICwgREFURSAgICAgICAgICAgID0gJ0RhdGUnXHJcbiAgLCBNQVAgICAgICAgICAgICAgPSAnTWFwJ1xyXG4gICwgU0VUICAgICAgICAgICAgID0gJ1NldCdcclxuICAsIFdFQUtNQVAgICAgICAgICA9ICdXZWFrTWFwJ1xyXG4gICwgV0VBS1NFVCAgICAgICAgID0gJ1dlYWtTZXQnXHJcbiAgLCBTWU1CT0wgICAgICAgICAgPSAnU3ltYm9sJ1xyXG4gICwgUFJPTUlTRSAgICAgICAgID0gJ1Byb21pc2UnXHJcbiAgLCBNQVRIICAgICAgICAgICAgPSAnTWF0aCdcclxuICAsIEFSR1VNRU5UUyAgICAgICA9ICdBcmd1bWVudHMnXHJcbiAgLCBQUk9UT1RZUEUgICAgICAgPSAncHJvdG90eXBlJ1xyXG4gICwgQ09OU1RSVUNUT1IgICAgID0gJ2NvbnN0cnVjdG9yJ1xyXG4gICwgVE9fU1RSSU5HICAgICAgID0gJ3RvU3RyaW5nJ1xyXG4gICwgVE9fU1RSSU5HX1RBRyAgID0gVE9fU1RSSU5HICsgJ1RhZydcclxuICAsIFRPX0xPQ0FMRSAgICAgICA9ICd0b0xvY2FsZVN0cmluZydcclxuICAsIEhBU19PV04gICAgICAgICA9ICdoYXNPd25Qcm9wZXJ0eSdcclxuICAsIEZPUl9FQUNIICAgICAgICA9ICdmb3JFYWNoJ1xyXG4gICwgSVRFUkFUT1IgICAgICAgID0gJ2l0ZXJhdG9yJ1xyXG4gICwgRkZfSVRFUkFUT1IgICAgID0gJ0BAJyArIElURVJBVE9SXHJcbiAgLCBQUk9DRVNTICAgICAgICAgPSAncHJvY2VzcydcclxuICAsIENSRUFURV9FTEVNRU5UICA9ICdjcmVhdGVFbGVtZW50J1xyXG4gIC8vIEFsaWFzZXMgZ2xvYmFsIG9iamVjdHMgYW5kIHByb3RvdHlwZXNcclxuICAsIEZ1bmN0aW9uICAgICAgICA9IGdsb2JhbFtGVU5DVElPTl1cclxuICAsIE9iamVjdCAgICAgICAgICA9IGdsb2JhbFtPQkpFQ1RdXHJcbiAgLCBBcnJheSAgICAgICAgICAgPSBnbG9iYWxbQVJSQVldXHJcbiAgLCBTdHJpbmcgICAgICAgICAgPSBnbG9iYWxbU1RSSU5HXVxyXG4gICwgTnVtYmVyICAgICAgICAgID0gZ2xvYmFsW05VTUJFUl1cclxuICAsIFJlZ0V4cCAgICAgICAgICA9IGdsb2JhbFtSRUdFWFBdXHJcbiAgLCBEYXRlICAgICAgICAgICAgPSBnbG9iYWxbREFURV1cclxuICAsIE1hcCAgICAgICAgICAgICA9IGdsb2JhbFtNQVBdXHJcbiAgLCBTZXQgICAgICAgICAgICAgPSBnbG9iYWxbU0VUXVxyXG4gICwgV2Vha01hcCAgICAgICAgID0gZ2xvYmFsW1dFQUtNQVBdXHJcbiAgLCBXZWFrU2V0ICAgICAgICAgPSBnbG9iYWxbV0VBS1NFVF1cclxuICAsIFN5bWJvbCAgICAgICAgICA9IGdsb2JhbFtTWU1CT0xdXHJcbiAgLCBNYXRoICAgICAgICAgICAgPSBnbG9iYWxbTUFUSF1cclxuICAsIFR5cGVFcnJvciAgICAgICA9IGdsb2JhbC5UeXBlRXJyb3JcclxuICAsIFJhbmdlRXJyb3IgICAgICA9IGdsb2JhbC5SYW5nZUVycm9yXHJcbiAgLCBzZXRUaW1lb3V0ICAgICAgPSBnbG9iYWwuc2V0VGltZW91dFxyXG4gICwgc2V0SW1tZWRpYXRlICAgID0gZ2xvYmFsLnNldEltbWVkaWF0ZVxyXG4gICwgY2xlYXJJbW1lZGlhdGUgID0gZ2xvYmFsLmNsZWFySW1tZWRpYXRlXHJcbiAgLCBwYXJzZUludCAgICAgICAgPSBnbG9iYWwucGFyc2VJbnRcclxuICAsIGlzRmluaXRlICAgICAgICA9IGdsb2JhbC5pc0Zpbml0ZVxyXG4gICwgcHJvY2VzcyAgICAgICAgID0gZ2xvYmFsW1BST0NFU1NdXHJcbiAgLCBuZXh0VGljayAgICAgICAgPSBwcm9jZXNzICYmIHByb2Nlc3MubmV4dFRpY2tcclxuICAsIGRvY3VtZW50ICAgICAgICA9IGdsb2JhbC5kb2N1bWVudFxyXG4gICwgaHRtbCAgICAgICAgICAgID0gZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XHJcbiAgLCBuYXZpZ2F0b3IgICAgICAgPSBnbG9iYWwubmF2aWdhdG9yXHJcbiAgLCBkZWZpbmUgICAgICAgICAgPSBnbG9iYWwuZGVmaW5lXHJcbiAgLCBjb25zb2xlICAgICAgICAgPSBnbG9iYWwuY29uc29sZSB8fCB7fVxyXG4gICwgQXJyYXlQcm90byAgICAgID0gQXJyYXlbUFJPVE9UWVBFXVxyXG4gICwgT2JqZWN0UHJvdG8gICAgID0gT2JqZWN0W1BST1RPVFlQRV1cclxuICAsIEZ1bmN0aW9uUHJvdG8gICA9IEZ1bmN0aW9uW1BST1RPVFlQRV1cclxuICAsIEluZmluaXR5ICAgICAgICA9IDEgLyAwXHJcbiAgLCBET1QgICAgICAgICAgICAgPSAnLic7XHJcblxyXG4vLyBodHRwOi8vanNwZXJmLmNvbS9jb3JlLWpzLWlzb2JqZWN0XHJcbmZ1bmN0aW9uIGlzT2JqZWN0KGl0KXtcclxuICByZXR1cm4gaXQgIT09IG51bGwgJiYgKHR5cGVvZiBpdCA9PSAnb2JqZWN0JyB8fCB0eXBlb2YgaXQgPT0gJ2Z1bmN0aW9uJyk7XHJcbn1cclxuZnVuY3Rpb24gaXNGdW5jdGlvbihpdCl7XHJcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnZnVuY3Rpb24nO1xyXG59XHJcbi8vIE5hdGl2ZSBmdW5jdGlvbj9cclxudmFyIGlzTmF0aXZlID0gY3R4KC8uLy50ZXN0LCAvXFxbbmF0aXZlIGNvZGVcXF1cXHMqXFx9XFxzKiQvLCAxKTtcclxuXHJcbi8vIE9iamVjdCBpbnRlcm5hbCBbW0NsYXNzXV0gb3IgdG9TdHJpbmdUYWdcclxuLy8gaHR0cDovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZ1xyXG52YXIgdG9TdHJpbmcgPSBPYmplY3RQcm90b1tUT19TVFJJTkddO1xyXG5mdW5jdGlvbiBzZXRUb1N0cmluZ1RhZyhpdCwgdGFnLCBzdGF0KXtcclxuICBpZihpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXRbUFJPVE9UWVBFXSwgU1lNQk9MX1RBRykpaGlkZGVuKGl0LCBTWU1CT0xfVEFHLCB0YWcpO1xyXG59XHJcbmZ1bmN0aW9uIGNvZihpdCl7XHJcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcclxufVxyXG5mdW5jdGlvbiBjbGFzc29mKGl0KXtcclxuICB2YXIgTywgVDtcclxuICByZXR1cm4gaXQgPT0gdW5kZWZpbmVkID8gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogJ051bGwnXHJcbiAgICA6IHR5cGVvZiAoVCA9IChPID0gT2JqZWN0KGl0KSlbU1lNQk9MX1RBR10pID09ICdzdHJpbmcnID8gVCA6IGNvZihPKTtcclxufVxyXG5cclxuLy8gRnVuY3Rpb25cclxudmFyIGNhbGwgID0gRnVuY3Rpb25Qcm90by5jYWxsXHJcbiAgLCBhcHBseSA9IEZ1bmN0aW9uUHJvdG8uYXBwbHlcclxuICAsIFJFRkVSRU5DRV9HRVQ7XHJcbi8vIFBhcnRpYWwgYXBwbHlcclxuZnVuY3Rpb24gcGFydCgvKiAuLi5hcmdzICovKXtcclxuICB2YXIgZm4gICAgID0gYXNzZXJ0RnVuY3Rpb24odGhpcylcclxuICAgICwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgLCBhcmdzICAgPSBBcnJheShsZW5ndGgpXHJcbiAgICAsIGkgICAgICA9IDBcclxuICAgICwgXyAgICAgID0gcGF0aC5fXHJcbiAgICAsIGhvbGRlciA9IGZhbHNlO1xyXG4gIHdoaWxlKGxlbmd0aCA+IGkpaWYoKGFyZ3NbaV0gPSBhcmd1bWVudHNbaSsrXSkgPT09IF8paG9sZGVyID0gdHJ1ZTtcclxuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XHJcbiAgICB2YXIgdGhhdCAgICA9IHRoaXNcclxuICAgICAgLCBfbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAsIGkgPSAwLCBqID0gMCwgX2FyZ3M7XHJcbiAgICBpZighaG9sZGVyICYmICFfbGVuZ3RoKXJldHVybiBpbnZva2UoZm4sIGFyZ3MsIHRoYXQpO1xyXG4gICAgX2FyZ3MgPSBhcmdzLnNsaWNlKCk7XHJcbiAgICBpZihob2xkZXIpZm9yKDtsZW5ndGggPiBpOyBpKyspaWYoX2FyZ3NbaV0gPT09IF8pX2FyZ3NbaV0gPSBhcmd1bWVudHNbaisrXTtcclxuICAgIHdoaWxlKF9sZW5ndGggPiBqKV9hcmdzLnB1c2goYXJndW1lbnRzW2orK10pO1xyXG4gICAgcmV0dXJuIGludm9rZShmbiwgX2FyZ3MsIHRoYXQpO1xyXG4gIH1cclxufVxyXG4vLyBPcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcclxuZnVuY3Rpb24gY3R4KGZuLCB0aGF0LCBsZW5ndGgpe1xyXG4gIGFzc2VydEZ1bmN0aW9uKGZuKTtcclxuICBpZih+bGVuZ3RoICYmIHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XHJcbiAgc3dpdGNoKGxlbmd0aCl7XHJcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhKXtcclxuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XHJcbiAgICB9XHJcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcclxuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XHJcbiAgICB9XHJcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbihhLCBiLCBjKXtcclxuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XHJcbiAgICB9XHJcbiAgfSByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XHJcbiAgICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xyXG4gIH1cclxufVxyXG4vLyBGYXN0IGFwcGx5XHJcbi8vIGh0dHA6Ly9qc3BlcmYubG5raXQuY29tL2Zhc3QtYXBwbHkvNVxyXG5mdW5jdGlvbiBpbnZva2UoZm4sIGFyZ3MsIHRoYXQpe1xyXG4gIHZhciB1biA9IHRoYXQgPT09IHVuZGVmaW5lZDtcclxuICBzd2l0Y2goYXJncy5sZW5ndGggfCAwKXtcclxuICAgIGNhc2UgMDogcmV0dXJuIHVuID8gZm4oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQpO1xyXG4gICAgY2FzZSAxOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0pO1xyXG4gICAgY2FzZSAyOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xyXG4gICAgY2FzZSAzOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xyXG4gICAgY2FzZSA0OiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xyXG4gICAgY2FzZSA1OiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdLCBhcmdzWzRdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10sIGFyZ3NbNF0pO1xyXG4gIH0gcmV0dXJuICAgICAgICAgICAgICBmbi5hcHBseSh0aGF0LCBhcmdzKTtcclxufVxyXG5cclxuLy8gT2JqZWN0OlxyXG52YXIgY3JlYXRlICAgICAgICAgICA9IE9iamVjdC5jcmVhdGVcclxuICAsIGdldFByb3RvdHlwZU9mICAgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2ZcclxuICAsIHNldFByb3RvdHlwZU9mICAgPSBPYmplY3Quc2V0UHJvdG90eXBlT2ZcclxuICAsIGRlZmluZVByb3BlcnR5ICAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHlcclxuICAsIGRlZmluZVByb3BlcnRpZXMgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllc1xyXG4gICwgZ2V0T3duRGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JcclxuICAsIGdldEtleXMgICAgICAgICAgPSBPYmplY3Qua2V5c1xyXG4gICwgZ2V0TmFtZXMgICAgICAgICA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzXHJcbiAgLCBnZXRTeW1ib2xzICAgICAgID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9sc1xyXG4gICwgaXNGcm96ZW4gICAgICAgICA9IE9iamVjdC5pc0Zyb3plblxyXG4gICwgaGFzICAgICAgICAgICAgICA9IGN0eChjYWxsLCBPYmplY3RQcm90b1tIQVNfT1dOXSwgMilcclxuICAvLyBEdW1teSwgZml4IGZvciBub3QgYXJyYXktbGlrZSBFUzMgc3RyaW5nIGluIGVzNSBtb2R1bGVcclxuICAsIEVTNU9iamVjdCAgICAgICAgPSBPYmplY3RcclxuICAsIERpY3Q7XHJcbmZ1bmN0aW9uIHRvT2JqZWN0KGl0KXtcclxuICByZXR1cm4gRVM1T2JqZWN0KGFzc2VydERlZmluZWQoaXQpKTtcclxufVxyXG5mdW5jdGlvbiByZXR1cm5JdChpdCl7XHJcbiAgcmV0dXJuIGl0O1xyXG59XHJcbmZ1bmN0aW9uIHJldHVyblRoaXMoKXtcclxuICByZXR1cm4gdGhpcztcclxufVxyXG5mdW5jdGlvbiBnZXQob2JqZWN0LCBrZXkpe1xyXG4gIGlmKGhhcyhvYmplY3QsIGtleSkpcmV0dXJuIG9iamVjdFtrZXldO1xyXG59XHJcbmZ1bmN0aW9uIG93bktleXMoaXQpe1xyXG4gIGFzc2VydE9iamVjdChpdCk7XHJcbiAgcmV0dXJuIGdldFN5bWJvbHMgPyBnZXROYW1lcyhpdCkuY29uY2F0KGdldFN5bWJvbHMoaXQpKSA6IGdldE5hbWVzKGl0KTtcclxufVxyXG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXHJcbnZhciBhc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHRhcmdldCwgc291cmNlKXtcclxuICB2YXIgVCA9IE9iamVjdChhc3NlcnREZWZpbmVkKHRhcmdldCkpXHJcbiAgICAsIGwgPSBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAsIGkgPSAxO1xyXG4gIHdoaWxlKGwgPiBpKXtcclxuICAgIHZhciBTICAgICAgPSBFUzVPYmplY3QoYXJndW1lbnRzW2krK10pXHJcbiAgICAgICwga2V5cyAgID0gZ2V0S2V5cyhTKVxyXG4gICAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXHJcbiAgICAgICwgaiAgICAgID0gMFxyXG4gICAgICAsIGtleTtcclxuICAgIHdoaWxlKGxlbmd0aCA+IGopVFtrZXkgPSBrZXlzW2orK11dID0gU1trZXldO1xyXG4gIH1cclxuICByZXR1cm4gVDtcclxufVxyXG5mdW5jdGlvbiBrZXlPZihvYmplY3QsIGVsKXtcclxuICB2YXIgTyAgICAgID0gdG9PYmplY3Qob2JqZWN0KVxyXG4gICAgLCBrZXlzICAgPSBnZXRLZXlzKE8pXHJcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXHJcbiAgICAsIGluZGV4ICA9IDBcclxuICAgICwga2V5O1xyXG4gIHdoaWxlKGxlbmd0aCA+IGluZGV4KWlmKE9ba2V5ID0ga2V5c1tpbmRleCsrXV0gPT09IGVsKXJldHVybiBrZXk7XHJcbn1cclxuXHJcbi8vIEFycmF5XHJcbi8vIGFycmF5KCdzdHIxLHN0cjIsc3RyMycpID0+IFsnc3RyMScsICdzdHIyJywgJ3N0cjMnXVxyXG5mdW5jdGlvbiBhcnJheShpdCl7XHJcbiAgcmV0dXJuIFN0cmluZyhpdCkuc3BsaXQoJywnKTtcclxufVxyXG52YXIgcHVzaCAgICA9IEFycmF5UHJvdG8ucHVzaFxyXG4gICwgdW5zaGlmdCA9IEFycmF5UHJvdG8udW5zaGlmdFxyXG4gICwgc2xpY2UgICA9IEFycmF5UHJvdG8uc2xpY2VcclxuICAsIHNwbGljZSAgPSBBcnJheVByb3RvLnNwbGljZVxyXG4gICwgaW5kZXhPZiA9IEFycmF5UHJvdG8uaW5kZXhPZlxyXG4gICwgZm9yRWFjaCA9IEFycmF5UHJvdG9bRk9SX0VBQ0hdO1xyXG4vKlxyXG4gKiAwIC0+IGZvckVhY2hcclxuICogMSAtPiBtYXBcclxuICogMiAtPiBmaWx0ZXJcclxuICogMyAtPiBzb21lXHJcbiAqIDQgLT4gZXZlcnlcclxuICogNSAtPiBmaW5kXHJcbiAqIDYgLT4gZmluZEluZGV4XHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVBcnJheU1ldGhvZCh0eXBlKXtcclxuICB2YXIgaXNNYXAgICAgICAgPSB0eXBlID09IDFcclxuICAgICwgaXNGaWx0ZXIgICAgPSB0eXBlID09IDJcclxuICAgICwgaXNTb21lICAgICAgPSB0eXBlID09IDNcclxuICAgICwgaXNFdmVyeSAgICAgPSB0eXBlID09IDRcclxuICAgICwgaXNGaW5kSW5kZXggPSB0eXBlID09IDZcclxuICAgICwgbm9ob2xlcyAgICAgPSB0eXBlID09IDUgfHwgaXNGaW5kSW5kZXg7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKGNhbGxiYWNrZm4vKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XHJcbiAgICB2YXIgTyAgICAgID0gT2JqZWN0KGFzc2VydERlZmluZWQodGhpcykpXHJcbiAgICAgICwgdGhhdCAgID0gYXJndW1lbnRzWzFdXHJcbiAgICAgICwgc2VsZiAgID0gRVM1T2JqZWN0KE8pXHJcbiAgICAgICwgZiAgICAgID0gY3R4KGNhbGxiYWNrZm4sIHRoYXQsIDMpXHJcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoc2VsZi5sZW5ndGgpXHJcbiAgICAgICwgaW5kZXggID0gMFxyXG4gICAgICAsIHJlc3VsdCA9IGlzTWFwID8gQXJyYXkobGVuZ3RoKSA6IGlzRmlsdGVyID8gW10gOiB1bmRlZmluZWRcclxuICAgICAgLCB2YWwsIHJlcztcclxuICAgIGZvcig7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspaWYobm9ob2xlcyB8fCBpbmRleCBpbiBzZWxmKXtcclxuICAgICAgdmFsID0gc2VsZltpbmRleF07XHJcbiAgICAgIHJlcyA9IGYodmFsLCBpbmRleCwgTyk7XHJcbiAgICAgIGlmKHR5cGUpe1xyXG4gICAgICAgIGlmKGlzTWFwKXJlc3VsdFtpbmRleF0gPSByZXM7ICAgICAgICAgICAgIC8vIG1hcFxyXG4gICAgICAgIGVsc2UgaWYocmVzKXN3aXRjaCh0eXBlKXtcclxuICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgICAgICAgICAvLyBzb21lXHJcbiAgICAgICAgICBjYXNlIDU6IHJldHVybiB2YWw7ICAgICAgICAgICAgICAgICAgICAgLy8gZmluZFxyXG4gICAgICAgICAgY2FzZSA2OiByZXR1cm4gaW5kZXg7ICAgICAgICAgICAgICAgICAgIC8vIGZpbmRJbmRleFxyXG4gICAgICAgICAgY2FzZSAyOiByZXN1bHQucHVzaCh2YWwpOyAgICAgICAgICAgICAgIC8vIGZpbHRlclxyXG4gICAgICAgIH0gZWxzZSBpZihpc0V2ZXJ5KXJldHVybiBmYWxzZTsgICAgICAgICAgIC8vIGV2ZXJ5XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBpc0ZpbmRJbmRleCA/IC0xIDogaXNTb21lIHx8IGlzRXZlcnkgPyBpc0V2ZXJ5IDogcmVzdWx0O1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBjcmVhdGVBcnJheUNvbnRhaW5zKGlzQ29udGFpbnMpe1xyXG4gIHJldHVybiBmdW5jdGlvbihlbCAvKiwgZnJvbUluZGV4ID0gMCAqLyl7XHJcbiAgICB2YXIgTyAgICAgID0gdG9PYmplY3QodGhpcylcclxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcclxuICAgICAgLCBpbmRleCAgPSB0b0luZGV4KGFyZ3VtZW50c1sxXSwgbGVuZ3RoKTtcclxuICAgIGlmKGlzQ29udGFpbnMgJiYgZWwgIT0gZWwpe1xyXG4gICAgICBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKHNhbWVOYU4oT1tpbmRleF0pKXJldHVybiBpc0NvbnRhaW5zIHx8IGluZGV4O1xyXG4gICAgfSBlbHNlIGZvcig7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspaWYoaXNDb250YWlucyB8fCBpbmRleCBpbiBPKXtcclxuICAgICAgaWYoT1tpbmRleF0gPT09IGVsKXJldHVybiBpc0NvbnRhaW5zIHx8IGluZGV4O1xyXG4gICAgfSByZXR1cm4gIWlzQ29udGFpbnMgJiYgLTE7XHJcbiAgfVxyXG59XHJcbmZ1bmN0aW9uIGdlbmVyaWMoQSwgQil7XHJcbiAgLy8gc3RyYW5nZSBJRSBxdWlya3MgbW9kZSBidWcgLT4gdXNlIHR5cGVvZiB2cyBpc0Z1bmN0aW9uXHJcbiAgcmV0dXJuIHR5cGVvZiBBID09ICdmdW5jdGlvbicgPyBBIDogQjtcclxufVxyXG5cclxuLy8gTWF0aFxyXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDB4MWZmZmZmZmZmZmZmZmYgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxyXG4gICwgcG93ICAgID0gTWF0aC5wb3dcclxuICAsIGFicyAgICA9IE1hdGguYWJzXHJcbiAgLCBjZWlsICAgPSBNYXRoLmNlaWxcclxuICAsIGZsb29yICA9IE1hdGguZmxvb3JcclxuICAsIG1heCAgICA9IE1hdGgubWF4XHJcbiAgLCBtaW4gICAgPSBNYXRoLm1pblxyXG4gICwgcmFuZG9tID0gTWF0aC5yYW5kb21cclxuICAsIHRydW5jICA9IE1hdGgudHJ1bmMgfHwgZnVuY3Rpb24oaXQpe1xyXG4gICAgICByZXR1cm4gKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xyXG4gICAgfVxyXG4vLyAyMC4xLjIuNCBOdW1iZXIuaXNOYU4obnVtYmVyKVxyXG5mdW5jdGlvbiBzYW1lTmFOKG51bWJlcil7XHJcbiAgcmV0dXJuIG51bWJlciAhPSBudW1iZXI7XHJcbn1cclxuLy8gNy4xLjQgVG9JbnRlZ2VyXHJcbmZ1bmN0aW9uIHRvSW50ZWdlcihpdCl7XHJcbiAgcmV0dXJuIGlzTmFOKGl0KSA/IDAgOiB0cnVuYyhpdCk7XHJcbn1cclxuLy8gNy4xLjE1IFRvTGVuZ3RoXHJcbmZ1bmN0aW9uIHRvTGVuZ3RoKGl0KXtcclxuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIE1BWF9TQUZFX0lOVEVHRVIpIDogMDtcclxufVxyXG5mdW5jdGlvbiB0b0luZGV4KGluZGV4LCBsZW5ndGgpe1xyXG4gIHZhciBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XHJcbiAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XHJcbn1cclxuZnVuY3Rpb24gbHoobnVtKXtcclxuICByZXR1cm4gbnVtID4gOSA/IG51bSA6ICcwJyArIG51bTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlUmVwbGFjZXIocmVnRXhwLCByZXBsYWNlLCBpc1N0YXRpYyl7XHJcbiAgdmFyIHJlcGxhY2VyID0gaXNPYmplY3QocmVwbGFjZSkgPyBmdW5jdGlvbihwYXJ0KXtcclxuICAgIHJldHVybiByZXBsYWNlW3BhcnRdO1xyXG4gIH0gOiByZXBsYWNlO1xyXG4gIHJldHVybiBmdW5jdGlvbihpdCl7XHJcbiAgICByZXR1cm4gU3RyaW5nKGlzU3RhdGljID8gaXQgOiB0aGlzKS5yZXBsYWNlKHJlZ0V4cCwgcmVwbGFjZXIpO1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBjcmVhdGVQb2ludEF0KHRvU3RyaW5nKXtcclxuICByZXR1cm4gZnVuY3Rpb24ocG9zKXtcclxuICAgIHZhciBzID0gU3RyaW5nKGFzc2VydERlZmluZWQodGhpcykpXHJcbiAgICAgICwgaSA9IHRvSW50ZWdlcihwb3MpXHJcbiAgICAgICwgbCA9IHMubGVuZ3RoXHJcbiAgICAgICwgYSwgYjtcclxuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gdG9TdHJpbmcgPyAnJyA6IHVuZGVmaW5lZDtcclxuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XHJcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxyXG4gICAgICA/IHRvU3RyaW5nID8gcy5jaGFyQXQoaSkgOiBhXHJcbiAgICAgIDogdG9TdHJpbmcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBBc3NlcnRpb24gJiBlcnJvcnNcclxudmFyIFJFRFVDRV9FUlJPUiA9ICdSZWR1Y2Ugb2YgZW1wdHkgb2JqZWN0IHdpdGggbm8gaW5pdGlhbCB2YWx1ZSc7XHJcbmZ1bmN0aW9uIGFzc2VydChjb25kaXRpb24sIG1zZzEsIG1zZzIpe1xyXG4gIGlmKCFjb25kaXRpb24pdGhyb3cgVHlwZUVycm9yKG1zZzIgPyBtc2cxICsgbXNnMiA6IG1zZzEpO1xyXG59XHJcbmZ1bmN0aW9uIGFzc2VydERlZmluZWQoaXQpe1xyXG4gIGlmKGl0ID09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoJ0Z1bmN0aW9uIGNhbGxlZCBvbiBudWxsIG9yIHVuZGVmaW5lZCcpO1xyXG4gIHJldHVybiBpdDtcclxufVxyXG5mdW5jdGlvbiBhc3NlcnRGdW5jdGlvbihpdCl7XHJcbiAgYXNzZXJ0KGlzRnVuY3Rpb24oaXQpLCBpdCwgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcclxuICByZXR1cm4gaXQ7XHJcbn1cclxuZnVuY3Rpb24gYXNzZXJ0T2JqZWN0KGl0KXtcclxuICBhc3NlcnQoaXNPYmplY3QoaXQpLCBpdCwgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xyXG4gIHJldHVybiBpdDtcclxufVxyXG5mdW5jdGlvbiBhc3NlcnRJbnN0YW5jZShpdCwgQ29uc3RydWN0b3IsIG5hbWUpe1xyXG4gIGFzc2VydChpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yLCBuYW1lLCBcIjogdXNlIHRoZSAnbmV3JyBvcGVyYXRvciFcIik7XHJcbn1cclxuXHJcbi8vIFByb3BlcnR5IGRlc2NyaXB0b3JzICYgU3ltYm9sXHJcbmZ1bmN0aW9uIGRlc2NyaXB0b3IoYml0bWFwLCB2YWx1ZSl7XHJcbiAgcmV0dXJuIHtcclxuICAgIGVudW1lcmFibGUgIDogIShiaXRtYXAgJiAxKSxcclxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcclxuICAgIHdyaXRhYmxlICAgIDogIShiaXRtYXAgJiA0KSxcclxuICAgIHZhbHVlICAgICAgIDogdmFsdWVcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gc2ltcGxlU2V0KG9iamVjdCwga2V5LCB2YWx1ZSl7XHJcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcclxuICByZXR1cm4gb2JqZWN0O1xyXG59XHJcbmZ1bmN0aW9uIGNyZWF0ZURlZmluZXIoYml0bWFwKXtcclxuICByZXR1cm4gREVTQyA/IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XHJcbiAgICByZXR1cm4gZGVmaW5lUHJvcGVydHkob2JqZWN0LCBrZXksIGRlc2NyaXB0b3IoYml0bWFwLCB2YWx1ZSkpO1xyXG4gIH0gOiBzaW1wbGVTZXQ7XHJcbn1cclxuZnVuY3Rpb24gdWlkKGtleSl7XHJcbiAgcmV0dXJuIFNZTUJPTCArICcoJyArIGtleSArICcpXycgKyAoKytzaWQgKyByYW5kb20oKSlbVE9fU1RSSU5HXSgzNik7XHJcbn1cclxuZnVuY3Rpb24gZ2V0V2VsbEtub3duU3ltYm9sKG5hbWUsIHNldHRlcil7XHJcbiAgcmV0dXJuIChTeW1ib2wgJiYgU3ltYm9sW25hbWVdKSB8fCAoc2V0dGVyID8gU3ltYm9sIDogc2FmZVN5bWJvbCkoU1lNQk9MICsgRE9UICsgbmFtZSk7XHJcbn1cclxuLy8gVGhlIGVuZ2luZSB3b3JrcyBmaW5lIHdpdGggZGVzY3JpcHRvcnM/IFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHkuXHJcbnZhciBERVNDID0gISFmdW5jdGlvbigpe1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gMiB9fSkuYSA9PSAyO1xyXG4gICAgICB9IGNhdGNoKGUpe31cclxuICAgIH0oKVxyXG4gICwgc2lkICAgID0gMFxyXG4gICwgaGlkZGVuID0gY3JlYXRlRGVmaW5lcigxKVxyXG4gICwgc2V0ICAgID0gU3ltYm9sID8gc2ltcGxlU2V0IDogaGlkZGVuXHJcbiAgLCBzYWZlU3ltYm9sID0gU3ltYm9sIHx8IHVpZDtcclxuZnVuY3Rpb24gYXNzaWduSGlkZGVuKHRhcmdldCwgc3JjKXtcclxuICBmb3IodmFyIGtleSBpbiBzcmMpaGlkZGVuKHRhcmdldCwga2V5LCBzcmNba2V5XSk7XHJcbiAgcmV0dXJuIHRhcmdldDtcclxufVxyXG5cclxudmFyIFNZTUJPTF9VTlNDT1BBQkxFUyA9IGdldFdlbGxLbm93blN5bWJvbCgndW5zY29wYWJsZXMnKVxyXG4gICwgQXJyYXlVbnNjb3BhYmxlcyAgID0gQXJyYXlQcm90b1tTWU1CT0xfVU5TQ09QQUJMRVNdIHx8IHt9XHJcbiAgLCBTWU1CT0xfVEFHICAgICAgICAgPSBnZXRXZWxsS25vd25TeW1ib2woVE9fU1RSSU5HX1RBRylcclxuICAsIFNZTUJPTF9TUEVDSUVTICAgICA9IGdldFdlbGxLbm93blN5bWJvbCgnc3BlY2llcycpXHJcbiAgLCBTWU1CT0xfSVRFUkFUT1I7XHJcbmZ1bmN0aW9uIHNldFNwZWNpZXMoQyl7XHJcbiAgaWYoREVTQyAmJiAoZnJhbWV3b3JrIHx8ICFpc05hdGl2ZShDKSkpZGVmaW5lUHJvcGVydHkoQywgU1lNQk9MX1NQRUNJRVMsIHtcclxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgIGdldDogcmV0dXJuVGhpc1xyXG4gIH0pO1xyXG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvbW1vbi5leHBvcnQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBOT0RFID0gY29mKHByb2Nlc3MpID09IFBST0NFU1NcclxuICAsIGNvcmUgPSB7fVxyXG4gICwgcGF0aCA9IGZyYW1ld29yayA/IGdsb2JhbCA6IGNvcmVcclxuICAsIG9sZCAgPSBnbG9iYWwuY29yZVxyXG4gICwgZXhwb3J0R2xvYmFsXHJcbiAgLy8gdHlwZSBiaXRtYXBcclxuICAsIEZPUkNFRCA9IDFcclxuICAsIEdMT0JBTCA9IDJcclxuICAsIFNUQVRJQyA9IDRcclxuICAsIFBST1RPICA9IDhcclxuICAsIEJJTkQgICA9IDE2XHJcbiAgLCBXUkFQICAgPSAzMjtcclxuZnVuY3Rpb24gJGRlZmluZSh0eXBlLCBuYW1lLCBzb3VyY2Upe1xyXG4gIHZhciBrZXksIG93biwgb3V0LCBleHBcclxuICAgICwgaXNHbG9iYWwgPSB0eXBlICYgR0xPQkFMXHJcbiAgICAsIHRhcmdldCAgID0gaXNHbG9iYWwgPyBnbG9iYWwgOiAodHlwZSAmIFNUQVRJQylcclxuICAgICAgICA/IGdsb2JhbFtuYW1lXSA6IChnbG9iYWxbbmFtZV0gfHwgT2JqZWN0UHJvdG8pW1BST1RPVFlQRV1cclxuICAgICwgZXhwb3J0cyAgPSBpc0dsb2JhbCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xyXG4gIGlmKGlzR2xvYmFsKXNvdXJjZSA9IG5hbWU7XHJcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xyXG4gICAgLy8gdGhlcmUgaXMgYSBzaW1pbGFyIG5hdGl2ZVxyXG4gICAgb3duID0gISh0eXBlICYgRk9SQ0VEKSAmJiB0YXJnZXQgJiYga2V5IGluIHRhcmdldFxyXG4gICAgICAmJiAoIWlzRnVuY3Rpb24odGFyZ2V0W2tleV0pIHx8IGlzTmF0aXZlKHRhcmdldFtrZXldKSk7XHJcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxyXG4gICAgb3V0ID0gKG93biA/IHRhcmdldCA6IHNvdXJjZSlba2V5XTtcclxuICAgIC8vIHByZXZlbnQgZ2xvYmFsIHBvbGx1dGlvbiBmb3IgbmFtZXNwYWNlc1xyXG4gICAgaWYoIWZyYW1ld29yayAmJiBpc0dsb2JhbCAmJiAhaXNGdW5jdGlvbih0YXJnZXRba2V5XSkpZXhwID0gc291cmNlW2tleV07XHJcbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxyXG4gICAgZWxzZSBpZih0eXBlICYgQklORCAmJiBvd24pZXhwID0gY3R4KG91dCwgZ2xvYmFsKTtcclxuICAgIC8vIHdyYXAgZ2xvYmFsIGNvbnN0cnVjdG9ycyBmb3IgcHJldmVudCBjaGFuZ2UgdGhlbSBpbiBsaWJyYXJ5XHJcbiAgICBlbHNlIGlmKHR5cGUgJiBXUkFQICYmICFmcmFtZXdvcmsgJiYgdGFyZ2V0W2tleV0gPT0gb3V0KXtcclxuICAgICAgZXhwID0gZnVuY3Rpb24ocGFyYW0pe1xyXG4gICAgICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2Ygb3V0ID8gbmV3IG91dChwYXJhbSkgOiBvdXQocGFyYW0pO1xyXG4gICAgICB9XHJcbiAgICAgIGV4cFtQUk9UT1RZUEVdID0gb3V0W1BST1RPVFlQRV07XHJcbiAgICB9IGVsc2UgZXhwID0gdHlwZSAmIFBST1RPICYmIGlzRnVuY3Rpb24ob3V0KSA/IGN0eChjYWxsLCBvdXQpIDogb3V0O1xyXG4gICAgLy8gZXh0ZW5kIGdsb2JhbFxyXG4gICAgaWYoZnJhbWV3b3JrICYmIHRhcmdldCAmJiAhb3duKXtcclxuICAgICAgaWYoaXNHbG9iYWwpdGFyZ2V0W2tleV0gPSBvdXQ7XHJcbiAgICAgIGVsc2UgZGVsZXRlIHRhcmdldFtrZXldICYmIGhpZGRlbih0YXJnZXQsIGtleSwgb3V0KTtcclxuICAgIH1cclxuICAgIC8vIGV4cG9ydFxyXG4gICAgaWYoZXhwb3J0c1trZXldICE9IG91dCloaWRkZW4oZXhwb3J0cywga2V5LCBleHApO1xyXG4gIH1cclxufVxyXG4vLyBDb21tb25KUyBleHBvcnRcclxuaWYodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyltb2R1bGUuZXhwb3J0cyA9IGNvcmU7XHJcbi8vIFJlcXVpcmVKUyBleHBvcnRcclxuZWxzZSBpZihpc0Z1bmN0aW9uKGRlZmluZSkgJiYgZGVmaW5lLmFtZClkZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gY29yZX0pO1xyXG4vLyBFeHBvcnQgdG8gZ2xvYmFsIG9iamVjdFxyXG5lbHNlIGV4cG9ydEdsb2JhbCA9IHRydWU7XHJcbmlmKGV4cG9ydEdsb2JhbCB8fCBmcmFtZXdvcmspe1xyXG4gIGNvcmUubm9Db25mbGljdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICBnbG9iYWwuY29yZSA9IG9sZDtcclxuICAgIHJldHVybiBjb3JlO1xyXG4gIH1cclxuICBnbG9iYWwuY29yZSA9IGNvcmU7XHJcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogY29tbW9uLml0ZXJhdG9ycyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuU1lNQk9MX0lURVJBVE9SID0gZ2V0V2VsbEtub3duU3ltYm9sKElURVJBVE9SKTtcclxudmFyIElURVIgID0gc2FmZVN5bWJvbCgnaXRlcicpXHJcbiAgLCBLRVkgICA9IDFcclxuICAsIFZBTFVFID0gMlxyXG4gICwgSXRlcmF0b3JzID0ge31cclxuICAsIEl0ZXJhdG9yUHJvdG90eXBlID0ge31cclxuICAgIC8vIFNhZmFyaSBoYXMgYnlnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcclxuICAsIEJVR0dZX0lURVJBVE9SUyA9ICdrZXlzJyBpbiBBcnJheVByb3RvICYmICEoJ25leHQnIGluIFtdLmtleXMoKSk7XHJcbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXHJcbnNldEl0ZXJhdG9yKEl0ZXJhdG9yUHJvdG90eXBlLCByZXR1cm5UaGlzKTtcclxuZnVuY3Rpb24gc2V0SXRlcmF0b3IoTywgdmFsdWUpe1xyXG4gIGhpZGRlbihPLCBTWU1CT0xfSVRFUkFUT1IsIHZhbHVlKTtcclxuICAvLyBBZGQgaXRlcmF0b3IgZm9yIEZGIGl0ZXJhdG9yIHByb3RvY29sXHJcbiAgRkZfSVRFUkFUT1IgaW4gQXJyYXlQcm90byAmJiBoaWRkZW4oTywgRkZfSVRFUkFUT1IsIHZhbHVlKTtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGVJdGVyYXRvcihDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCwgcHJvdG8pe1xyXG4gIENvbnN0cnVjdG9yW1BST1RPVFlQRV0gPSBjcmVhdGUocHJvdG8gfHwgSXRlcmF0b3JQcm90b3R5cGUsIHtuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpfSk7XHJcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XHJcbn1cclxuZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3IoQ29uc3RydWN0b3IsIE5BTUUsIHZhbHVlLCBERUZBVUxUKXtcclxuICB2YXIgcHJvdG8gPSBDb25zdHJ1Y3RvcltQUk9UT1RZUEVdXHJcbiAgICAsIGl0ZXIgID0gZ2V0KHByb3RvLCBTWU1CT0xfSVRFUkFUT1IpIHx8IGdldChwcm90bywgRkZfSVRFUkFUT1IpIHx8IChERUZBVUxUICYmIGdldChwcm90bywgREVGQVVMVCkpIHx8IHZhbHVlO1xyXG4gIGlmKGZyYW1ld29yayl7XHJcbiAgICAvLyBEZWZpbmUgaXRlcmF0b3JcclxuICAgIHNldEl0ZXJhdG9yKHByb3RvLCBpdGVyKTtcclxuICAgIGlmKGl0ZXIgIT09IHZhbHVlKXtcclxuICAgICAgdmFyIGl0ZXJQcm90byA9IGdldFByb3RvdHlwZU9mKGl0ZXIuY2FsbChuZXcgQ29uc3RydWN0b3IpKTtcclxuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xyXG4gICAgICBzZXRUb1N0cmluZ1RhZyhpdGVyUHJvdG8sIE5BTUUgKyAnIEl0ZXJhdG9yJywgdHJ1ZSk7XHJcbiAgICAgIC8vIEZGIGZpeFxyXG4gICAgICBoYXMocHJvdG8sIEZGX0lURVJBVE9SKSAmJiBzZXRJdGVyYXRvcihpdGVyUHJvdG8sIHJldHVyblRoaXMpO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XHJcbiAgSXRlcmF0b3JzW05BTUVdID0gaXRlcjtcclxuICAvLyBGRiAmIHY4IGZpeFxyXG4gIEl0ZXJhdG9yc1tOQU1FICsgJyBJdGVyYXRvciddID0gcmV0dXJuVGhpcztcclxuICByZXR1cm4gaXRlcjtcclxufVxyXG5mdW5jdGlvbiBkZWZpbmVTdGRJdGVyYXRvcnMoQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCl7XHJcbiAgZnVuY3Rpb24gY3JlYXRlSXRlcihraW5kKXtcclxuICAgIHJldHVybiBmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpO1xyXG4gICAgfVxyXG4gIH1cclxuICBjcmVhdGVJdGVyYXRvcihDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XHJcbiAgdmFyIGVudHJpZXMgPSBjcmVhdGVJdGVyKEtFWStWQUxVRSlcclxuICAgICwgdmFsdWVzICA9IGNyZWF0ZUl0ZXIoVkFMVUUpO1xyXG4gIGlmKERFRkFVTFQgPT0gVkFMVUUpdmFsdWVzID0gZGVmaW5lSXRlcmF0b3IoQmFzZSwgTkFNRSwgdmFsdWVzLCAndmFsdWVzJyk7XHJcbiAgZWxzZSBlbnRyaWVzID0gZGVmaW5lSXRlcmF0b3IoQmFzZSwgTkFNRSwgZW50cmllcywgJ2VudHJpZXMnKTtcclxuICBpZihERUZBVUxUKXtcclxuICAgICRkZWZpbmUoUFJPVE8gKyBGT1JDRUQgKiBCVUdHWV9JVEVSQVRPUlMsIE5BTUUsIHtcclxuICAgICAgZW50cmllczogZW50cmllcyxcclxuICAgICAga2V5czogSVNfU0VUID8gdmFsdWVzIDogY3JlYXRlSXRlcihLRVkpLFxyXG4gICAgICB2YWx1ZXM6IHZhbHVlc1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbmZ1bmN0aW9uIGl0ZXJSZXN1bHQoZG9uZSwgdmFsdWUpe1xyXG4gIHJldHVybiB7dmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmV9O1xyXG59XHJcbmZ1bmN0aW9uIGlzSXRlcmFibGUoaXQpe1xyXG4gIHZhciBPICAgICAgPSBPYmplY3QoaXQpXHJcbiAgICAsIFN5bWJvbCA9IGdsb2JhbFtTWU1CT0xdXHJcbiAgICAsIGhhc0V4dCA9IChTeW1ib2wgJiYgU3ltYm9sW0lURVJBVE9SXSB8fCBGRl9JVEVSQVRPUikgaW4gTztcclxuICByZXR1cm4gaGFzRXh0IHx8IFNZTUJPTF9JVEVSQVRPUiBpbiBPIHx8IGhhcyhJdGVyYXRvcnMsIGNsYXNzb2YoTykpO1xyXG59XHJcbmZ1bmN0aW9uIGdldEl0ZXJhdG9yKGl0KXtcclxuICB2YXIgU3ltYm9sICA9IGdsb2JhbFtTWU1CT0xdXHJcbiAgICAsIGV4dCAgICAgPSBpdFtTeW1ib2wgJiYgU3ltYm9sW0lURVJBVE9SXSB8fCBGRl9JVEVSQVRPUl1cclxuICAgICwgZ2V0SXRlciA9IGV4dCB8fCBpdFtTWU1CT0xfSVRFUkFUT1JdIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XHJcbiAgcmV0dXJuIGFzc2VydE9iamVjdChnZXRJdGVyLmNhbGwoaXQpKTtcclxufVxyXG5mdW5jdGlvbiBzdGVwQ2FsbChmbiwgdmFsdWUsIGVudHJpZXMpe1xyXG4gIHJldHVybiBlbnRyaWVzID8gaW52b2tlKGZuLCB2YWx1ZSkgOiBmbih2YWx1ZSk7XHJcbn1cclxuZnVuY3Rpb24gY2hlY2tEYW5nZXJJdGVyQ2xvc2luZyhmbil7XHJcbiAgdmFyIGRhbmdlciA9IHRydWU7XHJcbiAgdmFyIE8gPSB7XHJcbiAgICBuZXh0OiBmdW5jdGlvbigpeyB0aHJvdyAxIH0sXHJcbiAgICAncmV0dXJuJzogZnVuY3Rpb24oKXsgZGFuZ2VyID0gZmFsc2UgfVxyXG4gIH07XHJcbiAgT1tTWU1CT0xfSVRFUkFUT1JdID0gcmV0dXJuVGhpcztcclxuICB0cnkge1xyXG4gICAgZm4oTyk7XHJcbiAgfSBjYXRjaChlKXt9XHJcbiAgcmV0dXJuIGRhbmdlcjtcclxufVxyXG5mdW5jdGlvbiBjbG9zZUl0ZXJhdG9yKGl0ZXJhdG9yKXtcclxuICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xyXG4gIGlmKHJldCAhPT0gdW5kZWZpbmVkKXJldC5jYWxsKGl0ZXJhdG9yKTtcclxufVxyXG5mdW5jdGlvbiBzYWZlSXRlckNsb3NlKGV4ZWMsIGl0ZXJhdG9yKXtcclxuICB0cnkge1xyXG4gICAgZXhlYyhpdGVyYXRvcik7XHJcbiAgfSBjYXRjaChlKXtcclxuICAgIGNsb3NlSXRlcmF0b3IoaXRlcmF0b3IpO1xyXG4gICAgdGhyb3cgZTtcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gZm9yT2YoaXRlcmFibGUsIGVudHJpZXMsIGZuLCB0aGF0KXtcclxuICBzYWZlSXRlckNsb3NlKGZ1bmN0aW9uKGl0ZXJhdG9yKXtcclxuICAgIHZhciBmID0gY3R4KGZuLCB0aGF0LCBlbnRyaWVzID8gMiA6IDEpXHJcbiAgICAgICwgc3RlcDtcclxuICAgIHdoaWxlKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSlpZihzdGVwQ2FsbChmLCBzdGVwLnZhbHVlLCBlbnRyaWVzKSA9PT0gZmFsc2Upe1xyXG4gICAgICByZXR1cm4gY2xvc2VJdGVyYXRvcihpdGVyYXRvcik7XHJcbiAgICB9XHJcbiAgfSwgZ2V0SXRlcmF0b3IoaXRlcmFibGUpKTtcclxufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczYuc3ltYm9sICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBFQ01BU2NyaXB0IDYgc3ltYm9scyBzaGltXHJcbiFmdW5jdGlvbihUQUcsIFN5bWJvbFJlZ2lzdHJ5LCBBbGxTeW1ib2xzLCBzZXR0ZXIpe1xyXG4gIC8vIDE5LjQuMS4xIFN5bWJvbChbZGVzY3JpcHRpb25dKVxyXG4gIGlmKCFpc05hdGl2ZShTeW1ib2wpKXtcclxuICAgIFN5bWJvbCA9IGZ1bmN0aW9uKGRlc2NyaXB0aW9uKXtcclxuICAgICAgYXNzZXJ0KCEodGhpcyBpbnN0YW5jZW9mIFN5bWJvbCksIFNZTUJPTCArICcgaXMgbm90IGEgJyArIENPTlNUUlVDVE9SKTtcclxuICAgICAgdmFyIHRhZyA9IHVpZChkZXNjcmlwdGlvbilcclxuICAgICAgICAsIHN5bSA9IHNldChjcmVhdGUoU3ltYm9sW1BST1RPVFlQRV0pLCBUQUcsIHRhZyk7XHJcbiAgICAgIEFsbFN5bWJvbHNbdGFnXSA9IHN5bTtcclxuICAgICAgREVTQyAmJiBzZXR0ZXIgJiYgZGVmaW5lUHJvcGVydHkoT2JqZWN0UHJvdG8sIHRhZywge1xyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKXtcclxuICAgICAgICAgIGhpZGRlbih0aGlzLCB0YWcsIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gc3ltO1xyXG4gICAgfVxyXG4gICAgaGlkZGVuKFN5bWJvbFtQUk9UT1RZUEVdLCBUT19TVFJJTkcsIGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiB0aGlzW1RBR107XHJcbiAgICB9KTtcclxuICB9XHJcbiAgJGRlZmluZShHTE9CQUwgKyBXUkFQLCB7U3ltYm9sOiBTeW1ib2x9KTtcclxuICBcclxuICB2YXIgc3ltYm9sU3RhdGljcyA9IHtcclxuICAgIC8vIDE5LjQuMi4xIFN5bWJvbC5mb3Ioa2V5KVxyXG4gICAgJ2Zvcic6IGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIHJldHVybiBoYXMoU3ltYm9sUmVnaXN0cnksIGtleSArPSAnJylcclxuICAgICAgICA/IFN5bWJvbFJlZ2lzdHJ5W2tleV1cclxuICAgICAgICA6IFN5bWJvbFJlZ2lzdHJ5W2tleV0gPSBTeW1ib2woa2V5KTtcclxuICAgIH0sXHJcbiAgICAvLyAxOS40LjIuNCBTeW1ib2wuaXRlcmF0b3JcclxuICAgIGl0ZXJhdG9yOiBTWU1CT0xfSVRFUkFUT1IgfHwgZ2V0V2VsbEtub3duU3ltYm9sKElURVJBVE9SKSxcclxuICAgIC8vIDE5LjQuMi41IFN5bWJvbC5rZXlGb3Ioc3ltKVxyXG4gICAga2V5Rm9yOiBwYXJ0LmNhbGwoa2V5T2YsIFN5bWJvbFJlZ2lzdHJ5KSxcclxuICAgIC8vIDE5LjQuMi4xMCBTeW1ib2wuc3BlY2llc1xyXG4gICAgc3BlY2llczogU1lNQk9MX1NQRUNJRVMsXHJcbiAgICAvLyAxOS40LjIuMTMgU3ltYm9sLnRvU3RyaW5nVGFnXHJcbiAgICB0b1N0cmluZ1RhZzogU1lNQk9MX1RBRyA9IGdldFdlbGxLbm93blN5bWJvbChUT19TVFJJTkdfVEFHLCB0cnVlKSxcclxuICAgIC8vIDE5LjQuMi4xNCBTeW1ib2wudW5zY29wYWJsZXNcclxuICAgIHVuc2NvcGFibGVzOiBTWU1CT0xfVU5TQ09QQUJMRVMsXHJcbiAgICBwdXJlOiBzYWZlU3ltYm9sLFxyXG4gICAgc2V0OiBzZXQsXHJcbiAgICB1c2VTZXR0ZXI6IGZ1bmN0aW9uKCl7c2V0dGVyID0gdHJ1ZX0sXHJcbiAgICB1c2VTaW1wbGU6IGZ1bmN0aW9uKCl7c2V0dGVyID0gZmFsc2V9XHJcbiAgfTtcclxuICAvLyAxOS40LjIuMiBTeW1ib2wuaGFzSW5zdGFuY2VcclxuICAvLyAxOS40LjIuMyBTeW1ib2wuaXNDb25jYXRTcHJlYWRhYmxlXHJcbiAgLy8gMTkuNC4yLjYgU3ltYm9sLm1hdGNoXHJcbiAgLy8gMTkuNC4yLjggU3ltYm9sLnJlcGxhY2VcclxuICAvLyAxOS40LjIuOSBTeW1ib2wuc2VhcmNoXHJcbiAgLy8gMTkuNC4yLjExIFN5bWJvbC5zcGxpdFxyXG4gIC8vIDE5LjQuMi4xMiBTeW1ib2wudG9QcmltaXRpdmVcclxuICBmb3JFYWNoLmNhbGwoYXJyYXkoJ2hhc0luc3RhbmNlLGlzQ29uY2F0U3ByZWFkYWJsZSxtYXRjaCxyZXBsYWNlLHNlYXJjaCxzcGxpdCx0b1ByaW1pdGl2ZScpLFxyXG4gICAgZnVuY3Rpb24oaXQpe1xyXG4gICAgICBzeW1ib2xTdGF0aWNzW2l0XSA9IGdldFdlbGxLbm93blN5bWJvbChpdCk7XHJcbiAgICB9XHJcbiAgKTtcclxuICAkZGVmaW5lKFNUQVRJQywgU1lNQk9MLCBzeW1ib2xTdGF0aWNzKTtcclxuICBcclxuICBzZXRUb1N0cmluZ1RhZyhTeW1ib2wsIFNZTUJPTCk7XHJcbiAgXHJcbiAgJGRlZmluZShTVEFUSUMgKyBGT1JDRUQgKiAhaXNOYXRpdmUoU3ltYm9sKSwgT0JKRUNULCB7XHJcbiAgICAvLyAxOS4xLjIuNyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxyXG4gICAgZ2V0T3duUHJvcGVydHlOYW1lczogZnVuY3Rpb24oaXQpe1xyXG4gICAgICB2YXIgbmFtZXMgPSBnZXROYW1lcyh0b09iamVjdChpdCkpLCByZXN1bHQgPSBbXSwga2V5LCBpID0gMDtcclxuICAgICAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSloYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH0sXHJcbiAgICAvLyAxOS4xLjIuOCBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKE8pXHJcbiAgICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6IGZ1bmN0aW9uKGl0KXtcclxuICAgICAgdmFyIG5hbWVzID0gZ2V0TmFtZXModG9PYmplY3QoaXQpKSwgcmVzdWx0ID0gW10sIGtleSwgaSA9IDA7XHJcbiAgICAgIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIHJlc3VsdC5wdXNoKEFsbFN5bWJvbHNba2V5XSk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgXHJcbiAgLy8gMjAuMi4xLjkgTWF0aFtAQHRvU3RyaW5nVGFnXVxyXG4gIHNldFRvU3RyaW5nVGFnKE1hdGgsIE1BVEgsIHRydWUpO1xyXG4gIC8vIDI0LjMuMyBKU09OW0BAdG9TdHJpbmdUYWddXHJcbiAgc2V0VG9TdHJpbmdUYWcoZ2xvYmFsLkpTT04sICdKU09OJywgdHJ1ZSk7XHJcbn0oc2FmZVN5bWJvbCgndGFnJyksIHt9LCB7fSwgdHJ1ZSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNi5vYmplY3Quc3RhdGljcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbigpe1xyXG4gIHZhciBvYmplY3RTdGF0aWMgPSB7XHJcbiAgICAvLyAxOS4xLjMuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlKVxyXG4gICAgYXNzaWduOiBhc3NpZ24sXHJcbiAgICAvLyAxOS4xLjMuMTAgT2JqZWN0LmlzKHZhbHVlMSwgdmFsdWUyKVxyXG4gICAgaXM6IGZ1bmN0aW9uKHgsIHkpe1xyXG4gICAgICByZXR1cm4geCA9PT0geSA/IHggIT09IDAgfHwgMSAvIHggPT09IDEgLyB5IDogeCAhPSB4ICYmIHkgIT0geTtcclxuICAgIH1cclxuICB9O1xyXG4gIC8vIDE5LjEuMy4xOSBPYmplY3Quc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pXHJcbiAgLy8gV29ya3Mgd2l0aCBfX3Byb3RvX18gb25seS4gT2xkIHY4IGNhbid0IHdvcmtzIHdpdGggbnVsbCBwcm90byBvYmplY3RzLlxyXG4gICdfX3Byb3RvX18nIGluIE9iamVjdFByb3RvICYmIGZ1bmN0aW9uKGJ1Z2d5LCBzZXQpe1xyXG4gICAgdHJ5IHtcclxuICAgICAgc2V0ID0gY3R4KGNhbGwsIGdldE93bkRlc2NyaXB0b3IoT2JqZWN0UHJvdG8sICdfX3Byb3RvX18nKS5zZXQsIDIpO1xyXG4gICAgICBzZXQoe30sIEFycmF5UHJvdG8pO1xyXG4gICAgfSBjYXRjaChlKXsgYnVnZ3kgPSB0cnVlIH1cclxuICAgIG9iamVjdFN0YXRpYy5zZXRQcm90b3R5cGVPZiA9IHNldFByb3RvdHlwZU9mID0gc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24oTywgcHJvdG8pe1xyXG4gICAgICBhc3NlcnRPYmplY3QoTyk7XHJcbiAgICAgIGFzc2VydChwcm90byA9PT0gbnVsbCB8fCBpc09iamVjdChwcm90byksIHByb3RvLCBcIjogY2FuJ3Qgc2V0IGFzIHByb3RvdHlwZSFcIik7XHJcbiAgICAgIGlmKGJ1Z2d5KU8uX19wcm90b19fID0gcHJvdG87XHJcbiAgICAgIGVsc2Ugc2V0KE8sIHByb3RvKTtcclxuICAgICAgcmV0dXJuIE87XHJcbiAgICB9XHJcbiAgfSgpO1xyXG4gICRkZWZpbmUoU1RBVElDLCBPQkpFQ1QsIG9iamVjdFN0YXRpYyk7XHJcbn0oKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogZXM2Lm9iamVjdC5zdGF0aWNzLWFjY2VwdC1wcmltaXRpdmVzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKCl7XHJcbiAgLy8gT2JqZWN0IHN0YXRpYyBtZXRob2RzIGFjY2VwdCBwcmltaXRpdmVzXHJcbiAgZnVuY3Rpb24gd3JhcE9iamVjdE1ldGhvZChrZXksIE1PREUpe1xyXG4gICAgdmFyIGZuICA9IE9iamVjdFtrZXldXHJcbiAgICAgICwgZXhwID0gY29yZVtPQkpFQ1RdW2tleV1cclxuICAgICAgLCBmICAgPSAwXHJcbiAgICAgICwgbyAgID0ge307XHJcbiAgICBpZighZXhwIHx8IGlzTmF0aXZlKGV4cCkpe1xyXG4gICAgICBvW2tleV0gPSBNT0RFID09IDEgPyBmdW5jdGlvbihpdCl7XHJcbiAgICAgICAgcmV0dXJuIGlzT2JqZWN0KGl0KSA/IGZuKGl0KSA6IGl0O1xyXG4gICAgICB9IDogTU9ERSA9PSAyID8gZnVuY3Rpb24oaXQpe1xyXG4gICAgICAgIHJldHVybiBpc09iamVjdChpdCkgPyBmbihpdCkgOiB0cnVlO1xyXG4gICAgICB9IDogTU9ERSA9PSAzID8gZnVuY3Rpb24oaXQpe1xyXG4gICAgICAgIHJldHVybiBpc09iamVjdChpdCkgPyBmbihpdCkgOiBmYWxzZTtcclxuICAgICAgfSA6IE1PREUgPT0gNCA/IGZ1bmN0aW9uKGl0LCBrZXkpe1xyXG4gICAgICAgIHJldHVybiBmbih0b09iamVjdChpdCksIGtleSk7XHJcbiAgICAgIH0gOiBmdW5jdGlvbihpdCl7XHJcbiAgICAgICAgcmV0dXJuIGZuKHRvT2JqZWN0KGl0KSk7XHJcbiAgICAgIH07XHJcbiAgICAgIHRyeSB7IGZuKERPVCkgfVxyXG4gICAgICBjYXRjaChlKXsgZiA9IDEgfVxyXG4gICAgICAkZGVmaW5lKFNUQVRJQyArIEZPUkNFRCAqIGYsIE9CSkVDVCwgbyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHdyYXBPYmplY3RNZXRob2QoJ2ZyZWV6ZScsIDEpO1xyXG4gIHdyYXBPYmplY3RNZXRob2QoJ3NlYWwnLCAxKTtcclxuICB3cmFwT2JqZWN0TWV0aG9kKCdwcmV2ZW50RXh0ZW5zaW9ucycsIDEpO1xyXG4gIHdyYXBPYmplY3RNZXRob2QoJ2lzRnJvemVuJywgMik7XHJcbiAgd3JhcE9iamVjdE1ldGhvZCgnaXNTZWFsZWQnLCAyKTtcclxuICB3cmFwT2JqZWN0TWV0aG9kKCdpc0V4dGVuc2libGUnLCAzKTtcclxuICB3cmFwT2JqZWN0TWV0aG9kKCdnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3InLCA0KTtcclxuICB3cmFwT2JqZWN0TWV0aG9kKCdnZXRQcm90b3R5cGVPZicpO1xyXG4gIHdyYXBPYmplY3RNZXRob2QoJ2tleXMnKTtcclxuICB3cmFwT2JqZWN0TWV0aG9kKCdnZXRPd25Qcm9wZXJ0eU5hbWVzJyk7XHJcbn0oKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogZXM2Lm51bWJlci5zdGF0aWNzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKGlzSW50ZWdlcil7XHJcbiAgJGRlZmluZShTVEFUSUMsIE5VTUJFUiwge1xyXG4gICAgLy8gMjAuMS4yLjEgTnVtYmVyLkVQU0lMT05cclxuICAgIEVQU0lMT046IHBvdygyLCAtNTIpLFxyXG4gICAgLy8gMjAuMS4yLjIgTnVtYmVyLmlzRmluaXRlKG51bWJlcilcclxuICAgIGlzRmluaXRlOiBmdW5jdGlvbihpdCl7XHJcbiAgICAgIHJldHVybiB0eXBlb2YgaXQgPT0gJ251bWJlcicgJiYgaXNGaW5pdGUoaXQpO1xyXG4gICAgfSxcclxuICAgIC8vIDIwLjEuMi4zIE51bWJlci5pc0ludGVnZXIobnVtYmVyKVxyXG4gICAgaXNJbnRlZ2VyOiBpc0ludGVnZXIsXHJcbiAgICAvLyAyMC4xLjIuNCBOdW1iZXIuaXNOYU4obnVtYmVyKVxyXG4gICAgaXNOYU46IHNhbWVOYU4sXHJcbiAgICAvLyAyMC4xLjIuNSBOdW1iZXIuaXNTYWZlSW50ZWdlcihudW1iZXIpXHJcbiAgICBpc1NhZmVJbnRlZ2VyOiBmdW5jdGlvbihudW1iZXIpe1xyXG4gICAgICByZXR1cm4gaXNJbnRlZ2VyKG51bWJlcikgJiYgYWJzKG51bWJlcikgPD0gTUFYX1NBRkVfSU5URUdFUjtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4xLjIuNiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxyXG4gICAgTUFYX1NBRkVfSU5URUdFUjogTUFYX1NBRkVfSU5URUdFUixcclxuICAgIC8vIDIwLjEuMi4xMCBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUlxyXG4gICAgTUlOX1NBRkVfSU5URUdFUjogLU1BWF9TQUZFX0lOVEVHRVIsXHJcbiAgICAvLyAyMC4xLjIuMTIgTnVtYmVyLnBhcnNlRmxvYXQoc3RyaW5nKVxyXG4gICAgcGFyc2VGbG9hdDogcGFyc2VGbG9hdCxcclxuICAgIC8vIDIwLjEuMi4xMyBOdW1iZXIucGFyc2VJbnQoc3RyaW5nLCByYWRpeClcclxuICAgIHBhcnNlSW50OiBwYXJzZUludFxyXG4gIH0pO1xyXG4vLyAyMC4xLjIuMyBOdW1iZXIuaXNJbnRlZ2VyKG51bWJlcilcclxufShOdW1iZXIuaXNJbnRlZ2VyIHx8IGZ1bmN0aW9uKGl0KXtcclxuICByZXR1cm4gIWlzT2JqZWN0KGl0KSAmJiBpc0Zpbml0ZShpdCkgJiYgZmxvb3IoaXQpID09PSBpdDtcclxufSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNi5tYXRoICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIEVDTUFTY3JpcHQgNiBzaGltXHJcbiFmdW5jdGlvbigpe1xyXG4gIC8vIDIwLjIuMi4yOCBNYXRoLnNpZ24oeClcclxuICB2YXIgRSAgICA9IE1hdGguRVxyXG4gICAgLCBleHAgID0gTWF0aC5leHBcclxuICAgICwgbG9nICA9IE1hdGgubG9nXHJcbiAgICAsIHNxcnQgPSBNYXRoLnNxcnRcclxuICAgICwgc2lnbiA9IE1hdGguc2lnbiB8fCBmdW5jdGlvbih4KXtcclxuICAgICAgICByZXR1cm4gKHggPSAreCkgPT0gMCB8fCB4ICE9IHggPyB4IDogeCA8IDAgPyAtMSA6IDE7XHJcbiAgICAgIH07XHJcbiAgXHJcbiAgLy8gMjAuMi4yLjUgTWF0aC5hc2luaCh4KVxyXG4gIGZ1bmN0aW9uIGFzaW5oKHgpe1xyXG4gICAgcmV0dXJuICFpc0Zpbml0ZSh4ID0gK3gpIHx8IHggPT0gMCA/IHggOiB4IDwgMCA/IC1hc2luaCgteCkgOiBsb2coeCArIHNxcnQoeCAqIHggKyAxKSk7XHJcbiAgfVxyXG4gIC8vIDIwLjIuMi4xNCBNYXRoLmV4cG0xKHgpXHJcbiAgZnVuY3Rpb24gZXhwbTEoeCl7XHJcbiAgICByZXR1cm4gKHggPSAreCkgPT0gMCA/IHggOiB4ID4gLTFlLTYgJiYgeCA8IDFlLTYgPyB4ICsgeCAqIHggLyAyIDogZXhwKHgpIC0gMTtcclxuICB9XHJcbiAgICBcclxuICAkZGVmaW5lKFNUQVRJQywgTUFUSCwge1xyXG4gICAgLy8gMjAuMi4yLjMgTWF0aC5hY29zaCh4KVxyXG4gICAgYWNvc2g6IGZ1bmN0aW9uKHgpe1xyXG4gICAgICByZXR1cm4gKHggPSAreCkgPCAxID8gTmFOIDogaXNGaW5pdGUoeCkgPyBsb2coeCAvIEUgKyBzcXJ0KHggKyAxKSAqIHNxcnQoeCAtIDEpIC8gRSkgKyAxIDogeDtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuNSBNYXRoLmFzaW5oKHgpXHJcbiAgICBhc2luaDogYXNpbmgsXHJcbiAgICAvLyAyMC4yLjIuNyBNYXRoLmF0YW5oKHgpXHJcbiAgICBhdGFuaDogZnVuY3Rpb24oeCl7XHJcbiAgICAgIHJldHVybiAoeCA9ICt4KSA9PSAwID8geCA6IGxvZygoMSArIHgpIC8gKDEgLSB4KSkgLyAyO1xyXG4gICAgfSxcclxuICAgIC8vIDIwLjIuMi45IE1hdGguY2JydCh4KVxyXG4gICAgY2JydDogZnVuY3Rpb24oeCl7XHJcbiAgICAgIHJldHVybiBzaWduKHggPSAreCkgKiBwb3coYWJzKHgpLCAxIC8gMyk7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjExIE1hdGguY2x6MzIoeClcclxuICAgIGNsejMyOiBmdW5jdGlvbih4KXtcclxuICAgICAgcmV0dXJuICh4ID4+Pj0gMCkgPyAzMiAtIHhbVE9fU1RSSU5HXSgyKS5sZW5ndGggOiAzMjtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuMTIgTWF0aC5jb3NoKHgpXHJcbiAgICBjb3NoOiBmdW5jdGlvbih4KXtcclxuICAgICAgcmV0dXJuIChleHAoeCA9ICt4KSArIGV4cCgteCkpIC8gMjtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuMTQgTWF0aC5leHBtMSh4KVxyXG4gICAgZXhwbTE6IGV4cG0xLFxyXG4gICAgLy8gMjAuMi4yLjE2IE1hdGguZnJvdW5kKHgpXHJcbiAgICAvLyBUT0RPOiBmYWxsYmFjayBmb3IgSUU5LVxyXG4gICAgZnJvdW5kOiBmdW5jdGlvbih4KXtcclxuICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3hdKVswXTtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuMTcgTWF0aC5oeXBvdChbdmFsdWUxWywgdmFsdWUyWywg4oCmIF1dXSlcclxuICAgIGh5cG90OiBmdW5jdGlvbih2YWx1ZTEsIHZhbHVlMil7XHJcbiAgICAgIHZhciBzdW0gID0gMFxyXG4gICAgICAgICwgbGVuMSA9IGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgICAsIGxlbjIgPSBsZW4xXHJcbiAgICAgICAgLCBhcmdzID0gQXJyYXkobGVuMSlcclxuICAgICAgICAsIGxhcmcgPSAtSW5maW5pdHlcclxuICAgICAgICAsIGFyZztcclxuICAgICAgd2hpbGUobGVuMS0tKXtcclxuICAgICAgICBhcmcgPSBhcmdzW2xlbjFdID0gK2FyZ3VtZW50c1tsZW4xXTtcclxuICAgICAgICBpZihhcmcgPT0gSW5maW5pdHkgfHwgYXJnID09IC1JbmZpbml0eSlyZXR1cm4gSW5maW5pdHk7XHJcbiAgICAgICAgaWYoYXJnID4gbGFyZylsYXJnID0gYXJnO1xyXG4gICAgICB9XHJcbiAgICAgIGxhcmcgPSBhcmcgfHwgMTtcclxuICAgICAgd2hpbGUobGVuMi0tKXN1bSArPSBwb3coYXJnc1tsZW4yXSAvIGxhcmcsIDIpO1xyXG4gICAgICByZXR1cm4gbGFyZyAqIHNxcnQoc3VtKTtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuMTggTWF0aC5pbXVsKHgsIHkpXHJcbiAgICBpbXVsOiBmdW5jdGlvbih4LCB5KXtcclxuICAgICAgdmFyIFVJbnQxNiA9IDB4ZmZmZlxyXG4gICAgICAgICwgeG4gPSAreFxyXG4gICAgICAgICwgeW4gPSAreVxyXG4gICAgICAgICwgeGwgPSBVSW50MTYgJiB4blxyXG4gICAgICAgICwgeWwgPSBVSW50MTYgJiB5bjtcclxuICAgICAgcmV0dXJuIDAgfCB4bCAqIHlsICsgKChVSW50MTYgJiB4biA+Pj4gMTYpICogeWwgKyB4bCAqIChVSW50MTYgJiB5biA+Pj4gMTYpIDw8IDE2ID4+PiAwKTtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuMjAgTWF0aC5sb2cxcCh4KVxyXG4gICAgbG9nMXA6IGZ1bmN0aW9uKHgpe1xyXG4gICAgICByZXR1cm4gKHggPSAreCkgPiAtMWUtOCAmJiB4IDwgMWUtOCA/IHggLSB4ICogeCAvIDIgOiBsb2coMSArIHgpO1xyXG4gICAgfSxcclxuICAgIC8vIDIwLjIuMi4yMSBNYXRoLmxvZzEwKHgpXHJcbiAgICBsb2cxMDogZnVuY3Rpb24oeCl7XHJcbiAgICAgIHJldHVybiBsb2coeCkgLyBNYXRoLkxOMTA7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjIyIE1hdGgubG9nMih4KVxyXG4gICAgbG9nMjogZnVuY3Rpb24oeCl7XHJcbiAgICAgIHJldHVybiBsb2coeCkgLyBNYXRoLkxOMjtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuMjggTWF0aC5zaWduKHgpXHJcbiAgICBzaWduOiBzaWduLFxyXG4gICAgLy8gMjAuMi4yLjMwIE1hdGguc2luaCh4KVxyXG4gICAgc2luaDogZnVuY3Rpb24oeCl7XHJcbiAgICAgIHJldHVybiAoYWJzKHggPSAreCkgPCAxKSA/IChleHBtMSh4KSAtIGV4cG0xKC14KSkgLyAyIDogKGV4cCh4IC0gMSkgLSBleHAoLXggLSAxKSkgKiAoRSAvIDIpO1xyXG4gICAgfSxcclxuICAgIC8vIDIwLjIuMi4zMyBNYXRoLnRhbmgoeClcclxuICAgIHRhbmg6IGZ1bmN0aW9uKHgpe1xyXG4gICAgICB2YXIgYSA9IGV4cG0xKHggPSAreClcclxuICAgICAgICAsIGIgPSBleHBtMSgteCk7XHJcbiAgICAgIHJldHVybiBhID09IEluZmluaXR5ID8gMSA6IGIgPT0gSW5maW5pdHkgPyAtMSA6IChhIC0gYikgLyAoZXhwKHgpICsgZXhwKC14KSk7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjM0IE1hdGgudHJ1bmMoeClcclxuICAgIHRydW5jOiB0cnVuY1xyXG4gIH0pO1xyXG59KCk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNi5zdHJpbmcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbihmcm9tQ2hhckNvZGUpe1xyXG4gIGZ1bmN0aW9uIGFzc2VydE5vdFJlZ0V4cChpdCl7XHJcbiAgICBpZihjb2YoaXQpID09IFJFR0VYUCl0aHJvdyBUeXBlRXJyb3IoKTtcclxuICB9XHJcbiAgXHJcbiAgJGRlZmluZShTVEFUSUMsIFNUUklORywge1xyXG4gICAgLy8gMjEuMS4yLjIgU3RyaW5nLmZyb21Db2RlUG9pbnQoLi4uY29kZVBvaW50cylcclxuICAgIGZyb21Db2RlUG9pbnQ6IGZ1bmN0aW9uKHgpe1xyXG4gICAgICB2YXIgcmVzID0gW11cclxuICAgICAgICAsIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgICAsIGkgICA9IDBcclxuICAgICAgICAsIGNvZGVcclxuICAgICAgd2hpbGUobGVuID4gaSl7XHJcbiAgICAgICAgY29kZSA9ICthcmd1bWVudHNbaSsrXTtcclxuICAgICAgICBpZih0b0luZGV4KGNvZGUsIDB4MTBmZmZmKSAhPT0gY29kZSl0aHJvdyBSYW5nZUVycm9yKGNvZGUgKyAnIGlzIG5vdCBhIHZhbGlkIGNvZGUgcG9pbnQnKTtcclxuICAgICAgICByZXMucHVzaChjb2RlIDwgMHgxMDAwMFxyXG4gICAgICAgICAgPyBmcm9tQ2hhckNvZGUoY29kZSlcclxuICAgICAgICAgIDogZnJvbUNoYXJDb2RlKCgoY29kZSAtPSAweDEwMDAwKSA+PiAxMCkgKyAweGQ4MDAsIGNvZGUgJSAweDQwMCArIDB4ZGMwMClcclxuICAgICAgICApO1xyXG4gICAgICB9IHJldHVybiByZXMuam9pbignJyk7XHJcbiAgICB9LFxyXG4gICAgLy8gMjEuMS4yLjQgU3RyaW5nLnJhdyhjYWxsU2l0ZSwgLi4uc3Vic3RpdHV0aW9ucylcclxuICAgIHJhdzogZnVuY3Rpb24oY2FsbFNpdGUpe1xyXG4gICAgICB2YXIgcmF3ID0gdG9PYmplY3QoY2FsbFNpdGUucmF3KVxyXG4gICAgICAgICwgbGVuID0gdG9MZW5ndGgocmF3Lmxlbmd0aClcclxuICAgICAgICAsIHNsbiA9IGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgICAsIHJlcyA9IFtdXHJcbiAgICAgICAgLCBpICAgPSAwO1xyXG4gICAgICB3aGlsZShsZW4gPiBpKXtcclxuICAgICAgICByZXMucHVzaChTdHJpbmcocmF3W2krK10pKTtcclxuICAgICAgICBpZihpIDwgc2xuKXJlcy5wdXNoKFN0cmluZyhhcmd1bWVudHNbaV0pKTtcclxuICAgICAgfSByZXR1cm4gcmVzLmpvaW4oJycpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIFxyXG4gICRkZWZpbmUoUFJPVE8sIFNUUklORywge1xyXG4gICAgLy8gMjEuMS4zLjMgU3RyaW5nLnByb3RvdHlwZS5jb2RlUG9pbnRBdChwb3MpXHJcbiAgICBjb2RlUG9pbnRBdDogY3JlYXRlUG9pbnRBdChmYWxzZSksXHJcbiAgICAvLyAyMS4xLjMuNiBTdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoKHNlYXJjaFN0cmluZyBbLCBlbmRQb3NpdGlvbl0pXHJcbiAgICBlbmRzV2l0aDogZnVuY3Rpb24oc2VhcmNoU3RyaW5nIC8qLCBlbmRQb3NpdGlvbiA9IEBsZW5ndGggKi8pe1xyXG4gICAgICBhc3NlcnROb3RSZWdFeHAoc2VhcmNoU3RyaW5nKTtcclxuICAgICAgdmFyIHRoYXQgPSBTdHJpbmcoYXNzZXJ0RGVmaW5lZCh0aGlzKSlcclxuICAgICAgICAsIGVuZFBvc2l0aW9uID0gYXJndW1lbnRzWzFdXHJcbiAgICAgICAgLCBsZW4gPSB0b0xlbmd0aCh0aGF0Lmxlbmd0aClcclxuICAgICAgICAsIGVuZCA9IGVuZFBvc2l0aW9uID09PSB1bmRlZmluZWQgPyBsZW4gOiBtaW4odG9MZW5ndGgoZW5kUG9zaXRpb24pLCBsZW4pO1xyXG4gICAgICBzZWFyY2hTdHJpbmcgKz0gJyc7XHJcbiAgICAgIHJldHVybiB0aGF0LnNsaWNlKGVuZCAtIHNlYXJjaFN0cmluZy5sZW5ndGgsIGVuZCkgPT09IHNlYXJjaFN0cmluZztcclxuICAgIH0sXHJcbiAgICAvLyAyMS4xLjMuNyBTdHJpbmcucHJvdG90eXBlLmluY2x1ZGVzKHNlYXJjaFN0cmluZywgcG9zaXRpb24gPSAwKVxyXG4gICAgaW5jbHVkZXM6IGZ1bmN0aW9uKHNlYXJjaFN0cmluZyAvKiwgcG9zaXRpb24gPSAwICovKXtcclxuICAgICAgYXNzZXJ0Tm90UmVnRXhwKHNlYXJjaFN0cmluZyk7XHJcbiAgICAgIHJldHVybiAhIX5TdHJpbmcoYXNzZXJ0RGVmaW5lZCh0aGlzKSkuaW5kZXhPZihzZWFyY2hTdHJpbmcsIGFyZ3VtZW50c1sxXSk7XHJcbiAgICB9LFxyXG4gICAgLy8gMjEuMS4zLjEzIFN0cmluZy5wcm90b3R5cGUucmVwZWF0KGNvdW50KVxyXG4gICAgcmVwZWF0OiBmdW5jdGlvbihjb3VudCl7XHJcbiAgICAgIHZhciBzdHIgPSBTdHJpbmcoYXNzZXJ0RGVmaW5lZCh0aGlzKSlcclxuICAgICAgICAsIHJlcyA9ICcnXHJcbiAgICAgICAgLCBuICAgPSB0b0ludGVnZXIoY291bnQpO1xyXG4gICAgICBpZigwID4gbiB8fCBuID09IEluZmluaXR5KXRocm93IFJhbmdlRXJyb3IoXCJDb3VudCBjYW4ndCBiZSBuZWdhdGl2ZVwiKTtcclxuICAgICAgZm9yKDtuID4gMDsgKG4gPj4+PSAxKSAmJiAoc3RyICs9IHN0cikpaWYobiAmIDEpcmVzICs9IHN0cjtcclxuICAgICAgcmV0dXJuIHJlcztcclxuICAgIH0sXHJcbiAgICAvLyAyMS4xLjMuMTggU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoKHNlYXJjaFN0cmluZyBbLCBwb3NpdGlvbiBdKVxyXG4gICAgc3RhcnRzV2l0aDogZnVuY3Rpb24oc2VhcmNoU3RyaW5nIC8qLCBwb3NpdGlvbiA9IDAgKi8pe1xyXG4gICAgICBhc3NlcnROb3RSZWdFeHAoc2VhcmNoU3RyaW5nKTtcclxuICAgICAgdmFyIHRoYXQgID0gU3RyaW5nKGFzc2VydERlZmluZWQodGhpcykpXHJcbiAgICAgICAgLCBpbmRleCA9IHRvTGVuZ3RoKG1pbihhcmd1bWVudHNbMV0sIHRoYXQubGVuZ3RoKSk7XHJcbiAgICAgIHNlYXJjaFN0cmluZyArPSAnJztcclxuICAgICAgcmV0dXJuIHRoYXQuc2xpY2UoaW5kZXgsIGluZGV4ICsgc2VhcmNoU3RyaW5nLmxlbmd0aCkgPT09IHNlYXJjaFN0cmluZztcclxuICAgIH1cclxuICB9KTtcclxufShTdHJpbmcuZnJvbUNoYXJDb2RlKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogZXM2LmFycmF5LnN0YXRpY3MgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKCl7XHJcbiAgJGRlZmluZShTVEFUSUMgKyBGT1JDRUQgKiBjaGVja0Rhbmdlckl0ZXJDbG9zaW5nKEFycmF5LmZyb20pLCBBUlJBWSwge1xyXG4gICAgLy8gMjIuMS4yLjEgQXJyYXkuZnJvbShhcnJheUxpa2UsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxyXG4gICAgZnJvbTogZnVuY3Rpb24oYXJyYXlMaWtlLyosIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKi8pe1xyXG4gICAgICB2YXIgTyAgICAgICA9IE9iamVjdChhc3NlcnREZWZpbmVkKGFycmF5TGlrZSkpXHJcbiAgICAgICAgLCBtYXBmbiAgID0gYXJndW1lbnRzWzFdXHJcbiAgICAgICAgLCBtYXBwaW5nID0gbWFwZm4gIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICwgZiAgICAgICA9IG1hcHBpbmcgPyBjdHgobWFwZm4sIGFyZ3VtZW50c1syXSwgMikgOiB1bmRlZmluZWRcclxuICAgICAgICAsIGluZGV4ICAgPSAwXHJcbiAgICAgICAgLCBsZW5ndGgsIHJlc3VsdCwgc3RlcDtcclxuICAgICAgaWYoaXNJdGVyYWJsZShPKSl7XHJcbiAgICAgICAgcmVzdWx0ID0gbmV3IChnZW5lcmljKHRoaXMsIEFycmF5KSk7XHJcbiAgICAgICAgc2FmZUl0ZXJDbG9zZShmdW5jdGlvbihpdGVyYXRvcil7XHJcbiAgICAgICAgICBmb3IoOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7IGluZGV4Kyspe1xyXG4gICAgICAgICAgICByZXN1bHRbaW5kZXhdID0gbWFwcGluZyA/IGYoc3RlcC52YWx1ZSwgaW5kZXgpIDogc3RlcC52YWx1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCBnZXRJdGVyYXRvcihPKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0ID0gbmV3IChnZW5lcmljKHRoaXMsIEFycmF5KSkobGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpKTtcclxuICAgICAgICBmb3IoOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKyl7XHJcbiAgICAgICAgICByZXN1bHRbaW5kZXhdID0gbWFwcGluZyA/IGYoT1tpbmRleF0sIGluZGV4KSA6IE9baW5kZXhdO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXN1bHQubGVuZ3RoID0gaW5kZXg7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgXHJcbiAgJGRlZmluZShTVEFUSUMsIEFSUkFZLCB7XHJcbiAgICAvLyAyMi4xLjIuMyBBcnJheS5vZiggLi4uaXRlbXMpXHJcbiAgICBvZjogZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XHJcbiAgICAgIHZhciBpbmRleCAgPSAwXHJcbiAgICAgICAgLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICAgLCByZXN1bHQgPSBuZXcgKGdlbmVyaWModGhpcywgQXJyYXkpKShsZW5ndGgpO1xyXG4gICAgICB3aGlsZShsZW5ndGggPiBpbmRleClyZXN1bHRbaW5kZXhdID0gYXJndW1lbnRzW2luZGV4KytdO1xyXG4gICAgICByZXN1bHQubGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIFxyXG4gIHNldFNwZWNpZXMoQXJyYXkpO1xyXG59KCk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNi5hcnJheS5wcm90b3R5cGUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbigpe1xyXG4gICRkZWZpbmUoUFJPVE8sIEFSUkFZLCB7XHJcbiAgICAvLyAyMi4xLjMuMyBBcnJheS5wcm90b3R5cGUuY29weVdpdGhpbih0YXJnZXQsIHN0YXJ0LCBlbmQgPSB0aGlzLmxlbmd0aClcclxuICAgIGNvcHlXaXRoaW46IGZ1bmN0aW9uKHRhcmdldCAvKiA9IDAgKi8sIHN0YXJ0IC8qID0gMCwgZW5kID0gQGxlbmd0aCAqLyl7XHJcbiAgICAgIHZhciBPICAgICA9IE9iamVjdChhc3NlcnREZWZpbmVkKHRoaXMpKVxyXG4gICAgICAgICwgbGVuICAgPSB0b0xlbmd0aChPLmxlbmd0aClcclxuICAgICAgICAsIHRvICAgID0gdG9JbmRleCh0YXJnZXQsIGxlbilcclxuICAgICAgICAsIGZyb20gID0gdG9JbmRleChzdGFydCwgbGVuKVxyXG4gICAgICAgICwgZW5kICAgPSBhcmd1bWVudHNbMl1cclxuICAgICAgICAsIGZpbiAgID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB0b0luZGV4KGVuZCwgbGVuKVxyXG4gICAgICAgICwgY291bnQgPSBtaW4oZmluIC0gZnJvbSwgbGVuIC0gdG8pXHJcbiAgICAgICAgLCBpbmMgICA9IDE7XHJcbiAgICAgIGlmKGZyb20gPCB0byAmJiB0byA8IGZyb20gKyBjb3VudCl7XHJcbiAgICAgICAgaW5jICA9IC0xO1xyXG4gICAgICAgIGZyb20gPSBmcm9tICsgY291bnQgLSAxO1xyXG4gICAgICAgIHRvICAgPSB0byArIGNvdW50IC0gMTtcclxuICAgICAgfVxyXG4gICAgICB3aGlsZShjb3VudC0tID4gMCl7XHJcbiAgICAgICAgaWYoZnJvbSBpbiBPKU9bdG9dID0gT1tmcm9tXTtcclxuICAgICAgICBlbHNlIGRlbGV0ZSBPW3RvXTtcclxuICAgICAgICB0byArPSBpbmM7XHJcbiAgICAgICAgZnJvbSArPSBpbmM7XHJcbiAgICAgIH0gcmV0dXJuIE87XHJcbiAgICB9LFxyXG4gICAgLy8gMjIuMS4zLjYgQXJyYXkucHJvdG90eXBlLmZpbGwodmFsdWUsIHN0YXJ0ID0gMCwgZW5kID0gdGhpcy5sZW5ndGgpXHJcbiAgICBmaWxsOiBmdW5jdGlvbih2YWx1ZSAvKiwgc3RhcnQgPSAwLCBlbmQgPSBAbGVuZ3RoICovKXtcclxuICAgICAgdmFyIE8gICAgICA9IE9iamVjdChhc3NlcnREZWZpbmVkKHRoaXMpKVxyXG4gICAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpXHJcbiAgICAgICAgLCBpbmRleCAgPSB0b0luZGV4KGFyZ3VtZW50c1sxXSwgbGVuZ3RoKVxyXG4gICAgICAgICwgZW5kICAgID0gYXJndW1lbnRzWzJdXHJcbiAgICAgICAgLCBlbmRQb3MgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IHRvSW5kZXgoZW5kLCBsZW5ndGgpO1xyXG4gICAgICB3aGlsZShlbmRQb3MgPiBpbmRleClPW2luZGV4KytdID0gdmFsdWU7XHJcbiAgICAgIHJldHVybiBPO1xyXG4gICAgfSxcclxuICAgIC8vIDIyLjEuMy44IEFycmF5LnByb3RvdHlwZS5maW5kKHByZWRpY2F0ZSwgdGhpc0FyZyA9IHVuZGVmaW5lZClcclxuICAgIGZpbmQ6IGNyZWF0ZUFycmF5TWV0aG9kKDUpLFxyXG4gICAgLy8gMjIuMS4zLjkgQXJyYXkucHJvdG90eXBlLmZpbmRJbmRleChwcmVkaWNhdGUsIHRoaXNBcmcgPSB1bmRlZmluZWQpXHJcbiAgICBmaW5kSW5kZXg6IGNyZWF0ZUFycmF5TWV0aG9kKDYpXHJcbiAgfSk7XHJcbiAgXHJcbiAgaWYoZnJhbWV3b3JrKXtcclxuICAgIC8vIDIyLjEuMy4zMSBBcnJheS5wcm90b3R5cGVbQEB1bnNjb3BhYmxlc11cclxuICAgIGZvckVhY2guY2FsbChhcnJheSgnZmluZCxmaW5kSW5kZXgsZmlsbCxjb3B5V2l0aGluLGVudHJpZXMsa2V5cyx2YWx1ZXMnKSwgZnVuY3Rpb24oaXQpe1xyXG4gICAgICBBcnJheVVuc2NvcGFibGVzW2l0XSA9IHRydWU7XHJcbiAgICB9KTtcclxuICAgIFNZTUJPTF9VTlNDT1BBQkxFUyBpbiBBcnJheVByb3RvIHx8IGhpZGRlbihBcnJheVByb3RvLCBTWU1CT0xfVU5TQ09QQUJMRVMsIEFycmF5VW5zY29wYWJsZXMpO1xyXG4gIH1cclxufSgpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczYuaXRlcmF0b3JzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oYXQpe1xyXG4gIC8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcclxuICAvLyAyMi4xLjMuMTMgQXJyYXkucHJvdG90eXBlLmtleXMoKVxyXG4gIC8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcclxuICAvLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcclxuICBkZWZpbmVTdGRJdGVyYXRvcnMoQXJyYXksIEFSUkFZLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XHJcbiAgICBzZXQodGhpcywgSVRFUiwge286IHRvT2JqZWN0KGl0ZXJhdGVkKSwgaTogMCwgazoga2luZH0pO1xyXG4gIC8vIDIyLjEuNS4yLjEgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxyXG4gIH0sIGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgaXRlciAgPSB0aGlzW0lURVJdXHJcbiAgICAgICwgTyAgICAgPSBpdGVyLm9cclxuICAgICAgLCBraW5kICA9IGl0ZXIua1xyXG4gICAgICAsIGluZGV4ID0gaXRlci5pKys7XHJcbiAgICBpZighTyB8fCBpbmRleCA+PSBPLmxlbmd0aCl7XHJcbiAgICAgIGl0ZXIubyA9IHVuZGVmaW5lZDtcclxuICAgICAgcmV0dXJuIGl0ZXJSZXN1bHQoMSk7XHJcbiAgICB9XHJcbiAgICBpZihraW5kID09IEtFWSkgIHJldHVybiBpdGVyUmVzdWx0KDAsIGluZGV4KTtcclxuICAgIGlmKGtpbmQgPT0gVkFMVUUpcmV0dXJuIGl0ZXJSZXN1bHQoMCwgT1tpbmRleF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlclJlc3VsdCgwLCBbaW5kZXgsIE9baW5kZXhdXSk7XHJcbiAgfSwgVkFMVUUpO1xyXG4gIFxyXG4gIC8vIGFyZ3VtZW50c0xpc3RbQEBpdGVyYXRvcl0gaXMgJUFycmF5UHJvdG9fdmFsdWVzJSAoOS40LjQuNiwgOS40LjQuNylcclxuICBJdGVyYXRvcnNbQVJHVU1FTlRTXSA9IEl0ZXJhdG9yc1tBUlJBWV07XHJcbiAgXHJcbiAgLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxyXG4gIGRlZmluZVN0ZEl0ZXJhdG9ycyhTdHJpbmcsIFNUUklORywgZnVuY3Rpb24oaXRlcmF0ZWQpe1xyXG4gICAgc2V0KHRoaXMsIElURVIsIHtvOiBTdHJpbmcoaXRlcmF0ZWQpLCBpOiAwfSk7XHJcbiAgLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxyXG4gIH0sIGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgaXRlciAgPSB0aGlzW0lURVJdXHJcbiAgICAgICwgTyAgICAgPSBpdGVyLm9cclxuICAgICAgLCBpbmRleCA9IGl0ZXIuaVxyXG4gICAgICAsIHBvaW50O1xyXG4gICAgaWYoaW5kZXggPj0gTy5sZW5ndGgpcmV0dXJuIGl0ZXJSZXN1bHQoMSk7XHJcbiAgICBwb2ludCA9IGF0LmNhbGwoTywgaW5kZXgpO1xyXG4gICAgaXRlci5pICs9IHBvaW50Lmxlbmd0aDtcclxuICAgIHJldHVybiBpdGVyUmVzdWx0KDAsIHBvaW50KTtcclxuICB9KTtcclxufShjcmVhdGVQb2ludEF0KHRydWUpKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogd2ViLmltbWVkaWF0ZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gc2V0SW1tZWRpYXRlIHNoaW1cclxuLy8gTm9kZS5qcyAwLjkrICYgSUUxMCsgaGFzIHNldEltbWVkaWF0ZSwgZWxzZTpcclxuaXNGdW5jdGlvbihzZXRJbW1lZGlhdGUpICYmIGlzRnVuY3Rpb24oY2xlYXJJbW1lZGlhdGUpIHx8IGZ1bmN0aW9uKE9OUkVBRFlTVEFURUNIQU5HRSl7XHJcbiAgdmFyIHBvc3RNZXNzYWdlICAgICAgPSBnbG9iYWwucG9zdE1lc3NhZ2VcclxuICAgICwgYWRkRXZlbnRMaXN0ZW5lciA9IGdsb2JhbC5hZGRFdmVudExpc3RlbmVyXHJcbiAgICAsIE1lc3NhZ2VDaGFubmVsICAgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWxcclxuICAgICwgY291bnRlciAgICAgICAgICA9IDBcclxuICAgICwgcXVldWUgICAgICAgICAgICA9IHt9XHJcbiAgICAsIGRlZmVyLCBjaGFubmVsLCBwb3J0O1xyXG4gIHNldEltbWVkaWF0ZSA9IGZ1bmN0aW9uKGZuKXtcclxuICAgIHZhciBhcmdzID0gW10sIGkgPSAxO1xyXG4gICAgd2hpbGUoYXJndW1lbnRzLmxlbmd0aCA+IGkpYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcclxuICAgIHF1ZXVlWysrY291bnRlcl0gPSBmdW5jdGlvbigpe1xyXG4gICAgICBpbnZva2UoaXNGdW5jdGlvbihmbikgPyBmbiA6IEZ1bmN0aW9uKGZuKSwgYXJncyk7XHJcbiAgICB9XHJcbiAgICBkZWZlcihjb3VudGVyKTtcclxuICAgIHJldHVybiBjb3VudGVyO1xyXG4gIH1cclxuICBjbGVhckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGlkKXtcclxuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIHJ1bihpZCl7XHJcbiAgICBpZihoYXMocXVldWUsIGlkKSl7XHJcbiAgICAgIHZhciBmbiA9IHF1ZXVlW2lkXTtcclxuICAgICAgZGVsZXRlIHF1ZXVlW2lkXTtcclxuICAgICAgZm4oKTtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gbGlzdG5lcihldmVudCl7XHJcbiAgICBydW4oZXZlbnQuZGF0YSk7XHJcbiAgfVxyXG4gIC8vIE5vZGUuanMgMC44LVxyXG4gIGlmKE5PREUpe1xyXG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XHJcbiAgICAgIG5leHRUaWNrKHBhcnQuY2FsbChydW4sIGlkKSk7XHJcbiAgICB9XHJcbiAgLy8gTW9kZXJuIGJyb3dzZXJzLCBza2lwIGltcGxlbWVudGF0aW9uIGZvciBXZWJXb3JrZXJzXHJcbiAgLy8gSUU4IGhhcyBwb3N0TWVzc2FnZSwgYnV0IGl0J3Mgc3luYyAmIHR5cGVvZiBpdHMgcG9zdE1lc3NhZ2UgaXMgb2JqZWN0XHJcbiAgfSBlbHNlIGlmKGFkZEV2ZW50TGlzdGVuZXIgJiYgaXNGdW5jdGlvbihwb3N0TWVzc2FnZSkgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKXtcclxuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xyXG4gICAgICBwb3N0TWVzc2FnZShpZCwgJyonKTtcclxuICAgIH1cclxuICAgIGFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBsaXN0bmVyLCBmYWxzZSk7XHJcbiAgLy8gV2ViV29ya2Vyc1xyXG4gIH0gZWxzZSBpZihpc0Z1bmN0aW9uKE1lc3NhZ2VDaGFubmVsKSl7XHJcbiAgICBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsO1xyXG4gICAgcG9ydCAgICA9IGNoYW5uZWwucG9ydDI7XHJcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpc3RuZXI7XHJcbiAgICBkZWZlciA9IGN0eChwb3J0LnBvc3RNZXNzYWdlLCBwb3J0LCAxKTtcclxuICAvLyBJRTgtXHJcbiAgfSBlbHNlIGlmKGRvY3VtZW50ICYmIE9OUkVBRFlTVEFURUNIQU5HRSBpbiBkb2N1bWVudFtDUkVBVEVfRUxFTUVOVF0oJ3NjcmlwdCcpKXtcclxuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xyXG4gICAgICBodG1sLmFwcGVuZENoaWxkKGRvY3VtZW50W0NSRUFURV9FTEVNRU5UXSgnc2NyaXB0JykpW09OUkVBRFlTVEFURUNIQU5HRV0gPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XHJcbiAgICAgICAgcnVuKGlkKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIC8vIFJlc3Qgb2xkIGJyb3dzZXJzXHJcbiAgfSBlbHNlIHtcclxuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xyXG4gICAgICBzZXRUaW1lb3V0KHJ1biwgMCwgaWQpO1xyXG4gICAgfVxyXG4gIH1cclxufSgnb25yZWFkeXN0YXRlY2hhbmdlJyk7XHJcbiRkZWZpbmUoR0xPQkFMICsgQklORCwge1xyXG4gIHNldEltbWVkaWF0ZTogICBzZXRJbW1lZGlhdGUsXHJcbiAgY2xlYXJJbW1lZGlhdGU6IGNsZWFySW1tZWRpYXRlXHJcbn0pO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczYucHJvbWlzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBFUzYgcHJvbWlzZXMgc2hpbVxyXG4vLyBCYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vZ2V0aWZ5L25hdGl2ZS1wcm9taXNlLW9ubHkvXHJcbiFmdW5jdGlvbihQcm9taXNlLCB0ZXN0KXtcclxuICBpc0Z1bmN0aW9uKFByb21pc2UpICYmIGlzRnVuY3Rpb24oUHJvbWlzZS5yZXNvbHZlKVxyXG4gICYmIFByb21pc2UucmVzb2x2ZSh0ZXN0ID0gbmV3IFByb21pc2UoZnVuY3Rpb24oKXt9KSkgPT0gdGVzdFxyXG4gIHx8IGZ1bmN0aW9uKGFzYXAsIFJFQ09SRCl7XHJcbiAgICBmdW5jdGlvbiBpc1RoZW5hYmxlKGl0KXtcclxuICAgICAgdmFyIHRoZW47XHJcbiAgICAgIGlmKGlzT2JqZWN0KGl0KSl0aGVuID0gaXQudGhlbjtcclxuICAgICAgcmV0dXJuIGlzRnVuY3Rpb24odGhlbikgPyB0aGVuIDogZmFsc2U7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBoYW5kbGVkUmVqZWN0aW9uT3JIYXNPblJlamVjdGVkKHByb21pc2Upe1xyXG4gICAgICB2YXIgcmVjb3JkID0gcHJvbWlzZVtSRUNPUkRdXHJcbiAgICAgICAgLCBjaGFpbiAgPSByZWNvcmQuY1xyXG4gICAgICAgICwgaSAgICAgID0gMFxyXG4gICAgICAgICwgcmVhY3Q7XHJcbiAgICAgIGlmKHJlY29yZC5oKXJldHVybiB0cnVlO1xyXG4gICAgICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXtcclxuICAgICAgICByZWFjdCA9IGNoYWluW2krK107XHJcbiAgICAgICAgaWYocmVhY3QuZmFpbCB8fCBoYW5kbGVkUmVqZWN0aW9uT3JIYXNPblJlamVjdGVkKHJlYWN0LlApKXJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBub3RpZnkocmVjb3JkLCByZWplY3Qpe1xyXG4gICAgICB2YXIgY2hhaW4gPSByZWNvcmQuYztcclxuICAgICAgaWYocmVqZWN0IHx8IGNoYWluLmxlbmd0aClhc2FwKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHByb21pc2UgPSByZWNvcmQucFxyXG4gICAgICAgICAgLCB2YWx1ZSAgID0gcmVjb3JkLnZcclxuICAgICAgICAgICwgb2sgICAgICA9IHJlY29yZC5zID09IDFcclxuICAgICAgICAgICwgaSAgICAgICA9IDA7XHJcbiAgICAgICAgaWYocmVqZWN0ICYmICFoYW5kbGVkUmVqZWN0aW9uT3JIYXNPblJlamVjdGVkKHByb21pc2UpKXtcclxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgaWYoIWhhbmRsZWRSZWplY3Rpb25Pckhhc09uUmVqZWN0ZWQocHJvbWlzZSkpe1xyXG4gICAgICAgICAgICAgIGlmKE5PREUpe1xyXG4gICAgICAgICAgICAgICAgaWYoIXByb2Nlc3MuZW1pdCgndW5oYW5kbGVkUmVqZWN0aW9uJywgdmFsdWUsIHByb21pc2UpKXtcclxuICAgICAgICAgICAgICAgICAgLy8gZGVmYXVsdCBub2RlLmpzIGJlaGF2aW9yXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmKGlzRnVuY3Rpb24oY29uc29sZS5lcnJvcikpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uJywgdmFsdWUpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSwgMWUzKTtcclxuICAgICAgICB9IGVsc2Ugd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSkhZnVuY3Rpb24ocmVhY3Qpe1xyXG4gICAgICAgICAgdmFyIGNiID0gb2sgPyByZWFjdC5vayA6IHJlYWN0LmZhaWxcclxuICAgICAgICAgICAgLCByZXQsIHRoZW47XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZihjYil7XHJcbiAgICAgICAgICAgICAgaWYoIW9rKXJlY29yZC5oID0gdHJ1ZTtcclxuICAgICAgICAgICAgICByZXQgPSBjYiA9PT0gdHJ1ZSA/IHZhbHVlIDogY2IodmFsdWUpO1xyXG4gICAgICAgICAgICAgIGlmKHJldCA9PT0gcmVhY3QuUCl7XHJcbiAgICAgICAgICAgICAgICByZWFjdC5yZWooVHlwZUVycm9yKFBST01JU0UgKyAnLWNoYWluIGN5Y2xlJykpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZih0aGVuID0gaXNUaGVuYWJsZShyZXQpKXtcclxuICAgICAgICAgICAgICAgIHRoZW4uY2FsbChyZXQsIHJlYWN0LnJlcywgcmVhY3QucmVqKTtcclxuICAgICAgICAgICAgICB9IGVsc2UgcmVhY3QucmVzKHJldCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSByZWFjdC5yZWoodmFsdWUpO1xyXG4gICAgICAgICAgfSBjYXRjaChlcnIpe1xyXG4gICAgICAgICAgICByZWFjdC5yZWooZXJyKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KGNoYWluW2krK10pO1xyXG4gICAgICAgIGNoYWluLmxlbmd0aCA9IDA7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcmVzb2x2ZSh2YWx1ZSl7XHJcbiAgICAgIHZhciByZWNvcmQgPSB0aGlzXHJcbiAgICAgICAgLCB0aGVuLCB3cmFwcGVyO1xyXG4gICAgICBpZihyZWNvcmQuZClyZXR1cm47XHJcbiAgICAgIHJlY29yZC5kID0gdHJ1ZTtcclxuICAgICAgcmVjb3JkID0gcmVjb3JkLnIgfHwgcmVjb3JkOyAvLyB1bndyYXBcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpZih0aGVuID0gaXNUaGVuYWJsZSh2YWx1ZSkpe1xyXG4gICAgICAgICAgd3JhcHBlciA9IHtyOiByZWNvcmQsIGQ6IGZhbHNlfTsgLy8gd3JhcFxyXG4gICAgICAgICAgdGhlbi5jYWxsKHZhbHVlLCBjdHgocmVzb2x2ZSwgd3JhcHBlciwgMSksIGN0eChyZWplY3QsIHdyYXBwZXIsIDEpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVjb3JkLnYgPSB2YWx1ZTtcclxuICAgICAgICAgIHJlY29yZC5zID0gMTtcclxuICAgICAgICAgIG5vdGlmeShyZWNvcmQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaChlcnIpe1xyXG4gICAgICAgIHJlamVjdC5jYWxsKHdyYXBwZXIgfHwge3I6IHJlY29yZCwgZDogZmFsc2V9LCBlcnIpOyAvLyB3cmFwXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSl7XHJcbiAgICAgIHZhciByZWNvcmQgPSB0aGlzO1xyXG4gICAgICBpZihyZWNvcmQuZClyZXR1cm47XHJcbiAgICAgIHJlY29yZC5kID0gdHJ1ZTtcclxuICAgICAgcmVjb3JkID0gcmVjb3JkLnIgfHwgcmVjb3JkOyAvLyB1bndyYXBcclxuICAgICAgcmVjb3JkLnYgPSB2YWx1ZTtcclxuICAgICAgcmVjb3JkLnMgPSAyO1xyXG4gICAgICBub3RpZnkocmVjb3JkLCB0cnVlKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGdldENvbnN0cnVjdG9yKEMpe1xyXG4gICAgICB2YXIgUyA9IGFzc2VydE9iamVjdChDKVtTWU1CT0xfU1BFQ0lFU107XHJcbiAgICAgIHJldHVybiBTICE9IHVuZGVmaW5lZCA/IFMgOiBDO1xyXG4gICAgfVxyXG4gICAgLy8gMjUuNC4zLjEgUHJvbWlzZShleGVjdXRvcilcclxuICAgIFByb21pc2UgPSBmdW5jdGlvbihleGVjdXRvcil7XHJcbiAgICAgIGFzc2VydEZ1bmN0aW9uKGV4ZWN1dG9yKTtcclxuICAgICAgYXNzZXJ0SW5zdGFuY2UodGhpcywgUHJvbWlzZSwgUFJPTUlTRSk7XHJcbiAgICAgIHZhciByZWNvcmQgPSB7XHJcbiAgICAgICAgcDogdGhpcywgICAgICAvLyBwcm9taXNlXHJcbiAgICAgICAgYzogW10sICAgICAgICAvLyBjaGFpblxyXG4gICAgICAgIHM6IDAsICAgICAgICAgLy8gc3RhdGVcclxuICAgICAgICBkOiBmYWxzZSwgICAgIC8vIGRvbmVcclxuICAgICAgICB2OiB1bmRlZmluZWQsIC8vIHZhbHVlXHJcbiAgICAgICAgaDogZmFsc2UgICAgICAvLyBoYW5kbGVkIHJlamVjdGlvblxyXG4gICAgICB9O1xyXG4gICAgICBoaWRkZW4odGhpcywgUkVDT1JELCByZWNvcmQpO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGV4ZWN1dG9yKGN0eChyZXNvbHZlLCByZWNvcmQsIDEpLCBjdHgocmVqZWN0LCByZWNvcmQsIDEpKTtcclxuICAgICAgfSBjYXRjaChlcnIpe1xyXG4gICAgICAgIHJlamVjdC5jYWxsKHJlY29yZCwgZXJyKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgYXNzaWduSGlkZGVuKFByb21pc2VbUFJPVE9UWVBFXSwge1xyXG4gICAgICAvLyAyNS40LjUuMyBQcm9taXNlLnByb3RvdHlwZS50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKVxyXG4gICAgICB0aGVuOiBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCl7XHJcbiAgICAgICAgdmFyIFMgPSBhc3NlcnRPYmplY3QoYXNzZXJ0T2JqZWN0KHRoaXMpW0NPTlNUUlVDVE9SXSlbU1lNQk9MX1NQRUNJRVNdO1xyXG4gICAgICAgIHZhciByZWFjdCA9IHtcclxuICAgICAgICAgIG9rOiAgIGlzRnVuY3Rpb24ob25GdWxmaWxsZWQpID8gb25GdWxmaWxsZWQgOiB0cnVlLFxyXG4gICAgICAgICAgZmFpbDogaXNGdW5jdGlvbihvblJlamVjdGVkKSAgPyBvblJlamVjdGVkICA6IGZhbHNlXHJcbiAgICAgICAgfSAsIFAgPSByZWFjdC5QID0gbmV3IChTICE9IHVuZGVmaW5lZCA/IFMgOiBQcm9taXNlKShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xyXG4gICAgICAgICAgcmVhY3QucmVzID0gYXNzZXJ0RnVuY3Rpb24ocmVzb2x2ZSk7XHJcbiAgICAgICAgICByZWFjdC5yZWogPSBhc3NlcnRGdW5jdGlvbihyZWplY3QpO1xyXG4gICAgICAgIH0pLCByZWNvcmQgPSB0aGlzW1JFQ09SRF07XHJcbiAgICAgICAgcmVjb3JkLmMucHVzaChyZWFjdCk7XHJcbiAgICAgICAgcmVjb3JkLnMgJiYgbm90aWZ5KHJlY29yZCk7XHJcbiAgICAgICAgcmV0dXJuIFA7XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIDI1LjQuNS4xIFByb21pc2UucHJvdG90eXBlLmNhdGNoKG9uUmVqZWN0ZWQpXHJcbiAgICAgICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGVkKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBhc3NpZ25IaWRkZW4oUHJvbWlzZSwge1xyXG4gICAgICAvLyAyNS40LjQuMSBQcm9taXNlLmFsbChpdGVyYWJsZSlcclxuICAgICAgYWxsOiBmdW5jdGlvbihpdGVyYWJsZSl7XHJcbiAgICAgICAgdmFyIFByb21pc2UgPSBnZXRDb25zdHJ1Y3Rvcih0aGlzKVxyXG4gICAgICAgICAgLCB2YWx1ZXMgID0gW107XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcbiAgICAgICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIHB1c2gsIHZhbHVlcyk7XHJcbiAgICAgICAgICB2YXIgcmVtYWluaW5nID0gdmFsdWVzLmxlbmd0aFxyXG4gICAgICAgICAgICAsIHJlc3VsdHMgICA9IEFycmF5KHJlbWFpbmluZyk7XHJcbiAgICAgICAgICBpZihyZW1haW5pbmcpZm9yRWFjaC5jYWxsKHZhbHVlcywgZnVuY3Rpb24ocHJvbWlzZSwgaW5kZXgpe1xyXG4gICAgICAgICAgICBQcm9taXNlLnJlc29sdmUocHJvbWlzZSkudGhlbihmdW5jdGlvbih2YWx1ZSl7XHJcbiAgICAgICAgICAgICAgcmVzdWx0c1tpbmRleF0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHJlc3VsdHMpO1xyXG4gICAgICAgICAgICB9LCByZWplY3QpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBlbHNlIHJlc29sdmUocmVzdWx0cyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIDI1LjQuNC40IFByb21pc2UucmFjZShpdGVyYWJsZSlcclxuICAgICAgcmFjZTogZnVuY3Rpb24oaXRlcmFibGUpe1xyXG4gICAgICAgIHZhciBQcm9taXNlID0gZ2V0Q29uc3RydWN0b3IodGhpcyk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcbiAgICAgICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uKHByb21pc2Upe1xyXG4gICAgICAgICAgICBQcm9taXNlLnJlc29sdmUocHJvbWlzZSkudGhlbihyZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIDI1LjQuNC41IFByb21pc2UucmVqZWN0KHIpXHJcbiAgICAgIHJlamVjdDogZnVuY3Rpb24ocil7XHJcbiAgICAgICAgcmV0dXJuIG5ldyAoZ2V0Q29uc3RydWN0b3IodGhpcykpKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcbiAgICAgICAgICByZWplY3Qocik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIDI1LjQuNC42IFByb21pc2UucmVzb2x2ZSh4KVxyXG4gICAgICByZXNvbHZlOiBmdW5jdGlvbih4KXtcclxuICAgICAgICByZXR1cm4gaXNPYmplY3QoeCkgJiYgUkVDT1JEIGluIHggJiYgZ2V0UHJvdG90eXBlT2YoeCkgPT09IHRoaXNbUFJPVE9UWVBFXVxyXG4gICAgICAgICAgPyB4IDogbmV3IChnZXRDb25zdHJ1Y3Rvcih0aGlzKSkoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcclxuICAgICAgICAgICAgcmVzb2x2ZSh4KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KG5leHRUaWNrIHx8IHNldEltbWVkaWF0ZSwgc2FmZVN5bWJvbCgncmVjb3JkJykpO1xyXG4gIHNldFRvU3RyaW5nVGFnKFByb21pc2UsIFBST01JU0UpO1xyXG4gIHNldFNwZWNpZXMoUHJvbWlzZSk7XHJcbiAgJGRlZmluZShHTE9CQUwgKyBGT1JDRUQgKiAhaXNOYXRpdmUoUHJvbWlzZSksIHtQcm9taXNlOiBQcm9taXNlfSk7XHJcbn0oZ2xvYmFsW1BST01JU0VdKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogZXM2LmNvbGxlY3Rpb25zICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gRUNNQVNjcmlwdCA2IGNvbGxlY3Rpb25zIHNoaW1cclxuIWZ1bmN0aW9uKCl7XHJcbiAgdmFyIFVJRCAgID0gc2FmZVN5bWJvbCgndWlkJylcclxuICAgICwgTzEgICAgPSBzYWZlU3ltYm9sKCdPMScpXHJcbiAgICAsIFdFQUsgID0gc2FmZVN5bWJvbCgnd2VhaycpXHJcbiAgICAsIExFQUsgID0gc2FmZVN5bWJvbCgnbGVhaycpXHJcbiAgICAsIExBU1QgID0gc2FmZVN5bWJvbCgnbGFzdCcpXHJcbiAgICAsIEZJUlNUID0gc2FmZVN5bWJvbCgnZmlyc3QnKVxyXG4gICAgLCBTSVpFICA9IERFU0MgPyBzYWZlU3ltYm9sKCdzaXplJykgOiAnc2l6ZSdcclxuICAgICwgdWlkICAgPSAwXHJcbiAgICAsIHRtcCAgID0ge307XHJcbiAgXHJcbiAgZnVuY3Rpb24gZ2V0Q29sbGVjdGlvbihDLCBOQU1FLCBtZXRob2RzLCBjb21tb25NZXRob2RzLCBpc01hcCwgaXNXZWFrKXtcclxuICAgIHZhciBBRERFUiA9IGlzTWFwID8gJ3NldCcgOiAnYWRkJ1xyXG4gICAgICAsIHByb3RvID0gQyAmJiBDW1BST1RPVFlQRV1cclxuICAgICAgLCBPICAgICA9IHt9O1xyXG4gICAgZnVuY3Rpb24gaW5pdEZyb21JdGVyYWJsZSh0aGF0LCBpdGVyYWJsZSl7XHJcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgaXNNYXAsIHRoYXRbQURERVJdLCB0aGF0KTtcclxuICAgICAgcmV0dXJuIHRoYXQ7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBmaXhTVlooa2V5LCBjaGFpbil7XHJcbiAgICAgIHZhciBtZXRob2QgPSBwcm90b1trZXldO1xyXG4gICAgICBpZihmcmFtZXdvcmspcHJvdG9ba2V5XSA9IGZ1bmN0aW9uKGEsIGIpe1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBtZXRob2QuY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEsIGIpO1xyXG4gICAgICAgIHJldHVybiBjaGFpbiA/IHRoaXMgOiByZXN1bHQ7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICBpZighaXNOYXRpdmUoQykgfHwgIShpc1dlYWsgfHwgKCFCVUdHWV9JVEVSQVRPUlMgJiYgaGFzKHByb3RvLCBGT1JfRUFDSCkgJiYgaGFzKHByb3RvLCAnZW50cmllcycpKSkpe1xyXG4gICAgICAvLyBjcmVhdGUgY29sbGVjdGlvbiBjb25zdHJ1Y3RvclxyXG4gICAgICBDID0gaXNXZWFrXHJcbiAgICAgICAgPyBmdW5jdGlvbihpdGVyYWJsZSl7XHJcbiAgICAgICAgICAgIGFzc2VydEluc3RhbmNlKHRoaXMsIEMsIE5BTUUpO1xyXG4gICAgICAgICAgICBzZXQodGhpcywgVUlELCB1aWQrKyk7XHJcbiAgICAgICAgICAgIGluaXRGcm9tSXRlcmFibGUodGhpcywgaXRlcmFibGUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIDogZnVuY3Rpb24oaXRlcmFibGUpe1xyXG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgICAgIGFzc2VydEluc3RhbmNlKHRoYXQsIEMsIE5BTUUpO1xyXG4gICAgICAgICAgICBzZXQodGhhdCwgTzEsIGNyZWF0ZShudWxsKSk7XHJcbiAgICAgICAgICAgIHNldCh0aGF0LCBTSVpFLCAwKTtcclxuICAgICAgICAgICAgc2V0KHRoYXQsIExBU1QsIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgIHNldCh0aGF0LCBGSVJTVCwgdW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgaW5pdEZyb21JdGVyYWJsZSh0aGF0LCBpdGVyYWJsZSk7XHJcbiAgICAgICAgICB9O1xyXG4gICAgICBhc3NpZ25IaWRkZW4oYXNzaWduSGlkZGVuKENbUFJPVE9UWVBFXSwgbWV0aG9kcyksIGNvbW1vbk1ldGhvZHMpO1xyXG4gICAgICBpc1dlYWsgfHwgIURFU0MgfHwgZGVmaW5lUHJvcGVydHkoQ1tQUk9UT1RZUEVdLCAnc2l6ZScsIHtnZXQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIGFzc2VydERlZmluZWQodGhpc1tTSVpFXSk7XHJcbiAgICAgIH19KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBOYXRpdmUgPSBDXHJcbiAgICAgICAgLCBpbnN0ICAgPSBuZXcgQ1xyXG4gICAgICAgICwgY2hhaW4gID0gaW5zdFtBRERFUl0oaXNXZWFrID8ge30gOiAtMCwgMSlcclxuICAgICAgICAsIGJ1Z2d5WmVybztcclxuICAgICAgLy8gd3JhcCB0byBpbml0IGNvbGxlY3Rpb25zIGZyb20gaXRlcmFibGVcclxuICAgICAgaWYoY2hlY2tEYW5nZXJJdGVyQ2xvc2luZyhmdW5jdGlvbihPKXsgbmV3IEMoTykgfSkpe1xyXG4gICAgICAgIEMgPSBmdW5jdGlvbihpdGVyYWJsZSl7XHJcbiAgICAgICAgICBhc3NlcnRJbnN0YW5jZSh0aGlzLCBDLCBOQU1FKTtcclxuICAgICAgICAgIHJldHVybiBpbml0RnJvbUl0ZXJhYmxlKG5ldyBOYXRpdmUsIGl0ZXJhYmxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgQ1tQUk9UT1RZUEVdID0gcHJvdG87XHJcbiAgICAgICAgaWYoZnJhbWV3b3JrKXByb3RvW0NPTlNUUlVDVE9SXSA9IEM7XHJcbiAgICAgIH1cclxuICAgICAgaXNXZWFrIHx8IGluc3RbRk9SX0VBQ0hdKGZ1bmN0aW9uKHZhbCwga2V5KXtcclxuICAgICAgICBidWdneVplcm8gPSAxIC8ga2V5ID09PSAtSW5maW5pdHk7XHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyBmaXggY29udmVydGluZyAtMCBrZXkgdG8gKzBcclxuICAgICAgaWYoYnVnZ3laZXJvKXtcclxuICAgICAgICBmaXhTVlooJ2RlbGV0ZScpO1xyXG4gICAgICAgIGZpeFNWWignaGFzJyk7XHJcbiAgICAgICAgaXNNYXAgJiYgZml4U1ZaKCdnZXQnKTtcclxuICAgICAgfVxyXG4gICAgICAvLyArIGZpeCAuYWRkICYgLnNldCBmb3IgY2hhaW5pbmdcclxuICAgICAgaWYoYnVnZ3laZXJvIHx8IGNoYWluICE9PSBpbnN0KWZpeFNWWihBRERFUiwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgICBzZXRUb1N0cmluZ1RhZyhDLCBOQU1FKTtcclxuICAgIHNldFNwZWNpZXMoQyk7XHJcbiAgICBcclxuICAgIE9bTkFNRV0gPSBDO1xyXG4gICAgJGRlZmluZShHTE9CQUwgKyBXUkFQICsgRk9SQ0VEICogIWlzTmF0aXZlKEMpLCBPKTtcclxuICAgIFxyXG4gICAgLy8gYWRkIC5rZXlzLCAudmFsdWVzLCAuZW50cmllcywgW0BAaXRlcmF0b3JdXHJcbiAgICAvLyAyMy4xLjMuNCwgMjMuMS4zLjgsIDIzLjEuMy4xMSwgMjMuMS4zLjEyLCAyMy4yLjMuNSwgMjMuMi4zLjgsIDIzLjIuMy4xMCwgMjMuMi4zLjExXHJcbiAgICBpc1dlYWsgfHwgZGVmaW5lU3RkSXRlcmF0b3JzKEMsIE5BTUUsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcclxuICAgICAgc2V0KHRoaXMsIElURVIsIHtvOiBpdGVyYXRlZCwgazoga2luZH0pO1xyXG4gICAgfSwgZnVuY3Rpb24oKXtcclxuICAgICAgdmFyIGl0ZXIgID0gdGhpc1tJVEVSXVxyXG4gICAgICAgICwga2luZCAgPSBpdGVyLmtcclxuICAgICAgICAsIGVudHJ5ID0gaXRlci5sO1xyXG4gICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcclxuICAgICAgd2hpbGUoZW50cnkgJiYgZW50cnkucillbnRyeSA9IGVudHJ5LnA7XHJcbiAgICAgIC8vIGdldCBuZXh0IGVudHJ5XHJcbiAgICAgIGlmKCFpdGVyLm8gfHwgIShpdGVyLmwgPSBlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IGl0ZXIub1tGSVJTVF0pKXtcclxuICAgICAgICAvLyBvciBmaW5pc2ggdGhlIGl0ZXJhdGlvblxyXG4gICAgICAgIGl0ZXIubyA9IHVuZGVmaW5lZDtcclxuICAgICAgICByZXR1cm4gaXRlclJlc3VsdCgxKTtcclxuICAgICAgfVxyXG4gICAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXHJcbiAgICAgIGlmKGtpbmQgPT0gS0VZKSAgcmV0dXJuIGl0ZXJSZXN1bHQoMCwgZW50cnkuayk7XHJcbiAgICAgIGlmKGtpbmQgPT0gVkFMVUUpcmV0dXJuIGl0ZXJSZXN1bHQoMCwgZW50cnkudik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZXJSZXN1bHQoMCwgW2VudHJ5LmssIGVudHJ5LnZdKTsgICBcclxuICAgIH0sIGlzTWFwID8gS0VZK1ZBTFVFIDogVkFMVUUsICFpc01hcCk7XHJcbiAgICBcclxuICAgIHJldHVybiBDO1xyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBmYXN0S2V5KGl0LCBjcmVhdGUpe1xyXG4gICAgLy8gcmV0dXJuIHByaW1pdGl2ZSB3aXRoIHByZWZpeFxyXG4gICAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcclxuICAgIC8vIGNhbid0IHNldCBpZCB0byBmcm96ZW4gb2JqZWN0XHJcbiAgICBpZihpc0Zyb3plbihpdCkpcmV0dXJuICdGJztcclxuICAgIGlmKCFoYXMoaXQsIFVJRCkpe1xyXG4gICAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBpZFxyXG4gICAgICBpZighY3JlYXRlKXJldHVybiAnRSc7XHJcbiAgICAgIC8vIGFkZCBtaXNzaW5nIG9iamVjdCBpZFxyXG4gICAgICBoaWRkZW4oaXQsIFVJRCwgKyt1aWQpO1xyXG4gICAgLy8gcmV0dXJuIG9iamVjdCBpZCB3aXRoIHByZWZpeFxyXG4gICAgfSByZXR1cm4gJ08nICsgaXRbVUlEXTtcclxuICB9XHJcbiAgZnVuY3Rpb24gZ2V0RW50cnkodGhhdCwga2V5KXtcclxuICAgIC8vIGZhc3QgY2FzZVxyXG4gICAgdmFyIGluZGV4ID0gZmFzdEtleShrZXkpLCBlbnRyeTtcclxuICAgIGlmKGluZGV4ICE9ICdGJylyZXR1cm4gdGhhdFtPMV1baW5kZXhdO1xyXG4gICAgLy8gZnJvemVuIG9iamVjdCBjYXNlXHJcbiAgICBmb3IoZW50cnkgPSB0aGF0W0ZJUlNUXTsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XHJcbiAgICAgIGlmKGVudHJ5LmsgPT0ga2V5KXJldHVybiBlbnRyeTtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gZGVmKHRoYXQsIGtleSwgdmFsdWUpe1xyXG4gICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KVxyXG4gICAgICAsIHByZXYsIGluZGV4O1xyXG4gICAgLy8gY2hhbmdlIGV4aXN0aW5nIGVudHJ5XHJcbiAgICBpZihlbnRyeSllbnRyeS52ID0gdmFsdWU7XHJcbiAgICAvLyBjcmVhdGUgbmV3IGVudHJ5XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhhdFtMQVNUXSA9IGVudHJ5ID0ge1xyXG4gICAgICAgIGk6IGluZGV4ID0gZmFzdEtleShrZXksIHRydWUpLCAvLyA8LSBpbmRleFxyXG4gICAgICAgIGs6IGtleSwgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBrZXlcclxuICAgICAgICB2OiB2YWx1ZSwgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcclxuICAgICAgICBwOiBwcmV2ID0gdGhhdFtMQVNUXSwgICAgICAgICAgLy8gPC0gcHJldmlvdXMgZW50cnlcclxuICAgICAgICBuOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgLy8gPC0gbmV4dCBlbnRyeVxyXG4gICAgICAgIHI6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSByZW1vdmVkXHJcbiAgICAgIH07XHJcbiAgICAgIGlmKCF0aGF0W0ZJUlNUXSl0aGF0W0ZJUlNUXSA9IGVudHJ5O1xyXG4gICAgICBpZihwcmV2KXByZXYubiA9IGVudHJ5O1xyXG4gICAgICB0aGF0W1NJWkVdKys7XHJcbiAgICAgIC8vIGFkZCB0byBpbmRleFxyXG4gICAgICBpZihpbmRleCAhPSAnRicpdGhhdFtPMV1baW5kZXhdID0gZW50cnk7XHJcbiAgICB9IHJldHVybiB0aGF0O1xyXG4gIH1cclxuXHJcbiAgdmFyIGNvbGxlY3Rpb25NZXRob2RzID0ge1xyXG4gICAgLy8gMjMuMS4zLjEgTWFwLnByb3RvdHlwZS5jbGVhcigpXHJcbiAgICAvLyAyMy4yLjMuMiBTZXQucHJvdG90eXBlLmNsZWFyKClcclxuICAgIGNsZWFyOiBmdW5jdGlvbigpe1xyXG4gICAgICBmb3IodmFyIHRoYXQgPSB0aGlzLCBkYXRhID0gdGhhdFtPMV0sIGVudHJ5ID0gdGhhdFtGSVJTVF07IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xyXG4gICAgICAgIGVudHJ5LnIgPSB0cnVlO1xyXG4gICAgICAgIGlmKGVudHJ5LnApZW50cnkucCA9IGVudHJ5LnAubiA9IHVuZGVmaW5lZDtcclxuICAgICAgICBkZWxldGUgZGF0YVtlbnRyeS5pXTtcclxuICAgICAgfVxyXG4gICAgICB0aGF0W0ZJUlNUXSA9IHRoYXRbTEFTVF0gPSB1bmRlZmluZWQ7XHJcbiAgICAgIHRoYXRbU0laRV0gPSAwO1xyXG4gICAgfSxcclxuICAgIC8vIDIzLjEuMy4zIE1hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcclxuICAgIC8vIDIzLjIuMy40IFNldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxyXG4gICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIHZhciB0aGF0ICA9IHRoaXNcclxuICAgICAgICAsIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcclxuICAgICAgaWYoZW50cnkpe1xyXG4gICAgICAgIHZhciBuZXh0ID0gZW50cnkublxyXG4gICAgICAgICAgLCBwcmV2ID0gZW50cnkucDtcclxuICAgICAgICBkZWxldGUgdGhhdFtPMV1bZW50cnkuaV07XHJcbiAgICAgICAgZW50cnkuciA9IHRydWU7XHJcbiAgICAgICAgaWYocHJldilwcmV2Lm4gPSBuZXh0O1xyXG4gICAgICAgIGlmKG5leHQpbmV4dC5wID0gcHJldjtcclxuICAgICAgICBpZih0aGF0W0ZJUlNUXSA9PSBlbnRyeSl0aGF0W0ZJUlNUXSA9IG5leHQ7XHJcbiAgICAgICAgaWYodGhhdFtMQVNUXSA9PSBlbnRyeSl0aGF0W0xBU1RdID0gcHJldjtcclxuICAgICAgICB0aGF0W1NJWkVdLS07XHJcbiAgICAgIH0gcmV0dXJuICEhZW50cnk7XHJcbiAgICB9LFxyXG4gICAgLy8gMjMuMi4zLjYgU2V0LnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXHJcbiAgICAvLyAyMy4xLjMuNSBNYXAucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcclxuICAgIGZvckVhY2g6IGZ1bmN0aW9uKGNhbGxiYWNrZm4gLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xyXG4gICAgICB2YXIgZiA9IGN0eChjYWxsYmFja2ZuLCBhcmd1bWVudHNbMV0sIDMpXHJcbiAgICAgICAgLCBlbnRyeTtcclxuICAgICAgd2hpbGUoZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGlzW0ZJUlNUXSl7XHJcbiAgICAgICAgZihlbnRyeS52LCBlbnRyeS5rLCB0aGlzKTtcclxuICAgICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcclxuICAgICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIDIzLjEuMy43IE1hcC5wcm90b3R5cGUuaGFzKGtleSlcclxuICAgIC8vIDIzLjIuMy43IFNldC5wcm90b3R5cGUuaGFzKHZhbHVlKVxyXG4gICAgaGFzOiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICByZXR1cm4gISFnZXRFbnRyeSh0aGlzLCBrZXkpO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICAvLyAyMy4xIE1hcCBPYmplY3RzXHJcbiAgTWFwID0gZ2V0Q29sbGVjdGlvbihNYXAsIE1BUCwge1xyXG4gICAgLy8gMjMuMS4zLjYgTWFwLnByb3RvdHlwZS5nZXQoa2V5KVxyXG4gICAgZ2V0OiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGlzLCBrZXkpO1xyXG4gICAgICByZXR1cm4gZW50cnkgJiYgZW50cnkudjtcclxuICAgIH0sXHJcbiAgICAvLyAyMy4xLjMuOSBNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxyXG4gICAgc2V0OiBmdW5jdGlvbihrZXksIHZhbHVlKXtcclxuICAgICAgcmV0dXJuIGRlZih0aGlzLCBrZXkgPT09IDAgPyAwIDoga2V5LCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfSwgY29sbGVjdGlvbk1ldGhvZHMsIHRydWUpO1xyXG4gIFxyXG4gIC8vIDIzLjIgU2V0IE9iamVjdHNcclxuICBTZXQgPSBnZXRDb2xsZWN0aW9uKFNldCwgU0VULCB7XHJcbiAgICAvLyAyMy4yLjMuMSBTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlcclxuICAgIGFkZDogZnVuY3Rpb24odmFsdWUpe1xyXG4gICAgICByZXR1cm4gZGVmKHRoaXMsIHZhbHVlID0gdmFsdWUgPT09IDAgPyAwIDogdmFsdWUsIHZhbHVlKTtcclxuICAgIH1cclxuICB9LCBjb2xsZWN0aW9uTWV0aG9kcyk7XHJcbiAgXHJcbiAgZnVuY3Rpb24gZGVmV2Vhayh0aGF0LCBrZXksIHZhbHVlKXtcclxuICAgIGlmKGlzRnJvemVuKGFzc2VydE9iamVjdChrZXkpKSlsZWFrU3RvcmUodGhhdCkuc2V0KGtleSwgdmFsdWUpO1xyXG4gICAgZWxzZSB7XHJcbiAgICAgIGhhcyhrZXksIFdFQUspIHx8IGhpZGRlbihrZXksIFdFQUssIHt9KTtcclxuICAgICAga2V5W1dFQUtdW3RoYXRbVUlEXV0gPSB2YWx1ZTtcclxuICAgIH0gcmV0dXJuIHRoYXQ7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGxlYWtTdG9yZSh0aGF0KXtcclxuICAgIHJldHVybiB0aGF0W0xFQUtdIHx8IGhpZGRlbih0aGF0LCBMRUFLLCBuZXcgTWFwKVtMRUFLXTtcclxuICB9XHJcbiAgXHJcbiAgdmFyIHdlYWtNZXRob2RzID0ge1xyXG4gICAgLy8gMjMuMy4zLjIgV2Vha01hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcclxuICAgIC8vIDIzLjQuMy4zIFdlYWtTZXQucHJvdG90eXBlLmRlbGV0ZSh2YWx1ZSlcclxuICAgICdkZWxldGUnOiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICBpZighaXNPYmplY3Qoa2V5KSlyZXR1cm4gZmFsc2U7XHJcbiAgICAgIGlmKGlzRnJvemVuKGtleSkpcmV0dXJuIGxlYWtTdG9yZSh0aGlzKVsnZGVsZXRlJ10oa2V5KTtcclxuICAgICAgcmV0dXJuIGhhcyhrZXksIFdFQUspICYmIGhhcyhrZXlbV0VBS10sIHRoaXNbVUlEXSkgJiYgZGVsZXRlIGtleVtXRUFLXVt0aGlzW1VJRF1dO1xyXG4gICAgfSxcclxuICAgIC8vIDIzLjMuMy40IFdlYWtNYXAucHJvdG90eXBlLmhhcyhrZXkpXHJcbiAgICAvLyAyMy40LjMuNCBXZWFrU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXHJcbiAgICBoYXM6IGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIGlmKCFpc09iamVjdChrZXkpKXJldHVybiBmYWxzZTtcclxuICAgICAgaWYoaXNGcm96ZW4oa2V5KSlyZXR1cm4gbGVha1N0b3JlKHRoaXMpLmhhcyhrZXkpO1xyXG4gICAgICByZXR1cm4gaGFzKGtleSwgV0VBSykgJiYgaGFzKGtleVtXRUFLXSwgdGhpc1tVSURdKTtcclxuICAgIH1cclxuICB9O1xyXG4gIFxyXG4gIC8vIDIzLjMgV2Vha01hcCBPYmplY3RzXHJcbiAgV2Vha01hcCA9IGdldENvbGxlY3Rpb24oV2Vha01hcCwgV0VBS01BUCwge1xyXG4gICAgLy8gMjMuMy4zLjMgV2Vha01hcC5wcm90b3R5cGUuZ2V0KGtleSlcclxuICAgIGdldDogZnVuY3Rpb24oa2V5KXtcclxuICAgICAgaWYoaXNPYmplY3Qoa2V5KSl7XHJcbiAgICAgICAgaWYoaXNGcm96ZW4oa2V5KSlyZXR1cm4gbGVha1N0b3JlKHRoaXMpLmdldChrZXkpO1xyXG4gICAgICAgIGlmKGhhcyhrZXksIFdFQUspKXJldHVybiBrZXlbV0VBS11bdGhpc1tVSURdXTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIDIzLjMuMy41IFdlYWtNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxyXG4gICAgc2V0OiBmdW5jdGlvbihrZXksIHZhbHVlKXtcclxuICAgICAgcmV0dXJuIGRlZldlYWsodGhpcywga2V5LCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfSwgd2Vha01ldGhvZHMsIHRydWUsIHRydWUpO1xyXG4gIFxyXG4gIC8vIElFMTEgV2Vha01hcCBmcm96ZW4ga2V5cyBmaXhcclxuICBpZihmcmFtZXdvcmsgJiYgbmV3IFdlYWtNYXAoKS5zZXQoT2JqZWN0LmZyZWV6ZSh0bXApLCA3KS5nZXQodG1wKSAhPSA3KXtcclxuICAgIGZvckVhY2guY2FsbChhcnJheSgnZGVsZXRlLGhhcyxnZXQsc2V0JyksIGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIHZhciBtZXRob2QgPSBXZWFrTWFwW1BST1RPVFlQRV1ba2V5XTtcclxuICAgICAgV2Vha01hcFtQUk9UT1RZUEVdW2tleV0gPSBmdW5jdGlvbihhLCBiKXtcclxuICAgICAgICAvLyBzdG9yZSBmcm96ZW4gb2JqZWN0cyBvbiBsZWFreSBtYXBcclxuICAgICAgICBpZihpc09iamVjdChhKSAmJiBpc0Zyb3plbihhKSl7XHJcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gbGVha1N0b3JlKHRoaXMpW2tleV0oYSwgYik7XHJcbiAgICAgICAgICByZXR1cm4ga2V5ID09ICdzZXQnID8gdGhpcyA6IHJlc3VsdDtcclxuICAgICAgICAvLyBzdG9yZSBhbGwgdGhlIHJlc3Qgb24gbmF0aXZlIHdlYWttYXBcclxuICAgICAgICB9IHJldHVybiBtZXRob2QuY2FsbCh0aGlzLCBhLCBiKTtcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBcclxuICAvLyAyMy40IFdlYWtTZXQgT2JqZWN0c1xyXG4gIFdlYWtTZXQgPSBnZXRDb2xsZWN0aW9uKFdlYWtTZXQsIFdFQUtTRVQsIHtcclxuICAgIC8vIDIzLjQuMy4xIFdlYWtTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlcclxuICAgIGFkZDogZnVuY3Rpb24odmFsdWUpe1xyXG4gICAgICByZXR1cm4gZGVmV2Vhayh0aGlzLCB2YWx1ZSwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgfSwgd2Vha01ldGhvZHMsIGZhbHNlLCB0cnVlKTtcclxufSgpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczYucmVmbGVjdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oKXtcclxuICBmdW5jdGlvbiBFbnVtZXJhdGUoaXRlcmF0ZWQpe1xyXG4gICAgdmFyIGtleXMgPSBbXSwga2V5O1xyXG4gICAgZm9yKGtleSBpbiBpdGVyYXRlZClrZXlzLnB1c2goa2V5KTtcclxuICAgIHNldCh0aGlzLCBJVEVSLCB7bzogaXRlcmF0ZWQsIGE6IGtleXMsIGk6IDB9KTtcclxuICB9XHJcbiAgY3JlYXRlSXRlcmF0b3IoRW51bWVyYXRlLCBPQkpFQ1QsIGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgaXRlciA9IHRoaXNbSVRFUl1cclxuICAgICAgLCBrZXlzID0gaXRlci5hXHJcbiAgICAgICwga2V5O1xyXG4gICAgZG8ge1xyXG4gICAgICBpZihpdGVyLmkgPj0ga2V5cy5sZW5ndGgpcmV0dXJuIGl0ZXJSZXN1bHQoMSk7XHJcbiAgICB9IHdoaWxlKCEoKGtleSA9IGtleXNbaXRlci5pKytdKSBpbiBpdGVyLm8pKTtcclxuICAgIHJldHVybiBpdGVyUmVzdWx0KDAsIGtleSk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgZnVuY3Rpb24gd3JhcChmbil7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oaXQpe1xyXG4gICAgICBhc3NlcnRPYmplY3QoaXQpO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBmbi5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyksIHRydWU7XHJcbiAgICAgIH0gY2F0Y2goZSl7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIHJlZmxlY3RHZXQodGFyZ2V0LCBwcm9wZXJ0eUtleS8qLCByZWNlaXZlciovKXtcclxuICAgIHZhciByZWNlaXZlciA9IGFyZ3VtZW50cy5sZW5ndGggPCAzID8gdGFyZ2V0IDogYXJndW1lbnRzWzJdXHJcbiAgICAgICwgZGVzYyA9IGdldE93bkRlc2NyaXB0b3IoYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KSwgcHJvdG87XHJcbiAgICBpZihkZXNjKXJldHVybiBoYXMoZGVzYywgJ3ZhbHVlJylcclxuICAgICAgPyBkZXNjLnZhbHVlXHJcbiAgICAgIDogZGVzYy5nZXQgPT09IHVuZGVmaW5lZFxyXG4gICAgICAgID8gdW5kZWZpbmVkXHJcbiAgICAgICAgOiBkZXNjLmdldC5jYWxsKHJlY2VpdmVyKTtcclxuICAgIHJldHVybiBpc09iamVjdChwcm90byA9IGdldFByb3RvdHlwZU9mKHRhcmdldCkpXHJcbiAgICAgID8gcmVmbGVjdEdldChwcm90bywgcHJvcGVydHlLZXksIHJlY2VpdmVyKVxyXG4gICAgICA6IHVuZGVmaW5lZDtcclxuICB9XHJcbiAgZnVuY3Rpb24gcmVmbGVjdFNldCh0YXJnZXQsIHByb3BlcnR5S2V5LCBWLyosIHJlY2VpdmVyKi8pe1xyXG4gICAgdmFyIHJlY2VpdmVyID0gYXJndW1lbnRzLmxlbmd0aCA8IDQgPyB0YXJnZXQgOiBhcmd1bWVudHNbM11cclxuICAgICAgLCBvd25EZXNjICA9IGdldE93bkRlc2NyaXB0b3IoYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KVxyXG4gICAgICAsIGV4aXN0aW5nRGVzY3JpcHRvciwgcHJvdG87XHJcbiAgICBpZighb3duRGVzYyl7XHJcbiAgICAgIGlmKGlzT2JqZWN0KHByb3RvID0gZ2V0UHJvdG90eXBlT2YodGFyZ2V0KSkpe1xyXG4gICAgICAgIHJldHVybiByZWZsZWN0U2V0KHByb3RvLCBwcm9wZXJ0eUtleSwgViwgcmVjZWl2ZXIpO1xyXG4gICAgICB9XHJcbiAgICAgIG93bkRlc2MgPSBkZXNjcmlwdG9yKDApO1xyXG4gICAgfVxyXG4gICAgaWYoaGFzKG93bkRlc2MsICd2YWx1ZScpKXtcclxuICAgICAgaWYob3duRGVzYy53cml0YWJsZSA9PT0gZmFsc2UgfHwgIWlzT2JqZWN0KHJlY2VpdmVyKSlyZXR1cm4gZmFsc2U7XHJcbiAgICAgIGV4aXN0aW5nRGVzY3JpcHRvciA9IGdldE93bkRlc2NyaXB0b3IocmVjZWl2ZXIsIHByb3BlcnR5S2V5KSB8fCBkZXNjcmlwdG9yKDApO1xyXG4gICAgICBleGlzdGluZ0Rlc2NyaXB0b3IudmFsdWUgPSBWO1xyXG4gICAgICByZXR1cm4gZGVmaW5lUHJvcGVydHkocmVjZWl2ZXIsIHByb3BlcnR5S2V5LCBleGlzdGluZ0Rlc2NyaXB0b3IpLCB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG93bkRlc2Muc2V0ID09PSB1bmRlZmluZWRcclxuICAgICAgPyBmYWxzZVxyXG4gICAgICA6IChvd25EZXNjLnNldC5jYWxsKHJlY2VpdmVyLCBWKSwgdHJ1ZSk7XHJcbiAgfVxyXG4gIHZhciBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IHJldHVybkl0O1xyXG4gIFxyXG4gIHZhciByZWZsZWN0ID0ge1xyXG4gICAgLy8gMjYuMS4xIFJlZmxlY3QuYXBwbHkodGFyZ2V0LCB0aGlzQXJndW1lbnQsIGFyZ3VtZW50c0xpc3QpXHJcbiAgICBhcHBseTogY3R4KGNhbGwsIGFwcGx5LCAzKSxcclxuICAgIC8vIDI2LjEuMiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3VtZW50c0xpc3QgWywgbmV3VGFyZ2V0XSlcclxuICAgIGNvbnN0cnVjdDogZnVuY3Rpb24odGFyZ2V0LCBhcmd1bWVudHNMaXN0IC8qLCBuZXdUYXJnZXQqLyl7XHJcbiAgICAgIHZhciBwcm90byAgICA9IGFzc2VydEZ1bmN0aW9uKGFyZ3VtZW50cy5sZW5ndGggPCAzID8gdGFyZ2V0IDogYXJndW1lbnRzWzJdKVtQUk9UT1RZUEVdXHJcbiAgICAgICAgLCBpbnN0YW5jZSA9IGNyZWF0ZShpc09iamVjdChwcm90bykgPyBwcm90byA6IE9iamVjdFByb3RvKVxyXG4gICAgICAgICwgcmVzdWx0ICAgPSBhcHBseS5jYWxsKHRhcmdldCwgaW5zdGFuY2UsIGFyZ3VtZW50c0xpc3QpO1xyXG4gICAgICByZXR1cm4gaXNPYmplY3QocmVzdWx0KSA/IHJlc3VsdCA6IGluc3RhbmNlO1xyXG4gICAgfSxcclxuICAgIC8vIDI2LjEuMyBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXksIGF0dHJpYnV0ZXMpXHJcbiAgICBkZWZpbmVQcm9wZXJ0eTogd3JhcChkZWZpbmVQcm9wZXJ0eSksXHJcbiAgICAvLyAyNi4xLjQgUmVmbGVjdC5kZWxldGVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5KVxyXG4gICAgZGVsZXRlUHJvcGVydHk6IGZ1bmN0aW9uKHRhcmdldCwgcHJvcGVydHlLZXkpe1xyXG4gICAgICB2YXIgZGVzYyA9IGdldE93bkRlc2NyaXB0b3IoYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KTtcclxuICAgICAgcmV0dXJuIGRlc2MgJiYgIWRlc2MuY29uZmlndXJhYmxlID8gZmFsc2UgOiBkZWxldGUgdGFyZ2V0W3Byb3BlcnR5S2V5XTtcclxuICAgIH0sXHJcbiAgICAvLyAyNi4xLjUgUmVmbGVjdC5lbnVtZXJhdGUodGFyZ2V0KVxyXG4gICAgZW51bWVyYXRlOiBmdW5jdGlvbih0YXJnZXQpe1xyXG4gICAgICByZXR1cm4gbmV3IEVudW1lcmF0ZShhc3NlcnRPYmplY3QodGFyZ2V0KSk7XHJcbiAgICB9LFxyXG4gICAgLy8gMjYuMS42IFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcGVydHlLZXkgWywgcmVjZWl2ZXJdKVxyXG4gICAgZ2V0OiByZWZsZWN0R2V0LFxyXG4gICAgLy8gMjYuMS43IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcGVydHlLZXkpXHJcbiAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IGZ1bmN0aW9uKHRhcmdldCwgcHJvcGVydHlLZXkpe1xyXG4gICAgICByZXR1cm4gZ2V0T3duRGVzY3JpcHRvcihhc3NlcnRPYmplY3QodGFyZ2V0KSwgcHJvcGVydHlLZXkpO1xyXG4gICAgfSxcclxuICAgIC8vIDI2LjEuOCBSZWZsZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldClcclxuICAgIGdldFByb3RvdHlwZU9mOiBmdW5jdGlvbih0YXJnZXQpe1xyXG4gICAgICByZXR1cm4gZ2V0UHJvdG90eXBlT2YoYXNzZXJ0T2JqZWN0KHRhcmdldCkpO1xyXG4gICAgfSxcclxuICAgIC8vIDI2LjEuOSBSZWZsZWN0Lmhhcyh0YXJnZXQsIHByb3BlcnR5S2V5KVxyXG4gICAgaGFzOiBmdW5jdGlvbih0YXJnZXQsIHByb3BlcnR5S2V5KXtcclxuICAgICAgcmV0dXJuIHByb3BlcnR5S2V5IGluIHRhcmdldDtcclxuICAgIH0sXHJcbiAgICAvLyAyNi4xLjEwIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRhcmdldClcclxuICAgIGlzRXh0ZW5zaWJsZTogZnVuY3Rpb24odGFyZ2V0KXtcclxuICAgICAgcmV0dXJuICEhaXNFeHRlbnNpYmxlKGFzc2VydE9iamVjdCh0YXJnZXQpKTtcclxuICAgIH0sXHJcbiAgICAvLyAyNi4xLjExIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpXHJcbiAgICBvd25LZXlzOiBvd25LZXlzLFxyXG4gICAgLy8gMjYuMS4xMiBSZWZsZWN0LnByZXZlbnRFeHRlbnNpb25zKHRhcmdldClcclxuICAgIHByZXZlbnRFeHRlbnNpb25zOiB3cmFwKE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyB8fCByZXR1cm5JdCksXHJcbiAgICAvLyAyNi4xLjEzIFJlZmxlY3Quc2V0KHRhcmdldCwgcHJvcGVydHlLZXksIFYgWywgcmVjZWl2ZXJdKVxyXG4gICAgc2V0OiByZWZsZWN0U2V0XHJcbiAgfVxyXG4gIC8vIDI2LjEuMTQgUmVmbGVjdC5zZXRQcm90b3R5cGVPZih0YXJnZXQsIHByb3RvKVxyXG4gIGlmKHNldFByb3RvdHlwZU9mKXJlZmxlY3Quc2V0UHJvdG90eXBlT2YgPSBmdW5jdGlvbih0YXJnZXQsIHByb3RvKXtcclxuICAgIHJldHVybiBzZXRQcm90b3R5cGVPZihhc3NlcnRPYmplY3QodGFyZ2V0KSwgcHJvdG8pLCB0cnVlO1xyXG4gIH07XHJcbiAgXHJcbiAgJGRlZmluZShHTE9CQUwsIHtSZWZsZWN0OiB7fX0pO1xyXG4gICRkZWZpbmUoU1RBVElDLCAnUmVmbGVjdCcsIHJlZmxlY3QpO1xyXG59KCk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNy5wcm9wb3NhbHMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbigpe1xyXG4gICRkZWZpbmUoUFJPVE8sIEFSUkFZLCB7XHJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZG9tZW5pYy9BcnJheS5wcm90b3R5cGUuaW5jbHVkZXNcclxuICAgIGluY2x1ZGVzOiBjcmVhdGVBcnJheUNvbnRhaW5zKHRydWUpXHJcbiAgfSk7XHJcbiAgJGRlZmluZShQUk9UTywgU1RSSU5HLCB7XHJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcucHJvdG90eXBlLmF0XHJcbiAgICBhdDogY3JlYXRlUG9pbnRBdCh0cnVlKVxyXG4gIH0pO1xyXG4gIFxyXG4gIGZ1bmN0aW9uIGNyZWF0ZU9iamVjdFRvQXJyYXkoaXNFbnRyaWVzKXtcclxuICAgIHJldHVybiBmdW5jdGlvbihvYmplY3Qpe1xyXG4gICAgICB2YXIgTyAgICAgID0gdG9PYmplY3Qob2JqZWN0KVxyXG4gICAgICAgICwga2V5cyAgID0gZ2V0S2V5cyhvYmplY3QpXHJcbiAgICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxyXG4gICAgICAgICwgaSAgICAgID0gMFxyXG4gICAgICAgICwgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKVxyXG4gICAgICAgICwga2V5O1xyXG4gICAgICBpZihpc0VudHJpZXMpd2hpbGUobGVuZ3RoID4gaSlyZXN1bHRbaV0gPSBba2V5ID0ga2V5c1tpKytdLCBPW2tleV1dO1xyXG4gICAgICBlbHNlIHdoaWxlKGxlbmd0aCA+IGkpcmVzdWx0W2ldID0gT1trZXlzW2krK11dO1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gIH1cclxuICAkZGVmaW5lKFNUQVRJQywgT0JKRUNULCB7XHJcbiAgICAvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9XZWJSZWZsZWN0aW9uLzkzNTM3ODFcclxuICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcnM6IGZ1bmN0aW9uKG9iamVjdCl7XHJcbiAgICAgIHZhciBPICAgICAgPSB0b09iamVjdChvYmplY3QpXHJcbiAgICAgICAgLCByZXN1bHQgPSB7fTtcclxuICAgICAgZm9yRWFjaC5jYWxsKG93bktleXMoTyksIGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgICAgZGVmaW5lUHJvcGVydHkocmVzdWx0LCBrZXksIGRlc2NyaXB0b3IoMCwgZ2V0T3duRGVzY3JpcHRvcihPLCBrZXkpKSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSxcclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9yd2FsZHJvbi90YzM5LW5vdGVzL2Jsb2IvbWFzdGVyL2VzNi8yMDE0LTA0L2Fwci05Lm1kIzUxLW9iamVjdGVudHJpZXMtb2JqZWN0dmFsdWVzXHJcbiAgICB2YWx1ZXM6ICBjcmVhdGVPYmplY3RUb0FycmF5KGZhbHNlKSxcclxuICAgIGVudHJpZXM6IGNyZWF0ZU9iamVjdFRvQXJyYXkodHJ1ZSlcclxuICB9KTtcclxuICAkZGVmaW5lKFNUQVRJQywgUkVHRVhQLCB7XHJcbiAgICAvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9rYW5nYXgvOTY5ODEwMFxyXG4gICAgZXNjYXBlOiBjcmVhdGVSZXBsYWNlcigvKFtcXFxcXFwtW1xcXXt9KCkqKz8uLF4kfF0pL2csICdcXFxcJDEnLCB0cnVlKVxyXG4gIH0pO1xyXG59KCk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNy5hYnN0cmFjdC1yZWZzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96ZW5wYXJzaW5nL2VzLWFic3RyYWN0LXJlZnNcclxuIWZ1bmN0aW9uKFJFRkVSRU5DRSl7XHJcbiAgUkVGRVJFTkNFX0dFVCA9IGdldFdlbGxLbm93blN5bWJvbChSRUZFUkVOQ0UrJ0dldCcsIHRydWUpO1xyXG4gIHZhciBSRUZFUkVOQ0VfU0VUID0gZ2V0V2VsbEtub3duU3ltYm9sKFJFRkVSRU5DRStTRVQsIHRydWUpXHJcbiAgICAsIFJFRkVSRU5DRV9ERUxFVEUgPSBnZXRXZWxsS25vd25TeW1ib2woUkVGRVJFTkNFKydEZWxldGUnLCB0cnVlKTtcclxuICBcclxuICAkZGVmaW5lKFNUQVRJQywgU1lNQk9MLCB7XHJcbiAgICByZWZlcmVuY2VHZXQ6IFJFRkVSRU5DRV9HRVQsXHJcbiAgICByZWZlcmVuY2VTZXQ6IFJFRkVSRU5DRV9TRVQsXHJcbiAgICByZWZlcmVuY2VEZWxldGU6IFJFRkVSRU5DRV9ERUxFVEVcclxuICB9KTtcclxuICBcclxuICBoaWRkZW4oRnVuY3Rpb25Qcm90bywgUkVGRVJFTkNFX0dFVCwgcmV0dXJuVGhpcyk7XHJcbiAgXHJcbiAgZnVuY3Rpb24gc2V0TWFwTWV0aG9kcyhDb25zdHJ1Y3Rvcil7XHJcbiAgICBpZihDb25zdHJ1Y3Rvcil7XHJcbiAgICAgIHZhciBNYXBQcm90byA9IENvbnN0cnVjdG9yW1BST1RPVFlQRV07XHJcbiAgICAgIGhpZGRlbihNYXBQcm90bywgUkVGRVJFTkNFX0dFVCwgTWFwUHJvdG8uZ2V0KTtcclxuICAgICAgaGlkZGVuKE1hcFByb3RvLCBSRUZFUkVOQ0VfU0VULCBNYXBQcm90by5zZXQpO1xyXG4gICAgICBoaWRkZW4oTWFwUHJvdG8sIFJFRkVSRU5DRV9ERUxFVEUsIE1hcFByb3RvWydkZWxldGUnXSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHNldE1hcE1ldGhvZHMoTWFwKTtcclxuICBzZXRNYXBNZXRob2RzKFdlYWtNYXApO1xyXG59KCdyZWZlcmVuY2UnKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogY29yZS5kaWN0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKERJQ1Qpe1xyXG4gIERpY3QgPSBmdW5jdGlvbihpdGVyYWJsZSl7XHJcbiAgICB2YXIgZGljdCA9IGNyZWF0ZShudWxsKTtcclxuICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZCl7XHJcbiAgICAgIGlmKGlzSXRlcmFibGUoaXRlcmFibGUpKXtcclxuICAgICAgICBmb3JPZihpdGVyYWJsZSwgdHJ1ZSwgZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XHJcbiAgICAgICAgICBkaWN0W2tleV0gPSB2YWx1ZTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIGFzc2lnbihkaWN0LCBpdGVyYWJsZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGljdDtcclxuICB9XHJcbiAgRGljdFtQUk9UT1RZUEVdID0gbnVsbDtcclxuICBcclxuICBmdW5jdGlvbiBEaWN0SXRlcmF0b3IoaXRlcmF0ZWQsIGtpbmQpe1xyXG4gICAgc2V0KHRoaXMsIElURVIsIHtvOiB0b09iamVjdChpdGVyYXRlZCksIGE6IGdldEtleXMoaXRlcmF0ZWQpLCBpOiAwLCBrOiBraW5kfSk7XHJcbiAgfVxyXG4gIGNyZWF0ZUl0ZXJhdG9yKERpY3RJdGVyYXRvciwgRElDVCwgZnVuY3Rpb24oKXtcclxuICAgIHZhciBpdGVyID0gdGhpc1tJVEVSXVxyXG4gICAgICAsIE8gICAgPSBpdGVyLm9cclxuICAgICAgLCBrZXlzID0gaXRlci5hXHJcbiAgICAgICwga2luZCA9IGl0ZXIua1xyXG4gICAgICAsIGtleTtcclxuICAgIGRvIHtcclxuICAgICAgaWYoaXRlci5pID49IGtleXMubGVuZ3RoKXtcclxuICAgICAgICBpdGVyLm8gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmV0dXJuIGl0ZXJSZXN1bHQoMSk7XHJcbiAgICAgIH1cclxuICAgIH0gd2hpbGUoIWhhcyhPLCBrZXkgPSBrZXlzW2l0ZXIuaSsrXSkpO1xyXG4gICAgaWYoa2luZCA9PSBLRVkpICByZXR1cm4gaXRlclJlc3VsdCgwLCBrZXkpO1xyXG4gICAgaWYoa2luZCA9PSBWQUxVRSlyZXR1cm4gaXRlclJlc3VsdCgwLCBPW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlclJlc3VsdCgwLCBba2V5LCBPW2tleV1dKTtcclxuICB9KTtcclxuICBmdW5jdGlvbiBjcmVhdGVEaWN0SXRlcihraW5kKXtcclxuICAgIHJldHVybiBmdW5jdGlvbihpdCl7XHJcbiAgICAgIHJldHVybiBuZXcgRGljdEl0ZXJhdG9yKGl0LCBraW5kKTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgLypcclxuICAgKiAwIC0+IGZvckVhY2hcclxuICAgKiAxIC0+IG1hcFxyXG4gICAqIDIgLT4gZmlsdGVyXHJcbiAgICogMyAtPiBzb21lXHJcbiAgICogNCAtPiBldmVyeVxyXG4gICAqIDUgLT4gZmluZFxyXG4gICAqIDYgLT4gZmluZEtleVxyXG4gICAqIDcgLT4gbWFwUGFpcnNcclxuICAgKi9cclxuICBmdW5jdGlvbiBjcmVhdGVEaWN0TWV0aG9kKHR5cGUpe1xyXG4gICAgdmFyIGlzTWFwICAgID0gdHlwZSA9PSAxXHJcbiAgICAgICwgaXNFdmVyeSAgPSB0eXBlID09IDQ7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0LCBjYWxsYmFja2ZuLCB0aGF0IC8qID0gdW5kZWZpbmVkICovKXtcclxuICAgICAgdmFyIGYgICAgICA9IGN0eChjYWxsYmFja2ZuLCB0aGF0LCAzKVxyXG4gICAgICAgICwgTyAgICAgID0gdG9PYmplY3Qob2JqZWN0KVxyXG4gICAgICAgICwgcmVzdWx0ID0gaXNNYXAgfHwgdHlwZSA9PSA3IHx8IHR5cGUgPT0gMiA/IG5ldyAoZ2VuZXJpYyh0aGlzLCBEaWN0KSkgOiB1bmRlZmluZWRcclxuICAgICAgICAsIGtleSwgdmFsLCByZXM7XHJcbiAgICAgIGZvcihrZXkgaW4gTylpZihoYXMoTywga2V5KSl7XHJcbiAgICAgICAgdmFsID0gT1trZXldO1xyXG4gICAgICAgIHJlcyA9IGYodmFsLCBrZXksIG9iamVjdCk7XHJcbiAgICAgICAgaWYodHlwZSl7XHJcbiAgICAgICAgICBpZihpc01hcClyZXN1bHRba2V5XSA9IHJlczsgICAgICAgICAgICAgLy8gbWFwXHJcbiAgICAgICAgICBlbHNlIGlmKHJlcylzd2l0Y2godHlwZSl7XHJcbiAgICAgICAgICAgIGNhc2UgMjogcmVzdWx0W2tleV0gPSB2YWw7IGJyZWFrICAgICAgLy8gZmlsdGVyXHJcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgICAgICAgLy8gc29tZVxyXG4gICAgICAgICAgICBjYXNlIDU6IHJldHVybiB2YWw7ICAgICAgICAgICAgICAgICAgIC8vIGZpbmRcclxuICAgICAgICAgICAgY2FzZSA2OiByZXR1cm4ga2V5OyAgICAgICAgICAgICAgICAgICAvLyBmaW5kS2V5XHJcbiAgICAgICAgICAgIGNhc2UgNzogcmVzdWx0W3Jlc1swXV0gPSByZXNbMV07ICAgICAgLy8gbWFwUGFpcnNcclxuICAgICAgICAgIH0gZWxzZSBpZihpc0V2ZXJ5KXJldHVybiBmYWxzZTsgICAgICAgICAvLyBldmVyeVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdHlwZSA9PSAzIHx8IGlzRXZlcnkgPyBpc0V2ZXJ5IDogcmVzdWx0O1xyXG4gICAgfVxyXG4gIH1cclxuICBmdW5jdGlvbiBjcmVhdGVEaWN0UmVkdWNlKGlzVHVybil7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0LCBtYXBmbiwgaW5pdCl7XHJcbiAgICAgIGFzc2VydEZ1bmN0aW9uKG1hcGZuKTtcclxuICAgICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KG9iamVjdClcclxuICAgICAgICAsIGtleXMgICA9IGdldEtleXMoTylcclxuICAgICAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXHJcbiAgICAgICAgLCBpICAgICAgPSAwXHJcbiAgICAgICAgLCBtZW1vLCBrZXksIHJlc3VsdDtcclxuICAgICAgaWYoaXNUdXJuKW1lbW8gPSBpbml0ID09IHVuZGVmaW5lZCA/IG5ldyAoZ2VuZXJpYyh0aGlzLCBEaWN0KSkgOiBPYmplY3QoaW5pdCk7XHJcbiAgICAgIGVsc2UgaWYoYXJndW1lbnRzLmxlbmd0aCA8IDMpe1xyXG4gICAgICAgIGFzc2VydChsZW5ndGgsIFJFRFVDRV9FUlJPUik7XHJcbiAgICAgICAgbWVtbyA9IE9ba2V5c1tpKytdXTtcclxuICAgICAgfSBlbHNlIG1lbW8gPSBPYmplY3QoaW5pdCk7XHJcbiAgICAgIHdoaWxlKGxlbmd0aCA+IGkpaWYoaGFzKE8sIGtleSA9IGtleXNbaSsrXSkpe1xyXG4gICAgICAgIHJlc3VsdCA9IG1hcGZuKG1lbW8sIE9ba2V5XSwga2V5LCBvYmplY3QpO1xyXG4gICAgICAgIGlmKGlzVHVybil7XHJcbiAgICAgICAgICBpZihyZXN1bHQgPT09IGZhbHNlKWJyZWFrO1xyXG4gICAgICAgIH0gZWxzZSBtZW1vID0gcmVzdWx0O1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBtZW1vO1xyXG4gICAgfVxyXG4gIH1cclxuICB2YXIgZmluZEtleSA9IGNyZWF0ZURpY3RNZXRob2QoNik7XHJcbiAgZnVuY3Rpb24gaW5jbHVkZXMob2JqZWN0LCBlbCl7XHJcbiAgICByZXR1cm4gKGVsID09IGVsID8ga2V5T2Yob2JqZWN0LCBlbCkgOiBmaW5kS2V5KG9iamVjdCwgc2FtZU5hTikpICE9PSB1bmRlZmluZWQ7XHJcbiAgfVxyXG4gIFxyXG4gIHZhciBkaWN0TWV0aG9kcyA9IHtcclxuICAgIGtleXM6ICAgIGNyZWF0ZURpY3RJdGVyKEtFWSksXHJcbiAgICB2YWx1ZXM6ICBjcmVhdGVEaWN0SXRlcihWQUxVRSksXHJcbiAgICBlbnRyaWVzOiBjcmVhdGVEaWN0SXRlcihLRVkrVkFMVUUpLFxyXG4gICAgZm9yRWFjaDogY3JlYXRlRGljdE1ldGhvZCgwKSxcclxuICAgIG1hcDogICAgIGNyZWF0ZURpY3RNZXRob2QoMSksXHJcbiAgICBmaWx0ZXI6ICBjcmVhdGVEaWN0TWV0aG9kKDIpLFxyXG4gICAgc29tZTogICAgY3JlYXRlRGljdE1ldGhvZCgzKSxcclxuICAgIGV2ZXJ5OiAgIGNyZWF0ZURpY3RNZXRob2QoNCksXHJcbiAgICBmaW5kOiAgICBjcmVhdGVEaWN0TWV0aG9kKDUpLFxyXG4gICAgZmluZEtleTogZmluZEtleSxcclxuICAgIG1hcFBhaXJzOmNyZWF0ZURpY3RNZXRob2QoNyksXHJcbiAgICByZWR1Y2U6ICBjcmVhdGVEaWN0UmVkdWNlKGZhbHNlKSxcclxuICAgIHR1cm46ICAgIGNyZWF0ZURpY3RSZWR1Y2UodHJ1ZSksXHJcbiAgICBrZXlPZjogICBrZXlPZixcclxuICAgIGluY2x1ZGVzOmluY2x1ZGVzLFxyXG4gICAgLy8gSGFzIC8gZ2V0IC8gc2V0IG93biBwcm9wZXJ0eVxyXG4gICAgaGFzOiBoYXMsXHJcbiAgICBnZXQ6IGdldCxcclxuICAgIHNldDogY3JlYXRlRGVmaW5lcigwKSxcclxuICAgIGlzRGljdDogZnVuY3Rpb24oaXQpe1xyXG4gICAgICByZXR1cm4gaXNPYmplY3QoaXQpICYmIGdldFByb3RvdHlwZU9mKGl0KSA9PT0gRGljdFtQUk9UT1RZUEVdO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgXHJcbiAgaWYoUkVGRVJFTkNFX0dFVClmb3IodmFyIGtleSBpbiBkaWN0TWV0aG9kcykhZnVuY3Rpb24oZm4pe1xyXG4gICAgZnVuY3Rpb24gbWV0aG9kKCl7XHJcbiAgICAgIGZvcih2YXIgYXJncyA9IFt0aGlzXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOylhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xyXG4gICAgICByZXR1cm4gaW52b2tlKGZuLCBhcmdzKTtcclxuICAgIH1cclxuICAgIGZuW1JFRkVSRU5DRV9HRVRdID0gZnVuY3Rpb24oKXtcclxuICAgICAgcmV0dXJuIG1ldGhvZDtcclxuICAgIH1cclxuICB9KGRpY3RNZXRob2RzW2tleV0pO1xyXG4gIFxyXG4gICRkZWZpbmUoR0xPQkFMICsgRk9SQ0VELCB7RGljdDogYXNzaWduSGlkZGVuKERpY3QsIGRpY3RNZXRob2RzKX0pO1xyXG59KCdEaWN0Jyk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvcmUuJGZvciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbihFTlRSSUVTLCBGTil7ICBcclxuICBmdW5jdGlvbiAkZm9yKGl0ZXJhYmxlLCBlbnRyaWVzKXtcclxuICAgIGlmKCEodGhpcyBpbnN0YW5jZW9mICRmb3IpKXJldHVybiBuZXcgJGZvcihpdGVyYWJsZSwgZW50cmllcyk7XHJcbiAgICB0aGlzW0lURVJdICAgID0gZ2V0SXRlcmF0b3IoaXRlcmFibGUpO1xyXG4gICAgdGhpc1tFTlRSSUVTXSA9ICEhZW50cmllcztcclxuICB9XHJcbiAgXHJcbiAgY3JlYXRlSXRlcmF0b3IoJGZvciwgJ1dyYXBwZXInLCBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXNbSVRFUl0ubmV4dCgpO1xyXG4gIH0pO1xyXG4gIHZhciAkZm9yUHJvdG8gPSAkZm9yW1BST1RPVFlQRV07XHJcbiAgc2V0SXRlcmF0b3IoJGZvclByb3RvLCBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXNbSVRFUl07IC8vIHVud3JhcFxyXG4gIH0pO1xyXG4gIFxyXG4gIGZ1bmN0aW9uIGNyZWF0ZUNoYWluSXRlcmF0b3IobmV4dCl7XHJcbiAgICBmdW5jdGlvbiBJdGVyKEksIGZuLCB0aGF0KXtcclxuICAgICAgdGhpc1tJVEVSXSAgICA9IGdldEl0ZXJhdG9yKEkpO1xyXG4gICAgICB0aGlzW0VOVFJJRVNdID0gSVtFTlRSSUVTXTtcclxuICAgICAgdGhpc1tGTl0gICAgICA9IGN0eChmbiwgdGhhdCwgSVtFTlRSSUVTXSA/IDIgOiAxKTtcclxuICAgIH1cclxuICAgIGNyZWF0ZUl0ZXJhdG9yKEl0ZXIsICdDaGFpbicsIG5leHQsICRmb3JQcm90byk7XHJcbiAgICBzZXRJdGVyYXRvcihJdGVyW1BST1RPVFlQRV0sIHJldHVyblRoaXMpOyAvLyBvdmVycmlkZSAkZm9yUHJvdG8gaXRlcmF0b3JcclxuICAgIHJldHVybiBJdGVyO1xyXG4gIH1cclxuICBcclxuICB2YXIgTWFwSXRlciA9IGNyZWF0ZUNoYWluSXRlcmF0b3IoZnVuY3Rpb24oKXtcclxuICAgIHZhciBzdGVwID0gdGhpc1tJVEVSXS5uZXh0KCk7XHJcbiAgICByZXR1cm4gc3RlcC5kb25lID8gc3RlcCA6IGl0ZXJSZXN1bHQoMCwgc3RlcENhbGwodGhpc1tGTl0sIHN0ZXAudmFsdWUsIHRoaXNbRU5UUklFU10pKTtcclxuICB9KTtcclxuICBcclxuICB2YXIgRmlsdGVySXRlciA9IGNyZWF0ZUNoYWluSXRlcmF0b3IoZnVuY3Rpb24oKXtcclxuICAgIGZvcig7Oyl7XHJcbiAgICAgIHZhciBzdGVwID0gdGhpc1tJVEVSXS5uZXh0KCk7XHJcbiAgICAgIGlmKHN0ZXAuZG9uZSB8fCBzdGVwQ2FsbCh0aGlzW0ZOXSwgc3RlcC52YWx1ZSwgdGhpc1tFTlRSSUVTXSkpcmV0dXJuIHN0ZXA7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgXHJcbiAgYXNzaWduSGlkZGVuKCRmb3JQcm90bywge1xyXG4gICAgb2Y6IGZ1bmN0aW9uKGZuLCB0aGF0KXtcclxuICAgICAgZm9yT2YodGhpcywgdGhpc1tFTlRSSUVTXSwgZm4sIHRoYXQpO1xyXG4gICAgfSxcclxuICAgIGFycmF5OiBmdW5jdGlvbihmbiwgdGhhdCl7XHJcbiAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgZm9yT2YoZm4gIT0gdW5kZWZpbmVkID8gdGhpcy5tYXAoZm4sIHRoYXQpIDogdGhpcywgZmFsc2UsIHB1c2gsIHJlc3VsdCk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9LFxyXG4gICAgZmlsdGVyOiBmdW5jdGlvbihmbiwgdGhhdCl7XHJcbiAgICAgIHJldHVybiBuZXcgRmlsdGVySXRlcih0aGlzLCBmbiwgdGhhdCk7XHJcbiAgICB9LFxyXG4gICAgbWFwOiBmdW5jdGlvbihmbiwgdGhhdCl7XHJcbiAgICAgIHJldHVybiBuZXcgTWFwSXRlcih0aGlzLCBmbiwgdGhhdCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgXHJcbiAgJGZvci5pc0l0ZXJhYmxlICA9IGlzSXRlcmFibGU7XHJcbiAgJGZvci5nZXRJdGVyYXRvciA9IGdldEl0ZXJhdG9yO1xyXG4gIFxyXG4gICRkZWZpbmUoR0xPQkFMICsgRk9SQ0VELCB7JGZvcjogJGZvcn0pO1xyXG59KCdlbnRyaWVzJywgc2FmZVN5bWJvbCgnZm4nKSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvcmUuZGVsYXkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIGh0dHBzOi8vZXNkaXNjdXNzLm9yZy90b3BpYy9wcm9taXNlLXJldHVybmluZy1kZWxheS1mdW5jdGlvblxyXG4kZGVmaW5lKEdMT0JBTCArIEZPUkNFRCwge1xyXG4gIGRlbGF5OiBmdW5jdGlvbih0aW1lKXtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKXtcclxuICAgICAgc2V0VGltZW91dChyZXNvbHZlLCB0aW1lLCB0cnVlKTtcclxuICAgIH0pO1xyXG4gIH1cclxufSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvcmUuYmluZGluZyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbihfLCB0b0xvY2FsZVN0cmluZyl7XHJcbiAgLy8gUGxhY2Vob2xkZXJcclxuICBjb3JlLl8gPSBwYXRoLl8gPSBwYXRoLl8gfHwge307XHJcblxyXG4gICRkZWZpbmUoUFJPVE8gKyBGT1JDRUQsIEZVTkNUSU9OLCB7XHJcbiAgICBwYXJ0OiBwYXJ0LFxyXG4gICAgb25seTogZnVuY3Rpb24obnVtYmVyQXJndW1lbnRzLCB0aGF0IC8qID0gQCAqLyl7XHJcbiAgICAgIHZhciBmbiAgICAgPSBhc3NlcnRGdW5jdGlvbih0aGlzKVxyXG4gICAgICAgICwgbiAgICAgID0gdG9MZW5ndGgobnVtYmVyQXJndW1lbnRzKVxyXG4gICAgICAgICwgaXNUaGF0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDE7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcclxuICAgICAgICB2YXIgbGVuZ3RoID0gbWluKG4sIGFyZ3VtZW50cy5sZW5ndGgpXHJcbiAgICAgICAgICAsIGFyZ3MgICA9IEFycmF5KGxlbmd0aClcclxuICAgICAgICAgICwgaSAgICAgID0gMDtcclxuICAgICAgICB3aGlsZShsZW5ndGggPiBpKWFyZ3NbaV0gPSBhcmd1bWVudHNbaSsrXTtcclxuICAgICAgICByZXR1cm4gaW52b2tlKGZuLCBhcmdzLCBpc1RoYXQgPyB0aGF0IDogdGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuICBcclxuICBmdW5jdGlvbiB0aWUoa2V5KXtcclxuICAgIHZhciB0aGF0ICA9IHRoaXNcclxuICAgICAgLCBib3VuZCA9IHt9O1xyXG4gICAgcmV0dXJuIGhpZGRlbih0aGF0LCBfLCBmdW5jdGlvbihrZXkpe1xyXG4gICAgICBpZihrZXkgPT09IHVuZGVmaW5lZCB8fCAhKGtleSBpbiB0aGF0KSlyZXR1cm4gdG9Mb2NhbGVTdHJpbmcuY2FsbCh0aGF0KTtcclxuICAgICAgcmV0dXJuIGhhcyhib3VuZCwga2V5KSA/IGJvdW5kW2tleV0gOiAoYm91bmRba2V5XSA9IGN0eCh0aGF0W2tleV0sIHRoYXQsIC0xKSk7XHJcbiAgICB9KVtfXShrZXkpO1xyXG4gIH1cclxuICBcclxuICBoaWRkZW4ocGF0aC5fLCBUT19TVFJJTkcsIGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gXztcclxuICB9KTtcclxuICBcclxuICBoaWRkZW4oT2JqZWN0UHJvdG8sIF8sIHRpZSk7XHJcbiAgREVTQyB8fCBoaWRkZW4oQXJyYXlQcm90bywgXywgdGllKTtcclxuICAvLyBJRTgtIGRpcnR5IGhhY2sgLSByZWRlZmluZWQgdG9Mb2NhbGVTdHJpbmcgaXMgbm90IGVudW1lcmFibGVcclxufShERVNDID8gdWlkKCd0aWUnKSA6IFRPX0xPQ0FMRSwgT2JqZWN0UHJvdG9bVE9fTE9DQUxFXSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvcmUub2JqZWN0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbigpe1xyXG4gIGZ1bmN0aW9uIGRlZmluZSh0YXJnZXQsIG1peGluKXtcclxuICAgIHZhciBrZXlzICAgPSBvd25LZXlzKHRvT2JqZWN0KG1peGluKSlcclxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxyXG4gICAgICAsIGkgPSAwLCBrZXk7XHJcbiAgICB3aGlsZShsZW5ndGggPiBpKWRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5ID0ga2V5c1tpKytdLCBnZXRPd25EZXNjcmlwdG9yKG1peGluLCBrZXkpKTtcclxuICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgfTtcclxuICAkZGVmaW5lKFNUQVRJQyArIEZPUkNFRCwgT0JKRUNULCB7XHJcbiAgICBpc09iamVjdDogaXNPYmplY3QsXHJcbiAgICBjbGFzc29mOiBjbGFzc29mLFxyXG4gICAgZGVmaW5lOiBkZWZpbmUsXHJcbiAgICBtYWtlOiBmdW5jdGlvbihwcm90bywgbWl4aW4pe1xyXG4gICAgICByZXR1cm4gZGVmaW5lKGNyZWF0ZShwcm90byksIG1peGluKTtcclxuICAgIH1cclxuICB9KTtcclxufSgpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb3JlLmFycmF5ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4kZGVmaW5lKFBST1RPICsgRk9SQ0VELCBBUlJBWSwge1xyXG4gIHR1cm46IGZ1bmN0aW9uKGZuLCB0YXJnZXQgLyogPSBbXSAqLyl7XHJcbiAgICBhc3NlcnRGdW5jdGlvbihmbik7XHJcbiAgICB2YXIgbWVtbyAgID0gdGFyZ2V0ID09IHVuZGVmaW5lZCA/IFtdIDogT2JqZWN0KHRhcmdldClcclxuICAgICAgLCBPICAgICAgPSBFUzVPYmplY3QodGhpcylcclxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcclxuICAgICAgLCBpbmRleCAgPSAwO1xyXG4gICAgd2hpbGUobGVuZ3RoID4gaW5kZXgpaWYoZm4obWVtbywgT1tpbmRleF0sIGluZGV4KyssIHRoaXMpID09PSBmYWxzZSlicmVhaztcclxuICAgIHJldHVybiBtZW1vO1xyXG4gIH1cclxufSk7XHJcbmlmKGZyYW1ld29yaylBcnJheVVuc2NvcGFibGVzLnR1cm4gPSB0cnVlO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb3JlLm51bWJlciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24obnVtYmVyTWV0aG9kcyl7ICBcclxuICBmdW5jdGlvbiBOdW1iZXJJdGVyYXRvcihpdGVyYXRlZCl7XHJcbiAgICBzZXQodGhpcywgSVRFUiwge2w6IHRvTGVuZ3RoKGl0ZXJhdGVkKSwgaTogMH0pO1xyXG4gIH1cclxuICBjcmVhdGVJdGVyYXRvcihOdW1iZXJJdGVyYXRvciwgTlVNQkVSLCBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGl0ZXIgPSB0aGlzW0lURVJdXHJcbiAgICAgICwgaSAgICA9IGl0ZXIuaSsrO1xyXG4gICAgcmV0dXJuIGkgPCBpdGVyLmwgPyBpdGVyUmVzdWx0KDAsIGkpIDogaXRlclJlc3VsdCgxKTtcclxuICB9KTtcclxuICBkZWZpbmVJdGVyYXRvcihOdW1iZXIsIE5VTUJFUiwgZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBuZXcgTnVtYmVySXRlcmF0b3IodGhpcyk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgbnVtYmVyTWV0aG9kcy5yYW5kb20gPSBmdW5jdGlvbihsaW0gLyogPSAwICovKXtcclxuICAgIHZhciBhID0gK3RoaXNcclxuICAgICAgLCBiID0gbGltID09IHVuZGVmaW5lZCA/IDAgOiArbGltXHJcbiAgICAgICwgbSA9IG1pbihhLCBiKTtcclxuICAgIHJldHVybiByYW5kb20oKSAqIChtYXgoYSwgYikgLSBtKSArIG07XHJcbiAgfTtcclxuXHJcbiAgZm9yRWFjaC5jYWxsKGFycmF5KFxyXG4gICAgICAvLyBFUzM6XHJcbiAgICAgICdyb3VuZCxmbG9vcixjZWlsLGFicyxzaW4sYXNpbixjb3MsYWNvcyx0YW4sYXRhbixleHAsc3FydCxtYXgsbWluLHBvdyxhdGFuMiwnICtcclxuICAgICAgLy8gRVM2OlxyXG4gICAgICAnYWNvc2gsYXNpbmgsYXRhbmgsY2JydCxjbHozMixjb3NoLGV4cG0xLGh5cG90LGltdWwsbG9nMXAsbG9nMTAsbG9nMixzaWduLHNpbmgsdGFuaCx0cnVuYydcclxuICAgICksIGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIHZhciBmbiA9IE1hdGhba2V5XTtcclxuICAgICAgaWYoZm4pbnVtYmVyTWV0aG9kc1trZXldID0gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XHJcbiAgICAgICAgLy8gaWU5LSBkb250IHN1cHBvcnQgc3RyaWN0IG1vZGUgJiBjb252ZXJ0IGB0aGlzYCB0byBvYmplY3QgLT4gY29udmVydCBpdCB0byBudW1iZXJcclxuICAgICAgICB2YXIgYXJncyA9IFsrdGhpc11cclxuICAgICAgICAgICwgaSAgICA9IDA7XHJcbiAgICAgICAgd2hpbGUoYXJndW1lbnRzLmxlbmd0aCA+IGkpYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcclxuICAgICAgICByZXR1cm4gaW52b2tlKGZuLCBhcmdzKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICk7XHJcbiAgXHJcbiAgJGRlZmluZShQUk9UTyArIEZPUkNFRCwgTlVNQkVSLCBudW1iZXJNZXRob2RzKTtcclxufSh7fSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvcmUuc3RyaW5nICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbigpe1xyXG4gIHZhciBlc2NhcGVIVE1MRGljdCA9IHtcclxuICAgICcmJzogJyZhbXA7JyxcclxuICAgICc8JzogJyZsdDsnLFxyXG4gICAgJz4nOiAnJmd0OycsXHJcbiAgICAnXCInOiAnJnF1b3Q7JyxcclxuICAgIFwiJ1wiOiAnJmFwb3M7J1xyXG4gIH0sIHVuZXNjYXBlSFRNTERpY3QgPSB7fSwga2V5O1xyXG4gIGZvcihrZXkgaW4gZXNjYXBlSFRNTERpY3QpdW5lc2NhcGVIVE1MRGljdFtlc2NhcGVIVE1MRGljdFtrZXldXSA9IGtleTtcclxuICAkZGVmaW5lKFBST1RPICsgRk9SQ0VELCBTVFJJTkcsIHtcclxuICAgIGVzY2FwZUhUTUw6ICAgY3JlYXRlUmVwbGFjZXIoL1smPD5cIiddL2csIGVzY2FwZUhUTUxEaWN0KSxcclxuICAgIHVuZXNjYXBlSFRNTDogY3JlYXRlUmVwbGFjZXIoLyYoPzphbXB8bHR8Z3R8cXVvdHxhcG9zKTsvZywgdW5lc2NhcGVIVE1MRGljdClcclxuICB9KTtcclxufSgpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb3JlLmRhdGUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oZm9ybWF0UmVnRXhwLCBmbGV4aW9SZWdFeHAsIGxvY2FsZXMsIGN1cnJlbnQsIFNFQ09ORFMsIE1JTlVURVMsIEhPVVJTLCBNT05USCwgWUVBUil7XHJcbiAgZnVuY3Rpb24gY3JlYXRlRm9ybWF0KHByZWZpeCl7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24odGVtcGxhdGUsIGxvY2FsZSAvKiA9IGN1cnJlbnQgKi8pe1xyXG4gICAgICB2YXIgdGhhdCA9IHRoaXNcclxuICAgICAgICAsIGRpY3QgPSBsb2NhbGVzW2hhcyhsb2NhbGVzLCBsb2NhbGUpID8gbG9jYWxlIDogY3VycmVudF07XHJcbiAgICAgIGZ1bmN0aW9uIGdldCh1bml0KXtcclxuICAgICAgICByZXR1cm4gdGhhdFtwcmVmaXggKyB1bml0XSgpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBTdHJpbmcodGVtcGxhdGUpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbihwYXJ0KXtcclxuICAgICAgICBzd2l0Y2gocGFydCl7XHJcbiAgICAgICAgICBjYXNlICdzJyAgOiByZXR1cm4gZ2V0KFNFQ09ORFMpOyAgICAgICAgICAgICAgICAgIC8vIFNlY29uZHMgOiAwLTU5XHJcbiAgICAgICAgICBjYXNlICdzcycgOiByZXR1cm4gbHooZ2V0KFNFQ09ORFMpKTsgICAgICAgICAgICAgIC8vIFNlY29uZHMgOiAwMC01OVxyXG4gICAgICAgICAgY2FzZSAnbScgIDogcmV0dXJuIGdldChNSU5VVEVTKTsgICAgICAgICAgICAgICAgICAvLyBNaW51dGVzIDogMC01OVxyXG4gICAgICAgICAgY2FzZSAnbW0nIDogcmV0dXJuIGx6KGdldChNSU5VVEVTKSk7ICAgICAgICAgICAgICAvLyBNaW51dGVzIDogMDAtNTlcclxuICAgICAgICAgIGNhc2UgJ2gnICA6IHJldHVybiBnZXQoSE9VUlMpOyAgICAgICAgICAgICAgICAgICAgLy8gSG91cnMgICA6IDAtMjNcclxuICAgICAgICAgIGNhc2UgJ2hoJyA6IHJldHVybiBseihnZXQoSE9VUlMpKTsgICAgICAgICAgICAgICAgLy8gSG91cnMgICA6IDAwLTIzXHJcbiAgICAgICAgICBjYXNlICdEJyAgOiByZXR1cm4gZ2V0KERBVEUpOyAgICAgICAgICAgICAgICAgICAgIC8vIERhdGUgICAgOiAxLTMxXHJcbiAgICAgICAgICBjYXNlICdERCcgOiByZXR1cm4gbHooZ2V0KERBVEUpKTsgICAgICAgICAgICAgICAgIC8vIERhdGUgICAgOiAwMS0zMVxyXG4gICAgICAgICAgY2FzZSAnVycgIDogcmV0dXJuIGRpY3RbMF1bZ2V0KCdEYXknKV07ICAgICAgICAgICAvLyBEYXkgICAgIDog0J/QvtC90LXQtNC10LvRjNC90LjQulxyXG4gICAgICAgICAgY2FzZSAnTicgIDogcmV0dXJuIGdldChNT05USCkgKyAxOyAgICAgICAgICAgICAgICAvLyBNb250aCAgIDogMS0xMlxyXG4gICAgICAgICAgY2FzZSAnTk4nIDogcmV0dXJuIGx6KGdldChNT05USCkgKyAxKTsgICAgICAgICAgICAvLyBNb250aCAgIDogMDEtMTJcclxuICAgICAgICAgIGNhc2UgJ00nICA6IHJldHVybiBkaWN0WzJdW2dldChNT05USCldOyAgICAgICAgICAgLy8gTW9udGggICA6INCv0L3QstCw0YDRjFxyXG4gICAgICAgICAgY2FzZSAnTU0nIDogcmV0dXJuIGRpY3RbMV1bZ2V0KE1PTlRIKV07ICAgICAgICAgICAvLyBNb250aCAgIDog0K/QvdCy0LDRgNGPXHJcbiAgICAgICAgICBjYXNlICdZJyAgOiByZXR1cm4gZ2V0KFlFQVIpOyAgICAgICAgICAgICAgICAgICAgIC8vIFllYXIgICAgOiAyMDE0XHJcbiAgICAgICAgICBjYXNlICdZWScgOiByZXR1cm4gbHooZ2V0KFlFQVIpICUgMTAwKTsgICAgICAgICAgIC8vIFllYXIgICAgOiAxNFxyXG4gICAgICAgIH0gcmV0dXJuIHBhcnQ7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICBmdW5jdGlvbiBhZGRMb2NhbGUobGFuZywgbG9jYWxlKXtcclxuICAgIGZ1bmN0aW9uIHNwbGl0KGluZGV4KXtcclxuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICBmb3JFYWNoLmNhbGwoYXJyYXkobG9jYWxlLm1vbnRocyksIGZ1bmN0aW9uKGl0KXtcclxuICAgICAgICByZXN1bHQucHVzaChpdC5yZXBsYWNlKGZsZXhpb1JlZ0V4cCwgJyQnICsgaW5kZXgpKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBsb2NhbGVzW2xhbmddID0gW2FycmF5KGxvY2FsZS53ZWVrZGF5cyksIHNwbGl0KDEpLCBzcGxpdCgyKV07XHJcbiAgICByZXR1cm4gY29yZTtcclxuICB9XHJcbiAgJGRlZmluZShQUk9UTyArIEZPUkNFRCwgREFURSwge1xyXG4gICAgZm9ybWF0OiAgICBjcmVhdGVGb3JtYXQoJ2dldCcpLFxyXG4gICAgZm9ybWF0VVRDOiBjcmVhdGVGb3JtYXQoJ2dldFVUQycpXHJcbiAgfSk7XHJcbiAgYWRkTG9jYWxlKGN1cnJlbnQsIHtcclxuICAgIHdlZWtkYXlzOiAnU3VuZGF5LE1vbmRheSxUdWVzZGF5LFdlZG5lc2RheSxUaHVyc2RheSxGcmlkYXksU2F0dXJkYXknLFxyXG4gICAgbW9udGhzOiAnSmFudWFyeSxGZWJydWFyeSxNYXJjaCxBcHJpbCxNYXksSnVuZSxKdWx5LEF1Z3VzdCxTZXB0ZW1iZXIsT2N0b2JlcixOb3ZlbWJlcixEZWNlbWJlcidcclxuICB9KTtcclxuICBhZGRMb2NhbGUoJ3J1Jywge1xyXG4gICAgd2Vla2RheXM6ICfQktC+0YHQutGA0LXRgdC10L3RjNC1LNCf0L7QvdC10LTQtdC70YzQvdC40Los0JLRgtC+0YDQvdC40Los0KHRgNC10LTQsCzQp9C10YLQstC10YDQsyzQn9GP0YLQvdC40YbQsCzQodGD0LHQsdC+0YLQsCcsXHJcbiAgICBtb250aHM6ICfQr9C90LLQsNGAOtGPfNGMLNCk0LXQstGA0LDQuzrRj3zRjCzQnNCw0YDRgjrQsHws0JDQv9GA0LXQuzrRj3zRjCzQnNCwOtGPfNC5LNCY0Y7QvTrRj3zRjCwnICtcclxuICAgICAgICAgICAgJ9CY0Y7QuzrRj3zRjCzQkNCy0LPRg9GB0YI60LB8LNCh0LXQvdGC0Y/QsdGAOtGPfNGMLNCe0LrRgtGP0LHRgDrRj3zRjCzQndC+0Y/QsdGAOtGPfNGMLNCU0LXQutCw0LHRgDrRj3zRjCdcclxuICB9KTtcclxuICBjb3JlLmxvY2FsZSA9IGZ1bmN0aW9uKGxvY2FsZSl7XHJcbiAgICByZXR1cm4gaGFzKGxvY2FsZXMsIGxvY2FsZSkgPyBjdXJyZW50ID0gbG9jYWxlIDogY3VycmVudDtcclxuICB9O1xyXG4gIGNvcmUuYWRkTG9jYWxlID0gYWRkTG9jYWxlO1xyXG59KC9cXGJcXHdcXHc/XFxiL2csIC86KC4qKVxcfCguKikkLywge30sICdlbicsICdTZWNvbmRzJywgJ01pbnV0ZXMnLCAnSG91cnMnLCAnTW9udGgnLCAnRnVsbFllYXInKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogY29yZS5nbG9iYWwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuJGRlZmluZShHTE9CQUwgKyBGT1JDRUQsIHtnbG9iYWw6IGdsb2JhbH0pO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBqcy5hcnJheS5zdGF0aWNzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBKYXZhU2NyaXB0IDEuNiAvIFN0cmF3bWFuIGFycmF5IHN0YXRpY3Mgc2hpbVxyXG4hZnVuY3Rpb24oYXJyYXlTdGF0aWNzKXtcclxuICBmdW5jdGlvbiBzZXRBcnJheVN0YXRpY3Moa2V5cywgbGVuZ3RoKXtcclxuICAgIGZvckVhY2guY2FsbChhcnJheShrZXlzKSwgZnVuY3Rpb24oa2V5KXtcclxuICAgICAgaWYoa2V5IGluIEFycmF5UHJvdG8pYXJyYXlTdGF0aWNzW2tleV0gPSBjdHgoY2FsbCwgQXJyYXlQcm90b1trZXldLCBsZW5ndGgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHNldEFycmF5U3RhdGljcygncG9wLHJldmVyc2Usc2hpZnQsa2V5cyx2YWx1ZXMsZW50cmllcycsIDEpO1xyXG4gIHNldEFycmF5U3RhdGljcygnaW5kZXhPZixldmVyeSxzb21lLGZvckVhY2gsbWFwLGZpbHRlcixmaW5kLGZpbmRJbmRleCxpbmNsdWRlcycsIDMpO1xyXG4gIHNldEFycmF5U3RhdGljcygnam9pbixzbGljZSxjb25jYXQscHVzaCxzcGxpY2UsdW5zaGlmdCxzb3J0LGxhc3RJbmRleE9mLCcgK1xyXG4gICAgICAgICAgICAgICAgICAncmVkdWNlLHJlZHVjZVJpZ2h0LGNvcHlXaXRoaW4sZmlsbCx0dXJuJyk7XHJcbiAgJGRlZmluZShTVEFUSUMsIEFSUkFZLCBhcnJheVN0YXRpY3MpO1xyXG59KHt9KTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogd2ViLmRvbS5pdGFyYWJsZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKE5vZGVMaXN0KXtcclxuICBpZihmcmFtZXdvcmsgJiYgTm9kZUxpc3QgJiYgIShTWU1CT0xfSVRFUkFUT1IgaW4gTm9kZUxpc3RbUFJPVE9UWVBFXSkpe1xyXG4gICAgaGlkZGVuKE5vZGVMaXN0W1BST1RPVFlQRV0sIFNZTUJPTF9JVEVSQVRPUiwgSXRlcmF0b3JzW0FSUkFZXSk7XHJcbiAgfVxyXG4gIEl0ZXJhdG9ycy5Ob2RlTGlzdCA9IEl0ZXJhdG9yc1tBUlJBWV07XHJcbn0oZ2xvYmFsLk5vZGVMaXN0KTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogY29yZS5sb2cgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKGxvZywgZW5hYmxlZCl7XHJcbiAgLy8gTWV0aG9kcyBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9EZXZlbG9wZXJUb29sc1dHL2NvbnNvbGUtb2JqZWN0L2Jsb2IvbWFzdGVyL2FwaS5tZFxyXG4gIGZvckVhY2guY2FsbChhcnJheSgnYXNzZXJ0LGNsZWFyLGNvdW50LGRlYnVnLGRpcixkaXJ4bWwsZXJyb3IsZXhjZXB0aW9uLCcgK1xyXG4gICAgICAnZ3JvdXAsZ3JvdXBDb2xsYXBzZWQsZ3JvdXBFbmQsaW5mbyxpc0luZGVwZW5kZW50bHlDb21wb3NlZCxsb2csJyArXHJcbiAgICAgICdtYXJrVGltZWxpbmUscHJvZmlsZSxwcm9maWxlRW5kLHRhYmxlLHRpbWUsdGltZUVuZCx0aW1lbGluZSwnICtcclxuICAgICAgJ3RpbWVsaW5lRW5kLHRpbWVTdGFtcCx0cmFjZSx3YXJuJyksIGZ1bmN0aW9uKGtleSl7XHJcbiAgICBsb2dba2V5XSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgIGlmKGVuYWJsZWQgJiYga2V5IGluIGNvbnNvbGUpcmV0dXJuIGFwcGx5LmNhbGwoY29uc29sZVtrZXldLCBjb25zb2xlLCBhcmd1bWVudHMpO1xyXG4gICAgfTtcclxuICB9KTtcclxuICAkZGVmaW5lKEdMT0JBTCArIEZPUkNFRCwge2xvZzogYXNzaWduKGxvZy5sb2csIGxvZywge1xyXG4gICAgZW5hYmxlOiBmdW5jdGlvbigpe1xyXG4gICAgICBlbmFibGVkID0gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICBkaXNhYmxlOiBmdW5jdGlvbigpe1xyXG4gICAgICBlbmFibGVkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfSl9KTtcclxufSh7fSwgdHJ1ZSk7XG59KHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PT0gTWF0aCA/IHNlbGYgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpLCBmYWxzZSk7XG5tb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IG1vZHVsZS5leHBvcnRzLCBfX2VzTW9kdWxlOiB0cnVlIH07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSAoZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gcHJvcHMpIHtcbiAgICAgIHZhciBwcm9wID0gcHJvcHNba2V5XTtcbiAgICAgIHByb3AuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgIGlmIChwcm9wLnZhbHVlKSBwcm9wLndyaXRhYmxlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gIH07XG59KSgpO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IChmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCByYXdQcm9wcykge1xuICAgIHZhciBwcm9wcyA9IHt9O1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYXdQcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHByb3AgPSByYXdQcm9wc1tpXTtcbiAgICAgIHByb3AuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgIGlmIChwcm9wLnZhbHVlKSBwcm9wLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgIHByb3BzW3Byb3Aua2V5XSA9IHByb3A7XG4gICAgfVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcyk7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9O1xufSkoKTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9jb3JlID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qc1wiKVtcImRlZmF1bHRcIl07XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZnVuY3Rpb24gZ2V0KF94LCBfeDIsIF94Mykge1xuICB2YXIgX2FnYWluID0gdHJ1ZTtcblxuICBfZnVuY3Rpb246IHdoaWxlIChfYWdhaW4pIHtcbiAgICBfYWdhaW4gPSBmYWxzZTtcbiAgICB2YXIgb2JqZWN0ID0gX3gsXG4gICAgICAgIHByb3BlcnR5ID0gX3gyLFxuICAgICAgICByZWNlaXZlciA9IF94MztcbiAgICBkZXNjID0gcGFyZW50ID0gZ2V0dGVyID0gdW5kZWZpbmVkO1xuXG4gICAgdmFyIGRlc2MgPSBfY29yZS5PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpO1xuXG4gICAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIHBhcmVudCA9IF9jb3JlLk9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuXG4gICAgICBpZiAocGFyZW50ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfeCA9IHBhcmVudDtcbiAgICAgICAgX3gyID0gcHJvcGVydHk7XG4gICAgICAgIF94MyA9IHJlY2VpdmVyO1xuICAgICAgICBfYWdhaW4gPSB0cnVlO1xuICAgICAgICBjb250aW51ZSBfZnVuY3Rpb247XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcInZhbHVlXCIgaW4gZGVzYyAmJiBkZXNjLndyaXRhYmxlKSB7XG4gICAgICByZXR1cm4gZGVzYy52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGdldHRlciA9IGRlc2MuZ2V0O1xuXG4gICAgICBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGdldHRlci5jYWxsKHJlY2VpdmVyKTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTtcbiAgfVxuXG4gIHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG59O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9ialtcImRlZmF1bHRcIl0gOiBvYmo7XG59O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2NvcmUgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzXCIpW1wiZGVmYXVsdFwiXTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBhcnIyW2ldID0gYXJyW2ldO1xuXG4gICAgcmV0dXJuIGFycjI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIF9jb3JlLkFycmF5LmZyb20oYXJyKTtcbiAgfVxufTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vLyBUaGlzIG1ldGhvZCBvZiBvYnRhaW5pbmcgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QgbmVlZHMgdG8gYmVcbi8vIGtlcHQgaWRlbnRpY2FsIHRvIHRoZSB3YXkgaXQgaXMgb2J0YWluZWQgaW4gcnVudGltZS5qc1xudmFyIGcgPVxuICB0eXBlb2YgZ2xvYmFsID09PSBcIm9iamVjdFwiID8gZ2xvYmFsIDpcbiAgdHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIiA/IHdpbmRvdyA6IHRoaXM7XG5cbnZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIGhhZFJ1bnRpbWUgPSBoYXNPd24uY2FsbChnLCBcInJlZ2VuZXJhdG9yUnVudGltZVwiKTtcbnZhciBvbGRSdW50aW1lID0gaGFkUnVudGltZSAmJiBnLnJlZ2VuZXJhdG9yUnVudGltZTtcbmRlbGV0ZSBnLnJlZ2VuZXJhdG9yUnVudGltZTsgLy8gRm9yY2UgcmVldmFsdXRhdGlvbiBvZiBydW50aW1lLmpzLlxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL3J1bnRpbWVcIik7XG5cbmlmIChoYWRSdW50aW1lKSB7XG4gIC8vIFJlc3RvcmUgdGhlIG9yaWdpbmFsIHJ1bnRpbWUuXG4gIGcucmVnZW5lcmF0b3JSdW50aW1lID0gb2xkUnVudGltZTtcbn0gZWxzZSB7XG4gIC8vIFJlbW92ZSB0aGUgZ2xvYmFsIHByb3BlcnR5IGFkZGVkIGJ5IHJ1bnRpbWUuanMuXG4gIGRlbGV0ZSBnLnJlZ2VuZXJhdG9yUnVudGltZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiBtb2R1bGUuZXhwb3J0cywgX19lc01vZHVsZTogdHJ1ZSB9O1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlpWVdKbGJDMXlkVzUwYVcxbEwzSmxaMlZ1WlhKaGRHOXlMMmx1WkdWNExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdRVUZCUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQklpd2labWxzWlNJNkltZGxibVZ5WVhSbFpDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2THlCVWFHbHpJRzFsZEdodlpDQnZaaUJ2WW5SaGFXNXBibWNnWVNCeVpXWmxjbVZ1WTJVZ2RHOGdkR2hsSUdkc2IySmhiQ0J2WW1wbFkzUWdibVZsWkhNZ2RHOGdZbVZjYmk4dklHdGxjSFFnYVdSbGJuUnBZMkZzSUhSdklIUm9aU0IzWVhrZ2FYUWdhWE1nYjJKMFlXbHVaV1FnYVc0Z2NuVnVkR2x0WlM1cWMxeHVkbUZ5SUdjZ1BWeHVJQ0IwZVhCbGIyWWdaMnh2WW1Gc0lEMDlQU0JjSW05aWFtVmpkRndpSUQ4Z1oyeHZZbUZzSURwY2JpQWdkSGx3Wlc5bUlIZHBibVJ2ZHlBOVBUMGdYQ0p2WW1wbFkzUmNJaUEvSUhkcGJtUnZkeUE2SUhSb2FYTTdYRzVjYm5aaGNpQm9ZWE5QZDI0Z1BTQlBZbXBsWTNRdWNISnZkRzkwZVhCbExtaGhjMDkzYmxCeWIzQmxjblI1TzF4dWRtRnlJR2hoWkZKMWJuUnBiV1VnUFNCb1lYTlBkMjR1WTJGc2JDaG5MQ0JjSW5KbFoyVnVaWEpoZEc5eVVuVnVkR2x0WlZ3aUtUdGNiblpoY2lCdmJHUlNkVzUwYVcxbElEMGdhR0ZrVW5WdWRHbHRaU0FtSmlCbkxuSmxaMlZ1WlhKaGRHOXlVblZ1ZEdsdFpUdGNibVJsYkdWMFpTQm5MbkpsWjJWdVpYSmhkRzl5VW5WdWRHbHRaVHNnTHk4Z1JtOXlZMlVnY21WbGRtRnNkWFJoZEdsdmJpQnZaaUJ5ZFc1MGFXMWxMbXB6TGx4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlISmxjWFZwY21Vb1hDSXVMM0oxYm5ScGJXVmNJaWs3WEc1Y2JtbG1JQ2hvWVdSU2RXNTBhVzFsS1NCN1hHNGdJQzh2SUZKbGMzUnZjbVVnZEdobElHOXlhV2RwYm1Gc0lISjFiblJwYldVdVhHNGdJR2N1Y21WblpXNWxjbUYwYjNKU2RXNTBhVzFsSUQwZ2IyeGtVblZ1ZEdsdFpUdGNibjBnWld4elpTQjdYRzRnSUM4dklGSmxiVzkyWlNCMGFHVWdaMnh2WW1Gc0lIQnliM0JsY25SNUlHRmtaR1ZrSUdKNUlISjFiblJwYldVdWFuTXVYRzRnSUdSbGJHVjBaU0JuTG5KbFoyVnVaWEpoZEc5eVVuVnVkR2x0WlR0Y2JuMWNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0I3SUZ3aVpHVm1ZWFZzZEZ3aU9pQnRiMlIxYkdVdVpYaHdiM0owY3l3Z1gxOWxjMDF2WkhWc1pUb2dkSEoxWlNCOU8xeHVJbDE5IiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfY29yZSA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanNcIilbXCJkZWZhdWx0XCJdO1xuXG4vKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBodHRwczovL3Jhdy5naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL21hc3Rlci9MSUNFTlNFIGZpbGUuIEFuXG4gKiBhZGRpdGlvbmFsIGdyYW50IG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW5cbiAqIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4hKGZ1bmN0aW9uIChnbG9iYWwpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSB0eXBlb2YgX2NvcmUuU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgX2NvcmUuU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuXG4gIHZhciBpbk1vZHVsZSA9IHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCI7XG4gIHZhciBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZTtcbiAgaWYgKHJ1bnRpbWUpIHtcbiAgICBpZiAoaW5Nb2R1bGUpIHtcbiAgICAgIC8vIElmIHJlZ2VuZXJhdG9yUnVudGltZSBpcyBkZWZpbmVkIGdsb2JhbGx5IGFuZCB3ZSdyZSBpbiBhIG1vZHVsZSxcbiAgICAgIC8vIG1ha2UgdGhlIGV4cG9ydHMgb2JqZWN0IGlkZW50aWNhbCB0byByZWdlbmVyYXRvclJ1bnRpbWUuXG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IHJ1bnRpbWU7XG4gICAgfVxuICAgIC8vIERvbid0IGJvdGhlciBldmFsdWF0aW5nIHRoZSByZXN0IG9mIHRoaXMgZmlsZSBpZiB0aGUgcnVudGltZSB3YXNcbiAgICAvLyBhbHJlYWR5IGRlZmluZWQgZ2xvYmFsbHkuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRGVmaW5lIHRoZSBydW50aW1lIGdsb2JhbGx5IChhcyBleHBlY3RlZCBieSBnZW5lcmF0ZWQgY29kZSkgYXMgZWl0aGVyXG4gIC8vIG1vZHVsZS5leHBvcnRzIChpZiB3ZSdyZSBpbiBhIG1vZHVsZSkgb3IgYSBuZXcsIGVtcHR5IG9iamVjdC5cbiAgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWUgPSBpbk1vZHVsZSA/IG1vZHVsZS5leHBvcnRzIDoge307XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIHJldHVybiBuZXcgR2VuZXJhdG9yKGlubmVyRm4sIG91dGVyRm4sIHNlbGYgfHwgbnVsbCwgdHJ5TG9jc0xpc3QgfHwgW10pO1xuICB9XG4gIHJ1bnRpbWUud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9IEdlbmVyYXRvci5wcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uIChnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3IgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiIDogZmFsc2U7XG4gIH07XG5cbiAgcnVudGltZS5tYXJrID0gZnVuY3Rpb24gKGdlbkZ1bikge1xuICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICBydW50aW1lLmFzeW5jID0gZnVuY3Rpb24gKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgcmV0dXJuIG5ldyBfY29yZS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciBnZW5lcmF0b3IgPSB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KTtcbiAgICAgIHZhciBjYWxsTmV4dCA9IHN0ZXAuYmluZChnZW5lcmF0b3IubmV4dCk7XG4gICAgICB2YXIgY2FsbFRocm93ID0gc3RlcC5iaW5kKGdlbmVyYXRvcltcInRocm93XCJdKTtcblxuICAgICAgZnVuY3Rpb24gc3RlcChhcmcpIHtcbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKHRoaXMsIG51bGwsIGFyZyk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcbiAgICAgICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgICAgIHJlc29sdmUoaW5mby52YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX2NvcmUuUHJvbWlzZS5yZXNvbHZlKGluZm8udmFsdWUpLnRoZW4oY2FsbE5leHQsIGNhbGxUaHJvdyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY2FsbE5leHQoKTtcbiAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBHZW5lcmF0b3IoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICB2YXIgZ2VuZXJhdG9yID0gb3V0ZXJGbiA/IE9iamVjdC5jcmVhdGUob3V0ZXJGbi5wcm90b3R5cGUpIDogdGhpcztcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0KTtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZGVsZWdhdGUuaXRlcmF0b3JbbWV0aG9kXSwgZGVsZWdhdGUuaXRlcmF0b3IsIGFyZyk7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgICAgICAgIC8vIExpa2UgcmV0dXJuaW5nIGdlbmVyYXRvci50aHJvdyh1bmNhdWdodCksIGJ1dCB3aXRob3V0IHRoZVxuICAgICAgICAgICAgLy8gb3ZlcmhlYWQgb2YgYW4gZXh0cmEgZnVuY3Rpb24gY2FsbC5cbiAgICAgICAgICAgIG1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICAgIGFyZyA9IHJlY29yZC5hcmc7XG5cbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIERlbGVnYXRlIGdlbmVyYXRvciByYW4gYW5kIGhhbmRsZWQgaXRzIG93biBleGNlcHRpb25zIHNvXG4gICAgICAgICAgLy8gcmVnYXJkbGVzcyBvZiB3aGF0IHRoZSBtZXRob2Qgd2FzLCB3ZSBjb250aW51ZSBhcyBpZiBpdCBpc1xuICAgICAgICAgIC8vIFwibmV4dFwiIHdpdGggYW4gdW5kZWZpbmVkIGFyZy5cbiAgICAgICAgICBtZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG4gICAgICAgICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG4gICAgICAgICAgICByZXR1cm4gaW5mbztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ICYmIHR5cGVvZiBhcmcgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0IHRvIHNlbmQgXCIgKyBKU09OLnN0cmluZ2lmeShhcmcpICsgXCIgdG8gbmV3Ym9ybiBnZW5lcmF0b3JcIik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkKSB7XG4gICAgICAgICAgICBjb250ZXh0LnNlbnQgPSBhcmc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0LnNlbnQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGFyZykpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgICAgbWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZSA/IEdlblN0YXRlQ29tcGxldGVkIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIHZhciBpbmZvID0ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGlmIChjb250ZXh0LmRlbGVnYXRlICYmIG1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbmZvO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcblxuICAgICAgICAgIGlmIChtZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKHJlY29yZC5hcmcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRvci5uZXh0ID0gaW52b2tlLmJpbmQoZ2VuZXJhdG9yLCBcIm5leHRcIik7XG4gICAgZ2VuZXJhdG9yW1widGhyb3dcIl0gPSBpbnZva2UuYmluZChnZW5lcmF0b3IsIFwidGhyb3dcIik7XG4gICAgZ2VuZXJhdG9yW1wicmV0dXJuXCJdID0gaW52b2tlLmJpbmQoZ2VuZXJhdG9yLCBcInJldHVyblwiKTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cblxuICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJ1bnRpbWUua2V5cyA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLFxuICAgICAgICAgICAgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIHJ1bnRpbWUudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIHRoaXMuc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICAvLyBQcmUtaW5pdGlhbGl6ZSBhdCBsZWFzdCAyMCB0ZW1wb3JhcnkgdmFyaWFibGVzIHRvIGVuYWJsZSBoaWRkZW5cbiAgICAgIC8vIGNsYXNzIG9wdGltaXphdGlvbnMgZm9yIHNpbXBsZSBnZW5lcmF0b3JzLlxuICAgICAgZm9yICh2YXIgdGVtcEluZGV4ID0gMCwgdGVtcE5hbWU7IGhhc093bi5jYWxsKHRoaXMsIHRlbXBOYW1lID0gXCJ0XCIgKyB0ZW1wSW5kZXgpIHx8IHRlbXBJbmRleCA8IDIwOyArK3RlbXBJbmRleCkge1xuICAgICAgICB0aGlzW3RlbXBOYW1lXSA9IG51bGw7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uIGRpc3BhdGNoRXhjZXB0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuICAgICAgICByZXR1cm4gISFjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24gYWJydXB0KHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiYgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmICh0eXBlID09PSBcImJyZWFrXCIgfHwgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJiBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJiBhcmcgPCBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uIGNvbXBsZXRlKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8IHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uIGZpbmlzaChmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbiAodHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uIGRlbGVnYXRlWWllbGQoaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG59KShcbi8vIEFtb25nIHRoZSB2YXJpb3VzIHRyaWNrcyBmb3Igb2J0YWluaW5nIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWxcbi8vIG9iamVjdCwgdGhpcyBzZWVtcyB0byBiZSB0aGUgbW9zdCByZWxpYWJsZSB0ZWNobmlxdWUgdGhhdCBkb2VzIG5vdFxuLy8gdXNlIGluZGlyZWN0IGV2YWwgKHdoaWNoIHZpb2xhdGVzIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5KS5cbnR5cGVvZiBnbG9iYWwgPT09IFwib2JqZWN0XCIgPyBnbG9iYWwgOiB0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiID8gd2luZG93IDogdW5kZWZpbmVkKTtcbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW01dlpHVmZiVzlrZFd4bGN5OWlZV0psYkMxeWRXNTBhVzFsTDNKbFoyVnVaWEpoZEc5eUwzSjFiblJwYldVdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqdEJRVUZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFTSXNJbVpwYkdVaU9pSm5aVzVsY21GMFpXUXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpWENKMWMyVWdjM1J5YVdOMFhDSTdYRzVjYm5aaGNpQmZZMjl5WlNBOUlISmxjWFZwY21Vb1hDSmlZV0psYkMxeWRXNTBhVzFsTDJOdmNtVXRhbk5jSWlsYlhDSmtaV1poZFd4MFhDSmRPMXh1WEc0dktpcGNiaUFxSUVOdmNIbHlhV2RvZENBb1l5a2dNakF4TkN3Z1JtRmpaV0p2YjJzc0lFbHVZeTVjYmlBcUlFRnNiQ0J5YVdkb2RITWdjbVZ6WlhKMlpXUXVYRzRnS2x4dUlDb2dWR2hwY3lCemIzVnlZMlVnWTI5a1pTQnBjeUJzYVdObGJuTmxaQ0IxYm1SbGNpQjBhR1VnUWxORUxYTjBlV3hsSUd4cFkyVnVjMlVnWm05MWJtUWdhVzRnZEdobFhHNGdLaUJvZEhSd2N6b3ZMM0poZHk1bmFYUm9kV0l1WTI5dEwyWmhZMlZpYjI5ckwzSmxaMlZ1WlhKaGRHOXlMMjFoYzNSbGNpOU1TVU5GVGxORklHWnBiR1V1SUVGdVhHNGdLaUJoWkdScGRHbHZibUZzSUdkeVlXNTBJRzltSUhCaGRHVnVkQ0J5YVdkb2RITWdZMkZ1SUdKbElHWnZkVzVrSUdsdUlIUm9aU0JRUVZSRlRsUlRJR1pwYkdVZ2FXNWNiaUFxSUhSb1pTQnpZVzFsSUdScGNtVmpkRzl5ZVM1Y2JpQXFMMXh1WEc0aEtHWjFibU4wYVc5dUlDaG5iRzlpWVd3cElIdGNiaUFnWENKMWMyVWdjM1J5YVdOMFhDSTdYRzVjYmlBZ2RtRnlJR2hoYzA5M2JpQTlJRTlpYW1WamRDNXdjbTkwYjNSNWNHVXVhR0Z6VDNkdVVISnZjR1Z5ZEhrN1hHNGdJSFpoY2lCMWJtUmxabWx1WldRN0lDOHZJRTF2Y21VZ1kyOXRjSEpsYzNOcFlteGxJSFJvWVc0Z2RtOXBaQ0F3TGx4dUlDQjJZWElnYVhSbGNtRjBiM0pUZVcxaWIyd2dQU0IwZVhCbGIyWWdYMk52Y21VdVUzbHRZbTlzSUQwOVBTQmNJbVoxYm1OMGFXOXVYQ0lnSmlZZ1gyTnZjbVV1VTNsdFltOXNMbWwwWlhKaGRHOXlJSHg4SUZ3aVFFQnBkR1Z5WVhSdmNsd2lPMXh1WEc0Z0lIWmhjaUJwYmsxdlpIVnNaU0E5SUhSNWNHVnZaaUJ0YjJSMWJHVWdQVDA5SUZ3aWIySnFaV04wWENJN1hHNGdJSFpoY2lCeWRXNTBhVzFsSUQwZ1oyeHZZbUZzTG5KbFoyVnVaWEpoZEc5eVVuVnVkR2x0WlR0Y2JpQWdhV1lnS0hKMWJuUnBiV1VwSUh0Y2JpQWdJQ0JwWmlBb2FXNU5iMlIxYkdVcElIdGNiaUFnSUNBZ0lDOHZJRWxtSUhKbFoyVnVaWEpoZEc5eVVuVnVkR2x0WlNCcGN5QmtaV1pwYm1Wa0lHZHNiMkpoYkd4NUlHRnVaQ0IzWlNkeVpTQnBiaUJoSUcxdlpIVnNaU3hjYmlBZ0lDQWdJQzh2SUcxaGEyVWdkR2hsSUdWNGNHOXlkSE1nYjJKcVpXTjBJR2xrWlc1MGFXTmhiQ0IwYnlCeVpXZGxibVZ5WVhSdmNsSjFiblJwYldVdVhHNGdJQ0FnSUNCdGIyUjFiR1V1Wlhod2IzSjBjeUE5SUhKMWJuUnBiV1U3WEc0Z0lDQWdmVnh1SUNBZ0lDOHZJRVJ2YmlkMElHSnZkR2hsY2lCbGRtRnNkV0YwYVc1bklIUm9aU0J5WlhOMElHOW1JSFJvYVhNZ1ptbHNaU0JwWmlCMGFHVWdjblZ1ZEdsdFpTQjNZWE5jYmlBZ0lDQXZMeUJoYkhKbFlXUjVJR1JsWm1sdVpXUWdaMnh2WW1Gc2JIa3VYRzRnSUNBZ2NtVjBkWEp1TzF4dUlDQjlYRzVjYmlBZ0x5OGdSR1ZtYVc1bElIUm9aU0J5ZFc1MGFXMWxJR2RzYjJKaGJHeDVJQ2hoY3lCbGVIQmxZM1JsWkNCaWVTQm5aVzVsY21GMFpXUWdZMjlrWlNrZ1lYTWdaV2wwYUdWeVhHNGdJQzh2SUcxdlpIVnNaUzVsZUhCdmNuUnpJQ2hwWmlCM1pTZHlaU0JwYmlCaElHMXZaSFZzWlNrZ2IzSWdZU0J1Wlhjc0lHVnRjSFI1SUc5aWFtVmpkQzVjYmlBZ2NuVnVkR2x0WlNBOUlHZHNiMkpoYkM1eVpXZGxibVZ5WVhSdmNsSjFiblJwYldVZ1BTQnBiazF2WkhWc1pTQS9JRzF2WkhWc1pTNWxlSEJ2Y25SeklEb2dlMzA3WEc1Y2JpQWdablZ1WTNScGIyNGdkM0poY0NocGJtNWxja1p1TENCdmRYUmxja1p1TENCelpXeG1MQ0IwY25sTWIyTnpUR2x6ZENrZ2UxeHVJQ0FnSUhKbGRIVnliaUJ1WlhjZ1IyVnVaWEpoZEc5eUtHbHVibVZ5Um00c0lHOTFkR1Z5Um00c0lITmxiR1lnZkh3Z2JuVnNiQ3dnZEhKNVRHOWpjMHhwYzNRZ2ZId2dXMTBwTzF4dUlDQjlYRzRnSUhKMWJuUnBiV1V1ZDNKaGNDQTlJSGR5WVhBN1hHNWNiaUFnTHk4Z1ZISjVMMk5oZEdOb0lHaGxiSEJsY2lCMGJ5QnRhVzVwYldsNlpTQmtaVzl3ZEdsdGFYcGhkR2x2Ym5NdUlGSmxkSFZ5Ym5NZ1lTQmpiMjF3YkdWMGFXOXVYRzRnSUM4dklISmxZMjl5WkNCc2FXdGxJR052Ym5SbGVIUXVkSEo1Ulc1MGNtbGxjMXRwWFM1amIyMXdiR1YwYVc5dUxpQlVhR2x6SUdsdWRHVnlabUZqWlNCamIzVnNaRnh1SUNBdkx5Qm9ZWFpsSUdKbFpXNGdLR0Z1WkNCM1lYTWdjSEpsZG1sdmRYTnNlU2tnWkdWemFXZHVaV1FnZEc4Z2RHRnJaU0JoSUdOc2IzTjFjbVVnZEc4Z1ltVmNiaUFnTHk4Z2FXNTJiMnRsWkNCM2FYUm9iM1YwSUdGeVozVnRaVzUwY3l3Z1luVjBJR2x1SUdGc2JDQjBhR1VnWTJGelpYTWdkMlVnWTJGeVpTQmhZbTkxZENCM1pWeHVJQ0F2THlCaGJISmxZV1I1SUdoaGRtVWdZVzRnWlhocGMzUnBibWNnYldWMGFHOWtJSGRsSUhkaGJuUWdkRzhnWTJGc2JDd2djMjhnZEdobGNtVW5jeUJ1YnlCdVpXVmtYRzRnSUM4dklIUnZJR055WldGMFpTQmhJRzVsZHlCbWRXNWpkR2x2YmlCdlltcGxZM1F1SUZkbElHTmhiaUJsZG1WdUlHZGxkQ0JoZDJGNUlIZHBkR2dnWVhOemRXMXBibWRjYmlBZ0x5OGdkR2hsSUcxbGRHaHZaQ0IwWVd0bGN5QmxlR0ZqZEd4NUlHOXVaU0JoY21kMWJXVnVkQ3dnYzJsdVkyVWdkR2hoZENCb1lYQndaVzV6SUhSdklHSmxJSFJ5ZFdWY2JpQWdMeThnYVc0Z1pYWmxjbmtnWTJGelpTd2djMjhnZDJVZ1pHOXVKM1FnYUdGMlpTQjBieUIwYjNWamFDQjBhR1VnWVhKbmRXMWxiblJ6SUc5aWFtVmpkQzRnVkdobFhHNGdJQzh2SUc5dWJIa2dZV1JrYVhScGIyNWhiQ0JoYkd4dlkyRjBhVzl1SUhKbGNYVnBjbVZrSUdseklIUm9aU0JqYjIxd2JHVjBhVzl1SUhKbFkyOXlaQ3dnZDJocFkyaGNiaUFnTHk4Z2FHRnpJR0VnYzNSaFlteGxJSE5vWVhCbElHRnVaQ0J6YnlCb2IzQmxablZzYkhrZ2MyaHZkV3hrSUdKbElHTm9aV0Z3SUhSdklHRnNiRzlqWVhSbExseHVJQ0JtZFc1amRHbHZiaUIwY25sRFlYUmphQ2htYml3Z2IySnFMQ0JoY21jcElIdGNiaUFnSUNCMGNua2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlIc2dkSGx3WlRvZ1hDSnViM0p0WVd4Y0lpd2dZWEpuT2lCbWJpNWpZV3hzS0c5aWFpd2dZWEpuS1NCOU8xeHVJQ0FnSUgwZ1kyRjBZMmdnS0dWeWNpa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlIc2dkSGx3WlRvZ1hDSjBhSEp2ZDF3aUxDQmhjbWM2SUdWeWNpQjlPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSFpoY2lCSFpXNVRkR0YwWlZOMWMzQmxibVJsWkZOMFlYSjBJRDBnWENKemRYTndaVzVrWldSVGRHRnlkRndpTzF4dUlDQjJZWElnUjJWdVUzUmhkR1ZUZFhOd1pXNWtaV1JaYVdWc1pDQTlJRndpYzNWemNHVnVaR1ZrV1dsbGJHUmNJanRjYmlBZ2RtRnlJRWRsYmxOMFlYUmxSWGhsWTNWMGFXNW5JRDBnWENKbGVHVmpkWFJwYm1kY0lqdGNiaUFnZG1GeUlFZGxibE4wWVhSbFEyOXRjR3hsZEdWa0lEMGdYQ0pqYjIxd2JHVjBaV1JjSWp0Y2JseHVJQ0F2THlCU1pYUjFjbTVwYm1jZ2RHaHBjeUJ2WW1wbFkzUWdabkp2YlNCMGFHVWdhVzV1WlhKR2JpQm9ZWE1nZEdobElITmhiV1VnWldabVpXTjBJR0Z6WEc0Z0lDOHZJR0p5WldGcmFXNW5JRzkxZENCdlppQjBhR1VnWkdsemNHRjBZMmdnYzNkcGRHTm9JSE4wWVhSbGJXVnVkQzVjYmlBZ2RtRnlJRU52Ym5ScGJuVmxVMlZ1ZEdsdVpXd2dQU0I3ZlR0Y2JseHVJQ0F2THlCRWRXMXRlU0JqYjI1emRISjFZM1J2Y2lCbWRXNWpkR2x2Ym5NZ2RHaGhkQ0IzWlNCMWMyVWdZWE1nZEdobElDNWpiMjV6ZEhKMVkzUnZjaUJoYm1SY2JpQWdMeThnTG1OdmJuTjBjblZqZEc5eUxuQnliM1J2ZEhsd1pTQndjbTl3WlhKMGFXVnpJR1p2Y2lCbWRXNWpkR2x2Ym5NZ2RHaGhkQ0J5WlhSMWNtNGdSMlZ1WlhKaGRHOXlYRzRnSUM4dklHOWlhbVZqZEhNdUlFWnZjaUJtZFd4c0lITndaV01nWTI5dGNHeHBZVzVqWlN3Z2VXOTFJRzFoZVNCM2FYTm9JSFJ2SUdOdmJtWnBaM1Z5WlNCNWIzVnlYRzRnSUM4dklHMXBibWxtYVdWeUlHNXZkQ0IwYnlCdFlXNW5iR1VnZEdobElHNWhiV1Z6SUc5bUlIUm9aWE5sSUhSM2J5Qm1kVzVqZEdsdmJuTXVYRzRnSUdaMWJtTjBhVzl1SUVkbGJtVnlZWFJ2Y2taMWJtTjBhVzl1S0NrZ2UzMWNiaUFnWm5WdVkzUnBiMjRnUjJWdVpYSmhkRzl5Um5WdVkzUnBiMjVRY205MGIzUjVjR1VvS1NCN2ZWeHVYRzRnSUhaaGNpQkhjQ0E5SUVkbGJtVnlZWFJ2Y2taMWJtTjBhVzl1VUhKdmRHOTBlWEJsTG5CeWIzUnZkSGx3WlNBOUlFZGxibVZ5WVhSdmNpNXdjbTkwYjNSNWNHVTdYRzRnSUVkbGJtVnlZWFJ2Y2taMWJtTjBhVzl1TG5CeWIzUnZkSGx3WlNBOUlFZHdMbU52Ym5OMGNuVmpkRzl5SUQwZ1IyVnVaWEpoZEc5eVJuVnVZM1JwYjI1UWNtOTBiM1I1Y0dVN1hHNGdJRWRsYm1WeVlYUnZja1oxYm1OMGFXOXVVSEp2ZEc5MGVYQmxMbU52Ym5OMGNuVmpkRzl5SUQwZ1IyVnVaWEpoZEc5eVJuVnVZM1JwYjI0N1hHNGdJRWRsYm1WeVlYUnZja1oxYm1OMGFXOXVMbVJwYzNCc1lYbE9ZVzFsSUQwZ1hDSkhaVzVsY21GMGIzSkdkVzVqZEdsdmJsd2lPMXh1WEc0Z0lISjFiblJwYldVdWFYTkhaVzVsY21GMGIzSkdkVzVqZEdsdmJpQTlJR1oxYm1OMGFXOXVJQ2huWlc1R2RXNHBJSHRjYmlBZ0lDQjJZWElnWTNSdmNpQTlJSFI1Y0dWdlppQm5aVzVHZFc0Z1BUMDlJRndpWm5WdVkzUnBiMjVjSWlBbUppQm5aVzVHZFc0dVkyOXVjM1J5ZFdOMGIzSTdYRzRnSUNBZ2NtVjBkWEp1SUdOMGIzSWdQeUJqZEc5eUlEMDlQU0JIWlc1bGNtRjBiM0pHZFc1amRHbHZiaUI4ZkZ4dUlDQWdJQzh2SUVadmNpQjBhR1VnYm1GMGFYWmxJRWRsYm1WeVlYUnZja1oxYm1OMGFXOXVJR052Ym5OMGNuVmpkRzl5TENCMGFHVWdZbVZ6ZENCM1pTQmpZVzVjYmlBZ0lDQXZMeUJrYnlCcGN5QjBieUJqYUdWamF5QnBkSE1nTG01aGJXVWdjSEp2Y0dWeWRIa3VYRzRnSUNBZ0tHTjBiM0l1WkdsemNHeGhlVTVoYldVZ2ZId2dZM1J2Y2k1dVlXMWxLU0E5UFQwZ1hDSkhaVzVsY21GMGIzSkdkVzVqZEdsdmJsd2lJRG9nWm1Gc2MyVTdYRzRnSUgwN1hHNWNiaUFnY25WdWRHbHRaUzV0WVhKcklEMGdablZ1WTNScGIyNGdLR2RsYmtaMWJpa2dlMXh1SUNBZ0lHZGxia1oxYmk1ZlgzQnliM1J2WDE4Z1BTQkhaVzVsY21GMGIzSkdkVzVqZEdsdmJsQnliM1J2ZEhsd1pUdGNiaUFnSUNCblpXNUdkVzR1Y0hKdmRHOTBlWEJsSUQwZ1QySnFaV04wTG1OeVpXRjBaU2hIY0NrN1hHNGdJQ0FnY21WMGRYSnVJR2RsYmtaMWJqdGNiaUFnZlR0Y2JseHVJQ0J5ZFc1MGFXMWxMbUZ6ZVc1aklEMGdablZ1WTNScGIyNGdLR2x1Ym1WeVJtNHNJRzkxZEdWeVJtNHNJSE5sYkdZc0lIUnllVXh2WTNOTWFYTjBLU0I3WEc0Z0lDQWdjbVYwZFhKdUlHNWxkeUJmWTI5eVpTNVFjbTl0YVhObEtHWjFibU4wYVc5dUlDaHlaWE52YkhabExDQnlaV3BsWTNRcElIdGNiaUFnSUNBZ0lIWmhjaUJuWlc1bGNtRjBiM0lnUFNCM2NtRndLR2x1Ym1WeVJtNHNJRzkxZEdWeVJtNHNJSE5sYkdZc0lIUnllVXh2WTNOTWFYTjBLVHRjYmlBZ0lDQWdJSFpoY2lCallXeHNUbVY0ZENBOUlITjBaWEF1WW1sdVpDaG5aVzVsY21GMGIzSXVibVY0ZENrN1hHNGdJQ0FnSUNCMllYSWdZMkZzYkZSb2NtOTNJRDBnYzNSbGNDNWlhVzVrS0dkbGJtVnlZWFJ2Y2x0Y0luUm9jbTkzWENKZEtUdGNibHh1SUNBZ0lDQWdablZ1WTNScGIyNGdjM1JsY0NoaGNtY3BJSHRjYmlBZ0lDQWdJQ0FnZG1GeUlISmxZMjl5WkNBOUlIUnllVU5oZEdOb0tIUm9hWE1zSUc1MWJHd3NJR0Z5WnlrN1hHNGdJQ0FnSUNBZ0lHbG1JQ2h5WldOdmNtUXVkSGx3WlNBOVBUMGdYQ0owYUhKdmQxd2lLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NtVnFaV04wS0hKbFkyOXlaQzVoY21jcE8xeHVJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJqdGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUhaaGNpQnBibVp2SUQwZ2NtVmpiM0prTG1GeVp6dGNiaUFnSUNBZ0lDQWdhV1lnS0dsdVptOHVaRzl1WlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJSEpsYzI5c2RtVW9hVzVtYnk1MllXeDFaU2s3WEc0Z0lDQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUNBZ1gyTnZjbVV1VUhKdmJXbHpaUzV5WlhOdmJIWmxLR2x1Wm04dWRtRnNkV1VwTG5Sb1pXNG9ZMkZzYkU1bGVIUXNJR05oYkd4VWFISnZkeWs3WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ1kyRnNiRTVsZUhRb0tUdGNiaUFnSUNCOUtUdGNiaUFnZlR0Y2JseHVJQ0JtZFc1amRHbHZiaUJIWlc1bGNtRjBiM0lvYVc1dVpYSkdiaXdnYjNWMFpYSkdiaXdnYzJWc1ppd2dkSEo1VEc5amMweHBjM1FwSUh0Y2JpQWdJQ0IyWVhJZ1oyVnVaWEpoZEc5eUlEMGdiM1YwWlhKR2JpQS9JRTlpYW1WamRDNWpjbVZoZEdVb2IzVjBaWEpHYmk1d2NtOTBiM1I1Y0dVcElEb2dkR2hwY3p0Y2JpQWdJQ0IyWVhJZ1kyOXVkR1Y0ZENBOUlHNWxkeUJEYjI1MFpYaDBLSFJ5ZVV4dlkzTk1hWE4wS1R0Y2JpQWdJQ0IyWVhJZ2MzUmhkR1VnUFNCSFpXNVRkR0YwWlZOMWMzQmxibVJsWkZOMFlYSjBPMXh1WEc0Z0lDQWdablZ1WTNScGIyNGdhVzUyYjJ0bEtHMWxkR2h2WkN3Z1lYSm5LU0I3WEc0Z0lDQWdJQ0JwWmlBb2MzUmhkR1VnUFQwOUlFZGxibE4wWVhSbFJYaGxZM1YwYVc1bktTQjdYRzRnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGNJa2RsYm1WeVlYUnZjaUJwY3lCaGJISmxZV1I1SUhKMWJtNXBibWRjSWlrN1hHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHbG1JQ2h6ZEdGMFpTQTlQVDBnUjJWdVUzUmhkR1ZEYjIxd2JHVjBaV1FwSUh0Y2JpQWdJQ0FnSUNBZ0x5OGdRbVVnWm05eVoybDJhVzVuTENCd1pYSWdNalV1TXk0ekxqTXVNeUJ2WmlCMGFHVWdjM0JsWXpwY2JpQWdJQ0FnSUNBZ0x5OGdhSFIwY0hNNkx5OXdaVzl3YkdVdWJXOTZhV3hzWVM1dmNtY3ZmbXB2Y21WdVpHOXlabVl2WlhNMkxXUnlZV1owTG1oMGJXd2pjMlZqTFdkbGJtVnlZWFJ2Y25KbGMzVnRaVnh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdaRzl1WlZKbGMzVnNkQ2dwTzF4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCM2FHbHNaU0FvZEhKMVpTa2dlMXh1SUNBZ0lDQWdJQ0IyWVhJZ1pHVnNaV2RoZEdVZ1BTQmpiMjUwWlhoMExtUmxiR1ZuWVhSbE8xeHVJQ0FnSUNBZ0lDQnBaaUFvWkdWc1pXZGhkR1VwSUh0Y2JpQWdJQ0FnSUNBZ0lDQjJZWElnY21WamIzSmtJRDBnZEhKNVEyRjBZMmdvWkdWc1pXZGhkR1V1YVhSbGNtRjBiM0piYldWMGFHOWtYU3dnWkdWc1pXZGhkR1V1YVhSbGNtRjBiM0lzSUdGeVp5azdYRzVjYmlBZ0lDQWdJQ0FnSUNCcFppQW9jbVZqYjNKa0xuUjVjR1VnUFQwOUlGd2lkR2h5YjNkY0lpa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ1kyOXVkR1Y0ZEM1a1pXeGxaMkYwWlNBOUlHNTFiR3c3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SUV4cGEyVWdjbVYwZFhKdWFXNW5JR2RsYm1WeVlYUnZjaTUwYUhKdmR5aDFibU5oZFdkb2RDa3NJR0oxZENCM2FYUm9iM1YwSUhSb1pWeHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z2IzWmxjbWhsWVdRZ2IyWWdZVzRnWlhoMGNtRWdablZ1WTNScGIyNGdZMkZzYkM1Y2JpQWdJQ0FnSUNBZ0lDQWdJRzFsZEdodlpDQTlJRndpZEdoeWIzZGNJanRjYmlBZ0lDQWdJQ0FnSUNBZ0lHRnlaeUE5SUhKbFkyOXlaQzVoY21jN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUdOdmJuUnBiblZsTzF4dUlDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUM4dklFUmxiR1ZuWVhSbElHZGxibVZ5WVhSdmNpQnlZVzRnWVc1a0lHaGhibVJzWldRZ2FYUnpJRzkzYmlCbGVHTmxjSFJwYjI1eklITnZYRzRnSUNBZ0lDQWdJQ0FnTHk4Z2NtVm5ZWEprYkdWemN5QnZaaUIzYUdGMElIUm9aU0J0WlhSb2IyUWdkMkZ6TENCM1pTQmpiMjUwYVc1MVpTQmhjeUJwWmlCcGRDQnBjMXh1SUNBZ0lDQWdJQ0FnSUM4dklGd2libVY0ZEZ3aUlIZHBkR2dnWVc0Z2RXNWtaV1pwYm1Wa0lHRnlaeTVjYmlBZ0lDQWdJQ0FnSUNCdFpYUm9iMlFnUFNCY0ltNWxlSFJjSWp0Y2JpQWdJQ0FnSUNBZ0lDQmhjbWNnUFNCMWJtUmxabWx1WldRN1hHNWNiaUFnSUNBZ0lDQWdJQ0IyWVhJZ2FXNW1ieUE5SUhKbFkyOXlaQzVoY21jN1hHNGdJQ0FnSUNBZ0lDQWdhV1lnS0dsdVptOHVaRzl1WlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnWTI5dWRHVjRkRnRrWld4bFoyRjBaUzV5WlhOMWJIUk9ZVzFsWFNBOUlHbHVabTh1ZG1Gc2RXVTdYRzRnSUNBZ0lDQWdJQ0FnSUNCamIyNTBaWGgwTG01bGVIUWdQU0JrWld4bFoyRjBaUzV1WlhoMFRHOWpPMXh1SUNBZ0lDQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnpkR0YwWlNBOUlFZGxibE4wWVhSbFUzVnpjR1Z1WkdWa1dXbGxiR1E3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2FXNW1ienRjYmlBZ0lDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdJQ0JqYjI1MFpYaDBMbVJsYkdWbllYUmxJRDBnYm5Wc2JEdGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUdsbUlDaHRaWFJvYjJRZ1BUMDlJRndpYm1WNGRGd2lLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLSE4wWVhSbElEMDlQU0JIWlc1VGRHRjBaVk4xYzNCbGJtUmxaRk4wWVhKMElDWW1JSFI1Y0dWdlppQmhjbWNnSVQwOUlGd2lkVzVrWldacGJtVmtYQ0lwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SUdoMGRIQnpPaTh2Y0dWdmNHeGxMbTF2ZW1sc2JHRXViM0puTDM1cWIzSmxibVJ2Y21abUwyVnpOaTFrY21GbWRDNW9kRzFzSTNObFl5MW5aVzVsY21GMGIzSnlaWE4xYldWY2JpQWdJQ0FnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJVZVhCbFJYSnliM0lvWENKaGRIUmxiWEIwSUhSdklITmxibVFnWENJZ0t5QktVMDlPTG5OMGNtbHVaMmxtZVNoaGNtY3BJQ3NnWENJZ2RHOGdibVYzWW05eWJpQm5aVzVsY21GMGIzSmNJaWs3WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tITjBZWFJsSUQwOVBTQkhaVzVUZEdGMFpWTjFjM0JsYm1SbFpGbHBaV3hrS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqYjI1MFpYaDBMbk5sYm5RZ1BTQmhjbWM3WEc0Z0lDQWdJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR1JsYkdWMFpTQmpiMjUwWlhoMExuTmxiblE3WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2FXWWdLRzFsZEdodlpDQTlQVDBnWENKMGFISnZkMXdpS1NCN1hHNGdJQ0FnSUNBZ0lDQWdhV1lnS0hOMFlYUmxJRDA5UFNCSFpXNVRkR0YwWlZOMWMzQmxibVJsWkZOMFlYSjBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnpkR0YwWlNBOUlFZGxibE4wWVhSbFEyOXRjR3hsZEdWa08xeHVJQ0FnSUNBZ0lDQWdJQ0FnZEdoeWIzY2dZWEpuTzF4dUlDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUdsbUlDaGpiMjUwWlhoMExtUnBjM0JoZEdOb1JYaGpaWEIwYVc5dUtHRnlaeWtwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SUVsbUlIUm9aU0JrYVhOd1lYUmphR1ZrSUdWNFkyVndkR2x2YmlCM1lYTWdZMkYxWjJoMElHSjVJR0VnWTJGMFkyZ2dZbXh2WTJzc1hHNGdJQ0FnSUNBZ0lDQWdJQ0F2THlCMGFHVnVJR3hsZENCMGFHRjBJR05oZEdOb0lHSnNiMk5ySUdoaGJtUnNaU0IwYUdVZ1pYaGpaWEIwYVc5dUlHNXZjbTFoYkd4NUxseHVJQ0FnSUNBZ0lDQWdJQ0FnYldWMGFHOWtJRDBnWENKdVpYaDBYQ0k3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmhjbWNnUFNCMWJtUmxabWx1WldRN1hHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5SUdWc2MyVWdhV1lnS0cxbGRHaHZaQ0E5UFQwZ1hDSnlaWFIxY201Y0lpa2dlMXh1SUNBZ0lDQWdJQ0FnSUdOdmJuUmxlSFF1WVdKeWRYQjBLRndpY21WMGRYSnVYQ0lzSUdGeVp5azdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCemRHRjBaU0E5SUVkbGJsTjBZWFJsUlhobFkzVjBhVzVuTzF4dVhHNGdJQ0FnSUNBZ0lIWmhjaUJ5WldOdmNtUWdQU0IwY25sRFlYUmphQ2hwYm01bGNrWnVMQ0J6Wld4bUxDQmpiMjUwWlhoMEtUdGNiaUFnSUNBZ0lDQWdhV1lnS0hKbFkyOXlaQzUwZVhCbElEMDlQU0JjSW01dmNtMWhiRndpS1NCN1hHNGdJQ0FnSUNBZ0lDQWdMeThnU1dZZ1lXNGdaWGhqWlhCMGFXOXVJR2x6SUhSb2NtOTNiaUJtY205dElHbHVibVZ5Um00c0lIZGxJR3hsWVhabElITjBZWFJsSUQwOVBWeHVJQ0FnSUNBZ0lDQWdJQzh2SUVkbGJsTjBZWFJsUlhobFkzVjBhVzVuSUdGdVpDQnNiMjl3SUdKaFkyc2dabTl5SUdGdWIzUm9aWElnYVc1MmIyTmhkR2x2Ymk1Y2JpQWdJQ0FnSUNBZ0lDQnpkR0YwWlNBOUlHTnZiblJsZUhRdVpHOXVaU0EvSUVkbGJsTjBZWFJsUTI5dGNHeGxkR1ZrSURvZ1IyVnVVM1JoZEdWVGRYTndaVzVrWldSWmFXVnNaRHRjYmx4dUlDQWdJQ0FnSUNBZ0lIWmhjaUJwYm1adklEMGdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RtRnNkV1U2SUhKbFkyOXlaQzVoY21jc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JrYjI1bE9pQmpiMjUwWlhoMExtUnZibVZjYmlBZ0lDQWdJQ0FnSUNCOU8xeHVYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tISmxZMjl5WkM1aGNtY2dQVDA5SUVOdmJuUnBiblZsVTJWdWRHbHVaV3dwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNoamIyNTBaWGgwTG1SbGJHVm5ZWFJsSUNZbUlHMWxkR2h2WkNBOVBUMGdYQ0p1WlhoMFhDSXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdMeThnUkdWc2FXSmxjbUYwWld4NUlHWnZjbWRsZENCMGFHVWdiR0Z6ZENCelpXNTBJSFpoYkhWbElITnZJSFJvWVhRZ2QyVWdaRzl1SjNSY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1lXTmphV1JsYm5SaGJHeDVJSEJoYzNNZ2FYUWdiMjRnZEc4Z2RHaGxJR1JsYkdWbllYUmxMbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQmhjbWNnUFNCMWJtUmxabWx1WldRN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQnBibVp2TzF4dUlDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdmU0JsYkhObElHbG1JQ2h5WldOdmNtUXVkSGx3WlNBOVBUMGdYQ0owYUhKdmQxd2lLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2MzUmhkR1VnUFNCSFpXNVRkR0YwWlVOdmJYQnNaWFJsWkR0Y2JseHVJQ0FnSUNBZ0lDQWdJR2xtSUNodFpYUm9iMlFnUFQwOUlGd2libVY0ZEZ3aUtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCamIyNTBaWGgwTG1ScGMzQmhkR05vUlhoalpYQjBhVzl1S0hKbFkyOXlaQzVoY21jcE8xeHVJQ0FnSUNBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCaGNtY2dQU0J5WldOdmNtUXVZWEpuTzF4dUlDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1SUNBZ0lHZGxibVZ5WVhSdmNpNXVaWGgwSUQwZ2FXNTJiMnRsTG1KcGJtUW9aMlZ1WlhKaGRHOXlMQ0JjSW01bGVIUmNJaWs3WEc0Z0lDQWdaMlZ1WlhKaGRHOXlXMXdpZEdoeWIzZGNJbDBnUFNCcGJuWnZhMlV1WW1sdVpDaG5aVzVsY21GMGIzSXNJRndpZEdoeWIzZGNJaWs3WEc0Z0lDQWdaMlZ1WlhKaGRHOXlXMXdpY21WMGRYSnVYQ0pkSUQwZ2FXNTJiMnRsTG1KcGJtUW9aMlZ1WlhKaGRHOXlMQ0JjSW5KbGRIVnlibHdpS1R0Y2JseHVJQ0FnSUhKbGRIVnliaUJuWlc1bGNtRjBiM0k3WEc0Z0lIMWNibHh1SUNCSGNGdHBkR1Z5WVhSdmNsTjViV0p2YkYwZ1BTQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE03WEc0Z0lIMDdYRzVjYmlBZ1IzQXVkRzlUZEhKcGJtY2dQU0JtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnY21WMGRYSnVJRndpVzI5aWFtVmpkQ0JIWlc1bGNtRjBiM0pkWENJN1hHNGdJSDA3WEc1Y2JpQWdablZ1WTNScGIyNGdjSFZ6YUZSeWVVVnVkSEo1S0d4dlkzTXBJSHRjYmlBZ0lDQjJZWElnWlc1MGNua2dQU0I3SUhSeWVVeHZZem9nYkc5amMxc3dYU0I5TzF4dVhHNGdJQ0FnYVdZZ0tERWdhVzRnYkc5amN5a2dlMXh1SUNBZ0lDQWdaVzUwY25rdVkyRjBZMmhNYjJNZ1BTQnNiMk56V3pGZE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUdsbUlDZ3lJR2x1SUd4dlkzTXBJSHRjYmlBZ0lDQWdJR1Z1ZEhKNUxtWnBibUZzYkhsTWIyTWdQU0JzYjJOeld6SmRPMXh1SUNBZ0lDQWdaVzUwY25rdVlXWjBaWEpNYjJNZ1BTQnNiMk56V3pOZE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUhSb2FYTXVkSEo1Ulc1MGNtbGxjeTV3ZFhOb0tHVnVkSEo1S1R0Y2JpQWdmVnh1WEc0Z0lHWjFibU4wYVc5dUlISmxjMlYwVkhKNVJXNTBjbmtvWlc1MGNua3BJSHRjYmlBZ0lDQjJZWElnY21WamIzSmtJRDBnWlc1MGNua3VZMjl0Y0d4bGRHbHZiaUI4ZkNCN2ZUdGNiaUFnSUNCeVpXTnZjbVF1ZEhsd1pTQTlJRndpYm05eWJXRnNYQ0k3WEc0Z0lDQWdaR1ZzWlhSbElISmxZMjl5WkM1aGNtYzdYRzRnSUNBZ1pXNTBjbmt1WTI5dGNHeGxkR2x2YmlBOUlISmxZMjl5WkR0Y2JpQWdmVnh1WEc0Z0lHWjFibU4wYVc5dUlFTnZiblJsZUhRb2RISjVURzlqYzB4cGMzUXBJSHRjYmlBZ0lDQXZMeUJVYUdVZ2NtOXZkQ0JsYm5SeWVTQnZZbXBsWTNRZ0tHVm1abVZqZEdsMlpXeDVJR0VnZEhKNUlITjBZWFJsYldWdWRDQjNhWFJvYjNWMElHRWdZMkYwWTJoY2JpQWdJQ0F2THlCdmNpQmhJR1pwYm1Gc2JIa2dZbXh2WTJzcElHZHBkbVZ6SUhWeklHRWdjR3hoWTJVZ2RHOGdjM1J2Y21VZ2RtRnNkV1Z6SUhSb2NtOTNiaUJtY205dFhHNGdJQ0FnTHk4Z2JHOWpZWFJwYjI1eklIZG9aWEpsSUhSb1pYSmxJR2x6SUc1dklHVnVZMnh2YzJsdVp5QjBjbmtnYzNSaGRHVnRaVzUwTGx4dUlDQWdJSFJvYVhNdWRISjVSVzUwY21sbGN5QTlJRnQ3SUhSeWVVeHZZem9nWENKeWIyOTBYQ0lnZlYwN1hHNGdJQ0FnZEhKNVRHOWpjMHhwYzNRdVptOXlSV0ZqYUNod2RYTm9WSEo1Ulc1MGNua3NJSFJvYVhNcE8xeHVJQ0FnSUhSb2FYTXVjbVZ6WlhRb0tUdGNiaUFnZlZ4dVhHNGdJSEoxYm5ScGJXVXVhMlY1Y3lBOUlHWjFibU4wYVc5dUlDaHZZbXBsWTNRcElIdGNiaUFnSUNCMllYSWdhMlY1Y3lBOUlGdGRPMXh1SUNBZ0lHWnZjaUFvZG1GeUlHdGxlU0JwYmlCdlltcGxZM1FwSUh0Y2JpQWdJQ0FnSUd0bGVYTXVjSFZ6YUNoclpYa3BPMXh1SUNBZ0lIMWNiaUFnSUNCclpYbHpMbkpsZG1WeWMyVW9LVHRjYmx4dUlDQWdJQzh2SUZKaGRHaGxjaUIwYUdGdUlISmxkSFZ5Ym1sdVp5QmhiaUJ2WW1wbFkzUWdkMmwwYUNCaElHNWxlSFFnYldWMGFHOWtMQ0IzWlNCclpXVndYRzRnSUNBZ0x5OGdkR2hwYm1keklITnBiWEJzWlNCaGJtUWdjbVYwZFhKdUlIUm9aU0J1WlhoMElHWjFibU4wYVc5dUlHbDBjMlZzWmk1Y2JpQWdJQ0J5WlhSMWNtNGdablZ1WTNScGIyNGdibVY0ZENncElIdGNiaUFnSUNBZ0lIZG9hV3hsSUNoclpYbHpMbXhsYm1kMGFDa2dlMXh1SUNBZ0lDQWdJQ0IyWVhJZ2EyVjVJRDBnYTJWNWN5NXdiM0FvS1R0Y2JpQWdJQ0FnSUNBZ2FXWWdLR3RsZVNCcGJpQnZZbXBsWTNRcElIdGNiaUFnSUNBZ0lDQWdJQ0J1WlhoMExuWmhiSFZsSUQwZ2EyVjVPMXh1SUNBZ0lDQWdJQ0FnSUc1bGVIUXVaRzl1WlNBOUlHWmhiSE5sTzF4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCdVpYaDBPMXh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUM4dklGUnZJR0YyYjJsa0lHTnlaV0YwYVc1bklHRnVJR0ZrWkdsMGFXOXVZV3dnYjJKcVpXTjBMQ0IzWlNCcWRYTjBJR2hoYm1jZ2RHaGxJQzUyWVd4MVpWeHVJQ0FnSUNBZ0x5OGdZVzVrSUM1a2IyNWxJSEJ5YjNCbGNuUnBaWE1nYjJabUlIUm9aU0J1WlhoMElHWjFibU4wYVc5dUlHOWlhbVZqZENCcGRITmxiR1l1SUZSb2FYTmNiaUFnSUNBZ0lDOHZJR0ZzYzI4Z1pXNXpkWEpsY3lCMGFHRjBJSFJvWlNCdGFXNXBabWxsY2lCM2FXeHNJRzV2ZENCaGJtOXVlVzFwZW1VZ2RHaGxJR1oxYm1OMGFXOXVMbHh1SUNBZ0lDQWdibVY0ZEM1a2IyNWxJRDBnZEhKMVpUdGNiaUFnSUNBZ0lISmxkSFZ5YmlCdVpYaDBPMXh1SUNBZ0lIMDdYRzRnSUgwN1hHNWNiaUFnWm5WdVkzUnBiMjRnZG1Gc2RXVnpLR2wwWlhKaFlteGxLU0I3WEc0Z0lDQWdhV1lnS0dsMFpYSmhZbXhsS1NCN1hHNGdJQ0FnSUNCMllYSWdhWFJsY21GMGIzSk5aWFJvYjJRZ1BTQnBkR1Z5WVdKc1pWdHBkR1Z5WVhSdmNsTjViV0p2YkYwN1hHNGdJQ0FnSUNCcFppQW9hWFJsY21GMGIzSk5aWFJvYjJRcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHbDBaWEpoZEc5eVRXVjBhRzlrTG1OaGJHd29hWFJsY21GaWJHVXBPMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JwWmlBb2RIbHdaVzltSUdsMFpYSmhZbXhsTG01bGVIUWdQVDA5SUZ3aVpuVnVZM1JwYjI1Y0lpa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdhWFJsY21GaWJHVTdYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNnaGFYTk9ZVTRvYVhSbGNtRmliR1V1YkdWdVozUm9LU2tnZTF4dUlDQWdJQ0FnSUNCMllYSWdhU0E5SUMweExGeHVJQ0FnSUNBZ0lDQWdJQ0FnYm1WNGRDQTlJR1oxYm1OMGFXOXVJRzVsZUhRb0tTQjdYRzRnSUNBZ0lDQWdJQ0FnZDJocGJHVWdLQ3NyYVNBOElHbDBaWEpoWW14bExteGxibWQwYUNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHaGhjMDkzYmk1allXeHNLR2wwWlhKaFlteGxMQ0JwS1NrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCdVpYaDBMblpoYkhWbElEMGdhWFJsY21GaWJHVmJhVjA3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRzVsZUhRdVpHOXVaU0E5SUdaaGJITmxPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2JtVjRkRHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0lDQnVaWGgwTG5aaGJIVmxJRDBnZFc1a1pXWnBibVZrTzF4dUlDQWdJQ0FnSUNBZ0lHNWxlSFF1Wkc5dVpTQTlJSFJ5ZFdVN1hHNWNiaUFnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdibVY0ZER0Y2JpQWdJQ0FnSUNBZ2ZUdGNibHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdibVY0ZEM1dVpYaDBJRDBnYm1WNGREdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNBdkx5QlNaWFIxY200Z1lXNGdhWFJsY21GMGIzSWdkMmwwYUNCdWJ5QjJZV3gxWlhNdVhHNGdJQ0FnY21WMGRYSnVJSHNnYm1WNGREb2daRzl1WlZKbGMzVnNkQ0I5TzF4dUlDQjlYRzRnSUhKMWJuUnBiV1V1ZG1Gc2RXVnpJRDBnZG1Gc2RXVnpPMXh1WEc0Z0lHWjFibU4wYVc5dUlHUnZibVZTWlhOMWJIUW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIc2dkbUZzZFdVNklIVnVaR1ZtYVc1bFpDd2daRzl1WlRvZ2RISjFaU0I5TzF4dUlDQjlYRzVjYmlBZ1EyOXVkR1Y0ZEM1d2NtOTBiM1I1Y0dVZ1BTQjdYRzRnSUNBZ1kyOXVjM1J5ZFdOMGIzSTZJRU52Ym5SbGVIUXNYRzVjYmlBZ0lDQnlaWE5sZERvZ1puVnVZM1JwYjI0Z2NtVnpaWFFvS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbkJ5WlhZZ1BTQXdPMXh1SUNBZ0lDQWdkR2hwY3k1dVpYaDBJRDBnTUR0Y2JpQWdJQ0FnSUhSb2FYTXVjMlZ1ZENBOUlIVnVaR1ZtYVc1bFpEdGNiaUFnSUNBZ0lIUm9hWE11Wkc5dVpTQTlJR1poYkhObE8xeHVJQ0FnSUNBZ2RHaHBjeTVrWld4bFoyRjBaU0E5SUc1MWJHdzdYRzVjYmlBZ0lDQWdJSFJvYVhNdWRISjVSVzUwY21sbGN5NW1iM0pGWVdOb0tISmxjMlYwVkhKNVJXNTBjbmtwTzF4dVhHNGdJQ0FnSUNBdkx5QlFjbVV0YVc1cGRHbGhiR2w2WlNCaGRDQnNaV0Z6ZENBeU1DQjBaVzF3YjNKaGNua2dkbUZ5YVdGaWJHVnpJSFJ2SUdWdVlXSnNaU0JvYVdSa1pXNWNiaUFnSUNBZ0lDOHZJR05zWVhOeklHOXdkR2x0YVhwaGRHbHZibk1nWm05eUlITnBiWEJzWlNCblpXNWxjbUYwYjNKekxseHVJQ0FnSUNBZ1ptOXlJQ2gyWVhJZ2RHVnRjRWx1WkdWNElEMGdNQ3dnZEdWdGNFNWhiV1U3SUdoaGMwOTNiaTVqWVd4c0tIUm9hWE1zSUhSbGJYQk9ZVzFsSUQwZ1hDSjBYQ0lnS3lCMFpXMXdTVzVrWlhncElIeDhJSFJsYlhCSmJtUmxlQ0E4SURJd095QXJLM1JsYlhCSmJtUmxlQ2tnZTF4dUlDQWdJQ0FnSUNCMGFHbHpXM1JsYlhCT1lXMWxYU0E5SUc1MWJHdzdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTeGNibHh1SUNBZ0lITjBiM0E2SUdaMWJtTjBhVzl1SUhOMGIzQW9LU0I3WEc0Z0lDQWdJQ0IwYUdsekxtUnZibVVnUFNCMGNuVmxPMXh1WEc0Z0lDQWdJQ0IyWVhJZ2NtOXZkRVZ1ZEhKNUlEMGdkR2hwY3k1MGNubEZiblJ5YVdWeld6QmRPMXh1SUNBZ0lDQWdkbUZ5SUhKdmIzUlNaV052Y21RZ1BTQnliMjkwUlc1MGNua3VZMjl0Y0d4bGRHbHZianRjYmlBZ0lDQWdJR2xtSUNoeWIyOTBVbVZqYjNKa0xuUjVjR1VnUFQwOUlGd2lkR2h5YjNkY0lpa2dlMXh1SUNBZ0lDQWdJQ0IwYUhKdmR5QnliMjkwVW1WamIzSmtMbUZ5Wnp0Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVjblpoYkR0Y2JpQWdJQ0I5TEZ4dVhHNGdJQ0FnWkdsemNHRjBZMmhGZUdObGNIUnBiMjQ2SUdaMWJtTjBhVzl1SUdScGMzQmhkR05vUlhoalpYQjBhVzl1S0dWNFkyVndkR2x2YmlrZ2UxeHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdVpHOXVaU2tnZTF4dUlDQWdJQ0FnSUNCMGFISnZkeUJsZUdObGNIUnBiMjQ3WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhaaGNpQmpiMjUwWlhoMElEMGdkR2hwY3p0Y2JpQWdJQ0FnSUdaMWJtTjBhVzl1SUdoaGJtUnNaU2hzYjJNc0lHTmhkV2RvZENrZ2UxeHVJQ0FnSUNBZ0lDQnlaV052Y21RdWRIbHdaU0E5SUZ3aWRHaHliM2RjSWp0Y2JpQWdJQ0FnSUNBZ2NtVmpiM0prTG1GeVp5QTlJR1Y0WTJWd2RHbHZianRjYmlBZ0lDQWdJQ0FnWTI5dWRHVjRkQzV1WlhoMElEMGdiRzlqTzF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnSVNGallYVm5hSFE3WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdadmNpQW9kbUZ5SUdrZ1BTQjBhR2x6TG5SeWVVVnVkSEpwWlhNdWJHVnVaM1JvSUMwZ01Uc2dhU0ErUFNBd095QXRMV2twSUh0Y2JpQWdJQ0FnSUNBZ2RtRnlJR1Z1ZEhKNUlEMGdkR2hwY3k1MGNubEZiblJ5YVdWelcybGRPMXh1SUNBZ0lDQWdJQ0IyWVhJZ2NtVmpiM0prSUQwZ1pXNTBjbmt1WTI5dGNHeGxkR2x2Ymp0Y2JseHVJQ0FnSUNBZ0lDQnBaaUFvWlc1MGNua3VkSEo1VEc5aklEMDlQU0JjSW5KdmIzUmNJaWtnZTF4dUlDQWdJQ0FnSUNBZ0lDOHZJRVY0WTJWd2RHbHZiaUIwYUhKdmQyNGdiM1YwYzJsa1pTQnZaaUJoYm5rZ2RISjVJR0pzYjJOcklIUm9ZWFFnWTI5MWJHUWdhR0Z1Wkd4bFhHNGdJQ0FnSUNBZ0lDQWdMeThnYVhRc0lITnZJSE5sZENCMGFHVWdZMjl0Y0d4bGRHbHZiaUIyWVd4MVpTQnZaaUIwYUdVZ1pXNTBhWEpsSUdaMWJtTjBhVzl1SUhSdlhHNGdJQ0FnSUNBZ0lDQWdMeThnZEdoeWIzY2dkR2hsSUdWNFkyVndkR2x2Ymk1Y2JpQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2FHRnVaR3hsS0Z3aVpXNWtYQ0lwTzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdhV1lnS0dWdWRISjVMblJ5ZVV4dll5QThQU0IwYUdsekxuQnlaWFlwSUh0Y2JpQWdJQ0FnSUNBZ0lDQjJZWElnYUdGelEyRjBZMmdnUFNCb1lYTlBkMjR1WTJGc2JDaGxiblJ5ZVN3Z1hDSmpZWFJqYUV4dlkxd2lLVHRjYmlBZ0lDQWdJQ0FnSUNCMllYSWdhR0Z6Um1sdVlXeHNlU0E5SUdoaGMwOTNiaTVqWVd4c0tHVnVkSEo1TENCY0ltWnBibUZzYkhsTWIyTmNJaWs3WEc1Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvYUdGelEyRjBZMmdnSmlZZ2FHRnpSbWx1WVd4c2VTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdWNISmxkaUE4SUdWdWRISjVMbU5oZEdOb1RHOWpLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQm9ZVzVrYkdVb1pXNTBjbmt1WTJGMFkyaE1iMk1zSUhSeWRXVXBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTQmxiSE5sSUdsbUlDaDBhR2x6TG5CeVpYWWdQQ0JsYm5SeWVTNW1hVzVoYkd4NVRHOWpLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQm9ZVzVrYkdVb1pXNTBjbmt1Wm1sdVlXeHNlVXh2WXlrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ2ZTQmxiSE5sSUdsbUlDaG9ZWE5EWVhSamFDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdWNISmxkaUE4SUdWdWRISjVMbU5oZEdOb1RHOWpLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQm9ZVzVrYkdVb1pXNTBjbmt1WTJGMFkyaE1iMk1zSUhSeWRXVXBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJSDBnWld4elpTQnBaaUFvYUdGelJtbHVZV3hzZVNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tIUm9hWE11Y0hKbGRpQThJR1Z1ZEhKNUxtWnBibUZzYkhsTWIyTXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHaGhibVJzWlNobGJuUnllUzVtYVc1aGJHeDVURzlqS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtGd2lkSEo1SUhOMFlYUmxiV1Z1ZENCM2FYUm9iM1YwSUdOaGRHTm9JRzl5SUdacGJtRnNiSGxjSWlrN1hHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmU3hjYmx4dUlDQWdJR0ZpY25Wd2REb2dablZ1WTNScGIyNGdZV0p5ZFhCMEtIUjVjR1VzSUdGeVp5a2dlMXh1SUNBZ0lDQWdabTl5SUNoMllYSWdhU0E5SUhSb2FYTXVkSEo1Ulc1MGNtbGxjeTVzWlc1bmRHZ2dMU0F4T3lCcElENDlJREE3SUMwdGFTa2dlMXh1SUNBZ0lDQWdJQ0IyWVhJZ1pXNTBjbmtnUFNCMGFHbHpMblJ5ZVVWdWRISnBaWE5iYVYwN1hHNGdJQ0FnSUNBZ0lHbG1JQ2hsYm5SeWVTNTBjbmxNYjJNZ1BEMGdkR2hwY3k1d2NtVjJJQ1ltSUdoaGMwOTNiaTVqWVd4c0tHVnVkSEo1TENCY0ltWnBibUZzYkhsTWIyTmNJaWtnSmlZZ2RHaHBjeTV3Y21WMklEd2daVzUwY25rdVptbHVZV3hzZVV4dll5a2dlMXh1SUNBZ0lDQWdJQ0FnSUhaaGNpQm1hVzVoYkd4NVJXNTBjbmtnUFNCbGJuUnllVHRjYmlBZ0lDQWdJQ0FnSUNCaWNtVmhhenRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcFppQW9abWx1WVd4c2VVVnVkSEo1SUNZbUlDaDBlWEJsSUQwOVBTQmNJbUp5WldGclhDSWdmSHdnZEhsd1pTQTlQVDBnWENKamIyNTBhVzUxWlZ3aUtTQW1KaUJtYVc1aGJHeDVSVzUwY25rdWRISjVURzlqSUR3OUlHRnlaeUFtSmlCaGNtY2dQQ0JtYVc1aGJHeDVSVzUwY25rdVptbHVZV3hzZVV4dll5a2dlMXh1SUNBZ0lDQWdJQ0F2THlCSloyNXZjbVVnZEdobElHWnBibUZzYkhrZ1pXNTBjbmtnYVdZZ1kyOXVkSEp2YkNCcGN5QnViM1FnYW5WdGNHbHVaeUIwYnlCaFhHNGdJQ0FnSUNBZ0lDOHZJR3h2WTJGMGFXOXVJRzkxZEhOcFpHVWdkR2hsSUhSeWVTOWpZWFJqYUNCaWJHOWpheTVjYmlBZ0lDQWdJQ0FnWm1sdVlXeHNlVVZ1ZEhKNUlEMGdiblZzYkR0Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RtRnlJSEpsWTI5eVpDQTlJR1pwYm1Gc2JIbEZiblJ5ZVNBL0lHWnBibUZzYkhsRmJuUnllUzVqYjIxd2JHVjBhVzl1SURvZ2UzMDdYRzRnSUNBZ0lDQnlaV052Y21RdWRIbHdaU0E5SUhSNWNHVTdYRzRnSUNBZ0lDQnlaV052Y21RdVlYSm5JRDBnWVhKbk8xeHVYRzRnSUNBZ0lDQnBaaUFvWm1sdVlXeHNlVVZ1ZEhKNUtTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdWJtVjRkQ0E5SUdacGJtRnNiSGxGYm5SeWVTNW1hVzVoYkd4NVRHOWpPMXh1SUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1amIyMXdiR1YwWlNoeVpXTnZjbVFwTzF4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnUTI5dWRHbHVkV1ZUWlc1MGFXNWxiRHRjYmlBZ0lDQjlMRnh1WEc0Z0lDQWdZMjl0Y0d4bGRHVTZJR1oxYm1OMGFXOXVJR052YlhCc1pYUmxLSEpsWTI5eVpDd2dZV1owWlhKTWIyTXBJSHRjYmlBZ0lDQWdJR2xtSUNoeVpXTnZjbVF1ZEhsd1pTQTlQVDBnWENKMGFISnZkMXdpS1NCN1hHNGdJQ0FnSUNBZ0lIUm9jbTkzSUhKbFkyOXlaQzVoY21jN1hHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHbG1JQ2h5WldOdmNtUXVkSGx3WlNBOVBUMGdYQ0ppY21WaGExd2lJSHg4SUhKbFkyOXlaQzUwZVhCbElEMDlQU0JjSW1OdmJuUnBiblZsWENJcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1dVpYaDBJRDBnY21WamIzSmtMbUZ5Wnp0Y2JpQWdJQ0FnSUgwZ1pXeHpaU0JwWmlBb2NtVmpiM0prTG5SNWNHVWdQVDA5SUZ3aWNtVjBkWEp1WENJcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1eWRtRnNJRDBnY21WamIzSmtMbUZ5Wnp0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV1WlhoMElEMGdYQ0psYm1SY0lqdGNiaUFnSUNBZ0lIMGdaV3h6WlNCcFppQW9jbVZqYjNKa0xuUjVjR1VnUFQwOUlGd2libTl5YldGc1hDSWdKaVlnWVdaMFpYSk1iMk1wSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV1WlhoMElEMGdZV1owWlhKTWIyTTdYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQkRiMjUwYVc1MVpWTmxiblJwYm1Wc08xeHVJQ0FnSUgwc1hHNWNiaUFnSUNCbWFXNXBjMmc2SUdaMWJtTjBhVzl1SUdacGJtbHphQ2htYVc1aGJHeDVURzlqS1NCN1hHNGdJQ0FnSUNCbWIzSWdLSFpoY2lCcElEMGdkR2hwY3k1MGNubEZiblJ5YVdWekxteGxibWQwYUNBdElERTdJR2tnUGowZ01Ec2dMUzFwS1NCN1hHNGdJQ0FnSUNBZ0lIWmhjaUJsYm5SeWVTQTlJSFJvYVhNdWRISjVSVzUwY21sbGMxdHBYVHRjYmlBZ0lDQWdJQ0FnYVdZZ0tHVnVkSEo1TG1acGJtRnNiSGxNYjJNZ1BUMDlJR1pwYm1Gc2JIbE1iMk1wSUh0Y2JpQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTVqYjIxd2JHVjBaU2hsYm5SeWVTNWpiMjF3YkdWMGFXOXVMQ0JsYm5SeWVTNWhablJsY2t4dll5azdYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlMRnh1WEc0Z0lDQWdYQ0pqWVhSamFGd2lPaUJtZFc1amRHbHZiaUFvZEhKNVRHOWpLU0I3WEc0Z0lDQWdJQ0JtYjNJZ0tIWmhjaUJwSUQwZ2RHaHBjeTUwY25sRmJuUnlhV1Z6TG14bGJtZDBhQ0F0SURFN0lHa2dQajBnTURzZ0xTMXBLU0I3WEc0Z0lDQWdJQ0FnSUhaaGNpQmxiblJ5ZVNBOUlIUm9hWE11ZEhKNVJXNTBjbWxsYzF0cFhUdGNiaUFnSUNBZ0lDQWdhV1lnS0dWdWRISjVMblJ5ZVV4dll5QTlQVDBnZEhKNVRHOWpLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2RtRnlJSEpsWTI5eVpDQTlJR1Z1ZEhKNUxtTnZiWEJzWlhScGIyNDdYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tISmxZMjl5WkM1MGVYQmxJRDA5UFNCY0luUm9jbTkzWENJcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhaaGNpQjBhSEp2ZDI0Z1BTQnlaV052Y21RdVlYSm5PMXh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVnpaWFJVY25sRmJuUnllU2hsYm5SeWVTazdYRzRnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCMGFISnZkMjQ3WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0x5OGdWR2hsSUdOdmJuUmxlSFF1WTJGMFkyZ2diV1YwYUc5a0lHMTFjM1FnYjI1c2VTQmlaU0JqWVd4c1pXUWdkMmwwYUNCaElHeHZZMkYwYVc5dVhHNGdJQ0FnSUNBdkx5QmhjbWQxYldWdWRDQjBhR0YwSUdOdmNuSmxjM0J2Ym1SeklIUnZJR0VnYTI1dmQyNGdZMkYwWTJnZ1lteHZZMnN1WEc0Z0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9YQ0pwYkd4bFoyRnNJR05oZEdOb0lHRjBkR1Z0Y0hSY0lpazdYRzRnSUNBZ2ZTeGNibHh1SUNBZ0lHUmxiR1ZuWVhSbFdXbGxiR1E2SUdaMWJtTjBhVzl1SUdSbGJHVm5ZWFJsV1dsbGJHUW9hWFJsY21GaWJHVXNJSEpsYzNWc2RFNWhiV1VzSUc1bGVIUk1iMk1wSUh0Y2JpQWdJQ0FnSUhSb2FYTXVaR1ZzWldkaGRHVWdQU0I3WEc0Z0lDQWdJQ0FnSUdsMFpYSmhkRzl5T2lCMllXeDFaWE1vYVhSbGNtRmliR1VwTEZ4dUlDQWdJQ0FnSUNCeVpYTjFiSFJPWVcxbE9pQnlaWE4xYkhST1lXMWxMRnh1SUNBZ0lDQWdJQ0J1WlhoMFRHOWpPaUJ1WlhoMFRHOWpYRzRnSUNBZ0lDQjlPMXh1WEc0Z0lDQWdJQ0J5WlhSMWNtNGdRMjl1ZEdsdWRXVlRaVzUwYVc1bGJEdGNiaUFnSUNCOVhHNGdJSDA3WEc1OUtTaGNiaTh2SUVGdGIyNW5JSFJvWlNCMllYSnBiM1Z6SUhSeWFXTnJjeUJtYjNJZ2IySjBZV2x1YVc1bklHRWdjbVZtWlhKbGJtTmxJSFJ2SUhSb1pTQm5iRzlpWVd4Y2JpOHZJRzlpYW1WamRDd2dkR2hwY3lCelpXVnRjeUIwYnlCaVpTQjBhR1VnYlc5emRDQnlaV3hwWVdKc1pTQjBaV05vYm1seGRXVWdkR2hoZENCa2IyVnpJRzV2ZEZ4dUx5OGdkWE5sSUdsdVpHbHlaV04wSUdWMllXd2dLSGRvYVdOb0lIWnBiMnhoZEdWeklFTnZiblJsYm5RZ1UyVmpkWEpwZEhrZ1VHOXNhV041S1M1Y2JuUjVjR1Z2WmlCbmJHOWlZV3dnUFQwOUlGd2liMkpxWldOMFhDSWdQeUJuYkc5aVlXd2dPaUIwZVhCbGIyWWdkMmx1Wkc5M0lEMDlQU0JjSW05aWFtVmpkRndpSUQ4Z2QybHVaRzkzSURvZ2RXNWtaV1pwYm1Wa0tUc2lYWDA9IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiaWYgKHR5cGVvZiBNYXAgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgTWFwID0gZnVuY3Rpb24oKSB7IHRoaXMuY2xlYXIoKTsgfTtcbiAgTWFwLnByb3RvdHlwZSA9IHtcbiAgICBzZXQ6IGZ1bmN0aW9uKGssIHYpIHsgdGhpcy5fW2tdID0gdjsgcmV0dXJuIHRoaXM7IH0sXG4gICAgZ2V0OiBmdW5jdGlvbihrKSB7IHJldHVybiB0aGlzLl9ba107IH0sXG4gICAgaGFzOiBmdW5jdGlvbihrKSB7IHJldHVybiBrIGluIHRoaXMuXzsgfSxcbiAgICBkZWxldGU6IGZ1bmN0aW9uKGspIHsgcmV0dXJuIGsgaW4gdGhpcy5fICYmIGRlbGV0ZSB0aGlzLl9ba107IH0sXG4gICAgY2xlYXI6IGZ1bmN0aW9uKCkgeyB0aGlzLl8gPSBPYmplY3QuY3JlYXRlKG51bGwpOyB9LFxuICAgIGdldCBzaXplKCkgeyB2YXIgbiA9IDA7IGZvciAodmFyIGsgaW4gdGhpcy5fKSArK247IHJldHVybiBuOyB9LFxuICAgIGZvckVhY2g6IGZ1bmN0aW9uKGMpIHsgZm9yICh2YXIgayBpbiB0aGlzLl8pIGModGhpcy5fW2tdLCBrLCB0aGlzKTsgfVxuICB9O1xufVxuXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG4gIGZhY3RvcnkoKGdsb2JhbC5zY2FsZSA9IHt9KSk7XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxuICBmdW5jdGlvbiBhc2NlbmRpbmcoYSwgYikge1xuICAgIHJldHVybiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogYSA+PSBiID8gMCA6IE5hTjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFzY2VuZGluZ0NvbXBhcmF0b3IoZikge1xuICAgIHJldHVybiBmdW5jdGlvbihkLCB4KSB7XG4gICAgICByZXR1cm4gYXNjZW5kaW5nKGYoZCksIHgpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBiaXNlY3Rvcihjb21wYXJlKSB7XG4gICAgaWYgKGNvbXBhcmUubGVuZ3RoID09PSAxKSBjb21wYXJlID0gYXNjZW5kaW5nQ29tcGFyYXRvcihjb21wYXJlKTtcbiAgICByZXR1cm4ge1xuICAgICAgbGVmdDogZnVuY3Rpb24oYSwgeCwgbG8sIGhpKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykgbG8gPSAwO1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDQpIGhpID0gYS5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChsbyA8IGhpKSB7XG4gICAgICAgICAgdmFyIG1pZCA9IGxvICsgaGkgPj4+IDE7XG4gICAgICAgICAgaWYgKGNvbXBhcmUoYVttaWRdLCB4KSA8IDApIGxvID0gbWlkICsgMTtcbiAgICAgICAgICBlbHNlIGhpID0gbWlkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsbztcbiAgICAgIH0sXG4gICAgICByaWdodDogZnVuY3Rpb24oYSwgeCwgbG8sIGhpKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykgbG8gPSAwO1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDQpIGhpID0gYS5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChsbyA8IGhpKSB7XG4gICAgICAgICAgdmFyIG1pZCA9IGxvICsgaGkgPj4+IDE7XG4gICAgICAgICAgaWYgKGNvbXBhcmUoYVttaWRdLCB4KSA+IDApIGhpID0gbWlkO1xuICAgICAgICAgIGVsc2UgbG8gPSBtaWQgKyAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsbztcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgdmFyIGFzY2VuZGluZ0Jpc2VjdCA9IGJpc2VjdG9yKGFzY2VuZGluZyk7XG4gIHZhciBiaXNlY3RSaWdodCA9IGFzY2VuZGluZ0Jpc2VjdC5yaWdodDtcblxuICB2YXIgYmlzZWN0ID0gYmlzZWN0UmlnaHQ7XG5cbiAgZnVuY3Rpb24gbmV3VGhyZXNob2xkKGRvbWFpbiwgcmFuZ2UsIG4pIHtcblxuICAgIGZ1bmN0aW9uIHNjYWxlKHgpIHtcbiAgICAgIGlmICh4IDw9IHgpIHJldHVybiByYW5nZVtiaXNlY3QoZG9tYWluLCB4LCAwLCBuKV07XG4gICAgfVxuXG4gICAgc2NhbGUuZG9tYWluID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gZG9tYWluLnNsaWNlKCk7XG4gICAgICBkb21haW4gPSB4LnNsaWNlKCksIG4gPSBNYXRoLm1pbihkb21haW4ubGVuZ3RoLCByYW5nZS5sZW5ndGggLSAxKTtcbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9O1xuXG4gICAgc2NhbGUucmFuZ2UgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiByYW5nZS5zbGljZSgpO1xuICAgICAgcmFuZ2UgPSB4LnNsaWNlKCksIG4gPSBNYXRoLm1pbihkb21haW4ubGVuZ3RoLCByYW5nZS5sZW5ndGggLSAxKTtcbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9O1xuXG4gICAgc2NhbGUuaW52ZXJ0RXh0ZW50ID0gZnVuY3Rpb24oeSkge1xuICAgICAgcmV0dXJuIHkgPSByYW5nZS5pbmRleE9mKHkpLCBbZG9tYWluW3kgLSAxXSwgZG9tYWluW3ldXTtcbiAgICB9O1xuXG4gICAgc2NhbGUuY29weSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ld1RocmVzaG9sZChkb21haW4sIHJhbmdlKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHNjYWxlO1xuICB9XG5cbiAgZnVuY3Rpb24gdGhyZXNob2xkKCkge1xuICAgIHJldHVybiBuZXdUaHJlc2hvbGQoWy41XSwgWzAsIDFdLCAxKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlTnVtYmVyKGEsIGIpIHtcbiAgICByZXR1cm4gYSA9ICthLCBiIC09IGEsIGZ1bmN0aW9uKHQpIHtcbiAgICAgIHJldHVybiBhICsgYiAqIHQ7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlT2JqZWN0KGEsIGIpIHtcbiAgICB2YXIgaSA9IHt9LFxuICAgICAgICBjID0ge30sXG4gICAgICAgIGs7XG5cbiAgICBmb3IgKGsgaW4gYSkge1xuICAgICAgaWYgKGsgaW4gYikge1xuICAgICAgICBpW2tdID0gaW50ZXJwb2xhdGUoYVtrXSwgYltrXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjW2tdID0gYVtrXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGsgaW4gYikge1xuICAgICAgaWYgKCEoayBpbiBhKSkge1xuICAgICAgICBjW2tdID0gYltrXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgZm9yIChrIGluIGkpIGNba10gPSBpW2tdKHQpO1xuICAgICAgcmV0dXJuIGM7XG4gICAgfTtcbiAgfVxuXG5cbiAgLy8gVE9ETyBzcGFyc2UgYXJyYXlzP1xuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZUFycmF5KGEsIGIpIHtcbiAgICB2YXIgeCA9IFtdLFxuICAgICAgICBjID0gW10sXG4gICAgICAgIG5hID0gYS5sZW5ndGgsXG4gICAgICAgIG5iID0gYi5sZW5ndGgsXG4gICAgICAgIG4wID0gTWF0aC5taW4oYS5sZW5ndGgsIGIubGVuZ3RoKSxcbiAgICAgICAgaTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBuMDsgKytpKSB4LnB1c2goaW50ZXJwb2xhdGUoYVtpXSwgYltpXSkpO1xuICAgIGZvciAoOyBpIDwgbmE7ICsraSkgY1tpXSA9IGFbaV07XG4gICAgZm9yICg7IGkgPCBuYjsgKytpKSBjW2ldID0gYltpXTtcblxuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbjA7ICsraSkgY1tpXSA9IHhbaV0odCk7XG4gICAgICByZXR1cm4gYztcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gX2Zvcm1hdChyLCBnLCBiKSB7XG4gICAgaWYgKGlzTmFOKHIpKSByID0gMDtcbiAgICBpZiAoaXNOYU4oZykpIGcgPSAwO1xuICAgIGlmIChpc05hTihiKSkgYiA9IDA7XG4gICAgcmV0dXJuIFwiI1wiXG4gICAgICAgICsgKHIgPCAxNiA/IFwiMFwiICsgci50b1N0cmluZygxNikgOiByLnRvU3RyaW5nKDE2KSlcbiAgICAgICAgKyAoZyA8IDE2ID8gXCIwXCIgKyBnLnRvU3RyaW5nKDE2KSA6IGcudG9TdHJpbmcoMTYpKVxuICAgICAgICArIChiIDwgMTYgPyBcIjBcIiArIGIudG9TdHJpbmcoMTYpIDogYi50b1N0cmluZygxNikpO1xuICB9XG5cbiAgZnVuY3Rpb24gUmdiKHIsIGcsIGIpIHtcbiAgICB0aGlzLnIgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIE1hdGgucm91bmQocikpKTtcbiAgICB0aGlzLmcgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIE1hdGgucm91bmQoZykpKTtcbiAgICB0aGlzLmIgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIE1hdGgucm91bmQoYikpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbG9yKCkge31cblxuICBDb2xvci5wcm90b3R5cGUgPSB7XG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmdiKCkgKyBcIlwiO1xuICAgIH1cbiAgfTtcblxuICB2YXIgX3Byb3RvdHlwZSA9IFJnYi5wcm90b3R5cGUgPSBuZXcgQ29sb3I7XG5cbiAgdmFyIGRhcmtlciA9IC43O1xuXG4gIF9wcm90b3R5cGUuZGFya2VyID0gZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBkYXJrZXIgOiBNYXRoLnBvdyhkYXJrZXIsIGspO1xuICAgIHJldHVybiBuZXcgUmdiKHRoaXMuciAqIGssIHRoaXMuZyAqIGssIHRoaXMuYiAqIGspO1xuICB9O1xuXG4gIHZhciBicmlnaHRlciA9IDEgLyBkYXJrZXI7XG5cbiAgX3Byb3RvdHlwZS5icmlnaHRlciA9IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gYnJpZ2h0ZXIgOiBNYXRoLnBvdyhicmlnaHRlciwgayk7XG4gICAgcmV0dXJuIG5ldyBSZ2IodGhpcy5yICogaywgdGhpcy5nICogaywgdGhpcy5iICogayk7XG4gIH07XG5cbiAgX3Byb3RvdHlwZS5yZ2IgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBfcHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF9mb3JtYXQodGhpcy5yLCB0aGlzLmcsIHRoaXMuYik7XG4gIH07XG5cbiAgdmFyIG5hbWVkID0gKG5ldyBNYXApXG4gICAgICAuc2V0KFwiYWxpY2VibHVlXCIsIDB4ZjBmOGZmKVxuICAgICAgLnNldChcImFudGlxdWV3aGl0ZVwiLCAweGZhZWJkNylcbiAgICAgIC5zZXQoXCJhcXVhXCIsIDB4MDBmZmZmKVxuICAgICAgLnNldChcImFxdWFtYXJpbmVcIiwgMHg3ZmZmZDQpXG4gICAgICAuc2V0KFwiYXp1cmVcIiwgMHhmMGZmZmYpXG4gICAgICAuc2V0KFwiYmVpZ2VcIiwgMHhmNWY1ZGMpXG4gICAgICAuc2V0KFwiYmlzcXVlXCIsIDB4ZmZlNGM0KVxuICAgICAgLnNldChcImJsYWNrXCIsIDB4MDAwMDAwKVxuICAgICAgLnNldChcImJsYW5jaGVkYWxtb25kXCIsIDB4ZmZlYmNkKVxuICAgICAgLnNldChcImJsdWVcIiwgMHgwMDAwZmYpXG4gICAgICAuc2V0KFwiYmx1ZXZpb2xldFwiLCAweDhhMmJlMilcbiAgICAgIC5zZXQoXCJicm93blwiLCAweGE1MmEyYSlcbiAgICAgIC5zZXQoXCJidXJseXdvb2RcIiwgMHhkZWI4ODcpXG4gICAgICAuc2V0KFwiY2FkZXRibHVlXCIsIDB4NWY5ZWEwKVxuICAgICAgLnNldChcImNoYXJ0cmV1c2VcIiwgMHg3ZmZmMDApXG4gICAgICAuc2V0KFwiY2hvY29sYXRlXCIsIDB4ZDI2OTFlKVxuICAgICAgLnNldChcImNvcmFsXCIsIDB4ZmY3ZjUwKVxuICAgICAgLnNldChcImNvcm5mbG93ZXJibHVlXCIsIDB4NjQ5NWVkKVxuICAgICAgLnNldChcImNvcm5zaWxrXCIsIDB4ZmZmOGRjKVxuICAgICAgLnNldChcImNyaW1zb25cIiwgMHhkYzE0M2MpXG4gICAgICAuc2V0KFwiY3lhblwiLCAweDAwZmZmZilcbiAgICAgIC5zZXQoXCJkYXJrYmx1ZVwiLCAweDAwMDA4YilcbiAgICAgIC5zZXQoXCJkYXJrY3lhblwiLCAweDAwOGI4YilcbiAgICAgIC5zZXQoXCJkYXJrZ29sZGVucm9kXCIsIDB4Yjg4NjBiKVxuICAgICAgLnNldChcImRhcmtncmF5XCIsIDB4YTlhOWE5KVxuICAgICAgLnNldChcImRhcmtncmVlblwiLCAweDAwNjQwMClcbiAgICAgIC5zZXQoXCJkYXJrZ3JleVwiLCAweGE5YTlhOSlcbiAgICAgIC5zZXQoXCJkYXJra2hha2lcIiwgMHhiZGI3NmIpXG4gICAgICAuc2V0KFwiZGFya21hZ2VudGFcIiwgMHg4YjAwOGIpXG4gICAgICAuc2V0KFwiZGFya29saXZlZ3JlZW5cIiwgMHg1NTZiMmYpXG4gICAgICAuc2V0KFwiZGFya29yYW5nZVwiLCAweGZmOGMwMClcbiAgICAgIC5zZXQoXCJkYXJrb3JjaGlkXCIsIDB4OTkzMmNjKVxuICAgICAgLnNldChcImRhcmtyZWRcIiwgMHg4YjAwMDApXG4gICAgICAuc2V0KFwiZGFya3NhbG1vblwiLCAweGU5OTY3YSlcbiAgICAgIC5zZXQoXCJkYXJrc2VhZ3JlZW5cIiwgMHg4ZmJjOGYpXG4gICAgICAuc2V0KFwiZGFya3NsYXRlYmx1ZVwiLCAweDQ4M2Q4YilcbiAgICAgIC5zZXQoXCJkYXJrc2xhdGVncmF5XCIsIDB4MmY0ZjRmKVxuICAgICAgLnNldChcImRhcmtzbGF0ZWdyZXlcIiwgMHgyZjRmNGYpXG4gICAgICAuc2V0KFwiZGFya3R1cnF1b2lzZVwiLCAweDAwY2VkMSlcbiAgICAgIC5zZXQoXCJkYXJrdmlvbGV0XCIsIDB4OTQwMGQzKVxuICAgICAgLnNldChcImRlZXBwaW5rXCIsIDB4ZmYxNDkzKVxuICAgICAgLnNldChcImRlZXBza3libHVlXCIsIDB4MDBiZmZmKVxuICAgICAgLnNldChcImRpbWdyYXlcIiwgMHg2OTY5NjkpXG4gICAgICAuc2V0KFwiZGltZ3JleVwiLCAweDY5Njk2OSlcbiAgICAgIC5zZXQoXCJkb2RnZXJibHVlXCIsIDB4MWU5MGZmKVxuICAgICAgLnNldChcImZpcmVicmlja1wiLCAweGIyMjIyMilcbiAgICAgIC5zZXQoXCJmbG9yYWx3aGl0ZVwiLCAweGZmZmFmMClcbiAgICAgIC5zZXQoXCJmb3Jlc3RncmVlblwiLCAweDIyOGIyMilcbiAgICAgIC5zZXQoXCJmdWNoc2lhXCIsIDB4ZmYwMGZmKVxuICAgICAgLnNldChcImdhaW5zYm9yb1wiLCAweGRjZGNkYylcbiAgICAgIC5zZXQoXCJnaG9zdHdoaXRlXCIsIDB4ZjhmOGZmKVxuICAgICAgLnNldChcImdvbGRcIiwgMHhmZmQ3MDApXG4gICAgICAuc2V0KFwiZ29sZGVucm9kXCIsIDB4ZGFhNTIwKVxuICAgICAgLnNldChcImdyYXlcIiwgMHg4MDgwODApXG4gICAgICAuc2V0KFwiZ3JlZW5cIiwgMHgwMDgwMDApXG4gICAgICAuc2V0KFwiZ3JlZW55ZWxsb3dcIiwgMHhhZGZmMmYpXG4gICAgICAuc2V0KFwiZ3JleVwiLCAweDgwODA4MClcbiAgICAgIC5zZXQoXCJob25leWRld1wiLCAweGYwZmZmMClcbiAgICAgIC5zZXQoXCJob3RwaW5rXCIsIDB4ZmY2OWI0KVxuICAgICAgLnNldChcImluZGlhbnJlZFwiLCAweGNkNWM1YylcbiAgICAgIC5zZXQoXCJpbmRpZ29cIiwgMHg0YjAwODIpXG4gICAgICAuc2V0KFwiaXZvcnlcIiwgMHhmZmZmZjApXG4gICAgICAuc2V0KFwia2hha2lcIiwgMHhmMGU2OGMpXG4gICAgICAuc2V0KFwibGF2ZW5kZXJcIiwgMHhlNmU2ZmEpXG4gICAgICAuc2V0KFwibGF2ZW5kZXJibHVzaFwiLCAweGZmZjBmNSlcbiAgICAgIC5zZXQoXCJsYXduZ3JlZW5cIiwgMHg3Y2ZjMDApXG4gICAgICAuc2V0KFwibGVtb25jaGlmZm9uXCIsIDB4ZmZmYWNkKVxuICAgICAgLnNldChcImxpZ2h0Ymx1ZVwiLCAweGFkZDhlNilcbiAgICAgIC5zZXQoXCJsaWdodGNvcmFsXCIsIDB4ZjA4MDgwKVxuICAgICAgLnNldChcImxpZ2h0Y3lhblwiLCAweGUwZmZmZilcbiAgICAgIC5zZXQoXCJsaWdodGdvbGRlbnJvZHllbGxvd1wiLCAweGZhZmFkMilcbiAgICAgIC5zZXQoXCJsaWdodGdyYXlcIiwgMHhkM2QzZDMpXG4gICAgICAuc2V0KFwibGlnaHRncmVlblwiLCAweDkwZWU5MClcbiAgICAgIC5zZXQoXCJsaWdodGdyZXlcIiwgMHhkM2QzZDMpXG4gICAgICAuc2V0KFwibGlnaHRwaW5rXCIsIDB4ZmZiNmMxKVxuICAgICAgLnNldChcImxpZ2h0c2FsbW9uXCIsIDB4ZmZhMDdhKVxuICAgICAgLnNldChcImxpZ2h0c2VhZ3JlZW5cIiwgMHgyMGIyYWEpXG4gICAgICAuc2V0KFwibGlnaHRza3libHVlXCIsIDB4ODdjZWZhKVxuICAgICAgLnNldChcImxpZ2h0c2xhdGVncmF5XCIsIDB4Nzc4ODk5KVxuICAgICAgLnNldChcImxpZ2h0c2xhdGVncmV5XCIsIDB4Nzc4ODk5KVxuICAgICAgLnNldChcImxpZ2h0c3RlZWxibHVlXCIsIDB4YjBjNGRlKVxuICAgICAgLnNldChcImxpZ2h0eWVsbG93XCIsIDB4ZmZmZmUwKVxuICAgICAgLnNldChcImxpbWVcIiwgMHgwMGZmMDApXG4gICAgICAuc2V0KFwibGltZWdyZWVuXCIsIDB4MzJjZDMyKVxuICAgICAgLnNldChcImxpbmVuXCIsIDB4ZmFmMGU2KVxuICAgICAgLnNldChcIm1hZ2VudGFcIiwgMHhmZjAwZmYpXG4gICAgICAuc2V0KFwibWFyb29uXCIsIDB4ODAwMDAwKVxuICAgICAgLnNldChcIm1lZGl1bWFxdWFtYXJpbmVcIiwgMHg2NmNkYWEpXG4gICAgICAuc2V0KFwibWVkaXVtYmx1ZVwiLCAweDAwMDBjZClcbiAgICAgIC5zZXQoXCJtZWRpdW1vcmNoaWRcIiwgMHhiYTU1ZDMpXG4gICAgICAuc2V0KFwibWVkaXVtcHVycGxlXCIsIDB4OTM3MGRiKVxuICAgICAgLnNldChcIm1lZGl1bXNlYWdyZWVuXCIsIDB4M2NiMzcxKVxuICAgICAgLnNldChcIm1lZGl1bXNsYXRlYmx1ZVwiLCAweDdiNjhlZSlcbiAgICAgIC5zZXQoXCJtZWRpdW1zcHJpbmdncmVlblwiLCAweDAwZmE5YSlcbiAgICAgIC5zZXQoXCJtZWRpdW10dXJxdW9pc2VcIiwgMHg0OGQxY2MpXG4gICAgICAuc2V0KFwibWVkaXVtdmlvbGV0cmVkXCIsIDB4YzcxNTg1KVxuICAgICAgLnNldChcIm1pZG5pZ2h0Ymx1ZVwiLCAweDE5MTk3MClcbiAgICAgIC5zZXQoXCJtaW50Y3JlYW1cIiwgMHhmNWZmZmEpXG4gICAgICAuc2V0KFwibWlzdHlyb3NlXCIsIDB4ZmZlNGUxKVxuICAgICAgLnNldChcIm1vY2Nhc2luXCIsIDB4ZmZlNGI1KVxuICAgICAgLnNldChcIm5hdmFqb3doaXRlXCIsIDB4ZmZkZWFkKVxuICAgICAgLnNldChcIm5hdnlcIiwgMHgwMDAwODApXG4gICAgICAuc2V0KFwib2xkbGFjZVwiLCAweGZkZjVlNilcbiAgICAgIC5zZXQoXCJvbGl2ZVwiLCAweDgwODAwMClcbiAgICAgIC5zZXQoXCJvbGl2ZWRyYWJcIiwgMHg2YjhlMjMpXG4gICAgICAuc2V0KFwib3JhbmdlXCIsIDB4ZmZhNTAwKVxuICAgICAgLnNldChcIm9yYW5nZXJlZFwiLCAweGZmNDUwMClcbiAgICAgIC5zZXQoXCJvcmNoaWRcIiwgMHhkYTcwZDYpXG4gICAgICAuc2V0KFwicGFsZWdvbGRlbnJvZFwiLCAweGVlZThhYSlcbiAgICAgIC5zZXQoXCJwYWxlZ3JlZW5cIiwgMHg5OGZiOTgpXG4gICAgICAuc2V0KFwicGFsZXR1cnF1b2lzZVwiLCAweGFmZWVlZSlcbiAgICAgIC5zZXQoXCJwYWxldmlvbGV0cmVkXCIsIDB4ZGI3MDkzKVxuICAgICAgLnNldChcInBhcGF5YXdoaXBcIiwgMHhmZmVmZDUpXG4gICAgICAuc2V0KFwicGVhY2hwdWZmXCIsIDB4ZmZkYWI5KVxuICAgICAgLnNldChcInBlcnVcIiwgMHhjZDg1M2YpXG4gICAgICAuc2V0KFwicGlua1wiLCAweGZmYzBjYilcbiAgICAgIC5zZXQoXCJwbHVtXCIsIDB4ZGRhMGRkKVxuICAgICAgLnNldChcInBvd2RlcmJsdWVcIiwgMHhiMGUwZTYpXG4gICAgICAuc2V0KFwicHVycGxlXCIsIDB4ODAwMDgwKVxuICAgICAgLnNldChcInJlYmVjY2FwdXJwbGVcIiwgMHg2NjMzOTkpXG4gICAgICAuc2V0KFwicmVkXCIsIDB4ZmYwMDAwKVxuICAgICAgLnNldChcInJvc3licm93blwiLCAweGJjOGY4ZilcbiAgICAgIC5zZXQoXCJyb3lhbGJsdWVcIiwgMHg0MTY5ZTEpXG4gICAgICAuc2V0KFwic2FkZGxlYnJvd25cIiwgMHg4YjQ1MTMpXG4gICAgICAuc2V0KFwic2FsbW9uXCIsIDB4ZmE4MDcyKVxuICAgICAgLnNldChcInNhbmR5YnJvd25cIiwgMHhmNGE0NjApXG4gICAgICAuc2V0KFwic2VhZ3JlZW5cIiwgMHgyZThiNTcpXG4gICAgICAuc2V0KFwic2Vhc2hlbGxcIiwgMHhmZmY1ZWUpXG4gICAgICAuc2V0KFwic2llbm5hXCIsIDB4YTA1MjJkKVxuICAgICAgLnNldChcInNpbHZlclwiLCAweGMwYzBjMClcbiAgICAgIC5zZXQoXCJza3libHVlXCIsIDB4ODdjZWViKVxuICAgICAgLnNldChcInNsYXRlYmx1ZVwiLCAweDZhNWFjZClcbiAgICAgIC5zZXQoXCJzbGF0ZWdyYXlcIiwgMHg3MDgwOTApXG4gICAgICAuc2V0KFwic2xhdGVncmV5XCIsIDB4NzA4MDkwKVxuICAgICAgLnNldChcInNub3dcIiwgMHhmZmZhZmEpXG4gICAgICAuc2V0KFwic3ByaW5nZ3JlZW5cIiwgMHgwMGZmN2YpXG4gICAgICAuc2V0KFwic3RlZWxibHVlXCIsIDB4NDY4MmI0KVxuICAgICAgLnNldChcInRhblwiLCAweGQyYjQ4YylcbiAgICAgIC5zZXQoXCJ0ZWFsXCIsIDB4MDA4MDgwKVxuICAgICAgLnNldChcInRoaXN0bGVcIiwgMHhkOGJmZDgpXG4gICAgICAuc2V0KFwidG9tYXRvXCIsIDB4ZmY2MzQ3KVxuICAgICAgLnNldChcInR1cnF1b2lzZVwiLCAweDQwZTBkMClcbiAgICAgIC5zZXQoXCJ2aW9sZXRcIiwgMHhlZTgyZWUpXG4gICAgICAuc2V0KFwid2hlYXRcIiwgMHhmNWRlYjMpXG4gICAgICAuc2V0KFwid2hpdGVcIiwgMHhmZmZmZmYpXG4gICAgICAuc2V0KFwid2hpdGVzbW9rZVwiLCAweGY1ZjVmNSlcbiAgICAgIC5zZXQoXCJ5ZWxsb3dcIiwgMHhmZmZmMDApXG4gICAgICAuc2V0KFwieWVsbG93Z3JlZW5cIiwgMHg5YWNkMzIpO1xuXG4gIGZ1bmN0aW9uIHJnYm4obikge1xuICAgIHJldHVybiByZ2IobiA+PiAxNiAmIDB4ZmYsIG4gPj4gOCAmIDB4ZmYsIG4gJiAweGZmKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIEhzbChoLCBzLCBsKSB7XG4gICAgdGhpcy5oID0gK2g7XG4gICAgdGhpcy5zID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgK3MpKTtcbiAgICB0aGlzLmwgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCArbCkpO1xuICB9XG5cbiAgdmFyIHByb3RvdHlwZSA9IEhzbC5wcm90b3R5cGUgPSBuZXcgQ29sb3I7XG5cbiAgcHJvdG90eXBlLmJyaWdodGVyID0gZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBicmlnaHRlciA6IE1hdGgucG93KGJyaWdodGVyLCBrKTtcbiAgICByZXR1cm4gbmV3IEhzbCh0aGlzLmgsIHRoaXMucywgdGhpcy5sICogayk7XG4gIH07XG5cbiAgcHJvdG90eXBlLmRhcmtlciA9IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gZGFya2VyIDogTWF0aC5wb3coZGFya2VyLCBrKTtcbiAgICByZXR1cm4gbmV3IEhzbCh0aGlzLmgsIHRoaXMucywgdGhpcy5sICogayk7XG4gIH07XG5cblxuICAvKiBGcm9tIEZ2RCAxMy4zNywgQ1NTIENvbG9yIE1vZHVsZSBMZXZlbCAzICovXG4gIGZ1bmN0aW9uIGhzbDJyZ2IoaCwgbTEsIG0yKSB7XG4gICAgcmV0dXJuIChoIDwgNjAgPyBtMSArIChtMiAtIG0xKSAqIGggLyA2MFxuICAgICAgICA6IGggPCAxODAgPyBtMlxuICAgICAgICA6IGggPCAyNDAgPyBtMSArIChtMiAtIG0xKSAqICgyNDAgLSBoKSAvIDYwXG4gICAgICAgIDogbTEpICogMjU1O1xuICB9XG5cbiAgcHJvdG90eXBlLnJnYiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBoID0gdGhpcy5oICUgMzYwICsgKHRoaXMuaCA8IDApICogMzYwLFxuICAgICAgICBzID0gaXNOYU4oaCkgfHwgaXNOYU4odGhpcy5zKSA/IDAgOiB0aGlzLnMsXG4gICAgICAgIGwgPSB0aGlzLmwsXG4gICAgICAgIG0yID0gbCA8PSAuNSA/IGwgKiAoMSArIHMpIDogbCArIHMgLSBsICogcyxcbiAgICAgICAgbTEgPSAyICogbCAtIG0yO1xuICAgIHJldHVybiBuZXcgUmdiKFxuICAgICAgaHNsMnJnYihoID49IDI0MCA/IGggLSAyNDAgOiBoICsgMTIwLCBtMSwgbTIpLFxuICAgICAgaHNsMnJnYihoLCBtMSwgbTIpLFxuICAgICAgaHNsMnJnYihoIDwgMTIwID8gaCArIDI0MCA6IGggLSAxMjAsIG0xLCBtMilcbiAgICApO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGhzbChoLCBzLCBsKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGlmIChoIGluc3RhbmNlb2YgSHNsKSB7XG4gICAgICAgIGwgPSBoLmw7XG4gICAgICAgIHMgPSBoLnM7XG4gICAgICAgIGggPSBoLmg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIShoIGluc3RhbmNlb2YgQ29sb3IpKSBoID0gY29sb3IoaCk7XG4gICAgICAgIGlmIChoKSB7XG4gICAgICAgICAgaWYgKGggaW5zdGFuY2VvZiBIc2wpIHJldHVybiBoO1xuICAgICAgICAgIGggPSBoLnJnYigpO1xuICAgICAgICAgIHZhciByID0gaC5yIC8gMjU1LFxuICAgICAgICAgICAgICBnID0gaC5nIC8gMjU1LFxuICAgICAgICAgICAgICBiID0gaC5iIC8gMjU1LFxuICAgICAgICAgICAgICBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKSxcbiAgICAgICAgICAgICAgbWF4ID0gTWF0aC5tYXgociwgZywgYiksXG4gICAgICAgICAgICAgIHJhbmdlID0gbWF4IC0gbWluO1xuICAgICAgICAgIGwgPSAobWF4ICsgbWluKSAvIDI7XG4gICAgICAgICAgaWYgKHJhbmdlKSB7XG4gICAgICAgICAgICBzID0gbCA8IC41ID8gcmFuZ2UgLyAobWF4ICsgbWluKSA6IHJhbmdlIC8gKDIgLSBtYXggLSBtaW4pO1xuICAgICAgICAgICAgaWYgKHIgPT09IG1heCkgaCA9IChnIC0gYikgLyByYW5nZSArIChnIDwgYikgKiA2O1xuICAgICAgICAgICAgZWxzZSBpZiAoZyA9PT0gbWF4KSBoID0gKGIgLSByKSAvIHJhbmdlICsgMjtcbiAgICAgICAgICAgIGVsc2UgaCA9IChyIC0gZykgLyByYW5nZSArIDQ7XG4gICAgICAgICAgICBoICo9IDYwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoID0gTmFOO1xuICAgICAgICAgICAgcyA9IGwgPiAwICYmIGwgPCAxID8gMCA6IGg7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGggPSBzID0gbCA9IE5hTjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IEhzbChoLCBzLCBsKTtcbiAgfVxuXG4gIHZhciByZUhzbFBlcmNlbnQgPSAvXmhzbFxcKFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccypcXCkkLztcblxuICB2YXIgcmVSZ2JQZXJjZW50ID0gL15yZ2JcXChcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKixcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKixcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKlxcKSQvO1xuXG4gIHZhciByZVJnYkludGVnZXIgPSAvXnJnYlxcKFxccyooWy0rXT9cXGQrKVxccyosXFxzKihbLStdP1xcZCspXFxzKixcXHMqKFstK10/XFxkKylcXHMqXFwpJC87XG5cbiAgdmFyIHJlSGV4NiA9IC9eIyhbMC05YS1mXXs2fSkkLztcblxuICB2YXIgcmVIZXgzID0gL14jKFswLTlhLWZdezN9KSQvO1xuXG4gIGZ1bmN0aW9uIGNvbG9yKGZvcm1hdCkge1xuICAgIHZhciBtO1xuICAgIGZvcm1hdCA9IChmb3JtYXQgKyBcIlwiKS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gKG0gPSByZUhleDMuZXhlYyhmb3JtYXQpKSA/IChtID0gcGFyc2VJbnQobVsxXSwgMTYpLCByZ2IoKG0gPj4gOCAmIDB4ZikgfCAobSA+PiA0ICYgMHgwZjApLCAobSA+PiA0ICYgMHhmKSB8IChtICYgMHhmMCksICgobSAmIDB4ZikgPDwgNCkgfCAobSAmIDB4ZikpKSAvLyAjZjAwXG4gICAgICAgIDogKG0gPSByZUhleDYuZXhlYyhmb3JtYXQpKSA/IHJnYm4ocGFyc2VJbnQobVsxXSwgMTYpKSAvLyAjZmYwMDAwXG4gICAgICAgIDogKG0gPSByZVJnYkludGVnZXIuZXhlYyhmb3JtYXQpKSA/IHJnYihtWzFdLCBtWzJdLCBtWzNdKSAvLyByZ2IoMjU1LDAsMClcbiAgICAgICAgOiAobSA9IHJlUmdiUGVyY2VudC5leGVjKGZvcm1hdCkpID8gcmdiKG1bMV0gKiAyLjU1LCBtWzJdICogMi41NSwgbVszXSAqIDIuNTUpIC8vIHJnYigxMDAlLDAlLDAlKVxuICAgICAgICA6IChtID0gcmVIc2xQZXJjZW50LmV4ZWMoZm9ybWF0KSkgPyBoc2wobVsxXSwgbVsyXSAqIC4wMSwgbVszXSAqIC4wMSkgLy8gaHNsKDEyMCw1MCUsNTAlKVxuICAgICAgICA6IG5hbWVkLmhhcyhmb3JtYXQpID8gcmdibihuYW1lZC5nZXQoZm9ybWF0KSlcbiAgICAgICAgOiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gcmdiKHIsIGcsIGIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKCEociBpbnN0YW5jZW9mIENvbG9yKSkgciA9IGNvbG9yKHIpO1xuICAgICAgaWYgKHIpIHtcbiAgICAgICAgciA9IHIucmdiKCk7XG4gICAgICAgIGIgPSByLmI7XG4gICAgICAgIGcgPSByLmc7XG4gICAgICAgIHIgPSByLnI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByID0gZyA9IGIgPSBOYU47XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgUmdiKHIsIGcsIGIpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW50ZXJwb2xhdGVSZ2IoYSwgYikge1xuICAgIGEgPSByZ2IoYSk7XG4gICAgYiA9IHJnYihiKTtcbiAgICB2YXIgYXIgPSBhLnIsXG4gICAgICAgIGFnID0gYS5nLFxuICAgICAgICBhYiA9IGEuYixcbiAgICAgICAgYnIgPSBiLnIgLSBhcixcbiAgICAgICAgYmcgPSBiLmcgLSBhZyxcbiAgICAgICAgYmIgPSBiLmIgLSBhYjtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgcmV0dXJuIF9mb3JtYXQoTWF0aC5yb3VuZChhciArIGJyICogdCksIE1hdGgucm91bmQoYWcgKyBiZyAqIHQpLCBNYXRoLnJvdW5kKGFiICsgYmIgKiB0KSk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlMChiKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGI7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlMShiKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIHJldHVybiBiKHQpICsgXCJcIjtcbiAgICB9O1xuICB9XG5cbiAgdmFyIHJlQSA9IC9bLStdPyg/OlxcZCtcXC4/XFxkKnxcXC4/XFxkKykoPzpbZUVdWy0rXT9cXGQrKT8vZztcbiAgdmFyIHJlQiA9IG5ldyBSZWdFeHAocmVBLnNvdXJjZSwgXCJnXCIpO1xuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlU3RyaW5nKGEsIGIpIHtcbiAgICB2YXIgYmkgPSByZUEubGFzdEluZGV4ID0gcmVCLmxhc3RJbmRleCA9IDAsIC8vIHNjYW4gaW5kZXggZm9yIG5leHQgbnVtYmVyIGluIGJcbiAgICAgICAgYW0sIC8vIGN1cnJlbnQgbWF0Y2ggaW4gYVxuICAgICAgICBibSwgLy8gY3VycmVudCBtYXRjaCBpbiBiXG4gICAgICAgIGJzLCAvLyBzdHJpbmcgcHJlY2VkaW5nIGN1cnJlbnQgbnVtYmVyIGluIGIsIGlmIGFueVxuICAgICAgICBpID0gLTEsIC8vIGluZGV4IGluIHNcbiAgICAgICAgcyA9IFtdLCAvLyBzdHJpbmcgY29uc3RhbnRzIGFuZCBwbGFjZWhvbGRlcnNcbiAgICAgICAgcSA9IFtdOyAvLyBudW1iZXIgaW50ZXJwb2xhdG9yc1xuXG4gICAgLy8gQ29lcmNlIGlucHV0cyB0byBzdHJpbmdzLlxuICAgIGEgPSBhICsgXCJcIiwgYiA9IGIgKyBcIlwiO1xuXG4gICAgLy8gSW50ZXJwb2xhdGUgcGFpcnMgb2YgbnVtYmVycyBpbiBhICYgYi5cbiAgICB3aGlsZSAoKGFtID0gcmVBLmV4ZWMoYSkpXG4gICAgICAgICYmIChibSA9IHJlQi5leGVjKGIpKSkge1xuICAgICAgaWYgKChicyA9IGJtLmluZGV4KSA+IGJpKSB7IC8vIGEgc3RyaW5nIHByZWNlZGVzIHRoZSBuZXh0IG51bWJlciBpbiBiXG4gICAgICAgIGJzID0gYi5zbGljZShiaSwgYnMpO1xuICAgICAgICBpZiAoc1tpXSkgc1tpXSArPSBiczsgLy8gY29hbGVzY2Ugd2l0aCBwcmV2aW91cyBzdHJpbmdcbiAgICAgICAgZWxzZSBzWysraV0gPSBicztcbiAgICAgIH1cbiAgICAgIGlmICgoYW0gPSBhbVswXSkgPT09IChibSA9IGJtWzBdKSkgeyAvLyBudW1iZXJzIGluIGEgJiBiIG1hdGNoXG4gICAgICAgIGlmIChzW2ldKSBzW2ldICs9IGJtOyAvLyBjb2FsZXNjZSB3aXRoIHByZXZpb3VzIHN0cmluZ1xuICAgICAgICBlbHNlIHNbKytpXSA9IGJtO1xuICAgICAgfSBlbHNlIHsgLy8gaW50ZXJwb2xhdGUgbm9uLW1hdGNoaW5nIG51bWJlcnNcbiAgICAgICAgc1srK2ldID0gbnVsbDtcbiAgICAgICAgcS5wdXNoKHtpOiBpLCB4OiBpbnRlcnBvbGF0ZU51bWJlcihhbSwgYm0pfSk7XG4gICAgICB9XG4gICAgICBiaSA9IHJlQi5sYXN0SW5kZXg7XG4gICAgfVxuXG4gICAgLy8gQWRkIHJlbWFpbnMgb2YgYi5cbiAgICBpZiAoYmkgPCBiLmxlbmd0aCkge1xuICAgICAgYnMgPSBiLnNsaWNlKGJpKTtcbiAgICAgIGlmIChzW2ldKSBzW2ldICs9IGJzOyAvLyBjb2FsZXNjZSB3aXRoIHByZXZpb3VzIHN0cmluZ1xuICAgICAgZWxzZSBzWysraV0gPSBicztcbiAgICB9XG5cbiAgICAvLyBTcGVjaWFsIG9wdGltaXphdGlvbiBmb3Igb25seSBhIHNpbmdsZSBtYXRjaC5cbiAgICAvLyBPdGhlcndpc2UsIGludGVycG9sYXRlIGVhY2ggb2YgdGhlIG51bWJlcnMgYW5kIHJlam9pbiB0aGUgc3RyaW5nLlxuICAgIHJldHVybiBzLmxlbmd0aCA8IDIgPyAocVswXVxuICAgICAgICA/IGludGVycG9sYXRlMShxWzBdLngpXG4gICAgICAgIDogaW50ZXJwb2xhdGUwKGIpKVxuICAgICAgICA6IChiID0gcS5sZW5ndGgsIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBvOyBpIDwgYjsgKytpKSBzWyhvID0gcVtpXSkuaV0gPSBvLngodCk7XG4gICAgICAgICAgICByZXR1cm4gcy5qb2luKFwiXCIpO1xuICAgICAgICAgIH0pO1xuICB9XG5cbiAgdmFyIGludGVycG9sYXRvcnMgPSBbXG4gICAgZnVuY3Rpb24oYSwgYikge1xuICAgICAgdmFyIHQgPSB0eXBlb2YgYiwgYztcbiAgICAgIHJldHVybiAodCA9PT0gXCJzdHJpbmdcIiA/ICgoYyA9IGNvbG9yKGIpKSA/IChiID0gYywgaW50ZXJwb2xhdGVSZ2IpIDogaW50ZXJwb2xhdGVTdHJpbmcpXG4gICAgICAgICAgOiBiIGluc3RhbmNlb2YgY29sb3IgPyBpbnRlcnBvbGF0ZVJnYlxuICAgICAgICAgIDogQXJyYXkuaXNBcnJheShiKSA/IGludGVycG9sYXRlQXJyYXlcbiAgICAgICAgICA6IHQgPT09IFwib2JqZWN0XCIgJiYgaXNOYU4oYikgPyBpbnRlcnBvbGF0ZU9iamVjdFxuICAgICAgICAgIDogaW50ZXJwb2xhdGVOdW1iZXIpKGEsIGIpO1xuICAgIH1cbiAgXTtcblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZShhLCBiKSB7XG4gICAgdmFyIGkgPSBpbnRlcnBvbGF0b3JzLmxlbmd0aCwgZjtcbiAgICB3aGlsZSAoLS1pID49IDAgJiYgIShmID0gaW50ZXJwb2xhdG9yc1tpXShhLCBiKSkpO1xuICAgIHJldHVybiBmO1xuICB9XG5cbiAgdmFyIGUyID0gTWF0aC5zcXJ0KDIpO1xuXG4gIHZhciBlNSA9IE1hdGguc3FydCgxMCk7XG5cbiAgdmFyIGUxMCA9IE1hdGguc3FydCg1MCk7XG5cbiAgZnVuY3Rpb24gdGlja1JhbmdlKGRvbWFpbiwgY291bnQpIHtcbiAgICBpZiAoY291bnQgPT0gbnVsbCkgY291bnQgPSAxMDtcblxuICAgIHZhciBzdGFydCA9IGRvbWFpblswXSxcbiAgICAgICAgc3RvcCA9IGRvbWFpbltkb21haW4ubGVuZ3RoIC0gMV07XG5cbiAgICBpZiAoc3RvcCA8IHN0YXJ0KSBlcnJvciA9IHN0b3AsIHN0b3AgPSBzdGFydCwgc3RhcnQgPSBlcnJvcjtcblxuICAgIHZhciBzcGFuID0gc3RvcCAtIHN0YXJ0LFxuICAgICAgICBzdGVwID0gTWF0aC5wb3coMTAsIE1hdGguZmxvb3IoTWF0aC5sb2coc3BhbiAvIGNvdW50KSAvIE1hdGguTE4xMCkpLFxuICAgICAgICBlcnJvciA9IHNwYW4gLyBjb3VudCAvIHN0ZXA7XG5cbiAgICAvLyBGaWx0ZXIgdGlja3MgdG8gZ2V0IGNsb3NlciB0byB0aGUgZGVzaXJlZCBjb3VudC5cbiAgICBpZiAoZXJyb3IgPj0gZTEwKSBzdGVwICo9IDEwO1xuICAgIGVsc2UgaWYgKGVycm9yID49IGU1KSBzdGVwICo9IDU7XG4gICAgZWxzZSBpZiAoZXJyb3IgPj0gZTIpIHN0ZXAgKj0gMjtcblxuICAgIC8vIFJvdW5kIHN0YXJ0IGFuZCBzdG9wIHZhbHVlcyB0byBzdGVwIGludGVydmFsLlxuICAgIHJldHVybiBbXG4gICAgICBNYXRoLmNlaWwoc3RhcnQgLyBzdGVwKSAqIHN0ZXAsXG4gICAgICBNYXRoLmZsb29yKHN0b3AgLyBzdGVwKSAqIHN0ZXAgKyBzdGVwIC8gMiwgLy8gaW5jbHVzaXZlXG4gICAgICBzdGVwXG4gICAgXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5pY2UoZG9tYWluLCBzdGVwKSB7XG4gICAgZG9tYWluID0gZG9tYWluLnNsaWNlKCk7XG4gICAgaWYgKCFzdGVwKSByZXR1cm4gZG9tYWluO1xuXG4gICAgdmFyIGkwID0gMCxcbiAgICAgICAgaTEgPSBkb21haW4ubGVuZ3RoIC0gMSxcbiAgICAgICAgeDAgPSBkb21haW5baTBdLFxuICAgICAgICB4MSA9IGRvbWFpbltpMV0sXG4gICAgICAgIGR4O1xuXG4gICAgaWYgKHgxIDwgeDApIHtcbiAgICAgIGR4ID0gaTAsIGkwID0gaTEsIGkxID0gZHg7XG4gICAgICBkeCA9IHgwLCB4MCA9IHgxLCB4MSA9IGR4O1xuICAgIH1cblxuICAgIGRvbWFpbltpMF0gPSBNYXRoLmZsb29yKHgwIC8gc3RlcCkgKiBzdGVwO1xuICAgIGRvbWFpbltpMV0gPSBNYXRoLmNlaWwoeDEgLyBzdGVwKSAqIHN0ZXA7XG4gICAgcmV0dXJuIGRvbWFpbjtcbiAgfVxuXG4gIHZhciBwcmVmaXhlcyA9IFtcInlcIixcInpcIixcImFcIixcImZcIixcInBcIixcIm5cIixcIsK1XCIsXCJtXCIsXCJcIixcImtcIixcIk1cIixcIkdcIixcIlRcIixcIlBcIixcIkVcIixcIlpcIixcIllcIl07XG5cblxuICAvLyBDb21wdXRlcyB0aGUgZGVjaW1hbCBjb2VmZmljaWVudCBhbmQgZXhwb25lbnQgb2YgdGhlIHNwZWNpZmllZCBudW1iZXIgeCB3aXRoXG4gIC8vIHNpZ25pZmljYW50IGRpZ2l0cyBwLCB3aGVyZSB4IGlzIHBvc2l0aXZlIGFuZCBwIGlzIGluIFsxLCAyMV0gb3IgdW5kZWZpbmVkLlxuICAvLyBGb3IgZXhhbXBsZSwgZm9ybWF0RGVjaW1hbCgxLjIzKSByZXR1cm5zIFtcIjEyM1wiLCAwXS5cbiAgZnVuY3Rpb24gZm9ybWF0RGVjaW1hbCh4LCBwKSB7XG4gICAgaWYgKChpID0gKHggPSB4LnRvRXhwb25lbnRpYWwocCAmJiBwIC0gMSkpLmluZGV4T2YoXCJlXCIpKSA8IDApIHJldHVybiBudWxsOyAvLyBOYU4sIMKxSW5maW5pdHlcbiAgICB2YXIgaSwgY29lZmZpY2llbnQgPSB4LnNsaWNlKDAsIGkpO1xuXG4gICAgLy8gVGhlIHN0cmluZyByZXR1cm5lZCBieSB0b0V4cG9uZW50aWFsIGVpdGhlciBoYXMgdGhlIGZvcm0gXFxkXFwuXFxkK2VbLStdXFxkK1xuICAgIC8vIChlLmcuLCAxLjJlKzMpIG9yIHRoZSBmb3JtIFxcZGVbLStdXFxkKyAoZS5nLiwgMWUrMykuXG4gICAgcmV0dXJuIFtcbiAgICAgIGNvZWZmaWNpZW50Lmxlbmd0aCA+IDEgPyBjb2VmZmljaWVudFswXSArIGNvZWZmaWNpZW50LnNsaWNlKDIpIDogY29lZmZpY2llbnQsXG4gICAgICAreC5zbGljZShpICsgMSlcbiAgICBdO1xuICB9XG5cbiAgZnVuY3Rpb24gZXhwb25lbnQoeCkge1xuICAgIHJldHVybiB4ID0gZm9ybWF0RGVjaW1hbChNYXRoLmFicyh4KSksIHggPyB4WzFdIDogTmFOO1xuICB9XG5cbiAgdmFyIHByZWZpeEV4cG9uZW50O1xuXG4gIGZ1bmN0aW9uIGZvcm1hdFByZWZpeEF1dG8oeCwgcCkge1xuICAgIHZhciBkID0gZm9ybWF0RGVjaW1hbCh4LCBwKTtcbiAgICBpZiAoIWQpIHJldHVybiB4ICsgXCJcIjtcbiAgICB2YXIgY29lZmZpY2llbnQgPSBkWzBdLFxuICAgICAgICBleHBvbmVudCA9IGRbMV0sXG4gICAgICAgIGkgPSBleHBvbmVudCAtIChwcmVmaXhFeHBvbmVudCA9IE1hdGgubWF4KC04LCBNYXRoLm1pbig4LCBNYXRoLmZsb29yKGV4cG9uZW50IC8gMykpKSAqIDMpICsgMSxcbiAgICAgICAgbiA9IGNvZWZmaWNpZW50Lmxlbmd0aDtcbiAgICByZXR1cm4gaSA9PT0gbiA/IGNvZWZmaWNpZW50XG4gICAgICAgIDogaSA+IG4gPyBjb2VmZmljaWVudCArIG5ldyBBcnJheShpIC0gbiArIDEpLmpvaW4oXCIwXCIpXG4gICAgICAgIDogaSA+IDAgPyBjb2VmZmljaWVudC5zbGljZSgwLCBpKSArIFwiLlwiICsgY29lZmZpY2llbnQuc2xpY2UoaSlcbiAgICAgICAgOiBcIjAuXCIgKyBuZXcgQXJyYXkoMSAtIGkpLmpvaW4oXCIwXCIpICsgZm9ybWF0RGVjaW1hbCh4LCBwICsgaSAtIDEpWzBdOyAvLyBsZXNzIHRoYW4gMXkhXG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRSb3VuZGVkKHgsIHApIHtcbiAgICB2YXIgZCA9IGZvcm1hdERlY2ltYWwoeCwgcCk7XG4gICAgaWYgKCFkKSByZXR1cm4geCArIFwiXCI7XG4gICAgdmFyIGNvZWZmaWNpZW50ID0gZFswXSxcbiAgICAgICAgZXhwb25lbnQgPSBkWzFdO1xuICAgIHJldHVybiBleHBvbmVudCA8IDAgPyBcIjAuXCIgKyBuZXcgQXJyYXkoLWV4cG9uZW50KS5qb2luKFwiMFwiKSArIGNvZWZmaWNpZW50XG4gICAgICAgIDogY29lZmZpY2llbnQubGVuZ3RoID4gZXhwb25lbnQgKyAxID8gY29lZmZpY2llbnQuc2xpY2UoMCwgZXhwb25lbnQgKyAxKSArIFwiLlwiICsgY29lZmZpY2llbnQuc2xpY2UoZXhwb25lbnQgKyAxKVxuICAgICAgICA6IGNvZWZmaWNpZW50ICsgbmV3IEFycmF5KGV4cG9uZW50IC0gY29lZmZpY2llbnQubGVuZ3RoICsgMikuam9pbihcIjBcIik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXREZWZhdWx0KHgsIHApIHtcbiAgICB4ID0geC50b1ByZWNpc2lvbihwKTtcblxuICAgIG91dDogZm9yICh2YXIgbiA9IHgubGVuZ3RoLCBpID0gMSwgaTAgPSAtMSwgaTE7IGkgPCBuOyArK2kpIHtcbiAgICAgIHN3aXRjaCAoeFtpXSkge1xuICAgICAgICBjYXNlIFwiLlwiOiBpMCA9IGkxID0gaTsgYnJlYWs7XG4gICAgICAgIGNhc2UgXCIwXCI6IGlmIChpMCA9PT0gMCkgaTAgPSBpOyBpMSA9IGk7IGJyZWFrO1xuICAgICAgICBjYXNlIFwiZVwiOiBicmVhayBvdXQ7XG4gICAgICAgIGRlZmF1bHQ6IGlmIChpMCA+IDApIGkwID0gMDsgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGkwID4gMCA/IHguc2xpY2UoMCwgaTApICsgeC5zbGljZShpMSArIDEpIDogeDtcbiAgfVxuXG4gIHZhciBmb3JtYXRUeXBlcyA9IHtcbiAgICBcIlwiOiBmb3JtYXREZWZhdWx0LFxuICAgIFwiJVwiOiBmdW5jdGlvbih4LCBwKSB7IHJldHVybiAoeCAqIDEwMCkudG9GaXhlZChwKTsgfSxcbiAgICBcImJcIjogZnVuY3Rpb24oeCkgeyByZXR1cm4gTWF0aC5yb3VuZCh4KS50b1N0cmluZygyKTsgfSxcbiAgICBcImNcIjogZnVuY3Rpb24oeCkgeyByZXR1cm4geCArIFwiXCI7IH0sXG4gICAgXCJkXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoMTApOyB9LFxuICAgIFwiZVwiOiBmdW5jdGlvbih4LCBwKSB7IHJldHVybiB4LnRvRXhwb25lbnRpYWwocCk7IH0sXG4gICAgXCJmXCI6IGZ1bmN0aW9uKHgsIHApIHsgcmV0dXJuIHgudG9GaXhlZChwKTsgfSxcbiAgICBcImdcIjogZnVuY3Rpb24oeCwgcCkgeyByZXR1cm4geC50b1ByZWNpc2lvbihwKTsgfSxcbiAgICBcIm9cIjogZnVuY3Rpb24oeCkgeyByZXR1cm4gTWF0aC5yb3VuZCh4KS50b1N0cmluZyg4KTsgfSxcbiAgICBcInBcIjogZnVuY3Rpb24oeCwgcCkgeyByZXR1cm4gZm9ybWF0Um91bmRlZCh4ICogMTAwLCBwKTsgfSxcbiAgICBcInJcIjogZm9ybWF0Um91bmRlZCxcbiAgICBcInNcIjogZm9ybWF0UHJlZml4QXV0byxcbiAgICBcIlhcIjogZnVuY3Rpb24oeCkgeyByZXR1cm4gTWF0aC5yb3VuZCh4KS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTsgfSxcbiAgICBcInhcIjogZnVuY3Rpb24oeCkgeyByZXR1cm4gTWF0aC5yb3VuZCh4KS50b1N0cmluZygxNik7IH1cbiAgfTtcblxuXG4gIC8vIFtbZmlsbF1hbGlnbl1bc2lnbl1bc3ltYm9sXVswXVt3aWR0aF1bLF1bLnByZWNpc2lvbl1bdHlwZV1cbiAgdmFyIHJlID0gL14oPzooLik/KFs8Pj1eXSkpPyhbK1xcLVxcKCBdKT8oWyQjXSk/KDApPyhcXGQrKT8oLCk/KFxcLlxcZCspPyhbYS16JV0pPyQvaTtcblxuICBmdW5jdGlvbiBGb3JtYXRTcGVjaWZpZXIoc3BlY2lmaWVyKSB7XG4gICAgaWYgKCEobWF0Y2ggPSByZS5leGVjKHNwZWNpZmllcikpKSB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIGZvcm1hdDogXCIgKyBzcGVjaWZpZXIpO1xuXG4gICAgdmFyIG1hdGNoLFxuICAgICAgICBmaWxsID0gbWF0Y2hbMV0gfHwgXCIgXCIsXG4gICAgICAgIGFsaWduID0gbWF0Y2hbMl0gfHwgXCI+XCIsXG4gICAgICAgIHNpZ24gPSBtYXRjaFszXSB8fCBcIi1cIixcbiAgICAgICAgc3ltYm9sID0gbWF0Y2hbNF0gfHwgXCJcIixcbiAgICAgICAgemVybyA9ICEhbWF0Y2hbNV0sXG4gICAgICAgIHdpZHRoID0gbWF0Y2hbNl0gJiYgK21hdGNoWzZdLFxuICAgICAgICBjb21tYSA9ICEhbWF0Y2hbN10sXG4gICAgICAgIHByZWNpc2lvbiA9IG1hdGNoWzhdICYmICttYXRjaFs4XS5zbGljZSgxKSxcbiAgICAgICAgdHlwZSA9IG1hdGNoWzldIHx8IFwiXCI7XG5cbiAgICAvLyBUaGUgXCJuXCIgdHlwZSBpcyBhbiBhbGlhcyBmb3IgXCIsZ1wiLlxuICAgIGlmICh0eXBlID09PSBcIm5cIikgY29tbWEgPSB0cnVlLCB0eXBlID0gXCJnXCI7XG5cbiAgICAvLyBNYXAgaW52YWxpZCB0eXBlcyB0byB0aGUgZGVmYXVsdCBmb3JtYXQuXG4gICAgZWxzZSBpZiAoIWZvcm1hdFR5cGVzW3R5cGVdKSB0eXBlID0gXCJcIjtcblxuICAgIC8vIElmIHplcm8gZmlsbCBpcyBzcGVjaWZpZWQsIHBhZGRpbmcgZ29lcyBhZnRlciBzaWduIGFuZCBiZWZvcmUgZGlnaXRzLlxuICAgIGlmICh6ZXJvIHx8IChmaWxsID09PSBcIjBcIiAmJiBhbGlnbiA9PT0gXCI9XCIpKSB6ZXJvID0gdHJ1ZSwgZmlsbCA9IFwiMFwiLCBhbGlnbiA9IFwiPVwiO1xuXG4gICAgdGhpcy5maWxsID0gZmlsbDtcbiAgICB0aGlzLmFsaWduID0gYWxpZ247XG4gICAgdGhpcy5zaWduID0gc2lnbjtcbiAgICB0aGlzLnN5bWJvbCA9IHN5bWJvbDtcbiAgICB0aGlzLnplcm8gPSB6ZXJvO1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmNvbW1hID0gY29tbWE7XG4gICAgdGhpcy5wcmVjaXNpb24gPSBwcmVjaXNpb247XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgfVxuXG4gIEZvcm1hdFNwZWNpZmllci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5maWxsXG4gICAgICAgICsgdGhpcy5hbGlnblxuICAgICAgICArIHRoaXMuc2lnblxuICAgICAgICArIHRoaXMuc3ltYm9sXG4gICAgICAgICsgKHRoaXMuemVybyA/IFwiMFwiIDogXCJcIilcbiAgICAgICAgKyAodGhpcy53aWR0aCA9PSBudWxsID8gXCJcIiA6IE1hdGgubWF4KDEsIHRoaXMud2lkdGggfCAwKSlcbiAgICAgICAgKyAodGhpcy5jb21tYSA/IFwiLFwiIDogXCJcIilcbiAgICAgICAgKyAodGhpcy5wcmVjaXNpb24gPT0gbnVsbCA/IFwiXCIgOiBcIi5cIiArIE1hdGgubWF4KDAsIHRoaXMucHJlY2lzaW9uIHwgMCkpXG4gICAgICAgICsgdGhpcy50eXBlO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGZvcm1hdFNwZWNpZmllcihzcGVjaWZpZXIpIHtcbiAgICByZXR1cm4gbmV3IEZvcm1hdFNwZWNpZmllcihzcGVjaWZpZXIpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2lkZW50aXR5KHgpIHtcbiAgICByZXR1cm4geDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdEdyb3VwKGdyb3VwaW5nLCB0aG91c2FuZHMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUsIHdpZHRoKSB7XG4gICAgICB2YXIgaSA9IHZhbHVlLmxlbmd0aCxcbiAgICAgICAgICB0ID0gW10sXG4gICAgICAgICAgaiA9IDAsXG4gICAgICAgICAgZyA9IGdyb3VwaW5nWzBdLFxuICAgICAgICAgIGxlbmd0aCA9IDA7XG5cbiAgICAgIHdoaWxlIChpID4gMCAmJiBnID4gMCkge1xuICAgICAgICBpZiAobGVuZ3RoICsgZyArIDEgPiB3aWR0aCkgZyA9IE1hdGgubWF4KDEsIHdpZHRoIC0gbGVuZ3RoKTtcbiAgICAgICAgdC5wdXNoKHZhbHVlLnN1YnN0cmluZyhpIC09IGcsIGkgKyBnKSk7XG4gICAgICAgIGlmICgobGVuZ3RoICs9IGcgKyAxKSA+IHdpZHRoKSBicmVhaztcbiAgICAgICAgZyA9IGdyb3VwaW5nW2ogPSAoaiArIDEpICUgZ3JvdXBpbmcubGVuZ3RoXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHQucmV2ZXJzZSgpLmpvaW4odGhvdXNhbmRzKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gbG9jYWxlRm9ybWF0KGxvY2FsZSkge1xuICAgIHZhciBncm91cCA9IGxvY2FsZS5ncm91cGluZyAmJiBsb2NhbGUudGhvdXNhbmRzID8gZm9ybWF0R3JvdXAobG9jYWxlLmdyb3VwaW5nLCBsb2NhbGUudGhvdXNhbmRzKSA6IF9pZGVudGl0eSxcbiAgICAgICAgY3VycmVuY3kgPSBsb2NhbGUuY3VycmVuY3ksXG4gICAgICAgIGRlY2ltYWwgPSBsb2NhbGUuZGVjaW1hbDtcblxuICAgIGZ1bmN0aW9uIGZvcm1hdChzcGVjaWZpZXIpIHtcbiAgICAgIHNwZWNpZmllciA9IGZvcm1hdFNwZWNpZmllcihzcGVjaWZpZXIpO1xuXG4gICAgICB2YXIgZmlsbCA9IHNwZWNpZmllci5maWxsLFxuICAgICAgICAgIGFsaWduID0gc3BlY2lmaWVyLmFsaWduLFxuICAgICAgICAgIHNpZ24gPSBzcGVjaWZpZXIuc2lnbixcbiAgICAgICAgICBzeW1ib2wgPSBzcGVjaWZpZXIuc3ltYm9sLFxuICAgICAgICAgIHplcm8gPSBzcGVjaWZpZXIuemVybyxcbiAgICAgICAgICB3aWR0aCA9IHNwZWNpZmllci53aWR0aCxcbiAgICAgICAgICBjb21tYSA9IHNwZWNpZmllci5jb21tYSxcbiAgICAgICAgICBwcmVjaXNpb24gPSBzcGVjaWZpZXIucHJlY2lzaW9uLFxuICAgICAgICAgIHR5cGUgPSBzcGVjaWZpZXIudHlwZTtcblxuICAgICAgLy8gQ29tcHV0ZSB0aGUgcHJlZml4IGFuZCBzdWZmaXguXG4gICAgICAvLyBGb3IgU0ktcHJlZml4LCB0aGUgc3VmZml4IGlzIGxhemlseSBjb21wdXRlZC5cbiAgICAgIHZhciBwcmVmaXggPSBzeW1ib2wgPT09IFwiJFwiID8gY3VycmVuY3lbMF0gOiBzeW1ib2wgPT09IFwiI1wiICYmIC9bYm94WF0vLnRlc3QodHlwZSkgPyBcIjBcIiArIHR5cGUudG9Mb3dlckNhc2UoKSA6IFwiXCIsXG4gICAgICAgICAgc3VmZml4ID0gc3ltYm9sID09PSBcIiRcIiA/IGN1cnJlbmN5WzFdIDogL1slcF0vLnRlc3QodHlwZSkgPyBcIiVcIiA6IFwiXCI7XG5cbiAgICAgIC8vIFdoYXQgZm9ybWF0IGZ1bmN0aW9uIHNob3VsZCB3ZSB1c2U/XG4gICAgICAvLyBJcyB0aGlzIGFuIGludGVnZXIgdHlwZT9cbiAgICAgIC8vIENhbiB0aGlzIHR5cGUgZ2VuZXJhdGUgZXhwb25lbnRpYWwgbm90YXRpb24/XG4gICAgICB2YXIgZm9ybWF0VHlwZSA9IGZvcm1hdFR5cGVzW3R5cGVdLFxuICAgICAgICAgIG1heWJlU3VmZml4ID0gIXR5cGUgfHwgL1tkZWZncHJzJV0vLnRlc3QodHlwZSk7XG5cbiAgICAgIC8vIFNldCB0aGUgZGVmYXVsdCBwcmVjaXNpb24gaWYgbm90IHNwZWNpZmllZCxcbiAgICAgIC8vIG9yIGNsYW1wIHRoZSBzcGVjaWZpZWQgcHJlY2lzaW9uIHRvIHRoZSBzdXBwb3J0ZWQgcmFuZ2UuXG4gICAgICAvLyBGb3Igc2lnbmlmaWNhbnQgcHJlY2lzaW9uLCBpdCBtdXN0IGJlIGluIFsxLCAyMV0uXG4gICAgICAvLyBGb3IgZml4ZWQgcHJlY2lzaW9uLCBpdCBtdXN0IGJlIGluIFswLCAyMF0uXG4gICAgICBwcmVjaXNpb24gPSBwcmVjaXNpb24gPT0gbnVsbCA/ICh0eXBlID8gNiA6IDEyKVxuICAgICAgICAgIDogL1tncHJzXS8udGVzdCh0eXBlKSA/IE1hdGgubWF4KDEsIE1hdGgubWluKDIxLCBwcmVjaXNpb24pKVxuICAgICAgICAgIDogTWF0aC5tYXgoMCwgTWF0aC5taW4oMjAsIHByZWNpc2lvbikpO1xuXG4gICAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgdmFyIHZhbHVlUHJlZml4ID0gcHJlZml4LFxuICAgICAgICAgICAgdmFsdWVTdWZmaXggPSBzdWZmaXg7XG5cbiAgICAgICAgaWYgKHR5cGUgPT09IFwiY1wiKSB7XG4gICAgICAgICAgdmFsdWVTdWZmaXggPSBmb3JtYXRUeXBlKHZhbHVlKSArIHZhbHVlU3VmZml4O1xuICAgICAgICAgIHZhbHVlID0gXCJcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9ICt2YWx1ZTtcblxuICAgICAgICAgIC8vIENvbnZlcnQgbmVnYXRpdmUgdG8gcG9zaXRpdmUsIGFuZCBjb21wdXRlIHRoZSBwcmVmaXguXG4gICAgICAgICAgLy8gTm90ZSB0aGF0IC0wIGlzIG5vdCBsZXNzIHRoYW4gMCwgYnV0IDEgLyAtMCBpcyFcbiAgICAgICAgICB2YXIgdmFsdWVOZWdhdGl2ZSA9ICh2YWx1ZSA8IDAgfHwgMSAvIHZhbHVlIDwgMCkgJiYgKHZhbHVlICo9IC0xLCB0cnVlKTtcblxuICAgICAgICAgIC8vIFBlcmZvcm0gdGhlIGluaXRpYWwgZm9ybWF0dGluZy5cbiAgICAgICAgICB2YWx1ZSA9IGZvcm1hdFR5cGUodmFsdWUsIHByZWNpc2lvbik7XG5cbiAgICAgICAgICAvLyBDb21wdXRlIHRoZSBwcmVmaXggYW5kIHN1ZmZpeC5cbiAgICAgICAgICB2YWx1ZVByZWZpeCA9ICh2YWx1ZU5lZ2F0aXZlID8gKHNpZ24gPT09IFwiKFwiID8gc2lnbiA6IFwiLVwiKSA6IHNpZ24gPT09IFwiLVwiIHx8IHNpZ24gPT09IFwiKFwiID8gXCJcIiA6IHNpZ24pICsgdmFsdWVQcmVmaXg7XG4gICAgICAgICAgdmFsdWVTdWZmaXggPSB2YWx1ZVN1ZmZpeCArICh0eXBlID09PSBcInNcIiA/IHByZWZpeGVzWzggKyBwcmVmaXhFeHBvbmVudCAvIDNdIDogXCJcIikgKyAodmFsdWVOZWdhdGl2ZSAmJiBzaWduID09PSBcIihcIiA/IFwiKVwiIDogXCJcIik7XG5cbiAgICAgICAgICAvLyBCcmVhayB0aGUgZm9ybWF0dGVkIHZhbHVlIGludG8gdGhlIGludGVnZXIg4oCcdmFsdWXigJ0gcGFydCB0aGF0IGNhbiBiZVxuICAgICAgICAgIC8vIGdyb3VwZWQsIGFuZCBmcmFjdGlvbmFsIG9yIGV4cG9uZW50aWFsIOKAnHN1ZmZpeOKAnSBwYXJ0IHRoYXQgaXMgbm90LlxuICAgICAgICAgIGlmIChtYXliZVN1ZmZpeCkge1xuICAgICAgICAgICAgdmFyIGkgPSAtMSwgbiA9IHZhbHVlLmxlbmd0aCwgYztcbiAgICAgICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgICAgIGlmIChjID0gdmFsdWUuY2hhckNvZGVBdChpKSwgNDggPiBjIHx8IGMgPiA1Nykge1xuICAgICAgICAgICAgICAgIHZhbHVlU3VmZml4ID0gKGMgPT09IDQ2ID8gZGVjaW1hbCArIHZhbHVlLnNsaWNlKGkgKyAxKSA6IHZhbHVlLnNsaWNlKGkpKSArIHZhbHVlU3VmZml4O1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMCwgaSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGUgZmlsbCBjaGFyYWN0ZXIgaXMgbm90IFwiMFwiLCBncm91cGluZyBpcyBhcHBsaWVkIGJlZm9yZSBwYWRkaW5nLlxuICAgICAgICBpZiAoY29tbWEgJiYgIXplcm8pIHZhbHVlID0gZ3JvdXAodmFsdWUsIEluZmluaXR5KTtcblxuICAgICAgICAvLyBDb21wdXRlIHRoZSBwYWRkaW5nLlxuICAgICAgICB2YXIgbGVuZ3RoID0gdmFsdWVQcmVmaXgubGVuZ3RoICsgdmFsdWUubGVuZ3RoICsgdmFsdWVTdWZmaXgubGVuZ3RoLFxuICAgICAgICAgICAgcGFkZGluZyA9IGxlbmd0aCA8IHdpZHRoID8gbmV3IEFycmF5KHdpZHRoIC0gbGVuZ3RoICsgMSkuam9pbihmaWxsKSA6IFwiXCI7XG5cbiAgICAgICAgLy8gSWYgdGhlIGZpbGwgY2hhcmFjdGVyIGlzIFwiMFwiLCBncm91cGluZyBpcyBhcHBsaWVkIGFmdGVyIHBhZGRpbmcuXG4gICAgICAgIGlmIChjb21tYSAmJiB6ZXJvKSB2YWx1ZSA9IGdyb3VwKHBhZGRpbmcgKyB2YWx1ZSwgcGFkZGluZy5sZW5ndGggPyB3aWR0aCAtIHZhbHVlU3VmZml4Lmxlbmd0aCA6IEluZmluaXR5KSwgcGFkZGluZyA9IFwiXCI7XG5cbiAgICAgICAgLy8gUmVjb25zdHJ1Y3QgdGhlIGZpbmFsIG91dHB1dCBiYXNlZCBvbiB0aGUgZGVzaXJlZCBhbGlnbm1lbnQuXG4gICAgICAgIHN3aXRjaCAoYWxpZ24pIHtcbiAgICAgICAgICBjYXNlIFwiPFwiOiByZXR1cm4gdmFsdWVQcmVmaXggKyB2YWx1ZSArIHZhbHVlU3VmZml4ICsgcGFkZGluZztcbiAgICAgICAgICBjYXNlIFwiPVwiOiByZXR1cm4gdmFsdWVQcmVmaXggKyBwYWRkaW5nICsgdmFsdWUgKyB2YWx1ZVN1ZmZpeDtcbiAgICAgICAgICBjYXNlIFwiXlwiOiByZXR1cm4gcGFkZGluZy5zbGljZSgwLCBsZW5ndGggPSBwYWRkaW5nLmxlbmd0aCA+PiAxKSArIHZhbHVlUHJlZml4ICsgdmFsdWUgKyB2YWx1ZVN1ZmZpeCArIHBhZGRpbmcuc2xpY2UobGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFkZGluZyArIHZhbHVlUHJlZml4ICsgdmFsdWUgKyB2YWx1ZVN1ZmZpeDtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0UHJlZml4KHNwZWNpZmllciwgdmFsdWUpIHtcbiAgICAgIHZhciBmID0gZm9ybWF0KChzcGVjaWZpZXIgPSBmb3JtYXRTcGVjaWZpZXIoc3BlY2lmaWVyKSwgc3BlY2lmaWVyLnR5cGUgPSBcImZcIiwgc3BlY2lmaWVyKSksXG4gICAgICAgICAgZSA9IE1hdGgubWF4KC04LCBNYXRoLm1pbig4LCBNYXRoLmZsb29yKGV4cG9uZW50KHZhbHVlKSAvIDMpKSkgKiAzLFxuICAgICAgICAgIGsgPSBNYXRoLnBvdygxMCwgLWUpLFxuICAgICAgICAgIHByZWZpeCA9IHByZWZpeGVzWzggKyBlIC8gM107XG4gICAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGYoayAqIHZhbHVlKSArIHByZWZpeDtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGZvcm1hdDogZm9ybWF0LFxuICAgICAgZm9ybWF0UHJlZml4OiBmb3JtYXRQcmVmaXhcbiAgICB9O1xuICB9XG5cbiAgdmFyIGxvY2FsZSA9IGxvY2FsZUZvcm1hdCh7XG4gICAgZGVjaW1hbDogXCIuXCIsXG4gICAgdGhvdXNhbmRzOiBcIixcIixcbiAgICBncm91cGluZzogWzNdLFxuICAgIGN1cnJlbmN5OiBbXCIkXCIsIFwiXCJdXG4gIH0pO1xuXG4gIHZhciBmb3JtYXQgPSBsb2NhbGUuZm9ybWF0O1xuXG4gIGZ1bmN0aW9uIHByZWNpc2lvbkZpeGVkKHN0ZXApIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoMCwgLWV4cG9uZW50KE1hdGguYWJzKHN0ZXApKSk7XG4gIH1cblxuICBmdW5jdGlvbiBwcmVjaXNpb25Sb3VuZChzdGVwLCBtYXgpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoMCwgZXhwb25lbnQoTWF0aC5hYnMobWF4KSkgLSBleHBvbmVudChNYXRoLmFicyhzdGVwKSkpICsgMTtcbiAgfVxuXG4gIHZhciBmb3JtYXRQcmVmaXggPSBsb2NhbGUuZm9ybWF0UHJlZml4O1xuXG4gIGZ1bmN0aW9uIHByZWNpc2lvblByZWZpeChzdGVwLCB2YWx1ZSkge1xuICAgIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1heCgtOCwgTWF0aC5taW4oOCwgTWF0aC5mbG9vcihleHBvbmVudCh2YWx1ZSkgLyAzKSkpICogMyAtIGV4cG9uZW50KE1hdGguYWJzKHN0ZXApKSk7XG4gIH1cblxuICBmdW5jdGlvbiB0aWNrRm9ybWF0KGRvbWFpbiwgY291bnQsIHNwZWNpZmllcikge1xuICAgIHZhciByYW5nZSA9IHRpY2tSYW5nZShkb21haW4sIGNvdW50KTtcbiAgICBpZiAoc3BlY2lmaWVyID09IG51bGwpIHtcbiAgICAgIHNwZWNpZmllciA9IFwiLC5cIiArIHByZWNpc2lvbkZpeGVkKHJhbmdlWzJdKSArIFwiZlwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBzd2l0Y2ggKHNwZWNpZmllciA9IGZvcm1hdFNwZWNpZmllcihzcGVjaWZpZXIpLCBzcGVjaWZpZXIudHlwZSkge1xuICAgICAgICBjYXNlIFwic1wiOiB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gTWF0aC5tYXgoTWF0aC5hYnMocmFuZ2VbMF0pLCBNYXRoLmFicyhyYW5nZVsxXSkpO1xuICAgICAgICAgIGlmIChzcGVjaWZpZXIucHJlY2lzaW9uID09IG51bGwpIHNwZWNpZmllci5wcmVjaXNpb24gPSBwcmVjaXNpb25QcmVmaXgocmFuZ2VbMl0sIHZhbHVlKTtcbiAgICAgICAgICByZXR1cm4gZm9ybWF0UHJlZml4KHNwZWNpZmllciwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgXCJcIjpcbiAgICAgICAgY2FzZSBcImVcIjpcbiAgICAgICAgY2FzZSBcImdcIjpcbiAgICAgICAgY2FzZSBcInBcIjpcbiAgICAgICAgY2FzZSBcInJcIjoge1xuICAgICAgICAgIGlmIChzcGVjaWZpZXIucHJlY2lzaW9uID09IG51bGwpIHNwZWNpZmllci5wcmVjaXNpb24gPSBwcmVjaXNpb25Sb3VuZChyYW5nZVsyXSwgTWF0aC5tYXgoTWF0aC5hYnMocmFuZ2VbMF0pLCBNYXRoLmFicyhyYW5nZVsxXSkpKSAtIChzcGVjaWZpZXIudHlwZSA9PT0gXCJlXCIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgXCJmXCI6XG4gICAgICAgIGNhc2UgXCIlXCI6IHtcbiAgICAgICAgICBpZiAoc3BlY2lmaWVyLnByZWNpc2lvbiA9PSBudWxsKSBzcGVjaWZpZXIucHJlY2lzaW9uID0gcHJlY2lzaW9uRml4ZWQocmFuZ2VbMl0pIC0gKHNwZWNpZmllci50eXBlID09PSBcIiVcIikgKiAyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmb3JtYXQoc3BlY2lmaWVyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNjYWxlKHgpIHtcbiAgICB2YXIgayA9IDE7XG4gICAgd2hpbGUgKHggKiBrICUgMSkgayAqPSAxMDtcbiAgICByZXR1cm4gaztcbiAgfVxuXG4gIGZ1bmN0aW9uIHJhbmdlKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gICAgaWYgKChuID0gYXJndW1lbnRzLmxlbmd0aCkgPCAzKSB7XG4gICAgICBzdGVwID0gMTtcbiAgICAgIGlmIChuIDwgMikge1xuICAgICAgICBzdG9wID0gc3RhcnQ7XG4gICAgICAgIHN0YXJ0ID0gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgaSA9IC0xLFxuICAgICAgICBuID0gTWF0aC5tYXgoMCwgTWF0aC5jZWlsKChzdG9wIC0gc3RhcnQpIC8gc3RlcCkpIHwgMCxcbiAgICAgICAgayA9IHNjYWxlKE1hdGguYWJzKHN0ZXApKSxcbiAgICAgICAgcmFuZ2UgPSBuZXcgQXJyYXkobik7XG5cbiAgICBzdGFydCAqPSBrO1xuICAgIHN0ZXAgKj0gaztcbiAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgcmFuZ2VbaV0gPSAoc3RhcnQgKyBpICogc3RlcCkgLyBrO1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpY2tzKGRvbWFpbiwgY291bnQpIHtcbiAgICByZXR1cm4gcmFuZ2UuYXBwbHkobnVsbCwgdGlja1JhbmdlKGRvbWFpbiwgY291bnQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlUm91bmQoYSwgYikge1xuICAgIHJldHVybiBhID0gK2EsIGIgLT0gYSwgZnVuY3Rpb24odCkge1xuICAgICAgcmV0dXJuIE1hdGgucm91bmQoYSArIGIgKiB0KTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gdW5pbnRlcnBvbGF0ZU51bWJlcihhLCBiKSB7XG4gICAgYiA9IChiIC09IGEgPSArYSkgfHwgMSAvIGI7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiAoeCAtIGEpIC8gYjtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gdW5pbnRlcnBvbGF0ZUNsYW1wKGEsIGIpIHtcbiAgICBiID0gKGIgLT0gYSA9ICthKSB8fCAxIC8gYjtcbiAgICByZXR1cm4gZnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDEsICh4IC0gYSkgLyBiKSk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJpbGluZWFyKGRvbWFpbiwgcmFuZ2UsIHVuaW50ZXJwb2xhdGUsIGludGVycG9sYXRlKSB7XG4gICAgdmFyIHUgPSB1bmludGVycG9sYXRlKGRvbWFpblswXSwgZG9tYWluWzFdKSxcbiAgICAgICAgaSA9IGludGVycG9sYXRlKHJhbmdlWzBdLCByYW5nZVsxXSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiBpKHUoeCkpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBwb2x5bGluZWFyKGRvbWFpbiwgcmFuZ2UsIHVuaW50ZXJwb2xhdGUsIGludGVycG9sYXRlKSB7XG4gICAgdmFyIGsgPSBNYXRoLm1pbihkb21haW4ubGVuZ3RoLCByYW5nZS5sZW5ndGgpIC0gMSxcbiAgICAgICAgdSA9IG5ldyBBcnJheShrKSxcbiAgICAgICAgaSA9IG5ldyBBcnJheShrKSxcbiAgICAgICAgaiA9IC0xO1xuXG4gICAgLy8gSGFuZGxlIGRlc2NlbmRpbmcgZG9tYWlucy5cbiAgICBpZiAoZG9tYWluW2tdIDwgZG9tYWluWzBdKSB7XG4gICAgICBkb21haW4gPSBkb21haW4uc2xpY2UoKS5yZXZlcnNlKCk7XG4gICAgICByYW5nZSA9IHJhbmdlLnNsaWNlKCkucmV2ZXJzZSgpO1xuICAgIH1cblxuICAgIHdoaWxlICgrK2ogPCBrKSB7XG4gICAgICB1W2pdID0gdW5pbnRlcnBvbGF0ZShkb21haW5bal0sIGRvbWFpbltqICsgMV0pO1xuICAgICAgaVtqXSA9IGludGVycG9sYXRlKHJhbmdlW2pdLCByYW5nZVtqICsgMV0pO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbih4KSB7XG4gICAgICB2YXIgaiA9IGJpc2VjdChkb21haW4sIHgsIDEsIGspIC0gMTtcbiAgICAgIHJldHVybiBpW2pdKHVbal0oeCkpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBuZXdMaW5lYXIoZG9tYWluLCByYW5nZSwgaW50ZXJwb2xhdGUsIGNsYW1wKSB7XG4gICAgdmFyIG91dHB1dCxcbiAgICAgICAgaW5wdXQ7XG5cbiAgICBmdW5jdGlvbiByZXNjYWxlKCkge1xuICAgICAgdmFyIGxpbmVhciA9IE1hdGgubWluKGRvbWFpbi5sZW5ndGgsIHJhbmdlLmxlbmd0aCkgPiAyID8gcG9seWxpbmVhciA6IGJpbGluZWFyLFxuICAgICAgICAgIHVuaW50ZXJwb2xhdGUgPSBjbGFtcCA/IHVuaW50ZXJwb2xhdGVDbGFtcCA6IHVuaW50ZXJwb2xhdGVOdW1iZXI7XG4gICAgICBvdXRwdXQgPSBsaW5lYXIoZG9tYWluLCByYW5nZSwgdW5pbnRlcnBvbGF0ZSwgaW50ZXJwb2xhdGUpO1xuICAgICAgaW5wdXQgPSBsaW5lYXIocmFuZ2UsIGRvbWFpbiwgdW5pbnRlcnBvbGF0ZSwgaW50ZXJwb2xhdGVOdW1iZXIpO1xuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjYWxlKHgpIHtcbiAgICAgIHJldHVybiBvdXRwdXQoeCk7XG4gICAgfVxuXG4gICAgc2NhbGUuaW52ZXJ0ID0gZnVuY3Rpb24oeSkge1xuICAgICAgcmV0dXJuIGlucHV0KHkpO1xuICAgIH07XG5cbiAgICBzY2FsZS5kb21haW4gPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBkb21haW4uc2xpY2UoKTtcbiAgICAgIGRvbWFpbiA9IHgubWFwKE51bWJlcik7XG4gICAgICByZXR1cm4gcmVzY2FsZSgpO1xuICAgIH07XG5cbiAgICBzY2FsZS5yYW5nZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHJhbmdlLnNsaWNlKCk7XG4gICAgICByYW5nZSA9IHguc2xpY2UoKTtcbiAgICAgIHJldHVybiByZXNjYWxlKCk7XG4gICAgfTtcblxuICAgIHNjYWxlLnJhbmdlUm91bmQgPSBmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gc2NhbGUucmFuZ2UoeCkuaW50ZXJwb2xhdGUoaW50ZXJwb2xhdGVSb3VuZCk7XG4gICAgfTtcblxuICAgIHNjYWxlLmNsYW1wID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY2xhbXA7XG4gICAgICBjbGFtcCA9ICEheDtcbiAgICAgIHJldHVybiByZXNjYWxlKCk7XG4gICAgfTtcblxuICAgIHNjYWxlLmludGVycG9sYXRlID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gaW50ZXJwb2xhdGU7XG4gICAgICBpbnRlcnBvbGF0ZSA9IHg7XG4gICAgICByZXR1cm4gcmVzY2FsZSgpO1xuICAgIH07XG5cbiAgICBzY2FsZS50aWNrcyA9IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgICByZXR1cm4gdGlja3MoZG9tYWluLCBjb3VudCk7XG4gICAgfTtcblxuICAgIHNjYWxlLnRpY2tGb3JtYXQgPSBmdW5jdGlvbihjb3VudCwgc3BlY2lmaWVyKSB7XG4gICAgICByZXR1cm4gdGlja0Zvcm1hdChkb21haW4sIGNvdW50LCBzcGVjaWZpZXIpO1xuICAgIH07XG5cbiAgICBzY2FsZS5uaWNlID0gZnVuY3Rpb24oY291bnQpIHtcbiAgICAgIGRvbWFpbiA9IG5pY2UoZG9tYWluLCB0aWNrUmFuZ2UoZG9tYWluLCBjb3VudClbMl0pO1xuICAgICAgcmV0dXJuIHJlc2NhbGUoKTtcbiAgICB9O1xuXG4gICAgc2NhbGUuY29weSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ld0xpbmVhcihkb21haW4sIHJhbmdlLCBpbnRlcnBvbGF0ZSwgY2xhbXApO1xuICAgIH07XG5cbiAgICByZXR1cm4gcmVzY2FsZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gbGluZWFyKCkge1xuICAgIHJldHVybiBuZXdMaW5lYXIoWzAsIDFdLCBbMCwgMV0sIGludGVycG9sYXRlLCBmYWxzZSk7XG4gIH1cblxuICBmdW5jdGlvbiByZWJpbmQoc2NhbGUsIGxpbmVhcikge1xuICAgIHNjYWxlLnJhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgeCA9IGxpbmVhci5yYW5nZS5hcHBseShsaW5lYXIsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4geCA9PT0gbGluZWFyID8gc2NhbGUgOiB4O1xuICAgIH07XG5cbiAgICBzY2FsZS5yYW5nZVJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgeCA9IGxpbmVhci5yYW5nZVJvdW5kLmFwcGx5KGxpbmVhciwgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiB4ID09PSBsaW5lYXIgPyBzY2FsZSA6IHg7XG4gICAgfTtcblxuICAgIHNjYWxlLmNsYW1wID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgeCA9IGxpbmVhci5jbGFtcC5hcHBseShsaW5lYXIsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4geCA9PT0gbGluZWFyID8gc2NhbGUgOiB4O1xuICAgIH07XG5cbiAgICBzY2FsZS5pbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHggPSBsaW5lYXIuaW50ZXJwb2xhdGUuYXBwbHkobGluZWFyLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIHggPT09IGxpbmVhciA/IHNjYWxlIDogeDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHNjYWxlO1xuICB9XG5cbiAgZnVuY3Rpb24gbmV3UG93KGxpbmVhciwgZXhwb25lbnQsIGRvbWFpbikge1xuXG4gICAgZnVuY3Rpb24gcG93cCh4KSB7XG4gICAgICByZXR1cm4geCA8IDAgPyAtTWF0aC5wb3coLXgsIGV4cG9uZW50KSA6IE1hdGgucG93KHgsIGV4cG9uZW50KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwb3diKHgpIHtcbiAgICAgIHJldHVybiB4IDwgMCA/IC1NYXRoLnBvdygteCwgMSAvIGV4cG9uZW50KSA6IE1hdGgucG93KHgsIDEgLyBleHBvbmVudCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2NhbGUoeCkge1xuICAgICAgcmV0dXJuIGxpbmVhcihwb3dwKHgpKTtcbiAgICB9XG5cbiAgICBzY2FsZS5pbnZlcnQgPSBmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gcG93YihsaW5lYXIuaW52ZXJ0KHgpKTtcbiAgICB9O1xuXG4gICAgc2NhbGUuZXhwb25lbnQgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBleHBvbmVudDtcbiAgICAgIGV4cG9uZW50ID0gK3g7XG4gICAgICByZXR1cm4gc2NhbGUuZG9tYWluKGRvbWFpbik7XG4gICAgfTtcblxuICAgIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGRvbWFpbi5zbGljZSgpO1xuICAgICAgZG9tYWluID0geC5tYXAoTnVtYmVyKTtcbiAgICAgIGxpbmVhci5kb21haW4oZG9tYWluLm1hcChwb3dwKSk7XG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIHNjYWxlLnRpY2tzID0gZnVuY3Rpb24oY291bnQpIHtcbiAgICAgIHJldHVybiB0aWNrcyhkb21haW4sIGNvdW50KTtcbiAgICB9O1xuXG4gICAgc2NhbGUudGlja0Zvcm1hdCA9IGZ1bmN0aW9uKGNvdW50LCBzcGVjaWZpZXIpIHtcbiAgICAgIHJldHVybiB0aWNrRm9ybWF0KGRvbWFpbiwgY291bnQsIHNwZWNpZmllcik7XG4gICAgfTtcblxuICAgIHNjYWxlLm5pY2UgPSBmdW5jdGlvbihjb3VudCkge1xuICAgICAgcmV0dXJuIHNjYWxlLmRvbWFpbihuaWNlKGRvbWFpbiwgdGlja1JhbmdlKGRvbWFpbiwgY291bnQpWzJdKSk7XG4gICAgfTtcblxuICAgIHNjYWxlLmNvcHkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXdQb3cobGluZWFyLmNvcHkoKSwgZXhwb25lbnQsIGRvbWFpbik7XG4gICAgfTtcblxuICAgIHJldHVybiByZWJpbmQoc2NhbGUsIGxpbmVhcik7XG4gIH1cblxuICBmdW5jdGlvbiBzcXJ0KCkge1xuICAgIHJldHVybiBuZXdQb3cobGluZWFyKCksIC41LCBbMCwgMV0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbmV3UXVhbnRpemUoeDAsIHgxLCByYW5nZSkge1xuICAgIHZhciBreCwgaTtcblxuICAgIGZ1bmN0aW9uIHNjYWxlKHgpIHtcbiAgICAgIHJldHVybiByYW5nZVtNYXRoLm1heCgwLCBNYXRoLm1pbihpLCBNYXRoLmZsb29yKGt4ICogKHggLSB4MCkpKSldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc2NhbGUoKSB7XG4gICAgICBreCA9IHJhbmdlLmxlbmd0aCAvICh4MSAtIHgwKTtcbiAgICAgIGkgPSByYW5nZS5sZW5ndGggLSAxO1xuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH1cblxuICAgIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIFt4MCwgeDFdO1xuICAgICAgeDAgPSAreFswXTtcbiAgICAgIHgxID0gK3hbeC5sZW5ndGggLSAxXTtcbiAgICAgIHJldHVybiByZXNjYWxlKCk7XG4gICAgfTtcblxuICAgIHNjYWxlLnJhbmdlID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gcmFuZ2Uuc2xpY2UoKTtcbiAgICAgIHJhbmdlID0geC5zbGljZSgpO1xuICAgICAgcmV0dXJuIHJlc2NhbGUoKTtcbiAgICB9O1xuXG4gICAgc2NhbGUuaW52ZXJ0RXh0ZW50ID0gZnVuY3Rpb24oeSkge1xuICAgICAgeSA9IHJhbmdlLmluZGV4T2YoeSk7XG4gICAgICB5ID0geSA8IDAgPyBOYU4gOiB5IC8ga3ggKyB4MDtcbiAgICAgIHJldHVybiBbeSwgeSArIDEgLyBreF07XG4gICAgfTtcblxuICAgIHNjYWxlLmNvcHkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXdRdWFudGl6ZSh4MCwgeDEsIHJhbmdlKTsgLy8gY29weSBvbiB3cml0ZVxuICAgIH07XG5cbiAgICByZXR1cm4gcmVzY2FsZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gcXVhbnRpemUoKSB7XG4gICAgcmV0dXJuIG5ld1F1YW50aXplKDAsIDEsIFswLCAxXSk7XG4gIH1cblxuXG4gIC8vIFItNyBwZXIgPGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvUXVhbnRpbGU+XG4gIGZ1bmN0aW9uIHF1YW50aWxlKHZhbHVlcywgcCkge1xuICAgIHZhciBIID0gKHZhbHVlcy5sZW5ndGggLSAxKSAqIHAgKyAxLFxuICAgICAgICBoID0gTWF0aC5mbG9vcihIKSxcbiAgICAgICAgdiA9ICt2YWx1ZXNbaCAtIDFdLFxuICAgICAgICBlID0gSCAtIGg7XG4gICAgcmV0dXJuIGUgPyB2ICsgZSAqICh2YWx1ZXNbaF0gLSB2KSA6IHY7XG4gIH1cblxuICBmdW5jdGlvbiBuZXdRdWFudGlsZShkb21haW4sIHJhbmdlKSB7XG4gICAgdmFyIHRocmVzaG9sZHM7XG5cbiAgICBmdW5jdGlvbiByZXNjYWxlKCkge1xuICAgICAgdmFyIGsgPSAwLFxuICAgICAgICAgIHEgPSByYW5nZS5sZW5ndGg7XG4gICAgICB0aHJlc2hvbGRzID0gW107XG4gICAgICB3aGlsZSAoKytrIDwgcSkgdGhyZXNob2xkc1trIC0gMV0gPSBxdWFudGlsZShkb21haW4sIGsgLyBxKTtcbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2FsZSh4KSB7XG4gICAgICBpZiAoIWlzTmFOKHggPSAreCkpIHJldHVybiByYW5nZVtiaXNlY3QodGhyZXNob2xkcywgeCldO1xuICAgIH1cblxuICAgIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGRvbWFpbjtcbiAgICAgIGRvbWFpbiA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSB4Lmxlbmd0aCwgdjsgaSA8IG47ICsraSkgaWYgKHYgPSB4W2ldLCB2ICE9IG51bGwgJiYgIWlzTmFOKHYgPSArdikpIGRvbWFpbi5wdXNoKHYpO1xuICAgICAgZG9tYWluLnNvcnQoYXNjZW5kaW5nKTtcbiAgICAgIHJldHVybiByZXNjYWxlKCk7XG4gICAgfTtcblxuICAgIHNjYWxlLnJhbmdlID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gcmFuZ2Uuc2xpY2UoKTtcbiAgICAgIHJhbmdlID0geC5zbGljZSgpO1xuICAgICAgcmV0dXJuIHJlc2NhbGUoKTtcbiAgICB9O1xuXG4gICAgc2NhbGUucXVhbnRpbGVzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhyZXNob2xkcztcbiAgICB9O1xuXG4gICAgc2NhbGUuaW52ZXJ0RXh0ZW50ID0gZnVuY3Rpb24oeSkge1xuICAgICAgeSA9IHJhbmdlLmluZGV4T2YoeSk7XG4gICAgICByZXR1cm4geSA8IDAgPyBbTmFOLCBOYU5dIDogW1xuICAgICAgICB5ID4gMCA/IHRocmVzaG9sZHNbeSAtIDFdIDogZG9tYWluWzBdLFxuICAgICAgICB5IDwgdGhyZXNob2xkcy5sZW5ndGggPyB0aHJlc2hvbGRzW3ldIDogZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXVxuICAgICAgXTtcbiAgICB9O1xuXG4gICAgc2NhbGUuY29weSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ld1F1YW50aWxlKGRvbWFpbiwgcmFuZ2UpOyAvLyBjb3B5IG9uIHdyaXRlIVxuICAgIH07XG5cbiAgICByZXR1cm4gcmVzY2FsZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gX3F1YW50aWxlKCkge1xuICAgIHJldHVybiBuZXdRdWFudGlsZShbXSwgW10pO1xuICB9XG5cbiAgZnVuY3Rpb24gcG93KCkge1xuICAgIHJldHVybiBuZXdQb3cobGluZWFyKCksIDEsIFswLCAxXSk7XG4gIH1cblxuICBmdW5jdGlvbiBzdGVwcyhsZW5ndGgsIHN0YXJ0LCBzdGVwKSB7XG4gICAgdmFyIHN0ZXBzID0gbmV3IEFycmF5KGxlbmd0aCksIGkgPSAtMTtcbiAgICB3aGlsZSAoKytpIDwgbGVuZ3RoKSBzdGVwc1tpXSA9IHN0YXJ0ICsgc3RlcCAqIGk7XG4gICAgcmV0dXJuIHN0ZXBzO1xuICB9XG5cbiAgZnVuY3Rpb24gbmV3T3JkaW5hbChkb21haW4sIHJhbmdlcikge1xuICAgIHZhciBpbmRleCxcbiAgICAgICAgcmFuZ2UsXG4gICAgICAgIHJhbmdlQmFuZDtcblxuICAgIGZ1bmN0aW9uIHNjYWxlKHgpIHtcbiAgICAgIHZhciBrID0geCArIFwiXCIsIGkgPSBpbmRleC5nZXQoayk7XG4gICAgICBpZiAoIWkpIHtcbiAgICAgICAgaWYgKHJhbmdlci50ICE9PSBcInJhbmdlXCIpIHJldHVybjtcbiAgICAgICAgaW5kZXguc2V0KGssIGkgPSBkb21haW4ucHVzaCh4KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmFuZ2VbKGkgLSAxKSAlIHJhbmdlLmxlbmd0aF07XG4gICAgfVxuXG4gICAgc2NhbGUuZG9tYWluID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gZG9tYWluLnNsaWNlKCk7XG4gICAgICBkb21haW4gPSBbXTtcbiAgICAgIGluZGV4ID0gbmV3IE1hcDtcbiAgICAgIHZhciBpID0gLTEsIG4gPSB4Lmxlbmd0aCwgeGksIHhrO1xuICAgICAgd2hpbGUgKCsraSA8IG4pIGlmICghaW5kZXguaGFzKHhrID0gKHhpID0geFtpXSkgKyBcIlwiKSkgaW5kZXguc2V0KHhrLCBkb21haW4ucHVzaCh4aSkpO1xuICAgICAgcmV0dXJuIHNjYWxlW3Jhbmdlci50XS5hcHBseShzY2FsZSwgcmFuZ2VyLmEpO1xuICAgIH07XG5cbiAgICBzY2FsZS5yYW5nZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHJhbmdlLnNsaWNlKCk7XG4gICAgICByYW5nZSA9IHguc2xpY2UoKTtcbiAgICAgIHJhbmdlQmFuZCA9IDA7XG4gICAgICByYW5nZXIgPSB7dDogXCJyYW5nZVwiLCBhOiBhcmd1bWVudHN9O1xuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH07XG5cbiAgICBzY2FsZS5yYW5nZVBvaW50cyA9IGZ1bmN0aW9uKHgsIHBhZGRpbmcpIHtcbiAgICAgIHBhZGRpbmcgPSBhcmd1bWVudHMubGVuZ3RoIDwgMiA/IDAgOiArcGFkZGluZztcbiAgICAgIHZhciBzdGFydCA9ICt4WzBdLFxuICAgICAgICAgIHN0b3AgPSAreFsxXSxcbiAgICAgICAgICBzdGVwID0gZG9tYWluLmxlbmd0aCA8IDIgPyAoc3RhcnQgPSAoc3RhcnQgKyBzdG9wKSAvIDIsIDApIDogKHN0b3AgLSBzdGFydCkgLyAoZG9tYWluLmxlbmd0aCAtIDEgKyBwYWRkaW5nKTtcbiAgICAgIHJhbmdlID0gc3RlcHMoZG9tYWluLmxlbmd0aCwgc3RhcnQgKyBzdGVwICogcGFkZGluZyAvIDIsIHN0ZXApO1xuICAgICAgcmFuZ2VCYW5kID0gMDtcbiAgICAgIHJhbmdlciA9IHt0OiBcInJhbmdlUG9pbnRzXCIsIGE6IGFyZ3VtZW50c307XG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIHNjYWxlLnJhbmdlUm91bmRQb2ludHMgPSBmdW5jdGlvbih4LCBwYWRkaW5nKSB7XG4gICAgICBwYWRkaW5nID0gYXJndW1lbnRzLmxlbmd0aCA8IDIgPyAwIDogK3BhZGRpbmc7XG4gICAgICB2YXIgc3RhcnQgPSAreFswXSxcbiAgICAgICAgICBzdG9wID0gK3hbMV0sXG4gICAgICAgICAgc3RlcCA9IGRvbWFpbi5sZW5ndGggPCAyID8gKHN0YXJ0ID0gc3RvcCA9IE1hdGgucm91bmQoKHN0YXJ0ICsgc3RvcCkgLyAyKSwgMCkgOiAoc3RvcCAtIHN0YXJ0KSAvIChkb21haW4ubGVuZ3RoIC0gMSArIHBhZGRpbmcpIHwgMDsgLy8gYml0d2lzZSBmbG9vciBmb3Igc3ltbWV0cnlcbiAgICAgIHJhbmdlID0gc3RlcHMoZG9tYWluLmxlbmd0aCwgc3RhcnQgKyBNYXRoLnJvdW5kKHN0ZXAgKiBwYWRkaW5nIC8gMiArIChzdG9wIC0gc3RhcnQgLSAoZG9tYWluLmxlbmd0aCAtIDEgKyBwYWRkaW5nKSAqIHN0ZXApIC8gMiksIHN0ZXApO1xuICAgICAgcmFuZ2VCYW5kID0gMDtcbiAgICAgIHJhbmdlciA9IHt0OiBcInJhbmdlUm91bmRQb2ludHNcIiwgYTogYXJndW1lbnRzfTtcbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9O1xuXG4gICAgc2NhbGUucmFuZ2VCYW5kcyA9IGZ1bmN0aW9uKHgsIHBhZGRpbmcsIG91dGVyUGFkZGluZykge1xuICAgICAgcGFkZGluZyA9IGFyZ3VtZW50cy5sZW5ndGggPCAyID8gMCA6ICtwYWRkaW5nO1xuICAgICAgb3V0ZXJQYWRkaW5nID0gYXJndW1lbnRzLmxlbmd0aCA8IDMgPyBwYWRkaW5nIDogK291dGVyUGFkZGluZztcbiAgICAgIHZhciByZXZlcnNlID0gK3hbMV0gPCAreFswXSxcbiAgICAgICAgICBzdGFydCA9ICt4W3JldmVyc2UgLSAwXSxcbiAgICAgICAgICBzdG9wID0gK3hbMSAtIHJldmVyc2VdLFxuICAgICAgICAgIHN0ZXAgPSAoc3RvcCAtIHN0YXJ0KSAvIChkb21haW4ubGVuZ3RoIC0gcGFkZGluZyArIDIgKiBvdXRlclBhZGRpbmcpO1xuICAgICAgcmFuZ2UgPSBzdGVwcyhkb21haW4ubGVuZ3RoLCBzdGFydCArIHN0ZXAgKiBvdXRlclBhZGRpbmcsIHN0ZXApO1xuICAgICAgaWYgKHJldmVyc2UpIHJhbmdlLnJldmVyc2UoKTtcbiAgICAgIHJhbmdlQmFuZCA9IHN0ZXAgKiAoMSAtIHBhZGRpbmcpO1xuICAgICAgcmFuZ2VyID0ge3Q6IFwicmFuZ2VCYW5kc1wiLCBhOiBhcmd1bWVudHN9O1xuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH07XG5cbiAgICBzY2FsZS5yYW5nZVJvdW5kQmFuZHMgPSBmdW5jdGlvbih4LCBwYWRkaW5nLCBvdXRlclBhZGRpbmcpIHtcbiAgICAgIHBhZGRpbmcgPSBhcmd1bWVudHMubGVuZ3RoIDwgMiA/IDAgOiArcGFkZGluZztcbiAgICAgIG91dGVyUGFkZGluZyA9IGFyZ3VtZW50cy5sZW5ndGggPCAzID8gcGFkZGluZyA6ICtvdXRlclBhZGRpbmc7XG4gICAgICB2YXIgcmV2ZXJzZSA9ICt4WzFdIDwgK3hbMF0sXG4gICAgICAgICAgc3RhcnQgPSAreFtyZXZlcnNlIC0gMF0sXG4gICAgICAgICAgc3RvcCA9ICt4WzEgLSByZXZlcnNlXSxcbiAgICAgICAgICBzdGVwID0gTWF0aC5mbG9vcigoc3RvcCAtIHN0YXJ0KSAvIChkb21haW4ubGVuZ3RoIC0gcGFkZGluZyArIDIgKiBvdXRlclBhZGRpbmcpKTtcbiAgICAgIHJhbmdlID0gc3RlcHMoZG9tYWluLmxlbmd0aCwgc3RhcnQgKyBNYXRoLnJvdW5kKChzdG9wIC0gc3RhcnQgLSAoZG9tYWluLmxlbmd0aCAtIHBhZGRpbmcpICogc3RlcCkgLyAyKSwgc3RlcCk7XG4gICAgICBpZiAocmV2ZXJzZSkgcmFuZ2UucmV2ZXJzZSgpO1xuICAgICAgcmFuZ2VCYW5kID0gTWF0aC5yb3VuZChzdGVwICogKDEgLSBwYWRkaW5nKSk7XG4gICAgICByYW5nZXIgPSB7dDogXCJyYW5nZVJvdW5kQmFuZHNcIiwgYTogYXJndW1lbnRzfTtcbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9O1xuXG4gICAgc2NhbGUucmFuZ2VCYW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmFuZ2VCYW5kO1xuICAgIH07XG5cbiAgICBzY2FsZS5yYW5nZUV4dGVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHQgPSByYW5nZXIuYVswXSwgc3RhcnQgPSB0WzBdLCBzdG9wID0gdFt0Lmxlbmd0aCAtIDFdO1xuICAgICAgaWYgKHN0b3AgPCBzdGFydCkgdCA9IHN0b3AsIHN0b3AgPSBzdGFydCwgc3RhcnQgPSB0O1xuICAgICAgcmV0dXJuIFtzdGFydCwgc3RvcF07XG4gICAgfTtcblxuICAgIHNjYWxlLmNvcHkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXdPcmRpbmFsKGRvbWFpbiwgcmFuZ2VyKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHNjYWxlLmRvbWFpbihkb21haW4pO1xuICB9XG5cbiAgZnVuY3Rpb24gb3JkaW5hbCgpIHtcbiAgICByZXR1cm4gbmV3T3JkaW5hbChbXSwge3Q6IFwicmFuZ2VcIiwgYTogW1tdXX0pO1xuICB9XG5cbiAgdmFyIHRpY2tGb3JtYXRPdGhlciA9IGZvcm1hdChcIixcIik7XG5cbiAgdmFyIHRpY2tGb3JtYXQxMCA9IGZvcm1hdChcIi4wZVwiKTtcblxuICBmdW5jdGlvbiBuZXdMb2cobGluZWFyLCBiYXNlLCBkb21haW4pIHtcblxuICAgIGZ1bmN0aW9uIGxvZyh4KSB7XG4gICAgICByZXR1cm4gKGRvbWFpblswXSA8IDAgPyAtTWF0aC5sb2coeCA+IDAgPyAwIDogLXgpIDogTWF0aC5sb2coeCA8IDAgPyAwIDogeCkpIC8gTWF0aC5sb2coYmFzZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcG93KHgpIHtcbiAgICAgIHJldHVybiBkb21haW5bMF0gPCAwID8gLU1hdGgucG93KGJhc2UsIC14KSA6IE1hdGgucG93KGJhc2UsIHgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjYWxlKHgpIHtcbiAgICAgIHJldHVybiBsaW5lYXIobG9nKHgpKTtcbiAgICB9XG5cbiAgICBzY2FsZS5pbnZlcnQgPSBmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gcG93KGxpbmVhci5pbnZlcnQoeCkpO1xuICAgIH07XG5cbiAgICBzY2FsZS5iYXNlID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gYmFzZTtcbiAgICAgIGJhc2UgPSAreDtcbiAgICAgIHJldHVybiBzY2FsZS5kb21haW4oZG9tYWluKTtcbiAgICB9O1xuXG4gICAgc2NhbGUuZG9tYWluID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gZG9tYWluLnNsaWNlKCk7XG4gICAgICBkb21haW4gPSB4Lm1hcChOdW1iZXIpO1xuICAgICAgbGluZWFyLmRvbWFpbihkb21haW4ubWFwKGxvZykpO1xuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH07XG5cbiAgICBzY2FsZS5uaWNlID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgeCA9IG5pY2UobGluZWFyLmRvbWFpbigpLCAxKTtcbiAgICAgIGxpbmVhci5kb21haW4oeCk7XG4gICAgICBkb21haW4gPSB4Lm1hcChwb3cpO1xuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH07XG5cbiAgICBzY2FsZS50aWNrcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHUgPSBkb21haW5bMF0sXG4gICAgICAgICAgdiA9IGRvbWFpbltkb21haW4ubGVuZ3RoIC0gMV07XG4gICAgICBpZiAodiA8IHUpIGkgPSB1LCB1ID0gdiwgdiA9IGk7XG4gICAgICB2YXIgaSA9IE1hdGguZmxvb3IobG9nKHUpKSxcbiAgICAgICAgICBqID0gTWF0aC5jZWlsKGxvZyh2KSksXG4gICAgICAgICAgayxcbiAgICAgICAgICB0LFxuICAgICAgICAgIG4gPSBiYXNlICUgMSA/IDIgOiBiYXNlLFxuICAgICAgICAgIHRpY2tzID0gW107XG5cbiAgICAgIGlmIChpc0Zpbml0ZShqIC0gaSkpIHtcbiAgICAgICAgaWYgKHUgPiAwKSB7XG4gICAgICAgICAgZm9yICgtLWosIGsgPSAxOyBrIDwgbjsgKytrKSBpZiAoKHQgPSBwb3coaSkgKiBrKSA8IHUpIGNvbnRpbnVlOyBlbHNlIHRpY2tzLnB1c2godCk7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGopIGZvciAoayA9IDE7IGsgPCBuOyArK2spIHRpY2tzLnB1c2gocG93KGkpICogayk7XG4gICAgICAgICAgZm9yIChrID0gMTsgayA8IG47ICsraykgaWYgKCh0ID0gcG93KGkpICogaykgPiB2KSBicmVhazsgZWxzZSB0aWNrcy5wdXNoKHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAoKytpLCBrID0gbiAtIDE7IGsgPj0gMTsgLS1rKSBpZiAoKHQgPSBwb3coaSkgKiBrKSA8IHUpIGNvbnRpbnVlOyBlbHNlIHRpY2tzLnB1c2godCk7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGopIGZvciAoayA9IG4gLSAxOyBrID49IDE7IC0taykgdGlja3MucHVzaChwb3coaSkgKiBrKTtcbiAgICAgICAgICBmb3IgKGsgPSBuIC0gMTsgayA+PSAxOyAtLWspIGlmICgodCA9IHBvdyhpKSAqIGspID4gdikgYnJlYWs7IGVsc2UgdGlja3MucHVzaCh0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGlja3M7XG4gICAgfTtcblxuICAgIHNjYWxlLnRpY2tGb3JtYXQgPSBmdW5jdGlvbihjb3VudCwgc3BlY2lmaWVyKSB7XG4gICAgICBpZiAoc3BlY2lmaWVyID09IG51bGwpIHNwZWNpZmllciA9IGJhc2UgPT09IDEwID8gdGlja0Zvcm1hdDEwIDogdGlja0Zvcm1hdE90aGVyO1xuICAgICAgZWxzZSBpZiAodHlwZW9mIHNwZWNpZmllciAhPT0gXCJmdW5jdGlvblwiKSBzcGVjaWZpZXIgPSBmb3JtYXQoc3BlY2lmaWVyKTtcbiAgICAgIGlmIChjb3VudCA9PSBudWxsKSByZXR1cm4gc3BlY2lmaWVyO1xuICAgICAgdmFyIGsgPSBNYXRoLm1pbihiYXNlLCBzY2FsZS50aWNrcygpLmxlbmd0aCAvIGNvdW50KSxcbiAgICAgICAgICBmID0gZG9tYWluWzBdID4gMCA/IChlID0gMWUtMTIsIE1hdGguY2VpbCkgOiAoZSA9IC0xZS0xMiwgTWF0aC5mbG9vciksXG4gICAgICAgICAgZTtcbiAgICAgIHJldHVybiBmdW5jdGlvbihkKSB7XG4gICAgICAgIHJldHVybiBwb3coZihsb2coZCkgKyBlKSkgLyBkID49IGsgPyBzcGVjaWZpZXIoZCkgOiBcIlwiO1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgc2NhbGUuY29weSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ld0xvZyhsaW5lYXIuY29weSgpLCBiYXNlLCBkb21haW4pO1xuICAgIH07XG5cbiAgICByZXR1cm4gcmViaW5kKHNjYWxlLCBsaW5lYXIpO1xuICB9XG5cbiAgZnVuY3Rpb24gbG9nKCkge1xuICAgIHJldHVybiBuZXdMb2cobGluZWFyKCksIDEwLCBbMSwgMTBdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5ld0lkZW50aXR5KGRvbWFpbikge1xuXG4gICAgZnVuY3Rpb24gc2NhbGUoeCkge1xuICAgICAgcmV0dXJuICt4O1xuICAgIH1cblxuICAgIHNjYWxlLmludmVydCA9IHNjYWxlO1xuXG4gICAgc2NhbGUuZG9tYWluID0gc2NhbGUucmFuZ2UgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBkb21haW4uc2xpY2UoKTtcbiAgICAgIGRvbWFpbiA9IHgubWFwKE51bWJlcik7XG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIHNjYWxlLnRpY2tzID0gZnVuY3Rpb24oY291bnQpIHtcbiAgICAgIHJldHVybiB0aWNrcyhkb21haW4sIGNvdW50KTtcbiAgICB9O1xuXG4gICAgc2NhbGUudGlja0Zvcm1hdCA9IGZ1bmN0aW9uKGNvdW50LCBzcGVjaWZpZXIpIHtcbiAgICAgIHJldHVybiB0aWNrRm9ybWF0KGRvbWFpbiwgY291bnQsIHNwZWNpZmllcik7XG4gICAgfTtcblxuICAgIHNjYWxlLmNvcHkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXdJZGVudGl0eShkb21haW4pO1xuICAgIH07XG5cbiAgICByZXR1cm4gc2NhbGU7XG4gIH1cblxuICBmdW5jdGlvbiBpZGVudGl0eSgpIHtcbiAgICByZXR1cm4gbmV3SWRlbnRpdHkoWzAsIDFdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhdGVnb3J5MjBjKCkge1xuICAgIHJldHVybiBvcmRpbmFsKCkucmFuZ2UoW1xuICAgICAgXCIjMzE4MmJkXCIsIFwiIzZiYWVkNlwiLCBcIiM5ZWNhZTFcIiwgXCIjYzZkYmVmXCIsXG4gICAgICBcIiNlNjU1MGRcIiwgXCIjZmQ4ZDNjXCIsIFwiI2ZkYWU2YlwiLCBcIiNmZGQwYTJcIixcbiAgICAgIFwiIzMxYTM1NFwiLCBcIiM3NGM0NzZcIiwgXCIjYTFkOTliXCIsIFwiI2M3ZTljMFwiLFxuICAgICAgXCIjNzU2YmIxXCIsIFwiIzllOWFjOFwiLCBcIiNiY2JkZGNcIiwgXCIjZGFkYWViXCIsXG4gICAgICBcIiM2MzYzNjNcIiwgXCIjOTY5Njk2XCIsIFwiI2JkYmRiZFwiLCBcIiNkOWQ5ZDlcIlxuICAgIF0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2F0ZWdvcnkyMGIoKSB7XG4gICAgcmV0dXJuIG9yZGluYWwoKS5yYW5nZShbXG4gICAgICBcIiMzOTNiNzlcIiwgXCIjNTI1NGEzXCIsIFwiIzZiNmVjZlwiLCBcIiM5YzllZGVcIixcbiAgICAgIFwiIzYzNzkzOVwiLCBcIiM4Y2EyNTJcIiwgXCIjYjVjZjZiXCIsIFwiI2NlZGI5Y1wiLFxuICAgICAgXCIjOGM2ZDMxXCIsIFwiI2JkOWUzOVwiLCBcIiNlN2JhNTJcIiwgXCIjZTdjYjk0XCIsXG4gICAgICBcIiM4NDNjMzlcIiwgXCIjYWQ0OTRhXCIsIFwiI2Q2NjE2YlwiLCBcIiNlNzk2OWNcIixcbiAgICAgIFwiIzdiNDE3M1wiLCBcIiNhNTUxOTRcIiwgXCIjY2U2ZGJkXCIsIFwiI2RlOWVkNlwiXG4gICAgXSk7XG4gIH1cblxuICBmdW5jdGlvbiBjYXRlZ29yeTIwKCkge1xuICAgIHJldHVybiBvcmRpbmFsKCkucmFuZ2UoW1xuICAgICAgXCIjMWY3N2I0XCIsIFwiI2FlYzdlOFwiLFxuICAgICAgXCIjZmY3ZjBlXCIsIFwiI2ZmYmI3OFwiLFxuICAgICAgXCIjMmNhMDJjXCIsIFwiIzk4ZGY4YVwiLFxuICAgICAgXCIjZDYyNzI4XCIsIFwiI2ZmOTg5NlwiLFxuICAgICAgXCIjOTQ2N2JkXCIsIFwiI2M1YjBkNVwiLFxuICAgICAgXCIjOGM1NjRiXCIsIFwiI2M0OWM5NFwiLFxuICAgICAgXCIjZTM3N2MyXCIsIFwiI2Y3YjZkMlwiLFxuICAgICAgXCIjN2Y3ZjdmXCIsIFwiI2M3YzdjN1wiLFxuICAgICAgXCIjYmNiZDIyXCIsIFwiI2RiZGI4ZFwiLFxuICAgICAgXCIjMTdiZWNmXCIsIFwiIzllZGFlNVwiXG4gICAgXSk7XG4gIH1cblxuICBmdW5jdGlvbiBjYXRlZ29yeTEwKCkge1xuICAgIHJldHVybiBvcmRpbmFsKCkucmFuZ2UoW1xuICAgICAgXCIjMWY3N2I0XCIsXG4gICAgICBcIiNmZjdmMGVcIixcbiAgICAgIFwiIzJjYTAyY1wiLFxuICAgICAgXCIjZDYyNzI4XCIsXG4gICAgICBcIiM5NDY3YmRcIixcbiAgICAgIFwiIzhjNTY0YlwiLFxuICAgICAgXCIjZTM3N2MyXCIsXG4gICAgICBcIiM3ZjdmN2ZcIixcbiAgICAgIFwiI2JjYmQyMlwiLFxuICAgICAgXCIjMTdiZWNmXCJcbiAgICBdKTtcbiAgfVxuXG4gIGV4cG9ydHMuY2F0ZWdvcnkxMCA9IGNhdGVnb3J5MTA7XG4gIGV4cG9ydHMuY2F0ZWdvcnkyMCA9IGNhdGVnb3J5MjA7XG4gIGV4cG9ydHMuY2F0ZWdvcnkyMGIgPSBjYXRlZ29yeTIwYjtcbiAgZXhwb3J0cy5jYXRlZ29yeTIwYyA9IGNhdGVnb3J5MjBjO1xuICBleHBvcnRzLmlkZW50aXR5ID0gaWRlbnRpdHk7XG4gIGV4cG9ydHMubGluZWFyID0gbGluZWFyO1xuICBleHBvcnRzLmxvZyA9IGxvZztcbiAgZXhwb3J0cy5vcmRpbmFsID0gb3JkaW5hbDtcbiAgZXhwb3J0cy5wb3cgPSBwb3c7XG4gIGV4cG9ydHMucXVhbnRpbGUgPSBfcXVhbnRpbGU7XG4gIGV4cG9ydHMucXVhbnRpemUgPSBxdWFudGl6ZTtcbiAgZXhwb3J0cy5zcXJ0ID0gc3FydDtcbiAgZXhwb3J0cy50aHJlc2hvbGQgPSB0aHJlc2hvbGQ7XG5cbn0pKTsiLCJpZiAodHlwZW9mIE1hcCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICBNYXAgPSBmdW5jdGlvbigpIHt9O1xuICBNYXAucHJvdG90eXBlID0ge1xuICAgIHNldDogZnVuY3Rpb24oaywgdikgeyB0aGlzW1wiJFwiICsga10gPSB2OyByZXR1cm4gdGhpczsgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKGspIHsgcmV0dXJuIHRoaXNbXCIkXCIgKyBrXTsgfSxcbiAgICBoYXM6IGZ1bmN0aW9uKGspIHsgcmV0dXJuIFwiJFwiICsgayBpbiB0aGlzOyB9XG4gIH07XG59XG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICAgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gICAgZ2xvYmFsLmQzID0gZmFjdG9yeSgpO1xufSh0aGlzLCBmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBidWc0NDA4MyA9IHR5cGVvZiBuYXZpZ2F0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgL1dlYktpdC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSA/IC0xIDogMDsgLy8gaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTQ0MDgzLy8gV2hlbiBkZXB0aCA9IDEsIHJvb3QgPSBbTm9kZSwg4oCmXS5cbiAgICAvLyBXaGVuIGRlcHRoID0gMiwgcm9vdCA9IFtbTm9kZSwg4oCmXSwg4oCmXS5cbiAgICAvLyBXaGVuIGRlcHRoID0gMywgcm9vdCA9IFtbW05vZGUsIOKApl0sIOKApl0sIOKApl0uIGV0Yy5cbiAgICAvLyBOb3RlIHRoYXQgW05vZGUsIOKApl0gYW5kIE5vZGVMaXN0IGFyZSB1c2VkIGludGVyY2hhbmdlYWJseTsgc2VlIGFycmF5aWZ5LlxuXG4gICAgZnVuY3Rpb24gU2VsZWN0aW9uKHJvb3QsIGRlcHRoKSB7XG4gICAgICB0aGlzLl9yb290ID0gcm9vdDtcbiAgICAgIHRoaXMuX2RlcHRoID0gZGVwdGg7XG4gICAgICB0aGlzLl9lbnRlciA9IHRoaXMuX3VwZGF0ZSA9IHRoaXMuX2V4aXQgPSBudWxsO1xuICAgIH1cbiAgICB2YXIgZGVmYXVsdFZpZXcgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICByZXR1cm4gbm9kZVxuICAgICAgICAgICYmICgobm9kZS5vd25lckRvY3VtZW50ICYmIG5vZGUub3duZXJEb2N1bWVudC5kZWZhdWx0VmlldykgLy8gbm9kZSBpcyBhIE5vZGVcbiAgICAgICAgICAgICAgfHwgKG5vZGUuZG9jdW1lbnQgJiYgbm9kZSkgLy8gbm9kZSBpcyBhIFdpbmRvd1xuICAgICAgICAgICAgICB8fCBub2RlLmRlZmF1bHRWaWV3KTsgLy8gbm9kZSBpcyBhIERvY3VtZW50XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlzcGF0Y2hFdmVudChub2RlLCB0eXBlLCBwYXJhbXMpIHtcbiAgICAgIHZhciB3aW5kb3cgPSBkZWZhdWx0Vmlldyhub2RlKSxcbiAgICAgICAgICBldmVudCA9IHdpbmRvdy5DdXN0b21FdmVudDtcblxuICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50ID0gbmV3IGV2ZW50KHR5cGUsIHBhcmFtcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBldmVudCA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFdmVudChcIkV2ZW50XCIpO1xuICAgICAgICBpZiAocGFyYW1zKSBldmVudC5pbml0RXZlbnQodHlwZSwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlKSwgZXZlbnQuZGV0YWlsID0gcGFyYW1zLmRldGFpbDtcbiAgICAgICAgZWxzZSBldmVudC5pbml0RXZlbnQodHlwZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgIH1cblxuICAgICAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICB9XG5cbiAgICB2YXIgc2VsZWN0aW9uX2Rpc3BhdGNoID0gZnVuY3Rpb24odHlwZSwgcGFyYW1zKSB7XG5cbiAgICAgIGZ1bmN0aW9uIGRpc3BhdGNoQ29uc3RhbnQoKSB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaEV2ZW50KHRoaXMsIHR5cGUsIHBhcmFtcyk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRpc3BhdGNoRnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBkaXNwYXRjaEV2ZW50KHRoaXMsIHR5cGUsIHBhcmFtcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZWFjaCh0eXBlb2YgcGFyYW1zID09PSBcImZ1bmN0aW9uXCIgPyBkaXNwYXRjaEZ1bmN0aW9uIDogZGlzcGF0Y2hDb25zdGFudCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9vcCgpIHt9XG4gICAgdmFyIHJlcXVvdGVSZSA9IC9bXFxcXFxcXlxcJFxcKlxcK1xcP1xcfFxcW1xcXVxcKFxcKVxcLlxce1xcfV0vZztcblxuICAgIHZhciByZXF1b3RlID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UocmVxdW90ZVJlLCBcIlxcXFwkJlwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJMaXN0ZW5lck9mKGxpc3RlbmVyKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIHJlbGF0ZWQgPSBldmVudC5yZWxhdGVkVGFyZ2V0O1xuICAgICAgICBpZiAoIXJlbGF0ZWQgfHwgKHJlbGF0ZWQgIT09IHRoaXMgJiYgIShyZWxhdGVkLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKHRoaXMpICYgOCkpKSB7XG4gICAgICAgICAgbGlzdGVuZXIoZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhciBldmVudCA9IG51bGw7XG5cbiAgICBmdW5jdGlvbiBsaXN0ZW5lck9mKGxpc3RlbmVyLCBhbmNlc3RvcnMsIGFyZ3MpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihldmVudDEpIHtcbiAgICAgICAgdmFyIGkgPSBhbmNlc3RvcnMubGVuZ3RoLCBldmVudDAgPSBldmVudDsgLy8gRXZlbnRzIGNhbiBiZSByZWVudHJhbnQgKGUuZy4sIGZvY3VzKS5cbiAgICAgICAgd2hpbGUgKC0taSA+PSAwKSBhcmdzW2kgPDwgMV0gPSBhbmNlc3RvcnNbaV0uX19kYXRhX187XG4gICAgICAgIGV2ZW50ID0gZXZlbnQxO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGxpc3RlbmVyLmFwcGx5KGFuY2VzdG9yc1swXSwgYXJncyk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgZXZlbnQgPSBldmVudDA7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIGZpbHRlckV2ZW50cyA9IG5ldyBNYXA7XG5cbiAgICB2YXIgc2VsZWN0aW9uX2V2ZW50ID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIsIGNhcHR1cmUpIHtcbiAgICAgIHZhciBuID0gYXJndW1lbnRzLmxlbmd0aCxcbiAgICAgICAgICBrZXkgPSBcIl9fb25cIiArIHR5cGUsXG4gICAgICAgICAgZmlsdGVyLFxuICAgICAgICAgIHJvb3QgPSB0aGlzLl9yb290O1xuXG4gICAgICBpZiAobiA8IDIpIHJldHVybiAobiA9IHRoaXMubm9kZSgpW2tleV0pICYmIG4uX2xpc3RlbmVyO1xuXG4gICAgICBpZiAobiA8IDMpIGNhcHR1cmUgPSBmYWxzZTtcbiAgICAgIGlmICgobiA9IHR5cGUuaW5kZXhPZihcIi5cIikpID4gMCkgdHlwZSA9IHR5cGUuc2xpY2UoMCwgbik7XG4gICAgICBpZiAoZmlsdGVyID0gZmlsdGVyRXZlbnRzLmhhcyh0eXBlKSkgdHlwZSA9IGZpbHRlckV2ZW50cy5nZXQodHlwZSk7XG5cbiAgICAgIGZ1bmN0aW9uIGFkZCgpIHtcbiAgICAgICAgdmFyIGFuY2VzdG9yID0gcm9vdCwgaSA9IGFyZ3VtZW50cy5sZW5ndGggPj4gMSwgYW5jZXN0b3JzID0gbmV3IEFycmF5KGkpO1xuICAgICAgICB3aGlsZSAoLS1pID49IDApIGFuY2VzdG9yID0gYW5jZXN0b3JbYXJndW1lbnRzWyhpIDw8IDEpICsgMV1dLCBhbmNlc3RvcnNbaV0gPSBpID8gYW5jZXN0b3IuX3BhcmVudCA6IGFuY2VzdG9yO1xuICAgICAgICB2YXIgbCA9IGxpc3RlbmVyT2YobGlzdGVuZXIsIGFuY2VzdG9ycywgYXJndW1lbnRzKTtcbiAgICAgICAgaWYgKGZpbHRlcikgbCA9IGZpbHRlckxpc3RlbmVyT2YobCk7XG4gICAgICAgIHJlbW92ZS5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgdGhpc1trZXldID0gbCwgbC5fY2FwdHVyZSA9IGNhcHR1cmUpO1xuICAgICAgICBsLl9saXN0ZW5lciA9IGxpc3RlbmVyO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICAgIHZhciBsID0gdGhpc1trZXldO1xuICAgICAgICBpZiAobCkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsLCBsLl9jYXB0dXJlKTtcbiAgICAgICAgICBkZWxldGUgdGhpc1trZXldO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHJlbW92ZUFsbCgpIHtcbiAgICAgICAgdmFyIHJlID0gbmV3IFJlZ0V4cChcIl5fX29uKFteLl0rKVwiICsgcmVxdW90ZSh0eXBlKSArIFwiJFwiKSwgbWF0Y2g7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIGlmIChtYXRjaCA9IG5hbWUubWF0Y2gocmUpKSB7XG4gICAgICAgICAgICB2YXIgbCA9IHRoaXNbbmFtZV07XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIobWF0Y2hbMV0sIGwsIGwuX2NhcHR1cmUpO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXNbbmFtZV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmVhY2gobGlzdGVuZXJcbiAgICAgICAgICA/IChuID8gYWRkIDogbm9vcCkgLy8gQXR0ZW1wdCB0byBhZGQgdW50eXBlZCBsaXN0ZW5lciBpcyBpZ25vcmVkLlxuICAgICAgICAgIDogKG4gPyByZW1vdmUgOiByZW1vdmVBbGwpKTtcbiAgICB9XG4gICAgdmFyIHNlbGVjdGlvbl9kYXR1bSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IHRoaXMucHJvcGVydHkoXCJfX2RhdGFfX1wiLCB2YWx1ZSkgOiB0aGlzLm5vZGUoKS5fX2RhdGFfXztcbiAgICB9XG4gICAgdmFyIHNlbGVjdGlvbl9yZW1vdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG4gICAgICAgIGlmIChwYXJlbnQpIHBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB2YXIgc2VsZWN0b3JPZiA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgfTtcbiAgICB9XG4gICAgdmFyIG5hbWVzcGFjZXMgPSAobmV3IE1hcClcbiAgICAgICAgLnNldChcInN2Z1wiLCBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIpXG4gICAgICAgIC5zZXQoXCJ4aHRtbFwiLCBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIilcbiAgICAgICAgLnNldChcInhsaW5rXCIsIFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiKVxuICAgICAgICAuc2V0KFwieG1sXCIsIFwiaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlXCIpXG4gICAgICAgIC5zZXQoXCJ4bWxuc1wiLCBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvXCIpO1xuXG4gICAgdmFyIG5hbWVzcGFjZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBpID0gbmFtZS5pbmRleE9mKFwiOlwiKSwgcHJlZml4ID0gbmFtZTtcbiAgICAgIGlmIChpID49IDApIHByZWZpeCA9IG5hbWUuc2xpY2UoMCwgaSksIG5hbWUgPSBuYW1lLnNsaWNlKGkgKyAxKTtcbiAgICAgIHJldHVybiBuYW1lc3BhY2VzLmhhcyhwcmVmaXgpID8ge3NwYWNlOiBuYW1lc3BhY2VzLmdldChwcmVmaXgpLCBsb2NhbDogbmFtZX0gOiBuYW1lO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0b3JPZihuYW1lKSB7XG4gICAgICBuYW1lID0gbmFtZXNwYWNlKG5hbWUpO1xuXG4gICAgICBmdW5jdGlvbiBjcmVhdG9yKCkge1xuICAgICAgICB2YXIgZG9jdW1lbnQgPSB0aGlzLm93bmVyRG9jdW1lbnQsXG4gICAgICAgICAgICB1cmkgPSB0aGlzLm5hbWVzcGFjZVVSSTtcbiAgICAgICAgcmV0dXJuIHVyaVxuICAgICAgICAgICAgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModXJpLCBuYW1lKVxuICAgICAgICAgICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBjcmVhdG9yTlMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmFtZS5sb2NhbCA/IGNyZWF0b3JOUyA6IGNyZWF0b3I7XG4gICAgfVxuXG4gICAgdmFyIHNlbGVjdGlvbl9hcHBlbmQgPSBmdW5jdGlvbihjcmVhdG9yLCBzZWxlY3Rvcikge1xuICAgICAgaWYgKHR5cGVvZiBjcmVhdG9yICE9PSBcImZ1bmN0aW9uXCIpIGNyZWF0b3IgPSBjcmVhdG9yT2YoY3JlYXRvcik7XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGVuZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwZW5kQ2hpbGQoY3JlYXRvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaW5zZXJ0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnNlcnRCZWZvcmUoY3JlYXRvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCBzZWxlY3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IG51bGwpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3QoYXJndW1lbnRzLmxlbmd0aCA8IDJcbiAgICAgICAgICA/IGFwcGVuZFxuICAgICAgICAgIDogKHR5cGVvZiBzZWxlY3RvciAhPT0gXCJmdW5jdGlvblwiICYmIChzZWxlY3RvciA9IHNlbGVjdG9yT2Yoc2VsZWN0b3IpKSwgaW5zZXJ0KSk7XG4gICAgfVxuICAgIHZhciBzZWxlY3Rpb25faHRtbCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0aGlzLm5vZGUoKS5pbm5lckhUTUw7XG5cbiAgICAgIGZ1bmN0aW9uIHNldENvbnN0YW50KCkge1xuICAgICAgICB0aGlzLmlubmVySFRNTCA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzZXRGdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB0aGlzLmlubmVySFRNTCA9IHYgPT0gbnVsbCA/IFwiXCIgOiB2O1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWUgPT0gbnVsbCkgdmFsdWUgPSBcIlwiO1xuXG4gICAgICByZXR1cm4gdGhpcy5lYWNoKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiID8gc2V0RnVuY3Rpb24gOiBzZXRDb25zdGFudCk7XG4gICAgfVxuICAgIHZhciBzZWxlY3Rpb25fdGV4dCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0aGlzLm5vZGUoKS50ZXh0Q29udGVudDtcblxuICAgICAgZnVuY3Rpb24gc2V0Q29uc3RhbnQoKSB7XG4gICAgICAgIHRoaXMudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2V0RnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy50ZXh0Q29udGVudCA9IHYgPT0gbnVsbCA/IFwiXCIgOiB2O1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWUgPT0gbnVsbCkgdmFsdWUgPSBcIlwiO1xuXG4gICAgICByZXR1cm4gdGhpcy5lYWNoKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiID8gc2V0RnVuY3Rpb24gOiBzZXRDb25zdGFudCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29sbGFwc2Uoc3RyaW5nKSB7XG4gICAgICByZXR1cm4gc3RyaW5nLnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGFzc2VyT2YobmFtZSkge1xuICAgICAgdmFyIHJlO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG5vZGUsIHZhbHVlKSB7XG4gICAgICAgIGlmIChjID0gbm9kZS5jbGFzc0xpc3QpIHJldHVybiB2YWx1ZSA/IGMuYWRkKG5hbWUpIDogYy5yZW1vdmUobmFtZSk7XG4gICAgICAgIGlmICghcmUpIHJlID0gbmV3IFJlZ0V4cChcIig/Ol58XFxcXHMrKVwiICsgcmVxdW90ZShuYW1lKSArIFwiKD86XFxcXHMrfCQpXCIsIFwiZ1wiKTtcbiAgICAgICAgdmFyIGMgPSBub2RlLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCI7XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgIHJlLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgaWYgKCFyZS50ZXN0KGMpKSBub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGNvbGxhcHNlKGMgKyBcIiBcIiArIG5hbWUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGNvbGxhcHNlKGMucmVwbGFjZShyZSwgXCIgXCIpKSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIHNlbGVjdGlvbl9jbGFzcyA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgICBuYW1lID0gKG5hbWUgKyBcIlwiKS50cmltKCkuc3BsaXQoL158XFxzKy8pO1xuICAgICAgdmFyIG4gPSBuYW1lLmxlbmd0aDtcblxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICAgIHZhciBub2RlID0gdGhpcy5ub2RlKCksIGkgPSAtMTtcbiAgICAgICAgaWYgKHZhbHVlID0gbm9kZS5jbGFzc0xpc3QpIHsgLy8gU1ZHIGVsZW1lbnRzIG1heSBub3Qgc3VwcG9ydCBET01Ub2tlbkxpc3QhXG4gICAgICAgICAgd2hpbGUgKCsraSA8IG4pIGlmICghdmFsdWUuY29udGFpbnMobmFtZVtpXSkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IG5vZGUuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIik7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IG4pIGlmICghY2xhc3NlZFJlKG5hbWVbaV0pLnRlc3QodmFsdWUpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIG5hbWUgPSBuYW1lLm1hcChjbGFzc2VyT2YpO1xuXG4gICAgICBmdW5jdGlvbiBzZXRDb25zdGFudCgpIHtcbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraSA8IG4pIG5hbWVbaV0odGhpcywgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzZXRGdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgeCA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIHdoaWxlICgrK2kgPCBuKSBuYW1lW2ldKHRoaXMsIHgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5lYWNoKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiID8gc2V0RnVuY3Rpb24gOiBzZXRDb25zdGFudCk7XG4gICAgfVxuICAgIHZhciBzZWxlY3Rpb25fcHJvcGVydHkgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSByZXR1cm4gdGhpcy5ub2RlKClbbmFtZV07XG5cbiAgICAgIGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgICAgZGVsZXRlIHRoaXNbbmFtZV07XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNldENvbnN0YW50KCkge1xuICAgICAgICB0aGlzW25hbWVdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNldEZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgeCA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGlmICh4ID09IG51bGwpIGRlbGV0ZSB0aGlzW25hbWVdO1xuICAgICAgICBlbHNlIHRoaXNbbmFtZV0gPSB4O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5lYWNoKHZhbHVlID09IG51bGwgPyByZW1vdmUgOiB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIiA/IHNldEZ1bmN0aW9uIDogc2V0Q29uc3RhbnQpO1xuICAgIH1cblxuICAgIHZhciBzZWxlY3Rpb25fc3R5bGUgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpIHtcbiAgICAgIHZhciBuID0gYXJndW1lbnRzLmxlbmd0aDtcblxuICAgICAgaWYgKG4gPCAyKSByZXR1cm4gZGVmYXVsdFZpZXcobiA9IHRoaXMubm9kZSgpKS5nZXRDb21wdXRlZFN0eWxlKG4sIG51bGwpLmdldFByb3BlcnR5VmFsdWUobmFtZSk7XG5cbiAgICAgIGlmIChuIDwgMykgcHJpb3JpdHkgPSBcIlwiO1xuXG4gICAgICBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICAgIHRoaXMuc3R5bGUucmVtb3ZlUHJvcGVydHkobmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNldENvbnN0YW50KCkge1xuICAgICAgICB0aGlzLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHZhbHVlLCBwcmlvcml0eSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNldEZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgeCA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGlmICh4ID09IG51bGwpIHRoaXMuc3R5bGUucmVtb3ZlUHJvcGVydHkobmFtZSk7XG4gICAgICAgIGVsc2UgdGhpcy5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB4LCBwcmlvcml0eSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmVhY2godmFsdWUgPT0gbnVsbCA/IHJlbW92ZSA6IHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiID8gc2V0RnVuY3Rpb24gOiBzZXRDb25zdGFudCk7XG4gICAgfVxuXG4gICAgdmFyIHNlbGVjdGlvbl9hdHRyID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICAgIG5hbWUgPSBuYW1lc3BhY2UobmFtZSk7XG5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgICB2YXIgbm9kZSA9IHRoaXMubm9kZSgpO1xuICAgICAgICByZXR1cm4gbmFtZS5sb2NhbFxuICAgICAgICAgICAgPyBub2RlLmdldEF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwpXG4gICAgICAgICAgICA6IG5vZGUuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiByZW1vdmVOUygpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGVOUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2V0Q29uc3RhbnQoKSB7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2V0Q29uc3RhbnROUygpIHtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGVOUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsLCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNldEZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgeCA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGlmICh4ID09IG51bGwpIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgICBlbHNlIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHgpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzZXRGdW5jdGlvbk5TKCkge1xuICAgICAgICB2YXIgeCA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGlmICh4ID09IG51bGwpIHRoaXMucmVtb3ZlQXR0cmlidXRlTlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbCk7XG4gICAgICAgIGVsc2UgdGhpcy5zZXRBdHRyaWJ1dGVOUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsLCB4KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZWFjaCh2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgPyAobmFtZS5sb2NhbCA/IHJlbW92ZU5TIDogcmVtb3ZlKVxuICAgICAgICAgIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICAgID8gKG5hbWUubG9jYWwgPyBzZXRGdW5jdGlvbk5TIDogc2V0RnVuY3Rpb24pXG4gICAgICAgICAgICAgIDogKG5hbWUubG9jYWwgPyBzZXRDb25zdGFudE5TIDogc2V0Q29uc3RhbnQpKSk7XG4gICAgfVxuICAgIHZhciBzZWxlY3Rpb25fZWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgZGVwdGggPSB0aGlzLl9kZXB0aCxcbiAgICAgICAgICBzdGFjayA9IG5ldyBBcnJheShkZXB0aCk7XG5cbiAgICAgIGZ1bmN0aW9uIHZpc2l0KG5vZGVzLCBkZXB0aCkge1xuICAgICAgICB2YXIgaSA9IC0xLFxuICAgICAgICAgICAgbiA9IG5vZGVzLmxlbmd0aCxcbiAgICAgICAgICAgIG5vZGU7XG5cbiAgICAgICAgaWYgKC0tZGVwdGgpIHtcbiAgICAgICAgICB2YXIgc3RhY2swID0gZGVwdGggKiAyLFxuICAgICAgICAgICAgICBzdGFjazEgPSBzdGFjazAgKyAxO1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgICBpZiAobm9kZSA9IG5vZGVzW2ldKSB7XG4gICAgICAgICAgICAgIHN0YWNrW3N0YWNrMF0gPSBub2RlLl9wYXJlbnQuX19kYXRhX18sIHN0YWNrW3N0YWNrMV0gPSBpO1xuICAgICAgICAgICAgICB2aXNpdChub2RlLCBkZXB0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICAgIGlmIChub2RlID0gbm9kZXNbaV0pIHtcbiAgICAgICAgICAgICAgc3RhY2tbMF0gPSBub2RlLl9fZGF0YV9fLCBzdGFja1sxXSA9IGk7XG4gICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KG5vZGUsIHN0YWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmlzaXQodGhpcy5fcm9vdCwgZGVwdGgpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHZhciBzZWxlY3Rpb25fZW1wdHkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhdGhpcy5ub2RlKCk7XG4gICAgfVxuICAgIHZhciBzZWxlY3Rpb25fc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNpemUgPSAwO1xuICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKCkgeyArK3NpemU7IH0pO1xuICAgICAgcmV0dXJuIHNpemU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmlyc3ROb2RlKG5vZGVzLCBkZXB0aCkge1xuICAgICAgdmFyIGkgPSAtMSxcbiAgICAgICAgICBuID0gbm9kZXMubGVuZ3RoLFxuICAgICAgICAgIG5vZGU7XG5cbiAgICAgIGlmICgtLWRlcHRoKSB7XG4gICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgaWYgKG5vZGUgPSBub2Rlc1tpXSkge1xuICAgICAgICAgICAgaWYgKG5vZGUgPSBmaXJzdE5vZGUobm9kZSwgZGVwdGgpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlbHNlIHtcbiAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICBpZiAobm9kZSA9IG5vZGVzW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIHNlbGVjdGlvbl9ub2RlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZmlyc3ROb2RlKHRoaXMuX3Jvb3QsIHRoaXMuX2RlcHRoKTtcbiAgICB9XG4gICAgdmFyIHNlbGVjdGlvbl9ub2RlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG5vZGVzID0gbmV3IEFycmF5KHRoaXMuc2l6ZSgpKSwgaSA9IC0xO1xuICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKCkgeyBub2Rlc1srK2ldID0gdGhpczsgfSk7XG4gICAgICByZXR1cm4gbm9kZXM7XG4gICAgfVxuICAgIHZhciBzZWxlY3Rpb25fY2FsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzWzBdO1xuICAgICAgY2FsbGJhY2suYXBwbHkoYXJndW1lbnRzWzBdID0gdGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFycmF5aWZ5Tm9kZShub2RlcywgZGVwdGgpIHtcbiAgICAgIHZhciBpID0gLTEsXG4gICAgICAgICAgbiA9IG5vZGVzLmxlbmd0aCxcbiAgICAgICAgICBub2RlO1xuXG4gICAgICBpZiAoLS1kZXB0aCkge1xuICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgIGlmIChub2RlID0gbm9kZXNbaV0pIHtcbiAgICAgICAgICAgIG5vZGVzW2ldID0gYXJyYXlpZnlOb2RlKG5vZGUsIGRlcHRoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZWxzZSBpZiAoIUFycmF5LmlzQXJyYXkobm9kZXMpKSB7XG4gICAgICAgIHZhciBhcnJheSA9IG5ldyBBcnJheShuKTtcbiAgICAgICAgd2hpbGUgKCsraSA8IG4pIGFycmF5W2ldID0gbm9kZXNbaV07XG4gICAgICAgIGFycmF5Ll9wYXJlbnQgPSBub2Rlcy5fcGFyZW50O1xuICAgICAgICBub2RlcyA9IGFycmF5O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbm9kZXM7XG4gICAgfS8vIFRoZSBsZWFmIGdyb3VwcyBvZiB0aGUgc2VsZWN0aW9uIGhpZXJhcmNoeSBhcmUgaW5pdGlhbGx5IE5vZGVMaXN0LFxuICAgIC8vIGFuZCB0aGVuIGxhemlseSBjb252ZXJ0ZWQgdG8gYXJyYXlzIHdoZW4gbXV0YXRpb24gaXMgcmVxdWlyZWQuXG4gICAgdmFyIGFycmF5aWZ5ID0gZnVuY3Rpb24oc2VsZWN0aW9uKSB7XG4gICAgICByZXR1cm4gc2VsZWN0aW9uLl9yb290ID0gYXJyYXlpZnlOb2RlKHNlbGVjdGlvbi5fcm9vdCwgc2VsZWN0aW9uLl9kZXB0aCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXNjZW5kaW5nKGEsIGIpIHtcbiAgICAgIHJldHVybiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogYSA+PSBiID8gMCA6IE5hTjtcbiAgICB9XG5cbiAgICB2YXIgc2VsZWN0aW9uX3NvcnQgPSBmdW5jdGlvbihjb21wYXJhdG9yKSB7XG4gICAgICBpZiAoIWNvbXBhcmF0b3IpIGNvbXBhcmF0b3IgPSBhc2NlbmRpbmc7XG5cbiAgICAgIGZ1bmN0aW9uIGNvbXBhcmUoYSwgYikge1xuICAgICAgICByZXR1cm4gYSAmJiBiID8gY29tcGFyYXRvcihhLl9fZGF0YV9fLCBiLl9fZGF0YV9fKSA6ICFhIC0gIWI7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHZpc2l0KG5vZGVzLCBkZXB0aCkge1xuICAgICAgICBpZiAoLS1kZXB0aCkge1xuICAgICAgICAgIHZhciBpID0gLTEsXG4gICAgICAgICAgICAgIG4gPSBub2Rlcy5sZW5ndGgsXG4gICAgICAgICAgICAgIG5vZGU7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICAgIGlmIChub2RlID0gbm9kZXNbaV0pIHtcbiAgICAgICAgICAgICAgdmlzaXQobm9kZSwgZGVwdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIG5vZGVzLnNvcnQoY29tcGFyZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmlzaXQoYXJyYXlpZnkodGhpcyksIHRoaXMuX2RlcHRoKTtcbiAgICAgIHJldHVybiB0aGlzLm9yZGVyKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb3JkZXJOb2RlKG5vZGVzLCBkZXB0aCkge1xuICAgICAgdmFyIGkgPSBub2Rlcy5sZW5ndGgsXG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBuZXh0O1xuXG4gICAgICBpZiAoLS1kZXB0aCkge1xuICAgICAgICB3aGlsZSAoLS1pID49IDApIHtcbiAgICAgICAgICBpZiAobm9kZSA9IG5vZGVzW2ldKSB7XG4gICAgICAgICAgICBvcmRlck5vZGUobm9kZSwgZGVwdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlbHNlIHtcbiAgICAgICAgbmV4dCA9IG5vZGVzWy0taV07XG4gICAgICAgIHdoaWxlICgtLWkgPj0gMCkge1xuICAgICAgICAgIGlmIChub2RlID0gbm9kZXNbaV0pIHtcbiAgICAgICAgICAgIGlmIChuZXh0ICYmIG5leHQgIT09IG5vZGUubmV4dFNpYmxpbmcpIG5leHQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZSwgbmV4dCk7XG4gICAgICAgICAgICBuZXh0ID0gbm9kZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIHNlbGVjdGlvbl9vcmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgb3JkZXJOb2RlKHRoaXMuX3Jvb3QsIHRoaXMuX2RlcHRoKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVtcHR5Tm9kZShub2RlcywgZGVwdGgpIHtcbiAgICAgIHZhciBpID0gLTEsXG4gICAgICAgICAgbiA9IG5vZGVzLmxlbmd0aCxcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIGVtcHR5ID0gbmV3IEFycmF5KG4pO1xuXG4gICAgICBpZiAoLS1kZXB0aCkge1xuICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgIGlmIChub2RlID0gbm9kZXNbaV0pIHtcbiAgICAgICAgICAgIGVtcHR5W2ldID0gZW1wdHlOb2RlKG5vZGUsIGRlcHRoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZW1wdHkuX3BhcmVudCA9IG5vZGVzLl9wYXJlbnQ7XG4gICAgICByZXR1cm4gZW1wdHk7XG4gICAgfVxuXG4gICAgdmFyIGVtcHR5T2YgPSBmdW5jdGlvbihzZWxlY3Rpb24pIHtcbiAgICAgIHJldHVybiBuZXcgU2VsZWN0aW9uKGVtcHR5Tm9kZShhcnJheWlmeShzZWxlY3Rpb24pLCBzZWxlY3Rpb24uX2RlcHRoKSwgc2VsZWN0aW9uLl9kZXB0aCk7XG4gICAgfS8vIExhemlseSBjb25zdHJ1Y3RzIHRoZSBleGl0IHNlbGVjdGlvbiBmb3IgdGhpcyAodXBkYXRlKSBzZWxlY3Rpb24uXG4gICAgLy8gVW50aWwgdGhpcyBzZWxlY3Rpb24gaXMgam9pbmVkIHRvIGRhdGEsIHRoZSBleGl0IHNlbGVjdGlvbiB3aWxsIGJlIGVtcHR5LlxuXG4gICAgdmFyIHNlbGVjdGlvbl9leGl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZXhpdCB8fCAodGhpcy5fZXhpdCA9IGVtcHR5T2YodGhpcykpO1xuICAgIH0vLyBMYXppbHkgY29uc3RydWN0cyB0aGUgZW50ZXIgc2VsZWN0aW9uIGZvciB0aGlzICh1cGRhdGUpIHNlbGVjdGlvbi5cbiAgICAvLyBVbnRpbCB0aGlzIHNlbGVjdGlvbiBpcyBqb2luZWQgdG8gZGF0YSwgdGhlIGVudGVyIHNlbGVjdGlvbiB3aWxsIGJlIGVtcHR5LlxuXG4gICAgdmFyIHNlbGVjdGlvbl9lbnRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCF0aGlzLl9lbnRlcikge1xuICAgICAgICB0aGlzLl9lbnRlciA9IGVtcHR5T2YodGhpcyk7XG4gICAgICAgIHRoaXMuX2VudGVyLl91cGRhdGUgPSB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX2VudGVyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIEVudGVyTm9kZShwYXJlbnQsIGRhdHVtKSB7XG4gICAgICB0aGlzLm93bmVyRG9jdW1lbnQgPSBwYXJlbnQub3duZXJEb2N1bWVudDtcbiAgICAgIHRoaXMubmFtZXNwYWNlVVJJID0gcGFyZW50Lm5hbWVzcGFjZVVSSTtcbiAgICAgIHRoaXMuX25leHQgPSBudWxsO1xuICAgICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgICAgdGhpcy5fX2RhdGFfXyA9IGRhdHVtO1xuICAgIH1cblxuICAgIEVudGVyTm9kZS5wcm90b3R5cGUgPSB7XG4gICAgICBhcHBlbmRDaGlsZDogZnVuY3Rpb24oY2hpbGQpIHsgcmV0dXJuIHRoaXMuX3BhcmVudC5pbnNlcnRCZWZvcmUoY2hpbGQsIHRoaXMuX25leHQpOyB9LFxuICAgICAgaW5zZXJ0QmVmb3JlOiBmdW5jdGlvbihjaGlsZCwgbmV4dCkgeyByZXR1cm4gdGhpcy5fcGFyZW50Lmluc2VydEJlZm9yZShjaGlsZCwgbmV4dCB8fCB0aGlzLl9uZXh0KTsgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiB2YWx1ZU9mXyh2YWx1ZSkgeyAvLyBYWFggaHR0cHM6Ly9naXRodWIuY29tL3JvbGx1cC9yb2xsdXAvaXNzdWVzLzEyXG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH07XG4gICAgfS8vIFRoZSB2YWx1ZSBtYXkgZWl0aGVyIGJlIGFuIGFycmF5IG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGFycmF5LlxuICAgIC8vIEFuIG9wdGlvbmFsIGtleSBmdW5jdGlvbiBtYXkgYmUgc3BlY2lmaWVkIHRvIGNvbnRyb2wgaG93IGRhdGEgaXMgYm91bmQ7XG4gICAgLy8gaWYgbm8ga2V5IGZ1bmN0aW9uIGlzIHNwZWNpZmllZCwgZGF0YSBpcyBib3VuZCB0byBub2RlcyBieSBpbmRleC5cbiAgICAvLyBPciwgaWYgbm8gYXJndW1lbnRzIGFyZSBzcGVjaWZpZWQsIHRoaXMgbWV0aG9kIHJldHVybnMgYWxsIGJvdW5kIGRhdGEuXG4gICAgdmFyIHNlbGVjdGlvbl9kYXRhID0gZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICB2YXIgZGF0YSA9IG5ldyBBcnJheSh0aGlzLnNpemUoKSksIGkgPSAtMTtcbiAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKGQpIHsgZGF0YVsrK2ldID0gZDsgfSk7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgfVxuXG4gICAgICB2YXIgZGVwdGggPSB0aGlzLl9kZXB0aCAtIDEsXG4gICAgICAgICAgc3RhY2sgPSBuZXcgQXJyYXkoZGVwdGggKiAyKSxcbiAgICAgICAgICBiaW5kID0ga2V5ID8gYmluZEtleSA6IGJpbmRJbmRleDtcblxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiKSB2YWx1ZSA9IHZhbHVlT2ZfKHZhbHVlKTtcbiAgICAgIHZpc2l0KHRoaXMuX3Jvb3QsIHRoaXMuZW50ZXIoKS5fcm9vdCwgdGhpcy5leGl0KCkuX3Jvb3QsIGRlcHRoKTtcblxuICAgICAgZnVuY3Rpb24gdmlzaXQodXBkYXRlLCBlbnRlciwgZXhpdCwgZGVwdGgpIHtcbiAgICAgICAgdmFyIGkgPSAtMSxcbiAgICAgICAgICAgIG4sXG4gICAgICAgICAgICBub2RlO1xuXG4gICAgICAgIGlmIChkZXB0aC0tKSB7XG4gICAgICAgICAgdmFyIHN0YWNrMCA9IGRlcHRoICogMixcbiAgICAgICAgICAgICAgc3RhY2sxID0gc3RhY2swICsgMTtcblxuICAgICAgICAgIG4gPSB1cGRhdGUubGVuZ3RoO1xuXG4gICAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICAgIGlmIChub2RlID0gdXBkYXRlW2ldKSB7XG4gICAgICAgICAgICAgIHN0YWNrW3N0YWNrMF0gPSBub2RlLl9wYXJlbnQuX19kYXRhX18sIHN0YWNrW3N0YWNrMV0gPSBpO1xuICAgICAgICAgICAgICB2aXNpdChub2RlLCBlbnRlcltpXSwgZXhpdFtpXSwgZGVwdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHZhciBqID0gMCxcbiAgICAgICAgICAgICAgYmVmb3JlO1xuXG4gICAgICAgICAgYmluZCh1cGRhdGUsIGVudGVyLCBleGl0LCB2YWx1ZS5hcHBseSh1cGRhdGUuX3BhcmVudCwgc3RhY2spKTtcbiAgICAgICAgICBuID0gdXBkYXRlLmxlbmd0aDtcblxuICAgICAgICAgIC8vIE5vdyBjb25uZWN0IHRoZSBlbnRlciBub2RlcyB0byB0aGVpciBmb2xsb3dpbmcgdXBkYXRlIG5vZGUsIHN1Y2ggdGhhdFxuICAgICAgICAgIC8vIGFwcGVuZENoaWxkIGNhbiBpbnNlcnQgdGhlIG1hdGVyaWFsaXplZCBlbnRlciBub2RlIGJlZm9yZSB0aGlzIG5vZGUsXG4gICAgICAgICAgLy8gcmF0aGVyIHRoYW4gYXQgdGhlIGVuZCBvZiB0aGUgcGFyZW50IG5vZGUuXG4gICAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICAgIGlmIChiZWZvcmUgPSBlbnRlcltpXSkge1xuICAgICAgICAgICAgICBpZiAoaSA+PSBqKSBqID0gaSArIDE7XG4gICAgICAgICAgICAgIHdoaWxlICghKG5vZGUgPSB1cGRhdGVbal0pICYmICsraiA8IG4pO1xuICAgICAgICAgICAgICBiZWZvcmUuX25leHQgPSBub2RlIHx8IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGJpbmRJbmRleCh1cGRhdGUsIGVudGVyLCBleGl0LCBkYXRhKSB7XG4gICAgICAgIHZhciBpID0gMCxcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBub2RlTGVuZ3RoID0gdXBkYXRlLmxlbmd0aCxcbiAgICAgICAgICAgIGRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aCxcbiAgICAgICAgICAgIG1pbkxlbmd0aCA9IE1hdGgubWluKG5vZGVMZW5ndGgsIGRhdGFMZW5ndGgpO1xuXG4gICAgICAgIC8vIENsZWFyIHRoZSBlbnRlciBhbmQgZXhpdCBhcnJheXMsIGFuZCB0aGVuIGluaXRpYWxpemUgdG8gdGhlIG5ldyBsZW5ndGguXG4gICAgICAgIGVudGVyLmxlbmd0aCA9IDAsIGVudGVyLmxlbmd0aCA9IGRhdGFMZW5ndGg7XG4gICAgICAgIGV4aXQubGVuZ3RoID0gMCwgZXhpdC5sZW5ndGggPSBub2RlTGVuZ3RoO1xuXG4gICAgICAgIGZvciAoOyBpIDwgbWluTGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICBpZiAobm9kZSA9IHVwZGF0ZVtpXSkge1xuICAgICAgICAgICAgbm9kZS5fX2RhdGFfXyA9IGRhdGFbaV07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVudGVyW2ldID0gbmV3IEVudGVyTm9kZSh1cGRhdGUuX3BhcmVudCwgZGF0YVtpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm90ZTogd2UgZG9u4oCZdCBuZWVkIHRvIGRlbGV0ZSB1cGRhdGVbaV0gaGVyZSBiZWNhdXNlIHRoaXMgbG9vcCBvbmx5XG4gICAgICAgIC8vIHJ1bnMgd2hlbiB0aGUgZGF0YSBsZW5ndGggaXMgZ3JlYXRlciB0aGFuIHRoZSBub2RlIGxlbmd0aC5cbiAgICAgICAgZm9yICg7IGkgPCBkYXRhTGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICBlbnRlcltpXSA9IG5ldyBFbnRlck5vZGUodXBkYXRlLl9wYXJlbnQsIGRhdGFbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm90ZTogYW5kLCB3ZSBkb27igJl0IG5lZWQgdG8gZGVsZXRlIHVwZGF0ZVtpXSBoZXJlIGJlY2F1c2UgaW1tZWRpYXRlbHlcbiAgICAgICAgLy8gZm9sbG93aW5nIHRoaXMgbG9vcCB3ZSBzZXQgdGhlIHVwZGF0ZSBsZW5ndGggdG8gZGF0YSBsZW5ndGguXG4gICAgICAgIGZvciAoOyBpIDwgbm9kZUxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgaWYgKG5vZGUgPSB1cGRhdGVbaV0pIHtcbiAgICAgICAgICAgIGV4aXRbaV0gPSB1cGRhdGVbaV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlLmxlbmd0aCA9IGRhdGFMZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGJpbmRLZXkodXBkYXRlLCBlbnRlciwgZXhpdCwgZGF0YSkge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGgsXG4gICAgICAgICAgICBub2RlTGVuZ3RoID0gdXBkYXRlLmxlbmd0aCxcbiAgICAgICAgICAgIG5vZGVCeUtleVZhbHVlID0gbmV3IE1hcCxcbiAgICAgICAgICAgIGtleVN0YWNrID0gbmV3IEFycmF5KDIpLmNvbmNhdChzdGFjayksXG4gICAgICAgICAgICBrZXlWYWx1ZXMgPSBuZXcgQXJyYXkobm9kZUxlbmd0aCksXG4gICAgICAgICAgICBrZXlWYWx1ZTtcblxuICAgICAgICAvLyBDbGVhciB0aGUgZW50ZXIgYW5kIGV4aXQgYXJyYXlzLCBhbmQgdGhlbiBpbml0aWFsaXplIHRvIHRoZSBuZXcgbGVuZ3RoLlxuICAgICAgICBlbnRlci5sZW5ndGggPSAwLCBlbnRlci5sZW5ndGggPSBkYXRhTGVuZ3RoO1xuICAgICAgICBleGl0Lmxlbmd0aCA9IDAsIGV4aXQubGVuZ3RoID0gbm9kZUxlbmd0aDtcblxuICAgICAgICAvLyBDb21wdXRlIHRoZSBrZXlzIGZvciBlYWNoIG5vZGUuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBub2RlTGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICBpZiAobm9kZSA9IHVwZGF0ZVtpXSkge1xuICAgICAgICAgICAga2V5U3RhY2tbMF0gPSBub2RlLl9fZGF0YV9fLCBrZXlTdGFja1sxXSA9IGk7XG4gICAgICAgICAgICBrZXlWYWx1ZXNbaV0gPSBrZXlWYWx1ZSA9IGtleS5hcHBseShub2RlLCBrZXlTdGFjayk7XG5cbiAgICAgICAgICAgIC8vIElzIHRoaXMgYSBkdXBsaWNhdGUgb2YgYSBrZXkgd2XigJl2ZSBwcmV2aW91c2x5IHNlZW4/XG4gICAgICAgICAgICAvLyBJZiBzbywgdGhpcyBub2RlIGlzIG1vdmVkIHRvIHRoZSBleGl0IHNlbGVjdGlvbi5cbiAgICAgICAgICAgIGlmIChub2RlQnlLZXlWYWx1ZS5oYXMoa2V5VmFsdWUpKSB7XG4gICAgICAgICAgICAgIGV4aXRbaV0gPSBub2RlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIHJlY29yZCB0aGUgbWFwcGluZyBmcm9tIGtleSB0byBub2RlLlxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIG5vZGVCeUtleVZhbHVlLnNldChrZXlWYWx1ZSwgbm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm93IGNsZWFyIHRoZSB1cGRhdGUgYXJyYXkgYW5kIGluaXRpYWxpemUgdG8gdGhlIG5ldyBsZW5ndGguXG4gICAgICAgIHVwZGF0ZS5sZW5ndGggPSAwLCB1cGRhdGUubGVuZ3RoID0gZGF0YUxlbmd0aDtcblxuICAgICAgICAvLyBDb21wdXRlIHRoZSBrZXlzIGZvciBlYWNoIGRhdHVtLlxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YUxlbmd0aDsgKytpKSB7XG4gICAgICAgICAga2V5U3RhY2tbMF0gPSBkYXRhW2ldLCBrZXlTdGFja1sxXSA9IGk7XG4gICAgICAgICAga2V5VmFsdWUgPSBrZXkuYXBwbHkodXBkYXRlLl9wYXJlbnQsIGtleVN0YWNrKTtcblxuICAgICAgICAgIC8vIElzIHRoZXJlIGEgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpcyBrZXk/XG4gICAgICAgICAgLy8gSWYgbm90LCB0aGlzIGRhdHVtIGlzIGFkZGVkIHRvIHRoZSBlbnRlciBzZWxlY3Rpb24uXG4gICAgICAgICAgaWYgKCEobm9kZSA9IG5vZGVCeUtleVZhbHVlLmdldChrZXlWYWx1ZSkpKSB7XG4gICAgICAgICAgICBlbnRlcltpXSA9IG5ldyBFbnRlck5vZGUodXBkYXRlLl9wYXJlbnQsIGRhdGFbaV0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIERpZCB3ZSBhbHJlYWR5IGJpbmQgYSBub2RlIHVzaW5nIHRoaXMga2V5PyAoT3IgaXMgYSBkdXBsaWNhdGU/KVxuICAgICAgICAgIC8vIElmIHVuaXF1ZSwgdGhlIG5vZGUgYW5kIGRhdHVtIGFyZSBqb2luZWQgaW4gdGhlIHVwZGF0ZSBzZWxlY3Rpb24uXG4gICAgICAgICAgLy8gT3RoZXJ3aXNlLCB0aGUgZGF0dW0gaXMgaWdub3JlZCwgbmVpdGhlciBlbnRlcmluZyBub3IgZXhpdGluZy5cbiAgICAgICAgICBlbHNlIGlmIChub2RlICE9PSB0cnVlKSB7XG4gICAgICAgICAgICB1cGRhdGVbaV0gPSBub2RlO1xuICAgICAgICAgICAgbm9kZS5fX2RhdGFfXyA9IGRhdGFbaV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gUmVjb3JkIHRoYXQgd2UgY29uc3VtZWQgdGhpcyBrZXksIGVpdGhlciB0byBlbnRlciBvciB1cGRhdGUuXG4gICAgICAgICAgbm9kZUJ5S2V5VmFsdWUuc2V0KGtleVZhbHVlLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRha2UgYW55IHJlbWFpbmluZyBub2RlcyB0aGF0IHdlcmUgbm90IGJvdW5kIHRvIGRhdGEsXG4gICAgICAgIC8vIGFuZCBwbGFjZSB0aGVtIGluIHRoZSBleGl0IHNlbGVjdGlvbi5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG5vZGVMZW5ndGg7ICsraSkge1xuICAgICAgICAgIGlmICgobm9kZSA9IG5vZGVCeUtleVZhbHVlLmdldChrZXlWYWx1ZXNbaV0pKSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgZXhpdFtpXSA9IG5vZGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHZhciBmaWx0ZXJPZiA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hdGNoZXMoc2VsZWN0b3IpO1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICBpZiAoIWVsZW1lbnQubWF0Y2hlcykge1xuICAgICAgICB2YXIgdmVuZG9yTWF0Y2hlcyA9IGVsZW1lbnQud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IGVsZW1lbnQubXNNYXRjaGVzU2VsZWN0b3IgfHwgZWxlbWVudC5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgZWxlbWVudC5vTWF0Y2hlc1NlbGVjdG9yO1xuICAgICAgICBmaWx0ZXJPZiA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7IHJldHVybiBmdW5jdGlvbigpIHsgcmV0dXJuIHZlbmRvck1hdGNoZXMuY2FsbCh0aGlzLCBzZWxlY3Rvcik7IH07IH07XG4gICAgICB9XG4gICAgfS8vIFRoZSBmaWx0ZXIgbWF5IGVpdGhlciBiZSBhIHNlbGVjdG9yIHN0cmluZyAoZS5nLiwgXCIuZm9vXCIpXG4gICAgLy8gb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBib29sZWFuLlxuXG4gICAgdmFyIHNlbGVjdGlvbl9maWx0ZXIgPSBmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICAgIHZhciBkZXB0aCA9IHRoaXMuX2RlcHRoLFxuICAgICAgICAgIHN0YWNrID0gbmV3IEFycmF5KGRlcHRoICogMik7XG5cbiAgICAgIGlmICh0eXBlb2YgZmlsdGVyICE9PSBcImZ1bmN0aW9uXCIpIGZpbHRlciA9IGZpbHRlck9mKGZpbHRlcik7XG5cbiAgICAgIGZ1bmN0aW9uIHZpc2l0KG5vZGVzLCBkZXB0aCkge1xuICAgICAgICB2YXIgaSA9IC0xLFxuICAgICAgICAgICAgbiA9IG5vZGVzLmxlbmd0aCxcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBzdWJub2RlcztcblxuICAgICAgICBpZiAoLS1kZXB0aCkge1xuICAgICAgICAgIHZhciBzdGFjazAgPSBkZXB0aCAqIDIsXG4gICAgICAgICAgICAgIHN0YWNrMSA9IHN0YWNrMCArIDE7XG4gICAgICAgICAgc3Vibm9kZXMgPSBuZXcgQXJyYXkobik7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICAgIGlmIChub2RlID0gbm9kZXNbaV0pIHtcbiAgICAgICAgICAgICAgc3RhY2tbc3RhY2swXSA9IG5vZGUuX3BhcmVudC5fX2RhdGFfXywgc3RhY2tbc3RhY2sxXSA9IGk7XG4gICAgICAgICAgICAgIHN1Ym5vZGVzW2ldID0gdmlzaXQobm9kZSwgZGVwdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSBmaWx0ZXIgb3BlcmF0aW9uIGRvZXMgbm90IHByZXNlcnZlIHRoZSBvcmlnaW5hbCBpbmRleCxcbiAgICAgICAgLy8gc28gdGhlIHJlc3VsdGluZyBsZWFmIGdyb3VwcyBhcmUgZGVuc2UgKG5vdCBzcGFyc2UpLlxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBzdWJub2RlcyA9IFtdO1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgICBpZiAobm9kZSA9IG5vZGVzW2ldKSB7XG4gICAgICAgICAgICAgIHN0YWNrWzBdID0gbm9kZS5fX2RhdGFfXywgc3RhY2tbMV0gPSBpO1xuICAgICAgICAgICAgICBpZiAoZmlsdGVyLmFwcGx5KG5vZGUsIHN0YWNrKSkge1xuICAgICAgICAgICAgICAgIHN1Ym5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdWJub2Rlcy5fcGFyZW50ID0gbm9kZXMuX3BhcmVudDtcbiAgICAgICAgcmV0dXJuIHN1Ym5vZGVzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFNlbGVjdGlvbih2aXNpdCh0aGlzLl9yb290LCBkZXB0aCksIGRlcHRoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZWxlY3RvckFsbE9mKHNlbGVjdG9yKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICAgICAgfTtcbiAgICB9Ly8gVGhlIHNlbGVjdG9yIG1heSBlaXRoZXIgYmUgYSBzZWxlY3RvciBzdHJpbmcgKGUuZy4sIFwiLmZvb1wiKVxuICAgIC8vIG9yIGEgZnVuY3Rpb24gdGhhdCBvcHRpb25hbGx5IHJldHVybnMgYW4gYXJyYXkgb2Ygbm9kZXMgdG8gc2VsZWN0LlxuICAgIC8vIFRoaXMgaXMgdGhlIG9ubHkgb3BlcmF0aW9uIHRoYXQgaW5jcmVhc2VzIHRoZSBkZXB0aCBvZiBhIHNlbGVjdGlvbi5cblxuICAgIHZhciBzZWxlY3Rpb25fc2VsZWN0QWxsID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICAgIHZhciBkZXB0aCA9IHRoaXMuX2RlcHRoLFxuICAgICAgICAgIHN0YWNrID0gbmV3IEFycmF5KGRlcHRoICogMik7XG5cbiAgICAgIGlmICh0eXBlb2Ygc2VsZWN0b3IgIT09IFwiZnVuY3Rpb25cIikgc2VsZWN0b3IgPSBzZWxlY3RvckFsbE9mKHNlbGVjdG9yKTtcblxuICAgICAgZnVuY3Rpb24gdmlzaXQobm9kZXMsIGRlcHRoKSB7XG4gICAgICAgIHZhciBpID0gLTEsXG4gICAgICAgICAgICBuID0gbm9kZXMubGVuZ3RoLFxuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIHN1Ym5vZGUsXG4gICAgICAgICAgICBzdWJub2RlcyA9IG5ldyBBcnJheShuKTtcblxuICAgICAgICBpZiAoLS1kZXB0aCkge1xuICAgICAgICAgIHZhciBzdGFjazAgPSBkZXB0aCAqIDIsXG4gICAgICAgICAgICAgIHN0YWNrMSA9IHN0YWNrMCArIDE7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICAgIGlmIChub2RlID0gbm9kZXNbaV0pIHtcbiAgICAgICAgICAgICAgc3RhY2tbc3RhY2swXSA9IG5vZGUuX3BhcmVudC5fX2RhdGFfXywgc3RhY2tbc3RhY2sxXSA9IGk7XG4gICAgICAgICAgICAgIHN1Ym5vZGVzW2ldID0gdmlzaXQobm9kZSwgZGVwdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERhdGEgaXMgbm90IHByb3BhZ2F0ZWQgc2luY2UgdGhlcmUgaXMgYSBvbmUtdG8tbWFueSBtYXBwaW5nLlxuICAgICAgICAvLyBUaGUgcGFyZW50IG9mIHRoZSBuZXcgbGVhZiBncm91cCBpcyB0aGUgb2xkIG5vZGUuXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgICBpZiAobm9kZSA9IG5vZGVzW2ldKSB7XG4gICAgICAgICAgICAgIHN0YWNrWzBdID0gbm9kZS5fX2RhdGFfXywgc3RhY2tbMV0gPSBpO1xuICAgICAgICAgICAgICBzdWJub2Rlc1tpXSA9IHN1Ym5vZGUgPSBzZWxlY3Rvci5hcHBseShub2RlLCBzdGFjayk7XG4gICAgICAgICAgICAgIHN1Ym5vZGUuX3BhcmVudCA9IG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3Vibm9kZXMuX3BhcmVudCA9IG5vZGVzLl9wYXJlbnQ7XG4gICAgICAgIHJldHVybiBzdWJub2RlcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBTZWxlY3Rpb24odmlzaXQodGhpcy5fcm9vdCwgZGVwdGgpLCBkZXB0aCArIDEpO1xuICAgIH0vLyBUaGUgc2VsZWN0b3IgbWF5IGVpdGhlciBiZSBhIHNlbGVjdG9yIHN0cmluZyAoZS5nLiwgXCIuZm9vXCIpXG4gICAgLy8gb3IgYSBmdW5jdGlvbiB0aGF0IG9wdGlvbmFsbHkgcmV0dXJucyB0aGUgbm9kZSB0byBzZWxlY3QuXG5cbiAgICB2YXIgc2VsZWN0aW9uX3NlbGVjdCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgICB2YXIgZGVwdGggPSB0aGlzLl9kZXB0aCxcbiAgICAgICAgICBzdGFjayA9IG5ldyBBcnJheShkZXB0aCAqIDIpO1xuXG4gICAgICBpZiAodHlwZW9mIHNlbGVjdG9yICE9PSBcImZ1bmN0aW9uXCIpIHNlbGVjdG9yID0gc2VsZWN0b3JPZihzZWxlY3Rvcik7XG5cbiAgICAgIGZ1bmN0aW9uIHZpc2l0KG5vZGVzLCB1cGRhdGUsIGRlcHRoKSB7XG4gICAgICAgIHZhciBpID0gLTEsXG4gICAgICAgICAgICBuID0gbm9kZXMubGVuZ3RoLFxuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIHN1Ym5vZGUsXG4gICAgICAgICAgICBzdWJub2RlcyA9IG5ldyBBcnJheShuKTtcblxuICAgICAgICBpZiAoLS1kZXB0aCkge1xuICAgICAgICAgIHZhciBzdGFjazAgPSBkZXB0aCAqIDIsXG4gICAgICAgICAgICAgIHN0YWNrMSA9IHN0YWNrMCArIDE7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICAgIGlmIChub2RlID0gbm9kZXNbaV0pIHtcbiAgICAgICAgICAgICAgc3RhY2tbc3RhY2swXSA9IG5vZGUuX3BhcmVudC5fX2RhdGFfXywgc3RhY2tbc3RhY2sxXSA9IGk7XG4gICAgICAgICAgICAgIHN1Ym5vZGVzW2ldID0gdmlzaXQobm9kZSwgdXBkYXRlICYmIHVwZGF0ZVtpXSwgZGVwdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSBsZWFmIGdyb3VwIG1heSBiZSBzcGFyc2UgaWYgdGhlIHNlbGVjdG9yIHJldHVybnMgYSBmYWxzZXkgdmFsdWU7XG4gICAgICAgIC8vIHRoaXMgcHJlc2VydmVzIHRoZSBpbmRleCBvZiBub2RlcyAodW5saWtlIHNlbGVjdGlvbi5maWx0ZXIpLlxuICAgICAgICAvLyBQcm9wYWdhdGUgZGF0YSB0byB0aGUgbmV3IG5vZGUgb25seSBpZiBpdCBpcyBkZWZpbmVkIG9uIHRoZSBvbGQuXG4gICAgICAgIC8vIElmIHRoaXMgaXMgYW4gZW50ZXIgc2VsZWN0aW9uLCBtYXRlcmlhbGl6ZWQgbm9kZXMgYXJlIG1vdmVkIHRvIHVwZGF0ZS5cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICAgIGlmIChub2RlID0gbm9kZXNbaV0pIHtcbiAgICAgICAgICAgICAgc3RhY2tbMF0gPSBub2RlLl9fZGF0YV9fLCBzdGFja1sxXSA9IGk7XG4gICAgICAgICAgICAgIGlmIChzdWJub2RlID0gc2VsZWN0b3IuYXBwbHkobm9kZSwgc3RhY2spKSB7XG4gICAgICAgICAgICAgICAgaWYgKFwiX19kYXRhX19cIiBpbiBub2RlKSBzdWJub2RlLl9fZGF0YV9fID0gbm9kZS5fX2RhdGFfXztcbiAgICAgICAgICAgICAgICBpZiAodXBkYXRlKSB1cGRhdGVbaV0gPSBzdWJub2RlLCBkZWxldGUgbm9kZXNbaV07XG4gICAgICAgICAgICAgICAgc3Vibm9kZXNbaV0gPSBzdWJub2RlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3Vibm9kZXMuX3BhcmVudCA9IG5vZGVzLl9wYXJlbnQ7XG4gICAgICAgIHJldHVybiBzdWJub2RlcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBTZWxlY3Rpb24odmlzaXQodGhpcy5fcm9vdCwgdGhpcy5fdXBkYXRlICYmIHRoaXMuX3VwZGF0ZS5fcm9vdCwgZGVwdGgpLCBkZXB0aCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2VsZWN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudF0sIDEpO1xuICAgIH1cblxuICAgIFNlbGVjdGlvbi5wcm90b3R5cGUgPSBzZWxlY3Rpb24ucHJvdG90eXBlID0ge1xuICAgICAgc2VsZWN0OiBzZWxlY3Rpb25fc2VsZWN0LFxuICAgICAgc2VsZWN0QWxsOiBzZWxlY3Rpb25fc2VsZWN0QWxsLFxuICAgICAgZmlsdGVyOiBzZWxlY3Rpb25fZmlsdGVyLFxuICAgICAgZGF0YTogc2VsZWN0aW9uX2RhdGEsXG4gICAgICBlbnRlcjogc2VsZWN0aW9uX2VudGVyLFxuICAgICAgZXhpdDogc2VsZWN0aW9uX2V4aXQsXG4gICAgICBvcmRlcjogc2VsZWN0aW9uX29yZGVyLFxuICAgICAgc29ydDogc2VsZWN0aW9uX3NvcnQsXG4gICAgICBjYWxsOiBzZWxlY3Rpb25fY2FsbCxcbiAgICAgIG5vZGVzOiBzZWxlY3Rpb25fbm9kZXMsXG4gICAgICBub2RlOiBzZWxlY3Rpb25fbm9kZSxcbiAgICAgIHNpemU6IHNlbGVjdGlvbl9zaXplLFxuICAgICAgZW1wdHk6IHNlbGVjdGlvbl9lbXB0eSxcbiAgICAgIGVhY2g6IHNlbGVjdGlvbl9lYWNoLFxuICAgICAgYXR0cjogc2VsZWN0aW9uX2F0dHIsXG4gICAgICBzdHlsZTogc2VsZWN0aW9uX3N0eWxlLFxuICAgICAgcHJvcGVydHk6IHNlbGVjdGlvbl9wcm9wZXJ0eSxcbiAgICAgIGNsYXNzOiBzZWxlY3Rpb25fY2xhc3MsXG4gICAgICBjbGFzc2VkOiBzZWxlY3Rpb25fY2xhc3MsIC8vIGRlcHJlY2F0ZWQgYWxpYXNcbiAgICAgIHRleHQ6IHNlbGVjdGlvbl90ZXh0LFxuICAgICAgaHRtbDogc2VsZWN0aW9uX2h0bWwsXG4gICAgICBhcHBlbmQ6IHNlbGVjdGlvbl9hcHBlbmQsXG4gICAgICBpbnNlcnQ6IHNlbGVjdGlvbl9hcHBlbmQsIC8vIGRlcHJlY2F0ZWQgYWxpYXNcbiAgICAgIHJlbW92ZTogc2VsZWN0aW9uX3JlbW92ZSxcbiAgICAgIGRhdHVtOiBzZWxlY3Rpb25fZGF0dW0sXG4gICAgICBldmVudDogc2VsZWN0aW9uX2V2ZW50LFxuICAgICAgb246IHNlbGVjdGlvbl9ldmVudCwgLy8gZGVwcmVjYXRlZCBhbGlhc1xuICAgICAgZGlzcGF0Y2g6IHNlbGVjdGlvbl9kaXNwYXRjaFxuICAgIH07XG5cbiAgICB2YXIgc2VsZWN0ID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICAgIHJldHVybiBuZXcgU2VsZWN0aW9uKFt0eXBlb2Ygc2VsZWN0b3IgPT09IFwic3RyaW5nXCIgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSA6IHNlbGVjdG9yXSwgMSk7XG4gICAgfVxuXG4gICAgdmFyIHBvaW50ID0gZnVuY3Rpb24obm9kZSwgZXZlbnQpIHtcbiAgICAgIHZhciBzdmcgPSBub2RlLm93bmVyU1ZHRWxlbWVudCB8fCBub2RlO1xuICAgICAgaWYgKHN2Zy5jcmVhdGVTVkdQb2ludCkge1xuICAgICAgICB2YXIgcG9pbnQgPSBzdmcuY3JlYXRlU1ZHUG9pbnQoKTtcbiAgICAgICAgaWYgKGJ1ZzQ0MDgzIDwgMCkge1xuICAgICAgICAgIHZhciB3aW5kb3cgPSBkZWZhdWx0Vmlldyhub2RlKTtcbiAgICAgICAgICBpZiAod2luZG93LnNjcm9sbFggfHwgd2luZG93LnNjcm9sbFkpIHtcbiAgICAgICAgICAgIHN2ZyA9IHNlbGVjdCh3aW5kb3cuZG9jdW1lbnQuYm9keSkuYXBwZW5kKFwic3ZnXCIpLnN0eWxlKHtwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCB0b3A6IDAsIGxlZnQ6IDAsIG1hcmdpbjogMCwgcGFkZGluZzogMCwgYm9yZGVyOiBcIm5vbmVcIn0sIFwiaW1wb3J0YW50XCIpO1xuICAgICAgICAgICAgdmFyIGN0bSA9IHN2Zy5ub2RlKCkuZ2V0U2NyZWVuQ1RNKCk7XG4gICAgICAgICAgICBidWc0NDA4MyA9ICEoY3RtLmYgfHwgY3RtLmUpO1xuICAgICAgICAgICAgc3ZnLnJlbW92ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYnVnNDQwODMpIHBvaW50LnggPSBldmVudC5wYWdlWCwgcG9pbnQueSA9IGV2ZW50LnBhZ2VZO1xuICAgICAgICBlbHNlIHBvaW50LnggPSBldmVudC5jbGllbnRYLCBwb2ludC55ID0gZXZlbnQuY2xpZW50WTtcbiAgICAgICAgcG9pbnQgPSBwb2ludC5tYXRyaXhUcmFuc2Zvcm0obm9kZS5nZXRTY3JlZW5DVE0oKS5pbnZlcnNlKCkpO1xuICAgICAgICByZXR1cm4gW3BvaW50LngsIHBvaW50LnldO1xuICAgICAgfVxuICAgICAgdmFyIHJlY3QgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgcmV0dXJuIFtldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0IC0gbm9kZS5jbGllbnRMZWZ0LCBldmVudC5jbGllbnRZIC0gcmVjdC50b3AgLSBub2RlLmNsaWVudFRvcF07XG4gICAgfVxuXG4gICAgdmFyIHNvdXJjZUV2ZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY3VycmVudCA9IGV2ZW50LCBzb3VyY2U7XG4gICAgICB3aGlsZSAoc291cmNlID0gY3VycmVudC5zb3VyY2VFdmVudCkgY3VycmVudCA9IHNvdXJjZTtcbiAgICAgIHJldHVybiBjdXJyZW50O1xuICAgIH1cblxuICAgIHZhciB0b3VjaGVzID0gZnVuY3Rpb24obm9kZSwgdG91Y2hlcykge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB0b3VjaGVzID0gc291cmNlRXZlbnQoKS50b3VjaGVzO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSB0b3VjaGVzID8gdG91Y2hlcy5sZW5ndGggOiAwLCBwb2ludHMgPSBuZXcgQXJyYXkobik7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgcG9pbnRzW2ldID0gcG9pbnQobm9kZSwgdG91Y2hlc1tpXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcG9pbnRzO1xuICAgIH1cblxuICAgIHZhciB0b3VjaCA9IGZ1bmN0aW9uKG5vZGUsIHRvdWNoZXMsIGlkZW50aWZpZXIpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykgaWRlbnRpZmllciA9IHRvdWNoZXMsIHRvdWNoZXMgPSBzb3VyY2VFdmVudCgpLmNoYW5nZWRUb3VjaGVzO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSB0b3VjaGVzID8gdG91Y2hlcy5sZW5ndGggOiAwLCB0b3VjaDsgaSA8IG47ICsraSkge1xuICAgICAgICBpZiAoKHRvdWNoID0gdG91Y2hlc1tpXSkuaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgICAgIHJldHVybiBwb2ludChub2RlLCB0b3VjaCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciBzZWxlY3RBbGwgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICAgICAgcmV0dXJuIG5ldyBTZWxlY3Rpb24odHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikgOiBzZWxlY3RvciwgMSk7XG4gICAgfVxuXG4gICAgdmFyIG1vdXNlID0gZnVuY3Rpb24obm9kZSwgZXZlbnQpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgZXZlbnQgPSBzb3VyY2VFdmVudCgpO1xuICAgICAgaWYgKGV2ZW50LmNoYW5nZWRUb3VjaGVzKSBldmVudCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuICAgICAgcmV0dXJuIHBvaW50KG5vZGUsIGV2ZW50KTtcbiAgICB9XG5cbiAgICB2YXIgZDMgPSB7XG4gICAgICBnZXQgZXZlbnQoKSB7IHJldHVybiBldmVudDsgfSxcbiAgICAgIG1vdXNlOiBtb3VzZSxcbiAgICAgIG5hbWVzcGFjZTogbmFtZXNwYWNlLFxuICAgICAgbmFtZXNwYWNlczogbmFtZXNwYWNlcyxcbiAgICAgIHJlcXVvdGU6IHJlcXVvdGUsXG4gICAgICBzZWxlY3Q6IHNlbGVjdCxcbiAgICAgIHNlbGVjdEFsbDogc2VsZWN0QWxsLFxuICAgICAgc2VsZWN0aW9uOiBzZWxlY3Rpb24sXG4gICAgICB0b3VjaDogdG91Y2gsXG4gICAgICB0b3VjaGVzOiB0b3VjaGVzXG4gICAgfTtcblxuICAgIHJldHVybiBkMztcblxufSkpOyJdfQ==
