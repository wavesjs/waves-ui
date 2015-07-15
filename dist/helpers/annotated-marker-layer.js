"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var AnnotatedMarker = _interopRequire(require("../shapes/annotated-marker"));

var Layer = _interopRequire(require("../core/layer"));

var MarkerBehavior = _interopRequire(require("../behaviors/marker-behavior"));

var AnnotatedMarkerLayer = (function (_Layer) {
  function AnnotatedMarkerLayer(data) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, AnnotatedMarkerLayer);

    _get(_core.Object.getPrototypeOf(AnnotatedMarkerLayer.prototype), "constructor", this).call(this, "collection", data, options);
    this.configureShape(AnnotatedMarker);
    this.setBehavior(new MarkerBehavior());
  }

  _inherits(AnnotatedMarkerLayer, _Layer);

  return AnnotatedMarkerLayer;
})(Layer);

module.exports = AnnotatedMarkerLayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9oZWxwZXJzL3NlZ21lbnQtbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQU8sZUFBZSwyQkFBTSw0QkFBNEI7O0lBQ2pELEtBQUssMkJBQU0sZUFBZTs7SUFDMUIsY0FBYywyQkFBTSw4QkFBOEI7O0lBR3BDLG9CQUFvQjtBQUM1QixXQURRLG9CQUFvQixDQUMzQixJQUFJLEVBQWdCO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFEWCxvQkFBb0I7O0FBRXJDLHFDQUZpQixvQkFBb0IsNkNBRS9CLFlBQVksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFDO0FBQ2xDLFFBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDckMsUUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLGNBQWMsRUFBRSxDQUFDLENBQUM7R0FDeEM7O1lBTGtCLG9CQUFvQjs7U0FBcEIsb0JBQW9CO0dBQVMsS0FBSzs7aUJBQWxDLG9CQUFvQiIsImZpbGUiOiJlczYvaGVscGVycy9zZWdtZW50LWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFubm90YXRlZE1hcmtlciBmcm9tICcuLi9zaGFwZXMvYW5ub3RhdGVkLW1hcmtlcic7XG5pbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgTWFya2VyQmVoYXZpb3IgZnJvbSAnLi4vYmVoYXZpb3JzL21hcmtlci1iZWhhdmlvcic7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5ub3RhdGVkTWFya2VyTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCdjb2xsZWN0aW9uJywgZGF0YSwgb3B0aW9ucylcbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKEFubm90YXRlZE1hcmtlcik7XG4gICAgdGhpcy5zZXRCZWhhdmlvcihuZXcgTWFya2VyQmVoYXZpb3IoKSk7XG4gIH1cbn1cbiJdfQ==