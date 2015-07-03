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
    this._duration = parent.containersDuration;
    this._offset = 0;
    this._stretchRatio = 1;
    // register into the timeline's TimeContext
    this.parent._children.push(this);
  }

  _inherits(LayerTimeContext, _AbstractTimeContext);

  _createClass(LayerTimeContext, {
    clone: {
      value: function clone() {
        var ctx = new this();
        ctx.start = this.start;
        ctx.duration = this.duration;
        ctx.offset = this.offset;
        ctx.stretchRatio = this.stretchRatio;

        return ctx;
      }
    },
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
          this._xScale = null;
          return;
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
      }
    },
    xScaleRange: {

      // set xScale(scale) {
      //   this._xScale = scale;
      // }

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL2xheWVyLXRpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sbUJBQW1CLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7O0lBRXpELGdCQUFnQjtBQUNULFdBRFAsZ0JBQWdCLENBQ1IsTUFBTSxFQUFFOzBCQURoQixnQkFBZ0I7O0FBRWxCLHFDQUZFLGdCQUFnQiw2Q0FFWixFQUFFLEVBQUU7QUFDVixRQUFJLENBQUMsTUFBTSxFQUFFO0FBQUUsWUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0tBQUU7O0FBRXhFLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUVyQixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQzs7QUFFcEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDaEIsUUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUM7QUFDM0MsUUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDakIsUUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7O0FBRXZCLFFBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUNsQzs7WUFmRyxnQkFBZ0I7O2VBQWhCLGdCQUFnQjtBQWlCcEIsU0FBSzthQUFBLGlCQUFHO0FBQ04sWUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUN2QixXQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDdkIsV0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQzdCLFdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUN6QixXQUFHLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7O0FBRXJDLGVBQU8sR0FBRyxDQUFDO09BQ1o7O0FBTUcsU0FBSztXQUpBLFlBQUc7QUFDVixlQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7T0FDcEI7V0FFUSxVQUFDLEtBQUssRUFBRTtBQUNmLFlBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO09BQ3JCOztBQU1HLFlBQVE7V0FKQSxZQUFHO0FBQ2IsZUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDO09BQ3ZCO1dBRVcsVUFBQyxLQUFLLEVBQUU7QUFDbEIsWUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7T0FDeEI7O0FBTUcsVUFBTTtXQUpBLFlBQUc7QUFDWCxlQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7T0FDckI7V0FFUyxVQUFDLEtBQUssRUFBRTtBQUNoQixZQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztPQUN0Qjs7QUFNRyxnQkFBWTtXQUpBLFlBQUc7QUFDakIsZUFBTyxJQUFJLENBQUMsYUFBYSxDQUFDO09BQzNCO1dBRWUsVUFBQyxLQUFLLEVBQUU7O0FBRXRCLFlBQUksS0FBSyxLQUFNLENBQUMsRUFBRTtBQUNoQixjQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUNwQixpQkFBTztTQUNSOztBQUVELFlBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDOzs2QkFDOUIsTUFBTSxDQUFDLE1BQU0sRUFBRTs7OztZQUEzQixHQUFHO1lBQUUsR0FBRzs7QUFDZixZQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUEsSUFBSyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUEsQUFBQyxDQUFDOztBQUU5RCxjQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUVqQyxZQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUN0QixZQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztPQUM1Qjs7QUFHRyxVQUFNO1dBQUEsWUFBRztBQUNYLFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2pCLGlCQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1NBQzNCOztBQUVELGVBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztPQUNyQjs7QUFVRyxlQUFXOzs7Ozs7V0FKQSxZQUFHO0FBQ2hCLGVBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztPQUM1QjtXQUVjLFVBQUMsR0FBRyxFQUFFO0FBQ25CLFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQUUsaUJBQU87U0FBRTtBQUM5QixZQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUN6Qjs7QUFHRyxrQkFBYzs7OztXQUFBLFlBQUc7QUFDbkIsZUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO09BQ3JDOzs7O1NBakdHLGdCQUFnQjtHQUFTLG1CQUFtQjs7QUFvR2xELE1BQU0sQ0FBQyxPQUFPLEdBQUcsZ0JBQWdCLENBQUMiLCJmaWxlIjoiZXM2L2NvcmUvbGF5ZXItdGltZS1jb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQWJzdHJhY3RUaW1lQ29udGV4dCA9IHJlcXVpcmUoJy4vYWJzdHJhY3QtdGltZS1jb250ZXh0Jyk7XG5cbmNsYXNzIExheWVyVGltZUNvbnRleHQgZXh0ZW5kcyBBYnN0cmFjdFRpbWVDb250ZXh0IHtcbiAgY29uc3RydWN0b3IocGFyZW50KSB7XG4gICAgc3VwZXIoe30pO1xuICAgIGlmICghcGFyZW50KSB7IHRocm93IG5ldyBFcnJvcignTGF5ZXJUaW1lQ29udGV4dCBtdXN0IGhhdmUgYSBwYXJlbnQnKTsgfVxuXG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG5cbiAgICB0aGlzLl94U2NhbGUgPSBudWxsO1xuXG4gICAgdGhpcy5fc3RhcnQgPSAwO1xuICAgIHRoaXMuX2R1cmF0aW9uID0gcGFyZW50LmNvbnRhaW5lcnNEdXJhdGlvbjtcbiAgICB0aGlzLl9vZmZzZXQgPSAwO1xuICAgIHRoaXMuX3N0cmV0Y2hSYXRpbyA9IDE7XG4gICAgLy8gcmVnaXN0ZXIgaW50byB0aGUgdGltZWxpbmUncyBUaW1lQ29udGV4dFxuICAgIHRoaXMucGFyZW50Ll9jaGlsZHJlbi5wdXNoKHRoaXMpO1xuICB9XG5cbiAgY2xvbmUoKSB7XG4gICAgY29uc3QgY3R4ID0gbmV3IHRoaXMoKTtcbiAgICBjdHguc3RhcnQgPSB0aGlzLnN0YXJ0O1xuICAgIGN0eC5kdXJhdGlvbiA9IHRoaXMuZHVyYXRpb247XG4gICAgY3R4Lm9mZnNldCA9IHRoaXMub2Zmc2V0O1xuICAgIGN0eC5zdHJldGNoUmF0aW8gPSB0aGlzLnN0cmV0Y2hSYXRpbztcblxuICAgIHJldHVybiBjdHg7XG4gIH1cblxuICBnZXQgc3RhcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0O1xuICB9XG5cbiAgc2V0IHN0YXJ0KHZhbHVlKSB7XG4gICAgdGhpcy5fc3RhcnQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBkdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fZHVyYXRpb247XG4gIH1cblxuICBzZXQgZHVyYXRpb24odmFsdWUpIHtcbiAgICB0aGlzLl9kdXJhdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xuICB9XG5cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMuX29mZnNldCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHN0cmV0Y2hSYXRpbygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RyZXRjaFJhdGlvO1xuICB9XG5cbiAgc2V0IHN0cmV0Y2hSYXRpbyh2YWx1ZSkge1xuICAgIC8vIHJlbW92ZSBsb2NhbCB4U2NhbGUgaWYgcmF0aW8gPSAxXG4gICAgaWYgKHZhbHVlID09PSAgMSkge1xuICAgICAgdGhpcy5feFNjYWxlID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB4U2NhbGUgPSB0aGlzLnBhcmVudC5vcmlnaW5hbFhTY2FsZS5jb3B5KCk7XG4gICAgY29uc3QgW21pbiwgbWF4XSA9IHhTY2FsZS5kb21haW4oKTtcbiAgICBjb25zdCBkaWZmID0gKG1heCAtIG1pbikgLyAodmFsdWUgKiB0aGlzLnBhcmVudC5zdHJldGNoUmF0aW8pO1xuXG4gICAgeFNjYWxlLmRvbWFpbihbbWluLCBtaW4gKyBkaWZmXSk7XG5cbiAgICB0aGlzLl94U2NhbGUgPSB4U2NhbGU7XG4gICAgdGhpcy5fc3RyZXRjaFJhdGlvID0gdmFsdWU7XG4gIH1cblxuXG4gIGdldCB4U2NhbGUoKSB7XG4gICAgaWYgKCF0aGlzLl94U2NhbGUpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC54U2NhbGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3hTY2FsZTtcbiAgfVxuXG4gIC8vIHNldCB4U2NhbGUoc2NhbGUpIHtcbiAgLy8gICB0aGlzLl94U2NhbGUgPSBzY2FsZTtcbiAgLy8gfVxuXG4gIGdldCB4U2NhbGVSYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy54U2NhbGUucmFuZ2UoKTtcbiAgfVxuXG4gIHNldCB4U2NhbGVSYW5nZShhcnIpIHtcbiAgICBpZiAoIXRoaXMuX3hTY2FsZSkgeyByZXR1cm47IH1cbiAgICB0aGlzLl94U2NhbGUucmFuZ2UoYXJyKTtcbiAgfVxuXG4gIC8vIHJlYWQgb25seVxuICBnZXQgb3JpZ2luYWxYU2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50Lm9yaWdpbmFsWFNjYWxlKCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMYXllclRpbWVDb250ZXh0O1xuIl19