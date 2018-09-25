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
 * A shape to display a segment.
 *
 * [example usage](./examples/layer-segment.html)
 */
var Segment = function (_BaseShape) {
  (0, _inherits3.default)(Segment, _BaseShape);

  function Segment() {
    (0, _classCallCheck3.default)(this, Segment);
    return (0, _possibleConstructorReturn3.default)(this, (Segment.__proto__ || (0, _getPrototypeOf2.default)(Segment)).apply(this, arguments));
  }

  (0, _createClass3.default)(Segment, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'segment';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { x: 0, y: 0, width: 0, height: 1, color: '#000000', opacity: 1, label: '' };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        displayHandlers: true,
        handlerWidth: 2,
        handlerOpacity: 0.8,
        opacity: 0.6,
        displayLabels: false
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }

      this.$el = document.createElementNS(this.ns, 'g');

      this.$segment = document.createElementNS(this.ns, 'rect');
      this.$segment.classList.add('segment');
      this.$segment.style.opacity = this.params.opacity;
      this.$segment.setAttributeNS(null, 'shape-rendering', 'crispEdges');

      this.$el.appendChild(this.$segment);

      if (this.params.displayHandlers) {
        this.$leftHandler = document.createElementNS(this.ns, 'rect');
        this.$leftHandler.classList.add('left', 'handler');
        this.$leftHandler.setAttributeNS(null, 'width', this.params.handlerWidth);
        this.$leftHandler.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        this.$leftHandler.style.opacity = this.params.handlerOpacity;
        this.$leftHandler.style.cursor = 'ew-resize';

        this.$rightHandler = document.createElementNS(this.ns, 'rect');
        this.$rightHandler.classList.add('right', 'handler');
        this.$rightHandler.setAttributeNS(null, 'width', this.params.handlerWidth);
        this.$rightHandler.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        this.$rightHandler.style.opacity = this.params.handlerOpacity;
        this.$rightHandler.style.cursor = 'ew-resize';

        this.$el.appendChild(this.$leftHandler);
        this.$el.appendChild(this.$rightHandler);
      }

      if (this.params.displayLabels) {
        // prefer html `div` over svg `text` tag because we then use the `contenteditable` property
        this.$foreignObject = document.createElementNS(this.ns, 'foreignObject');

        this.$label = document.createElement('div');
        this.$label.style.display = 'block';
        this.$label.style.width = '50px';
        this.$label.style.fontSize = '12px';
        this.$label.style.fontFamily = 'arial';
        this.$label.style.userSelect = 'none';
        this.$label.style.outlineWidth = '1px';

        this.$foreignObject.appendChild(this.$label);
        this.$el.appendChild(this.$foreignObject);
      }

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      var x = renderingContext.timeToPixel(this.x(datum));
      var y = renderingContext.valueToPixel(this.y(datum));

      var width = renderingContext.timeToPixel(this.width(datum));
      var height = renderingContext.valueToPixel(this.height(datum));
      var color = this.color(datum);
      var opacity = this.opacity(datum);

      this.$el.setAttributeNS(null, 'transform', 'translate(' + x + ', ' + y + ')');
      this.$el.style.opacity = opacity;

      this.$segment.setAttributeNS(null, 'width', Math.max(width, 0));
      this.$segment.setAttributeNS(null, 'height', height);
      this.$segment.style.fill = color;

      if (this.params.displayHandlers) {
        // display handlers
        this.$leftHandler.setAttributeNS(null, 'height', height);
        this.$leftHandler.setAttributeNS(null, 'transform', 'translate(0, 0)');
        this.$leftHandler.style.fill = color;

        var rightHandlerTranslate = 'translate(' + (width - this.params.handlerWidth) + ', 0)';
        this.$rightHandler.setAttributeNS(null, 'height', height);
        this.$rightHandler.setAttributeNS(null, 'transform', rightHandlerTranslate);
        this.$rightHandler.style.fill = color;
      }

      if (this.params.displayLabels) {
        var matrix = 'matrix(1, 0, 0, -1, 4, ' + (height - 2) + ')';
        this.$foreignObject.setAttributeNS(null, 'transform', matrix);
        this.$label.innerHTML = this.label(datum);
      }
    }
  }, {
    key: 'inArea',
    value: function inArea(renderingContext, datum, x1, y1, x2, y2) {
      var shapeX1 = renderingContext.timeToPixel(this.x(datum));
      var shapeX2 = renderingContext.timeToPixel(this.x(datum) + this.width(datum));
      var shapeY1 = renderingContext.valueToPixel(this.y(datum));
      var shapeY2 = renderingContext.valueToPixel(this.y(datum) + this.height(datum));

      // http://jsfiddle.net/uthyZ/ - check overlaping area
      var xOverlap = Math.max(0, Math.min(x2, shapeX2) - Math.max(x1, shapeX1));
      var yOverlap = Math.max(0, Math.min(y2, shapeY2) - Math.max(y1, shapeY1));
      var area = xOverlap * yOverlap;

      return area > 0;
    }
  }]);
  return Segment;
}(_BaseShape3.default);

