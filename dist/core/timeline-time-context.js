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
    this._computedPixelsPerSecond = pixelsPerSecond;
    // params
    this._visibleWidth = visibleWidth;
    this._visibleDuration = this.visibleWidth / this._computedPixelsPerSecond;
    this._maintainVisibleDuration = false;

    // create the timeToPixel scale
    var scale = d3Scale.linear().domain([0, 1]).range([0, pixelsPerSecond]);

    this.timeToPixel = scale;
    // this.originalXScale = this.timeToPixel.copy();

    this._originalPixelsPerSecond = this._computedPixelsPerSecond;
  }

  _createClass(TimelineTimeContext, {
    pixelsPerSecond: {
      get: function () {
        return this._originalPixelsPerSecond;
      },
      set: function (value) {
        this._computedPixelsPerSecond = value * this.zoom;
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
        return this._computedPixelsPerSecond;
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
        this._computedPixelsPerSecond = this._originalPixelsPerSecond * value;
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
        this._visibleDuration = this.visibleWidth / this._computedPixelsPerSecond;

        if (this.maintainVisibleDuration) {
          this.pixelsPerSecond = this._computedPixelsPerSecond * widthRatio;
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
    _updateTimeToPixelRange: {
      value: function _updateTimeToPixelRange() {
        this._visibleDuration = this.visibleWidth / this._computedPixelsPerSecond;
        this.timeToPixel.range([0, this._computedPixelsPerSecond]);
      }
    }
  });

  return TimelineTimeContext;
})();

module.exports = TimelineTimeContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7SUFBTyxPQUFPLDJCQUFNLFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBaUJULG1CQUFtQjtBQUMzQixXQURRLG1CQUFtQixDQUMxQixlQUFlLEVBQUUsWUFBWSxFQUFFOzBCQUR4QixtQkFBbUI7O0FBRXBDLFFBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDOzs7QUFHcEIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7OztBQUd6QixRQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztBQUNqQixRQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNmLFFBQUksQ0FBQyx3QkFBd0IsR0FBRyxlQUFlLENBQUM7O0FBRWhELFFBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO0FBQ2xDLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQztBQUMxRSxRQUFJLENBQUMsd0JBQXdCLEdBQUcsS0FBSyxDQUFDOzs7QUFHdEMsUUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUMzQixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FDZCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQzs7QUFFL0IsUUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7OztBQUd6QixRQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDO0dBQy9EOztlQXpCa0IsbUJBQW1CO0FBK0JsQyxtQkFBZTtXQUpBLFlBQUc7QUFDcEIsZUFBTyxJQUFJLENBQUMsd0JBQXdCLENBQUM7T0FDdEM7V0FFa0IsVUFBQyxLQUFLLEVBQUU7QUFDekIsWUFBSSxDQUFDLHdCQUF3QixHQUFHLEtBQUssR0FBRyxJQUFJ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OlsiaW1wb3J0IGQzU2NhbGUgZnJvbSAnZDMtc2NhbGUnO1xuXG5cbi8qKlxuICogIEBjbGFzcyBWaWV3VGltZUNvbnRleHRcbiAqXG4gKiAgQSBWaWV3VGltZUNvbnRleHQgaW5zdGFuY2UgcmVwcmVzZW50cyB0aGUgbWFwcGluZyBiZXR3ZWVuIHRoZSB0aW1lIGFuZCB0aGUgcGl4ZWwgZG9tYWluc1xuICpcbiAqICBUaGUgYFRpbWVsaW5lVGltZUNvbnRleHRgIGhhcyAzIGltcG9ydGFudCBhdHRyaWJ1dGVzOlxuICogIC0gYHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsYCB3aGljaCBkZWZpbmVzIHRoZSB0aW1lIHRvIHBpeGVsIHRyYW5zZmVydCBmdW5jdGlvbiwgaXRzZWxmIGRlZmluZWQgYnkgdGhlIGBwaXhlbHNQZXJTZWNvbmRgIGF0dHJpYnV0ZSBvZiB0aGUgdGltZWxpbmVcbiAqICAtIGB0aW1lQ29udGV4dC5vZmZzZXRgIGRlZmluZXMgYSBkZWNheSAoaW4gdGltZSBkb21haW4pIGFwcGxpZWQgdG8gYWxsIHRoZSB2aWV3cyBvbiB0aGUgdGltZWxpbmUuIFRoaXMgYWxsb3cgdG8gbmF2aWdhdGUgaW5zaWRlIHZpc2libGVEdXJhdGlvbnMgbG9uZ2VyIHRoYW4gd2hhdCBjYW4gYmUgcmVwcmVzZW50ZWQgaW4gTGF5ZXJzICh2aWV3cykgY29udGFpbmVycyAoZS5nLiBob3Jpem9udGFsIHNjcm9sbClcbiAqICAtIGB0aW1lQ29udGV4dC56b29tYCBkZWZpbmVzIHRoZSB6b29tIGZhY3RvciBhcHBseWVkIHRvIHRoZSB0aW1lbGluZVxuICpcbiAqICBJdCBhbHNvIG1haW50YWlucyBhbiBoZWxwZXIgKGB2aXNpYmxlRHVyYXRpb25gKSB3aGljaCByZXByZXNlbnQgaG93IG11Y2ggdGltZSB0aGUgYHRyYWNrc2AgYXJlIGRpc3BsYXlpbmdcbiAqXG4gKiAgSXQgYWxzbyBtYWludGFpbiBhbiBhcnJheSBvZiByZWZlcmVuY2VzIHRvIGFsbCB0aGUgTGF5ZXJUaW1lQ29udGV4dCBhdHRhY2hlZCB0byB0aGUgdGltZWxpbmUgdG8gcHJvcGFnYXRlIGNoYW5nZXMgb24gdGhlIHRpbWUgdG8gcGl4ZWwgcmVwcmVzZW50YXRpb25cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWxpbmVUaW1lQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKHBpeGVsc1BlclNlY29uZCwgdmlzaWJsZVdpZHRoKSB7XG4gICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcblxuICAgIC8vIEByZW5hbWUgdG8gdGltZVRvUGl4ZWxcbiAgICB0aGlzLl90aW1lVG9QaXhlbCA9IG51bGw7XG4gICAgLy8gdGhpcy5fb3JpZ2luYWxYU2NhbGUgPSBudWxsO1xuXG4gICAgdGhpcy5fb2Zmc2V0ID0gMDtcbiAgICB0aGlzLl96b29tID0gMTtcbiAgICB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZCA9IHBpeGVsc1BlclNlY29uZDtcbiAgICAvLyBwYXJhbXNcbiAgICB0aGlzLl92aXNpYmxlV2lkdGggPSB2aXNpYmxlV2lkdGg7XG4gICAgdGhpcy5fdmlzaWJsZUR1cmF0aW9uID0gdGhpcy52aXNpYmxlV2lkdGggLyB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZDtcbiAgICB0aGlzLl9tYWludGFpblZpc2libGVEdXJhdGlvbiA9IGZhbHNlO1xuXG4gICAgLy8gY3JlYXRlIHRoZSB0aW1lVG9QaXhlbCBzY2FsZVxuICAgIGNvbnN0IHNjYWxlID0gZDNTY2FsZS5saW5lYXIoKVxuICAgICAgLmRvbWFpbihbMCwgMV0pXG4gICAgICAucmFuZ2UoWzAsIHBpeGVsc1BlclNlY29uZF0pO1xuXG4gICAgdGhpcy50aW1lVG9QaXhlbCA9IHNjYWxlO1xuICAgIC8vIHRoaXMub3JpZ2luYWxYU2NhbGUgPSB0aGlzLnRpbWVUb1BpeGVsLmNvcHkoKTtcblxuICAgIHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kID0gdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICBnZXQgcGl4ZWxzUGVyU2Vjb25kKCkge1xuICAgIHJldHVybiB0aGlzLl9vcmlnaW5hbFBpeGVsc1BlclNlY29uZDtcbiAgfVxuXG4gIHNldCBwaXhlbHNQZXJTZWNvbmQodmFsdWUpIHtcbiAgICB0aGlzLl9jb21wdXRlZFBpeGVsc1BlclNlY29uZCA9IHZhbHVlICogdGhpcy56b29tO1xuICAgIHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kID0gdmFsdWU7XG4gICAgdGhpcy5fdXBkYXRlVGltZVRvUGl4ZWxSYW5nZSgpO1xuXG4gICAgLy8gZm9yY2UgY2hpbGRyZW4gc2NhbGUgdXBkYXRlXG4gICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgaWYgKCFjaGlsZC5fdGltZVRvUGl4ZWwpIHsgcmV0dXJuOyB9XG4gICAgICBjaGlsZC5zdHJldGNoUmF0aW8gPSBjaGlsZC5zdHJldGNoUmF0aW87XG4gICAgfSk7XG4gIH1cblxuICBnZXQgY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xuICB9XG5cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMuX29mZnNldCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHpvb20oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3pvb207XG4gIH1cblxuICBzZXQgem9vbSh2YWx1ZSkge1xuICAgIC8vIENvbXB1dGUgY2hhbmdlIHRvIHByb3BhZ2F0ZSB0byBjaGlsZHJlbiB3aG8gaGF2ZSB0aGVpciBvd24gdGltZVRvUGl4ZWxcbiAgICBjb25zdCByYXRpb0NoYW5nZSA9IHZhbHVlIC8gdGhpcy5fem9vbTtcbiAgICB0aGlzLl96b29tID0gdmFsdWU7XG4gICAgdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQgPSB0aGlzLl9vcmlnaW5hbFBpeGVsc1BlclNlY29uZCAqIHZhbHVlO1xuICAgIHRoaXMuX3VwZGF0ZVRpbWVUb1BpeGVsUmFuZ2UoKTtcblxuICAgIHRoaXMuX2NoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgIGlmICghY2hpbGQuX3RpbWVUb1BpeGVsKSB7IHJldHVybjsgfVxuICAgICAgY2hpbGQuc3RyZXRjaFJhdGlvID0gY2hpbGQuc3RyZXRjaFJhdGlvICogcmF0aW9DaGFuZ2U7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgdmlzaWJsZVdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLl92aXNpYmxlV2lkdGg7XG4gIH1cblxuICBzZXQgdmlzaWJsZVdpZHRoKHZhbHVlKSB7XG4gICAgY29uc3Qgd2lkdGhSYXRpbyA9IHZhbHVlIC8gdGhpcy52aXNpYmxlV2lkdGg7XG5cbiAgICB0aGlzLl92aXNpYmxlV2lkdGggPSB2YWx1ZTtcbiAgICB0aGlzLl92aXNpYmxlRHVyYXRpb24gPSB0aGlzLnZpc2libGVXaWR0aCAvIHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuXG4gICAgaWYgKHRoaXMubWFpbnRhaW5WaXNpYmxlRHVyYXRpb24pIHtcbiAgICAgIHRoaXMucGl4ZWxzUGVyU2Vjb25kID0gdGhpcy5fY29tcHV0ZWRQaXhlbHNQZXJTZWNvbmQgKiB3aWR0aFJhdGlvO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcmVhZG9ubHkgKi9cbiAgZ2V0IHZpc2libGVEdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fdmlzaWJsZUR1cmF0aW9uO1xuICB9XG5cbiAgZ2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9tYWludGFpblZpc2libGVEdXJhdGlvbjtcbiAgfVxuXG4gIHNldCBtYWludGFpblZpc2libGVEdXJhdGlvbihib29sKSB7XG4gICAgdGhpcy5fbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSBib29sO1xuICB9XG5cbiAgZ2V0IHRpbWVUb1BpeGVsKCkge1xuICAgIHJldHVybiB0aGlzLl90aW1lVG9QaXhlbDtcbiAgfVxuXG4gIHNldCB0aW1lVG9QaXhlbChzY2FsZSkge1xuICAgIHRoaXMuX3RpbWVUb1BpeGVsID0gc2NhbGU7XG4gIH1cblxuICBfdXBkYXRlVGltZVRvUGl4ZWxSYW5nZSgpIHtcbiAgICB0aGlzLl92aXNpYmxlRHVyYXRpb24gPSB0aGlzLnZpc2libGVXaWR0aCAvIHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kO1xuICAgIHRoaXMudGltZVRvUGl4ZWwucmFuZ2UoWzAsIHRoaXMuX2NvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kXSk7XG4gIH1cbn1cbiJdfQ==