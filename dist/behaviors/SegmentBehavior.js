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
 * Defines the default behavior for a segment.
 *
 * [example usage](./examples/layer-marker.html)
 */
var SegmentBehavior = function (_BaseBehavior) {
  (0, _inherits3.default)(SegmentBehavior, _BaseBehavior);

  function SegmentBehavior() {
    (0, _classCallCheck3.default)(this, SegmentBehavior);
    return (0, _possibleConstructorReturn3.default)(this, (SegmentBehavior.__proto__ || (0, _getPrototypeOf2.default)(SegmentBehavior)).apply(this, arguments));
  }

  (0, _createClass3.default)(SegmentBehavior, [{
    key: 'edit',
    value: function edit(renderingContext, shape, datum, dx, dy, target) {
      var classList = target.classList;
      var action = 'move';

      if (classList.contains('handler') && classList.contains('left')) {
        action = 'resizeLeft';
      } else if (classList.contains('handler') && classList.contains('right')) {
        action = 'resizeRight';
      }

      this['_' + action](renderingContext, shape, datum, dx, dy, target);
    }
  }, {
    key: '_move',
    value: function _move(renderingContext, shape, datum, dx, dy, target) {
      var layerHeight = renderingContext.height;
      // current values
      var x = renderingContext.timeToPixel(shape.x(datum));
      var y = renderingContext.valueToPixel(shape.y(datum));
      var height = renderingContext.valueToPixel(shape.height(datum));
      // target values
      var targetX = Math.max(x + dx, 0);
      var targetY = y - dy;

      // lock in layer's y axis
      if (targetY < 0) {
        targetY = 0;
      } else if (targetY + height > layerHeight) {
        targetY = layerHeight - height;
      }

      shape.x(datum, renderingContext.timeToPixel.invert(targetX));
      shape.y(datum, renderingContext.valueToPixel.invert(targetY));
    }
  }, {
    key: '_resizeLeft',
    value: function _resizeLeft(renderingContext, shape, datum, dx, dy, target) {
      // current values
      var x = renderingContext.timeToPixel(shape.x(datum));
      var width = renderingContext.timeToPixel(shape.width(datum));
      // target values
      var maxTargetX = x + width;
      var targetX = x + dx < maxTargetX ? Math.max(x + dx, 0) : x;
      var targetWidth = targetX !== 0 ? Math.max(width - dx, 1) : width;

      shape.x(datum, renderingContext.timeToPixel.invert(targetX));
      shape.width(datum, renderingContext.timeToPixel.invert(targetWidth));
    }
  }, {
    key: '_resizeRight',
    value: function _resizeRight(renderingContext, shape, datum, dx, dy, target) {
      // current values
      var width = renderingContext.timeToPixel(shape.width(datum));
      // target values
      var targetWidth = Math.max(width + dx, 1);

      shape.width(datum, renderingContext.timeToPixel.invert(targetWidth));
    }
  }]);
  return SegmentBehavior;
}(_BaseBehavior3.default);

