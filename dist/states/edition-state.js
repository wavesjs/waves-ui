'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A state to edit shapes in the more general way. Interact only with selected shapes.
 */
var EditionState = function (_BaseState) {
  (0, _inherits3.default)(EditionState, _BaseState);

  function EditionState(timeline) {
    (0, _classCallCheck3.default)(this, EditionState);

    var _this = (0, _possibleConstructorReturn3.default)(this, (EditionState.__proto__ || (0, _getPrototypeOf2.default)(EditionState)).call(this, timeline));

    _this.currentEditedLayer = null;
    _this.currentTarget = null;
    return _this;
  }

  (0, _createClass3.default)(EditionState, [{
    key: 'enter',
    value: function enter() {}
  }, {
    key: 'exit',
    value: function exit() {}
  }, {
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e);
          break;
        case 'mousemove':
          this.onMouseMove(e);
          break;
        case 'mouseup':
          this.onMouseUp(e);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      this.currentTarget = e.target;
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      var _this2 = this;

      this.layers.forEach(function (layer) {
        var items = layer.selectedItems;

        layer.edit(items, e.dx, e.dy, _this2.currentTarget);
        layer.update(items);
      });
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      this.currentEditedLayer = null;
      this.mouseDown = false;
    }
  }]);
  return EditionState;
}(_baseState2.default);

exports.default = EditionState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVkaXRpb24tc3RhdGUuanMiXSwibmFtZXMiOlsiRWRpdGlvblN0YXRlIiwidGltZWxpbmUiLCJjdXJyZW50RWRpdGVkTGF5ZXIiLCJjdXJyZW50VGFyZ2V0IiwiZSIsInR5cGUiLCJvbk1vdXNlRG93biIsIm9uTW91c2VNb3ZlIiwib25Nb3VzZVVwIiwidGFyZ2V0IiwibGF5ZXJzIiwiZm9yRWFjaCIsImxheWVyIiwiaXRlbXMiLCJzZWxlY3RlZEl0ZW1zIiwiZWRpdCIsImR4IiwiZHkiLCJ1cGRhdGUiLCJtb3VzZURvd24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUdBOzs7SUFHTUEsWTs7O0FBQ0osd0JBQVlDLFFBQVosRUFBc0I7QUFBQTs7QUFBQSxrSkFDZEEsUUFEYzs7QUFHcEIsVUFBS0Msa0JBQUwsR0FBMEIsSUFBMUI7QUFDQSxVQUFLQyxhQUFMLEdBQXFCLElBQXJCO0FBSm9CO0FBS3JCOzs7OzRCQUVPLENBQUU7OzsyQkFDSCxDQUFFOzs7Z0NBRUdDLEMsRUFBRztBQUNiLGNBQVFBLEVBQUVDLElBQVY7QUFDRSxhQUFLLFdBQUw7QUFDRSxlQUFLQyxXQUFMLENBQWlCRixDQUFqQjtBQUNBO0FBQ0YsYUFBSyxXQUFMO0FBQ0UsZUFBS0csV0FBTCxDQUFpQkgsQ0FBakI7QUFDQTtBQUNGLGFBQUssU0FBTDtBQUNFLGVBQUtJLFNBQUwsQ0FBZUosQ0FBZjtBQUNBO0FBVEo7QUFXRDs7O2dDQUVXQSxDLEVBQUc7QUFDYixXQUFLRCxhQUFMLEdBQXFCQyxFQUFFSyxNQUF2QjtBQUNEOzs7Z0NBRVdMLEMsRUFBRztBQUFBOztBQUNiLFdBQUtNLE1BQUwsQ0FBWUMsT0FBWixDQUFvQixVQUFDQyxLQUFELEVBQVc7QUFDN0IsWUFBTUMsUUFBUUQsTUFBTUUsYUFBcEI7O0FBRUFGLGNBQU1HLElBQU4sQ0FBV0YsS0FBWCxFQUFrQlQsRUFBRVksRUFBcEIsRUFBd0JaLEVBQUVhLEVBQTFCLEVBQThCLE9BQUtkLGFBQW5DO0FBQ0FTLGNBQU1NLE1BQU4sQ0FBYUwsS0FBYjtBQUNELE9BTEQ7QUFNRDs7OzhCQUVTVCxDLEVBQUc7QUFDWCxXQUFLRixrQkFBTCxHQUEwQixJQUExQjtBQUNBLFdBQUtpQixTQUFMLEdBQWlCLEtBQWpCO0FBQ0Q7Ozs7O2tCQUdZbkIsWSIsImZpbGUiOiJlZGl0aW9uLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuXG5cbi8qKlxuICogQSBzdGF0ZSB0byBlZGl0IHNoYXBlcyBpbiB0aGUgbW9yZSBnZW5lcmFsIHdheS4gSW50ZXJhY3Qgb25seSB3aXRoIHNlbGVjdGVkIHNoYXBlcy5cbiAqL1xuY2xhc3MgRWRpdGlvblN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG5cbiAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgfVxuXG4gIGVudGVyKCkge31cbiAgZXhpdCgpIHt9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gZS50YXJnZXQ7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgdGhpcy5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGNvbnN0IGl0ZW1zID0gbGF5ZXIuc2VsZWN0ZWRJdGVtcztcblxuICAgICAgbGF5ZXIuZWRpdChpdGVtcywgZS5keCwgZS5keSwgdGhpcy5jdXJyZW50VGFyZ2V0KTtcbiAgICAgIGxheWVyLnVwZGF0ZShpdGVtcyk7XG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge1xuICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbnVsbDtcbiAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEVkaXRpb25TdGF0ZTtcbiJdfQ==