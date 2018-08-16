'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _scales = require('../utils/scales');

var _scales2 = _interopRequireDefault(_scales);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var LayerTimeContext = function () {
  /**
   * @param {TimelineTimeContext} parent - The `TimelineTimeContext` instance of the timeline.
   */
  function LayerTimeContext(parent) {
    (0, _classCallCheck3.default)(this, LayerTimeContext);

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


  (0, _createClass3.default)(LayerTimeContext, [{
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
    }

    /**
     * Sets the start position of the time context (in seconds).
     *
     * @type {Number}
     */
    ,
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
    }

    /**
     * Sets the duration of the time context (in seconds).
     *
     * @type {Number}
     */
    ,
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
    }

    /**
     * Sets the offset of the time context (in seconds).
     *
     * @type {Number}
     */
    ,
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
    }

    /**
     * Sets the stretch ratio of the time context.
     *
     * @type {Number}
     */
    ,
    set: function set(value) {
      // remove local scale if ratio = 1
      if (value === 1) {
        this._timeToPixel = null;
        return;
      }
      // reuse previsously created local scale if exists
      var timeToPixel = this._timeToPixel ? this._timeToPixel : _scales2.default.linear().domain([0, 1]);

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
      if (!this._timeToPixel) return this.parent.timeToPixel;

      return this._timeToPixel;
    }
  }]);
  return LayerTimeContext;
}();

