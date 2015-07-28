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
        var forceDefault = arguments[6] === undefined ? false : arguments[6];

        // rely on element doesn't allow to edit several shapes at once...
        // classes are not the best solution neither, but works
        if (target.classList.contains("mean") || forceDefault) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFPLFlBQVksMkJBQU0saUJBQWlCOztJQUdyQixhQUFhO1dBQWIsYUFBYTswQkFBYixhQUFhOzs7Ozs7O1lBQWIsYUFBYTs7ZUFBYixhQUFhO0FBQ2hDLFFBQUk7YUFBQSxjQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQXdCO1lBQXRCLFlBQVksZ0NBQUcsS0FBSzs7OztBQUd2RSxZQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFlBQVksRUFBRTtBQUNyRCxjQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ3hELE1BQU0sSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUMzQyxjQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNoRSxNQUFNLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDM0MsY0FBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDaEU7T0FDRjs7QUFFRCxhQUFTO2FBQUEsbUJBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFOztBQUVoRCxZQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELFlBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7O0FBRTNELFlBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDckIsWUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7QUFFckIsYUFBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQzdELGFBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztPQUNsRTs7QUFFRCxjQUFVO2FBQUEsb0JBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRTtBQUM1RCxZQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUVoRSxZQUFJLFdBQVcsR0FBRyxTQUFTLEtBQUssS0FBSyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3hFLG1CQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRXZDLGFBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztPQUN2RTs7OztTQWhDa0IsYUFBYTtHQUFTLFlBQVk7O2lCQUFsQyxhQUFhIiwiZmlsZSI6ImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUJlaGF2aW9yIGZyb20gJy4vYmFzZS1iZWhhdmlvcic7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2VCZWhhdmlvciBleHRlbmRzIEJhc2VCZWhhdmlvciB7XG4gIGVkaXQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCwgZm9yY2VEZWZhdWx0ID0gZmFsc2UpIHtcbiAgICAvLyByZWx5IG9uIGVsZW1lbnQgZG9lc24ndCBhbGxvdyB0byBlZGl0IHNldmVyYWwgc2hhcGVzIGF0IG9uY2UuLi5cbiAgICAvLyBjbGFzc2VzIGFyZSBub3QgdGhlIGJlc3Qgc29sdXRpb24gbmVpdGhlciwgYnV0IHdvcmtzXG4gICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21lYW4nKSB8fCBmb3JjZURlZmF1bHQpIHtcbiAgICAgIHRoaXMuX2VkaXRNZWFuKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5KTtcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21pbicpKSB7XG4gICAgICB0aGlzLl9lZGl0UmFuZ2UocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksICdtaW4nKTtcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ21heCcpKSB7XG4gICAgICB0aGlzLl9lZGl0UmFuZ2UocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksICdtYXgnKTtcbiAgICB9XG4gIH1cblxuICBfZWRpdE1lYW4ocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHkpIHtcbiAgICAvLyB3b3JrIGluIHBpeGVsIGRvbWFpblxuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLngoZGF0dW0pKTtcbiAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoc2hhcGUubWVhbihkYXR1bSkpO1xuXG4gICAgbGV0IHRhcmdldFggPSB4ICsgZHg7XG4gICAgbGV0IHRhcmdldFkgPSB5IC0gZHk7XG5cbiAgICBzaGFwZS54KGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh0YXJnZXRYKSk7XG4gICAgc2hhcGUubWVhbihkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFkpKTtcbiAgfVxuXG4gIF9lZGl0UmFuZ2UocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHJhbmdlU2lkZSkge1xuICAgIGNvbnN0IHJhbmdlID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoc2hhcGUucmFuZ2UoZGF0dW0pKTtcblxuICAgIGxldCB0YXJnZXRSYW5nZSA9IHJhbmdlU2lkZSA9PT0gJ21pbicgPyByYW5nZSArIDIgKiBkeSA6IHJhbmdlIC0gMiAqIGR5O1xuICAgIHRhcmdldFJhbmdlID0gTWF0aC5tYXgodGFyZ2V0UmFuZ2UsIDApO1xuXG4gICAgc2hhcGUucmFuZ2UoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsLmludmVydCh0YXJnZXRSYW5nZSkpO1xuICB9XG59XG4iXX0=