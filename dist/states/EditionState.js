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

var _BaseState2 = require('./BaseState');

var _BaseState3 = _interopRequireDefault(_BaseState2);

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
}(_BaseState3.default);

exports.default = EditionState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVkaXRpb25TdGF0ZS5qcyJdLCJuYW1lcyI6WyJFZGl0aW9uU3RhdGUiLCJ0aW1lbGluZSIsImN1cnJlbnRFZGl0ZWRMYXllciIsImN1cnJlbnRUYXJnZXQiLCJlIiwidHlwZSIsIm9uTW91c2VEb3duIiwib25Nb3VzZU1vdmUiLCJvbk1vdXNlVXAiLCJ0YXJnZXQiLCJsYXllcnMiLCJmb3JFYWNoIiwibGF5ZXIiLCJpdGVtcyIsInNlbGVjdGVkSXRlbXMiLCJlZGl0IiwiZHgiLCJkeSIsInVwZGF0ZSIsIm1vdXNlRG93biJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0E7OztJQUdNQSxZOzs7QUFDSix3QkFBWUMsUUFBWixFQUFzQjtBQUFBOztBQUFBLGtKQUNkQSxRQURjOztBQUdwQixVQUFLQyxrQkFBTCxHQUEwQixJQUExQjtBQUNBLFVBQUtDLGFBQUwsR0FBcUIsSUFBckI7QUFKb0I7QUFLckI7Ozs7NEJBRU8sQ0FBRTs7OzJCQUNILENBQUU7OztnQ0FFR0MsQyxFQUFHO0FBQ2IsY0FBUUEsRUFBRUMsSUFBVjtBQUNFLGFBQUssV0FBTDtBQUNFLGVBQUtDLFdBQUwsQ0FBaUJGLENBQWpCO0FBQ0E7QUFDRixhQUFLLFdBQUw7QUFDRSxlQUFLRyxXQUFMLENBQWlCSCxDQUFqQjtBQUNBO0FBQ0YsYUFBSyxTQUFMO0FBQ0UsZUFBS0ksU0FBTCxDQUFlSixDQUFmO0FBQ0E7QUFUSjtBQVdEOzs7Z0NBRVdBLEMsRUFBRztBQUNiLFdBQUtELGFBQUwsR0FBcUJDLEVBQUVLLE1BQXZCO0FBQ0Q7OztnQ0FFV0wsQyxFQUFHO0FBQUE7O0FBQ2IsV0FBS00sTUFBTCxDQUFZQyxPQUFaLENBQW9CLFVBQUNDLEtBQUQsRUFBVztBQUM3QixZQUFNQyxRQUFRRCxNQUFNRSxhQUFwQjs7QUFFQUYsY0FBTUcsSUFBTixDQUFXRixLQUFYLEVBQWtCVCxFQUFFWSxFQUFwQixFQUF3QlosRUFBRWEsRUFBMUIsRUFBOEIsT0FBS2QsYUFBbkM7QUFDQVMsY0FBTU0sTUFBTixDQUFhTCxLQUFiO0FBQ0QsT0FMRDtBQU1EOzs7OEJBRVNULEMsRUFBRztBQUNYLFdBQUtGLGtCQUFMLEdBQTBCLElBQTFCO0FBQ0EsV0FBS2lCLFNBQUwsR0FBaUIsS0FBakI7QUFDRDs7Ozs7a0JBR1luQixZIiwiZmlsZSI6IkVkaXRpb25TdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU3RhdGUgZnJvbSAnLi9CYXNlU3RhdGUnO1xuXG5cbi8qKlxuICogQSBzdGF0ZSB0byBlZGl0IHNoYXBlcyBpbiB0aGUgbW9yZSBnZW5lcmFsIHdheS4gSW50ZXJhY3Qgb25seSB3aXRoIHNlbGVjdGVkIHNoYXBlcy5cbiAqL1xuY2xhc3MgRWRpdGlvblN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG5cbiAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgfVxuXG4gIGVudGVyKCkge31cbiAgZXhpdCgpIHt9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gZS50YXJnZXQ7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgdGhpcy5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGNvbnN0IGl0ZW1zID0gbGF5ZXIuc2VsZWN0ZWRJdGVtcztcblxuICAgICAgbGF5ZXIuZWRpdChpdGVtcywgZS5keCwgZS5keSwgdGhpcy5jdXJyZW50VGFyZ2V0KTtcbiAgICAgIGxheWVyLnVwZGF0ZShpdGVtcyk7XG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge1xuICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbnVsbDtcbiAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEVkaXRpb25TdGF0ZTtcbiJdfQ==