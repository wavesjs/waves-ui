import BaseShape from './base-shape';


/**
 * A shape to display a marker.
 *
 * [example usage](./examples/layer-marker.html)
 */
export default class Marker extends BaseShape {
  getClassName() { return 'marker'; }

  _getAccessorList() {
    return { x: 0, color: '#ff0000' };
  }

  _getDefaults() {
    return {
      handlerWidth: 7,
      handlerHeight: 10,
      displayHandlers: true,
      opacity: 1,
      color: 'red',
    };
  }

  render(renderingContext) {
    if (this.$el) { return this.$el; }

    const height = renderingContext.height;

    this.$el = document.createElementNS(this.ns, 'g');
    this.$line = document.createElementNS(this.ns, 'line');

    // draw line
    this.$line.setAttributeNS(null, 'x', 0);
    this.$line.setAttributeNS(null, 'y1', 0);
    this.$line.setAttributeNS(null, 'y2', height);
    this.$line.setAttributeNS(null, 'shape-rendering', 'crispEdges');

    this.$el.appendChild(this.$line);

    if (this.params.displayHandlers) {
      this.$handler = document.createElementNS(this.ns, 'rect');

      this.$handler.setAttributeNS(null, 'x', -((this.params.handlerWidth) / 2 ));
      this.$handler.setAttributeNS(null, 'y', renderingContext.height - this.params.handlerHeight);
      this.$handler.setAttributeNS(null, 'width', this.params.handlerWidth);
      this.$handler.setAttributeNS(null, 'height', this.params.handlerHeight);
      this.$handler.setAttributeNS(null, 'shape-rendering', 'crispEdges');

      this.$el.appendChild(this.$handler);
    }

    this.$el.style.opacity = this.params.opacity;

    return this.$el;
  }

  update(renderingContext, datum) {
    const x = renderingContext.timeToPixel(this.x(datum)) - 0.5;
    const color = this.color(datum);

    this.$el.setAttributeNS(null, 'transform', `translate(${x}, 0)`);
    this.$line.style.stroke = color;

    if (this.params.displayHandlers) {
      this.$handler.style.fill = color;
    }
  }

  inArea(renderingContext, datum, x1, y1, x2, y2) {
    // handlers only are selectable
    const x = renderingContext.timeToPixel(this.x(datum));
    const shapeX1 = x - (this.params.handlerWidth - 1) / 2;
    const shapeX2 = shapeX1 + this.params.handlerWidth;
    const shapeY1 = renderingContext.height - this.params.handlerHeight;
    const shapeY2 = renderingContext.height;

    const xOverlap = Math.max(0, Math.min(x2, shapeX2) - Math.max(x1, shapeX1));
    const yOverlap = Math.max(0, Math.min(y2, shapeY2) - Math.max(y1, shapeY1));
    const area = xOverlap * yOverlap;

    return area > 0;
  }
}
