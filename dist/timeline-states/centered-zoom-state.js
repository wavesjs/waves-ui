"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseState = _interopRequire(require("./base-state"));

// broken

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

        // @NOTE: kind of weirdo, but sure how this will beahve if view's timeContext
        // are not consistents
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvY2VudGVyZWQtem9vbS1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQUFPLFNBQVMsMkJBQU0sY0FBYzs7OztJQUdmLGlCQUFpQjtBQUN6QixXQURRLGlCQUFpQixDQUN4QixRQUFRLEVBQUU7MEJBREgsaUJBQWlCOztBQUVsQyxxQ0FGaUIsaUJBQWlCLDZDQUU1QixRQUFRLEVBQUU7O0FBRWhCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0dBQzFCOztZQUxrQixpQkFBaUI7O2VBQWpCLGlCQUFpQjtBQU9wQyxlQUFXO2FBQUEscUJBQUMsQ0FBQyxFQUFFO0FBQ2IsZ0JBQU8sQ0FBQyxDQUFDLElBQUk7QUFDWCxlQUFLLFdBQVc7QUFDZCxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixrQkFBTTtBQUFBLEFBQ1IsZUFBSyxXQUFXO0FBQ2QsZ0JBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsa0JBQU07QUFBQSxBQUNSLGVBQUssU0FBUztBQUNaLGdCQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLGtCQUFNO0FBQUEsU0FDVDtPQUNGOztBQUVELGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7QUFDYixZQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztPQUN2Qjs7QUFFRCxlQUFXO2FBQUEscUJBQUMsQ0FBQyxFQUFFO0FBQ2IsWUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFBRSxpQkFBTztTQUFFOztBQUVoQyxZQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDOzs7O0FBSS9CLFlBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVMsSUFBSSxFQUFFO0FBQ2hDLGNBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7QUFDckMsY0FBTSxjQUFjLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV0RCxxQkFBVyxDQUFDLFlBQVksSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztBQUN2QyxxQkFBVyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRXBFLGNBQU0sYUFBYSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRCxjQUFNLEtBQUssR0FBRyxhQUFhLEdBQUcsY0FBYyxDQUFDO0FBQzdDLGNBQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7O0FBRWxDLHFCQUFXLENBQUMsTUFBTSxJQUFLLEtBQUssR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEFBQUMsQ0FBQzs7Ozs7Ozs7Ozs7O1NBWWpFLENBQUMsQ0FBQzs7QUFFSCxnQkFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUN6Qjs7QUFFRCxhQUFTO2FBQUEsbUJBQUMsQ0FBQyxFQUFFO0FBQ1gsWUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7T0FDeEI7Ozs7U0E5RGtCLGlCQUFpQjtHQUFTLFNBQVM7O2lCQUFuQyxpQkFBaUIiLCJmaWxlIjoiZXM2L3RpbWVsaW5lLXN0YXRlcy9jZW50ZXJlZC16b29tLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuXG4vLyBicm9rZW5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENlbnRlcmVkWm9vbVN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG5cbiAgICB0aGlzLmN1cnJlbnRMYXllciA9IG51bGw7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMubW91c2VEb3duID0gdHJ1ZTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICBpZiAoIXRoaXMubW91c2VEb3duKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgdGltZWxpbmUgPSB0aGlzLnRpbWVsaW5lO1xuXG4gICAgLy8gQE5PVEU6IGtpbmQgb2Ygd2VpcmRvLCBidXQgc3VyZSBob3cgdGhpcyB3aWxsIGJlYWh2ZSBpZiB2aWV3J3MgdGltZUNvbnRleHRcbiAgICAvLyBhcmUgbm90IGNvbnNpc3RlbnRzXG4gICAgdGhpcy52aWV3cy5mb3JFYWNoKGZ1bmN0aW9uKHZpZXcpIHtcbiAgICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gdmlldy50aW1lQ29udGV4dDtcbiAgICAgIGNvbnN0IGxhc3RDZW50ZXJUaW1lID0gdGltZUNvbnRleHQueFNjYWxlLmludmVydChlLngpO1xuXG4gICAgICB0aW1lQ29udGV4dC5zdHJldGNoUmF0aW8gKz0gZS5keSAvIDEwMDtcbiAgICAgIHRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbyA9IE1hdGgubWF4KHRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbywgMC4wMSk7XG5cbiAgICAgIGNvbnN0IG5ld0NlbnRlclRpbWUgPSB0aW1lQ29udGV4dC54U2NhbGUuaW52ZXJ0KGUueCk7XG4gICAgICBjb25zdCBkZWx0YSA9IG5ld0NlbnRlclRpbWUgLSBsYXN0Q2VudGVyVGltZTtcbiAgICAgIGNvbnN0IG9mZnNldCA9IHRpbWVDb250ZXh0Lm9mZnNldDtcbiAgICAgIC8vIGFwcGx5IG5ldyBvZmZzZXQgdG8ga2VlcCBpdCBjZW50ZXJlZCB0byB0aGUgbW91c2VcbiAgICAgIHRpbWVDb250ZXh0Lm9mZnNldCArPSAoZGVsdGEgKyB0aW1lQ29udGV4dC54U2NhbGUuaW52ZXJ0KGUuZHgpKTtcblxuICAgICAgLy8gY2xhbXAgb3RoZXIgdmFsdWVzIGhlcmUgaWYgbmVlZGVkIChleGFtcGxlOiBvZmZzZXQgPD0gMCwgc3RyZXRjaFJhdGlvID49IDEsIGV0Yy4uLilcblxuICAgICAgLy8gZXhhbXBsZSBrZWVwIGluIGNvbnRhaW5lciB3aGVuIHpvb21lZCBvdXRcbiAgICAgIC8vIGlmICh0aW1lQ29udGV4dC5zdHJldGNoUmF0aW8gPCAxKcKge1xuICAgICAgLy8gICBjb25zdCBtaW5PZmZzZXQgPSB0aW1lQ29udGV4dC54U2NhbGUuaW52ZXJ0KDApO1xuICAgICAgLy8gICBjb25zdCBtYXhPZmZzZXQgPSB0aW1lQ29udGV4dC54U2NhbGUuaW52ZXJ0KHZpZXcud2lkdGggLSB0aW1lQ29udGV4dC54U2NhbGUodGltZUNvbnRleHQuZHVyYXRpb24pKTtcblxuICAgICAgLy8gICB0aW1lQ29udGV4dC5vZmZzZXQgPSBNYXRoLm1heCh0aW1lQ29udGV4dC5vZmZzZXQsIG1pbk9mZnNldCk7XG4gICAgICAvLyAgIHRpbWVDb250ZXh0Lm9mZnNldCA9IE1hdGgubWluKHRpbWVDb250ZXh0Lm9mZnNldCwgbWF4T2Zmc2V0KTtcbiAgICAgIC8vIH1cbiAgICB9KTtcblxuICAgIHRpbWVsaW5lLnZpZXdzLnVwZGF0ZSgpO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHtcbiAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xuICB9XG59XG4iXX0=