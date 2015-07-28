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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7SUFFcUIsU0FBUztBQUNqQixXQURRLFNBQVMsQ0FDaEIsSUFBSSxFQUFFLGFBQWEsRUFBRTswQkFEZCxTQUFTOztBQUUxQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUM7QUFDbkMsUUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDO0FBQ2pELFFBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDOzs7O0FBSW5DLFFBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ2QsUUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDZCxRQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQztBQUNmLFFBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ2YsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7R0FDbEI7O2VBZGtCLFNBQVM7QUFnQjVCLGNBQVU7YUFBQSxvQkFBQyxjQUFjLEVBQUUsU0FBUyxFQUFFO0FBQ3BDLFlBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFBRSxpQkFBTztTQUFFO0FBQzlDLFlBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFlBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDOztBQUUvQixZQUFNLElBQUksR0FBRyxjQUFjLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ25FLFlBQU0sR0FBRyxHQUFJLGNBQWMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbkUsWUFBTSxLQUFLLEdBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0QsWUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRS9ELFlBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLEdBQUcsRUFBSCxHQUFHLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUM7T0FDMUM7Ozs7U0EzQmtCLFNBQVM7OztpQkFBVCxTQUFTIiwiZmlsZSI6ImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBiYXNlIGNsYXNzIGZvciBhbGwgRXZlbnRzXG4vLyBATk9URTogdXNlIGEgc2luZ2xlIEV2ZW50IHBlciBTdXJmYWNlXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXZlRXZlbnQge1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBvcmlnaW5hbEV2ZW50KSB7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLnRhcmdldCA9IG9yaWdpbmFsRXZlbnQudGFyZ2V0O1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG9yaWdpbmFsRXZlbnQuY3VycmVudFRhcmdldDtcbiAgICB0aGlzLm9yaWdpbmFsRXZlbnQgPSBvcmlnaW5hbEV2ZW50O1xuXG4gICAgLy8gaXMgc2V0dGVkIGluIHRpbWVsaW5lJ3Mgc3RhdGVzXG4gICAgLy8gdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcbiAgICB0aGlzLnggPSBudWxsO1xuICAgIHRoaXMueSA9IG51bGw7XG4gICAgdGhpcy5keCA9IG51bGw7XG4gICAgdGhpcy5keSA9IG51bGw7XG4gICAgdGhpcy5hcmVhID0gbnVsbDsgLy8gQFRPRE8gcmVuYW1lXG4gIH1cblxuICBkZWZpbmVBcmVhKG1vdXNlRG93bkV2ZW50LCBsYXN0RXZlbnQpIHtcbiAgICBpZiAoIW1vdXNlRG93bkV2ZW50IHx8wqAhbGFzdEV2ZW50KSB7IHJldHVybjsgfVxuICAgIHRoaXMuZHggPSB0aGlzLnggLSBsYXN0RXZlbnQueDtcbiAgICB0aGlzLmR5ID0gdGhpcy55IC0gbGFzdEV2ZW50Lnk7XG5cbiAgICBjb25zdCBsZWZ0ID0gbW91c2VEb3duRXZlbnQueCA8IHRoaXMueCA/IG1vdXNlRG93bkV2ZW50LnggOiB0aGlzLng7XG4gICAgY29uc3QgdG9wICA9IG1vdXNlRG93bkV2ZW50LnkgPCB0aGlzLnkgPyBtb3VzZURvd25FdmVudC55IDogdGhpcy55O1xuICAgIGNvbnN0IHdpZHRoICA9IE1hdGguYWJzKE1hdGgucm91bmQodGhpcy54IC0gbW91c2VEb3duRXZlbnQueCkpO1xuICAgIGNvbnN0IGhlaWdodCA9IE1hdGguYWJzKE1hdGgucm91bmQodGhpcy55IC0gbW91c2VEb3duRXZlbnQueSkpO1xuXG4gICAgdGhpcy5hcmVhID0geyBsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHQgfTtcbiAgfVxufVxuIl19