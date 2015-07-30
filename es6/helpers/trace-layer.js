import Layer from '../core/layer';
import TraceCommon from '../shapes/trace-common';
import TraceDots from '../shapes/trace-dots';
import TraceBehavior form '../behaviors/trace-behavior';


export default class TraceLayer extends Layer {
  constructor(data, options = {}, accessors = {}) {
    options = Object.assign({ displayDots: true }, options);
    const type = options.displayDots ? 'collection' : 'entity'

    super(type, data, options);

    if (options.displayDots) {
      this.configureCommonShape(TraceCommon, accessors, {});
      this.configureShape(TraceDots)
    }


  }
}