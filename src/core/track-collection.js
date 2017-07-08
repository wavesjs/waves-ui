import Layer from './layer';


/**
 * Collection hosting all the `Track` instances registered into the timeline.
 * It provides shorcuts to trigger `render` / `update` methods on tracks or
 * layers. Extend built-in Array
 */
export default class TrackCollection extends Array {
  constructor(timeline) {
    super();

    this._timeline = timeline;
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

  // @NOTE keep this ?
  // could prepare some vertical resizing ability
  // this should be able to modify the layers yScale to be really usefull

  /**
   * @type {Number} - Updates the height of all tracks at once.
   * @todo - Propagate to layers, not usefull for now.
   */
  set height(value) {
    this.forEach((track) => track.height = value);
  }

  /**
   * An array of all registered layers.
   *
   * @type {Array<Layer>}
   */
  get layers() {
    let layers = [];
    this.forEach((track) => layers = layers.concat(track.layers));

    return layers;
  }

  /**
   * Render all tracks and layers. When done, the timeline triggers a `render` event.
   */
  render() {
    this.forEach((track) => track.render());
    this._timeline.emit('render');
  }

  /**
   * Updates all tracks and layers. When done, the timeline triggers a
   * `update` event.
   *
   * @param {Layer|String} layerOrGroup - Filter the layers to update by
   *    passing the `Layer` instance to update or a `groupId`
   */
  update(layerOrGroup) {
    const layers = this._getLayersOrGroups(layerOrGroup);
    this.forEach((track) => track.update(layers));
    this._timeline.emit('update', layers);
  }

  /**
   * Updates all `Track` containers, layers are not updated with this method.
   * When done, the timeline triggers a `update:containers` event.
   */
  updateContainer(/* trackOrTrackIds */) {
    this.forEach((track) => track.updateContainer());
    this._timeline.emit('update:containers');
  }

  /**
   * Updates all layers. When done, the timeline triggers a `update:layers` event.
   *
   * @param {Layer|String} layerOrGroup - Filter the layers to update by
   *    passing the `Layer` instance to update or a `groupId`
   */
  updateLayers(layerOrGroup) {
    const layers = this._getLayersOrGroups(layerOrGroup);
    this.forEach((track) => track.updateLayers(layers));
    this._timeline.emit('update:layers', layers);
  }
}
