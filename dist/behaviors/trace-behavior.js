"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var BaseBehavior = require("./base-behavior");

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
        if (target === shape.mean) {
          this._editMean(renderingContext, shape, datum, dx, dy);
        } else if (target === shape.min) {
          this._editRange(renderingContext, shape, datum, dx, dy, "min");
        } else if (target === shape.max) {
          this._editRange(renderingContext, shape, datum, dx, dy, "max");
        }
      }
    },
    _editMean: {
      value: function _editMean(renderingContext, shape, datum, dx, dy) {
        // work in pixel domain
        var x = renderingContext.xScale(shape.x(datum));
        var y = renderingContext.yScale(shape.yMean(datum));

        var targetX = x + dx;
        var targetY = y - dy;

        shape.x(datum, renderingContext.xScale.invert(targetX));
        shape.yMean(datum, renderingContext.yScale.invert(targetY));
      }
    },
    _editRange: {
      value: function _editRange(renderingContext, shape, datum, dx, dy, rangeSide) {
        var range = renderingContext.yScale(shape.yRange(datum));

        var targetRange = rangeSide === "min" ? range + 2 * dy : range - 2 * dy;
        targetRange = Math.max(targetRange, 0);

        shape.yRange(datum, renderingContext.yScale.invert(targetRange));
      }
    }
  });

  return TraceBehavior;
})(BaseBehavior);

module.exports = TraceBehavior;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9iZWhhdmlvcnMvdHJhY2UtYmVoYXZpb3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7SUFHMUMsYUFBYTtXQUFiLGFBQWE7MEJBQWIsYUFBYTs7Ozs7OztZQUFiLGFBQWE7O2VBQWIsYUFBYTtBQUNqQixRQUFJO2FBQUMsY0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFO0FBQ3BELFlBQUksTUFBTSxLQUFLLEtBQUssQ0FBQyxJQUFJLEVBQUU7QUFDekIsY0FBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUN4RCxNQUFNLElBQUksTUFBTSxLQUFLLEtBQUssQ0FBQyxHQUFHLEVBQUU7QUFDL0IsY0FBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDaEUsTUFBTSxJQUFJLE1BQU0sS0FBSyxLQUFLLENBQUMsR0FBRyxFQUFFO0FBQy9CLGNBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2hFO09BQ0Y7O0FBRUQsYUFBUzthQUFBLG1CQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTs7QUFFaEQsWUFBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNsRCxZQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUV0RCxZQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFlBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRXJCLGFBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUN4RCxhQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7T0FDN0Q7O0FBRUQsY0FBVTthQUFBLG9CQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUU7QUFDNUQsWUFBTSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFM0QsWUFBSSxXQUFXLEdBQUcsU0FBUyxLQUFLLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN4RSxtQkFBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUV2QyxhQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7T0FDbEU7Ozs7U0E5QkcsYUFBYTtHQUFTLFlBQVk7O0FBaUN4QyxNQUFNLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyIsImZpbGUiOiJlczYvYmVoYXZpb3JzL3RyYWNlLWJlaGF2aW9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQmFzZUJlaGF2aW9yID0gcmVxdWlyZSgnLi9iYXNlLWJlaGF2aW9yJyk7XG5cblxuY2xhc3MgVHJhY2VCZWhhdmlvciBleHRlbmRzIEJhc2VCZWhhdmlvciB7XG4gIGVkaXQgKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBpZiAodGFyZ2V0ID09PSBzaGFwZS5tZWFuKSB7XG4gICAgICB0aGlzLl9lZGl0TWVhbihyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSk7XG4gICAgfSBlbHNlIGlmICh0YXJnZXQgPT09IHNoYXBlLm1pbikge1xuICAgICAgdGhpcy5fZWRpdFJhbmdlKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCAnbWluJyk7XG4gICAgfSBlbHNlIGlmICh0YXJnZXQgPT09IHNoYXBlLm1heCkge1xuICAgICAgdGhpcy5fZWRpdFJhbmdlKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCAnbWF4Jyk7XG4gICAgfVxuICB9XG5cbiAgX2VkaXRNZWFuKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5KSB7XG4gICAgLy8gd29yayBpbiBwaXhlbCBkb21haW5cbiAgICBjb25zdCB4ID0gcmVuZGVyaW5nQ29udGV4dC54U2NhbGUoc2hhcGUueChkYXR1bSkpO1xuICAgIGNvbnN0IHkgPSByZW5kZXJpbmdDb250ZXh0LnlTY2FsZShzaGFwZS55TWVhbihkYXR1bSkpO1xuXG4gICAgbGV0IHRhcmdldFggPSB4ICsgZHg7XG4gICAgbGV0IHRhcmdldFkgPSB5IC0gZHk7XG5cbiAgICBzaGFwZS54KGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnhTY2FsZS5pbnZlcnQodGFyZ2V0WCkpO1xuICAgIHNoYXBlLnlNZWFuKGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnlTY2FsZS5pbnZlcnQodGFyZ2V0WSkpO1xuICB9XG5cbiAgX2VkaXRSYW5nZShyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgcmFuZ2VTaWRlKSB7XG4gICAgY29uc3QgcmFuZ2UgPSByZW5kZXJpbmdDb250ZXh0LnlTY2FsZShzaGFwZS55UmFuZ2UoZGF0dW0pKTtcblxuICAgIGxldCB0YXJnZXRSYW5nZSA9IHJhbmdlU2lkZSA9PT0gJ21pbicgPyByYW5nZSArIDIgKiBkeSA6IHJhbmdlIC0gMiAqIGR5O1xuICAgIHRhcmdldFJhbmdlID0gTWF0aC5tYXgodGFyZ2V0UmFuZ2UsIDApO1xuXG4gICAgc2hhcGUueVJhbmdlKGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnlTY2FsZS5pbnZlcnQodGFyZ2V0UmFuZ2UpKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNlQmVoYXZpb3I7XG4iXX0=