import Layer from '../core/Layer';
import Marker from '../shapes/Marker';
import MarkerBehavior from '../behaviors/MarkerBehavior';


/**
 * Helper to create a marker layer.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */
class MarkerLayer extends Layer {
  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */
  constructor(data, options = {}, accessors = {}) {
    super('collection', data, options);

    options = Object.assign({
      displayHandlers: true,
      displayLabels: false,
    }, options);

    const color = options.color;

    if (color)
      accessors.color = () => color;

    this.configureShape(Marker, accessors, {
      displayHandlers: options.displayHandlers,
      opacity: options.opacity,
    });

    this.setBehavior(new MarkerBehavior());
  }
}

export default MarkerLayer;
