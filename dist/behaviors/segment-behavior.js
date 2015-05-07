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

      value: function edit(shape, datum, dx, dy, target) {
        var action = "move";
        var classList = target.classList;

        if (classList.contains("handler") && classList.contains("left")) {
          action = "resizeLeft";
        } else if (classList.contains("handler") && classList.contains("right")) {
          action = "resizeRight";
        }

        this["_" + action](shape, datum, dx, dy, target);
      }
    },
    _move: {
      value: function _move(shape, datum, dx, dy, target) {
        var ctx = this._layer.context;
        var layerHeight = ctx.params.height;
        // current values
        var x = ctx.xScale(shape.x(datum));
        var y = ctx.yScale(shape.y(datum));
        var height = ctx.yScale(shape.height(datum));
        // define targets
        var targetX = x + dx;
        var targetY = y - dy;

        // if something to lock, do it here
        // lock in layer's y axis
        if (targetY < 0) {
          targetY = 0;
        } else if (targetY + height > layerHeight) {
          targetY = layerHeight - height;
        }

        shape.x(datum, ctx.xScale.invert(targetX));
        shape.y(datum, ctx.yScale.invert(targetY));
      }
    },
    _resizeLeft: {
      value: function _resizeLeft(shape, datum, dx, dy, target) {
        var ctx = this._layer.context;
        // current values
        var x = ctx.xScale(shape.x(datum));
        var width = ctx.xScale(shape.width(datum));
        // define targets
        var targetX = x + dx;
        var targetWidth = width - dx;

        // if something to lock, do it here
        targetWidth = Math.max(targetWidth, 1);

        shape.x(datum, ctx.xScale.invert(targetX));
        shape.width(datum, ctx.xScale.invert(targetWidth));
      }
    },
    _resizeRight: {
      value: function _resizeRight(shape, datum, dx, dy, target) {
        var ctx = this._layer.context;
        // current values
        var width = ctx.xScale(shape.width(datum));
        // define targets
        var targetWidth = width + dx;

        // if something to lock, do it here
        targetWidth = Math.max(targetWidth, 1);

        shape.width(datum, ctx.xScale.invert(targetWidth));
      }
    }
  });

  return SegmentBehavior;
})(BaseBehavior);

