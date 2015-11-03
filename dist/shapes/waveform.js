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

/**
 * A shape to display a waveform. (for entity data)
 */

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
      };
    }
  }, {
    key: 'render',
    // renderingStrategy: 'svg' // canvas is bugged (translation, etc...)
    value: function render(renderingContext) {
      if (this.$el) {
        return this.$el;
      }

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
          if (sample < min) {
            min = sample;
          }
          if (sample > max) {
            max = sample;
          }
        }
        // disallow Infinity
        min = !isFinite(min) ? 0 : min;
        max = !isFinite(max) ? 0 : max;
        if (min === 0 && max === 0) {
          continue;
        }

        minMax.push([px, min, max]);
      }

      if (!minMax.length) {
        return;
      }

      var PIXEL = 0;
      var MIN = 1;
      var MAX = 2;
      var ZERO = renderingContext.valueToPixel(0);
      // rendering strategies
      // if (this.params.renderingStrategy === 'svg') {

      var instructions = minMax.map(function (datum, index) {
        var x = datum[PIXEL];
        var y1 = Math.round(renderingContext.valueToPixel(datum[MIN]));
        var y2 = Math.round(renderingContext.valueToPixel(datum[MAX]));
        // return `${x},${ZERO}L${x},${y1}L${x},${y2}L${x},${ZERO}`;
        return x + ',' + y1 + 'L' + x + ',' + y2;
      });

      var d = 'M' + instructions.join('L');
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
  }]);

  return Waveform;
})(_baseShape2['default']);

