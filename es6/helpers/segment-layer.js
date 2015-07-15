import Layer from '../core/layer';
import Segment from '../shapes/segment';
import SegmentBehavior from '../behaviors/segment-behavior';


export default class SegmentLayer extends Layer {
  constructor(dataType, data, options = {}) {
    super(dataType, data, options)
    this.configureShape(Segment);
    this.setBehavior(new SegmentBehavior());
  }
}
