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

var xhtmlNS = 'http://www.w3.org/1999/xhtml';

// @TODO create strategies object to clean the `if...else` mess
// var svgStrategy = {
//   render() {},
//   update() {}
// };

// var canvasStrategy = {
//   render() {},
//   update() {}
// };

var Waveform = (function (_BaseShape) {
  _inherits(Waveform, _BaseShape);

  function Waveform() {
    _classCallCheck(this, Waveform);

    _get(Object.getPrototypeOf(Waveform.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Waveform, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'waveform';
    }
  }, {
    key: '_getAccessorList',
    value: function _getAccessorList() {
      return { y: 0 };
    }
  }, {
    key: '_getDefaults',
    value: function _getDefaults() {
      return {
        sampleRate: 44100,
        color: '#000000',
        opacity: 1,
        renderingStrategy: 'svg' // canvas is bugged (translation, etc...)
      };
    }
  }, {
    key: 'render',
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }

      if (this.params.renderingStrategy === 'svg') {

        this.$el = document.createElementNS(this.ns, 'path');
        this.$el.setAttributeNS(null, 'fill', 'none');
        this.$el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        this.$el.setAttributeNS(null, 'stroke', this.params.color);
        this.$el.style.opacity = this.params.opacity;
      } else if (this.params.renderingStrategy === 'canvas') {

        this.$el = document.createElementNS(this.ns, 'foreignObject');
        this.$el.setAttributeNS(null, 'width', renderingContext.width);
        this.$el.setAttributeNS(null, 'height', renderingContext.height);

        var canvas = document.createElementNS(xhtmlNS, 'xhtml:canvas');

        this._ctx = canvas.getContext('2d');
        this._ctx.canvas.width = renderingContext.width;
        this._ctx.canvas.height = renderingContext.height;

        this.$el.appendChild(canvas);
      }

      return this.$el;
    }
  }, {
    key: 'update',
    value: function update(renderingContext, datum) {
      var _this = this;

      // define nbr of samples per pixels
      var sliceMethod = datum instanceof Float32Array ? 'subarray' : 'slice';
      var nbrSamples = datum.length;
      var duration = nbrSamples / this.params.sampleRate;
      var width = renderingContext.timeToPixel(duration);
      var samplesPerPixel = nbrSamples / width;

      if (!samplesPerPixel || datum.length < samplesPerPixel) {
        return;
      }

      var minMax = [];

      // use timeline's TimeContext attributes to compute/draw visible area only
      var minX = -renderingContext.trackOffsetX;
      var maxX = renderingContext.visibleWidth + minX;

      // get min/max per pixels
      for (var px = minX; px <= maxX; px++) {
        var startTime = renderingContext.timeToPixel.invert(px);
        var startSample = startTime * this.params.sampleRate;

        var extract = datum[sliceMethod](startSample, startSample + samplesPerPixel);

        var min = Infinity;
        var max = -Infinity;

        for (var j = 0; j < extract.length; j++) {
          var sample = extract[j];
          if (sample < min) {
            min = sample;
          }
          if (sample > max) {
            max = sample;
          }
        }
        // disallow Infinity
        min = min === Infinity || min === -Infinity ? 0 : min;
        max = max === Infinity || max === -Infinity ? 0 : max;

        if (min === 0 && max === 0) {
          continue;
        }

        minMax.push({ time: startTime, values: [min, max] });
      }

      var MIN = 0;
      var MAX = 1;

      if (!minMax.length) {
        return;
      }

      // rendering strategies
      if (this.params.renderingStrategy === 'svg') {

        var instructions = minMax.map(function (datum, index) {
          var x = Math.floor(renderingContext.timeToPixel(datum.time));
          var y1 = Math.round(renderingContext.valueToPixel(_this.y(datum.values[MIN])));
          var y2 = Math.round(renderingContext.valueToPixel(_this.y(datum.values[MAX])));

          return x + ',' + y1 + 'L' + x + ',' + y2;
        });

        var d = 'M' + instructions.join('L');
        this.$el.setAttributeNS(null, 'd', d);
      } else if (this.params.renderingStrategy === 'canvas') {

        this._ctx.canvas.width = width;
        this.$el.setAttribute('width', width);
        // fix chrome bug with translate
        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
          this.$el.setAttribute('x', renderingContext.offsetX);
        }

        this._ctx.strokeStyle = this.params.color;
        this._ctx.globalAlpha = this.params.opacity;
        this._ctx.moveTo(renderingContext.timeToPixel(0), renderingContext.valueToPixel(0));

        minMax.forEach(function (datum) {
          var x = renderingContext.timeToPixel(datum.time);
          var y1 = renderingContext.valueToPixel(_this.y(datum.values[MIN]));
          var y2 = renderingContext.valueToPixel(_this.y(datum.values[MAX]));

          _this._ctx.moveTo(x, y1);
          _this._ctx.lineTo(x, y2);
        });

        this._ctx.stroke();
      }
    }
  }]);

  return Waveform;
})(_baseShape2['default']);

