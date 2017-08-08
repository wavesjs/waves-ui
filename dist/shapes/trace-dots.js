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
}(_baseShape2.default);

exports.default = TraceDots;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYWNlLWRvdHMuanMiXSwibmFtZXMiOlsiVHJhY2VEb3RzIiwieCIsIm1lYW4iLCJyYW5nZSIsIm1lYW5SYWRpdXMiLCJyYW5nZVJhZGl1cyIsIm1lYW5Db2xvciIsInJhbmdlQ29sb3IiLCJyZW5kZXJpbmdDb250ZXh0IiwiJGVsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50TlMiLCJucyIsIiRtZWFuIiwic2V0QXR0cmlidXRlTlMiLCJwYXJhbXMiLCJjbGFzc0xpc3QiLCJhZGQiLCIkbWF4IiwiJG1pbiIsImFwcGVuZENoaWxkIiwiZGF0dW0iLCJtZWFuUG9zIiwidmFsdWVUb1BpeGVsIiwiaGFsZlJhbmdlIiwibWF4IiwibWluIiwieFBvcyIsInRpbWVUb1BpeGVsIiwieDEiLCJ5MSIsIngyIiwieTIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUdBOzs7OztJQUtxQkEsUzs7Ozs7Ozs7OzttQ0FDSjtBQUFFLGFBQU8sWUFBUDtBQUFzQjs7O3VDQUVwQjtBQUNqQixhQUFPLEVBQUVDLEdBQUcsQ0FBTCxFQUFRQyxNQUFNLENBQWQsRUFBaUJDLE9BQU8sQ0FBeEIsRUFBUDtBQUNEOzs7bUNBRWM7QUFDYixhQUFPO0FBQ0xDLG9CQUFZLENBRFA7QUFFTEMscUJBQWEsQ0FGUjtBQUdMQyxtQkFBVyxTQUhOO0FBSUxDLG9CQUFZO0FBSlAsT0FBUDtBQU1EOzs7MkJBRU1DLGdCLEVBQWtCO0FBQ3ZCLFVBQUksS0FBS0MsR0FBVCxFQUFjO0FBQUUsZUFBTyxLQUFLQSxHQUFaO0FBQWtCO0FBQ2xDO0FBQ0EsV0FBS0EsR0FBTCxHQUFXQyxTQUFTQyxlQUFULENBQXlCLEtBQUtDLEVBQTlCLEVBQWtDLEdBQWxDLENBQVg7QUFDQTtBQUNBLFdBQUtDLEtBQUwsR0FBYUgsU0FBU0MsZUFBVCxDQUF5QixLQUFLQyxFQUE5QixFQUFrQyxRQUFsQyxDQUFiO0FBQ0EsV0FBS0MsS0FBTCxDQUFXQyxjQUFYLENBQTBC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Z0IsRUFBa0JhLEssRUFBT1EsRSxFQUFJQyxFLEVBQUlDLEUsRUFBSUMsRSxFQUFJO0FBQzlDLFVBQU0vQixJQUFJTyxpQkFBaUJvQixXQUFqQixDQUE2QixLQUFLM0IsQ0FBTCxDQUFPb0IsS0FBUCxDQUE3QixDQUFWO0FBQ0EsVUFBTW5CLE9BQU9NLGlCQUFpQmUsWUFBakIsQ0FBOEIsS0FBS3JCLElBQUwsQ0FBVW1CLEtBQVYsQ0FBOUIsQ0FBYjtBQUNBLFVBQU1sQixRQUFRSyxpQkFBaUJlLFlBQWpCLENBQThCLEtBQUtwQixLQUFMLENBQVdrQixLQUFYLENBQTlCLENBQWQ7QUFDQSxVQUFNSyxNQUFNeEIsT0FBUUMsUUFBUSxDQUE1QjtBQUNBLFVBQU1zQixNQUFNdkIsT0FBUUMsUUFBUSxDQUE1Qjs7QUFFQSxVQUFJRixJQUFJNEIsRUFBSixJQUFVNUIsSUFBSThCLEVBQWQsS0FBcUJMLE1BQU1JLEVBQU4sSUFBWUwsTUFBTU8sRUFBdkMsQ0FBSixFQUFnRDtBQUM5QyxlQUFPLElBQVA7QUFDRDs7QUFFRCxhQUFPLEtBQVA7QUFDRDs7Ozs7a0JBN0VrQmhDLFMiLCJmaWxlIjoidHJhY2UtZG90cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBkb3RzIGluIGEgdHJhY2UgdmlzdWFsaXphdGlvbiAobWVhbiAvIHJhbmdlKS5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci10cmFjZS5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFjZURvdHMgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAndHJhY2UtZG90cyc7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IHg6IDAsIG1lYW46IDAsIHJhbmdlOiAwIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1lYW5SYWRpdXM6IDMsXG4gICAgICByYW5nZVJhZGl1czogMyxcbiAgICAgIG1lYW5Db2xvcjogJyMyMzIzMjMnLFxuICAgICAgcmFuZ2VDb2xvcjogJ3N0ZWVsYmx1ZSdcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG4gICAgLy8gY29udGFpbmVyXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcbiAgICAvLyBkcmF3IG1lYW4gZG90XG4gICAgdGhpcy4kbWVhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnY2lyY2xlJyk7XG4gICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncicsIHRoaXMucGFyYW1zLm1lYW5SYWRpdXMpO1xuICAgIHRoaXMuJG1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLm1lYW5Db2xvcik7XG4gICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICd0cmFuc3BhcmVudCcpO1xuICAgIHRoaXMuJG1lYW4uY2xhc3NMaXN0LmFkZCgnbWVhbicpO1xuICAgIC8vIHJhbmdlIGRvdHMgKDAgPT4gdG9wLCAxID0+IGJvdHRvbSlcbiAgICB0aGlzLiRtYXggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2NpcmNsZScpO1xuICAgIHRoaXMuJG1heC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncicsIHRoaXMucGFyYW1zLm1lYW5SYWRpdXMpO1xuICAgIHRoaXMuJG1heC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMucmFuZ2VDb2xvcik7XG4gICAgdGhpcy4kbWF4LnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ3RyYW5zcGFyZW50Jyk7XG4gICAgdGhpcy4kbWF4LmNsYXNzTGlzdC5hZGQoJ21heCcpO1xuXG4gICAgdGhpcy4kbWluID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdjaXJjbGUnKTtcbiAgICB0aGlzLiRtaW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3InLCB0aGlzLnBhcmFtcy5tZWFuUmFkaXVzKTtcbiAgICB0aGlzLiRtaW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLnJhbmdlQ29sb3IpO1xuICAgIHRoaXMuJG1pbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICd0cmFuc3BhcmVudCcpO1xuICAgIHRoaXMuJG1pbi5jbGFzc0xpc3QuYWRkKCdtaW4nKTtcblxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJG1lYW4pO1xuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJG1heCk7XG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbWluKTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIC8vIEBUT0RPIHVzZSBhY2Nlc3NvcnNcbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgY29uc3QgbWVhbiA9IHRoaXMubWVhbihkYXR1bSk7XG4gICAgY29uc3QgcmFuZ2UgPSB0aGlzLnJhbmdlKGRhdHVtKTtcbiAgICBjb25zdCB4ID0gdGhpcy54KGRhdHVtKTtcbiAgICAvLyB5IHBvc2l0aW9uc1xuICAgIGNvbnN0IG1lYW5Qb3MgPSBgJHtyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChtZWFuKX1gO1xuICAgIHRoaXMuJG1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHttZWFuUG9zfSlgKTtcblxuICAgIGNvbnN0IGhhbGZSYW5nZSA9IHJhbmdlIC8gMjtcbiAgICBjb25zdCBtYXggPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChtZWFuICsgaGFsZlJhbmdlKTtcbiAgICBjb25zdCBtaW4gPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChtZWFuIC0gaGFsZlJhbmdlKTtcbiAgICBjb25zdCB4UG9zID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh4KTtcblxuICAgIHRoaXMuJG1heC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAke21heH0pYCk7XG4gICAgdGhpcy4kbWluLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7bWlufSlgKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3hQb3N9LCAwKWApO1xuICB9XG5cbiAgaW5BcmVhKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mikge1xuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkYXR1bSkpO1xuICAgIGNvbnN0IG1lYW4gPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLm1lYW4oZGF0dW0pKTtcbiAgICBjb25zdCByYW5nZSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMucmFuZ2UoZGF0dW0pKTtcbiAgICBjb25zdCBtaW4gPSBtZWFuIC0gKHJhbmdlIC8gMik7XG4gICAgY29uc3QgbWF4ID0gbWVhbiArIChyYW5nZSAvIDIpO1xuXG4gICAgaWYgKHggPiB4MSAmJiB4IDwgeDIgJiYgKG1pbiA+IHkxIHx8IG1heCA8IHkyKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iXX0=