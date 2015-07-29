'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _behaviorsBreakpointBehavior = require('../behaviors/breakpoint-behavior');

var _behaviorsBreakpointBehavior2 = _interopRequireDefault(_behaviorsBreakpointBehavior);

var _shapesDot = require('../shapes/dot');

var _shapesDot2 = _interopRequireDefault(_shapesDot);

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var DotLayer = (function (_Layer) {
  _inherits(DotLayer, _Layer);

  function DotLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var accessors = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, DotLayer);

    _get(Object.getPrototypeOf(DotLayer.prototype), 'constructor', this).call(this, 'collection', data, options);

    this.configureShape(_shapesDot2['default']);
    this.setBehavior(new _behaviorsBreakpointBehavior2['default']());
  }

  return DotLayer;
})(_coreLayer2['default']);

exports['default'] = DotLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9oZWxwZXJzL2RvdC1sYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OzsyQ0FBK0Isa0NBQWtDOzs7O3lCQUNqRCxlQUFlOzs7O3lCQUNiLGVBQWU7Ozs7SUFHWixRQUFRO1lBQVIsUUFBUTs7QUFDaEIsV0FEUSxRQUFRLENBQ2YsSUFBSSxFQUFnQztRQUE5QixPQUFPLHlEQUFHLEVBQUU7UUFBRSxTQUFTLHlEQUFHLEVBQUU7OzBCQUQzQixRQUFROztBQUV6QiwrQkFGaUIsUUFBUSw2Q0FFbkIsWUFBWSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7O0FBRW5DLFFBQUksQ0FBQyxjQUFjLHdCQUFLLENBQUM7QUFDekIsUUFBSSxDQUFDLFdBQVcsQ0FBQyw4Q0FBd0IsQ0FBQyxDQUFDO0dBQzVDOztTQU5rQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiJlczYvaGVscGVycy9kb3QtbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQnJlYWtwb2ludEJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9icmVha3BvaW50LWJlaGF2aW9yJztcbmltcG9ydCBEb3QgZnJvbSAnLi4vc2hhcGVzL2RvdCc7XG5pbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG90TGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMgPSB7fSwgYWNjZXNzb3JzID0ge30pIHtcbiAgICBzdXBlcignY29sbGVjdGlvbicsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShEb3QpO1xuICAgIHRoaXMuc2V0QmVoYXZpb3IobmV3IEJyZWFrcG9pbnRCZWhhdmlvcigpKTtcbiAgfVxufVxuIl19