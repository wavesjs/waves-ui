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

var _marker = require('../shapes/marker');

var _marker2 = _interopRequireDefault(_marker);

var _markerBehavior = require('../behaviors/marker-behavior');

var _markerBehavior2 = _interopRequireDefault(_markerBehavior);

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

    options = (0, _assign2.default)({ displayHandlers: true }, options);
    var color = options.color;
    if (color) {
      accessors.color = function () {
        return color;
      };
    }

    _this.configureShape(_marker2.default, accessors, {
      displayHandlers: options.displayHandlers,
      opacity: options.opacity
    });

    _this.setBehavior(new _markerBehavior2.default());
    return _this;
  }

  return MarkerLayer;
}(_layer2.default);

exports.default = MarkerLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hcmtlci1sYXllci5qcyJdLCJuYW1lcyI6WyJNYXJrZXJMYXllciIsImRhdGEiLCJvcHRpb25zIiwiYWNjZXNzb3JzIiwiZGlzcGxheUhhbmRsZXJzIiwiY29sb3IiLCJjb25maWd1cmVTaGFwZSIsIm9wYWNpdHkiLCJzZXRCZWhhdmlvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBOzs7OztJQUtxQkEsVzs7O0FBQ25COzs7Ozs7QUFNQSx1QkFBWUMsSUFBWixFQUFnRDtBQUFBLFFBQTlCQyxPQUE4Qix1RUFBcEIsRUFBb0I7QUFBQSxRQUFoQkMsU0FBZ0IsdUVBQUosRUFBSTtBQUFBOztBQUFBLGdKQUN4QyxZQUR3QyxFQUMxQkYsSUFEMEIsRUFDcEJDLE9BRG9COztBQUc5Q0EsY0FBVSxzQkFBYyxFQUFFRSxpQkFBaUIsSUFBbkIsRUFBZCxFQUF5Q0YsT0FBekMsQ0FBVjtBQUNBLFFBQU1HLFFBQVFILFFBQVFHLEtBQXRCO0FBQ0EsUUFBSUEsS0FBSixFQUFXO0FBQ1RGLGdCQUFVRSxLQUFWLEdBQWtCLFlBQVc7QUFBRSxlQUFPQSxLQUFQO0FBQWUsT0FBOUM7QUFDRDs7QUFFRCxVQUFLQyxjQUFMLG1CQUE0QkgsU0FBNUIsRUFBdUM7QUFDckNDLHVCQUFpQkYsUUFBUUUsZUFEWTtBQUVyQ0csZUFBU0wsUUFBUUs7QUFGb0IsS0FBdkM7O0FBS0EsVUFBS0MsV0FBTCxDQUFpQiw4QkFBakI7QUFkOEM7QUFlL0M7Ozs7O2tCQXRCa0JSLFciLCJmaWxlIjoibWFya2VyLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IE1hcmtlciBmcm9tICcuLi9zaGFwZXMvbWFya2VyJztcbmltcG9ydCBNYXJrZXJCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvbWFya2VyLWJlaGF2aW9yJztcblxuXG4vKipcbiAqIEhlbHBlciB0byBjcmVhdGUgYSBtYXJrZXIgbGF5ZXIuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYnJlYWtwb2ludC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXJrZXJMYXllciBleHRlbmRzIExheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGRhdGEgLSBUaGUgZGF0YSB0byByZW5kZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhY2Nlc3NvcnMgLSBUaGUgYWNjZXNzb3JzIHRvIGNvbmZpZ3VyZSB0aGUgbWFwcGluZ1xuICAgKiAgICBiZXR3ZWVuIHNoYXBlcyBhbmQgZGF0YS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSwgYWNjZXNzb3JzID0ge30pIHtcbiAgICBzdXBlcignY29sbGVjdGlvbicsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyBkaXNwbGF5SGFuZGxlcnM6IHRydWUgfSwgb3B0aW9ucyk7XG4gICAgY29uc3QgY29sb3IgPSBvcHRpb25zLmNvbG9yO1xuICAgIGlmIChjb2xvcikge1xuICAgICAgYWNjZXNzb3JzLmNvbG9yID0gZnVuY3Rpb24oKSB7IHJldHVybiBjb2xvcjsgfTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKE1hcmtlciwgYWNjZXNzb3JzLCB7XG4gICAgICBkaXNwbGF5SGFuZGxlcnM6IG9wdGlvbnMuZGlzcGxheUhhbmRsZXJzLFxuICAgICAgb3BhY2l0eTogb3B0aW9ucy5vcGFjaXR5LFxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRCZWhhdmlvcihuZXcgTWFya2VyQmVoYXZpb3IoKSk7XG4gIH1cbn1cbiJdfQ==