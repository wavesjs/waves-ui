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

    this.configureShape(Marker, {}, {
      displayHandler: options.displayHandler
    });
    this.setBehavior(new MarkerBehavior());
  }

  _inherits(MarkerLayer, _Layer);

  return MarkerLayer;
})(Layer);

module.exports = MarkerLayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9oZWxwZXJzL21hcmtlci1sYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBTyxLQUFLLDJCQUFNLGVBQWU7O0lBQzFCLE1BQU0sMkJBQU0sa0JBQWtCOztJQUM5QixjQUFjLDJCQUFNLDhCQUE4Qjs7SUFHcEMsV0FBVztBQUNuQixXQURRLFdBQVcsQ0FDbEIsSUFBSSxFQUFnQjtRQUFkLE9BQU8sZ0NBQUcsRUFBRTs7MEJBRFgsV0FBVzs7QUFFNUIscUNBRmlCLFdBQVcsNkNBRXRCLFlBQVksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFOztBQUVuQyxRQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUU7QUFDOUIsb0JBQWMsRUFBRSxPQUFPLENBQUMsY0FBYztLQUN2QyxDQUFDLENBQUM7QUFDSCxRQUFJLENBQUMsV0FBVyxDQUFDLElBQUksY0FBYyxFQUFFLENBQUMsQ0FBQztHQUN4Qzs7WUFSa0IsV0FBVzs7U0FBWCxXQUFXO0dBQVMsS0FBSzs7aUJBQXpCLFdBQVciLCJmaWxlIjoiZXM2L2hlbHBlcnMvbWFya2VyLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IE1hcmtlciBmcm9tICcuLi9zaGFwZXMvbWFya2VyJztcbmltcG9ydCBNYXJrZXJCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvbWFya2VyLWJlaGF2aW9yJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXJrZXJMYXllciBleHRlbmRzIExheWVyIHtcbiAgY29uc3RydWN0b3IoZGF0YSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoJ2NvbGxlY3Rpb24nLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoTWFya2VyLCB7fSwge1xuICAgICAgZGlzcGxheUhhbmRsZXI6IG9wdGlvbnMuZGlzcGxheUhhbmRsZXJcbiAgICB9KTtcbiAgICB0aGlzLnNldEJlaGF2aW9yKG5ldyBNYXJrZXJCZWhhdmlvcigpKTtcbiAgfVxufVxuIl19