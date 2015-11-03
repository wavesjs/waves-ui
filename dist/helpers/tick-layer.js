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

var TickLayer = (function (_Layer) {
  _inherits(TickLayer, _Layer);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy93YXZlcy11aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUFrQixlQUFlOzs7OzJCQUNmLGlCQUFpQjs7OztJQUdkLFNBQVM7WUFBVCxTQUFTOztBQUNqQixXQURRLFNBQVMsQ0FDaEIsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUU7MEJBRG5CLFNBQVM7O0FBRTFCLFdBQU8sR0FBRyxlQUFjLEVBRXZCLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRVosK0JBTmlCLFNBQVMsNkNBTXBCLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFOztBQUUvQixRQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsS0FBSyxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxTQUFTLENBQUM7QUFDcEUsUUFBSSxDQUFDLGNBQWMsMkJBQVEsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0dBQy9DOztTQVZrQixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiJzcmMvd2F2ZXMtdWkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgVGlja3MgZnJvbSAnLi4vc2hhcGVzL3RpY2tzJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWNrTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMsIGFjY2Vzc29ycykge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcblxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgc3VwZXIoJ2VudGl0eScsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgY29uZmlnID0gb3B0aW9ucy5jb2xvciA/IHsgY29sb3I6IG9wdGlvbnMuY29sb3IgfSA6IHVuZGVmaW5lZDtcbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKFRpY2tzLCBhY2Nlc3NvcnMsIGNvbmZpZyk7XG4gIH1cbn0iXX0=