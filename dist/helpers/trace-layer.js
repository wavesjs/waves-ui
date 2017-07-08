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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL3RyYWNlLWxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBQWtCLGVBQWU7Ozs7K0JBQ1gsc0JBQXNCOzs7OytCQUN0QixzQkFBc0I7Ozs7c0NBQ2xCLDZCQUE2Qjs7Ozs7Ozs7OztJQVFsQyxVQUFVO1lBQVYsVUFBVTs7Ozs7Ozs7O0FBT2xCLFdBUFEsVUFBVSxDQU9qQixJQUFJLEVBQWdDO1FBQTlCLE9BQU8seURBQUcsRUFBRTtRQUFFLFNBQVMseURBQUcsRUFBRTs7MEJBUDNCLFVBQVU7O0FBUTNCLFdBQU8sR0FBRyxlQUFjLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3hELCtCQVRpQixVQUFVLDZDQVNyQixPQUFPLENBQUMsV0FBVyxHQUFHLFlBQVksR0FBRyxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTs7QUFFcEUsUUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLFFBQUksT0FBTyxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7QUFBRSxrQkFBWSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO0tBQUU7QUFDcEYsUUFBSSxPQUFPLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRTtBQUFFLGtCQUFZLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7S0FBRTtBQUN2RixRQUFJLE9BQU8sQ0FBQyxXQUFXLEtBQUssU0FBUyxFQUFFO0FBQUUsa0JBQVksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQztLQUFFOztBQUUxRixRQUFJLE9BQU8sQ0FBQyxXQUFXLEVBQUU7QUFDdkIsVUFBSSxDQUFDLG9CQUFvQiwrQkFBWSxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDOUQsVUFBSSxDQUFDLGNBQWMsK0JBQVksU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO0tBQ3pELE1BQU07QUFDTCxVQUFJLENBQUMsY0FBYywrQkFBWSxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7S0FDekQ7O0FBRUQsUUFBSSxDQUFDLFdBQVcsQ0FBQyx5Q0FBbUIsQ0FBQyxDQUFDO0dBQ3ZDOztTQXhCa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoic3JjL2hlbHBlcnMvdHJhY2UtbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgVHJhY2VQYXRoIGZyb20gJy4uL3NoYXBlcy90cmFjZS1wYXRoJztcbmltcG9ydCBUcmFjZURvdHMgZnJvbSAnLi4vc2hhcGVzL3RyYWNlLWRvdHMnO1xuaW1wb3J0IFRyYWNlQmVoYXZpb3IgZnJvbSAnLi4vYmVoYXZpb3JzL3RyYWNlLWJlaGF2aW9yJztcblxuXG4vKipcbiAqIEhlbHBlciB0byBjcmVhdGUgYSB0cmFjZSBsYXllci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci10cmFjZS5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFjZUxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtBcnJheX0gZGF0YSAtIFRoZSBkYXRhIHRvIHJlbmRlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBBbiBvYmplY3QgdG8gY29uZmlndXJlIHRoZSBsYXllci5cbiAgICogQHBhcmFtIHtPYmplY3R9IGFjY2Vzc29ycyAtIFRoZSBhY2Nlc3NvcnMgdG8gY29uZmlndXJlIHRoZSBtYXBwaW5nXG4gICAqICAgIGJldHdlZW4gc2hhcGVzIGFuZCBkYXRhLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YSwgb3B0aW9ucyA9IHt9LCBhY2Nlc3NvcnMgPSB7fSkge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHsgZGlzcGxheURvdHM6IHRydWUgfSwgb3B0aW9ucyk7XG4gICAgc3VwZXIob3B0aW9ucy5kaXNwbGF5RG90cyA/ICdjb2xsZWN0aW9uJyA6ICdlbnRpdHknLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IHNoYXBlT3B0aW9ucyA9IHt9O1xuICAgIGlmIChvcHRpb25zLm1lYW5Db2xvciAhPT0gdW5kZWZpbmVkKSB7IHNoYXBlT3B0aW9ucy5tZWFuQ29sb3IgPSBvcHRpb25zLm1lYW5Db2xvcjsgfVxuICAgIGlmIChvcHRpb25zLnJhbmdlQ29sb3IgIT09IHVuZGVmaW5lZCkgeyBzaGFwZU9wdGlvbnMucmFuZ2VDb2xvciA9IG9wdGlvbnMucmFuZ2VDb2xvcjsgfVxuICAgIGlmIChvcHRpb25zLmRpc3BsYXlNZWFuICE9PSB1bmRlZmluZWQpIHsgc2hhcGVPcHRpb25zLmRpc3BsYXlNZWFuID0gb3B0aW9ucy5kaXNwbGF5TWVhbjsgfVxuXG4gICAgaWYgKG9wdGlvbnMuZGlzcGxheURvdHMpIHtcbiAgICAgIHRoaXMuY29uZmlndXJlQ29tbW9uU2hhcGUoVHJhY2VQYXRoLCBhY2Nlc3NvcnMsIHNoYXBlT3B0aW9ucyk7XG4gICAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKFRyYWNlRG90cywgYWNjZXNzb3JzLCBzaGFwZU9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKFRyYWNlUGF0aCwgYWNjZXNzb3JzLCBzaGFwZU9wdGlvbnMpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0QmVoYXZpb3IobmV3IFRyYWNlQmVoYXZpb3IoKSk7XG4gIH1cbn0iXX0=