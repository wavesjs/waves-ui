"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseState = _interopRequire(require("./base-state"));

// @NOTE => overlaps SelectionBehavior in some way...

var EditionState = (function (_BaseState) {
  function EditionState(timeline) {
    _classCallCheck(this, EditionState);

    _get(_core.Object.getPrototypeOf(EditionState.prototype), "constructor", this).call(this, timeline);

    this.currentEditedLayer = null;
    this.currentTarget = null;
  }

  _inherits(EditionState, _BaseState);

  _createClass(EditionState, {
    enter: {
      value: function enter() {}
    },
    exit: {
      value: function exit() {}
    },
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
        var _this = this;

        this.mouseDown = true;
        // keep target consistent with mouse down
        // @NOTE: move this to Surface ?
        this.currentTarget = e.target;

        this.layers.forEach(function (layer) {
          if (!layer.hasElement(_this.currentTarget)) {
            return;
          }

          if (!e.originalEvent.shiftKey) {
            layer.unselect();
          }

          var item = layer.getItemFromDOMElement(_this.currentTarget);

          if (item === null) {
            return;
          }

          _this.currentEditedLayer = layer;
          layer.select(item);
        });
      }
    },
    onMouseMove: {
      value: function onMouseMove(e) {
        if (!this.mouseDown || !this.currentEditedLayer) {
          return;
        }

        var layer = this.currentEditedLayer;
        var items = layer.selectedItems;

        layer.edit(items, e.dx, e.dy, this.currentTarget);
        layer.update(items);
      }
    },
    onMouseUp: {
      value: function onMouseUp(e) {
        this.currentEditedLayer = null;
        this.mouseDown = false;
      }
    }
  });

  return EditionState;
})(BaseState);

module.exports = EditionState;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvZWRpdGlvbi1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQUFPLFNBQVMsMkJBQU0sY0FBYzs7OztJQUlmLFlBQVk7QUFDcEIsV0FEUSxZQUFZLENBQ25CLFFBQVEsRUFBRTswQkFESCxZQUFZOztBQUU3QixxQ0FGaUIsWUFBWSw2Q0FFdkIsUUFBUSxFQUFFOztBQUVoQixRQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0FBQy9CLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0dBQzNCOztZQU5rQixZQUFZOztlQUFaLFlBQVk7QUFRL0IsU0FBSzthQUFBLGlCQUFHLEVBQUU7O0FBQ1YsUUFBSTthQUFBLGdCQUFHLEVBQUU7O0FBRVQsZUFBVzthQUFBLHFCQUFDLENBQUMsRUFBRTtBQUNiLGdCQUFRLENBQUMsQ0FBQyxJQUFJO0FBQ1osZUFBSyxXQUFXO0FBQ2QsZ0JBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsa0JBQU07QUFBQSxBQUNSLGVBQUssV0FBVztBQUNkLGdCQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGtCQUFNO0FBQUEsQUFDUixlQUFLLFNBQVM7QUFDWixnQkFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixrQkFBTTtBQUFBLFNBQ1Q7T0FDRjs7QUFFRCxlQUFXO2FBQUEscUJBQUMsQ0FBQyxFQUFFOzs7QUFDYixZQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzs7O0FBR3RCLFlBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7QUFFOUIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDN0IsY0FBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBSyxhQUFhLENBQUMsRUFBRTtBQUFFLG1CQUFPO1dBQUU7O0FBRXRELGNBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRTtBQUM3QixpQkFBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1dBQ2xCOztBQUVELGNBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxNQUFLLGFBQWEsQ0FBQyxDQUFDOztBQUU3RCxjQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7QUFBRSxtQkFBTztXQUFFOztBQUU5QixnQkFBSyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7QUFDaEMsZUFBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNwQixDQUFDLENBQUM7T0FDSjs7QUFFRCxlQUFXO2FBQUEscUJBQUMsQ0FBQyxFQUFFO0FBQ2IsWUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUU7QUFBRSxpQkFBTztTQUFFOztBQUU1RCxZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUM7QUFDdEMsWUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQzs7QUFFbEMsYUFBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNsRCxhQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ3JCOztBQUVELGFBQVM7YUFBQSxtQkFBQyxDQUFDLEVBQUU7QUFDWCxZQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0FBQy9CLFlBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO09BQ3hCOzs7O1NBNURrQixZQUFZO0dBQVMsU0FBUzs7aUJBQTlCLFlBQVkiLCJmaWxlIjoiZXM2L3RpbWVsaW5lLXN0YXRlcy9lZGl0aW9uLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuXG5cbi8vIEBOT1RFID0+IG92ZXJsYXBzIFNlbGVjdGlvbkJlaGF2aW9yIGluIHNvbWUgd2F5Li4uXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0aW9uU3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcblxuICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICB9XG5cbiAgZW50ZXIoKSB7fVxuICBleGl0KCkge31cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLm1vdXNlRG93biA9IHRydWU7XG4gICAgLy8ga2VlcCB0YXJnZXQgY29uc2lzdGVudCB3aXRoIG1vdXNlIGRvd25cbiAgICAvLyBATk9URTogbW92ZSB0aGlzIHRvIFN1cmZhY2UgP1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IGUudGFyZ2V0O1xuXG4gICAgdGhpcy5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGlmICghbGF5ZXIuaGFzRWxlbWVudCh0aGlzLmN1cnJlbnRUYXJnZXQpKSB7IHJldHVybjsgfVxuXG4gICAgICBpZiAoIWUub3JpZ2luYWxFdmVudC5zaGlmdEtleSkge1xuICAgICAgICBsYXllci51bnNlbGVjdCgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpdGVtID0gbGF5ZXIuZ2V0SXRlbUZyb21ET01FbGVtZW50KHRoaXMuY3VycmVudFRhcmdldCk7XG5cbiAgICAgIGlmIChpdGVtID09PSBudWxsKSB7IHJldHVybjsgfVxuXG4gICAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IGxheWVyO1xuICAgICAgbGF5ZXIuc2VsZWN0KGl0ZW0pO1xuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIGlmICghdGhpcy5tb3VzZURvd24gfHzCoCF0aGlzLmN1cnJlbnRFZGl0ZWRMYXllcikgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGxheWVyID0gdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXI7XG4gICAgY29uc3QgaXRlbXMgPSBsYXllci5zZWxlY3RlZEl0ZW1zO1xuXG4gICAgbGF5ZXIuZWRpdChpdGVtcywgZS5keCwgZS5keSwgdGhpcy5jdXJyZW50VGFyZ2V0KTtcbiAgICBsYXllci51cGRhdGUoaXRlbXMpO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IG51bGw7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgfVxufVxuIl19