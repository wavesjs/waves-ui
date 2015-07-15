import Layer from './layer';
import Timeline from './timeline';


/**
 * The enhanced-timeline rendering methods
 *
 * The rendering process is distinct from adding or modifying data or their time-contexts.
 * `drawLayersShapes` will draw the shapes on all the layers (render dom element for newly created data)
 * `update` (and sub-methods `updateTimelineContainers`, `updateLayersContainers` and `updateLayersShapes`) will keep the display up-to-date with the data and the time-contexts (timeline timeContext and layers timeContext).
 */

export default class EnhancedTimeline extends Timeline {
  constructor(){
    super();
    this.layers = [];
    this.groupedLayers = {}; // group layer by categories
    this._layerContainerMap = new Map();
  }

  /**
   * Adds a `Layer` to the Timeline
   * @param layer {Layer} the layer to register
   * @param containerId {String} a valid id of a previsouly registered container
   * @param group {String} insert the layer into some user defined group of layers
   * @param timeContext {TimeContext} a `TimeContext` the layer is associated with
   *     if null given, a new `TimeContext` will be created for the layer
   */
  addLayer(layer, view, group = 'default') {
    this.views.set(view, this.views.get(view).push(layer));
    this._layerContainerMap.set(layer, view);
    this.layers.push(layer);
    this.view.add(layer);

    if (!this.groupedLayers[group]) {
      this.groupedLayers[group] = [];
    }
    this.groupedLayers[group].push(layer);
  }

  /**
   * Remove a layer from the timeline
   * @param layer {Layer} the layer to remove
   * @TODO test
   */
  removeLayer(layer) {
    const container = this._layerContainerMap.get(layer);

    this.layers.splice(this.layers.indexOf(layer), 1);
    this._layerContainerMap.delete(layer);

    // remove from groupedLayers
    for (let key in this.groupedLayers) {
      const group = this.groupedLayers[key];
      const index = group.indexOf(layer);

      if (index !== -1) {
        group.splice(index, 1);
      }
      // if group is empty, delete it
      if (group.length === 0) {
        delete this.groupedLayers[key];
      }
    }

    // remove layer from its container
    container.layoutElement.removeChild(layer.container);
  }

  // @NOTE change to `getContainer(el || id || layer)` ?
  getContainerFromDOMElement(el) {
    for (let id in this.containers) {
      const container = this.containers[id];
      if (container.DOMElement === el) { return container; }
    }

    return null;
  }

  /**
   * Returns an array of layers given some group
   * @param group {String} name of the group
   * @return {Array} an array of layers which belongs to the group
   */
  getLayersFromGroup(group = 'default') {
    return this.groupedLayers[group] || [];
  }

  getLayerContainer(layer) {
    return this._layerContainerMap.get(layer);
  }

  // getContainerPerId(id) {
  //   return this.containers[id];
  // }

  // -----------------------------------------------

  /**
   * @param layerOrGroup {mixed} defaults null
   * @return an array of layers
   */
  _getLayers(layerOrGroup = null) {
    let layers = null;

    if (typeof layerOrGroup === 'string') {
      layers = this.groupedLayers[layerOrGroup];
    } else if (layerOrGroup instanceof Layer) {
      layers = [layerOrGroup];
    } else {
      layers = this.layers;
    }

    return layers;
  }

  /**
   * Draw all the layers in the timeline
   */
  drawLayersShapes(layerOrGroup = null) {
    const layers = this._getLayers(layerOrGroup);
    layers.forEach((layer) => layer.drawShapes());
  }

  // updateLayersContainers(layerOrGroup = null) {
  //   const layers = this._getLayers(layerOrGroup);
  //   layers.forEach((layer) => layer.updateContainer());
  // }

  // updateLayersShapes(layerOrGroup = null) {
  //   const layers = this._getLayers(layerOrGroup);
  //   layers.forEach((layer) => layer.updateShapes());
  // }
  update(layerOrGroup = null) {
    const layers = this._getLayers(layerOrGroup);

    for(let view of this){
      view.update()
    }
    //this.updateLayersContainers(layerOrGroup);
    //this.updateLayersShapes(layerOrGroup);

    this.emit('update', layers);
  }
}
