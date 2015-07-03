const AbstractTimeContext = require('./abstract-time-context');


class TimelineTimeContext extends AbstractTimeContext {
  constructor() {
    super({});

    this._children = [];

    this._xScale = null;
    this._originalXScale = null;

    // params
    this._duration = 1; // for layers inheritance only
    this._offset = 0;
    this._stretchRatio = 1;
  }

  get duration() {
    return this._duration;
  }

  set duration(value) {
    this._duration = value;
  }

  get offset() {
    return this._offset;
  }

  set offset(value) {
    this._offset = value;
  }

  get stretchRatio() {
    return this._stretchRatio;
  }

  set stretchRatio(value) {
    const xScale = this.originalXScale.copy();
    const [min, max] = xScale.domain();
    const diff = (max - min) / value;

    xScale.domain([min, min + diff]);

    this._xScale = xScale;
    this._stretchRatio = value;

    // Propagate change to children who have their own xScale
    const ratioChange = value / (this._stretchRatio);

    this._children.forEach(function(child) {
      if (!child._xScale) { return; }
      child.stretchRatio = child.stretchRatio * ratioChange;
    });
  }

  get xScale() {
    return this._xScale;
  }

  set xScale(scale) {
    this._xScale = scale;

    if (!this._originalXScale) {
      this._originalXScale = this._xScale.copy();
    }
  }

  get xScaleRange() {
    return this._xScale.range();
  }

  set xScaleRange(arr) {
    this._xScale.range(arr);
    this._originalXScale.range(arr);
    // propagate to children
    this._children.forEach((child) => { child.xScaleRange = arr; });
  }

  get originalXScale() {
    return this._originalXScale;
  }

  set originalXScale(scale) {
    this._originalXScale = scale;
  }
}

module.exports = TimelineTimeContext;
