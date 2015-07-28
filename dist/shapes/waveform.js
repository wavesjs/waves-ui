"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseShape = _interopRequire(require("./base-shape"));

var xhtmlNS = "http://www.w3.org/1999/xhtml";

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
  function Waveform() {
    _classCallCheck(this, Waveform);

    if (_BaseShape != null) {
      _BaseShape.apply(this, arguments);
    }
  }

  _inherits(Waveform, _BaseShape);

  _createClass(Waveform, {
    getClassName: {
      value: function getClassName() {
        return "waveform";
      }
    },
    _getAccessorList: {
      value: function _getAccessorList() {
        return { y: 0 };
      }
    },
    _getDefaults: {
      value: function _getDefaults() {
        return {
          sampleRate: 44100,
          color: "#000000",
          opacity: 1,
          renderingStrategy: "svg" // canvas is bugged (translation, etc...)
        };
      }
    },
    render: {
      value: function render(renderingContext) {
        if (this.$el) {
          return this.$el;
        }

        if (this.params.renderingStrategy === "svg") {

          this.$el = document.createElementNS(this.ns, "path");
          this.$el.setAttributeNS(null, "fill", "none");
          this.$el.setAttributeNS(null, "shape-rendering", "crispEdges");
          this.$el.setAttributeNS(null, "stroke", this.params.color);
          this.$el.style.opacity = this.params.opacity;
        } else if (this.params.renderingStrategy === "canvas") {

          this.$el = document.createElementNS(this.ns, "foreignObject");
          this.$el.setAttributeNS(null, "width", renderingContext.width);
          this.$el.setAttributeNS(null, "height", renderingContext.height);

          var canvas = document.createElementNS(xhtmlNS, "xhtml:canvas");

          this._ctx = canvas.getContext("2d");
          this._ctx.canvas.width = renderingContext.width;
          this._ctx.canvas.height = renderingContext.height;

          this.$el.appendChild(canvas);
        }

        return this.$el;
      }
    },
    update: {
      value: function update(renderingContext, datum, index) {
        var _this = this;

        // define nbr of samples per pixels
        var sliceMethod = datum instanceof Float32Array ? "subarray" : "slice";
        var nbrSamples = datum.length;
        var duration = nbrSamples / this.params.sampleRate;
        var width = renderingContext.timeToPixel(duration);
        var samplesPerPixel = nbrSamples / width;
        var minMax = [];
        // get min/max per pixels
        for (var i = 0; i <= width; i++) {
          var startTime = renderingContext.timeToPixel.invert(i);
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

          minMax.push({ time: startTime, values: [min, max] });
        }

        var MIN = 0;
        var MAX = 1;

        // rednering strategies
        if (this.params.renderingStrategy === "svg") {

          var instructions = minMax.map(function (datum, index) {
            var x = Math.floor(renderingContext.timeToPixel(datum.time));
            var y1 = Math.round(renderingContext.valueToPixel(_this.y(datum.values[MIN])));
            var y2 = Math.round(renderingContext.valueToPixel(_this.y(datum.values[MAX])));

            return "" + x + "," + y1 + "L" + x + "," + y2;
          });

          var d = "M" + instructions.join("L");
          this.$el.setAttributeNS(null, "d", d);
        } else if (this.params.renderingStrategy === "canvas") {

          this._ctx.canvas.width = width;
          this.$el.setAttribute("width", width);
          // fix chrome bug with translate
          if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
            this.$el.setAttribute("x", renderingContext.offsetX);
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
    }
  });

  return Waveform;
})(BaseShape);

