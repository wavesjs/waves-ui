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

var _shapesLine = require('../shapes/line');

var _shapesLine2 = _interopRequireDefault(_shapesLine);

var BreakpointLayer = (function (_Layer) {
  _inherits(BreakpointLayer, _Layer);

  function BreakpointLayer(data) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var accessors = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, BreakpointLayer);

    _get(Object.getPrototypeOf(BreakpointLayer.prototype), 'constructor', this).call(this, 'collection', data, options);

    var color = options.color;
    var commonShapeOptions = {};

    if (color) {
      accessors.color = function () {
        return color;
      };
      commonShapeOptions.color = color;
    }

    this.configureCommonShape(_shapesLine2['default'], accessors, commonShapeOptions);
    this.configureShape(_shapesDot2['default'], accessors, {});
    this.setBehavior(new _behaviorsBreakpointBehavior2['default']());
  }

  return BreakpointLayer;
})(_coreLayer2['default']);

exports['default'] = BreakpointLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy93YXZlcy11aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OzsyQ0FBK0Isa0NBQWtDOzs7O3lCQUNqRCxlQUFlOzs7O3lCQUNiLGVBQWU7Ozs7MEJBQ2hCLGdCQUFnQjs7OztJQUdaLGVBQWU7WUFBZixlQUFlOztBQUN2QixXQURRLGVBQWUsQ0FDdEIsSUFBSSxFQUFnQztRQUE5QixPQUFPLHlEQUFHLEVBQUU7UUFBRSxTQUFTLHlEQUFHLEVBQUU7OzBCQUQzQixlQUFlOztBQUVoQywrQkFGaUIsZUFBZSw2Q0FFMUIsWUFBWSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7O0FBRW5DLFFBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7QUFDNUIsUUFBSSxrQkFBa0IsR0FBRyxFQUFFLENBQUM7O0FBRTVCLFFBQUksS0FBSyxFQUFFO0FBQ1QsZUFBUyxDQUFDLEtBQUssR0FBRyxZQUFXO0FBQUUsZUFBTyxLQUFLLENBQUM7T0FBRSxDQUFDO0FBQy9DLHdCQUFrQixDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDbEM7O0FBRUQsUUFBSSxDQUFDLG9CQUFvQiwwQkFBTyxTQUFTLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUMvRCxRQUFJLENBQUMsY0FBYyx5QkFBTSxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDeEMsUUFBSSxDQUFDLFdBQVcsQ0FBQyw4Q0FBd0IsQ0FBQyxDQUFDO0dBQzVDOztTQWZrQixlQUFlOzs7cUJBQWYsZUFBZSIsImZpbGUiOiJzcmMvd2F2ZXMtdWkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQnJlYWtwb2ludEJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9icmVha3BvaW50LWJlaGF2aW9yJztcbmltcG9ydCBEb3QgZnJvbSAnLi4vc2hhcGVzL2RvdCc7XG5pbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgTGluZSBmcm9tICcuLi9zaGFwZXMvbGluZSc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJlYWtwb2ludExheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30sIGFjY2Vzc29ycyA9IHt9KSB7XG4gICAgc3VwZXIoJ2NvbGxlY3Rpb24nLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IGNvbG9yID0gb3B0aW9ucy5jb2xvcjtcbiAgICBsZXQgY29tbW9uU2hhcGVPcHRpb25zID0ge307XG5cbiAgICBpZiAoY29sb3IpIHtcbiAgICAgIGFjY2Vzc29ycy5jb2xvciA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gY29sb3I7IH07XG4gICAgICBjb21tb25TaGFwZU9wdGlvbnMuY29sb3IgPSBjb2xvcjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ3VyZUNvbW1vblNoYXBlKExpbmUsIGFjY2Vzc29ycywgY29tbW9uU2hhcGVPcHRpb25zKTtcbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKERvdCwgYWNjZXNzb3JzLCB7fSk7XG4gICAgdGhpcy5zZXRCZWhhdmlvcihuZXcgQnJlYWtwb2ludEJlaGF2aW9yKCkpO1xuICB9XG59XG4iXX0=