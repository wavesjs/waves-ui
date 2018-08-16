'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _scales = require('../utils/scales');

var _scales2 = _interopRequireDefault(_scales);

var _BaseState2 = require('./BaseState');

var _BaseState3 = _interopRequireDefault(_BaseState2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * `CenteredZoomState` is a timeline state mimicing the `Live` zoom interaction. It allows the user to browse the timeline by clicking on a track, and then
 * - moving down to zoom in
 * - moving up to zoom out
 * - moving left to move in time, after
 * - moving right to move in time, before
 *
 * [example usage](./examples/states-zoom.html)
 */
var CenteredZoomState = function (_BaseState) {
  (0, _inherits3.default)(CenteredZoomState, _BaseState);

  function CenteredZoomState(timeline) {
    (0, _classCallCheck3.default)(this, CenteredZoomState);

    var _this = (0, _possibleConstructorReturn3.default)(this, (CenteredZoomState.__proto__ || (0, _getPrototypeOf2.default)(CenteredZoomState)).call(this, timeline));

    _this.currentLayer = null;
    // Set max/min zoom
    // maxZoom: 1px per sample
    // minZoom: 10 000 px per 1 hour
    // with a default to 44.1kHz sample rate
    _this.maxZoom = 44100 * 1 / _this.timeline.timeContext.pixelsPerSecond;
    _this.minZoom = 10000 / 3600 / _this.timeline.timeContext.pixelsPerSecond;
    return _this;
  }

  (0, _createClass3.default)(CenteredZoomState, [{
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e);
          break;
        case 'mousemove':
          this.onMouseMove(e);
          break;
        case 'mouseup':
          this.onMouseUp(e);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      this.initialZoom = this.timeline.timeContext.zoom;
      this.initialY = e.y;

      this._pixelToExponent = _scales2.default.linear().domain([0, 100]) // 100px => factor 2
      .range([0, 1]);
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      // prevent annoying text selection when dragging
      e.originalEvent.preventDefault();

      var timeContext = this.timeline.timeContext;
      var lastCenterTime = timeContext.timeToPixel.invert(e.x);
      var exponent = this._pixelToExponent(e.y - this.initialY);
      var targetZoom = this.initialZoom * Math.pow(2, exponent); // -1...1 -> 1/2...2

      timeContext.zoom = Math.min(Math.max(targetZoom, this.minZoom), this.maxZoom);

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
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {}
  }]);
  return CenteredZoomState;
}(_BaseState3.default);

