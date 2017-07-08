import BaseShape from './base-shape';
import ns from '../core/namespace';


/**
 * A shape to display a cursor.
 *
 * [example usage](./examples/layer-cursor.html)
 */
export default class Cursor extends BaseShape {
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
    if (this.$el) { return this.$el; }

    this.$el = document.createElementNS(ns, 'line');
    this.$el.setAttributeNS(null, 'x', 0);
    this.$el.setAttributeNS(null, 'y1', 0);
    this.$el.setAttributeNS(null, 'y2', renderingContext.height);
    this.$el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
    this.$el.style.stroke = this.params.color;

    return this.$el;
  }

  update(renderingContext, datum) {
    const x = Math.round(renderingContext.timeToPixel(this.x(datum))) + 0.5;
    this.$el.setAttributeNS(null, 'transform', `translate(${x}, 0)`);
  }

  /**
   * The cursor cannot be selected.
   * @return {Boolean} false
   */
  inArea() { return false; }
}
