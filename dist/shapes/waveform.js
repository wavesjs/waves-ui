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

var xhtmlNS = 'http://www.w3.org/1999/xhtml';

/**
 * A shape to display a waveform. (for entity data)
 *
 * [example usage](./examples/layer-waveform.html)
 *
 * @todo - fix problems with canvas strategy.
 */

var Waveform = function (_BaseShape) {
  (0, _inherits3.default)(Waveform, _BaseShape);

  function Waveform() {
    (0, _classCallCheck3.default)(this, Waveform);
    return (0, _possibleConstructorReturn3.default)(this, (Waveform.__proto__ || (0, _getPrototypeOf2.default)(Waveform)).apply(this, arguments));
  }

  (0, _createClass3.default)(Waveform, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'waveform';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      // return { y: 0 };
      return {};
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        sampleRate: 44100,
        color: '#000000',
        opacity: 1
        // renderingStrategy: 'svg' // canvas is bugged (translation, etc...)
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) return this.$el;

      // if (this.params.renderingStrategy === 'svg') {

      this.$el = document.createElementNS(this.ns, 'path');
      this.$el.setAttributeNS(null, 'fill', 'none');
      this.$el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
      this.$el.setAttributeNS(null, 'stroke', this.params.color);
      this.$el.style.opacity = this.params.opacity;

      // } else if (this.params.renderingStrategy === 'canvas') {

      //   this.$el = document.createElementNS(this.ns, 'foreignObject');
      //   this.$el.setAttributeNS(null, 'width', renderingContext.width);
      //   this.$el.setAttributeNS(null, 'height', renderingContext.height);

      //   const canvas = document.createElementNS(xhtmlNS, 'xhtml:canvas');

      //   this._ctx = canvas.getContext('2d');
      //   this._ctx.canvas.width = renderingContext.width;
      //   this._ctx.canvas.height = renderingContext.height;

      //   this.$el.appendChild(canvas);
      // }

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      // define nbr of samples per pixels
      var sliceMethod = datum instanceof Float32Array ? 'subarray' : 'slice';
      var nbrSamples = datum.length;
      var duration = nbrSamples / this.params.sampleRate;
      var width = renderingContext.timeToPixel(duration);
      var samplesPerPixel = nbrSamples / width;

      if (!samplesPerPixel || datum.length < samplesPerPixel) {
        return;
      }

      // compute/draw visible area only
      // @TODO refactor this ununderstandable mess
      var minX = Math.max(-renderingContext.offsetX, 0);
      var trackDecay = renderingContext.trackOffsetX + renderingContext.startX;
      if (trackDecay < 0) {
        minX = -trackDecay;
      }

      var maxX = minX;
      maxX += renderingContext.width - minX < renderingContext.visibleWidth ? renderingContext.width : renderingContext.visibleWidth;

      // get min/max per pixels, clamped to the visible area
      var invert = renderingContext.timeToPixel.invert;
      var sampleRate = this.params.sampleRate;
      var minMax = [];

      for (var px = minX; px < maxX; px++) {
        var startTime = invert(px);
        var startSample = startTime * sampleRate;
        var extract = datum[sliceMethod](startSample, startSample + samplesPerPixel);

        var min = Infinity;
        var max = -Infinity;

        for (var j = 0, l = extract.length; j < l; j++) {
          var sample = extract[j];
          if (sample < min) min = sample;
          if (sample > max) max = sample;
        }
        // disallow Infinity
        min = !isFinite(min) ? 0 : min;
        max = !isFinite(max) ? 0 : max;

        minMax.push([px, min, max]);
      }

      if (minMax.length) {

        var PIXEL = 0;
        var MIN = 1;
        var MAX = 2;

        // rendering strategies
        // if (this.params.renderingStrategy === 'svg') {

        var d = 'M';

        for (var i = 0, _l = minMax.length; i < _l; i++) {
          var _datum = minMax[i];
          var x = _datum[PIXEL];
          var y1 = Math.round(renderingContext.valueToPixel(_datum[MIN]));
          var y2 = Math.round(renderingContext.valueToPixel(_datum[MAX]));

          d += x + ',' + y1 + 'L' + x + ',' + y2;

          if (i < _l - 1) d += 'L';
        }

        this.$el.setAttributeNS(null, 'd', d);

        // } else if (this.params.renderingStrategy === 'canvas') {

        //   this._ctx.canvas.width = width;
        //   this.$el.setAttribute('width', width);
        //   // fix chrome bug with translate
        //   if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        //     this.$el.setAttribute('x', renderingContext.offsetX);
        //   }

        //   this._ctx.strokeStyle = this.params.color;
        //   this._ctx.globalAlpha = this.params.opacity;
        //   this._ctx.moveTo(renderingContext.timeToPixel(0), renderingContext.valueToPixel(0));

        //   minMax.forEach((datum) => {
        //     const x  = datum[PIXEL];
        //     let y1 = Math.round(renderingContext.valueToPixel(datum[MIN]));
        //     let y2 = Math.round(renderingContext.valueToPixel(datum[MAX]));

        //     this._ctx.moveTo(x, y1);
        //     this._ctx.lineTo(x, y2);
        //   });

        //   this._ctx.stroke();
        // }
      }
    }
  }]);
  return Waveform;
}(_baseShape2.default);

