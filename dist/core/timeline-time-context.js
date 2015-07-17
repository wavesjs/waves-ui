"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _slicedToArray = require("babel-runtime/helpers/sliced-to-array")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var d3Scale = _interopRequire(require("d3-scale"));

var AbstractTimeContext = _interopRequire(require("./abstract-time-context"));

/**
 *  @class ViewTimeContext
 *
 *  A ViewTimeContext instance represents the mapping between the time and the pixel domains
 *
 *  The `TimelineTimeContext` has 3 important attributes:
 *  - `timeContext.xScale` which defines the time to pixel transfert function, itself defined by the `pixelsPerSecond` attribute of the timeline
 *  - `timeContext.offset` defines a decay (in time domain) applied to all the views on the timeline. This allow to navigate inside visibleDurations longer than what can be represented in Layers (views) containers (e.g. horizontal scroll)
 *  - `timeContext.zoom` defines the zoom factor applyed to the timeline
 *
 *  It also maintains an helper (`visibleDuration`) which represent how much time the `tracks` are displaying
 *
 *  It also maintain an array of references to all the LayerTimeContext attached to the timeline to propagate changes on the time to pixel representation
 */

var TimelineTimeContext = (function (_AbstractTimeContext) {
  function TimelineTimeContext(pixelsPerSecond, visibleWidth) {
    _classCallCheck(this, TimelineTimeContext);

    _get(_core.Object.getPrototypeOf(TimelineTimeContext.prototype), "constructor", this).call(this, {});

    this._children = [];

    // @rename to timeToPixel
    this._xScale = null;
    this._originalXScale = null;

    this._offset = 0;
    this._zoom = 1;
    this._pixelsPerSecond = pixelsPerSecond;
    // params
    this._visibleWidth = visibleWidth;
    this._visibleDuration = this.visibleWidth / this.pixelsPerSecond;
    this._maintainVisibleDuration = false;

    // create the timeToPixel scale
    var xScale = d3Scale.linear().domain([0, 1]).range([0, pixelsPerSecond]);

    this.xScale = xScale;
  }

  _inherits(TimelineTimeContext, _AbstractTimeContext);

  _createClass(TimelineTimeContext, {
    pixelsPerSecond: {
      get: function () {
        return this._pixelsPerSecond;
      },
      set: function (value) {
        this._pixelsPerSecond = value;

        this.xScaleRange = [0, this.pixelsPerSecond];
        this._visibleDuration = this.visibleWidth / this.pixelsPerSecond;
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
        var xScale = this.originalXScale.copy();

        var _xScale$domain = xScale.domain();

        var _xScale$domain2 = _slicedToArray(_xScale$domain, 2);

        var min = _xScale$domain2[0];
        var max = _xScale$domain2[1];

        var diff = (max - min) / value;

        xScale.domain([min, min + diff]);

        this._xScale = xScale;
        this._zoom = value;

        // Propagate change to children who have their own xScale
        var ratioChange = value / this._zoom;

        this._children.forEach(function (child) {
          if (!child._xScale) {
            return;
          }
          child.stretchRatio = child.zoom * ratioChange;
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
      get: function () {
        return this._visibleDuration;
      }
    },
    maintainVisibleDuration: {

      // set visibleDuration(value) {
      //   this._visibleDuration = value;
      // }

      get: function () {
        return this._maintainVisibleDuration;
      },
      set: function (bool) {
        this._maintainVisibleDuration = bool;
      }
    },
    xScale: {

      // @TODO rename to timeToPixel

      get: function () {
        return this._xScale;
      },
      set: function (scale) {
        this._xScale = scale;

        if (!this._originalXScale) {
          this._originalXScale = this._xScale.copy();
        }
      }
    },
    xScaleRange: {
      get: function () {
        return this._xScale.range();
      },
      set: function (arr) {
        this._xScale.range(arr);
        this._originalXScale.range(arr);
        // propagate to children
        this._children.forEach(function (child) {
          child.xScaleRange = arr;
        });
      }
    },
    originalXScale: {
      get: function () {
        return this._originalXScale;
      },
      set: function (scale) {
        this._originalXScale = scale;
      }
    }
  });

  return TimelineTimeContext;
})(AbstractTimeContext);

module.exports = TimelineTimeContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWVsaW5lLXRpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0lBQU8sT0FBTywyQkFBTSxVQUFVOztJQUN2QixtQkFBbUIsMkJBQU0seUJBQXlCOzs7Ozs7Ozs7Ozs7Ozs7OztJQWdCcEMsbUJBQW1CO0FBQzNCLFdBRFEsbUJBQW1CLENBQzFCLGVBQWUsRUFBRSxZQUFZLEVBQUU7MEJBRHhCLG1CQUFtQjs7QUFFcEMscUNBRmlCLG1CQUFtQiw2Q0FFOUIsRUFBRSxFQUFFOztBQUVWLFFBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDOzs7QUFHcEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEIsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7O0FBRTVCLFFBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsUUFBSSxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQzs7QUFFeEMsUUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUM7QUFDbEMsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztBQUNqRSxRQUFJLENBQUMsd0JBQXdCLEdBQUcsS0FBSyxDQUFDOzs7QUFHdEMsUUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUM1QixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FDZCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQzs7QUFFL0IsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7R0FDdEI7O1lBeEJrQixtQkFBbUI7O2VBQW5CLG1CQUFtQjtBQThCbEMsbUJBQWU7V0FKQSxZQUFHO0FBQ3BCLGVBQU8sSUFBSSxDQUFDLGdCQUFnQixD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RUFBRTtBQUNuQixZQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QixZQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFaEMsWUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFBRSxlQUFLLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztTQUFFLENBQUMsQ0FBQztPQUNqRTs7QUFNRyxrQkFBYztXQUpBLFlBQUc7QUFDbkIsZUFBTyxJQUFJLENBQUMsZUFBZSxDQUFDO09BQzdCO1dBRWlCLFVBQUMsS0FBSyxFQUFFO0FBQ3hCLFlBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO09BQzlCOzs7O1NBaklrQixtQkFBbUI7R0FBUyxtQkFBbUI7O2lCQUEvQyxtQkFBbUIiLCJmaWxlIjoiZXM2L2NvcmUvdGltZWxpbmUtdGltZS1jb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGQzU2NhbGUgZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IEFic3RyYWN0VGltZUNvbnRleHQgZnJvbSAnLi9hYnN0cmFjdC10aW1lLWNvbnRleHQnO1xuXG4vKipcbiAqICBAY2xhc3MgVmlld1RpbWVDb250ZXh0XG4gKlxuICogIEEgVmlld1RpbWVDb250ZXh0IGluc3RhbmNlIHJlcHJlc2VudHMgdGhlIG1hcHBpbmcgYmV0d2VlbiB0aGUgdGltZSBhbmQgdGhlIHBpeGVsIGRvbWFpbnNcbiAqXG4gKiAgVGhlIGBUaW1lbGluZVRpbWVDb250ZXh0YCBoYXMgMyBpbXBvcnRhbnQgYXR0cmlidXRlczpcbiAqICAtIGB0aW1lQ29udGV4dC54U2NhbGVgIHdoaWNoIGRlZmluZXMgdGhlIHRpbWUgdG8gcGl4ZWwgdHJhbnNmZXJ0IGZ1bmN0aW9uLCBpdHNlbGYgZGVmaW5lZCBieSB0aGUgYHBpeGVsc1BlclNlY29uZGAgYXR0cmlidXRlIG9mIHRoZSB0aW1lbGluZVxuICogIC0gYHRpbWVDb250ZXh0Lm9mZnNldGAgZGVmaW5lcyBhIGRlY2F5IChpbiB0aW1lIGRvbWFpbikgYXBwbGllZCB0byBhbGwgdGhlIHZpZXdzIG9uIHRoZSB0aW1lbGluZS4gVGhpcyBhbGxvdyB0byBuYXZpZ2F0ZSBpbnNpZGUgdmlzaWJsZUR1cmF0aW9ucyBsb25nZXIgdGhhbiB3aGF0IGNhbiBiZSByZXByZXNlbnRlZCBpbiBMYXllcnMgKHZpZXdzKSBjb250YWluZXJzIChlLmcuIGhvcml6b250YWwgc2Nyb2xsKVxuICogIC0gYHRpbWVDb250ZXh0Lnpvb21gIGRlZmluZXMgdGhlIHpvb20gZmFjdG9yIGFwcGx5ZWQgdG8gdGhlIHRpbWVsaW5lXG4gKlxuICogIEl0IGFsc28gbWFpbnRhaW5zIGFuIGhlbHBlciAoYHZpc2libGVEdXJhdGlvbmApIHdoaWNoIHJlcHJlc2VudCBob3cgbXVjaCB0aW1lIHRoZSBgdHJhY2tzYCBhcmUgZGlzcGxheWluZ1xuICpcbiAqICBJdCBhbHNvIG1haW50YWluIGFuIGFycmF5IG9mIHJlZmVyZW5jZXMgdG8gYWxsIHRoZSBMYXllclRpbWVDb250ZXh0IGF0dGFjaGVkIHRvIHRoZSB0aW1lbGluZSB0byBwcm9wYWdhdGUgY2hhbmdlcyBvbiB0aGUgdGltZSB0byBwaXhlbCByZXByZXNlbnRhdGlvblxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lbGluZVRpbWVDb250ZXh0IGV4dGVuZHMgQWJzdHJhY3RUaW1lQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKHBpeGVsc1BlclNlY29uZCwgdmlzaWJsZVdpZHRoKSB7XG4gICAgc3VwZXIoe30pO1xuXG4gICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcblxuICAgIC8vIEByZW5hbWUgdG8gdGltZVRvUGl4ZWxcbiAgICB0aGlzLl94U2NhbGUgPSBudWxsO1xuICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlID0gbnVsbDtcblxuICAgIHRoaXMuX29mZnNldCA9IDA7XG4gICAgdGhpcy5fem9vbSA9IDE7XG4gICAgdGhpcy5fcGl4ZWxzUGVyU2Vjb25kID0gcGl4ZWxzUGVyU2Vjb25kO1xuICAgIC8vIHBhcmFtc1xuICAgIHRoaXMuX3Zpc2libGVXaWR0aCA9IHZpc2libGVXaWR0aDtcbiAgICB0aGlzLl92aXNpYmxlRHVyYXRpb24gPSB0aGlzLnZpc2libGVXaWR0aCAvIHRoaXMucGl4ZWxzUGVyU2Vjb25kO1xuICAgIHRoaXMuX21haW50YWluVmlzaWJsZUR1cmF0aW9uID0gZmFsc2U7XG5cbiAgICAvLyBjcmVhdGUgdGhlIHRpbWVUb1BpeGVsIHNjYWxlXG4gICAgY29uc3QgeFNjYWxlID0gZDNTY2FsZS5saW5lYXIoKVxuICAgICAgLmRvbWFpbihbMCwgMV0pXG4gICAgICAucmFuZ2UoWzAsIHBpeGVsc1BlclNlY29uZF0pO1xuXG4gICAgdGhpcy54U2NhbGUgPSB4U2NhbGU7XG4gIH1cblxuICBnZXQgcGl4ZWxzUGVyU2Vjb25kKCkge1xuICAgIHJldHVybiB0aGlzLl9waXhlbHNQZXJTZWNvbmRcbiAgfVxuXG4gIHNldCBwaXhlbHNQZXJTZWNvbmQodmFsdWUpIHtcbiAgICB0aGlzLl9waXhlbHNQZXJTZWNvbmQgPSB2YWx1ZTtcblxuICAgIHRoaXMueFNjYWxlUmFuZ2UgPSBbMCwgdGhpcy5waXhlbHNQZXJTZWNvbmRdO1xuICAgIHRoaXMuX3Zpc2libGVEdXJhdGlvbiA9IHRoaXMudmlzaWJsZVdpZHRoIC8gdGhpcy5waXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICBnZXQgb2Zmc2V0KCkge1xuICAgIHJldHVybiB0aGlzLl9vZmZzZXQ7XG4gIH1cblxuICBzZXQgb2Zmc2V0KHZhbHVlKSB7XG4gICAgdGhpcy5fb2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgem9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy5fem9vbTtcbiAgfVxuXG4gIHNldCB6b29tKHZhbHVlKSB7XG4gICAgY29uc3QgeFNjYWxlID0gdGhpcy5vcmlnaW5hbFhTY2FsZS5jb3B5KCk7XG4gICAgY29uc3QgW21pbiwgbWF4XSA9IHhTY2FsZS5kb21haW4oKTtcbiAgICBjb25zdCBkaWZmID0gKG1heCAtIG1pbikgLyB2YWx1ZTtcblxuICAgIHhTY2FsZS5kb21haW4oW21pbiwgbWluICsgZGlmZl0pO1xuXG4gICAgdGhpcy5feFNjYWxlID0geFNjYWxlO1xuICAgIHRoaXMuX3pvb20gPSB2YWx1ZTtcblxuICAgIC8vIFByb3BhZ2F0ZSBjaGFuZ2UgdG8gY2hpbGRyZW4gd2hvIGhhdmUgdGhlaXIgb3duIHhTY2FsZVxuICAgIGNvbnN0IHJhdGlvQ2hhbmdlID0gdmFsdWUgLyAodGhpcy5fem9vbSk7XG5cbiAgICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICBpZiAoIWNoaWxkLl94U2NhbGUpIHsgcmV0dXJuOyB9XG4gICAgICBjaGlsZC5zdHJldGNoUmF0aW8gPSBjaGlsZC56b29tICogcmF0aW9DaGFuZ2U7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgdmlzaWJsZVdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLl92aXNpYmxlV2lkdGg7XG4gIH1cblxuICBzZXQgdmlzaWJsZVdpZHRoKHZhbHVlKSB7XG4gICAgY29uc3Qgd2lkdGhSYXRpbyA9IHZhbHVlIC8gdGhpcy52aXNpYmxlV2lkdGg7XG5cbiAgICB0aGlzLl92aXNpYmxlV2lkdGggPSB2YWx1ZTtcbiAgICB0aGlzLl92aXNpYmxlRHVyYXRpb24gPSB0aGlzLnZpc2libGVXaWR0aCAvIHRoaXMucGl4ZWxzUGVyU2Vjb25kO1xuXG4gICAgaWYgKHRoaXMubWFpbnRhaW5WaXNpYmxlRHVyYXRpb24pIHtcbiAgICAgIHRoaXMucGl4ZWxzUGVyU2Vjb25kID0gdGhpcy5waXhlbHNQZXJTZWNvbmQgKiB3aWR0aFJhdGlvO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2aXNpYmxlRHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Zpc2libGVEdXJhdGlvbjtcbiAgfVxuXG4gIC8vIHNldCB2aXNpYmxlRHVyYXRpb24odmFsdWUpIHtcbiAgLy8gICB0aGlzLl92aXNpYmxlRHVyYXRpb24gPSB2YWx1ZTtcbiAgLy8gfVxuXG4gIGdldCBtYWludGFpblZpc2libGVEdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFpbnRhaW5WaXNpYmxlRHVyYXRpb247XG4gIH1cblxuICBzZXQgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24oYm9vbCkge1xuICAgIHRoaXMuX21haW50YWluVmlzaWJsZUR1cmF0aW9uID0gYm9vbDtcbiAgfVxuXG4gIC8vIEBUT0RPIHJlbmFtZSB0byB0aW1lVG9QaXhlbFxuICBnZXQgeFNjYWxlKCkge1xuICAgIHJldHVybiB0aGlzLl94U2NhbGU7XG4gIH1cblxuICBzZXQgeFNjYWxlKHNjYWxlKSB7XG4gICAgdGhpcy5feFNjYWxlID0gc2NhbGU7XG5cbiAgICBpZiAoIXRoaXMuX29yaWdpbmFsWFNjYWxlKSB7XG4gICAgICB0aGlzLl9vcmlnaW5hbFhTY2FsZSA9IHRoaXMuX3hTY2FsZS5jb3B5KCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHhTY2FsZVJhbmdlKCkge1xuICAgIHJldHVybiB0aGlzLl94U2NhbGUucmFuZ2UoKTtcbiAgfVxuXG4gIHNldCB4U2NhbGVSYW5nZShhcnIpIHtcbiAgICB0aGlzLl94U2NhbGUucmFuZ2UoYXJyKTtcbiAgICB0aGlzLl9vcmlnaW5hbFhTY2FsZS5yYW5nZShhcnIpO1xuICAgIC8vIHByb3BhZ2F0ZSB0byBjaGlsZHJlblxuICAgIHRoaXMuX2NoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7IGNoaWxkLnhTY2FsZVJhbmdlID0gYXJyOyB9KTtcbiAgfVxuXG4gIGdldCBvcmlnaW5hbFhTY2FsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fb3JpZ2luYWxYU2NhbGU7XG4gIH1cblxuICBzZXQgb3JpZ2luYWxYU2NhbGUoc2NhbGUpIHtcbiAgICB0aGlzLl9vcmlnaW5hbFhTY2FsZSA9IHNjYWxlO1xuICB9XG59XG4iXX0=