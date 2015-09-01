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

var _shapesTicks = require('../shapes/ticks');

var _shapesTicks2 = _interopRequireDefault(_shapesTicks);

var TickLayer = (function (_Layer) {
  _inherits(TickLayer, _Layer);

  function TickLayer(data, options) {
    _classCallCheck(this, TickLayer);

    options = _Object$assign({}, options);

    _get(Object.getPrototypeOf(TickLayer.prototype), 'constructor', this).call(this, 'entity', data, options);

    var config = options.color ? { color: options.color } : undefined;
    this.configureShape(_shapesTicks2['default'], options, config);
  }

  return TickLayer;
})(_coreLayer2['default']);

exports['default'] = TickLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9oZWxwZXJzL3RpY2stbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBa0IsZUFBZTs7OzsyQkFDZixpQkFBaUI7Ozs7SUFHZCxTQUFTO1lBQVQsU0FBUzs7QUFDakIsV0FEUSxTQUFTLENBQ2hCLElBQUksRUFBRSxPQUFPLEVBQUU7MEJBRFIsU0FBUzs7QUFFMUIsV0FBTyxHQUFHLGVBQWMsRUFFdkIsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFWiwrQkFOaUIsU0FBUyw2Q0FNcEIsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7O0FBRS9CLFFBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEdBQUcsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLFNBQVMsQ0FBQztBQUNwRSxRQUFJLENBQUMsY0FBYywyQkFBUSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7R0FDN0M7O1NBVmtCLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6ImVzNi9oZWxwZXJzL3RpY2stbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgVGlja3MgZnJvbSAnLi4vc2hhcGVzL3RpY2tzJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWNrTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG5cbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHN1cGVyKCdlbnRpdHknLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IGNvbmZpZyA9IG9wdGlvbnMuY29sb3IgPyB7IGNvbG9yOiBvcHRpb25zLmNvbG9yIH0gOiB1bmRlZmluZWQ7XG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShUaWNrcywgb3B0aW9ucywgY29uZmlnKTtcbiAgfVxufSJdfQ==