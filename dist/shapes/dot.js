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

var _BaseShape2 = require('./BaseShape');

var _BaseShape3 = _interopRequireDefault(_BaseShape2);

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
}(_BaseShape3.default);

exports.default = Dot;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvdC5qcyJdLCJuYW1lcyI6WyJEb3QiLCJjeCIsImN5IiwiciIsImNvbG9yIiwiJGVsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50TlMiLCJucyIsInJlbmRlcmluZ0NvbnRleHQiLCJkYXR1bSIsInRpbWVUb1BpeGVsIiwidmFsdWVUb1BpeGVsIiwic2V0QXR0cmlidXRlTlMiLCJzdHlsZSIsImZpbGwiLCJ4MSIsInkxIiwieDIiLCJ5MiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0E7Ozs7O0lBS01BLEc7Ozs7Ozs7Ozs7bUNBQ1c7QUFBRSxhQUFPLEtBQVA7QUFBZTs7QUFFaEM7Ozs7dUNBQ21CO0FBQ2pCLGFBQU8sRUFBRUMsSUFBSSxDQUFOLEVBQVNDLElBQUksQ0FBYixFQUFnQkMsR0FBRyxDQUFuQixFQUFzQkMsT0FBTyxTQUE3QixFQUFQO0FBQ0Q7Ozs2QkFFUTtBQUNQLFVBQUksS0FBS0MsR0FBVCxFQUFjO0FBQUUsZUFBTyxLQUFLQSxHQUFaO0FBQWtCOztBQUVsQyxXQUFLQSxHQUFMLEdBQVdDLFNBQVNDLGVBQVQsQ0FBeUIsS0FBS0MsRUFBOUIsRUFBa0MsUUFBbEMsQ0FBWDs7QUFFQSxhQUFPLEtBQUtILEdBQVo7QUFDRDs7OzJCQUVNSSxnQixFQUFrQkMsSyxFQUFPO0FBQzlCLFVBQU1ULEtBQUtRLGlCQUFpQkUsV0FBakIsQ0FBNkIsS0FBS1YsRUFBTCxDQUFRUyxLQUFSLENBQTdCLENBQVg7QUFDQSxVQUFNUixLQUFLTyxpQkFBaUJHLFlBQWpCLENBQThCLEtBQUtWLEVBQUwsQ0FBUVEsS0FBUixDQUE5QixDQUFYO0FBQ0EsVUFBTVAsSUFBSyxLQUFLQSxDQUFMLENBQU9PLEtBQVAsQ0FBWDtBQUNBLFVBQU1OLFFBQVEsS0FBS0EsS0FBTCxDQUFXTSxLQUFYLENBQWQ7O0FBRUEsV0FBS0wsR0FBTCxDQUFTUSxjQUFULENBQXdCLElBQXhCLEVBQThCLFdBQTlCLGlCQUF3RFosRUFBeEQsVUFBK0RDLEVBQS9EO0FBQ0EsV0FBS0csR0FBTCxDQUFTUSxjQUFULENBQXdCLElBQXhCLEVBQThCLEdBQTlCLEVBQW1DVixDQUFuQztBQUNBLFdBQUtFLEdBQUwsQ0FBU1MsS0FBVCxDQUFlQyxJQUFmLEdBQXNCWCxLQUF0QjtBQUNEOztBQUVEOzs7OzJCQUNPSyxnQixFQUFrQkMsSyxFQUFPTSxFLEVBQUlDLEUsRUFBSUMsRSxFQUFJQyxFLEVBQUk7QUFDOUMsVUFBTWxCLEtBQUtRLGlCQUFpQkUsV0FBakIsQ0FBNkIsS0FBS1YsRUFBTCxDQUFRUyxLQUFSLENBQTdCLENBQVg7QUFDQSxVQUFNUixLQUFLTyxpQkFBaUJHLFlBQWpCLENBQThCLEtBQUtWLEVBQUwsQ0FBUVEsS0FBUixDQUE5QixDQUFYOztBQUVBLFVBQUtULEtBQUtlLEVBQUwsSUFBV2YsS0FBS2lCLEVBQWpCLElBQXlCaEIsS0FBS2UsRUFBTCxJQUFXZixLQUFLaUIsRUFBN0MsRUFBa0Q7QUFDaEQsZUFBTyxJQUFQO0FBQ0Q7O0FBRUQsYUFBTyxLQUFQO0FBQ0Q7Ozs7O2tCQUdZbkIsRyIsImZpbGUiOiJkb3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vQmFzZVNoYXBlJztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIGRvdC5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1icmVha3BvaW50Lmh0bWwpXG4gKi9cbmNsYXNzIERvdCBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdkb3QnOyB9XG5cbiAgLy8gQFRPRE8gcmVuYW1lIDogY29uZnVzaW9uIGJldHdlZW4gYWNjZXNzb3JzIGFuZCBtZXRhLWFjY2Vzc29yc1xuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IGN4OiAwLCBjeTogMCwgcjogMywgY29sb3I6ICcjMDAwMDAwJ8KgfTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnY2lyY2xlJyk7XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0pIHtcbiAgICBjb25zdCBjeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy5jeChkYXR1bSkpO1xuICAgIGNvbnN0IGN5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy5jeShkYXR1bSkpO1xuICAgIGNvbnN0IHIgID0gdGhpcy5yKGRhdHVtKTtcbiAgICBjb25zdCBjb2xvciA9IHRoaXMuY29sb3IoZGF0dW0pO1xuXG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHtjeH0sICR7Y3l9KWApO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdyJywgcik7XG4gICAgdGhpcy4kZWwuc3R5bGUuZmlsbCA9IGNvbG9yO1xuICB9XG5cbiAgLy8geDEsIHgyLCB5MSwgeTIgPT4gaW4gcGl4ZWwgZG9tYWluXG4gIGluQXJlYShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgeDEsIHkxLCB4MiwgeTIpIHtcbiAgICBjb25zdCBjeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy5jeChkYXR1bSkpO1xuICAgIGNvbnN0IGN5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy5jeShkYXR1bSkpO1xuXG4gICAgaWYgKChjeCA+IHgxICYmIGN4IDwgeDIpICYmIChjeSA+IHkxICYmIGN5IDwgeTIpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRG90O1xuIl19