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

var _shapesTicks = require('../shapes/ticks');

var _shapesTicks2 = _interopRequireDefault(_shapesTicks);

/**
 * Helper to create a tick layer. Can be seen as a grid axis with user defined data
 * or as a marker layer with entity based data.
 */

var TickLayer = (function (_Layer) {
  _inherits(TickLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */

  function TickLayer(data, options, accessors) {
    _classCallCheck(this, TickLayer);

    options = _Object$assign({}, options);

    _get(Object.getPrototypeOf(TickLayer.prototype), 'constructor', this).call(this, 'entity', data, options);

    var config = options.color ? { color: options.color } : undefined;
    this.configureShape(_shapesTicks2['default'], accessors, config);
  }

  return TickLayer;
})(_coreLayer2['default']);

exports['default'] = TickLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL3RpY2stbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBa0IsZUFBZTs7OzsyQkFDZixpQkFBaUI7Ozs7Ozs7OztJQU9kLFNBQVM7WUFBVCxTQUFTOzs7Ozs7Ozs7QUFPakIsV0FQUSxTQUFTLENBT2hCLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFOzBCQVBuQixTQUFTOztBQVExQixXQUFPLEdBQUcsZUFBYyxFQUV2QixFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUVaLCtCQVppQixTQUFTLDZDQVlwQixRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTs7QUFFL0IsUUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssR0FBRyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsU0FBUyxDQUFDO0FBQ3BFLFFBQUksQ0FBQyxjQUFjLDJCQUFRLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztHQUMvQzs7U0FoQmtCLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6InNyYy9oZWxwZXJzL3RpY2stbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgVGlja3MgZnJvbSAnLi4vc2hhcGVzL3RpY2tzJztcblxuXG4vKipcbiAqIEhlbHBlciB0byBjcmVhdGUgYSB0aWNrIGxheWVyLiBDYW4gYmUgc2VlbiBhcyBhIGdyaWQgYXhpcyB3aXRoIHVzZXIgZGVmaW5lZCBkYXRhXG4gKiBvciBhcyBhIG1hcmtlciBsYXllciB3aXRoIGVudGl0eSBiYXNlZCBkYXRhLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWNrTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhIC0gVGhlIGRhdGEgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYWNjZXNzb3JzIC0gVGhlIGFjY2Vzc29ycyB0byBjb25maWd1cmUgdGhlIG1hcHBpbmdcbiAgICogICAgYmV0d2VlbiBzaGFwZXMgYW5kIGRhdGEuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zLCBhY2Nlc3NvcnMpIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG5cbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHN1cGVyKCdlbnRpdHknLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IGNvbmZpZyA9IG9wdGlvbnMuY29sb3IgPyB7IGNvbG9yOiBvcHRpb25zLmNvbG9yIH0gOiB1bmRlZmluZWQ7XG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShUaWNrcywgYWNjZXNzb3JzLCBjb25maWcpO1xuICB9XG59Il19