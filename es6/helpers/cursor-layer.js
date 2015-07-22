import Layer from '../core/layer';
import Cursor from '../shapes/cursor';
//import MarkerBehavior from '../behaviors/marker-behavior';


export default class CursorLayer extends Layer {
  constructor(data, options = {}) {
    super('entity', data, options)
    this.configureShape(Cursor, { x: (d) => d.currentPosition }, {
      color: options.color
    });
    //this.setBehavior(new MarkerBehavior());
  }
}
