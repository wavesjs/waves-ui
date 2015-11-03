import events from 'events';

import Keyboard from '../interactions/keyboard';
import LayerTimeContext from './layer-time-context';
import Surface from '../interactions/surface';
import TimelineTimeContext from './timeline-time-context';
import Track from './track';
import TrackCollection from './track-collection';


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
export default class Timeline extends events.EventEmitter {
  /**
   * @param {Number} [pixelsPerSecond=100] - the default scaling between time and pixels.
   * @param {Number} [visibleWidth=1000] - the default visible area for all registered tracks.
   */
  constructor(pixelsPerSecond = 100, visibleWidth = 1000, {
    registerKeyboard = true
  } = {}) {

    super();

    this._tracks = new TrackCollection(this);
    this._state = null;

    // default interactions
    this._surfaceCtor = Surface;

    if (registerKeyboard) {
      this.createInteraction(Keyboard, document);
    }

    // stores
    this._trackById = {};
    this._groupedLayers = {};

    /** @type {TimelineTimeContext} - master time context for the visualization. */
    this.timeContext = new TimelineTimeContext(pixelsPerSecond, visibleWidth);
  }

  /**
   * Returns `TimelineTimeContext`'s `offset` time domain value.
   *
   * @type {Number} [offset=0]
   */
  get offset() {
    return this.timeContext.offset;
  }

  /**
   * Updates `TimelineTimeContext`'s `offset` time domain value.
   *
   * @type {Number} [offset=0]
   */
  set offset(value) {
    this.timeContext.offset = value;
  }

  /**
   * Returns the `TimelineTimeContext`'s `zoom` value.
   *
   * @type {Number} [offset=0]
   */
  get zoom() {
    return this.timeContext.zoom;
  }

  /**
   * Updates the `TimelineTimeContext`'s `zoom` value.
   *
   * @type {Number} [offset=0]
   */
  set zoom(value) {
    this.timeContext.zoom = value;
  }

  /**
   * Returns the `TimelineTimeContext`'s `pixelsPerSecond` ratio.
   *
   * @type {Number} [offset=0]
   */
  get pixelsPerSecond() {
    return this.timeContext.pixelsPerSecond;
  }

  /**
   * Updates the `TimelineTimeContext`'s `pixelsPerSecond` ratio.
   *
   * @type {Number} [offset=0]
   */
  set pixelsPerSecond(value) {
    this.timeContext.pixelsPerSecond = value;
  }

  /**
   * Returns the `TimelineTimeContext`'s `visibleWidth` pixel domain value.
   *
   * @type {Number} [offset=0]
   */
  get visibleWidth() {
    return this.timeContext.visibleWidth;
  }

  /**
   * Updates the `TimelineTimeContext`'s `visibleWidth` pixel domain value.
   *
   * @type {Number} [offset=0]
   */
  set visibleWidth(value) {
    this.timeContext.visibleWidth = value;
  }

  /**
   * Returns `TimelineTimeContext`'s `timeToPixel` transfert function.
   *
   * @type {Function}
   */
  get timeToPixel() {
    return this.timeContext.timeToPixel;
  }

  /**
   * Returns `TimelineTimeContext`'s `visibleDuration` helper value.
   *
   * @type {Number}
   */
  get visibleDuration() {
    return this.timeContext.visibleDuration;
  }

  /**
   * Updates the `TimelineTimeContext`'s `maintainVisibleDuration` value.
   * Defines if the duration of the visible area should be maintain when
   * the `visibleWidth` attribute is updated.
   *
   * @type {Boolean}
   */
  set maintainVisibleDuration(bool) {
    this.timeContext.maintainVisibleDuration = bool;
  }

  /**
   * Returns `TimelineTimeContext`'s `maintainVisibleDuration` current value.
   *
   * @type {Boolean}
   */
  get maintainVisibleDuration() {
    return this.timeContext.maintainVisibleDuration;
  }

  /**
   * Object maintaining arrays of `Layer` instances ordered by their `groupId`.
   * Is used internally by the `TrackCollection` instance.
   *
   * @type {Object}
   */
  get groupedLayers() {
    return this._groupedLayers;
  }

