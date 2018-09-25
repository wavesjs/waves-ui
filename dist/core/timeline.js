'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _Keyboard = require('../interactions/Keyboard');

var _Keyboard2 = _interopRequireDefault(_Keyboard);

var _LayerTimeContext = require('./LayerTimeContext');

var _LayerTimeContext2 = _interopRequireDefault(_LayerTimeContext);

var _Surface = require('../interactions/Surface');

var _Surface2 = _interopRequireDefault(_Surface);

var _TimelineTimeContext = require('./TimelineTimeContext');

var _TimelineTimeContext2 = _interopRequireDefault(_TimelineTimeContext);

var _Track = require('./Track');

var _Track2 = _interopRequireDefault(_Track);

var _TrackCollection = require('./TrackCollection');

var _TrackCollection2 = _interopRequireDefault(_TrackCollection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var Timeline = function (_events$EventEmitter) {
  (0, _inherits3.default)(Timeline, _events$EventEmitter);

  /**
   * @param {Number} [pixelsPerSecond=100] - the default scaling between time and pixels.
   * @param {Number} [visibleWidth=1000] - the default visible area for all registered tracks.
   */
  function Timeline() {
    var pixelsPerSecond = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
    var visibleWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;

    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$registerKeyboard = _ref.registerKeyboard,
        registerKeyboard = _ref$registerKeyboard === undefined ? true : _ref$registerKeyboard;

    (0, _classCallCheck3.default)(this, Timeline);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Timeline.__proto__ || (0, _getPrototypeOf2.default)(Timeline)).call(this));

    _this._tracks = new _TrackCollection2.default(_this);
    _this._state = null;

    // default interactions
    _this._surfaceCtor = _Surface2.default;

    // stores
    _this._trackById = {};
    _this._groupedLayers = {};
    _this._$elInteractionsMap = new _map2.default();

    /** @type {TimelineTimeContext} - master time context for the visualization. */
    _this.timeContext = new _TimelineTimeContext2.default(pixelsPerSecond, visibleWidth);

    if (registerKeyboard) _this.createInteraction(_Keyboard2.default, document);
    return _this;
  }

  /**
   * Returns `TimelineTimeContext`'s `offset` time domain value.
   *
   * @type {Number} [offset=0]
   */


  (0, _createClass3.default)(Timeline, [{
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
      var _this2 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var interaction = new ctor($el, options);
      interaction.on('event', function (e) {
        return _this2._handleEvent(e);
      });

      // store interaction associated to the DOM element
      if (!this._$elInteractionsMap.has($el)) this._$elInteractionsMap.set($el, new _set2.default());

      var interactionSet = this._$elInteractionsMap.get($el);
      interactionSet.add(interaction);
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
        var boundingRect = layer.$el.getBoundingClientRect();

        if (clientX > boundingRect.left && clientX < boundingRect.right && clientY > boundingRect.top && clientY < boundingRect.bottom) {
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
      if (this._state) this._state.handleEvent(e, hitLayers);
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
      var trackId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (this.tracks.has(track)) throw new Error('track already added to the timeline');

      this._registerTrackId(track, trackId);
      track.configure(this.timeContext);

      this.tracks.add(track);
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
    value: function remove(track) {
      // should destroy all interactions too, avoid ghost eventListeners
      var $el = track.$el;
      var interactions = this._$elInteractionsMap.get($el);

      if (interactions) interactions.forEach(function (interaction) {
        return interaction.destroy();
      });

      track.destroy();
    }

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
      var trackHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
      var trackId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var track = new _Track2.default($el, trackHeight);
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
      var groupId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'default';
      var isAxis = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      var track = trackOrTrackId;

      if (typeof trackOrTrackId === 'string') {
        track = this.getTrackById(trackOrTrackId);
      }

      // creates the `LayerTimeContext` if not present
      if (!layer.timeContext) {
        var timeContext = isAxis ? this.timeContext : new _LayerTimeContext2.default(this.timeContext);

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
  }, {
    key: 'offset',
    get: function get() {
      return this.timeContext.offset;
    }

    /**
     * Updates `TimelineTimeContext`'s `offset` time domain value.
     *
     * @type {Number} [offset=0]
     */
    ,
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
    }

    /**
     * Updates the `TimelineTimeContext`'s `zoom` value.
     *
     * @type {Number} [offset=0]
     */
    ,
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
    }

    /**
     * Updates the `TimelineTimeContext`'s `pixelsPerSecond` ratio.
     *
     * @type {Number} [offset=0]
     */
    ,
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
    }

    /**
     * Updates the `TimelineTimeContext`'s `visibleWidth` pixel domain value.
     *
     * @type {Number} [offset=0]
     */
    ,
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
    }

    /**
     * Returns `TimelineTimeContext`'s `maintainVisibleDuration` current value.
     *
     * @type {Boolean}
     */
    ,
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
      if (this._state) this._state.exit();

      this._state = state;

      if (this._state) this._state.enter();
    }

    /**
     * Returns the current state of the timeline.
     *
     * @type {BaseState}
     */
    ,
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
}(_events2.default.EventEmitter);

