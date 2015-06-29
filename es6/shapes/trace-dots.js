const BaseShape = require('./base-shape');


class TraceDots extends BaseShape {
  getClassName() { return 'trace-dots'; }

  _getAccessorList() {
    return { x: 0, mean: 0, range: 0 };
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
    this._mean = document.createElementNS(this.ns, 'circle');
    this._mean.setAttributeNS(null, 'r', this.params.meanRadius);
    this._mean.setAttributeNS(null, 'stroke', this.params.meanColor);
    this._mean.setAttributeNS(null, 'fill', 'transparent');
    this._mean.classList.add('mean');
    // range dots (0 => top, 1 => bottom)
    this._max = document.createElementNS(this.ns, 'circle');
    this._max.setAttributeNS(null, 'r', this.params.meanRadius);
    this._max.setAttributeNS(null, 'stroke', this.params.rangeColor);
    this._max.setAttributeNS(null, 'fill', 'transparent');
    this._max.classList.add('max');

    this._min = document.createElementNS(this.ns, 'circle');
    this._min.setAttributeNS(null, 'r', this.params.meanRadius);
    this._min.setAttributeNS(null, 'stroke', this.params.rangeColor);
    this._min.setAttributeNS(null, 'fill', 'transparent');
    this._min.classList.add('min');

    this.shape.appendChild(this._mean);
    this.shape.appendChild(this._max);
    this.shape.appendChild(this._min);

    return this.shape;
  }

  // @TODO use accessors
  update(renderingContext, group, datum, index) {
    const mean = this.mean(datum);
    const range = this.range(datum);
    const x = this.x(datum);
    // y positions
    const meanPos = `${renderingContext.yScale(mean)}`;
    this._mean.setAttributeNS(null, 'transform', `translate(0, ${meanPos})`);

    const halfRange = datum.range / 2;
    const max = renderingContext.yScale(mean + halfRange);
    this._max.setAttributeNS(null, 'transform', `translate(0, ${max})`);
    const min = renderingContext.yScale(mean - halfRange);
    this._min.setAttributeNS(null, 'transform', `translate(0, ${min})`);

    const xPos = renderingContext.xScale(x);
    this.shape.setAttributeNS(null, 'transform', `translate(${xPos}, 0)`);
  }
}

module.exports = TraceDots;