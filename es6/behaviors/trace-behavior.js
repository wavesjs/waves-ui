const BaseBehavior = require('./base-behavior');


class TraceBehavior extends BaseBehavior {
  edit (renderingContext, shape, datum, dx, dy, target) {
    if (target.classList.contains('mean')) {
      this._editMean(renderingContext, shape, datum, dx, dy);
    } else if (target.classList.contains('min')) {
      this._editRange(renderingContext, shape, datum, dx, dy, 'min');
    } else if (target.classList.contains('max')) {
      this._editRange(renderingContext, shape, datum, dx, dy, 'max');
    }
  }

  _editMean(renderingContext, shape, datum, dx, dy) {
    // work in pixel domain
    const x = renderingContext.xScale(shape.x(datum));
    const y = renderingContext.yScale(shape.mean(datum));

    let targetX = x + dx;
    let targetY = y - dy;

    shape.x(datum, renderingContext.xScale.invert(targetX));
    shape.mean(datum, renderingContext.yScale.invert(targetY));
  }

  _editRange(renderingContext, shape, datum, dx, dy, rangeSide) {
    const range = renderingContext.yScale(shape.range(datum));

    let targetRange = rangeSide === 'min' ? range + 2 * dy : range - 2 * dy;
    targetRange = Math.max(targetRange, 0);

    shape.range(datum, renderingContext.yScale.invert(targetRange));
  }
}

module.exports = TraceBehavior;
