"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var EventSource = require("./event-source");
var Event = require("./event");
var body = window.document.body;

/**
 *  http://javascript.info/tutorial/keyboard-events
 */

var Keyboard = (function (_EventSource) {
  function Keyboard() {
    var el = arguments[0] === undefined ? body : arguments[0];

    _classCallCheck(this, Keyboard);

    _get(_core.Object.getPrototypeOf(Keyboard.prototype), "constructor", this).call(this, body);
  }

  _inherits(Keyboard, _EventSource);

  _createClass(Keyboard, {
    _createEvent: {
      value: function _createEvent(type, e) {
        var event = new Event(type, e);

        event.shiftKey = e.shiftKey;
        event.ctrlKey = e.ctrlKey;
        event.altKey = e.altKey;
        event.metaKey = e.metaKey;
        event.char = String.fromCharCode(e.keyCode);

        return event;
      }
    },
    _bindEvents: {
      value: function _bindEvents() {
        var _this = this;

        var onKeyDown = function (e) {
          var event = _this._createEvent("keydown", e);
          _this.emit("event", event);
        };

        var onKeyUp = function (e) {
          var event = _this._createEvent("keyup", e);
          _this.emit("event", event);
        };

        this.el.onkeydown = onKeyDown;
        this.el.onkeyup = onKeyUp;
      }
    }
  });

  return Keyboard;
})(EventSource);

module.exports = Keyboard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvcmVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM5QyxJQUFNLEtBQUssR0FBSSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbEMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7Ozs7OztJQU01QixRQUFRO0FBQ0QsV0FEUCxRQUFRLEdBQ1c7UUFBWCxFQUFFLGdDQUFHLElBQUk7OzBCQURqQixRQUFROztBQUVWLHFDQUZFLFFBQVEsNkNBRUosSUFBSSxFQUFFO0dBQ2I7O1lBSEcsUUFBUTs7ZUFBUixRQUFRO0FBS1osZ0JBQVk7YUFBQSxzQkFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFO0FBQ3BCLFlBQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFakMsYUFBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDO0FBQzVCLGFBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUMxQixhQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsYUFBSyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQzFCLGFBQUssQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTVDLGVBQU8sS0FBSyxDQUFDO09BQ2Q7O0FBRUQsZUFBVzthQUFBLHVCQUFHOzs7QUFDWixZQUFNLFNBQVMsR0FBRyxVQUFDLENBQUMsRUFBSztBQUN2QixjQUFJLEtBQUssR0FBRyxNQUFLLFlBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUMsZ0JBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUMzQixDQUFBOztBQUVELFlBQU0sT0FBTyxHQUFHLFVBQUMsQ0FBQyxFQUFLO0FBQ3JCLGNBQUksS0FBSyxHQUFHLE1BQUssWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMxQyxnQkFBSyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzNCLENBQUE7O0FBRUQsWUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzlCLFlBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztPQUMzQjs7OztTQTlCRyxRQUFRO0dBQVMsV0FBVzs7QUFpQ2xDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDIiwiZmlsZSI6ImVzNi9zaGFwZXMvcmVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEV2ZW50U291cmNlID0gcmVxdWlyZSgnLi9ldmVudC1zb3VyY2UnKTtcbmNvbnN0IEV2ZW50ICA9IHJlcXVpcmUoJy4vZXZlbnQnKTtcbmNvbnN0IGJvZHkgPSB3aW5kb3cuZG9jdW1lbnQuYm9keTtcblxuXG4vKipcbiAqICBodHRwOi8vamF2YXNjcmlwdC5pbmZvL3R1dG9yaWFsL2tleWJvYXJkLWV2ZW50c1xuICovXG5jbGFzcyBLZXlib2FyZCBleHRlbmRzIEV2ZW50U291cmNlIHtcbiAgY29uc3RydWN0b3IoZWwgPSBib2R5KSB7XG4gICAgc3VwZXIoYm9keSk7XG4gIH1cblxuICBfY3JlYXRlRXZlbnQodHlwZSwgZSkge1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEV2ZW50KHR5cGUsIGUpO1xuXG4gICAgZXZlbnQuc2hpZnRLZXkgPSBlLnNoaWZ0S2V5O1xuICAgIGV2ZW50LmN0cmxLZXkgPSBlLmN0cmxLZXk7XG4gICAgZXZlbnQuYWx0S2V5ID0gZS5hbHRLZXk7XG4gICAgZXZlbnQubWV0YUtleSA9IGUubWV0YUtleTtcbiAgICBldmVudC5jaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLmtleUNvZGUpO1xuXG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgX2JpbmRFdmVudHMoKSB7XG4gICAgY29uc3Qgb25LZXlEb3duID0gKGUpID0+IHtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdrZXlkb3duJywgZSk7XG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH1cblxuICAgIGNvbnN0IG9uS2V5VXAgPSAoZSkgPT4ge1xuICAgICAgbGV0IGV2ZW50ID0gdGhpcy5fY3JlYXRlRXZlbnQoJ2tleXVwJywgZSk7XG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH1cblxuICAgIHRoaXMuZWwub25rZXlkb3duID0gb25LZXlEb3duO1xuICAgIHRoaXMuZWwub25rZXl1cCA9IG9uS2V5VXA7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBLZXlib2FyZDsiXX0=