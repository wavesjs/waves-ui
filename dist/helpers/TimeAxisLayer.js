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

var _AxisLayer2 = require('../axis/AxisLayer');

var _AxisLayer3 = _interopRequireDefault(_AxisLayer2);

var _Ticks = require('../shapes/Ticks');

var _Ticks2 = _interopRequireDefault(_Ticks);

var _timeAxisGenerator = require('../axis/timeAxisGenerator');

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

    _this.configureShape(_Ticks2.default, {}, {
      color: options.color
    });
    return _this;
  }

  return TimeAxisLayer;
}(_AxisLayer3.default);

exports.default = TimeAxisLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRpbWVBeGlzTGF5ZXIuanMiXSwibmFtZXMiOlsiVGltZUF4aXNMYXllciIsIm9wdGlvbnMiLCJjb2xvciIsImNvbmZpZ3VyZVNoYXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBR0E7Ozs7O0lBS01BLGE7OztBQUNKOzs7QUFHQSx5QkFBWUMsT0FBWixFQUFxQjtBQUFBOztBQUNuQkEsY0FBVSxzQkFBYyxFQUFFQyxPQUFPLFdBQVQsRUFBZCxFQUFzQ0QsT0FBdEMsQ0FBVjs7QUFEbUIsb0pBRWIsa0NBRmEsRUFFUUEsT0FGUjs7QUFJbkIsVUFBS0UsY0FBTCxrQkFBMkIsRUFBM0IsRUFBK0I7QUFDN0JELGFBQU9ELFFBQVFDO0FBRGMsS0FBL0I7QUFKbUI7QUFPcEI7Ozs7O2tCQUdZRixhIiwiZmlsZSI6IlRpbWVBeGlzTGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXhpc0xheWVyIGZyb20gJy4uL2F4aXMvQXhpc0xheWVyJztcbmltcG9ydCBUaWNrcyBmcm9tICcuLi9zaGFwZXMvVGlja3MnO1xuaW1wb3J0IHRpbWVBeGlzR2VuZXJhdG9yIGZyb20gJy4uL2F4aXMvdGltZUF4aXNHZW5lcmF0b3InO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIHRpbWUgYXhpcyBsYXllclxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWF4aXMuaHRtbClcbiAqL1xuY2xhc3MgVGltZUF4aXNMYXllciBleHRlbmRzIEF4aXNMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHsgY29sb3I6ICdzdGVlbGJsdWUnIH0sIG9wdGlvbnMpO1xuICAgIHN1cGVyKHRpbWVBeGlzR2VuZXJhdG9yKCksIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShUaWNrcywge30sIHtcbiAgICAgIGNvbG9yOiBvcHRpb25zLmNvbG9yXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGltZUF4aXNMYXllcjtcbiJdfQ==