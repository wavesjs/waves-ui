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
    this._visibleDuration = this.visibleWidth / this.pixelsPerSecond;
    this._maintainVisibleDuration = false;

    // create the timeToPixel scale
    var scale = d3Scale.linear().domain([0, 1]).range([0, pixelsPerSecond]);

    this.timeToPixel = scale;
    // this.originalXScale = this.timeToPixel.copy();

    this._originalPixelsPerSecond = this.pixelsPerSecond;
  }

  _createClass(TimelineTimeContext, {
    pixelsPerSecond: {
      get: function () {
        return this._pixelsPerSecond;
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
        this._visibleDuration = this.visibleWidth / this.pixelsPerSecond;

        if (this.maintainVisibleDuration) {
          this.pixelsPerSecond = this.pixelsPerSecond * widthRatio;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWVsaW5lLXRpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztJQUFPLE9BQU8sMkJBQU0sVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFpQlQsbUJBQW1CO0FBQzNCLFdBRFEsbUJBQW1CLENBQzFCLGVBQWUsRUFBRSxZQUFZLEVBQUU7MEJBRHhCLG1CQUFtQjs7QUFFcEMsUUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7OztBQUdwQixRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzs7O0FBR3pCLFFBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsUUFBSSxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQzs7QUFFeEMsUUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUM7QUFDbEMsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztBQUNqRSxRQUFJLENBQUMsd0JBQXdCLEdBQUcsS0FBSyxDQUFDOzs7QUFHdEMsUUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUMzQixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FDZCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQzs7QUFFL0IsUUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7OztBQUd6QixRQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztHQUN0RDs7ZUF6QmtCLG1CQUFtQjtBQStCbEMsbUJBQWU7V0FKQSxZQUFHO0FBQ3BCLGVBQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDO09BQzlCO1dBRWtCLFVBQUMsS0FBSyxFQUFFO0FBQ3pCLFlBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLEdBQUcsSUFB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OlsiaW1wb3J0IGQzU2NhbGUgZnJvbSAnZDMtc2NhbGUnO1xuXG5cbi8qKlxuICogIEBjbGFzcyBWaWV3VGltZUNvbnRleHRcbiAqXG4gKiAgQSBWaWV3VGltZUNvbnRleHQgaW5zdGFuY2UgcmVwcmVzZW50cyB0aGUgbWFwcGluZyBiZXR3ZWVuIHRoZSB0aW1lIGFuZCB0aGUgcGl4ZWwgZG9tYWluc1xuICpcbiAqICBUaGUgYFRpbWVsaW5lVGltZUNvbnRleHRgIGhhcyAzIGltcG9ydGFudCBhdHRyaWJ1dGVzOlxuICogIC0gYHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsYCB3aGljaCBkZWZpbmVzIHRoZSB0aW1lIHRvIHBpeGVsIHRyYW5zZmVydCBmdW5jdGlvbiwgaXRzZWxmIGRlZmluZWQgYnkgdGhlIGBwaXhlbHNQZXJTZWNvbmRgIGF0dHJpYnV0ZSBvZiB0aGUgdGltZWxpbmVcbiAqICAtIGB0aW1lQ29udGV4dC5vZmZzZXRgIGRlZmluZXMgYSBkZWNheSAoaW4gdGltZSBkb21haW4pIGFwcGxpZWQgdG8gYWxsIHRoZSB2aWV3cyBvbiB0aGUgdGltZWxpbmUuIFRoaXMgYWxsb3cgdG8gbmF2aWdhdGUgaW5zaWRlIHZpc2libGVEdXJhdGlvbnMgbG9uZ2VyIHRoYW4gd2hhdCBjYW4gYmUgcmVwcmVzZW50ZWQgaW4gTGF5ZXJzICh2aWV3cykgY29udGFpbmVycyAoZS5nLiBob3Jpem9udGFsIHNjcm9sbClcbiAqICAtIGB0aW1lQ29udGV4dC56b29tYCBkZWZpbmVzIHRoZSB6b29tIGZhY3RvciBhcHBseWVkIHRvIHRoZSB0aW1lbGluZVxuICpcbiAqICBJdCBhbHNvIG1haW50YWlucyBhbiBoZWxwZXIgKGB2aXNpYmxlRHVyYXRpb25gKSB3aGljaCByZXByZXNlbnQgaG93IG11Y2ggdGltZSB0aGUgYHRyYWNrc2AgYXJlIGRpc3BsYXlpbmdcbiAqXG4gKiAgSXQgYWxzbyBtYWludGFpbiBhbiBhcnJheSBvZiByZWZlcmVuY2VzIHRvIGFsbCB0aGUgTGF5ZXJUaW1lQ29udGV4dCBhdHRhY2hlZCB0byB0aGUgdGltZWxpbmUgdG8gcHJvcGFnYXRlIGNoYW5nZXMgb24gdGhlIHRpbWUgdG8gcGl4ZWwgcmVwcmVzZW50YXRpb25cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWxpbmVUaW1lQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKHBpeGVsc1BlclNlY29uZCwgdmlzaWJsZVdpZHRoKSB7XG4gICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcblxuICAgIC8vIEByZW5hbWUgdG8gdGltZVRvUGl4ZWxcbiAgICB0aGlzLl90aW1lVG9QaXhlbCA9IG51bGw7XG4gICAgLy8gdGhpcy5fb3JpZ2luYWxYU2NhbGUgPSBudWxsO1xuXG4gICAgdGhpcy5fb2Zmc2V0ID0gMDtcbiAgICB0aGlzLl96b29tID0gMTtcbiAgICB0aGlzLl9waXhlbHNQZXJTZWNvbmQgPSBwaXhlbHNQZXJTZWNvbmQ7XG4gICAgLy8gcGFyYW1zXG4gICAgdGhpcy5fdmlzaWJsZVdpZHRoID0gdmlzaWJsZVdpZHRoO1xuICAgIHRoaXMuX3Zpc2libGVEdXJhdGlvbiA9IHRoaXMudmlzaWJsZVdpZHRoIC8gdGhpcy5waXhlbHNQZXJTZWNvbmQ7XG4gICAgdGhpcy5fbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSBmYWxzZTtcblxuICAgIC8vIGNyZWF0ZSB0aGUgdGltZVRvUGl4ZWwgc2NhbGVcbiAgICBjb25zdCBzY2FsZSA9IGQzU2NhbGUubGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIDFdKVxuICAgICAgLnJhbmdlKFswLCBwaXhlbHNQZXJTZWNvbmRdKTtcblxuICAgIHRoaXMudGltZVRvUGl4ZWwgPSBzY2FsZTtcbiAgICAvLyB0aGlzLm9yaWdpbmFsWFNjYWxlID0gdGhpcy50aW1lVG9QaXhlbC5jb3B5KCk7XG5cbiAgICB0aGlzLl9vcmlnaW5hbFBpeGVsc1BlclNlY29uZCA9IHRoaXMucGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgZ2V0IHBpeGVsc1BlclNlY29uZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgc2V0IHBpeGVsc1BlclNlY29uZCh2YWx1ZSkge1xuICAgIHRoaXMuX3BpeGVsc1BlclNlY29uZCA9IHZhbHVlICogdGhpcy56b29tO1xuICAgIHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kID0gdmFsdWU7XG4gICAgdGhpcy5fdXBkYXRlVGltZVRvUGl4ZWxSYW5nZSgpO1xuXG4gICAgLy8gZm9yY2UgY2hpbGRyZW4gc2NhbGUgdXBkYXRlXG4gICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgaWYgKCFjaGlsZC5fdGltZVRvUGl4ZWwpIHsgcmV0dXJuOyB9XG4gICAgICBjaGlsZC5zdHJldGNoUmF0aW8gPSBjaGlsZC5zdHJldGNoUmF0aW87XG4gICAgfSk7XG4gIH1cblxuICBnZXQgb2Zmc2V0KCkge1xuICAgIHJldHVybiB0aGlzLl9vZmZzZXQ7XG4gIH1cblxuICBzZXQgb2Zmc2V0KHZhbHVlKSB7XG4gICAgdGhpcy5fb2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgem9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy5fem9vbTtcbiAgfVxuXG4gIHNldCB6b29tKHZhbHVlKSB7XG4gICAgLy8gQ29tcHV0ZSBjaGFuZ2UgdG8gcHJvcGFnYXRlIHRvIGNoaWxkcmVuIHdobyBoYXZlIHRoZWlyIG93biB0aW1lVG9QaXhlbFxuICAgIGNvbnN0IHJhdGlvQ2hhbmdlID0gdmFsdWUgLyB0aGlzLl96b29tO1xuICAgIHRoaXMuX3pvb20gPSB2YWx1ZTtcbiAgICB0aGlzLl9waXhlbHNQZXJTZWNvbmQgPSB0aGlzLl9vcmlnaW5hbFBpeGVsc1BlclNlY29uZCAqIHZhbHVlO1xuICAgIHRoaXMuX3VwZGF0ZVRpbWVUb1BpeGVsUmFuZ2UoKTtcblxuICAgIHRoaXMuX2NoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgIGlmICghY2hpbGQuX3RpbWVUb1BpeGVsKSB7IHJldHVybjsgfVxuICAgICAgY2hpbGQuc3RyZXRjaFJhdGlvID0gY2hpbGQuc3RyZXRjaFJhdGlvICogcmF0aW9DaGFuZ2U7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgdmlzaWJsZVdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLl92aXNpYmxlV2lkdGg7XG4gIH1cblxuICBzZXQgdmlzaWJsZVdpZHRoKHZhbHVlKSB7XG4gICAgY29uc3Qgd2lkdGhSYXRpbyA9IHZhbHVlIC8gdGhpcy52aXNpYmxlV2lkdGg7XG5cbiAgICB0aGlzLl92aXNpYmxlV2lkdGggPSB2YWx1ZTtcbiAgICB0aGlzLl92aXNpYmxlRHVyYXRpb24gPSB0aGlzLnZpc2libGVXaWR0aCAvIHRoaXMucGl4ZWxzUGVyU2Vjb25kO1xuXG4gICAgaWYgKHRoaXMubWFpbnRhaW5WaXNpYmxlRHVyYXRpb24pIHtcbiAgICAgIHRoaXMucGl4ZWxzUGVyU2Vjb25kID0gdGhpcy5waXhlbHNQZXJTZWNvbmQgKiB3aWR0aFJhdGlvO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcmVhZG9ubHkgKi9cbiAgZ2V0IHZpc2libGVEdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fdmlzaWJsZUR1cmF0aW9uO1xuICB9XG5cbiAgZ2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9tYWludGFpblZpc2libGVEdXJhdGlvbjtcbiAgfVxuXG4gIHNldCBtYWludGFpblZpc2libGVEdXJhdGlvbihib29sKSB7XG4gICAgdGhpcy5fbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSBib29sO1xuICB9XG5cbiAgZ2V0IHRpbWVUb1BpeGVsKCkge1xuICAgIHJldHVybiB0aGlzLl90aW1lVG9QaXhlbDtcbiAgfVxuXG4gIHNldCB0aW1lVG9QaXhlbChzY2FsZSkge1xuICAgIHRoaXMuX3RpbWVUb1BpeGVsID0gc2NhbGU7XG4gIH1cblxuICBnZXQgb3JpZ2luYWxQaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgX3VwZGF0ZVRpbWVUb1BpeGVsUmFuZ2UoKSB7XG4gICAgdGhpcy5fdmlzaWJsZUR1cmF0aW9uID0gdGhpcy52aXNpYmxlV2lkdGggLyB0aGlzLnBpeGVsc1BlclNlY29uZDtcbiAgICB0aGlzLnRpbWVUb1BpeGVsLnJhbmdlKFswLCB0aGlzLl9waXhlbHNQZXJTZWNvbmRdKTtcbiAgfVxufVxuIl19