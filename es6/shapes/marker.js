const BaseShape = require('./base-shape');

class Marker extends BaseShape {
  _getAccessorList() {
    return { x: 0, color: '#000000' };
  }

  _getDefaults() {
    return {
      handlerWidth: 7,
      handlerHeight: 10
    }
  }

  render(context) {
    if (this.shape) { return this.shape; }

    const height = context.params.height;

    this.shape = document.createElementNS(this.ns, 'g');
    this.line = document.createElementNS(this.ns, 'line');
    this.handler = document.createElementNS(this.ns, 'rect');

    // draw line
    this.line.setAttributeNS(null, 'x', 0);
    this.line.setAttributeNS(null, 'y1', 0);
    this.line.setAttributeNS(null, 'y2', height);
    this.line.setAttributeNS(null, 'shape-rendering', 'crispEdges');

    this.handler.setAttributeNS(null, 'x', -((this.params.handlerWidth - 1) / 2));
    this.handler.setAttributeNS(null, 'y', context.params.height - this.params.handlerHeight);
    this.handler.setAttributeNS(null, 'width', this.params.handlerWidth);
    this.handler.setAttributeNS(null, 'height', this.params.handlerHeight);
    this.handler.setAttributeNS(null, 'shape-rendering', 'crispEdges');

    this.shape.appendChild(this.line);
    this.shape.appendChild(this.handler);

    return this.shape;
  }

  update(context, group, datum, index) {
    const x = Math.round(context.xScale(this.x(datum)));
    const color = this.color(datum);

    group.setAttributeNS(null, 'transform', `translate(${x}, 0)`);

    this.line.style.stroke = color;
    this.handler.style.fill = color;
  }

  inArea(context, datum, x1, y1, x2, y2) {
    // handlers only are selectable
    const x = context.xScale(this.x(datum));
    const shapeX1 = x - (this.params.handlerWidth - 1) / 2;
    const shapeX2 = shapeX1 + this.params.handlerWidth;
    const shapeY1 = context.params.height - this.params.handlerHeight;
    const shapeY2 = context.params.height;

    const xOverlap = Math.max(0, Math.min(x2, shapeX2) - Math.max(x1, shapeX1));
    const yOverlap = Math.max(0, Math.min(y2, shapeY2) - Math.max(y1, shapeY1));
    const area = xOverlap * yOverlap;

    return area > 0;
  }
}

module.exports = Marker;