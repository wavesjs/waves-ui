const BaseShape = require('./base-shape');
const ns = require('../core/namespace');

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
    if (this.shape) { return this.shape; }

    this.shape = document.createElementNS(ns, 'line');
    this.shape.setAttributeNS(null, 'x', 0);
    this.shape.setAttributeNS(null, 'y1', 0);
    this.shape.setAttributeNS(null, 'y2', renderingContext.height);
    this.shape.setAttributeNS(null, 'shape-rendering', 'crispEdges');

    return this.shape;
  }

  update(renderingContext, group, datum, index) {
    const x = renderingContext.xScale(this.x(datum));
    const color = this.params.color;

    group.setAttributeNS(null, 'transform', `translate(${x}, 0)`);
    this.shape.style.stroke = color;
  }

  // not selectable with a drag
  inArea() { return false; }
}

module.exports = Cursor;

