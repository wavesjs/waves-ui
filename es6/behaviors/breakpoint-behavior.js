const BaseBehavior = require('./base-behavior');

class BreakpointBehavior extends BaseBehavior {

  edit(context, shape, datum, dx, dy, target) {
    const data  = this._layer.data;
    const layerHeight = context.params.height;
    // current position
    const x = context.xScale(shape.cx(datum));
    const y = context.yScale(shape.cy(datum));
    // target position
    let targetX = x + dx;
    let targetY = y - dy;

    // create a map of all `x` positions
    // reuse accessor of the shape we know
    const xMap = data.map((d, index) => context.xScale(shape.cx(d)));
    // sort the map
    xMap.sort((a, b) => { return a < b ? -1 : 1 });

    // find index of our shape x position
    const index = xMap.indexOf(x);
    // lock to next siblings
    if (targetX < xMap[index - 1] || targetX > xMap[index + 1]) {
      targetX = x;
    }

    // lock in y axis
    if (targetY < 0) {
      targetY = 0;
    } else if (targetY > layerHeight) {
      targetY = layerHeight;
    }

    // update datum with new values
    shape.cx(datum, context.xScale.invert(targetX));
    shape.cy(datum, context.yScale.invert(targetY));
  }

}

module.exports = BreakpointBehavior;