exports.default = Timeline;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRpbWVsaW5lLmpzIl0sIm5hbWVzIjpbIlRpbWVsaW5lIiwicGl4ZWxzUGVyU2Vjb25kIiwidmlzaWJsZVdpZHRoIiwicmVnaXN0ZXJLZXlib2FyZCIsIl90cmFja3MiLCJfc3RhdGUiLCJfc3VyZmFjZUN0b3IiLCJfdHJhY2tCeUlkIiwiX2dyb3VwZWRMYXllcnMiLCJfJGVsSW50ZXJhY3Rpb25zTWFwIiwidGltZUNvbnRleHQiLCJjcmVhdGVJbnRlcmFjdGlvbiIsImRvY3VtZW50IiwiY3RvciIsIiRlbCIsIm9wdGlvbnMiLCJpbnRlcmFjdGlvbiIsIm9uIiwiZSIsIl9oYW5kbGVFdmVudCIsImhhcyIsInNldCIsImludGVyYWN0aW9uU2V0IiwiZ2V0IiwiYWRkIiwiY2xpZW50WCIsIm9yaWdpbmFsRXZlbnQiLCJjbGllbnRZIiwibGF5ZXJzIiwiZm9yRWFjaCIsImxheWVyIiwicGFyYW1zIiwiaGl0dGFibGUiLCJib3VuZGluZ1JlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJsZWZ0IiwicmlnaHQiLCJ0b3AiLCJib3R0b20iLCJwdXNoIiwiaGl0TGF5ZXJzIiwic291cmNlIiwiZ2V0SGl0TGF5ZXJzIiwiZW1pdCIsImhhbmRsZUV2ZW50IiwidHJhY2siLCJ0cmFja0lkIiwidHJhY2tzIiwiRXJyb3IiLCJfcmVnaXN0ZXJUcmFja0lkIiwiY29uZmlndXJlIiwiaW50ZXJhY3Rpb25zIiwiZGVzdHJveSIsInRyYWNrSGVpZ2h0IiwicmVuZGVyIiwidXBkYXRlIiwidW5kZWZpbmVkIiwidHJhY2tPclRyYWNrSWQiLCJncm91cElkIiwiaXNBeGlzIiwiZ2V0VHJhY2tCeUlkIiwic2V0VGltZUNvbnRleHQiLCJpbmRleCIsImluZGV4T2YiLCJyZW1vdmUiLCJncm91cCIsInNwbGljZSIsImxlbmd0aCIsIiRzdmciLCJjbGFzc0xpc3QiLCJjb250YWlucyIsInBhcmVudE5vZGUiLCJfdHJhY2siLCJvZmZzZXQiLCJ2YWx1ZSIsInpvb20iLCJ0aW1lVG9QaXhlbCIsInZpc2libGVEdXJhdGlvbiIsImJvb2wiLCJtYWludGFpblZpc2libGVEdXJhdGlvbiIsInN0YXRlIiwiZXhpdCIsImVudGVyIiwiRXZlbnRFbWl0dGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEyQk1BLFE7OztBQUNKOzs7O0FBSUEsc0JBRVE7QUFBQSxRQUZJQyxlQUVKLHVFQUZzQixHQUV0QjtBQUFBLFFBRjJCQyxZQUUzQix1RUFGMEMsSUFFMUM7O0FBQUEsbUZBQUosRUFBSTtBQUFBLHFDQUROQyxnQkFDTTtBQUFBLFFBRE5BLGdCQUNNLHlDQURhLElBQ2I7O0FBQUE7O0FBQUE7O0FBR04sVUFBS0MsT0FBTCxHQUFlLG9DQUFmO0FBQ0EsVUFBS0MsTUFBTCxHQUFjLElBQWQ7O0FBRUE7QUFDQSxVQUFLQyxZQUFMOztBQUVBO0FBQ0EsVUFBS0MsVUFBTCxHQUFrQixFQUFsQjtBQUNBLFVBQUtDLGNBQUwsR0FBc0IsRUFBdEI7QUFDQSxVQUFLQyxtQkFBTCxHQUEyQixtQkFBM0I7O0FBRUE7QUFDQSxVQUFLQyxXQUFMLEdBQW1CLGtDQUF3QlQsZUFBeEIsRUFBeUNDLFlBQXpDLENBQW5COztBQUVBLFFBQUlDLGdCQUFKLEVBQ0UsTUFBS1EsaUJBQUwscUJBQWlDQyxRQUFqQztBQWxCSTtBQW1CUDs7QUFFRDs7Ozs7Ozs7Ozs7QUF3SEE7Ozs7Ozs7O3FDQVFpQkMsSSxFQUFNO0FBQ3JCLFdBQUtQLFlBQUwsR0FBb0JPLElBQXBCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7c0NBVWtCQSxJLEVBQU1DLEcsRUFBbUI7QUFBQTs7QUFBQSxVQUFkQyxPQUFjLHVFQUFKLEVBQUk7O0FBQ3pDLFVBQU1DLGNBQWMsSUFBSUgsSUFBSixDQUFTQyxHQUFULEVBQWNDLE9BQWQsQ0FBcEI7QUFD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QUEyQ0QsSUFBM0M7QUFDRDs7QUFFRDs7Ozs7O3dCQUs4QjtBQUM1QixhQUFPLEtBQUtwRSxXQUFMLENBQWlCcUUsdUJBQXhCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozt3QkFNb0I7QUFDbEIsYUFBTyxLQUFLdkUsY0FBWjtBQUNEOzs7c0JBaUZTd0UsSyxFQUFPO0FBQ2YsVUFBSSxLQUFLM0UsTUFBVCxFQUNFLEtBQUtBLE1BQUwsQ0FBWTRFLElBQVo7O0FBRUYsV0FBSzVFLE1BQUwsR0FBYzJFLEtBQWQ7O0FBRUEsVUFBSSxLQUFLM0UsTUFBVCxFQUNFLEtBQUtBLE1BQUwsQ0FBWTZFLEtBQVo7QUFDSDs7QUFFRDs7Ozs7O3dCQUtZO0FBQ1YsYUFBTyxLQUFLN0UsTUFBWjtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLYTtBQUNYLGFBQU8sS0FBS0QsT0FBWjtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLYTtBQUNYLGFBQU8sS0FBS0EsT0FBTCxDQUFhd0IsTUFBcEI7QUFDRDs7O0VBdFFvQixpQkFBT3VELFk7O2tCQThiZm5GLFEiLCJmaWxlIjoiVGltZWxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5cbmltcG9ydCBLZXlib2FyZCBmcm9tICcuLi9pbnRlcmFjdGlvbnMvS2V5Ym9hcmQnO1xuaW1wb3J0IExheWVyVGltZUNvbnRleHQgZnJvbSAnLi9MYXllclRpbWVDb250ZXh0JztcbmltcG9ydCBTdXJmYWNlIGZyb20gJy4uL2ludGVyYWN0aW9ucy9TdXJmYWNlJztcbmltcG9ydCBUaW1lbGluZVRpbWVDb250ZXh0IGZyb20gJy4vVGltZWxpbmVUaW1lQ29udGV4dCc7XG5pbXBvcnQgVHJhY2sgZnJvbSAnLi9UcmFjayc7XG5pbXBvcnQgVHJhY2tDb2xsZWN0aW9uIGZyb20gJy4vVHJhY2tDb2xsZWN0aW9uJztcblxuXG4vKipcbiAqIElzIHRoZSBtYWluIGVudHJ5IHBvaW50IHRvIGNyZWF0ZSBhIHRlbXBvcmFsIHZpc3VhbGl6YXRpb24uXG4gKlxuICogQSBgdGltZWxpbmVgIGluc3RhbmNlIG1haW5seSBwcm92aWRlcyB0aGUgY29udGV4dCBmb3IgYW55IHZpc3VhbGl6YXRpb24gb2ZcbiAqIHRlbXBvcmFsIGRhdGEgYW5kIG1haW50YWlucyB0aGUgaGllcmFyY2h5IG9mIGBUcmFja2AsIGBMYXllcmAgYW5kIGBTaGFwZWBcbiAqIG92ZXIgdGhlIGVudGllcmUgdmlzdWFsaXNhdGlvbi5cbiAqXG4gKiBJdHMgbWFpbiByZXNwb25zYWJpbGl0ZXMgYXJlOlxuICogLSBtYWludGFpbmluZyB0aGUgdGVtcG9yYWwgY29uc2lzdGVuY3kgYWNjcm9zcyB0aGUgdmlzdWFsaXNhdGlvbiB0aHJvdWdoXG4gKiAgIGl0cyBgdGltZUNvbnRleHRgIHByb3BlcnR5IChpbnN0YW5jZSBvZiBgVGltZWxpbmVUaW1lQ29udGV4dGApLlxuICogLSBoYW5kbGluZyBpbnRlcmFjdGlvbnMgdG8gaXRzIGN1cnJlbnQgc3RhdGUgKGFjdGluZyBoZXJlIGFzIGEgc2ltcGxlXG4gKiAgIHN0YXRlIG1hY2hpbmUpLlxuICpcbiAqIEBUT0RPIGluc2VydCBmaWd1cmVcbiAqXG4gKiBJdCBhbHNvIGNvbnRhaW5zIGEgcmVmZXJlbmNlIHRvIGFsbCB0aGUgcmVnaXN0ZXIgdHJhY2sgYWxsb3dpbmcgdG8gYHJlbmRlcmBcbiAqIG9yIGB1cGRhdGVgIGFsbCB0aGUgbGF5ZXIgZnJvbSBhIHNpbmdsZSBlbnRyeSBwb2ludC5cbiAqXG4gKiAjIyBFeGFtcGxlIFVzYWdlXG4gKlxuICogYGBganNcbiAqIGNvbnN0IHZpc2libGVXaWR0aCA9IDUwMDsgLy8gZGVmYXVsdCB3aWR0aCBpbiBwaXhlbHMgZm9yIGFsbCBjcmVhdGVkIGBUcmFja2BcbiAqIGNvbnN0IGR1cmF0aW9uID0gMTA7IC8vIHRoZSB2aXNpYmxlIGFyZWEgcmVwcmVzZW50cyAxMCBzZWNvbmRzXG4gKiBjb25zdCBwaXhlbHNQZXJTZWNvbmRzID0gdmlzaWJsZVdpZHRoIC8gZHVyYXRpb247XG4gKiBjb25zdCB0aW1lbGluZSA9IG5ldyB1aS5jb3JlLlRpbWVsaW5lKHBpeGVsc1BlclNlY29uZCwgd2lkdGgpO1xuICogYGBgXG4gKi9cbmNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3BpeGVsc1BlclNlY29uZD0xMDBdIC0gdGhlIGRlZmF1bHQgc2NhbGluZyBiZXR3ZWVuIHRpbWUgYW5kIHBpeGVscy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFt2aXNpYmxlV2lkdGg9MTAwMF0gLSB0aGUgZGVmYXVsdCB2aXNpYmxlIGFyZWEgZm9yIGFsbCByZWdpc3RlcmVkIHRyYWNrcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHBpeGVsc1BlclNlY29uZCA9IDEwMCwgdmlzaWJsZVdpZHRoID0gMTAwMCwge1xuICAgIHJlZ2lzdGVyS2V5Ym9hcmQgPSB0cnVlXG4gIH0gPSB7fSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLl90cmFja3MgPSBuZXcgVHJhY2tDb2xsZWN0aW9uKHRoaXMpO1xuICAgIHRoaXMuX3N0YXRlID0gbnVsbDtcblxuICAgIC8vIGRlZmF1bHQgaW50ZXJhY3Rpb25zXG4gICAgdGhpcy5fc3VyZmFjZUN0b3IgPSBTdXJmYWNlO1xuXG4gICAgLy8gc3RvcmVzXG4gICAgdGhpcy5fdHJhY2tCeUlkID0ge307XG4gICAgdGhpcy5fZ3JvdXBlZExheWVycyA9IHt9O1xuICAgIHRoaXMuXyRlbEludGVyYWN0aW9uc01hcCA9IG5ldyBNYXAoKTtcblxuICAgIC8qKiBAdHlwZSB7VGltZWxpbmVUaW1lQ29udGV4dH0gLSBtYXN0ZXIgdGltZSBjb250ZXh0IGZvciB0aGUgdmlzdWFsaXphdGlvbi4gKi9cbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbmV3IFRpbWVsaW5lVGltZUNvbnRleHQocGl4ZWxzUGVyU2Vjb25kLCB2aXNpYmxlV2lkdGgpO1xuXG4gICAgaWYgKHJlZ2lzdGVyS2V5Ym9hcmQpXG4gICAgICB0aGlzLmNyZWF0ZUludGVyYWN0aW9uKEtleWJvYXJkLCBkb2N1bWVudCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgb2Zmc2V0YCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn0gW29mZnNldD0wXVxuICAgKi9cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5vZmZzZXQ7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgb2Zmc2V0YCB0aW1lIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn0gW29mZnNldD0wXVxuICAgKi9cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQub2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYHpvb21gIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfSBbb2Zmc2V0PTBdXG4gICAqL1xuICBnZXQgem9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC56b29tO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGB6b29tYCB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn0gW29mZnNldD0wXVxuICAgKi9cbiAgc2V0IHpvb20odmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0Lnpvb20gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgcGl4ZWxzUGVyU2Vjb25kYCByYXRpby5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn0gW29mZnNldD0wXVxuICAgKi9cbiAgZ2V0IHBpeGVsc1BlclNlY29uZCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5waXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYHBpeGVsc1BlclNlY29uZGAgcmF0aW8uXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9IFtvZmZzZXQ9MF1cbiAgICovXG4gIHNldCBwaXhlbHNQZXJTZWNvbmQodmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnBpeGVsc1BlclNlY29uZCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGB2aXNpYmxlV2lkdGhgIHBpeGVsIGRvbWFpbiB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn0gW29mZnNldD0wXVxuICAgKi9cbiAgZ2V0IHZpc2libGVXaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC52aXNpYmxlV2lkdGg7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYHZpc2libGVXaWR0aGAgcGl4ZWwgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfSBbb2Zmc2V0PTBdXG4gICAqL1xuICBzZXQgdmlzaWJsZVdpZHRoKHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC52aXNpYmxlV2lkdGggPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGB0aW1lVG9QaXhlbGAgdHJhbnNmZXJ0IGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBnZXQgdGltZVRvUGl4ZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQudGltZVRvUGl4ZWw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgdmlzaWJsZUR1cmF0aW9uYCBoZWxwZXIgdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgdmlzaWJsZUR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnZpc2libGVEdXJhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb25gIHZhbHVlLlxuICAgKiBEZWZpbmVzIGlmIHRoZSBkdXJhdGlvbiBvZiB0aGUgdmlzaWJsZSBhcmVhIHNob3VsZCBiZSBtYWludGFpbiB3aGVuXG4gICAqIHRoZSBgdmlzaWJsZVdpZHRoYCBhdHRyaWJ1dGUgaXMgdXBkYXRlZC5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICBzZXQgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24oYm9vbCkge1xuICAgIHRoaXMudGltZUNvbnRleHQubWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSBib29sO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYG1haW50YWluVmlzaWJsZUR1cmF0aW9uYCBjdXJyZW50IHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIGdldCBtYWludGFpblZpc2libGVEdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5tYWludGFpblZpc2libGVEdXJhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBPYmplY3QgbWFpbnRhaW5pbmcgYXJyYXlzIG9mIGBMYXllcmAgaW5zdGFuY2VzIG9yZGVyZWQgYnkgdGhlaXIgYGdyb3VwSWRgLlxuICAgKiBJcyB1c2VkIGludGVybmFsbHkgYnkgdGhlIGBUcmFja0NvbGxlY3Rpb25gIGluc3RhbmNlLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgZ2V0IGdyb3VwZWRMYXllcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dyb3VwZWRMYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGVzIHRoZSBkZWZhdWx0IGBTdXJmYWNlYCB0aGF0IGlzIGluc3RhbmNpYXRlZCBvbiBlYWNoIGBUcmFja2BcbiAgICogaW5zdGFuY2UuIFRoaXMgbWV0aG9zIHNob3VsZCBiZSBjYWxsZWQgYmVmb3JlIGFkZGluZyBhbnkgYFRyYWNrYCBpbnN0YW5jZVxuICAgKiB0byB0aGUgY3VycmVudCBgdGltZWxpbmVgLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50U291cmNlfSBjdG9yIC0gVGhlIGNvbnN0cnVjdG9yIHRvIHVzZSBpbiBvcmRlciB0byBjYXRjaCBtb3VzZVxuICAgKiAgICBldmVudHMgb24gZWFjaCBgVHJhY2tgIGluc3RhbmNlcy5cbiAgICovXG4gIGNvbmZpZ3VyZVN1cmZhY2UoY3Rvcikge1xuICAgIHRoaXMuX3N1cmZhY2VDdG9yID0gY3RvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBGYWN0b3J5IG1ldGhvZCB0byBhZGQgaW50ZXJhY3Rpb24gbW9kdWxlcyB0aGUgdGltZWxpbmUgc2hvdWxkIGxpc3RlbiB0by5cbiAgICogQnkgZGVmYXVsdCwgdGhlIHRpbWVsaW5lIGluc3RhbmNpYXRlIGEgZ2xvYmFsIGBLZXlib2FyZGAgaW5zdGFuY2UgYW5kIGFcbiAgICogYFN1cmZhY2VgIGluc3RhbmNlIG9uIGVhY2ggY29udGFpbmVyLlxuICAgKiBTaG91bGQgYmUgdXNlZCB0byBpbnN0YWxsIG5ldyBpbnRlcmFjdGlvbnMgaW1wbGVtZW50aW5nIHRoZSBgRXZlbnRTb3VyY2VgIGludGVyZmFjZS5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudFNvdXJjZX0gY3RvciAtIFRoZSBjb250cnVjdG9yIG9mIHRoZSBpbnRlcmFjdGlvbiBtb2R1bGUgdG8gaW5zdGFuY2lhdGUuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsIC0gVGhlIERPTSBlbGVtZW50IHdoaWNoIHdpbGwgYmUgYmluZGVkIHRvIHRoZSBgRXZlbnRTb3VyY2VgIG1vZHVsZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSAtIE9wdGlvbnMgdG8gYmUgYXBwbGllZCB0byB0aGUgYGN0b3JgLlxuICAgKi9cbiAgY3JlYXRlSW50ZXJhY3Rpb24oY3RvciwgJGVsLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBpbnRlcmFjdGlvbiA9IG5ldyBjdG9yKCRlbCwgb3B0aW9ucyk7XG4gICAgaW50ZXJhY3Rpb24ub24oJ2V2ZW50JywgKGUpID0+IHRoaXMuX2hhbmRsZUV2ZW50KGUpKTtcblxuICAgIC8vIHN0b3JlIGludGVyYWN0aW9uIGFzc29jaWF0ZWQgdG8gdGhlIERPTSBlbGVtZW50XG4gICAgaWYgKCF0aGlzLl8kZWxJbnRlcmFjdGlvbnNNYXAuaGFzKCRlbCkpXG4gICAgICB0aGlzLl8kZWxJbnRlcmFjdGlvbnNNYXAuc2V0KCRlbCwgbmV3IFNldCgpKTtcblxuICAgIGNvbnN0IGludGVyYWN0aW9uU2V0ID0gdGhpcy5fJGVsSW50ZXJhY3Rpb25zTWFwLmdldCgkZWwpO1xuICAgIGludGVyYWN0aW9uU2V0LmFkZChpbnRlcmFjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGxpc3Qgb2YgdGhlIGxheWVycyBzaXR1YXRlZCB1bmRlciB0aGUgcG9zaXRpb24gb2YgYSBgV2F2ZUV2ZW50YC5cbiAgICpcbiAgICogQHBhcmFtIHtXYXZlc0V2ZW50fSBlIC0gQW4gZXZlbnQgdHJpZ2dlcmVkIGJ5IGEgYFdhdmVFdmVudGBcbiAgICogQHJldHVybiB7QXJyYXl9IC0gTWF0Y2hlZCBsYXllcnNcbiAgICovXG4gIGdldEhpdExheWVycyhlKSB7XG4gICAgY29uc3QgY2xpZW50WCA9IGUub3JpZ2luYWxFdmVudC5jbGllbnRYO1xuICAgIGNvbnN0IGNsaWVudFkgPSBlLm9yaWdpbmFsRXZlbnQuY2xpZW50WTtcbiAgICBsZXQgbGF5ZXJzID0gW107XG5cbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgaWYgKCFsYXllci5wYXJhbXMuaGl0dGFibGUpIHsgcmV0dXJuOyB9XG4gICAgICBjb25zdCBib3VuZGluZ1JlY3QgPSBsYXllci4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgY2xpZW50WCA+IGJvdW5kaW5nUmVjdC5sZWZ0ICYmIGNsaWVudFggPCBib3VuZGluZ1JlY3QucmlnaHQgJiZcbiAgICAgICAgY2xpZW50WSA+IGJvdW5kaW5nUmVjdC50b3AgJiYgY2xpZW50WSA8IGJvdW5kaW5nUmVjdC5ib3R0b21cbiAgICAgICkge1xuICAgICAgICBsYXllcnMucHVzaChsYXllcik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjYWxsYmFjayB0aGF0IGlzIHVzZWQgdG8gbGlzdGVuIHRvIGludGVyYWN0aW9ucyBtb2R1bGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge1dhdmVFdmVudH0gZSAtIEFuIGV2ZW50IGdlbmVyYXRlZCBieSBhbiBpbnRlcmFjdGlvbiBtb2R1bGVzIChgRXZlbnRTb3VyY2VgKS5cbiAgICovXG4gIF9oYW5kbGVFdmVudChlKSB7XG4gICAgY29uc3QgaGl0TGF5ZXJzID0gKGUuc291cmNlID09PSAnc3VyZmFjZScpID8gdGhpcy5nZXRIaXRMYXllcnMoZSkgOiBudWxsO1xuICAgIC8vIGVtaXQgZXZlbnQgYXMgYSBtaWRkbGV3YXJlXG4gICAgdGhpcy5lbWl0KCdldmVudCcsIGUsIGhpdExheWVycyk7XG4gICAgLy8gcHJvcGFnYXRlIHRvIHRoZSBzdGF0ZVxuICAgIGlmICh0aGlzLl9zdGF0ZSlcbiAgICAgIHRoaXMuX3N0YXRlLmhhbmRsZUV2ZW50KGUsIGhpdExheWVycyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgc3RhdGUgb2YgdGhlIHRpbWVsaW5lLlxuICAgKlxuICAgKiBAdHlwZSB7QmFzZVN0YXRlfVxuICAgKi9cbiAgc2V0IHN0YXRlKHN0YXRlKSB7XG4gICAgaWYgKHRoaXMuX3N0YXRlKVxuICAgICAgdGhpcy5fc3RhdGUuZXhpdCgpO1xuXG4gICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcblxuICAgIGlmICh0aGlzLl9zdGF0ZSlcbiAgICAgIHRoaXMuX3N0YXRlLmVudGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgdGltZWxpbmUuXG4gICAqXG4gICAqIEB0eXBlIHtCYXNlU3RhdGV9XG4gICAqL1xuICBnZXQgc3RhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUcmFja0NvbGxlY3Rpb25gIGluc3RhbmNlLlxuICAgKlxuICAgKiBAdHlwZSB7VHJhY2tDb2xsZWN0aW9ufVxuICAgKi9cbiAgZ2V0IHRyYWNrcygpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhY2tzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGxpc3Qgb2YgYWxsIHJlZ2lzdGVyZWQgbGF5ZXJzLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqL1xuICBnZXQgbGF5ZXJzKCkge1xuICAgIHJldHVybiB0aGlzLl90cmFja3MubGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBuZXcgdHJhY2sgdG8gdGhlIHRpbWVsaW5lLlxuICAgKlxuICAgKiBAcGFyYW0ge1RyYWNrfSB0cmFjayAtIFRoZSBuZXcgdHJhY2sgdG8gYmUgcmVnaXN0ZXJlZCBpbiB0aGUgdGltZWxpbmUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbdHJhY2tJZD1udWxsXSAtIE9wdGlvbm5hbCB1bmlxdWUgaWQgdG8gYXNzb2NpYXRlIHdpdGhcbiAgICogICAgdGhlIHRyYWNrLCB0aGlzIGlkIG9ubHkgZXhpc3RzIGluIHRpbWVsaW5lJ3MgY29udGV4dCBhbmQgc2hvdWxkIGJlIHVzZWRcbiAgICogICAgaW4gY29uam9uY3Rpb24gd2l0aCBgYWRkTGF5ZXJgIG1ldGhvZC5cbiAgICovXG4gIGFkZCh0cmFjaywgdHJhY2tJZCA9IG51bGwpIHtcbiAgICBpZiAodGhpcy50cmFja3MuaGFzKHRyYWNrKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcigndHJhY2sgYWxyZWFkeSBhZGRlZCB0byB0aGUgdGltZWxpbmUnKTtcblxuICAgIHRoaXMuX3JlZ2lzdGVyVHJhY2tJZCh0cmFjaywgdHJhY2tJZCk7XG4gICAgdHJhY2suY29uZmlndXJlKHRoaXMudGltZUNvbnRleHQpO1xuXG4gICAgdGhpcy50cmFja3MuYWRkKHRyYWNrKTtcbiAgICB0aGlzLmNyZWF0ZUludGVyYWN0aW9uKHRoaXMuX3N1cmZhY2VDdG9yLCB0cmFjay4kZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSB0cmFjayBmcm9tIHRoZSB0aW1lbGluZS5cbiAgICpcbiAgICogQHBhcmFtIHtUcmFja30gdHJhY2sgLSB0aGUgdHJhY2sgdG8gcmVtb3ZlIGZyb20gdGhlIHRpbWVsaW5lLlxuICAgKiBAdG9kbyBub3QgaW1wbGVtZW50ZWQuXG4gICAqL1xuICByZW1vdmUodHJhY2spIHtcbiAgICAvLyBzaG91bGQgZGVzdHJveSBhbGwgaW50ZXJhY3Rpb25zIHRvbywgYXZvaWQgZ2hvc3QgZXZlbnRMaXN0ZW5lcnNcbiAgICBjb25zdCAkZWwgPSB0cmFjay4kZWw7XG4gICAgY29uc3QgaW50ZXJhY3Rpb25zID0gdGhpcy5fJGVsSW50ZXJhY3Rpb25zTWFwLmdldCgkZWwpO1xuXG4gICAgaWYgKGludGVyYWN0aW9ucylcbiAgICAgIGludGVyYWN0aW9ucy5mb3JFYWNoKGludGVyYWN0aW9uID0+IGludGVyYWN0aW9uLmRlc3Ryb3koKSk7XG5cbiAgICB0cmFjay5kZXN0cm95KCk7XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIHRvIGNyZWF0ZSBhIG5ldyBgVHJhY2tgIGluc3RhbmNlLiBUaGUgYHRyYWNrYCBpcyBhZGRlZCxcbiAgICogcmVuZGVyZWQgYW5kIHVwZGF0ZWQgYmVmb3JlIGJlaW5nIHJldHVybmVkLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIFRoZSBET00gZWxlbWVudCB3aGVyZSB0aGUgdHJhY2sgc2hvdWxkIGJlIGluc2VydGVkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdHJhY2tIZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSBuZXdseSBjcmVhdGVkIHRyYWNrLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3RyYWNrSWQ9bnVsbF0gLSBPcHRpb25uYWwgdW5pcXVlIGlkIHRvIGFzc29jaWF0ZSB3aXRoXG4gICAqICAgIHRoZSB0cmFjaywgdGhpcyBpZCBvbmx5IGV4aXN0cyBpbiB0aW1lbGluZSdzIGNvbnRleHQgYW5kIHNob3VsZCBiZSB1c2VkIGluXG4gICAqICAgIGNvbmpvbmN0aW9uIHdpdGggYGFkZExheWVyYCBtZXRob2QuXG4gICAqIEByZXR1cm4ge1RyYWNrfVxuICAgKi9cbiAgY3JlYXRlVHJhY2soJGVsLCB0cmFja0hlaWdodCA9IDEwMCwgdHJhY2tJZCA9IG51bGwpIHtcbiAgICBjb25zdCB0cmFjayA9IG5ldyBUcmFjaygkZWwsIHRyYWNrSGVpZ2h0KTtcbiAgICAvLyBBZGQgdHJhY2sgdG8gdGhlIHRpbWVsaW5lXG4gICAgdGhpcy5hZGQodHJhY2ssIHRyYWNrSWQpO1xuICAgIHRyYWNrLnJlbmRlcigpO1xuICAgIHRyYWNrLnVwZGF0ZSgpO1xuXG4gICAgcmV0dXJuIHRyYWNrO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRyYWNrIGlkIGlzIGRlZmluZWQsIGFzc29jaWF0ZSBhIHRyYWNrIHdpdGggYSB1bmlxdWUgaWQuXG4gICAqL1xuICBfcmVnaXN0ZXJUcmFja0lkKHRyYWNrLCB0cmFja0lkKSB7XG4gICAgaWYgKHRyYWNrSWQgIT09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLl90cmFja0J5SWRbdHJhY2tJZF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHRyYWNrSWQ6IFwiJHt0cmFja0lkfVwiIGlzIGFscmVhZHkgdXNlZGApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl90cmFja0J5SWRbdHJhY2tJZF0gPSB0cmFjaztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIHRvIGFkZCBhIGBMYXllcmAgaW5zdGFuY2UgaW50byBhIGdpdmVuIGBUcmFja2AuIElzIGRlc2lnbmVkIHRvIGJlXG4gICAqIHVzZWQgaW4gY29uam9uY3Rpb24gd2l0aCB0aGUgYFRpbWVsaW5lfmdldExheWVyc0J5R3JvdXBgIG1ldGhvZC4gVGhlXG4gICAqIGxheWVyIGlzIGludGVybmFsbHkgcmVuZGVyZWQgYW5kIHVwZGF0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7TGF5ZXJ9IGxheWVyIC0gVGhlIGBMYXllcmAgaW5zdGFuY2UgdG8gYWRkIGludG8gdGhlIHZpc3VhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7KFRyYWNrfFN0cmluZyl9IHRyYWNrT3JUcmFja0lkIC0gVGhlIGBUcmFja2AgaW5zdGFuY2UgKG9yIGl0cyBgaWRgXG4gICAqICAgIGFzIGRlZmluZWQgaW4gdGhlIGBjcmVhdGVUcmFja2AgbWV0aG9kKSB3aGVyZSB0aGUgYExheWVyYCBpbnN0YW5jZSBzaG91bGQgYmUgaW5zZXJ0ZWQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbZ3JvdXBJZD0nZGVmYXVsdCddIC0gQW4gb3B0aW9ubmFsIGdyb3VwIGlkIGluIHdoaWNoIHRoZVxuICAgKiAgICBgTGF5ZXJgIHNob3VsZCBiZSBpbnNlcnRlZC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbaXNBeGlzXSAtIFNldCB0byBgdHJ1ZWAgaWYgdGhlIGFkZGVkIGBsYXllcmAgaXMgYW5cbiAgICogICAgaW5zdGFuY2Ugb2YgYEF4aXNMYXllcmAgKHRoZXNlIGxheWVycyBzaGFyZXMgdGhlIGBUaW1saW5lVGltZUNvbnRleHRgIGluc3RhbmNlXG4gICAqICAgIG9mIHRoZSB0aW1lbGluZSkuXG4gICAqL1xuICBhZGRMYXllcihsYXllciwgdHJhY2tPclRyYWNrSWQsIGdyb3VwSWQgPSAnZGVmYXVsdCcsIGlzQXhpcyA9IGZhbHNlKSB7XG4gICAgbGV0IHRyYWNrID0gdHJhY2tPclRyYWNrSWQ7XG5cbiAgICBpZiAodHlwZW9mIHRyYWNrT3JUcmFja0lkID09PSAnc3RyaW5nJykge1xuICAgICAgdHJhY2sgPSB0aGlzLmdldFRyYWNrQnlJZCh0cmFja09yVHJhY2tJZCk7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlcyB0aGUgYExheWVyVGltZUNvbnRleHRgIGlmIG5vdCBwcmVzZW50XG4gICAgaWYgKCFsYXllci50aW1lQ29udGV4dCkge1xuICAgICAgY29uc3QgdGltZUNvbnRleHQgPSBpc0F4aXMgP1xuICAgICAgICB0aGlzLnRpbWVDb250ZXh0IDogbmV3IExheWVyVGltZUNvbnRleHQodGhpcy50aW1lQ29udGV4dCk7XG5cbiAgICAgIGxheWVyLnNldFRpbWVDb250ZXh0KHRpbWVDb250ZXh0KTtcbiAgICB9XG5cbiAgICAvLyB3ZSBzaG91bGQgaGF2ZSBhIFRyYWNrIGluc3RhbmNlIGF0IHRoaXMgcG9pbnRcbiAgICB0cmFjay5hZGQobGF5ZXIpO1xuXG4gICAgaWYgKCF0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdKSB7XG4gICAgICB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5fZ3JvdXBlZExheWVyc1tncm91cElkXS5wdXNoKGxheWVyKTtcblxuICAgIGxheWVyLnJlbmRlcigpO1xuICAgIGxheWVyLnVwZGF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBsYXllciBmcm9tIGl0cyB0cmFjay4gVGhlIGxheWVyIGlzIGRldGF0Y2hlZCBmcm9tIHRoZSBET00gYnV0XG4gICAqIGNhbiBzdGlsbCBiZSByZXVzZWQgbGF0ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7TGF5ZXJ9IGxheWVyIC0gVGhlIGxheWVyIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZUxheWVyKGxheWVyKSB7XG4gICAgdGhpcy50cmFja3MuZm9yRWFjaChmdW5jdGlvbih0cmFjaykge1xuICAgICAgY29uc3QgaW5kZXggPSB0cmFjay5sYXllcnMuaW5kZXhPZihsYXllcik7XG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7IHRyYWNrLnJlbW92ZShsYXllcik7IH1cbiAgICB9KTtcblxuICAgIC8vIGNsZWFuIHJlZmVyZW5jZXMgaW4gaGVscGVyc1xuICAgIGZvciAobGV0IGdyb3VwSWQgaW4gdGhpcy5fZ3JvdXBlZExheWVycykge1xuICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdO1xuICAgICAgY29uc3QgaW5kZXggPSBncm91cC5pbmRleE9mKGxheWVyKTtcblxuICAgICAgaWYgKGluZGV4ICE9PSAtMSkgeyBncm91cC5zcGxpY2UobGF5ZXIsIDEpOyB9XG5cbiAgICAgIGlmICghZ3JvdXAubGVuZ3RoKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgYFRyYWNrYCBpbnN0YW5jZSBmcm9tIGl0J3MgZ2l2ZW4gaWQuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0cmFja0lkXG4gICAqIEByZXR1cm4ge1RyYWNrfVxuICAgKi9cbiAgZ2V0VHJhY2tCeUlkKHRyYWNrSWQpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhY2tCeUlkW3RyYWNrSWRdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRyYWNrIGNvbnRhaW5pbmcgYSBnaXZlbiBET00gRWxlbWVudCwgcmV0dXJucyBudWxsIGlmIG5vIG1hdGNoIGZvdW5kLlxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIFRoZSBET00gRWxlbWVudCB0byBiZSB0ZXN0ZWQuXG4gICAqIEByZXR1cm4ge1RyYWNrfVxuICAgKi9cbiAgZ2V0VHJhY2tGcm9tRE9NRWxlbWVudCgkZWwpIHtcbiAgICBsZXQgJHN2ZyA9IG51bGw7XG4gICAgbGV0IHRyYWNrID0gbnVsbDtcbiAgICAvLyBmaW5kIHRoZSBjbG9zZXN0IGAudHJhY2tgIGVsZW1lbnRcbiAgICBkbyB7XG4gICAgICBpZiAoJGVsLmNsYXNzTGlzdC5jb250YWlucygndHJhY2snKSkge1xuICAgICAgICAkc3ZnID0gJGVsO1xuICAgICAgfVxuICAgICAgJGVsID0gJGVsLnBhcmVudE5vZGU7XG4gICAgfSB3aGlsZSAoJHN2ZyA9PT0gbnVsbCk7XG4gICAgLy8gZmluZCB0aGUgcmVsYXRlZCBgVHJhY2tgXG4gICAgdGhpcy50cmFja3MuZm9yRWFjaChmdW5jdGlvbihfdHJhY2spIHtcbiAgICAgIGlmIChfdHJhY2suJHN2ZyA9PT0gJHN2ZykgeyB0cmFjayA9IF90cmFjazsgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRyYWNrO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgbGF5ZXJzIGZyb20gdGhlaXIgZ2l2ZW4gZ3JvdXAgaWQuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBncm91cElkIC0gVGhlIGlkIG9mIHRoZSBncm91cCBhcyBkZWZpbmVkIGluIGBhZGRMYXllcmAuXG4gICAqIEByZXR1cm4geyhBcnJheXx1bmRlZmluZWQpfVxuICAgKi9cbiAgZ2V0TGF5ZXJzQnlHcm91cChncm91cElkKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGltZWxpbmU7XG4iXX0=