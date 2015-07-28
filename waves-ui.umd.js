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
    BaseState           : require('./dist/states/base-state'),
    BrushZoomState      : require('./dist/states/brush-zoom-state'),
    CenteredZoomState   : require('./dist/states/centered-zoom-state'),
    ContextEditionState : require('./dist/states/context-edition-state'),
    EditionState        : require('./dist/states/edition-state'),
    SelectionState      : require('./dist/states/selection-state'),
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

},{"./dist/behaviors/base-behavior":2,"./dist/behaviors/breakpoint-behavior":3,"./dist/behaviors/marker-behavior":4,"./dist/behaviors/segment-behavior":5,"./dist/behaviors/time-context-behavior":6,"./dist/behaviors/trace-behavior":7,"./dist/core/layer":9,"./dist/core/layer-time-context":8,"./dist/core/namespace":10,"./dist/core/timeline":12,"./dist/core/timeline-time-context":11,"./dist/core/track":14,"./dist/core/track-collection":13,"./dist/helpers/annotated-marker-layer":15,"./dist/helpers/cursor-layer":16,"./dist/helpers/dot-layer":17,"./dist/helpers/marker-layer":18,"./dist/helpers/segment-layer":19,"./dist/helpers/waveform-layer":20,"./dist/interactions/event-source":21,"./dist/interactions/keyboard":22,"./dist/interactions/surface":23,"./dist/interactions/wave-event":24,"./dist/shapes/annotated-marker":25,"./dist/shapes/annotated-segment":26,"./dist/shapes/base-shape":27,"./dist/shapes/cursor":28,"./dist/shapes/dot":29,"./dist/shapes/line":30,"./dist/shapes/marker":31,"./dist/shapes/segment":32,"./dist/shapes/trace-common":33,"./dist/shapes/trace-dots":34,"./dist/shapes/waveform":35,"./dist/states/base-state":36,"./dist/states/brush-zoom-state":37,"./dist/states/centered-zoom-state":38,"./dist/states/context-edition-state":39,"./dist/states/edition-state":40,"./dist/states/selection-state":41,"./dist/utils/orthogonal-data":42}],2:[function(require,module,exports){
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
        if (target.classList.contains("min")) {
          this._editRange(renderingContext, shape, datum, dx, dy, "min");
        } else if (target.classList.contains("max")) {
          this._editRange(renderingContext, shape, datum, dx, dy, "max");
        } else {
          this._editMean(renderingContext, shape, datum, dx, dy);
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
      contextHandlerWidth: 2,
      className: ""
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
        this.$el.classList.add("layer", this.params.className);
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
        if (Array.isArray($items[0])) {
          $items = $items[0];
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
        if (Array.isArray($items[0])) {
          $items = $items[0];
        }

        $items.forEach(function ($el) {
          var item = _this._$itemD3SelectionMap.get($el);
          _this._behavior.unselect($el, item.datum());
        });
      }
    },
    toggleSelection: {
      value: function toggleSelection() {
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
        if (Array.isArray($items[0])) {
          $items = $items[0];
        }

        $items.forEach(function ($el) {
          var item = _this._$itemD3SelectionMap.get($el);
          _this._behavior.toggleSelection($el, item.datum());
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

        return items.nodes().slice(0);
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
    key: "getTrackFromDOMElement",

    /**
     *  Returns the track containing a given DOM Element, if no match found return null
     *  @param {DOMElement} $el
     *  @return {Track|null}
     */
    value: function getTrackFromDOMElement($el) {
      var $svg = null;
      var track = null;
      // find the closest `.track` element
      do {
        if ($el.classList.contains("track")) {
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
      $svg.classList.add("track");

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
    var accessors = arguments[2] === undefined ? {} : arguments[2];

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
        this.dx = null;
        this.dy = null;
        this.area = null; // @TODO rename

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
    _defineArea: {
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
          _this._defineArea(event, _this.mouseDownEvent, _this.lastEvent);
          // Update `lastEvent` for next call
          _this.lastEvent = event;

          _this.emit("event", event);
        };

        var onMouseUp = function (e) {
          var event = _this._createEvent("mouseup", e);
          _this._defineArea(event, _this.mouseDownEvent, _this.lastEvent);

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

var WaveEvent = function WaveEvent(type, originalEvent) {
  _classCallCheck(this, WaveEvent);

  this.type = type;
  this.originalEvent = originalEvent;

  this.target = originalEvent.target;
  this.currentTarget = originalEvent.currentTarget;
};

module.exports = WaveEvent;

},{"babel-runtime/helpers/class-call-check":44}],25:[function(require,module,exports){
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

        if (this.params.displayHandler) {
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

        if (this.params.displayHandler) {
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
        var meanPos = "" + renderingContext.valueToPixel(mean);
        this.$mean.setAttributeNS(null, "transform", "translate(0, " + meanPos + ")");

        var halfRange = range / 2;
        var max = renderingContext.valueToPixel(mean + halfRange);
        var min = renderingContext.valueToPixel(mean - halfRange);
        var xPos = renderingContext.timeToPixel(x);

        this.$max.setAttributeNS(null, "transform", "translate(0, " + max + ")");
        this.$min.setAttributeNS(null, "transform", "translate(0, " + min + ")");
        this.$el.setAttributeNS(null, "transform", "translate(" + xPos + ", 0)");
      }
    },
    inArea: {
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

        this.valueToPixel = d3Scale.linear().domain([initialY, 0]).range([actualZoom, -1 * actualZoom]);
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

/**
 *  Does not handle selection, must be used in conjonction with a selectionState of some sort
 *  could maybe be merged with the SelectionState
 */

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
        this.currentTarget = e.target;
      }
    },
    onMouseMove: {
      value: function onMouseMove(e) {
        var _this = this;

        this.layers.forEach(function (layer) {
          var items = layer.selectedItems;

          layer.edit(items, e.dx, e.dy, _this.currentTarget);
          layer.update(items);
        });
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

var SelectionState = (function (_BaseState) {
  function SelectionState(timeline /*, options = {} */) {
    _classCallCheck(this, SelectionState);

    _get(_core.Object.getPrototypeOf(SelectionState.prototype), "constructor", this).call(this, timeline /*, options */);

    this.currentLayer = null;
    // need a cached
    this.selectedItems = null;
    this.mouseDown = false;
    this.shiftKey = false;

    this._layerSelectedItemsMap = new _core.Map();
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
      value: function _addBrush(track) {
        if (track.$brush) {
          return;
        }

        var brush = document.createElementNS(ns, "rect");
        brush.style.fill = "#686868";
        brush.style.opacity = 0.2;

        track.$interactions.appendChild(brush);
        track.$brush = brush;
      }
    },
    _removeBrush: {
      value: function _removeBrush(track) {
        if (track.$brush === null) {
          return;
        }

        this._resetBrush(track);
        track.$interactions.removeChild(track.$brush);
        delete track.$brush;
      }
    },
    _resetBrush: {
      value: function _resetBrush(track) {
        var $brush = track.$brush;
        // reset brush element
        $brush.setAttributeNS(null, "transform", "translate(0, 0)");
        $brush.setAttributeNS(null, "width", 0);
        $brush.setAttributeNS(null, "height", 0);
      }
    },
    _updateBrush: {
      value: function _updateBrush(e, track) {
        var $brush = track.$brush;
        var translate = "translate(" + e.area.left + ", " + e.area.top + ")";

        $brush.setAttributeNS(null, "transform", translate);
        $brush.setAttributeNS(null, "width", e.area.width);
        $brush.setAttributeNS(null, "height", e.area.height);
      }
    },
    onKey: {
      value: function onKey(e) {
        this.shiftKey = e.shiftKey;
      }
    },
    onMouseDown: {
      value: function onMouseDown(e) {
        var _this = this;

        this._currentTrack = this.timeline.getTrackFromDOMElement(e.target);
        if (!this._currentTrack) {
          return;
        }

        this._addBrush(this._currentTrack);

        // recreate the map
        this._layerSelectedItemsMap = new _core.Map();
        this._currentTrack.layers.forEach(function (layer) {
          _this._layerSelectedItemsMap.set(layer, layer.selectedItems.slice(0));
        });
      }
    },
    onMouseMove: {
      value: function onMouseMove(e) {
        var _this = this;

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
              var previousSelection = _this._layerSelectedItemsMap.get(layer);
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
    },
    onMouseUp: {
      value: function onMouseUp(e) {
        this._removeBrush(this._currentTrack);
      }
    },
    onClick: {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3YXZlcy11aS5qcyIsImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzcy1jYWxsLWNoZWNrLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGUtY2xhc3MuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZS1jb21wdXRlZC1jbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvZ2V0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvaW50ZXJvcC1yZXF1aXJlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy90by1jb25zdW1hYmxlLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvcmVnZW5lcmF0b3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9yZWdlbmVyYXRvci9ydW50aW1lLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvZDMtc2NhbGUvYnVpbGQvc2NhbGUuanMiLCJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL2J1aWxkL2QzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0lDMURxQixZQUFZO0FBQ3BCLFdBRFEsWUFBWSxHQUNMO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFETCxZQUFZOztBQUU3QixRQUFJLENBQUMsY0FBYyxHQUFHLFVBQUksR0FBRyxFQUFFLENBQUM7QUFDaEMsUUFBSSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsYUFBYSxJQUFJLFVBQVUsQ0FBQztBQUMxRCxRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQzs7QUFFbkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztHQUMvRDs7ZUFQa0IsWUFBWTtBQVMvQixjQUFVO2FBQUEsb0JBQUMsS0FBSyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO09BQ3JCOztBQUVELFdBQU87YUFBQSxtQkFBRyxFQUVUOztBQUVELGVBQVc7YUFBQSx1QkFBRztBQUNaLGVBQU8sRUFBRSxDQUFDO09BQ1g7O0FBTUcsaUJBQWE7V0FKQSxVQUFDLEtBQUssRUFBRTtBQUN2QixZQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztPQUM3QjtXQUVnQixZQUFHO0FBQ2xCLGVBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztPQUM1Qjs7QUFFRyxpQkFBYTtXQUFBLFlBQUc7QUFDbEIsNENBQVcsSUFBSSxDQUFDLGNBQWMsR0FBRTtPQUNqQzs7QUFNRCxVQUFNOzs7Ozs7O2FBQUEsZ0JBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUNuQixhQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDeEMsWUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDaEM7O0FBTUQsWUFBUTs7Ozs7OzthQUFBLGtCQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDckIsYUFBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzNDLFlBQUksQ0FBQyxjQUFjLFVBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUNuQzs7QUFPRCxtQkFBZTs7Ozs7Ozs7YUFBQSx5QkFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQzVCLFlBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLFVBQVUsR0FBRyxRQUFRLENBQUM7QUFDdEUsWUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ3JCOztBQUtELFFBQUk7Ozs7OzthQUFBLGNBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUVwRDs7OztTQWxFa0IsWUFBWTs7O2lCQUFaLFlBQVk7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQTFCLFlBQVksMkJBQU0saUJBQWlCOztJQUdyQixrQkFBa0I7V0FBbEIsa0JBQWtCOzBCQUFsQixrQkFBa0I7Ozs7Ozs7WUFBbEIsa0JBQWtCOztlQUFsQixrQkFBa0I7QUFFckMsUUFBSTthQUFBLGNBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtBQUNuRCxZQUFNLElBQUksR0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztBQUMvQixZQUFNLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7O0FBRTVDLFlBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDeEQsWUFBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFekQsWUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNyQixZQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUVyQixZQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOztBQUVuQixjQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQzttQkFBSyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztXQUFBLENBQUMsQ0FBQztBQUN4RSxjQUFJLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7bUJBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDO1dBQUEsQ0FBQyxDQUFDOztBQUVwQyxjQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUU5QixjQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQzFELG1CQUFPLEdBQUcsQ0FBQyxDQUFDO1dBQ2I7U0FDRjs7O0FBR0QsWUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO0FBQ2YsaUJBQU8sR0FBRyxDQUFDLENBQUM7U0FDYixNQUFNLElBQUksT0FBTyxHQUFHLFdBQVcsRUFBRTtBQUNoQyxpQkFBTyxHQUFHLFdBQVcsQ0FBQztTQUN2Qjs7O0FBR0QsYUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQzlELGFBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztPQUNoRTs7OztTQWxDa0Isa0JBQWtCO0dBQVMsWUFBWTs7aUJBQXZDLGtCQUFrQjs7Ozs7Ozs7Ozs7OztJQUhoQyxZQUFZLDJCQUFNLGlCQUFpQjs7SUFHckIsY0FBYztXQUFkLGNBQWM7MEJBQWQsY0FBYzs7Ozs7OztZQUFkLGNBQWM7O2VBQWQsY0FBYztBQUVqQyxRQUFJO2FBQUEsY0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFO0FBQ25ELFlBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdkQsWUFBSSxPQUFPLEdBQUcsQUFBQyxDQUFDLEdBQUcsRUFBRSxHQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFeEMsYUFBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO09BQzlEOzs7O1NBUGtCLGNBQWM7R0FBUyxZQUFZOztpQkFBbkMsY0FBYzs7Ozs7Ozs7Ozs7OztJQUg1QixZQUFZLDJCQUFNLGlCQUFpQjs7SUFHckIsZUFBZTtXQUFmLGVBQWU7MEJBQWYsZUFBZTs7Ozs7OztZQUFmLGVBQWU7O2VBQWYsZUFBZTtBQUNsQyxRQUFJO2FBQUEsY0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFO0FBQ25ELFlBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDbkMsWUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUVwQixZQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUMvRCxnQkFBTSxHQUFHLFlBQVksQ0FBQztTQUN2QixNQUFNLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ3ZFLGdCQUFNLEdBQUcsYUFBYSxDQUFDO1NBQ3hCOztBQUVELFlBQUksT0FBSyxNQUFNLENBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7T0FDcEU7O0FBRUQsU0FBSzthQUFBLGVBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtBQUNwRCxZQUFNLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7O0FBRTVDLFlBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdkQsWUFBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN4RCxZQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUVsRSxZQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsWUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7O0FBR3JCLFlBQUksT0FBTyxHQUFHLENBQUMsRUFBRTtBQUNmLGlCQUFPLEdBQUcsQ0FBQyxDQUFDO1NBQ2IsTUFBTSxJQUFJLE9BQU8sR0FBRyxNQUFNLEdBQUcsV0FBVyxFQUFFO0FBQ3pDLGlCQUFPLEdBQUcsV0FBVyxHQUFHLE1BQU0sQ0FBQztTQUNoQzs7QUFFRCxhQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDN0QsYUFBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO09BQy9EOztBQUVELGVBQVc7YUFBQSxxQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFOztBQUUxRCxZQUFNLENBQUMsR0FBTyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQzNELFlBQU0sS0FBSyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7O0FBRS9ELFlBQUksVUFBVSxHQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDNUIsWUFBSSxPQUFPLEdBQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoRSxZQUFJLFdBQVcsR0FBRyxPQUFPLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7O0FBRWxFLGFBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUM3RCxhQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7T0FDdEU7O0FBRUQsZ0JBQVk7YUFBQSxzQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFOztBQUUzRCxZQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUUvRCxZQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRTFDLGFBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztPQUN0RTs7OztTQXZEa0IsZUFBZTtHQUFTLFlBQVk7O2lCQUFwQyxlQUFlOzs7Ozs7Ozs7SUFIZixtQkFBbUI7V0FBbkIsbUJBQW1COzBCQUFuQixtQkFBbUI7OztlQUFuQixtQkFBbUI7QUFDdEMsUUFBSTthQUFBLGNBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFO0FBQzFCLFlBQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7O0FBRXRDLFlBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDN0UsY0FBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDakMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ3JGLGNBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ2xDLE1BQU0sSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUMvQyxjQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUM3QjtPQUNGOztBQUVELGFBQVM7YUFBQSxtQkFBQyxXQUFXLEVBQUUsRUFBRSxFQUFFOztBQUV6QixZQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUQsWUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0QsWUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRTVELFlBQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdkIsWUFBTSxZQUFZLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNqQyxZQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRTVDLG1CQUFXLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNuRSxtQkFBVyxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNsRSxtQkFBVyxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztPQUNwRTs7QUFFRCxjQUFVO2FBQUEsb0JBQUMsV0FBVyxFQUFFLEVBQUUsRUFBRTtBQUMxQixZQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM1RCxZQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRTVDLG1CQUFXLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO09BQ3BFOztBQUVELFNBQUs7YUFBQSxlQUFDLFdBQVcsRUFBRSxFQUFFLEVBQUU7QUFDckIsWUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVELFlBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFcEMsbUJBQVcsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQ3BFOztBQUVELFdBQU87YUFBQSxpQkFBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7QUFDN0IsWUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztBQUN0QyxZQUFNLFlBQVksR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDO0FBQzFDLFlBQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7O0FBRXRDLFlBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRWpDLFlBQU0sV0FBVyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUM7QUFDekMsWUFBTSxLQUFLLEdBQUksV0FBVyxHQUFHLFlBQVksQUFBQyxDQUFDOztBQUUzQyxtQkFBVyxDQUFDLFlBQVksSUFBSSxLQUFLLENBQUM7QUFDbEMsbUJBQVcsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO0FBQ2hDLG1CQUFXLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQztPQUNyQzs7OztTQXZEa0IsbUJBQW1COzs7aUJBQW5CLG1CQUFtQjs7Ozs7Ozs7Ozs7OztJQUFqQyxZQUFZLDJCQUFNLGlCQUFpQjs7SUFHckIsYUFBYTtXQUFiLGFBQWE7MEJBQWIsYUFBYTs7Ozs7OztZQUFiLGFBQWE7O2VBQWIsYUFBYTtBQUNoQyxRQUFJO2FBQUEsY0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFO0FBQ25ELFlBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDcEMsY0FBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDaEUsTUFBTSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzNDLGNBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2hFLE1BQU07QUFDTCxjQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ3hEO09BQ0Y7O0FBRUQsYUFBUzthQUFBLG1CQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTs7QUFFaEQsWUFBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN2RCxZQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUUzRCxZQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFlBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRXJCLGFBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUM3RCxhQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7T0FDbEU7O0FBRUQsY0FBVTthQUFBLG9CQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUU7QUFDNUQsWUFBTSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFaEUsWUFBSSxXQUFXLEdBQUcsU0FBUyxLQUFLLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN4RSxtQkFBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUV2QyxhQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7T0FDdkU7Ozs7U0E5QmtCLGFBQWE7R0FBUyxZQUFZOztpQkFBbEMsYUFBYTs7Ozs7Ozs7Ozs7SUFIM0IsT0FBTywyQkFBTSxVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEyQlQsZ0JBQWdCO0FBQ3hCLFdBRFEsZ0JBQWdCLENBQ3ZCLE1BQU0sRUFBRTswQkFERCxnQkFBZ0I7O0FBRWpDLFFBQUksQ0FBQyxNQUFNLEVBQUU7QUFBRSxZQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7S0FBRTs7QUFFeEUsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O0FBRXJCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDOztBQUV6QixRQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNoQixRQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUM7QUFDeEMsUUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDakIsUUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7O0FBRXZCLFFBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUNsQzs7ZUFka0IsZ0JBQWdCO0FBZ0JuQyxTQUFLO2FBQUEsaUJBQUc7QUFDTixZQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDOztBQUV2QixXQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDekIsV0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3ZCLFdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUM3QixXQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDekIsV0FBRyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDOztBQUVyQyxlQUFPLEdBQUcsQ0FBQztPQUNaOztBQU1HLFNBQUs7V0FKQSxZQUFHO0FBQ1YsZUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDO09BQ3BCO1dBRVEsVUFBQyxLQUFLLEVBQUU7QUFDZixZQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztPQUNyQjs7QUFNRyxZQUFRO1dBSkEsWUFBRztBQUNiLGVBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztPQUN2QjtXQUVXLFVBQUMsS0FBSyxFQUFFO0FBQ2xCLFlBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO09BQ3hCOztBQU1HLFVBQU07V0FKQSxZQUFHO0FBQ1gsZUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO09BQ3JCO1dBRVMsVUFBQyxLQUFLLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7T0FDdEI7O0FBTUcsZ0JBQVk7V0FKQSxZQUFHO0FBQ2pCLGVBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztPQUMzQjtXQUVlLFVBQUMsS0FBSyxFQUFFOztBQUV0QixZQUFJLEtBQUssS0FBTSxDQUFDLEVBQUU7QUFDaEIsY0FBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDekIsaUJBQU87U0FDUjs7QUFFRCxZQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUNuQyxJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFdEQsbUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUVwRSxZQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztBQUNoQyxZQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztPQUM1Qjs7QUFHRyxlQUFXOzs7O1dBQUEsWUFBRztBQUNoQixZQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtBQUN0QixpQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztTQUNoQzs7QUFFRCxlQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7T0FDMUI7Ozs7U0EvRWtCLGdCQUFnQjs7O2lCQUFoQixnQkFBZ0I7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBM0I5QixPQUFPLDJCQUFNLFVBQVU7O0lBQ3ZCLFdBQVcsMkJBQU0sY0FBYzs7SUFDL0IsTUFBTSwyQkFBTSxRQUFROztJQUVwQixFQUFFLDJCQUFNLGFBQWE7O0lBQ3JCLE9BQU8sMkJBQU0sbUJBQW1COztJQUNoQyxtQkFBbUIsMkJBQU0sb0NBQW9DOzs7QUFHcEUsSUFBSSxtQkFBbUIsR0FBRyxJQUFJLENBQUM7QUFDL0IsSUFBSSx1QkFBdUIsR0FBRyxtQkFBbUIsQ0FBQzs7O0FBR2xELElBQU0sUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNuQixJQUFNLFdBQVcsR0FBRyxVQUFJLEdBQUcsRUFBRSxDQUFDOztJQUVULEtBQUs7Ozs7Ozs7Ozs7Ozs7O0FBYWIsV0FiUSxLQUFLLENBYVosUUFBUSxFQUFFLElBQUksRUFBZ0I7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQWJyQixLQUFLOztBQWN0QixxQ0FkaUIsS0FBSyw2Q0FjZDtBQUNSLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVqQixRQUFNLFFBQVEsR0FBRztBQUNmLFlBQU0sRUFBRSxHQUFHO0FBQ1gsU0FBRyxFQUFFLENBQUM7QUFDTixRQUFFLEVBQUUsRUFBRTtBQUNOLGFBQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDZixhQUFPLEVBQUUsQ0FBQztBQUNWLGtCQUFZLEVBQUUsS0FBSztBQUNuQix5QkFBbUIsRUFBRSxDQUFDO0FBQ3RCLGVBQVMsRUFBRSxFQUFFO0tBQ2QsQ0FBQzs7QUFFRixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ25ELFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDOzs7QUFHeEIsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDaEIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDekIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEIsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7O0FBRTFCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOztBQUVwQixRQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0FBQ2hDLFFBQUksQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLENBQUM7O0FBRXRDLFFBQUksQ0FBQyxjQUFjLEdBQUcsVUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNoQyxRQUFJLENBQUMsb0JBQW9CLEdBQUcsVUFBSSxHQUFHLEVBQUUsQ0FBQztBQUN0QyxRQUFJLENBQUMsb0JBQW9CLEdBQUcsVUFBSSxHQUFHLEVBQUUsQ0FBQzs7QUFFdEMsUUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztBQUNoQyxRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzs7QUFFdEIsUUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUMzQixLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOztBQUVsQyxRQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQzs7O0FBRzFCLFFBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDOzs7QUFHeEIsUUFBSSxtQkFBbUIsS0FBSyxJQUFJLEVBQUU7QUFDaEMseUJBQW1CLEdBQUcsSUFBSSx1QkFBdUIsRUFBRSxDQUFDO0tBQ3JEO0dBQ0Y7O1lBL0RrQixLQUFLOztlQUFMLEtBQUs7QUE0RXBCLFNBQUs7V0FKQSxZQUFHO0FBQ1YsZUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztPQUMvQjtXQUVRLFVBQUMsS0FBSyxFQUFFO0FBQ2YsWUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO09BQ2hDOztBQU1HLFVBQU07V0FKQSxZQUFHO0FBQ1gsZUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztPQUNoQztXQUVTLFVBQUMsS0FBSyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztPQUNqQzs7QUFNRyxZQUFRO1dBSkEsWUFBRztBQUNiLGVBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7T0FDbEM7V0FFVyxVQUFDLEtBQUssRUFBRTtBQUNsQixZQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7T0FDbkM7O0FBTUcsZ0JBQVk7V0FKQSxZQUFHO0FBQ2pCLGVBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUM7T0FDdEM7V0FFZSxVQUFDLEtBQUssRUFBRTtBQUN0QixZQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7T0FDdkM7O0FBb0JHLFdBQU87Ozs7Ozs7Ozs7Ozs7OztXQUxBLFVBQUMsTUFBTSxFQUFFO0FBQ2xCLFlBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUM3QixZQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUNuQztXQUVVLFlBQUc7QUFDWixlQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO09BQzVCOztBQU1HLFdBQU87V0FKQSxVQUFDLEtBQUssRUFBRTtBQUNqQixZQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7T0FDN0I7V0FFVSxZQUFHO0FBQ1osZUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztPQUM1Qjs7QUFVRCxrQkFBYzs7Ozs7Ozs7Ozs7YUFBQSx3QkFBQyxXQUFXLEVBQUU7QUFDMUIsWUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7O0FBRS9CLFlBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7QUFDNUIsWUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7T0FDaEM7O0FBUUcsUUFBSTs7Ozs7O1dBRkEsWUFBRztBQUFFLGVBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztPQUFFO1dBRXpCLFVBQUMsSUFBSSxFQUFFO0FBQ2IsZ0JBQVEsSUFBSSxDQUFDLFFBQVE7QUFDbkIsZUFBSyxRQUFRO0FBQ1gsZ0JBQUksSUFBSSxDQUFDLEtBQUssRUFBRTs7QUFDZCxrQkFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDdEIsTUFBTTtBQUNMLGtCQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDckI7QUFDRCxrQkFBTTtBQUFBLEFBQ1IsZUFBSyxZQUFZO0FBQ2YsZ0JBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLGtCQUFNO0FBQUEsU0FDVDtPQUNGOztBQVFELG9CQUFnQjs7Ozs7Ozs7O2FBQUEsNEJBQUc7Ozs7QUFFakIsWUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM3QyxZQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRXZELFlBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDeEQsWUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUVoRCxZQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2pELFlBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRTlDLFlBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDeEQsWUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN4RCxZQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZELFlBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM3QyxZQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDLFlBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUM7O0FBRTlDLFlBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdkQsWUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ2pELFlBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7O0FBRTFDLFlBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUNsQyxZQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQztBQUN4QixpQkFBTyxFQUFFO21CQUFNLEdBQUc7V0FBQTtBQUNsQixlQUFLLEVBQUk7bUJBQU0sU0FBUztXQUFBO0FBQ3hCLGVBQUssRUFBSTttQkFBTSxNQUFLLFdBQVcsQ0FBQyxRQUFRO1dBQUE7QUFDeEMsZ0JBQU0sRUFBRzttQkFBTSxNQUFLLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7V0FBQTtBQUM5RCxXQUFDLEVBQVE7bUJBQU0sTUFBSyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1dBQUE7U0FDL0QsQ0FBQyxDQUFDOztBQUVILFlBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzs7QUFFM0QsWUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3hDLFlBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM1QyxZQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDM0MsWUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDOzs7QUFHbEQsWUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtBQUNyQixjQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzFELGNBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMvQyxjQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3ZDLGNBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7U0FDekM7T0FDRjs7QUFZRCxrQkFBYzs7Ozs7Ozs7Ozs7OzthQUFBLHdCQUFDLElBQUksRUFBZ0M7WUFBOUIsU0FBUyxnQ0FBRyxFQUFFO1lBQUUsT0FBTyxnQ0FBRyxFQUFFOztBQUMvQyxZQUFJLENBQUMsbUJBQW1CLEdBQUcsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLFNBQVMsRUFBVCxTQUFTLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxDQUFDO09BQ3pEOztBQVFELHdCQUFvQjs7Ozs7Ozs7O2FBQUEsOEJBQUMsSUFBSSxFQUFnQztZQUE5QixTQUFTLGdDQUFHLEVBQUU7WUFBRSxPQUFPLGdDQUFHLEVBQUU7O0FBQ3JELFlBQUksQ0FBQyx5QkFBeUIsR0FBRyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsU0FBUyxFQUFULFNBQVMsRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLENBQUM7T0FDL0Q7O0FBTUQsZUFBVzs7Ozs7OzthQUFBLHFCQUFDLFFBQVEsRUFBRTtBQUNwQixnQkFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxQixZQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztPQUMzQjs7QUFPRCwyQkFBdUI7Ozs7Ozs7O2FBQUEsbUNBQUc7QUFDeEIsWUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQztBQUNsRSxZQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7QUFDekQsWUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNuRCxZQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxHQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXhGLFlBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUN4Rjs7QUFNRyxpQkFBYTs7Ozs7O1dBQUEsWUFBRztBQUNsQixlQUFPLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO09BQzNEOztBQUVELFVBQU07YUFBQSxrQkFBWTs7OzBDQUFSLE1BQU07QUFBTixnQkFBTTs7O0FBQ2QsWUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFBRSxpQkFBTztTQUFFO0FBQ2hDLFlBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQUUsZ0JBQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQUU7QUFDdEQsWUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQUUsZ0JBQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FBRTs7QUFFckQsY0FBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUN0QixjQUFNLElBQUksR0FBRyxNQUFLLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoRCxnQkFBSyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUN6QyxnQkFBSyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDcEIsQ0FBQyxDQUFDO09BQ0o7O0FBRUQsWUFBUTthQUFBLG9CQUFZOzs7MENBQVIsTUFBTTtBQUFOLGdCQUFNOzs7QUFDaEIsWUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFBRSxpQkFBTztTQUFFO0FBQ2hDLFlBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQUUsZ0JBQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQUU7QUFDdEQsWUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQUUsZ0JBQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FBRTs7QUFFckQsY0FBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUN0QixjQUFNLElBQUksR0FBRyxNQUFLLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoRCxnQkFBSyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUM1QyxDQUFDLENBQUM7T0FDSjs7QUFFRCxtQkFBZTthQUFBLDJCQUFZOzs7MENBQVIsTUFBTTtBQUFOLGdCQUFNOzs7QUFDdkIsWUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFBRSxpQkFBTztTQUFFO0FBQ2hDLFlBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQUUsZ0JBQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQUU7QUFDdEQsWUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQUUsZ0JBQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FBRTs7QUFFckQsY0FBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUN0QixjQUFNLElBQUksR0FBRyxNQUFLLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoRCxnQkFBSyxTQUFTLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUNuRCxDQUFDLENBQUM7T0FDSjs7QUFFRCxRQUFJO2FBQUEsY0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7OztBQUMzQixZQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGlCQUFPO1NBQUU7QUFDaEMsY0FBTSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQzs7QUFFcEQsY0FBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUN0QixjQUFNLElBQUksR0FBSSxNQUFLLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqRCxjQUFNLEtBQUssR0FBRyxNQUFLLGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0MsY0FBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzNCLGdCQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBSyxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDMUUsZ0JBQUssSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDakMsQ0FBQyxDQUFDO09BQ0o7O0FBTUQsc0JBQWtCOzs7Ozs7O2FBQUEsOEJBQWM7WUFBYixJQUFJLGdDQUFHLElBQUk7O0FBQzVCLFlBQU0sT0FBTyxHQUFHLElBQUksR0FBRyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3hDLFlBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDM0MsWUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztPQUNoQzs7QUFFRCxlQUFXO2FBQUEscUJBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7QUFDMUIsMkJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQ2hEOztBQUVELGtCQUFjO2FBQUEsd0JBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7QUFDN0IsMkJBQW1CLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQ25EOztBQVVELFlBQVE7Ozs7Ozs7Ozs7O2FBQUEsa0JBQUMsR0FBRyxFQUFFO0FBQ1osWUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDL0I7O0FBT0QseUJBQXFCOzs7Ozs7OzthQUFBLCtCQUFDLEdBQUcsRUFBRTtBQUN6QixZQUFJLEtBQUssWUFBQSxDQUFDOztBQUVWLFdBQUc7QUFDRCxjQUFJLEdBQUcsQ0FBQyxTQUFTLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDbkQsaUJBQUssR0FBRyxHQUFHLENBQUM7QUFDWixrQkFBTTtXQUNQOztBQUVELGFBQUcsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDO1NBQ3RCLFFBQVEsR0FBRyxLQUFLLElBQUksRUFBRTs7QUFFdkIsZUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7T0FDM0M7O0FBUUQsb0JBQWdCOzs7Ozs7Ozs7YUFBQSwwQkFBQyxLQUFLLEVBQUU7QUFDdEIsWUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwRCxlQUFPLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDO09BQ3ZDOztBQU9ELFdBQU87Ozs7Ozs7O2FBQUEsaUJBQUMsS0FBSyxFQUFFO0FBQ2IsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNuQyxlQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7T0FDcEM7O0FBUUQsY0FBVTs7Ozs7Ozs7O2FBQUEsb0JBQUMsR0FBRyxFQUFFO0FBQ2QsV0FBRztBQUNELGNBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFDcEIsbUJBQU8sSUFBSSxDQUFDO1dBQ2I7O0FBRUQsYUFBRyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUM7U0FDdEIsUUFBUSxHQUFHLEtBQUssSUFBSSxFQUFFOztBQUV2QixlQUFPLEtBQUssQ0FBQztPQUNkOztBQU1ELGtCQUFjOzs7Ozs7O2FBQUEsd0JBQUMsSUFBSSxFQUFFO0FBQ25CLFlBQU0sS0FBSyxHQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdEUsWUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN6RSxZQUFNLE1BQU0sR0FBSyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZFLFlBQU0sR0FBRyxHQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDOztBQUVqQyxZQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDcEMsWUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDO0FBQzVELFVBQUUsSUFBSyxLQUFLLEdBQUcsTUFBTSxBQUFDLENBQUM7QUFDdkIsVUFBRSxJQUFLLEtBQUssR0FBRyxNQUFNLEFBQUMsQ0FBQzs7QUFFdkIsWUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFBLEFBQUMsQ0FBQztBQUN2RCxZQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDOztBQUV2QyxVQUFFLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDdEIsVUFBRSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDOztBQUV0QixZQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO0FBQ3pDLFlBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDOztBQUVoRCxZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFTLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDdkQsY0FBTSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ25CLGNBQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdEMsaUJBQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDOUQsQ0FBQyxDQUFDOztBQUVILGVBQU8sS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUMvQjs7QUFxQkQsVUFBTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2FBQUEsa0JBQUc7Ozs7QUFFUCxZQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFTLEtBQUssRUFBRTtBQUNoQyxjQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFBRSxtQkFBTztXQUFFO0FBQ3ZDLHFCQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQ3BDLENBQUMsQ0FBQzs7O0FBR0gsWUFBSSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FDNUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUNsQixNQUFNLENBQUMsWUFBVztBQUNqQixpQkFBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzNDLENBQUMsQ0FDRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFTLEtBQUssRUFBRTtBQUMvQixpQkFBTyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQy9CLENBQUMsQ0FBQzs7O0FBR0wsWUFDRSxJQUFJLENBQUMseUJBQXlCLEtBQUssSUFBSSxJQUN2QyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFDcEM7MENBQ3FDLElBQUksQ0FBQyx5QkFBeUI7Y0FBM0QsSUFBSSw2QkFBSixJQUFJO2NBQUUsU0FBUyw2QkFBVCxTQUFTO2NBQUUsT0FBTyw2QkFBUCxPQUFPOztBQUNoQyxjQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNqRCxjQUFNLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFaEMsZUFBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN6QixnQkFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUNuQyxnQkFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQzs7QUFFN0QsY0FBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDN0MsY0FBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbEM7OztBQUdELFlBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQ2pCLE1BQU0sQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLLEVBQUs7O29DQUVhLE1BQUssbUJBQW1CO2NBQXJELElBQUksdUJBQUosSUFBSTtjQUFFLFNBQVMsdUJBQVQsU0FBUztjQUFFLE9BQU8sdUJBQVAsT0FBTzs7QUFDaEMsY0FBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDaEMsZUFBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFekIsY0FBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFLLGlCQUFpQixDQUFDLENBQUM7QUFDakQsYUFBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDOztBQUVoRCxnQkFBSyxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNwQyxnQkFBSyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFNUQsaUJBQU8sR0FBRyxDQUFDO1NBQ1osQ0FBQyxDQUFDOzs7QUFHTCxZQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO0FBQzNDLFlBQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDOztBQUV2RCxZQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUNoQixJQUFJLENBQUMsVUFBUyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQzNCLGNBQU0sR0FBRyxHQUFHLElBQUksQ0FBQztBQUNqQixjQUFNLEtBQUssR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUV0QyxlQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDaEIscUJBQVcsVUFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFCLHdCQUFjLFVBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzQiw4QkFBb0IsVUFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xDLENBQUMsQ0FDRCxNQUFNLEVBQUUsQ0FBQztPQUNiOztBQUtELFVBQU07Ozs7OzthQUFBLGtCQUFHO0FBQ1AsWUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3ZCLFlBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztPQUNyQjs7QUFLRCxtQkFBZTs7Ozs7O2FBQUEsMkJBQUc7QUFDaEIsWUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7O0FBRS9CLFlBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7O0FBRXJDLFlBQU0sS0FBSyxHQUFJLFdBQVcsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUU3RCxZQUFNLENBQUMsR0FBUSxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakUsWUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0QsWUFBTSxHQUFHLEdBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDL0IsWUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7O0FBRWxDLFlBQU0sZUFBZSw0QkFBMEIsQ0FBQyxXQUFLLEdBQUcsR0FBRyxNQUFNLENBQUEsTUFBRyxDQUFDOztBQUVyRSxZQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLGVBQWUsQ0FBQyxDQUFDOztBQUU1RCxZQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3ZELFlBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDekQsWUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDOztBQUV0RCxZQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxpQkFBZSxNQUFNLFVBQU8sQ0FBQzs7O0FBRzFFLFlBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUN0QixJQUFJLENBQUMsaUJBQWlCLEVBQ3RCLElBQUksQ0FBQyxhQUFhLEVBQ2xCLElBQUksQ0FBQyxXQUFXLEVBQ2hCLENBQUMsQ0FDRixDQUFDOzs7QUFHRixZQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQ3JCLGNBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDckQsY0FBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUN4RDtPQUNGOztBQU1ELGdCQUFZOzs7Ozs7O2FBQUEsd0JBQWU7OztZQUFkLEtBQUssZ0NBQUcsSUFBSTs7QUFDdkIsWUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7O0FBRS9CLFlBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztBQUNsQixZQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztBQUNoRCxZQUFNLEtBQUssR0FBRyxLQUFLLEtBQUssSUFBSSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQzs7QUFFbkYsWUFBSSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLLEVBQUs7QUFDbEQsZUFBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxNQUFLLElBQUksQ0FBQyxDQUFDO1NBQzNDLENBQUMsQ0FBQzs7O0FBR0gsYUFBSyxDQUFDLElBQUksQ0FBQyxVQUFTLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDaEMsY0FBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUMsZUFBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDOUMsQ0FBQyxDQUFDO09BQ0o7OztBQXRoQk0sZ0NBQTRCOzs7Ozs7YUFBQSxzQ0FBQyxJQUFJLEVBQUU7QUFDeEMsK0JBQXVCLEdBQUcsSUFBSSxDQUFDO09BQ2hDOzs7O1NBdEVrQixLQUFLO0dBQVMsTUFBTSxDQUFDLFlBQVk7O2lCQUFqQyxLQUFLOzs7OztpQkFoQlgsNEJBQTRCOzs7Ozs7Ozs7OztJQUFwQyxPQUFPLDJCQUFNLFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBaUJULG1CQUFtQjtBQUMzQixXQURRLG1CQUFtQixDQUMxQixlQUFlLEVBQUUsWUFBWSxFQUFFOzBCQUR4QixtQkFBbUI7O0FBRXBDLFFBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDOzs7QUFHcEIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7OztBQUd6QixRQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztBQUNqQixRQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNmLFFBQUksQ0FBQyx3QkFBd0IsR0FBRyxlQUFlLENBQUM7O0FBRWhELFFBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO0FBQ2xDLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQztBQUMxRSxRQUFJLENBQUMsd0JBQXdCLEdBQUcsS0FBSyxDQUFDOzs7QUFHdEMsUUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUMzQixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FDZCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQzs7QUFFL0IsUUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7OztBQUd6QixRQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDO0dBQy9EOztlQXpCa0IsbUJBQW1CO0FBK0JsQyxtQkFBZTtXQUpBLFlBQUc7QUFDcEIsZUFBTyxJQUFJLENBQUMsd0JBQXdCLENBQUM7T0FDdEM7V0FFa0IsVUFBQyxLQUFLLEVBQUU7QUFDekIsWUFBSSxDQUFDLHdCQUF3QixHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ2xELFlBQUksQ0FBQyx3QkFBd0IsR0FBRyxLQUFLLENBQUM7QUFDdEMsWUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7OztBQUcvQixZQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFTLEtBQUssRUFBRTtBQUNyQyxjQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRTtBQUFFLG1CQUFPO1dBQUU7QUFDcEMsZUFBSyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO1NBQ3pDLENBQUMsQ0FBQztPQUNKOztBQUVHLDJCQUF1QjtXQUFBLFlBQUc7QUFDNUIsZUFBTyxJQUFJLENBQUMsd0JBQXdCLENBQUM7T0FDdEM7O0FBTUcsVUFBTTtXQUpBLFlBQUc7QUFDWCxlQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7T0FDckI7V0FFUyxVQUFDLEtBQUssRUFBRTtBQUNoQixZQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztPQUN0Qjs7QUFNRyxRQUFJO1dBSkEsWUFBRztBQUNULGVBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztPQUNuQjtXQUVPLFVBQUMsS0FBSyxFQUFFOztBQUVkLFlBQU0sV0FBVyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3ZDLFlBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLFlBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsd0JBQXdCLEdBQUcsS0FBSyxDQUFDO0FBQ3RFLFlBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDOztBQUUvQixZQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFTLEtBQUssRUFBRTtBQUNyQyxjQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRTtBQUFFLG1CQUFPO1dBQUU7QUFDcEMsZUFBSyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztTQUN2RCxDQUFDLENBQUM7T0FDSjs7QUFNRyxnQkFBWTtXQUpBLFlBQUc7QUFDakIsZUFBTyxJQUFJLENBQUMsYUFBYSxDQUFDO09BQzNCO1dBRWUsVUFBQyxLQUFLLEVBQUU7QUFDdEIsWUFBTSxVQUFVLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7O0FBRTdDLFlBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO0FBQzNCLFlBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQzs7QUFFMUUsWUFBSSxJQUFJLENBQUMsdUJBQXVCLEVBQUU7QUFDaEMsY0FBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsd0JBQXdCLEdBQUcsVUFBVSxDQUFDO1NBQ25FO09BQ0Y7O0FBR0csbUJBQWU7Ozs7V0FBQSxZQUFHO0FBQ3BCLGVBQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDO09BQzlCOztBQU1HLDJCQUF1QjtXQUpBLFlBQUc7QUFDNUIsZUFBTyxJQUFJLENBQUMsd0JBQXdCLENBQUM7T0FDdEM7V0FFMEIsVUFBQyxJQUFJLEVBQUU7QUFDaEMsWUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQztPQUN0Qzs7QUFNRyxlQUFXO1dBSkEsWUFBRztBQUNoQixlQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7T0FDMUI7V0FFYyxVQUFDLEtBQUssRUFBRTtBQUNyQixZQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztPQUMzQjs7QUFFRCwyQkFBdUI7YUFBQSxtQ0FBRztBQUN4QixZQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUM7QUFDMUUsWUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQztPQUM1RDs7OztTQS9Ha0IsbUJBQW1COzs7aUJBQW5CLG1CQUFtQjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWpCakMsTUFBTSwyQkFBTSxRQUFROztJQUVwQixRQUFRLDJCQUFNLDBCQUEwQjs7SUFDeEMsZ0JBQWdCLDJCQUFNLHNCQUFzQjs7SUFDNUMsT0FBTywyQkFBTSx5QkFBeUI7O0lBQ3RDLG1CQUFtQiwyQkFBTSx5QkFBeUI7O0lBQ2xELEtBQUssMkJBQU0sU0FBUzs7SUFDcEIsZUFBZSwyQkFBTSxvQkFBb0I7Ozs7Ozs7Ozs7SUFVM0IsUUFBUTs7Ozs7QUFJaEIsV0FKUSxRQUFRLEdBSTZCO1FBQTVDLGVBQWUsZ0NBQUcsR0FBRztRQUFFLFlBQVksZ0NBQUcsSUFBSTs7MEJBSm5DLFFBQVE7O0FBS3pCLHFDQUxpQixRQUFRLDZDQUtqQjs7QUFFUixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pDLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDOzs7QUFHbkIsUUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUM7QUFDNUIsUUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQzs7O0FBR3pDLFFBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDOztBQUV6QixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksbUJBQW1CLENBQUMsZUFBZSxFQUFFLFlBQVksQ0FBQyxDQUFDO0dBQzNFOztZQW5Ca0IsUUFBUTs7dUJBQVIsUUFBUTs7Ozs7O1NBd0JqQixZQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztLQUNoQztTQUVTLFVBQUMsS0FBSyxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztLQUNqQzs7O1NBRU8sWUFBRztBQUNULGFBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7S0FDOUI7U0FFTyxVQUFDLEtBQUssRUFBRTtBQUNkLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztLQUMvQjs7O1NBRWtCLFlBQUc7QUFDcEIsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQztLQUN6QztTQUVrQixVQUFDLEtBQUssRUFBRTtBQUN6QixVQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7S0FDMUM7OztTQUVlLFlBQUc7QUFDakIsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQztLQUN0QztTQUVlLFVBQUMsS0FBSyxFQUFFO0FBQ3RCLFVBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztLQUN2Qzs7O1NBRWMsWUFBRztBQUNoQixhQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDO0tBQ3JDOzs7Ozs7O1NBS2tCLFlBQUc7QUFDcEIsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQztLQUN6Qzs7Ozs7U0FHMEIsVUFBQyxJQUFJLEVBQUU7QUFDaEMsVUFBSSxDQUFDLFdBQVcsQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUM7S0FDakQ7U0FFMEIsWUFBRztBQUM1QixhQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsdUJBQXVCLENBQUM7S0FDakQ7Ozs7O1NBR2dCLFlBQUc7QUFDbEIsYUFBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0tBQzVCOzs7Ozs7OztXQU1lLDBCQUFDLElBQUksRUFBRTtBQUNyQixVQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztLQUMxQjs7Ozs7Ozs7Ozs7O1dBVWdCLDJCQUFDLElBQUksRUFBRSxFQUFFLEVBQWdCOzs7VUFBZCxPQUFPLGdDQUFHLEVBQUU7O0FBQ3RDLFVBQU0sV0FBVyxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMxQyxpQkFBVyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBQyxDQUFDO2VBQUssTUFBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUFDO0tBQ3REOzs7Ozs7OztXQU1XLHNCQUFDLENBQUMsRUFBRTs7QUFFZCxVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFdEIsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFBRSxlQUFPO09BQUU7QUFDN0IsVUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDNUI7Ozs7Ozs7O1NBT1EsVUFBQyxLQUFLLEVBQUU7QUFDZixVQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFBRSxZQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO09BQUU7QUFDeEMsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDcEIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNyQjtTQUVRLFlBQUc7QUFDVixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7S0FDcEI7Ozs7Ozs7O1NBTVMsWUFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztLQUNyQjs7Ozs7Ozs7U0FNUyxZQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztLQUM1Qjs7Ozs7Ozs7O1dBT0UsYUFBQyxLQUFLLEVBQUU7QUFDVCxVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3JDLGNBQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztPQUN4RDs7QUFFRCxXQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFbEMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEIsVUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3REOzs7Ozs7OztXQU1LLGdCQUFDLEtBQUssRUFBRSxFQUViOzs7Ozs7Ozs7OztXQVNVLHFCQUFDLEdBQUcsRUFBcUM7VUFBbkMsV0FBVyxnQ0FBRyxHQUFHO1VBQUUsT0FBTyxnQ0FBRyxJQUFJOztBQUNoRCxVQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7O0FBRTFDLFVBQUksT0FBTyxLQUFLLElBQUksRUFBRTtBQUNwQixZQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssU0FBUyxFQUFFO0FBQzFDLGdCQUFNLElBQUksS0FBSyxpQkFBYyxPQUFPLHdCQUFvQixDQUFDO1NBQzFEOztBQUVELFlBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDO09BQ2xDOzs7QUFHRCxVQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hCLFdBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNmLFdBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7QUFFZixhQUFPLEtBQUssQ0FBQztLQUNkOzs7Ozs7Ozs7O1dBUU8sa0JBQUMsS0FBSyxFQUFFLGNBQWMsRUFBdUI7VUFBckIsT0FBTyxnQ0FBRyxTQUFTOztBQUNqRCxVQUFJLEtBQUssR0FBRyxjQUFjLENBQUM7O0FBRTNCLFVBQUksT0FBTyxjQUFjLEtBQUssUUFBUSxFQUFFO0FBQ3RDLGFBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDO09BQzNDOzs7QUFHRCxVQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRTtBQUN0QixZQUFNLFdBQVcsR0FBRyxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUMzRCxhQUFLLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO09BQ25DOzs7QUFHRCxXQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVqQixVQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNqQyxZQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztPQUNuQzs7QUFFRCxVQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFekMsV0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2YsV0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2hCOzs7Ozs7OztXQU1VLHFCQUFDLEtBQUssRUFBRTtBQUNqQixVQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFTLEtBQUssRUFBRTtBQUNsQyxZQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxQyxZQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtBQUFFLGVBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FBRTtPQUMzQyxDQUFDLENBQUM7OztBQUdILFdBQUssSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtBQUN2QyxZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNDLFlBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRW5DLFlBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQUUsZUFBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FBRTs7QUFFN0MsWUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDakIsaUJBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNyQztPQUNGO0tBQ0Y7Ozs7Ozs7OztXQU9XLHNCQUFDLE9BQU8sRUFBRTtBQUNwQixhQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDakM7Ozs7Ozs7OztXQU9xQixnQ0FBQyxHQUFHLEVBQUU7QUFDMUIsVUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFakIsU0FBRztBQUNELFlBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDbkMsY0FBSSxHQUFHLEdBQUcsQ0FBQztTQUNaO0FBQ0QsV0FBRyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUM7T0FDdEIsUUFBUSxJQUFJLEtBQUssSUFBSSxFQUFFOztBQUV4QixVQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFTLE1BQU0sRUFBRTtBQUNuQyxZQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO0FBQUUsZUFBSyxHQUFHLE1BQU0sQ0FBQztTQUFFO09BQzlDLENBQUMsQ0FBQzs7QUFFSCxhQUFPLEtBQUssQ0FBQztLQUNkOzs7Ozs7Ozs7V0FPZSwwQkFBQyxPQUFPLEVBQUU7QUFDeEIsYUFBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3JDOztTQUVDLE1BQUEsTUFBTSxDQUFDLFFBQVE7b0NBQUM7Ozs7OztvRUFDVCxNQUFLLE1BQU07Ozs7Ozs7S0FDbkI7OztTQXJTa0IsUUFBUTtHQUFTLE1BQU0sQ0FBQyxZQUFZOztpQkFBcEMsUUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWpCdEIsS0FBSywyQkFBTSxTQUFTOzs7Ozs7SUFJTixlQUFlO0FBQ3ZCLFdBRFEsZUFBZSxDQUN0QixRQUFRLEVBQUU7MEJBREgsZUFBZTs7QUFFaEMscUNBRmlCLGVBQWUsNkNBRXhCOztBQUVSLFFBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0dBQzNCOztZQUxrQixlQUFlOztlQUFmLGVBQWU7QUFTbEMsc0JBQWtCOzs7OzthQUFBLDhCQUFzQjtZQUFyQixZQUFZLGdDQUFHLElBQUk7O0FBQ3BDLFlBQUksTUFBTSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsWUFBSSxPQUFPLFlBQVksS0FBSyxRQUFRLEVBQUU7QUFDcEMsZ0JBQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNyRCxNQUFNLElBQUksWUFBWSxZQUFZLEtBQUssRUFBRTtBQUN4QyxnQkFBTSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDekIsTUFBTTtBQUNMLGdCQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUN0Qjs7QUFFRCxlQUFPLE1BQU0sQ0FBQztPQUNmOztBQU1HLFVBQU07Ozs7OztXQUFBLFVBQUMsS0FBSyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2lCQUFLLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSztTQUFBLENBQUMsQ0FBQztPQUMvQzs7QUFHRyxVQUFNOzs7O1dBQUEsWUFBRztBQUNYLFlBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNoQixZQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztpQkFBSyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1NBQUEsQ0FBQyxDQUFDOztBQUU5RCxlQUFPLE1BQU0sQ0FBQztPQUNmOztBQUVELFVBQU07YUFBQSxrQkFBRztBQUNQLFlBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2lCQUFLLEtBQUssQ0FBQyxNQUFNLEVBQUU7U0FBQSxDQUFDLENBQUM7QUFDeEMsWUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7T0FDL0I7O0FBR0QsVUFBTTs7OzthQUFBLGdCQUFDLFlBQVksRUFBRTtBQUNuQixZQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDckQsWUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7aUJBQUssS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7U0FBQSxDQUFDLENBQUM7QUFDOUMsWUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQ3ZDOztBQUVELG1CQUFlO2FBQUEseUJBQUMsZUFBZSxFQUFFO0FBQy9CLFlBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2lCQUFLLEtBQUssQ0FBQyxlQUFlLEVBQUU7U0FBQSxDQUFDLENBQUM7QUFDakQsWUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztPQUMxQzs7QUFFRCxnQkFBWTthQUFBLHNCQUFDLFlBQVksRUFBRTtBQUN6QixZQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDckQsWUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7aUJBQUssS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7U0FBQSxDQUFDLENBQUM7QUFDcEQsWUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQzlDOzs7O1NBNURrQixlQUFlO0dBQVMsS0FBSzs7aUJBQTdCLGVBQWU7Ozs7Ozs7Ozs7Ozs7OztJQUo3QixPQUFPLDJCQUFNLFVBQVU7O0lBQ3ZCLEVBQUUsMkJBQU0sYUFBYTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFzRFAsS0FBSztBQUNiLFdBRFEsS0FBSyxDQUNaLEdBQUcsRUFBZ0I7UUFBZCxNQUFNLGdDQUFHLEdBQUc7OzBCQURWLEtBQUs7O0FBRXRCLFFBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2YsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7OztBQUd0QixRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDOztBQUU3QixRQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztHQUN6Qjs7dUJBVmtCLEtBQUs7O1NBWWQsWUFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztLQUNyQjtTQUVTLFVBQUMsS0FBSyxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDOztLQUV0Qjs7Ozs7Ozs7V0FNUSxtQkFBQyxnQkFBZ0IsRUFBRTtBQUMxQixVQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7S0FDMUM7Ozs7Ozs7O1dBTU0sbUJBQUc7Ozs7QUFFUixVQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2VBQUssTUFBSyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7T0FBQSxDQUFDLENBQUM7O0FBRXBFLFVBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFVBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFDN0IsVUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0tBQ3hCOzs7Ozs7O1dBS2UsNEJBQUc7QUFDakIsVUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDakQsVUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDOUQsVUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqRCxVQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO0FBQ2pFLFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU1QixVQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN6RCxpQkFBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ25ELGlCQUFXLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbEQsaUJBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDOztBQUU1RCxVQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFbkQsVUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdkQsa0JBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVyQyxVQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN2RCxrQkFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXJDLFVBQU0sa0JBQWtCLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDN0Qsd0JBQWtCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFakQsVUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QixVQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzlCLGtCQUFZLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3ZDLFVBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDL0IsVUFBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQUVyQyxVQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFM0IsVUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQzs7QUFFNUIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLGVBQWUsQ0FBQzs7QUFFM0MsVUFBSSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUM7QUFDNUIsVUFBSSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUM7QUFDNUIsVUFBSSxDQUFDLGFBQWEsR0FBRyxrQkFBa0IsQ0FBQztBQUN4QyxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixVQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztLQUNoQzs7Ozs7OztXQUtFLGFBQUMsS0FBSyxFQUFFO0FBQ1QsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXhCLFVBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNyQzs7Ozs7OztXQUtLLGdCQUFDLEtBQUssRUFBRTtBQUNaLFVBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVsRCxVQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDckM7Ozs7Ozs7V0FLSyxrQkFBRzs7Ozs7O0FBQ1Asb0RBQWtCLElBQUk7Y0FBYixLQUFLO0FBQVksZUFBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQUU7Ozs7Ozs7Ozs7Ozs7OztLQUM1Qzs7Ozs7OztXQUtLLGtCQUFnQjtVQUFmLE1BQU0sZ0NBQUcsSUFBSTs7QUFDbEIsVUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDM0I7OztXQUVjLDJCQUFHO0FBQ2hCLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDdkIsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQzs7QUFFN0IsVUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7QUFDL0MsVUFBTSxNQUFNLEdBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUM1QixVQUFNLEtBQUssR0FBSyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUM7QUFDOUMsVUFBTSxPQUFPLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RFLFVBQU0sU0FBUyxrQkFBZ0IsT0FBTyxTQUFNLENBQUM7O0FBRTdDLFVBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM1QyxVQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDMUMsVUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxXQUFTLEtBQUssU0FBSSxNQUFNLENBQUcsQ0FBQzs7QUFFL0QsYUFBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQ3REOzs7V0FFVyx3QkFBZ0I7OztVQUFmLE1BQU0sZ0NBQUcsSUFBSTs7QUFDeEIsWUFBTSxHQUFHLEFBQUMsTUFBTSxLQUFLLElBQUksR0FBSSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFbEQsWUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBSztBQUN4QixZQUFJLE1BQUssTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUFFLGlCQUFPO1NBQUU7QUFDbEQsYUFBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ2hCLENBQUMsQ0FBQztLQUNKOztTQUVDLE1BQUEsTUFBTSxDQUFDLFFBQVE7b0NBQUM7Ozs7OztvRUFDVCxNQUFLLE1BQU07Ozs7Ozs7S0FDbkI7OztTQXJKa0IsS0FBSzs7O2lCQUFMLEtBQUs7Ozs7Ozs7Ozs7Ozs7OztJQXZEbkIsZUFBZSwyQkFBTSw0QkFBNEI7O0lBQ2pELEtBQUssMkJBQU0sZUFBZTs7SUFDMUIsY0FBYywyQkFBTSw4QkFBOEI7O0lBR3BDLG9CQUFvQjtBQUM1QixXQURRLG9CQUFvQixDQUMzQixJQUFJLEVBQWdCO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFEWCxvQkFBb0I7O0FBRXJDLHFDQUZpQixvQkFBb0IsNkNBRS9CLFlBQVksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFOztBQUVuQyxRQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3JDLFFBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxjQUFjLEVBQUUsQ0FBQyxDQUFDO0dBQ3hDOztZQU5rQixvQkFBb0I7O1NBQXBCLG9CQUFvQjtHQUFTLEtBQUs7O2lCQUFsQyxvQkFBb0I7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBTGxDLEtBQUssMkJBQU0sZUFBZTs7SUFDMUIsTUFBTSwyQkFBTSxrQkFBa0I7O0lBR2hCLFdBQVc7QUFDbkIsV0FEUSxXQUFXLEdBQ0o7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQURMLFdBQVc7O0FBRTVCLFFBQU0sSUFBSSxHQUFHLEVBQUUsZUFBZSxFQUFFLENBQUMsRUFBRSxDQUFDOztBQUVwQyxxQ0FKaUIsV0FBVyw2Q0FJdEIsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7O0FBRS9CLFFBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFVBQUMsQ0FBQztlQUFLLENBQUMsQ0FBQyxlQUFlO09BQUEsRUFBRSxFQUFFO0FBQzNELFdBQUssRUFBRSxPQUFPLENBQUMsS0FBSztLQUNyQixDQUFDLENBQUM7R0FDSjs7WUFUa0IsV0FBVzs7ZUFBWCxXQUFXO0FBZTFCLG1CQUFlO1dBSkEsVUFBQyxLQUFLLEVBQUU7QUFDekIsWUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO09BQ25DO1dBRWtCLFlBQUc7QUFDcEIsZUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztPQUNsQzs7OztTQWpCa0IsV0FBVztHQUFTLEtBQUs7O2lCQUF6QixXQUFXOzs7Ozs7Ozs7Ozs7Ozs7SUFKekIsa0JBQWtCLDJCQUFNLGtDQUFrQzs7SUFDMUQsR0FBRywyQkFBTSxlQUFlOztJQUN4QixLQUFLLDJCQUFNLGVBQWU7O0lBR1osUUFBUTtBQUNoQixXQURRLFFBQVEsQ0FDZixJQUFJLEVBQWdDO1FBQTlCLE9BQU8sZ0NBQUcsRUFBRTtRQUFFLFNBQVMsZ0NBQUcsRUFBRTs7MEJBRDNCLFFBQVE7O0FBRXpCLHFDQUZpQixRQUFRLDZDQUVuQixZQUFZLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTs7QUFFbkMsUUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QixRQUFJLENBQUMsV0FBVyxDQUFDLElBQUksa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO0dBQzVDOztZQU5rQixRQUFROztTQUFSLFFBQVE7R0FBUyxLQUFLOztpQkFBdEIsUUFBUTs7Ozs7Ozs7Ozs7Ozs7O0lBTHRCLEtBQUssMkJBQU0sZUFBZTs7SUFDMUIsTUFBTSwyQkFBTSxrQkFBa0I7O0lBQzlCLGNBQWMsMkJBQU0sOEJBQThCOztJQUdwQyxXQUFXO0FBQ25CLFdBRFEsV0FBVyxDQUNsQixJQUFJLEVBQWdCO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFEWCxXQUFXOztBQUU1QixxQ0FGaUIsV0FBVyw2Q0FFdEIsWUFBWSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7O0FBRW5DLFFBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRTtBQUM5QixvQkFBYyxFQUFFLE9BQU8sQ0FBQyxjQUFjO0tBQ3ZDLENBQUMsQ0FBQztBQUNILFFBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxjQUFjLEVBQUUsQ0FBQyxDQUFDO0dBQ3hDOztZQVJrQixXQUFXOztTQUFYLFdBQVc7R0FBUyxLQUFLOztpQkFBekIsV0FBVzs7Ozs7Ozs7Ozs7Ozs7O0lBTHpCLEtBQUssMkJBQU0sZUFBZTs7SUFDMUIsT0FBTywyQkFBTSxtQkFBbUI7O0lBQ2hDLGVBQWUsMkJBQU0sK0JBQStCOztJQUd0QyxZQUFZO0FBQ3BCLFdBRFEsWUFBWSxDQUNuQixJQUFJLEVBQWdCO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFEWCxZQUFZOztBQUU3QixxQ0FGaUIsWUFBWSw2Q0FFdkIsWUFBWSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7O0FBRW5DLFFBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRTtBQUMvQixxQkFBZSxFQUFFLE9BQU8sQ0FBQyxlQUFlO0tBQ3pDLENBQUMsQ0FBQztBQUNILFFBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxlQUFlLEVBQUUsQ0FBQyxDQUFDO0dBQ3pDOztZQVJrQixZQUFZOztTQUFaLFlBQVk7R0FBUyxLQUFLOztpQkFBMUIsWUFBWTs7Ozs7Ozs7Ozs7Ozs7O0lBTDFCLEtBQUssMkJBQU0sZUFBZTs7SUFDMUIsUUFBUSwyQkFBTSxvQkFBb0I7O0FBR3pDLElBQU0sUUFBUSxHQUFHO0FBQ2YsU0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2hCLFNBQU8sRUFBRSxDQUFDO0FBQ1YsT0FBSyxFQUFFLFdBQVc7Q0FDbkIsQ0FBQzs7SUFFbUIsYUFBYTtBQUNyQixXQURRLGFBQWEsQ0FDcEIsTUFBTSxFQUFFLE9BQU8sRUFBRTswQkFEVixhQUFhOztBQUU5QixXQUFPLEdBQUcsTUFBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRS9DLHFDQUppQixhQUFhLDZDQUl4QixRQUFRLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFOztBQUVqRSxRQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRTtBQUM1QixPQUFDLEVBQUUsV0FBUyxDQUFDLEVBQVk7WUFBVixDQUFDLGdDQUFHLElBQUk7O0FBQ3JCLFlBQUksQ0FBQyxLQUFLLElBQUksRUFBRTtBQUFFLFdBQUMsR0FBRyxDQUFDLENBQUM7U0FBRTtBQUMxQixlQUFPLENBQUMsQ0FBQztPQUNWO0tBQ0YsRUFBRTtBQUNELGdCQUFVLEVBQUUsTUFBTSxDQUFDLFVBQVU7QUFDN0IsV0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO0tBQ3JCLENBQUMsQ0FBQztHQUNKOztZQWZrQixhQUFhOztTQUFiLGFBQWE7R0FBUyxLQUFLOztpQkFBM0IsYUFBYTs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFWM0IsTUFBTSwyQkFBTSxRQUFROzs7Ozs7SUFNTixXQUFXO0FBQ25CLFdBRFEsV0FBVyxDQUNsQixFQUFFLEVBQUU7MEJBREcsV0FBVzs7QUFFNUIscUNBRmlCLFdBQVcsNkNBRXBCO0FBQ1IsUUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7O0FBRWIsUUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0dBQ3BCOztZQU5rQixXQUFXOztlQUFYLFdBQVc7QUFROUIsZ0JBQVk7YUFBQSxzQkFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O0FBRXhCLGVBQVc7YUFBQSx1QkFBRyxFQUFFOzs7O1NBVkcsV0FBVztHQUFTLE1BQU0sQ0FBQyxZQUFZOztpQkFBdkMsV0FBVzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFOekIsV0FBVywyQkFBTSxnQkFBZ0I7O0lBQ2pDLFNBQVMsMkJBQU0sY0FBYzs7QUFHcEMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7Ozs7OztJQU1iLFFBQVE7QUFDaEIsV0FEUSxRQUFRLEdBQ0o7UUFBWCxFQUFFLGdDQUFHLElBQUk7OzBCQURGLFFBQVE7O0FBRXpCLHFDQUZpQixRQUFRLDZDQUVuQixJQUFJLEVBQUU7R0FDYjs7WUFIa0IsUUFBUTs7ZUFBUixRQUFRO0FBSzNCLGdCQUFZO2FBQUEsc0JBQUMsSUFBSSxFQUFFLENBQUMsRUFBRTtBQUNwQixZQUFNLEtBQUssR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRXJDLGFBQUssQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztBQUM1QixhQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDMUIsYUFBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3hCLGFBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUMxQixhQUFLLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU1QyxlQUFPLEtBQUssQ0FBQztPQUNkOztBQUVELGVBQVc7YUFBQSx1QkFBRzs7O0FBQ1osWUFBTSxTQUFTLEdBQUcsVUFBQyxDQUFDLEVBQUs7QUFDdkIsY0FBSSxLQUFLLEdBQUcsTUFBSyxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVDLGdCQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDM0IsQ0FBQzs7QUFFRixZQUFNLE9BQU8sR0FBRyxVQUFDLENBQUMsRUFBSztBQUNyQixjQUFJLEtBQUssR0FBRyxNQUFLLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUMsZ0JBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUMzQixDQUFDOztBQUVGLFlBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUM5QixZQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7T0FDM0I7Ozs7U0E5QmtCLFFBQVE7R0FBUyxXQUFXOztpQkFBNUIsUUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFWdEIsV0FBVywyQkFBTSxnQkFBZ0I7O0lBQ2pDLFNBQVMsMkJBQU0sY0FBYzs7QUFHcEMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7Ozs7Ozs7SUFNYixPQUFPOzs7OztBQUlmLFdBSlEsT0FBTyxDQUlkLEVBQUUsOENBQThDOzBCQUp6QyxPQUFPOztBQUt4QixxQ0FMaUIsT0FBTyw2Q0FLbEIsRUFBRSxFQUFFOzs7QUFHVixRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztBQUMzQixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztHQUN2Qjs7WUFWa0IsT0FBTzs7ZUFBUCxPQUFPO0FBZTFCLGdCQUFZOzs7Ozs7YUFBQSxzQkFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFO0FBQ3BCLFlBQU0sS0FBSyxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFckMsWUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLGFBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNoQixhQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDaEIsWUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDZixZQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQztBQUNmLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVqQixlQUFPLEtBQUssQ0FBQztPQUNkOztBQU1ELHdCQUFvQjs7Ozs7OzthQUFBLDhCQUFDLENBQUMsRUFBRTs7QUFFdEIsWUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1YsWUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1YsWUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQ25ELFlBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUM7QUFDekUsWUFBTSxTQUFTLEdBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQzs7O0FBR3ZFLFlBQUksQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFO0FBQ3RCLFdBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ1osV0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7U0FDYixNQUFNLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFOztBQUVqQyxXQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUM7QUFDM0IsV0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO1NBQzNCOzs7QUFHRCxTQUFDLEdBQUcsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFBLEFBQUMsQ0FBQztBQUN2QyxTQUFDLEdBQUcsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxHQUFHLEdBQUksU0FBUyxDQUFBLEFBQUUsQ0FBQzs7OztBQUl2QyxlQUFPLEVBQUUsQ0FBQyxFQUFELENBQUMsRUFBRSxDQUFDLEVBQUQsQ0FBQyxFQUFFLENBQUM7T0FDakI7O0FBRUQsZUFBVzthQUFBLHFCQUFDLENBQUMsRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFO0FBQ3hDLFlBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFBRSxpQkFBTztTQUFFO0FBQzlDLFNBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLFNBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDOztBQUV6QixZQUFNLElBQUksR0FBRyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdELFlBQU0sR0FBRyxHQUFJLGNBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0QsWUFBTSxLQUFLLEdBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUQsWUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTVELFNBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLEdBQUcsRUFBSCxHQUFHLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUM7T0FDdkM7O0FBT0QsZUFBVzs7Ozs7Ozs7YUFBQSx1QkFBRzs7O0FBQ1osWUFBTSxXQUFXLEdBQUcsVUFBQyxDQUFDLEVBQUs7O0FBRXpCLGdCQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDeEMsY0FBTSxLQUFLLEdBQUcsTUFBSyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVoRCxnQkFBSyxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLGdCQUFLLGNBQWMsR0FBRyxLQUFLLENBQUM7QUFDNUIsZ0JBQUssU0FBUyxHQUFHLEtBQUssQ0FBQzs7QUFFdkIsZ0JBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3pELGdCQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFckQsZ0JBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUMzQixDQUFDOztBQUVGLFlBQU0sV0FBVyxHQUFHLFVBQUMsQ0FBQyxFQUFLO0FBQ3pCLGNBQUksS0FBSyxHQUFHLE1BQUssWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM5QyxnQkFBSyxXQUFXLENBQUMsS0FBSyxFQUFFLE1BQUssY0FBYyxFQUFFLE1BQUssU0FBUyxDQUFDLENBQUM7O0FBRTdELGdCQUFLLFNBQVMsR0FBRyxLQUFLLENBQUM7O0FBRXZCLGdCQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDM0IsQ0FBQzs7QUFFRixZQUFNLFNBQVMsR0FBRyxVQUFDLENBQUMsRUFBSztBQUN2QixjQUFJLEtBQUssR0FBRyxNQUFLLFlBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUMsZ0JBQUssV0FBVyxDQUFDLEtBQUssRUFBRSxNQUFLLGNBQWMsRUFBRSxNQUFLLFNBQVMsQ0FBQyxDQUFDOztBQUU3RCxnQkFBSyxXQUFXLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLGdCQUFLLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFDM0IsZ0JBQUssU0FBUyxHQUFHLElBQUksQ0FBQzs7QUFFdEIsZ0JBQU0sQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDckQsZ0JBQU0sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7O0FBRWpELGdCQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDM0IsQ0FBQzs7QUFFRixZQUFNLE9BQU8sR0FBRyxVQUFDLENBQUMsRUFBSztBQUNyQixjQUFJLEtBQUssR0FBRyxNQUFLLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUMsZ0JBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUMzQixDQUFDOztBQUVGLFlBQU0sVUFBVSxHQUFHLFVBQUMsQ0FBQyxFQUFLO0FBQ3hCLGNBQUksS0FBSyxHQUFHLE1BQUssWUFBWSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3QyxnQkFBSyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzNCLENBQUM7OztBQUdGLFlBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxRCxZQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbEQsWUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQ3pEOzs7O1NBbElrQixPQUFPO0dBQVMsV0FBVzs7aUJBQTNCLE9BQU87Ozs7Ozs7OztJQVJQLFNBQVMsR0FDakIsU0FEUSxTQUFTLENBQ2hCLElBQUksRUFBRSxhQUFhLEVBQUU7d0JBRGQsU0FBUzs7QUFFMUIsTUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsTUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7O0FBRW5DLE1BQUksQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztBQUNuQyxNQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUM7Q0FDbEQ7O2lCQVBrQixTQUFTOzs7Ozs7Ozs7Ozs7Ozs7OztJQUZ2QixNQUFNLDJCQUFNLFVBQVU7O0lBR1IsZUFBZTtXQUFmLGVBQWU7MEJBQWYsZUFBZTs7Ozs7OztZQUFmLGVBQWU7O2VBQWYsZUFBZTtBQUNsQyxnQkFBWTthQUFBLHdCQUFHO0FBQUUsZUFBTyxrQkFBa0IsQ0FBQztPQUFFOztBQUU3QyxvQkFBZ0I7YUFBQSw0QkFBRztBQUNqQixZQUFJLElBQUksb0NBSlMsZUFBZSxpREFJRyxDQUFDO0FBQ3BDLFlBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3RCLGVBQU8sSUFBSSxDQUFDO09BQ2I7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFO0FBQ3ZCLFlBQUksQ0FBQyxHQUFHLG9DQVZTLGVBQWUsd0NBVVIsZ0JBQWdCLENBQUMsQ0FBQztBQUMxQyxZQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7O0FBRXZDLFlBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3hELFlBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDMUMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMxQyxZQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyw4QkFBNEIsTUFBTSxPQUFJLENBQUM7QUFDbkYsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztBQUNwQyxZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDO0FBQzNDLFlBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7QUFDcEMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQztBQUN6QyxZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7QUFDNUMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQzs7QUFFdEMsWUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVsQyxlQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7T0FDakI7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDckMseUNBOUJpQixlQUFlLHdDQThCbkIsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTs7QUFFN0MsWUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUMxQzs7OztTQWpDa0IsZUFBZTtHQUFTLE1BQU07O2lCQUE5QixlQUFlOzs7Ozs7Ozs7Ozs7Ozs7OztJQUg3QixPQUFPLDJCQUFNLFdBQVc7O0lBR1YsZ0JBQWdCO1dBQWhCLGdCQUFnQjswQkFBaEIsZ0JBQWdCOzs7Ozs7O1lBQWhCLGdCQUFnQjs7ZUFBaEIsZ0JBQWdCO0FBQ25DLGdCQUFZO2FBQUEsd0JBQUc7QUFBRSxlQUFPLG1CQUFtQixDQUFDO09BQUU7O0FBRTlDLG9CQUFnQjthQUFBLDRCQUFHO0FBQ2pCLFlBQUksSUFBSSxvQ0FKUyxnQkFBZ0IsaURBSUUsQ0FBQztBQUNwQyxZQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztBQUN0QixlQUFPLElBQUksQ0FBQztPQUNiOztBQUVELFVBQU07YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRTtBQUN2QixZQUFJLENBQUMsR0FBRyxvQ0FWUyxnQkFBZ0Isd0NBVVQsZ0JBQWdCLENBQUMsQ0FBQztBQUMxQyxZQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7O0FBRXZDLFlBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3hELFlBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMxQyxZQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyw4QkFBNEIsTUFBTSxPQUFJLENBQUM7QUFDbkYsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztBQUNwQyxZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDO0FBQzNDLFlBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7QUFDcEMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQztBQUN6QyxZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7QUFDNUMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQzs7QUFFdEMsWUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVsQyxlQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7T0FDakI7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDckMseUNBOUJpQixnQkFBZ0Isd0NBOEJwQixnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFOztBQUU3QyxZQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQzFDOzs7O1NBakNrQixnQkFBZ0I7R0FBUyxPQUFPOztpQkFBaEMsZ0JBQWdCOzs7Ozs7Ozs7Ozs7O0lBSDlCLEVBQUUsMkJBQU0sbUJBQW1COzs7OztJQU1iLFNBQVM7Ozs7O0FBSWpCLFdBSlEsU0FBUyxHQUlGO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFKTCxTQUFTOztBQUsxQixRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztBQUNoQixRQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNiLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRTlELFFBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0FBQzFDLFFBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxRQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDdEM7O2VBWmtCLFNBQVM7QUFjNUIsZ0JBQVk7YUFBQSx3QkFBRztBQUNiLGVBQU8sRUFBRSxDQUFDO09BQ1g7O0FBS0QsV0FBTzs7Ozs7O2FBQUEsbUJBQUc7O0FBRVIsWUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7T0FDakI7O0FBS0QsZ0JBQVk7Ozs7OzthQUFBLHdCQUFHO0FBQUUsZUFBTyxPQUFPLENBQUM7T0FBRTs7QUFXbEMsb0JBQWdCOzs7Ozs7Ozs7Ozs7YUFBQSw0QkFBRztBQUFFLGVBQU8sRUFBRSxDQUFDO09BQUU7O0FBTWpDLFdBQU87Ozs7OzthQUFBLGlCQUFDLFNBQVMsRUFBRTtBQUNqQixhQUFLLElBQUksR0FBRyxJQUFJLFNBQVMsRUFBRTtBQUFFLGNBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7U0FBRTtPQUMzRDs7QUFNRCxvQkFBZ0I7Ozs7Ozs7YUFBQSwwQkFBQyxTQUFTLEVBQUU7QUFDMUIsWUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7O0FBRXJCLFlBQU0sS0FBSyxHQUFHLE1BQUEsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7OztBQUkxQyxjQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3ZDLGNBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUFFLG1CQUFPO1dBQUU7O0FBRTNDLGdCQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7QUFDakMsZUFBRyxFQUFFLGVBQVc7QUFBRSxxQkFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQUU7QUFDakQsZUFBRyxFQUFFLGFBQVMsSUFBSSxFQUFFO0FBQ2xCLGtCQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQzthQUM5QjtXQUNGLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztPQUNKOztBQU1ELHdCQUFvQjs7Ozs7OzthQUFBLDhCQUFDLFNBQVMsRUFBRTs7O0FBQzlCLGNBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDdkMsY0FBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JDLGNBQUksUUFBUSxHQUFHLGtCQUFTLENBQUMsRUFBWTtnQkFBVixDQUFDLGdDQUFHLElBQUk7O0FBQ2pDLGdCQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7QUFBRSxxQkFBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksWUFBWSxDQUFDO2FBQUU7QUFDbkQsYUFBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztXQUNiLENBQUM7O0FBRUYsZ0JBQUssSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDO1NBQ3ZCLENBQUMsQ0FBQztPQUNKOztBQU1ELFVBQU07Ozs7Ozs7YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRSxFQUFFOztBQWEzQixVQUFNOzs7Ozs7Ozs7Ozs7OzthQUFBLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTs7QUFPekMsVUFBTTs7Ozs7Ozs7YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7Ozs7U0FqSC9CLFNBQVM7OztpQkFBVCxTQUFTOzs7Ozs7Ozs7Ozs7O0lBTnZCLFNBQVMsMkJBQU0sY0FBYzs7SUFDN0IsRUFBRSwyQkFBTSxtQkFBbUI7O0lBR2IsTUFBTTtXQUFOLE1BQU07MEJBQU4sTUFBTTs7Ozs7OztZQUFOLE1BQU07O2VBQU4sTUFBTTtBQUN6QixnQkFBWTthQUFBLHdCQUFHO0FBQUUsZUFBTyxRQUFRLENBQUM7T0FBRTs7QUFFbkMsb0JBQWdCO2FBQUEsNEJBQUc7QUFDakIsZUFBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztPQUNqQjs7QUFFRCxnQkFBWTthQUFBLHdCQUFHO0FBQ2IsZUFBTztBQUNMLGVBQUssRUFBRSxTQUFTO0FBQ2hCLGlCQUFPLEVBQUUsQ0FBQztTQUNYLENBQUM7T0FDSDs7QUFFRCxVQUFNO2FBQUEsZ0JBQUMsZ0JBQWdCLEVBQUU7QUFDdkIsWUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQUUsaUJBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUFFOztBQUVsQyxZQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2hELFlBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEMsWUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QyxZQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdELFlBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxZQUFZLENBQUMsQ0FBQzs7QUFFL0QsZUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO09BQ2pCOztBQUVELFVBQU07YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ3JDLFlBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdEQsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7O0FBRWhDLFlBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLGlCQUFlLENBQUMsVUFBTyxDQUFDO0FBQ2pFLFlBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7T0FDL0I7O0FBR0QsVUFBTTs7OzthQUFBLGtCQUFHO0FBQUUsZUFBTyxLQUFLLENBQUM7T0FBRTs7OztTQW5DUCxNQUFNO0dBQVMsU0FBUzs7aUJBQXhCLE1BQU07Ozs7Ozs7Ozs7Ozs7SUFKcEIsU0FBUywyQkFBTSxjQUFjOztJQUdmLEdBQUc7V0FBSCxHQUFHOzBCQUFILEdBQUc7Ozs7Ozs7WUFBSCxHQUFHOztlQUFILEdBQUc7QUFDdEIsZ0JBQVk7YUFBQSx3QkFBRztBQUFFLGVBQU8sS0FBSyxDQUFDO09BQUU7O0FBR2hDLG9CQUFnQjs7OzthQUFBLDRCQUFHO0FBQ2pCLGVBQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUM7T0FDakQ7O0FBRUQsVUFBTTthQUFBLGtCQUFHO0FBQ1AsWUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQUUsaUJBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUFFOztBQUVsQyxZQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQzs7QUFFdkQsZUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO09BQ2pCOztBQUVELFVBQU07YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ3JDLFlBQU0sRUFBRSxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDeEQsWUFBTSxFQUFFLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN6RCxZQUFNLENBQUMsR0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3pCLFlBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRWhDLFlBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLGlCQUFlLEVBQUUsVUFBSyxFQUFFLE9BQUksQ0FBQztBQUN0RSxZQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLFlBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7T0FDN0I7O0FBR0QsVUFBTTs7OzthQUFBLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDOUMsWUFBTSxFQUFFLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN4RCxZQUFNLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUV6RCxZQUFJLEFBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQSxBQUFDLEVBQUU7QUFDaEQsaUJBQU8sSUFBSSxDQUFDO1NBQ2I7O0FBRUQsZUFBTyxLQUFLLENBQUM7T0FDZDs7OztTQXJDa0IsR0FBRztHQUFTLFNBQVM7O2lCQUFyQixHQUFHOzs7Ozs7Ozs7Ozs7O0lBSGpCLFNBQVMsMkJBQU0sY0FBYzs7SUFHZixJQUFJO1dBQUosSUFBSTswQkFBSixJQUFJOzs7Ozs7O1lBQUosSUFBSTs7ZUFBSixJQUFJO0FBQ3ZCLGdCQUFZO2FBQUEsd0JBQUc7QUFBRSxlQUFPLE1BQU0sQ0FBQztPQUFFOztBQUVqQyxvQkFBZ0I7YUFBQSw0QkFBRztBQUNqQixlQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7T0FDekI7O0FBRUQsZ0JBQVk7YUFBQSx3QkFBRztBQUNiLGVBQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUM7T0FDN0I7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFO0FBQ3ZCLFlBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUFFLGlCQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7U0FBRTs7QUFFbEMsWUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRXJELGVBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztPQUNqQjs7QUFFRCxVQUFNO2FBQUEsZ0JBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFOzs7QUFDN0IsWUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckIsWUFBSSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO2lCQUFLLE1BQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7U0FBQSxDQUFDLENBQUM7O0FBRXRELFlBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzVFLFlBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUMxQyxZQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDOztBQUU3QixZQUFJLEdBQUcsSUFBSSxDQUFDO09BQ2I7O0FBSUQsY0FBVTs7Ozs7YUFBQSxvQkFBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUU7OztBQUNqQyxZQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUFFLGlCQUFPLEVBQUUsQ0FBQztTQUFFOztBQUVoQyxZQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSyxFQUFFLEtBQUssRUFBSztBQUM1QyxjQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsTUFBSyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN2RCxjQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsTUFBSyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN4RCxzQkFBVSxDQUFDLFNBQUksQ0FBQyxDQUFHO1NBQ3BCLENBQUMsQ0FBQzs7QUFFSCxlQUFPLEdBQUcsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ3JDOzs7O1NBMUNrQixJQUFJO0dBQVMsU0FBUzs7aUJBQXRCLElBQUk7Ozs7Ozs7Ozs7Ozs7SUFIbEIsU0FBUywyQkFBTSxjQUFjOztJQUdmLE1BQU07V0FBTixNQUFNOzBCQUFOLE1BQU07Ozs7Ozs7WUFBTixNQUFNOztlQUFOLE1BQU07QUFDekIsZ0JBQVk7YUFBQSx3QkFBRztBQUFFLGVBQU8sUUFBUSxDQUFDO09BQUU7O0FBRW5DLG9CQUFnQjthQUFBLDRCQUFHO0FBQ2pCLGVBQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQztPQUNuQzs7QUFFRCxnQkFBWTthQUFBLHdCQUFHO0FBQ2IsZUFBTztBQUNMLHNCQUFZLEVBQUUsQ0FBQztBQUNmLHVCQUFhLEVBQUUsRUFBRTtBQUNqQix3QkFBYyxFQUFFLElBQUk7QUFDcEIsaUJBQU8sRUFBRSxDQUFDO1NBQ1gsQ0FBQztPQUNIOztBQUVELFVBQU07YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRTtBQUN2QixZQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFBRSxpQkFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO1NBQUU7O0FBRWxDLFlBQU0sTUFBTSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQzs7QUFFdkMsWUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDbEQsWUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7OztBQUd2RCxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEMsWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QyxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2xELFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxlQUFlLENBQUMsQ0FBQzs7QUFFcEUsWUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVqQyxZQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFO0FBQzlCLGNBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUUxRCxjQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUEsR0FBSSxDQUFDLENBQUEsQUFBQyxDQUFDLENBQUM7QUFDL0UsY0FBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUM3RixjQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdEUsY0FBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3hFLGNBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxZQUFZLENBQUMsQ0FBQzs7QUFFcEUsY0FBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3JDOztBQUVELFlBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQzs7QUFFN0MsZUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO09BQ2pCOztBQUVELFVBQU07YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ3JDLFlBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQzVELFlBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRWhDLFlBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLGlCQUFlLENBQUMsVUFBTyxDQUFDO0FBQ2pFLFlBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7O0FBRTlCLFlBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUU7QUFDOUIsY0FBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztTQUNsQztPQUNGOztBQUVELFVBQU07YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFOztBQUU5QyxZQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3RELFlBQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQSxHQUFJLENBQUMsQ0FBQztBQUN2RCxZQUFNLE9BQU8sR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7QUFDbkQsWUFBTSxPQUFPLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDO0FBQ3BFLFlBQU0sT0FBTyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQzs7QUFFeEMsWUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUM1RSxZQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQzVFLFlBQU0sSUFBSSxHQUFHLFFBQVEsR0FBRyxRQUFRLENBQUM7O0FBRWpDLGVBQU8sSUFBSSxHQUFHLENBQUMsQ0FBQztPQUNqQjs7OztTQTNFa0IsTUFBTTtHQUFTLFNBQVM7O2lCQUF4QixNQUFNOzs7Ozs7Ozs7Ozs7O0lBSHBCLFNBQVMsMkJBQU0sY0FBYzs7SUFHZixPQUFPO1dBQVAsT0FBTzswQkFBUCxPQUFPOzs7Ozs7O1lBQVAsT0FBTzs7ZUFBUCxPQUFPO0FBQzFCLGdCQUFZO2FBQUEsd0JBQUc7QUFBRSxlQUFPLFNBQVMsQ0FBQztPQUFFOztBQUVwQyxvQkFBZ0I7YUFBQSw0QkFBRztBQUNqQixlQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQztPQUMxRTs7QUFFRCxnQkFBWTthQUFBLHdCQUFHO0FBQ2IsZUFBTztBQUNMLHlCQUFlLEVBQUUsSUFBSTtBQUNyQixzQkFBWSxFQUFFLENBQUM7QUFDZix3QkFBYyxFQUFFLEdBQUc7QUFDbkIsaUJBQU8sRUFBRSxHQUFHO1NBQ2IsQ0FBQztPQUNIOztBQUVELFVBQU07YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRTtBQUN2QixZQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFBRSxpQkFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO1NBQUU7O0FBRWxDLFlBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUVsRCxZQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMxRCxZQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkMsWUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQ2xELFlBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxZQUFZLENBQUMsQ0FBQzs7QUFFcEUsWUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVwQyxZQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFO0FBQy9CLGNBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzlELGNBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDbkQsY0FBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzFFLGNBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUN4RSxjQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUM7QUFDN0QsY0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQzs7QUFFN0MsY0FBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDL0QsY0FBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyRCxjQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDM0UsY0FBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ3pFLGNBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQztBQUM5RCxjQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDOztBQUU5QyxjQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDeEMsY0FBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQzFDOztBQUVELGVBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztPQUNqQjs7QUFFRCxVQUFNO2FBQUEsZ0JBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUNyQyxZQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3RELFlBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdkQsWUFBTSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUM5RCxZQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLFlBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEMsWUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFcEMsWUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsaUJBQWUsQ0FBQyxVQUFLLENBQUMsT0FBSSxDQUFDO0FBQ3BFLFlBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7O0FBRWpDLFlBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoRSxZQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3JELFlBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7O0FBRWpDLFlBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUU7O0FBRS9CLGNBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDekQsY0FBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3ZFLGNBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7O0FBRXJDLGNBQU0scUJBQXFCLG1CQUFnQixLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUEsU0FBTSxDQUFDO0FBQ2xGLGNBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDMUQsY0FBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0FBQzVFLGNBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7U0FDdkM7T0FDRjs7QUFFRCxVQUFNO2FBQUEsZ0JBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUM5QyxZQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQzVELFlBQU0sT0FBTyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNoRixZQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQzdELFlBQU0sT0FBTyxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O0FBR2xGLFlBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDNUUsWUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUM1RSxZQUFNLElBQUksR0FBRyxRQUFRLEdBQUcsUUFBUSxDQUFDOztBQUVqQyxlQUFPLElBQUksR0FBRyxDQUFDLENBQUM7T0FDakI7Ozs7U0ExRmtCLE9BQU87R0FBUyxTQUFTOztpQkFBekIsT0FBTzs7Ozs7Ozs7Ozs7OztJQUhyQixTQUFTLDJCQUFNLGNBQWM7O0lBR2YsV0FBVztXQUFYLFdBQVc7MEJBQVgsV0FBVzs7Ozs7OztZQUFYLFdBQVc7O2VBQVgsV0FBVztBQUM5QixnQkFBWTthQUFBLHdCQUFHO0FBQUUsZUFBTyxjQUFjLENBQUM7T0FBRTs7QUFFekMsb0JBQWdCO2FBQUEsNEJBQUc7QUFDakIsZUFBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUM7T0FDcEM7O0FBRUQsZ0JBQVk7YUFBQSx3QkFBRztBQUNiLGVBQU87QUFDTCxvQkFBVSxFQUFFLFdBQVc7QUFDdkIsbUJBQVMsRUFBRSxTQUFTO0FBQ3BCLHFCQUFXLEVBQUUsSUFBSTtTQUNsQixDQUFDO09BQ0g7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFO0FBQ3ZCLFlBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUFFLGlCQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7U0FBRTtBQUNsQyxZQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFbEQsWUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDeEQsWUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs7QUFHbEMsWUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRTtBQUMzQixjQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN2RCxjQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbEM7O0FBRUQsZUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO09BQ2pCOztBQUVELFVBQU07YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUU7Ozs7QUFFN0IsWUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckIsWUFBSSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO2lCQUFLLE1BQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7U0FBQSxDQUFDLENBQUM7O0FBRXBELFlBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUU7QUFDM0IsY0FBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbEYsY0FBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pFLGNBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDakQ7O0FBRUQsWUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDcEYsWUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNuRCxZQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDakUsWUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFbkQsWUFBSSxHQUFHLElBQUksQ0FBQztPQUNiOztBQUVELGtCQUFjO2FBQUEsd0JBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFOzs7QUFDckMsWUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLLEVBQUs7QUFDNUMsY0FBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLE1BQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdEQsY0FBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLE1BQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDMUQsc0JBQVUsQ0FBQyxTQUFJLENBQUMsQ0FBRztTQUNwQixDQUFDLENBQUM7O0FBRUgsZUFBTyxHQUFHLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUNyQzs7QUFFRCxtQkFBZTthQUFBLHlCQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRTtBQUN0QyxZQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDOztBQUUzQixZQUFJLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUMzQixZQUFJLGVBQWUsR0FBRyxFQUFFLENBQUM7O0FBRXpCLGFBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDL0IsY0FBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLGNBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUIsY0FBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXhDLGNBQU0sQ0FBQyxHQUFJLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdkQsY0FBTSxFQUFFLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsQ0FBQztBQUMzRCxjQUFNLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFDOztBQUUzRCxjQUFNLEtBQUssUUFBTSxDQUFDLFNBQUksRUFBRSxBQUFFLENBQUM7QUFDM0IsY0FBTSxHQUFHLFFBQVEsQ0FBQyxTQUFJLEVBQUUsQUFBRSxDQUFDOztBQUUzQiwyQkFBaUIsR0FBRyxpQkFBaUIsS0FBSyxFQUFFLEdBQzFDLEtBQUssUUFBTSxpQkFBaUIsU0FBSSxLQUFLLEFBQUUsQ0FBQzs7QUFFMUMseUJBQWUsR0FBRyxlQUFlLEtBQUssRUFBRSxHQUN0QyxHQUFHLFFBQU0sR0FBRyxTQUFJLGVBQWUsQUFBRSxDQUFDO1NBQ3JDOztBQUVELFlBQUksWUFBWSxTQUFPLGlCQUFpQixTQUFJLGVBQWUsTUFBRyxDQUFDO0FBQy9ELGVBQU8sWUFBWSxDQUFDO09BQ3JCOzs7O1NBdkZrQixXQUFXO0dBQVMsU0FBUzs7aUJBQTdCLFdBQVc7Ozs7Ozs7Ozs7Ozs7SUFIekIsU0FBUywyQkFBTSxjQUFjOztJQUdmLFNBQVM7V0FBVCxTQUFTOzBCQUFULFNBQVM7Ozs7Ozs7WUFBVCxTQUFTOztlQUFULFNBQVM7QUFDNUIsZ0JBQVk7YUFBQSx3QkFBRztBQUFFLGVBQU8sWUFBWSxDQUFDO09BQUU7O0FBRXZDLG9CQUFnQjthQUFBLDRCQUFHO0FBQ2pCLGVBQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDO09BQ3BDOztBQUVELGdCQUFZO2FBQUEsd0JBQUc7QUFDYixlQUFPO0FBQ0wsb0JBQVUsRUFBRSxDQUFDO0FBQ2IscUJBQVcsRUFBRSxDQUFDO0FBQ2QsbUJBQVMsRUFBRSxTQUFTO0FBQ3BCLG9CQUFVLEVBQUUsV0FBVztTQUN4QixDQUFDO09BQ0g7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFO0FBQ3ZCLFlBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUFFLGlCQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7U0FBRTs7QUFFbEMsWUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRWxELFlBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3pELFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM3RCxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakUsWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztBQUN2RCxZQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRWpDLFlBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3hELFlBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM1RCxZQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDakUsWUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztBQUN0RCxZQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRS9CLFlBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3hELFlBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM1RCxZQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDakUsWUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztBQUN0RCxZQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRS9CLFlBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNqQyxZQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEMsWUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVoQyxlQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7T0FDakI7O0FBR0QsVUFBTTs7OzthQUFBLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDckMsWUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5QixZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hDLFlBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXhCLFlBQU0sT0FBTyxRQUFNLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQUFBRSxDQUFDO0FBQ3pELFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLG9CQUFrQixPQUFPLE9BQUksQ0FBQzs7QUFFekUsWUFBTSxTQUFTLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUM1QixZQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFDO0FBQzVELFlBQU0sR0FBRyxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUM7QUFDNUQsWUFBTSxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUU3QyxZQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxvQkFBa0IsR0FBRyxPQUFJLENBQUM7QUFDcEUsWUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsb0JBQWtCLEdBQUcsT0FBSSxDQUFDO0FBQ3BFLFlBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLGlCQUFlLElBQUksVUFBTyxDQUFDO09BQ3JFOztBQUVELFVBQU07YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQzlDLFlBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdEQsWUFBTSxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUM3RCxZQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQy9ELFlBQU0sR0FBRyxHQUFHLElBQUksR0FBSSxLQUFLLEdBQUcsQ0FBQyxBQUFDLENBQUM7QUFDL0IsWUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFJLEtBQUssR0FBRyxDQUFDLEFBQUMsQ0FBQzs7QUFFL0IsWUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssR0FBRyxHQUFHLEVBQUUsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFBLEFBQUMsRUFBRTtBQUM5QyxpQkFBTyxJQUFJLENBQUM7U0FDYjs7QUFFRCxlQUFPLEtBQUssQ0FBQztPQUNkOzs7O1NBN0VrQixTQUFTO0dBQVMsU0FBUzs7aUJBQTNCLFNBQVM7Ozs7Ozs7Ozs7Ozs7SUFIdkIsU0FBUywyQkFBTSxjQUFjOztBQUdwQyxJQUFNLE9BQU8sR0FBRyw4QkFBOEIsQ0FBQzs7Ozs7Ozs7Ozs7OztJQWExQixRQUFRO1dBQVIsUUFBUTswQkFBUixRQUFROzs7Ozs7O1lBQVIsUUFBUTs7ZUFBUixRQUFRO0FBQzNCLGdCQUFZO2FBQUEsd0JBQUc7QUFBRSxlQUFPLFVBQVUsQ0FBQztPQUFFOztBQUVyQyxvQkFBZ0I7YUFBQSw0QkFBRztBQUNqQixlQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO09BQ2pCOztBQUVELGdCQUFZO2FBQUEsd0JBQUc7QUFDYixlQUFPO0FBQ0wsb0JBQVUsRUFBRSxLQUFLO0FBQ2pCLGVBQUssRUFBRSxTQUFTO0FBQ2hCLGlCQUFPLEVBQUUsQ0FBQztBQUNWLDJCQUFpQixFQUFFLEtBQUs7QUFBQSxTQUN6QixDQUFDO09BQ0g7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFO0FBQ3ZCLFlBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUFFLGlCQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7U0FBRTs7QUFFbEMsWUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixLQUFLLEtBQUssRUFBRTs7QUFFM0MsY0FBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDckQsY0FBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM5QyxjQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDL0QsY0FBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNELGNBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztTQUU5QyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsS0FBSyxRQUFRLEVBQUU7O0FBRXJELGNBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQzlELGNBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0QsY0FBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFakUsY0FBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7O0FBRWpFLGNBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQyxjQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDO0FBQ2hELGNBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7O0FBRWxELGNBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzlCOztBQUVELGVBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztPQUNqQjs7QUFFRCxVQUFNO2FBQUEsZ0JBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTs7OztBQUVyQyxZQUFNLFdBQVcsR0FBRyxLQUFLLFlBQVksWUFBWSxHQUFHLFVBQVUsR0FBRyxPQUFPLENBQUM7QUFDekUsWUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUNoQyxZQUFNLFFBQVEsR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7QUFDckQsWUFBTSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3JELFlBQU0sZUFBZSxHQUFHLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDM0MsWUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDOztBQUVoQixhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQy9CLGNBQU0sU0FBUyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekQsY0FBTSxXQUFXLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDOztBQUV2RCxjQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsV0FBVyxFQUFFLFdBQVcsR0FBRyxlQUFlLENBQUMsQ0FBQztBQUMvRSxjQUFJLEdBQUcsR0FBRyxRQUFRLENBQUM7QUFDbkIsY0FBSSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDcEIsZUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDdkMsZ0JBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QixnQkFBSSxNQUFNLEdBQUcsR0FBRyxFQUFFO0FBQUUsaUJBQUcsR0FBRyxNQUFNLENBQUM7YUFBRTtBQUNuQyxnQkFBSSxNQUFNLEdBQUcsR0FBRyxFQUFFO0FBQUUsaUJBQUcsR0FBRyxNQUFNLENBQUM7YUFBRTtXQUNwQzs7QUFFRCxhQUFHLEdBQUcsQUFBQyxHQUFHLEtBQUssUUFBUSxJQUFJLEdBQUcsS0FBSyxDQUFDLFFBQVEsR0FBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3hELGFBQUcsR0FBRyxBQUFDLEdBQUcsS0FBSyxRQUFRLElBQUksR0FBRyxLQUFLLENBQUMsUUFBUSxHQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7O0FBRXhELGdCQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3REOztBQUVELFlBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNkLFlBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQzs7O0FBR2QsWUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixLQUFLLEtBQUssRUFBRTs7QUFFM0MsY0FBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLLEVBQUs7QUFDOUMsZ0JBQU0sQ0FBQyxHQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2hFLGdCQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxNQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlFLGdCQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxNQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUU5RSx3QkFBVSxDQUFDLFNBQUksRUFBRSxTQUFJLENBQUMsU0FBSSxFQUFFLENBQUc7V0FDaEMsQ0FBQyxDQUFDOztBQUVILGNBQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDLGNBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FFdkMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEtBQUssUUFBUSxFQUFFOztBQUVyRCxjQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQy9CLGNBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFdEMsY0FBSSxTQUFTLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUM1RCxnQkFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1dBQ3REOztBQUVELGNBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQzFDLGNBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQzVDLGNBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFcEYsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDeEIsZ0JBQU0sQ0FBQyxHQUFJLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEQsZ0JBQU0sRUFBRSxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxNQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwRSxnQkFBTSxFQUFFLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLE1BQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVwRSxrQkFBSyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN4QixrQkFBSyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztXQUN6QixDQUFDLENBQUM7O0FBRUgsY0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNwQjtPQUNGOzs7O1NBbEhrQixRQUFRO0dBQVMsU0FBUzs7aUJBQTFCLFFBQVE7Ozs7Ozs7Ozs7Ozs7O0lBWFIsU0FBUztBQUNqQixXQURRLFNBQVMsQ0FDaEIsUUFBUSxFQUFnQjtRQUFkLE9BQU8sZ0NBQUcsRUFBRTs7MEJBRGYsU0FBUzs7QUFFMUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7R0FDMUI7O2VBSGtCLFNBQVM7QUFReEIsVUFBTTs7Ozs7O1dBQUEsWUFBRztBQUNYLGVBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7T0FDN0I7O0FBS0csVUFBTTs7Ozs7O1dBQUEsWUFBRztBQUNYLGVBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO09BQ3BDOztBQUtELFNBQUs7Ozs7OzthQUFBLGlCQUFHLEVBQUU7O0FBS1YsUUFBSTs7Ozs7O2FBQUEsZ0JBQUcsRUFBRTs7QUFNVCxlQUFXOzs7Ozs7O2FBQUEscUJBQUMsQ0FBQyxFQUFFLEVBQUU7Ozs7U0FqQ0UsU0FBUzs7O2lCQUFULFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBTHZCLEVBQUUsMkJBQU0sbUJBQW1COztJQUMzQixTQUFTLDJCQUFNLGNBQWM7Ozs7Ozs7O0lBUWYsY0FBYztBQUN0QixXQURRLGNBQWMsQ0FDckIsUUFBUSxFQUFFOzBCQURILGNBQWM7O0FBRS9CLHFDQUZpQixjQUFjLDZDQUV6QixRQUFRLEVBQUU7R0FDakI7O1lBSGtCLGNBQWM7O2VBQWQsY0FBYztBQUtqQyxlQUFXO2FBQUEscUJBQUMsQ0FBQyxFQUFFO0FBQ2IsZ0JBQU8sQ0FBQyxDQUFDLElBQUk7QUFDWCxlQUFLLFdBQVc7QUFDZCxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixrQkFBTTtBQUFBLEFBQ1IsZUFBSyxXQUFXO0FBQ2QsZ0JBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsa0JBQU07QUFBQSxBQUNSLGVBQUssU0FBUztBQUNaLGdCQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLGtCQUFNO0FBQUEsQUFDUixlQUFLLFNBQVM7QUFDWixnQkFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixrQkFBTTtBQUFBLFNBQ1Q7T0FDRjs7QUFFRCxlQUFXO2FBQUEscUJBQUMsQ0FBQyxFQUFFOzs7QUFDYixZQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNsQixZQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRWxCLFlBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQzdCLGNBQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7O0FBRXpDLGNBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ25ELGVBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkQsZUFBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ25DLGVBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztBQUM3QixlQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7O0FBRTFCLHNCQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVoQyxnQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzFCLENBQUMsQ0FBQztPQUNKOztBQUVELGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7O0FBRWIsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxQyxZQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVyQyxZQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBSztBQUM5QixlQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDM0MsZUFBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3BDLENBQUMsQ0FBQztPQUNKOztBQUVELGFBQVM7YUFBQSxtQkFBQyxDQUFDLEVBQUU7O0FBRVgsWUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDOUIsZUFBSyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDckMsQ0FBQyxDQUFDOzs7QUFHSCxZQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzNCLFlBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRWpCLFlBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQUUsaUJBQU87U0FBRTs7QUFFNUMsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNsRCxZQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFdEMsWUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RELFlBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFdkQsWUFBTSxhQUFhLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN4QyxZQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsR0FBRyxhQUFhLENBQUM7O0FBRTNELFlBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQztBQUNoQyxZQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7O0FBRTNCLFlBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDdEI7O0FBRUQsYUFBUzthQUFBLG1CQUFDLENBQUMsRUFBRTs7QUFFWCxZQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsT0FBTyxLQUFLLEVBQUUsRUFBRTtBQUNsQyxjQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDekIsY0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCLGNBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDdEI7T0FDRjs7OztTQXRGa0IsY0FBYztHQUFTLFNBQVM7O2lCQUFoQyxjQUFjOzs7Ozs7Ozs7Ozs7Ozs7OztJQVQ1QixPQUFPLDJCQUFNLFVBQVU7O0lBQ3ZCLFNBQVMsMkJBQU0sY0FBYzs7Ozs7Ozs7OztJQVVmLGlCQUFpQjtBQUN6QixXQURRLGlCQUFpQixDQUN4QixRQUFRLEVBQUU7MEJBREgsaUJBQWlCOztBQUVsQyxxQ0FGaUIsaUJBQWlCLDZDQUU1QixRQUFRLEVBQUU7QUFDaEIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7Ozs7O0FBS3pCLFFBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUM7QUFDckUsUUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQztHQUN6RTs7WUFWa0IsaUJBQWlCOztlQUFqQixpQkFBaUI7QUFZcEMsZUFBVzthQUFBLHFCQUFDLENBQUMsRUFBRTtBQUNiLGdCQUFPLENBQUMsQ0FBQyxJQUFJO0FBQ1gsZUFBSyxXQUFXO0FBQ2QsZ0JBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsa0JBQU07QUFBQSxBQUNSLGVBQUssV0FBVztBQUNkLGdCQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGtCQUFNO0FBQUEsQUFDUixlQUFLLFNBQVM7QUFDWixnQkFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixrQkFBTTtBQUFBLFNBQ1Q7T0FDRjs7QUFFRCxlQUFXO2FBQUEscUJBQUMsQ0FBQyxFQUFFO0FBQ2IsWUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7O0FBRXRCLFlBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztBQUNsRCxZQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVyQixZQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FDakMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQ3JCLEtBQUssQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDO09BQ3pDOztBQUVELGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7QUFDYixZQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGlCQUFPO1NBQUU7O0FBRWhDLFlBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO0FBQzlDLFlBQU0sY0FBYyxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFM0QsbUJBQVcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTFGLFlBQU0sYUFBYSxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRCxZQUFNLEtBQUssR0FBRyxhQUFhLEdBQUcsY0FBYyxDQUFDOzs7QUFHN0MsbUJBQVcsQ0FBQyxNQUFNLElBQUssS0FBSyxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQUFBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUFlckUsWUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDL0I7O0FBRUQsYUFBUzthQUFBLG1CQUFDLENBQUMsRUFBRTtBQUNYLFlBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO09BQ3hCOzs7O1NBckVrQixpQkFBaUI7R0FBUyxTQUFTOztpQkFBbkMsaUJBQWlCOzs7Ozs7Ozs7Ozs7Ozs7OztJQVgvQixTQUFTLDJCQUFNLGNBQWM7O0lBQzdCLG1CQUFtQiwyQkFBTSxvQ0FBb0M7O0lBRy9DLG1CQUFtQjtBQUMzQixXQURRLG1CQUFtQixDQUMxQixRQUFRLEVBQUU7MEJBREgsbUJBQW1COztBQUVwQyxxQ0FGaUIsbUJBQW1CLDZDQUU5QixRQUFRLEVBQUU7R0FDakI7O1lBSGtCLG1CQUFtQjs7ZUFBbkIsbUJBQW1CO0FBS3RDLGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7QUFDYixnQkFBTyxDQUFDLENBQUMsSUFBSTtBQUNYLGVBQUssV0FBVztBQUNkLGdCQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGtCQUFNO0FBQUEsQUFDUixlQUFLLFdBQVc7QUFDZCxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixrQkFBTTtBQUFBLEFBQ1IsZUFBSyxTQUFTO0FBQ1osZ0JBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsa0JBQU07QUFBQSxTQUNUO09BQ0Y7O0FBRUQsZUFBVzthQUFBLHFCQUFDLENBQUMsRUFBRTtBQUNiLFlBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLFlBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7QUFFOUIsYUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbEQsY0FBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QixjQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQzlCLGdCQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztBQUMxQixrQkFBTTtXQUNQO1NBQ0Y7T0FDRjs7QUFFRCxlQUFXO2FBQUEscUJBQUMsQ0FBQyxFQUFFO0FBQ2IsWUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQUUsaUJBQU87U0FBRTs7QUFFdEQsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztBQUNoQyxZQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDOzs7QUFHbEMsWUFBSSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFO0FBQzdCLGVBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3ZDLE1BQU07QUFDTCxlQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUMxQzs7QUFFRCxZQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDcEM7O0FBRUQsYUFBUzthQUFBLG1CQUFDLENBQUMsRUFBRTtBQUNYLFlBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLFlBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFlBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO09BQzFCOzs7O1NBcERrQixtQkFBbUI7R0FBUyxTQUFTOztpQkFBckMsbUJBQW1COzs7Ozs7Ozs7Ozs7Ozs7OztJQUpqQyxTQUFTLDJCQUFNLGNBQWM7Ozs7Ozs7SUFPZixZQUFZO0FBQ3BCLFdBRFEsWUFBWSxDQUNuQixRQUFRLEVBQUU7MEJBREgsWUFBWTs7QUFFN0IscUNBRmlCLFlBQVksNkNBRXZCLFFBQVEsRUFBRTs7QUFFaEIsUUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztBQUMvQixRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztHQUMzQjs7WUFOa0IsWUFBWTs7ZUFBWixZQUFZO0FBUS9CLFNBQUs7YUFBQSxpQkFBRyxFQUFFOztBQUNWLFFBQUk7YUFBQSxnQkFBRyxFQUFFOztBQUVULGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7QUFDYixnQkFBUSxDQUFDLENBQUMsSUFBSTtBQUNaLGVBQUssV0FBVztBQUNkLGdCQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGtCQUFNO0FBQUEsQUFDUixlQUFLLFdBQVc7QUFDZCxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixrQkFBTTtBQUFBLEFBQ1IsZUFBSyxTQUFTO0FBQ1osZ0JBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsa0JBQU07QUFBQSxTQUNUO09BQ0Y7O0FBRUQsZUFBVzthQUFBLHFCQUFDLENBQUMsRUFBRTtBQUNiLFlBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztPQUMvQjs7QUFFRCxlQUFXO2FBQUEscUJBQUMsQ0FBQyxFQUFFOzs7QUFDYixZQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBSztBQUM3QixjQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDOztBQUVsQyxlQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsTUFBSyxhQUFhLENBQUMsQ0FBQztBQUNsRCxlQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3JCLENBQUMsQ0FBQztPQUNKOztBQUVELGFBQVM7YUFBQSxtQkFBQyxDQUFDLEVBQUU7QUFDWCxZQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0FBQy9CLFlBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO09BQ3hCOzs7O1NBekNrQixZQUFZO0dBQVMsU0FBUzs7aUJBQTlCLFlBQVk7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBUDFCLFNBQVMsMkJBQU0sY0FBYzs7SUFDN0IsRUFBRSwyQkFBTSxtQkFBbUI7O0lBR2IsY0FBYztBQUN0QixXQURRLGNBQWMsQ0FDckIsUUFBUSxzQkFBc0I7MEJBRHZCLGNBQWM7O0FBRS9CLHFDQUZpQixjQUFjLDZDQUV6QixRQUFRLGlCQUFpQjs7QUFFL0IsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7O0FBRXpCLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFFBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDOztBQUV0QixRQUFJLENBQUMsc0JBQXNCLEdBQUcsVUFBSSxHQUFHLEVBQUUsQ0FBQztHQUN6Qzs7WUFYa0IsY0FBYzs7ZUFBZCxjQUFjO0FBYWpDLFNBQUs7YUFBQSxpQkFBRyxFQUVQOztBQUVELFFBQUk7YUFBQSxnQkFBRztBQUNMLFlBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDOztBQUU1QyxhQUFLLElBQUksRUFBRSxJQUFJLFVBQVUsRUFBRTtBQUN6QixjQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ25DO09BQ0Y7O0FBRUQsZUFBVzthQUFBLHFCQUFDLENBQUMsRUFBRTtBQUNiLGdCQUFRLENBQUMsQ0FBQyxJQUFJO0FBQ1osZUFBSyxXQUFXO0FBQ2QsZ0JBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsa0JBQU07QUFBQSxBQUNSLGVBQUssV0FBVztBQUNkLGdCQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGtCQUFNO0FBQUEsQUFDUixlQUFLLFNBQVM7QUFDWixnQkFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixrQkFBTTtBQUFBLEFBQ1IsZUFBSyxPQUFPO0FBQ1YsZ0JBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEIsa0JBQU07QUFBQSxBQUNSLGVBQUssU0FBUztBQUNaLGdCQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2Qsa0JBQU07QUFBQSxBQUNSLGVBQUssT0FBTztBQUNWLGdCQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2Qsa0JBQU07QUFBQSxTQUNUO09BQ0Y7O0FBRUQsYUFBUzthQUFBLG1CQUFDLEtBQUssRUFBRTtBQUNmLFlBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtBQUFFLGlCQUFPO1NBQUU7O0FBRTdCLFlBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ25ELGFBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztBQUM3QixhQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7O0FBRTFCLGFBQUssQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZDLGFBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO09BQ3RCOztBQUVELGdCQUFZO2FBQUEsc0JBQUMsS0FBSyxFQUFFO0FBQ2xCLFlBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUU7QUFBRSxpQkFBTztTQUFFOztBQUV0QyxZQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hCLGFBQUssQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QyxlQUFPLEtBQUssQ0FBQyxNQUFNLENBQUM7T0FDckI7O0FBRUQsZUFBVzthQUFBLHFCQUFDLEtBQUssRUFBRTtBQUNqQixZQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDOztBQUU1QixjQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUM1RCxjQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEMsY0FBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO09BQzFDOztBQUVELGdCQUFZO2FBQUEsc0JBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUNyQixZQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQzVCLFlBQU0sU0FBUyxrQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLFVBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQUcsQ0FBQzs7QUFFN0QsY0FBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3BELGNBQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25ELGNBQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQ3REOztBQUVELFNBQUs7YUFBQSxlQUFDLENBQUMsRUFBRTtBQUNQLFlBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztPQUM1Qjs7QUFFRCxlQUFXO2FBQUEscUJBQUMsQ0FBQyxFQUFFOzs7QUFDYixZQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BFLFlBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQUUsaUJBQU87U0FBRTs7QUFFcEMsWUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7OztBQUduQyxZQUFJLENBQUMsc0JBQXNCLEdBQUcsVUFBSSxHQUFHLEVBQUUsQ0FBQztBQUN4QyxZQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDM0MsZ0JBQUssc0JBQXNCLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3RFLENBQUMsQ0FBQztPQUNKOztBQUVELGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7OztBQUNiLFlBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFekMsWUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQzNDLGNBQU0sZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztBQUM3QyxjQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7O0FBR2xELGNBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRTtBQUM3QixpQkFBSyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2pDLGlCQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1dBQzVCLE1BQU07O0FBQ0wsa0JBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNwQixrQkFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDOztBQUV0QixrQkFBTSxpQkFBaUIsR0FBRyxNQUFLLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7O0FBR2pFLDBCQUFZLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQzdCLG9CQUFJLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUMxQywwQkFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDckIsTUFBTTtBQUNMLDRCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUN2QjtlQUNGLENBQUMsQ0FBQzs7QUFFSCw4QkFBZ0IsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDakMsb0JBQ0UsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFDakMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUN0QztBQUNBLDRCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUN2QjtlQUNGLENBQUMsQ0FBQzs7QUFFSCxtQkFBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMzQixtQkFBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7V0FDeEI7U0FDRixDQUFDLENBQUM7T0FDSjs7QUFFRCxhQUFTO2FBQUEsbUJBQUMsQ0FBQyxFQUFFO0FBQ1gsWUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7T0FDdkM7O0FBRUQsV0FBTzthQUFBLGlCQUFDLENBQUMsRUFBRTtBQUNULFlBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQUUsaUJBQU87U0FBRTs7QUFFcEMsWUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQzNDLGNBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRWpELGNBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRTtBQUM3QixpQkFBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1dBQ2xCOztBQUVELGNBQUksSUFBSSxFQUFFO0FBQ1IsaUJBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7V0FDN0I7U0FDRixDQUFDLENBQUM7T0FDSjs7OztTQWhLa0IsY0FBYztHQUFTLFNBQVM7O2lCQUFoQyxjQUFjOzs7Ozs7Ozs7OztJQUpkLGNBQWM7QUFDdEIsV0FEUSxjQUFjLEdBQ25COzBCQURLLGNBQWM7O0FBRS9CLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0dBQ25COztlQUprQixjQUFjO0FBT2pDLHFCQUFpQjs7OzthQUFBLDZCQUFHO0FBQ2xCLFlBQUksSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFaEIsYUFBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQzFCLGNBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUIsY0FBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQzs7QUFFN0IsY0FBSSxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7QUFDdkMsa0JBQU0sSUFBSSxLQUFLLE1BQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSx5QkFBc0IsQ0FBQztXQUMxRSxNQUFNLElBQUksSUFBSSxLQUFLLElBQUksRUFBRTtBQUN4QixnQkFBSSxHQUFHLFNBQVMsQ0FBQztXQUNsQjtTQUNGO09BQ0Y7O0FBRUQsa0JBQWM7YUFBQSwwQkFBRzs7O0FBQ2YsWUFBSSxJQUFJLEdBQUcsTUFBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFbkMsWUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUs7QUFDdkIsY0FBTSxHQUFHLEdBQUcsTUFBSyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRTVCLGFBQUcsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFLO0FBQzVCLGdCQUFJLE1BQUssS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLFNBQVMsRUFBRSxNQUFLLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDNUQsa0JBQUssS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztXQUNoQyxDQUFDLENBQUM7U0FDSixDQUFDLENBQUM7O0FBRUgsWUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7T0FDMUI7O0FBRUQsa0JBQWM7YUFBQSwwQkFBRzs7O0FBQ2YsWUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFLO0FBQ2pDLGVBQUssSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFO0FBQ25CLGdCQUFJLEtBQUssS0FBSyxDQUFDLEVBQUUsTUFBSyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3RDLGtCQUFLLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7V0FDaEM7U0FDRixDQUFDLENBQUM7O0FBRUgsWUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7T0FDMUI7O0FBZ0JHLFFBQUk7V0FkQSxVQUFDLEdBQUcsRUFBRTtBQUNaLFlBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ2pCLFlBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDOztBQUVoQixZQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7T0FDdkI7V0FTTyxZQUFHO0FBQ1QsZUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO09BQ25COztBQUVHLFFBQUk7V0FYQSxVQUFDLEdBQUcsRUFBRTtBQUNaLFlBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ2pCLFlBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDOztBQUVoQixZQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7T0FDdkI7V0FNTyxZQUFHO0FBQ1QsZUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO09BQ25COzs7O1NBcEVrQixjQUFjOzs7aUJBQWQsY0FBYzs7O0FDQW5DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3B5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbmdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmhEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29yZToge1xuICAgIExheWVyVGltZUNvbnRleHQgICAgOiByZXF1aXJlKCcuL2Rpc3QvY29yZS9sYXllci10aW1lLWNvbnRleHQnKSxcbiAgICBMYXllciAgICAgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L2NvcmUvbGF5ZXInKSxcbiAgICBuYW1lc3BhY2UgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L2NvcmUvbmFtZXNwYWNlJyksXG4gICAgVGltZWxpbmVUaW1lQ29udGV4dCA6IHJlcXVpcmUoJy4vZGlzdC9jb3JlL3RpbWVsaW5lLXRpbWUtY29udGV4dCcpLFxuICAgIFRpbWVsaW5lICAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvY29yZS90aW1lbGluZScpLFxuICAgIFRyYWNrQ29sbGVjdGlvbiAgICAgOiByZXF1aXJlKCcuL2Rpc3QvY29yZS90cmFjay1jb2xsZWN0aW9uJyksXG4gICAgVHJhY2sgICAgICAgICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9jb3JlL3RyYWNrJyksXG4gIH0sXG4gIHNoYXBlczoge1xuICAgIEFubm90YXRlZE1hcmtlciAgICAgOiByZXF1aXJlKCcuL2Rpc3Qvc2hhcGVzL2Fubm90YXRlZC1tYXJrZXInKSxcbiAgICBBbm5vdGF0ZWRTZWdtZW50ICAgIDogcmVxdWlyZSgnLi9kaXN0L3NoYXBlcy9hbm5vdGF0ZWQtc2VnbWVudCcpLFxuICAgIEJhc2VTaGFwZSAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3Qvc2hhcGVzL2Jhc2Utc2hhcGUnKSxcbiAgICBDdXJzb3IgICAgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L3NoYXBlcy9jdXJzb3InKSxcbiAgICBEb3QgICAgICAgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L3NoYXBlcy9kb3QnKSxcbiAgICBMaW5lICAgICAgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L3NoYXBlcy9saW5lJyksXG4gICAgTWFya2VyICAgICAgICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9zaGFwZXMvbWFya2VyJyksXG4gICAgU2VnbWVudCAgICAgICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9zaGFwZXMvc2VnbWVudCcpLFxuICAgIFRyYWNlQ29tbW9uICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3Qvc2hhcGVzL3RyYWNlLWNvbW1vbicpLFxuICAgIFRyYWNlRG90cyAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3Qvc2hhcGVzL3RyYWNlLWRvdHMnKSxcbiAgICBXYXZlZm9ybSAgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L3NoYXBlcy93YXZlZm9ybScpLFxuICB9LFxuICBiZWhhdmlvcnM6IHtcbiAgICBCYXNlQmVoYXZpb3IgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L2JlaGF2aW9ycy9iYXNlLWJlaGF2aW9yJyksXG4gICAgQnJlYWtwb2ludEJlaGF2aW9yICA6IHJlcXVpcmUoJy4vZGlzdC9iZWhhdmlvcnMvYnJlYWtwb2ludC1iZWhhdmlvcicpLFxuICAgIE1hcmtlckJlaGF2aW9yICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvYmVoYXZpb3JzL21hcmtlci1iZWhhdmlvcicpLFxuICAgIFNlZ21lbnRCZWhhdmlvciAgICAgOiByZXF1aXJlKCcuL2Rpc3QvYmVoYXZpb3JzL3NlZ21lbnQtYmVoYXZpb3InKSxcbiAgICBUaW1lQ29udGV4dEJlaGF2aW9yIDogcmVxdWlyZSgnLi9kaXN0L2JlaGF2aW9ycy90aW1lLWNvbnRleHQtYmVoYXZpb3InKSxcbiAgICBUcmFjZUJlaGF2aW9yICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L2JlaGF2aW9ycy90cmFjZS1iZWhhdmlvcicpLFxuICB9LFxuICBpbnRlcmFjdGlvbnM6IHtcbiAgICBFdmVudFNvdXJjZSAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L2ludGVyYWN0aW9ucy9ldmVudC1zb3VyY2UnKSxcbiAgICBLZXlib2FyZCAgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L2ludGVyYWN0aW9ucy9rZXlib2FyZCcpLFxuICAgIFN1cmZhY2UgICAgICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvaW50ZXJhY3Rpb25zL3N1cmZhY2UnKSxcbiAgICBXYXZlRXZlbnQgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L2ludGVyYWN0aW9ucy93YXZlLWV2ZW50JyksXG4gIH0sXG4gIC8vIHJlbmFtZSBmb2xkZXIgP1xuICBzdGF0ZXM6IHtcbiAgICBCYXNlU3RhdGUgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L3N0YXRlcy9iYXNlLXN0YXRlJyksXG4gICAgQnJ1c2hab29tU3RhdGUgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9zdGF0ZXMvYnJ1c2gtem9vbS1zdGF0ZScpLFxuICAgIENlbnRlcmVkWm9vbVN0YXRlICAgOiByZXF1aXJlKCcuL2Rpc3Qvc3RhdGVzL2NlbnRlcmVkLXpvb20tc3RhdGUnKSxcbiAgICBDb250ZXh0RWRpdGlvblN0YXRlIDogcmVxdWlyZSgnLi9kaXN0L3N0YXRlcy9jb250ZXh0LWVkaXRpb24tc3RhdGUnKSxcbiAgICBFZGl0aW9uU3RhdGUgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L3N0YXRlcy9lZGl0aW9uLXN0YXRlJyksXG4gICAgU2VsZWN0aW9uU3RhdGUgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlJyksXG4gIH0sXG4gIGhlbHBlcnM6IHtcbiAgICBBbm5vdGF0ZWRNYXJrZXJMYXllcjogcmVxdWlyZSgnLi9kaXN0L2hlbHBlcnMvYW5ub3RhdGVkLW1hcmtlci1sYXllcicpLFxuICAgIEN1cnNvckxheWVyICAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvaGVscGVycy9jdXJzb3ItbGF5ZXInKSxcbiAgICBEb3RMYXllciAgICAgICAgICAgIDogcmVxdWlyZSgnLi9kaXN0L2hlbHBlcnMvZG90LWxheWVyJyksXG4gICAgTWFya2VyTGF5ZXIgICAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9oZWxwZXJzL21hcmtlci1sYXllcicpLFxuICAgIFNlZ21lbnRMYXllciAgICAgICAgOiByZXF1aXJlKCcuL2Rpc3QvaGVscGVycy9zZWdtZW50LWxheWVyJyksXG4gICAgV2F2ZWZvcm1MYXllciAgICAgICA6IHJlcXVpcmUoJy4vZGlzdC9oZWxwZXJzL3dhdmVmb3JtLWxheWVyJyksXG4gIH0sXG4gIHV0aWxzOiB7XG4gICAgT3J0aG9nb25hbERhdGEgICAgICA6IHJlcXVpcmUoJy4vZGlzdC91dGlscy9vcnRob2dvbmFsLWRhdGEnKSxcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3J0aG9nb25hbERhdGEge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9jb2xzID0gbnVsbDsgLy8gb2JqZWN0IG9mIGFycmF5c1xuICAgIHRoaXMuX3Jvd3MgPSBudWxsOyAvLyBhcnJheSBvZiBvYmplY3RzXG4gIH1cblxuICAvLyB2ZXJpZnkgdGhhdCBkYXRhIGFyZSBjb25zaXN0ZW50c1xuICBfY2hlY2tDb25zaXN0ZW5jeSgpIHtcbiAgICBsZXQgc2l6ZSA9IG51bGw7XG5cbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5fY29scykge1xuICAgICAgY29uc3QgY29sID0gdGhpcy5fY29sc1trZXldO1xuICAgICAgY29uc3QgY29sTGVuZ3RoID0gY29sLmxlbmd0aDtcblxuICAgICAgaWYgKHNpemUgIT09IG51bGwgJiYgc2l6ZSAhPT0gY29sTGVuZ3RoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5uYW1lfTogaW5jb25zaXN0ZW50IGRhdGFgKTtcbiAgICAgIH0gZWxzZSBpZiAoc2l6ZSA9PT0gbnVsbCkge1xuICAgICAgICBzaXplID0gY29sTGVuZ3RoO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUZyb21Db2xzKCkge1xuICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXModGhpcy5fY29scyk7XG5cbiAgICBrZXlzLmZvckVhY2goKGtleSwgaSkgPT4ge1xuICAgICAgY29uc3QgY29sID0gdGhpcy5fY29sc1trZXldO1xuXG4gICAgICBjb2wuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9yb3dzW2luZGV4XSA9PT0gdW5kZWZpbmVkKSB0aGlzLl9yb3dzW2luZGV4XSA9IHt9O1xuICAgICAgICB0aGlzLl9yb3dzW2luZGV4XVtrZXldID0gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2NoZWNrQ29uc2lzdGVuY3koKTtcbiAgfVxuXG4gIHVwZGF0ZUZyb21Sb3dzKCkge1xuICAgIHRoaXMuX3Jvd3MuZm9yRWFjaCgob2JqLCBpbmRleCkgPT4ge1xuICAgICAgZm9yIChsZXQga2V5IGluIG9iaikge1xuICAgICAgICBpZiAoaW5kZXggPT09IDApIHRoaXMuX2NvbHNba2V5XSA9IFtdO1xuICAgICAgICB0aGlzLl9jb2xzW2tleV0ucHVzaChvYmpba2V5XSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9jaGVja0NvbnNpc3RlbmN5KCk7XG4gIH1cblxuICBzZXQgY29scyhvYmopIHtcbiAgICB0aGlzLl9jb2xzID0gb2JqO1xuICAgIHRoaXMuX3Jvd3MgPSBbXTtcblxuICAgIHRoaXMudXBkYXRlRnJvbUNvbHMoKTtcbiAgfVxuXG4gIHNldCByb3dzKGFycikge1xuICAgIHRoaXMuX3Jvd3MgPSBhcnI7XG4gICAgdGhpcy5fY29scyA9IHt9O1xuXG4gICAgdGhpcy51cGRhdGVGcm9tUm93cygpO1xuICB9XG5cbiAgZ2V0IGNvbHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbHM7XG4gIH1cblxuICBnZXQgcm93cygpIHtcbiAgICByZXR1cm4gdGhpcy5fcm93cztcbiAgfVxufVxuIiwiLyoqXG4gKiBDb3JlLmpzIDAuNi4xXG4gKiBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qc1xuICogTGljZW5zZTogaHR0cDovL3JvY2subWl0LWxpY2Vuc2Uub3JnXG4gKiDCqSAyMDE1IERlbmlzIFB1c2hrYXJldlxuICovXG4hZnVuY3Rpb24oZ2xvYmFsLCBmcmFtZXdvcmssIHVuZGVmaW5lZCl7XG4ndXNlIHN0cmljdCc7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvbW1vbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgLy8gU2hvcnRjdXRzIGZvciBbW0NsYXNzXV0gJiBwcm9wZXJ0eSBuYW1lc1xyXG52YXIgT0JKRUNUICAgICAgICAgID0gJ09iamVjdCdcclxuICAsIEZVTkNUSU9OICAgICAgICA9ICdGdW5jdGlvbidcclxuICAsIEFSUkFZICAgICAgICAgICA9ICdBcnJheSdcclxuICAsIFNUUklORyAgICAgICAgICA9ICdTdHJpbmcnXHJcbiAgLCBOVU1CRVIgICAgICAgICAgPSAnTnVtYmVyJ1xyXG4gICwgUkVHRVhQICAgICAgICAgID0gJ1JlZ0V4cCdcclxuICAsIERBVEUgICAgICAgICAgICA9ICdEYXRlJ1xyXG4gICwgTUFQICAgICAgICAgICAgID0gJ01hcCdcclxuICAsIFNFVCAgICAgICAgICAgICA9ICdTZXQnXHJcbiAgLCBXRUFLTUFQICAgICAgICAgPSAnV2Vha01hcCdcclxuICAsIFdFQUtTRVQgICAgICAgICA9ICdXZWFrU2V0J1xyXG4gICwgU1lNQk9MICAgICAgICAgID0gJ1N5bWJvbCdcclxuICAsIFBST01JU0UgICAgICAgICA9ICdQcm9taXNlJ1xyXG4gICwgTUFUSCAgICAgICAgICAgID0gJ01hdGgnXHJcbiAgLCBBUkdVTUVOVFMgICAgICAgPSAnQXJndW1lbnRzJ1xyXG4gICwgUFJPVE9UWVBFICAgICAgID0gJ3Byb3RvdHlwZSdcclxuICAsIENPTlNUUlVDVE9SICAgICA9ICdjb25zdHJ1Y3RvcidcclxuICAsIFRPX1NUUklORyAgICAgICA9ICd0b1N0cmluZydcclxuICAsIFRPX1NUUklOR19UQUcgICA9IFRPX1NUUklORyArICdUYWcnXHJcbiAgLCBUT19MT0NBTEUgICAgICAgPSAndG9Mb2NhbGVTdHJpbmcnXHJcbiAgLCBIQVNfT1dOICAgICAgICAgPSAnaGFzT3duUHJvcGVydHknXHJcbiAgLCBGT1JfRUFDSCAgICAgICAgPSAnZm9yRWFjaCdcclxuICAsIElURVJBVE9SICAgICAgICA9ICdpdGVyYXRvcidcclxuICAsIEZGX0lURVJBVE9SICAgICA9ICdAQCcgKyBJVEVSQVRPUlxyXG4gICwgUFJPQ0VTUyAgICAgICAgID0gJ3Byb2Nlc3MnXHJcbiAgLCBDUkVBVEVfRUxFTUVOVCAgPSAnY3JlYXRlRWxlbWVudCdcclxuICAvLyBBbGlhc2VzIGdsb2JhbCBvYmplY3RzIGFuZCBwcm90b3R5cGVzXHJcbiAgLCBGdW5jdGlvbiAgICAgICAgPSBnbG9iYWxbRlVOQ1RJT05dXHJcbiAgLCBPYmplY3QgICAgICAgICAgPSBnbG9iYWxbT0JKRUNUXVxyXG4gICwgQXJyYXkgICAgICAgICAgID0gZ2xvYmFsW0FSUkFZXVxyXG4gICwgU3RyaW5nICAgICAgICAgID0gZ2xvYmFsW1NUUklOR11cclxuICAsIE51bWJlciAgICAgICAgICA9IGdsb2JhbFtOVU1CRVJdXHJcbiAgLCBSZWdFeHAgICAgICAgICAgPSBnbG9iYWxbUkVHRVhQXVxyXG4gICwgRGF0ZSAgICAgICAgICAgID0gZ2xvYmFsW0RBVEVdXHJcbiAgLCBNYXAgICAgICAgICAgICAgPSBnbG9iYWxbTUFQXVxyXG4gICwgU2V0ICAgICAgICAgICAgID0gZ2xvYmFsW1NFVF1cclxuICAsIFdlYWtNYXAgICAgICAgICA9IGdsb2JhbFtXRUFLTUFQXVxyXG4gICwgV2Vha1NldCAgICAgICAgID0gZ2xvYmFsW1dFQUtTRVRdXHJcbiAgLCBTeW1ib2wgICAgICAgICAgPSBnbG9iYWxbU1lNQk9MXVxyXG4gICwgTWF0aCAgICAgICAgICAgID0gZ2xvYmFsW01BVEhdXHJcbiAgLCBUeXBlRXJyb3IgICAgICAgPSBnbG9iYWwuVHlwZUVycm9yXHJcbiAgLCBSYW5nZUVycm9yICAgICAgPSBnbG9iYWwuUmFuZ2VFcnJvclxyXG4gICwgc2V0VGltZW91dCAgICAgID0gZ2xvYmFsLnNldFRpbWVvdXRcclxuICAsIHNldEltbWVkaWF0ZSAgICA9IGdsb2JhbC5zZXRJbW1lZGlhdGVcclxuICAsIGNsZWFySW1tZWRpYXRlICA9IGdsb2JhbC5jbGVhckltbWVkaWF0ZVxyXG4gICwgcGFyc2VJbnQgICAgICAgID0gZ2xvYmFsLnBhcnNlSW50XHJcbiAgLCBpc0Zpbml0ZSAgICAgICAgPSBnbG9iYWwuaXNGaW5pdGVcclxuICAsIHByb2Nlc3MgICAgICAgICA9IGdsb2JhbFtQUk9DRVNTXVxyXG4gICwgbmV4dFRpY2sgICAgICAgID0gcHJvY2VzcyAmJiBwcm9jZXNzLm5leHRUaWNrXHJcbiAgLCBkb2N1bWVudCAgICAgICAgPSBnbG9iYWwuZG9jdW1lbnRcclxuICAsIGh0bWwgICAgICAgICAgICA9IGRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxyXG4gICwgbmF2aWdhdG9yICAgICAgID0gZ2xvYmFsLm5hdmlnYXRvclxyXG4gICwgZGVmaW5lICAgICAgICAgID0gZ2xvYmFsLmRlZmluZVxyXG4gICwgY29uc29sZSAgICAgICAgID0gZ2xvYmFsLmNvbnNvbGUgfHwge31cclxuICAsIEFycmF5UHJvdG8gICAgICA9IEFycmF5W1BST1RPVFlQRV1cclxuICAsIE9iamVjdFByb3RvICAgICA9IE9iamVjdFtQUk9UT1RZUEVdXHJcbiAgLCBGdW5jdGlvblByb3RvICAgPSBGdW5jdGlvbltQUk9UT1RZUEVdXHJcbiAgLCBJbmZpbml0eSAgICAgICAgPSAxIC8gMFxyXG4gICwgRE9UICAgICAgICAgICAgID0gJy4nO1xyXG5cclxuLy8gaHR0cDovL2pzcGVyZi5jb20vY29yZS1qcy1pc29iamVjdFxyXG5mdW5jdGlvbiBpc09iamVjdChpdCl7XHJcbiAgcmV0dXJuIGl0ICE9PSBudWxsICYmICh0eXBlb2YgaXQgPT0gJ29iamVjdCcgfHwgdHlwZW9mIGl0ID09ICdmdW5jdGlvbicpO1xyXG59XHJcbmZ1bmN0aW9uIGlzRnVuY3Rpb24oaXQpe1xyXG4gIHJldHVybiB0eXBlb2YgaXQgPT0gJ2Z1bmN0aW9uJztcclxufVxyXG4vLyBOYXRpdmUgZnVuY3Rpb24/XHJcbnZhciBpc05hdGl2ZSA9IGN0eCgvLi8udGVzdCwgL1xcW25hdGl2ZSBjb2RlXFxdXFxzKlxcfVxccyokLywgMSk7XHJcblxyXG4vLyBPYmplY3QgaW50ZXJuYWwgW1tDbGFzc11dIG9yIHRvU3RyaW5nVGFnXHJcbi8vIGh0dHA6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmdcclxudmFyIHRvU3RyaW5nID0gT2JqZWN0UHJvdG9bVE9fU1RSSU5HXTtcclxuZnVuY3Rpb24gc2V0VG9TdHJpbmdUYWcoaXQsIHRhZywgc3RhdCl7XHJcbiAgaWYoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0W1BST1RPVFlQRV0sIFNZTUJPTF9UQUcpKWhpZGRlbihpdCwgU1lNQk9MX1RBRywgdGFnKTtcclxufVxyXG5mdW5jdGlvbiBjb2YoaXQpe1xyXG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XHJcbn1cclxuZnVuY3Rpb24gY2xhc3NvZihpdCl7XHJcbiAgdmFyIE8sIFQ7XHJcbiAgcmV0dXJuIGl0ID09IHVuZGVmaW5lZCA/IGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6ICdOdWxsJ1xyXG4gICAgOiB0eXBlb2YgKFQgPSAoTyA9IE9iamVjdChpdCkpW1NZTUJPTF9UQUddKSA9PSAnc3RyaW5nJyA/IFQgOiBjb2YoTyk7XHJcbn1cclxuXHJcbi8vIEZ1bmN0aW9uXHJcbnZhciBjYWxsICA9IEZ1bmN0aW9uUHJvdG8uY2FsbFxyXG4gICwgYXBwbHkgPSBGdW5jdGlvblByb3RvLmFwcGx5XHJcbiAgLCBSRUZFUkVOQ0VfR0VUO1xyXG4vLyBQYXJ0aWFsIGFwcGx5XHJcbmZ1bmN0aW9uIHBhcnQoLyogLi4uYXJncyAqLyl7XHJcbiAgdmFyIGZuICAgICA9IGFzc2VydEZ1bmN0aW9uKHRoaXMpXHJcbiAgICAsIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICwgYXJncyAgID0gQXJyYXkobGVuZ3RoKVxyXG4gICAgLCBpICAgICAgPSAwXHJcbiAgICAsIF8gICAgICA9IHBhdGguX1xyXG4gICAgLCBob2xkZXIgPSBmYWxzZTtcclxuICB3aGlsZShsZW5ndGggPiBpKWlmKChhcmdzW2ldID0gYXJndW1lbnRzW2krK10pID09PSBfKWhvbGRlciA9IHRydWU7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xyXG4gICAgdmFyIHRoYXQgICAgPSB0aGlzXHJcbiAgICAgICwgX2xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgLCBpID0gMCwgaiA9IDAsIF9hcmdzO1xyXG4gICAgaWYoIWhvbGRlciAmJiAhX2xlbmd0aClyZXR1cm4gaW52b2tlKGZuLCBhcmdzLCB0aGF0KTtcclxuICAgIF9hcmdzID0gYXJncy5zbGljZSgpO1xyXG4gICAgaWYoaG9sZGVyKWZvcig7bGVuZ3RoID4gaTsgaSsrKWlmKF9hcmdzW2ldID09PSBfKV9hcmdzW2ldID0gYXJndW1lbnRzW2orK107XHJcbiAgICB3aGlsZShfbGVuZ3RoID4gailfYXJncy5wdXNoKGFyZ3VtZW50c1tqKytdKTtcclxuICAgIHJldHVybiBpbnZva2UoZm4sIF9hcmdzLCB0aGF0KTtcclxuICB9XHJcbn1cclxuLy8gT3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXHJcbmZ1bmN0aW9uIGN0eChmbiwgdGhhdCwgbGVuZ3RoKXtcclxuICBhc3NlcnRGdW5jdGlvbihmbik7XHJcbiAgaWYofmxlbmd0aCAmJiB0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xyXG4gIHN3aXRjaChsZW5ndGgpe1xyXG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24oYSl7XHJcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xyXG4gICAgfVxyXG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYil7XHJcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xyXG4gICAgfVxyXG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XHJcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xyXG4gICAgfVxyXG4gIH0gcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xyXG4gICAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcclxuICB9XHJcbn1cclxuLy8gRmFzdCBhcHBseVxyXG4vLyBodHRwOi8vanNwZXJmLmxua2l0LmNvbS9mYXN0LWFwcGx5LzVcclxuZnVuY3Rpb24gaW52b2tlKGZuLCBhcmdzLCB0aGF0KXtcclxuICB2YXIgdW4gPSB0aGF0ID09PSB1bmRlZmluZWQ7XHJcbiAgc3dpdGNoKGFyZ3MubGVuZ3RoIHwgMCl7XHJcbiAgICBjYXNlIDA6IHJldHVybiB1biA/IGZuKClcclxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0KTtcclxuICAgIGNhc2UgMTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSlcclxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdKTtcclxuICAgIGNhc2UgMjogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSlcclxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdKTtcclxuICAgIGNhc2UgMzogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSlcclxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcclxuICAgIGNhc2UgNDogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSlcclxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKTtcclxuICAgIGNhc2UgNTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSwgYXJnc1s0XSlcclxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdLCBhcmdzWzRdKTtcclxuICB9IHJldHVybiAgICAgICAgICAgICAgZm4uYXBwbHkodGhhdCwgYXJncyk7XHJcbn1cclxuXHJcbi8vIE9iamVjdDpcclxudmFyIGNyZWF0ZSAgICAgICAgICAgPSBPYmplY3QuY3JlYXRlXHJcbiAgLCBnZXRQcm90b3R5cGVPZiAgID0gT2JqZWN0LmdldFByb3RvdHlwZU9mXHJcbiAgLCBzZXRQcm90b3R5cGVPZiAgID0gT2JqZWN0LnNldFByb3RvdHlwZU9mXHJcbiAgLCBkZWZpbmVQcm9wZXJ0eSAgID0gT2JqZWN0LmRlZmluZVByb3BlcnR5XHJcbiAgLCBkZWZpbmVQcm9wZXJ0aWVzID0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXNcclxuICAsIGdldE93bkRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yXHJcbiAgLCBnZXRLZXlzICAgICAgICAgID0gT2JqZWN0LmtleXNcclxuICAsIGdldE5hbWVzICAgICAgICAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc1xyXG4gICwgZ2V0U3ltYm9scyAgICAgICA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHNcclxuICAsIGlzRnJvemVuICAgICAgICAgPSBPYmplY3QuaXNGcm96ZW5cclxuICAsIGhhcyAgICAgICAgICAgICAgPSBjdHgoY2FsbCwgT2JqZWN0UHJvdG9bSEFTX09XTl0sIDIpXHJcbiAgLy8gRHVtbXksIGZpeCBmb3Igbm90IGFycmF5LWxpa2UgRVMzIHN0cmluZyBpbiBlczUgbW9kdWxlXHJcbiAgLCBFUzVPYmplY3QgICAgICAgID0gT2JqZWN0XHJcbiAgLCBEaWN0O1xyXG5mdW5jdGlvbiB0b09iamVjdChpdCl7XHJcbiAgcmV0dXJuIEVTNU9iamVjdChhc3NlcnREZWZpbmVkKGl0KSk7XHJcbn1cclxuZnVuY3Rpb24gcmV0dXJuSXQoaXQpe1xyXG4gIHJldHVybiBpdDtcclxufVxyXG5mdW5jdGlvbiByZXR1cm5UaGlzKCl7XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn1cclxuZnVuY3Rpb24gZ2V0KG9iamVjdCwga2V5KXtcclxuICBpZihoYXMob2JqZWN0LCBrZXkpKXJldHVybiBvYmplY3Rba2V5XTtcclxufVxyXG5mdW5jdGlvbiBvd25LZXlzKGl0KXtcclxuICBhc3NlcnRPYmplY3QoaXQpO1xyXG4gIHJldHVybiBnZXRTeW1ib2xzID8gZ2V0TmFtZXMoaXQpLmNvbmNhdChnZXRTeW1ib2xzKGl0KSkgOiBnZXROYW1lcyhpdCk7XHJcbn1cclxuLy8gMTkuMS4yLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSwgLi4uKVxyXG52YXIgYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0YXJnZXQsIHNvdXJjZSl7XHJcbiAgdmFyIFQgPSBPYmplY3QoYXNzZXJ0RGVmaW5lZCh0YXJnZXQpKVxyXG4gICAgLCBsID0gYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgLCBpID0gMTtcclxuICB3aGlsZShsID4gaSl7XHJcbiAgICB2YXIgUyAgICAgID0gRVM1T2JqZWN0KGFyZ3VtZW50c1tpKytdKVxyXG4gICAgICAsIGtleXMgICA9IGdldEtleXMoUylcclxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxyXG4gICAgICAsIGogICAgICA9IDBcclxuICAgICAgLCBrZXk7XHJcbiAgICB3aGlsZShsZW5ndGggPiBqKVRba2V5ID0ga2V5c1tqKytdXSA9IFNba2V5XTtcclxuICB9XHJcbiAgcmV0dXJuIFQ7XHJcbn1cclxuZnVuY3Rpb24ga2V5T2Yob2JqZWN0LCBlbCl7XHJcbiAgdmFyIE8gICAgICA9IHRvT2JqZWN0KG9iamVjdClcclxuICAgICwga2V5cyAgID0gZ2V0S2V5cyhPKVxyXG4gICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxyXG4gICAgLCBpbmRleCAgPSAwXHJcbiAgICAsIGtleTtcclxuICB3aGlsZShsZW5ndGggPiBpbmRleClpZihPW2tleSA9IGtleXNbaW5kZXgrK11dID09PSBlbClyZXR1cm4ga2V5O1xyXG59XHJcblxyXG4vLyBBcnJheVxyXG4vLyBhcnJheSgnc3RyMSxzdHIyLHN0cjMnKSA9PiBbJ3N0cjEnLCAnc3RyMicsICdzdHIzJ11cclxuZnVuY3Rpb24gYXJyYXkoaXQpe1xyXG4gIHJldHVybiBTdHJpbmcoaXQpLnNwbGl0KCcsJyk7XHJcbn1cclxudmFyIHB1c2ggICAgPSBBcnJheVByb3RvLnB1c2hcclxuICAsIHVuc2hpZnQgPSBBcnJheVByb3RvLnVuc2hpZnRcclxuICAsIHNsaWNlICAgPSBBcnJheVByb3RvLnNsaWNlXHJcbiAgLCBzcGxpY2UgID0gQXJyYXlQcm90by5zcGxpY2VcclxuICAsIGluZGV4T2YgPSBBcnJheVByb3RvLmluZGV4T2ZcclxuICAsIGZvckVhY2ggPSBBcnJheVByb3RvW0ZPUl9FQUNIXTtcclxuLypcclxuICogMCAtPiBmb3JFYWNoXHJcbiAqIDEgLT4gbWFwXHJcbiAqIDIgLT4gZmlsdGVyXHJcbiAqIDMgLT4gc29tZVxyXG4gKiA0IC0+IGV2ZXJ5XHJcbiAqIDUgLT4gZmluZFxyXG4gKiA2IC0+IGZpbmRJbmRleFxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlQXJyYXlNZXRob2QodHlwZSl7XHJcbiAgdmFyIGlzTWFwICAgICAgID0gdHlwZSA9PSAxXHJcbiAgICAsIGlzRmlsdGVyICAgID0gdHlwZSA9PSAyXHJcbiAgICAsIGlzU29tZSAgICAgID0gdHlwZSA9PSAzXHJcbiAgICAsIGlzRXZlcnkgICAgID0gdHlwZSA9PSA0XHJcbiAgICAsIGlzRmluZEluZGV4ID0gdHlwZSA9PSA2XHJcbiAgICAsIG5vaG9sZXMgICAgID0gdHlwZSA9PSA1IHx8IGlzRmluZEluZGV4O1xyXG4gIHJldHVybiBmdW5jdGlvbihjYWxsYmFja2ZuLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xyXG4gICAgdmFyIE8gICAgICA9IE9iamVjdChhc3NlcnREZWZpbmVkKHRoaXMpKVxyXG4gICAgICAsIHRoYXQgICA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAsIHNlbGYgICA9IEVTNU9iamVjdChPKVxyXG4gICAgICAsIGYgICAgICA9IGN0eChjYWxsYmFja2ZuLCB0aGF0LCAzKVxyXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKHNlbGYubGVuZ3RoKVxyXG4gICAgICAsIGluZGV4ICA9IDBcclxuICAgICAgLCByZXN1bHQgPSBpc01hcCA/IEFycmF5KGxlbmd0aCkgOiBpc0ZpbHRlciA/IFtdIDogdW5kZWZpbmVkXHJcbiAgICAgICwgdmFsLCByZXM7XHJcbiAgICBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKG5vaG9sZXMgfHwgaW5kZXggaW4gc2VsZil7XHJcbiAgICAgIHZhbCA9IHNlbGZbaW5kZXhdO1xyXG4gICAgICByZXMgPSBmKHZhbCwgaW5kZXgsIE8pO1xyXG4gICAgICBpZih0eXBlKXtcclxuICAgICAgICBpZihpc01hcClyZXN1bHRbaW5kZXhdID0gcmVzOyAgICAgICAgICAgICAvLyBtYXBcclxuICAgICAgICBlbHNlIGlmKHJlcylzd2l0Y2godHlwZSl7XHJcbiAgICAgICAgICBjYXNlIDM6IHJldHVybiB0cnVlOyAgICAgICAgICAgICAgICAgICAgLy8gc29tZVxyXG4gICAgICAgICAgY2FzZSA1OiByZXR1cm4gdmFsOyAgICAgICAgICAgICAgICAgICAgIC8vIGZpbmRcclxuICAgICAgICAgIGNhc2UgNjogcmV0dXJuIGluZGV4OyAgICAgICAgICAgICAgICAgICAvLyBmaW5kSW5kZXhcclxuICAgICAgICAgIGNhc2UgMjogcmVzdWx0LnB1c2godmFsKTsgICAgICAgICAgICAgICAvLyBmaWx0ZXJcclxuICAgICAgICB9IGVsc2UgaWYoaXNFdmVyeSlyZXR1cm4gZmFsc2U7ICAgICAgICAgICAvLyBldmVyeVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaXNGaW5kSW5kZXggPyAtMSA6IGlzU29tZSB8fCBpc0V2ZXJ5ID8gaXNFdmVyeSA6IHJlc3VsdDtcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlQXJyYXlDb250YWlucyhpc0NvbnRhaW5zKXtcclxuICByZXR1cm4gZnVuY3Rpb24oZWwgLyosIGZyb21JbmRleCA9IDAgKi8pe1xyXG4gICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KHRoaXMpXHJcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpXHJcbiAgICAgICwgaW5kZXggID0gdG9JbmRleChhcmd1bWVudHNbMV0sIGxlbmd0aCk7XHJcbiAgICBpZihpc0NvbnRhaW5zICYmIGVsICE9IGVsKXtcclxuICAgICAgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihzYW1lTmFOKE9baW5kZXhdKSlyZXR1cm4gaXNDb250YWlucyB8fCBpbmRleDtcclxuICAgIH0gZWxzZSBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKGlzQ29udGFpbnMgfHwgaW5kZXggaW4gTyl7XHJcbiAgICAgIGlmKE9baW5kZXhdID09PSBlbClyZXR1cm4gaXNDb250YWlucyB8fCBpbmRleDtcclxuICAgIH0gcmV0dXJuICFpc0NvbnRhaW5zICYmIC0xO1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBnZW5lcmljKEEsIEIpe1xyXG4gIC8vIHN0cmFuZ2UgSUUgcXVpcmtzIG1vZGUgYnVnIC0+IHVzZSB0eXBlb2YgdnMgaXNGdW5jdGlvblxyXG4gIHJldHVybiB0eXBlb2YgQSA9PSAnZnVuY3Rpb24nID8gQSA6IEI7XHJcbn1cclxuXHJcbi8vIE1hdGhcclxudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSAweDFmZmZmZmZmZmZmZmZmIC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcclxuICAsIHBvdyAgICA9IE1hdGgucG93XHJcbiAgLCBhYnMgICAgPSBNYXRoLmFic1xyXG4gICwgY2VpbCAgID0gTWF0aC5jZWlsXHJcbiAgLCBmbG9vciAgPSBNYXRoLmZsb29yXHJcbiAgLCBtYXggICAgPSBNYXRoLm1heFxyXG4gICwgbWluICAgID0gTWF0aC5taW5cclxuICAsIHJhbmRvbSA9IE1hdGgucmFuZG9tXHJcbiAgLCB0cnVuYyAgPSBNYXRoLnRydW5jIHx8IGZ1bmN0aW9uKGl0KXtcclxuICAgICAgcmV0dXJuIChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcclxuICAgIH1cclxuLy8gMjAuMS4yLjQgTnVtYmVyLmlzTmFOKG51bWJlcilcclxuZnVuY3Rpb24gc2FtZU5hTihudW1iZXIpe1xyXG4gIHJldHVybiBudW1iZXIgIT0gbnVtYmVyO1xyXG59XHJcbi8vIDcuMS40IFRvSW50ZWdlclxyXG5mdW5jdGlvbiB0b0ludGVnZXIoaXQpe1xyXG4gIHJldHVybiBpc05hTihpdCkgPyAwIDogdHJ1bmMoaXQpO1xyXG59XHJcbi8vIDcuMS4xNSBUb0xlbmd0aFxyXG5mdW5jdGlvbiB0b0xlbmd0aChpdCl7XHJcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCBNQVhfU0FGRV9JTlRFR0VSKSA6IDA7XHJcbn1cclxuZnVuY3Rpb24gdG9JbmRleChpbmRleCwgbGVuZ3RoKXtcclxuICB2YXIgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xyXG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xyXG59XHJcbmZ1bmN0aW9uIGx6KG51bSl7XHJcbiAgcmV0dXJuIG51bSA+IDkgPyBudW0gOiAnMCcgKyBudW07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVJlcGxhY2VyKHJlZ0V4cCwgcmVwbGFjZSwgaXNTdGF0aWMpe1xyXG4gIHZhciByZXBsYWNlciA9IGlzT2JqZWN0KHJlcGxhY2UpID8gZnVuY3Rpb24ocGFydCl7XHJcbiAgICByZXR1cm4gcmVwbGFjZVtwYXJ0XTtcclxuICB9IDogcmVwbGFjZTtcclxuICByZXR1cm4gZnVuY3Rpb24oaXQpe1xyXG4gICAgcmV0dXJuIFN0cmluZyhpc1N0YXRpYyA/IGl0IDogdGhpcykucmVwbGFjZShyZWdFeHAsIHJlcGxhY2VyKTtcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlUG9pbnRBdCh0b1N0cmluZyl7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKHBvcyl7XHJcbiAgICB2YXIgcyA9IFN0cmluZyhhc3NlcnREZWZpbmVkKHRoaXMpKVxyXG4gICAgICAsIGkgPSB0b0ludGVnZXIocG9zKVxyXG4gICAgICAsIGwgPSBzLmxlbmd0aFxyXG4gICAgICAsIGEsIGI7XHJcbiAgICBpZihpIDwgMCB8fCBpID49IGwpcmV0dXJuIHRvU3RyaW5nID8gJycgOiB1bmRlZmluZWQ7XHJcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xyXG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcclxuICAgICAgPyB0b1N0cmluZyA/IHMuY2hhckF0KGkpIDogYVxyXG4gICAgICA6IHRvU3RyaW5nID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xyXG4gIH1cclxufVxyXG5cclxuLy8gQXNzZXJ0aW9uICYgZXJyb3JzXHJcbnZhciBSRURVQ0VfRVJST1IgPSAnUmVkdWNlIG9mIGVtcHR5IG9iamVjdCB3aXRoIG5vIGluaXRpYWwgdmFsdWUnO1xyXG5mdW5jdGlvbiBhc3NlcnQoY29uZGl0aW9uLCBtc2cxLCBtc2cyKXtcclxuICBpZighY29uZGl0aW9uKXRocm93IFR5cGVFcnJvcihtc2cyID8gbXNnMSArIG1zZzIgOiBtc2cxKTtcclxufVxyXG5mdW5jdGlvbiBhc3NlcnREZWZpbmVkKGl0KXtcclxuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKCdGdW5jdGlvbiBjYWxsZWQgb24gbnVsbCBvciB1bmRlZmluZWQnKTtcclxuICByZXR1cm4gaXQ7XHJcbn1cclxuZnVuY3Rpb24gYXNzZXJ0RnVuY3Rpb24oaXQpe1xyXG4gIGFzc2VydChpc0Z1bmN0aW9uKGl0KSwgaXQsICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XHJcbiAgcmV0dXJuIGl0O1xyXG59XHJcbmZ1bmN0aW9uIGFzc2VydE9iamVjdChpdCl7XHJcbiAgYXNzZXJ0KGlzT2JqZWN0KGl0KSwgaXQsICcgaXMgbm90IGFuIG9iamVjdCEnKTtcclxuICByZXR1cm4gaXQ7XHJcbn1cclxuZnVuY3Rpb24gYXNzZXJ0SW5zdGFuY2UoaXQsIENvbnN0cnVjdG9yLCBuYW1lKXtcclxuICBhc3NlcnQoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvciwgbmFtZSwgXCI6IHVzZSB0aGUgJ25ldycgb3BlcmF0b3IhXCIpO1xyXG59XHJcblxyXG4vLyBQcm9wZXJ0eSBkZXNjcmlwdG9ycyAmIFN5bWJvbFxyXG5mdW5jdGlvbiBkZXNjcmlwdG9yKGJpdG1hcCwgdmFsdWUpe1xyXG4gIHJldHVybiB7XHJcbiAgICBlbnVtZXJhYmxlICA6ICEoYml0bWFwICYgMSksXHJcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXHJcbiAgICB3cml0YWJsZSAgICA6ICEoYml0bWFwICYgNCksXHJcbiAgICB2YWx1ZSAgICAgICA6IHZhbHVlXHJcbiAgfVxyXG59XHJcbmZ1bmN0aW9uIHNpbXBsZVNldChvYmplY3QsIGtleSwgdmFsdWUpe1xyXG4gIG9iamVjdFtrZXldID0gdmFsdWU7XHJcbiAgcmV0dXJuIG9iamVjdDtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGVEZWZpbmVyKGJpdG1hcCl7XHJcbiAgcmV0dXJuIERFU0MgPyBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xyXG4gICAgcmV0dXJuIGRlZmluZVByb3BlcnR5KG9iamVjdCwga2V5LCBkZXNjcmlwdG9yKGJpdG1hcCwgdmFsdWUpKTtcclxuICB9IDogc2ltcGxlU2V0O1xyXG59XHJcbmZ1bmN0aW9uIHVpZChrZXkpe1xyXG4gIHJldHVybiBTWU1CT0wgKyAnKCcgKyBrZXkgKyAnKV8nICsgKCsrc2lkICsgcmFuZG9tKCkpW1RPX1NUUklOR10oMzYpO1xyXG59XHJcbmZ1bmN0aW9uIGdldFdlbGxLbm93blN5bWJvbChuYW1lLCBzZXR0ZXIpe1xyXG4gIHJldHVybiAoU3ltYm9sICYmIFN5bWJvbFtuYW1lXSkgfHwgKHNldHRlciA/IFN5bWJvbCA6IHNhZmVTeW1ib2wpKFNZTUJPTCArIERPVCArIG5hbWUpO1xyXG59XHJcbi8vIFRoZSBlbmdpbmUgd29ya3MgZmluZSB3aXRoIGRlc2NyaXB0b3JzPyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5LlxyXG52YXIgREVTQyA9ICEhZnVuY3Rpb24oKXtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDIgfX0pLmEgPT0gMjtcclxuICAgICAgfSBjYXRjaChlKXt9XHJcbiAgICB9KClcclxuICAsIHNpZCAgICA9IDBcclxuICAsIGhpZGRlbiA9IGNyZWF0ZURlZmluZXIoMSlcclxuICAsIHNldCAgICA9IFN5bWJvbCA/IHNpbXBsZVNldCA6IGhpZGRlblxyXG4gICwgc2FmZVN5bWJvbCA9IFN5bWJvbCB8fCB1aWQ7XHJcbmZ1bmN0aW9uIGFzc2lnbkhpZGRlbih0YXJnZXQsIHNyYyl7XHJcbiAgZm9yKHZhciBrZXkgaW4gc3JjKWhpZGRlbih0YXJnZXQsIGtleSwgc3JjW2tleV0pO1xyXG4gIHJldHVybiB0YXJnZXQ7XHJcbn1cclxuXHJcbnZhciBTWU1CT0xfVU5TQ09QQUJMRVMgPSBnZXRXZWxsS25vd25TeW1ib2woJ3Vuc2NvcGFibGVzJylcclxuICAsIEFycmF5VW5zY29wYWJsZXMgICA9IEFycmF5UHJvdG9bU1lNQk9MX1VOU0NPUEFCTEVTXSB8fCB7fVxyXG4gICwgU1lNQk9MX1RBRyAgICAgICAgID0gZ2V0V2VsbEtub3duU3ltYm9sKFRPX1NUUklOR19UQUcpXHJcbiAgLCBTWU1CT0xfU1BFQ0lFUyAgICAgPSBnZXRXZWxsS25vd25TeW1ib2woJ3NwZWNpZXMnKVxyXG4gICwgU1lNQk9MX0lURVJBVE9SO1xyXG5mdW5jdGlvbiBzZXRTcGVjaWVzKEMpe1xyXG4gIGlmKERFU0MgJiYgKGZyYW1ld29yayB8fCAhaXNOYXRpdmUoQykpKWRlZmluZVByb3BlcnR5KEMsIFNZTUJPTF9TUEVDSUVTLCB7XHJcbiAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICBnZXQ6IHJldHVyblRoaXNcclxuICB9KTtcclxufVxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb21tb24uZXhwb3J0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG52YXIgTk9ERSA9IGNvZihwcm9jZXNzKSA9PSBQUk9DRVNTXHJcbiAgLCBjb3JlID0ge31cclxuICAsIHBhdGggPSBmcmFtZXdvcmsgPyBnbG9iYWwgOiBjb3JlXHJcbiAgLCBvbGQgID0gZ2xvYmFsLmNvcmVcclxuICAsIGV4cG9ydEdsb2JhbFxyXG4gIC8vIHR5cGUgYml0bWFwXHJcbiAgLCBGT1JDRUQgPSAxXHJcbiAgLCBHTE9CQUwgPSAyXHJcbiAgLCBTVEFUSUMgPSA0XHJcbiAgLCBQUk9UTyAgPSA4XHJcbiAgLCBCSU5EICAgPSAxNlxyXG4gICwgV1JBUCAgID0gMzI7XHJcbmZ1bmN0aW9uICRkZWZpbmUodHlwZSwgbmFtZSwgc291cmNlKXtcclxuICB2YXIga2V5LCBvd24sIG91dCwgZXhwXHJcbiAgICAsIGlzR2xvYmFsID0gdHlwZSAmIEdMT0JBTFxyXG4gICAgLCB0YXJnZXQgICA9IGlzR2xvYmFsID8gZ2xvYmFsIDogKHR5cGUgJiBTVEFUSUMpXHJcbiAgICAgICAgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IE9iamVjdFByb3RvKVtQUk9UT1RZUEVdXHJcbiAgICAsIGV4cG9ydHMgID0gaXNHbG9iYWwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KTtcclxuICBpZihpc0dsb2JhbClzb3VyY2UgPSBuYW1lO1xyXG4gIGZvcihrZXkgaW4gc291cmNlKXtcclxuICAgIC8vIHRoZXJlIGlzIGEgc2ltaWxhciBuYXRpdmVcclxuICAgIG93biA9ICEodHlwZSAmIEZPUkNFRCkgJiYgdGFyZ2V0ICYmIGtleSBpbiB0YXJnZXRcclxuICAgICAgJiYgKCFpc0Z1bmN0aW9uKHRhcmdldFtrZXldKSB8fCBpc05hdGl2ZSh0YXJnZXRba2V5XSkpO1xyXG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcclxuICAgIG91dCA9IChvd24gPyB0YXJnZXQgOiBzb3VyY2UpW2tleV07XHJcbiAgICAvLyBwcmV2ZW50IGdsb2JhbCBwb2xsdXRpb24gZm9yIG5hbWVzcGFjZXNcclxuICAgIGlmKCFmcmFtZXdvcmsgJiYgaXNHbG9iYWwgJiYgIWlzRnVuY3Rpb24odGFyZ2V0W2tleV0pKWV4cCA9IHNvdXJjZVtrZXldO1xyXG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcclxuICAgIGVsc2UgaWYodHlwZSAmIEJJTkQgJiYgb3duKWV4cCA9IGN0eChvdXQsIGdsb2JhbCk7XHJcbiAgICAvLyB3cmFwIGdsb2JhbCBjb25zdHJ1Y3RvcnMgZm9yIHByZXZlbnQgY2hhbmdlIHRoZW0gaW4gbGlicmFyeVxyXG4gICAgZWxzZSBpZih0eXBlICYgV1JBUCAmJiAhZnJhbWV3b3JrICYmIHRhcmdldFtrZXldID09IG91dCl7XHJcbiAgICAgIGV4cCA9IGZ1bmN0aW9uKHBhcmFtKXtcclxuICAgICAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIG91dCA/IG5ldyBvdXQocGFyYW0pIDogb3V0KHBhcmFtKTtcclxuICAgICAgfVxyXG4gICAgICBleHBbUFJPVE9UWVBFXSA9IG91dFtQUk9UT1RZUEVdO1xyXG4gICAgfSBlbHNlIGV4cCA9IHR5cGUgJiBQUk9UTyAmJiBpc0Z1bmN0aW9uKG91dCkgPyBjdHgoY2FsbCwgb3V0KSA6IG91dDtcclxuICAgIC8vIGV4dGVuZCBnbG9iYWxcclxuICAgIGlmKGZyYW1ld29yayAmJiB0YXJnZXQgJiYgIW93bil7XHJcbiAgICAgIGlmKGlzR2xvYmFsKXRhcmdldFtrZXldID0gb3V0O1xyXG4gICAgICBlbHNlIGRlbGV0ZSB0YXJnZXRba2V5XSAmJiBoaWRkZW4odGFyZ2V0LCBrZXksIG91dCk7XHJcbiAgICB9XHJcbiAgICAvLyBleHBvcnRcclxuICAgIGlmKGV4cG9ydHNba2V5XSAhPSBvdXQpaGlkZGVuKGV4cG9ydHMsIGtleSwgZXhwKTtcclxuICB9XHJcbn1cclxuLy8gQ29tbW9uSlMgZXhwb3J0XHJcbmlmKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpbW9kdWxlLmV4cG9ydHMgPSBjb3JlO1xyXG4vLyBSZXF1aXJlSlMgZXhwb3J0XHJcbmVsc2UgaWYoaXNGdW5jdGlvbihkZWZpbmUpICYmIGRlZmluZS5hbWQpZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIGNvcmV9KTtcclxuLy8gRXhwb3J0IHRvIGdsb2JhbCBvYmplY3RcclxuZWxzZSBleHBvcnRHbG9iYWwgPSB0cnVlO1xyXG5pZihleHBvcnRHbG9iYWwgfHwgZnJhbWV3b3JrKXtcclxuICBjb3JlLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpe1xyXG4gICAgZ2xvYmFsLmNvcmUgPSBvbGQ7XHJcbiAgICByZXR1cm4gY29yZTtcclxuICB9XHJcbiAgZ2xvYmFsLmNvcmUgPSBjb3JlO1xyXG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvbW1vbi5pdGVyYXRvcnMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblNZTUJPTF9JVEVSQVRPUiA9IGdldFdlbGxLbm93blN5bWJvbChJVEVSQVRPUik7XHJcbnZhciBJVEVSICA9IHNhZmVTeW1ib2woJ2l0ZXInKVxyXG4gICwgS0VZICAgPSAxXHJcbiAgLCBWQUxVRSA9IDJcclxuICAsIEl0ZXJhdG9ycyA9IHt9XHJcbiAgLCBJdGVyYXRvclByb3RvdHlwZSA9IHt9XHJcbiAgICAvLyBTYWZhcmkgaGFzIGJ5Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXHJcbiAgLCBCVUdHWV9JVEVSQVRPUlMgPSAna2V5cycgaW4gQXJyYXlQcm90byAmJiAhKCduZXh0JyBpbiBbXS5rZXlzKCkpO1xyXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxyXG5zZXRJdGVyYXRvcihJdGVyYXRvclByb3RvdHlwZSwgcmV0dXJuVGhpcyk7XHJcbmZ1bmN0aW9uIHNldEl0ZXJhdG9yKE8sIHZhbHVlKXtcclxuICBoaWRkZW4oTywgU1lNQk9MX0lURVJBVE9SLCB2YWx1ZSk7XHJcbiAgLy8gQWRkIGl0ZXJhdG9yIGZvciBGRiBpdGVyYXRvciBwcm90b2NvbFxyXG4gIEZGX0lURVJBVE9SIGluIEFycmF5UHJvdG8gJiYgaGlkZGVuKE8sIEZGX0lURVJBVE9SLCB2YWx1ZSk7XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlSXRlcmF0b3IoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQsIHByb3RvKXtcclxuICBDb25zdHJ1Y3RvcltQUk9UT1RZUEVdID0gY3JlYXRlKHByb3RvIHx8IEl0ZXJhdG9yUHJvdG90eXBlLCB7bmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KX0pO1xyXG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xyXG59XHJcbmZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yKENvbnN0cnVjdG9yLCBOQU1FLCB2YWx1ZSwgREVGQVVMVCl7XHJcbiAgdmFyIHByb3RvID0gQ29uc3RydWN0b3JbUFJPVE9UWVBFXVxyXG4gICAgLCBpdGVyICA9IGdldChwcm90bywgU1lNQk9MX0lURVJBVE9SKSB8fCBnZXQocHJvdG8sIEZGX0lURVJBVE9SKSB8fCAoREVGQVVMVCAmJiBnZXQocHJvdG8sIERFRkFVTFQpKSB8fCB2YWx1ZTtcclxuICBpZihmcmFtZXdvcmspe1xyXG4gICAgLy8gRGVmaW5lIGl0ZXJhdG9yXHJcbiAgICBzZXRJdGVyYXRvcihwcm90bywgaXRlcik7XHJcbiAgICBpZihpdGVyICE9PSB2YWx1ZSl7XHJcbiAgICAgIHZhciBpdGVyUHJvdG8gPSBnZXRQcm90b3R5cGVPZihpdGVyLmNhbGwobmV3IENvbnN0cnVjdG9yKSk7XHJcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcclxuICAgICAgc2V0VG9TdHJpbmdUYWcoaXRlclByb3RvLCBOQU1FICsgJyBJdGVyYXRvcicsIHRydWUpO1xyXG4gICAgICAvLyBGRiBmaXhcclxuICAgICAgaGFzKHByb3RvLCBGRl9JVEVSQVRPUikgJiYgc2V0SXRlcmF0b3IoaXRlclByb3RvLCByZXR1cm5UaGlzKTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxyXG4gIEl0ZXJhdG9yc1tOQU1FXSA9IGl0ZXI7XHJcbiAgLy8gRkYgJiB2OCBmaXhcclxuICBJdGVyYXRvcnNbTkFNRSArICcgSXRlcmF0b3InXSA9IHJldHVyblRoaXM7XHJcbiAgcmV0dXJuIGl0ZXI7XHJcbn1cclxuZnVuY3Rpb24gZGVmaW5lU3RkSXRlcmF0b3JzKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQpe1xyXG4gIGZ1bmN0aW9uIGNyZWF0ZUl0ZXIoa2luZCl7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTtcclxuICAgIH1cclxuICB9XHJcbiAgY3JlYXRlSXRlcmF0b3IoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xyXG4gIHZhciBlbnRyaWVzID0gY3JlYXRlSXRlcihLRVkrVkFMVUUpXHJcbiAgICAsIHZhbHVlcyAgPSBjcmVhdGVJdGVyKFZBTFVFKTtcclxuICBpZihERUZBVUxUID09IFZBTFVFKXZhbHVlcyA9IGRlZmluZUl0ZXJhdG9yKEJhc2UsIE5BTUUsIHZhbHVlcywgJ3ZhbHVlcycpO1xyXG4gIGVsc2UgZW50cmllcyA9IGRlZmluZUl0ZXJhdG9yKEJhc2UsIE5BTUUsIGVudHJpZXMsICdlbnRyaWVzJyk7XHJcbiAgaWYoREVGQVVMVCl7XHJcbiAgICAkZGVmaW5lKFBST1RPICsgRk9SQ0VEICogQlVHR1lfSVRFUkFUT1JTLCBOQU1FLCB7XHJcbiAgICAgIGVudHJpZXM6IGVudHJpZXMsXHJcbiAgICAgIGtleXM6IElTX1NFVCA/IHZhbHVlcyA6IGNyZWF0ZUl0ZXIoS0VZKSxcclxuICAgICAgdmFsdWVzOiB2YWx1ZXNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBpdGVyUmVzdWx0KGRvbmUsIHZhbHVlKXtcclxuICByZXR1cm4ge3ZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lfTtcclxufVxyXG5mdW5jdGlvbiBpc0l0ZXJhYmxlKGl0KXtcclxuICB2YXIgTyAgICAgID0gT2JqZWN0KGl0KVxyXG4gICAgLCBTeW1ib2wgPSBnbG9iYWxbU1lNQk9MXVxyXG4gICAgLCBoYXNFeHQgPSAoU3ltYm9sICYmIFN5bWJvbFtJVEVSQVRPUl0gfHwgRkZfSVRFUkFUT1IpIGluIE87XHJcbiAgcmV0dXJuIGhhc0V4dCB8fCBTWU1CT0xfSVRFUkFUT1IgaW4gTyB8fCBoYXMoSXRlcmF0b3JzLCBjbGFzc29mKE8pKTtcclxufVxyXG5mdW5jdGlvbiBnZXRJdGVyYXRvcihpdCl7XHJcbiAgdmFyIFN5bWJvbCAgPSBnbG9iYWxbU1lNQk9MXVxyXG4gICAgLCBleHQgICAgID0gaXRbU3ltYm9sICYmIFN5bWJvbFtJVEVSQVRPUl0gfHwgRkZfSVRFUkFUT1JdXHJcbiAgICAsIGdldEl0ZXIgPSBleHQgfHwgaXRbU1lNQk9MX0lURVJBVE9SXSB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xyXG4gIHJldHVybiBhc3NlcnRPYmplY3QoZ2V0SXRlci5jYWxsKGl0KSk7XHJcbn1cclxuZnVuY3Rpb24gc3RlcENhbGwoZm4sIHZhbHVlLCBlbnRyaWVzKXtcclxuICByZXR1cm4gZW50cmllcyA/IGludm9rZShmbiwgdmFsdWUpIDogZm4odmFsdWUpO1xyXG59XHJcbmZ1bmN0aW9uIGNoZWNrRGFuZ2VySXRlckNsb3NpbmcoZm4pe1xyXG4gIHZhciBkYW5nZXIgPSB0cnVlO1xyXG4gIHZhciBPID0ge1xyXG4gICAgbmV4dDogZnVuY3Rpb24oKXsgdGhyb3cgMSB9LFxyXG4gICAgJ3JldHVybic6IGZ1bmN0aW9uKCl7IGRhbmdlciA9IGZhbHNlIH1cclxuICB9O1xyXG4gIE9bU1lNQk9MX0lURVJBVE9SXSA9IHJldHVyblRoaXM7XHJcbiAgdHJ5IHtcclxuICAgIGZuKE8pO1xyXG4gIH0gY2F0Y2goZSl7fVxyXG4gIHJldHVybiBkYW5nZXI7XHJcbn1cclxuZnVuY3Rpb24gY2xvc2VJdGVyYXRvcihpdGVyYXRvcil7XHJcbiAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcclxuICBpZihyZXQgIT09IHVuZGVmaW5lZClyZXQuY2FsbChpdGVyYXRvcik7XHJcbn1cclxuZnVuY3Rpb24gc2FmZUl0ZXJDbG9zZShleGVjLCBpdGVyYXRvcil7XHJcbiAgdHJ5IHtcclxuICAgIGV4ZWMoaXRlcmF0b3IpO1xyXG4gIH0gY2F0Y2goZSl7XHJcbiAgICBjbG9zZUl0ZXJhdG9yKGl0ZXJhdG9yKTtcclxuICAgIHRocm93IGU7XHJcbiAgfVxyXG59XHJcbmZ1bmN0aW9uIGZvck9mKGl0ZXJhYmxlLCBlbnRyaWVzLCBmbiwgdGhhdCl7XHJcbiAgc2FmZUl0ZXJDbG9zZShmdW5jdGlvbihpdGVyYXRvcil7XHJcbiAgICB2YXIgZiA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKVxyXG4gICAgICAsIHN0ZXA7XHJcbiAgICB3aGlsZSghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpaWYoc3RlcENhbGwoZiwgc3RlcC52YWx1ZSwgZW50cmllcykgPT09IGZhbHNlKXtcclxuICAgICAgcmV0dXJuIGNsb3NlSXRlcmF0b3IoaXRlcmF0b3IpO1xyXG4gICAgfVxyXG4gIH0sIGdldEl0ZXJhdG9yKGl0ZXJhYmxlKSk7XHJcbn1cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogZXM2LnN5bWJvbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gRUNNQVNjcmlwdCA2IHN5bWJvbHMgc2hpbVxyXG4hZnVuY3Rpb24oVEFHLCBTeW1ib2xSZWdpc3RyeSwgQWxsU3ltYm9scywgc2V0dGVyKXtcclxuICAvLyAxOS40LjEuMSBTeW1ib2woW2Rlc2NyaXB0aW9uXSlcclxuICBpZighaXNOYXRpdmUoU3ltYm9sKSl7XHJcbiAgICBTeW1ib2wgPSBmdW5jdGlvbihkZXNjcmlwdGlvbil7XHJcbiAgICAgIGFzc2VydCghKHRoaXMgaW5zdGFuY2VvZiBTeW1ib2wpLCBTWU1CT0wgKyAnIGlzIG5vdCBhICcgKyBDT05TVFJVQ1RPUik7XHJcbiAgICAgIHZhciB0YWcgPSB1aWQoZGVzY3JpcHRpb24pXHJcbiAgICAgICAgLCBzeW0gPSBzZXQoY3JlYXRlKFN5bWJvbFtQUk9UT1RZUEVdKSwgVEFHLCB0YWcpO1xyXG4gICAgICBBbGxTeW1ib2xzW3RhZ10gPSBzeW07XHJcbiAgICAgIERFU0MgJiYgc2V0dGVyICYmIGRlZmluZVByb3BlcnR5KE9iamVjdFByb3RvLCB0YWcsIHtcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSl7XHJcbiAgICAgICAgICBoaWRkZW4odGhpcywgdGFnLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIHN5bTtcclxuICAgIH1cclxuICAgIGhpZGRlbihTeW1ib2xbUFJPVE9UWVBFXSwgVE9fU1RSSU5HLCBmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4gdGhpc1tUQUddO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gICRkZWZpbmUoR0xPQkFMICsgV1JBUCwge1N5bWJvbDogU3ltYm9sfSk7XHJcbiAgXHJcbiAgdmFyIHN5bWJvbFN0YXRpY3MgPSB7XHJcbiAgICAvLyAxOS40LjIuMSBTeW1ib2wuZm9yKGtleSlcclxuICAgICdmb3InOiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICByZXR1cm4gaGFzKFN5bWJvbFJlZ2lzdHJ5LCBrZXkgKz0gJycpXHJcbiAgICAgICAgPyBTeW1ib2xSZWdpc3RyeVtrZXldXHJcbiAgICAgICAgOiBTeW1ib2xSZWdpc3RyeVtrZXldID0gU3ltYm9sKGtleSk7XHJcbiAgICB9LFxyXG4gICAgLy8gMTkuNC4yLjQgU3ltYm9sLml0ZXJhdG9yXHJcbiAgICBpdGVyYXRvcjogU1lNQk9MX0lURVJBVE9SIHx8IGdldFdlbGxLbm93blN5bWJvbChJVEVSQVRPUiksXHJcbiAgICAvLyAxOS40LjIuNSBTeW1ib2wua2V5Rm9yKHN5bSlcclxuICAgIGtleUZvcjogcGFydC5jYWxsKGtleU9mLCBTeW1ib2xSZWdpc3RyeSksXHJcbiAgICAvLyAxOS40LjIuMTAgU3ltYm9sLnNwZWNpZXNcclxuICAgIHNwZWNpZXM6IFNZTUJPTF9TUEVDSUVTLFxyXG4gICAgLy8gMTkuNC4yLjEzIFN5bWJvbC50b1N0cmluZ1RhZ1xyXG4gICAgdG9TdHJpbmdUYWc6IFNZTUJPTF9UQUcgPSBnZXRXZWxsS25vd25TeW1ib2woVE9fU1RSSU5HX1RBRywgdHJ1ZSksXHJcbiAgICAvLyAxOS40LjIuMTQgU3ltYm9sLnVuc2NvcGFibGVzXHJcbiAgICB1bnNjb3BhYmxlczogU1lNQk9MX1VOU0NPUEFCTEVTLFxyXG4gICAgcHVyZTogc2FmZVN5bWJvbCxcclxuICAgIHNldDogc2V0LFxyXG4gICAgdXNlU2V0dGVyOiBmdW5jdGlvbigpe3NldHRlciA9IHRydWV9LFxyXG4gICAgdXNlU2ltcGxlOiBmdW5jdGlvbigpe3NldHRlciA9IGZhbHNlfVxyXG4gIH07XHJcbiAgLy8gMTkuNC4yLjIgU3ltYm9sLmhhc0luc3RhbmNlXHJcbiAgLy8gMTkuNC4yLjMgU3ltYm9sLmlzQ29uY2F0U3ByZWFkYWJsZVxyXG4gIC8vIDE5LjQuMi42IFN5bWJvbC5tYXRjaFxyXG4gIC8vIDE5LjQuMi44IFN5bWJvbC5yZXBsYWNlXHJcbiAgLy8gMTkuNC4yLjkgU3ltYm9sLnNlYXJjaFxyXG4gIC8vIDE5LjQuMi4xMSBTeW1ib2wuc3BsaXRcclxuICAvLyAxOS40LjIuMTIgU3ltYm9sLnRvUHJpbWl0aXZlXHJcbiAgZm9yRWFjaC5jYWxsKGFycmF5KCdoYXNJbnN0YW5jZSxpc0NvbmNhdFNwcmVhZGFibGUsbWF0Y2gscmVwbGFjZSxzZWFyY2gsc3BsaXQsdG9QcmltaXRpdmUnKSxcclxuICAgIGZ1bmN0aW9uKGl0KXtcclxuICAgICAgc3ltYm9sU3RhdGljc1tpdF0gPSBnZXRXZWxsS25vd25TeW1ib2woaXQpO1xyXG4gICAgfVxyXG4gICk7XHJcbiAgJGRlZmluZShTVEFUSUMsIFNZTUJPTCwgc3ltYm9sU3RhdGljcyk7XHJcbiAgXHJcbiAgc2V0VG9TdHJpbmdUYWcoU3ltYm9sLCBTWU1CT0wpO1xyXG4gIFxyXG4gICRkZWZpbmUoU1RBVElDICsgRk9SQ0VEICogIWlzTmF0aXZlKFN5bWJvbCksIE9CSkVDVCwge1xyXG4gICAgLy8gMTkuMS4yLjcgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcclxuICAgIGdldE93blByb3BlcnR5TmFtZXM6IGZ1bmN0aW9uKGl0KXtcclxuICAgICAgdmFyIG5hbWVzID0gZ2V0TmFtZXModG9PYmplY3QoaXQpKSwgcmVzdWx0ID0gW10sIGtleSwgaSA9IDA7XHJcbiAgICAgIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pIHx8IHJlc3VsdC5wdXNoKGtleSk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9LFxyXG4gICAgLy8gMTkuMS4yLjggT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhPKVxyXG4gICAgZ2V0T3duUHJvcGVydHlTeW1ib2xzOiBmdW5jdGlvbihpdCl7XHJcbiAgICAgIHZhciBuYW1lcyA9IGdldE5hbWVzKHRvT2JqZWN0KGl0KSksIHJlc3VsdCA9IFtdLCBrZXksIGkgPSAwO1xyXG4gICAgICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSAmJiByZXN1bHQucHVzaChBbGxTeW1ib2xzW2tleV0pO1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIFxyXG4gIC8vIDIwLjIuMS45IE1hdGhbQEB0b1N0cmluZ1RhZ11cclxuICBzZXRUb1N0cmluZ1RhZyhNYXRoLCBNQVRILCB0cnVlKTtcclxuICAvLyAyNC4zLjMgSlNPTltAQHRvU3RyaW5nVGFnXVxyXG4gIHNldFRvU3RyaW5nVGFnKGdsb2JhbC5KU09OLCAnSlNPTicsIHRydWUpO1xyXG59KHNhZmVTeW1ib2woJ3RhZycpLCB7fSwge30sIHRydWUpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczYub2JqZWN0LnN0YXRpY3MgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oKXtcclxuICB2YXIgb2JqZWN0U3RhdGljID0ge1xyXG4gICAgLy8gMTkuMS4zLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSlcclxuICAgIGFzc2lnbjogYXNzaWduLFxyXG4gICAgLy8gMTkuMS4zLjEwIE9iamVjdC5pcyh2YWx1ZTEsIHZhbHVlMilcclxuICAgIGlzOiBmdW5jdGlvbih4LCB5KXtcclxuICAgICAgcmV0dXJuIHggPT09IHkgPyB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geSA6IHggIT0geCAmJiB5ICE9IHk7XHJcbiAgICB9XHJcbiAgfTtcclxuICAvLyAxOS4xLjMuMTkgT2JqZWN0LnNldFByb3RvdHlwZU9mKE8sIHByb3RvKVxyXG4gIC8vIFdvcmtzIHdpdGggX19wcm90b19fIG9ubHkuIE9sZCB2OCBjYW4ndCB3b3JrcyB3aXRoIG51bGwgcHJvdG8gb2JqZWN0cy5cclxuICAnX19wcm90b19fJyBpbiBPYmplY3RQcm90byAmJiBmdW5jdGlvbihidWdneSwgc2V0KXtcclxuICAgIHRyeSB7XHJcbiAgICAgIHNldCA9IGN0eChjYWxsLCBnZXRPd25EZXNjcmlwdG9yKE9iamVjdFByb3RvLCAnX19wcm90b19fJykuc2V0LCAyKTtcclxuICAgICAgc2V0KHt9LCBBcnJheVByb3RvKTtcclxuICAgIH0gY2F0Y2goZSl7IGJ1Z2d5ID0gdHJ1ZSB9XHJcbiAgICBvYmplY3RTdGF0aWMuc2V0UHJvdG90eXBlT2YgPSBzZXRQcm90b3R5cGVPZiA9IHNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uKE8sIHByb3RvKXtcclxuICAgICAgYXNzZXJ0T2JqZWN0KE8pO1xyXG4gICAgICBhc3NlcnQocHJvdG8gPT09IG51bGwgfHwgaXNPYmplY3QocHJvdG8pLCBwcm90bywgXCI6IGNhbid0IHNldCBhcyBwcm90b3R5cGUhXCIpO1xyXG4gICAgICBpZihidWdneSlPLl9fcHJvdG9fXyA9IHByb3RvO1xyXG4gICAgICBlbHNlIHNldChPLCBwcm90byk7XHJcbiAgICAgIHJldHVybiBPO1xyXG4gICAgfVxyXG4gIH0oKTtcclxuICAkZGVmaW5lKFNUQVRJQywgT0JKRUNULCBvYmplY3RTdGF0aWMpO1xyXG59KCk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNi5vYmplY3Quc3RhdGljcy1hY2NlcHQtcHJpbWl0aXZlcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbigpe1xyXG4gIC8vIE9iamVjdCBzdGF0aWMgbWV0aG9kcyBhY2NlcHQgcHJpbWl0aXZlc1xyXG4gIGZ1bmN0aW9uIHdyYXBPYmplY3RNZXRob2Qoa2V5LCBNT0RFKXtcclxuICAgIHZhciBmbiAgPSBPYmplY3Rba2V5XVxyXG4gICAgICAsIGV4cCA9IGNvcmVbT0JKRUNUXVtrZXldXHJcbiAgICAgICwgZiAgID0gMFxyXG4gICAgICAsIG8gICA9IHt9O1xyXG4gICAgaWYoIWV4cCB8fCBpc05hdGl2ZShleHApKXtcclxuICAgICAgb1trZXldID0gTU9ERSA9PSAxID8gZnVuY3Rpb24oaXQpe1xyXG4gICAgICAgIHJldHVybiBpc09iamVjdChpdCkgPyBmbihpdCkgOiBpdDtcclxuICAgICAgfSA6IE1PREUgPT0gMiA/IGZ1bmN0aW9uKGl0KXtcclxuICAgICAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gZm4oaXQpIDogdHJ1ZTtcclxuICAgICAgfSA6IE1PREUgPT0gMyA/IGZ1bmN0aW9uKGl0KXtcclxuICAgICAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gZm4oaXQpIDogZmFsc2U7XHJcbiAgICAgIH0gOiBNT0RFID09IDQgPyBmdW5jdGlvbihpdCwga2V5KXtcclxuICAgICAgICByZXR1cm4gZm4odG9PYmplY3QoaXQpLCBrZXkpO1xyXG4gICAgICB9IDogZnVuY3Rpb24oaXQpe1xyXG4gICAgICAgIHJldHVybiBmbih0b09iamVjdChpdCkpO1xyXG4gICAgICB9O1xyXG4gICAgICB0cnkgeyBmbihET1QpIH1cclxuICAgICAgY2F0Y2goZSl7IGYgPSAxIH1cclxuICAgICAgJGRlZmluZShTVEFUSUMgKyBGT1JDRUQgKiBmLCBPQkpFQ1QsIG8pO1xyXG4gICAgfVxyXG4gIH1cclxuICB3cmFwT2JqZWN0TWV0aG9kKCdmcmVlemUnLCAxKTtcclxuICB3cmFwT2JqZWN0TWV0aG9kKCdzZWFsJywgMSk7XHJcbiAgd3JhcE9iamVjdE1ldGhvZCgncHJldmVudEV4dGVuc2lvbnMnLCAxKTtcclxuICB3cmFwT2JqZWN0TWV0aG9kKCdpc0Zyb3plbicsIDIpO1xyXG4gIHdyYXBPYmplY3RNZXRob2QoJ2lzU2VhbGVkJywgMik7XHJcbiAgd3JhcE9iamVjdE1ldGhvZCgnaXNFeHRlbnNpYmxlJywgMyk7XHJcbiAgd3JhcE9iamVjdE1ldGhvZCgnZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJywgNCk7XHJcbiAgd3JhcE9iamVjdE1ldGhvZCgnZ2V0UHJvdG90eXBlT2YnKTtcclxuICB3cmFwT2JqZWN0TWV0aG9kKCdrZXlzJyk7XHJcbiAgd3JhcE9iamVjdE1ldGhvZCgnZ2V0T3duUHJvcGVydHlOYW1lcycpO1xyXG59KCk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNi5udW1iZXIuc3RhdGljcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbihpc0ludGVnZXIpe1xyXG4gICRkZWZpbmUoU1RBVElDLCBOVU1CRVIsIHtcclxuICAgIC8vIDIwLjEuMi4xIE51bWJlci5FUFNJTE9OXHJcbiAgICBFUFNJTE9OOiBwb3coMiwgLTUyKSxcclxuICAgIC8vIDIwLjEuMi4yIE51bWJlci5pc0Zpbml0ZShudW1iZXIpXHJcbiAgICBpc0Zpbml0ZTogZnVuY3Rpb24oaXQpe1xyXG4gICAgICByZXR1cm4gdHlwZW9mIGl0ID09ICdudW1iZXInICYmIGlzRmluaXRlKGl0KTtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4xLjIuMyBOdW1iZXIuaXNJbnRlZ2VyKG51bWJlcilcclxuICAgIGlzSW50ZWdlcjogaXNJbnRlZ2VyLFxyXG4gICAgLy8gMjAuMS4yLjQgTnVtYmVyLmlzTmFOKG51bWJlcilcclxuICAgIGlzTmFOOiBzYW1lTmFOLFxyXG4gICAgLy8gMjAuMS4yLjUgTnVtYmVyLmlzU2FmZUludGVnZXIobnVtYmVyKVxyXG4gICAgaXNTYWZlSW50ZWdlcjogZnVuY3Rpb24obnVtYmVyKXtcclxuICAgICAgcmV0dXJuIGlzSW50ZWdlcihudW1iZXIpICYmIGFicyhudW1iZXIpIDw9IE1BWF9TQUZFX0lOVEVHRVI7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMS4yLjYgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcclxuICAgIE1BWF9TQUZFX0lOVEVHRVI6IE1BWF9TQUZFX0lOVEVHRVIsXHJcbiAgICAvLyAyMC4xLjIuMTAgTnVtYmVyLk1JTl9TQUZFX0lOVEVHRVJcclxuICAgIE1JTl9TQUZFX0lOVEVHRVI6IC1NQVhfU0FGRV9JTlRFR0VSLFxyXG4gICAgLy8gMjAuMS4yLjEyIE51bWJlci5wYXJzZUZsb2F0KHN0cmluZylcclxuICAgIHBhcnNlRmxvYXQ6IHBhcnNlRmxvYXQsXHJcbiAgICAvLyAyMC4xLjIuMTMgTnVtYmVyLnBhcnNlSW50KHN0cmluZywgcmFkaXgpXHJcbiAgICBwYXJzZUludDogcGFyc2VJbnRcclxuICB9KTtcclxuLy8gMjAuMS4yLjMgTnVtYmVyLmlzSW50ZWdlcihudW1iZXIpXHJcbn0oTnVtYmVyLmlzSW50ZWdlciB8fCBmdW5jdGlvbihpdCl7XHJcbiAgcmV0dXJuICFpc09iamVjdChpdCkgJiYgaXNGaW5pdGUoaXQpICYmIGZsb29yKGl0KSA9PT0gaXQ7XHJcbn0pO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczYubWF0aCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBFQ01BU2NyaXB0IDYgc2hpbVxyXG4hZnVuY3Rpb24oKXtcclxuICAvLyAyMC4yLjIuMjggTWF0aC5zaWduKHgpXHJcbiAgdmFyIEUgICAgPSBNYXRoLkVcclxuICAgICwgZXhwICA9IE1hdGguZXhwXHJcbiAgICAsIGxvZyAgPSBNYXRoLmxvZ1xyXG4gICAgLCBzcXJ0ID0gTWF0aC5zcXJ0XHJcbiAgICAsIHNpZ24gPSBNYXRoLnNpZ24gfHwgZnVuY3Rpb24oeCl7XHJcbiAgICAgICAgcmV0dXJuICh4ID0gK3gpID09IDAgfHwgeCAhPSB4ID8geCA6IHggPCAwID8gLTEgOiAxO1xyXG4gICAgICB9O1xyXG4gIFxyXG4gIC8vIDIwLjIuMi41IE1hdGguYXNpbmgoeClcclxuICBmdW5jdGlvbiBhc2luaCh4KXtcclxuICAgIHJldHVybiAhaXNGaW5pdGUoeCA9ICt4KSB8fCB4ID09IDAgPyB4IDogeCA8IDAgPyAtYXNpbmgoLXgpIDogbG9nKHggKyBzcXJ0KHggKiB4ICsgMSkpO1xyXG4gIH1cclxuICAvLyAyMC4yLjIuMTQgTWF0aC5leHBtMSh4KVxyXG4gIGZ1bmN0aW9uIGV4cG0xKHgpe1xyXG4gICAgcmV0dXJuICh4ID0gK3gpID09IDAgPyB4IDogeCA+IC0xZS02ICYmIHggPCAxZS02ID8geCArIHggKiB4IC8gMiA6IGV4cCh4KSAtIDE7XHJcbiAgfVxyXG4gICAgXHJcbiAgJGRlZmluZShTVEFUSUMsIE1BVEgsIHtcclxuICAgIC8vIDIwLjIuMi4zIE1hdGguYWNvc2goeClcclxuICAgIGFjb3NoOiBmdW5jdGlvbih4KXtcclxuICAgICAgcmV0dXJuICh4ID0gK3gpIDwgMSA/IE5hTiA6IGlzRmluaXRlKHgpID8gbG9nKHggLyBFICsgc3FydCh4ICsgMSkgKiBzcXJ0KHggLSAxKSAvIEUpICsgMSA6IHg7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjUgTWF0aC5hc2luaCh4KVxyXG4gICAgYXNpbmg6IGFzaW5oLFxyXG4gICAgLy8gMjAuMi4yLjcgTWF0aC5hdGFuaCh4KVxyXG4gICAgYXRhbmg6IGZ1bmN0aW9uKHgpe1xyXG4gICAgICByZXR1cm4gKHggPSAreCkgPT0gMCA/IHggOiBsb2coKDEgKyB4KSAvICgxIC0geCkpIC8gMjtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuOSBNYXRoLmNicnQoeClcclxuICAgIGNicnQ6IGZ1bmN0aW9uKHgpe1xyXG4gICAgICByZXR1cm4gc2lnbih4ID0gK3gpICogcG93KGFicyh4KSwgMSAvIDMpO1xyXG4gICAgfSxcclxuICAgIC8vIDIwLjIuMi4xMSBNYXRoLmNsejMyKHgpXHJcbiAgICBjbHozMjogZnVuY3Rpb24oeCl7XHJcbiAgICAgIHJldHVybiAoeCA+Pj49IDApID8gMzIgLSB4W1RPX1NUUklOR10oMikubGVuZ3RoIDogMzI7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjEyIE1hdGguY29zaCh4KVxyXG4gICAgY29zaDogZnVuY3Rpb24oeCl7XHJcbiAgICAgIHJldHVybiAoZXhwKHggPSAreCkgKyBleHAoLXgpKSAvIDI7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjE0IE1hdGguZXhwbTEoeClcclxuICAgIGV4cG0xOiBleHBtMSxcclxuICAgIC8vIDIwLjIuMi4xNiBNYXRoLmZyb3VuZCh4KVxyXG4gICAgLy8gVE9ETzogZmFsbGJhY2sgZm9yIElFOS1cclxuICAgIGZyb3VuZDogZnVuY3Rpb24oeCl7XHJcbiAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFt4XSlbMF07XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjE3IE1hdGguaHlwb3QoW3ZhbHVlMVssIHZhbHVlMlssIOKApiBdXV0pXHJcbiAgICBoeXBvdDogZnVuY3Rpb24odmFsdWUxLCB2YWx1ZTIpe1xyXG4gICAgICB2YXIgc3VtICA9IDBcclxuICAgICAgICAsIGxlbjEgPSBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICAgLCBsZW4yID0gbGVuMVxyXG4gICAgICAgICwgYXJncyA9IEFycmF5KGxlbjEpXHJcbiAgICAgICAgLCBsYXJnID0gLUluZmluaXR5XHJcbiAgICAgICAgLCBhcmc7XHJcbiAgICAgIHdoaWxlKGxlbjEtLSl7XHJcbiAgICAgICAgYXJnID0gYXJnc1tsZW4xXSA9ICthcmd1bWVudHNbbGVuMV07XHJcbiAgICAgICAgaWYoYXJnID09IEluZmluaXR5IHx8IGFyZyA9PSAtSW5maW5pdHkpcmV0dXJuIEluZmluaXR5O1xyXG4gICAgICAgIGlmKGFyZyA+IGxhcmcpbGFyZyA9IGFyZztcclxuICAgICAgfVxyXG4gICAgICBsYXJnID0gYXJnIHx8IDE7XHJcbiAgICAgIHdoaWxlKGxlbjItLSlzdW0gKz0gcG93KGFyZ3NbbGVuMl0gLyBsYXJnLCAyKTtcclxuICAgICAgcmV0dXJuIGxhcmcgKiBzcXJ0KHN1bSk7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjE4IE1hdGguaW11bCh4LCB5KVxyXG4gICAgaW11bDogZnVuY3Rpb24oeCwgeSl7XHJcbiAgICAgIHZhciBVSW50MTYgPSAweGZmZmZcclxuICAgICAgICAsIHhuID0gK3hcclxuICAgICAgICAsIHluID0gK3lcclxuICAgICAgICAsIHhsID0gVUludDE2ICYgeG5cclxuICAgICAgICAsIHlsID0gVUludDE2ICYgeW47XHJcbiAgICAgIHJldHVybiAwIHwgeGwgKiB5bCArICgoVUludDE2ICYgeG4gPj4+IDE2KSAqIHlsICsgeGwgKiAoVUludDE2ICYgeW4gPj4+IDE2KSA8PCAxNiA+Pj4gMCk7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjIwIE1hdGgubG9nMXAoeClcclxuICAgIGxvZzFwOiBmdW5jdGlvbih4KXtcclxuICAgICAgcmV0dXJuICh4ID0gK3gpID4gLTFlLTggJiYgeCA8IDFlLTggPyB4IC0geCAqIHggLyAyIDogbG9nKDEgKyB4KTtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuMjEgTWF0aC5sb2cxMCh4KVxyXG4gICAgbG9nMTA6IGZ1bmN0aW9uKHgpe1xyXG4gICAgICByZXR1cm4gbG9nKHgpIC8gTWF0aC5MTjEwO1xyXG4gICAgfSxcclxuICAgIC8vIDIwLjIuMi4yMiBNYXRoLmxvZzIoeClcclxuICAgIGxvZzI6IGZ1bmN0aW9uKHgpe1xyXG4gICAgICByZXR1cm4gbG9nKHgpIC8gTWF0aC5MTjI7XHJcbiAgICB9LFxyXG4gICAgLy8gMjAuMi4yLjI4IE1hdGguc2lnbih4KVxyXG4gICAgc2lnbjogc2lnbixcclxuICAgIC8vIDIwLjIuMi4zMCBNYXRoLnNpbmgoeClcclxuICAgIHNpbmg6IGZ1bmN0aW9uKHgpe1xyXG4gICAgICByZXR1cm4gKGFicyh4ID0gK3gpIDwgMSkgPyAoZXhwbTEoeCkgLSBleHBtMSgteCkpIC8gMiA6IChleHAoeCAtIDEpIC0gZXhwKC14IC0gMSkpICogKEUgLyAyKTtcclxuICAgIH0sXHJcbiAgICAvLyAyMC4yLjIuMzMgTWF0aC50YW5oKHgpXHJcbiAgICB0YW5oOiBmdW5jdGlvbih4KXtcclxuICAgICAgdmFyIGEgPSBleHBtMSh4ID0gK3gpXHJcbiAgICAgICAgLCBiID0gZXhwbTEoLXgpO1xyXG4gICAgICByZXR1cm4gYSA9PSBJbmZpbml0eSA/IDEgOiBiID09IEluZmluaXR5ID8gLTEgOiAoYSAtIGIpIC8gKGV4cCh4KSArIGV4cCgteCkpO1xyXG4gICAgfSxcclxuICAgIC8vIDIwLjIuMi4zNCBNYXRoLnRydW5jKHgpXHJcbiAgICB0cnVuYzogdHJ1bmNcclxuICB9KTtcclxufSgpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczYuc3RyaW5nICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oZnJvbUNoYXJDb2RlKXtcclxuICBmdW5jdGlvbiBhc3NlcnROb3RSZWdFeHAoaXQpe1xyXG4gICAgaWYoY29mKGl0KSA9PSBSRUdFWFApdGhyb3cgVHlwZUVycm9yKCk7XHJcbiAgfVxyXG4gIFxyXG4gICRkZWZpbmUoU1RBVElDLCBTVFJJTkcsIHtcclxuICAgIC8vIDIxLjEuMi4yIFN0cmluZy5mcm9tQ29kZVBvaW50KC4uLmNvZGVQb2ludHMpXHJcbiAgICBmcm9tQ29kZVBvaW50OiBmdW5jdGlvbih4KXtcclxuICAgICAgdmFyIHJlcyA9IFtdXHJcbiAgICAgICAgLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICAgLCBpICAgPSAwXHJcbiAgICAgICAgLCBjb2RlXHJcbiAgICAgIHdoaWxlKGxlbiA+IGkpe1xyXG4gICAgICAgIGNvZGUgPSArYXJndW1lbnRzW2krK107XHJcbiAgICAgICAgaWYodG9JbmRleChjb2RlLCAweDEwZmZmZikgIT09IGNvZGUpdGhyb3cgUmFuZ2VFcnJvcihjb2RlICsgJyBpcyBub3QgYSB2YWxpZCBjb2RlIHBvaW50Jyk7XHJcbiAgICAgICAgcmVzLnB1c2goY29kZSA8IDB4MTAwMDBcclxuICAgICAgICAgID8gZnJvbUNoYXJDb2RlKGNvZGUpXHJcbiAgICAgICAgICA6IGZyb21DaGFyQ29kZSgoKGNvZGUgLT0gMHgxMDAwMCkgPj4gMTApICsgMHhkODAwLCBjb2RlICUgMHg0MDAgKyAweGRjMDApXHJcbiAgICAgICAgKTtcclxuICAgICAgfSByZXR1cm4gcmVzLmpvaW4oJycpO1xyXG4gICAgfSxcclxuICAgIC8vIDIxLjEuMi40IFN0cmluZy5yYXcoY2FsbFNpdGUsIC4uLnN1YnN0aXR1dGlvbnMpXHJcbiAgICByYXc6IGZ1bmN0aW9uKGNhbGxTaXRlKXtcclxuICAgICAgdmFyIHJhdyA9IHRvT2JqZWN0KGNhbGxTaXRlLnJhdylcclxuICAgICAgICAsIGxlbiA9IHRvTGVuZ3RoKHJhdy5sZW5ndGgpXHJcbiAgICAgICAgLCBzbG4gPSBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICAgLCByZXMgPSBbXVxyXG4gICAgICAgICwgaSAgID0gMDtcclxuICAgICAgd2hpbGUobGVuID4gaSl7XHJcbiAgICAgICAgcmVzLnB1c2goU3RyaW5nKHJhd1tpKytdKSk7XHJcbiAgICAgICAgaWYoaSA8IHNsbilyZXMucHVzaChTdHJpbmcoYXJndW1lbnRzW2ldKSk7XHJcbiAgICAgIH0gcmV0dXJuIHJlcy5qb2luKCcnKTtcclxuICAgIH1cclxuICB9KTtcclxuICBcclxuICAkZGVmaW5lKFBST1RPLCBTVFJJTkcsIHtcclxuICAgIC8vIDIxLjEuMy4zIFN0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXQocG9zKVxyXG4gICAgY29kZVBvaW50QXQ6IGNyZWF0ZVBvaW50QXQoZmFsc2UpLFxyXG4gICAgLy8gMjEuMS4zLjYgU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aChzZWFyY2hTdHJpbmcgWywgZW5kUG9zaXRpb25dKVxyXG4gICAgZW5kc1dpdGg6IGZ1bmN0aW9uKHNlYXJjaFN0cmluZyAvKiwgZW5kUG9zaXRpb24gPSBAbGVuZ3RoICovKXtcclxuICAgICAgYXNzZXJ0Tm90UmVnRXhwKHNlYXJjaFN0cmluZyk7XHJcbiAgICAgIHZhciB0aGF0ID0gU3RyaW5nKGFzc2VydERlZmluZWQodGhpcykpXHJcbiAgICAgICAgLCBlbmRQb3NpdGlvbiA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgICwgbGVuID0gdG9MZW5ndGgodGhhdC5sZW5ndGgpXHJcbiAgICAgICAgLCBlbmQgPSBlbmRQb3NpdGlvbiA9PT0gdW5kZWZpbmVkID8gbGVuIDogbWluKHRvTGVuZ3RoKGVuZFBvc2l0aW9uKSwgbGVuKTtcclxuICAgICAgc2VhcmNoU3RyaW5nICs9ICcnO1xyXG4gICAgICByZXR1cm4gdGhhdC5zbGljZShlbmQgLSBzZWFyY2hTdHJpbmcubGVuZ3RoLCBlbmQpID09PSBzZWFyY2hTdHJpbmc7XHJcbiAgICB9LFxyXG4gICAgLy8gMjEuMS4zLjcgU3RyaW5nLnByb3RvdHlwZS5pbmNsdWRlcyhzZWFyY2hTdHJpbmcsIHBvc2l0aW9uID0gMClcclxuICAgIGluY2x1ZGVzOiBmdW5jdGlvbihzZWFyY2hTdHJpbmcgLyosIHBvc2l0aW9uID0gMCAqLyl7XHJcbiAgICAgIGFzc2VydE5vdFJlZ0V4cChzZWFyY2hTdHJpbmcpO1xyXG4gICAgICByZXR1cm4gISF+U3RyaW5nKGFzc2VydERlZmluZWQodGhpcykpLmluZGV4T2Yoc2VhcmNoU3RyaW5nLCBhcmd1bWVudHNbMV0pO1xyXG4gICAgfSxcclxuICAgIC8vIDIxLjEuMy4xMyBTdHJpbmcucHJvdG90eXBlLnJlcGVhdChjb3VudClcclxuICAgIHJlcGVhdDogZnVuY3Rpb24oY291bnQpe1xyXG4gICAgICB2YXIgc3RyID0gU3RyaW5nKGFzc2VydERlZmluZWQodGhpcykpXHJcbiAgICAgICAgLCByZXMgPSAnJ1xyXG4gICAgICAgICwgbiAgID0gdG9JbnRlZ2VyKGNvdW50KTtcclxuICAgICAgaWYoMCA+IG4gfHwgbiA9PSBJbmZpbml0eSl0aHJvdyBSYW5nZUVycm9yKFwiQ291bnQgY2FuJ3QgYmUgbmVnYXRpdmVcIik7XHJcbiAgICAgIGZvcig7biA+IDA7IChuID4+Pj0gMSkgJiYgKHN0ciArPSBzdHIpKWlmKG4gJiAxKXJlcyArPSBzdHI7XHJcbiAgICAgIHJldHVybiByZXM7XHJcbiAgICB9LFxyXG4gICAgLy8gMjEuMS4zLjE4IFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aChzZWFyY2hTdHJpbmcgWywgcG9zaXRpb24gXSlcclxuICAgIHN0YXJ0c1dpdGg6IGZ1bmN0aW9uKHNlYXJjaFN0cmluZyAvKiwgcG9zaXRpb24gPSAwICovKXtcclxuICAgICAgYXNzZXJ0Tm90UmVnRXhwKHNlYXJjaFN0cmluZyk7XHJcbiAgICAgIHZhciB0aGF0ICA9IFN0cmluZyhhc3NlcnREZWZpbmVkKHRoaXMpKVxyXG4gICAgICAgICwgaW5kZXggPSB0b0xlbmd0aChtaW4oYXJndW1lbnRzWzFdLCB0aGF0Lmxlbmd0aCkpO1xyXG4gICAgICBzZWFyY2hTdHJpbmcgKz0gJyc7XHJcbiAgICAgIHJldHVybiB0aGF0LnNsaWNlKGluZGV4LCBpbmRleCArIHNlYXJjaFN0cmluZy5sZW5ndGgpID09PSBzZWFyY2hTdHJpbmc7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn0oU3RyaW5nLmZyb21DaGFyQ29kZSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNi5hcnJheS5zdGF0aWNzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbigpe1xyXG4gICRkZWZpbmUoU1RBVElDICsgRk9SQ0VEICogY2hlY2tEYW5nZXJJdGVyQ2xvc2luZyhBcnJheS5mcm9tKSwgQVJSQVksIHtcclxuICAgIC8vIDIyLjEuMi4xIEFycmF5LmZyb20oYXJyYXlMaWtlLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZClcclxuICAgIGZyb206IGZ1bmN0aW9uKGFycmF5TGlrZS8qLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZCovKXtcclxuICAgICAgdmFyIE8gICAgICAgPSBPYmplY3QoYXNzZXJ0RGVmaW5lZChhcnJheUxpa2UpKVxyXG4gICAgICAgICwgbWFwZm4gICA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgICwgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWRcclxuICAgICAgICAsIGYgICAgICAgPSBtYXBwaW5nID8gY3R4KG1hcGZuLCBhcmd1bWVudHNbMl0sIDIpIDogdW5kZWZpbmVkXHJcbiAgICAgICAgLCBpbmRleCAgID0gMFxyXG4gICAgICAgICwgbGVuZ3RoLCByZXN1bHQsIHN0ZXA7XHJcbiAgICAgIGlmKGlzSXRlcmFibGUoTykpe1xyXG4gICAgICAgIHJlc3VsdCA9IG5ldyAoZ2VuZXJpYyh0aGlzLCBBcnJheSkpO1xyXG4gICAgICAgIHNhZmVJdGVyQ2xvc2UoZnVuY3Rpb24oaXRlcmF0b3Ipe1xyXG4gICAgICAgICAgZm9yKDsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyBpbmRleCsrKXtcclxuICAgICAgICAgICAgcmVzdWx0W2luZGV4XSA9IG1hcHBpbmcgPyBmKHN0ZXAudmFsdWUsIGluZGV4KSA6IHN0ZXAudmFsdWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgZ2V0SXRlcmF0b3IoTykpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdCA9IG5ldyAoZ2VuZXJpYyh0aGlzLCBBcnJheSkpKGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKSk7XHJcbiAgICAgICAgZm9yKDsgbGVuZ3RoID4gaW5kZXg7IGluZGV4Kyspe1xyXG4gICAgICAgICAgcmVzdWx0W2luZGV4XSA9IG1hcHBpbmcgPyBmKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmVzdWx0Lmxlbmd0aCA9IGluZGV4O1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIFxyXG4gICRkZWZpbmUoU1RBVElDLCBBUlJBWSwge1xyXG4gICAgLy8gMjIuMS4yLjMgQXJyYXkub2YoIC4uLml0ZW1zKVxyXG4gICAgb2Y6IGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xyXG4gICAgICB2YXIgaW5kZXggID0gMFxyXG4gICAgICAgICwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAgICwgcmVzdWx0ID0gbmV3IChnZW5lcmljKHRoaXMsIEFycmF5KSkobGVuZ3RoKTtcclxuICAgICAgd2hpbGUobGVuZ3RoID4gaW5kZXgpcmVzdWx0W2luZGV4XSA9IGFyZ3VtZW50c1tpbmRleCsrXTtcclxuICAgICAgcmVzdWx0Lmxlbmd0aCA9IGxlbmd0aDtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICB9KTtcclxuICBcclxuICBzZXRTcGVjaWVzKEFycmF5KTtcclxufSgpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczYuYXJyYXkucHJvdG90eXBlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oKXtcclxuICAkZGVmaW5lKFBST1RPLCBBUlJBWSwge1xyXG4gICAgLy8gMjIuMS4zLjMgQXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCwgZW5kID0gdGhpcy5sZW5ndGgpXHJcbiAgICBjb3B5V2l0aGluOiBmdW5jdGlvbih0YXJnZXQgLyogPSAwICovLCBzdGFydCAvKiA9IDAsIGVuZCA9IEBsZW5ndGggKi8pe1xyXG4gICAgICB2YXIgTyAgICAgPSBPYmplY3QoYXNzZXJ0RGVmaW5lZCh0aGlzKSlcclxuICAgICAgICAsIGxlbiAgID0gdG9MZW5ndGgoTy5sZW5ndGgpXHJcbiAgICAgICAgLCB0byAgICA9IHRvSW5kZXgodGFyZ2V0LCBsZW4pXHJcbiAgICAgICAgLCBmcm9tICA9IHRvSW5kZXgoc3RhcnQsIGxlbilcclxuICAgICAgICAsIGVuZCAgID0gYXJndW1lbnRzWzJdXHJcbiAgICAgICAgLCBmaW4gICA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogdG9JbmRleChlbmQsIGxlbilcclxuICAgICAgICAsIGNvdW50ID0gbWluKGZpbiAtIGZyb20sIGxlbiAtIHRvKVxyXG4gICAgICAgICwgaW5jICAgPSAxO1xyXG4gICAgICBpZihmcm9tIDwgdG8gJiYgdG8gPCBmcm9tICsgY291bnQpe1xyXG4gICAgICAgIGluYyAgPSAtMTtcclxuICAgICAgICBmcm9tID0gZnJvbSArIGNvdW50IC0gMTtcclxuICAgICAgICB0byAgID0gdG8gKyBjb3VudCAtIDE7XHJcbiAgICAgIH1cclxuICAgICAgd2hpbGUoY291bnQtLSA+IDApe1xyXG4gICAgICAgIGlmKGZyb20gaW4gTylPW3RvXSA9IE9bZnJvbV07XHJcbiAgICAgICAgZWxzZSBkZWxldGUgT1t0b107XHJcbiAgICAgICAgdG8gKz0gaW5jO1xyXG4gICAgICAgIGZyb20gKz0gaW5jO1xyXG4gICAgICB9IHJldHVybiBPO1xyXG4gICAgfSxcclxuICAgIC8vIDIyLjEuMy42IEFycmF5LnByb3RvdHlwZS5maWxsKHZhbHVlLCBzdGFydCA9IDAsIGVuZCA9IHRoaXMubGVuZ3RoKVxyXG4gICAgZmlsbDogZnVuY3Rpb24odmFsdWUgLyosIHN0YXJ0ID0gMCwgZW5kID0gQGxlbmd0aCAqLyl7XHJcbiAgICAgIHZhciBPICAgICAgPSBPYmplY3QoYXNzZXJ0RGVmaW5lZCh0aGlzKSlcclxuICAgICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxyXG4gICAgICAgICwgaW5kZXggID0gdG9JbmRleChhcmd1bWVudHNbMV0sIGxlbmd0aClcclxuICAgICAgICAsIGVuZCAgICA9IGFyZ3VtZW50c1syXVxyXG4gICAgICAgICwgZW5kUG9zID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0luZGV4KGVuZCwgbGVuZ3RoKTtcclxuICAgICAgd2hpbGUoZW5kUG9zID4gaW5kZXgpT1tpbmRleCsrXSA9IHZhbHVlO1xyXG4gICAgICByZXR1cm4gTztcclxuICAgIH0sXHJcbiAgICAvLyAyMi4xLjMuOCBBcnJheS5wcm90b3R5cGUuZmluZChwcmVkaWNhdGUsIHRoaXNBcmcgPSB1bmRlZmluZWQpXHJcbiAgICBmaW5kOiBjcmVhdGVBcnJheU1ldGhvZCg1KSxcclxuICAgIC8vIDIyLjEuMy45IEFycmF5LnByb3RvdHlwZS5maW5kSW5kZXgocHJlZGljYXRlLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxyXG4gICAgZmluZEluZGV4OiBjcmVhdGVBcnJheU1ldGhvZCg2KVxyXG4gIH0pO1xyXG4gIFxyXG4gIGlmKGZyYW1ld29yayl7XHJcbiAgICAvLyAyMi4xLjMuMzEgQXJyYXkucHJvdG90eXBlW0BAdW5zY29wYWJsZXNdXHJcbiAgICBmb3JFYWNoLmNhbGwoYXJyYXkoJ2ZpbmQsZmluZEluZGV4LGZpbGwsY29weVdpdGhpbixlbnRyaWVzLGtleXMsdmFsdWVzJyksIGZ1bmN0aW9uKGl0KXtcclxuICAgICAgQXJyYXlVbnNjb3BhYmxlc1tpdF0gPSB0cnVlO1xyXG4gICAgfSk7XHJcbiAgICBTWU1CT0xfVU5TQ09QQUJMRVMgaW4gQXJyYXlQcm90byB8fCBoaWRkZW4oQXJyYXlQcm90bywgU1lNQk9MX1VOU0NPUEFCTEVTLCBBcnJheVVuc2NvcGFibGVzKTtcclxuICB9XHJcbn0oKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogZXM2Lml0ZXJhdG9ycyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKGF0KXtcclxuICAvLyAyMi4xLjMuNCBBcnJheS5wcm90b3R5cGUuZW50cmllcygpXHJcbiAgLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcclxuICAvLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXHJcbiAgLy8gMjIuMS4zLjMwIEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXHJcbiAgZGVmaW5lU3RkSXRlcmF0b3JzKEFycmF5LCBBUlJBWSwgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xyXG4gICAgc2V0KHRoaXMsIElURVIsIHtvOiB0b09iamVjdChpdGVyYXRlZCksIGk6IDAsIGs6IGtpbmR9KTtcclxuICAvLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcclxuICB9LCBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGl0ZXIgID0gdGhpc1tJVEVSXVxyXG4gICAgICAsIE8gICAgID0gaXRlci5vXHJcbiAgICAgICwga2luZCAgPSBpdGVyLmtcclxuICAgICAgLCBpbmRleCA9IGl0ZXIuaSsrO1xyXG4gICAgaWYoIU8gfHwgaW5kZXggPj0gTy5sZW5ndGgpe1xyXG4gICAgICBpdGVyLm8gPSB1bmRlZmluZWQ7XHJcbiAgICAgIHJldHVybiBpdGVyUmVzdWx0KDEpO1xyXG4gICAgfVxyXG4gICAgaWYoa2luZCA9PSBLRVkpICByZXR1cm4gaXRlclJlc3VsdCgwLCBpbmRleCk7XHJcbiAgICBpZihraW5kID09IFZBTFVFKXJldHVybiBpdGVyUmVzdWx0KDAsIE9baW5kZXhdKTtcclxuICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZXJSZXN1bHQoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xyXG4gIH0sIFZBTFVFKTtcclxuICBcclxuICAvLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXHJcbiAgSXRlcmF0b3JzW0FSR1VNRU5UU10gPSBJdGVyYXRvcnNbQVJSQVldO1xyXG4gIFxyXG4gIC8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcclxuICBkZWZpbmVTdGRJdGVyYXRvcnMoU3RyaW5nLCBTVFJJTkcsIGZ1bmN0aW9uKGl0ZXJhdGVkKXtcclxuICAgIHNldCh0aGlzLCBJVEVSLCB7bzogU3RyaW5nKGl0ZXJhdGVkKSwgaTogMH0pO1xyXG4gIC8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcclxuICB9LCBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGl0ZXIgID0gdGhpc1tJVEVSXVxyXG4gICAgICAsIE8gICAgID0gaXRlci5vXHJcbiAgICAgICwgaW5kZXggPSBpdGVyLmlcclxuICAgICAgLCBwb2ludDtcclxuICAgIGlmKGluZGV4ID49IE8ubGVuZ3RoKXJldHVybiBpdGVyUmVzdWx0KDEpO1xyXG4gICAgcG9pbnQgPSBhdC5jYWxsKE8sIGluZGV4KTtcclxuICAgIGl0ZXIuaSArPSBwb2ludC5sZW5ndGg7XHJcbiAgICByZXR1cm4gaXRlclJlc3VsdCgwLCBwb2ludCk7XHJcbiAgfSk7XHJcbn0oY3JlYXRlUG9pbnRBdCh0cnVlKSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IHdlYi5pbW1lZGlhdGUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIHNldEltbWVkaWF0ZSBzaGltXHJcbi8vIE5vZGUuanMgMC45KyAmIElFMTArIGhhcyBzZXRJbW1lZGlhdGUsIGVsc2U6XHJcbmlzRnVuY3Rpb24oc2V0SW1tZWRpYXRlKSAmJiBpc0Z1bmN0aW9uKGNsZWFySW1tZWRpYXRlKSB8fCBmdW5jdGlvbihPTlJFQURZU1RBVEVDSEFOR0Upe1xyXG4gIHZhciBwb3N0TWVzc2FnZSAgICAgID0gZ2xvYmFsLnBvc3RNZXNzYWdlXHJcbiAgICAsIGFkZEV2ZW50TGlzdGVuZXIgPSBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lclxyXG4gICAgLCBNZXNzYWdlQ2hhbm5lbCAgID0gZ2xvYmFsLk1lc3NhZ2VDaGFubmVsXHJcbiAgICAsIGNvdW50ZXIgICAgICAgICAgPSAwXHJcbiAgICAsIHF1ZXVlICAgICAgICAgICAgPSB7fVxyXG4gICAgLCBkZWZlciwgY2hhbm5lbCwgcG9ydDtcclxuICBzZXRJbW1lZGlhdGUgPSBmdW5jdGlvbihmbil7XHJcbiAgICB2YXIgYXJncyA9IFtdLCBpID0gMTtcclxuICAgIHdoaWxlKGFyZ3VtZW50cy5sZW5ndGggPiBpKWFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XHJcbiAgICBxdWV1ZVsrK2NvdW50ZXJdID0gZnVuY3Rpb24oKXtcclxuICAgICAgaW52b2tlKGlzRnVuY3Rpb24oZm4pID8gZm4gOiBGdW5jdGlvbihmbiksIGFyZ3MpO1xyXG4gICAgfVxyXG4gICAgZGVmZXIoY291bnRlcik7XHJcbiAgICByZXR1cm4gY291bnRlcjtcclxuICB9XHJcbiAgY2xlYXJJbW1lZGlhdGUgPSBmdW5jdGlvbihpZCl7XHJcbiAgICBkZWxldGUgcXVldWVbaWRdO1xyXG4gIH1cclxuICBmdW5jdGlvbiBydW4oaWQpe1xyXG4gICAgaWYoaGFzKHF1ZXVlLCBpZCkpe1xyXG4gICAgICB2YXIgZm4gPSBxdWV1ZVtpZF07XHJcbiAgICAgIGRlbGV0ZSBxdWV1ZVtpZF07XHJcbiAgICAgIGZuKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGxpc3RuZXIoZXZlbnQpe1xyXG4gICAgcnVuKGV2ZW50LmRhdGEpO1xyXG4gIH1cclxuICAvLyBOb2RlLmpzIDAuOC1cclxuICBpZihOT0RFKXtcclxuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xyXG4gICAgICBuZXh0VGljayhwYXJ0LmNhbGwocnVuLCBpZCkpO1xyXG4gICAgfVxyXG4gIC8vIE1vZGVybiBicm93c2Vycywgc2tpcCBpbXBsZW1lbnRhdGlvbiBmb3IgV2ViV29ya2Vyc1xyXG4gIC8vIElFOCBoYXMgcG9zdE1lc3NhZ2UsIGJ1dCBpdCdzIHN5bmMgJiB0eXBlb2YgaXRzIHBvc3RNZXNzYWdlIGlzIG9iamVjdFxyXG4gIH0gZWxzZSBpZihhZGRFdmVudExpc3RlbmVyICYmIGlzRnVuY3Rpb24ocG9zdE1lc3NhZ2UpICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cyl7XHJcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcclxuICAgICAgcG9zdE1lc3NhZ2UoaWQsICcqJyk7XHJcbiAgICB9XHJcbiAgICBhZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgbGlzdG5lciwgZmFsc2UpO1xyXG4gIC8vIFdlYldvcmtlcnNcclxuICB9IGVsc2UgaWYoaXNGdW5jdGlvbihNZXNzYWdlQ2hhbm5lbCkpe1xyXG4gICAgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbDtcclxuICAgIHBvcnQgICAgPSBjaGFubmVsLnBvcnQyO1xyXG4gICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBsaXN0bmVyO1xyXG4gICAgZGVmZXIgPSBjdHgocG9ydC5wb3N0TWVzc2FnZSwgcG9ydCwgMSk7XHJcbiAgLy8gSUU4LVxyXG4gIH0gZWxzZSBpZihkb2N1bWVudCAmJiBPTlJFQURZU1RBVEVDSEFOR0UgaW4gZG9jdW1lbnRbQ1JFQVRFX0VMRU1FTlRdKCdzY3JpcHQnKSl7XHJcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcclxuICAgICAgaHRtbC5hcHBlbmRDaGlsZChkb2N1bWVudFtDUkVBVEVfRUxFTUVOVF0oJ3NjcmlwdCcpKVtPTlJFQURZU1RBVEVDSEFOR0VdID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHRoaXMpO1xyXG4gICAgICAgIHJ1bihpZCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAvLyBSZXN0IG9sZCBicm93c2Vyc1xyXG4gIH0gZWxzZSB7XHJcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcclxuICAgICAgc2V0VGltZW91dChydW4sIDAsIGlkKTtcclxuICAgIH1cclxuICB9XHJcbn0oJ29ucmVhZHlzdGF0ZWNoYW5nZScpO1xyXG4kZGVmaW5lKEdMT0JBTCArIEJJTkQsIHtcclxuICBzZXRJbW1lZGlhdGU6ICAgc2V0SW1tZWRpYXRlLFxyXG4gIGNsZWFySW1tZWRpYXRlOiBjbGVhckltbWVkaWF0ZVxyXG59KTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogZXM2LnByb21pc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gRVM2IHByb21pc2VzIHNoaW1cclxuLy8gQmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2dldGlmeS9uYXRpdmUtcHJvbWlzZS1vbmx5L1xyXG4hZnVuY3Rpb24oUHJvbWlzZSwgdGVzdCl7XHJcbiAgaXNGdW5jdGlvbihQcm9taXNlKSAmJiBpc0Z1bmN0aW9uKFByb21pc2UucmVzb2x2ZSlcclxuICAmJiBQcm9taXNlLnJlc29sdmUodGVzdCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKCl7fSkpID09IHRlc3RcclxuICB8fCBmdW5jdGlvbihhc2FwLCBSRUNPUkQpe1xyXG4gICAgZnVuY3Rpb24gaXNUaGVuYWJsZShpdCl7XHJcbiAgICAgIHZhciB0aGVuO1xyXG4gICAgICBpZihpc09iamVjdChpdCkpdGhlbiA9IGl0LnRoZW47XHJcbiAgICAgIHJldHVybiBpc0Z1bmN0aW9uKHRoZW4pID8gdGhlbiA6IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gaGFuZGxlZFJlamVjdGlvbk9ySGFzT25SZWplY3RlZChwcm9taXNlKXtcclxuICAgICAgdmFyIHJlY29yZCA9IHByb21pc2VbUkVDT1JEXVxyXG4gICAgICAgICwgY2hhaW4gID0gcmVjb3JkLmNcclxuICAgICAgICAsIGkgICAgICA9IDBcclxuICAgICAgICAsIHJlYWN0O1xyXG4gICAgICBpZihyZWNvcmQuaClyZXR1cm4gdHJ1ZTtcclxuICAgICAgd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSl7XHJcbiAgICAgICAgcmVhY3QgPSBjaGFpbltpKytdO1xyXG4gICAgICAgIGlmKHJlYWN0LmZhaWwgfHwgaGFuZGxlZFJlamVjdGlvbk9ySGFzT25SZWplY3RlZChyZWFjdC5QKSlyZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gbm90aWZ5KHJlY29yZCwgcmVqZWN0KXtcclxuICAgICAgdmFyIGNoYWluID0gcmVjb3JkLmM7XHJcbiAgICAgIGlmKHJlamVjdCB8fCBjaGFpbi5sZW5ndGgpYXNhcChmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBwcm9taXNlID0gcmVjb3JkLnBcclxuICAgICAgICAgICwgdmFsdWUgICA9IHJlY29yZC52XHJcbiAgICAgICAgICAsIG9rICAgICAgPSByZWNvcmQucyA9PSAxXHJcbiAgICAgICAgICAsIGkgICAgICAgPSAwO1xyXG4gICAgICAgIGlmKHJlamVjdCAmJiAhaGFuZGxlZFJlamVjdGlvbk9ySGFzT25SZWplY3RlZChwcm9taXNlKSl7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGlmKCFoYW5kbGVkUmVqZWN0aW9uT3JIYXNPblJlamVjdGVkKHByb21pc2UpKXtcclxuICAgICAgICAgICAgICBpZihOT0RFKXtcclxuICAgICAgICAgICAgICAgIGlmKCFwcm9jZXNzLmVtaXQoJ3VuaGFuZGxlZFJlamVjdGlvbicsIHZhbHVlLCBwcm9taXNlKSl7XHJcbiAgICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgbm9kZS5qcyBiZWhhdmlvclxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZihpc0Z1bmN0aW9uKGNvbnNvbGUuZXJyb3IpKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvbicsIHZhbHVlKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sIDFlMyk7XHJcbiAgICAgICAgfSBlbHNlIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpIWZ1bmN0aW9uKHJlYWN0KXtcclxuICAgICAgICAgIHZhciBjYiA9IG9rID8gcmVhY3Qub2sgOiByZWFjdC5mYWlsXHJcbiAgICAgICAgICAgICwgcmV0LCB0aGVuO1xyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYoY2Ipe1xyXG4gICAgICAgICAgICAgIGlmKCFvaylyZWNvcmQuaCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgcmV0ID0gY2IgPT09IHRydWUgPyB2YWx1ZSA6IGNiKHZhbHVlKTtcclxuICAgICAgICAgICAgICBpZihyZXQgPT09IHJlYWN0LlApe1xyXG4gICAgICAgICAgICAgICAgcmVhY3QucmVqKFR5cGVFcnJvcihQUk9NSVNFICsgJy1jaGFpbiBjeWNsZScpKTtcclxuICAgICAgICAgICAgICB9IGVsc2UgaWYodGhlbiA9IGlzVGhlbmFibGUocmV0KSl7XHJcbiAgICAgICAgICAgICAgICB0aGVuLmNhbGwocmV0LCByZWFjdC5yZXMsIHJlYWN0LnJlaik7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHJlYWN0LnJlcyhyZXQpO1xyXG4gICAgICAgICAgICB9IGVsc2UgcmVhY3QucmVqKHZhbHVlKTtcclxuICAgICAgICAgIH0gY2F0Y2goZXJyKXtcclxuICAgICAgICAgICAgcmVhY3QucmVqKGVycik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfShjaGFpbltpKytdKTtcclxuICAgICAgICBjaGFpbi5sZW5ndGggPSAwO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHJlc29sdmUodmFsdWUpe1xyXG4gICAgICB2YXIgcmVjb3JkID0gdGhpc1xyXG4gICAgICAgICwgdGhlbiwgd3JhcHBlcjtcclxuICAgICAgaWYocmVjb3JkLmQpcmV0dXJuO1xyXG4gICAgICByZWNvcmQuZCA9IHRydWU7XHJcbiAgICAgIHJlY29yZCA9IHJlY29yZC5yIHx8IHJlY29yZDsgLy8gdW53cmFwXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgaWYodGhlbiA9IGlzVGhlbmFibGUodmFsdWUpKXtcclxuICAgICAgICAgIHdyYXBwZXIgPSB7cjogcmVjb3JkLCBkOiBmYWxzZX07IC8vIHdyYXBcclxuICAgICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgY3R4KHJlc29sdmUsIHdyYXBwZXIsIDEpLCBjdHgocmVqZWN0LCB3cmFwcGVyLCAxKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlY29yZC52ID0gdmFsdWU7XHJcbiAgICAgICAgICByZWNvcmQucyA9IDE7XHJcbiAgICAgICAgICBub3RpZnkocmVjb3JkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2goZXJyKXtcclxuICAgICAgICByZWplY3QuY2FsbCh3cmFwcGVyIHx8IHtyOiByZWNvcmQsIGQ6IGZhbHNlfSwgZXJyKTsgLy8gd3JhcFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpe1xyXG4gICAgICB2YXIgcmVjb3JkID0gdGhpcztcclxuICAgICAgaWYocmVjb3JkLmQpcmV0dXJuO1xyXG4gICAgICByZWNvcmQuZCA9IHRydWU7XHJcbiAgICAgIHJlY29yZCA9IHJlY29yZC5yIHx8IHJlY29yZDsgLy8gdW53cmFwXHJcbiAgICAgIHJlY29yZC52ID0gdmFsdWU7XHJcbiAgICAgIHJlY29yZC5zID0gMjtcclxuICAgICAgbm90aWZ5KHJlY29yZCwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBnZXRDb25zdHJ1Y3RvcihDKXtcclxuICAgICAgdmFyIFMgPSBhc3NlcnRPYmplY3QoQylbU1lNQk9MX1NQRUNJRVNdO1xyXG4gICAgICByZXR1cm4gUyAhPSB1bmRlZmluZWQgPyBTIDogQztcclxuICAgIH1cclxuICAgIC8vIDI1LjQuMy4xIFByb21pc2UoZXhlY3V0b3IpXHJcbiAgICBQcm9taXNlID0gZnVuY3Rpb24oZXhlY3V0b3Ipe1xyXG4gICAgICBhc3NlcnRGdW5jdGlvbihleGVjdXRvcik7XHJcbiAgICAgIGFzc2VydEluc3RhbmNlKHRoaXMsIFByb21pc2UsIFBST01JU0UpO1xyXG4gICAgICB2YXIgcmVjb3JkID0ge1xyXG4gICAgICAgIHA6IHRoaXMsICAgICAgLy8gcHJvbWlzZVxyXG4gICAgICAgIGM6IFtdLCAgICAgICAgLy8gY2hhaW5cclxuICAgICAgICBzOiAwLCAgICAgICAgIC8vIHN0YXRlXHJcbiAgICAgICAgZDogZmFsc2UsICAgICAvLyBkb25lXHJcbiAgICAgICAgdjogdW5kZWZpbmVkLCAvLyB2YWx1ZVxyXG4gICAgICAgIGg6IGZhbHNlICAgICAgLy8gaGFuZGxlZCByZWplY3Rpb25cclxuICAgICAgfTtcclxuICAgICAgaGlkZGVuKHRoaXMsIFJFQ09SRCwgcmVjb3JkKTtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBleGVjdXRvcihjdHgocmVzb2x2ZSwgcmVjb3JkLCAxKSwgY3R4KHJlamVjdCwgcmVjb3JkLCAxKSk7XHJcbiAgICAgIH0gY2F0Y2goZXJyKXtcclxuICAgICAgICByZWplY3QuY2FsbChyZWNvcmQsIGVycik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGFzc2lnbkhpZGRlbihQcm9taXNlW1BST1RPVFlQRV0sIHtcclxuICAgICAgLy8gMjUuNC41LjMgUHJvbWlzZS5wcm90b3R5cGUudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZClcclxuICAgICAgdGhlbjogZnVuY3Rpb24ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpe1xyXG4gICAgICAgIHZhciBTID0gYXNzZXJ0T2JqZWN0KGFzc2VydE9iamVjdCh0aGlzKVtDT05TVFJVQ1RPUl0pW1NZTUJPTF9TUEVDSUVTXTtcclxuICAgICAgICB2YXIgcmVhY3QgPSB7XHJcbiAgICAgICAgICBvazogICBpc0Z1bmN0aW9uKG9uRnVsZmlsbGVkKSA/IG9uRnVsZmlsbGVkIDogdHJ1ZSxcclxuICAgICAgICAgIGZhaWw6IGlzRnVuY3Rpb24ob25SZWplY3RlZCkgID8gb25SZWplY3RlZCAgOiBmYWxzZVxyXG4gICAgICAgIH0gLCBQID0gcmVhY3QuUCA9IG5ldyAoUyAhPSB1bmRlZmluZWQgPyBTIDogUHJvbWlzZSkoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcclxuICAgICAgICAgIHJlYWN0LnJlcyA9IGFzc2VydEZ1bmN0aW9uKHJlc29sdmUpO1xyXG4gICAgICAgICAgcmVhY3QucmVqID0gYXNzZXJ0RnVuY3Rpb24ocmVqZWN0KTtcclxuICAgICAgICB9KSwgcmVjb3JkID0gdGhpc1tSRUNPUkRdO1xyXG4gICAgICAgIHJlY29yZC5jLnB1c2gocmVhY3QpO1xyXG4gICAgICAgIHJlY29yZC5zICYmIG5vdGlmeShyZWNvcmQpO1xyXG4gICAgICAgIHJldHVybiBQO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyAyNS40LjUuMSBQcm9taXNlLnByb3RvdHlwZS5jYXRjaChvblJlamVjdGVkKVxyXG4gICAgICAnY2F0Y2gnOiBmdW5jdGlvbihvblJlamVjdGVkKXtcclxuICAgICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgYXNzaWduSGlkZGVuKFByb21pc2UsIHtcclxuICAgICAgLy8gMjUuNC40LjEgUHJvbWlzZS5hbGwoaXRlcmFibGUpXHJcbiAgICAgIGFsbDogZnVuY3Rpb24oaXRlcmFibGUpe1xyXG4gICAgICAgIHZhciBQcm9taXNlID0gZ2V0Q29uc3RydWN0b3IodGhpcylcclxuICAgICAgICAgICwgdmFsdWVzICA9IFtdO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xyXG4gICAgICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBwdXNoLCB2YWx1ZXMpO1xyXG4gICAgICAgICAgdmFyIHJlbWFpbmluZyA9IHZhbHVlcy5sZW5ndGhcclxuICAgICAgICAgICAgLCByZXN1bHRzICAgPSBBcnJheShyZW1haW5pbmcpO1xyXG4gICAgICAgICAgaWYocmVtYWluaW5nKWZvckVhY2guY2FsbCh2YWx1ZXMsIGZ1bmN0aW9uKHByb21pc2UsIGluZGV4KXtcclxuICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKHByb21pc2UpLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xyXG4gICAgICAgICAgICAgIHJlc3VsdHNbaW5kZXhdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZShyZXN1bHRzKTtcclxuICAgICAgICAgICAgfSwgcmVqZWN0KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgZWxzZSByZXNvbHZlKHJlc3VsdHMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyAyNS40LjQuNCBQcm9taXNlLnJhY2UoaXRlcmFibGUpXHJcbiAgICAgIHJhY2U6IGZ1bmN0aW9uKGl0ZXJhYmxlKXtcclxuICAgICAgICB2YXIgUHJvbWlzZSA9IGdldENvbnN0cnVjdG9yKHRoaXMpO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xyXG4gICAgICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbihwcm9taXNlKXtcclxuICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKHByb21pc2UpLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyAyNS40LjQuNSBQcm9taXNlLnJlamVjdChyKVxyXG4gICAgICByZWplY3Q6IGZ1bmN0aW9uKHIpe1xyXG4gICAgICAgIHJldHVybiBuZXcgKGdldENvbnN0cnVjdG9yKHRoaXMpKShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xyXG4gICAgICAgICAgcmVqZWN0KHIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyAyNS40LjQuNiBQcm9taXNlLnJlc29sdmUoeClcclxuICAgICAgcmVzb2x2ZTogZnVuY3Rpb24oeCl7XHJcbiAgICAgICAgcmV0dXJuIGlzT2JqZWN0KHgpICYmIFJFQ09SRCBpbiB4ICYmIGdldFByb3RvdHlwZU9mKHgpID09PSB0aGlzW1BST1RPVFlQRV1cclxuICAgICAgICAgID8geCA6IG5ldyAoZ2V0Q29uc3RydWN0b3IodGhpcykpKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcbiAgICAgICAgICAgIHJlc29sdmUoeCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfShuZXh0VGljayB8fCBzZXRJbW1lZGlhdGUsIHNhZmVTeW1ib2woJ3JlY29yZCcpKTtcclxuICBzZXRUb1N0cmluZ1RhZyhQcm9taXNlLCBQUk9NSVNFKTtcclxuICBzZXRTcGVjaWVzKFByb21pc2UpO1xyXG4gICRkZWZpbmUoR0xPQkFMICsgRk9SQ0VEICogIWlzTmF0aXZlKFByb21pc2UpLCB7UHJvbWlzZTogUHJvbWlzZX0pO1xyXG59KGdsb2JhbFtQUk9NSVNFXSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGVzNi5jb2xsZWN0aW9ucyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIEVDTUFTY3JpcHQgNiBjb2xsZWN0aW9ucyBzaGltXHJcbiFmdW5jdGlvbigpe1xyXG4gIHZhciBVSUQgICA9IHNhZmVTeW1ib2woJ3VpZCcpXHJcbiAgICAsIE8xICAgID0gc2FmZVN5bWJvbCgnTzEnKVxyXG4gICAgLCBXRUFLICA9IHNhZmVTeW1ib2woJ3dlYWsnKVxyXG4gICAgLCBMRUFLICA9IHNhZmVTeW1ib2woJ2xlYWsnKVxyXG4gICAgLCBMQVNUICA9IHNhZmVTeW1ib2woJ2xhc3QnKVxyXG4gICAgLCBGSVJTVCA9IHNhZmVTeW1ib2woJ2ZpcnN0JylcclxuICAgICwgU0laRSAgPSBERVNDID8gc2FmZVN5bWJvbCgnc2l6ZScpIDogJ3NpemUnXHJcbiAgICAsIHVpZCAgID0gMFxyXG4gICAgLCB0bXAgICA9IHt9O1xyXG4gIFxyXG4gIGZ1bmN0aW9uIGdldENvbGxlY3Rpb24oQywgTkFNRSwgbWV0aG9kcywgY29tbW9uTWV0aG9kcywgaXNNYXAsIGlzV2Vhayl7XHJcbiAgICB2YXIgQURERVIgPSBpc01hcCA/ICdzZXQnIDogJ2FkZCdcclxuICAgICAgLCBwcm90byA9IEMgJiYgQ1tQUk9UT1RZUEVdXHJcbiAgICAgICwgTyAgICAgPSB7fTtcclxuICAgIGZ1bmN0aW9uIGluaXRGcm9tSXRlcmFibGUodGhhdCwgaXRlcmFibGUpe1xyXG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIGlzTWFwLCB0aGF0W0FEREVSXSwgdGhhdCk7XHJcbiAgICAgIHJldHVybiB0aGF0O1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gZml4U1ZaKGtleSwgY2hhaW4pe1xyXG4gICAgICB2YXIgbWV0aG9kID0gcHJvdG9ba2V5XTtcclxuICAgICAgaWYoZnJhbWV3b3JrKXByb3RvW2tleV0gPSBmdW5jdGlvbihhLCBiKXtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbWV0aG9kLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhLCBiKTtcclxuICAgICAgICByZXR1cm4gY2hhaW4gPyB0aGlzIDogcmVzdWx0O1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgaWYoIWlzTmF0aXZlKEMpIHx8ICEoaXNXZWFrIHx8ICghQlVHR1lfSVRFUkFUT1JTICYmIGhhcyhwcm90bywgRk9SX0VBQ0gpICYmIGhhcyhwcm90bywgJ2VudHJpZXMnKSkpKXtcclxuICAgICAgLy8gY3JlYXRlIGNvbGxlY3Rpb24gY29uc3RydWN0b3JcclxuICAgICAgQyA9IGlzV2Vha1xyXG4gICAgICAgID8gZnVuY3Rpb24oaXRlcmFibGUpe1xyXG4gICAgICAgICAgICBhc3NlcnRJbnN0YW5jZSh0aGlzLCBDLCBOQU1FKTtcclxuICAgICAgICAgICAgc2V0KHRoaXMsIFVJRCwgdWlkKyspO1xyXG4gICAgICAgICAgICBpbml0RnJvbUl0ZXJhYmxlKHRoaXMsIGl0ZXJhYmxlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICA6IGZ1bmN0aW9uKGl0ZXJhYmxlKXtcclxuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICAgICBhc3NlcnRJbnN0YW5jZSh0aGF0LCBDLCBOQU1FKTtcclxuICAgICAgICAgICAgc2V0KHRoYXQsIE8xLCBjcmVhdGUobnVsbCkpO1xyXG4gICAgICAgICAgICBzZXQodGhhdCwgU0laRSwgMCk7XHJcbiAgICAgICAgICAgIHNldCh0aGF0LCBMQVNULCB1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICBzZXQodGhhdCwgRklSU1QsIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgIGluaXRGcm9tSXRlcmFibGUodGhhdCwgaXRlcmFibGUpO1xyXG4gICAgICAgICAgfTtcclxuICAgICAgYXNzaWduSGlkZGVuKGFzc2lnbkhpZGRlbihDW1BST1RPVFlQRV0sIG1ldGhvZHMpLCBjb21tb25NZXRob2RzKTtcclxuICAgICAgaXNXZWFrIHx8ICFERVNDIHx8IGRlZmluZVByb3BlcnR5KENbUFJPVE9UWVBFXSwgJ3NpemUnLCB7Z2V0OiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJldHVybiBhc3NlcnREZWZpbmVkKHRoaXNbU0laRV0pO1xyXG4gICAgICB9fSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgTmF0aXZlID0gQ1xyXG4gICAgICAgICwgaW5zdCAgID0gbmV3IENcclxuICAgICAgICAsIGNoYWluICA9IGluc3RbQURERVJdKGlzV2VhayA/IHt9IDogLTAsIDEpXHJcbiAgICAgICAgLCBidWdneVplcm87XHJcbiAgICAgIC8vIHdyYXAgdG8gaW5pdCBjb2xsZWN0aW9ucyBmcm9tIGl0ZXJhYmxlXHJcbiAgICAgIGlmKGNoZWNrRGFuZ2VySXRlckNsb3NpbmcoZnVuY3Rpb24oTyl7IG5ldyBDKE8pIH0pKXtcclxuICAgICAgICBDID0gZnVuY3Rpb24oaXRlcmFibGUpe1xyXG4gICAgICAgICAgYXNzZXJ0SW5zdGFuY2UodGhpcywgQywgTkFNRSk7XHJcbiAgICAgICAgICByZXR1cm4gaW5pdEZyb21JdGVyYWJsZShuZXcgTmF0aXZlLCBpdGVyYWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIENbUFJPVE9UWVBFXSA9IHByb3RvO1xyXG4gICAgICAgIGlmKGZyYW1ld29yaylwcm90b1tDT05TVFJVQ1RPUl0gPSBDO1xyXG4gICAgICB9XHJcbiAgICAgIGlzV2VhayB8fCBpbnN0W0ZPUl9FQUNIXShmdW5jdGlvbih2YWwsIGtleSl7XHJcbiAgICAgICAgYnVnZ3laZXJvID0gMSAvIGtleSA9PT0gLUluZmluaXR5O1xyXG4gICAgICB9KTtcclxuICAgICAgLy8gZml4IGNvbnZlcnRpbmcgLTAga2V5IHRvICswXHJcbiAgICAgIGlmKGJ1Z2d5WmVybyl7XHJcbiAgICAgICAgZml4U1ZaKCdkZWxldGUnKTtcclxuICAgICAgICBmaXhTVlooJ2hhcycpO1xyXG4gICAgICAgIGlzTWFwICYmIGZpeFNWWignZ2V0Jyk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gKyBmaXggLmFkZCAmIC5zZXQgZm9yIGNoYWluaW5nXHJcbiAgICAgIGlmKGJ1Z2d5WmVybyB8fCBjaGFpbiAhPT0gaW5zdClmaXhTVlooQURERVIsIHRydWUpO1xyXG4gICAgfVxyXG4gICAgc2V0VG9TdHJpbmdUYWcoQywgTkFNRSk7XHJcbiAgICBzZXRTcGVjaWVzKEMpO1xyXG4gICAgXHJcbiAgICBPW05BTUVdID0gQztcclxuICAgICRkZWZpbmUoR0xPQkFMICsgV1JBUCArIEZPUkNFRCAqICFpc05hdGl2ZShDKSwgTyk7XHJcbiAgICBcclxuICAgIC8vIGFkZCAua2V5cywgLnZhbHVlcywgLmVudHJpZXMsIFtAQGl0ZXJhdG9yXVxyXG4gICAgLy8gMjMuMS4zLjQsIDIzLjEuMy44LCAyMy4xLjMuMTEsIDIzLjEuMy4xMiwgMjMuMi4zLjUsIDIzLjIuMy44LCAyMy4yLjMuMTAsIDIzLjIuMy4xMVxyXG4gICAgaXNXZWFrIHx8IGRlZmluZVN0ZEl0ZXJhdG9ycyhDLCBOQU1FLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XHJcbiAgICAgIHNldCh0aGlzLCBJVEVSLCB7bzogaXRlcmF0ZWQsIGs6IGtpbmR9KTtcclxuICAgIH0sIGZ1bmN0aW9uKCl7XHJcbiAgICAgIHZhciBpdGVyICA9IHRoaXNbSVRFUl1cclxuICAgICAgICAsIGtpbmQgID0gaXRlci5rXHJcbiAgICAgICAgLCBlbnRyeSA9IGl0ZXIubDtcclxuICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XHJcbiAgICAgIHdoaWxlKGVudHJ5ICYmIGVudHJ5LnIpZW50cnkgPSBlbnRyeS5wO1xyXG4gICAgICAvLyBnZXQgbmV4dCBlbnRyeVxyXG4gICAgICBpZighaXRlci5vIHx8ICEoaXRlci5sID0gZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiBpdGVyLm9bRklSU1RdKSl7XHJcbiAgICAgICAgLy8gb3IgZmluaXNoIHRoZSBpdGVyYXRpb25cclxuICAgICAgICBpdGVyLm8gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmV0dXJuIGl0ZXJSZXN1bHQoMSk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gcmV0dXJuIHN0ZXAgYnkga2luZFxyXG4gICAgICBpZihraW5kID09IEtFWSkgIHJldHVybiBpdGVyUmVzdWx0KDAsIGVudHJ5LmspO1xyXG4gICAgICBpZihraW5kID09IFZBTFVFKXJldHVybiBpdGVyUmVzdWx0KDAsIGVudHJ5LnYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVyUmVzdWx0KDAsIFtlbnRyeS5rLCBlbnRyeS52XSk7ICAgXHJcbiAgICB9LCBpc01hcCA/IEtFWStWQUxVRSA6IFZBTFVFLCAhaXNNYXApO1xyXG4gICAgXHJcbiAgICByZXR1cm4gQztcclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gZmFzdEtleShpdCwgY3JlYXRlKXtcclxuICAgIC8vIHJldHVybiBwcmltaXRpdmUgd2l0aCBwcmVmaXhcclxuICAgIGlmKCFpc09iamVjdChpdCkpcmV0dXJuICh0eXBlb2YgaXQgPT0gJ3N0cmluZycgPyAnUycgOiAnUCcpICsgaXQ7XHJcbiAgICAvLyBjYW4ndCBzZXQgaWQgdG8gZnJvemVuIG9iamVjdFxyXG4gICAgaWYoaXNGcm96ZW4oaXQpKXJldHVybiAnRic7XHJcbiAgICBpZighaGFzKGl0LCBVSUQpKXtcclxuICAgICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgaWRcclxuICAgICAgaWYoIWNyZWF0ZSlyZXR1cm4gJ0UnO1xyXG4gICAgICAvLyBhZGQgbWlzc2luZyBvYmplY3QgaWRcclxuICAgICAgaGlkZGVuKGl0LCBVSUQsICsrdWlkKTtcclxuICAgIC8vIHJldHVybiBvYmplY3QgaWQgd2l0aCBwcmVmaXhcclxuICAgIH0gcmV0dXJuICdPJyArIGl0W1VJRF07XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGdldEVudHJ5KHRoYXQsIGtleSl7XHJcbiAgICAvLyBmYXN0IGNhc2VcclxuICAgIHZhciBpbmRleCA9IGZhc3RLZXkoa2V5KSwgZW50cnk7XHJcbiAgICBpZihpbmRleCAhPSAnRicpcmV0dXJuIHRoYXRbTzFdW2luZGV4XTtcclxuICAgIC8vIGZyb3plbiBvYmplY3QgY2FzZVxyXG4gICAgZm9yKGVudHJ5ID0gdGhhdFtGSVJTVF07IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xyXG4gICAgICBpZihlbnRyeS5rID09IGtleSlyZXR1cm4gZW50cnk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGRlZih0aGF0LCBrZXksIHZhbHVlKXtcclxuICAgIHZhciBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSlcclxuICAgICAgLCBwcmV2LCBpbmRleDtcclxuICAgIC8vIGNoYW5nZSBleGlzdGluZyBlbnRyeVxyXG4gICAgaWYoZW50cnkpZW50cnkudiA9IHZhbHVlO1xyXG4gICAgLy8gY3JlYXRlIG5ldyBlbnRyeVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoYXRbTEFTVF0gPSBlbnRyeSA9IHtcclxuICAgICAgICBpOiBpbmRleCA9IGZhc3RLZXkoa2V5LCB0cnVlKSwgLy8gPC0gaW5kZXhcclxuICAgICAgICBrOiBrZXksICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0ga2V5XHJcbiAgICAgICAgdjogdmFsdWUsICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXHJcbiAgICAgICAgcDogcHJldiA9IHRoYXRbTEFTVF0sICAgICAgICAgIC8vIDwtIHByZXZpb3VzIGVudHJ5XHJcbiAgICAgICAgbjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgIC8vIDwtIG5leHQgZW50cnlcclxuICAgICAgICByOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gcmVtb3ZlZFxyXG4gICAgICB9O1xyXG4gICAgICBpZighdGhhdFtGSVJTVF0pdGhhdFtGSVJTVF0gPSBlbnRyeTtcclxuICAgICAgaWYocHJldilwcmV2Lm4gPSBlbnRyeTtcclxuICAgICAgdGhhdFtTSVpFXSsrO1xyXG4gICAgICAvLyBhZGQgdG8gaW5kZXhcclxuICAgICAgaWYoaW5kZXggIT0gJ0YnKXRoYXRbTzFdW2luZGV4XSA9IGVudHJ5O1xyXG4gICAgfSByZXR1cm4gdGhhdDtcclxuICB9XHJcblxyXG4gIHZhciBjb2xsZWN0aW9uTWV0aG9kcyA9IHtcclxuICAgIC8vIDIzLjEuMy4xIE1hcC5wcm90b3R5cGUuY2xlYXIoKVxyXG4gICAgLy8gMjMuMi4zLjIgU2V0LnByb3RvdHlwZS5jbGVhcigpXHJcbiAgICBjbGVhcjogZnVuY3Rpb24oKXtcclxuICAgICAgZm9yKHZhciB0aGF0ID0gdGhpcywgZGF0YSA9IHRoYXRbTzFdLCBlbnRyeSA9IHRoYXRbRklSU1RdOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKXtcclxuICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcclxuICAgICAgICBpZihlbnRyeS5wKWVudHJ5LnAgPSBlbnRyeS5wLm4gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgZGVsZXRlIGRhdGFbZW50cnkuaV07XHJcbiAgICAgIH1cclxuICAgICAgdGhhdFtGSVJTVF0gPSB0aGF0W0xBU1RdID0gdW5kZWZpbmVkO1xyXG4gICAgICB0aGF0W1NJWkVdID0gMDtcclxuICAgIH0sXHJcbiAgICAvLyAyMy4xLjMuMyBNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXHJcbiAgICAvLyAyMy4yLjMuNCBTZXQucHJvdG90eXBlLmRlbGV0ZSh2YWx1ZSlcclxuICAgICdkZWxldGUnOiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICB2YXIgdGhhdCAgPSB0aGlzXHJcbiAgICAgICAgLCBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSk7XHJcbiAgICAgIGlmKGVudHJ5KXtcclxuICAgICAgICB2YXIgbmV4dCA9IGVudHJ5Lm5cclxuICAgICAgICAgICwgcHJldiA9IGVudHJ5LnA7XHJcbiAgICAgICAgZGVsZXRlIHRoYXRbTzFdW2VudHJ5LmldO1xyXG4gICAgICAgIGVudHJ5LnIgPSB0cnVlO1xyXG4gICAgICAgIGlmKHByZXYpcHJldi5uID0gbmV4dDtcclxuICAgICAgICBpZihuZXh0KW5leHQucCA9IHByZXY7XHJcbiAgICAgICAgaWYodGhhdFtGSVJTVF0gPT0gZW50cnkpdGhhdFtGSVJTVF0gPSBuZXh0O1xyXG4gICAgICAgIGlmKHRoYXRbTEFTVF0gPT0gZW50cnkpdGhhdFtMQVNUXSA9IHByZXY7XHJcbiAgICAgICAgdGhhdFtTSVpFXS0tO1xyXG4gICAgICB9IHJldHVybiAhIWVudHJ5O1xyXG4gICAgfSxcclxuICAgIC8vIDIzLjIuMy42IFNldC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxyXG4gICAgLy8gMjMuMS4zLjUgTWFwLnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXHJcbiAgICBmb3JFYWNoOiBmdW5jdGlvbihjYWxsYmFja2ZuIC8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcclxuICAgICAgdmFyIGYgPSBjdHgoY2FsbGJhY2tmbiwgYXJndW1lbnRzWzFdLCAzKVxyXG4gICAgICAgICwgZW50cnk7XHJcbiAgICAgIHdoaWxlKGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhpc1tGSVJTVF0pe1xyXG4gICAgICAgIGYoZW50cnkudiwgZW50cnkuaywgdGhpcyk7XHJcbiAgICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XHJcbiAgICAgICAgd2hpbGUoZW50cnkgJiYgZW50cnkucillbnRyeSA9IGVudHJ5LnA7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyAyMy4xLjMuNyBNYXAucHJvdG90eXBlLmhhcyhrZXkpXHJcbiAgICAvLyAyMy4yLjMuNyBTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcclxuICAgIGhhczogZnVuY3Rpb24oa2V5KXtcclxuICAgICAgcmV0dXJuICEhZ2V0RW50cnkodGhpcywga2V5KTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgLy8gMjMuMSBNYXAgT2JqZWN0c1xyXG4gIE1hcCA9IGdldENvbGxlY3Rpb24oTWFwLCBNQVAsIHtcclxuICAgIC8vIDIzLjEuMy42IE1hcC5wcm90b3R5cGUuZ2V0KGtleSlcclxuICAgIGdldDogZnVuY3Rpb24oa2V5KXtcclxuICAgICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhpcywga2V5KTtcclxuICAgICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5LnY7XHJcbiAgICB9LFxyXG4gICAgLy8gMjMuMS4zLjkgTWFwLnByb3RvdHlwZS5zZXQoa2V5LCB2YWx1ZSlcclxuICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XHJcbiAgICAgIHJldHVybiBkZWYodGhpcywga2V5ID09PSAwID8gMCA6IGtleSwgdmFsdWUpO1xyXG4gICAgfVxyXG4gIH0sIGNvbGxlY3Rpb25NZXRob2RzLCB0cnVlKTtcclxuICBcclxuICAvLyAyMy4yIFNldCBPYmplY3RzXHJcbiAgU2V0ID0gZ2V0Q29sbGVjdGlvbihTZXQsIFNFVCwge1xyXG4gICAgLy8gMjMuMi4zLjEgU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXHJcbiAgICBhZGQ6IGZ1bmN0aW9uKHZhbHVlKXtcclxuICAgICAgcmV0dXJuIGRlZih0aGlzLCB2YWx1ZSA9IHZhbHVlID09PSAwID8gMCA6IHZhbHVlLCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfSwgY29sbGVjdGlvbk1ldGhvZHMpO1xyXG4gIFxyXG4gIGZ1bmN0aW9uIGRlZldlYWsodGhhdCwga2V5LCB2YWx1ZSl7XHJcbiAgICBpZihpc0Zyb3plbihhc3NlcnRPYmplY3Qoa2V5KSkpbGVha1N0b3JlKHRoYXQpLnNldChrZXksIHZhbHVlKTtcclxuICAgIGVsc2Uge1xyXG4gICAgICBoYXMoa2V5LCBXRUFLKSB8fCBoaWRkZW4oa2V5LCBXRUFLLCB7fSk7XHJcbiAgICAgIGtleVtXRUFLXVt0aGF0W1VJRF1dID0gdmFsdWU7XHJcbiAgICB9IHJldHVybiB0aGF0O1xyXG4gIH1cclxuICBmdW5jdGlvbiBsZWFrU3RvcmUodGhhdCl7XHJcbiAgICByZXR1cm4gdGhhdFtMRUFLXSB8fCBoaWRkZW4odGhhdCwgTEVBSywgbmV3IE1hcClbTEVBS107XHJcbiAgfVxyXG4gIFxyXG4gIHZhciB3ZWFrTWV0aG9kcyA9IHtcclxuICAgIC8vIDIzLjMuMy4yIFdlYWtNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXHJcbiAgICAvLyAyMy40LjMuMyBXZWFrU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXHJcbiAgICAnZGVsZXRlJzogZnVuY3Rpb24oa2V5KXtcclxuICAgICAgaWYoIWlzT2JqZWN0KGtleSkpcmV0dXJuIGZhbHNlO1xyXG4gICAgICBpZihpc0Zyb3plbihrZXkpKXJldHVybiBsZWFrU3RvcmUodGhpcylbJ2RlbGV0ZSddKGtleSk7XHJcbiAgICAgIHJldHVybiBoYXMoa2V5LCBXRUFLKSAmJiBoYXMoa2V5W1dFQUtdLCB0aGlzW1VJRF0pICYmIGRlbGV0ZSBrZXlbV0VBS11bdGhpc1tVSURdXTtcclxuICAgIH0sXHJcbiAgICAvLyAyMy4zLjMuNCBXZWFrTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxyXG4gICAgLy8gMjMuNC4zLjQgV2Vha1NldC5wcm90b3R5cGUuaGFzKHZhbHVlKVxyXG4gICAgaGFzOiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICBpZighaXNPYmplY3Qoa2V5KSlyZXR1cm4gZmFsc2U7XHJcbiAgICAgIGlmKGlzRnJvemVuKGtleSkpcmV0dXJuIGxlYWtTdG9yZSh0aGlzKS5oYXMoa2V5KTtcclxuICAgICAgcmV0dXJuIGhhcyhrZXksIFdFQUspICYmIGhhcyhrZXlbV0VBS10sIHRoaXNbVUlEXSk7XHJcbiAgICB9XHJcbiAgfTtcclxuICBcclxuICAvLyAyMy4zIFdlYWtNYXAgT2JqZWN0c1xyXG4gIFdlYWtNYXAgPSBnZXRDb2xsZWN0aW9uKFdlYWtNYXAsIFdFQUtNQVAsIHtcclxuICAgIC8vIDIzLjMuMy4zIFdlYWtNYXAucHJvdG90eXBlLmdldChrZXkpXHJcbiAgICBnZXQ6IGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIGlmKGlzT2JqZWN0KGtleSkpe1xyXG4gICAgICAgIGlmKGlzRnJvemVuKGtleSkpcmV0dXJuIGxlYWtTdG9yZSh0aGlzKS5nZXQoa2V5KTtcclxuICAgICAgICBpZihoYXMoa2V5LCBXRUFLKSlyZXR1cm4ga2V5W1dFQUtdW3RoaXNbVUlEXV07XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyAyMy4zLjMuNSBXZWFrTWFwLnByb3RvdHlwZS5zZXQoa2V5LCB2YWx1ZSlcclxuICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XHJcbiAgICAgIHJldHVybiBkZWZXZWFrKHRoaXMsIGtleSwgdmFsdWUpO1xyXG4gICAgfVxyXG4gIH0sIHdlYWtNZXRob2RzLCB0cnVlLCB0cnVlKTtcclxuICBcclxuICAvLyBJRTExIFdlYWtNYXAgZnJvemVuIGtleXMgZml4XHJcbiAgaWYoZnJhbWV3b3JrICYmIG5ldyBXZWFrTWFwKCkuc2V0KE9iamVjdC5mcmVlemUodG1wKSwgNykuZ2V0KHRtcCkgIT0gNyl7XHJcbiAgICBmb3JFYWNoLmNhbGwoYXJyYXkoJ2RlbGV0ZSxoYXMsZ2V0LHNldCcpLCBmdW5jdGlvbihrZXkpe1xyXG4gICAgICB2YXIgbWV0aG9kID0gV2Vha01hcFtQUk9UT1RZUEVdW2tleV07XHJcbiAgICAgIFdlYWtNYXBbUFJPVE9UWVBFXVtrZXldID0gZnVuY3Rpb24oYSwgYil7XHJcbiAgICAgICAgLy8gc3RvcmUgZnJvemVuIG9iamVjdHMgb24gbGVha3kgbWFwXHJcbiAgICAgICAgaWYoaXNPYmplY3QoYSkgJiYgaXNGcm96ZW4oYSkpe1xyXG4gICAgICAgICAgdmFyIHJlc3VsdCA9IGxlYWtTdG9yZSh0aGlzKVtrZXldKGEsIGIpO1xyXG4gICAgICAgICAgcmV0dXJuIGtleSA9PSAnc2V0JyA/IHRoaXMgOiByZXN1bHQ7XHJcbiAgICAgICAgLy8gc3RvcmUgYWxsIHRoZSByZXN0IG9uIG5hdGl2ZSB3ZWFrbWFwXHJcbiAgICAgICAgfSByZXR1cm4gbWV0aG9kLmNhbGwodGhpcywgYSwgYik7XHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuICB9XHJcbiAgXHJcbiAgLy8gMjMuNCBXZWFrU2V0IE9iamVjdHNcclxuICBXZWFrU2V0ID0gZ2V0Q29sbGVjdGlvbihXZWFrU2V0LCBXRUFLU0VULCB7XHJcbiAgICAvLyAyMy40LjMuMSBXZWFrU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXHJcbiAgICBhZGQ6IGZ1bmN0aW9uKHZhbHVlKXtcclxuICAgICAgcmV0dXJuIGRlZldlYWsodGhpcywgdmFsdWUsIHRydWUpO1xyXG4gICAgfVxyXG4gIH0sIHdlYWtNZXRob2RzLCBmYWxzZSwgdHJ1ZSk7XHJcbn0oKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogZXM2LnJlZmxlY3QgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKCl7XHJcbiAgZnVuY3Rpb24gRW51bWVyYXRlKGl0ZXJhdGVkKXtcclxuICAgIHZhciBrZXlzID0gW10sIGtleTtcclxuICAgIGZvcihrZXkgaW4gaXRlcmF0ZWQpa2V5cy5wdXNoKGtleSk7XHJcbiAgICBzZXQodGhpcywgSVRFUiwge286IGl0ZXJhdGVkLCBhOiBrZXlzLCBpOiAwfSk7XHJcbiAgfVxyXG4gIGNyZWF0ZUl0ZXJhdG9yKEVudW1lcmF0ZSwgT0JKRUNULCBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGl0ZXIgPSB0aGlzW0lURVJdXHJcbiAgICAgICwga2V5cyA9IGl0ZXIuYVxyXG4gICAgICAsIGtleTtcclxuICAgIGRvIHtcclxuICAgICAgaWYoaXRlci5pID49IGtleXMubGVuZ3RoKXJldHVybiBpdGVyUmVzdWx0KDEpO1xyXG4gICAgfSB3aGlsZSghKChrZXkgPSBrZXlzW2l0ZXIuaSsrXSkgaW4gaXRlci5vKSk7XHJcbiAgICByZXR1cm4gaXRlclJlc3VsdCgwLCBrZXkpO1xyXG4gIH0pO1xyXG4gIFxyXG4gIGZ1bmN0aW9uIHdyYXAoZm4pe1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGl0KXtcclxuICAgICAgYXNzZXJ0T2JqZWN0KGl0KTtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gZm4uYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpLCB0cnVlO1xyXG4gICAgICB9IGNhdGNoKGUpe1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiByZWZsZWN0R2V0KHRhcmdldCwgcHJvcGVydHlLZXkvKiwgcmVjZWl2ZXIqLyl7XHJcbiAgICB2YXIgcmVjZWl2ZXIgPSBhcmd1bWVudHMubGVuZ3RoIDwgMyA/IHRhcmdldCA6IGFyZ3VtZW50c1syXVxyXG4gICAgICAsIGRlc2MgPSBnZXRPd25EZXNjcmlwdG9yKGFzc2VydE9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSksIHByb3RvO1xyXG4gICAgaWYoZGVzYylyZXR1cm4gaGFzKGRlc2MsICd2YWx1ZScpXHJcbiAgICAgID8gZGVzYy52YWx1ZVxyXG4gICAgICA6IGRlc2MuZ2V0ID09PSB1bmRlZmluZWRcclxuICAgICAgICA/IHVuZGVmaW5lZFxyXG4gICAgICAgIDogZGVzYy5nZXQuY2FsbChyZWNlaXZlcik7XHJcbiAgICByZXR1cm4gaXNPYmplY3QocHJvdG8gPSBnZXRQcm90b3R5cGVPZih0YXJnZXQpKVxyXG4gICAgICA/IHJlZmxlY3RHZXQocHJvdG8sIHByb3BlcnR5S2V5LCByZWNlaXZlcilcclxuICAgICAgOiB1bmRlZmluZWQ7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIHJlZmxlY3RTZXQodGFyZ2V0LCBwcm9wZXJ0eUtleSwgVi8qLCByZWNlaXZlciovKXtcclxuICAgIHZhciByZWNlaXZlciA9IGFyZ3VtZW50cy5sZW5ndGggPCA0ID8gdGFyZ2V0IDogYXJndW1lbnRzWzNdXHJcbiAgICAgICwgb3duRGVzYyAgPSBnZXRPd25EZXNjcmlwdG9yKGFzc2VydE9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSlcclxuICAgICAgLCBleGlzdGluZ0Rlc2NyaXB0b3IsIHByb3RvO1xyXG4gICAgaWYoIW93bkRlc2Mpe1xyXG4gICAgICBpZihpc09iamVjdChwcm90byA9IGdldFByb3RvdHlwZU9mKHRhcmdldCkpKXtcclxuICAgICAgICByZXR1cm4gcmVmbGVjdFNldChwcm90bywgcHJvcGVydHlLZXksIFYsIHJlY2VpdmVyKTtcclxuICAgICAgfVxyXG4gICAgICBvd25EZXNjID0gZGVzY3JpcHRvcigwKTtcclxuICAgIH1cclxuICAgIGlmKGhhcyhvd25EZXNjLCAndmFsdWUnKSl7XHJcbiAgICAgIGlmKG93bkRlc2Mud3JpdGFibGUgPT09IGZhbHNlIHx8ICFpc09iamVjdChyZWNlaXZlcikpcmV0dXJuIGZhbHNlO1xyXG4gICAgICBleGlzdGluZ0Rlc2NyaXB0b3IgPSBnZXRPd25EZXNjcmlwdG9yKHJlY2VpdmVyLCBwcm9wZXJ0eUtleSkgfHwgZGVzY3JpcHRvcigwKTtcclxuICAgICAgZXhpc3RpbmdEZXNjcmlwdG9yLnZhbHVlID0gVjtcclxuICAgICAgcmV0dXJuIGRlZmluZVByb3BlcnR5KHJlY2VpdmVyLCBwcm9wZXJ0eUtleSwgZXhpc3RpbmdEZXNjcmlwdG9yKSwgdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBvd25EZXNjLnNldCA9PT0gdW5kZWZpbmVkXHJcbiAgICAgID8gZmFsc2VcclxuICAgICAgOiAob3duRGVzYy5zZXQuY2FsbChyZWNlaXZlciwgViksIHRydWUpO1xyXG4gIH1cclxuICB2YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCByZXR1cm5JdDtcclxuICBcclxuICB2YXIgcmVmbGVjdCA9IHtcclxuICAgIC8vIDI2LjEuMSBSZWZsZWN0LmFwcGx5KHRhcmdldCwgdGhpc0FyZ3VtZW50LCBhcmd1bWVudHNMaXN0KVxyXG4gICAgYXBwbHk6IGN0eChjYWxsLCBhcHBseSwgMyksXHJcbiAgICAvLyAyNi4xLjIgUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmd1bWVudHNMaXN0IFssIG5ld1RhcmdldF0pXHJcbiAgICBjb25zdHJ1Y3Q6IGZ1bmN0aW9uKHRhcmdldCwgYXJndW1lbnRzTGlzdCAvKiwgbmV3VGFyZ2V0Ki8pe1xyXG4gICAgICB2YXIgcHJvdG8gICAgPSBhc3NlcnRGdW5jdGlvbihhcmd1bWVudHMubGVuZ3RoIDwgMyA/IHRhcmdldCA6IGFyZ3VtZW50c1syXSlbUFJPVE9UWVBFXVxyXG4gICAgICAgICwgaW5zdGFuY2UgPSBjcmVhdGUoaXNPYmplY3QocHJvdG8pID8gcHJvdG8gOiBPYmplY3RQcm90bylcclxuICAgICAgICAsIHJlc3VsdCAgID0gYXBwbHkuY2FsbCh0YXJnZXQsIGluc3RhbmNlLCBhcmd1bWVudHNMaXN0KTtcclxuICAgICAgcmV0dXJuIGlzT2JqZWN0KHJlc3VsdCkgPyByZXN1bHQgOiBpbnN0YW5jZTtcclxuICAgIH0sXHJcbiAgICAvLyAyNi4xLjMgUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5LCBhdHRyaWJ1dGVzKVxyXG4gICAgZGVmaW5lUHJvcGVydHk6IHdyYXAoZGVmaW5lUHJvcGVydHkpLFxyXG4gICAgLy8gMjYuMS40IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSlcclxuICAgIGRlbGV0ZVByb3BlcnR5OiBmdW5jdGlvbih0YXJnZXQsIHByb3BlcnR5S2V5KXtcclxuICAgICAgdmFyIGRlc2MgPSBnZXRPd25EZXNjcmlwdG9yKGFzc2VydE9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSk7XHJcbiAgICAgIHJldHVybiBkZXNjICYmICFkZXNjLmNvbmZpZ3VyYWJsZSA/IGZhbHNlIDogZGVsZXRlIHRhcmdldFtwcm9wZXJ0eUtleV07XHJcbiAgICB9LFxyXG4gICAgLy8gMjYuMS41IFJlZmxlY3QuZW51bWVyYXRlKHRhcmdldClcclxuICAgIGVudW1lcmF0ZTogZnVuY3Rpb24odGFyZ2V0KXtcclxuICAgICAgcmV0dXJuIG5ldyBFbnVtZXJhdGUoYXNzZXJ0T2JqZWN0KHRhcmdldCkpO1xyXG4gICAgfSxcclxuICAgIC8vIDI2LjEuNiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3BlcnR5S2V5IFssIHJlY2VpdmVyXSlcclxuICAgIGdldDogcmVmbGVjdEdldCxcclxuICAgIC8vIDI2LjEuNyBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3BlcnR5S2V5KVxyXG4gICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiBmdW5jdGlvbih0YXJnZXQsIHByb3BlcnR5S2V5KXtcclxuICAgICAgcmV0dXJuIGdldE93bkRlc2NyaXB0b3IoYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KTtcclxuICAgIH0sXHJcbiAgICAvLyAyNi4xLjggUmVmbGVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpXHJcbiAgICBnZXRQcm90b3R5cGVPZjogZnVuY3Rpb24odGFyZ2V0KXtcclxuICAgICAgcmV0dXJuIGdldFByb3RvdHlwZU9mKGFzc2VydE9iamVjdCh0YXJnZXQpKTtcclxuICAgIH0sXHJcbiAgICAvLyAyNi4xLjkgUmVmbGVjdC5oYXModGFyZ2V0LCBwcm9wZXJ0eUtleSlcclxuICAgIGhhczogZnVuY3Rpb24odGFyZ2V0LCBwcm9wZXJ0eUtleSl7XHJcbiAgICAgIHJldHVybiBwcm9wZXJ0eUtleSBpbiB0YXJnZXQ7XHJcbiAgICB9LFxyXG4gICAgLy8gMjYuMS4xMCBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpXHJcbiAgICBpc0V4dGVuc2libGU6IGZ1bmN0aW9uKHRhcmdldCl7XHJcbiAgICAgIHJldHVybiAhIWlzRXh0ZW5zaWJsZShhc3NlcnRPYmplY3QodGFyZ2V0KSk7XHJcbiAgICB9LFxyXG4gICAgLy8gMjYuMS4xMSBSZWZsZWN0Lm93bktleXModGFyZ2V0KVxyXG4gICAgb3duS2V5czogb3duS2V5cyxcclxuICAgIC8vIDI2LjEuMTIgUmVmbGVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpXHJcbiAgICBwcmV2ZW50RXh0ZW5zaW9uczogd3JhcChPYmplY3QucHJldmVudEV4dGVuc2lvbnMgfHwgcmV0dXJuSXQpLFxyXG4gICAgLy8gMjYuMS4xMyBSZWZsZWN0LnNldCh0YXJnZXQsIHByb3BlcnR5S2V5LCBWIFssIHJlY2VpdmVyXSlcclxuICAgIHNldDogcmVmbGVjdFNldFxyXG4gIH1cclxuICAvLyAyNi4xLjE0IFJlZmxlY3Quc2V0UHJvdG90eXBlT2YodGFyZ2V0LCBwcm90bylcclxuICBpZihzZXRQcm90b3R5cGVPZilyZWZsZWN0LnNldFByb3RvdHlwZU9mID0gZnVuY3Rpb24odGFyZ2V0LCBwcm90byl7XHJcbiAgICByZXR1cm4gc2V0UHJvdG90eXBlT2YoYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3RvKSwgdHJ1ZTtcclxuICB9O1xyXG4gIFxyXG4gICRkZWZpbmUoR0xPQkFMLCB7UmVmbGVjdDoge319KTtcclxuICAkZGVmaW5lKFNUQVRJQywgJ1JlZmxlY3QnLCByZWZsZWN0KTtcclxufSgpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczcucHJvcG9zYWxzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oKXtcclxuICAkZGVmaW5lKFBST1RPLCBBUlJBWSwge1xyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2RvbWVuaWMvQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzXHJcbiAgICBpbmNsdWRlczogY3JlYXRlQXJyYXlDb250YWlucyh0cnVlKVxyXG4gIH0pO1xyXG4gICRkZWZpbmUoUFJPVE8sIFNUUklORywge1xyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvU3RyaW5nLnByb3RvdHlwZS5hdFxyXG4gICAgYXQ6IGNyZWF0ZVBvaW50QXQodHJ1ZSlcclxuICB9KTtcclxuICBcclxuICBmdW5jdGlvbiBjcmVhdGVPYmplY3RUb0FycmF5KGlzRW50cmllcyl7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KXtcclxuICAgICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KG9iamVjdClcclxuICAgICAgICAsIGtleXMgICA9IGdldEtleXMob2JqZWN0KVxyXG4gICAgICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcclxuICAgICAgICAsIGkgICAgICA9IDBcclxuICAgICAgICAsIHJlc3VsdCA9IEFycmF5KGxlbmd0aClcclxuICAgICAgICAsIGtleTtcclxuICAgICAgaWYoaXNFbnRyaWVzKXdoaWxlKGxlbmd0aCA+IGkpcmVzdWx0W2ldID0gW2tleSA9IGtleXNbaSsrXSwgT1trZXldXTtcclxuICAgICAgZWxzZSB3aGlsZShsZW5ndGggPiBpKXJlc3VsdFtpXSA9IE9ba2V5c1tpKytdXTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICB9XHJcbiAgJGRlZmluZShTVEFUSUMsIE9CSkVDVCwge1xyXG4gICAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vV2ViUmVmbGVjdGlvbi85MzUzNzgxXHJcbiAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzOiBmdW5jdGlvbihvYmplY3Qpe1xyXG4gICAgICB2YXIgTyAgICAgID0gdG9PYmplY3Qob2JqZWN0KVxyXG4gICAgICAgICwgcmVzdWx0ID0ge307XHJcbiAgICAgIGZvckVhY2guY2FsbChvd25LZXlzKE8pLCBmdW5jdGlvbihrZXkpe1xyXG4gICAgICAgIGRlZmluZVByb3BlcnR5KHJlc3VsdCwga2V5LCBkZXNjcmlwdG9yKDAsIGdldE93bkRlc2NyaXB0b3IoTywga2V5KSkpO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH0sXHJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcndhbGRyb24vdGMzOS1ub3Rlcy9ibG9iL21hc3Rlci9lczYvMjAxNC0wNC9hcHItOS5tZCM1MS1vYmplY3RlbnRyaWVzLW9iamVjdHZhbHVlc1xyXG4gICAgdmFsdWVzOiAgY3JlYXRlT2JqZWN0VG9BcnJheShmYWxzZSksXHJcbiAgICBlbnRyaWVzOiBjcmVhdGVPYmplY3RUb0FycmF5KHRydWUpXHJcbiAgfSk7XHJcbiAgJGRlZmluZShTVEFUSUMsIFJFR0VYUCwge1xyXG4gICAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20va2FuZ2F4Lzk2OTgxMDBcclxuICAgIGVzY2FwZTogY3JlYXRlUmVwbGFjZXIoLyhbXFxcXFxcLVtcXF17fSgpKis/LixeJHxdKS9nLCAnXFxcXCQxJywgdHJ1ZSlcclxuICB9KTtcclxufSgpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBlczcuYWJzdHJhY3QtcmVmcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vemVucGFyc2luZy9lcy1hYnN0cmFjdC1yZWZzXHJcbiFmdW5jdGlvbihSRUZFUkVOQ0Upe1xyXG4gIFJFRkVSRU5DRV9HRVQgPSBnZXRXZWxsS25vd25TeW1ib2woUkVGRVJFTkNFKydHZXQnLCB0cnVlKTtcclxuICB2YXIgUkVGRVJFTkNFX1NFVCA9IGdldFdlbGxLbm93blN5bWJvbChSRUZFUkVOQ0UrU0VULCB0cnVlKVxyXG4gICAgLCBSRUZFUkVOQ0VfREVMRVRFID0gZ2V0V2VsbEtub3duU3ltYm9sKFJFRkVSRU5DRSsnRGVsZXRlJywgdHJ1ZSk7XHJcbiAgXHJcbiAgJGRlZmluZShTVEFUSUMsIFNZTUJPTCwge1xyXG4gICAgcmVmZXJlbmNlR2V0OiBSRUZFUkVOQ0VfR0VULFxyXG4gICAgcmVmZXJlbmNlU2V0OiBSRUZFUkVOQ0VfU0VULFxyXG4gICAgcmVmZXJlbmNlRGVsZXRlOiBSRUZFUkVOQ0VfREVMRVRFXHJcbiAgfSk7XHJcbiAgXHJcbiAgaGlkZGVuKEZ1bmN0aW9uUHJvdG8sIFJFRkVSRU5DRV9HRVQsIHJldHVyblRoaXMpO1xyXG4gIFxyXG4gIGZ1bmN0aW9uIHNldE1hcE1ldGhvZHMoQ29uc3RydWN0b3Ipe1xyXG4gICAgaWYoQ29uc3RydWN0b3Ipe1xyXG4gICAgICB2YXIgTWFwUHJvdG8gPSBDb25zdHJ1Y3RvcltQUk9UT1RZUEVdO1xyXG4gICAgICBoaWRkZW4oTWFwUHJvdG8sIFJFRkVSRU5DRV9HRVQsIE1hcFByb3RvLmdldCk7XHJcbiAgICAgIGhpZGRlbihNYXBQcm90bywgUkVGRVJFTkNFX1NFVCwgTWFwUHJvdG8uc2V0KTtcclxuICAgICAgaGlkZGVuKE1hcFByb3RvLCBSRUZFUkVOQ0VfREVMRVRFLCBNYXBQcm90b1snZGVsZXRlJ10pO1xyXG4gICAgfVxyXG4gIH1cclxuICBzZXRNYXBNZXRob2RzKE1hcCk7XHJcbiAgc2V0TWFwTWV0aG9kcyhXZWFrTWFwKTtcclxufSgncmVmZXJlbmNlJyk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvcmUuZGljdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbihESUNUKXtcclxuICBEaWN0ID0gZnVuY3Rpb24oaXRlcmFibGUpe1xyXG4gICAgdmFyIGRpY3QgPSBjcmVhdGUobnVsbCk7XHJcbiAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpe1xyXG4gICAgICBpZihpc0l0ZXJhYmxlKGl0ZXJhYmxlKSl7XHJcbiAgICAgICAgZm9yT2YoaXRlcmFibGUsIHRydWUsIGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xyXG4gICAgICAgICAgZGljdFtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBhc3NpZ24oZGljdCwgaXRlcmFibGUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRpY3Q7XHJcbiAgfVxyXG4gIERpY3RbUFJPVE9UWVBFXSA9IG51bGw7XHJcbiAgXHJcbiAgZnVuY3Rpb24gRGljdEl0ZXJhdG9yKGl0ZXJhdGVkLCBraW5kKXtcclxuICAgIHNldCh0aGlzLCBJVEVSLCB7bzogdG9PYmplY3QoaXRlcmF0ZWQpLCBhOiBnZXRLZXlzKGl0ZXJhdGVkKSwgaTogMCwgazoga2luZH0pO1xyXG4gIH1cclxuICBjcmVhdGVJdGVyYXRvcihEaWN0SXRlcmF0b3IsIERJQ1QsIGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgaXRlciA9IHRoaXNbSVRFUl1cclxuICAgICAgLCBPICAgID0gaXRlci5vXHJcbiAgICAgICwga2V5cyA9IGl0ZXIuYVxyXG4gICAgICAsIGtpbmQgPSBpdGVyLmtcclxuICAgICAgLCBrZXk7XHJcbiAgICBkbyB7XHJcbiAgICAgIGlmKGl0ZXIuaSA+PSBrZXlzLmxlbmd0aCl7XHJcbiAgICAgICAgaXRlci5vID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiBpdGVyUmVzdWx0KDEpO1xyXG4gICAgICB9XHJcbiAgICB9IHdoaWxlKCFoYXMoTywga2V5ID0ga2V5c1tpdGVyLmkrK10pKTtcclxuICAgIGlmKGtpbmQgPT0gS0VZKSAgcmV0dXJuIGl0ZXJSZXN1bHQoMCwga2V5KTtcclxuICAgIGlmKGtpbmQgPT0gVkFMVUUpcmV0dXJuIGl0ZXJSZXN1bHQoMCwgT1trZXldKTtcclxuICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZXJSZXN1bHQoMCwgW2tleSwgT1trZXldXSk7XHJcbiAgfSk7XHJcbiAgZnVuY3Rpb24gY3JlYXRlRGljdEl0ZXIoa2luZCl7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oaXQpe1xyXG4gICAgICByZXR1cm4gbmV3IERpY3RJdGVyYXRvcihpdCwga2luZCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIC8qXHJcbiAgICogMCAtPiBmb3JFYWNoXHJcbiAgICogMSAtPiBtYXBcclxuICAgKiAyIC0+IGZpbHRlclxyXG4gICAqIDMgLT4gc29tZVxyXG4gICAqIDQgLT4gZXZlcnlcclxuICAgKiA1IC0+IGZpbmRcclxuICAgKiA2IC0+IGZpbmRLZXlcclxuICAgKiA3IC0+IG1hcFBhaXJzXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gY3JlYXRlRGljdE1ldGhvZCh0eXBlKXtcclxuICAgIHZhciBpc01hcCAgICA9IHR5cGUgPT0gMVxyXG4gICAgICAsIGlzRXZlcnkgID0gdHlwZSA9PSA0O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCwgY2FsbGJhY2tmbiwgdGhhdCAvKiA9IHVuZGVmaW5lZCAqLyl7XHJcbiAgICAgIHZhciBmICAgICAgPSBjdHgoY2FsbGJhY2tmbiwgdGhhdCwgMylcclxuICAgICAgICAsIE8gICAgICA9IHRvT2JqZWN0KG9iamVjdClcclxuICAgICAgICAsIHJlc3VsdCA9IGlzTWFwIHx8IHR5cGUgPT0gNyB8fCB0eXBlID09IDIgPyBuZXcgKGdlbmVyaWModGhpcywgRGljdCkpIDogdW5kZWZpbmVkXHJcbiAgICAgICAgLCBrZXksIHZhbCwgcmVzO1xyXG4gICAgICBmb3Ioa2V5IGluIE8paWYoaGFzKE8sIGtleSkpe1xyXG4gICAgICAgIHZhbCA9IE9ba2V5XTtcclxuICAgICAgICByZXMgPSBmKHZhbCwga2V5LCBvYmplY3QpO1xyXG4gICAgICAgIGlmKHR5cGUpe1xyXG4gICAgICAgICAgaWYoaXNNYXApcmVzdWx0W2tleV0gPSByZXM7ICAgICAgICAgICAgIC8vIG1hcFxyXG4gICAgICAgICAgZWxzZSBpZihyZXMpc3dpdGNoKHR5cGUpe1xyXG4gICAgICAgICAgICBjYXNlIDI6IHJlc3VsdFtrZXldID0gdmFsOyBicmVhayAgICAgIC8vIGZpbHRlclxyXG4gICAgICAgICAgICBjYXNlIDM6IHJldHVybiB0cnVlOyAgICAgICAgICAgICAgICAgIC8vIHNvbWVcclxuICAgICAgICAgICAgY2FzZSA1OiByZXR1cm4gdmFsOyAgICAgICAgICAgICAgICAgICAvLyBmaW5kXHJcbiAgICAgICAgICAgIGNhc2UgNjogcmV0dXJuIGtleTsgICAgICAgICAgICAgICAgICAgLy8gZmluZEtleVxyXG4gICAgICAgICAgICBjYXNlIDc6IHJlc3VsdFtyZXNbMF1dID0gcmVzWzFdOyAgICAgIC8vIG1hcFBhaXJzXHJcbiAgICAgICAgICB9IGVsc2UgaWYoaXNFdmVyeSlyZXR1cm4gZmFsc2U7ICAgICAgICAgLy8gZXZlcnlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHR5cGUgPT0gMyB8fCBpc0V2ZXJ5ID8gaXNFdmVyeSA6IHJlc3VsdDtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gY3JlYXRlRGljdFJlZHVjZShpc1R1cm4pe1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCwgbWFwZm4sIGluaXQpe1xyXG4gICAgICBhc3NlcnRGdW5jdGlvbihtYXBmbik7XHJcbiAgICAgIHZhciBPICAgICAgPSB0b09iamVjdChvYmplY3QpXHJcbiAgICAgICAgLCBrZXlzICAgPSBnZXRLZXlzKE8pXHJcbiAgICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxyXG4gICAgICAgICwgaSAgICAgID0gMFxyXG4gICAgICAgICwgbWVtbywga2V5LCByZXN1bHQ7XHJcbiAgICAgIGlmKGlzVHVybiltZW1vID0gaW5pdCA9PSB1bmRlZmluZWQgPyBuZXcgKGdlbmVyaWModGhpcywgRGljdCkpIDogT2JqZWN0KGluaXQpO1xyXG4gICAgICBlbHNlIGlmKGFyZ3VtZW50cy5sZW5ndGggPCAzKXtcclxuICAgICAgICBhc3NlcnQobGVuZ3RoLCBSRURVQ0VfRVJST1IpO1xyXG4gICAgICAgIG1lbW8gPSBPW2tleXNbaSsrXV07XHJcbiAgICAgIH0gZWxzZSBtZW1vID0gT2JqZWN0KGluaXQpO1xyXG4gICAgICB3aGlsZShsZW5ndGggPiBpKWlmKGhhcyhPLCBrZXkgPSBrZXlzW2krK10pKXtcclxuICAgICAgICByZXN1bHQgPSBtYXBmbihtZW1vLCBPW2tleV0sIGtleSwgb2JqZWN0KTtcclxuICAgICAgICBpZihpc1R1cm4pe1xyXG4gICAgICAgICAgaWYocmVzdWx0ID09PSBmYWxzZSlicmVhaztcclxuICAgICAgICB9IGVsc2UgbWVtbyA9IHJlc3VsdDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbWVtbztcclxuICAgIH1cclxuICB9XHJcbiAgdmFyIGZpbmRLZXkgPSBjcmVhdGVEaWN0TWV0aG9kKDYpO1xyXG4gIGZ1bmN0aW9uIGluY2x1ZGVzKG9iamVjdCwgZWwpe1xyXG4gICAgcmV0dXJuIChlbCA9PSBlbCA/IGtleU9mKG9iamVjdCwgZWwpIDogZmluZEtleShvYmplY3QsIHNhbWVOYU4pKSAhPT0gdW5kZWZpbmVkO1xyXG4gIH1cclxuICBcclxuICB2YXIgZGljdE1ldGhvZHMgPSB7XHJcbiAgICBrZXlzOiAgICBjcmVhdGVEaWN0SXRlcihLRVkpLFxyXG4gICAgdmFsdWVzOiAgY3JlYXRlRGljdEl0ZXIoVkFMVUUpLFxyXG4gICAgZW50cmllczogY3JlYXRlRGljdEl0ZXIoS0VZK1ZBTFVFKSxcclxuICAgIGZvckVhY2g6IGNyZWF0ZURpY3RNZXRob2QoMCksXHJcbiAgICBtYXA6ICAgICBjcmVhdGVEaWN0TWV0aG9kKDEpLFxyXG4gICAgZmlsdGVyOiAgY3JlYXRlRGljdE1ldGhvZCgyKSxcclxuICAgIHNvbWU6ICAgIGNyZWF0ZURpY3RNZXRob2QoMyksXHJcbiAgICBldmVyeTogICBjcmVhdGVEaWN0TWV0aG9kKDQpLFxyXG4gICAgZmluZDogICAgY3JlYXRlRGljdE1ldGhvZCg1KSxcclxuICAgIGZpbmRLZXk6IGZpbmRLZXksXHJcbiAgICBtYXBQYWlyczpjcmVhdGVEaWN0TWV0aG9kKDcpLFxyXG4gICAgcmVkdWNlOiAgY3JlYXRlRGljdFJlZHVjZShmYWxzZSksXHJcbiAgICB0dXJuOiAgICBjcmVhdGVEaWN0UmVkdWNlKHRydWUpLFxyXG4gICAga2V5T2Y6ICAga2V5T2YsXHJcbiAgICBpbmNsdWRlczppbmNsdWRlcyxcclxuICAgIC8vIEhhcyAvIGdldCAvIHNldCBvd24gcHJvcGVydHlcclxuICAgIGhhczogaGFzLFxyXG4gICAgZ2V0OiBnZXQsXHJcbiAgICBzZXQ6IGNyZWF0ZURlZmluZXIoMCksXHJcbiAgICBpc0RpY3Q6IGZ1bmN0aW9uKGl0KXtcclxuICAgICAgcmV0dXJuIGlzT2JqZWN0KGl0KSAmJiBnZXRQcm90b3R5cGVPZihpdCkgPT09IERpY3RbUFJPVE9UWVBFXTtcclxuICAgIH1cclxuICB9O1xyXG4gIFxyXG4gIGlmKFJFRkVSRU5DRV9HRVQpZm9yKHZhciBrZXkgaW4gZGljdE1ldGhvZHMpIWZ1bmN0aW9uKGZuKXtcclxuICAgIGZ1bmN0aW9uIG1ldGhvZCgpe1xyXG4gICAgICBmb3IodmFyIGFyZ3MgPSBbdGhpc10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDspYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcclxuICAgICAgcmV0dXJuIGludm9rZShmbiwgYXJncyk7XHJcbiAgICB9XHJcbiAgICBmbltSRUZFUkVOQ0VfR0VUXSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiBtZXRob2Q7XHJcbiAgICB9XHJcbiAgfShkaWN0TWV0aG9kc1trZXldKTtcclxuICBcclxuICAkZGVmaW5lKEdMT0JBTCArIEZPUkNFRCwge0RpY3Q6IGFzc2lnbkhpZGRlbihEaWN0LCBkaWN0TWV0aG9kcyl9KTtcclxufSgnRGljdCcpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb3JlLiRmb3IgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oRU5UUklFUywgRk4peyAgXHJcbiAgZnVuY3Rpb24gJGZvcihpdGVyYWJsZSwgZW50cmllcyl7XHJcbiAgICBpZighKHRoaXMgaW5zdGFuY2VvZiAkZm9yKSlyZXR1cm4gbmV3ICRmb3IoaXRlcmFibGUsIGVudHJpZXMpO1xyXG4gICAgdGhpc1tJVEVSXSAgICA9IGdldEl0ZXJhdG9yKGl0ZXJhYmxlKTtcclxuICAgIHRoaXNbRU5UUklFU10gPSAhIWVudHJpZXM7XHJcbiAgfVxyXG4gIFxyXG4gIGNyZWF0ZUl0ZXJhdG9yKCRmb3IsICdXcmFwcGVyJywgZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzW0lURVJdLm5leHQoKTtcclxuICB9KTtcclxuICB2YXIgJGZvclByb3RvID0gJGZvcltQUk9UT1RZUEVdO1xyXG4gIHNldEl0ZXJhdG9yKCRmb3JQcm90bywgZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzW0lURVJdOyAvLyB1bndyYXBcclxuICB9KTtcclxuICBcclxuICBmdW5jdGlvbiBjcmVhdGVDaGFpbkl0ZXJhdG9yKG5leHQpe1xyXG4gICAgZnVuY3Rpb24gSXRlcihJLCBmbiwgdGhhdCl7XHJcbiAgICAgIHRoaXNbSVRFUl0gICAgPSBnZXRJdGVyYXRvcihJKTtcclxuICAgICAgdGhpc1tFTlRSSUVTXSA9IElbRU5UUklFU107XHJcbiAgICAgIHRoaXNbRk5dICAgICAgPSBjdHgoZm4sIHRoYXQsIElbRU5UUklFU10gPyAyIDogMSk7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVJdGVyYXRvcihJdGVyLCAnQ2hhaW4nLCBuZXh0LCAkZm9yUHJvdG8pO1xyXG4gICAgc2V0SXRlcmF0b3IoSXRlcltQUk9UT1RZUEVdLCByZXR1cm5UaGlzKTsgLy8gb3ZlcnJpZGUgJGZvclByb3RvIGl0ZXJhdG9yXHJcbiAgICByZXR1cm4gSXRlcjtcclxuICB9XHJcbiAgXHJcbiAgdmFyIE1hcEl0ZXIgPSBjcmVhdGVDaGFpbkl0ZXJhdG9yKGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgc3RlcCA9IHRoaXNbSVRFUl0ubmV4dCgpO1xyXG4gICAgcmV0dXJuIHN0ZXAuZG9uZSA/IHN0ZXAgOiBpdGVyUmVzdWx0KDAsIHN0ZXBDYWxsKHRoaXNbRk5dLCBzdGVwLnZhbHVlLCB0aGlzW0VOVFJJRVNdKSk7XHJcbiAgfSk7XHJcbiAgXHJcbiAgdmFyIEZpbHRlckl0ZXIgPSBjcmVhdGVDaGFpbkl0ZXJhdG9yKGZ1bmN0aW9uKCl7XHJcbiAgICBmb3IoOzspe1xyXG4gICAgICB2YXIgc3RlcCA9IHRoaXNbSVRFUl0ubmV4dCgpO1xyXG4gICAgICBpZihzdGVwLmRvbmUgfHwgc3RlcENhbGwodGhpc1tGTl0sIHN0ZXAudmFsdWUsIHRoaXNbRU5UUklFU10pKXJldHVybiBzdGVwO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIFxyXG4gIGFzc2lnbkhpZGRlbigkZm9yUHJvdG8sIHtcclxuICAgIG9mOiBmdW5jdGlvbihmbiwgdGhhdCl7XHJcbiAgICAgIGZvck9mKHRoaXMsIHRoaXNbRU5UUklFU10sIGZuLCB0aGF0KTtcclxuICAgIH0sXHJcbiAgICBhcnJheTogZnVuY3Rpb24oZm4sIHRoYXQpe1xyXG4gICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgIGZvck9mKGZuICE9IHVuZGVmaW5lZCA/IHRoaXMubWFwKGZuLCB0aGF0KSA6IHRoaXMsIGZhbHNlLCBwdXNoLCByZXN1bHQpO1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSxcclxuICAgIGZpbHRlcjogZnVuY3Rpb24oZm4sIHRoYXQpe1xyXG4gICAgICByZXR1cm4gbmV3IEZpbHRlckl0ZXIodGhpcywgZm4sIHRoYXQpO1xyXG4gICAgfSxcclxuICAgIG1hcDogZnVuY3Rpb24oZm4sIHRoYXQpe1xyXG4gICAgICByZXR1cm4gbmV3IE1hcEl0ZXIodGhpcywgZm4sIHRoYXQpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIFxyXG4gICRmb3IuaXNJdGVyYWJsZSAgPSBpc0l0ZXJhYmxlO1xyXG4gICRmb3IuZ2V0SXRlcmF0b3IgPSBnZXRJdGVyYXRvcjtcclxuICBcclxuICAkZGVmaW5lKEdMT0JBTCArIEZPUkNFRCwgeyRmb3I6ICRmb3J9KTtcclxufSgnZW50cmllcycsIHNhZmVTeW1ib2woJ2ZuJykpO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb3JlLmRlbGF5ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vLyBodHRwczovL2VzZGlzY3Vzcy5vcmcvdG9waWMvcHJvbWlzZS1yZXR1cm5pbmctZGVsYXktZnVuY3Rpb25cclxuJGRlZmluZShHTE9CQUwgKyBGT1JDRUQsIHtcclxuICBkZWxheTogZnVuY3Rpb24odGltZSl7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSl7XHJcbiAgICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgdGltZSwgdHJ1ZSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn0pO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb3JlLmJpbmRpbmcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oXywgdG9Mb2NhbGVTdHJpbmcpe1xyXG4gIC8vIFBsYWNlaG9sZGVyXHJcbiAgY29yZS5fID0gcGF0aC5fID0gcGF0aC5fIHx8IHt9O1xyXG5cclxuICAkZGVmaW5lKFBST1RPICsgRk9SQ0VELCBGVU5DVElPTiwge1xyXG4gICAgcGFydDogcGFydCxcclxuICAgIG9ubHk6IGZ1bmN0aW9uKG51bWJlckFyZ3VtZW50cywgdGhhdCAvKiA9IEAgKi8pe1xyXG4gICAgICB2YXIgZm4gICAgID0gYXNzZXJ0RnVuY3Rpb24odGhpcylcclxuICAgICAgICAsIG4gICAgICA9IHRvTGVuZ3RoKG51bWJlckFyZ3VtZW50cylcclxuICAgICAgICAsIGlzVGhhdCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxO1xyXG4gICAgICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IG1pbihuLCBhcmd1bWVudHMubGVuZ3RoKVxyXG4gICAgICAgICAgLCBhcmdzICAgPSBBcnJheShsZW5ndGgpXHJcbiAgICAgICAgICAsIGkgICAgICA9IDA7XHJcbiAgICAgICAgd2hpbGUobGVuZ3RoID4gaSlhcmdzW2ldID0gYXJndW1lbnRzW2krK107XHJcbiAgICAgICAgcmV0dXJuIGludm9rZShmbiwgYXJncywgaXNUaGF0ID8gdGhhdCA6IHRoaXMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgXHJcbiAgZnVuY3Rpb24gdGllKGtleSl7XHJcbiAgICB2YXIgdGhhdCAgPSB0aGlzXHJcbiAgICAgICwgYm91bmQgPSB7fTtcclxuICAgIHJldHVybiBoaWRkZW4odGhhdCwgXywgZnVuY3Rpb24oa2V5KXtcclxuICAgICAgaWYoa2V5ID09PSB1bmRlZmluZWQgfHwgIShrZXkgaW4gdGhhdCkpcmV0dXJuIHRvTG9jYWxlU3RyaW5nLmNhbGwodGhhdCk7XHJcbiAgICAgIHJldHVybiBoYXMoYm91bmQsIGtleSkgPyBib3VuZFtrZXldIDogKGJvdW5kW2tleV0gPSBjdHgodGhhdFtrZXldLCB0aGF0LCAtMSkpO1xyXG4gICAgfSlbX10oa2V5KTtcclxuICB9XHJcbiAgXHJcbiAgaGlkZGVuKHBhdGguXywgVE9fU1RSSU5HLCBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIF87XHJcbiAgfSk7XHJcbiAgXHJcbiAgaGlkZGVuKE9iamVjdFByb3RvLCBfLCB0aWUpO1xyXG4gIERFU0MgfHwgaGlkZGVuKEFycmF5UHJvdG8sIF8sIHRpZSk7XHJcbiAgLy8gSUU4LSBkaXJ0eSBoYWNrIC0gcmVkZWZpbmVkIHRvTG9jYWxlU3RyaW5nIGlzIG5vdCBlbnVtZXJhYmxlXHJcbn0oREVTQyA/IHVpZCgndGllJykgOiBUT19MT0NBTEUsIE9iamVjdFByb3RvW1RPX0xPQ0FMRV0pO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb3JlLm9iamVjdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oKXtcclxuICBmdW5jdGlvbiBkZWZpbmUodGFyZ2V0LCBtaXhpbil7XHJcbiAgICB2YXIga2V5cyAgID0gb3duS2V5cyh0b09iamVjdChtaXhpbikpXHJcbiAgICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcclxuICAgICAgLCBpID0gMCwga2V5O1xyXG4gICAgd2hpbGUobGVuZ3RoID4gaSlkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSA9IGtleXNbaSsrXSwgZ2V0T3duRGVzY3JpcHRvcihtaXhpbiwga2V5KSk7XHJcbiAgICByZXR1cm4gdGFyZ2V0O1xyXG4gIH07XHJcbiAgJGRlZmluZShTVEFUSUMgKyBGT1JDRUQsIE9CSkVDVCwge1xyXG4gICAgaXNPYmplY3Q6IGlzT2JqZWN0LFxyXG4gICAgY2xhc3NvZjogY2xhc3NvZixcclxuICAgIGRlZmluZTogZGVmaW5lLFxyXG4gICAgbWFrZTogZnVuY3Rpb24ocHJvdG8sIG1peGluKXtcclxuICAgICAgcmV0dXJuIGRlZmluZShjcmVhdGUocHJvdG8pLCBtaXhpbik7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn0oKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogY29yZS5hcnJheSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuJGRlZmluZShQUk9UTyArIEZPUkNFRCwgQVJSQVksIHtcclxuICB0dXJuOiBmdW5jdGlvbihmbiwgdGFyZ2V0IC8qID0gW10gKi8pe1xyXG4gICAgYXNzZXJ0RnVuY3Rpb24oZm4pO1xyXG4gICAgdmFyIG1lbW8gICA9IHRhcmdldCA9PSB1bmRlZmluZWQgPyBbXSA6IE9iamVjdCh0YXJnZXQpXHJcbiAgICAgICwgTyAgICAgID0gRVM1T2JqZWN0KHRoaXMpXHJcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpXHJcbiAgICAgICwgaW5kZXggID0gMDtcclxuICAgIHdoaWxlKGxlbmd0aCA+IGluZGV4KWlmKGZuKG1lbW8sIE9baW5kZXhdLCBpbmRleCsrLCB0aGlzKSA9PT0gZmFsc2UpYnJlYWs7XHJcbiAgICByZXR1cm4gbWVtbztcclxuICB9XHJcbn0pO1xyXG5pZihmcmFtZXdvcmspQXJyYXlVbnNjb3BhYmxlcy50dXJuID0gdHJ1ZTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogY29yZS5udW1iZXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKG51bWJlck1ldGhvZHMpeyAgXHJcbiAgZnVuY3Rpb24gTnVtYmVySXRlcmF0b3IoaXRlcmF0ZWQpe1xyXG4gICAgc2V0KHRoaXMsIElURVIsIHtsOiB0b0xlbmd0aChpdGVyYXRlZCksIGk6IDB9KTtcclxuICB9XHJcbiAgY3JlYXRlSXRlcmF0b3IoTnVtYmVySXRlcmF0b3IsIE5VTUJFUiwgZnVuY3Rpb24oKXtcclxuICAgIHZhciBpdGVyID0gdGhpc1tJVEVSXVxyXG4gICAgICAsIGkgICAgPSBpdGVyLmkrKztcclxuICAgIHJldHVybiBpIDwgaXRlci5sID8gaXRlclJlc3VsdCgwLCBpKSA6IGl0ZXJSZXN1bHQoMSk7XHJcbiAgfSk7XHJcbiAgZGVmaW5lSXRlcmF0b3IoTnVtYmVyLCBOVU1CRVIsIGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gbmV3IE51bWJlckl0ZXJhdG9yKHRoaXMpO1xyXG4gIH0pO1xyXG4gIFxyXG4gIG51bWJlck1ldGhvZHMucmFuZG9tID0gZnVuY3Rpb24obGltIC8qID0gMCAqLyl7XHJcbiAgICB2YXIgYSA9ICt0aGlzXHJcbiAgICAgICwgYiA9IGxpbSA9PSB1bmRlZmluZWQgPyAwIDogK2xpbVxyXG4gICAgICAsIG0gPSBtaW4oYSwgYik7XHJcbiAgICByZXR1cm4gcmFuZG9tKCkgKiAobWF4KGEsIGIpIC0gbSkgKyBtO1xyXG4gIH07XHJcblxyXG4gIGZvckVhY2guY2FsbChhcnJheShcclxuICAgICAgLy8gRVMzOlxyXG4gICAgICAncm91bmQsZmxvb3IsY2VpbCxhYnMsc2luLGFzaW4sY29zLGFjb3MsdGFuLGF0YW4sZXhwLHNxcnQsbWF4LG1pbixwb3csYXRhbjIsJyArXHJcbiAgICAgIC8vIEVTNjpcclxuICAgICAgJ2Fjb3NoLGFzaW5oLGF0YW5oLGNicnQsY2x6MzIsY29zaCxleHBtMSxoeXBvdCxpbXVsLGxvZzFwLGxvZzEwLGxvZzIsc2lnbixzaW5oLHRhbmgsdHJ1bmMnXHJcbiAgICApLCBmdW5jdGlvbihrZXkpe1xyXG4gICAgICB2YXIgZm4gPSBNYXRoW2tleV07XHJcbiAgICAgIGlmKGZuKW51bWJlck1ldGhvZHNba2V5XSA9IGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xyXG4gICAgICAgIC8vIGllOS0gZG9udCBzdXBwb3J0IHN0cmljdCBtb2RlICYgY29udmVydCBgdGhpc2AgdG8gb2JqZWN0IC0+IGNvbnZlcnQgaXQgdG8gbnVtYmVyXHJcbiAgICAgICAgdmFyIGFyZ3MgPSBbK3RoaXNdXHJcbiAgICAgICAgICAsIGkgICAgPSAwO1xyXG4gICAgICAgIHdoaWxlKGFyZ3VtZW50cy5sZW5ndGggPiBpKWFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XHJcbiAgICAgICAgcmV0dXJuIGludm9rZShmbiwgYXJncyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICApO1xyXG4gIFxyXG4gICRkZWZpbmUoUFJPVE8gKyBGT1JDRUQsIE5VTUJFUiwgbnVtYmVyTWV0aG9kcyk7XHJcbn0oe30pO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBNb2R1bGUgOiBjb3JlLnN0cmluZyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4hZnVuY3Rpb24oKXtcclxuICB2YXIgZXNjYXBlSFRNTERpY3QgPSB7XHJcbiAgICAnJic6ICcmYW1wOycsXHJcbiAgICAnPCc6ICcmbHQ7JyxcclxuICAgICc+JzogJyZndDsnLFxyXG4gICAgJ1wiJzogJyZxdW90OycsXHJcbiAgICBcIidcIjogJyZhcG9zOydcclxuICB9LCB1bmVzY2FwZUhUTUxEaWN0ID0ge30sIGtleTtcclxuICBmb3Ioa2V5IGluIGVzY2FwZUhUTUxEaWN0KXVuZXNjYXBlSFRNTERpY3RbZXNjYXBlSFRNTERpY3Rba2V5XV0gPSBrZXk7XHJcbiAgJGRlZmluZShQUk9UTyArIEZPUkNFRCwgU1RSSU5HLCB7XHJcbiAgICBlc2NhcGVIVE1MOiAgIGNyZWF0ZVJlcGxhY2VyKC9bJjw+XCInXS9nLCBlc2NhcGVIVE1MRGljdCksXHJcbiAgICB1bmVzY2FwZUhUTUw6IGNyZWF0ZVJlcGxhY2VyKC8mKD86YW1wfGx0fGd0fHF1b3R8YXBvcyk7L2csIHVuZXNjYXBlSFRNTERpY3QpXHJcbiAgfSk7XHJcbn0oKTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDogY29yZS5kYXRlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuIWZ1bmN0aW9uKGZvcm1hdFJlZ0V4cCwgZmxleGlvUmVnRXhwLCBsb2NhbGVzLCBjdXJyZW50LCBTRUNPTkRTLCBNSU5VVEVTLCBIT1VSUywgTU9OVEgsIFlFQVIpe1xyXG4gIGZ1bmN0aW9uIGNyZWF0ZUZvcm1hdChwcmVmaXgpe1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRlbXBsYXRlLCBsb2NhbGUgLyogPSBjdXJyZW50ICovKXtcclxuICAgICAgdmFyIHRoYXQgPSB0aGlzXHJcbiAgICAgICAgLCBkaWN0ID0gbG9jYWxlc1toYXMobG9jYWxlcywgbG9jYWxlKSA/IGxvY2FsZSA6IGN1cnJlbnRdO1xyXG4gICAgICBmdW5jdGlvbiBnZXQodW5pdCl7XHJcbiAgICAgICAgcmV0dXJuIHRoYXRbcHJlZml4ICsgdW5pdF0oKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gU3RyaW5nKHRlbXBsYXRlKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24ocGFydCl7XHJcbiAgICAgICAgc3dpdGNoKHBhcnQpe1xyXG4gICAgICAgICAgY2FzZSAncycgIDogcmV0dXJuIGdldChTRUNPTkRTKTsgICAgICAgICAgICAgICAgICAvLyBTZWNvbmRzIDogMC01OVxyXG4gICAgICAgICAgY2FzZSAnc3MnIDogcmV0dXJuIGx6KGdldChTRUNPTkRTKSk7ICAgICAgICAgICAgICAvLyBTZWNvbmRzIDogMDAtNTlcclxuICAgICAgICAgIGNhc2UgJ20nICA6IHJldHVybiBnZXQoTUlOVVRFUyk7ICAgICAgICAgICAgICAgICAgLy8gTWludXRlcyA6IDAtNTlcclxuICAgICAgICAgIGNhc2UgJ21tJyA6IHJldHVybiBseihnZXQoTUlOVVRFUykpOyAgICAgICAgICAgICAgLy8gTWludXRlcyA6IDAwLTU5XHJcbiAgICAgICAgICBjYXNlICdoJyAgOiByZXR1cm4gZ2V0KEhPVVJTKTsgICAgICAgICAgICAgICAgICAgIC8vIEhvdXJzICAgOiAwLTIzXHJcbiAgICAgICAgICBjYXNlICdoaCcgOiByZXR1cm4gbHooZ2V0KEhPVVJTKSk7ICAgICAgICAgICAgICAgIC8vIEhvdXJzICAgOiAwMC0yM1xyXG4gICAgICAgICAgY2FzZSAnRCcgIDogcmV0dXJuIGdldChEQVRFKTsgICAgICAgICAgICAgICAgICAgICAvLyBEYXRlICAgIDogMS0zMVxyXG4gICAgICAgICAgY2FzZSAnREQnIDogcmV0dXJuIGx6KGdldChEQVRFKSk7ICAgICAgICAgICAgICAgICAvLyBEYXRlICAgIDogMDEtMzFcclxuICAgICAgICAgIGNhc2UgJ1cnICA6IHJldHVybiBkaWN0WzBdW2dldCgnRGF5JyldOyAgICAgICAgICAgLy8gRGF5ICAgICA6INCf0L7QvdC10LTQtdC70YzQvdC40LpcclxuICAgICAgICAgIGNhc2UgJ04nICA6IHJldHVybiBnZXQoTU9OVEgpICsgMTsgICAgICAgICAgICAgICAgLy8gTW9udGggICA6IDEtMTJcclxuICAgICAgICAgIGNhc2UgJ05OJyA6IHJldHVybiBseihnZXQoTU9OVEgpICsgMSk7ICAgICAgICAgICAgLy8gTW9udGggICA6IDAxLTEyXHJcbiAgICAgICAgICBjYXNlICdNJyAgOiByZXR1cm4gZGljdFsyXVtnZXQoTU9OVEgpXTsgICAgICAgICAgIC8vIE1vbnRoICAgOiDQr9C90LLQsNGA0YxcclxuICAgICAgICAgIGNhc2UgJ01NJyA6IHJldHVybiBkaWN0WzFdW2dldChNT05USCldOyAgICAgICAgICAgLy8gTW9udGggICA6INCv0L3QstCw0YDRj1xyXG4gICAgICAgICAgY2FzZSAnWScgIDogcmV0dXJuIGdldChZRUFSKTsgICAgICAgICAgICAgICAgICAgICAvLyBZZWFyICAgIDogMjAxNFxyXG4gICAgICAgICAgY2FzZSAnWVknIDogcmV0dXJuIGx6KGdldChZRUFSKSAlIDEwMCk7ICAgICAgICAgICAvLyBZZWFyICAgIDogMTRcclxuICAgICAgICB9IHJldHVybiBwYXJ0O1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gYWRkTG9jYWxlKGxhbmcsIGxvY2FsZSl7XHJcbiAgICBmdW5jdGlvbiBzcGxpdChpbmRleCl7XHJcbiAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgZm9yRWFjaC5jYWxsKGFycmF5KGxvY2FsZS5tb250aHMpLCBmdW5jdGlvbihpdCl7XHJcbiAgICAgICAgcmVzdWx0LnB1c2goaXQucmVwbGFjZShmbGV4aW9SZWdFeHAsICckJyArIGluZGV4KSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgbG9jYWxlc1tsYW5nXSA9IFthcnJheShsb2NhbGUud2Vla2RheXMpLCBzcGxpdCgxKSwgc3BsaXQoMildO1xyXG4gICAgcmV0dXJuIGNvcmU7XHJcbiAgfVxyXG4gICRkZWZpbmUoUFJPVE8gKyBGT1JDRUQsIERBVEUsIHtcclxuICAgIGZvcm1hdDogICAgY3JlYXRlRm9ybWF0KCdnZXQnKSxcclxuICAgIGZvcm1hdFVUQzogY3JlYXRlRm9ybWF0KCdnZXRVVEMnKVxyXG4gIH0pO1xyXG4gIGFkZExvY2FsZShjdXJyZW50LCB7XHJcbiAgICB3ZWVrZGF5czogJ1N1bmRheSxNb25kYXksVHVlc2RheSxXZWRuZXNkYXksVGh1cnNkYXksRnJpZGF5LFNhdHVyZGF5JyxcclxuICAgIG1vbnRoczogJ0phbnVhcnksRmVicnVhcnksTWFyY2gsQXByaWwsTWF5LEp1bmUsSnVseSxBdWd1c3QsU2VwdGVtYmVyLE9jdG9iZXIsTm92ZW1iZXIsRGVjZW1iZXInXHJcbiAgfSk7XHJcbiAgYWRkTG9jYWxlKCdydScsIHtcclxuICAgIHdlZWtkYXlzOiAn0JLQvtGB0LrRgNC10YHQtdC90YzQtSzQn9C+0L3QtdC00LXQu9GM0L3QuNC6LNCS0YLQvtGA0L3QuNC6LNCh0YDQtdC00LAs0KfQtdGC0LLQtdGA0LMs0J/Rj9GC0L3QuNGG0LAs0KHRg9Cx0LHQvtGC0LAnLFxyXG4gICAgbW9udGhzOiAn0K/QvdCy0LDRgDrRj3zRjCzQpNC10LLRgNCw0Ls60Y980Yws0JzQsNGA0YI60LB8LNCQ0L/RgNC10Ls60Y980Yws0JzQsDrRj3zQuSzQmNGO0L060Y980YwsJyArXHJcbiAgICAgICAgICAgICfQmNGO0Ls60Y980Yws0JDQstCz0YPRgdGCOtCwfCzQodC10L3RgtGP0LHRgDrRj3zRjCzQntC60YLRj9Cx0YA60Y980Yws0J3QvtGP0LHRgDrRj3zRjCzQlNC10LrQsNCx0YA60Y980YwnXHJcbiAgfSk7XHJcbiAgY29yZS5sb2NhbGUgPSBmdW5jdGlvbihsb2NhbGUpe1xyXG4gICAgcmV0dXJuIGhhcyhsb2NhbGVzLCBsb2NhbGUpID8gY3VycmVudCA9IGxvY2FsZSA6IGN1cnJlbnQ7XHJcbiAgfTtcclxuICBjb3JlLmFkZExvY2FsZSA9IGFkZExvY2FsZTtcclxufSgvXFxiXFx3XFx3P1xcYi9nLCAvOiguKilcXHwoLiopJC8sIHt9LCAnZW4nLCAnU2Vjb25kcycsICdNaW51dGVzJywgJ0hvdXJzJywgJ01vbnRoJywgJ0Z1bGxZZWFyJyk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvcmUuZ2xvYmFsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiRkZWZpbmUoR0xPQkFMICsgRk9SQ0VELCB7Z2xvYmFsOiBnbG9iYWx9KTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTW9kdWxlIDoganMuYXJyYXkuc3RhdGljcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gSmF2YVNjcmlwdCAxLjYgLyBTdHJhd21hbiBhcnJheSBzdGF0aWNzIHNoaW1cclxuIWZ1bmN0aW9uKGFycmF5U3RhdGljcyl7XHJcbiAgZnVuY3Rpb24gc2V0QXJyYXlTdGF0aWNzKGtleXMsIGxlbmd0aCl7XHJcbiAgICBmb3JFYWNoLmNhbGwoYXJyYXkoa2V5cyksIGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIGlmKGtleSBpbiBBcnJheVByb3RvKWFycmF5U3RhdGljc1trZXldID0gY3R4KGNhbGwsIEFycmF5UHJvdG9ba2V5XSwgbGVuZ3RoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBzZXRBcnJheVN0YXRpY3MoJ3BvcCxyZXZlcnNlLHNoaWZ0LGtleXMsdmFsdWVzLGVudHJpZXMnLCAxKTtcclxuICBzZXRBcnJheVN0YXRpY3MoJ2luZGV4T2YsZXZlcnksc29tZSxmb3JFYWNoLG1hcCxmaWx0ZXIsZmluZCxmaW5kSW5kZXgsaW5jbHVkZXMnLCAzKTtcclxuICBzZXRBcnJheVN0YXRpY3MoJ2pvaW4sc2xpY2UsY29uY2F0LHB1c2gsc3BsaWNlLHVuc2hpZnQsc29ydCxsYXN0SW5kZXhPZiwnICtcclxuICAgICAgICAgICAgICAgICAgJ3JlZHVjZSxyZWR1Y2VSaWdodCxjb3B5V2l0aGluLGZpbGwsdHVybicpO1xyXG4gICRkZWZpbmUoU1RBVElDLCBBUlJBWSwgYXJyYXlTdGF0aWNzKTtcclxufSh7fSk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IHdlYi5kb20uaXRhcmFibGUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbihOb2RlTGlzdCl7XHJcbiAgaWYoZnJhbWV3b3JrICYmIE5vZGVMaXN0ICYmICEoU1lNQk9MX0lURVJBVE9SIGluIE5vZGVMaXN0W1BST1RPVFlQRV0pKXtcclxuICAgIGhpZGRlbihOb2RlTGlzdFtQUk9UT1RZUEVdLCBTWU1CT0xfSVRFUkFUT1IsIEl0ZXJhdG9yc1tBUlJBWV0pO1xyXG4gIH1cclxuICBJdGVyYXRvcnMuTm9kZUxpc3QgPSBJdGVyYXRvcnNbQVJSQVldO1xyXG59KGdsb2JhbC5Ob2RlTGlzdCk7XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIE1vZHVsZSA6IGNvcmUubG9nICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiFmdW5jdGlvbihsb2csIGVuYWJsZWQpe1xyXG4gIC8vIE1ldGhvZHMgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vRGV2ZWxvcGVyVG9vbHNXRy9jb25zb2xlLW9iamVjdC9ibG9iL21hc3Rlci9hcGkubWRcclxuICBmb3JFYWNoLmNhbGwoYXJyYXkoJ2Fzc2VydCxjbGVhcixjb3VudCxkZWJ1ZyxkaXIsZGlyeG1sLGVycm9yLGV4Y2VwdGlvbiwnICtcclxuICAgICAgJ2dyb3VwLGdyb3VwQ29sbGFwc2VkLGdyb3VwRW5kLGluZm8saXNJbmRlcGVuZGVudGx5Q29tcG9zZWQsbG9nLCcgK1xyXG4gICAgICAnbWFya1RpbWVsaW5lLHByb2ZpbGUscHJvZmlsZUVuZCx0YWJsZSx0aW1lLHRpbWVFbmQsdGltZWxpbmUsJyArXHJcbiAgICAgICd0aW1lbGluZUVuZCx0aW1lU3RhbXAsdHJhY2Usd2FybicpLCBmdW5jdGlvbihrZXkpe1xyXG4gICAgbG9nW2tleV0gPSBmdW5jdGlvbigpe1xyXG4gICAgICBpZihlbmFibGVkICYmIGtleSBpbiBjb25zb2xlKXJldHVybiBhcHBseS5jYWxsKGNvbnNvbGVba2V5XSwgY29uc29sZSwgYXJndW1lbnRzKTtcclxuICAgIH07XHJcbiAgfSk7XHJcbiAgJGRlZmluZShHTE9CQUwgKyBGT1JDRUQsIHtsb2c6IGFzc2lnbihsb2cubG9nLCBsb2csIHtcclxuICAgIGVuYWJsZTogZnVuY3Rpb24oKXtcclxuICAgICAgZW5hYmxlZCA9IHRydWU7XHJcbiAgICB9LFxyXG4gICAgZGlzYWJsZTogZnVuY3Rpb24oKXtcclxuICAgICAgZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH0pfSk7XHJcbn0oe30sIHRydWUpO1xufSh0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKSwgZmFsc2UpO1xubW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiBtb2R1bGUuZXhwb3J0cywgX19lc01vZHVsZTogdHJ1ZSB9O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHByb3BzKSB7XG4gICAgICB2YXIgcHJvcCA9IHByb3BzW2tleV07XG4gICAgICBwcm9wLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICBpZiAocHJvcC52YWx1ZSkgcHJvcC53cml0YWJsZSA9IHRydWU7XG4gICAgfVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcyk7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9O1xufSkoKTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSAoZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcmF3UHJvcHMpIHtcbiAgICB2YXIgcHJvcHMgPSB7fTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmF3UHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwcm9wID0gcmF3UHJvcHNbaV07XG4gICAgICBwcm9wLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICBpZiAocHJvcC52YWx1ZSkgcHJvcC53cml0YWJsZSA9IHRydWU7XG4gICAgICBwcm9wc1twcm9wLmtleV0gPSBwcm9wO1xuICAgIH1cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgIGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgfTtcbn0pKCk7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfY29yZSA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanNcIilbXCJkZWZhdWx0XCJdO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uIGdldChfeCwgX3gyLCBfeDMpIHtcbiAgdmFyIF9hZ2FpbiA9IHRydWU7XG5cbiAgX2Z1bmN0aW9uOiB3aGlsZSAoX2FnYWluKSB7XG4gICAgX2FnYWluID0gZmFsc2U7XG4gICAgdmFyIG9iamVjdCA9IF94LFxuICAgICAgICBwcm9wZXJ0eSA9IF94MixcbiAgICAgICAgcmVjZWl2ZXIgPSBfeDM7XG4gICAgZGVzYyA9IHBhcmVudCA9IGdldHRlciA9IHVuZGVmaW5lZDtcblxuICAgIHZhciBkZXNjID0gX2NvcmUuT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTtcblxuICAgIGlmIChkZXNjID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBwYXJlbnQgPSBfY29yZS5PYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcblxuICAgICAgaWYgKHBhcmVudCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3ggPSBwYXJlbnQ7XG4gICAgICAgIF94MiA9IHByb3BlcnR5O1xuICAgICAgICBfeDMgPSByZWNlaXZlcjtcbiAgICAgICAgX2FnYWluID0gdHJ1ZTtcbiAgICAgICAgY29udGludWUgX2Z1bmN0aW9uO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MgJiYgZGVzYy53cml0YWJsZSkge1xuICAgICAgcmV0dXJuIGRlc2MudmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBnZXR0ZXIgPSBkZXNjLmdldDtcblxuICAgICAgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uIChzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7XG4gIH1cblxuICBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgdmFsdWU6IHN1YkNsYXNzLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIGlmIChzdXBlckNsYXNzKSBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzO1xufTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbXCJkZWZhdWx0XCJdIDogb2JqO1xufTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9jb3JlID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qc1wiKVtcImRlZmF1bHRcIl07XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZnVuY3Rpb24gKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgYXJyMltpXSA9IGFycltpXTtcblxuICAgIHJldHVybiBhcnIyO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBfY29yZS5BcnJheS5mcm9tKGFycik7XG4gIH1cbn07XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLy8gVGhpcyBtZXRob2Qgb2Ygb2J0YWluaW5nIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0IG5lZWRzIHRvIGJlXG4vLyBrZXB0IGlkZW50aWNhbCB0byB0aGUgd2F5IGl0IGlzIG9idGFpbmVkIGluIHJ1bnRpbWUuanNcbnZhciBnID1cbiAgdHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiA/IGdsb2JhbCA6XG4gIHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIgPyB3aW5kb3cgOiB0aGlzO1xuXG52YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBoYWRSdW50aW1lID0gaGFzT3duLmNhbGwoZywgXCJyZWdlbmVyYXRvclJ1bnRpbWVcIik7XG52YXIgb2xkUnVudGltZSA9IGhhZFJ1bnRpbWUgJiYgZy5yZWdlbmVyYXRvclJ1bnRpbWU7XG5kZWxldGUgZy5yZWdlbmVyYXRvclJ1bnRpbWU7IC8vIEZvcmNlIHJlZXZhbHV0YXRpb24gb2YgcnVudGltZS5qcy5cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9ydW50aW1lXCIpO1xuXG5pZiAoaGFkUnVudGltZSkge1xuICAvLyBSZXN0b3JlIHRoZSBvcmlnaW5hbCBydW50aW1lLlxuICBnLnJlZ2VuZXJhdG9yUnVudGltZSA9IG9sZFJ1bnRpbWU7XG59IGVsc2Uge1xuICAvLyBSZW1vdmUgdGhlIGdsb2JhbCBwcm9wZXJ0eSBhZGRlZCBieSBydW50aW1lLmpzLlxuICBkZWxldGUgZy5yZWdlbmVyYXRvclJ1bnRpbWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogbW9kdWxlLmV4cG9ydHMsIF9fZXNNb2R1bGU6IHRydWUgfTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbTV2WkdWZmJXOWtkV3hsY3k5aVlXSmxiQzF5ZFc1MGFXMWxMM0psWjJWdVpYSmhkRzl5TDJsdVpHVjRMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3UVVGQlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJJaXdpWm1sc1pTSTZJbWRsYm1WeVlYUmxaQzVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdkx5QlVhR2x6SUcxbGRHaHZaQ0J2WmlCdlluUmhhVzVwYm1jZ1lTQnlaV1psY21WdVkyVWdkRzhnZEdobElHZHNiMkpoYkNCdlltcGxZM1FnYm1WbFpITWdkRzhnWW1WY2JpOHZJR3RsY0hRZ2FXUmxiblJwWTJGc0lIUnZJSFJvWlNCM1lYa2dhWFFnYVhNZ2IySjBZV2x1WldRZ2FXNGdjblZ1ZEdsdFpTNXFjMXh1ZG1GeUlHY2dQVnh1SUNCMGVYQmxiMllnWjJ4dlltRnNJRDA5UFNCY0ltOWlhbVZqZEZ3aUlEOGdaMnh2WW1Gc0lEcGNiaUFnZEhsd1pXOW1JSGRwYm1SdmR5QTlQVDBnWENKdlltcGxZM1JjSWlBL0lIZHBibVJ2ZHlBNklIUm9hWE03WEc1Y2JuWmhjaUJvWVhOUGQyNGdQU0JQWW1wbFkzUXVjSEp2ZEc5MGVYQmxMbWhoYzA5M2JsQnliM0JsY25SNU8xeHVkbUZ5SUdoaFpGSjFiblJwYldVZ1BTQm9ZWE5QZDI0dVkyRnNiQ2huTENCY0luSmxaMlZ1WlhKaGRHOXlVblZ1ZEdsdFpWd2lLVHRjYm5aaGNpQnZiR1JTZFc1MGFXMWxJRDBnYUdGa1VuVnVkR2x0WlNBbUppQm5MbkpsWjJWdVpYSmhkRzl5VW5WdWRHbHRaVHRjYm1SbGJHVjBaU0JuTG5KbFoyVnVaWEpoZEc5eVVuVnVkR2x0WlRzZ0x5OGdSbTl5WTJVZ2NtVmxkbUZzZFhSaGRHbHZiaUJ2WmlCeWRXNTBhVzFsTG1wekxseHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJSEpsY1hWcGNtVW9YQ0l1TDNKMWJuUnBiV1ZjSWlrN1hHNWNibWxtSUNob1lXUlNkVzUwYVcxbEtTQjdYRzRnSUM4dklGSmxjM1J2Y21VZ2RHaGxJRzl5YVdkcGJtRnNJSEoxYm5ScGJXVXVYRzRnSUdjdWNtVm5aVzVsY21GMGIzSlNkVzUwYVcxbElEMGdiMnhrVW5WdWRHbHRaVHRjYm4wZ1pXeHpaU0I3WEc0Z0lDOHZJRkpsYlc5MlpTQjBhR1VnWjJ4dlltRnNJSEJ5YjNCbGNuUjVJR0ZrWkdWa0lHSjVJSEoxYm5ScGJXVXVhbk11WEc0Z0lHUmxiR1YwWlNCbkxuSmxaMlZ1WlhKaGRHOXlVblZ1ZEdsdFpUdGNibjFjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCN0lGd2laR1ZtWVhWc2RGd2lPaUJ0YjJSMWJHVXVaWGh3YjNKMGN5d2dYMTlsYzAxdlpIVnNaVG9nZEhKMVpTQjlPMXh1SWwxOSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX2NvcmUgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzXCIpW1wiZGVmYXVsdFwiXTtcblxuLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9tYXN0ZXIvTElDRU5TRSBmaWxlLiBBblxuICogYWRkaXRpb25hbCBncmFudCBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluXG4gKiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuIShmdW5jdGlvbiAoZ2xvYmFsKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gdHlwZW9mIF9jb3JlLlN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIF9jb3JlLlN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcblxuICB2YXIgaW5Nb2R1bGUgPSB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiO1xuICB2YXIgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWU7XG4gIGlmIChydW50aW1lKSB7XG4gICAgaWYgKGluTW9kdWxlKSB7XG4gICAgICAvLyBJZiByZWdlbmVyYXRvclJ1bnRpbWUgaXMgZGVmaW5lZCBnbG9iYWxseSBhbmQgd2UncmUgaW4gYSBtb2R1bGUsXG4gICAgICAvLyBtYWtlIHRoZSBleHBvcnRzIG9iamVjdCBpZGVudGljYWwgdG8gcmVnZW5lcmF0b3JSdW50aW1lLlxuICAgICAgbW9kdWxlLmV4cG9ydHMgPSBydW50aW1lO1xuICAgIH1cbiAgICAvLyBEb24ndCBib3RoZXIgZXZhbHVhdGluZyB0aGUgcmVzdCBvZiB0aGlzIGZpbGUgaWYgdGhlIHJ1bnRpbWUgd2FzXG4gICAgLy8gYWxyZWFkeSBkZWZpbmVkIGdsb2JhbGx5LlxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIERlZmluZSB0aGUgcnVudGltZSBnbG9iYWxseSAoYXMgZXhwZWN0ZWQgYnkgZ2VuZXJhdGVkIGNvZGUpIGFzIGVpdGhlclxuICAvLyBtb2R1bGUuZXhwb3J0cyAoaWYgd2UncmUgaW4gYSBtb2R1bGUpIG9yIGEgbmV3LCBlbXB0eSBvYmplY3QuXG4gIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lID0gaW5Nb2R1bGUgPyBtb2R1bGUuZXhwb3J0cyA6IHt9O1xuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICByZXR1cm4gbmV3IEdlbmVyYXRvcihpbm5lckZuLCBvdXRlckZuLCBzZWxmIHx8IG51bGwsIHRyeUxvY3NMaXN0IHx8IFtdKTtcbiAgfVxuICBydW50aW1lLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPSBHZW5lcmF0b3IucHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcblxuICBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbiAoZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIiA6IGZhbHNlO1xuICB9O1xuXG4gIHJ1bnRpbWUubWFyayA9IGZ1bmN0aW9uIChnZW5GdW4pIHtcbiAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07XG5cbiAgcnVudGltZS5hc3luYyA9IGZ1bmN0aW9uIChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIHJldHVybiBuZXcgX2NvcmUuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgZ2VuZXJhdG9yID0gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCk7XG4gICAgICB2YXIgY2FsbE5leHQgPSBzdGVwLmJpbmQoZ2VuZXJhdG9yLm5leHQpO1xuICAgICAgdmFyIGNhbGxUaHJvdyA9IHN0ZXAuYmluZChnZW5lcmF0b3JbXCJ0aHJvd1wiXSk7XG5cbiAgICAgIGZ1bmN0aW9uIHN0ZXAoYXJnKSB7XG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaCh0aGlzLCBudWxsLCBhcmcpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG4gICAgICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgICAgICByZXNvbHZlKGluZm8udmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9jb3JlLlByb21pc2UucmVzb2x2ZShpbmZvLnZhbHVlKS50aGVuKGNhbGxOZXh0LCBjYWxsVGhyb3cpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNhbGxOZXh0KCk7XG4gICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgdmFyIGdlbmVyYXRvciA9IG91dGVyRm4gPyBPYmplY3QuY3JlYXRlKG91dGVyRm4ucHJvdG90eXBlKSA6IHRoaXM7XG4gICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCk7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGRlbGVnYXRlLml0ZXJhdG9yW21ldGhvZF0sIGRlbGVnYXRlLml0ZXJhdG9yLCBhcmcpO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICAgICAgICAvLyBMaWtlIHJldHVybmluZyBnZW5lcmF0b3IudGhyb3codW5jYXVnaHQpLCBidXQgd2l0aG91dCB0aGVcbiAgICAgICAgICAgIC8vIG92ZXJoZWFkIG9mIGFuIGV4dHJhIGZ1bmN0aW9uIGNhbGwuXG4gICAgICAgICAgICBtZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgICBhcmcgPSByZWNvcmQuYXJnO1xuXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBEZWxlZ2F0ZSBnZW5lcmF0b3IgcmFuIGFuZCBoYW5kbGVkIGl0cyBvd24gZXhjZXB0aW9ucyBzb1xuICAgICAgICAgIC8vIHJlZ2FyZGxlc3Mgb2Ygd2hhdCB0aGUgbWV0aG9kIHdhcywgd2UgY29udGludWUgYXMgaWYgaXQgaXNcbiAgICAgICAgICAvLyBcIm5leHRcIiB3aXRoIGFuIHVuZGVmaW5lZCBhcmcuXG4gICAgICAgICAgbWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuICAgICAgICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgICAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuICAgICAgICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuICAgICAgICAgICAgcmV0dXJuIGluZm87XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCAmJiB0eXBlb2YgYXJnICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdCB0byBzZW5kIFwiICsgSlNPTi5zdHJpbmdpZnkoYXJnKSArIFwiIHRvIG5ld2Jvcm4gZ2VuZXJhdG9yXCIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCkge1xuICAgICAgICAgICAgY29udGV4dC5zZW50ID0gYXJnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgY29udGV4dC5zZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihhcmcpKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICAgIG1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgICAgYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChtZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBhcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmUgPyBHZW5TdGF0ZUNvbXBsZXRlZCA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICB2YXIgaW5mbyA9IHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG4gICAgICAgICAgICBpZiAoY29udGV4dC5kZWxlZ2F0ZSAmJiBtZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgICAgICAgYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaW5mbztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG5cbiAgICAgICAgICBpZiAobWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihyZWNvcmQuYXJnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZW5lcmF0b3IubmV4dCA9IGludm9rZS5iaW5kKGdlbmVyYXRvciwgXCJuZXh0XCIpO1xuICAgIGdlbmVyYXRvcltcInRocm93XCJdID0gaW52b2tlLmJpbmQoZ2VuZXJhdG9yLCBcInRocm93XCIpO1xuICAgIGdlbmVyYXRvcltcInJldHVyblwiXSA9IGludm9rZS5iaW5kKGdlbmVyYXRvciwgXCJyZXR1cm5cIik7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICBydW50aW1lLmtleXMgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSxcbiAgICAgICAgICAgIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBydW50aW1lLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICB0aGlzLnNlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgLy8gUHJlLWluaXRpYWxpemUgYXQgbGVhc3QgMjAgdGVtcG9yYXJ5IHZhcmlhYmxlcyB0byBlbmFibGUgaGlkZGVuXG4gICAgICAvLyBjbGFzcyBvcHRpbWl6YXRpb25zIGZvciBzaW1wbGUgZ2VuZXJhdG9ycy5cbiAgICAgIGZvciAodmFyIHRlbXBJbmRleCA9IDAsIHRlbXBOYW1lOyBoYXNPd24uY2FsbCh0aGlzLCB0ZW1wTmFtZSA9IFwidFwiICsgdGVtcEluZGV4KSB8fCB0ZW1wSW5kZXggPCAyMDsgKyt0ZW1wSW5kZXgpIHtcbiAgICAgICAgdGhpc1t0ZW1wTmFtZV0gPSBudWxsO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbiBzdG9wKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbiBkaXNwYXRjaEV4Y2VwdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcbiAgICAgICAgcmV0dXJuICEhY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uIGFicnVwdCh0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJiBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJiAodHlwZSA9PT0gXCJicmVha1wiIHx8IHR5cGUgPT09IFwiY29udGludWVcIikgJiYgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiYgYXJnIDwgZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZShyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fCByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbiBmaW5pc2goZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24gKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbiBkZWxlZ2F0ZVlpZWxkKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xufSkoXG4vLyBBbW9uZyB0aGUgdmFyaW91cyB0cmlja3MgZm9yIG9idGFpbmluZyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsXG4vLyBvYmplY3QsIHRoaXMgc2VlbXMgdG8gYmUgdGhlIG1vc3QgcmVsaWFibGUgdGVjaG5pcXVlIHRoYXQgZG9lcyBub3Rcbi8vIHVzZSBpbmRpcmVjdCBldmFsICh3aGljaCB2aW9sYXRlcyBDb250ZW50IFNlY3VyaXR5IFBvbGljeSkuXG50eXBlb2YgZ2xvYmFsID09PSBcIm9iamVjdFwiID8gZ2xvYmFsIDogdHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIiA/IHdpbmRvdyA6IHVuZGVmaW5lZCk7XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlpWVdKbGJDMXlkVzUwYVcxbEwzSmxaMlZ1WlhKaGRHOXlMM0oxYm5ScGJXVXVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanRCUVVGQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU0lzSW1acGJHVWlPaUpuWlc1bGNtRjBaV1F1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaVhDSjFjMlVnYzNSeWFXTjBYQ0k3WEc1Y2JuWmhjaUJmWTI5eVpTQTlJSEpsY1hWcGNtVW9YQ0ppWVdKbGJDMXlkVzUwYVcxbEwyTnZjbVV0YW5OY0lpbGJYQ0prWldaaGRXeDBYQ0pkTzF4dVhHNHZLaXBjYmlBcUlFTnZjSGx5YVdkb2RDQW9ZeWtnTWpBeE5Dd2dSbUZqWldKdmIyc3NJRWx1WXk1Y2JpQXFJRUZzYkNCeWFXZG9kSE1nY21WelpYSjJaV1F1WEc0Z0tseHVJQ29nVkdocGN5QnpiM1Z5WTJVZ1kyOWtaU0JwY3lCc2FXTmxibk5sWkNCMWJtUmxjaUIwYUdVZ1FsTkVMWE4wZVd4bElHeHBZMlZ1YzJVZ1ptOTFibVFnYVc0Z2RHaGxYRzRnS2lCb2RIUndjem92TDNKaGR5NW5hWFJvZFdJdVkyOXRMMlpoWTJWaWIyOXJMM0psWjJWdVpYSmhkRzl5TDIxaGMzUmxjaTlNU1VORlRsTkZJR1pwYkdVdUlFRnVYRzRnS2lCaFpHUnBkR2x2Ym1Gc0lHZHlZVzUwSUc5bUlIQmhkR1Z1ZENCeWFXZG9kSE1nWTJGdUlHSmxJR1p2ZFc1a0lHbHVJSFJvWlNCUVFWUkZUbFJUSUdacGJHVWdhVzVjYmlBcUlIUm9aU0J6WVcxbElHUnBjbVZqZEc5eWVTNWNiaUFxTDF4dVhHNGhLR1oxYm1OMGFXOXVJQ2huYkc5aVlXd3BJSHRjYmlBZ1hDSjFjMlVnYzNSeWFXTjBYQ0k3WEc1Y2JpQWdkbUZ5SUdoaGMwOTNiaUE5SUU5aWFtVmpkQzV3Y205MGIzUjVjR1V1YUdGelQzZHVVSEp2Y0dWeWRIazdYRzRnSUhaaGNpQjFibVJsWm1sdVpXUTdJQzh2SUUxdmNtVWdZMjl0Y0hKbGMzTnBZbXhsSUhSb1lXNGdkbTlwWkNBd0xseHVJQ0IyWVhJZ2FYUmxjbUYwYjNKVGVXMWliMndnUFNCMGVYQmxiMllnWDJOdmNtVXVVM2x0WW05c0lEMDlQU0JjSW1aMWJtTjBhVzl1WENJZ0ppWWdYMk52Y21VdVUzbHRZbTlzTG1sMFpYSmhkRzl5SUh4OElGd2lRRUJwZEdWeVlYUnZjbHdpTzF4dVhHNGdJSFpoY2lCcGJrMXZaSFZzWlNBOUlIUjVjR1Z2WmlCdGIyUjFiR1VnUFQwOUlGd2liMkpxWldOMFhDSTdYRzRnSUhaaGNpQnlkVzUwYVcxbElEMGdaMnh2WW1Gc0xuSmxaMlZ1WlhKaGRHOXlVblZ1ZEdsdFpUdGNiaUFnYVdZZ0tISjFiblJwYldVcElIdGNiaUFnSUNCcFppQW9hVzVOYjJSMWJHVXBJSHRjYmlBZ0lDQWdJQzh2SUVsbUlISmxaMlZ1WlhKaGRHOXlVblZ1ZEdsdFpTQnBjeUJrWldacGJtVmtJR2RzYjJKaGJHeDVJR0Z1WkNCM1pTZHlaU0JwYmlCaElHMXZaSFZzWlN4Y2JpQWdJQ0FnSUM4dklHMWhhMlVnZEdobElHVjRjRzl5ZEhNZ2IySnFaV04wSUdsa1pXNTBhV05oYkNCMGJ5QnlaV2RsYm1WeVlYUnZjbEoxYm5ScGJXVXVYRzRnSUNBZ0lDQnRiMlIxYkdVdVpYaHdiM0owY3lBOUlISjFiblJwYldVN1hHNGdJQ0FnZlZ4dUlDQWdJQzh2SUVSdmJpZDBJR0p2ZEdobGNpQmxkbUZzZFdGMGFXNW5JSFJvWlNCeVpYTjBJRzltSUhSb2FYTWdabWxzWlNCcFppQjBhR1VnY25WdWRHbHRaU0IzWVhOY2JpQWdJQ0F2THlCaGJISmxZV1I1SUdSbFptbHVaV1FnWjJ4dlltRnNiSGt1WEc0Z0lDQWdjbVYwZFhKdU8xeHVJQ0I5WEc1Y2JpQWdMeThnUkdWbWFXNWxJSFJvWlNCeWRXNTBhVzFsSUdkc2IySmhiR3g1SUNoaGN5QmxlSEJsWTNSbFpDQmllU0JuWlc1bGNtRjBaV1FnWTI5a1pTa2dZWE1nWldsMGFHVnlYRzRnSUM4dklHMXZaSFZzWlM1bGVIQnZjblJ6SUNocFppQjNaU2R5WlNCcGJpQmhJRzF2WkhWc1pTa2diM0lnWVNCdVpYY3NJR1Z0Y0hSNUlHOWlhbVZqZEM1Y2JpQWdjblZ1ZEdsdFpTQTlJR2RzYjJKaGJDNXlaV2RsYm1WeVlYUnZjbEoxYm5ScGJXVWdQU0JwYmsxdlpIVnNaU0EvSUcxdlpIVnNaUzVsZUhCdmNuUnpJRG9nZTMwN1hHNWNiaUFnWm5WdVkzUnBiMjRnZDNKaGNDaHBibTVsY2tadUxDQnZkWFJsY2tadUxDQnpaV3htTENCMGNubE1iMk56VEdsemRDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCdVpYY2dSMlZ1WlhKaGRHOXlLR2x1Ym1WeVJtNHNJRzkxZEdWeVJtNHNJSE5sYkdZZ2ZId2diblZzYkN3Z2RISjVURzlqYzB4cGMzUWdmSHdnVzEwcE8xeHVJQ0I5WEc0Z0lISjFiblJwYldVdWQzSmhjQ0E5SUhkeVlYQTdYRzVjYmlBZ0x5OGdWSEo1TDJOaGRHTm9JR2hsYkhCbGNpQjBieUJ0YVc1cGJXbDZaU0JrWlc5d2RHbHRhWHBoZEdsdmJuTXVJRkpsZEhWeWJuTWdZU0JqYjIxd2JHVjBhVzl1WEc0Z0lDOHZJSEpsWTI5eVpDQnNhV3RsSUdOdmJuUmxlSFF1ZEhKNVJXNTBjbWxsYzF0cFhTNWpiMjF3YkdWMGFXOXVMaUJVYUdseklHbHVkR1Z5Wm1GalpTQmpiM1ZzWkZ4dUlDQXZMeUJvWVhabElHSmxaVzRnS0dGdVpDQjNZWE1nY0hKbGRtbHZkWE5zZVNrZ1pHVnphV2R1WldRZ2RHOGdkR0ZyWlNCaElHTnNiM04xY21VZ2RHOGdZbVZjYmlBZ0x5OGdhVzUyYjJ0bFpDQjNhWFJvYjNWMElHRnlaM1Z0Wlc1MGN5d2dZblYwSUdsdUlHRnNiQ0IwYUdVZ1kyRnpaWE1nZDJVZ1kyRnlaU0JoWW05MWRDQjNaVnh1SUNBdkx5QmhiSEpsWVdSNUlHaGhkbVVnWVc0Z1pYaHBjM1JwYm1jZ2JXVjBhRzlrSUhkbElIZGhiblFnZEc4Z1kyRnNiQ3dnYzI4Z2RHaGxjbVVuY3lCdWJ5QnVaV1ZrWEc0Z0lDOHZJSFJ2SUdOeVpXRjBaU0JoSUc1bGR5Qm1kVzVqZEdsdmJpQnZZbXBsWTNRdUlGZGxJR05oYmlCbGRtVnVJR2RsZENCaGQyRjVJSGRwZEdnZ1lYTnpkVzFwYm1kY2JpQWdMeThnZEdobElHMWxkR2h2WkNCMFlXdGxjeUJsZUdGamRHeDVJRzl1WlNCaGNtZDFiV1Z1ZEN3Z2MybHVZMlVnZEdoaGRDQm9ZWEJ3Wlc1eklIUnZJR0psSUhSeWRXVmNiaUFnTHk4Z2FXNGdaWFpsY25rZ1kyRnpaU3dnYzI4Z2QyVWdaRzl1SjNRZ2FHRjJaU0IwYnlCMGIzVmphQ0IwYUdVZ1lYSm5kVzFsYm5SeklHOWlhbVZqZEM0Z1ZHaGxYRzRnSUM4dklHOXViSGtnWVdSa2FYUnBiMjVoYkNCaGJHeHZZMkYwYVc5dUlISmxjWFZwY21Wa0lHbHpJSFJvWlNCamIyMXdiR1YwYVc5dUlISmxZMjl5WkN3Z2QyaHBZMmhjYmlBZ0x5OGdhR0Z6SUdFZ2MzUmhZbXhsSUhOb1lYQmxJR0Z1WkNCemJ5Qm9iM0JsWm5Wc2JIa2djMmh2ZFd4a0lHSmxJR05vWldGd0lIUnZJR0ZzYkc5allYUmxMbHh1SUNCbWRXNWpkR2x2YmlCMGNubERZWFJqYUNobWJpd2diMkpxTENCaGNtY3BJSHRjYmlBZ0lDQjBjbmtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSHNnZEhsd1pUb2dYQ0p1YjNKdFlXeGNJaXdnWVhKbk9pQm1iaTVqWVd4c0tHOWlhaXdnWVhKbktTQjlPMXh1SUNBZ0lIMGdZMkYwWTJnZ0tHVnljaWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSHNnZEhsd1pUb2dYQ0owYUhKdmQxd2lMQ0JoY21jNklHVnljaUI5TzF4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUhaaGNpQkhaVzVUZEdGMFpWTjFjM0JsYm1SbFpGTjBZWEowSUQwZ1hDSnpkWE53Wlc1a1pXUlRkR0Z5ZEZ3aU8xeHVJQ0IyWVhJZ1IyVnVVM1JoZEdWVGRYTndaVzVrWldSWmFXVnNaQ0E5SUZ3aWMzVnpjR1Z1WkdWa1dXbGxiR1JjSWp0Y2JpQWdkbUZ5SUVkbGJsTjBZWFJsUlhobFkzVjBhVzVuSUQwZ1hDSmxlR1ZqZFhScGJtZGNJanRjYmlBZ2RtRnlJRWRsYmxOMFlYUmxRMjl0Y0d4bGRHVmtJRDBnWENKamIyMXdiR1YwWldSY0lqdGNibHh1SUNBdkx5QlNaWFIxY201cGJtY2dkR2hwY3lCdlltcGxZM1FnWm5KdmJTQjBhR1VnYVc1dVpYSkdiaUJvWVhNZ2RHaGxJSE5oYldVZ1pXWm1aV04wSUdGelhHNGdJQzh2SUdKeVpXRnJhVzVuSUc5MWRDQnZaaUIwYUdVZ1pHbHpjR0YwWTJnZ2MzZHBkR05vSUhOMFlYUmxiV1Z1ZEM1Y2JpQWdkbUZ5SUVOdmJuUnBiblZsVTJWdWRHbHVaV3dnUFNCN2ZUdGNibHh1SUNBdkx5QkVkVzF0ZVNCamIyNXpkSEoxWTNSdmNpQm1kVzVqZEdsdmJuTWdkR2hoZENCM1pTQjFjMlVnWVhNZ2RHaGxJQzVqYjI1emRISjFZM1J2Y2lCaGJtUmNiaUFnTHk4Z0xtTnZibk4wY25WamRHOXlMbkJ5YjNSdmRIbHdaU0J3Y205d1pYSjBhV1Z6SUdadmNpQm1kVzVqZEdsdmJuTWdkR2hoZENCeVpYUjFjbTRnUjJWdVpYSmhkRzl5WEc0Z0lDOHZJRzlpYW1WamRITXVJRVp2Y2lCbWRXeHNJSE53WldNZ1kyOXRjR3hwWVc1alpTd2dlVzkxSUcxaGVTQjNhWE5vSUhSdklHTnZibVpwWjNWeVpTQjViM1Z5WEc0Z0lDOHZJRzFwYm1sbWFXVnlJRzV2ZENCMGJ5QnRZVzVuYkdVZ2RHaGxJRzVoYldWeklHOW1JSFJvWlhObElIUjNieUJtZFc1amRHbHZibk11WEc0Z0lHWjFibU4wYVc5dUlFZGxibVZ5WVhSdmNrWjFibU4wYVc5dUtDa2dlMzFjYmlBZ1puVnVZM1JwYjI0Z1IyVnVaWEpoZEc5eVJuVnVZM1JwYjI1UWNtOTBiM1I1Y0dVb0tTQjdmVnh1WEc0Z0lIWmhjaUJIY0NBOUlFZGxibVZ5WVhSdmNrWjFibU4wYVc5dVVISnZkRzkwZVhCbExuQnliM1J2ZEhsd1pTQTlJRWRsYm1WeVlYUnZjaTV3Y205MGIzUjVjR1U3WEc0Z0lFZGxibVZ5WVhSdmNrWjFibU4wYVc5dUxuQnliM1J2ZEhsd1pTQTlJRWR3TG1OdmJuTjBjblZqZEc5eUlEMGdSMlZ1WlhKaGRHOXlSblZ1WTNScGIyNVFjbTkwYjNSNWNHVTdYRzRnSUVkbGJtVnlZWFJ2Y2taMWJtTjBhVzl1VUhKdmRHOTBlWEJsTG1OdmJuTjBjblZqZEc5eUlEMGdSMlZ1WlhKaGRHOXlSblZ1WTNScGIyNDdYRzRnSUVkbGJtVnlZWFJ2Y2taMWJtTjBhVzl1TG1ScGMzQnNZWGxPWVcxbElEMGdYQ0pIWlc1bGNtRjBiM0pHZFc1amRHbHZibHdpTzF4dVhHNGdJSEoxYm5ScGJXVXVhWE5IWlc1bGNtRjBiM0pHZFc1amRHbHZiaUE5SUdaMWJtTjBhVzl1SUNoblpXNUdkVzRwSUh0Y2JpQWdJQ0IyWVhJZ1kzUnZjaUE5SUhSNWNHVnZaaUJuWlc1R2RXNGdQVDA5SUZ3aVpuVnVZM1JwYjI1Y0lpQW1KaUJuWlc1R2RXNHVZMjl1YzNSeWRXTjBiM0k3WEc0Z0lDQWdjbVYwZFhKdUlHTjBiM0lnUHlCamRHOXlJRDA5UFNCSFpXNWxjbUYwYjNKR2RXNWpkR2x2YmlCOGZGeHVJQ0FnSUM4dklFWnZjaUIwYUdVZ2JtRjBhWFpsSUVkbGJtVnlZWFJ2Y2taMWJtTjBhVzl1SUdOdmJuTjBjblZqZEc5eUxDQjBhR1VnWW1WemRDQjNaU0JqWVc1Y2JpQWdJQ0F2THlCa2J5QnBjeUIwYnlCamFHVmpheUJwZEhNZ0xtNWhiV1VnY0hKdmNHVnlkSGt1WEc0Z0lDQWdLR04wYjNJdVpHbHpjR3hoZVU1aGJXVWdmSHdnWTNSdmNpNXVZVzFsS1NBOVBUMGdYQ0pIWlc1bGNtRjBiM0pHZFc1amRHbHZibHdpSURvZ1ptRnNjMlU3WEc0Z0lIMDdYRzVjYmlBZ2NuVnVkR2x0WlM1dFlYSnJJRDBnWm5WdVkzUnBiMjRnS0dkbGJrWjFiaWtnZTF4dUlDQWdJR2RsYmtaMWJpNWZYM0J5YjNSdlgxOGdQU0JIWlc1bGNtRjBiM0pHZFc1amRHbHZibEJ5YjNSdmRIbHdaVHRjYmlBZ0lDQm5aVzVHZFc0dWNISnZkRzkwZVhCbElEMGdUMkpxWldOMExtTnlaV0YwWlNoSGNDazdYRzRnSUNBZ2NtVjBkWEp1SUdkbGJrWjFianRjYmlBZ2ZUdGNibHh1SUNCeWRXNTBhVzFsTG1GemVXNWpJRDBnWm5WdVkzUnBiMjRnS0dsdWJtVnlSbTRzSUc5MWRHVnlSbTRzSUhObGJHWXNJSFJ5ZVV4dlkzTk1hWE4wS1NCN1hHNGdJQ0FnY21WMGRYSnVJRzVsZHlCZlkyOXlaUzVRY205dGFYTmxLR1oxYm1OMGFXOXVJQ2h5WlhOdmJIWmxMQ0J5WldwbFkzUXBJSHRjYmlBZ0lDQWdJSFpoY2lCblpXNWxjbUYwYjNJZ1BTQjNjbUZ3S0dsdWJtVnlSbTRzSUc5MWRHVnlSbTRzSUhObGJHWXNJSFJ5ZVV4dlkzTk1hWE4wS1R0Y2JpQWdJQ0FnSUhaaGNpQmpZV3hzVG1WNGRDQTlJSE4wWlhBdVltbHVaQ2huWlc1bGNtRjBiM0l1Ym1WNGRDazdYRzRnSUNBZ0lDQjJZWElnWTJGc2JGUm9jbTkzSUQwZ2MzUmxjQzVpYVc1a0tHZGxibVZ5WVhSdmNsdGNJblJvY205M1hDSmRLVHRjYmx4dUlDQWdJQ0FnWm5WdVkzUnBiMjRnYzNSbGNDaGhjbWNwSUh0Y2JpQWdJQ0FnSUNBZ2RtRnlJSEpsWTI5eVpDQTlJSFJ5ZVVOaGRHTm9LSFJvYVhNc0lHNTFiR3dzSUdGeVp5azdYRzRnSUNBZ0lDQWdJR2xtSUNoeVpXTnZjbVF1ZEhsd1pTQTlQVDBnWENKMGFISnZkMXdpS1NCN1hHNGdJQ0FnSUNBZ0lDQWdjbVZxWldOMEtISmxZMjl5WkM1aGNtY3BPMXh1SUNBZ0lDQWdJQ0FnSUhKbGRIVnlianRjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lIWmhjaUJwYm1adklEMGdjbVZqYjNKa0xtRnlaenRjYmlBZ0lDQWdJQ0FnYVdZZ0tHbHVabTh1Wkc5dVpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUhKbGMyOXNkbVVvYVc1bWJ5NTJZV3gxWlNrN1hHNGdJQ0FnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lDQWdYMk52Y21VdVVISnZiV2x6WlM1eVpYTnZiSFpsS0dsdVptOHVkbUZzZFdVcExuUm9aVzRvWTJGc2JFNWxlSFFzSUdOaGJHeFVhSEp2ZHlrN1hHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdZMkZzYkU1bGVIUW9LVHRjYmlBZ0lDQjlLVHRjYmlBZ2ZUdGNibHh1SUNCbWRXNWpkR2x2YmlCSFpXNWxjbUYwYjNJb2FXNXVaWEpHYml3Z2IzVjBaWEpHYml3Z2MyVnNaaXdnZEhKNVRHOWpjMHhwYzNRcElIdGNiaUFnSUNCMllYSWdaMlZ1WlhKaGRHOXlJRDBnYjNWMFpYSkdiaUEvSUU5aWFtVmpkQzVqY21WaGRHVW9iM1YwWlhKR2JpNXdjbTkwYjNSNWNHVXBJRG9nZEdocGN6dGNiaUFnSUNCMllYSWdZMjl1ZEdWNGRDQTlJRzVsZHlCRGIyNTBaWGgwS0hSeWVVeHZZM05NYVhOMEtUdGNiaUFnSUNCMllYSWdjM1JoZEdVZ1BTQkhaVzVUZEdGMFpWTjFjM0JsYm1SbFpGTjBZWEowTzF4dVhHNGdJQ0FnWm5WdVkzUnBiMjRnYVc1MmIydGxLRzFsZEdodlpDd2dZWEpuS1NCN1hHNGdJQ0FnSUNCcFppQW9jM1JoZEdVZ1BUMDlJRWRsYmxOMFlYUmxSWGhsWTNWMGFXNW5LU0I3WEc0Z0lDQWdJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWhjSWtkbGJtVnlZWFJ2Y2lCcGN5QmhiSEpsWVdSNUlISjFibTVwYm1kY0lpazdYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNoemRHRjBaU0E5UFQwZ1IyVnVVM1JoZEdWRGIyMXdiR1YwWldRcElIdGNiaUFnSUNBZ0lDQWdMeThnUW1VZ1ptOXlaMmwyYVc1bkxDQndaWElnTWpVdU15NHpMak11TXlCdlppQjBhR1VnYzNCbFl6cGNiaUFnSUNBZ0lDQWdMeThnYUhSMGNITTZMeTl3Wlc5d2JHVXViVzk2YVd4c1lTNXZjbWN2Zm1wdmNtVnVaRzl5Wm1ZdlpYTTJMV1J5WVdaMExtaDBiV3dqYzJWakxXZGxibVZ5WVhSdmNuSmxjM1Z0WlZ4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWkc5dVpWSmxjM1ZzZENncE8xeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjNhR2xzWlNBb2RISjFaU2tnZTF4dUlDQWdJQ0FnSUNCMllYSWdaR1ZzWldkaGRHVWdQU0JqYjI1MFpYaDBMbVJsYkdWbllYUmxPMXh1SUNBZ0lDQWdJQ0JwWmlBb1pHVnNaV2RoZEdVcElIdGNiaUFnSUNBZ0lDQWdJQ0IyWVhJZ2NtVmpiM0prSUQwZ2RISjVRMkYwWTJnb1pHVnNaV2RoZEdVdWFYUmxjbUYwYjNKYmJXVjBhRzlrWFN3Z1pHVnNaV2RoZEdVdWFYUmxjbUYwYjNJc0lHRnlaeWs3WEc1Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvY21WamIzSmtMblI1Y0dVZ1BUMDlJRndpZEdoeWIzZGNJaWtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdZMjl1ZEdWNGRDNWtaV3hsWjJGMFpTQTlJRzUxYkd3N1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklFeHBhMlVnY21WMGRYSnVhVzVuSUdkbGJtVnlZWFJ2Y2k1MGFISnZkeWgxYm1OaGRXZG9kQ2tzSUdKMWRDQjNhWFJvYjNWMElIUm9aVnh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGdiM1psY21obFlXUWdiMllnWVc0Z1pYaDBjbUVnWm5WdVkzUnBiMjRnWTJGc2JDNWNiaUFnSUNBZ0lDQWdJQ0FnSUcxbGRHaHZaQ0E5SUZ3aWRHaHliM2RjSWp0Y2JpQWdJQ0FnSUNBZ0lDQWdJR0Z5WnlBOUlISmxZMjl5WkM1aGNtYzdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lHTnZiblJwYm5WbE8xeHVJQ0FnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBZ0lDOHZJRVJsYkdWbllYUmxJR2RsYm1WeVlYUnZjaUJ5WVc0Z1lXNWtJR2hoYm1Sc1pXUWdhWFJ6SUc5M2JpQmxlR05sY0hScGIyNXpJSE52WEc0Z0lDQWdJQ0FnSUNBZ0x5OGdjbVZuWVhKa2JHVnpjeUJ2WmlCM2FHRjBJSFJvWlNCdFpYUm9iMlFnZDJGekxDQjNaU0JqYjI1MGFXNTFaU0JoY3lCcFppQnBkQ0JwYzF4dUlDQWdJQ0FnSUNBZ0lDOHZJRndpYm1WNGRGd2lJSGRwZEdnZ1lXNGdkVzVrWldacGJtVmtJR0Z5Wnk1Y2JpQWdJQ0FnSUNBZ0lDQnRaWFJvYjJRZ1BTQmNJbTVsZUhSY0lqdGNiaUFnSUNBZ0lDQWdJQ0JoY21jZ1BTQjFibVJsWm1sdVpXUTdYRzVjYmlBZ0lDQWdJQ0FnSUNCMllYSWdhVzVtYnlBOUlISmxZMjl5WkM1aGNtYzdYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tHbHVabTh1Wkc5dVpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ1kyOXVkR1Y0ZEZ0a1pXeGxaMkYwWlM1eVpYTjFiSFJPWVcxbFhTQTlJR2x1Wm04dWRtRnNkV1U3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmpiMjUwWlhoMExtNWxlSFFnUFNCa1pXeGxaMkYwWlM1dVpYaDBURzlqTzF4dUlDQWdJQ0FnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J6ZEdGMFpTQTlJRWRsYmxOMFlYUmxVM1Z6Y0dWdVpHVmtXV2xsYkdRN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdhVzVtYnp0Y2JpQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNCamIyNTBaWGgwTG1SbGJHVm5ZWFJsSUQwZ2JuVnNiRHRjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2h0WlhSb2IyUWdQVDA5SUZ3aWJtVjRkRndpS1NCN1hHNGdJQ0FnSUNBZ0lDQWdhV1lnS0hOMFlYUmxJRDA5UFNCSFpXNVRkR0YwWlZOMWMzQmxibVJsWkZOMFlYSjBJQ1ltSUhSNWNHVnZaaUJoY21jZ0lUMDlJRndpZFc1a1pXWnBibVZrWENJcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklHaDBkSEJ6T2k4dmNHVnZjR3hsTG0xdmVtbHNiR0V1YjNKbkwzNXFiM0psYm1SdmNtWm1MMlZ6Tmkxa2NtRm1kQzVvZEcxc0kzTmxZeTFuWlc1bGNtRjBiM0p5WlhOMWJXVmNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2NtOTNJRzVsZHlCVWVYQmxSWEp5YjNJb1hDSmhkSFJsYlhCMElIUnZJSE5sYm1RZ1hDSWdLeUJLVTA5T0xuTjBjbWx1WjJsbWVTaGhjbWNwSUNzZ1hDSWdkRzhnYm1WM1ltOXliaUJuWlc1bGNtRjBiM0pjSWlrN1hHNGdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLSE4wWVhSbElEMDlQU0JIWlc1VGRHRjBaVk4xYzNCbGJtUmxaRmxwWld4a0tTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCamIyNTBaWGgwTG5ObGJuUWdQU0JoY21jN1hHNGdJQ0FnSUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdSbGJHVjBaU0JqYjI1MFpYaDBMbk5sYm5RN1hHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5SUdWc2MyVWdhV1lnS0cxbGRHaHZaQ0E5UFQwZ1hDSjBhSEp2ZDF3aUtTQjdYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tITjBZWFJsSUQwOVBTQkhaVzVUZEdGMFpWTjFjM0JsYm1SbFpGTjBZWEowS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J6ZEdGMFpTQTlJRWRsYmxOMFlYUmxRMjl0Y0d4bGRHVmtPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHliM2NnWVhKbk8xeHVJQ0FnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBZ0lHbG1JQ2hqYjI1MFpYaDBMbVJwYzNCaGRHTm9SWGhqWlhCMGFXOXVLR0Z5WnlrcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklFbG1JSFJvWlNCa2FYTndZWFJqYUdWa0lHVjRZMlZ3ZEdsdmJpQjNZWE1nWTJGMVoyaDBJR0o1SUdFZ1kyRjBZMmdnWW14dlkyc3NYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QjBhR1Z1SUd4bGRDQjBhR0YwSUdOaGRHTm9JR0pzYjJOcklHaGhibVJzWlNCMGFHVWdaWGhqWlhCMGFXOXVJRzV2Y20xaGJHeDVMbHh1SUNBZ0lDQWdJQ0FnSUNBZ2JXVjBhRzlrSUQwZ1hDSnVaWGgwWENJN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JoY21jZ1BTQjFibVJsWm1sdVpXUTdYRzRnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCOUlHVnNjMlVnYVdZZ0tHMWxkR2h2WkNBOVBUMGdYQ0p5WlhSMWNtNWNJaWtnZTF4dUlDQWdJQ0FnSUNBZ0lHTnZiblJsZUhRdVlXSnlkWEIwS0Z3aWNtVjBkWEp1WENJc0lHRnlaeWs3WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQnpkR0YwWlNBOUlFZGxibE4wWVhSbFJYaGxZM1YwYVc1bk8xeHVYRzRnSUNBZ0lDQWdJSFpoY2lCeVpXTnZjbVFnUFNCMGNubERZWFJqYUNocGJtNWxja1p1TENCelpXeG1MQ0JqYjI1MFpYaDBLVHRjYmlBZ0lDQWdJQ0FnYVdZZ0tISmxZMjl5WkM1MGVYQmxJRDA5UFNCY0ltNXZjbTFoYkZ3aUtTQjdYRzRnSUNBZ0lDQWdJQ0FnTHk4Z1NXWWdZVzRnWlhoalpYQjBhVzl1SUdseklIUm9jbTkzYmlCbWNtOXRJR2x1Ym1WeVJtNHNJSGRsSUd4bFlYWmxJSE4wWVhSbElEMDlQVnh1SUNBZ0lDQWdJQ0FnSUM4dklFZGxibE4wWVhSbFJYaGxZM1YwYVc1bklHRnVaQ0JzYjI5d0lHSmhZMnNnWm05eUlHRnViM1JvWlhJZ2FXNTJiMk5oZEdsdmJpNWNiaUFnSUNBZ0lDQWdJQ0J6ZEdGMFpTQTlJR052Ym5SbGVIUXVaRzl1WlNBL0lFZGxibE4wWVhSbFEyOXRjR3hsZEdWa0lEb2dSMlZ1VTNSaGRHVlRkWE53Wlc1a1pXUlphV1ZzWkR0Y2JseHVJQ0FnSUNBZ0lDQWdJSFpoY2lCcGJtWnZJRDBnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkbUZzZFdVNklISmxZMjl5WkM1aGNtY3NYRzRnSUNBZ0lDQWdJQ0FnSUNCa2IyNWxPaUJqYjI1MFpYaDBMbVJ2Ym1WY2JpQWdJQ0FnSUNBZ0lDQjlPMXh1WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLSEpsWTI5eVpDNWhjbWNnUFQwOUlFTnZiblJwYm5WbFUyVnVkR2x1Wld3cElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDaGpiMjUwWlhoMExtUmxiR1ZuWVhSbElDWW1JRzFsZEdodlpDQTlQVDBnWENKdVpYaDBYQ0lwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1JHVnNhV0psY21GMFpXeDVJR1p2Y21kbGRDQjBhR1VnYkdGemRDQnpaVzUwSUhaaGJIVmxJSE52SUhSb1lYUWdkMlVnWkc5dUozUmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0x5OGdZV05qYVdSbGJuUmhiR3g1SUhCaGMzTWdhWFFnYjI0Z2RHOGdkR2hsSUdSbGJHVm5ZWFJsTGx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0JoY21jZ1BTQjFibVJsWm1sdVpXUTdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJwYm1adk8xeHVJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnZlNCbGJITmxJR2xtSUNoeVpXTnZjbVF1ZEhsd1pTQTlQVDBnWENKMGFISnZkMXdpS1NCN1hHNGdJQ0FnSUNBZ0lDQWdjM1JoZEdVZ1BTQkhaVzVUZEdGMFpVTnZiWEJzWlhSbFpEdGNibHh1SUNBZ0lDQWdJQ0FnSUdsbUlDaHRaWFJvYjJRZ1BUMDlJRndpYm1WNGRGd2lLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmpiMjUwWlhoMExtUnBjM0JoZEdOb1JYaGpaWEIwYVc5dUtISmxZMjl5WkM1aGNtY3BPMXh1SUNBZ0lDQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmhjbWNnUFNCeVpXTnZjbVF1WVhKbk8xeHVJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJR2RsYm1WeVlYUnZjaTV1WlhoMElEMGdhVzUyYjJ0bExtSnBibVFvWjJWdVpYSmhkRzl5TENCY0ltNWxlSFJjSWlrN1hHNGdJQ0FnWjJWdVpYSmhkRzl5VzF3aWRHaHliM2RjSWwwZ1BTQnBiblp2YTJVdVltbHVaQ2huWlc1bGNtRjBiM0lzSUZ3aWRHaHliM2RjSWlrN1hHNGdJQ0FnWjJWdVpYSmhkRzl5VzF3aWNtVjBkWEp1WENKZElEMGdhVzUyYjJ0bExtSnBibVFvWjJWdVpYSmhkRzl5TENCY0luSmxkSFZ5Ymx3aUtUdGNibHh1SUNBZ0lISmxkSFZ5YmlCblpXNWxjbUYwYjNJN1hHNGdJSDFjYmx4dUlDQkhjRnRwZEdWeVlYUnZjbE41YldKdmJGMGdQU0JtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSFJvYVhNN1hHNGdJSDA3WEc1Y2JpQWdSM0F1ZEc5VGRISnBibWNnUFNCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUZ3aVcyOWlhbVZqZENCSFpXNWxjbUYwYjNKZFhDSTdYRzRnSUgwN1hHNWNiaUFnWm5WdVkzUnBiMjRnY0hWemFGUnllVVZ1ZEhKNUtHeHZZM01wSUh0Y2JpQWdJQ0IyWVhJZ1pXNTBjbmtnUFNCN0lIUnllVXh2WXpvZ2JHOWpjMXN3WFNCOU8xeHVYRzRnSUNBZ2FXWWdLREVnYVc0Z2JHOWpjeWtnZTF4dUlDQWdJQ0FnWlc1MGNua3VZMkYwWTJoTWIyTWdQU0JzYjJOeld6RmRPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2d5SUdsdUlHeHZZM01wSUh0Y2JpQWdJQ0FnSUdWdWRISjVMbVpwYm1Gc2JIbE1iMk1nUFNCc2IyTnpXekpkTzF4dUlDQWdJQ0FnWlc1MGNua3VZV1owWlhKTWIyTWdQU0JzYjJOeld6TmRPMXh1SUNBZ0lIMWNibHh1SUNBZ0lIUm9hWE11ZEhKNVJXNTBjbWxsY3k1d2RYTm9LR1Z1ZEhKNUtUdGNiaUFnZlZ4dVhHNGdJR1oxYm1OMGFXOXVJSEpsYzJWMFZISjVSVzUwY25rb1pXNTBjbmtwSUh0Y2JpQWdJQ0IyWVhJZ2NtVmpiM0prSUQwZ1pXNTBjbmt1WTI5dGNHeGxkR2x2YmlCOGZDQjdmVHRjYmlBZ0lDQnlaV052Y21RdWRIbHdaU0E5SUZ3aWJtOXliV0ZzWENJN1hHNGdJQ0FnWkdWc1pYUmxJSEpsWTI5eVpDNWhjbWM3WEc0Z0lDQWdaVzUwY25rdVkyOXRjR3hsZEdsdmJpQTlJSEpsWTI5eVpEdGNiaUFnZlZ4dVhHNGdJR1oxYm1OMGFXOXVJRU52Ym5SbGVIUW9kSEo1VEc5amMweHBjM1FwSUh0Y2JpQWdJQ0F2THlCVWFHVWdjbTl2ZENCbGJuUnllU0J2WW1wbFkzUWdLR1ZtWm1WamRHbDJaV3g1SUdFZ2RISjVJSE4wWVhSbGJXVnVkQ0IzYVhSb2IzVjBJR0VnWTJGMFkyaGNiaUFnSUNBdkx5QnZjaUJoSUdacGJtRnNiSGtnWW14dlkyc3BJR2RwZG1WeklIVnpJR0VnY0d4aFkyVWdkRzhnYzNSdmNtVWdkbUZzZFdWeklIUm9jbTkzYmlCbWNtOXRYRzRnSUNBZ0x5OGdiRzlqWVhScGIyNXpJSGRvWlhKbElIUm9aWEpsSUdseklHNXZJR1Z1WTJ4dmMybHVaeUIwY25rZ2MzUmhkR1Z0Wlc1MExseHVJQ0FnSUhSb2FYTXVkSEo1Ulc1MGNtbGxjeUE5SUZ0N0lIUnllVXh2WXpvZ1hDSnliMjkwWENJZ2ZWMDdYRzRnSUNBZ2RISjVURzlqYzB4cGMzUXVabTl5UldGamFDaHdkWE5vVkhKNVJXNTBjbmtzSUhSb2FYTXBPMXh1SUNBZ0lIUm9hWE11Y21WelpYUW9LVHRjYmlBZ2ZWeHVYRzRnSUhKMWJuUnBiV1V1YTJWNWN5QTlJR1oxYm1OMGFXOXVJQ2h2WW1wbFkzUXBJSHRjYmlBZ0lDQjJZWElnYTJWNWN5QTlJRnRkTzF4dUlDQWdJR1p2Y2lBb2RtRnlJR3RsZVNCcGJpQnZZbXBsWTNRcElIdGNiaUFnSUNBZ0lHdGxlWE11Y0hWemFDaHJaWGtwTzF4dUlDQWdJSDFjYmlBZ0lDQnJaWGx6TG5KbGRtVnljMlVvS1R0Y2JseHVJQ0FnSUM4dklGSmhkR2hsY2lCMGFHRnVJSEpsZEhWeWJtbHVaeUJoYmlCdlltcGxZM1FnZDJsMGFDQmhJRzVsZUhRZ2JXVjBhRzlrTENCM1pTQnJaV1Z3WEc0Z0lDQWdMeThnZEdocGJtZHpJSE5wYlhCc1pTQmhibVFnY21WMGRYSnVJSFJvWlNCdVpYaDBJR1oxYm1OMGFXOXVJR2wwYzJWc1ppNWNiaUFnSUNCeVpYUjFjbTRnWm5WdVkzUnBiMjRnYm1WNGRDZ3BJSHRjYmlBZ0lDQWdJSGRvYVd4bElDaHJaWGx6TG14bGJtZDBhQ2tnZTF4dUlDQWdJQ0FnSUNCMllYSWdhMlY1SUQwZ2EyVjVjeTV3YjNBb0tUdGNiaUFnSUNBZ0lDQWdhV1lnS0d0bGVTQnBiaUJ2WW1wbFkzUXBJSHRjYmlBZ0lDQWdJQ0FnSUNCdVpYaDBMblpoYkhWbElEMGdhMlY1TzF4dUlDQWdJQ0FnSUNBZ0lHNWxlSFF1Wkc5dVpTQTlJR1poYkhObE8xeHVJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQnVaWGgwTzF4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDOHZJRlJ2SUdGMmIybGtJR055WldGMGFXNW5JR0Z1SUdGa1pHbDBhVzl1WVd3Z2IySnFaV04wTENCM1pTQnFkWE4wSUdoaGJtY2dkR2hsSUM1MllXeDFaVnh1SUNBZ0lDQWdMeThnWVc1a0lDNWtiMjVsSUhCeWIzQmxjblJwWlhNZ2IyWm1JSFJvWlNCdVpYaDBJR1oxYm1OMGFXOXVJRzlpYW1WamRDQnBkSE5sYkdZdUlGUm9hWE5jYmlBZ0lDQWdJQzh2SUdGc2MyOGdaVzV6ZFhKbGN5QjBhR0YwSUhSb1pTQnRhVzVwWm1sbGNpQjNhV3hzSUc1dmRDQmhibTl1ZVcxcGVtVWdkR2hsSUdaMWJtTjBhVzl1TGx4dUlDQWdJQ0FnYm1WNGRDNWtiMjVsSUQwZ2RISjFaVHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnVaWGgwTzF4dUlDQWdJSDA3WEc0Z0lIMDdYRzVjYmlBZ1puVnVZM1JwYjI0Z2RtRnNkV1Z6S0dsMFpYSmhZbXhsS1NCN1hHNGdJQ0FnYVdZZ0tHbDBaWEpoWW14bEtTQjdYRzRnSUNBZ0lDQjJZWElnYVhSbGNtRjBiM0pOWlhSb2IyUWdQU0JwZEdWeVlXSnNaVnRwZEdWeVlYUnZjbE41YldKdmJGMDdYRzRnSUNBZ0lDQnBaaUFvYVhSbGNtRjBiM0pOWlhSb2IyUXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR2wwWlhKaGRHOXlUV1YwYUc5a0xtTmhiR3dvYVhSbGNtRmliR1VwTzF4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlHbDBaWEpoWW14bExtNWxlSFFnUFQwOUlGd2lablZ1WTNScGIyNWNJaWtnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnYVhSbGNtRmliR1U3WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdsbUlDZ2hhWE5PWVU0b2FYUmxjbUZpYkdVdWJHVnVaM1JvS1NrZ2UxeHVJQ0FnSUNBZ0lDQjJZWElnYVNBOUlDMHhMRnh1SUNBZ0lDQWdJQ0FnSUNBZ2JtVjRkQ0E5SUdaMWJtTjBhVzl1SUc1bGVIUW9LU0I3WEc0Z0lDQWdJQ0FnSUNBZ2QyaHBiR1VnS0NzcmFTQThJR2wwWlhKaFlteGxMbXhsYm1kMGFDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLR2hoYzA5M2JpNWpZV3hzS0dsMFpYSmhZbXhsTENCcEtTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQnVaWGgwTG5aaGJIVmxJRDBnYVhSbGNtRmliR1ZiYVYwN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUc1bGVIUXVaRzl1WlNBOUlHWmhiSE5sTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdibVY0ZER0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdJQ0J1WlhoMExuWmhiSFZsSUQwZ2RXNWtaV1pwYm1Wa08xeHVJQ0FnSUNBZ0lDQWdJRzVsZUhRdVpHOXVaU0E5SUhSeWRXVTdYRzVjYmlBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnYm1WNGREdGNiaUFnSUNBZ0lDQWdmVHRjYmx4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnYm1WNGRDNXVaWGgwSUQwZ2JtVjRkRHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJTWlhSMWNtNGdZVzRnYVhSbGNtRjBiM0lnZDJsMGFDQnVieUIyWVd4MVpYTXVYRzRnSUNBZ2NtVjBkWEp1SUhzZ2JtVjRkRG9nWkc5dVpWSmxjM1ZzZENCOU8xeHVJQ0I5WEc0Z0lISjFiblJwYldVdWRtRnNkV1Z6SUQwZ2RtRnNkV1Z6TzF4dVhHNGdJR1oxYm1OMGFXOXVJR1J2Ym1WU1pYTjFiSFFvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSHNnZG1Gc2RXVTZJSFZ1WkdWbWFXNWxaQ3dnWkc5dVpUb2dkSEoxWlNCOU8xeHVJQ0I5WEc1Y2JpQWdRMjl1ZEdWNGRDNXdjbTkwYjNSNWNHVWdQU0I3WEc0Z0lDQWdZMjl1YzNSeWRXTjBiM0k2SUVOdmJuUmxlSFFzWEc1Y2JpQWdJQ0J5WlhObGREb2dablZ1WTNScGIyNGdjbVZ6WlhRb0tTQjdYRzRnSUNBZ0lDQjBhR2x6TG5CeVpYWWdQU0F3TzF4dUlDQWdJQ0FnZEdocGN5NXVaWGgwSUQwZ01EdGNiaUFnSUNBZ0lIUm9hWE11YzJWdWRDQTlJSFZ1WkdWbWFXNWxaRHRjYmlBZ0lDQWdJSFJvYVhNdVpHOXVaU0E5SUdaaGJITmxPMXh1SUNBZ0lDQWdkR2hwY3k1a1pXeGxaMkYwWlNBOUlHNTFiR3c3WEc1Y2JpQWdJQ0FnSUhSb2FYTXVkSEo1Ulc1MGNtbGxjeTVtYjNKRllXTm9LSEpsYzJWMFZISjVSVzUwY25rcE8xeHVYRzRnSUNBZ0lDQXZMeUJRY21VdGFXNXBkR2xoYkdsNlpTQmhkQ0JzWldGemRDQXlNQ0IwWlcxd2IzSmhjbmtnZG1GeWFXRmliR1Z6SUhSdklHVnVZV0pzWlNCb2FXUmtaVzVjYmlBZ0lDQWdJQzh2SUdOc1lYTnpJRzl3ZEdsdGFYcGhkR2x2Ym5NZ1ptOXlJSE5wYlhCc1pTQm5aVzVsY21GMGIzSnpMbHh1SUNBZ0lDQWdabTl5SUNoMllYSWdkR1Z0Y0VsdVpHVjRJRDBnTUN3Z2RHVnRjRTVoYldVN0lHaGhjMDkzYmk1allXeHNLSFJvYVhNc0lIUmxiWEJPWVcxbElEMGdYQ0owWENJZ0t5QjBaVzF3U1c1a1pYZ3BJSHg4SUhSbGJYQkpibVJsZUNBOElESXdPeUFySzNSbGJYQkpibVJsZUNrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6VzNSbGJYQk9ZVzFsWFNBOUlHNTFiR3c3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmU3hjYmx4dUlDQWdJSE4wYjNBNklHWjFibU4wYVc5dUlITjBiM0FvS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbVJ2Ym1VZ1BTQjBjblZsTzF4dVhHNGdJQ0FnSUNCMllYSWdjbTl2ZEVWdWRISjVJRDBnZEdocGN5NTBjbmxGYm5SeWFXVnpXekJkTzF4dUlDQWdJQ0FnZG1GeUlISnZiM1JTWldOdmNtUWdQU0J5YjI5MFJXNTBjbmt1WTI5dGNHeGxkR2x2Ymp0Y2JpQWdJQ0FnSUdsbUlDaHliMjkwVW1WamIzSmtMblI1Y0dVZ1BUMDlJRndpZEdoeWIzZGNJaWtnZTF4dUlDQWdJQ0FnSUNCMGFISnZkeUJ5YjI5MFVtVmpiM0prTG1GeVp6dGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11Y25aaGJEdGNiaUFnSUNCOUxGeHVYRzRnSUNBZ1pHbHpjR0YwWTJoRmVHTmxjSFJwYjI0NklHWjFibU4wYVc5dUlHUnBjM0JoZEdOb1JYaGpaWEIwYVc5dUtHVjRZMlZ3ZEdsdmJpa2dlMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVaRzl1WlNrZ2UxeHVJQ0FnSUNBZ0lDQjBhSEp2ZHlCbGVHTmxjSFJwYjI0N1hHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lIWmhjaUJqYjI1MFpYaDBJRDBnZEdocGN6dGNiaUFnSUNBZ0lHWjFibU4wYVc5dUlHaGhibVJzWlNoc2IyTXNJR05oZFdkb2RDa2dlMXh1SUNBZ0lDQWdJQ0J5WldOdmNtUXVkSGx3WlNBOUlGd2lkR2h5YjNkY0lqdGNiaUFnSUNBZ0lDQWdjbVZqYjNKa0xtRnlaeUE5SUdWNFkyVndkR2x2Ymp0Y2JpQWdJQ0FnSUNBZ1kyOXVkR1Y0ZEM1dVpYaDBJRDBnYkc5ak8xeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z0lTRmpZWFZuYUhRN1hHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHWnZjaUFvZG1GeUlHa2dQU0IwYUdsekxuUnllVVZ1ZEhKcFpYTXViR1Z1WjNSb0lDMGdNVHNnYVNBK1BTQXdPeUF0TFdrcElIdGNiaUFnSUNBZ0lDQWdkbUZ5SUdWdWRISjVJRDBnZEdocGN5NTBjbmxGYm5SeWFXVnpXMmxkTzF4dUlDQWdJQ0FnSUNCMllYSWdjbVZqYjNKa0lEMGdaVzUwY25rdVkyOXRjR3hsZEdsdmJqdGNibHh1SUNBZ0lDQWdJQ0JwWmlBb1pXNTBjbmt1ZEhKNVRHOWpJRDA5UFNCY0luSnZiM1JjSWlrZ2UxeHVJQ0FnSUNBZ0lDQWdJQzh2SUVWNFkyVndkR2x2YmlCMGFISnZkMjRnYjNWMGMybGtaU0J2WmlCaGJua2dkSEo1SUdKc2IyTnJJSFJvWVhRZ1kyOTFiR1FnYUdGdVpHeGxYRzRnSUNBZ0lDQWdJQ0FnTHk4Z2FYUXNJSE52SUhObGRDQjBhR1VnWTI5dGNHeGxkR2x2YmlCMllXeDFaU0J2WmlCMGFHVWdaVzUwYVhKbElHWjFibU4wYVc5dUlIUnZYRzRnSUNBZ0lDQWdJQ0FnTHk4Z2RHaHliM2NnZEdobElHVjRZMlZ3ZEdsdmJpNWNiaUFnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdhR0Z1Wkd4bEtGd2laVzVrWENJcE8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnYVdZZ0tHVnVkSEo1TG5SeWVVeHZZeUE4UFNCMGFHbHpMbkJ5WlhZcElIdGNiaUFnSUNBZ0lDQWdJQ0IyWVhJZ2FHRnpRMkYwWTJnZ1BTQm9ZWE5QZDI0dVkyRnNiQ2hsYm5SeWVTd2dYQ0pqWVhSamFFeHZZMXdpS1R0Y2JpQWdJQ0FnSUNBZ0lDQjJZWElnYUdGelJtbHVZV3hzZVNBOUlHaGhjMDkzYmk1allXeHNLR1Z1ZEhKNUxDQmNJbVpwYm1Gc2JIbE1iMk5jSWlrN1hHNWNiaUFnSUNBZ0lDQWdJQ0JwWmlBb2FHRnpRMkYwWTJnZ0ppWWdhR0Z6Um1sdVlXeHNlU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0hSb2FYTXVjSEpsZGlBOElHVnVkSEo1TG1OaGRHTm9URzlqS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJvWVc1a2JHVW9aVzUwY25rdVkyRjBZMmhNYjJNc0lIUnlkV1VwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdmU0JsYkhObElHbG1JQ2gwYUdsekxuQnlaWFlnUENCbGJuUnllUzVtYVc1aGJHeDVURzlqS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJvWVc1a2JHVW9aVzUwY25rdVptbHVZV3hzZVV4dll5azdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdmU0JsYkhObElHbG1JQ2hvWVhORFlYUmphQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0hSb2FYTXVjSEpsZGlBOElHVnVkSEo1TG1OaGRHTm9URzlqS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJvWVc1a2JHVW9aVzUwY25rdVkyRjBZMmhNYjJNc0lIUnlkV1VwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0FnSUgwZ1pXeHpaU0JwWmlBb2FHRnpSbWx1WVd4c2VTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdWNISmxkaUE4SUdWdWRISjVMbVpwYm1Gc2JIbE1iMk1wSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJR2hoYm1Sc1pTaGxiblJ5ZVM1bWFXNWhiR3g1VEc5aktUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLRndpZEhKNUlITjBZWFJsYldWdWRDQjNhWFJvYjNWMElHTmhkR05vSUc5eUlHWnBibUZzYkhsY0lpazdYRzRnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlN4Y2JseHVJQ0FnSUdGaWNuVndkRG9nWm5WdVkzUnBiMjRnWVdKeWRYQjBLSFI1Y0dVc0lHRnlaeWtnZTF4dUlDQWdJQ0FnWm05eUlDaDJZWElnYVNBOUlIUm9hWE11ZEhKNVJXNTBjbWxsY3k1c1pXNW5kR2dnTFNBeE95QnBJRDQ5SURBN0lDMHRhU2tnZTF4dUlDQWdJQ0FnSUNCMllYSWdaVzUwY25rZ1BTQjBhR2x6TG5SeWVVVnVkSEpwWlhOYmFWMDdYRzRnSUNBZ0lDQWdJR2xtSUNobGJuUnllUzUwY25sTWIyTWdQRDBnZEdocGN5NXdjbVYySUNZbUlHaGhjMDkzYmk1allXeHNLR1Z1ZEhKNUxDQmNJbVpwYm1Gc2JIbE1iMk5jSWlrZ0ppWWdkR2hwY3k1d2NtVjJJRHdnWlc1MGNua3VabWx1WVd4c2VVeHZZeWtnZTF4dUlDQWdJQ0FnSUNBZ0lIWmhjaUJtYVc1aGJHeDVSVzUwY25rZ1BTQmxiblJ5ZVR0Y2JpQWdJQ0FnSUNBZ0lDQmljbVZoYXp0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnBaaUFvWm1sdVlXeHNlVVZ1ZEhKNUlDWW1JQ2gwZVhCbElEMDlQU0JjSW1KeVpXRnJYQ0lnZkh3Z2RIbHdaU0E5UFQwZ1hDSmpiMjUwYVc1MVpWd2lLU0FtSmlCbWFXNWhiR3g1Ulc1MGNua3VkSEo1VEc5aklEdzlJR0Z5WnlBbUppQmhjbWNnUENCbWFXNWhiR3g1Ulc1MGNua3VabWx1WVd4c2VVeHZZeWtnZTF4dUlDQWdJQ0FnSUNBdkx5QkpaMjV2Y21VZ2RHaGxJR1pwYm1Gc2JIa2daVzUwY25rZ2FXWWdZMjl1ZEhKdmJDQnBjeUJ1YjNRZ2FuVnRjR2x1WnlCMGJ5QmhYRzRnSUNBZ0lDQWdJQzh2SUd4dlkyRjBhVzl1SUc5MWRITnBaR1VnZEdobElIUnllUzlqWVhSamFDQmliRzlqYXk1Y2JpQWdJQ0FnSUNBZ1ptbHVZV3hzZVVWdWRISjVJRDBnYm5Wc2JEdGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkbUZ5SUhKbFkyOXlaQ0E5SUdacGJtRnNiSGxGYm5SeWVTQS9JR1pwYm1Gc2JIbEZiblJ5ZVM1amIyMXdiR1YwYVc5dUlEb2dlMzA3WEc0Z0lDQWdJQ0J5WldOdmNtUXVkSGx3WlNBOUlIUjVjR1U3WEc0Z0lDQWdJQ0J5WldOdmNtUXVZWEpuSUQwZ1lYSm5PMXh1WEc0Z0lDQWdJQ0JwWmlBb1ptbHVZV3hzZVVWdWRISjVLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVibVY0ZENBOUlHWnBibUZzYkhsRmJuUnllUzVtYVc1aGJHeDVURzlqTzF4dUlDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NWpiMjF3YkdWMFpTaHlaV052Y21RcE8xeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z1EyOXVkR2x1ZFdWVFpXNTBhVzVsYkR0Y2JpQWdJQ0I5TEZ4dVhHNGdJQ0FnWTI5dGNHeGxkR1U2SUdaMWJtTjBhVzl1SUdOdmJYQnNaWFJsS0hKbFkyOXlaQ3dnWVdaMFpYSk1iMk1wSUh0Y2JpQWdJQ0FnSUdsbUlDaHlaV052Y21RdWRIbHdaU0E5UFQwZ1hDSjBhSEp2ZDF3aUtTQjdYRzRnSUNBZ0lDQWdJSFJvY205M0lISmxZMjl5WkM1aGNtYzdYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNoeVpXTnZjbVF1ZEhsd1pTQTlQVDBnWENKaWNtVmhhMXdpSUh4OElISmxZMjl5WkM1MGVYQmxJRDA5UFNCY0ltTnZiblJwYm5WbFhDSXBJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXVaWGgwSUQwZ2NtVmpiM0prTG1GeVp6dGNiaUFnSUNBZ0lIMGdaV3h6WlNCcFppQW9jbVZqYjNKa0xuUjVjR1VnUFQwOUlGd2ljbVYwZFhKdVhDSXBJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXlkbUZzSUQwZ2NtVmpiM0prTG1GeVp6dGNiaUFnSUNBZ0lDQWdkR2hwY3k1dVpYaDBJRDBnWENKbGJtUmNJanRjYmlBZ0lDQWdJSDBnWld4elpTQnBaaUFvY21WamIzSmtMblI1Y0dVZ1BUMDlJRndpYm05eWJXRnNYQ0lnSmlZZ1lXWjBaWEpNYjJNcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1dVpYaDBJRDBnWVdaMFpYSk1iMk03WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUJEYjI1MGFXNTFaVk5sYm5ScGJtVnNPMXh1SUNBZ0lIMHNYRzVjYmlBZ0lDQm1hVzVwYzJnNklHWjFibU4wYVc5dUlHWnBibWx6YUNobWFXNWhiR3g1VEc5aktTQjdYRzRnSUNBZ0lDQm1iM0lnS0haaGNpQnBJRDBnZEdocGN5NTBjbmxGYm5SeWFXVnpMbXhsYm1kMGFDQXRJREU3SUdrZ1BqMGdNRHNnTFMxcEtTQjdYRzRnSUNBZ0lDQWdJSFpoY2lCbGJuUnllU0E5SUhSb2FYTXVkSEo1Ulc1MGNtbGxjMXRwWFR0Y2JpQWdJQ0FnSUNBZ2FXWWdLR1Z1ZEhKNUxtWnBibUZzYkhsTWIyTWdQVDA5SUdacGJtRnNiSGxNYjJNcElIdGNiaUFnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1amIyMXdiR1YwWlNobGJuUnllUzVqYjIxd2JHVjBhVzl1TENCbGJuUnllUzVoWm5SbGNreHZZeWs3WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5TEZ4dVhHNGdJQ0FnWENKallYUmphRndpT2lCbWRXNWpkR2x2YmlBb2RISjVURzlqS1NCN1hHNGdJQ0FnSUNCbWIzSWdLSFpoY2lCcElEMGdkR2hwY3k1MGNubEZiblJ5YVdWekxteGxibWQwYUNBdElERTdJR2tnUGowZ01Ec2dMUzFwS1NCN1hHNGdJQ0FnSUNBZ0lIWmhjaUJsYm5SeWVTQTlJSFJvYVhNdWRISjVSVzUwY21sbGMxdHBYVHRjYmlBZ0lDQWdJQ0FnYVdZZ0tHVnVkSEo1TG5SeWVVeHZZeUE5UFQwZ2RISjVURzlqS1NCN1hHNGdJQ0FnSUNBZ0lDQWdkbUZ5SUhKbFkyOXlaQ0E5SUdWdWRISjVMbU52YlhCc1pYUnBiMjQ3WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLSEpsWTI5eVpDNTBlWEJsSUQwOVBTQmNJblJvY205M1hDSXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIWmhjaUIwYUhKdmQyNGdQU0J5WldOdmNtUXVZWEpuTzF4dUlDQWdJQ0FnSUNBZ0lDQWdjbVZ6WlhSVWNubEZiblJ5ZVNobGJuUnllU2s3WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQjBhSEp2ZDI0N1hHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdMeThnVkdobElHTnZiblJsZUhRdVkyRjBZMmdnYldWMGFHOWtJRzExYzNRZ2IyNXNlU0JpWlNCallXeHNaV1FnZDJsMGFDQmhJR3h2WTJGMGFXOXVYRzRnSUNBZ0lDQXZMeUJoY21kMWJXVnVkQ0IwYUdGMElHTnZjbkpsYzNCdmJtUnpJSFJ2SUdFZ2EyNXZkMjRnWTJGMFkyZ2dZbXh2WTJzdVhHNGdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvWENKcGJHeGxaMkZzSUdOaGRHTm9JR0YwZEdWdGNIUmNJaWs3WEc0Z0lDQWdmU3hjYmx4dUlDQWdJR1JsYkdWbllYUmxXV2xsYkdRNklHWjFibU4wYVc5dUlHUmxiR1ZuWVhSbFdXbGxiR1FvYVhSbGNtRmliR1VzSUhKbGMzVnNkRTVoYldVc0lHNWxlSFJNYjJNcElIdGNiaUFnSUNBZ0lIUm9hWE11WkdWc1pXZGhkR1VnUFNCN1hHNGdJQ0FnSUNBZ0lHbDBaWEpoZEc5eU9pQjJZV3gxWlhNb2FYUmxjbUZpYkdVcExGeHVJQ0FnSUNBZ0lDQnlaWE4xYkhST1lXMWxPaUJ5WlhOMWJIUk9ZVzFsTEZ4dUlDQWdJQ0FnSUNCdVpYaDBURzlqT2lCdVpYaDBURzlqWEc0Z0lDQWdJQ0I5TzF4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnUTI5dWRHbHVkV1ZUWlc1MGFXNWxiRHRjYmlBZ0lDQjlYRzRnSUgwN1hHNTlLU2hjYmk4dklFRnRiMjVuSUhSb1pTQjJZWEpwYjNWeklIUnlhV05yY3lCbWIzSWdiMkowWVdsdWFXNW5JR0VnY21WbVpYSmxibU5sSUhSdklIUm9aU0JuYkc5aVlXeGNiaTh2SUc5aWFtVmpkQ3dnZEdocGN5QnpaV1Z0Y3lCMGJ5QmlaU0IwYUdVZ2JXOXpkQ0J5Wld4cFlXSnNaU0IwWldOb2JtbHhkV1VnZEdoaGRDQmtiMlZ6SUc1dmRGeHVMeThnZFhObElHbHVaR2x5WldOMElHVjJZV3dnS0hkb2FXTm9JSFpwYjJ4aGRHVnpJRU52Ym5SbGJuUWdVMlZqZFhKcGRIa2dVRzlzYVdONUtTNWNiblI1Y0dWdlppQm5iRzlpWVd3Z1BUMDlJRndpYjJKcVpXTjBYQ0lnUHlCbmJHOWlZV3dnT2lCMGVYQmxiMllnZDJsdVpHOTNJRDA5UFNCY0ltOWlhbVZqZEZ3aUlEOGdkMmx1Wkc5M0lEb2dkVzVrWldacGJtVmtLVHNpWFgwPSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICB2YXIgbTtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2Uge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IDA7XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsImlmICh0eXBlb2YgTWFwID09PSBcInVuZGVmaW5lZFwiKSB7XG4gIE1hcCA9IGZ1bmN0aW9uKCkgeyB0aGlzLmNsZWFyKCk7IH07XG4gIE1hcC5wcm90b3R5cGUgPSB7XG4gICAgc2V0OiBmdW5jdGlvbihrLCB2KSB7IHRoaXMuX1trXSA9IHY7IHJldHVybiB0aGlzOyB9LFxuICAgIGdldDogZnVuY3Rpb24oaykgeyByZXR1cm4gdGhpcy5fW2tdOyB9LFxuICAgIGhhczogZnVuY3Rpb24oaykgeyByZXR1cm4gayBpbiB0aGlzLl87IH0sXG4gICAgZGVsZXRlOiBmdW5jdGlvbihrKSB7IHJldHVybiBrIGluIHRoaXMuXyAmJiBkZWxldGUgdGhpcy5fW2tdOyB9LFxuICAgIGNsZWFyOiBmdW5jdGlvbigpIHsgdGhpcy5fID0gT2JqZWN0LmNyZWF0ZShudWxsKTsgfSxcbiAgICBnZXQgc2l6ZSgpIHsgdmFyIG4gPSAwOyBmb3IgKHZhciBrIGluIHRoaXMuXykgKytuOyByZXR1cm4gbjsgfSxcbiAgICBmb3JFYWNoOiBmdW5jdGlvbihjKSB7IGZvciAodmFyIGsgaW4gdGhpcy5fKSBjKHRoaXMuX1trXSwgaywgdGhpcyk7IH1cbiAgfTtcbn1cblxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuICBmYWN0b3J5KChnbG9iYWwuc2NhbGUgPSB7fSkpO1xufSh0aGlzLCBmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gYXNjZW5kaW5nKGEsIGIpIHtcbiAgICByZXR1cm4gYSA8IGIgPyAtMSA6IGEgPiBiID8gMSA6IGEgPj0gYiA/IDAgOiBOYU47XG4gIH1cblxuICBmdW5jdGlvbiBhc2NlbmRpbmdDb21wYXJhdG9yKGYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oZCwgeCkge1xuICAgICAgcmV0dXJuIGFzY2VuZGluZyhmKGQpLCB4KTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gYmlzZWN0b3IoY29tcGFyZSkge1xuICAgIGlmIChjb21wYXJlLmxlbmd0aCA9PT0gMSkgY29tcGFyZSA9IGFzY2VuZGluZ0NvbXBhcmF0b3IoY29tcGFyZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IGZ1bmN0aW9uKGEsIHgsIGxvLCBoaSkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIGxvID0gMDtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCA0KSBoaSA9IGEubGVuZ3RoO1xuICAgICAgICB3aGlsZSAobG8gPCBoaSkge1xuICAgICAgICAgIHZhciBtaWQgPSBsbyArIGhpID4+PiAxO1xuICAgICAgICAgIGlmIChjb21wYXJlKGFbbWlkXSwgeCkgPCAwKSBsbyA9IG1pZCArIDE7XG4gICAgICAgICAgZWxzZSBoaSA9IG1pZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG87XG4gICAgICB9LFxuICAgICAgcmlnaHQ6IGZ1bmN0aW9uKGEsIHgsIGxvLCBoaSkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIGxvID0gMDtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCA0KSBoaSA9IGEubGVuZ3RoO1xuICAgICAgICB3aGlsZSAobG8gPCBoaSkge1xuICAgICAgICAgIHZhciBtaWQgPSBsbyArIGhpID4+PiAxO1xuICAgICAgICAgIGlmIChjb21wYXJlKGFbbWlkXSwgeCkgPiAwKSBoaSA9IG1pZDtcbiAgICAgICAgICBlbHNlIGxvID0gbWlkICsgMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG87XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHZhciBhc2NlbmRpbmdCaXNlY3QgPSBiaXNlY3Rvcihhc2NlbmRpbmcpO1xuICB2YXIgYmlzZWN0UmlnaHQgPSBhc2NlbmRpbmdCaXNlY3QucmlnaHQ7XG5cbiAgdmFyIGJpc2VjdCA9IGJpc2VjdFJpZ2h0O1xuXG4gIGZ1bmN0aW9uIG5ld1RocmVzaG9sZChkb21haW4sIHJhbmdlLCBuKSB7XG5cbiAgICBmdW5jdGlvbiBzY2FsZSh4KSB7XG4gICAgICBpZiAoeCA8PSB4KSByZXR1cm4gcmFuZ2VbYmlzZWN0KGRvbWFpbiwgeCwgMCwgbildO1xuICAgIH1cblxuICAgIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGRvbWFpbi5zbGljZSgpO1xuICAgICAgZG9tYWluID0geC5zbGljZSgpLCBuID0gTWF0aC5taW4oZG9tYWluLmxlbmd0aCwgcmFuZ2UubGVuZ3RoIC0gMSk7XG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIHNjYWxlLnJhbmdlID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gcmFuZ2Uuc2xpY2UoKTtcbiAgICAgIHJhbmdlID0geC5zbGljZSgpLCBuID0gTWF0aC5taW4oZG9tYWluLmxlbmd0aCwgcmFuZ2UubGVuZ3RoIC0gMSk7XG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIHNjYWxlLmludmVydEV4dGVudCA9IGZ1bmN0aW9uKHkpIHtcbiAgICAgIHJldHVybiB5ID0gcmFuZ2UuaW5kZXhPZih5KSwgW2RvbWFpblt5IC0gMV0sIGRvbWFpblt5XV07XG4gICAgfTtcblxuICAgIHNjYWxlLmNvcHkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXdUaHJlc2hvbGQoZG9tYWluLCByYW5nZSk7XG4gICAgfTtcblxuICAgIHJldHVybiBzY2FsZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRocmVzaG9sZCgpIHtcbiAgICByZXR1cm4gbmV3VGhyZXNob2xkKFsuNV0sIFswLCAxXSwgMSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZU51bWJlcihhLCBiKSB7XG4gICAgcmV0dXJuIGEgPSArYSwgYiAtPSBhLCBmdW5jdGlvbih0KSB7XG4gICAgICByZXR1cm4gYSArIGIgKiB0O1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZU9iamVjdChhLCBiKSB7XG4gICAgdmFyIGkgPSB7fSxcbiAgICAgICAgYyA9IHt9LFxuICAgICAgICBrO1xuXG4gICAgZm9yIChrIGluIGEpIHtcbiAgICAgIGlmIChrIGluIGIpIHtcbiAgICAgICAgaVtrXSA9IGludGVycG9sYXRlKGFba10sIGJba10pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY1trXSA9IGFba107XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChrIGluIGIpIHtcbiAgICAgIGlmICghKGsgaW4gYSkpIHtcbiAgICAgICAgY1trXSA9IGJba107XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIGZvciAoayBpbiBpKSBjW2tdID0gaVtrXSh0KTtcbiAgICAgIHJldHVybiBjO1xuICAgIH07XG4gIH1cblxuXG4gIC8vIFRPRE8gc3BhcnNlIGFycmF5cz9cbiAgZnVuY3Rpb24gaW50ZXJwb2xhdGVBcnJheShhLCBiKSB7XG4gICAgdmFyIHggPSBbXSxcbiAgICAgICAgYyA9IFtdLFxuICAgICAgICBuYSA9IGEubGVuZ3RoLFxuICAgICAgICBuYiA9IGIubGVuZ3RoLFxuICAgICAgICBuMCA9IE1hdGgubWluKGEubGVuZ3RoLCBiLmxlbmd0aCksXG4gICAgICAgIGk7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbjA7ICsraSkgeC5wdXNoKGludGVycG9sYXRlKGFbaV0sIGJbaV0pKTtcbiAgICBmb3IgKDsgaSA8IG5hOyArK2kpIGNbaV0gPSBhW2ldO1xuICAgIGZvciAoOyBpIDwgbmI7ICsraSkgY1tpXSA9IGJbaV07XG5cbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IG4wOyArK2kpIGNbaV0gPSB4W2ldKHQpO1xuICAgICAgcmV0dXJuIGM7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9mb3JtYXQociwgZywgYikge1xuICAgIGlmIChpc05hTihyKSkgciA9IDA7XG4gICAgaWYgKGlzTmFOKGcpKSBnID0gMDtcbiAgICBpZiAoaXNOYU4oYikpIGIgPSAwO1xuICAgIHJldHVybiBcIiNcIlxuICAgICAgICArIChyIDwgMTYgPyBcIjBcIiArIHIudG9TdHJpbmcoMTYpIDogci50b1N0cmluZygxNikpXG4gICAgICAgICsgKGcgPCAxNiA/IFwiMFwiICsgZy50b1N0cmluZygxNikgOiBnLnRvU3RyaW5nKDE2KSlcbiAgICAgICAgKyAoYiA8IDE2ID8gXCIwXCIgKyBiLnRvU3RyaW5nKDE2KSA6IGIudG9TdHJpbmcoMTYpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIFJnYihyLCBnLCBiKSB7XG4gICAgdGhpcy5yID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCBNYXRoLnJvdW5kKHIpKSk7XG4gICAgdGhpcy5nID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCBNYXRoLnJvdW5kKGcpKSk7XG4gICAgdGhpcy5iID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCBNYXRoLnJvdW5kKGIpKSk7XG4gIH1cblxuICBmdW5jdGlvbiBDb2xvcigpIHt9XG5cbiAgQ29sb3IucHJvdG90eXBlID0ge1xuICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnJnYigpICsgXCJcIjtcbiAgICB9XG4gIH07XG5cbiAgdmFyIF9wcm90b3R5cGUgPSBSZ2IucHJvdG90eXBlID0gbmV3IENvbG9yO1xuXG4gIHZhciBkYXJrZXIgPSAuNztcblxuICBfcHJvdG90eXBlLmRhcmtlciA9IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gZGFya2VyIDogTWF0aC5wb3coZGFya2VyLCBrKTtcbiAgICByZXR1cm4gbmV3IFJnYih0aGlzLnIgKiBrLCB0aGlzLmcgKiBrLCB0aGlzLmIgKiBrKTtcbiAgfTtcblxuICB2YXIgYnJpZ2h0ZXIgPSAxIC8gZGFya2VyO1xuXG4gIF9wcm90b3R5cGUuYnJpZ2h0ZXIgPSBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGJyaWdodGVyIDogTWF0aC5wb3coYnJpZ2h0ZXIsIGspO1xuICAgIHJldHVybiBuZXcgUmdiKHRoaXMuciAqIGssIHRoaXMuZyAqIGssIHRoaXMuYiAqIGspO1xuICB9O1xuXG4gIF9wcm90b3R5cGUucmdiID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgX3Byb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfZm9ybWF0KHRoaXMuciwgdGhpcy5nLCB0aGlzLmIpO1xuICB9O1xuXG4gIHZhciBuYW1lZCA9IChuZXcgTWFwKVxuICAgICAgLnNldChcImFsaWNlYmx1ZVwiLCAweGYwZjhmZilcbiAgICAgIC5zZXQoXCJhbnRpcXVld2hpdGVcIiwgMHhmYWViZDcpXG4gICAgICAuc2V0KFwiYXF1YVwiLCAweDAwZmZmZilcbiAgICAgIC5zZXQoXCJhcXVhbWFyaW5lXCIsIDB4N2ZmZmQ0KVxuICAgICAgLnNldChcImF6dXJlXCIsIDB4ZjBmZmZmKVxuICAgICAgLnNldChcImJlaWdlXCIsIDB4ZjVmNWRjKVxuICAgICAgLnNldChcImJpc3F1ZVwiLCAweGZmZTRjNClcbiAgICAgIC5zZXQoXCJibGFja1wiLCAweDAwMDAwMClcbiAgICAgIC5zZXQoXCJibGFuY2hlZGFsbW9uZFwiLCAweGZmZWJjZClcbiAgICAgIC5zZXQoXCJibHVlXCIsIDB4MDAwMGZmKVxuICAgICAgLnNldChcImJsdWV2aW9sZXRcIiwgMHg4YTJiZTIpXG4gICAgICAuc2V0KFwiYnJvd25cIiwgMHhhNTJhMmEpXG4gICAgICAuc2V0KFwiYnVybHl3b29kXCIsIDB4ZGViODg3KVxuICAgICAgLnNldChcImNhZGV0Ymx1ZVwiLCAweDVmOWVhMClcbiAgICAgIC5zZXQoXCJjaGFydHJldXNlXCIsIDB4N2ZmZjAwKVxuICAgICAgLnNldChcImNob2NvbGF0ZVwiLCAweGQyNjkxZSlcbiAgICAgIC5zZXQoXCJjb3JhbFwiLCAweGZmN2Y1MClcbiAgICAgIC5zZXQoXCJjb3JuZmxvd2VyYmx1ZVwiLCAweDY0OTVlZClcbiAgICAgIC5zZXQoXCJjb3Juc2lsa1wiLCAweGZmZjhkYylcbiAgICAgIC5zZXQoXCJjcmltc29uXCIsIDB4ZGMxNDNjKVxuICAgICAgLnNldChcImN5YW5cIiwgMHgwMGZmZmYpXG4gICAgICAuc2V0KFwiZGFya2JsdWVcIiwgMHgwMDAwOGIpXG4gICAgICAuc2V0KFwiZGFya2N5YW5cIiwgMHgwMDhiOGIpXG4gICAgICAuc2V0KFwiZGFya2dvbGRlbnJvZFwiLCAweGI4ODYwYilcbiAgICAgIC5zZXQoXCJkYXJrZ3JheVwiLCAweGE5YTlhOSlcbiAgICAgIC5zZXQoXCJkYXJrZ3JlZW5cIiwgMHgwMDY0MDApXG4gICAgICAuc2V0KFwiZGFya2dyZXlcIiwgMHhhOWE5YTkpXG4gICAgICAuc2V0KFwiZGFya2toYWtpXCIsIDB4YmRiNzZiKVxuICAgICAgLnNldChcImRhcmttYWdlbnRhXCIsIDB4OGIwMDhiKVxuICAgICAgLnNldChcImRhcmtvbGl2ZWdyZWVuXCIsIDB4NTU2YjJmKVxuICAgICAgLnNldChcImRhcmtvcmFuZ2VcIiwgMHhmZjhjMDApXG4gICAgICAuc2V0KFwiZGFya29yY2hpZFwiLCAweDk5MzJjYylcbiAgICAgIC5zZXQoXCJkYXJrcmVkXCIsIDB4OGIwMDAwKVxuICAgICAgLnNldChcImRhcmtzYWxtb25cIiwgMHhlOTk2N2EpXG4gICAgICAuc2V0KFwiZGFya3NlYWdyZWVuXCIsIDB4OGZiYzhmKVxuICAgICAgLnNldChcImRhcmtzbGF0ZWJsdWVcIiwgMHg0ODNkOGIpXG4gICAgICAuc2V0KFwiZGFya3NsYXRlZ3JheVwiLCAweDJmNGY0ZilcbiAgICAgIC5zZXQoXCJkYXJrc2xhdGVncmV5XCIsIDB4MmY0ZjRmKVxuICAgICAgLnNldChcImRhcmt0dXJxdW9pc2VcIiwgMHgwMGNlZDEpXG4gICAgICAuc2V0KFwiZGFya3Zpb2xldFwiLCAweDk0MDBkMylcbiAgICAgIC5zZXQoXCJkZWVwcGlua1wiLCAweGZmMTQ5MylcbiAgICAgIC5zZXQoXCJkZWVwc2t5Ymx1ZVwiLCAweDAwYmZmZilcbiAgICAgIC5zZXQoXCJkaW1ncmF5XCIsIDB4Njk2OTY5KVxuICAgICAgLnNldChcImRpbWdyZXlcIiwgMHg2OTY5NjkpXG4gICAgICAuc2V0KFwiZG9kZ2VyYmx1ZVwiLCAweDFlOTBmZilcbiAgICAgIC5zZXQoXCJmaXJlYnJpY2tcIiwgMHhiMjIyMjIpXG4gICAgICAuc2V0KFwiZmxvcmFsd2hpdGVcIiwgMHhmZmZhZjApXG4gICAgICAuc2V0KFwiZm9yZXN0Z3JlZW5cIiwgMHgyMjhiMjIpXG4gICAgICAuc2V0KFwiZnVjaHNpYVwiLCAweGZmMDBmZilcbiAgICAgIC5zZXQoXCJnYWluc2Jvcm9cIiwgMHhkY2RjZGMpXG4gICAgICAuc2V0KFwiZ2hvc3R3aGl0ZVwiLCAweGY4ZjhmZilcbiAgICAgIC5zZXQoXCJnb2xkXCIsIDB4ZmZkNzAwKVxuICAgICAgLnNldChcImdvbGRlbnJvZFwiLCAweGRhYTUyMClcbiAgICAgIC5zZXQoXCJncmF5XCIsIDB4ODA4MDgwKVxuICAgICAgLnNldChcImdyZWVuXCIsIDB4MDA4MDAwKVxuICAgICAgLnNldChcImdyZWVueWVsbG93XCIsIDB4YWRmZjJmKVxuICAgICAgLnNldChcImdyZXlcIiwgMHg4MDgwODApXG4gICAgICAuc2V0KFwiaG9uZXlkZXdcIiwgMHhmMGZmZjApXG4gICAgICAuc2V0KFwiaG90cGlua1wiLCAweGZmNjliNClcbiAgICAgIC5zZXQoXCJpbmRpYW5yZWRcIiwgMHhjZDVjNWMpXG4gICAgICAuc2V0KFwiaW5kaWdvXCIsIDB4NGIwMDgyKVxuICAgICAgLnNldChcIml2b3J5XCIsIDB4ZmZmZmYwKVxuICAgICAgLnNldChcImtoYWtpXCIsIDB4ZjBlNjhjKVxuICAgICAgLnNldChcImxhdmVuZGVyXCIsIDB4ZTZlNmZhKVxuICAgICAgLnNldChcImxhdmVuZGVyYmx1c2hcIiwgMHhmZmYwZjUpXG4gICAgICAuc2V0KFwibGF3bmdyZWVuXCIsIDB4N2NmYzAwKVxuICAgICAgLnNldChcImxlbW9uY2hpZmZvblwiLCAweGZmZmFjZClcbiAgICAgIC5zZXQoXCJsaWdodGJsdWVcIiwgMHhhZGQ4ZTYpXG4gICAgICAuc2V0KFwibGlnaHRjb3JhbFwiLCAweGYwODA4MClcbiAgICAgIC5zZXQoXCJsaWdodGN5YW5cIiwgMHhlMGZmZmYpXG4gICAgICAuc2V0KFwibGlnaHRnb2xkZW5yb2R5ZWxsb3dcIiwgMHhmYWZhZDIpXG4gICAgICAuc2V0KFwibGlnaHRncmF5XCIsIDB4ZDNkM2QzKVxuICAgICAgLnNldChcImxpZ2h0Z3JlZW5cIiwgMHg5MGVlOTApXG4gICAgICAuc2V0KFwibGlnaHRncmV5XCIsIDB4ZDNkM2QzKVxuICAgICAgLnNldChcImxpZ2h0cGlua1wiLCAweGZmYjZjMSlcbiAgICAgIC5zZXQoXCJsaWdodHNhbG1vblwiLCAweGZmYTA3YSlcbiAgICAgIC5zZXQoXCJsaWdodHNlYWdyZWVuXCIsIDB4MjBiMmFhKVxuICAgICAgLnNldChcImxpZ2h0c2t5Ymx1ZVwiLCAweDg3Y2VmYSlcbiAgICAgIC5zZXQoXCJsaWdodHNsYXRlZ3JheVwiLCAweDc3ODg5OSlcbiAgICAgIC5zZXQoXCJsaWdodHNsYXRlZ3JleVwiLCAweDc3ODg5OSlcbiAgICAgIC5zZXQoXCJsaWdodHN0ZWVsYmx1ZVwiLCAweGIwYzRkZSlcbiAgICAgIC5zZXQoXCJsaWdodHllbGxvd1wiLCAweGZmZmZlMClcbiAgICAgIC5zZXQoXCJsaW1lXCIsIDB4MDBmZjAwKVxuICAgICAgLnNldChcImxpbWVncmVlblwiLCAweDMyY2QzMilcbiAgICAgIC5zZXQoXCJsaW5lblwiLCAweGZhZjBlNilcbiAgICAgIC5zZXQoXCJtYWdlbnRhXCIsIDB4ZmYwMGZmKVxuICAgICAgLnNldChcIm1hcm9vblwiLCAweDgwMDAwMClcbiAgICAgIC5zZXQoXCJtZWRpdW1hcXVhbWFyaW5lXCIsIDB4NjZjZGFhKVxuICAgICAgLnNldChcIm1lZGl1bWJsdWVcIiwgMHgwMDAwY2QpXG4gICAgICAuc2V0KFwibWVkaXVtb3JjaGlkXCIsIDB4YmE1NWQzKVxuICAgICAgLnNldChcIm1lZGl1bXB1cnBsZVwiLCAweDkzNzBkYilcbiAgICAgIC5zZXQoXCJtZWRpdW1zZWFncmVlblwiLCAweDNjYjM3MSlcbiAgICAgIC5zZXQoXCJtZWRpdW1zbGF0ZWJsdWVcIiwgMHg3YjY4ZWUpXG4gICAgICAuc2V0KFwibWVkaXVtc3ByaW5nZ3JlZW5cIiwgMHgwMGZhOWEpXG4gICAgICAuc2V0KFwibWVkaXVtdHVycXVvaXNlXCIsIDB4NDhkMWNjKVxuICAgICAgLnNldChcIm1lZGl1bXZpb2xldHJlZFwiLCAweGM3MTU4NSlcbiAgICAgIC5zZXQoXCJtaWRuaWdodGJsdWVcIiwgMHgxOTE5NzApXG4gICAgICAuc2V0KFwibWludGNyZWFtXCIsIDB4ZjVmZmZhKVxuICAgICAgLnNldChcIm1pc3R5cm9zZVwiLCAweGZmZTRlMSlcbiAgICAgIC5zZXQoXCJtb2NjYXNpblwiLCAweGZmZTRiNSlcbiAgICAgIC5zZXQoXCJuYXZham93aGl0ZVwiLCAweGZmZGVhZClcbiAgICAgIC5zZXQoXCJuYXZ5XCIsIDB4MDAwMDgwKVxuICAgICAgLnNldChcIm9sZGxhY2VcIiwgMHhmZGY1ZTYpXG4gICAgICAuc2V0KFwib2xpdmVcIiwgMHg4MDgwMDApXG4gICAgICAuc2V0KFwib2xpdmVkcmFiXCIsIDB4NmI4ZTIzKVxuICAgICAgLnNldChcIm9yYW5nZVwiLCAweGZmYTUwMClcbiAgICAgIC5zZXQoXCJvcmFuZ2VyZWRcIiwgMHhmZjQ1MDApXG4gICAgICAuc2V0KFwib3JjaGlkXCIsIDB4ZGE3MGQ2KVxuICAgICAgLnNldChcInBhbGVnb2xkZW5yb2RcIiwgMHhlZWU4YWEpXG4gICAgICAuc2V0KFwicGFsZWdyZWVuXCIsIDB4OThmYjk4KVxuICAgICAgLnNldChcInBhbGV0dXJxdW9pc2VcIiwgMHhhZmVlZWUpXG4gICAgICAuc2V0KFwicGFsZXZpb2xldHJlZFwiLCAweGRiNzA5MylcbiAgICAgIC5zZXQoXCJwYXBheWF3aGlwXCIsIDB4ZmZlZmQ1KVxuICAgICAgLnNldChcInBlYWNocHVmZlwiLCAweGZmZGFiOSlcbiAgICAgIC5zZXQoXCJwZXJ1XCIsIDB4Y2Q4NTNmKVxuICAgICAgLnNldChcInBpbmtcIiwgMHhmZmMwY2IpXG4gICAgICAuc2V0KFwicGx1bVwiLCAweGRkYTBkZClcbiAgICAgIC5zZXQoXCJwb3dkZXJibHVlXCIsIDB4YjBlMGU2KVxuICAgICAgLnNldChcInB1cnBsZVwiLCAweDgwMDA4MClcbiAgICAgIC5zZXQoXCJyZWJlY2NhcHVycGxlXCIsIDB4NjYzMzk5KVxuICAgICAgLnNldChcInJlZFwiLCAweGZmMDAwMClcbiAgICAgIC5zZXQoXCJyb3N5YnJvd25cIiwgMHhiYzhmOGYpXG4gICAgICAuc2V0KFwicm95YWxibHVlXCIsIDB4NDE2OWUxKVxuICAgICAgLnNldChcInNhZGRsZWJyb3duXCIsIDB4OGI0NTEzKVxuICAgICAgLnNldChcInNhbG1vblwiLCAweGZhODA3MilcbiAgICAgIC5zZXQoXCJzYW5keWJyb3duXCIsIDB4ZjRhNDYwKVxuICAgICAgLnNldChcInNlYWdyZWVuXCIsIDB4MmU4YjU3KVxuICAgICAgLnNldChcInNlYXNoZWxsXCIsIDB4ZmZmNWVlKVxuICAgICAgLnNldChcInNpZW5uYVwiLCAweGEwNTIyZClcbiAgICAgIC5zZXQoXCJzaWx2ZXJcIiwgMHhjMGMwYzApXG4gICAgICAuc2V0KFwic2t5Ymx1ZVwiLCAweDg3Y2VlYilcbiAgICAgIC5zZXQoXCJzbGF0ZWJsdWVcIiwgMHg2YTVhY2QpXG4gICAgICAuc2V0KFwic2xhdGVncmF5XCIsIDB4NzA4MDkwKVxuICAgICAgLnNldChcInNsYXRlZ3JleVwiLCAweDcwODA5MClcbiAgICAgIC5zZXQoXCJzbm93XCIsIDB4ZmZmYWZhKVxuICAgICAgLnNldChcInNwcmluZ2dyZWVuXCIsIDB4MDBmZjdmKVxuICAgICAgLnNldChcInN0ZWVsYmx1ZVwiLCAweDQ2ODJiNClcbiAgICAgIC5zZXQoXCJ0YW5cIiwgMHhkMmI0OGMpXG4gICAgICAuc2V0KFwidGVhbFwiLCAweDAwODA4MClcbiAgICAgIC5zZXQoXCJ0aGlzdGxlXCIsIDB4ZDhiZmQ4KVxuICAgICAgLnNldChcInRvbWF0b1wiLCAweGZmNjM0NylcbiAgICAgIC5zZXQoXCJ0dXJxdW9pc2VcIiwgMHg0MGUwZDApXG4gICAgICAuc2V0KFwidmlvbGV0XCIsIDB4ZWU4MmVlKVxuICAgICAgLnNldChcIndoZWF0XCIsIDB4ZjVkZWIzKVxuICAgICAgLnNldChcIndoaXRlXCIsIDB4ZmZmZmZmKVxuICAgICAgLnNldChcIndoaXRlc21va2VcIiwgMHhmNWY1ZjUpXG4gICAgICAuc2V0KFwieWVsbG93XCIsIDB4ZmZmZjAwKVxuICAgICAgLnNldChcInllbGxvd2dyZWVuXCIsIDB4OWFjZDMyKTtcblxuICBmdW5jdGlvbiByZ2JuKG4pIHtcbiAgICByZXR1cm4gcmdiKG4gPj4gMTYgJiAweGZmLCBuID4+IDggJiAweGZmLCBuICYgMHhmZik7XG4gIH1cblxuICBmdW5jdGlvbiBIc2woaCwgcywgbCkge1xuICAgIHRoaXMuaCA9ICtoO1xuICAgIHRoaXMucyA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEsICtzKSk7XG4gICAgdGhpcy5sID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgK2wpKTtcbiAgfVxuXG4gIHZhciBwcm90b3R5cGUgPSBIc2wucHJvdG90eXBlID0gbmV3IENvbG9yO1xuXG4gIHByb3RvdHlwZS5icmlnaHRlciA9IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gYnJpZ2h0ZXIgOiBNYXRoLnBvdyhicmlnaHRlciwgayk7XG4gICAgcmV0dXJuIG5ldyBIc2wodGhpcy5oLCB0aGlzLnMsIHRoaXMubCAqIGspO1xuICB9O1xuXG4gIHByb3RvdHlwZS5kYXJrZXIgPSBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGRhcmtlciA6IE1hdGgucG93KGRhcmtlciwgayk7XG4gICAgcmV0dXJuIG5ldyBIc2wodGhpcy5oLCB0aGlzLnMsIHRoaXMubCAqIGspO1xuICB9O1xuXG5cbiAgLyogRnJvbSBGdkQgMTMuMzcsIENTUyBDb2xvciBNb2R1bGUgTGV2ZWwgMyAqL1xuICBmdW5jdGlvbiBoc2wycmdiKGgsIG0xLCBtMikge1xuICAgIHJldHVybiAoaCA8IDYwID8gbTEgKyAobTIgLSBtMSkgKiBoIC8gNjBcbiAgICAgICAgOiBoIDwgMTgwID8gbTJcbiAgICAgICAgOiBoIDwgMjQwID8gbTEgKyAobTIgLSBtMSkgKiAoMjQwIC0gaCkgLyA2MFxuICAgICAgICA6IG0xKSAqIDI1NTtcbiAgfVxuXG4gIHByb3RvdHlwZS5yZ2IgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaCA9IHRoaXMuaCAlIDM2MCArICh0aGlzLmggPCAwKSAqIDM2MCxcbiAgICAgICAgcyA9IGlzTmFOKGgpIHx8IGlzTmFOKHRoaXMucykgPyAwIDogdGhpcy5zLFxuICAgICAgICBsID0gdGhpcy5sLFxuICAgICAgICBtMiA9IGwgPD0gLjUgPyBsICogKDEgKyBzKSA6IGwgKyBzIC0gbCAqIHMsXG4gICAgICAgIG0xID0gMiAqIGwgLSBtMjtcbiAgICByZXR1cm4gbmV3IFJnYihcbiAgICAgIGhzbDJyZ2IoaCA+PSAyNDAgPyBoIC0gMjQwIDogaCArIDEyMCwgbTEsIG0yKSxcbiAgICAgIGhzbDJyZ2IoaCwgbTEsIG0yKSxcbiAgICAgIGhzbDJyZ2IoaCA8IDEyMCA/IGggKyAyNDAgOiBoIC0gMTIwLCBtMSwgbTIpXG4gICAgKTtcbiAgfTtcblxuICBmdW5jdGlvbiBoc2woaCwgcywgbCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAoaCBpbnN0YW5jZW9mIEhzbCkge1xuICAgICAgICBsID0gaC5sO1xuICAgICAgICBzID0gaC5zO1xuICAgICAgICBoID0gaC5oO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCEoaCBpbnN0YW5jZW9mIENvbG9yKSkgaCA9IGNvbG9yKGgpO1xuICAgICAgICBpZiAoaCkge1xuICAgICAgICAgIGlmIChoIGluc3RhbmNlb2YgSHNsKSByZXR1cm4gaDtcbiAgICAgICAgICBoID0gaC5yZ2IoKTtcbiAgICAgICAgICB2YXIgciA9IGguciAvIDI1NSxcbiAgICAgICAgICAgICAgZyA9IGguZyAvIDI1NSxcbiAgICAgICAgICAgICAgYiA9IGguYiAvIDI1NSxcbiAgICAgICAgICAgICAgbWluID0gTWF0aC5taW4ociwgZywgYiksXG4gICAgICAgICAgICAgIG1heCA9IE1hdGgubWF4KHIsIGcsIGIpLFxuICAgICAgICAgICAgICByYW5nZSA9IG1heCAtIG1pbjtcbiAgICAgICAgICBsID0gKG1heCArIG1pbikgLyAyO1xuICAgICAgICAgIGlmIChyYW5nZSkge1xuICAgICAgICAgICAgcyA9IGwgPCAuNSA/IHJhbmdlIC8gKG1heCArIG1pbikgOiByYW5nZSAvICgyIC0gbWF4IC0gbWluKTtcbiAgICAgICAgICAgIGlmIChyID09PSBtYXgpIGggPSAoZyAtIGIpIC8gcmFuZ2UgKyAoZyA8IGIpICogNjtcbiAgICAgICAgICAgIGVsc2UgaWYgKGcgPT09IG1heCkgaCA9IChiIC0gcikgLyByYW5nZSArIDI7XG4gICAgICAgICAgICBlbHNlIGggPSAociAtIGcpIC8gcmFuZ2UgKyA0O1xuICAgICAgICAgICAgaCAqPSA2MDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaCA9IE5hTjtcbiAgICAgICAgICAgIHMgPSBsID4gMCAmJiBsIDwgMSA/IDAgOiBoO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBoID0gcyA9IGwgPSBOYU47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBIc2woaCwgcywgbCk7XG4gIH1cblxuICB2YXIgcmVIc2xQZXJjZW50ID0gL15oc2xcXChcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPylcXHMqLFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KSVcXHMqLFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KSVcXHMqXFwpJC87XG5cbiAgdmFyIHJlUmdiUGVyY2VudCA9IC9ecmdiXFwoXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccypcXCkkLztcblxuICB2YXIgcmVSZ2JJbnRlZ2VyID0gL15yZ2JcXChcXHMqKFstK10/XFxkKylcXHMqLFxccyooWy0rXT9cXGQrKVxccyosXFxzKihbLStdP1xcZCspXFxzKlxcKSQvO1xuXG4gIHZhciByZUhleDYgPSAvXiMoWzAtOWEtZl17Nn0pJC87XG5cbiAgdmFyIHJlSGV4MyA9IC9eIyhbMC05YS1mXXszfSkkLztcblxuICBmdW5jdGlvbiBjb2xvcihmb3JtYXQpIHtcbiAgICB2YXIgbTtcbiAgICBmb3JtYXQgPSAoZm9ybWF0ICsgXCJcIikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIChtID0gcmVIZXgzLmV4ZWMoZm9ybWF0KSkgPyAobSA9IHBhcnNlSW50KG1bMV0sIDE2KSwgcmdiKChtID4+IDggJiAweGYpIHwgKG0gPj4gNCAmIDB4MGYwKSwgKG0gPj4gNCAmIDB4ZikgfCAobSAmIDB4ZjApLCAoKG0gJiAweGYpIDw8IDQpIHwgKG0gJiAweGYpKSkgLy8gI2YwMFxuICAgICAgICA6IChtID0gcmVIZXg2LmV4ZWMoZm9ybWF0KSkgPyByZ2JuKHBhcnNlSW50KG1bMV0sIDE2KSkgLy8gI2ZmMDAwMFxuICAgICAgICA6IChtID0gcmVSZ2JJbnRlZ2VyLmV4ZWMoZm9ybWF0KSkgPyByZ2IobVsxXSwgbVsyXSwgbVszXSkgLy8gcmdiKDI1NSwwLDApXG4gICAgICAgIDogKG0gPSByZVJnYlBlcmNlbnQuZXhlYyhmb3JtYXQpKSA/IHJnYihtWzFdICogMi41NSwgbVsyXSAqIDIuNTUsIG1bM10gKiAyLjU1KSAvLyByZ2IoMTAwJSwwJSwwJSlcbiAgICAgICAgOiAobSA9IHJlSHNsUGVyY2VudC5leGVjKGZvcm1hdCkpID8gaHNsKG1bMV0sIG1bMl0gKiAuMDEsIG1bM10gKiAuMDEpIC8vIGhzbCgxMjAsNTAlLDUwJSlcbiAgICAgICAgOiBuYW1lZC5oYXMoZm9ybWF0KSA/IHJnYm4obmFtZWQuZ2V0KGZvcm1hdCkpXG4gICAgICAgIDogbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJnYihyLCBnLCBiKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGlmICghKHIgaW5zdGFuY2VvZiBDb2xvcikpIHIgPSBjb2xvcihyKTtcbiAgICAgIGlmIChyKSB7XG4gICAgICAgIHIgPSByLnJnYigpO1xuICAgICAgICBiID0gci5iO1xuICAgICAgICBnID0gci5nO1xuICAgICAgICByID0gci5yO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgciA9IGcgPSBiID0gTmFOO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFJnYihyLCBnLCBiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlUmdiKGEsIGIpIHtcbiAgICBhID0gcmdiKGEpO1xuICAgIGIgPSByZ2IoYik7XG4gICAgdmFyIGFyID0gYS5yLFxuICAgICAgICBhZyA9IGEuZyxcbiAgICAgICAgYWIgPSBhLmIsXG4gICAgICAgIGJyID0gYi5yIC0gYXIsXG4gICAgICAgIGJnID0gYi5nIC0gYWcsXG4gICAgICAgIGJiID0gYi5iIC0gYWI7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIHJldHVybiBfZm9ybWF0KE1hdGgucm91bmQoYXIgKyBiciAqIHQpLCBNYXRoLnJvdW5kKGFnICsgYmcgKiB0KSwgTWF0aC5yb3VuZChhYiArIGJiICogdCkpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZTAoYikge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBiO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZTEoYikge1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICByZXR1cm4gYih0KSArIFwiXCI7XG4gICAgfTtcbiAgfVxuXG4gIHZhciByZUEgPSAvWy0rXT8oPzpcXGQrXFwuP1xcZCp8XFwuP1xcZCspKD86W2VFXVstK10/XFxkKyk/L2c7XG4gIHZhciByZUIgPSBuZXcgUmVnRXhwKHJlQS5zb3VyY2UsIFwiZ1wiKTtcblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZVN0cmluZyhhLCBiKSB7XG4gICAgdmFyIGJpID0gcmVBLmxhc3RJbmRleCA9IHJlQi5sYXN0SW5kZXggPSAwLCAvLyBzY2FuIGluZGV4IGZvciBuZXh0IG51bWJlciBpbiBiXG4gICAgICAgIGFtLCAvLyBjdXJyZW50IG1hdGNoIGluIGFcbiAgICAgICAgYm0sIC8vIGN1cnJlbnQgbWF0Y2ggaW4gYlxuICAgICAgICBicywgLy8gc3RyaW5nIHByZWNlZGluZyBjdXJyZW50IG51bWJlciBpbiBiLCBpZiBhbnlcbiAgICAgICAgaSA9IC0xLCAvLyBpbmRleCBpbiBzXG4gICAgICAgIHMgPSBbXSwgLy8gc3RyaW5nIGNvbnN0YW50cyBhbmQgcGxhY2Vob2xkZXJzXG4gICAgICAgIHEgPSBbXTsgLy8gbnVtYmVyIGludGVycG9sYXRvcnNcblxuICAgIC8vIENvZXJjZSBpbnB1dHMgdG8gc3RyaW5ncy5cbiAgICBhID0gYSArIFwiXCIsIGIgPSBiICsgXCJcIjtcblxuICAgIC8vIEludGVycG9sYXRlIHBhaXJzIG9mIG51bWJlcnMgaW4gYSAmIGIuXG4gICAgd2hpbGUgKChhbSA9IHJlQS5leGVjKGEpKVxuICAgICAgICAmJiAoYm0gPSByZUIuZXhlYyhiKSkpIHtcbiAgICAgIGlmICgoYnMgPSBibS5pbmRleCkgPiBiaSkgeyAvLyBhIHN0cmluZyBwcmVjZWRlcyB0aGUgbmV4dCBudW1iZXIgaW4gYlxuICAgICAgICBicyA9IGIuc2xpY2UoYmksIGJzKTtcbiAgICAgICAgaWYgKHNbaV0pIHNbaV0gKz0gYnM7IC8vIGNvYWxlc2NlIHdpdGggcHJldmlvdXMgc3RyaW5nXG4gICAgICAgIGVsc2Ugc1srK2ldID0gYnM7XG4gICAgICB9XG4gICAgICBpZiAoKGFtID0gYW1bMF0pID09PSAoYm0gPSBibVswXSkpIHsgLy8gbnVtYmVycyBpbiBhICYgYiBtYXRjaFxuICAgICAgICBpZiAoc1tpXSkgc1tpXSArPSBibTsgLy8gY29hbGVzY2Ugd2l0aCBwcmV2aW91cyBzdHJpbmdcbiAgICAgICAgZWxzZSBzWysraV0gPSBibTtcbiAgICAgIH0gZWxzZSB7IC8vIGludGVycG9sYXRlIG5vbi1tYXRjaGluZyBudW1iZXJzXG4gICAgICAgIHNbKytpXSA9IG51bGw7XG4gICAgICAgIHEucHVzaCh7aTogaSwgeDogaW50ZXJwb2xhdGVOdW1iZXIoYW0sIGJtKX0pO1xuICAgICAgfVxuICAgICAgYmkgPSByZUIubGFzdEluZGV4O1xuICAgIH1cblxuICAgIC8vIEFkZCByZW1haW5zIG9mIGIuXG4gICAgaWYgKGJpIDwgYi5sZW5ndGgpIHtcbiAgICAgIGJzID0gYi5zbGljZShiaSk7XG4gICAgICBpZiAoc1tpXSkgc1tpXSArPSBiczsgLy8gY29hbGVzY2Ugd2l0aCBwcmV2aW91cyBzdHJpbmdcbiAgICAgIGVsc2Ugc1srK2ldID0gYnM7XG4gICAgfVxuXG4gICAgLy8gU3BlY2lhbCBvcHRpbWl6YXRpb24gZm9yIG9ubHkgYSBzaW5nbGUgbWF0Y2guXG4gICAgLy8gT3RoZXJ3aXNlLCBpbnRlcnBvbGF0ZSBlYWNoIG9mIHRoZSBudW1iZXJzIGFuZCByZWpvaW4gdGhlIHN0cmluZy5cbiAgICByZXR1cm4gcy5sZW5ndGggPCAyID8gKHFbMF1cbiAgICAgICAgPyBpbnRlcnBvbGF0ZTEocVswXS54KVxuICAgICAgICA6IGludGVycG9sYXRlMChiKSlcbiAgICAgICAgOiAoYiA9IHEubGVuZ3RoLCBmdW5jdGlvbih0KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbzsgaSA8IGI7ICsraSkgc1sobyA9IHFbaV0pLmldID0gby54KHQpO1xuICAgICAgICAgICAgcmV0dXJuIHMuam9pbihcIlwiKTtcbiAgICAgICAgICB9KTtcbiAgfVxuXG4gIHZhciBpbnRlcnBvbGF0b3JzID0gW1xuICAgIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHZhciB0ID0gdHlwZW9mIGIsIGM7XG4gICAgICByZXR1cm4gKHQgPT09IFwic3RyaW5nXCIgPyAoKGMgPSBjb2xvcihiKSkgPyAoYiA9IGMsIGludGVycG9sYXRlUmdiKSA6IGludGVycG9sYXRlU3RyaW5nKVxuICAgICAgICAgIDogYiBpbnN0YW5jZW9mIGNvbG9yID8gaW50ZXJwb2xhdGVSZ2JcbiAgICAgICAgICA6IEFycmF5LmlzQXJyYXkoYikgPyBpbnRlcnBvbGF0ZUFycmF5XG4gICAgICAgICAgOiB0ID09PSBcIm9iamVjdFwiICYmIGlzTmFOKGIpID8gaW50ZXJwb2xhdGVPYmplY3RcbiAgICAgICAgICA6IGludGVycG9sYXRlTnVtYmVyKShhLCBiKTtcbiAgICB9XG4gIF07XG5cbiAgZnVuY3Rpb24gaW50ZXJwb2xhdGUoYSwgYikge1xuICAgIHZhciBpID0gaW50ZXJwb2xhdG9ycy5sZW5ndGgsIGY7XG4gICAgd2hpbGUgKC0taSA+PSAwICYmICEoZiA9IGludGVycG9sYXRvcnNbaV0oYSwgYikpKTtcbiAgICByZXR1cm4gZjtcbiAgfVxuXG4gIHZhciBlMiA9IE1hdGguc3FydCgyKTtcblxuICB2YXIgZTUgPSBNYXRoLnNxcnQoMTApO1xuXG4gIHZhciBlMTAgPSBNYXRoLnNxcnQoNTApO1xuXG4gIGZ1bmN0aW9uIHRpY2tSYW5nZShkb21haW4sIGNvdW50KSB7XG4gICAgaWYgKGNvdW50ID09IG51bGwpIGNvdW50ID0gMTA7XG5cbiAgICB2YXIgc3RhcnQgPSBkb21haW5bMF0sXG4gICAgICAgIHN0b3AgPSBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdO1xuXG4gICAgaWYgKHN0b3AgPCBzdGFydCkgZXJyb3IgPSBzdG9wLCBzdG9wID0gc3RhcnQsIHN0YXJ0ID0gZXJyb3I7XG5cbiAgICB2YXIgc3BhbiA9IHN0b3AgLSBzdGFydCxcbiAgICAgICAgc3RlcCA9IE1hdGgucG93KDEwLCBNYXRoLmZsb29yKE1hdGgubG9nKHNwYW4gLyBjb3VudCkgLyBNYXRoLkxOMTApKSxcbiAgICAgICAgZXJyb3IgPSBzcGFuIC8gY291bnQgLyBzdGVwO1xuXG4gICAgLy8gRmlsdGVyIHRpY2tzIHRvIGdldCBjbG9zZXIgdG8gdGhlIGRlc2lyZWQgY291bnQuXG4gICAgaWYgKGVycm9yID49IGUxMCkgc3RlcCAqPSAxMDtcbiAgICBlbHNlIGlmIChlcnJvciA+PSBlNSkgc3RlcCAqPSA1O1xuICAgIGVsc2UgaWYgKGVycm9yID49IGUyKSBzdGVwICo9IDI7XG5cbiAgICAvLyBSb3VuZCBzdGFydCBhbmQgc3RvcCB2YWx1ZXMgdG8gc3RlcCBpbnRlcnZhbC5cbiAgICByZXR1cm4gW1xuICAgICAgTWF0aC5jZWlsKHN0YXJ0IC8gc3RlcCkgKiBzdGVwLFxuICAgICAgTWF0aC5mbG9vcihzdG9wIC8gc3RlcCkgKiBzdGVwICsgc3RlcCAvIDIsIC8vIGluY2x1c2l2ZVxuICAgICAgc3RlcFxuICAgIF07XG4gIH1cblxuICBmdW5jdGlvbiBuaWNlKGRvbWFpbiwgc3RlcCkge1xuICAgIGRvbWFpbiA9IGRvbWFpbi5zbGljZSgpO1xuICAgIGlmICghc3RlcCkgcmV0dXJuIGRvbWFpbjtcblxuICAgIHZhciBpMCA9IDAsXG4gICAgICAgIGkxID0gZG9tYWluLmxlbmd0aCAtIDEsXG4gICAgICAgIHgwID0gZG9tYWluW2kwXSxcbiAgICAgICAgeDEgPSBkb21haW5baTFdLFxuICAgICAgICBkeDtcblxuICAgIGlmICh4MSA8IHgwKSB7XG4gICAgICBkeCA9IGkwLCBpMCA9IGkxLCBpMSA9IGR4O1xuICAgICAgZHggPSB4MCwgeDAgPSB4MSwgeDEgPSBkeDtcbiAgICB9XG5cbiAgICBkb21haW5baTBdID0gTWF0aC5mbG9vcih4MCAvIHN0ZXApICogc3RlcDtcbiAgICBkb21haW5baTFdID0gTWF0aC5jZWlsKHgxIC8gc3RlcCkgKiBzdGVwO1xuICAgIHJldHVybiBkb21haW47XG4gIH1cblxuICB2YXIgcHJlZml4ZXMgPSBbXCJ5XCIsXCJ6XCIsXCJhXCIsXCJmXCIsXCJwXCIsXCJuXCIsXCLCtVwiLFwibVwiLFwiXCIsXCJrXCIsXCJNXCIsXCJHXCIsXCJUXCIsXCJQXCIsXCJFXCIsXCJaXCIsXCJZXCJdO1xuXG5cbiAgLy8gQ29tcHV0ZXMgdGhlIGRlY2ltYWwgY29lZmZpY2llbnQgYW5kIGV4cG9uZW50IG9mIHRoZSBzcGVjaWZpZWQgbnVtYmVyIHggd2l0aFxuICAvLyBzaWduaWZpY2FudCBkaWdpdHMgcCwgd2hlcmUgeCBpcyBwb3NpdGl2ZSBhbmQgcCBpcyBpbiBbMSwgMjFdIG9yIHVuZGVmaW5lZC5cbiAgLy8gRm9yIGV4YW1wbGUsIGZvcm1hdERlY2ltYWwoMS4yMykgcmV0dXJucyBbXCIxMjNcIiwgMF0uXG4gIGZ1bmN0aW9uIGZvcm1hdERlY2ltYWwoeCwgcCkge1xuICAgIGlmICgoaSA9ICh4ID0geC50b0V4cG9uZW50aWFsKHAgJiYgcCAtIDEpKS5pbmRleE9mKFwiZVwiKSkgPCAwKSByZXR1cm4gbnVsbDsgLy8gTmFOLCDCsUluZmluaXR5XG4gICAgdmFyIGksIGNvZWZmaWNpZW50ID0geC5zbGljZSgwLCBpKTtcblxuICAgIC8vIFRoZSBzdHJpbmcgcmV0dXJuZWQgYnkgdG9FeHBvbmVudGlhbCBlaXRoZXIgaGFzIHRoZSBmb3JtIFxcZFxcLlxcZCtlWy0rXVxcZCtcbiAgICAvLyAoZS5nLiwgMS4yZSszKSBvciB0aGUgZm9ybSBcXGRlWy0rXVxcZCsgKGUuZy4sIDFlKzMpLlxuICAgIHJldHVybiBbXG4gICAgICBjb2VmZmljaWVudC5sZW5ndGggPiAxID8gY29lZmZpY2llbnRbMF0gKyBjb2VmZmljaWVudC5zbGljZSgyKSA6IGNvZWZmaWNpZW50LFxuICAgICAgK3guc2xpY2UoaSArIDEpXG4gICAgXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGV4cG9uZW50KHgpIHtcbiAgICByZXR1cm4geCA9IGZvcm1hdERlY2ltYWwoTWF0aC5hYnMoeCkpLCB4ID8geFsxXSA6IE5hTjtcbiAgfVxuXG4gIHZhciBwcmVmaXhFeHBvbmVudDtcblxuICBmdW5jdGlvbiBmb3JtYXRQcmVmaXhBdXRvKHgsIHApIHtcbiAgICB2YXIgZCA9IGZvcm1hdERlY2ltYWwoeCwgcCk7XG4gICAgaWYgKCFkKSByZXR1cm4geCArIFwiXCI7XG4gICAgdmFyIGNvZWZmaWNpZW50ID0gZFswXSxcbiAgICAgICAgZXhwb25lbnQgPSBkWzFdLFxuICAgICAgICBpID0gZXhwb25lbnQgLSAocHJlZml4RXhwb25lbnQgPSBNYXRoLm1heCgtOCwgTWF0aC5taW4oOCwgTWF0aC5mbG9vcihleHBvbmVudCAvIDMpKSkgKiAzKSArIDEsXG4gICAgICAgIG4gPSBjb2VmZmljaWVudC5sZW5ndGg7XG4gICAgcmV0dXJuIGkgPT09IG4gPyBjb2VmZmljaWVudFxuICAgICAgICA6IGkgPiBuID8gY29lZmZpY2llbnQgKyBuZXcgQXJyYXkoaSAtIG4gKyAxKS5qb2luKFwiMFwiKVxuICAgICAgICA6IGkgPiAwID8gY29lZmZpY2llbnQuc2xpY2UoMCwgaSkgKyBcIi5cIiArIGNvZWZmaWNpZW50LnNsaWNlKGkpXG4gICAgICAgIDogXCIwLlwiICsgbmV3IEFycmF5KDEgLSBpKS5qb2luKFwiMFwiKSArIGZvcm1hdERlY2ltYWwoeCwgcCArIGkgLSAxKVswXTsgLy8gbGVzcyB0aGFuIDF5IVxuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0Um91bmRlZCh4LCBwKSB7XG4gICAgdmFyIGQgPSBmb3JtYXREZWNpbWFsKHgsIHApO1xuICAgIGlmICghZCkgcmV0dXJuIHggKyBcIlwiO1xuICAgIHZhciBjb2VmZmljaWVudCA9IGRbMF0sXG4gICAgICAgIGV4cG9uZW50ID0gZFsxXTtcbiAgICByZXR1cm4gZXhwb25lbnQgPCAwID8gXCIwLlwiICsgbmV3IEFycmF5KC1leHBvbmVudCkuam9pbihcIjBcIikgKyBjb2VmZmljaWVudFxuICAgICAgICA6IGNvZWZmaWNpZW50Lmxlbmd0aCA+IGV4cG9uZW50ICsgMSA/IGNvZWZmaWNpZW50LnNsaWNlKDAsIGV4cG9uZW50ICsgMSkgKyBcIi5cIiArIGNvZWZmaWNpZW50LnNsaWNlKGV4cG9uZW50ICsgMSlcbiAgICAgICAgOiBjb2VmZmljaWVudCArIG5ldyBBcnJheShleHBvbmVudCAtIGNvZWZmaWNpZW50Lmxlbmd0aCArIDIpLmpvaW4oXCIwXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0RGVmYXVsdCh4LCBwKSB7XG4gICAgeCA9IHgudG9QcmVjaXNpb24ocCk7XG5cbiAgICBvdXQ6IGZvciAodmFyIG4gPSB4Lmxlbmd0aCwgaSA9IDEsIGkwID0gLTEsIGkxOyBpIDwgbjsgKytpKSB7XG4gICAgICBzd2l0Y2ggKHhbaV0pIHtcbiAgICAgICAgY2FzZSBcIi5cIjogaTAgPSBpMSA9IGk7IGJyZWFrO1xuICAgICAgICBjYXNlIFwiMFwiOiBpZiAoaTAgPT09IDApIGkwID0gaTsgaTEgPSBpOyBicmVhaztcbiAgICAgICAgY2FzZSBcImVcIjogYnJlYWsgb3V0O1xuICAgICAgICBkZWZhdWx0OiBpZiAoaTAgPiAwKSBpMCA9IDA7IGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpMCA+IDAgPyB4LnNsaWNlKDAsIGkwKSArIHguc2xpY2UoaTEgKyAxKSA6IHg7XG4gIH1cblxuICB2YXIgZm9ybWF0VHlwZXMgPSB7XG4gICAgXCJcIjogZm9ybWF0RGVmYXVsdCxcbiAgICBcIiVcIjogZnVuY3Rpb24oeCwgcCkgeyByZXR1cm4gKHggKiAxMDApLnRvRml4ZWQocCk7IH0sXG4gICAgXCJiXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoMik7IH0sXG4gICAgXCJjXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggKyBcIlwiOyB9LFxuICAgIFwiZFwiOiBmdW5jdGlvbih4KSB7IHJldHVybiBNYXRoLnJvdW5kKHgpLnRvU3RyaW5nKDEwKTsgfSxcbiAgICBcImVcIjogZnVuY3Rpb24oeCwgcCkgeyByZXR1cm4geC50b0V4cG9uZW50aWFsKHApOyB9LFxuICAgIFwiZlwiOiBmdW5jdGlvbih4LCBwKSB7IHJldHVybiB4LnRvRml4ZWQocCk7IH0sXG4gICAgXCJnXCI6IGZ1bmN0aW9uKHgsIHApIHsgcmV0dXJuIHgudG9QcmVjaXNpb24ocCk7IH0sXG4gICAgXCJvXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoOCk7IH0sXG4gICAgXCJwXCI6IGZ1bmN0aW9uKHgsIHApIHsgcmV0dXJuIGZvcm1hdFJvdW5kZWQoeCAqIDEwMCwgcCk7IH0sXG4gICAgXCJyXCI6IGZvcm1hdFJvdW5kZWQsXG4gICAgXCJzXCI6IGZvcm1hdFByZWZpeEF1dG8sXG4gICAgXCJYXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7IH0sXG4gICAgXCJ4XCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoMTYpOyB9XG4gIH07XG5cblxuICAvLyBbW2ZpbGxdYWxpZ25dW3NpZ25dW3N5bWJvbF1bMF1bd2lkdGhdWyxdWy5wcmVjaXNpb25dW3R5cGVdXG4gIHZhciByZSA9IC9eKD86KC4pPyhbPD49Xl0pKT8oWytcXC1cXCggXSk/KFskI10pPygwKT8oXFxkKyk/KCwpPyhcXC5cXGQrKT8oW2EteiVdKT8kL2k7XG5cbiAgZnVuY3Rpb24gRm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllcikge1xuICAgIGlmICghKG1hdGNoID0gcmUuZXhlYyhzcGVjaWZpZXIpKSkgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBmb3JtYXQ6IFwiICsgc3BlY2lmaWVyKTtcblxuICAgIHZhciBtYXRjaCxcbiAgICAgICAgZmlsbCA9IG1hdGNoWzFdIHx8IFwiIFwiLFxuICAgICAgICBhbGlnbiA9IG1hdGNoWzJdIHx8IFwiPlwiLFxuICAgICAgICBzaWduID0gbWF0Y2hbM10gfHwgXCItXCIsXG4gICAgICAgIHN5bWJvbCA9IG1hdGNoWzRdIHx8IFwiXCIsXG4gICAgICAgIHplcm8gPSAhIW1hdGNoWzVdLFxuICAgICAgICB3aWR0aCA9IG1hdGNoWzZdICYmICttYXRjaFs2XSxcbiAgICAgICAgY29tbWEgPSAhIW1hdGNoWzddLFxuICAgICAgICBwcmVjaXNpb24gPSBtYXRjaFs4XSAmJiArbWF0Y2hbOF0uc2xpY2UoMSksXG4gICAgICAgIHR5cGUgPSBtYXRjaFs5XSB8fCBcIlwiO1xuXG4gICAgLy8gVGhlIFwiblwiIHR5cGUgaXMgYW4gYWxpYXMgZm9yIFwiLGdcIi5cbiAgICBpZiAodHlwZSA9PT0gXCJuXCIpIGNvbW1hID0gdHJ1ZSwgdHlwZSA9IFwiZ1wiO1xuXG4gICAgLy8gTWFwIGludmFsaWQgdHlwZXMgdG8gdGhlIGRlZmF1bHQgZm9ybWF0LlxuICAgIGVsc2UgaWYgKCFmb3JtYXRUeXBlc1t0eXBlXSkgdHlwZSA9IFwiXCI7XG5cbiAgICAvLyBJZiB6ZXJvIGZpbGwgaXMgc3BlY2lmaWVkLCBwYWRkaW5nIGdvZXMgYWZ0ZXIgc2lnbiBhbmQgYmVmb3JlIGRpZ2l0cy5cbiAgICBpZiAoemVybyB8fCAoZmlsbCA9PT0gXCIwXCIgJiYgYWxpZ24gPT09IFwiPVwiKSkgemVybyA9IHRydWUsIGZpbGwgPSBcIjBcIiwgYWxpZ24gPSBcIj1cIjtcblxuICAgIHRoaXMuZmlsbCA9IGZpbGw7XG4gICAgdGhpcy5hbGlnbiA9IGFsaWduO1xuICAgIHRoaXMuc2lnbiA9IHNpZ247XG4gICAgdGhpcy5zeW1ib2wgPSBzeW1ib2w7XG4gICAgdGhpcy56ZXJvID0gemVybztcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5jb21tYSA9IGNvbW1hO1xuICAgIHRoaXMucHJlY2lzaW9uID0gcHJlY2lzaW9uO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gIH1cblxuICBGb3JtYXRTcGVjaWZpZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsbFxuICAgICAgICArIHRoaXMuYWxpZ25cbiAgICAgICAgKyB0aGlzLnNpZ25cbiAgICAgICAgKyB0aGlzLnN5bWJvbFxuICAgICAgICArICh0aGlzLnplcm8gPyBcIjBcIiA6IFwiXCIpXG4gICAgICAgICsgKHRoaXMud2lkdGggPT0gbnVsbCA/IFwiXCIgOiBNYXRoLm1heCgxLCB0aGlzLndpZHRoIHwgMCkpXG4gICAgICAgICsgKHRoaXMuY29tbWEgPyBcIixcIiA6IFwiXCIpXG4gICAgICAgICsgKHRoaXMucHJlY2lzaW9uID09IG51bGwgPyBcIlwiIDogXCIuXCIgKyBNYXRoLm1heCgwLCB0aGlzLnByZWNpc2lvbiB8IDApKVxuICAgICAgICArIHRoaXMudHlwZTtcbiAgfTtcblxuICBmdW5jdGlvbiBmb3JtYXRTcGVjaWZpZXIoc3BlY2lmaWVyKSB7XG4gICAgcmV0dXJuIG5ldyBGb3JtYXRTcGVjaWZpZXIoc3BlY2lmaWVyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9pZGVudGl0eSh4KSB7XG4gICAgcmV0dXJuIHg7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRHcm91cChncm91cGluZywgdGhvdXNhbmRzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCB3aWR0aCkge1xuICAgICAgdmFyIGkgPSB2YWx1ZS5sZW5ndGgsXG4gICAgICAgICAgdCA9IFtdLFxuICAgICAgICAgIGogPSAwLFxuICAgICAgICAgIGcgPSBncm91cGluZ1swXSxcbiAgICAgICAgICBsZW5ndGggPSAwO1xuXG4gICAgICB3aGlsZSAoaSA+IDAgJiYgZyA+IDApIHtcbiAgICAgICAgaWYgKGxlbmd0aCArIGcgKyAxID4gd2lkdGgpIGcgPSBNYXRoLm1heCgxLCB3aWR0aCAtIGxlbmd0aCk7XG4gICAgICAgIHQucHVzaCh2YWx1ZS5zdWJzdHJpbmcoaSAtPSBnLCBpICsgZykpO1xuICAgICAgICBpZiAoKGxlbmd0aCArPSBnICsgMSkgPiB3aWR0aCkgYnJlYWs7XG4gICAgICAgIGcgPSBncm91cGluZ1tqID0gKGogKyAxKSAlIGdyb3VwaW5nLmxlbmd0aF07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0LnJldmVyc2UoKS5qb2luKHRob3VzYW5kcyk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxvY2FsZUZvcm1hdChsb2NhbGUpIHtcbiAgICB2YXIgZ3JvdXAgPSBsb2NhbGUuZ3JvdXBpbmcgJiYgbG9jYWxlLnRob3VzYW5kcyA/IGZvcm1hdEdyb3VwKGxvY2FsZS5ncm91cGluZywgbG9jYWxlLnRob3VzYW5kcykgOiBfaWRlbnRpdHksXG4gICAgICAgIGN1cnJlbmN5ID0gbG9jYWxlLmN1cnJlbmN5LFxuICAgICAgICBkZWNpbWFsID0gbG9jYWxlLmRlY2ltYWw7XG5cbiAgICBmdW5jdGlvbiBmb3JtYXQoc3BlY2lmaWVyKSB7XG4gICAgICBzcGVjaWZpZXIgPSBmb3JtYXRTcGVjaWZpZXIoc3BlY2lmaWVyKTtcblxuICAgICAgdmFyIGZpbGwgPSBzcGVjaWZpZXIuZmlsbCxcbiAgICAgICAgICBhbGlnbiA9IHNwZWNpZmllci5hbGlnbixcbiAgICAgICAgICBzaWduID0gc3BlY2lmaWVyLnNpZ24sXG4gICAgICAgICAgc3ltYm9sID0gc3BlY2lmaWVyLnN5bWJvbCxcbiAgICAgICAgICB6ZXJvID0gc3BlY2lmaWVyLnplcm8sXG4gICAgICAgICAgd2lkdGggPSBzcGVjaWZpZXIud2lkdGgsXG4gICAgICAgICAgY29tbWEgPSBzcGVjaWZpZXIuY29tbWEsXG4gICAgICAgICAgcHJlY2lzaW9uID0gc3BlY2lmaWVyLnByZWNpc2lvbixcbiAgICAgICAgICB0eXBlID0gc3BlY2lmaWVyLnR5cGU7XG5cbiAgICAgIC8vIENvbXB1dGUgdGhlIHByZWZpeCBhbmQgc3VmZml4LlxuICAgICAgLy8gRm9yIFNJLXByZWZpeCwgdGhlIHN1ZmZpeCBpcyBsYXppbHkgY29tcHV0ZWQuXG4gICAgICB2YXIgcHJlZml4ID0gc3ltYm9sID09PSBcIiRcIiA/IGN1cnJlbmN5WzBdIDogc3ltYm9sID09PSBcIiNcIiAmJiAvW2JveFhdLy50ZXN0KHR5cGUpID8gXCIwXCIgKyB0eXBlLnRvTG93ZXJDYXNlKCkgOiBcIlwiLFxuICAgICAgICAgIHN1ZmZpeCA9IHN5bWJvbCA9PT0gXCIkXCIgPyBjdXJyZW5jeVsxXSA6IC9bJXBdLy50ZXN0KHR5cGUpID8gXCIlXCIgOiBcIlwiO1xuXG4gICAgICAvLyBXaGF0IGZvcm1hdCBmdW5jdGlvbiBzaG91bGQgd2UgdXNlP1xuICAgICAgLy8gSXMgdGhpcyBhbiBpbnRlZ2VyIHR5cGU/XG4gICAgICAvLyBDYW4gdGhpcyB0eXBlIGdlbmVyYXRlIGV4cG9uZW50aWFsIG5vdGF0aW9uP1xuICAgICAgdmFyIGZvcm1hdFR5cGUgPSBmb3JtYXRUeXBlc1t0eXBlXSxcbiAgICAgICAgICBtYXliZVN1ZmZpeCA9ICF0eXBlIHx8IC9bZGVmZ3BycyVdLy50ZXN0KHR5cGUpO1xuXG4gICAgICAvLyBTZXQgdGhlIGRlZmF1bHQgcHJlY2lzaW9uIGlmIG5vdCBzcGVjaWZpZWQsXG4gICAgICAvLyBvciBjbGFtcCB0aGUgc3BlY2lmaWVkIHByZWNpc2lvbiB0byB0aGUgc3VwcG9ydGVkIHJhbmdlLlxuICAgICAgLy8gRm9yIHNpZ25pZmljYW50IHByZWNpc2lvbiwgaXQgbXVzdCBiZSBpbiBbMSwgMjFdLlxuICAgICAgLy8gRm9yIGZpeGVkIHByZWNpc2lvbiwgaXQgbXVzdCBiZSBpbiBbMCwgMjBdLlxuICAgICAgcHJlY2lzaW9uID0gcHJlY2lzaW9uID09IG51bGwgPyAodHlwZSA/IDYgOiAxMilcbiAgICAgICAgICA6IC9bZ3Byc10vLnRlc3QodHlwZSkgPyBNYXRoLm1heCgxLCBNYXRoLm1pbigyMSwgcHJlY2lzaW9uKSlcbiAgICAgICAgICA6IE1hdGgubWF4KDAsIE1hdGgubWluKDIwLCBwcmVjaXNpb24pKTtcblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHZhciB2YWx1ZVByZWZpeCA9IHByZWZpeCxcbiAgICAgICAgICAgIHZhbHVlU3VmZml4ID0gc3VmZml4O1xuXG4gICAgICAgIGlmICh0eXBlID09PSBcImNcIikge1xuICAgICAgICAgIHZhbHVlU3VmZml4ID0gZm9ybWF0VHlwZSh2YWx1ZSkgKyB2YWx1ZVN1ZmZpeDtcbiAgICAgICAgICB2YWx1ZSA9IFwiXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSArdmFsdWU7XG5cbiAgICAgICAgICAvLyBDb252ZXJ0IG5lZ2F0aXZlIHRvIHBvc2l0aXZlLCBhbmQgY29tcHV0ZSB0aGUgcHJlZml4LlxuICAgICAgICAgIC8vIE5vdGUgdGhhdCAtMCBpcyBub3QgbGVzcyB0aGFuIDAsIGJ1dCAxIC8gLTAgaXMhXG4gICAgICAgICAgdmFyIHZhbHVlTmVnYXRpdmUgPSAodmFsdWUgPCAwIHx8IDEgLyB2YWx1ZSA8IDApICYmICh2YWx1ZSAqPSAtMSwgdHJ1ZSk7XG5cbiAgICAgICAgICAvLyBQZXJmb3JtIHRoZSBpbml0aWFsIGZvcm1hdHRpbmcuXG4gICAgICAgICAgdmFsdWUgPSBmb3JtYXRUeXBlKHZhbHVlLCBwcmVjaXNpb24pO1xuXG4gICAgICAgICAgLy8gQ29tcHV0ZSB0aGUgcHJlZml4IGFuZCBzdWZmaXguXG4gICAgICAgICAgdmFsdWVQcmVmaXggPSAodmFsdWVOZWdhdGl2ZSA/IChzaWduID09PSBcIihcIiA/IHNpZ24gOiBcIi1cIikgOiBzaWduID09PSBcIi1cIiB8fCBzaWduID09PSBcIihcIiA/IFwiXCIgOiBzaWduKSArIHZhbHVlUHJlZml4O1xuICAgICAgICAgIHZhbHVlU3VmZml4ID0gdmFsdWVTdWZmaXggKyAodHlwZSA9PT0gXCJzXCIgPyBwcmVmaXhlc1s4ICsgcHJlZml4RXhwb25lbnQgLyAzXSA6IFwiXCIpICsgKHZhbHVlTmVnYXRpdmUgJiYgc2lnbiA9PT0gXCIoXCIgPyBcIilcIiA6IFwiXCIpO1xuXG4gICAgICAgICAgLy8gQnJlYWsgdGhlIGZvcm1hdHRlZCB2YWx1ZSBpbnRvIHRoZSBpbnRlZ2VyIOKAnHZhbHVl4oCdIHBhcnQgdGhhdCBjYW4gYmVcbiAgICAgICAgICAvLyBncm91cGVkLCBhbmQgZnJhY3Rpb25hbCBvciBleHBvbmVudGlhbCDigJxzdWZmaXjigJ0gcGFydCB0aGF0IGlzIG5vdC5cbiAgICAgICAgICBpZiAobWF5YmVTdWZmaXgpIHtcbiAgICAgICAgICAgIHZhciBpID0gLTEsIG4gPSB2YWx1ZS5sZW5ndGgsIGM7XG4gICAgICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgICAgICBpZiAoYyA9IHZhbHVlLmNoYXJDb2RlQXQoaSksIDQ4ID4gYyB8fCBjID4gNTcpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVN1ZmZpeCA9IChjID09PSA0NiA/IGRlY2ltYWwgKyB2YWx1ZS5zbGljZShpICsgMSkgOiB2YWx1ZS5zbGljZShpKSkgKyB2YWx1ZVN1ZmZpeDtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKDAsIGkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlIGZpbGwgY2hhcmFjdGVyIGlzIG5vdCBcIjBcIiwgZ3JvdXBpbmcgaXMgYXBwbGllZCBiZWZvcmUgcGFkZGluZy5cbiAgICAgICAgaWYgKGNvbW1hICYmICF6ZXJvKSB2YWx1ZSA9IGdyb3VwKHZhbHVlLCBJbmZpbml0eSk7XG5cbiAgICAgICAgLy8gQ29tcHV0ZSB0aGUgcGFkZGluZy5cbiAgICAgICAgdmFyIGxlbmd0aCA9IHZhbHVlUHJlZml4Lmxlbmd0aCArIHZhbHVlLmxlbmd0aCArIHZhbHVlU3VmZml4Lmxlbmd0aCxcbiAgICAgICAgICAgIHBhZGRpbmcgPSBsZW5ndGggPCB3aWR0aCA/IG5ldyBBcnJheSh3aWR0aCAtIGxlbmd0aCArIDEpLmpvaW4oZmlsbCkgOiBcIlwiO1xuXG4gICAgICAgIC8vIElmIHRoZSBmaWxsIGNoYXJhY3RlciBpcyBcIjBcIiwgZ3JvdXBpbmcgaXMgYXBwbGllZCBhZnRlciBwYWRkaW5nLlxuICAgICAgICBpZiAoY29tbWEgJiYgemVybykgdmFsdWUgPSBncm91cChwYWRkaW5nICsgdmFsdWUsIHBhZGRpbmcubGVuZ3RoID8gd2lkdGggLSB2YWx1ZVN1ZmZpeC5sZW5ndGggOiBJbmZpbml0eSksIHBhZGRpbmcgPSBcIlwiO1xuXG4gICAgICAgIC8vIFJlY29uc3RydWN0IHRoZSBmaW5hbCBvdXRwdXQgYmFzZWQgb24gdGhlIGRlc2lyZWQgYWxpZ25tZW50LlxuICAgICAgICBzd2l0Y2ggKGFsaWduKSB7XG4gICAgICAgICAgY2FzZSBcIjxcIjogcmV0dXJuIHZhbHVlUHJlZml4ICsgdmFsdWUgKyB2YWx1ZVN1ZmZpeCArIHBhZGRpbmc7XG4gICAgICAgICAgY2FzZSBcIj1cIjogcmV0dXJuIHZhbHVlUHJlZml4ICsgcGFkZGluZyArIHZhbHVlICsgdmFsdWVTdWZmaXg7XG4gICAgICAgICAgY2FzZSBcIl5cIjogcmV0dXJuIHBhZGRpbmcuc2xpY2UoMCwgbGVuZ3RoID0gcGFkZGluZy5sZW5ndGggPj4gMSkgKyB2YWx1ZVByZWZpeCArIHZhbHVlICsgdmFsdWVTdWZmaXggKyBwYWRkaW5nLnNsaWNlKGxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhZGRpbmcgKyB2YWx1ZVByZWZpeCArIHZhbHVlICsgdmFsdWVTdWZmaXg7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFByZWZpeChzcGVjaWZpZXIsIHZhbHVlKSB7XG4gICAgICB2YXIgZiA9IGZvcm1hdCgoc3BlY2lmaWVyID0gZm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllciksIHNwZWNpZmllci50eXBlID0gXCJmXCIsIHNwZWNpZmllcikpLFxuICAgICAgICAgIGUgPSBNYXRoLm1heCgtOCwgTWF0aC5taW4oOCwgTWF0aC5mbG9vcihleHBvbmVudCh2YWx1ZSkgLyAzKSkpICogMyxcbiAgICAgICAgICBrID0gTWF0aC5wb3coMTAsIC1lKSxcbiAgICAgICAgICBwcmVmaXggPSBwcmVmaXhlc1s4ICsgZSAvIDNdO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmKGsgKiB2YWx1ZSkgKyBwcmVmaXg7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBmb3JtYXQ6IGZvcm1hdCxcbiAgICAgIGZvcm1hdFByZWZpeDogZm9ybWF0UHJlZml4XG4gICAgfTtcbiAgfVxuXG4gIHZhciBsb2NhbGUgPSBsb2NhbGVGb3JtYXQoe1xuICAgIGRlY2ltYWw6IFwiLlwiLFxuICAgIHRob3VzYW5kczogXCIsXCIsXG4gICAgZ3JvdXBpbmc6IFszXSxcbiAgICBjdXJyZW5jeTogW1wiJFwiLCBcIlwiXVxuICB9KTtcblxuICB2YXIgZm9ybWF0ID0gbG9jYWxlLmZvcm1hdDtcblxuICBmdW5jdGlvbiBwcmVjaXNpb25GaXhlZChzdGVwKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KDAsIC1leHBvbmVudChNYXRoLmFicyhzdGVwKSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJlY2lzaW9uUm91bmQoc3RlcCwgbWF4KSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KDAsIGV4cG9uZW50KE1hdGguYWJzKG1heCkpIC0gZXhwb25lbnQoTWF0aC5hYnMoc3RlcCkpKSArIDE7XG4gIH1cblxuICB2YXIgZm9ybWF0UHJlZml4ID0gbG9jYWxlLmZvcm1hdFByZWZpeDtcblxuICBmdW5jdGlvbiBwcmVjaXNpb25QcmVmaXgoc3RlcCwgdmFsdWUpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5tYXgoLTgsIE1hdGgubWluKDgsIE1hdGguZmxvb3IoZXhwb25lbnQodmFsdWUpIC8gMykpKSAqIDMgLSBleHBvbmVudChNYXRoLmFicyhzdGVwKSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdGlja0Zvcm1hdChkb21haW4sIGNvdW50LCBzcGVjaWZpZXIpIHtcbiAgICB2YXIgcmFuZ2UgPSB0aWNrUmFuZ2UoZG9tYWluLCBjb3VudCk7XG4gICAgaWYgKHNwZWNpZmllciA9PSBudWxsKSB7XG4gICAgICBzcGVjaWZpZXIgPSBcIiwuXCIgKyBwcmVjaXNpb25GaXhlZChyYW5nZVsyXSkgKyBcImZcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgc3dpdGNoIChzcGVjaWZpZXIgPSBmb3JtYXRTcGVjaWZpZXIoc3BlY2lmaWVyKSwgc3BlY2lmaWVyLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcInNcIjoge1xuICAgICAgICAgIHZhciB2YWx1ZSA9IE1hdGgubWF4KE1hdGguYWJzKHJhbmdlWzBdKSwgTWF0aC5hYnMocmFuZ2VbMV0pKTtcbiAgICAgICAgICBpZiAoc3BlY2lmaWVyLnByZWNpc2lvbiA9PSBudWxsKSBzcGVjaWZpZXIucHJlY2lzaW9uID0gcHJlY2lzaW9uUHJlZml4KHJhbmdlWzJdLCB2YWx1ZSk7XG4gICAgICAgICAgcmV0dXJuIGZvcm1hdFByZWZpeChzcGVjaWZpZXIsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBjYXNlIFwiXCI6XG4gICAgICAgIGNhc2UgXCJlXCI6XG4gICAgICAgIGNhc2UgXCJnXCI6XG4gICAgICAgIGNhc2UgXCJwXCI6XG4gICAgICAgIGNhc2UgXCJyXCI6IHtcbiAgICAgICAgICBpZiAoc3BlY2lmaWVyLnByZWNpc2lvbiA9PSBudWxsKSBzcGVjaWZpZXIucHJlY2lzaW9uID0gcHJlY2lzaW9uUm91bmQocmFuZ2VbMl0sIE1hdGgubWF4KE1hdGguYWJzKHJhbmdlWzBdKSwgTWF0aC5hYnMocmFuZ2VbMV0pKSkgLSAoc3BlY2lmaWVyLnR5cGUgPT09IFwiZVwiKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIFwiZlwiOlxuICAgICAgICBjYXNlIFwiJVwiOiB7XG4gICAgICAgICAgaWYgKHNwZWNpZmllci5wcmVjaXNpb24gPT0gbnVsbCkgc3BlY2lmaWVyLnByZWNpc2lvbiA9IHByZWNpc2lvbkZpeGVkKHJhbmdlWzJdKSAtIChzcGVjaWZpZXIudHlwZSA9PT0gXCIlXCIpICogMjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZm9ybWF0KHNwZWNpZmllcik7XG4gIH1cblxuICBmdW5jdGlvbiBzY2FsZSh4KSB7XG4gICAgdmFyIGsgPSAxO1xuICAgIHdoaWxlICh4ICogayAlIDEpIGsgKj0gMTA7XG4gICAgcmV0dXJuIGs7XG4gIH1cblxuICBmdW5jdGlvbiByYW5nZShzdGFydCwgc3RvcCwgc3RlcCkge1xuICAgIGlmICgobiA9IGFyZ3VtZW50cy5sZW5ndGgpIDwgMykge1xuICAgICAgc3RlcCA9IDE7XG4gICAgICBpZiAobiA8IDIpIHtcbiAgICAgICAgc3RvcCA9IHN0YXJ0O1xuICAgICAgICBzdGFydCA9IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGkgPSAtMSxcbiAgICAgICAgbiA9IE1hdGgubWF4KDAsIE1hdGguY2VpbCgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXApKSB8IDAsXG4gICAgICAgIGsgPSBzY2FsZShNYXRoLmFicyhzdGVwKSksXG4gICAgICAgIHJhbmdlID0gbmV3IEFycmF5KG4pO1xuXG4gICAgc3RhcnQgKj0gaztcbiAgICBzdGVwICo9IGs7XG4gICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgIHJhbmdlW2ldID0gKHN0YXJ0ICsgaSAqIHN0ZXApIC8gaztcbiAgICB9XG5cbiAgICByZXR1cm4gcmFuZ2U7XG4gIH1cblxuICBmdW5jdGlvbiB0aWNrcyhkb21haW4sIGNvdW50KSB7XG4gICAgcmV0dXJuIHJhbmdlLmFwcGx5KG51bGwsIHRpY2tSYW5nZShkb21haW4sIGNvdW50KSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZVJvdW5kKGEsIGIpIHtcbiAgICByZXR1cm4gYSA9ICthLCBiIC09IGEsIGZ1bmN0aW9uKHQpIHtcbiAgICAgIHJldHVybiBNYXRoLnJvdW5kKGEgKyBiICogdCk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVuaW50ZXJwb2xhdGVOdW1iZXIoYSwgYikge1xuICAgIGIgPSAoYiAtPSBhID0gK2EpIHx8IDEgLyBiO1xuICAgIHJldHVybiBmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gKHggLSBhKSAvIGI7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVuaW50ZXJwb2xhdGVDbGFtcChhLCBiKSB7XG4gICAgYiA9IChiIC09IGEgPSArYSkgfHwgMSAvIGI7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCAoeCAtIGEpIC8gYikpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBiaWxpbmVhcihkb21haW4sIHJhbmdlLCB1bmludGVycG9sYXRlLCBpbnRlcnBvbGF0ZSkge1xuICAgIHZhciB1ID0gdW5pbnRlcnBvbGF0ZShkb21haW5bMF0sIGRvbWFpblsxXSksXG4gICAgICAgIGkgPSBpbnRlcnBvbGF0ZShyYW5nZVswXSwgcmFuZ2VbMV0pO1xuICAgIHJldHVybiBmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gaSh1KHgpKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gcG9seWxpbmVhcihkb21haW4sIHJhbmdlLCB1bmludGVycG9sYXRlLCBpbnRlcnBvbGF0ZSkge1xuICAgIHZhciBrID0gTWF0aC5taW4oZG9tYWluLmxlbmd0aCwgcmFuZ2UubGVuZ3RoKSAtIDEsXG4gICAgICAgIHUgPSBuZXcgQXJyYXkoayksXG4gICAgICAgIGkgPSBuZXcgQXJyYXkoayksXG4gICAgICAgIGogPSAtMTtcblxuICAgIC8vIEhhbmRsZSBkZXNjZW5kaW5nIGRvbWFpbnMuXG4gICAgaWYgKGRvbWFpbltrXSA8IGRvbWFpblswXSkge1xuICAgICAgZG9tYWluID0gZG9tYWluLnNsaWNlKCkucmV2ZXJzZSgpO1xuICAgICAgcmFuZ2UgPSByYW5nZS5zbGljZSgpLnJldmVyc2UoKTtcbiAgICB9XG5cbiAgICB3aGlsZSAoKytqIDwgaykge1xuICAgICAgdVtqXSA9IHVuaW50ZXJwb2xhdGUoZG9tYWluW2pdLCBkb21haW5baiArIDFdKTtcbiAgICAgIGlbal0gPSBpbnRlcnBvbGF0ZShyYW5nZVtqXSwgcmFuZ2VbaiArIDFdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oeCkge1xuICAgICAgdmFyIGogPSBiaXNlY3QoZG9tYWluLCB4LCAxLCBrKSAtIDE7XG4gICAgICByZXR1cm4gaVtqXSh1W2pdKHgpKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gbmV3TGluZWFyKGRvbWFpbiwgcmFuZ2UsIGludGVycG9sYXRlLCBjbGFtcCkge1xuICAgIHZhciBvdXRwdXQsXG4gICAgICAgIGlucHV0O1xuXG4gICAgZnVuY3Rpb24gcmVzY2FsZSgpIHtcbiAgICAgIHZhciBsaW5lYXIgPSBNYXRoLm1pbihkb21haW4ubGVuZ3RoLCByYW5nZS5sZW5ndGgpID4gMiA/IHBvbHlsaW5lYXIgOiBiaWxpbmVhcixcbiAgICAgICAgICB1bmludGVycG9sYXRlID0gY2xhbXAgPyB1bmludGVycG9sYXRlQ2xhbXAgOiB1bmludGVycG9sYXRlTnVtYmVyO1xuICAgICAgb3V0cHV0ID0gbGluZWFyKGRvbWFpbiwgcmFuZ2UsIHVuaW50ZXJwb2xhdGUsIGludGVycG9sYXRlKTtcbiAgICAgIGlucHV0ID0gbGluZWFyKHJhbmdlLCBkb21haW4sIHVuaW50ZXJwb2xhdGUsIGludGVycG9sYXRlTnVtYmVyKTtcbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2FsZSh4KSB7XG4gICAgICByZXR1cm4gb3V0cHV0KHgpO1xuICAgIH1cblxuICAgIHNjYWxlLmludmVydCA9IGZ1bmN0aW9uKHkpIHtcbiAgICAgIHJldHVybiBpbnB1dCh5KTtcbiAgICB9O1xuXG4gICAgc2NhbGUuZG9tYWluID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gZG9tYWluLnNsaWNlKCk7XG4gICAgICBkb21haW4gPSB4Lm1hcChOdW1iZXIpO1xuICAgICAgcmV0dXJuIHJlc2NhbGUoKTtcbiAgICB9O1xuXG4gICAgc2NhbGUucmFuZ2UgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiByYW5nZS5zbGljZSgpO1xuICAgICAgcmFuZ2UgPSB4LnNsaWNlKCk7XG4gICAgICByZXR1cm4gcmVzY2FsZSgpO1xuICAgIH07XG5cbiAgICBzY2FsZS5yYW5nZVJvdW5kID0gZnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIHNjYWxlLnJhbmdlKHgpLmludGVycG9sYXRlKGludGVycG9sYXRlUm91bmQpO1xuICAgIH07XG5cbiAgICBzY2FsZS5jbGFtcCA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNsYW1wO1xuICAgICAgY2xhbXAgPSAhIXg7XG4gICAgICByZXR1cm4gcmVzY2FsZSgpO1xuICAgIH07XG5cbiAgICBzY2FsZS5pbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGludGVycG9sYXRlO1xuICAgICAgaW50ZXJwb2xhdGUgPSB4O1xuICAgICAgcmV0dXJuIHJlc2NhbGUoKTtcbiAgICB9O1xuXG4gICAgc2NhbGUudGlja3MgPSBmdW5jdGlvbihjb3VudCkge1xuICAgICAgcmV0dXJuIHRpY2tzKGRvbWFpbiwgY291bnQpO1xuICAgIH07XG5cbiAgICBzY2FsZS50aWNrRm9ybWF0ID0gZnVuY3Rpb24oY291bnQsIHNwZWNpZmllcikge1xuICAgICAgcmV0dXJuIHRpY2tGb3JtYXQoZG9tYWluLCBjb3VudCwgc3BlY2lmaWVyKTtcbiAgICB9O1xuXG4gICAgc2NhbGUubmljZSA9IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgICBkb21haW4gPSBuaWNlKGRvbWFpbiwgdGlja1JhbmdlKGRvbWFpbiwgY291bnQpWzJdKTtcbiAgICAgIHJldHVybiByZXNjYWxlKCk7XG4gICAgfTtcblxuICAgIHNjYWxlLmNvcHkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXdMaW5lYXIoZG9tYWluLCByYW5nZSwgaW50ZXJwb2xhdGUsIGNsYW1wKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHJlc2NhbGUoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxpbmVhcigpIHtcbiAgICByZXR1cm4gbmV3TGluZWFyKFswLCAxXSwgWzAsIDFdLCBpbnRlcnBvbGF0ZSwgZmFsc2UpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmViaW5kKHNjYWxlLCBsaW5lYXIpIHtcbiAgICBzY2FsZS5yYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHggPSBsaW5lYXIucmFuZ2UuYXBwbHkobGluZWFyLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIHggPT09IGxpbmVhciA/IHNjYWxlIDogeDtcbiAgICB9O1xuXG4gICAgc2NhbGUucmFuZ2VSb3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHggPSBsaW5lYXIucmFuZ2VSb3VuZC5hcHBseShsaW5lYXIsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4geCA9PT0gbGluZWFyID8gc2NhbGUgOiB4O1xuICAgIH07XG5cbiAgICBzY2FsZS5jbGFtcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHggPSBsaW5lYXIuY2xhbXAuYXBwbHkobGluZWFyLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIHggPT09IGxpbmVhciA/IHNjYWxlIDogeDtcbiAgICB9O1xuXG4gICAgc2NhbGUuaW50ZXJwb2xhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB4ID0gbGluZWFyLmludGVycG9sYXRlLmFwcGx5KGxpbmVhciwgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiB4ID09PSBsaW5lYXIgPyBzY2FsZSA6IHg7XG4gICAgfTtcblxuICAgIHJldHVybiBzY2FsZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5ld1BvdyhsaW5lYXIsIGV4cG9uZW50LCBkb21haW4pIHtcblxuICAgIGZ1bmN0aW9uIHBvd3AoeCkge1xuICAgICAgcmV0dXJuIHggPCAwID8gLU1hdGgucG93KC14LCBleHBvbmVudCkgOiBNYXRoLnBvdyh4LCBleHBvbmVudCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcG93Yih4KSB7XG4gICAgICByZXR1cm4geCA8IDAgPyAtTWF0aC5wb3coLXgsIDEgLyBleHBvbmVudCkgOiBNYXRoLnBvdyh4LCAxIC8gZXhwb25lbnQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjYWxlKHgpIHtcbiAgICAgIHJldHVybiBsaW5lYXIocG93cCh4KSk7XG4gICAgfVxuXG4gICAgc2NhbGUuaW52ZXJ0ID0gZnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIHBvd2IobGluZWFyLmludmVydCh4KSk7XG4gICAgfTtcblxuICAgIHNjYWxlLmV4cG9uZW50ID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gZXhwb25lbnQ7XG4gICAgICBleHBvbmVudCA9ICt4O1xuICAgICAgcmV0dXJuIHNjYWxlLmRvbWFpbihkb21haW4pO1xuICAgIH07XG5cbiAgICBzY2FsZS5kb21haW4gPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBkb21haW4uc2xpY2UoKTtcbiAgICAgIGRvbWFpbiA9IHgubWFwKE51bWJlcik7XG4gICAgICBsaW5lYXIuZG9tYWluKGRvbWFpbi5tYXAocG93cCkpO1xuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH07XG5cbiAgICBzY2FsZS50aWNrcyA9IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgICByZXR1cm4gdGlja3MoZG9tYWluLCBjb3VudCk7XG4gICAgfTtcblxuICAgIHNjYWxlLnRpY2tGb3JtYXQgPSBmdW5jdGlvbihjb3VudCwgc3BlY2lmaWVyKSB7XG4gICAgICByZXR1cm4gdGlja0Zvcm1hdChkb21haW4sIGNvdW50LCBzcGVjaWZpZXIpO1xuICAgIH07XG5cbiAgICBzY2FsZS5uaWNlID0gZnVuY3Rpb24oY291bnQpIHtcbiAgICAgIHJldHVybiBzY2FsZS5kb21haW4obmljZShkb21haW4sIHRpY2tSYW5nZShkb21haW4sIGNvdW50KVsyXSkpO1xuICAgIH07XG5cbiAgICBzY2FsZS5jb3B5ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3UG93KGxpbmVhci5jb3B5KCksIGV4cG9uZW50LCBkb21haW4pO1xuICAgIH07XG5cbiAgICByZXR1cm4gcmViaW5kKHNjYWxlLCBsaW5lYXIpO1xuICB9XG5cbiAgZnVuY3Rpb24gc3FydCgpIHtcbiAgICByZXR1cm4gbmV3UG93KGxpbmVhcigpLCAuNSwgWzAsIDFdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5ld1F1YW50aXplKHgwLCB4MSwgcmFuZ2UpIHtcbiAgICB2YXIga3gsIGk7XG5cbiAgICBmdW5jdGlvbiBzY2FsZSh4KSB7XG4gICAgICByZXR1cm4gcmFuZ2VbTWF0aC5tYXgoMCwgTWF0aC5taW4oaSwgTWF0aC5mbG9vcihreCAqICh4IC0geDApKSkpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNjYWxlKCkge1xuICAgICAga3ggPSByYW5nZS5sZW5ndGggLyAoeDEgLSB4MCk7XG4gICAgICBpID0gcmFuZ2UubGVuZ3RoIC0gMTtcbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9XG5cbiAgICBzY2FsZS5kb21haW4gPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBbeDAsIHgxXTtcbiAgICAgIHgwID0gK3hbMF07XG4gICAgICB4MSA9ICt4W3gubGVuZ3RoIC0gMV07XG4gICAgICByZXR1cm4gcmVzY2FsZSgpO1xuICAgIH07XG5cbiAgICBzY2FsZS5yYW5nZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHJhbmdlLnNsaWNlKCk7XG4gICAgICByYW5nZSA9IHguc2xpY2UoKTtcbiAgICAgIHJldHVybiByZXNjYWxlKCk7XG4gICAgfTtcblxuICAgIHNjYWxlLmludmVydEV4dGVudCA9IGZ1bmN0aW9uKHkpIHtcbiAgICAgIHkgPSByYW5nZS5pbmRleE9mKHkpO1xuICAgICAgeSA9IHkgPCAwID8gTmFOIDogeSAvIGt4ICsgeDA7XG4gICAgICByZXR1cm4gW3ksIHkgKyAxIC8ga3hdO1xuICAgIH07XG5cbiAgICBzY2FsZS5jb3B5ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3UXVhbnRpemUoeDAsIHgxLCByYW5nZSk7IC8vIGNvcHkgb24gd3JpdGVcbiAgICB9O1xuXG4gICAgcmV0dXJuIHJlc2NhbGUoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHF1YW50aXplKCkge1xuICAgIHJldHVybiBuZXdRdWFudGl6ZSgwLCAxLCBbMCwgMV0pO1xuICB9XG5cblxuICAvLyBSLTcgcGVyIDxodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1F1YW50aWxlPlxuICBmdW5jdGlvbiBxdWFudGlsZSh2YWx1ZXMsIHApIHtcbiAgICB2YXIgSCA9ICh2YWx1ZXMubGVuZ3RoIC0gMSkgKiBwICsgMSxcbiAgICAgICAgaCA9IE1hdGguZmxvb3IoSCksXG4gICAgICAgIHYgPSArdmFsdWVzW2ggLSAxXSxcbiAgICAgICAgZSA9IEggLSBoO1xuICAgIHJldHVybiBlID8gdiArIGUgKiAodmFsdWVzW2hdIC0gdikgOiB2O1xuICB9XG5cbiAgZnVuY3Rpb24gbmV3UXVhbnRpbGUoZG9tYWluLCByYW5nZSkge1xuICAgIHZhciB0aHJlc2hvbGRzO1xuXG4gICAgZnVuY3Rpb24gcmVzY2FsZSgpIHtcbiAgICAgIHZhciBrID0gMCxcbiAgICAgICAgICBxID0gcmFuZ2UubGVuZ3RoO1xuICAgICAgdGhyZXNob2xkcyA9IFtdO1xuICAgICAgd2hpbGUgKCsrayA8IHEpIHRocmVzaG9sZHNbayAtIDFdID0gcXVhbnRpbGUoZG9tYWluLCBrIC8gcSk7XG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2NhbGUoeCkge1xuICAgICAgaWYgKCFpc05hTih4ID0gK3gpKSByZXR1cm4gcmFuZ2VbYmlzZWN0KHRocmVzaG9sZHMsIHgpXTtcbiAgICB9XG5cbiAgICBzY2FsZS5kb21haW4gPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBkb21haW47XG4gICAgICBkb21haW4gPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBuID0geC5sZW5ndGgsIHY7IGkgPCBuOyArK2kpIGlmICh2ID0geFtpXSwgdiAhPSBudWxsICYmICFpc05hTih2ID0gK3YpKSBkb21haW4ucHVzaCh2KTtcbiAgICAgIGRvbWFpbi5zb3J0KGFzY2VuZGluZyk7XG4gICAgICByZXR1cm4gcmVzY2FsZSgpO1xuICAgIH07XG5cbiAgICBzY2FsZS5yYW5nZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHJhbmdlLnNsaWNlKCk7XG4gICAgICByYW5nZSA9IHguc2xpY2UoKTtcbiAgICAgIHJldHVybiByZXNjYWxlKCk7XG4gICAgfTtcblxuICAgIHNjYWxlLnF1YW50aWxlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRocmVzaG9sZHM7XG4gICAgfTtcblxuICAgIHNjYWxlLmludmVydEV4dGVudCA9IGZ1bmN0aW9uKHkpIHtcbiAgICAgIHkgPSByYW5nZS5pbmRleE9mKHkpO1xuICAgICAgcmV0dXJuIHkgPCAwID8gW05hTiwgTmFOXSA6IFtcbiAgICAgICAgeSA+IDAgPyB0aHJlc2hvbGRzW3kgLSAxXSA6IGRvbWFpblswXSxcbiAgICAgICAgeSA8IHRocmVzaG9sZHMubGVuZ3RoID8gdGhyZXNob2xkc1t5XSA6IGRvbWFpbltkb21haW4ubGVuZ3RoIC0gMV1cbiAgICAgIF07XG4gICAgfTtcblxuICAgIHNjYWxlLmNvcHkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXdRdWFudGlsZShkb21haW4sIHJhbmdlKTsgLy8gY29weSBvbiB3cml0ZSFcbiAgICB9O1xuXG4gICAgcmV0dXJuIHJlc2NhbGUoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9xdWFudGlsZSgpIHtcbiAgICByZXR1cm4gbmV3UXVhbnRpbGUoW10sIFtdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBvdygpIHtcbiAgICByZXR1cm4gbmV3UG93KGxpbmVhcigpLCAxLCBbMCwgMV0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RlcHMobGVuZ3RoLCBzdGFydCwgc3RlcCkge1xuICAgIHZhciBzdGVwcyA9IG5ldyBBcnJheShsZW5ndGgpLCBpID0gLTE7XG4gICAgd2hpbGUgKCsraSA8IGxlbmd0aCkgc3RlcHNbaV0gPSBzdGFydCArIHN0ZXAgKiBpO1xuICAgIHJldHVybiBzdGVwcztcbiAgfVxuXG4gIGZ1bmN0aW9uIG5ld09yZGluYWwoZG9tYWluLCByYW5nZXIpIHtcbiAgICB2YXIgaW5kZXgsXG4gICAgICAgIHJhbmdlLFxuICAgICAgICByYW5nZUJhbmQ7XG5cbiAgICBmdW5jdGlvbiBzY2FsZSh4KSB7XG4gICAgICB2YXIgayA9IHggKyBcIlwiLCBpID0gaW5kZXguZ2V0KGspO1xuICAgICAgaWYgKCFpKSB7XG4gICAgICAgIGlmIChyYW5nZXIudCAhPT0gXCJyYW5nZVwiKSByZXR1cm47XG4gICAgICAgIGluZGV4LnNldChrLCBpID0gZG9tYWluLnB1c2goeCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJhbmdlWyhpIC0gMSkgJSByYW5nZS5sZW5ndGhdO1xuICAgIH1cblxuICAgIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGRvbWFpbi5zbGljZSgpO1xuICAgICAgZG9tYWluID0gW107XG4gICAgICBpbmRleCA9IG5ldyBNYXA7XG4gICAgICB2YXIgaSA9IC0xLCBuID0geC5sZW5ndGgsIHhpLCB4aztcbiAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoIWluZGV4Lmhhcyh4ayA9ICh4aSA9IHhbaV0pICsgXCJcIikpIGluZGV4LnNldCh4aywgZG9tYWluLnB1c2goeGkpKTtcbiAgICAgIHJldHVybiBzY2FsZVtyYW5nZXIudF0uYXBwbHkoc2NhbGUsIHJhbmdlci5hKTtcbiAgICB9O1xuXG4gICAgc2NhbGUucmFuZ2UgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiByYW5nZS5zbGljZSgpO1xuICAgICAgcmFuZ2UgPSB4LnNsaWNlKCk7XG4gICAgICByYW5nZUJhbmQgPSAwO1xuICAgICAgcmFuZ2VyID0ge3Q6IFwicmFuZ2VcIiwgYTogYXJndW1lbnRzfTtcbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9O1xuXG4gICAgc2NhbGUucmFuZ2VQb2ludHMgPSBmdW5jdGlvbih4LCBwYWRkaW5nKSB7XG4gICAgICBwYWRkaW5nID0gYXJndW1lbnRzLmxlbmd0aCA8IDIgPyAwIDogK3BhZGRpbmc7XG4gICAgICB2YXIgc3RhcnQgPSAreFswXSxcbiAgICAgICAgICBzdG9wID0gK3hbMV0sXG4gICAgICAgICAgc3RlcCA9IGRvbWFpbi5sZW5ndGggPCAyID8gKHN0YXJ0ID0gKHN0YXJ0ICsgc3RvcCkgLyAyLCAwKSA6IChzdG9wIC0gc3RhcnQpIC8gKGRvbWFpbi5sZW5ndGggLSAxICsgcGFkZGluZyk7XG4gICAgICByYW5nZSA9IHN0ZXBzKGRvbWFpbi5sZW5ndGgsIHN0YXJ0ICsgc3RlcCAqIHBhZGRpbmcgLyAyLCBzdGVwKTtcbiAgICAgIHJhbmdlQmFuZCA9IDA7XG4gICAgICByYW5nZXIgPSB7dDogXCJyYW5nZVBvaW50c1wiLCBhOiBhcmd1bWVudHN9O1xuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH07XG5cbiAgICBzY2FsZS5yYW5nZVJvdW5kUG9pbnRzID0gZnVuY3Rpb24oeCwgcGFkZGluZykge1xuICAgICAgcGFkZGluZyA9IGFyZ3VtZW50cy5sZW5ndGggPCAyID8gMCA6ICtwYWRkaW5nO1xuICAgICAgdmFyIHN0YXJ0ID0gK3hbMF0sXG4gICAgICAgICAgc3RvcCA9ICt4WzFdLFxuICAgICAgICAgIHN0ZXAgPSBkb21haW4ubGVuZ3RoIDwgMiA/IChzdGFydCA9IHN0b3AgPSBNYXRoLnJvdW5kKChzdGFydCArIHN0b3ApIC8gMiksIDApIDogKHN0b3AgLSBzdGFydCkgLyAoZG9tYWluLmxlbmd0aCAtIDEgKyBwYWRkaW5nKSB8IDA7IC8vIGJpdHdpc2UgZmxvb3IgZm9yIHN5bW1ldHJ5XG4gICAgICByYW5nZSA9IHN0ZXBzKGRvbWFpbi5sZW5ndGgsIHN0YXJ0ICsgTWF0aC5yb3VuZChzdGVwICogcGFkZGluZyAvIDIgKyAoc3RvcCAtIHN0YXJ0IC0gKGRvbWFpbi5sZW5ndGggLSAxICsgcGFkZGluZykgKiBzdGVwKSAvIDIpLCBzdGVwKTtcbiAgICAgIHJhbmdlQmFuZCA9IDA7XG4gICAgICByYW5nZXIgPSB7dDogXCJyYW5nZVJvdW5kUG9pbnRzXCIsIGE6IGFyZ3VtZW50c307XG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIHNjYWxlLnJhbmdlQmFuZHMgPSBmdW5jdGlvbih4LCBwYWRkaW5nLCBvdXRlclBhZGRpbmcpIHtcbiAgICAgIHBhZGRpbmcgPSBhcmd1bWVudHMubGVuZ3RoIDwgMiA/IDAgOiArcGFkZGluZztcbiAgICAgIG91dGVyUGFkZGluZyA9IGFyZ3VtZW50cy5sZW5ndGggPCAzID8gcGFkZGluZyA6ICtvdXRlclBhZGRpbmc7XG4gICAgICB2YXIgcmV2ZXJzZSA9ICt4WzFdIDwgK3hbMF0sXG4gICAgICAgICAgc3RhcnQgPSAreFtyZXZlcnNlIC0gMF0sXG4gICAgICAgICAgc3RvcCA9ICt4WzEgLSByZXZlcnNlXSxcbiAgICAgICAgICBzdGVwID0gKHN0b3AgLSBzdGFydCkgLyAoZG9tYWluLmxlbmd0aCAtIHBhZGRpbmcgKyAyICogb3V0ZXJQYWRkaW5nKTtcbiAgICAgIHJhbmdlID0gc3RlcHMoZG9tYWluLmxlbmd0aCwgc3RhcnQgKyBzdGVwICogb3V0ZXJQYWRkaW5nLCBzdGVwKTtcbiAgICAgIGlmIChyZXZlcnNlKSByYW5nZS5yZXZlcnNlKCk7XG4gICAgICByYW5nZUJhbmQgPSBzdGVwICogKDEgLSBwYWRkaW5nKTtcbiAgICAgIHJhbmdlciA9IHt0OiBcInJhbmdlQmFuZHNcIiwgYTogYXJndW1lbnRzfTtcbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9O1xuXG4gICAgc2NhbGUucmFuZ2VSb3VuZEJhbmRzID0gZnVuY3Rpb24oeCwgcGFkZGluZywgb3V0ZXJQYWRkaW5nKSB7XG4gICAgICBwYWRkaW5nID0gYXJndW1lbnRzLmxlbmd0aCA8IDIgPyAwIDogK3BhZGRpbmc7XG4gICAgICBvdXRlclBhZGRpbmcgPSBhcmd1bWVudHMubGVuZ3RoIDwgMyA/IHBhZGRpbmcgOiArb3V0ZXJQYWRkaW5nO1xuICAgICAgdmFyIHJldmVyc2UgPSAreFsxXSA8ICt4WzBdLFxuICAgICAgICAgIHN0YXJ0ID0gK3hbcmV2ZXJzZSAtIDBdLFxuICAgICAgICAgIHN0b3AgPSAreFsxIC0gcmV2ZXJzZV0sXG4gICAgICAgICAgc3RlcCA9IE1hdGguZmxvb3IoKHN0b3AgLSBzdGFydCkgLyAoZG9tYWluLmxlbmd0aCAtIHBhZGRpbmcgKyAyICogb3V0ZXJQYWRkaW5nKSk7XG4gICAgICByYW5nZSA9IHN0ZXBzKGRvbWFpbi5sZW5ndGgsIHN0YXJ0ICsgTWF0aC5yb3VuZCgoc3RvcCAtIHN0YXJ0IC0gKGRvbWFpbi5sZW5ndGggLSBwYWRkaW5nKSAqIHN0ZXApIC8gMiksIHN0ZXApO1xuICAgICAgaWYgKHJldmVyc2UpIHJhbmdlLnJldmVyc2UoKTtcbiAgICAgIHJhbmdlQmFuZCA9IE1hdGgucm91bmQoc3RlcCAqICgxIC0gcGFkZGluZykpO1xuICAgICAgcmFuZ2VyID0ge3Q6IFwicmFuZ2VSb3VuZEJhbmRzXCIsIGE6IGFyZ3VtZW50c307XG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIHNjYWxlLnJhbmdlQmFuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJhbmdlQmFuZDtcbiAgICB9O1xuXG4gICAgc2NhbGUucmFuZ2VFeHRlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0ID0gcmFuZ2VyLmFbMF0sIHN0YXJ0ID0gdFswXSwgc3RvcCA9IHRbdC5sZW5ndGggLSAxXTtcbiAgICAgIGlmIChzdG9wIDwgc3RhcnQpIHQgPSBzdG9wLCBzdG9wID0gc3RhcnQsIHN0YXJ0ID0gdDtcbiAgICAgIHJldHVybiBbc3RhcnQsIHN0b3BdO1xuICAgIH07XG5cbiAgICBzY2FsZS5jb3B5ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3T3JkaW5hbChkb21haW4sIHJhbmdlcik7XG4gICAgfTtcblxuICAgIHJldHVybiBzY2FsZS5kb21haW4oZG9tYWluKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9yZGluYWwoKSB7XG4gICAgcmV0dXJuIG5ld09yZGluYWwoW10sIHt0OiBcInJhbmdlXCIsIGE6IFtbXV19KTtcbiAgfVxuXG4gIHZhciB0aWNrRm9ybWF0T3RoZXIgPSBmb3JtYXQoXCIsXCIpO1xuXG4gIHZhciB0aWNrRm9ybWF0MTAgPSBmb3JtYXQoXCIuMGVcIik7XG5cbiAgZnVuY3Rpb24gbmV3TG9nKGxpbmVhciwgYmFzZSwgZG9tYWluKSB7XG5cbiAgICBmdW5jdGlvbiBsb2coeCkge1xuICAgICAgcmV0dXJuIChkb21haW5bMF0gPCAwID8gLU1hdGgubG9nKHggPiAwID8gMCA6IC14KSA6IE1hdGgubG9nKHggPCAwID8gMCA6IHgpKSAvIE1hdGgubG9nKGJhc2UpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBvdyh4KSB7XG4gICAgICByZXR1cm4gZG9tYWluWzBdIDwgMCA/IC1NYXRoLnBvdyhiYXNlLCAteCkgOiBNYXRoLnBvdyhiYXNlLCB4KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2FsZSh4KSB7XG4gICAgICByZXR1cm4gbGluZWFyKGxvZyh4KSk7XG4gICAgfVxuXG4gICAgc2NhbGUuaW52ZXJ0ID0gZnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIHBvdyhsaW5lYXIuaW52ZXJ0KHgpKTtcbiAgICB9O1xuXG4gICAgc2NhbGUuYmFzZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGJhc2U7XG4gICAgICBiYXNlID0gK3g7XG4gICAgICByZXR1cm4gc2NhbGUuZG9tYWluKGRvbWFpbik7XG4gICAgfTtcblxuICAgIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGRvbWFpbi5zbGljZSgpO1xuICAgICAgZG9tYWluID0geC5tYXAoTnVtYmVyKTtcbiAgICAgIGxpbmVhci5kb21haW4oZG9tYWluLm1hcChsb2cpKTtcbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9O1xuXG4gICAgc2NhbGUubmljZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHggPSBuaWNlKGxpbmVhci5kb21haW4oKSwgMSk7XG4gICAgICBsaW5lYXIuZG9tYWluKHgpO1xuICAgICAgZG9tYWluID0geC5tYXAocG93KTtcbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9O1xuXG4gICAgc2NhbGUudGlja3MgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB1ID0gZG9tYWluWzBdLFxuICAgICAgICAgIHYgPSBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdO1xuICAgICAgaWYgKHYgPCB1KSBpID0gdSwgdSA9IHYsIHYgPSBpO1xuICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKGxvZyh1KSksXG4gICAgICAgICAgaiA9IE1hdGguY2VpbChsb2codikpLFxuICAgICAgICAgIGssXG4gICAgICAgICAgdCxcbiAgICAgICAgICBuID0gYmFzZSAlIDEgPyAyIDogYmFzZSxcbiAgICAgICAgICB0aWNrcyA9IFtdO1xuXG4gICAgICBpZiAoaXNGaW5pdGUoaiAtIGkpKSB7XG4gICAgICAgIGlmICh1ID4gMCkge1xuICAgICAgICAgIGZvciAoLS1qLCBrID0gMTsgayA8IG47ICsraykgaWYgKCh0ID0gcG93KGkpICogaykgPCB1KSBjb250aW51ZTsgZWxzZSB0aWNrcy5wdXNoKHQpO1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBqKSBmb3IgKGsgPSAxOyBrIDwgbjsgKytrKSB0aWNrcy5wdXNoKHBvdyhpKSAqIGspO1xuICAgICAgICAgIGZvciAoayA9IDE7IGsgPCBuOyArK2spIGlmICgodCA9IHBvdyhpKSAqIGspID4gdikgYnJlYWs7IGVsc2UgdGlja3MucHVzaCh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKCsraSwgayA9IG4gLSAxOyBrID49IDE7IC0taykgaWYgKCh0ID0gcG93KGkpICogaykgPCB1KSBjb250aW51ZTsgZWxzZSB0aWNrcy5wdXNoKHQpO1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBqKSBmb3IgKGsgPSBuIC0gMTsgayA+PSAxOyAtLWspIHRpY2tzLnB1c2gocG93KGkpICogayk7XG4gICAgICAgICAgZm9yIChrID0gbiAtIDE7IGsgPj0gMTsgLS1rKSBpZiAoKHQgPSBwb3coaSkgKiBrKSA+IHYpIGJyZWFrOyBlbHNlIHRpY2tzLnB1c2godCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRpY2tzO1xuICAgIH07XG5cbiAgICBzY2FsZS50aWNrRm9ybWF0ID0gZnVuY3Rpb24oY291bnQsIHNwZWNpZmllcikge1xuICAgICAgaWYgKHNwZWNpZmllciA9PSBudWxsKSBzcGVjaWZpZXIgPSBiYXNlID09PSAxMCA/IHRpY2tGb3JtYXQxMCA6IHRpY2tGb3JtYXRPdGhlcjtcbiAgICAgIGVsc2UgaWYgKHR5cGVvZiBzcGVjaWZpZXIgIT09IFwiZnVuY3Rpb25cIikgc3BlY2lmaWVyID0gZm9ybWF0KHNwZWNpZmllcik7XG4gICAgICBpZiAoY291bnQgPT0gbnVsbCkgcmV0dXJuIHNwZWNpZmllcjtcbiAgICAgIHZhciBrID0gTWF0aC5taW4oYmFzZSwgc2NhbGUudGlja3MoKS5sZW5ndGggLyBjb3VudCksXG4gICAgICAgICAgZiA9IGRvbWFpblswXSA+IDAgPyAoZSA9IDFlLTEyLCBNYXRoLmNlaWwpIDogKGUgPSAtMWUtMTIsIE1hdGguZmxvb3IpLFxuICAgICAgICAgIGU7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZCkge1xuICAgICAgICByZXR1cm4gcG93KGYobG9nKGQpICsgZSkpIC8gZCA+PSBrID8gc3BlY2lmaWVyKGQpIDogXCJcIjtcbiAgICAgIH07XG4gICAgfTtcblxuICAgIHNjYWxlLmNvcHkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXdMb2cobGluZWFyLmNvcHkoKSwgYmFzZSwgZG9tYWluKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHJlYmluZChzY2FsZSwgbGluZWFyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxvZygpIHtcbiAgICByZXR1cm4gbmV3TG9nKGxpbmVhcigpLCAxMCwgWzEsIDEwXSk7XG4gIH1cblxuICBmdW5jdGlvbiBuZXdJZGVudGl0eShkb21haW4pIHtcblxuICAgIGZ1bmN0aW9uIHNjYWxlKHgpIHtcbiAgICAgIHJldHVybiAreDtcbiAgICB9XG5cbiAgICBzY2FsZS5pbnZlcnQgPSBzY2FsZTtcblxuICAgIHNjYWxlLmRvbWFpbiA9IHNjYWxlLnJhbmdlID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gZG9tYWluLnNsaWNlKCk7XG4gICAgICBkb21haW4gPSB4Lm1hcChOdW1iZXIpO1xuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH07XG5cbiAgICBzY2FsZS50aWNrcyA9IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgICByZXR1cm4gdGlja3MoZG9tYWluLCBjb3VudCk7XG4gICAgfTtcblxuICAgIHNjYWxlLnRpY2tGb3JtYXQgPSBmdW5jdGlvbihjb3VudCwgc3BlY2lmaWVyKSB7XG4gICAgICByZXR1cm4gdGlja0Zvcm1hdChkb21haW4sIGNvdW50LCBzcGVjaWZpZXIpO1xuICAgIH07XG5cbiAgICBzY2FsZS5jb3B5ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3SWRlbnRpdHkoZG9tYWluKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHNjYWxlO1xuICB9XG5cbiAgZnVuY3Rpb24gaWRlbnRpdHkoKSB7XG4gICAgcmV0dXJuIG5ld0lkZW50aXR5KFswLCAxXSk7XG4gIH1cblxuICBmdW5jdGlvbiBjYXRlZ29yeTIwYygpIHtcbiAgICByZXR1cm4gb3JkaW5hbCgpLnJhbmdlKFtcbiAgICAgIFwiIzMxODJiZFwiLCBcIiM2YmFlZDZcIiwgXCIjOWVjYWUxXCIsIFwiI2M2ZGJlZlwiLFxuICAgICAgXCIjZTY1NTBkXCIsIFwiI2ZkOGQzY1wiLCBcIiNmZGFlNmJcIiwgXCIjZmRkMGEyXCIsXG4gICAgICBcIiMzMWEzNTRcIiwgXCIjNzRjNDc2XCIsIFwiI2ExZDk5YlwiLCBcIiNjN2U5YzBcIixcbiAgICAgIFwiIzc1NmJiMVwiLCBcIiM5ZTlhYzhcIiwgXCIjYmNiZGRjXCIsIFwiI2RhZGFlYlwiLFxuICAgICAgXCIjNjM2MzYzXCIsIFwiIzk2OTY5NlwiLCBcIiNiZGJkYmRcIiwgXCIjZDlkOWQ5XCJcbiAgICBdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhdGVnb3J5MjBiKCkge1xuICAgIHJldHVybiBvcmRpbmFsKCkucmFuZ2UoW1xuICAgICAgXCIjMzkzYjc5XCIsIFwiIzUyNTRhM1wiLCBcIiM2YjZlY2ZcIiwgXCIjOWM5ZWRlXCIsXG4gICAgICBcIiM2Mzc5MzlcIiwgXCIjOGNhMjUyXCIsIFwiI2I1Y2Y2YlwiLCBcIiNjZWRiOWNcIixcbiAgICAgIFwiIzhjNmQzMVwiLCBcIiNiZDllMzlcIiwgXCIjZTdiYTUyXCIsIFwiI2U3Y2I5NFwiLFxuICAgICAgXCIjODQzYzM5XCIsIFwiI2FkNDk0YVwiLCBcIiNkNjYxNmJcIiwgXCIjZTc5NjljXCIsXG4gICAgICBcIiM3YjQxNzNcIiwgXCIjYTU1MTk0XCIsIFwiI2NlNmRiZFwiLCBcIiNkZTllZDZcIlxuICAgIF0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2F0ZWdvcnkyMCgpIHtcbiAgICByZXR1cm4gb3JkaW5hbCgpLnJhbmdlKFtcbiAgICAgIFwiIzFmNzdiNFwiLCBcIiNhZWM3ZThcIixcbiAgICAgIFwiI2ZmN2YwZVwiLCBcIiNmZmJiNzhcIixcbiAgICAgIFwiIzJjYTAyY1wiLCBcIiM5OGRmOGFcIixcbiAgICAgIFwiI2Q2MjcyOFwiLCBcIiNmZjk4OTZcIixcbiAgICAgIFwiIzk0NjdiZFwiLCBcIiNjNWIwZDVcIixcbiAgICAgIFwiIzhjNTY0YlwiLCBcIiNjNDljOTRcIixcbiAgICAgIFwiI2UzNzdjMlwiLCBcIiNmN2I2ZDJcIixcbiAgICAgIFwiIzdmN2Y3ZlwiLCBcIiNjN2M3YzdcIixcbiAgICAgIFwiI2JjYmQyMlwiLCBcIiNkYmRiOGRcIixcbiAgICAgIFwiIzE3YmVjZlwiLCBcIiM5ZWRhZTVcIlxuICAgIF0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2F0ZWdvcnkxMCgpIHtcbiAgICByZXR1cm4gb3JkaW5hbCgpLnJhbmdlKFtcbiAgICAgIFwiIzFmNzdiNFwiLFxuICAgICAgXCIjZmY3ZjBlXCIsXG4gICAgICBcIiMyY2EwMmNcIixcbiAgICAgIFwiI2Q2MjcyOFwiLFxuICAgICAgXCIjOTQ2N2JkXCIsXG4gICAgICBcIiM4YzU2NGJcIixcbiAgICAgIFwiI2UzNzdjMlwiLFxuICAgICAgXCIjN2Y3ZjdmXCIsXG4gICAgICBcIiNiY2JkMjJcIixcbiAgICAgIFwiIzE3YmVjZlwiXG4gICAgXSk7XG4gIH1cblxuICBleHBvcnRzLmNhdGVnb3J5MTAgPSBjYXRlZ29yeTEwO1xuICBleHBvcnRzLmNhdGVnb3J5MjAgPSBjYXRlZ29yeTIwO1xuICBleHBvcnRzLmNhdGVnb3J5MjBiID0gY2F0ZWdvcnkyMGI7XG4gIGV4cG9ydHMuY2F0ZWdvcnkyMGMgPSBjYXRlZ29yeTIwYztcbiAgZXhwb3J0cy5pZGVudGl0eSA9IGlkZW50aXR5O1xuICBleHBvcnRzLmxpbmVhciA9IGxpbmVhcjtcbiAgZXhwb3J0cy5sb2cgPSBsb2c7XG4gIGV4cG9ydHMub3JkaW5hbCA9IG9yZGluYWw7XG4gIGV4cG9ydHMucG93ID0gcG93O1xuICBleHBvcnRzLnF1YW50aWxlID0gX3F1YW50aWxlO1xuICBleHBvcnRzLnF1YW50aXplID0gcXVhbnRpemU7XG4gIGV4cG9ydHMuc3FydCA9IHNxcnQ7XG4gIGV4cG9ydHMudGhyZXNob2xkID0gdGhyZXNob2xkO1xuXG59KSk7IiwiaWYgKHR5cGVvZiBNYXAgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgTWFwID0gZnVuY3Rpb24oKSB7fTtcbiAgTWFwLnByb3RvdHlwZSA9IHtcbiAgICBzZXQ6IGZ1bmN0aW9uKGssIHYpIHsgdGhpc1tcIiRcIiArIGtdID0gdjsgcmV0dXJuIHRoaXM7IH0sXG4gICAgZ2V0OiBmdW5jdGlvbihrKSB7IHJldHVybiB0aGlzW1wiJFwiICsga107IH0sXG4gICAgaGFzOiBmdW5jdGlvbihrKSB7IHJldHVybiBcIiRcIiArIGsgaW4gdGhpczsgfVxuICB9O1xufVxuXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAgIGdsb2JhbC5kMyA9IGZhY3RvcnkoKTtcbn0odGhpcywgZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgYnVnNDQwODMgPSB0eXBlb2YgbmF2aWdhdG9yICE9PSBcInVuZGVmaW5lZFwiICYmIC9XZWJLaXQvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgPyAtMSA6IDA7IC8vIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD00NDA4My8vIFdoZW4gZGVwdGggPSAxLCByb290ID0gW05vZGUsIOKApl0uXG4gICAgLy8gV2hlbiBkZXB0aCA9IDIsIHJvb3QgPSBbW05vZGUsIOKApl0sIOKApl0uXG4gICAgLy8gV2hlbiBkZXB0aCA9IDMsIHJvb3QgPSBbW1tOb2RlLCDigKZdLCDigKZdLCDigKZdLiBldGMuXG4gICAgLy8gTm90ZSB0aGF0IFtOb2RlLCDigKZdIGFuZCBOb2RlTGlzdCBhcmUgdXNlZCBpbnRlcmNoYW5nZWFibHk7IHNlZSBhcnJheWlmeS5cblxuICAgIGZ1bmN0aW9uIFNlbGVjdGlvbihyb290LCBkZXB0aCkge1xuICAgICAgdGhpcy5fcm9vdCA9IHJvb3Q7XG4gICAgICB0aGlzLl9kZXB0aCA9IGRlcHRoO1xuICAgICAgdGhpcy5fZW50ZXIgPSB0aGlzLl91cGRhdGUgPSB0aGlzLl9leGl0ID0gbnVsbDtcbiAgICB9XG4gICAgdmFyIGRlZmF1bHRWaWV3ID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgcmV0dXJuIG5vZGVcbiAgICAgICAgICAmJiAoKG5vZGUub3duZXJEb2N1bWVudCAmJiBub2RlLm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcpIC8vIG5vZGUgaXMgYSBOb2RlXG4gICAgICAgICAgICAgIHx8IChub2RlLmRvY3VtZW50ICYmIG5vZGUpIC8vIG5vZGUgaXMgYSBXaW5kb3dcbiAgICAgICAgICAgICAgfHwgbm9kZS5kZWZhdWx0Vmlldyk7IC8vIG5vZGUgaXMgYSBEb2N1bWVudFxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRpc3BhdGNoRXZlbnQobm9kZSwgdHlwZSwgcGFyYW1zKSB7XG4gICAgICB2YXIgd2luZG93ID0gZGVmYXVsdFZpZXcobm9kZSksXG4gICAgICAgICAgZXZlbnQgPSB3aW5kb3cuQ3VzdG9tRXZlbnQ7XG5cbiAgICAgIGlmIChldmVudCkge1xuICAgICAgICBldmVudCA9IG5ldyBldmVudCh0eXBlLCBwYXJhbXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXZlbnQgPSB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJFdmVudFwiKTtcbiAgICAgICAgaWYgKHBhcmFtcykgZXZlbnQuaW5pdEV2ZW50KHR5cGUsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSksIGV2ZW50LmRldGFpbCA9IHBhcmFtcy5kZXRhaWw7XG4gICAgICAgIGVsc2UgZXZlbnQuaW5pdEV2ZW50KHR5cGUsIGZhbHNlLCBmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIG5vZGUuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgfVxuXG4gICAgdmFyIHNlbGVjdGlvbl9kaXNwYXRjaCA9IGZ1bmN0aW9uKHR5cGUsIHBhcmFtcykge1xuXG4gICAgICBmdW5jdGlvbiBkaXNwYXRjaENvbnN0YW50KCkge1xuICAgICAgICByZXR1cm4gZGlzcGF0Y2hFdmVudCh0aGlzLCB0eXBlLCBwYXJhbXMpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBkaXNwYXRjaEZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZGlzcGF0Y2hFdmVudCh0aGlzLCB0eXBlLCBwYXJhbXMuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmVhY2godHlwZW9mIHBhcmFtcyA9PT0gXCJmdW5jdGlvblwiID8gZGlzcGF0Y2hGdW5jdGlvbiA6IGRpc3BhdGNoQ29uc3RhbnQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5vb3AoKSB7fVxuICAgIHZhciByZXF1b3RlUmUgPSAvW1xcXFxcXF5cXCRcXCpcXCtcXD9cXHxcXFtcXF1cXChcXClcXC5cXHtcXH1dL2c7XG5cbiAgICB2YXIgcmVxdW90ZSA9IGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKHJlcXVvdGVSZSwgXCJcXFxcJCZcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmlsdGVyTGlzdGVuZXJPZihsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciByZWxhdGVkID0gZXZlbnQucmVsYXRlZFRhcmdldDtcbiAgICAgICAgaWYgKCFyZWxhdGVkIHx8IChyZWxhdGVkICE9PSB0aGlzICYmICEocmVsYXRlZC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbih0aGlzKSAmIDgpKSkge1xuICAgICAgICAgIGxpc3RlbmVyKGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgZXZlbnQgPSBudWxsO1xuXG4gICAgZnVuY3Rpb24gbGlzdGVuZXJPZihsaXN0ZW5lciwgYW5jZXN0b3JzLCBhcmdzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZXZlbnQxKSB7XG4gICAgICAgIHZhciBpID0gYW5jZXN0b3JzLmxlbmd0aCwgZXZlbnQwID0gZXZlbnQ7IC8vIEV2ZW50cyBjYW4gYmUgcmVlbnRyYW50IChlLmcuLCBmb2N1cykuXG4gICAgICAgIHdoaWxlICgtLWkgPj0gMCkgYXJnc1tpIDw8IDFdID0gYW5jZXN0b3JzW2ldLl9fZGF0YV9fO1xuICAgICAgICBldmVudCA9IGV2ZW50MTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBsaXN0ZW5lci5hcHBseShhbmNlc3RvcnNbMF0sIGFyZ3MpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGV2ZW50ID0gZXZlbnQwO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhciBmaWx0ZXJFdmVudHMgPSBuZXcgTWFwO1xuXG4gICAgdmFyIHNlbGVjdGlvbl9ldmVudCA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyLCBjYXB0dXJlKSB7XG4gICAgICB2YXIgbiA9IGFyZ3VtZW50cy5sZW5ndGgsXG4gICAgICAgICAga2V5ID0gXCJfX29uXCIgKyB0eXBlLFxuICAgICAgICAgIGZpbHRlcixcbiAgICAgICAgICByb290ID0gdGhpcy5fcm9vdDtcblxuICAgICAgaWYgKG4gPCAyKSByZXR1cm4gKG4gPSB0aGlzLm5vZGUoKVtrZXldKSAmJiBuLl9saXN0ZW5lcjtcblxuICAgICAgaWYgKG4gPCAzKSBjYXB0dXJlID0gZmFsc2U7XG4gICAgICBpZiAoKG4gPSB0eXBlLmluZGV4T2YoXCIuXCIpKSA+IDApIHR5cGUgPSB0eXBlLnNsaWNlKDAsIG4pO1xuICAgICAgaWYgKGZpbHRlciA9IGZpbHRlckV2ZW50cy5oYXModHlwZSkpIHR5cGUgPSBmaWx0ZXJFdmVudHMuZ2V0KHR5cGUpO1xuXG4gICAgICBmdW5jdGlvbiBhZGQoKSB7XG4gICAgICAgIHZhciBhbmNlc3RvciA9IHJvb3QsIGkgPSBhcmd1bWVudHMubGVuZ3RoID4+IDEsIGFuY2VzdG9ycyA9IG5ldyBBcnJheShpKTtcbiAgICAgICAgd2hpbGUgKC0taSA+PSAwKSBhbmNlc3RvciA9IGFuY2VzdG9yW2FyZ3VtZW50c1soaSA8PCAxKSArIDFdXSwgYW5jZXN0b3JzW2ldID0gaSA/IGFuY2VzdG9yLl9wYXJlbnQgOiBhbmNlc3RvcjtcbiAgICAgICAgdmFyIGwgPSBsaXN0ZW5lck9mKGxpc3RlbmVyLCBhbmNlc3RvcnMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGlmIChmaWx0ZXIpIGwgPSBmaWx0ZXJMaXN0ZW5lck9mKGwpO1xuICAgICAgICByZW1vdmUuY2FsbCh0aGlzKTtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHR5cGUsIHRoaXNba2V5XSA9IGwsIGwuX2NhcHR1cmUgPSBjYXB0dXJlKTtcbiAgICAgICAgbC5fbGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgICB2YXIgbCA9IHRoaXNba2V5XTtcbiAgICAgICAgaWYgKGwpIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbCwgbC5fY2FwdHVyZSk7XG4gICAgICAgICAgZGVsZXRlIHRoaXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiByZW1vdmVBbGwoKSB7XG4gICAgICAgIHZhciByZSA9IG5ldyBSZWdFeHAoXCJeX19vbihbXi5dKylcIiArIHJlcXVvdGUodHlwZSkgKyBcIiRcIiksIG1hdGNoO1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICBpZiAobWF0Y2ggPSBuYW1lLm1hdGNoKHJlKSkge1xuICAgICAgICAgICAgdmFyIGwgPSB0aGlzW25hbWVdO1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKG1hdGNoWzFdLCBsLCBsLl9jYXB0dXJlKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzW25hbWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGxpc3RlbmVyXG4gICAgICAgICAgPyAobiA/IGFkZCA6IG5vb3ApIC8vIEF0dGVtcHQgdG8gYWRkIHVudHlwZWQgbGlzdGVuZXIgaXMgaWdub3JlZC5cbiAgICAgICAgICA6IChuID8gcmVtb3ZlIDogcmVtb3ZlQWxsKSk7XG4gICAgfVxuICAgIHZhciBzZWxlY3Rpb25fZGF0dW0gPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyB0aGlzLnByb3BlcnR5KFwiX19kYXRhX19cIiwgdmFsdWUpIDogdGhpcy5ub2RlKCkuX19kYXRhX187XG4gICAgfVxuICAgIHZhciBzZWxlY3Rpb25fcmVtb3ZlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuICAgICAgICBpZiAocGFyZW50KSBwYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdmFyIHNlbGVjdG9yT2YgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHZhciBuYW1lc3BhY2VzID0gKG5ldyBNYXApXG4gICAgICAgIC5zZXQoXCJzdmdcIiwgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiKVxuICAgICAgICAuc2V0KFwieGh0bWxcIiwgXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCIpXG4gICAgICAgIC5zZXQoXCJ4bGlua1wiLCBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIilcbiAgICAgICAgLnNldChcInhtbFwiLCBcImh0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZVwiKVxuICAgICAgICAuc2V0KFwieG1sbnNcIiwgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zL1wiKTtcblxuICAgIHZhciBuYW1lc3BhY2UgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgaSA9IG5hbWUuaW5kZXhPZihcIjpcIiksIHByZWZpeCA9IG5hbWU7XG4gICAgICBpZiAoaSA+PSAwKSBwcmVmaXggPSBuYW1lLnNsaWNlKDAsIGkpLCBuYW1lID0gbmFtZS5zbGljZShpICsgMSk7XG4gICAgICByZXR1cm4gbmFtZXNwYWNlcy5oYXMocHJlZml4KSA/IHtzcGFjZTogbmFtZXNwYWNlcy5nZXQocHJlZml4KSwgbG9jYWw6IG5hbWV9IDogbmFtZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdG9yT2YobmFtZSkge1xuICAgICAgbmFtZSA9IG5hbWVzcGFjZShuYW1lKTtcblxuICAgICAgZnVuY3Rpb24gY3JlYXRvcigpIHtcbiAgICAgICAgdmFyIGRvY3VtZW50ID0gdGhpcy5vd25lckRvY3VtZW50LFxuICAgICAgICAgICAgdXJpID0gdGhpcy5uYW1lc3BhY2VVUkk7XG4gICAgICAgIHJldHVybiB1cmlcbiAgICAgICAgICAgID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHVyaSwgbmFtZSlcbiAgICAgICAgICAgIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gY3JlYXRvck5TKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5hbWUubG9jYWwgPyBjcmVhdG9yTlMgOiBjcmVhdG9yO1xuICAgIH1cblxuICAgIHZhciBzZWxlY3Rpb25fYXBwZW5kID0gZnVuY3Rpb24oY3JlYXRvciwgc2VsZWN0b3IpIHtcbiAgICAgIGlmICh0eXBlb2YgY3JlYXRvciAhPT0gXCJmdW5jdGlvblwiKSBjcmVhdG9yID0gY3JlYXRvck9mKGNyZWF0b3IpO1xuXG4gICAgICBmdW5jdGlvbiBhcHBlbmQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwcGVuZENoaWxkKGNyZWF0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGluc2VydCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0QmVmb3JlKGNyZWF0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgc2VsZWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCBudWxsKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0KGFyZ3VtZW50cy5sZW5ndGggPCAyXG4gICAgICAgICAgPyBhcHBlbmRcbiAgICAgICAgICA6ICh0eXBlb2Ygc2VsZWN0b3IgIT09IFwiZnVuY3Rpb25cIiAmJiAoc2VsZWN0b3IgPSBzZWxlY3Rvck9mKHNlbGVjdG9yKSksIGluc2VydCkpO1xuICAgIH1cbiAgICB2YXIgc2VsZWN0aW9uX2h0bWwgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdGhpcy5ub2RlKCkuaW5uZXJIVE1MO1xuXG4gICAgICBmdW5jdGlvbiBzZXRDb25zdGFudCgpIHtcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2V0RnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSB2ID09IG51bGwgPyBcIlwiIDogdjtcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbHVlID09IG51bGwpIHZhbHVlID0gXCJcIjtcblxuICAgICAgcmV0dXJuIHRoaXMuZWFjaCh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIiA/IHNldEZ1bmN0aW9uIDogc2V0Q29uc3RhbnQpO1xuICAgIH1cbiAgICB2YXIgc2VsZWN0aW9uX3RleHQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdGhpcy5ub2RlKCkudGV4dENvbnRlbnQ7XG5cbiAgICAgIGZ1bmN0aW9uIHNldENvbnN0YW50KCkge1xuICAgICAgICB0aGlzLnRleHRDb250ZW50ID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNldEZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMudGV4dENvbnRlbnQgPSB2ID09IG51bGwgPyBcIlwiIDogdjtcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbHVlID09IG51bGwpIHZhbHVlID0gXCJcIjtcblxuICAgICAgcmV0dXJuIHRoaXMuZWFjaCh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIiA/IHNldEZ1bmN0aW9uIDogc2V0Q29uc3RhbnQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbGxhcHNlKHN0cmluZykge1xuICAgICAgcmV0dXJuIHN0cmluZy50cmltKCkucmVwbGFjZSgvXFxzKy9nLCBcIiBcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xhc3Nlck9mKG5hbWUpIHtcbiAgICAgIHZhciByZTtcbiAgICAgIHJldHVybiBmdW5jdGlvbihub2RlLCB2YWx1ZSkge1xuICAgICAgICBpZiAoYyA9IG5vZGUuY2xhc3NMaXN0KSByZXR1cm4gdmFsdWUgPyBjLmFkZChuYW1lKSA6IGMucmVtb3ZlKG5hbWUpO1xuICAgICAgICBpZiAoIXJlKSByZSA9IG5ldyBSZWdFeHAoXCIoPzpefFxcXFxzKylcIiArIHJlcXVvdGUobmFtZSkgKyBcIig/OlxcXFxzK3wkKVwiLCBcImdcIik7XG4gICAgICAgIHZhciBjID0gbm9kZS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiO1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICByZS5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgIGlmICghcmUudGVzdChjKSkgbm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBjb2xsYXBzZShjICsgXCIgXCIgKyBuYW1lKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBjb2xsYXBzZShjLnJlcGxhY2UocmUsIFwiIFwiKSkpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhciBzZWxlY3Rpb25fY2xhc3MgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgICAgbmFtZSA9IChuYW1lICsgXCJcIikudHJpbSgpLnNwbGl0KC9efFxccysvKTtcbiAgICAgIHZhciBuID0gbmFtZS5sZW5ndGg7XG5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgICB2YXIgbm9kZSA9IHRoaXMubm9kZSgpLCBpID0gLTE7XG4gICAgICAgIGlmICh2YWx1ZSA9IG5vZGUuY2xhc3NMaXN0KSB7IC8vIFNWRyBlbGVtZW50cyBtYXkgbm90IHN1cHBvcnQgRE9NVG9rZW5MaXN0IVxuICAgICAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoIXZhbHVlLmNvbnRhaW5zKG5hbWVbaV0pKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSBub2RlLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpO1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoIWNsYXNzZWRSZShuYW1lW2ldKS50ZXN0KHZhbHVlKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBuYW1lID0gbmFtZS5tYXAoY2xhc3Nlck9mKTtcblxuICAgICAgZnVuY3Rpb24gc2V0Q29uc3RhbnQoKSB7XG4gICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgIHdoaWxlICgrK2kgPCBuKSBuYW1lW2ldKHRoaXMsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2V0RnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpID0gLTEsIHggPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB3aGlsZSAoKytpIDwgbikgbmFtZVtpXSh0aGlzLCB4KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZWFjaCh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIiA/IHNldEZ1bmN0aW9uIDogc2V0Q29uc3RhbnQpO1xuICAgIH1cbiAgICB2YXIgc2VsZWN0aW9uX3Byb3BlcnR5ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgcmV0dXJuIHRoaXMubm9kZSgpW25hbWVdO1xuXG4gICAgICBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzW25hbWVdO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzZXRDb25zdGFudCgpIHtcbiAgICAgICAgdGhpc1tuYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzZXRGdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHggPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICBpZiAoeCA9PSBudWxsKSBkZWxldGUgdGhpc1tuYW1lXTtcbiAgICAgICAgZWxzZSB0aGlzW25hbWVdID0geDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZWFjaCh2YWx1ZSA9PSBudWxsID8gcmVtb3ZlIDogdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIgPyBzZXRGdW5jdGlvbiA6IHNldENvbnN0YW50KTtcbiAgICB9XG5cbiAgICB2YXIgc2VsZWN0aW9uX3N0eWxlID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG4gICAgICB2YXIgbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgICAgIGlmIChuIDwgMikgcmV0dXJuIGRlZmF1bHRWaWV3KG4gPSB0aGlzLm5vZGUoKSkuZ2V0Q29tcHV0ZWRTdHlsZShuLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpO1xuXG4gICAgICBpZiAobiA8IDMpIHByaW9yaXR5ID0gXCJcIjtcblxuICAgICAgZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgICB0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzZXRDb25zdGFudCgpIHtcbiAgICAgICAgdGhpcy5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzZXRGdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHggPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICBpZiAoeCA9PSBudWxsKSB0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpO1xuICAgICAgICBlbHNlIHRoaXMuc3R5bGUuc2V0UHJvcGVydHkobmFtZSwgeCwgcHJpb3JpdHkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5lYWNoKHZhbHVlID09IG51bGwgPyByZW1vdmUgOiB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIiA/IHNldEZ1bmN0aW9uIDogc2V0Q29uc3RhbnQpO1xuICAgIH1cblxuICAgIHZhciBzZWxlY3Rpb25fYXR0ciA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgICBuYW1lID0gbmFtZXNwYWNlKG5hbWUpO1xuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICAgICAgcmV0dXJuIG5hbWUubG9jYWxcbiAgICAgICAgICAgID8gbm9kZS5nZXRBdHRyaWJ1dGVOUyhuYW1lLnNwYWNlLCBuYW1lLmxvY2FsKVxuICAgICAgICAgICAgOiBub2RlLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVtb3ZlTlMoKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlTlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNldENvbnN0YW50KCkge1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNldENvbnN0YW50TlMoKSB7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlTlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbCwgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzZXRGdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHggPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICBpZiAoeCA9PSBudWxsKSB0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICAgICAgZWxzZSB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB4KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2V0RnVuY3Rpb25OUygpIHtcbiAgICAgICAgdmFyIHggPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICBpZiAoeCA9PSBudWxsKSB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5TKG5hbWUuc3BhY2UsIG5hbWUubG9jYWwpO1xuICAgICAgICBlbHNlIHRoaXMuc2V0QXR0cmlidXRlTlMobmFtZS5zcGFjZSwgbmFtZS5sb2NhbCwgeCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmVhY2godmFsdWUgPT0gbnVsbFxuICAgICAgICAgID8gKG5hbWUubG9jYWwgPyByZW1vdmVOUyA6IHJlbW92ZSlcbiAgICAgICAgICA6ICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgICAgICA/IChuYW1lLmxvY2FsID8gc2V0RnVuY3Rpb25OUyA6IHNldEZ1bmN0aW9uKVxuICAgICAgICAgICAgICA6IChuYW1lLmxvY2FsID8gc2V0Q29uc3RhbnROUyA6IHNldENvbnN0YW50KSkpO1xuICAgIH1cbiAgICB2YXIgc2VsZWN0aW9uX2VhY2ggPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgdmFyIGRlcHRoID0gdGhpcy5fZGVwdGgsXG4gICAgICAgICAgc3RhY2sgPSBuZXcgQXJyYXkoZGVwdGgpO1xuXG4gICAgICBmdW5jdGlvbiB2aXNpdChub2RlcywgZGVwdGgpIHtcbiAgICAgICAgdmFyIGkgPSAtMSxcbiAgICAgICAgICAgIG4gPSBub2Rlcy5sZW5ndGgsXG4gICAgICAgICAgICBub2RlO1xuXG4gICAgICAgIGlmICgtLWRlcHRoKSB7XG4gICAgICAgICAgdmFyIHN0YWNrMCA9IGRlcHRoICogMixcbiAgICAgICAgICAgICAgc3RhY2sxID0gc3RhY2swICsgMTtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgICAgaWYgKG5vZGUgPSBub2Rlc1tpXSkge1xuICAgICAgICAgICAgICBzdGFja1tzdGFjazBdID0gbm9kZS5fcGFyZW50Ll9fZGF0YV9fLCBzdGFja1tzdGFjazFdID0gaTtcbiAgICAgICAgICAgICAgdmlzaXQobm9kZSwgZGVwdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgICBpZiAobm9kZSA9IG5vZGVzW2ldKSB7XG4gICAgICAgICAgICAgIHN0YWNrWzBdID0gbm9kZS5fX2RhdGFfXywgc3RhY2tbMV0gPSBpO1xuICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShub2RlLCBzdGFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZpc2l0KHRoaXMuX3Jvb3QsIGRlcHRoKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB2YXIgc2VsZWN0aW9uX2VtcHR5ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gIXRoaXMubm9kZSgpO1xuICAgIH1cbiAgICB2YXIgc2VsZWN0aW9uX3NpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzaXplID0gMDtcbiAgICAgIHRoaXMuZWFjaChmdW5jdGlvbigpIHsgKytzaXplOyB9KTtcbiAgICAgIHJldHVybiBzaXplO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpcnN0Tm9kZShub2RlcywgZGVwdGgpIHtcbiAgICAgIHZhciBpID0gLTEsXG4gICAgICAgICAgbiA9IG5vZGVzLmxlbmd0aCxcbiAgICAgICAgICBub2RlO1xuXG4gICAgICBpZiAoLS1kZXB0aCkge1xuICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgIGlmIChub2RlID0gbm9kZXNbaV0pIHtcbiAgICAgICAgICAgIGlmIChub2RlID0gZmlyc3ROb2RlKG5vZGUsIGRlcHRoKSkge1xuICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZWxzZSB7XG4gICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgaWYgKG5vZGUgPSBub2Rlc1tpXSkge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBzZWxlY3Rpb25fbm9kZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZpcnN0Tm9kZSh0aGlzLl9yb290LCB0aGlzLl9kZXB0aCk7XG4gICAgfVxuICAgIHZhciBzZWxlY3Rpb25fbm9kZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBub2RlcyA9IG5ldyBBcnJheSh0aGlzLnNpemUoKSksIGkgPSAtMTtcbiAgICAgIHRoaXMuZWFjaChmdW5jdGlvbigpIHsgbm9kZXNbKytpXSA9IHRoaXM7IH0pO1xuICAgICAgcmV0dXJuIG5vZGVzO1xuICAgIH1cbiAgICB2YXIgc2VsZWN0aW9uX2NhbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50c1swXTtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KGFyZ3VtZW50c1swXSA9IHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcnJheWlmeU5vZGUobm9kZXMsIGRlcHRoKSB7XG4gICAgICB2YXIgaSA9IC0xLFxuICAgICAgICAgIG4gPSBub2Rlcy5sZW5ndGgsXG4gICAgICAgICAgbm9kZTtcblxuICAgICAgaWYgKC0tZGVwdGgpIHtcbiAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICBpZiAobm9kZSA9IG5vZGVzW2ldKSB7XG4gICAgICAgICAgICBub2Rlc1tpXSA9IGFycmF5aWZ5Tm9kZShub2RlLCBkZXB0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KG5vZGVzKSkge1xuICAgICAgICB2YXIgYXJyYXkgPSBuZXcgQXJyYXkobik7XG4gICAgICAgIHdoaWxlICgrK2kgPCBuKSBhcnJheVtpXSA9IG5vZGVzW2ldO1xuICAgICAgICBhcnJheS5fcGFyZW50ID0gbm9kZXMuX3BhcmVudDtcbiAgICAgICAgbm9kZXMgPSBhcnJheTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5vZGVzO1xuICAgIH0vLyBUaGUgbGVhZiBncm91cHMgb2YgdGhlIHNlbGVjdGlvbiBoaWVyYXJjaHkgYXJlIGluaXRpYWxseSBOb2RlTGlzdCxcbiAgICAvLyBhbmQgdGhlbiBsYXppbHkgY29udmVydGVkIHRvIGFycmF5cyB3aGVuIG11dGF0aW9uIGlzIHJlcXVpcmVkLlxuICAgIHZhciBhcnJheWlmeSA9IGZ1bmN0aW9uKHNlbGVjdGlvbikge1xuICAgICAgcmV0dXJuIHNlbGVjdGlvbi5fcm9vdCA9IGFycmF5aWZ5Tm9kZShzZWxlY3Rpb24uX3Jvb3QsIHNlbGVjdGlvbi5fZGVwdGgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFzY2VuZGluZyhhLCBiKSB7XG4gICAgICByZXR1cm4gYSA8IGIgPyAtMSA6IGEgPiBiID8gMSA6IGEgPj0gYiA/IDAgOiBOYU47XG4gICAgfVxuXG4gICAgdmFyIHNlbGVjdGlvbl9zb3J0ID0gZnVuY3Rpb24oY29tcGFyYXRvcikge1xuICAgICAgaWYgKCFjb21wYXJhdG9yKSBjb21wYXJhdG9yID0gYXNjZW5kaW5nO1xuXG4gICAgICBmdW5jdGlvbiBjb21wYXJlKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEgJiYgYiA/IGNvbXBhcmF0b3IoYS5fX2RhdGFfXywgYi5fX2RhdGFfXykgOiAhYSAtICFiO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiB2aXNpdChub2RlcywgZGVwdGgpIHtcbiAgICAgICAgaWYgKC0tZGVwdGgpIHtcbiAgICAgICAgICB2YXIgaSA9IC0xLFxuICAgICAgICAgICAgICBuID0gbm9kZXMubGVuZ3RoLFxuICAgICAgICAgICAgICBub2RlO1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgICBpZiAobm9kZSA9IG5vZGVzW2ldKSB7XG4gICAgICAgICAgICAgIHZpc2l0KG5vZGUsIGRlcHRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBub2Rlcy5zb3J0KGNvbXBhcmUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZpc2l0KGFycmF5aWZ5KHRoaXMpLCB0aGlzLl9kZXB0aCk7XG4gICAgICByZXR1cm4gdGhpcy5vcmRlcigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9yZGVyTm9kZShub2RlcywgZGVwdGgpIHtcbiAgICAgIHZhciBpID0gbm9kZXMubGVuZ3RoLFxuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgbmV4dDtcblxuICAgICAgaWYgKC0tZGVwdGgpIHtcbiAgICAgICAgd2hpbGUgKC0taSA+PSAwKSB7XG4gICAgICAgICAgaWYgKG5vZGUgPSBub2Rlc1tpXSkge1xuICAgICAgICAgICAgb3JkZXJOb2RlKG5vZGUsIGRlcHRoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZWxzZSB7XG4gICAgICAgIG5leHQgPSBub2Rlc1stLWldO1xuICAgICAgICB3aGlsZSAoLS1pID49IDApIHtcbiAgICAgICAgICBpZiAobm9kZSA9IG5vZGVzW2ldKSB7XG4gICAgICAgICAgICBpZiAobmV4dCAmJiBuZXh0ICE9PSBub2RlLm5leHRTaWJsaW5nKSBuZXh0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIG5leHQpO1xuICAgICAgICAgICAgbmV4dCA9IG5vZGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBzZWxlY3Rpb25fb3JkZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIG9yZGVyTm9kZSh0aGlzLl9yb290LCB0aGlzLl9kZXB0aCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbXB0eU5vZGUobm9kZXMsIGRlcHRoKSB7XG4gICAgICB2YXIgaSA9IC0xLFxuICAgICAgICAgIG4gPSBub2Rlcy5sZW5ndGgsXG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBlbXB0eSA9IG5ldyBBcnJheShuKTtcblxuICAgICAgaWYgKC0tZGVwdGgpIHtcbiAgICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgICBpZiAobm9kZSA9IG5vZGVzW2ldKSB7XG4gICAgICAgICAgICBlbXB0eVtpXSA9IGVtcHR5Tm9kZShub2RlLCBkZXB0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGVtcHR5Ll9wYXJlbnQgPSBub2Rlcy5fcGFyZW50O1xuICAgICAgcmV0dXJuIGVtcHR5O1xuICAgIH1cblxuICAgIHZhciBlbXB0eU9mID0gZnVuY3Rpb24oc2VsZWN0aW9uKSB7XG4gICAgICByZXR1cm4gbmV3IFNlbGVjdGlvbihlbXB0eU5vZGUoYXJyYXlpZnkoc2VsZWN0aW9uKSwgc2VsZWN0aW9uLl9kZXB0aCksIHNlbGVjdGlvbi5fZGVwdGgpO1xuICAgIH0vLyBMYXppbHkgY29uc3RydWN0cyB0aGUgZXhpdCBzZWxlY3Rpb24gZm9yIHRoaXMgKHVwZGF0ZSkgc2VsZWN0aW9uLlxuICAgIC8vIFVudGlsIHRoaXMgc2VsZWN0aW9uIGlzIGpvaW5lZCB0byBkYXRhLCB0aGUgZXhpdCBzZWxlY3Rpb24gd2lsbCBiZSBlbXB0eS5cblxuICAgIHZhciBzZWxlY3Rpb25fZXhpdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2V4aXQgfHwgKHRoaXMuX2V4aXQgPSBlbXB0eU9mKHRoaXMpKTtcbiAgICB9Ly8gTGF6aWx5IGNvbnN0cnVjdHMgdGhlIGVudGVyIHNlbGVjdGlvbiBmb3IgdGhpcyAodXBkYXRlKSBzZWxlY3Rpb24uXG4gICAgLy8gVW50aWwgdGhpcyBzZWxlY3Rpb24gaXMgam9pbmVkIHRvIGRhdGEsIHRoZSBlbnRlciBzZWxlY3Rpb24gd2lsbCBiZSBlbXB0eS5cblxuICAgIHZhciBzZWxlY3Rpb25fZW50ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghdGhpcy5fZW50ZXIpIHtcbiAgICAgICAgdGhpcy5fZW50ZXIgPSBlbXB0eU9mKHRoaXMpO1xuICAgICAgICB0aGlzLl9lbnRlci5fdXBkYXRlID0gdGhpcztcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl9lbnRlcjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBFbnRlck5vZGUocGFyZW50LCBkYXR1bSkge1xuICAgICAgdGhpcy5vd25lckRvY3VtZW50ID0gcGFyZW50Lm93bmVyRG9jdW1lbnQ7XG4gICAgICB0aGlzLm5hbWVzcGFjZVVSSSA9IHBhcmVudC5uYW1lc3BhY2VVUkk7XG4gICAgICB0aGlzLl9uZXh0ID0gbnVsbDtcbiAgICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICAgIHRoaXMuX19kYXRhX18gPSBkYXR1bTtcbiAgICB9XG5cbiAgICBFbnRlck5vZGUucHJvdG90eXBlID0ge1xuICAgICAgYXBwZW5kQ2hpbGQ6IGZ1bmN0aW9uKGNoaWxkKSB7IHJldHVybiB0aGlzLl9wYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLCB0aGlzLl9uZXh0KTsgfSxcbiAgICAgIGluc2VydEJlZm9yZTogZnVuY3Rpb24oY2hpbGQsIG5leHQpIHsgcmV0dXJuIHRoaXMuX3BhcmVudC5pbnNlcnRCZWZvcmUoY2hpbGQsIG5leHQgfHwgdGhpcy5fbmV4dCk7IH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gdmFsdWVPZl8odmFsdWUpIHsgLy8gWFhYIGh0dHBzOi8vZ2l0aHViLmNvbS9yb2xsdXAvcm9sbHVwL2lzc3Vlcy8xMlxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9O1xuICAgIH0vLyBUaGUgdmFsdWUgbWF5IGVpdGhlciBiZSBhbiBhcnJheSBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBhcnJheS5cbiAgICAvLyBBbiBvcHRpb25hbCBrZXkgZnVuY3Rpb24gbWF5IGJlIHNwZWNpZmllZCB0byBjb250cm9sIGhvdyBkYXRhIGlzIGJvdW5kO1xuICAgIC8vIGlmIG5vIGtleSBmdW5jdGlvbiBpcyBzcGVjaWZpZWQsIGRhdGEgaXMgYm91bmQgdG8gbm9kZXMgYnkgaW5kZXguXG4gICAgLy8gT3IsIGlmIG5vIGFyZ3VtZW50cyBhcmUgc3BlY2lmaWVkLCB0aGlzIG1ldGhvZCByZXR1cm5zIGFsbCBib3VuZCBkYXRhLlxuICAgIHZhciBzZWxlY3Rpb25fZGF0YSA9IGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBuZXcgQXJyYXkodGhpcy5zaXplKCkpLCBpID0gLTE7XG4gICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbihkKSB7IGRhdGFbKytpXSA9IGQ7IH0pO1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgIH1cblxuICAgICAgdmFyIGRlcHRoID0gdGhpcy5fZGVwdGggLSAxLFxuICAgICAgICAgIHN0YWNrID0gbmV3IEFycmF5KGRlcHRoICogMiksXG4gICAgICAgICAgYmluZCA9IGtleSA/IGJpbmRLZXkgOiBiaW5kSW5kZXg7XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIikgdmFsdWUgPSB2YWx1ZU9mXyh2YWx1ZSk7XG4gICAgICB2aXNpdCh0aGlzLl9yb290LCB0aGlzLmVudGVyKCkuX3Jvb3QsIHRoaXMuZXhpdCgpLl9yb290LCBkZXB0aCk7XG5cbiAgICAgIGZ1bmN0aW9uIHZpc2l0KHVwZGF0ZSwgZW50ZXIsIGV4aXQsIGRlcHRoKSB7XG4gICAgICAgIHZhciBpID0gLTEsXG4gICAgICAgICAgICBuLFxuICAgICAgICAgICAgbm9kZTtcblxuICAgICAgICBpZiAoZGVwdGgtLSkge1xuICAgICAgICAgIHZhciBzdGFjazAgPSBkZXB0aCAqIDIsXG4gICAgICAgICAgICAgIHN0YWNrMSA9IHN0YWNrMCArIDE7XG5cbiAgICAgICAgICBuID0gdXBkYXRlLmxlbmd0aDtcblxuICAgICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgICBpZiAobm9kZSA9IHVwZGF0ZVtpXSkge1xuICAgICAgICAgICAgICBzdGFja1tzdGFjazBdID0gbm9kZS5fcGFyZW50Ll9fZGF0YV9fLCBzdGFja1tzdGFjazFdID0gaTtcbiAgICAgICAgICAgICAgdmlzaXQobm9kZSwgZW50ZXJbaV0sIGV4aXRbaV0sIGRlcHRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB2YXIgaiA9IDAsXG4gICAgICAgICAgICAgIGJlZm9yZTtcblxuICAgICAgICAgIGJpbmQodXBkYXRlLCBlbnRlciwgZXhpdCwgdmFsdWUuYXBwbHkodXBkYXRlLl9wYXJlbnQsIHN0YWNrKSk7XG4gICAgICAgICAgbiA9IHVwZGF0ZS5sZW5ndGg7XG5cbiAgICAgICAgICAvLyBOb3cgY29ubmVjdCB0aGUgZW50ZXIgbm9kZXMgdG8gdGhlaXIgZm9sbG93aW5nIHVwZGF0ZSBub2RlLCBzdWNoIHRoYXRcbiAgICAgICAgICAvLyBhcHBlbmRDaGlsZCBjYW4gaW5zZXJ0IHRoZSBtYXRlcmlhbGl6ZWQgZW50ZXIgbm9kZSBiZWZvcmUgdGhpcyBub2RlLFxuICAgICAgICAgIC8vIHJhdGhlciB0aGFuIGF0IHRoZSBlbmQgb2YgdGhlIHBhcmVudCBub2RlLlxuICAgICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgICBpZiAoYmVmb3JlID0gZW50ZXJbaV0pIHtcbiAgICAgICAgICAgICAgaWYgKGkgPj0gaikgaiA9IGkgKyAxO1xuICAgICAgICAgICAgICB3aGlsZSAoIShub2RlID0gdXBkYXRlW2pdKSAmJiArK2ogPCBuKTtcbiAgICAgICAgICAgICAgYmVmb3JlLl9uZXh0ID0gbm9kZSB8fCBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBiaW5kSW5kZXgodXBkYXRlLCBlbnRlciwgZXhpdCwgZGF0YSkge1xuICAgICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbm9kZUxlbmd0aCA9IHVwZGF0ZS5sZW5ndGgsXG4gICAgICAgICAgICBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGgsXG4gICAgICAgICAgICBtaW5MZW5ndGggPSBNYXRoLm1pbihub2RlTGVuZ3RoLCBkYXRhTGVuZ3RoKTtcblxuICAgICAgICAvLyBDbGVhciB0aGUgZW50ZXIgYW5kIGV4aXQgYXJyYXlzLCBhbmQgdGhlbiBpbml0aWFsaXplIHRvIHRoZSBuZXcgbGVuZ3RoLlxuICAgICAgICBlbnRlci5sZW5ndGggPSAwLCBlbnRlci5sZW5ndGggPSBkYXRhTGVuZ3RoO1xuICAgICAgICBleGl0Lmxlbmd0aCA9IDAsIGV4aXQubGVuZ3RoID0gbm9kZUxlbmd0aDtcblxuICAgICAgICBmb3IgKDsgaSA8IG1pbkxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgaWYgKG5vZGUgPSB1cGRhdGVbaV0pIHtcbiAgICAgICAgICAgIG5vZGUuX19kYXRhX18gPSBkYXRhW2ldO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbnRlcltpXSA9IG5ldyBFbnRlck5vZGUodXBkYXRlLl9wYXJlbnQsIGRhdGFbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vdGU6IHdlIGRvbuKAmXQgbmVlZCB0byBkZWxldGUgdXBkYXRlW2ldIGhlcmUgYmVjYXVzZSB0aGlzIGxvb3Agb25seVxuICAgICAgICAvLyBydW5zIHdoZW4gdGhlIGRhdGEgbGVuZ3RoIGlzIGdyZWF0ZXIgdGhhbiB0aGUgbm9kZSBsZW5ndGguXG4gICAgICAgIGZvciAoOyBpIDwgZGF0YUxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgZW50ZXJbaV0gPSBuZXcgRW50ZXJOb2RlKHVwZGF0ZS5fcGFyZW50LCBkYXRhW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vdGU6IGFuZCwgd2UgZG9u4oCZdCBuZWVkIHRvIGRlbGV0ZSB1cGRhdGVbaV0gaGVyZSBiZWNhdXNlIGltbWVkaWF0ZWx5XG4gICAgICAgIC8vIGZvbGxvd2luZyB0aGlzIGxvb3Agd2Ugc2V0IHRoZSB1cGRhdGUgbGVuZ3RoIHRvIGRhdGEgbGVuZ3RoLlxuICAgICAgICBmb3IgKDsgaSA8IG5vZGVMZW5ndGg7ICsraSkge1xuICAgICAgICAgIGlmIChub2RlID0gdXBkYXRlW2ldKSB7XG4gICAgICAgICAgICBleGl0W2ldID0gdXBkYXRlW2ldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZS5sZW5ndGggPSBkYXRhTGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBiaW5kS2V5KHVwZGF0ZSwgZW50ZXIsIGV4aXQsIGRhdGEpIHtcbiAgICAgICAgdmFyIGksXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoLFxuICAgICAgICAgICAgbm9kZUxlbmd0aCA9IHVwZGF0ZS5sZW5ndGgsXG4gICAgICAgICAgICBub2RlQnlLZXlWYWx1ZSA9IG5ldyBNYXAsXG4gICAgICAgICAgICBrZXlTdGFjayA9IG5ldyBBcnJheSgyKS5jb25jYXQoc3RhY2spLFxuICAgICAgICAgICAga2V5VmFsdWVzID0gbmV3IEFycmF5KG5vZGVMZW5ndGgpLFxuICAgICAgICAgICAga2V5VmFsdWU7XG5cbiAgICAgICAgLy8gQ2xlYXIgdGhlIGVudGVyIGFuZCBleGl0IGFycmF5cywgYW5kIHRoZW4gaW5pdGlhbGl6ZSB0byB0aGUgbmV3IGxlbmd0aC5cbiAgICAgICAgZW50ZXIubGVuZ3RoID0gMCwgZW50ZXIubGVuZ3RoID0gZGF0YUxlbmd0aDtcbiAgICAgICAgZXhpdC5sZW5ndGggPSAwLCBleGl0Lmxlbmd0aCA9IG5vZGVMZW5ndGg7XG5cbiAgICAgICAgLy8gQ29tcHV0ZSB0aGUga2V5cyBmb3IgZWFjaCBub2RlLlxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbm9kZUxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgaWYgKG5vZGUgPSB1cGRhdGVbaV0pIHtcbiAgICAgICAgICAgIGtleVN0YWNrWzBdID0gbm9kZS5fX2RhdGFfXywga2V5U3RhY2tbMV0gPSBpO1xuICAgICAgICAgICAga2V5VmFsdWVzW2ldID0ga2V5VmFsdWUgPSBrZXkuYXBwbHkobm9kZSwga2V5U3RhY2spO1xuXG4gICAgICAgICAgICAvLyBJcyB0aGlzIGEgZHVwbGljYXRlIG9mIGEga2V5IHdl4oCZdmUgcHJldmlvdXNseSBzZWVuP1xuICAgICAgICAgICAgLy8gSWYgc28sIHRoaXMgbm9kZSBpcyBtb3ZlZCB0byB0aGUgZXhpdCBzZWxlY3Rpb24uXG4gICAgICAgICAgICBpZiAobm9kZUJ5S2V5VmFsdWUuaGFzKGtleVZhbHVlKSkge1xuICAgICAgICAgICAgICBleGl0W2ldID0gbm9kZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCByZWNvcmQgdGhlIG1hcHBpbmcgZnJvbSBrZXkgdG8gbm9kZS5cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBub2RlQnlLZXlWYWx1ZS5zZXQoa2V5VmFsdWUsIG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vdyBjbGVhciB0aGUgdXBkYXRlIGFycmF5IGFuZCBpbml0aWFsaXplIHRvIHRoZSBuZXcgbGVuZ3RoLlxuICAgICAgICB1cGRhdGUubGVuZ3RoID0gMCwgdXBkYXRlLmxlbmd0aCA9IGRhdGFMZW5ndGg7XG5cbiAgICAgICAgLy8gQ29tcHV0ZSB0aGUga2V5cyBmb3IgZWFjaCBkYXR1bS5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGRhdGFMZW5ndGg7ICsraSkge1xuICAgICAgICAgIGtleVN0YWNrWzBdID0gZGF0YVtpXSwga2V5U3RhY2tbMV0gPSBpO1xuICAgICAgICAgIGtleVZhbHVlID0ga2V5LmFwcGx5KHVwZGF0ZS5fcGFyZW50LCBrZXlTdGFjayk7XG5cbiAgICAgICAgICAvLyBJcyB0aGVyZSBhIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMga2V5P1xuICAgICAgICAgIC8vIElmIG5vdCwgdGhpcyBkYXR1bSBpcyBhZGRlZCB0byB0aGUgZW50ZXIgc2VsZWN0aW9uLlxuICAgICAgICAgIGlmICghKG5vZGUgPSBub2RlQnlLZXlWYWx1ZS5nZXQoa2V5VmFsdWUpKSkge1xuICAgICAgICAgICAgZW50ZXJbaV0gPSBuZXcgRW50ZXJOb2RlKHVwZGF0ZS5fcGFyZW50LCBkYXRhW2ldKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBEaWQgd2UgYWxyZWFkeSBiaW5kIGEgbm9kZSB1c2luZyB0aGlzIGtleT8gKE9yIGlzIGEgZHVwbGljYXRlPylcbiAgICAgICAgICAvLyBJZiB1bmlxdWUsIHRoZSBub2RlIGFuZCBkYXR1bSBhcmUgam9pbmVkIGluIHRoZSB1cGRhdGUgc2VsZWN0aW9uLlxuICAgICAgICAgIC8vIE90aGVyd2lzZSwgdGhlIGRhdHVtIGlzIGlnbm9yZWQsIG5laXRoZXIgZW50ZXJpbmcgbm9yIGV4aXRpbmcuXG4gICAgICAgICAgZWxzZSBpZiAobm9kZSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdXBkYXRlW2ldID0gbm9kZTtcbiAgICAgICAgICAgIG5vZGUuX19kYXRhX18gPSBkYXRhW2ldO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFJlY29yZCB0aGF0IHdlIGNvbnN1bWVkIHRoaXMga2V5LCBlaXRoZXIgdG8gZW50ZXIgb3IgdXBkYXRlLlxuICAgICAgICAgIG5vZGVCeUtleVZhbHVlLnNldChrZXlWYWx1ZSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUYWtlIGFueSByZW1haW5pbmcgbm9kZXMgdGhhdCB3ZXJlIG5vdCBib3VuZCB0byBkYXRhLFxuICAgICAgICAvLyBhbmQgcGxhY2UgdGhlbSBpbiB0aGUgZXhpdCBzZWxlY3Rpb24uXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBub2RlTGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICBpZiAoKG5vZGUgPSBub2RlQnlLZXlWYWx1ZS5nZXQoa2V5VmFsdWVzW2ldKSkgIT09IHRydWUpIHtcbiAgICAgICAgICAgIGV4aXRbaV0gPSBub2RlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB2YXIgZmlsdGVyT2YgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXRjaGVzKHNlbGVjdG9yKTtcbiAgICAgIH07XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgaWYgKCFlbGVtZW50Lm1hdGNoZXMpIHtcbiAgICAgICAgdmFyIHZlbmRvck1hdGNoZXMgPSBlbGVtZW50LndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fCBlbGVtZW50Lm1zTWF0Y2hlc1NlbGVjdG9yIHx8IGVsZW1lbnQubW96TWF0Y2hlc1NlbGVjdG9yIHx8IGVsZW1lbnQub01hdGNoZXNTZWxlY3RvcjtcbiAgICAgICAgZmlsdGVyT2YgPSBmdW5jdGlvbihzZWxlY3RvcikgeyByZXR1cm4gZnVuY3Rpb24oKSB7IHJldHVybiB2ZW5kb3JNYXRjaGVzLmNhbGwodGhpcywgc2VsZWN0b3IpOyB9OyB9O1xuICAgICAgfVxuICAgIH0vLyBUaGUgZmlsdGVyIG1heSBlaXRoZXIgYmUgYSBzZWxlY3RvciBzdHJpbmcgKGUuZy4sIFwiLmZvb1wiKVxuICAgIC8vIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgYm9vbGVhbi5cblxuICAgIHZhciBzZWxlY3Rpb25fZmlsdGVyID0gZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgICB2YXIgZGVwdGggPSB0aGlzLl9kZXB0aCxcbiAgICAgICAgICBzdGFjayA9IG5ldyBBcnJheShkZXB0aCAqIDIpO1xuXG4gICAgICBpZiAodHlwZW9mIGZpbHRlciAhPT0gXCJmdW5jdGlvblwiKSBmaWx0ZXIgPSBmaWx0ZXJPZihmaWx0ZXIpO1xuXG4gICAgICBmdW5jdGlvbiB2aXNpdChub2RlcywgZGVwdGgpIHtcbiAgICAgICAgdmFyIGkgPSAtMSxcbiAgICAgICAgICAgIG4gPSBub2Rlcy5sZW5ndGgsXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgc3Vibm9kZXM7XG5cbiAgICAgICAgaWYgKC0tZGVwdGgpIHtcbiAgICAgICAgICB2YXIgc3RhY2swID0gZGVwdGggKiAyLFxuICAgICAgICAgICAgICBzdGFjazEgPSBzdGFjazAgKyAxO1xuICAgICAgICAgIHN1Ym5vZGVzID0gbmV3IEFycmF5KG4pO1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgICBpZiAobm9kZSA9IG5vZGVzW2ldKSB7XG4gICAgICAgICAgICAgIHN0YWNrW3N0YWNrMF0gPSBub2RlLl9wYXJlbnQuX19kYXRhX18sIHN0YWNrW3N0YWNrMV0gPSBpO1xuICAgICAgICAgICAgICBzdWJub2Rlc1tpXSA9IHZpc2l0KG5vZGUsIGRlcHRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgZmlsdGVyIG9wZXJhdGlvbiBkb2VzIG5vdCBwcmVzZXJ2ZSB0aGUgb3JpZ2luYWwgaW5kZXgsXG4gICAgICAgIC8vIHNvIHRoZSByZXN1bHRpbmcgbGVhZiBncm91cHMgYXJlIGRlbnNlIChub3Qgc3BhcnNlKS5cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgc3Vibm9kZXMgPSBbXTtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgICAgaWYgKG5vZGUgPSBub2Rlc1tpXSkge1xuICAgICAgICAgICAgICBzdGFja1swXSA9IG5vZGUuX19kYXRhX18sIHN0YWNrWzFdID0gaTtcbiAgICAgICAgICAgICAgaWYgKGZpbHRlci5hcHBseShub2RlLCBzdGFjaykpIHtcbiAgICAgICAgICAgICAgICBzdWJub2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3Vibm9kZXMuX3BhcmVudCA9IG5vZGVzLl9wYXJlbnQ7XG4gICAgICAgIHJldHVybiBzdWJub2RlcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBTZWxlY3Rpb24odmlzaXQodGhpcy5fcm9vdCwgZGVwdGgpLCBkZXB0aCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2VsZWN0b3JBbGxPZihzZWxlY3Rvcikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgICAgIH07XG4gICAgfS8vIFRoZSBzZWxlY3RvciBtYXkgZWl0aGVyIGJlIGEgc2VsZWN0b3Igc3RyaW5nIChlLmcuLCBcIi5mb29cIilcbiAgICAvLyBvciBhIGZ1bmN0aW9uIHRoYXQgb3B0aW9uYWxseSByZXR1cm5zIGFuIGFycmF5IG9mIG5vZGVzIHRvIHNlbGVjdC5cbiAgICAvLyBUaGlzIGlzIHRoZSBvbmx5IG9wZXJhdGlvbiB0aGF0IGluY3JlYXNlcyB0aGUgZGVwdGggb2YgYSBzZWxlY3Rpb24uXG5cbiAgICB2YXIgc2VsZWN0aW9uX3NlbGVjdEFsbCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgICB2YXIgZGVwdGggPSB0aGlzLl9kZXB0aCxcbiAgICAgICAgICBzdGFjayA9IG5ldyBBcnJheShkZXB0aCAqIDIpO1xuXG4gICAgICBpZiAodHlwZW9mIHNlbGVjdG9yICE9PSBcImZ1bmN0aW9uXCIpIHNlbGVjdG9yID0gc2VsZWN0b3JBbGxPZihzZWxlY3Rvcik7XG5cbiAgICAgIGZ1bmN0aW9uIHZpc2l0KG5vZGVzLCBkZXB0aCkge1xuICAgICAgICB2YXIgaSA9IC0xLFxuICAgICAgICAgICAgbiA9IG5vZGVzLmxlbmd0aCxcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBzdWJub2RlLFxuICAgICAgICAgICAgc3Vibm9kZXMgPSBuZXcgQXJyYXkobik7XG5cbiAgICAgICAgaWYgKC0tZGVwdGgpIHtcbiAgICAgICAgICB2YXIgc3RhY2swID0gZGVwdGggKiAyLFxuICAgICAgICAgICAgICBzdGFjazEgPSBzdGFjazAgKyAxO1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgICBpZiAobm9kZSA9IG5vZGVzW2ldKSB7XG4gICAgICAgICAgICAgIHN0YWNrW3N0YWNrMF0gPSBub2RlLl9wYXJlbnQuX19kYXRhX18sIHN0YWNrW3N0YWNrMV0gPSBpO1xuICAgICAgICAgICAgICBzdWJub2Rlc1tpXSA9IHZpc2l0KG5vZGUsIGRlcHRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEYXRhIGlzIG5vdCBwcm9wYWdhdGVkIHNpbmNlIHRoZXJlIGlzIGEgb25lLXRvLW1hbnkgbWFwcGluZy5cbiAgICAgICAgLy8gVGhlIHBhcmVudCBvZiB0aGUgbmV3IGxlYWYgZ3JvdXAgaXMgdGhlIG9sZCBub2RlLlxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgICAgaWYgKG5vZGUgPSBub2Rlc1tpXSkge1xuICAgICAgICAgICAgICBzdGFja1swXSA9IG5vZGUuX19kYXRhX18sIHN0YWNrWzFdID0gaTtcbiAgICAgICAgICAgICAgc3Vibm9kZXNbaV0gPSBzdWJub2RlID0gc2VsZWN0b3IuYXBwbHkobm9kZSwgc3RhY2spO1xuICAgICAgICAgICAgICBzdWJub2RlLl9wYXJlbnQgPSBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN1Ym5vZGVzLl9wYXJlbnQgPSBub2Rlcy5fcGFyZW50O1xuICAgICAgICByZXR1cm4gc3Vibm9kZXM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgU2VsZWN0aW9uKHZpc2l0KHRoaXMuX3Jvb3QsIGRlcHRoKSwgZGVwdGggKyAxKTtcbiAgICB9Ly8gVGhlIHNlbGVjdG9yIG1heSBlaXRoZXIgYmUgYSBzZWxlY3RvciBzdHJpbmcgKGUuZy4sIFwiLmZvb1wiKVxuICAgIC8vIG9yIGEgZnVuY3Rpb24gdGhhdCBvcHRpb25hbGx5IHJldHVybnMgdGhlIG5vZGUgdG8gc2VsZWN0LlxuXG4gICAgdmFyIHNlbGVjdGlvbl9zZWxlY3QgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICAgICAgdmFyIGRlcHRoID0gdGhpcy5fZGVwdGgsXG4gICAgICAgICAgc3RhY2sgPSBuZXcgQXJyYXkoZGVwdGggKiAyKTtcblxuICAgICAgaWYgKHR5cGVvZiBzZWxlY3RvciAhPT0gXCJmdW5jdGlvblwiKSBzZWxlY3RvciA9IHNlbGVjdG9yT2Yoc2VsZWN0b3IpO1xuXG4gICAgICBmdW5jdGlvbiB2aXNpdChub2RlcywgdXBkYXRlLCBkZXB0aCkge1xuICAgICAgICB2YXIgaSA9IC0xLFxuICAgICAgICAgICAgbiA9IG5vZGVzLmxlbmd0aCxcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBzdWJub2RlLFxuICAgICAgICAgICAgc3Vibm9kZXMgPSBuZXcgQXJyYXkobik7XG5cbiAgICAgICAgaWYgKC0tZGVwdGgpIHtcbiAgICAgICAgICB2YXIgc3RhY2swID0gZGVwdGggKiAyLFxuICAgICAgICAgICAgICBzdGFjazEgPSBzdGFjazAgKyAxO1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgICBpZiAobm9kZSA9IG5vZGVzW2ldKSB7XG4gICAgICAgICAgICAgIHN0YWNrW3N0YWNrMF0gPSBub2RlLl9wYXJlbnQuX19kYXRhX18sIHN0YWNrW3N0YWNrMV0gPSBpO1xuICAgICAgICAgICAgICBzdWJub2Rlc1tpXSA9IHZpc2l0KG5vZGUsIHVwZGF0ZSAmJiB1cGRhdGVbaV0sIGRlcHRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgbGVhZiBncm91cCBtYXkgYmUgc3BhcnNlIGlmIHRoZSBzZWxlY3RvciByZXR1cm5zIGEgZmFsc2V5IHZhbHVlO1xuICAgICAgICAvLyB0aGlzIHByZXNlcnZlcyB0aGUgaW5kZXggb2Ygbm9kZXMgKHVubGlrZSBzZWxlY3Rpb24uZmlsdGVyKS5cbiAgICAgICAgLy8gUHJvcGFnYXRlIGRhdGEgdG8gdGhlIG5ldyBub2RlIG9ubHkgaWYgaXQgaXMgZGVmaW5lZCBvbiB0aGUgb2xkLlxuICAgICAgICAvLyBJZiB0aGlzIGlzIGFuIGVudGVyIHNlbGVjdGlvbiwgbWF0ZXJpYWxpemVkIG5vZGVzIGFyZSBtb3ZlZCB0byB1cGRhdGUuXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgICBpZiAobm9kZSA9IG5vZGVzW2ldKSB7XG4gICAgICAgICAgICAgIHN0YWNrWzBdID0gbm9kZS5fX2RhdGFfXywgc3RhY2tbMV0gPSBpO1xuICAgICAgICAgICAgICBpZiAoc3Vibm9kZSA9IHNlbGVjdG9yLmFwcGx5KG5vZGUsIHN0YWNrKSkge1xuICAgICAgICAgICAgICAgIGlmIChcIl9fZGF0YV9fXCIgaW4gbm9kZSkgc3Vibm9kZS5fX2RhdGFfXyA9IG5vZGUuX19kYXRhX187XG4gICAgICAgICAgICAgICAgaWYgKHVwZGF0ZSkgdXBkYXRlW2ldID0gc3Vibm9kZSwgZGVsZXRlIG5vZGVzW2ldO1xuICAgICAgICAgICAgICAgIHN1Ym5vZGVzW2ldID0gc3Vibm9kZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN1Ym5vZGVzLl9wYXJlbnQgPSBub2Rlcy5fcGFyZW50O1xuICAgICAgICByZXR1cm4gc3Vibm9kZXM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgU2VsZWN0aW9uKHZpc2l0KHRoaXMuX3Jvb3QsIHRoaXMuX3VwZGF0ZSAmJiB0aGlzLl91cGRhdGUuX3Jvb3QsIGRlcHRoKSwgZGVwdGgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNlbGVjdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgU2VsZWN0aW9uKFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRdLCAxKTtcbiAgICB9XG5cbiAgICBTZWxlY3Rpb24ucHJvdG90eXBlID0gc2VsZWN0aW9uLnByb3RvdHlwZSA9IHtcbiAgICAgIHNlbGVjdDogc2VsZWN0aW9uX3NlbGVjdCxcbiAgICAgIHNlbGVjdEFsbDogc2VsZWN0aW9uX3NlbGVjdEFsbCxcbiAgICAgIGZpbHRlcjogc2VsZWN0aW9uX2ZpbHRlcixcbiAgICAgIGRhdGE6IHNlbGVjdGlvbl9kYXRhLFxuICAgICAgZW50ZXI6IHNlbGVjdGlvbl9lbnRlcixcbiAgICAgIGV4aXQ6IHNlbGVjdGlvbl9leGl0LFxuICAgICAgb3JkZXI6IHNlbGVjdGlvbl9vcmRlcixcbiAgICAgIHNvcnQ6IHNlbGVjdGlvbl9zb3J0LFxuICAgICAgY2FsbDogc2VsZWN0aW9uX2NhbGwsXG4gICAgICBub2Rlczogc2VsZWN0aW9uX25vZGVzLFxuICAgICAgbm9kZTogc2VsZWN0aW9uX25vZGUsXG4gICAgICBzaXplOiBzZWxlY3Rpb25fc2l6ZSxcbiAgICAgIGVtcHR5OiBzZWxlY3Rpb25fZW1wdHksXG4gICAgICBlYWNoOiBzZWxlY3Rpb25fZWFjaCxcbiAgICAgIGF0dHI6IHNlbGVjdGlvbl9hdHRyLFxuICAgICAgc3R5bGU6IHNlbGVjdGlvbl9zdHlsZSxcbiAgICAgIHByb3BlcnR5OiBzZWxlY3Rpb25fcHJvcGVydHksXG4gICAgICBjbGFzczogc2VsZWN0aW9uX2NsYXNzLFxuICAgICAgY2xhc3NlZDogc2VsZWN0aW9uX2NsYXNzLCAvLyBkZXByZWNhdGVkIGFsaWFzXG4gICAgICB0ZXh0OiBzZWxlY3Rpb25fdGV4dCxcbiAgICAgIGh0bWw6IHNlbGVjdGlvbl9odG1sLFxuICAgICAgYXBwZW5kOiBzZWxlY3Rpb25fYXBwZW5kLFxuICAgICAgaW5zZXJ0OiBzZWxlY3Rpb25fYXBwZW5kLCAvLyBkZXByZWNhdGVkIGFsaWFzXG4gICAgICByZW1vdmU6IHNlbGVjdGlvbl9yZW1vdmUsXG4gICAgICBkYXR1bTogc2VsZWN0aW9uX2RhdHVtLFxuICAgICAgZXZlbnQ6IHNlbGVjdGlvbl9ldmVudCxcbiAgICAgIG9uOiBzZWxlY3Rpb25fZXZlbnQsIC8vIGRlcHJlY2F0ZWQgYWxpYXNcbiAgICAgIGRpc3BhdGNoOiBzZWxlY3Rpb25fZGlzcGF0Y2hcbiAgICB9O1xuXG4gICAgdmFyIHNlbGVjdCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgICByZXR1cm4gbmV3IFNlbGVjdGlvbihbdHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgOiBzZWxlY3Rvcl0sIDEpO1xuICAgIH1cblxuICAgIHZhciBwb2ludCA9IGZ1bmN0aW9uKG5vZGUsIGV2ZW50KSB7XG4gICAgICB2YXIgc3ZnID0gbm9kZS5vd25lclNWR0VsZW1lbnQgfHwgbm9kZTtcbiAgICAgIGlmIChzdmcuY3JlYXRlU1ZHUG9pbnQpIHtcbiAgICAgICAgdmFyIHBvaW50ID0gc3ZnLmNyZWF0ZVNWR1BvaW50KCk7XG4gICAgICAgIGlmIChidWc0NDA4MyA8IDApIHtcbiAgICAgICAgICB2YXIgd2luZG93ID0gZGVmYXVsdFZpZXcobm9kZSk7XG4gICAgICAgICAgaWYgKHdpbmRvdy5zY3JvbGxYIHx8IHdpbmRvdy5zY3JvbGxZKSB7XG4gICAgICAgICAgICBzdmcgPSBzZWxlY3Qod2luZG93LmRvY3VtZW50LmJvZHkpLmFwcGVuZChcInN2Z1wiKS5zdHlsZSh7cG9zaXRpb246IFwiYWJzb2x1dGVcIiwgdG9wOiAwLCBsZWZ0OiAwLCBtYXJnaW46IDAsIHBhZGRpbmc6IDAsIGJvcmRlcjogXCJub25lXCJ9LCBcImltcG9ydGFudFwiKTtcbiAgICAgICAgICAgIHZhciBjdG0gPSBzdmcubm9kZSgpLmdldFNjcmVlbkNUTSgpO1xuICAgICAgICAgICAgYnVnNDQwODMgPSAhKGN0bS5mIHx8IGN0bS5lKTtcbiAgICAgICAgICAgIHN2Zy5yZW1vdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJ1ZzQ0MDgzKSBwb2ludC54ID0gZXZlbnQucGFnZVgsIHBvaW50LnkgPSBldmVudC5wYWdlWTtcbiAgICAgICAgZWxzZSBwb2ludC54ID0gZXZlbnQuY2xpZW50WCwgcG9pbnQueSA9IGV2ZW50LmNsaWVudFk7XG4gICAgICAgIHBvaW50ID0gcG9pbnQubWF0cml4VHJhbnNmb3JtKG5vZGUuZ2V0U2NyZWVuQ1RNKCkuaW52ZXJzZSgpKTtcbiAgICAgICAgcmV0dXJuIFtwb2ludC54LCBwb2ludC55XTtcbiAgICAgIH1cbiAgICAgIHZhciByZWN0ID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHJldHVybiBbZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdCAtIG5vZGUuY2xpZW50TGVmdCwgZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wIC0gbm9kZS5jbGllbnRUb3BdO1xuICAgIH1cblxuICAgIHZhciBzb3VyY2VFdmVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGN1cnJlbnQgPSBldmVudCwgc291cmNlO1xuICAgICAgd2hpbGUgKHNvdXJjZSA9IGN1cnJlbnQuc291cmNlRXZlbnQpIGN1cnJlbnQgPSBzb3VyY2U7XG4gICAgICByZXR1cm4gY3VycmVudDtcbiAgICB9XG5cbiAgICB2YXIgdG91Y2hlcyA9IGZ1bmN0aW9uKG5vZGUsIHRvdWNoZXMpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgdG91Y2hlcyA9IHNvdXJjZUV2ZW50KCkudG91Y2hlcztcbiAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gdG91Y2hlcyA/IHRvdWNoZXMubGVuZ3RoIDogMCwgcG9pbnRzID0gbmV3IEFycmF5KG4pOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIHBvaW50c1tpXSA9IHBvaW50KG5vZGUsIHRvdWNoZXNbaV0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHBvaW50cztcbiAgICB9XG5cbiAgICB2YXIgdG91Y2ggPSBmdW5jdGlvbihub2RlLCB0b3VjaGVzLCBpZGVudGlmaWVyKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIGlkZW50aWZpZXIgPSB0b3VjaGVzLCB0b3VjaGVzID0gc291cmNlRXZlbnQoKS5jaGFuZ2VkVG91Y2hlcztcbiAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gdG91Y2hlcyA/IHRvdWNoZXMubGVuZ3RoIDogMCwgdG91Y2g7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgaWYgKCh0b3VjaCA9IHRvdWNoZXNbaV0pLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgICAgICByZXR1cm4gcG9pbnQobm9kZSwgdG91Y2gpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgc2VsZWN0QWxsID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICAgIHJldHVybiBuZXcgU2VsZWN0aW9uKHR5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIiA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpIDogc2VsZWN0b3IsIDEpO1xuICAgIH1cblxuICAgIHZhciBtb3VzZSA9IGZ1bmN0aW9uKG5vZGUsIGV2ZW50KSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIGV2ZW50ID0gc291cmNlRXZlbnQoKTtcbiAgICAgIGlmIChldmVudC5jaGFuZ2VkVG91Y2hlcykgZXZlbnQgPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXTtcbiAgICAgIHJldHVybiBwb2ludChub2RlLCBldmVudCk7XG4gICAgfVxuXG4gICAgdmFyIGQzID0ge1xuICAgICAgZ2V0IGV2ZW50KCkgeyByZXR1cm4gZXZlbnQ7IH0sXG4gICAgICBtb3VzZTogbW91c2UsXG4gICAgICBuYW1lc3BhY2U6IG5hbWVzcGFjZSxcbiAgICAgIG5hbWVzcGFjZXM6IG5hbWVzcGFjZXMsXG4gICAgICByZXF1b3RlOiByZXF1b3RlLFxuICAgICAgc2VsZWN0OiBzZWxlY3QsXG4gICAgICBzZWxlY3RBbGw6IHNlbGVjdEFsbCxcbiAgICAgIHNlbGVjdGlvbjogc2VsZWN0aW9uLFxuICAgICAgdG91Y2g6IHRvdWNoLFxuICAgICAgdG91Y2hlczogdG91Y2hlc1xuICAgIH07XG5cbiAgICByZXR1cm4gZDM7XG5cbn0pKTsiXX0=
