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

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _segment = require('./segment');

var _segment2 = _interopRequireDefault(_segment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A shape to display a segment with annotation.
 *
 * [example usage](./examples/layer-segment.html)
 */
var AnnotatedSegment = function (_Segment) {
  (0, _inherits3.default)(AnnotatedSegment, _Segment);

  function AnnotatedSegment() {
    (0, _classCallCheck3.default)(this, AnnotatedSegment);
    return (0, _possibleConstructorReturn3.default)(this, (AnnotatedSegment.__proto__ || (0, _getPrototypeOf2.default)(AnnotatedSegment)).apply(this, arguments));
  }

  (0, _createClass3.default)(AnnotatedSegment, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'annotated-segment';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      var list = (0, _get3.default)(AnnotatedSegment.prototype.__proto__ || (0, _getPrototypeOf2.default)(AnnotatedSegment.prototype), '_getAccessorList', this).call(this);
      list.text = 'default';
      return list;
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      this.$el = (0, _get3.default)(AnnotatedSegment.prototype.__proto__ || (0, _getPrototypeOf2.default)(AnnotatedSegment.prototype), 'render', this).call(this, renderingContext);
      var height = renderingContext.height;

      this.$label = document.createElementNS(this.ns, 'text');
      this.$label.setAttributeNS(null, 'x', 3);
      this.$label.setAttributeNS(null, 'y', 11);
      this.$label.setAttributeNS(null, 'transform', 'matrix(1, 0, 0, -1, 0, ' + height + ')');
      this.$label.style.fontSize = '10px';
      this.$label.style.fontFamily = 'monospace';
      this.$label.style.color = '#242424';
      this.$label.style.mozUserSelect = 'none';
      this.$label.style.webkitUserSelect = 'none';
      this.$label.style.userSelect = 'none';

      this.$el.appendChild(this.$label);

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      (0, _get3.default)(AnnotatedSegment.prototype.__proto__ || (0, _getPrototypeOf2.default)(AnnotatedSegment.prototype), 'update', this).call(this, renderingContext, datum);

      // update the TextNode inside the label
      if (this.$label.firstChild) this.$label.removeChild(this.$label.firstChild);

      var $text = document.createTextNode(this.text(datum));
      this.$label.appendChild($text);
    }
  }]);
  return AnnotatedSegment;
}(_segment2.default);

