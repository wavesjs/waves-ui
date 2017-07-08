import BaseShape from './base-shape';


/**
 * A shape to display a dot.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */
export default class Dot extends BaseShape {
  getClassName() { return 'dot'; }

  // @TODO rename : confusion between accessors and meta-accessors
  _getAccessorList() {
    return { cx: 0, cy: 0, r: 3, color: '#000000' };
  }

  render() {
    if (this.$el) { return this.$el; }

    this.$el = document.createElementNS(this.ns, 'circle');

    return this.$el;
  }

  update(renderingContext, datum) {
    const cx = renderingContext.timeToPixel(this.cx(datum));
    const cy = renderingContext.valueToPixel(this.cy(datum));
    const r  = this.r(datum);
    const color = this.color(datum);

    this.$el.setAttributeNS(null, 'transform', `translate(${cx}, ${cy})`);
    this.$el.setAttributeNS(null, 'r', r);
    this.$el.style.fill = color;
  }

  // x1, x2, y1, y2 => in pixel domain
  inArea(renderingContext, datum, x1, y1, x2, y2) {
    const cx = renderingContext.timeToPixel(this.cx(datum));
    const cy = renderingContext.valueToPixel(this.cy(datum));

    if ((cx > x1 && cx < x2) && (cy > y1 && cy < y2)) {
      return true;
    }

    return false;
  }
}
