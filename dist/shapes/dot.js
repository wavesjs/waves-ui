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

      value: function inArea(context, datum, x1, x2, y1, y2) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvcmVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQzs7SUFFcEMsR0FBRztXQUFILEdBQUc7MEJBQUgsR0FBRzs7Ozs7OztZQUFILEdBQUc7O2VBQUgsR0FBRztBQUNQLGdCQUFZO2FBQUEsd0JBQUc7QUFBRSxlQUFPLEtBQUssQ0FBQztPQUFFOztBQUVoQyxVQUFNO2FBQUEsa0JBQUc7QUFDUCxZQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFBRSxpQkFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQUU7O0FBRXRDLFlBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3pELGVBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztPQUNuQjs7QUFFRCxVQUFNO2FBQUEsZ0JBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ25DLFlBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQzFDLFlBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQzFDLFlBQU0sQ0FBQyxHQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekIsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFaEMsYUFBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxpQkFBZSxFQUFFLFVBQUssRUFBRSxPQUFJLENBQUM7QUFDbkUsWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4QyxZQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO09BQy9COztBQUdELFVBQU07Ozs7YUFBQSxnQkFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUNyQyxZQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUMxQyxZQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFMUMsWUFBSSxBQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxFQUFFO0FBQ2hELGlCQUFPLElBQUksQ0FBQztTQUNiOztBQUVELGVBQU8sS0FBSyxDQUFDO09BQ2Q7O0FBR0Qsb0JBQWdCOzs7O2FBQUEsNEJBQUc7QUFDakIsZUFBTyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQztPQUNqRDs7OztTQXBDRyxHQUFHO0dBQVMsU0FBUzs7QUFxQzFCLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMiLCJmaWxlIjoiZXM2L3NoYXBlcy9yZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQmFzZVNoYXBlID0gcmVxdWlyZSgnLi9iYXNlLXNoYXBlJyk7XG5cbmNsYXNzIERvdCBleHRlbmRzIEJhc2VTaGFwZSB7XG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdkb3QnOyB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnNoYXBlKSB7IHJldHVybiB0aGlzLnNoYXBlOyB9XG5cbiAgICB0aGlzLnNoYXBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHRoaXMubnMsICdjaXJjbGUnKTtcbiAgICByZXR1cm4gdGhpcy5zaGFwZTtcbiAgfVxuXG4gIHVwZGF0ZShjb250ZXh0LCBncm91cCwgZGF0dW0sIGluZGV4KSB7XG4gICAgY29uc3QgY3ggPSBjb250ZXh0LnhTY2FsZSh0aGlzLmN4KGRhdHVtKSk7XG4gICAgY29uc3QgY3kgPSBjb250ZXh0LnlTY2FsZSh0aGlzLmN5KGRhdHVtKSk7XG4gICAgY29uc3QgciAgPSB0aGlzLnIoZGF0dW0pO1xuICAgIGNvbnN0IGNvbG9yID0gdGhpcy5jb2xvcihkYXR1bSk7XG5cbiAgICBncm91cC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke2N4fSwgJHtjeX0pYCk7XG4gICAgdGhpcy5zaGFwZS5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncicsIHIpO1xuICAgIHRoaXMuc2hhcGUuc3R5bGUuZmlsbCA9IGNvbG9yO1xuICB9XG5cbiAgLy8geDEsIHgyLCB5MSwgeTIgPT4gaW4gcGl4ZWwgZG9tYWluXG4gIGluQXJlYShjb250ZXh0LCBkYXR1bSwgeDEsIHgyLCB5MSwgeTIpIHtcbiAgICBjb25zdCBjeCA9IGNvbnRleHQueFNjYWxlKHRoaXMuY3goZGF0dW0pKTtcbiAgICBjb25zdCBjeSA9IGNvbnRleHQueVNjYWxlKHRoaXMuY3koZGF0dW0pKTtcblxuICAgIGlmICgoY3ggPiB4MSAmJiBjeCA8IHgyKSAmJiAoY3kgPiB5MSAmJiBjeSA8IHkyKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gQFRPRE8gcmVuYW1lIDogY29uZnVzaW9uIGJldHdlZW4gYWNjZXNzb3JzIGFuZCBtZXRhLWFjY2Vzc29yc1xuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IGN4OiAwLCBjeTogMCwgcjogMywgY29sb3I6ICcjMDAwMDAwJ8KgfTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEb3Q7XG5cbiJdfQ==