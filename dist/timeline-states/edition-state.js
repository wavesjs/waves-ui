"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var BaseState = require("./base-state");

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
          if (layer.hasItem(e.target)) {
            _this.currentEditedLayer = layer;
          }
        });
      }
    },
    onMouseMove: {
      value: function onMouseMove(e) {
        var _this = this;

        if (!this.mouseDown || !this.currentEditedLayer) {
          return;
        }

        var layer = this.currentEditedLayer;
        var items = layer.selectedItems;
        // the loop should be in layer to match select / unselect API
        items.forEach(function (item) {
          layer.edit(item, e.dx, e.dy, _this.currentTarget);
        });

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQzs7SUFFcEMsWUFBWTtBQUNMLFdBRFAsWUFBWSxDQUNKLFFBQVEsRUFBRTswQkFEbEIsWUFBWTs7QUFFZCxxQ0FGRSxZQUFZLDZDQUVSLFFBQVEsRUFBRTs7QUFFaEIsUUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztBQUMvQixRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztHQUMzQjs7WUFORyxZQUFZOztlQUFaLFlBQVk7QUFRaEIsU0FBSzthQUFBLGlCQUFHLEVBQUU7O0FBQ1YsUUFBSTthQUFBLGdCQUFHLEVBQUU7O0FBRVQsZUFBVzthQUFBLHFCQUFDLENBQUMsRUFBRTtBQUNiLGdCQUFRLENBQUMsQ0FBQyxJQUFJO0FBQ1osZUFBSyxXQUFXO0FBQ2QsZ0JBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsa0JBQU07QUFBQSxBQUNSLGVBQUssV0FBVztBQUNkLGdCQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGtCQUFNO0FBQUEsQUFDUixlQUFLLFNBQVM7QUFDWixnQkFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixrQkFBTTtBQUFBLFNBQ1Q7T0FDRjs7QUFFRCxlQUFXO2FBQUEscUJBQUMsQ0FBQyxFQUFFOzs7QUFDYixZQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzs7O0FBR3RCLFlBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7QUFFOUIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDN0IsY0FBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUMzQixrQkFBSyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7V0FDakM7U0FDRixDQUFDLENBQUM7T0FDSjs7QUFFRCxlQUFXO2FBQUEscUJBQUMsQ0FBQyxFQUFFOzs7QUFDYixZQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtBQUFFLGlCQUFPO1NBQUU7O0FBRTVELFlBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztBQUN0QyxZQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDOztBQUVsQyxhQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3RCLGVBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxNQUFLLGFBQWEsQ0FBQyxDQUFDO1NBQ2xELENBQUMsQ0FBQzs7QUFFSCxhQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ3JCOztBQUVELGFBQVM7YUFBQSxtQkFBQyxDQUFDLEVBQUU7QUFDWCxZQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0FBQy9CLFlBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO09BQ3hCOzs7O1NBdERHLFlBQVk7R0FBUyxTQUFTOztBQXlEcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMiLCJmaWxlIjoiZXM2L3RpbWVsaW5lLXN0YXRlcy9zZWxlY3Rpb24tc3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCYXNlU3RhdGUgPSByZXF1aXJlKCcuL2Jhc2Utc3RhdGUnKTtcblxuY2xhc3MgRWRpdGlvblN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG5cbiAgICB0aGlzLmN1cnJlbnRFZGl0ZWRMYXllciA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgfVxuXG4gIGVudGVyKCkge31cbiAgZXhpdCgpIHt9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgdGhpcy5tb3VzZURvd24gPSB0cnVlO1xuICAgIC8vIGtlZXAgdGFyZ2V0IGNvbnNpc3RlbnQgd2l0aCBtb3VzZSBkb3duXG4gICAgLy8gQE5PVEU6IG1vdmUgdGhpcyB0byBTdXJmYWNlID9cbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBlLnRhcmdldDtcblxuICAgIHRoaXMubGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBpZiAobGF5ZXIuaGFzSXRlbShlLnRhcmdldCkpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIgPSBsYXllcjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICBpZiAoIXRoaXMubW91c2VEb3duIHx8wqAhdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBsYXllciA9IHRoaXMuY3VycmVudEVkaXRlZExheWVyO1xuICAgIGNvbnN0IGl0ZW1zID0gbGF5ZXIuc2VsZWN0ZWRJdGVtcztcbiAgICAvLyB0aGUgbG9vcCBzaG91bGQgYmUgaW4gbGF5ZXIgdG8gbWF0Y2ggc2VsZWN0IC8gdW5zZWxlY3QgQVBJXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgbGF5ZXIuZWRpdChpdGVtLCBlLmR4LCBlLmR5LCB0aGlzLmN1cnJlbnRUYXJnZXQpO1xuICAgIH0pO1xuXG4gICAgbGF5ZXIudXBkYXRlKGl0ZW1zKTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIgPSBudWxsO1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFZGl0aW9uU3RhdGU7XG4iXX0=