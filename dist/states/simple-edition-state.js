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
 * A state to select and edit shapes in a simple way. (kind of plug n play state)
 */
var SimpleEditionState = function (_BaseState) {
  (0, _inherits3.default)(SimpleEditionState, _BaseState);

  function SimpleEditionState(timeline) {
    (0, _classCallCheck3.default)(this, SimpleEditionState);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SimpleEditionState.__proto__ || (0, _getPrototypeOf2.default)(SimpleEditionState)).call(this, timeline));

    _this.currentEditedLayer = null;
    _this.currentTarget = null;
    return _this;
  }

  (0, _createClass3.default)(SimpleEditionState, [{
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
      var _this2 = this;

      // keep target consistent with mouse down
      this.currentTarget = e.target;

      this.layers.forEach(function (layer) {
        if (!layer.hasElement(_this2.currentTarget)) {
          return;
        }

        if (!e.originalEvent.shiftKey) {
          layer.unselect();
        }

        var item = layer.getItemFromDOMElement(_this2.currentTarget);

        if (item === null) {
          return;
        }

        _this2.currentEditedLayer = layer;
        requestAnimationFrame(function () {
          layer.select(item);
        });
      });
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      if (!this.currentEditedLayer) {
        return;
      }

      var layer = this.currentEditedLayer;
      var items = layer.selectedItems;

      layer.edit(items, e.dx, e.dy, this.currentTarget);
      requestAnimationFrame(function () {
        layer.update(items);
      });
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      this.currentEditedLayer = null;
    }
  }]);
  return SimpleEditionState;
}(_baseState2.default);

