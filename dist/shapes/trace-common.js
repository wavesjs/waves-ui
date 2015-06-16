"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var BaseShape = require("./base-shape");

var TraceCommon = (function (_BaseShape) {
  function TraceCommon() {
    _classCallCheck(this, TraceCommon);

    if (_BaseShape != null) {
      _BaseShape.apply(this, arguments);
    }
  }

  _inherits(TraceCommon, _BaseShape);

  _createClass(TraceCommon, {
    _getAccessorList: {
      value: function _getAccessorList() {
        return { x: 0, mean: 0, range: 0 };
      }
    },
    _getDefaults: {
      value: function _getDefaults() {
        return {
          rangeColor: "steelblue",
          meanColor: "#232323",
          displayMean: true
        };
      }
    },
    render: {
      value: function render(renderingContext) {
        if (this.shape) {
          return this.shape;
        }
        this.shape = document.createElementNS(this.ns, "g");
        // range path
        this.rangeZone = document.createElementNS(this.ns, "path");
        this.shape.appendChild(this.rangeZone);

        // mean line
        if (this.params.displayMean) {
          this.meanLine = document.createElementNS(this.ns, "path");
          this.shape.appendChild(this.meanLine);
        }

        return this.shape;
      }
    },
    update: {

      // @TODO use accessors

      value: function update(renderingContext, group, data) {
        var _this = this;

        // order data by x position
        data = data.slice(0);
        data.sort(function (a, b) {
          return _this.x(a) < _this.x(b) ? -1 : 1;
        });

        if (this.params.displayMean) {
          this.meanLine.setAttributeNS(null, "d", this._buildMeanLine(renderingContext, data));
          this.meanLine.setAttributeNS(null, "stroke", this.params.meanColor);
          this.meanLine.setAttributeNS(null, "fill", "none");
        }

        this.rangeZone.setAttributeNS(null, "d", this._buildRangeZone(renderingContext, data));
        this.rangeZone.setAttributeNS(null, "stroke", "none");
        this.rangeZone.setAttributeNS(null, "fill", this.params.rangeColor);
        this.rangeZone.setAttributeNS(null, "opacity", "0.4");

        data = null;
      }
    },
    _buildMeanLine: {
      value: function _buildMeanLine(renderingContext, data) {
        var _this = this;

        var instructions = data.map(function (datum, index) {
          var x = renderingContext.xScale(_this.x(datum));
          var y = renderingContext.yScale(_this.mean(datum));
          return "" + x + "," + y;
        });

        return "M" + instructions.join("L");
      }
    },
    _buildRangeZone: {
      value: function _buildRangeZone(renderingContext, data) {
        var length = data.length;
        // const lastIndex = data
        var instructionsStart = "";
        var instructionsEnd = "";

        for (var i = 0; i < length; i++) {
          var datum = data[i];
          var mean = this.mean(datum);
          var halfRange = this.range(datum) / 2;

          var x = renderingContext.xScale(this.x(datum));
          var y0 = renderingContext.yScale(mean + halfRange);
          var y1 = renderingContext.yScale(mean - halfRange);

          var start = "" + x + "," + y0;
          var end = "" + x + "," + y1;

          instructionsStart = instructionsStart === "" ? start : "" + instructionsStart + "L" + start;
          instructionsEnd = instructionsEnd === "" ? end : "" + end + "L" + instructionsEnd;
        }

        var instructions = "M" + instructionsStart + "L" + instructionsEnd + "Z";
        return instructions;
      }
    }
  });

  return TraceCommon;
})(BaseShape);

