"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var EventSource = _interopRequire(require("./event-source"));

var WaveEvent = _interopRequire(require("./wave-event"));

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

    _get(_core.Object.getPrototypeOf(Surface.prototype), "constructor", this).call(this, el);

    // this.isMouseDown = false;
    this.mouseDownEvent = null;
    this.lastEvent = null;
  }

  _inherits(Surface, _EventSource);

  _createClass(Surface, {
    _createEvent: {

      /**
       * Factory method for `Event` class
       */

      value: function _createEvent(type, e) {
        var event = new WaveEvent(type, e);

        var pos = this._getRelativePosition(e);
        event.x = pos.x;
        event.y = pos.y;

        return event;
      }
    },
    _getRelativePosition: {

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
    },
    _bindEvents: {

      /**
       * Keep this private to avoid double event binding
       * Main logic of the surface is here
       * Should be extended with needed events (mouseenter, mouseleave, wheel ...)
       */

      value: function _bindEvents() {
        var _this = this;

        var onMouseDown = function (e) {
          // By removing the previous selection we prevent bypassing the mousemove events coming from SVG in Firefox.
          window.getSelection().removeAllRanges();
          var event = _this._createEvent("mousedown", e);

          _this.isMouseDown = true;
          _this.mouseDownEvent = event;
          _this.lastEvent = event;
          // Register mousemove and mouseup listeners on window
          window.addEventListener("mousemove", onMouseMove, false);
          window.addEventListener("mouseup", onMouseUp, false);

          _this.emit("event", event);
        };

        var onMouseMove = function (e) {
          var event = _this._createEvent("mousemove", e);
          event.defineArea(_this.mouseDownEvent, _this.lastEvent);
          // Update `lastEvent` for next call
          _this.lastEvent = event;

          _this.emit("event", event);
        };

        var onMouseUp = function (e) {
          var event = _this._createEvent("mouseup", e);
          event.defineArea(_this.mouseDownEvent, _this.lastEvent);

          _this.isMouseDown = false;
          _this.mouseDownEvent = null;
          _this.lastEvent = null;
          // Remove mousemove and mouseup listeners on window
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);

          _this.emit("event", event);
        };

        var onClick = function (e) {
          var event = _this._createEvent("click", e);
          _this.emit("event", event);
        };

        var onDblClick = function (e) {
          var event = _this._createEvent("dblclick", e);
          _this.emit("event", event);
        };

        // Bind callbacks
        this.el.addEventListener("mousedown", onMouseDown, false);
        this.el.addEventListener("click", onClick, false);
        this.el.addEventListener("dblclick", onDblClick, false);
      }
    }
  });

  return Surface;
})(EventSource);

