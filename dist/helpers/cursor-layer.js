'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesCursor = require('../shapes/cursor');

var _shapesCursor2 = _interopRequireDefault(_shapesCursor);

var CursorLayer = (function (_Layer) {
  _inherits(CursorLayer, _Layer);

  function CursorLayer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, CursorLayer);

    var defaults = {
      color: 'red',
      hittable: false };

    // kind of pass through layer
    var data = { currentPosition: 0 };

    options = _Object$assign(defaults, options);
    _get(Object.getPrototypeOf(CursorLayer.prototype), 'constructor', this).call(this, 'entity', data, options);

    this.configureShape(_shapesCursor2['default'], { x: function x(d) {
        return d.currentPosition;
      } }, {
      color: options.color
    });
  }

  _createClass(CursorLayer, [{
    key: 'currentPosition',
    set: function set(value) {
      this.data[0].currentPosition = value;
    },
    get: function get() {
      return this.data[0].currentPosition;
    }
  }]);

  return CursorLayer;
})(_coreLayer2['default']);

exports['default'] = CursorLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGFwZXMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O3lCQUFrQixlQUFlOzs7OzRCQUNkLGtCQUFrQjs7OztJQUdoQixXQUFXO1lBQVgsV0FBVzs7QUFDbkIsV0FEUSxXQUFXLEdBQ0o7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQURMLFdBQVc7O0FBRTVCLFFBQU0sUUFBUSxHQUFHO0FBQ2YsV0FBSyxFQUFFLEtBQUs7QUFDWixjQUFRLEVBQUUsS0FBSyxFQUNoQixDQUFDOzs7QUFFRixRQUFNLElBQUksR0FBRyxFQUFFLGVBQWUsRUFBRSxDQUFDLEVBQUUsQ0FBQzs7QUFFcEMsV0FBTyxHQUFHLGVBQWMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzNDLCtCQVZpQixXQUFXLDZDQVV0QixRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTs7QUFFL0IsUUFBSSxDQUFDLGNBQWMsNEJBQVMsRUFBRSxDQUFDLEVBQUUsV0FBQyxDQUFDO2VBQUssQ0FBQyxDQUFDLGVBQWU7T0FBQSxFQUFFLEVBQUU7QUFDM0QsV0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO0tBQ3JCLENBQUMsQ0FBQztHQUNKOztlQWZrQixXQUFXOztTQWlCWCxhQUFDLEtBQUssRUFBRTtBQUN6QixVQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7S0FDdEM7U0FFa0IsZUFBRztBQUNwQixhQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDO0tBQ3JDOzs7U0F2QmtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6InNyYy9zaGFwZXMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgQ3Vyc29yIGZyb20gJy4uL3NoYXBlcy9jdXJzb3InO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1cnNvckxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGNvbG9yOiAncmVkJyxcbiAgICAgIGhpdHRhYmxlOiBmYWxzZSwgLy8ga2luZCBvZiBwYXNzIHRocm91Z2ggbGF5ZXJcbiAgICB9O1xuXG4gICAgY29uc3QgZGF0YSA9IHsgY3VycmVudFBvc2l0aW9uOiAwIH07XG5cbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgc3VwZXIoJ2VudGl0eScsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShDdXJzb3IsIHsgeDogKGQpID0+IGQuY3VycmVudFBvc2l0aW9uIH0sIHtcbiAgICAgIGNvbG9yOiBvcHRpb25zLmNvbG9yXG4gICAgfSk7XG4gIH1cblxuICBzZXQgY3VycmVudFBvc2l0aW9uKHZhbHVlKSB7XG4gICAgdGhpcy5kYXRhWzBdLmN1cnJlbnRQb3NpdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhWzBdLmN1cnJlbnRQb3NpdGlvbjtcbiAgfVxufVxuIl19