exports.default = CenteredZoomState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNlbnRlcmVkWm9vbVN0YXRlLmpzIl0sIm5hbWVzIjpbIkNlbnRlcmVkWm9vbVN0YXRlIiwidGltZWxpbmUiLCJjdXJyZW50TGF5ZXIiLCJtYXhab29tIiwidGltZUNvbnRleHQiLCJwaXhlbHNQZXJTZWNvbmQiLCJtaW5ab29tIiwiZSIsInR5cGUiLCJvbk1vdXNlRG93biIsIm9uTW91c2VNb3ZlIiwib25Nb3VzZVVwIiwiaW5pdGlhbFpvb20iLCJ6b29tIiwiaW5pdGlhbFkiLCJ5IiwiX3BpeGVsVG9FeHBvbmVudCIsImxpbmVhciIsImRvbWFpbiIsInJhbmdlIiwib3JpZ2luYWxFdmVudCIsInByZXZlbnREZWZhdWx0IiwibGFzdENlbnRlclRpbWUiLCJ0aW1lVG9QaXhlbCIsImludmVydCIsIngiLCJleHBvbmVudCIsInRhcmdldFpvb20iLCJNYXRoIiwicG93IiwibWluIiwibWF4IiwibmV3Q2VudGVyVGltZSIsImRlbHRhIiwib2Zmc2V0IiwiZHgiLCJ0cmFja3MiLCJ1cGRhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBR0E7Ozs7Ozs7OztJQVNNQSxpQjs7O0FBQ0osNkJBQVlDLFFBQVosRUFBc0I7QUFBQTs7QUFBQSw0SkFDZEEsUUFEYzs7QUFFcEIsVUFBS0MsWUFBTCxHQUFvQixJQUFwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBS0MsT0FBTCxHQUFlLFFBQVEsQ0FBUixHQUFZLE1BQUtGLFFBQUwsQ0FBY0csV0FBZCxDQUEwQkMsZUFBckQ7QUFDQSxVQUFLQyxPQUFMLEdBQWUsUUFBUSxJQUFSLEdBQWUsTUFBS0wsUUFBTCxDQUFjRyxXQUFkLENBQTBCQyxlQUF4RDtBQVJvQjtBQVNyQjs7OztnQ0FFV0UsQyxFQUFHO0FBQ2IsY0FBT0EsRUFBRUMsSUFBVDtBQUNFLGFBQUssV0FBTDtBQUNFLGVBQUtDLFdBQUwsQ0FBaUJGLENBQWpCO0FBQ0E7QUFDRixhQUFLLFdBQUw7QUFDRSxlQUFLRyxXQUFMLENBQWlCSCxDQUFqQjtBQUNBO0FBQ0YsYUFBSyxTQUFMO0FBQ0UsZUFBS0ksU0FBTCxDQUFlSixDQUFmO0FBQ0E7QUFUSjtBQVdEOzs7Z0NBRVdBLEMsRUFBRztBQUNiLFdBQUtLLFdBQUwsR0FBbUIsS0FBS1gsUUFBTCxDQUFjRyxXQUFkLENBQTBCUyxJQUE3QztBQUNBLFdBQUtDLFFBQUwsR0FBZ0JQLEVBQUVRLENBQWxCOztBQUVBLFdBQUtDLGdCQUFMLEdBQXdCLGlCQUFPQyxNQUFQLEdBQ3JCQyxNQURxQixDQUNkLENBQUMsQ0FBRCxFQUFJLEdBQUosQ0FEYyxFQUNKO0FBREksT0FFckJDLEtBRnFCLENBRWYsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUZlLENBQXhCO0FBR0Q7OztnQ0FFV1osQyxFQUFHO0FBQ2I7QUFDQUEsUUFBRWEsYUFBRixDQUFnQkMsY0FBaEI7O0FBRUEsVUFBTWpCLGNBQWMsS0FBS0gsUUFBTCxDQUFjRyxXQUFsQztBQUNBLFVBQU1rQixpQkFBaUJsQixZQUFZbUIsV0FBWixDQUF3QkMsTUFBeEIsQ0FBK0JqQixFQUFFa0IsQ0FBakMsQ0FBdkI7QUFDQSxVQUFNQyxXQUFXLEtBQUtWLGdCQUFMLENBQXNCVCxFQUFFUSxDQUFGLEdBQU0sS0FBS0QsUUFBakMsQ0FBakI7QUFDQSxVQUFNYSxhQUFhLEtBQUtmLFdBQUwsR0FBbUJnQixLQUFLQyxHQUFMLENBQVMsQ0FBVCxFQUFZSCxRQUFaLENBQXRDLENBUGEsQ0FPZ0Q7O0FBRTdEdEIsa0JBQVlTLElBQVosR0FBbUJlLEtBQUtFLEdBQUwsQ0FBU0YsS0FBS0csR0FBTCxDQUFTSixVQUFULEVBQXFCLEtBQUtyQixPQUExQixDQUFULEVBQTZDLEtBQUtILE9BQWxELENBQW5COztBQUVBLFVBQU02QixnQkFBZ0I1QixZQUFZbUIsV0FBWixDQUF3QkMsTUFBeEIsQ0FBK0JqQixFQUFFa0IsQ0FBakMsQ0FBdEI7QUFDQSxVQUFNUSxRQUFRRCxnQkFBZ0JWLGNBQTlCOztBQUVBO0FBQ0FsQixrQkFBWThCLE1BQVosSUFBdUJELFFBQVE3QixZQUFZbUIsV0FBWixDQUF3QkMsTUFBeEIsQ0FBK0JqQixFQUFFNEIsRUFBakMsQ0FBL0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQUtsQyxRQUFMLENBQWNtQyxNQUFkLENBQXFCQyxNQUFyQjtBQUNEOzs7OEJBRVM5QixDLEVBQUcsQ0FBRTs7Ozs7a0JBR0ZQLGlCIiwiZmlsZSI6IkNlbnRlcmVkWm9vbVN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNjYWxlcyBmcm9tICcuLi91dGlscy9zY2FsZXMnO1xuaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL0Jhc2VTdGF0ZSc7XG5cblxuLyoqXG4gKiBgQ2VudGVyZWRab29tU3RhdGVgIGlzIGEgdGltZWxpbmUgc3RhdGUgbWltaWNpbmcgdGhlIGBMaXZlYCB6b29tIGludGVyYWN0aW9uLiBJdCBhbGxvd3MgdGhlIHVzZXIgdG8gYnJvd3NlIHRoZSB0aW1lbGluZSBieSBjbGlja2luZyBvbiBhIHRyYWNrLCBhbmQgdGhlblxuICogLSBtb3ZpbmcgZG93biB0byB6b29tIGluXG4gKiAtIG1vdmluZyB1cCB0byB6b29tIG91dFxuICogLSBtb3ZpbmcgbGVmdCB0byBtb3ZlIGluIHRpbWUsIGFmdGVyXG4gKiAtIG1vdmluZyByaWdodCB0byBtb3ZlIGluIHRpbWUsIGJlZm9yZVxuICpcbiAqIFtleGFtcGxlIHVzYWdlXSguL2V4YW1wbGVzL3N0YXRlcy16b29tLmh0bWwpXG4gKi9cbmNsYXNzIENlbnRlcmVkWm9vbVN0YXRlIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcih0aW1lbGluZSk7XG4gICAgdGhpcy5jdXJyZW50TGF5ZXIgPSBudWxsO1xuICAgIC8vIFNldCBtYXgvbWluIHpvb21cbiAgICAvLyBtYXhab29tOiAxcHggcGVyIHNhbXBsZVxuICAgIC8vIG1pblpvb206IDEwIDAwMCBweCBwZXIgMSBob3VyXG4gICAgLy8gd2l0aCBhIGRlZmF1bHQgdG8gNDQuMWtIeiBzYW1wbGUgcmF0ZVxuICAgIHRoaXMubWF4Wm9vbSA9IDQ0MTAwICogMSAvIHRoaXMudGltZWxpbmUudGltZUNvbnRleHQucGl4ZWxzUGVyU2Vjb25kO1xuICAgIHRoaXMubWluWm9vbSA9IDEwMDAwIC8gMzYwMCAvIHRoaXMudGltZWxpbmUudGltZUNvbnRleHQucGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQoZSkge1xuICAgIHN3aXRjaChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLmluaXRpYWxab29tID0gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC56b29tO1xuICAgIHRoaXMuaW5pdGlhbFkgPSBlLnk7XG5cbiAgICB0aGlzLl9waXhlbFRvRXhwb25lbnQgPSBzY2FsZXMubGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIDEwMF0pIC8vIDEwMHB4ID0+IGZhY3RvciAyXG4gICAgICAucmFuZ2UoWzAsIDFdKTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICAvLyBwcmV2ZW50IGFubm95aW5nIHRleHQgc2VsZWN0aW9uIHdoZW4gZHJhZ2dpbmdcbiAgICBlLm9yaWdpbmFsRXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dDtcbiAgICBjb25zdCBsYXN0Q2VudGVyVGltZSA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChlLngpO1xuICAgIGNvbnN0IGV4cG9uZW50ID0gdGhpcy5fcGl4ZWxUb0V4cG9uZW50KGUueSAtIHRoaXMuaW5pdGlhbFkpO1xuICAgIGNvbnN0IHRhcmdldFpvb20gPSB0aGlzLmluaXRpYWxab29tICogTWF0aC5wb3coMiwgZXhwb25lbnQpOyAvLyAtMS4uLjEgLT4gMS8yLi4uMlxuXG4gICAgdGltZUNvbnRleHQuem9vbSA9IE1hdGgubWluKE1hdGgubWF4KHRhcmdldFpvb20sIHRoaXMubWluWm9vbSksIHRoaXMubWF4Wm9vbSk7XG5cbiAgICBjb25zdCBuZXdDZW50ZXJUaW1lID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KGUueCk7XG4gICAgY29uc3QgZGVsdGEgPSBuZXdDZW50ZXJUaW1lIC0gbGFzdENlbnRlclRpbWU7XG5cbiAgICAvLyBBcHBseSBuZXcgb2Zmc2V0IHRvIGtlZXAgaXQgY2VudGVyZWQgdG8gdGhlIG1vdXNlXG4gICAgdGltZUNvbnRleHQub2Zmc2V0ICs9IChkZWx0YSArIHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChlLmR4KSk7XG5cbiAgICAvLyBPdGhlciBwb3NzaWJsZSBleHBlcmltZW50cyB3aXRoIGNlbnRlcmVkLXpvb20tc3RhdGVcbiAgICAvL1xuICAgIC8vIEV4YW1wbGUgMTogUHJldmVudCB0aW1lbGluZS5vZmZzZXQgdG8gYmUgbmVnYXRpdmVcbiAgICAvLyB0aW1lQ29udGV4dC5vZmZzZXQgPSBNYXRoLm1pbih0aW1lQ29udGV4dC5vZmZzZXQsIDApO1xuICAgIC8vXG4gICAgLy8gRXhhbXBsZSAyOiBLZWVwIGluIGNvbnRhaW5lciB3aGVuIHpvb21lZCBvdXRcbiAgICAvLyBpZiAodGltZUNvbnRleHQuc3RyZXRjaFJhdGlvIDwgMSnCoHtcbiAgICAvLyAgIGNvbnN0IG1pbk9mZnNldCA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCgwKTtcbiAgICAvLyAgIGNvbnN0IG1heE9mZnNldCA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydCh2aWV3LndpZHRoIC0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwodGltZUNvbnRleHQuZHVyYXRpb24pKTtcbiAgICAvLyAgIHRpbWVDb250ZXh0Lm9mZnNldCA9IE1hdGgubWF4KHRpbWVDb250ZXh0Lm9mZnNldCwgbWluT2Zmc2V0KTtcbiAgICAvLyAgIHRpbWVDb250ZXh0Lm9mZnNldCA9IE1hdGgubWluKHRpbWVDb250ZXh0Lm9mZnNldCwgbWF4T2Zmc2V0KTtcbiAgICAvLyB9XG5cbiAgICB0aGlzLnRpbWVsaW5lLnRyYWNrcy51cGRhdGUoKTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7fVxufVxuXG5leHBvcnQgZGVmYXVsdCBDZW50ZXJlZFpvb21TdGF0ZTtcbiJdfQ==