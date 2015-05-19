"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var EventSource = require("./event-source");
var Event = require("./event");
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
        var event = new Event(type, e);

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

        var onMouseDown = function (e) {
          // e.stopPropagation();
          var event = _this._createEvent("mousedown", e);

          _this.isMouseDown = true;
          _this.mouseDownEvent = event;
          _this.lastEvent = event;
          // register mouse move on body - more user friendly
          body.addEventListener("mousemove", onMouseMove, false);

          // console.log(event.target, event.originalEvent.target, event.originalEvent.currentTarget);

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
        this.el.addEventListener("mouseup", onMouseUp, false);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9pbnRlcmFjdGlvbnMvc3VyZmFjZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM5QyxJQUFNLEtBQUssR0FBSSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbEMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7O0lBRTVCLE9BQU87Ozs7OztBQUtBLFdBTFAsT0FBTyxDQUtDLEVBQUUsaUJBQWlCOzBCQUwzQixPQUFPOztBQU1ULHFDQU5FLE9BQU8sNkNBTUgsRUFBRSxFQUFFOzs7QUFHVixRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztBQUMzQixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztHQUN2Qjs7WUFYRyxPQUFPOztlQUFQLE9BQU87QUFnQlgsZ0JBQVk7Ozs7OzthQUFBLHNCQUFDLElBQUksRUFBRSxDQUFDLEVBQUU7QUFDcEIsWUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVqQyxZQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekMsYUFBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2hCLGFBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFaEIsZUFBTyxLQUFLLENBQUM7T0FDZDs7QUFNRCx3QkFBb0I7Ozs7Ozs7YUFBQSw4QkFBQyxDQUFDLEVBQUU7O0FBRXRCLFlBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLFlBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLFlBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUNuRCxZQUFNLFVBQVUsR0FBRyxJQUFJ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QVUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3QyxnQkFBSyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzNCLENBQUE7OztBQUdELFlBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxRCxZQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDdEQsWUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2xELFlBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQzs7Ozs7Ozs7O09BU3pEOzs7O1NBaklHLE9BQU87R0FBUyxXQUFXOztBQW9JakMsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiZXM2L2ludGVyYWN0aW9ucy9zdXJmYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgRXZlbnRTb3VyY2UgPSByZXF1aXJlKCcuL2V2ZW50LXNvdXJjZScpO1xuY29uc3QgRXZlbnQgID0gcmVxdWlyZSgnLi9ldmVudCcpO1xuY29uc3QgYm9keSA9IHdpbmRvdy5kb2N1bWVudC5ib2R5O1xuXG5jbGFzcyBTdXJmYWNlIGV4dGVuZHMgRXZlbnRTb3VyY2Uge1xuICAvKipcbiAgICogQHBhcmFtIGVsIDxET01FbGVtZW50PiB0aGUgRE9NIGVsZW1lbnQgdG8gbW9uaXRvcmVcbiAgICogQHBhcmFtIHBhZGRpbmcgPE9iamVjdD4gdGhlIHBhZGRpbmcgb2YgdGhlIGN1cnJlbnQgc3VyZmFjZSBAVE9ET1xuICAgKi9cbiAgY29uc3RydWN0b3IoZWwgLyosIHBhZGRpbmcgKi8pIHtcbiAgICBzdXBlcihlbCk7XG5cbiAgICAvLyB0aGlzLmlzTW91c2VEb3duID0gZmFsc2U7XG4gICAgdGhpcy5tb3VzZURvd25FdmVudCA9IG51bGw7XG4gICAgdGhpcy5sYXN0RXZlbnQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqICBmYWN0b3J5IG1ldGhvZCBmb3IgYEV2ZW50YCBjbGFzc1xuICAgKi9cbiAgX2NyZWF0ZUV2ZW50KHR5cGUsIGUpIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBFdmVudCh0eXBlLCBlKTtcblxuICAgIGNvbnN0IHBvcyA9IHRoaXMuX2dldFJlbGF0aXZlUG9zaXRpb24oZSk7XG4gICAgZXZlbnQueCA9IHBvcy54O1xuICAgIGV2ZW50LnkgPSBwb3MueTtcblxuICAgIHJldHVybiBldmVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gIGUgPEV2ZW50PiByYXcgZXZlbnQgZnJvbSBsaXN0ZW5lclxuICAgKiBAcmV0dXJuIDxPYmplY3Q+IHRoZSB4LCB5IGNvb3JkaW5hdGVzIGNvb3JkaW5hdGVzIHJlbGF0aXZlIHRvIHRoZSBzdXJmYWNlIGVsZW1lbnRcbiAgICovXG4gIF9nZXRSZWxhdGl2ZVBvc2l0aW9uKGUpIHtcbiAgICAvLyBAVE9ETzogc2hvdWxkIGJlIGFibGUgdG8gaWdub3JlIHBhZGRpbmdcbiAgICBsZXQgeCA9IDA7XG4gICAgbGV0IHkgPSAwO1xuICAgIGNvbnN0IGNsaWVudFJlY3QgPSB0aGlzLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHNjcm9sbExlZnQgPSBib2R5LnNjcm9sbExlZnQgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdDtcbiAgICBjb25zdCBzY3JvbGxUb3AgID0gYm9keS5zY3JvbGxUb3AgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuXG4gICAgLy8gYWRhcHRlZCBmcm9tIGh0dHA6Ly93d3cucXVpcmtzbW9kZS5vcmcvanMvZXZlbnRzX3Byb3BlcnRpZXMuaHRtbCNwb3NpdGlvblxuICAgIGlmIChlLnBhZ2VYIHx8IGUucGFnZVkpIHtcbiAgICAgIHggPSBlLnBhZ2VYO1xuICAgICAgeSA9IGUucGFnZVk7XG4gICAgfSBlbHNlIGlmIChlLmNsaWVudFggfHwgZS5jbGllbnRZKSB7XG4gICAgICAvLyBub3JtYWxpemUgdG8gcGFnZVgsIHBhZ2VZXG4gICAgICB4ID0gZS5jbGllbnRYICsgc2Nyb2xsTGVmdDtcbiAgICAgIHkgPSBlLmNsaWVudFkgKyBzY3JvbGxUb3A7XG4gICAgfVxuXG4gICAgLy8gY2xpZW50UmVjdCByZWZlcnMgdG8gdGhlIGNsaWVudCwgbm90IHRvIHRoZSBwYWdlXG4gICAgeCA9IHggLSAoY2xpZW50UmVjdC5sZWZ0ICsgc2Nyb2xsTGVmdCk7XG4gICAgeSA9IHkgLSAoY2xpZW50UmVjdC50b3AgICsgc2Nyb2xsVG9wICk7XG5cbiAgICAvLyBzaG91bGQgaGFuZGxlIHBhZGRpbmdcblxuICAgIHJldHVybiB7IHgsIHkgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBrZWVwIHRoaXMgcHJpdmF0ZSB0byBhdm9pciBkb3VibGUgZXZlbnQgYmluZGluZ1xuICAgKiBtYWluIGxvZ2ljIG9mIHRoZSBzdXJmYWNlIGlzIGhlcmVcbiAgICogc2hvdWxkIGJlIGV4dGVuZGVkIHdpdGggbmVlZGVkIGV2ZW50c1xuICAgKiBATk9URSBzaG91bGQgd2Ugc3RvcCB0aGUgcHJvcGFnYXRpb24gaW5zaWRlIHRoZSB0aW1lbGluZSA/XG4gICAqL1xuICBfYmluZEV2ZW50cygpIHtcblxuICAgIHZhciBvbk1vdXNlRG93biA9IChlKSA9PiB7XG4gICAgICAvLyBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgbGV0IGV2ZW50ID0gdGhpcy5fY3JlYXRlRXZlbnQoJ21vdXNlZG93bicsIGUpO1xuXG4gICAgICB0aGlzLmlzTW91c2VEb3duID0gdHJ1ZTtcbiAgICAgIHRoaXMubW91c2VEb3duRXZlbnQgPSBldmVudDtcbiAgICAgIHRoaXMubGFzdEV2ZW50ID0gZXZlbnQ7XG4gICAgICAvLyByZWdpc3RlciBtb3VzZSBtb3ZlIG9uIGJvZHkgLSBtb3JlIHVzZXIgZnJpZW5kbHlcbiAgICAgIGJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUsIGZhbHNlKTtcblxuICAgICAgLy8gY29uc29sZS5sb2coZXZlbnQudGFyZ2V0LCBldmVudC5vcmlnaW5hbEV2ZW50LnRhcmdldCwgZXZlbnQub3JpZ2luYWxFdmVudC5jdXJyZW50VGFyZ2V0KTtcblxuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9XG5cbiAgICB2YXIgb25Nb3VzZU1vdmUgPSAoZSkgPT4ge1xuICAgICAgLy8gZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdtb3VzZW1vdmUnLCBlKTtcbiAgICAgIGV2ZW50LmRlZmluZUFyZWEodGhpcy5tb3VzZURvd25FdmVudCwgdGhpcy5sYXN0RXZlbnQpO1xuICAgICAgLy8gdXBkYXRlIGBsYXN0RXZlbnRgIGZvciBuZXh0IGNhbGxcbiAgICAgIHRoaXMubGFzdEV2ZW50ID0gZXZlbnQ7XG5cbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfVxuXG4gICAgdmFyIG9uTW91c2VVcCA9IChlKSA9PiB7XG4gICAgICAvLyBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgbGV0IGV2ZW50ID0gdGhpcy5fY3JlYXRlRXZlbnQoJ21vdXNldXAnLCBlKTtcbiAgICAgIGV2ZW50LmRlZmluZUFyZWEodGhpcy5tb3VzZURvd25FdmVudCwgdGhpcy5sYXN0RXZlbnQpO1xuXG4gICAgICB0aGlzLmlzTW91c2VEb3duID0gZmFsc2U7XG4gICAgICB0aGlzLm1vdXNlRG93bkV2ZW50ID0gbnVsbDtcbiAgICAgIHRoaXMubGFzdEV2ZW50ID0gbnVsbDtcbiAgICAgIC8vIHJlbW92ZSBsaXN0ZW5lciBvblxuICAgICAgYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSk7XG5cbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfVxuXG4gICAgdmFyIG9uQ2xpY2sgPSAoZSkgPT4ge1xuICAgICAgLy8gZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdjbGljaycsIGUpO1xuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9XG5cbiAgICB2YXIgb25EYmxDbGljayA9IChlKSA9PiB7XG4gICAgICAvLyBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgbGV0IGV2ZW50ID0gdGhpcy5fY3JlYXRlRXZlbnQoJ2RibGNsaWNrJywgZSk7XG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH1cblxuICAgIC8vIGJpbmQgY2FsbGJhY2tzXG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbk1vdXNlRG93biwgZmFsc2UpO1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCwgZmFsc2UpO1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrLCBmYWxzZSk7XG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIG9uRGJsQ2xpY2ssIGZhbHNlKTtcblxuICAgIC8vIGxldCBzdmdzID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yQWxsKCdzdmcnKTtcbiAgICAvLyBjb25zb2xlLmxvZyhzdmdzKTtcbiAgICAvLyBmb3IgKGxldCBpID0gMCwgbCA9IHN2Z3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgLy8gICBzdmdzW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2VEb3duLCBmYWxzZSk7XG4gICAgLy8gfVxuXG4gICAgLy8gQFRPRE86IG1vdXNlZW50ZXIsIG1vdXNlbGVhdmUsIHdoZWVsID9cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN1cmZhY2U7XG4iXX0=