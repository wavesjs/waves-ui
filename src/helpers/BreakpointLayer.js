import Layer from '../core/Layer';
import Dot from '../shapes/Dot';
import Line from '../shapes/Line';
import BreakpointBehavior from '../behaviors/BreakpointBehavior';


/**
 * Helper to create a breakpoint function layer.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */
class BreakpointLayer extends Layer {
  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */
  constructor(data, options = {}, accessors = {}) {
    super('collection', data, options);

    const color = options.color;
    let commonShapeOptions = {};

    if (color) {
      accessors.color = function() { return color; };
      commonShapeOptions.color = color;
    }

    this.configureCommonShape(Line, accessors, commonShapeOptions);
    this.configureShape(Dot, accessors, {});
    this.setBehavior(new BreakpointBehavior());
  }
}

export default BreakpointLayer;
