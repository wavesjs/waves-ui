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

    this.timeContextBehavior = new TimeContextBehavior();
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

        if (!e.originalEvent.shiftKey) {
          this.timeContextBehavior.edit(layer, e.dx, e.dy, target);
        } else {
          this.timeContextBehavior.stretch(layer, e.dx, e.dy, target);
        }

        this.currentLayer.update();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvY29udGV4dC1lZGl0aW9uLXN0YXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBQU8sU0FBUywyQkFBTSxjQUFjOztJQUM3QixtQkFBbUIsMkJBQU0sb0NBQW9DOztJQUcvQyxtQkFBbUI7QUFDM0IsV0FEUSxtQkFBbUIsQ0FDMUIsUUFBUSxFQUFFOzBCQURILG1CQUFtQjs7QUFFcEMscUNBRmlCLG1CQUFtQiw2Q0FFOUIsUUFBUSxFQUFFOztBQUVoQixRQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO0dBQ3REOztZQUxrQixtQkFBbUI7O2VBQW5CLG1CQUFtQjtBQU90QyxlQUFXO2FBQUEscUJBQUMsQ0FBQyxFQUFFO0FBQ2IsZ0JBQU8sQ0FBQyxDQUFDLElBQUk7QUFDWCxlQUFLLFdBQVc7QUFDZCxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixrQkFBTTtBQUFBLEFBQ1IsZUFBSyxXQUFXO0FBQ2QsZ0JBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsa0JBQU07QUFBQSxBQUNSLGVBQUssU0FBUztBQUNaLGdCQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLGtCQUFNO0FBQUEsU0FDVDtPQUNGOztBQUVELGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7QUFDYixZQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztBQUN0QixZQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7O0FBRTlCLGFBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2xELGNBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsY0FBSSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUM5QixnQkFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7QUFDMUIsa0JBQU07V0FDUDtTQUNGO09BQ0Y7O0FBRUQsZUFBVzthQUFBLHFCQUFDLENBQUMsRUFBRTtBQUNiLFlBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtBQUFFLGlCQUFPO1NBQUU7O0FBRXRELFlBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7QUFDaEMsWUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQzs7QUFFbEMsWUFBSSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFO0FBQzdCLGNBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUMxRCxNQUFNO0FBQ0wsY0FBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQzdEOztBQUVELFlBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDNUI7O0FBRUQsYUFBUzthQUFBLG1CQUFDLENBQUMsRUFBRTtBQUNYLFlBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLFlBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFlBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO09BQzFCOzs7O1NBckRrQixtQkFBbUI7R0FBUyxTQUFTOztpQkFBckMsbUJBQW1CIiwiZmlsZSI6ImVzNi90aW1lbGluZS1zdGF0ZXMvY29udGV4dC1lZGl0aW9uLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuaW1wb3J0IFRpbWVDb250ZXh0QmVoYXZpb3IgZnJvbSAnLi4vYmVoYXZpb3JzL3RpbWUtY29udGV4dC1iZWhhdmlvcic7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGV4dEVkaXRpb25TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy50aW1lQ29udGV4dEJlaGF2aW9yID0gbmV3IFRpbWVDb250ZXh0QmVoYXZpb3IoKTtcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2goZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgdGhpcy5tb3VzZURvd24gPSB0cnVlO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IGUudGFyZ2V0O1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmxheWVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGNvbnN0IGxheWVyID0gdGhpcy5sYXllcnNbaV07XG4gICAgICBpZiAobGF5ZXIuaGFzRWxlbWVudChlLnRhcmdldCkpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50TGF5ZXIgPSBsYXllcjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIGlmICghdGhpcy5tb3VzZURvd24gfHzCoCF0aGlzLmN1cnJlbnRMYXllcikgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGxheWVyID0gdGhpcy5jdXJyZW50TGF5ZXI7XG4gICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5jdXJyZW50VGFyZ2V0O1xuXG4gICAgaWYgKCFlLm9yaWdpbmFsRXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgIHRoaXMudGltZUNvbnRleHRCZWhhdmlvci5lZGl0KGxheWVyLCBlLmR4LCBlLmR5LCB0YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRpbWVDb250ZXh0QmVoYXZpb3Iuc3RyZXRjaChsYXllciwgZS5keCwgZS5keSwgdGFyZ2V0KTtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnRMYXllci51cGRhdGUoKTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudExheWVyID0gbnVsbDtcbiAgfVxufVxuIl19