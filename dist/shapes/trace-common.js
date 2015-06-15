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
        // order data by x position
        data = data.slice(0);
        data.sort(function (a, b) {
          return a.x < b.x ? -1 : 1;
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
        var instructions = data.map(function (datum, index) {
          var x = renderingContext.xScale(datum.x);
          var y = renderingContext.yScale(datum.mean);
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
          var halfRange = datum.range / 2;
          var x = renderingContext.xScale(datum.x);
          var y0 = renderingContext.yScale(datum.mean + halfRange);
          var y1 = renderingContext.yScale(datum.mean - halfRange);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvdHJhY2UtY29tbW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztJQUVwQyxXQUFXO1dBQVgsV0FBVzswQkFBWCxXQUFXOzs7Ozs7O1lBQVgsV0FBVzs7ZUFBWCxXQUFXO0FBQ2YsZ0JBQVk7YUFBQSx3QkFBRztBQUNiLGVBQU87QUFDTCxvQkFBVSxFQUFFLFdBQVc7QUFDdkIsbUJBQVMsRUFBRSxTQUFTO0FBQ3BCLHFCQUFXLEVBQUUsSUFBSTtTQUNsQixDQUFDO09BQ0g7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFO0FBQ3ZCLFlBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUFFLGlCQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FBRTtBQUN0QyxZQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQTs7QUFFbkQsWUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDM0QsWUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOzs7QUFHdkMsWUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRTtBQUMzQixjQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMxRCxjQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDdkM7O0FBRUQsZUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO09BQ25COztBQUdELFVBQU07Ozs7YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVB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LFFBQU0sQ0FBQyxTQUFJLEVBQUUsQUFBRSxDQUFDO0FBQzNCLGNBQU0sR0FBRyxRQUFNLENBQUMsU0FBSSxFQUFFLEFBQUUsQ0FBQzs7QUFFekIsMkJBQWlCLEdBQUcsaUJBQWlCLEtBQUssRUFBRSxHQUFHLEtBQUssUUFBTSxpQkFBaUIsU0FBSSxLQUFLLEFBQUUsQ0FBQztBQUN2Rix5QkFBZSxHQUFHLGVBQWUsS0FBSyxFQUFFLEdBQUcsR0FBRyxRQUFNLEdBQUcsU0FBSSxlQUFlLEFBQUUsQ0FBQztTQUM5RTs7QUFFRCxZQUFJLFlBQVksU0FBTyxpQkFBaUIsU0FBSSxlQUFlLE1BQUcsQ0FBQztBQUMvRCxlQUFPLFlBQVksQ0FBQztPQUNyQjs7OztTQTdFRyxXQUFXO0dBQVMsU0FBUzs7QUFnRm5DLE1BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDIiwiZmlsZSI6ImVzNi9zaGFwZXMvdHJhY2UtY29tbW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQmFzZVNoYXBlID0gcmVxdWlyZSgnLi9iYXNlLXNoYXBlJyk7XG5cbmNsYXNzIFRyYWNlQ29tbW9uIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICByYW5nZUNvbG9yOiAnc3RlZWxibHVlJyxcbiAgICAgIG1lYW5Db2xvcjogJyMyMzIzMjMnLFxuICAgICAgZGlzcGxheU1lYW46IHRydWVcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy5zaGFwZSkgeyByZXR1cm4gdGhpcy5zaGFwZTsgfVxuICAgIHRoaXMuc2hhcGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2cnKVxuICAgIC8vIHJhbmdlIHBhdGhcbiAgICB0aGlzLnJhbmdlWm9uZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncGF0aCcpO1xuICAgIHRoaXMuc2hhcGUuYXBwZW5kQ2hpbGQodGhpcy5yYW5nZVpvbmUpO1xuXG4gICAgLy8gbWVhbiBsaW5lXG4gICAgaWYgKHRoaXMucGFyYW1zLmRpc3BsYXlNZWFuKSB7XG4gICAgICB0aGlzLm1lYW5MaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgICB0aGlzLnNoYXBlLmFwcGVuZENoaWxkKHRoaXMubWVhbkxpbmUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNoYXBlO1xuICB9XG5cbiAgLy8gQFRPRE8gdXNlIGFjY2Vzc29yc1xuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZ3JvdXAsIGRhdGEpIHtcbiAgICAvLyBvcmRlciBkYXRhIGJ5IHggcG9zaXRpb25cbiAgICBkYXRhID0gZGF0YS5zbGljZSgwKTtcbiAgICBkYXRhLnNvcnQoKGEsIGIpID0+IGEueCA8IGIueCA/IC0xIDogMSk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZGlzcGxheU1lYW4pIHtcbiAgICAgIHRoaXMubWVhbkxpbmUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCB0aGlzLl9idWlsZE1lYW5MaW5lKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpKTtcbiAgICAgIHRoaXMubWVhbkxpbmUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3N0cm9rZScsIHRoaXMucGFyYW1zLm1lYW5Db2xvcik7XG4gICAgICB0aGlzLm1lYW5MaW5lLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgJ25vbmUnKTtcbiAgICB9XG5cbiAgICB0aGlzLnJhbmdlWm9uZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIHRoaXMuX2J1aWxkUmFuZ2Vab25lKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpKTtcbiAgICB0aGlzLnJhbmdlWm9uZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgJ25vbmUnKTtcbiAgICB0aGlzLnJhbmdlWm9uZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZmlsbCcsIHRoaXMucGFyYW1zLnJhbmdlQ29sb3IpO1xuICAgIHRoaXMucmFuZ2Vab25lLnNldEF0dHJpYnV0ZU5TKG51bGwsICdvcGFjaXR5JywgJzAuNCcpO1xuXG4gICAgZGF0YSA9IG51bGw7XG4gIH1cblxuICBfYnVpbGRNZWFuTGluZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7XG4gICAgbGV0IGluc3RydWN0aW9ucyA9IGRhdGEubWFwKChkYXR1bSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZShkYXR1bS54KTtcbiAgICAgIGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnlTY2FsZShkYXR1bS5tZWFuKTtcbiAgICAgIHJldHVybiBgJHt4fSwke3l9YDtcbiAgICB9KTtcblxuICAgIHJldHVybiAnTScgKyBpbnN0cnVjdGlvbnMuam9pbignTCcpO1xuICB9XG5cbiAgX2J1aWxkUmFuZ2Vab25lKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpIHtcbiAgICBjb25zdCBsZW5ndGggPSBkYXRhLmxlbmd0aDtcbiAgICAvLyBjb25zdCBsYXN0SW5kZXggPSBkYXRhXG4gICAgbGV0IGluc3RydWN0aW9uc1N0YXJ0ID0gJyc7XG4gICAgbGV0IGluc3RydWN0aW9uc0VuZCA9ICcnO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZGF0dW0gPSBkYXRhW2ldO1xuICAgICAgY29uc3QgaGFsZlJhbmdlID0gZGF0dW0ucmFuZ2UgLyAyO1xuICAgICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQueFNjYWxlKGRhdHVtLngpO1xuICAgICAgY29uc3QgeTAgPSByZW5kZXJpbmdDb250ZXh0LnlTY2FsZShkYXR1bS5tZWFuICsgaGFsZlJhbmdlKTtcbiAgICAgIGNvbnN0IHkxID0gcmVuZGVyaW5nQ29udGV4dC55U2NhbGUoZGF0dW0ubWVhbiAtIGhhbGZSYW5nZSk7XG5cbiAgICAgIGNvbnN0IHN0YXJ0ID0gYCR7eH0sJHt5MH1gO1xuICAgICAgY29uc3QgZW5kID0gYCR7eH0sJHt5MX1gO1xuXG4gICAgICBpbnN0cnVjdGlvbnNTdGFydCA9IGluc3RydWN0aW9uc1N0YXJ0ID09PSAnJyA/IHN0YXJ0IDogYCR7aW5zdHJ1Y3Rpb25zU3RhcnR9TCR7c3RhcnR9YDtcbiAgICAgIGluc3RydWN0aW9uc0VuZCA9IGluc3RydWN0aW9uc0VuZCA9PT0gJycgPyBlbmQgOiBgJHtlbmR9TCR7aW5zdHJ1Y3Rpb25zRW5kfWA7XG4gICAgfVxuXG4gICAgbGV0IGluc3RydWN0aW9ucyA9IGBNJHtpbnN0cnVjdGlvbnNTdGFydH1MJHtpbnN0cnVjdGlvbnNFbmR9WmA7XG4gICAgcmV0dXJuIGluc3RydWN0aW9ucztcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNlQ29tbW9uO1xuIl19