import Layer from '../core/layer';
import TracePath from '../shapes/trace-path';
import TraceDots from '../shapes/trace-dots';
import TraceBehavior from '../behaviors/trace-behavior';


/**
 * Helper to create a trace layer.
 *
 * [example usage](./examples/layer-trace.html)
 */
export default class TraceLayer extends Layer {
  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */
  constructor(data, options = {}, accessors = {}) {
    options = Object.assign({ displayDots: true }, options);
    super(options.displayDots ? 'collection' : 'entity', data, options);

    const shapeOptions = {};
    if (options.meanColor !== undefined) { shapeOptions.meanColor = options.meanColor; }
    if (options.rangeColor !== undefined) { shapeOptions.rangeColor = options.rangeColor; }
    if (options.displayMean !== undefined) { shapeOptions.displayMean = options.displayMean; }

    if (options.displayDots) {
      this.configureCommonShape(TracePath, accessors, shapeOptions);
      this.configureShape(TraceDots, accessors, shapeOptions);
    } else {
      this.configureShape(TracePath, accessors, shapeOptions);
    }

    this.setBehavior(new TraceBehavior());
  }
}