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
 * Defines and maintains global aspects of the visualization concerning the relations between time and pixels.
 *
 * The `TimelineTimeContext` instance (unique across a visualization) keeps the main reference on how many pixels should be used to represent one second though its `timeToPixel` method. The attributes `zoom`, `offset` (i.e. from origin) and `visibleWidth` allow for navigating in time and for maintaining view consistency upon the DOM structure (`<svg>` and `<g>` tags) created by the registered tracks.
 *
 * It also maintain an array of all references to `LayerTimeContext` instances to propagate to `layers`, changes made on the time to pixel representation.
 */

var TimelineTimeContext = (function () {
  /**
   * @param {Number} pixelsPerSecond - The number of pixels that should be used to display one second.
   * @param {Number} visibleWidth - The default with of the visible area displayed in `tracks` (in pixels).
   */

  function TimelineTimeContext(pixelsPerSecond, visibleWidth) {
    _classCallCheck(this, TimelineTimeContext);

    this._children = [];

    this._timeToPixel = null;
    this._offset = 0;
    this._zoom = 1;
    this._computedPixelsPerSecond = pixelsPerSecond;
    // params
    this._visibleWidth = visibleWidth;
    this._maintainVisibleDuration = false;

    // create the timeToPixel scale
    var scale = _utilsScales2['default'].linear().domain([0, 1]).range([0, pixelsPerSecond]);

    this._timeToPixel = scale;

    this._originalPixelsPerSecond = this._computedPixelsPerSecond;
  }

  /**
   * Returns the number of pixels per seconds ignoring the current zoom value.
   * @type {Number}
   */

  _createClass(TimelineTimeContext, [{
    key: '_updateTimeToPixelRange',
    value: function _updateTimeToPixelRange() {
      this.timeToPixel.range([0, this._computedPixelsPerSecond]);
    }
  }, {
    key: 'pixelsPerSecond',
    get: function get() {
      return this._originalPixelsPerSecond;
    },

    /**
     * Updates all the caracteristics of this object according to the new given value of pixels per seconds. Propagates the changes to the `LayerTimeContext` children.
     * @type {Number}
     */
    set: function set(value) {
      this._computedPixelsPerSecond = value * this.zoom;
      this._originalPixelsPerSecond = value;
      this._updateTimeToPixelRange();

      // force children scale update
      this._children.forEach(function (child) {
        if (child.stretchRatio !== 1) {
          return;
        }
        child.stretchRatio = child.stretchRatio;
      });
    }

    /**
     * Returns the number of pixels per seconds including the current zoom value.
     * @type {Number}
     */
  }, {
    key: 'computedPixelsPerSecond',
    get: function get() {
      return this._computedPixelsPerSecond;
    }

    /**
     * Returns the current offset applied to the registered `Track` instances from origin (in seconds).
     * @type {Number}
     */
  }, {
    key: 'offset',
    get: function get() {
      return this._offset;
    },

    /**
     * Sets the offset to apply to the registered `Track` instances from origin (in seconds).
     * @type {Number}
     */
    set: function set(value) {
      this._offset = value;
    }

    /**
     * Returns the current zoom level applied to the whole visualization.
     * @type {Number}
     */
  }, {
    key: 'zoom',
    get: function get() {
      return this._zoom;
    },

    /**
     * Sets the zoom ratio for the whole visualization.
     * @type {Number}
     */
    set: function set(value) {
      // Compute change to propagate to children who have their own timeToPixel
      var ratioChange = value / this._zoom;
      this._zoom = value;
      this._computedPixelsPerSecond = this._originalPixelsPerSecond * value;
      this._updateTimeToPixelRange();

      this._children.forEach(function (child) {
        if (child.stretchRatio !== 1) {
          return;
        }
        child.stretchRatio = child.stretchRatio * ratioChange;
      });
    }

    /**
     * Returns the visible width of the `Track` instances.
     * @type {Number}
     */
  }, {
    key: 'visibleWidth',
    get: function get() {
      return this._visibleWidth;
    },

    /**
     * Sets the visible width of the `Track` instances.
     * @type {Number}
     */
    set: function set(value) {
      var widthRatio = value / this.visibleWidth;
      this._visibleWidth = value;

      if (this.maintainVisibleDuration) {
        this.pixelsPerSecond = this._computedPixelsPerSecond * widthRatio;
      }
    }

    /**
     * Returns the duration displayed by `Track` instances.
     * @type {Number}
     */
  }, {
    key: 'visibleDuration',
    get: function get() {
      return this.visibleWidth / this._computedPixelsPerSecond;
    }

    /**
     * Returns if the duration displayed by tracks should be maintained when their width is updated.
     * @type {Number}
     */
  }, {
    key: 'maintainVisibleDuration',
    get: function get() {
      return this._maintainVisibleDuration;
    },

    /**
     * Defines if the duration displayed by tracks should be maintained when their width is updated.
     * @type {Boolean}
     */
    set: function set(bool) {
      this._maintainVisibleDuration = bool;
    }

    /**
     * Returns the time to pixel trasfert function.
     * @type {Function}
     */
  }, {
    key: 'timeToPixel',
    get: function get() {
      return this._timeToPixel;
    }
  }]);

  return TimelineTimeContext;
})();

