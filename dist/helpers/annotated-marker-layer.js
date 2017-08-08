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

var _annotatedMarker = require('../shapes/annotated-marker');

var _annotatedMarker2 = _interopRequireDefault(_annotatedMarker);

var _layer = require('../core/layer');

var _layer2 = _interopRequireDefault(_layer);

var _markerBehavior = require('../behaviors/marker-behavior');

var _markerBehavior2 = _interopRequireDefault(_markerBehavior);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper to create a annotated marker layer
 *
 * [example usage](./examples/layer-marker.html)
 */
var AnnotatedMarkerLayer = function (_Layer) {
  (0, _inherits3.default)(AnnotatedMarkerLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @todo - Add accessors and options for the shape.
   */
  function AnnotatedMarkerLayer(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, AnnotatedMarkerLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AnnotatedMarkerLayer.__proto__ || (0, _getPrototypeOf2.default)(AnnotatedMarkerLayer)).call(this, 'collection', data, options));

    _this.configureShape(_annotatedMarker2.default, {
      displayLabels: true
    });

    _this.setBehavior(new _markerBehavior2.default());
    return _this;
  }

  return AnnotatedMarkerLayer;
}(_layer2.default);

exports.default = AnnotatedMarkerLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFubm90YXRlZC1tYXJrZXItbGF5ZXIuanMiXSwibmFtZXMiOlsiQW5ub3RhdGVkTWFya2VyTGF5ZXIiLCJkYXRhIiwib3B0aW9ucyIsImNvbmZpZ3VyZVNoYXBlIiwiZGlzcGxheUxhYmVscyIsInNldEJlaGF2aW9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQTs7Ozs7SUFLcUJBLG9COzs7QUFDbkI7Ozs7O0FBS0EsZ0NBQVlDLElBQVosRUFBZ0M7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFBQSxrS0FDeEIsWUFEd0IsRUFDVkQsSUFEVSxFQUNKQyxPQURJOztBQUc5QixVQUFLQyxjQUFMLDRCQUFxQztBQUNuQ0MscUJBQWU7QUFEb0IsS0FBckM7O0FBSUEsVUFBS0MsV0FBTCxDQUFpQiw4QkFBakI7QUFQOEI7QUFRL0I7Ozs7O2tCQWRrQkwsb0IiLCJmaWxlIjoiYW5ub3RhdGVkLW1hcmtlci1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBbm5vdGF0ZWRNYXJrZXIgZnJvbSAnLi4vc2hhcGVzL2Fubm90YXRlZC1tYXJrZXInO1xuaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IE1hcmtlckJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9tYXJrZXItYmVoYXZpb3InO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIGFubm90YXRlZCBtYXJrZXIgbGF5ZXJcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9sYXllci1tYXJrZXIuaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5ub3RhdGVkTWFya2VyTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhIC0gVGhlIGRhdGEgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKiBAdG9kbyAtIEFkZCBhY2Nlc3NvcnMgYW5kIG9wdGlvbnMgZm9yIHRoZSBzaGFwZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCdjb2xsZWN0aW9uJywgZGF0YSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKEFubm90YXRlZE1hcmtlciwge1xuICAgICAgZGlzcGxheUxhYmVsczogdHJ1ZSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0QmVoYXZpb3IobmV3IE1hcmtlckJlaGF2aW9yKCkpO1xuICB9XG59XG4iXX0=