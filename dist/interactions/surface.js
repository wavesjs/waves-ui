"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var EventSource = require("./event-source");
var WaveEvent = require("./wave-event");
var body = window.document.body;

var Surface = (function (_EventSource) {
  /**
   * @param el <DOMElement> the DOM element to monitore
   * @param padding <Object> the padding of the current surface @TODO
   */

  function Surface(el /*, padding */) {
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
       *  factory method for `Event` class
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
       * @param  e <Event> raw event from listener
       * @return <Object> the x, y coordinates coordinates relative to the surface element
       */

      value: function _getRelativePosition(e) {
        // @TODO: should be able to ignore padding
        var x = 0;
        var y = 0;
        var clientRect = this.el.getBoundingClientRect();
        var scrollLeft = body.scrollLeft + document.documentElement.scrollLeft;
        var scrollTop = body.scrollTop + document.documentElement.scrollTop;

        // adapted from http://www.quirksmode.org/js/events_properties.html#position
        if (e.pageX || e.pageY) {
          x = e.pageX;
          y = e.pageY;
        } else if (e.clientX || e.clientY) {
          // normalize to pageX, pageY
          x = e.clientX + scrollLeft;
          y = e.clientY + scrollTop;
        }

        // clientRect refers to the client, not to the page
        x = x - (clientRect.left + scrollLeft);
        y = y - (clientRect.top + scrollTop);

        // should handle padding

        return { x: x, y: y };
      }
    },
    _bindEvents: {

      /**
       * keep this private to avoir double event binding
       * main logic of the surface is here
       * should be extended with needed events
       * @NOTE should we stop the propagation inside the timeline ?
       */

      value: function _bindEvents() {
        var _this = this;

        // @NOTE add mouseup on body too
        var onMouseDown = function (e) {
          // e.stopPropagation();
          var event = _this._createEvent("mousedown", e);

          _this.isMouseDown = true;
          _this.mouseDownEvent = event;
          _this.lastEvent = event;
          // register mouse move on body - more user friendly
          body.addEventListener("mousemove", onMouseMove, false);
          body.addEventListener("mouseup", onMouseUp, false);
          // console.log(event);

          _this.emit("event", event);
        };

        var onMouseMove = function (e) {
          // e.stopPropagation();
          var event = _this._createEvent("mousemove", e);
          event.defineArea(_this.mouseDownEvent, _this.lastEvent);
          // update `lastEvent` for next call
          _this.lastEvent = event;

          _this.emit("event", event);
        };

        var onMouseUp = function (e) {
          // e.stopPropagation();
          var event = _this._createEvent("mouseup", e);
          event.defineArea(_this.mouseDownEvent, _this.lastEvent);

          _this.isMouseDown = false;
          _this.mouseDownEvent = null;
          _this.lastEvent = null;
          // remove listener on
          body.removeEventListener("mousemove", onMouseMove);
          body.removeEventListener("mouseup", onMouseUp);

          _this.emit("event", event);
        };

        var onClick = function (e) {
          // e.stopPropagation();
          var event = _this._createEvent("click", e);
          _this.emit("event", event);
        };

        var onDblClick = function (e) {
          // e.stopPropagation();
          var event = _this._createEvent("dblclick", e);
          _this.emit("event", event);
        };

        // bind callbacks
        this.el.addEventListener("mousedown", onMouseDown, false);
        this.el.addEventListener("click", onClick, false);
        this.el.addEventListener("dblclick", onDblClick, false);

        // let svgs = this.el.querySelectorAll('svg');
        // console.log(svgs);
        // for (let i = 0, l = svgs.length; i < l; i++) {
        //   svgs[i].addEventListener('mousedown', onMouseDown, false);
        // }

        // @TODO: mouseenter, mouseleave, wheel ?
      }
    }
  });

  return Surface;
})(EventSource);

