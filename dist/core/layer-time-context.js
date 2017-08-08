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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxheWVyLXRpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6WyJMYXllclRpbWVDb250ZXh0IiwicGFyZW50IiwiRXJyb3IiLCJfdGltZVRvUGl4ZWwiLCJfc3RhcnQiLCJfZHVyYXRpb24iLCJ2aXNpYmxlRHVyYXRpb24iLCJfb2Zmc2V0IiwiX3N0cmV0Y2hSYXRpbyIsIl9jaGlsZHJlbiIsInB1c2giLCJjdHgiLCJzdGFydCIsImR1cmF0aW9uIiwib2Zmc2V0Iiwic3RyZXRjaFJhdGlvIiwicHgiLCJ0aW1lVG9QaXhlbCIsImludmVydCIsInZhbHVlIiwibGluZWFyIiwiZG9tYWluIiwicmFuZ2UiLCJjb21wdXRlZFBpeGVsc1BlclNlY29uZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBZ0NxQkEsZ0I7QUFDbkI7OztBQUdBLDRCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCLFFBQUksQ0FBQ0EsTUFBTCxFQUFhO0FBQUUsWUFBTSxJQUFJQyxLQUFKLENBQVUscUNBQVYsQ0FBTjtBQUF5RDs7QUFFeEU7Ozs7O0FBS0EsU0FBS0QsTUFBTCxHQUFjQSxNQUFkOztBQUVBLFNBQUtFLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxTQUFLQyxNQUFMLEdBQWMsQ0FBZDtBQUNBLFNBQUtDLFNBQUwsR0FBaUJKLE9BQU9LLGVBQXhCO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLENBQWY7QUFDQSxTQUFLQyxhQUFMLEdBQXFCLENBQXJCO0FBQ0E7QUFDQSxTQUFLUCxNQUFMLENBQVlRLFNBQVosQ0FBc0JDLElBQXRCLENBQTJCLElBQTNCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs0QkFLUTtBQUNOLFVBQU1DLE1BQU0sSUFBSSxJQUFKLEVBQVo7O0FBRUFBLFVBQUlWLE1BQUosR0FBYSxLQUFLQSxNQUFsQjtBQUNBVSxVQUFJQyxLQUFKLEdBQVksS0FBS0EsS0FBakI7QUFDQUQsVUFBSUUsUUFBSixHQUFlLEtBQUtBLFFBQXBCO0FBQ0FGLFVBQUlHLE1BQUosR0FBYSxLQUFLQSxNQUFsQjtBQUNBSCxVQUFJSSxZQUFKLEdBQW1CLEtBQUtBLFlBQXhCLENBUE0sQ0FPZ0M7O0FBRXRDLGFBQU9KLEdBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7OztBQWtHQTs7Ozs7O2dDQU1ZSyxFLEVBQUk7QUFDZCxVQUFJLENBQUMsS0FBS2IsWUFBVixFQUF3QjtBQUN0QixlQUFPLEtBQUtGLE1BQUwsQ0FBWWdCLFdBQVosQ0FBd0JDLE1BQXhCLENBQStCRixFQUEvQixDQUFQO0FBQ0Q7O0FBRUQsYUFBTyxLQUFLYixZQUFMLENBQWtCZSxNQUFsQixDQUF5QkYsRUFBekIsQ0FBUDtBQUNEOzs7d0JBekdXO0FBQ1YsYUFBTyxLQUFLWixNQUFaO0FBQ0Q7O0FBRUQ7Ozs7OztzQkFLVWUsSyxFQUFPO0FBQ2YsV0FBS2YsTUFBTCxHQUFjZSxLQUFkO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUtlO0FBQ2IsYUFBTyxLQUFLZCxTQUFaO0FBQ0Q7O0FBRUQ7Ozs7OztzQkFLYWMsSyxFQUFPO0FBQ2xCLFdBQUtkLFNBQUwsR0FBaUJjLEtBQWpCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUthO0FBQ1gsYUFBTyxLQUFLWixPQUFaO0FBQ0Q7O0FBRUQ7Ozs7OztzQkFLV1ksSyxFQUFPO0FBQ2hCLFdBQUtaLE9BQUwsR0FBZVksS0FBZjtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLbUI7QUFDakIsYUFBTyxLQUFLWCxhQUFaO0FBQ0Q7O0FBRUQ7Ozs7OztzQkFLaUJXLEssRUFBTztBQUN0QjtBQUNBLFVBQUlBLFVBQVcsQ0FBZixFQUFrQjtBQUNoQixhQUFLaEIsWUFBTCxHQUFvQixJQUFwQjtBQUNBO0FBQ0Q7QUFDRDtBQUNBLFVBQU1jLGNBQWMsS0FBS2QsWUFBTCxHQUNsQixLQUFLQSxZQURhLEdBQ0UsaUJBQU9pQixNQUFQLEdBQWdCQyxNQUFoQixDQUF1QixDQUFDLENBQUQsRUFBSSxDQUFKLENBQXZCLENBRHRCOztBQUdBSixrQkFBWUssS0FBWixDQUFrQixDQUFDLENBQUQsRUFBSSxLQUFLckIsTUFBTCxDQUFZc0IsdUJBQVosR0FBc0NKLEtBQTFDLENBQWxCOztBQUVBLFdBQUtoQixZQUFMLEdBQW9CYyxXQUFwQjtBQUNBLFdBQUtULGFBQUwsR0FBcUJXLEtBQXJCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7d0JBT2tCO0FBQ2hCLFVBQUksQ0FBQyxLQUFLaEIsWUFBVixFQUNFLE9BQU8sS0FBS0YsTUFBTCxDQUFZZ0IsV0FBbkI7O0FBRUYsYUFBTyxLQUFLZCxZQUFaO0FBQ0Q7Ozs7O2tCQXhJa0JILGdCIiwiZmlsZSI6ImxheWVyLXRpbWUtY29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzY2FsZXMgZnJvbSAnLi4vdXRpbHMvc2NhbGVzJztcblxuXG4vKipcbiAqIEEgYExheWVyVGltZUNvbnRleHRgIGluc3RhbmNlIHJlcHJlc2VudHMgYSB0aW1lIHNlZ21lbnQgaW50byBhIGBUaW1lbGluZVRpbWVDb250ZXh0YC5cbiAqIEl0IG11c3QgYmUgYXR0YWNoZWQgdG8gYSBgVGltZWxpbmVUaW1lQ29udGV4dGAgKHRoZSBvbmUgb2YgdGhlIHRpbWVsaW5lIGl0XG4gKiBiZWxvbmdzIHRvKS4gSXQgcmVsaWVzIG9uIGl0cyBwYXJlbnQncyBgdGltZVRvUGl4ZWxgICh0aW1lIHRvIHBpeGVsIHRyYW5zZmVydFxuICogZnVuY3Rpb24pIHRvIGNyZWF0ZSB0aGUgdGltZSB0byBwaXhlbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgTGF5ZXIgKHRoZSB2aWV3KSBpdCBpcyBhdHRhY2hlZCB0by5cbiAqXG4gKiBUaGUgYGxheWVyVGltZUNvbnRleHRgIGhhcyBmb3VyIGltcG9ydGFudCBhdHRyaWJ1dGVzOlxuICogLSBgc3RhcnRgIHJlcHJlc2VudCB0aGUgdGltZSBhdCB3aGljaCB0ZW1wb3JhbCBkYXRhIG11c3QgYmUgcmVwcmVzZW50ZWRcbiAqICAgaW4gdGhlIHRpbWVsaW5lIChmb3IgaW5zdGFuY2UgdGhlIGJlZ2luaW5nIG9mIGEgc291bmRmaWxlIGluIGEgREFXKS5cbiAqIC0gYG9mZnNldGAgcmVwcmVzZW50cyBvZmZzZXQgdGltZSBvZiB0aGUgZGF0YSBpbiB0aGUgY29udGV4dCBvZiBhIExheWVyLlxuICogICAoQFRPRE8gZ2l2ZSBhIHVzZSBjYXNlIGV4YW1wbGUgaGVyZSBcImNyb3AgP1wiLCBhbmQvb3IgZXhwbGFpbiB0aGF0IGl0J3Mgbm90IGEgY29tbW9uIHVzZSBjYXNlKS5cbiAqIC0gYGR1cmF0aW9uYCBpcyB0aGUgZHVyYXRpb24gb2YgdGhlIHZpZXcgb24gdGhlIGRhdGEuXG4gKiAtIGBzdHJldGNoUmF0aW9gIGlzIHRoZSBzdHJldGNoIGFwcGx5ZWQgdG8gdGhlIHRlbXBvcmFsIGRhdGEgY29udGFpbmVkIGluXG4gKiAgIHRoZSB2aWV3ICh0aGlzIHZhbHVlIGNhbiBiZSBzZWVuIGFzIGEgbG9jYWwgem9vbSBvbiB0aGUgZGF0YSwgb3IgYXMgYSBzdHJldGNoXG4gKiAgIG9uIHRoZSB0aW1lIGNvbXBvbmVudHMgb2YgdGhlIGRhdGEpLiBXaGVuIGFwcGx5ZWQsIHRoZSBzdHJldGNoIHJhdGlvIG1haW50YWluXG4gKiAgIHRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgdmlldyBpbiB0aGUgdGltZWxpbmUuXG4gKlxuICogYGBgXG4gKiArIHRpbWVsaW5lIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiAwICAgICAgICAgNSAgICAgICAgIDEwICAgICAgICAgIDE1ICAgICAgICAgIDIwICAgICAgICAyNSAgICAgICAgICAzMCBzZWNvbmRzXG4gKiArLS0tKyoqKioqKioqKioqKioqKioqKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSsqKioqKioqKy0tXG4gKiAgICAgfCoqKiBzb3VuZGZpbGUgKioqfExheWVyICh2aWV3IG9uIHRoZSBzb3VuZCBmaWxlKSAgICAgICAgICAgIHwqKioqKioqfFxuICogICAgICsqKioqKioqKioqKioqKioqKistLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rKioqKioqKitcbiAqXG4gKiAgICAgPC0tLS0gb2Zmc2V0IC0tLS0+PC0tLS0tLS0tLS0tLS0tLSBkdXJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLT5cbiAqIDwtLS0tLS0tLSBzdGFydCAtLS0tLT5cbiAqXG4gKiBUaGUgcGFydHMgb2YgdGhlIHNvdW5kIGZpbGUgcmVwcmVzZW50ZWQgd2l0aCAnKicgYXJlIGhpZGRlbiBmcm9tIHRoZSB2aWV3XG4gKiBgYGBcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy90aW1lLWNvbnRleHRzLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExheWVyVGltZUNvbnRleHQge1xuICAvKipcbiAgICogQHBhcmFtIHtUaW1lbGluZVRpbWVDb250ZXh0fSBwYXJlbnQgLSBUaGUgYFRpbWVsaW5lVGltZUNvbnRleHRgIGluc3RhbmNlIG9mIHRoZSB0aW1lbGluZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhcmVudCkge1xuICAgIGlmICghcGFyZW50KSB7IHRocm93IG5ldyBFcnJvcignTGF5ZXJUaW1lQ29udGV4dCBtdXN0IGhhdmUgYSBwYXJlbnQnKTsgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCBpbnN0YW5jZSBvZiB0aGUgdGltZWxpbmUuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7VGltZWxpbmVUaW1lQ29udGV4dH1cbiAgICAgKi9cbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcblxuICAgIHRoaXMuX3RpbWVUb1BpeGVsID0gbnVsbDtcbiAgICB0aGlzLl9zdGFydCA9IDA7XG4gICAgdGhpcy5fZHVyYXRpb24gPSBwYXJlbnQudmlzaWJsZUR1cmF0aW9uO1xuICAgIHRoaXMuX29mZnNldCA9IDA7XG4gICAgdGhpcy5fc3RyZXRjaFJhdGlvID0gMTtcbiAgICAvLyByZWdpc3RlciBpbnRvIHRoZSB0aW1lbGluZSdzIFRpbWVDb250ZXh0XG4gICAgdGhpcy5wYXJlbnQuX2NoaWxkcmVuLnB1c2godGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGNsb25lIG9mIHRoZSBjdXJyZW50IHRpbWUgY29udGV4dC5cbiAgICpcbiAgICogQHJldHVybiB7TGF5ZXJUaW1lQ29udGV4dH1cbiAgICovXG4gIGNsb25lKCkge1xuICAgIGNvbnN0IGN0eCA9IG5ldyB0aGlzKCk7XG5cbiAgICBjdHgucGFyZW50ID0gdGhpcy5wYXJlbnQ7XG4gICAgY3R4LnN0YXJ0ID0gdGhpcy5zdGFydDtcbiAgICBjdHguZHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uO1xuICAgIGN0eC5vZmZzZXQgPSB0aGlzLm9mZnNldDtcbiAgICBjdHguc3RyZXRjaFJhdGlvID0gdGhpcy5zdHJldGNoUmF0aW87IC8vIGNyZWF0ZXMgdGhlIGxvY2FsIHNjYWxlIGlmIG5lZWRlZFxuXG4gICAgcmV0dXJuIGN0eDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgdGltZSBjb250ZXh0IChpbiBzZWNvbmRzKS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBzdGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhcnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHRpbWUgY29udGV4dCAoaW4gc2Vjb25kcykuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgc3RhcnQodmFsdWUpIHtcbiAgICB0aGlzLl9zdGFydCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGR1cmF0aW9uIG9mIHRoZSB0aW1lIGNvbnRleHQgKGluIHNlY29uZHMpLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IGR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9kdXJhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkdXJhdGlvbiBvZiB0aGUgdGltZSBjb250ZXh0IChpbiBzZWNvbmRzKS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBkdXJhdGlvbih2YWx1ZSkge1xuICAgIHRoaXMuX2R1cmF0aW9uID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgb2Zmc2V0IG9mIHRoZSB0aW1lIGNvbnRleHQgKGluIHNlY29uZHMpLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG9mZnNldCBvZiB0aGUgdGltZSBjb250ZXh0IChpbiBzZWNvbmRzKS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBvZmZzZXQodmFsdWUpIHtcbiAgICB0aGlzLl9vZmZzZXQgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzdHJldGNoIHJhdGlvIG9mIHRoZSB0aW1lIGNvbnRleHQuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgc3RyZXRjaFJhdGlvKCkge1xuICAgIHJldHVybiB0aGlzLl9zdHJldGNoUmF0aW87XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc3RyZXRjaCByYXRpbyBvZiB0aGUgdGltZSBjb250ZXh0LlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IHN0cmV0Y2hSYXRpbyh2YWx1ZSkge1xuICAgIC8vIHJlbW92ZSBsb2NhbCBzY2FsZSBpZiByYXRpbyA9IDFcbiAgICBpZiAodmFsdWUgPT09ICAxKSB7XG4gICAgICB0aGlzLl90aW1lVG9QaXhlbCA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIHJldXNlIHByZXZpc291c2x5IGNyZWF0ZWQgbG9jYWwgc2NhbGUgaWYgZXhpc3RzXG4gICAgY29uc3QgdGltZVRvUGl4ZWwgPSB0aGlzLl90aW1lVG9QaXhlbCA/XG4gICAgICB0aGlzLl90aW1lVG9QaXhlbCA6IHNjYWxlcy5saW5lYXIoKS5kb21haW4oWzAsIDFdKTtcblxuICAgIHRpbWVUb1BpeGVsLnJhbmdlKFswLCB0aGlzLnBhcmVudC5jb21wdXRlZFBpeGVsc1BlclNlY29uZCAqIHZhbHVlXSk7XG5cbiAgICB0aGlzLl90aW1lVG9QaXhlbCA9IHRpbWVUb1BpeGVsO1xuICAgIHRoaXMuX3N0cmV0Y2hSYXRpbyA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRpbWUgdG8gcGl4ZWwgdHJhbnNmZXJ0IGZ1bmN0aW9uIG9mIHRoZSB0aW1lIGNvbnRleHQuIElmXG4gICAqIHRoZSBgc3RyZXRjaFJhdGlvYCBhdHRyaWJ1dGUgaXMgZXF1YWwgdG8gMSwgdGhpcyBmdW5jdGlvbiBpcyB0aGUgZ2xvYmFsXG4gICAqIG9uZSBmcm9tIHRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAgaW5zdGFuY2UuXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIGdldCB0aW1lVG9QaXhlbCgpIHtcbiAgICBpZiAoIXRoaXMuX3RpbWVUb1BpeGVsKVxuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnRpbWVUb1BpeGVsO1xuXG4gICAgcmV0dXJuIHRoaXMuX3RpbWVUb1BpeGVsO1xuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciBmdW5jdGlvbiB0byBjb252ZXJ0IHBpeGVsIHRvIHRpbWUuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBweFxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBwaXhlbFRvVGltZShweCkge1xuICAgIGlmICghdGhpcy5fdGltZVRvUGl4ZWwpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC50aW1lVG9QaXhlbC5pbnZlcnQocHgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl90aW1lVG9QaXhlbC5pbnZlcnQocHgpO1xuICB9XG59XG4iXX0=