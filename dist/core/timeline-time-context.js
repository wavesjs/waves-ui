"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var d3Scale = _interopRequire(require("d3-scale"));

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

var TimelineTimeContext = (function () {
  function TimelineTimeContext(pixelsPerSecond, visibleWidth) {
    _classCallCheck(this, TimelineTimeContext);

    this._children = [];

    // @rename to timeToPixel
    this._timeToPixel = null;
    // this._originalXScale = null;

    this._offset = 0;
    this._zoom = 1;
    this._pixelsPerSecond = pixelsPerSecond;
    // params
    this._visibleWidth = visibleWidth;
    this._visibleDuration = this.visibleWidth / this._pixelsPerSecond;
    this._maintainVisibleDuration = false;

    // create the timeToPixel scale
    var scale = d3Scale.linear().domain([0, 1]).range([0, pixelsPerSecond]);

    this.timeToPixel = scale;
    // this.originalXScale = this.timeToPixel.copy();

    this._originalPixelsPerSecond = this._pixelsPerSecond;
  }

  _createClass(TimelineTimeContext, {
    pixelsPerSecond: {
      get: function () {
        return this._originalPixelsPerSecond;
      },
      set: function (value) {
        this._pixelsPerSecond = value * this.zoom;
        this._originalPixelsPerSecond = value;
        this._updateTimeToPixelRange();

        // force children scale update
        this._children.forEach(function (child) {
          if (!child._timeToPixel) {
            return;
          }
          child.stretchRatio = child.stretchRatio;
        });
      }
    },
    computedPixelsPerSecond: {
      get: function () {
        return this._pixelsPerSecond;
      }
    },
    offset: {
      get: function () {
        return this._offset;
      },
      set: function (value) {
        this._offset = value;
      }
    },
    zoom: {
      get: function () {
        return this._zoom;
      },
      set: function (value) {
        // Compute change to propagate to children who have their own timeToPixel
        var ratioChange = value / this._zoom;
        this._zoom = value;
        this._pixelsPerSecond = this._originalPixelsPerSecond * value;
        this._updateTimeToPixelRange();

        this._children.forEach(function (child) {
          if (!child._timeToPixel) {
            return;
          }
          child.stretchRatio = child.stretchRatio * ratioChange;
        });
      }
    },
    visibleWidth: {
      get: function () {
        return this._visibleWidth;
      },
      set: function (value) {
        var widthRatio = value / this.visibleWidth;

        this._visibleWidth = value;
        this._visibleDuration = this.visibleWidth / this._pixelsPerSecond;

        if (this.maintainVisibleDuration) {
          this.pixelsPerSecond = this._pixelsPerSecond * widthRatio;
        }
      }
    },
    visibleDuration: {

      /** @readonly */

      get: function () {
        return this._visibleDuration;
      }
    },
    maintainVisibleDuration: {
      get: function () {
        return this._maintainVisibleDuration;
      },
      set: function (bool) {
        this._maintainVisibleDuration = bool;
      }
    },
    timeToPixel: {
      get: function () {
        return this._timeToPixel;
      },
      set: function (scale) {
        this._timeToPixel = scale;
      }
    },
    originalPixelsPerSecond: {
      get: function () {
        return this._originalPixelsPerSecond;
      }
    },
    _updateTimeToPixelRange: {
      value: function _updateTimeToPixelRange() {
        this._visibleDuration = this.visibleWidth / this.pixelsPerSecond;
        this.timeToPixel.range([0, this._pixelsPerSecond]);
      }
    }
  });

  return TimelineTimeContext;
})();

