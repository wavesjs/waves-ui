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
    var accessors = arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, DotLayer);

    _get(_core.Object.getPrototypeOf(DotLayer.prototype), "constructor", this).call(this, "collection", data, options);

    this.configureShape(Dot);
    this.setBehavior(new BreakpointBehavior());
  }

  _inherits(DotLayer, _Layer);

  return DotLayer;
})(Layer);

module.exports = DotLayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQU8sa0JBQWtCLDJCQUFNLGtDQUFrQzs7SUFDMUQsR0FBRywyQkFBTSxlQUFlOztJQUN4QixLQUFLLDJCQUFNLGVBQWU7O0lBR1osUUFBUTtBQUNoQixXQURRLFFBQVEsQ0FDZixJQUFJLEVBQWdDO1FBQTlCLE9BQU8sZ0NBQUcsRUFBRTtRQUFFLFNBQVMsZ0NBQUcsRUFBRTs7MEJBRDNCLFFBQVE7O0FBRXpCLHFDQUZpQixRQUFRLDZDQUVuQixZQUFZLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTs7QUFFbkMsUUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QixRQUFJLENBQUMsV0FBVyxDQUFDLElBQUksa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO0dBQzVDOztZQU5rQixRQUFROztTQUFSLFFBQVE7R0FBUyxLQUFLOztpQkFBdEIsUUFBUSIsImZpbGUiOiJlczYvdXRpbHMvb3J0aG9nb25hbC1kYXRhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJyZWFrcG9pbnRCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvYnJlYWtwb2ludC1iZWhhdmlvcic7XG5pbXBvcnQgRG90IGZyb20gJy4uL3NoYXBlcy9kb3QnO1xuaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvdExheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30sIGFjY2Vzc29ycyA9IHt9KSB7XG4gICAgc3VwZXIoJ2NvbGxlY3Rpb24nLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoRG90KTtcbiAgICB0aGlzLnNldEJlaGF2aW9yKG5ldyBCcmVha3BvaW50QmVoYXZpb3IoKSk7XG4gIH1cbn1cbiJdfQ==