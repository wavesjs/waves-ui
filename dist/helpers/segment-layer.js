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
    var accessors = arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, SegmentLayer);

    _get(_core.Object.getPrototypeOf(SegmentLayer.prototype), "constructor", this).call(this, "collection", data, options);

    this.configureShape(Segment, {}, {
      displayHandlers: options.displayHandlers
    });

    this.setBehavior(new SegmentBehavior());
  }

  _inherits(SegmentLayer, _Layer);

  return SegmentLayer;
})(Layer);

module.exports = SegmentLayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQU8sS0FBSywyQkFBTSxlQUFlOztJQUMxQixPQUFPLDJCQUFNLG1CQUFtQjs7SUFDaEMsZUFBZSwyQkFBTSwrQkFBK0I7O0lBR3RDLFlBQVk7QUFDcEIsV0FEUSxZQUFZLENBQ25CLElBQUksRUFBZ0M7UUFBOUIsT0FBTyxnQ0FBRyxFQUFFO1FBQUUsU0FBUyxnQ0FBRyxFQUFFOzswQkFEM0IsWUFBWTs7QUFFN0IscUNBRmlCLFlBQVksNkNBRXZCLFlBQVksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFOztBQUVuQyxRQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUU7QUFDL0IscUJBQWUsRUFBRSxPQUFPLENBQUMsZUFBZTtLQUN6QyxDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLGVBQWUsRUFBRSxDQUFDLENBQUM7R0FDekM7O1lBVGtCLFlBQVk7O1NBQVosWUFBWTtHQUFTLEtBQUs7O2lCQUExQixZQUFZIiwiZmlsZSI6ImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgU2VnbWVudCBmcm9tICcuLi9zaGFwZXMvc2VnbWVudCc7XG5pbXBvcnQgU2VnbWVudEJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9zZWdtZW50LWJlaGF2aW9yJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWdtZW50TGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSwgYWNjZXNzb3JzID0ge30pIHtcbiAgICBzdXBlcignY29sbGVjdGlvbicsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShTZWdtZW50LCB7fSwge1xuICAgICAgZGlzcGxheUhhbmRsZXJzOiBvcHRpb25zLmRpc3BsYXlIYW5kbGVyc1xuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRCZWhhdmlvcihuZXcgU2VnbWVudEJlaGF2aW9yKCkpO1xuICB9XG59XG4iXX0=