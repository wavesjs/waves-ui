import BaseShape from './base-shape';


/**
 * A shape to display dots in a trace visualization (mean / range).
 *
 * [example usage](./examples/layer-trace.html)
 */
export default class TraceDots extends BaseShape {
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
    if (this.$el) { return this.$el; }
    // container
    this.$el = document.createElementNS(this.ns, 'g');
    // draw mean dot
    this.$mean = document.createElementNS(this.ns, 'circle');
    this.$mean.setAttributeNS(null, 'r', this.params.meanRadius);
    this.$mean.setAttributeNS(null, 'stroke', this.params.meanColor);
    this.$mean.setAttributeNS(null, 'fill', 'transparent');
    this.$mean.classList.add('mean');
    // range dots (0 => top, 1 => bottom)
    this.$max = document.createElementNS(this.ns, 'circle');
    this.$max.setAttributeNS(null, 'r', this.params.meanRadius);
    this.$max.setAttributeNS(null, 'stroke', this.params.rangeColor);
    this.$max.setAttributeNS(null, 'fill', 'transparent');
    this.$max.classList.add('max');

    this.$min = document.createElementNS(this.ns, 'circle');
    this.$min.setAttributeNS(null, 'r', this.params.meanRadius);
    this.$min.setAttributeNS(null, 'stroke', this.params.rangeColor);
    this.$min.setAttributeNS(null, 'fill', 'transparent');
    this.$min.classList.add('min');

    this.$el.appendChild(this.$mean);
    this.$el.appendChild(this.$max);
    this.$el.appendChild(this.$min);

    return this.$el;
  }

  // @TODO use accessors
  update(renderingContext, datum) {
    const mean = this.mean(datum);
    const range = this.range(datum);
    const x = this.x(datum);
    // y positions
    const meanPos = `${renderingContext.valueToPixel(mean)}`;
    this.$mean.setAttributeNS(null, 'transform', `translate(0, ${meanPos})`);

    const halfRange = range / 2;
    const max = renderingContext.valueToPixel(mean + halfRange);
    const min = renderingContext.valueToPixel(mean - halfRange);
    const xPos = renderingContext.timeToPixel(x);

    this.$max.setAttributeNS(null, 'transform', `translate(0, ${max})`);
    this.$min.setAttributeNS(null, 'transform', `translate(0, ${min})`);
    this.$el.setAttributeNS(null, 'transform', `translate(${xPos}, 0)`);
  }

  inArea(renderingContext, datum, x1, y1, x2, y2) {
    const x = renderingContext.timeToPixel(this.x(datum));
    const mean = renderingContext.valueToPixel(this.mean(datum));
    const range = renderingContext.valueToPixel(this.range(datum));
    const min = mean - (range / 2);
    const max = mean + (range / 2);

    if (x > x1 && x < x2 && (min > y1 || max < y2)) {
      return true;
    }

    return false;
  }
}
