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
 * A shape to display a marker.
 *
 * [example usage](./examples/layer-marker.html)
 */
var Marker = function (_BaseShape) {
  (0, _inherits3.default)(Marker, _BaseShape);

  function Marker() {
    (0, _classCallCheck3.default)(this, Marker);
    return (0, _possibleConstructorReturn3.default)(this, (Marker.__proto__ || (0, _getPrototypeOf2.default)(Marker)).apply(this, arguments));
  }

  (0, _createClass3.default)(Marker, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'marker';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { x: 0, color: '#ff0000', label: '' };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        handlerWidth: 7,
        handlerHeight: 10,
        displayHandlers: true,
        opacity: 1,
        color: 'red',
        displayLabels: false,
        labelWidth: 60
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) return this.$el;

      var height = renderingContext.height;

      this.$el = document.createElementNS(this.ns, 'g');
      this.$line = document.createElementNS(this.ns, 'line');

      // draw line
      this.$line.setAttributeNS(null, 'x', 0);
      this.$line.setAttributeNS(null, 'y1', 0);
      this.$line.setAttributeNS(null, 'shape-rendering', 'crispEdges');

      this.$el.appendChild(this.$line);

      if (this.params.displayHandlers) {
        this.$handler = document.createElementNS(this.ns, 'rect');

        this.$handler.setAttributeNS(null, 'x', -this.params.handlerWidth / 2);
        this.$handler.setAttributeNS(null, 'width', this.params.handlerWidth);
        this.$handler.setAttributeNS(null, 'height', this.params.handlerHeight);
        this.$handler.setAttributeNS(null, 'shape-rendering', 'crispEdges');

        this.$el.appendChild(this.$handler);
      }

      if (this.params.displayLabels) {
        // prefer html `div` over svg `text` tag because we then use the `contenteditable` property
        this.$foreignObject = document.createElementNS(this.ns, 'foreignObject');

        this.$label = document.createElement('div');
        this.$label.style.display = 'block';
        this.$label.style.width = this.params.labelWidth + 'px';
        this.$label.style.fontSize = '12px';
        this.$label.style.fontFamily = 'arial';
        this.$label.style.userSelect = 'none';
        this.$label.style.outlineWidth = '1px';

        this.$foreignObject.appendChild(this.$label);
        this.$el.appendChild(this.$foreignObject);
      }

      this.$el.style.opacity = this.params.opacity;

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      var x = renderingContext.timeToPixel(this.x(datum));
      var color = this.color(datum);
      var height = renderingContext.height;

      this.$el.setAttributeNS(null, 'transform', 'translate(' + x + ', 0)');

      this.$line.setAttributeNS(null, 'y2', height);
      this.$line.style.stroke = color;

      if (this.params.displayHandlers) {
        this.$handler.setAttributeNS(null, 'y', height - this.params.handlerHeight);
        this.$handler.style.fill = color;
      }

      if (this.params.displayLabels) {
        var matrix = 'matrix(1, 0, 0, -1, ' + this.params.handlerWidth + ', ' + (height - 2) + ')';
        this.$foreignObject.setAttributeNS(null, 'transform', matrix);
        this.$label.innerHTML = this.label(datum);
      }
    }
  }, {
    key: 'inArea',
    value: function inArea(renderingContext, datum, x1, y1, x2, y2) {
      // handlers only are selectable
      var x = renderingContext.timeToPixel(this.x(datum));
      var shapeX1 = x - (this.params.handlerWidth - 1) / 2;
      var shapeX2 = shapeX1 + this.params.handlerWidth;
      var shapeY1 = renderingContext.height - this.params.handlerHeight;
      var shapeY2 = renderingContext.height;

      var xOverlap = Math.max(0, Math.min(x2, shapeX2) - Math.max(x1, shapeX1));
      var yOverlap = Math.max(0, Math.min(y2, shapeY2) - Math.max(y1, shapeY1));
      var area = xOverlap * yOverlap;

      return area > 0;
    }
  }]);
  return Marker;
}(_BaseShape3.default);

