"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var BaseBehavior = require("./base-behavior");

var MarkerBehavior = (function (_BaseBehavior) {
  function MarkerBehavior() {
    _classCallCheck(this, MarkerBehavior);

    if (_BaseBehavior != null) {
      _BaseBehavior.apply(this, arguments);
    }
  }

  _inherits(MarkerBehavior, _BaseBehavior);

  _createClass(MarkerBehavior, {
    edit: {
      value: function edit(shape, datum, dx, dy, target) {
        var ctx = this._layer.context;
        var x = ctx.xScale(shape.x(datum));
        var targetX = x + dx > 0 ? x + dx : 0;

        shape.x(datum, ctx.xScale.invert(targetX));
      }
    }
  });

  return MarkerBehavior;
})(BaseBehavior);

module.exports = MarkerBehavior;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9iZWhhdmlvcnMvbWFya2VyLWJlaGF2aW9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7O0lBRTFDLGNBQWM7V0FBZCxjQUFjOzBCQUFkLGNBQWM7Ozs7Ozs7WUFBZCxjQUFjOztlQUFkLGNBQWM7QUFFbEIsUUFBSTthQUFBLGNBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTtBQUNqQyxZQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUNoQyxZQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNyQyxZQUFJLE9BQU8sR0FBRyxBQUFDLENBQUMsR0FBRyxFQUFFLEdBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUV4QyxhQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO09BQzVDOzs7O1NBUkcsY0FBYztHQUFTLFlBQVk7O0FBV3pDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDIiwiZmlsZSI6ImVzNi9iZWhhdmlvcnMvbWFya2VyLWJlaGF2aW9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQmFzZUJlaGF2aW9yID0gcmVxdWlyZSgnLi9iYXNlLWJlaGF2aW9yJyk7XG5cbmNsYXNzIE1hcmtlckJlaGF2aW9yIGV4dGVuZHMgQmFzZUJlaGF2aW9yIHtcblxuICBlZGl0KHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLl9sYXllci5jb250ZXh0O1xuICAgIGNvbnN0IHggPSBjdHgueFNjYWxlKHNoYXBlLngoZGF0dW0pKTtcbiAgICBsZXQgdGFyZ2V0WCA9ICh4ICsgZHgpID4gMCA/IHggKyBkeCA6IDA7XG5cbiAgICBzaGFwZS54KGRhdHVtLCBjdHgueFNjYWxlLmludmVydCh0YXJnZXRYKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNYXJrZXJCZWhhdmlvcjsiXX0=