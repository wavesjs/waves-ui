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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Abstract class to extend to create new sources of interactions.
 * A `Surface` and `Keyboard` event sources are provided.
 */
var EventSource = function (_EventEmitter) {
  (0, _inherits3.default)(EventSource, _EventEmitter);

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
}(_events.EventEmitter);

exports.default = EventSource;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50U291cmNlLmpzIl0sIm5hbWVzIjpbIkV2ZW50U291cmNlIiwiJGVsIiwidW5iaW5kRXZlbnRzIiwidHlwZSIsImUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFHQTs7OztJQUlNQSxXOzs7QUFDSix1QkFBWUMsR0FBWixFQUFpQjtBQUFBOztBQUVmOzs7O0FBRmU7O0FBTWYsVUFBS0EsR0FBTCxHQUFXQSxHQUFYO0FBTmU7QUFPaEI7Ozs7OEJBRVM7QUFDUixXQUFLQyxZQUFMO0FBQ0Q7OztnQ0FFV0MsSSxFQUFNQyxDLEVBQUcsQ0FBRTs7O2lDQUVWLENBQUU7OzttQ0FFQSxDQUFFOzs7OztrQkFHSkosVyIsImZpbGUiOiJFdmVudFNvdXJjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cblxuLyoqXG4gKiBBYnN0cmFjdCBjbGFzcyB0byBleHRlbmQgdG8gY3JlYXRlIG5ldyBzb3VyY2VzIG9mIGludGVyYWN0aW9ucy5cbiAqIEEgYFN1cmZhY2VgIGFuZCBgS2V5Ym9hcmRgIGV2ZW50IHNvdXJjZXMgYXJlIHByb3ZpZGVkLlxuICovXG5jbGFzcyBFdmVudFNvdXJjZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKCRlbCkge1xuICAgIHN1cGVyKCk7XG4gICAgLyoqXG4gICAgICogVGhlIGVsZW1lbnQgb24gd2hpY2ggdGhlIGxpc3RlbmVyIGlzIGFkZGVkXG4gICAgICogQHR5cGUge0VsZW1lbnR9XG4gICAgICovXG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gIH1cblxuICBkZXN0cm95KCnCoHtcbiAgICB0aGlzLnVuYmluZEV2ZW50cygpO1xuICB9XG5cbiAgY3JlYXRlRXZlbnQodHlwZSwgZSkge31cblxuICBiaW5kRXZlbnRzKCkge31cblxuICB1bmJpbmRFdmVudHMoKSB7fVxufVxuXG5leHBvcnQgZGVmYXVsdCBFdmVudFNvdXJjZTtcbiJdfQ==