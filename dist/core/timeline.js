"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createComputedClass = require("babel-runtime/helpers/create-computed-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _regeneratorRuntime = require("babel-runtime/regenerator")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var d3Scale = _interopRequire(require("d3-scale"));

var events = _interopRequire(require("events"));

var Keyboard = _interopRequire(require("../interactions/keyboard"));

var Surface = _interopRequire(require("../interactions/surface"));

var TimelineTimeContext = _interopRequire(require("./timeline-time-context"));

var Track = _interopRequire(require("./track"));

var TrackCollection = _interopRequire(require("./track-collection"));

/**
 * The `Timeline` class is the main entry point to create a representation of temporal data.
 * A `Timeline` instance can have multiples `Track` instances, which are basically a track window on the overall timeline.
 *
 * The timeline hold the current interaction state and is the central hub for keyboard as well as mouse events.
 * States are there to facilitating interactions with the timeline for:
 * - zooming
 * - moving
 * - editing
 *
 * Methods `register`, `render` and `update` call the same methods on all the `Track` instances, which call the same methods one on all its `Layer` instances.
 * - `register`: registers a `Track` instance onto the timeline (ie. the timeline can `render` and `update` its different tracks)
 * - `render`: renders the DOM for the element (if has one) and its descendant (here renders the tracks, ie. render the DOM tree for a track and attach it in the DOM at the right place)
 * - `update`: update the display according to data changes (ie. update the DOM element attached to the DOM tree with render method, based on new data).
 */

