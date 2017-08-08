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

var _timeContextBehavior = require('../behaviors/time-context-behavior');

var _timeContextBehavior2 = _interopRequireDefault(_timeContextBehavior);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A state to interact directly with layers time contexts.
 *
 * [example usage, see. advanced usage](./examples/layer-waveform.html)
 */
var ContextEditionState = function (_BaseState) {
  (0, _inherits3.default)(ContextEditionState, _BaseState);

  function ContextEditionState(timeline) {
    (0, _classCallCheck3.default)(this, ContextEditionState);
    return (0, _possibleConstructorReturn3.default)(this, (ContextEditionState.__proto__ || (0, _getPrototypeOf2.default)(ContextEditionState)).call(this, timeline));
  }

  (0, _createClass3.default)(ContextEditionState, [{
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
      this.mouseDown = true;
      this.currentTarget = e.target;

      for (var i = 0, l = this.layers.length; i < l; i++) {
        var layer = this.layers[i];
        if (layer.hasElement(e.target)) {
          this.currentLayer = layer;
          break;
        }
      }
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      if (!this.mouseDown || !this.currentLayer) {
        return;
      }

      var layer = this.currentLayer;
      var target = this.currentTarget;

      // in this example the context is stretched when shift is pressed
      if (!e.originalEvent.shiftKey) {
        layer.editContext(e.dx, e.dy, target);
      } else {
        layer.stretchContext(e.dx, e.dy, target);
      }

      this.timeline.tracks.update(layer);
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      this.mouseDown = false;
      this.currentTarget = null;
      this.currentLayer = null;
    }
  }]);
  return ContextEditionState;
}(_baseState2.default);

