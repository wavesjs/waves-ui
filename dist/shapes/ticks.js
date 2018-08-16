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
 * Kind of Marker for entity oriented data. Usefull to display a grid.
 */
var Ticks = function (_BaseShape) {
  (0, _inherits3.default)(Ticks, _BaseShape);

  function Ticks() {
    (0, _classCallCheck3.default)(this, Ticks);
    return (0, _possibleConstructorReturn3.default)(this, (Ticks.__proto__ || (0, _getPrototypeOf2.default)(Ticks)).apply(this, arguments));
  }

  (0, _createClass3.default)(Ticks, [{
    key: '_getClassName',
    value: function _getClassName() {
      return 'tick';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { time: 0, focused: true, label: '' };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        color: 'steelblue',
        focusedOpacity: 0.8,
        defaultOpacity: 0.3
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      this.$el = document.createElementNS(this.ns, 'g');
      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, data) {
      var _this2 = this;

      while (this.$el.firstChild) {
        this.$el.removeChild(this.$el.firstChild);
      }

      var fragment = document.createDocumentFragment();
      var layerHeight = renderingContext.height; // valueToPixel(1);

      data.forEach(function (datum) {
        var x = renderingContext.timeToPixel(_this2.time(datum));
        var opacity = _this2.focused(datum) ? _this2.params.focusedOpacity : _this2.params.defaultOpacity;

        var height = layerHeight;

        var tick = document.createElementNS(_this2.ns, 'line');
        tick.classList.add('tick');

        tick.setAttributeNS(null, 'x1', 0);
        tick.setAttributeNS(null, 'x2', 0);
        tick.setAttributeNS(null, 'y1', 0);
        tick.setAttributeNS(null, 'y2', height);

        tick.setAttributeNS(null, 'fill', 'none');
        tick.setAttributeNS(null, 'stroke', _this2.params.color);
        tick.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        tick.setAttributeNS(null, 'transform', 'translate(' + x + ', 0)');
        tick.setAttributeNS(null, 'opacity', opacity);

        _this2.$el.appendChild(tick);

        var label = _this2.label(datum);

        if (label) {
          var $label = document.createElementNS(_this2.ns, 'text');
          $label.classList.add('label');
          var $text = document.createTextNode(label);
          $label.appendChild($text);
          $label.setAttributeNS(null, 'transform', 'matrix(1, 0, 0, -1, ' + (x + 2) + ', ' + (height + 2) + ')');
          // firefox problem here
          // $label.setAttributeNS(null, 'alignment-baseline', 'text-before-edge');
          $label.setAttributeNS(null, 'y', '10');

          $label.style.fontSize = '10px';
          $label.style.lineHeight = '10px';
          $label.style.fontFamily = 'monospace';
          $label.style.color = '#676767';
          $label.style.opacity = 0.9;
          $label.style.mozUserSelect = 'none';
          $label.style.webkitUserSelect = 'none';
          $label.style.userSelect = 'none';

          // const bg = document.createElementNS(this.ns, 'rect');
          // bg.setAttributeNS(null, 'width', '100%');
          // bg.setAttributeNS(null, 'height', '100%');
          // bg.setAttributeNS(null, 'fill', '#ffffff');
          // label.appendChild(bg);

          _this2.$el.appendChild($label);
        }
      });

      this.$el.appendChild(fragment);
    }
  }]);
  return Ticks;
}(_BaseShape3.default);

