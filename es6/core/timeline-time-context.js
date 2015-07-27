import d3Scale from 'd3-scale';


/**
 *  @class ViewTimeContext
 *
 *  A ViewTimeContext instance represents the mapping between the time and the pixel domains
 *
 *  The `TimelineTimeContext` has 3 important attributes:
 *  - `timeContext.xScale` which defines the time to pixel transfert function, itself defined by the `pixelsPerSecond` attribute of the timeline
 *  - `timeContext.offset` defines a decay (in time domain) applied to all the views on the timeline. This allow to navigate inside visibleDurations longer than what can be represented in Layers (views) containers (e.g. horizontal scroll)
 *  - `timeContext.zoom` defines the zoom factor applyed to the timeline
 *
 *  It also maintains an helper (`visibleDuration`) which represent how much time the `tracks` are displaying
 *
 *  It also maintain an array of references to all the LayerTimeContext attached to the timeline to propagate changes on the time to pixel representation
 */
export default class TimelineTimeContext {
  constructor(pixelsPerSecond, visibleWidth) {
    this._children = [];

    // @rename to timeToPixel
    this._xScale = null;
    this._originalXScale = null;

    this._offset = 0;
    this._zoom = 1;
    this._pixelsPerSecond = pixelsPerSecond;
    // params
    this._visibleWidth = visibleWidth;
    this._visibleDuration = this.visibleWidth / this.pixelsPerSecond;
    this._maintainVisibleDuration = false;

    // create the timeToPixel scale
    const xScale = d3Scale.linear()
      .domain([0, 1])
      .range([0, pixelsPerSecond]);

    this.xScale = xScale;
    this.originalXScale = this.xScale.copy();
  }

  get pixelsPerSecond() {
    return this._pixelsPerSecond
  }

  set pixelsPerSecond(value) {
    this._pixelsPerSecond = value;

    this.xScaleRange = [0, this.pixelsPerSecond];
    this._visibleDuration = this.visibleWidth / this.pixelsPerSecond;
  }

  get offset() {
    return this._offset;
  }

  set offset(value) {
    this._offset = value;
  }

  get zoom() {
    return this._zoom;
  }

  set zoom(value) {
    const xScale = this.originalXScale.copy();
    const [min, max] = xScale.domain();
    const diff = (max - min) / value;

    xScale.domain([min, min + diff]);

    this._xScale = xScale;
    this._zoom = value;

    // Propagate change to children who have their own xScale
    const ratioChange = value / (this._zoom);

    this._children.forEach(function(child) {
      if (!child._xScale) { return; }
      child.stretchRatio = child.zoom * ratioChange;
    });
  }

  get visibleWidth() {
    return this._visibleWidth;
  }

  set visibleWidth(value) {
    const widthRatio = value / this.visibleWidth;

    this._visibleWidth = value;
    this._visibleDuration = this.visibleWidth / this.pixelsPerSecond;

    if (this.maintainVisibleDuration) {
      this.pixelsPerSecond = this.pixelsPerSecond * widthRatio;
    }
  }

  get visibleDuration() {
    return this._visibleDuration;
  }

  // set visibleDuration(value) {
  //   this._visibleDuration = value;
  // }

  get maintainVisibleDuration() {
    return this._maintainVisibleDuration;
  }

  set maintainVisibleDuration(bool) {
    this._maintainVisibleDuration = bool;
  }

  // @TODO rename to timeToPixel
  get xScale() {
    return this._xScale;
  }

  set xScale(scale) {
    this._xScale = scale;
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