exports['default'] = Waveform;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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T0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQ3hCLGNBQU0sQ0FBQyxHQUFJLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEQsY0FBTSxFQUFFLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLE1BQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BFLGNBQU0sRUFBRSxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxNQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFcEUsZ0JBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDeEIsZ0JBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDekIsQ0FBQyxDQUFDOztBQUVILFlBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDcEI7S0FDRjs7O1NBaElrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiJlczYvc2hhcGVzL3dhdmVmb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuXG5cbmNvbnN0IHhodG1sTlMgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCc7XG5cbi8vIEBUT0RPIGNyZWF0ZSBzdHJhdGVnaWVzIG9iamVjdCB0byBjbGVhbiB0aGUgYGlmLi4uZWxzZWAgbWVzc1xuLy8gdmFyIHN2Z1N0cmF0ZWd5ID0ge1xuLy8gICByZW5kZXIoKSB7fSxcbi8vICAgdXBkYXRlKCkge31cbi8vIH07XG5cbi8vIHZhciBjYW52YXNTdHJhdGVneSA9IHtcbi8vICAgcmVuZGVyKCkge30sXG4vLyAgIHVwZGF0ZSgpIHt9XG4vLyB9O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXZlZm9ybSBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICd3YXZlZm9ybSc7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IHk6IDAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2FtcGxlUmF0ZTogNDQxMDAsXG4gICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIHJlbmRlcmluZ1N0cmF0ZWd5OiAnc3ZnJyAvLyBjYW52YXMgaXMgYnVnZ2VkICh0cmFuc2xhdGlvbiwgZXRjLi4uKVxuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbCkgeyByZXR1cm4gdGhpcy4kZWw7IH1cblxuICAgIGlmICh0aGlzLnBhcmFtcy5yZW5kZXJpbmdTdHJhdGVneSA9PT0gJ3N2ZycpIHtcblxuICAgICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3BhdGgnKTtcbiAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcbiAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLmNvbG9yKTtcbiAgICAgIHRoaXMuJGVsLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuXG4gICAgfSBlbHNlIGlmICh0aGlzLnBhcmFtcy5yZW5kZXJpbmdTdHJhdGVneSA9PT0gJ2NhbnZhcycpIHtcblxuICAgICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2ZvcmVpZ25PYmplY3QnKTtcbiAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHJlbmRlcmluZ0NvbnRleHQud2lkdGgpO1xuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0KTtcblxuICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHhodG1sTlMsICd4aHRtbDpjYW52YXMnKTtcblxuICAgICAgdGhpcy5fY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICB0aGlzLl9jdHguY2FudmFzLndpZHRoID0gcmVuZGVyaW5nQ29udGV4dC53aWR0aDtcbiAgICAgIHRoaXMuX2N0eC5jYW52YXMuaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG5cbiAgICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgLy8gZGVmaW5lIG5iciBvZiBzYW1wbGVzIHBlciBwaXhlbHNcbiAgICBjb25zdCBzbGljZU1ldGhvZCA9IGRhdHVtIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5ID8gJ3N1YmFycmF5JyA6ICdzbGljZSc7XG4gICAgY29uc3QgbmJyU2FtcGxlcyA9IGRhdHVtLmxlbmd0aDtcbiAgICBjb25zdCBkdXJhdGlvbiA9IG5iclNhbXBsZXMgLyB0aGlzLnBhcmFtcy5zYW1wbGVSYXRlO1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChkdXJhdGlvbik7XG4gICAgY29uc3Qgc2FtcGxlc1BlclBpeGVsID0gbmJyU2FtcGxlcyAvIHdpZHRoO1xuXG4gICAgaWYgKCFzYW1wbGVzUGVyUGl4ZWwgfHwgZGF0dW0ubGVuZ3RoIDwgc2FtcGxlc1BlclBpeGVsKSB7IHJldHVybjsgfVxuXG4gICAgbGV0IG1pbk1heCA9IFtdO1xuXG4gICAgLy8gdXNlIHRpbWVsaW5lJ3MgVGltZUNvbnRleHQgYXR0cmlidXRlcyB0byBjb21wdXRlL2RyYXcgdmlzaWJsZSBhcmVhIG9ubHlcbiAgICBjb25zdCBtaW5YID0gLXJlbmRlcmluZ0NvbnRleHQudHJhY2tPZmZzZXRYO1xuICAgIGNvbnN0IG1heFggPSByZW5kZXJpbmdDb250ZXh0LnZpc2libGVXaWR0aCArIG1pblg7XG5cbiAgICAvLyBnZXQgbWluL21heCBwZXIgcGl4ZWxzXG4gICAgZm9yIChsZXQgcHggPSBtaW5YOyBweCA8PSBtYXhYOyBweCsrKSB7XG4gICAgICBjb25zdCBzdGFydFRpbWUgPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChweCk7XG4gICAgICBjb25zdCBzdGFydFNhbXBsZSA9IHN0YXJ0VGltZSAqIHRoaXMucGFyYW1zLnNhbXBsZVJhdGU7XG5cbiAgICAgIGNvbnN0IGV4dHJhY3QgPSBkYXR1bVtzbGljZU1ldGhvZF0oc3RhcnRTYW1wbGUsIHN0YXJ0U2FtcGxlICsgc2FtcGxlc1BlclBpeGVsKTtcblxuICAgICAgbGV0IG1pbiA9IEluZmluaXR5O1xuICAgICAgbGV0IG1heCA9IC1JbmZpbml0eTtcblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBleHRyYWN0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGxldCBzYW1wbGUgPSBleHRyYWN0W2pdO1xuICAgICAgICBpZiAoc2FtcGxlIDwgbWluKSB7IG1pbiA9IHNhbXBsZTsgfVxuICAgICAgICBpZiAoc2FtcGxlID4gbWF4KSB7IG1heCA9IHNhbXBsZTsgfVxuICAgICAgfVxuICAgICAgLy8gZGlzYWxsb3cgSW5maW5pdHlcbiAgICAgIG1pbiA9IChtaW4gPT09IEluZmluaXR5IHx8IG1pbiA9PT0gLUluZmluaXR5KSA/IDAgOiBtaW47XG4gICAgICBtYXggPSAobWF4ID09PSBJbmZpbml0eSB8fCBtYXggPT09IC1JbmZpbml0eSkgPyAwIDogbWF4O1xuXG4gICAgICBpZiAobWluID09PSAwICYmIG1heCA9PT0gMCkgeyBjb250aW51ZTsgfVxuXG4gICAgICBtaW5NYXgucHVzaCh7IHRpbWU6IHN0YXJ0VGltZSwgdmFsdWVzOiBbbWluLCBtYXhdIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IE1JTiA9IDA7XG4gICAgY29uc3QgTUFYID0gMTtcblxuICAgIGlmICghbWluTWF4Lmxlbmd0aCkgeyByZXR1cm47IH1cblxuICAgIC8vIHJlbmRlcmluZyBzdHJhdGVnaWVzXG4gICAgaWYgKHRoaXMucGFyYW1zLnJlbmRlcmluZ1N0cmF0ZWd5ID09PSAnc3ZnJykge1xuXG4gICAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gbWluTWF4Lm1hcCgoZGF0dW0sIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IHggID0gTWF0aC5mbG9vcihyZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKGRhdHVtLnRpbWUpKTtcbiAgICAgICAgbGV0IHkxID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLnkoZGF0dW0udmFsdWVzW01JTl0pKSk7XG4gICAgICAgIGxldCB5MiA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy55KGRhdHVtLnZhbHVlc1tNQVhdKSkpO1xuXG4gICAgICAgIHJldHVybiBgJHt4fSwke3kxfUwke3h9LCR7eTJ9YDtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBkID0gJ00nICsgaW5zdHJ1Y3Rpb25zLmpvaW4oJ0wnKTtcbiAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgZCk7XG5cbiAgICB9IGVsc2UgaWYgKHRoaXMucGFyYW1zLnJlbmRlcmluZ1N0cmF0ZWd5ID09PSAnY2FudmFzJykge1xuXG4gICAgICB0aGlzLl9jdHguY2FudmFzLndpZHRoID0gd2lkdGg7XG4gICAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgd2lkdGgpO1xuICAgICAgLy8gZml4IGNocm9tZSBidWcgd2l0aCB0cmFuc2xhdGVcbiAgICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignY2hyb21lJykgPiAtMSkge1xuICAgICAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGUoJ3gnLCByZW5kZXJpbmdDb250ZXh0Lm9mZnNldFgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9jdHguc3Ryb2tlU3R5bGUgPSB0aGlzLnBhcmFtcy5jb2xvcjtcbiAgICAgIHRoaXMuX2N0eC5nbG9iYWxBbHBoYSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG4gICAgICB0aGlzLl9jdHgubW92ZVRvKHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoMCksIHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKDApKTtcblxuICAgICAgbWluTWF4LmZvckVhY2goKGRhdHVtKSA9PiB7XG4gICAgICAgIGNvbnN0IHggID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChkYXR1bS50aW1lKTtcbiAgICAgICAgY29uc3QgeTEgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLnkoZGF0dW0udmFsdWVzW01JTl0pKTtcbiAgICAgICAgY29uc3QgeTIgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLnkoZGF0dW0udmFsdWVzW01BWF0pKTtcblxuICAgICAgICB0aGlzLl9jdHgubW92ZVRvKHgsIHkxKTtcbiAgICAgICAgdGhpcy5fY3R4LmxpbmVUbyh4LCB5Mik7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fY3R4LnN0cm9rZSgpO1xuICAgIH1cbiAgfVxufVxuIl19