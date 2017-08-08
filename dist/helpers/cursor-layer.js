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

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _layer = require('../core/layer');

var _layer2 = _interopRequireDefault(_layer);

var _cursor = require('../shapes/cursor');

var _cursor2 = _interopRequireDefault(_cursor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper to create a cursor layer.
 *
 * [example usage](./examples/layer-cursor.html)
 */
var CursorLayer = function (_Layer) {
  (0, _inherits3.default)(CursorLayer, _Layer);

  /**
   * @param {Object} options - An object to configure the layer.
   */
  function CursorLayer() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, CursorLayer);

    var defaults = {
      color: 'red',
      hittable: false // kind of pass through layer
    };

    var data = { currentPosition: 0 };

    options = (0, _assign2.default)(defaults, options);

    var _this = (0, _possibleConstructorReturn3.default)(this, (CursorLayer.__proto__ || (0, _getPrototypeOf2.default)(CursorLayer)).call(this, 'entity', data, options));

    _this.configureShape(_cursor2.default, { x: function x(d) {
        return d.currentPosition;
      } }, {
      color: options.color
    });
    return _this;
  }

  (0, _createClass3.default)(CursorLayer, [{
    key: 'currentPosition',
    set: function set(value) {
      this.data[0].currentPosition = value;
    },
    get: function get() {
      return this.data[0].currentPosition;
    }
  }]);
  return CursorLayer;
}(_layer2.default);

exports.default = CursorLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1cnNvci1sYXllci5qcyJdLCJuYW1lcyI6WyJDdXJzb3JMYXllciIsIm9wdGlvbnMiLCJkZWZhdWx0cyIsImNvbG9yIiwiaGl0dGFibGUiLCJkYXRhIiwiY3VycmVudFBvc2l0aW9uIiwiY29uZmlndXJlU2hhcGUiLCJ4IiwiZCIsInZhbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFHQTs7Ozs7SUFLcUJBLFc7OztBQUNuQjs7O0FBR0EseUJBQTBCO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7O0FBQ3hCLFFBQU1DLFdBQVc7QUFDZkMsYUFBTyxLQURRO0FBRWZDLGdCQUFVLEtBRkssQ0FFRTtBQUZGLEtBQWpCOztBQUtBLFFBQU1DLE9BQU8sRUFBRUMsaUJBQWlCLENBQW5CLEVBQWI7O0FBRUFMLGNBQVUsc0JBQWNDLFFBQWQsRUFBd0JELE9BQXhCLENBQVY7O0FBUndCLGdKQVNsQixRQVRrQixFQVNSSSxJQVRRLEVBU0ZKLE9BVEU7O0FBV3hCLFVBQUtNLGNBQUwsbUJBQTRCLEVBQUVDLEdBQUcsV0FBQ0MsQ0FBRDtBQUFBLGVBQU9BLEVBQUVILGVBQVQ7QUFBQSxPQUFMLEVBQTVCLEVBQTZEO0FBQzNESCxhQUFPRixRQUFRRTtBQUQ0QyxLQUE3RDtBQVh3QjtBQWN6Qjs7OztzQkFFbUJPLEssRUFBTztBQUN6QixXQUFLTCxJQUFMLENBQVUsQ0FBVixFQUFhQyxlQUFiLEdBQStCSSxLQUEvQjtBQUNELEs7d0JBRXFCO0FBQ3BCLGFBQU8sS0FBS0wsSUFBTCxDQUFVLENBQVYsRUFBYUMsZUFBcEI7QUFDRDs7Ozs7a0JBMUJrQk4sVyIsImZpbGUiOiJjdXJzb3ItbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgQ3Vyc29yIGZyb20gJy4uL3NoYXBlcy9jdXJzb3InO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIGN1cnNvciBsYXllci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1jdXJzb3IuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3Vyc29yTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBjb2xvcjogJ3JlZCcsXG4gICAgICBoaXR0YWJsZTogZmFsc2UsIC8vIGtpbmQgb2YgcGFzcyB0aHJvdWdoIGxheWVyXG4gICAgfTtcblxuICAgIGNvbnN0IGRhdGEgPSB7IGN1cnJlbnRQb3NpdGlvbjogMCB9O1xuXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIHN1cGVyKCdlbnRpdHknLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoQ3Vyc29yLCB7IHg6IChkKSA9PiBkLmN1cnJlbnRQb3NpdGlvbiB9LCB7XG4gICAgICBjb2xvcjogb3B0aW9ucy5jb2xvclxuICAgIH0pO1xuICB9XG5cbiAgc2V0IGN1cnJlbnRQb3NpdGlvbih2YWx1ZSkge1xuICAgIHRoaXMuZGF0YVswXS5jdXJyZW50UG9zaXRpb24gPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBjdXJyZW50UG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVswXS5jdXJyZW50UG9zaXRpb247XG4gIH1cbn1cbiJdfQ==