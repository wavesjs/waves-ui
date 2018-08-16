import Layer from '../core/Layer';
import Segment from '../shapes/Segment';
import SegmentBehavior from '../behaviors/SegmentBehavior';


/**
 * Helper to create a segment layer.
 *
 * [example usage](./examples/layer-segment.html)
 */
class SegmentLayer extends Layer {
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
      opacity: 0.6
    }, options);

    this.configureShape(Segment, accessors, {
      displayHandlers: options.displayHandlers,
      opacity: options.opacity,
    });

    this.setBehavior(new SegmentBehavior());
  }
}

export default SegmentLayer;
