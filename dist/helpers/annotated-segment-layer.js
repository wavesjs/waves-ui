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

var _layer = require('../core/layer');

var _layer2 = _interopRequireDefault(_layer);

var _annotatedSegment = require('../shapes/annotated-segment');

var _annotatedSegment2 = _interopRequireDefault(_annotatedSegment);

var _segmentBehavior = require('../behaviors/segment-behavior');

var _segmentBehavior2 = _interopRequireDefault(_segmentBehavior);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper to create a annotated segment layer.
 *
 * [example usage](./examples/layer-segment.html)
 */
var AnnotatedSegmentLayer = function (_Layer) {
  (0, _inherits3.default)(AnnotatedSegmentLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */
  function AnnotatedSegmentLayer(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck3.default)(this, AnnotatedSegmentLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AnnotatedSegmentLayer.__proto__ || (0, _getPrototypeOf2.default)(AnnotatedSegmentLayer)).call(this, 'collection', data, options));

    options = (0, _assign2.default)({
      displayHandlers: true,
      opacity: 0.6,
      displayLabels: true
    }, options);

    _this.configureShape(_annotatedSegment2.default, accessors, {
      displayHandlers: options.displayHandlers,
      opacity: options.opacity
    });

    _this.setBehavior(new _segmentBehavior2.default());
    return _this;
  }

  return AnnotatedSegmentLayer;
}(_layer2.default);

exports.default = AnnotatedSegmentLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFubm90YXRlZC1zZWdtZW50LWxheWVyLmpzIl0sIm5hbWVzIjpbIkFubm90YXRlZFNlZ21lbnRMYXllciIsImRhdGEiLCJvcHRpb25zIiwiYWNjZXNzb3JzIiwiZGlzcGxheUhhbmRsZXJzIiwib3BhY2l0eSIsImRpc3BsYXlMYWJlbHMiLCJjb25maWd1cmVTaGFwZSIsInNldEJlaGF2aW9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBR0E7Ozs7O0lBS3FCQSxxQjs7O0FBQ25COzs7Ozs7QUFNQSxpQ0FBWUMsSUFBWixFQUFnRDtBQUFBLFFBQTlCQyxPQUE4Qix1RUFBcEIsRUFBb0I7QUFBQSxRQUFoQkMsU0FBZ0IsdUVBQUosRUFBSTtBQUFBOztBQUFBLG9LQUN4QyxZQUR3QyxFQUMxQkYsSUFEMEIsRUFDcEJDLE9BRG9COztBQUc5Q0EsY0FBVSxzQkFBYztBQUN0QkUsdUJBQWlCLElBREs7QUFFdEJDLGVBQVMsR0FGYTtBQUd0QkMscUJBQWU7QUFITyxLQUFkLEVBSVBKLE9BSk8sQ0FBVjs7QUFNQSxVQUFLSyxjQUFMLDZCQUFzQ0osU0FBdEMsRUFBaUQ7QUFDL0NDLHVCQUFpQkYsUUFBUUUsZUFEc0I7QUFFL0NDLGVBQVNILFFBQVFHO0FBRjhCLEtBQWpEOztBQUtBLFVBQUtHLFdBQUwsQ0FBaUIsK0JBQWpCO0FBZDhDO0FBZS9DOzs7OztrQkF0QmtCUixxQiIsImZpbGUiOiJhbm5vdGF0ZWQtc2VnbWVudC1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcbmltcG9ydCBBbm5vdGF0ZWRTZWdtZW50IGZyb20gJy4uL3NoYXBlcy9hbm5vdGF0ZWQtc2VnbWVudCc7XG5pbXBvcnQgU2VnbWVudEJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9zZWdtZW50LWJlaGF2aW9yJztcblxuXG4vKipcbiAqIEhlbHBlciB0byBjcmVhdGUgYSBhbm5vdGF0ZWQgc2VnbWVudCBsYXllci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1zZWdtZW50Lmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFubm90YXRlZFNlZ21lbnRMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGRhdGEgLSBUaGUgZGF0YSB0byByZW5kZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhY2Nlc3NvcnMgLSBUaGUgYWNjZXNzb3JzIHRvIGNvbmZpZ3VyZSB0aGUgbWFwcGluZ1xuICAgKiAgICBiZXR3ZWVuIHNoYXBlcyBhbmQgZGF0YS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSwgYWNjZXNzb3JzID0ge30pIHtcbiAgICBzdXBlcignY29sbGVjdGlvbicsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgZGlzcGxheUhhbmRsZXJzOiB0cnVlLFxuICAgICAgb3BhY2l0eTogMC42LFxuICAgICAgZGlzcGxheUxhYmVsczogdHJ1ZSxcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoQW5ub3RhdGVkU2VnbWVudCwgYWNjZXNzb3JzLCB7XG4gICAgICBkaXNwbGF5SGFuZGxlcnM6IG9wdGlvbnMuZGlzcGxheUhhbmRsZXJzLFxuICAgICAgb3BhY2l0eTogb3B0aW9ucy5vcGFjaXR5LFxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRCZWhhdmlvcihuZXcgU2VnbWVudEJlaGF2aW9yKCkpO1xuICB9XG59XG4iXX0=