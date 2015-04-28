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

        // @TODO: mouseenter, mouseleave, wheel ?
      }
    }
  });

  return Surface;
})(EventSource);

module.exports = Surface;
//# sourceMappingURL=data:application/json;base64,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QyxDQUFDLENBQUM7QUFDN0MsZ0JBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUMzQixDQUFBOzs7QUFHRCxZQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDMUQsWUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3RELFlBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNsRCxZQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7OztPQUd6RDs7OztTQXpIRyxPQUFPO0dBQVMsV0FBVzs7QUE0SGpDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9zaGFwZXMvcmVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEV2ZW50U291cmNlID0gcmVxdWlyZSgnLi9ldmVudC1zb3VyY2UnKTtcbmNvbnN0IEV2ZW50ICA9IHJlcXVpcmUoJy4vZXZlbnQnKTtcbmNvbnN0IGJvZHkgPSB3aW5kb3cuZG9jdW1lbnQuYm9keTtcblxuY2xhc3MgU3VyZmFjZSBleHRlbmRzIEV2ZW50U291cmNlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSBlbCA8RE9NRWxlbWVudD4gdGhlIERPTSBlbGVtZW50IHRvIG1vbml0b3JlXG4gICAqIEBwYXJhbSBwYWRkaW5nIDxPYmplY3Q+IHRoZSBwYWRkaW5nIG9mIHRoZSBjdXJyZW50IHN1cmZhY2UgQFRPRE9cbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsIC8qLCBwYWRkaW5nICovKSB7XG4gICAgc3VwZXIoZWwpO1xuXG4gICAgLy8gdGhpcy5pc01vdXNlRG93biA9IGZhbHNlO1xuICAgIHRoaXMubW91c2VEb3duRXZlbnQgPSBudWxsO1xuICAgIHRoaXMubGFzdEV2ZW50ID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiAgZmFjdG9yeSBtZXRob2QgZm9yIGBFdmVudGAgY2xhc3NcbiAgICovXG4gIF9jcmVhdGVFdmVudCh0eXBlLCBlKSB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgRXZlbnQodHlwZSwgZSk7XG5cbiAgICBjb25zdCBwb3MgPSB0aGlzLl9nZXRSZWxhdGl2ZVBvc2l0aW9uKGUpO1xuICAgIGV2ZW50LnggPSBwb3MueDtcbiAgICBldmVudC55ID0gcG9zLnk7XG5cbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtICBlIDxFdmVudD4gcmF3IGV2ZW50IGZyb20gbGlzdGVuZXJcbiAgICogQHJldHVybiA8T2JqZWN0PiB0aGUgeCwgeSBjb29yZGluYXRlcyBjb29yZGluYXRlcyByZWxhdGl2ZSB0byB0aGUgc3VyZmFjZSBlbGVtZW50XG4gICAqL1xuICBfZ2V0UmVsYXRpdmVQb3NpdGlvbihlKSB7XG4gICAgLy8gQFRPRE86IHNob3VsZCBiZSBhYmxlIHRvIGlnbm9yZSBwYWRkaW5nXG4gICAgbGV0IHggPSAwO1xuICAgIGxldCB5ID0gMDtcbiAgICBjb25zdCBjbGllbnRSZWN0ID0gdGhpcy5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBzY3JvbGxMZWZ0ID0gYm9keS5zY3JvbGxMZWZ0ICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ7XG4gICAgY29uc3Qgc2Nyb2xsVG9wICA9IGJvZHkuc2Nyb2xsVG9wICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcblxuICAgIC8vIGFkYXB0ZWQgZnJvbSBodHRwOi8vd3d3LnF1aXJrc21vZGUub3JnL2pzL2V2ZW50c19wcm9wZXJ0aWVzLmh0bWwjcG9zaXRpb25cbiAgICBpZiAoZS5wYWdlWCB8fCBlLnBhZ2VZKSB7XG4gICAgICB4ID0gZS5wYWdlWDtcbiAgICAgIHkgPSBlLnBhZ2VZO1xuICAgIH0gZWxzZSBpZiAoZS5jbGllbnRYIHx8IGUuY2xpZW50WSkge1xuICAgICAgLy8gbm9ybWFsaXplIHRvIHBhZ2VYLCBwYWdlWVxuICAgICAgeCA9IGUuY2xpZW50WCArIHNjcm9sbExlZnQ7XG4gICAgICB5ID0gZS5jbGllbnRZICsgc2Nyb2xsVG9wO1xuICAgIH1cblxuICAgIC8vIGNsaWVudFJlY3QgcmVmZXJzIHRvIHRoZSBjbGllbnQsIG5vdCB0byB0aGUgcGFnZVxuICAgIHggPSB4IC0gKGNsaWVudFJlY3QubGVmdCArIHNjcm9sbExlZnQpO1xuICAgIHkgPSB5IC0gKGNsaWVudFJlY3QudG9wICArIHNjcm9sbFRvcCApO1xuXG4gICAgLy8gc2hvdWxkIGhhbmRsZSBwYWRkaW5nXG5cbiAgICByZXR1cm4geyB4LCB5IH07XG4gIH1cblxuICAvKipcbiAgICoga2VlcCB0aGlzIHByaXZhdGUgdG8gYXZvaXIgZG91YmxlIGV2ZW50IGJpbmRpbmdcbiAgICogbWFpbiBsb2dpYyBvZiB0aGUgc3VyZmFjZSBpcyBoZXJlXG4gICAqIHNob3VsZCBiZSBleHRlbmRlZCB3aXRoIG5lZWRlZCBldmVudHNcbiAgICogQE5PVEUgc2hvdWxkIHdlIHN0b3AgdGhlIHByb3BhZ2F0aW9uIGluc2lkZSB0aGUgdGltZWxpbmUgP1xuICAgKi9cbiAgX2JpbmRFdmVudHMoKSB7XG5cbiAgICB2YXIgb25Nb3VzZURvd24gPSAoZSkgPT4ge1xuICAgICAgLy8gZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdtb3VzZWRvd24nLCBlKTtcblxuICAgICAgdGhpcy5pc01vdXNlRG93biA9IHRydWU7XG4gICAgICB0aGlzLm1vdXNlRG93bkV2ZW50ID0gZXZlbnQ7XG4gICAgICB0aGlzLmxhc3RFdmVudCA9IGV2ZW50O1xuICAgICAgLy8gcmVnaXN0ZXIgbW91c2UgbW92ZSBvbiBib2R5IC0gbW9yZSB1c2VyIGZyaWVuZGx5XG4gICAgICBib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlLCBmYWxzZSk7XG5cbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfVxuXG4gICAgdmFyIG9uTW91c2VNb3ZlID0gKGUpID0+IHtcbiAgICAgIC8vIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnbW91c2Vtb3ZlJywgZSk7XG4gICAgICBldmVudC5kZWZpbmVBcmVhKHRoaXMubW91c2VEb3duRXZlbnQsIHRoaXMubGFzdEV2ZW50KTtcbiAgICAgIC8vIHVwZGF0ZSBgbGFzdEV2ZW50YCBmb3IgbmV4dCBjYWxsXG4gICAgICB0aGlzLmxhc3RFdmVudCA9IGV2ZW50O1xuXG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH1cblxuICAgIHZhciBvbk1vdXNlVXAgPSAoZSkgPT4ge1xuICAgICAgLy8gZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdtb3VzZXVwJywgZSk7XG4gICAgICBldmVudC5kZWZpbmVBcmVhKHRoaXMubW91c2VEb3duRXZlbnQsIHRoaXMubGFzdEV2ZW50KTtcblxuICAgICAgdGhpcy5pc01vdXNlRG93biA9IGZhbHNlO1xuICAgICAgdGhpcy5tb3VzZURvd25FdmVudCA9IG51bGw7XG4gICAgICB0aGlzLmxhc3RFdmVudCA9IG51bGw7XG4gICAgICAvLyByZW1vdmUgbGlzdGVuZXIgb25cbiAgICAgIGJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUpO1xuXG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH1cblxuICAgIHZhciBvbkNsaWNrID0gKGUpID0+IHtcbiAgICAgIC8vIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnY2xpY2snLCBlKTtcbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfVxuXG4gICAgdmFyIG9uRGJsQ2xpY2sgPSAoZSkgPT4ge1xuICAgICAgLy8gZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdkYmxjbGljaycsIGUpO1xuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9XG5cbiAgICAvLyBiaW5kIGNhbGxiYWNrc1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Nb3VzZURvd24sIGZhbHNlKTtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXAsIGZhbHNlKTtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljaywgZmFsc2UpO1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBvbkRibENsaWNrLCBmYWxzZSk7XG5cbiAgICAvLyBAVE9ETzogbW91c2VlbnRlciwgbW91c2VsZWF2ZSwgd2hlZWwgP1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3VyZmFjZTtcbiJdfQ==