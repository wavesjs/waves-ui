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
            return context$2$0.delegateYield(_core.$for.getIterator(_this.tracks), "t90", 1);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBTyxNQUFNLDJCQUFNLFFBQVE7O0lBRXBCLFFBQVEsMkJBQU0sMEJBQTBCOztJQUN4QyxnQkFBZ0IsMkJBQU0sc0JBQXNCOztJQUM1QyxPQUFPLDJCQUFNLHlCQUF5Qjs7SUFDdEMsbUJBQW1CLDJCQUFNLHlCQUF5Qjs7SUFDbEQsS0FBSywyQkFBTSxTQUFTOztJQUNwQixlQUFlLDJCQUFNLG9CQUFvQjs7Ozs7Ozs7OztJQVUzQixRQUFROzs7OztBQUloQixXQUpRLFFBQVEsR0FJNkI7UUFBNUMsZUFBZSxnQ0FBRyxHQUFHO1FBQUUsWUFBWSxnQ0FBRyxJQUFJOzswQkFKbkMsUUFBUTs7QUFLekIscUNBTGlCLFFBQVEsNkNBS2pCOztBQUVSLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekMsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7OztBQUduQixRQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQztBQUM1QixRQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDOzs7QUFHekMsUUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDckIsUUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7O0FBRXpCLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxtQkFBbUIsQ0FBQyxlQUFlLEVBQUUsWUFBWSxDQUFDLENBQUM7R0FDM0U7O1lBbkJrQixRQUFROzt1QkFBUixRQUFROzs7Ozs7U0F3QmpCLFlBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO0tBQ2hDO1NBRVMsVUFBQyxLQUFLLEVBQUU7QUFDaEIsVUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0tBQ2pDOzs7U0FFTyxZQUFHO0FBQ1QsYUFB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SSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNqQzs7Ozs7Ozs7O1dBT2UsMEJBQUMsT0FBTyxFQUFFO0FBQ3hCLGFBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNyQzs7U0FFQyxNQUFBLE1BQU0sQ0FBQyxRQUFRO29DQUFDOzs7Ozs7b0VBQ1QsTUFBSyxNQUFNOzs7Ozs7O0tBQ25COzs7U0E5UWtCLFFBQVE7R0FBUyxNQUFNLENBQUMsWUFBWTs7aUJBQXBDLFFBQVEiLCJmaWxlIjoiZXM2L2NvcmUvdGltZWxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5cbmltcG9ydCBLZXlib2FyZCBmcm9tICcuLi9pbnRlcmFjdGlvbnMva2V5Ym9hcmQnO1xuaW1wb3J0IExheWVyVGltZUNvbnRleHQgZnJvbSAnLi9sYXllci10aW1lLWNvbnRleHQnO1xuaW1wb3J0IFN1cmZhY2UgZnJvbSAnLi4vaW50ZXJhY3Rpb25zL3N1cmZhY2UnO1xuaW1wb3J0IFRpbWVsaW5lVGltZUNvbnRleHQgZnJvbSAnLi90aW1lbGluZS10aW1lLWNvbnRleHQnO1xuaW1wb3J0IFRyYWNrIGZyb20gJy4vdHJhY2snO1xuaW1wb3J0IFRyYWNrQ29sbGVjdGlvbiBmcm9tICcuL3RyYWNrLWNvbGxlY3Rpb24nO1xuXG5cbi8qKlxuICogVGhlIGB0aW1lbGluZWAgaXMgdGhlIG1haW4gZW50cnkgcG9pbnQgb2YgYSB0ZW1wb3JhbCB2aXN1YWxpemF0aW9uLCBpdDpcbiAqIC0gY29udGFpbnMgZmFjdG9yaWVzIHRvIG1hbmFnZSBpdHMgYHRyYWNrc2AgYW5kIGBsYXllcnNgLFxuICogLSBnZXQgb3Igc2V0IHRoZSB2aWV3IHdpbmRvdyBvdmVycyBpdHMgYHRyYWNrc2AgdGhyb3VnaCBgb2Zmc2V0YCwgYHpvb21gLCAgKiBgcGl4ZWxzUGVyU2Vjb25kYCwgYHZpc2libGVXaWR0aGAsXG4gKiAtIGlzIHRoZSBjZW50cmFsIGh1YiBmb3IgYWxsIHVzZXIgaW50ZXJhY3Rpb24gZXZlbnRzIChrZXlib2FyZCwgbW91c2UpLFxuICogLSBob2xkcyB0aGUgY3VycmVudCBpbnRlcmFjdGlvbiBgc3RhdGVgIHdoaWNoIGRlZmluZXMgaG93IHRoZSBkaWZmZXJlbnQgdGltZWxpbmUgZWxlbWVudHMgKHRyYWNrcywgbGF5ZXJzLCBzaGFwZXMpIHJlc3BvbmQgdG8gdXNlciBpbnRlcmFjdGlvbnMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGBUaW1lbGluZWAgaW5zdGFuY2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKHBpeGVsc1BlclNlY29uZCA9IDEwMCwgdmlzaWJsZVdpZHRoID0gMTAwMCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLl90cmFja3MgPSBuZXcgVHJhY2tDb2xsZWN0aW9uKHRoaXMpO1xuICAgIHRoaXMuX3N0YXRlID0gbnVsbDtcblxuICAgIC8vIGRlZmF1bHQgaW50ZXJhY3Rpb25zXG4gICAgdGhpcy5fc3VyZmFjZUN0b3IgPSBTdXJmYWNlO1xuICAgIHRoaXMuY3JlYXRlSW50ZXJhY3Rpb24oS2V5Ym9hcmQsICdib2R5Jyk7XG5cbiAgICAvLyBzdG9yZXNcbiAgICB0aGlzLl90cmFja0J5SWQgPSB7fTtcbiAgICB0aGlzLl9ncm91cGVkTGF5ZXJzID0ge307XG5cbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbmV3IFRpbWVsaW5lVGltZUNvbnRleHQocGl4ZWxzUGVyU2Vjb25kLCB2aXNpYmxlV2lkdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqICBUaW1lQ29udGV4dCBhY2Nlc3NvcnNcbiAgICovXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQub2Zmc2V0O1xuICB9XG5cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQub2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgem9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC56b29tO1xuICB9XG5cbiAgc2V0IHpvb20odmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0Lnpvb20gPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBwaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQucGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgc2V0IHBpeGVsc1BlclNlY29uZCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQucGl4ZWxzUGVyU2Vjb25kID0gdmFsdWU7XG4gIH1cblxuICBnZXQgdmlzaWJsZVdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnZpc2libGVXaWR0aDtcbiAgfVxuXG4gIHNldCB2aXNpYmxlV2lkdGgodmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnZpc2libGVXaWR0aCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHRpbWVUb1BpeGVsKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsO1xuICB9XG5cbiAgLyoqXG4gICAqICBAcmVhZG9ubHlcbiAgICovXG4gIGdldCB2aXNpYmxlRHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQudmlzaWJsZUR1cmF0aW9uO1xuICB9XG5cbiAgLy8gQE5PVEUgbWF5YmUgZXhwb3NlIGFzIHB1YmxpYyBpbnN0ZWFkIG9mIGdldC9zZXQgZm9yIG5vdGhpbmcuLi5cbiAgc2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKGJvb2wpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0Lm1haW50YWluVmlzaWJsZUR1cmF0aW9uID0gYm9vbDtcbiAgfVxuXG4gIGdldCBtYWludGFpblZpc2libGVEdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5tYWludGFpblZpc2libGVEdXJhdGlvbjtcbiAgfVxuXG4gIC8vIEByZWFkb25seSAtIHVzZWQgaW4gdHJhY2sgY29sbGVjdGlvblxuICBnZXQgZ3JvdXBlZExheWVycygpIHtcbiAgICByZXR1cm4gdGhpcy5fZ3JvdXBlZExheWVycztcbiAgfVxuXG4gIC8qKlxuICAgKiAgT3ZlcnJpZGUgdGhlIGRlZmF1bHQgU3VyZmFjZSB0aGF0IGlzIGluc3RhbmNpYXRlZCBvbiBlYWNoXG4gICAqICBAcGFyYW0ge0V2ZW50U291cmNlfSBjdG9yIC0gdGhlIGNvbnN0cnVjdG9yIHRvIHVzZSB0byBidWlsZCBzdXJmYWNlc1xuICAgKi9cbiAgY29uZmlndXJlU3VyZmFjZShjdG9yKSB7XG4gICAgdGhpcy5fc3VyZmFjZUN0b3IgPSBjdG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIEZhY3RvcnkgbWV0aG9kIHRvIGFkZCBpbnRlcmFjdGlvbiBtb2R1bGVzIHRoZSB0aW1lbGluZSBzaG91bGQgbGlzdGVuIHRvLlxuICAgKiBCeSBkZWZhdWx0LCB0aGUgdGltZWxpbmUgbGlzdGVuIHRvIEtleWJvYXJkLCBhbmQgaW5zdGFuY2lhdGUgYSBgU3VyZmFjZWAgb24gZWFjaCBjb250YWluZXIuXG4gICAqIENhbiBiZSB1c2VkIHRvIGluc3RhbGwgYW55IGludGVyYWN0aW9uIGltcGxlbWVudGluZyB0aGUgYEV2ZW50U291cmNlYCBpbnRlcmZhY2VcbiAgICogQHBhcmFtIHtFdmVudFNvdXJjZX0gY3RvciAtIHRoZSBjb250cnVjdG9yIG9mIHRoZSBpbnRlcmFjdGlvbiBtb2R1bGUgdG8gaW5zdGFuY2lhdGVcbiAgICogQHBhcmFtIGVsIHtET01FbGVtZW50fSB0aGUgRE9NIGVsZW1lbnQgdG8gYmluZCB0byB0aGUgRXZlbnRTb3VyY2UgbW9kdWxlXG4gICAqIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IG9wdGlvbnMgdG8gYmUgYXBwbGllZCB0byB0aGUgY3RvciAoZGVmYXVsdHMgdG8gYHt9YClcbiAgICovXG4gIGNyZWF0ZUludGVyYWN0aW9uKGN0b3IsIGVsLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBpbnRlcmFjdGlvbiA9IG5ldyBjdG9yKGVsLCBvcHRpb25zKTtcbiAgICBpbnRlcmFjdGlvbi5vbignZXZlbnQnLCAoZSkgPT4gdGhpcy5faGFuZGxlRXZlbnQoZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjYWxsYmFjayB0aGF0IGlzIHVzZWQgdG8gbGlzdGVuIHRvIGludGVyYWN0aW9ucyBtb2R1bGVzXG4gICAqIEBwYXJhbXMge0V2ZW50fSBlIC0gYSBjdXN0b20gZXZlbnQgZ2VuZXJhdGVkIGJ5IGludGVyYWN0aW9uIG1vZHVsZXNcbiAgICovXG4gIF9oYW5kbGVFdmVudChlKSB7XG4gICAgLy8gZW1pdCBldmVudCBhcyBhIG1pZGRsZXdhcmVcbiAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZSk7XG4gICAgLy8gcHJvcGFnYXRlIHRvIHRoZSBzdGF0ZVxuICAgIGlmICghdGhpcy5fc3RhdGUpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5fc3RhdGUuaGFuZGxlRXZlbnQoZSk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBDaGFuZ2VzIHRoZSBzdGF0ZSBvZiB0aGUgdGltZWxpbmVcbiAgICogQHBhcmFtIHtCYXNlU3RhdGV9IHN0YXRlIC0gdGhlIHN0YXRlIGluIHdoaWNoIHRoZSB0aW1lbGluZSBtdXN0IGJlIHNldHRlZFxuICAgKi9cbiAgc2V0IHN0YXRlKHN0YXRlKSB7XG4gICAgaWYgKHRoaXMuX3N0YXRlKSB7IHRoaXMuX3N0YXRlLmV4aXQoKTsgfVxuICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgdGhpcy5fc3RhdGUuZW50ZXIoKTtcbiAgfVxuXG4gIGdldCBzdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogIFNob3J0Y3V0IHRvIGFjY2VzcyB0aGUgVHJhY2sgY29sbGVjdGlvblxuICAgKiAgQHJldHVybiB7VHJhY2tDb2xsZWN0aW9ufVxuICAgKi9cbiAgZ2V0IHRyYWNrcygpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhY2tzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3J0Y3V0IHRvIGFjY2VzcyB0aGUgTGF5ZXIgbGlzdFxuICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICovXG4gIGdldCBsYXllcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYWNrcy5sYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHRyYWNrIHRvIHRoZSB0aW1lbGluZVxuICAgKiBUcmFja3MgZGlzcGxheSBhIHZpZXcgd2luZG93IG9uIHRoZSB0aW1lbGluZSBpbiB0aGVpcnMgb3duIFNWRyBlbGVtZW50LlxuICAgKiBAcGFyYW0ge1RyYWNrfSB0cmFja1xuICAgKi9cbiAgYWRkKHRyYWNrKSB7XG4gICAgaWYgKHRoaXMudHJhY2tzLmluZGV4T2YodHJhY2spICE9PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd0cmFjayBhbHJlYWR5IGFkZGVkIHRvIHRoZSB0aW1lbGluZScpO1xuICAgIH1cblxuICAgIHRyYWNrLmNvbmZpZ3VyZSh0aGlzLnRpbWVDb250ZXh0KTtcblxuICAgIHRoaXMudHJhY2tzLnB1c2godHJhY2spO1xuICAgIHRoaXMuY3JlYXRlSW50ZXJhY3Rpb24odGhpcy5fc3VyZmFjZUN0b3IsIHRyYWNrLiRlbCk7XG4gIH1cblxuICAvKipcbiAgICogIFJlbW92ZXMgYSB0cmFjayBmcm9tIHRoZSB0aW1lbGluZVxuICAgKiAgQFRPRE9cbiAgICovXG4gIHJlbW92ZSh0cmFjaykge1xuICAgIC8vIHNob3VsZCBkZXN0cm95IGludGVyYWN0aW9uIHRvbywgYXZvaWQgZ2hvc3QgZXZlbnRMaXN0ZW5lcnNcbiAgfVxuXG4gIC8qKlxuICAgKiAgQ3JlYXRlcyBhIG5ldyB0cmFjayBmcm9tIHRoZSBjb25maWd1cmF0aW9uIGRlZmluZSBpbiBgY29uZmlndXJlVHJhY2tzYFxuICAgKiAgQHBhcmFtIHtET01FbGVtZW50fSAkZWwgLSB0aGUgZWxlbWVudCB0byBpbnNlcnQgdGhlIHRyYWNrIGluc2lkZVxuICAgKiAgQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBvdmVycmlkZSB0aGUgZGVmYXVsdHMgb3B0aW9ucyBpZiBuZWNlc3NhcnlcbiAgICogIEBwYXJhbSB7U3RyaW5nfSBbdHJhY2tJZD1udWxsXSAtIG9wdGlvbm5hbCBpZCB0byBnaXZlIHRvIHRoZSB0cmFjaywgb25seSBleGlzdHMgaW4gdGltZWxpbmUncyBjb250ZXh0XG4gICAqICBAcmV0dXJuIHtUcmFja31cbiAgICovXG4gIGNyZWF0ZVRyYWNrKCRlbCwgdHJhY2tIZWlnaHQgPSAxMDAsIHRyYWNrSWQgPSBudWxsKSB7XG4gICAgY29uc3QgdHJhY2sgPSBuZXcgVHJhY2soJGVsLCB0cmFja0hlaWdodCk7XG5cbiAgICBpZiAodHJhY2tJZCAhPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuX3RyYWNrQnlJZFt0cmFja0lkXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgdHJhY2tJZDogXCIke3RyYWNrSWR9XCIgaXMgYWxyZWFkeSB1c2VkYCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3RyYWNrQnlJZFt0cmFja0lkXSA9IHRyYWNrO1xuICAgIH1cblxuICAgIC8vIEFkZCB0cmFjayB0byB0aGUgdGltZWxpbmVcbiAgICB0aGlzLmFkZCh0cmFjayk7XG4gICAgdHJhY2sucmVuZGVyKCk7XG4gICAgdHJhY2sudXBkYXRlKCk7XG5cbiAgICByZXR1cm4gdHJhY2s7XG4gIH1cblxuICAvKipcbiAgICogIEFkZHMgYSBsYXllciB0byBhIHRyYWNrLCBhbGxvdyB0byBncm91cCB0cmFjayBhcmJpdHJhcmlseSBpbnNpZGUgZ3JvdXBzLiBCYXNpY2FsbHkgYSB3cmFwcGVyIGZvciBgdHJhY2suYWRkKGxheWVyKWBcbiAgICogIEBwYXJhbSB7TGF5ZXJ9IGxheWVyIC0gdGhlIGxheWVyIHRvIGFkZFxuICAgKiAgQHBhcmFtIHtUcmFja30gdHJhY2sgLSB0aGUgdHJhY2sgdG8gdGhlIGluc2VydCB0aGUgbGF5ZXIgaW5cbiAgICogIEBwYXJhbSB7U3RyaW5nfSBbZ3JvdXBJZD0nZGVmYXVsdCddIC0gdGhlIGdyb3VwIGluIHdoaWNoIGFzc29jaWF0ZSB0aGUgbGF5ZXJcbiAgICovXG4gIGFkZExheWVyKGxheWVyLCB0cmFja09yVHJhY2tJZCwgZ3JvdXBJZCA9ICdkZWZhdWx0Jykge1xuICAgIGxldCB0cmFjayA9IHRyYWNrT3JUcmFja0lkO1xuXG4gICAgaWYgKHR5cGVvZiB0cmFja09yVHJhY2tJZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRyYWNrID0gdGhpcy5nZXRUcmFja0J5SWQodHJhY2tPclRyYWNrSWQpO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZXMgdGhlIGBMYXllclRpbWVDb250ZXh0YCBpZiBub3QgcHJlc2VudFxuICAgIGlmICghbGF5ZXIudGltZUNvbnRleHQpIHtcbiAgICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gbmV3IExheWVyVGltZUNvbnRleHQodGhpcy50aW1lQ29udGV4dCk7XG4gICAgICBsYXllci5zZXRUaW1lQ29udGV4dCh0aW1lQ29udGV4dCk7XG4gICAgfVxuXG4gICAgLy8gd2Ugc2hvdWxkIGhhdmUgYSBUcmFjayBpbnN0YW5jZSBhdCB0aGlzIHBvaW50XG4gICAgdHJhY2suYWRkKGxheWVyKTtcblxuICAgIGlmICghdGhpcy5fZ3JvdXBlZExheWVyc1tncm91cElkXSkge1xuICAgICAgdGhpcy5fZ3JvdXBlZExheWVyc1tncm91cElkXSA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF0ucHVzaChsYXllcik7XG5cbiAgICBsYXllci5yZW5kZXIoKTtcbiAgICBsYXllci51cGRhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgUmVtb3ZlcyBhIGxheWVyIGZyb20gaXRzIHRyYWNrICh0aGUgbGF5ZXIgaXMgZGV0YXRjaGVkIGZyb20gdGhlIERPTSBidXQgY2FuIHN0aWxsIGJlIHJldXNlZClcbiAgICogIEBwYXJhbSB7TGF5ZXJ9IGxheWVyIC0gdGhlIGxheWVyIHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlTGF5ZXIobGF5ZXIpIHtcbiAgICB0aGlzLnRyYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKHRyYWNrKSB7XG4gICAgICBjb25zdCBpbmRleCA9IHRyYWNrLmxheWVycy5pbmRleE9mKGxheWVyKTtcbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHsgdHJhY2sucmVtb3ZlKGxheWVyKTsgfVxuICAgIH0pO1xuXG4gICAgLy8gY2xlYW4gcmVmZXJlbmNlcyBpbiBoZWxwZXJzXG4gICAgZm9yIChsZXQgZ3JvdXBJZCBpbiB0aGlzLl9ncm91cGVkTGF5ZXJzKSB7XG4gICAgICBjb25zdCBncm91cCA9IHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF07XG4gICAgICBjb25zdCBpbmRleCA9IGdyb3VwLmluZGV4T2YobGF5ZXIpO1xuXG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7IGdyb3VwLnNwbGljZShsYXllciwgMSk7IH1cblxuICAgICAgaWYgKCFncm91cC5sZW5ndGgpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBSZXR1cm5zIGEgdHJhY2sgZnJvbSBpdCdzIGlkXG4gICAqICBAcGFyYW0ge1N0cmluZ30gdHJhY2tJZFxuICAgKiAgQHJldHVybiB7VHJhY2t9XG4gICAqL1xuICBnZXRUcmFja0J5SWQodHJhY2tJZCkge1xuICAgIHJldHVybiB0aGlzLl90cmFja0J5SWRbdHJhY2tJZF07XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBsYXllcnMgZnJvbSB0aGVpciBncm91cCBJZFxuICAgKiBAcGFyYW0ge1N0cmluZ30gZ3JvdXBJZFxuICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICovXG4gIGdldExheWVyc0J5R3JvdXAoZ3JvdXBJZCkge1xuICAgIHJldHVybiB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdO1xuICB9XG5cbiAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHlpZWxkKiB0aGlzLnRyYWNrc1tTeW1ib2wuaXRlcmF0b3JdKCk7XG4gIH1cbn1cbiJdfQ==