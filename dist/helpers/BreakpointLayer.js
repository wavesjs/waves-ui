'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Layer2 = require('../core/Layer');

var _Layer3 = _interopRequireDefault(_Layer2);

var _Dot = require('../shapes/Dot');

var _Dot2 = _interopRequireDefault(_Dot);

var _Line = require('../shapes/Line');

var _Line2 = _interopRequireDefault(_Line);

var _BreakpointBehavior = require('../behaviors/BreakpointBehavior');

var _BreakpointBehavior2 = _interopRequireDefault(_BreakpointBehavior);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper to create a breakpoint function layer.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */
var BreakpointLayer = function (_Layer) {
  (0, _inherits3.default)(BreakpointLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */
  function BreakpointLayer(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck3.default)(this, BreakpointLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (BreakpointLayer.__proto__ || (0, _getPrototypeOf2.default)(BreakpointLayer)).call(this, 'collection', data, options));

    var color = options.color;
    var commonShapeOptions = {};

    if (color) {
      accessors.color = function () {
        return color;
      };
      commonShapeOptions.color = color;
    }

    _this.configureCommonShape(_Line2.default, accessors, commonShapeOptions);
    _this.configureShape(_Dot2.default, accessors, {});
    _this.setBehavior(new _BreakpointBehavior2.default());
    return _this;
  }

  return BreakpointLayer;
}(_Layer3.default);

exports.default = BreakpointLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJyZWFrcG9pbnRMYXllci5qcyJdLCJuYW1lcyI6WyJCcmVha3BvaW50TGF5ZXIiLCJkYXRhIiwib3B0aW9ucyIsImFjY2Vzc29ycyIsImNvbG9yIiwiY29tbW9uU2hhcGVPcHRpb25zIiwiY29uZmlndXJlQ29tbW9uU2hhcGUiLCJjb25maWd1cmVTaGFwZSIsInNldEJlaGF2aW9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBOzs7OztJQUtNQSxlOzs7QUFDSjs7Ozs7O0FBTUEsMkJBQVlDLElBQVosRUFBZ0Q7QUFBQSxRQUE5QkMsT0FBOEIsdUVBQXBCLEVBQW9CO0FBQUEsUUFBaEJDLFNBQWdCLHVFQUFKLEVBQUk7QUFBQTs7QUFBQSx3SkFDeEMsWUFEd0MsRUFDMUJGLElBRDBCLEVBQ3BCQyxPQURvQjs7QUFHOUMsUUFBTUUsUUFBUUYsUUFBUUUsS0FBdEI7QUFDQSxRQUFJQyxxQkFBcUIsRUFBekI7O0FBRUEsUUFBSUQsS0FBSixFQUFXO0FBQ1RELGdCQUFVQyxLQUFWLEdBQWtCLFlBQVc7QUFBRSxlQUFPQSxLQUFQO0FBQWUsT0FBOUM7QUFDQUMseUJBQW1CRCxLQUFuQixHQUEyQkEsS0FBM0I7QUFDRDs7QUFFRCxVQUFLRSxvQkFBTCxpQkFBZ0NILFNBQWhDLEVBQTJDRSxrQkFBM0M7QUFDQSxVQUFLRSxjQUFMLGdCQUF5QkosU0FBekIsRUFBb0MsRUFBcEM7QUFDQSxVQUFLSyxXQUFMLENBQWlCLGtDQUFqQjtBQWI4QztBQWMvQzs7Ozs7a0JBR1lSLGUiLCJmaWxlIjoiQnJlYWtwb2ludExheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvTGF5ZXInO1xuaW1wb3J0IERvdCBmcm9tICcuLi9zaGFwZXMvRG90JztcbmltcG9ydCBMaW5lIGZyb20gJy4uL3NoYXBlcy9MaW5lJztcbmltcG9ydCBCcmVha3BvaW50QmVoYXZpb3IgZnJvbSAnLi4vYmVoYXZpb3JzL0JyZWFrcG9pbnRCZWhhdmlvcic7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgYnJlYWtwb2ludCBmdW5jdGlvbiBsYXllci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1icmVha3BvaW50Lmh0bWwpXG4gKi9cbmNsYXNzIEJyZWFrcG9pbnRMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGRhdGEgLSBUaGUgZGF0YSB0byByZW5kZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhY2Nlc3NvcnMgLSBUaGUgYWNjZXNzb3JzIHRvIGNvbmZpZ3VyZSB0aGUgbWFwcGluZ1xuICAgKiAgICBiZXR3ZWVuIHNoYXBlcyBhbmQgZGF0YS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSwgYWNjZXNzb3JzID0ge30pIHtcbiAgICBzdXBlcignY29sbGVjdGlvbicsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgY29sb3IgPSBvcHRpb25zLmNvbG9yO1xuICAgIGxldCBjb21tb25TaGFwZU9wdGlvbnMgPSB7fTtcblxuICAgIGlmIChjb2xvcikge1xuICAgICAgYWNjZXNzb3JzLmNvbG9yID0gZnVuY3Rpb24oKSB7IHJldHVybiBjb2xvcjsgfTtcbiAgICAgIGNvbW1vblNoYXBlT3B0aW9ucy5jb2xvciA9IGNvbG9yO1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlndXJlQ29tbW9uU2hhcGUoTGluZSwgYWNjZXNzb3JzLCBjb21tb25TaGFwZU9wdGlvbnMpO1xuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoRG90LCBhY2Nlc3NvcnMsIHt9KTtcbiAgICB0aGlzLnNldEJlaGF2aW9yKG5ldyBCcmVha3BvaW50QmVoYXZpb3IoKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQnJlYWtwb2ludExheWVyO1xuIl19