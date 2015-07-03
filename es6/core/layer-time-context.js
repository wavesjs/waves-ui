const AbstractTimeContext = require('./abstract-time-context');

class LayerTimeContext extends AbstractTimeContext {
  constructor(parent) {
    super({});
    if (!parent) { throw new Error('LayerTimeContext must have a parent'); }

    this.parent = parent;

    this._xScale = null;

    this._start = 0;
    this._duration = parent.containersDuration;
    this._offset = 0;
    this._stretchRatio = 1;
    // register into the timeline's TimeContext
    this.parent._children.push(this);
  }

  clone() {
    const ctx = new this();
    ctx.start = this.start;
    ctx.duration = this.duration;
    ctx.offset = this.offset;
    ctx.stretchRatio = this.stretchRatio;

    return ctx;
  }

  get start() {
    return this._start;
  }

  set start(value) {
    this._start = value;
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
    // remove local xScale if ratio = 1
    if (value ===  1) {
      this._xScale = null;
      return;
    }

    const xScale = this.parent.originalXScale.copy();
    const [min, max] = xScale.domain();
    const diff = (max - min) / (value * this.parent.stretchRatio);

    xScale.domain([min, min + diff]);

    this._xScale = xScale;
    this._stretchRatio = value;
  }


  get xScale() {
    if (!this._xScale) {
      return this.parent.xScale;
    }

    return this._xScale;
  }

  // set xScale(scale) {
  //   this._xScale = scale;
  // }

  get xScaleRange() {
    return this.xScale.range();
  }

  set xScaleRange(arr) {
    if (!this._xScale) { return; }
    this._xScale.range(arr);
  }

  // read only
  get originalXScale() {
    return this.parent.originalXScale();
  }
}

module.exports = LayerTimeContext;
