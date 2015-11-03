import BaseShape from './base-shape';


/**
 * A shape to display a line. Its main use is as common shape to create a
 * breakpoint visualization. (entity shape)
 *
 * [example usage](./examples/layer-breakpoint.html)
 */
export default class Line extends BaseShape {
  getClassName() { return 'line'; }

  _getAccessorList() {
    return { cx: 0, cy: 0 };
  }

  _getDefaults() {
    return { color: '#000000' };
  }

  render(renderingContext) {
    if (this.$el) { return this.$el; }

    this.$el = document.createElementNS(this.ns, 'path');
    // this.el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
    return this.$el;
  }

  update(renderingContext, data) {
    data = data.slice(0);
    data.sort((a, b) => this.cx(a) < this.cx(b) ? -1 : 1);

    this.$el.setAttributeNS(null, 'd', this._buildLine(renderingContext, data));
    this.$el.style.stroke = this.params.color;
    this.$el.style.fill = 'none';

    data = null;
  }

  // builds the `path.d` attribute
  // @TODO create some ShapeHelper ?
  _buildLine(renderingContext, data) {
    if (!data.length) { return ''; }
    // sort data
    let instructions = data.map((datum, index) => {
      const x = renderingContext.timeToPixel(this.cx(datum));
      const y = renderingContext.valueToPixel(this.cy(datum)) - 0.5;
      return `${x},${y}`;
    });

    return 'M' + instructions.join('L');
  }
}
