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

var _axisLayer = require('../axis/axis-layer');

var _axisLayer2 = _interopRequireDefault(_axisLayer);

var _ticks = require('../shapes/ticks');

var _ticks2 = _interopRequireDefault(_ticks);

var _timeAxisGenerator = require('../axis/time-axis-generator');

var _timeAxisGenerator2 = _interopRequireDefault(_timeAxisGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper to create a time axis layer
 *
 * [example usage](./examples/layer-axis.html)
 */
var TimeAxisLayer = function (_AxisLayer) {
  (0, _inherits3.default)(TimeAxisLayer, _AxisLayer);

  /**
   * @param {Object} options - An object to configure the layer.
   */
  function TimeAxisLayer(options) {
    (0, _classCallCheck3.default)(this, TimeAxisLayer);

    options = (0, _assign2.default)({ color: 'steelblue' }, options);

    var _this = (0, _possibleConstructorReturn3.default)(this, (TimeAxisLayer.__proto__ || (0, _getPrototypeOf2.default)(TimeAxisLayer)).call(this, (0, _timeAxisGenerator2.default)(), options));

    _this.configureShape(_ticks2.default, {}, {
      color: options.color
    });
    return _this;
  }

  return TimeAxisLayer;
}(_axisLayer2.default);

exports.default = TimeAxisLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpbWUtYXhpcy1sYXllci5qcyJdLCJuYW1lcyI6WyJUaW1lQXhpc0xheWVyIiwib3B0aW9ucyIsImNvbG9yIiwiY29uZmlndXJlU2hhcGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQTs7Ozs7SUFLcUJBLGE7OztBQUNuQjs7O0FBR0EseUJBQVlDLE9BQVosRUFBcUI7QUFBQTs7QUFDbkJBLGNBQVUsc0JBQWMsRUFBRUMsT0FBTyxXQUFULEVBQWQsRUFBc0NELE9BQXRDLENBQVY7O0FBRG1CLG9KQUViLGtDQUZhLEVBRVFBLE9BRlI7O0FBSW5CLFVBQUtFLGNBQUwsa0JBQTJCLEVBQTNCLEVBQStCO0FBQzdCRCxhQUFPRCxRQUFRQztBQURjLEtBQS9CO0FBSm1CO0FBT3BCOzs7OztrQkFYa0JGLGEiLCJmaWxlIjoidGltZS1heGlzLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEF4aXNMYXllciBmcm9tICcuLi9heGlzL2F4aXMtbGF5ZXInO1xuaW1wb3J0IFRpY2tzIGZyb20gJy4uL3NoYXBlcy90aWNrcyc7XG5pbXBvcnQgdGltZUF4aXNHZW5lcmF0b3IgZnJvbSAnLi4vYXhpcy90aW1lLWF4aXMtZ2VuZXJhdG9yJztcblxuXG4vKipcbiAqIEhlbHBlciB0byBjcmVhdGUgYSB0aW1lIGF4aXMgbGF5ZXJcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1heGlzLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVBeGlzTGF5ZXIgZXh0ZW5kcyBBeGlzTGF5ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBBbiBvYmplY3QgdG8gY29uZmlndXJlIHRoZSBsYXllci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGNvbG9yOiAnc3RlZWxibHVlJyB9LCBvcHRpb25zKTtcbiAgICBzdXBlcih0aW1lQXhpc0dlbmVyYXRvcigpLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoVGlja3MsIHt9LCB7XG4gICAgICBjb2xvcjogb3B0aW9ucy5jb2xvclxuICAgIH0pO1xuICB9XG59Il19