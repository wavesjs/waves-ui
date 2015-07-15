"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var Layer = _interopRequire(require("../core/layer"));

var Marker = _interopRequire(require("../shapes/marker"));

var MarkerBehavior = _interopRequire(require("../behaviors/marker-behavior"));

var MarkerLayer = (function (_Layer) {
  function MarkerLayer(data) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, MarkerLayer);

    _get(_core.Object.getPrototypeOf(MarkerLayer.prototype), "constructor", this).call(this, "collection", data, options);
    this.configureShape(Marker);
    this.setBehavior(new MarkerBehavior());
  }

  _inherits(MarkerLayer, _Layer);

  return MarkerLayer;
})(Layer);

module.exports = MarkerLayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9oZWxwZXJzL3NlZ21lbnQtbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQU8sS0FBSywyQkFBTSxlQUFlOztJQUMxQixNQUFNLDJCQUFNLGtCQUFrQjs7SUFDOUIsY0FBYywyQkFBTSw4QkFBOEI7O0lBR3BDLFdBQVc7QUFDbkIsV0FEUSxXQUFXLENBQ2xCLElBQUksRUFBZ0I7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQURYLFdBQVc7O0FBRTVCLHFDQUZpQixXQUFXLDZDQUV0QixZQUFZLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBQztBQUNsQyxRQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLFFBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxjQUFjLEVBQUUsQ0FBQyxDQUFDO0dBQ3hDOztZQUxrQixXQUFXOztTQUFYLFdBQVc7R0FBUyxLQUFLOztpQkFBekIsV0FBVyIsImZpbGUiOiJlczYvaGVscGVycy9zZWdtZW50LWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IE1hcmtlciBmcm9tICcuLi9zaGFwZXMvbWFya2VyJztcbmltcG9ydCBNYXJrZXJCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvbWFya2VyLWJlaGF2aW9yJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXJrZXJMYXllciBleHRlbmRzIExheWVyIHtcbiAgY29uc3RydWN0b3IoZGF0YSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoJ2NvbGxlY3Rpb24nLCBkYXRhLCBvcHRpb25zKVxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoTWFya2VyKTtcbiAgICB0aGlzLnNldEJlaGF2aW9yKG5ldyBNYXJrZXJCZWhhdmlvcigpKTtcbiAgfVxufVxuIl19