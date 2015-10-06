import Layer from './layer';


/**
 * The `TrackCollection` class allow to update all timeline's tracks at once
 */
export default class TrackCollection extends Array {
  constructor(timeline) {
    super();

    this._timeline = timeline;
  }

  // @TODO
  // this should be in the timeline
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

  set height(value) {
    this.forEach((track) => track.height = value);
  }

  // access layers
  get layers() {
    let layers = [];
    this.forEach((track) => layers = layers.concat(track.layers));

    return layers;
  }

  render() {
    this.forEach((track) => track.render());
    this._timeline.emit('render');
  }

  // should be update(...layersOrGroups)
  update(layerOrGroup) {
    const layers = this._getLayersOrGroups(layerOrGroup);
    this.forEach((track) => track.update(layers));
    this._timeline.emit('update', layers);
  }

  updateContainer(trackOrTrackIds) {
    this.forEach((track) => track.updateContainer());
    this._timeline.emit('update:containers');
  }

  updateLayers(layerOrGroup) {
    const layers = this._getLayersOrGroups(layerOrGroup);
    this.forEach((track) => track.updateLayers(layers));
    this._timeline.emit('update:layers', layers);
  }
}