exports.default = AnnotatedSegment;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFubm90YXRlZC1zZWdtZW50LmpzIl0sIm5hbWVzIjpbIkFubm90YXRlZFNlZ21lbnQiLCJsaXN0IiwidGV4dCIsInJlbmRlcmluZ0NvbnRleHQiLCIkZWwiLCJoZWlnaHQiLCIkbGFiZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsIm5zIiwic2V0QXR0cmlidXRlTlMiLCJzdHlsZSIsImZvbnRTaXplIiwiZm9udEZhbWlseSIsImNvbG9yIiwibW96VXNlclNlbGVjdCIsIndlYmtpdFVzZXJTZWxlY3QiLCJ1c2VyU2VsZWN0IiwiYXBwZW5kQ2hpbGQiLCJkYXR1bSIsImZpcnN0Q2hpbGQiLCJyZW1vdmVDaGlsZCIsIiR0ZXh0IiwiY3JlYXRlVGV4dE5vZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFHQTs7Ozs7SUFLcUJBLGdCOzs7Ozs7Ozs7O21DQUNKO0FBQUUsYUFBTyxtQkFBUDtBQUE2Qjs7O3VDQUUzQjtBQUNqQixVQUFJQyxpS0FBSjtBQUNBQSxXQUFLQyxJQUFMLEdBQVksU0FBWjtBQUNBLGFBQU9ELElBQVA7QUFDRDs7OzJCQUVNRSxnQixFQUFrQjtBQUN2QixXQUFLQyxHQUFMLG9KQUF3QkQsZ0JBQXhCO0FBQ0EsVUFBTUUsU0FBU0YsaUJBQWlCRSxNQUFoQzs7QUFFQSxXQUFLQyxNQUFMLEdBQWNDLFNBQVNDLGVBQVQsQ0FBeUIsS0FBS0MsRUFBOUIsRUFBa0MsTUFBbEMsQ0FBZDtBQUNBLFdBQUtILE1BQUwsQ0FBWUksY0FBWixDQUEyQixJQUEzQixFQUFpQyxHQUFqQyxFQUFzQyxDQUF0QztBQUNBLFdBQUtKLE1BQUwsQ0FBWUksY0FBWixDQUEyQixJQUEzQixFQUFpQyxHQUFqQyxFQUFzQyxFQUF0QztBQUNBLFdBQUtKLE1BQUwsQ0FBWUksY0FBWixDQUEyQixJQUEzQixFQUFpQyxXQUFqQyw4QkFBd0VMLE1BQXhFO0FBQ0EsV0FBS0MsTUFBTCxDQUFZSyxLQUFaLENBQWtCQyxRQUFsQixHQUE2QixNQUE3QjtBQUNBLFdBQUtOLE1BQUwsQ0FBWUssS0FBWixDQUFrQkUsVUFBbEIsR0FBK0IsV0FBL0I7QUFDQSxXQUFLUCxNQUFMLENBQVlLLEtBQVosQ0FBa0JHLEtBQWxCLEdBQTBCLFNBQTFCO0FBQ0EsV0FBS1IsTUFBTCxDQUFZSyxLQUFaLENBQWtCSSxhQUFsQixHQUFrQyxNQUFsQztBQUNBLFdBQUtULE1BQUwsQ0FBWUssS0FBWixDQUFrQkssZ0JBQWxCLEdBQXFDLE1BQXJDO0FBQ0EsV0FBS1YsTUFBTCxDQUFZSyxLQUFaLENBQWtCTSxVQUFsQixHQUErQixNQUEvQjs7QUFFQSxXQUFLYixHQUFMLENBQVNjLFdBQVQsQ0FBcUIsS0FBS1osTUFBMUI7O0FBRUEsYUFBTyxLQUFLRixHQUFaO0FBQ0Q7OzsyQkFFTUQsZ0IsRUFBa0JnQixLLEVBQU87QUFDOUIsdUpBQWFoQixnQkFBYixFQUErQmdCLEtBQS9COztBQUVBO0FBQ0EsVUFBSSxLQUFLYixNQUFMLENBQVljLFVBQWhCLEVBQ0UsS0FBS2QsTUFBTCxDQUFZZSxXQUFaLENBQXdCLEtBQUtmLE1BQUwsQ0FBWWMsVUFBcEM7O0FBRUYsVUFBTUUsUUFBUWYsU0FBU2dCLGNBQVQsQ0FBd0IsS0FBS3JCLElBQUwsQ0FBVWlCLEtBQVYsQ0FBeEIsQ0FBZDtBQUNBLFdBQUtiLE1BQUwsQ0FBWVksV0FBWixDQUF3QkksS0FBeEI7QUFDRDs7Ozs7a0JBdENrQnRCLGdCIiwiZmlsZSI6ImFubm90YXRlZC1zZWdtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlZ21lbnQgZnJvbSAnLi9zZWdtZW50JztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIHNlZ21lbnQgd2l0aCBhbm5vdGF0aW9uLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLXNlZ21lbnQuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5ub3RhdGVkU2VnbWVudCBleHRlbmRzIFNlZ21lbnQge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnYW5ub3RhdGVkLXNlZ21lbnQnOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICBsZXQgbGlzdCA9IHN1cGVyLl9nZXRBY2Nlc3Nvckxpc3QoKTtcbiAgICBsaXN0LnRleHQgPSAnZGVmYXVsdCc7XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIHRoaXMuJGVsID0gc3VwZXIucmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpO1xuICAgIGNvbnN0IGhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuXG4gICAgdGhpcy4kbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3RleHQnKTtcbiAgICB0aGlzLiRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIDMpO1xuICAgIHRoaXMuJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgMTEpO1xuICAgIHRoaXMuJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgbWF0cml4KDEsIDAsIDAsIC0xLCAwLCAke2hlaWdodH0pYCk7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUuZm9udFNpemUgPSAnMTBweCc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUuZm9udEZhbWlseSA9ICdtb25vc3BhY2UnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLmNvbG9yID0gJyMyNDI0MjQnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLm1velVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJztcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbGFiZWwpO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgc3VwZXIudXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKTtcblxuICAgIC8vIHVwZGF0ZSB0aGUgVGV4dE5vZGUgaW5zaWRlIHRoZSBsYWJlbFxuICAgIGlmICh0aGlzLiRsYWJlbC5maXJzdENoaWxkKVxuICAgICAgdGhpcy4kbGFiZWwucmVtb3ZlQ2hpbGQodGhpcy4kbGFiZWwuZmlyc3RDaGlsZCk7XG5cbiAgICBjb25zdCAkdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMudGV4dChkYXR1bSkpO1xuICAgIHRoaXMuJGxhYmVsLmFwcGVuZENoaWxkKCR0ZXh0KTtcbiAgfVxufVxuIl19