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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQU8sZUFBZSwyQkFBTSw0QkFBNEI7O0lBQ2pELEtBQUssMkJBQU0sZUFBZTs7SUFDMUIsY0FBYywyQkFBTSw4QkFBOEI7O0lBR3BDLG9CQUFvQjtBQUM1QixXQURRLG9CQUFvQixDQUMzQixJQUFJLEVBQWdCO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFEWCxvQkFBb0I7O0FBRXJDLHFDQUZpQixvQkFBb0IsNkNBRS9CLFlBQVksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFOztBQUVuQyxRQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3JDLFFBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxjQUFjLEVBQUUsQ0FBQyxDQUFDO0dBQ3hDOztZQU5rQixvQkFBb0I7O1NBQXBCLG9CQUFvQjtHQUFTLEtBQUs7O2lCQUFsQyxvQkFBb0IiLCJmaWxlIjoiZXM2L3V0aWxzL29ydGhvZ29uYWwtZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBbm5vdGF0ZWRNYXJrZXIgZnJvbSAnLi4vc2hhcGVzL2Fubm90YXRlZC1tYXJrZXInO1xuaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IE1hcmtlckJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9tYXJrZXItYmVoYXZpb3InO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFubm90YXRlZE1hcmtlckxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcignY29sbGVjdGlvbicsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShBbm5vdGF0ZWRNYXJrZXIpO1xuICAgIHRoaXMuc2V0QmVoYXZpb3IobmV3IE1hcmtlckJlaGF2aW9yKCkpO1xuICB9XG59XG4iXX0=