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
 * The `timeline` is the main entry point of a temporal visualization.
 *
 * it:
 * - contains factories to manage its `tracks` and `layers`,
 * - get or set the view window overs its `tracks` through `offset`, `zoom`, `pixelsPerSecond`, `visibleWidth`,
 * - is the central hub for all user interaction events (keyboard, mouse),
 * - holds the current interaction `state` which defines how the different timeline elements (tracks, layers, shapes) respond to user interactions.
 *
 * ```js
 * const visibleWidth = 500;  // default width for all created `Track`
 * const duration = 10;       // the timeline should dislay 10 seconds of data
 * const pixelsPerSeconds = width / duration;
 * const timeline = new ui.core.Timeline(pixelsPerSecond, width);
 * ```
 */

var Timeline = (function (_events$EventEmitter) {
  _inherits(Timeline, _events$EventEmitter);

  /**
   * Creates a new `Timeline` instance
   * @param {Number} [pixelsPerSecond=100] - the number of pixels per seconds the timeline should display
   * @param {Number} [visibleWidth=1000] - the default visible width for all the tracks
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

    /**
     * @this Timeline
     * @attribute {TimelineTimeContext} - master time context of the graph
     */
    this.timeContext = new _timelineTimeContext2['default'](pixelsPerSecond, visibleWidth);
  }

  /**
   * updates `TimeContext`'s offset
   * @attribute {Number} [offset=0]
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
     * returns an array of the layers which positions
     * and sizes matches a pointer Event
     * @param {WavesEvent} e - the event from the Surface
     * @return {Array} - matched layers
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
     * The callback that is used to listen to interactions modules
     * @params {Event} e - a custom event generated by interaction modules
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
     * Changes the state of the timeline
     * @param {BaseState} - the state in which the timeline must be setted
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
     * Adds a layer to a track, allow to group track arbitrarily inside groups. Basically a wrapper for `track.add(layer)`
     * @param {Layer} layer - the layer to add
     * @param {Track} track - the track to the insert the layer in
     * @param {String} [groupId='default'] - the group in which associate the layer
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
     *  @return {Track}
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
      if (this._state) {
        this._state.enter();
      }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jb3JlL3RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQW1CLFFBQVE7Ozs7b0NBRU4sMEJBQTBCOzs7O2dDQUNsQixzQkFBc0I7Ozs7bUNBQy9CLHlCQUF5Qjs7OzttQ0FDYix5QkFBeUI7Ozs7c0JBQ3ZDLFNBQVM7Ozs7K0JBQ0Msb0JBQW9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFtQjNCLFFBQVE7WUFBUixRQUFROzs7Ozs7OztBQU1oQixXQU5RLFFBQVEsR0FRbkI7UUFGSSxlQUFlLHlEQUFHLEdBQUc7UUFBRSxZQUFZLHlEQUFHLElBQUk7O3FFQUVsRCxFQUFFOztxQ0FESixnQkFBZ0I7UUFBaEIsZ0JBQWdCLHlDQUFHLElBQUk7OzBCQVBOLFFBQVE7O0FBVXpCLCtCQVZpQixRQUFRLDZDQVVqQjs7QUFFUixRQUFJLENBQUMsT0FBTyxHQUFHLGlDQUFvQixJQUFJLENBQUMsQ0FBQztBQUN6QyxRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQzs7O0FBR25CLFFBQUksQ0FBQyxZQUFZLG1DQUFVLENBQUM7O0FBRTVCLFFBQUksZ0JBQWdCLEVBQUU7QUFDcEIsVUFBSSxDQUFDLGlCQUFpQixvQ0FBVyxRQUFRLENBQUMsQ0FBQztLQUM1Qzs7O0FBR0QsUUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDckIsUUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7Ozs7OztBQU16QixRQUFJLENBQUMsV0FBVyxHQUFHLHFDQUF3QixlQUFlLEVBQUUsWUFBWSxDQUFDLENBQUM7R0FDM0U7Ozs7Ozs7ZUEvQmtCLFFBQVE7Ozs7Ozs7V0FrR1gsMEJBQUMsSUFBSSxFQUFFO0FBQ3JCLFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0tBQzFCOzs7Ozs7Ozs7Ozs7V0FVZ0IsMkJBQUMsSUFBSSxFQUFFLEVBQUUsRUFBZ0I7OztVQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDdEMs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QkFBdUIsQ0FBQztLQUNqRDs7Ozs7U0FHZ0IsZUFBRztBQUNsQixhQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7S0FDNUI7OztTQW1FUSxhQUFDLEtBQUssRUFBRTtBQUNmLFVBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUFFLFlBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7T0FBRTtBQUN4QyxVQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztBQUNwQixVQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFBRSxZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO09BQUU7S0FDMUM7U0FFUSxlQUFHO0FBQ1YsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0tBQ3BCOzs7Ozs7OztTQU1TLGVBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7S0FDckI7Ozs7Ozs7O1NBTVMsZUFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7S0FDNUI7OztTQXZMa0IsUUFBUTtHQUFTLG9CQUFPLFlBQVk7O3FCQUFwQyxRQUFRIiwiZmlsZSI6InNyYy9jb3JlL3RpbWVsaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV2ZW50cyBmcm9tICdldmVudHMnO1xuXG5pbXBvcnQgS2V5Ym9hcmQgZnJvbSAnLi4vaW50ZXJhY3Rpb25zL2tleWJvYXJkJztcbmltcG9ydCBMYXllclRpbWVDb250ZXh0IGZyb20gJy4vbGF5ZXItdGltZS1jb250ZXh0JztcbmltcG9ydCBTdXJmYWNlIGZyb20gJy4uL2ludGVyYWN0aW9ucy9zdXJmYWNlJztcbmltcG9ydCBUaW1lbGluZVRpbWVDb250ZXh0IGZyb20gJy4vdGltZWxpbmUtdGltZS1jb250ZXh0JztcbmltcG9ydCBUcmFjayBmcm9tICcuL3RyYWNrJztcbmltcG9ydCBUcmFja0NvbGxlY3Rpb24gZnJvbSAnLi90cmFjay1jb2xsZWN0aW9uJztcblxuXG4vKipcbiAqIFRoZSBgdGltZWxpbmVgIGlzIHRoZSBtYWluIGVudHJ5IHBvaW50IG9mIGEgdGVtcG9yYWwgdmlzdWFsaXphdGlvbi5cbiAqXG4gKiBpdDpcbiAqIC0gY29udGFpbnMgZmFjdG9yaWVzIHRvIG1hbmFnZSBpdHMgYHRyYWNrc2AgYW5kIGBsYXllcnNgLFxuICogLSBnZXQgb3Igc2V0IHRoZSB2aWV3IHdpbmRvdyBvdmVycyBpdHMgYHRyYWNrc2AgdGhyb3VnaCBgb2Zmc2V0YCwgYHpvb21gLCBgcGl4ZWxzUGVyU2Vjb25kYCwgYHZpc2libGVXaWR0aGAsXG4gKiAtIGlzIHRoZSBjZW50cmFsIGh1YiBmb3IgYWxsIHVzZXIgaW50ZXJhY3Rpb24gZXZlbnRzIChrZXlib2FyZCwgbW91c2UpLFxuICogLSBob2xkcyB0aGUgY3VycmVudCBpbnRlcmFjdGlvbiBgc3RhdGVgIHdoaWNoIGRlZmluZXMgaG93IHRoZSBkaWZmZXJlbnQgdGltZWxpbmUgZWxlbWVudHMgKHRyYWNrcywgbGF5ZXJzLCBzaGFwZXMpIHJlc3BvbmQgdG8gdXNlciBpbnRlcmFjdGlvbnMuXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHZpc2libGVXaWR0aCA9IDUwMDsgIC8vIGRlZmF1bHQgd2lkdGggZm9yIGFsbCBjcmVhdGVkIGBUcmFja2BcbiAqIGNvbnN0IGR1cmF0aW9uID0gMTA7ICAgICAgIC8vIHRoZSB0aW1lbGluZSBzaG91bGQgZGlzbGF5IDEwIHNlY29uZHMgb2YgZGF0YVxuICogY29uc3QgcGl4ZWxzUGVyU2Vjb25kcyA9IHdpZHRoIC8gZHVyYXRpb247XG4gKiBjb25zdCB0aW1lbGluZSA9IG5ldyB1aS5jb3JlLlRpbWVsaW5lKHBpeGVsc1BlclNlY29uZCwgd2lkdGgpO1xuICogYGBgXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGBUaW1lbGluZWAgaW5zdGFuY2VcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtwaXhlbHNQZXJTZWNvbmQ9MTAwXSAtIHRoZSBudW1iZXIgb2YgcGl4ZWxzIHBlciBzZWNvbmRzIHRoZSB0aW1lbGluZSBzaG91bGQgZGlzcGxheVxuICAgKiBAcGFyYW0ge051bWJlcn0gW3Zpc2libGVXaWR0aD0xMDAwXSAtIHRoZSBkZWZhdWx0IHZpc2libGUgd2lkdGggZm9yIGFsbCB0aGUgdHJhY2tzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwaXhlbHNQZXJTZWNvbmQgPSAxMDAsIHZpc2libGVXaWR0aCA9IDEwMDAsIHtcbiAgICByZWdpc3RlcktleWJvYXJkID0gdHJ1ZVxuICB9ID0ge30pIHtcblxuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLl90cmFja3MgPSBuZXcgVHJhY2tDb2xsZWN0aW9uKHRoaXMpO1xuICAgIHRoaXMuX3N0YXRlID0gbnVsbDtcblxuICAgIC8vIGRlZmF1bHQgaW50ZXJhY3Rpb25zXG4gICAgdGhpcy5fc3VyZmFjZUN0b3IgPSBTdXJmYWNlO1xuXG4gICAgaWYgKHJlZ2lzdGVyS2V5Ym9hcmQpIHtcbiAgICAgIHRoaXMuY3JlYXRlSW50ZXJhY3Rpb24oS2V5Ym9hcmQsIGRvY3VtZW50KTtcbiAgICB9XG5cbiAgICAvLyBzdG9yZXNcbiAgICB0aGlzLl90cmFja0J5SWQgPSB7fTtcbiAgICB0aGlzLl9ncm91cGVkTGF5ZXJzID0ge307XG5cbiAgICAvKipcbiAgICAgKiBAdGhpcyBUaW1lbGluZVxuICAgICAqIEBhdHRyaWJ1dGUge1RpbWVsaW5lVGltZUNvbnRleHR9IC0gbWFzdGVyIHRpbWUgY29udGV4dCBvZiB0aGUgZ3JhcGhcbiAgICAgKi9cbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbmV3IFRpbWVsaW5lVGltZUNvbnRleHQocGl4ZWxzUGVyU2Vjb25kLCB2aXNpYmxlV2lkdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHVwZGF0ZXMgYFRpbWVDb250ZXh0YCdzIG9mZnNldFxuICAgKiBAYXR0cmlidXRlIHtOdW1iZXJ9IFtvZmZzZXQ9MF1cbiAgICovXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQub2Zmc2V0O1xuICB9XG5cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQub2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgem9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC56b29tO1xuICB9XG5cbiAgc2V0IHpvb20odmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0Lnpvb20gPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBwaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQucGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgc2V0IHBpeGVsc1BlclNlY29uZCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQucGl4ZWxzUGVyU2Vjb25kID0gdmFsdWU7XG4gIH1cblxuICBnZXQgdmlzaWJsZVdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnZpc2libGVXaWR0aDtcbiAgfVxuXG4gIHNldCB2aXNpYmxlV2lkdGgodmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnZpc2libGVXaWR0aCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHRpbWVUb1BpeGVsKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsO1xuICB9XG5cbiAgLyoqXG4gICAqICBAcmVhZG9ubHlcbiAgICovXG4gIGdldCB2aXNpYmxlRHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQudmlzaWJsZUR1cmF0aW9uO1xuICB9XG5cbiAgLy8gQE5PVEUgbWF5YmUgZXhwb3NlIGFzIHB1YmxpYyBpbnN0ZWFkIG9mIGdldC9zZXQgZm9yIG5vdGhpbmcuLi5cbiAgc2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKGJvb2wpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0Lm1haW50YWluVmlzaWJsZUR1cmF0aW9uID0gYm9vbDtcbiAgfVxuXG4gIGdldCBtYWludGFpblZpc2libGVEdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5tYWludGFpblZpc2libGVEdXJhdGlvbjtcbiAgfVxuXG4gIC8vIEByZWFkb25seSAtIHVzZWQgaW4gdHJhY2sgY29sbGVjdGlvblxuICBnZXQgZ3JvdXBlZExheWVycygpIHtcbiAgICByZXR1cm4gdGhpcy5fZ3JvdXBlZExheWVycztcbiAgfVxuXG4gIC8qKlxuICAgKiAgT3ZlcnJpZGUgdGhlIGRlZmF1bHQgU3VyZmFjZSB0aGF0IGlzIGluc3RhbmNpYXRlZCBvbiBlYWNoXG4gICAqICBAcGFyYW0ge0V2ZW50U291cmNlfSBjdG9yIC0gdGhlIGNvbnN0cnVjdG9yIHRvIHVzZSB0byBidWlsZCBzdXJmYWNlc1xuICAgKi9cbiAgY29uZmlndXJlU3VyZmFjZShjdG9yKSB7XG4gICAgdGhpcy5fc3VyZmFjZUN0b3IgPSBjdG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIEZhY3RvcnkgbWV0aG9kIHRvIGFkZCBpbnRlcmFjdGlvbiBtb2R1bGVzIHRoZSB0aW1lbGluZSBzaG91bGQgbGlzdGVuIHRvLlxuICAgKiBCeSBkZWZhdWx0LCB0aGUgdGltZWxpbmUgbGlzdGVuIHRvIEtleWJvYXJkLCBhbmQgaW5zdGFuY2lhdGUgYSBgU3VyZmFjZWAgb24gZWFjaCBjb250YWluZXIuXG4gICAqIENhbiBiZSB1c2VkIHRvIGluc3RhbGwgYW55IGludGVyYWN0aW9uIGltcGxlbWVudGluZyB0aGUgYEV2ZW50U291cmNlYCBpbnRlcmZhY2VcbiAgICogQHBhcmFtIHtFdmVudFNvdXJjZX0gY3RvciAtIHRoZSBjb250cnVjdG9yIG9mIHRoZSBpbnRlcmFjdGlvbiBtb2R1bGUgdG8gaW5zdGFuY2lhdGVcbiAgICogQHBhcmFtIGVsIHtET01FbGVtZW50fSB0aGUgRE9NIGVsZW1lbnQgdG8gYmluZCB0byB0aGUgRXZlbnRTb3VyY2UgbW9kdWxlXG4gICAqIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IG9wdGlvbnMgdG8gYmUgYXBwbGllZCB0byB0aGUgY3RvciAoZGVmYXVsdHMgdG8gYHt9YClcbiAgICovXG4gIGNyZWF0ZUludGVyYWN0aW9uKGN0b3IsIGVsLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBpbnRlcmFjdGlvbiA9IG5ldyBjdG9yKGVsLCBvcHRpb25zKTtcbiAgICBpbnRlcmFjdGlvbi5vbignZXZlbnQnLCAoZSkgPT4gdGhpcy5faGFuZGxlRXZlbnQoZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybnMgYW4gYXJyYXkgb2YgdGhlIGxheWVycyB3aGljaCBwb3NpdGlvbnNcbiAgICogYW5kIHNpemVzIG1hdGNoZXMgYSBwb2ludGVyIEV2ZW50XG4gICAqIEBwYXJhbSB7V2F2ZXNFdmVudH0gZSAtIHRoZSBldmVudCBmcm9tIHRoZSBTdXJmYWNlXG4gICAqIEByZXR1cm4ge0FycmF5fSAtIG1hdGNoZWQgbGF5ZXJzXG4gICAqL1xuICBnZXRIaXRMYXllcnMoZSkge1xuICAgIGNvbnN0IGNsaWVudFggPSBlLm9yaWdpbmFsRXZlbnQuY2xpZW50WDtcbiAgICBjb25zdCBjbGllbnRZID0gZS5vcmlnaW5hbEV2ZW50LmNsaWVudFk7XG4gICAgbGV0IGxheWVycyA9IFtdO1xuXG4gICAgdGhpcy5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGlmICghbGF5ZXIucGFyYW1zLmhpdHRhYmxlKSB7IHJldHVybjsgfVxuICAgICAgY29uc3QgYnIgPSBsYXllci4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgY2xpZW50WCA+IGJyLmxlZnQgJiYgY2xpZW50WCA8IGJyLnJpZ2h0ICYmXG4gICAgICAgIGNsaWVudFkgPiBici50b3AgJiYgY2xpZW50WSA8IGJyLmJvdHRvbVxuICAgICAgKSB7XG4gICAgICAgIGxheWVycy5wdXNoKGxheWVyKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBsYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNhbGxiYWNrIHRoYXQgaXMgdXNlZCB0byBsaXN0ZW4gdG8gaW50ZXJhY3Rpb25zIG1vZHVsZXNcbiAgICogQHBhcmFtcyB7RXZlbnR9IGUgLSBhIGN1c3RvbSBldmVudCBnZW5lcmF0ZWQgYnkgaW50ZXJhY3Rpb24gbW9kdWxlc1xuICAgKi9cbiAgX2hhbmRsZUV2ZW50KGUpIHtcbiAgICBjb25zdCBoaXRMYXllcnMgPSAoZS5zb3VyY2UgPT09ICdzdXJmYWNlJykgP1xuICAgICAgdGhpcy5nZXRIaXRMYXllcnMoZSkgOiBudWxsO1xuICAgIC8vIGVtaXQgZXZlbnQgYXMgYSBtaWRkbGV3YXJlXG4gICAgdGhpcy5lbWl0KCdldmVudCcsIGUsIGhpdExheWVycyk7XG4gICAgLy8gcHJvcGFnYXRlIHRvIHRoZSBzdGF0ZVxuICAgIGlmICghdGhpcy5fc3RhdGUpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5fc3RhdGUuaGFuZGxlRXZlbnQoZSwgaGl0TGF5ZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGFuZ2VzIHRoZSBzdGF0ZSBvZiB0aGUgdGltZWxpbmVcbiAgICogQHBhcmFtIHtCYXNlU3RhdGV9IC0gdGhlIHN0YXRlIGluIHdoaWNoIHRoZSB0aW1lbGluZSBtdXN0IGJlIHNldHRlZFxuICAgKi9cbiAgc2V0IHN0YXRlKHN0YXRlKSB7XG4gICAgaWYgKHRoaXMuX3N0YXRlKSB7IHRoaXMuX3N0YXRlLmV4aXQoKTsgfVxuICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgaWYgKHRoaXMuX3N0YXRlKSB7IHRoaXMuX3N0YXRlLmVudGVyKCk7IH1cbiAgfVxuXG4gIGdldCBzdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogIFNob3J0Y3V0IHRvIGFjY2VzcyB0aGUgVHJhY2sgY29sbGVjdGlvblxuICAgKiAgQHJldHVybiB7VHJhY2tDb2xsZWN0aW9ufVxuICAgKi9cbiAgZ2V0IHRyYWNrcygpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhY2tzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3J0Y3V0IHRvIGFjY2VzcyB0aGUgTGF5ZXIgbGlzdFxuICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICovXG4gIGdldCBsYXllcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYWNrcy5sYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHRyYWNrIHRvIHRoZSB0aW1lbGluZVxuICAgKiBUcmFja3MgZGlzcGxheSBhIHZpZXcgd2luZG93IG9uIHRoZSB0aW1lbGluZSBpbiB0aGVpcnMgb3duIFNWRyBlbGVtZW50LlxuICAgKiBAcGFyYW0ge1RyYWNrfSB0cmFja1xuICAgKi9cbiAgYWRkKHRyYWNrKSB7XG4gICAgaWYgKHRoaXMudHJhY2tzLmluZGV4T2YodHJhY2spICE9PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd0cmFjayBhbHJlYWR5IGFkZGVkIHRvIHRoZSB0aW1lbGluZScpO1xuICAgIH1cblxuICAgIHRyYWNrLmNvbmZpZ3VyZSh0aGlzLnRpbWVDb250ZXh0KTtcblxuICAgIHRoaXMudHJhY2tzLnB1c2godHJhY2spO1xuICAgIHRoaXMuY3JlYXRlSW50ZXJhY3Rpb24odGhpcy5fc3VyZmFjZUN0b3IsIHRyYWNrLiRlbCk7XG4gIH1cblxuICAvKipcbiAgICogIFJlbW92ZXMgYSB0cmFjayBmcm9tIHRoZSB0aW1lbGluZVxuICAgKiAgQFRPRE9cbiAgICovXG4gIHJlbW92ZSh0cmFjaykge1xuICAgIC8vIHNob3VsZCBkZXN0cm95IGludGVyYWN0aW9uIHRvbywgYXZvaWQgZ2hvc3QgZXZlbnRMaXN0ZW5lcnNcbiAgfVxuXG4gIC8qKlxuICAgKiAgQ3JlYXRlcyBhIG5ldyB0cmFjayBmcm9tIHRoZSBjb25maWd1cmF0aW9uIGRlZmluZSBpbiBgY29uZmlndXJlVHJhY2tzYFxuICAgKiAgQHBhcmFtIHtET01FbGVtZW50fSAkZWwgLSB0aGUgZWxlbWVudCB0byBpbnNlcnQgdGhlIHRyYWNrIGluc2lkZVxuICAgKiAgQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBvdmVycmlkZSB0aGUgZGVmYXVsdHMgb3B0aW9ucyBpZiBuZWNlc3NhcnlcbiAgICogIEBwYXJhbSB7U3RyaW5nfSBbdHJhY2tJZD1udWxsXSAtIG9wdGlvbm5hbCBpZCB0byBnaXZlIHRvIHRoZSB0cmFjaywgb25seSBleGlzdHMgaW4gdGltZWxpbmUncyBjb250ZXh0XG4gICAqICBAcmV0dXJuIHtUcmFja31cbiAgICovXG4gIGNyZWF0ZVRyYWNrKCRlbCwgdHJhY2tIZWlnaHQgPSAxMDAsIHRyYWNrSWQgPSBudWxsKSB7XG4gICAgY29uc3QgdHJhY2sgPSBuZXcgVHJhY2soJGVsLCB0cmFja0hlaWdodCk7XG5cbiAgICBpZiAodHJhY2tJZCAhPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuX3RyYWNrQnlJZFt0cmFja0lkXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgdHJhY2tJZDogXCIke3RyYWNrSWR9XCIgaXMgYWxyZWFkeSB1c2VkYCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3RyYWNrQnlJZFt0cmFja0lkXSA9IHRyYWNrO1xuICAgIH1cblxuICAgIC8vIEFkZCB0cmFjayB0byB0aGUgdGltZWxpbmVcbiAgICB0aGlzLmFkZCh0cmFjayk7XG4gICAgdHJhY2sucmVuZGVyKCk7XG4gICAgdHJhY2sudXBkYXRlKCk7XG5cbiAgICByZXR1cm4gdHJhY2s7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGxheWVyIHRvIGEgdHJhY2ssIGFsbG93IHRvIGdyb3VwIHRyYWNrIGFyYml0cmFyaWx5IGluc2lkZSBncm91cHMuIEJhc2ljYWxseSBhIHdyYXBwZXIgZm9yIGB0cmFjay5hZGQobGF5ZXIpYFxuICAgKiBAcGFyYW0ge0xheWVyfSBsYXllciAtIHRoZSBsYXllciB0byBhZGRcbiAgICogQHBhcmFtIHtUcmFja30gdHJhY2sgLSB0aGUgdHJhY2sgdG8gdGhlIGluc2VydCB0aGUgbGF5ZXIgaW5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtncm91cElkPSdkZWZhdWx0J10gLSB0aGUgZ3JvdXAgaW4gd2hpY2ggYXNzb2NpYXRlIHRoZSBsYXllclxuICAgKi9cbiAgYWRkTGF5ZXIobGF5ZXIsIHRyYWNrT3JUcmFja0lkLCBncm91cElkID0gJ2RlZmF1bHQnLCBpc0F4aXMgPSBmYWxzZSkge1xuICAgIGxldCB0cmFjayA9IHRyYWNrT3JUcmFja0lkO1xuXG4gICAgaWYgKHR5cGVvZiB0cmFja09yVHJhY2tJZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRyYWNrID0gdGhpcy5nZXRUcmFja0J5SWQodHJhY2tPclRyYWNrSWQpO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZXMgdGhlIGBMYXllclRpbWVDb250ZXh0YCBpZiBub3QgcHJlc2VudFxuICAgIGlmICghbGF5ZXIudGltZUNvbnRleHQpIHtcbiAgICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gaXNBeGlzID9cbiAgICAgICAgdGhpcy50aW1lQ29udGV4dCA6IG5ldyBMYXllclRpbWVDb250ZXh0KHRoaXMudGltZUNvbnRleHQpO1xuXG4gICAgICBsYXllci5zZXRUaW1lQ29udGV4dCh0aW1lQ29udGV4dCk7XG4gICAgfVxuXG4gICAgLy8gd2Ugc2hvdWxkIGhhdmUgYSBUcmFjayBpbnN0YW5jZSBhdCB0aGlzIHBvaW50XG4gICAgdHJhY2suYWRkKGxheWVyKTtcblxuICAgIGlmICghdGhpcy5fZ3JvdXBlZExheWVyc1tncm91cElkXSkge1xuICAgICAgdGhpcy5fZ3JvdXBlZExheWVyc1tncm91cElkXSA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF0ucHVzaChsYXllcik7XG5cbiAgICBsYXllci5yZW5kZXIoKTtcbiAgICBsYXllci51cGRhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgUmVtb3ZlcyBhIGxheWVyIGZyb20gaXRzIHRyYWNrICh0aGUgbGF5ZXIgaXMgZGV0YXRjaGVkIGZyb20gdGhlIERPTSBidXQgY2FuIHN0aWxsIGJlIHJldXNlZClcbiAgICogIEBwYXJhbSB7TGF5ZXJ9IGxheWVyIC0gdGhlIGxheWVyIHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlTGF5ZXIobGF5ZXIpIHtcbiAgICB0aGlzLnRyYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKHRyYWNrKSB7XG4gICAgICBjb25zdCBpbmRleCA9IHRyYWNrLmxheWVycy5pbmRleE9mKGxheWVyKTtcbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHsgdHJhY2sucmVtb3ZlKGxheWVyKTsgfVxuICAgIH0pO1xuXG4gICAgLy8gY2xlYW4gcmVmZXJlbmNlcyBpbiBoZWxwZXJzXG4gICAgZm9yIChsZXQgZ3JvdXBJZCBpbiB0aGlzLl9ncm91cGVkTGF5ZXJzKSB7XG4gICAgICBjb25zdCBncm91cCA9IHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF07XG4gICAgICBjb25zdCBpbmRleCA9IGdyb3VwLmluZGV4T2YobGF5ZXIpO1xuXG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7IGdyb3VwLnNwbGljZShsYXllciwgMSk7IH1cblxuICAgICAgaWYgKCFncm91cC5sZW5ndGgpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBSZXR1cm5zIGEgdHJhY2sgZnJvbSBpdCdzIGlkXG4gICAqICBAcGFyYW0ge1N0cmluZ30gdHJhY2tJZFxuICAgKiAgQHJldHVybiB7VHJhY2t9XG4gICAqL1xuICBnZXRUcmFja0J5SWQodHJhY2tJZCkge1xuICAgIHJldHVybiB0aGlzLl90cmFja0J5SWRbdHJhY2tJZF07XG4gIH1cblxuICAvKipcbiAgICogIFJldHVybnMgdGhlIHRyYWNrIGNvbnRhaW5pbmcgYSBnaXZlbiBET00gRWxlbWVudCwgaWYgbm8gbWF0Y2ggZm91bmQgcmV0dXJuIG51bGxcbiAgICogIEBwYXJhbSB7RE9NRWxlbWVudH0gJGVsXG4gICAqICBAcmV0dXJuIHtUcmFja31cbiAgICovXG4gIGdldFRyYWNrRnJvbURPTUVsZW1lbnQoJGVsKSB7XG4gICAgbGV0ICRzdmcgPSBudWxsO1xuICAgIGxldCB0cmFjayA9IG51bGw7XG4gICAgLy8gZmluZCB0aGUgY2xvc2VzdCBgLnRyYWNrYCBlbGVtZW50XG4gICAgZG8ge1xuICAgICAgaWYgKCRlbC5jbGFzc0xpc3QuY29udGFpbnMoJ3RyYWNrJykpIHtcbiAgICAgICAgJHN2ZyA9ICRlbDtcbiAgICAgIH1cbiAgICAgICRlbCA9ICRlbC5wYXJlbnROb2RlO1xuICAgIH0gd2hpbGUgKCRzdmcgPT09IG51bGwpO1xuICAgIC8vIGZpbmQgdGhlIHJlbGF0ZWQgYFRyYWNrYFxuICAgIHRoaXMudHJhY2tzLmZvckVhY2goZnVuY3Rpb24oX3RyYWNrKSB7XG4gICAgICBpZiAoX3RyYWNrLiRzdmcgPT09ICRzdmcpIHsgdHJhY2sgPSBfdHJhY2s7IH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0cmFjaztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGxheWVycyBmcm9tIHRoZWlyIGdyb3VwIElkXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBncm91cElkXG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKi9cbiAgZ2V0TGF5ZXJzQnlHcm91cChncm91cElkKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF07XG4gIH1cblxuICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgeWllbGQqIHRoaXMudHJhY2tzW1N5bWJvbC5pdGVyYXRvcl0oKTtcbiAgfVxufVxuIl19