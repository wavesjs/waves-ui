"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var BaseShape = require("./base-shape");

var Line = (function (_BaseShape) {
  function Line() {
    _classCallCheck(this, Line);

    if (_BaseShape != null) {
      _BaseShape.apply(this, arguments);
    }
  }

  _inherits(Line, _BaseShape);

  _createClass(Line, {
    getClassName: {
      value: function getClassName() {
        return "line";
      }
    },
    render: {
      value: function render() {
        if (this.shape) {
          return this.shape;
        }

        this.shape = document.createElementNS(this.ns, "path");
        // this.shape.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        return this.shape;
      }
    },
    update: {
      value: function update(renderingContext, group, data) {
        var _this = this;

        data = data.slice(0);
        data.sort(function (a, b) {
          return _this.cx(a) < _this.cx(b) ? -1 : 1;
        });

        this.shape.setAttributeNS(null, "d", this._buildLine(renderingContext, data));
        this.shape.style.stroke = this.color(data);
        this.shape.style.fill = "none";

        data = null;
      }
    },
    _buildLine: {

      // builds the `path.d` attribute
      // @TODO create some ShapeHelper ?

      value: function _buildLine(renderingContext, data) {
        var _this = this;

        // sort data
        var instructions = data.map(function (datum, index) {
          var x = renderingContext.xScale(_this.cx(datum));
          var y = renderingContext.yScale(_this.cy(datum));
          return "" + x + "," + y;
        });

        return "M" + instructions.join("L");
      }
    },
    _getAccessorList: {
      value: function _getAccessorList() {
        return { cx: 0, cy: 0, color: "#000000" };
      }
    }
  });

  return Line;
})(BaseShape);

module.exports = Line;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvbGluZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQzs7SUFFcEMsSUFBSTtXQUFKLElBQUk7MEJBQUosSUFBSTs7Ozs7OztZQUFKLElBQUk7O2VBQUosSUFBSTtBQUNSLGdCQUFZO2FBQUEsd0JBQUc7QUFBRSxlQUFPLE1BQU0sQ0FBQztPQUFFOztBQUVqQyxVQUFNO2FBQUEsa0JBQUc7QUFDUCxZQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFBRSxpQkFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQUU7O0FBRXRDLFlBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUV2RCxlQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7T0FDbkI7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7OztBQUNwQyxZQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQixZQUFJLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7aUJBQUssTUFBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQztTQUFBLENBQUMsQ0FBQzs7QUFFdEQsWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDOUUsWUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDM0MsWUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQzs7QUFFL0IsWUFBSSxHQUFHLElBQUksQ0FBQztPQUNiOztBQUlELGNBQVU7Ozs7O2FBQUEsb0JBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFOzs7O0FBRWpDLFlBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFLO0FBQzVDLGNBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2xELGNBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2xELHNCQUFVLENBQUMsU0FBSSxDQUFDLENBQUc7U0FDcEIsQ0FBQyxDQUFDOztBQUVILGVBQU8sR0FBRyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDckM7O0FBRUQsb0JBQWdCO2FBQUEsNEJBQUc7QUFDakIsZUFBTyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUM7T0FDM0M7Ozs7U0FyQ0csSUFBSTtHQUFTLFNBQVM7O0FBd0M1QixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyIsImZpbGUiOiJlczYvc2hhcGVzL2xpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCYXNlU2hhcGUgPSByZXF1aXJlKCcuL2Jhc2Utc2hhcGUnKTtcblxuY2xhc3MgTGluZSBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdsaW5lJzsgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5zaGFwZSkgeyByZXR1cm4gdGhpcy5zaGFwZTsgfVxuXG4gICAgdGhpcy5zaGFwZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncGF0aCcpO1xuICAgIC8vIHRoaXMuc2hhcGUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG4gICAgcmV0dXJuIHRoaXMuc2hhcGU7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZ3JvdXAsIGRhdGEpIHtcbiAgICBkYXRhID0gZGF0YS5zbGljZSgwKTtcbiAgICBkYXRhLnNvcnQoKGEsIGIpID0+IHRoaXMuY3goYSkgPCB0aGlzLmN4KGIpID8gLTEgOiAxKTtcblxuICAgIHRoaXMuc2hhcGUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCB0aGlzLl9idWlsZExpbmUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkpO1xuICAgIHRoaXMuc2hhcGUuc3R5bGUuc3Ryb2tlID0gdGhpcy5jb2xvcihkYXRhKTtcbiAgICB0aGlzLnNoYXBlLnN0eWxlLmZpbGwgPSAnbm9uZSc7XG5cbiAgICBkYXRhID0gbnVsbDtcbiAgfVxuXG4gIC8vIGJ1aWxkcyB0aGUgYHBhdGguZGAgYXR0cmlidXRlXG4gIC8vIEBUT0RPIGNyZWF0ZSBzb21lIFNoYXBlSGVscGVyID9cbiAgX2J1aWxkTGluZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7XG4gICAgLy8gc29ydCBkYXRhXG4gICAgbGV0IGluc3RydWN0aW9ucyA9IGRhdGEubWFwKChkYXR1bSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZSh0aGlzLmN4KGRhdHVtKSk7XG4gICAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC55U2NhbGUodGhpcy5jeShkYXR1bSkpO1xuICAgICAgcmV0dXJuIGAke3h9LCR7eX1gO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuICdNJyArIGluc3RydWN0aW9ucy5qb2luKCdMJyk7XG4gIH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IGN4OiAwLCBjeTogMCwgY29sb3I6ICcjMDAwMDAwJyB9O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGluZTtcbiJdfQ==