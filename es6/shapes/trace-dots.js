const BaseShape = require('./base-shape');


class TraceDots extends BaseShape {
  getClassName() { return 'trace-dots'; }

  _getAccessorList() {
    return { x: 0, yMean: 0, yRange: 0 };
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
    if (this.el) { return this.el; }
    // container
    this.el = document.createElementNS(this.ns, 'g');
    // draw mean dot
    this.mean = document.createElementNS(this.ns, 'circle');
    this.mean.setAttributeNS(null, 'r', this.params.meanRadius);
    this.mean.setAttributeNS(null, 'stroke', this.params.meanColor);
    this.mean.setAttributeNS(null, 'fill', 'transparent');
    this.mean.classList.add('mean');
    // range dots (0 => top, 1 => bottom)
    this.max = document.createElementNS(this.ns, 'circle');
    this.max.setAttributeNS(null, 'r', this.params.meanRadius);
    this.max.setAttributeNS(null, 'stroke', this.params.rangeColor);
    this.max.setAttributeNS(null, 'fill', 'transparent');
    this.max.classList.add('max');

    this.min = document.createElementNS(this.ns, 'circle');
    this.min.setAttributeNS(null, 'r', this.params.meanRadius);
    this.min.setAttributeNS(null, 'stroke', this.params.rangeColor);
    this.min.setAttributeNS(null, 'fill', 'transparent');
    this.min.classList.add('min');

    this.el.appendChild(this.mean);
    this.el.appendChild(this.max);
    this.el.appendChild(this.min);

    return this.el;
  }

  // @TODO use accessors
  update(renderingContext, group, datum, index) {
    const mean = this.yMean(datum);
    const range = this.yRange(datum);
    const x = this.x(datum);
    // y positions
    const meanPos = `${renderingContext.yScale(mean)}`;
    this.mean.setAttributeNS(null, 'transform', `translate(0, ${meanPos})`);

    const halfRange = datum.range / 2;
    const max = renderingContext.yScale(mean + halfRange);
    this.max.setAttributeNS(null, 'transform', `translate(0, ${max})`);
    const min = renderingContext.yScale(mean - halfRange);
    this.min.setAttributeNS(null, 'transform', `translate(0, ${min})`);

    const xPos = renderingContext.xScale(x);
    this.el.setAttributeNS(null, 'transform', `translate(${xPos}, 0)`);
  }
}

module.exports = TraceDots;