exports.default = Segment;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlZ21lbnQuanMiXSwibmFtZXMiOlsiU2VnbWVudCIsIngiLCJ5Iiwid2lkdGgiLCJoZWlnaHQiLCJjb2xvciIsIm9wYWNpdHkiLCJsYWJlbCIsImRpc3BsYXlIYW5kbGVycyIsImhhbmRsZXJXaWR0aCIsImhhbmRsZXJPcGFjaXR5IiwiZGlzcGxheUxhYmVscyIsInJlbmRlcmluZ0NvbnRleHQiLCIkZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsIm5zIiwiJHNlZ21lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJzdHlsZSIsInBhcmFtcyIsInNldEF0dHJpYnV0ZU5TIiwiYXBwZW5kQ2hpbGQiLCIkbGVmdEhhbmRsZXIiLCJjdXJzb3IiLCIkcmlnaHRIYW5kbGVyIiwiJGZvcmVpZ25PYmplY3QiLCIkbGFiZWwiLCJjcmVhdGVFbGVtZW50IiwiZGlzcGxheSIsImZvbnRTaXplIiwiZm9udEZhbWlseSIsInVzZXJTZWxlY3QiLCJvdXRsaW5lV2lkdGgiLCJkYXR1bSIsInRpbWVUb1BpeGVsIiwidmFsdWVUb1BpeGVsIiwiTWF0aCIsIm1heCIsImZpbGwiLCJyaWdodEhhbmRsZXJUcmFuc2xhdGUiLCJtYXRyaXgiLCJpbm5lckhUTUwiLCJ4MSIsInkxIiwieDIiLCJ5MiIsInNoYXBlWDEiLCJzaGFwZVgyIiwic2hhcGVZMSIsInNoYXBlWTIiLCJ4T3ZlcmxhcCIsIm1pbiIsInlPdmVybGFwIiwiYXJlYSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0E7Ozs7O0lBS01BLE87Ozs7Ozs7Ozs7bUNBQ1c7QUFBRSxhQUFPLFNBQVA7QUFBbUI7Ozt1Q0FFakI7QUFDakIsYUFBTyxFQUFFQyxHQUFHLENBQUwsRUFBUUMsR0FBRyxDQUFYLEVBQWNDLE9BQU8sQ0FBckIsRUFBd0JDLFFBQVEsQ0FBaEMsRUFBbUNDLE9BQU8sU0FBMUMsRUFBcURDLFNBQVMsQ0FBOUQsRUFBaUVDLE9BQU8sRUFBeEUsRUFBUDtB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QjtBQUNEO0FBQ0Y7OzsyQkFFTXZCLGdCLEVBQWtCdUIsSyxFQUFPUyxFLEVBQUlDLEUsRUFBSUMsRSxFQUFJQyxFLEVBQUk7QUFDOUMsVUFBTUMsVUFBVXBDLGlCQUFpQndCLFdBQWpCLENBQTZCLEtBQUtuQyxDQUFMLENBQU9rQyxLQUFQLENBQTdCLENBQWhCO0FBQ0EsVUFBTWMsVUFBVXJDLGlCQUFpQndCLFdBQWpCLENBQTZCLEtBQUtuQyxDQUFMLENBQU9rQyxLQUFQLElBQWdCLEtBQUtoQyxLQUFMLENBQVdnQyxLQUFYLENBQTdDLENBQWhCO0FBQ0EsVUFBTWUsVUFBVXRDLGlCQUFpQnlCLFlBQWpCLENBQThCLEtBQUtuQyxDQUFMLENBQU9pQyxLQUFQLENBQTlCLENBQWhCO0FBQ0EsVUFBTWdCLFVBQVV2QyxpQkFBaUJ5QixZQUFqQixDQUE4QixLQUFLbkMsQ0FBTCxDQUFPaUMsS0FBUCxJQUFnQixLQUFLL0IsTUFBTCxDQUFZK0IsS0FBWixDQUE5QyxDQUFoQjs7QUFFQTtBQUNBLFVBQU1pQixXQUFXZCxLQUFLQyxHQUFMLENBQVMsQ0FBVCxFQUFZRCxLQUFLZSxHQUFMLENBQVNQLEVBQVQsRUFBYUcsT0FBYixJQUF3QlgsS0FBS0MsR0FBTCxDQUFTSyxFQUFULEVBQWFJLE9BQWIsQ0FBcEMsQ0FBakI7QUFDQSxVQUFNTSxXQUFXaEIsS0FBS0MsR0FBTCxDQUFTLENBQVQsRUFBWUQsS0FBS2UsR0FBTCxDQUFTTixFQUFULEVBQWFJLE9BQWIsSUFBd0JiLEtBQUtDLEdBQUwsQ0FBU00sRUFBVCxFQUFhSyxPQUFiLENBQXBDLENBQWpCO0FBQ0EsVUFBTUssT0FBT0gsV0FBV0UsUUFBeEI7O0FBRUEsYUFBT0MsT0FBTyxDQUFkO0FBQ0Q7Ozs7O2tCQUdZdkQsTyIsImZpbGUiOiJTZWdtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL0Jhc2VTaGFwZSc7XG5cblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgYSBzZWdtZW50LlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLXNlZ21lbnQuaHRtbClcbiAqL1xuY2xhc3MgU2VnbWVudCBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdzZWdtZW50JzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgeDogMCwgeTogMCwgd2lkdGg6IDAsIGhlaWdodDogMSwgY29sb3I6ICcjMDAwMDAwJywgb3BhY2l0eTogMSwgbGFiZWw6ICcnIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogdHJ1ZSxcbiAgICAgIGhhbmRsZXJXaWR0aDogMixcbiAgICAgIGhhbmRsZXJPcGFjaXR5OiAwLjgsXG4gICAgICBvcGFjaXR5OiAwLjYsXG4gICAgICBkaXNwbGF5TGFiZWxzOiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZycpO1xuXG4gICAgdGhpcy4kc2VnbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncmVjdCcpO1xuICAgIHRoaXMuJHNlZ21lbnQuY2xhc3NMaXN0LmFkZCgnc2VnbWVudCcpO1xuICAgIHRoaXMuJHNlZ21lbnQuc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG4gICAgdGhpcy4kc2VnbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcblxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJHNlZ21lbnQpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmRpc3BsYXlIYW5kbGVycykge1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3JlY3QnKTtcbiAgICAgIHRoaXMuJGxlZnRIYW5kbGVyLmNsYXNzTGlzdC5hZGQoJ2xlZnQnLCAnaGFuZGxlcicpO1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgdGhpcy5wYXJhbXMuaGFuZGxlcldpZHRoKTtcbiAgICAgIHRoaXMuJGxlZnRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLmhhbmRsZXJPcGFjaXR5O1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuc3R5bGUuY3Vyc29yID0gJ2V3LXJlc2l6ZSc7XG5cbiAgICAgIHRoaXMuJHJpZ2h0SGFuZGxlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncmVjdCcpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLmNsYXNzTGlzdC5hZGQoJ3JpZ2h0JywgJ2hhbmRsZXInKTtcbiAgICAgIHRoaXMuJHJpZ2h0SGFuZGxlci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB0aGlzLnBhcmFtcy5oYW5kbGVyV2lkdGgpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5oYW5kbGVyT3BhY2l0eTtcbiAgICAgIHRoaXMuJHJpZ2h0SGFuZGxlci5zdHlsZS5jdXJzb3IgPSAnZXctcmVzaXplJztcblxuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbGVmdEhhbmRsZXIpO1xuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kcmlnaHRIYW5kbGVyKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZGlzcGxheUxhYmVscykge1xuICAgICAgLy8gcHJlZmVyIGh0bWwgYGRpdmAgb3ZlciBzdmcgYHRleHRgIHRhZyBiZWNhdXNlIHdlIHRoZW4gdXNlIHRoZSBgY29udGVudGVkaXRhYmxlYCBwcm9wZXJ0eVxuICAgICAgdGhpcy4kZm9yZWlnbk9iamVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZm9yZWlnbk9iamVjdCcpO1xuXG4gICAgICB0aGlzLiRsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGhpcy4kbGFiZWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB0aGlzLiRsYWJlbC5zdHlsZS53aWR0aCA9ICc1MHB4JztcbiAgICAgIHRoaXMuJGxhYmVsLnN0eWxlLmZvbnRTaXplID0gJzEycHgnO1xuICAgICAgdGhpcy4kbGFiZWwuc3R5bGUuZm9udEZhbWlseSA9ICdhcmlhbCc7XG4gICAgICB0aGlzLiRsYWJlbC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgICAgdGhpcy4kbGFiZWwuc3R5bGUub3V0bGluZVdpZHRoID0gJzFweCc7XG5cbiAgICAgIHRoaXMuJGZvcmVpZ25PYmplY3QuYXBwZW5kQ2hpbGQodGhpcy4kbGFiZWwpO1xuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kZm9yZWlnbk9iamVjdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSk7XG4gICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMueShkYXR1bSkpO1xuXG4gICAgY29uc3Qgd2lkdGggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMud2lkdGgoZGF0dW0pKTtcbiAgICBjb25zdCBoZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLmhlaWdodChkYXR1bSkpO1xuICAgIGNvbnN0IGNvbG9yID0gdGhpcy5jb2xvcihkYXR1bSk7XG4gICAgY29uc3Qgb3BhY2l0eSA9IHRoaXMub3BhY2l0eShkYXR1bSk7XG5cbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3h9LCAke3l9KWApO1xuICAgIHRoaXMuJGVsLnN0eWxlLm9wYWNpdHkgPSBvcGFjaXR5O1xuXG4gICAgdGhpcy4kc2VnbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCBNYXRoLm1heCh3aWR0aCwgMCkpO1xuICAgIHRoaXMuJHNlZ21lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgdGhpcy4kc2VnbWVudC5zdHlsZS5maWxsID0gY29sb3I7XG5cblxuICAgIGlmICh0aGlzLnBhcmFtcy5kaXNwbGF5SGFuZGxlcnMpIHtcbiAgICAgIC8vIGRpc3BsYXkgaGFuZGxlcnNcbiAgICAgIHRoaXMuJGxlZnRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwgMCknKTtcbiAgICAgIHRoaXMuJGxlZnRIYW5kbGVyLnN0eWxlLmZpbGwgPSBjb2xvcjtcblxuICAgICAgY29uc3QgcmlnaHRIYW5kbGVyVHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgke3dpZHRoIC0gdGhpcy5wYXJhbXMuaGFuZGxlcldpZHRofSwgMClgO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCByaWdodEhhbmRsZXJUcmFuc2xhdGUpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnN0eWxlLmZpbGwgPSBjb2xvcjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZGlzcGxheUxhYmVscykge1xuICAgICAgY29uc3QgbWF0cml4ID0gYG1hdHJpeCgxLCAwLCAwLCAtMSwgNCwgJHtoZWlnaHQgLSAyfSlgXG4gICAgICB0aGlzLiRmb3JlaWduT2JqZWN0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBtYXRyaXgpO1xuICAgICAgdGhpcy4kbGFiZWwuaW5uZXJIVE1MID0gdGhpcy5sYWJlbChkYXR1bSk7XG4gICAgfVxuICB9XG5cbiAgaW5BcmVhKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mikge1xuICAgIGNvbnN0IHNoYXBlWDEgPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkYXR1bSkpO1xuICAgIGNvbnN0IHNoYXBlWDIgPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkYXR1bSkgKyB0aGlzLndpZHRoKGRhdHVtKSk7XG4gICAgY29uc3Qgc2hhcGVZMSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMueShkYXR1bSkpO1xuICAgIGNvbnN0IHNoYXBlWTIgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLnkoZGF0dW0pICsgdGhpcy5oZWlnaHQoZGF0dW0pKTtcblxuICAgIC8vIGh0dHA6Ly9qc2ZpZGRsZS5uZXQvdXRoeVovIC0gY2hlY2sgb3ZlcmxhcGluZyBhcmVhXG4gICAgY29uc3QgeE92ZXJsYXAgPSBNYXRoLm1heCgwLCBNYXRoLm1pbih4Miwgc2hhcGVYMikgLSBNYXRoLm1heCh4MSwgc2hhcGVYMSkpO1xuICAgIGNvbnN0IHlPdmVybGFwID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oeTIsIHNoYXBlWTIpIC0gTWF0aC5tYXgoeTEsIHNoYXBlWTEpKTtcbiAgICBjb25zdCBhcmVhID0geE92ZXJsYXAgKiB5T3ZlcmxhcDtcblxuICAgIHJldHVybiBhcmVhID4gMDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTZWdtZW50O1xuIl19