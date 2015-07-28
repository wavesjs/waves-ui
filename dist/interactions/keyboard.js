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
 * http://javascript.info/tutorial/keyboard-events
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
        var event = new WaveEvent(type, e);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9pbnRlcmFjdGlvbnMva2V5Ym9hcmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFBTyxXQUFXLDJCQUFNLGdCQUFnQjs7SUFDakMsU0FBUywyQkFBTSxjQUFjOztBQUdwQyxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQzs7Ozs7O0lBTWIsUUFBUTtBQUNoQixXQURRLFFBQVEsR0FDSjtRQUFYLEVBQUUsZ0NBQUcsSUFBSTs7MEJBREYsUUFBUTs7QUFFekIscUNBRmlCLFFBQVEsNkNBRW5CLElBQUksRUFBRTtHQUNiOztZQUhrQixRQUFROztlQUFSLFFBQVE7QUFLM0IsZ0JBQVk7YUFBQSxzQkFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFO0FBQ3BCLFlBQU0sS0FBSyxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFckMsYUFBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDO0FBQzVCLGFBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUMxQixhQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsYUFBSyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQzFCLGFBQUssQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTVDLGVBQU8sS0FBSyxDQUFDO09BQ2Q7O0FBRUQsZUFBVzthQUFBLHVCQUFHOzs7QUFDWixZQUFNLFNBQVMsR0FBRyxVQUFDLENBQUMsRUFBSztBQUN2QixjQUFJLEtBQUssR0FBRyxNQUFLLFlBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUMsZ0JBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUMzQixDQUFDOztBQUVGLFlBQU0sT0FBTyxHQUFHLFVBQUMsQ0FBQyxFQUFLO0FBQ3JCLGNBQUksS0FBSyxHQUFHLE1BQUssWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMxQyxnQkFBSyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzNCLENBQUM7O0FBRUYsWUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzlCLFlBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztPQUMzQjs7OztTQTlCa0IsUUFBUTtHQUFTLFdBQVc7O2lCQUE1QixRQUFRIiwiZmlsZSI6ImVzNi9pbnRlcmFjdGlvbnMva2V5Ym9hcmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXZlbnRTb3VyY2UgZnJvbSAnLi9ldmVudC1zb3VyY2UnO1xuaW1wb3J0IFdhdmVFdmVudCBmcm9tICcuL3dhdmUtZXZlbnQnO1xuXG5cbmNvbnN0IGJvZHkgPSB3aW5kb3cuZG9jdW1lbnQuYm9keTtcblxuXG4vKipcbiAqIGh0dHA6Ly9qYXZhc2NyaXB0LmluZm8vdHV0b3JpYWwva2V5Ym9hcmQtZXZlbnRzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEtleWJvYXJkIGV4dGVuZHMgRXZlbnRTb3VyY2Uge1xuICBjb25zdHJ1Y3RvcihlbCA9IGJvZHkpIHtcbiAgICBzdXBlcihib2R5KTtcbiAgfVxuXG4gIF9jcmVhdGVFdmVudCh0eXBlLCBlKSB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgV2F2ZUV2ZW50KHR5cGUsIGUpO1xuXG4gICAgZXZlbnQuc2hpZnRLZXkgPSBlLnNoaWZ0S2V5O1xuICAgIGV2ZW50LmN0cmxLZXkgPSBlLmN0cmxLZXk7XG4gICAgZXZlbnQuYWx0S2V5ID0gZS5hbHRLZXk7XG4gICAgZXZlbnQubWV0YUtleSA9IGUubWV0YUtleTtcbiAgICBldmVudC5jaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLmtleUNvZGUpO1xuXG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgX2JpbmRFdmVudHMoKSB7XG4gICAgY29uc3Qgb25LZXlEb3duID0gKGUpID0+IHtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdrZXlkb3duJywgZSk7XG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH07XG5cbiAgICBjb25zdCBvbktleVVwID0gKGUpID0+IHtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdrZXl1cCcsIGUpO1xuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgdGhpcy5lbC5vbmtleWRvd24gPSBvbktleURvd247XG4gICAgdGhpcy5lbC5vbmtleXVwID0gb25LZXlVcDtcbiAgfVxufVxuIl19