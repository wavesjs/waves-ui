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

var _tracePath = require('../shapes/trace-path');

var _tracePath2 = _interopRequireDefault(_tracePath);

var _traceDots = require('../shapes/trace-dots');

var _traceDots2 = _interopRequireDefault(_traceDots);

var _traceBehavior = require('../behaviors/trace-behavior');

var _traceBehavior2 = _interopRequireDefault(_traceBehavior);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper to create a trace layer.
 *
 * [example usage](./examples/layer-trace.html)
 */
var TraceLayer = function (_Layer) {
  (0, _inherits3.default)(TraceLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */
  function TraceLayer(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck3.default)(this, TraceLayer);

    options = (0, _assign2.default)({ displayDots: true }, options);

    var _this = (0, _possibleConstructorReturn3.default)(this, (TraceLayer.__proto__ || (0, _getPrototypeOf2.default)(TraceLayer)).call(this, options.displayDots ? 'collection' : 'entity', data, options));

    var shapeOptions = {};
    if (options.meanColor !== undefined) {
      shapeOptions.meanColor = options.meanColor;
    }
    if (options.rangeColor !== undefined) {
      shapeOptions.rangeColor = options.rangeColor;
    }
    if (options.displayMean !== undefined) {
      shapeOptions.displayMean = options.displayMean;
    }

    if (options.displayDots) {
      _this.configureCommonShape(_tracePath2.default, accessors, shapeOptions);
      _this.configureShape(_traceDots2.default, accessors, shapeOptions);
    } else {
      _this.configureShape(_tracePath2.default, accessors, shapeOptions);
    }

    _this.setBehavior(new _traceBehavior2.default());
    return _this;
  }

  return TraceLayer;
}(_layer2.default);

