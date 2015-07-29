'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _coreLayer = require('../core/layer');

var _coreLayer2 = _interopRequireDefault(_coreLayer);

var _shapesCursor = require('../shapes/cursor');

var _shapesCursor2 = _interopRequireDefault(_shapesCursor);

var CursorLayer = (function (_Layer) {
  function CursorLayer() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, CursorLayer);

    var data = { currentPosition: 0 };

    _get(Object.getPrototypeOf(CursorLayer.prototype), 'constructor', this).call(this, 'entity', data, options);

    this.configureShape(_shapesCursor2['default'], { x: function x(d) {
        return d.currentPosition;
      } }, {
      color: options.color
    });
  }

  _inherits(CursorLayer, _Layer);

  _createClass(CursorLayer, [{
    key: 'currentPosition',
    set: function (value) {
      this.data.currentPosition = value;
    },
    get: function () {
      return this.data.currentPosition;
    }
  }]);

  return CursorLayer;
})(_coreLayer2['default']);

exports['default'] = CursorLayer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O3lCQUFrQixlQUFlOzs7OzRCQUNkLGtCQUFrQjs7OztJQUdoQixXQUFXO0FBQ25CLFdBRFEsV0FBVyxHQUNKO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFETCxXQUFXOztBQUU1QixRQUFNLElBQUksR0FBRyxFQUFFLGVBQWUsRUFBRSxDQUFDLEVBQUUsQ0FBQzs7QUFFcEMsK0JBSmlCLFdBQVcsNkNBSXRCLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFOztBQUUvQixRQUFJLENBQUMsY0FBYyw0QkFBUyxFQUFFLENBQUMsRUFBRSxXQUFDLENBQUM7ZUFBSyxDQUFDLENBQUMsZUFBZTtPQUFBLEVBQUUsRUFBRTtBQUMzRCxXQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUs7S0FDckIsQ0FBQyxDQUFDO0dBQ0o7O1lBVGtCLFdBQVc7O2VBQVgsV0FBVzs7U0FXWCxVQUFDLEtBQUssRUFBRTtBQUN6QixVQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7S0FDbkM7U0FFa0IsWUFBRztBQUNwQixhQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO0tBQ2xDOzs7U0FqQmtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6ImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGF5ZXIgZnJvbSAnLi4vY29yZS9sYXllcic7XG5pbXBvcnQgQ3Vyc29yIGZyb20gJy4uL3NoYXBlcy9jdXJzb3InO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1cnNvckxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBkYXRhID0geyBjdXJyZW50UG9zaXRpb246IDAgfTtcblxuICAgIHN1cGVyKCdlbnRpdHknLCBkYXRhLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2hhcGUoQ3Vyc29yLCB7IHg6IChkKSA9PiBkLmN1cnJlbnRQb3NpdGlvbiB9LCB7XG4gICAgICBjb2xvcjogb3B0aW9ucy5jb2xvclxuICAgIH0pO1xuICB9XG5cbiAgc2V0IGN1cnJlbnRQb3NpdGlvbih2YWx1ZSkge1xuICAgIHRoaXMuZGF0YS5jdXJyZW50UG9zaXRpb24gPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBjdXJyZW50UG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS5jdXJyZW50UG9zaXRpb247XG4gIH1cbn1cbiJdfQ==