exports.default = ContextEditionState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRleHQtZWRpdGlvbi1zdGF0ZS5qcyJdLCJuYW1lcyI6WyJDb250ZXh0RWRpdGlvblN0YXRlIiwidGltZWxpbmUiLCJlIiwidHlwZSIsIm9uTW91c2VEb3duIiwib25Nb3VzZU1vdmUiLCJvbk1vdXNlVXAiLCJtb3VzZURvd24iLCJjdXJyZW50VGFyZ2V0IiwidGFyZ2V0IiwiaSIsImwiLCJsYXllcnMiLCJsZW5ndGgiLCJsYXllciIsImhhc0VsZW1lbnQiLCJjdXJyZW50TGF5ZXIiLCJvcmlnaW5hbEV2ZW50Iiwic2hpZnRLZXkiLCJlZGl0Q29udGV4dCIsImR4IiwiZHkiLCJzdHJldGNoQ29udGV4dCIsInRyYWNrcyIsInVwZGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFHQTs7Ozs7SUFLcUJBLG1COzs7QUFDbkIsK0JBQVlDLFFBQVosRUFBc0I7QUFBQTtBQUFBLDJKQUNkQSxRQURjO0FBRXJCOzs7O2dDQUVXQyxDLEVBQUc7QUFDYixjQUFPQSxFQUFFQyxJQUFUO0FBQ0UsYUFBSyxXQUFMO0FBQ0UsZUFBS0MsV0FBTCxDQUFpQkYsQ0FBakI7QUFDQTtBQUNGLGFBQUssV0FBTDtBQUNFLGVBQUtHLFdBQUwsQ0FBaUJILENBQWpCO0FBQ0E7QUFDRixhQUFLLFNBQUw7QUFDRSxlQUFLSSxTQUFMLENBQWVKLENBQWY7QUFDQTtBQVRKO0FBV0Q7OztnQ0FFV0EsQyxFQUFHO0FBQ2IsV0FBS0ssU0FBTCxHQUFpQixJQUFqQjtBQUNBLFdBQUtDLGFBQUwsR0FBcUJOLEVBQUVPLE1BQXZCOztBQUVBLFdBQUssSUFBSUMsSUFBSSxDQUFSLEVBQVdDLElBQUksS0FBS0MsTUFBTCxDQUFZQyxNQUFoQyxFQUF3Q0gsSUFBSUMsQ0FBNUMsRUFBK0NELEdBQS9DLEVBQW9EO0FBQ2xELFlBQU1JLFFBQVEsS0FBS0YsTUFBTCxDQUFZRixDQUFaLENBQWQ7QUFDQSxZQUFJSSxNQUFNQyxVQUFOLENBQWlCYixFQUFFTyxNQUFuQixDQUFKLEVBQWdDO0FBQzlCLGVBQUtPLFlBQUwsR0FBb0JGLEtBQXBCO0FBQ0E7QUFDRDtBQUNGO0FBQ0Y7OztnQ0FFV1osQyxFQUFHO0FBQ2IsVUFBSSxDQUFDLEtBQUtLLFNBQU4sSUFBbUIsQ0FBQyxLQUFLUyxZQUE3QixFQUEyQztBQUFFO0FBQVM7O0FBRXRELFVBQU1GLFFBQVEsS0FBS0UsWUFBbkI7QUFDQSxVQUFNUCxTQUFTLEtBQUtELGFBQXBCOztBQUVBO0FBQ0EsVUFBSSxDQUFDTixFQUFFZSxhQUFGLENBQWdCQyxRQUFyQixFQUErQjtBQUM3QkosY0FBTUssV0FBTixDQUFrQmpCLEVBQUVrQixFQUFwQixFQUF3QmxCLEVBQUVtQixFQUExQixFQUE4QlosTUFBOUI7QUFDRCxPQUZELE1BRU87QUFDTEssY0FBTVEsY0FBTixDQUFxQnBCLEVBQUVrQixFQUF2QixFQUEyQmxCLEVBQUVtQixFQUE3QixFQUFpQ1osTUFBakM7QUFDRDs7QUFFRCxXQUFLUixRQUFMLENBQWNzQixNQUFkLENBQXFCQyxNQUFyQixDQUE0QlYsS0FBNUI7QUFDRDs7OzhCQUVTWixDLEVBQUc7QUFDWCxXQUFLSyxTQUFMLEdBQWlCLEtBQWpCO0FBQ0EsV0FBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUNBLFdBQUtRLFlBQUwsR0FBb0IsSUFBcEI7QUFDRDs7Ozs7a0JBcERrQmhCLG1CIiwiZmlsZSI6ImNvbnRleHQtZWRpdGlvbi1zdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU3RhdGUgZnJvbSAnLi9iYXNlLXN0YXRlJztcbmltcG9ydCBUaW1lQ29udGV4dEJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy90aW1lLWNvbnRleHQtYmVoYXZpb3InO1xuXG5cbi8qKlxuICogQSBzdGF0ZSB0byBpbnRlcmFjdCBkaXJlY3RseSB3aXRoIGxheWVycyB0aW1lIGNvbnRleHRzLlxuICpcbiAqIFtleGFtcGxlIHVzYWdlLCBzZWUuIGFkdmFuY2VkIHVzYWdlXSguL2V4YW1wbGVzL2xheWVyLXdhdmVmb3JtLmh0bWwpXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRleHRFZGl0aW9uU3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2goZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgdGhpcy5tb3VzZURvd24gPSB0cnVlO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IGUudGFyZ2V0O1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmxheWVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGNvbnN0IGxheWVyID0gdGhpcy5sYXllcnNbaV07XG4gICAgICBpZiAobGF5ZXIuaGFzRWxlbWVudChlLnRhcmdldCkpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50TGF5ZXIgPSBsYXllcjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIGlmICghdGhpcy5tb3VzZURvd24gfHzCoCF0aGlzLmN1cnJlbnRMYXllcikgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGxheWVyID0gdGhpcy5jdXJyZW50TGF5ZXI7XG4gICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5jdXJyZW50VGFyZ2V0O1xuXG4gICAgLy8gaW4gdGhpcyBleGFtcGxlIHRoZSBjb250ZXh0IGlzIHN0cmV0Y2hlZCB3aGVuIHNoaWZ0IGlzIHByZXNzZWRcbiAgICBpZiAoIWUub3JpZ2luYWxFdmVudC5zaGlmdEtleSkge1xuICAgICAgbGF5ZXIuZWRpdENvbnRleHQoZS5keCwgZS5keSwgdGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGF5ZXIuc3RyZXRjaENvbnRleHQoZS5keCwgZS5keSwgdGFyZ2V0KTtcbiAgICB9XG5cbiAgICB0aGlzLnRpbWVsaW5lLnRyYWNrcy51cGRhdGUobGF5ZXIpO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50TGF5ZXIgPSBudWxsO1xuICB9XG59XG4iXX0=