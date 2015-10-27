'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesAnnotatedSegment = require('../shapes/annotated-segment');

var _shapesAnnotatedSegment2 = _interopRequireDefault(_shapesAnnotatedSegment);

var _behaviorsSegmentBehavior = require('../behaviors/segment-behavior');

var _behaviorsSegmentBehavior2 = _interopRequireDefault(_behaviorsSegmentBehavior);

var AnnotatedSegmentLayer = (function (_Layer) {
  _inherits(AnnotatedSegmentLayer, _Layer);

  function AnnotatedSegmentLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var accessors = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, AnnotatedSegmentLayer);

    _get(Object.getPrototypeOf(AnnotatedSegmentLayer.prototype), 'constructor', this).call(this, 'collection', data, options);

    options = _Object$assign({
      displayHandlers: true,
      opacity: 0.6
    }, options);

    this.configureShape(_shapesAnnotatedSegment2['default'], accessors, {
      displayHandlers: options.displayHandlers,
      opacity: options.opacity
    });

    this.setBehavior(new _behaviorsSegmentBehavior2['default']());
  }

  return AnnotatedSegmentLayer;
})(_coreLayer2['default']);

exports['default'] = AnnotatedSegmentLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL2Fubm90YXRlZC1zZWdtZW50LWxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBQWtCLGVBQWU7Ozs7c0NBQ0osNkJBQTZCOzs7O3dDQUM5QiwrQkFBK0I7Ozs7SUFHdEMscUJBQXFCO1lBQXJCLHFCQUFxQjs7QUFDN0IsV0FEUSxxQkFBcUIsQ0FDNUIsSUFBSSxFQUFnQztRQUE5QixPQUFPLHlEQUFHLEVBQUU7UUFBRSxTQUFTLHlEQUFHLEVBQUU7OzBCQUQzQixxQkFBcUI7O0FBRXRDLCtCQUZpQixxQkFBcUIsNkNBRWhDLFlBQVksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFOztBQUVuQyxXQUFPLEdBQUcsZUFBYztBQUN0QixxQkFBZSxFQUFFLElBQUk7QUFDckIsYUFBTyxFQUFFLEdBQUc7S0FDYixFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUVaLFFBQUksQ0FBQyxjQUFjLHNDQUFtQixTQUFTLEVBQUU7QUFDL0MscUJBQWUsRUFBRSxPQUFPLENBQUMsZUFBZTtBQUN4QyxhQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU87S0FDekIsQ0FBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxXQUFXLENBQUMsMkNBQXFCLENBQUMsQ0FBQztHQUN6Qzs7U0Fma0IscUJBQXFCOzs7cUJBQXJCLHFCQUFxQiIsImZpbGUiOiJzcmMvaGVscGVycy9hbm5vdGF0ZWQtc2VnbWVudC1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcbmltcG9ydCBBbm5vdGF0ZWRTZWdtZW50IGZyb20gJy4uL3NoYXBlcy9hbm5vdGF0ZWQtc2VnbWVudCc7XG5pbXBvcnQgU2VnbWVudEJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9zZWdtZW50LWJlaGF2aW9yJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbm5vdGF0ZWRTZWdtZW50TGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSwgYWNjZXNzb3JzID0ge30pIHtcbiAgICBzdXBlcignY29sbGVjdGlvbicsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgZGlzcGxheUhhbmRsZXJzOiB0cnVlLFxuICAgICAgb3BhY2l0eTogMC42XG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKEFubm90YXRlZFNlZ21lbnQsIGFjY2Vzc29ycywge1xuICAgICAgZGlzcGxheUhhbmRsZXJzOiBvcHRpb25zLmRpc3BsYXlIYW5kbGVycyxcbiAgICAgIG9wYWNpdHk6IG9wdGlvbnMub3BhY2l0eSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0QmVoYXZpb3IobmV3IFNlZ21lbnRCZWhhdmlvcigpKTtcbiAgfVxufVxuIl19