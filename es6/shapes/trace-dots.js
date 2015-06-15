const BaseShape = require('./base-shape');


class TraceDots extends BaseShape {
  _getAccessorList() {
    return {
      x: function(d, v = null) {
        if (v !== null) { d.x = v; }
        return d.x;
      },
      mean: function(d, v = null) {
        if (v !== null) { d.mean = v }
        return d.mean;
      },
      min: 0,
      max: 0
    };
  }

  _getDefaults() {
    return {
      meanRadius: 3,
      rangeRadius: 3,
      meanColor: '#232323',
      rangeColor: 'steelblue'
    };
  }

  render(renderingContext) {
    if (this.shape) { return this.shape; }

    // container
    this.shape = document.createElementNS(this.ns, 'g');
    // draw mean dot
    this.mean = document.createElementNS(this.ns, 'circle');
    this.mean.setAttributeNS(null, 'r', this.params.meanRadius);
    this.mean.setAttributeNS(null, 'stroke', this.params.meanColor);
    this.mean.setAttributeNS(null, 'fill', 'none');
    // range dots (0 => top, 1 => bottom)
    this.max = document.createElementNS(this.ns, 'circle');
    this.max.setAttributeNS(null, 'r', this.params.meanRadius);
    this.max.setAttributeNS(null, 'stroke', this.params.rangeColor);
    this.max.setAttributeNS(null, 'fill', 'none');

    this.min = document.createElementNS(this.ns, 'circle');
    this.min.setAttributeNS(null, 'r', this.params.meanRadius);
    this.min.setAttributeNS(null, 'stroke', this.params.rangeColor);
    this.min.setAttributeNS(null, 'fill', 'none');

    this.shape.appendChild(this.mean);
    this.shape.appendChild(this.max);
    this.shape.appendChild(this.min);

    return this.shape;
  }

  // @TODO use accessors
  update(renderingContext, group, datum, index) {
    // y positions
    const meanPos = `${renderingContext.yScale(datum.mean)}`;
    this.mean.setAttributeNS(null, 'transform', `translate(0, ${meanPos})`);

    const halfRange = datum.range / 2;
    const max = `${renderingContext.yScale(datum.mean + halfRange)}`;
    this.max.setAttributeNS(null, 'transform', `translate(0, ${max})`);
    const min = `${renderingContext.yScale(datum.mean - halfRange)}`;
    this.min.setAttributeNS(null, 'transform', `translate(0, ${min})`);

    const xPos = `${renderingContext.xScale(datum.x)}`;
    this.shape.setAttributeNS(null, 'transform', `translate(${xPos}, 0)`);
  }
}

module.exports = TraceDots;