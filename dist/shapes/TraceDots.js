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
 * A shape to display dots in a trace visualization (mean / range).
 *
 * [example usage](./examples/layer-trace.html)
 */
var TraceDots = function (_BaseShape) {
  (0, _inherits3.default)(TraceDots, _BaseShape);

  function TraceDots() {
    (0, _classCallCheck3.default)(this, TraceDots);
    return (0, _possibleConstructorReturn3.default)(this, (TraceDots.__proto__ || (0, _getPrototypeOf2.default)(TraceDots)).apply(this, arguments));
  }

  (0, _createClass3.default)(TraceDots, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'trace-dots';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { x: 0, mean: 0, range: 0 };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        meanRadius: 3,
        rangeRadius: 3,
        meanColor: '#232323',
        rangeColor: 'steelblue'
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }
      // container
      this.$el = document.createElementNS(this.ns, 'g');
      // draw mean dot
      this.$mean = document.createElementNS(this.ns, 'circle');
      this.$mean.setAttributeNS(null, 'r', this.params.meanRadius);
      this.$mean.setAttributeNS(null, 'stroke', this.params.meanColor);
      this.$mean.setAttributeNS(null, 'fill', 'transparent');
      this.$mean.classList.add('mean');
      // range dots (0 => top, 1 => bottom)
      this.$max = document.createElementNS(this.ns, 'circle');
      this.$max.setAttributeNS(null, 'r', this.params.meanRadius);
      this.$max.setAttributeNS(null, 'stroke', this.params.rangeColor);
      this.$max.setAttributeNS(null, 'fill', 'transparent');
      this.$max.classList.add('max');

      this.$min = document.createElementNS(this.ns, 'circle');
      this.$min.setAttributeNS(null, 'r', this.params.meanRadius);
      this.$min.setAttributeNS(null, 'stroke', this.params.rangeColor);
      this.$min.setAttributeNS(null, 'fill', 'transparent');
      this.$min.classList.add('min');

      this.$el.appendChild(this.$mean);
      this.$el.appendChild(this.$max);
      this.$el.appendChild(this.$min);

      return this.$el;
    }

    // @TODO use accessors

  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      var mean = this.mean(datum);
      var range = this.range(datum);
      var x = this.x(datum);
      // y positions
      var meanPos = '' + renderingContext.valueToPixel(mean);
      this.$mean.setAttributeNS(null, 'transform', 'translate(0, ' + meanPos + ')');

      var halfRange = range / 2;
      var max = renderingContext.valueToPixel(mean + halfRange);
      var min = renderingContext.valueToPixel(mean - halfRange);
      var xPos = renderingContext.timeToPixel(x);

      this.$max.setAttributeNS(null, 'transform', 'translate(0, ' + max + ')');
      this.$min.setAttributeNS(null, 'transform', 'translate(0, ' + min + ')');
      this.$el.setAttributeNS(null, 'transform', 'translate(' + xPos + ', 0)');
    }
  }, {
    key: 'inArea',
    value: function inArea(renderingContext, datum, x1, y1, x2, y2) {
      var x = renderingContext.timeToPixel(this.x(datum));
      var mean = renderingContext.valueToPixel(this.mean(datum));
      var range = renderingContext.valueToPixel(this.range(datum));
      var min = mean - range / 2;
      var max = mean + range / 2;

      if (x > x1 && x < x2 && (min > y1 || max < y2)) {
        return true;
      }

      return false;
    }
  }]);
  return TraceDots;
}(_BaseShape3.default);

