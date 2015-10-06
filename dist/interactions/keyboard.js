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

var Keyboard = (function (_EventSource) {
  _inherits(Keyboard, _EventSource);

  function Keyboard(el) {
    _classCallCheck(this, Keyboard);

    // kind of singleton
    if (Keyboard._instance) {
      return Keyboard._instance;
    }

    _get(Object.getPrototypeOf(Keyboard.prototype), 'constructor', this).call(this, el);
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

      this.el.addEventListener('keydown', onKeyDown, false);
      this.el.addEventListener('keyup', onKeyUp, false);
    }
  }]);

  return Keyboard;
})(_eventSource2['default']);

exports['default'] = Keyboard;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9pbnRlcmFjdGlvbnMva2V5Ym9hcmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBd0IsZ0JBQWdCOzs7O3lCQUNsQixjQUFjOzs7O0lBR2YsUUFBUTtZQUFSLFFBQVE7O0FBQ2hCLFdBRFEsUUFBUSxDQUNmLEVBQUUsRUFBRTswQkFERyxRQUFROzs7QUFHekIsUUFBSSxRQUFRLENBQUMsU0FBUyxFQUFFO0FBQUUsYUFBTyxRQUFRLENBQUMsU0FBUyxDQUFDO0tBQUU7O0FBRXRELCtCQUxpQixRQUFRLDZDQUtuQixFQUFFLEVBQUU7QUFDVixRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQzs7QUFFN0IsWUFBUSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7R0FDM0I7O2VBVGtCLFFBQVE7O1dBV2Ysc0JBQUMsSUFBSSxFQUFFLENBQUMsRUFBRTtBQUNwQixVQUFNLEtBQUssR0FBRywyQkFBYyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFdEQsV0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDO0FBQzVCLFdBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUMxQixXQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsV0FBSyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQzFCLFdBQUssQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTVDLGFBQU8sS0FBSyxDQUFDO0tBQ2Q7OztXQUVVLHVCQUFHOzs7QUFDWixVQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBSSxDQUFDLEVBQUs7QUFDdkIsWUFBSSxLQUFLLEdBQUcsTUFBSyxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVDLGNBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztPQUMzQixDQUFDOztBQUVGLFVBQU0sT0FBTyxHQUFHLFNBQVYsT0FBTyxDQUFJLENBQUMsRUFBSztBQUNyQixZQUFJLEtBQUssR0FBRyxNQUFLLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUMsY0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQzNCLENBQUM7O0FBRUYsVUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3RELFVBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNuRDs7O1NBcENrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiJlczYvaW50ZXJhY3Rpb25zL2tleWJvYXJkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV2ZW50U291cmNlIGZyb20gJy4vZXZlbnQtc291cmNlJztcbmltcG9ydCBXYXZlRXZlbnQgZnJvbSAnLi93YXZlLWV2ZW50JztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBLZXlib2FyZCBleHRlbmRzIEV2ZW50U291cmNlIHtcbiAgY29uc3RydWN0b3IoZWwpIHtcbiAgICAvLyBraW5kIG9mIHNpbmdsZXRvblxuICAgIGlmIChLZXlib2FyZC5faW5zdGFuY2UpIHsgcmV0dXJuIEtleWJvYXJkLl9pbnN0YW5jZTsgfVxuXG4gICAgc3VwZXIoZWwpO1xuICAgIHRoaXMuc291cmNlTmFtZSA9ICdrZXlib2FyZCc7XG5cbiAgICBLZXlib2FyZC5faW5zdGFuY2UgPSB0aGlzO1xuICB9XG5cbiAgX2NyZWF0ZUV2ZW50KHR5cGUsIGUpIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBXYXZlRXZlbnQodGhpcy5zb3VyY2VOYW1lLCB0eXBlLCBlKTtcblxuICAgIGV2ZW50LnNoaWZ0S2V5ID0gZS5zaGlmdEtleTtcbiAgICBldmVudC5jdHJsS2V5ID0gZS5jdHJsS2V5O1xuICAgIGV2ZW50LmFsdEtleSA9IGUuYWx0S2V5O1xuICAgIGV2ZW50Lm1ldGFLZXkgPSBlLm1ldGFLZXk7XG4gICAgZXZlbnQuY2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS5rZXlDb2RlKTtcblxuICAgIHJldHVybiBldmVudDtcbiAgfVxuXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIGNvbnN0IG9uS2V5RG93biA9IChlKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgna2V5ZG93bicsIGUpO1xuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25LZXlVcCA9IChlKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgna2V5dXAnLCBlKTtcbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfTtcblxuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5RG93biwgZmFsc2UpO1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBvbktleVVwLCBmYWxzZSk7XG4gIH1cbn1cbiJdfQ==