"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BreakpointBehavior = _interopRequire(require("../behaviors/breakpoint-behavior"));

var Dot = _interopRequire(require("../shapes/dot"));

var Layer = _interopRequire(require("../core/layer"));

var DotLayer = (function (_Layer) {
  function DotLayer(data) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, DotLayer);

    _get(_core.Object.getPrototypeOf(DotLayer.prototype), "constructor", this).call(this, "collection", data, options);

    this.configureShape(Dot);
    this.setBehavior(new BreakpointBehavior());
  }

  _inherits(DotLayer, _Layer);

  return DotLayer;
})(Layer);

module.exports = DotLayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9oZWxwZXJzL2RvdC1sYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBTyxrQkFBa0IsMkJBQU0sa0NBQWtDOztJQUMxRCxHQUFHLDJCQUFNLGVBQWU7O0lBQ3hCLEtBQUssMkJBQU0sZUFBZTs7SUFHWixRQUFRO0FBQ2hCLFdBRFEsUUFBUSxDQUNmLElBQUksRUFBZ0I7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQURYLFFBQVE7O0FBRXpCLHFDQUZpQixRQUFRLDZDQUVuQixZQUFZLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTs7QUFFbkMsUUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QixRQUFJLENBQUMsV0FBVyxDQUFDLElBQUksa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO0dBQzVDOztZQU5rQixRQUFROztTQUFSLFFBQVE7R0FBUyxLQUFLOztpQkFBdEIsUUFBUSIsImZpbGUiOiJlczYvaGVscGVycy9kb3QtbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQnJlYWtwb2ludEJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9icmVha3BvaW50LWJlaGF2aW9yJztcbmltcG9ydCBEb3QgZnJvbSAnLi4vc2hhcGVzL2RvdCc7XG5pbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG90TGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCdjb2xsZWN0aW9uJywgZGF0YSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKERvdCk7XG4gICAgdGhpcy5zZXRCZWhhdmlvcihuZXcgQnJlYWtwb2ludEJlaGF2aW9yKCkpO1xuICB9XG59XG4iXX0=