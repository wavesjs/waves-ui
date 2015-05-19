"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var BaseShape = require("./base-shape");

var Dot = (function (_BaseShape) {
  function Dot() {
    _classCallCheck(this, Dot);

    if (_BaseShape != null) {
      _BaseShape.apply(this, arguments);
    }
  }

  _inherits(Dot, _BaseShape);

  _createClass(Dot, {
    getClassName: {
      value: function getClassName() {
        return "dot";
      }
    },
    render: {
      value: function render() {
        if (this.shape) {
          return this.shape;
        }

        this.shape = document.createElementNS(this.ns, "circle");
        // this.shape.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        return this.shape;
      }
    },
    update: {
      value: function update(renderingContext, group, datum, index) {
        var cx = renderingContext.xScale(this.cx(datum));
        var cy = renderingContext.yScale(this.cy(datum));
        var r = this.r(datum);
        var color = this.color(datum);

        group.setAttributeNS(null, "transform", "translate(" + cx + ", " + cy + ")");
        this.shape.setAttributeNS(null, "r", r);
        this.shape.style.fill = color;
      }
    },
    inArea: {

      // x1, x2, y1, y2 => in pixel domain

      value: function inArea(renderingContext, datum, x1, y1, x2, y2) {
        var cx = renderingContext.xScale(this.cx(datum));
        var cy = renderingContext.yScale(this.cy(datum));

        if (cx > x1 && cx < x2 && (cy > y1 && cy < y2)) {
          return true;
        }

        return false;
      }
    },
    _getAccessorList: {

      // @TODO rename : confusion between accessors and meta-accessors

      value: function _getAccessorList() {
        return { cx: 0, cy: 0, r: 3, color: "#000000" };
      }
    }
  });

  return Dot;
})(BaseShape);

;

module.exports = Dot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztJQUVwQyxHQUFHO1dBQUgsR0FBRzswQkFBSCxHQUFHOzs7Ozs7O1lBQUgsR0FBRzs7ZUFBSCxHQUFHO0FBQ1AsZ0JBQVk7YUFBQSx3QkFBRztBQUFFLGVBQU8sS0FBSyxDQUFDO09BQUU7O0FBRWhDLFVBQU07YUFBQSxrQkFBRztBQUNQLFlBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUFFLGlCQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FBRTs7QUFFdEMsWUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7O0FBRXpELGVBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztPQUNuQjs7QUFFRCxVQUFNO2FBQUEsZ0JBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDNUMsWUFBTSxFQUFFLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNuRCxZQUFNLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ25ELFlBQU0sQ0FBQyxHQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekIsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFaEMsYUFBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxpQkFBZSxFQUFFLFVBQUssRUFBRSxPQUFJLENBQUM7QUFDbkUsWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4QyxZQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO09BQy9COztBQUdELFVBQU07Ozs7YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQzlDLFlBQU0sRUFBRSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDbkQsWUFBTSxFQUFFLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFbkQsWUFBSSxBQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxFQUFFO0FBQ2hELGlCQUFPLElBQUksQ0FBQztTQUNiOztBQUVELGVBQU8sS0FBSyxDQUFDO09BQ2Q7O0FBR0Qsb0JBQWdCOzs7O2FBQUEsNEJBQUc7QUFDakIsZUFBTyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQztPQUNqRDs7OztTQXJDRyxHQUFHO0dBQVMsU0FBUzs7QUFzQzFCLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMiLCJmaWxlIjoiZXM2L3RpbWVsaW5lLXN0YXRlcy9zZWxlY3Rpb24tc3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCYXNlU2hhcGUgPSByZXF1aXJlKCcuL2Jhc2Utc2hhcGUnKTtcblxuY2xhc3MgRG90IGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ2RvdCc7IH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc2hhcGUpIHsgcmV0dXJuIHRoaXMuc2hhcGU7IH1cblxuICAgIHRoaXMuc2hhcGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModGhpcy5ucywgJ2NpcmNsZScpO1xuICAgIC8vIHRoaXMuc2hhcGUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG4gICAgcmV0dXJuIHRoaXMuc2hhcGU7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZ3JvdXAsIGRhdHVtLCBpbmRleCkge1xuICAgIGNvbnN0IGN4ID0gcmVuZGVyaW5nQ29udGV4dC54U2NhbGUodGhpcy5jeChkYXR1bSkpO1xuICAgIGNvbnN0IGN5ID0gcmVuZGVyaW5nQ29udGV4dC55U2NhbGUodGhpcy5jeShkYXR1bSkpO1xuICAgIGNvbnN0IHIgID0gdGhpcy5yKGRhdHVtKTtcbiAgICBjb25zdCBjb2xvciA9IHRoaXMuY29sb3IoZGF0dW0pO1xuXG4gICAgZ3JvdXAuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHtjeH0sICR7Y3l9KWApO1xuICAgIHRoaXMuc2hhcGUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3InLCByKTtcbiAgICB0aGlzLnNoYXBlLnN0eWxlLmZpbGwgPSBjb2xvcjtcbiAgfVxuXG4gIC8vIHgxLCB4MiwgeTEsIHkyID0+IGluIHBpeGVsIGRvbWFpblxuICBpbkFyZWEocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgY29uc3QgY3ggPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZSh0aGlzLmN4KGRhdHVtKSk7XG4gICAgY29uc3QgY3kgPSByZW5kZXJpbmdDb250ZXh0LnlTY2FsZSh0aGlzLmN5KGRhdHVtKSk7XG5cbiAgICBpZiAoKGN4ID4geDEgJiYgY3ggPCB4MikgJiYgKGN5ID4geTEgJiYgY3kgPCB5MikpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIEBUT0RPIHJlbmFtZSA6IGNvbmZ1c2lvbiBiZXR3ZWVuIGFjY2Vzc29ycyBhbmQgbWV0YS1hY2Nlc3NvcnNcbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyBjeDogMCwgY3k6IDAsIHI6IDMsIGNvbG9yOiAnIzAwMDAwMCfCoH07XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRG90O1xuXG4iXX0=