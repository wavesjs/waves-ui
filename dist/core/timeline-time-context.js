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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWVsaW5lLXRpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztJQUFPLE9BQU8sMkJBQU0sVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFpQlQsbUJBQW1CO0FBQzNCLFdBRFEsbUJBQW1CLENBQzFCLGVBQWUsRUFBRSxZQUFZLEVBQUU7MEJBRHhCLG1CQUFtQjs7QUFFcEMsUUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7OztBQUdwQixRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzs7O0FBR3pCLFFBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsUUFBSSxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQzs7QUFFeEMsUUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUM7QUFDbEMsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztBQUNqRSxRQUFJLENBQUMsd0JBQXdCLEdBQUcsS0FBSyxDQUFDOzs7QUFHdEMsUUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUMzQixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FDZCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQzs7QUFFL0IsUUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7OztBQUd6QixRQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztHQUN0RDs7ZUF6QmtCLG1CQUFtQjtBQStCbEMsbUJBQWU7V0FKQSxZQUFHO0FBQ3BCLGVBQU8sSUFBSSxDQUFDLHdCQUF3QixDQUFDO09BQ3RDO1dBRWtCLFVBQUMsS0FBSyxFQUFFO0FBQ3pCLFlBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLEdBQUcsSUFB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QiIsImZpbGUiOiJlczYvY29yZS90aW1lbGluZS10aW1lLWNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZDNTY2FsZSBmcm9tICdkMy1zY2FsZSc7XG5cblxuLyoqXG4gKiAgQGNsYXNzIFZpZXdUaW1lQ29udGV4dFxuICpcbiAqICBBIFZpZXdUaW1lQ29udGV4dCBpbnN0YW5jZSByZXByZXNlbnRzIHRoZSBtYXBwaW5nIGJldHdlZW4gdGhlIHRpbWUgYW5kIHRoZSBwaXhlbCBkb21haW5zXG4gKlxuICogIFRoZSBgVGltZWxpbmVUaW1lQ29udGV4dGAgaGFzIDMgaW1wb3J0YW50IGF0dHJpYnV0ZXM6XG4gKiAgLSBgdGltZUNvbnRleHQudGltZVRvUGl4ZWxgIHdoaWNoIGRlZmluZXMgdGhlIHRpbWUgdG8gcGl4ZWwgdHJhbnNmZXJ0IGZ1bmN0aW9uLCBpdHNlbGYgZGVmaW5lZCBieSB0aGUgYHBpeGVsc1BlclNlY29uZGAgYXR0cmlidXRlIG9mIHRoZSB0aW1lbGluZVxuICogIC0gYHRpbWVDb250ZXh0Lm9mZnNldGAgZGVmaW5lcyBhIGRlY2F5IChpbiB0aW1lIGRvbWFpbikgYXBwbGllZCB0byBhbGwgdGhlIHZpZXdzIG9uIHRoZSB0aW1lbGluZS4gVGhpcyBhbGxvdyB0byBuYXZpZ2F0ZSBpbnNpZGUgdmlzaWJsZUR1cmF0aW9ucyBsb25nZXIgdGhhbiB3aGF0IGNhbiBiZSByZXByZXNlbnRlZCBpbiBMYXllcnMgKHZpZXdzKSBjb250YWluZXJzIChlLmcuIGhvcml6b250YWwgc2Nyb2xsKVxuICogIC0gYHRpbWVDb250ZXh0Lnpvb21gIGRlZmluZXMgdGhlIHpvb20gZmFjdG9yIGFwcGx5ZWQgdG8gdGhlIHRpbWVsaW5lXG4gKlxuICogIEl0IGFsc28gbWFpbnRhaW5zIGFuIGhlbHBlciAoYHZpc2libGVEdXJhdGlvbmApIHdoaWNoIHJlcHJlc2VudCBob3cgbXVjaCB0aW1lIHRoZSBgdHJhY2tzYCBhcmUgZGlzcGxheWluZ1xuICpcbiAqICBJdCBhbHNvIG1haW50YWluIGFuIGFycmF5IG9mIHJlZmVyZW5jZXMgdG8gYWxsIHRoZSBMYXllclRpbWVDb250ZXh0IGF0dGFjaGVkIHRvIHRoZSB0aW1lbGluZSB0byBwcm9wYWdhdGUgY2hhbmdlcyBvbiB0aGUgdGltZSB0byBwaXhlbCByZXByZXNlbnRhdGlvblxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lbGluZVRpbWVDb250ZXh0IHtcbiAgY29uc3RydWN0b3IocGl4ZWxzUGVyU2Vjb25kLCB2aXNpYmxlV2lkdGgpIHtcbiAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xuXG4gICAgLy8gQHJlbmFtZSB0byB0aW1lVG9QaXhlbFxuICAgIHRoaXMuX3RpbWVUb1BpeGVsID0gbnVsbDtcbiAgICAvLyB0aGlzLl9vcmlnaW5hbFhTY2FsZSA9IG51bGw7XG5cbiAgICB0aGlzLl9vZmZzZXQgPSAwO1xuICAgIHRoaXMuX3pvb20gPSAxO1xuICAgIHRoaXMuX3BpeGVsc1BlclNlY29uZCA9IHBpeGVsc1BlclNlY29uZDtcbiAgICAvLyBwYXJhbXNcbiAgICB0aGlzLl92aXNpYmxlV2lkdGggPSB2aXNpYmxlV2lkdGg7XG4gICAgdGhpcy5fdmlzaWJsZUR1cmF0aW9uID0gdGhpcy52aXNpYmxlV2lkdGggLyB0aGlzLnBpeGVsc1BlclNlY29uZDtcbiAgICB0aGlzLl9tYWludGFpblZpc2libGVEdXJhdGlvbiA9IGZhbHNlO1xuXG4gICAgLy8gY3JlYXRlIHRoZSB0aW1lVG9QaXhlbCBzY2FsZVxuICAgIGNvbnN0IHNjYWxlID0gZDNTY2FsZS5saW5lYXIoKVxuICAgICAgLmRvbWFpbihbMCwgMV0pXG4gICAgICAucmFuZ2UoWzAsIHBpeGVsc1BlclNlY29uZF0pO1xuXG4gICAgdGhpcy50aW1lVG9QaXhlbCA9IHNjYWxlO1xuICAgIC8vIHRoaXMub3JpZ2luYWxYU2NhbGUgPSB0aGlzLnRpbWVUb1BpeGVsLmNvcHkoKTtcblxuICAgIHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kID0gdGhpcy5waXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICBnZXQgcGl4ZWxzUGVyU2Vjb25kKCkge1xuICAgIHJldHVybiB0aGlzLl9vcmlnaW5hbFBpeGVsc1BlclNlY29uZDtcbiAgfVxuXG4gIHNldCBwaXhlbHNQZXJTZWNvbmQodmFsdWUpIHtcbiAgICB0aGlzLl9waXhlbHNQZXJTZWNvbmQgPSB2YWx1ZSAqIHRoaXMuem9vbTtcbiAgICB0aGlzLl9vcmlnaW5hbFBpeGVsc1BlclNlY29uZCA9IHZhbHVlO1xuICAgIHRoaXMuX3VwZGF0ZVRpbWVUb1BpeGVsUmFuZ2UoKTtcblxuICAgIC8vIGZvcmNlIGNoaWxkcmVuIHNjYWxlIHVwZGF0ZVxuICAgIHRoaXMuX2NoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgIGlmICghY2hpbGQuX3RpbWVUb1BpeGVsKSB7IHJldHVybjsgfVxuICAgICAgY2hpbGQuc3RyZXRjaFJhdGlvID0gY2hpbGQuc3RyZXRjaFJhdGlvO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IGNvbXB1dGVkUGl4ZWxzUGVyU2Vjb25kKCkge1xuICAgIHJldHVybiB0aGlzLl9waXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICBnZXQgb2Zmc2V0KCkge1xuICAgIHJldHVybiB0aGlzLl9vZmZzZXQ7XG4gIH1cblxuICBzZXQgb2Zmc2V0KHZhbHVlKSB7XG4gICAgdGhpcy5fb2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgem9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy5fem9vbTtcbiAgfVxuXG4gIHNldCB6b29tKHZhbHVlKSB7XG4gICAgLy8gQ29tcHV0ZSBjaGFuZ2UgdG8gcHJvcGFnYXRlIHRvIGNoaWxkcmVuIHdobyBoYXZlIHRoZWlyIG93biB0aW1lVG9QaXhlbFxuICAgIGNvbnN0IHJhdGlvQ2hhbmdlID0gdmFsdWUgLyB0aGlzLl96b29tO1xuICAgIHRoaXMuX3pvb20gPSB2YWx1ZTtcbiAgICB0aGlzLl9waXhlbHNQZXJTZWNvbmQgPSB0aGlzLl9vcmlnaW5hbFBpeGVsc1BlclNlY29uZCAqIHZhbHVlO1xuICAgIHRoaXMuX3VwZGF0ZVRpbWVUb1BpeGVsUmFuZ2UoKTtcblxuICAgIHRoaXMuX2NoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgIGlmICghY2hpbGQuX3RpbWVUb1BpeGVsKSB7IHJldHVybjsgfVxuICAgICAgY2hpbGQuc3RyZXRjaFJhdGlvID0gY2hpbGQuc3RyZXRjaFJhdGlvICogcmF0aW9DaGFuZ2U7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgdmlzaWJsZVdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLl92aXNpYmxlV2lkdGg7XG4gIH1cblxuICBzZXQgdmlzaWJsZVdpZHRoKHZhbHVlKSB7XG4gICAgY29uc3Qgd2lkdGhSYXRpbyA9IHZhbHVlIC8gdGhpcy52aXNpYmxlV2lkdGg7XG5cbiAgICB0aGlzLl92aXNpYmxlV2lkdGggPSB2YWx1ZTtcbiAgICB0aGlzLl92aXNpYmxlRHVyYXRpb24gPSB0aGlzLnZpc2libGVXaWR0aCAvIHRoaXMucGl4ZWxzUGVyU2Vjb25kO1xuXG4gICAgaWYgKHRoaXMubWFpbnRhaW5WaXNpYmxlRHVyYXRpb24pIHtcbiAgICAgIHRoaXMucGl4ZWxzUGVyU2Vjb25kID0gdGhpcy5waXhlbHNQZXJTZWNvbmQgKiB3aWR0aFJhdGlvO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcmVhZG9ubHkgKi9cbiAgZ2V0IHZpc2libGVEdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fdmlzaWJsZUR1cmF0aW9uO1xuICB9XG5cbiAgZ2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9tYWludGFpblZpc2libGVEdXJhdGlvbjtcbiAgfVxuXG4gIHNldCBtYWludGFpblZpc2libGVEdXJhdGlvbihib29sKSB7XG4gICAgdGhpcy5fbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSBib29sO1xuICB9XG5cbiAgZ2V0IHRpbWVUb1BpeGVsKCkge1xuICAgIHJldHVybiB0aGlzLl90aW1lVG9QaXhlbDtcbiAgfVxuXG4gIHNldCB0aW1lVG9QaXhlbChzY2FsZSkge1xuICAgIHRoaXMuX3RpbWVUb1BpeGVsID0gc2NhbGU7XG4gIH1cblxuICBnZXQgb3JpZ2luYWxQaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29yaWdpbmFsUGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgX3VwZGF0ZVRpbWVUb1BpeGVsUmFuZ2UoKSB7XG4gICAgdGhpcy5fdmlzaWJsZUR1cmF0aW9uID0gdGhpcy52aXNpYmxlV2lkdGggLyB0aGlzLnBpeGVsc1BlclNlY29uZDtcbiAgICB0aGlzLnRpbWVUb1BpeGVsLnJhbmdlKFswLCB0aGlzLl9waXhlbHNQZXJTZWNvbmRdKTtcbiAgfVxufVxuIl19