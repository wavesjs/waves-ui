"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseShape = _interopRequire(require("./base-shape"));

var TraceCommon = (function (_BaseShape) {
  function TraceCommon() {
    _classCallCheck(this, TraceCommon);

    if (_BaseShape != null) {
      _BaseShape.apply(this, arguments);
    }
  }

  _inherits(TraceCommon, _BaseShape);

  _createClass(TraceCommon, {
    getClassName: {
      value: function getClassName() {
        return "trace-common";
      }
    },
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
        if (this.$el) {
          return this.$el;
        }
        this.$el = document.createElementNS(this.ns, "g");
        // range path
        this.$range = document.createElementNS(this.ns, "path");
        this.$el.appendChild(this.$range);

        // mean line
        if (this.params.displayMean) {
          this.$mean = document.createElementNS(this.ns, "path");
          this.$el.appendChild(this.$mean);
        }

        return this.$el;
      }
    },
    update: {
      value: function update(renderingContext, data) {
        var _this = this;

        // order data by x position
        data = data.slice(0);
        data.sort(function (a, b) {
          return _this.x(a) < _this.x(b) ? -1 : 1;
        });

        if (this.params.displayMean) {
          this.$mean.setAttributeNS(null, "d", this._buildMeanLine(renderingContext, data));
          this.$mean.setAttributeNS(null, "stroke", this.params.meanColor);
          this.$mean.setAttributeNS(null, "fill", "none");
        }

        this.$range.setAttributeNS(null, "d", this._buildRangeZone(renderingContext, data));
        this.$range.setAttributeNS(null, "stroke", "none");
        this.$range.setAttributeNS(null, "fill", this.params.rangeColor);
        this.$range.setAttributeNS(null, "opacity", "0.4");

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvdHJhY2UtY29tbW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTyxTQUFTLDJCQUFNLGNBQWM7O0lBR2YsV0FBVztXQUFYLFdBQVc7MEJBQVgsV0FBVzs7Ozs7OztZQUFYLFdBQVc7O2VBQVgsV0FBVztBQUM5QixnQkFBWTthQUFBLHdCQUFHO0FBQUUsZUFBTyxjQUFjLENBQUM7T0FBRTs7QUFFekMsb0JBQWdCO2FBQUEsNEJBQUc7QUFDakIsZUFBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUM7T0FDcEM7O0FBRUQsZ0JBQVk7YUFBQSx3QkFBRztBQUNiLGVBQU87QUFDTCxvQkFBVSxFQUFFLFdBQVc7QUFDdkIsbUJBQVMsRUFBRSxTQUFTO0FBQ3BCLHFCQUFXLEVBQUUsSUFBSTtTQUNsQixDQUFDO09BQ0g7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFO0FBQ3ZCLFlBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUFFLGlCQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7U0FBRTtBQUNsQyxZQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFbEQsWUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDeEQsWUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs7QUFHbEMsWUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRTtBQUMzQixjQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN2RCxjQUFJ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O0FBRXhDLGNBQU0sQ0FBQyxHQUFJLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDbEQsY0FBTSxFQUFFLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsQ0FBQztBQUNyRCxjQUFNLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFDOztBQUVyRCxjQUFNLEtBQUssUUFBTSxDQUFDLFNBQUksRUFBRSxBQUFFLENBQUM7QUFDM0IsY0FBTSxHQUFHLFFBQVEsQ0FBQyxTQUFJLEVBQUUsQUFBRSxDQUFDOztBQUUzQiwyQkFBaUIsR0FBRyxpQkFBaUIsS0FBSyxFQUFFLEdBQzFDLEtBQUssUUFBTSxpQkFBaUIsU0FBSSxLQUFLLEFBQUUsQ0FBQzs7QUFFMUMseUJBQWUsR0FBRyxlQUFlLEtBQUssRUFBRSxHQUN0QyxHQUFHLFFBQU0sR0FBRyxTQUFJLGVBQWUsQUFBRSxDQUFDO1NBQ3JDOztBQUVELFlBQUksWUFBWSxTQUFPLGlCQUFpQixTQUFJLGVBQWUsTUFBRyxDQUFDO0FBQy9ELGVBQU8sWUFBWSxDQUFDO09BQ3JCOzs7O1NBdkZrQixXQUFXO0dBQVMsU0FBUzs7aUJBQTdCLFdBQVciLCJmaWxlIjoiZXM2L3NoYXBlcy90cmFjZS1jb21tb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vYmFzZS1zaGFwZSc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2VDb21tb24gZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAndHJhY2UtY29tbW9uJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgeDogMCwgbWVhbjogMCwgcmFuZ2U6IDAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmFuZ2VDb2xvcjogJ3N0ZWVsYmx1ZScsXG4gICAgICBtZWFuQ29sb3I6ICcjMjMyMzIzJyxcbiAgICAgIGRpc3BsYXlNZWFuOiB0cnVlXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdnJyk7XG4gICAgLy8gcmFuZ2UgcGF0aFxuICAgIHRoaXMuJHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kcmFuZ2UpO1xuXG4gICAgLy8gbWVhbiBsaW5lXG4gICAgaWYgKHRoaXMucGFyYW1zLmRpc3BsYXlNZWFuKSB7XG4gICAgICB0aGlzLiRtZWFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRtZWFuKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIC8vIG9yZGVyIGRhdGEgYnkgeCBwb3NpdGlvblxuICAgIGRhdGEgPSBkYXRhLnNsaWNlKDApO1xuICAgIGRhdGEuc29ydCgoYSwgYikgPT4gdGhpcy54KGEpIDwgdGhpcy54KGIpID8gLTEgOiAxKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5kaXNwbGF5TWVhbikge1xuICAgICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnZCcsIHRoaXMuX2J1aWxkTWVhbkxpbmUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkpO1xuICAgICAgdGhpcy4kbWVhbi5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc3Ryb2tlJywgdGhpcy5wYXJhbXMubWVhbkNvbG9yKTtcbiAgICAgIHRoaXMuJG1lYW4uc2V0QXR0cmlidXRlTlMobnVsbCwgJ2ZpbGwnLCAnbm9uZScpO1xuICAgIH1cblxuICAgIHRoaXMuJHJhbmdlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgdGhpcy5fYnVpbGRSYW5nZVpvbmUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkpO1xuICAgIHRoaXMuJHJhbmdlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHJva2UnLCAnbm9uZScpO1xuICAgIHRoaXMuJHJhbmdlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdmaWxsJywgdGhpcy5wYXJhbXMucmFuZ2VDb2xvcik7XG4gICAgdGhpcy4kcmFuZ2Uuc2V0QXR0cmlidXRlTlMobnVsbCwgJ29wYWNpdHknLCAnMC40Jyk7XG5cbiAgICBkYXRhID0gbnVsbDtcbiAgfVxuXG4gIF9idWlsZE1lYW5MaW5lKHJlbmRlcmluZ0NvbnRleHQsIGRhdGEpIHtcbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gZGF0YS5tYXAoKGRhdHVtLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQueFNjYWxlKHRoaXMueChkYXR1bSkpO1xuICAgICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQueVNjYWxlKHRoaXMubWVhbihkYXR1bSkpO1xuICAgICAgcmV0dXJuIGAke3h9LCR7eX1gO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuICdNJyArIGluc3RydWN0aW9ucy5qb2luKCdMJyk7XG4gIH1cblxuICBfYnVpbGRSYW5nZVpvbmUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIGNvbnN0IGxlbmd0aCA9IGRhdGEubGVuZ3RoO1xuICAgIC8vIGNvbnN0IGxhc3RJbmRleCA9IGRhdGFcbiAgICBsZXQgaW5zdHJ1Y3Rpb25zU3RhcnQgPSAnJztcbiAgICBsZXQgaW5zdHJ1Y3Rpb25zRW5kID0gJyc7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBkYXR1bSA9IGRhdGFbaV07XG4gICAgICBjb25zdCBtZWFuID0gdGhpcy5tZWFuKGRhdHVtKTtcbiAgICAgIGNvbnN0IGhhbGZSYW5nZSA9IHRoaXMucmFuZ2UoZGF0dW0pIC8gMjtcblxuICAgICAgY29uc3QgeCAgPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZSh0aGlzLngoZGF0dW0pKTtcbiAgICAgIGNvbnN0IHkwID0gcmVuZGVyaW5nQ29udGV4dC55U2NhbGUobWVhbiArIGhhbGZSYW5nZSk7XG4gICAgICBjb25zdCB5MSA9IHJlbmRlcmluZ0NvbnRleHQueVNjYWxlKG1lYW4gLSBoYWxmUmFuZ2UpO1xuXG4gICAgICBjb25zdCBzdGFydCA9IGAke3h9LCR7eTB9YDtcbiAgICAgIGNvbnN0IGVuZCAgID0gYCR7eH0sJHt5MX1gO1xuXG4gICAgICBpbnN0cnVjdGlvbnNTdGFydCA9IGluc3RydWN0aW9uc1N0YXJ0ID09PSAnJyA/XG4gICAgICAgIHN0YXJ0IDogYCR7aW5zdHJ1Y3Rpb25zU3RhcnR9TCR7c3RhcnR9YDtcblxuICAgICAgaW5zdHJ1Y3Rpb25zRW5kID0gaW5zdHJ1Y3Rpb25zRW5kID09PSAnJyA/XG4gICAgICAgIGVuZCA6IGAke2VuZH1MJHtpbnN0cnVjdGlvbnNFbmR9YDtcbiAgICB9XG5cbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gYE0ke2luc3RydWN0aW9uc1N0YXJ0fUwke2luc3RydWN0aW9uc0VuZH1aYDtcbiAgICByZXR1cm4gaW5zdHJ1Y3Rpb25zO1xuICB9XG59XG4iXX0=