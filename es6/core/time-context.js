/**
 *  @class TimeContext
 *
 *  represent a time segment and its scale to the pixel domain
 *  the timeContexts are organised in a tree structure,
 *  with the timeline's TimeContext on top
 *
 *  @WARNING: the tree works with two level, but probably wont with more depth
 */
class TimeContext {
  constructor(parent = null) {
    this.parent = parent;
    this._children = [];

    this._xScale = null;
    this._originalXScale = null;

    this.start = 0; // start x position
    this.duration = (parent !== null) ? parent.duration : 1;
    this.offset = 0; // content offset in regard to start
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
    // do not remove xScale on top of the graph
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

    // propagate change to children who have their own stretchRatio
    const ratioChange = ratio / (this._stretchRatio);

    this._children.forEach(function(child) {
      if (!child._xScale) { return; }
      child.stretchRatio = child.stretchRatio * ratioChange;
    });
  }
}

module.exports = TimeContext;
