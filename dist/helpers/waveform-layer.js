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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQU8sS0FBSywyQkFBTSxlQUFlOztJQUMxQixRQUFRLDJCQUFNLG9CQUFvQjs7QUFHekMsSUFBTSxRQUFRLEdBQUc7QUFDZixTQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDaEIsU0FBTyxFQUFFLENBQUM7QUFDVixPQUFLLEVBQUUsV0FBVztDQUNuQixDQUFDOztJQUVtQixhQUFhO0FBQ3JCLFdBRFEsYUFBYSxDQUNwQixNQUFNLEVBQUUsT0FBTyxFQUFFOzBCQURWLGFBQWE7O0FBRTlCLFdBQU8sR0FBRyxNQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFL0MscUNBSmlCLGFBQWEsNkNBSXhCLFFBQVEsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUU7O0FBRWpFLFFBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFO0FBQzVCLE9BQUMsRUFBRSxXQUFTLENBQUMsRUFBWTtZQUFWLENBQUMsZ0NBQUcsSUFBSTs7QUFDckIsWUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO0FBQUUsV0FBQyxHQUFHLENBQUMsQ0FBQztTQUFFO0FBQzFCLGVBQU8sQ0FBQyxDQUFDO09BQ1Y7S0FDRixFQUFFO0FBQ0QsZ0JBQVUsRUFBRSxNQUFNLENBQUMsVUFBVTtBQUM3QixXQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUs7S0FDckIsQ0FBQyxDQUFDO0dBQ0o7O1lBZmtCLGFBQWE7O1NBQWIsYUFBYTtHQUFTLEtBQUs7O2lCQUEzQixhQUFhIiwiZmlsZSI6ImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgV2F2ZWZvcm0gZnJvbSAnLi4vc2hhcGVzL3dhdmVmb3JtJztcblxuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgeURvbWFpbjogWy0xLCAxXSxcbiAgY2hhbm5lbDogMCxcbiAgY29sb3I6ICdzdGVlbGJsdWUnXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXZlZm9ybUxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3RvcihidWZmZXIsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgc3VwZXIoJ2VudGl0eScsIGJ1ZmZlci5nZXRDaGFubmVsRGF0YShvcHRpb25zLmNoYW5uZWwpLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoV2F2ZWZvcm0sIHtcbiAgICAgIHk6IGZ1bmN0aW9uKGQsIHYgPSBudWxsKSB7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKSB7IGQgPSB2OyB9XG4gICAgICAgIHJldHVybiBkO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIHNhbXBsZVJhdGU6IGJ1ZmZlci5zYW1wbGVSYXRlLFxuICAgICAgY29sb3I6IG9wdGlvbnMuY29sb3JcbiAgICB9KTtcbiAgfVxufVxuIl19