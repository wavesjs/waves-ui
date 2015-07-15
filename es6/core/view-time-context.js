import AbstractTimeContext from './abstract-time-context';

/**
 *  @class ViewTimeContext
 *
 *  A ViewTimeContext instance represents the mapping between the time and the pixel domains
 *
 *  The `timelineTimeContext` has 3 important attributes:
 *  - `timeContext.xScale` which defines the time to pixel transfert function, itself defined by the `pixelsPerSecond` attribute of the timeline
 *  - `timeContext.offset` defines a decay (in time domain) applied to all the views on the timeline. This allow to navigate inside durations longer than what can be represented in Layers (views) containers (e.g. horizontal scroll)
 *  - `timeContext.stretchRatio` defines the zoom factor applyed to the timeline
 *
 *  It owns an helper `timeContext.duration` which maintain a view on how much time the views applyed to the timeline (the `containers`) are representing
 *
 *  It also maintain an array of references to all the LayerTimeContext attached to the timeline to propagate some global change on the time to pixel representation
 */
export default class ViewTimeContext extends AbstractTimeContext {
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
