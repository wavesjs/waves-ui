'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesMarker = require('../shapes/marker');

var _shapesMarker2 = _interopRequireDefault(_shapesMarker);

var _behaviorsMarkerBehavior = require('../behaviors/marker-behavior');

var _behaviorsMarkerBehavior2 = _interopRequireDefault(_behaviorsMarkerBehavior);

/**
 * Helper to create a marker layer.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */

var MarkerLayer = (function (_Layer) {
  _inherits(MarkerLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */

  function MarkerLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var accessors = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, MarkerLayer);

    _get(Object.getPrototypeOf(MarkerLayer.prototype), 'constructor', this).call(this, 'collection', data, options);

    options = _Object$assign({ displayHandlers: true }, options);
    var color = options.color;
    if (color) {
      accessors.color = function () {
        return color;
      };
    }

    this.configureShape(_shapesMarker2['default'], accessors, {
      displayHandlers: options.displayHandlers
    });

    this.setBehavior(new _behaviorsMarkerBehavior2['default']());
  }

  return MarkerLayer;
})(_coreLayer2['default']);

exports['default'] = MarkerLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy91dGlscy9zY2FsZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBa0IsZUFBZTs7Ozs0QkFDZCxrQkFBa0I7Ozs7dUNBQ1YsOEJBQThCOzs7Ozs7Ozs7O0lBUXBDLFdBQVc7WUFBWCxXQUFXOzs7Ozs7Ozs7QUFPbkIsV0FQUSxXQUFXLENBT2xCLElBQUksRUFBZ0M7UUFBOUIsT0FBTyx5REFBRyxFQUFFO1FBQUUsU0FBUyx5REFBRyxFQUFFOzswQkFQM0IsV0FBVzs7QUFRNUIsK0JBUmlCLFdBQVcsNkNBUXRCLFlBQVksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFOztBQUVuQyxXQUFPLEdBQUcsZUFBYyxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM1RCxRQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO0FBQzVCLFFBQUksS0FBSyxFQUFFO0FBQ1QsZUFBUyxDQUFDLEtBQUssR0FBRyxZQUFXO0FBQUUsZUFBTyxLQUFLLENBQUM7T0FBRSxDQUFDO0tBQ2hEOztBQUVELFFBQUksQ0FBQyxjQUFjLDRCQUFTLFNBQVMsRUFBRTtBQUNyQyxxQkFBZSxFQUFFLE9BQU8sQ0FBQyxlQUFlO0tBQ3pDLENBQUMsQ0FBQzs7QUFFSCxRQUFJLENBQUMsV0FBVyxDQUFDLDBDQUFvQixDQUFDLENBQUM7R0FDeEM7O1NBckJrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiJzcmMvdXRpbHMvc2NhbGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IE1hcmtlciBmcm9tICcuLi9zaGFwZXMvbWFya2VyJztcbmltcG9ydCBNYXJrZXJCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvbWFya2VyLWJlaGF2aW9yJztcblxuXG4vKipcbiAqIEhlbHBlciB0byBjcmVhdGUgYSBtYXJrZXIgbGF5ZXIuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYnJlYWtwb2ludC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXJrZXJMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGRhdGEgLSBUaGUgZGF0YSB0byByZW5kZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhY2Nlc3NvcnMgLSBUaGUgYWNjZXNzb3JzIHRvIGNvbmZpZ3VyZSB0aGUgbWFwcGluZ1xuICAgKiAgICBiZXR3ZWVuIHNoYXBlcyBhbmQgZGF0YS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSwgYWNjZXNzb3JzID0ge30pIHtcbiAgICBzdXBlcignY29sbGVjdGlvbicsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyBkaXNwbGF5SGFuZGxlcnM6IHRydWUgfSwgb3B0aW9ucyk7XG4gICAgY29uc3QgY29sb3IgPSBvcHRpb25zLmNvbG9yO1xuICAgIGlmIChjb2xvcikge1xuICAgICAgYWNjZXNzb3JzLmNvbG9yID0gZnVuY3Rpb24oKSB7IHJldHVybiBjb2xvcjsgfTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKE1hcmtlciwgYWNjZXNzb3JzLCB7XG4gICAgICBkaXNwbGF5SGFuZGxlcnM6IG9wdGlvbnMuZGlzcGxheUhhbmRsZXJzXG4gICAgfSk7XG5cbiAgICB0aGlzLnNldEJlaGF2aW9yKG5ldyBNYXJrZXJCZWhhdmlvcigpKTtcbiAgfVxufVxuIl19