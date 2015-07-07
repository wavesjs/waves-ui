import BaseBehavior from './base-behavior';


export default class MarkerBehavior extends BaseBehavior {

  edit(renderingContext, shape, datum, dx, dy, target) {
    const x = renderingContext.xScale(shape.x(datum));
    let targetX = (x + dx) > 0 ? x + dx : 0;

    shape.x(datum, renderingContext.xScale.invert(targetX));
  }
}