exports.default = TraceLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYWNlLWxheWVyLmpzIl0sIm5hbWVzIjpbIlRyYWNlTGF5ZXIiLCJkYXRhIiwib3B0aW9ucyIsImFjY2Vzc29ycyIsImRpc3BsYXlEb3RzIiwic2hhcGVPcHRpb25zIiwibWVhbkNvbG9yIiwidW5kZWZpbmVkIiwicmFuZ2VDb2xvciIsImRpc3BsYXlNZWFuIiwiY29uZmlndXJlQ29tbW9uU2hhcGUiLCJjb25maWd1cmVTaGFwZSIsInNldEJlaGF2aW9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQTs7Ozs7SUFLcUJBLFU7OztBQUNuQjs7Ozs7O0FBTUEsc0JBQVlDLElBQVosRUFBZ0Q7QUFBQSxRQUE5QkMsT0FBOEIsdUVBQXBCLEVBQW9CO0FBQUEsUUFBaEJDLFNBQWdCLHVFQUFKLEVBQUk7QUFBQTs7QUFDOUNELGNBQVUsc0JBQWMsRUFBRUUsYUFBYSxJQUFmLEVBQWQsRUFBcUNGLE9BQXJDLENBQVY7O0FBRDhDLDhJQUV4Q0EsUUFBUUUsV0FBUixHQUFzQixZQUF0QixHQUFxQyxRQUZHLEVBRU9ILElBRlAsRUFFYUMsT0FGYjs7QUFJOUMsUUFBTUcsZUFBZSxFQUFyQjtBQUNBLFFBQUlILFFBQVFJLFNBQVIsS0FBc0JDLFNBQTFCLEVBQXFDO0FBQUVGLG1CQUFhQyxTQUFiLEdBQXlCSixRQUFRSSxTQUFqQztBQUE2QztBQUNwRixRQUFJSixRQUFRTSxVQUFSLEtBQXVCRCxTQUEzQixFQUFzQztBQUFFRixtQkFBYUcsVUFBYixHQUEwQk4sUUFBUU0sVUFBbEM7QUFBK0M7QUFDdkYsUUFBSU4sUUFBUU8sV0FBUixLQUF3QkYsU0FBNUIsRUFBdUM7QUFBRUYsbUJBQWFJLFdBQWIsR0FBMkJQLFFBQVFPLFdBQW5DO0FBQWlEOztBQUUxRixRQUFJUCxRQUFRRSxXQUFaLEVBQXlCO0FBQ3ZCLFlBQUtNLG9CQUFMLHNCQUFxQ1AsU0FBckMsRUFBZ0RFLFlBQWhEO0FBQ0EsWUFBS00sY0FBTCxzQkFBK0JSLFNBQS9CLEVBQTBDRSxZQUExQztBQUNELEtBSEQsTUFHTztBQUNMLFlBQUtNLGNBQUwsc0JBQStCUixTQUEvQixFQUEwQ0UsWUFBMUM7QUFDRDs7QUFFRCxVQUFLTyxXQUFMLENBQWlCLDZCQUFqQjtBQWhCOEM7QUFpQi9DOzs7OztrQkF4QmtCWixVIiwiZmlsZSI6InRyYWNlLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IFRyYWNlUGF0aCBmcm9tICcuLi9zaGFwZXMvdHJhY2UtcGF0aCc7XG5pbXBvcnQgVHJhY2VEb3RzIGZyb20gJy4uL3NoYXBlcy90cmFjZS1kb3RzJztcbmltcG9ydCBUcmFjZUJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy90cmFjZS1iZWhhdmlvcic7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgdHJhY2UgbGF5ZXIuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItdHJhY2UuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2VMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGRhdGEgLSBUaGUgZGF0YSB0byByZW5kZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhY2Nlc3NvcnMgLSBUaGUgYWNjZXNzb3JzIHRvIGNvbmZpZ3VyZSB0aGUgbWFwcGluZ1xuICAgKiAgICBiZXR3ZWVuIHNoYXBlcyBhbmQgZGF0YS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSwgYWNjZXNzb3JzID0ge30pIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGRpc3BsYXlEb3RzOiB0cnVlIH0sIG9wdGlvbnMpO1xuICAgIHN1cGVyKG9wdGlvbnMuZGlzcGxheURvdHMgPyAnY29sbGVjdGlvbicgOiAnZW50aXR5JywgZGF0YSwgb3B0aW9ucyk7XG5cbiAgICBjb25zdCBzaGFwZU9wdGlvbnMgPSB7fTtcbiAgICBpZiAob3B0aW9ucy5tZWFuQ29sb3IgIT09IHVuZGVmaW5lZCkgeyBzaGFwZU9wdGlvbnMubWVhbkNvbG9yID0gb3B0aW9ucy5tZWFuQ29sb3I7IH1cbiAgICBpZiAob3B0aW9ucy5yYW5nZUNvbG9yICE9PSB1bmRlZmluZWQpIHsgc2hhcGVPcHRpb25zLnJhbmdlQ29sb3IgPSBvcHRpb25zLnJhbmdlQ29sb3I7IH1cbiAgICBpZiAob3B0aW9ucy5kaXNwbGF5TWVhbiAhPT0gdW5kZWZpbmVkKSB7IHNoYXBlT3B0aW9ucy5kaXNwbGF5TWVhbiA9IG9wdGlvbnMuZGlzcGxheU1lYW47IH1cblxuICAgIGlmIChvcHRpb25zLmRpc3BsYXlEb3RzKSB7XG4gICAgICB0aGlzLmNvbmZpZ3VyZUNvbW1vblNoYXBlKFRyYWNlUGF0aCwgYWNjZXNzb3JzLCBzaGFwZU9wdGlvbnMpO1xuICAgICAgdGhpcy5jb25maWd1cmVTaGFwZShUcmFjZURvdHMsIGFjY2Vzc29ycywgc2hhcGVPcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb25maWd1cmVTaGFwZShUcmFjZVBhdGgsIGFjY2Vzc29ycywgc2hhcGVPcHRpb25zKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldEJlaGF2aW9yKG5ldyBUcmFjZUJlaGF2aW9yKCkpO1xuICB9XG59Il19