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

        // example keep in container when zoomed out
        if (timeContext.stretchRatio < 1) {
          var minOffset = timeContext.xScale.invert(0);
          var maxOffset = timeContext.xScale.invert(timeline.containersWidth - timeContext.xScale(timeContext.containersDuration));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvY2VudGVyZWQtem9vbS1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7O0lBRXBDLGlCQUFpQjtBQUNWLFdBRFAsaUJBQWlCLENBQ1QsUUFBUSxFQUFFOzBCQURsQixpQkFBaUI7O0FBRW5CLHFDQUZFLGlCQUFpQiw2Q0FFYixRQUFRLEVBQUU7O0FBRWhCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0dBQzFCOztZQUxHLGlCQUFpQjs7ZUFBakIsaUJBQWlCO0FBT3JCLGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7QUFDYixnQkFBTyxDQUFDLENBQUMsSUFBSTtBQUNYLGVBQUssV0FBVztBQUNkLGdCQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGtCQUFNO0FBQUEsQUFDUixlQUFLLFdBQVc7QUFDZCxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixrQkFBTTtBQUFBLEFBQ1IsZUFBSyxTQUFTO0FBQ1osZ0JBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsa0JBQU07QUFBQSxTQUNUO09BQ0Y7O0FBRUQsZUFBVzthQUFBLHFCQUFDLENBQUMsRUFBRTtBQUNiLFlBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO09BQ3ZCOztBQUVELGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7QUFDYixZQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGlCQUFPO1NBQUU7O0FBRWhDLFlBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDL0IsWUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztBQUN6QyxZQUFNLGNBQWMsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXRELG1CQUFXLENBQUMsWUFBWSxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ3ZDLG1CQUFXLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFcEUsWUFBTSxhQUFhLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JELFlBQU0sS0FBSyxHQUFHLGFBQWEsR0FBRyxjQUFjLENBQUM7QUFDN0MsWUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQzs7QUFFbEMsbUJBQVcsQ0FBQyxNQUFNLElBQUssS0FBSyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQUFBQyxDQUFDOzs7OztBQUtoRSxZQUFJLFdBQVcsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxFQUFFO0FBQ2hDLGNBQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9DLGNBQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDOztBQUUzSCxxQkFBVyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDN0QscUJBQVcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQzlEOztBQUVELGdCQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDbkI7O0FBRUQsYUFBUzthQUFBLG1CQUFDLENBQUMsRUFBRTtBQUNYLFlBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO09BQ3hCOzs7O1NBekRHLGlCQUFpQjtHQUFTLFNBQVM7O0FBNER6QyxNQUFNLENBQUMsT0FBTyxHQUFHLGlCQUFpQixDQUFDIiwiZmlsZSI6ImVzNi90aW1lbGluZS1zdGF0ZXMvY2VudGVyZWQtem9vbS1zdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEJhc2VTdGF0ZSA9IHJlcXVpcmUoJy4vYmFzZS1zdGF0ZScpO1xuXG5jbGFzcyBDZW50ZXJlZFpvb21TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5jdXJyZW50TGF5ZXIgPSBudWxsO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLm1vdXNlRG93biA9IHRydWU7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgaWYgKCF0aGlzLm1vdXNlRG93bikgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IHRpbWVsaW5lID0gdGhpcy50aW1lbGluZTtcbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IHRpbWVsaW5lLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IGxhc3RDZW50ZXJUaW1lID0gdGltZUNvbnRleHQueFNjYWxlLmludmVydChlLngpO1xuXG4gICAgdGltZUNvbnRleHQuc3RyZXRjaFJhdGlvICs9IGUuZHkgLyAxMDA7XG4gICAgdGltZUNvbnRleHQuc3RyZXRjaFJhdGlvID0gTWF0aC5tYXgodGltZUNvbnRleHQuc3RyZXRjaFJhdGlvLCAwLjAxKTtcblxuICAgIGNvbnN0IG5ld0NlbnRlclRpbWUgPSB0aW1lQ29udGV4dC54U2NhbGUuaW52ZXJ0KGUueCk7XG4gICAgY29uc3QgZGVsdGEgPSBuZXdDZW50ZXJUaW1lIC0gbGFzdENlbnRlclRpbWU7XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGltZUNvbnRleHQub2Zmc2V0O1xuICAgIC8vIGFwcGx5IG5ldyBvZmZzZXQgdG8ga2VlcCBpdCBjZW50ZXJlZCB0byB0aGUgbW91c2VcbiAgICB0aW1lQ29udGV4dC5vZmZzZXQgKz0gKGRlbHRhICsgdGltZUNvbnRleHQueFNjYWxlLmludmVydChlLmR4KSk7XG5cbiAgICAvLyBjbGFtcCBvdGhlciB2YWx1ZXMgaGVyZSBpZiBuZWVkZWQgKGV4YW1wbGU6IG9mZnNldCA8IDAsIHN0cmV0Y2hSYXRpbyA+IDEsIGV0Yy4uLilcblxuICAgIC8vIGV4YW1wbGUga2VlcCBpbiBjb250YWluZXIgd2hlbiB6b29tZWQgb3V0XG4gICAgaWYgKHRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbyA8IDEpwqB7XG4gICAgICBjb25zdCBtaW5PZmZzZXQgPSB0aW1lQ29udGV4dC54U2NhbGUuaW52ZXJ0KDApO1xuICAgICAgY29uc3QgbWF4T2Zmc2V0ID0gdGltZUNvbnRleHQueFNjYWxlLmludmVydCh0aW1lbGluZS5jb250YWluZXJzV2lkdGggLSB0aW1lQ29udGV4dC54U2NhbGUodGltZUNvbnRleHQuY29udGFpbmVyc0R1cmF0aW9uKSk7XG5cbiAgICAgIHRpbWVDb250ZXh0Lm9mZnNldCA9IE1hdGgubWF4KHRpbWVDb250ZXh0Lm9mZnNldCwgbWluT2Zmc2V0KTtcbiAgICAgIHRpbWVDb250ZXh0Lm9mZnNldCA9IE1hdGgubWluKHRpbWVDb250ZXh0Lm9mZnNldCwgbWF4T2Zmc2V0KTtcbiAgICB9XG5cbiAgICB0aW1lbGluZS51cGRhdGUoKTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENlbnRlcmVkWm9vbVN0YXRlO1xuIl19