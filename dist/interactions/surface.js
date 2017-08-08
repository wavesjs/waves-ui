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

var _eventSource = require('./event-source');

var _eventSource2 = _interopRequireDefault(_eventSource);

var _waveEvent = require('./wave-event');

var _waveEvent2 = _interopRequireDefault(_waveEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Normalizes mouse user interactions with the timeline upon the DOM
 * container element of `Track` instances. As soon as a `track` is added to a
 * `timeline`, its attached `Surface` instance will emit the mouse events.
 */
var Surface = function (_EventSource) {
  (0, _inherits3.default)(Surface, _EventSource);

  /**
   * @param {DOMElement} el - The DOM element to listen.
   * @todo - Add some padding to the surface.
   */
  function Surface($el) {
    (0, _classCallCheck3.default)(this, Surface);

    /**
     * The name of the event source.
     * @type {String}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (Surface.__proto__ || (0, _getPrototypeOf2.default)(Surface)).call(this, $el));

    _this.sourceName = 'surface';
    _this._mouseDownEvent = null;
    _this._lastEvent = null;

    _this._onMouseDown = _this._onMouseDown.bind(_this);
    _this._onMouseMove = _this._onMouseMove.bind(_this);
    _this._onMouseUp = _this._onMouseUp.bind(_this);
    _this._onClick = _this._onClick.bind(_this);
    _this._onDblClick = _this._onDblClick.bind(_this);
    _this._onMouseOver = _this._onMouseOver.bind(_this);
    _this._onMouseOut = _this._onMouseOut.bind(_this);

    _this.bindEvents();
    return _this;
  }

  /**
   * Factory method for `Event` class
   */


  (0, _createClass3.default)(Surface, [{
    key: 'createEvent',
    value: function createEvent(type, e) {
      var event = new _waveEvent2.default(this.sourceName, type, e);

      var pos = this._getRelativePosition(e);
      event.x = pos.x;
      event.y = pos.y;

      return event;
    }

    /**
     * Keep this private to avoid double event binding. Main logic of the surface
     * is here. Should be extended with needed events (mouseenter, mouseleave,
     * wheel ...).
     *
     * @todo - throttle
     * @private
     */

  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      // Bind callbacks
      this.$el.addEventListener('mousedown', this._onMouseDown, false);
      this.$el.addEventListener('click', this._onClick, false);
      this.$el.addEventListener('dblclick', this._onDblClick, false);
      this.$el.addEventListener('mouseover', this._onMouseOver, false);
      this.$el.addEventListener('mouseout', this._onMouseOut, false);
    }
  }, {
    key: 'unbindEvents',
    value: function unbindEvents() {
      // Bind callbacks
      this.$el.removeEventListener('mousedown', this._onMouseDown, false);
      this.$el.removeEventListener('click', this._onClick, false);
      this.$el.removeEventListener('dblclick', this._onDblClick, false);
      this.$el.removeEventListener('mouseover', this._onMouseOver, false);
      this.$el.removeEventListener('mouseout', this._onMouseOut, false);

      window.removeEventListener('mousemove', this._onMouseMove);
      window.removeEventListener('mouseup', this._onMouseUp);
    }

    /**
     * Returns the x, y coordinates coordinates relative to the surface element.
     *
     * @param {Event} e - Raw event from listener.
     * @return {Object}
     * @todo - handle padding.
     */

  }, {
    key: '_getRelativePosition',
    value: function _getRelativePosition(e) {
      // @TODO: should be able to ignore padding
      var x = 0;
      var y = 0;
      var clientRect = this.$el.getBoundingClientRect();
      var scrollLeft = document.body.scrollLeft + document.documentElement.scrollLeft;
      var scrollTop = document.body.scrollTop + document.documentElement.scrollTop;

      // Adapted from http://www.quirksmode.org/js/events_properties.html#position
      if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
      } else if (e.clientX || e.clientY) {
        // Normalize to pageX, pageY
        x = e.clientX + scrollLeft;
        y = e.clientY + scrollTop;
      }

      // clientRect refers to the client, not to the page
      x = x - (clientRect.left + scrollLeft);
      y = y - (clientRect.top + scrollTop);

      return { x: x, y: y };
    }
  }, {
    key: '_defineArea',
    value: function _defineArea(e, mouseDownEvent, lastEvent) {
      if (!mouseDownEvent || !lastEvent) {
        return;
      }
      e.dx = e.x - lastEvent.x;
      e.dy = e.y - lastEvent.y;

      var left = mouseDownEvent.x < e.x ? mouseDownEvent.x : e.x;
      var top = mouseDownEvent.y < e.y ? mouseDownEvent.y : e.y;
      var width = Math.abs(Math.round(e.x - mouseDownEvent.x));
      var height = Math.abs(Math.round(e.y - mouseDownEvent.y));

      e.area = { left: left, top: top, width: width, height: height };
    }
  }, {
    key: '_onMouseDown',
    value: function _onMouseDown(e) {
      // by removing the previous selection we prevent bypassing the mousemove events coming from SVG in Firefox.
      window.getSelection().removeAllRanges();
      var event = this.createEvent('mousedown', e);

      this._mouseDownEvent = event;
      this._lastEvent = event;
      // Register mousemove and mouseup listeners on window
      window.addEventListener('mousemove', this._onMouseMove, false);
      window.addEventListener('mouseup', this._onMouseUp, false);

      this.emit('event', event);
    }
  }, {
    key: '_onMouseMove',
    value: function _onMouseMove(e) {
      var event = this.createEvent('mousemove', e);
      this._defineArea(event, this._mouseDownEvent, this._lastEvent);
      // Update `lastEvent` for next call
      this._lastEvent = event;

      this.emit('event', event);
    }
  }, {
    key: '_onMouseUp',
    value: function _onMouseUp(e) {
      var event = this.createEvent('mouseup', e);
      this._defineArea(event, this._mouseDownEvent, this._lastEvent);

      this._mouseDownEvent = null;
      this._lastEvent = null;
      // Remove mousemove and mouseup listeners on window
      window.removeEventListener('mousemove', this._onMouseMove);
      window.removeEventListener('mouseup', this._onMouseUp);

      this.emit('event', event);
    }
  }, {
    key: '_onClick',
    value: function _onClick(e) {
      var event = this.createEvent('click', e);
      this.emit('event', event);
    }
  }, {
    key: '_onDblClick',
    value: function _onDblClick(e) {
      var event = this.createEvent('dblclick', e);
      this.emit('event', event);
    }
  }, {
    key: '_onMouseOver',
    value: function _onMouseOver(e) {
      var event = this.createEvent('mouseover', e);
      this.emit('event', event);
    }
  }, {
    key: '_onMouseOut',
    value: function _onMouseOut(e) {
      var event = this.createEvent('mouseout', e);
      this.emit('event', event);
    }
  }]);
  return Surface;
}(_eventSource2.default);

