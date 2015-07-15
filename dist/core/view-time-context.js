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
 *  - `timeContext.stretchRatio` defines the zoom factor applyed to the timeline
 *
 *  It owns an helper `timeContext.duration` which maintain a view on how much time the views applyed to the timeline (the `containers`) are representing
 *
 *  It also maintain an array of references to all the LayerTimeContext attached to the timeline to propagate some global change on the time to pixel representation
 */

var ViewTimeContext = (function (_AbstractTimeContext) {
  function ViewTimeContext() {
    _classCallCheck(this, ViewTimeContext);

    _get(_core.Object.getPrototypeOf(ViewTimeContext.prototype), "constructor", this).call(this, {});

    this._children = [];

    this._xScale = null;
    this._originalXScale = null;

    // params
    this._duration = 1; // for layers inheritance only
    this._offset = 0;
    this._stretchRatio = 1;
  }

  _inherits(ViewTimeContext, _AbstractTimeContext);

  _createClass(ViewTimeContext, {
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

  return ViewTimeContext;
})(AbstractTimeContext);

module.exports = ViewTimeContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3ZpZXctdGltZS1jb250ZXh0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBTyxtQkFBbUIsMkJBQU0seUJBQXlCOzs7Ozs7Ozs7Ozs7Ozs7OztJQWdCcEMsZUFBZTtBQUN2QixXQURRLGVBQWUsR0FDcEI7MEJBREssZUFBZTs7QUFFaEMscUNBRmlCLGVBQWUsNkNBRTFCLEVBQUUsRUFBRTs7QUFFVixRQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQzs7QUFFcEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEIsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7OztBQUc1QixRQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNuQixRQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztBQUNqQixRQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztHQUN4Qjs7WUFia0IsZUFBZTs7ZUFBZixlQUFlO0FBbUI5QixZQUFRO1dBSkEsWUFBRztBQUNiLGVBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztPQUN2QjtXQUVXLFVBQUMsS0FBSyxFQUFFO0FBQ2xCLFlBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO09BQ3hCOztBQU1HLFVBQU07V0FKQSxZQUFHO0FBQ1gsZUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO09BQ3JCO1dBRVMsVUFBQyxLQUFLLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7T0FDdEI7O0FBTUcsZ0JBQVk7V0FKQSxZQUFHO0FBQ2pCLGVBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztPQUMzQjtXQUVlLFVBQUMsS0FBSyxFQUFFO0FBQ3RCLFlBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7OzZCQUN2QixNQUFNLENBQUMsTUFBTSxFQUFFOzs7O1lBQTNCLEdBQUc7WUFBRSxHQUFHOztBQUNmLFlBQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQSxHQUFJLEtBQUssQ0FBQzs7QUFFakMsY0FBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFakMsWUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDdEIsWUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7OztBQUczQixZQUFNLFdBQVcsR0FBRyxLQUFLLEdBQUksSUFBSSxDQUFDLGFBQWEsQUFBQyxDQUFDOztBQUVqRCxZQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFTLEtBQUssRUFBRTtBQUNyQyxjQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRTtBQUFFLG1CQUFPO1dBQUU7QUFDL0IsZUFBSyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztTQUN2RCxDQUFDLENBQUM7T0FDSjs7QUFNRyxVQUFNO1dBSkEsWUFBRztBQUNYLGVBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztPQUNyQjtXQUVTLFVBQUMsS0FBSyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDOztBQUVyQixZQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtBQUN6QixjQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDNUM7T0FDRjs7QUFNRyxlQUFXO1dBSkEsWUFBRztBQUNoQixlQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDN0I7V0FFYyxVQUFDLEdBQUcsRUFBRTtBQUNuQixZQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QixZQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFaEMsWUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFBRSxlQUFLLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztTQUFFLENBQUMsQ0FBQztPQUNqRTs7QUFNRyxrQkFBYztXQUpBLFlBQUc7QUFDbkIsZUFBTyxJQUFJLENBQUMsZUFBZSxDQUFDO09BQzdCO1dBRWlCLFVBQUMsS0FBSyxFQUFFO0FBQ3hCLFlBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO09BQzlCOzs7O1NBbkZrQixlQUFlO0dBQVMsbUJBQW1COztpQkFBM0MsZUFBZSIsImZpbGUiOiJlczYvY29yZS92aWV3LXRpbWUtY29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBYnN0cmFjdFRpbWVDb250ZXh0IGZyb20gJy4vYWJzdHJhY3QtdGltZS1jb250ZXh0JztcblxuLyoqXG4gKiAgQGNsYXNzIFZpZXdUaW1lQ29udGV4dFxuICpcbiAqICBBIFZpZXdUaW1lQ29udGV4dCBpbnN0YW5jZSByZXByZXNlbnRzIHRoZSBtYXBwaW5nIGJldHdlZW4gdGhlIHRpbWUgYW5kIHRoZSBwaXhlbCBkb21haW5zXG4gKlxuICogIFRoZSBgdGltZWxpbmVUaW1lQ29udGV4dGAgaGFzIDMgaW1wb3J0YW50IGF0dHJpYnV0ZXM6XG4gKiAgLSBgdGltZUNvbnRleHQueFNjYWxlYCB3aGljaCBkZWZpbmVzIHRoZSB0aW1lIHRvIHBpeGVsIHRyYW5zZmVydCBmdW5jdGlvbiwgaXRzZWxmIGRlZmluZWQgYnkgdGhlIGBwaXhlbHNQZXJTZWNvbmRgIGF0dHJpYnV0ZSBvZiB0aGUgdGltZWxpbmVcbiAqICAtIGB0aW1lQ29udGV4dC5vZmZzZXRgIGRlZmluZXMgYSBkZWNheSAoaW4gdGltZSBkb21haW4pIGFwcGxpZWQgdG8gYWxsIHRoZSB2aWV3cyBvbiB0aGUgdGltZWxpbmUuIFRoaXMgYWxsb3cgdG8gbmF2aWdhdGUgaW5zaWRlIGR1cmF0aW9ucyBsb25nZXIgdGhhbiB3aGF0IGNhbiBiZSByZXByZXNlbnRlZCBpbiBMYXllcnMgKHZpZXdzKSBjb250YWluZXJzIChlLmcuIGhvcml6b250YWwgc2Nyb2xsKVxuICogIC0gYHRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpb2AgZGVmaW5lcyB0aGUgem9vbSBmYWN0b3IgYXBwbHllZCB0byB0aGUgdGltZWxpbmVcbiAqXG4gKiAgSXQgb3ducyBhbiBoZWxwZXIgYHRpbWVDb250ZXh0LmR1cmF0aW9uYCB3aGljaCBtYWludGFpbiBhIHZpZXcgb24gaG93IG11Y2ggdGltZSB0aGUgdmlld3MgYXBwbHllZCB0byB0aGUgdGltZWxpbmUgKHRoZSBgY29udGFpbmVyc2ApIGFyZSByZXByZXNlbnRpbmdcbiAqXG4gKiAgSXQgYWxzbyBtYWludGFpbiBhbiBhcnJheSBvZiByZWZlcmVuY2VzIHRvIGFsbCB0aGUgTGF5ZXJUaW1lQ29udGV4dCBhdHRhY2hlZCB0byB0aGUgdGltZWxpbmUgdG8gcHJvcGFnYXRlIHNvbWUgZ2xvYmFsIGNoYW5nZSBvbiB0aGUgdGltZSB0byBwaXhlbCByZXByZXNlbnRhdGlvblxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3VGltZUNvbnRleHQgZXh0ZW5kcyBBYnN0cmFjdFRpbWVDb250ZXh0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe30pO1xuXG4gICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcblxuICAgIHRoaXMuX3hTY2FsZSA9IG51bGw7XG4gICAgdGhpcy5fb3JpZ2luYWxYU2NhbGUgPSBudWxsO1xuXG4gICAgLy8gcGFyYW1zXG4gICAgdGhpcy5fZHVyYXRpb24gPSAxOyAvLyBmb3IgbGF5ZXJzIGluaGVyaXRhbmNlIG9ubHlcbiAgICB0aGlzLl9vZmZzZXQgPSAwO1xuICAgIHRoaXMuX3N0cmV0Y2hSYXRpbyA9IDE7XG4gIH1cblxuICBnZXQgZHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2R1cmF0aW9uO1xuICB9XG5cbiAgc2V0IGR1cmF0aW9uKHZhbHVlKSB7XG4gICAgdGhpcy5fZHVyYXRpb24gPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29mZnNldDtcbiAgfVxuXG4gIHNldCBvZmZzZXQodmFsdWUpIHtcbiAgICB0aGlzLl9vZmZzZXQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBzdHJldGNoUmF0aW8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0cmV0Y2hSYXRpbztcbiAgfVxuXG4gIHNldCBzdHJldGNoUmF0aW8odmFsdWUpIHtcbiAgICBjb25zdCB4U2NhbGUgPSB0aGlzLm9yaWdpbmFsWFNjYWxlLmNvcHkoKTtcbiAgICBjb25zdCBbbWluLCBtYXhdID0geFNjYWxlLmRvbWFpbigpO1xuICAgIGNvbnN0IGRpZmYgPSAobWF4IC0gbWluKSAvIHZhbHVlO1xuXG4gICAgeFNjYWxlLmRvbWFpbihbbWluLCBtaW4gKyBkaWZmXSk7XG5cbiAgICB0aGlzLl94U2NhbGUgPSB4U2NhbGU7XG4gICAgdGhpcy5fc3RyZXRjaFJhdGlvID0gdmFsdWU7XG5cbiAgICAvLyBQcm9wYWdhdGUgY2hhbmdlIHRvIGNoaWxkcmVuIHdobyBoYXZlIHRoZWlyIG93biB4U2NhbGVcbiAgICBjb25zdCByYXRpb0NoYW5nZSA9IHZhbHVlIC8gKHRoaXMuX3N0cmV0Y2hSYXRpbyk7XG5cbiAgICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICBpZiAoIWNoaWxkLl94U2NhbGUpIHsgcmV0dXJuOyB9XG4gICAgICBjaGlsZC5zdHJldGNoUmF0aW8gPSBjaGlsZC5zdHJldGNoUmF0aW8gKiByYXRpb0NoYW5nZTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCB4U2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3hTY2FsZTtcbiAgfVxuXG4gIHNldCB4U2NhbGUoc2NhbGUpIHtcbiAgICB0aGlzLl94U2NhbGUgPSBzY2FsZTtcblxuICAgIGlmICghdGhpcy5fb3JpZ2luYWxYU2NhbGUpIHtcbiAgICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlID0gdGhpcy5feFNjYWxlLmNvcHkoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgeFNjYWxlUmFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3hTY2FsZS5yYW5nZSgpO1xuICB9XG5cbiAgc2V0IHhTY2FsZVJhbmdlKGFycikge1xuICAgIHRoaXMuX3hTY2FsZS5yYW5nZShhcnIpO1xuICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlLnJhbmdlKGFycik7XG4gICAgLy8gcHJvcGFnYXRlIHRvIGNoaWxkcmVuXG4gICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHsgY2hpbGQueFNjYWxlUmFuZ2UgPSBhcnI7IH0pO1xuICB9XG5cbiAgZ2V0IG9yaWdpbmFsWFNjYWxlKCkge1xuICAgIHJldHVybiB0aGlzLl9vcmlnaW5hbFhTY2FsZTtcbiAgfVxuXG4gIHNldCBvcmlnaW5hbFhTY2FsZShzY2FsZSkge1xuICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlID0gc2NhbGU7XG4gIH1cbn1cbiJdfQ==