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

        var timeContext = this.timeline.timeContext;
        var lastCenterTime = timeContext.xScale.invert(e.x);

        timeContext.stretchRatio += e.dy / 100;
        timeContext.stretchRatio = Math.max(timeContext.stretchRatio, 0.01);

        var newCenterTime = timeContext.xScale.invert(e.x);
        var delta = newCenterTime - lastCenterTime;
        var offset = timeContext.offset;
        // apply new offset to keep it centered to the mouse
        timeContext.offset += delta + timeContext.xScale.invert(e.dx);

        // clamp other values here if needed (example: offset < 0, stretchRatio > 1, etc...)

        this.timeline.update();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvY2VudGVyZWQtem9vbS1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7O0lBRXBDLGlCQUFpQjtBQUNWLFdBRFAsaUJBQWlCLENBQ1QsUUFBUSxFQUFFOzBCQURsQixpQkFBaUI7O0FBRW5CLHFDQUZFLGlCQUFpQiw2Q0FFYixRQUFRLEVBQUU7O0FBRWhCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0dBQzFCOztZQUxHLGlCQUFpQjs7ZUFBakIsaUJBQWlCO0FBT3JCLGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7QUFDYixnQkFBTyxDQUFDLENBQUMsSUFBSTtBQUNYLGVBQUssV0FBVztBQUNkLGdCQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGtCQUFNO0FBQUEsQUFDUixlQUFLLFdBQVc7QUFDZCxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixrQkFBTTtBQUFBLEFBQ1IsZUFBSyxTQUFTO0FBQ1osZ0JBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsa0JBQU07QUFBQSxTQUNUO09BQ0Y7O0FBRUQsZUFBVzthQUFBLHFCQUFDLENBQUMsRUFBRTtBQUNiLFlBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO09BQ3ZCOztBQUVELGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7QUFDYixZQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGlCQUFPO1NBQUU7O0FBRWhDLFlBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO0FBQzlDLFlBQU0sY0FBYyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFdEQsbUJBQVcsQ0FBQyxZQUFZLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDdkMsbUJBQVcsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDOztBQUVwRSxZQUFNLGFBQWEsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckQsWUFBTSxLQUFLLEdBQUcsYUFBYSxHQUFHLGNBQWMsQ0FBQztBQUM3QyxZQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDOztBQUVsQyxtQkFBVyxDQUFDLE1BQU0sSUFBSyxLQUFLLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxBQUFDLENBQUM7Ozs7QUFJaEUsWUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUN4Qjs7QUFFRCxhQUFTO2FBQUEsbUJBQUMsQ0FBQyxFQUFFO0FBQ1gsWUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7T0FDeEI7Ozs7U0EvQ0csaUJBQWlCO0dBQVMsU0FBUzs7QUFrRHpDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsaUJBQWlCLENBQUMiLCJmaWxlIjoiZXM2L3RpbWVsaW5lLXN0YXRlcy9jZW50ZXJlZC16b29tLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQmFzZVN0YXRlID0gcmVxdWlyZSgnLi9iYXNlLXN0YXRlJyk7XG5cbmNsYXNzIENlbnRlcmVkWm9vbVN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG5cbiAgICB0aGlzLmN1cnJlbnRMYXllciA9IG51bGw7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMubW91c2VEb3duID0gdHJ1ZTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICBpZiAoIXRoaXMubW91c2VEb3duKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgdGltZUNvbnRleHQgPSB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IGxhc3RDZW50ZXJUaW1lID0gdGltZUNvbnRleHQueFNjYWxlLmludmVydChlLngpO1xuXG4gICAgdGltZUNvbnRleHQuc3RyZXRjaFJhdGlvICs9IGUuZHkgLyAxMDA7XG4gICAgdGltZUNvbnRleHQuc3RyZXRjaFJhdGlvID0gTWF0aC5tYXgodGltZUNvbnRleHQuc3RyZXRjaFJhdGlvLCAwLjAxKTtcblxuICAgIGNvbnN0IG5ld0NlbnRlclRpbWUgPSB0aW1lQ29udGV4dC54U2NhbGUuaW52ZXJ0KGUueCk7XG4gICAgY29uc3QgZGVsdGEgPSBuZXdDZW50ZXJUaW1lIC0gbGFzdENlbnRlclRpbWU7XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGltZUNvbnRleHQub2Zmc2V0O1xuICAgIC8vIGFwcGx5IG5ldyBvZmZzZXQgdG8ga2VlcCBpdCBjZW50ZXJlZCB0byB0aGUgbW91c2VcbiAgICB0aW1lQ29udGV4dC5vZmZzZXQgKz0gKGRlbHRhICsgdGltZUNvbnRleHQueFNjYWxlLmludmVydChlLmR4KSk7XG5cbiAgICAvLyBjbGFtcCBvdGhlciB2YWx1ZXMgaGVyZSBpZiBuZWVkZWQgKGV4YW1wbGU6IG9mZnNldCA8IDAsIHN0cmV0Y2hSYXRpbyA+IDEsIGV0Yy4uLilcblxuICAgIHRoaXMudGltZWxpbmUudXBkYXRlKCk7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDZW50ZXJlZFpvb21TdGF0ZTtcbiJdfQ==