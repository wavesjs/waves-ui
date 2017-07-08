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
      displayHandlers: options.displayHandlers,
      opacity: options.opacity
    });

    this.setBehavior(new _behaviorsMarkerBehavior2['default']());
  }

  return MarkerLayer;
})(_coreLayer2['default']);

exports['default'] = MarkerLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL21hcmtlci1sYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUFrQixlQUFlOzs7OzRCQUNkLGtCQUFrQjs7Ozt1Q0FDViw4QkFBOEI7Ozs7Ozs7Ozs7SUFRcEMsV0FBVztZQUFYLFdBQVc7Ozs7Ozs7OztBQU9uQixXQVBRLFdBQVcsQ0FPbEIsSUFBSSxFQUFnQztRQUE5QixPQUFPLHlEQUFHLEVBQUU7UUFBRSxTQUFTLHlEQUFHLEVBQUU7OzBCQVAzQixXQUFXOztBQVE1QiwrQkFSaUIsV0FBVyw2Q0FRdEIsWUFBWSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7O0FBRW5DLFdBQU8sR0FBRyxlQUFjLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzVELFFBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7QUFDNUIsUUFBSSxLQUFLLEVBQUU7QUFDVCxlQUFTLENBQUMsS0FBSyxHQUFHLFlBQVc7QUFBRSxlQUFPLEtBQUssQ0FBQztPQUFFLENBQUM7S0FDaEQ7O0FBRUQsUUFBSSxDQUFDLGNBQWMsNEJBQVMsU0FBUyxFQUFFO0FBQ3JDLHFCQUFlLEVBQUUsT0FBTyxDQUFDLGVBQWU7QUFDeEMsYUFBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPO0tBQ3pCLENBQUMsQ0FBQzs7QUFFSCxRQUFJLENBQUMsV0FBVyxDQUFDLDBDQUFvQixDQUFDLENBQUM7R0FDeEM7O1NBdEJrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiJzcmMvaGVscGVycy9tYXJrZXItbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgTWFya2VyIGZyb20gJy4uL3NoYXBlcy9tYXJrZXInO1xuaW1wb3J0IE1hcmtlckJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9tYXJrZXItYmVoYXZpb3InO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIG1hcmtlciBsYXllci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1icmVha3BvaW50Lmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcmtlckxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtBcnJheX0gZGF0YSAtIFRoZSBkYXRhIHRvIHJlbmRlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBBbiBvYmplY3QgdG8gY29uZmlndXJlIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtPYmplY3R9IGFjY2Vzc29ycyAtIFRoZSBhY2Nlc3NvcnMgdG8gY29uZmlndXJlIHRoZSBtYXBwaW5nXG4gICAqICAgIGJldHdlZW4gc2hhcGVzIGFuZCBkYXRhLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YSwgb3B0aW9ucyA9IHt9LCBhY2Nlc3NvcnMgPSB7fSkge1xuICAgIHN1cGVyKCdjb2xsZWN0aW9uJywgZGF0YSwgb3B0aW9ucyk7XG5cbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGRpc3BsYXlIYW5kbGVyczogdHJ1ZSB9LCBvcHRpb25zKTtcbiAgICBjb25zdCBjb2xvciA9IG9wdGlvbnMuY29sb3I7XG4gICAgaWYgKGNvbG9yKSB7XG4gICAgICBhY2Nlc3NvcnMuY29sb3IgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGNvbG9yOyB9O1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoTWFya2VyLCBhY2Nlc3NvcnMsIHtcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogb3B0aW9ucy5kaXNwbGF5SGFuZGxlcnMsXG4gICAgICBvcGFjaXR5OiBvcHRpb25zLm9wYWNpdHksXG4gICAgfSk7XG5cbiAgICB0aGlzLnNldEJlaGF2aW9yKG5ldyBNYXJrZXJCZWhhdmlvcigpKTtcbiAgfVxufVxuIl19