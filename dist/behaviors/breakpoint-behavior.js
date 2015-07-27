"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseBehavior = _interopRequire(require("./base-behavior"));

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
      value: function edit(renderingContext, shape, datum, dx, dy, target) {
        var data = this._layer.data;
        var layerHeight = renderingContext.height;
        // current position
        var x = renderingContext.timeToPixel(shape.cx(datum));
        var y = renderingContext.valueToPixel(shape.cy(datum));
        // target position
        var targetX = x + dx;
        var targetY = y - dy;

        if (data.length > 2) {
          // create a sorted map of all `x` positions
          var xMap = data.map(function (d) {
            return renderingContext.timeToPixel(shape.cx(d));
          });
          xMap.sort(function (a, b) {
            return a < b ? -1 : 1;
          });
          // find index of our shape x position
          var index = xMap.indexOf(x);
          // lock to next siblings
          if (targetX < xMap[index - 1] || targetX > xMap[index + 1]) {
            targetX = x;
          }
        }

        // lock in y axis
        if (targetY < 0) {
          targetY = 0;
        } else if (targetY > layerHeight) {
          targetY = layerHeight;
        }

        // update datum with new values
        shape.cx(datum, renderingContext.timeToPixel.invert(targetX));
        shape.cy(datum, renderingContext.valueToPixel.invert(targetY));
      }
    }
  });

  return BreakpointBehavior;
})(BaseBehavior);

module.exports = BreakpointBehavior;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9iZWhhdmlvcnMvYnJlYWtwb2ludC1iZWhhdmlvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU8sWUFBWSwyQkFBTSxpQkFBaUI7O0lBR3JCLGtCQUFrQjtXQUFsQixrQkFBa0I7MEJBQWxCLGtCQUFrQjs7Ozs7OztZQUFsQixrQkFBa0I7O2VBQWxCLGtCQUFrQjtBQUVyQyxRQUFJO2FBQUEsY0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFO0FBQ25ELFlBQU0sSUFBSSxHQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQy9CLFlBQU0sV0FBVyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQzs7QUFFNUMsWUFBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN4RCxZQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUV6RCxZQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFlBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRXJCLFlBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7O0FBRW5CLGNBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDO21CQUFLLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1dBQUEsQ0FBQyxDQUFDO0FBQ3hFLGNBQUksQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQzttQkFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7V0FBQSxDQUFDLENBQUM7O0FBRXBDLGNBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTlCLGNBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDMUQsbUJBQU8sR0FBRyxDQUFDLENBQUM7V0FDYjtTQUNGOzs7QUFHRCxZQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUU7QUFDZixpQkFBTyxHQUFHLENBQUMsQ0FBQztTQUNiLE1BQU0sSUFBSSxPQUFPLEdBQUcsV0FBVyxFQUFFO0FBQ2hDLGlCQUFPLEdBQUcsV0FBVyxDQUFDO1NBQ3ZCOzs7QUFHRCxhQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDOUQsYUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO09BQ2hFOzs7O1NBbENrQixrQkFBa0I7R0FBUyxZQUFZOztpQkFBdkMsa0JBQWtCIiwiZmlsZSI6ImVzNi9iZWhhdmlvcnMvYnJlYWtwb2ludC1iZWhhdmlvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlQmVoYXZpb3IgZnJvbSAnLi9iYXNlLWJlaGF2aW9yJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcmVha3BvaW50QmVoYXZpb3IgZXh0ZW5kcyBCYXNlQmVoYXZpb3Ige1xuXG4gIGVkaXQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IGRhdGEgID0gdGhpcy5fbGF5ZXIuZGF0YTtcbiAgICBjb25zdCBsYXllckhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuICAgIC8vIGN1cnJlbnQgcG9zaXRpb25cbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS5jeChkYXR1bSkpO1xuICAgIGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChzaGFwZS5jeShkYXR1bSkpO1xuICAgIC8vIHRhcmdldCBwb3NpdGlvblxuICAgIGxldCB0YXJnZXRYID0geCArIGR4O1xuICAgIGxldCB0YXJnZXRZID0geSAtIGR5O1xuXG4gICAgaWYgKGRhdGEubGVuZ3RoID4gMikge1xuICAgICAgLy8gY3JlYXRlIGEgc29ydGVkIG1hcCBvZiBhbGwgYHhgIHBvc2l0aW9uc1xuICAgICAgY29uc3QgeE1hcCA9IGRhdGEubWFwKChkKSA9PiByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLmN4KGQpKSk7XG4gICAgICB4TWFwLnNvcnQoKGEsIGIpID0+IGEgPCBiID8gLTEgOiAxKTtcbiAgICAgIC8vIGZpbmQgaW5kZXggb2Ygb3VyIHNoYXBlIHggcG9zaXRpb25cbiAgICAgIGNvbnN0IGluZGV4ID0geE1hcC5pbmRleE9mKHgpO1xuICAgICAgLy8gbG9jayB0byBuZXh0IHNpYmxpbmdzXG4gICAgICBpZiAodGFyZ2V0WCA8IHhNYXBbaW5kZXggLSAxXSB8fMKgdGFyZ2V0WCA+IHhNYXBbaW5kZXggKyAxXSkge1xuICAgICAgICB0YXJnZXRYID0geDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBsb2NrIGluIHkgYXhpc1xuICAgIGlmICh0YXJnZXRZIDwgMCkge1xuICAgICAgdGFyZ2V0WSA9IDA7XG4gICAgfSBlbHNlIGlmICh0YXJnZXRZID4gbGF5ZXJIZWlnaHQpIHtcbiAgICAgIHRhcmdldFkgPSBsYXllckhlaWdodDtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgZGF0dW0gd2l0aCBuZXcgdmFsdWVzXG4gICAgc2hhcGUuY3goZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpKTtcbiAgICBzaGFwZS5jeShkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFkpKTtcbiAgfVxuXG59XG4iXX0=