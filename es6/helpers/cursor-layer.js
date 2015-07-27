import Layer from '../core/layer';
import Cursor from '../shapes/cursor';


export default class CursorLayer extends Layer {
  constructor(options = {}) {
    const data = { currentPosition: 0 };

    super('entity', data, options);

    this.configureShape(Cursor, { x: (d) => d.currentPosition }, {
      color: options.color
    });
  }

  set currentPosition(value) {
    this.data.currentPosition = value;
  }

  get currentPosition() {
    return this.data.currentPosition;
  }
}
