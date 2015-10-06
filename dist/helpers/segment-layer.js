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

var _shapesSegment = require('../shapes/segment');

var _shapesSegment2 = _interopRequireDefault(_shapesSegment);

var _behaviorsSegmentBehavior = require('../behaviors/segment-behavior');

var _behaviorsSegmentBehavior2 = _interopRequireDefault(_behaviorsSegmentBehavior);

var SegmentLayer = (function (_Layer) {
  _inherits(SegmentLayer, _Layer);

  function SegmentLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var accessors = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, SegmentLayer);

    _get(Object.getPrototypeOf(SegmentLayer.prototype), 'constructor', this).call(this, 'collection', data, options);

    options = _Object$assign({
      displayHandlers: true,
      opacity: 0.6
    }, options);

    this.configureShape(_shapesSegment2['default'], accessors, {
      displayHandlers: options.displayHandlers,
      opacity: options.opacity
    });

    this.setBehavior(new _behaviorsSegmentBehavior2['default']());
  }

  return SegmentLayer;
})(_coreLayer2['default']);

exports['default'] = SegmentLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9oZWxwZXJzL3NlZ21lbnQtbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBa0IsZUFBZTs7Ozs2QkFDYixtQkFBbUI7Ozs7d0NBQ1gsK0JBQStCOzs7O0lBR3RDLFlBQVk7WUFBWixZQUFZOztBQUNwQixXQURRLFlBQVksQ0FDbkIsSUFBSSxFQUFnQztRQUE5QixPQUFPLHlEQUFHLEVBQUU7UUFBRSxTQUFTLHlEQUFHLEVBQUU7OzBCQUQzQixZQUFZOztBQUU3QiwrQkFGaUIsWUFBWSw2Q0FFdkIsWUFBWSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7O0FBRW5DLFdBQU8sR0FBRyxlQUFjO0FBQ3RCLHFCQUFlLEVBQUUsSUFBSTtBQUNyQixhQUFPLEVBQUUsR0FBRztLQUNiLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRVosUUFBSSxDQUFDLGNBQWMsNkJBQVUsU0FBUyxFQUFFO0FBQ3RDLHFCQUFlLEVBQUUsT0FBTyxDQUFDLGVBQWU7QUFDeEMsYUFBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPO0tBQ3pCLENBQUMsQ0FBQzs7QUFFSCxRQUFJLENBQUMsV0FBVyxDQUFDLDJDQUFxQixDQUFDLENBQUM7R0FDekM7O1NBZmtCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6ImVzNi9oZWxwZXJzL3NlZ21lbnQtbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgU2VnbWVudCBmcm9tICcuLi9zaGFwZXMvc2VnbWVudCc7XG5pbXBvcnQgU2VnbWVudEJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9zZWdtZW50LWJlaGF2aW9yJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWdtZW50TGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSwgYWNjZXNzb3JzID0ge30pIHtcbiAgICBzdXBlcignY29sbGVjdGlvbicsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgZGlzcGxheUhhbmRsZXJzOiB0cnVlLFxuICAgICAgb3BhY2l0eTogMC42XG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKFNlZ21lbnQsIGFjY2Vzc29ycywge1xuICAgICAgZGlzcGxheUhhbmRsZXJzOiBvcHRpb25zLmRpc3BsYXlIYW5kbGVycyxcbiAgICAgIG9wYWNpdHk6IG9wdGlvbnMub3BhY2l0eSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0QmVoYXZpb3IobmV3IFNlZ21lbnRCZWhhdmlvcigpKTtcbiAgfVxufVxuIl19