exports.default = SegmentBehavior;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlZ21lbnRCZWhhdmlvci5qcyJdLCJuYW1lcyI6WyJTZWdtZW50QmVoYXZpb3IiLCJyZW5kZXJpbmdDb250ZXh0Iiwic2hhcGUiLCJkYXR1bSIsImR4IiwiZHkiLCJ0YXJnZXQiLCJjbGFzc0xpc3QiLCJhY3Rpb24iLCJjb250YWlucyIsImxheWVySGVpZ2h0IiwiaGVpZ2h0IiwieCIsInRpbWVUb1BpeGVsIiwieSIsInZhbHVlVG9QaXhlbCIsInRhcmdldFgiLCJNYXRoIiwibWF4IiwidGFyZ2V0WSIsImludmVydCIsIndpZHRoIiwibWF4VGFyZ2V0WCIsInRhcmdldFdpZHRoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFHQTs7Ozs7SUFLTUEsZTs7Ozs7Ozs7Ozt5QkFDQ0MsZ0IsRUFBa0JDLEssRUFBT0MsSyxFQUFPQyxFLEVBQUlDLEUsRUFBSUMsTSxFQUFRO0FBQ25ELFVBQU1DLFlBQVlELE9BQU9DLFNBQXpCO0FBQ0EsVUFBSUMsU0FBUyxNQUFiOztBQUVBLFVBQUlELFVBQVVFLFFBQVYsQ0FBbUIsU0FBbkIsS0FBaUNGLFVBQVVFLFFBQVYsQ0FBbUIsTUFBbkIsQ0FBckMsRUFBaUU7QUFDL0RELGlCQUFTLFlBQVQ7QUFDRCxPQUZELE1BRU8sSUFBSUQsVUFBVUUsUUFBVixDQUFtQixTQUFuQixLQUFpQ0YsVUFBVUUsUUFBVixDQUFtQixPQUFuQixDQUFyQyxFQUFrRTtBQUN2RUQsaUJBQVMsYUFBVDtBQUNEOztBQUVELGlCQUFTQSxNQUFULEVBQW1CUCxnQkFBbkIsRUFBcUNDLEtBQXJDLEVBQTRDQyxLQUE1QyxFQUFtREMsRUFBbkQsRUFBdURDLEVBQXZELEVBQTJEQyxNQUEzRDtBQUNEOzs7MEJBRUtMLGdCLEVBQWtCQyxLLEVBQU9DLEssRUFBT0MsRSxFQUFJQyxFLEVBQUlDLE0sRUFBUTtBQUNwRCxVQUFNSSxjQUFjVCxpQkFBaUJVLE1BQXJDO0FBQ0E7QUFDQSxVQUFNQyxJQUFJWCxpQkFBaUJZLFdBQWpCLENBQTZCWCxNQUFNVSxDQUFOLENBQVFULEtBQVIsQ0FBN0IsQ0FBVjtBQUNBLFVBQU1XLElBQUliLGlCQUFpQmMsWUFBakIsQ0FBOEJiLE1BQU1ZLENBQU4sQ0FBUVgsS0FBUixDQUE5QixDQUFWO0FBQ0EsVUFBTVEsU0FBU1YsaUJBQWlCYyxZQUFqQixDQUE4QmIsTUFBTVMsTUFBTixDQUFhUixLQUFiLENBQTlCLENBQWY7QUFDQTtBQUNBLFVBQUlhLFVBQVVDLEtBQUtDLEdBQUwsQ0FBU04sSUFBSVIsRUFBYixFQUFpQixDQUFqQixDQUFkO0FBQ0EsVUFBSWUsVUFBVUwsSUFBSVQsRUFBbEI7O0FBRUE7QUFDQSxVQUFJYyxVQUFVLENBQWQsRUFBaUI7QUFDZkEsa0JBQVUsQ0FBVjtBQUNELE9BRkQsTUFFTyxJQUFJQSxVQUFVUixNQUFWLEdBQW1CRCxXQUF2QixFQUFvQztBQUN6Q1Msa0JBQVVULGNBQWNDLE1BQXhCO0FBQ0Q7O0FBRURULFlBQU1VLENBQU4sQ0FBUVQsS0FBUixFQUFlRixpQkFBaUJZLFdBQWpCLENBQTZCTyxNQUE3QixDQUFvQ0osT0FBcEMsQ0FBZjtBQUNBZCxZQUFNWSxDQUFOLENBQVFYLEtBQVIsRUFBZUYsaUJBQWlCYyxZQUFqQixDQUE4QkssTUFBOUIsQ0FBcUNELE9BQXJDLENBQWY7QUFDRDs7O2dDQUVXbEIsZ0IsRUFBa0JDLEssRUFBT0MsSyxFQUFPQyxFLEVBQUlDLEUsRUFBSUMsTSxFQUFRO0FBQzFEO0FBQ0EsVUFBTU0sSUFBUVgsaUJBQWlCWSxXQUFqQixDQUE2QlgsTUFBTVUsQ0FBTixDQUFRVCxLQUFSLENBQTdCLENBQWQ7QUFDQSxVQUFNa0IsUUFBUXBCLGlCQUFpQlksV0FBakIsQ0FBNkJYLE1BQU1tQixLQUFOLENBQVlsQixLQUFaLENBQTdCLENBQWQ7QUFDQTtBQUNBLFVBQUltQixhQUFjVixJQUFJUyxLQUF0QjtBQUNBLFVBQUlMLFVBQWNKLElBQUlSLEVBQUosR0FBU2tCLFVBQVQsR0FBc0JMLEtBQUtDLEdBQUwsQ0FBU04sSUFBSVIsRUFBYixFQUFpQixDQUFqQixDQUF0QixHQUE0Q1EsQ0FBOUQ7QUFDQSxVQUFJVyxjQUFjUCxZQUFZLENBQVosR0FBZ0JDLEtBQUtDLEdBQUwsQ0FBU0csUUFBUWpCLEVBQWpCLEVBQXFCLENBQXJCLENBQWhCLEdBQTBDaUIsS0FBNUQ7O0FBRUFuQixZQUFNVSxDQUFOLENBQVFULEtBQVIsRUFBZUYsaUJBQWlCWSxXQUFqQixDQUE2Qk8sTUFBN0IsQ0FBb0NKLE9BQXBDLENBQWY7QUFDQWQsWUFBTW1CLEtBQU4sQ0FBWWxCLEtBQVosRUFBbUJGLGlCQUFpQlksV0FBakIsQ0FBNkJPLE1BQTdCLENBQW9DRyxXQUFwQyxDQUFuQjtBQUNEOzs7aUNBRVl0QixnQixFQUFrQkMsSyxFQUFPQyxLLEVBQU9DLEUsRUFBSUMsRSxFQUFJQyxNLEVBQVE7QUFDM0Q7QUFDQSxVQUFNZSxRQUFRcEIsaUJBQWlCWSxXQUFqQixDQUE2QlgsTUFBTW1CLEtBQU4sQ0FBWWxCLEtBQVosQ0FBN0IsQ0FBZDtBQUNBO0FBQ0EsVUFBSW9CLGNBQWNOLEtBQUtDLEdBQUwsQ0FBU0csUUFBUWpCLEVBQWpCLEVBQXFCLENBQXJCLENBQWxCOztBQUVBRixZQUFNbUIsS0FBTixDQUFZbEIsS0FBWixFQUFtQkYsaUJBQWlCWSxXQUFqQixDQUE2Qk8sTUFBN0IsQ0FBb0NHLFdBQXBDLENBQW5CO0FBQ0Q7Ozs7O2tCQUdZdkIsZSIsImZpbGUiOiJTZWdtZW50QmVoYXZpb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUJlaGF2aW9yIGZyb20gJy4vQmFzZUJlaGF2aW9yJztcblxuXG4vKipcbiAqIERlZmluZXMgdGhlIGRlZmF1bHQgYmVoYXZpb3IgZm9yIGEgc2VnbWVudC5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1tYXJrZXIuaHRtbClcbiAqL1xuY2xhc3MgU2VnbWVudEJlaGF2aW9yIGV4dGVuZHMgQmFzZUJlaGF2aW9yIHtcbiAgZWRpdChyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgY29uc3QgY2xhc3NMaXN0ID0gdGFyZ2V0LmNsYXNzTGlzdDtcbiAgICBsZXQgYWN0aW9uID0gJ21vdmUnO1xuXG4gICAgaWYgKGNsYXNzTGlzdC5jb250YWlucygnaGFuZGxlcicpICYmIGNsYXNzTGlzdC5jb250YWlucygnbGVmdCcpKSB7XG4gICAgICBhY3Rpb24gPSAncmVzaXplTGVmdCc7XG4gICAgfSBlbHNlIGlmIChjbGFzc0xpc3QuY29udGFpbnMoJ2hhbmRsZXInKSAmJiBjbGFzc0xpc3QuY29udGFpbnMoJ3JpZ2h0JykpIHtcbiAgICAgIGFjdGlvbiA9ICdyZXNpemVSaWdodCc7XG4gICAgfVxuXG4gICAgdGhpc1tgXyR7YWN0aW9ufWBdKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpO1xuICB9XG5cbiAgX21vdmUocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IGxheWVySGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG4gICAgLy8gY3VycmVudCB2YWx1ZXNcbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS54KGRhdHVtKSk7XG4gICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHNoYXBlLnkoZGF0dW0pKTtcbiAgICBjb25zdCBoZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChzaGFwZS5oZWlnaHQoZGF0dW0pKTtcbiAgICAvLyB0YXJnZXQgdmFsdWVzXG4gICAgbGV0IHRhcmdldFggPSBNYXRoLm1heCh4ICsgZHgsIDApO1xuICAgIGxldCB0YXJnZXRZID0geSAtIGR5O1xuXG4gICAgLy8gbG9jayBpbiBsYXllcidzIHkgYXhpc1xuICAgIGlmICh0YXJnZXRZIDwgMCkge1xuICAgICAgdGFyZ2V0WSA9IDA7XG4gICAgfSBlbHNlIGlmICh0YXJnZXRZICsgaGVpZ2h0ID4gbGF5ZXJIZWlnaHQpIHtcbiAgICAgIHRhcmdldFkgPSBsYXllckhlaWdodCAtIGhlaWdodDtcbiAgICB9XG5cbiAgICBzaGFwZS54KGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRYKSk7XG4gICAgc2hhcGUueShkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFkpKTtcbiAgfVxuXG4gIF9yZXNpemVMZWZ0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICAvLyBjdXJyZW50IHZhbHVlc1xuICAgIGNvbnN0IHggICAgID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS54KGRhdHVtKSk7XG4gICAgY29uc3Qgd2lkdGggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLndpZHRoKGRhdHVtKSk7XG4gICAgLy8gdGFyZ2V0IHZhbHVlc1xuICAgIGxldCBtYXhUYXJnZXRYICA9IHggKyB3aWR0aDtcbiAgICBsZXQgdGFyZ2V0WCAgICAgPSB4ICsgZHggPCBtYXhUYXJnZXRYID8gTWF0aC5tYXgoeCArIGR4LCAwKSA6IHg7XG4gICAgbGV0IHRhcmdldFdpZHRoID0gdGFyZ2V0WCAhPT0gMCA/IE1hdGgubWF4KHdpZHRoIC0gZHgsIDEpIDogd2lkdGg7XG5cbiAgICBzaGFwZS54KGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRYKSk7XG4gICAgc2hhcGUud2lkdGgoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFdpZHRoKSk7XG4gIH1cblxuICBfcmVzaXplUmlnaHQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIC8vIGN1cnJlbnQgdmFsdWVzXG4gICAgY29uc3Qgd2lkdGggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLndpZHRoKGRhdHVtKSk7XG4gICAgLy8gdGFyZ2V0IHZhbHVlc1xuICAgIGxldCB0YXJnZXRXaWR0aCA9IE1hdGgubWF4KHdpZHRoICsgZHgsIDEpO1xuXG4gICAgc2hhcGUud2lkdGgoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFdpZHRoKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VnbWVudEJlaGF2aW9yO1xuIl19