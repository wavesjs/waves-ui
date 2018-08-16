import Layer from './Layer';


/**
 * Collection hosting all the `Track` instances registered into the timeline.
 * It provides shorcuts to trigger `render` / `update` methods on tracks or
 * layers. Extend built-in Array
 */
class TrackCollection {
  constructor(timeline) {
    this._timeline = timeline;
    this._tracks = new Set();
  }

  // @note - should be in the timeline ?
  // @todo - allow to pass an array of layers
  _getLayersOrGroups(layerOrGroup = null) {
    let layers = null;

    if (typeof layerOrGroup === 'string') {
      layers = this._timeline.groupedLayers[layerOrGroup];
    } else if (layerOrGroup instanceof Layer) {
      layers = [layerOrGroup];
    } else {
      layers = this.layers;
    }

    return layers;
  }

  /**
   * @type {Number} - Updates the height of all tracks at once.
   * @todo - Propagate to layers, not usefull for now.
   */
  set height(value) {
    this._tracks.forEach((track) => track.height = value);
  }

  /**
   * An array of all registered layers.
   *
   * @type {Array<Layer>}
   */
  get layers() {
    let layers = [];
    this._tracks.forEach(track => layers = layers.concat(track.layers));

    return layers;
  }

  /**
   * Check if a given track belongs to the collection.
   *
   * @param {Track} track - Track to be tested
   * @returns {Boolean}
   */
  has(track) {
    return this._tracks.has(track);
  }

  /**
   * Add a track to the collection.
   *
   * @param {Track} track - Track to add to the collection
   */
  add(track) {
    this._tracks.add(track);
  }

  // @todo
  remove(track) {}

  forEach(callback) {
    this._tracks.forEach(callback);
  }

  /**
   * Render all tracks and layers. When done, the timeline triggers a `render` event.
   */
  render() {
    this._tracks.forEach(track => track.render());
    this._timeline.emit('render');
  }

  /**
   * Updates all tracks and layers. When done, the timeline triggers a
   * `update` event.
   *
   * @todo - filtering is probably broken...
   * @param {Layer|String} layerOrGroup - Filter the layers to update by
   *    passing the `Layer` instance to update or a `groupId`
   */
  update(layerOrGroup) {
    const layers = this._getLayersOrGroups(layerOrGroup);
    this._tracks.forEach(track => track.update(layers));
    this._timeline.emit('update', layers);
  }

  /**
   * Updates all `Track` containers, layers are not updated with this method.
   * When done, the timeline triggers a `update:containers` event.
   */
  updateContainer(/* trackOrTrackIds */) {
    this._tracks.forEach(track => track.updateContainer());
    this._timeline.emit('update:containers');
  }

  /**
   * Updates all layers. When done, the timeline triggers a `update:layers` event.
   *
   * @todo - filtering is probably broken...
   * @param {Layer|String} layerOrGroup - Filter the layers to update by
   *    passing the `Layer` instance to update or a `groupId`
   */
  updateLayers(layerOrGroup) {
    const layers = this._getLayersOrGroups(layerOrGroup);
    this._tracks.forEach(track => track.updateLayers(layers));
    this._timeline.emit('update:layers', layers);
  }
}

export default TrackCollection;