exports.default = Surface;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN1cmZhY2UuanMiXSwibmFtZXMiOlsiU3VyZmFjZSIsIiRlbCIsInNvdXJjZU5hbWUiLCJfbW91c2VEb3duRXZlbnQiLCJfbGFzdEV2ZW50IiwiX29uTW91c2VEb3duIiwiYmluZCIsIl9vbk1vdXNlTW92ZSIsIl9vbk1vdXNlVXAiLCJfb25DbGljayIsIl9vbkRibENsaWNrIiwiX29uTW91c2VPdmVyIiwiX29uTW91c2VPdXQiLCJiaW5kRXZlbnRzIiwidHlwZSIsImUiLCJldmVudCIsInBvcyIsIl9nZXRSZWxhdGl2ZVBvc2l0aW9uIiwieCIsInkiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIndpbmRvdyIsImNsaWVudFJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJzY3JvbGxMZWZ0IiwiZG9jdW1lbnQiLCJib2R5IiwiZG9jdW1lbnRFbGVtZW50Iiwic2Nyb2xsVG9wIiwicGFnZVgiLCJwYWdlWSIsImNsaWVudFgiLCJjbGllbnRZIiwibGVmdCIsInRvcCIsIm1vdXNlRG93bkV2ZW50IiwibGFzdEV2ZW50IiwiZHgiLCJkeSIsIndpZHRoIiwiTWF0aCIsImFicyIsInJvdW5kIiwiaGVpZ2h0IiwiYXJlYSIsImdldFNlbGVjdGlvbiIsInJlbW92ZUFsbFJhbmdlcyIsImNyZWF0ZUV2ZW50IiwiZW1pdCIsIl9kZWZpbmVBcmVhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUdBOzs7OztJQUtNQSxPOzs7QUFDSjs7OztBQUlBLG1CQUFZQyxHQUFaLEVBQWlCO0FBQUE7O0FBR2Y7Ozs7QUFIZSx3SUFDVEEsR0FEUzs7QUFPZixVQUFLQyxVQUFMLEdBQWtCLFNBQWxCO0FBQ0EsVUFBS0MsZUFBTCxHQUF1QixJQUF2QjtBQUNBLFVBQUtDLFVBQUwsR0FBa0IsSUFBbEI7O0FBRUEsVUFBS0MsWUFBTCxHQUFvQixNQUFLQSxZQUFMLENBQWtCQyxJQUFsQixP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QUFzQyxLQUFLZCxVQUEzQzs7QUFFQSxXQUFLMEMsSUFBTCxDQUFVLE9BQVYsRUFBbUJsQyxLQUFuQjtBQUNEOzs7NkJBRVFELEMsRUFBRztBQUNWLFVBQUlDLFFBQVEsS0FBS2lDLFdBQUwsQ0FBaUIsT0FBakIsRUFBMEJsQyxDQUExQixDQUFaO0FBQ0EsV0FBS21DLElBQUwsQ0FBVSxPQUFWLEVBQW1CbEMsS0FBbkI7QUFDRDs7O2dDQUVXRCxDLEVBQUc7QUFDYixVQUFJQyxRQUFRLEtBQUtpQyxXQUFMLENBQWlCLFVBQWpCLEVBQTZCbEMsQ0FBN0IsQ0FBWjtBQUNBLFdBQUttQyxJQUFMLENBQVUsT0FBVixFQUFtQmxDLEtBQW5CO0FBQ0Q7OztpQ0FFWUQsQyxFQUFHO0FBQ2QsVUFBSUMsUUFBUSxLQUFLaUMsV0FBTCxDQUFpQixXQUFqQixFQUE4QmxDLENBQTlCLENBQVo7QUFDQSxXQUFLbUMsSUFBTCxDQUFVLE9BQVYsRUFBbUJsQyxLQUFuQjtBQUNEOzs7Z0NBRVdELEMsRUFBRztBQUNiLFVBQUlDLFFBQVEsS0FBS2lDLFdBQUwsQ0FBaUIsVUFBakIsRUFBNkJsQyxDQUE3QixDQUFaO0FBQ0EsV0FBS21DLElBQUwsQ0FBVSxPQUFWLEVBQW1CbEMsS0FBbkI7QUFDRDs7Ozs7a0JBR1loQixPIiwiZmlsZSI6InN1cmZhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXZlbnRTb3VyY2UgZnJvbSAnLi9ldmVudC1zb3VyY2UnO1xuaW1wb3J0IFdhdmVFdmVudCBmcm9tICcuL3dhdmUtZXZlbnQnO1xuXG5cbi8qKlxuICogTm9ybWFsaXplcyBtb3VzZSB1c2VyIGludGVyYWN0aW9ucyB3aXRoIHRoZSB0aW1lbGluZSB1cG9uIHRoZSBET01cbiAqIGNvbnRhaW5lciBlbGVtZW50IG9mIGBUcmFja2AgaW5zdGFuY2VzLiBBcyBzb29uIGFzIGEgYHRyYWNrYCBpcyBhZGRlZCB0byBhXG4gKiBgdGltZWxpbmVgLCBpdHMgYXR0YWNoZWQgYFN1cmZhY2VgIGluc3RhbmNlIHdpbGwgZW1pdCB0aGUgbW91c2UgZXZlbnRzLlxuICovXG5jbGFzcyBTdXJmYWNlIGV4dGVuZHMgRXZlbnRTb3VyY2Uge1xuICAvKipcbiAgICogQHBhcmFtIHtET01FbGVtZW50fSBlbCAtIFRoZSBET00gZWxlbWVudCB0byBsaXN0ZW4uXG4gICAqIEB0b2RvIC0gQWRkIHNvbWUgcGFkZGluZyB0byB0aGUgc3VyZmFjZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCRlbCkge1xuICAgIHN1cGVyKCRlbCk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgc291cmNlLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5zb3VyY2VOYW1lID0gJ3N1cmZhY2UnO1xuICAgIHRoaXMuX21vdXNlRG93bkV2ZW50ID0gbnVsbDtcbiAgICB0aGlzLl9sYXN0RXZlbnQgPSBudWxsO1xuXG4gICAgdGhpcy5fb25Nb3VzZURvd24gPSB0aGlzLl9vbk1vdXNlRG93bi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uTW91c2VNb3ZlID0gdGhpcy5fb25Nb3VzZU1vdmUuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbk1vdXNlVXAgPSB0aGlzLl9vbk1vdXNlVXAuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkNsaWNrID0gdGhpcy5fb25DbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uRGJsQ2xpY2sgPSB0aGlzLl9vbkRibENsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25Nb3VzZU92ZXIgPSB0aGlzLl9vbk1vdXNlT3Zlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uTW91c2VPdXQgPSB0aGlzLl9vbk1vdXNlT3V0LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGYWN0b3J5IG1ldGhvZCBmb3IgYEV2ZW50YCBjbGFzc1xuICAgKi9cbiAgY3JlYXRlRXZlbnQodHlwZSwgZSkge1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IFdhdmVFdmVudCh0aGlzLnNvdXJjZU5hbWUsIHR5cGUsIGUpO1xuXG4gICAgY29uc3QgcG9zID0gdGhpcy5fZ2V0UmVsYXRpdmVQb3NpdGlvbihlKTtcbiAgICBldmVudC54ID0gcG9zLng7XG4gICAgZXZlbnQueSA9IHBvcy55O1xuXG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEtlZXAgdGhpcyBwcml2YXRlIHRvIGF2b2lkIGRvdWJsZSBldmVudCBiaW5kaW5nLiBNYWluIGxvZ2ljIG9mIHRoZSBzdXJmYWNlXG4gICAqIGlzIGhlcmUuIFNob3VsZCBiZSBleHRlbmRlZCB3aXRoIG5lZWRlZCBldmVudHMgKG1vdXNlZW50ZXIsIG1vdXNlbGVhdmUsXG4gICAqIHdoZWVsIC4uLikuXG4gICAqXG4gICAqIEB0b2RvIC0gdGhyb3R0bGVcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgLy8gQmluZCBjYWxsYmFja3NcbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9vbk1vdXNlRG93biwgZmFsc2UpO1xuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25DbGljaywgZmFsc2UpO1xuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgdGhpcy5fb25EYmxDbGljaywgZmFsc2UpO1xuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIHRoaXMuX29uTW91c2VPdmVyLCBmYWxzZSk7XG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB0aGlzLl9vbk1vdXNlT3V0LCBmYWxzZSk7XG4gIH1cblxuICB1bmJpbmRFdmVudHMoKSB7XG4gICAgLy8gQmluZCBjYWxsYmFja3NcbiAgICB0aGlzLiRlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9vbk1vdXNlRG93biwgZmFsc2UpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25DbGljaywgZmFsc2UpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgdGhpcy5fb25EYmxDbGljaywgZmFsc2UpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIHRoaXMuX29uTW91c2VPdmVyLCBmYWxzZSk7XG4gICAgdGhpcy4kZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB0aGlzLl9vbk1vdXNlT3V0LCBmYWxzZSk7XG5cbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fb25Nb3VzZU1vdmUpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fb25Nb3VzZVVwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB4LCB5IGNvb3JkaW5hdGVzIGNvb3JkaW5hdGVzIHJlbGF0aXZlIHRvIHRoZSBzdXJmYWNlIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGUgLSBSYXcgZXZlbnQgZnJvbSBsaXN0ZW5lci5cbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKiBAdG9kbyAtIGhhbmRsZSBwYWRkaW5nLlxuICAgKi9cbiAgX2dldFJlbGF0aXZlUG9zaXRpb24oZSkge1xuICAgIC8vIEBUT0RPOiBzaG91bGQgYmUgYWJsZSB0byBpZ25vcmUgcGFkZGluZ1xuICAgIGxldCB4ID0gMDtcbiAgICBsZXQgeSA9IDA7XG4gICAgY29uc3QgY2xpZW50UmVjdCA9IHRoaXMuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHNjcm9sbExlZnQgPSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdDtcbiAgICBjb25zdCBzY3JvbGxUb3AgID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuXG4gICAgLy8gQWRhcHRlZCBmcm9tIGh0dHA6Ly93d3cucXVpcmtzbW9kZS5vcmcvanMvZXZlbnRzX3Byb3BlcnRpZXMuaHRtbCNwb3NpdGlvblxuICAgIGlmIChlLnBhZ2VYIHx8IGUucGFnZVkpIHtcbiAgICAgIHggPSBlLnBhZ2VYO1xuICAgICAgeSA9IGUucGFnZVk7XG4gICAgfSBlbHNlIGlmIChlLmNsaWVudFggfHwgZS5jbGllbnRZKSB7XG4gICAgICAvLyBOb3JtYWxpemUgdG8gcGFnZVgsIHBhZ2VZXG4gICAgICB4ID0gZS5jbGllbnRYICsgc2Nyb2xsTGVmdDtcbiAgICAgIHkgPSBlLmNsaWVudFkgKyBzY3JvbGxUb3A7XG4gICAgfVxuXG4gICAgLy8gY2xpZW50UmVjdCByZWZlcnMgdG8gdGhlIGNsaWVudCwgbm90IHRvIHRoZSBwYWdlXG4gICAgeCA9IHggLSAoY2xpZW50UmVjdC5sZWZ0ICsgc2Nyb2xsTGVmdCk7XG4gICAgeSA9IHkgLSAoY2xpZW50UmVjdC50b3AgICsgc2Nyb2xsVG9wICk7XG5cbiAgICByZXR1cm4geyB4LCB5IH07XG4gIH1cblxuICBfZGVmaW5lQXJlYShlLCBtb3VzZURvd25FdmVudCwgbGFzdEV2ZW50KSB7XG4gICAgaWYgKCFtb3VzZURvd25FdmVudCB8fMKgIWxhc3RFdmVudCkgeyByZXR1cm47IH1cbiAgICBlLmR4ID0gZS54IC0gbGFzdEV2ZW50Lng7XG4gICAgZS5keSA9IGUueSAtIGxhc3RFdmVudC55O1xuXG4gICAgY29uc3QgbGVmdCA9IG1vdXNlRG93bkV2ZW50LnggPCBlLnggPyBtb3VzZURvd25FdmVudC54IDogZS54O1xuICAgIGNvbnN0IHRvcCAgPSBtb3VzZURvd25FdmVudC55IDwgZS55ID8gbW91c2VEb3duRXZlbnQueSA6IGUueTtcbiAgICBjb25zdCB3aWR0aCAgPSBNYXRoLmFicyhNYXRoLnJvdW5kKGUueCAtIG1vdXNlRG93bkV2ZW50LngpKTtcbiAgICBjb25zdCBoZWlnaHQgPSBNYXRoLmFicyhNYXRoLnJvdW5kKGUueSAtIG1vdXNlRG93bkV2ZW50LnkpKTtcblxuICAgIGUuYXJlYSA9IHsgbGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0IH07XG4gIH1cblxuICBfb25Nb3VzZURvd24oZSkge1xuICAgIC8vIGJ5IHJlbW92aW5nIHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gd2UgcHJldmVudCBieXBhc3NpbmcgdGhlIG1vdXNlbW92ZSBldmVudHMgY29taW5nIGZyb20gU1ZHIGluIEZpcmVmb3guXG4gICAgd2luZG93LmdldFNlbGVjdGlvbigpLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5jcmVhdGVFdmVudCgnbW91c2Vkb3duJywgZSk7XG5cblxuICAgIHRoaXMuX21vdXNlRG93bkV2ZW50ID0gZXZlbnQ7XG4gICAgdGhpcy5fbGFzdEV2ZW50ID0gZXZlbnQ7XG4gICAgLy8gUmVnaXN0ZXIgbW91c2Vtb3ZlIGFuZCBtb3VzZXVwIGxpc3RlbmVycyBvbiB3aW5kb3dcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fb25Nb3VzZU1vdmUsIGZhbHNlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX29uTW91c2VVcCwgZmFsc2UpO1xuXG4gICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgfVxuXG4gIF9vbk1vdXNlTW92ZShlKSB7XG4gICAgbGV0IGV2ZW50ID0gdGhpcy5jcmVhdGVFdmVudCgnbW91c2Vtb3ZlJywgZSk7XG4gICAgdGhpcy5fZGVmaW5lQXJlYShldmVudCwgdGhpcy5fbW91c2VEb3duRXZlbnQsIHRoaXMuX2xhc3RFdmVudCk7XG4gICAgLy8gVXBkYXRlIGBsYXN0RXZlbnRgIGZvciBuZXh0IGNhbGxcbiAgICB0aGlzLl9sYXN0RXZlbnQgPSBldmVudDtcblxuICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gIH1cblxuICBfb25Nb3VzZVVwKGUpIHtcbiAgICBsZXQgZXZlbnQgPSB0aGlzLmNyZWF0ZUV2ZW50KCdtb3VzZXVwJywgZSk7XG4gICAgdGhpcy5fZGVmaW5lQXJlYShldmVudCwgdGhpcy5fbW91c2VEb3duRXZlbnQsIHRoaXMuX2xhc3RFdmVudCk7XG5cblxuICAgIHRoaXMuX21vdXNlRG93bkV2ZW50ID0gbnVsbDtcbiAgICB0aGlzLl9sYXN0RXZlbnQgPSBudWxsO1xuICAgIC8vIFJlbW92ZSBtb3VzZW1vdmUgYW5kIG1vdXNldXAgbGlzdGVuZXJzIG9uIHdpbmRvd1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9vbk1vdXNlTW92ZSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9vbk1vdXNlVXApO1xuXG4gICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgfVxuXG4gIF9vbkNsaWNrKGUpIHtcbiAgICBsZXQgZXZlbnQgPSB0aGlzLmNyZWF0ZUV2ZW50KCdjbGljaycsIGUpO1xuICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gIH1cblxuICBfb25EYmxDbGljayhlKSB7XG4gICAgbGV0IGV2ZW50ID0gdGhpcy5jcmVhdGVFdmVudCgnZGJsY2xpY2snLCBlKTtcbiAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICB9XG5cbiAgX29uTW91c2VPdmVyKGUpIHtcbiAgICBsZXQgZXZlbnQgPSB0aGlzLmNyZWF0ZUV2ZW50KCdtb3VzZW92ZXInLCBlKTtcbiAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICB9XG5cbiAgX29uTW91c2VPdXQoZSkge1xuICAgIGxldCBldmVudCA9IHRoaXMuY3JlYXRlRXZlbnQoJ21vdXNlb3V0JywgZSk7XG4gICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTdXJmYWNlO1xuIl19