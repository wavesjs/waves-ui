import AnnotatedMarker from '../shapes/annotated-marker';
import Layer from '../core/layer';
import MarkerBehavior from '../behaviors/marker-behavior';


/**
 * Helper to create a annotated marker layer
 *
 * [example usage](./examples/layer-marker.html)
 */
export default class AnnotatedMarkerLayer extends Layer {
  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @todo - Add accessors and options for the shape.
   */
  constructor(data, options = {}) {
    super('collection', data, options);

    this.configureShape(AnnotatedMarker);
    this.setBehavior(new MarkerBehavior());
  }
}
