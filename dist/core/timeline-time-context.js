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
 *  The `TimelineTimeContext` has 3 important attributes:
 *  - `timeContext.xScale` which defines the time to pixel transfert function, itself defined by the `pixelsPerSecond` attribute of the timeline
 *  - `timeContext.offset` defines a decay (in time domain) applied to all the views on the timeline. This allow to navigate inside durations longer than what can be represented in Layers (views) containers (e.g. horizontal scroll)
 *  - `timeContext.zoom` defines the zoom factor applyed to the timeline
 *
 *  It also maintains an helper (`duration`) which represent how much time the `tracks` are displaying
 *
 *  It also maintain an array of references to all the LayerTimeContext attached to the timeline to propagate changes on the time to pixel representation
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWVsaW5lLXRpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0lBQU8sbUJBQW1CLDJCQUFNLHlCQUF5Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQnBDLG1CQUFtQjtBQUMzQixXQURRLG1CQUFtQixHQUN4QjswQkFESyxtQkFBbUI7O0FBRXBDLHFDQUZpQixtQkFBbUIsNkNBRTlCLEVBQUUsRUFBRTs7QUFFVixRQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQzs7QUFFcEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEIsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7OztBQUc1QixRQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNuQixRQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztBQUNqQixRQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztHQUNoQjs7WUFia0IsbUJBQW1COztlQUFuQixtQkFBbUI7QUFtQmxDLFlBQVE7V0FKQSxZQUFHO0FBQ2IsZUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDO09BQ3ZCO1dBRVcsVUFBQyxLQUFLLEVBQUU7QUFDbEIsWUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7T0FDeEI7O0FBTUcsVUFBTTtXQUpBLFlBQUc7QUFDWCxlQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7T0FDckI7V0FFUyxVQUFDLEtBQUssRUFBRTtBQUNoQixZQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztPQUN0Qjs7QUFNRyxRQUFJO1dBSkEsWUFBRztBQUNULGVBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztPQUNuQjtXQUVPLFVBQUMsS0FBSyxFQUFFO0FBQ2QsWUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7NkJBQ3ZCLE1BQU0sQ0FBQyxNQUFNLEVBQUU7Ozs7WUFBM0IsR0FBRztZQUFFLEdBQUc7O0FBQ2YsWUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBLEdBQUksS0FBSyxDQUFDOztBQUVqQyxjQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUVqQyxZQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUN0QixZQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7O0FBR25CLFlBQU0sV0FBVyxHQUFHLEtBQUssR0FBSSxJQUFJLENBQUMsS0FBSyxBQUFDLENBQUM7O0FBRXpDLFlBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVMsS0FBSyxFQUFFO0FBQ3JDLGNBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQUUsbUJBQU87V0FBRTtBQUMvQixlQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO1NBQy9DLENBQUMsQ0FBQztPQUNKOztBQU1HLFVBQU07V0FKQSxZQUFHO0FBQ1gsZUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO09BQ3JCO1dBRVMsVUFBQyxLQUFLLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7O0FBRXJCLFlBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQ3pCLGNBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUM1QztPQUNGOztBQU1HLGVBQVc7V0FKQSxZQUFHO0FBQ2hCLGVBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztPQUM3QjtXQUVjLFVBQUMsR0FBRyxFQUFFO0FBQ25CLFlBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLFlBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVoQyxZQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBSztBQUFFLGVBQUssQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO1NBQUUsQ0FBQyxDQUFDO09BQ2pFOztBQU1HLGtCQUFjO1dBSkEsWUFBRztBQUNuQixlQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7T0FDN0I7V0FFaUIsVUFBQyxLQUFLLEVBQUU7QUFDeEIsWUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7T0FDOUI7Ozs7U0FuRmtCLG1CQUFtQjtHQUFTLG1CQUFtQjs7aUJBQS9DLG1CQUFtQiIsImZpbGUiOiJlczYvY29yZS90aW1lbGluZS10aW1lLWNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RUaW1lQ29udGV4dCBmcm9tICcuL2Fic3RyYWN0LXRpbWUtY29udGV4dCc7XG5cbi8qKlxuICogIEBjbGFzcyBWaWV3VGltZUNvbnRleHRcbiAqXG4gKiAgQSBWaWV3VGltZUNvbnRleHQgaW5zdGFuY2UgcmVwcmVzZW50cyB0aGUgbWFwcGluZyBiZXR3ZWVuIHRoZSB0aW1lIGFuZCB0aGUgcGl4ZWwgZG9tYWluc1xuICpcbiAqICBUaGUgYFRpbWVsaW5lVGltZUNvbnRleHRgIGhhcyAzIGltcG9ydGFudCBhdHRyaWJ1dGVzOlxuICogIC0gYHRpbWVDb250ZXh0LnhTY2FsZWAgd2hpY2ggZGVmaW5lcyB0aGUgdGltZSB0byBwaXhlbCB0cmFuc2ZlcnQgZnVuY3Rpb24sIGl0c2VsZiBkZWZpbmVkIGJ5IHRoZSBgcGl4ZWxzUGVyU2Vjb25kYCBhdHRyaWJ1dGUgb2YgdGhlIHRpbWVsaW5lXG4gKiAgLSBgdGltZUNvbnRleHQub2Zmc2V0YCBkZWZpbmVzIGEgZGVjYXkgKGluIHRpbWUgZG9tYWluKSBhcHBsaWVkIHRvIGFsbCB0aGUgdmlld3Mgb24gdGhlIHRpbWVsaW5lLiBUaGlzIGFsbG93IHRvIG5hdmlnYXRlIGluc2lkZSBkdXJhdGlvbnMgbG9uZ2VyIHRoYW4gd2hhdCBjYW4gYmUgcmVwcmVzZW50ZWQgaW4gTGF5ZXJzICh2aWV3cykgY29udGFpbmVycyAoZS5nLiBob3Jpem9udGFsIHNjcm9sbClcbiAqICAtIGB0aW1lQ29udGV4dC56b29tYCBkZWZpbmVzIHRoZSB6b29tIGZhY3RvciBhcHBseWVkIHRvIHRoZSB0aW1lbGluZVxuICpcbiAqICBJdCBhbHNvIG1haW50YWlucyBhbiBoZWxwZXIgKGBkdXJhdGlvbmApIHdoaWNoIHJlcHJlc2VudCBob3cgbXVjaCB0aW1lIHRoZSBgdHJhY2tzYCBhcmUgZGlzcGxheWluZ1xuICpcbiAqICBJdCBhbHNvIG1haW50YWluIGFuIGFycmF5IG9mIHJlZmVyZW5jZXMgdG8gYWxsIHRoZSBMYXllclRpbWVDb250ZXh0IGF0dGFjaGVkIHRvIHRoZSB0aW1lbGluZSB0byBwcm9wYWdhdGUgY2hhbmdlcyBvbiB0aGUgdGltZSB0byBwaXhlbCByZXByZXNlbnRhdGlvblxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lbGluZVRpbWVDb250ZXh0IGV4dGVuZHMgQWJzdHJhY3RUaW1lQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHt9KTtcblxuICAgIHRoaXMuX2NoaWxkcmVuID0gW107XG5cbiAgICB0aGlzLl94U2NhbGUgPSBudWxsO1xuICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlID0gbnVsbDtcblxuICAgIC8vIHBhcmFtc1xuICAgIHRoaXMuX2R1cmF0aW9uID0gMTsgLy8gZm9yIGxheWVycyBpbmhlcml0YW5jZSBvbmx5XG4gICAgdGhpcy5fb2Zmc2V0ID0gMDtcbiAgICB0aGlzLl96b29tID0gMTtcbiAgfVxuXG4gIGdldCBkdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fZHVyYXRpb247XG4gIH1cblxuICBzZXQgZHVyYXRpb24odmFsdWUpIHtcbiAgICB0aGlzLl9kdXJhdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xuICB9XG5cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMuX29mZnNldCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHpvb20oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3pvb207XG4gIH1cblxuICBzZXQgem9vbSh2YWx1ZSkge1xuICAgIGNvbnN0IHhTY2FsZSA9IHRoaXMub3JpZ2luYWxYU2NhbGUuY29weSgpO1xuICAgIGNvbnN0IFttaW4sIG1heF0gPSB4U2NhbGUuZG9tYWluKCk7XG4gICAgY29uc3QgZGlmZiA9IChtYXggLSBtaW4pIC8gdmFsdWU7XG5cbiAgICB4U2NhbGUuZG9tYWluKFttaW4sIG1pbiArIGRpZmZdKTtcblxuICAgIHRoaXMuX3hTY2FsZSA9IHhTY2FsZTtcbiAgICB0aGlzLl96b29tID0gdmFsdWU7XG5cbiAgICAvLyBQcm9wYWdhdGUgY2hhbmdlIHRvIGNoaWxkcmVuIHdobyBoYXZlIHRoZWlyIG93biB4U2NhbGVcbiAgICBjb25zdCByYXRpb0NoYW5nZSA9IHZhbHVlIC8gKHRoaXMuX3pvb20pO1xuXG4gICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgaWYgKCFjaGlsZC5feFNjYWxlKSB7IHJldHVybjsgfVxuICAgICAgY2hpbGQuc3RyZXRjaFJhdGlvID0gY2hpbGQuem9vbSAqIHJhdGlvQ2hhbmdlO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IHhTY2FsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5feFNjYWxlO1xuICB9XG5cbiAgc2V0IHhTY2FsZShzY2FsZSkge1xuICAgIHRoaXMuX3hTY2FsZSA9IHNjYWxlO1xuXG4gICAgaWYgKCF0aGlzLl9vcmlnaW5hbFhTY2FsZSkge1xuICAgICAgdGhpcy5fb3JpZ2luYWxYU2NhbGUgPSB0aGlzLl94U2NhbGUuY29weSgpO1xuICAgIH1cbiAgfVxuXG4gIGdldCB4U2NhbGVSYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy5feFNjYWxlLnJhbmdlKCk7XG4gIH1cblxuICBzZXQgeFNjYWxlUmFuZ2UoYXJyKSB7XG4gICAgdGhpcy5feFNjYWxlLnJhbmdlKGFycik7XG4gICAgdGhpcy5fb3JpZ2luYWxYU2NhbGUucmFuZ2UoYXJyKTtcbiAgICAvLyBwcm9wYWdhdGUgdG8gY2hpbGRyZW5cbiAgICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4geyBjaGlsZC54U2NhbGVSYW5nZSA9IGFycjsgfSk7XG4gIH1cblxuICBnZXQgb3JpZ2luYWxYU2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29yaWdpbmFsWFNjYWxlO1xuICB9XG5cbiAgc2V0IG9yaWdpbmFsWFNjYWxlKHNjYWxlKSB7XG4gICAgdGhpcy5fb3JpZ2luYWxYU2NhbGUgPSBzY2FsZTtcbiAgfVxufVxuIl19