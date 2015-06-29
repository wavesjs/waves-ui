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
      value: function edit(renderingContext, shape, datum, dx, dy, target) {
        var data = this._layer.data;
        var layerHeight = renderingContext.height;
        // current position
        var x = renderingContext.xScale(shape.cx(datum));
        var y = renderingContext.yScale(shape.cy(datum));
        // target position
        var targetX = x + dx;
        var targetY = y - dy;

        // create a map of all `x` positions
        // reuse accessor of the shape we know
        var xMap = data.map(function (d, index) {
          return renderingContext.xScale(shape.cx(d));
        });
        // sort the map
        xMap.sort(function (a, b) {
          return a < b ? -1 : 1;
        });

        // find index of our shape x position
        var index = xMap.indexOf(x);
        // lock to next siblings
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
        shape.cx(datum, renderingContext.xScale.invert(targetX));
        shape.cy(datum, renderingContext.yScale.invert(targetY));
      }
    }
  });

  return BreakpointBehavior;
})(BaseBehavior);

module.exports = BreakpointBehavior;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9iZWhhdmlvcnMvYnJlYWtwb2ludC1iZWhhdmlvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOztJQUUxQyxrQkFBa0I7V0FBbEIsa0JBQWtCOzBCQUFsQixrQkFBa0I7Ozs7Ozs7WUFBbEIsa0JBQWtCOztlQUFsQixrQkFBa0I7QUFFdEIsUUFBSTthQUFBLGNBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtBQUNuRCxZQUFNLElBQUksR0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztBQUMvQixZQUFNLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7O0FBRTVDLFlBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDbkQsWUFBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFbkQsWUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNyQixZQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDOzs7O0FBSXJCLFlBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLEVBQUUsS0FBSztpQkFBSyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUFBLENBQUMsQ0FBQzs7QUFFMUUsWUFBSSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO2lCQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQztTQUFBLENBQUMsQ0FBQzs7O0FBR3BDLFlBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTlCLFlBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDMUQsaUJBQU8sR0FBRyxDQUFDLENBQUM7U0FDYjs7O0FBR0QsWUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO0FBQ2YsaUJBQU8sR0FBRyxDQUFDLENBQUM7U0FDYixNQUFNLElBQUksT0FBTyxHQUFHLFdBQVcsRUFBRTtBQUNoQyxpQkFBTyxHQUFHLFdBQVcsQ0FBQztTQUN2Qjs7O0FBR0QsYUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ3pELGFBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztPQUMxRDs7OztTQW5DRyxrQkFBa0I7R0FBUyxZQUFZOztBQXVDN0MsTUFBTSxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyIsImZpbGUiOiJlczYvYmVoYXZpb3JzL2JyZWFrcG9pbnQtYmVoYXZpb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCYXNlQmVoYXZpb3IgPSByZXF1aXJlKCcuL2Jhc2UtYmVoYXZpb3InKTtcblxuY2xhc3MgQnJlYWtwb2ludEJlaGF2aW9yIGV4dGVuZHMgQmFzZUJlaGF2aW9yIHtcblxuICBlZGl0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCBkYXRhICA9IHRoaXMuX2xheWVyLmRhdGE7XG4gICAgY29uc3QgbGF5ZXJIZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcbiAgICAvLyBjdXJyZW50IHBvc2l0aW9uXG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQueFNjYWxlKHNoYXBlLmN4KGRhdHVtKSk7XG4gICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQueVNjYWxlKHNoYXBlLmN5KGRhdHVtKSk7XG4gICAgLy8gdGFyZ2V0IHBvc2l0aW9uXG4gICAgbGV0IHRhcmdldFggPSB4ICsgZHg7XG4gICAgbGV0IHRhcmdldFkgPSB5IC0gZHk7XG5cbiAgICAvLyBjcmVhdGUgYSBtYXAgb2YgYWxsIGB4YCBwb3NpdGlvbnNcbiAgICAvLyByZXVzZSBhY2Nlc3NvciBvZiB0aGUgc2hhcGUgd2Uga25vd1xuICAgIGNvbnN0IHhNYXAgPSBkYXRhLm1hcCgoZCwgaW5kZXgpID0+IHJlbmRlcmluZ0NvbnRleHQueFNjYWxlKHNoYXBlLmN4KGQpKSk7XG4gICAgLy8gc29ydCB0aGUgbWFwXG4gICAgeE1hcC5zb3J0KChhLCBiKSA9PiBhIDwgYiA/IC0xIDogMSk7XG5cbiAgICAvLyBmaW5kIGluZGV4IG9mIG91ciBzaGFwZSB4IHBvc2l0aW9uXG4gICAgY29uc3QgaW5kZXggPSB4TWFwLmluZGV4T2YoeCk7XG4gICAgLy8gbG9jayB0byBuZXh0IHNpYmxpbmdzXG4gICAgaWYgKHRhcmdldFggPCB4TWFwW2luZGV4IC0gMV0gfHzCoHRhcmdldFggPiB4TWFwW2luZGV4ICsgMV0pIHtcbiAgICAgIHRhcmdldFggPSB4O1xuICAgIH1cblxuICAgIC8vIGxvY2sgaW4geSBheGlzXG4gICAgaWYgKHRhcmdldFkgPCAwKSB7XG4gICAgICB0YXJnZXRZID0gMDtcbiAgICB9IGVsc2UgaWYgKHRhcmdldFkgPiBsYXllckhlaWdodCkge1xuICAgICAgdGFyZ2V0WSA9IGxheWVySGVpZ2h0O1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBkYXR1bSB3aXRoIG5ldyB2YWx1ZXNcbiAgICBzaGFwZS5jeChkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC54U2NhbGUuaW52ZXJ0KHRhcmdldFgpKTtcbiAgICBzaGFwZS5jeShkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC55U2NhbGUuaW52ZXJ0KHRhcmdldFkpKTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQnJlYWtwb2ludEJlaGF2aW9yOyJdfQ==