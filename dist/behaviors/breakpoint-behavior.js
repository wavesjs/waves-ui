'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseBehavior = require('./base-behavior');

var _baseBehavior2 = _interopRequireDefault(_baseBehavior);

/**
 * Defines the default behavior for a breakpoint function.
 */

var BreakpointBehavior = (function (_BaseBehavior) {
  _inherits(BreakpointBehavior, _BaseBehavior);

  function BreakpointBehavior() {
    _classCallCheck(this, BreakpointBehavior);

    _get(Object.getPrototypeOf(BreakpointBehavior.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(BreakpointBehavior, [{
    key: 'edit',
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
  }]);

  return BreakpointBehavior;
})(_baseBehavior2['default']);

exports['default'] = BreakpointBehavior;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy93YXZlcy11aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzRCQUF5QixpQkFBaUI7Ozs7Ozs7O0lBTXJCLGtCQUFrQjtZQUFsQixrQkFBa0I7O1dBQWxCLGtCQUFrQjswQkFBbEIsa0JBQWtCOzsrQkFBbEIsa0JBQWtCOzs7ZUFBbEIsa0JBQWtCOztXQUNqQyxjQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7QUFDbkQsVUFBTSxJQUFJLEdBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDL0IsVUFBTSxXQUFXLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDOztBQUU1QyxVQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3hELFVBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7O0FBRXpELFVBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDckIsVUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7QUFFckIsVUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs7QUFFbkIsWUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUM7aUJBQUssZ0JBQWdCLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FBQSxDQUFDLENBQUM7QUFDeEUsWUFBSSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO2lCQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQztTQUFBLENBQUMsQ0FBQzs7QUFFcEMsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFOUIsWUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRTtBQUMxRCxpQkFBTyxHQUFHLENBQUMsQ0FBQztTQUNiO09BQ0Y7OztBQUdELFVBQUksT0FBTyxHQUFHLENBQUMsRUFBRTtBQUNmLGVBQU8sR0FBRyxDQUFDLENBQUM7T0FDYixNQUFNLElBQUksT0FBTyxHQUFHLFdBQVcsRUFBRTtBQUNoQyxlQUFPLEdBQUcsV0FBVyxDQUFDO09BQ3ZCOzs7QUFHRCxXQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDOUQsV0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQ2hFOzs7U0FqQ2tCLGtCQUFrQjs7O3FCQUFsQixrQkFBa0IiLCJmaWxlIjoic3JjL3dhdmVzLXVpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VCZWhhdmlvciBmcm9tICcuL2Jhc2UtYmVoYXZpb3InO1xuXG5cbi8qKlxuICogRGVmaW5lcyB0aGUgZGVmYXVsdCBiZWhhdmlvciBmb3IgYSBicmVha3BvaW50IGZ1bmN0aW9uLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcmVha3BvaW50QmVoYXZpb3IgZXh0ZW5kcyBCYXNlQmVoYXZpb3Ige1xuICBlZGl0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCBkYXRhICA9IHRoaXMuX2xheWVyLmRhdGE7XG4gICAgY29uc3QgbGF5ZXJIZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcbiAgICAvLyBjdXJyZW50IHBvc2l0aW9uXG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2hhcGUuY3goZGF0dW0pKTtcbiAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoc2hhcGUuY3koZGF0dW0pKTtcbiAgICAvLyB0YXJnZXQgcG9zaXRpb25cbiAgICBsZXQgdGFyZ2V0WCA9IHggKyBkeDtcbiAgICBsZXQgdGFyZ2V0WSA9IHkgLSBkeTtcblxuICAgIGlmIChkYXRhLmxlbmd0aCA+IDIpIHtcbiAgICAgIC8vIGNyZWF0ZSBhIHNvcnRlZCBtYXAgb2YgYWxsIGB4YCBwb3NpdGlvbnNcbiAgICAgIGNvbnN0IHhNYXAgPSBkYXRhLm1hcCgoZCkgPT4gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS5jeChkKSkpO1xuICAgICAgeE1hcC5zb3J0KChhLCBiKSA9PiBhIDwgYiA/IC0xIDogMSk7XG4gICAgICAvLyBmaW5kIGluZGV4IG9mIG91ciBzaGFwZSB4IHBvc2l0aW9uXG4gICAgICBjb25zdCBpbmRleCA9IHhNYXAuaW5kZXhPZih4KTtcbiAgICAgIC8vIGxvY2sgdG8gbmV4dCBzaWJsaW5nc1xuICAgICAgaWYgKHRhcmdldFggPCB4TWFwW2luZGV4IC0gMV0gfHzCoHRhcmdldFggPiB4TWFwW2luZGV4ICsgMV0pIHtcbiAgICAgICAgdGFyZ2V0WCA9IHg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gbG9jayBpbiB5IGF4aXNcbiAgICBpZiAodGFyZ2V0WSA8IDApIHtcbiAgICAgIHRhcmdldFkgPSAwO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0WSA+IGxheWVySGVpZ2h0KSB7XG4gICAgICB0YXJnZXRZID0gbGF5ZXJIZWlnaHQ7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIGRhdHVtIHdpdGggbmV3IHZhbHVlc1xuICAgIHNoYXBlLmN4KGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRYKSk7XG4gICAgc2hhcGUuY3koZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmludmVydCh0YXJnZXRZKSk7XG4gIH1cbn1cbiJdfQ==