const BaseBehavior = require('./base-behavior');

class MarkerBehavior extends BaseBehavior {

  edit(shape, datum, dx, dy, target) {
    const ctx = this._layer.context;
    const x = ctx.xScale(shape.x(datum));
    let targetX = (x + dx) > 0 ? x + dx : 0;

    shape.x(datum, ctx.xScale.invert(targetX));
  }
}

module.exports = MarkerBehavior;