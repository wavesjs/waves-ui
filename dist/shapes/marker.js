"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseShape = _interopRequire(require("./base-shape"));

var Marker = (function (_BaseShape) {
  function Marker() {
    _classCallCheck(this, Marker);

    if (_BaseShape != null) {
      _BaseShape.apply(this, arguments);
    }
  }

  _inherits(Marker, _BaseShape);

  _createClass(Marker, {
    getClassName: {
      value: function getClassName() {
        return "marker";
      }
    },
    _getAccessorList: {
      value: function _getAccessorList() {
        return { x: 0, color: "#000000" };
      }
    },
    _getDefaults: {
      value: function _getDefaults() {
        return {
          handlerWidth: 7,
          handlerHeight: 10,
          displayHandler: true,
          opacity: 1
        };
      }
    },
    render: {
      value: function render(renderingContext) {
        if (this.$el) {
          return this.$el;
        }

        var height = renderingContext.height;

        this.$el = document.createElementNS(this.ns, "g");
        this.$line = document.createElementNS(this.ns, "rect");

        // draw line
        this.$line.setAttributeNS(null, "x", 0);
        this.$line.setAttributeNS(null, "y", 0);
        this.$line.setAttributeNS(null, "width", 1);
        this.$line.setAttributeNS(null, "height", height);
        this.$line.setAttributeNS(null, "shape-rendering", "optimizeSpeed");

        this.$el.appendChild(this.$line);

        if (this.params.displayHandlers) {
          this.$handler = document.createElementNS(this.ns, "rect");

          this.$handler.setAttributeNS(null, "x", -((this.params.handlerWidth - 1) / 2));
          this.$handler.setAttributeNS(null, "y", renderingContext.height - this.params.handlerHeight);
          this.$handler.setAttributeNS(null, "width", this.params.handlerWidth);
          this.$handler.setAttributeNS(null, "height", this.params.handlerHeight);
          this.$handler.setAttributeNS(null, "shape-rendering", "crispEdges");

          this.$el.appendChild(this.$handler);
        }

        this.$el.style.opacity = this.params.opacity;

        return this.$el;
      }
    },
    update: {
      value: function update(renderingContext, datum, index) {
        var x = renderingContext.timeToPixel(this.x(datum)) - 0.5;
        var color = this.color(datum);

        this.$el.setAttributeNS(null, "transform", "translate(" + x + ", 0)");
        this.$line.style.fill = color;

        if (this.params.displayHandlers) {
          this.$handler.style.fill = color;
        }
      }
    },
    inArea: {
      value: function inArea(renderingContext, datum, x1, y1, x2, y2) {
        // handlers only are selectable
        var x = renderingContext.timeToPixel(this.x(datum));
        var shapeX1 = x - (this.params.handlerWidth - 1) / 2;
        var shapeX2 = shapeX1 + this.params.handlerWidth;
        var shapeY1 = renderingContext.height - this.params.handlerHeight;
        var shapeY2 = renderingContext.height;

        var xOverlap = Math.max(0, Math.min(x2, shapeX2) - Math.max(x1, shapeX1));
        var yOverlap = Math.max(0, Math.min(y2, shapeY2) - Math.max(y1, shapeY1));
        var area = xOverlap * yOverlap;

        return area > 0;
      }
    }
  });

  return Marker;
})(BaseShape);

