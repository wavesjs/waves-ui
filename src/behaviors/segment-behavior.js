import BaseBehavior from './base-behavior';


/**
 * Defines the default behavior for a segment.
 *
 * [example usage](./examples/layer-marker.html)
 */
export default class SegmentBehavior extends BaseBehavior {
  edit(renderingContext, shape, datum, dx, dy, target) {
    const classList = target.classList;
    let action = 'move';

    if (classList.contains('handler') && classList.contains('left')) {
      action = 'resizeLeft';
    } else if (classList.contains('handler') && classList.contains('right')) {
      action = 'resizeRight';
    }

    this[`_${action}`](renderingContext, shape, datum, dx, dy, target);
  }

  _move(renderingContext, shape, datum, dx, dy, target) {
    const layerHeight = renderingContext.height;
    // current values
    const x = renderingContext.timeToPixel(shape.x(datum));
    const y = renderingContext.valueToPixel(shape.y(datum));
    const height = renderingContext.valueToPixel(shape.height(datum));
    // target values
    let targetX = Math.max(x + dx, 0);
    let targetY = y - dy;

    // lock in layer's y axis
    if (targetY < 0) {
      targetY = 0;
    } else if (targetY + height > layerHeight) {
      targetY = layerHeight - height;
    }

    shape.x(datum, renderingContext.timeToPixel.invert(targetX));
    shape.y(datum, renderingContext.valueToPixel.invert(targetY));
  }

  _resizeLeft(renderingContext, shape, datum, dx, dy, target) {
    // current values
    const x     = renderingContext.timeToPixel(shape.x(datum));
    const width = renderingContext.timeToPixel(shape.width(datum));
    // target values
    let maxTargetX  = x + width;
    let targetX     = x + dx < maxTargetX ? Math.max(x + dx, 0) : x;
    let targetWidth = targetX !== 0 ? Math.max(width - dx, 1) : width;

    shape.x(datum, renderingContext.timeToPixel.invert(targetX));
    shape.width(datum, renderingContext.timeToPixel.invert(targetWidth));
  }

  _resizeRight(renderingContext, shape, datum, dx, dy, target) {
    // current values
    const width = renderingContext.timeToPixel(shape.width(datum));
    // target values
    let targetWidth = Math.max(width + dx, 1);

    shape.width(datum, renderingContext.timeToPixel.invert(targetWidth));
  }
}
