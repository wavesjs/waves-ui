"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseState = _interopRequire(require("./base-state"));

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

        this.views.forEach(function (view) {
          var timeContext = view.timeContext;
          var lastCenterTime = timeContext.xScale.invert(e.x);

          timeContext.stretchRatio += e.dy / 100;
          timeContext.stretchRatio = Math.max(timeContext.stretchRatio, 0.01);

          var newCenterTime = timeContext.xScale.invert(e.x);
          var delta = newCenterTime - lastCenterTime;
          var offset = timeContext.offset;
          // apply new offset to keep it centered to the mouse
          timeContext.offset += delta + timeContext.xScale.invert(e.dx);

          // clamp other values here if needed (example: offset <= 0, stretchRatio >= 1, etc...)

          // example keep in container when zoomed out
          // if (timeContext.stretchRatio < 1) {
          //   const minOffset = timeContext.xScale.invert(0);
          //   const maxOffset = timeContext.xScale.invert(view.width - timeContext.xScale(timeContext.duration));

          //   timeContext.offset = Math.max(timeContext.offset, minOffset);
          //   timeContext.offset = Math.min(timeContext.offset, maxOffset);
          // }
        });

        timeline.views.update();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvY2VudGVyZWQtem9vbS1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQUFPLFNBQVMsMkJBQU0sY0FBYzs7SUFHZixpQkFBaUI7QUFDekIsV0FEUSxpQkFBaUIsQ0FDeEIsUUFBUSxFQUFFOzBCQURILGlCQUFpQjs7QUFFbEMscUNBRmlCLGlCQUFpQiw2Q0FFNUIsUUFBUSxFQUFFOztBQUVoQixRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztHQUMxQjs7WUFMa0IsaUJBQWlCOztlQUFqQixpQkFBaUI7QUFPcEMsZUFBVzthQUFBLHFCQUFDLENBQUMsRUFBRTtBQUNiLGdCQUFPLENBQUMsQ0FBQyxJQUFJO0FBQ1gsZUFBSyxXQUFXO0FBQ2QsZ0JBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsa0JBQU07QUFBQSxBQUNSLGVBQUssV0FBVztBQUNkLGdCQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGtCQUFNO0FBQUEsQUFDUixlQUFLLFNBQVM7QUFDWixnQkFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixrQkFBTTtBQUFBLFNBQ1Q7T0FDRjs7QUFFRCxlQUFXO2FBQUEscUJBQUMsQ0FBQyxFQUFFO0FBQ2IsWUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7T0FDdkI7O0FBRUQsZUFBVzthQUFBLHFCQUFDLENBQUMsRUFBRTtBQUNiLFlBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQUUsaUJBQU87U0FBRTs7QUFFaEMsWUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQzs7QUFFL0IsWUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBUyxJQUFJLEVBQUU7QUFDaEMsY0FBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztBQUNyQyxjQUFNLGNBQWMsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXRELHFCQUFXLENBQUMsWUFBWSxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0FBQ3ZDLHFCQUFXLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFcEUsY0FBTSxhQUFhLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JELGNBQU0sS0FBSyxHQUFHLGFBQWEsR0FBRyxjQUFjLENBQUM7QUFDN0MsY0FBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQzs7QUFFbEMscUJBQVcsQ0FBQyxNQUFNLElBQUssS0FBSyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQUFBQyxDQUFDOzs7Ozs7Ozs7Ozs7U0FZakUsQ0FBQyxDQUFDOztBQUVILGdCQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ3pCOztBQUVELGFBQVM7YUFBQSxtQkFBQyxDQUFDLEVBQUU7QUFDWCxZQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztPQUN4Qjs7OztTQTVEa0IsaUJBQWlCO0dBQVMsU0FBUzs7aUJBQW5DLGlCQUFpQiIsImZpbGUiOiJlczYvdGltZWxpbmUtc3RhdGVzL2NlbnRlcmVkLXpvb20tc3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVN0YXRlIGZyb20gJy4vYmFzZS1zdGF0ZSc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2VudGVyZWRab29tU3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcblxuICAgIHRoaXMuY3VycmVudExheWVyID0gbnVsbDtcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2goZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgdGhpcy5tb3VzZURvd24gPSB0cnVlO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIGlmICghdGhpcy5tb3VzZURvd24pIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCB0aW1lbGluZSA9IHRoaXMudGltZWxpbmU7XG5cbiAgICB0aGlzLnZpZXdzLmZvckVhY2goZnVuY3Rpb24odmlldykge1xuICAgICAgY29uc3QgdGltZUNvbnRleHQgPSB2aWV3LnRpbWVDb250ZXh0O1xuICAgICAgY29uc3QgbGFzdENlbnRlclRpbWUgPSB0aW1lQ29udGV4dC54U2NhbGUuaW52ZXJ0KGUueCk7XG5cbiAgICAgIHRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbyArPSBlLmR5IC8gMTAwO1xuICAgICAgdGltZUNvbnRleHQuc3RyZXRjaFJhdGlvID0gTWF0aC5tYXgodGltZUNvbnRleHQuc3RyZXRjaFJhdGlvLCAwLjAxKTtcblxuICAgICAgY29uc3QgbmV3Q2VudGVyVGltZSA9IHRpbWVDb250ZXh0LnhTY2FsZS5pbnZlcnQoZS54KTtcbiAgICAgIGNvbnN0IGRlbHRhID0gbmV3Q2VudGVyVGltZSAtIGxhc3RDZW50ZXJUaW1lO1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gdGltZUNvbnRleHQub2Zmc2V0O1xuICAgICAgLy8gYXBwbHkgbmV3IG9mZnNldCB0byBrZWVwIGl0IGNlbnRlcmVkIHRvIHRoZSBtb3VzZVxuICAgICAgdGltZUNvbnRleHQub2Zmc2V0ICs9IChkZWx0YSArIHRpbWVDb250ZXh0LnhTY2FsZS5pbnZlcnQoZS5keCkpO1xuXG4gICAgICAvLyBjbGFtcCBvdGhlciB2YWx1ZXMgaGVyZSBpZiBuZWVkZWQgKGV4YW1wbGU6IG9mZnNldCA8PSAwLCBzdHJldGNoUmF0aW8gPj0gMSwgZXRjLi4uKVxuXG4gICAgICAvLyBleGFtcGxlIGtlZXAgaW4gY29udGFpbmVyIHdoZW4gem9vbWVkIG91dFxuICAgICAgLy8gaWYgKHRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbyA8IDEpwqB7XG4gICAgICAvLyAgIGNvbnN0IG1pbk9mZnNldCA9IHRpbWVDb250ZXh0LnhTY2FsZS5pbnZlcnQoMCk7XG4gICAgICAvLyAgIGNvbnN0IG1heE9mZnNldCA9IHRpbWVDb250ZXh0LnhTY2FsZS5pbnZlcnQodmlldy53aWR0aCAtIHRpbWVDb250ZXh0LnhTY2FsZSh0aW1lQ29udGV4dC5kdXJhdGlvbikpO1xuXG4gICAgICAvLyAgIHRpbWVDb250ZXh0Lm9mZnNldCA9IE1hdGgubWF4KHRpbWVDb250ZXh0Lm9mZnNldCwgbWluT2Zmc2V0KTtcbiAgICAgIC8vICAgdGltZUNvbnRleHQub2Zmc2V0ID0gTWF0aC5taW4odGltZUNvbnRleHQub2Zmc2V0LCBtYXhPZmZzZXQpO1xuICAgICAgLy8gfVxuICAgIH0pO1xuXG4gICAgdGltZWxpbmUudmlld3MudXBkYXRlKCk7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gIH1cbn1cbiJdfQ==