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

var _layer = require('../core/layer');

var _layer2 = _interopRequireDefault(_layer);

var _waveform = require('../shapes/waveform');

var _waveform2 = _interopRequireDefault(_waveform);

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

    _this.configureShape(_waveform2.default, {}, {
      sampleRate: buffer.sampleRate,
      color: options.color,
      renderingStrategy: options.renderingStrategy
    });
    return _this;
  }

  return WaveformLayer;
}(_layer2.default);

exports.default = WaveformLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndhdmVmb3JtLWxheWVyLmpzIl0sIm5hbWVzIjpbImRlZmF1bHRzIiwieURvbWFpbiIsImNoYW5uZWwiLCJjb2xvciIsInJlbmRlcmluZ1N0cmF0ZWd5IiwiV2F2ZWZvcm1MYXllciIsImJ1ZmZlciIsIm9wdGlvbnMiLCJnZXRDaGFubmVsRGF0YSIsImNvbmZpZ3VyZVNoYXBlIiwic2FtcGxlUmF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFHQSxJQUFNQSxXQUFXO0FBQ2ZDLFdBQVMsQ0FBQyxDQUFDLENBQUYsRUFBSyxDQUFMLENBRE07QUFFZkMsV0FBUyxDQUZNO0FBR2ZDLFNBQU8sV0FIUTtBQUlmQyxxQkFBbUI7QUFKSixDQUFqQjs7QUFPQTs7Ozs7O0lBS3FCQyxhOzs7QUFDbkI7Ozs7QUFJQSx5QkFBWUMsTUFBWixFQUFvQkMsT0FBcEIsRUFBNkI7QUFBQTs7QUFDM0JBLGNBQVUsc0JBQWMsRUFBZCxFQUFrQlAsUUFBbEIsRUFBNEJPLE9BQTVCLENBQVY7O0FBRDJCLG9KQUdyQixRQUhxQixFQUdYRCxPQUFPRSxjQUFQLENBQXNCRCxRQUFRTCxPQUE5QixDQUhXLEVBRzZCSyxPQUg3Qjs7QUFLM0IsVUFBS0UsY0FBTCxxQkFBOEIsRUFBOUIsRUFBa0M7QUFDaENDLGtCQUFZSixPQUFPSSxVQURhO0FBRWhDUCxhQUFPSSxRQUFRSixLQUZpQjtBQUdoQ0MseUJBQW1CRyxRQUFRSDtBQUhLLEtBQWxDO0FBTDJCO0FBVTVCOzs7OztrQkFma0JDLGEiLCJmaWxlIjoid2F2ZWZvcm0tbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgV2F2ZWZvcm0gZnJvbSAnLi4vc2hhcGVzL3dhdmVmb3JtJztcblxuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgeURvbWFpbjogWy0xLCAxXSxcbiAgY2hhbm5lbDogMCxcbiAgY29sb3I6ICdzdGVlbGJsdWUnLFxuICByZW5kZXJpbmdTdHJhdGVneTogJ3N2Zydcbn07XG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIHdhdmVmb3JtIGxheWVyLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLXdhdmVmb3JtLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhdmVmb3JtTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0F1ZGlvQnVmZmVyfSBidWZmZXIgLSBUaGUgYXVkaW8gYnVmZmVyIHRvIGRpc3BsYXkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihidWZmZXIsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgc3VwZXIoJ2VudGl0eScsIGJ1ZmZlci5nZXRDaGFubmVsRGF0YShvcHRpb25zLmNoYW5uZWwpLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoV2F2ZWZvcm0sIHt9LCB7XG4gICAgICBzYW1wbGVSYXRlOiBidWZmZXIuc2FtcGxlUmF0ZSxcbiAgICAgIGNvbG9yOiBvcHRpb25zLmNvbG9yLFxuICAgICAgcmVuZGVyaW5nU3RyYXRlZ3k6IG9wdGlvbnMucmVuZGVyaW5nU3RyYXRlZ3lcbiAgICB9KTtcbiAgfVxufVxuIl19