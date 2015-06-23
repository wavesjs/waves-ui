// base class for all Events
// @NOTE: use a single Event per Surface
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var WaveEvent = (function () {
  function WaveEvent(type, originalEvent) {
    _classCallCheck(this, WaveEvent);

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

  _createClass(WaveEvent, {
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

  return WaveEvent;
})();

module.exports = WaveEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9pbnRlcmFjdGlvbnMvd2F2ZS1ldmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztJQUVNLFNBQVM7QUFDRixXQURQLFNBQVMsQ0FDRCxJQUFJLEVBQUUsYUFBYSxFQUFFOzBCQUQ3QixTQUFTOztBQUVYLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztBQUNuQyxRQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUM7QUFDakQsUUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7Ozs7QUFJbkMsUUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDZCxRQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNkLFFBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ2YsUUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDZixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztHQUNsQjs7ZUFkRyxTQUFTO0FBZ0JiLGNBQVU7YUFBQSxvQkFBQyxjQUFjLEVBQUUsU0FBUyxFQUFFO0FBQ3BDLFlBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFBRSxpQkFBTztTQUFFO0FBQzlDLFlBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFlBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDOztBQUUvQixZQUFNLElBQUksR0FBRyxjQUFjLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ25FLFlBQU0sR0FBRyxHQUFJLGNBQWMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbkUsWUFBTSxLQUFLLEdBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0QsWUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRS9ELFlBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLEdBQUcsRUFBSCxHQUFHLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUM7T0FDMUM7Ozs7U0EzQkcsU0FBUzs7O0FBOEJmLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDIiwiZmlsZSI6ImVzNi9pbnRlcmFjdGlvbnMvd2F2ZS1ldmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGJhc2UgY2xhc3MgZm9yIGFsbCBFdmVudHNcbi8vIEBOT1RFOiB1c2UgYSBzaW5nbGUgRXZlbnQgcGVyIFN1cmZhY2VcbmNsYXNzIFdhdmVFdmVudCB7XG4gIGNvbnN0cnVjdG9yKHR5cGUsIG9yaWdpbmFsRXZlbnQpIHtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMudGFyZ2V0ID0gb3JpZ2luYWxFdmVudC50YXJnZXQ7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gb3JpZ2luYWxFdmVudC5jdXJyZW50VGFyZ2V0O1xuICAgIHRoaXMub3JpZ2luYWxFdmVudCA9IG9yaWdpbmFsRXZlbnQ7XG5cbiAgICAvLyBpcyBzZXR0ZWQgaW4gdGltZWxpbmUncyBzdGF0ZXNcbiAgICAvLyB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICAgIHRoaXMueCA9IG51bGw7XG4gICAgdGhpcy55ID0gbnVsbDtcbiAgICB0aGlzLmR4ID0gbnVsbDtcbiAgICB0aGlzLmR5ID0gbnVsbDtcbiAgICB0aGlzLmFyZWEgPSBudWxsOyAvLyBAVE9ETyByZW5hbWVcbiAgfVxuXG4gIGRlZmluZUFyZWEobW91c2VEb3duRXZlbnQsIGxhc3RFdmVudCkge1xuICAgIGlmICghbW91c2VEb3duRXZlbnQgfHzCoCFsYXN0RXZlbnQpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5keCA9IHRoaXMueCAtIGxhc3RFdmVudC54O1xuICAgIHRoaXMuZHkgPSB0aGlzLnkgLSBsYXN0RXZlbnQueTtcblxuICAgIGNvbnN0IGxlZnQgPSBtb3VzZURvd25FdmVudC54IDwgdGhpcy54ID8gbW91c2VEb3duRXZlbnQueCA6IHRoaXMueDtcbiAgICBjb25zdCB0b3AgID0gbW91c2VEb3duRXZlbnQueSA8IHRoaXMueSA/IG1vdXNlRG93bkV2ZW50LnkgOiB0aGlzLnk7XG4gICAgY29uc3Qgd2lkdGggID0gTWF0aC5hYnMoTWF0aC5yb3VuZCh0aGlzLnggLSBtb3VzZURvd25FdmVudC54KSk7XG4gICAgY29uc3QgaGVpZ2h0ID0gTWF0aC5hYnMoTWF0aC5yb3VuZCh0aGlzLnkgLSBtb3VzZURvd25FdmVudC55KSk7XG5cbiAgICB0aGlzLmFyZWEgPSB7IGxlZnQsIHRvcCwgd2lkdGgsIGhlaWdodCB9O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gV2F2ZUV2ZW50OyJdfQ==