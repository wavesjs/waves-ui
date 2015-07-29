'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

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

    var data = { currentPosition: 0 };

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
      this.data.currentPosition = value;
    },
    get: function get() {
      return this.data.currentPosition;
    }
  }]);

  return CursorLayer;
})(_coreLayer2['default']);

exports['default'] = CursorLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9oZWxwZXJzL2N1cnNvci1sYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUFrQixlQUFlOzs7OzRCQUNkLGtCQUFrQjs7OztJQUdoQixXQUFXO1lBQVgsV0FBVzs7QUFDbkIsV0FEUSxXQUFXLEdBQ0o7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQURMLFdBQVc7O0FBRTVCLFFBQU0sSUFBSSxHQUFHLEVBQUUsZUFBZSxFQUFFLENBQUMsRUFBRSxDQUFDOztBQUVwQywrQkFKaUIsV0FBVyw2Q0FJdEIsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7O0FBRS9CLFFBQUksQ0FBQyxjQUFjLDRCQUFTLEVBQUUsQ0FBQyxFQUFFLFdBQUMsQ0FBQztlQUFLLENBQUMsQ0FBQyxlQUFlO09BQUEsRUFBRSxFQUFFO0FBQzNELFdBQUssRUFBRSxPQUFPLENBQUMsS0FBSztLQUNyQixDQUFDLENBQUM7R0FDSjs7ZUFUa0IsV0FBVzs7U0FXWCxhQUFDLEtBQUssRUFBRTtBQUN6QixVQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7S0FDbkM7U0FFa0IsZUFBRztBQUNwQixhQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO0tBQ2xDOzs7U0FqQmtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6ImVzNi9oZWxwZXJzL2N1cnNvci1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcbmltcG9ydCBDdXJzb3IgZnJvbSAnLi4vc2hhcGVzL2N1cnNvcic7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3Vyc29yTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGRhdGEgPSB7IGN1cnJlbnRQb3NpdGlvbjogMCB9O1xuXG4gICAgc3VwZXIoJ2VudGl0eScsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShDdXJzb3IsIHsgeDogKGQpID0+IGQuY3VycmVudFBvc2l0aW9uIH0sIHtcbiAgICAgIGNvbG9yOiBvcHRpb25zLmNvbG9yXG4gICAgfSk7XG4gIH1cblxuICBzZXQgY3VycmVudFBvc2l0aW9uKHZhbHVlKSB7XG4gICAgdGhpcy5kYXRhLmN1cnJlbnRQb3NpdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhLmN1cnJlbnRQb3NpdGlvbjtcbiAgfVxufVxuIl19