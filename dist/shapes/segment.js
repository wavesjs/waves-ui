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
}(_baseShape2.default);

exports.default = Segment;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlZ21lbnQuanMiXSwibmFtZXMiOlsiU2VnbWVudCIsIngiLCJ5Iiwid2lkdGgiLCJoZWlnaHQiLCJjb2xvciIsIm9wYWNpdHkiLCJsYWJlbCIsImRpc3BsYXlIYW5kbGVycyIsImhhbmRsZXJXaWR0aCIsImhhbmRsZXJPcGFjaXR5IiwiZGlzcGxheUxhYmVscyIsInJlbmRlcmluZ0NvbnRleHQiLCIkZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsIm5zIiwiJHNlZ21lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJzdHlsZSIsInBhcmFtcyIsInNldEF0dHJpYnV0ZU5TIiwiYXBwZW5kQ2hpbGQiLCIkbGVmdEhhbmRsZXIiLCJjdXJzb3IiLCIkcmlnaHRIYW5kbGVyIiwiJGZvcmVpZ25PYmplY3QiLCIkbGFiZWwiLCJjcmVhdGVFbGVtZW50IiwiZGlzcGxheSIsImZvbnRTaXplIiwiZm9udEZhbWlseSIsInVzZXJTZWxlY3QiLCJkYXR1bSIsInRpbWVUb1BpeGVsIiwidmFsdWVUb1BpeGVsIiwiTWF0aCIsIm1heCIsImZpbGwiLCJyaWdodEhhbmRsZXJUcmFuc2xhdGUiLCJtYXRyaXgiLCJpbm5lckhUTUwiLCJ4MSIsInkxIiwieDIiLCJ5MiIsInNoYXBlWDEiLCJzaGFwZVgyIiwic2hhcGVZMSIsInNoYXBlWTIiLCJ4T3ZlcmxhcCIsIm1pbiIsInlPdmVybGFwIiwiYXJlYSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0E7Ozs7O0lBS3FCQSxPOzs7Ozs7Ozs7O21DQUNKO0FBQUUsYUFBTyxTQUFQO0FBQW1COzs7dUNBRWpCO0FBQ2pCLGFBQU8sRUFBRUMsR0FBRyxDQUFMLEVBQVFDLEdBQUcsQ0FBWCxFQUFjQyxPQUFPLENBQXJCLEVBQXdCQyxRQUFRLENBQWhDLEVBQW1DQyxPQUFPLFNBQTFDLEVBQXFEQyxTQUFTLENBQTlELEVBQWlFQyxPQUFPLEVBQXhFLEVBQVA7QUFDRDs7O21DQUVjO0FB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RUFBSTtBQUM5QyxVQUFNQyxVQUFVbkMsaUJBQWlCdUIsV0FBakIsQ0FBNkIsS0FBS2xDLENBQUwsQ0FBT2lDLEtBQVAsQ0FBN0IsQ0FBaEI7QUFDQSxVQUFNYyxVQUFVcEMsaUJBQWlCdUIsV0FBakIsQ0FBNkIsS0FBS2xDLENBQUwsQ0FBT2lDLEtBQVAsSUFBZ0IsS0FBSy9CLEtBQUwsQ0FBVytCLEtBQVgsQ0FBN0MsQ0FBaEI7QUFDQSxVQUFNZSxVQUFVckMsaUJBQWlCd0IsWUFBakIsQ0FBOEIsS0FBS2xDLENBQUwsQ0FBT2dDLEtBQVAsQ0FBOUIsQ0FBaEI7QUFDQSxVQUFNZ0IsVUFBVXRDLGlCQUFpQndCLFlBQWpCLENBQThCLEtBQUtsQyxDQUFMLENBQU9nQyxLQUFQLElBQWdCLEtBQUs5QixNQUFMLENBQVk4QixLQUFaLENBQTlDLENBQWhCOztBQUVBO0FBQ0EsVUFBTWlCLFdBQVdkLEtBQUtDLEdBQUwsQ0FBUyxDQUFULEVBQVlELEtBQUtlLEdBQUwsQ0FBU1AsRUFBVCxFQUFhRyxPQUFiLElBQXdCWCxLQUFLQyxHQUFMLENBQVNLLEVBQVQsRUFBYUksT0FBYixDQUFwQyxDQUFqQjtBQUNBLFVBQU1NLFdBQVdoQixLQUFLQyxHQUFMLENBQVMsQ0FBVCxFQUFZRCxLQUFLZSxHQUFMLENBQVNOLEVBQVQsRUFBYUksT0FBYixJQUF3QmIsS0FBS0MsR0FBTCxDQUFTTSxFQUFULEVBQWFLLE9BQWIsQ0FBcEMsQ0FBakI7QUFDQSxVQUFNSyxPQUFPSCxXQUFXRSxRQUF4Qjs7QUFFQSxhQUFPQyxPQUFPLENBQWQ7QUFDRDs7Ozs7a0JBbEhrQnRELE8iLCJmaWxlIjoic2VnbWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIHNlZ21lbnQuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItc2VnbWVudC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWdtZW50IGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3NlZ21lbnQnOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyB4OiAwLCB5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAxLCBjb2xvcjogJyMwMDAwMDAnLCBvcGFjaXR5OiAxLCBsYWJlbDogJycgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGlzcGxheUhhbmRsZXJzOiB0cnVlLFxuICAgICAgaGFuZGxlcldpZHRoOiAyLFxuICAgICAgaGFuZGxlck9wYWNpdHk6IDAuOCxcbiAgICAgIG9wYWNpdHk6IDAuNixcbiAgICAgIGRpc3BsYXlMYWJlbHM6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbCkgeyByZXR1cm4gdGhpcy4kZWw7IH1cblxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdnJyk7XG5cbiAgICB0aGlzLiRzZWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdyZWN0Jyk7XG4gICAgdGhpcy4kc2VnbWVudC5jbGFzc0xpc3QuYWRkKCdzZWdtZW50Jyk7XG4gICAgdGhpcy4kc2VnbWVudC5zdHlsZS5vcGFjaXR5ID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcbiAgICB0aGlzLiRzZWdtZW50LnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kc2VnbWVudCk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZGlzcGxheUhhbmRsZXJzKSB7XG4gICAgICB0aGlzLiRsZWZ0SGFuZGxlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncmVjdCcpO1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuY2xhc3NMaXN0LmFkZCgnbGVmdCcsICdoYW5kbGVyJyk7XG4gICAgICB0aGlzLiRsZWZ0SGFuZGxlci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB0aGlzLnBhcmFtcy5oYW5kbGVyV2lkdGgpO1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG4gICAgICB0aGlzLiRsZWZ0SGFuZGxlci5zdHlsZS5vcGFjaXR5ID0gdGhpcy5wYXJhbXMuaGFuZGxlck9wYWNpdHk7XG4gICAgICB0aGlzLiRsZWZ0SGFuZGxlci5zdHlsZS5jdXJzb3IgPSAnZXctcmVzaXplJztcblxuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdyZWN0Jyk7XG4gICAgICB0aGlzLiRyaWdodEhhbmRsZXIuY2xhc3NMaXN0LmFkZCgncmlnaHQnLCAnaGFuZGxlcicpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHRoaXMucGFyYW1zLmhhbmRsZXJXaWR0aCk7XG4gICAgICB0aGlzLiRyaWdodEhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG4gICAgICB0aGlzLiRyaWdodEhhbmRsZXIuc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLmhhbmRsZXJPcGFjaXR5O1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnN0eWxlLmN1cnNvciA9ICdldy1yZXNpemUnO1xuXG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRsZWZ0SGFuZGxlcik7XG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRyaWdodEhhbmRsZXIpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcmFtcy5kaXNwbGF5TGFiZWxzKSB7XG4gICAgICAvLyBwcmVmZXIgaHRtbCBgZGl2YCBvdmVyIHN2ZyBgdGV4dGAgdGFnIGJlY2F1c2Ugd2UgdGhlbiB1c2UgdGhlIGBjb250ZW50ZWRpdGFibGVgIHByb3BlcnR5XG4gICAgICB0aGlzLiRmb3JlaWduT2JqZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdmb3JlaWduT2JqZWN0Jyk7XG5cbiAgICAgIHRoaXMuJGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0aGlzLiRsYWJlbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIHRoaXMuJGxhYmVsLnN0eWxlLndpZHRoID0gJzUwcHgnO1xuICAgICAgdGhpcy4kbGFiZWwuc3R5bGUuZm9udFNpemUgPSAnMTJweCc7XG4gICAgICB0aGlzLiRsYWJlbC5zdHlsZS5mb250RmFtaWx5ID0gJ2FyaWFsJztcbiAgICAgIHRoaXMuJGxhYmVsLnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XG5cbiAgICAgIHRoaXMuJGZvcmVpZ25PYmplY3QuYXBwZW5kQ2hpbGQodGhpcy4kbGFiZWwpO1xuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kZm9yZWlnbk9iamVjdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy54KGRhdHVtKSk7XG4gICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMueShkYXR1bSkpO1xuXG4gICAgY29uc3Qgd2lkdGggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMud2lkdGgoZGF0dW0pKTtcbiAgICBjb25zdCBoZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLmhlaWdodChkYXR1bSkpO1xuICAgIGNvbnN0IGNvbG9yID0gdGhpcy5jb2xvcihkYXR1bSk7XG4gICAgY29uc3Qgb3BhY2l0eSA9IHRoaXMub3BhY2l0eShkYXR1bSk7XG5cbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3h9LCAke3l9KWApO1xuICAgIHRoaXMuJGVsLnN0eWxlLm9wYWNpdHkgPSBvcGFjaXR5O1xuXG4gICAgdGhpcy4kc2VnbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCBNYXRoLm1heCh3aWR0aCwgMCkpO1xuICAgIHRoaXMuJHNlZ21lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgdGhpcy4kc2VnbWVudC5zdHlsZS5maWxsID0gY29sb3I7XG5cblxuICAgIGlmICh0aGlzLnBhcmFtcy5kaXNwbGF5SGFuZGxlcnMpIHtcbiAgICAgIC8vIGRpc3BsYXkgaGFuZGxlcnNcbiAgICAgIHRoaXMuJGxlZnRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgdGhpcy4kbGVmdEhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwgMCknKTtcbiAgICAgIHRoaXMuJGxlZnRIYW5kbGVyLnN0eWxlLmZpbGwgPSBjb2xvcjtcblxuICAgICAgY29uc3QgcmlnaHRIYW5kbGVyVHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgke3dpZHRoIC0gdGhpcy5wYXJhbXMuaGFuZGxlcldpZHRofSwgMClgO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCByaWdodEhhbmRsZXJUcmFuc2xhdGUpO1xuICAgICAgdGhpcy4kcmlnaHRIYW5kbGVyLnN0eWxlLmZpbGwgPSBjb2xvcjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZGlzcGxheUxhYmVscykge1xuICAgICAgY29uc3QgbWF0cml4ID0gYG1hdHJpeCgxLCAwLCAwLCAtMSwgNCwgJHtoZWlnaHQgLSAyfSlgXG4gICAgICB0aGlzLiRmb3JlaWduT2JqZWN0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBtYXRyaXgpO1xuICAgICAgdGhpcy4kbGFiZWwuaW5uZXJIVE1MID0gdGhpcy5sYWJlbChkYXR1bSk7XG4gICAgfVxuICB9XG5cbiAgaW5BcmVhKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mikge1xuICAgIGNvbnN0IHNoYXBlWDEgPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkYXR1bSkpO1xuICAgIGNvbnN0IHNoYXBlWDIgPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkYXR1bSkgKyB0aGlzLndpZHRoKGRhdHVtKSk7XG4gICAgY29uc3Qgc2hhcGVZMSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMueShkYXR1bSkpO1xuICAgIGNvbnN0IHNoYXBlWTIgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLnkoZGF0dW0pICsgdGhpcy5oZWlnaHQoZGF0dW0pKTtcblxuICAgIC8vIGh0dHA6Ly9qc2ZpZGRsZS5uZXQvdXRoeVovIC0gY2hlY2sgb3ZlcmxhcGluZyBhcmVhXG4gICAgY29uc3QgeE92ZXJsYXAgPSBNYXRoLm1heCgwLCBNYXRoLm1pbih4Miwgc2hhcGVYMikgLSBNYXRoLm1heCh4MSwgc2hhcGVYMSkpO1xuICAgIGNvbnN0IHlPdmVybGFwID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oeTIsIHNoYXBlWTIpIC0gTWF0aC5tYXgoeTEsIHNoYXBlWTEpKTtcbiAgICBjb25zdCBhcmVhID0geE92ZXJsYXAgKiB5T3ZlcmxhcDtcblxuICAgIHJldHVybiBhcmVhID4gMDtcbiAgfVxufVxuIl19