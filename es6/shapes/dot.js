const BaseShape = require('./base-shape');

class Dot extends BaseShape {
  getClassName() { return 'dot'; }

  render() {
    if (this.shape) { return this.shape; }

    this.shape = document.createElementNS(this.ns, 'circle');
    return this.shape;
  }

  update(context, group, datum, index) {
    const cx = context.xScale(this.cx(datum));
    const cy = context.yScale(this.cy(datum));
    const r  = this.r(datum);
    const color = this.color(datum);

    group.setAttributeNS(null, 'transform', `translate(${cx}, ${cy})`);
    this.shape.setAttributeNS(null, 'r', r);
    this.shape.style.fill = color;
  }

  // x1, x2, y1, y2 => in pixel domain
  inArea(context, datum, x1, x2, y1, y2) {
    const cx = context.xScale(this.cx(datum));
    const cy = context.yScale(this.cy(datum));

    if ((cx > x1 && cx < x2) && (cy > y1 && cy < y2)) {
      return true;
    }

    return false;
  }

  // @TODO rename : confusion between accessors and meta-accessors
  _getAccessorList() {
    return { cx: 0, cy: 0, r: 3, color: '#000000' };
  }
};

module.exports = Dot;

