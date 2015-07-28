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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQU8sa0JBQWtCLDJCQUFNLGtDQUFrQzs7SUFDMUQsR0FBRywyQkFBTSxlQUFlOztJQUN4QixLQUFLLDJCQUFNLGVBQWU7O0lBR1osUUFBUTtBQUNoQixXQURRLFFBQVEsQ0FDZixJQUFJLEVBQWdCO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFEWCxRQUFROztBQUV6QixxQ0FGaUIsUUFBUSw2Q0FFbkIsWUFBWSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7O0FBRW5DLFFBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekIsUUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLGtCQUFrQixFQUFFLENBQUMsQ0FBQztHQUM1Qzs7WUFOa0IsUUFBUTs7U0FBUixRQUFRO0dBQVMsS0FBSzs7aUJBQXRCLFFBQVEiLCJmaWxlIjoiZXM2L3V0aWxzL29ydGhvZ29uYWwtZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCcmVha3BvaW50QmVoYXZpb3IgZnJvbSAnLi4vYmVoYXZpb3JzL2JyZWFrcG9pbnQtYmVoYXZpb3InO1xuaW1wb3J0IERvdCBmcm9tICcuLi9zaGFwZXMvZG90JztcbmltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3RMYXllciBleHRlbmRzIExheWVyIHtcbiAgY29uc3RydWN0b3IoZGF0YSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoJ2NvbGxlY3Rpb24nLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoRG90KTtcbiAgICB0aGlzLnNldEJlaGF2aW9yKG5ldyBCcmVha3BvaW50QmVoYXZpb3IoKSk7XG4gIH1cbn1cbiJdfQ==