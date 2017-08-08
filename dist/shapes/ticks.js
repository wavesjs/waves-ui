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
}(_baseShape2.default);

exports.default = Ticks;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpY2tzLmpzIl0sIm5hbWVzIjpbIlRpY2tzIiwidGltZSIsImZvY3VzZWQiLCJsYWJlbCIsImNvbG9yIiwiZm9jdXNlZE9wYWNpdHkiLCJkZWZhdWx0T3BhY2l0eSIsInJlbmRlcmluZ0NvbnRleHQiLCIkZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsIm5zIiwiZGF0YSIsImZpcnN0Q2hpbGQiLCJyZW1vdmVDaGlsZCIsImZyYWdtZW50IiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsImxheWVySGVpZ2h0IiwiaGVpZ2h0IiwiZm9yRWFjaCIsImRhdHVtIiwieCIsInRpbWVUb1BpeGVsIiwib3BhY2l0eSIsInBhcmFtcyIsInRpY2siLCJjbGFzc0xpc3QiLCJhZGQiLCJzZXRBdHRyaWJ1dGVOUyIsImFwcGVuZENoaWxkIiwiJGxhYmVsIiwiJHRleHQiLCJjcmVhdGVUZXh0Tm9kZSIsInN0eWxlIiwiZm9udFNpemUiLCJsaW5lSGVpZ2h0IiwiZm9udEZhbWlseSIsIm1velVzZXJTZWxlY3QiLCJ3ZWJraXRVc2VyU2VsZWN0IiwidXNlclNlbGVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUE7OztJQUdxQkEsSzs7Ozs7Ozs7OztvQ0FDSDtBQUNkLGFBQU8sTUFBUDtBQUNEOzs7dUNBRWtCO0FBQ2pCLGFBQU8sRUFBRUMsTUFBTSxDQUFSLEVBQVdDLFNBQVMsSUFBcEIsRUFBMEJDLE9BQU8sRUFBakMsRUFBUDtBQUNEOzs7bUNBRWM7QUFDYixhQUFPO0FBQ0xDLGVBQU8sV0FERjtBQUVMQyx3QkFBZ0IsR0FGWDtBQUdMQyx3QkFBZ0I7QUFIWCxPQUFQO0FBS0Q7OzsyQkFFTUMsZ0IsRUFBa0I7QUFDdkIsV0FBS0MsR0FBTCxHQUFXQyxTQUFTQyxlQUFULENBQXlCLEtBQUtDLEVBQTlCLEVBQWtDLEdBQWxDLENBQVg7QUFDQSxhQUFPLEtBQUtILEdBQVo7QUFDRDs7OzJCQUVNRCxnQixFQUFr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QWIsR0FBMEIsTUFBMUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBSy9CLEdBQUwsQ0FBU3FCLFdBQVQsQ0FBcUJDLE1BQXJCO0FBQ0Q7QUFDRixPQXBERDs7QUFzREEsV0FBS3RCLEdBQUwsQ0FBU3FCLFdBQVQsQ0FBcUJkLFFBQXJCO0FBQ0Q7Ozs7O2tCQXJGa0JmLEsiLCJmaWxlIjoidGlja3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cbi8qKlxuICogS2luZCBvZiBNYXJrZXIgZm9yIGVudGl0eSBvcmllbnRlZCBkYXRhLiBVc2VmdWxsIHRvIGRpc3BsYXkgYSBncmlkLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWNrcyBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIF9nZXRDbGFzc05hbWUoKSB7XG4gICAgcmV0dXJuICd0aWNrJztcbiAgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgdGltZTogMCwgZm9jdXNlZDogdHJ1ZSwgbGFiZWw6ICcnIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbG9yOiAnc3RlZWxibHVlJyxcbiAgICAgIGZvY3VzZWRPcGFjaXR5OiAwLjgsXG4gICAgICBkZWZhdWx0T3BhY2l0eTogMC4zXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIHdoaWxlICh0aGlzLiRlbC5maXJzdENoaWxkKSB7XG4gICAgICB0aGlzLiRlbC5yZW1vdmVDaGlsZCh0aGlzLiRlbC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICBjb25zdCBsYXllckhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0OyAvLyB2YWx1ZVRvUGl4ZWwoMSk7XG5cbiAgICBkYXRhLmZvckVhY2goKGRhdHVtKSA9PiB7XG4gICAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLnRpbWUoZGF0dW0pKTtcbiAgICAgIGNvbnN0IG9wYWNpdHkgPSB0aGlzLmZvY3VzZWQoZGF0dW0pID9cbiAgICAgICAgdGhpcy5wYXJhbXMuZm9jdXNlZE9wYWNpdHkgOiB0aGlzLnBhcmFtcy5kZWZhdWx0T3BhY2l0eTtcblxuICAgICAgY29uc3QgaGVpZ2h0ID0gbGF5ZXJIZWlnaHQ7XG5cbiAgICAgIGNvbnN0IHRpY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2xpbmUnKTtcbiAgICAgIHRpY2suY2xhc3NMaXN0LmFkZCgndGljaycpO1xuXG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4MScsIDApO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneDInLCAwKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3kxJywgMCk7XG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5MicsIGhlaWdodCk7XG5cbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnbm9uZScpO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMuY29sb3IpO1xuICAgICAgdGljay5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHt4fSwgMClgKTtcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlTlMobnVsbCwgJ29wYWNpdHknLCBvcGFjaXR5KTtcblxuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGljayk7XG5cbiAgICAgIGNvbnN0IGxhYmVsID0gdGhpcy5sYWJlbChkYXR1bSk7XG5cbiAgICAgIGlmIChsYWJlbCkge1xuICAgICAgICBjb25zdCAkbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3RleHQnKTtcbiAgICAgICAgJGxhYmVsLmNsYXNzTGlzdC5hZGQoJ2xhYmVsJyk7XG4gICAgICAgIGNvbnN0ICR0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGFiZWwpO1xuICAgICAgICAkbGFiZWwuYXBwZW5kQ2hpbGQoJHRleHQpO1xuICAgICAgICAkbGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGBtYXRyaXgoMSwgMCwgMCwgLTEsICR7eCArIDJ9LCAke2hlaWdodCArIDJ9KWApO1xuICAgICAgICAvLyBmaXJlZm94IHByb2JsZW0gaGVyZVxuICAgICAgICAvLyAkbGFiZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2FsaWdubWVudC1iYXNlbGluZScsICd0ZXh0LWJlZm9yZS1lZGdlJyk7XG4gICAgICAgICRsYWJlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsICcxMCcpO1xuXG4gICAgICAgICRsYWJlbC5zdHlsZS5mb250U2l6ZSA9ICcxMHB4JztcbiAgICAgICAgJGxhYmVsLnN0eWxlLmxpbmVIZWlnaHQgPSAnMTBweCc7XG4gICAgICAgICRsYWJlbC5zdHlsZS5mb250RmFtaWx5ID0gJ21vbm9zcGFjZSc7XG4gICAgICAgICRsYWJlbC5zdHlsZS5jb2xvciA9ICcjNjc2NzY3JztcbiAgICAgICAgJGxhYmVsLnN0eWxlLm9wYWNpdHkgPSAwLjk7XG4gICAgICAgICRsYWJlbC5zdHlsZS5tb3pVc2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgICAgICAkbGFiZWwuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJztcbiAgICAgICAgJGxhYmVsLnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XG5cbiAgICAgICAgLy8gY29uc3QgYmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3JlY3QnKTtcbiAgICAgICAgLy8gYmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgJzEwMCUnKTtcbiAgICAgICAgLy8gYmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgICAgIC8vIGJnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJyNmZmZmZmYnKTtcbiAgICAgICAgLy8gbGFiZWwuYXBwZW5kQ2hpbGQoYmcpO1xuXG4gICAgICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKCRsYWJlbCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG4gIH1cbn1cbiJdfQ==