exports.default = Waveform;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndhdmVmb3JtLmpzIl0sIm5hbWVzIjpbInhodG1sTlMiLCJXYXZlZm9ybSIsInNhbXBsZVJhdGUiLCJjb2xvciIsIm9wYWNpdHkiLCJyZW5kZXJpbmdDb250ZXh0IiwiJGVsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50TlMiLCJucyIsInNldEF0dHJpYnV0ZU5TIiwicGFyYW1zIiwic3R5bGUiLCJkYXR1bSIsInNsaWNlTWV0aG9kIiwiRmxvYXQzMkFycmF5IiwibmJyU2FtcGxlcyIsImxlbmd0aCIsImR1cmF0aW9uIiwid2lkdGgiLCJ0aW1lVG9QaXhlbCIsInNhbXBsZXNQZXJQaXhlbCIsIm1pblgiLCJNYXRoIiwibWF4Iiwib2Zmc2V0WCIsInRyYWNrRGVjYXkiLCJ0cmFja09mZnNldFgiLCJzdGFydFgiLCJtYXhYIiwidmlzaWJsZVdpZHRoIiwiaW52ZXJ0IiwibWluTWF4IiwicHgiLCJzdGFydFRpbWUiLCJzdGFydFNhbXBsZSIsImV4dHJhY3QiLCJtaW4iLCJJbmZpbml0eSIsImoiLCJsIiwic2FtcGxlIiwiaXNGaW5pdGUiLCJwdXNoIiwiUElYRUwiLCJNSU4iLCJNQVgiLCJkIiwiaSIsIngiLCJ5MSIsInJvdW5kIiwidmFsdWVUb1BpeGVsIiwieTIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUdBLElBQU1BLFVBQVUsOEJBQWhCOztBQUVBOzs7Ozs7OztJQU9NQyxROzs7Ozs7Ozs7O21DQUNXO0FBQUUsYUFBTyxVQUFQO0FBQW9COzs7dUNBRWxCO0FBQ2pCO0FBQ0EsYUFBTyxFQUFQO0FBQ0Q7OzttQ0FFYztBQUNiLGFBQU87QUFDTEMsb0JBQVksS0FEUDtBQUVMQyxlQUFPLFNBRkY7QUFHTEMsaUJBQVM7QUFDVDtBQUpLLE9BQVA7QUFNRDs7OzJCQUVNQyxnQixFQUFrQjtBQUN2QixVQUFJLEtBQUtDLEdBQVQsRUFDRSxPQUFPLEtBQUtBLEdBQVo7O0FBRUY7O0FBRUEsV0FBS0EsR0FBTCxH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QUFaO0FBQ0Q7O0FBRUQsVUFBSVEsT0FBT2YsTUFBWCxFQUFtQjs7QUFFakIsWUFBTTJCLFFBQVEsQ0FBZDtBQUNBLFlBQU1DLE1BQVEsQ0FBZDtBQUNBLFlBQU1DLE1BQVEsQ0FBZDs7QUFFQTtBQUNBOztBQUVBLFlBQUlDLElBQUksR0FBUjs7QUFFQSxhQUFLLElBQUlDLElBQUksQ0FBUixFQUFXUixLQUFJUixPQUFPZixNQUEzQixFQUFtQytCLElBQUlSLEVBQXZDLEVBQTBDUSxHQUExQyxFQUErQztBQUM3QyxjQUFNbkMsU0FBUW1CLE9BQU9nQixDQUFQLENBQWQ7QUFDQSxjQUFNQyxJQUFLcEMsT0FBTStCLEtBQU4sQ0FBWDtBQUNBLGNBQUlNLEtBQUszQixLQUFLNEIsS0FBTCxDQUFXOUMsaUJBQWlCK0MsWUFBakIsQ0FBOEJ2QyxPQUFNZ0MsR0FBTixDQUE5QixDQUFYLENBQVQ7QUFDQSxjQUFJUSxLQUFLOUIsS0FBSzRCLEtBQUwsQ0FBVzlDLGlCQUFpQitDLFlBQWpCLENBQThCdkMsT0FBTWlDLEdBQU4sQ0FBOUIsQ0FBWCxDQUFUOztBQUVBQyxlQUFRRSxDQUFSLFNBQWFDLEVBQWIsU0FBbUJELENBQW5CLFNBQXdCSSxFQUF4Qjs7QUFFQSxjQUFJTCxJQUFJUixLQUFJLENBQVosRUFDRU8sS0FBSyxHQUFMO0FBQ0g7O0FBRUQsYUFBS3pDLEdBQUwsQ0FBU0ksY0FBVCxDQUF3QixJQUF4QixFQUE4QixHQUE5QixFQUFtQ3FDLENBQW5DOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDRDtBQUNGOzs7OztrQkFHWTlDLFEiLCJmaWxlIjoid2F2ZWZvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuY29uc3QgeGh0bWxOUyA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJztcblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgYSB3YXZlZm9ybS4gKGZvciBlbnRpdHkgZGF0YSlcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci13YXZlZm9ybS5odG1sKVxuICpcbiAqIEB0b2RvIC0gZml4IHByb2JsZW1zIHdpdGggY2FudmFzIHN0cmF0ZWd5LlxuICovXG5jbGFzcyBXYXZlZm9ybSBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICd3YXZlZm9ybSc7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIC8vIHJldHVybiB7IHk6IDAgfTtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNhbXBsZVJhdGU6IDQ0MTAwLFxuICAgICAgY29sb3I6ICcjMDAwMDAwJyxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAvLyByZW5kZXJpbmdTdHJhdGVneTogJ3N2ZycgLy8gY2FudmFzIGlzIGJ1Z2dlZCAodHJhbnNsYXRpb24sIGV0Yy4uLilcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpXG4gICAgICByZXR1cm4gdGhpcy4kZWw7XG5cbiAgICAvLyBpZiAodGhpcy5wYXJhbXMucmVuZGVyaW5nU3RyYXRlZ3kgPT09ICdzdmcnKSB7XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncGF0aCcpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMuY29sb3IpO1xuICAgIHRoaXMuJGVsLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuXG4gICAgLy8gfSBlbHNlIGlmICh0aGlzLnBhcmFtcy5yZW5kZXJpbmdTdHJhdGVneSA9PT0gJ2NhbnZhcycpIHtcblxuICAgIC8vICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2ZvcmVpZ25PYmplY3QnKTtcbiAgICAvLyAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHJlbmRlcmluZ0NvbnRleHQud2lkdGgpO1xuICAgIC8vICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0KTtcblxuICAgIC8vICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHhodG1sTlMsICd4aHRtbDpjYW52YXMnKTtcblxuICAgIC8vICAgdGhpcy5fY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgLy8gICB0aGlzLl9jdHguY2FudmFzLndpZHRoID0gcmVuZGVyaW5nQ29udGV4dC53aWR0aDtcbiAgICAvLyAgIHRoaXMuX2N0eC5jYW52YXMuaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG5cbiAgICAvLyAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgLy8gfVxuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgLy8gZGVmaW5lIG5iciBvZiBzYW1wbGVzIHBlciBwaXhlbHNcbiAgICBjb25zdCBzbGljZU1ldGhvZCA9IGRhdHVtIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5ID8gJ3N1YmFycmF5JyA6ICdzbGljZSc7XG4gICAgY29uc3QgbmJyU2FtcGxlcyA9IGRhdHVtLmxlbmd0aDtcbiAgICBjb25zdCBkdXJhdGlvbiA9IG5iclNhbXBsZXMgLyB0aGlzLnBhcmFtcy5zYW1wbGVSYXRlO1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChkdXJhdGlvbik7XG4gICAgY29uc3Qgc2FtcGxlc1BlclBpeGVsID0gbmJyU2FtcGxlcyAvIHdpZHRoO1xuXG4gICAgaWYgKCFzYW1wbGVzUGVyUGl4ZWwgfHwgZGF0dW0ubGVuZ3RoIDwgc2FtcGxlc1BlclBpeGVsKSB7IHJldHVybjsgfVxuXG4gICAgLy8gY29tcHV0ZS9kcmF3IHZpc2libGUgYXJlYSBvbmx5XG4gICAgLy8gQFRPRE8gcmVmYWN0b3IgdGhpcyB1bnVuZGVyc3RhbmRhYmxlIG1lc3NcbiAgICBsZXQgbWluWCA9IE1hdGgubWF4KC1yZW5kZXJpbmdDb250ZXh0Lm9mZnNldFgsIDApO1xuICAgIGxldCB0cmFja0RlY2F5ID0gcmVuZGVyaW5nQ29udGV4dC50cmFja09mZnNldFggKyByZW5kZXJpbmdDb250ZXh0LnN0YXJ0WDtcbiAgICBpZiAodHJhY2tEZWNheSA8IDApIHsgbWluWCA9IC10cmFja0RlY2F5OyB9XG5cbiAgICBsZXQgbWF4WCA9IG1pblg7XG4gICAgbWF4WCArPSAocmVuZGVyaW5nQ29udGV4dC53aWR0aCAtIG1pblggPCByZW5kZXJpbmdDb250ZXh0LnZpc2libGVXaWR0aCkgP1xuICAgICAgcmVuZGVyaW5nQ29udGV4dC53aWR0aCA6IHJlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoO1xuXG4gICAgLy8gZ2V0IG1pbi9tYXggcGVyIHBpeGVscywgY2xhbXBlZCB0byB0aGUgdmlzaWJsZSBhcmVhXG4gICAgY29uc3QgaW52ZXJ0ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQ7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMucGFyYW1zLnNhbXBsZVJhdGU7XG4gICAgY29uc3QgbWluTWF4ID0gW107XG5cbiAgICBmb3IgKGxldCBweCA9IG1pblg7IHB4IDwgbWF4WDsgcHgrKykge1xuICAgICAgY29uc3Qgc3RhcnRUaW1lID0gaW52ZXJ0KHB4KTtcbiAgICAgIGNvbnN0IHN0YXJ0U2FtcGxlID0gc3RhcnRUaW1lICogc2FtcGxlUmF0ZTtcbiAgICAgIGNvbnN0IGV4dHJhY3QgPSBkYXR1bVtzbGljZU1ldGhvZF0oc3RhcnRTYW1wbGUsIHN0YXJ0U2FtcGxlICsgc2FtcGxlc1BlclBpeGVsKTtcblxuICAgICAgbGV0IG1pbiA9IEluZmluaXR5O1xuICAgICAgbGV0IG1heCA9IC1JbmZpbml0eTtcblxuICAgICAgZm9yIChsZXQgaiA9IDAsIGwgPSBleHRyYWN0Lmxlbmd0aDsgaiA8IGw7IGorKykge1xuICAgICAgICBsZXQgc2FtcGxlID0gZXh0cmFjdFtqXTtcbiAgICAgICAgaWYgKHNhbXBsZSA8IG1pbikgbWluID0gc2FtcGxlO1xuICAgICAgICBpZiAoc2FtcGxlID4gbWF4KSBtYXggPSBzYW1wbGU7XG4gICAgICB9XG4gICAgICAvLyBkaXNhbGxvdyBJbmZpbml0eVxuICAgICAgbWluID0gIWlzRmluaXRlKG1pbikgPyAwIDogbWluO1xuICAgICAgbWF4ID0gIWlzRmluaXRlKG1heCkgPyAwIDogbWF4O1xuXG4gICAgICBtaW5NYXgucHVzaChbcHgsIG1pbiwgbWF4XSk7XG4gICAgfVxuXG4gICAgaWYgKG1pbk1heC5sZW5ndGgpIHtcblxuICAgICAgY29uc3QgUElYRUwgPSAwO1xuICAgICAgY29uc3QgTUlOICAgPSAxO1xuICAgICAgY29uc3QgTUFYICAgPSAyO1xuXG4gICAgICAvLyByZW5kZXJpbmcgc3RyYXRlZ2llc1xuICAgICAgLy8gaWYgKHRoaXMucGFyYW1zLnJlbmRlcmluZ1N0cmF0ZWd5ID09PSAnc3ZnJykge1xuXG4gICAgICBsZXQgZCA9ICdNJztcblxuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBtaW5NYXgubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGRhdHVtID0gbWluTWF4W2ldO1xuICAgICAgICBjb25zdCB4ICA9IGRhdHVtW1BJWEVMXTtcbiAgICAgICAgbGV0IHkxID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChkYXR1bVtNSU5dKSk7XG4gICAgICAgIGxldCB5MiA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoZGF0dW1bTUFYXSkpO1xuXG4gICAgICAgIGQgKz0gYCR7eH0sJHt5MX1MJHt4fSwke3kyfWA7XG5cbiAgICAgICAgaWYgKGkgPCBsIC0gMSlcbiAgICAgICAgICBkICs9ICdMJztcbiAgICAgIH1cblxuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCBkKTtcblxuICAgICAgLy8gfSBlbHNlIGlmICh0aGlzLnBhcmFtcy5yZW5kZXJpbmdTdHJhdGVneSA9PT0gJ2NhbnZhcycpIHtcblxuICAgICAgLy8gICB0aGlzLl9jdHguY2FudmFzLndpZHRoID0gd2lkdGg7XG4gICAgICAvLyAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCB3aWR0aCk7XG4gICAgICAvLyAgIC8vIGZpeCBjaHJvbWUgYnVnIHdpdGggdHJhbnNsYXRlXG4gICAgICAvLyAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignY2hyb21lJykgPiAtMSkge1xuICAgICAgLy8gICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZSgneCcsIHJlbmRlcmluZ0NvbnRleHQub2Zmc2V0WCk7XG4gICAgICAvLyAgIH1cblxuICAgICAgLy8gICB0aGlzLl9jdHguc3Ryb2tlU3R5bGUgPSB0aGlzLnBhcmFtcy5jb2xvcjtcbiAgICAgIC8vICAgdGhpcy5fY3R4Lmdsb2JhbEFscGhhID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcbiAgICAgIC8vICAgdGhpcy5fY3R4Lm1vdmVUbyhyZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKDApLCByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCgwKSk7XG5cbiAgICAgIC8vICAgbWluTWF4LmZvckVhY2goKGRhdHVtKSA9PiB7XG4gICAgICAvLyAgICAgY29uc3QgeCAgPSBkYXR1bVtQSVhFTF07XG4gICAgICAvLyAgICAgbGV0IHkxID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChkYXR1bVtNSU5dKSk7XG4gICAgICAvLyAgICAgbGV0IHkyID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChkYXR1bVtNQVhdKSk7XG5cbiAgICAgIC8vICAgICB0aGlzLl9jdHgubW92ZVRvKHgsIHkxKTtcbiAgICAgIC8vICAgICB0aGlzLl9jdHgubGluZVRvKHgsIHkyKTtcbiAgICAgIC8vICAgfSk7XG5cbiAgICAgIC8vICAgdGhpcy5fY3R4LnN0cm9rZSgpO1xuICAgICAgLy8gfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBXYXZlZm9ybTtcbiJdfQ==