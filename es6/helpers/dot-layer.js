import Layer from '../core/layer';
import Dot from '../shapes/dot';
import BreakpointBehavior from '../behaviors/breakpoint-behavior';


export default class DotLayer extends Layer {
  constructor(dataType, data, options = {}) {
    super(dataType, data, options)
    this.configureShape(Dot);
    this.setBehavior(new BreakpointBehavior());
  }
}
