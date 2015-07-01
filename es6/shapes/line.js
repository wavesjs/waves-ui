const BaseShape = require('./base-shape');

class Line extends BaseShape {
  getClassName() { return 'line'; }

  _getAccessorList() {
    return { cx: 0, cy: 0 };
  }

  _getDefaults() {
    return { color: '#000000' };
  }

  render() {
    if (this.shape) { return this.shape; }

    this.shape = document.createElementNS(this.ns, 'path');
    // this.shape.setAttributeNS(null, 'shape-rendering', 'crispEdges');
    return this.shape;
  }

  update(renderingContext, group, data) {
    data = data.slice(0);
    data.sort((a, b) => this.cx(a) < this.cx(b) ? -1 : 1);

    this.shape.setAttributeNS(null, 'd', this._buildLine(renderingContext, data));
    this.shape.style.stroke = this.params.color;
    this.shape.style.fill = 'none';

    data = null;
  }

  // builds the `path.d` attribute
  // @TODO create some ShapeHelper ?
  _buildLine(renderingContext, data) {
    if (!data.length) { return ''; }
    // sort data
    let instructions = data.map((datum, index) => {
      const x = renderingContext.xScale(this.cx(datum));
      const y = renderingContext.yScale(this.cy(datum));
      return `${x},${y}`;
    });

    return 'M' + instructions.join('L');
  }
}

module.exports = Line;