var Timeline = (function (_events$EventEmitter) {
  /**
   * Creates a new `Timeline` instance
   */

  function Timeline() {
    var pixelsPerSecond = arguments[0] === undefined ? 100 : arguments[0];
    var defaultTrackWidth = arguments[1] === undefined ? 1000 : arguments[1];

    _classCallCheck(this, Timeline);

    _get(_core.Object.getPrototypeOf(Timeline.prototype), "constructor", this).call(this);

    this._pixelsPerSecond = pixelsPerSecond;
    this._trackWidth = defaultTrackWidth;

    this._tracks = new TrackCollection(this);

    this._state = null;
    this._handleEvent = this._handleEvent.bind(this);
    this._createInteraction(Keyboard, "body");

    this._maintainVisibleDuration = false;
    // init default configuration for tracks factory
    // this._tracksConfiguration = {};
    // this.configureTracks();
    // stores
    this._trackById = {};
    this._groupedLayers = {};

    this._createTimeContext();
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
      return this._pixelsPerSecond;
    },
    set: function (value) {
      this._pixelsPerSecond = value;

      this.timeContext.xScaleRange = [0, this.pixelsPerSecond];
      this.timeContext.duration = this.trackWidth / this.pixelsPerSecond;
    }
  }, {
    key: "trackWidth",
    get: function () {
      return this._trackWidth;
    },
    set: function (value) {
      var widthRatio = value / this.trackWidth;

      this._trackWidth = value;
      this.timeContext.duration = this.trackWidth / this.pixelsPerSecond;

      if (this.maintainVisibleDuration) {
        this.pixelsPerSecond = this.pixelsPerSecond * widthRatio;
      }

      this.tracks.width = this.trackWidth;
    }
  }, {
    key: "maintainVisibleDuration",

    // @NOTE maybe expose as public instead of get/set for nothing...
    set: function (bool) {
      this._maintainVisibleDuration = bool;
    },
    get: function () {
      return this._maintainVisibleDuration;
    }
  }, {
    key: "_createTimeContext",

    /**
     * Creates a new TimeContext for the visualisation, this `TimeContext` will be at the top of the `TimeContext` tree
     */
    value: function _createTimeContext() {
      var pixelsPerSecond = this.pixelsPerSecond;
      var trackWidth = this.trackWidth;
      var xScale = d3Scale.linear().domain([0, 1]).range([0, pixelsPerSecond]);

      this.timeContext = new TimelineTimeContext();
      // all child context inherits the max duration allowed in container per default
      this.timeContext.duration = trackWidth / pixelsPerSecond;
      this.timeContext.xScale = xScale;
    }
  }, {
    key: "_createInteraction",

    /**
     * Factory method to add interaction modules the timeline should listen to.
     * By default, the timeline listen to Keyboard, and instance a Surface on each container
     * @param {EventSource} ctor - the contructor of the interaction module to instanciate
     * @param el {DOMElement} the DOM element to bind to the EventSource module
     * @param options {Object} options to be applied to the ctor (defaults to `{}`)
     */
    value: function _createInteraction(ctor, el) {
      var options = arguments[2] === undefined ? {} : arguments[2];

      var interaction = new ctor(el, options);
      interaction.on("event", this._handleEvent);
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
     * Changes the state of the timeline.
     * `State` instances are used to define the application logic by precising specific user interaction cases, and how they impact the overal temporal data representation.
     *
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
     *  Shortcut to access the Layer list
     *  @return {Array}
     */
    get: function () {
      return this._tracks.layers;
    }
  }, {
    key: "add",

    /**
     * Adds a track to the timeline
     * Tracks display this window on the timeline in theirs own SVG element.
     * @param {Track} track
     */
    value: function add(track) {
      if (this.tracks.indexOf(track) !== -1) {
        throw new Error("track already added to the timeline");
      }

      track.configure(this.timeContext, this.trackWidth);

      this.tracks.push(track);
      this._createInteraction(Surface, track.$el);
    }
  }, {
    key: "remove",
    value: function remove(track) {}
  }, {
    key: "createTrack",

    /**
     *  Defines a default for each track to be created
     *  @param {Number} pixelsPerSecond
     *  @param {Number} width
     *  @param {Number} height
     */
    // configureTracks(pixelsPerSecond = 100, width = 1000, height = 120) {
    //   this._tracksConfiguration = { pixelsPerSecond, width, height };
    // }

    /**
     *  Creates a new track from the configuration define in `configureTracks`
     *  @param {DOMElement} $el - the element to insert the track inside
     *  @param {Object} options - override the defaults options if necessary
     *  @param {String} [trackId=null] - optionnal id to give to the track, only exists in timeline's context
     *  @return {Track}
     */
    value: function createTrack($el) {
      var trackHeight = arguments[1] === undefined ? null : arguments[1];
      var trackId = arguments[2] === undefined ? null : arguments[2];

      var track = new Track($el, trackHeight);

      if (trackId !== null) {
        if (this._trackById[trackId] !== undefined) {
          throw new Error("trackId: \"" + trackId + "\" is already used");
        }

        this._trackById[trackId] = track;
      }
      // add track to the timeline
      this.add(track);
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
      // we should have a Track instance at this point
      track.add(layer);

      if (!this._groupedLayers[groupId]) {
        this._groupedLayers[groupId] = [];
      }

      this._groupedLayers[groupId].push(layer);
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
     *  Returns an array of layers from their group Id
     *  @param {String} groupId
     *  @return {Array}
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
            return context$2$0.delegateYield(_core.$for.getIterator(_this.tracks), "t184", 1);

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

// @TODO
//# sourceMappingURL=data:application/json;base64,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Q0FBQyxjQUFjLEVBQUU7QUFDdkMsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMzQyxZQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVuQyxZQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtBQUFFLGVBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQUU7O0FBRTdDLFlBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQ2pCLGlCQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDckM7T0FDRjtLQUNGOzs7Ozs7Ozs7V0FPVyxzQkFBQyxPQUFPLEVBQUU7QUFDcEIsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ2pDOzs7Ozs7Ozs7V0FPZSwwQkFBQyxPQUFPLEVBQUU7QUFDeEIsYUFBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3JDOztTQUVDLE1BQUEsTUFBTSxDQUFDLFFBQVE7b0NBQUM7Ozs7OztvRUFDVCxNQUFLLE1BQU07Ozs7Ozs7S0FDbkI7OztTQWhSa0IsUUFBUTtHQUFTLE1BQU0sQ0FBQyxZQUFZOztpQkFBcEMsUUFBUSIsImZpbGUiOiJlczYvY29yZS90aW1lbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkM1NjYWxlIGZyb20gJ2QzLXNjYWxlJztcbmltcG9ydCBldmVudHMgZnJvbSAnZXZlbnRzJztcblxuaW1wb3J0IEtleWJvYXJkIGZyb20gJy4uL2ludGVyYWN0aW9ucy9rZXlib2FyZCc7XG5pbXBvcnQgU3VyZmFjZSBmcm9tICcuLi9pbnRlcmFjdGlvbnMvc3VyZmFjZSc7XG5pbXBvcnQgVGltZWxpbmVUaW1lQ29udGV4dCBmcm9tICcuL3RpbWVsaW5lLXRpbWUtY29udGV4dCc7XG5pbXBvcnQgVHJhY2sgZnJvbSAnLi90cmFjayc7XG5pbXBvcnQgVHJhY2tDb2xsZWN0aW9uIGZyb20gJy4vdHJhY2stY29sbGVjdGlvbic7XG5cblxuLyoqXG4gKiBUaGUgYFRpbWVsaW5lYCBjbGFzcyBpcyB0aGUgbWFpbiBlbnRyeSBwb2ludCB0byBjcmVhdGUgYSByZXByZXNlbnRhdGlvbiBvZiB0ZW1wb3JhbCBkYXRhLlxuICogQSBgVGltZWxpbmVgIGluc3RhbmNlIGNhbiBoYXZlIG11bHRpcGxlcyBgVHJhY2tgIGluc3RhbmNlcywgd2hpY2ggYXJlIGJhc2ljYWxseSBhIHRyYWNrIHdpbmRvdyBvbiB0aGUgb3ZlcmFsbCB0aW1lbGluZS5cbiAqXG4gKiBUaGUgdGltZWxpbmUgaG9sZCB0aGUgY3VycmVudCBpbnRlcmFjdGlvbiBzdGF0ZSBhbmQgaXMgdGhlIGNlbnRyYWwgaHViIGZvciBrZXlib2FyZCBhcyB3ZWxsIGFzIG1vdXNlIGV2ZW50cy5cbiAqIFN0YXRlcyBhcmUgdGhlcmUgdG8gZmFjaWxpdGF0aW5nIGludGVyYWN0aW9ucyB3aXRoIHRoZSB0aW1lbGluZSBmb3I6XG4gKiAtIHpvb21pbmdcbiAqIC0gbW92aW5nXG4gKiAtIGVkaXRpbmdcbiAqXG4gKiBNZXRob2RzIGByZWdpc3RlcmAsIGByZW5kZXJgIGFuZCBgdXBkYXRlYCBjYWxsIHRoZSBzYW1lIG1ldGhvZHMgb24gYWxsIHRoZSBgVHJhY2tgIGluc3RhbmNlcywgd2hpY2ggY2FsbCB0aGUgc2FtZSBtZXRob2RzIG9uZSBvbiBhbGwgaXRzIGBMYXllcmAgaW5zdGFuY2VzLlxuICogLSBgcmVnaXN0ZXJgOiByZWdpc3RlcnMgYSBgVHJhY2tgIGluc3RhbmNlIG9udG8gdGhlIHRpbWVsaW5lIChpZS4gdGhlIHRpbWVsaW5lIGNhbiBgcmVuZGVyYCBhbmQgYHVwZGF0ZWAgaXRzIGRpZmZlcmVudCB0cmFja3MpXG4gKiAtIGByZW5kZXJgOiByZW5kZXJzIHRoZSBET00gZm9yIHRoZSBlbGVtZW50IChpZiBoYXMgb25lKSBhbmQgaXRzIGRlc2NlbmRhbnQgKGhlcmUgcmVuZGVycyB0aGUgdHJhY2tzLCBpZS4gcmVuZGVyIHRoZSBET00gdHJlZSBmb3IgYSB0cmFjayBhbmQgYXR0YWNoIGl0IGluIHRoZSBET00gYXQgdGhlIHJpZ2h0IHBsYWNlKVxuICogLSBgdXBkYXRlYDogdXBkYXRlIHRoZSBkaXNwbGF5IGFjY29yZGluZyB0byBkYXRhIGNoYW5nZXMgKGllLiB1cGRhdGUgdGhlIERPTSBlbGVtZW50IGF0dGFjaGVkIHRvIHRoZSBET00gdHJlZSB3aXRoIHJlbmRlciBtZXRob2QsIGJhc2VkIG9uIG5ldyBkYXRhKS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYFRpbWVsaW5lYCBpbnN0YW5jZVxuICAgKi9cbiAgY29uc3RydWN0b3IocGl4ZWxzUGVyU2Vjb25kID0gMTAwLCBkZWZhdWx0VHJhY2tXaWR0aCA9IDEwMDApIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5fcGl4ZWxzUGVyU2Vjb25kID0gcGl4ZWxzUGVyU2Vjb25kO1xuICAgIHRoaXMuX3RyYWNrV2lkdGggPSBkZWZhdWx0VHJhY2tXaWR0aDtcblxuICAgIHRoaXMuX3RyYWNrcyA9IG5ldyBUcmFja0NvbGxlY3Rpb24odGhpcyk7XG5cbiAgICB0aGlzLl9zdGF0ZSA9IG51bGw7XG4gICAgdGhpcy5faGFuZGxlRXZlbnQgPSB0aGlzLl9oYW5kbGVFdmVudC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX2NyZWF0ZUludGVyYWN0aW9uKEtleWJvYXJkLCAnYm9keScpO1xuXG4gICAgdGhpcy5fbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSBmYWxzZTtcbiAgICAvLyBpbml0IGRlZmF1bHQgY29uZmlndXJhdGlvbiBmb3IgdHJhY2tzIGZhY3RvcnlcbiAgICAvLyB0aGlzLl90cmFja3NDb25maWd1cmF0aW9uID0ge307XG4gICAgLy8gdGhpcy5jb25maWd1cmVUcmFja3MoKTtcbiAgICAvLyBzdG9yZXNcbiAgICB0aGlzLl90cmFja0J5SWQgPSB7fTtcbiAgICB0aGlzLl9ncm91cGVkTGF5ZXJzID0ge307XG5cbiAgICB0aGlzLl9jcmVhdGVUaW1lQ29udGV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqICBUaW1lQ29udGV4dCBhY2Nlc3NvcnNcbiAgICovXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQub2Zmc2V0O1xuICB9XG5cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQub2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgem9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC56b29tO1xuICB9XG5cbiAgc2V0IHpvb20odmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0Lnpvb20gPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBwaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BpeGVsc1BlclNlY29uZDtcbiAgfVxuXG4gIHNldCBwaXhlbHNQZXJTZWNvbmQodmFsdWUpIHtcbiAgICB0aGlzLl9waXhlbHNQZXJTZWNvbmQgPSB2YWx1ZTtcblxuICAgIHRoaXMudGltZUNvbnRleHQueFNjYWxlUmFuZ2UgPSBbMCwgdGhpcy5waXhlbHNQZXJTZWNvbmRdO1xuICAgIHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24gPSB0aGlzLnRyYWNrV2lkdGggLyB0aGlzLnBpeGVsc1BlclNlY29uZDtcbiAgfVxuXG4gIGdldCB0cmFja1dpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLl90cmFja1dpZHRoO1xuICB9XG5cbiAgc2V0IHRyYWNrV2lkdGgodmFsdWUpIHtcbiAgICBjb25zdCB3aWR0aFJhdGlvID0gdmFsdWUgLyB0aGlzLnRyYWNrV2lkdGg7XG5cbiAgICB0aGlzLl90cmFja1dpZHRoID0gdmFsdWU7XG4gICAgdGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbiA9IHRoaXMudHJhY2tXaWR0aCAvIHRoaXMucGl4ZWxzUGVyU2Vjb25kO1xuXG4gICAgaWYgKHRoaXMubWFpbnRhaW5WaXNpYmxlRHVyYXRpb24pIHtcbiAgICAgIHRoaXMucGl4ZWxzUGVyU2Vjb25kID0gdGhpcy5waXhlbHNQZXJTZWNvbmQgKiB3aWR0aFJhdGlvO1xuICAgIH1cblxuICAgIHRoaXMudHJhY2tzLndpZHRoID0gdGhpcy50cmFja1dpZHRoO1xuICB9XG5cbiAgLy8gQE5PVEUgbWF5YmUgZXhwb3NlIGFzIHB1YmxpYyBpbnN0ZWFkIG9mIGdldC9zZXQgZm9yIG5vdGhpbmcuLi5cbiAgc2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKGJvb2wpIHtcbiAgICB0aGlzLl9tYWludGFpblZpc2libGVEdXJhdGlvbiA9IGJvb2w7XG4gIH1cblxuICBnZXQgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX21haW50YWluVmlzaWJsZUR1cmF0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgVGltZUNvbnRleHQgZm9yIHRoZSB2aXN1YWxpc2F0aW9uLCB0aGlzIGBUaW1lQ29udGV4dGAgd2lsbCBiZSBhdCB0aGUgdG9wIG9mIHRoZSBgVGltZUNvbnRleHRgIHRyZWVcbiAgICovXG4gIF9jcmVhdGVUaW1lQ29udGV4dCgpIHtcbiAgICBjb25zdCBwaXhlbHNQZXJTZWNvbmQgPSB0aGlzLnBpeGVsc1BlclNlY29uZDtcbiAgICBjb25zdCB0cmFja1dpZHRoID0gdGhpcy50cmFja1dpZHRoO1xuICAgIGNvbnN0IHhTY2FsZSA9IGQzU2NhbGUubGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIDFdKVxuICAgICAgLnJhbmdlKFswLCBwaXhlbHNQZXJTZWNvbmRdKTtcblxuICAgIHRoaXMudGltZUNvbnRleHQgPSBuZXcgVGltZWxpbmVUaW1lQ29udGV4dCgpO1xuICAgIC8vIGFsbCBjaGlsZCBjb250ZXh0IGluaGVyaXRzIHRoZSBtYXggZHVyYXRpb24gYWxsb3dlZCBpbiBjb250YWluZXIgcGVyIGRlZmF1bHRcbiAgICB0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uID0gdHJhY2tXaWR0aCAvIHBpeGVsc1BlclNlY29uZDtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnhTY2FsZSA9IHhTY2FsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGYWN0b3J5IG1ldGhvZCB0byBhZGQgaW50ZXJhY3Rpb24gbW9kdWxlcyB0aGUgdGltZWxpbmUgc2hvdWxkIGxpc3RlbiB0by5cbiAgICogQnkgZGVmYXVsdCwgdGhlIHRpbWVsaW5lIGxpc3RlbiB0byBLZXlib2FyZCwgYW5kIGluc3RhbmNlIGEgU3VyZmFjZSBvbiBlYWNoIGNvbnRhaW5lclxuICAgKiBAcGFyYW0ge0V2ZW50U291cmNlfSBjdG9yIC0gdGhlIGNvbnRydWN0b3Igb2YgdGhlIGludGVyYWN0aW9uIG1vZHVsZSB0byBpbnN0YW5jaWF0ZVxuICAgKiBAcGFyYW0gZWwge0RPTUVsZW1lbnR9IHRoZSBET00gZWxlbWVudCB0byBiaW5kIHRvIHRoZSBFdmVudFNvdXJjZSBtb2R1bGVcbiAgICogQHBhcmFtIG9wdGlvbnMge09iamVjdH0gb3B0aW9ucyB0byBiZSBhcHBsaWVkIHRvIHRoZSBjdG9yIChkZWZhdWx0cyB0byBge31gKVxuICAgKi9cbiAgX2NyZWF0ZUludGVyYWN0aW9uKGN0b3IsIGVsLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBpbnRlcmFjdGlvbiA9IG5ldyBjdG9yKGVsLCBvcHRpb25zKTtcbiAgICBpbnRlcmFjdGlvbi5vbignZXZlbnQnLCB0aGlzLl9oYW5kbGVFdmVudCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNhbGxiYWNrIHRoYXQgaXMgdXNlZCB0byBsaXN0ZW4gdG8gaW50ZXJhY3Rpb25zIG1vZHVsZXNcbiAgICogQHBhcmFtcyB7RXZlbnR9IGUgLSBhIGN1c3RvbSBldmVudCBnZW5lcmF0ZWQgYnkgaW50ZXJhY3Rpb24gbW9kdWxlc1xuICAgKi9cbiAgX2hhbmRsZUV2ZW50KGUpIHtcbiAgICAvLyBlbWl0IGV2ZW50IGFzIGEgbWlkZGxld2FyZVxuICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBlKTtcbiAgICAvLyBwcm9wYWdhdGUgdG8gdGhlIHN0YXRlXG4gICAgaWYgKCF0aGlzLl9zdGF0ZSkgeyByZXR1cm47IH1cbiAgICB0aGlzLl9zdGF0ZS5oYW5kbGVFdmVudChlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIENoYW5nZXMgdGhlIHN0YXRlIG9mIHRoZSB0aW1lbGluZS5cbiAgICogYFN0YXRlYCBpbnN0YW5jZXMgYXJlIHVzZWQgdG8gZGVmaW5lIHRoZSBhcHBsaWNhdGlvbiBsb2dpYyBieSBwcmVjaXNpbmcgc3BlY2lmaWMgdXNlciBpbnRlcmFjdGlvbiBjYXNlcywgYW5kIGhvdyB0aGV5IGltcGFjdCB0aGUgb3ZlcmFsIHRlbXBvcmFsIGRhdGEgcmVwcmVzZW50YXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7QmFzZVN0YXRlfSBzdGF0ZSAtIHRoZSBzdGF0ZSBpbiB3aGljaCB0aGUgdGltZWxpbmUgbXVzdCBiZSBzZXR0ZWRcbiAgICovXG4gIHNldCBzdGF0ZShzdGF0ZSkge1xuICAgIGlmICh0aGlzLl9zdGF0ZSkgeyB0aGlzLl9zdGF0ZS5leGl0KCk7IH1cbiAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuICAgIHRoaXMuX3N0YXRlLmVudGVyKCk7XG4gIH1cblxuICBnZXQgc3RhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqICBTaG9ydGN1dCB0byBhY2Nlc3MgdGhlIFRyYWNrIGNvbGxlY3Rpb25cbiAgICogIEByZXR1cm4ge1RyYWNrQ29sbGVjdGlvbn1cbiAgICovXG4gIGdldCB0cmFja3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYWNrcztcbiAgfVxuXG4gIC8qKlxuICAgKiAgU2hvcnRjdXQgdG8gYWNjZXNzIHRoZSBMYXllciBsaXN0XG4gICAqICBAcmV0dXJuIHtBcnJheX1cbiAgICovXG4gIGdldCBsYXllcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYWNrcy5sYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHRyYWNrIHRvIHRoZSB0aW1lbGluZVxuICAgKiBUcmFja3MgZGlzcGxheSB0aGlzIHdpbmRvdyBvbiB0aGUgdGltZWxpbmUgaW4gdGhlaXJzIG93biBTVkcgZWxlbWVudC5cbiAgICogQHBhcmFtIHtUcmFja30gdHJhY2tcbiAgICovXG4gIGFkZCh0cmFjaykge1xuICAgIGlmICh0aGlzLnRyYWNrcy5pbmRleE9mKHRyYWNrKSAhPT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndHJhY2sgYWxyZWFkeSBhZGRlZCB0byB0aGUgdGltZWxpbmUnKTtcbiAgICB9XG5cbiAgICB0cmFjay5jb25maWd1cmUodGhpcy50aW1lQ29udGV4dCwgdGhpcy50cmFja1dpZHRoKTtcblxuICAgIHRoaXMudHJhY2tzLnB1c2godHJhY2spO1xuICAgIHRoaXMuX2NyZWF0ZUludGVyYWN0aW9uKFN1cmZhY2UsIHRyYWNrLiRlbCk7XG4gIH1cblxuICByZW1vdmUodHJhY2spIHtcbiAgICAvLyBAVE9ET1xuICB9XG5cbiAgLyoqXG4gICAqICBEZWZpbmVzIGEgZGVmYXVsdCBmb3IgZWFjaCB0cmFjayB0byBiZSBjcmVhdGVkXG4gICAqICBAcGFyYW0ge051bWJlcn0gcGl4ZWxzUGVyU2Vjb25kXG4gICAqICBAcGFyYW0ge051bWJlcn0gd2lkdGhcbiAgICogIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiAgICovXG4gIC8vIGNvbmZpZ3VyZVRyYWNrcyhwaXhlbHNQZXJTZWNvbmQgPSAxMDAsIHdpZHRoID0gMTAwMCwgaGVpZ2h0ID0gMTIwKSB7XG4gIC8vICAgdGhpcy5fdHJhY2tzQ29uZmlndXJhdGlvbiA9IHsgcGl4ZWxzUGVyU2Vjb25kLCB3aWR0aCwgaGVpZ2h0IH07XG4gIC8vIH1cblxuICAvKipcbiAgICogIENyZWF0ZXMgYSBuZXcgdHJhY2sgZnJvbSB0aGUgY29uZmlndXJhdGlvbiBkZWZpbmUgaW4gYGNvbmZpZ3VyZVRyYWNrc2BcbiAgICogIEBwYXJhbSB7RE9NRWxlbWVudH0gJGVsIC0gdGhlIGVsZW1lbnQgdG8gaW5zZXJ0IHRoZSB0cmFjayBpbnNpZGVcbiAgICogIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gb3ZlcnJpZGUgdGhlIGRlZmF1bHRzIG9wdGlvbnMgaWYgbmVjZXNzYXJ5XG4gICAqICBAcGFyYW0ge1N0cmluZ30gW3RyYWNrSWQ9bnVsbF0gLSBvcHRpb25uYWwgaWQgdG8gZ2l2ZSB0byB0aGUgdHJhY2ssIG9ubHkgZXhpc3RzIGluIHRpbWVsaW5lJ3MgY29udGV4dFxuICAgKiAgQHJldHVybiB7VHJhY2t9XG4gICAqL1xuICBjcmVhdGVUcmFjaygkZWwsIHRyYWNrSGVpZ2h0ID0gbnVsbCwgdHJhY2tJZCA9IG51bGwpIHtcbiAgICBjb25zdCB0cmFjayA9IG5ldyBUcmFjaygkZWwsIHRyYWNrSGVpZ2h0KTtcblxuICAgIGlmICh0cmFja0lkICE9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5fdHJhY2tCeUlkW3RyYWNrSWRdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGB0cmFja0lkOiBcIiR7dHJhY2tJZH1cIiBpcyBhbHJlYWR5IHVzZWRgKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdHJhY2tCeUlkW3RyYWNrSWRdID0gdHJhY2s7XG4gICAgfVxuICAgIC8vIGFkZCB0cmFjayB0byB0aGUgdGltZWxpbmVcbiAgICB0aGlzLmFkZCh0cmFjayk7XG4gICAgcmV0dXJuIHRyYWNrO1xuICB9XG5cbiAgLyoqXG4gICAqICBBZGRzIGEgbGF5ZXIgdG8gYSB0cmFjaywgYWxsb3cgdG8gZ3JvdXAgdHJhY2sgYXJiaXRyYXJpbHkgaW5zaWRlIGdyb3Vwcy4gQmFzaWNhbGx5IGEgd3JhcHBlciBmb3IgYHRyYWNrLmFkZChsYXllcilgXG4gICAqICBAcGFyYW0ge0xheWVyfSBsYXllciAtIHRoZSBsYXllciB0byBhZGRcbiAgICogIEBwYXJhbSB7VHJhY2t9IHRyYWNrIC0gdGhlIHRyYWNrIHRvIHRoZSBpbnNlcnQgdGhlIGxheWVyIGluXG4gICAqICBAcGFyYW0ge1N0cmluZ30gW2dyb3VwSWQ9J2RlZmF1bHQnXSAtIHRoZSBncm91cCBpbiB3aGljaCBhc3NvY2lhdGUgdGhlIGxheWVyXG4gICAqL1xuICBhZGRMYXllcihsYXllciwgdHJhY2tPclRyYWNrSWQsIGdyb3VwSWQgPSAnZGVmYXVsdCcpIHtcbiAgICBsZXQgdHJhY2sgPSB0cmFja09yVHJhY2tJZDtcblxuICAgIGlmICh0eXBlb2YgdHJhY2tPclRyYWNrSWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cmFjayA9IHRoaXMuZ2V0VHJhY2tCeUlkKHRyYWNrT3JUcmFja0lkKTtcbiAgICB9XG4gICAgLy8gd2Ugc2hvdWxkIGhhdmUgYSBUcmFjayBpbnN0YW5jZSBhdCB0aGlzIHBvaW50XG4gICAgdHJhY2suYWRkKGxheWVyKTtcblxuICAgIGlmICghdGhpcy5fZ3JvdXBlZExheWVyc1tncm91cElkXSkge1xuICAgICAgdGhpcy5fZ3JvdXBlZExheWVyc1tncm91cElkXSA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF0ucHVzaChsYXllcik7XG4gIH1cblxuICAvKipcbiAgICogIFJlbW92ZXMgYSBsYXllciBmcm9tIGl0cyB0cmFjayAodGhlIGxheWVyIGlzIGRldGF0Y2hlZCBmcm9tIHRoZSBET00gYnV0IGNhbiBzdGlsbCBiZSByZXVzZWQpXG4gICAqICBAcGFyYW0ge0xheWVyfSBsYXllciAtIHRoZSBsYXllciB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZUxheWVyKGxheWVyKSB7XG4gICAgdGhpcy50cmFja3MuZm9yRWFjaChmdW5jdGlvbih0cmFjaykge1xuICAgICAgY29uc3QgaW5kZXggPSB0cmFjay5sYXllcnMuaW5kZXhPZihsYXllcik7XG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7IHRyYWNrLnJlbW92ZShsYXllcik7IH1cbiAgICB9KTtcblxuICAgIGZvciAobGV0IGdyb3VwSWQgaW4gdGhpcy5fZ3JvdXBlZExheWVycykge1xuICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdO1xuICAgICAgY29uc3QgaW5kZXggPSBncm91cC5pbmRleE9mKGxheWVyKTtcblxuICAgICAgaWYgKGluZGV4ICE9PSAtMSkgeyBncm91cC5zcGxpY2UobGF5ZXIsIDEpOyB9XG5cbiAgICAgIGlmICghZ3JvdXAubGVuZ3RoKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgUmV0dXJucyBhIHRyYWNrIGZyb20gaXQncyBpZFxuICAgKiAgQHBhcmFtIHtTdHJpbmd9IHRyYWNrSWRcbiAgICogIEByZXR1cm4ge1RyYWNrfVxuICAgKi9cbiAgZ2V0VHJhY2tCeUlkKHRyYWNrSWQpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhY2tCeUlkW3RyYWNrSWRdO1xuICB9XG5cbiAgLyoqXG4gICAqICBSZXR1cm5zIGFuIGFycmF5IG9mIGxheWVycyBmcm9tIHRoZWlyIGdyb3VwIElkXG4gICAqICBAcGFyYW0ge1N0cmluZ30gZ3JvdXBJZFxuICAgKiAgQHJldHVybiB7QXJyYXl9XG4gICAqL1xuICBnZXRMYXllcnNCeUdyb3VwKGdyb3VwSWQpIHtcbiAgICByZXR1cm4gdGhpcy5fZ3JvdXBlZExheWVyc1tncm91cElkXTtcbiAgfVxuXG4gICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICB5aWVsZCogdGhpcy50cmFja3NbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICB9XG59XG4iXX0=