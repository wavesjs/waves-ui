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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9iZWhhdmlvcnMvc2VnbWVudC1iZWhhdmlvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOztJQUUxQyxlQUFlO1dBQWYsZUFBZTswQkFBZixlQUFlOzs7Ozs7O1lBQWYsZUFBZTs7ZUFBZixlQUFlO0FBR25CLFFBQUk7OzthQUFBLGNBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtBQUNuRCxZQUFJLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDcEIsWUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQzs7QUFFbkMsWUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDL0QsZ0JBQU0sR0FBRyxZQUFZLENBQUM7U0FDdkIsTUFBTSxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUN2RSxnQkFBTSxHQUFHLGFBQWEsQ0FBQztTQUN4Qjs7QUFFRCxZQUFJLE9BQUssTUFBTSxDQUFHLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQ3BFOztBQUVELFNBQUs7YUFBQSxlQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7QUFDcEQsWUFBTSxXQUFXLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDOztBQUU1QyxZQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2xELFlBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDbEQsWUFBTSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFNUQsWUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFlBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7OztBQUdyQixZQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUU7QUFDZixpQkFBTyxHQUFHLENBQUMsQ0FBQztTQUNiLE1BQU0sSUFBSSxPQUFPLEdBQUcsTUFBTSxHQUFHLFdBQVcsRUFBRTtBQUN6QyxpQkFBTyxHQUFHLFdBQVcsR0FBRyxNQUFNLENBQUM7U0FDaEM7O0FBRUQsYUFBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ3hELGFBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztPQUN6RDs7QUFFRCxlQUFXO2FBQUEscUJBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTs7QUFFMUQsWUFBTSxDQUFDLEdBQU8sZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN0RCxZQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUUxRCxZQUFJLFVBQVUsR0FBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQzVCLFlBQUksT0FBTyxHQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEUsWUFBSSxXQUFXLEdBQUcsT0FBTyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDOztBQUVsRSxhQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDeEQsYUFBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO09BQ2pFOztBQUVELGdCQUFZO2FBQUEsc0JBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTs7QUFFM0QsWUFBTSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFMUQsWUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUUxQyxhQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7T0FDakU7Ozs7U0F6REcsZUFBZTtHQUFTLFlBQVk7O0FBNEQxQyxNQUFNLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQyIsImZpbGUiOiJlczYvYmVoYXZpb3JzL3NlZ21lbnQtYmVoYXZpb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCYXNlQmVoYXZpb3IgPSByZXF1aXJlKCcuL2Jhc2UtYmVoYXZpb3InKTtcblxuY2xhc3MgU2VnbWVudEJlaGF2aW9yIGV4dGVuZHMgQmFzZUJlaGF2aW9yIHtcbiAgLy8gY29uc3RydWN0b3IoKSB7fVxuXG4gIGVkaXQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGxldCBhY3Rpb24gPSAnbW92ZSc7XG4gICAgY29uc3QgY2xhc3NMaXN0ID0gdGFyZ2V0LmNsYXNzTGlzdDtcblxuICAgIGlmIChjbGFzc0xpc3QuY29udGFpbnMoJ2hhbmRsZXInKSAmJiBjbGFzc0xpc3QuY29udGFpbnMoJ2xlZnQnKSkge1xuICAgICAgYWN0aW9uID0gJ3Jlc2l6ZUxlZnQnO1xuICAgIH0gZWxzZSBpZiAoY2xhc3NMaXN0LmNvbnRhaW5zKCdoYW5kbGVyJykgJiYgY2xhc3NMaXN0LmNvbnRhaW5zKCdyaWdodCcpKSB7XG4gICAgICBhY3Rpb24gPSAncmVzaXplUmlnaHQnO1xuICAgIH1cblxuICAgIHRoaXNbYF8ke2FjdGlvbn1gXShyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KTtcbiAgfVxuXG4gIF9tb3ZlKHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCBsYXllckhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQuaGVpZ2h0O1xuICAgIC8vIGN1cnJlbnQgdmFsdWVzXG4gICAgY29uc3QgeCA9IHJlbmRlcmluZ0NvbnRleHQueFNjYWxlKHNoYXBlLngoZGF0dW0pKTtcbiAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC55U2NhbGUoc2hhcGUueShkYXR1bSkpO1xuICAgIGNvbnN0IGhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQueVNjYWxlKHNoYXBlLmhlaWdodChkYXR1bSkpO1xuICAgIC8vIHRhcmdldCB2YWx1ZXNcbiAgICBsZXQgdGFyZ2V0WCA9IE1hdGgubWF4KHggKyBkeCwgMCk7XG4gICAgbGV0IHRhcmdldFkgPSB5IC0gZHk7XG5cbiAgICAvLyBsb2NrIGluIGxheWVyJ3MgeSBheGlzXG4gICAgaWYgKHRhcmdldFkgPCAwKSB7XG4gICAgICB0YXJnZXRZID0gMDtcbiAgICB9IGVsc2UgaWYgKHRhcmdldFkgKyBoZWlnaHQgPiBsYXllckhlaWdodCkge1xuICAgICAgdGFyZ2V0WSA9IGxheWVySGVpZ2h0IC0gaGVpZ2h0O1xuICAgIH1cblxuICAgIHNoYXBlLngoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQueFNjYWxlLmludmVydCh0YXJnZXRYKSk7XG4gICAgc2hhcGUueShkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC55U2NhbGUuaW52ZXJ0KHRhcmdldFkpKTtcbiAgfVxuXG4gIF9yZXNpemVMZWZ0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICAvLyBjdXJyZW50IHZhbHVlc1xuICAgIGNvbnN0IHggICAgID0gcmVuZGVyaW5nQ29udGV4dC54U2NhbGUoc2hhcGUueChkYXR1bSkpO1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC54U2NhbGUoc2hhcGUud2lkdGgoZGF0dW0pKTtcbiAgICAvLyB0YXJnZXQgdmFsdWVzXG4gICAgbGV0IG1heFRhcmdldFggID0geCArIHdpZHRoO1xuICAgIGxldCB0YXJnZXRYICAgICA9IHggKyBkeCA8IG1heFRhcmdldFggPyBNYXRoLm1heCh4ICsgZHgsIDApIDogeDtcbiAgICBsZXQgdGFyZ2V0V2lkdGggPSB0YXJnZXRYICE9PSAwID8gTWF0aC5tYXgod2lkdGggLSBkeCwgMSkgOiB3aWR0aDtcblxuICAgIHNoYXBlLngoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQueFNjYWxlLmludmVydCh0YXJnZXRYKSk7XG4gICAgc2hhcGUud2lkdGgoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQueFNjYWxlLmludmVydCh0YXJnZXRXaWR0aCkpO1xuICB9XG5cbiAgX3Jlc2l6ZVJpZ2h0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICAvLyBjdXJyZW50IHZhbHVlc1xuICAgIGNvbnN0IHdpZHRoID0gcmVuZGVyaW5nQ29udGV4dC54U2NhbGUoc2hhcGUud2lkdGgoZGF0dW0pKTtcbiAgICAvLyB0YXJnZXQgdmFsdWVzXG4gICAgbGV0IHRhcmdldFdpZHRoID0gTWF0aC5tYXgod2lkdGggKyBkeCwgMSk7XG5cbiAgICBzaGFwZS53aWR0aChkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC54U2NhbGUuaW52ZXJ0KHRhcmdldFdpZHRoKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZWdtZW50QmVoYXZpb3I7Il19