module.exports = Surface;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9pbnRlcmFjdGlvbnMvc3VyZmFjZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM5QyxJQUFNLFNBQVMsR0FBSSxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDM0MsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7O0lBRTVCLE9BQU87Ozs7OztBQUtBLFdBTFAsT0FBTyxDQUtDLEVBQUUsaUJBQWlCOzBCQUwzQixPQUFPOztBQU1ULHFDQU5FLE9BQU8sNkNBTUgsRUFBRSxFQUFFOzs7QUFHVixRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztBQUMzQixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztHQUN2Qjs7WUFYRyxPQUFPOztlQUFQLE9BQU87QUFnQlgsZ0JBQVk7Ozs7OzthQUFBLHNCQUFDLElBQUksRUFBRSxDQUFDLEVBQUU7QUFDcEIsWUFBTSxLQUFLLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVyQyxZQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekMsYUFBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2hCLGFBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFaEIsZUFBTyxLQUFLLENBQUM7T0FDZDs7QUFNRCx3QkFBb0I7Ozs7Ozs7YUFBQSw4QkFBQyxDQUFDLEVBQUU7O0FBRXRCLFlBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLFlBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLFlBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUNuRCxZQUFNLFVBQVUsR0FBRyxJQUFJ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Q0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDM0IsQ0FBQzs7QUFFRixZQUFJLFVBQVUsR0FBRyxVQUFDLENBQUMsRUFBSzs7QUFFdEIsY0FBSSxLQUFLLEdBQUcsTUFBSyxZQUFZLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzdDLGdCQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDM0IsQ0FBQzs7O0FBR0YsWUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzFELFlBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNsRCxZQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7Ozs7Ozs7OztPQVN6RDs7OztTQWxJRyxPQUFPO0dBQVMsV0FBVzs7QUFxSWpDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9pbnRlcmFjdGlvbnMvc3VyZmFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEV2ZW50U291cmNlID0gcmVxdWlyZSgnLi9ldmVudC1zb3VyY2UnKTtcbmNvbnN0IFdhdmVFdmVudCAgPSByZXF1aXJlKCcuL3dhdmUtZXZlbnQnKTtcbmNvbnN0IGJvZHkgPSB3aW5kb3cuZG9jdW1lbnQuYm9keTtcblxuY2xhc3MgU3VyZmFjZSBleHRlbmRzIEV2ZW50U291cmNlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSBlbCA8RE9NRWxlbWVudD4gdGhlIERPTSBlbGVtZW50IHRvIG1vbml0b3JlXG4gICAqIEBwYXJhbSBwYWRkaW5nIDxPYmplY3Q+IHRoZSBwYWRkaW5nIG9mIHRoZSBjdXJyZW50IHN1cmZhY2UgQFRPRE9cbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsIC8qLCBwYWRkaW5nICovKSB7XG4gICAgc3VwZXIoZWwpO1xuXG4gICAgLy8gdGhpcy5pc01vdXNlRG93biA9IGZhbHNlO1xuICAgIHRoaXMubW91c2VEb3duRXZlbnQgPSBudWxsO1xuICAgIHRoaXMubGFzdEV2ZW50ID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiAgZmFjdG9yeSBtZXRob2QgZm9yIGBFdmVudGAgY2xhc3NcbiAgICovXG4gIF9jcmVhdGVFdmVudCh0eXBlLCBlKSB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgV2F2ZUV2ZW50KHR5cGUsIGUpO1xuXG4gICAgY29uc3QgcG9zID0gdGhpcy5fZ2V0UmVsYXRpdmVQb3NpdGlvbihlKTtcbiAgICBldmVudC54ID0gcG9zLng7XG4gICAgZXZlbnQueSA9IHBvcy55O1xuXG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSAgZSA8RXZlbnQ+IHJhdyBldmVudCBmcm9tIGxpc3RlbmVyXG4gICAqIEByZXR1cm4gPE9iamVjdD4gdGhlIHgsIHkgY29vcmRpbmF0ZXMgY29vcmRpbmF0ZXMgcmVsYXRpdmUgdG8gdGhlIHN1cmZhY2UgZWxlbWVudFxuICAgKi9cbiAgX2dldFJlbGF0aXZlUG9zaXRpb24oZSkge1xuICAgIC8vIEBUT0RPOiBzaG91bGQgYmUgYWJsZSB0byBpZ25vcmUgcGFkZGluZ1xuICAgIGxldCB4ID0gMDtcbiAgICBsZXQgeSA9IDA7XG4gICAgY29uc3QgY2xpZW50UmVjdCA9IHRoaXMuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3Qgc2Nyb2xsTGVmdCA9IGJvZHkuc2Nyb2xsTGVmdCArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgIGNvbnN0IHNjcm9sbFRvcCAgPSBib2R5LnNjcm9sbFRvcCArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG5cbiAgICAvLyBhZGFwdGVkIGZyb20gaHR0cDovL3d3dy5xdWlya3Ntb2RlLm9yZy9qcy9ldmVudHNfcHJvcGVydGllcy5odG1sI3Bvc2l0aW9uXG4gICAgaWYgKGUucGFnZVggfHwgZS5wYWdlWSkge1xuICAgICAgeCA9IGUucGFnZVg7XG4gICAgICB5ID0gZS5wYWdlWTtcbiAgICB9IGVsc2UgaWYgKGUuY2xpZW50WCB8fCBlLmNsaWVudFkpIHtcbiAgICAgIC8vIG5vcm1hbGl6ZSB0byBwYWdlWCwgcGFnZVlcbiAgICAgIHggPSBlLmNsaWVudFggKyBzY3JvbGxMZWZ0O1xuICAgICAgeSA9IGUuY2xpZW50WSArIHNjcm9sbFRvcDtcbiAgICB9XG5cbiAgICAvLyBjbGllbnRSZWN0IHJlZmVycyB0byB0aGUgY2xpZW50LCBub3QgdG8gdGhlIHBhZ2VcbiAgICB4ID0geCAtIChjbGllbnRSZWN0LmxlZnQgKyBzY3JvbGxMZWZ0KTtcbiAgICB5ID0geSAtIChjbGllbnRSZWN0LnRvcCAgKyBzY3JvbGxUb3AgKTtcblxuICAgIC8vIHNob3VsZCBoYW5kbGUgcGFkZGluZ1xuXG4gICAgcmV0dXJuIHsgeCwgeSB9O1xuICB9XG5cbiAgLyoqXG4gICAqIGtlZXAgdGhpcyBwcml2YXRlIHRvIGF2b2lyIGRvdWJsZSBldmVudCBiaW5kaW5nXG4gICAqIG1haW4gbG9naWMgb2YgdGhlIHN1cmZhY2UgaXMgaGVyZVxuICAgKiBzaG91bGQgYmUgZXh0ZW5kZWQgd2l0aCBuZWVkZWQgZXZlbnRzXG4gICAqIEBOT1RFIHNob3VsZCB3ZSBzdG9wIHRoZSBwcm9wYWdhdGlvbiBpbnNpZGUgdGhlIHRpbWVsaW5lID9cbiAgICovXG4gIF9iaW5kRXZlbnRzKCkge1xuXG4gICAgLy8gQE5PVEUgYWRkIG1vdXNldXAgb24gYm9keSB0b29cbiAgICB2YXIgb25Nb3VzZURvd24gPSAoZSkgPT4ge1xuICAgICAgLy8gZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdtb3VzZWRvd24nLCBlKTtcblxuICAgICAgdGhpcy5pc01vdXNlRG93biA9IHRydWU7XG4gICAgICB0aGlzLm1vdXNlRG93bkV2ZW50ID0gZXZlbnQ7XG4gICAgICB0aGlzLmxhc3RFdmVudCA9IGV2ZW50O1xuICAgICAgLy8gcmVnaXN0ZXIgbW91c2UgbW92ZSBvbiBib2R5IC0gbW9yZSB1c2VyIGZyaWVuZGx5XG4gICAgICBib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlLCBmYWxzZSk7XG4gICAgICBib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXAsIGZhbHNlKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGV2ZW50KTtcblxuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgdmFyIG9uTW91c2VNb3ZlID0gKGUpID0+IHtcbiAgICAgIC8vIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnbW91c2Vtb3ZlJywgZSk7XG4gICAgICBldmVudC5kZWZpbmVBcmVhKHRoaXMubW91c2VEb3duRXZlbnQsIHRoaXMubGFzdEV2ZW50KTtcbiAgICAgIC8vIHVwZGF0ZSBgbGFzdEV2ZW50YCBmb3IgbmV4dCBjYWxsXG4gICAgICB0aGlzLmxhc3RFdmVudCA9IGV2ZW50O1xuXG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH07XG5cbiAgICB2YXIgb25Nb3VzZVVwID0gKGUpID0+IHtcbiAgICAgIC8vIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnbW91c2V1cCcsIGUpO1xuICAgICAgZXZlbnQuZGVmaW5lQXJlYSh0aGlzLm1vdXNlRG93bkV2ZW50LCB0aGlzLmxhc3RFdmVudCk7XG5cbiAgICAgIHRoaXMuaXNNb3VzZURvd24gPSBmYWxzZTtcbiAgICAgIHRoaXMubW91c2VEb3duRXZlbnQgPSBudWxsO1xuICAgICAgdGhpcy5sYXN0RXZlbnQgPSBudWxsO1xuICAgICAgLy8gcmVtb3ZlIGxpc3RlbmVyIG9uXG4gICAgICBib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlKTtcbiAgICAgIGJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XG5cbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfTtcblxuICAgIHZhciBvbkNsaWNrID0gKGUpID0+IHtcbiAgICAgIC8vIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnY2xpY2snLCBlKTtcbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfTtcblxuICAgIHZhciBvbkRibENsaWNrID0gKGUpID0+IHtcbiAgICAgIC8vIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnZGJsY2xpY2snLCBlKTtcbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfTtcblxuICAgIC8vIGJpbmQgY2FsbGJhY2tzXG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbk1vdXNlRG93biwgZmFsc2UpO1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrLCBmYWxzZSk7XG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIG9uRGJsQ2xpY2ssIGZhbHNlKTtcblxuICAgIC8vIGxldCBzdmdzID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yQWxsKCdzdmcnKTtcbiAgICAvLyBjb25zb2xlLmxvZyhzdmdzKTtcbiAgICAvLyBmb3IgKGxldCBpID0gMCwgbCA9IHN2Z3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgLy8gICBzdmdzW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2VEb3duLCBmYWxzZSk7XG4gICAgLy8gfVxuXG4gICAgLy8gQFRPRE86IG1vdXNlZW50ZXIsIG1vdXNlbGVhdmUsIHdoZWVsID9cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN1cmZhY2U7XG4iXX0=