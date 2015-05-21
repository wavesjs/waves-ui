"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var BaseBehavior = require("./base-behavior");

var SegmentBehavior = (function (_BaseBehavior) {
  function SegmentBehavior() {
    _classCallCheck(this, SegmentBehavior);

    if (_BaseBehavior != null) {
      _BaseBehavior.apply(this, arguments);
    }
  }

  _inherits(SegmentBehavior, _BaseBehavior);

  _createClass(SegmentBehavior, {
    edit: {
      // constructor() {}

      value: function edit(renderingContext, shape, datum, dx, dy, target) {
        var action = "move";
        var classList = target.classList;

        if (classList.contains("handler") && classList.contains("left")) {
          action = "resizeLeft";
        } else if (classList.contains("handler") && classList.contains("right")) {
          action = "resizeRight";
        }

        this["_" + action](renderingContext, shape, datum, dx, dy, target);
      }
    },
    _move: {
      value: function _move(renderingContext, shape, datum, dx, dy, target) {
        var layerHeight = renderingContext.height;
        // current values
        var x = renderingContext.xScale(shape.x(datum));
        var y = renderingContext.yScale(shape.y(datum));
        var height = renderingContext.yScale(shape.height(datum));
        // target values
        var targetX = Math.max(x + dx, 0);
        var targetY = y - dy;

        // lock in layer's y axis
        if (targetY < 0) {
          targetY = 0;
        } else if (targetY + height > layerHeight) {
          targetY = layerHeight - height;
        }

        shape.x(datum, renderingContext.xScale.invert(targetX));
        shape.y(datum, renderingContext.yScale.invert(targetY));
      }
    },
    _resizeLeft: {
      value: function _resizeLeft(renderingContext, shape, datum, dx, dy, target) {
        // current values
        var x = renderingContext.xScale(shape.x(datum));
        var width = renderingContext.xScale(shape.width(datum));
        // target values
        var maxTargetX = x + width;
        var targetX = x + dx < maxTargetX ? Math.max(x + dx, 0) : x;
        var targetWidth = targetX !== 0 ? Math.max(width - dx, 1) : width;

        shape.x(datum, renderingContext.xScale.invert(targetX));
        shape.width(datum, renderingContext.xScale.invert(targetWidth));
      }
    },
    _resizeRight: {
      value: function _resizeRight(renderingContext, shape, datum, dx, dy, target) {
        // current values
        var width = renderingContext.xScale(shape.width(datum));
        // target values
        var targetWidth = Math.max(width + dx, 1);

        shape.width(datum, renderingContext.xScale.invert(targetWidth));
      }
    }
  });

  return SegmentBehavior;
})(BaseBehavior);

