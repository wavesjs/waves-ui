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
        return this.shape;
      }
    },
    update: {
      value: function update(context, group, datum, index) {
        var cx = context.xScale(this.cx(datum));
        var cy = context.yScale(this.cy(datum));
        var r = this.r(datum);
        var color = this.color(datum);

        group.setAttributeNS(null, "transform", "translate(" + cx + ", " + cy + ")");
        this.shape.setAttributeNS(null, "r", r);
        this.shape.style.fill = color;
      }
    },
    inArea: {

      // x1, x2, y1, y2 => in pixel domain

      value: function inArea(context, datum, x1, y1, x2, y2) {
        var cx = context.xScale(this.cx(datum));
        var cy = context.yScale(this.cy(datum));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvZG90LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztJQUVwQyxHQUFHO1dBQUgsR0FBRzswQkFBSCxHQUFHOzs7Ozs7O1lBQUgsR0FBRzs7ZUFBSCxHQUFHO0FBQ1AsZ0JBQVk7YUFBQSx3QkFBRztBQUFFLGVBQU8sS0FBSyxDQUFDO09BQUU7O0FBRWhDLFVBQU07YUFBQSxrQkFBRztBQUNQLFlBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUFFLGlCQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FBRTs7QUFFdEMsWUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDekQsZUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO09BQ25COztBQUVELFVBQU07YUFBQSxnQkFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDbkMsWUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDMUMsWUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDMUMsWUFBTSxDQUFDLEdBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QixZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVoQyxhQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLGlCQUFlLEVBQUUsVUFBSyxFQUFFLE9BQUksQ0FBQztBQUNuRSxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLFlBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7T0FDL0I7O0FBR0QsVUFBTTs7OzthQUFBLGdCQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ3JDLFlBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQzFDLFlBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUUxQyxZQUFJLEFBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQSxBQUFDLEVBQUU7QUFDaEQsaUJBQU8sSUFBSSxDQUFDO1NBQ2I7O0FBRUQsZUFBTyxLQUFLLENBQUM7T0FDZDs7QUFHRCxvQkFBZ0I7Ozs7YUFBQSw0QkFBRztBQUNqQixlQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDO09BQ2pEOzs7O1NBcENHLEdBQUc7R0FBUyxTQUFTOztBQXFDMUIsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyIsImZpbGUiOiJlczYvc2hhcGVzL2RvdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEJhc2VTaGFwZSA9IHJlcXVpcmUoJy4vYmFzZS1zaGFwZScpO1xuXG5jbGFzcyBEb3QgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnZG90JzsgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5zaGFwZSkgeyByZXR1cm4gdGhpcy5zaGFwZTsgfVxuXG4gICAgdGhpcy5zaGFwZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAnY2lyY2xlJyk7XG4gICAgcmV0dXJuIHRoaXMuc2hhcGU7XG4gIH1cblxuICB1cGRhdGUoY29udGV4dCwgZ3JvdXAsIGRhdHVtLCBpbmRleCkge1xuICAgIGNvbnN0IGN4ID0gY29udGV4dC54U2NhbGUodGhpcy5jeChkYXR1bSkpO1xuICAgIGNvbnN0IGN5ID0gY29udGV4dC55U2NhbGUodGhpcy5jeShkYXR1bSkpO1xuICAgIGNvbnN0IHIgID0gdGhpcy5yKGRhdHVtKTtcbiAgICBjb25zdCBjb2xvciA9IHRoaXMuY29sb3IoZGF0dW0pO1xuXG4gICAgZ3JvdXAuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHtjeH0sICR7Y3l9KWApO1xuICAgIHRoaXMuc2hhcGUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3InLCByKTtcbiAgICB0aGlzLnNoYXBlLnN0eWxlLmZpbGwgPSBjb2xvcjtcbiAgfVxuXG4gIC8vIHgxLCB4MiwgeTEsIHkyID0+IGluIHBpeGVsIGRvbWFpblxuICBpbkFyZWEoY29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgY29uc3QgY3ggPSBjb250ZXh0LnhTY2FsZSh0aGlzLmN4KGRhdHVtKSk7XG4gICAgY29uc3QgY3kgPSBjb250ZXh0LnlTY2FsZSh0aGlzLmN5KGRhdHVtKSk7XG5cbiAgICBpZiAoKGN4ID4geDEgJiYgY3ggPCB4MikgJiYgKGN5ID4geTEgJiYgY3kgPCB5MikpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIEBUT0RPIHJlbmFtZSA6IGNvbmZ1c2lvbiBiZXR3ZWVuIGFjY2Vzc29ycyBhbmQgbWV0YS1hY2Nlc3NvcnNcbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyBjeDogMCwgY3k6IDAsIHI6IDMsIGNvbG9yOiAnIzAwMDAwMCfCoH07XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRG90O1xuXG4iXX0=