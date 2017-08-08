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
 * Defines the default behavior for a marker.
 *
 * [example usage](./examples/layer-marker.html)
 */
var MarkerBehavior = function (_BaseBehavior) {
  (0, _inherits3.default)(MarkerBehavior, _BaseBehavior);

  function MarkerBehavior() {
    (0, _classCallCheck3.default)(this, MarkerBehavior);
    return (0, _possibleConstructorReturn3.default)(this, (MarkerBehavior.__proto__ || (0, _getPrototypeOf2.default)(MarkerBehavior)).apply(this, arguments));
  }

  (0, _createClass3.default)(MarkerBehavior, [{
    key: 'edit',
    value: function edit(renderingContext, shape, datum, dx, dy, target) {
      var x = renderingContext.timeToPixel(shape.x(datum));
      var targetX = x + dx > 0 ? x + dx : 0;

      shape.x(datum, renderingContext.timeToPixel.invert(targetX));
    }
  }]);
  return MarkerBehavior;
}(_baseBehavior2.default);

exports.default = MarkerBehavior;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hcmtlci1iZWhhdmlvci5qcyJdLCJuYW1lcyI6WyJNYXJrZXJCZWhhdmlvciIsInJlbmRlcmluZ0NvbnRleHQiLCJzaGFwZSIsImRhdHVtIiwiZHgiLCJkeSIsInRhcmdldCIsIngiLCJ0aW1lVG9QaXhlbCIsInRhcmdldFgiLCJpbnZlcnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUdBOzs7OztJQUtNQSxjOzs7Ozs7Ozs7O3lCQUNDQyxnQixFQUFrQkMsSyxFQUFPQyxLLEVBQU9DLEUsRUFBSUMsRSxFQUFJQyxNLEVBQVE7QUFDbkQsVUFBTUMsSUFBSU4saUJBQWlCTyxXQUFqQixDQUE2Qk4sTUFBTUssQ0FBTixDQUFRSixLQUFSLENBQTdCLENBQVY7QUFDQSxVQUFNTSxVQUFXRixJQUFJSCxFQUFMLEdBQVcsQ0FBWCxHQUFlRyxJQUFJSCxFQUFuQixHQUF3QixDQUF4Qzs7QUFFQUYsWUFBTUssQ0FBTixDQUFRSixLQUFSLEVBQWVGLGlCQUFpQk8sV0FBakIsQ0FBNkJFLE1BQTdCLENBQW9DRCxPQUFwQyxDQUFmO0FBQ0Q7Ozs7O2tCQUdZVCxjIiwiZmlsZSI6Im1hcmtlci1iZWhhdmlvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlQmVoYXZpb3IgZnJvbSAnLi9iYXNlLWJlaGF2aW9yJztcblxuXG4vKipcbiAqIERlZmluZXMgdGhlIGRlZmF1bHQgYmVoYXZpb3IgZm9yIGEgbWFya2VyLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLW1hcmtlci5odG1sKVxuICovXG5jbGFzcyBNYXJrZXJCZWhhdmlvciBleHRlbmRzIEJhc2VCZWhhdmlvciB7XG4gIGVkaXQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLngoZGF0dW0pKTtcbiAgICBjb25zdCB0YXJnZXRYID0gKHggKyBkeCkgPiAwID8geCArIGR4IDogMDtcblxuICAgIHNoYXBlLngoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYXJrZXJCZWhhdmlvcjtcbiJdfQ==