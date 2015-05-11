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
      value: function edit(context, shape, datum, dx, dy, target) {
        var x = context.xScale(shape.x(datum));
        var targetX = x + dx > 0 ? x + dx : 0;

        shape.x(datum, context.xScale.invert(targetX));
      }
    }
  });

  return MarkerBehavior;
})(BaseBehavior);

module.exports = MarkerBehavior;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9iZWhhdmlvcnMvbWFya2VyLWJlaGF2aW9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7O0lBRTFDLGNBQWM7V0FBZCxjQUFjOzBCQUFkLGNBQWM7Ozs7Ozs7WUFBZCxjQUFjOztlQUFkLGNBQWM7QUFFbEIsUUFBSTthQUFBLGNBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUU7QUFDMUMsWUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDekMsWUFBSSxPQUFPLEdBQUcsQUFBQyxDQUFDLEdBQUcsRUFBRSxHQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFeEMsYUFBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztPQUNoRDs7OztTQVBHLGNBQWM7R0FBUyxZQUFZOztBQVV6QyxNQUFNLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQyIsImZpbGUiOiJlczYvYmVoYXZpb3JzL21hcmtlci1iZWhhdmlvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEJhc2VCZWhhdmlvciA9IHJlcXVpcmUoJy4vYmFzZS1iZWhhdmlvcicpO1xuXG5jbGFzcyBNYXJrZXJCZWhhdmlvciBleHRlbmRzIEJhc2VCZWhhdmlvciB7XG5cbiAgZWRpdChjb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgY29uc3QgeCA9IGNvbnRleHQueFNjYWxlKHNoYXBlLngoZGF0dW0pKTtcbiAgICBsZXQgdGFyZ2V0WCA9ICh4ICsgZHgpID4gMCA/IHggKyBkeCA6IDA7XG5cbiAgICBzaGFwZS54KGRhdHVtLCBjb250ZXh0LnhTY2FsZS5pbnZlcnQodGFyZ2V0WCkpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWFya2VyQmVoYXZpb3I7Il19