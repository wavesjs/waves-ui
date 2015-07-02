/**
 * @class TimeContext
 *
 * A TimeContext instance represents a time segment and its horizontal scale to the pixel domain.
 * A timeContext is attached to a `Timeline` instance or its `Layer`.
 * When attached to a layer, a timeContext has a parent timeContext, the one attached to the timeline it belongs to.
 *
 * A timeContext has four importants attributes:
 * - timeContext.start which defines the start time of the context in seconds.
 *   - From a layer perspective, this could be the time at which temporal data must be represented in the timeline (for instance the begining of a soundfile in a DAW).
 *   - From a timeline perspective, this will always be 0.
 * - timeContext.offset which defines the offset time of the context in seconds.
 *   - From a timeline perspective, it is a way to have a window view upon a large timeline for instance.
 *   - From a layer perspective, this could be the offset time of the data in the context of a Layer (@TODO give a use case example here "crop ?", and/or explain that it's not a common use case).
 * - timeContext.duration which defines the duration
 *   - From a layer perspective, this is the duration of the temporal data (eg. the duration of a soundfile)
 *   - From a timeline perspective, this is the overall duration of the timeline
 * - timeContext.stretchRatio which defines the stretch applied
 *   - From a timeline perspective, this is zoom factor we apply to the timeline
 *   - From a layer perspective, this is a way to stretch the datas.
 *
 * In actual implementation, timeContexts are organised in a tree structure, with the timeline's TimeContext on top of it.
 * @WARNING: the tree works with two level, but probably wont with more depth
 */
class TimeContext {
  constructor(parent = null) {
    this.parent = parent;
    this._children = [];

    this._xScale = null;
    this._originalXScale = null;

    this.start = 0;  // Start time, in seconds
    this.duration = (parent !== null) ? parent.duration : 1;
    this.offset = 0;  // Content offset in regard to start, in seconds
    this._stretchRatio = 1;

    if (this.parent) {
      this.parent._children.push(this);
    }
  }

  /**
   * @return {Function} the closest available xScale in the TimeContext tree
   */
  get xScale() {
    if (this.parent && !this._xScale) {
      return this.parent.xScale;
    } else {
      return this._xScale;
    }
  }

  set xScale(xScale) {
    this._xScale = xScale;

    if (!this.parent && !this._originalXScale) {
      this._originalXScale = this._xScale.copy();
    }
  }

  set xScaleRange(range) {
    if (this._xScale) {
      this._xScale.range(range);
    }

    if (this._originalXScale) {
      this._originalXScale.range(range);
    }

    this._children.forEach((child) => { child.xScaleRange = range });
  }

  /**
   * @return {Function} the xScale as defined in the timeline without stretching
   */
  get originalXScale() {
    if (this.parent) {
      return this.parent.originalXScale;
    } else {
      return this._originalXScale;
    }
  }

  get stretchRatio() {
    return this._stretchRatio;
  }

  set stretchRatio(ratio) {
    // Do not remove xScale on top of the graph
    if (ratio === 1 && this.parent) {
      this._xScale = null;
    } else {
      const xScale = this.originalXScale.copy();
      const [min, max] = xScale.domain();

      let diff = (max - min) / ratio;

      if (this.parent) {
        diff = diff / this.parent.stretchRatio;
      }

      xScale.domain([min, min + diff]);
      this._xScale = xScale;
    }

    this._stretchRatio = ratio;

    // Propagate change to children who have their own stretchRatio
    const ratioChange = ratio / (this._stretchRatio);

    this._children.forEach(function(child) {
      if (!child._xScale) { return; }
      child.stretchRatio = child.stretchRatio * ratioChange;
    });
  }
}

module.exports = TimeContext;
