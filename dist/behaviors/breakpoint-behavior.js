'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _baseBehavior = require('./base-behavior');

var _baseBehavior2 = _interopRequireDefault(_baseBehavior);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Defines the default behavior for a breakpoint function.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */
var BreakpointBehavior = function (_BaseBehavior) {
  (0, _inherits3.default)(BreakpointBehavior, _BaseBehavior);

  function BreakpointBehavior() {
    (0, _classCallCheck3.default)(this, BreakpointBehavior);
    return (0, _possibleConstructorReturn3.default)(this, (BreakpointBehavior.__proto__ || (0, _getPrototypeOf2.default)(BreakpointBehavior)).apply(this, arguments));
  }

  (0, _createClass3.default)(BreakpointBehavior, [{
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
}(_baseBehavior2.default);

exports.default = BreakpointBehavior;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJyZWFrcG9pbnQtYmVoYXZpb3IuanMiXSwibmFtZXMiOlsiQnJlYWtwb2ludEJlaGF2aW9yIiwicmVuZGVyaW5nQ29udGV4dCIsInNoYXBlIiwiZGF0dW0iLCJkeCIsImR5IiwidGFyZ2V0IiwiZGF0YSIsIl9sYXllciIsImxheWVySGVpZ2h0IiwiaGVpZ2h0IiwieCIsInRpbWVUb1BpeGVsIiwiY3giLCJ5IiwidmFsdWVUb1BpeGVsIiwiY3kiLCJ0YXJnZXRYIiwidGFyZ2V0WSIsImxlbmd0aCIsInhNYXAiLCJtYXAiLCJkIiwic29ydCIsImEiLCJiIiwiaW5kZXgiLCJpbmRleE9mIiwiaW52ZXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFHQTs7Ozs7SUFLcUJBLGtCOzs7Ozs7Ozs7O3lCQUNkQyxnQixFQUFrQkMsSyxFQUFPQyxLLEVBQU9DLEUsRUFBSUMsRSxFQUFJQyxNLEVBQVE7QUFDbkQsVUFBTUMsT0FBUSxLQUFLQyxNQUFMLENBQVlELElBQTFCO0FBQ0EsVUFBTUUsY0FBY1IsaUJBQWlCUyxNQUFyQztBQUNBO0FBQ0EsVUFBTUMsSUFBSVYsaUJBQWlCVyxXQUFqQixDQUE2QlYsTUFBTVcsRUFBTixDQUFTVixLQUFULENBQTdCLENBQVY7QUFDQSxVQUFNVyxJQUFJYixpQkFBaUJjLFlBQWpCLENBQThCYixNQUFNYyxFQUFOLENBQVNiLEtBQVQsQ0FBOUIsQ0FBVjtBQUNBO0FBQ0EsVUFBSWMsVUFBVU4sSUFBSVAsRUFBbEI7QUFDQSxVQUFJYyxVQUFVSixJQUFJVCxFQUFsQjs7QUFFQSxVQUFJRSxLQUFLWSxNQUFMLEdBQWMsQ0FBbEIsRUFBcUI7QUFDbkI7QUFDQSxZQUFNQyxPQUFPYixLQUFLYyxHQUFMLENBQVMsVUFBQ0MsQ0FBRDtBQUFBLGlCQUFPckIsaUJBQWlCVyxXQUFqQixDQUE2QlYsTUFBTVcsRUFBTixDQUFTUyxDQUFULENBQTdCLENBQVA7QUFBQSxTQUFULENBQWI7QUFDQUYsYUFBS0csSUFBTCxDQUFVLFVBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLGlCQUFVRCxJQUFJQyxDQUFKLEdBQVEsQ0FBQyxDQUFULEdBQWEsQ0FBdkI7QUFBQSxTQUFWO0FBQ0E7QUFDQSxZQUFNQyxRQUFRTixLQUFLTyxPQUFMLENBQWFoQixDQUFiLENBQWQ7QUFDQTtBQUNBLFlBQUlNLFVBQVVHLEtBQUtNLFFBQVEsQ0FBYixDQUFWLElBQTZCVCxVQUFVRyxLQUFLTSxRQUFRLENBQWIsQ0FBM0MsRUFBNEQ7QUFDMURULG9CQUFVTixDQUFWO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBLFVBQUlPLFVBQVUsQ0FBZCxFQUFpQjtBQUNmQSxrQkFBVSxDQUFWO0FBQ0QsT0FGRCxNQUVPLElBQUlBLFVBQVVULFdBQWQsRUFBMkI7QUFDaENTLGtCQUFVVCxXQUFWO0FBQ0Q7O0FBRUQ7QUFDQVAsWUFBTVcsRUFBTixDQUFTVixLQUFULEVBQWdCRixpQkFBaUJXLFdBQWpCLENBQTZCZ0IsTUFBN0IsQ0FBb0NYLE9BQXBDLENBQWhCO0FBQ0FmLFlBQU1jLEVBQU4sQ0FBU2IsS0FBVCxFQUFnQkYsaUJBQWlCYyxZQUFqQixDQUE4QmEsTUFBOUIsQ0FBcUNWLE9BQXJDLENBQWhCO0FBQ0Q7Ozs7O2tCQWpDa0JsQixrQiIsImZpbGUiOiJicmVha3BvaW50LWJlaGF2aW9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VCZWhhdmlvciBmcm9tICcuL2Jhc2UtYmVoYXZpb3InO1xuXG5cbi8qKlxuICogRGVmaW5lcyB0aGUgZGVmYXVsdCBiZWhhdmlvciBmb3IgYSBicmVha3BvaW50IGZ1bmN0aW9uLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWJyZWFrcG9pbnQuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJlYWtwb2ludEJlaGF2aW9yIGV4dGVuZHMgQmFzZUJlaGF2aW9yIHtcbiAgZWRpdChyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgY29uc3QgZGF0YSAgPSB0aGlzLl9sYXllci5kYXRhO1xuICAgIGNvbnN0IGxheWVySGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG4gICAgLy8gY3VycmVudCBwb3NpdGlvblxuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLmN4KGRhdHVtKSk7XG4gICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHNoYXBlLmN5KGRhdHVtKSk7XG4gICAgLy8gdGFyZ2V0IHBvc2l0aW9uXG4gICAgbGV0IHRhcmdldFggPSB4ICsgZHg7XG4gICAgbGV0IHRhcmdldFkgPSB5IC0gZHk7XG5cbiAgICBpZiAoZGF0YS5sZW5ndGggPiAyKSB7XG4gICAgICAvLyBjcmVhdGUgYSBzb3J0ZWQgbWFwIG9mIGFsbCBgeGAgcG9zaXRpb25zXG4gICAgICBjb25zdCB4TWFwID0gZGF0YS5tYXAoKGQpID0+IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2hhcGUuY3goZCkpKTtcbiAgICAgIHhNYXAuc29ydCgoYSwgYikgPT4gYSA8IGIgPyAtMSA6IDEpO1xuICAgICAgLy8gZmluZCBpbmRleCBvZiBvdXIgc2hhcGUgeCBwb3NpdGlvblxuICAgICAgY29uc3QgaW5kZXggPSB4TWFwLmluZGV4T2YoeCk7XG4gICAgICAvLyBsb2NrIHRvIG5leHQgc2libGluZ3NcbiAgICAgIGlmICh0YXJnZXRYIDwgeE1hcFtpbmRleCAtIDFdIHx8wqB0YXJnZXRYID4geE1hcFtpbmRleCArIDFdKSB7XG4gICAgICAgIHRhcmdldFggPSB4O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGxvY2sgaW4geSBheGlzXG4gICAgaWYgKHRhcmdldFkgPCAwKSB7XG4gICAgICB0YXJnZXRZID0gMDtcbiAgICB9IGVsc2UgaWYgKHRhcmdldFkgPiBsYXllckhlaWdodCkge1xuICAgICAgdGFyZ2V0WSA9IGxheWVySGVpZ2h0O1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBkYXR1bSB3aXRoIG5ldyB2YWx1ZXNcbiAgICBzaGFwZS5jeChkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0WCkpO1xuICAgIHNoYXBlLmN5KGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbC5pbnZlcnQodGFyZ2V0WSkpO1xuICB9XG59XG4iXX0=