exports.default = TraceDots;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRyYWNlRG90cy5qcyJdLCJuYW1lcyI6WyJUcmFjZURvdHMiLCJ4IiwibWVhbiIsInJhbmdlIiwibWVhblJhZGl1cyIsInJhbmdlUmFkaXVzIiwibWVhbkNvbG9yIiwicmFuZ2VDb2xvciIsInJlbmRlcmluZ0NvbnRleHQiLCIkZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsIm5zIiwiJG1lYW4iLCJzZXRBdHRyaWJ1dGVOUyIsInBhcmFtcyIsImNsYXNzTGlzdCIsImFkZCIsIiRtYXgiLCIkbWluIiwiYXBwZW5kQ2hpbGQiLCJkYXR1bSIsIm1lYW5Qb3MiLCJ2YWx1ZVRvUGl4ZWwiLCJoYWxmUmFuZ2UiLCJtYXgiLCJtaW4iLCJ4UG9zIiwidGltZVRvUGl4ZWwiLCJ4MSIsInkxIiwieDIiLCJ5MiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0E7Ozs7O0lBS01BLFM7Ozs7Ozs7Ozs7bUNBQ1c7QUFBRSxhQUFPLFlBQVA7QUFBc0I7Ozt1Q0FFcEI7QUFDakIsYUFBTyxFQUFFQyxHQUFHLENBQUwsRUFBUUMsTUFBTSxDQUFkLEVBQWlCQyxPQUFPLENBQXhCLEVBQVA7QUFDRDs7O21DQUVjO0FBQ2IsYUFBTztBQUNMQyxvQkFBWSxDQURQO0FBRUxDLHFCQUFhLENBRlI7QUFHTEMsbUJBQVcsU0FITjtBQUlMQyxvQkFBWTtBQUpQLE9BQVA7QUFNRDs7OzJCQUVNQyxnQixFQUFrQjtBQUN2QixVQUFJLEtBQUtDLEdBQVQsRUFBYztBQUFFLGVBQU8sS0FBS0EsR0FBWjtBQUFrQjtBQUNsQztBQUNBLFdBQUtBLEdBQUwsR0FBV0MsU0FBU0MsZUFBVCxDQUF5QixLQUFLQyxFQUE5QixFQUFrQyxHQUFsQyxDQUFYO0FBQ0E7QUFDQSxXQUFLQyxLQUFMLEdBQWFILFNBQVNDLGVBQVQsQ0FBeUIsS0FBS0MsRUFBOUIsRUFBa0MsUUFBbEMsQ0FBYjtBQUNBLFdBQUtDLEtBQUwsQ0FBV0MsY0FBWCxDQUEwQixJ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LEVBQWtCYSxLLEVBQU9RLEUsRUFBSUMsRSxFQUFJQyxFLEVBQUlDLEUsRUFBSTtBQUM5QyxVQUFNL0IsSUFBSU8saUJBQWlCb0IsV0FBakIsQ0FBNkIsS0FBSzNCLENBQUwsQ0FBT29CLEtBQVAsQ0FBN0IsQ0FBVjtBQUNBLFVBQU1uQixPQUFPTSxpQkFBaUJlLFlBQWpCLENBQThCLEtBQUtyQixJQUFMLENBQVVtQixLQUFWLENBQTlCLENBQWI7QUFDQSxVQUFNbEIsUUFBUUssaUJBQWlCZSxZQUFqQixDQUE4QixLQUFLcEIsS0FBTCxDQUFXa0IsS0FBWCxDQUE5QixDQUFkO0FBQ0EsVUFBTUssTUFBTXhCLE9BQVFDLFFBQVEsQ0FBNUI7QUFDQSxVQUFNc0IsTUFBTXZCLE9BQVFDLFFBQVEsQ0FBNUI7O0FBRUEsVUFBSUYsSUFBSTRCLEVBQUosSUFBVTVCLElBQUk4QixFQUFkLEtBQXFCTCxNQUFNSSxFQUFOLElBQVlMLE1BQU1PLEVBQXZDLENBQUosRUFBZ0Q7QUFDOUMsZUFBTyxJQUFQO0FBQ0Q7O0FBRUQsYUFBTyxLQUFQO0FBQ0Q7Ozs7O2tCQUdZaEMsUyIsImZpbGUiOiJUcmFjZURvdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vQmFzZVNoYXBlJztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBkb3RzIGluIGEgdHJhY2UgdmlzdWFsaXphdGlvbiAobWVhbiAvIHJhbmdlKS5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci10cmFjZS5odG1sKVxuICovXG5jbGFzcyBUcmFjZURvdHMgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAndHJhY2UtZG90cyc7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IHg6IDAsIG1lYW46IDAsIHJhbmdlOiAwIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lYW5SYWRpdXM6IDMsXG4gICAgICByYW5nZVJhZGl1czogMyxcbiAgICAgIG1lYW5Db2xvcjogJyMyMzIzMjMnLFxuICAgICAgcmFuZ2VDb2xvcjogJ3N0ZWVsYmx1ZSdcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG4gICAgLy8gY29udGFpbmVyXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcbiAgICAvLyBkcmF3IG1lYW4gZG90XG4gICAgdGhpcy4kbWVhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnY2lyY2xlJyk7XG4gICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncicsIHRoaXMucGFyYW1zLm1lYW5SYWRpdXMpO1xuICAgIHRoaXMuJG1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLm1lYW5Db2xvcik7XG4gICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICd0cmFuc3BhcmVudCcpO1xuICAgIHRoaXMuJG1lYW4uY2xhc3NMaXN0LmFkZCgnbWVhbicpO1xuICAgIC8vIHJhbmdlIGRvdHMgKDAgPT4gdG9wLCAxID0+IGJvdHRvbSlcbiAgICB0aGlzLiRtYXggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2NpcmNsZScpO1xuICAgIHRoaXMuJG1heC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncicsIHRoaXMucGFyYW1zLm1lYW5SYWRpdXMpO1xuICAgIHRoaXMuJG1heC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMucmFuZ2VDb2xvcik7XG4gICAgdGhpcy4kbWF4LnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ3RyYW5zcGFyZW50Jyk7XG4gICAgdGhpcy4kbWF4LmNsYXNzTGlzdC5hZGQoJ21heCcpO1xuXG4gICAgdGhpcy4kbWluID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdjaXJjbGUnKTtcbiAgICB0aGlzLiRtaW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3InLCB0aGlzLnBhcmFtcy5tZWFuUmFkaXVzKTtcbiAgICB0aGlzLiRtaW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLnJhbmdlQ29sb3IpO1xuICAgIHRoaXMuJG1pbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICd0cmFuc3BhcmVudCcpO1xuICAgIHRoaXMuJG1pbi5jbGFzc0xpc3QuYWRkKCdtaW4nKTtcblxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJG1lYW4pO1xuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJG1heCk7XG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbWluKTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIC8vIEBUT0RPIHVzZSBhY2Nlc3NvcnNcbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgY29uc3QgbWVhbiA9IHRoaXMubWVhbihkYXR1bSk7XG4gICAgY29uc3QgcmFuZ2UgPSB0aGlzLnJhbmdlKGRhdHVtKTtcbiAgICBjb25zdCB4ID0gdGhpcy54KGRhdHVtKTtcbiAgICAvLyB5IHBvc2l0aW9uc1xuICAgIGNvbnN0IG1lYW5Qb3MgPSBgJHtyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChtZWFuKX1gO1xuICAgIHRoaXMuJG1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHttZWFuUG9zfSlgKTtcblxuICAgIGNvbnN0IGhhbGZSYW5nZSA9IHJhbmdlIC8gMjtcbiAgICBjb25zdCBtYXggPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChtZWFuICsgaGFsZlJhbmdlKTtcbiAgICBjb25zdCBtaW4gPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChtZWFuIC0gaGFsZlJhbmdlKTtcbiAgICBjb25zdCB4UG9zID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh4KTtcblxuICAgIHRoaXMuJG1heC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke21heH0pYCk7XG4gICAgdGhpcy4kbWluLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7bWlufSlgKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3hQb3N9LCAwKWApO1xuICB9XG5cbiAgaW5BcmVhKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mikge1xuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkYXR1bSkpO1xuICAgIGNvbnN0IG1lYW4gPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLm1lYW4oZGF0dW0pKTtcbiAgICBjb25zdCByYW5nZSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMucmFuZ2UoZGF0dW0pKTtcbiAgICBjb25zdCBtaW4gPSBtZWFuIC0gKHJhbmdlIC8gMik7XG4gICAgY29uc3QgbWF4ID0gbWVhbiArIChyYW5nZSAvIDIpO1xuXG4gICAgaWYgKHggPiB4MSAmJiB4IDwgeDIgJiYgKG1pbiA+IHkxIHx8IG1heCA8IHkyKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRyYWNlRG90cztcbiJdfQ==