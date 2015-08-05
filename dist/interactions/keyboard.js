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

      this.el.onkeydown = onKeyDown;
      this.el.onkeyup = onKeyUp;
    }
  }]);

  return Keyboard;
})(_eventSource2['default']);

exports['default'] = Keyboard;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9pbnRlcmFjdGlvbnMva2V5Ym9hcmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBd0IsZ0JBQWdCOzs7O3lCQUNsQixjQUFjOzs7O0FBR3BDLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ2xDLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQzs7Ozs7SUFJRixRQUFRO1lBQVIsUUFBUTs7QUFDaEIsV0FEUSxRQUFRLENBQ2YsRUFBRSxFQUFFOzBCQURHLFFBQVE7OztBQUd6QixRQUFJLFFBQVEsQ0FBQyxTQUFTLEVBQUU7QUFBRSxhQUFPLFFBQVEsQ0FBQyxTQUFTLENBQUM7S0FBRTs7QUFFdEQsK0JBTGlCLFFBQVEsNkNBS25CLEVBQUUsRUFBRTtBQUNWLFFBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDOztBQUU3QixZQUFRLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztHQUMzQjs7ZUFUa0IsUUFBUTs7V0FXZixzQkFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFO0FBQ3BCLFVBQU0sS0FBSyxHQUFHLDJCQUFjLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUV0RCxXQUFLLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDNUIsV0FBSyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQzFCLFdBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN4QixXQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDMUIsV0FBSyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFNUMsYUFBTyxLQUFLLENBQUM7S0FDZDs7O1dBRVUsdUJBQUc7OztBQUNaLFVBQU0sU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFJLENBQUMsRUFBSztBQUN2QixZQUFJLEtBQUssR0FBRyxNQUFLLFlBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUMsY0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQzNCLENBQUM7O0FBRUYsVUFBTSxPQUFPLEdBQUcsU0FBVixPQUFPLENBQUksQ0FBQyxFQUFLO0FBQ3JCLFlBQUksS0FBSyxHQUFHLE1BQUssWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMxQyxjQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7T0FDM0IsQ0FBQzs7QUFFRixVQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDOUIsVUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0tBQzNCOzs7U0FwQ2tCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6ImVzNi9pbnRlcmFjdGlvbnMva2V5Ym9hcmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXZlbnRTb3VyY2UgZnJvbSAnLi9ldmVudC1zb3VyY2UnO1xuaW1wb3J0IFdhdmVFdmVudCBmcm9tICcuL3dhdmUtZXZlbnQnO1xuXG5cbmNvbnN0IGJvZHkgPSB3aW5kb3cuZG9jdW1lbnQuYm9keTtcbmNvbnN0IHNpbmdsZXRvbiA9IG51bGw7XG4vKipcbiAqIGh0dHA6Ly9qYXZhc2NyaXB0LmluZm8vdHV0b3JpYWwva2V5Ym9hcmQtZXZlbnRzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEtleWJvYXJkIGV4dGVuZHMgRXZlbnRTb3VyY2Uge1xuICBjb25zdHJ1Y3RvcihlbCkge1xuICAgIC8vIGtpbmQgb2Ygc2luZ2xldG9uXG4gICAgaWYgKEtleWJvYXJkLl9pbnN0YW5jZSkgeyByZXR1cm4gS2V5Ym9hcmQuX2luc3RhbmNlOyB9XG5cbiAgICBzdXBlcihlbCk7XG4gICAgdGhpcy5zb3VyY2VOYW1lID0gJ2tleWJvYXJkJztcblxuICAgIEtleWJvYXJkLl9pbnN0YW5jZSA9IHRoaXM7XG4gIH1cblxuICBfY3JlYXRlRXZlbnQodHlwZSwgZSkge1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IFdhdmVFdmVudCh0aGlzLnNvdXJjZU5hbWUsIHR5cGUsIGUpO1xuXG4gICAgZXZlbnQuc2hpZnRLZXkgPSBlLnNoaWZ0S2V5O1xuICAgIGV2ZW50LmN0cmxLZXkgPSBlLmN0cmxLZXk7XG4gICAgZXZlbnQuYWx0S2V5ID0gZS5hbHRLZXk7XG4gICAgZXZlbnQubWV0YUtleSA9IGUubWV0YUtleTtcbiAgICBldmVudC5jaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShlLmtleUNvZGUpO1xuXG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgX2JpbmRFdmVudHMoKSB7XG4gICAgY29uc3Qgb25LZXlEb3duID0gKGUpID0+IHtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdrZXlkb3duJywgZSk7XG4gICAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgIH07XG5cbiAgICBjb25zdCBvbktleVVwID0gKGUpID0+IHtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuX2NyZWF0ZUV2ZW50KCdrZXl1cCcsIGUpO1xuICAgICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgICB9O1xuXG4gICAgdGhpcy5lbC5vbmtleWRvd24gPSBvbktleURvd247XG4gICAgdGhpcy5lbC5vbmtleXVwID0gb25LZXlVcDtcbiAgfVxufVxuIl19