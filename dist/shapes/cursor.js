"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var BaseShape = require("./base-shape");
var ns = require("../core/namespace");

var Cursor = (function (_BaseShape) {
  function Cursor() {
    _classCallCheck(this, Cursor);

    if (_BaseShape != null) {
      _BaseShape.apply(this, arguments);
    }
  }

  _inherits(Cursor, _BaseShape);

  _createClass(Cursor, {
    getClassName: {
      value: function getClassName() {
        return "cursor";
      }
    },
    _getAccessorList: {
      value: function _getAccessorList() {
        return { x: 0 };
      }
    },
    _getDefaults: {
      value: function _getDefaults() {
        return {
          color: "#000000",
          opacity: 1
        };
      }
    },
    render: {
      value: function render(renderingContext) {
        if (this.shape) {
          return this.shape;
        }

        this.shape = document.createElementNS(ns, "line");
        this.shape.setAttributeNS(null, "x", 0);
        this.shape.setAttributeNS(null, "y1", 0);
        this.shape.setAttributeNS(null, "y2", renderingContext.height);
        this.shape.setAttributeNS(null, "shape-rendering", "crispEdges");

        return this.shape;
      }
    },
    update: {
      value: function update(renderingContext, group, datum, index) {
        var x = renderingContext.xScale(this.x(datum));
        var color = this.params.color;

        group.setAttributeNS(null, "transform", "translate(" + x + ", 0)");
        this.shape.style.stroke = color;
      }
    },
    inArea: {

      // not selectable with a drag

      value: function inArea() {
        return false;
      }
    }
  });

  return Cursor;
})(BaseShape);

module.exports = Cursor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvY3Vyc29yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzFDLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztJQUVsQyxNQUFNO1dBQU4sTUFBTTswQkFBTixNQUFNOzs7Ozs7O1lBQU4sTUFBTTs7ZUFBTixNQUFNO0FBQ1YsZ0JBQVk7YUFBQSx3QkFBRztBQUFFLGVBQU8sUUFBUSxDQUFDO09BQUU7O0FBRW5DLG9CQUFnQjthQUFBLDRCQUFHO0FBQ2pCLGVBQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7T0FDakI7O0FBRUQsZ0JBQVk7YUFBQSx3QkFBRztBQUNiLGVBQU87QUFDTCxlQUFLLEVBQUUsU0FBUztBQUNoQixpQkFBTyxFQUFFLENBQUM7U0FDWCxDQUFDO09BQ0g7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFO0FBQ3ZCLFlBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUFFLGlCQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FBRTs7QUFFdEMsWUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNsRCxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekMsWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvRCxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsWUFBWSxDQUFDLENBQUM7O0FBRWpFLGVBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztPQUNuQjs7QUFFRCxVQUFNO2FBQUEsZ0JBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDNUMsWUFBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNqRCxZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQzs7QUFFaEMsYUFBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxpQkFBZSxDQUFDLFVBQU8sQ0FBQztBQUM5RCxZQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO09BQ2pDOztBQUdELFVBQU07Ozs7YUFBQSxrQkFBRztBQUFFLGVBQU8sS0FBSyxDQUFDO09BQUU7Ozs7U0FuQ3RCLE1BQU07R0FBUyxTQUFTOztBQXNDOUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMiLCJmaWxlIjoiZXM2L3NoYXBlcy9jdXJzb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCYXNlU2hhcGUgPSByZXF1aXJlKCcuL2Jhc2Utc2hhcGUnKTtcbmNvbnN0IG5zID0gcmVxdWlyZSgnLi4vY29yZS9uYW1lc3BhY2UnKTtcblxuY2xhc3MgQ3Vyc29yIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ2N1cnNvcic7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IHg6IDAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29sb3I6ICcjMDAwMDAwJyxcbiAgICAgIG9wYWNpdHk6IDFcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy5zaGFwZSkgeyByZXR1cm4gdGhpcy5zaGFwZTsgfVxuXG4gICAgdGhpcy5zaGFwZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2xpbmUnKTtcbiAgICB0aGlzLnNoYXBlLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgMCk7XG4gICAgdGhpcy5zaGFwZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneTEnLCAwKTtcbiAgICB0aGlzLnNoYXBlLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5MicsIHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0KTtcbiAgICB0aGlzLnNoYXBlLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnY3Jpc3BFZGdlcycpO1xuXG4gICAgcmV0dXJuIHRoaXMuc2hhcGU7XG4gIH1cblxuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZ3JvdXAsIGRhdHVtLCBpbmRleCkge1xuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZSh0aGlzLngoZGF0dW0pKTtcbiAgICBjb25zdCBjb2xvciA9IHRoaXMucGFyYW1zLmNvbG9yO1xuXG4gICAgZ3JvdXAuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHt4fSwgMClgKTtcbiAgICB0aGlzLnNoYXBlLnN0eWxlLnN0cm9rZSA9IGNvbG9yO1xuICB9XG5cbiAgLy8gbm90IHNlbGVjdGFibGUgd2l0aCBhIGRyYWdcbiAgaW5BcmVhKCkgeyByZXR1cm4gZmFsc2U7IH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDdXJzb3I7XG5cbiJdfQ==