exports['default'] = Waveform;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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TSxFQUFFO0FBQUUsZUFBTztPQUFFOztBQUUvQixVQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDaEIsVUFBTSxHQUFHLEdBQUssQ0FBQyxDQUFDO0FBQ2hCLFVBQU0sR0FBRyxHQUFLLENBQUMsQ0FBQztBQUNoQixVQUFNLElBQUksR0FBSSxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7QUFJN0MsVUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLLEVBQUs7QUFDOUMsWUFBTSxDQUFDLEdBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hCLFlBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0QsWUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFL0QsZUFBVSxDQUFDLFNBQUksRUFBRSxTQUFJLENBQUMsU0FBSSxFQUFFLENBQUc7T0FDaEMsQ0FBQyxDQUFDOztBQUVILFVBQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDLFVBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBMEJ6Qzs7O1NBeElrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiJzcmMvd2F2ZXMtdWkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuY29uc3QgeGh0bWxOUyA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJztcblxuLy8gQFRPRE8gY3JlYXRlIHN0cmF0ZWdpZXMgb2JqZWN0IHRvIGNsZWFuIHRoZSBgaWYuLi5lbHNlYCBtZXNzXG4vLyB2YXIgc3ZnU3RyYXRlZ3kgPSB7XG4vLyAgIHJlbmRlcigpIHt9LFxuLy8gICB1cGRhdGUoKSB7fVxuLy8gfTtcblxuLy8gdmFyIGNhbnZhc1N0cmF0ZWd5ID0ge1xuLy8gICByZW5kZXIoKSB7fSxcbi8vICAgdXBkYXRlKCkge31cbi8vIH07XG5cblxuLyoqXG4gKiBBIHNoYXBlIHRvIGRpc3BsYXkgYSB3YXZlZm9ybS4gKGZvciBlbnRpdHkgZGF0YSlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2F2ZWZvcm0gZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnd2F2ZWZvcm0nOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICAvLyByZXR1cm4geyB5OiAwIH07XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzYW1wbGVSYXRlOiA0NDEwMCxcbiAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgLy8gcmVuZGVyaW5nU3RyYXRlZ3k6ICdzdmcnIC8vIGNhbnZhcyBpcyBidWdnZWQgKHRyYW5zbGF0aW9uLCBldGMuLi4pXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuXG4gICAgLy8gaWYgKHRoaXMucGFyYW1zLnJlbmRlcmluZ1N0cmF0ZWd5ID09PSAnc3ZnJykge1xuXG4gICAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncGF0aCcpO1xuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnbm9uZScpO1xuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG4gICAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMuY29sb3IpO1xuICAgICAgdGhpcy4kZWwuc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG5cbiAgICAvLyB9IGVsc2UgaWYgKHRoaXMucGFyYW1zLnJlbmRlcmluZ1N0cmF0ZWd5ID09PSAnY2FudmFzJykge1xuXG4gICAgLy8gICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZm9yZWlnbk9iamVjdCcpO1xuICAgIC8vICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgcmVuZGVyaW5nQ29udGV4dC53aWR0aCk7XG4gICAgLy8gICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQpO1xuXG4gICAgLy8gICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoeGh0bWxOUywgJ3hodG1sOmNhbnZhcycpO1xuXG4gICAgLy8gICB0aGlzLl9jdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAvLyAgIHRoaXMuX2N0eC5jYW52YXMud2lkdGggPSByZW5kZXJpbmdDb250ZXh0LndpZHRoO1xuICAgIC8vICAgdGhpcy5fY3R4LmNhbnZhcy5oZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcblxuICAgIC8vICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICAvLyB9XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0pIHtcbiAgICAvLyBkZWZpbmUgbmJyIG9mIHNhbXBsZXMgcGVyIHBpeGVsc1xuICAgIGNvbnN0IHNsaWNlTWV0aG9kID0gZGF0dW0gaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkgPyAnc3ViYXJyYXknIDogJ3NsaWNlJztcbiAgICBjb25zdCBuYnJTYW1wbGVzID0gZGF0dW0ubGVuZ3RoO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gbmJyU2FtcGxlcyAvIHRoaXMucGFyYW1zLnNhbXBsZVJhdGU7XG4gICAgY29uc3Qgd2lkdGggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKGR1cmF0aW9uKTtcbiAgICBjb25zdCBzYW1wbGVzUGVyUGl4ZWwgPSBuYnJTYW1wbGVzIC8gd2lkdGg7XG5cbiAgICBpZiAoIXNhbXBsZXNQZXJQaXhlbCB8fCBkYXR1bS5sZW5ndGggPCBzYW1wbGVzUGVyUGl4ZWwpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyBjb21wdXRlL2RyYXcgdmlzaWJsZSBhcmVhIG9ubHlcbiAgICAvLyBAVE9ETyByZWZhY3RvciB0aGlzIHVudW5kZXJzdGFuZGFibGUgbWVzc1xuICAgIGxldCBtaW5YID0gTWF0aC5tYXgoLXJlbmRlcmluZ0NvbnRleHQub2Zmc2V0WCwgMCk7XG4gICAgbGV0IHRyYWNrRGVjYXkgPSByZW5kZXJpbmdDb250ZXh0LnRyYWNrT2Zmc2V0WCArIHJlbmRlcmluZ0NvbnRleHQuc3RhcnRYO1xuICAgIGlmICh0cmFja0RlY2F5IDwgMCkgeyBtaW5YID0gLXRyYWNrRGVjYXk7IH1cblxuICAgIGxldCBtYXhYID0gbWluWDtcbiAgICBtYXhYICs9IChyZW5kZXJpbmdDb250ZXh0LndpZHRoIC0gbWluWCA8IHJlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoKSA/XG4gICAgICByZW5kZXJpbmdDb250ZXh0LndpZHRoIDogcmVuZGVyaW5nQ29udGV4dC52aXNpYmxlV2lkdGg7XG5cbiAgICAvLyBnZXQgbWluL21heCBwZXIgcGl4ZWxzLCBjbGFtcGVkIHRvIHRoZSB2aXNpYmxlIGFyZWFcbiAgICBjb25zdCBpbnZlcnQgPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydDtcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gdGhpcy5wYXJhbXMuc2FtcGxlUmF0ZTtcbiAgICBjb25zdCBtaW5NYXggPSBbXTtcblxuICAgIGZvciAobGV0IHB4ID0gbWluWDsgcHggPCBtYXhYOyBweCsrKSB7XG4gICAgICBjb25zdCBzdGFydFRpbWUgPSBpbnZlcnQocHgpO1xuICAgICAgY29uc3Qgc3RhcnRTYW1wbGUgPSBzdGFydFRpbWUgKiBzYW1wbGVSYXRlO1xuICAgICAgY29uc3QgZXh0cmFjdCA9IGRhdHVtW3NsaWNlTWV0aG9kXShzdGFydFNhbXBsZSwgc3RhcnRTYW1wbGUgKyBzYW1wbGVzUGVyUGl4ZWwpO1xuXG4gICAgICBsZXQgbWluID0gSW5maW5pdHk7XG4gICAgICBsZXQgbWF4ID0gLUluZmluaXR5O1xuXG4gICAgICBmb3IgKGxldCBqID0gMCwgbCA9IGV4dHJhY3QubGVuZ3RoOyBqIDwgbDsgaisrKSB7XG4gICAgICAgIGxldCBzYW1wbGUgPSBleHRyYWN0W2pdO1xuICAgICAgICBpZiAoc2FtcGxlIDwgbWluKSB7IG1pbiA9IHNhbXBsZTsgfVxuICAgICAgICBpZiAoc2FtcGxlID4gbWF4KSB7IG1heCA9IHNhbXBsZTsgfVxuICAgICAgfVxuICAgICAgLy8gZGlzYWxsb3cgSW5maW5pdHlcbiAgICAgIG1pbiA9ICFpc0Zpbml0ZShtaW4pID8gMCA6IG1pbjtcbiAgICAgIG1heCA9ICFpc0Zpbml0ZShtYXgpID8gMCA6IG1heDtcbiAgICAgIGlmIChtaW4gPT09IDAgJiYgbWF4ID09PSAwKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgIG1pbk1heC5wdXNoKFtweCwgbWluLCBtYXhdKTtcbiAgICB9XG5cbiAgICBpZiAoIW1pbk1heC5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBQSVhFTCA9IDA7XG4gICAgY29uc3QgTUlOICAgPSAxO1xuICAgIGNvbnN0IE1BWCAgID0gMjtcbiAgICBjb25zdCBaRVJPICA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKDApO1xuICAgIC8vIHJlbmRlcmluZyBzdHJhdGVnaWVzXG4gICAgLy8gaWYgKHRoaXMucGFyYW1zLnJlbmRlcmluZ1N0cmF0ZWd5ID09PSAnc3ZnJykge1xuXG4gICAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gbWluTWF4Lm1hcCgoZGF0dW0sIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IHggID0gZGF0dW1bUElYRUxdO1xuICAgICAgICBsZXQgeTEgPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKGRhdHVtW01JTl0pKTtcbiAgICAgICAgbGV0IHkyID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChkYXR1bVtNQVhdKSk7XG4gICAgICAgIC8vIHJldHVybiBgJHt4fSwke1pFUk99TCR7eH0sJHt5MX1MJHt4fSwke3kyfUwke3h9LCR7WkVST31gO1xuICAgICAgICByZXR1cm4gYCR7eH0sJHt5MX1MJHt4fSwke3kyfWA7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZCA9ICdNJyArIGluc3RydWN0aW9ucy5qb2luKCdMJyk7XG4gICAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIGQpO1xuXG4gICAgLy8gfSBlbHNlIGlmICh0aGlzLnBhcmFtcy5yZW5kZXJpbmdTdHJhdGVneSA9PT0gJ2NhbnZhcycpIHtcblxuICAgIC8vICAgdGhpcy5fY3R4LmNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIC8vICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHdpZHRoKTtcbiAgICAvLyAgIC8vIGZpeCBjaHJvbWUgYnVnIHdpdGggdHJhbnNsYXRlXG4gICAgLy8gICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2Nocm9tZScpID4gLTEpIHtcbiAgICAvLyAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlKCd4JywgcmVuZGVyaW5nQ29udGV4dC5vZmZzZXRYKTtcbiAgICAvLyAgIH1cblxuICAgIC8vICAgdGhpcy5fY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5wYXJhbXMuY29sb3I7XG4gICAgLy8gICB0aGlzLl9jdHguZ2xvYmFsQWxwaGEgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuICAgIC8vICAgdGhpcy5fY3R4Lm1vdmVUbyhyZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKDApLCByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCgwKSk7XG5cbiAgICAvLyAgIG1pbk1heC5mb3JFYWNoKChkYXR1bSkgPT4ge1xuICAgIC8vICAgICBjb25zdCB4ICA9IGRhdHVtW1BJWEVMXTtcbiAgICAvLyAgICAgbGV0IHkxID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChkYXR1bVtNSU5dKSk7XG4gICAgLy8gICAgIGxldCB5MiA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoZGF0dW1bTUFYXSkpO1xuXG4gICAgLy8gICAgIHRoaXMuX2N0eC5tb3ZlVG8oeCwgeTEpO1xuICAgIC8vICAgICB0aGlzLl9jdHgubGluZVRvKHgsIHkyKTtcbiAgICAvLyAgIH0pO1xuXG4gICAgLy8gICB0aGlzLl9jdHguc3Ryb2tlKCk7XG4gICAgLy8gfVxuICB9XG59XG4iXX0=