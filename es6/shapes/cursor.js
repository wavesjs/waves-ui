import BaseShape from './base-shape';
import ns from '../core/namespace';


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

    return this.$el;
  }

  update(renderingContext, datum, index) {
    const x = renderingContext.timeToPixel(this.x(datum));
    const color = this.params.color;

    this.$el.setAttributeNS(null, 'transform', `translate(${x}, 0)`);
    this.$el.style.stroke = color;
  }

  // not selectable with a drag
  inArea() { return false; }
}
