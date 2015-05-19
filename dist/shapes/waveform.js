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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvd2F2ZWZvcm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7O0lBRWxDLFFBQVE7V0FBUixRQUFROzBCQUFSLFFBQVE7Ozs7Ozs7WUFBUixRQUFROztlQUFSLFFBQVE7QUFDWixvQkFBZ0I7YUFBQSw0QkFBRztBQUNqQixlQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUE7T0FDbEM7O0FBRUQsZ0JBQVk7YUFBQSx3QkFBRztBQUNiLGVBQU87QUFDTCxlQUFLLEVBQUUsU0FBUztTQUNqQixDQUFBO09BQ0Y7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFO0FBQ3ZCLFlBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUFFLGlCQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FBRTs7QUFFdEMsWUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdkQsWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNoRCxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3ZELFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxZQUFZLENBQUMsQ0FBQzs7QUFFakUsZUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO09BQ25COztBQUVELFVBQU07YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTs7O0FBQzVDLFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7OztBQUd6QyxZQUFNLFdBQVcsR0FBRyxLQUFLLFlBQVksWUFBWSxHQUFHLFVBQVUsR0FBRyxPQUFPLENBQUM7QUFDekUsWUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUNoQyxZQUFNLFFBQVEsR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyRCxZQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDaEQsWUFBTSxlQUFlLEdBQUcsVUFBVSxHQUFHLEtBQUssQ0FBQztBQUMzQyxZQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7OztBQUdoQixhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQy9CLGNBQU0sU0FBUyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEQsY0FBTSxXQUFXLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXZELGNBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLEVBQUUsV0FBVyxHQUFHLGVBQWUsQ0FBQyxDQUFDO0FBQy9FLGNBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQztBQUNuQixjQUFJLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUNwQixlQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN2QyxnQkFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLGdCQUFJLE1BQU0sR0FBRyxHQUFHLEVBQUU7QUFBRSxpQkFBRyxHQUFHLE1BQU0sQ0FBQzthQUFFO0FBQ25DLGdCQUFJLE1BQU0sR0FBRyxHQUFHLEVBQUU7QUFBRSxpQkFBRyxHQUFHLE1BQU0sQ0FBQzthQUFFO1dBQ3BDOztBQUVELGdCQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3REOztBQUVELFlBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNkLFlBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQzs7QUFFZCxZQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSyxFQUFFLEtBQUssRUFBSztBQUM5QyxjQUFNLENBQUMsR0FBSSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9DLGNBQU0sRUFBRSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5RCxjQUFNLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsTUFBSyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTlELHNCQUFVLENBQUMsU0FBSSxFQUFFLFNBQUksQ0FBQyxTQUFJLEVBQUUsQ0FBRztTQUNoQyxDQUFDLENBQUM7O0FBRUgsWUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXZDLFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7T0FDekM7Ozs7U0FoRUcsUUFBUTtHQUFTLFNBQVM7O0FBbUVoQyxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyIsImZpbGUiOiJlczYvc2hhcGVzL3dhdmVmb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEJhc2VTaGFwZSA9IHJlcXVpcmUoJy4vYmFzZS1zaGFwZScpO1xuXG5jbGFzcyBXYXZlZm9ybSBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgeTogMCwgc2FtcGxlUmF0ZTogMTAwMCB9XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbG9yOiAnIzAwMDAwMCdcbiAgICB9XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLnNoYXBlKSB7IHJldHVybiB0aGlzLnNoYXBlOyB9XG5cbiAgICB0aGlzLnNoYXBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgdGhpcy5zaGFwZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsICdub25lJyk7XG4gICAgdGhpcy5zaGFwZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgJ3N0ZWVsYmx1ZScpO1xuICAgIHRoaXMuc2hhcGUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG5cbiAgICByZXR1cm4gdGhpcy5zaGFwZTtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBncm91cCwgZGF0dW0sIGluZGV4KSB7XG4gICAgdGhpcy5zaGFwZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsICcnKTtcblxuICAgIC8vIGRlZmluZSBuYnIgb2Ygc2FtcGxlcyBwZXIgcGl4ZWxzXG4gICAgY29uc3Qgc2xpY2VNZXRob2QgPSBkYXR1bSBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSA/ICdzdWJhcnJheScgOiAnc2xpY2UnO1xuICAgIGNvbnN0IG5iclNhbXBsZXMgPSBkYXR1bS5sZW5ndGg7XG4gICAgY29uc3QgZHVyYXRpb24gPSBuYnJTYW1wbGVzIC8gdGhpcy5zYW1wbGVSYXRlKGRhdHVtKTtcbiAgICBjb25zdCB3aWR0aCA9IHJlbmRlcmluZ0NvbnRleHQueFNjYWxlKGR1cmF0aW9uKTtcbiAgICBjb25zdCBzYW1wbGVzUGVyUGl4ZWwgPSBuYnJTYW1wbGVzIC8gd2lkdGg7XG4gICAgbGV0IG1pbk1heCA9IFtdO1xuICAgIC8vIGNvbnNvbGUubG9nKGRhdHVtLCBkYXR1bSBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSk7XG4gICAgLy8gZ2V0IG1pbi9tYXggcGVyIHBpeGVsc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHdpZHRoOyBpKyspIHtcbiAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IHJlbmRlcmluZ0NvbnRleHQueFNjYWxlLmludmVydChpKTtcbiAgICAgIGNvbnN0IHN0YXJ0U2FtcGxlID0gc3RhcnRUaW1lICogdGhpcy5zYW1wbGVSYXRlKGRhdHVtKTtcblxuICAgICAgY29uc3QgZXh0cmFjdCA9IGRhdHVtW3NsaWNlTWV0aG9kXShzdGFydFNhbXBsZSwgc3RhcnRTYW1wbGUgKyBzYW1wbGVzUGVyUGl4ZWwpO1xuICAgICAgbGV0IG1pbiA9IEluZmluaXR5O1xuICAgICAgbGV0IG1heCA9IC1JbmZpbml0eTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZXh0cmFjdC5sZW5ndGg7IGorKykge1xuICAgICAgICBsZXQgc2FtcGxlID0gZXh0cmFjdFtqXTtcbiAgICAgICAgaWYgKHNhbXBsZSA8IG1pbikgeyBtaW4gPSBzYW1wbGU7IH1cbiAgICAgICAgaWYgKHNhbXBsZSA+IG1heCkgeyBtYXggPSBzYW1wbGU7IH1cbiAgICAgIH1cblxuICAgICAgbWluTWF4LnB1c2goeyB0aW1lOiBzdGFydFRpbWUsIHZhbHVlczogW21pbiwgbWF4XSB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBNSU4gPSAwO1xuICAgIGNvbnN0IE1BWCA9IDE7XG4gICAgLy8gZHJhdyBsaW5lXG4gICAgbGV0IGluc3RydWN0aW9ucyA9IG1pbk1heC5tYXAoKGRhdHVtLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgeCAgPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZShkYXR1bS50aW1lKTtcbiAgICAgIGNvbnN0IHkxID0gcmVuZGVyaW5nQ29udGV4dC55U2NhbGUodGhpcy55KGRhdHVtLnZhbHVlc1tNSU5dKSk7XG4gICAgICBjb25zdCB5MiA9IHJlbmRlcmluZ0NvbnRleHQueVNjYWxlKHRoaXMueShkYXR1bS52YWx1ZXNbTUFYXSkpO1xuXG4gICAgICByZXR1cm4gYCR7eH0sJHt5MX1MJHt4fSwke3kyfWA7XG4gICAgfSk7XG5cbiAgICBjb25zdCBkID0gJ00nICsgaW5zdHJ1Y3Rpb25zLmpvaW4oJ0wnKTtcblxuICAgIHRoaXMuc2hhcGUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCBkKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFdhdmVmb3JtOyJdfQ==