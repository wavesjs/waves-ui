"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var BaseState = require("./base-state");

var CenteredZoomState = (function (_BaseState) {
  function CenteredZoomState(timeline) {
    _classCallCheck(this, CenteredZoomState);

    _get(_core.Object.getPrototypeOf(CenteredZoomState.prototype), "constructor", this).call(this, timeline);

    this.currentLayer = null;
  }

  _inherits(CenteredZoomState, _BaseState);

  _createClass(CenteredZoomState, {
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
      }
    },
    onMouseMove: {
      value: function onMouseMove(e) {
        if (!this.mouseDown) {
          return;
        }

        var timeline = this.timeline;
        var timeContext = timeline.timeContext;
        var lastCenterTime = timeContext.xScale.invert(e.x);

        timeContext.stretchRatio += e.dy / 100;
        timeContext.stretchRatio = Math.max(timeContext.stretchRatio, 0.01);

        var newCenterTime = timeContext.xScale.invert(e.x);
        var delta = newCenterTime - lastCenterTime;
        var offset = timeContext.offset;
        // apply new offset to keep it centered to the mouse
        timeContext.offset += delta + timeContext.xScale.invert(e.dx);

        // clamp other values here if needed (example: offset < 0, stretchRatio > 1, etc...)
        // keep in view

        if (timeContext.stretchRatio < 1) {
          var minOffset = timeContext.xScale.invert(0);
          var maxOffset = timeContext.xScale.invert(timeline.containersWidth - timeContext.xScale(timeContext.duration));

          timeContext.offset = Math.max(timeContext.offset, minOffset);
          timeContext.offset = Math.min(timeContext.offset, maxOffset);
        }

        timeline.update();
      }
    },
    onMouseUp: {
      value: function onMouseUp(e) {
        this.mouseDown = false;
      }
    }
  });

  return CenteredZoomState;
})(BaseState);

