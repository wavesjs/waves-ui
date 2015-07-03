"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _slicedToArray = require("babel-runtime/helpers/sliced-to-array")["default"];

var _core = require("babel-runtime/core-js")["default"];

var AbstractTimeContext = require("./abstract-time-context");

var LayerTimeContext = (function (_AbstractTimeContext) {
  function LayerTimeContext(parent) {
    _classCallCheck(this, LayerTimeContext);

    _get(_core.Object.getPrototypeOf(LayerTimeContext.prototype), "constructor", this).call(this, {});
    if (!parent) {
      throw new Error("LayerTimeContext must have a parent");
    }

    this.parent = parent;

    this._xScale = null;

    this._start = 0;
    this._duration = parent.duration;
    this._offset = 0;
    this._stretchRatio = 1;
    // register into the timeline's TimeContext
    this.parent._children.push(this);
  }

  _inherits(LayerTimeContext, _AbstractTimeContext);

  _createClass(LayerTimeContext, {
    start: {
      get: function () {
        return this._start;
      },
      set: function (value) {
        this._start = value;
      }
    },
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
        // remove local xScale if ratio = 1
        if (value === 1) {
          return this._xScale = null;
        }

        var xScale = this.parent.originalXScale.copy();

        var _xScale$domain = xScale.domain();

        var _xScale$domain2 = _slicedToArray(_xScale$domain, 2);

        var min = _xScale$domain2[0];
        var max = _xScale$domain2[1];

        var diff = (max - min) / (value * this.parent.stretchRatio);

        xScale.domain([min, min + diff]);

        this._xScale = xScale;
        this._stretchRatio = value;
      }
    },
    xScale: {
      get: function () {
        if (!this._xScale) {
          return this.parent.xScale;
        }

        return this._xScale;
      },
      set: function (scale) {
        this._xScale = scale;
      }
    },
    xScaleRange: {
      get: function () {
        return this.xScale.range();
      },
      set: function (arr) {
        if (!this._xScale) {
          return;
        }
        this._xScale.range(arr);
      }
    },
    originalXScale: {

      // read only

      get: function () {
        return this.parent.originalXScale();
      }
    }
  });

  return LayerTimeContext;
})(AbstractTimeContext);