exports.default = Ticks;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpY2tzLmpzIl0sIm5hbWVzIjpbIlRpY2tzIiwidGltZSIsImZvY3VzZWQiLCJsYWJlbCIsImNvbG9yIiwiZm9jdXNlZE9wYWNpdHkiLCJkZWZhdWx0T3BhY2l0eSIsInJlbmRlcmluZ0NvbnRleHQiLCIkZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsIm5zIiwiZGF0YSIsImZpcnN0Q2hpbGQiLCJyZW1vdmVDaGlsZCIsImZyYWdtZW50IiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsImxheWVySGVpZ2h0IiwiaGVpZ2h0IiwiZm9yRWFjaCIsImRhdHVtIiwieCIsInRpbWVUb1BpeGVsIiwib3BhY2l0eSIsInBhcmFtcyIsInRpY2siLCJjbGFzc0xpc3QiLCJhZGQiLCJzZXRBdHRyaWJ1dGVOUyIsImFwcGVuZENoaWxkIiwiJGxhYmVsIiwiJHRleHQiLCJjcmVhdGVUZXh0Tm9kZSIsInN0eWxlIiwiZm9udFNpemUiLCJsaW5lSGVpZ2h0IiwiZm9udEZhbWlseSIsIm1velVzZXJTZWxlY3QiLCJ3ZWJraXRVc2VyU2VsZWN0IiwidXNlclNlbGVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUE7OztJQUdNQSxLOzs7Ozs7Ozs7O29DQUNZO0FBQ2QsYUFBTyxNQUFQO0FBQ0Q7Ozt1Q0FFa0I7QUFDakIsYUFBTyxFQUFFQyxNQUFNLENBQVIsRUFBV0MsU0FBUyxJQUFwQixFQUEwQkMsT0FBTyxFQUFqQyxFQUFQO0FBQ0Q7OzttQ0FFYztBQUNiLGFBQU87QUFDTEMsZUFBTyxXQURGO0FBRUxDLHdCQUFnQixHQUZYO0FBR0xDLHdCQUFnQjtBQUhYLE9BQVA7QUFLRDs7OzJCQUVNQyxnQixFQUFrQjtBQUN2QixXQUFLQyxHQUFMLEdBQVdDLFNBQVNDLGVBQVQsQ0FBeUIsS0FBS0MsRUFBOUIsRUFBa0MsR0FBbEMsQ0FBWDtBQUNBLGFBQU8sS0FBS0gsR0FBWjtBQUNEOzs7MkJBRU1ELGdCLEVBQWtC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YixHQUEwQixNQUExQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFLL0IsR0FBTCxDQUFTcUIsV0FBVCxDQUFxQkMsTUFBckI7QUFDRDtBQUNGLE9BcEREOztBQXNEQSxXQUFLdEIsR0FBTCxDQUFTcUIsV0FBVCxDQUFxQmQsUUFBckI7QUFDRDs7Ozs7a0JBR1lmLEsiLCJmaWxlIjoidGlja3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vQmFzZVNoYXBlJztcblxuLyoqXG4gKiBLaW5kIG9mIE1hcmtlciBmb3IgZW50aXR5IG9yaWVudGVkIGRhdGEuIFVzZWZ1bGwgdG8gZGlzcGxheSBhIGdyaWQuXG4gKi9cbmNsYXNzIFRpY2tzIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgX2dldENsYXNzTmFtZSgpIHtcbiAgICByZXR1cm4gJ3RpY2snO1xuICB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyB0aW1lOiAwLCBmb2N1c2VkOiB0cnVlLCBsYWJlbDogJycgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29sb3I6ICdzdGVlbGJsdWUnLFxuICAgICAgZm9jdXNlZE9wYWNpdHk6IDAuOCxcbiAgICAgIGRlZmF1bHRPcGFjaXR5OiAwLjNcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZycpO1xuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7XG4gICAgd2hpbGUgKHRoaXMuJGVsLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHRoaXMuJGVsLnJlbW92ZUNoaWxkKHRoaXMuJGVsLmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGNvbnN0IGxheWVySGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7IC8vIHZhbHVlVG9QaXhlbCgxKTtcblxuICAgIGRhdGEuZm9yRWFjaCgoZGF0dW0pID0+IHtcbiAgICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMudGltZShkYXR1bSkpO1xuICAgICAgY29uc3Qgb3BhY2l0eSA9IHRoaXMuZm9jdXNlZChkYXR1bSkgP1xuICAgICAgICB0aGlzLnBhcmFtcy5mb2N1c2VkT3BhY2l0eSA6IHRoaXMucGFyYW1zLmRlZmF1bHRPcGFjaXR5O1xuXG4gICAgICBjb25zdCBoZWlnaHQgPSBsYXllckhlaWdodDtcblxuICAgICAgY29uc3QgdGljayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnbGluZScpO1xuICAgICAgdGljay5jbGFzc0xpc3QuYWRkKCd0aWNrJyk7XG5cbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gxJywgMCk7XG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4MicsIDApO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneTEnLCAwKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3kyJywgaGVpZ2h0KTtcblxuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICdub25lJyk7XG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5jb2xvcik7XG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3h9LCAwKWApO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnb3BhY2l0eScsIG9wYWNpdHkpO1xuXG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aWNrKTtcblxuICAgICAgY29uc3QgbGFiZWwgPSB0aGlzLmxhYmVsKGRhdHVtKTtcblxuICAgICAgaWYgKGxhYmVsKSB7XG4gICAgICAgIGNvbnN0ICRsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAndGV4dCcpO1xuICAgICAgICAkbGFiZWwuY2xhc3NMaXN0LmFkZCgnbGFiZWwnKTtcbiAgICAgICAgY29uc3QgJHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShsYWJlbCk7XG4gICAgICAgICRsYWJlbC5hcHBlbmRDaGlsZCgkdGV4dCk7XG4gICAgICAgICRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYG1hdHJpeCgxLCAwLCAwLCAtMSwgJHt4ICsgMn0sICR7aGVpZ2h0ICsgMn0pYCk7XG4gICAgICAgIC8vIGZpcmVmb3ggcHJvYmxlbSBoZXJlXG4gICAgICAgIC8vICRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnYWxpZ25tZW50LWJhc2VsaW5lJywgJ3RleHQtYmVmb3JlLWVkZ2UnKTtcbiAgICAgICAgJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgJzEwJyk7XG5cbiAgICAgICAgJGxhYmVsLnN0eWxlLmZvbnRTaXplID0gJzEwcHgnO1xuICAgICAgICAkbGFiZWwuc3R5bGUubGluZUhlaWdodCA9ICcxMHB4JztcbiAgICAgICAgJGxhYmVsLnN0eWxlLmZvbnRGYW1pbHkgPSAnbW9ub3NwYWNlJztcbiAgICAgICAgJGxhYmVsLnN0eWxlLmNvbG9yID0gJyM2NzY3NjcnO1xuICAgICAgICAkbGFiZWwuc3R5bGUub3BhY2l0eSA9IDAuOTtcbiAgICAgICAgJGxhYmVsLnN0eWxlLm1velVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICAgICRsYWJlbC5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgICAgICAkbGFiZWwuc3R5bGUudXNlclNlbGVjdCA9ICdub25lJztcblxuICAgICAgICAvLyBjb25zdCBiZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncmVjdCcpO1xuICAgICAgICAvLyBiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCAnMTAwJScpO1xuICAgICAgICAvLyBiZy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICAgICAgLy8gYmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnI2ZmZmZmZicpO1xuICAgICAgICAvLyBsYWJlbC5hcHBlbmRDaGlsZChiZyk7XG5cbiAgICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQoJGxhYmVsKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKGZyYWdtZW50KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUaWNrcztcbiJdfQ==