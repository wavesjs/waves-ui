'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _axisAxisLayer = require('../axis/axis-layer');

var _axisAxisLayer2 = _interopRequireDefault(_axisAxisLayer);

var _shapesTicks = require('../shapes/ticks');

var _shapesTicks2 = _interopRequireDefault(_shapesTicks);

var _axisTimeAxisGenerator = require('../axis/time-axis-generator');

var _axisTimeAxisGenerator2 = _interopRequireDefault(_axisTimeAxisGenerator);

/**
 * Helper to create a time axis layer
 *
 * [example usage](./examples/layer-axis.html)
 */

var TimeAxisLayer = (function (_AxisLayer) {
  _inherits(TimeAxisLayer, _AxisLayer);

  /**
   * @param {Object} options - An object to configure the layer.
   */

  function TimeAxisLayer(options) {
    _classCallCheck(this, TimeAxisLayer);

    options = _Object$assign({ color: 'steelblue' }, options);
    _get(Object.getPrototypeOf(TimeAxisLayer.prototype), 'constructor', this).call(this, (0, _axisTimeAxisGenerator2['default'])(), options);

    this.configureShape(_shapesTicks2['default'], {}, {
      color: options.color
    });
  }

  return TimeAxisLayer;
})(_axisAxisLayer2['default']);

exports['default'] = TimeAxisLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL3RpbWUtYXhpcy1sYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzZCQUFzQixvQkFBb0I7Ozs7MkJBQ3hCLGlCQUFpQjs7OztxQ0FDTCw2QkFBNkI7Ozs7Ozs7Ozs7SUFRdEMsYUFBYTtZQUFiLGFBQWE7Ozs7OztBQUlyQixXQUpRLGFBQWEsQ0FJcEIsT0FBTyxFQUFFOzBCQUpGLGFBQWE7O0FBSzlCLFdBQU8sR0FBRyxlQUFjLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3pELCtCQU5pQixhQUFhLDZDQU14Qix5Q0FBbUIsRUFBRSxPQUFPLEVBQUU7O0FBRXBDLFFBQUksQ0FBQyxjQUFjLDJCQUFRLEVBQUUsRUFBRTtBQUM3QixXQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUs7S0FDckIsQ0FBQyxDQUFDO0dBQ0o7O1NBWGtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6InNyYy9oZWxwZXJzL3RpbWUtYXhpcy1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBeGlzTGF5ZXIgZnJvbSAnLi4vYXhpcy9heGlzLWxheWVyJztcbmltcG9ydCBUaWNrcyBmcm9tICcuLi9zaGFwZXMvdGlja3MnO1xuaW1wb3J0IHRpbWVBeGlzR2VuZXJhdG9yIGZyb20gJy4uL2F4aXMvdGltZS1heGlzLWdlbmVyYXRvcic7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY3JlYXRlIGEgdGltZSBheGlzIGxheWVyXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYXhpcy5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lQXhpc0xheWVyIGV4dGVuZHMgQXhpc0xheWVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgbGF5ZXIuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyBjb2xvcjogJ3N0ZWVsYmx1ZScgfSwgb3B0aW9ucyk7XG4gICAgc3VwZXIodGltZUF4aXNHZW5lcmF0b3IoKSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKFRpY2tzLCB7fSwge1xuICAgICAgY29sb3I6IG9wdGlvbnMuY29sb3JcbiAgICB9KTtcbiAgfVxufSJdfQ==