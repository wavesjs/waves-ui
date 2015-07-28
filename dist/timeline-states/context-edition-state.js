"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseState = _interopRequire(require("./base-state"));

var TimeContextBehavior = _interopRequire(require("../behaviors/time-context-behavior"));

var ContextEditionState = (function (_BaseState) {
  function ContextEditionState(timeline) {
    _classCallCheck(this, ContextEditionState);

    _get(_core.Object.getPrototypeOf(ContextEditionState.prototype), "constructor", this).call(this, timeline);
  }

  _inherits(ContextEditionState, _BaseState);

  _createClass(ContextEditionState, {
    handleEvent: {
      value: function handleEvent(e) {
        switch (e.type) {
          case "mousedown":
            this.onMouseDown(e);
            break;
          case "mousemove":
            this.onMouseMove(e);
            break;
          case "mouseup":
            this.onMouseUp(e);
            break;
        }
      }
    },
    onMouseDown: {
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
    },
    onMouseMove: {
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
    },
    onMouseUp: {
      value: function onMouseUp(e) {
        this.mouseDown = false;
        this.currentTarget = null;
        this.currentLayer = null;
      }
    }
  });

  return ContextEditionState;
})(BaseState);

module.exports = ContextEditionState;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFBTyxTQUFTLDJCQUFNLGNBQWM7O0lBQzdCLG1CQUFtQiwyQkFBTSxvQ0FBb0M7O0lBRy9DLG1CQUFtQjtBQUMzQixXQURRLG1CQUFtQixDQUMxQixRQUFRLEVBQUU7MEJBREgsbUJBQW1COztBQUVwQyxxQ0FGaUIsbUJBQW1CLDZDQUU5QixRQUFRLEVBQUU7R0FDakI7O1lBSGtCLG1CQUFtQjs7ZUFBbkIsbUJBQW1CO0FBS3RDLGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7QUFDYixnQkFBTyxDQUFDLENBQUMsSUFBSTtBQUNYLGVBQUssV0FBVztBQUNkLGdCQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGtCQUFNO0FBQUEsQUFDUixlQUFLLFdBQVc7QUFDZCxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixrQkFBTTtBQUFBLEFBQ1IsZUFBSyxTQUFTO0FBQ1osZ0JBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsa0JBQU07QUFBQSxTQUNUO09BQ0Y7O0FBRUQsZUFBVzthQUFBLHFCQUFDLENBQUMsRUFBRTtBQUNiLFlBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLFlBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7QUFFOUIsYUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbEQsY0FBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QixjQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQzlCLGdCQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztBQUMxQixrQkFBTTtXQUNQO1NBQ0Y7T0FDRjs7QUFFRCxlQUFXO2FBQUEscUJBQUMsQ0FBQyxFQUFFO0FBQ2IsWUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQUUsaUJBQU87U0FBRTs7QUFFdEQsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztBQUNoQyxZQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDOzs7QUFHbEMsWUFBSSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFO0FBQzdCLGVBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3ZDLE1BQU07QUFDTCxlQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUMxQzs7QUFFRCxZQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDcEM7O0FBRUQsYUFBUzthQUFBLG1CQUFDLENBQUMsRUFBRTtBQUNYLFlBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLFlBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFlBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO09BQzFCOzs7O1NBcERrQixtQkFBbUI7R0FBUyxTQUFTOztpQkFBckMsbUJBQW1CIiwiZmlsZSI6ImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVN0YXRlIGZyb20gJy4vYmFzZS1zdGF0ZSc7XG5pbXBvcnQgVGltZUNvbnRleHRCZWhhdmlvciBmcm9tICcuLi9iZWhhdmlvcnMvdGltZS1jb250ZXh0LWJlaGF2aW9yJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZXh0RWRpdGlvblN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMubW91c2VEb3duID0gdHJ1ZTtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBlLnRhcmdldDtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5sYXllcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBjb25zdCBsYXllciA9IHRoaXMubGF5ZXJzW2ldO1xuICAgICAgaWYgKGxheWVyLmhhc0VsZW1lbnQoZS50YXJnZXQpKSB7XG4gICAgICAgIHRoaXMuY3VycmVudExheWVyID0gbGF5ZXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICBpZiAoIXRoaXMubW91c2VEb3duIHx8wqAhdGhpcy5jdXJyZW50TGF5ZXIpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBsYXllciA9IHRoaXMuY3VycmVudExheWVyO1xuICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuY3VycmVudFRhcmdldDtcblxuICAgIC8vIGluIHRoaXMgZXhhbXBsZSB0aGUgY29udGV4dCBpcyBzdHJldGNoZWQgd2hlbiBzaGlmdCBpcyBwcmVzc2VkXG4gICAgaWYgKCFlLm9yaWdpbmFsRXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgIGxheWVyLmVkaXRDb250ZXh0KGUuZHgsIGUuZHksIHRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxheWVyLnN0cmV0Y2hDb250ZXh0KGUuZHgsIGUuZHksIHRhcmdldCk7XG4gICAgfVxuXG4gICAgdGhpcy50aW1lbGluZS50cmFja3MudXBkYXRlKGxheWVyKTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudExheWVyID0gbnVsbDtcbiAgfVxufVxuIl19