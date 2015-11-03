import Layer from '../core/layer';
import AnnotatedSegment from '../shapes/annotated-segment';
import SegmentBehavior from '../behaviors/segment-behavior';


/**
 * Helper to create a annotated segment layer.
 *
 * [example usage](./examples/layer-segment.html)
 */
export default class AnnotatedSegmentLayer extends Layer {
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

    this.configureShape(AnnotatedSegment, accessors, {
      displayHandlers: options.displayHandlers,
      opacity: options.opacity,
    });

    this.setBehavior(new SegmentBehavior());
  }
}
