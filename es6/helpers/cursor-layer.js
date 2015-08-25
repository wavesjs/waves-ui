import Layer from '../core/layer';
import Cursor from '../shapes/cursor';


export default class CursorLayer extends Layer {
  constructor(options = {}) {
    const defaults = {
      color: 'red',
      hittable: false, // kind of pass through layer
    }

    const data = { currentPosition: 0 };

    options = Object.assign(defaults, options);
    super('entity', data, options);

    this.configureShape(Cursor, { x: (d) => d.currentPosition }, {
      color: options.color
    });
  }

  set currentPosition(value) {
    this.data[0].currentPosition = value;
  }

  get currentPosition() {
    return this.data[0].currentPosition;
  }
}
