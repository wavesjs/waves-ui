/**
 *  main interface for event source
 */
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUdBLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7SUFFM0IsV0FBVztBQUNKLFdBRFAsV0FBVyxDQUNILEVBQUUsRUFBRTswQkFEWixXQUFXOztBQUViLHFDQUZFLFdBQVcsNkNBRUw7QUFDUixRQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQzs7QUFFYixRQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7R0FDbkI7O1lBTkcsV0FBVzs7ZUFBWCxXQUFXO0FBUWYsZ0JBQVk7YUFBQSxzQkFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O0FBRXhCLGVBQVc7YUFBQSx1QkFBRyxFQUFFOzs7O1NBVlosV0FBVztHQUFTLE1BQU0sQ0FBQyxZQUFZOztBQWE3QyxNQUFNLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyIsImZpbGUiOiJlczYvdGltZWxpbmUtc3RhdGVzL3NlbGVjdGlvbi1zdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogIG1haW4gaW50ZXJmYWNlIGZvciBldmVudCBzb3VyY2VcbiAqL1xuY29uc3QgZXZlbnRzID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5cbmNsYXNzIEV2ZW50U291cmNlIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKGVsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmVsID0gZWw7XG5cbiAgICB0aGlzLl9iaW5kRXZlbnRzKClcbiAgfVxuXG4gIF9jcmVhdGVFdmVudCh0eXBlLCBlKSB7fVxuXG4gIF9iaW5kRXZlbnRzKCkge31cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudFNvdXJjZTtcbiJdfQ==