import BaseBehavior from './BaseBehavior';


/**
 * Defines the default behavior for a marker.
 *
 * [example usage](./examples/layer-marker.html)
 */
class MarkerBehavior extends BaseBehavior {
  edit(renderingContext, shape, datum, dx, dy, target) {
    const x = renderingContext.timeToPixel(shape.x(datum));
    const targetX = (x + dx) > 0 ? x + dx : 0;

    shape.x(datum, renderingContext.timeToPixel.invert(targetX));
  }
}

export default MarkerBehavior;