module.exports = TimelineTimeContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWVsaW5lLXRpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztJQUFPLE9BQU8sMkJBQU0sVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFpQlQsbUJBQW1CO0FBQzNCLFdBRFEsbUJBQW1CLENBQzFCLGVBQWUsRUFBRSxZQUFZLEVBQUU7MEJBRHhCLG1CQUFtQjs7QUFFcEMsUUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7OztBQUdwQixRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzs7O0FBR3pCLFFBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsUUFBSSxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQzs7QUFFeEMsUUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUM7QUFDbEMsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO0FBQ2xFLFFBQUksQ0FBQyx3QkFBd0IsR0FBRyxLQUFLLENBQUM7OztBQUd0QyxRQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQzNCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUNkLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDOztBQUUvQixRQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQzs7O0FBR3pCLFFBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7R0FDdkQ7O2VBekJrQixtQkFBbUI7QUErQmxDLG1CQUFlO1dBSkEsWUFBRztBQUNwQixlQUFPLElBQUksQ0FBQyx3QkFBd0IsQ0FBQztPQUN0QztXQUVrQixVQUFDLEtBQUssRUFBRTtBQUN6QixZQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxHQUFH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bkIsbUJBQW1CIiwiZmlsZSI6ImVzNi9jb3JlL3RpbWVsaW5lLXRpbWUtY29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkM1NjYWxlIGZyb20gJ2QzLXNjYWxlJztcblxuXG4vKipcbiAqICBAY2xhc3MgVmlld1RpbWVDb250ZXh0XG4gKlxuICogIEEgVmlld1RpbWVDb250ZXh0IGluc3RhbmNlIHJlcHJlc2VudHMgdGhlIG1hcHBpbmcgYmV0d2VlbiB0aGUgdGltZSBhbmQgdGhlIHBpeGVsIGRvbWFpbnNcbiAqXG4gKiAgVGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCBoYXMgMyBpbXBvcnRhbnQgYXR0cmlidXRlczpcbiAqICAtIGB0aW1lQ29udGV4dC50aW1lVG9QaXhlbGAgd2hpY2ggZGVmaW5lcyB0aGUgdGltZSB0byBwaXhlbCB0cmFuc2ZlcnQgZnVuY3Rpb24sIGl0c2VsZiBkZWZpbmVkIGJ5IHRoZSBgcGl4ZWxzUGVyU2Vjb25kYCBhdHRyaWJ1dGUgb2YgdGhlIHRpbWVsaW5lXG4gKiAgLSBgdGltZUNvbnRleHQub2Zmc2V0YCBkZWZpbmVzIGEgZGVjYXkgKGluIHRpbWUgZG9tYWluKSBhcHBsaWVkIHRvIGFsbCB0aGUgdmlld3Mgb24gdGhlIHRpbWVsaW5lLiBUaGlzIGFsbG93IHRvIG5hdmlnYXRlIGluc2lkZSB2aXNpYmxlRHVyYXRpb25zIGxvbmdlciB0aGFuIHdoYXQgY2FuIGJlIHJlcHJlc2VudGVkIGluIExheWVycyAodmlld3MpIGNvbnRhaW5lcnMgKGUuZy4gaG9yaXpvbnRhbCBzY3JvbGwpXG4gKiAgLSBgdGltZUNvbnRleHQuem9vbWAgZGVmaW5lcyB0aGUgem9vbSBmYWN0b3IgYXBwbHllZCB0byB0aGUgdGltZWxpbmVcbiAqXG4gKiAgSXQgYWxzbyBtYWludGFpbnMgYW4gaGVscGVyIChgdmlzaWJsZUR1cmF0aW9uYCkgd2hpY2ggcmVwcmVzZW50IGhvdyBtdWNoIHRpbWUgdGhlIGB0cmFja3NgIGFyZSBkaXNwbGF5aW5nXG4gKlxuICogIEl0IGFsc28gbWFpbnRhaW4gYW4gYXJyYXkgb2YgcmVmZXJlbmNlcyB0byBhbGwgdGhlIExheWVyVGltZUNvbnRleHQgYXR0YWNoZWQgdG8gdGhlIHRpbWVsaW5lIHRvIHByb3BhZ2F0ZSBjaGFuZ2VzIG9uIHRoZSB0aW1lIHRvIHBpeGVsIHJlcHJlc2VudGF0aW9uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVsaW5lVGltZUNvbnRleHQge1xuICBjb25zdHJ1Y3RvcihwaXhlbHNQZXJTZWNvbmQsIHZpc2libGVXaWR0aCkge1xuICAgIHRoaXMuX2NoaWxkcmVuID0gW107XG5cbiAgICAvLyBAcmVuYW1lIHRvIHRpbWVUb1BpeGVsXG4gICAgdGhpcy5fdGltZVRvUGl4ZWwgPSBudWxsO1xuICAgIC8vIHRoaXMuX29yaWdpbmFsWFNjYWxlID0gbnVsbDtcblxuICAgIHRoaXMuX29mZnNldCA9IDA7XG4gICAgdGhpcy5fem9vbSA9IDE7XG4gICAgdGhpcy5fcGl4ZWxzUGVyU2Vjb25kID0gcGl4ZWxzUGVyU2Vjb25kO1xuICAgIC8vIHBhcmFtc1xuICAgIHRoaXMuX3Zpc2libGVXaWR0aCA9IHZpc2libGVXaWR0aDtcbiAgICB0aGlzLl92aXNpYmxlRHVyYXRpb24gPSB0aGlzLnZpc2libGVXaWR0aCAvIHRoaXMuX3BpeGVsc1BlclNlY29uZDtcbiAgICB0aGlzLl9tYWludGFpblZpc2libGVEdXJhdGlvbiA9IGZhbHNlO1xuXG4gICAgLy8gY3JlYXRlIHRoZSB0aW1lVG9QaXhlbCBzY2FsZVxuICAgIGNvbnN0IHNjYWxlID0gZDNTY2FsZS5saW5lYXIoKVxuICAgICAgLmRvbWFpbihbMCwgMV0pXG4gICAgICAucmFuZ2UoWzAsIHBpeGVsc1BlclNlY29uZF0pO1xuXG4gICAgdGhpcy50aW1lVG9QaXhlbCA9IHNjYWxlO1xuICAgIC8vIHRoaXMub3JpZ2luYWxYU2NhbGUgPSB0aGlzLnRpbWVUb1BpeGVsLmNvcHkoKTtcblxuICAgIHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kID0gdGhpcy5fcGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgZ2V0IHBpeGVsc1BlclNlY29uZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fb3JpZ2luYWxQaXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICBzZXQgcGl4ZWxzUGVyU2Vjb25kKHZhbHVlKSB7XG4gICAgdGhpcy5fcGl4ZWxzUGVyU2Vjb25kID0gdmFsdWUgKiB0aGlzLnpvb207XG4gICAgdGhpcy5fb3JpZ2luYWxQaXhlbHNQZXJTZWNvbmQgPSB2YWx1ZTtcbiAgICB0aGlzLl91cGRhdGVUaW1lVG9QaXhlbFJhbmdlKCk7XG5cbiAgICAvLyBmb3JjZSBjaGlsZHJlbiBzY2FsZSB1cGRhdGVcbiAgICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICBpZiAoIWNoaWxkLl90aW1lVG9QaXhlbCkgeyByZXR1cm47IH1cbiAgICAgIGNoaWxkLnN0cmV0Y2hSYXRpbyA9IGNoaWxkLnN0cmV0Y2hSYXRpbztcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBjb21wdXRlZFBpeGVsc1BlclNlY29uZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xuICB9XG5cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMuX29mZnNldCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHpvb20oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3pvb207XG4gIH1cblxuICBzZXQgem9vbSh2YWx1ZSkge1xuICAgIC8vIENvbXB1dGUgY2hhbmdlIHRvIHByb3BhZ2F0ZSB0byBjaGlsZHJlbiB3aG8gaGF2ZSB0aGVpciBvd24gdGltZVRvUGl4ZWxcbiAgICBjb25zdCByYXRpb0NoYW5nZSA9IHZhbHVlIC8gdGhpcy5fem9vbTtcbiAgICB0aGlzLl96b29tID0gdmFsdWU7XG4gICAgdGhpcy5fcGl4ZWxzUGVyU2Vjb25kID0gdGhpcy5fb3JpZ2luYWxQaXhlbHNQZXJTZWNvbmQgKiB2YWx1ZTtcbiAgICB0aGlzLl91cGRhdGVUaW1lVG9QaXhlbFJhbmdlKCk7XG5cbiAgICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICBpZiAoIWNoaWxkLl90aW1lVG9QaXhlbCkgeyByZXR1cm47IH1cbiAgICAgIGNoaWxkLnN0cmV0Y2hSYXRpbyA9IGNoaWxkLnN0cmV0Y2hSYXRpbyAqIHJhdGlvQ2hhbmdlO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IHZpc2libGVXaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmlzaWJsZVdpZHRoO1xuICB9XG5cbiAgc2V0IHZpc2libGVXaWR0aCh2YWx1ZSkge1xuICAgIGNvbnN0IHdpZHRoUmF0aW8gPSB2YWx1ZSAvIHRoaXMudmlzaWJsZVdpZHRoO1xuXG4gICAgdGhpcy5fdmlzaWJsZVdpZHRoID0gdmFsdWU7XG4gICAgdGhpcy5fdmlzaWJsZUR1cmF0aW9uID0gdGhpcy52aXNpYmxlV2lkdGggLyB0aGlzLl9waXhlbHNQZXJTZWNvbmQ7XG5cbiAgICBpZiAodGhpcy5tYWludGFpblZpc2libGVEdXJhdGlvbikge1xuICAgICAgdGhpcy5waXhlbHNQZXJTZWNvbmQgPSB0aGlzLl9waXhlbHNQZXJTZWNvbmQgKiB3aWR0aFJhdGlvO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcmVhZG9ubHkgKi9cbiAgZ2V0IHZpc2libGVEdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fdmlzaWJsZUR1cmF0aW9uO1xuICB9XG5cbiAgZ2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9tYWludGFpblZpc2libGVEdXJhdGlvbjtcbiAgfVxuXG4gIHNldCBtYWludGFpblZpc2libGVEdXJhdGlvbihib29sKSB7XG4gICAgdGhpcy5fbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSBib29sO1xuICB9XG5cbiAgZ2V0IHRpbWVUb1BpeGVsKCkge1xuICAgIHJldHVybiB0aGlzLl90aW1lVG9QaXhlbDtcbiAgfVxuXG4gIHNldCB0aW1lVG9QaXhlbChzY2FsZSkge1xuICAgIHRoaXMuX3RpbWVUb1BpeGVsID0gc2NhbGU7XG4gIH1cblxuICBnZXQgb3JpZ2luYWxQaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgX3VwZGF0ZVRpbWVUb1BpeGVsUmFuZ2UoKSB7XG4gICAgdGhpcy5fdmlzaWJsZUR1cmF0aW9uID0gdGhpcy52aXNpYmxlV2lkdGggLyB0aGlzLnBpeGVsc1BlclNlY29uZDtcbiAgICB0aGlzLnRpbWVUb1BpeGVsLnJhbmdlKFswLCB0aGlzLl9waXhlbHNQZXJTZWNvbmRdKTtcbiAgfVxufVxuIl19