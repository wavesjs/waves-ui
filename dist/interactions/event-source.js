'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Abstract class to extend to create new sources of interactions.
 * A `Surface` and `Keyboard` event sources are provided.
 */
var EventSource = function (_events$EventEmitter) {
  (0, _inherits3.default)(EventSource, _events$EventEmitter);

  function EventSource($el) {
    (0, _classCallCheck3.default)(this, EventSource);

    /**
     * The element on which the listener is added
     * @type {Element}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (EventSource.__proto__ || (0, _getPrototypeOf2.default)(EventSource)).call(this));

    _this.$el = $el;
    return _this;
  }

  (0, _createClass3.default)(EventSource, [{
    key: 'destroy',
    value: function destroy() {
      this.unbindEvents();
    }
  }, {
    key: 'createEvent',
    value: function createEvent(type, e) {}
  }, {
    key: 'bindEvents',
    value: function bindEvents() {}
  }, {
    key: 'unbindEvents',
    value: function unbindEvents() {}
  }]);
  return EventSource;
}(_events2.default.EventEmitter);

exports.default = EventSource;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50LXNvdXJjZS5qcyJdLCJuYW1lcyI6WyJFdmVudFNvdXJjZSIsIiRlbCIsInVuYmluZEV2ZW50cyIsInR5cGUiLCJlIiwiRXZlbnRFbWl0dGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFHQTs7OztJQUlxQkEsVzs7O0FBQ25CLHVCQUFZQyxHQUFaLEVBQWlCO0FBQUE7O0FBRWY7Ozs7QUFGZTs7QUFNZixVQUFLQSxHQUFMLEdBQVdBLEdBQVg7QUFOZTtBQU9oQjs7Ozs4QkFFUztBQUNSLFdBQUtDLFlBQUw7QUFDRDs7O2dDQUVXQyxJLEVBQU1DLEMsRUFBRyxDQUFFOzs7aUNBRVYsQ0FBRTs7O21DQUVBLENBQUU7OztFQWxCc0IsaUJBQU9DLFk7O2tCQUEzQkwsVyIsImZpbGUiOiJldmVudC1zb3VyY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5cblxuLyoqXG4gKiBBYnN0cmFjdCBjbGFzcyB0byBleHRlbmQgdG8gY3JlYXRlIG5ldyBzb3VyY2VzIG9mIGludGVyYWN0aW9ucy5cbiAqIEEgYFN1cmZhY2VgIGFuZCBgS2V5Ym9hcmRgIGV2ZW50IHNvdXJjZXMgYXJlIHByb3ZpZGVkLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudFNvdXJjZSBleHRlbmRzIGV2ZW50cy5FdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcigkZWwpIHtcbiAgICBzdXBlcigpO1xuICAgIC8qKlxuICAgICAqIFRoZSBlbGVtZW50IG9uIHdoaWNoIHRoZSBsaXN0ZW5lciBpcyBhZGRlZFxuICAgICAqIEB0eXBlIHtFbGVtZW50fVxuICAgICAqL1xuICAgIHRoaXMuJGVsID0gJGVsO1xuICB9XG5cbiAgZGVzdHJveSgpwqB7XG4gICAgdGhpcy51bmJpbmRFdmVudHMoKTtcbiAgfVxuXG4gIGNyZWF0ZUV2ZW50KHR5cGUsIGUpIHt9XG5cbiAgYmluZEV2ZW50cygpIHt9XG5cbiAgdW5iaW5kRXZlbnRzKCkge31cbn1cbiJdfQ==