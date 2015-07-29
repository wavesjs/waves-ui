'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _Symbol$iterator = require('babel-runtime/core-js/symbol/iterator')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
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

    var _this = this;

    var visibleWidth = arguments[1] === undefined ? 1000 : arguments[1];

    var _ref = arguments[2] === undefined ? {} : arguments[2];

    var _ref$registerKeyboard = _ref.registerKeyboard;
    var registerKeyboard = _ref$registerKeyboard === undefined ? true : _ref$registerKeyboard;

    _classCallCheck(this, Timeline);

    _get(Object.getPrototypeOf(Timeline.prototype), 'constructor', this).call(this);

    this._tracks = new _trackCollection2['default'](this);
    this._state = null;

    // default interactions
    this._surfaceCtor = _interactionsSurface2['default'];

    if (registerKeyboard) {
      (function () {
        var registerKeyboard = function () {
          that.createInteraction(_interactionsKeyboard2['default'], document.body);
          document.removeEventListener('DOMContentLoaded', registerKeyboard);
        };

        var that = _this;

        document.addEventListener('DOMContentLoaded', registerKeyboard, false);
      })();
    }

    // stores
    this._trackById = {};
    this._groupedLayers = {};

    this.timeContext = new _timelineTimeContext2['default'](pixelsPerSecond, visibleWidth);
  }

  _inherits(Timeline, _events$EventEmitter);

  _createClass(Timeline, [{
    key: 'offset',

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
    key: 'zoom',
    get: function () {
      return this.timeContext.zoom;
    },
    set: function (value) {
      this.timeContext.zoom = value;
    }
  }, {
    key: 'pixelsPerSecond',
    get: function () {
      return this.timeContext.pixelsPerSecond;
    },
    set: function (value) {
      this.timeContext.pixelsPerSecond = value;
    }
  }, {
    key: 'visibleWidth',
    get: function () {
      return this.timeContext.visibleWidth;
    },
    set: function (value) {
      this.timeContext.visibleWidth = value;
    }
  }, {
    key: 'timeToPixel',
    get: function () {
      return this.timeContext.timeToPixel;
    }
  }, {
    key: 'visibleDuration',

    /**
     *  @readonly
     */
    get: function () {
      return this.timeContext.visibleDuration;
    }
  }, {
    key: 'maintainVisibleDuration',

    // @NOTE maybe expose as public instead of get/set for nothing...
    set: function (bool) {
      this.timeContext.maintainVisibleDuration = bool;
    },
    get: function () {
      return this.timeContext.maintainVisibleDuration;
    }
  }, {
    key: 'groupedLayers',

    // @readonly - used in track collection
    get: function () {
      return this._groupedLayers;
    }
  }, {
    key: 'configureSurface',

    /**
     *  Override the default Surface that is instanciated on each
     *  @param {EventSource} ctor - the constructor to use to build surfaces
     */
    value: function configureSurface(ctor) {
      this._surfaceCtor = ctor;
    }
  }, {
    key: 'createInteraction',

    /**
     * Factory method to add interaction modules the timeline should listen to.
     * By default, the timeline listen to Keyboard, and instanciate a `Surface` on each container.
     * Can be used to install any interaction implementing the `EventSource` interface
     * @param {EventSource} ctor - the contructor of the interaction module to instanciate
     * @param el {DOMElement} the DOM element to bind to the EventSource module
     * @param options {Object} options to be applied to the ctor (defaults to `{}`)
     */
    value: function createInteraction(ctor, el) {
      var _this2 = this;

      var options = arguments[2] === undefined ? {} : arguments[2];

      var interaction = new ctor(el, options);
      interaction.on('event', function (e) {
        return _this2._handleEvent(e);
      });
    }
  }, {
    key: '_handleEvent',

    /**
     * The callback that is used to listen to interactions modules
     * @params {Event} e - a custom event generated by interaction modules
     */
    value: function _handleEvent(e) {
      // emit event as a middleware
      this.emit('event', e);
      // propagate to the state
      if (!this._state) {
        return;
      }
      this._state.handleEvent(e);
    }
  }, {
    key: 'state',

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
    key: 'tracks',

    /**
     *  Shortcut to access the Track collection
     *  @return {TrackCollection}
     */
    get: function () {
      return this._tracks;
    }
  }, {
    key: 'layers',

    /**
     * Shortcut to access the Layer list
     * @return {Array}
     */
    get: function () {
      return this._tracks.layers;
    }
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
  }, {
    key: 'remove',

    /**
     *  Removes a track from the timeline
     *  @TODO
     */
    value: function remove(track) {}
  }, {
    key: 'createTrack',

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
  }, {
    key: 'addLayer',

    /**
     *  Adds a layer to a track, allow to group track arbitrarily inside groups. Basically a wrapper for `track.add(layer)`
     *  @param {Layer} layer - the layer to add
     *  @param {Track} track - the track to the insert the layer in
     *  @param {String} [groupId='default'] - the group in which associate the layer
     */
    value: function addLayer(layer, trackOrTrackId) {
      var groupId = arguments[2] === undefined ? 'default' : arguments[2];

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
  }, {
    key: 'removeLayer',

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
    key: 'getTrackById',

    /**
     *  Returns a track from it's id
     *  @param {String} trackId
     *  @return {Track}
     */
    value: function getTrackById(trackId) {
      return this._trackById[trackId];
    }
  }, {
    key: 'getTrackFromDOMElement',

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
  }, {
    key: 'getLayersByGroup',

    /**
     * Returns an array of layers from their group Id
     * @param {String} groupId
     * @return {Array}
     */
    value: function getLayersByGroup(groupId) {
      return this._groupedLayers[groupId];
    }
  }, {
    key: _Symbol$iterator,
    value: _regeneratorRuntime.mark(function callee$1$0() {
      return _regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.delegateYield(_getIterator(this.tracks), 't0', 1);

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, callee$1$0, this);
    })
  }]);

  return Timeline;
})(_events2['default'].EventEmitter);