module.exports = Surface;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFBTyxXQUFXLDJCQUFNLGdCQUFnQjs7SUFDakMsU0FBUywyQkFBTSxjQUFjOztBQUdwQyxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQzs7Ozs7OztJQU1iLE9BQU87Ozs7O0FBSWYsV0FKUSxPQUFPLENBSWQsRUFBRSw4Q0FBOEM7MEJBSnpDLE9BQU87O0FBS3hCLHFDQUxpQixPQUFPLDZDQUtsQixFQUFFLEVBQUU7OztBQUdWLFFBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBQzNCLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0dBQ3ZCOztZQVZrQixPQUFPOztlQUFQLE9BQU87QUFlMUIsZ0JBQVk7Ozs7OzthQUFBLHNCQUFDLElBQUksRUFBRSxDQUFDLEVBQUU7QUFDcEIsWUFBTSxLQUFLLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVyQyxZQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekMsYUFBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2hCLGFBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFaEIsZUFBTyxLQUFLLENBQUM7T0FDZDs7QUFNRCx3QkFBb0I7Ozs7Ozs7YUFBQSw4QkFBQyxDQUFDLEVBQUU7O0FBRXRCLFlBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLFlBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLFlBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUNuRCxZQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMs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QUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDM0IsQ0FBQzs7QUFFRixZQUFNLFVBQVUsR0FBRyxVQUFDLENBQUMsRUFBSztBQUN4QixjQUFJLEtBQUssR0FBRyxNQUFLLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0MsZ0JBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUMzQixDQUFDOzs7QUFHRixZQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDMUQsWUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2xELFlBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUN6RDs7OztTQWxIa0IsT0FBTztHQUFTLFdBQVc7O2lCQUEzQixPQUFPIiwiZmlsZSI6ImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXZlbnRTb3VyY2UgZnJvbSAnLi9ldmVudC1zb3VyY2UnO1xuaW1wb3J0IFdhdmVFdmVudCBmcm9tICcuL3dhdmUtZXZlbnQnO1xuXG5cbmNvbnN0IGJvZHkgPSB3aW5kb3cuZG9jdW1lbnQuYm9keTtcblxuLyoqXG4gKiBgU3VyZmFjZWAgbm9ybWFsaXplcyBtb3VzZSB1c2VyIGludGVyYWN0aW9ucyB3aXRoIHRoZSB0aW1lbGluZSB1cG9uIHRoZSBET00gY29udGFpbmVyIGVsZW1lbnQgb2YgYFRyYWNrYCBpbnN0YW5jZXMuXG4gKiBBcyBzb29uIGFzIGEgYHRyYWNrYCBpcyBhZGRlZCB0byBhIGB0aW1lbGluZWAsIGl0cyBhdHRhY2hlZCBgU3VyZmFjZWAgaW5zdGFuY2Ugd2lsbCBlbWl0IHRoZSBtb3VzZSBldmVudHMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN1cmZhY2UgZXh0ZW5kcyBFdmVudFNvdXJjZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IGVsIC0gdGhlIERPTSBlbGVtZW50IHRvIG1vbml0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsIC8qLCBwYWRkaW5nIG9mIHRoZSBjdXJyZW50IHN1cmZhY2UgQFRPRE8gKi8pIHtcbiAgICBzdXBlcihlbCk7XG5cbiAgICAvLyB0aGlzLmlzTW91c2VEb3duID0gZmFsc2U7XG4gICAgdGhpcy5tb3VzZURvd25FdmVudCA9IG51bGw7XG4gICAgdGhpcy5sYXN0RXZlbnQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEZhY3RvcnkgbWV0aG9kIGZvciBgRXZlbnRgIGNsYXNzXG4gICAqL1xuICBfY3JlYXRlRXZlbnQodHlwZSwgZSkge1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IFdhdmVFdmVudCh0eXBlLCBlKTtcblxuICAgIGNvbnN0IHBvcyA9IHRoaXMuX2dldFJlbGF0aXZlUG9zaXRpb24oZSk7XG4gICAgZXZlbnQueCA9IHBvcy54O1xuICAgIGV2ZW50LnkgPSBwb3MueTtcblxuICAgIHJldHVybiBldmVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBlIC0gcmF3IGV2ZW50IGZyb20gbGlzdGVuZXJcbiAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgeCwgeSBjb29yZGluYXRlcyBjb29yZGluYXRlcyByZWxhdGl2ZSB0byB0aGUgc3VyZmFjZSBlbGVtZW50XG4gICAqL1xuICBfZ2V0UmVsYXRpdmVQb3NpdGlvbihlKSB7XG4gICAgLy8gQFRPRE86IHNob3VsZCBiZSBhYmxlIHRvIGlnbm9yZSBwYWRkaW5nXG4gICAgbGV0IHggPSAwO1xuICAgIGxldCB5ID0gMDtcbiAgICBjb25zdCBjbGllbnRSZWN0ID0gdGhpcy5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBzY3JvbGxMZWZ0ID0gYm9keS5zY3JvbGxMZWZ0ICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ7XG4gICAgY29uc3Qgc2Nyb2xsVG9wICA9IGJvZHkuc2Nyb2xsVG9wICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcblxuICAgIC8vIEFkYXB0ZWQgZnJvbSBodHRwOi8vd3d3LnF1aXJrc21vZGUub3JnL2pzL2V2ZW50c19wcm9wZXJ0aWVzLmh0bWwjcG9zaXRpb25cbiAgICBpZiAoZS5wYWdlWCB8fCBlLnBhZ2VZKSB7XG4gICAgICB4ID0gZS5wYWdlWDtcbiAgICAgIHkgPSBlLnBhZ2VZO1xuICAgIH0gZWxzZSBpZiAoZS5jbGllbnRYIHx8IGUuY2xpZW50WSkge1xuICAgICAgLy8gTm9ybWFsaXplIHRvIHBhZ2VYLCBwYWdlWVxuICAgICAgeCA9IGUuY2xpZW50WCArIHNjcm9sbExlZnQ7XG4gICAgICB5ID0gZS5jbGllbnRZICsgc2Nyb2xsVG9wO1xuICAgIH1cblxuICAgIC8vIGNsaWVudFJlY3QgcmVmZXJzIHRvIHRoZSBjbGllbnQsIG5vdCB0byB0aGUgcGFnZVxuICAgIHggPSB4IC0gKGNsaWVudFJlY3QubGVmdCArIHNjcm9sbExlZnQpO1xuICAgIHkgPSB5IC0gKGNsaWVudFJlY3QudG9wICArIHNjcm9sbFRvcCApO1xuXG4gICAgLy8gU2hvdWxkIGhhbmRsZSBwYWRkaW5nXG5cbiAgICByZXR1cm4geyB4LCB5IH07XG4gIH1cblxuICAvKipcbiAgICogS2VlcCB0aGlzIHByaXZhdGUgdG8gYXZvaWQgZG91YmxlIGV2ZW50IGJpbmRpbmdcbiAgICogTWFpbiBsb2dpYyBvZiB0aGUgc3VyZmFjZSBpcyBoZXJlXG4gICAqIFNob3VsZCBiZSBleHRlbmRlZCB3aXRoIG5lZWRlZCBldmVudHMgKG1vdXNlZW50ZXIsIG1vdXNlbGVhdmUsIHdoZWVsIC4uLilcbiAgICovXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIGNvbnN0IG9uTW91c2VEb3duID0gKGUpID0+IHtcbiAgICAgIC8vIEJ5IHJlbW92aW5nIHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gd2UgcHJldmVudCBieXBhc3NpbmcgdGhlIG1vdXNlbW92ZSBldmVudHMgY29taW5nIGZyb20gU1ZHIGluIEZpcmVmb3guXG4gICAgICB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICBjb25zdCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdtb3VzZWRvd24nLCBlKTtcblxuICAgICAgdGhpcy5pc01vdXNlRG93biA9IHRydWU7XG4gICAgICB0aGlzLm1vdXNlRG93bkV2ZW50ID0gZXZlbnQ7XG4gICAgICB0aGlzLmxhc3RFdmVudCA9IGV2ZW50O1xuICAgICAgLy8gUmVnaXN0ZXIgbW91c2Vtb3ZlIGFuZCBtb3VzZXVwIGxpc3RlbmVycyBvbiB3aW5kb3dcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSwgZmFsc2UpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXAsIGZhbHNlKTtcblxuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25Nb3VzZU1vdmUgPSAoZSkgPT4ge1xuICAgICAgbGV0IGV2ZW50ID0gdGhpcy5fY3JlYXRlRXZlbnQoJ21vdXNlbW92ZScsIGUpO1xuICAgICAgZXZlbnQuZGVmaW5lQXJlYSh0aGlzLm1vdXNlRG93bkV2ZW50LCB0aGlzLmxhc3RFdmVudCk7XG4gICAgICAvLyBVcGRhdGUgYGxhc3RFdmVudGAgZm9yIG5leHQgY2FsbFxuICAgICAgdGhpcy5sYXN0RXZlbnQgPSBldmVudDtcblxuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25Nb3VzZVVwID0gKGUpID0+IHtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdtb3VzZXVwJywgZSk7XG4gICAgICBldmVudC5kZWZpbmVBcmVhKHRoaXMubW91c2VEb3duRXZlbnQsIHRoaXMubGFzdEV2ZW50KTtcblxuICAgICAgdGhpcy5pc01vdXNlRG93biA9IGZhbHNlO1xuICAgICAgdGhpcy5tb3VzZURvd25FdmVudCA9IG51bGw7XG4gICAgICB0aGlzLmxhc3RFdmVudCA9IG51bGw7XG4gICAgICAvLyBSZW1vdmUgbW91c2Vtb3ZlIGFuZCBtb3VzZXVwIGxpc3RlbmVycyBvbiB3aW5kb3dcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSk7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XG5cbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfTtcblxuICAgIGNvbnN0IG9uQ2xpY2sgPSAoZSkgPT4ge1xuICAgICAgbGV0IGV2ZW50ID0gdGhpcy5fY3JlYXRlRXZlbnQoJ2NsaWNrJywgZSk7XG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH07XG5cbiAgICBjb25zdCBvbkRibENsaWNrID0gKGUpID0+IHtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdkYmxjbGljaycsIGUpO1xuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgLy8gQmluZCBjYWxsYmFja3NcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2VEb3duLCBmYWxzZSk7XG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2ssIGZhbHNlKTtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgb25EYmxDbGljaywgZmFsc2UpO1xuICB9XG59XG4iXX0=