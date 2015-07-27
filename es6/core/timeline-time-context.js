import d3Scale from 'd3-scale';


/**
 *  @class ViewTimeContext
 *
 *  A ViewTimeContext instance represents the mapping between the time and the pixel domains
 *
 *  The `TimelineTimeContext` has 3 important attributes:
 *  - `timeContext.timeToPixel` which defines the time to pixel transfert function, itself defined by the `pixelsPerSecond` attribute of the timeline
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
    this._timeToPixel = null;
    // this._originalXScale = null;

    this._offset = 0;
    this._zoom = 1;
    this._pixelsPerSecond = pixelsPerSecond;
    // params
    this._visibleWidth = visibleWidth;
    this._visibleDuration = this.visibleWidth / this.pixelsPerSecond;
    this._maintainVisibleDuration = false;

    // create the timeToPixel scale
    const scale = d3Scale.linear()
      .domain([0, 1])
      .range([0, pixelsPerSecond]);

    this.timeToPixel = scale;
    // this.originalXScale = this.timeToPixel.copy();

    this._originalPixelsPerSecond = this.pixelsPerSecond;
  }

  get pixelsPerSecond() {
    return this._pixelsPerSecond
  }

  set pixelsPerSecond(value) {
    this._pixelsPerSecond = value * this.zoom;
    this._originalPixelsPerSecond = value;
    this._updateTimeToPixelRange();

    // force children scale update
    this._children.forEach(function(child) {
      if (!child._xScale) { return; }
      child.stretchRatio = child.stretchRatio;
    });
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
    // Compute change to propagate to children who have their own timeToPixel
    const ratioChange = value / this._zoom;
    this._zoom = value;
    this._pixelsPerSecond = this._originalPixelsPerSecond * value;
    this._updateTimeToPixelRange();

    this._children.forEach(function(child) {
      if (!child._timeToPixel) { return; }
      child.stretchRatio = child.stretchRatio * ratioChange;
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

  /** @readonly */
  get visibleDuration() {
    return this._visibleDuration;
  }

  get maintainVisibleDuration() {
    return this._maintainVisibleDuration;
  }

  set maintainVisibleDuration(bool) {
    this._maintainVisibleDuration = bool;
  }

  get timeToPixel() {
    return this._timeToPixel;
  }

  set timeToPixel(scale) {
    this._timeToPixel = scale;
  }

  get originalPixelsPerSecond() {
    return this._originalPixelsPerSecond;
  }

  _updateTimeToPixelRange() {
    this._visibleDuration = this.visibleWidth / this.pixelsPerSecond;
    this.timeToPixel.range([0, this._pixelsPerSecond]);
  }
}
