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

      var minX = renderingContext.minX,
          maxX = renderingContext.maxX;

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
}(_BaseShape3.default);

exports.default = Waveform;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndhdmVmb3JtLmpzIl0sIm5hbWVzIjpbInhodG1sTlMiLCJXYXZlZm9ybSIsInNhbXBsZVJhdGUiLCJjb2xvciIsIm9wYWNpdHkiLCJyZW5kZXJpbmdDb250ZXh0IiwiJGVsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50TlMiLCJucyIsInNldEF0dHJpYnV0ZU5TIiwicGFyYW1zIiwic3R5bGUiLCJkYXR1bSIsInNsaWNlTWV0aG9kIiwiRmxvYXQzMkFycmF5IiwibmJyU2FtcGxlcyIsImxlbmd0aCIsImR1cmF0aW9uIiwid2lkdGgiLCJ0aW1lVG9QaXhlbCIsInNhbXBsZXNQZXJQaXhlbCIsIm1pblgiLCJtYXhYIiwiaW52ZXJ0IiwibWluTWF4IiwicHgiLCJzdGFydFRpbWUiLCJzdGFydFNhbXBsZSIsImV4dHJhY3QiLCJtaW4iLCJJbmZpbml0eSIsIm1heCIsImoiLCJsIiwic2FtcGxlIiwiaXNGaW5pdGUiLCJwdXNoIiwiUElYRUwiLCJNSU4iLCJNQVgiLCJkIiwiaSIsIngiLCJ5MSIsIk1hdGgiLCJyb3VuZCIsInZhbHVlVG9QaXhlbCIsInkyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFHQSxJQUFNQSxVQUFVLDhCQUFoQjs7QUFFQTs7Ozs7Ozs7SUFPTUMsUTs7Ozs7Ozs7OzttQ0FDVztBQUFFLGFBQU8sVUFBUDtBQUFvQjs7O3VDQUVsQjtBQUNqQjtBQUNBLGFBQU8sRUFBUDtBQUNEOzs7bUNBRWM7QUFDYixhQUFPO0FBQ0xDLG9CQUFZLEtBRFA7QUFFTEMsZUFBTyxTQUZGO0FBR0xDLGlCQUFTO0FBQ1Q7QUFKSyxPQUFQO0FBTUQ7OzsyQkFFTUMsZ0IsRUFBa0I7QUFDdkIsVUFBSSxLQUFLQyxHQUFULEVBQ0UsT0FBTyxLQUFLQSxHQUFaOztBQUVGOztBQUVBLFdBQUtBLEdBQUwsR0FBV0MsU0FBU0MsZUFBVCxDQUF5QixLQUFLQyxFQUE5QixFQUFrQyxNQUFsQyxDQUFYO0FBQ0EsV0FBS0gs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Q0EsY0FBSU0sS0FBS0MsS0FBS0MsS0FBTCxDQUFXekMsaUJBQWlCMEMsWUFBakIsQ0FBOEJsQyxPQUFNMEIsR0FBTixDQUE5QixDQUFYLENBQVQ7QUFDQSxjQUFJUyxLQUFLSCxLQUFLQyxLQUFMLENBQVd6QyxpQkFBaUIwQyxZQUFqQixDQUE4QmxDLE9BQU0yQixHQUFOLENBQTlCLENBQVgsQ0FBVDs7QUFFQUMsZUFBUUUsQ0FBUixTQUFhQyxFQUFiLFNBQW1CRCxDQUFuQixTQUF3QkssRUFBeEI7O0FBRUEsY0FBSU4sSUFBSVIsS0FBSSxDQUFaLEVBQ0VPLEtBQUssR0FBTDtBQUNIOztBQUVELGFBQUtuQyxHQUFMLENBQVNJLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsR0FBOUIsRUFBbUMrQixDQUFuQzs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Q7QUFDRjs7Ozs7a0JBR1l4QyxRIiwiZmlsZSI6IndhdmVmb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL0Jhc2VTaGFwZSc7XG5cblxuY29uc3QgeGh0bWxOUyA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJztcblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgYSB3YXZlZm9ybS4gKGZvciBlbnRpdHkgZGF0YSlcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci13YXZlZm9ybS5odG1sKVxuICpcbiAqIEB0b2RvIC0gZml4IHByb2JsZW1zIHdpdGggY2FudmFzIHN0cmF0ZWd5LlxuICovXG5jbGFzcyBXYXZlZm9ybSBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICd3YXZlZm9ybSc7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIC8vIHJldHVybiB7IHk6IDAgfTtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNhbXBsZVJhdGU6IDQ0MTAwLFxuICAgICAgY29sb3I6ICcjMDAwMDAwJyxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAvLyByZW5kZXJpbmdTdHJhdGVneTogJ3N2ZycgLy8gY2FudmFzIGlzIGJ1Z2dlZCAodHJhbnNsYXRpb24sIGV0Yy4uLilcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpXG4gICAgICByZXR1cm4gdGhpcy4kZWw7XG5cbiAgICAvLyBpZiAodGhpcy5wYXJhbXMucmVuZGVyaW5nU3RyYXRlZ3kgPT09ICdzdmcnKSB7XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncGF0aCcpO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMuY29sb3IpO1xuICAgIHRoaXMuJGVsLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuXG4gICAgLy8gfSBlbHNlIGlmICh0aGlzLnBhcmFtcy5yZW5kZXJpbmdTdHJhdGVneSA9PT0gJ2NhbnZhcycpIHtcblxuICAgIC8vICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2ZvcmVpZ25PYmplY3QnKTtcbiAgICAvLyAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHJlbmRlcmluZ0NvbnRleHQud2lkdGgpO1xuICAgIC8vICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0KTtcblxuICAgIC8vICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHhodG1sTlMsICd4aHRtbDpjYW52YXMnKTtcblxuICAgIC8vICAgdGhpcy5fY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgLy8gICB0aGlzLl9jdHguY2FudmFzLndpZHRoID0gcmVuZGVyaW5nQ29udGV4dC53aWR0aDtcbiAgICAvLyAgIHRoaXMuX2N0eC5jYW52YXMuaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG5cbiAgICAvLyAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgLy8gfVxuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgLy8gZGVmaW5lIG5iciBvZiBzYW1wbGVzIHBlciBwaXhlbHNcbiAgICBjb25zdCBzbGljZU1ldGhvZCA9IGRhdHVtIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5ID8gJ3N1YmFycmF5JyA6ICdzbGljZSc7XG4gICAgY29uc3QgbmJyU2FtcGxlcyA9IGRhdHVtLmxlbmd0aDtcbiAgICBjb25zdCBkdXJhdGlvbiA9IG5iclNhbXBsZXMgLyB0aGlzLnBhcmFtcy5zYW1wbGVSYXRlO1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChkdXJhdGlvbik7XG4gICAgY29uc3Qgc2FtcGxlc1BlclBpeGVsID0gbmJyU2FtcGxlcyAvIHdpZHRoO1xuXG4gICAgaWYgKCFzYW1wbGVzUGVyUGl4ZWwgfHwgZGF0dW0ubGVuZ3RoIDwgc2FtcGxlc1BlclBpeGVsKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgeyBtaW5YLCBtYXhYIH0gPSByZW5kZXJpbmdDb250ZXh0O1xuXG4gICAgLy8gZ2V0IG1pbi9tYXggcGVyIHBpeGVscywgY2xhbXBlZCB0byB0aGUgdmlzaWJsZSBhcmVhXG4gICAgY29uc3QgaW52ZXJ0ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQ7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMucGFyYW1zLnNhbXBsZVJhdGU7XG4gICAgY29uc3QgbWluTWF4ID0gW107XG5cbiAgICBmb3IgKGxldCBweCA9IG1pblg7IHB4IDwgbWF4WDsgcHgrKykge1xuICAgICAgY29uc3Qgc3RhcnRUaW1lID0gaW52ZXJ0KHB4KTtcbiAgICAgIGNvbnN0IHN0YXJ0U2FtcGxlID0gc3RhcnRUaW1lICogc2FtcGxlUmF0ZTtcbiAgICAgIGNvbnN0IGV4dHJhY3QgPSBkYXR1bVtzbGljZU1ldGhvZF0oc3RhcnRTYW1wbGUsIHN0YXJ0U2FtcGxlICsgc2FtcGxlc1BlclBpeGVsKTtcblxuICAgICAgbGV0IG1pbiA9IEluZmluaXR5O1xuICAgICAgbGV0IG1heCA9IC1JbmZpbml0eTtcblxuICAgICAgZm9yIChsZXQgaiA9IDAsIGwgPSBleHRyYWN0Lmxlbmd0aDsgaiA8IGw7IGorKykge1xuICAgICAgICBsZXQgc2FtcGxlID0gZXh0cmFjdFtqXTtcbiAgICAgICAgaWYgKHNhbXBsZSA8IG1pbikgbWluID0gc2FtcGxlO1xuICAgICAgICBpZiAoc2FtcGxlID4gbWF4KSBtYXggPSBzYW1wbGU7XG4gICAgICB9XG4gICAgICAvLyBkaXNhbGxvdyBJbmZpbml0eVxuICAgICAgbWluID0gIWlzRmluaXRlKG1pbikgPyAwIDogbWluO1xuICAgICAgbWF4ID0gIWlzRmluaXRlKG1heCkgPyAwIDogbWF4O1xuXG4gICAgICBtaW5NYXgucHVzaChbcHgsIG1pbiwgbWF4XSk7XG4gICAgfVxuXG4gICAgaWYgKG1pbk1heC5sZW5ndGgpIHtcblxuICAgICAgY29uc3QgUElYRUwgPSAwO1xuICAgICAgY29uc3QgTUlOICAgPSAxO1xuICAgICAgY29uc3QgTUFYICAgPSAyO1xuXG4gICAgICAvLyByZW5kZXJpbmcgc3RyYXRlZ2llc1xuICAgICAgLy8gaWYgKHRoaXMucGFyYW1zLnJlbmRlcmluZ1N0cmF0ZWd5ID09PSAnc3ZnJykge1xuXG4gICAgICBsZXQgZCA9ICdNJztcblxuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBtaW5NYXgubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGRhdHVtID0gbWluTWF4W2ldO1xuICAgICAgICBjb25zdCB4ICA9IGRhdHVtW1BJWEVMXTtcbiAgICAgICAgbGV0IHkxID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChkYXR1bVtNSU5dKSk7XG4gICAgICAgIGxldCB5MiA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoZGF0dW1bTUFYXSkpO1xuXG4gICAgICAgIGQgKz0gYCR7eH0sJHt5MX1MJHt4fSwke3kyfWA7XG5cbiAgICAgICAgaWYgKGkgPCBsIC0gMSlcbiAgICAgICAgICBkICs9ICdMJztcbiAgICAgIH1cblxuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCBkKTtcblxuICAgICAgLy8gfSBlbHNlIGlmICh0aGlzLnBhcmFtcy5yZW5kZXJpbmdTdHJhdGVneSA9PT0gJ2NhbnZhcycpIHtcblxuICAgICAgLy8gICB0aGlzLl9jdHguY2FudmFzLndpZHRoID0gd2lkdGg7XG4gICAgICAvLyAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCB3aWR0aCk7XG4gICAgICAvLyAgIC8vIGZpeCBjaHJvbWUgYnVnIHdpdGggdHJhbnNsYXRlXG4gICAgICAvLyAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignY2hyb21lJykgPiAtMSkge1xuICAgICAgLy8gICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZSgneCcsIHJlbmRlcmluZ0NvbnRleHQub2Zmc2V0WCk7XG4gICAgICAvLyAgIH1cblxuICAgICAgLy8gICB0aGlzLl9jdHguc3Ryb2tlU3R5bGUgPSB0aGlzLnBhcmFtcy5jb2xvcjtcbiAgICAgIC8vICAgdGhpcy5fY3R4Lmdsb2JhbEFscGhhID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcbiAgICAgIC8vICAgdGhpcy5fY3R4Lm1vdmVUbyhyZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKDApLCByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCgwKSk7XG5cbiAgICAgIC8vICAgbWluTWF4LmZvckVhY2goKGRhdHVtKSA9PiB7XG4gICAgICAvLyAgICAgY29uc3QgeCAgPSBkYXR1bVtQSVhFTF07XG4gICAgICAvLyAgICAgbGV0IHkxID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChkYXR1bVtNSU5dKSk7XG4gICAgICAvLyAgICAgbGV0IHkyID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChkYXR1bVtNQVhdKSk7XG5cbiAgICAgIC8vICAgICB0aGlzLl9jdHgubW92ZVRvKHgsIHkxKTtcbiAgICAgIC8vICAgICB0aGlzLl9jdHgubGluZVRvKHgsIHkyKTtcbiAgICAgIC8vICAgfSk7XG5cbiAgICAgIC8vICAgdGhpcy5fY3R4LnN0cm9rZSgpO1xuICAgICAgLy8gfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBXYXZlZm9ybTtcbiJdfQ==