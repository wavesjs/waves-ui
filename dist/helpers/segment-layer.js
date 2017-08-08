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

var _segment = require('../shapes/segment');

var _segment2 = _interopRequireDefault(_segment);

var _segmentBehavior = require('../behaviors/segment-behavior');

var _segmentBehavior2 = _interopRequireDefault(_segmentBehavior);

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

    _this.configureShape(_segment2.default, accessors, {
      displayHandlers: options.displayHandlers,
      opacity: options.opacity
    });

    _this.setBehavior(new _segmentBehavior2.default());
    return _this;
  }

  return SegmentLayer;
}(_layer2.default);

exports.default = SegmentLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlZ21lbnQtbGF5ZXIuanMiXSwibmFtZXMiOlsiU2VnbWVudExheWVyIiwiZGF0YSIsIm9wdGlvbnMiLCJhY2Nlc3NvcnMiLCJkaXNwbGF5SGFuZGxlcnMiLCJvcGFjaXR5IiwiY29uZmlndXJlU2hhcGUiLCJzZXRCZWhhdmlvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBOzs7OztJQUtxQkEsWTs7O0FBQ25COzs7Ozs7QUFNQSx3QkFBWUMsSUFBWixFQUFnRDtBQUFBLFFBQTlCQyxPQUE4Qix1RUFBcEIsRUFBb0I7QUFBQSxRQUFoQkMsU0FBZ0IsdUVBQUosRUFBSTtBQUFBOztBQUFBLGtKQUN4QyxZQUR3QyxFQUMxQkYsSUFEMEIsRUFDcEJDLE9BRG9COztBQUc5Q0EsY0FBVSxzQkFBYztBQUN0QkUsdUJBQWlCLElBREs7QUFFdEJDLGVBQVM7QUFGYSxLQUFkLEVBR1BILE9BSE8sQ0FBVjs7QUFLQSxVQUFLSSxjQUFMLG9CQUE2QkgsU0FBN0IsRUFBd0M7QUFDdENDLHVCQUFpQkYsUUFBUUUsZUFEYTtBQUV0Q0MsZUFBU0gsUUFBUUc7QUFGcUIsS0FBeEM7O0FBS0EsVUFBS0UsV0FBTCxDQUFpQiwrQkFBakI7QUFiOEM7QUFjL0M7Ozs7O2tCQXJCa0JQLFkiLCJmaWxlIjoic2VnbWVudC1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcbmltcG9ydCBTZWdtZW50IGZyb20gJy4uL3NoYXBlcy9zZWdtZW50JztcbmltcG9ydCBTZWdtZW50QmVoYXZpb3IgZnJvbSAnLi4vYmVoYXZpb3JzL3NlZ21lbnQtYmVoYXZpb3InO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIHNlZ21lbnQgbGF5ZXIuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItc2VnbWVudC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWdtZW50TGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhIC0gVGhlIGRhdGEgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYWNjZXNzb3JzIC0gVGhlIGFjY2Vzc29ycyB0byBjb25maWd1cmUgdGhlIG1hcHBpbmdcbiAgICogICAgYmV0d2VlbiBzaGFwZXMgYW5kIGRhdGEuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30sIGFjY2Vzc29ycyA9IHt9KSB7XG4gICAgc3VwZXIoJ2NvbGxlY3Rpb24nLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogdHJ1ZSxcbiAgICAgIG9wYWNpdHk6IDAuNlxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShTZWdtZW50LCBhY2Nlc3NvcnMsIHtcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogb3B0aW9ucy5kaXNwbGF5SGFuZGxlcnMsXG4gICAgICBvcGFjaXR5OiBvcHRpb25zLm9wYWNpdHksXG4gICAgfSk7XG5cbiAgICB0aGlzLnNldEJlaGF2aW9yKG5ldyBTZWdtZW50QmVoYXZpb3IoKSk7XG4gIH1cbn1cbiJdfQ==