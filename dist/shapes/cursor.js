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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvY3Vyc29yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzFDLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztJQUdsQyxNQUFNO1dBQU4sTUFBTTswQkFBTixNQUFNOzs7Ozs7O1lBQU4sTUFBTTs7ZUFBTixNQUFNO0FBQ1YsZ0JBQVk7YUFBQSx3QkFBRztBQUFFLGVBQU8sUUFBUSxDQUFDO09BQUU7O0FBRW5DLG9CQUFnQjthQUFBLDRCQUFHO0FBQ2pCLGVBQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7T0FDakI7O0FBRUQsZ0JBQVk7YUFBQSx3QkFBRztBQUNiLGVBQU87QUFDTCxlQUFLLEVBQUUsU0FBUztBQUNoQixpQkFBTyxFQUFFLENBQUM7U0FDWCxDQUFDO09BQ0g7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFO0FBQ3ZCLFlBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUFFLGlCQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FBRTs7QUFFdEMsWUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNsRCxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLFlBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekMsWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvRCxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsWUFBWSxDQUFDLENBQUM7O0FBRWpFLGVBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztPQUNuQjs7QUFFRCxVQUFNO2FBQUEsZ0JBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDNUMsWUFBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNqRCxZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQzs7QUFFaEMsYUFBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxpQkFBZSxDQUFDLFVBQU8sQ0FBQztBQUM5RCxZQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO09BQ2pDOztBQUdELFVBQU07Ozs7YUFBQSxrQkFBRztBQUFFLGVBQU8sS0FBSyxDQUFDO09BQUU7Ozs7U0FuQ3RCLE1BQU07R0FBUyxTQUFTOztBQXNDOUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMiLCJmaWxlIjoiZXM2L3NoYXBlcy9jdXJzb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCYXNlU2hhcGUgPSByZXF1aXJlKCcuL2Jhc2Utc2hhcGUnKTtcbmNvbnN0IG5zID0gcmVxdWlyZSgnLi4vY29yZS9uYW1lc3BhY2UnKTtcblxuXG5jbGFzcyBDdXJzb3IgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnY3Vyc29yJzsgfVxuXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7XG4gICAgcmV0dXJuIHsgeDogMCB9O1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgb3BhY2l0eTogMVxuICAgIH07XG4gIH1cblxuICByZW5kZXIocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGlmICh0aGlzLnNoYXBlKSB7IHJldHVybiB0aGlzLnNoYXBlOyB9XG5cbiAgICB0aGlzLnNoYXBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnbGluZScpO1xuICAgIHRoaXMuc2hhcGUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3gnLCAwKTtcbiAgICB0aGlzLnNoYXBlLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5MScsIDApO1xuICAgIHRoaXMuc2hhcGUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3kyJywgcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQpO1xuICAgIHRoaXMuc2hhcGUuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdjcmlzcEVkZ2VzJyk7XG5cbiAgICByZXR1cm4gdGhpcy5zaGFwZTtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBncm91cCwgZGF0dW0sIGluZGV4KSB7XG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQueFNjYWxlKHRoaXMueChkYXR1bSkpO1xuICAgIGNvbnN0IGNvbG9yID0gdGhpcy5wYXJhbXMuY29sb3I7XG5cbiAgICBncm91cC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3h9LCAwKWApO1xuICAgIHRoaXMuc2hhcGUuc3R5bGUuc3Ryb2tlID0gY29sb3I7XG4gIH1cblxuICAvLyBub3Qgc2VsZWN0YWJsZSB3aXRoIGEgZHJhZ1xuICBpbkFyZWEoKSB7IHJldHVybiBmYWxzZTsgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEN1cnNvcjtcblxuIl19