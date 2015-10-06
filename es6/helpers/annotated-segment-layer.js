import Layer from '../core/layer';
import AnnotatedSegment from '../shapes/annotated-segment';
import SegmentBehavior from '../behaviors/segment-behavior';


export default class AnnotatedSegmentLayer extends Layer {
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
