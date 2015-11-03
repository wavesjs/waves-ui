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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy93YXZlcy11aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUFtQixRQUFROzs7Ozs7Ozs7SUFPTixXQUFXO1lBQVgsV0FBVzs7QUFDbkIsV0FEUSxXQUFXLENBQ2xCLEdBQUcsRUFBRTswQkFERSxXQUFXOztBQUU1QiwrQkFGaUIsV0FBVyw2Q0FFcEI7Ozs7O0FBS1IsUUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7O0FBRWYsUUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0dBQ3BCOztlQVZrQixXQUFXOztXQVlsQixzQkFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7OztXQUViLHVCQUFHLEVBQUU7OztTQWRHLFdBQVc7R0FBUyxvQkFBTyxZQUFZOztxQkFBdkMsV0FBVyIsImZpbGUiOiJzcmMvd2F2ZXMtdWkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5cblxuLyoqXG4gKiBBYnN0cmFjdCBjbGFzcyB0byBleHRlbmQgdG8gY3JlYXRlIG5ldyBzb3VyY2VzIG9mIGludGVyYWN0aW9ucy5cbiAqIEEgYFN1cmZhY2VgIGFuZCBgS2V5Ym9hcmRgIGV2ZW50IHNvdXJjZXMgYXJlIHByb3ZpZGVkLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudFNvdXJjZSBleHRlbmRzIGV2ZW50cy5FdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcigkZWwpIHtcbiAgICBzdXBlcigpO1xuICAgIC8qKlxuICAgICAqIFRoZSBlbGVtZW50IG9uIHdoaWNoIHRoZSBsaXN0ZW5lciBpcyBhZGRlZFxuICAgICAqIEB0eXBlIHtFbGVtZW50fVxuICAgICAqL1xuICAgIHRoaXMuJGVsID0gJGVsO1xuXG4gICAgdGhpcy5fYmluZEV2ZW50cygpO1xuICB9XG5cbiAgX2NyZWF0ZUV2ZW50KHR5cGUsIGUpIHt9XG5cbiAgX2JpbmRFdmVudHMoKSB7fVxufVxuIl19