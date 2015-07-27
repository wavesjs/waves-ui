"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseShape = _interopRequire(require("./base-shape"));

var xhtmlNS = "http://www.w3.org/1999/xhtml";

// @TODO create strategies object to clean the `if...else` mess
var svgStrategy = {
  render: function render() {},
  update: function update() {}
};

var canvasStrategy = {
  render: function render() {},
  update: function update() {}
};

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
//# sourceMappingURL=data:application/json;base64,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S0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BELGdCQUFNLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsTUFBSyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEUsZ0JBQU0sRUFBRSxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxNQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFcEUsa0JBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDeEIsa0JBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7V0FDekIsQ0FBQyxDQUFDOztBQUVILGNBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDcEI7T0FDRjs7OztTQWxIa0IsUUFBUTtHQUFTLFNBQVM7O2lCQUExQixRQUFRIiwiZmlsZSI6ImVzNi9zaGFwZXMvd2F2ZWZvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuY29uc3QgeGh0bWxOUyA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJztcblxuLy8gQFRPRE8gY3JlYXRlIHN0cmF0ZWdpZXMgb2JqZWN0IHRvIGNsZWFuIHRoZSBgaWYuLi5lbHNlYCBtZXNzXG52YXIgc3ZnU3RyYXRlZ3kgPSB7XG4gIHJlbmRlcigpIHt9LFxuICB1cGRhdGUoKSB7fVxufVxuXG52YXIgY2FudmFzU3RyYXRlZ3kgPSB7XG4gIHJlbmRlcigpIHt9LFxuICB1cGRhdGUoKSB7fVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXZlZm9ybSBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICd3YXZlZm9ybSc7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IHk6IDAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2FtcGxlUmF0ZTogNDQxMDAsXG4gICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIHJlbmRlcmluZ1N0cmF0ZWd5OiAnc3ZnJyAvLyBjYW52YXMgaXMgYnVnZ2VkICh0cmFuc2xhdGlvbiwgZXRjLi4uKVxuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbCkgeyByZXR1cm4gdGhpcy4kZWw7IH1cblxuICAgIGlmICh0aGlzLnBhcmFtcy5yZW5kZXJpbmdTdHJhdGVneSA9PT0gJ3N2ZycpIHtcblxuICAgICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3BhdGgnKTtcbiAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcbiAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLmNvbG9yKTtcbiAgICAgIHRoaXMuJGVsLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuXG4gICAgfSBlbHNlIGlmICh0aGlzLnBhcmFtcy5yZW5kZXJpbmdTdHJhdGVneSA9PT0gJ2NhbnZhcycpIHtcblxuICAgICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2ZvcmVpZ25PYmplY3QnKTtcbiAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHJlbmRlcmluZ0NvbnRleHQud2lkdGgpO1xuICAgICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0KTtcblxuICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHhodG1sTlMsICd4aHRtbDpjYW52YXMnKTtcblxuICAgICAgdGhpcy5fY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICB0aGlzLl9jdHguY2FudmFzLndpZHRoID0gcmVuZGVyaW5nQ29udGV4dC53aWR0aDtcbiAgICAgIHRoaXMuX2N0eC5jYW52YXMuaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG5cbiAgICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCBpbmRleCkge1xuICAgIC8vIGRlZmluZSBuYnIgb2Ygc2FtcGxlcyBwZXIgcGl4ZWxzXG4gICAgY29uc3Qgc2xpY2VNZXRob2QgPSBkYXR1bSBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSA/ICdzdWJhcnJheScgOiAnc2xpY2UnO1xuICAgIGNvbnN0IG5iclNhbXBsZXMgPSBkYXR1bS5sZW5ndGg7XG4gICAgY29uc3QgZHVyYXRpb24gPSBuYnJTYW1wbGVzIC8gdGhpcy5wYXJhbXMuc2FtcGxlUmF0ZTtcbiAgICBjb25zdCB3aWR0aCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoZHVyYXRpb24pO1xuICAgIGNvbnN0IHNhbXBsZXNQZXJQaXhlbCA9IG5iclNhbXBsZXMgLyB3aWR0aDtcbiAgICBsZXQgbWluTWF4ID0gW107XG4gICAgLy8gZ2V0IG1pbi9tYXggcGVyIHBpeGVsc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHdpZHRoOyBpKyspIHtcbiAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KGkpO1xuICAgICAgY29uc3Qgc3RhcnRTYW1wbGUgPSBzdGFydFRpbWUgKiB0aGlzLnBhcmFtcy5zYW1wbGVSYXRlO1xuXG4gICAgICBjb25zdCBleHRyYWN0ID0gZGF0dW1bc2xpY2VNZXRob2RdKHN0YXJ0U2FtcGxlLCBzdGFydFNhbXBsZSArIHNhbXBsZXNQZXJQaXhlbCk7XG4gICAgICBsZXQgbWluID0gSW5maW5pdHk7XG4gICAgICBsZXQgbWF4ID0gLUluZmluaXR5O1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBleHRyYWN0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGxldCBzYW1wbGUgPSBleHRyYWN0W2pdO1xuICAgICAgICBpZiAoc2FtcGxlIDwgbWluKSB7IG1pbiA9IHNhbXBsZTsgfVxuICAgICAgICBpZiAoc2FtcGxlID4gbWF4KSB7IG1heCA9IHNhbXBsZTsgfVxuICAgICAgfVxuICAgICAgLy8gZGlzYWxsb3cgSW5maW5pdHlcbiAgICAgIG1pbiA9IChtaW4gPT09IEluZmluaXR5IHx8IG1pbiA9PT0gLUluZmluaXR5KSA/IDAgOiBtaW47XG4gICAgICBtYXggPSAobWF4ID09PSBJbmZpbml0eSB8fCBtYXggPT09IC1JbmZpbml0eSkgPyAwIDogbWF4O1xuXG4gICAgICBtaW5NYXgucHVzaCh7IHRpbWU6IHN0YXJ0VGltZSwgdmFsdWVzOiBbbWluLCBtYXhdIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IE1JTiA9IDA7XG4gICAgY29uc3QgTUFYID0gMTtcblxuICAgIC8vIHJlZG5lcmluZyBzdHJhdGVnaWVzXG4gICAgaWYgKHRoaXMucGFyYW1zLnJlbmRlcmluZ1N0cmF0ZWd5ID09PSAnc3ZnJykge1xuXG4gICAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gbWluTWF4Lm1hcCgoZGF0dW0sIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IHggID0gTWF0aC5mbG9vcihyZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKGRhdHVtLnRpbWUpKTtcbiAgICAgICAgbGV0IHkxID0gTWF0aC5yb3VuZChyZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLnkoZGF0dW0udmFsdWVzW01JTl0pKSk7XG4gICAgICAgIGxldCB5MiA9IE1hdGgucm91bmQocmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwodGhpcy55KGRhdHVtLnZhbHVlc1tNQVhdKSkpO1xuXG4gICAgICAgIHJldHVybiBgJHt4fSwke3kxfUwke3h9LCR7eTJ9YDtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBkID0gJ00nICsgaW5zdHJ1Y3Rpb25zLmpvaW4oJ0wnKTtcbiAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgZCk7XG5cbiAgICB9IGVsc2UgaWYgKHRoaXMucGFyYW1zLnJlbmRlcmluZ1N0cmF0ZWd5ID09PSAnY2FudmFzJykge1xuXG4gICAgICB0aGlzLl9jdHguY2FudmFzLndpZHRoID0gd2lkdGg7XG4gICAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgd2lkdGgpO1xuICAgICAgLy8gZml4IGNocm9tZSBidWcgd2l0aCB0cmFuc2xhdGVcbiAgICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignY2hyb21lJykgPiAtMSkge1xuICAgICAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGUoJ3gnLCByZW5kZXJpbmdDb250ZXh0Lm9mZnNldFgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9jdHguc3Ryb2tlU3R5bGUgPSB0aGlzLnBhcmFtcy5jb2xvcjtcbiAgICAgIHRoaXMuX2N0eC5nbG9iYWxBbHBoYSA9IHRoaXMucGFyYW1zLm9wYWNpdHk7XG4gICAgICB0aGlzLl9jdHgubW92ZVRvKHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoMCksIHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKDApKTtcblxuICAgICAgbWluTWF4LmZvckVhY2goKGRhdHVtKSA9PiB7XG4gICAgICAgIGNvbnN0IHggID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbChkYXR1bS50aW1lKTtcbiAgICAgICAgY29uc3QgeTEgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLnkoZGF0dW0udmFsdWVzW01JTl0pKTtcbiAgICAgICAgY29uc3QgeTIgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbCh0aGlzLnkoZGF0dW0udmFsdWVzW01BWF0pKTtcblxuICAgICAgICB0aGlzLl9jdHgubW92ZVRvKHgsIHkxKTtcbiAgICAgICAgdGhpcy5fY3R4LmxpbmVUbyh4LCB5Mik7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fY3R4LnN0cm9rZSgpO1xuICAgIH1cbiAgfVxufVxuIl19