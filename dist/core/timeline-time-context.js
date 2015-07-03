"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _slicedToArray = require("babel-runtime/helpers/sliced-to-array")["default"];

var _core = require("babel-runtime/core-js")["default"];

var AbstractTimeContext = require("./abstract-time-context");

/**
 *  @class TimelineTimeContext
 *
 *  A TimelineTimeContext instance represents the mapping between the time and the pixel domains
 *
 *  The `timelineTimeContext` has 3 important attributes:
 *  - `timeContext.xScale` which defines the time to pixel transfert function, itself defined by the `pixelsPerSecond` attribute of the timeline
 *  - `timeContext.offset` defines a decay (in time domain) applied to all the views on the timeline. This allow to navigate inside durations longer than what can be represented in Layers (views) containers (e.g. horizontal scroll)
 *  - `timeContext.stretchRatio` defines the zoom factor applyed to the timeline
 *
 *  It owns an helper `timeContext.containersDuration` which maintain a view on how much time the views applyed to the timeline (the `containers`) are representing
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
    this._containersDuration = 1; // for layers inheritance only
    this._offset = 0;
    this._stretchRatio = 1;
  }

  _inherits(TimelineTimeContext, _AbstractTimeContext);

  _createClass(TimelineTimeContext, {
    containersDuration: {
      get: function () {
        return this._containersDuration;
      },
      set: function (value) {
        this._containersDuration = value;
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
    stretchRatio: {
      get: function () {
        return this._stretchRatio;
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
        this._stretchRatio = value;

        // Propagate change to children who have their own xScale
        var ratioChange = value / this._stretchRatio;

        this._children.forEach(function (child) {
          if (!child._xScale) {
            return;
          }
          child.stretchRatio = child.stretchRatio * ratioChange;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWVsaW5lLXRpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sbUJBQW1CLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBZ0J6RCxtQkFBbUI7QUFDWixXQURQLG1CQUFtQixHQUNUOzBCQURWLG1CQUFtQjs7QUFFckIscUNBRkUsbUJBQW1CLDZDQUVmLEVBQUUsRUFBRTs7QUFFVixRQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQzs7QUFFcEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEIsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7OztBQUc1QixRQUFJLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLFFBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO0dBQ3hCOztZQWJHLG1CQUFtQjs7ZUFBbkIsbUJBQW1CO0FBbUJuQixzQkFBa0I7V0FKQSxZQUFHO0FBQ3ZCLGVBQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDO09BQ2pDO1dBRXFCLFVBQUMsS0FBSyxFQUFFO0FBQzVCLFlBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7T0FDbEM7O0FBTUcsVUFBTTtXQUpBLFlBQUc7QUFDWCxlQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7T0FDckI7V0FFUyxVQUFDLEtBQUssRUFBRTtBQUNoQixZQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztPQUN0Qjs7QUFNRyxnQkFBWTtXQUpBLFlBQUc7QUFDakIsZUFBTyxJQUFJLENBQUMsYUFBYSxDQUFDO09BQzNCO1dBRWUsVUFBQyxLQUFLLEVBQUU7QUFDdEIsWUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7NkJBQ3ZCLE1BQU0sQ0FBQyxNQUFNLEVBQUU7Ozs7WUFBM0IsR0FBRztZQUFFLEdBQUc7O0FBQ2YsWUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBLEdBQUksS0FBSyxDQUFDOztBQUVqQyxjQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUVqQyxZQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUN0QixZQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQzs7O0FBRzNCLFlBQU0sV0FBVyxHQUFHLEtBQUssR0FBSSxJQUFJLENBQUMsYUFBYSxBQUFDLENBQUM7O0FBRWpELFlBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVMsS0FBSyxFQUFFO0FBQ3JDLGNBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQUUsbUJBQU87V0FBRTtBQUMvQixlQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1NBQ3ZELENBQUMsQ0FBQztPQUNKOztBQU1HLFVBQU07V0FKQSxZQUFHO0FBQ1gsZUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO09BQ3JCO1dBRVMsVUFBQyxLQUFLLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7O0FBRXJCLFlBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQ3pCLGNBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUM1QztPQUNGOztBQU1HLGVBQVc7V0FKQSxZQUFHO0FBQ2hCLGVBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztPQUM3QjtXQUVjLFVBQUMsR0FBRyxFQUFFO0FBQ25CLFlBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLFlBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVoQyxZQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBSztBQUFFLGVBQUssQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO1NBQUUsQ0FBQyxDQUFDO09BQ2pFOztBQU1HLGtCQUFjO1dBSkEsWUFBRztBQUNuQixlQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7T0FDN0I7V0FFaUIsVUFBQyxLQUFLLEVBQUU7QUFDeEIsWUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7T0FDOUI7Ozs7U0FuRkcsbUJBQW1CO0dBQVMsbUJBQW1COztBQXNGckQsTUFBTSxDQUFDLE9BQU8sR0FBRyxtQkFBbUIsQ0FBQyIsImZpbGUiOiJlczYvY29yZS90aW1lbGluZS10aW1lLWNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBBYnN0cmFjdFRpbWVDb250ZXh0ID0gcmVxdWlyZSgnLi9hYnN0cmFjdC10aW1lLWNvbnRleHQnKTtcblxuLyoqXG4gKiAgQGNsYXNzIFRpbWVsaW5lVGltZUNvbnRleHRcbiAqXG4gKiAgQSBUaW1lbGluZVRpbWVDb250ZXh0IGluc3RhbmNlIHJlcHJlc2VudHMgdGhlIG1hcHBpbmcgYmV0d2VlbiB0aGUgdGltZSBhbmQgdGhlIHBpeGVsIGRvbWFpbnNcbiAqXG4gKiAgVGhlIGB0aW1lbGluZVRpbWVDb250ZXh0YCBoYXMgMyBpbXBvcnRhbnQgYXR0cmlidXRlczpcbiAqICAtIGB0aW1lQ29udGV4dC54U2NhbGVgIHdoaWNoIGRlZmluZXMgdGhlIHRpbWUgdG8gcGl4ZWwgdHJhbnNmZXJ0IGZ1bmN0aW9uLCBpdHNlbGYgZGVmaW5lZCBieSB0aGUgYHBpeGVsc1BlclNlY29uZGAgYXR0cmlidXRlIG9mIHRoZSB0aW1lbGluZVxuICogIC0gYHRpbWVDb250ZXh0Lm9mZnNldGAgZGVmaW5lcyBhIGRlY2F5IChpbiB0aW1lIGRvbWFpbikgYXBwbGllZCB0byBhbGwgdGhlIHZpZXdzIG9uIHRoZSB0aW1lbGluZS4gVGhpcyBhbGxvdyB0byBuYXZpZ2F0ZSBpbnNpZGUgZHVyYXRpb25zIGxvbmdlciB0aGFuIHdoYXQgY2FuIGJlIHJlcHJlc2VudGVkIGluIExheWVycyAodmlld3MpIGNvbnRhaW5lcnMgKGUuZy4gaG9yaXpvbnRhbCBzY3JvbGwpXG4gKiAgLSBgdGltZUNvbnRleHQuc3RyZXRjaFJhdGlvYCBkZWZpbmVzIHRoZSB6b29tIGZhY3RvciBhcHBseWVkIHRvIHRoZSB0aW1lbGluZVxuICpcbiAqICBJdCBvd25zIGFuIGhlbHBlciBgdGltZUNvbnRleHQuY29udGFpbmVyc0R1cmF0aW9uYCB3aGljaCBtYWludGFpbiBhIHZpZXcgb24gaG93IG11Y2ggdGltZSB0aGUgdmlld3MgYXBwbHllZCB0byB0aGUgdGltZWxpbmUgKHRoZSBgY29udGFpbmVyc2ApIGFyZSByZXByZXNlbnRpbmdcbiAqXG4gKiAgSXQgYWxzbyBtYWludGFpbiBhbiBhcnJheSBvZiByZWZlcmVuY2VzIHRvIGFsbCB0aGUgTGF5ZXJUaW1lQ29udGV4dCBhdHRhY2hlZCB0byB0aGUgdGltZWxpbmUgdG8gcHJvcGFnYXRlIHNvbWUgZ2xvYmFsIGNoYW5nZSBvbiB0aGUgdGltZSB0byBwaXhlbCByZXByZXNlbnRhdGlvblxuICovXG5jbGFzcyBUaW1lbGluZVRpbWVDb250ZXh0IGV4dGVuZHMgQWJzdHJhY3RUaW1lQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHt9KTtcblxuICAgIHRoaXMuX2NoaWxkcmVuID0gW107XG5cbiAgICB0aGlzLl94U2NhbGUgPSBudWxsO1xuICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlID0gbnVsbDtcblxuICAgIC8vIHBhcmFtc1xuICAgIHRoaXMuX2NvbnRhaW5lcnNEdXJhdGlvbiA9IDE7IC8vIGZvciBsYXllcnMgaW5oZXJpdGFuY2Ugb25seVxuICAgIHRoaXMuX29mZnNldCA9IDA7XG4gICAgdGhpcy5fc3RyZXRjaFJhdGlvID0gMTtcbiAgfVxuXG4gIGdldCBjb250YWluZXJzRHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lcnNEdXJhdGlvbjtcbiAgfVxuXG4gIHNldCBjb250YWluZXJzRHVyYXRpb24odmFsdWUpIHtcbiAgICB0aGlzLl9jb250YWluZXJzRHVyYXRpb24gPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29mZnNldDtcbiAgfVxuXG4gIHNldCBvZmZzZXQodmFsdWUpIHtcbiAgICB0aGlzLl9vZmZzZXQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBzdHJldGNoUmF0aW8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0cmV0Y2hSYXRpbztcbiAgfVxuXG4gIHNldCBzdHJldGNoUmF0aW8odmFsdWUpIHtcbiAgICBjb25zdCB4U2NhbGUgPSB0aGlzLm9yaWdpbmFsWFNjYWxlLmNvcHkoKTtcbiAgICBjb25zdCBbbWluLCBtYXhdID0geFNjYWxlLmRvbWFpbigpO1xuICAgIGNvbnN0IGRpZmYgPSAobWF4IC0gbWluKSAvIHZhbHVlO1xuXG4gICAgeFNjYWxlLmRvbWFpbihbbWluLCBtaW4gKyBkaWZmXSk7XG5cbiAgICB0aGlzLl94U2NhbGUgPSB4U2NhbGU7XG4gICAgdGhpcy5fc3RyZXRjaFJhdGlvID0gdmFsdWU7XG5cbiAgICAvLyBQcm9wYWdhdGUgY2hhbmdlIHRvIGNoaWxkcmVuIHdobyBoYXZlIHRoZWlyIG93biB4U2NhbGVcbiAgICBjb25zdCByYXRpb0NoYW5nZSA9IHZhbHVlIC8gKHRoaXMuX3N0cmV0Y2hSYXRpbyk7XG5cbiAgICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICBpZiAoIWNoaWxkLl94U2NhbGUpIHsgcmV0dXJuOyB9XG4gICAgICBjaGlsZC5zdHJldGNoUmF0aW8gPSBjaGlsZC5zdHJldGNoUmF0aW8gKiByYXRpb0NoYW5nZTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCB4U2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3hTY2FsZTtcbiAgfVxuXG4gIHNldCB4U2NhbGUoc2NhbGUpIHtcbiAgICB0aGlzLl94U2NhbGUgPSBzY2FsZTtcblxuICAgIGlmICghdGhpcy5fb3JpZ2luYWxYU2NhbGUpIHtcbiAgICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlID0gdGhpcy5feFNjYWxlLmNvcHkoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgeFNjYWxlUmFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3hTY2FsZS5yYW5nZSgpO1xuICB9XG5cbiAgc2V0IHhTY2FsZVJhbmdlKGFycikge1xuICAgIHRoaXMuX3hTY2FsZS5yYW5nZShhcnIpO1xuICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlLnJhbmdlKGFycik7XG4gICAgLy8gcHJvcGFnYXRlIHRvIGNoaWxkcmVuXG4gICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHsgY2hpbGQueFNjYWxlUmFuZ2UgPSBhcnI7IH0pO1xuICB9XG5cbiAgZ2V0IG9yaWdpbmFsWFNjYWxlKCkge1xuICAgIHJldHVybiB0aGlzLl9vcmlnaW5hbFhTY2FsZTtcbiAgfVxuXG4gIHNldCBvcmlnaW5hbFhTY2FsZShzY2FsZSkge1xuICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlID0gc2NhbGU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lbGluZVRpbWVDb250ZXh0O1xuIl19