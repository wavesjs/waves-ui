const d3 = require('d3');
const ns = require('./namespace');

// @NOTE: rename to TimeContext

class Context {
  constructor(parent = null) {
    this._parent = parent;

    this._xScale = null; // inherits from parent context
    this._originalXScale = null;

    this.start = 0;
    this.duration = 1;
    this.offset = 0;
    this._stretchRatio = 1;
  }

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

  // get stretchRatio() {
  //   return this._stretchRatio;
  // }

  set stretchRatio(ratio) {
    // do not remove xScale on top of the graph
    if (ratio === 1 && this._parent) {
      this._xScale = null;
    } else {
      const xScale = this.originalXScale.copy();
      const [min, max] = xScale.domain();
      const diff = (max - min) / ratio;
      xScale.domain([min, min + diff]);

      this._xScale = xScale;
    }

    this._stretchRatio = ratio;
  }
}

module.exports = Context;
