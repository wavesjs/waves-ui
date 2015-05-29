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

        // @NOTE add mouseup on body too
        var onMouseDown = function (e) {
          // e.stopPropagation();
          var event = _this._createEvent("mousedown", e);

          _this.isMouseDown = true;
          _this.mouseDownEvent = event;
          _this.lastEvent = event;
          // register mouse move on body - more user friendly
          body.addEventListener("mousemove", onMouseMove, false);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9pbnRlcmFjdGlvbnMvc3VyZmFjZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM5QyxJQUFNLEtBQUssR0FBSSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbEMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7O0lBRTVCLE9BQU87Ozs7OztBQUtBLFdBTFAsT0FBTyxDQUtDLEVBQUUsaUJBQWlCOzBCQUwzQixPQUFPOztBQU1ULHFDQU5FLE9BQU8sNkNBTUgsRUFBRSxFQUFFOzs7QUFHVixRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztBQUMzQixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztHQUN2Qjs7WUFYRyxPQUFPOztlQUFQLE9BQU87QUFnQlgsZ0JBQVk7Ozs7OzthQUFBLHNCQUFDLElBQUksRUFBRSxDQUFDLEVBQUU7QUFDcEIsWUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVqQyxZQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekMsYUFBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2hCLGFBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFaEIsZUFBTyxLQUFLLENBQUM7T0FDZDs7QUFNRCx3QkFBb0I7Ozs7Ozs7YUFBQSw4QkFBQyxDQUFDLEVBQUU7O0FBRXRCLFlBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLFlBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLFlBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUNuRCxZQUFNLFVBQVUsR0FBRyxJQUFJ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QVUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3QyxnQkFBSyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzNCLENBQUE7OztBQUdELFlBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxRCxZQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDdEQsWUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2xELFlBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQzs7Ozs7Ozs7O09BU3pEOzs7O1NBaklHLE9BQU87R0FBUyxXQUFXOztBQW9JakMsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiZXM2L2ludGVyYWN0aW9ucy9zdXJmYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgRXZlbnRTb3VyY2UgPSByZXF1aXJlKCcuL2V2ZW50LXNvdXJjZScpO1xuY29uc3QgRXZlbnQgID0gcmVxdWlyZSgnLi9ldmVudCcpO1xuY29uc3QgYm9keSA9IHdpbmRvdy5kb2N1bWVudC5ib2R5O1xuXG5jbGFzcyBTdXJmYWNlIGV4dGVuZHMgRXZlbnRTb3VyY2Uge1xuICAvKipcbiAgICogQHBhcmFtIGVsIDxET01FbGVtZW50PiB0aGUgRE9NIGVsZW1lbnQgdG8gbW9uaXRvcmVcbiAgICogQHBhcmFtIHBhZGRpbmcgPE9iamVjdD4gdGhlIHBhZGRpbmcgb2YgdGhlIGN1cnJlbnQgc3VyZmFjZSBAVE9ET1xuICAgKi9cbiAgY29uc3RydWN0b3IoZWwgLyosIHBhZGRpbmcgKi8pIHtcbiAgICBzdXBlcihlbCk7XG5cbiAgICAvLyB0aGlzLmlzTW91c2VEb3duID0gZmFsc2U7XG4gICAgdGhpcy5tb3VzZURvd25FdmVudCA9IG51bGw7XG4gICAgdGhpcy5sYXN0RXZlbnQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqICBmYWN0b3J5IG1ldGhvZCBmb3IgYEV2ZW50YCBjbGFzc1xuICAgKi9cbiAgX2NyZWF0ZUV2ZW50KHR5cGUsIGUpIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBFdmVudCh0eXBlLCBlKTtcblxuICAgIGNvbnN0IHBvcyA9IHRoaXMuX2dldFJlbGF0aXZlUG9zaXRpb24oZSk7XG4gICAgZXZlbnQueCA9IHBvcy54O1xuICAgIGV2ZW50LnkgPSBwb3MueTtcblxuICAgIHJldHVybiBldmVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gIGUgPEV2ZW50PiByYXcgZXZlbnQgZnJvbSBsaXN0ZW5lclxuICAgKiBAcmV0dXJuIDxPYmplY3Q+IHRoZSB4LCB5IGNvb3JkaW5hdGVzIGNvb3JkaW5hdGVzIHJlbGF0aXZlIHRvIHRoZSBzdXJmYWNlIGVsZW1lbnRcbiAgICovXG4gIF9nZXRSZWxhdGl2ZVBvc2l0aW9uKGUpIHtcbiAgICAvLyBAVE9ETzogc2hvdWxkIGJlIGFibGUgdG8gaWdub3JlIHBhZGRpbmdcbiAgICBsZXQgeCA9IDA7XG4gICAgbGV0IHkgPSAwO1xuICAgIGNvbnN0IGNsaWVudFJlY3QgPSB0aGlzLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHNjcm9sbExlZnQgPSBib2R5LnNjcm9sbExlZnQgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdDtcbiAgICBjb25zdCBzY3JvbGxUb3AgID0gYm9keS5zY3JvbGxUb3AgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuXG4gICAgLy8gYWRhcHRlZCBmcm9tIGh0dHA6Ly93d3cucXVpcmtzbW9kZS5vcmcvanMvZXZlbnRzX3Byb3BlcnRpZXMuaHRtbCNwb3NpdGlvblxuICAgIGlmIChlLnBhZ2VYIHx8IGUucGFnZVkpIHtcbiAgICAgIHggPSBlLnBhZ2VYO1xuICAgICAgeSA9IGUucGFnZVk7XG4gICAgfSBlbHNlIGlmIChlLmNsaWVudFggfHwgZS5jbGllbnRZKSB7XG4gICAgICAvLyBub3JtYWxpemUgdG8gcGFnZVgsIHBhZ2VZXG4gICAgICB4ID0gZS5jbGllbnRYICsgc2Nyb2xsTGVmdDtcbiAgICAgIHkgPSBlLmNsaWVudFkgKyBzY3JvbGxUb3A7XG4gICAgfVxuXG4gICAgLy8gY2xpZW50UmVjdCByZWZlcnMgdG8gdGhlIGNsaWVudCwgbm90IHRvIHRoZSBwYWdlXG4gICAgeCA9IHggLSAoY2xpZW50UmVjdC5sZWZ0ICsgc2Nyb2xsTGVmdCk7XG4gICAgeSA9IHkgLSAoY2xpZW50UmVjdC50b3AgICsgc2Nyb2xsVG9wICk7XG5cbiAgICAvLyBzaG91bGQgaGFuZGxlIHBhZGRpbmdcblxuICAgIHJldHVybiB7IHgsIHkgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBrZWVwIHRoaXMgcHJpdmF0ZSB0byBhdm9pciBkb3VibGUgZXZlbnQgYmluZGluZ1xuICAgKiBtYWluIGxvZ2ljIG9mIHRoZSBzdXJmYWNlIGlzIGhlcmVcbiAgICogc2hvdWxkIGJlIGV4dGVuZGVkIHdpdGggbmVlZGVkIGV2ZW50c1xuICAgKiBATk9URSBzaG91bGQgd2Ugc3RvcCB0aGUgcHJvcGFnYXRpb24gaW5zaWRlIHRoZSB0aW1lbGluZSA/XG4gICAqL1xuICBfYmluZEV2ZW50cygpIHtcblxuICAgIC8vIEBOT1RFIGFkZCBtb3VzZXVwIG9uIGJvZHkgdG9vXG4gICAgdmFyIG9uTW91c2VEb3duID0gKGUpID0+IHtcbiAgICAgIC8vIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnbW91c2Vkb3duJywgZSk7XG5cbiAgICAgIHRoaXMuaXNNb3VzZURvd24gPSB0cnVlO1xuICAgICAgdGhpcy5tb3VzZURvd25FdmVudCA9IGV2ZW50O1xuICAgICAgdGhpcy5sYXN0RXZlbnQgPSBldmVudDtcbiAgICAgIC8vIHJlZ2lzdGVyIG1vdXNlIG1vdmUgb24gYm9keSAtIG1vcmUgdXNlciBmcmllbmRseVxuICAgICAgYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSwgZmFsc2UpO1xuICAgICAgLy8gY29uc29sZS5sb2coZXZlbnQpO1xuXG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH1cblxuICAgIHZhciBvbk1vdXNlTW92ZSA9IChlKSA9PiB7XG4gICAgICAvLyBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgbGV0IGV2ZW50ID0gdGhpcy5fY3JlYXRlRXZlbnQoJ21vdXNlbW92ZScsIGUpO1xuICAgICAgZXZlbnQuZGVmaW5lQXJlYSh0aGlzLm1vdXNlRG93bkV2ZW50LCB0aGlzLmxhc3RFdmVudCk7XG4gICAgICAvLyB1cGRhdGUgYGxhc3RFdmVudGAgZm9yIG5leHQgY2FsbFxuICAgICAgdGhpcy5sYXN0RXZlbnQgPSBldmVudDtcblxuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9XG5cbiAgICB2YXIgb25Nb3VzZVVwID0gKGUpID0+IHtcbiAgICAgIC8vIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnbW91c2V1cCcsIGUpO1xuICAgICAgZXZlbnQuZGVmaW5lQXJlYSh0aGlzLm1vdXNlRG93bkV2ZW50LCB0aGlzLmxhc3RFdmVudCk7XG5cbiAgICAgIHRoaXMuaXNNb3VzZURvd24gPSBmYWxzZTtcbiAgICAgIHRoaXMubW91c2VEb3duRXZlbnQgPSBudWxsO1xuICAgICAgdGhpcy5sYXN0RXZlbnQgPSBudWxsO1xuICAgICAgLy8gcmVtb3ZlIGxpc3RlbmVyIG9uXG4gICAgICBib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlKTtcblxuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9XG5cbiAgICB2YXIgb25DbGljayA9IChlKSA9PiB7XG4gICAgICAvLyBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgbGV0IGV2ZW50ID0gdGhpcy5fY3JlYXRlRXZlbnQoJ2NsaWNrJywgZSk7XG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH1cblxuICAgIHZhciBvbkRibENsaWNrID0gKGUpID0+IHtcbiAgICAgIC8vIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnZGJsY2xpY2snLCBlKTtcbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfVxuXG4gICAgLy8gYmluZCBjYWxsYmFja3NcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2VEb3duLCBmYWxzZSk7XG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwLCBmYWxzZSk7XG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2ssIGZhbHNlKTtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgb25EYmxDbGljaywgZmFsc2UpO1xuXG4gICAgLy8gbGV0IHN2Z3MgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ3N2ZycpO1xuICAgIC8vIGNvbnNvbGUubG9nKHN2Z3MpO1xuICAgIC8vIGZvciAobGV0IGkgPSAwLCBsID0gc3Zncy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAvLyAgIHN2Z3NbaV0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Nb3VzZURvd24sIGZhbHNlKTtcbiAgICAvLyB9XG5cbiAgICAvLyBAVE9ETzogbW91c2VlbnRlciwgbW91c2VsZWF2ZSwgd2hlZWwgP1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3VyZmFjZTtcbiJdfQ==