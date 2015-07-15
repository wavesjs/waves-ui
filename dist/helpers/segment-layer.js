"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var Layer = _interopRequire(require("../core/layer"));

var Segment = _interopRequire(require("../shapes/segment"));

var SegmentBehavior = _interopRequire(require("../behaviors/segment-behavior"));

var SegmentLayer = (function (_Layer) {
  function SegmentLayer(data) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, SegmentLayer);

    _get(_core.Object.getPrototypeOf(SegmentLayer.prototype), "constructor", this).call(this, "collection", data, options);
    this.configureShape(Segment);
    this.setBehavior(new SegmentBehavior());
  }

  _inherits(SegmentLayer, _Layer);

  return SegmentLayer;
})(Layer);

module.exports = SegmentLayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9oZWxwZXJzL3NlZ21lbnQtbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQU8sS0FBSywyQkFBTSxlQUFlOztJQUMxQixPQUFPLDJCQUFNLG1CQUFtQjs7SUFDaEMsZUFBZSwyQkFBTSwrQkFBK0I7O0lBR3RDLFlBQVk7QUFDcEIsV0FEUSxZQUFZLENBQ25CLElBQUksRUFBZ0I7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQURYLFlBQVk7O0FBRTdCLHFDQUZpQixZQUFZLDZDQUV2QixZQUFZLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBQztBQUNsQyxRQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLFFBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxlQUFlLEVBQUUsQ0FBQyxDQUFDO0dBQ3pDOztZQUxrQixZQUFZOztTQUFaLFlBQVk7R0FBUyxLQUFLOztpQkFBMUIsWUFBWSIsImZpbGUiOiJlczYvaGVscGVycy9zZWdtZW50LWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IFNlZ21lbnQgZnJvbSAnLi4vc2hhcGVzL3NlZ21lbnQnO1xuaW1wb3J0IFNlZ21lbnRCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvc2VnbWVudC1iZWhhdmlvcic7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VnbWVudExheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcignY29sbGVjdGlvbicsIGRhdGEsIG9wdGlvbnMpXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShTZWdtZW50KTtcbiAgICB0aGlzLnNldEJlaGF2aW9yKG5ldyBTZWdtZW50QmVoYXZpb3IoKSk7XG4gIH1cbn1cbiJdfQ==