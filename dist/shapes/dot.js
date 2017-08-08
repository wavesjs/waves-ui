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

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A shape to display a dot.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */
var Dot = function (_BaseShape) {
  (0, _inherits3.default)(Dot, _BaseShape);

  function Dot() {
    (0, _classCallCheck3.default)(this, Dot);
    return (0, _possibleConstructorReturn3.default)(this, (Dot.__proto__ || (0, _getPrototypeOf2.default)(Dot)).apply(this, arguments));
  }

  (0, _createClass3.default)(Dot, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'dot';
    }

    // @TODO rename : confusion between accessors and meta-accessors

  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { cx: 0, cy: 0, r: 3, color: '#000000' };
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.$el) {
        return this.$el;
      }

      this.$el = document.createElementNS(this.ns, 'circle');

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      var cx = renderingContext.timeToPixel(this.cx(datum));
      var cy = renderingContext.valueToPixel(this.cy(datum));
      var r = this.r(datum);
      var color = this.color(datum);

      this.$el.setAttributeNS(null, 'transform', 'translate(' + cx + ', ' + cy + ')');
      this.$el.setAttributeNS(null, 'r', r);
      this.$el.style.fill = color;
    }

    // x1, x2, y1, y2 => in pixel domain

  }, {
    key: 'inArea',
    value: function inArea(renderingContext, datum, x1, y1, x2, y2) {
      var cx = renderingContext.timeToPixel(this.cx(datum));
      var cy = renderingContext.valueToPixel(this.cy(datum));

      if (cx > x1 && cx < x2 && cy > y1 && cy < y2) {
        return true;
      }

      return false;
    }
  }]);
  return Dot;
}(_baseShape2.default);

exports.default = Dot;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvdC5qcyJdLCJuYW1lcyI6WyJEb3QiLCJjeCIsImN5IiwiciIsImNvbG9yIiwiJGVsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50TlMiLCJucyIsInJlbmRlcmluZ0NvbnRleHQiLCJkYXR1bSIsInRpbWVUb1BpeGVsIiwidmFsdWVUb1BpeGVsIiwic2V0QXR0cmlidXRlTlMiLCJzdHlsZSIsImZpbGwiLCJ4MSIsInkxIiwieDIiLCJ5MiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0E7Ozs7O0lBS3FCQSxHOzs7Ozs7Ozs7O21DQUNKO0FBQUUsYUFBTyxLQUFQO0FBQWU7O0FBRWhDOzs7O3VDQUNtQjtBQUNqQixhQUFPLEVBQUVDLElBQUksQ0FBTixFQUFTQyxJQUFJLENBQWIsRUFBZ0JDLEdBQUcsQ0FBbkIsRUFBc0JDLE9BQU8sU0FBN0IsRUFBUDtBQUNEOzs7NkJBRVE7QUFDUCxVQUFJLEtBQUtDLEdBQVQsRUFBYztBQUFFLGVBQU8sS0FBS0EsR0FBWjtBQUFrQjs7QUFFbEMsV0FBS0EsR0FBTCxHQUFXQyxTQUFTQyxlQUFULENBQXlCLEtBQUtDLEVBQTlCLEVBQWtDLFFBQWxDLENBQVg7O0FBRUEsYUFBTyxLQUFLSCxHQUFaO0FBQ0Q7OzsyQkFFTUksZ0IsRUFBa0JDLEssRUFBTztBQUM5QixVQUFNVCxLQUFLUSxpQkFBaUJFLFdBQWpCLENBQTZCLEtBQUtWLEVBQUwsQ0FBUVMsS0FBUixDQUE3QixDQUFYO0FBQ0EsVUFBTVIsS0FBS08saUJBQWlCRyxZQUFqQixDQUE4QixLQUFLVixFQUFMLENBQVFRLEtBQVIsQ0FBOUIsQ0FBWDtBQUNBLFVBQU1QLElBQUssS0FBS0EsQ0FBTCxDQUFPTyxLQUFQLENBQVg7QUFDQSxVQUFNTixRQUFRLEtBQUtBLEtBQUwsQ0FBV00sS0FBWCxDQUFkOztBQUVBLFdBQUtMLEdBQUwsQ0FBU1EsY0FBVCxDQUF3QixJQUF4QixFQUE4QixXQUE5QixpQkFBd0RaLEVBQXhELFVBQStEQyxFQUEvRDtBQUNBLFdBQUtHLEdBQUwsQ0FBU1EsY0FBVCxDQUF3QixJQUF4QixFQUE4QixHQUE5QixFQUFtQ1YsQ0FBbkM7QUFDQSxXQUFLRSxHQUFMLENBQVNTLEtBQVQsQ0FBZUMsSUFBZixHQUFzQlgsS0FBdEI7QUFDRDs7QUFFRDs7OzsyQkFDT0ssZ0IsRUFBa0JDLEssRUFBT00sRSxFQUFJQyxFLEVBQUlDLEUsRUFBSUMsRSxFQUFJO0FBQzlDLFVBQU1sQixLQUFLUSxpQkFBaUJFLFdBQWpCLENBQTZCLEtBQUtWLEVBQUwsQ0FBUVMsS0FBUixDQUE3QixDQUFYO0FBQ0EsVUFBTVIsS0FBS08saUJBQWlCRyxZQUFqQixDQUE4QixLQUFLVixFQUFMLENBQVFRLEtBQVIsQ0FBOUIsQ0FBWDs7QUFFQSxVQUFLVCxLQUFLZSxFQUFMLElBQVdmLEtBQUtpQixFQUFqQixJQUF5QmhCLEtBQUtlLEVBQUwsSUFBV2YsS0FBS2lCLEVBQTdDLEVBQWtEO0FBQ2hELGVBQU8sSUFBUDtBQUNEOztBQUVELGFBQU8sS0FBUDtBQUNEOzs7OztrQkFyQ2tCbkIsRyIsImZpbGUiOiJkb3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgYSBkb3QuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYnJlYWtwb2ludC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3QgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnZG90JzsgfVxuXG4gIC8vIEBUT0RPIHJlbmFtZSA6IGNvbmZ1c2lvbiBiZXR3ZWVuIGFjY2Vzc29ycyBhbmQgbWV0YS1hY2Nlc3NvcnNcbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyBjeDogMCwgY3k6IDAsIHI6IDMsIGNvbG9yOiAnIzAwMDAwMCfCoH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2NpcmNsZScpO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgY29uc3QgY3ggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMuY3goZGF0dW0pKTtcbiAgICBjb25zdCBjeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMuY3koZGF0dW0pKTtcbiAgICBjb25zdCByICA9IHRoaXMucihkYXR1bSk7XG4gICAgY29uc3QgY29sb3IgPSB0aGlzLmNvbG9yKGRhdHVtKTtcblxuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7Y3h9LCAke2N5fSlgKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncicsIHIpO1xuICAgIHRoaXMuJGVsLnN0eWxlLmZpbGwgPSBjb2xvcjtcbiAgfVxuXG4gIC8vIHgxLCB4MiwgeTEsIHkyID0+IGluIHBpeGVsIGRvbWFpblxuICBpbkFyZWEocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgY29uc3QgY3ggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMuY3goZGF0dW0pKTtcbiAgICBjb25zdCBjeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMuY3koZGF0dW0pKTtcblxuICAgIGlmICgoY3ggPiB4MSAmJiBjeCA8IHgyKSAmJiAoY3kgPiB5MSAmJiBjeSA8IHkyKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iXX0=