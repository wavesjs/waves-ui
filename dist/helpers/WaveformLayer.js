'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Layer2 = require('../core/Layer');

var _Layer3 = _interopRequireDefault(_Layer2);

var _Waveform = require('../shapes/Waveform');

var _Waveform2 = _interopRequireDefault(_Waveform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
  yDomain: [-1, 1],
  channel: 0,
  color: 'steelblue',
  renderingStrategy: 'svg'
};

/**
 * Helper to create a waveform layer.
 *
 * [example usage](./examples/layer-waveform.html)
 */

var WaveformLayer = function (_Layer) {
  (0, _inherits3.default)(WaveformLayer, _Layer);

  /**
   * @param {AudioBuffer} buffer - The audio buffer to display.
   * @param {Object} options - An object to configure the layer.
   */
  function WaveformLayer(buffer, options) {
    (0, _classCallCheck3.default)(this, WaveformLayer);

    options = (0, _assign2.default)({}, defaults, options);

    var _this = (0, _possibleConstructorReturn3.default)(this, (WaveformLayer.__proto__ || (0, _getPrototypeOf2.default)(WaveformLayer)).call(this, 'entity', buffer.getChannelData(options.channel), options));

    _this.configureShape(_Waveform2.default, {}, {
      sampleRate: buffer.sampleRate,
      color: options.color,
      renderingStrategy: options.renderingStrategy
    });
    return _this;
  }

  return WaveformLayer;
}(_Layer3.default);

exports.default = WaveformLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIldhdmVmb3JtTGF5ZXIuanMiXSwibmFtZXMiOlsiZGVmYXVsdHMiLCJ5RG9tYWluIiwiY2hhbm5lbCIsImNvbG9yIiwicmVuZGVyaW5nU3RyYXRlZ3kiLCJXYXZlZm9ybUxheWVyIiwiYnVmZmVyIiwib3B0aW9ucyIsImdldENoYW5uZWxEYXRhIiwiY29uZmlndXJlU2hhcGUiLCJzYW1wbGVSYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUdBLElBQU1BLFdBQVc7QUFDZkMsV0FBUyxDQUFDLENBQUMsQ0FBRixFQUFLLENBQUwsQ0FETTtBQUVmQyxXQUFTLENBRk07QUFHZkMsU0FBTyxXQUhRO0FBSWZDLHFCQUFtQjtBQUpKLENBQWpCOztBQU9BOzs7Ozs7SUFLTUMsYTs7O0FBQ0o7Ozs7QUFJQSx5QkFBWUMsTUFBWixFQUFvQkMsT0FBcEIsRUFBNkI7QUFBQTs7QUFDM0JBLGNBQVUsc0JBQWMsRUFBZCxFQUFrQlAsUUFBbEIsRUFBNEJPLE9BQTVCLENBQVY7O0FBRDJCLG9KQUdyQixRQUhxQixFQUdYRCxPQUFPRSxjQUFQLENBQXNCRCxRQUFRTCxPQUE5QixDQUhXLEVBRzZCSyxPQUg3Qjs7QUFLM0IsVUFBS0UsY0FBTCxxQkFBOEIsRUFBOUIsRUFBa0M7QUFDaENDLGtCQUFZSixPQUFPSSxVQURhO0FBRWhDUCxhQUFPSSxRQUFRSixLQUZpQjtBQUdoQ0MseUJBQW1CRyxRQUFRSDtBQUhLLEtBQWxDO0FBTDJCO0FBVTVCOzs7OztrQkFHWUMsYSIsImZpbGUiOiJXYXZlZm9ybUxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvTGF5ZXInO1xuaW1wb3J0IFdhdmVmb3JtIGZyb20gJy4uL3NoYXBlcy9XYXZlZm9ybSc7XG5cblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gIHlEb21haW46IFstMSwgMV0sXG4gIGNoYW5uZWw6IDAsXG4gIGNvbG9yOiAnc3RlZWxibHVlJyxcbiAgcmVuZGVyaW5nU3RyYXRlZ3k6ICdzdmcnXG59O1xuXG4vKipcbiAqIEhlbHBlciB0byBjcmVhdGUgYSB3YXZlZm9ybSBsYXllci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci13YXZlZm9ybS5odG1sKVxuICovXG5jbGFzcyBXYXZlZm9ybUxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtBdWRpb0J1ZmZlcn0gYnVmZmVyIC0gVGhlIGF1ZGlvIGJ1ZmZlciB0byBkaXNwbGF5LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKi9cbiAgY29uc3RydWN0b3IoYnVmZmVyLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIHN1cGVyKCdlbnRpdHknLCBidWZmZXIuZ2V0Q2hhbm5lbERhdGEob3B0aW9ucy5jaGFubmVsKSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKFdhdmVmb3JtLCB7fSwge1xuICAgICAgc2FtcGxlUmF0ZTogYnVmZmVyLnNhbXBsZVJhdGUsXG4gICAgICBjb2xvcjogb3B0aW9ucy5jb2xvcixcbiAgICAgIHJlbmRlcmluZ1N0cmF0ZWd5OiBvcHRpb25zLnJlbmRlcmluZ1N0cmF0ZWd5XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgV2F2ZWZvcm1MYXllcjtcbiJdfQ==