module.exports = CenteredZoomState;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvY2VudGVyZWQtem9vbS1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7O0lBRXBDLGlCQUFpQjtBQUNWLFdBRFAsaUJBQWlCLENBQ1QsUUFBUSxFQUFFOzBCQURsQixpQkFBaUI7O0FBRW5CLHFDQUZFLGlCQUFpQiw2Q0FFYixRQUFRLEVBQUU7O0FBRWhCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0dBQzFCOztZQUxHLGlCQUFpQjs7ZUFBakIsaUJBQWlCO0FBT3JCLGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7QUFDYixnQkFBTyxDQUFDLENBQUMsSUFBSTtBQUNYLGVBQUssV0FBVztBQUNkLGdCQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGtCQUFNO0FBQUEsQUFDUixlQUFLLFdBQVc7QUFDZCxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixrQkFBTTtBQUFBLEFBQ1IsZUFBSyxTQUFTO0FBQ1osZ0JBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsa0JBQU07QUFBQSxTQUNUO09BQ0Y7O0FBRUQsZUFBVzthQUFBLHFCQUFDLENBQUMsRUFBRTtBQUNiLFlBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO09BQ3ZCOztBQUVELGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7QUFDYixZQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGlCQUFPO1NBQUU7O0FBRWhDLFlBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDL0IsWUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztBQUN6QyxZQUFNLGNBQWMsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXRELG1CQUFXLENBQUMsWUFBWSxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ3ZDLG1CQUFXLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFcEUsWUFBTSxhQUFhLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JELFlBQU0sS0FBSyxHQUFHLGFBQWEsR0FBRyxjQUFjLENBQUM7QUFDN0MsWUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQzs7QUFFbEMsbUJBQVcsQ0FBQyxNQUFNLElBQUssS0FBSyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQUFBQyxDQUFDOzs7OztBQUtoRSxZQUFJLFdBQVcsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxFQUFFO0FBQ2hDLGNBQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9DLGNBQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7QUFFakgscUJBQVcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzdELHFCQUFXLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztTQUM5RDs7QUFFRCxnQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ25COztBQUVELGFBQVM7YUFBQSxtQkFBQyxDQUFDLEVBQUU7QUFDWCxZQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztPQUN4Qjs7OztTQXpERyxpQkFBaUI7R0FBUyxTQUFTOztBQTREekMsTUFBTSxDQUFDLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyIsImZpbGUiOiJlczYvdGltZWxpbmUtc3RhdGVzL2NlbnRlcmVkLXpvb20tc3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCYXNlU3RhdGUgPSByZXF1aXJlKCcuL2Jhc2Utc3RhdGUnKTtcblxuY2xhc3MgQ2VudGVyZWRab29tU3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcblxuICAgIHRoaXMuY3VycmVudExheWVyID0gbnVsbDtcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2goZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgdGhpcy5tb3VzZURvd24gPSB0cnVlO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIGlmICghdGhpcy5tb3VzZURvd24pIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCB0aW1lbGluZSA9IHRoaXMudGltZWxpbmU7XG4gICAgY29uc3QgdGltZUNvbnRleHQgPSB0aW1lbGluZS50aW1lQ29udGV4dDtcbiAgICBjb25zdCBsYXN0Q2VudGVyVGltZSA9IHRpbWVDb250ZXh0LnhTY2FsZS5pbnZlcnQoZS54KTtcblxuICAgIHRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbyArPSBlLmR5IC8gMTAwO1xuICAgIHRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbyA9IE1hdGgubWF4KHRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbywgMC4wMSk7XG5cbiAgICBjb25zdCBuZXdDZW50ZXJUaW1lID0gdGltZUNvbnRleHQueFNjYWxlLmludmVydChlLngpO1xuICAgIGNvbnN0IGRlbHRhID0gbmV3Q2VudGVyVGltZSAtIGxhc3RDZW50ZXJUaW1lO1xuICAgIGNvbnN0IG9mZnNldCA9IHRpbWVDb250ZXh0Lm9mZnNldDtcbiAgICAvLyBhcHBseSBuZXcgb2Zmc2V0IHRvIGtlZXAgaXQgY2VudGVyZWQgdG8gdGhlIG1vdXNlXG4gICAgdGltZUNvbnRleHQub2Zmc2V0ICs9IChkZWx0YSArIHRpbWVDb250ZXh0LnhTY2FsZS5pbnZlcnQoZS5keCkpO1xuXG4gICAgLy8gY2xhbXAgb3RoZXIgdmFsdWVzIGhlcmUgaWYgbmVlZGVkIChleGFtcGxlOiBvZmZzZXQgPCAwLCBzdHJldGNoUmF0aW8gPiAxLCBldGMuLi4pXG4gICAgLy8ga2VlcCBpbiB2aWV3XG5cbiAgICBpZiAodGltZUNvbnRleHQuc3RyZXRjaFJhdGlvIDwgMSnCoHtcbiAgICAgIGNvbnN0IG1pbk9mZnNldCA9IHRpbWVDb250ZXh0LnhTY2FsZS5pbnZlcnQoMCk7XG4gICAgICBjb25zdCBtYXhPZmZzZXQgPSB0aW1lQ29udGV4dC54U2NhbGUuaW52ZXJ0KHRpbWVsaW5lLmNvbnRhaW5lcnNXaWR0aCAtIHRpbWVDb250ZXh0LnhTY2FsZSh0aW1lQ29udGV4dC5kdXJhdGlvbikpO1xuXG4gICAgICB0aW1lQ29udGV4dC5vZmZzZXQgPSBNYXRoLm1heCh0aW1lQ29udGV4dC5vZmZzZXQsIG1pbk9mZnNldCk7XG4gICAgICB0aW1lQ29udGV4dC5vZmZzZXQgPSBNYXRoLm1pbih0aW1lQ29udGV4dC5vZmZzZXQsIG1heE9mZnNldCk7XG4gICAgfVxuXG4gICAgdGltZWxpbmUudXBkYXRlKCk7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDZW50ZXJlZFpvb21TdGF0ZTtcbiJdfQ==