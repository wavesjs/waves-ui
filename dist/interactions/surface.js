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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9pbnRlcmFjdGlvbnMvc3VyZmFjZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM5QyxJQUFNLFNBQVMsR0FBSSxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDM0MsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7O0lBRTVCLE9BQU87Ozs7OztBQUtBLFdBTFAsT0FBTyxDQUtDLEVBQUUsaUJBQWlCOzBCQUwzQixPQUFPOztBQU1ULHFDQU5FLE9BQU8sNkNBTUgsRUFBRSxFQUFFOzs7QUFHVixRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztBQUMzQixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztHQUN2Qjs7WUFYRyxPQUFPOztlQUFQLE9BQU87QUFnQlgsZ0JBQVk7Ozs7OzthQUFBLHNCQUFDLElBQUksRUFBRSxDQUFDLEVBQUU7QUFDcEIsWUFBTSxLQUFLLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVyQyxZQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekMsYUFBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2hCLGFBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFaEIsZUFBTyxLQUFLLENBQUM7T0FDZDs7QUFNRCx3QkFBb0I7Ozs7Ozs7YUFBQSw4QkFBQyxDQUFDLEVBQUU7O0FBRXRCLFlBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLFlBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLFlBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUNuRCxZQUFNLFVBQVUsR0FBRyxJQUFJ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QVUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3QyxnQkFBSyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzNCLENBQUM7OztBQUdGLFlBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxRCxZQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDdEQsWUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2xELFlBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQzs7Ozs7Ozs7O09BU3pEOzs7O1NBaklHLE9BQU87R0FBUyxXQUFXOztBQW9JakMsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiZXM2L2ludGVyYWN0aW9ucy9zdXJmYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgRXZlbnRTb3VyY2UgPSByZXF1aXJlKCcuL2V2ZW50LXNvdXJjZScpO1xuY29uc3QgV2F2ZUV2ZW50ICA9IHJlcXVpcmUoJy4vd2F2ZS1ldmVudCcpO1xuY29uc3QgYm9keSA9IHdpbmRvdy5kb2N1bWVudC5ib2R5O1xuXG5jbGFzcyBTdXJmYWNlIGV4dGVuZHMgRXZlbnRTb3VyY2Uge1xuICAvKipcbiAgICogQHBhcmFtIGVsIDxET01FbGVtZW50PiB0aGUgRE9NIGVsZW1lbnQgdG8gbW9uaXRvcmVcbiAgICogQHBhcmFtIHBhZGRpbmcgPE9iamVjdD4gdGhlIHBhZGRpbmcgb2YgdGhlIGN1cnJlbnQgc3VyZmFjZSBAVE9ET1xuICAgKi9cbiAgY29uc3RydWN0b3IoZWwgLyosIHBhZGRpbmcgKi8pIHtcbiAgICBzdXBlcihlbCk7XG5cbiAgICAvLyB0aGlzLmlzTW91c2VEb3duID0gZmFsc2U7XG4gICAgdGhpcy5tb3VzZURvd25FdmVudCA9IG51bGw7XG4gICAgdGhpcy5sYXN0RXZlbnQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqICBmYWN0b3J5IG1ldGhvZCBmb3IgYEV2ZW50YCBjbGFzc1xuICAgKi9cbiAgX2NyZWF0ZUV2ZW50KHR5cGUsIGUpIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBXYXZlRXZlbnQodHlwZSwgZSk7XG5cbiAgICBjb25zdCBwb3MgPSB0aGlzLl9nZXRSZWxhdGl2ZVBvc2l0aW9uKGUpO1xuICAgIGV2ZW50LnggPSBwb3MueDtcbiAgICBldmVudC55ID0gcG9zLnk7XG5cbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtICBlIDxFdmVudD4gcmF3IGV2ZW50IGZyb20gbGlzdGVuZXJcbiAgICogQHJldHVybiA8T2JqZWN0PiB0aGUgeCwgeSBjb29yZGluYXRlcyBjb29yZGluYXRlcyByZWxhdGl2ZSB0byB0aGUgc3VyZmFjZSBlbGVtZW50XG4gICAqL1xuICBfZ2V0UmVsYXRpdmVQb3NpdGlvbihlKSB7XG4gICAgLy8gQFRPRE86IHNob3VsZCBiZSBhYmxlIHRvIGlnbm9yZSBwYWRkaW5nXG4gICAgbGV0IHggPSAwO1xuICAgIGxldCB5ID0gMDtcbiAgICBjb25zdCBjbGllbnRSZWN0ID0gdGhpcy5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBzY3JvbGxMZWZ0ID0gYm9keS5zY3JvbGxMZWZ0ICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ7XG4gICAgY29uc3Qgc2Nyb2xsVG9wICA9IGJvZHkuc2Nyb2xsVG9wICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcblxuICAgIC8vIGFkYXB0ZWQgZnJvbSBodHRwOi8vd3d3LnF1aXJrc21vZGUub3JnL2pzL2V2ZW50c19wcm9wZXJ0aWVzLmh0bWwjcG9zaXRpb25cbiAgICBpZiAoZS5wYWdlWCB8fCBlLnBhZ2VZKSB7XG4gICAgICB4ID0gZS5wYWdlWDtcbiAgICAgIHkgPSBlLnBhZ2VZO1xuICAgIH0gZWxzZSBpZiAoZS5jbGllbnRYIHx8IGUuY2xpZW50WSkge1xuICAgICAgLy8gbm9ybWFsaXplIHRvIHBhZ2VYLCBwYWdlWVxuICAgICAgeCA9IGUuY2xpZW50WCArIHNjcm9sbExlZnQ7XG4gICAgICB5ID0gZS5jbGllbnRZICsgc2Nyb2xsVG9wO1xuICAgIH1cblxuICAgIC8vIGNsaWVudFJlY3QgcmVmZXJzIHRvIHRoZSBjbGllbnQsIG5vdCB0byB0aGUgcGFnZVxuICAgIHggPSB4IC0gKGNsaWVudFJlY3QubGVmdCArIHNjcm9sbExlZnQpO1xuICAgIHkgPSB5IC0gKGNsaWVudFJlY3QudG9wICArIHNjcm9sbFRvcCApO1xuXG4gICAgLy8gc2hvdWxkIGhhbmRsZSBwYWRkaW5nXG5cbiAgICByZXR1cm4geyB4LCB5IH07XG4gIH1cblxuICAvKipcbiAgICoga2VlcCB0aGlzIHByaXZhdGUgdG8gYXZvaXIgZG91YmxlIGV2ZW50IGJpbmRpbmdcbiAgICogbWFpbiBsb2dpYyBvZiB0aGUgc3VyZmFjZSBpcyBoZXJlXG4gICAqIHNob3VsZCBiZSBleHRlbmRlZCB3aXRoIG5lZWRlZCBldmVudHNcbiAgICogQE5PVEUgc2hvdWxkIHdlIHN0b3AgdGhlIHByb3BhZ2F0aW9uIGluc2lkZSB0aGUgdGltZWxpbmUgP1xuICAgKi9cbiAgX2JpbmRFdmVudHMoKSB7XG5cbiAgICAvLyBATk9URSBhZGQgbW91c2V1cCBvbiBib2R5IHRvb1xuICAgIHZhciBvbk1vdXNlRG93biA9IChlKSA9PiB7XG4gICAgICAvLyBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgbGV0IGV2ZW50ID0gdGhpcy5fY3JlYXRlRXZlbnQoJ21vdXNlZG93bicsIGUpO1xuXG4gICAgICB0aGlzLmlzTW91c2VEb3duID0gdHJ1ZTtcbiAgICAgIHRoaXMubW91c2VEb3duRXZlbnQgPSBldmVudDtcbiAgICAgIHRoaXMubGFzdEV2ZW50ID0gZXZlbnQ7XG4gICAgICAvLyByZWdpc3RlciBtb3VzZSBtb3ZlIG9uIGJvZHkgLSBtb3JlIHVzZXIgZnJpZW5kbHlcbiAgICAgIGJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUsIGZhbHNlKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGV2ZW50KTtcblxuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgdmFyIG9uTW91c2VNb3ZlID0gKGUpID0+IHtcbiAgICAgIC8vIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnbW91c2Vtb3ZlJywgZSk7XG4gICAgICBldmVudC5kZWZpbmVBcmVhKHRoaXMubW91c2VEb3duRXZlbnQsIHRoaXMubGFzdEV2ZW50KTtcbiAgICAgIC8vIHVwZGF0ZSBgbGFzdEV2ZW50YCBmb3IgbmV4dCBjYWxsXG4gICAgICB0aGlzLmxhc3RFdmVudCA9IGV2ZW50O1xuXG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH07XG5cbiAgICB2YXIgb25Nb3VzZVVwID0gKGUpID0+IHtcbiAgICAgIC8vIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgnbW91c2V1cCcsIGUpO1xuICAgICAgZXZlbnQuZGVmaW5lQXJlYSh0aGlzLm1vdXNlRG93bkV2ZW50LCB0aGlzLmxhc3RFdmVudCk7XG5cbiAgICAgIHRoaXMuaXNNb3VzZURvd24gPSBmYWxzZTtcbiAgICAgIHRoaXMubW91c2VEb3duRXZlbnQgPSBudWxsO1xuICAgICAgdGhpcy5sYXN0RXZlbnQgPSBudWxsO1xuICAgICAgLy8gcmVtb3ZlIGxpc3RlbmVyIG9uXG4gICAgICBib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlKTtcblxuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgdmFyIG9uQ2xpY2sgPSAoZSkgPT4ge1xuICAgICAgLy8gZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdjbGljaycsIGUpO1xuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgdmFyIG9uRGJsQ2xpY2sgPSAoZSkgPT4ge1xuICAgICAgLy8gZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdkYmxjbGljaycsIGUpO1xuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgLy8gYmluZCBjYWxsYmFja3NcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2VEb3duLCBmYWxzZSk7XG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwLCBmYWxzZSk7XG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2ssIGZhbHNlKTtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgb25EYmxDbGljaywgZmFsc2UpO1xuXG4gICAgLy8gbGV0IHN2Z3MgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ3N2ZycpO1xuICAgIC8vIGNvbnNvbGUubG9nKHN2Z3MpO1xuICAgIC8vIGZvciAobGV0IGkgPSAwLCBsID0gc3Zncy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAvLyAgIHN2Z3NbaV0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Nb3VzZURvd24sIGZhbHNlKTtcbiAgICAvLyB9XG5cbiAgICAvLyBAVE9ETzogbW91c2VlbnRlciwgbW91c2VsZWF2ZSwgd2hlZWwgP1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3VyZmFjZTtcbiJdfQ==