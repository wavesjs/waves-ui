"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _slicedToArray = require("babel-runtime/helpers/sliced-to-array")["default"];

var _core = require("babel-runtime/core-js")["default"];

var AbstractTimeContext = require("./abstract-time-context");

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
    this._stretchRatio = 1;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWVsaW5lLXRpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sbUJBQW1CLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7O0lBRXpELG1CQUFtQjtBQUNaLFdBRFAsbUJBQW1CLEdBQ1Q7MEJBRFYsbUJBQW1COztBQUVyQixxQ0FGRSxtQkFBbUIsNkNBRWYsRUFBRSxFQUFFOztBQUVWLFFBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDOztBQUVwQixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUNwQixRQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQzs7O0FBRzVCLFFBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLFFBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO0dBQ3hCOztZQWJHLG1CQUFtQjs7ZUFBbkIsbUJBQW1CO0FBbUJuQixZQUFRO1dBSkEsWUFBRztBQUNiLGVBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztPQUN2QjtXQUVXLFVBQUMsS0FBSyxFQUFFO0FBQ2xCLFlBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO09BQ3hCOztBQU1HLFVBQU07V0FKQSxZQUFHO0FBQ1gsZUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO09BQ3JCO1dBRVMsVUFBQyxLQUFLLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7T0FDdEI7O0FBTUcsZ0JBQVk7V0FKQSxZQUFHO0FBQ2pCLGVBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztPQUMzQjtXQUVlLFVBQUMsS0FBSyxFQUFFO0FBQ3RCLFlBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7OzZCQUN2QixNQUFNLENBQUMsTUFBTSxFQUFFOzs7O1lBQTNCLEdBQUc7WUFBRSxHQUFHOztBQUVmLFlBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQSxHQUFJLEtBQUssQ0FBQzs7QUFFL0IsY0FBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNqQyxZQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUN0QixZQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQzs7O0FBRzNCLFlBQU0sV0FBVyxHQUFHLEtBQUssR0FBSSxJQUFJLENBQUMsYUFBYSxBQUFDLENBQUM7O0FBRWpELFlBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVMsS0FBSyxFQUFFO0FBQ3JDLGNBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQUUsbUJBQU87V0FBRTtBQUMvQixlQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1NBQ3ZELENBQUMsQ0FBQztPQUNKOztBQU1HLFVBQU07V0FKQSxZQUFHO0FBQ1gsZUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO09BQ3JCO1dBRVMsVUFBQyxLQUFLLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7O0FBRXJCLFlBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQ3pCLGNBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUM1QztPQUNGOztBQU1HLGVBQVc7V0FKQSxZQUFHO0FBQ2hCLGVBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztPQUM3QjtXQUVjLFVBQUMsR0FBRyxFQUFFO0FBQ25CLFlBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLFlBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVoQyxZQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBSztBQUFFLGVBQUssQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFBO1NBQUUsQ0FBQyxDQUFDO09BQ2hFOztBQU1HLGtCQUFjO1dBSkEsWUFBRztBQUNuQixlQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7T0FDN0I7V0FFaUIsVUFBQyxLQUFLLEVBQUU7QUFDeEIsWUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7T0FDOUI7Ozs7U0FuRkcsbUJBQW1CO0dBQVMsbUJBQW1COztBQXNGckQsTUFBTSxDQUFDLE9BQU8sR0FBRyxtQkFBbUIsQ0FBQyIsImZpbGUiOiJlczYvY29yZS90aW1lbGluZS10aW1lLWNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBBYnN0cmFjdFRpbWVDb250ZXh0ID0gcmVxdWlyZSgnLi9hYnN0cmFjdC10aW1lLWNvbnRleHQnKTtcblxuY2xhc3MgVGltZWxpbmVUaW1lQ29udGV4dCBleHRlbmRzIEFic3RyYWN0VGltZUNvbnRleHQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7fSk7XG5cbiAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xuXG4gICAgdGhpcy5feFNjYWxlID0gbnVsbDtcbiAgICB0aGlzLl9vcmlnaW5hbFhTY2FsZSA9IG51bGw7XG5cbiAgICAvLyBwYXJhbXNcbiAgICB0aGlzLl9kdXJhdGlvbiA9IDE7IC8vIGZvciBsYXllcnMgaW5oZXJpdGFuY2Ugb25seVxuICAgIHRoaXMuX29mZnNldCA9IDA7XG4gICAgdGhpcy5fc3RyZXRjaFJhdGlvID0gMTtcbiAgfVxuXG4gIGdldCBkdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fZHVyYXRpb247XG4gIH1cblxuICBzZXQgZHVyYXRpb24odmFsdWUpIHtcbiAgICB0aGlzLl9kdXJhdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xuICB9XG5cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMuX29mZnNldCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHN0cmV0Y2hSYXRpbygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RyZXRjaFJhdGlvO1xuICB9XG5cbiAgc2V0IHN0cmV0Y2hSYXRpbyh2YWx1ZSkge1xuICAgIGNvbnN0IHhTY2FsZSA9IHRoaXMub3JpZ2luYWxYU2NhbGUuY29weSgpO1xuICAgIGNvbnN0IFttaW4sIG1heF0gPSB4U2NhbGUuZG9tYWluKCk7XG5cbiAgICBsZXQgZGlmZiA9IChtYXggLSBtaW4pIC8gdmFsdWU7XG5cbiAgICB4U2NhbGUuZG9tYWluKFttaW4sIG1pbiArIGRpZmZdKTtcbiAgICB0aGlzLl94U2NhbGUgPSB4U2NhbGU7XG4gICAgdGhpcy5fc3RyZXRjaFJhdGlvID0gdmFsdWU7XG5cbiAgICAvLyBQcm9wYWdhdGUgY2hhbmdlIHRvIGNoaWxkcmVuIHdobyBoYXZlIHRoZWlyIG93biB4U2NhbGVcbiAgICBjb25zdCByYXRpb0NoYW5nZSA9IHZhbHVlIC8gKHRoaXMuX3N0cmV0Y2hSYXRpbyk7XG5cbiAgICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICBpZiAoIWNoaWxkLl94U2NhbGUpIHsgcmV0dXJuOyB9XG4gICAgICBjaGlsZC5zdHJldGNoUmF0aW8gPSBjaGlsZC5zdHJldGNoUmF0aW8gKiByYXRpb0NoYW5nZTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCB4U2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3hTY2FsZTtcbiAgfVxuXG4gIHNldCB4U2NhbGUoc2NhbGUpIHtcbiAgICB0aGlzLl94U2NhbGUgPSBzY2FsZTtcblxuICAgIGlmICghdGhpcy5fb3JpZ2luYWxYU2NhbGUpIHtcbiAgICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlID0gdGhpcy5feFNjYWxlLmNvcHkoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgeFNjYWxlUmFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3hTY2FsZS5yYW5nZSgpO1xuICB9XG5cbiAgc2V0IHhTY2FsZVJhbmdlKGFycikge1xuICAgIHRoaXMuX3hTY2FsZS5yYW5nZShhcnIpO1xuICAgIHRoaXMuX29yaWdpbmFsWFNjYWxlLnJhbmdlKGFycik7XG4gICAgLy8gcHJvcGFnYXRlIHRvIGNoaWxkcmVuXG4gICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHsgY2hpbGQueFNjYWxlUmFuZ2UgPSBhcnIgfSk7XG4gIH1cblxuICBnZXQgb3JpZ2luYWxYU2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29yaWdpbmFsWFNjYWxlO1xuICB9XG5cbiAgc2V0IG9yaWdpbmFsWFNjYWxlKHNjYWxlKSB7XG4gICAgdGhpcy5fb3JpZ2luYWxYU2NhbGUgPSBzY2FsZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVsaW5lVGltZUNvbnRleHQ7XG4iXX0=