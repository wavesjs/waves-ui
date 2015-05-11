const BaseBehavior = require('./base-behavior');

class MarkerBehavior extends BaseBehavior {

  edit(context, shape, datum, dx, dy, target) {
    const x = context.xScale(shape.x(datum));
    let targetX = (x + dx) > 0 ? x + dx : 0;

    shape.x(datum, context.xScale.invert(targetX));
  }
}

module.exports = MarkerBehavior;