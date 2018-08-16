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
 * Defines the default behavior for a trace visualization.
 *
 * [example usage](./examples/layer-trace.html)
 */
var TraceBehavior = function (_BaseBehavior) {
  (0, _inherits3.default)(TraceBehavior, _BaseBehavior);

  function TraceBehavior() {
    (0, _classCallCheck3.default)(this, TraceBehavior);
    return (0, _possibleConstructorReturn3.default)(this, (TraceBehavior.__proto__ || (0, _getPrototypeOf2.default)(TraceBehavior)).apply(this, arguments));
  }

  (0, _createClass3.default)(TraceBehavior, [{
    key: 'edit',
    value: function edit(renderingContext, shape, datum, dx, dy, target) {
      if (target.classList.contains('min')) {
        this._editRange(renderingContext, shape, datum, dx, dy, 'min');
      } else if (target.classList.contains('max')) {
        this._editRange(renderingContext, shape, datum, dx, dy, 'max');
      } else {
        this._editMean(renderingContext, shape, datum, dx, dy);
      }
    }
  }, {
    key: '_editMean',
    value: function _editMean(renderingContext, shape, datum, dx, dy) {
      // work in pixel domain
      var x = renderingContext.timeToPixel(shape.x(datum));
      var y = renderingContext.valueToPixel(shape.mean(datum));

      var targetX = x + dx;
      var targetY = y - dy;

      shape.x(datum, renderingContext.timeToPixel.invert(targetX));
      shape.mean(datum, renderingContext.valueToPixel.invert(targetY));
    }
  }, {
    key: '_editRange',
    value: function _editRange(renderingContext, shape, datum, dx, dy, rangeSide) {
      var range = renderingContext.valueToPixel(shape.range(datum));

      var targetRange = rangeSide === 'min' ? range + 2 * dy : range - 2 * dy;
      targetRange = Math.max(targetRange, 0);

      shape.range(datum, renderingContext.valueToPixel.invert(targetRange));
    }
  }]);
  return TraceBehavior;
}(_BaseBehavior3.default);

