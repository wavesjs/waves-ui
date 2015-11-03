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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL2dyaWQtYXhpcy1sYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzZCQUFzQixvQkFBb0I7Ozs7MkJBQ3hCLGlCQUFpQjs7OztxQ0FDTCw2QkFBNkI7Ozs7Ozs7Ozs7SUFRdEMsYUFBYTtZQUFiLGFBQWE7Ozs7OztBQUlyQixXQUpRLGFBQWEsQ0FJcEIsT0FBTyxFQUFFOzBCQUpGLGFBQWE7O0FBSzlCLFdBQU8sR0FBRyxlQUFjO0FBQ3RCLFdBQUssRUFBRSxXQUFXO0FBQ2xCLFNBQUcsRUFBRSxFQUFFO0FBQ1AsZUFBUyxFQUFFLEtBQUs7S0FDakIsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFWiwrQkFYaUIsYUFBYSw2Q0FXeEIsd0NBQWtCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRTs7QUFFbEUsUUFBSSxDQUFDLGNBQWMsMkJBQVEsRUFBRSxFQUFFO0FBQzdCLFdBQUssRUFBRSxPQUFPLENBQUMsS0FBSztLQUNyQixDQUFDLENBQUM7R0FDSjs7U0FoQmtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6InNyYy9oZWxwZXJzL2dyaWQtYXhpcy1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBeGlzTGF5ZXIgZnJvbSAnLi4vYXhpcy9heGlzLWxheWVyJztcbmltcG9ydCBUaWNrcyBmcm9tICcuLi9zaGFwZXMvdGlja3MnO1xuaW1wb3J0IGdyaWRBeGlzR2VuZXJhdG9yIGZyb20gJy4uL2F4aXMvZ3JpZC1heGlzLWdlbmVyYXRvcic7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgZ3JpZCBsYXllclxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWF4aXMuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZEF4aXNMYXllciBleHRlbmRzIEF4aXNMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGNvbG9yOiAnc3RlZWxibHVlJyxcbiAgICAgIGJwbTogNjAsXG4gICAgICBzaWduYXR1cmU6ICc0LzQnXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICBzdXBlcihncmlkQXhpc0dlbmVyYXRvcihvcHRpb25zLmJwbSwgb3B0aW9ucy5zaWduYXR1cmUpLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoVGlja3MsIHt9LCB7XG4gICAgICBjb2xvcjogb3B0aW9ucy5jb2xvclxuICAgIH0pO1xuICB9XG59Il19