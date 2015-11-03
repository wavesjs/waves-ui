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

var _shapesWaveform = require('../shapes/waveform');

var _shapesWaveform2 = _interopRequireDefault(_shapesWaveform);

var defaults = {
  yDomain: [-1, 1],
  channel: 0,
  color: 'steelblue',
  renderingStrategy: 'svg'
};

var WaveformLayer = (function (_Layer) {
  _inherits(WaveformLayer, _Layer);

  function WaveformLayer(buffer, options) {
    _classCallCheck(this, WaveformLayer);

    options = _Object$assign({}, defaults, options);

    _get(Object.getPrototypeOf(WaveformLayer.prototype), 'constructor', this).call(this, 'entity', buffer.getChannelData(options.channel), options);

    this.configureShape(_shapesWaveform2['default'], {}, {
      sampleRate: buffer.sampleRate,
      color: options.color,
      renderingStrategy: options.renderingStrategy
    });
  }

  return WaveformLayer;
})(_coreLayer2['default']);

exports['default'] = WaveformLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBa0IsZUFBZTs7Ozs4QkFDWixvQkFBb0I7Ozs7QUFHekMsSUFBTSxRQUFRLEdBQUc7QUFDZixTQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDaEIsU0FBTyxFQUFFLENBQUM7QUFDVixPQUFLLEVBQUUsV0FBVztBQUNsQixtQkFBaUIsRUFBRSxLQUFLO0NBQ3pCLENBQUM7O0lBRW1CLGFBQWE7WUFBYixhQUFhOztBQUNyQixXQURRLGFBQWEsQ0FDcEIsTUFBTSxFQUFFLE9BQU8sRUFBRTswQkFEVixhQUFhOztBQUU5QixXQUFPLEdBQUcsZUFBYyxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUUvQywrQkFKaUIsYUFBYSw2Q0FJeEIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRTs7QUFFakUsUUFBSSxDQUFDLGNBQWMsOEJBQVcsRUFBRSxFQUFFO0FBQ2hDLGdCQUFVLEVBQUUsTUFBTSxDQUFDLFVBQVU7QUFDN0IsV0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO0FBQ3BCLHVCQUFpQixFQUFFLE9BQU8sQ0FBQyxpQkFBaUI7S0FDN0MsQ0FBQyxDQUFDO0dBQ0o7O1NBWGtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6InNyYy9zaGFwZXMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgV2F2ZWZvcm0gZnJvbSAnLi4vc2hhcGVzL3dhdmVmb3JtJztcblxuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgeURvbWFpbjogWy0xLCAxXSxcbiAgY2hhbm5lbDogMCxcbiAgY29sb3I6ICdzdGVlbGJsdWUnLFxuICByZW5kZXJpbmdTdHJhdGVneTogJ3N2Zydcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhdmVmb3JtTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKGJ1ZmZlciwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICBzdXBlcignZW50aXR5JywgYnVmZmVyLmdldENoYW5uZWxEYXRhKG9wdGlvbnMuY2hhbm5lbCksIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShXYXZlZm9ybSwge30sIHtcbiAgICAgIHNhbXBsZVJhdGU6IGJ1ZmZlci5zYW1wbGVSYXRlLFxuICAgICAgY29sb3I6IG9wdGlvbnMuY29sb3IsXG4gICAgICByZW5kZXJpbmdTdHJhdGVneTogb3B0aW9ucy5yZW5kZXJpbmdTdHJhdGVneVxuICAgIH0pO1xuICB9XG59XG4iXX0=