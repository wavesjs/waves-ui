'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _axisAxisLayer = require('../axis/axis-layer');

var _axisAxisLayer2 = _interopRequireDefault(_axisAxisLayer);

var _shapesTicks = require('../shapes/ticks');

var _shapesTicks2 = _interopRequireDefault(_shapesTicks);

var _axisGridAxisGenerator = require('../axis/grid-axis-generator');

var _axisGridAxisGenerator2 = _interopRequireDefault(_axisGridAxisGenerator);

/**
 * Helper to create a grid layer
 *
 * [example usage](./examples/layer-axis.html)
 */

var GridAxisLayer = (function (_AxisLayer) {
  _inherits(GridAxisLayer, _AxisLayer);

  /**
   * @param {Object} options - An object to configure the layer.
   */

  function GridAxisLayer(options) {
    _classCallCheck(this, GridAxisLayer);

    options = _Object$assign({
      color: 'steelblue',
      bpm: 60,
      signature: '4/4'
    }, options);

    _get(Object.getPrototypeOf(GridAxisLayer.prototype), 'constructor', this).call(this, (0, _axisGridAxisGenerator2['default'])(options.bpm, options.signature), options);

    this.configureShape(_shapesTicks2['default'], {}, {
      color: options.color
    });
  }

  return GridAxisLayer;
})(_axisAxisLayer2['default']);

exports['default'] = GridAxisLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy91dGlscy9zY2FsZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs2QkFBc0Isb0JBQW9COzs7OzJCQUN4QixpQkFBaUI7Ozs7cUNBQ0wsNkJBQTZCOzs7Ozs7Ozs7O0lBUXRDLGFBQWE7WUFBYixhQUFhOzs7Ozs7QUFJckIsV0FKUSxhQUFhLENBSXBCLE9BQU8sRUFBRTswQkFKRixhQUFhOztBQUs5QixXQUFPLEdBQUcsZUFBYztBQUN0QixXQUFLLEVBQUUsV0FBVztBQUNsQixTQUFHLEVBQUUsRUFBRTtBQUNQLGVBQVMsRUFBRSxLQUFLO0tBQ2pCLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRVosK0JBWGlCLGFBQWEsNkNBV3hCLHdDQUFrQixPQUFPLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUU7O0FBRWxFLFFBQUksQ0FBQyxjQUFjLDJCQUFRLEVBQUUsRUFBRTtBQUM3QixXQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUs7S0FDckIsQ0FBQyxDQUFDO0dBQ0o7O1NBaEJrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJzcmMvdXRpbHMvc2NhbGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEF4aXNMYXllciBmcm9tICcuLi9heGlzL2F4aXMtbGF5ZXInO1xuaW1wb3J0IFRpY2tzIGZyb20gJy4uL3NoYXBlcy90aWNrcyc7XG5pbXBvcnQgZ3JpZEF4aXNHZW5lcmF0b3IgZnJvbSAnLi4vYXhpcy9ncmlkLWF4aXMtZ2VuZXJhdG9yJztcblxuXG4vKipcbiAqIEhlbHBlciB0byBjcmVhdGUgYSBncmlkIGxheWVyXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYXhpcy5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmlkQXhpc0xheWVyIGV4dGVuZHMgQXhpc0xheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgY29sb3I6ICdzdGVlbGJsdWUnLFxuICAgICAgYnBtOiA2MCxcbiAgICAgIHNpZ25hdHVyZTogJzQvNCdcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHN1cGVyKGdyaWRBeGlzR2VuZXJhdG9yKG9wdGlvbnMuYnBtLCBvcHRpb25zLnNpZ25hdHVyZSksIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShUaWNrcywge30sIHtcbiAgICAgIGNvbG9yOiBvcHRpb25zLmNvbG9yXG4gICAgfSk7XG4gIH1cbn0iXX0=