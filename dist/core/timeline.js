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
 *
 * @example
 * ```
 * const with = 500; // default with for all created `Track`
 * const duration = 10; // the timeline should dislay 10 second of data
 * const pixelsPerSeconds = width / duration;
 * const timeline = new ui.core.Timeline(pixelsPerSecond, width);
 * ```
 */

var _trackCollection2 = _interopRequireDefault(_trackCollection);

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

    this.timeContext = new _timelineTimeContext2['default'](pixelsPerSecond, visibleWidth);
  }

  /**
   * TimeContext accessors
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQW1CLFFBQVE7Ozs7b0NBRU4sMEJBQTBCOzs7O2dDQUNsQixzQkFBc0I7Ozs7bUNBQy9CLHlCQUF5Qjs7OzttQ0FDYix5QkFBeUI7Ozs7c0JBQ3ZDLFNBQVM7Ozs7K0JBQ0Msb0JBQW9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtCM0IsUUFBUTtZQUFSLFFBQVE7Ozs7Ozs7O0FBTWhCLFdBTlEsUUFBUSxHQVFuQjtRQUZJLGVBQWUseURBQUcsR0FBRztRQUFFLFlBQVkseURBQUcsSUFBSTs7cUVBRWxELEVBQUU7O3FDQURKLGdCQUFnQjtRQUFoQixnQkFBZ0IseUNBQUcsSUFBSTs7MEJBUE4sUUFBUTs7QUFVekIsK0JBVmlCLFFBQVEsNkNBVWpCOztBQUVSLFFBQUksQ0FBQyxPQUFPLEdBQUcsaUNBQW9CLElBQUksQ0FBQyxDQUFDO0FBQ3pDLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDOzs7QUFHbkIsUUFBSSxDQUFDLFlBQVksbUNBQVUsQ0FBQzs7QUFFNUIsUUFBSSxnQkFBZ0IsRUFBRTtBQUNwQixVQUFJLENBQUMsaUJBQWlCLG9DQUFXLFFBQVEsQ0FBQyxDQUFDO0tBQzVDOzs7QUFHRCxRQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUNyQixRQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQzs7QUFFekIsUUFBSSxDQUFDLFdBQVcsR0FBRyxxQ0FBd0IsZUFBZSxFQUFFLFlBQVksQ0FBQyxDQUFDO0dBQzNFOzs7Ozs7ZUEzQmtCLFFBQVE7Ozs7Ozs7V0E2RlgsMEJBQUMsSUFBSSxFQUFFO0FBQ3JCLFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0tBQzFCOzs7Ozs7Ozs7Ozs7V0FVZ0IsMkJBQUMsSUFBSSxFQUFFLEVBQUUsRUFBZ0I7OztVQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDdEMsVUFBTSxX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QUFDLFdBQVcsQ0FBQyxXQUFXLENBQUM7S0FDckM7Ozs7Ozs7U0FLa0IsZUFBRztBQUNwQixhQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDO0tBQ3pDOzs7OztTQUcwQixhQUFDLElBQUksRUFBRTtBQUNoQyxVQUFJLENBQUMsV0FBVyxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQztLQUNqRDtTQUUwQixlQUFHO0FBQzVCLGFBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyx1QkFBdUIsQ0FBQztLQUNqRDs7Ozs7U0FHZ0IsZUFBRztBQUNsQixhQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7S0FDNUI7OztTQXdDUSxhQUFDLEtBQUssRUFBRTtBQUNmLFVBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUFFLFlBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7T0FBRTtBQUN4QyxVQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztBQUNwQixVQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFBRSxZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO09BQUU7S0FDMUM7U0FFUSxlQUFHO0FBQ1YsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0tBQ3BCOzs7Ozs7OztTQU1TLGVBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7S0FDckI7Ozs7Ozs7O1NBTVMsZUFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7S0FDNUI7OztTQXZKa0IsUUFBUTtHQUFTLG9CQUFPLFlBQVk7O3FCQUFwQyxRQUFRIiwiZmlsZSI6ImVzNi9jb3JlL3RpbWVsaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV2ZW50cyBmcm9tICdldmVudHMnO1xuXG5pbXBvcnQgS2V5Ym9hcmQgZnJvbSAnLi4vaW50ZXJhY3Rpb25zL2tleWJvYXJkJztcbmltcG9ydCBMYXllclRpbWVDb250ZXh0IGZyb20gJy4vbGF5ZXItdGltZS1jb250ZXh0JztcbmltcG9ydCBTdXJmYWNlIGZyb20gJy4uL2ludGVyYWN0aW9ucy9zdXJmYWNlJztcbmltcG9ydCBUaW1lbGluZVRpbWVDb250ZXh0IGZyb20gJy4vdGltZWxpbmUtdGltZS1jb250ZXh0JztcbmltcG9ydCBUcmFjayBmcm9tICcuL3RyYWNrJztcbmltcG9ydCBUcmFja0NvbGxlY3Rpb24gZnJvbSAnLi90cmFjay1jb2xsZWN0aW9uJztcblxuXG4vKipcbiAqIFRoZSBgdGltZWxpbmVgIGlzIHRoZSBtYWluIGVudHJ5IHBvaW50IG9mIGEgdGVtcG9yYWwgdmlzdWFsaXphdGlvbiwgaXQ6XG4gKiAtIGNvbnRhaW5zIGZhY3RvcmllcyB0byBtYW5hZ2UgaXRzIGB0cmFja3NgIGFuZCBgbGF5ZXJzYCxcbiAqIC0gZ2V0IG9yIHNldCB0aGUgdmlldyB3aW5kb3cgb3ZlcnMgaXRzIGB0cmFja3NgIHRocm91Z2ggYG9mZnNldGAsIGB6b29tYCwgICogYHBpeGVsc1BlclNlY29uZGAsIGB2aXNpYmxlV2lkdGhgLFxuICogLSBpcyB0aGUgY2VudHJhbCBodWIgZm9yIGFsbCB1c2VyIGludGVyYWN0aW9uIGV2ZW50cyAoa2V5Ym9hcmQsIG1vdXNlKSxcbiAqIC0gaG9sZHMgdGhlIGN1cnJlbnQgaW50ZXJhY3Rpb24gYHN0YXRlYCB3aGljaCBkZWZpbmVzIGhvdyB0aGUgZGlmZmVyZW50IHRpbWVsaW5lIGVsZW1lbnRzICh0cmFja3MsIGxheWVycywgc2hhcGVzKSByZXNwb25kIHRvIHVzZXIgaW50ZXJhY3Rpb25zLlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBcbiAqIGNvbnN0IHdpdGggPSA1MDA7IC8vIGRlZmF1bHQgd2l0aCBmb3IgYWxsIGNyZWF0ZWQgYFRyYWNrYFxuICogY29uc3QgZHVyYXRpb24gPSAxMDsgLy8gdGhlIHRpbWVsaW5lIHNob3VsZCBkaXNsYXkgMTAgc2Vjb25kIG9mIGRhdGFcbiAqIGNvbnN0IHBpeGVsc1BlclNlY29uZHMgPSB3aWR0aCAvIGR1cmF0aW9uO1xuICogY29uc3QgdGltZWxpbmUgPSBuZXcgdWkuY29yZS5UaW1lbGluZShwaXhlbHNQZXJTZWNvbmQsIHdpZHRoKTtcbiAqIGBgYFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lbGluZSBleHRlbmRzIGV2ZW50cy5FdmVudEVtaXR0ZXIge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgVGltZWxpbmVgIGluc3RhbmNlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbcGl4ZWxzUGVyU2Vjb25kPTEwMF0gLSB0aGUgbnVtYmVyIG9mIHBpeGVscyBwZXIgc2Vjb25kcyB0aGUgdGltZWxpbmUgc2hvdWxkIGRpc3BsYXlcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFt2aXNpYmxlV2lkdGg9MTAwMF0gLSB0aGUgZGVmYXVsdCB2aXNpYmxlIHdpZHRoIGZvciBhbGwgdGhlIHRyYWNrc1xuICAgKi9cbiAgY29uc3RydWN0b3IocGl4ZWxzUGVyU2Vjb25kID0gMTAwLCB2aXNpYmxlV2lkdGggPSAxMDAwLCB7XG4gICAgcmVnaXN0ZXJLZXlib2FyZCA9IHRydWVcbiAgfSA9IHt9KSB7XG5cbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5fdHJhY2tzID0gbmV3IFRyYWNrQ29sbGVjdGlvbih0aGlzKTtcbiAgICB0aGlzLl9zdGF0ZSA9IG51bGw7XG5cbiAgICAvLyBkZWZhdWx0IGludGVyYWN0aW9uc1xuICAgIHRoaXMuX3N1cmZhY2VDdG9yID0gU3VyZmFjZTtcblxuICAgIGlmIChyZWdpc3RlcktleWJvYXJkKSB7XG4gICAgICB0aGlzLmNyZWF0ZUludGVyYWN0aW9uKEtleWJvYXJkLCBkb2N1bWVudCk7XG4gICAgfVxuXG4gICAgLy8gc3RvcmVzXG4gICAgdGhpcy5fdHJhY2tCeUlkID0ge307XG4gICAgdGhpcy5fZ3JvdXBlZExheWVycyA9IHt9O1xuXG4gICAgdGhpcy50aW1lQ29udGV4dCA9IG5ldyBUaW1lbGluZVRpbWVDb250ZXh0KHBpeGVsc1BlclNlY29uZCwgdmlzaWJsZVdpZHRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaW1lQ29udGV4dCBhY2Nlc3NvcnNcbiAgICovXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQub2Zmc2V0O1xuICB9XG5cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQub2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgem9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC56b29tO1xuICB9XG5cbiAgc2V0IHpvb20odmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0Lnpvb20gPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBwaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQucGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgc2V0IHBpeGVsc1BlclNlY29uZCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQucGl4ZWxzUGVyU2Vjb25kID0gdmFsdWU7XG4gIH1cblxuICBnZXQgdmlzaWJsZVdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnZpc2libGVXaWR0aDtcbiAgfVxuXG4gIHNldCB2aXNpYmxlV2lkdGgodmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnZpc2libGVXaWR0aCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHRpbWVUb1BpeGVsKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsO1xuICB9XG5cbiAgLyoqXG4gICAqICBAcmVhZG9ubHlcbiAgICovXG4gIGdldCB2aXNpYmxlRHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQudmlzaWJsZUR1cmF0aW9uO1xuICB9XG5cbiAgLy8gQE5PVEUgbWF5YmUgZXhwb3NlIGFzIHB1YmxpYyBpbnN0ZWFkIG9mIGdldC9zZXQgZm9yIG5vdGhpbmcuLi5cbiAgc2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKGJvb2wpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0Lm1haW50YWluVmlzaWJsZUR1cmF0aW9uID0gYm9vbDtcbiAgfVxuXG4gIGdldCBtYWludGFpblZpc2libGVEdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5tYWludGFpblZpc2libGVEdXJhdGlvbjtcbiAgfVxuXG4gIC8vIEByZWFkb25seSAtIHVzZWQgaW4gdHJhY2sgY29sbGVjdGlvblxuICBnZXQgZ3JvdXBlZExheWVycygpIHtcbiAgICByZXR1cm4gdGhpcy5fZ3JvdXBlZExheWVycztcbiAgfVxuXG4gIC8qKlxuICAgKiAgT3ZlcnJpZGUgdGhlIGRlZmF1bHQgU3VyZmFjZSB0aGF0IGlzIGluc3RhbmNpYXRlZCBvbiBlYWNoXG4gICAqICBAcGFyYW0ge0V2ZW50U291cmNlfSBjdG9yIC0gdGhlIGNvbnN0cnVjdG9yIHRvIHVzZSB0byBidWlsZCBzdXJmYWNlc1xuICAgKi9cbiAgY29uZmlndXJlU3VyZmFjZShjdG9yKSB7XG4gICAgdGhpcy5fc3VyZmFjZUN0b3IgPSBjdG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIEZhY3RvcnkgbWV0aG9kIHRvIGFkZCBpbnRlcmFjdGlvbiBtb2R1bGVzIHRoZSB0aW1lbGluZSBzaG91bGQgbGlzdGVuIHRvLlxuICAgKiBCeSBkZWZhdWx0LCB0aGUgdGltZWxpbmUgbGlzdGVuIHRvIEtleWJvYXJkLCBhbmQgaW5zdGFuY2lhdGUgYSBgU3VyZmFjZWAgb24gZWFjaCBjb250YWluZXIuXG4gICAqIENhbiBiZSB1c2VkIHRvIGluc3RhbGwgYW55IGludGVyYWN0aW9uIGltcGxlbWVudGluZyB0aGUgYEV2ZW50U291cmNlYCBpbnRlcmZhY2VcbiAgICogQHBhcmFtIHtFdmVudFNvdXJjZX0gY3RvciAtIHRoZSBjb250cnVjdG9yIG9mIHRoZSBpbnRlcmFjdGlvbiBtb2R1bGUgdG8gaW5zdGFuY2lhdGVcbiAgICogQHBhcmFtIGVsIHtET01FbGVtZW50fSB0aGUgRE9NIGVsZW1lbnQgdG8gYmluZCB0byB0aGUgRXZlbnRTb3VyY2UgbW9kdWxlXG4gICAqIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IG9wdGlvbnMgdG8gYmUgYXBwbGllZCB0byB0aGUgY3RvciAoZGVmYXVsdHMgdG8gYHt9YClcbiAgICovXG4gIGNyZWF0ZUludGVyYWN0aW9uKGN0b3IsIGVsLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBpbnRlcmFjdGlvbiA9IG5ldyBjdG9yKGVsLCBvcHRpb25zKTtcbiAgICBpbnRlcmFjdGlvbi5vbignZXZlbnQnLCAoZSkgPT4gdGhpcy5faGFuZGxlRXZlbnQoZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjYWxsYmFjayB0aGF0IGlzIHVzZWQgdG8gbGlzdGVuIHRvIGludGVyYWN0aW9ucyBtb2R1bGVzXG4gICAqIEBwYXJhbXMge0V2ZW50fSBlIC0gYSBjdXN0b20gZXZlbnQgZ2VuZXJhdGVkIGJ5IGludGVyYWN0aW9uIG1vZHVsZXNcbiAgICovXG4gIF9oYW5kbGVFdmVudChlKSB7XG4gICAgLy8gZW1pdCBldmVudCBhcyBhIG1pZGRsZXdhcmVcbiAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZSk7XG4gICAgLy8gcHJvcGFnYXRlIHRvIHRoZSBzdGF0ZVxuICAgIGlmICghdGhpcy5fc3RhdGUpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5fc3RhdGUuaGFuZGxlRXZlbnQoZSk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBDaGFuZ2VzIHRoZSBzdGF0ZSBvZiB0aGUgdGltZWxpbmVcbiAgICogQHBhcmFtIHtCYXNlU3RhdGV9IHN0YXRlIC0gdGhlIHN0YXRlIGluIHdoaWNoIHRoZSB0aW1lbGluZSBtdXN0IGJlIHNldHRlZFxuICAgKi9cbiAgc2V0IHN0YXRlKHN0YXRlKSB7XG4gICAgaWYgKHRoaXMuX3N0YXRlKSB7IHRoaXMuX3N0YXRlLmV4aXQoKTsgfVxuICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgaWYgKHRoaXMuX3N0YXRlKSB7IHRoaXMuX3N0YXRlLmVudGVyKCk7IH1cbiAgfVxuXG4gIGdldCBzdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogIFNob3J0Y3V0IHRvIGFjY2VzcyB0aGUgVHJhY2sgY29sbGVjdGlvblxuICAgKiAgQHJldHVybiB7VHJhY2tDb2xsZWN0aW9ufVxuICAgKi9cbiAgZ2V0IHRyYWNrcygpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhY2tzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3J0Y3V0IHRvIGFjY2VzcyB0aGUgTGF5ZXIgbGlzdFxuICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICovXG4gIGdldCBsYXllcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYWNrcy5sYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHRyYWNrIHRvIHRoZSB0aW1lbGluZVxuICAgKiBUcmFja3MgZGlzcGxheSBhIHZpZXcgd2luZG93IG9uIHRoZSB0aW1lbGluZSBpbiB0aGVpcnMgb3duIFNWRyBlbGVtZW50LlxuICAgKiBAcGFyYW0ge1RyYWNrfSB0cmFja1xuICAgKi9cbiAgYWRkKHRyYWNrKSB7XG4gICAgaWYgKHRoaXMudHJhY2tzLmluZGV4T2YodHJhY2spICE9PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd0cmFjayBhbHJlYWR5IGFkZGVkIHRvIHRoZSB0aW1lbGluZScpO1xuICAgIH1cblxuICAgIHRyYWNrLmNvbmZpZ3VyZSh0aGlzLnRpbWVDb250ZXh0KTtcblxuICAgIHRoaXMudHJhY2tzLnB1c2godHJhY2spO1xuICAgIHRoaXMuY3JlYXRlSW50ZXJhY3Rpb24odGhpcy5fc3VyZmFjZUN0b3IsIHRyYWNrLiRlbCk7XG4gIH1cblxuICAvKipcbiAgICogIFJlbW92ZXMgYSB0cmFjayBmcm9tIHRoZSB0aW1lbGluZVxuICAgKiAgQFRPRE9cbiAgICovXG4gIHJlbW92ZSh0cmFjaykge1xuICAgIC8vIHNob3VsZCBkZXN0cm95IGludGVyYWN0aW9uIHRvbywgYXZvaWQgZ2hvc3QgZXZlbnRMaXN0ZW5lcnNcbiAgfVxuXG4gIC8qKlxuICAgKiAgQ3JlYXRlcyBhIG5ldyB0cmFjayBmcm9tIHRoZSBjb25maWd1cmF0aW9uIGRlZmluZSBpbiBgY29uZmlndXJlVHJhY2tzYFxuICAgKiAgQHBhcmFtIHtET01FbGVtZW50fSAkZWwgLSB0aGUgZWxlbWVudCB0byBpbnNlcnQgdGhlIHRyYWNrIGluc2lkZVxuICAgKiAgQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBvdmVycmlkZSB0aGUgZGVmYXVsdHMgb3B0aW9ucyBpZiBuZWNlc3NhcnlcbiAgICogIEBwYXJhbSB7U3RyaW5nfSBbdHJhY2tJZD1udWxsXSAtIG9wdGlvbm5hbCBpZCB0byBnaXZlIHRvIHRoZSB0cmFjaywgb25seSBleGlzdHMgaW4gdGltZWxpbmUncyBjb250ZXh0XG4gICAqICBAcmV0dXJuIHtUcmFja31cbiAgICovXG4gIGNyZWF0ZVRyYWNrKCRlbCwgdHJhY2tIZWlnaHQgPSAxMDAsIHRyYWNrSWQgPSBudWxsKSB7XG4gICAgY29uc3QgdHJhY2sgPSBuZXcgVHJhY2soJGVsLCB0cmFja0hlaWdodCk7XG5cbiAgICBpZiAodHJhY2tJZCAhPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuX3RyYWNrQnlJZFt0cmFja0lkXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgdHJhY2tJZDogXCIke3RyYWNrSWR9XCIgaXMgYWxyZWFkeSB1c2VkYCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3RyYWNrQnlJZFt0cmFja0lkXSA9IHRyYWNrO1xuICAgIH1cblxuICAgIC8vIEFkZCB0cmFjayB0byB0aGUgdGltZWxpbmVcbiAgICB0aGlzLmFkZCh0cmFjayk7XG4gICAgdHJhY2sucmVuZGVyKCk7XG4gICAgdHJhY2sudXBkYXRlKCk7XG5cbiAgICByZXR1cm4gdHJhY2s7XG4gIH1cblxuICAvKipcbiAgICogIEFkZHMgYSBsYXllciB0byBhIHRyYWNrLCBhbGxvdyB0byBncm91cCB0cmFjayBhcmJpdHJhcmlseSBpbnNpZGUgZ3JvdXBzLiBCYXNpY2FsbHkgYSB3cmFwcGVyIGZvciBgdHJhY2suYWRkKGxheWVyKWBcbiAgICogIEBwYXJhbSB7TGF5ZXJ9IGxheWVyIC0gdGhlIGxheWVyIHRvIGFkZFxuICAgKiAgQHBhcmFtIHtUcmFja30gdHJhY2sgLSB0aGUgdHJhY2sgdG8gdGhlIGluc2VydCB0aGUgbGF5ZXIgaW5cbiAgICogIEBwYXJhbSB7U3RyaW5nfSBbZ3JvdXBJZD0nZGVmYXVsdCddIC0gdGhlIGdyb3VwIGluIHdoaWNoIGFzc29jaWF0ZSB0aGUgbGF5ZXJcbiAgICovXG4gIGFkZExheWVyKGxheWVyLCB0cmFja09yVHJhY2tJZCwgZ3JvdXBJZCA9ICdkZWZhdWx0JywgaXNBeGlzID0gZmFsc2UpIHtcbiAgICBsZXQgdHJhY2sgPSB0cmFja09yVHJhY2tJZDtcblxuICAgIGlmICh0eXBlb2YgdHJhY2tPclRyYWNrSWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cmFjayA9IHRoaXMuZ2V0VHJhY2tCeUlkKHRyYWNrT3JUcmFja0lkKTtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGVzIHRoZSBgTGF5ZXJUaW1lQ29udGV4dGAgaWYgbm90IHByZXNlbnRcbiAgICBpZiAoIWxheWVyLnRpbWVDb250ZXh0KSB7XG4gICAgICBjb25zdCB0aW1lQ29udGV4dCA9IGlzQXhpcyA/XG4gICAgICAgIHRoaXMudGltZUNvbnRleHQgOiBuZXcgTGF5ZXJUaW1lQ29udGV4dCh0aGlzLnRpbWVDb250ZXh0KTtcblxuICAgICAgbGF5ZXIuc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpO1xuICAgIH1cblxuICAgIC8vIHdlIHNob3VsZCBoYXZlIGEgVHJhY2sgaW5zdGFuY2UgYXQgdGhpcyBwb2ludFxuICAgIHRyYWNrLmFkZChsYXllcik7XG5cbiAgICBpZiAoIXRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF0pIHtcbiAgICAgIHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF0gPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdLnB1c2gobGF5ZXIpO1xuXG4gICAgbGF5ZXIucmVuZGVyKCk7XG4gICAgbGF5ZXIudXBkYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogIFJlbW92ZXMgYSBsYXllciBmcm9tIGl0cyB0cmFjayAodGhlIGxheWVyIGlzIGRldGF0Y2hlZCBmcm9tIHRoZSBET00gYnV0IGNhbiBzdGlsbCBiZSByZXVzZWQpXG4gICAqICBAcGFyYW0ge0xheWVyfSBsYXllciAtIHRoZSBsYXllciB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZUxheWVyKGxheWVyKSB7XG4gICAgdGhpcy50cmFja3MuZm9yRWFjaChmdW5jdGlvbih0cmFjaykge1xuICAgICAgY29uc3QgaW5kZXggPSB0cmFjay5sYXllcnMuaW5kZXhPZihsYXllcik7XG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7IHRyYWNrLnJlbW92ZShsYXllcik7IH1cbiAgICB9KTtcblxuICAgIC8vIGNsZWFuIHJlZmVyZW5jZXMgaW4gaGVscGVyc1xuICAgIGZvciAobGV0IGdyb3VwSWQgaW4gdGhpcy5fZ3JvdXBlZExheWVycykge1xuICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdO1xuICAgICAgY29uc3QgaW5kZXggPSBncm91cC5pbmRleE9mKGxheWVyKTtcblxuICAgICAgaWYgKGluZGV4ICE9PSAtMSkgeyBncm91cC5zcGxpY2UobGF5ZXIsIDEpOyB9XG5cbiAgICAgIGlmICghZ3JvdXAubGVuZ3RoKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAgUmV0dXJucyBhIHRyYWNrIGZyb20gaXQncyBpZFxuICAgKiAgQHBhcmFtIHtTdHJpbmd9IHRyYWNrSWRcbiAgICogIEByZXR1cm4ge1RyYWNrfVxuICAgKi9cbiAgZ2V0VHJhY2tCeUlkKHRyYWNrSWQpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhY2tCeUlkW3RyYWNrSWRdO1xuICB9XG5cbiAgLyoqXG4gICAqICBSZXR1cm5zIHRoZSB0cmFjayBjb250YWluaW5nIGEgZ2l2ZW4gRE9NIEVsZW1lbnQsIGlmIG5vIG1hdGNoIGZvdW5kIHJldHVybiBudWxsXG4gICAqICBAcGFyYW0ge0RPTUVsZW1lbnR9ICRlbFxuICAgKiAgQHJldHVybiB7VHJhY2t9XG4gICAqL1xuICBnZXRUcmFja0Zyb21ET01FbGVtZW50KCRlbCkge1xuICAgIGxldCAkc3ZnID0gbnVsbDtcbiAgICBsZXQgdHJhY2sgPSBudWxsO1xuICAgIC8vIGZpbmQgdGhlIGNsb3Nlc3QgYC50cmFja2AgZWxlbWVudFxuICAgIGRvIHtcbiAgICAgIGlmICgkZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCd0cmFjaycpKSB7XG4gICAgICAgICRzdmcgPSAkZWw7XG4gICAgICB9XG4gICAgICAkZWwgPSAkZWwucGFyZW50Tm9kZTtcbiAgICB9IHdoaWxlICgkc3ZnID09PSBudWxsKTtcbiAgICAvLyBmaW5kIHRoZSByZWxhdGVkIGBUcmFja2BcbiAgICB0aGlzLnRyYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKF90cmFjaykge1xuICAgICAgaWYgKF90cmFjay4kc3ZnID09PSAkc3ZnKSB7IHRyYWNrID0gX3RyYWNrOyB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdHJhY2s7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBsYXllcnMgZnJvbSB0aGVpciBncm91cCBJZFxuICAgKiBAcGFyYW0ge1N0cmluZ30gZ3JvdXBJZFxuICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICovXG4gIGdldExheWVyc0J5R3JvdXAoZ3JvdXBJZCkge1xuICAgIHJldHVybiB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdO1xuICB9XG5cbiAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHlpZWxkKiB0aGlzLnRyYWNrc1tTeW1ib2wuaXRlcmF0b3JdKCk7XG4gIH1cbn1cbiJdfQ==