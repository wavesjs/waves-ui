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

var _EventSource2 = require('./EventSource');

var _EventSource3 = _interopRequireDefault(_EventSource2);

var _WaveEvent = require('./WaveEvent');

var _WaveEvent2 = _interopRequireDefault(_WaveEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A global event sourve for the keyboard. Only one instance of this source
 * can be created. The first created timeline instanciate the singleton, each
 * subsequent instanciation returns the first created instance.
 */
var Keyboard = function (_EventSource) {
  (0, _inherits3.default)(Keyboard, _EventSource);

  /**
   * @param {Element} $el - The element on which to install the listener.
   */
  function Keyboard($el) {
    (0, _classCallCheck3.default)(this, Keyboard);

    /**
     * The name of the source
     * @type {String}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (Keyboard.__proto__ || (0, _getPrototypeOf2.default)(Keyboard)).call(this, $el));

    _this.sourceName = 'keyboard';

    _this._onKeyDown = _this._onKeyDown.bind(_this);
    _this._onKeyUp = _this._onKeyUp.bind(_this);

    _this.bindEvents();
    return _this;
  }

  (0, _createClass3.default)(Keyboard, [{
    key: 'createEvent',
    value: function createEvent(type, e) {
      var event = new _WaveEvent2.default(this.sourceName, type, e);

      event.shiftKey = e.shiftKey;
      event.ctrlKey = e.ctrlKey;
      event.altKey = e.altKey;
      event.metaKey = e.metaKey;
      event.which = e.which;
      event.char = String.fromCharCode(e.which);

      return event;
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      this.$el.addEventListener('keydown', this._onKeyDown, false);
      this.$el.addEventListener('keyup', this._onKeyUp, false);
    }
  }, {
    key: 'unbindEvents',
    value: function unbindEvents() {
      this.$el.removeEventListener('keydown', this._onKeyDown, false);
      this.$el.removeEventListener('keyup', this._onKeyUp, false);
    }
  }, {
    key: '_onKeyDown',
    value: function _onKeyDown(e) {
      var event = this.createEvent('keydown', e);
      this.emit('event', event);
    }
  }, {
    key: '_onKeyUp',
    value: function _onKeyUp(e) {
      var event = this.createEvent('keyup', e);
      this.emit('event', event);
    }
  }]);
  return Keyboard;
}(_EventSource3.default);

exports.default = Keyboard;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImtleWJvYXJkLmpzIl0sIm5hbWVzIjpbIktleWJvYXJkIiwiJGVsIiwic291cmNlTmFtZSIsIl9vbktleURvd24iLCJiaW5kIiwiX29uS2V5VXAiLCJiaW5kRXZlbnRzIiwidHlwZSIsImUiLCJldmVudCIsInNoaWZ0S2V5IiwiY3RybEtleSIsImFsdEtleSIsIm1ldGFLZXkiLCJ3aGljaCIsImNoYXIiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImNyZWF0ZUV2ZW50IiwiZW1pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFHQTs7Ozs7SUFLTUEsUTs7O0FBQ0o7OztBQUdBLG9CQUFZQyxHQUFaLEVBQWlCO0FBQUE7O0FBRWY7Ozs7QUFGZSwwSUFDVEEsR0FEUzs7QUFNZixVQUFLQyxVQUFMLEdBQWtCLFVBQWxCOztBQUVBLFVBQUtDLFVBQUwsR0FBa0IsTUFBS0EsVUFBTCxDQUFnQkMsSUFBaEIsT0FBbEI7QUFDQSxVQUFLQyxRQUFMLEdBQWdCLE1BQUtBLFFBQUwsQ0FBY0QsSUFBZCxPQUFoQjs7QUFFQSxVQUFLRSxVQUFMO0FBWGU7QUFZaEI7Ozs7Z0NBRVdDLEksRUFBTUMsQyxFQUFHO0FBQ25CLFVBQU1DLFFBQVEsd0JBQWMsS0FBS1AsVUFBbkIsRUFBK0JLLElBQS9CLEVBQXFDQyxDQUFyQyxDQUFkOztBQUVBQyxZQUFNQyxRQUFOLEdBQWlCRixFQUFFRSxRQUFuQjtBQUNBRCxZQUFNRSxPQUFOLEdBQWdCSCxFQUFFRyxPQUFsQjtBQUNBRixZQUFNRyxNQUFOLEdBQWVKLEVBQUVJLE1BQWpCO0FBQ0FILFlBQU1JLE9BQU4sR0FBZ0JMLEVBQUVLLE9BQWxCO0FBQ0FKLFlBQU1LLEtBQU4sR0FBY04sRUFBRU0sS0FBaEI7QUFDQUwsWUFBTU0sSUFBTixHQUFhQyxPQUFPQyxZQUFQLENBQW9CVCxFQUFFTSxLQUF0QixDQUFiOztBQUVBLGFBQU9MLEtBQVA7QUFDRDs7O2lDQUVZO0FBQ1gsV0FBS1IsR0FBTCxDQUFTaUIsZ0JBQVQsQ0FBMEIsU0FBMUIsRUFBcUMsS0FBS2YsVUFBMUMsRUFBc0QsS0FBdEQ7QUFDQSxXQUFLRixHQUFMLENBQVNpQixnQkFBVCxDQUEwQixPQUExQixFQUFtQyxLQUFLYixRQUF4QyxFQUFrRCxLQUFsRDtBQUNEOzs7bUNBRWM7QUFDYixXQUFLSixHQUFMLENBQVNrQixtQkFBVCxDQUE2QixTQUE3QixFQUF3QyxLQUFLaEIsVUFBN0MsRUFBeUQsS0FBekQ7QUFDQSxXQUFLRixHQUFMLENBQVNrQixtQkFBVCxDQUE2QixPQUE3QixFQUFzQyxLQUFLZCxRQUEzQyxFQUFxRCxLQUFyRDtBQUNEOzs7K0JBRVVHLEMsRUFBRztBQUNaLFVBQUlDLFFBQVEsS0FBS1csV0FBTCxDQUFpQixTQUFqQixFQUE0QlosQ0FBNUIsQ0FBWjtBQUNBLFdBQUthLElBQUwsQ0FBVSxPQUFWLEVBQW1CWixLQUFuQjtBQUNEOzs7NkJBRVFELEMsRUFBRztBQUNWLFVBQUlDLFFBQVEsS0FBS1csV0FBTCxDQUFpQixPQUFqQixFQUEwQlosQ0FBMUIsQ0FBWjtBQUNBLFdBQUthLElBQUwsQ0FBVSxPQUFWLEVBQW1CWixLQUFuQjtBQUNEOzs7OztrQkFHWVQsUSIsImZpbGUiOiJrZXlib2FyZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFdmVudFNvdXJjZSBmcm9tICcuL0V2ZW50U291cmNlJztcbmltcG9ydCBXYXZlRXZlbnQgZnJvbSAnLi9XYXZlRXZlbnQnO1xuXG5cbi8qKlxuICogQSBnbG9iYWwgZXZlbnQgc291cnZlIGZvciB0aGUga2V5Ym9hcmQuIE9ubHkgb25lIGluc3RhbmNlIG9mIHRoaXMgc291cmNlXG4gKiBjYW4gYmUgY3JlYXRlZC4gVGhlIGZpcnN0IGNyZWF0ZWQgdGltZWxpbmUgaW5zdGFuY2lhdGUgdGhlIHNpbmdsZXRvbiwgZWFjaFxuICogc3Vic2VxdWVudCBpbnN0YW5jaWF0aW9uIHJldHVybnMgdGhlIGZpcnN0IGNyZWF0ZWQgaW5zdGFuY2UuXG4gKi9cbmNsYXNzIEtleWJvYXJkIGV4dGVuZHMgRXZlbnRTb3VyY2Uge1xuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkZWwgLSBUaGUgZWxlbWVudCBvbiB3aGljaCB0byBpbnN0YWxsIHRoZSBsaXN0ZW5lci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCRlbCkge1xuICAgIHN1cGVyKCRlbCk7XG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIHNvdXJjZVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5zb3VyY2VOYW1lID0gJ2tleWJvYXJkJztcblxuICAgIHRoaXMuX29uS2V5RG93biA9IHRoaXMuX29uS2V5RG93bi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uS2V5VXAgPSB0aGlzLl9vbktleVVwLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgfVxuXG4gIGNyZWF0ZUV2ZW50KHR5cGUsIGUpIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBXYXZlRXZlbnQodGhpcy5zb3VyY2VOYW1lLCB0eXBlLCBlKTtcblxuICAgIGV2ZW50LnNoaWZ0S2V5ID0gZS5zaGlmdEtleTtcbiAgICBldmVudC5jdHJsS2V5ID0gZS5jdHJsS2V5O1xuICAgIGV2ZW50LmFsdEtleSA9IGUuYWx0S2V5O1xuICAgIGV2ZW50Lm1ldGFLZXkgPSBlLm1ldGFLZXk7XG4gICAgZXZlbnQud2hpY2ggPSBlLndoaWNoO1xuICAgIGV2ZW50LmNoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuXG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5fb25LZXlEb3duLCBmYWxzZSk7XG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLl9vbktleVVwLCBmYWxzZSk7XG4gIH1cblxuICB1bmJpbmRFdmVudHMoKSB7XG4gICAgdGhpcy4kZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuX29uS2V5RG93biwgZmFsc2UpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5fb25LZXlVcCwgZmFsc2UpO1xuICB9XG5cbiAgX29uS2V5RG93bihlKSB7XG4gICAgbGV0IGV2ZW50ID0gdGhpcy5jcmVhdGVFdmVudCgna2V5ZG93bicsIGUpO1xuICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gIH1cblxuICBfb25LZXlVcChlKSB7XG4gICAgbGV0IGV2ZW50ID0gdGhpcy5jcmVhdGVFdmVudCgna2V5dXAnLCBlKTtcbiAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEtleWJvYXJkO1xuIl19