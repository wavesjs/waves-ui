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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0lBRU0sS0FBSztBQUNFLFdBRFAsS0FBSyxDQUNHLElBQUksRUFBRSxhQUFhLEVBQUU7MEJBRDdCLEtBQUs7O0FBRVAsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDO0FBQ25DLFFBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDOzs7O0FBSW5DLFFBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ2QsUUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDZCxRQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQztBQUNmLFFBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ2YsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7R0FDbEI7O2VBYkcsS0FBSztBQWVULGNBQVU7YUFBQSxvQkFBQyxjQUFjLEVBQUUsU0FBUyxFQUFFO0FBQ3BDLFlBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFBRSxpQkFBTztTQUFFO0FBQzlDLFlBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFlBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDOztBQUUvQixZQUFNLElBQUksR0FBRyxjQUFjLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ25FLFlBQU0sR0FBRyxHQUFJLGNBQWMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbkUsWUFBTSxLQUFLLEdBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0QsWUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRS9ELFlBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLEdBQUcsRUFBSCxHQUFHLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUM7T0FDMUM7Ozs7U0ExQkcsS0FBSzs7O0FBNkJYLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDIiwiZmlsZSI6ImVzNi90aW1lbGluZS1zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gYmFzZSBjbGFzcyBmb3IgYWxsIEV2ZW50c1xuLy8gQE5PVEU6IHVzZSBhIHNpbmdsZSBFdmVudCBwZXIgU3VyZmFjZVxuY2xhc3MgRXZlbnQge1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBvcmlnaW5hbEV2ZW50KSB7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLnRhcmdldCA9IG9yaWdpbmFsRXZlbnQudGFyZ2V0O1xuICAgIHRoaXMub3JpZ2luYWxFdmVudCA9IG9yaWdpbmFsRXZlbnQ7XG5cbiAgICAvLyBpcyBzZXR0ZWQgaW4gdGltZWxpbmUncyBzdGF0ZXNcbiAgICAvLyB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICAgIHRoaXMueCA9IG51bGw7XG4gICAgdGhpcy55ID0gbnVsbDtcbiAgICB0aGlzLmR4ID0gbnVsbDtcbiAgICB0aGlzLmR5ID0gbnVsbDtcbiAgICB0aGlzLmFyZWEgPSBudWxsOyAvLyBAVE9ETyByZW5hbWVcbiAgfVxuXG4gIGRlZmluZUFyZWEobW91c2VEb3duRXZlbnQsIGxhc3RFdmVudCkge1xuICAgIGlmICghbW91c2VEb3duRXZlbnQgfHzCoCFsYXN0RXZlbnQpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5keCA9IHRoaXMueCAtIGxhc3RFdmVudC54O1xuICAgIHRoaXMuZHkgPSB0aGlzLnkgLSBsYXN0RXZlbnQueTtcblxuICAgIGNvbnN0IGxlZnQgPSBtb3VzZURvd25FdmVudC54IDwgdGhpcy54ID8gbW91c2VEb3duRXZlbnQueCA6IHRoaXMueDtcbiAgICBjb25zdCB0b3AgID0gbW91c2VEb3duRXZlbnQueSA8IHRoaXMueSA/IG1vdXNlRG93bkV2ZW50LnkgOiB0aGlzLnk7XG4gICAgY29uc3Qgd2lkdGggID0gTWF0aC5hYnMoTWF0aC5yb3VuZCh0aGlzLnggLSBtb3VzZURvd25FdmVudC54KSk7XG4gICAgY29uc3QgaGVpZ2h0ID0gTWF0aC5hYnMoTWF0aC5yb3VuZCh0aGlzLnkgLSBtb3VzZURvd25FdmVudC55KSk7XG5cbiAgICB0aGlzLmFyZWEgPSB7IGxlZnQsIHRvcCwgd2lkdGgsIGhlaWdodCB9O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnQ7Il19