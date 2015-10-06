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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvd2F2ZWZvcm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBc0IsY0FBYzs7OztBQUdwQyxJQUFNLE9BQU8sR0FBRyw4QkFBOEIsQ0FBQzs7Ozs7Ozs7Ozs7OztJQWExQixRQUFRO1lBQVIsUUFBUTs7V0FBUixRQUFROzBCQUFSLFFBQVE7OytCQUFSLFFBQVE7OztlQUFSLFFBQVE7O1dBQ2Ysd0JBQUc7QUFBRSxhQUFPLFVBQVUsQ0FBQztLQUFFOzs7V0FFckIsNEJBQUc7O0FBRWpCLGFBQU8sRUFBRSxDQUFDO0tBQ1g7OztXQUVXLHdCQUFHO0FBQ2IsYUFBTztBQUNMLGtCQUFVLEVBQUUsS0FBSztBQUNqQixhQUFLLEVBQUUsU0FBUztBQUNoQixlQUFPLEVBQUUsQ0FBQztPQUVYLENBQUM7S0FDSDs7OztXQUVLLGdCQUFDLGdCQUFnQixFQUFFO0FBQ3ZCLFVBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUFFLGVBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztPQUFFOzs7O0FBSWhDLFVBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3JELFVBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDOUMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQy9ELFVBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzRCxVQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUIvQyxhQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDakI7OztXQUVLLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRTs7QUFFOUIsVUFBTSxXQUFXLEdBQUcsS0FBSyxZQUFZLFlBQVksR0FBRyxVQUFVLEdBQUcsT0FBTyxDQUFDO0FBQ3pFLFVBQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDaEMsVUFBTSxRQUFRLEdBQUcsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ3JELFVBQU0sS0FBSyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyRCxVQUFNLGVBQWUsR0FBRyxVQUFVLEdBQUcsS0FBSyxDQUFDOztBQUUzQyxVQUFJLENBQUMsZUFBZSxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsZUFBZSxFQUFFO0FBQUUsZUFBTztPQUFFOzs7O0FBSW5FLFVBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEQsVUFBSSxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQztBQUN6RSxVQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUU7QUFBRSxZQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUM7T0FBRTs7QUFFM0MsVUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFVBQUksSUFBSSxBQUFDLGdCQUFnQixDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxHQUNwRSxnQkFBZ0IsQ0FBQyxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDOzs7QUFHekQsVUFBTSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztBQUNuRCxVQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUMxQyxVQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7O0FBRWxCLFdBQUssSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLEVBQUUsR0FBRyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDbkMsWUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdCLFlBQU0sV0FBVyxHQUFHLFNBQVMsR0FBRyxVQUFVLENBQUM7QUFDM0MsWUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxXQUFXLEdBQUcsZUFBZSxDQUFDLENBQUM7O0FBRS9FLFlBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQztBQUNuQixZQUFJLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQzs7QUFFcEIsYUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM5QyxjQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEIsY0FBSSxNQUFNLEdBQUcsR0FBRyxFQUFFO0FBQUUsZUFBRyxHQUFHLE1BQU0sQ0FBQztXQUFFO0FBQ25DLGNBQUksTUFBTSxHQUFHLEdBQUcsRUFBRTtBQUFFLGVBQUcsR0FBRyxNQUFNLENBQUM7V0FBRTtTQUNwQzs7QUFFRCxXQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUMvQixXQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUMvQixZQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsRUFBRTtBQUFFLG1CQUFTO1NBQUU7O0FBRXpDLGNBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7T0FDN0I7O0FBRUQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7QUFBRSxlQUFPO09BQUU7O0FBRS9CLFVBQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNoQixVQUFNLEdBQUcsR0FBSyxDQUFDLENBQUM7QUFDaEIsVUFBTSxHQUFHLEdBQUssQ0FBQyxDQUFDO0FBQ2hCLFVBQU0sSUFBSSxHQUFJLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7OztBQUk3QyxVQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSyxFQUFFLEtBQUssRUFBSztBQUM5QyxZQUFNLENBQUMsR0FBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEIsWUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvRCxZQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUUvRCxlQUFVLENBQUMsU0FBSSxFQUFFLFNBQUksQ0FBQyxTQUFJLEVBQUUsQ0FBRztPQUNoQyxDQUFDLENBQUM7O0FBRUgsVUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0EwQnpDOzs7U0F4SWtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6ImVzNi9zaGFwZXMvd2F2ZWZvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuY29uc3QgeGh0bWxOUyA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJztcblxuLy8gQFRPRE8gY3JlYXRlIHN0cmF0ZWdpZXMgb2JqZWN0IHRvIGNsZWFuIHRoZSBgaWYuLi5lbHNlYCBtZXNzXG4vLyB2YXIgc3ZnU3RyYXRlZ3kgPSB7XG4vLyAgIHJlbmRlcigpIHt9LFxuLy8gICB1cGRhdGUoKSB7fVxuLy8gfTtcblxuLy8gdmFyIGNhbnZhc1N0cmF0ZWd5ID0ge1xuLy8gICByZW5kZXIoKSB7fSxcbi8vICAgdXBkYXRlKCkge31cbi8vIH07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhdmVmb3JtIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3dhdmVmb3JtJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgLy8gcmV0dXJuIHsgeTogMCB9O1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2FtcGxlUmF0ZTogNDQxMDAsXG4gICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIC8vIHJlbmRlcmluZ1N0cmF0ZWd5OiAnc3ZnJyAvLyBjYW52YXMgaXMgYnVnZ2VkICh0cmFuc2xhdGlvbiwgZXRjLi4uKVxuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbCkgeyByZXR1cm4gdGhpcy4kZWw7IH1cblxuICAgIC8vIGlmICh0aGlzLnBhcmFtcy5yZW5kZXJpbmdTdHJhdGVneSA9PT0gJ3N2ZycpIHtcblxuICAgICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3BhdGgnKTtcbiAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcbiAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLmNvbG9yKTtcbiAgICAgIHRoaXMuJGVsLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuXG4gICAgLy8gfSBlbHNlIGlmICh0aGlzLnBhcmFtcy5yZW5kZXJpbmdTdHJhdGVneSA9PT0gJ2NhbnZhcycpIHtcblxuICAgIC8vICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2ZvcmVpZ25PYmplY3QnKTtcbiAgICAvLyAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHJlbmRlcmluZ0NvbnRleHQud2lkdGgpO1xuICAgIC8vICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0KTtcblxuICAgIC8vICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHhodG1sTlMsICd4aHRtbDpjYW52YXMnKTtcblxuICAgIC8vICAgdGhpcy5fY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgLy8gICB0aGlzLl9jdHguY2FudmFzLndpZHRoID0gcmVuZGVyaW5nQ29udGV4dC53aWR0aDtcbiAgICAvLyAgIHRoaXMuX2N0eC5jYW52YXMuaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG5cbiAgICAvLyAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgLy8gfVxuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtKSB7XG4gICAgLy8gZGVmaW5lIG5iciBvZiBzYW1wbGVzIHBlciBwaXhlbHNcbiAgICBjb25zdCBzbGljZU1ldGhvZCA9IGRhdHVtIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5ID8gJ3N1YmFycmF5JyA6ICdzbGljZSc7XG4gICAgY29uc3QgbmJyU2FtcGxlcyA9IGRhdHVtLmxlbmd0aDtcbiAgICBjb25zdCBkdXJhdGlvbiA9IG5iclNhbXBsZXMgLyB0aGlzLnBhcmFtcy5zYW1wbGVSYXRlO1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChkdXJhdGlvbik7XG4gICAgY29uc3Qgc2FtcGxlc1BlclBpeGVsID0gbmJyU2FtcGxlcyAvIHdpZHRoO1xuXG4gICAgaWYgKCFzYW1wbGVzUGVyUGl4ZWwgfHwgZGF0dW0ubGVuZ3RoIDwgc2FtcGxlc1BlclBpeGVsKSB7IHJldHVybjsgfVxuXG4gICAgLy8gY29tcHV0ZS9kcmF3IHZpc2libGUgYXJlYSBvbmx5XG4gICAgLy8gQFRPRE8gcmVmYWN0b3IgdGhpcyB1bnVuZGVyc3RhbmRhYmxlIG1lc3NcbiAgICBsZXQgbWluWCA9IE1hdGgubWF4KC1yZW5kZXJpbmdDb250ZXh0Lm9mZnNldFgsIDApO1xuICAgIGxldCB0cmFja0RlY2F5ID0gcmVuZGVyaW5nQ29udGV4dC50cmFja09mZnNldFggKyByZW5kZXJpbmdDb250ZXh0LnN0YXJ0WDtcbiAgICBpZiAodHJhY2tEZWNheSA8IDApIHsgbWluWCA9IC10cmFja0RlY2F5OyB9XG5cbiAgICBsZXQgbWF4WCA9IG1pblg7XG4gICAgbWF4WCArPSAocmVuZGVyaW5nQ29udGV4dC53aWR0aCAtIG1pblggPCByZW5kZXJpbmdDb250ZXh0LnZpc2libGVXaWR0aCkgP1xuICAgICAgcmVuZGVyaW5nQ29udGV4dC53aWR0aCA6IHJlbmRlcmluZ0NvbnRleHQudmlzaWJsZVdpZHRoO1xuXG4gICAgLy8gZ2V0IG1pbi9tYXggcGVyIHBpeGVscywgY2xhbXBlZCB0byB0aGUgdmlzaWJsZSBhcmVhXG4gICAgY29uc3QgaW52ZXJ0ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQ7XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IHRoaXMucGFyYW1zLnNhbXBsZVJhdGU7XG4gICAgY29uc3QgbWluTWF4ID0gW107XG5cbiAgICBmb3IgKGxldCBweCA9IG1pblg7IHB4IDwgbWF4WDsgcHgrKykge1xuICAgICAgY29uc3Qgc3RhcnRUaW1lID0gaW52ZXJ0KHB4KTtcbiAgICAgIGNvbnN0IHN0YXJ0U2FtcGxlID0gc3RhcnRUaW1lICogc2FtcGxlUmF0ZTtcbiAgICAgIGNvbnN0IGV4dHJhY3QgPSBkYXR1bVtzbGljZU1ldGhvZF0oc3RhcnRTYW1wbGUsIHN0YXJ0U2FtcGxlICsgc2FtcGxlc1BlclBpeGVsKTtcblxuICAgICAgbGV0IG1pbiA9IEluZmluaXR5O1xuICAgICAgbGV0IG1heCA9IC1JbmZpbml0eTtcblxuICAgICAgZm9yIChsZXQgaiA9IDAsIGwgPSBleHRyYWN0Lmxlbmd0aDsgaiA8IGw7IGorKykge1xuICAgICAgICBsZXQgc2FtcGxlID0gZXh0cmFjdFtqXTtcbiAgICAgICAgaWYgKHNhbXBsZSA8IG1pbikgeyBtaW4gPSBzYW1wbGU7IH1cbiAgICAgICAgaWYgKHNhbXBsZSA+IG1heCkgeyBtYXggPSBzYW1wbGU7IH1cbiAgICAgIH1cbiAgICAgIC8vIGRpc2FsbG93IEluZmluaXR5XG4gICAgICBtaW4gPSAhaXNGaW5pdGUobWluKSA/IDAgOiBtaW47XG4gICAgICBtYXggPSAhaXNGaW5pdGUobWF4KSA/IDAgOiBtYXg7XG4gICAgICBpZiAobWluID09PSAwICYmIG1heCA9PT0gMCkgeyBjb250aW51ZTsgfVxuXG4gICAgICBtaW5NYXgucHVzaChbcHgsIG1pbiwgbWF4XSk7XG4gICAgfVxuXG4gICAgaWYgKCFtaW5NYXgubGVuZ3RoKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgUElYRUwgPSAwO1xuICAgIGNvbnN0IE1JTiAgID0gMTtcbiAgICBjb25zdCBNQVggICA9IDI7XG4gICAgY29uc3QgWkVSTyAgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCgwKTtcbiAgICAvLyByZW5kZXJpbmcgc3RyYXRlZ2llc1xuICAgIC8vIGlmICh0aGlzLnBhcmFtcy5yZW5kZXJpbmdTdHJhdGVneSA9PT0gJ3N2ZycpIHtcblxuICAgICAgbGV0IGluc3RydWN0aW9ucyA9IG1pbk1heC5tYXAoKGRhdHVtLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCB4ICA9IGRhdHVtW1BJWEVMXTtcbiAgICAgICAgbGV0IHkxID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChkYXR1bVtNSU5dKSk7XG4gICAgICAgIGxldCB5MiA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoZGF0dW1bTUFYXSkpO1xuICAgICAgICAvLyByZXR1cm4gYCR7eH0sJHtaRVJPfUwke3h9LCR7eTF9TCR7eH0sJHt5Mn1MJHt4fSwke1pFUk99YDtcbiAgICAgICAgcmV0dXJuIGAke3h9LCR7eTF9TCR7eH0sJHt5Mn1gO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGQgPSAnTScgKyBpbnN0cnVjdGlvbnMuam9pbignTCcpO1xuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCBkKTtcblxuICAgIC8vIH0gZWxzZSBpZiAodGhpcy5wYXJhbXMucmVuZGVyaW5nU3RyYXRlZ3kgPT09ICdjYW52YXMnKSB7XG5cbiAgICAvLyAgIHRoaXMuX2N0eC5jYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICAvLyAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCB3aWR0aCk7XG4gICAgLy8gICAvLyBmaXggY2hyb21lIGJ1ZyB3aXRoIHRyYW5zbGF0ZVxuICAgIC8vICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdjaHJvbWUnKSA+IC0xKSB7XG4gICAgLy8gICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZSgneCcsIHJlbmRlcmluZ0NvbnRleHQub2Zmc2V0WCk7XG4gICAgLy8gICB9XG5cbiAgICAvLyAgIHRoaXMuX2N0eC5zdHJva2VTdHlsZSA9IHRoaXMucGFyYW1zLmNvbG9yO1xuICAgIC8vICAgdGhpcy5fY3R4Lmdsb2JhbEFscGhhID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcbiAgICAvLyAgIHRoaXMuX2N0eC5tb3ZlVG8ocmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCgwKSwgcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoMCkpO1xuXG4gICAgLy8gICBtaW5NYXguZm9yRWFjaCgoZGF0dW0pID0+IHtcbiAgICAvLyAgICAgY29uc3QgeCAgPSBkYXR1bVtQSVhFTF07XG4gICAgLy8gICAgIGxldCB5MSA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoZGF0dW1bTUlOXSkpO1xuICAgIC8vICAgICBsZXQgeTIgPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKGRhdHVtW01BWF0pKTtcblxuICAgIC8vICAgICB0aGlzLl9jdHgubW92ZVRvKHgsIHkxKTtcbiAgICAvLyAgICAgdGhpcy5fY3R4LmxpbmVUbyh4LCB5Mik7XG4gICAgLy8gICB9KTtcblxuICAgIC8vICAgdGhpcy5fY3R4LnN0cm9rZSgpO1xuICAgIC8vIH1cbiAgfVxufVxuIl19