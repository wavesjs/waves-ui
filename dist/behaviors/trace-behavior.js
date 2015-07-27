"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseBehavior = _interopRequire(require("./base-behavior"));

var TraceBehavior = (function (_BaseBehavior) {
  function TraceBehavior() {
    _classCallCheck(this, TraceBehavior);

    if (_BaseBehavior != null) {
      _BaseBehavior.apply(this, arguments);
    }
  }

  _inherits(TraceBehavior, _BaseBehavior);

  _createClass(TraceBehavior, {
    edit: {
      value: function edit(renderingContext, shape, datum, dx, dy, target) {
        // rely on element doesn't allow to edit several shapes at once...
        // classes are not the best solution neither, but works
        if (target.classList.contains("mean")) {
          this._editMean(renderingContext, shape, datum, dx, dy);
        } else if (target.classList.contains("min")) {
          this._editRange(renderingContext, shape, datum, dx, dy, "min");
        } else if (target.classList.contains("max")) {
          this._editRange(renderingContext, shape, datum, dx, dy, "max");
        }
      }
    },
    _editMean: {
      value: function _editMean(renderingContext, shape, datum, dx, dy) {
        // work in pixel domain
        var x = renderingContext.timeToPixel(shape.x(datum));
        var y = renderingContext.valueToPixel(shape.mean(datum));

        var targetX = x + dx;
        var targetY = y - dy;

        shape.x(datum, renderingContext.timeToPixel.invert(targetX));
        shape.mean(datum, renderingContext.valueToPixel.invert(targetY));
      }
    },
    _editRange: {
      value: function _editRange(renderingContext, shape, datum, dx, dy, rangeSide) {
        var range = renderingContext.valueToPixel(shape.range(datum));

        var targetRange = rangeSide === "min" ? range + 2 * dy : range - 2 * dy;
        targetRange = Math.max(targetRange, 0);

        shape.range(datum, renderingContext.valueToPixel.invert(targetRange));
      }
    }
  });

  return TraceBehavior;
})(BaseBehavior);

module.exports = TraceBehavior;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9iZWhhdmlvcnMvdHJhY2UtYmVoYXZpb3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFPLFlBQVksMkJBQU0saUJBQWlCOztJQUdyQixhQUFhO1dBQWIsYUFBYTswQkFBYixhQUFhOzs7Ozs7O1lBQWIsYUFBYTs7ZUFBYixhQUFhO0FBQ2hDLFFBQUk7YUFBQSxjQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7OztBQUduRCxZQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQ3JDLGNBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDeEQsTUFBTSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzNDLGNBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2hFLE1BQU0sSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUMzQyxjQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNoRTtPQUNGOztBQUVELGFBQVM7YUFBQSxtQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7O0FBRWhELFlBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdkQsWUFBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFM0QsWUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNyQixZQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUVyQixhQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDN0QsYUFBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO09BQ2xFOztBQUVELGNBQVU7YUFBQSxvQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFO0FBQzVELFlBQU0sS0FBSyxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7O0FBRWhFLFlBQUksV0FBVyxHQUFHLFNBQVMsS0FBSyxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDeEUsbUJBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFdkMsYUFBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO09BQ3ZFOzs7O1NBaENrQixhQUFhO0dBQVMsWUFBWTs7aUJBQWxDLGFBQWEiLCJmaWxlIjoiZXM2L2JlaGF2aW9ycy90cmFjZS1iZWhhdmlvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlQmVoYXZpb3IgZnJvbSAnLi9iYXNlLWJlaGF2aW9yJ1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNlQmVoYXZpb3IgZXh0ZW5kcyBCYXNlQmVoYXZpb3Ige1xuICBlZGl0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICAvLyByZWx5IG9uIGVsZW1lbnQgZG9lc24ndCBhbGxvdyB0byBlZGl0IHNldmVyYWwgc2hhcGVzIGF0IG9uY2UuLi5cbiAgICAvLyBjbGFzc2VzIGFyZSBub3QgdGhlIGJlc3Qgc29sdXRpb24gbmVpdGhlciwgYnV0IHdvcmtzXG4gICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21lYW4nKSkge1xuICAgICAgdGhpcy5fZWRpdE1lYW4ocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHkpO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbWluJykpIHtcbiAgICAgIHRoaXMuX2VkaXRSYW5nZShyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgJ21pbicpO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbWF4JykpIHtcbiAgICAgIHRoaXMuX2VkaXRSYW5nZShyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgJ21heCcpO1xuICAgIH1cbiAgfVxuXG4gIF9lZGl0TWVhbihyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSkge1xuICAgIC8vIHdvcmsgaW4gcGl4ZWwgZG9tYWluXG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2hhcGUueChkYXR1bSkpO1xuICAgIGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChzaGFwZS5tZWFuKGRhdHVtKSk7XG5cbiAgICBsZXQgdGFyZ2V0WCA9IHggKyBkeDtcbiAgICBsZXQgdGFyZ2V0WSA9IHkgLSBkeTtcblxuICAgIHNoYXBlLngoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpKTtcbiAgICBzaGFwZS5tZWFuKGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbC5pbnZlcnQodGFyZ2V0WSkpO1xuICB9XG5cbiAgX2VkaXRSYW5nZShyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgcmFuZ2VTaWRlKSB7XG4gICAgY29uc3QgcmFuZ2UgPSByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbChzaGFwZS5yYW5nZShkYXR1bSkpO1xuXG4gICAgbGV0IHRhcmdldFJhbmdlID0gcmFuZ2VTaWRlID09PSAnbWluJyA/IHJhbmdlICsgMiAqIGR5IDogcmFuZ2UgLSAyICogZHk7XG4gICAgdGFyZ2V0UmFuZ2UgPSBNYXRoLm1heCh0YXJnZXRSYW5nZSwgMCk7XG5cbiAgICBzaGFwZS5yYW5nZShkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFJhbmdlKSk7XG4gIH1cbn1cbiJdfQ==