"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var BaseBehavior = require("./base-behavior");
var d3 = require("d3");

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9iZWhhdmlvcnMvYnJlYWtwb2ludC1iZWhhdmlvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ2hELElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7SUFFbkIsa0JBQWtCO1dBQWxCLGtCQUFrQjswQkFBbEIsa0JBQWtCOzs7Ozs7O1lBQWxCLGtCQUFrQjs7ZUFBbEIsa0JBQWtCO0FBRXRCLFFBQUk7YUFBQSxjQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7QUFDakMsWUFBTSxJQUFJLEdBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDL0IsWUFBTSxHQUFHLEdBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7O0FBRWxDLFlBQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDOztBQUV0QyxZQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN0QyxZQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFdEMsWUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNyQixZQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDOzs7O0FBSXJCLFlBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLEVBQUUsS0FBSyxFQUFLO0FBQUUsaUJBQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FBRSxDQUFDLENBQUM7O0FBRXhFLFlBQUksQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFLO0FBQUUsaUJBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7U0FBRSxDQUFDLENBQUM7OztBQUcvQyxZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUU5QixZQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQzFELGlCQUFPLEdBQUcsQ0FBQyxDQUFDO1NBQ2I7OztBQUdELFlBQUksT0FBTyxHQUFHLENBQUMsRUFBRTtBQUNmLGlCQUFPLEdBQUcsQ0FBQyxDQUFDO1NBQ2IsTUFBTSxJQUFJLE9BQU8sR0FBRyxXQUFXLEVBQUU7QUFDaEMsaUJBQU8sR0FBRyxXQUFXLENBQUM7U0FDdkI7OztBQUdELGFBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDNUMsYUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztPQUM3Qzs7OztTQXJDRyxrQkFBa0I7R0FBUyxZQUFZOztBQXlDN0MsTUFBTSxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyIsImZpbGUiOiJlczYvYmVoYXZpb3JzL2JyZWFrcG9pbnQtYmVoYXZpb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCYXNlQmVoYXZpb3IgPSByZXF1aXJlKCcuL2Jhc2UtYmVoYXZpb3InKTtcbmNvbnN0IGQzID0gcmVxdWlyZSgnZDMnKTtcblxuY2xhc3MgQnJlYWtwb2ludEJlaGF2aW9yIGV4dGVuZHMgQmFzZUJlaGF2aW9yIHtcblxuICBlZGl0KHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCBkYXRhICA9IHRoaXMuX2xheWVyLmRhdGE7XG4gICAgY29uc3QgY3R4ICAgPSB0aGlzLl9sYXllci5jb250ZXh0O1xuICAgIC8vIGNvbnN0IHNoYXBlID0gdGhpcy5fbGF5ZXIuX2l0ZW1TaGFwZXNNYXAuZ2V0KGl0ZW0pWzBdOyAvLyBnZXQgdGhlIGZpcnN0IHJlZ2lzdGVyZWQgc2hhcGVcbiAgICBjb25zdCBsYXllckhlaWdodCA9IGN0eC5wYXJhbXMuaGVpZ2h0O1xuICAgIC8vIGN1cnJlbnQgcG9zaXRpb25cbiAgICBjb25zdCB4ID0gY3R4LnhTY2FsZShzaGFwZS5jeChkYXR1bSkpO1xuICAgIGNvbnN0IHkgPSBjdHgueVNjYWxlKHNoYXBlLmN5KGRhdHVtKSk7XG4gICAgLy8gdGFyZ2V0IHBvc2l0aW9uXG4gICAgbGV0IHRhcmdldFggPSB4ICsgZHg7XG4gICAgbGV0IHRhcmdldFkgPSB5IC0gZHk7XG5cbiAgICAvLyBjcmVhdGUgYSBtYXAgb2YgYWxsIGB4YCBwb3NpdGlvbnNcbiAgICAvLyByZXVzZSBhY2Nlc3NvciBvZiB0aGUgc2hhcGUgd2Uga25vd1xuICAgIGNvbnN0IHhNYXAgPSBkYXRhLm1hcCgoZCwgaW5kZXgpID0+IHsgcmV0dXJuIGN0eC54U2NhbGUoc2hhcGUuY3goZCkpIH0pO1xuICAgIC8vIHNvcnQgdGhlIG1hcFxuICAgIHhNYXAuc29ydCgoYSwgYikgPT4geyByZXR1cm4gYSA8IGIgPyAtMSA6IDEgfSk7XG5cbiAgICAvLyBmaW5kIGluZGV4IG9mIG91ciBzaGFwZSB4IHBvc2l0aW9uXG4gICAgY29uc3QgaW5kZXggPSB4TWFwLmluZGV4T2YoeCk7XG4gICAgLy8gY29tcGFyZSB3aXRoIG5leHQgc2libGluZ3MgYW5kIGxvY2tcbiAgICBpZiAodGFyZ2V0WCA8IHhNYXBbaW5kZXggLSAxXSB8fMKgdGFyZ2V0WCA+IHhNYXBbaW5kZXggKyAxXSkge1xuICAgICAgdGFyZ2V0WCA9IHg7XG4gICAgfVxuXG4gICAgLy8gbG9jayBpbiB5IGF4aXNcbiAgICBpZiAodGFyZ2V0WSA8IDApIHtcbiAgICAgIHRhcmdldFkgPSAwO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0WSA+IGxheWVySGVpZ2h0KSB7XG4gICAgICB0YXJnZXRZID0gbGF5ZXJIZWlnaHQ7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIGRhdHVtIHdpdGggbmV3IHZhbHVlc1xuICAgIHNoYXBlLmN4KGRhdHVtLCBjdHgueFNjYWxlLmludmVydCh0YXJnZXRYKSk7XG4gICAgc2hhcGUuY3koZGF0dW0sIGN0eC55U2NhbGUuaW52ZXJ0KHRhcmdldFkpKTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQnJlYWtwb2ludEJlaGF2aW9yOyJdfQ==