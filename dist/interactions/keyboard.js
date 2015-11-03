'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _eventSource = require('./event-source');

var _eventSource2 = _interopRequireDefault(_eventSource);

var _waveEvent = require('./wave-event');

var _waveEvent2 = _interopRequireDefault(_waveEvent);

/**
 * A global event sourve for the keyboard. Only one instance of this source
 * can be created. The first created timeline instanciate the singleton, each
 * subsequent instanciation returns the first created instance.
 */

var Keyboard = (function (_EventSource) {
  _inherits(Keyboard, _EventSource);

  /**
   * @param {Element} $el - The element on which to install the listener.
   */

  function Keyboard($el) {
    _classCallCheck(this, Keyboard);

    // kind of singleton
    if (Keyboard._instance) {
      return Keyboard._instance;
    }

    _get(Object.getPrototypeOf(Keyboard.prototype), 'constructor', this).call(this, $el);
    /**
     * The name of the source
     * @type {String}
     */
    this.sourceName = 'keyboard';

    Keyboard._instance = this;
  }

  _createClass(Keyboard, [{
    key: '_createEvent',
    value: function _createEvent(type, e) {
      var event = new _waveEvent2['default'](this.sourceName, type, e);

      event.shiftKey = e.shiftKey;
      event.ctrlKey = e.ctrlKey;
      event.altKey = e.altKey;
      event.metaKey = e.metaKey;
      event.char = String.fromCharCode(e.keyCode);

      return event;
    }
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this = this;

      var onKeyDown = function onKeyDown(e) {
        var event = _this._createEvent('keydown', e);
        _this.emit('event', event);
      };

      var onKeyUp = function onKeyUp(e) {
        var event = _this._createEvent('keyup', e);
        _this.emit('event', event);
      };

      this.$el.addEventListener('keydown', onKeyDown, false);
      this.$el.addEventListener('keyup', onKeyUp, false);
    }
  }]);

  return Keyboard;
})(_eventSource2['default']);

exports['default'] = Keyboard;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy93YXZlcy11aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzJCQUF3QixnQkFBZ0I7Ozs7eUJBQ2xCLGNBQWM7Ozs7Ozs7Ozs7SUFRZixRQUFRO1lBQVIsUUFBUTs7Ozs7O0FBSWhCLFdBSlEsUUFBUSxDQUlmLEdBQUcsRUFBRTswQkFKRSxRQUFROzs7QUFNekIsUUFBSSxRQUFRLENBQUMsU0FBUyxFQUFFO0FBQUUsYUFBTyxRQUFRLENBQUMsU0FBUyxDQUFDO0tBQUU7O0FBRXRELCtCQVJpQixRQUFRLDZDQVFuQixHQUFHLEVBQUU7Ozs7O0FBS1gsUUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7O0FBRTdCLFlBQVEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0dBQzNCOztlQWhCa0IsUUFBUTs7V0FrQmYsc0JBQUMsSUFBSSxFQUFFLENBQUMsRUFBRTtBQUNwQixVQUFNLEtBQUssR0FBRywyQkFBYyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFdEQsV0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDO0FBQzVCLFdBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUMxQixXQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsV0FBSyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQzFCLFdBQUssQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTVDLGFBQU8sS0FBSyxDQUFDO0tBQ2Q7OztXQUVVLHVCQUFHOzs7QUFDWixVQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBSSxDQUFDLEVBQUs7QUFDdkIsWUFBSSxLQUFLLEdBQUcsTUFBSyxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVDLGNBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztPQUMzQixDQUFDOztBQUVGLFVBQU0sT0FBTyxHQUFHLFNBQVYsT0FBTyxDQUFJLENBQUMsRUFBSztBQUNyQixZQUFJLEtBQUssR0FBRyxNQUFLLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUMsY0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQzNCLENBQUM7O0FBRUYsVUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3ZELFVBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNwRDs7O1NBM0NrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiJzcmMvd2F2ZXMtdWkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXZlbnRTb3VyY2UgZnJvbSAnLi9ldmVudC1zb3VyY2UnO1xuaW1wb3J0IFdhdmVFdmVudCBmcm9tICcuL3dhdmUtZXZlbnQnO1xuXG5cbi8qKlxuICogQSBnbG9iYWwgZXZlbnQgc291cnZlIGZvciB0aGUga2V5Ym9hcmQuIE9ubHkgb25lIGluc3RhbmNlIG9mIHRoaXMgc291cmNlXG4gKiBjYW4gYmUgY3JlYXRlZC4gVGhlIGZpcnN0IGNyZWF0ZWQgdGltZWxpbmUgaW5zdGFuY2lhdGUgdGhlIHNpbmdsZXRvbiwgZWFjaFxuICogc3Vic2VxdWVudCBpbnN0YW5jaWF0aW9uIHJldHVybnMgdGhlIGZpcnN0IGNyZWF0ZWQgaW5zdGFuY2UuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEtleWJvYXJkIGV4dGVuZHMgRXZlbnRTb3VyY2Uge1xuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkZWwgLSBUaGUgZWxlbWVudCBvbiB3aGljaCB0byBpbnN0YWxsIHRoZSBsaXN0ZW5lci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCRlbCkge1xuICAgIC8vIGtpbmQgb2Ygc2luZ2xldG9uXG4gICAgaWYgKEtleWJvYXJkLl9pbnN0YW5jZSkgeyByZXR1cm4gS2V5Ym9hcmQuX2luc3RhbmNlOyB9XG5cbiAgICBzdXBlcigkZWwpO1xuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBzb3VyY2VcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuc291cmNlTmFtZSA9ICdrZXlib2FyZCc7XG5cbiAgICBLZXlib2FyZC5faW5zdGFuY2UgPSB0aGlzO1xuICB9XG5cbiAgX2NyZWF0ZUV2ZW50KHR5cGUsIGUpIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBXYXZlRXZlbnQodGhpcy5zb3VyY2VOYW1lLCB0eXBlLCBlKTtcblxuICAgIGV2ZW50LnNoaWZ0S2V5ID0gZS5zaGlmdEtleTtcbiAgICBldmVudC5jdHJsS2V5ID0gZS5jdHJsS2V5O1xuICAgIGV2ZW50LmFsdEtleSA9IGUuYWx0S2V5O1xuICAgIGV2ZW50Lm1ldGFLZXkgPSBlLm1ldGFLZXk7XG4gICAgZXZlbnQuY2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS5rZXlDb2RlKTtcblxuICAgIHJldHVybiBldmVudDtcbiAgfVxuXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIGNvbnN0IG9uS2V5RG93biA9IChlKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgna2V5ZG93bicsIGUpO1xuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25LZXlVcCA9IChlKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgna2V5dXAnLCBlKTtcbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfTtcblxuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleURvd24sIGZhbHNlKTtcbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIG9uS2V5VXAsIGZhbHNlKTtcbiAgfVxufVxuIl19