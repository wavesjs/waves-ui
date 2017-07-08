import BaseShape from './base-shape';
import ns from '../core/namespace';


/**
 * A shape to display a cursor.
 *
 * [example usage](./examples/layer-cursor.html)
 */
class Cursor extends BaseShape {
  getClassName() { return 'cursor'; }

  _getAccessorList() {
    return { x: 0 };
  }

  _getDefaults() {
    return {
      color: '#000000',
      opacity: 1
    };
  }

  render(renderingContext) {
    this.$el = document.createElementNS(ns, 'line');
    this.$el.setAttributeNS(null, 'x', 0);
    this.$el.setAttributeNS(null, 'y1', 0);
    this.$el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
    this.$el.style.stroke = this.params.color;

    return this.$el;
  }

  update(renderingContext, datum) {
    const floatX = renderingContext.timeToPixel(this.x(datum));
    const x = Math.round(floatX);

    this.$el.setAttributeNS(null, 'transform', `translate(${x}, 0)`);
    this.$el.setAttributeNS(null, 'y2', renderingContext.height);
  }

  /**
   * The cursor cannot be selected.
   * @return {Boolean} false
   */
  inArea() { return false; }
}

export default Cursor;