  /**
   * Overrides the default `Surface` that is instanciated on each `Track`
   * instance. This methos should be called before adding any `Track` instance
   * to the current `timeline`.
   *
   * @param {EventSource} ctor - The constructor to use in order to catch mouse
   *    events on each `Track` instances.
   */
  configureSurface(ctor) {
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
  createInteraction(ctor, $el, options = {}) {
    const interaction = new ctor($el, options);
    interaction.on('event', (e) => this._handleEvent(e));
  }

  /**
   * Returns a list of the layers situated under the position of a `WaveEvent`.
   *
   * @param {WavesEvent} e - An event triggered by a `WaveEvent`
   * @return {Array} - Matched layers
   */
  getHitLayers(e) {
    const clientX = e.originalEvent.clientX;
    const clientY = e.originalEvent.clientY;
    let layers = [];

    this.layers.forEach((layer) => {
      if (!layer.params.hittable) { return; }
      const br = layer.$el.getBoundingClientRect();

      if (
        clientX > br.left && clientX < br.right &&
        clientY > br.top && clientY < br.bottom
      ) {
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
  _handleEvent(e) {
    const hitLayers = (e.source === 'surface') ?
      this.getHitLayers(e) : null;
    // emit event as a middleware
    this.emit('event', e, hitLayers);
    // propagate to the state
    if (!this._state) { return; }
    this._state.handleEvent(e, hitLayers);
  }

  /**
   * Updates the state of the timeline.
   *
   * @type {BaseState}
   */
  set state(state) {
    if (this._state) { this._state.exit(); }
    this._state = state;
    if (this._state) { this._state.enter(); }
  }

  /**
   * Returns the current state of the timeline.
   *
   * @type {BaseState}
   */
  get state() {
    return this._state;
  }

  /**
   * Returns the `TrackCollection` instance.
   *
   * @type {TrackCollection}
   */
  get tracks() {
    return this._tracks;
  }

  /**
   * Returns the list of all registered layers.
   *
   * @type {Array}
   */
  get layers() {
    return this._tracks.layers;
  }

  /**
   * Adds a new track to the timeline.
   *
   * @param {Track} track - The new track to be registered in the timeline.
   * @param {String} [trackId=null] - Optionnal unique id to associate with
   *    the track, this id only exists in timeline's context and should be used
   *    in conjonction with `addLayer` method.
   */
  add(track, trackId = null) {
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
  remove(track) {
    // should destroy interaction too, avoid ghost eventListeners
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
  createTrack($el, trackHeight = 100, trackId = null) {
    const track = new Track($el, trackHeight);
    // Add track to the timeline
    this.add(track, trackId);
    track.render();
    track.update();

    return track;
  }

  /**
   * If track id is defined, associate a track with a unique id.
   */
  _registerTrackId(track, trackId) {
    if (trackId !== null) {
      if (this._trackById[trackId] !== undefined) {
        throw new Error(`trackId: "${trackId}" is already used`);
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
  addLayer(layer, trackOrTrackId, groupId = 'default', isAxis = false) {
    let track = trackOrTrackId;

    if (typeof trackOrTrackId === 'string') {
      track = this.getTrackById(trackOrTrackId);
    }

    // creates the `LayerTimeContext` if not present
    if (!layer.timeContext) {
      const timeContext = isAxis ?
        this.timeContext : new LayerTimeContext(this.timeContext);

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
  removeLayer(layer) {
    this.tracks.forEach(function(track) {
      const index = track.layers.indexOf(layer);
      if (index !== -1) { track.remove(layer); }
    });

    // clean references in helpers
    for (let groupId in this._groupedLayers) {
      const group = this._groupedLayers[groupId];
      const index = group.indexOf(layer);

      if (index !== -1) { group.splice(layer, 1); }

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
  getTrackById(trackId) {
    return this._trackById[trackId];
  }

  /**
   * Returns the track containing a given DOM Element, returns null if no match found.
   *
   * @param {Element} $el - The DOM Element to be tested.
   * @return {Track}
   */
  getTrackFromDOMElement($el) {
    let $svg = null;
    let track = null;
    // find the closest `.track` element
    do {
      if ($el.classList.contains('track')) {
        $svg = $el;
      }
      $el = $el.parentNode;
    } while ($svg === null);
    // find the related `Track`
    this.tracks.forEach(function(_track) {
      if (_track.$svg === $svg) { track = _track; }
    });

    return track;
  }

  /**
   * Returns an array of layers from their given group id.
   *
   * @param {String} groupId - The id of the group as defined in `addLayer`.
   * @return {(Array|undefined)}
   */
  getLayersByGroup(groupId) {
    return this._groupedLayers[groupId];
  }

  /**
   * Iterates through the added tracks.
   */
  *[Symbol.iterator]() {
    yield* this.tracks[Symbol.iterator]();
  }
}
