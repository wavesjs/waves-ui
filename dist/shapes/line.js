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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvcmVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQzs7SUFFcEMsSUFBSTtXQUFKLElBQUk7MEJBQUosSUFBSTs7Ozs7OztZQUFKLElBQUk7O2VBQUosSUFBSTtBQUNSLGdCQUFZO2FBQUEsd0JBQUc7QUFBRSxlQUFPLE1BQU0sQ0FBQztPQUFFOztBQUVqQyxVQUFNO2FBQUEsa0JBQUc7QUFDUCxZQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFBRSxpQkFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQUU7O0FBRXRDLFlBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZELGVBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztPQUNuQjs7QUFFRCxVQUFNO2FBQUEsZ0JBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7QUFDM0IsWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3JFLFlBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNDLFlBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7T0FDaEM7O0FBR0QsY0FBVTs7OzthQUFBLG9CQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUU7Ozs7QUFFeEIsWUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QixZQUFJLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBSztBQUNsQixpQkFBTyxNQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDekMsQ0FBQyxDQUFDOzs7O0FBSUgsWUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLLEVBQUs7QUFDNUMsY0FBTSxPQUFPLEdBQUcsS0FBSyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ3hDLGNBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBSyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN6QyxjQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDekMsaUJBQU8sT0FBTyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1NBQzlCLENBQUMsQ0FBQzs7QUFFSCxlQUFPLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUM1Qjs7QUFFRCxvQkFBZ0I7YUFBQSw0QkFBRztBQUNqQixlQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQztPQUMzQzs7OztTQXRDRyxJQUFJO0dBQVMsU0FBUzs7QUF5QzVCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDIiwiZmlsZSI6ImVzNi9zaGFwZXMvcmVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEJhc2VTaGFwZSA9IHJlcXVpcmUoJy4vYmFzZS1zaGFwZScpO1xuXG5jbGFzcyBMaW5lIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ2xpbmUnOyB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnNoYXBlKSB7IHJldHVybiB0aGlzLnNoYXBlOyB9XG5cbiAgICB0aGlzLnNoYXBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgcmV0dXJuIHRoaXMuc2hhcGU7XG4gIH1cblxuICB1cGRhdGUoY29udGV4dCwgZ3JvdXAsIGRhdGEpIHtcbiAgICB0aGlzLnNoYXBlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdkJywgdGhpcy5fYnVpbGRMaW5lKGNvbnRleHQsIGRhdGEpKTtcbiAgICB0aGlzLnNoYXBlLnN0eWxlLnN0cm9rZSA9IHRoaXMuY29sb3IoZGF0YSk7XG4gICAgdGhpcy5zaGFwZS5zdHlsZS5maWxsID0gJ25vbmUnO1xuICB9XG5cbiAgLy8gYnVpbGRzIHRoZSBgcGF0aC5kYCBhdHRyaWJ1dGVcbiAgX2J1aWxkTGluZShjb250ZXh0LCBkYXRhKSB7XG4gICAgLy8gc29ydCBkYXRhXG4gICAgbGV0IGRhdGEgPSBkYXRhLnNsaWNlKDApO1xuICAgIGRhdGEuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY3goYSkgPCB0aGlzLmN4KGIpID8gLTEgOiAxO1xuICAgIH0pO1xuXG4gICAgLy8gY29uc29sZS5sb2coZGF0YSk7XG5cbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gZGF0YS5tYXAoKGRhdHVtLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgY29tbWFuZCA9IGluZGV4ID09PSAwID8gJ00nIDogJ0wnO1xuICAgICAgY29uc3QgeCA9IGNvbnRleHQueFNjYWxlKHRoaXMuY3goZGF0dW0pKTtcbiAgICAgIGNvbnN0IHkgPSBjb250ZXh0LnlTY2FsZSh0aGlzLmN5KGRhdHVtKSk7XG4gICAgICByZXR1cm4gY29tbWFuZCArIHggKyAnLCcgKyB5O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGluc3RydWN0aW9ucy5qb2luKCk7XG4gIH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IGN4OiAwLCBjeTogMCwgY29sb3I6ICcjMDAwMDAwJyB9O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGluZTtcbiJdfQ==