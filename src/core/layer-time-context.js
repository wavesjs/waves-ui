import scales from '../utils/scales';


/**
 * A `LayerTimeContext` instance represents a time segment into a `TimelineTimeContext`.
 * It must be attached to a `TimelineTimeContext` (the one of the timeline it
 * belongs to). It relies on its parent's `timeToPixel` (time to pixel transfert
 * function) to create the time to pixel representation of the Layer (the view) it is attached to.
 *
 * The `layerTimeContext` has four important attributes:
 * - `start` represent the time at which temporal data must be represented
 *   in the timeline (for instance the begining of a soundfile in a DAW).
 * - `offset` represents offset time of the data in the context of a Layer.
 *   (@TODO give a use case example here "crop ?", and/or explain that it's not a common use case).
 * - `duration` is the duration of the view on the data.
 * - `stretchRatio` is the stretch applyed to the temporal data contained in
 *   the view (this value can be seen as a local zoom on the data, or as a stretch
 *   on the time components of the data). When applyed, the stretch ratio maintain
 *   the start position of the view in the timeline.
 *
 * ```
 * + timeline -----------------------------------------------------------------
 * 0         5         10          15          20        25          30 seconds
 * +---+*****************+------------------------------------------+*******+--
 *     |*** soundfile ***|Layer (view on the sound file)            |*******|
 *     +*****************+------------------------------------------+*******+
 *
 *     <---- offset ----><--------------- duration ----------------->
 * <-------- start ----->
 *
 * The parts of the sound file represented with '*' are hidden from the view
 * ```
 *
 * [example usage](./examples/time-contexts.html)
 */
export default class LayerTimeContext {
  /**
   * @param {TimelineTimeContext} parent - The `TimelineTimeContext` instance of the timeline.
   */
  constructor(parent) {
    if (!parent) { throw new Error('LayerTimeContext must have a parent'); }

    /**
     * The `TimelineTimeContext` instance of the timeline.
     *
     * @type {TimelineTimeContext}
     */
    this.parent = parent;

    this._timeToPixel = null;
    this._start = 0;
    this._duration = parent.visibleDuration;
    this._offset = 0;
    this._stretchRatio = 1;
    // register into the timeline's TimeContext
    this.parent._children.push(this);
  }

  /**
   * Creates a clone of the current time context.
   *
   * @return {LayerTimeContext}
   */
  clone() {
    const ctx = new this();

    ctx.parent = this.parent;
    ctx.start = this.start;
    ctx.duration = this.duration;
    ctx.offset = this.offset;
    ctx.stretchRatio = this.stretchRatio; // creates the local scale if needed

    return ctx;
  }

  /**
   * Returns the start position of the time context (in seconds).
   *
   * @type {Number}
   */
  get start() {
    return this._start;
  }

  /**
   * Sets the start position of the time context (in seconds).
   *
   * @type {Number}
   */
  set start(value) {
    this._start = value;
  }

  /**
   * Returns the duration of the time context (in seconds).
   *
   * @type {Number}
   */
  get duration() {
    return this._duration;
  }

  /**
   * Sets the duration of the time context (in seconds).
   *
   * @type {Number}
   */
  set duration(value) {
    this._duration = value;
  }

  /**
   * Returns the offset of the time context (in seconds).
   *
   * @type {Number}
   */
  get offset() {
    return this._offset;
  }

  /**
   * Sets the offset of the time context (in seconds).
   *
   * @type {Number}
   */
  set offset(value) {
    this._offset = value;
  }

  /**
   * Returns the stretch ratio of the time context.
   *
   * @type {Number}
   */
  get stretchRatio() {
    return this._stretchRatio;
  }

  /**
   * Sets the stretch ratio of the time context.
   *
   * @type {Number}
   */
  set stretchRatio(value) {
    // remove local scale if ratio = 1
    if (value ===  1) {
      this._timeToPixel = null;
      return;
    }
    // reuse previsously created local scale if exists
    const timeToPixel = this._timeToPixel ?
      this._timeToPixel : scales.linear().domain([0, 1]);

    timeToPixel.range([0, this.parent.computedPixelsPerSecond * value]);

    this._timeToPixel = timeToPixel;
    this._stretchRatio = value;
  }

  /**
   * Returns the time to pixel transfert function of the time context. If
   * the `stretchRatio` attribute is equal to 1, this function is the global
   * one from the `TimelineTimeContext` instance.
   *
   * @type {Function}
   */
  get timeToPixel() {
    if (!this._timeToPixel) {
      return this.parent.timeToPixel;
    }

    return this._timeToPixel;
  }

  /**
   * Helper function to convert pixel to time.
   *
   * @param {Number} px
   * @return {Number}
   */
  pixelToTime(px) {
    if (!this._timeToPixel) {
      return this.parent.timeToPixel.invert(px);
    }

    return this._timeToPixel.invert(px);
  }
}
