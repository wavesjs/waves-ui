'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _segment = require('./segment');

var _segment2 = _interopRequireDefault(_segment);

/**
 * A shape to display a segment with annotation.
 */

var AnnotatedSegment = (function (_Segment) {
  _inherits(AnnotatedSegment, _Segment);

  function AnnotatedSegment() {
    _classCallCheck(this, AnnotatedSegment);

    _get(Object.getPrototypeOf(AnnotatedSegment.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(AnnotatedSegment, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'annotated-segment';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      var list = _get(Object.getPrototypeOf(AnnotatedSegment.prototype), '_getAccessorList', this).call(this);
      list.text = 'default';
      return list;
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      this.$el = _get(Object.getPrototypeOf(AnnotatedSegment.prototype), 'render', this).call(this, renderingContext);
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
      _get(Object.getPrototypeOf(AnnotatedSegment.prototype), 'update', this).call(this, renderingContext, datum);

      if (this.$label.firstChild) {
        this.$label.removeChild(this.$label.firstChild);
      }

      var $text = document.createTextNode(this.text(datum));
      this.$label.appendChild($text);
    }
  }]);

  return AnnotatedSegment;
})(_segment2['default']);

exports['default'] = AnnotatedSegment;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy93YXZlcy11aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3VCQUFvQixXQUFXOzs7Ozs7OztJQU1WLGdCQUFnQjtZQUFoQixnQkFBZ0I7O1dBQWhCLGdCQUFnQjswQkFBaEIsZ0JBQWdCOzsrQkFBaEIsZ0JBQWdCOzs7ZUFBaEIsZ0JBQWdCOztXQUN2Qix3QkFBRztBQUFFLGFBQU8sbUJBQW1CLENBQUM7S0FBRTs7O1dBRTlCLDRCQUFHO0FBQ2pCLFVBQUksSUFBSSw4QkFKUyxnQkFBZ0IsaURBSUUsQ0FBQztBQUNwQyxVQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztBQUN0QixhQUFPLElBQUksQ0FBQztLQUNiOzs7V0FFSyxnQkFBQyxnQkFBZ0IsRUFBRTtBQUN2QixVQUFJLENBQUMsR0FBRyw4QkFWUyxnQkFBZ0Isd0NBVVQsZ0JBQWdCLENBQUMsQ0FBQztBQUMxQyxVQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7O0FBRXZDLFVBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3hELFVBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMxQyxVQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyw4QkFBNEIsTUFBTSxPQUFJLENBQUM7QUFDbkYsVUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztBQUNwQyxVQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDO0FBQzNDLFVBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7QUFDcEMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQztBQUN6QyxVQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7QUFDNUMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQzs7QUFFdEMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVsQyxhQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDakI7OztXQUVLLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRTtBQUM5QixpQ0E5QmlCLGdCQUFnQix3Q0E4QnBCLGdCQUFnQixFQUFFLEtBQUssRUFBRTs7QUFFdEMsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtBQUMxQixZQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO09BQ2pEOztBQUVELFVBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3hELFVBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2hDOzs7U0F0Q2tCLGdCQUFnQjs7O3FCQUFoQixnQkFBZ0IiLCJmaWxlIjoic3JjL3dhdmVzLXVpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlZ21lbnQgZnJvbSAnLi9zZWdtZW50JztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIHNlZ21lbnQgd2l0aCBhbm5vdGF0aW9uLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbm5vdGF0ZWRTZWdtZW50IGV4dGVuZHMgU2VnbWVudCB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdhbm5vdGF0ZWQtc2VnbWVudCc7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIGxldCBsaXN0ID0gc3VwZXIuX2dldEFjY2Vzc29yTGlzdCgpO1xuICAgIGxpc3QudGV4dCA9ICdkZWZhdWx0JztcbiAgICByZXR1cm4gbGlzdDtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgdGhpcy4kZWwgPSBzdXBlci5yZW5kZXIocmVuZGVyaW5nQ29udGV4dCk7XG4gICAgY29uc3QgaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG5cbiAgICB0aGlzLiRsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAndGV4dCcpO1xuICAgIHRoaXMuJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgMyk7XG4gICAgdGhpcy4kbGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3knLCAxMSk7XG4gICAgdGhpcy4kbGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGBtYXRyaXgoMSwgMCwgMCwgLTEsIDAsICR7aGVpZ2h0fSlgKTtcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS5mb250U2l6ZSA9ICcxMHB4JztcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS5mb250RmFtaWx5ID0gJ21vbm9zcGFjZSc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUuY29sb3IgPSAnIzI0MjQyNCc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUubW96VXNlclNlbGVjdCA9ICdub25lJztcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XG5cbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRsYWJlbCk7XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0pIHtcbiAgICBzdXBlci51cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0pO1xuXG4gICAgaWYgKHRoaXMuJGxhYmVsLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHRoaXMuJGxhYmVsLnJlbW92ZUNoaWxkKHRoaXMuJGxhYmVsLmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIGNvbnN0ICR0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhpcy50ZXh0KGRhdHVtKSk7XG4gICAgdGhpcy4kbGFiZWwuYXBwZW5kQ2hpbGQoJHRleHQpO1xuICB9XG59XG4iXX0=