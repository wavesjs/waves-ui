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
 * Defines and maintains global aspects of the visualization concerning the
 * relations between time and pixels.
 *
 * The `TimelineTimeContext` instance (unique across a visualization) keeps the
 * main reference on how many pixels should be used to represent one second
 * though its `timeToPixel` method. The attributes `zoom`, `offset` (i.e. from
 * origin) and `visibleWidth` allow for navigating in time and for maintaining
 * view consistency upon the DOM structure (`<svg>` and `<g>` tags) created by
 * the registered tracks.
 *
 * It also maintain an array of all references to `LayerTimeContext` instances
 * to propagate to `layers`, changes made on the time to pixel representation.
 *
 * [example usage](./examples/time-contexts.html)
 */
var TimelineTimeContext = function () {
  /**
   * @param {Number} pixelsPerSecond - The number of pixels that should be
   *    used to display one second.
   * @param {Number} visibleWidth - The default with of the visible area
   *    displayed in `tracks` (in pixels).
   */
  function TimelineTimeContext(pixelsPerSecond, visibleWidth) {
    (0, _classCallCheck3.default)(this, TimelineTimeContext);

    this._children = [];

    this._timeToPixel = null;
    this._offset = 0;
    this._zoom = 1;
    this._computedPixelsPerSecond = pixelsPerSecond;
    // params
    this._visibleWidth = visibleWidth;
    this._maintainVisibleDuration = false;

    // create the timeToPixel scale
    var scale = _scales2.default.linear().domain([0, 1]).range([0, pixelsPerSecond]);

    this._timeToPixel = scale;

    this._originalPixelsPerSecond = this._computedPixelsPerSecond;
  }

  /**
   * Returns the number of pixels per seconds ignoring the current zoom value.
   *
   * @type {Number}
   */


  (0, _createClass3.default)(TimelineTimeContext, [{
    key: '_updateTimeToPixelRange',
    value: function _updateTimeToPixelRange() {
      this.timeToPixel.range([0, this._computedPixelsPerSecond]);
    }
  }, {
    key: 'pixelsPerSecond',
    get: function get() {
      return this._originalPixelsPerSecond;
    }

    /**
     * Updates all the caracteristics of this object according to the new
     * given value of pixels per seconds. Propagates the changes to the
     * `LayerTimeContext` children.
     *
     * @type {Number}
     */
    ,
    set: function set(value) {
      this._computedPixelsPerSecond = value * this.zoom;
      this._originalPixelsPerSecond = value;
      this._updateTimeToPixelRange();

      // force children scale update
      this._children.forEach(function (child) {
        if (child.stretchRatio !== 1) child.stretchRatio = child.stretchRatio;
      });
    }

    /**
     * Returns the number of pixels per seconds including the current zoom value.
     *
     * @type {Number}
     */

  }, {
    key: 'computedPixelsPerSecond',
    get: function get() {
      return this._computedPixelsPerSecond;
    }

    /**
     * Returns the current offset applied to the registered `Track` instances
     * from origin (in seconds).
     *
     * @type {Number}
     */

  }, {
    key: 'offset',
    get: function get() {
      return this._offset;
    }

    /**
     * Sets the offset to apply to the registered `Track` instances from origin
     * (in seconds).
     *
     * @type {Number}
     */
    ,
    set: function set(value) {
      this._offset = value;
    }

    /**
     * Returns the current zoom level applied to the whole visualization.
     *
     * @type {Number}
     */

  }, {
    key: 'zoom',
    get: function get() {
      return this._zoom;
    }

    /**
     * Sets the zoom ratio for the whole visualization.
     *
     * @type {Number}
     */
    ,
    set: function set(value) {
      // Compute change to propagate to children who have their own timeToPixel
      var ratioChange = value / this._zoom;
      this._zoom = value;
      this._computedPixelsPerSecond = this._originalPixelsPerSecond * value;
      this._updateTimeToPixelRange();

      this._children.forEach(function (child) {
        if (child.stretchRatio !== 1) child.stretchRatio = child.stretchRatio * ratioChange;
      });
    }

    /**
     * Returns the visible width of the `Track` instances.
     *
     * @type {Number}
     */

  }, {
    key: 'visibleWidth',
    get: function get() {
      return this._visibleWidth;
    }

    /**
     * Sets the visible width of the `Track` instances.
     *
     * @type {Number}
     */
    ,
    set: function set(value) {
      var widthRatio = value / this._visibleWidth;
      this._visibleWidth = value;

      if (this.maintainVisibleDuration) this.pixelsPerSecond = this.pixelsPerSecond * widthRatio;
    }

    /**
     * Returns the duration displayed by `Track` instances.
     *
     * @type {Number}
     */

  }, {
    key: 'visibleDuration',
    get: function get() {
      return this.visibleWidth / this._computedPixelsPerSecond;
    }

    /**
     * Returns if the duration displayed by tracks should be maintained when
     * their width is updated.
     *
     * @type {Number}
     */

  }, {
    key: 'maintainVisibleDuration',
    get: function get() {
      return this._maintainVisibleDuration;
    }

    /**
     * Defines if the duration displayed by tracks should be maintained when
     * their width is updated.
     *
     * @type {Boolean}
     */
    ,
    set: function set(bool) {
      this._maintainVisibleDuration = bool;
    }

    /**
     * Returns the time to pixel trasfert function.
     *
     * @type {Function}
     */

  }, {
    key: 'timeToPixel',
    get: function get() {
      return this._timeToPixel;
    }
  }]);
  return TimelineTimeContext;
}();

