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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMvd2F2ZWZvcm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBc0IsY0FBYzs7OztBQUdwQyxJQUFNLE9BQU8sR0FBRyw4QkFBOEIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFpQjFCLFFBQVE7WUFBUixRQUFROztXQUFSLFFBQVE7MEJBQVIsUUFBUTs7K0JBQVIsUUFBUTs7O2VBQVIsUUFBUTs7V0FDZix3QkFBRztBQUFFLGFBQU8sVUFBVSxDQUFDO0tBQUU7OztXQUVyQiw0QkFBRzs7QUFFakIsYUFBTyxFQUFFLENBQUM7S0FDWDs7O1dBRVcsd0JBQUc7QUFDYixhQUFPO0FBQ0wsa0JBQVUsRUFBRSxLQUFLO0FBQ2pCLGFBQUssRUFBRSxTQUFTO0FBQ2hCLGVBQU8sRUFBRSxDQUFDO09BRVgsQ0FBQztLQUNIOzs7O1dBRUssZ0JBQUMsZ0JBQWdCLEVBQUU7QUFDdkIsVUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO09BQUU7Ozs7QUFJaEMsVUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDckQsVUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM5QyxVQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDL0QsVUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNELFVBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQzs7Ozs7Ozs7Ozs7Ozs7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QUFDLE1BQU0sRUFBRTtBQUFFLGVBQU87T0FBRTs7QUFFL0IsVUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLFVBQU0sR0FBRyxHQUFLLENBQUMsQ0FBQztBQUNoQixVQUFNLEdBQUcsR0FBSyxDQUFDLENBQUM7QUFDaEIsVUFBTSxJQUFJLEdBQUksZ0JBQWdCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7O0FBSTdDLFVBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFLO0FBQzlDLFlBQU0sQ0FBQyxHQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QixZQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9ELFlBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRS9ELGVBQVUsQ0FBQyxTQUFJLEVBQUUsU0FBSSxDQUFDLFNBQUksRUFBRSxDQUFHO09BQ2hDLENBQUMsQ0FBQzs7QUFFSCxVQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2QyxVQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQTBCekM7OztTQXhJa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoic3JjL3NoYXBlcy93YXZlZm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuXG5jb25zdCB4aHRtbE5TID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnO1xuXG4vLyBAVE9ETyBjcmVhdGUgc3RyYXRlZ2llcyBvYmplY3QgdG8gY2xlYW4gdGhlIGBpZi4uLmVsc2VgIG1lc3Ncbi8vIHZhciBzdmdTdHJhdGVneSA9IHtcbi8vICAgcmVuZGVyKCkge30sXG4vLyAgIHVwZGF0ZSgpIHt9XG4vLyB9O1xuXG4vLyB2YXIgY2FudmFzU3RyYXRlZ3kgPSB7XG4vLyAgIHJlbmRlcigpIHt9LFxuLy8gICB1cGRhdGUoKSB7fVxuLy8gfTtcblxuXG4vKipcbiAqIEEgc2hhcGUgdG8gZGlzcGxheSBhIHdhdmVmb3JtLiAoZm9yIGVudGl0eSBkYXRhKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXZlZm9ybSBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICd3YXZlZm9ybSc7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIC8vIHJldHVybiB7IHk6IDAgfTtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNhbXBsZVJhdGU6IDQ0MTAwLFxuICAgICAgY29sb3I6ICcjMDAwMDAwJyxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAvLyByZW5kZXJpbmdTdHJhdGVneTogJ3N2ZycgLy8gY2FudmFzIGlzIGJ1Z2dlZCAodHJhbnNsYXRpb24sIGV0Yy4uLilcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICAvLyBpZiAodGhpcy5wYXJhbXMucmVuZGVyaW5nU3RyYXRlZ3kgPT09ICdzdmcnKSB7XG5cbiAgICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICdub25lJyk7XG4gICAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcbiAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCB0aGlzLnBhcmFtcy5jb2xvcik7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5vcGFjaXR5ID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcblxuICAgIC8vIH0gZWxzZSBpZiAodGhpcy5wYXJhbXMucmVuZGVyaW5nU3RyYXRlZ3kgPT09ICdjYW52YXMnKSB7XG5cbiAgICAvLyAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdmb3JlaWduT2JqZWN0Jyk7XG4gICAgLy8gICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCByZW5kZXJpbmdDb250ZXh0LndpZHRoKTtcbiAgICAvLyAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCByZW5kZXJpbmdDb250ZXh0LmhlaWdodCk7XG5cbiAgICAvLyAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh4aHRtbE5TLCAneGh0bWw6Y2FudmFzJyk7XG5cbiAgICAvLyAgIHRoaXMuX2N0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIC8vICAgdGhpcy5fY3R4LmNhbnZhcy53aWR0aCA9IHJlbmRlcmluZ0NvbnRleHQud2lkdGg7XG4gICAgLy8gICB0aGlzLl9jdHguY2FudmFzLmhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuXG4gICAgLy8gICB0aGlzLiRlbC5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAgIC8vIH1cblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSkge1xuICAgIC8vIGRlZmluZSBuYnIgb2Ygc2FtcGxlcyBwZXIgcGl4ZWxzXG4gICAgY29uc3Qgc2xpY2VNZXRob2QgPSBkYXR1bSBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSA/ICdzdWJhcnJheScgOiAnc2xpY2UnO1xuICAgIGNvbnN0IG5iclNhbXBsZXMgPSBkYXR1bS5sZW5ndGg7XG4gICAgY29uc3QgZHVyYXRpb24gPSBuYnJTYW1wbGVzIC8gdGhpcy5wYXJhbXMuc2FtcGxlUmF0ZTtcbiAgICBjb25zdCB3aWR0aCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoZHVyYXRpb24pO1xuICAgIGNvbnN0IHNhbXBsZXNQZXJQaXhlbCA9IG5iclNhbXBsZXMgLyB3aWR0aDtcblxuICAgIGlmICghc2FtcGxlc1BlclBpeGVsIHx8IGRhdHVtLmxlbmd0aCA8IHNhbXBsZXNQZXJQaXhlbCkgeyByZXR1cm47IH1cblxuICAgIC8vIGNvbXB1dGUvZHJhdyB2aXNpYmxlIGFyZWEgb25seVxuICAgIC8vIEBUT0RPIHJlZmFjdG9yIHRoaXMgdW51bmRlcnN0YW5kYWJsZSBtZXNzXG4gICAgbGV0IG1pblggPSBNYXRoLm1heCgtcmVuZGVyaW5nQ29udGV4dC5vZmZzZXRYLCAwKTtcbiAgICBsZXQgdHJhY2tEZWNheSA9IHJlbmRlcmluZ0NvbnRleHQudHJhY2tPZmZzZXRYICsgcmVuZGVyaW5nQ29udGV4dC5zdGFydFg7XG4gICAgaWYgKHRyYWNrRGVjYXkgPCAwKSB7IG1pblggPSAtdHJhY2tEZWNheTsgfVxuXG4gICAgbGV0IG1heFggPSBtaW5YO1xuICAgIG1heFggKz0gKHJlbmRlcmluZ0NvbnRleHQud2lkdGggLSBtaW5YIDwgcmVuZGVyaW5nQ29udGV4dC52aXNpYmxlV2lkdGgpID9cbiAgICAgIHJlbmRlcmluZ0NvbnRleHQud2lkdGggOiByZW5kZXJpbmdDb250ZXh0LnZpc2libGVXaWR0aDtcblxuICAgIC8vIGdldCBtaW4vbWF4IHBlciBwaXhlbHMsIGNsYW1wZWQgdG8gdGhlIHZpc2libGUgYXJlYVxuICAgIGNvbnN0IGludmVydCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0O1xuICAgIGNvbnN0IHNhbXBsZVJhdGUgPSB0aGlzLnBhcmFtcy5zYW1wbGVSYXRlO1xuICAgIGNvbnN0IG1pbk1heCA9IFtdO1xuXG4gICAgZm9yIChsZXQgcHggPSBtaW5YOyBweCA8IG1heFg7IHB4KyspIHtcbiAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IGludmVydChweCk7XG4gICAgICBjb25zdCBzdGFydFNhbXBsZSA9IHN0YXJ0VGltZSAqIHNhbXBsZVJhdGU7XG4gICAgICBjb25zdCBleHRyYWN0ID0gZGF0dW1bc2xpY2VNZXRob2RdKHN0YXJ0U2FtcGxlLCBzdGFydFNhbXBsZSArIHNhbXBsZXNQZXJQaXhlbCk7XG5cbiAgICAgIGxldCBtaW4gPSBJbmZpbml0eTtcbiAgICAgIGxldCBtYXggPSAtSW5maW5pdHk7XG5cbiAgICAgIGZvciAobGV0IGogPSAwLCBsID0gZXh0cmFjdC5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgICAgbGV0IHNhbXBsZSA9IGV4dHJhY3Rbal07XG4gICAgICAgIGlmIChzYW1wbGUgPCBtaW4pIHsgbWluID0gc2FtcGxlOyB9XG4gICAgICAgIGlmIChzYW1wbGUgPiBtYXgpIHsgbWF4ID0gc2FtcGxlOyB9XG4gICAgICB9XG4gICAgICAvLyBkaXNhbGxvdyBJbmZpbml0eVxuICAgICAgbWluID0gIWlzRmluaXRlKG1pbikgPyAwIDogbWluO1xuICAgICAgbWF4ID0gIWlzRmluaXRlKG1heCkgPyAwIDogbWF4O1xuICAgICAgaWYgKG1pbiA9PT0gMCAmJiBtYXggPT09IDApIHsgY29udGludWU7IH1cblxuICAgICAgbWluTWF4LnB1c2goW3B4LCBtaW4sIG1heF0pO1xuICAgIH1cblxuICAgIGlmICghbWluTWF4Lmxlbmd0aCkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IFBJWEVMID0gMDtcbiAgICBjb25zdCBNSU4gICA9IDE7XG4gICAgY29uc3QgTUFYICAgPSAyO1xuICAgIGNvbnN0IFpFUk8gID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoMCk7XG4gICAgLy8gcmVuZGVyaW5nIHN0cmF0ZWdpZXNcbiAgICAvLyBpZiAodGhpcy5wYXJhbXMucmVuZGVyaW5nU3RyYXRlZ3kgPT09ICdzdmcnKSB7XG5cbiAgICAgIGxldCBpbnN0cnVjdGlvbnMgPSBtaW5NYXgubWFwKChkYXR1bSwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgeCAgPSBkYXR1bVtQSVhFTF07XG4gICAgICAgIGxldCB5MSA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoZGF0dW1bTUlOXSkpO1xuICAgICAgICBsZXQgeTIgPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKGRhdHVtW01BWF0pKTtcbiAgICAgICAgLy8gcmV0dXJuIGAke3h9LCR7WkVST31MJHt4fSwke3kxfUwke3h9LCR7eTJ9TCR7eH0sJHtaRVJPfWA7XG4gICAgICAgIHJldHVybiBgJHt4fSwke3kxfUwke3h9LCR7eTJ9YDtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBkID0gJ00nICsgaW5zdHJ1Y3Rpb25zLmpvaW4oJ0wnKTtcbiAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgZCk7XG5cbiAgICAvLyB9IGVsc2UgaWYgKHRoaXMucGFyYW1zLnJlbmRlcmluZ1N0cmF0ZWd5ID09PSAnY2FudmFzJykge1xuXG4gICAgLy8gICB0aGlzLl9jdHguY2FudmFzLndpZHRoID0gd2lkdGg7XG4gICAgLy8gICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgd2lkdGgpO1xuICAgIC8vICAgLy8gZml4IGNocm9tZSBidWcgd2l0aCB0cmFuc2xhdGVcbiAgICAvLyAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignY2hyb21lJykgPiAtMSkge1xuICAgIC8vICAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGUoJ3gnLCByZW5kZXJpbmdDb250ZXh0Lm9mZnNldFgpO1xuICAgIC8vICAgfVxuXG4gICAgLy8gICB0aGlzLl9jdHguc3Ryb2tlU3R5bGUgPSB0aGlzLnBhcmFtcy5jb2xvcjtcbiAgICAvLyAgIHRoaXMuX2N0eC5nbG9iYWxBbHBoYSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG4gICAgLy8gICB0aGlzLl9jdHgubW92ZVRvKHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoMCksIHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKDApKTtcblxuICAgIC8vICAgbWluTWF4LmZvckVhY2goKGRhdHVtKSA9PiB7XG4gICAgLy8gICAgIGNvbnN0IHggID0gZGF0dW1bUElYRUxdO1xuICAgIC8vICAgICBsZXQgeTEgPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKGRhdHVtW01JTl0pKTtcbiAgICAvLyAgICAgbGV0IHkyID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChkYXR1bVtNQVhdKSk7XG5cbiAgICAvLyAgICAgdGhpcy5fY3R4Lm1vdmVUbyh4LCB5MSk7XG4gICAgLy8gICAgIHRoaXMuX2N0eC5saW5lVG8oeCwgeTIpO1xuICAgIC8vICAgfSk7XG5cbiAgICAvLyAgIHRoaXMuX2N0eC5zdHJva2UoKTtcbiAgICAvLyB9XG4gIH1cbn1cbiJdfQ==