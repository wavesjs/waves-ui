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

var _marker = require('./marker');

var _marker2 = _interopRequireDefault(_marker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A shape to display a marker with annotation.
 *
 * [example usage](./examples/layer-marker.html)
 */
var AnnotatedMarker = function (_Marker) {
  (0, _inherits3.default)(AnnotatedMarker, _Marker);

  function AnnotatedMarker() {
    (0, _classCallCheck3.default)(this, AnnotatedMarker);
    return (0, _possibleConstructorReturn3.default)(this, (AnnotatedMarker.__proto__ || (0, _getPrototypeOf2.default)(AnnotatedMarker)).apply(this, arguments));
  }

  (0, _createClass3.default)(AnnotatedMarker, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'annotated-marker';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      var list = (0, _get3.default)(AnnotatedMarker.prototype.__proto__ || (0, _getPrototypeOf2.default)(AnnotatedMarker.prototype), '_getAccessorList', this).call(this);
      list.text = 'default';
      return list;
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      this.$el = (0, _get3.default)(AnnotatedMarker.prototype.__proto__ || (0, _getPrototypeOf2.default)(AnnotatedMarker.prototype), 'render', this).call(this, renderingContext);
      var height = renderingContext.height;

      this.$label = document.createElementNS(this.ns, 'text');
      this.$label.setAttributeNS(null, 'x', 8);
      this.$label.setAttributeNS(null, 'y', 8);
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
      (0, _get3.default)(AnnotatedMarker.prototype.__proto__ || (0, _getPrototypeOf2.default)(AnnotatedMarker.prototype), 'update', this).call(this, renderingContext, datum);

      if (this.$label.firstChild) {
        this.$label.removeChild(this.$label.firstChild);
      }

      var $text = document.createTextNode(this.text(datum));
      this.$label.appendChild($text);
    }
  }]);
  return AnnotatedMarker;
}(_marker2.default);

