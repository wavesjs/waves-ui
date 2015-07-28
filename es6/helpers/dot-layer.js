import BreakpointBehavior from '../behaviors/breakpoint-behavior';
import Dot from '../shapes/dot';
import Layer from '../core/layer';


export default class DotLayer extends Layer {
  constructor(data, options = {}, accessors = {}) {
    super('collection', data, options);

    this.configureShape(Dot);
    this.setBehavior(new BreakpointBehavior());
  }
}
