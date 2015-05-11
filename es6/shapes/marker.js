const BaseShape = require('./base-shape');

class Marker extends BaseShape {
  _getAccessorList() {
    return { x: 0, color: '#000000' };
  }

  _getDefaults() {
    return {

    }
  }

  render(context) {
    if (this.shape) { return this.shape; }

    const height = context.params.height;

    this.shape = document.createElementNS(this.ns, 'g');
    this.line = document.createElementNS(this.ns, 'line');
    this.handler = document.createElementNS(this.ns, 'rect');

    // draw line
    this.line.setAttribute('x', 0);
    this.line.setAttribute('y1', 0);
    this.line.setAttribute('y2', height);

    this.shape.appendChild(this.line);
    this.shape.appendChild(this.handler);

    return this.shape;
  }

  update(context, group, datum, index) {
    const x = context.xScale(this.x(datum));
    const color = this.color(datum);

    group.setAttributeNS(null, 'transform', `translate(${x}, 0)`);

    this.line.style.stroke = color;
  }
}

module.exports = Marker;