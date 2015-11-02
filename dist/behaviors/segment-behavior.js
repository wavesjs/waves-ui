'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseBehavior = require('./base-behavior');

var _baseBehavior2 = _interopRequireDefault(_baseBehavior);

/**
 * Defines the default behavior for a segment.
 */

var SegmentBehavior = (function (_BaseBehavior) {
  _inherits(SegmentBehavior, _BaseBehavior);

  function SegmentBehavior() {
    _classCallCheck(this, SegmentBehavior);

    _get(Object.getPrototypeOf(SegmentBehavior.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SegmentBehavior, [{
    key: 'edit',
    value: function edit(renderingContext, shape, datum, dx, dy, target) {
      var classList = target.classList;
      var action = 'move';

      if (classList.contains('handler') && classList.contains('left')) {
        action = 'resizeLeft';
      } else if (classList.contains('handler') && classList.contains('right')) {
        action = 'resizeRight';
      }

      this['_' + action](renderingContext, shape, datum, dx, dy, target);
    }
  }, {
    key: '_move',
    value: function _move(renderingContext, shape, datum, dx, dy, target) {
      var layerHeight = renderingContext.height;
      // current values
      var x = renderingContext.timeToPixel(shape.x(datum));
      var y = renderingContext.valueToPixel(shape.y(datum));
      var height = renderingContext.valueToPixel(shape.height(datum));
      // target values
      var targetX = Math.max(x + dx, 0);
      var targetY = y - dy;

      // lock in layer's y axis
      if (targetY < 0) {
        targetY = 0;
      } else if (targetY + height > layerHeight) {
        targetY = layerHeight - height;
      }

      shape.x(datum, renderingContext.timeToPixel.invert(targetX));
      shape.y(datum, renderingContext.valueToPixel.invert(targetY));
    }
  }, {
    key: '_resizeLeft',
    value: function _resizeLeft(renderingContext, shape, datum, dx, dy, target) {
      // current values
      var x = renderingContext.timeToPixel(shape.x(datum));
      var width = renderingContext.timeToPixel(shape.width(datum));
      // target values
      var maxTargetX = x + width;
      var targetX = x + dx < maxTargetX ? Math.max(x + dx, 0) : x;
      var targetWidth = targetX !== 0 ? Math.max(width - dx, 1) : width;

      shape.x(datum, renderingContext.timeToPixel.invert(targetX));
      shape.width(datum, renderingContext.timeToPixel.invert(targetWidth));
    }
  }, {
    key: '_resizeRight',
    value: function _resizeRight(renderingContext, shape, datum, dx, dy, target) {
      // current values
      var width = renderingContext.timeToPixel(shape.width(datum));
      // target values
      var targetWidth = Math.max(width + dx, 1);

      shape.width(datum, renderingContext.timeToPixel.invert(targetWidth));
    }
  }]);

  return SegmentBehavior;
})(_baseBehavior2['default']);

exports['default'] = SegmentBehavior;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9iZWhhdmlvcnMvc2VnbWVudC1iZWhhdmlvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzRCQUF5QixpQkFBaUI7Ozs7Ozs7O0lBTXJCLGVBQWU7WUFBZixlQUFlOztXQUFmLGVBQWU7MEJBQWYsZUFBZTs7K0JBQWYsZUFBZTs7O2VBQWYsZUFBZTs7V0FDOUIsY0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFO0FBQ25ELFVBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDbkMsVUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUVwQixVQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUMvRCxjQUFNLEdBQUcsWUFBWSxDQUFDO09BQ3ZCLE1BQU0sSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDdkUsY0FBTSxHQUFHLGFBQWEsQ0FBQztPQUN4Qjs7QUFFRCxVQUFJLE9BQUssTUFBTSxDQUFHLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ3BFOzs7V0FFSSxlQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7QUFDcEQsVUFBTSxXQUFXLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDOztBQUU1QyxVQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELFVBQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDeEQsVUFBTSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFbEUsVUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFVBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7OztBQUdyQixVQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUU7QUFDZixlQUFPLEdBQUcsQ0FBQyxDQUFDO09BQ2IsTUFBTSxJQUFJLE9BQU8sR0FBRyxNQUFNLEdBQUcsV0FBVyxFQUFFO0FBQ3pDLGVBQU8sR0FBRyxXQUFXLEdBQUcsTUFBTSxDQUFDO09BQ2hDOztBQUVELFdBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUM3RCxXQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FDL0Q7OztXQUVVLHFCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7O0FBRTFELFVBQU0sQ0FBQyxHQUFPLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDM0QsVUFBTSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFL0QsVUFBSSxVQUFVLEdBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUM1QixVQUFJLE9BQU8sR0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hFLFVBQUksV0FBVyxHQUFHLE9BQU8sS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQzs7QUFFbEUsV0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQzdELFdBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztLQUN0RTs7O1dBRVcsc0JBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTs7QUFFM0QsVUFBTSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFL0QsVUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUUxQyxXQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7S0FDdEU7OztTQXZEa0IsZUFBZTs7O3FCQUFmLGVBQWUiLCJmaWxlIjoic3JjL2JlaGF2aW9ycy9zZWdtZW50LWJlaGF2aW9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VCZWhhdmlvciBmcm9tICcuL2Jhc2UtYmVoYXZpb3InO1xuXG5cbi8qKlxuICogRGVmaW5lcyB0aGUgZGVmYXVsdCBiZWhhdmlvciBmb3IgYSBzZWdtZW50LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWdtZW50QmVoYXZpb3IgZXh0ZW5kcyBCYXNlQmVoYXZpb3Ige1xuICBlZGl0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCBjbGFzc0xpc3QgPSB0YXJnZXQuY2xhc3NMaXN0O1xuICAgIGxldCBhY3Rpb24gPSAnbW92ZSc7XG5cbiAgICBpZiAoY2xhc3NMaXN0LmNvbnRhaW5zKCdoYW5kbGVyJykgJiYgY2xhc3NMaXN0LmNvbnRhaW5zKCdsZWZ0JykpIHtcbiAgICAgIGFjdGlvbiA9ICdyZXNpemVMZWZ0JztcbiAgICB9IGVsc2UgaWYgKGNsYXNzTGlzdC5jb250YWlucygnaGFuZGxlcicpICYmIGNsYXNzTGlzdC5jb250YWlucygncmlnaHQnKSkge1xuICAgICAgYWN0aW9uID0gJ3Jlc2l6ZVJpZ2h0JztcbiAgICB9XG5cbiAgICB0aGlzW2BfJHthY3Rpb259YF0ocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCk7XG4gIH1cblxuICBfbW92ZShyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgY29uc3QgbGF5ZXJIZWlnaHQgPSByZW5kZXJpbmdDb250ZXh0LmhlaWdodDtcbiAgICAvLyBjdXJyZW50IHZhbHVlc1xuICAgIGNvbnN0IHggPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLngoZGF0dW0pKTtcbiAgICBjb25zdCB5ID0gcmVuZGVyaW5nQ29udGV4dC52YWx1ZVRvUGl4ZWwoc2hhcGUueShkYXR1bSkpO1xuICAgIGNvbnN0IGhlaWdodCA9IHJlbmRlcmluZ0NvbnRleHQudmFsdWVUb1BpeGVsKHNoYXBlLmhlaWdodChkYXR1bSkpO1xuICAgIC8vIHRhcmdldCB2YWx1ZXNcbiAgICBsZXQgdGFyZ2V0WCA9IE1hdGgubWF4KHggKyBkeCwgMCk7XG4gICAgbGV0IHRhcmdldFkgPSB5IC0gZHk7XG5cbiAgICAvLyBsb2NrIGluIGxheWVyJ3MgeSBheGlzXG4gICAgaWYgKHRhcmdldFkgPCAwKSB7XG4gICAgICB0YXJnZXRZID0gMDtcbiAgICB9IGVsc2UgaWYgKHRhcmdldFkgKyBoZWlnaHQgPiBsYXllckhlaWdodCkge1xuICAgICAgdGFyZ2V0WSA9IGxheWVySGVpZ2h0IC0gaGVpZ2h0O1xuICAgIH1cblxuICAgIHNoYXBlLngoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpKTtcbiAgICBzaGFwZS55KGRhdHVtLCByZW5kZXJpbmdDb250ZXh0LnZhbHVlVG9QaXhlbC5pbnZlcnQodGFyZ2V0WSkpO1xuICB9XG5cbiAgX3Jlc2l6ZUxlZnQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldCkge1xuICAgIC8vIGN1cnJlbnQgdmFsdWVzXG4gICAgY29uc3QgeCAgICAgPSByZW5kZXJpbmdDb250ZXh0LnRpbWVUb1BpeGVsKHNoYXBlLngoZGF0dW0pKTtcbiAgICBjb25zdCB3aWR0aCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2hhcGUud2lkdGgoZGF0dW0pKTtcbiAgICAvLyB0YXJnZXQgdmFsdWVzXG4gICAgbGV0IG1heFRhcmdldFggID0geCArIHdpZHRoO1xuICAgIGxldCB0YXJnZXRYICAgICA9IHggKyBkeCA8IG1heFRhcmdldFggPyBNYXRoLm1heCh4ICsgZHgsIDApIDogeDtcbiAgICBsZXQgdGFyZ2V0V2lkdGggPSB0YXJnZXRYICE9PSAwID8gTWF0aC5tYXgod2lkdGggLSBkeCwgMSkgOiB3aWR0aDtcblxuICAgIHNoYXBlLngoZGF0dW0sIHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHRhcmdldFgpKTtcbiAgICBzaGFwZS53aWR0aChkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0V2lkdGgpKTtcbiAgfVxuXG4gIF9yZXNpemVSaWdodChyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgLy8gY3VycmVudCB2YWx1ZXNcbiAgICBjb25zdCB3aWR0aCA9IHJlbmRlcmluZ0NvbnRleHQudGltZVRvUGl4ZWwoc2hhcGUud2lkdGgoZGF0dW0pKTtcbiAgICAvLyB0YXJnZXQgdmFsdWVzXG4gICAgbGV0IHRhcmdldFdpZHRoID0gTWF0aC5tYXgod2lkdGggKyBkeCwgMSk7XG5cbiAgICBzaGFwZS53aWR0aChkYXR1bSwgcmVuZGVyaW5nQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodGFyZ2V0V2lkdGgpKTtcbiAgfVxufVxuIl19