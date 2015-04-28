"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

// base class for all Events
// @NOTE: use a single Event per Surface

var Event = (function () {
  function Event(type, originalEvent) {
    _classCallCheck(this, Event);

    this.type = type;
    this.target = originalEvent.target;
    this.originalEvent = originalEvent;

    // is setted in timeline's states
    // this.currentTarget = null;
    this.x = null;
    this.y = null;
    this.dx = null;
    this.dy = null;
    this.area = null; // @TODO rename
  }

  _createClass(Event, {
    defineArea: {
      value: function defineArea(mouseDownEvent, lastEvent) {
        if (!mouseDownEvent || !lastEvent) {
          return;
        }
        this.dx = this.x - lastEvent.x;
        this.dy = this.y - lastEvent.y;

        var left = mouseDownEvent.x < this.x ? mouseDownEvent.x : this.x;
        var top = mouseDownEvent.y < this.y ? mouseDownEvent.y : this.y;
        var width = Math.abs(Math.round(this.x - mouseDownEvent.x));
        var height = Math.abs(Math.round(this.y - mouseDownEvent.y));

        this.area = { left: left, top: top, width: width, height: height };
      }
    }
  });

  return Event;
})();

module.exports = Event;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvcmVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFFTSxLQUFLO0FBQ0UsV0FEUCxLQUFLLENBQ0csSUFBSSxFQUFFLGFBQWEsRUFBRTswQkFEN0IsS0FBSzs7QUFFUCxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUM7QUFDbkMsUUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7Ozs7QUFJbkMsUUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDZCxRQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNkLFFBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ2YsUUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDZixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztHQUNsQjs7ZUFiRyxLQUFLO0FBZVQsY0FBVTthQUFBLG9CQUFDLGNBQWMsRUFBRSxTQUFTLEVBQUU7QUFDcEMsWUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGlCQUFPO1NBQUU7QUFDOUMsWUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsWUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUM7O0FBRS9CLFlBQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbkUsWUFBTSxHQUFHLEdBQUksY0FBYyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNuRSxZQUFNLEtBQUssR0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvRCxZQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFL0QsWUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsR0FBRyxFQUFILEdBQUcsRUFBRSxLQUFLLEVBQUwsS0FBSyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsQ0FBQztPQUMxQzs7OztTQTFCRyxLQUFLOzs7QUE2QlgsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMiLCJmaWxlIjoiZXM2L3NoYXBlcy9yZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gYmFzZSBjbGFzcyBmb3IgYWxsIEV2ZW50c1xuLy8gQE5PVEU6IHVzZSBhIHNpbmdsZSBFdmVudCBwZXIgU3VyZmFjZVxuY2xhc3MgRXZlbnQge1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBvcmlnaW5hbEV2ZW50KSB7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLnRhcmdldCA9IG9yaWdpbmFsRXZlbnQudGFyZ2V0O1xuICAgIHRoaXMub3JpZ2luYWxFdmVudCA9IG9yaWdpbmFsRXZlbnQ7XG5cbiAgICAvLyBpcyBzZXR0ZWQgaW4gdGltZWxpbmUncyBzdGF0ZXNcbiAgICAvLyB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICAgIHRoaXMueCA9IG51bGw7XG4gICAgdGhpcy55ID0gbnVsbDtcbiAgICB0aGlzLmR4ID0gbnVsbDtcbiAgICB0aGlzLmR5ID0gbnVsbDtcbiAgICB0aGlzLmFyZWEgPSBudWxsOyAvLyBAVE9ETyByZW5hbWVcbiAgfVxuXG4gIGRlZmluZUFyZWEobW91c2VEb3duRXZlbnQsIGxhc3RFdmVudCkge1xuICAgIGlmICghbW91c2VEb3duRXZlbnQgfHzCoCFsYXN0RXZlbnQpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5keCA9IHRoaXMueCAtIGxhc3RFdmVudC54O1xuICAgIHRoaXMuZHkgPSB0aGlzLnkgLSBsYXN0RXZlbnQueTtcblxuICAgIGNvbnN0IGxlZnQgPSBtb3VzZURvd25FdmVudC54IDwgdGhpcy54ID8gbW91c2VEb3duRXZlbnQueCA6IHRoaXMueDtcbiAgICBjb25zdCB0b3AgID0gbW91c2VEb3duRXZlbnQueSA8IHRoaXMueSA/IG1vdXNlRG93bkV2ZW50LnkgOiB0aGlzLnk7XG4gICAgY29uc3Qgd2lkdGggID0gTWF0aC5hYnMoTWF0aC5yb3VuZCh0aGlzLnggLSBtb3VzZURvd25FdmVudC54KSk7XG4gICAgY29uc3QgaGVpZ2h0ID0gTWF0aC5hYnMoTWF0aC5yb3VuZCh0aGlzLnkgLSBtb3VzZURvd25FdmVudC55KSk7XG5cbiAgICB0aGlzLmFyZWEgPSB7IGxlZnQsIHRvcCwgd2lkdGgsIGhlaWdodCB9O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnQ7Il19