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
}(_BaseState3.default);

exports.default = SimpleEditionState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNpbXBsZUVkaXRpb25TdGF0ZS5qcyJdLCJuYW1lcyI6WyJTaW1wbGVFZGl0aW9uU3RhdGUiLCJ0aW1lbGluZSIsImN1cnJlbnRFZGl0ZWRMYXllciIsImN1cnJlbnRUYXJnZXQiLCJlIiwidHlwZSIsIm9uTW91c2VEb3duIiwib25Nb3VzZU1vdmUiLCJvbk1vdXNlVXAiLCJ0YXJnZXQiLCJsYXllcnMiLCJmb3JFYWNoIiwibGF5ZXIiLCJoYXNFbGVtZW50Iiwib3JpZ2luYWxFdmVudCIsInNoaWZ0S2V5IiwidW5zZWxlY3QiLCJpdGVtIiwiZ2V0SXRlbUZyb21ET01FbGVtZW50IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2VsZWN0IiwiaXRlbXMiLCJzZWxlY3RlZEl0ZW1zIiwiZWRpdCIsImR4IiwiZHkiLCJ1cGRhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUdBOzs7SUFHTUEsa0I7OztBQUNKLDhCQUFZQyxRQUFaLEVBQXNCO0FBQUE7O0FBQUEsOEpBQ2RBLFFBRGM7O0FBR3BCLFVBQUtDLGtCQUFMLEdBQTBCLElBQTFCO0FBQ0EsVUFBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUpvQjtBQUtyQjs7Ozs0QkFFTyxDQUFFOzs7MkJBQ0gsQ0FBRTs7O2dDQUVHQyxDLEVBQUc7QUFDYixjQUFRQSxFQUFFQyxJQUFWO0FBQ0UsYUFBSyxXQUFMO0FBQ0UsZUFBS0MsV0FBTCxDQUFpQkYsQ0FBakI7QUFDQTtBQUNGLGFBQUssV0FBTDtBQUNFLGVBQUtHLFdBQUwsQ0FBaUJILENBQWpCO0FBQ0E7QUFDRixhQUFLLFNBQUw7QUFDRSxlQUFLSSxTQUFMLENBQWVKLENBQWY7QUFDQTtBQVRKO0FBV0Q7OztnQ0FFV0EsQyxFQUFHO0FBQUE7O0FBQ2I7QUFDQSxXQUFLRCxhQUFMLEdBQXFCQyxFQUFFSyxNQUF2Qjs7QUFFQSxXQUFLQyxNQUFMLENBQVlDLE9BQVosQ0FBb0IsVUFBQ0MsS0FBRCxFQUFXO0FBQzdCLFlBQUksQ0FBQ0EsTUFBTUMsVUFBTixDQUFpQixPQUFLVixhQUF0QixDQUFMLEVBQTJDO0FBQUU7QUFBUzs7QUFFdEQsWUFBSSxDQUFDQyxFQUFFVSxhQUFGLENBQWdCQyxRQUFyQixFQUErQjtBQUM3QkgsZ0JBQU1JLFFBQU47QUFDRDs7QUFFRCxZQUFNQyxPQUFPTCxNQUFNTSxxQkFBTixDQUE0QixPQUFLZixhQUFqQyxDQUFiOztBQUVBLFlBQUljLFNBQVMsSUFBYixFQUFtQjtBQUFFO0FBQVM7O0FBRTlCLGVBQUtmLGtCQUFMLEdBQTBCVSxLQUExQjtBQUNBTyw4QkFBc0IsWUFBVztBQUFFUCxnQkFBTVEsTUFBTixDQUFhSCxJQUFiO0FBQXFCLFNBQXhEO0FBQ0QsT0FiRDtBQWNEOzs7Z0NBRVdiLEMsRUFBRztBQUNiLFVBQUksQ0FBQyxLQUFLRixrQkFBVixFQUE4QjtBQUFFO0FBQVM7O0FBRXpDLFVBQU1VLFFBQVEsS0FBS1Ysa0JBQW5CO0FBQ0EsVUFBTW1CLFFBQVFULE1BQU1VLGFBQXBCOztBQUVBVixZQUFNVyxJQUFOLENBQVdGLEtBQVgsRUFBa0JqQixFQUFFb0IsRUFBcEIsRUFBd0JwQixFQUFFcUIsRUFBMUIsRUFBOEIsS0FBS3RCLGFBQW5DO0FBQ0FnQiw0QkFBc0IsWUFBVztBQUFFUCxjQUFNYyxNQUFOLENBQWFMLEtBQWI7QUFBc0IsT0FBekQ7QUFDRDs7OzhCQUVTakIsQyxFQUFHO0FBQ1gsV0FBS0Ysa0JBQUwsR0FBMEIsSUFBMUI7QUFDRDs7Ozs7a0JBR1lGLGtCIiwiZmlsZSI6IlNpbXBsZUVkaXRpb25TdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU3RhdGUgZnJvbSAnLi9CYXNlU3RhdGUnO1xuXG5cbi8qKlxuICogQSBzdGF0ZSB0byBzZWxlY3QgYW5kIGVkaXQgc2hhcGVzIGluIGEgc2ltcGxlIHdheS4gKGtpbmQgb2YgcGx1ZyBuIHBsYXkgc3RhdGUpXG4gKi9cbmNsYXNzIFNpbXBsZUVkaXRpb25TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XG4gIH1cblxuICBlbnRlcigpIHt9XG4gIGV4aXQoKSB7fVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIC8vIGtlZXAgdGFyZ2V0IGNvbnNpc3RlbnQgd2l0aCBtb3VzZSBkb3duXG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gZS50YXJnZXQ7XG5cbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgaWYgKCFsYXllci5oYXNFbGVtZW50KHRoaXMuY3VycmVudFRhcmdldCkpIHsgcmV0dXJuOyB9XG5cbiAgICAgIGlmICghZS5vcmlnaW5hbEV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgIGxheWVyLnVuc2VsZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGl0ZW0gPSBsYXllci5nZXRJdGVtRnJvbURPTUVsZW1lbnQodGhpcy5jdXJyZW50VGFyZ2V0KTtcblxuICAgICAgaWYgKGl0ZW0gPT09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbGF5ZXI7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7IGxheWVyLnNlbGVjdChpdGVtKTsgfSk7XG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgaWYgKCF0aGlzLmN1cnJlbnRFZGl0ZWRMYXllcikgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGxheWVyID0gdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXI7XG4gICAgY29uc3QgaXRlbXMgPSBsYXllci5zZWxlY3RlZEl0ZW1zO1xuXG4gICAgbGF5ZXIuZWRpdChpdGVtcywgZS5keCwgZS5keSwgdGhpcy5jdXJyZW50VGFyZ2V0KTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7IGxheWVyLnVwZGF0ZShpdGVtcyk7IH0pO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2ltcGxlRWRpdGlvblN0YXRlO1xuIl19