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
      value: function edit(item, datum, dx, dy, target) {
        var data = this._layer.data;
        var ctx = this._layer.context;
        var shape = this._layer._itemShapesMap.get(item)[0]; // get the first registered shape
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvcmVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ2hELElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7SUFFbkIsa0JBQWtCO1dBQWxCLGtCQUFrQjswQkFBbEIsa0JBQWtCOzs7Ozs7O1lBQWxCLGtCQUFrQjs7ZUFBbEIsa0JBQWtCO0FBRXRCLFFBQUk7YUFBQSxjQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7QUFDaEMsWUFBTSxJQUFJLEdBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDL0IsWUFBTSxHQUFHLEdBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDbEMsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RELFlBQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDOztBQUV0QyxZQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN0QyxZQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFdEMsWUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNyQixZQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDOzs7O0FBSXJCLFlBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLEVBQUUsS0FBSyxFQUFLO0FBQUUsaUJBQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FBRSxDQUFDLENBQUM7O0FBRXhFLFlBQUksQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFLO0FBQUUsaUJBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7U0FBRSxDQUFDLENBQUM7OztBQUcvQyxZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUU5QixZQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQzFELGlCQUFPLEdBQUcsQ0FBQyxDQUFDO1NBQ2I7OztBQUdELFlBQUksT0FBTyxHQUFHLENBQUMsRUFBRTtBQUNmLGlCQUFPLEdBQUcsQ0FBQyxDQUFDO1NBQ2IsTUFBTSxJQUFJLE9BQU8sR0FBRyxXQUFXLEVBQUU7QUFDaEMsaUJBQU8sR0FBRyxXQUFXLENBQUM7U0FDdkI7OztBQUdELGFBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDNUMsYUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztPQUM3Qzs7OztTQXJDRyxrQkFBa0I7R0FBUyxZQUFZOztBQXlDN0MsTUFBTSxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyIsImZpbGUiOiJlczYvc2hhcGVzL3JlY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCYXNlQmVoYXZpb3IgPSByZXF1aXJlKCcuL2Jhc2UtYmVoYXZpb3InKTtcbmNvbnN0IGQzID0gcmVxdWlyZSgnZDMnKTtcblxuY2xhc3MgQnJlYWtwb2ludEJlaGF2aW9yIGV4dGVuZHMgQmFzZUJlaGF2aW9yIHtcblxuICBlZGl0KGl0ZW0sIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IGRhdGEgID0gdGhpcy5fbGF5ZXIuZGF0YTtcbiAgICBjb25zdCBjdHggICA9IHRoaXMuX2xheWVyLmNvbnRleHQ7XG4gICAgY29uc3Qgc2hhcGUgPSB0aGlzLl9sYXllci5faXRlbVNoYXBlc01hcC5nZXQoaXRlbSlbMF07IC8vIGdldCB0aGUgZmlyc3QgcmVnaXN0ZXJlZCBzaGFwZVxuICAgIGNvbnN0IGxheWVySGVpZ2h0ID0gY3R4LnBhcmFtcy5oZWlnaHQ7XG4gICAgLy8gY3VycmVudCBwb3NpdGlvblxuICAgIGNvbnN0IHggPSBjdHgueFNjYWxlKHNoYXBlLmN4KGRhdHVtKSk7XG4gICAgY29uc3QgeSA9IGN0eC55U2NhbGUoc2hhcGUuY3koZGF0dW0pKTtcbiAgICAvLyB0YXJnZXQgcG9zaXRpb25cbiAgICBsZXQgdGFyZ2V0WCA9IHggKyBkeDtcbiAgICBsZXQgdGFyZ2V0WSA9IHkgLSBkeTtcblxuICAgIC8vIGNyZWF0ZSBhIG1hcCBvZiBhbGwgYHhgIHBvc2l0aW9uc1xuICAgIC8vIHJldXNlIGFjY2Vzc29yIG9mIHRoZSBzaGFwZSB3ZSBrbm93XG4gICAgY29uc3QgeE1hcCA9IGRhdGEubWFwKChkLCBpbmRleCkgPT4geyByZXR1cm4gY3R4LnhTY2FsZShzaGFwZS5jeChkKSkgfSk7XG4gICAgLy8gc29ydCB0aGUgbWFwXG4gICAgeE1hcC5zb3J0KChhLCBiKSA9PiB7IHJldHVybiBhIDwgYiA/IC0xIDogMSB9KTtcblxuICAgIC8vIGZpbmQgaW5kZXggb2Ygb3VyIHNoYXBlIHggcG9zaXRpb25cbiAgICBjb25zdCBpbmRleCA9IHhNYXAuaW5kZXhPZih4KTtcbiAgICAvLyBjb21wYXJlIHdpdGggbmV4dCBzaWJsaW5ncyBhbmQgbG9ja1xuICAgIGlmICh0YXJnZXRYIDwgeE1hcFtpbmRleCAtIDFdIHx8wqB0YXJnZXRYID4geE1hcFtpbmRleCArIDFdKSB7XG4gICAgICB0YXJnZXRYID0geDtcbiAgICB9XG5cbiAgICAvLyBsb2NrIGluIHkgYXhpc1xuICAgIGlmICh0YXJnZXRZIDwgMCkge1xuICAgICAgdGFyZ2V0WSA9IDA7XG4gICAgfSBlbHNlIGlmICh0YXJnZXRZID4gbGF5ZXJIZWlnaHQpIHtcbiAgICAgIHRhcmdldFkgPSBsYXllckhlaWdodDtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgZGF0dW0gd2l0aCBuZXcgdmFsdWVzXG4gICAgc2hhcGUuY3goZGF0dW0sIGN0eC54U2NhbGUuaW52ZXJ0KHRhcmdldFgpKTtcbiAgICBzaGFwZS5jeShkYXR1bSwgY3R4LnlTY2FsZS5pbnZlcnQodGFyZ2V0WSkpO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCcmVha3BvaW50QmVoYXZpb3I7Il19