exports.default = LayerTimeContext;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxheWVyVGltZUNvbnRleHQuanMiXSwibmFtZXMiOlsiTGF5ZXJUaW1lQ29udGV4dCIsInBhcmVudCIsIkVycm9yIiwiX3RpbWVUb1BpeGVsIiwiX3N0YXJ0IiwiX2R1cmF0aW9uIiwidmlzaWJsZUR1cmF0aW9uIiwiX29mZnNldCIsIl9zdHJldGNoUmF0aW8iLCJfY2hpbGRyZW4iLCJwdXNoIiwiY3R4Iiwic3RhcnQiLCJkdXJhdGlvbiIsIm9mZnNldCIsInN0cmV0Y2hSYXRpbyIsInB4IiwidGltZVRvUGl4ZWwiLCJpbnZlcnQiLCJ2YWx1ZSIsImxpbmVhciIsImRvbWFpbiIsInJhbmdlIiwiY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWdDTUEsZ0I7QUFDSjs7O0FBR0EsNEJBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFDbEIsUUFBSSxDQUFDQSxNQUFMLEVBQWE7QUFBRSxZQUFNLElBQUlDLEtBQUosQ0FBVSxxQ0FBVixDQUFOO0FBQXlEOztBQUV4RTs7Ozs7QUFLQSxTQUFLRCxNQUFMLEdBQWNBLE1BQWQ7O0FBRUEsU0FBS0UsWUFBTCxHQUFvQixJQUFwQjtBQUNBLFNBQUtDLE1BQUwsR0FBYyxDQUFkO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQkosT0FBT0ssZUFBeEI7QUFDQSxTQUFLQyxPQUFMLEdBQWUsQ0FBZjtBQUNBLFNBQUtDLGFBQUwsR0FBcUIsQ0FBckI7QUFDQTtBQUNBLFNBQUtQLE1BQUwsQ0FBWVEsU0FBWixDQUFzQkMsSUFBdEIsQ0FBMkIsSUFBM0I7QUFDRDs7QUFFRDs7Ozs7Ozs7OzRCQUtRO0FBQ04sVUFBTUMsTUFBTSxJQUFJLElBQUosRUFBWjs7QUFFQUEsVUFBSVYsTUFBSixHQUFhLEtBQUtBLE1BQWxCO0FBQ0FVLFVBQUlDLEtBQUosR0FBWSxLQUFLQSxLQUFqQjtBQUNBRCxVQUFJRSxRQUFKLEdBQWUsS0FBS0EsUUFBcEI7QUFDQUYsVUFBSUcsTUFBSixHQUFhLEtBQUtBLE1BQWxCO0FBQ0FILFVBQUlJLFlBQUosR0FBbUIsS0FBS0EsWUFBeEIsQ0FQTSxDQU9nQzs7QUFFdEMsYUFBT0osR0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7O0FBa0dBOzs7Ozs7Z0NBTVlLLEUsRUFBSTtBQUNkLFVBQUksQ0FBQyxLQUFLYixZQUFWLEVBQXdCO0FBQ3RCLGVBQU8sS0FBS0YsTUFBTCxDQUFZZ0IsV0FBWixDQUF3QkMsTUFBeEIsQ0FBK0JGLEVBQS9CLENBQVA7QUFDRDs7QUFFRCxhQUFPLEtBQUtiLFlBQUwsQ0FBa0JlLE1BQWxCLENBQXlCRixFQUF6QixDQUFQO0FBQ0Q7Ozt3QkF6R1c7QUFDVixhQUFPLEtBQUtaLE1BQVo7QUFDRDs7QUFFRDs7Ozs7O3NCQUtVZSxLLEVBQU87QUFDZixXQUFLZixNQUFMLEdBQWNlLEtBQWQ7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBS2U7QUFDYixhQUFPLEtBQUtkLFNBQVo7QUFDRDs7QUFFRDs7Ozs7O3NCQUthYyxLLEVBQU87QUFDbEIsV0FBS2QsU0FBTCxHQUFpQmMsS0FBakI7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBS2E7QUFDWCxhQUFPLEtBQUtaLE9BQVo7QUFDRDs7QUFFRDs7Ozs7O3NCQUtXWSxLLEVBQU87QUFDaEIsV0FBS1osT0FBTCxHQUFlWSxLQUFmO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUttQjtBQUNqQixhQUFPLEtBQUtYLGFBQVo7QUFDRDs7QUFFRDs7Ozs7O3NCQUtpQlcsSyxFQUFPO0FBQ3RCO0FBQ0EsVUFBSUEsVUFBVyxDQUFmLEVBQWtCO0FBQ2hCLGFBQUtoQixZQUFMLEdBQW9CLElBQXBCO0FBQ0E7QUFDRDtBQUNEO0FBQ0EsVUFBTWMsY0FBYyxLQUFLZCxZQUFMLEdBQ2xCLEtBQUtBLFlBRGEsR0FDRSxpQkFBT2lCLE1BQVAsR0FBZ0JDLE1BQWhCLENBQXVCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBdkIsQ0FEdEI7O0FBR0FKLGtCQUFZSyxLQUFaLENBQWtCLENBQUMsQ0FBRCxFQUFJLEtBQUtyQixNQUFMLENBQVlzQix1QkFBWixHQUFzQ0osS0FBMUMsQ0FBbEI7O0FBRUEsV0FBS2hCLFlBQUwsR0FBb0JjLFdBQXBCO0FBQ0EsV0FBS1QsYUFBTCxHQUFxQlcsS0FBckI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozt3QkFPa0I7QUFDaEIsVUFBSSxDQUFDLEtBQUtoQixZQUFWLEVBQ0UsT0FBTyxLQUFLRixNQUFMLENBQVlnQixXQUFuQjs7QUFFRixhQUFPLEtBQUtkLFlBQVo7QUFDRDs7Ozs7a0JBaUJZSCxnQiIsImZpbGUiOiJMYXllclRpbWVDb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNjYWxlcyBmcm9tICcuLi91dGlscy9zY2FsZXMnO1xuXG5cbi8qKlxuICogQSBgTGF5ZXJUaW1lQ29udGV4dGAgaW5zdGFuY2UgcmVwcmVzZW50cyBhIHRpbWUgc2VnbWVudCBpbnRvIGEgYFRpbWVsaW5lVGltZUNvbnRleHRgLlxuICogSXQgbXVzdCBiZSBhdHRhY2hlZCB0byBhIGBUaW1lbGluZVRpbWVDb250ZXh0YCAodGhlIG9uZSBvZiB0aGUgdGltZWxpbmUgaXRcbiAqIGJlbG9uZ3MgdG8pLiBJdCByZWxpZXMgb24gaXRzIHBhcmVudCdzIGB0aW1lVG9QaXhlbGAgKHRpbWUgdG8gcGl4ZWwgdHJhbnNmZXJ0XG4gKiBmdW5jdGlvbikgdG8gY3JlYXRlIHRoZSB0aW1lIHRvIHBpeGVsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBMYXllciAodGhlIHZpZXcpIGl0IGlzIGF0dGFjaGVkIHRvLlxuICpcbiAqIFRoZSBgbGF5ZXJUaW1lQ29udGV4dGAgaGFzIGZvdXIgaW1wb3J0YW50IGF0dHJpYnV0ZXM6XG4gKiAtIGBzdGFydGAgcmVwcmVzZW50IHRoZSB0aW1lIGF0IHdoaWNoIHRlbXBvcmFsIGRhdGEgbXVzdCBiZSByZXByZXNlbnRlZFxuICogICBpbiB0aGUgdGltZWxpbmUgKGZvciBpbnN0YW5jZSB0aGUgYmVnaW5pbmcgb2YgYSBzb3VuZGZpbGUgaW4gYSBEQVcpLlxuICogLSBgb2Zmc2V0YCByZXByZXNlbnRzIG9mZnNldCB0aW1lIG9mIHRoZSBkYXRhIGluIHRoZSBjb250ZXh0IG9mIGEgTGF5ZXIuXG4gKiAgIChAVE9ETyBnaXZlIGEgdXNlIGNhc2UgZXhhbXBsZSBoZXJlIFwiY3JvcCA/XCIsIGFuZC9vciBleHBsYWluIHRoYXQgaXQncyBub3QgYSBjb21tb24gdXNlIGNhc2UpLlxuICogLSBgZHVyYXRpb25gIGlzIHRoZSBkdXJhdGlvbiBvZiB0aGUgdmlldyBvbiB0aGUgZGF0YS5cbiAqIC0gYHN0cmV0Y2hSYXRpb2AgaXMgdGhlIHN0cmV0Y2ggYXBwbHllZCB0byB0aGUgdGVtcG9yYWwgZGF0YSBjb250YWluZWQgaW5cbiAqICAgdGhlIHZpZXcgKHRoaXMgdmFsdWUgY2FuIGJlIHNlZW4gYXMgYSBsb2NhbCB6b29tIG9uIHRoZSBkYXRhLCBvciBhcyBhIHN0cmV0Y2hcbiAqICAgb24gdGhlIHRpbWUgY29tcG9uZW50cyBvZiB0aGUgZGF0YSkuIFdoZW4gYXBwbHllZCwgdGhlIHN0cmV0Y2ggcmF0aW8gbWFpbnRhaW5cbiAqICAgdGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSB2aWV3IGluIHRoZSB0aW1lbGluZS5cbiAqXG4gKiBgYGBcbiAqICsgdGltZWxpbmUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIDAgICAgICAgICA1ICAgICAgICAgMTAgICAgICAgICAgMTUgICAgICAgICAgMjAgICAgICAgIDI1ICAgICAgICAgIDMwIHNlY29uZHNcbiAqICstLS0rKioqKioqKioqKioqKioqKiorLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKyoqKioqKiorLS1cbiAqICAgICB8KioqIHNvdW5kZmlsZSAqKip8TGF5ZXIgKHZpZXcgb24gdGhlIHNvdW5kIGZpbGUpICAgICAgICAgICAgfCoqKioqKip8XG4gKiAgICAgKyoqKioqKioqKioqKioqKioqKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSsqKioqKioqK1xuICpcbiAqICAgICA8LS0tLSBvZmZzZXQgLS0tLT48LS0tLS0tLS0tLS0tLS0tIGR1cmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tPlxuICogPC0tLS0tLS0tIHN0YXJ0IC0tLS0tPlxuICpcbiAqIFRoZSBwYXJ0cyBvZiB0aGUgc291bmQgZmlsZSByZXByZXNlbnRlZCB3aXRoICcqJyBhcmUgaGlkZGVuIGZyb20gdGhlIHZpZXdcbiAqIGBgYFxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL3RpbWUtY29udGV4dHMuaHRtbClcbiAqL1xuY2xhc3MgTGF5ZXJUaW1lQ29udGV4dCB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge1RpbWVsaW5lVGltZUNvbnRleHR9IHBhcmVudCAtIFRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAgaW5zdGFuY2Ugb2YgdGhlIHRpbWVsaW5lLlxuICAgKi9cbiAgY29uc3RydWN0b3IocGFyZW50KSB7XG4gICAgaWYgKCFwYXJlbnQpIHsgdGhyb3cgbmV3IEVycm9yKCdMYXllclRpbWVDb250ZXh0IG11c3QgaGF2ZSBhIHBhcmVudCcpOyB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYFRpbWVsaW5lVGltZUNvbnRleHRgIGluc3RhbmNlIG9mIHRoZSB0aW1lbGluZS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtUaW1lbGluZVRpbWVDb250ZXh0fVxuICAgICAqL1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuXG4gICAgdGhpcy5fdGltZVRvUGl4ZWwgPSBudWxsO1xuICAgIHRoaXMuX3N0YXJ0ID0gMDtcbiAgICB0aGlzLl9kdXJhdGlvbiA9IHBhcmVudC52aXNpYmxlRHVyYXRpb247XG4gICAgdGhpcy5fb2Zmc2V0ID0gMDtcbiAgICB0aGlzLl9zdHJldGNoUmF0aW8gPSAxO1xuICAgIC8vIHJlZ2lzdGVyIGludG8gdGhlIHRpbWVsaW5lJ3MgVGltZUNvbnRleHRcbiAgICB0aGlzLnBhcmVudC5fY2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgY2xvbmUgb2YgdGhlIGN1cnJlbnQgdGltZSBjb250ZXh0LlxuICAgKlxuICAgKiBAcmV0dXJuIHtMYXllclRpbWVDb250ZXh0fVxuICAgKi9cbiAgY2xvbmUoKSB7XG4gICAgY29uc3QgY3R4ID0gbmV3IHRoaXMoKTtcblxuICAgIGN0eC5wYXJlbnQgPSB0aGlzLnBhcmVudDtcbiAgICBjdHguc3RhcnQgPSB0aGlzLnN0YXJ0O1xuICAgIGN0eC5kdXJhdGlvbiA9IHRoaXMuZHVyYXRpb247XG4gICAgY3R4Lm9mZnNldCA9IHRoaXMub2Zmc2V0O1xuICAgIGN0eC5zdHJldGNoUmF0aW8gPSB0aGlzLnN0cmV0Y2hSYXRpbzsgLy8gY3JlYXRlcyB0aGUgbG9jYWwgc2NhbGUgaWYgbmVlZGVkXG5cbiAgICByZXR1cm4gY3R4O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSB0aW1lIGNvbnRleHQgKGluIHNlY29uZHMpLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHN0YXJ0KCkge1xuICAgIHJldHVybiB0aGlzLl9zdGFydDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgdGltZSBjb250ZXh0IChpbiBzZWNvbmRzKS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBzdGFydCh2YWx1ZSkge1xuICAgIHRoaXMuX3N0YXJ0ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZHVyYXRpb24gb2YgdGhlIHRpbWUgY29udGV4dCAoaW4gc2Vjb25kcykuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgZHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2R1cmF0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGR1cmF0aW9uIG9mIHRoZSB0aW1lIGNvbnRleHQgKGluIHNlY29uZHMpLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IGR1cmF0aW9uKHZhbHVlKSB7XG4gICAgdGhpcy5fZHVyYXRpb24gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBvZmZzZXQgb2YgdGhlIHRpbWUgY29udGV4dCAoaW4gc2Vjb25kcykuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgb2Zmc2V0KCkge1xuICAgIHJldHVybiB0aGlzLl9vZmZzZXQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgb2Zmc2V0IG9mIHRoZSB0aW1lIGNvbnRleHQgKGluIHNlY29uZHMpLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMuX29mZnNldCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHN0cmV0Y2ggcmF0aW8gb2YgdGhlIHRpbWUgY29udGV4dC5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBzdHJldGNoUmF0aW8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0cmV0Y2hSYXRpbztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzdHJldGNoIHJhdGlvIG9mIHRoZSB0aW1lIGNvbnRleHQuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgc3RyZXRjaFJhdGlvKHZhbHVlKSB7XG4gICAgLy8gcmVtb3ZlIGxvY2FsIHNjYWxlIGlmIHJhdGlvID0gMVxuICAgIGlmICh2YWx1ZSA9PT0gIDEpIHtcbiAgICAgIHRoaXMuX3RpbWVUb1BpeGVsID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gcmV1c2UgcHJldmlzb3VzbHkgY3JlYXRlZCBsb2NhbCBzY2FsZSBpZiBleGlzdHNcbiAgICBjb25zdCB0aW1lVG9QaXhlbCA9IHRoaXMuX3RpbWVUb1BpeGVsID9cbiAgICAgIHRoaXMuX3RpbWVUb1BpeGVsIDogc2NhbGVzLmxpbmVhcigpLmRvbWFpbihbMCwgMV0pO1xuXG4gICAgdGltZVRvUGl4ZWwucmFuZ2UoWzAsIHRoaXMucGFyZW50LmNvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kICogdmFsdWVdKTtcblxuICAgIHRoaXMuX3RpbWVUb1BpeGVsID0gdGltZVRvUGl4ZWw7XG4gICAgdGhpcy5fc3RyZXRjaFJhdGlvID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdGltZSB0byBwaXhlbCB0cmFuc2ZlcnQgZnVuY3Rpb24gb2YgdGhlIHRpbWUgY29udGV4dC4gSWZcbiAgICogdGhlIGBzdHJldGNoUmF0aW9gIGF0dHJpYnV0ZSBpcyBlcXVhbCB0byAxLCB0aGlzIGZ1bmN0aW9uIGlzIHRoZSBnbG9iYWxcbiAgICogb25lIGZyb20gdGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCBpbnN0YW5jZS5cbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgZ2V0IHRpbWVUb1BpeGVsKCkge1xuICAgIGlmICghdGhpcy5fdGltZVRvUGl4ZWwpXG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQudGltZVRvUGl4ZWw7XG5cbiAgICByZXR1cm4gdGhpcy5fdGltZVRvUGl4ZWw7XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIGZ1bmN0aW9uIHRvIGNvbnZlcnQgcGl4ZWwgdG8gdGltZS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHB4XG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4gIHBpeGVsVG9UaW1lKHB4KSB7XG4gICAgaWYgKCF0aGlzLl90aW1lVG9QaXhlbCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnRpbWVUb1BpeGVsLmludmVydChweCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3RpbWVUb1BpeGVsLmludmVydChweCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGF5ZXJUaW1lQ29udGV4dDtcbiJdfQ==