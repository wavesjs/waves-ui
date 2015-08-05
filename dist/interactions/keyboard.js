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

var body = window.document.body;
var singleton = null;
/**
 * http://javascript.info/tutorial/keyboard-events
 */

var Keyboard = (function (_EventSource) {
  _inherits(Keyboard, _EventSource);

  function Keyboard(el) {
    _classCallCheck(this, Keyboard);

    _get(Object.getPrototypeOf(Keyboard.prototype), 'constructor', this).call(this, el);
  }

  _createClass(Keyboard, [{
    key: '_createEvent',
    value: function _createEvent(type, e) {
      var event = new _waveEvent2['default'](type, e);

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

      this.el.onkeydown = onKeyDown;
      this.el.onkeyup = onKeyUp;
    }
  }]);

  return Keyboard;
})(_eventSource2['default']);

exports['default'] = Keyboard;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9pbnRlcmFjdGlvbnMva2V5Ym9hcmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBd0IsZ0JBQWdCOzs7O3lCQUNsQixjQUFjOzs7O0FBR3BDLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ2xDLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQzs7Ozs7SUFJRixRQUFRO1lBQVIsUUFBUTs7QUFDaEIsV0FEUSxRQUFRLENBQ2YsRUFBRSxFQUFFOzBCQURHLFFBQVE7O0FBRXpCLCtCQUZpQixRQUFRLDZDQUVuQixFQUFFLEVBQUU7R0FDWDs7ZUFIa0IsUUFBUTs7V0FLZixzQkFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFO0FBQ3BCLFVBQU0sS0FBSyxHQUFHLDJCQUFjLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFckMsV0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDO0FBQzVCLFdBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUMxQixXQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsV0FBSyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQzFCLFdBQUssQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTVDLGFBQU8sS0FBSyxDQUFDO0tBQ2Q7OztXQUVVLHVCQUFHOzs7QUFDWixVQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBSSxDQUFDLEVBQUs7QUFDdkIsWUFBSSxLQUFLLEdBQUcsTUFBSyxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVDLGNBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztPQUMzQixDQUFDOztBQUVGLFVBQU0sT0FBTyxHQUFHLFNBQVYsT0FBTyxDQUFJLENBQUMsRUFBSztBQUNyQixZQUFJLEtBQUssR0FBRyxNQUFLLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUMsY0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQzNCLENBQUM7O0FBRUYsVUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzlCLFVBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztLQUMzQjs7O1NBOUJrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiJlczYvaW50ZXJhY3Rpb25zL2tleWJvYXJkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV2ZW50U291cmNlIGZyb20gJy4vZXZlbnQtc291cmNlJztcbmltcG9ydCBXYXZlRXZlbnQgZnJvbSAnLi93YXZlLWV2ZW50JztcblxuXG5jb25zdCBib2R5ID0gd2luZG93LmRvY3VtZW50LmJvZHk7XG5jb25zdCBzaW5nbGV0b24gPSBudWxsO1xuLyoqXG4gKiBodHRwOi8vamF2YXNjcmlwdC5pbmZvL3R1dG9yaWFsL2tleWJvYXJkLWV2ZW50c1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBLZXlib2FyZCBleHRlbmRzIEV2ZW50U291cmNlIHtcbiAgY29uc3RydWN0b3IoZWwpIHtcbiAgICBzdXBlcihlbCk7XG4gIH1cblxuICBfY3JlYXRlRXZlbnQodHlwZSwgZSkge1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IFdhdmVFdmVudCh0eXBlLCBlKTtcblxuICAgIGV2ZW50LnNoaWZ0S2V5ID0gZS5zaGlmdEtleTtcbiAgICBldmVudC5jdHJsS2V5ID0gZS5jdHJsS2V5O1xuICAgIGV2ZW50LmFsdEtleSA9IGUuYWx0S2V5O1xuICAgIGV2ZW50Lm1ldGFLZXkgPSBlLm1ldGFLZXk7XG4gICAgZXZlbnQuY2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS5rZXlDb2RlKTtcblxuICAgIHJldHVybiBldmVudDtcbiAgfVxuXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIGNvbnN0IG9uS2V5RG93biA9IChlKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgna2V5ZG93bicsIGUpO1xuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25LZXlVcCA9IChlKSA9PiB7XG4gICAgICBsZXQgZXZlbnQgPSB0aGlzLl9jcmVhdGVFdmVudCgna2V5dXAnLCBlKTtcbiAgICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gICAgfTtcblxuICAgIHRoaXMuZWwub25rZXlkb3duID0gb25LZXlEb3duO1xuICAgIHRoaXMuZWwub25rZXl1cCA9IG9uS2V5VXA7XG4gIH1cbn1cbiJdfQ==