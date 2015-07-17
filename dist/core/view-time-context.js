"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _slicedToArray = require("babel-runtime/helpers/sliced-to-array")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var AbstractTimeContext = _interopRequire(require("./abstract-time-context"));

/**
 *  @class ViewTimeContext
 *
 *  A ViewTimeContext instance represents the mapping between the time and the pixel domains
 *
 *  The `timelineTimeContext` has 3 important attributes:
 *  - `timeContext.xScale` which defines the time to pixel transfert function, itself defined by the `pixelsPerSecond` attribute of the timeline
 *  - `timeContext.offset` defines a decay (in time domain) applied to all the views on the timeline. This allow to navigate inside durations longer than what can be represented in Layers (views) containers (e.g. horizontal scroll)
 *  - `timeContext.zoom` defines the zoom factor applyed to the timeline
 *
 *  It owns an helper `timeContext.duration` which maintain a view on how much time the views applyed to the timeline (the `containers`) are representing
 *
 *  It also maintain an array of references to all the LayerTimeContext attached to the timeline to propagate some global change on the time to pixel representation
 */

var TimelineTimeContext = (function (_AbstractTimeContext) {
  function TimelineTimeContext() {
    _classCallCheck(this, TimelineTimeContext);

    _get(_core.Object.getPrototypeOf(TimelineTimeContext.prototype), "constructor", this).call(this, {});

    this._children = [];

    this._xScale = null;
    this._originalXScale = null;

    // params
    this._duration = 1; // for layers inheritance only
    this._offset = 0;
    this._zoom = 1;
  }

  _inherits(TimelineTimeContext, _AbstractTimeContext);

  _createClass(TimelineTimeContext, {
    duration: {
      get: function () {
        return this._duration;
      },
      set: function (value) {
        this._duration = value;
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
    xScale: {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3ZpZXctdGltZS1jb250ZXh0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBTyxtQkFBbUIsMkJBQU0seUJBQXlCOzs7Ozs7Ozs7Ozs7Ozs7OztJQWdCcEMsbUJBQW1CO0FBQzNCLFdBRFEsbUJBQW1CLEdBQ3hCOzBCQURLLG1CQUFtQjs7QUFFcEMscUNBRmlCLG1CQUFtQiw2Q0FFOUIsRUFBRSxFQUFFOztBQUVWLFFBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDOztBQUVwQixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUNwQixRQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQzs7O0FBRzVCLFFBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLFFBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0dBQ2hCOztZQWJrQixtQkFBbUI7O2VBQW5CLG1CQUFtQjtBQW1CbEMsWUFBUTtXQUpBLFlBQUc7QUFDYixlQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7T0FDdkI7V0FFVyxVQUFDLEtBQUssRUFBRTtBQUNsQixZQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztPQUN4Qjs7QUFNRyxVQUFNO1dBSkEsWUFBRztBQUNYLGVBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztPQUNyQjtXQUVTLFVBQUMsS0FBSyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO09BQ3RCOztBQU1HLFFBQUk7V0FKQSxZQUFHO0FBQ1QsZUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO09BQ25CO1dBRU8sVUFBQyxLQUFLLEVBQUU7QUFDZCxZQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDOzs2QkFDdkIsTUFBTSxDQUFDLE1BQU0sRUFBRTs7OztZQUEzQixHQUFHO1lBQUUsR0FBRzs7QUFDZixZQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUEsR0FBSSxLQUFLLENBQUM7O0FBRWpDLGNBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBRWpDLFlBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3RCLFlBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDOzs7QUFHbkIsWUFBTSxXQUFXLEdBQUcsS0FBSyxHQUFJLElBQUksQ0FBQyxLQUFLLEFBQUMsQ0FBQzs7QUFFekMsWUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBUyxLQUFLLEVBQUU7QUFDckMsY0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUU7QUFBRSxtQkFBTztXQUFFO0FBQy9CLGVBQUssQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLElBQUksR0FBRyxXQUFXLENBQUM7U0FDL0MsQ0FBQyxDQUFDO09BQ0o7O0FBTUcsVUFBTTtXQUpBLFlBQUc7QUFDWCxlQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7T0FDckI7V0FFUyxVQUFDLEtBQUssRUFBRTtBQUNoQixZQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQzs7QUFFckIsWUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7QUFDekIsY0FBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQzVDO09BQ0Y7O0FBTUcsZUFBVztXQUpBLFlBQUc7QUFDaEIsZUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO09BQzdCO1dBRWMsVUFBQyxHQUFHLEVBQUU7QUFDbkIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEIsWUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRWhDLFlBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQUUsZUFBSyxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7U0FBRSxDQUFDLENBQUM7T0FDakU7O0FBTUcsa0JBQWM7V0FKQSxZQUFHO0FBQ25CLGVBQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztPQUM3QjtXQUVpQixVQUFDLEtBQUssRUFBRTtBQUN4QixZQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztPQUM5Qjs7OztTQW5Ga0IsbUJBQW1CO0dBQVMsbUJBQW1COztpQkFBL0MsbUJBQW1CIiwiZmlsZSI6ImVzNi9jb3JlL3ZpZXctdGltZS1jb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFic3RyYWN0VGltZUNvbnRleHQgZnJvbSAnLi9hYnN0cmFjdC10aW1lLWNvbnRleHQnO1xuXG4vKipcbiAqICBAY2xhc3MgVmlld1RpbWVDb250ZXh0XG4gKlxuICogIEEgVmlld1RpbWVDb250ZXh0IGluc3RhbmNlIHJlcHJlc2VudHMgdGhlIG1hcHBpbmcgYmV0d2VlbiB0aGUgdGltZSBhbmQgdGhlIHBpeGVsIGRvbWFpbnNcbiAqXG4gKiAgVGhlIGB0aW1lbGluZVRpbWVDb250ZXh0YCBoYXMgMyBpbXBvcnRhbnQgYXR0cmlidXRlczpcbiAqICAtIGB0aW1lQ29udGV4dC54U2NhbGVgIHdoaWNoIGRlZmluZXMgdGhlIHRpbWUgdG8gcGl4ZWwgdHJhbnNmZXJ0IGZ1bmN0aW9uLCBpdHNlbGYgZGVmaW5lZCBieSB0aGUgYHBpeGVsc1BlclNlY29uZGAgYXR0cmlidXRlIG9mIHRoZSB0aW1lbGluZVxuICogIC0gYHRpbWVDb250ZXh0Lm9mZnNldGAgZGVmaW5lcyBhIGRlY2F5IChpbiB0aW1lIGRvbWFpbikgYXBwbGllZCB0byBhbGwgdGhlIHZpZXdzIG9uIHRoZSB0aW1lbGluZS4gVGhpcyBhbGxvdyB0byBuYXZpZ2F0ZSBpbnNpZGUgZHVyYXRpb25zIGxvbmdlciB0aGFuIHdoYXQgY2FuIGJlIHJlcHJlc2VudGVkIGluIExheWVycyAodmlld3MpIGNvbnRhaW5lcnMgKGUuZy4gaG9yaXpvbnRhbCBzY3JvbGwpXG4gKiAgLSBgdGltZUNvbnRleHQuem9vbWAgZGVmaW5lcyB0aGUgem9vbSBmYWN0b3IgYXBwbHllZCB0byB0aGUgdGltZWxpbmVcbiAqXG4gKiAgSXQgb3ducyBhbiBoZWxwZXIgYHRpbWVDb250ZXh0LmR1cmF0aW9uYCB3aGljaCBtYWludGFpbiBhIHZpZXcgb24gaG93IG11Y2ggdGltZSB0aGUgdmlld3MgYXBwbHllZCB0byB0aGUgdGltZWxpbmUgKHRoZSBgY29udGFpbmVyc2ApIGFyZSByZXByZXNlbnRpbmdcbiAqXG4gKiAgSXQgYWxzbyBtYWludGFpbiBhbiBhcnJheSBvZiByZWZlcmVuY2VzIHRvIGFsbCB0aGUgTGF5ZXJUaW1lQ29udGV4dCBhdHRhY2hlZCB0byB0aGUgdGltZWxpbmUgdG8gcHJvcGFnYXRlIHNvbWUgZ2xvYmFsIGNoYW5nZSBvbiB0aGUgdGltZSB0byBwaXhlbCByZXByZXNlbnRhdGlvblxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lbGluZVRpbWVDb250ZXh0IGV4dGVuZHMgQWJzdHJhY3RUaW1lQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHt9KTtcblxuICAgIHRoaXMuX2NoaWxkcmVuID0gW107XG5cbiAgICB0aGlzLl94U2NhbGUgPSBudWxsO1xuICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlID0gbnVsbDtcblxuICAgIC8vIHBhcmFtc1xuICAgIHRoaXMuX2R1cmF0aW9uID0gMTsgLy8gZm9yIGxheWVycyBpbmhlcml0YW5jZSBvbmx5XG4gICAgdGhpcy5fb2Zmc2V0ID0gMDtcbiAgICB0aGlzLl96b29tID0gMTtcbiAgfVxuXG4gIGdldCBkdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fZHVyYXRpb247XG4gIH1cblxuICBzZXQgZHVyYXRpb24odmFsdWUpIHtcbiAgICB0aGlzLl9kdXJhdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xuICB9XG5cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMuX29mZnNldCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHpvb20oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3pvb207XG4gIH1cblxuICBzZXQgem9vbSh2YWx1ZSkge1xuICAgIGNvbnN0IHhTY2FsZSA9IHRoaXMub3JpZ2luYWxYU2NhbGUuY29weSgpO1xuICAgIGNvbnN0IFttaW4sIG1heF0gPSB4U2NhbGUuZG9tYWluKCk7XG4gICAgY29uc3QgZGlmZiA9IChtYXggLSBtaW4pIC8gdmFsdWU7XG5cbiAgICB4U2NhbGUuZG9tYWluKFttaW4sIG1pbiArIGRpZmZdKTtcblxuICAgIHRoaXMuX3hTY2FsZSA9IHhTY2FsZTtcbiAgICB0aGlzLl96b29tID0gdmFsdWU7XG5cbiAgICAvLyBQcm9wYWdhdGUgY2hhbmdlIHRvIGNoaWxkcmVuIHdobyBoYXZlIHRoZWlyIG93biB4U2NhbGVcbiAgICBjb25zdCByYXRpb0NoYW5nZSA9IHZhbHVlIC8gKHRoaXMuX3pvb20pO1xuXG4gICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgaWYgKCFjaGlsZC5feFNjYWxlKSB7IHJldHVybjsgfVxuICAgICAgY2hpbGQuc3RyZXRjaFJhdGlvID0gY2hpbGQuem9vbSAqIHJhdGlvQ2hhbmdlO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IHhTY2FsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5feFNjYWxlO1xuICB9XG5cbiAgc2V0IHhTY2FsZShzY2FsZSkge1xuICAgIHRoaXMuX3hTY2FsZSA9IHNjYWxlO1xuXG4gICAgaWYgKCF0aGlzLl9vcmlnaW5hbFhTY2FsZSkge1xuICAgICAgdGhpcy5fb3JpZ2luYWxYU2NhbGUgPSB0aGlzLl94U2NhbGUuY29weSgpO1xuICAgIH1cbiAgfVxuXG4gIGdldCB4U2NhbGVSYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy5feFNjYWxlLnJhbmdlKCk7XG4gIH1cblxuICBzZXQgeFNjYWxlUmFuZ2UoYXJyKSB7XG4gICAgdGhpcy5feFNjYWxlLnJhbmdlKGFycik7XG4gICAgdGhpcy5fb3JpZ2luYWxYU2NhbGUucmFuZ2UoYXJyKTtcbiAgICAvLyBwcm9wYWdhdGUgdG8gY2hpbGRyZW5cbiAgICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4geyBjaGlsZC54U2NhbGVSYW5nZSA9IGFycjsgfSk7XG4gIH1cblxuICBnZXQgb3JpZ2luYWxYU2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29yaWdpbmFsWFNjYWxlO1xuICB9XG5cbiAgc2V0IG9yaWdpbmFsWFNjYWxlKHNjYWxlKSB7XG4gICAgdGhpcy5fb3JpZ2luYWxYU2NhbGUgPSBzY2FsZTtcbiAgfVxufVxuIl19