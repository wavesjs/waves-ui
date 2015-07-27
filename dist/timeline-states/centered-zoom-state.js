"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var d3Scale = _interopRequire(require("d3-scale"));

var BaseState = _interopRequire(require("./base-state"));

/**
 * `CenteredZoomState` is a timeline state that allows the user to browse the timeline by clicking on a track, and then
 * - moving down to zoom in
 * - moving up to zoom out
 * - moving left to move in time, after
 * - moving right to move in time, before
 */

var CenteredZoomState = (function (_BaseState) {
  function CenteredZoomState(timeline) {
    _classCallCheck(this, CenteredZoomState);

    _get(_core.Object.getPrototypeOf(CenteredZoomState.prototype), "constructor", this).call(this, timeline);
    this.currentLayer = null;
    // Set max/min zoom
    // maxZoom: 1px per sample
    // minZoom: 10 000 px per 1 hour
    // with a default to 44.1kHz sample rate
    this.maxZoom = 44100 * 1 / this.timeline.timeContext.pixelsPerSecond;
    this.minZoom = 10000 / 3600 / this.timeline.timeContext.pixelsPerSecond;
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
        this.mouseDown = true; // is done in surface

        var actualZoom = this.timeline.timeContext.zoom;
        var initialY = e.y;

        this.valueToPixel = d3Scale.linear().domain([initialY, 0]).range([actualZoom, -2 * actualZoom]);
      }
    },
    onMouseMove: {
      value: function onMouseMove(e) {
        if (!this.mouseDown) {
          return;
        }

        var timeContext = this.timeline.timeContext;
        var lastCenterTime = timeContext.timeToPixel.invert(e.x);

        timeContext.zoom = Math.min(Math.max(this.valueToPixel(e.y), this.minZoom), this.maxZoom);

        var newCenterTime = timeContext.timeToPixel.invert(e.x);
        var delta = newCenterTime - lastCenterTime;

        // Apply new offset to keep it centered to the mouse
        timeContext.offset += delta + timeContext.timeToPixel.invert(e.dx);

        // Other possible experiments with centered-zoom-state
        //
        // Example 1: Prevent timeline.offset to be negative
        // timeContext.offset = Math.min(timeContext.offset, 0);
        //
        // Example 2: Keep in container when zoomed out
        // if (timeContext.stretchRatio < 1) {
        //   const minOffset = timeContext.timeToPixel.invert(0);
        //   const maxOffset = timeContext.timeToPixel.invert(view.width - timeContext.timeToPixel(timeContext.duration));
        //   timeContext.offset = Math.max(timeContext.offset, minOffset);
        //   timeContext.offset = Math.min(timeContext.offset, maxOffset);
        // }

        this.timeline.tracks.update();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvY2VudGVyZWQtem9vbS1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQUFPLE9BQU8sMkJBQU0sVUFBVTs7SUFFdkIsU0FBUywyQkFBTSxjQUFjOzs7Ozs7Ozs7O0lBVWYsaUJBQWlCO0FBQ3pCLFdBRFEsaUJBQWlCLENBQ3hCLFFBQVEsRUFBRTswQkFESCxpQkFBaUI7O0FBRWxDLHFDQUZpQixpQkFBaUIsNkNBRTVCLFFBQVEsRUFBRTtBQUNoQixRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzs7Ozs7QUFLekIsUUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQztBQUNyRSxRQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDO0dBQ3pFOztZQVZrQixpQkFBaUI7O2VBQWpCLGlCQUFpQjtBQVlwQyxlQUFXO2FBQUEscUJBQUMsQ0FBQyxFQUFFO0FBQ2IsZ0JBQU8sQ0FBQyxDQUFDLElBQUk7QUFDWCxlQUFLLFdBQVc7QUFDZCxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixrQkFBTTtBQUFBLEFBQ1IsZUFBSyxXQUFXO0FBQ2QsZ0JBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsa0JBQU07QUFBQSxBQUNSLGVBQUssU0FBUztBQUNaLGdCQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLGtCQUFNO0FBQUEsU0FDVDtPQUNGOztBQUVELGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7QUFDYixZQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzs7QUFFdEIsWUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO0FBQ2xELFlBQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXJCLFlBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUNqQyxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FDckIsS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUM7T0FDekM7O0FBRUQsZUFBVzthQUFBLHFCQUFDLENBQUMsRUFBRTtBQUNiLFlBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQUUsaUJBQU87U0FBRTs7QUFFaEMsWUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7QUFDOUMsWUFBTSxjQUFjLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUUzRCxtQkFBVyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFMUYsWUFBTSxhQUFhLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFELFlBQU0sS0FBSyxHQUFHLGFBQWEsR0FBRyxjQUFjLENBQUM7OztBQUc3QyxtQkFBVyxDQUFDLE1BQU0sSUFBSyxLQUFLLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxBQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQWVyRSxZQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUMvQjs7QUFFRCxhQUFTO2FBQUEsbUJBQUMsQ0FBQyxFQUFFO0FBQ1gsWUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7T0FDeEI7Ozs7U0FyRWtCLGlCQUFpQjtHQUFTLFNBQVM7O2lCQUFuQyxpQkFBaUIiLCJmaWxlIjoiZXM2L3RpbWVsaW5lLXN0YXRlcy9jZW50ZXJlZC16b29tLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGQzU2NhbGUgZnJvbSAnZDMtc2NhbGUnO1xuXG5pbXBvcnQgQmFzZVN0YXRlIGZyb20gJy4vYmFzZS1zdGF0ZSc7XG5cblxuLyoqXG4gKiBgQ2VudGVyZWRab29tU3RhdGVgIGlzIGEgdGltZWxpbmUgc3RhdGUgdGhhdCBhbGxvd3MgdGhlIHVzZXIgdG8gYnJvd3NlIHRoZSB0aW1lbGluZSBieSBjbGlja2luZyBvbiBhIHRyYWNrLCBhbmQgdGhlblxuICogLSBtb3ZpbmcgZG93biB0byB6b29tIGluXG4gKiAtIG1vdmluZyB1cCB0byB6b29tIG91dFxuICogLSBtb3ZpbmcgbGVmdCB0byBtb3ZlIGluIHRpbWUsIGFmdGVyXG4gKiAtIG1vdmluZyByaWdodCB0byBtb3ZlIGluIHRpbWUsIGJlZm9yZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDZW50ZXJlZFpvb21TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuICAgIHRoaXMuY3VycmVudExheWVyID0gbnVsbDtcbiAgICAvLyBTZXQgbWF4L21pbiB6b29tXG4gICAgLy8gbWF4Wm9vbTogMXB4IHBlciBzYW1wbGVcbiAgICAvLyBtaW5ab29tOiAxMCAwMDAgcHggcGVyIDEgaG91clxuICAgIC8vIHdpdGggYSBkZWZhdWx0IHRvIDQ0LjFrSHogc2FtcGxlIHJhdGVcbiAgICB0aGlzLm1heFpvb20gPSA0NDEwMCAqIDEgLyB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0LnBpeGVsc1BlclNlY29uZDtcbiAgICB0aGlzLm1pblpvb20gPSAxMDAwMCAvIDM2MDAgLyB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0LnBpeGVsc1BlclNlY29uZDtcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2goZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgdGhpcy5tb3VzZURvd24gPSB0cnVlOyAvLyBpcyBkb25lIGluIHN1cmZhY2VcblxuICAgIGNvbnN0IGFjdHVhbFpvb20gPSB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0Lnpvb207XG4gICAgY29uc3QgaW5pdGlhbFkgPSBlLnk7XG5cbiAgICB0aGlzLnZhbHVlVG9QaXhlbCA9IGQzU2NhbGUubGluZWFyKClcbiAgICAgIC5kb21haW4oW2luaXRpYWxZLCAwXSlcbiAgICAgIC5yYW5nZShbYWN0dWFsWm9vbSwgLTIgKiBhY3R1YWxab29tXSk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgaWYgKCF0aGlzLm1vdXNlRG93bikgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dDtcbiAgICBjb25zdCBsYXN0Q2VudGVyVGltZSA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChlLngpO1xuXG4gICAgdGltZUNvbnRleHQuem9vbSA9IE1hdGgubWluKE1hdGgubWF4KHRoaXMudmFsdWVUb1BpeGVsKGUueSksIHRoaXMubWluWm9vbSksIHRoaXMubWF4Wm9vbSk7XG5cbiAgICBjb25zdCBuZXdDZW50ZXJUaW1lID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KGUueCk7XG4gICAgY29uc3QgZGVsdGEgPSBuZXdDZW50ZXJUaW1lIC0gbGFzdENlbnRlclRpbWU7XG5cbiAgICAvLyBBcHBseSBuZXcgb2Zmc2V0IHRvIGtlZXAgaXQgY2VudGVyZWQgdG8gdGhlIG1vdXNlXG4gICAgdGltZUNvbnRleHQub2Zmc2V0ICs9IChkZWx0YSArIHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChlLmR4KSk7XG5cbiAgICAvLyBPdGhlciBwb3NzaWJsZSBleHBlcmltZW50cyB3aXRoIGNlbnRlcmVkLXpvb20tc3RhdGVcbiAgICAvL1xuICAgIC8vIEV4YW1wbGUgMTogUHJldmVudCB0aW1lbGluZS5vZmZzZXQgdG8gYmUgbmVnYXRpdmVcbiAgICAvLyB0aW1lQ29udGV4dC5vZmZzZXQgPSBNYXRoLm1pbih0aW1lQ29udGV4dC5vZmZzZXQsIDApO1xuICAgIC8vXG4gICAgLy8gRXhhbXBsZSAyOiBLZWVwIGluIGNvbnRhaW5lciB3aGVuIHpvb21lZCBvdXRcbiAgICAvLyBpZiAodGltZUNvbnRleHQuc3RyZXRjaFJhdGlvIDwgMSnCoHtcbiAgICAvLyAgIGNvbnN0IG1pbk9mZnNldCA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCgwKTtcbiAgICAvLyAgIGNvbnN0IG1heE9mZnNldCA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh2aWV3LndpZHRoIC0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwodGltZUNvbnRleHQuZHVyYXRpb24pKTtcbiAgICAvLyAgIHRpbWVDb250ZXh0Lm9mZnNldCA9IE1hdGgubWF4KHRpbWVDb250ZXh0Lm9mZnNldCwgbWluT2Zmc2V0KTtcbiAgICAvLyAgIHRpbWVDb250ZXh0Lm9mZnNldCA9IE1hdGgubWluKHRpbWVDb250ZXh0Lm9mZnNldCwgbWF4T2Zmc2V0KTtcbiAgICAvLyB9XG5cbiAgICB0aGlzLnRpbWVsaW5lLnRyYWNrcy51cGRhdGUoKTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgdGhpcy5tb3VzZURvd24gPSBmYWxzZTtcbiAgfVxufVxuIl19