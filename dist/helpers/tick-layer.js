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

var _ticks = require('../shapes/ticks');

var _ticks2 = _interopRequireDefault(_ticks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper to create a tick layer. Can be seen as a grid axis with user defined data
 * or as a marker layer with entity based data.
 */
var TickLayer = function (_Layer) {
  (0, _inherits3.default)(TickLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */
  function TickLayer(data, options, accessors) {
    (0, _classCallCheck3.default)(this, TickLayer);

    options = (0, _assign2.default)({}, options);

    var _this = (0, _possibleConstructorReturn3.default)(this, (TickLayer.__proto__ || (0, _getPrototypeOf2.default)(TickLayer)).call(this, 'entity', data, options));

    var config = options.color ? { color: options.color } : undefined;
    _this.configureShape(_ticks2.default, accessors, config);
    return _this;
  }

  return TickLayer;
}(_layer2.default);

exports.default = TickLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpY2stbGF5ZXIuanMiXSwibmFtZXMiOlsiVGlja0xheWVyIiwiZGF0YSIsIm9wdGlvbnMiLCJhY2Nlc3NvcnMiLCJjb25maWciLCJjb2xvciIsInVuZGVmaW5lZCIsImNvbmZpZ3VyZVNoYXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUdBOzs7O0lBSXFCQSxTOzs7QUFDbkI7Ozs7OztBQU1BLHFCQUFZQyxJQUFaLEVBQWtCQyxPQUFsQixFQUEyQkMsU0FBM0IsRUFBc0M7QUFBQTs7QUFDcENELGNBQVUsc0JBQWMsRUFBZCxFQUVQQSxPQUZPLENBQVY7O0FBRG9DLDRJQUs5QixRQUw4QixFQUtwQkQsSUFMb0IsRUFLZEMsT0FMYzs7QUFPcEMsUUFBTUUsU0FBU0YsUUFBUUcsS0FBUixHQUFnQixFQUFFQSxPQUFPSCxRQUFRRyxLQUFqQixFQUFoQixHQUEyQ0MsU0FBMUQ7QUFDQSxVQUFLQyxjQUFMLGtCQUEyQkosU0FBM0IsRUFBc0NDLE1BQXRDO0FBUm9DO0FBU3JDOzs7OztrQkFoQmtCSixTIiwiZmlsZSI6InRpY2stbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgVGlja3MgZnJvbSAnLi4vc2hhcGVzL3RpY2tzJztcblxuXG4vKipcbiAqIEhlbHBlciB0byBjcmVhdGUgYSB0aWNrIGxheWVyLiBDYW4gYmUgc2VlbiBhcyBhIGdyaWQgYXhpcyB3aXRoIHVzZXIgZGVmaW5lZCBkYXRhXG4gKiBvciBhcyBhIG1hcmtlciBsYXllciB3aXRoIGVudGl0eSBiYXNlZCBkYXRhLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWNrTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhIC0gVGhlIGRhdGEgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYWNjZXNzb3JzIC0gVGhlIGFjY2Vzc29ycyB0byBjb25maWd1cmUgdGhlIG1hcHBpbmdcbiAgICogICAgYmV0d2VlbiBzaGFwZXMgYW5kIGRhdGEuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zLCBhY2Nlc3NvcnMpIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG5cbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHN1cGVyKCdlbnRpdHknLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IGNvbmZpZyA9IG9wdGlvbnMuY29sb3IgPyB7IGNvbG9yOiBvcHRpb25zLmNvbG9yIH0gOiB1bmRlZmluZWQ7XG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShUaWNrcywgYWNjZXNzb3JzLCBjb25maWcpO1xuICB9XG59Il19