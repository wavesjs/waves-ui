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

/**
 * Helper to create a annotated marker layer
 *
 * [example usage](./examples/layer-marker.html)
 */

var AnnotatedMarkerLayer = (function (_Layer) {
  _inherits(AnnotatedMarkerLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @todo - Add accessors and options for the shape.
   */

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL2Fubm90YXRlZC1tYXJrZXItbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7cUNBQTRCLDRCQUE0Qjs7Ozt5QkFDdEMsZUFBZTs7Ozt1Q0FDTiw4QkFBOEI7Ozs7Ozs7Ozs7SUFRcEMsb0JBQW9CO1lBQXBCLG9CQUFvQjs7Ozs7Ozs7QUFNNUIsV0FOUSxvQkFBb0IsQ0FNM0IsSUFBSSxFQUFnQjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBTlgsb0JBQW9COztBQU9yQywrQkFQaUIsb0JBQW9CLDZDQU8vQixZQUFZLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTs7QUFFbkMsUUFBSSxDQUFDLGNBQWMsb0NBQWlCLENBQUM7QUFDckMsUUFBSSxDQUFDLFdBQVcsQ0FBQywwQ0FBb0IsQ0FBQyxDQUFDO0dBQ3hDOztTQVhrQixvQkFBb0I7OztxQkFBcEIsb0JBQW9CIiwiZmlsZSI6InNyYy9oZWxwZXJzL2Fubm90YXRlZC1tYXJrZXItbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQW5ub3RhdGVkTWFya2VyIGZyb20gJy4uL3NoYXBlcy9hbm5vdGF0ZWQtbWFya2VyJztcbmltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcbmltcG9ydCBNYXJrZXJCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvbWFya2VyLWJlaGF2aW9yJztcblxuXG4vKipcbiAqIEhlbHBlciB0byBjcmVhdGUgYSBhbm5vdGF0ZWQgbWFya2VyIGxheWVyXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItbWFya2VyLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFubm90YXRlZE1hcmtlckxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtBcnJheX0gZGF0YSAtIFRoZSBkYXRhIHRvIHJlbmRlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBBbiBvYmplY3QgdG8gY29uZmlndXJlIHRoZSBsYXllci5cbiAgICogQHRvZG8gLSBBZGQgYWNjZXNzb3JzIGFuZCBvcHRpb25zIGZvciB0aGUgc2hhcGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcignY29sbGVjdGlvbicsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShBbm5vdGF0ZWRNYXJrZXIpO1xuICAgIHRoaXMuc2V0QmVoYXZpb3IobmV3IE1hcmtlckJlaGF2aW9yKCkpO1xuICB9XG59XG4iXX0=