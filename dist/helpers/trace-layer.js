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

var _shapesTracePath = require('../shapes/trace-path');

var _shapesTracePath2 = _interopRequireDefault(_shapesTracePath);

var _shapesTraceDots = require('../shapes/trace-dots');

var _shapesTraceDots2 = _interopRequireDefault(_shapesTraceDots);

var _behaviorsTraceBehavior = require('../behaviors/trace-behavior');

var _behaviorsTraceBehavior2 = _interopRequireDefault(_behaviorsTraceBehavior);

/**
 * Helper to create a trace layer.
 *
 * [example usage](./examples/layer-trace.html)
 */

var TraceLayer = (function (_Layer) {
  _inherits(TraceLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */

  function TraceLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var accessors = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, TraceLayer);

    options = _Object$assign({ displayDots: true }, options);
    _get(Object.getPrototypeOf(TraceLayer.prototype), 'constructor', this).call(this, options.displayDots ? 'collection' : 'entity', data, options);

    var shapeOptions = {};
    if (options.meanColor !== undefined) {
      shapeOptions.meanColor = options.meanColor;
    }
    if (options.rangeColor !== undefined) {
      shapeOptions.rangeColor = options.rangeColor;
    }
    if (options.displayMean !== undefined) {
      shapeOptions.displayMean = options.displayMean;
    }

    if (options.displayDots) {
      this.configureCommonShape(_shapesTracePath2['default'], accessors, shapeOptions);
      this.configureShape(_shapesTraceDots2['default'], accessors, shapeOptions);
    } else {
      this.configureShape(_shapesTracePath2['default'], accessors, shapeOptions);
    }

    this.setBehavior(new _behaviorsTraceBehavior2['default']());
  }

  return TraceLayer;
})(_coreLayer2['default']);

exports['default'] = TraceLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy91dGlscy9zY2FsZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBa0IsZUFBZTs7OzsrQkFDWCxzQkFBc0I7Ozs7K0JBQ3RCLHNCQUFzQjs7OztzQ0FDbEIsNkJBQTZCOzs7Ozs7Ozs7O0lBUWxDLFVBQVU7WUFBVixVQUFVOzs7Ozs7Ozs7QUFPbEIsV0FQUSxVQUFVLENBT2pCLElBQUksRUFBZ0M7UUFBOUIsT0FBTyx5REFBRyxFQUFFO1FBQUUsU0FBUyx5REFBRyxFQUFFOzswQkFQM0IsVUFBVTs7QUFRM0IsV0FBTyxHQUFHLGVBQWMsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDeEQsK0JBVGlCLFVBQVUsNkNBU3JCLE9BQU8sQ0FBQyxXQUFXLEdBQUcsWUFBWSxHQUFHLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFOztBQUVwRSxRQUFNLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDeEIsUUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtBQUFFLGtCQUFZLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7S0FBRTtBQUNwRixRQUFJLE9BQU8sQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFO0FBQUUsa0JBQVksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztLQUFFO0FBQ3ZGLFFBQUksT0FBTyxDQUFDLFdBQVcsS0FBSyxTQUFTLEVBQUU7QUFBRSxrQkFBWSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO0tBQUU7O0FBRTFGLFFBQUksT0FBTyxDQUFDLFdBQVcsRUFBRTtBQUN2QixVQUFJLENBQUMsb0JBQW9CLCtCQUFZLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUM5RCxVQUFJLENBQUMsY0FBYywrQkFBWSxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7S0FDekQsTUFBTTtBQUNMLFVBQUksQ0FBQyxjQUFjLCtCQUFZLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztLQUN6RDs7QUFFRCxRQUFJLENBQUMsV0FBVyxDQUFDLHlDQUFtQixDQUFDLENBQUM7R0FDdkM7O1NBeEJrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiJzcmMvdXRpbHMvc2NhbGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IFRyYWNlUGF0aCBmcm9tICcuLi9zaGFwZXMvdHJhY2UtcGF0aCc7XG5pbXBvcnQgVHJhY2VEb3RzIGZyb20gJy4uL3NoYXBlcy90cmFjZS1kb3RzJztcbmltcG9ydCBUcmFjZUJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy90cmFjZS1iZWhhdmlvcic7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgdHJhY2UgbGF5ZXIuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItdHJhY2UuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2VMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGRhdGEgLSBUaGUgZGF0YSB0byByZW5kZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhY2Nlc3NvcnMgLSBUaGUgYWNjZXNzb3JzIHRvIGNvbmZpZ3VyZSB0aGUgbWFwcGluZ1xuICAgKiAgICBiZXR3ZWVuIHNoYXBlcyBhbmQgZGF0YS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSwgYWNjZXNzb3JzID0ge30pIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGRpc3BsYXlEb3RzOiB0cnVlIH0sIG9wdGlvbnMpO1xuICAgIHN1cGVyKG9wdGlvbnMuZGlzcGxheURvdHMgPyAnY29sbGVjdGlvbicgOiAnZW50aXR5JywgZGF0YSwgb3B0aW9ucyk7XG5cbiAgICBjb25zdCBzaGFwZU9wdGlvbnMgPSB7fTtcbiAgICBpZiAob3B0aW9ucy5tZWFuQ29sb3IgIT09IHVuZGVmaW5lZCkgeyBzaGFwZU9wdGlvbnMubWVhbkNvbG9yID0gb3B0aW9ucy5tZWFuQ29sb3I7IH1cbiAgICBpZiAob3B0aW9ucy5yYW5nZUNvbG9yICE9PSB1bmRlZmluZWQpIHsgc2hhcGVPcHRpb25zLnJhbmdlQ29sb3IgPSBvcHRpb25zLnJhbmdlQ29sb3I7IH1cbiAgICBpZiAob3B0aW9ucy5kaXNwbGF5TWVhbiAhPT0gdW5kZWZpbmVkKSB7IHNoYXBlT3B0aW9ucy5kaXNwbGF5TWVhbiA9IG9wdGlvbnMuZGlzcGxheU1lYW47IH1cblxuICAgIGlmIChvcHRpb25zLmRpc3BsYXlEb3RzKSB7XG4gICAgICB0aGlzLmNvbmZpZ3VyZUNvbW1vblNoYXBlKFRyYWNlUGF0aCwgYWNjZXNzb3JzLCBzaGFwZU9wdGlvbnMpO1xuICAgICAgdGhpcy5jb25maWd1cmVTaGFwZShUcmFjZURvdHMsIGFjY2Vzc29ycywgc2hhcGVPcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb25maWd1cmVTaGFwZShUcmFjZVBhdGgsIGFjY2Vzc29ycywgc2hhcGVPcHRpb25zKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldEJlaGF2aW9yKG5ldyBUcmFjZUJlaGF2aW9yKCkpO1xuICB9XG59Il19