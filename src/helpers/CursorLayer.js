import Layer from '../core/Layer';
import Cursor from '../shapes/Cursor';


/**
 * Helper to create a cursor layer.
 *
 * [example usage](./examples/layer-cursor.html)
 */
class CursorLayer extends Layer {
  /**
   * @param {Object} options - An object to configure the layer.
   */
  constructor(options = {}) {
    const defaults = {
      color: 'red',
      hittable: false, // kind of pass through layer
    };

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

export default CursorLayer;
