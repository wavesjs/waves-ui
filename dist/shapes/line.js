"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseShape = _interopRequire(require("./base-shape"));

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
    _getAccessorList: {
      value: function _getAccessorList() {
        return { cx: 0, cy: 0 };
      }
    },
    _getDefaults: {
      value: function _getDefaults() {
        return { color: "#000000" };
      }
    },
    render: {
      value: function render(renderingContext) {
        if (this.$el) {
          return this.$el;
        }

        this.$el = document.createElementNS(this.ns, "path");
        // this.el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
        return this.$el;
      }
    },
    update: {
      value: function update(renderingContext, data) {
        var _this = this;

        data = data.slice(0);
        data.sort(function (a, b) {
          return _this.cx(a) < _this.cx(b) ? -1 : 1;
        });

        this.$el.setAttributeNS(null, "d", this._buildLine(renderingContext, data));
        this.$el.style.stroke = this.params.color;
        this.$el.style.fill = "none";

        data = null;
      }
    },
    _buildLine: {

      // builds the `path.d` attribute
      // @TODO create some ShapeHelper ?

      value: function _buildLine(renderingContext, data) {
        var _this = this;

        if (!data.length) {
          return "";
        }
        // sort data
        var instructions = data.map(function (datum, index) {
          var x = renderingContext.timeToPixel(_this.cx(datum));
          var y = renderingContext.valueToPixel(_this.cy(datum));
          return "" + x + "," + y;
        });

        return "M" + instructions.join("L");
      }
    }
  });

  return Line;
})(BaseShape);

module.exports = Line;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFPLFNBQVMsMkJBQU0sY0FBYzs7SUFHZixJQUFJO1dBQUosSUFBSTswQkFBSixJQUFJOzs7Ozs7O1lBQUosSUFBSTs7ZUFBSixJQUFJO0FBQ3ZCLGdCQUFZO2FBQUEsd0JBQUc7QUFBRSxlQUFPLE1BQU0sQ0FBQztPQUFFOztBQUVqQyxvQkFBZ0I7YUFBQSw0QkFBRztBQUNqQixlQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7T0FDekI7O0FBRUQsZ0JBQVk7YUFBQSx3QkFBRztBQUNiLGVBQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUM7T0FDN0I7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFO0FBQ3ZCLFlBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUFFLGlCQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7U0FBRTs7QUFFbEMsWUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRXJELGVBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztPQUNqQjs7QUFFRCxVQUFNO2FBQUEsZ0JBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFOzs7QUFDN0IsWUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckIsWUFBSSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO2lCQUFLLE1BQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7U0FBQSxDQUFDLENBQUM7O0FBRXRELFlBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzVFLFlBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUMxQyxZQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDOztBQUU3QixZQUFJLEdBQUcsSUFBSSxDQUFDO09BQ2I7O0FBSUQsY0FBVTs7Ozs7YUFBQSxvQkFBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUU7OztBQUNqQyxZQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUFFLGlCQUFPLEVBQUUsQ0FBQztTQUFFOztBQUVoQyxZQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSyxFQUFFLEtBQUssRUFBSztBQUM1QyxjQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsTUFBSyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN2RCxjQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsTUFBSyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN4RCxzQkFBVSxDQUFDLFNBQUksQ0FBQyxDQUFHO1NBQ3BCLENBQUMsQ0FBQzs7QUFFSCxlQUFPLEdBQUcsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ3JDOzs7O1NBMUNrQixJQUFJO0dBQVMsU0FBUzs7aUJBQXRCLElBQUkiLCJmaWxlIjoiZXM2L3V0aWxzL29ydGhvZ29uYWwtZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ2xpbmUnOyB9XG5cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHtcbiAgICByZXR1cm4geyBjeDogMCwgY3k6IDAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4geyBjb2xvcjogJyMwMDAwMDAnIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLiRlbCkgeyByZXR1cm4gdGhpcy4kZWw7IH1cblxuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdwYXRoJyk7XG4gICAgLy8gdGhpcy5lbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkge1xuICAgIGRhdGEgPSBkYXRhLnNsaWNlKDApO1xuICAgIGRhdGEuc29ydCgoYSwgYikgPT4gdGhpcy5jeChhKSA8IHRoaXMuY3goYikgPyAtMSA6IDEpO1xuXG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2QnLCB0aGlzLl9idWlsZExpbmUocmVuZGVyaW5nQ29udGV4dCwgZGF0YSkpO1xuICAgIHRoaXMuJGVsLnN0eWxlLnN0cm9rZSA9IHRoaXMucGFyYW1zLmNvbG9yO1xuICAgIHRoaXMuJGVsLnN0eWxlLmZpbGwgPSAnbm9uZSc7XG5cbiAgICBkYXRhID0gbnVsbDtcbiAgfVxuXG4gIC8vIGJ1aWxkcyB0aGUgYHBhdGguZGAgYXR0cmlidXRlXG4gIC8vIEBUT0RPIGNyZWF0ZSBzb21lIFNoYXBlSGVscGVyID9cbiAgX2J1aWxkTGluZShyZW5kZXJpbmdDb250ZXh0LCBkYXRhKSB7XG4gICAgaWYgKCFkYXRhLmxlbmd0aCkgeyByZXR1cm4gJyc7IH1cbiAgICAvLyBzb3J0IGRhdGFcbiAgICBsZXQgaW5zdHJ1Y3Rpb25zID0gZGF0YS5tYXAoKGRhdHVtLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwodGhpcy5jeChkYXR1bSkpO1xuICAgICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHRoaXMuY3koZGF0dW0pKTtcbiAgICAgIHJldHVybiBgJHt4fSwke3l9YDtcbiAgICB9KTtcblxuICAgIHJldHVybiAnTScgKyBpbnN0cnVjdGlvbnMuam9pbignTCcpO1xuICB9XG59XG4iXX0=