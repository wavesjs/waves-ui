'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

/**
 * Abstract class to extend to create new sources of interactions.
 * A `Surface` and `Keyboard` event sources are provided.
 */

var EventSource = (function (_events$EventEmitter) {
  _inherits(EventSource, _events$EventEmitter);

  function EventSource($el) {
    _classCallCheck(this, EventSource);

    _get(Object.getPrototypeOf(EventSource.prototype), 'constructor', this).call(this);
    /**
     * The element on which the listener is added
     * @type {Element}
     */
    this.$el = $el;

    this._bindEvents();
  }

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9pbnRlcmFjdGlvbnMvZXZlbnQtc291cmNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQW1CLFFBQVE7Ozs7Ozs7OztJQU9OLFdBQVc7WUFBWCxXQUFXOztBQUNuQixXQURRLFdBQVcsQ0FDbEIsR0FBRyxFQUFFOzBCQURFLFdBQVc7O0FBRTVCLCtCQUZpQixXQUFXLDZDQUVwQjs7Ozs7QUFLUixRQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQzs7QUFFZixRQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7R0FDcEI7O2VBVmtCLFdBQVc7O1dBWWxCLHNCQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRTs7O1dBRWIsdUJBQUcsRUFBRTs7O1NBZEcsV0FBVztHQUFTLG9CQUFPLFlBQVk7O3FCQUF2QyxXQUFXIiwiZmlsZSI6InNyYy9pbnRlcmFjdGlvbnMvZXZlbnQtc291cmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV2ZW50cyBmcm9tICdldmVudHMnO1xuXG5cbi8qKlxuICogQWJzdHJhY3QgY2xhc3MgdG8gZXh0ZW5kIHRvIGNyZWF0ZSBuZXcgc291cmNlcyBvZiBpbnRlcmFjdGlvbnMuXG4gKiBBIGBTdXJmYWNlYCBhbmQgYEtleWJvYXJkYCBldmVudCBzb3VyY2VzIGFyZSBwcm92aWRlZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRTb3VyY2UgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoJGVsKSB7XG4gICAgc3VwZXIoKTtcbiAgICAvKipcbiAgICAgKiBUaGUgZWxlbWVudCBvbiB3aGljaCB0aGUgbGlzdGVuZXIgaXMgYWRkZWRcbiAgICAgKiBAdHlwZSB7RWxlbWVudH1cbiAgICAgKi9cbiAgICB0aGlzLiRlbCA9ICRlbDtcblxuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcbiAgfVxuXG4gIF9jcmVhdGVFdmVudCh0eXBlLCBlKSB7fVxuXG4gIF9iaW5kRXZlbnRzKCkge31cbn1cbiJdfQ==