exports['default'] = TimelineTimeContext;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jb3JlL3RpbWVsaW5lLXRpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7MkJBQW1CLGlCQUFpQjs7Ozs7Ozs7Ozs7O0lBVWYsbUJBQW1COzs7Ozs7QUFLM0IsV0FMUSxtQkFBbUIsQ0FLMUIsZUFBZSxFQUFFLFlBQVksRUFBRTswQkFMeEIsbUJBQW1COztBQU1wQyxRQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQzs7QUFFcEIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDekIsUUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDakIsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZixRQUFJLENBQUMsd0JBQXdCLEdBQUcsZUFBZSxDQUFDOztBQUVoRCxRQUFJLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQztBQUNsQyxRQUFJLENBQUMsd0JBQXdCLEdBQUcsS0FBSyxDQUFDOzs7QUFHdEMsUUFBTSxLQUFLLEdBQUcseUJBQU8sTUFBTSxFQUFFLENBQzFCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUNkLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDOztBQUUvQixRQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQzs7QUFFMUIsUUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQztHQUMvRDs7Ozs7OztlQXhCa0IsbUJBQW1COztXQXdKZixtQ0FBRztBQUN4QixVQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO0tBQzVEOzs7U0E1SGtCLGVBQUc7QUFDcEIsYUFBTyxJQUFJLENBQUMsd0JBQXdCLENBQUM7S0FDdEM7Ozs7OztTQU1rQixhQUFDLEtBQUssRUFBRTtBQUN6QixVQUFJLENBQUMsd0JBQXdCLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDbEQsVUFBSSxDQUFDLHdCQUF3QixHQUFHLEtBQUssQ0FBQztBQUN0QyxVQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQzs7O0FBRy9CLFVBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVMsS0FBSyxFQUFFO0FBQ3JDLFlBQUksS0FBSyxDQUFDLFlBQVksS0FBSyxDQUFDLEVBQUU7QUFBRSxpQkFBTztTQUFFO0FBQ3pDLGFBQUssQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztPQUN6QyxDQUFDLENBQUM7S0FDSjs7Ozs7Ozs7U0FNMEIsZUFBRztBQUM1QixhQUFPLElBQUksQ0FBQyx3QkFBd0IsQ0FBQztLQUN0Qzs7Ozs7Ozs7U0FNUyxlQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0tBQ3JCOzs7Ozs7U0FNUyxhQUFDLEtBQUssRUFBRTtBQUNoQixVQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztLQUN0Qjs7Ozs7Ozs7U0FNTyxlQUFHO0FBQ1QsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0tBQ25COzs7Ozs7U0FNTyxhQUFDLEtBQUssRUFBRTs7QUFFZCxVQUFNLFdBQVcsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUN2QyxVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixVQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixHQUFHLEtBQUssQ0FBQztBQUN0RSxVQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQzs7QUFFL0IsVUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBUyxLQUFLLEVBQUU7QUFDckMsWUFBSSxLQUFLLENBQUMsWUFBWSxLQUFLLENBQUMsRUFBRTtBQUFFLGlCQUFPO1NBQUU7QUFDekMsYUFBSyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztPQUN2RCxDQUFDLENBQUM7S0FDSjs7Ozs7Ozs7U0FNZSxlQUFHO0FBQ2pCLGFBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztLQUMzQjs7Ozs7O1NBTWUsYUFBQyxLQUFLLEVBQUU7QUFDdEIsVUFBTSxVQUFVLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7QUFDN0MsVUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7O0FBRTNCLFVBQUksSUFBSSxDQUFDLHVCQUF1QixFQUFFO0FBQ2hDLFlBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixHQUFHLFVBQVUsQ0FBQztPQUNuRTtLQUNGOzs7Ozs7OztTQU1rQixlQUFHO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUM7S0FDMUQ7Ozs7Ozs7O1NBTTBCLGVBQUc7QUFDNUIsYUFBTyxJQUFJLENBQUMsd0JBQXdCLENBQUM7S0FDdEM7Ozs7OztTQU0wQixhQUFDLElBQUksRUFBRTtBQUNoQyxVQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDO0tBQ3RDOzs7Ozs7OztTQU1jLGVBQUc7QUFDaEIsYUFBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0tBQzFCOzs7U0F0SmtCLG1CQUFtQjs7O3FCQUFuQixtQkFBbUIiLCJmaWxlIjoic3JjL2NvcmUvdGltZWxpbmUtdGltZS1jb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNjYWxlcyBmcm9tICcuLi91dGlscy9zY2FsZXMnO1xuXG5cbi8qKlxuICogRGVmaW5lcyBhbmQgbWFpbnRhaW5zIGdsb2JhbCBhc3BlY3RzIG9mIHRoZSB2aXN1YWxpemF0aW9uIGNvbmNlcm5pbmcgdGhlIHJlbGF0aW9ucyBiZXR3ZWVuIHRpbWUgYW5kIHBpeGVscy5cbiAqXG4gKiBUaGUgYFRpbWVsaW5lVGltZUNvbnRleHRgIGluc3RhbmNlICh1bmlxdWUgYWNyb3NzIGEgdmlzdWFsaXphdGlvbikga2VlcHMgdGhlIG1haW4gcmVmZXJlbmNlIG9uIGhvdyBtYW55IHBpeGVscyBzaG91bGQgYmUgdXNlZCB0byByZXByZXNlbnQgb25lIHNlY29uZCB0aG91Z2ggaXRzIGB0aW1lVG9QaXhlbGAgbWV0aG9kLiBUaGUgYXR0cmlidXRlcyBgem9vbWAsIGBvZmZzZXRgIChpLmUuIGZyb20gb3JpZ2luKSBhbmQgYHZpc2libGVXaWR0aGAgYWxsb3cgZm9yIG5hdmlnYXRpbmcgaW4gdGltZSBhbmQgZm9yIG1haW50YWluaW5nIHZpZXcgY29uc2lzdGVuY3kgdXBvbiB0aGUgRE9NIHN0cnVjdHVyZSAoYDxzdmc+YCBhbmQgYDxnPmAgdGFncykgY3JlYXRlZCBieSB0aGUgcmVnaXN0ZXJlZCB0cmFja3MuXG4gKlxuICogSXQgYWxzbyBtYWludGFpbiBhbiBhcnJheSBvZiBhbGwgcmVmZXJlbmNlcyB0byBgTGF5ZXJUaW1lQ29udGV4dGAgaW5zdGFuY2VzIHRvIHByb3BhZ2F0ZSB0byBgbGF5ZXJzYCwgY2hhbmdlcyBtYWRlIG9uIHRoZSB0aW1lIHRvIHBpeGVsIHJlcHJlc2VudGF0aW9uLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lbGluZVRpbWVDb250ZXh0IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwaXhlbHNQZXJTZWNvbmQgLSBUaGUgbnVtYmVyIG9mIHBpeGVscyB0aGF0IHNob3VsZCBiZSB1c2VkIHRvIGRpc3BsYXkgb25lIHNlY29uZC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZpc2libGVXaWR0aCAtIFRoZSBkZWZhdWx0IHdpdGggb2YgdGhlIHZpc2libGUgYXJlYSBkaXNwbGF5ZWQgaW4gYHRyYWNrc2AgKGluIHBpeGVscykuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwaXhlbHNQZXJTZWNvbmQsIHZpc2libGVXaWR0aCkge1xuICAgIHRoaXMuX2NoaWxkcmVuID0gW107XG5cbiAgICB0aGlzLl90aW1lVG9QaXhlbCA9IG51bGw7XG4gICAgdGhpcy5fb2Zmc2V0ID0gMDtcbiAgICB0aGlzLl96b29tID0gMTtcbiAgICB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZCA9IHBpeGVsc1BlclNlY29uZDtcbiAgICAvLyBwYXJhbXNcbiAgICB0aGlzLl92aXNpYmxlV2lkdGggPSB2aXNpYmxlV2lkdGg7XG4gICAgdGhpcy5fbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSBmYWxzZTtcblxuICAgIC8vIGNyZWF0ZSB0aGUgdGltZVRvUGl4ZWwgc2NhbGVcbiAgICBjb25zdCBzY2FsZSA9IHNjYWxlcy5saW5lYXIoKVxuICAgICAgLmRvbWFpbihbMCwgMV0pXG4gICAgICAucmFuZ2UoWzAsIHBpeGVsc1BlclNlY29uZF0pO1xuXG4gICAgdGhpcy5fdGltZVRvUGl4ZWwgPSBzY2FsZTtcblxuICAgIHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kID0gdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIHBpeGVscyBwZXIgc2Vjb25kcyBpZ25vcmluZyB0aGUgY3VycmVudCB6b29tIHZhbHVlLlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHBpeGVsc1BlclNlY29uZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fb3JpZ2luYWxQaXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBhbGwgdGhlIGNhcmFjdGVyaXN0aWNzIG9mIHRoaXMgb2JqZWN0IGFjY29yZGluZyB0byB0aGUgbmV3IGdpdmVuIHZhbHVlIG9mIHBpeGVscyBwZXIgc2Vjb25kcy4gUHJvcGFnYXRlcyB0aGUgY2hhbmdlcyB0byB0aGUgYExheWVyVGltZUNvbnRleHRgIGNoaWxkcmVuLlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IHBpeGVsc1BlclNlY29uZCh2YWx1ZSkge1xuICAgIHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kID0gdmFsdWUgKiB0aGlzLnpvb207XG4gICAgdGhpcy5fb3JpZ2luYWxQaXhlbHNQZXJTZWNvbmQgPSB2YWx1ZTtcbiAgICB0aGlzLl91cGRhdGVUaW1lVG9QaXhlbFJhbmdlKCk7XG5cbiAgICAvLyBmb3JjZSBjaGlsZHJlbiBzY2FsZSB1cGRhdGVcbiAgICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICBpZiAoY2hpbGQuc3RyZXRjaFJhdGlvICE9PSAxKSB7IHJldHVybjsgfVxuICAgICAgY2hpbGQuc3RyZXRjaFJhdGlvID0gY2hpbGQuc3RyZXRjaFJhdGlvO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBwaXhlbHMgcGVyIHNlY29uZHMgaW5jbHVkaW5nIHRoZSBjdXJyZW50IHpvb20gdmFsdWUuXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgb2Zmc2V0IGFwcGxpZWQgdG8gdGhlIHJlZ2lzdGVyZWQgYFRyYWNrYCBpbnN0YW5jZXMgZnJvbSBvcmlnaW4gKGluIHNlY29uZHMpLlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG9mZnNldCB0byBhcHBseSB0byB0aGUgcmVnaXN0ZXJlZCBgVHJhY2tgIGluc3RhbmNlcyBmcm9tIG9yaWdpbiAoaW4gc2Vjb25kcykuXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgb2Zmc2V0KHZhbHVlKSB7XG4gICAgdGhpcy5fb2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCB6b29tIGxldmVsIGFwcGxpZWQgdG8gdGhlIHdob2xlIHZpc3VhbGl6YXRpb24uXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgem9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy5fem9vbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB6b29tIHJhdGlvIGZvciB0aGUgd2hvbGUgdmlzdWFsaXphdGlvbi5cbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNldCB6b29tKHZhbHVlKSB7XG4gICAgLy8gQ29tcHV0ZSBjaGFuZ2UgdG8gcHJvcGFnYXRlIHRvIGNoaWxkcmVuIHdobyBoYXZlIHRoZWlyIG93biB0aW1lVG9QaXhlbFxuICAgIGNvbnN0IHJhdGlvQ2hhbmdlID0gdmFsdWUgLyB0aGlzLl96b29tO1xuICAgIHRoaXMuX3pvb20gPSB2YWx1ZTtcbiAgICB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZCA9IHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kICogdmFsdWU7XG4gICAgdGhpcy5fdXBkYXRlVGltZVRvUGl4ZWxSYW5nZSgpO1xuXG4gICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgaWYgKGNoaWxkLnN0cmV0Y2hSYXRpbyAhPT0gMSkgeyByZXR1cm47IH1cbiAgICAgIGNoaWxkLnN0cmV0Y2hSYXRpbyA9IGNoaWxkLnN0cmV0Y2hSYXRpbyAqIHJhdGlvQ2hhbmdlO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZpc2libGUgd2lkdGggb2YgdGhlIGBUcmFja2AgaW5zdGFuY2VzLlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHZpc2libGVXaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmlzaWJsZVdpZHRoO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZpc2libGUgd2lkdGggb2YgdGhlIGBUcmFja2AgaW5zdGFuY2VzLlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IHZpc2libGVXaWR0aCh2YWx1ZSkge1xuICAgIGNvbnN0IHdpZHRoUmF0aW8gPSB2YWx1ZSAvIHRoaXMudmlzaWJsZVdpZHRoO1xuICAgIHRoaXMuX3Zpc2libGVXaWR0aCA9IHZhbHVlO1xuXG4gICAgaWYgKHRoaXMubWFpbnRhaW5WaXNpYmxlRHVyYXRpb24pIHtcbiAgICAgIHRoaXMucGl4ZWxzUGVyU2Vjb25kID0gdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQgKiB3aWR0aFJhdGlvO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkdXJhdGlvbiBkaXNwbGF5ZWQgYnkgYFRyYWNrYCBpbnN0YW5jZXMuXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgdmlzaWJsZUR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnZpc2libGVXaWR0aCAvIHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgaWYgdGhlIGR1cmF0aW9uIGRpc3BsYXllZCBieSB0cmFja3Mgc2hvdWxkIGJlIG1haW50YWluZWQgd2hlbiB0aGVpciB3aWR0aCBpcyB1cGRhdGVkLlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9tYWludGFpblZpc2libGVEdXJhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGlmIHRoZSBkdXJhdGlvbiBkaXNwbGF5ZWQgYnkgdHJhY2tzIHNob3VsZCBiZSBtYWludGFpbmVkIHdoZW4gdGhlaXIgd2lkdGggaXMgdXBkYXRlZC5cbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICBzZXQgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24oYm9vbCkge1xuICAgIHRoaXMuX21haW50YWluVmlzaWJsZUR1cmF0aW9uID0gYm9vbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0aW1lIHRvIHBpeGVsIHRyYXNmZXJ0IGZ1bmN0aW9uLlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBnZXQgdGltZVRvUGl4ZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RpbWVUb1BpeGVsO1xuICB9XG5cbiAgX3VwZGF0ZVRpbWVUb1BpeGVsUmFuZ2UoKSB7XG4gICAgdGhpcy50aW1lVG9QaXhlbC5yYW5nZShbMCwgdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmRdKTtcbiAgfVxufVxuIl19