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
      value: function render(context) {
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
      value: function update(context, group, datum, index) {
        var _this = this;

        this.shape.setAttributeNS(null, "d", "");

        // define nbr of samples per pixels
        var nbrSamples = datum.length;
        var duration = nbrSamples / this.sampleRate(datum);
        var width = context.xScale(duration);
        var samplesPerPixel = nbrSamples / width;
        var minMax = [];
        // get min/max per pixels
        for (var i = 0; i <= width; i++) {
          var startTime = context.xScale.invert(i);
          var startSample = startTime * this.sampleRate(datum);

          var extract = datum.slice(startSample, startSample + samplesPerPixel);
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
          var x = context.xScale(datum.time);
          var y1 = context.yScale(_this.y(datum.values[MIN]));
          var y2 = context.yScale(_this.y(datum.values[MAX]));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvd2F2ZWZvcm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7O0lBRWxDLFFBQVE7V0FBUixRQUFROzBCQUFSLFFBQVE7Ozs7Ozs7WUFBUixRQUFROztlQUFSLFFBQVE7QUFDWixvQkFBZ0I7YUFBQSw0QkFBRztBQUNqQixlQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUE7T0FDbEM7O0FBRUQsZ0JBQVk7YUFBQSx3QkFBRztBQUNiLGVBQU87QUFDTCxlQUFLLEVBQUUsU0FBUztTQUNqQixDQUFBO09BQ0Y7O0FBRUQsVUFBTTthQUFBLGdCQUFDLE9BQU8sRUFBRTtBQUNkLFlBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUFFLGlCQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FBRTs7QUFFdEMsWUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdkQsWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNoRCxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3ZELFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxZQUFZLENBQUMsQ0FBQzs7QUFFakUsZUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO09BQ25COztBQUVELFVBQU07YUFBQSxnQkFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7OztBQUNuQyxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7QUFHekMsWUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUNoQyxZQUFNLFFBQVEsR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyRCxZQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZDLFlBQU0sZUFBZSxHQUFHLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDM0MsWUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDOztBQUVoQixhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQy9CLGNBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNDLGNBQU0sV0FBVyxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV2RCxjQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxXQUFXLEdBQUcsZUFBZSxDQUFDLENBQUM7QUFDeEUsY0FBSSxHQUFHLEdBQUcsUUFBUSxDQUFDO0FBQ25CLGNBQUksR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBQ3BCLGVBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3ZDLGdCQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEIsZ0JBQUksTUFBTSxHQUFHLEdBQUcsRUFBRTtBQUFFLGlCQUFHLEdBQUcsTUFBTSxDQUFDO2FBQUU7QUFDbkMsZ0JBQUksTUFBTSxHQUFHLEdBQUcsRUFBRTtBQUFFLGlCQUFHLEdBQUcsTUFBTSxDQUFDO2FBQUU7V0FDcEM7O0FBRUQsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDdEQ7O0FBRUQsWUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsWUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDOztBQUVkLFlBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFLO0FBQzlDLGNBQU0sQ0FBQyxHQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RDLGNBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBSyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckQsY0FBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFckQsc0JBQVUsQ0FBQyxTQUFJLEVBQUUsU0FBSSxDQUFDLFNBQUksRUFBRSxDQUFHO1NBQ2hDLENBQUMsQ0FBQzs7QUFFSCxZQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFdkMsWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztPQUN6Qzs7OztTQTlERyxRQUFRO0dBQVMsU0FBUzs7QUFpRWhDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDIiwiZmlsZSI6ImVzNi9zaGFwZXMvd2F2ZWZvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQmFzZVNoYXBlID0gcmVxdWlyZSgnLi9iYXNlLXNoYXBlJyk7XG5cbmNsYXNzIFdhdmVmb3JtIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyB5OiAwLCBzYW1wbGVSYXRlOiAxMDAwIH1cbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29sb3I6ICcjMDAwMDAwJ1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcihjb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuc2hhcGUpIHsgcmV0dXJuIHRoaXMuc2hhcGU7IH1cblxuICAgIHRoaXMuc2hhcGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3BhdGgnKTtcbiAgICB0aGlzLnNoYXBlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcbiAgICB0aGlzLnNoYXBlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCAnc3RlZWxibHVlJyk7XG4gICAgdGhpcy5zaGFwZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcblxuICAgIHJldHVybiB0aGlzLnNoYXBlO1xuICB9XG5cbiAgdXBkYXRlKGNvbnRleHQsIGdyb3VwLCBkYXR1bSwgaW5kZXgpIHtcbiAgICB0aGlzLnNoYXBlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgJycpO1xuXG4gICAgLy8gZGVmaW5lIG5iciBvZiBzYW1wbGVzIHBlciBwaXhlbHNcbiAgICBjb25zdCBuYnJTYW1wbGVzID0gZGF0dW0ubGVuZ3RoO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gbmJyU2FtcGxlcyAvIHRoaXMuc2FtcGxlUmF0ZShkYXR1bSk7XG4gICAgY29uc3Qgd2lkdGggPSBjb250ZXh0LnhTY2FsZShkdXJhdGlvbik7XG4gICAgY29uc3Qgc2FtcGxlc1BlclBpeGVsID0gbmJyU2FtcGxlcyAvIHdpZHRoO1xuICAgIGxldCBtaW5NYXggPSBbXTtcbiAgICAvLyBnZXQgbWluL21heCBwZXIgcGl4ZWxzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gd2lkdGg7IGkrKykge1xuICAgICAgY29uc3Qgc3RhcnRUaW1lID0gY29udGV4dC54U2NhbGUuaW52ZXJ0KGkpO1xuICAgICAgY29uc3Qgc3RhcnRTYW1wbGUgPSBzdGFydFRpbWUgKiB0aGlzLnNhbXBsZVJhdGUoZGF0dW0pO1xuXG4gICAgICBjb25zdCBleHRyYWN0ID0gZGF0dW0uc2xpY2Uoc3RhcnRTYW1wbGUsIHN0YXJ0U2FtcGxlICsgc2FtcGxlc1BlclBpeGVsKTtcbiAgICAgIGxldCBtaW4gPSBJbmZpbml0eTtcbiAgICAgIGxldCBtYXggPSAtSW5maW5pdHk7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGV4dHJhY3QubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgbGV0IHNhbXBsZSA9IGV4dHJhY3Rbal07XG4gICAgICAgIGlmIChzYW1wbGUgPCBtaW4pIHsgbWluID0gc2FtcGxlOyB9XG4gICAgICAgIGlmIChzYW1wbGUgPiBtYXgpIHsgbWF4ID0gc2FtcGxlOyB9XG4gICAgICB9XG5cbiAgICAgIG1pbk1heC5wdXNoKHsgdGltZTogc3RhcnRUaW1lLCB2YWx1ZXM6IFttaW4sIG1heF0gfSk7XG4gICAgfVxuXG4gICAgY29uc3QgTUlOID0gMDtcbiAgICBjb25zdCBNQVggPSAxO1xuICAgIC8vIGRyYXcgbGluZVxuICAgIGxldCBpbnN0cnVjdGlvbnMgPSBtaW5NYXgubWFwKChkYXR1bSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHggID0gY29udGV4dC54U2NhbGUoZGF0dW0udGltZSk7XG4gICAgICBjb25zdCB5MSA9IGNvbnRleHQueVNjYWxlKHRoaXMueShkYXR1bS52YWx1ZXNbTUlOXSkpO1xuICAgICAgY29uc3QgeTIgPSBjb250ZXh0LnlTY2FsZSh0aGlzLnkoZGF0dW0udmFsdWVzW01BWF0pKTtcblxuICAgICAgcmV0dXJuIGAke3h9LCR7eTF9TCR7eH0sJHt5Mn1gO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZCA9ICdNJyArIGluc3RydWN0aW9ucy5qb2luKCdMJyk7XG5cbiAgICB0aGlzLnNoYXBlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgZCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBXYXZlZm9ybTsiXX0=