exports['default'] = Timeline;
module.exports = exports['default'];

// should destroy interaction too, avoid ghost eventListeners
//# sourceMappingURL=data:application/json;base64,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QUssRUFBRSxDQUFDLENBQUMsQ0FBQztTQUFFOztBQUU3QyxZQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtBQUNqQixpQkFBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3JDO09BQ0Y7S0FDRjs7Ozs7Ozs7O1dBT1csc0JBQUMsT0FBTyxFQUFFO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNqQzs7Ozs7Ozs7O1dBT3FCLGdDQUFDLEdBQUcsRUFBRTtBQUMxQixVQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVqQixTQUFHO0FBQ0QsWUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNuQyxjQUFJLEdBQUcsR0FBRyxDQUFDO1NBQ1o7QUFDRCxXQUFHLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQztPQUN0QixRQUFRLElBQUksS0FBSyxJQUFJLEVBQUU7O0FBRXhCLFVBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVMsTUFBTSxFQUFFO0FBQ25DLFlBQUksTUFBTSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7QUFBRSxlQUFLLEdBQUcsTUFBTSxDQUFDO1NBQUU7T0FDOUMsQ0FBQyxDQUFDOztBQUVILGFBQU8sS0FBSyxDQUFDO0tBQ2Q7Ozs7Ozs7OztXQU9lLDBCQUFDLE9BQU8sRUFBRTtBQUN4QixhQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDckM7OztvQ0FFaUI7Ozs7MERBQ1QsSUFBSSxDQUFDLE1BQU07Ozs7Ozs7S0FDbkI7OztTQWxUa0IsUUFBUTtHQUFTLG9CQUFPLFlBQVk7O3FCQUFwQyxRQUFRIiwiZmlsZSI6ImVzNi9jb3JlL3RpbWVsaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV2ZW50cyBmcm9tICdldmVudHMnO1xuXG5pbXBvcnQgS2V5Ym9hcmQgZnJvbSAnLi4vaW50ZXJhY3Rpb25zL2tleWJvYXJkJztcbmltcG9ydCBMYXllclRpbWVDb250ZXh0IGZyb20gJy4vbGF5ZXItdGltZS1jb250ZXh0JztcbmltcG9ydCBTdXJmYWNlIGZyb20gJy4uL2ludGVyYWN0aW9ucy9zdXJmYWNlJztcbmltcG9ydCBUaW1lbGluZVRpbWVDb250ZXh0IGZyb20gJy4vdGltZWxpbmUtdGltZS1jb250ZXh0JztcbmltcG9ydCBUcmFjayBmcm9tICcuL3RyYWNrJztcbmltcG9ydCBUcmFja0NvbGxlY3Rpb24gZnJvbSAnLi90cmFjay1jb2xsZWN0aW9uJztcblxuXG4vKipcbiAqIFRoZSBgdGltZWxpbmVgIGlzIHRoZSBtYWluIGVudHJ5IHBvaW50IG9mIGEgdGVtcG9yYWwgdmlzdWFsaXphdGlvbiwgaXQ6XG4gKiAtIGNvbnRhaW5zIGZhY3RvcmllcyB0byBtYW5hZ2UgaXRzIGB0cmFja3NgIGFuZCBgbGF5ZXJzYCxcbiAqIC0gZ2V0IG9yIHNldCB0aGUgdmlldyB3aW5kb3cgb3ZlcnMgaXRzIGB0cmFja3NgIHRocm91Z2ggYG9mZnNldGAsIGB6b29tYCwgICogYHBpeGVsc1BlclNlY29uZGAsIGB2aXNpYmxlV2lkdGhgLFxuICogLSBpcyB0aGUgY2VudHJhbCBodWIgZm9yIGFsbCB1c2VyIGludGVyYWN0aW9uIGV2ZW50cyAoa2V5Ym9hcmQsIG1vdXNlKSxcbiAqIC0gaG9sZHMgdGhlIGN1cnJlbnQgaW50ZXJhY3Rpb24gYHN0YXRlYCB3aGljaCBkZWZpbmVzIGhvdyB0aGUgZGlmZmVyZW50IHRpbWVsaW5lIGVsZW1lbnRzICh0cmFja3MsIGxheWVycywgc2hhcGVzKSByZXNwb25kIHRvIHVzZXIgaW50ZXJhY3Rpb25zLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lbGluZSBleHRlbmRzIGV2ZW50cy5FdmVudEVtaXR0ZXIge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgVGltZWxpbmVgIGluc3RhbmNlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwaXhlbHNQZXJTZWNvbmQgPSAxMDAsIHZpc2libGVXaWR0aCA9IDEwMDAsIHtcbiAgICByZWdpc3RlcktleWJvYXJkID0gdHJ1ZVxuICB9ID0ge30pIHtcblxuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLl90cmFja3MgPSBuZXcgVHJhY2tDb2xsZWN0aW9uKHRoaXMpO1xuICAgIHRoaXMuX3N0YXRlID0gbnVsbDtcblxuICAgIC8vIGRlZmF1bHQgaW50ZXJhY3Rpb25zXG4gICAgdGhpcy5fc3VyZmFjZUN0b3IgPSBTdXJmYWNlO1xuXG4gICAgaWYgKHJlZ2lzdGVyS2V5Ym9hcmQpIHtcbiAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuXG4gICAgICBmdW5jdGlvbiByZWdpc3RlcktleWJvYXJkKCkge1xuICAgICAgICB0aGF0LmNyZWF0ZUludGVyYWN0aW9uKEtleWJvYXJkLCBkb2N1bWVudC5ib2R5KTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIHJlZ2lzdGVyS2V5Ym9hcmQpO1xuICAgICAgfVxuXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgcmVnaXN0ZXJLZXlib2FyZCwgZmFsc2UpO1xuICAgIH1cblxuICAgIC8vIHN0b3Jlc1xuICAgIHRoaXMuX3RyYWNrQnlJZCA9IHt9O1xuICAgIHRoaXMuX2dyb3VwZWRMYXllcnMgPSB7fTtcblxuICAgIHRoaXMudGltZUNvbnRleHQgPSBuZXcgVGltZWxpbmVUaW1lQ29udGV4dChwaXhlbHNQZXJTZWNvbmQsIHZpc2libGVXaWR0aCk7XG4gIH1cblxuICAvKipcbiAgICogIFRpbWVDb250ZXh0IGFjY2Vzc29yc1xuICAgKi9cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5vZmZzZXQ7XG4gIH1cblxuICBzZXQgb2Zmc2V0KHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC5vZmZzZXQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCB6b29tKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0Lnpvb207XG4gIH1cblxuICBzZXQgem9vbSh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQuem9vbSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHBpeGVsc1BlclNlY29uZCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5waXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICBzZXQgcGl4ZWxzUGVyU2Vjb25kKHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC5waXhlbHNQZXJTZWNvbmQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCB2aXNpYmxlV2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQudmlzaWJsZVdpZHRoO1xuICB9XG5cbiAgc2V0IHZpc2libGVXaWR0aCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQudmlzaWJsZVdpZHRoID0gdmFsdWU7XG4gIH1cblxuICBnZXQgdGltZVRvUGl4ZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWw7XG4gIH1cblxuICAvKipcbiAgICogIEByZWFkb25seVxuICAgKi9cbiAgZ2V0IHZpc2libGVEdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC52aXNpYmxlRHVyYXRpb247XG4gIH1cblxuICAvLyBATk9URSBtYXliZSBleHBvc2UgYXMgcHVibGljIGluc3RlYWQgb2YgZ2V0L3NldCBmb3Igbm90aGluZy4uLlxuICBzZXQgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24oYm9vbCkge1xuICAgIHRoaXMudGltZUNvbnRleHQubWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSBib29sO1xuICB9XG5cbiAgZ2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0Lm1haW50YWluVmlzaWJsZUR1cmF0aW9uO1xuICB9XG5cbiAgLy8gQHJlYWRvbmx5IC0gdXNlZCBpbiB0cmFjayBjb2xsZWN0aW9uXG4gIGdldCBncm91cGVkTGF5ZXJzKCkge1xuICAgIHJldHVybiB0aGlzLl9ncm91cGVkTGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqICBPdmVycmlkZSB0aGUgZGVmYXVsdCBTdXJmYWNlIHRoYXQgaXMgaW5zdGFuY2lhdGVkIG9uIGVhY2hcbiAgICogIEBwYXJhbSB7RXZlbnRTb3VyY2V9IGN0b3IgLSB0aGUgY29uc3RydWN0b3IgdG8gdXNlIHRvIGJ1aWxkIHN1cmZhY2VzXG4gICAqL1xuICBjb25maWd1cmVTdXJmYWNlKGN0b3IpIHtcbiAgICB0aGlzLl9zdXJmYWNlQ3RvciA9IGN0b3I7XG4gIH1cblxuICAvKipcbiAgICogRmFjdG9yeSBtZXRob2QgdG8gYWRkIGludGVyYWN0aW9uIG1vZHVsZXMgdGhlIHRpbWVsaW5lIHNob3VsZCBsaXN0ZW4gdG8uXG4gICAqIEJ5IGRlZmF1bHQsIHRoZSB0aW1lbGluZSBsaXN0ZW4gdG8gS2V5Ym9hcmQsIGFuZCBpbnN0YW5jaWF0ZSBhIGBTdXJmYWNlYCBvbiBlYWNoIGNvbnRhaW5lci5cbiAgICogQ2FuIGJlIHVzZWQgdG8gaW5zdGFsbCBhbnkgaW50ZXJhY3Rpb24gaW1wbGVtZW50aW5nIHRoZSBgRXZlbnRTb3VyY2VgIGludGVyZmFjZVxuICAgKiBAcGFyYW0ge0V2ZW50U291cmNlfSBjdG9yIC0gdGhlIGNvbnRydWN0b3Igb2YgdGhlIGludGVyYWN0aW9uIG1vZHVsZSB0byBpbnN0YW5jaWF0ZVxuICAgKiBAcGFyYW0gZWwge0RPTUVsZW1lbnR9IHRoZSBET00gZWxlbWVudCB0byBiaW5kIHRvIHRoZSBFdmVudFNvdXJjZSBtb2R1bGVcbiAgICogQHBhcmFtIG9wdGlvbnMge09iamVjdH0gb3B0aW9ucyB0byBiZSBhcHBsaWVkIHRvIHRoZSBjdG9yIChkZWZhdWx0cyB0byBge31gKVxuICAgKi9cbiAgY3JlYXRlSW50ZXJhY3Rpb24oY3RvciwgZWwsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGludGVyYWN0aW9uID0gbmV3IGN0b3IoZWwsIG9wdGlvbnMpO1xuICAgIGludGVyYWN0aW9uLm9uKCdldmVudCcsIChlKSA9PiB0aGlzLl9oYW5kbGVFdmVudChlKSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNhbGxiYWNrIHRoYXQgaXMgdXNlZCB0byBsaXN0ZW4gdG8gaW50ZXJhY3Rpb25zIG1vZHVsZXNcbiAgICogQHBhcmFtcyB7RXZlbnR9IGUgLSBhIGN1c3RvbSBldmVudCBnZW5lcmF0ZWQgYnkgaW50ZXJhY3Rpb24gbW9kdWxlc1xuICAgKi9cbiAgX2hhbmRsZUV2ZW50KGUpIHtcbiAgICAvLyBlbWl0IGV2ZW50IGFzIGEgbWlkZGxld2FyZVxuICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBlKTtcbiAgICAvLyBwcm9wYWdhdGUgdG8gdGhlIHN0YXRlXG4gICAgaWYgKCF0aGlzLl9zdGF0ZSkgeyByZXR1cm47IH1cbiAgICB0aGlzLl9zdGF0ZS5oYW5kbGVFdmVudChlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIENoYW5nZXMgdGhlIHN0YXRlIG9mIHRoZSB0aW1lbGluZVxuICAgKiBAcGFyYW0ge0Jhc2VTdGF0ZX0gc3RhdGUgLSB0aGUgc3RhdGUgaW4gd2hpY2ggdGhlIHRpbWVsaW5lIG11c3QgYmUgc2V0dGVkXG4gICAqL1xuICBzZXQgc3RhdGUoc3RhdGUpIHtcbiAgICBpZiAodGhpcy5fc3RhdGUpIHsgdGhpcy5fc3RhdGUuZXhpdCgpOyB9XG4gICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcbiAgICB0aGlzLl9zdGF0ZS5lbnRlcigpO1xuICB9XG5cbiAgZ2V0IHN0YXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgU2hvcnRjdXQgdG8gYWNjZXNzIHRoZSBUcmFjayBjb2xsZWN0aW9uXG4gICAqICBAcmV0dXJuIHtUcmFja0NvbGxlY3Rpb259XG4gICAqL1xuICBnZXQgdHJhY2tzKCkge1xuICAgIHJldHVybiB0aGlzLl90cmFja3M7XG4gIH1cblxuICAvKipcbiAgICogU2hvcnRjdXQgdG8gYWNjZXNzIHRoZSBMYXllciBsaXN0XG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKi9cbiAgZ2V0IGxheWVycygpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhY2tzLmxheWVycztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgdHJhY2sgdG8gdGhlIHRpbWVsaW5lXG4gICAqIFRyYWNrcyBkaXNwbGF5IGEgdmlldyB3aW5kb3cgb24gdGhlIHRpbWVsaW5lIGluIHRoZWlycyBvd24gU1ZHIGVsZW1lbnQuXG4gICAqIEBwYXJhbSB7VHJhY2t9IHRyYWNrXG4gICAqL1xuICBhZGQodHJhY2spIHtcbiAgICBpZiAodGhpcy50cmFja3MuaW5kZXhPZih0cmFjaykgIT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RyYWNrIGFscmVhZHkgYWRkZWQgdG8gdGhlIHRpbWVsaW5lJyk7XG4gICAgfVxuXG4gICAgdHJhY2suY29uZmlndXJlKHRoaXMudGltZUNvbnRleHQpO1xuXG4gICAgdGhpcy50cmFja3MucHVzaCh0cmFjayk7XG4gICAgdGhpcy5jcmVhdGVJbnRlcmFjdGlvbih0aGlzLl9zdXJmYWNlQ3RvciwgdHJhY2suJGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgUmVtb3ZlcyBhIHRyYWNrIGZyb20gdGhlIHRpbWVsaW5lXG4gICAqICBAVE9ET1xuICAgKi9cbiAgcmVtb3ZlKHRyYWNrKSB7XG4gICAgLy8gc2hvdWxkIGRlc3Ryb3kgaW50ZXJhY3Rpb24gdG9vLCBhdm9pZCBnaG9zdCBldmVudExpc3RlbmVyc1xuICB9XG5cbiAgLyoqXG4gICAqICBDcmVhdGVzIGEgbmV3IHRyYWNrIGZyb20gdGhlIGNvbmZpZ3VyYXRpb24gZGVmaW5lIGluIGBjb25maWd1cmVUcmFja3NgXG4gICAqICBAcGFyYW0ge0RPTUVsZW1lbnR9ICRlbCAtIHRoZSBlbGVtZW50IHRvIGluc2VydCB0aGUgdHJhY2sgaW5zaWRlXG4gICAqICBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIG92ZXJyaWRlIHRoZSBkZWZhdWx0cyBvcHRpb25zIGlmIG5lY2Vzc2FyeVxuICAgKiAgQHBhcmFtIHtTdHJpbmd9IFt0cmFja0lkPW51bGxdIC0gb3B0aW9ubmFsIGlkIHRvIGdpdmUgdG8gdGhlIHRyYWNrLCBvbmx5IGV4aXN0cyBpbiB0aW1lbGluZSdzIGNvbnRleHRcbiAgICogIEByZXR1cm4ge1RyYWNrfVxuICAgKi9cbiAgY3JlYXRlVHJhY2soJGVsLCB0cmFja0hlaWdodCA9IDEwMCwgdHJhY2tJZCA9IG51bGwpIHtcbiAgICBjb25zdCB0cmFjayA9IG5ldyBUcmFjaygkZWwsIHRyYWNrSGVpZ2h0KTtcblxuICAgIGlmICh0cmFja0lkICE9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5fdHJhY2tCeUlkW3RyYWNrSWRdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGB0cmFja0lkOiBcIiR7dHJhY2tJZH1cIiBpcyBhbHJlYWR5IHVzZWRgKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdHJhY2tCeUlkW3RyYWNrSWRdID0gdHJhY2s7XG4gICAgfVxuXG4gICAgLy8gQWRkIHRyYWNrIHRvIHRoZSB0aW1lbGluZVxuICAgIHRoaXMuYWRkKHRyYWNrKTtcbiAgICB0cmFjay5yZW5kZXIoKTtcbiAgICB0cmFjay51cGRhdGUoKTtcblxuICAgIHJldHVybiB0cmFjaztcbiAgfVxuXG4gIC8qKlxuICAgKiAgQWRkcyBhIGxheWVyIHRvIGEgdHJhY2ssIGFsbG93IHRvIGdyb3VwIHRyYWNrIGFyYml0cmFyaWx5IGluc2lkZSBncm91cHMuIEJhc2ljYWxseSBhIHdyYXBwZXIgZm9yIGB0cmFjay5hZGQobGF5ZXIpYFxuICAgKiAgQHBhcmFtIHtMYXllcn0gbGF5ZXIgLSB0aGUgbGF5ZXIgdG8gYWRkXG4gICAqICBAcGFyYW0ge1RyYWNrfSB0cmFjayAtIHRoZSB0cmFjayB0byB0aGUgaW5zZXJ0IHRoZSBsYXllciBpblxuICAgKiAgQHBhcmFtIHtTdHJpbmd9IFtncm91cElkPSdkZWZhdWx0J10gLSB0aGUgZ3JvdXAgaW4gd2hpY2ggYXNzb2NpYXRlIHRoZSBsYXllclxuICAgKi9cbiAgYWRkTGF5ZXIobGF5ZXIsIHRyYWNrT3JUcmFja0lkLCBncm91cElkID0gJ2RlZmF1bHQnKSB7XG4gICAgbGV0IHRyYWNrID0gdHJhY2tPclRyYWNrSWQ7XG5cbiAgICBpZiAodHlwZW9mIHRyYWNrT3JUcmFja0lkID09PSAnc3RyaW5nJykge1xuICAgICAgdHJhY2sgPSB0aGlzLmdldFRyYWNrQnlJZCh0cmFja09yVHJhY2tJZCk7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlcyB0aGUgYExheWVyVGltZUNvbnRleHRgIGlmIG5vdCBwcmVzZW50XG4gICAgaWYgKCFsYXllci50aW1lQ29udGV4dCkge1xuICAgICAgY29uc3QgdGltZUNvbnRleHQgPSBuZXcgTGF5ZXJUaW1lQ29udGV4dCh0aGlzLnRpbWVDb250ZXh0KTtcbiAgICAgIGxheWVyLnNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KTtcbiAgICB9XG5cbiAgICAvLyB3ZSBzaG91bGQgaGF2ZSBhIFRyYWNrIGluc3RhbmNlIGF0IHRoaXMgcG9pbnRcbiAgICB0cmFjay5hZGQobGF5ZXIpO1xuXG4gICAgaWYgKCF0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdKSB7XG4gICAgICB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5fZ3JvdXBlZExheWVyc1tncm91cElkXS5wdXNoKGxheWVyKTtcblxuICAgIGxheWVyLnJlbmRlcigpO1xuICAgIGxheWVyLnVwZGF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqICBSZW1vdmVzIGEgbGF5ZXIgZnJvbSBpdHMgdHJhY2sgKHRoZSBsYXllciBpcyBkZXRhdGNoZWQgZnJvbSB0aGUgRE9NIGJ1dCBjYW4gc3RpbGwgYmUgcmV1c2VkKVxuICAgKiAgQHBhcmFtIHtMYXllcn0gbGF5ZXIgLSB0aGUgbGF5ZXIgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVMYXllcihsYXllcikge1xuICAgIHRoaXMudHJhY2tzLmZvckVhY2goZnVuY3Rpb24odHJhY2spIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdHJhY2subGF5ZXJzLmluZGV4T2YobGF5ZXIpO1xuICAgICAgaWYgKGluZGV4ICE9PSAtMSkgeyB0cmFjay5yZW1vdmUobGF5ZXIpOyB9XG4gICAgfSk7XG5cbiAgICAvLyBjbGVhbiByZWZlcmVuY2VzIGluIGhlbHBlcnNcbiAgICBmb3IgKGxldCBncm91cElkIGluIHRoaXMuX2dyb3VwZWRMYXllcnMpIHtcbiAgICAgIGNvbnN0IGdyb3VwID0gdGhpcy5fZ3JvdXBlZExheWVyc1tncm91cElkXTtcbiAgICAgIGNvbnN0IGluZGV4ID0gZ3JvdXAuaW5kZXhPZihsYXllcik7XG5cbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHsgZ3JvdXAuc3BsaWNlKGxheWVyLCAxKTsgfVxuXG4gICAgICBpZiAoIWdyb3VwLmxlbmd0aCkge1xuICAgICAgICBkZWxldGUgdGhpcy5fZ3JvdXBlZExheWVyc1tncm91cElkXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFJldHVybnMgYSB0cmFjayBmcm9tIGl0J3MgaWRcbiAgICogIEBwYXJhbSB7U3RyaW5nfSB0cmFja0lkXG4gICAqICBAcmV0dXJuIHtUcmFja31cbiAgICovXG4gIGdldFRyYWNrQnlJZCh0cmFja0lkKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYWNrQnlJZFt0cmFja0lkXTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgUmV0dXJucyB0aGUgdHJhY2sgY29udGFpbmluZyBhIGdpdmVuIERPTSBFbGVtZW50LCBpZiBubyBtYXRjaCBmb3VuZCByZXR1cm4gbnVsbFxuICAgKiAgQHBhcmFtIHtET01FbGVtZW50fSAkZWxcbiAgICogIEByZXR1cm4ge1RyYWNrfG51bGx9XG4gICAqL1xuICBnZXRUcmFja0Zyb21ET01FbGVtZW50KCRlbCkge1xuICAgIGxldCAkc3ZnID0gbnVsbDtcbiAgICBsZXQgdHJhY2sgPSBudWxsO1xuICAgIC8vIGZpbmQgdGhlIGNsb3Nlc3QgYC50cmFja2AgZWxlbWVudFxuICAgIGRvIHtcbiAgICAgIGlmICgkZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCd0cmFjaycpKSB7XG4gICAgICAgICRzdmcgPSAkZWw7XG4gICAgICB9XG4gICAgICAkZWwgPSAkZWwucGFyZW50Tm9kZTtcbiAgICB9IHdoaWxlICgkc3ZnID09PSBudWxsKTtcbiAgICAvLyBmaW5kIHRoZSByZWxhdGVkIGBUcmFja2BcbiAgICB0aGlzLnRyYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKF90cmFjaykge1xuICAgICAgaWYgKF90cmFjay4kc3ZnID09PSAkc3ZnKSB7IHRyYWNrID0gX3RyYWNrOyB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdHJhY2s7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBsYXllcnMgZnJvbSB0aGVpciBncm91cCBJZFxuICAgKiBAcGFyYW0ge1N0cmluZ30gZ3JvdXBJZFxuICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICovXG4gIGdldExheWVyc0J5R3JvdXAoZ3JvdXBJZCkge1xuICAgIHJldHVybiB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdO1xuICB9XG5cbiAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHlpZWxkKiB0aGlzLnRyYWNrc1tTeW1ib2wuaXRlcmF0b3JdKCk7XG4gIH1cbn1cbiJdfQ==