module.exports = SegmentBehavior;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7O0lBRTFDLGVBQWU7V0FBZixlQUFlOzBCQUFmLGVBQWU7Ozs7Ozs7WUFBZixlQUFlOztlQUFmLGVBQWU7QUFHbkIsUUFBSTs7O2FBQUEsY0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFO0FBQ25ELFlBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNwQixZQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDOztBQUVuQyxZQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUMvRCxnQkFBTSxHQUFHLFlBQVksQ0FBQztTQUN2QixNQUFNLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ3ZFLGdCQUFNLEdBQUcsYUFBYSxDQUFDO1NBQ3hCOztBQUVELFlBQUksT0FBSyxNQUFNLENBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7T0FDcEU7O0FBRUQsU0FBSzthQUFBLGVBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtBQUNwRCxZQUFNLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7O0FBRTVDLFlBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDbEQsWUFBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNsRCxZQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUU1RCxZQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsWUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7O0FBR3JCLFlBQUksT0FBTyxHQUFHLENBQUMsRUFBRTtBQUNmLGlCQUFPLEdBQUcsQ0FBQyxDQUFDO1NBQ2IsTUFBTSxJQUFJLE9BQU8sR0FBRyxNQUFNLEdBQUcsV0FBVyxFQUFFO0FBQ3pDLGlCQUFPLEdBQUcsV0FBVyxHQUFHLE1BQU0sQ0FBQTtTQUMvQjs7QUFFRCxhQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDeEQsYUFBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO09BQ3pEOztBQUVELGVBQVc7YUFBQSxxQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFOztBQUUxRCxZQUFNLENBQUMsR0FBTyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3RELFlBQU0sS0FBSyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7O0FBRTFELFlBQUksVUFBVSxHQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDNUIsWUFBSSxPQUFPLEdBQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoRSxZQUFJLFdBQVcsR0FBRyxPQUFPLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7O0FBRWxFLGFBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUN4RCxhQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7T0FDakU7O0FBRUQsZ0JBQVk7YUFBQSxzQkFBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFOztBQUUzRCxZQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUUxRCxZQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRTFDLGFBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztPQUNqRTs7OztTQXpERyxlQUFlO0dBQVMsWUFBWTs7QUE0RDFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsZUFBZSxDQUFDIiwiZmlsZSI6ImVzNi90aW1lbGluZS1zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQmFzZUJlaGF2aW9yID0gcmVxdWlyZSgnLi9iYXNlLWJlaGF2aW9yJyk7XG5cbmNsYXNzIFNlZ21lbnRCZWhhdmlvciBleHRlbmRzIEJhc2VCZWhhdmlvciB7XG4gIC8vIGNvbnN0cnVjdG9yKCkge31cblxuICBlZGl0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBsZXQgYWN0aW9uID0gJ21vdmUnO1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IHRhcmdldC5jbGFzc0xpc3Q7XG5cbiAgICBpZiAoY2xhc3NMaXN0LmNvbnRhaW5zKCdoYW5kbGVyJykgJiYgY2xhc3NMaXN0LmNvbnRhaW5zKCdsZWZ0JykpIHtcbiAgICAgIGFjdGlvbiA9ICdyZXNpemVMZWZ0JztcbiAgICB9IGVsc2UgaWYgKGNsYXNzTGlzdC5jb250YWlucygnaGFuZGxlcicpICYmIGNsYXNzTGlzdC5jb250YWlucygncmlnaHQnKSkge1xuICAgICAgYWN0aW9uID0gJ3Jlc2l6ZVJpZ2h0JztcbiAgICB9XG5cbiAgICB0aGlzW2BfJHthY3Rpb259YF0ocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCk7XG4gIH1cblxuICBfbW92ZShyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgY29uc3QgbGF5ZXJIZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcbiAgICAvLyBjdXJyZW50IHZhbHVlc1xuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnhTY2FsZShzaGFwZS54KGRhdHVtKSk7XG4gICAgY29uc3QgeSA9IHJlbmRlcmluZ0NvbnRleHQueVNjYWxlKHNoYXBlLnkoZGF0dW0pKTtcbiAgICBjb25zdCBoZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LnlTY2FsZShzaGFwZS5oZWlnaHQoZGF0dW0pKTtcbiAgICAvLyB0YXJnZXQgdmFsdWVzXG4gICAgbGV0IHRhcmdldFggPSBNYXRoLm1heCh4ICsgZHgsIDApO1xuICAgIGxldCB0YXJnZXRZID0geSAtIGR5O1xuXG4gICAgLy8gbG9jayBpbiBsYXllcidzIHkgYXhpc1xuICAgIGlmICh0YXJnZXRZIDwgMCkge1xuICAgICAgdGFyZ2V0WSA9IDA7XG4gICAgfSBlbHNlIGlmICh0YXJnZXRZICsgaGVpZ2h0ID4gbGF5ZXJIZWlnaHQpIHtcbiAgICAgIHRhcmdldFkgPSBsYXllckhlaWdodCAtIGhlaWdodFxuICAgIH1cblxuICAgIHNoYXBlLngoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQueFNjYWxlLmludmVydCh0YXJnZXRYKSk7XG4gICAgc2hhcGUueShkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC55U2NhbGUuaW52ZXJ0KHRhcmdldFkpKTtcbiAgfVxuXG4gIF9yZXNpemVMZWZ0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICAvLyBjdXJyZW50IHZhbHVlc1xuICAgIGNvbnN0IHggICAgID0gcmVuZGVyaW5nQ29udGV4dC54U2NhbGUoc2hhcGUueChkYXR1bSkpO1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC54U2NhbGUoc2hhcGUud2lkdGgoZGF0dW0pKTtcbiAgICAvLyB0YXJnZXQgdmFsdWVzXG4gICAgbGV0IG1heFRhcmdldFggID0geCArIHdpZHRoO1xuICAgIGxldCB0YXJnZXRYICAgICA9IHggKyBkeCA8IG1heFRhcmdldFggPyBNYXRoLm1heCh4ICsgZHgsIDApIDogeDtcbiAgICBsZXQgdGFyZ2V0V2lkdGggPSB0YXJnZXRYICE9PSAwID8gTWF0aC5tYXgod2lkdGggLSBkeCwgMSkgOiB3aWR0aDtcblxuICAgIHNoYXBlLngoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQueFNjYWxlLmludmVydCh0YXJnZXRYKSk7XG4gICAgc2hhcGUud2lkdGgoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQueFNjYWxlLmludmVydCh0YXJnZXRXaWR0aCkpO1xuICB9XG5cbiAgX3Jlc2l6ZVJpZ2h0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICAvLyBjdXJyZW50IHZhbHVlc1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC54U2NhbGUoc2hhcGUud2lkdGgoZGF0dW0pKTtcbiAgICAvLyB0YXJnZXQgdmFsdWVzXG4gICAgbGV0IHRhcmdldFdpZHRoID0gTWF0aC5tYXgod2lkdGggKyBkeCwgMSk7XG5cbiAgICBzaGFwZS53aWR0aChkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC54U2NhbGUuaW52ZXJ0KHRhcmdldFdpZHRoKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZWdtZW50QmVoYXZpb3I7Il19