exports.default = TimelineTimeContext;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpbWVsaW5lLXRpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6WyJUaW1lbGluZVRpbWVDb250ZXh0IiwicGl4ZWxzUGVyU2Vjb25kIiwidmlzaWJsZVdpZHRoIiwiX2NoaWxkcmVuIiwiX3RpbWVUb1BpeGVsIiwiX29mZnNldCIsIl96b29tIiwiX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kIiwiX3Zpc2libGVXaWR0aCIsIl9tYWludGFpblZpc2libGVEdXJhdGlvbiIsInNjYWxlIiwibGluZWFyIiwiZG9tYWluIiwicmFuZ2UiLCJfb3JpZ2luYWxQaXhlbHNQZXJTZWNvbmQiLCJ0aW1lVG9QaXhlbCIsInZhbHVlIiwiem9vbSIsIl91cGRhdGVUaW1lVG9QaXhlbFJhbmdlIiwiZm9yRWFjaCIsImNoaWxkIiwic3RyZXRjaFJhdGlvIiwicmF0aW9DaGFuZ2UiLCJ3aWR0aFJhdGlvIiwibWFpbnRhaW5WaXNpYmxlRHVyYXRpb24iLCJib29sIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFHQTs7Ozs7Ozs7Ozs7Ozs7OztJQWdCcUJBLG1CO0FBQ25COzs7Ozs7QUFNQSwrQkFBWUMsZUFBWixFQUE2QkMsWUFBN0IsRUFBMkM7QUFBQTs7QUFDekMsU0FBS0MsU0FBTCxHQUFpQixFQUFqQjs7QUFFQSxTQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLENBQWY7QUFDQSxTQUFLQyxLQUFMLEdBQWEsQ0FBYjtBQUNBLFNBQUtDLHdCQUFMLEdBQWdDTixlQUFoQztBQUNBO0FBQ0EsU0FBS08sYUFBTCxHQUFxQk4sWUFBckI7QUFDQSxTQUFLTyx3QkFBTCxHQUFnQyxLQUFoQzs7QUFFQTtBQUNBLFFBQU1DLFFBQVEsaUJBQU9DLE1BQVAsR0FDWEMsTUFEVyxDQUNKLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FESSxFQUVYQyxLQUZXLENBRUwsQ0FBQyxDQUFELEVBQUlaLGVBQUosQ0FGSyxDQUFkOztBQUlBLFNBQUtHLFlBQUwsR0FBb0JNLEtBQXBCOztBQUVBLFNBQUtJLHdCQUFMLEdBQWdDLEtBQUtQLHdCQUFyQztBQUNEOztBQUVEOzs7Ozs7Ozs7OENBZ0owQjtBQUN4QixXQUFLUSxXQUFMLENBQWlCRixLQUFqQixDQUF1QixDQUFDLENBQUQsRUFBSSxLQUFLTix3QkFBVCxDQUF2QjtBQUNEOzs7d0JBN0lxQjtBQUNwQixhQUFPLEtBQUtPLHdCQUFaO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3NCQU9vQkUsSyxFQUFPO0FBQ3pCLFdBQUtULHdCQUFMLEdBQWdDUyxRQUFRLEtBQUtDLElBQTdDO0FBQ0EsV0FBS0gsd0JBQUwsR0FBZ0NFLEtBQWhDO0FBQ0EsV0FBS0UsdUJBQUw7O0FBRUE7QUFDQSxXQUFLZixTQUFMLENBQWVnQixPQUFmLENBQXVCLFVBQVNDLEtBQVQsRUFBZ0I7QUFDckMsWUFBSUEsTUFBTUMsWUFBTixLQUF1QixDQUEzQixFQUNFRCxNQUFNQyxZQUFOLEdBQXFCRCxNQUFNQyxZQUEzQjtBQUNILE9BSEQ7QUFJRDs7QUFFRDs7Ozs7Ozs7d0JBSzhCO0FBQzVCLGFBQU8sS0FBS2Qsd0JBQVo7QUFDRDs7QUFFRDs7Ozs7Ozs7O3dCQU1hO0FBQ1gsYUFBTyxLQUFLRixPQUFaO0FBQ0Q7O0FBRUQ7Ozs7Ozs7c0JBTVdXLEssRUFBTztBQUNoQixXQUFLWCxPQUFMLEdBQWVXLEtBQWY7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBS1c7QUFDVCxhQUFPLEtBQUtWLEtBQVo7QUFDRDs7QUFFRDs7Ozs7O3NCQUtTVSxLLEVBQU87QUFDZDtBQUNBLFVBQU1NLGNBQWNOLFFBQVEsS0FBS1YsS0FBakM7QUFDQSxXQUFLQSxLQUFMLEdBQWFVLEtBQWI7QUFDQSxXQUFLVCx3QkFBTCxHQUFnQyxLQUFLTyx3QkFBTCxHQUFnQ0UsS0FBaEU7QUFDQSxXQUFLRSx1QkFBTDs7QUFFQSxXQUFLZixTQUFMLENBQWVnQixPQUFmLENBQXVCLFVBQVNDLEtBQVQsRUFBZ0I7QUFDckMsWUFBSUEsTUFBTUMsWUFBTixLQUF1QixDQUEzQixFQUNFRCxNQUFNQyxZQUFOLEdBQXFCRCxNQUFNQyxZQUFOLEdBQXFCQyxXQUExQztBQUNILE9BSEQ7QUFJRDs7QUFFRDs7Ozs7Ozs7d0JBS21CO0FBQ2pCLGFBQU8sS0FBS2QsYUFBWjtBQUNEOztBQUVEOzs7Ozs7c0JBS2lCUSxLLEVBQU87QUFDdEIsVUFBTU8sYUFBYVAsUUFBUSxLQUFLUixhQUFoQztBQUNBLFdBQUtBLGFBQUwsR0FBcUJRLEtBQXJCOztBQUVBLFVBQUksS0FBS1EsdUJBQVQsRUFDRSxLQUFLdkIsZUFBTCxHQUF1QixLQUFLQSxlQUFMLEdBQXVCc0IsVUFBOUM7QUFDSDs7QUFFRDs7Ozs7Ozs7d0JBS3NCO0FBQ3BCLGFBQU8sS0FBS3JCLFlBQUwsR0FBb0IsS0FBS0ssd0JBQWhDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozt3QkFNOEI7QUFDNUIsYUFBTyxLQUFLRSx3QkFBWjtBQUNEOztBQUVEOzs7Ozs7O3NCQU00QmdCLEksRUFBTTtBQUNoQyxXQUFLaEIsd0JBQUwsR0FBZ0NnQixJQUFoQztBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLa0I7QUFDaEIsYUFBTyxLQUFLckIsWUFBWjtBQUNEOzs7OztrQkExS2tCSixtQiIsImZpbGUiOiJ0aW1lbGluZS10aW1lLWNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc2NhbGVzIGZyb20gJy4uL3V0aWxzL3NjYWxlcyc7XG5cblxuLyoqXG4gKiBEZWZpbmVzIGFuZCBtYWludGFpbnMgZ2xvYmFsIGFzcGVjdHMgb2YgdGhlIHZpc3VhbGl6YXRpb24gY29uY2VybmluZyB0aGVcbiAqIHJlbGF0aW9ucyBiZXR3ZWVuIHRpbWUgYW5kIHBpeGVscy5cbiAqXG4gKiBUaGUgYFRpbWVsaW5lVGltZUNvbnRleHRgIGluc3RhbmNlICh1bmlxdWUgYWNyb3NzIGEgdmlzdWFsaXphdGlvbikga2VlcHMgdGhlXG4gKiBtYWluIHJlZmVyZW5jZSBvbiBob3cgbWFueSBwaXhlbHMgc2hvdWxkIGJlIHVzZWQgdG8gcmVwcmVzZW50IG9uZSBzZWNvbmRcbiAqIHRob3VnaCBpdHMgYHRpbWVUb1BpeGVsYCBtZXRob2QuIFRoZSBhdHRyaWJ1dGVzIGB6b29tYCwgYG9mZnNldGAgKGkuZS4gZnJvbVxuICogb3JpZ2luKSBhbmQgYHZpc2libGVXaWR0aGAgYWxsb3cgZm9yIG5hdmlnYXRpbmcgaW4gdGltZSBhbmQgZm9yIG1haW50YWluaW5nXG4gKiB2aWV3IGNvbnNpc3RlbmN5IHVwb24gdGhlIERPTSBzdHJ1Y3R1cmUgKGA8c3ZnPmAgYW5kIGA8Zz5gIHRhZ3MpIGNyZWF0ZWQgYnlcbiAqIHRoZSByZWdpc3RlcmVkIHRyYWNrcy5cbiAqXG4gKiBJdCBhbHNvIG1haW50YWluIGFuIGFycmF5IG9mIGFsbCByZWZlcmVuY2VzIHRvIGBMYXllclRpbWVDb250ZXh0YCBpbnN0YW5jZXNcbiAqIHRvIHByb3BhZ2F0ZSB0byBgbGF5ZXJzYCwgY2hhbmdlcyBtYWRlIG9uIHRoZSB0aW1lIHRvIHBpeGVsIHJlcHJlc2VudGF0aW9uLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL3RpbWUtY29udGV4dHMuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWxpbmVUaW1lQ29udGV4dCB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcGl4ZWxzUGVyU2Vjb25kIC0gVGhlIG51bWJlciBvZiBwaXhlbHMgdGhhdCBzaG91bGQgYmVcbiAgICogICAgdXNlZCB0byBkaXNwbGF5IG9uZSBzZWNvbmQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2aXNpYmxlV2lkdGggLSBUaGUgZGVmYXVsdCB3aXRoIG9mIHRoZSB2aXNpYmxlIGFyZWFcbiAgICogICAgZGlzcGxheWVkIGluIGB0cmFja3NgIChpbiBwaXhlbHMpLlxuICAgKi9cbiAgY29uc3RydWN0b3IocGl4ZWxzUGVyU2Vjb25kLCB2aXNpYmxlV2lkdGgpIHtcbiAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xuXG4gICAgdGhpcy5fdGltZVRvUGl4ZWwgPSBudWxsO1xuICAgIHRoaXMuX29mZnNldCA9IDA7XG4gICAgdGhpcy5fem9vbSA9IDE7XG4gICAgdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQgPSBwaXhlbHNQZXJTZWNvbmQ7XG4gICAgLy8gcGFyYW1zXG4gICAgdGhpcy5fdmlzaWJsZVdpZHRoID0gdmlzaWJsZVdpZHRoO1xuICAgIHRoaXMuX21haW50YWluVmlzaWJsZUR1cmF0aW9uID0gZmFsc2U7XG5cbiAgICAvLyBjcmVhdGUgdGhlIHRpbWVUb1BpeGVsIHNjYWxlXG4gICAgY29uc3Qgc2NhbGUgPSBzY2FsZXMubGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIDFdKVxuICAgICAgLnJhbmdlKFswLCBwaXhlbHNQZXJTZWNvbmRdKTtcblxuICAgIHRoaXMuX3RpbWVUb1BpeGVsID0gc2NhbGU7XG5cbiAgICB0aGlzLl9vcmlnaW5hbFBpeGVsc1BlclNlY29uZCA9IHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBwaXhlbHMgcGVyIHNlY29uZHMgaWdub3JpbmcgdGhlIGN1cnJlbnQgem9vbSB2YWx1ZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBwaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgYWxsIHRoZSBjYXJhY3RlcmlzdGljcyBvZiB0aGlzIG9iamVjdCBhY2NvcmRpbmcgdG8gdGhlIG5ld1xuICAgKiBnaXZlbiB2YWx1ZSBvZiBwaXhlbHMgcGVyIHNlY29uZHMuIFByb3BhZ2F0ZXMgdGhlIGNoYW5nZXMgdG8gdGhlXG4gICAqIGBMYXllclRpbWVDb250ZXh0YCBjaGlsZHJlbi5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCBwaXhlbHNQZXJTZWNvbmQodmFsdWUpIHtcbiAgICB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZCA9IHZhbHVlICogdGhpcy56b29tO1xuICAgIHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kID0gdmFsdWU7XG4gICAgdGhpcy5fdXBkYXRlVGltZVRvUGl4ZWxSYW5nZSgpO1xuXG4gICAgLy8gZm9yY2UgY2hpbGRyZW4gc2NhbGUgdXBkYXRlXG4gICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgaWYgKGNoaWxkLnN0cmV0Y2hSYXRpbyAhPT0gMSlcbiAgICAgICAgY2hpbGQuc3RyZXRjaFJhdGlvID0gY2hpbGQuc3RyZXRjaFJhdGlvO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBwaXhlbHMgcGVyIHNlY29uZHMgaW5jbHVkaW5nIHRoZSBjdXJyZW50IHpvb20gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgb2Zmc2V0IGFwcGxpZWQgdG8gdGhlIHJlZ2lzdGVyZWQgYFRyYWNrYCBpbnN0YW5jZXNcbiAgICogZnJvbSBvcmlnaW4gKGluIHNlY29uZHMpLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG9mZnNldCB0byBhcHBseSB0byB0aGUgcmVnaXN0ZXJlZCBgVHJhY2tgIGluc3RhbmNlcyBmcm9tIG9yaWdpblxuICAgKiAoaW4gc2Vjb25kcykuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgb2Zmc2V0KHZhbHVlKSB7XG4gICAgdGhpcy5fb2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCB6b29tIGxldmVsIGFwcGxpZWQgdG8gdGhlIHdob2xlIHZpc3VhbGl6YXRpb24uXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgem9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy5fem9vbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB6b29tIHJhdGlvIGZvciB0aGUgd2hvbGUgdmlzdWFsaXphdGlvbi5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCB6b29tKHZhbHVlKSB7XG4gICAgLy8gQ29tcHV0ZSBjaGFuZ2UgdG8gcHJvcGFnYXRlIHRvIGNoaWxkcmVuIHdobyBoYXZlIHRoZWlyIG93biB0aW1lVG9QaXhlbFxuICAgIGNvbnN0IHJhdGlvQ2hhbmdlID0gdmFsdWUgLyB0aGlzLl96b29tO1xuICAgIHRoaXMuX3pvb20gPSB2YWx1ZTtcbiAgICB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZCA9IHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kICogdmFsdWU7XG4gICAgdGhpcy5fdXBkYXRlVGltZVRvUGl4ZWxSYW5nZSgpO1xuXG4gICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgaWYgKGNoaWxkLnN0cmV0Y2hSYXRpbyAhPT0gMSlcbiAgICAgICAgY2hpbGQuc3RyZXRjaFJhdGlvID0gY2hpbGQuc3RyZXRjaFJhdGlvICogcmF0aW9DaGFuZ2U7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdmlzaWJsZSB3aWR0aCBvZiB0aGUgYFRyYWNrYCBpbnN0YW5jZXMuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgdmlzaWJsZVdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLl92aXNpYmxlV2lkdGg7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmlzaWJsZSB3aWR0aCBvZiB0aGUgYFRyYWNrYCBpbnN0YW5jZXMuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgdmlzaWJsZVdpZHRoKHZhbHVlKSB7XG4gICAgY29uc3Qgd2lkdGhSYXRpbyA9IHZhbHVlIC8gdGhpcy5fdmlzaWJsZVdpZHRoO1xuICAgIHRoaXMuX3Zpc2libGVXaWR0aCA9IHZhbHVlO1xuXG4gICAgaWYgKHRoaXMubWFpbnRhaW5WaXNpYmxlRHVyYXRpb24pXG4gICAgICB0aGlzLnBpeGVsc1BlclNlY29uZCA9IHRoaXMucGl4ZWxzUGVyU2Vjb25kICogd2lkdGhSYXRpbztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkdXJhdGlvbiBkaXNwbGF5ZWQgYnkgYFRyYWNrYCBpbnN0YW5jZXMuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgdmlzaWJsZUR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnZpc2libGVXaWR0aCAvIHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgaWYgdGhlIGR1cmF0aW9uIGRpc3BsYXllZCBieSB0cmFja3Mgc2hvdWxkIGJlIG1haW50YWluZWQgd2hlblxuICAgKiB0aGVpciB3aWR0aCBpcyB1cGRhdGVkLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9tYWludGFpblZpc2libGVEdXJhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGlmIHRoZSBkdXJhdGlvbiBkaXNwbGF5ZWQgYnkgdHJhY2tzIHNob3VsZCBiZSBtYWludGFpbmVkIHdoZW5cbiAgICogdGhlaXIgd2lkdGggaXMgdXBkYXRlZC5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICBzZXQgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24oYm9vbCkge1xuICAgIHRoaXMuX21haW50YWluVmlzaWJsZUR1cmF0aW9uID0gYm9vbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0aW1lIHRvIHBpeGVsIHRyYXNmZXJ0IGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBnZXQgdGltZVRvUGl4ZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RpbWVUb1BpeGVsO1xuICB9XG5cbiAgX3VwZGF0ZVRpbWVUb1BpeGVsUmFuZ2UoKSB7XG4gICAgdGhpcy50aW1lVG9QaXhlbC5yYW5nZShbMCwgdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmRdKTtcbiAgfVxufVxuIl19