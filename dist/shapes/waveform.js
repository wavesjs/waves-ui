"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var BaseShape = require("./base-shape");

var Waveform = (function (_BaseShape) {
  function Waveform() {
    _classCallCheck(this, Waveform);

    if (_BaseShape != null) {
      _BaseShape.apply(this, arguments);
    }
  }

  _inherits(Waveform, _BaseShape);

  _createClass(Waveform, {
    _getAccessorList: {
      value: function _getAccessorList() {
        return { y: 0, sampleRate: 1000 };
      }
    },
    _getDefaults: {
      value: function _getDefaults() {
        return {
          color: "#000000"
        };
      }
    },
    render: {
      value: function render(renderingContext) {
        if (this.shape) {
          return this.shape;
        }

        this.shape = document.createElementNS(this.ns, "path");
        this.shape.setAttributeNS(null, "fill", "none");
        this.shape.setAttributeNS(null, "stroke", "steelblue");
        this.shape.setAttributeNS(null, "shape-rendering", "crispEdges");

        return this.shape;
      }
    },
    update: {
      value: function update(renderingContext, group, datum, index) {
        var _this = this;

        this.shape.setAttributeNS(null, "d", "");

        // define nbr of samples per pixels
        var sliceMethod = datum instanceof Float32Array ? "subarray" : "slice";
        var nbrSamples = datum.length;
        var duration = nbrSamples / this.sampleRate(datum);
        var width = renderingContext.xScale(duration);
        var samplesPerPixel = nbrSamples / width;
        var minMax = [];
        // console.log(datum, datum instanceof Float32Array);
        // get min/max per pixels
        for (var i = 0; i <= width; i++) {
          var startTime = renderingContext.xScale.invert(i);
          var startSample = startTime * this.sampleRate(datum);

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

          minMax.push({ time: startTime, values: [min, max] });
        }

        var MIN = 0;
        var MAX = 1;
        // draw line
        var instructions = minMax.map(function (datum, index) {
          var x = renderingContext.xScale(datum.time);
          var y1 = renderingContext.yScale(_this.y(datum.values[MIN]));
          var y2 = renderingContext.yScale(_this.y(datum.values[MAX]));

          return "" + x + "," + y1 + "L" + x + "," + y2;
        });

        var d = "M" + instructions.join("L");

        this.shape.setAttributeNS(null, "d", d);
      }
    }
  });

  return Waveform;
})(BaseShape);

