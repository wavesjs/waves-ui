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

var _Segment = require('../shapes/Segment');

var _Segment2 = _interopRequireDefault(_Segment);

var _SegmentBehavior = require('../behaviors/SegmentBehavior');

var _SegmentBehavior2 = _interopRequireDefault(_SegmentBehavior);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper to create a segment layer.
 *
 * [example usage](./examples/layer-segment.html)
 */
var SegmentLayer = function (_Layer) {
  (0, _inherits3.default)(SegmentLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */
  function SegmentLayer(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck3.default)(this, SegmentLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SegmentLayer.__proto__ || (0, _getPrototypeOf2.default)(SegmentLayer)).call(this, 'collection', data, options));

    options = (0, _assign2.default)({
      displayHandlers: true,
      opacity: 0.6
    }, options);

    _this.configureShape(_Segment2.default, accessors, {
      displayHandlers: options.displayHandlers,
      opacity: options.opacity
    });

    _this.setBehavior(new _SegmentBehavior2.default());
    return _this;
  }

  return SegmentLayer;
}(_Layer3.default);

exports.default = SegmentLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlZ21lbnRMYXllci5qcyJdLCJuYW1lcyI6WyJTZWdtZW50TGF5ZXIiLCJkYXRhIiwib3B0aW9ucyIsImFjY2Vzc29ycyIsImRpc3BsYXlIYW5kbGVycyIsIm9wYWNpdHkiLCJjb25maWd1cmVTaGFwZSIsInNldEJlaGF2aW9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBR0E7Ozs7O0lBS01BLFk7OztBQUNKOzs7Ozs7QUFNQSx3QkFBWUMsSUFBWixFQUFnRDtBQUFBLFFBQTlCQyxPQUE4Qix1RUFBcEIsRUFBb0I7QUFBQSxRQUFoQkMsU0FBZ0IsdUVBQUosRUFBSTtBQUFBOztBQUFBLGtKQUN4QyxZQUR3QyxFQUMxQkYsSUFEMEIsRUFDcEJDLE9BRG9COztBQUc5Q0EsY0FBVSxzQkFBYztBQUN0QkUsdUJBQWlCLElBREs7QUFFdEJDLGVBQVM7QUFGYSxLQUFkLEVBR1BILE9BSE8sQ0FBVjs7QUFLQSxVQUFLSSxjQUFMLG9CQUE2QkgsU0FBN0IsRUFBd0M7QUFDdENDLHVCQUFpQkYsUUFBUUUsZUFEYTtBQUV0Q0MsZUFBU0gsUUFBUUc7QUFGcUIsS0FBeEM7O0FBS0EsVUFBS0UsV0FBTCxDQUFpQiwrQkFBakI7QUFiOEM7QUFjL0M7Ozs7O2tCQUdZUCxZIiwiZmlsZSI6IlNlZ21lbnRMYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL0xheWVyJztcbmltcG9ydCBTZWdtZW50IGZyb20gJy4uL3NoYXBlcy9TZWdtZW50JztcbmltcG9ydCBTZWdtZW50QmVoYXZpb3IgZnJvbSAnLi4vYmVoYXZpb3JzL1NlZ21lbnRCZWhhdmlvcic7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgc2VnbWVudCBsYXllci5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1zZWdtZW50Lmh0bWwpXG4gKi9cbmNsYXNzIFNlZ21lbnRMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGRhdGEgLSBUaGUgZGF0YSB0byByZW5kZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhY2Nlc3NvcnMgLSBUaGUgYWNjZXNzb3JzIHRvIGNvbmZpZ3VyZSB0aGUgbWFwcGluZ1xuICAgKiAgICBiZXR3ZWVuIHNoYXBlcyBhbmQgZGF0YS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSwgYWNjZXNzb3JzID0ge30pIHtcbiAgICBzdXBlcignY29sbGVjdGlvbicsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgZGlzcGxheUhhbmRsZXJzOiB0cnVlLFxuICAgICAgb3BhY2l0eTogMC42XG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKFNlZ21lbnQsIGFjY2Vzc29ycywge1xuICAgICAgZGlzcGxheUhhbmRsZXJzOiBvcHRpb25zLmRpc3BsYXlIYW5kbGVycyxcbiAgICAgIG9wYWNpdHk6IG9wdGlvbnMub3BhY2l0eSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0QmVoYXZpb3IobmV3IFNlZ21lbnRCZWhhdmlvcigpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTZWdtZW50TGF5ZXI7XG4iXX0=