exports.default = TraceBehavior;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRyYWNlQmVoYXZpb3IuanMiXSwibmFtZXMiOlsiVHJhY2VCZWhhdmlvciIsInJlbmRlcmluZ0NvbnRleHQiLCJzaGFwZSIsImRhdHVtIiwiZHgiLCJkeSIsInRhcmdldCIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiX2VkaXRSYW5nZSIsIl9lZGl0TWVhbiIsIngiLCJ0aW1lVG9QaXhlbCIsInkiLCJ2YWx1ZVRvUGl4ZWwiLCJtZWFuIiwidGFyZ2V0WCIsInRhcmdldFkiLCJpbnZlcnQiLCJyYW5nZVNpZGUiLCJyYW5nZSIsInRhcmdldFJhbmdlIiwiTWF0aCIsIm1heCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0E7Ozs7O0lBS01BLGE7Ozs7Ozs7Ozs7eUJBQ0NDLGdCLEVBQWtCQyxLLEVBQU9DLEssRUFBT0MsRSxFQUFJQyxFLEVBQUlDLE0sRUFBUTtBQUNuRCxVQUFJQSxPQUFPQyxTQUFQLENBQWlCQyxRQUFqQixDQUEwQixLQUExQixDQUFKLEVBQXNDO0FBQ3BDLGFBQUtDLFVBQUwsQ0FBZ0JSLGdCQUFoQixFQUFrQ0MsS0FBbEMsRUFBeUNDLEtBQXpDLEVBQWdEQyxFQUFoRCxFQUFvREMsRUFBcEQsRUFBd0QsS0FBeEQ7QUFDRCxPQUZELE1BRU8sSUFBSUMsT0FBT0MsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEIsS0FBMUIsQ0FBSixFQUFzQztBQUMzQyxhQUFLQyxVQUFMLENBQWdCUixnQkFBaEIsRUFBa0NDLEtBQWxDLEVBQXlDQyxLQUF6QyxFQUFnREMsRUFBaEQsRUFBb0RDLEVBQXBELEVBQXdELEtBQXhEO0FBQ0QsT0FGTSxNQUVBO0FBQ0wsYUFBS0ssU0FBTCxDQUFlVCxnQkFBZixFQUFpQ0MsS0FBakMsRUFBd0NDLEtBQXhDLEVBQStDQyxFQUEvQyxFQUFtREMsRUFBbkQ7QUFDRDtBQUNGOzs7OEJBRVNKLGdCLEVBQWtCQyxLLEVBQU9DLEssRUFBT0MsRSxFQUFJQyxFLEVBQUk7QUFDaEQ7QUFDQSxVQUFNTSxJQUFJVixpQkFBaUJXLFdBQWpCLENBQTZCVixNQUFNUyxDQUFOLENBQVFSLEtBQVIsQ0FBN0IsQ0FBVjtBQUNBLFVBQU1VLElBQUlaLGlCQUFpQmEsWUFBakIsQ0FBOEJaLE1BQU1hLElBQU4sQ0FBV1osS0FBWCxDQUE5QixDQUFWOztBQUVBLFVBQUlhLFVBQVVMLElBQUlQLEVBQWxCO0FBQ0EsVUFBSWEsVUFBVUosSUFBSVIsRUFBbEI7O0FBRUFILFlBQU1TLENBQU4sQ0FBUVIsS0FBUixFQUFlRixpQkFBaUJXLFdBQWpCLENBQTZCTSxNQUE3QixDQUFvQ0YsT0FBcEMsQ0FBZjtBQUNBZCxZQUFNYSxJQUFOLENBQVdaLEtBQVgsRUFBa0JGLGlCQUFpQmEsWUFBakIsQ0FBOEJJLE1BQTlCLENBQXFDRCxPQUFyQyxDQUFsQjtBQUNEOzs7K0JBRVVoQixnQixFQUFrQkMsSyxFQUFPQyxLLEVBQU9DLEUsRUFBSUMsRSxFQUFJYyxTLEVBQVc7QUFDNUQsVUFBTUMsUUFBUW5CLGlCQUFpQmEsWUFBakIsQ0FBOEJaLE1BQU1rQixLQUFOLENBQVlqQixLQUFaLENBQTlCLENBQWQ7O0FBRUEsVUFBSWtCLGNBQWNGLGNBQWMsS0FBZCxHQUFzQkMsUUFBUSxJQUFJZixFQUFsQyxHQUF1Q2UsUUFBUSxJQUFJZixFQUFyRTtBQUNBZ0Isb0JBQWNDLEtBQUtDLEdBQUwsQ0FBU0YsV0FBVCxFQUFzQixDQUF0QixDQUFkOztBQUVBbkIsWUFBTWtCLEtBQU4sQ0FBWWpCLEtBQVosRUFBbUJGLGlCQUFpQmEsWUFBakIsQ0FBOEJJLE1BQTlCLENBQXFDRyxXQUFyQyxDQUFuQjtBQUNEOzs7OztrQkFHWXJCLGEiLCJmaWxlIjoiVHJhY2VCZWhhdmlvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlQmVoYXZpb3IgZnJvbSAnLi9CYXNlQmVoYXZpb3InO1xuXG5cbi8qKlxuICogRGVmaW5lcyB0aGUgZGVmYXVsdCBiZWhhdmlvciBmb3IgYSB0cmFjZSB2aXN1YWxpemF0aW9uLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLXRyYWNlLmh0bWwpXG4gKi9cbmNsYXNzIFRyYWNlQmVoYXZpb3IgZXh0ZW5kcyBCYXNlQmVoYXZpb3Ige1xuICBlZGl0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbWluJykpIHtcbiAgICAgIHRoaXMuX2VkaXRSYW5nZShyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgJ21pbicpO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbWF4JykpIHtcbiAgICAgIHRoaXMuX2VkaXRSYW5nZShyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgJ21heCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9lZGl0TWVhbihyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSk7XG4gICAgfVxuICB9XG5cbiAgX2VkaXRNZWFuKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5KSB7XG4gICAgLy8gd29yayBpbiBwaXhlbCBkb21haW5cbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS54KGRhdHVtKSk7XG4gICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHNoYXBlLm1lYW4oZGF0dW0pKTtcblxuICAgIGxldCB0YXJnZXRYID0geCArIGR4O1xuICAgIGxldCB0YXJnZXRZID0geSAtIGR5O1xuXG4gICAgc2hhcGUueChkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0WCkpO1xuICAgIHNoYXBlLm1lYW4oZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmludmVydCh0YXJnZXRZKSk7XG4gIH1cblxuICBfZWRpdFJhbmdlKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCByYW5nZVNpZGUpIHtcbiAgICBjb25zdCByYW5nZSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHNoYXBlLnJhbmdlKGRhdHVtKSk7XG5cbiAgICBsZXQgdGFyZ2V0UmFuZ2UgPSByYW5nZVNpZGUgPT09ICdtaW4nID8gcmFuZ2UgKyAyICogZHkgOiByYW5nZSAtIDIgKiBkeTtcbiAgICB0YXJnZXRSYW5nZSA9IE1hdGgubWF4KHRhcmdldFJhbmdlLCAwKTtcblxuICAgIHNoYXBlLnJhbmdlKGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbC5pbnZlcnQodGFyZ2V0UmFuZ2UpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUcmFjZUJlaGF2aW9yO1xuIl19