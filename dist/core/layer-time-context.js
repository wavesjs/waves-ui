'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utilsScales = require('../utils/scales');

var _utilsScales2 = _interopRequireDefault(_utilsScales);

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
 */

var LayerTimeContext = (function () {
  /**
   * @param {TimelineTimeContext} parent - The `TimelineTimeContext` instance of the timeline.
   */

  function LayerTimeContext(parent) {
    _classCallCheck(this, LayerTimeContext);

    if (!parent) {
      throw new Error('LayerTimeContext must have a parent');
    }

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

  _createClass(LayerTimeContext, [{
    key: 'clone',
    value: function clone() {
      var ctx = new this();

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
  }, {
    key: 'pixelToTime',

    /**
     * Helper function to convert pixel to time.
     *
     * @param {Number} px
     * @return {Number}
     */
    value: function pixelToTime(px) {
      if (!this._timeToPixel) {
        return this.parent.timeToPixel.invert(px);
      }

      return this._timeToPixel.invert(px);
    }
  }, {
    key: 'start',
    get: function get() {
      return this._start;
    },

    /**
     * Sets the start position of the time context (in seconds).
     *
     * @type {Number}
     */
    set: function set(value) {
      this._start = value;
    }

    /**
     * Returns the duration of the time context (in seconds).
     *
     * @type {Number}
     */
  }, {
    key: 'duration',
    get: function get() {
      return this._duration;
    },

    /**
     * Sets the duration of the time context (in seconds).
     *
     * @type {Number}
     */
    set: function set(value) {
      this._duration = value;
    }

    /**
     * Returns the offset of the time context (in seconds).
     *
     * @type {Number}
     */
  }, {
    key: 'offset',
    get: function get() {
      return this._offset;
    },

    /**
     * Sets the offset of the time context (in seconds).
     *
     * @type {Number}
     */
    set: function set(value) {
      this._offset = value;
    }

    /**
     * Returns the stretch ratio of the time context.
     *
     * @type {Number}
     */
  }, {
    key: 'stretchRatio',
    get: function get() {
      return this._stretchRatio;
    },

    /**
     * Sets the stretch ratio of the time context.
     *
     * @type {Number}
     */
    set: function set(value) {
      // remove local scale if ratio = 1
      if (value === 1) {
        this._timeToPixel = null;
        return;
      }
      // reuse previsously created local scale if exists
      var timeToPixel = this._timeToPixel ? this._timeToPixel : _utilsScales2['default'].linear().domain([0, 1]);

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
  }, {
    key: 'timeToPixel',
    get: function get() {
      if (!this._timeToPixel) {
        return this.parent.timeToPixel;
      }

      return this._timeToPixel;
    }
  }]);

  return LayerTimeContext;
})();

exports['default'] = LayerTimeContext;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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SUFBSSxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUVwRSxVQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztBQUNoQyxVQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztLQUM1Qjs7Ozs7Ozs7Ozs7U0FTYyxlQUFHO0FBQ2hCLFVBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ3RCLGVBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7T0FDaEM7O0FBRUQsYUFBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0tBQzFCOzs7U0F6SWtCLGdCQUFnQjs7O3FCQUFoQixnQkFBZ0IiLCJmaWxlIjoic3JjL3dhdmVzLXVpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNjYWxlcyBmcm9tICcuLi91dGlscy9zY2FsZXMnO1xuXG5cbi8qKlxuICogQSBgTGF5ZXJUaW1lQ29udGV4dGAgaW5zdGFuY2UgcmVwcmVzZW50cyBhIHRpbWUgc2VnbWVudCBpbnRvIGEgYFRpbWVsaW5lVGltZUNvbnRleHRgLlxuICogSXQgbXVzdCBiZSBhdHRhY2hlZCB0byBhIGBUaW1lbGluZVRpbWVDb250ZXh0YCAodGhlIG9uZSBvZiB0aGUgdGltZWxpbmUgaXRcbiAqIGJlbG9uZ3MgdG8pLiBJdCByZWxpZXMgb24gaXRzIHBhcmVudCdzIGB0aW1lVG9QaXhlbGAgKHRpbWUgdG8gcGl4ZWwgdHJhbnNmZXJ0XG4gKiBmdW5jdGlvbikgdG8gY3JlYXRlIHRoZSB0aW1lIHRvIHBpeGVsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBMYXllciAodGhlIHZpZXcpIGl0IGlzIGF0dGFjaGVkIHRvLlxuICpcbiAqIFRoZSBgbGF5ZXJUaW1lQ29udGV4dGAgaGFzIGZvdXIgaW1wb3J0YW50IGF0dHJpYnV0ZXM6XG4gKiAtIGBzdGFydGAgcmVwcmVzZW50IHRoZSB0aW1lIGF0IHdoaWNoIHRlbXBvcmFsIGRhdGEgbXVzdCBiZSByZXByZXNlbnRlZFxuICogICBpbiB0aGUgdGltZWxpbmUgKGZvciBpbnN0YW5jZSB0aGUgYmVnaW5pbmcgb2YgYSBzb3VuZGZpbGUgaW4gYSBEQVcpLlxuICogLSBgb2Zmc2V0YCByZXByZXNlbnRzIG9mZnNldCB0aW1lIG9mIHRoZSBkYXRhIGluIHRoZSBjb250ZXh0IG9mIGEgTGF5ZXIuXG4gKiAgIChAVE9ETyBnaXZlIGEgdXNlIGNhc2UgZXhhbXBsZSBoZXJlIFwiY3JvcCA/XCIsIGFuZC9vciBleHBsYWluIHRoYXQgaXQncyBub3QgYSBjb21tb24gdXNlIGNhc2UpLlxuICogLSBgZHVyYXRpb25gIGlzIHRoZSBkdXJhdGlvbiBvZiB0aGUgdmlldyBvbiB0aGUgZGF0YS5cbiAqIC0gYHN0cmV0Y2hSYXRpb2AgaXMgdGhlIHN0cmV0Y2ggYXBwbHllZCB0byB0aGUgdGVtcG9yYWwgZGF0YSBjb250YWluZWQgaW5cbiAqICAgdGhlIHZpZXcgKHRoaXMgdmFsdWUgY2FuIGJlIHNlZW4gYXMgYSBsb2NhbCB6b29tIG9uIHRoZSBkYXRhLCBvciBhcyBhIHN0cmV0Y2hcbiAqICAgb24gdGhlIHRpbWUgY29tcG9uZW50cyBvZiB0aGUgZGF0YSkuIFdoZW4gYXBwbHllZCwgdGhlIHN0cmV0Y2ggcmF0aW8gbWFpbnRhaW5cbiAqICAgdGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSB2aWV3IGluIHRoZSB0aW1lbGluZS5cbiAqXG4gKiBgYGBcbiAqICsgdGltZWxpbmUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIDAgICAgICAgICA1ICAgICAgICAgMTAgICAgICAgICAgMTUgICAgICAgICAgMjAgICAgICAgIDI1ICAgICAgICAgIDMwIHNlY29uZHNcbiAqICstLS0rKioqKioqKioqKioqKioqKiorLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKyoqKioqKiorLS1cbiAqICAgICB8KioqIHNvdW5kZmlsZSAqKip8TGF5ZXIgKHZpZXcgb24gdGhlIHNvdW5kIGZpbGUpICAgICAgICAgICAgfCoqKioqKip8XG4gKiAgICAgKyoqKioqKioqKioqKioqKioqKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSsqKioqKioqK1xuICpcbiAqICAgICA8LS0tLSBvZmZzZXQgLS0tLT48LS0tLS0tLS0tLS0tLS0tIGR1cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tPlxuICogPC0tLS0tLS0tIHN0YXJ0IC0tLS0tPlxuICpcbiAqIFRoZSBwYXJ0cyBvZiB0aGUgc291bmQgZmlsZSByZXByZXNlbnRlZCB3aXRoICcqJyBhcmUgaGlkZGVuIGZyb20gdGhlIHZpZXdcbiAqIGBgYFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXllclRpbWVDb250ZXh0IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7VGltZWxpbmVUaW1lQ29udGV4dH0gcGFyZW50IC0gVGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCBpbnN0YW5jZSBvZiB0aGUgdGltZWxpbmUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJlbnQpIHtcbiAgICBpZiAoIXBhcmVudCkgeyB0aHJvdyBuZXcgRXJyb3IoJ0xheWVyVGltZUNvbnRleHQgbXVzdCBoYXZlIGEgcGFyZW50Jyk7IH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAgaW5zdGFuY2Ugb2YgdGhlIHRpbWVsaW5lLlxuICAgICAqXG4gICAgICogQHR5cGUge1RpbWVsaW5lVGltZUNvbnRleHR9XG4gICAgICovXG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG5cbiAgICB0aGlzLl90aW1lVG9QaXhlbCA9IG51bGw7XG4gICAgdGhpcy5fc3RhcnQgPSAwO1xuICAgIHRoaXMuX2R1cmF0aW9uID0gcGFyZW50LnZpc2libGVEdXJhdGlvbjtcbiAgICB0aGlzLl9vZmZzZXQgPSAwO1xuICAgIHRoaXMuX3N0cmV0Y2hSYXRpbyA9IDE7XG4gICAgLy8gcmVnaXN0ZXIgaW50byB0aGUgdGltZWxpbmUncyBUaW1lQ29udGV4dFxuICAgIHRoaXMucGFyZW50Ll9jaGlsZHJlbi5wdXNoKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGUgY3VycmVudCB0aW1lIGNvbnRleHQuXG4gICAqXG4gICAqIEByZXR1cm4ge0xheWVyVGltZUNvbnRleHR9XG4gICAqL1xuICBjbG9uZSgpIHtcbiAgICBjb25zdCBjdHggPSBuZXcgdGhpcygpO1xuXG4gICAgY3R4LnBhcmVudCA9IHRoaXMucGFyZW50O1xuICAgIGN0eC5zdGFydCA9IHRoaXMuc3RhcnQ7XG4gICAgY3R4LmR1cmF0aW9uID0gdGhpcy5kdXJhdGlvbjtcbiAgICBjdHgub2Zmc2V0ID0gdGhpcy5vZmZzZXQ7XG4gICAgY3R4LnN0cmV0Y2hSYXRpbyA9IHRoaXMuc3RyZXRjaFJhdGlvOyAvLyBjcmVhdGVzIHRoZSBsb2NhbCBzY2FsZSBpZiBuZWVkZWRcblxuICAgIHJldHVybiBjdHg7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHRpbWUgY29udGV4dCAoaW4gc2Vjb25kcykuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgc3RhcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSB0aW1lIGNvbnRleHQgKGluIHNlY29uZHMpLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IHN0YXJ0KHZhbHVlKSB7XG4gICAgdGhpcy5fc3RhcnQgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkdXJhdGlvbiBvZiB0aGUgdGltZSBjb250ZXh0IChpbiBzZWNvbmRzKS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBkdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fZHVyYXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgZHVyYXRpb24gb2YgdGhlIHRpbWUgY29udGV4dCAoaW4gc2Vjb25kcykuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgZHVyYXRpb24odmFsdWUpIHtcbiAgICB0aGlzLl9kdXJhdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG9mZnNldCBvZiB0aGUgdGltZSBjb250ZXh0IChpbiBzZWNvbmRzKS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29mZnNldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBvZmZzZXQgb2YgdGhlIHRpbWUgY29udGV4dCAoaW4gc2Vjb25kcykuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgb2Zmc2V0KHZhbHVlKSB7XG4gICAgdGhpcy5fb2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc3RyZXRjaCByYXRpbyBvZiB0aGUgdGltZSBjb250ZXh0LlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHN0cmV0Y2hSYXRpbygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RyZXRjaFJhdGlvO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHN0cmV0Y2ggcmF0aW8gb2YgdGhlIHRpbWUgY29udGV4dC5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBzdHJldGNoUmF0aW8odmFsdWUpIHtcbiAgICAvLyByZW1vdmUgbG9jYWwgc2NhbGUgaWYgcmF0aW8gPSAxXG4gICAgaWYgKHZhbHVlID09PSAgMSkge1xuICAgICAgdGhpcy5fdGltZVRvUGl4ZWwgPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyByZXVzZSBwcmV2aXNvdXNseSBjcmVhdGVkIGxvY2FsIHNjYWxlIGlmIGV4aXN0c1xuICAgIGNvbnN0IHRpbWVUb1BpeGVsID0gdGhpcy5fdGltZVRvUGl4ZWwgP1xuICAgICAgdGhpcy5fdGltZVRvUGl4ZWwgOiBzY2FsZXMubGluZWFyKCkuZG9tYWluKFswLCAxXSk7XG5cbiAgICB0aW1lVG9QaXhlbC5yYW5nZShbMCwgdGhpcy5wYXJlbnQuY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQgKiB2YWx1ZV0pO1xuXG4gICAgdGhpcy5fdGltZVRvUGl4ZWwgPSB0aW1lVG9QaXhlbDtcbiAgICB0aGlzLl9zdHJldGNoUmF0aW8gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0aW1lIHRvIHBpeGVsIHRyYW5zZmVydCBmdW5jdGlvbiBvZiB0aGUgdGltZSBjb250ZXh0LiBJZlxuICAgKiB0aGUgYHN0cmV0Y2hSYXRpb2AgYXR0cmlidXRlIGlzIGVxdWFsIHRvIDEsIHRoaXMgZnVuY3Rpb24gaXMgdGhlIGdsb2JhbFxuICAgKiBvbmUgZnJvbSB0aGUgYFRpbWVsaW5lVGltZUNvbnRleHRgIGluc3RhbmNlLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBnZXQgdGltZVRvUGl4ZWwoKSB7XG4gICAgaWYgKCF0aGlzLl90aW1lVG9QaXhlbCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnRpbWVUb1BpeGVsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl90aW1lVG9QaXhlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gY29udmVydCBwaXhlbCB0byB0aW1lLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcHhcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgcGl4ZWxUb1RpbWUocHgpIHtcbiAgICBpZiAoIXRoaXMuX3RpbWVUb1BpeGVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQudGltZVRvUGl4ZWwuaW52ZXJ0KHB4KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fdGltZVRvUGl4ZWwuaW52ZXJ0KHB4KTtcbiAgfVxufVxuIl19