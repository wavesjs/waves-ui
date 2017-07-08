'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _utilsScales = require('../utils/scales');

var _utilsScales2 = _interopRequireDefault(_utilsScales);

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

/**
 * `CenteredZoomState` is a timeline state mimicing the `Live` zoom interaction. It allows the user to browse the timeline by clicking on a track, and then
 * - moving down to zoom in
 * - moving up to zoom out
 * - moving left to move in time, after
 * - moving right to move in time, before
 *
 * [example usage](./examples/states-zoom.html)
 */

var CenteredZoomState = (function (_BaseState) {
  _inherits(CenteredZoomState, _BaseState);

  function CenteredZoomState(timeline) {
    _classCallCheck(this, CenteredZoomState);

    _get(Object.getPrototypeOf(CenteredZoomState.prototype), 'constructor', this).call(this, timeline);
    this.currentLayer = null;
    // Set max/min zoom
    // maxZoom: 1px per sample
    // minZoom: 10 000 px per 1 hour
    // with a default to 44.1kHz sample rate
    this.maxZoom = 44100 * 1 / this.timeline.timeContext.pixelsPerSecond;
    this.minZoom = 10000 / 3600 / this.timeline.timeContext.pixelsPerSecond;
  }

  _createClass(CenteredZoomState, [{
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

      this._pixelToExponent = _utilsScales2['default'].linear().domain([0, 100]) // 100px => factor 2
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
})(_baseState2['default']);

exports['default'] = CenteredZoomState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdGF0ZXMvY2VudGVyZWQtem9vbS1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzJCQUFtQixpQkFBaUI7Ozs7eUJBQ2QsY0FBYzs7Ozs7Ozs7Ozs7Ozs7SUFZZixpQkFBaUI7WUFBakIsaUJBQWlCOztBQUN6QixXQURRLGlCQUFpQixDQUN4QixRQUFRLEVBQUU7MEJBREgsaUJBQWlCOztBQUVsQywrQkFGaUIsaUJBQWlCLDZDQUU1QixRQUFRLEVBQUU7QUFDaEIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7Ozs7O0FBS3pCLFFBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUM7QUFDckUsUUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQztHQUN6RTs7ZUFWa0IsaUJBQWlCOztXQVl6QixxQkFBQyxDQUFDLEVBQUU7QUFDYixjQUFPLENBQUMsQ0FBQyxJQUFJO0FBQ1gsYUFBSyxXQUFXO0FBQ2QsY0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixnQkFBTTtBQUFBLEFBQ1IsYUFBSyxXQUFXO0FBQ2QsY0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixnQkFBTTtBQUFBLEFBQ1IsYUFBSyxTQUFTO0FBQ1osY0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixnQkFBTTtBQUFBLE9BQ1Q7S0FDRjs7O1dBRVUscUJBQUMsQ0FBQyxFQUFFO0FBQ2IsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7QUFDbEQsVUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVwQixVQUFJLENBQUMsZ0JBQWdCLEdBQUcseUJBQU8sTUFBTSxFQUFFLENBQ3BDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztPQUNoQixLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsQjs7O1dBRVUscUJBQUMsQ0FBQyxFQUFFOztBQUViLE9BQUMsQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLENBQUM7O0FBRWpDLFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO0FBQzlDLFVBQU0sY0FBYyxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzRCxVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUQsVUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQzs7QUFFNUQsaUJBQVcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU5RSxVQUFNLGFBQWEsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUQsVUFBTSxLQUFLLEdBQUcsYUFBYSxHQUFHLGNBQWMsQ0FBQzs7O0FBRzdDLGlCQUFXLENBQUMsTUFBTSxJQUFLLEtBQUssR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEFBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FBZXJFLFVBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQy9COzs7V0FFUSxtQkFBQyxDQUFDLEVBQUUsRUFBRTs7O1NBcEVJLGlCQUFpQjs7O3FCQUFqQixpQkFBaUIiLCJmaWxlIjoic3JjL3N0YXRlcy9jZW50ZXJlZC16b29tLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNjYWxlcyBmcm9tICcuLi91dGlscy9zY2FsZXMnO1xuaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuXG5cbi8qKlxuICogYENlbnRlcmVkWm9vbVN0YXRlYCBpcyBhIHRpbWVsaW5lIHN0YXRlIG1pbWljaW5nIHRoZSBgTGl2ZWAgem9vbSBpbnRlcmFjdGlvbi4gSXQgYWxsb3dzIHRoZSB1c2VyIHRvIGJyb3dzZSB0aGUgdGltZWxpbmUgYnkgY2xpY2tpbmcgb24gYSB0cmFjaywgYW5kIHRoZW5cbiAqIC0gbW92aW5nIGRvd24gdG8gem9vbSBpblxuICogLSBtb3ZpbmcgdXAgdG8gem9vbSBvdXRcbiAqIC0gbW92aW5nIGxlZnQgdG8gbW92ZSBpbiB0aW1lLCBhZnRlclxuICogLSBtb3ZpbmcgcmlnaHQgdG8gbW92ZSBpbiB0aW1lLCBiZWZvcmVcbiAqXG4gKiBbZXhhbXBsZSB1c2FnZV0oLi9leGFtcGxlcy9zdGF0ZXMtem9vbS5odG1sKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDZW50ZXJlZFpvb21TdGF0ZSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIodGltZWxpbmUpO1xuICAgIHRoaXMuY3VycmVudExheWVyID0gbnVsbDtcbiAgICAvLyBTZXQgbWF4L21pbiB6b29tXG4gICAgLy8gbWF4Wm9vbTogMXB4IHBlciBzYW1wbGVcbiAgICAvLyBtaW5ab29tOiAxMCAwMDAgcHggcGVyIDEgaG91clxuICAgIC8vIHdpdGggYSBkZWZhdWx0IHRvIDQ0LjFrSHogc2FtcGxlIHJhdGVcbiAgICB0aGlzLm1heFpvb20gPSA0NDEwMCAqIDEgLyB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0LnBpeGVsc1BlclNlY29uZDtcbiAgICB0aGlzLm1pblpvb20gPSAxMDAwMCAvIDM2MDAgLyB0aGlzLnRpbWVsaW5lLnRpbWVDb250ZXh0LnBpeGVsc1BlclNlY29uZDtcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGUpIHtcbiAgICBzd2l0Y2goZS50eXBlKSB7XG4gICAgICBjYXNlICdtb3VzZWRvd24nOlxuICAgICAgICB0aGlzLm9uTW91c2VEb3duKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XG4gICAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICAgIHRoaXMub25Nb3VzZVVwKGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgdGhpcy5pbml0aWFsWm9vbSA9IHRoaXMudGltZWxpbmUudGltZUNvbnRleHQuem9vbTtcbiAgICB0aGlzLmluaXRpYWxZID0gZS55O1xuXG4gICAgdGhpcy5fcGl4ZWxUb0V4cG9uZW50ID0gc2NhbGVzLmxpbmVhcigpXG4gICAgICAuZG9tYWluKFswLCAxMDBdKSAvLyAxMDBweCA9PiBmYWN0b3IgMlxuICAgICAgLnJhbmdlKFswLCAxXSk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgLy8gcHJldmVudCBhbm5veWluZyB0ZXh0IHNlbGVjdGlvbiB3aGVuIGRyYWdnaW5nXG4gICAgZS5vcmlnaW5hbEV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IHRoaXMudGltZWxpbmUudGltZUNvbnRleHQ7XG4gICAgY29uc3QgbGFzdENlbnRlclRpbWUgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoZS54KTtcbiAgICBjb25zdCBleHBvbmVudCA9IHRoaXMuX3BpeGVsVG9FeHBvbmVudChlLnkgLSB0aGlzLmluaXRpYWxZKTtcbiAgICBjb25zdCB0YXJnZXRab29tID0gdGhpcy5pbml0aWFsWm9vbSAqIE1hdGgucG93KDIsIGV4cG9uZW50KTsgLy8gLTEuLi4xIC0+IDEvMi4uLjJcblxuICAgIHRpbWVDb250ZXh0Lnpvb20gPSBNYXRoLm1pbihNYXRoLm1heCh0YXJnZXRab29tLCB0aGlzLm1pblpvb20pLCB0aGlzLm1heFpvb20pO1xuXG4gICAgY29uc3QgbmV3Q2VudGVyVGltZSA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChlLngpO1xuICAgIGNvbnN0IGRlbHRhID0gbmV3Q2VudGVyVGltZSAtIGxhc3RDZW50ZXJUaW1lO1xuXG4gICAgLy8gQXBwbHkgbmV3IG9mZnNldCB0byBrZWVwIGl0IGNlbnRlcmVkIHRvIHRoZSBtb3VzZVxuICAgIHRpbWVDb250ZXh0Lm9mZnNldCArPSAoZGVsdGEgKyB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoZS5keCkpO1xuXG4gICAgLy8gT3RoZXIgcG9zc2libGUgZXhwZXJpbWVudHMgd2l0aCBjZW50ZXJlZC16b29tLXN0YXRlXG4gICAgLy9cbiAgICAvLyBFeGFtcGxlIDE6IFByZXZlbnQgdGltZWxpbmUub2Zmc2V0IHRvIGJlIG5lZ2F0aXZlXG4gICAgLy8gdGltZUNvbnRleHQub2Zmc2V0ID0gTWF0aC5taW4odGltZUNvbnRleHQub2Zmc2V0LCAwKTtcbiAgICAvL1xuICAgIC8vIEV4YW1wbGUgMjogS2VlcCBpbiBjb250YWluZXIgd2hlbiB6b29tZWQgb3V0XG4gICAgLy8gaWYgKHRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbyA8IDEpwqB7XG4gICAgLy8gICBjb25zdCBtaW5PZmZzZXQgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoMCk7XG4gICAgLy8gICBjb25zdCBtYXhPZmZzZXQgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodmlldy53aWR0aCAtIHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRpbWVDb250ZXh0LmR1cmF0aW9uKSk7XG4gICAgLy8gICB0aW1lQ29udGV4dC5vZmZzZXQgPSBNYXRoLm1heCh0aW1lQ29udGV4dC5vZmZzZXQsIG1pbk9mZnNldCk7XG4gICAgLy8gICB0aW1lQ29udGV4dC5vZmZzZXQgPSBNYXRoLm1pbih0aW1lQ29udGV4dC5vZmZzZXQsIG1heE9mZnNldCk7XG4gICAgLy8gfVxuXG4gICAgdGhpcy50aW1lbGluZS50cmFja3MudXBkYXRlKCk7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge31cbn1cbiJdfQ==