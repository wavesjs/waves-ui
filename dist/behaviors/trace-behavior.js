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
}(_baseBehavior2.default);

exports.default = TraceBehavior;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYWNlLWJlaGF2aW9yLmpzIl0sIm5hbWVzIjpbIlRyYWNlQmVoYXZpb3IiLCJyZW5kZXJpbmdDb250ZXh0Iiwic2hhcGUiLCJkYXR1bSIsImR4IiwiZHkiLCJ0YXJnZXQiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsIl9lZGl0UmFuZ2UiLCJfZWRpdE1lYW4iLCJ4IiwidGltZVRvUGl4ZWwiLCJ5IiwidmFsdWVUb1BpeGVsIiwibWVhbiIsInRhcmdldFgiLCJ0YXJnZXRZIiwiaW52ZXJ0IiwicmFuZ2VTaWRlIiwicmFuZ2UiLCJ0YXJnZXRSYW5nZSIsIk1hdGgiLCJtYXgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUdBOzs7OztJQUtxQkEsYTs7Ozs7Ozs7Ozt5QkFDZEMsZ0IsRUFBa0JDLEssRUFBT0MsSyxFQUFPQyxFLEVBQUlDLEUsRUFBSUMsTSxFQUFRO0FBQ25ELFVBQUlBLE9BQU9DLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCLEtBQTFCLENBQUosRUFBc0M7QUFDcEMsYUFBS0MsVUFBTCxDQUFnQlIsZ0JBQWhCLEVBQWtDQyxLQUFsQyxFQUF5Q0MsS0FBekMsRUFBZ0RDLEVBQWhELEVBQW9EQyxFQUFwRCxFQUF3RCxLQUF4RDtBQUNELE9BRkQsTUFFTyxJQUFJQyxPQUFPQyxTQUFQLENBQWlCQyxRQUFqQixDQUEwQixLQUExQixDQUFKLEVBQXNDO0FBQzNDLGFBQUtDLFVBQUwsQ0FBZ0JSLGdCQUFoQixFQUFrQ0MsS0FBbEMsRUFBeUNDLEtBQXpDLEVBQWdEQyxFQUFoRCxFQUFvREMsRUFBcEQsRUFBd0QsS0FBeEQ7QUFDRCxPQUZNLE1BRUE7QUFDTCxhQUFLSyxTQUFMLENBQWVULGdCQUFmLEVBQWlDQyxLQUFqQyxFQUF3Q0MsS0FBeEMsRUFBK0NDLEVBQS9DLEVBQW1EQyxFQUFuRDtBQUNEO0FBQ0Y7Ozs4QkFFU0osZ0IsRUFBa0JDLEssRUFBT0MsSyxFQUFPQyxFLEVBQUlDLEUsRUFBSTtBQUNoRDtBQUNBLFVBQU1NLElBQUlWLGlCQUFpQlcsV0FBakIsQ0FBNkJWLE1BQU1TLENBQU4sQ0FBUVIsS0FBUixDQUE3QixDQUFWO0FBQ0EsVUFBTVUsSUFBSVosaUJBQWlCYSxZQUFqQixDQUE4QlosTUFBTWEsSUFBTixDQUFXWixLQUFYLENBQTlCLENBQVY7O0FBRUEsVUFBSWEsVUFBVUwsSUFBSVAsRUFBbEI7QUFDQSxVQUFJYSxVQUFVSixJQUFJUixFQUFsQjs7QUFFQUgsWUFBTVMsQ0FBTixDQUFRUixLQUFSLEVBQWVGLGlCQUFpQlcsV0FBakIsQ0FBNkJNLE1BQTdCLENBQW9DRixPQUFwQyxDQUFmO0FBQ0FkLFlBQU1hLElBQU4sQ0FBV1osS0FBWCxFQUFrQkYsaUJBQWlCYSxZQUFqQixDQUE4QkksTUFBOUIsQ0FBcUNELE9BQXJDLENBQWxCO0FBQ0Q7OzsrQkFFVWhCLGdCLEVBQWtCQyxLLEVBQU9DLEssRUFBT0MsRSxFQUFJQyxFLEVBQUljLFMsRUFBVztBQUM1RCxVQUFNQyxRQUFRbkIsaUJBQWlCYSxZQUFqQixDQUE4QlosTUFBTWtCLEtBQU4sQ0FBWWpCLEtBQVosQ0FBOUIsQ0FBZDs7QUFFQSxVQUFJa0IsY0FBY0YsY0FBYyxLQUFkLEdBQXNCQyxRQUFRLElBQUlmLEVBQWxDLEdBQXVDZSxRQUFRLElBQUlmLEVBQXJFO0FBQ0FnQixvQkFBY0MsS0FBS0MsR0FBTCxDQUFTRixXQUFULEVBQXNCLENBQXRCLENBQWQ7O0FBRUFuQixZQUFNa0IsS0FBTixDQUFZakIsS0FBWixFQUFtQkYsaUJBQWlCYSxZQUFqQixDQUE4QkksTUFBOUIsQ0FBcUNHLFdBQXJDLENBQW5CO0FBQ0Q7Ozs7O2tCQTlCa0JyQixhIiwiZmlsZSI6InRyYWNlLWJlaGF2aW9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VCZWhhdmlvciBmcm9tICcuL2Jhc2UtYmVoYXZpb3InO1xuXG5cbi8qKlxuICogRGVmaW5lcyB0aGUgZGVmYXVsdCBiZWhhdmlvciBmb3IgYSB0cmFjZSB2aXN1YWxpemF0aW9uLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLXRyYWNlLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNlQmVoYXZpb3IgZXh0ZW5kcyBCYXNlQmVoYXZpb3Ige1xuICBlZGl0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbWluJykpIHtcbiAgICAgIHRoaXMuX2VkaXRSYW5nZShyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgJ21pbicpO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbWF4JykpIHtcbiAgICAgIHRoaXMuX2VkaXRSYW5nZShyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgJ21heCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9lZGl0TWVhbihyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSk7XG4gICAgfVxuICB9XG5cbiAgX2VkaXRNZWFuKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5KSB7XG4gICAgLy8gd29yayBpbiBwaXhlbCBkb21haW5cbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChzaGFwZS54KGRhdHVtKSk7XG4gICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHNoYXBlLm1lYW4oZGF0dW0pKTtcblxuICAgIGxldCB0YXJnZXRYID0geCArIGR4O1xuICAgIGxldCB0YXJnZXRZID0geSAtIGR5O1xuXG4gICAgc2hhcGUueChkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0WCkpO1xuICAgIHNoYXBlLm1lYW4oZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmludmVydCh0YXJnZXRZKSk7XG4gIH1cblxuICBfZWRpdFJhbmdlKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCByYW5nZVNpZGUpIHtcbiAgICBjb25zdCByYW5nZSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHNoYXBlLnJhbmdlKGRhdHVtKSk7XG5cbiAgICBsZXQgdGFyZ2V0UmFuZ2UgPSByYW5nZVNpZGUgPT09ICdtaW4nID8gcmFuZ2UgKyAyICogZHkgOiByYW5nZSAtIDIgKiBkeTtcbiAgICB0YXJnZXRSYW5nZSA9IE1hdGgubWF4KHRhcmdldFJhbmdlLCAwKTtcblxuICAgIHNoYXBlLnJhbmdlKGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbC5pbnZlcnQodGFyZ2V0UmFuZ2UpKTtcbiAgfVxufVxuIl19