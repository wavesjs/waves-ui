const BaseBehavior = require('./base-behavior');
const d3 = require('d3');

class BreakpointBehavior extends BaseBehavior {

  edit(item, datum, dx, dy, target) {
    const data  = this._layer.data;
    const ctx   = this._layer.context;
    const shape = this._layer._itemShapesMap.get(item)[0]; // get the first registered shape
    const layerHeight = ctx.params.height;
    // current position
    const x = ctx.xScale(shape.cx(datum));
    const y = ctx.yScale(shape.cy(datum));
    // target position
    let targetX = x + dx;
    let targetY = y - dy;

    // create a map of all `x` positions
    // reuse accessor of the shape we know
    const xMap = data.map((d, index) => { return ctx.xScale(shape.cx(d)) });
    // sort the map
    xMap.sort((a, b) => { return a < b ? -1 : 1 });

    // find index of our shape x position
    const index = xMap.indexOf(x);
    // compare with next siblings and lock
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
    shape.cx(datum, ctx.xScale.invert(targetX));
    shape.cy(datum, ctx.yScale.invert(targetY));
  }

}

module.exports = BreakpointBehavior;