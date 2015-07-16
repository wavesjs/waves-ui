"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var BaseState = _interopRequire(require("./base-state"));

// works but strange loop on view to update each timeContexts

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvY2VudGVyZWQtem9vbS1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQUFPLFNBQVMsMkJBQU0sY0FBYzs7OztJQUdmLGlCQUFpQjtBQUN6QixXQURRLGlCQUFpQixDQUN4QixRQUFRLEVBQUU7MEJBREgsaUJBQWlCOztBQUVsQyxxQ0FGaUIsaUJBQWlCLDZDQUU1QixRQUFRLEVBQUU7O0FBRWhCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0dBQzFCOztZQUxrQixpQkFBaUI7O2VBQWpCLGlCQUFpQjtBQU9wQyxlQUFXO2FBQUEscUJBQUMsQ0FBQyxFQUFFO0FBQ2IsZ0JBQU8sQ0FBQyxDQUFDLElBQUk7QUFDWCxlQUFLLFdBQVc7QUFDZCxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixrQkFBTTtBQUFBLEFBQ1IsZUFBSyxXQUFXO0FBQ2QsZ0JBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsa0JBQU07QUFBQSxBQUNSLGVBQUssU0FBUztBQUNaLGdCQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLGtCQUFNO0FBQUEsU0FDVDtPQUNGOztBQUVELGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7QUFDYixZQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztPQUN2Qjs7QUFFRCxlQUFXO2FBQUEscUJBQUMsQ0FBQyxFQUFFO0FBQ2IsWUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFBRSxpQkFBTztTQUFFOztBQUVoQyxZQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDOzs7O0FBSS9CLFlBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVMsSUFBSSxFQUFFO0FBQ2hDLGNBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7QUFDckMsY0FBTSxjQUFjLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV0RCxxQkFBVyxDQUFDLFlBQVksSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztBQUN2QyxxQkFBVyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRXBFLGNBQU0sYUFBYSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRCxjQUFNLEtBQUssR0FBRyxhQUFhLEdBQUcsY0FBYyxDQUFDO0FBQzdDLGNBQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7O0FBRWxDLHFCQUFXLENBQUMsTUFBTSxJQUFLLEtBQUssR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEFBQUMsQ0FBQzs7Ozs7Ozs7Ozs7O1NBWWpFLENBQUMsQ0FBQzs7QUFFSCxnQkFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUN6Qjs7QUFFRCxhQUFTO2FBQUEsbUJBQUMsQ0FBQyxFQUFFO0FBQ1gsWUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7T0FDeEI7Ozs7U0E5RGtCLGlCQUFpQjtHQUFTLFNBQVM7O2lCQUFuQyxpQkFBaUIiLCJmaWxlIjoiZXM2L3RpbWVsaW5lLXN0YXRlcy9jZW50ZXJlZC16b29tLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuXG4vLyB3b3JrcyBidXQgc3RyYW5nZSBsb29wIG9uIHZpZXcgdG8gdXBkYXRlIGVhY2ggdGltZUNvbnRleHRzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDZW50ZXJlZFpvb21TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuXG4gICAgdGhpcy5jdXJyZW50TGF5ZXIgPSBudWxsO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLm1vdXNlRG93biA9IHRydWU7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgaWYgKCF0aGlzLm1vdXNlRG93bikgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IHRpbWVsaW5lID0gdGhpcy50aW1lbGluZTtcblxuICAgIC8vIEBOT1RFOiBraW5kIG9mIHdlaXJkbywgYnV0IHN1cmUgaG93IHRoaXMgd2lsbCBiZWFodmUgaWYgdmlldydzIHRpbWVDb250ZXh0XG4gICAgLy8gYXJlIG5vdCBjb25zaXN0ZW50c1xuICAgIHRoaXMudmlld3MuZm9yRWFjaChmdW5jdGlvbih2aWV3KSB7XG4gICAgICBjb25zdCB0aW1lQ29udGV4dCA9IHZpZXcudGltZUNvbnRleHQ7XG4gICAgICBjb25zdCBsYXN0Q2VudGVyVGltZSA9IHRpbWVDb250ZXh0LnhTY2FsZS5pbnZlcnQoZS54KTtcblxuICAgICAgdGltZUNvbnRleHQuc3RyZXRjaFJhdGlvICs9IGUuZHkgLyAxMDA7XG4gICAgICB0aW1lQ29udGV4dC5zdHJldGNoUmF0aW8gPSBNYXRoLm1heCh0aW1lQ29udGV4dC5zdHJldGNoUmF0aW8sIDAuMDEpO1xuXG4gICAgICBjb25zdCBuZXdDZW50ZXJUaW1lID0gdGltZUNvbnRleHQueFNjYWxlLmludmVydChlLngpO1xuICAgICAgY29uc3QgZGVsdGEgPSBuZXdDZW50ZXJUaW1lIC0gbGFzdENlbnRlclRpbWU7XG4gICAgICBjb25zdCBvZmZzZXQgPSB0aW1lQ29udGV4dC5vZmZzZXQ7XG4gICAgICAvLyBhcHBseSBuZXcgb2Zmc2V0IHRvIGtlZXAgaXQgY2VudGVyZWQgdG8gdGhlIG1vdXNlXG4gICAgICB0aW1lQ29udGV4dC5vZmZzZXQgKz0gKGRlbHRhICsgdGltZUNvbnRleHQueFNjYWxlLmludmVydChlLmR4KSk7XG5cbiAgICAgIC8vIGNsYW1wIG90aGVyIHZhbHVlcyBoZXJlIGlmIG5lZWRlZCAoZXhhbXBsZTogb2Zmc2V0IDw9IDAsIHN0cmV0Y2hSYXRpbyA+PSAxLCBldGMuLi4pXG5cbiAgICAgIC8vIGV4YW1wbGUga2VlcCBpbiBjb250YWluZXIgd2hlbiB6b29tZWQgb3V0XG4gICAgICAvLyBpZiAodGltZUNvbnRleHQuc3RyZXRjaFJhdGlvIDwgMSnCoHtcbiAgICAgIC8vICAgY29uc3QgbWluT2Zmc2V0ID0gdGltZUNvbnRleHQueFNjYWxlLmludmVydCgwKTtcbiAgICAgIC8vICAgY29uc3QgbWF4T2Zmc2V0ID0gdGltZUNvbnRleHQueFNjYWxlLmludmVydCh2aWV3LndpZHRoIC0gdGltZUNvbnRleHQueFNjYWxlKHRpbWVDb250ZXh0LmR1cmF0aW9uKSk7XG5cbiAgICAgIC8vICAgdGltZUNvbnRleHQub2Zmc2V0ID0gTWF0aC5tYXgodGltZUNvbnRleHQub2Zmc2V0LCBtaW5PZmZzZXQpO1xuICAgICAgLy8gICB0aW1lQ29udGV4dC5vZmZzZXQgPSBNYXRoLm1pbih0aW1lQ29udGV4dC5vZmZzZXQsIG1heE9mZnNldCk7XG4gICAgICAvLyB9XG4gICAgfSk7XG5cbiAgICB0aW1lbGluZS52aWV3cy51cGRhdGUoKTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgfVxufVxuIl19