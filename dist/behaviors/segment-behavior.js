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
}(_baseBehavior2.default);

exports.default = SegmentBehavior;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlZ21lbnQtYmVoYXZpb3IuanMiXSwibmFtZXMiOlsiU2VnbWVudEJlaGF2aW9yIiwicmVuZGVyaW5nQ29udGV4dCIsInNoYXBlIiwiZGF0dW0iLCJkeCIsImR5IiwidGFyZ2V0IiwiY2xhc3NMaXN0IiwiYWN0aW9uIiwiY29udGFpbnMiLCJsYXllckhlaWdodCIsImhlaWdodCIsIngiLCJ0aW1lVG9QaXhlbCIsInkiLCJ2YWx1ZVRvUGl4ZWwiLCJ0YXJnZXRYIiwiTWF0aCIsIm1heCIsInRhcmdldFkiLCJpbnZlcnQiLCJ3aWR0aCIsIm1heFRhcmdldFgiLCJ0YXJnZXRXaWR0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0E7Ozs7O0lBS3FCQSxlOzs7Ozs7Ozs7O3lCQUNkQyxnQixFQUFrQkMsSyxFQUFPQyxLLEVBQU9DLEUsRUFBSUMsRSxFQUFJQyxNLEVBQVE7QUFDbkQsVUFBTUMsWUFBWUQsT0FBT0MsU0FBekI7QUFDQSxVQUFJQyxTQUFTLE1BQWI7O0FBRUEsVUFBSUQsVUFBVUUsUUFBVixDQUFtQixTQUFuQixLQUFpQ0YsVUFBVUUsUUFBVixDQUFtQixNQUFuQixDQUFyQyxFQUFpRTtBQUMvREQsaUJBQVMsWUFBVDtBQUNELE9BRkQsTUFFTyxJQUFJRCxVQUFVRSxRQUFWLENBQW1CLFNBQW5CLEtBQWlDRixVQUFVRSxRQUFWLENBQW1CLE9BQW5CLENBQXJDLEVBQWtFO0FBQ3ZFRCxpQkFBUyxhQUFUO0FBQ0Q7O0FBRUQsaUJBQVNBLE1BQVQsRUFBbUJQLGdCQUFuQixFQUFxQ0MsS0FBckMsRUFBNENDLEtBQTVDLEVBQW1EQyxFQUFuRCxFQUF1REMsRUFBdkQsRUFBMkRDLE1BQTNEO0FBQ0Q7OzswQkFFS0wsZ0IsRUFBa0JDLEssRUFBT0MsSyxFQUFPQyxFLEVBQUlDLEUsRUFBSUMsTSxFQUFRO0FBQ3BELFVBQU1JLGNBQWNULGlCQUFpQlUsTUFBckM7QUFDQTtBQUNBLFVBQU1DLElBQUlYLGlCQUFpQlksV0FBakIsQ0FBNkJYLE1BQU1VLENBQU4sQ0FBUVQsS0FBUixDQUE3QixDQUFWO0FBQ0EsVUFBTVcsSUFBSWIsaUJBQWlCYyxZQUFqQixDQUE4QmIsTUFBTVksQ0FBTixDQUFRWCxLQUFSLENBQTlCLENBQVY7QUFDQSxVQUFNUSxTQUFTVixpQkFBaUJjLFlBQWpCLENBQThCYixNQUFNUyxNQUFOLENBQWFSLEtBQWIsQ0FBOUIsQ0FBZjtBQUNBO0FBQ0EsVUFBSWEsVUFBVUMsS0FBS0MsR0FBTCxDQUFTTixJQUFJUixFQUFiLEVBQWlCLENBQWpCLENBQWQ7QUFDQSxVQUFJZSxVQUFVTCxJQUFJVCxFQUFsQjs7QUFFQTtBQUNBLFVBQUljLFVBQVUsQ0FBZCxFQUFpQjtBQUNmQSxrQkFBVSxDQUFWO0FBQ0QsT0FGRCxNQUVPLElBQUlBLFVBQVVSLE1BQVYsR0FBbUJELFdBQXZCLEVBQW9DO0FBQ3pDUyxrQkFBVVQsY0FBY0MsTUFBeEI7QUFDRDs7QUFFRFQsWUFBTVUsQ0FBTixDQUFRVCxLQUFSLEVBQWVGLGlCQUFpQlksV0FBakIsQ0FBNkJPLE1BQTdCLENBQW9DSixPQUFwQyxDQUFmO0FBQ0FkLFlBQU1ZLENBQU4sQ0FBUVgsS0FBUixFQUFlRixpQkFBaUJjLFlBQWpCLENBQThCSyxNQUE5QixDQUFxQ0QsT0FBckMsQ0FBZjtBQUNEOzs7Z0NBRVdsQixnQixFQUFrQkMsSyxFQUFPQyxLLEVBQU9DLEUsRUFBSUMsRSxFQUFJQyxNLEVBQVE7QUFDMUQ7QUFDQSxVQUFNTSxJQUFRWCxpQkFBaUJZLFdBQWpCLENBQTZCWCxNQUFNVSxDQUFOLENBQVFULEtBQVIsQ0FBN0IsQ0FBZDtBQUNBLFVBQU1rQixRQUFRcEIsaUJBQWlCWSxXQUFqQixDQUE2QlgsTUFBTW1CLEtBQU4sQ0FBWWxCLEtBQVosQ0FBN0IsQ0FBZDtBQUNBO0FBQ0EsVUFBSW1CLGFBQWNWLElBQUlTLEtBQXRCO0FBQ0EsVUFBSUwsVUFBY0osSUFBSVIsRUFBSixHQUFTa0IsVUFBVCxHQUFzQkwsS0FBS0MsR0FBTCxDQUFTTixJQUFJUixFQUFiLEVBQWlCLENBQWpCLENBQXRCLEdBQTRDUSxDQUE5RDtBQUNBLFVBQUlXLGNBQWNQLFlBQVksQ0FBWixHQUFnQkMsS0FBS0MsR0FBTCxDQUFTRyxRQUFRakIsRUFBakIsRUFBcUIsQ0FBckIsQ0FBaEIsR0FBMENpQixLQUE1RDs7QUFFQW5CLFlBQU1VLENBQU4sQ0FBUVQsS0FBUixFQUFlRixpQkFBaUJZLFdBQWpCLENBQTZCTyxNQUE3QixDQUFvQ0osT0FBcEMsQ0FBZjtBQUNBZCxZQUFNbUIsS0FBTixDQUFZbEIsS0FBWixFQUFtQkYsaUJBQWlCWSxXQUFqQixDQUE2Qk8sTUFBN0IsQ0FBb0NHLFdBQXBDLENBQW5CO0FBQ0Q7OztpQ0FFWXRCLGdCLEVBQWtCQyxLLEVBQU9DLEssRUFBT0MsRSxFQUFJQyxFLEVBQUlDLE0sRUFBUTtBQUMzRDtBQUNBLFVBQU1lLFFBQVFwQixpQkFBaUJZLFdBQWpCLENBQTZCWCxNQUFNbUIsS0FBTixDQUFZbEIsS0FBWixDQUE3QixDQUFkO0FBQ0E7QUFDQSxVQUFJb0IsY0FBY04sS0FBS0MsR0FBTCxDQUFTRyxRQUFRakIsRUFBakIsRUFBcUIsQ0FBckIsQ0FBbEI7O0FBRUFGLFlBQU1tQixLQUFOLENBQVlsQixLQUFaLEVBQW1CRixpQkFBaUJZLFdBQWpCLENBQTZCTyxNQUE3QixDQUFvQ0csV0FBcEMsQ0FBbkI7QUFDRDs7Ozs7a0JBdkRrQnZCLGUiLCJmaWxlIjoic2VnbWVudC1iZWhhdmlvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlQmVoYXZpb3IgZnJvbSAnLi9iYXNlLWJlaGF2aW9yJztcblxuXG4vKipcbiAqIERlZmluZXMgdGhlIGRlZmF1bHQgYmVoYXZpb3IgZm9yIGEgc2VnbWVudC5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1tYXJrZXIuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VnbWVudEJlaGF2aW9yIGV4dGVuZHMgQmFzZUJlaGF2aW9yIHtcbiAgZWRpdChyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgY29uc3QgY2xhc3NMaXN0ID0gdGFyZ2V0LmNsYXNzTGlzdDtcbiAgICBsZXQgYWN0aW9uID0gJ21vdmUnO1xuXG4gICAgaWYgKGNsYXNzTGlzdC5jb250YWlucygnaGFuZGxlcicpICYmIGNsYXNzTGlzdC5jb250YWlucygnbGVmdCcpKSB7XG4gICAgICBhY3Rpb24gPSAncmVzaXplTGVmdCc7XG4gICAgfSBlbHNlIGlmIChjbGFzc0xpc3QuY29udGFpbnMoJ2hhbmRsZXInKSAmJiBjbGFzc0xpc3QuY29udGFpbnMoJ3JpZ2h0JykpIHtcbiAgICAgIGFjdGlvbiA9ICdyZXNpemVSaWdodCc7XG4gICAgfVxuXG4gICAgdGhpc1tgXyR7YWN0aW9ufWBdKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpO1xuICB9XG5cbiAgX21vdmUocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IGxheWVySGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG4gICAgLy8gY3VycmVudCB2YWx1ZXNcbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS54KGRhdHVtKSk7XG4gICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHNoYXBlLnkoZGF0dW0pKTtcbiAgICBjb25zdCBoZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChzaGFwZS5oZWlnaHQoZGF0dW0pKTtcbiAgICAvLyB0YXJnZXQgdmFsdWVzXG4gICAgbGV0IHRhcmdldFggPSBNYXRoLm1heCh4ICsgZHgsIDApO1xuICAgIGxldCB0YXJnZXRZID0geSAtIGR5O1xuXG4gICAgLy8gbG9jayBpbiBsYXllcidzIHkgYXhpc1xuICAgIGlmICh0YXJnZXRZIDwgMCkge1xuICAgICAgdGFyZ2V0WSA9IDA7XG4gICAgfSBlbHNlIGlmICh0YXJnZXRZICsgaGVpZ2h0ID4gbGF5ZXJIZWlnaHQpIHtcbiAgICAgIHRhcmdldFkgPSBsYXllckhlaWdodCAtIGhlaWdodDtcbiAgICB9XG5cbiAgICBzaGFwZS54KGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRYKSk7XG4gICAgc2hhcGUueShkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFkpKTtcbiAgfVxuXG4gIF9yZXNpemVMZWZ0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICAvLyBjdXJyZW50IHZhbHVlc1xuICAgIGNvbnN0IHggICAgID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS54KGRhdHVtKSk7XG4gICAgY29uc3Qgd2lkdGggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLndpZHRoKGRhdHVtKSk7XG4gICAgLy8gdGFyZ2V0IHZhbHVlc1xuICAgIGxldCBtYXhUYXJnZXRYICA9IHggKyB3aWR0aDtcbiAgICBsZXQgdGFyZ2V0WCAgICAgPSB4ICsgZHggPCBtYXhUYXJnZXRYID8gTWF0aC5tYXgoeCArIGR4LCAwKSA6IHg7XG4gICAgbGV0IHRhcmdldFdpZHRoID0gdGFyZ2V0WCAhPT0gMCA/IE1hdGgubWF4KHdpZHRoIC0gZHgsIDEpIDogd2lkdGg7XG5cbiAgICBzaGFwZS54KGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRYKSk7XG4gICAgc2hhcGUud2lkdGgoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFdpZHRoKSk7XG4gIH1cblxuICBfcmVzaXplUmlnaHQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIC8vIGN1cnJlbnQgdmFsdWVzXG4gICAgY29uc3Qgd2lkdGggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLndpZHRoKGRhdHVtKSk7XG4gICAgLy8gdGFyZ2V0IHZhbHVlc1xuICAgIGxldCB0YXJnZXRXaWR0aCA9IE1hdGgubWF4KHdpZHRoICsgZHgsIDEpO1xuXG4gICAgc2hhcGUud2lkdGgoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFdpZHRoKSk7XG4gIH1cbn1cbiJdfQ==