import BaseBehavior from './base-behavior';


/**
 * Defines the default behavior for a breakpoint function.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */
export default class BreakpointBehavior extends BaseBehavior {
  edit(renderingContext, shape, datum, dx, dy, target) {
    const data  = this._layer.data;
    const layerHeight = renderingContext.height;
    // current position
    const x = renderingContext.timeToPixel(shape.cx(datum));
    const y = renderingContext.valueToPixel(shape.cy(datum));
    // target position
    let targetX = x + dx;
    let targetY = y - dy;

    if (data.length > 2) {
      // create a sorted map of all `x` positions
      const xMap = data.map((d) => renderingContext.timeToPixel(shape.cx(d)));
      xMap.sort((a, b) => a < b ? -1 : 1);
      // find index of our shape x position
      const index = xMap.indexOf(x);
      // lock to next siblings
      if (targetX < xMap[index - 1] || targetX > xMap[index + 1]) {
        targetX = x;
      }
    }

    // lock in y axis
    if (targetY < 0) {
      targetY = 0;
    } else if (targetY > layerHeight) {
      targetY = layerHeight;
    }

    // update datum with new values
    shape.cx(datum, renderingContext.timeToPixel.invert(targetX));
    shape.cy(datum, renderingContext.valueToPixel.invert(targetY));
  }
}
