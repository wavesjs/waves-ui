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

/**
 * Helper to create a breakpoint function layer.
 *
 * [example usage](./examples/layer-breakpoint.html)
 */

var BreakpointLayer = (function (_Layer) {
  _inherits(BreakpointLayer, _Layer);

  /**
   * @param {Array} data - The data to render.
   * @param {Object} options - An object to configure the layer.
   * @param {Object} accessors - The accessors to configure the mapping
   *    between shapes and data.
   */

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL2JyZWFrcG9pbnQtbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7MkNBQStCLGtDQUFrQzs7Ozt5QkFDakQsZUFBZTs7Ozt5QkFDYixlQUFlOzs7OzBCQUNoQixnQkFBZ0I7Ozs7Ozs7Ozs7SUFRWixlQUFlO1lBQWYsZUFBZTs7Ozs7Ozs7O0FBT3ZCLFdBUFEsZUFBZSxDQU90QixJQUFJLEVBQWdDO1FBQTlCLE9BQU8seURBQUcsRUFBRTtRQUFFLFNBQVMseURBQUcsRUFBRTs7MEJBUDNCLGVBQWU7O0FBUWhDLCtCQVJpQixlQUFlLDZDQVExQixZQUFZLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTs7QUFFbkMsUUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztBQUM1QixRQUFJLGtCQUFrQixHQUFHLEVBQUUsQ0FBQzs7QUFFNUIsUUFBSSxLQUFLLEVBQUU7QUFDVCxlQUFTLENBQUMsS0FBSyxHQUFHLFlBQVc7QUFBRSxlQUFPLEtBQUssQ0FBQztPQUFFLENBQUM7QUFDL0Msd0JBQWtCLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNsQzs7QUFFRCxRQUFJLENBQUMsb0JBQW9CLDBCQUFPLFNBQVMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0FBQy9ELFFBQUksQ0FBQyxjQUFjLHlCQUFNLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN4QyxRQUFJLENBQUMsV0FBVyxDQUFDLDhDQUF3QixDQUFDLENBQUM7R0FDNUM7O1NBckJrQixlQUFlOzs7cUJBQWYsZUFBZSIsImZpbGUiOiJzcmMvaGVscGVycy9icmVha3BvaW50LWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJyZWFrcG9pbnRCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvYnJlYWtwb2ludC1iZWhhdmlvcic7XG5pbXBvcnQgRG90IGZyb20gJy4uL3NoYXBlcy9kb3QnO1xuaW1wb3J0IExheWVyIGZyb20gJy4uL2NvcmUvbGF5ZXInO1xuaW1wb3J0IExpbmUgZnJvbSAnLi4vc2hhcGVzL2xpbmUnO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNyZWF0ZSBhIGJyZWFrcG9pbnQgZnVuY3Rpb24gbGF5ZXIuXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvbGF5ZXItYnJlYWtwb2ludC5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcmVha3BvaW50TGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhIC0gVGhlIGRhdGEgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGxheWVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYWNjZXNzb3JzIC0gVGhlIGFjY2Vzc29ycyB0byBjb25maWd1cmUgdGhlIG1hcHBpbmdcbiAgICogICAgYmV0d2VlbiBzaGFwZXMgYW5kIGRhdGEuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkYXRhLCBvcHRpb25zID0ge30sIGFjY2Vzc29ycyA9IHt9KSB7XG4gICAgc3VwZXIoJ2NvbGxlY3Rpb24nLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IGNvbG9yID0gb3B0aW9ucy5jb2xvcjtcbiAgICBsZXQgY29tbW9uU2hhcGVPcHRpb25zID0ge307XG5cbiAgICBpZiAoY29sb3IpIHtcbiAgICAgIGFjY2Vzc29ycy5jb2xvciA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gY29sb3I7IH07XG4gICAgICBjb21tb25TaGFwZU9wdGlvbnMuY29sb3IgPSBjb2xvcjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ3VyZUNvbW1vblNoYXBlKExpbmUsIGFjY2Vzc29ycywgY29tbW9uU2hhcGVPcHRpb25zKTtcbiAgICB0aGlzLmNvbmZpZ3VyZVNoYXBlKERvdCwgYWNjZXNzb3JzLCB7fSk7XG4gICAgdGhpcy5zZXRCZWhhdmlvcihuZXcgQnJlYWtwb2ludEJlaGF2aW9yKCkpO1xuICB9XG59XG4iXX0=