module.exports = TraceCommon;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvdHJhY2UtY29tbW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztJQUVwQyxXQUFXO1dBQVgsV0FBVzswQkFBWCxXQUFXOzs7Ozs7O1lBQVgsV0FBVzs7ZUFBWCxXQUFXO0FBQ2Ysb0JBQWdCO2FBQUEsNEJBQUc7QUFDakIsZUFBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUM7T0FDcEM7O0FBRUQsZ0JBQVk7YUFBQSx3QkFBRztBQUNiLGVBQU87QUFDTCxvQkFBVSxFQUFFLFdBQVc7QUFDdkIsbUJBQVMsRUFBRSxTQUFTO0FBQ3BCLHFCQUFXLEVBQUUsSUFBSTtTQUNsQixDQUFDO09BQ0g7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFO0FBQ3ZCLFlBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUFFLGlCQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FBRTtBQUN0QyxZQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQTs7QUFFbkQsWUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDM0QsWUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOzs7QUFHdkMsWUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRTtBQUMzQixjQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMxRCxjQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJ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QUMsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2pELGNBQU0sRUFBRSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUM7QUFDckQsY0FBTSxFQUFFLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsQ0FBQzs7QUFFckQsY0FBTSxLQUFLLFFBQU0sQ0FBQyxTQUFJLEVBQUUsQUFBRSxDQUFDO0FBQzNCLGNBQU0sR0FBRyxRQUFNLENBQUMsU0FBSSxFQUFFLEFBQUUsQ0FBQzs7QUFFekIsMkJBQWlCLEdBQUcsaUJBQWlCLEtBQUssRUFBRSxHQUFHLEtBQUssUUFBTSxpQkFBaUIsU0FBSSxLQUFLLEFBQUUsQ0FBQztBQUN2Rix5QkFBZSxHQUFHLGVBQWUsS0FBSyxFQUFFLEdBQUcsR0FBRyxRQUFNLEdBQUcsU0FBSSxlQUFlLEFBQUUsQ0FBQztTQUM5RTs7QUFFRCxZQUFJLFlBQVksU0FBTyxpQkFBaUIsU0FBSSxlQUFlLE1BQUcsQ0FBQztBQUMvRCxlQUFPLFlBQVksQ0FBQztPQUNyQjs7OztTQW5GRyxXQUFXO0dBQVMsU0FBUzs7QUFzRm5DLE1BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDIiwiZmlsZSI6ImVzNi9zaGFwZXMvdHJhY2UtY29tbW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQmFzZVNoYXBlID0gcmVxdWlyZSgnLi9iYXNlLXNoYXBlJyk7XG5cbmNsYXNzIFRyYWNlQ29tbW9uIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyB4OiAwLCBtZWFuOiAwLCByYW5nZTogMCB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICByYW5nZUNvbG9yOiAnc3RlZWxibHVlJyxcbiAgICAgIG1lYW5Db2xvcjogJyMyMzIzMjMnLFxuICAgICAgZGlzcGxheU1lYW46IHRydWVcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy5zaGFwZSkgeyByZXR1cm4gdGhpcy5zaGFwZTsgfVxuICAgIHRoaXMuc2hhcGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKVxuICAgIC8vIHJhbmdlIHBhdGhcbiAgICB0aGlzLnJhbmdlWm9uZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncGF0aCcpO1xuICAgIHRoaXMuc2hhcGUuYXBwZW5kQ2hpbGQodGhpcy5yYW5nZVpvbmUpO1xuXG4gICAgLy8gbWVhbiBsaW5lXG4gICAgaWYgKHRoaXMucGFyYW1zLmRpc3BsYXlNZWFuKSB7XG4gICAgICB0aGlzLm1lYW5MaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgICB0aGlzLnNoYXBlLmFwcGVuZENoaWxkKHRoaXMubWVhbkxpbmUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNoYXBlO1xuICB9XG5cbiAgLy8gQFRPRE8gdXNlIGFjY2Vzc29yc1xuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZ3JvdXAsIGRhdGEpIHtcbiAgICAvLyBvcmRlciBkYXRhIGJ5IHggcG9zaXRpb25cbiAgICBkYXRhID0gZGF0YS5zbGljZSgwKTtcbiAgICBkYXRhLnNvcnQoKGEsIGIpID0+IHRoaXMueChhKSA8IHRoaXMueChiKSA/IC0xIDogMSk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZGlzcGxheU1lYW4pIHtcbiAgICAgIHRoaXMubWVhbkxpbmUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCB0aGlzLl9idWlsZE1lYW5MaW5lKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpKTtcbiAgICAgIHRoaXMubWVhbkxpbmUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLm1lYW5Db2xvcik7XG4gICAgICB0aGlzLm1lYW5MaW5lLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcbiAgICB9XG5cbiAgICB0aGlzLnJhbmdlWm9uZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIHRoaXMuX2J1aWxkUmFuZ2Vab25lKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpKTtcbiAgICB0aGlzLnJhbmdlWm9uZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgJ25vbmUnKTtcbiAgICB0aGlzLnJhbmdlWm9uZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsIHRoaXMucGFyYW1zLnJhbmdlQ29sb3IpO1xuICAgIHRoaXMucmFuZ2Vab25lLnNldEF0dHJpYnV0ZU5TKG51bGwsICdvcGFjaXR5JywgJzAuNCcpO1xuXG4gICAgZGF0YSA9IG51bGw7XG4gIH1cblxuICBfYnVpbGRNZWFuTGluZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7XG4gICAgbGV0IGluc3RydWN0aW9ucyA9IGRhdGEubWFwKChkYXR1bSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZSh0aGlzLngoZGF0dW0pKTtcbiAgICAgIGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnlTY2FsZSh0aGlzLm1lYW4oZGF0dW0pKTtcbiAgICAgIHJldHVybiBgJHt4fSwke3l9YDtcbiAgICB9KTtcblxuICAgIHJldHVybiAnTScgKyBpbnN0cnVjdGlvbnMuam9pbignTCcpO1xuICB9XG5cbiAgX2J1aWxkUmFuZ2Vab25lKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpIHtcbiAgICBjb25zdCBsZW5ndGggPSBkYXRhLmxlbmd0aDtcbiAgICAvLyBjb25zdCBsYXN0SW5kZXggPSBkYXRhXG4gICAgbGV0IGluc3RydWN0aW9uc1N0YXJ0ID0gJyc7XG4gICAgbGV0IGluc3RydWN0aW9uc0VuZCA9ICcnO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZGF0dW0gPSBkYXRhW2ldO1xuICAgICAgY29uc3QgbWVhbiA9IHRoaXMubWVhbihkYXR1bSk7XG4gICAgICBjb25zdCBoYWxmUmFuZ2UgPSB0aGlzLnJhbmdlKGRhdHVtKSAvIDI7XG5cbiAgICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZSh0aGlzLngoZGF0dW0pKTtcbiAgICAgIGNvbnN0IHkwID0gcmVuZGVyaW5nQ29udGV4dC55U2NhbGUobWVhbiArIGhhbGZSYW5nZSk7XG4gICAgICBjb25zdCB5MSA9IHJlbmRlcmluZ0NvbnRleHQueVNjYWxlKG1lYW4gLSBoYWxmUmFuZ2UpO1xuXG4gICAgICBjb25zdCBzdGFydCA9IGAke3h9LCR7eTB9YDtcbiAgICAgIGNvbnN0IGVuZCA9IGAke3h9LCR7eTF9YDtcblxuICAgICAgaW5zdHJ1Y3Rpb25zU3RhcnQgPSBpbnN0cnVjdGlvbnNTdGFydCA9PT0gJycgPyBzdGFydCA6IGAke2luc3RydWN0aW9uc1N0YXJ0fUwke3N0YXJ0fWA7XG4gICAgICBpbnN0cnVjdGlvbnNFbmQgPSBpbnN0cnVjdGlvbnNFbmQgPT09ICcnID8gZW5kIDogYCR7ZW5kfUwke2luc3RydWN0aW9uc0VuZH1gO1xuICAgIH1cblxuICAgIGxldCBpbnN0cnVjdGlvbnMgPSBgTSR7aW5zdHJ1Y3Rpb25zU3RhcnR9TCR7aW5zdHJ1Y3Rpb25zRW5kfVpgO1xuICAgIHJldHVybiBpbnN0cnVjdGlvbnM7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjZUNvbW1vbjtcbiJdfQ==