module.exports = Marker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFPLFNBQVMsMkJBQU0sY0FBYzs7SUFHZixNQUFNO1dBQU4sTUFBTTswQkFBTixNQUFNOzs7Ozs7O1lBQU4sTUFBTTs7ZUFBTixNQUFNO0FBQ3pCLGdCQUFZO2FBQUEsd0JBQUc7QUFBRSxlQUFPLFFBQVEsQ0FBQztPQUFFOztBQUVuQyxvQkFBZ0I7YUFBQSw0QkFBRztBQUNqQixlQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUM7T0FDbkM7O0FBRUQsZ0JBQVk7YUFBQSx3QkFBRztBQUNiLGVBQU87QUFDTCxzQkFBWSxFQUFFLENBQUM7QUFDZix1QkFBYSxFQUFFLEVBQUU7QUFDakIsd0JBQWMsRUFBRSxJQUFJO0FBQ3BCLGlCQUFPLEVBQUUsQ0FBQztTQUNYLENBQUM7T0FDSDs7QUFFRCxVQUFNO2FBQUEsZ0JBQUMsZ0JBQWdCLEVBQUU7QUFDdkIsWUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQUUsaUJBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUFFOztBQUVsQyxZQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7O0FBRXZDLFlBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2xELFlBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDOzs7QUFHdkQsWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4QyxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hD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QUcsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO0FBQ25ELFlBQU0sT0FBTyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQztBQUNwRSxZQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7O0FBRXhDLFlBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDNUUsWUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUM1RSxZQUFNLElBQUksR0FBRyxRQUFRLEdBQUcsUUFBUSxDQUFDOztBQUVqQyxlQUFPLElBQUksR0FBRyxDQUFDLENBQUM7T0FDakI7Ozs7U0EzRWtCLE1BQU07R0FBUyxTQUFTOztpQkFBeEIsTUFBTSIsImZpbGUiOiJlczYvdXRpbHMvb3J0aG9nb25hbC1kYXRhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL2Jhc2Utc2hhcGUnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcmtlciBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdtYXJrZXInOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyB4OiAwLCBjb2xvcjogJyMwMDAwMDAnIH07XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhhbmRsZXJXaWR0aDogNyxcbiAgICAgIGhhbmRsZXJIZWlnaHQ6IDEwLFxuICAgICAgZGlzcGxheUhhbmRsZXI6IHRydWUsXG4gICAgICBvcGFjaXR5OiAxXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuJGVsKSB7IHJldHVybiB0aGlzLiRlbDsgfVxuXG4gICAgY29uc3QgaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnZycpO1xuICAgIHRoaXMuJGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3JlY3QnKTtcblxuICAgIC8vIGRyYXcgbGluZVxuICAgIHRoaXMuJGxpbmUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCAwKTtcbiAgICB0aGlzLiRsaW5lLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgMCk7XG4gICAgdGhpcy4kbGluZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCAxKTtcbiAgICB0aGlzLiRsaW5lLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgIHRoaXMuJGxpbmUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdvcHRpbWl6ZVNwZWVkJyk7XG5cbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZCh0aGlzLiRsaW5lKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5kaXNwbGF5SGFuZGxlcnMpIHtcbiAgICAgIHRoaXMuJGhhbmRsZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ3JlY3QnKTtcblxuICAgICAgdGhpcy4kaGFuZGxlci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIC0oKHRoaXMucGFyYW1zLmhhbmRsZXJXaWR0aCAtIDEpIC8gMikpO1xuICAgICAgdGhpcy4kaGFuZGxlci5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneScsIHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0IC0gdGhpcy5wYXJhbXMuaGFuZGxlckhlaWdodCk7XG4gICAgICB0aGlzLiRoYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHRoaXMucGFyYW1zLmhhbmRsZXJXaWR0aCk7XG4gICAgICB0aGlzLiRoYW5kbGVyLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCB0aGlzLnBhcmFtcy5oYW5kbGVySGVpZ2h0KTtcbiAgICAgIHRoaXMuJGhhbmRsZXIuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG5cbiAgICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHRoaXMuJGhhbmRsZXIpO1xuICAgIH1cblxuICAgIHRoaXMuJGVsLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBhcmFtcy5vcGFjaXR5O1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCBpbmRleCkge1xuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHRoaXMueChkYXR1bSkpIC0gMC41O1xuICAgIGNvbnN0IGNvbG9yID0gdGhpcy5jb2xvcihkYXR1bSk7XG5cbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3h9LCAwKWApO1xuICAgIHRoaXMuJGxpbmUuc3R5bGUuZmlsbCA9IGNvbG9yO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmRpc3BsYXlIYW5kbGVycykge1xuICAgICAgdGhpcy4kaGFuZGxlci5zdHlsZS5maWxsID0gY29sb3I7XG4gICAgfVxuICB9XG5cbiAgaW5BcmVhKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mikge1xuICAgIC8vIGhhbmRsZXJzIG9ubHkgYXJlIHNlbGVjdGFibGVcbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLngoZGF0dW0pKTtcbiAgICBjb25zdCBzaGFwZVgxID0geCAtICh0aGlzLnBhcmFtcy5oYW5kbGVyV2lkdGggLSAxKSAvIDI7XG4gICAgY29uc3Qgc2hhcGVYMiA9IHNoYXBlWDEgKyB0aGlzLnBhcmFtcy5oYW5kbGVyV2lkdGg7XG4gICAgY29uc3Qgc2hhcGVZMSA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0IC0gdGhpcy5wYXJhbXMuaGFuZGxlckhlaWdodDtcbiAgICBjb25zdCBzaGFwZVkyID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG5cbiAgICBjb25zdCB4T3ZlcmxhcCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHgyLCBzaGFwZVgyKSAtIE1hdGgubWF4KHgxLCBzaGFwZVgxKSk7XG4gICAgY29uc3QgeU92ZXJsYXAgPSBNYXRoLm1heCgwLCBNYXRoLm1pbih5Miwgc2hhcGVZMikgLSBNYXRoLm1heCh5MSwgc2hhcGVZMSkpO1xuICAgIGNvbnN0IGFyZWEgPSB4T3ZlcmxhcCAqIHlPdmVybGFwO1xuXG4gICAgcmV0dXJuIGFyZWEgPiAwO1xuICB9XG59XG4iXX0=