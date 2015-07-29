'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _eventSource = require('./event-source');

var _eventSource2 = _interopRequireDefault(_eventSource);

var _waveEvent = require('./wave-event');

var _waveEvent2 = _interopRequireDefault(_waveEvent);

var body = window.document.body;

/**
 * `Surface` normalizes mouse user interactions with the timeline upon the DOM container element of `Track` instances.
 * As soon as a `track` is added to a `timeline`, its attached `Surface` instance will emit the mouse events.
 */

var Surface = (function (_EventSource) {
  _inherits(Surface, _EventSource);

  /**
   * @param {DOMElement} el - the DOM element to monitor
   */

  function Surface(el /*, padding of the current surface @TODO */) {
    _classCallCheck(this, Surface);

    _get(Object.getPrototypeOf(Surface.prototype), 'constructor', this).call(this, el);

    // this.isMouseDown = false;
    this.mouseDownEvent = null;
    this.lastEvent = null;
  }

  /**
   * Factory method for `Event` class
   */

  _createClass(Surface, [{
    key: '_createEvent',
    value: function _createEvent(type, e) {
      var event = new _waveEvent2['default'](type, e);

      var pos = this._getRelativePosition(e);
      event.x = pos.x;
      event.y = pos.y;
      this.dx = null;
      this.dy = null;
      this.area = null; // @TODO rename

      return event;
    }

    /**
     * @param {Event} e - raw event from listener
     * @return {Object} The x, y coordinates coordinates relative to the surface element
     */
  }, {
    key: '_getRelativePosition',
    value: function _getRelativePosition(e) {
      // @TODO: should be able to ignore padding
      var x = 0;
      var y = 0;
      var clientRect = this.el.getBoundingClientRect();
      var scrollLeft = body.scrollLeft + document.documentElement.scrollLeft;
      var scrollTop = body.scrollTop + document.documentElement.scrollTop;

      // Adapted from http://www.quirksmode.org/js/events_properties.html#position
      if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
      } else if (e.clientX || e.clientY) {
        // Normalize to pageX, pageY
        x = e.clientX + scrollLeft;
        y = e.clientY + scrollTop;
      }

      // clientRect refers to the client, not to the page
      x = x - (clientRect.left + scrollLeft);
      y = y - (clientRect.top + scrollTop);

      // Should handle padding

      return { x: x, y: y };
    }
  }, {
    key: '_defineArea',
    value: function _defineArea(e, mouseDownEvent, lastEvent) {
      if (!mouseDownEvent || !lastEvent) {
        return;
      }
      e.dx = e.x - lastEvent.x;
      e.dy = e.y - lastEvent.y;

      var left = mouseDownEvent.x < e.x ? mouseDownEvent.x : e.x;
      var top = mouseDownEvent.y < e.y ? mouseDownEvent.y : e.y;
      var width = Math.abs(Math.round(e.x - mouseDownEvent.x));
      var height = Math.abs(Math.round(e.y - mouseDownEvent.y));

      e.area = { left: left, top: top, width: width, height: height };
    }

    /**
     * Keep this private to avoid double event binding
     * Main logic of the surface is here
     * Should be extended with needed events (mouseenter, mouseleave, wheel ...)
     */
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this = this;

      var onMouseDown = function onMouseDown(e) {
        // By removing the previous selection we prevent bypassing the mousemove events coming from SVG in Firefox.
        window.getSelection().removeAllRanges();
        var event = _this._createEvent('mousedown', e);

        _this.isMouseDown = true;
        _this.mouseDownEvent = event;
        _this.lastEvent = event;
        // Register mousemove and mouseup listeners on window
        window.addEventListener('mousemove', onMouseMove, false);
        window.addEventListener('mouseup', onMouseUp, false);

        _this.emit('event', event);
      };

      var onMouseMove = function onMouseMove(e) {
        var event = _this._createEvent('mousemove', e);
        _this._defineArea(event, _this.mouseDownEvent, _this.lastEvent);
        // Update `lastEvent` for next call
        _this.lastEvent = event;

        _this.emit('event', event);
      };

      var onMouseUp = function onMouseUp(e) {
        var event = _this._createEvent('mouseup', e);
        _this._defineArea(event, _this.mouseDownEvent, _this.lastEvent);

        _this.isMouseDown = false;
        _this.mouseDownEvent = null;
        _this.lastEvent = null;
        // Remove mousemove and mouseup listeners on window
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);

        _this.emit('event', event);
      };

      var onClick = function onClick(e) {
        var event = _this._createEvent('click', e);
        _this.emit('event', event);
      };

      var onDblClick = function onDblClick(e) {
        var event = _this._createEvent('dblclick', e);
        _this.emit('event', event);
      };

      // Bind callbacks
      this.el.addEventListener('mousedown', onMouseDown, false);
      this.el.addEventListener('click', onClick, false);
      this.el.addEventListener('dblclick', onDblClick, false);
    }
  }]);

  return Surface;
})(_eventSource2['default']);

