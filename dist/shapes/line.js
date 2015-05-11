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
      value: function update(context, group, data) {
        this.shape.setAttributeNS(null, "d", this._buildLine(context, data));
        this.shape.style.stroke = this.color(data);
        this.shape.style.fill = "none";
      }
    },
    _buildLine: {

      // builds the `path.d` attribute

      value: function _buildLine(context, data) {
        var _this = this;

        // sort data
        var data = data.slice(0);
        data.sort(function (a, b) {
          return _this.cx(a) < _this.cx(b) ? -1 : 1;
        });

        // console.log(data);

        var instructions = data.map(function (datum, index) {
          var command = index === 0 ? "M" : "L";
          var x = context.xScale(_this.cx(datum));
          var y = context.yScale(_this.cy(datum));
          return command + x + "," + y;
        });

        return instructions.join();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvbGluZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQzs7SUFFcEMsSUFBSTtXQUFKLElBQUk7MEJBQUosSUFBSTs7Ozs7OztZQUFKLElBQUk7O2VBQUosSUFBSTtBQUNSLGdCQUFZO2FBQUEsd0JBQUc7QUFBRSxlQUFPLE1BQU0sQ0FBQztPQUFFOztBQUVqQyxVQUFNO2FBQUEsa0JBQUc7QUFDUCxZQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFBRSxpQkFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQUU7O0FBRXRDLFlBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUV2RCxlQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7T0FDbkI7O0FBRUQsVUFBTTthQUFBLGdCQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO0FBQzNCLFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNyRSxZQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzQyxZQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO09BQ2hDOztBQUdELGNBQVU7Ozs7YUFBQSxvQkFBQyxPQUFPLEVBQUUsSUFBSSxFQUFFOzs7O0FBRXhCLFlBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekIsWUFBSSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLEVBQUs7QUFDbEIsaUJBQU8sTUFBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3pDLENBQUMsQ0FBQzs7OztBQUlILFlBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFLO0FBQzVDLGNBQU0sT0FBTyxHQUFHLEtBQUssS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUN4QyxjQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDekMsY0FBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLGlCQUFPLE9BQU8sR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztTQUM5QixDQUFDLENBQUM7O0FBRUgsZUFBTyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDNUI7O0FBRUQsb0JBQWdCO2FBQUEsNEJBQUc7QUFDakIsZUFBTyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUM7T0FDM0M7Ozs7U0F2Q0csSUFBSTtHQUFTLFNBQVM7O0FBMEM1QixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyIsImZpbGUiOiJlczYvc2hhcGVzL2xpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCYXNlU2hhcGUgPSByZXF1aXJlKCcuL2Jhc2Utc2hhcGUnKTtcblxuY2xhc3MgTGluZSBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdsaW5lJzsgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5zaGFwZSkgeyByZXR1cm4gdGhpcy5zaGFwZTsgfVxuXG4gICAgdGhpcy5zaGFwZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAncGF0aCcpO1xuICAgIC8vIHRoaXMuc2hhcGUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG4gICAgcmV0dXJuIHRoaXMuc2hhcGU7XG4gIH1cblxuICB1cGRhdGUoY29udGV4dCwgZ3JvdXAsIGRhdGEpIHtcbiAgICB0aGlzLnNoYXBlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgdGhpcy5fYnVpbGRMaW5lKGNvbnRleHQsIGRhdGEpKTtcbiAgICB0aGlzLnNoYXBlLnN0eWxlLnN0cm9rZSA9IHRoaXMuY29sb3IoZGF0YSk7XG4gICAgdGhpcy5zaGFwZS5zdHlsZS5maWxsID0gJ25vbmUnO1xuICB9XG5cbiAgLy8gYnVpbGRzIHRoZSBgcGF0aC5kYCBhdHRyaWJ1dGVcbiAgX2J1aWxkTGluZShjb250ZXh0LCBkYXRhKSB7XG4gICAgLy8gc29ydCBkYXRhXG4gICAgbGV0IGRhdGEgPSBkYXRhLnNsaWNlKDApO1xuICAgIGRhdGEuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY3goYSkgPCB0aGlzLmN4KGIpID8gLTEgOiAxO1xuICAgIH0pO1xuXG4gICAgLy8gY29uc29sZS5sb2coZGF0YSk7XG5cbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gZGF0YS5tYXAoKGRhdHVtLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgY29tbWFuZCA9IGluZGV4ID09PSAwID8gJ00nIDogJ0wnO1xuICAgICAgY29uc3QgeCA9IGNvbnRleHQueFNjYWxlKHRoaXMuY3goZGF0dW0pKTtcbiAgICAgIGNvbnN0IHkgPSBjb250ZXh0LnlTY2FsZSh0aGlzLmN5KGRhdHVtKSk7XG4gICAgICByZXR1cm4gY29tbWFuZCArIHggKyAnLCcgKyB5O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGluc3RydWN0aW9ucy5qb2luKCk7XG4gIH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IGN4OiAwLCBjeTogMCwgY29sb3I6ICcjMDAwMDAwJyB9O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGluZTtcbiJdfQ==