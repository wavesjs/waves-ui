'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseShape = require('./base-shape');

var _baseShape2 = _interopRequireDefault(_baseShape);

/**
 * A shape to display a line. Its main use is as common shape to create a breakpoint visualization. (entity shape)
 */

var Line = (function (_BaseShape) {
  _inherits(Line, _BaseShape);

  function Line() {
    _classCallCheck(this, Line);

    _get(Object.getPrototypeOf(Line.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Line, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'line';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { cx: 0, cy: 0 };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return { color: '#000000' };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }

      this.$el = document.createElementNS(this.ns, 'path');
      // this.el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, data) {
      var _this = this;

      data = data.slice(0);
      data.sort(function (a, b) {
        return _this.cx(a) < _this.cx(b) ? -1 : 1;
      });

      this.$el.setAttributeNS(null, 'd', this._buildLine(renderingContext, data));
      this.$el.style.stroke = this.params.color;
      this.$el.style.fill = 'none';

      data = null;
    }

    // builds the `path.d` attribute
    // @TODO create some ShapeHelper ?
  }, {
    key: '_buildLine',
    value: function _buildLine(renderingContext, data) {
      var _this2 = this;

      if (!data.length) {
        return '';
      }
      // sort data
      var instructions = data.map(function (datum, index) {
        var x = renderingContext.timeToPixel(_this2.cx(datum));
        var y = renderingContext.valueToPixel(_this2.cy(datum)) - 0.5;
        return x + ',' + y;
      });

      return 'M' + instructions.join('L');
    }
  }]);

  return Line;
})(_baseShape2['default']);

exports['default'] = Line;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy93YXZlcy11aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUFzQixjQUFjOzs7Ozs7OztJQU1mLElBQUk7WUFBSixJQUFJOztXQUFKLElBQUk7MEJBQUosSUFBSTs7K0JBQUosSUFBSTs7O2VBQUosSUFBSTs7V0FDWCx3QkFBRztBQUFFLGFBQU8sTUFBTSxDQUFDO0tBQUU7OztXQUVqQiw0QkFBRztBQUNqQixhQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7S0FDekI7OztXQUVXLHdCQUFHO0FBQ2IsYUFBTyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQztLQUM3Qjs7O1dBRUssZ0JBQUMsZ0JBQWdCLEVBQUU7QUFDdkIsVUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO09BQUU7O0FBRWxDLFVBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUVyRCxhQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDakI7OztXQUVLLGdCQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRTs7O0FBQzdCLFVBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JCLFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQztlQUFLLE1BQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7T0FBQSxDQUFDLENBQUM7O0FBRXRELFVBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzVFLFVBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUMxQyxVQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDOztBQUU3QixVQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ2I7Ozs7OztXQUlTLG9CQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRTs7O0FBQ2pDLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQUUsZUFBTyxFQUFFLENBQUM7T0FBRTs7QUFFaEMsVUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLLEVBQUs7QUFDNUMsWUFBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLE9BQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdkQsWUFBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLE9BQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQzlELGVBQVUsQ0FBQyxTQUFJLENBQUMsQ0FBRztPQUNwQixDQUFDLENBQUM7O0FBRUgsYUFBTyxHQUFHLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNyQzs7O1NBMUNrQixJQUFJOzs7cUJBQUosSUFBSSIsImZpbGUiOiJzcmMvd2F2ZXMtdWkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgYSBsaW5lLiBJdHMgbWFpbiB1c2UgaXMgYXMgY29tbW9uIHNoYXBlIHRvIGNyZWF0ZSBhIGJyZWFrcG9pbnQgdmlzdWFsaXphdGlvbi4gKGVudGl0eSBzaGFwZSlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluZSBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdsaW5lJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgY3g6IDAsIGN5OiAwIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHsgY29sb3I6ICcjMDAwMDAwJyB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncGF0aCcpO1xuICAgIC8vIHRoaXMuZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpIHtcbiAgICBkYXRhID0gZGF0YS5zbGljZSgwKTtcbiAgICBkYXRhLnNvcnQoKGEsIGIpID0+IHRoaXMuY3goYSkgPCB0aGlzLmN4KGIpID8gLTEgOiAxKTtcblxuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgdGhpcy5fYnVpbGRMaW5lKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpKTtcbiAgICB0aGlzLiRlbC5zdHlsZS5zdHJva2UgPSB0aGlzLnBhcmFtcy5jb2xvcjtcbiAgICB0aGlzLiRlbC5zdHlsZS5maWxsID0gJ25vbmUnO1xuXG4gICAgZGF0YSA9IG51bGw7XG4gIH1cblxuICAvLyBidWlsZHMgdGhlIGBwYXRoLmRgIGF0dHJpYnV0ZVxuICAvLyBAVE9ETyBjcmVhdGUgc29tZSBTaGFwZUhlbHBlciA/XG4gIF9idWlsZExpbmUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIGlmICghZGF0YS5sZW5ndGgpIHsgcmV0dXJuICcnOyB9XG4gICAgLy8gc29ydCBkYXRhXG4gICAgbGV0IGluc3RydWN0aW9ucyA9IGRhdGEubWFwKChkYXR1bSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMuY3goZGF0dW0pKTtcbiAgICAgIGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLmN5KGRhdHVtKSkgLSAwLjU7XG4gICAgICByZXR1cm4gYCR7eH0sJHt5fWA7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gJ00nICsgaW5zdHJ1Y3Rpb25zLmpvaW4oJ0wnKTtcbiAgfVxufVxuIl19