module.exports = Waveform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvd2F2ZWZvcm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7O0lBRWxDLFFBQVE7V0FBUixRQUFROzBCQUFSLFFBQVE7Ozs7Ozs7WUFBUixRQUFROztlQUFSLFFBQVE7QUFDWixvQkFBZ0I7YUFBQSw0QkFBRztBQUNqQixlQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUM7T0FDbkM7O0FBRUQsZ0JBQVk7YUFBQSx3QkFBRztBQUNiLGVBQU87QUFDTCxlQUFLLEVBQUUsU0FBUztTQUNqQixDQUFDO09BQ0g7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFO0FBQ3ZCLFlBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUFFLGlCQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FBRTs7QUFFdEMsWUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdkQsWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNoRCxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3ZELFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxZQUFZLENBQUMsQ0FBQzs7QUFFakUsZUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO09BQ25COztBQUVELFVBQU07YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTs7O0FBQzVDLFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7OztBQUd6QyxZQUFNLFdBQVcsR0FBRyxLQUFLLFlBQVksWUFBWSxHQUFHLFVBQVUsR0FBRyxPQUFPLENBQUM7QUFDekUsWUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUNoQyxZQUFNLFFBQVEsR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyRCxZQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDaEQsWUFBTSxlQUFlLEdBQUcsVUFBVSxHQUFHLEtBQUssQ0FBQztBQUMzQyxZQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7OztBQUdoQixhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQy9CLGNBQU0sU0FBUyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEQsY0FBTSxXQUFXLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXZELGNBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLEVBQUUsV0FBVyxHQUFHLGVBQWUsQ0FBQyxDQUFDO0FBQy9FLGNBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQztBQUNuQixjQUFJLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUNwQixlQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN2QyxnQkFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLGdCQUFJLE1BQU0sR0FBRyxHQUFHLEVBQUU7QUFBRSxpQkFBRyxHQUFHLE1BQU0sQ0FBQzthQUFFO0FBQ25DLGdCQUFJLE1BQU0sR0FBRyxHQUFHLEVBQUU7QUFBRSxpQkFBRyxHQUFHLE1BQU0sQ0FBQzthQUFFO1dBQ3BDOztBQUVELGdCQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3REOztBQUVELFlBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNkLFlBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQzs7QUFFZCxZQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSyxFQUFFLEtBQUssRUFBSztBQUM5QyxjQUFNLENBQUMsR0FBSSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9DLGNBQU0sRUFBRSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5RCxjQUFNLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsTUFBSyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTlELHNCQUFVLENBQUMsU0FBSSxFQUFFLFNBQUksQ0FBQyxTQUFJLEVBQUUsQ0FBRztTQUNoQyxDQUFDLENBQUM7O0FBRUgsWUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXZDLFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7T0FDekM7Ozs7U0FoRUcsUUFBUTtHQUFTLFNBQVM7O0FBbUVoQyxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyIsImZpbGUiOiJlczYvc2hhcGVzL3dhdmVmb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEJhc2VTaGFwZSA9IHJlcXVpcmUoJy4vYmFzZS1zaGFwZScpO1xuXG5jbGFzcyBXYXZlZm9ybSBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgeTogMCwgc2FtcGxlUmF0ZTogMTAwMCB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb2xvcjogJyMwMDAwMDAnXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuc2hhcGUpIHsgcmV0dXJuIHRoaXMuc2hhcGU7IH1cblxuICAgIHRoaXMuc2hhcGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3BhdGgnKTtcbiAgICB0aGlzLnNoYXBlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcbiAgICB0aGlzLnNoYXBlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCAnc3RlZWxibHVlJyk7XG4gICAgdGhpcy5zaGFwZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcblxuICAgIHJldHVybiB0aGlzLnNoYXBlO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGdyb3VwLCBkYXR1bSwgaW5kZXgpIHtcbiAgICB0aGlzLnNoYXBlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgJycpO1xuXG4gICAgLy8gZGVmaW5lIG5iciBvZiBzYW1wbGVzIHBlciBwaXhlbHNcbiAgICBjb25zdCBzbGljZU1ldGhvZCA9IGRhdHVtIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5ID8gJ3N1YmFycmF5JyA6ICdzbGljZSc7XG4gICAgY29uc3QgbmJyU2FtcGxlcyA9IGRhdHVtLmxlbmd0aDtcbiAgICBjb25zdCBkdXJhdGlvbiA9IG5iclNhbXBsZXMgLyB0aGlzLnNhbXBsZVJhdGUoZGF0dW0pO1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC54U2NhbGUoZHVyYXRpb24pO1xuICAgIGNvbnN0IHNhbXBsZXNQZXJQaXhlbCA9IG5iclNhbXBsZXMgLyB3aWR0aDtcbiAgICBsZXQgbWluTWF4ID0gW107XG4gICAgLy8gY29uc29sZS5sb2coZGF0dW0sIGRhdHVtIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5KTtcbiAgICAvLyBnZXQgbWluL21heCBwZXIgcGl4ZWxzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gd2lkdGg7IGkrKykge1xuICAgICAgY29uc3Qgc3RhcnRUaW1lID0gcmVuZGVyaW5nQ29udGV4dC54U2NhbGUuaW52ZXJ0KGkpO1xuICAgICAgY29uc3Qgc3RhcnRTYW1wbGUgPSBzdGFydFRpbWUgKiB0aGlzLnNhbXBsZVJhdGUoZGF0dW0pO1xuXG4gICAgICBjb25zdCBleHRyYWN0ID0gZGF0dW1bc2xpY2VNZXRob2RdKHN0YXJ0U2FtcGxlLCBzdGFydFNhbXBsZSArIHNhbXBsZXNQZXJQaXhlbCk7XG4gICAgICBsZXQgbWluID0gSW5maW5pdHk7XG4gICAgICBsZXQgbWF4ID0gLUluZmluaXR5O1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBleHRyYWN0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGxldCBzYW1wbGUgPSBleHRyYWN0W2pdO1xuICAgICAgICBpZiAoc2FtcGxlIDwgbWluKSB7IG1pbiA9IHNhbXBsZTsgfVxuICAgICAgICBpZiAoc2FtcGxlID4gbWF4KSB7IG1heCA9IHNhbXBsZTsgfVxuICAgICAgfVxuXG4gICAgICBtaW5NYXgucHVzaCh7IHRpbWU6IHN0YXJ0VGltZSwgdmFsdWVzOiBbbWluLCBtYXhdIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IE1JTiA9IDA7XG4gICAgY29uc3QgTUFYID0gMTtcbiAgICAvLyBkcmF3IGxpbmVcbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gbWluTWF4Lm1hcCgoZGF0dW0sIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCB4ICA9IHJlbmRlcmluZ0NvbnRleHQueFNjYWxlKGRhdHVtLnRpbWUpO1xuICAgICAgY29uc3QgeTEgPSByZW5kZXJpbmdDb250ZXh0LnlTY2FsZSh0aGlzLnkoZGF0dW0udmFsdWVzW01JTl0pKTtcbiAgICAgIGNvbnN0IHkyID0gcmVuZGVyaW5nQ29udGV4dC55U2NhbGUodGhpcy55KGRhdHVtLnZhbHVlc1tNQVhdKSk7XG5cbiAgICAgIHJldHVybiBgJHt4fSwke3kxfUwke3h9LCR7eTJ9YDtcbiAgICB9KTtcblxuICAgIGNvbnN0IGQgPSAnTScgKyBpbnN0cnVjdGlvbnMuam9pbignTCcpO1xuXG4gICAgdGhpcy5zaGFwZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIGQpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gV2F2ZWZvcm07XG4iXX0=