exports.default = SimpleEditionState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpbXBsZS1lZGl0aW9uLXN0YXRlLmpzIl0sIm5hbWVzIjpbIlNpbXBsZUVkaXRpb25TdGF0ZSIsInRpbWVsaW5lIiwiY3VycmVudEVkaXRlZExheWVyIiwiY3VycmVudFRhcmdldCIsImUiLCJ0eXBlIiwib25Nb3VzZURvd24iLCJvbk1vdXNlTW92ZSIsIm9uTW91c2VVcCIsInRhcmdldCIsImxheWVycyIsImZvckVhY2giLCJsYXllciIsImhhc0VsZW1lbnQiLCJvcmlnaW5hbEV2ZW50Iiwic2hpZnRLZXkiLCJ1bnNlbGVjdCIsIml0ZW0iLCJnZXRJdGVtRnJvbURPTUVsZW1lbnQiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJzZWxlY3QiLCJpdGVtcyIsInNlbGVjdGVkSXRlbXMiLCJlZGl0IiwiZHgiLCJkeSIsInVwZGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0E7OztJQUdxQkEsa0I7OztBQUNuQiw4QkFBWUMsUUFBWixFQUFzQjtBQUFBOztBQUFBLDhKQUNkQSxRQURjOztBQUdwQixVQUFLQyxrQkFBTCxHQUEwQixJQUExQjtBQUNBLFVBQUtDLGFBQUwsR0FBcUIsSUFBckI7QUFKb0I7QUFLckI7Ozs7NEJBRU8sQ0FBRTs7OzJCQUNILENBQUU7OztnQ0FFR0MsQyxFQUFHO0FBQ2IsY0FBUUEsRUFBRUMsSUFBVjtBQUNFLGFBQUssV0FBTDtBQUNFLGVBQUtDLFdBQUwsQ0FBaUJGLENBQWpCO0FBQ0E7QUFDRixhQUFLLFdBQUw7QUFDRSxlQUFLRyxXQUFMLENBQWlCSCxDQUFqQjtBQUNBO0FBQ0YsYUFBSyxTQUFMO0FBQ0UsZUFBS0ksU0FBTCxDQUFlSixDQUFmO0FBQ0E7QUFUSjtBQVdEOzs7Z0NBRVdBLEMsRUFBRztBQUFBOztBQUNiO0FBQ0EsV0FBS0QsYUFBTCxHQUFxQkMsRUFBRUssTUFBdkI7O0FBRUEsV0FBS0MsTUFBTCxDQUFZQyxPQUFaLENBQW9CLFVBQUNDLEtBQUQsRUFBVztBQUM3QixZQUFJLENBQUNBLE1BQU1DLFVBQU4sQ0FBaUIsT0FBS1YsYUFBdEIsQ0FBTCxFQUEyQztBQUFFO0FBQVM7O0FBRXRELFlBQUksQ0FBQ0MsRUFBRVUsYUFBRixDQUFnQkMsUUFBckIsRUFBK0I7QUFDN0JILGdCQUFNSSxRQUFOO0FBQ0Q7O0FBRUQsWUFBTUMsT0FBT0wsTUFBTU0scUJBQU4sQ0FBNEIsT0FBS2YsYUFBakMsQ0FBYjs7QUFFQSxZQUFJYyxTQUFTLElBQWIsRUFBbUI7QUFBRTtBQUFTOztBQUU5QixlQUFLZixrQkFBTCxHQUEwQlUsS0FBMUI7QUFDQU8sOEJBQXNCLFlBQVc7QUFBRVAsZ0JBQU1RLE1BQU4sQ0FBYUgsSUFBYjtBQUFxQixTQUF4RDtBQUNELE9BYkQ7QUFjRDs7O2dDQUVXYixDLEVBQUc7QUFDYixVQUFJLENBQUMsS0FBS0Ysa0JBQVYsRUFBOEI7QUFBRTtBQUFTOztBQUV6QyxVQUFNVSxRQUFRLEtBQUtWLGtCQUFuQjtBQUNBLFVBQU1tQixRQUFRVCxNQUFNVSxhQUFwQjs7QUFFQVYsWUFBTVcsSUFBTixDQUFXRixLQUFYLEVBQWtCakIsRUFBRW9CLEVBQXBCLEVBQXdCcEIsRUFBRXFCLEVBQTFCLEVBQThCLEtBQUt0QixhQUFuQztBQUNBZ0IsNEJBQXNCLFlBQVc7QUFBRVAsY0FBTWMsTUFBTixDQUFhTCxLQUFiO0FBQXNCLE9BQXpEO0FBQ0Q7Ozs4QkFFU2pCLEMsRUFBRztBQUNYLFdBQUtGLGtCQUFMLEdBQTBCLElBQTFCO0FBQ0Q7Ozs7O2tCQXpEa0JGLGtCIiwiZmlsZSI6InNpbXBsZS1lZGl0aW9uLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuXG5cbi8qKlxuICogQSBzdGF0ZSB0byBzZWxlY3QgYW5kIGVkaXQgc2hhcGVzIGluIGEgc2ltcGxlIHdheS4gKGtpbmQgb2YgcGx1ZyBuIHBsYXkgc3RhdGUpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpbXBsZUVkaXRpb25TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XG4gIH1cblxuICBlbnRlcigpIHt9XG4gIGV4aXQoKSB7fVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIC8vIGtlZXAgdGFyZ2V0IGNvbnNpc3RlbnQgd2l0aCBtb3VzZSBkb3duXG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gZS50YXJnZXQ7XG5cbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgaWYgKCFsYXllci5oYXNFbGVtZW50KHRoaXMuY3VycmVudFRhcmdldCkpIHsgcmV0dXJuOyB9XG5cbiAgICAgIGlmICghZS5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgIGxheWVyLnVuc2VsZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGl0ZW0gPSBsYXllci5nZXRJdGVtRnJvbURPTUVsZW1lbnQodGhpcy5jdXJyZW50VGFyZ2V0KTtcblxuICAgICAgaWYgKGl0ZW0gPT09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbGF5ZXI7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7IGxheWVyLnNlbGVjdChpdGVtKTsgfSk7XG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgaWYgKCF0aGlzLmN1cnJlbnRFZGl0ZWRMYXllcikgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGxheWVyID0gdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXI7XG4gICAgY29uc3QgaXRlbXMgPSBsYXllci5zZWxlY3RlZEl0ZW1zO1xuXG4gICAgbGF5ZXIuZWRpdChpdGVtcywgZS5keCwgZS5keSwgdGhpcy5jdXJyZW50VGFyZ2V0KTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7IGxheWVyLnVwZGF0ZShpdGVtcyk7IH0pO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IG51bGw7XG4gIH1cbn1cbiJdfQ==