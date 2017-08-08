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

        this.$foreignObject.appendChild(this.$label);
        this.$el.appendChild(this.$foreignObject);
      }

      this.$el.style.opacity = this.params.opacity;

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      var x = renderingContext.timeToPixel(this.x(datum)) - 0.5;
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
}(_baseShape2.default);

exports.default = Marker;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hcmtlci5qcyJdLCJuYW1lcyI6WyJNYXJrZXIiLCJ4IiwiY29sb3IiLCJsYWJlbCIsImhhbmRsZXJXaWR0aCIsImhhbmRsZXJIZWlnaHQiLCJkaXNwbGF5SGFuZGxlcnMiLCJvcGFjaXR5IiwiZGlzcGxheUxhYmVscyIsImxhYmVsV2lkdGgiLCJyZW5kZXJpbmdDb250ZXh0IiwiJGVsIiwiaGVpZ2h0IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50TlMiLCJucyIsIiRsaW5lIiwic2V0QXR0cmlidXRlTlMiLCJhcHBlbmRDaGlsZCIsInBhcmFtcyIsIiRoYW5kbGVyIiwiJGZvcmVpZ25PYmplY3QiLCIkbGFiZWwiLCJjcmVhdGVFbGVtZW50Iiwic3R5bGUiLCJkaXNwbGF5Iiwid2lkdGgiLCJmb250U2l6ZSIsImZvbnRGYW1pbHkiLCJ1c2VyU2VsZWN0IiwiZGF0dW0iLCJ0aW1lVG9QaXhlbCIsInN0cm9rZSIsImZpbGwiLCJtYXRyaXgiLCJpbm5lckhUTUwiLCJ4MSIsInkxIiwieDIiLCJ5MiIsInNoYXBlWDEiLCJzaGFwZVgyIiwic2hhcGVZMSIsInNoYXBlWTIiLCJ4T3ZlcmxhcCIsIk1hdGgiLCJtYXgiLCJtaW4iLCJ5T3ZlcmxhcCIsImFyZWEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUdBOzs7OztJQUtxQkEsTTs7Ozs7Ozs7OzttQ0FDSjtBQUFFLGFBQU8sUUFBUDtBQUFrQjs7O3VDQUVoQjtBQUNqQixhQUFPLEVBQUVDLEdBQUcsQ0FBTCxFQUFRQyxPQUFPLFNBQWYsRUFBMEJDLE9BQU8sRUFBakMsRUFBUDtBQUNEOzs7bUNBRWM7QUFDYixhQUFPO0FBQ0xDLHNCQUFjLENBRFQ7QUFFTEMsdUJBQWUsRUFGVjtBQUdMQyx5QkFBaUIsSUFIWjtBQUlMQyxpQkFBUyxDQUpKO0FBS0xMLGVBQU8sS0FMRjtBQU1MTSx1QkFBZSxLQU5WO0FBT0xDLG9CQUFZO0FBUFAsT0FBUDtBQVNEOzs7MkJBRU1D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TUFBTCxDQUFZZCxhQUF0RDtBQUNBLFVBQU1zQyxVQUFVakMsaUJBQWlCRSxNQUFqQzs7QUFFQSxVQUFNZ0MsV0FBV0MsS0FBS0MsR0FBTCxDQUFTLENBQVQsRUFBWUQsS0FBS0UsR0FBTCxDQUFTVCxFQUFULEVBQWFHLE9BQWIsSUFBd0JJLEtBQUtDLEdBQUwsQ0FBU1YsRUFBVCxFQUFhSSxPQUFiLENBQXBDLENBQWpCO0FBQ0EsVUFBTVEsV0FBV0gsS0FBS0MsR0FBTCxDQUFTLENBQVQsRUFBWUQsS0FBS0UsR0FBTCxDQUFTUixFQUFULEVBQWFJLE9BQWIsSUFBd0JFLEtBQUtDLEdBQUwsQ0FBU1QsRUFBVCxFQUFhSyxPQUFiLENBQXBDLENBQWpCO0FBQ0EsVUFBTU8sT0FBT0wsV0FBV0ksUUFBeEI7O0FBRUEsYUFBT0MsT0FBTyxDQUFkO0FBQ0Q7Ozs7O2tCQXJHa0JqRCxNIiwiZmlsZSI6Im1hcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIG1hcmtlci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1tYXJrZXIuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFya2VyIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ21hcmtlcic7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IHg6IDAsIGNvbG9yOiAnI2ZmMDAwMCcsIGxhYmVsOiAnJyB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoYW5kbGVyV2lkdGg6IDcsXG4gICAgICBoYW5kbGVySGVpZ2h0OiAxMCxcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogdHJ1ZSxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICBjb2xvcjogJ3JlZCcsXG4gICAgICBkaXNwbGF5TGFiZWxzOiBmYWxzZSxcbiAgICAgIGxhYmVsV2lkdGg6IDYwLFxuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbClcbiAgICAgIHJldHVybiB0aGlzLiRlbDtcblxuICAgIGNvbnN0IGhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKTtcbiAgICB0aGlzLiRsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdsaW5lJyk7XG5cbiAgICAvLyBkcmF3IGxpbmVcbiAgICB0aGlzLiRsaW5lLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgMCk7XG4gICAgdGhpcy4kbGluZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneTEnLCAwKTtcbiAgICB0aGlzLiRsaW5lLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbGluZSk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZGlzcGxheUhhbmRsZXJzKSB7XG4gICAgICB0aGlzLiRoYW5kbGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdyZWN0Jyk7XG5cbiAgICAgIHRoaXMuJGhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCAtIHRoaXMucGFyYW1zLmhhbmRsZXJXaWR0aCAvIDIpO1xuICAgICAgdGhpcy4kaGFuZGxlci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB0aGlzLnBhcmFtcy5oYW5kbGVyV2lkdGgpO1xuICAgICAgdGhpcy4kaGFuZGxlci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgdGhpcy5wYXJhbXMuaGFuZGxlckhlaWdodCk7XG4gICAgICB0aGlzLiRoYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuXG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRoYW5kbGVyKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZGlzcGxheUxhYmVscykge1xuICAgICAgLy8gcHJlZmVyIGh0bWwgYGRpdmAgb3ZlciBzdmcgYHRleHRgIHRhZyBiZWNhdXNlIHdlIHRoZW4gdXNlIHRoZSBgY29udGVudGVkaXRhYmxlYCBwcm9wZXJ0eVxuICAgICAgdGhpcy4kZm9yZWlnbk9iamVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZm9yZWlnbk9iamVjdCcpO1xuXG4gICAgICB0aGlzLiRsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGhpcy4kbGFiZWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB0aGlzLiRsYWJlbC5zdHlsZS53aWR0aCA9IGAke3RoaXMucGFyYW1zLmxhYmVsV2lkdGh9cHhgO1xuICAgICAgdGhpcy4kbGFiZWwuc3R5bGUuZm9udFNpemUgPSAnMTJweCc7XG4gICAgICB0aGlzLiRsYWJlbC5zdHlsZS5mb250RmFtaWx5ID0gJ2FyaWFsJztcbiAgICAgIHRoaXMuJGxhYmVsLnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XG5cbiAgICAgIHRoaXMuJGZvcmVpZ25PYmplY3QuYXBwZW5kQ2hpbGQodGhpcy4kbGFiZWwpO1xuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kZm9yZWlnbk9iamVjdCk7XG4gICAgfVxuXG4gICAgdGhpcy4kZWwuc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0pIHtcbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLngoZGF0dW0pKSAtIDAuNTtcbiAgICBjb25zdCBjb2xvciA9IHRoaXMuY29sb3IoZGF0dW0pO1xuICAgIGNvbnN0IGhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuXG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHt4fSwgMClgKTtcblxuICAgIHRoaXMuJGxpbmUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3kyJywgaGVpZ2h0KTtcbiAgICB0aGlzLiRsaW5lLnN0eWxlLnN0cm9rZSA9IGNvbG9yO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmRpc3BsYXlIYW5kbGVycykge1xuICAgICAgdGhpcy4kaGFuZGxlci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIGhlaWdodCAtIHRoaXMucGFyYW1zLmhhbmRsZXJIZWlnaHQpO1xuICAgICAgdGhpcy4kaGFuZGxlci5zdHlsZS5maWxsID0gY29sb3I7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyYW1zLmRpc3BsYXlMYWJlbHMpIHtcbiAgICAgIGNvbnN0IG1hdHJpeCA9IGBtYXRyaXgoMSwgMCwgMCwgLTEsICR7dGhpcy5wYXJhbXMuaGFuZGxlcldpZHRofSwgJHtoZWlnaHQgLSAyfSlgO1xuICAgICAgdGhpcy4kZm9yZWlnbk9iamVjdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgbWF0cml4KTtcbiAgICAgIHRoaXMuJGxhYmVsLmlubmVySFRNTCA9IHRoaXMubGFiZWwoZGF0dW0pO1xuICAgIH1cbiAgfVxuXG4gIGluQXJlYShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgeDEsIHkxLCB4MiwgeTIpIHtcbiAgICAvLyBoYW5kbGVycyBvbmx5IGFyZSBzZWxlY3RhYmxlXG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSk7XG4gICAgY29uc3Qgc2hhcGVYMSA9IHggLSAodGhpcy5wYXJhbXMuaGFuZGxlcldpZHRoIC0gMSkgLyAyO1xuICAgIGNvbnN0IHNoYXBlWDIgPSBzaGFwZVgxICsgdGhpcy5wYXJhbXMuaGFuZGxlcldpZHRoO1xuICAgIGNvbnN0IHNoYXBlWTEgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodCAtIHRoaXMucGFyYW1zLmhhbmRsZXJIZWlnaHQ7XG4gICAgY29uc3Qgc2hhcGVZMiA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuXG4gICAgY29uc3QgeE92ZXJsYXAgPSBNYXRoLm1heCgwLCBNYXRoLm1pbih4Miwgc2hhcGVYMikgLSBNYXRoLm1heCh4MSwgc2hhcGVYMSkpO1xuICAgIGNvbnN0IHlPdmVybGFwID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oeTIsIHNoYXBlWTIpIC0gTWF0aC5tYXgoeTEsIHNoYXBlWTEpKTtcbiAgICBjb25zdCBhcmVhID0geE92ZXJsYXAgKiB5T3ZlcmxhcDtcblxuICAgIHJldHVybiBhcmVhID4gMDtcbiAgfVxufVxuIl19