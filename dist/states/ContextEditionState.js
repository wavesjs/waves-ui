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

var _TimeContextBehavior = require('../behaviors/TimeContextBehavior');

var _TimeContextBehavior2 = _interopRequireDefault(_TimeContextBehavior);

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
}(_BaseState3.default);

exports.default = ContextEditionState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbnRleHRFZGl0aW9uU3RhdGUuanMiXSwibmFtZXMiOlsiQ29udGV4dEVkaXRpb25TdGF0ZSIsInRpbWVsaW5lIiwiZSIsInR5cGUiLCJvbk1vdXNlRG93biIsIm9uTW91c2VNb3ZlIiwib25Nb3VzZVVwIiwibW91c2VEb3duIiwiY3VycmVudFRhcmdldCIsInRhcmdldCIsImkiLCJsIiwibGF5ZXJzIiwibGVuZ3RoIiwibGF5ZXIiLCJoYXNFbGVtZW50IiwiY3VycmVudExheWVyIiwib3JpZ2luYWxFdmVudCIsInNoaWZ0S2V5IiwiZWRpdENvbnRleHQiLCJkeCIsImR5Iiwic3RyZXRjaENvbnRleHQiLCJ0cmFja3MiLCJ1cGRhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBR0E7Ozs7O0lBS01BLG1COzs7QUFDSiwrQkFBWUMsUUFBWixFQUFzQjtBQUFBO0FBQUEsMkpBQ2RBLFFBRGM7QUFFckI7Ozs7Z0NBRVdDLEMsRUFBRztBQUNiLGNBQU9BLEVBQUVDLElBQVQ7QUFDRSxhQUFLLFdBQUw7QUFDRSxlQUFLQyxXQUFMLENBQWlCRixDQUFqQjtBQUNBO0FBQ0YsYUFBSyxXQUFMO0FBQ0UsZUFBS0csV0FBTCxDQUFpQkgsQ0FBakI7QUFDQTtBQUNGLGFBQUssU0FBTDtBQUNFLGVBQUtJLFNBQUwsQ0FBZUosQ0FBZjtBQUNBO0FBVEo7QUFXRDs7O2dDQUVXQSxDLEVBQUc7QUFDYixXQUFLSyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsV0FBS0MsYUFBTCxHQUFxQk4sRUFBRU8sTUFBdkI7O0FBRUEsV0FBSyxJQUFJQyxJQUFJLENBQVIsRUFBV0MsSUFBSSxLQUFLQyxNQUFMLENBQVlDLE1BQWhDLEVBQXdDSCxJQUFJQyxDQUE1QyxFQUErQ0QsR0FBL0MsRUFBb0Q7QUFDbEQsWUFBTUksUUFBUSxLQUFLRixNQUFMLENBQVlGLENBQVosQ0FBZDtBQUNBLFlBQUlJLE1BQU1DLFVBQU4sQ0FBaUJiLEVBQUVPLE1BQW5CLENBQUosRUFBZ0M7QUFDOUIsZUFBS08sWUFBTCxHQUFvQkYsS0FBcEI7QUFDQTtBQUNEO0FBQ0Y7QUFDRjs7O2dDQUVXWixDLEVBQUc7QUFDYixVQUFJLENBQUMsS0FBS0ssU0FBTixJQUFtQixDQUFDLEtBQUtTLFlBQTdCLEVBQTJDO0FBQUU7QUFBUzs7QUFFdEQsVUFBTUYsUUFBUSxLQUFLRSxZQUFuQjtBQUNBLFVBQU1QLFNBQVMsS0FBS0QsYUFBcEI7O0FBRUE7QUFDQSxVQUFJLENBQUNOLEVBQUVlLGFBQUYsQ0FBZ0JDLFFBQXJCLEVBQStCO0FBQzdCSixjQUFNSyxXQUFOLENBQWtCakIsRUFBRWtCLEVBQXBCLEVBQXdCbEIsRUFBRW1CLEVBQTFCLEVBQThCWixNQUE5QjtBQUNELE9BRkQsTUFFTztBQUNMSyxjQUFNUSxjQUFOLENBQXFCcEIsRUFBRWtCLEVBQXZCLEVBQTJCbEIsRUFBRW1CLEVBQTdCLEVBQWlDWixNQUFqQztBQUNEOztBQUVELFdBQUtSLFFBQUwsQ0FBY3NCLE1BQWQsQ0FBcUJDLE1BQXJCLENBQTRCVixLQUE1QjtBQUNEOzs7OEJBRVNaLEMsRUFBRztBQUNYLFdBQUtLLFNBQUwsR0FBaUIsS0FBakI7QUFDQSxXQUFLQyxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsV0FBS1EsWUFBTCxHQUFvQixJQUFwQjtBQUNEOzs7OztrQkFHWWhCLG1CIiwiZmlsZSI6IkNvbnRleHRFZGl0aW9uU3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVN0YXRlIGZyb20gJy4vQmFzZVN0YXRlJztcbmltcG9ydCBUaW1lQ29udGV4dEJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy9UaW1lQ29udGV4dEJlaGF2aW9yJztcblxuXG4vKipcbiAqIEEgc3RhdGUgdG8gaW50ZXJhY3QgZGlyZWN0bHkgd2l0aCBsYXllcnMgdGltZSBjb250ZXh0cy5cbiAqXG4gKiBbZXhhbXBsZSB1c2FnZSwgc2VlLiBhZHZhbmNlZCB1c2FnZV0oLi9leGFtcGxlcy9sYXllci13YXZlZm9ybS5odG1sKVxuICovXG5jbGFzcyBDb250ZXh0RWRpdGlvblN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMubW91c2VEb3duID0gdHJ1ZTtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBlLnRhcmdldDtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5sYXllcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBjb25zdCBsYXllciA9IHRoaXMubGF5ZXJzW2ldO1xuICAgICAgaWYgKGxheWVyLmhhc0VsZW1lbnQoZS50YXJnZXQpKSB7XG4gICAgICAgIHRoaXMuY3VycmVudExheWVyID0gbGF5ZXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICBpZiAoIXRoaXMubW91c2VEb3duIHx8wqAhdGhpcy5jdXJyZW50TGF5ZXIpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBsYXllciA9IHRoaXMuY3VycmVudExheWVyO1xuICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuY3VycmVudFRhcmdldDtcblxuICAgIC8vIGluIHRoaXMgZXhhbXBsZSB0aGUgY29udGV4dCBpcyBzdHJldGNoZWQgd2hlbiBzaGlmdCBpcyBwcmVzc2VkXG4gICAgaWYgKCFlLm9yaWdpbmFsRXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgIGxheWVyLmVkaXRDb250ZXh0KGUuZHgsIGUuZHksIHRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxheWVyLnN0cmV0Y2hDb250ZXh0KGUuZHgsIGUuZHksIHRhcmdldCk7XG4gICAgfVxuXG4gICAgdGhpcy50aW1lbGluZS50cmFja3MudXBkYXRlKGxheWVyKTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudExheWVyID0gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb250ZXh0RWRpdGlvblN0YXRlO1xuIl19