"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var Layer = _interopRequire(require("../core/layer"));

var Waveform = _interopRequire(require("../shapes/waveform"));

var defaults = {
  yDomain: [-1, 1],
  channel: 0,
  color: "steelblue"
};

var WaveformLayer = (function (_Layer) {
  function WaveformLayer(buffer, options) {
    _classCallCheck(this, WaveformLayer);

    options = _core.Object.assign({}, defaults, options);

    _get(_core.Object.getPrototypeOf(WaveformLayer.prototype), "constructor", this).call(this, "entity", buffer.getChannelData(options.channel), options);

    this.configureShape(Waveform, {
      y: function y(d) {
        var v = arguments[1] === undefined ? null : arguments[1];

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

  _inherits(WaveformLayer, _Layer);

  return WaveformLayer;
})(Layer);

module.exports = WaveformLayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9oZWxwZXJzL3dhdmVmb3JtLWxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFPLEtBQUssMkJBQU0sZUFBZTs7SUFDMUIsUUFBUSwyQkFBTSxvQkFBb0I7O0FBR3pDLElBQU0sUUFBUSxHQUFHO0FBQ2YsU0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2hCLFNBQU8sRUFBRSxDQUFDO0FBQ1YsT0FBSyxFQUFFLFdBQVc7Q0FDbkIsQ0FBQzs7SUFFbUIsYUFBYTtBQUNyQixXQURRLGFBQWEsQ0FDcEIsTUFBTSxFQUFFLE9BQU8sRUFBRTswQkFEVixhQUFhOztBQUU5QixXQUFPLEdBQUcsTUFBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRS9DLHFDQUppQixhQUFhLDZDQUl4QixRQUFRLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFOztBQUVqRSxRQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRTtBQUM1QixPQUFDLEVBQUUsV0FBUyxDQUFDLEVBQVk7WUFBVixDQUFDLGdDQUFHLElBQUk7O0FBQ3JCLFlBQUksQ0FBQyxLQUFLLElBQUksRUFBRTtBQUFFLFdBQUMsR0FBRyxDQUFDLENBQUM7U0FBRTtBQUMxQixlQUFPLENBQUMsQ0FBQztPQUNWO0tBQ0YsRUFBRTtBQUNELGdCQUFVLEVBQUUsTUFBTSxDQUFDLFVBQVU7QUFDN0IsV0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO0tBQ3JCLENBQUMsQ0FBQztHQUNKOztZQWZrQixhQUFhOztTQUFiLGFBQWE7R0FBUyxLQUFLOztpQkFBM0IsYUFBYSIsImZpbGUiOiJlczYvaGVscGVycy93YXZlZm9ybS1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcbmltcG9ydCBXYXZlZm9ybSBmcm9tICcuLi9zaGFwZXMvd2F2ZWZvcm0nO1xuXG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICB5RG9tYWluOiBbLTEsIDFdLFxuICBjaGFubmVsOiAwLFxuICBjb2xvcjogJ3N0ZWVsYmx1ZSdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhdmVmb3JtTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKGJ1ZmZlciwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICBzdXBlcignZW50aXR5JywgYnVmZmVyLmdldENoYW5uZWxEYXRhKG9wdGlvbnMuY2hhbm5lbCksIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShXYXZlZm9ybSwge1xuICAgICAgeTogZnVuY3Rpb24oZCwgdiA9IG51bGwpIHtcbiAgICAgICAgaWYgKHYgIT09IG51bGwpIHsgZCA9IHY7IH1cbiAgICAgICAgcmV0dXJuIGQ7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgc2FtcGxlUmF0ZTogYnVmZmVyLnNhbXBsZVJhdGUsXG4gICAgICBjb2xvcjogb3B0aW9ucy5jb2xvclxuICAgIH0pO1xuICB9XG59XG4iXX0=