exports['default'] = Surface;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9pbnRlcmFjdGlvbnMvc3VyZmFjZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzJCQUF3QixnQkFBZ0I7Ozs7eUJBQ2xCLGNBQWM7Ozs7QUFHcEMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7Ozs7Ozs7SUFNYixPQUFPO1lBQVAsT0FBTzs7Ozs7O0FBSWYsV0FKUSxPQUFPLENBSWQsRUFBRSw4Q0FBOEM7MEJBSnpDLE9BQU87O0FBS3hCLCtCQUxpQixPQUFPLDZDQUtsQixFQUFFLEVBQUU7OztBQUdWLFFBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBQzNCLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0dBQ3ZCOzs7Ozs7ZUFWa0IsT0FBTzs7V0FlZCxzQkFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFO0FBQ3BCLFVBQU0sS0FBSyxHQUFHLDJCQUFjLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFckMsVUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLFdBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNoQixXQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDaEIsVUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDZixVQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQztBQUNmLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVqQixhQUFPLEtBQUssQ0FBQztLQUNkOzs7Ozs7OztXQU1tQiw4QkFBQyxDQUFDLEVBQUU7O0FBRXRCLFVBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLFVBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQXFCLEVBQUUsQ0FBQztB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QztPQUMzQixDQUFDOztBQUVGLFVBQU0sVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFJLENBQUMsRUFBSztBQUN4QixZQUFJLEtBQUssR0FBRyxNQUFLLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0MsY0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQzNCLENBQUM7OztBQUdGLFVBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxRCxVQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbEQsVUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3pEOzs7U0FsSWtCLE9BQU87OztxQkFBUCxPQUFPIiwiZmlsZSI6ImVzNi9pbnRlcmFjdGlvbnMvc3VyZmFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFdmVudFNvdXJjZSBmcm9tICcuL2V2ZW50LXNvdXJjZSc7XG5pbXBvcnQgV2F2ZUV2ZW50IGZyb20gJy4vd2F2ZS1ldmVudCc7XG5cblxuY29uc3QgYm9keSA9IHdpbmRvdy5kb2N1bWVudC5ib2R5O1xuXG4vKipcbiAqIGBTdXJmYWNlYCBub3JtYWxpemVzIG1vdXNlIHVzZXIgaW50ZXJhY3Rpb25zIHdpdGggdGhlIHRpbWVsaW5lIHVwb24gdGhlIERPTSBjb250YWluZXIgZWxlbWVudCBvZiBgVHJhY2tgIGluc3RhbmNlcy5cbiAqIEFzIHNvb24gYXMgYSBgdHJhY2tgIGlzIGFkZGVkIHRvIGEgYHRpbWVsaW5lYCwgaXRzIGF0dGFjaGVkIGBTdXJmYWNlYCBpbnN0YW5jZSB3aWxsIGVtaXQgdGhlIG1vdXNlIGV2ZW50cy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3VyZmFjZSBleHRlbmRzIEV2ZW50U291cmNlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gZWwgLSB0aGUgRE9NIGVsZW1lbnQgdG8gbW9uaXRvclxuICAgKi9cbiAgY29uc3RydWN0b3IoZWwgLyosIHBhZGRpbmcgb2YgdGhlIGN1cnJlbnQgc3VyZmFjZSBAVE9ETyAqLykge1xuICAgIHN1cGVyKGVsKTtcblxuICAgIC8vIHRoaXMuaXNNb3VzZURvd24gPSBmYWxzZTtcbiAgICB0aGlzLm1vdXNlRG93bkV2ZW50ID0gbnVsbDtcbiAgICB0aGlzLmxhc3RFdmVudCA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogRmFjdG9yeSBtZXRob2QgZm9yIGBFdmVudGAgY2xhc3NcbiAgICovXG4gIF9jcmVhdGVFdmVudCh0eXBlLCBlKSB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgV2F2ZUV2ZW50KHR5cGUsIGUpO1xuXG4gICAgY29uc3QgcG9zID0gdGhpcy5fZ2V0UmVsYXRpdmVQb3NpdGlvbihlKTtcbiAgICBldmVudC54ID0gcG9zLng7XG4gICAgZXZlbnQueSA9IHBvcy55O1xuICAgIHRoaXMuZHggPSBudWxsO1xuICAgIHRoaXMuZHkgPSBudWxsO1xuICAgIHRoaXMuYXJlYSA9IG51bGw7IC8vIEBUT0RPIHJlbmFtZVxuXG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGUgLSByYXcgZXZlbnQgZnJvbSBsaXN0ZW5lclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB4LCB5IGNvb3JkaW5hdGVzIGNvb3JkaW5hdGVzIHJlbGF0aXZlIHRvIHRoZSBzdXJmYWNlIGVsZW1lbnRcbiAgICovXG4gIF9nZXRSZWxhdGl2ZVBvc2l0aW9uKGUpIHtcbiAgICAvLyBAVE9ETzogc2hvdWxkIGJlIGFibGUgdG8gaWdub3JlIHBhZGRpbmdcbiAgICBsZXQgeCA9IDA7XG4gICAgbGV0IHkgPSAwO1xuICAgIGNvbnN0IGNsaWVudFJlY3QgPSB0aGlzLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHNjcm9sbExlZnQgPSBib2R5LnNjcm9sbExlZnQgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdDtcbiAgICBjb25zdCBzY3JvbGxUb3AgID0gYm9keS5zY3JvbGxUb3AgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuXG4gICAgLy8gQWRhcHRlZCBmcm9tIGh0dHA6Ly93d3cucXVpcmtzbW9kZS5vcmcvanMvZXZlbnRzX3Byb3BlcnRpZXMuaHRtbCNwb3NpdGlvblxuICAgIGlmIChlLnBhZ2VYIHx8IGUucGFnZVkpIHtcbiAgICAgIHggPSBlLnBhZ2VYO1xuICAgICAgeSA9IGUucGFnZVk7XG4gICAgfSBlbHNlIGlmIChlLmNsaWVudFggfHwgZS5jbGllbnRZKSB7XG4gICAgICAvLyBOb3JtYWxpemUgdG8gcGFnZVgsIHBhZ2VZXG4gICAgICB4ID0gZS5jbGllbnRYICsgc2Nyb2xsTGVmdDtcbiAgICAgIHkgPSBlLmNsaWVudFkgKyBzY3JvbGxUb3A7XG4gICAgfVxuXG4gICAgLy8gY2xpZW50UmVjdCByZWZlcnMgdG8gdGhlIGNsaWVudCwgbm90IHRvIHRoZSBwYWdlXG4gICAgeCA9IHggLSAoY2xpZW50UmVjdC5sZWZ0ICsgc2Nyb2xsTGVmdCk7XG4gICAgeSA9IHkgLSAoY2xpZW50UmVjdC50b3AgICsgc2Nyb2xsVG9wICk7XG5cbiAgICAvLyBTaG91bGQgaGFuZGxlIHBhZGRpbmdcblxuICAgIHJldHVybiB7IHgsIHkgfTtcbiAgfVxuXG4gIF9kZWZpbmVBcmVhKGUsIG1vdXNlRG93bkV2ZW50LCBsYXN0RXZlbnQpIHtcbiAgICBpZiAoIW1vdXNlRG93bkV2ZW50IHx8wqAhbGFzdEV2ZW50KSB7IHJldHVybjsgfVxuICAgIGUuZHggPSBlLnggLSBsYXN0RXZlbnQueDtcbiAgICBlLmR5ID0gZS55IC0gbGFzdEV2ZW50Lnk7XG5cbiAgICBjb25zdCBsZWZ0ID0gbW91c2VEb3duRXZlbnQueCA8IGUueCA/IG1vdXNlRG93bkV2ZW50LnggOiBlLng7XG4gICAgY29uc3QgdG9wICA9IG1vdXNlRG93bkV2ZW50LnkgPCBlLnkgPyBtb3VzZURvd25FdmVudC55IDogZS55O1xuICAgIGNvbnN0IHdpZHRoICA9IE1hdGguYWJzKE1hdGgucm91bmQoZS54IC0gbW91c2VEb3duRXZlbnQueCkpO1xuICAgIGNvbnN0IGhlaWdodCA9IE1hdGguYWJzKE1hdGgucm91bmQoZS55IC0gbW91c2VEb3duRXZlbnQueSkpO1xuXG4gICAgZS5hcmVhID0geyBsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHQgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBLZWVwIHRoaXMgcHJpdmF0ZSB0byBhdm9pZCBkb3VibGUgZXZlbnQgYmluZGluZ1xuICAgKiBNYWluIGxvZ2ljIG9mIHRoZSBzdXJmYWNlIGlzIGhlcmVcbiAgICogU2hvdWxkIGJlIGV4dGVuZGVkIHdpdGggbmVlZGVkIGV2ZW50cyAobW91c2VlbnRlciwgbW91c2VsZWF2ZSwgd2hlZWwgLi4uKVxuICAgKi9cbiAgX2JpbmRFdmVudHMoKSB7XG4gICAgY29uc3Qgb25Nb3VzZURvd24gPSAoZSkgPT4ge1xuICAgICAgLy8gQnkgcmVtb3ZpbmcgdGhlIHByZXZpb3VzIHNlbGVjdGlvbiB3ZSBwcmV2ZW50IGJ5cGFzc2luZyB0aGUgbW91c2Vtb3ZlIGV2ZW50cyBjb21pbmcgZnJvbSBTVkcgaW4gRmlyZWZveC5cbiAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5fY3JlYXRlRXZlbnQoJ21vdXNlZG93bicsIGUpO1xuXG4gICAgICB0aGlzLmlzTW91c2VEb3duID0gdHJ1ZTtcbiAgICAgIHRoaXMubW91c2VEb3duRXZlbnQgPSBldmVudDtcbiAgICAgIHRoaXMubGFzdEV2ZW50ID0gZXZlbnQ7XG4gICAgICAvLyBSZWdpc3RlciBtb3VzZW1vdmUgYW5kIG1vdXNldXAgbGlzdGVuZXJzIG9uIHdpbmRvd1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlLCBmYWxzZSk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCwgZmFsc2UpO1xuXG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH07XG5cbiAgICBjb25zdCBvbk1vdXNlTW92ZSA9IChlKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnbW91c2Vtb3ZlJywgZSk7XG4gICAgICB0aGlzLl9kZWZpbmVBcmVhKGV2ZW50LCB0aGlzLm1vdXNlRG93bkV2ZW50LCB0aGlzLmxhc3RFdmVudCk7XG4gICAgICAvLyBVcGRhdGUgYGxhc3RFdmVudGAgZm9yIG5leHQgY2FsbFxuICAgICAgdGhpcy5sYXN0RXZlbnQgPSBldmVudDtcblxuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25Nb3VzZVVwID0gKGUpID0+IHtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdtb3VzZXVwJywgZSk7XG4gICAgICB0aGlzLl9kZWZpbmVBcmVhKGV2ZW50LCB0aGlzLm1vdXNlRG93bkV2ZW50LCB0aGlzLmxhc3RFdmVudCk7XG5cbiAgICAgIHRoaXMuaXNNb3VzZURvd24gPSBmYWxzZTtcbiAgICAgIHRoaXMubW91c2VEb3duRXZlbnQgPSBudWxsO1xuICAgICAgdGhpcy5sYXN0RXZlbnQgPSBudWxsO1xuICAgICAgLy8gUmVtb3ZlIG1vdXNlbW92ZSBhbmQgbW91c2V1cCBsaXN0ZW5lcnMgb24gd2luZG93XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXApO1xuXG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH07XG5cbiAgICBjb25zdCBvbkNsaWNrID0gKGUpID0+IHtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdjbGljaycsIGUpO1xuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25EYmxDbGljayA9IChlKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnZGJsY2xpY2snLCBlKTtcbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfTtcblxuICAgIC8vIEJpbmQgY2FsbGJhY2tzXG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbk1vdXNlRG93biwgZmFsc2UpO1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrLCBmYWxzZSk7XG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIG9uRGJsQ2xpY2ssIGZhbHNlKTtcbiAgfVxufVxuIl19