"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var BaseBehavior = require("./base-behavior");

var BreakpointBehavior = (function (_BaseBehavior) {
  function BreakpointBehavior() {
    _classCallCheck(this, BreakpointBehavior);

    if (_BaseBehavior != null) {
      _BaseBehavior.apply(this, arguments);
    }
  }

  _inherits(BreakpointBehavior, _BaseBehavior);

  _createClass(BreakpointBehavior, {
    edit: {
      value: function edit(shape, datum, dx, dy, target) {
        var data = this._layer.data;
        var ctx = this._layer.context;
        // const shape = this._layer._itemShapesMap.get(item)[0]; // get the first registered shape
        var layerHeight = ctx.params.height;
        // current position
        var x = ctx.xScale(shape.cx(datum));
        var y = ctx.yScale(shape.cy(datum));
        // target position
        var targetX = x + dx;
        var targetY = y - dy;

        // create a map of all `x` positions
        // reuse accessor of the shape we know
        var xMap = data.map(function (d, index) {
          return ctx.xScale(shape.cx(d));
        });
        // sort the map
        xMap.sort(function (a, b) {
          return a < b ? -1 : 1;
        });

        // find index of our shape x position
        var index = xMap.indexOf(x);
        // compare with next siblings and lock
        if (targetX < xMap[index - 1] || targetX > xMap[index + 1]) {
          targetX = x;
        }

        // lock in y axis
        if (targetY < 0) {
          targetY = 0;
        } else if (targetY > layerHeight) {
          targetY = layerHeight;
        }

        // update datum with new values
        shape.cx(datum, ctx.xScale.invert(targetX));
        shape.cy(datum, ctx.yScale.invert(targetY));
      }
    }
  });

  return BreakpointBehavior;
})(BaseBehavior);

module.exports = BreakpointBehavior;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9iZWhhdmlvcnMvYnJlYWtwb2ludC1iZWhhdmlvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOztJQUUxQyxrQkFBa0I7V0FBbEIsa0JBQWtCOzBCQUFsQixrQkFBa0I7Ozs7Ozs7WUFBbEIsa0JBQWtCOztlQUFsQixrQkFBa0I7QUFFdEIsUUFBSTthQUFBLGNBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtBQUNqQyxZQUFNLElBQUksR0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztBQUMvQixZQUFNLEdBQUcsR0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQzs7QUFFbEMsWUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7O0FBRXRDLFlBQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLFlBQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUV0QyxZQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFlBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7Ozs7QUFJckIsWUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsRUFBRSxLQUFLLEVBQUs7QUFBRSxpQkFBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUFFLENBQUMsQ0FBQzs7QUFFeEUsWUFBSSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLEVBQUs7QUFBRSxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUFFLENBQUMsQ0FBQzs7O0FBRy9DLFlBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTlCLFlBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDMUQsaUJBQU8sR0FBRyxDQUFDLENBQUM7U0FDYjs7O0FBR0QsWUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO0FBQ2YsaUJBQU8sR0FBRyxDQUFDLENBQUM7U0FDYixNQUFNLElBQUksT0FBTyxHQUFHLFdBQVcsRUFBRTtBQUNoQyxpQkFBTyxHQUFHLFdBQVcsQ0FBQztTQUN2Qjs7O0FBR0QsYUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUM1QyxhQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO09BQzdDOzs7O1NBckNHLGtCQUFrQjtHQUFTLFlBQVk7O0FBeUM3QyxNQUFNLENBQUMsT0FBTyxHQUFHLGtCQUFrQixDQUFDIiwiZmlsZSI6ImVzNi9iZWhhdmlvcnMvYnJlYWtwb2ludC1iZWhhdmlvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEJhc2VCZWhhdmlvciA9IHJlcXVpcmUoJy4vYmFzZS1iZWhhdmlvcicpO1xuXG5jbGFzcyBCcmVha3BvaW50QmVoYXZpb3IgZXh0ZW5kcyBCYXNlQmVoYXZpb3Ige1xuXG4gIGVkaXQoc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IGRhdGEgID0gdGhpcy5fbGF5ZXIuZGF0YTtcbiAgICBjb25zdCBjdHggICA9IHRoaXMuX2xheWVyLmNvbnRleHQ7XG4gICAgLy8gY29uc3Qgc2hhcGUgPSB0aGlzLl9sYXllci5faXRlbVNoYXBlc01hcC5nZXQoaXRlbSlbMF07IC8vIGdldCB0aGUgZmlyc3QgcmVnaXN0ZXJlZCBzaGFwZVxuICAgIGNvbnN0IGxheWVySGVpZ2h0ID0gY3R4LnBhcmFtcy5oZWlnaHQ7XG4gICAgLy8gY3VycmVudCBwb3NpdGlvblxuICAgIGNvbnN0IHggPSBjdHgueFNjYWxlKHNoYXBlLmN4KGRhdHVtKSk7XG4gICAgY29uc3QgeSA9IGN0eC55U2NhbGUoc2hhcGUuY3koZGF0dW0pKTtcbiAgICAvLyB0YXJnZXQgcG9zaXRpb25cbiAgICBsZXQgdGFyZ2V0WCA9IHggKyBkeDtcbiAgICBsZXQgdGFyZ2V0WSA9IHkgLSBkeTtcblxuICAgIC8vIGNyZWF0ZSBhIG1hcCBvZiBhbGwgYHhgIHBvc2l0aW9uc1xuICAgIC8vIHJldXNlIGFjY2Vzc29yIG9mIHRoZSBzaGFwZSB3ZSBrbm93XG4gICAgY29uc3QgeE1hcCA9IGRhdGEubWFwKChkLCBpbmRleCkgPT4geyByZXR1cm4gY3R4LnhTY2FsZShzaGFwZS5jeChkKSkgfSk7XG4gICAgLy8gc29ydCB0aGUgbWFwXG4gICAgeE1hcC5zb3J0KChhLCBiKSA9PiB7IHJldHVybiBhIDwgYiA/IC0xIDogMSB9KTtcblxuICAgIC8vIGZpbmQgaW5kZXggb2Ygb3VyIHNoYXBlIHggcG9zaXRpb25cbiAgICBjb25zdCBpbmRleCA9IHhNYXAuaW5kZXhPZih4KTtcbiAgICAvLyBjb21wYXJlIHdpdGggbmV4dCBzaWJsaW5ncyBhbmQgbG9ja1xuICAgIGlmICh0YXJnZXRYIDwgeE1hcFtpbmRleCAtIDFdIHx8wqB0YXJnZXRYID4geE1hcFtpbmRleCArIDFdKSB7XG4gICAgICB0YXJnZXRYID0geDtcbiAgICB9XG5cbiAgICAvLyBsb2NrIGluIHkgYXhpc1xuICAgIGlmICh0YXJnZXRZIDwgMCkge1xuICAgICAgdGFyZ2V0WSA9IDA7XG4gICAgfSBlbHNlIGlmICh0YXJnZXRZID4gbGF5ZXJIZWlnaHQpIHtcbiAgICAgIHRhcmdldFkgPSBsYXllckhlaWdodDtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgZGF0dW0gd2l0aCBuZXcgdmFsdWVzXG4gICAgc2hhcGUuY3goZGF0dW0sIGN0eC54U2NhbGUuaW52ZXJ0KHRhcmdldFgpKTtcbiAgICBzaGFwZS5jeShkYXR1bSwgY3R4LnlTY2FsZS5pbnZlcnQodGFyZ2V0WSkpO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCcmVha3BvaW50QmVoYXZpb3I7Il19