const BaseShape = require('./base-shape');

class Segment extends BaseShape {
  getClassName() { return 'segment'; }

  _getAccessorList() {
    return { x: 0, y: 0, width: 0, height: 1, color: '#000000', opacity: 1 };
  }

  _getDefaults() {
    return {
      displayHandlers: true,
      handlerWidth: 2,
      handlerOpacity: 0.8,
      opacity: 0.6
    };
  }

  render(renderingContext) {
    if (this.el) { return this.el; }

    this.el = document.createElementNS(this.ns, 'g');

    this.segment = document.createElementNS(this.ns, 'rect');
    this.segment.style.opacity = this.params.opacity;
    this.segment.setAttributeNS(null, 'shape-rendering', 'crispEdges');

    this.el.appendChild(this.segment);

    if (this.params.displayHandlers) {
      this.leftHandler = document.createElementNS(this.ns, 'rect');
      this.leftHandler.classList.add('left', 'handler');
      this.leftHandler.setAttributeNS(null, 'width', this.params.handlerWidth);
      this.leftHandler.setAttributeNS(null, 'shape-rendering', 'crispEdges');
      this.leftHandler.style.opacity = this.params.handlerOpacity;
      this.leftHandler.style.cursor = 'ew-resize';

      this.rightHandler = document.createElementNS(this.ns, 'rect');
      this.rightHandler.classList.add('right', 'handler');
      this.rightHandler.setAttributeNS(null, 'width', this.params.handlerWidth);
      this.rightHandler.setAttributeNS(null, 'shape-rendering', 'crispEdges');
      this.rightHandler.style.opacity = this.params.handlerOpacity;
      this.rightHandler.style.cursor = 'ew-resize';

      this.el.appendChild(this.leftHandler);
      this.el.appendChild(this.rightHandler);
    }

    return this.el;
  }

  update(renderingContext, group, datum, index) {
    const x = renderingContext.xScale(this.x(datum));
    const y = renderingContext.yScale(this.y(datum));
    const width = renderingContext.xScale(this.width(datum));
    const height = renderingContext.yScale(this.height(datum));
    const color = this.color(datum);
    const opacity = this.opacity(datum);

    group.setAttributeNS(null, 'transform', `translate(${x}, ${y})`);

    this.el.style.opacity = opacity;

    this.segment.setAttributeNS(null, 'width', Math.max(width, 0));
    this.segment.setAttributeNS(null, 'height', height);
    this.segment.style.fill = color;

    if (this.params.displayHandlers) {
      // display handlers
      this.leftHandler.setAttributeNS(null, 'height', height);
      this.leftHandler.setAttributeNS(null, 'transform', 'translate(0, 0)');
      this.leftHandler.style.fill = color;

      const rightHandlerTranslate = `translate(${width - this.params.handlerWidth}, 0)`;
      this.rightHandler.setAttributeNS(null, 'height', height);
      this.rightHandler.setAttributeNS(null, 'transform', rightHandlerTranslate);
      this.rightHandler.style.fill = color;
    }
  }

  inArea(renderingContext, datum, x1, y1, x2, y2) {
    const shapeX1 = renderingContext.xScale(this.x(datum));
    const shapeX2 = renderingContext.xScale(this.x(datum) + this.width(datum));
    const shapeY1 = renderingContext.yScale(this.y(datum));
    const shapeY2 = renderingContext.yScale(this.y(datum) + this.height(datum));

    // http://jsfiddle.net/uthyZ/ - check overlaping area
    const xOverlap = Math.max(0, Math.min(x2, shapeX2) - Math.max(x1, shapeX1));
    const yOverlap = Math.max(0, Math.min(y2, shapeY2) - Math.max(y1, shapeY1));
    const area = xOverlap * yOverlap;

    return area > 0;
  }
}

module.exports = Segment;