exports.default = AnnotatedMarker;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFubm90YXRlZC1tYXJrZXIuanMiXSwibmFtZXMiOlsiQW5ub3RhdGVkTWFya2VyIiwibGlzdCIsInRleHQiLCJyZW5kZXJpbmdDb250ZXh0IiwiJGVsIiwiaGVpZ2h0IiwiJGxhYmVsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50TlMiLCJucyIsInNldEF0dHJpYnV0ZU5TIiwic3R5bGUiLCJmb250U2l6ZSIsImZvbnRGYW1pbHkiLCJjb2xvciIsIm1velVzZXJTZWxlY3QiLCJ3ZWJraXRVc2VyU2VsZWN0IiwidXNlclNlbGVjdCIsImFwcGVuZENoaWxkIiwiZGF0dW0iLCJmaXJzdENoaWxkIiwicmVtb3ZlQ2hpbGQiLCIkdGV4dCIsImNyZWF0ZVRleHROb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0E7Ozs7O0lBS3FCQSxlOzs7Ozs7Ozs7O21DQUNKO0FBQUUsYUFBTyxrQkFBUDtBQUE0Qjs7O3VDQUUxQjtBQUNqQixVQUFJQywrSkFBSjtBQUNBQSxXQUFLQyxJQUFMLEdBQVksU0FBWjtBQUNBLGFBQU9ELElBQVA7QUFDRDs7OzJCQUVNRSxnQixFQUFrQjtBQUN2QixXQUFLQyxHQUFMLGtKQUF3QkQsZ0JBQXhCO0FBQ0EsVUFBTUUsU0FBU0YsaUJBQWlCRSxNQUFoQzs7QUFFQSxXQUFLQyxNQUFMLEdBQWNDLFNBQVNDLGVBQVQsQ0FBeUIsS0FBS0MsRUFBOUIsRUFBa0MsTUFBbEMsQ0FBZDtBQUNBLFdBQUtILE1BQUwsQ0FBWUksY0FBWixDQUEyQixJQUEzQixFQUFpQyxHQUFqQyxFQUFzQyxDQUF0QztBQUNBLFdBQUtKLE1BQUwsQ0FBWUksY0FBWixDQUEyQixJQUEzQixFQUFpQyxHQUFqQyxFQUFzQyxDQUF0QztBQUNBLFdBQUtKLE1BQUwsQ0FBWUksY0FBWixDQUEyQixJQUEzQixFQUFpQyxXQUFqQyw4QkFBd0VMLE1BQXhFO0FBQ0EsV0FBS0MsTUFBTCxDQUFZSyxLQUFaLENBQWtCQyxRQUFsQixHQUE2QixNQUE3QjtBQUNBLFdBQUtOLE1BQUwsQ0FBWUssS0FBWixDQUFrQkUsVUFBbEIsR0FBK0IsV0FBL0I7QUFDQSxXQUFLUCxNQUFMLENBQVlLLEtBQVosQ0FBa0JHLEtBQWxCLEdBQTBCLFNBQTFCO0FBQ0EsV0FBS1IsTUFBTCxDQUFZSyxLQUFaLENBQWtCSSxhQUFsQixHQUFrQyxNQUFsQztBQUNBLFdBQUtULE1BQUwsQ0FBWUssS0FBWixDQUFrQkssZ0JBQWxCLEdBQXFDLE1BQXJDO0FBQ0EsV0FBS1YsTUFBTCxDQUFZSyxLQUFaLENBQWtCTSxVQUFsQixHQUErQixNQUEvQjs7QUFFQSxXQUFLYixHQUFMLENBQVNjLFdBQVQsQ0FBcUIsS0FBS1osTUFBMUI7O0FBRUEsYUFBTyxLQUFLRixHQUFaO0FBQ0Q7OzsyQkFFTUQsZ0IsRUFBa0JnQixLLEVBQU87QUFDOUIscUpBQWFoQixnQkFBYixFQUErQmdCLEtBQS9COztBQUVBLFVBQUksS0FBS2IsTUFBTCxDQUFZYyxVQUFoQixFQUE0QjtBQUMxQixhQUFLZCxNQUFMLENBQVllLFdBQVosQ0FBd0IsS0FBS2YsTUFBTCxDQUFZYyxVQUFwQztBQUNEOztBQUVELFVBQU1FLFFBQVFmLFNBQVNnQixjQUFULENBQXdCLEtBQUtyQixJQUFMLENBQVVpQixLQUFWLENBQXhCLENBQWQ7QUFDQSxXQUFLYixNQUFMLENBQVlZLFdBQVosQ0FBd0JJLEtBQXhCO0FBQ0Q7Ozs7O2tCQXRDa0J0QixlIiwiZmlsZSI6ImFubm90YXRlZC1tYXJrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTWFya2VyIGZyb20gJy4vbWFya2VyJztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIG1hcmtlciB3aXRoIGFubm90YXRpb24uXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItbWFya2VyLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFubm90YXRlZE1hcmtlciBleHRlbmRzIE1hcmtlciB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdhbm5vdGF0ZWQtbWFya2VyJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgbGV0IGxpc3QgPSBzdXBlci5fZ2V0QWNjZXNzb3JMaXN0KCk7XG4gICAgbGlzdC50ZXh0ID0gJ2RlZmF1bHQnO1xuICAgIHJldHVybiBsaXN0O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICB0aGlzLiRlbCA9IHN1cGVyLnJlbmRlcihyZW5kZXJpbmdDb250ZXh0KTtcbiAgICBjb25zdCBoZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcblxuICAgIHRoaXMuJGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICd0ZXh0Jyk7XG4gICAgdGhpcy4kbGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCA4KTtcbiAgICB0aGlzLiRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIDgpO1xuICAgIHRoaXMuJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgbWF0cml4KDEsIDAsIDAsIC0xLCAwLCAke2hlaWdodH0pYCk7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUuZm9udFNpemUgPSAnMTBweCc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUuZm9udEZhbWlseSA9ICdtb25vc3BhY2UnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLmNvbG9yID0gJyMyNDI0MjQnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLm1velVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJztcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbGFiZWwpO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgc3VwZXIudXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKTtcblxuICAgIGlmICh0aGlzLiRsYWJlbC5maXJzdENoaWxkKSB7XG4gICAgICB0aGlzLiRsYWJlbC5yZW1vdmVDaGlsZCh0aGlzLiRsYWJlbC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBjb25zdCAkdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMudGV4dChkYXR1bSkpO1xuICAgIHRoaXMuJGxhYmVsLmFwcGVuZENoaWxkKCR0ZXh0KTtcbiAgfVxufVxuIl19