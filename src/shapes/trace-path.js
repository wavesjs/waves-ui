import BaseShape from './base-shape';


/**
 * A shape to display paths in a trace visualization (mean / range). (entity shape)
 *
 * [example usage](./examples/layer-trace.html)
 */
export default class TracePath extends BaseShape {
  getClassName() { return 'trace-common'; }

  _getAccessorList() {
    return { x: 0, mean: 0, range: 0 };
  }

  _getDefaults() {
    return {
      rangeColor: 'steelblue',
      meanColor: '#232323',
      displayMean: true
    };
  }

  render(renderingContext) {
    if (this.$el) { return this.$el; }
    this.$el = document.createElementNS(this.ns, 'g');
    // range path
    this.$range = document.createElementNS(this.ns, 'path');
    this.$el.appendChild(this.$range);

    // mean line
    if (this.params.displayMean) {
      this.$mean = document.createElementNS(this.ns, 'path');
      this.$el.appendChild(this.$mean);
    }

    return this.$el;
  }

  update(renderingContext, data) {
    // order data by x position
    data = data.slice(0);
    data.sort((a, b) => this.x(a) < this.x(b) ? -1 : 1);

    if (this.params.displayMean) {
      this.$mean.setAttributeNS(null, 'd', this._buildMeanLine(renderingContext, data));
      this.$mean.setAttributeNS(null, 'stroke', this.params.meanColor);
      this.$mean.setAttributeNS(null, 'fill', 'none');
    }

    this.$range.setAttributeNS(null, 'd', this._buildRangeZone(renderingContext, data));
    this.$range.setAttributeNS(null, 'stroke', 'none');
    this.$range.setAttributeNS(null, 'fill', this.params.rangeColor);
    this.$range.setAttributeNS(null, 'opacity', '0.4');

    data = null;
  }

  _buildMeanLine(renderingContext, data) {
    let instructions = data.map((datum, index) => {
      const x = renderingContext.timeToPixel(this.x(datum));
      const y = renderingContext.valueToPixel(this.mean(datum));
      return `${x},${y}`;
    });

    return 'M' + instructions.join('L');
  }

  _buildRangeZone(renderingContext, data) {
    const length = data.length;
    // const lastIndex = data
    let instructionsStart = '';
    let instructionsEnd = '';

    for (let i = 0; i < length; i++) {
      const datum = data[i];
      const mean = this.mean(datum);
      const halfRange = this.range(datum) / 2;

      const x  = renderingContext.timeToPixel(this.x(datum));
      const y0 = renderingContext.valueToPixel(mean + halfRange);
      const y1 = renderingContext.valueToPixel(mean - halfRange);

      const start = `${x},${y0}`;
      const end   = `${x},${y1}`;

      instructionsStart = instructionsStart === '' ?
        start : `${instructionsStart}L${start}`;

      instructionsEnd = instructionsEnd === '' ?
        end : `${end}L${instructionsEnd}`;
    }

    let instructions = `M${instructionsStart}L${instructionsEnd}Z`;
    return instructions;
  }
}
