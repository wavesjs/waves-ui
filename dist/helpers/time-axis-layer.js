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

var _axisTimeAxisGenerator = require('../axis/time-axis-generator');

var _axisTimeAxisGenerator2 = _interopRequireDefault(_axisTimeAxisGenerator);

var TimeAxisLayer = (function (_AxisLayer) {
  _inherits(TimeAxisLayer, _AxisLayer);

  function TimeAxisLayer(options) {
    _classCallCheck(this, TimeAxisLayer);

    options = _Object$assign({ color: 'steelblue' }, options);
    _get(Object.getPrototypeOf(TimeAxisLayer.prototype), 'constructor', this).call(this, (0, _axisTimeAxisGenerator2['default'])(), options);

    this.configureShape(_shapesTicks2['default'], {}, {
      color: options.color
    });
  }

  return TimeAxisLayer;
})(_axisAxisLayer2['default']);

exports['default'] = TimeAxisLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy93YXZlcy11aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzZCQUFzQixvQkFBb0I7Ozs7MkJBQ3hCLGlCQUFpQjs7OztxQ0FDTCw2QkFBNkI7Ozs7SUFHdEMsYUFBYTtZQUFiLGFBQWE7O0FBQ3JCLFdBRFEsYUFBYSxDQUNwQixPQUFPLEVBQUU7MEJBREYsYUFBYTs7QUFFOUIsV0FBTyxHQUFHLGVBQWMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDekQsK0JBSGlCLGFBQWEsNkNBR3hCLHlDQUFtQixFQUFFLE9BQU8sRUFBRTs7QUFFcEMsUUFBSSxDQUFDLGNBQWMsMkJBQVEsRUFBRSxFQUFFO0FBQzdCLFdBQUssRUFBRSxPQUFPLENBQUMsS0FBSztLQUNyQixDQUFDLENBQUM7R0FDSjs7U0FSa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoic3JjL3dhdmVzLXVpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEF4aXNMYXllciBmcm9tICcuLi9heGlzL2F4aXMtbGF5ZXInO1xuaW1wb3J0IFRpY2tzIGZyb20gJy4uL3NoYXBlcy90aWNrcyc7XG5pbXBvcnQgdGltZUF4aXNHZW5lcmF0b3IgZnJvbSAnLi4vYXhpcy90aW1lLWF4aXMtZ2VuZXJhdG9yJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lQXhpc0xheWVyIGV4dGVuZHMgQXhpc0xheWVyIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHsgY29sb3I6ICdzdGVlbGJsdWUnIH0sIG9wdGlvbnMpO1xuICAgIHN1cGVyKHRpbWVBeGlzR2VuZXJhdG9yKCksIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShUaWNrcywge30sIHtcbiAgICAgIGNvbG9yOiBvcHRpb25zLmNvbG9yXG4gICAgfSk7XG4gIH1cbn0iXX0=