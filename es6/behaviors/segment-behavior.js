const BaseBehavior = require('./base-behavior');

class SegmentBehavior extends BaseBehavior {
  // constructor() {}

  edit(item, datum, dx, dy, target) {
    let action = 'move';
    const classList = target.classList;

    if (classList.contains('handler') && classList.contains('left')) {
      action = 'resizeLeft';
    } else if (classList.contains('handler') && classList.contains('right')) {
      action = 'resizeRight';
    }

    this[`_${action}`](item, datum, dx, dy, target);
  }

  _move(item, datum, dx, dy, target) {
    console.log('move');
    const shape = this._layer._itemShapesMap.get(item)[0];
    const ctx = this._layer.context;
    const layerHeight = ctx.params.height;
    // current values
    const x = ctx.xScale(shape.x(datum));
    const y = ctx.yScale(shape.y(datum));
    const height = ctx.yScale(shape.height(datum));
    // define targets
    let targetX = x + dx;
    let targetY = y - dy;

    // if something to lock, do it here
    // lock in layer's y axis
    if (targetY < 0) {
      targetY = 0;
    } else if (targetY + height > layerHeight) {
      targetY = layerHeight - height
    }

    shape.x(datum, ctx.xScale.invert(targetX));
    shape.y(datum, ctx.yScale.invert(targetY));
  }

  _resizeLeft(item, datum, dx, dy, target) {
    console.log('resizeLeft');
    const shape = this._layer._itemShapesMap.get(item)[0];
    const ctx = this._layer.context;
    // current values
    const x     = ctx.xScale(shape.x(datum));
    const width = ctx.xScale(shape.width(datum));
    // define targets
    let targetX     = x + dx;
    let targetWidth = width - dx;

    // if something to lock, do it here
    targetWidth = Math.max(targetWidth, 1);

    shape.x(datum, ctx.xScale.invert(targetX));
    shape.width(datum, ctx.xScale.invert(targetWidth));
  }

  _resizeRight(item, datum, dx, dy, target) {
    const shape = this._layer._itemShapesMap.get(item)[0];
    const ctx = this._layer.context;
    // current values
    const width = ctx.xScale(shape.width(datum));
    // define targets
    let targetWidth = width + dx;

    // if something to lock, do it here
    targetWidth = Math.max(targetWidth, 1);

    shape.width(datum, ctx.xScale.invert(targetWidth));
  }
}

module.exports = SegmentBehavior;