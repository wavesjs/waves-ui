import d3Scale from 'd3-scale';


/**
 *  @class LayerTimeContext
 *
 *  A `LayerTimeContext` instance represent a time segment into a `TimelineTimeContext`. It must be attached to a `TimelineTimeContext` (the one of the timeline it belongs to). It relies on its parent's `timeToPixel` (time to pixel transfert function) to create the time to pixel representation of the Layer (the view) it is attached to.
 *
 *  The `layerTimeContext` has four important attributes
 *  - `timeContext.start` represent the time at which temporal data must be represented in the timeline (for instance the begining of a soundfile in a DAW)
 *  - `timeContext.offset` represents offset time of the data in the context of a Layer. (@TODO give a use case example here "crop ?", and/or explain that it's not a common use case)
 *  - `timeContext.duration` is the duration of the view on the data
 *  - `timeContext.stretchRatio` is the stretch applyed to the temporal data contained in the view (this value can be seen as a local zoom on the data, or as a stretch on the time components of the data). When applyed, the stretch ratio maintain the start position of the view in the timeline.
 *
 *
 * + timeline -----------------------------------------------------------------
 * 0         5         10          15          20        25          30 seconds
 * +---+*****************+------------------------------------------+*******+--
 *     |*** soundfile ***|Layer (view on the sound file)            |*******|
 *     +*****************+------------------------------------------+*******+
 *
 *     <---- offset ----><--------------- duration ----------------->
 * <-------- start ----->
 *
 *      The parts of the sound file represented with '*' are hidden from the view
 *
 */
export default class LayerTimeContext {
  constructor(parent) {
    if (!parent) { throw new Error('LayerTimeContext must have a parent'); }

    this.parent = parent;

    this._timeToPixel = null;

    this._start = 0;
    this._duration = parent.visibleDuration;
    this._offset = 0;
    this._stretchRatio = 1;
    // register into the timeline's TimeContext
    this.parent._children.push(this);
  }

  clone() {
    const ctx = new this();

    ctx.parent = this.parent;
    ctx.start = this.start;
    ctx.duration = this.duration;
    ctx.offset = this.offset;
    ctx.stretchRatio = this.stretchRatio; // creates the local scale if needed

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
    // remove local scale if ratio = 1
    if (value ===  1) {
      this._timeToPixel = null;
      return;
    }
    // reuse previsously created local scale if exists
    const timeToPixel = this._timeToPixel ?
      this._timeToPixel : d3Scale.linear().domain([0, 1]);

    timeToPixel.range([0, this.parent.computedPixelsPerSecond * value]);

    this._timeToPixel = timeToPixel;
    this._stretchRatio = value;
  }

  // read only
  get timeToPixel() {
    if (!this._timeToPixel) {
      return this.parent.timeToPixel;
    }

    return this._timeToPixel;
  }
}
