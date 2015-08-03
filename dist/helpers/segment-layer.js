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

    options = _Object$assign({ displayHandlers: true }, options);

    this.configureShape(_shapesSegment2['default'], accessors, {
      displayHandlers: options.displayHandlers
    });

    this.setBehavior(new _behaviorsSegmentBehavior2['default']());
  }

  return SegmentLayer;
})(_coreLayer2['default']);

exports['default'] = SegmentLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9oZWxwZXJzL3NlZ21lbnQtbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBa0IsZUFBZTs7Ozs2QkFDYixtQkFBbUI7Ozs7d0NBQ1gsK0JBQStCOzs7O0lBR3RDLFlBQVk7WUFBWixZQUFZOztBQUNwQixXQURRLFlBQVksQ0FDbkIsSUFBSSxFQUFnQztRQUE5QixPQUFPLHlEQUFHLEVBQUU7UUFBRSxTQUFTLHlEQUFHLEVBQUU7OzBCQUQzQixZQUFZOztBQUU3QiwrQkFGaUIsWUFBWSw2Q0FFdkIsWUFBWSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7O0FBRW5DLFdBQU8sR0FBRyxlQUFjLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUU1RCxRQUFJLENBQUMsY0FBYyw2QkFBVSxTQUFTLEVBQUU7QUFDdEMscUJBQWUsRUFBRSxPQUFPLENBQUMsZUFBZTtLQUN6QyxDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLFdBQVcsQ0FBQywyQ0FBcUIsQ0FBQyxDQUFDO0dBQ3pDOztTQVhrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiJlczYvaGVscGVycy9zZWdtZW50LWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IFNlZ21lbnQgZnJvbSAnLi4vc2hhcGVzL3NlZ21lbnQnO1xuaW1wb3J0IFNlZ21lbnRCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvc2VnbWVudC1iZWhhdmlvcic7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VnbWVudExheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30sIGFjY2Vzc29ycyA9IHt9KSB7XG4gICAgc3VwZXIoJ2NvbGxlY3Rpb24nLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHsgZGlzcGxheUhhbmRsZXJzOiB0cnVlIH0sIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShTZWdtZW50LCBhY2Nlc3NvcnMsIHtcbiAgICAgIGRpc3BsYXlIYW5kbGVyczogb3B0aW9ucy5kaXNwbGF5SGFuZGxlcnNcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0QmVoYXZpb3IobmV3IFNlZ21lbnRCZWhhdmlvcigpKTtcbiAgfVxufVxuIl19