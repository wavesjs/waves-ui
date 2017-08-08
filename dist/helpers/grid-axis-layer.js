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

var _gridAxisGenerator = require('../axis/grid-axis-generator');

var _gridAxisGenerator2 = _interopRequireDefault(_gridAxisGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper to create a grid layer
 *
 * [example usage](./examples/layer-axis.html)
 */
var GridAxisLayer = function (_AxisLayer) {
  (0, _inherits3.default)(GridAxisLayer, _AxisLayer);

  /**
   * @param {Object} options - An object to configure the layer.
   */
  function GridAxisLayer(options) {
    (0, _classCallCheck3.default)(this, GridAxisLayer);

    options = (0, _assign2.default)({
      color: 'steelblue',
      bpm: 60,
      signature: '4/4'
    }, options);

    var _this = (0, _possibleConstructorReturn3.default)(this, (GridAxisLayer.__proto__ || (0, _getPrototypeOf2.default)(GridAxisLayer)).call(this, (0, _gridAxisGenerator2.default)(options.bpm, options.signature), options));

    _this.configureShape(_ticks2.default, {}, {
      color: options.color
    });
    return _this;
  }

  return GridAxisLayer;
}(_axisLayer2.default);

exports.default = GridAxisLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdyaWQtYXhpcy1sYXllci5qcyJdLCJuYW1lcyI6WyJHcmlkQXhpc0xheWVyIiwib3B0aW9ucyIsImNvbG9yIiwiYnBtIiwic2lnbmF0dXJlIiwiY29uZmlndXJlU2hhcGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQTs7Ozs7SUFLcUJBLGE7OztBQUNuQjs7O0FBR0EseUJBQVlDLE9BQVosRUFBcUI7QUFBQTs7QUFDbkJBLGNBQVUsc0JBQWM7QUFDdEJDLGFBQU8sV0FEZTtBQUV0QkMsV0FBSyxFQUZpQjtBQUd0QkMsaUJBQVc7QUFIVyxLQUFkLEVBSVBILE9BSk8sQ0FBVjs7QUFEbUIsb0pBT2IsaUNBQWtCQSxRQUFRRSxHQUExQixFQUErQkYsUUFBUUcsU0FBdkMsQ0FQYSxFQU9zQ0gsT0FQdEM7O0FBU25CLFVBQUtJLGNBQUwsa0JBQTJCLEVBQTNCLEVBQStCO0FBQzdCSCxhQUFPRCxRQUFRQztBQURjLEtBQS9CO0FBVG1CO0FBWXBCOzs7OztrQkFoQmtCRixhIiwiZmlsZSI6ImdyaWQtYXhpcy1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBeGlzTGF5ZXIgZnJvbSAnLi4vYXhpcy9heGlzLWxheWVyJztcbmltcG9ydCBUaWNrcyBmcm9tICcuLi9zaGFwZXMvdGlja3MnO1xuaW1wb3J0IGdyaWRBeGlzR2VuZXJhdG9yIGZyb20gJy4uL2F4aXMvZ3JpZC1heGlzLWdlbmVyYXRvcic7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgZ3JpZCBsYXllclxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWF4aXMuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZEF4aXNMYXllciBleHRlbmRzIEF4aXNMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGNvbG9yOiAnc3RlZWxibHVlJyxcbiAgICAgIGJwbTogNjAsXG4gICAgICBzaWduYXR1cmU6ICc0LzQnXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICBzdXBlcihncmlkQXhpc0dlbmVyYXRvcihvcHRpb25zLmJwbSwgb3B0aW9ucy5zaWduYXR1cmUpLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoVGlja3MsIHt9LCB7XG4gICAgICBjb2xvcjogb3B0aW9ucy5jb2xvclxuICAgIH0pO1xuICB9XG59XG4iXX0=