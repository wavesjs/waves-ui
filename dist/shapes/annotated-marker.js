'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _marker = require('./marker');

var _marker2 = _interopRequireDefault(_marker);

/**
 * A shape to display a marker with annotation.
 *
 * [example usage](./examples/layer-marker.html)
 */

var AnnotatedMarker = (function (_Marker) {
  _inherits(AnnotatedMarker, _Marker);

  function AnnotatedMarker() {
    _classCallCheck(this, AnnotatedMarker);

    _get(Object.getPrototypeOf(AnnotatedMarker.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(AnnotatedMarker, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'annotated-marker';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      var list = _get(Object.getPrototypeOf(AnnotatedMarker.prototype), '_getAccessorList', this).call(this);
      list.text = 'default';
      return list;
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      this.$el = _get(Object.getPrototypeOf(AnnotatedMarker.prototype), 'render', this).call(this, renderingContext);
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
      _get(Object.getPrototypeOf(AnnotatedMarker.prototype), 'update', this).call(this, renderingContext, datum);

      if (this.$label.firstChild) {
        this.$label.removeChild(this.$label.firstChild);
      }

      var $text = document.createTextNode(this.text(datum));
      this.$label.appendChild($text);
    }
  }]);

  return AnnotatedMarker;
})(_marker2['default']);

exports['default'] = AnnotatedMarker;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMvYW5ub3RhdGVkLW1hcmtlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixVQUFVOzs7Ozs7Ozs7O0lBUVIsZUFBZTtZQUFmLGVBQWU7O1dBQWYsZUFBZTswQkFBZixlQUFlOzsrQkFBZixlQUFlOzs7ZUFBZixlQUFlOztXQUN0Qix3QkFBRztBQUFFLGFBQU8sa0JBQWtCLENBQUM7S0FBRTs7O1dBRTdCLDRCQUFHO0FBQ2pCLFVBQUksSUFBSSw4QkFKUyxlQUFlLGlEQUlHLENBQUM7QUFDcEMsVUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7QUFDdEIsYUFBTyxJQUFJLENBQUM7S0FDYjs7O1dBRUssZ0JBQUMsZ0JBQWdCLEVBQUU7QUFDdkIsVUFBSSxDQUFDLEdBQUcsOEJBVlMsZUFBZSx3Q0FVUixnQkFBZ0IsQ0FBQyxDQUFDO0FBQzFDLFVBQU0sTUFBTSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQzs7QUFFdkMsVUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDeEQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QyxVQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLFVBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLDhCQUE0QixNQUFNLE9BQUksQ0FBQztBQUNuRixVQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO0FBQ3BDLFVBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUM7QUFDM0MsVUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztBQUNwQyxVQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDO0FBQ3pDLFVBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQixHQUFHLE1BQU0sQ0FBQztBQUM1QyxVQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDOztBQUV0QyxVQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRWxDLGFBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztLQUNqQjs7O1dBRUssZ0JBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFO0FBQzlCLGlDQTlCaUIsZUFBZSx3Q0E4Qm5CLGdCQUFnQixFQUFFLEtBQUssRUFBRTs7QUFFdEMsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtBQUMxQixZQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO09BQ2pEOztBQUVELFVBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3hELFVBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2hDOzs7U0F0Q2tCLGVBQWU7OztxQkFBZixlQUFlIiwiZmlsZSI6InNyYy9zaGFwZXMvYW5ub3RhdGVkLW1hcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNYXJrZXIgZnJvbSAnLi9tYXJrZXInO1xuXG5cbi8qKlxuICogQSBzaGFwZSB0byBkaXNwbGF5IGEgbWFya2VyIHdpdGggYW5ub3RhdGlvbi5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1tYXJrZXIuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5ub3RhdGVkTWFya2VyIGV4dGVuZHMgTWFya2VyIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ2Fubm90YXRlZC1tYXJrZXInOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICBsZXQgbGlzdCA9IHN1cGVyLl9nZXRBY2Nlc3Nvckxpc3QoKTtcbiAgICBsaXN0LnRleHQgPSAnZGVmYXVsdCc7XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIHRoaXMuJGVsID0gc3VwZXIucmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpO1xuICAgIGNvbnN0IGhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuXG4gICAgdGhpcy4kbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3RleHQnKTtcbiAgICB0aGlzLiRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIDgpO1xuICAgIHRoaXMuJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgOCk7XG4gICAgdGhpcy4kbGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGBtYXRyaXgoMSwgMCwgMCwgLTEsIDAsICR7aGVpZ2h0fSlgKTtcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS5mb250U2l6ZSA9ICcxMHB4JztcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS5mb250RmFtaWx5ID0gJ21vbm9zcGFjZSc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUuY29sb3IgPSAnIzI0MjQyNCc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUubW96VXNlclNlbGVjdCA9ICdub25lJztcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XG5cbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRsYWJlbCk7XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0pIHtcbiAgICBzdXBlci51cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0pO1xuXG4gICAgaWYgKHRoaXMuJGxhYmVsLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHRoaXMuJGxhYmVsLnJlbW92ZUNoaWxkKHRoaXMuJGxhYmVsLmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIGNvbnN0ICR0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhpcy50ZXh0KGRhdHVtKSk7XG4gICAgdGhpcy4kbGFiZWwuYXBwZW5kQ2hpbGQoJHRleHQpO1xuICB9XG59XG4iXX0=