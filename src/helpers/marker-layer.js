import Layer from '../core/layer';
import Marker from '../shapes/marker';
import MarkerBehavior from '../behaviors/marker-behavior';


/**
 * Helper to create a marker layer.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */
export default class MarkerLayer extends Layer {
  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */
  constructor(data, options = {}, accessors = {}) {
    super('collection', data, options);

    options = Object.assign({ displayHandlers: true }, options);
    const color = options.color;
    if (color) {
      accessors.color = function() { return color; };
    }

    this.configureShape(Marker, accessors, {
      displayHandlers: options.displayHandlers
    });

    this.setBehavior(new MarkerBehavior());
  }
}
