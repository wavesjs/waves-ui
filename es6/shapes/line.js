const BaseShape = require('./base-shape');

class Line extends BaseShape {
  getClassName() { return 'line'; }

  render() {
    if (this.shape) { return this.shape; }

    this.shape = document.createElementNS(this.ns, 'path');
    // this.shape.setAttributeNS(null, 'shape-rendering', 'crispEdges');
    return this.shape;
  }

  update(context, group, data) {
    this.shape.setAttributeNS(null, 'd', this._buildLine(context, data));
    this.shape.style.stroke = this.color(data);
    this.shape.style.fill = 'none';
  }

  // builds the `path.d` attribute
  _buildLine(context, data) {
    // sort data
    let data = data.slice(0);
    data.sort((a, b) => {
      return this.cx(a) < this.cx(b) ? -1 : 1;
    });

    // console.log(data);

    let instructions = data.map((datum, index) => {
      const x = context.xScale(this.cx(datum));
      const y = context.yScale(this.cy(datum));
      return x + ',' + y;
    });

    return 'M' + instructions.join('L');
  }

  _getAccessorList() {
    return { cx: 0, cy: 0, color: '#000000' };
  }
}

module.exports = Line;
