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
    var visibleWidth = arguments[1] === undefined ? 1000 : arguments[1];

    _classCallCheck(this, Timeline);

    _get(Object.getPrototypeOf(Timeline.prototype), 'constructor', this).call(this);

    this._tracks = new _trackCollection2['default'](this);
    this._state = null;

    // default interactions
    this._surfaceCtor = _interactionsSurface2['default'];

    var that = this;

    function registerKeyboard() {
      that.createInteraction(_interactionsKeyboard2['default'], document.body);
      document.removeEventListener('DOMContentLoaded', registerKeyboard);
    }

    document.addEventListener('DOMContentLoaded', registerKeyboard, false);

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
      var _this = this;

      var options = arguments[2] === undefined ? {} : arguments[2];

      var interaction = new ctor(el, options);
      interaction.on('event', function (e) {
        return _this._handleEvent(e);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsUUFBUTs7OztvQ0FFTiwwQkFBMEI7Ozs7Z0NBQ2xCLHNCQUFzQjs7OzttQ0FDL0IseUJBQXlCOzs7O21DQUNiLHlCQUF5Qjs7OztzQkFDdkMsU0FBUzs7OzsrQkFDQyxvQkFBb0I7Ozs7Ozs7Ozs7OztJQVUzQixRQUFROzs7OztBQUloQixXQUpRLFFBQVEsR0FJNkI7UUFBNUMsZUFBZSxnQ0FBRyxHQUFHO1FBQUUsWUFBWSxnQ0FBRyxJQUFJOzswQkFKbkMsUUFBUTs7QUFLekIsK0JBTGlCLFFBQVEsNkNBS2pCOztBQUVSLFFBQUksQ0FBQyxPQUFPLEdBQUcsaUNBQW9CLElBQUksQ0FBQyxDQUFDO0FBQ3pDLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDOzs7QUFHbkIsUUFBSSxDQUFDLFlBQVksbUNBQVUsQ0FBQzs7QUFFNUIsUUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixhQUFTLGdCQUFnQixHQUFHO0FBQzFCLFVBQUksQ0FBQyxpQkFBaUIsb0NBQVcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hELGNBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0tBQ3BFOztBQUVELFlBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQzs7O0FBR3ZFLFFBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDOztBQUV6QixRQUFJLENBQUMsV0FBVyxHQUFHLHFDQUF3QixlQUFlLEVBQUUsWUFBWSxDQUFDLENBQUM7R0FDM0U7O1lBM0JrQixRQUFROztlQUFSLFFBQVE7Ozs7OztTQWdDakIsWUFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLFdBQVcsQ0FB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SSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNyQztPQUNGO0tBQ0Y7Ozs7Ozs7OztXQU9XLHNCQUFDLE9BQU8sRUFBRTtBQUNwQixhQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDakM7Ozs7Ozs7OztXQU9xQixnQ0FBQyxHQUFHLEVBQUU7QUFDMUIsVUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFakIsU0FBRztBQUNELFlBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDbkMsY0FBSSxHQUFHLEdBQUcsQ0FBQztTQUNaO0FBQ0QsV0FBRyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUM7T0FDdEIsUUFBUSxJQUFJLEtBQUssSUFBSSxFQUFFOztBQUV4QixVQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFTLE1BQU0sRUFBRTtBQUNuQyxZQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO0FBQUUsZUFBSyxHQUFHLE1BQU0sQ0FBQztTQUFFO09BQzlDLENBQUMsQ0FBQzs7QUFFSCxhQUFPLEtBQUssQ0FBQztLQUNkOzs7Ozs7Ozs7V0FPZSwwQkFBQyxPQUFPLEVBQUU7QUFDeEIsYUFBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3JDOzs7b0NBRWlCOzs7OzBEQUNULElBQUksQ0FBQyxNQUFNOzs7Ozs7O0tBQ25COzs7U0E3U2tCLFFBQVE7R0FBUyxvQkFBTyxZQUFZOztxQkFBcEMsUUFBUSIsImZpbGUiOiJlczYvY29yZS90aW1lbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBldmVudHMgZnJvbSAnZXZlbnRzJztcblxuaW1wb3J0IEtleWJvYXJkIGZyb20gJy4uL2ludGVyYWN0aW9ucy9rZXlib2FyZCc7XG5pbXBvcnQgTGF5ZXJUaW1lQ29udGV4dCBmcm9tICcuL2xheWVyLXRpbWUtY29udGV4dCc7XG5pbXBvcnQgU3VyZmFjZSBmcm9tICcuLi9pbnRlcmFjdGlvbnMvc3VyZmFjZSc7XG5pbXBvcnQgVGltZWxpbmVUaW1lQ29udGV4dCBmcm9tICcuL3RpbWVsaW5lLXRpbWUtY29udGV4dCc7XG5pbXBvcnQgVHJhY2sgZnJvbSAnLi90cmFjayc7XG5pbXBvcnQgVHJhY2tDb2xsZWN0aW9uIGZyb20gJy4vdHJhY2stY29sbGVjdGlvbic7XG5cblxuLyoqXG4gKiBUaGUgYHRpbWVsaW5lYCBpcyB0aGUgbWFpbiBlbnRyeSBwb2ludCBvZiBhIHRlbXBvcmFsIHZpc3VhbGl6YXRpb24sIGl0OlxuICogLSBjb250YWlucyBmYWN0b3JpZXMgdG8gbWFuYWdlIGl0cyBgdHJhY2tzYCBhbmQgYGxheWVyc2AsXG4gKiAtIGdldCBvciBzZXQgdGhlIHZpZXcgd2luZG93IG92ZXJzIGl0cyBgdHJhY2tzYCB0aHJvdWdoIGBvZmZzZXRgLCBgem9vbWAsICAqIGBwaXhlbHNQZXJTZWNvbmRgLCBgdmlzaWJsZVdpZHRoYCxcbiAqIC0gaXMgdGhlIGNlbnRyYWwgaHViIGZvciBhbGwgdXNlciBpbnRlcmFjdGlvbiBldmVudHMgKGtleWJvYXJkLCBtb3VzZSksXG4gKiAtIGhvbGRzIHRoZSBjdXJyZW50IGludGVyYWN0aW9uIGBzdGF0ZWAgd2hpY2ggZGVmaW5lcyBob3cgdGhlIGRpZmZlcmVudCB0aW1lbGluZSBlbGVtZW50cyAodHJhY2tzLCBsYXllcnMsIHNoYXBlcykgcmVzcG9uZCB0byB1c2VyIGludGVyYWN0aW9ucy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYFRpbWVsaW5lYCBpbnN0YW5jZVxuICAgKi9cbiAgY29uc3RydWN0b3IocGl4ZWxzUGVyU2Vjb25kID0gMTAwLCB2aXNpYmxlV2lkdGggPSAxMDAwKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX3RyYWNrcyA9IG5ldyBUcmFja0NvbGxlY3Rpb24odGhpcyk7XG4gICAgdGhpcy5fc3RhdGUgPSBudWxsO1xuXG4gICAgLy8gZGVmYXVsdCBpbnRlcmFjdGlvbnNcbiAgICB0aGlzLl9zdXJmYWNlQ3RvciA9IFN1cmZhY2U7XG5cbiAgICBjb25zdCB0aGF0ID0gdGhpcztcblxuICAgIGZ1bmN0aW9uIHJlZ2lzdGVyS2V5Ym9hcmQoKSB7XG4gICAgICB0aGF0LmNyZWF0ZUludGVyYWN0aW9uKEtleWJvYXJkLCBkb2N1bWVudC5ib2R5KTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCByZWdpc3RlcktleWJvYXJkKTtcbiAgICB9XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgcmVnaXN0ZXJLZXlib2FyZCwgZmFsc2UpO1xuXG4gICAgLy8gc3RvcmVzXG4gICAgdGhpcy5fdHJhY2tCeUlkID0ge307XG4gICAgdGhpcy5fZ3JvdXBlZExheWVycyA9IHt9O1xuXG4gICAgdGhpcy50aW1lQ29udGV4dCA9IG5ldyBUaW1lbGluZVRpbWVDb250ZXh0KHBpeGVsc1BlclNlY29uZCwgdmlzaWJsZVdpZHRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgVGltZUNvbnRleHQgYWNjZXNzb3JzXG4gICAqL1xuICBnZXQgb2Zmc2V0KCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0Lm9mZnNldDtcbiAgfVxuXG4gIHNldCBvZmZzZXQodmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHpvb20oKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQuem9vbTtcbiAgfVxuXG4gIHNldCB6b29tKHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC56b29tID0gdmFsdWU7XG4gIH1cblxuICBnZXQgcGl4ZWxzUGVyU2Vjb25kKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnBpeGVsc1BlclNlY29uZDtcbiAgfVxuXG4gIHNldCBwaXhlbHNQZXJTZWNvbmQodmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnBpeGVsc1BlclNlY29uZCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHZpc2libGVXaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC52aXNpYmxlV2lkdGg7XG4gIH1cblxuICBzZXQgdmlzaWJsZVdpZHRoKHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC52aXNpYmxlV2lkdGggPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCB0aW1lVG9QaXhlbCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiAgQHJlYWRvbmx5XG4gICAqL1xuICBnZXQgdmlzaWJsZUR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnZpc2libGVEdXJhdGlvbjtcbiAgfVxuXG4gIC8vIEBOT1RFIG1heWJlIGV4cG9zZSBhcyBwdWJsaWMgaW5zdGVhZCBvZiBnZXQvc2V0IGZvciBub3RoaW5nLi4uXG4gIHNldCBtYWludGFpblZpc2libGVEdXJhdGlvbihib29sKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC5tYWludGFpblZpc2libGVEdXJhdGlvbiA9IGJvb2w7XG4gIH1cblxuICBnZXQgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQubWFpbnRhaW5WaXNpYmxlRHVyYXRpb247XG4gIH1cblxuICAvLyBAcmVhZG9ubHkgLSB1c2VkIGluIHRyYWNrIGNvbGxlY3Rpb25cbiAgZ2V0IGdyb3VwZWRMYXllcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dyb3VwZWRMYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogIE92ZXJyaWRlIHRoZSBkZWZhdWx0IFN1cmZhY2UgdGhhdCBpcyBpbnN0YW5jaWF0ZWQgb24gZWFjaFxuICAgKiAgQHBhcmFtIHtFdmVudFNvdXJjZX0gY3RvciAtIHRoZSBjb25zdHJ1Y3RvciB0byB1c2UgdG8gYnVpbGQgc3VyZmFjZXNcbiAgICovXG4gIGNvbmZpZ3VyZVN1cmZhY2UoY3Rvcikge1xuICAgIHRoaXMuX3N1cmZhY2VDdG9yID0gY3RvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBGYWN0b3J5IG1ldGhvZCB0byBhZGQgaW50ZXJhY3Rpb24gbW9kdWxlcyB0aGUgdGltZWxpbmUgc2hvdWxkIGxpc3RlbiB0by5cbiAgICogQnkgZGVmYXVsdCwgdGhlIHRpbWVsaW5lIGxpc3RlbiB0byBLZXlib2FyZCwgYW5kIGluc3RhbmNpYXRlIGEgYFN1cmZhY2VgIG9uIGVhY2ggY29udGFpbmVyLlxuICAgKiBDYW4gYmUgdXNlZCB0byBpbnN0YWxsIGFueSBpbnRlcmFjdGlvbiBpbXBsZW1lbnRpbmcgdGhlIGBFdmVudFNvdXJjZWAgaW50ZXJmYWNlXG4gICAqIEBwYXJhbSB7RXZlbnRTb3VyY2V9IGN0b3IgLSB0aGUgY29udHJ1Y3RvciBvZiB0aGUgaW50ZXJhY3Rpb24gbW9kdWxlIHRvIGluc3RhbmNpYXRlXG4gICAqIEBwYXJhbSBlbCB7RE9NRWxlbWVudH0gdGhlIERPTSBlbGVtZW50IHRvIGJpbmQgdG8gdGhlIEV2ZW50U291cmNlIG1vZHVsZVxuICAgKiBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fSBvcHRpb25zIHRvIGJlIGFwcGxpZWQgdG8gdGhlIGN0b3IgKGRlZmF1bHRzIHRvIGB7fWApXG4gICAqL1xuICBjcmVhdGVJbnRlcmFjdGlvbihjdG9yLCBlbCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgaW50ZXJhY3Rpb24gPSBuZXcgY3RvcihlbCwgb3B0aW9ucyk7XG4gICAgaW50ZXJhY3Rpb24ub24oJ2V2ZW50JywgKGUpID0+IHRoaXMuX2hhbmRsZUV2ZW50KGUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY2FsbGJhY2sgdGhhdCBpcyB1c2VkIHRvIGxpc3RlbiB0byBpbnRlcmFjdGlvbnMgbW9kdWxlc1xuICAgKiBAcGFyYW1zIHtFdmVudH0gZSAtIGEgY3VzdG9tIGV2ZW50IGdlbmVyYXRlZCBieSBpbnRlcmFjdGlvbiBtb2R1bGVzXG4gICAqL1xuICBfaGFuZGxlRXZlbnQoZSkge1xuICAgIC8vIGVtaXQgZXZlbnQgYXMgYSBtaWRkbGV3YXJlXG4gICAgdGhpcy5lbWl0KCdldmVudCcsIGUpO1xuICAgIC8vIHByb3BhZ2F0ZSB0byB0aGUgc3RhdGVcbiAgICBpZiAoIXRoaXMuX3N0YXRlKSB7IHJldHVybjsgfVxuICAgIHRoaXMuX3N0YXRlLmhhbmRsZUV2ZW50KGUpO1xuICB9XG5cblxuICAvKipcbiAgICogQ2hhbmdlcyB0aGUgc3RhdGUgb2YgdGhlIHRpbWVsaW5lXG4gICAqIEBwYXJhbSB7QmFzZVN0YXRlfSBzdGF0ZSAtIHRoZSBzdGF0ZSBpbiB3aGljaCB0aGUgdGltZWxpbmUgbXVzdCBiZSBzZXR0ZWRcbiAgICovXG4gIHNldCBzdGF0ZShzdGF0ZSkge1xuICAgIGlmICh0aGlzLl9zdGF0ZSkgeyB0aGlzLl9zdGF0ZS5leGl0KCk7IH1cbiAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuICAgIHRoaXMuX3N0YXRlLmVudGVyKCk7XG4gIH1cblxuICBnZXQgc3RhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqICBTaG9ydGN1dCB0byBhY2Nlc3MgdGhlIFRyYWNrIGNvbGxlY3Rpb25cbiAgICogIEByZXR1cm4ge1RyYWNrQ29sbGVjdGlvbn1cbiAgICovXG4gIGdldCB0cmFja3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYWNrcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG9ydGN1dCB0byBhY2Nlc3MgdGhlIExheWVyIGxpc3RcbiAgICogQHJldHVybiB7QXJyYXl9XG4gICAqL1xuICBnZXQgbGF5ZXJzKCkge1xuICAgIHJldHVybiB0aGlzLl90cmFja3MubGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSB0cmFjayB0byB0aGUgdGltZWxpbmVcbiAgICogVHJhY2tzIGRpc3BsYXkgYSB2aWV3IHdpbmRvdyBvbiB0aGUgdGltZWxpbmUgaW4gdGhlaXJzIG93biBTVkcgZWxlbWVudC5cbiAgICogQHBhcmFtIHtUcmFja30gdHJhY2tcbiAgICovXG4gIGFkZCh0cmFjaykge1xuICAgIGlmICh0aGlzLnRyYWNrcy5pbmRleE9mKHRyYWNrKSAhPT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndHJhY2sgYWxyZWFkeSBhZGRlZCB0byB0aGUgdGltZWxpbmUnKTtcbiAgICB9XG5cbiAgICB0cmFjay5jb25maWd1cmUodGhpcy50aW1lQ29udGV4dCk7XG5cbiAgICB0aGlzLnRyYWNrcy5wdXNoKHRyYWNrKTtcbiAgICB0aGlzLmNyZWF0ZUludGVyYWN0aW9uKHRoaXMuX3N1cmZhY2VDdG9yLCB0cmFjay4kZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqICBSZW1vdmVzIGEgdHJhY2sgZnJvbSB0aGUgdGltZWxpbmVcbiAgICogIEBUT0RPXG4gICAqL1xuICByZW1vdmUodHJhY2spIHtcbiAgICAvLyBzaG91bGQgZGVzdHJveSBpbnRlcmFjdGlvbiB0b28sIGF2b2lkIGdob3N0IGV2ZW50TGlzdGVuZXJzXG4gIH1cblxuICAvKipcbiAgICogIENyZWF0ZXMgYSBuZXcgdHJhY2sgZnJvbSB0aGUgY29uZmlndXJhdGlvbiBkZWZpbmUgaW4gYGNvbmZpZ3VyZVRyYWNrc2BcbiAgICogIEBwYXJhbSB7RE9NRWxlbWVudH0gJGVsIC0gdGhlIGVsZW1lbnQgdG8gaW5zZXJ0IHRoZSB0cmFjayBpbnNpZGVcbiAgICogIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gb3ZlcnJpZGUgdGhlIGRlZmF1bHRzIG9wdGlvbnMgaWYgbmVjZXNzYXJ5XG4gICAqICBAcGFyYW0ge1N0cmluZ30gW3RyYWNrSWQ9bnVsbF0gLSBvcHRpb25uYWwgaWQgdG8gZ2l2ZSB0byB0aGUgdHJhY2ssIG9ubHkgZXhpc3RzIGluIHRpbWVsaW5lJ3MgY29udGV4dFxuICAgKiAgQHJldHVybiB7VHJhY2t9XG4gICAqL1xuICBjcmVhdGVUcmFjaygkZWwsIHRyYWNrSGVpZ2h0ID0gMTAwLCB0cmFja0lkID0gbnVsbCkge1xuICAgIGNvbnN0IHRyYWNrID0gbmV3IFRyYWNrKCRlbCwgdHJhY2tIZWlnaHQpO1xuXG4gICAgaWYgKHRyYWNrSWQgIT09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLl90cmFja0J5SWRbdHJhY2tJZF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHRyYWNrSWQ6IFwiJHt0cmFja0lkfVwiIGlzIGFscmVhZHkgdXNlZGApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl90cmFja0J5SWRbdHJhY2tJZF0gPSB0cmFjaztcbiAgICB9XG5cbiAgICAvLyBBZGQgdHJhY2sgdG8gdGhlIHRpbWVsaW5lXG4gICAgdGhpcy5hZGQodHJhY2spO1xuICAgIHRyYWNrLnJlbmRlcigpO1xuICAgIHRyYWNrLnVwZGF0ZSgpO1xuXG4gICAgcmV0dXJuIHRyYWNrO1xuICB9XG5cbiAgLyoqXG4gICAqICBBZGRzIGEgbGF5ZXIgdG8gYSB0cmFjaywgYWxsb3cgdG8gZ3JvdXAgdHJhY2sgYXJiaXRyYXJpbHkgaW5zaWRlIGdyb3Vwcy4gQmFzaWNhbGx5IGEgd3JhcHBlciBmb3IgYHRyYWNrLmFkZChsYXllcilgXG4gICAqICBAcGFyYW0ge0xheWVyfSBsYXllciAtIHRoZSBsYXllciB0byBhZGRcbiAgICogIEBwYXJhbSB7VHJhY2t9IHRyYWNrIC0gdGhlIHRyYWNrIHRvIHRoZSBpbnNlcnQgdGhlIGxheWVyIGluXG4gICAqICBAcGFyYW0ge1N0cmluZ30gW2dyb3VwSWQ9J2RlZmF1bHQnXSAtIHRoZSBncm91cCBpbiB3aGljaCBhc3NvY2lhdGUgdGhlIGxheWVyXG4gICAqL1xuICBhZGRMYXllcihsYXllciwgdHJhY2tPclRyYWNrSWQsIGdyb3VwSWQgPSAnZGVmYXVsdCcpIHtcbiAgICBsZXQgdHJhY2sgPSB0cmFja09yVHJhY2tJZDtcblxuICAgIGlmICh0eXBlb2YgdHJhY2tPclRyYWNrSWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cmFjayA9IHRoaXMuZ2V0VHJhY2tCeUlkKHRyYWNrT3JUcmFja0lkKTtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGVzIHRoZSBgTGF5ZXJUaW1lQ29udGV4dGAgaWYgbm90IHByZXNlbnRcbiAgICBpZiAoIWxheWVyLnRpbWVDb250ZXh0KSB7XG4gICAgICBjb25zdCB0aW1lQ29udGV4dCA9IG5ldyBMYXllclRpbWVDb250ZXh0KHRoaXMudGltZUNvbnRleHQpO1xuICAgICAgbGF5ZXIuc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpO1xuICAgIH1cblxuICAgIC8vIHdlIHNob3VsZCBoYXZlIGEgVHJhY2sgaW5zdGFuY2UgYXQgdGhpcyBwb2ludFxuICAgIHRyYWNrLmFkZChsYXllcik7XG5cbiAgICBpZiAoIXRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF0pIHtcbiAgICAgIHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF0gPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdLnB1c2gobGF5ZXIpO1xuXG4gICAgbGF5ZXIucmVuZGVyKCk7XG4gICAgbGF5ZXIudXBkYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogIFJlbW92ZXMgYSBsYXllciBmcm9tIGl0cyB0cmFjayAodGhlIGxheWVyIGlzIGRldGF0Y2hlZCBmcm9tIHRoZSBET00gYnV0IGNhbiBzdGlsbCBiZSByZXVzZWQpXG4gICAqICBAcGFyYW0ge0xheWVyfSBsYXllciAtIHRoZSBsYXllciB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZUxheWVyKGxheWVyKSB7XG4gICAgdGhpcy50cmFja3MuZm9yRWFjaChmdW5jdGlvbih0cmFjaykge1xuICAgICAgY29uc3QgaW5kZXggPSB0cmFjay5sYXllcnMuaW5kZXhPZihsYXllcik7XG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7IHRyYWNrLnJlbW92ZShsYXllcik7IH1cbiAgICB9KTtcblxuICAgIC8vIGNsZWFuIHJlZmVyZW5jZXMgaW4gaGVscGVyc1xuICAgIGZvciAobGV0IGdyb3VwSWQgaW4gdGhpcy5fZ3JvdXBlZExheWVycykge1xuICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdO1xuICAgICAgY29uc3QgaW5kZXggPSBncm91cC5pbmRleE9mKGxheWVyKTtcblxuICAgICAgaWYgKGluZGV4ICE9PSAtMSkgeyBncm91cC5zcGxpY2UobGF5ZXIsIDEpOyB9XG5cbiAgICAgIGlmICghZ3JvdXAubGVuZ3RoKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgUmV0dXJucyBhIHRyYWNrIGZyb20gaXQncyBpZFxuICAgKiAgQHBhcmFtIHtTdHJpbmd9IHRyYWNrSWRcbiAgICogIEByZXR1cm4ge1RyYWNrfVxuICAgKi9cbiAgZ2V0VHJhY2tCeUlkKHRyYWNrSWQpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhY2tCeUlkW3RyYWNrSWRdO1xuICB9XG5cbiAgLyoqXG4gICAqICBSZXR1cm5zIHRoZSB0cmFjayBjb250YWluaW5nIGEgZ2l2ZW4gRE9NIEVsZW1lbnQsIGlmIG5vIG1hdGNoIGZvdW5kIHJldHVybiBudWxsXG4gICAqICBAcGFyYW0ge0RPTUVsZW1lbnR9ICRlbFxuICAgKiAgQHJldHVybiB7VHJhY2t8bnVsbH1cbiAgICovXG4gIGdldFRyYWNrRnJvbURPTUVsZW1lbnQoJGVsKSB7XG4gICAgbGV0ICRzdmcgPSBudWxsO1xuICAgIGxldCB0cmFjayA9IG51bGw7XG4gICAgLy8gZmluZCB0aGUgY2xvc2VzdCBgLnRyYWNrYCBlbGVtZW50XG4gICAgZG8ge1xuICAgICAgaWYgKCRlbC5jbGFzc0xpc3QuY29udGFpbnMoJ3RyYWNrJykpIHtcbiAgICAgICAgJHN2ZyA9ICRlbDtcbiAgICAgIH1cbiAgICAgICRlbCA9ICRlbC5wYXJlbnROb2RlO1xuICAgIH0gd2hpbGUgKCRzdmcgPT09IG51bGwpO1xuICAgIC8vIGZpbmQgdGhlIHJlbGF0ZWQgYFRyYWNrYFxuICAgIHRoaXMudHJhY2tzLmZvckVhY2goZnVuY3Rpb24oX3RyYWNrKSB7XG4gICAgICBpZiAoX3RyYWNrLiRzdmcgPT09ICRzdmcpIHsgdHJhY2sgPSBfdHJhY2s7IH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0cmFjaztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGxheWVycyBmcm9tIHRoZWlyIGdyb3VwIElkXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBncm91cElkXG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKi9cbiAgZ2V0TGF5ZXJzQnlHcm91cChncm91cElkKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF07XG4gIH1cblxuICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgeWllbGQqIHRoaXMudHJhY2tzW1N5bWJvbC5pdGVyYXRvcl0oKTtcbiAgfVxufVxuIl19