module.exports = LayerTimeContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL2xheWVyLXRpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sbUJBQW1CLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7O0lBRXpELGdCQUFnQjtBQUNULFdBRFAsZ0JBQWdCLENBQ1IsTUFBTSxFQUFFOzBCQURoQixnQkFBZ0I7O0FBRWxCLHFDQUZFLGdCQUFnQiw2Q0FFWixFQUFFLEVBQUU7QUFDVixRQUFJLENBQUMsTUFBTSxFQUFFO0FBQUUsWUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0tBQUU7O0FBRXhFLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUVyQixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQzs7QUFFcEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDaEIsUUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDOztBQUV2QixRQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDbEM7O1lBZkcsZ0JBQWdCOztlQUFoQixnQkFBZ0I7QUFxQmhCLFNBQUs7V0FKQSxZQUFHO0FBQ1YsZUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDO09BQ3BCO1dBRVEsVUFBQyxLQUFLLEVBQUU7QUFDZixZQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztPQUNyQjs7QUFNRyxZQUFRO1dBSkEsWUFBRztBQUNiLGVBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztPQUN2QjtXQUVXLFVBQUMsS0FBSyxFQUFFO0FBQ2xCLFlBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO09BQ3hCOztBQU1HLFVBQU07V0FKQSxZQUFHO0FBQ1gsZUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO09BQ3JCO1dBRVMsVUFBQyxLQUFLLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7T0FDdEI7O0FBTUcsZ0JBQVk7V0FKQSxZQUFHO0FBQ2pCLGVBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztPQUMzQjtXQUVlLFVBQUMsS0FBSyxFQUFFOztBQUV0QixZQUFJLEtBQUssS0FBTSxDQUFDLEVBQUU7QUFDaEIsaUJBQU8sSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDNUI7O0FBRUQsWUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7OzZCQUM5QixNQUFNLENBQUMsTUFBTSxFQUFFOzs7O1lBQTNCLEdBQUc7WUFBRSxHQUFHOztBQUNmLFlBQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQSxJQUFLLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQSxBQUFDLENBQUM7O0FBRTlELGNBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBRWpDLFlBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3RCLFlBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO09BQzVCOztBQVdHLFVBQU07V0FSQSxZQUFHO0FBQ1gsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDakIsaUJBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7U0FDM0I7O0FBRUQsZUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO09BQ3JCO1dBRVMsVUFBQyxLQUFLLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7T0FDdEI7O0FBTUcsZUFBVztXQUpBLFlBQUc7QUFDaEIsZUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO09BQzVCO1dBRWMsVUFBQyxHQUFHLEVBQUU7QUFDbkIsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFBRSxpQkFBTztTQUFFO0FBQzlCLFlBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ3pCOztBQUdHLGtCQUFjOzs7O1dBQUEsWUFBRztBQUNuQixlQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7T0FDckM7Ozs7U0F0RkcsZ0JBQWdCO0dBQVMsbUJBQW1COztBQXlGbEQsTUFBTSxDQUFDLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyIsImZpbGUiOiJlczYvY29yZS9sYXllci10aW1lLWNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBBYnN0cmFjdFRpbWVDb250ZXh0ID0gcmVxdWlyZSgnLi9hYnN0cmFjdC10aW1lLWNvbnRleHQnKTtcblxuY2xhc3MgTGF5ZXJUaW1lQ29udGV4dCBleHRlbmRzIEFic3RyYWN0VGltZUNvbnRleHQge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQpIHtcbiAgICBzdXBlcih7fSk7XG4gICAgaWYgKCFwYXJlbnQpIHsgdGhyb3cgbmV3IEVycm9yKCdMYXllclRpbWVDb250ZXh0IG11c3QgaGF2ZSBhIHBhcmVudCcpOyB9XG5cbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcblxuICAgIHRoaXMuX3hTY2FsZSA9IG51bGw7XG5cbiAgICB0aGlzLl9zdGFydCA9IDA7XG4gICAgdGhpcy5fZHVyYXRpb24gPSBwYXJlbnQuZHVyYXRpb247XG4gICAgdGhpcy5fb2Zmc2V0ID0gMDtcbiAgICB0aGlzLl9zdHJldGNoUmF0aW8gPSAxO1xuICAgIC8vIHJlZ2lzdGVyIGludG8gdGhlIHRpbWVsaW5lJ3MgVGltZUNvbnRleHRcbiAgICB0aGlzLnBhcmVudC5fY2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgfVxuXG4gIGdldCBzdGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhcnQ7XG4gIH1cblxuICBzZXQgc3RhcnQodmFsdWUpIHtcbiAgICB0aGlzLl9zdGFydCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9kdXJhdGlvbjtcbiAgfVxuXG4gIHNldCBkdXJhdGlvbih2YWx1ZSkge1xuICAgIHRoaXMuX2R1cmF0aW9uID0gdmFsdWU7XG4gIH1cblxuICBnZXQgb2Zmc2V0KCkge1xuICAgIHJldHVybiB0aGlzLl9vZmZzZXQ7XG4gIH1cblxuICBzZXQgb2Zmc2V0KHZhbHVlKSB7XG4gICAgdGhpcy5fb2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc3RyZXRjaFJhdGlvKCkge1xuICAgIHJldHVybiB0aGlzLl9zdHJldGNoUmF0aW87XG4gIH1cblxuICBzZXQgc3RyZXRjaFJhdGlvKHZhbHVlKSB7XG4gICAgLy8gcmVtb3ZlIGxvY2FsIHhTY2FsZSBpZiByYXRpbyA9IDFcbiAgICBpZiAodmFsdWUgPT09ICAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5feFNjYWxlID0gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB4U2NhbGUgPSB0aGlzLnBhcmVudC5vcmlnaW5hbFhTY2FsZS5jb3B5KCk7XG4gICAgY29uc3QgW21pbiwgbWF4XSA9IHhTY2FsZS5kb21haW4oKTtcbiAgICBjb25zdCBkaWZmID0gKG1heCAtIG1pbikgLyAodmFsdWUgKiB0aGlzLnBhcmVudC5zdHJldGNoUmF0aW8pO1xuXG4gICAgeFNjYWxlLmRvbWFpbihbbWluLCBtaW4gKyBkaWZmXSk7XG5cbiAgICB0aGlzLl94U2NhbGUgPSB4U2NhbGU7XG4gICAgdGhpcy5fc3RyZXRjaFJhdGlvID0gdmFsdWU7XG4gIH1cblxuXG4gIGdldCB4U2NhbGUoKSB7XG4gICAgaWYgKCF0aGlzLl94U2NhbGUpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC54U2NhbGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3hTY2FsZTtcbiAgfVxuXG4gIHNldCB4U2NhbGUoc2NhbGUpIHtcbiAgICB0aGlzLl94U2NhbGUgPSBzY2FsZTtcbiAgfVxuXG4gIGdldCB4U2NhbGVSYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy54U2NhbGUucmFuZ2UoKTtcbiAgfVxuXG4gIHNldCB4U2NhbGVSYW5nZShhcnIpIHtcbiAgICBpZiAoIXRoaXMuX3hTY2FsZSkgeyByZXR1cm47IH1cbiAgICB0aGlzLl94U2NhbGUucmFuZ2UoYXJyKTtcbiAgfVxuXG4gIC8vIHJlYWQgb25seVxuICBnZXQgb3JpZ2luYWxYU2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50Lm9yaWdpbmFsWFNjYWxlKCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMYXllclRpbWVDb250ZXh0O1xuIl19