exports.default = Marker;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hcmtlci5qcyJdLCJuYW1lcyI6WyJNYXJrZXIiLCJ4IiwiY29sb3IiLCJsYWJlbCIsImhhbmRsZXJXaWR0aCIsImhhbmRsZXJIZWlnaHQiLCJkaXNwbGF5SGFuZGxlcnMiLCJvcGFjaXR5IiwiZGlzcGxheUxhYmVscyIsImxhYmVsV2lkdGgiLCJyZW5kZXJpbmdDb250ZXh0IiwiJGVsIiwiaGVpZ2h0IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50TlMiLCJucyIsIiRsaW5lIiwic2V0QXR0cmlidXRlTlMiLCJhcHBlbmRDaGlsZCIsInBhcmFtcyIsIiRoYW5kbGVyIiwiJGZvcmVpZ25PYmplY3QiLCIkbGFiZWwiLCJjcmVhdGVFbGVtZW50Iiwic3R5bGUiLCJkaXNwbGF5Iiwid2lkdGgiLCJmb250U2l6ZSIsImZvbnRGYW1pbHkiLCJ1c2VyU2VsZWN0Iiwib3V0bGluZVdpZHRoIiwiZGF0dW0iLCJ0aW1lVG9QaXhlbCIsInN0cm9rZSIsImZpbGwiLCJtYXRyaXgiLCJpbm5lckhUTUwiLCJ4MSIsInkxIiwieDIiLCJ5MiIsInNoYXBlWDEiLCJzaGFwZVgyIiwic2hhcGVZMSIsInNoYXBlWTIiLCJ4T3ZlcmxhcCIsIk1hdGgiLCJtYXgiLCJtaW4iLCJ5T3ZlcmxhcCIsImFyZWEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUdBOzs7OztJQUtNQSxNOzs7Ozs7Ozs7O21DQUNXO0FBQUUsYUFBTyxRQUFQO0FBQWtCOzs7dUNBRWhCO0FBQ2pCLGFBQU8sRUFBRUMsR0FBRyxDQUFMLEVBQVFDLE9BQU8sU0FBZixFQUEwQkMsT0FBTyxFQUFqQyxFQUFQO0FBQ0Q7OzttQ0FFYztBQUNiLGFBQU87QUFDTEMsc0JBQWMsQ0FEVDtBQUVMQyx1QkFBZSxFQUZWO0FBR0xDLHlCQUFpQixJQUhaO0FBSUxDLGlCQUFTLENBSko7QUFLTEwsZUFBTyxLQUxGO0FBTUxNLHVCQUFlLEtBTlY7QUFPTEMsb0JBQVk7QUFQUCxPQUFQ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QUwsQ0FBWWYsWUFBdEM7QUFDQSxVQUFNdUMsVUFBVWpDLGlCQUFpQkUsTUFBakIsR0FBMEIsS0FBS08sTUFBTCxDQUFZZCxhQUF0RDtBQUNBLFVBQU11QyxVQUFVbEMsaUJBQWlCRSxNQUFqQzs7QUFFQSxVQUFNaUMsV0FBV0MsS0FBS0MsR0FBTCxDQUFTLENBQVQsRUFBWUQsS0FBS0UsR0FBTCxDQUFTVCxFQUFULEVBQWFHLE9BQWIsSUFBd0JJLEtBQUtDLEdBQUwsQ0FBU1YsRUFBVCxFQUFhSSxPQUFiLENBQXBDLENBQWpCO0FBQ0EsVUFBTVEsV0FBV0gsS0FBS0MsR0FBTCxDQUFTLENBQVQsRUFBWUQsS0FBS0UsR0FBTCxDQUFTUixFQUFULEVBQWFJLE9BQWIsSUFBd0JFLEtBQUtDLEdBQUwsQ0FBU1QsRUFBVCxFQUFhSyxPQUFiLENBQXBDLENBQWpCO0FBQ0EsVUFBTU8sT0FBT0wsV0FBV0ksUUFBeEI7O0FBRUEsYUFBT0MsT0FBTyxDQUFkO0FBQ0Q7Ozs7O2tCQUdZbEQsTSIsImZpbGUiOiJtYXJrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vQmFzZVNoYXBlJztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIG1hcmtlci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1tYXJrZXIuaHRtbClcbiAqL1xuY2xhc3MgTWFya2VyIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ21hcmtlcic7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IHg6IDAsIGNvbG9yOiAnI2ZmMDAwMCcsIGxhYmVsOiAnJyB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoYW5kbGVyV2lkdGg6IDcsXG4gICAgICBoYW5kbGVySGVpZ2h0OiAxMCxcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogdHJ1ZSxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICBjb2xvcjogJ3JlZCcsXG4gICAgICBkaXNwbGF5TGFiZWxzOiBmYWxzZSxcbiAgICAgIGxhYmVsV2lkdGg6IDYwLFxuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbClcbiAgICAgIHJldHVybiB0aGlzLiRlbDtcblxuICAgIGNvbnN0IGhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcbiAgICB0aGlzLiRsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdsaW5lJyk7XG5cbiAgICAvLyBkcmF3IGxpbmVcbiAgICB0aGlzLiRsaW5lLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgMCk7XG4gICAgdGhpcy4kbGluZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneTEnLCAwKTtcbiAgICB0aGlzLiRsaW5lLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbGluZSk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZGlzcGxheUhhbmRsZXJzKSB7XG4gICAgICB0aGlzLiRoYW5kbGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdyZWN0Jyk7XG5cbiAgICAgIHRoaXMuJGhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCAtIHRoaXMucGFyYW1zLmhhbmRsZXJXaWR0aCAvIDIpO1xuICAgICAgdGhpcy4kaGFuZGxlci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB0aGlzLnBhcmFtcy5oYW5kbGVyV2lkdGgpO1xuICAgICAgdGhpcy4kaGFuZGxlci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgdGhpcy5wYXJhbXMuaGFuZGxlckhlaWdodCk7XG4gICAgICB0aGlzLiRoYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuXG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRoYW5kbGVyKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZGlzcGxheUxhYmVscykge1xuICAgICAgLy8gcHJlZmVyIGh0bWwgYGRpdmAgb3ZlciBzdmcgYHRleHRgIHRhZyBiZWNhdXNlIHdlIHRoZW4gdXNlIHRoZSBgY29udGVudGVkaXRhYmxlYCBwcm9wZXJ0eVxuICAgICAgdGhpcy4kZm9yZWlnbk9iamVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZm9yZWlnbk9iamVjdCcpO1xuXG4gICAgICB0aGlzLiRsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGhpcy4kbGFiZWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB0aGlzLiRsYWJlbC5zdHlsZS53aWR0aCA9IGAke3RoaXMucGFyYW1zLmxhYmVsV2lkdGh9cHhgO1xuICAgICAgdGhpcy4kbGFiZWwuc3R5bGUuZm9udFNpemUgPSAnMTJweCc7XG4gICAgICB0aGlzLiRsYWJlbC5zdHlsZS5mb250RmFtaWx5ID0gJ2FyaWFsJztcbiAgICAgIHRoaXMuJGxhYmVsLnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgICB0aGlzLiRsYWJlbC5zdHlsZS5vdXRsaW5lV2lkdGggPSAnMXB4JztcblxuICAgICAgdGhpcy4kZm9yZWlnbk9iamVjdC5hcHBlbmRDaGlsZCh0aGlzLiRsYWJlbCk7XG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRmb3JlaWduT2JqZWN0KTtcbiAgICB9XG5cbiAgICB0aGlzLiRlbC5zdHlsZS5vcGFjaXR5ID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSkge1xuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkYXR1bSkpO1xuICAgIGNvbnN0IGNvbG9yID0gdGhpcy5jb2xvcihkYXR1bSk7XG4gICAgY29uc3QgaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG5cbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3h9LCAwKWApO1xuXG4gICAgdGhpcy4kbGluZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneTInLCBoZWlnaHQpO1xuICAgIHRoaXMuJGxpbmUuc3R5bGUuc3Ryb2tlID0gY29sb3I7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZGlzcGxheUhhbmRsZXJzKSB7XG4gICAgICB0aGlzLiRoYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgaGVpZ2h0IC0gdGhpcy5wYXJhbXMuaGFuZGxlckhlaWdodCk7XG4gICAgICB0aGlzLiRoYW5kbGVyLnN0eWxlLmZpbGwgPSBjb2xvcjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZGlzcGxheUxhYmVscykge1xuICAgICAgY29uc3QgbWF0cml4ID0gYG1hdHJpeCgxLCAwLCAwLCAtMSwgJHt0aGlzLnBhcmFtcy5oYW5kbGVyV2lkdGh9LCAke2hlaWdodCAtIDJ9KWA7XG4gICAgICB0aGlzLiRmb3JlaWduT2JqZWN0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBtYXRyaXgpO1xuICAgICAgdGhpcy4kbGFiZWwuaW5uZXJIVE1MID0gdGhpcy5sYWJlbChkYXR1bSk7XG4gICAgfVxuICB9XG5cbiAgaW5BcmVhKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mikge1xuICAgIC8vIGhhbmRsZXJzIG9ubHkgYXJlIHNlbGVjdGFibGVcbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLngoZGF0dW0pKTtcbiAgICBjb25zdCBzaGFwZVgxID0geCAtICh0aGlzLnBhcmFtcy5oYW5kbGVyV2lkdGggLSAxKSAvIDI7XG4gICAgY29uc3Qgc2hhcGVYMiA9IHNoYXBlWDEgKyB0aGlzLnBhcmFtcy5oYW5kbGVyV2lkdGg7XG4gICAgY29uc3Qgc2hhcGVZMSA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0IC0gdGhpcy5wYXJhbXMuaGFuZGxlckhlaWdodDtcbiAgICBjb25zdCBzaGFwZVkyID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG5cbiAgICBjb25zdCB4T3ZlcmxhcCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHgyLCBzaGFwZVgyKSAtIE1hdGgubWF4KHgxLCBzaGFwZVgxKSk7XG4gICAgY29uc3QgeU92ZXJsYXAgPSBNYXRoLm1heCgwLCBNYXRoLm1pbih5Miwgc2hhcGVZMikgLSBNYXRoLm1heCh5MSwgc2hhcGVZMSkpO1xuICAgIGNvbnN0IGFyZWEgPSB4T3ZlcmxhcCAqIHlPdmVybGFwO1xuXG4gICAgcmV0dXJuIGFyZWEgPiAwO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcmtlcjtcbiJdfQ==