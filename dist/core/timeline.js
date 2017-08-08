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

var _keyboard = require('../interactions/keyboard');

var _keyboard2 = _interopRequireDefault(_keyboard);

var _layerTimeContext = require('./layer-time-context');

var _layerTimeContext2 = _interopRequireDefault(_layerTimeContext);

var _surface = require('../interactions/surface');

var _surface2 = _interopRequireDefault(_surface);

var _timelineTimeContext = require('./timeline-time-context');

var _timelineTimeContext2 = _interopRequireDefault(_timelineTimeContext);

var _track2 = require('./track');

var _track3 = _interopRequireDefault(_track2);

var _trackCollection = require('./track-collection');

var _trackCollection2 = _interopRequireDefault(_trackCollection);

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

    _this._tracks = new _trackCollection2.default(_this);
    _this._state = null;

    // default interactions
    _this._surfaceCtor = _surface2.default;

    // stores
    _this._trackById = {};
    _this._groupedLayers = {};
    _this._$elInteractionsMap = new _map2.default();

    /** @type {TimelineTimeContext} - master time context for the visualization. */
    _this.timeContext = new _timelineTimeContext2.default(pixelsPerSecond, visibleWidth);

    if (registerKeyboard) _this.createInteraction(_keyboard2.default, document);
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

      var track = new _track3.default($el, trackHeight);
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
        var timeContext = isAxis ? this.timeContext : new _layerTimeContext2.default(this.timeContext);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpbWVsaW5lLmpzIl0sIm5hbWVzIjpbIlRpbWVsaW5lIiwicGl4ZWxzUGVyU2Vjb25kIiwidmlzaWJsZVdpZHRoIiwicmVnaXN0ZXJLZXlib2FyZCIsIl90cmFja3MiLCJfc3RhdGUiLCJfc3VyZmFjZUN0b3IiLCJfdHJhY2tCeUlkIiwiX2dyb3VwZWRMYXllcnMiLCJfJGVsSW50ZXJhY3Rpb25zTWFwIiwidGltZUNvbnRleHQiLCJjcmVhdGVJbnRlcmFjdGlvbiIsImRvY3VtZW50IiwiY3RvciIsIiRlbCIsIm9wdGlvbnMiLCJpbnRlcmFjdGlvbiIsIm9uIiwiZSIsIl9oYW5kbGVFdmVudCIsImhhcyIsInNldCIsImludGVyYWN0aW9uU2V0IiwiZ2V0IiwiYWRkIiwiY2xpZW50WCIsIm9yaWdpbmFsRXZlbnQiLCJjbGllbnRZIiwibGF5ZXJzIiwiZm9yRWFjaCIsImxheWVyIiwicGFyYW1zIiwiaGl0dGFibGUiLCJib3VuZGluZ1JlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJsZWZ0IiwicmlnaHQiLCJ0b3AiLCJib3R0b20iLCJwdXNoIiwiaGl0TGF5ZXJzIiwic291cmNlIiwiZ2V0SGl0TGF5ZXJzIiwiZW1pdCIsImhhbmRsZUV2ZW50IiwidHJhY2siLCJ0cmFja0lkIiwidHJhY2tzIiwiRXJyb3IiLCJfcmVnaXN0ZXJUcmFja0lkIiwiY29uZmlndXJlIiwiaW50ZXJhY3Rpb25zIiwiZGVzdHJveSIsInRyYWNrSGVpZ2h0IiwicmVuZGVyIiwidXBkYXRlIiwidW5kZWZpbmVkIiwidHJhY2tPclRyYWNrSWQiLCJncm91cElkIiwiaXNBeGlzIiwiZ2V0VHJhY2tCeUlkIiwic2V0VGltZUNvbnRleHQiLCJpbmRleCIsImluZGV4T2YiLCJyZW1vdmUiLCJncm91cCIsInNwbGljZSIsImxlbmd0aCIsIiRzdmciLCJjbGFzc0xpc3QiLCJjb250YWlucyIsInBhcmVudE5vZGUiLCJfdHJhY2siLCJvZmZzZXQiLCJ2YWx1ZSIsInpvb20iLCJ0aW1lVG9QaXhlbCIsInZpc2libGVEdXJhdGlvbiIsImJvb2wiLCJtYWludGFpblZpc2libGVEdXJhdGlvbiIsInN0YXRlIiwiZXhpdCIsImVudGVyIiwiRXZlbnRFbWl0dGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEyQk1BLFE7OztBQUNKOzs7O0FBSUEsc0JBRVE7QUFBQSxRQUZJQyxlQUVKLHVFQUZzQixHQUV0QjtBQUFBLFFBRjJCQyxZQUUzQix1RUFGMEMsSUFFMUM7O0FBQUEsbUZBQUosRUFBSTtBQUFBLHFDQUROQyxnQkFDTTtBQUFBLFFBRE5BLGdCQUNNLHlDQURhLElBQ2I7O0FBQUE7O0FBQUE7O0FBR04sVUFBS0MsT0FBTCxHQUFlLG9DQUFmO0FBQ0EsVUFBS0MsTUFBTCxHQUFjLElBQWQ7O0FBRUE7QUFDQSxVQUFLQyxZQUFMOztBQUVBO0FBQ0EsVUFBS0MsVUFBTCxHQUFrQixFQUFsQjtBQUNBLFVBQUtDLGNBQUwsR0FBc0IsRUFBdEI7QUFDQSxVQUFLQyxtQkFBTCxHQUEyQixtQkFBM0I7O0FBRUE7QUFDQSxVQUFLQyxXQUFMLEdBQW1CLGtDQUF3QlQsZUFBeEIsRUFBeUNDLFlBQXpDLENBQW5COztBQUVBLFFBQUlDLGdCQUFKLEVBQ0UsTUFBS1EsaUJBQUwscUJBQWlDQyxRQUFqQztBQWxCSTtBQW1CUDs7QUFFRDs7Ozs7Ozs7Ozs7QUF3SEE7Ozs7Ozs7O3FDQVFpQkMsSSxFQUFNO0FBQ3JCLFdBQUtQLFlBQUwsR0FBb0JPLElBQXBCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7c0NBVWtCQSxJLEVBQU1DLEcsRUFBbUI7QUFBQTs7QUFBQSxVQUFkQyxPQUFjLHVFQUFKLEVBQUk7O0FBQ3pDLFVBQU1DLGNBQWMsSUFBSUgsSUFBSixDQUFTQyxHQUFULEVBQWNDLE9BQWQsQ0FBcEI7QUFDQUMsa0JBQVlDLEVBQVosQ0FBZSxPQUFmLEVBQXdCLFVBQUNDLENBQUQ7QUFBQSxlQUFPLE9BQUtDLFlBQUwsQ0FBa0JELENBQWxCLENBQVA7QUFBQSxPQUF4Qjs7QUFFQTtBQUNBLFVBQUksQ0FBQyxLQUFLVCxtQkFBTCxDQUF5QlcsR0FBekIsQ0FBNkJOLEdBQTdCLENBQUwsRUFDRSxLQUFLTCxtQkFBTCxDQUF5QlksR0FBekIsQ0FBNkJQLEdBQTdCLEVBQWtDLG1CQUFsQzs7QUFFRixVQUFNUSxpQkFBaUIsS0FBS2IsbUJBQUwsQ0FBeUJjLEdBQXpCLENBQTZCVCxHQUE3QixDQUF2QjtBQUNBUSxxQkFBZUUsR0FBZixDQUFtQlIsV0FBbkI7QUFDRDs7QUFFRDs7Ozs7Ozs7O2lDQU1hRSxDLEVBQUc7QUFDZCxVQUFNTyxVQUFVUCxFQUFFUSxhQUFGLENBQWdCRCxPQUFoQztBQUNBLFVBQU1FLFVBQVVULEVBQUVRLGFBQUYsQ0FBZ0JDLE9BQWhDO0FBQ0EsVUFBSUMsU0FBUyxFQUFiOztBQUVBLFdBQUtBLE1BQUwsQ0FBWUMsT0FBWixDQUFvQixVQUFDQyxLQUFELEVBQVc7QUFDN0IsWUFBSSxDQUFDQSxNQUFNQyxNQUFOLENBQWFDLFFBQWxCLEVBQTRCO0FBQUU7QUFBUztBQUN2QyxZQUFNQyxlQUFlSCxNQUFNaEIsR0FBTixDQUFVb0IscUJBQVYsRUFBckI7O0FBRUEsWUFDRVQsVUFBVVEsYUFBYUUsSUFBdkIsSUFBK0JWLFVBQVVRLGFBQWFHLEtBQXRELElBQ0FULFVBQVVNLGFBQWFJLEdBRHZCLElBQzhCVixVQUFVTSxhQUFhSyxNQUZ2RCxFQUdFO0FBQ0FWLGlCQUFPVyxJQUFQLENBQVlULEtBQVo7QUFDRDtBQUNGLE9BVkQ7O0FBWUEsYUFBT0YsTUFBUDtBQUNEOztBQUVEOzs7Ozs7OztpQ0FLYVYsQyxFQUFHO0FBQ2QsVUFBTXNCLFlBQWF0QixFQUFFdUIsTUFBRixLQUFhLFNBQWQsR0FBMkIsS0FBS0MsWUFBTCxDQUFrQnhCLENBQWxCLENBQTNCLEdBQWtELElBQXBFO0FBQ0E7QUFDQSxXQUFLeUIsSUFBTCxDQUFVLE9BQVYsRUFBbUJ6QixDQUFuQixFQUFzQnNCLFNBQXRCO0FBQ0E7QUFDQSxVQUFJLEtBQUtuQyxNQUFULEVBQ0UsS0FBS0EsTUFBTCxDQUFZdUMsV0FBWixDQUF3QjFCLENBQXhCLEVBQTJCc0IsU0FBM0I7QUFDSDs7QUFFRDs7Ozs7Ozs7OztBQTBDQTs7Ozs7Ozs7d0JBUUlLLEssRUFBdUI7QUFBQSxVQUFoQkMsT0FBZ0IsdUVBQU4sSUFBTTs7QUFDekIsVUFBSSxLQUFLQyxNQUFMLENBQVkzQixHQUFaLENBQWdCeUIsS0FBaEIsQ0FBSixFQUNFLE1BQU0sSUFBSUcsS0FBSixDQUFVLHFDQUFWLENBQU47O0FBRUYsV0FBS0MsZ0JBQUwsQ0FBc0JKLEtBQXRCLEVBQTZCQyxPQUE3QjtBQUNBRCxZQUFNSyxTQUFOLENBQWdCLEtBQUt4QyxXQUFyQjs7QUFFQSxXQUFLcUMsTUFBTCxDQUFZdkIsR0FBWixDQUFnQnFCLEtBQWhCO0FBQ0EsV0FBS2xDLGlCQUFMLENBQXVCLEtBQUtMLFlBQTVCLEVBQTBDdUMsTUFBTS9CLEdBQWhEO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzsyQkFNTytCLEssRUFBTztBQUNaO0FBQ0EsVUFBTS9CLE1BQU0rQixNQUFNL0IsR0FBbEI7QUFDQSxVQUFNcUMsZUFBZSxLQUFLMUMsbUJBQUwsQ0FBeUJjLEdBQXpCLENBQTZCVCxHQUE3QixDQUFyQjs7QUFFQSxVQUFJcUMsWUFBSixFQUNFQSxhQUFhdEIsT0FBYixDQUFxQjtBQUFBLGVBQWViLFlBQVlvQyxPQUFaLEVBQWY7QUFBQSxPQUFyQjs7QUFFRlAsWUFBTU8sT0FBTjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7OztnQ0FXWXRDLEcsRUFBd0M7QUFBQSxVQUFuQ3VDLFdBQW1DLHVFQUFyQixHQUFxQjtBQUFBLFVBQWhCUCxPQUFnQix1RUFBTixJQUFNOztBQUNsRCxVQUFNRCxRQUFRLG9CQUFVL0IsR0FBVixFQUFldUMsV0FBZixDQUFkO0FBQ0E7QUFDQSxXQUFLN0IsR0FBTCxDQUFTcUIsS0FBVCxFQUFnQkMsT0FBaEI7QUFDQUQsWUFBTVMsTUFBTjtBQUNBVCxZQUFNVSxNQUFOOztBQUVBLGFBQU9WLEtBQVA7QUFDRDs7QUFFRDs7Ozs7O3FDQUdpQkEsSyxFQUFPQyxPLEVBQVM7QUFDL0IsVUFBSUEsWUFBWSxJQUFoQixFQUFzQjtBQUNwQixZQUFJLEtBQUt2QyxVQUFMLENBQWdCdUMsT0FBaEIsTUFBNkJVLFNBQWpDLEVBQTRDO0FBQzFDLGdCQUFNLElBQUlSLEtBQUosZ0JBQXVCRixPQUF2Qix1QkFBTjtBQUNEOztBQUVELGFBQUt2QyxVQUFMLENBQWdCdUMsT0FBaEIsSUFBMkJELEtBQTNCO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7NkJBY1NmLEssRUFBTzJCLGMsRUFBcUQ7QUFBQSxVQUFyQ0MsT0FBcUMsdUVBQTNCLFNBQTJCO0FBQUEsVUFBaEJDLE1BQWdCLHVFQUFQLEtBQU87O0FBQ25FLFVBQUlkLFFBQVFZLGNBQVo7O0FBRUEsVUFBSSxPQUFPQSxjQUFQLEtBQTBCLFFBQTlCLEVBQXdDO0FBQ3RDWixnQkFBUSxLQUFLZSxZQUFMLENBQWtCSCxjQUFsQixDQUFSO0FBQ0Q7O0FBRUQ7QUFDQSxVQUFJLENBQUMzQixNQUFNcEIsV0FBWCxFQUF3QjtBQUN0QixZQUFNQSxjQUFjaUQsU0FDbEIsS0FBS2pELFdBRGEsR0FDQywrQkFBcUIsS0FBS0EsV0FBMUIsQ0FEckI7O0FBR0FvQixjQUFNK0IsY0FBTixDQUFxQm5ELFdBQXJCO0FBQ0Q7O0FBRUQ7QUFDQW1DLFlBQU1yQixHQUFOLENBQVVNLEtBQVY7O0FBRUEsVUFBSSxDQUFDLEtBQUt0QixjQUFMLENBQW9Ca0QsT0FBcEIsQ0FBTCxFQUFtQztBQUNqQyxhQUFLbEQsY0FBTCxDQUFvQmtELE9BQXBCLElBQStCLEVBQS9CO0FBQ0Q7O0FBRUQsV0FBS2xELGNBQUwsQ0FBb0JrRCxPQUFwQixFQUE2Qm5CLElBQTdCLENBQWtDVCxLQUFsQzs7QUFFQUEsWUFBTXdCLE1BQU47QUFDQXhCLFlBQU15QixNQUFOO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OztnQ0FNWXpCLEssRUFBTztBQUNqQixXQUFLaUIsTUFBTCxDQUFZbEIsT0FBWixDQUFvQixVQUFTZ0IsS0FBVCxFQUFnQjtBQUNsQyxZQUFNaUIsUUFBUWpCLE1BQU1qQixNQUFOLENBQWFtQyxPQUFiLENBQXFCakMsS0FBckIsQ0FBZDtBQUNBLFlBQUlnQyxVQUFVLENBQUMsQ0FBZixFQUFrQjtBQUFFakIsZ0JBQU1tQixNQUFOLENBQWFsQyxLQUFiO0FBQXNCO0FBQzNDLE9BSEQ7O0FBS0E7QUFDQSxXQUFLLElBQUk0QixPQUFULElBQW9CLEtBQUtsRCxjQUF6QixFQUF5QztBQUN2QyxZQUFNeUQsUUFBUSxLQUFLekQsY0FBTCxDQUFvQmtELE9BQXBCLENBQWQ7QUFDQSxZQUFNSSxRQUFRRyxNQUFNRixPQUFOLENBQWNqQyxLQUFkLENBQWQ7O0FBRUEsWUFBSWdDLFVBQVUsQ0FBQyxDQUFmLEVBQWtCO0FBQUVHLGdCQUFNQyxNQUFOLENBQWFwQyxLQUFiLEVBQW9CLENBQXBCO0FBQXlCOztBQUU3QyxZQUFJLENBQUNtQyxNQUFNRSxNQUFYLEVBQW1CO0FBQ2pCLGlCQUFPLEtBQUszRCxjQUFMLENBQW9Ca0QsT0FBcEIsQ0FBUDtBQUNEO0FBQ0Y7QUFDRjs7QUFFRDs7Ozs7Ozs7O2lDQU1hWixPLEVBQVM7QUFDcEIsYUFBTyxLQUFLdkMsVUFBTCxDQUFnQnVDLE9BQWhCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7OzJDQU11QmhDLEcsRUFBSztBQUMxQixVQUFJc0QsT0FBTyxJQUFYO0FBQ0EsVUFBSXZCLFFBQVEsSUFBWjtBQUNBO0FBQ0EsU0FBRztBQUNELFlBQUkvQixJQUFJdUQsU0FBSixDQUFjQyxRQUFkLENBQXVCLE9BQXZCLENBQUosRUFBcUM7QUFDbkNGLGlCQUFPdEQsR0FBUDtBQUNEO0FBQ0RBLGNBQU1BLElBQUl5RCxVQUFWO0FBQ0QsT0FMRCxRQUtTSCxTQUFTLElBTGxCO0FBTUE7QUFDQSxXQUFLckIsTUFBTCxDQUFZbEIsT0FBWixDQUFvQixVQUFTMkMsTUFBVCxFQUFpQjtBQUNuQyxZQUFJQSxPQUFPSixJQUFQLEtBQWdCQSxJQUFwQixFQUEwQjtBQUFFdkIsa0JBQVEyQixNQUFSO0FBQWlCO0FBQzlDLE9BRkQ7O0FBSUEsYUFBTzNCLEtBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7O3FDQU1pQmEsTyxFQUFTO0FBQ3hCLGFBQU8sS0FBS2xELGNBQUwsQ0FBb0JrRCxPQUFwQixDQUFQO0FBQ0Q7Ozt3QkExWlk7QUFDWCxhQUFPLEtBQUtoRCxXQUFMLENBQWlCK0QsTUFBeEI7QUFDRDs7QUFFRDs7Ozs7O3NCQUtXQyxLLEVBQU87QUFDaEIsV0FBS2hFLFdBQUwsQ0FBaUIrRCxNQUFqQixHQUEwQkMsS0FBMUI7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBS1c7QUFDVCxhQUFPLEtBQUtoRSxXQUFMLENBQWlCaUUsSUFBeEI7QUFDRDs7QUFFRDs7Ozs7O3NCQUtTRCxLLEVBQU87QUFDZCxXQUFLaEUsV0FBTCxDQUFpQmlFLElBQWpCLEdBQXdCRCxLQUF4QjtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLc0I7QUFDcEIsYUFBTyxLQUFLaEUsV0FBTCxDQUFpQlQsZUFBeEI7QUFDRDs7QUFFRDs7Ozs7O3NCQUtvQnlFLEssRUFBTztBQUN6QixXQUFLaEUsV0FBTCxDQUFpQlQsZUFBakIsR0FBbUN5RSxLQUFuQztBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLbUI7QUFDakIsYUFBTyxLQUFLaEUsV0FBTCxDQUFpQlIsWUFBeEI7QUFDRDs7QUFFRDs7Ozs7O3NCQUtpQndFLEssRUFBTztBQUN0QixXQUFLaEUsV0FBTCxDQUFpQlIsWUFBakIsR0FBZ0N3RSxLQUFoQztBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLa0I7QUFDaEIsYUFBTyxLQUFLaEUsV0FBTCxDQUFpQmtFLFdBQXhCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUtzQjtBQUNwQixhQUFPLEtBQUtsRSxXQUFMLENBQWlCbUUsZUFBeEI7QUFDRDs7QUFFRDs7Ozs7Ozs7OztzQkFPNEJDLEksRUFBTTtBQUNoQyxXQUFLcEUsV0FBTCxDQUFpQnFFLHVCQUFqQixHQUEyQ0QsSUFBM0M7QUFDRDs7QUFFRDs7Ozs7O3dCQUs4QjtBQUM1QixhQUFPLEtBQUtwRSxXQUFMLENBQWlCcUUsdUJBQXhCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozt3QkFNb0I7QUFDbEIsYUFBTyxLQUFLdkUsY0FBWjtBQUNEOzs7c0JBaUZTd0UsSyxFQUFPO0FBQ2YsVUFBSSxLQUFLM0UsTUFBVCxFQUNFLEtBQUtBLE1BQUwsQ0FBWTRFLElBQVo7O0FBRUYsV0FBSzVFLE1BQUwsR0FBYzJFLEtBQWQ7O0FBRUEsVUFBSSxLQUFLM0UsTUFBVCxFQUNFLEtBQUtBLE1BQUwsQ0FBWTZFLEtBQVo7QUFDSDs7QUFFRDs7Ozs7O3dCQUtZO0FBQ1YsYUFBTyxLQUFLN0UsTUFBWjtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLYTtBQUNYLGFBQU8sS0FBS0QsT0FBWjtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLYTtBQUNYLGFBQU8sS0FBS0EsT0FBTCxDQUFhd0IsTUFBcEI7QUFDRDs7O0VBdFFvQixpQkFBT3VELFk7O2tCQThiZm5GLFEiLCJmaWxlIjoidGltZWxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5cbmltcG9ydCBLZXlib2FyZCBmcm9tICcuLi9pbnRlcmFjdGlvbnMva2V5Ym9hcmQnO1xuaW1wb3J0IExheWVyVGltZUNvbnRleHQgZnJvbSAnLi9sYXllci10aW1lLWNvbnRleHQnO1xuaW1wb3J0IFN1cmZhY2UgZnJvbSAnLi4vaW50ZXJhY3Rpb25zL3N1cmZhY2UnO1xuaW1wb3J0IFRpbWVsaW5lVGltZUNvbnRleHQgZnJvbSAnLi90aW1lbGluZS10aW1lLWNvbnRleHQnO1xuaW1wb3J0IFRyYWNrIGZyb20gJy4vdHJhY2snO1xuaW1wb3J0IFRyYWNrQ29sbGVjdGlvbiBmcm9tICcuL3RyYWNrLWNvbGxlY3Rpb24nO1xuXG5cbi8qKlxuICogSXMgdGhlIG1haW4gZW50cnkgcG9pbnQgdG8gY3JlYXRlIGEgdGVtcG9yYWwgdmlzdWFsaXphdGlvbi5cbiAqXG4gKiBBIGB0aW1lbGluZWAgaW5zdGFuY2UgbWFpbmx5IHByb3ZpZGVzIHRoZSBjb250ZXh0IGZvciBhbnkgdmlzdWFsaXphdGlvbiBvZlxuICogdGVtcG9yYWwgZGF0YSBhbmQgbWFpbnRhaW5zIHRoZSBoaWVyYXJjaHkgb2YgYFRyYWNrYCwgYExheWVyYCBhbmQgYFNoYXBlYFxuICogb3ZlciB0aGUgZW50aWVyZSB2aXN1YWxpc2F0aW9uLlxuICpcbiAqIEl0cyBtYWluIHJlc3BvbnNhYmlsaXRlcyBhcmU6XG4gKiAtIG1haW50YWluaW5nIHRoZSB0ZW1wb3JhbCBjb25zaXN0ZW5jeSBhY2Nyb3NzIHRoZSB2aXN1YWxpc2F0aW9uIHRocm91Z2hcbiAqICAgaXRzIGB0aW1lQ29udGV4dGAgcHJvcGVydHkgKGluc3RhbmNlIG9mIGBUaW1lbGluZVRpbWVDb250ZXh0YCkuXG4gKiAtIGhhbmRsaW5nIGludGVyYWN0aW9ucyB0byBpdHMgY3VycmVudCBzdGF0ZSAoYWN0aW5nIGhlcmUgYXMgYSBzaW1wbGVcbiAqICAgc3RhdGUgbWFjaGluZSkuXG4gKlxuICogQFRPRE8gaW5zZXJ0IGZpZ3VyZVxuICpcbiAqIEl0IGFsc28gY29udGFpbnMgYSByZWZlcmVuY2UgdG8gYWxsIHRoZSByZWdpc3RlciB0cmFjayBhbGxvd2luZyB0byBgcmVuZGVyYFxuICogb3IgYHVwZGF0ZWAgYWxsIHRoZSBsYXllciBmcm9tIGEgc2luZ2xlIGVudHJ5IHBvaW50LlxuICpcbiAqICMjIEV4YW1wbGUgVXNhZ2VcbiAqXG4gKiBgYGBqc1xuICogY29uc3QgdmlzaWJsZVdpZHRoID0gNTAwOyAvLyBkZWZhdWx0IHdpZHRoIGluIHBpeGVscyBmb3IgYWxsIGNyZWF0ZWQgYFRyYWNrYFxuICogY29uc3QgZHVyYXRpb24gPSAxMDsgLy8gdGhlIHZpc2libGUgYXJlYSByZXByZXNlbnRzIDEwIHNlY29uZHNcbiAqIGNvbnN0IHBpeGVsc1BlclNlY29uZHMgPSB2aXNpYmxlV2lkdGggLyBkdXJhdGlvbjtcbiAqIGNvbnN0IHRpbWVsaW5lID0gbmV3IHVpLmNvcmUuVGltZWxpbmUocGl4ZWxzUGVyU2Vjb25kLCB3aWR0aCk7XG4gKiBgYGBcbiAqL1xuY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbcGl4ZWxzUGVyU2Vjb25kPTEwMF0gLSB0aGUgZGVmYXVsdCBzY2FsaW5nIGJldHdlZW4gdGltZSBhbmQgcGl4ZWxzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3Zpc2libGVXaWR0aD0xMDAwXSAtIHRoZSBkZWZhdWx0IHZpc2libGUgYXJlYSBmb3IgYWxsIHJlZ2lzdGVyZWQgdHJhY2tzLlxuICAgKi9cbiAgY29uc3RydWN0b3IocGl4ZWxzUGVyU2Vjb25kID0gMTAwLCB2aXNpYmxlV2lkdGggPSAxMDAwLCB7XG4gICAgcmVnaXN0ZXJLZXlib2FyZCA9IHRydWVcbiAgfSA9IHt9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX3RyYWNrcyA9IG5ldyBUcmFja0NvbGxlY3Rpb24odGhpcyk7XG4gICAgdGhpcy5fc3RhdGUgPSBudWxsO1xuXG4gICAgLy8gZGVmYXVsdCBpbnRlcmFjdGlvbnNcbiAgICB0aGlzLl9zdXJmYWNlQ3RvciA9IFN1cmZhY2U7XG5cbiAgICAvLyBzdG9yZXNcbiAgICB0aGlzLl90cmFja0J5SWQgPSB7fTtcbiAgICB0aGlzLl9ncm91cGVkTGF5ZXJzID0ge307XG4gICAgdGhpcy5fJGVsSW50ZXJhY3Rpb25zTWFwID0gbmV3IE1hcCgpO1xuXG4gICAgLyoqIEB0eXBlIHtUaW1lbGluZVRpbWVDb250ZXh0fSAtIG1hc3RlciB0aW1lIGNvbnRleHQgZm9yIHRoZSB2aXN1YWxpemF0aW9uLiAqL1xuICAgIHRoaXMudGltZUNvbnRleHQgPSBuZXcgVGltZWxpbmVUaW1lQ29udGV4dChwaXhlbHNQZXJTZWNvbmQsIHZpc2libGVXaWR0aCk7XG5cbiAgICBpZiAocmVnaXN0ZXJLZXlib2FyZClcbiAgICAgIHRoaXMuY3JlYXRlSW50ZXJhY3Rpb24oS2V5Ym9hcmQsIGRvY3VtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGBvZmZzZXRgIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfSBbb2Zmc2V0PTBdXG4gICAqL1xuICBnZXQgb2Zmc2V0KCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0Lm9mZnNldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGBvZmZzZXRgIHRpbWUgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfSBbb2Zmc2V0PTBdXG4gICAqL1xuICBzZXQgb2Zmc2V0KHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC5vZmZzZXQgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgem9vbWAgdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9IFtvZmZzZXQ9MF1cbiAgICovXG4gIGdldCB6b29tKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0Lnpvb207XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYHpvb21gIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfSBbb2Zmc2V0PTBdXG4gICAqL1xuICBzZXQgem9vbSh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQuem9vbSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGBwaXhlbHNQZXJTZWNvbmRgIHJhdGlvLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfSBbb2Zmc2V0PTBdXG4gICAqL1xuICBnZXQgcGl4ZWxzUGVyU2Vjb25kKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnBpeGVsc1BlclNlY29uZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgcGl4ZWxzUGVyU2Vjb25kYCByYXRpby5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn0gW29mZnNldD0wXVxuICAgKi9cbiAgc2V0IHBpeGVsc1BlclNlY29uZCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQucGl4ZWxzUGVyU2Vjb25kID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYHZpc2libGVXaWR0aGAgcGl4ZWwgZG9tYWluIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfSBbb2Zmc2V0PTBdXG4gICAqL1xuICBnZXQgdmlzaWJsZVdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnZpc2libGVXaWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgdmlzaWJsZVdpZHRoYCBwaXhlbCBkb21haW4gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9IFtvZmZzZXQ9MF1cbiAgICovXG4gIHNldCB2aXNpYmxlV2lkdGgodmFsdWUpIHtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnZpc2libGVXaWR0aCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYFRpbWVsaW5lVGltZUNvbnRleHRgJ3MgYHRpbWVUb1BpeGVsYCB0cmFuc2ZlcnQgZnVuY3Rpb24uXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIGdldCB0aW1lVG9QaXhlbCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC50aW1lVG9QaXhlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGB2aXNpYmxlRHVyYXRpb25gIGhlbHBlciB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCB2aXNpYmxlRHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQudmlzaWJsZUR1cmF0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCdzIGBtYWludGFpblZpc2libGVEdXJhdGlvbmAgdmFsdWUuXG4gICAqIERlZmluZXMgaWYgdGhlIGR1cmF0aW9uIG9mIHRoZSB2aXNpYmxlIGFyZWEgc2hvdWxkIGJlIG1haW50YWluIHdoZW5cbiAgICogdGhlIGB2aXNpYmxlV2lkdGhgIGF0dHJpYnV0ZSBpcyB1cGRhdGVkLlxuICAgKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHNldCBtYWludGFpblZpc2libGVEdXJhdGlvbihib29sKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC5tYWludGFpblZpc2libGVEdXJhdGlvbiA9IGJvb2w7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgVGltZWxpbmVUaW1lQ29udGV4dGAncyBgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb25gIGN1cnJlbnQgdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgZ2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0Lm1haW50YWluVmlzaWJsZUR1cmF0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIE9iamVjdCBtYWludGFpbmluZyBhcnJheXMgb2YgYExheWVyYCBpbnN0YW5jZXMgb3JkZXJlZCBieSB0aGVpciBgZ3JvdXBJZGAuXG4gICAqIElzIHVzZWQgaW50ZXJuYWxseSBieSB0aGUgYFRyYWNrQ29sbGVjdGlvbmAgaW5zdGFuY2UuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICBnZXQgZ3JvdXBlZExheWVycygpIHtcbiAgICByZXR1cm4gdGhpcy5fZ3JvdXBlZExheWVycztcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZXMgdGhlIGRlZmF1bHQgYFN1cmZhY2VgIHRoYXQgaXMgaW5zdGFuY2lhdGVkIG9uIGVhY2ggYFRyYWNrYFxuICAgKiBpbnN0YW5jZS4gVGhpcyBtZXRob3Mgc2hvdWxkIGJlIGNhbGxlZCBiZWZvcmUgYWRkaW5nIGFueSBgVHJhY2tgIGluc3RhbmNlXG4gICAqIHRvIHRoZSBjdXJyZW50IGB0aW1lbGluZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnRTb3VyY2V9IGN0b3IgLSBUaGUgY29uc3RydWN0b3IgdG8gdXNlIGluIG9yZGVyIHRvIGNhdGNoIG1vdXNlXG4gICAqICAgIGV2ZW50cyBvbiBlYWNoIGBUcmFja2AgaW5zdGFuY2VzLlxuICAgKi9cbiAgY29uZmlndXJlU3VyZmFjZShjdG9yKSB7XG4gICAgdGhpcy5fc3VyZmFjZUN0b3IgPSBjdG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIEZhY3RvcnkgbWV0aG9kIHRvIGFkZCBpbnRlcmFjdGlvbiBtb2R1bGVzIHRoZSB0aW1lbGluZSBzaG91bGQgbGlzdGVuIHRvLlxuICAgKiBCeSBkZWZhdWx0LCB0aGUgdGltZWxpbmUgaW5zdGFuY2lhdGUgYSBnbG9iYWwgYEtleWJvYXJkYCBpbnN0YW5jZSBhbmQgYVxuICAgKiBgU3VyZmFjZWAgaW5zdGFuY2Ugb24gZWFjaCBjb250YWluZXIuXG4gICAqIFNob3VsZCBiZSB1c2VkIHRvIGluc3RhbGwgbmV3IGludGVyYWN0aW9ucyBpbXBsZW1lbnRpbmcgdGhlIGBFdmVudFNvdXJjZWAgaW50ZXJmYWNlLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50U291cmNlfSBjdG9yIC0gVGhlIGNvbnRydWN0b3Igb2YgdGhlIGludGVyYWN0aW9uIG1vZHVsZSB0byBpbnN0YW5jaWF0ZS5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkZWwgLSBUaGUgRE9NIGVsZW1lbnQgd2hpY2ggd2lsbCBiZSBiaW5kZWQgdG8gdGhlIGBFdmVudFNvdXJjZWAgbW9kdWxlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIC0gT3B0aW9ucyB0byBiZSBhcHBsaWVkIHRvIHRoZSBgY3RvcmAuXG4gICAqL1xuICBjcmVhdGVJbnRlcmFjdGlvbihjdG9yLCAkZWwsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGludGVyYWN0aW9uID0gbmV3IGN0b3IoJGVsLCBvcHRpb25zKTtcbiAgICBpbnRlcmFjdGlvbi5vbignZXZlbnQnLCAoZSkgPT4gdGhpcy5faGFuZGxlRXZlbnQoZSkpO1xuXG4gICAgLy8gc3RvcmUgaW50ZXJhY3Rpb24gYXNzb2NpYXRlZCB0byB0aGUgRE9NIGVsZW1lbnRcbiAgICBpZiAoIXRoaXMuXyRlbEludGVyYWN0aW9uc01hcC5oYXMoJGVsKSlcbiAgICAgIHRoaXMuXyRlbEludGVyYWN0aW9uc01hcC5zZXQoJGVsLCBuZXcgU2V0KCkpO1xuXG4gICAgY29uc3QgaW50ZXJhY3Rpb25TZXQgPSB0aGlzLl8kZWxJbnRlcmFjdGlvbnNNYXAuZ2V0KCRlbCk7XG4gICAgaW50ZXJhY3Rpb25TZXQuYWRkKGludGVyYWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbGlzdCBvZiB0aGUgbGF5ZXJzIHNpdHVhdGVkIHVuZGVyIHRoZSBwb3NpdGlvbiBvZiBhIGBXYXZlRXZlbnRgLlxuICAgKlxuICAgKiBAcGFyYW0ge1dhdmVzRXZlbnR9IGUgLSBBbiBldmVudCB0cmlnZ2VyZWQgYnkgYSBgV2F2ZUV2ZW50YFxuICAgKiBAcmV0dXJuIHtBcnJheX0gLSBNYXRjaGVkIGxheWVyc1xuICAgKi9cbiAgZ2V0SGl0TGF5ZXJzKGUpIHtcbiAgICBjb25zdCBjbGllbnRYID0gZS5vcmlnaW5hbEV2ZW50LmNsaWVudFg7XG4gICAgY29uc3QgY2xpZW50WSA9IGUub3JpZ2luYWxFdmVudC5jbGllbnRZO1xuICAgIGxldCBsYXllcnMgPSBbXTtcblxuICAgIHRoaXMubGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBpZiAoIWxheWVyLnBhcmFtcy5oaXR0YWJsZSkgeyByZXR1cm47IH1cbiAgICAgIGNvbnN0IGJvdW5kaW5nUmVjdCA9IGxheWVyLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgaWYgKFxuICAgICAgICBjbGllbnRYID4gYm91bmRpbmdSZWN0LmxlZnQgJiYgY2xpZW50WCA8IGJvdW5kaW5nUmVjdC5yaWdodCAmJlxuICAgICAgICBjbGllbnRZID4gYm91bmRpbmdSZWN0LnRvcCAmJiBjbGllbnRZIDwgYm91bmRpbmdSZWN0LmJvdHRvbVxuICAgICAgKSB7XG4gICAgICAgIGxheWVycy5wdXNoKGxheWVyKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBsYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNhbGxiYWNrIHRoYXQgaXMgdXNlZCB0byBsaXN0ZW4gdG8gaW50ZXJhY3Rpb25zIG1vZHVsZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7V2F2ZUV2ZW50fSBlIC0gQW4gZXZlbnQgZ2VuZXJhdGVkIGJ5IGFuIGludGVyYWN0aW9uIG1vZHVsZXMgKGBFdmVudFNvdXJjZWApLlxuICAgKi9cbiAgX2hhbmRsZUV2ZW50KGUpIHtcbiAgICBjb25zdCBoaXRMYXllcnMgPSAoZS5zb3VyY2UgPT09ICdzdXJmYWNlJykgPyB0aGlzLmdldEhpdExheWVycyhlKSA6IG51bGw7XG4gICAgLy8gZW1pdCBldmVudCBhcyBhIG1pZGRsZXdhcmVcbiAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZSwgaGl0TGF5ZXJzKTtcbiAgICAvLyBwcm9wYWdhdGUgdG8gdGhlIHN0YXRlXG4gICAgaWYgKHRoaXMuX3N0YXRlKVxuICAgICAgdGhpcy5fc3RhdGUuaGFuZGxlRXZlbnQoZSwgaGl0TGF5ZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBzdGF0ZSBvZiB0aGUgdGltZWxpbmUuXG4gICAqXG4gICAqIEB0eXBlIHtCYXNlU3RhdGV9XG4gICAqL1xuICBzZXQgc3RhdGUoc3RhdGUpIHtcbiAgICBpZiAodGhpcy5fc3RhdGUpXG4gICAgICB0aGlzLl9zdGF0ZS5leGl0KCk7XG5cbiAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuXG4gICAgaWYgKHRoaXMuX3N0YXRlKVxuICAgICAgdGhpcy5fc3RhdGUuZW50ZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSB0aW1lbGluZS5cbiAgICpcbiAgICogQHR5cGUge0Jhc2VTdGF0ZX1cbiAgICovXG4gIGdldCBzdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRyYWNrQ29sbGVjdGlvbmAgaW5zdGFuY2UuXG4gICAqXG4gICAqIEB0eXBlIHtUcmFja0NvbGxlY3Rpb259XG4gICAqL1xuICBnZXQgdHJhY2tzKCkge1xuICAgIHJldHVybiB0aGlzLl90cmFja3M7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbGlzdCBvZiBhbGwgcmVnaXN0ZXJlZCBsYXllcnMuXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICovXG4gIGdldCBsYXllcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYWNrcy5sYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG5ldyB0cmFjayB0byB0aGUgdGltZWxpbmUuXG4gICAqXG4gICAqIEBwYXJhbSB7VHJhY2t9IHRyYWNrIC0gVGhlIG5ldyB0cmFjayB0byBiZSByZWdpc3RlcmVkIGluIHRoZSB0aW1lbGluZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFt0cmFja0lkPW51bGxdIC0gT3B0aW9ubmFsIHVuaXF1ZSBpZCB0byBhc3NvY2lhdGUgd2l0aFxuICAgKiAgICB0aGUgdHJhY2ssIHRoaXMgaWQgb25seSBleGlzdHMgaW4gdGltZWxpbmUncyBjb250ZXh0IGFuZCBzaG91bGQgYmUgdXNlZFxuICAgKiAgICBpbiBjb25qb25jdGlvbiB3aXRoIGBhZGRMYXllcmAgbWV0aG9kLlxuICAgKi9cbiAgYWRkKHRyYWNrLCB0cmFja0lkID0gbnVsbCkge1xuICAgIGlmICh0aGlzLnRyYWNrcy5oYXModHJhY2spKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCd0cmFjayBhbHJlYWR5IGFkZGVkIHRvIHRoZSB0aW1lbGluZScpO1xuXG4gICAgdGhpcy5fcmVnaXN0ZXJUcmFja0lkKHRyYWNrLCB0cmFja0lkKTtcbiAgICB0cmFjay5jb25maWd1cmUodGhpcy50aW1lQ29udGV4dCk7XG5cbiAgICB0aGlzLnRyYWNrcy5hZGQodHJhY2spO1xuICAgIHRoaXMuY3JlYXRlSW50ZXJhY3Rpb24odGhpcy5fc3VyZmFjZUN0b3IsIHRyYWNrLiRlbCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIHRyYWNrIGZyb20gdGhlIHRpbWVsaW5lLlxuICAgKlxuICAgKiBAcGFyYW0ge1RyYWNrfSB0cmFjayAtIHRoZSB0cmFjayB0byByZW1vdmUgZnJvbSB0aGUgdGltZWxpbmUuXG4gICAqIEB0b2RvIG5vdCBpbXBsZW1lbnRlZC5cbiAgICovXG4gIHJlbW92ZSh0cmFjaykge1xuICAgIC8vIHNob3VsZCBkZXN0cm95IGFsbCBpbnRlcmFjdGlvbnMgdG9vLCBhdm9pZCBnaG9zdCBldmVudExpc3RlbmVyc1xuICAgIGNvbnN0ICRlbCA9IHRyYWNrLiRlbDtcbiAgICBjb25zdCBpbnRlcmFjdGlvbnMgPSB0aGlzLl8kZWxJbnRlcmFjdGlvbnNNYXAuZ2V0KCRlbCk7XG5cbiAgICBpZiAoaW50ZXJhY3Rpb25zKVxuICAgICAgaW50ZXJhY3Rpb25zLmZvckVhY2goaW50ZXJhY3Rpb24gPT4gaW50ZXJhY3Rpb24uZGVzdHJveSgpKTtcblxuICAgIHRyYWNrLmRlc3Ryb3koKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgdG8gY3JlYXRlIGEgbmV3IGBUcmFja2AgaW5zdGFuY2UuIFRoZSBgdHJhY2tgIGlzIGFkZGVkLFxuICAgKiByZW5kZXJlZCBhbmQgdXBkYXRlZCBiZWZvcmUgYmVpbmcgcmV0dXJuZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsIC0gVGhlIERPTSBlbGVtZW50IHdoZXJlIHRoZSB0cmFjayBzaG91bGQgYmUgaW5zZXJ0ZWQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0cmFja0hlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIG5ld2x5IGNyZWF0ZWQgdHJhY2suXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbdHJhY2tJZD1udWxsXSAtIE9wdGlvbm5hbCB1bmlxdWUgaWQgdG8gYXNzb2NpYXRlIHdpdGhcbiAgICogICAgdGhlIHRyYWNrLCB0aGlzIGlkIG9ubHkgZXhpc3RzIGluIHRpbWVsaW5lJ3MgY29udGV4dCBhbmQgc2hvdWxkIGJlIHVzZWQgaW5cbiAgICogICAgY29uam9uY3Rpb24gd2l0aCBgYWRkTGF5ZXJgIG1ldGhvZC5cbiAgICogQHJldHVybiB7VHJhY2t9XG4gICAqL1xuICBjcmVhdGVUcmFjaygkZWwsIHRyYWNrSGVpZ2h0ID0gMTAwLCB0cmFja0lkID0gbnVsbCkge1xuICAgIGNvbnN0IHRyYWNrID0gbmV3IFRyYWNrKCRlbCwgdHJhY2tIZWlnaHQpO1xuICAgIC8vIEFkZCB0cmFjayB0byB0aGUgdGltZWxpbmVcbiAgICB0aGlzLmFkZCh0cmFjaywgdHJhY2tJZCk7XG4gICAgdHJhY2sucmVuZGVyKCk7XG4gICAgdHJhY2sudXBkYXRlKCk7XG5cbiAgICByZXR1cm4gdHJhY2s7XG4gIH1cblxuICAvKipcbiAgICogSWYgdHJhY2sgaWQgaXMgZGVmaW5lZCwgYXNzb2NpYXRlIGEgdHJhY2sgd2l0aCBhIHVuaXF1ZSBpZC5cbiAgICovXG4gIF9yZWdpc3RlclRyYWNrSWQodHJhY2ssIHRyYWNrSWQpIHtcbiAgICBpZiAodHJhY2tJZCAhPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuX3RyYWNrQnlJZFt0cmFja0lkXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgdHJhY2tJZDogXCIke3RyYWNrSWR9XCIgaXMgYWxyZWFkeSB1c2VkYCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3RyYWNrQnlJZFt0cmFja0lkXSA9IHRyYWNrO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgdG8gYWRkIGEgYExheWVyYCBpbnN0YW5jZSBpbnRvIGEgZ2l2ZW4gYFRyYWNrYC4gSXMgZGVzaWduZWQgdG8gYmVcbiAgICogdXNlZCBpbiBjb25qb25jdGlvbiB3aXRoIHRoZSBgVGltZWxpbmV+Z2V0TGF5ZXJzQnlHcm91cGAgbWV0aG9kLiBUaGVcbiAgICogbGF5ZXIgaXMgaW50ZXJuYWxseSByZW5kZXJlZCBhbmQgdXBkYXRlZC5cbiAgICpcbiAgICogQHBhcmFtIHtMYXllcn0gbGF5ZXIgLSBUaGUgYExheWVyYCBpbnN0YW5jZSB0byBhZGQgaW50byB0aGUgdmlzdWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHsoVHJhY2t8U3RyaW5nKX0gdHJhY2tPclRyYWNrSWQgLSBUaGUgYFRyYWNrYCBpbnN0YW5jZSAob3IgaXRzIGBpZGBcbiAgICogICAgYXMgZGVmaW5lZCBpbiB0aGUgYGNyZWF0ZVRyYWNrYCBtZXRob2QpIHdoZXJlIHRoZSBgTGF5ZXJgIGluc3RhbmNlIHNob3VsZCBiZSBpbnNlcnRlZC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtncm91cElkPSdkZWZhdWx0J10gLSBBbiBvcHRpb25uYWwgZ3JvdXAgaWQgaW4gd2hpY2ggdGhlXG4gICAqICAgIGBMYXllcmAgc2hvdWxkIGJlIGluc2VydGVkLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtpc0F4aXNdIC0gU2V0IHRvIGB0cnVlYCBpZiB0aGUgYWRkZWQgYGxheWVyYCBpcyBhblxuICAgKiAgICBpbnN0YW5jZSBvZiBgQXhpc0xheWVyYCAodGhlc2UgbGF5ZXJzIHNoYXJlcyB0aGUgYFRpbWxpbmVUaW1lQ29udGV4dGAgaW5zdGFuY2VcbiAgICogICAgb2YgdGhlIHRpbWVsaW5lKS5cbiAgICovXG4gIGFkZExheWVyKGxheWVyLCB0cmFja09yVHJhY2tJZCwgZ3JvdXBJZCA9ICdkZWZhdWx0JywgaXNBeGlzID0gZmFsc2UpIHtcbiAgICBsZXQgdHJhY2sgPSB0cmFja09yVHJhY2tJZDtcblxuICAgIGlmICh0eXBlb2YgdHJhY2tPclRyYWNrSWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cmFjayA9IHRoaXMuZ2V0VHJhY2tCeUlkKHRyYWNrT3JUcmFja0lkKTtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGVzIHRoZSBgTGF5ZXJUaW1lQ29udGV4dGAgaWYgbm90IHByZXNlbnRcbiAgICBpZiAoIWxheWVyLnRpbWVDb250ZXh0KSB7XG4gICAgICBjb25zdCB0aW1lQ29udGV4dCA9IGlzQXhpcyA/XG4gICAgICAgIHRoaXMudGltZUNvbnRleHQgOiBuZXcgTGF5ZXJUaW1lQ29udGV4dCh0aGlzLnRpbWVDb250ZXh0KTtcblxuICAgICAgbGF5ZXIuc2V0VGltZUNvbnRleHQodGltZUNvbnRleHQpO1xuICAgIH1cblxuICAgIC8vIHdlIHNob3VsZCBoYXZlIGEgVHJhY2sgaW5zdGFuY2UgYXQgdGhpcyBwb2ludFxuICAgIHRyYWNrLmFkZChsYXllcik7XG5cbiAgICBpZiAoIXRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF0pIHtcbiAgICAgIHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF0gPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLl9ncm91cGVkTGF5ZXJzW2dyb3VwSWRdLnB1c2gobGF5ZXIpO1xuXG4gICAgbGF5ZXIucmVuZGVyKCk7XG4gICAgbGF5ZXIudXBkYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGxheWVyIGZyb20gaXRzIHRyYWNrLiBUaGUgbGF5ZXIgaXMgZGV0YXRjaGVkIGZyb20gdGhlIERPTSBidXRcbiAgICogY2FuIHN0aWxsIGJlIHJldXNlZCBsYXRlci5cbiAgICpcbiAgICogQHBhcmFtIHtMYXllcn0gbGF5ZXIgLSBUaGUgbGF5ZXIgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlTGF5ZXIobGF5ZXIpIHtcbiAgICB0aGlzLnRyYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKHRyYWNrKSB7XG4gICAgICBjb25zdCBpbmRleCA9IHRyYWNrLmxheWVycy5pbmRleE9mKGxheWVyKTtcbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHsgdHJhY2sucmVtb3ZlKGxheWVyKTsgfVxuICAgIH0pO1xuXG4gICAgLy8gY2xlYW4gcmVmZXJlbmNlcyBpbiBoZWxwZXJzXG4gICAgZm9yIChsZXQgZ3JvdXBJZCBpbiB0aGlzLl9ncm91cGVkTGF5ZXJzKSB7XG4gICAgICBjb25zdCBncm91cCA9IHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF07XG4gICAgICBjb25zdCBpbmRleCA9IGdyb3VwLmluZGV4T2YobGF5ZXIpO1xuXG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7IGdyb3VwLnNwbGljZShsYXllciwgMSk7IH1cblxuICAgICAgaWYgKCFncm91cC5sZW5ndGgpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2dyb3VwZWRMYXllcnNbZ3JvdXBJZF07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBgVHJhY2tgIGluc3RhbmNlIGZyb20gaXQncyBnaXZlbiBpZC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRyYWNrSWRcbiAgICogQHJldHVybiB7VHJhY2t9XG4gICAqL1xuICBnZXRUcmFja0J5SWQodHJhY2tJZCkge1xuICAgIHJldHVybiB0aGlzLl90cmFja0J5SWRbdHJhY2tJZF07XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdHJhY2sgY29udGFpbmluZyBhIGdpdmVuIERPTSBFbGVtZW50LCByZXR1cm5zIG51bGwgaWYgbm8gbWF0Y2ggZm91bmQuXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGVsIC0gVGhlIERPTSBFbGVtZW50IHRvIGJlIHRlc3RlZC5cbiAgICogQHJldHVybiB7VHJhY2t9XG4gICAqL1xuICBnZXRUcmFja0Zyb21ET01FbGVtZW50KCRlbCkge1xuICAgIGxldCAkc3ZnID0gbnVsbDtcbiAgICBsZXQgdHJhY2sgPSBudWxsO1xuICAgIC8vIGZpbmQgdGhlIGNsb3Nlc3QgYC50cmFja2AgZWxlbWVudFxuICAgIGRvIHtcbiAgICAgIGlmICgkZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCd0cmFjaycpKSB7XG4gICAgICAgICRzdmcgPSAkZWw7XG4gICAgICB9XG4gICAgICAkZWwgPSAkZWwucGFyZW50Tm9kZTtcbiAgICB9IHdoaWxlICgkc3ZnID09PSBudWxsKTtcbiAgICAvLyBmaW5kIHRoZSByZWxhdGVkIGBUcmFja2BcbiAgICB0aGlzLnRyYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKF90cmFjaykge1xuICAgICAgaWYgKF90cmFjay4kc3ZnID09PSAkc3ZnKSB7IHRyYWNrID0gX3RyYWNrOyB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdHJhY2s7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBsYXllcnMgZnJvbSB0aGVpciBnaXZlbiBncm91cCBpZC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGdyb3VwSWQgLSBUaGUgaWQgb2YgdGhlIGdyb3VwIGFzIGRlZmluZWQgaW4gYGFkZExheWVyYC5cbiAgICogQHJldHVybiB7KEFycmF5fHVuZGVmaW5lZCl9XG4gICAqL1xuICBnZXRMYXllcnNCeUdyb3VwKGdyb3VwSWQpIHtcbiAgICByZXR1cm4gdGhpcy5fZ3JvdXBlZExheWVyc1tncm91cElkXTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUaW1lbGluZTtcbiJdfQ==