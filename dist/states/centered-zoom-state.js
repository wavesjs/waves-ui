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

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

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
}(_baseState2.default);

exports.default = CenteredZoomState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNlbnRlcmVkLXpvb20tc3RhdGUuanMiXSwibmFtZXMiOlsiQ2VudGVyZWRab29tU3RhdGUiLCJ0aW1lbGluZSIsImN1cnJlbnRMYXllciIsIm1heFpvb20iLCJ0aW1lQ29udGV4dCIsInBpeGVsc1BlclNlY29uZCIsIm1pblpvb20iLCJlIiwidHlwZSIsIm9uTW91c2VEb3duIiwib25Nb3VzZU1vdmUiLCJvbk1vdXNlVXAiLCJpbml0aWFsWm9vbSIsInpvb20iLCJpbml0aWFsWSIsInkiLCJfcGl4ZWxUb0V4cG9uZW50IiwibGluZWFyIiwiZG9tYWluIiwicmFuZ2UiLCJvcmlnaW5hbEV2ZW50IiwicHJldmVudERlZmF1bHQiLCJsYXN0Q2VudGVyVGltZSIsInRpbWVUb1BpeGVsIiwiaW52ZXJ0IiwieCIsImV4cG9uZW50IiwidGFyZ2V0Wm9vbSIsIk1hdGgiLCJwb3ciLCJtaW4iLCJtYXgiLCJuZXdDZW50ZXJUaW1lIiwiZGVsdGEiLCJvZmZzZXQiLCJkeCIsInRyYWNrcyIsInVwZGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFHQTs7Ozs7Ozs7O0lBU3FCQSxpQjs7O0FBQ25CLDZCQUFZQyxRQUFaLEVBQXNCO0FBQUE7O0FBQUEsNEpBQ2RBLFFBRGM7O0FBRXBCLFVBQUtDLFlBQUwsR0FBb0IsSUFBcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQUtDLE9BQUwsR0FBZSxRQUFRLENBQVIsR0FBWSxNQUFLRixRQUFMLENBQWNHLFdBQWQsQ0FBMEJDLGVBQXJEO0FBQ0EsVUFBS0MsT0FBTCxHQUFlLFFBQVEsSUFBUixHQUFlLE1BQUtMLFFBQUwsQ0FBY0csV0FBZCxDQUEwQkMsZUFBeEQ7QUFSb0I7QUFTckI7Ozs7Z0NBRVdFLEMsRUFBRztBQUNiLGNBQU9BLEVBQUVDLElBQVQ7QUFDRSxhQUFLLFdBQUw7QUFDRSxlQUFLQyxXQUFMLENBQWlCRixDQUFqQjtBQUNBO0FBQ0YsYUFBSyxXQUFMO0FBQ0UsZUFBS0csV0FBTCxDQUFpQkgsQ0FBakI7QUFDQTtBQUNGLGFBQUssU0FBTDtBQUNFLGVBQUtJLFNBQUwsQ0FBZUosQ0FBZjtBQUNBO0FBVEo7QUFXRDs7O2dDQUVXQSxDLEVBQUc7QUFDYixXQUFLSyxXQUFMLEdBQW1CLEtBQUtYLFFBQUwsQ0FBY0csV0FBZCxDQUEwQlMsSUFBN0M7QUFDQSxXQUFLQyxRQUFMLEdBQWdCUCxFQUFFUSxDQUFsQjs7QUFFQSxXQUFLQyxnQkFBTCxHQUF3QixpQkFBT0MsTUFBUCxHQUNyQkMsTUFEcUIsQ0FDZCxDQUFDLENBQUQsRUFBSSxHQUFKLENBRGMsRUFDSjtBQURJLE9BRXJCQyxLQUZxQixDQUVmLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FGZSxDQUF4QjtBQUdEOzs7Z0NBRVdaLEMsRUFBRztBQUNiO0FBQ0FBLFFBQUVhLGFBQUYsQ0FBZ0JDLGNBQWhCOztBQUVBLFVBQU1qQixjQUFjLEtBQUtILFFBQUwsQ0FBY0csV0FBbEM7QUFDQSxVQUFNa0IsaUJBQWlCbEIsWUFBWW1CLFdBQVosQ0FBd0JDLE1BQXhCLENBQStCakIsRUFBRWtCLENBQWpDLENBQXZCO0FBQ0EsVUFBTUMsV0FBVyxLQUFLVixnQkFBTCxDQUFzQlQsRUFBRVEsQ0FBRixHQUFNLEtBQUtELFFBQWpDLENBQWpCO0FBQ0EsVUFBTWEsYUFBYSxLQUFLZixXQUFMLEdBQW1CZ0IsS0FBS0MsR0FBTCxDQUFTLENBQVQsRUFBWUgsUUFBWixDQUF0QyxDQVBhLENBT2dEOztBQUU3RHRCLGtCQUFZUyxJQUFaLEdBQW1CZSxLQUFLRSxHQUFMLENBQVNGLEtBQUtHLEdBQUwsQ0FBU0osVUFBVCxFQUFxQixLQUFLckIsT0FBMUIsQ0FBVCxFQUE2QyxLQUFLSCxPQUFsRCxDQUFuQjs7QUFFQSxVQUFNNkIsZ0JBQWdCNUIsWUFBWW1CLFdBQVosQ0FBd0JDLE1BQXhCLENBQStCakIsRUFBRWtCLENBQWpDLENBQXRCO0FBQ0EsVUFBTVEsUUFBUUQsZ0JBQWdCVixjQUE5Qjs7QUFFQTtBQUNBbEIsa0JBQVk4QixNQUFaLElBQXVCRCxRQUFRN0IsWUFBWW1CLFdBQVosQ0FBd0JDLE1BQXhCLENBQStCakIsRUFBRTRCLEVBQWpDLENBQS9COztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFLbEMsUUFBTCxDQUFjbUMsTUFBZCxDQUFxQkMsTUFBckI7QUFDRDs7OzhCQUVTOUIsQyxFQUFHLENBQUU7Ozs7O2tCQXBFSVAsaUIiLCJmaWxlIjoiY2VudGVyZWQtem9vbS1zdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzY2FsZXMgZnJvbSAnLi4vdXRpbHMvc2NhbGVzJztcbmltcG9ydCBCYXNlU3RhdGUgZnJvbSAnLi9iYXNlLXN0YXRlJztcblxuXG4vKipcbiAqIGBDZW50ZXJlZFpvb21TdGF0ZWAgaXMgYSB0aW1lbGluZSBzdGF0ZSBtaW1pY2luZyB0aGUgYExpdmVgIHpvb20gaW50ZXJhY3Rpb24uIEl0IGFsbG93cyB0aGUgdXNlciB0byBicm93c2UgdGhlIHRpbWVsaW5lIGJ5IGNsaWNraW5nIG9uIGEgdHJhY2ssIGFuZCB0aGVuXG4gKiAtIG1vdmluZyBkb3duIHRvIHpvb20gaW5cbiAqIC0gbW92aW5nIHVwIHRvIHpvb20gb3V0XG4gKiAtIG1vdmluZyBsZWZ0IHRvIG1vdmUgaW4gdGltZSwgYWZ0ZXJcbiAqIC0gbW92aW5nIHJpZ2h0IHRvIG1vdmUgaW4gdGltZSwgYmVmb3JlXG4gKlxuICogW2V4YW1wbGUgdXNhZ2VdKC4vZXhhbXBsZXMvc3RhdGVzLXpvb20uaHRtbClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2VudGVyZWRab29tU3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcbiAgICB0aGlzLmN1cnJlbnRMYXllciA9IG51bGw7XG4gICAgLy8gU2V0IG1heC9taW4gem9vbVxuICAgIC8vIG1heFpvb206IDFweCBwZXIgc2FtcGxlXG4gICAgLy8gbWluWm9vbTogMTAgMDAwIHB4IHBlciAxIGhvdXJcbiAgICAvLyB3aXRoIGEgZGVmYXVsdCB0byA0NC4xa0h6IHNhbXBsZSByYXRlXG4gICAgdGhpcy5tYXhab29tID0gNDQxMDAgKiAxIC8gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC5waXhlbHNQZXJTZWNvbmQ7XG4gICAgdGhpcy5taW5ab29tID0gMTAwMDAgLyAzNjAwIC8gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC5waXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMuaW5pdGlhbFpvb20gPSB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0Lnpvb207XG4gICAgdGhpcy5pbml0aWFsWSA9IGUueTtcblxuICAgIHRoaXMuX3BpeGVsVG9FeHBvbmVudCA9IHNjYWxlcy5saW5lYXIoKVxuICAgICAgLmRvbWFpbihbMCwgMTAwXSkgLy8gMTAwcHggPT4gZmFjdG9yIDJcbiAgICAgIC5yYW5nZShbMCwgMV0pO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZSkge1xuICAgIC8vIHByZXZlbnQgYW5ub3lpbmcgdGV4dCBzZWxlY3Rpb24gd2hlbiBkcmFnZ2luZ1xuICAgIGUub3JpZ2luYWxFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3QgdGltZUNvbnRleHQgPSB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IGxhc3RDZW50ZXJUaW1lID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KGUueCk7XG4gICAgY29uc3QgZXhwb25lbnQgPSB0aGlzLl9waXhlbFRvRXhwb25lbnQoZS55IC0gdGhpcy5pbml0aWFsWSk7XG4gICAgY29uc3QgdGFyZ2V0Wm9vbSA9IHRoaXMuaW5pdGlhbFpvb20gKiBNYXRoLnBvdygyLCBleHBvbmVudCk7IC8vIC0xLi4uMSAtPiAxLzIuLi4yXG5cbiAgICB0aW1lQ29udGV4dC56b29tID0gTWF0aC5taW4oTWF0aC5tYXgodGFyZ2V0Wm9vbSwgdGhpcy5taW5ab29tKSwgdGhpcy5tYXhab29tKTtcblxuICAgIGNvbnN0IG5ld0NlbnRlclRpbWUgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoZS54KTtcbiAgICBjb25zdCBkZWx0YSA9IG5ld0NlbnRlclRpbWUgLSBsYXN0Q2VudGVyVGltZTtcblxuICAgIC8vIEFwcGx5IG5ldyBvZmZzZXQgdG8ga2VlcCBpdCBjZW50ZXJlZCB0byB0aGUgbW91c2VcbiAgICB0aW1lQ29udGV4dC5vZmZzZXQgKz0gKGRlbHRhICsgdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KGUuZHgpKTtcblxuICAgIC8vIE90aGVyIHBvc3NpYmxlIGV4cGVyaW1lbnRzIHdpdGggY2VudGVyZWQtem9vbS1zdGF0ZVxuICAgIC8vXG4gICAgLy8gRXhhbXBsZSAxOiBQcmV2ZW50IHRpbWVsaW5lLm9mZnNldCB0byBiZSBuZWdhdGl2ZVxuICAgIC8vIHRpbWVDb250ZXh0Lm9mZnNldCA9IE1hdGgubWluKHRpbWVDb250ZXh0Lm9mZnNldCwgMCk7XG4gICAgLy9cbiAgICAvLyBFeGFtcGxlIDI6IEtlZXAgaW4gY29udGFpbmVyIHdoZW4gem9vbWVkIG91dFxuICAgIC8vIGlmICh0aW1lQ29udGV4dC5zdHJldGNoUmF0aW8gPCAxKcKge1xuICAgIC8vICAgY29uc3QgbWluT2Zmc2V0ID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KDApO1xuICAgIC8vICAgY29uc3QgbWF4T2Zmc2V0ID0gdGltZUNvbnRleHQudGltZVRvUGl4ZWwuaW52ZXJ0KHZpZXcud2lkdGggLSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbCh0aW1lQ29udGV4dC5kdXJhdGlvbikpO1xuICAgIC8vICAgdGltZUNvbnRleHQub2Zmc2V0ID0gTWF0aC5tYXgodGltZUNvbnRleHQub2Zmc2V0LCBtaW5PZmZzZXQpO1xuICAgIC8vICAgdGltZUNvbnRleHQub2Zmc2V0ID0gTWF0aC5taW4odGltZUNvbnRleHQub2Zmc2V0LCBtYXhPZmZzZXQpO1xuICAgIC8vIH1cblxuICAgIHRoaXMudGltZWxpbmUudHJhY2tzLnVwZGF0ZSgpO1xuICB9XG5cbiAgb25Nb3VzZVVwKGUpIHt9XG59XG4iXX0=