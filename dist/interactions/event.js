// base class for all Events
// @NOTE: use a single Event per Surface
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var Event = (function () {
  function Event(type, originalEvent) {
    _classCallCheck(this, Event);

    this.type = type;
    this.target = originalEvent.target;
    this.currentTarget = originalEvent.currentTarget;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9pbnRlcmFjdGlvbnMvZXZlbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7SUFFTSxLQUFLO0FBQ0UsV0FEUCxLQUFLLENBQ0csSUFBSSxFQUFFLGFBQWEsRUFBRTswQkFEN0IsS0FBSzs7QUFFUCxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUM7QUFDbkMsUUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDO0FBQ2pELFFBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDOzs7O0FBSW5DLFFBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ2QsUUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDZCxRQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQztBQUNmLFFBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ2YsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7R0FDbEI7O2VBZEcsS0FBSztBQWdCVCxjQUFVO2FBQUEsb0JBQUMsY0FBYyxFQUFFLFNBQVMsRUFBRTtBQUNwQyxZQUFJLENBQUMsY0FBYyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQUUsaUJBQU87U0FBRTtBQUM5QyxZQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUMvQixZQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQzs7QUFFL0IsWUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNuRSxZQUFNLEdBQUcsR0FBSSxjQUFjLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ25FLFlBQU0sS0FBSyxHQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9ELFlBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUUvRCxZQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxHQUFHLEVBQUgsR0FBRyxFQUFFLEtBQUssRUFBTCxLQUFLLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxDQUFDO09BQzFDOzs7O1NBM0JHLEtBQUs7OztBQThCWCxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyIsImZpbGUiOiJlczYvaW50ZXJhY3Rpb25zL2V2ZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gYmFzZSBjbGFzcyBmb3IgYWxsIEV2ZW50c1xuLy8gQE5PVEU6IHVzZSBhIHNpbmdsZSBFdmVudCBwZXIgU3VyZmFjZVxuY2xhc3MgRXZlbnQge1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBvcmlnaW5hbEV2ZW50KSB7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLnRhcmdldCA9IG9yaWdpbmFsRXZlbnQudGFyZ2V0O1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG9yaWdpbmFsRXZlbnQuY3VycmVudFRhcmdldDtcbiAgICB0aGlzLm9yaWdpbmFsRXZlbnQgPSBvcmlnaW5hbEV2ZW50O1xuXG4gICAgLy8gaXMgc2V0dGVkIGluIHRpbWVsaW5lJ3Mgc3RhdGVzXG4gICAgLy8gdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgICB0aGlzLnggPSBudWxsO1xuICAgIHRoaXMueSA9IG51bGw7XG4gICAgdGhpcy5keCA9IG51bGw7XG4gICAgdGhpcy5keSA9IG51bGw7XG4gICAgdGhpcy5hcmVhID0gbnVsbDsgLy8gQFRPRE8gcmVuYW1lXG4gIH1cblxuICBkZWZpbmVBcmVhKG1vdXNlRG93bkV2ZW50LCBsYXN0RXZlbnQpIHtcbiAgICBpZiAoIW1vdXNlRG93bkV2ZW50IHx8wqAhbGFzdEV2ZW50KSB7IHJldHVybjsgfVxuICAgIHRoaXMuZHggPSB0aGlzLnggLSBsYXN0RXZlbnQueDtcbiAgICB0aGlzLmR5ID0gdGhpcy55IC0gbGFzdEV2ZW50Lnk7XG5cbiAgICBjb25zdCBsZWZ0ID0gbW91c2VEb3duRXZlbnQueCA8IHRoaXMueCA/IG1vdXNlRG93bkV2ZW50LnggOiB0aGlzLng7XG4gICAgY29uc3QgdG9wICA9IG1vdXNlRG93bkV2ZW50LnkgPCB0aGlzLnkgPyBtb3VzZURvd25FdmVudC55IDogdGhpcy55O1xuICAgIGNvbnN0IHdpZHRoICA9IE1hdGguYWJzKE1hdGgucm91bmQodGhpcy54IC0gbW91c2VEb3duRXZlbnQueCkpO1xuICAgIGNvbnN0IGhlaWdodCA9IE1hdGguYWJzKE1hdGgucm91bmQodGhpcy55IC0gbW91c2VEb3duRXZlbnQueSkpO1xuXG4gICAgdGhpcy5hcmVhID0geyBsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHQgfTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50OyJdfQ==