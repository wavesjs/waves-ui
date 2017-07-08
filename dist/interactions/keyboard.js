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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9pbnRlcmFjdGlvbnMva2V5Ym9hcmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBd0IsZ0JBQWdCOzs7O3lCQUNsQixjQUFjOzs7Ozs7Ozs7O0lBUWYsUUFBUTtZQUFSLFFBQVE7Ozs7OztBQUloQixXQUpRLFFBQVEsQ0FJZixHQUFHLEVBQUU7MEJBSkUsUUFBUTs7O0FBTXpCLFFBQUksUUFBUSxDQUFDLFNBQVMsRUFBRTtBQUFFLGFBQU8sUUFBUSxDQUFDLFNBQVMsQ0FBQztLQUFFOztBQUV0RCwrQkFSaUIsUUFBUSw2Q0FRbkIsR0FBRyxFQUFFOzs7OztBQUtYLFFBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDOztBQUU3QixZQUFRLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztHQUMzQjs7ZUFoQmtCLFFBQVE7O1dBa0JmLHNCQUFDLElBQUksRUFBRSxDQUFDLEVBQUU7QUFDcEIsVUFBTSxLQUFLLEdBQUcsMkJBQWMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRXRELFdBQUssQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztBQUM1QixXQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDMUIsV0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3hCLFdBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUMxQixXQUFLLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU1QyxhQUFPLEtBQUssQ0FBQztLQUNkOzs7V0FFVSx1QkFBRzs7O0FBQ1osVUFBTSxTQUFTLEdBQUcsU0FBWixTQUFTLENBQUksQ0FBQyxFQUFLO0FBQ3ZCLFlBQUksS0FBSyxHQUFHLE1BQUssWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QyxjQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7T0FDM0IsQ0FBQzs7QUFFRixVQUFNLE9BQU8sR0FBRyxTQUFWLE9BQU8sQ0FBSSxDQUFDLEVBQUs7QUFDckIsWUFBSSxLQUFLLEdBQUcsTUFBSyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzFDLGNBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztPQUMzQixDQUFDOztBQUVGLFVBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN2RCxVQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDcEQ7OztTQTNDa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoic3JjL2ludGVyYWN0aW9ucy9rZXlib2FyZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFdmVudFNvdXJjZSBmcm9tICcuL2V2ZW50LXNvdXJjZSc7XG5pbXBvcnQgV2F2ZUV2ZW50IGZyb20gJy4vd2F2ZS1ldmVudCc7XG5cblxuLyoqXG4gKiBBIGdsb2JhbCBldmVudCBzb3VydmUgZm9yIHRoZSBrZXlib2FyZC4gT25seSBvbmUgaW5zdGFuY2Ugb2YgdGhpcyBzb3VyY2VcbiAqIGNhbiBiZSBjcmVhdGVkLiBUaGUgZmlyc3QgY3JlYXRlZCB0aW1lbGluZSBpbnN0YW5jaWF0ZSB0aGUgc2luZ2xldG9uLCBlYWNoXG4gKiBzdWJzZXF1ZW50IGluc3RhbmNpYXRpb24gcmV0dXJucyB0aGUgZmlyc3QgY3JlYXRlZCBpbnN0YW5jZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgS2V5Ym9hcmQgZXh0ZW5kcyBFdmVudFNvdXJjZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIFRoZSBlbGVtZW50IG9uIHdoaWNoIHRvIGluc3RhbGwgdGhlIGxpc3RlbmVyLlxuICAgKi9cbiAgY29uc3RydWN0b3IoJGVsKSB7XG4gICAgLy8ga2luZCBvZiBzaW5nbGV0b25cbiAgICBpZiAoS2V5Ym9hcmQuX2luc3RhbmNlKSB7IHJldHVybiBLZXlib2FyZC5faW5zdGFuY2U7IH1cblxuICAgIHN1cGVyKCRlbCk7XG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIHNvdXJjZVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5zb3VyY2VOYW1lID0gJ2tleWJvYXJkJztcblxuICAgIEtleWJvYXJkLl9pbnN0YW5jZSA9IHRoaXM7XG4gIH1cblxuICBfY3JlYXRlRXZlbnQodHlwZSwgZSkge1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IFdhdmVFdmVudCh0aGlzLnNvdXJjZU5hbWUsIHR5cGUsIGUpO1xuXG4gICAgZXZlbnQuc2hpZnRLZXkgPSBlLnNoaWZ0S2V5O1xuICAgIGV2ZW50LmN0cmxLZXkgPSBlLmN0cmxLZXk7XG4gICAgZXZlbnQuYWx0S2V5ID0gZS5hbHRLZXk7XG4gICAgZXZlbnQubWV0YUtleSA9IGUubWV0YUtleTtcbiAgICBldmVudC5jaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLmtleUNvZGUpO1xuXG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgX2JpbmRFdmVudHMoKSB7XG4gICAgY29uc3Qgb25LZXlEb3duID0gKGUpID0+IHtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdrZXlkb3duJywgZSk7XG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH07XG5cbiAgICBjb25zdCBvbktleVVwID0gKGUpID0+IHtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdrZXl1cCcsIGUpO1xuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5RG93biwgZmFsc2UpO1xuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgb25LZXlVcCwgZmFsc2UpO1xuICB9XG59XG4iXX0=