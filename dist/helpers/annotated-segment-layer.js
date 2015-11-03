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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBa0IsZUFBZTs7OztzQ0FDSiw2QkFBNkI7Ozs7d0NBQzlCLCtCQUErQjs7OztJQUd0QyxxQkFBcUI7WUFBckIscUJBQXFCOztBQUM3QixXQURRLHFCQUFxQixDQUM1QixJQUFJLEVBQWdDO1FBQTlCLE9BQU8seURBQUcsRUFBRTtRQUFFLFNBQVMseURBQUcsRUFBRTs7MEJBRDNCLHFCQUFxQjs7QUFFdEMsK0JBRmlCLHFCQUFxQiw2Q0FFaEMsWUFBWSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7O0FBRW5DLFdBQU8sR0FBRyxlQUFjO0FBQ3RCLHFCQUFlLEVBQUUsSUFBSTtBQUNyQixhQUFPLEVBQUUsR0FBRztLQUNiLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRVosUUFBSSxDQUFDLGNBQWMsc0NBQW1CLFNBQVMsRUFBRTtBQUMvQyxxQkFBZSxFQUFFLE9BQU8sQ0FBQyxlQUFlO0FBQ3hDLGFBQU8sRUFBRSxPQUFPLENBQUMsT0FBTztLQUN6QixDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLFdBQVcsQ0FBQywyQ0FBcUIsQ0FBQyxDQUFDO0dBQ3pDOztTQWZrQixxQkFBcUI7OztxQkFBckIscUJBQXFCIiwiZmlsZSI6InNyYy9zaGFwZXMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgQW5ub3RhdGVkU2VnbWVudCBmcm9tICcuLi9zaGFwZXMvYW5ub3RhdGVkLXNlZ21lbnQnO1xuaW1wb3J0IFNlZ21lbnRCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvc2VnbWVudC1iZWhhdmlvcic7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5ub3RhdGVkU2VnbWVudExheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30sIGFjY2Vzc29ycyA9IHt9KSB7XG4gICAgc3VwZXIoJ2NvbGxlY3Rpb24nLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogdHJ1ZSxcbiAgICAgIG9wYWNpdHk6IDAuNlxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShBbm5vdGF0ZWRTZWdtZW50LCBhY2Nlc3NvcnMsIHtcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogb3B0aW9ucy5kaXNwbGF5SGFuZGxlcnMsXG4gICAgICBvcGFjaXR5OiBvcHRpb25zLm9wYWNpdHksXG4gICAgfSk7XG5cbiAgICB0aGlzLnNldEJlaGF2aW9yKG5ldyBTZWdtZW50QmVoYXZpb3IoKSk7XG4gIH1cbn1cbiJdfQ==