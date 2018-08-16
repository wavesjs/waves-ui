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

var _gridAxisGenerator = require('../axis/gridAxisGenerator');

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

    _this.configureShape(_Ticks2.default, {}, {
      color: options.color
    });
    return _this;
  }

  return GridAxisLayer;
}(_AxisLayer3.default);

exports.default = GridAxisLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdyaWRBeGlzTGF5ZXIuanMiXSwibmFtZXMiOlsiR3JpZEF4aXNMYXllciIsIm9wdGlvbnMiLCJjb2xvciIsImJwbSIsInNpZ25hdHVyZSIsImNvbmZpZ3VyZVNoYXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBR0E7Ozs7O0lBS01BLGE7OztBQUNKOzs7QUFHQSx5QkFBWUMsT0FBWixFQUFxQjtBQUFBOztBQUNuQkEsY0FBVSxzQkFBYztBQUN0QkMsYUFBTyxXQURlO0FBRXRCQyxXQUFLLEVBRmlCO0FBR3RCQyxpQkFBVztBQUhXLEtBQWQsRUFJUEgsT0FKTyxDQUFWOztBQURtQixvSkFPYixpQ0FBa0JBLFFBQVFFLEdBQTFCLEVBQStCRixRQUFRRyxTQUF2QyxDQVBhLEVBT3NDSCxPQVB0Qzs7QUFTbkIsVUFBS0ksY0FBTCxrQkFBMkIsRUFBM0IsRUFBK0I7QUFDN0JILGFBQU9ELFFBQVFDO0FBRGMsS0FBL0I7QUFUbUI7QUFZcEI7Ozs7O2tCQUdZRixhIiwiZmlsZSI6IkdyaWRBeGlzTGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXhpc0xheWVyIGZyb20gJy4uL2F4aXMvQXhpc0xheWVyJztcbmltcG9ydCBUaWNrcyBmcm9tICcuLi9zaGFwZXMvVGlja3MnO1xuaW1wb3J0IGdyaWRBeGlzR2VuZXJhdG9yIGZyb20gJy4uL2F4aXMvZ3JpZEF4aXNHZW5lcmF0b3InO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIGdyaWQgbGF5ZXJcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1heGlzLmh0bWwpXG4gKi9cbmNsYXNzIEdyaWRBeGlzTGF5ZXIgZXh0ZW5kcyBBeGlzTGF5ZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBBbiBvYmplY3QgdG8gY29uZmlndXJlIHRoZSBsYXllci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBjb2xvcjogJ3N0ZWVsYmx1ZScsXG4gICAgICBicG06IDYwLFxuICAgICAgc2lnbmF0dXJlOiAnNC80J1xuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgc3VwZXIoZ3JpZEF4aXNHZW5lcmF0b3Iob3B0aW9ucy5icG0sIG9wdGlvbnMuc2lnbmF0dXJlKSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKFRpY2tzLCB7fSwge1xuICAgICAgY29sb3I6IG9wdGlvbnMuY29sb3JcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHcmlkQXhpc0xheWVyO1xuIl19