module.exports = SegmentBehavior;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9iZWhhdmlvcnMvc2VnbWVudC1iZWhhdmlvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOztJQUUxQyxlQUFlO1dBQWYsZUFBZTswQkFBZixlQUFlOzs7Ozs7O1lBQWYsZUFBZTs7ZUFBZixlQUFlO0FBR25CLFFBQUk7OzthQUFBLGNBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtBQUNqQyxZQUFJLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDcEIsWUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQzs7QUFFbkMsWUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDL0QsZ0JBQU0sR0FBRyxZQUFZLENBQUM7U0FDdkIsTUFBTSxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUN2RSxnQkFBTSxHQUFHLGFBQWEsQ0FBQztTQUN4Qjs7QUFFRCxZQUFJLE9BQUssTUFBTSxDQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQ2xEOztBQUVELFNBQUs7YUFBQSxlQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7QUFDbEMsWUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDaEMsWUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7O0FBRXRDLFlBQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLFlBQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLFlBQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUUvQyxZQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFlBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7Ozs7QUFJckIsWUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO0FBQ2YsaUJBQU8sR0FBRyxDQUFDLENBQUM7U0FDYixNQUFNLElBQUksT0FBTyxHQUFHLE1BQU0sR0FBRyxXQUFXLEVBQUU7QUFDekMsaUJBQU8sR0FBRyxXQUFXLEdBQUcsTUFBTSxDQUFBO1NBQy9COztBQUVELGFBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDM0MsYUFBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztPQUM1Qzs7QUFFRCxlQUFXO2FBQUEscUJBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtBQUN4QyxZQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQzs7QUFFaEMsWUFBTSxDQUFDLEdBQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDekMsWUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7O0FBRTdDLFlBQUksT0FBTyxHQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDekIsWUFBSSxXQUFXLEdBQUcsS0FBSyxHQUFHLEVBQUUsQ0FBQzs7O0FBRzdCLG1CQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRXZDLGFBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDM0MsYUFBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztPQUNwRDs7QUFFRCxnQkFBWTthQUFBLHNCQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7QUFDekMsWUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7O0FBRWhDLFlBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUU3QyxZQUFJLFdBQVcsR0FBRyxLQUFLLEdBQUcsRUFBRSxDQUFDOzs7QUFHN0IsbUJBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFdkMsYUFBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztPQUNwRDs7OztTQWxFRyxlQUFlO0dBQVMsWUFBWTs7QUFxRTFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsZUFBZSxDQUFDIiwiZmlsZSI6ImVzNi9iZWhhdmlvcnMvc2VnbWVudC1iZWhhdmlvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEJhc2VCZWhhdmlvciA9IHJlcXVpcmUoJy4vYmFzZS1iZWhhdmlvcicpO1xuXG5jbGFzcyBTZWdtZW50QmVoYXZpb3IgZXh0ZW5kcyBCYXNlQmVoYXZpb3Ige1xuICAvLyBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgZWRpdChzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgbGV0IGFjdGlvbiA9ICdtb3ZlJztcbiAgICBjb25zdCBjbGFzc0xpc3QgPSB0YXJnZXQuY2xhc3NMaXN0O1xuXG4gICAgaWYgKGNsYXNzTGlzdC5jb250YWlucygnaGFuZGxlcicpICYmIGNsYXNzTGlzdC5jb250YWlucygnbGVmdCcpKSB7XG4gICAgICBhY3Rpb24gPSAncmVzaXplTGVmdCc7XG4gICAgfSBlbHNlIGlmIChjbGFzc0xpc3QuY29udGFpbnMoJ2hhbmRsZXInKSAmJiBjbGFzc0xpc3QuY29udGFpbnMoJ3JpZ2h0JykpIHtcbiAgICAgIGFjdGlvbiA9ICdyZXNpemVSaWdodCc7XG4gICAgfVxuXG4gICAgdGhpc1tgXyR7YWN0aW9ufWBdKHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpO1xuICB9XG5cbiAgX21vdmUoc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuX2xheWVyLmNvbnRleHQ7XG4gICAgY29uc3QgbGF5ZXJIZWlnaHQgPSBjdHgucGFyYW1zLmhlaWdodDtcbiAgICAvLyBjdXJyZW50IHZhbHVlc1xuICAgIGNvbnN0IHggPSBjdHgueFNjYWxlKHNoYXBlLngoZGF0dW0pKTtcbiAgICBjb25zdCB5ID0gY3R4LnlTY2FsZShzaGFwZS55KGRhdHVtKSk7XG4gICAgY29uc3QgaGVpZ2h0ID0gY3R4LnlTY2FsZShzaGFwZS5oZWlnaHQoZGF0dW0pKTtcbiAgICAvLyBkZWZpbmUgdGFyZ2V0c1xuICAgIGxldCB0YXJnZXRYID0geCArIGR4O1xuICAgIGxldCB0YXJnZXRZID0geSAtIGR5O1xuXG4gICAgLy8gaWYgc29tZXRoaW5nIHRvIGxvY2ssIGRvIGl0IGhlcmVcbiAgICAvLyBsb2NrIGluIGxheWVyJ3MgeSBheGlzXG4gICAgaWYgKHRhcmdldFkgPCAwKSB7XG4gICAgICB0YXJnZXRZID0gMDtcbiAgICB9IGVsc2UgaWYgKHRhcmdldFkgKyBoZWlnaHQgPiBsYXllckhlaWdodCkge1xuICAgICAgdGFyZ2V0WSA9IGxheWVySGVpZ2h0IC0gaGVpZ2h0XG4gICAgfVxuXG4gICAgc2hhcGUueChkYXR1bSwgY3R4LnhTY2FsZS5pbnZlcnQodGFyZ2V0WCkpO1xuICAgIHNoYXBlLnkoZGF0dW0sIGN0eC55U2NhbGUuaW52ZXJ0KHRhcmdldFkpKTtcbiAgfVxuXG4gIF9yZXNpemVMZWZ0KHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLl9sYXllci5jb250ZXh0O1xuICAgIC8vIGN1cnJlbnQgdmFsdWVzXG4gICAgY29uc3QgeCAgICAgPSBjdHgueFNjYWxlKHNoYXBlLngoZGF0dW0pKTtcbiAgICBjb25zdCB3aWR0aCA9IGN0eC54U2NhbGUoc2hhcGUud2lkdGgoZGF0dW0pKTtcbiAgICAvLyBkZWZpbmUgdGFyZ2V0c1xuICAgIGxldCB0YXJnZXRYICAgICA9IHggKyBkeDtcbiAgICBsZXQgdGFyZ2V0V2lkdGggPSB3aWR0aCAtIGR4O1xuXG4gICAgLy8gaWYgc29tZXRoaW5nIHRvIGxvY2ssIGRvIGl0IGhlcmVcbiAgICB0YXJnZXRXaWR0aCA9IE1hdGgubWF4KHRhcmdldFdpZHRoLCAxKTtcblxuICAgIHNoYXBlLngoZGF0dW0sIGN0eC54U2NhbGUuaW52ZXJ0KHRhcmdldFgpKTtcbiAgICBzaGFwZS53aWR0aChkYXR1bSwgY3R4LnhTY2FsZS5pbnZlcnQodGFyZ2V0V2lkdGgpKTtcbiAgfVxuXG4gIF9yZXNpemVSaWdodChzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5fbGF5ZXIuY29udGV4dDtcbiAgICAvLyBjdXJyZW50IHZhbHVlc1xuICAgIGNvbnN0IHdpZHRoID0gY3R4LnhTY2FsZShzaGFwZS53aWR0aChkYXR1bSkpO1xuICAgIC8vIGRlZmluZSB0YXJnZXRzXG4gICAgbGV0IHRhcmdldFdpZHRoID0gd2lkdGggKyBkeDtcblxuICAgIC8vIGlmIHNvbWV0aGluZyB0byBsb2NrLCBkbyBpdCBoZXJlXG4gICAgdGFyZ2V0V2lkdGggPSBNYXRoLm1heCh0YXJnZXRXaWR0aCwgMSk7XG5cbiAgICBzaGFwZS53aWR0aChkYXR1bSwgY3R4LnhTY2FsZS5pbnZlcnQodGFyZ2V0V2lkdGgpKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlZ21lbnRCZWhhdmlvcjsiXX0=