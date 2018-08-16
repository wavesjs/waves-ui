'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _Marker = require('../shapes/Marker');

var _Marker2 = _interopRequireDefault(_Marker);

var _MarkerBehavior = require('../behaviors/MarkerBehavior');

var _MarkerBehavior2 = _interopRequireDefault(_MarkerBehavior);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper to create a marker layer.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */
var MarkerLayer = function (_Layer) {
  (0, _inherits3.default)(MarkerLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */
  function MarkerLayer(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck3.default)(this, MarkerLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (MarkerLayer.__proto__ || (0, _getPrototypeOf2.default)(MarkerLayer)).call(this, 'collection', data, options));

    options = (0, _assign2.default)({
      displayHandlers: true,
      displayLabels: false
    }, options);

    var color = options.color;

    if (color) accessors.color = function () {
      return color;
    };

    _this.configureShape(_Marker2.default, accessors, {
      displayHandlers: options.displayHandlers,
      opacity: options.opacity
    });

    _this.setBehavior(new _MarkerBehavior2.default());
    return _this;
  }

  return MarkerLayer;
}(_Layer3.default);

exports.default = MarkerLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1hcmtlckxheWVyLmpzIl0sIm5hbWVzIjpbIk1hcmtlckxheWVyIiwiZGF0YSIsIm9wdGlvbnMiLCJhY2Nlc3NvcnMiLCJkaXNwbGF5SGFuZGxlcnMiLCJkaXNwbGF5TGFiZWxzIiwiY29sb3IiLCJjb25maWd1cmVTaGFwZSIsIm9wYWNpdHkiLCJzZXRCZWhhdmlvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBOzs7OztJQUtNQSxXOzs7QUFDSjs7Ozs7O0FBTUEsdUJBQVlDLElBQVosRUFBZ0Q7QUFBQSxRQUE5QkMsT0FBOEIsdUVBQXBCLEVBQW9CO0FBQUEsUUFBaEJDLFNBQWdCLHVFQUFKLEVBQUk7QUFBQTs7QUFBQSxnSkFDeEMsWUFEd0MsRUFDMUJGLElBRDBCLEVBQ3BCQyxPQURvQjs7QUFHOUNBLGNBQVUsc0JBQWM7QUFDdEJFLHVCQUFpQixJQURLO0FBRXRCQyxxQkFBZTtBQUZPLEtBQWQsRUFHUEgsT0FITyxDQUFWOztBQUtBLFFBQU1JLFFBQVFKLFFBQVFJLEtBQXRCOztBQUVBLFFBQUlBLEtBQUosRUFDRUgsVUFBVUcsS0FBVixHQUFrQjtBQUFBLGFBQU1BLEtBQU47QUFBQSxLQUFsQjs7QUFFRixVQUFLQyxjQUFMLG1CQUE0QkosU0FBNUIsRUFBdUM7QUFDckNDLHVCQUFpQkYsUUFBUUUsZUFEWTtBQUVyQ0ksZUFBU04sUUFBUU07QUFGb0IsS0FBdkM7O0FBS0EsVUFBS0MsV0FBTCxDQUFpQiw4QkFBakI7QUFsQjhDO0FBbUIvQzs7Ozs7a0JBR1lULFciLCJmaWxlIjoiTWFya2VyTGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9MYXllcic7XG5pbXBvcnQgTWFya2VyIGZyb20gJy4uL3NoYXBlcy9NYXJrZXInO1xuaW1wb3J0IE1hcmtlckJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9NYXJrZXJCZWhhdmlvcic7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgbWFya2VyIGxheWVyLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLWJyZWFrcG9pbnQuaHRtbClcbiAqL1xuY2xhc3MgTWFya2VyTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhIC0gVGhlIGRhdGEgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYWNjZXNzb3JzIC0gVGhlIGFjY2Vzc29ycyB0byBjb25maWd1cmUgdGhlIG1hcHBpbmdcbiAgICogICAgYmV0d2VlbiBzaGFwZXMgYW5kIGRhdGEuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30sIGFjY2Vzc29ycyA9IHt9KSB7XG4gICAgc3VwZXIoJ2NvbGxlY3Rpb24nLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogdHJ1ZSxcbiAgICAgIGRpc3BsYXlMYWJlbHM6IGZhbHNlLFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgY29sb3IgPSBvcHRpb25zLmNvbG9yO1xuXG4gICAgaWYgKGNvbG9yKVxuICAgICAgYWNjZXNzb3JzLmNvbG9yID0gKCkgPT4gY29sb3I7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKE1hcmtlciwgYWNjZXNzb3JzLCB7XG4gICAgICBkaXNwbGF5SGFuZGxlcnM6IG9wdGlvbnMuZGlzcGxheUhhbmRsZXJzLFxuICAgICAgb3BhY2l0eTogb3B0aW9ucy5vcGFjaXR5LFxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRCZWhhdmlvcihuZXcgTWFya2VyQmVoYXZpb3IoKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFya2VyTGF5ZXI7XG4iXX0=