"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

/**
 *  main interface for event source
 */
var events = require("events");

var EventSource = (function (_events$EventEmitter) {
  function EventSource(el) {
    _classCallCheck(this, EventSource);

    _get(_core.Object.getPrototypeOf(EventSource.prototype), "constructor", this).call(this);
    this.el = el;

    this._bindEvents();
  }

  _inherits(EventSource, _events$EventEmitter);

  _createClass(EventSource, {
    _createEvent: {
      value: function _createEvent(type, e) {}
    },
    _bindEvents: {
      value: function _bindEvents() {}
    }
  });

  return EventSource;
})(events.EventEmitter);

module.exports = EventSource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvcmVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFHQSxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0lBRTNCLFdBQVc7QUFDSixXQURQLFdBQVcsQ0FDSCxFQUFFLEVBQUU7MEJBRFosV0FBVzs7QUFFYixxQ0FGRSxXQUFXLDZDQUVMO0FBQ1IsUUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7O0FBRWIsUUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFBO0dBQ25COztZQU5HLFdBQVc7O2VBQVgsV0FBVztBQVFmLGdCQUFZO2FBQUEsc0JBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFOztBQUV4QixlQUFXO2FBQUEsdUJBQUcsRUFBRTs7OztTQVZaLFdBQVc7R0FBUyxNQUFNLENBQUMsWUFBWTs7QUFhN0MsTUFBTSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMiLCJmaWxlIjoiZXM2L3NoYXBlcy9yZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiAgbWFpbiBpbnRlcmZhY2UgZm9yIGV2ZW50IHNvdXJjZVxuICovXG5jb25zdCBldmVudHMgPSByZXF1aXJlKCdldmVudHMnKTtcblxuY2xhc3MgRXZlbnRTb3VyY2UgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoZWwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZWwgPSBlbDtcblxuICAgIHRoaXMuX2JpbmRFdmVudHMoKVxuICB9XG5cbiAgX2NyZWF0ZUV2ZW50KHR5cGUsIGUpIHt9XG5cbiAgX2JpbmRFdmVudHMoKSB7fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50U291cmNlO1xuIl19