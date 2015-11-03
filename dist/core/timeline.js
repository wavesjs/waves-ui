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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy93YXZlcy11aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixRQUFROzs7O29DQUVOLDBCQUEwQjs7OztnQ0FDbEIsc0JBQXNCOzs7O21DQUMvQix5QkFBeUI7Ozs7bUNBQ2IseUJBQXlCOzs7O3NCQUN2QyxTQUFTOzs7OytCQUNDLG9CQUFvQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE4QjNCLFFBQVE7WUFBUixRQUFROzs7Ozs7O0FBS2hCLFdBTFEsUUFBUSxHQU9uQjtRQUZJLGVBQWUseURBQUcsR0FBRztRQUFFLFlBQVkseURBQUcsSUFBSTs7cUVBRWxELEVBQUU7O3FDQURKLGdCQUFnQjtRQUFoQixnQkFBZ0IseUNBQUcsSUFBSTs7MEJBTk4sUUFBUTs7QUFTekIsK0JBVGlCLFFBQVEsNkNBU2pCOztBQUVSLFFBQUksQ0FBQyxPQUFPLEdBQUcsaUNBQW9CLElBQUksQ0FBQyxDQUFDO0FBQ3pDLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDOzs7QUFHbkIsUUFBSSxDQUFDLFlBQVksbUNBQVUsQ0FBQzs7QUFFNUIsUUFBSSxnQkFBZ0IsRUFBRTtBQUNwQixVQUFJLENBQUMsaUJBQWlCLG9DQUFXLFFBQVEsQ0FBQyxDQUFDO0tBQzVDOzs7QUFHRCxRQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUNyQixRQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQzs7O0FBR3pCLFFBQUksQ0FBQyxXQUFXLEdBQUcscUNBQXdCLGVBQWUsRUFBRSxZQUFZLENBQUMsQ0FBQztHQUMzRTs7Ozs7Ozs7ZUEzQmtCLFFBQVE7Ozs7Ozs7Ozs7O1dBNkpYLDBCQUFDLElBQUksRUFBRTtBQUNyQixVQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztLQUMxQjs7Ozs7Ozs7Ozs7Ozs7V0FZZ0IsMkJBQUMsSUFBSSxFQUFFLEdBQUcsRUFBZ0I7OztVQUFkLE9BQU8seURBQUcsRUFB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QUMsV0FBVyxDQUFDLFdBQVcsQ0FBQztLQUNyQzs7Ozs7Ozs7O1NBT2tCLGVBQUc7QUFDcEIsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQztLQUN6Qzs7Ozs7Ozs7Ozs7U0FTMEIsYUFBQyxJQUFJLEVBQUU7QUFDaEMsVUFBSSxDQUFDLFdBQVcsQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUM7S0FDakQ7Ozs7Ozs7U0FPMEIsZUFBRztBQUM1QixhQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsdUJBQXVCLENBQUM7S0FDakQ7Ozs7Ozs7Ozs7U0FRZ0IsZUFBRztBQUNsQixhQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7S0FDNUI7OztTQTJFUSxhQUFDLEtBQUssRUFBRTtBQUNmLFVBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUFFLFlBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7T0FBRTtBQUN4QyxVQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztBQUNwQixVQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFBRSxZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO09BQUU7S0FDMUM7Ozs7Ozs7U0FPUSxlQUFHO0FBQ1YsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0tBQ3BCOzs7Ozs7Ozs7U0FPUyxlQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0tBQ3JCOzs7Ozs7Ozs7U0FPUyxlQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztLQUM1Qjs7O1NBN1BrQixRQUFRO0dBQVMsb0JBQU8sWUFBWTs7cUJBQXBDLFFBQVEiLCJmaWxlIjoic3JjL3dhdmVzLXVpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV2ZW50cyBmcm9tICdldmVudHMnO1xuXG5pbXBvcnQgS2V5Ym9hcmQgZnJvbSAnLi4vaW50ZXJhY3Rpb25zL2tleWJvYXJkJztcbmltcG9ydCBMYXllclRpbWVDb250ZXh0IGZyb20gJy4vbGF5ZXItdGltZS1jb250ZXh0JztcbmltcG9ydCBTdXJmYWNlIGZyb20gJy4uL2ludGVyYWN0aW9ucy9zdXJmYWNlJztcbmltcG9ydCBUaW1lbGluZVRpbWVDb250ZXh0IGZyb20gJy4vdGltZWxpbmUtdGltZS1jb250ZXh0JztcbmltcG9ydCBUcmFjayBmcm9tICcuL3RyYWNrJztcbmltcG9ydCBUcmFja0NvbGxlY3Rpb24gZnJvbSAnLi90cmFjay1jb2xsZWN0aW9uJztcblxuXG4vKipcbiAqIElzIHRoZSBtYWluIGVudHJ5IHBvaW50IHRvIGNyZWF0ZSBhIHRlbXBvcmFsIHZpc3VhbGl6YXRpb24uXG4gKlxuICogQSBgdGltZWxpbmVgIGluc3RhbmNlIG1haW5seSBwcm92aWRlcyB0aGUgY29udGV4dCBmb3IgYW55IHZpc3VhbGl6YXRpb24gb2ZcbiAqIHRlbXBvcmFsIGRhdGEgYW5kIG1haW50YWlucyB0aGUgaGllcmFyY2h5IG9mIGBUcmFja2AsIGBMYXllcmAgYW5kIGBTaGFwZWBcbiAqIG92ZXIgdGhlIGVudGllcmUgdmlzdWFsaXNhdGlvbi5cbiAqXG4gKiBJdHMgbWFpbiByZXNwb25zYWJpbGl0ZXMgYXJlOlxuICogLSBtYWludGFpbmluZyB0aGUgdGVtcG9yYWwgY29uc2lzdGVuY3kgYWNjcm9zcyB0aGUgdmlzdWFsaXNhdGlvbiB0aHJvdWdoXG4gKiAgIGl0cyBgdGltZUNvbnRleHRgIHByb3BlcnR5IChpbnN0YW5jZSBvZiBgVGltZWxpbmVUaW1lQ29udGV4dGApLlxuICogLSBoYW5kbGluZyBpbnRlcmFjdGlvbnMgdG8gaXRzIGN1cnJlbnQgc3RhdGUgKGFjdGluZyBoZXJlIGFzIGEgc2ltcGxlXG4gKiAgIHN0YXRlIG1hY2hpbmUpLlxuICpcbiAqIEBUT0RPIGluc2VydCBmaWd1cmVcbiAqXG4gKiBJdCBhbHNvIGNvbnRhaW5zIGEgcmVmZXJlbmNlIHRvIGFsbCB0aGUgcmVnaXN0ZXIgdHJhY2sgYWxsb3dpbmcgdG8gYHJlbmRlcmBcbiAqIG9yIGB1cGRhdGVgIGFsbCB0aGUgbGF5ZXIgZnJvbSBhIHNpbmdsZSBlbnRyeSBwb2ludC5cbiAqXG4gKiAjIyBFeGFtcGxlIFVzYWdlXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHZpc2libGVXaWR0aCA9IDUwMDsgLy8gZGVmYXVsdCB3aWR0aCBpbiBwaXhlbHMgZm9yIGFsbCBjcmVhdGVkIGBUcmFja2BcbiAqIGNvbnN0IGR1cmF0aW9uID0gMTA7IC8vIHRoZSB2aXNpYmxlIGFyZWEgcmVwcmVzZW50cyAxMCBzZWNvbmRzXG4gKiBjb25zdCBwaXhlbHNQZXJTZWNvbmRzID0gdmlzaWJsZVdpZHRoIC8gZHVyYXRpb247XG4gKiBjb25zdCB0aW1lbGluZSA9IG5ldyB1aS5jb3JlLlRpbWVsaW5lKHBpeGVsc1BlclNlY29uZCwgd2lkdGgpO1xuICogYGBgXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3BpeGVsc1BlclNlY29uZD0xMDBdIC0gdGhlIGRlZmF1bHQgc2NhbGluZyBiZXR3ZWVuIHRpbWUgYW5kIHBpeGVscy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFt2aXNpYmxlV2lkdGg9MTAwMF0gLSB0aGUgZGVmYXVsdCB2aXNpYmxlIGFyZWEgZm9yIGFsbCByZWdpc3RlcmVkIHRyYWNrcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHBpeGVsc1BlclNlY29uZCA9IDEwMCwgdmlzaWJsZVdpZHRoID0gMTAwMCwge1xuICAgIHJlZ2lzdGVyS2V5Ym9hcmQgPSB0cnVlXG4gIH0gPSB7fSkge1xuXG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX3RyYWNrcyA9IG5ldyBUcmFja0NvbGxlY3Rpb24odGhpcyk7XG4gICAgdGhpcy5fc3RhdGUgPSBudWxsO1xuXG4gICAgLy8gZGVmYXVsdCBpbnRlcmFjdGlvbnNcbiAgICB0aGlzLl9zdXJmYWNlQ3RvciA9IFN1cmZhY2U7XG5cbiAgICBpZiAocmVnaXN0ZXJLZXlib2FyZCkge1xuICAgICAgdGhpcy5jcmVhdGVJbnRlcmFjdGlvbihLZXlib2FyZCwgZG9jdW1lbnQpO1xuICAgIH1cblxuICAgIC8vIHN0b3Jlc1xuICAgIHRoaXMuX3RyYWNrQnlJZCA9IHt9O1xuICAgIHRoaXMuX2dyb3VwZWRMYXllcnMgPSB7fTtcblxuICAgIC8qKiBAdHlwZSB7VGltZWxpbmVUaW1lQ29udGV4dH0gLSBtYXN0ZXIgdGltZSBjb250ZXh0IGZvciB0aGUgdmlzdWFsaXphdGlvbi4gKi9cbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbmV3IFRpbWVsaW5lVGltZUNvbnRleHQocGl4ZWxzUGVyU2Vjb25kLCB2aXNpYmxlV2lkdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYG9mZnNldGAgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9IFtvZmZzZXQ9MF1cbiAgICovXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQub2Zmc2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYG9mZnNldGAgdGltZSBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9IFtvZmZzZXQ9MF1cbiAgICovXG4gIHNldCBvZmZzZXQodmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0Lm9mZnNldCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGB6b29tYCB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn0gW29mZnNldD0wXVxuICAgKi9cbiAgZ2V0IHpvb20oKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQuem9vbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgem9vbWAgdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9IFtvZmZzZXQ9MF1cbiAgICovXG4gIHNldCB6b29tKHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC56b29tID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYHBpeGVsc1BlclNlY29uZGAgcmF0aW8uXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9IFtvZmZzZXQ9MF1cbiAgICovXG4gIGdldCBwaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQucGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGBwaXhlbHNQZXJTZWNvbmRgIHJhdGlvLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfSBbb2Zmc2V0PTBdXG4gICAqL1xuICBzZXQgcGl4ZWxzUGVyU2Vjb25kKHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC5waXhlbHNQZXJTZWNvbmQgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgdmlzaWJsZVdpZHRoYCBwaXhlbCBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9IFtvZmZzZXQ9MF1cbiAgICovXG4gIGdldCB2aXNpYmxlV2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQudmlzaWJsZVdpZHRoO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGB2aXNpYmxlV2lkdGhgIHBpeGVsIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn0gW29mZnNldD0wXVxuICAgKi9cbiAgc2V0IHZpc2libGVXaWR0aCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQudmlzaWJsZVdpZHRoID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgdGltZVRvUGl4ZWxgIHRyYW5zZmVydCBmdW5jdGlvbi5cbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgZ2V0IHRpbWVUb1BpeGVsKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnRpbWVUb1BpeGVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYHZpc2libGVEdXJhdGlvbmAgaGVscGVyIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHZpc2libGVEdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC52aXNpYmxlRHVyYXRpb247XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYG1haW50YWluVmlzaWJsZUR1cmF0aW9uYCB2YWx1ZS5cbiAgICogRGVmaW5lcyBpZiB0aGUgZHVyYXRpb24gb2YgdGhlIHZpc2libGUgYXJlYSBzaG91bGQgYmUgbWFpbnRhaW4gd2hlblxuICAgKiB0aGUgYHZpc2libGVXaWR0aGAgYXR0cmlidXRlIGlzIHVwZGF0ZWQuXG4gICAqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgc2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKGJvb2wpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0Lm1haW50YWluVmlzaWJsZUR1cmF0aW9uID0gYm9vbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGBtYWludGFpblZpc2libGVEdXJhdGlvbmAgY3VycmVudCB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICBnZXQgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQubWFpbnRhaW5WaXNpYmxlRHVyYXRpb247XG4gIH1cblxuICAvKipcbiAgICogT2JqZWN0IG1haW50YWluaW5nIGFycmF5cyBvZiBgTGF5ZXJgIGluc3RhbmNlcyBvcmRlcmVkIGJ5IHRoZWlyIGBncm91cElkYC5cbiAgICogSXMgdXNlZCBpbnRlcm5hbGx5IGJ5IHRoZSBgVHJhY2tDb2xsZWN0aW9uYCBpbnN0YW5jZS5cbiAgICpcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGdldCBncm91cGVkTGF5ZXJzKCkge1xuICAgIHJldHVybiB0aGlzLl9ncm91cGVkTGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlcyB0aGUgZGVmYXVsdCBgU3VyZmFjZWAgdGhhdCBpcyBpbnN0YW5jaWF0ZWQgb24gZWFjaCBgVHJhY2tgXG4gICAqIGluc3RhbmNlLiBUaGlzIG1ldGhvcyBzaG91bGQgYmUgY2FsbGVkIGJlZm9yZSBhZGRpbmcgYW55IGBUcmFja2AgaW5zdGFuY2VcbiAgICogdG8gdGhlIGN1cnJlbnQgYHRpbWVsaW5lYC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudFNvdXJjZX0gY3RvciAtIFRoZSBjb25zdHJ1Y3RvciB0byB1c2UgaW4gb3JkZXIgdG8gY2F0Y2ggbW91c2VcbiAgICogICAgZXZlbnRzIG9uIGVhY2ggYFRyYWNrYCBpbnN0YW5jZXMuXG4gICAqL1xuICBjb25maWd1cmVTdXJmYWNlKGN0b3IpIHtcbiAgICB0aGlzLl9zdXJmYWNlQ3RvciA9IGN0b3I7XG4gIH1cblxuICAvKipcbiAgICogRmFjdG9yeSBtZXRob2QgdG8gYWRkIGludGVyYWN0aW9uIG1vZHVsZXMgdGhlIHRpbWVsaW5lIHNob3VsZCBsaXN0ZW4gdG8uXG4gICAqIEJ5IGRlZmF1bHQsIHRoZSB0aW1lbGluZSBpbnN0YW5jaWF0ZSBhIGdsb2JhbCBgS2V5Ym9hcmRgIGluc3RhbmNlIGFuZCBhXG4gICAqIGBTdXJmYWNlYCBpbnN0YW5jZSBvbiBlYWNoIGNvbnRhaW5lci5cbiAgICogU2hvdWxkIGJlIHVzZWQgdG8gaW5zdGFsbCBuZXcgaW50ZXJhY3Rpb25zIGltcGxlbWVudGluZyB0aGUgYEV2ZW50U291cmNlYCBpbnRlcmZhY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnRTb3VyY2V9IGN0b3IgLSBUaGUgY29udHJ1Y3RvciBvZiB0aGUgaW50ZXJhY3Rpb24gbW9kdWxlIHRvIGluc3RhbmNpYXRlLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIFRoZSBET00gZWxlbWVudCB3aGljaCB3aWxsIGJlIGJpbmRlZCB0byB0aGUgYEV2ZW50U291cmNlYCBtb2R1bGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gLSBPcHRpb25zIHRvIGJlIGFwcGxpZWQgdG8gdGhlIGBjdG9yYC5cbiAgICovXG4gIGNyZWF0ZUludGVyYWN0aW9uKGN0b3IsICRlbCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgaW50ZXJhY3Rpb24gPSBuZXcgY3RvcigkZWwsIG9wdGlvbnMpO1xuICAgIGludGVyYWN0aW9uLm9uKCdldmVudCcsIChlKSA9PiB0aGlzLl9oYW5kbGVFdmVudChlKSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGxpc3Qgb2YgdGhlIGxheWVycyBzaXR1YXRlZCB1bmRlciB0aGUgcG9zaXRpb24gb2YgYSBgV2F2ZUV2ZW50YC5cbiAgICpcbiAgICogQHBhcmFtIHtXYXZlc0V2ZW50fSBlIC0gQW4gZXZlbnQgdHJpZ2dlcmVkIGJ5IGEgYFdhdmVFdmVudGBcbiAgICogQHJldHVybiB7QXJyYXl9IC0gTWF0Y2hlZCBsYXllcnNcbiAgICovXG4gIGdldEhpdExheWVycyhlKSB7XG4gICAgY29uc3QgY2xpZW50WCA9IGUub3JpZ2luYWxFdmVudC5jbGllbnRYO1xuICAgIGNvbnN0IGNsaWVudFkgPSBlLm9yaWdpbmFsRXZlbnQuY2xpZW50WTtcbiAgICBsZXQgbGF5ZXJzID0gW107XG5cbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgaWYgKCFsYXllci5wYXJhbXMuaGl0dGFibGUpIHsgcmV0dXJuOyB9XG4gICAgICBjb25zdCBiciA9IGxheWVyLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgaWYgKFxuICAgICAgICBjbGllbnRYID4gYnIubGVmdCAmJiBjbGllbnRYIDwgYnIucmlnaHQgJiZcbiAgICAgICAgY2xpZW50WSA+IGJyLnRvcCAmJiBjbGllbnRZIDwgYnIuYm90dG9tXG4gICAgICApIHtcbiAgICAgICAgbGF5ZXJzLnB1c2gobGF5ZXIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGxheWVycztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY2FsbGJhY2sgdGhhdCBpcyB1c2VkIHRvIGxpc3RlbiB0byBpbnRlcmFjdGlvbnMgbW9kdWxlcy5cbiAgICpcbiAgICogQHBhcmFtIHtXYXZlRXZlbnR9IGUgLSBBbiBldmVudCBnZW5lcmF0ZWQgYnkgYW4gaW50ZXJhY3Rpb24gbW9kdWxlcyAoYEV2ZW50U291cmNlYCkuXG4gICAqL1xuICBfaGFuZGxlRXZlbnQoZSkge1xuICAgIGNvbnN0IGhpdExheWVycyA9IChlLnNvdXJjZSA9PT0gJ3N1cmZhY2UnKSA/XG4gICAgICB0aGlzLmdldEhpdExheWVycyhlKSA6IG51bGw7XG4gICAgLy8gZW1pdCBldmVudCBhcyBhIG1pZGRsZXdhcmVcbiAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZSwgaGl0TGF5ZXJzKTtcbiAgICAvLyBwcm9wYWdhdGUgdG8gdGhlIHN0YXRlXG4gICAgaWYgKCF0aGlzLl9zdGF0ZSkgeyByZXR1cm47IH1cbiAgICB0aGlzLl9zdGF0ZS5oYW5kbGVFdmVudChlLCBoaXRMYXllcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHN0YXRlIG9mIHRoZSB0aW1lbGluZS5cbiAgICpcbiAgICogQHR5cGUge0Jhc2VTdGF0ZX1cbiAgICovXG4gIHNldCBzdGF0ZShzdGF0ZSkge1xuICAgIGlmICh0aGlzLl9zdGF0ZSkgeyB0aGlzLl9zdGF0ZS5leGl0KCk7IH1cbiAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuICAgIGlmICh0aGlzLl9zdGF0ZSkgeyB0aGlzLl9zdGF0ZS5lbnRlcigpOyB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgdGltZWxpbmUuXG4gICAqXG4gICAqIEB0eXBlIHtCYXNlU3RhdGV9XG4gICAqL1xuICBnZXQgc3RhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUcmFja0NvbGxlY3Rpb25gIGluc3RhbmNlLlxuICAgKlxuICAgKiBAdHlwZSB7VHJhY2tDb2xsZWN0aW9ufVxuICAgKi9cbiAgZ2V0IHRyYWNrcygpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhY2tzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGxpc3Qgb2YgYWxsIHJlZ2lzdGVyZWQgbGF5ZXJzLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqL1xuICBnZXQgbGF5ZXJzKCkge1xuICAgIHJldHVybiB0aGlzLl90cmFja3MubGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBuZXcgdHJhY2sgdG8gdGhlIHRpbWVsaW5lLlxuICAgKlxuICAgKiBAcGFyYW0ge1RyYWNrfSB0cmFjayAtIFRoZSBuZXcgdHJhY2sgdG8gYmUgcmVnaXN0ZXJlZCBpbiB0aGUgdGltZWxpbmUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbdHJhY2tJZD1udWxsXSAtIE9wdGlvbm5hbCB1bmlxdWUgaWQgdG8gYXNzb2NpYXRlIHdpdGhcbiAgICogICAgdGhlIHRyYWNrLCB0aGlzIGlkIG9ubHkgZXhpc3RzIGluIHRpbWVsaW5lJ3MgY29udGV4dCBhbmQgc2hvdWxkIGJlIHVzZWRcbiAgICogICAgaW4gY29uam9uY3Rpb24gd2l0aCBgYWRkTGF5ZXJgIG1ldGhvZC5cbiAgICovXG4gIGFkZCh0cmFjaywgdHJhY2tJZCA9IG51bGwpIHtcbiAgICBpZiAodGhpcy50cmFja3MuaW5kZXhPZih0cmFjaykgIT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RyYWNrIGFscmVhZHkgYWRkZWQgdG8gdGhlIHRpbWVsaW5lJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVnaXN0ZXJUcmFja0lkKHRyYWNrLCB0cmFja0lkKTtcbiAgICB0cmFjay5jb25maWd1cmUodGhpcy50aW1lQ29udGV4dCk7XG5cbiAgICB0aGlzLnRyYWNrcy5wdXNoKHRyYWNrKTtcbiAgICB0aGlzLmNyZWF0ZUludGVyYWN0aW9uKHRoaXMuX3N1cmZhY2VDdG9yLCB0cmFjay4kZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSB0cmFjayBmcm9tIHRoZSB0aW1lbGluZS5cbiAgICpcbiAgICogQHBhcmFtIHtUcmFja30gdHJhY2sgLSB0aGUgdHJhY2sgdG8gcmVtb3ZlIGZyb20gdGhlIHRpbWVsaW5lLlxuICAgKiBAdG9kbyBub3QgaW1wbGVtZW50ZWQuXG4gICAqL1xuICByZW1vdmUodHJhY2spIHtcbiAgICAvLyBzaG91bGQgZGVzdHJveSBpbnRlcmFjdGlvbiB0b28sIGF2b2lkIGdob3N0IGV2ZW50TGlzdGVuZXJzXG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIHRvIGNyZWF0ZSBhIG5ldyBgVHJhY2tgIGluc3RhbmNlLiBUaGUgYHRyYWNrYCBpcyBhZGRlZCxcbiAgICogcmVuZGVyZWQgYW5kIHVwZGF0ZWQgYmVmb3JlIGJlaW5nIHJldHVybmVkLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIFRoZSBET00gZWxlbWVudCB3aGVyZSB0aGUgdHJhY2sgc2hvdWxkIGJlIGluc2VydGVkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdHJhY2tIZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSBuZXdseSBjcmVhdGVkIHRyYWNrLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3RyYWNrSWQ9bnVsbF0gLSBPcHRpb25uYWwgdW5pcXVlIGlkIHRvIGFzc29jaWF0ZSB3aXRoXG4gICAqICAgIHRoZSB0cmFjaywgdGhpcyBpZCBvbmx5IGV4aXN0cyBpbiB0aW1lbGluZSdzIGNvbnRleHQgYW5kIHNob3VsZCBiZSB1c2VkIGluXG4gICAqICAgIGNvbmpvbmN0aW9uIHdpdGggYGFkZExheWVyYCBtZXRob2QuXG4gICAqIEByZXR1cm4ge1RyYWNrfVxuICAgKi9cbiAgY3JlYXRlVHJhY2soJGVsLCB0cmFja0hlaWdodCA9IDEwMCwgdHJhY2tJZCA9IG51bGwpIHtcbiAgICBjb25zdCB0cmFjayA9IG5ldyBUcmFjaygkZWwsIHRyYWNrSGVpZ2h0KTtcbiAgICAvLyBBZGQgdHJhY2sgdG8gdGhlIHRpbWVsaW5lXG4gICAgdGhpcy5hZGQodHJhY2ssIHRyYWNrSWQpO1xuICAgIHRyYWNrLnJlbmRlcigpO1xuICAgIHRyYWNrLnVwZGF0ZSgpO1xuXG4gICAgcmV0dXJuIHRyYWNrO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRyYWNrIGlkIGlzIGRlZmluZWQsIGFzc29jaWF0ZSBhIHRyYWNrIHdpdGggYSB1bmlxdWUgaWQuXG4gICAqL1xuICBfcmVnaXN0ZXJUcmFja0lkKHRyYWNrLCB0cmFja0lkKSB7XG4gICAgaWYgKHRyYWNrSWQgIT09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLl90cmFja0J5SWRbdHJhY2tJZF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHRyYWNrSWQ6IFwiJHt0cmFja0lkfVwiIGlzIGFscmVhZHkgdXNlZGApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl90cmFja0J5SWRbdHJhY2tJZF0gPSB0cmFjaztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIHRvIGFkZCBhIGBMYXllcmAgaW5zdGFuY2UgaW50byBhIGdpdmVuIGBUcmFja2AuIElzIGRlc2lnbmVkIHRvIGJlXG4gICAqIHVzZWQgaW4gY29uam9uY3Rpb24gd2l0aCB0aGUgYFRpbWVsaW5lfmdldExheWVyc0J5R3JvdXBgIG1ldGhvZC4gVGhlXG4gICAqIGxheWVyIGlzIGludGVybmFsbHkgcmVuZGVyZWQgYW5kIHVwZGF0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7TGF5ZXJ9IGxheWVyIC0gVGhlIGBMYXllcmAgaW5zdGFuY2UgdG8gYWRkIGludG8gdGhlIHZpc3VhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7KFRyYWNrfFN0cmluZyl9IHRyYWNrT3JUcmFja0lkIC0gVGhlIGBUcmFja2AgaW5zdGFuY2UgKG9yIGl0cyBgaWRgXG4gICAqICAgIGFzIGRlZmluZWQgaW4gdGhlIGBjcmVhdGVUcmFja2AgbWV0aG9kKSB3aGVyZSB0aGUgYExheWVyYCBpbnN0YW5jZSBzaG91bGQgYmUgaW5zZXJ0ZWQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbZ3JvdXBJZD0nZGVmYXVsdCddIC0gQW4gb3B0aW9ubmFsIGdyb3VwIGlkIGluIHdoaWNoIHRoZVxuICAgKiAgICBgTGF5ZXJgIHNob3VsZCBiZSBpbnNlcnRlZC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbaXNBeGlzXSAtIFNldCB0byBgdHJ1ZWAgaWYgdGhlIGFkZGVkIGBsYXllcmAgaXMgYW5cbiAgICogICAgaW5zdGFuY2Ugb2YgYEF4aXNMYXllcmAgKHRoZXNlIGxheWVycyBzaGFyZXMgdGhlIGBUaW1saW5lVGltZUNvbnRleHRgIGluc3RhbmNlXG4gICAqICAgIG9mIHRoZSB0aW1lbGluZSkuXG4gICAqL1xuICBhZGRMYXllcihsYXllciwgdHJhY2tPclRyYWNrSWQsIGdyb3VwSWQgPSAnZGVmYXVsdCcsIGlzQXhpcyA9IGZhbHNlKSB7XG4gICAgbGV0IHRyYWNrID0gdHJhY2tPclRyYWNrSWQ7XG5cbiAgICBpZiAodHlwZW9mIHRyYWNrT3JUcmFja0lkID09PSAnc3RyaW5nJykge1xuICAgICAgdHJhY2sgPSB0aGlzLmdldFRyYWNrQnlJZCh0cmFja09yVHJhY2tJZCk7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlcyB0aGUgYExheWVyVGltZUNvbnRleHRgIGlmIG5vdCBwcmVzZW50XG4gICAgaWYgKCFsYXllci50aW1lQ29udGV4dCkge1xuICAgICAgY29uc3QgdGltZUNvbnRleHQgPSBpc0F4aXMgP1xuICAgICAgICB0aGlzLnRpbWVDb250ZXh0IDogbmV3IExheWVyVGltZUNvbnRleHQodGhpcy50aW1lQ29udGV4dCk7XG5cbiAgICAgIGxheWVyLnNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KTtcbiAgICB9XG5cbiAgICAvLyB3ZSBzaG91bGQgaGF2ZSBhIFRyYWNrIGluc3RhbmNlIGF0IHRoaXMgcG9pbnRcbiAgICB0cmFjay5hZGQobGF5ZXIpO1xuXG4gICAgaWYgKCF0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdKSB7XG4gICAgICB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5fZ3JvdXBlZExheWVyc1tncm91cElkXS5wdXNoKGxheWVyKTtcblxuICAgIGxheWVyLnJlbmRlcigpO1xuICAgIGxheWVyLnVwZGF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBsYXllciBmcm9tIGl0cyB0cmFjay4gVGhlIGxheWVyIGlzIGRldGF0Y2hlZCBmcm9tIHRoZSBET00gYnV0XG4gICAqIGNhbiBzdGlsbCBiZSByZXVzZWQgbGF0ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7TGF5ZXJ9IGxheWVyIC0gVGhlIGxheWVyIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZUxheWVyKGxheWVyKSB7XG4gICAgdGhpcy50cmFja3MuZm9yRWFjaChmdW5jdGlvbih0cmFjaykge1xuICAgICAgY29uc3QgaW5kZXggPSB0cmFjay5sYXllcnMuaW5kZXhPZihsYXllcik7XG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7IHRyYWNrLnJlbW92ZShsYXllcik7IH1cbiAgICB9KTtcblxuICAgIC8vIGNsZWFuIHJlZmVyZW5jZXMgaW4gaGVscGVyc1xuICAgIGZvciAobGV0IGdyb3VwSWQgaW4gdGhpcy5fZ3JvdXBlZExheWVycykge1xuICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdO1xuICAgICAgY29uc3QgaW5kZXggPSBncm91cC5pbmRleE9mKGxheWVyKTtcblxuICAgICAgaWYgKGluZGV4ICE9PSAtMSkgeyBncm91cC5zcGxpY2UobGF5ZXIsIDEpOyB9XG5cbiAgICAgIGlmICghZ3JvdXAubGVuZ3RoKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgYFRyYWNrYCBpbnN0YW5jZSBmcm9tIGl0J3MgZ2l2ZW4gaWQuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0cmFja0lkXG4gICAqIEByZXR1cm4ge1RyYWNrfVxuICAgKi9cbiAgZ2V0VHJhY2tCeUlkKHRyYWNrSWQpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhY2tCeUlkW3RyYWNrSWRdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRyYWNrIGNvbnRhaW5pbmcgYSBnaXZlbiBET00gRWxlbWVudCwgcmV0dXJucyBudWxsIGlmIG5vIG1hdGNoIGZvdW5kLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIFRoZSBET00gRWxlbWVudCB0byBiZSB0ZXN0ZWQuXG4gICAqIEByZXR1cm4ge1RyYWNrfVxuICAgKi9cbiAgZ2V0VHJhY2tGcm9tRE9NRWxlbWVudCgkZWwpIHtcbiAgICBsZXQgJHN2ZyA9IG51bGw7XG4gICAgbGV0IHRyYWNrID0gbnVsbDtcbiAgICAvLyBmaW5kIHRoZSBjbG9zZXN0IGAudHJhY2tgIGVsZW1lbnRcbiAgICBkbyB7XG4gICAgICBpZiAoJGVsLmNsYXNzTGlzdC5jb250YWlucygndHJhY2snKSkge1xuICAgICAgICAkc3ZnID0gJGVsO1xuICAgICAgfVxuICAgICAgJGVsID0gJGVsLnBhcmVudE5vZGU7XG4gICAgfSB3aGlsZSAoJHN2ZyA9PT0gbnVsbCk7XG4gICAgLy8gZmluZCB0aGUgcmVsYXRlZCBgVHJhY2tgXG4gICAgdGhpcy50cmFja3MuZm9yRWFjaChmdW5jdGlvbihfdHJhY2spIHtcbiAgICAgIGlmIChfdHJhY2suJHN2ZyA9PT0gJHN2ZykgeyB0cmFjayA9IF90cmFjazsgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRyYWNrO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgbGF5ZXJzIGZyb20gdGhlaXIgZ2l2ZW4gZ3JvdXAgaWQuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBncm91cElkIC0gVGhlIGlkIG9mIHRoZSBncm91cCBhcyBkZWZpbmVkIGluIGBhZGRMYXllcmAuXG4gICAqIEByZXR1cm4geyhBcnJheXx1bmRlZmluZWQpfVxuICAgKi9cbiAgZ2V0TGF5ZXJzQnlHcm91cChncm91cElkKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF07XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZXMgdGhyb3VnaCB0aGUgYWRkZWQgdHJhY2tzLlxuICAgKi9cbiAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHlpZWxkKiB0aGlzLnRyYWNrc1tTeW1ib2wuaXRlcmF0b3JdKCk7XG4gIH1cbn1cbiJdfQ==