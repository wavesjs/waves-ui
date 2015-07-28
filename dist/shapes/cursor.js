"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseShape = _interopRequire(require("./base-shape"));

var ns = _interopRequire(require("../core/namespace"));

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
        if (this.$el) {
          return this.$el;
        }

        this.$el = document.createElementNS(ns, "line");
        this.$el.setAttributeNS(null, "x", 0);
        this.$el.setAttributeNS(null, "y1", 0);
        this.$el.setAttributeNS(null, "y2", renderingContext.height);
        this.$el.setAttributeNS(null, "shape-rendering", "crispEdges");

        return this.$el;
      }
    },
    update: {
      value: function update(renderingContext, datum, index) {
        var x = renderingContext.timeToPixel(this.x(datum));
        var color = this.params.color;

        this.$el.setAttributeNS(null, "transform", "translate(" + x + ", 0)");
        this.$el.style.stroke = color;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFPLFNBQVMsMkJBQU0sY0FBYzs7SUFDN0IsRUFBRSwyQkFBTSxtQkFBbUI7O0lBR2IsTUFBTTtXQUFOLE1BQU07MEJBQU4sTUFBTTs7Ozs7OztZQUFOLE1BQU07O2VBQU4sTUFBTTtBQUN6QixnQkFBWTthQUFBLHdCQUFHO0FBQUUsZUFBTyxRQUFRLENBQUM7T0FBRTs7QUFFbkMsb0JBQWdCO2FBQUEsNEJBQUc7QUFDakIsZUFBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztPQUNqQjs7QUFFRCxnQkFBWTthQUFBLHdCQUFHO0FBQ2IsZUFBTztBQUNMLGVBQUssRUFBRSxTQUFTO0FBQ2hCLGlCQUFPLEVBQUUsQ0FBQztTQUNYLENBQUM7T0FDSDs7QUFFRCxVQUFNO2FBQUEsZ0JBQUMsZ0JBQWdCLEVBQUU7QUFDdkIsWUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQUUsaUJBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUFFOztBQUVsQyxZQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2hELFlBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEMsWUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QyxZQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdELFlBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxZQUFZLENBQUMsQ0FBQzs7QUFFL0QsZUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO09BQ2pCOztBQUVELFVBQU07YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ3JDLFlBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdEQsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7O0FBRWhDLFlBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLGlCQUFlLENBQUMsVUFBTyxDQUFDO0FBQ2pFLFlBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7T0FDL0I7O0FBR0QsVUFBTTs7OzthQUFBLGtCQUFHO0FBQUUsZUFBTyxLQUFLLENBQUM7T0FBRTs7OztTQW5DUCxNQUFNO0dBQVMsU0FBUzs7aUJBQXhCLE1BQU0iLCJmaWxlIjoiZXM2L3V0aWxzL29ydGhvZ29uYWwtZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9iYXNlLXNoYXBlJztcbmltcG9ydCBucyBmcm9tICcuLi9jb3JlL25hbWVzcGFjZSc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3Vyc29yIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ2N1cnNvcic7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIHJldHVybiB7IHg6IDAgfTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29sb3I6ICcjMDAwMDAwJyxcbiAgICAgIG9wYWNpdHk6IDFcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy4kZWwpIHsgcmV0dXJuIHRoaXMuJGVsOyB9XG5cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2xpbmUnKTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAneCcsIDApO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5MScsIDApO1xuICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5MicsIHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0KTtcbiAgICB0aGlzLiRlbC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ2NyaXNwRWRnZXMnKTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIHVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgaW5kZXgpIHtcbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbCh0aGlzLngoZGF0dW0pKTtcbiAgICBjb25zdCBjb2xvciA9IHRoaXMucGFyYW1zLmNvbG9yO1xuXG4gICAgdGhpcy4kZWwuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHt4fSwgMClgKTtcbiAgICB0aGlzLiRlbC5zdHlsZS5zdHJva2UgPSBjb2xvcjtcbiAgfVxuXG4gIC8vIG5vdCBzZWxlY3RhYmxlIHdpdGggYSBkcmFnXG4gIGluQXJlYSgpIHsgcmV0dXJuIGZhbHNlOyB9XG59XG4iXX0=