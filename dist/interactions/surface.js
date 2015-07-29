'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
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

  _inherits(Surface, _EventSource);

  _createClass(Surface, [{
    key: '_createEvent',

    /**
     * Factory method for `Event` class
     */
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
  }, {
    key: '_getRelativePosition',

    /**
     * @param {Event} e - raw event from listener
     * @return {Object} The x, y coordinates coordinates relative to the surface element
     */
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
  }, {
    key: '_bindEvents',

    /**
     * Keep this private to avoid double event binding
     * Main logic of the surface is here
     * Should be extended with needed events (mouseenter, mouseleave, wheel ...)
     */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OzJCQUF3QixnQkFBZ0I7Ozs7eUJBQ2xCLGNBQWM7Ozs7QUFHcEMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7Ozs7Ozs7SUFNYixPQUFPOzs7OztBQUlmLFdBSlEsT0FBTyxDQUlkLEVBQUUsOENBQThDOzBCQUp6QyxPQUFPOztBQUt4QiwrQkFMaUIsT0FBTyw2Q0FLbEIsRUFBRSxFQUFFOzs7QUFHVixRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztBQUMzQixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztHQUN2Qjs7WUFWa0IsT0FBTzs7ZUFBUCxPQUFPOzs7Ozs7V0FlZCxzQkFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFO0FBQ3BCLFVBQU0sS0FBSyxHQUFHLDJCQUFjLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFckMsVUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLFdBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNoQixXQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDaEIsVUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDZixVQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQztBQUNmLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVqQixhQUFPLEtBQUssQ0FBQztLQUNkOzs7Ozs7OztXQU1tQiw4QkFBQyxDQUFDLEVBQUU7O0FBRXRCLFVBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLFVBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQXFCLEVBQUUsQ0FB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Q0FBQztPQUMzQixDQUFDOztBQUVGLFVBQU0sVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFJLENBQUMsRUFBSztBQUN4QixZQUFJLEtBQUssR0FBRyxNQUFLLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0MsY0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQzNCLENBQUM7OztBQUdGLFVBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxRCxVQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbEQsVUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3pEOzs7U0FsSWtCLE9BQU87OztxQkFBUCxPQUFPIiwiZmlsZSI6ImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXZlbnRTb3VyY2UgZnJvbSAnLi9ldmVudC1zb3VyY2UnO1xuaW1wb3J0IFdhdmVFdmVudCBmcm9tICcuL3dhdmUtZXZlbnQnO1xuXG5cbmNvbnN0IGJvZHkgPSB3aW5kb3cuZG9jdW1lbnQuYm9keTtcblxuLyoqXG4gKiBgU3VyZmFjZWAgbm9ybWFsaXplcyBtb3VzZSB1c2VyIGludGVyYWN0aW9ucyB3aXRoIHRoZSB0aW1lbGluZSB1cG9uIHRoZSBET00gY29udGFpbmVyIGVsZW1lbnQgb2YgYFRyYWNrYCBpbnN0YW5jZXMuXG4gKiBBcyBzb29uIGFzIGEgYHRyYWNrYCBpcyBhZGRlZCB0byBhIGB0aW1lbGluZWAsIGl0cyBhdHRhY2hlZCBgU3VyZmFjZWAgaW5zdGFuY2Ugd2lsbCBlbWl0IHRoZSBtb3VzZSBldmVudHMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN1cmZhY2UgZXh0ZW5kcyBFdmVudFNvdXJjZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IGVsIC0gdGhlIERPTSBlbGVtZW50IHRvIG1vbml0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsIC8qLCBwYWRkaW5nIG9mIHRoZSBjdXJyZW50IHN1cmZhY2UgQFRPRE8gKi8pIHtcbiAgICBzdXBlcihlbCk7XG5cbiAgICAvLyB0aGlzLmlzTW91c2VEb3duID0gZmFsc2U7XG4gICAgdGhpcy5tb3VzZURvd25FdmVudCA9IG51bGw7XG4gICAgdGhpcy5sYXN0RXZlbnQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEZhY3RvcnkgbWV0aG9kIGZvciBgRXZlbnRgIGNsYXNzXG4gICAqL1xuICBfY3JlYXRlRXZlbnQodHlwZSwgZSkge1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IFdhdmVFdmVudCh0eXBlLCBlKTtcblxuICAgIGNvbnN0IHBvcyA9IHRoaXMuX2dldFJlbGF0aXZlUG9zaXRpb24oZSk7XG4gICAgZXZlbnQueCA9IHBvcy54O1xuICAgIGV2ZW50LnkgPSBwb3MueTtcbiAgICB0aGlzLmR4ID0gbnVsbDtcbiAgICB0aGlzLmR5ID0gbnVsbDtcbiAgICB0aGlzLmFyZWEgPSBudWxsOyAvLyBAVE9ETyByZW5hbWVcblxuICAgIHJldHVybiBldmVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBlIC0gcmF3IGV2ZW50IGZyb20gbGlzdGVuZXJcbiAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgeCwgeSBjb29yZGluYXRlcyBjb29yZGluYXRlcyByZWxhdGl2ZSB0byB0aGUgc3VyZmFjZSBlbGVtZW50XG4gICAqL1xuICBfZ2V0UmVsYXRpdmVQb3NpdGlvbihlKSB7XG4gICAgLy8gQFRPRE86IHNob3VsZCBiZSBhYmxlIHRvIGlnbm9yZSBwYWRkaW5nXG4gICAgbGV0IHggPSAwO1xuICAgIGxldCB5ID0gMDtcbiAgICBjb25zdCBjbGllbnRSZWN0ID0gdGhpcy5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBzY3JvbGxMZWZ0ID0gYm9keS5zY3JvbGxMZWZ0ICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ7XG4gICAgY29uc3Qgc2Nyb2xsVG9wICA9IGJvZHkuc2Nyb2xsVG9wICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcblxuICAgIC8vIEFkYXB0ZWQgZnJvbSBodHRwOi8vd3d3LnF1aXJrc21vZGUub3JnL2pzL2V2ZW50c19wcm9wZXJ0aWVzLmh0bWwjcG9zaXRpb25cbiAgICBpZiAoZS5wYWdlWCB8fCBlLnBhZ2VZKSB7XG4gICAgICB4ID0gZS5wYWdlWDtcbiAgICAgIHkgPSBlLnBhZ2VZO1xuICAgIH0gZWxzZSBpZiAoZS5jbGllbnRYIHx8IGUuY2xpZW50WSkge1xuICAgICAgLy8gTm9ybWFsaXplIHRvIHBhZ2VYLCBwYWdlWVxuICAgICAgeCA9IGUuY2xpZW50WCArIHNjcm9sbExlZnQ7XG4gICAgICB5ID0gZS5jbGllbnRZICsgc2Nyb2xsVG9wO1xuICAgIH1cblxuICAgIC8vIGNsaWVudFJlY3QgcmVmZXJzIHRvIHRoZSBjbGllbnQsIG5vdCB0byB0aGUgcGFnZVxuICAgIHggPSB4IC0gKGNsaWVudFJlY3QubGVmdCArIHNjcm9sbExlZnQpO1xuICAgIHkgPSB5IC0gKGNsaWVudFJlY3QudG9wICArIHNjcm9sbFRvcCApO1xuXG4gICAgLy8gU2hvdWxkIGhhbmRsZSBwYWRkaW5nXG5cbiAgICByZXR1cm4geyB4LCB5IH07XG4gIH1cblxuICBfZGVmaW5lQXJlYShlLCBtb3VzZURvd25FdmVudCwgbGFzdEV2ZW50KSB7XG4gICAgaWYgKCFtb3VzZURvd25FdmVudCB8fMKgIWxhc3RFdmVudCkgeyByZXR1cm47IH1cbiAgICBlLmR4ID0gZS54IC0gbGFzdEV2ZW50Lng7XG4gICAgZS5keSA9IGUueSAtIGxhc3RFdmVudC55O1xuXG4gICAgY29uc3QgbGVmdCA9IG1vdXNlRG93bkV2ZW50LnggPCBlLnggPyBtb3VzZURvd25FdmVudC54IDogZS54O1xuICAgIGNvbnN0IHRvcCAgPSBtb3VzZURvd25FdmVudC55IDwgZS55ID8gbW91c2VEb3duRXZlbnQueSA6IGUueTtcbiAgICBjb25zdCB3aWR0aCAgPSBNYXRoLmFicyhNYXRoLnJvdW5kKGUueCAtIG1vdXNlRG93bkV2ZW50LngpKTtcbiAgICBjb25zdCBoZWlnaHQgPSBNYXRoLmFicyhNYXRoLnJvdW5kKGUueSAtIG1vdXNlRG93bkV2ZW50LnkpKTtcblxuICAgIGUuYXJlYSA9IHsgbGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0IH07XG4gIH1cblxuICAvKipcbiAgICogS2VlcCB0aGlzIHByaXZhdGUgdG8gYXZvaWQgZG91YmxlIGV2ZW50IGJpbmRpbmdcbiAgICogTWFpbiBsb2dpYyBvZiB0aGUgc3VyZmFjZSBpcyBoZXJlXG4gICAqIFNob3VsZCBiZSBleHRlbmRlZCB3aXRoIG5lZWRlZCBldmVudHMgKG1vdXNlZW50ZXIsIG1vdXNlbGVhdmUsIHdoZWVsIC4uLilcbiAgICovXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIGNvbnN0IG9uTW91c2VEb3duID0gKGUpID0+IHtcbiAgICAgIC8vIEJ5IHJlbW92aW5nIHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gd2UgcHJldmVudCBieXBhc3NpbmcgdGhlIG1vdXNlbW92ZSBldmVudHMgY29taW5nIGZyb20gU1ZHIGluIEZpcmVmb3guXG4gICAgICB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICBjb25zdCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdtb3VzZWRvd24nLCBlKTtcblxuICAgICAgdGhpcy5pc01vdXNlRG93biA9IHRydWU7XG4gICAgICB0aGlzLm1vdXNlRG93bkV2ZW50ID0gZXZlbnQ7XG4gICAgICB0aGlzLmxhc3RFdmVudCA9IGV2ZW50O1xuICAgICAgLy8gUmVnaXN0ZXIgbW91c2Vtb3ZlIGFuZCBtb3VzZXVwIGxpc3RlbmVycyBvbiB3aW5kb3dcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSwgZmFsc2UpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXAsIGZhbHNlKTtcblxuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25Nb3VzZU1vdmUgPSAoZSkgPT4ge1xuICAgICAgbGV0IGV2ZW50ID0gdGhpcy5fY3JlYXRlRXZlbnQoJ21vdXNlbW92ZScsIGUpO1xuICAgICAgdGhpcy5fZGVmaW5lQXJlYShldmVudCwgdGhpcy5tb3VzZURvd25FdmVudCwgdGhpcy5sYXN0RXZlbnQpO1xuICAgICAgLy8gVXBkYXRlIGBsYXN0RXZlbnRgIGZvciBuZXh0IGNhbGxcbiAgICAgIHRoaXMubGFzdEV2ZW50ID0gZXZlbnQ7XG5cbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfTtcblxuICAgIGNvbnN0IG9uTW91c2VVcCA9IChlKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnbW91c2V1cCcsIGUpO1xuICAgICAgdGhpcy5fZGVmaW5lQXJlYShldmVudCwgdGhpcy5tb3VzZURvd25FdmVudCwgdGhpcy5sYXN0RXZlbnQpO1xuXG4gICAgICB0aGlzLmlzTW91c2VEb3duID0gZmFsc2U7XG4gICAgICB0aGlzLm1vdXNlRG93bkV2ZW50ID0gbnVsbDtcbiAgICAgIHRoaXMubGFzdEV2ZW50ID0gbnVsbDtcbiAgICAgIC8vIFJlbW92ZSBtb3VzZW1vdmUgYW5kIG1vdXNldXAgbGlzdGVuZXJzIG9uIHdpbmRvd1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwKTtcblxuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25DbGljayA9IChlKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnY2xpY2snLCBlKTtcbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfTtcblxuICAgIGNvbnN0IG9uRGJsQ2xpY2sgPSAoZSkgPT4ge1xuICAgICAgbGV0IGV2ZW50ID0gdGhpcy5fY3JlYXRlRXZlbnQoJ2RibGNsaWNrJywgZSk7XG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH07XG5cbiAgICAvLyBCaW5kIGNhbGxiYWNrc1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Nb3VzZURvd24sIGZhbHNlKTtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljaywgZmFsc2UpO1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBvbkRibENsaWNrLCBmYWxzZSk7XG4gIH1cbn1cbiJdfQ==