module.exports = Waveform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFPLFNBQVMsMkJBQU0sY0FBYzs7QUFHcEMsSUFBTSxPQUFPLEdBQUcsOEJBQThCLENBQUM7Ozs7Ozs7Ozs7Ozs7SUFhMUIsUUFBUTtXQUFSLFFBQVE7MEJBQVIsUUFBUTs7Ozs7OztZQUFSLFFBQVE7O2VBQVIsUUFBUTtBQUMzQixnQkFBWTthQUFBLHdCQUFHO0FBQUUsZUFBTyxVQUFVLENBQUM7T0FBRTs7QUFFckMsb0JBQWdCO2FBQUEsNEJBQUc7QUFDakIsZUFBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztPQUNqQjs7QUFFRCxnQkFBWTthQUFBLHdCQUFHO0FBQ2IsZUFBTztBQUNMLG9CQUFVLEVBQUUsS0FBSztBQUNqQixlQUFLLEVBQUUsU0FBUztBQUNoQixpQkFBTyxFQUFFLENBQUM7QUFDViwyQkFBaUIsRUFBRSxLQUFLO0FBQUEsU0FDekIsQ0FBQztPQUNIOztBQUVELFVBQU07YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRTtBQUN2QixZQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFBRSxpQkFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO1NBQUU7O0FBRWxDLFlBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsS0FBSyxLQUFLLEVBQUU7O0FBRTNDLGNBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3JELGNBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDOUMsY0FBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQy9ELGNBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFB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QUFnQixDQUFDLFlBQVksQ0FBQyxNQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFcEUsa0JBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDeEIsa0JBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7V0FDekIsQ0FBQyxDQUFDOztBQUVILGNBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDcEI7T0FDRjs7OztTQWxIa0IsUUFBUTtHQUFTLFNBQVM7O2lCQUExQixRQUFRIiwiZmlsZSI6ImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuY29uc3QgeGh0bWxOUyA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJztcblxuLy8gQFRPRE8gY3JlYXRlIHN0cmF0ZWdpZXMgb2JqZWN0IHRvIGNsZWFuIHRoZSBgaWYuLi5lbHNlYCBtZXNzXG4vLyB2YXIgc3ZnU3RyYXRlZ3kgPSB7XG4vLyAgIHJlbmRlcigpIHt9LFxuLy8gICB1cGRhdGUoKSB7fVxuLy8gfTtcblxuLy8gdmFyIGNhbnZhc1N0cmF0ZWd5ID0ge1xuLy8gICByZW5kZXIoKSB7fSxcbi8vICAgdXBkYXRlKCkge31cbi8vIH07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhdmVmb3JtIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3dhdmVmb3JtJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgeTogMCB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzYW1wbGVSYXRlOiA0NDEwMCxcbiAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgcmVuZGVyaW5nU3RyYXRlZ3k6ICdzdmcnIC8vIGNhbnZhcyBpcyBidWdnZWQgKHRyYW5zbGF0aW9uLCBldGMuLi4pXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuXG4gICAgaWYgKHRoaXMucGFyYW1zLnJlbmRlcmluZ1N0cmF0ZWd5ID09PSAnc3ZnJykge1xuXG4gICAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncGF0aCcpO1xuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnbm9uZScpO1xuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG4gICAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMuY29sb3IpO1xuICAgICAgdGhpcy4kZWwuc3R5bGUub3BhY2l0eSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG5cbiAgICB9IGVsc2UgaWYgKHRoaXMucGFyYW1zLnJlbmRlcmluZ1N0cmF0ZWd5ID09PSAnY2FudmFzJykge1xuXG4gICAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZm9yZWlnbk9iamVjdCcpO1xuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgcmVuZGVyaW5nQ29udGV4dC53aWR0aCk7XG4gICAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQpO1xuXG4gICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoeGh0bWxOUywgJ3hodG1sOmNhbnZhcycpO1xuXG4gICAgICB0aGlzLl9jdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgIHRoaXMuX2N0eC5jYW52YXMud2lkdGggPSByZW5kZXJpbmdDb250ZXh0LndpZHRoO1xuICAgICAgdGhpcy5fY3R4LmNhbnZhcy5oZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcblxuICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIGluZGV4KSB7XG4gICAgLy8gZGVmaW5lIG5iciBvZiBzYW1wbGVzIHBlciBwaXhlbHNcbiAgICBjb25zdCBzbGljZU1ldGhvZCA9IGRhdHVtIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5ID8gJ3N1YmFycmF5JyA6ICdzbGljZSc7XG4gICAgY29uc3QgbmJyU2FtcGxlcyA9IGRhdHVtLmxlbmd0aDtcbiAgICBjb25zdCBkdXJhdGlvbiA9IG5iclNhbXBsZXMgLyB0aGlzLnBhcmFtcy5zYW1wbGVSYXRlO1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChkdXJhdGlvbik7XG4gICAgY29uc3Qgc2FtcGxlc1BlclBpeGVsID0gbmJyU2FtcGxlcyAvIHdpZHRoO1xuICAgIGxldCBtaW5NYXggPSBbXTtcbiAgICAvLyBnZXQgbWluL21heCBwZXIgcGl4ZWxzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gd2lkdGg7IGkrKykge1xuICAgICAgY29uc3Qgc3RhcnRUaW1lID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoaSk7XG4gICAgICBjb25zdCBzdGFydFNhbXBsZSA9IHN0YXJ0VGltZSAqIHRoaXMucGFyYW1zLnNhbXBsZVJhdGU7XG5cbiAgICAgIGNvbnN0IGV4dHJhY3QgPSBkYXR1bVtzbGljZU1ldGhvZF0oc3RhcnRTYW1wbGUsIHN0YXJ0U2FtcGxlICsgc2FtcGxlc1BlclBpeGVsKTtcbiAgICAgIGxldCBtaW4gPSBJbmZpbml0eTtcbiAgICAgIGxldCBtYXggPSAtSW5maW5pdHk7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGV4dHJhY3QubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgbGV0IHNhbXBsZSA9IGV4dHJhY3Rbal07XG4gICAgICAgIGlmIChzYW1wbGUgPCBtaW4pIHsgbWluID0gc2FtcGxlOyB9XG4gICAgICAgIGlmIChzYW1wbGUgPiBtYXgpIHsgbWF4ID0gc2FtcGxlOyB9XG4gICAgICB9XG4gICAgICAvLyBkaXNhbGxvdyBJbmZpbml0eVxuICAgICAgbWluID0gKG1pbiA9PT0gSW5maW5pdHkgfHwgbWluID09PSAtSW5maW5pdHkpID8gMCA6IG1pbjtcbiAgICAgIG1heCA9IChtYXggPT09IEluZmluaXR5IHx8IG1heCA9PT0gLUluZmluaXR5KSA/IDAgOiBtYXg7XG5cbiAgICAgIG1pbk1heC5wdXNoKHsgdGltZTogc3RhcnRUaW1lLCB2YWx1ZXM6IFttaW4sIG1heF0gfSk7XG4gICAgfVxuXG4gICAgY29uc3QgTUlOID0gMDtcbiAgICBjb25zdCBNQVggPSAxO1xuXG4gICAgLy8gcmVkbmVyaW5nIHN0cmF0ZWdpZXNcbiAgICBpZiAodGhpcy5wYXJhbXMucmVuZGVyaW5nU3RyYXRlZ3kgPT09ICdzdmcnKSB7XG5cbiAgICAgIGxldCBpbnN0cnVjdGlvbnMgPSBtaW5NYXgubWFwKChkYXR1bSwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgeCAgPSBNYXRoLmZsb29yKHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoZGF0dW0udGltZSkpO1xuICAgICAgICBsZXQgeTEgPSBNYXRoLnJvdW5kKHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMueShkYXR1bS52YWx1ZXNbTUlOXSkpKTtcbiAgICAgICAgbGV0IHkyID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLnkoZGF0dW0udmFsdWVzW01BWF0pKSk7XG5cbiAgICAgICAgcmV0dXJuIGAke3h9LCR7eTF9TCR7eH0sJHt5Mn1gO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGQgPSAnTScgKyBpbnN0cnVjdGlvbnMuam9pbignTCcpO1xuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCBkKTtcblxuICAgIH0gZWxzZSBpZiAodGhpcy5wYXJhbXMucmVuZGVyaW5nU3RyYXRlZ3kgPT09ICdjYW52YXMnKSB7XG5cbiAgICAgIHRoaXMuX2N0eC5jYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCB3aWR0aCk7XG4gICAgICAvLyBmaXggY2hyb21lIGJ1ZyB3aXRoIHRyYW5zbGF0ZVxuICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdjaHJvbWUnKSA+IC0xKSB7XG4gICAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZSgneCcsIHJlbmRlcmluZ0NvbnRleHQub2Zmc2V0WCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2N0eC5zdHJva2VTdHlsZSA9IHRoaXMucGFyYW1zLmNvbG9yO1xuICAgICAgdGhpcy5fY3R4Lmdsb2JhbEFscGhhID0gdGhpcy5wYXJhbXMub3BhY2l0eTtcbiAgICAgIHRoaXMuX2N0eC5tb3ZlVG8ocmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCgwKSwgcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoMCkpO1xuXG4gICAgICBtaW5NYXguZm9yRWFjaCgoZGF0dW0pID0+IHtcbiAgICAgICAgY29uc3QgeCAgPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKGRhdHVtLnRpbWUpO1xuICAgICAgICBjb25zdCB5MSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMueShkYXR1bS52YWx1ZXNbTUlOXSkpO1xuICAgICAgICBjb25zdCB5MiA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMueShkYXR1bS52YWx1ZXNbTUFYXSkpO1xuXG4gICAgICAgIHRoaXMuX2N0eC5tb3ZlVG8oeCwgeTEpO1xuICAgICAgICB0aGlzLl9jdHgubGluZVRvKHgsIHkyKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9jdHguc3Ryb2tlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=