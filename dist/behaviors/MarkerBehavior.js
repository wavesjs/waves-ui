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

var _BaseBehavior2 = require('./BaseBehavior');

var _BaseBehavior3 = _interopRequireDefault(_BaseBehavior2);

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
}(_BaseBehavior3.default);

exports.default = MarkerBehavior;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1hcmtlckJlaGF2aW9yLmpzIl0sIm5hbWVzIjpbIk1hcmtlckJlaGF2aW9yIiwicmVuZGVyaW5nQ29udGV4dCIsInNoYXBlIiwiZGF0dW0iLCJkeCIsImR5IiwidGFyZ2V0IiwieCIsInRpbWVUb1BpeGVsIiwidGFyZ2V0WCIsImludmVydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0E7Ozs7O0lBS01BLGM7Ozs7Ozs7Ozs7eUJBQ0NDLGdCLEVBQWtCQyxLLEVBQU9DLEssRUFBT0MsRSxFQUFJQyxFLEVBQUlDLE0sRUFBUTtBQUNuRCxVQUFNQyxJQUFJTixpQkFBaUJPLFdBQWpCLENBQTZCTixNQUFNSyxDQUFOLENBQVFKLEtBQVIsQ0FBN0IsQ0FBVjtBQUNBLFVBQU1NLFVBQVdGLElBQUlILEVBQUwsR0FBVyxDQUFYLEdBQWVHLElBQUlILEVBQW5CLEdBQXdCLENBQXhDOztBQUVBRixZQUFNSyxDQUFOLENBQVFKLEtBQVIsRUFBZUYsaUJBQWlCTyxXQUFqQixDQUE2QkUsTUFBN0IsQ0FBb0NELE9BQXBDLENBQWY7QUFDRDs7Ozs7a0JBR1lULGMiLCJmaWxlIjoiTWFya2VyQmVoYXZpb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUJlaGF2aW9yIGZyb20gJy4vQmFzZUJlaGF2aW9yJztcblxuXG4vKipcbiAqIERlZmluZXMgdGhlIGRlZmF1bHQgYmVoYXZpb3IgZm9yIGEgbWFya2VyLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLW1hcmtlci5odG1sKVxuICovXG5jbGFzcyBNYXJrZXJCZWhhdmlvciBleHRlbmRzIEJhc2VCZWhhdmlvciB7XG4gIGVkaXQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLngoZGF0dW0pKTtcbiAgICBjb25zdCB0YXJnZXRYID0gKHggKyBkeCkgPiAwID8geCArIGR4IDogMDtcblxuICAgIHNoYXBlLngoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYXJrZXJCZWhhdmlvcjtcbiJdfQ==