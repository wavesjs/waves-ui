const ns = require('./namespace');

// @FIXME there is a problem with the stretch:
// how does it must be applyed ?
// should we maintain some `absoluteStart`, `absoluteDuration`, etc... values ?

// @NOTE: separate timeline's with from the scale,
// => only define #pixels for one seconds (kind of real scale) ?

class TimeContext {
  constructor(parent = null) {
    this._parent = parent;
    this._children = [];

    this._xScale = null; // inherits from parent context
    this._originalXScale = null;

    this.start = 0;
    this.duration = (parent !== null) ? parent.duration : 1;
    this.offset = 0;
    this._stretchRatio = 1;
    // @NOTE: need an `absoluteStretchRatio` ?

    if (parent) {
      parent._children.push(this);
    }
  }

  // attempt to get a solution to the stretch problem
  // get normalizedStart() {
  //   return this.start / this.stretchRatio;
  // }

  /**
   * @return {Function} the closest available xScale in the tree
   */
  get xScale() {
    if (this._parent && !this._xScale) {
      return this._parent.xScale;
    } else {
      return this._xScale;
    }
  }

  set xScale(xScale) {
    this._xScale = xScale;
  }

  // read only
  // @NOTE not used anymore outside this object, was used to have a proper start
  // from an inner context with it's own `stretchRatio` but creates many bad side effects
  // => find another strategy => use _context.parent.xScale
  get originalXScale() {
    // lazy bind originalXScale on top of the tree
    if (!this._parent && !this._originalXScale) {
      this._originalXScale = this._xScale;
    }

    // returns the closest available xScale in the tree
    if (this._parent) {
      return this._parent.originalXScale;
    } else {
      return this._originalXScale;
    }
  }

  get stretchRatio() {
    return this._stretchRatio;
  }

  // @FIXME: inconsistencies occur
  // when stretching parent and when child.stretchRatio != 1
  set stretchRatio(ratio) {
    // do not remove xScale on top of the graph
    if (
      ratio === 1 &&
      this._parent &&
      this._parent.stretchRatio === 1
    ) {
      this._xScale = null;
    } else {
      const xScale = this.originalXScale.copy();
      const [min, max] = xScale.domain();
      const diff = (max - min) / ratio;
      xScale.domain([min, min + diff]);

      this._xScale = xScale;
    }

    const ratioChange = ratio / this._stretchRatio;
    this._stretchRatio = ratio;

    // propagate change to children who have their own stretchRatio
    this._children.forEach(function(child) {
      if (child._xScale) {
        child.stretchRatio = child.stretchRatio * ratioChange;
      }
    });
  }
}

module.exports = TimeContext;
