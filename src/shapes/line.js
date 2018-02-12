import BaseShape from './base-shape';


/**
 * A shape to display a line. Its main use is as common shape to create a
 * breakpoint visualization. (entity shape)
 *
 * [example usage](./examples/layer-breakpoint.html)
 */
class Line extends BaseShape {
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

    let path = 'M';
    const length = data.length;

    for (let i = 0; i < length; i++) {
      const datum = data[i];
      const x = renderingContext.timeToPixel(this.cx(datum));
      const y = renderingContext.valueToPixel(this.cy(datum)) - 0.5;
      path += `${x},${y}`;

      if (i < length - 1)
        path += 'L';
    }

    this.$el.setAttributeNS(null, 'd', path);
    this.$el.style.stroke = this.params.color;
    this.$el.style.fill = 'none';

    data = null;
  }
}

export default Line;
