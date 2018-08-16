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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRpbWVsaW5lVGltZUNvbnRleHQuanMiXSwibmFtZXMiOlsiVGltZWxpbmVUaW1lQ29udGV4dCIsInBpeGVsc1BlclNlY29uZCIsInZpc2libGVXaWR0aCIsIl9jaGlsZHJlbiIsIl90aW1lVG9QaXhlbCIsIl9vZmZzZXQiLCJfem9vbSIsIl9jb21wdXRlZFBpeGVsc1BlclNlY29uZCIsIl92aXNpYmxlV2lkdGgiLCJfbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24iLCJzY2FsZSIsImxpbmVhciIsImRvbWFpbiIsInJhbmdlIiwiX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kIiwidGltZVRvUGl4ZWwiLCJ2YWx1ZSIsInpvb20iLCJfdXBkYXRlVGltZVRvUGl4ZWxSYW5nZSIsImZvckVhY2giLCJjaGlsZCIsInN0cmV0Y2hSYXRpbyIsInJhdGlvQ2hhbmdlIiwid2lkdGhSYXRpbyIsIm1haW50YWluVmlzaWJsZUR1cmF0aW9uIiwiYm9vbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQk1BLG1CO0FBQ0o7Ozs7OztBQU1BLCtCQUFZQyxlQUFaLEVBQTZCQyxZQUE3QixFQUEyQztBQUFBOztBQUN6QyxTQUFLQyxTQUFMLEdBQWlCLEVBQWpCOztBQUVBLFNBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxTQUFLQyxPQUFMLEdBQWUsQ0FBZjtBQUNBLFNBQUtDLEtBQUwsR0FBYSxDQUFiO0FBQ0EsU0FBS0Msd0JBQUwsR0FBZ0NOLGVBQWhDO0FBQ0E7QUFDQSxTQUFLTyxhQUFMLEdBQXFCTixZQUFyQjtBQUNBLFNBQUtPLHdCQUFMLEdBQWdDLEtBQWhDOztBQUVBO0FBQ0EsUUFBTUMsUUFBUSxpQkFBT0MsTUFBUCxHQUNYQyxNQURXLENBQ0osQ0FBQyxDQUFELEVBQUksQ0FBSixDQURJLEVBRVhDLEtBRlcsQ0FFTCxDQUFDLENBQUQsRUFBSVosZUFBSixDQUZLLENBQWQ7O0FBSUEsU0FBS0csWUFBTCxHQUFvQk0sS0FBcEI7O0FBRUEsU0FBS0ksd0JBQUwsR0FBZ0MsS0FBS1Asd0JBQXJDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs4Q0FnSjBCO0FBQ3hCLFdBQUtRLFdBQUwsQ0FBaUJGLEtBQWpCLENBQXVCLENBQUMsQ0FBRCxFQUFJLEtBQUtOLHdCQUFULENBQXZCO0FBQ0Q7Ozt3QkE3SXFCO0FBQ3BCLGFBQU8sS0FBS08sd0JBQVo7QUFDRDs7QUFFRDs7Ozs7Ozs7c0JBT29CRSxLLEVBQU87QUFDekIsV0FBS1Qsd0JBQUwsR0FBZ0NTLFFBQVEsS0FBS0MsSUFBN0M7QUFDQSxXQUFLSCx3QkFBTCxHQUFnQ0UsS0FBaEM7QUFDQSxXQUFLRSx1QkFBTDs7QUFFQTtBQUNBLFdBQUtmLFNBQUwsQ0FBZWdCLE9BQWYsQ0FBdUIsVUFBU0MsS0FBVCxFQUFnQjtBQUNyQyxZQUFJQSxNQUFNQyxZQUFOLEtBQXVCLENBQTNCLEVBQ0VELE1BQU1DLFlBQU4sR0FBcUJELE1BQU1DLFlBQTNCO0FBQ0gsT0FIRDtBQUlEOztBQUVEOzs7Ozs7Ozt3QkFLOEI7QUFDNUIsYUFBTyxLQUFLZCx3QkFBWjtBQUNEOztBQUVEOzs7Ozs7Ozs7d0JBTWE7QUFDWCxhQUFPLEtBQUtGLE9BQVo7QUFDRDs7QUFFRDs7Ozs7OztzQkFNV1csSyxFQUFPO0FBQ2hCLFdBQUtYLE9BQUwsR0FBZVcsS0FBZjtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLVztBQUNULGFBQU8sS0FBS1YsS0FBWjtBQUNEOztBQUVEOzs7Ozs7c0JBS1NVLEssRUFBTztBQUNkO0FBQ0EsVUFBTU0sY0FBY04sUUFBUSxLQUFLVixLQUFqQztBQUNBLFdBQUtBLEtBQUwsR0FBYVUsS0FBYjtBQUNBLFdBQUtULHdCQUFMLEdBQWdDLEtBQUtPLHdCQUFMLEdBQWdDRSxLQUFoRTtBQUNBLFdBQUtFLHVCQUFMOztBQUVBLFdBQUtmLFNBQUwsQ0FBZWdCLE9BQWYsQ0FBdUIsVUFBU0MsS0FBVCxFQUFnQjtBQUNyQyxZQUFJQSxNQUFNQyxZQUFOLEtBQXVCLENBQTNCLEVBQ0VELE1BQU1DLFlBQU4sR0FBcUJELE1BQU1DLFlBQU4sR0FBcUJDLFdBQTFDO0FBQ0gsT0FIRDtBQUlEOztBQUVEOzs7Ozs7Ozt3QkFLbUI7QUFDakIsYUFBTyxLQUFLZCxhQUFaO0FBQ0Q7O0FBRUQ7Ozs7OztzQkFLaUJRLEssRUFBTztBQUN0QixVQUFNTyxhQUFhUCxRQUFRLEtBQUtSLGFBQWhDO0FBQ0EsV0FBS0EsYUFBTCxHQUFxQlEsS0FBckI7O0FBRUEsVUFBSSxLQUFLUSx1QkFBVCxFQUNFLEtBQUt2QixlQUFMLEdBQXVCLEtBQUtBLGVBQUwsR0FBdUJzQixVQUE5QztBQUNIOztBQUVEOzs7Ozs7Ozt3QkFLc0I7QUFDcEIsYUFBTyxLQUFLckIsWUFBTCxHQUFvQixLQUFLSyx3QkFBaEM7QUFDRDs7QUFFRDs7Ozs7Ozs7O3dCQU04QjtBQUM1QixhQUFPLEtBQUtFLHdCQUFaO0FBQ0Q7O0FBRUQ7Ozs7Ozs7c0JBTTRCZ0IsSSxFQUFNO0FBQ2hDLFdBQUtoQix3QkFBTCxHQUFnQ2dCLElBQWhDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUtrQjtBQUNoQixhQUFPLEtBQUtyQixZQUFaO0FBQ0Q7Ozs7O2tCQU9ZSixtQiIsImZpbGUiOiJUaW1lbGluZVRpbWVDb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNjYWxlcyBmcm9tICcuLi91dGlscy9zY2FsZXMnO1xuXG5cbi8qKlxuICogRGVmaW5lcyBhbmQgbWFpbnRhaW5zIGdsb2JhbCBhc3BlY3RzIG9mIHRoZSB2aXN1YWxpemF0aW9uIGNvbmNlcm5pbmcgdGhlXG4gKiByZWxhdGlvbnMgYmV0d2VlbiB0aW1lIGFuZCBwaXhlbHMuXG4gKlxuICogVGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCBpbnN0YW5jZSAodW5pcXVlIGFjcm9zcyBhIHZpc3VhbGl6YXRpb24pIGtlZXBzIHRoZVxuICogbWFpbiByZWZlcmVuY2Ugb24gaG93IG1hbnkgcGl4ZWxzIHNob3VsZCBiZSB1c2VkIHRvIHJlcHJlc2VudCBvbmUgc2Vjb25kXG4gKiB0aG91Z2ggaXRzIGB0aW1lVG9QaXhlbGAgbWV0aG9kLiBUaGUgYXR0cmlidXRlcyBgem9vbWAsIGBvZmZzZXRgIChpLmUuIGZyb21cbiAqIG9yaWdpbikgYW5kIGB2aXNpYmxlV2lkdGhgIGFsbG93IGZvciBuYXZpZ2F0aW5nIGluIHRpbWUgYW5kIGZvciBtYWludGFpbmluZ1xuICogdmlldyBjb25zaXN0ZW5jeSB1cG9uIHRoZSBET00gc3RydWN0dXJlIChgPHN2Zz5gIGFuZCBgPGc+YCB0YWdzKSBjcmVhdGVkIGJ5XG4gKiB0aGUgcmVnaXN0ZXJlZCB0cmFja3MuXG4gKlxuICogSXQgYWxzbyBtYWludGFpbiBhbiBhcnJheSBvZiBhbGwgcmVmZXJlbmNlcyB0byBgTGF5ZXJUaW1lQ29udGV4dGAgaW5zdGFuY2VzXG4gKiB0byBwcm9wYWdhdGUgdG8gYGxheWVyc2AsIGNoYW5nZXMgbWFkZSBvbiB0aGUgdGltZSB0byBwaXhlbCByZXByZXNlbnRhdGlvbi5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy90aW1lLWNvbnRleHRzLmh0bWwpXG4gKi9cbmNsYXNzIFRpbWVsaW5lVGltZUNvbnRleHQge1xuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBpeGVsc1BlclNlY29uZCAtIFRoZSBudW1iZXIgb2YgcGl4ZWxzIHRoYXQgc2hvdWxkIGJlXG4gICAqICAgIHVzZWQgdG8gZGlzcGxheSBvbmUgc2Vjb25kLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmlzaWJsZVdpZHRoIC0gVGhlIGRlZmF1bHQgd2l0aCBvZiB0aGUgdmlzaWJsZSBhcmVhXG4gICAqICAgIGRpc3BsYXllZCBpbiBgdHJhY2tzYCAoaW4gcGl4ZWxzKS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHBpeGVsc1BlclNlY29uZCwgdmlzaWJsZVdpZHRoKSB7XG4gICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcblxuICAgIHRoaXMuX3RpbWVUb1BpeGVsID0gbnVsbDtcbiAgICB0aGlzLl9vZmZzZXQgPSAwO1xuICAgIHRoaXMuX3pvb20gPSAxO1xuICAgIHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kID0gcGl4ZWxzUGVyU2Vjb25kO1xuICAgIC8vIHBhcmFtc1xuICAgIHRoaXMuX3Zpc2libGVXaWR0aCA9IHZpc2libGVXaWR0aDtcbiAgICB0aGlzLl9tYWludGFpblZpc2libGVEdXJhdGlvbiA9IGZhbHNlO1xuXG4gICAgLy8gY3JlYXRlIHRoZSB0aW1lVG9QaXhlbCBzY2FsZVxuICAgIGNvbnN0IHNjYWxlID0gc2NhbGVzLmxpbmVhcigpXG4gICAgICAuZG9tYWluKFswLCAxXSlcbiAgICAgIC5yYW5nZShbMCwgcGl4ZWxzUGVyU2Vjb25kXSk7XG5cbiAgICB0aGlzLl90aW1lVG9QaXhlbCA9IHNjYWxlO1xuXG4gICAgdGhpcy5fb3JpZ2luYWxQaXhlbHNQZXJTZWNvbmQgPSB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgcGl4ZWxzIHBlciBzZWNvbmRzIGlnbm9yaW5nIHRoZSBjdXJyZW50IHpvb20gdmFsdWUuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgcGl4ZWxzUGVyU2Vjb25kKCkge1xuICAgIHJldHVybiB0aGlzLl9vcmlnaW5hbFBpeGVsc1BlclNlY29uZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIGFsbCB0aGUgY2FyYWN0ZXJpc3RpY3Mgb2YgdGhpcyBvYmplY3QgYWNjb3JkaW5nIHRvIHRoZSBuZXdcbiAgICogZ2l2ZW4gdmFsdWUgb2YgcGl4ZWxzIHBlciBzZWNvbmRzLiBQcm9wYWdhdGVzIHRoZSBjaGFuZ2VzIHRvIHRoZVxuICAgKiBgTGF5ZXJUaW1lQ29udGV4dGAgY2hpbGRyZW4uXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgcGl4ZWxzUGVyU2Vjb25kKHZhbHVlKSB7XG4gICAgdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQgPSB2YWx1ZSAqIHRoaXMuem9vbTtcbiAgICB0aGlzLl9vcmlnaW5hbFBpeGVsc1BlclNlY29uZCA9IHZhbHVlO1xuICAgIHRoaXMuX3VwZGF0ZVRpbWVUb1BpeGVsUmFuZ2UoKTtcblxuICAgIC8vIGZvcmNlIGNoaWxkcmVuIHNjYWxlIHVwZGF0ZVxuICAgIHRoaXMuX2NoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgIGlmIChjaGlsZC5zdHJldGNoUmF0aW8gIT09IDEpXG4gICAgICAgIGNoaWxkLnN0cmV0Y2hSYXRpbyA9IGNoaWxkLnN0cmV0Y2hSYXRpbztcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgcGl4ZWxzIHBlciBzZWNvbmRzIGluY2x1ZGluZyB0aGUgY3VycmVudCB6b29tIHZhbHVlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IGNvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kKCkge1xuICAgIHJldHVybiB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IG9mZnNldCBhcHBsaWVkIHRvIHRoZSByZWdpc3RlcmVkIGBUcmFja2AgaW5zdGFuY2VzXG4gICAqIGZyb20gb3JpZ2luIChpbiBzZWNvbmRzKS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29mZnNldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBvZmZzZXQgdG8gYXBwbHkgdG8gdGhlIHJlZ2lzdGVyZWQgYFRyYWNrYCBpbnN0YW5jZXMgZnJvbSBvcmlnaW5cbiAgICogKGluIHNlY29uZHMpLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMuX29mZnNldCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgem9vbSBsZXZlbCBhcHBsaWVkIHRvIHRoZSB3aG9sZSB2aXN1YWxpemF0aW9uLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHpvb20oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3pvb207XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgem9vbSByYXRpbyBmb3IgdGhlIHdob2xlIHZpc3VhbGl6YXRpb24uXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZXQgem9vbSh2YWx1ZSkge1xuICAgIC8vIENvbXB1dGUgY2hhbmdlIHRvIHByb3BhZ2F0ZSB0byBjaGlsZHJlbiB3aG8gaGF2ZSB0aGVpciBvd24gdGltZVRvUGl4ZWxcbiAgICBjb25zdCByYXRpb0NoYW5nZSA9IHZhbHVlIC8gdGhpcy5fem9vbTtcbiAgICB0aGlzLl96b29tID0gdmFsdWU7XG4gICAgdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQgPSB0aGlzLl9vcmlnaW5hbFBpeGVsc1BlclNlY29uZCAqIHZhbHVlO1xuICAgIHRoaXMuX3VwZGF0ZVRpbWVUb1BpeGVsUmFuZ2UoKTtcblxuICAgIHRoaXMuX2NoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgIGlmIChjaGlsZC5zdHJldGNoUmF0aW8gIT09IDEpXG4gICAgICAgIGNoaWxkLnN0cmV0Y2hSYXRpbyA9IGNoaWxkLnN0cmV0Y2hSYXRpbyAqIHJhdGlvQ2hhbmdlO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZpc2libGUgd2lkdGggb2YgdGhlIGBUcmFja2AgaW5zdGFuY2VzLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHZpc2libGVXaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmlzaWJsZVdpZHRoO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZpc2libGUgd2lkdGggb2YgdGhlIGBUcmFja2AgaW5zdGFuY2VzLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgc2V0IHZpc2libGVXaWR0aCh2YWx1ZSkge1xuICAgIGNvbnN0IHdpZHRoUmF0aW8gPSB2YWx1ZSAvIHRoaXMuX3Zpc2libGVXaWR0aDtcbiAgICB0aGlzLl92aXNpYmxlV2lkdGggPSB2YWx1ZTtcblxuICAgIGlmICh0aGlzLm1haW50YWluVmlzaWJsZUR1cmF0aW9uKVxuICAgICAgdGhpcy5waXhlbHNQZXJTZWNvbmQgPSB0aGlzLnBpeGVsc1BlclNlY29uZCAqIHdpZHRoUmF0aW87XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZHVyYXRpb24gZGlzcGxheWVkIGJ5IGBUcmFja2AgaW5zdGFuY2VzLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHZpc2libGVEdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy52aXNpYmxlV2lkdGggLyB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGlmIHRoZSBkdXJhdGlvbiBkaXNwbGF5ZWQgYnkgdHJhY2tzIHNob3VsZCBiZSBtYWludGFpbmVkIHdoZW5cbiAgICogdGhlaXIgd2lkdGggaXMgdXBkYXRlZC5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBtYWludGFpblZpc2libGVEdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFpbnRhaW5WaXNpYmxlRHVyYXRpb247XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBpZiB0aGUgZHVyYXRpb24gZGlzcGxheWVkIGJ5IHRyYWNrcyBzaG91bGQgYmUgbWFpbnRhaW5lZCB3aGVuXG4gICAqIHRoZWlyIHdpZHRoIGlzIHVwZGF0ZWQuXG4gICAqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgc2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKGJvb2wpIHtcbiAgICB0aGlzLl9tYWludGFpblZpc2libGVEdXJhdGlvbiA9IGJvb2w7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdGltZSB0byBwaXhlbCB0cmFzZmVydCBmdW5jdGlvbi5cbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgZ2V0IHRpbWVUb1BpeGVsKCkge1xuICAgIHJldHVybiB0aGlzLl90aW1lVG9QaXhlbDtcbiAgfVxuXG4gIF91cGRhdGVUaW1lVG9QaXhlbFJhbmdlKCkge1xuICAgIHRoaXMudGltZVRvUGl4ZWwucmFuZ2UoWzAsIHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kXSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGltZWxpbmVUaW1lQ29udGV4dDtcbiJdfQ==