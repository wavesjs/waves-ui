import Layer from '../core/layer';
import Ticks from '../shapes/ticks';


/**
 * Helper to create a tick layer. Can be seen as a grid axis with user defined data
 * or as a marker layer with entity based data.
 */
export default class TickLayer extends Layer {
  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */
  constructor(data, options, accessors) {
    options = Object.assign({

    }, options);

    super('entity', data, options);

    const config = options.color ? { color: options.color } : undefined;
    this.configureShape(Ticks, accessors, config);
  }
}