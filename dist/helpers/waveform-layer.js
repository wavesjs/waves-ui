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
  color: 'steelblue'
};

var WaveformLayer = (function (_Layer) {
  _inherits(WaveformLayer, _Layer);

  function WaveformLayer(buffer, options) {
    _classCallCheck(this, WaveformLayer);

    options = _Object$assign({}, defaults, options);

    _get(Object.getPrototypeOf(WaveformLayer.prototype), 'constructor', this).call(this, 'entity', buffer.getChannelData(options.channel), options);

    this.configureShape(_shapesWaveform2['default'], {
      y: function y(d) {
        var v = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        if (v !== null) {
          d = v;
        }
        return d;
      }
    }, {
      sampleRate: buffer.sampleRate,
      color: options.color
    });
  }

  return WaveformLayer;
})(_coreLayer2['default']);

exports['default'] = WaveformLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9oZWxwZXJzL3dhdmVmb3JtLWxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBQWtCLGVBQWU7Ozs7OEJBQ1osb0JBQW9COzs7O0FBR3pDLElBQU0sUUFBUSxHQUFHO0FBQ2YsU0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2hCLFNBQU8sRUFBRSxDQUFDO0FBQ1YsT0FBSyxFQUFFLFdBQVc7Q0FDbkIsQ0FBQzs7SUFFbUIsYUFBYTtZQUFiLGFBQWE7O0FBQ3JCLFdBRFEsYUFBYSxDQUNwQixNQUFNLEVBQUUsT0FBTyxFQUFFOzBCQURWLGFBQWE7O0FBRTlCLFdBQU8sR0FBRyxlQUFjLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRS9DLCtCQUppQixhQUFhLDZDQUl4QixRQUFRLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFOztBQUVqRSxRQUFJLENBQUMsY0FBYyw4QkFBVztBQUM1QixPQUFDLEVBQUUsV0FBUyxDQUFDLEVBQVk7WUFBVixDQUFDLHlEQUFHLElBQUk7O0FBQ3JCLFlBQUksQ0FBQyxLQUFLLElBQUksRUFBRTtBQUFFLFdBQUMsR0FBRyxDQUFDLENBQUM7U0FBRTtBQUMxQixlQUFPLENBQUMsQ0FBQztPQUNWO0tBQ0YsRUFBRTtBQUNELGdCQUFVLEVBQUUsTUFBTSxDQUFDLFVBQVU7QUFDN0IsV0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO0tBQ3JCLENBQUMsQ0FBQztHQUNKOztTQWZrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJlczYvaGVscGVycy93YXZlZm9ybS1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcbmltcG9ydCBXYXZlZm9ybSBmcm9tICcuLi9zaGFwZXMvd2F2ZWZvcm0nO1xuXG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICB5RG9tYWluOiBbLTEsIDFdLFxuICBjaGFubmVsOiAwLFxuICBjb2xvcjogJ3N0ZWVsYmx1ZSdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhdmVmb3JtTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKGJ1ZmZlciwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICBzdXBlcignZW50aXR5JywgYnVmZmVyLmdldENoYW5uZWxEYXRhKG9wdGlvbnMuY2hhbm5lbCksIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShXYXZlZm9ybSwge1xuICAgICAgeTogZnVuY3Rpb24oZCwgdiA9IG51bGwpIHtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpIHsgZCA9IHY7IH1cbiAgICAgICAgcmV0dXJuIGQ7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgc2FtcGxlUmF0ZTogYnVmZmVyLnNhbXBsZVJhdGUsXG4gICAgICBjb2xvcjogb3B0aW9ucy5jb2xvclxuICAgIH0pO1xuICB9XG59XG4iXX0=