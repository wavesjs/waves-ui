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

/**
 * `CenteredZoomState` is a timeline state that allows the user to browse the timeline by clicking on a track, and then
 * - moving down to zoom in
 * - moving up to zoom out
 * - moving left to move in time, after
 * - moving right to move in time, before
 */

var _baseState2 = _interopRequireDefault(_baseState);

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
      this.mouseDown = true; // is done in surface

      var actualZoom = this.timeline.timeContext.zoom;
      var initialY = e.y;

      // @NOTE : weird problem -> unzoom a lot faster than zoom...
      this.valueToPixel = _utilsScales2['default'].linear().domain([initialY, initialY + 200]).range([actualZoom, actualZoom * 2]);
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      if (!this.mouseDown) {
        return;
      }

      var timeContext = this.timeline.timeContext;
      var lastCenterTime = timeContext.timeToPixel.invert(e.x); // ?
      var y = this.valueToPixel(e.y);

      timeContext.zoom = Math.min(Math.max(y, this.minZoom), this.maxZoom);

      var newCenterTime = timeContext.timeToPixel.invert(e.x); // ?
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
    value: function onMouseUp(e) {
      this.mouseDown = false;
    }
  }]);

  return CenteredZoomState;
})(_baseState2['default']);

exports['default'] = CenteredZoomState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zdGF0ZXMvY2VudGVyZWQtem9vbS1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzJCQUFtQixpQkFBaUI7Ozs7eUJBQ2QsY0FBYzs7Ozs7Ozs7Ozs7O0lBVWYsaUJBQWlCO1lBQWpCLGlCQUFpQjs7QUFDekIsV0FEUSxpQkFBaUIsQ0FDeEIsUUFBUSxFQUFFOzBCQURILGlCQUFpQjs7QUFFbEMsK0JBRmlCLGlCQUFpQiw2Q0FFNUIsUUFBUSxFQUFFO0FBQ2hCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDOzs7OztBQUt6QixRQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDO0FBQ3JFLFFBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUM7R0FDekU7O2VBVmtCLGlCQUFpQjs7V0FZekIscUJBQUMsQ0FBQyxFQUFFO0FBQ2IsY0FBTyxDQUFDLENBQUMsSUFBSTtBQUNYLGFBQUssV0FBVztBQUNkLGNBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsZ0JBQU07QUFBQSxBQUNSLGFBQUssV0FBVztBQUNkLGNBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsZ0JBQU07QUFBQSxBQUNSLGFBQUssU0FBUztBQUNaLGNBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsZ0JBQU07QUFBQSxPQUNUO0tBQ0Y7OztXQUVVLHFCQUFDLENBQUMsRUFBRTtBQUNiLFVBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDOztBQUV0QixVQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7QUFDbEQsVUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O0FBR3JCLFVBQUksQ0FBQyxZQUFZLEdBQUcseUJBQU8sTUFBTSxFQUFFLENBQ2hDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FDbEMsS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3hDOzs7V0FFVSxxQkFBQyxDQUFDLEVBQUU7QUFDYixVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGVBQU87T0FBRTs7QUFFaEMsVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7QUFDOUMsVUFBTSxjQUFjLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNELFVBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVqQyxpQkFBVyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRXJFLFVBQU0sYUFBYSxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRCxVQUFNLEtBQUssR0FBRyxhQUFhLEdBQUcsY0FBYyxDQUFDOzs7QUFHN0MsaUJBQVcsQ0FBQyxNQUFNLElBQUssS0FBSyxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQUFBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUFlckUsVUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDL0I7OztXQUVRLG1CQUFDLENBQUMsRUFBRTtBQUNYLFVBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0tBQ3hCOzs7U0F2RWtCLGlCQUFpQjs7O3FCQUFqQixpQkFBaUIiLCJmaWxlIjoiZXM2L3N0YXRlcy9jZW50ZXJlZC16b29tLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNjYWxlcyBmcm9tICcuLi91dGlscy9zY2FsZXMnO1xuaW1wb3J0IEJhc2VTdGF0ZSBmcm9tICcuL2Jhc2Utc3RhdGUnO1xuXG5cbi8qKlxuICogYENlbnRlcmVkWm9vbVN0YXRlYCBpcyBhIHRpbWVsaW5lIHN0YXRlIHRoYXQgYWxsb3dzIHRoZSB1c2VyIHRvIGJyb3dzZSB0aGUgdGltZWxpbmUgYnkgY2xpY2tpbmcgb24gYSB0cmFjaywgYW5kIHRoZW5cbiAqIC0gbW92aW5nIGRvd24gdG8gem9vbSBpblxuICogLSBtb3ZpbmcgdXAgdG8gem9vbSBvdXRcbiAqIC0gbW92aW5nIGxlZnQgdG8gbW92ZSBpbiB0aW1lLCBhZnRlclxuICogLSBtb3ZpbmcgcmlnaHQgdG8gbW92ZSBpbiB0aW1lLCBiZWZvcmVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2VudGVyZWRab29tU3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcbiAgICB0aGlzLmN1cnJlbnRMYXllciA9IG51bGw7XG4gICAgLy8gU2V0IG1heC9taW4gem9vbVxuICAgIC8vIG1heFpvb206IDFweCBwZXIgc2FtcGxlXG4gICAgLy8gbWluWm9vbTogMTAgMDAwIHB4IHBlciAxIGhvdXJcbiAgICAvLyB3aXRoIGEgZGVmYXVsdCB0byA0NC4xa0h6IHNhbXBsZSByYXRlXG4gICAgdGhpcy5tYXhab29tID0gNDQxMDAgKiAxIC8gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC5waXhlbHNQZXJTZWNvbmQ7XG4gICAgdGhpcy5taW5ab29tID0gMTAwMDAgLyAzNjAwIC8gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC5waXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoKGUudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxuICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxuICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZSkge1xuICAgIHRoaXMubW91c2VEb3duID0gdHJ1ZTsgLy8gaXMgZG9uZSBpbiBzdXJmYWNlXG5cbiAgICBjb25zdCBhY3R1YWxab29tID0gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dC56b29tO1xuICAgIGNvbnN0IGluaXRpYWxZID0gZS55O1xuXG4gICAgLy8gQE5PVEUgOiB3ZWlyZCBwcm9ibGVtIC0+IHVuem9vbSBhIGxvdCBmYXN0ZXIgdGhhbiB6b29tLi4uXG4gICAgdGhpcy52YWx1ZVRvUGl4ZWwgPSBzY2FsZXMubGluZWFyKClcbiAgICAgIC5kb21haW4oW2luaXRpYWxZLCBpbml0aWFsWSArIDIwMF0pXG4gICAgICAucmFuZ2UoW2FjdHVhbFpvb20sIGFjdHVhbFpvb20gKiAyXSk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShlKSB7XG4gICAgaWYgKCF0aGlzLm1vdXNlRG93bikgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gdGhpcy50aW1lbGluZS50aW1lQ29udGV4dDtcbiAgICBjb25zdCBsYXN0Q2VudGVyVGltZSA9IHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsLmludmVydChlLngpOyAvLyA/XG4gICAgY29uc3QgeSA9IHRoaXMudmFsdWVUb1BpeGVsKGUueSk7XG5cbiAgICB0aW1lQ29udGV4dC56b29tID0gTWF0aC5taW4oTWF0aC5tYXgoeSwgdGhpcy5taW5ab29tKSwgdGhpcy5tYXhab29tKTtcblxuICAgIGNvbnN0IG5ld0NlbnRlclRpbWUgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoZS54KTsgLy8gP1xuICAgIGNvbnN0IGRlbHRhID0gbmV3Q2VudGVyVGltZSAtIGxhc3RDZW50ZXJUaW1lO1xuXG4gICAgLy8gQXBwbHkgbmV3IG9mZnNldCB0byBrZWVwIGl0IGNlbnRlcmVkIHRvIHRoZSBtb3VzZVxuICAgIHRpbWVDb250ZXh0Lm9mZnNldCArPSAoZGVsdGEgKyB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoZS5keCkpO1xuXG4gICAgLy8gT3RoZXIgcG9zc2libGUgZXhwZXJpbWVudHMgd2l0aCBjZW50ZXJlZC16b29tLXN0YXRlXG4gICAgLy9cbiAgICAvLyBFeGFtcGxlIDE6IFByZXZlbnQgdGltZWxpbmUub2Zmc2V0IHRvIGJlIG5lZ2F0aXZlXG4gICAgLy8gdGltZUNvbnRleHQub2Zmc2V0ID0gTWF0aC5taW4odGltZUNvbnRleHQub2Zmc2V0LCAwKTtcbiAgICAvL1xuICAgIC8vIEV4YW1wbGUgMjogS2VlcCBpbiBjb250YWluZXIgd2hlbiB6b29tZWQgb3V0XG4gICAgLy8gaWYgKHRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbyA8IDEpwqB7XG4gICAgLy8gICBjb25zdCBtaW5PZmZzZXQgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQoMCk7XG4gICAgLy8gICBjb25zdCBtYXhPZmZzZXQgPSB0aW1lQ29udGV4dC50aW1lVG9QaXhlbC5pbnZlcnQodmlldy53aWR0aCAtIHRpbWVDb250ZXh0LnRpbWVUb1BpeGVsKHRpbWVDb250ZXh0LmR1cmF0aW9uKSk7XG4gICAgLy8gICB0aW1lQ29udGV4dC5vZmZzZXQgPSBNYXRoLm1heCh0aW1lQ29udGV4dC5vZmZzZXQsIG1pbk9mZnNldCk7XG4gICAgLy8gICB0aW1lQ29udGV4dC5vZmZzZXQgPSBNYXRoLm1pbih0aW1lQ29udGV4dC5vZmZzZXQsIG1heE9mZnNldCk7XG4gICAgLy8gfVxuXG4gICAgdGhpcy50aW1lbGluZS50cmFja3MudXBkYXRlKCk7XG4gIH1cblxuICBvbk1vdXNlVXAoZSkge1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gIH1cbn1cbiJdfQ==