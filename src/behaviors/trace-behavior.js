import BaseBehavior from './base-behavior';


/**
 * Defines the default behavior for a trace visualization.
 *
 * [example usage](./examples/layer-trace.html)
 */
export default class TraceBehavior extends BaseBehavior {
  edit(renderingContext, shape, datum, dx, dy, target) {
    if (target.classList.contains('min')) {
      this._editRange(renderingContext, shape, datum, dx, dy, 'min');
    } else if (target.classList.contains('max')) {
      this._editRange(renderingContext, shape, datum, dx, dy, 'max');
    } else {
      this._editMean(renderingContext, shape, datum, dx, dy);
    }
  }

  _editMean(renderingContext, shape, datum, dx, dy) {
    // work in pixel domain
    const x = renderingContext.timeToPixel(shape.x(datum));
    const y = renderingContext.valueToPixel(shape.mean(datum));

    let targetX = x + dx;
    let targetY = y - dy;

    shape.x(datum, renderingContext.timeToPixel.invert(targetX));
    shape.mean(datum, renderingContext.valueToPixel.invert(targetY));
  }

  _editRange(renderingContext, shape, datum, dx, dy, rangeSide) {
    const range = renderingContext.valueToPixel(shape.range(datum));

    let targetRange = rangeSide === 'min' ? range + 2 * dy : range - 2 * dy;
    targetRange = Math.max(targetRange, 0);

    shape.range(datum, renderingContext.valueToPixel.invert(targetRange));
  }
}
