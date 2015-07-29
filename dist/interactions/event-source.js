'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

/**
 * Main interface for event source
 */

var EventSource = (function (_events$EventEmitter) {
  function EventSource(el) {
    _classCallCheck(this, EventSource);

    _get(Object.getPrototypeOf(EventSource.prototype), 'constructor', this).call(this);
    this.el = el;

    this._bindEvents();
  }

  _inherits(EventSource, _events$EventEmitter);

  _createClass(EventSource, [{
    key: '_createEvent',
    value: function _createEvent(type, e) {}
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {}
  }]);

  return EventSource;
})(_events2['default'].EventEmitter);

exports['default'] = EventSource;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixRQUFROzs7Ozs7OztJQU1OLFdBQVc7QUFDbkIsV0FEUSxXQUFXLENBQ2xCLEVBQUUsRUFBRTswQkFERyxXQUFXOztBQUU1QiwrQkFGaUIsV0FBVyw2Q0FFcEI7QUFDUixRQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQzs7QUFFYixRQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7R0FDcEI7O1lBTmtCLFdBQVc7O2VBQVgsV0FBVzs7V0FRbEIsc0JBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFOzs7V0FFYix1QkFBRyxFQUFFOzs7U0FWRyxXQUFXO0dBQVMsb0JBQU8sWUFBWTs7cUJBQXZDLFdBQVciLCJmaWxlIjoiZXM2L3V0aWxzL29ydGhvZ29uYWwtZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBldmVudHMgZnJvbSAnZXZlbnRzJztcblxuXG4vKipcbiAqIE1haW4gaW50ZXJmYWNlIGZvciBldmVudCBzb3VyY2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRTb3VyY2UgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoZWwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZWwgPSBlbDtcblxuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcbiAgfVxuXG4gIF9jcmVhdGVFdmVudCh0eXBlLCBlKSB7fVxuXG4gIF9iaW5kRXZlbnRzKCkge31cbn1cbiJdfQ==