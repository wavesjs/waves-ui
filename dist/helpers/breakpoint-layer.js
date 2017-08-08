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

var _breakpointBehavior = require('../behaviors/breakpoint-behavior');

var _breakpointBehavior2 = _interopRequireDefault(_breakpointBehavior);

var _dot = require('../shapes/dot');

var _dot2 = _interopRequireDefault(_dot);

var _layer = require('../core/layer');

var _layer2 = _interopRequireDefault(_layer);

var _line = require('../shapes/line');

var _line2 = _interopRequireDefault(_line);

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

    _this.configureCommonShape(_line2.default, accessors, commonShapeOptions);
    _this.configureShape(_dot2.default, accessors, {});
    _this.setBehavior(new _breakpointBehavior2.default());
    return _this;
  }

  return BreakpointLayer;
}(_layer2.default);

exports.default = BreakpointLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJyZWFrcG9pbnQtbGF5ZXIuanMiXSwibmFtZXMiOlsiQnJlYWtwb2ludExheWVyIiwiZGF0YSIsIm9wdGlvbnMiLCJhY2Nlc3NvcnMiLCJjb2xvciIsImNvbW1vblNoYXBlT3B0aW9ucyIsImNvbmZpZ3VyZUNvbW1vblNoYXBlIiwiY29uZmlndXJlU2hhcGUiLCJzZXRCZWhhdmlvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQTs7Ozs7SUFLcUJBLGU7OztBQUNuQjs7Ozs7O0FBTUEsMkJBQVlDLElBQVosRUFBZ0Q7QUFBQSxRQUE5QkMsT0FBOEIsdUVBQXBCLEVBQW9CO0FBQUEsUUFBaEJDLFNBQWdCLHVFQUFKLEVBQUk7QUFBQTs7QUFBQSx3SkFDeEMsWUFEd0MsRUFDMUJGLElBRDBCLEVBQ3BCQyxPQURvQjs7QUFHOUMsUUFBTUUsUUFBUUYsUUFBUUUsS0FBdEI7QUFDQSxRQUFJQyxxQkFBcUIsRUFBekI7O0FBRUEsUUFBSUQsS0FBSixFQUFXO0FBQ1RELGdCQUFVQyxLQUFWLEdBQWtCLFlBQVc7QUFBRSxlQUFPQSxLQUFQO0FBQWUsT0FBOUM7QUFDQUMseUJBQW1CRCxLQUFuQixHQUEyQkEsS0FBM0I7QUFDRDs7QUFFRCxVQUFLRSxvQkFBTCxpQkFBZ0NILFNBQWhDLEVBQTJDRSxrQkFBM0M7QUFDQSxVQUFLRSxjQUFMLGdCQUF5QkosU0FBekIsRUFBb0MsRUFBcEM7QUFDQSxVQUFLSyxXQUFMLENBQWlCLGtDQUFqQjtBQWI4QztBQWMvQzs7Ozs7a0JBckJrQlIsZSIsImZpbGUiOiJicmVha3BvaW50LWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJyZWFrcG9pbnRCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvYnJlYWtwb2ludC1iZWhhdmlvcic7XG5pbXBvcnQgRG90IGZyb20gJy4uL3NoYXBlcy9kb3QnO1xuaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IExpbmUgZnJvbSAnLi4vc2hhcGVzL2xpbmUnO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIGJyZWFrcG9pbnQgZnVuY3Rpb24gbGF5ZXIuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYnJlYWtwb2ludC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcmVha3BvaW50TGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhIC0gVGhlIGRhdGEgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYWNjZXNzb3JzIC0gVGhlIGFjY2Vzc29ycyB0byBjb25maWd1cmUgdGhlIG1hcHBpbmdcbiAgICogICAgYmV0d2VlbiBzaGFwZXMgYW5kIGRhdGEuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30sIGFjY2Vzc29ycyA9IHt9KSB7XG4gICAgc3VwZXIoJ2NvbGxlY3Rpb24nLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IGNvbG9yID0gb3B0aW9ucy5jb2xvcjtcbiAgICBsZXQgY29tbW9uU2hhcGVPcHRpb25zID0ge307XG5cbiAgICBpZiAoY29sb3IpIHtcbiAgICAgIGFjY2Vzc29ycy5jb2xvciA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gY29sb3I7IH07XG4gICAgICBjb21tb25TaGFwZU9wdGlvbnMuY29sb3IgPSBjb2xvcjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ3VyZUNvbW1vblNoYXBlKExpbmUsIGFjY2Vzc29ycywgY29tbW9uU2hhcGVPcHRpb25zKTtcbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKERvdCwgYWNjZXNzb3JzLCB7fSk7XG4gICAgdGhpcy5zZXRCZWhhdmlvcihuZXcgQnJlYWtwb2ludEJlaGF2aW9yKCkpO1xuICB9XG59XG4iXX0=