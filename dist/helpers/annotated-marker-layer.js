'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _shapesAnnotatedMarker = require('../shapes/annotated-marker');

var _shapesAnnotatedMarker2 = _interopRequireDefault(_shapesAnnotatedMarker);

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _behaviorsMarkerBehavior = require('../behaviors/marker-behavior');

var _behaviorsMarkerBehavior2 = _interopRequireDefault(_behaviorsMarkerBehavior);

var AnnotatedMarkerLayer = (function (_Layer) {
  _inherits(AnnotatedMarkerLayer, _Layer);

  function AnnotatedMarkerLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, AnnotatedMarkerLayer);

    _get(Object.getPrototypeOf(AnnotatedMarkerLayer.prototype), 'constructor', this).call(this, 'collection', data, options);

    this.configureShape(_shapesAnnotatedMarker2['default']);
    this.setBehavior(new _behaviorsMarkerBehavior2['default']());
  }

  return AnnotatedMarkerLayer;
})(_coreLayer2['default']);

exports['default'] = AnnotatedMarkerLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7cUNBQTRCLDRCQUE0Qjs7Ozt5QkFDdEMsZUFBZTs7Ozt1Q0FDTiw4QkFBOEI7Ozs7SUFHcEMsb0JBQW9CO1lBQXBCLG9CQUFvQjs7QUFDNUIsV0FEUSxvQkFBb0IsQ0FDM0IsSUFBSSxFQUFnQjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBRFgsb0JBQW9COztBQUVyQywrQkFGaUIsb0JBQW9CLDZDQUUvQixZQUFZLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTs7QUFFbkMsUUFBSSxDQUFDLGNBQWMsb0NBQWlCLENBQUM7QUFDckMsUUFBSSxDQUFDLFdBQVcsQ0FBQywwQ0FBb0IsQ0FBQyxDQUFDO0dBQ3hDOztTQU5rQixvQkFBb0I7OztxQkFBcEIsb0JBQW9CIiwiZmlsZSI6InNyYy9zaGFwZXMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQW5ub3RhdGVkTWFya2VyIGZyb20gJy4uL3NoYXBlcy9hbm5vdGF0ZWQtbWFya2VyJztcbmltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcbmltcG9ydCBNYXJrZXJCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvbWFya2VyLWJlaGF2aW9yJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbm5vdGF0ZWRNYXJrZXJMYXllciBleHRlbmRzIExheWVyIHtcbiAgY29uc3RydWN0b3IoZGF0YSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoJ2NvbGxlY3Rpb24nLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoQW5ub3RhdGVkTWFya2VyKTtcbiAgICB0aGlzLnNldEJlaGF2aW9yKG5ldyBNYXJrZXJCZWhhdmlvcigpKTtcbiAgfVxufVxuIl19