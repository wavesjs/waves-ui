'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesMarker = require('../shapes/marker');

var _shapesMarker2 = _interopRequireDefault(_shapesMarker);

var _behaviorsMarkerBehavior = require('../behaviors/marker-behavior');

var _behaviorsMarkerBehavior2 = _interopRequireDefault(_behaviorsMarkerBehavior);

var MarkerLayer = (function (_Layer) {
  function MarkerLayer(data) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, MarkerLayer);

    _get(Object.getPrototypeOf(MarkerLayer.prototype), 'constructor', this).call(this, 'collection', data, options);

    this.configureShape(_shapesMarker2['default'], {}, {
      displayHandler: options.displayHandler
    });
    this.setBehavior(new _behaviorsMarkerBehavior2['default']());
  }

  _inherits(MarkerLayer, _Layer);

  return MarkerLayer;
})(_coreLayer2['default']);

exports['default'] = MarkerLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBa0IsZUFBZTs7Ozs0QkFDZCxrQkFBa0I7Ozs7dUNBQ1YsOEJBQThCOzs7O0lBR3BDLFdBQVc7QUFDbkIsV0FEUSxXQUFXLENBQ2xCLElBQUksRUFBZ0I7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQURYLFdBQVc7O0FBRTVCLCtCQUZpQixXQUFXLDZDQUV0QixZQUFZLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTs7QUFFbkMsUUFBSSxDQUFDLGNBQWMsNEJBQVMsRUFBRSxFQUFFO0FBQzlCLG9CQUFjLEVBQUUsT0FBTyxDQUFDLGNBQWM7S0FDdkMsQ0FBQyxDQUFDO0FBQ0gsUUFBSSxDQUFDLFdBQVcsQ0FBQywwQ0FBb0IsQ0FBQyxDQUFDO0dBQ3hDOztZQVJrQixXQUFXOztTQUFYLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6ImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgTWFya2VyIGZyb20gJy4uL3NoYXBlcy9tYXJrZXInO1xuaW1wb3J0IE1hcmtlckJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9tYXJrZXItYmVoYXZpb3InO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcmtlckxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcignY29sbGVjdGlvbicsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShNYXJrZXIsIHt9LCB7XG4gICAgICBkaXNwbGF5SGFuZGxlcjogb3B0aW9ucy5kaXNwbGF5SGFuZGxlclxuICAgIH0pO1xuICAgIHRoaXMuc2V0QmVoYXZpb3IobmV3IE1hcmtlckJlaGF2aW9yKCkpO1xuICB9XG59XG4iXX0=