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
      var event = new _WaveEvent2.default(this.sourceName, type, e);

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
}(_EventSource3.default);

exports.default = Surface;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN1cmZhY2UuanMiXSwibmFtZXMiOlsiU3VyZmFjZSIsIiRlbCIsInNvdXJjZU5hbWUiLCJfbW91c2VEb3duRXZlbnQiLCJfbGFzdEV2ZW50IiwiX29uTW91c2VEb3duIiwiYmluZCIsIl9vbk1vdXNlTW92ZSIsIl9vbk1vdXNlVXAiLCJfb25DbGljayIsIl9vbkRibENsaWNrIiwiX29uTW91c2VPdmVyIiwiX29uTW91c2VPdXQiLCJiaW5kRXZlbnRzIiwidHlwZSIsImUiLCJldmVudCIsInBvcyIsIl9nZXRSZWxhdGl2ZVBvc2l0aW9uIiwieCIsInkiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIndpbmRvdyIsImNsaWVudFJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJzY3JvbGxMZWZ0IiwiZG9jdW1lbnQiLCJib2R5IiwiZG9jdW1lbnRFbGVtZW50Iiwic2Nyb2xsVG9wIiwicGFnZVgiLCJwYWdlWSIsImNsaWVudFgiLCJjbGllbnRZIiwibGVmdCIsInRvcCIsIm1vdXNlRG93bkV2ZW50IiwibGFzdEV2ZW50IiwiZHgiLCJkeSIsIndpZHRoIiwiTWF0aCIsImFicyIsInJvdW5kIiwiaGVpZ2h0IiwiYXJlYSIsImdldFNlbGVjdGlvbiIsInJlbW92ZUFsbFJhbmdlcyIsImNyZWF0ZUV2ZW50IiwiZW1pdCIsIl9kZWZpbmVBcmVhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUdBOzs7OztJQUtNQSxPOzs7QUFDSjs7OztBQUlBLG1CQUFZQyxHQUFaLEVBQWlCO0FBQUE7O0FBR2Y7Ozs7QUFIZSx3SUFDVEEsR0FEUzs7QUFPZixVQUFLQyxVQUFMLEdBQWtCLFNBQWxCO0FBQ0EsVUFBS0MsZUFBTCxHQUF1QixJQUF2QjtBQUNBLFVBQUtDLFVBQUwsR0FBa0IsSUFBbEI7O0FBRUEsVUFBS0MsWUFBTCxHQUFvQixNQUFLQSxZQUFMLENBQWtCQyxJQUFsQixP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QUFzQyxLQUFLZCxVQUEzQzs7QUFFQSxXQUFLMEMsSUFBTCxDQUFVLE9BQVYsRUFBbUJsQyxLQUFuQjtBQUNEOzs7NkJBRVFELEMsRUFBRztBQUNWLFVBQUlDLFFBQVEsS0FBS2lDLFdBQUwsQ0FBaUIsT0FBakIsRUFBMEJsQyxDQUExQixDQUFaO0FBQ0EsV0FBS21DLElBQUwsQ0FBVSxPQUFWLEVBQW1CbEMsS0FBbkI7QUFDRDs7O2dDQUVXRCxDLEVBQUc7QUFDYixVQUFJQyxRQUFRLEtBQUtpQyxXQUFMLENBQWlCLFVBQWpCLEVBQTZCbEMsQ0FBN0IsQ0FBWjtBQUNBLFdBQUttQyxJQUFMLENBQVUsT0FBVixFQUFtQmxDLEtBQW5CO0FBQ0Q7OztpQ0FFWUQsQyxFQUFHO0FBQ2QsVUFBSUMsUUFBUSxLQUFLaUMsV0FBTCxDQUFpQixXQUFqQixFQUE4QmxDLENBQTlCLENBQVo7QUFDQSxXQUFLbUMsSUFBTCxDQUFVLE9BQVYsRUFBbUJsQyxLQUFuQjtBQUNEOzs7Z0NBRVdELEMsRUFBRztBQUNiLFVBQUlDLFFBQVEsS0FBS2lDLFdBQUwsQ0FBaUIsVUFBakIsRUFBNkJsQyxDQUE3QixDQUFaO0FBQ0EsV0FBS21DLElBQUwsQ0FBVSxPQUFWLEVBQW1CbEMsS0FBbkI7QUFDRDs7Ozs7a0JBR1loQixPIiwiZmlsZSI6InN1cmZhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXZlbnRTb3VyY2UgZnJvbSAnLi9FdmVudFNvdXJjZSc7XG5pbXBvcnQgV2F2ZUV2ZW50IGZyb20gJy4vV2F2ZUV2ZW50JztcblxuXG4vKipcbiAqIE5vcm1hbGl6ZXMgbW91c2UgdXNlciBpbnRlcmFjdGlvbnMgd2l0aCB0aGUgdGltZWxpbmUgdXBvbiB0aGUgRE9NXG4gKiBjb250YWluZXIgZWxlbWVudCBvZiBgVHJhY2tgIGluc3RhbmNlcy4gQXMgc29vbiBhcyBhIGB0cmFja2AgaXMgYWRkZWQgdG8gYVxuICogYHRpbWVsaW5lYCwgaXRzIGF0dGFjaGVkIGBTdXJmYWNlYCBpbnN0YW5jZSB3aWxsIGVtaXQgdGhlIG1vdXNlIGV2ZW50cy5cbiAqL1xuY2xhc3MgU3VyZmFjZSBleHRlbmRzIEV2ZW50U291cmNlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gZWwgLSBUaGUgRE9NIGVsZW1lbnQgdG8gbGlzdGVuLlxuICAgKiBAdG9kbyAtIEFkZCBzb21lIHBhZGRpbmcgdG8gdGhlIHN1cmZhY2UuXG4gICAqL1xuICBjb25zdHJ1Y3RvcigkZWwpIHtcbiAgICBzdXBlcigkZWwpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHNvdXJjZS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuc291cmNlTmFtZSA9ICdzdXJmYWNlJztcbiAgICB0aGlzLl9tb3VzZURvd25FdmVudCA9IG51bGw7XG4gICAgdGhpcy5fbGFzdEV2ZW50ID0gbnVsbDtcblxuICAgIHRoaXMuX29uTW91c2VEb3duID0gdGhpcy5fb25Nb3VzZURvd24uYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbk1vdXNlTW92ZSA9IHRoaXMuX29uTW91c2VNb3ZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25Nb3VzZVVwID0gdGhpcy5fb25Nb3VzZVVwLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25DbGljayA9IHRoaXMuX29uQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkRibENsaWNrID0gdGhpcy5fb25EYmxDbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uTW91c2VPdmVyID0gdGhpcy5fb25Nb3VzZU92ZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbk1vdXNlT3V0ID0gdGhpcy5fb25Nb3VzZU91dC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gIH1cblxuICAvKipcbiAgICogRmFjdG9yeSBtZXRob2QgZm9yIGBFdmVudGAgY2xhc3NcbiAgICovXG4gIGNyZWF0ZUV2ZW50KHR5cGUsIGUpIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBXYXZlRXZlbnQodGhpcy5zb3VyY2VOYW1lLCB0eXBlLCBlKTtcblxuICAgIGNvbnN0IHBvcyA9IHRoaXMuX2dldFJlbGF0aXZlUG9zaXRpb24oZSk7XG4gICAgZXZlbnQueCA9IHBvcy54O1xuICAgIGV2ZW50LnkgPSBwb3MueTtcblxuICAgIHJldHVybiBldmVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBLZWVwIHRoaXMgcHJpdmF0ZSB0byBhdm9pZCBkb3VibGUgZXZlbnQgYmluZGluZy4gTWFpbiBsb2dpYyBvZiB0aGUgc3VyZmFjZVxuICAgKiBpcyBoZXJlLiBTaG91bGQgYmUgZXh0ZW5kZWQgd2l0aCBuZWVkZWQgZXZlbnRzIChtb3VzZWVudGVyLCBtb3VzZWxlYXZlLFxuICAgKiB3aGVlbCAuLi4pLlxuICAgKlxuICAgKiBAdG9kbyAtIHRocm90dGxlXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBiaW5kRXZlbnRzKCkge1xuICAgIC8vIEJpbmQgY2FsbGJhY2tzXG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5fb25Nb3VzZURvd24sIGZhbHNlKTtcbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX29uQ2xpY2ssIGZhbHNlKTtcbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIHRoaXMuX29uRGJsQ2xpY2ssIGZhbHNlKTtcbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCB0aGlzLl9vbk1vdXNlT3ZlciwgZmFsc2UpO1xuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgdGhpcy5fb25Nb3VzZU91dCwgZmFsc2UpO1xuICB9XG5cbiAgdW5iaW5kRXZlbnRzKCkge1xuICAgIC8vIEJpbmQgY2FsbGJhY2tzXG4gICAgdGhpcy4kZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5fb25Nb3VzZURvd24sIGZhbHNlKTtcbiAgICB0aGlzLiRlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX29uQ2xpY2ssIGZhbHNlKTtcbiAgICB0aGlzLiRlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIHRoaXMuX29uRGJsQ2xpY2ssIGZhbHNlKTtcbiAgICB0aGlzLiRlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCB0aGlzLl9vbk1vdXNlT3ZlciwgZmFsc2UpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgdGhpcy5fb25Nb3VzZU91dCwgZmFsc2UpO1xuXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX29uTW91c2VNb3ZlKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX29uTW91c2VVcCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgeCwgeSBjb29yZGluYXRlcyBjb29yZGluYXRlcyByZWxhdGl2ZSB0byB0aGUgc3VyZmFjZSBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBlIC0gUmF3IGV2ZW50IGZyb20gbGlzdGVuZXIuXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICogQHRvZG8gLSBoYW5kbGUgcGFkZGluZy5cbiAgICovXG4gIF9nZXRSZWxhdGl2ZVBvc2l0aW9uKGUpIHtcbiAgICAvLyBAVE9ETzogc2hvdWxkIGJlIGFibGUgdG8gaWdub3JlIHBhZGRpbmdcbiAgICBsZXQgeCA9IDA7XG4gICAgbGV0IHkgPSAwO1xuICAgIGNvbnN0IGNsaWVudFJlY3QgPSB0aGlzLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBzY3JvbGxMZWZ0ID0gZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0ICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ7XG4gICAgY29uc3Qgc2Nyb2xsVG9wICA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcblxuICAgIC8vIEFkYXB0ZWQgZnJvbSBodHRwOi8vd3d3LnF1aXJrc21vZGUub3JnL2pzL2V2ZW50c19wcm9wZXJ0aWVzLmh0bWwjcG9zaXRpb25cbiAgICBpZiAoZS5wYWdlWCB8fCBlLnBhZ2VZKSB7XG4gICAgICB4ID0gZS5wYWdlWDtcbiAgICAgIHkgPSBlLnBhZ2VZO1xuICAgIH0gZWxzZSBpZiAoZS5jbGllbnRYIHx8IGUuY2xpZW50WSkge1xuICAgICAgLy8gTm9ybWFsaXplIHRvIHBhZ2VYLCBwYWdlWVxuICAgICAgeCA9IGUuY2xpZW50WCArIHNjcm9sbExlZnQ7XG4gICAgICB5ID0gZS5jbGllbnRZICsgc2Nyb2xsVG9wO1xuICAgIH1cblxuICAgIC8vIGNsaWVudFJlY3QgcmVmZXJzIHRvIHRoZSBjbGllbnQsIG5vdCB0byB0aGUgcGFnZVxuICAgIHggPSB4IC0gKGNsaWVudFJlY3QubGVmdCArIHNjcm9sbExlZnQpO1xuICAgIHkgPSB5IC0gKGNsaWVudFJlY3QudG9wICArIHNjcm9sbFRvcCApO1xuXG4gICAgcmV0dXJuIHsgeCwgeSB9O1xuICB9XG5cbiAgX2RlZmluZUFyZWEoZSwgbW91c2VEb3duRXZlbnQsIGxhc3RFdmVudCkge1xuICAgIGlmICghbW91c2VEb3duRXZlbnQgfHzCoCFsYXN0RXZlbnQpIHsgcmV0dXJuOyB9XG4gICAgZS5keCA9IGUueCAtIGxhc3RFdmVudC54O1xuICAgIGUuZHkgPSBlLnkgLSBsYXN0RXZlbnQueTtcblxuICAgIGNvbnN0IGxlZnQgPSBtb3VzZURvd25FdmVudC54IDwgZS54ID8gbW91c2VEb3duRXZlbnQueCA6IGUueDtcbiAgICBjb25zdCB0b3AgID0gbW91c2VEb3duRXZlbnQueSA8IGUueSA/IG1vdXNlRG93bkV2ZW50LnkgOiBlLnk7XG4gICAgY29uc3Qgd2lkdGggID0gTWF0aC5hYnMoTWF0aC5yb3VuZChlLnggLSBtb3VzZURvd25FdmVudC54KSk7XG4gICAgY29uc3QgaGVpZ2h0ID0gTWF0aC5hYnMoTWF0aC5yb3VuZChlLnkgLSBtb3VzZURvd25FdmVudC55KSk7XG5cbiAgICBlLmFyZWEgPSB7IGxlZnQsIHRvcCwgd2lkdGgsIGhlaWdodCB9O1xuICB9XG5cbiAgX29uTW91c2VEb3duKGUpIHtcbiAgICAvLyBieSByZW1vdmluZyB0aGUgcHJldmlvdXMgc2VsZWN0aW9uIHdlIHByZXZlbnQgYnlwYXNzaW5nIHRoZSBtb3VzZW1vdmUgZXZlbnRzIGNvbWluZyBmcm9tIFNWRyBpbiBGaXJlZm94LlxuICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICBjb25zdCBldmVudCA9IHRoaXMuY3JlYXRlRXZlbnQoJ21vdXNlZG93bicsIGUpO1xuXG5cbiAgICB0aGlzLl9tb3VzZURvd25FdmVudCA9IGV2ZW50O1xuICAgIHRoaXMuX2xhc3RFdmVudCA9IGV2ZW50O1xuICAgIC8vIFJlZ2lzdGVyIG1vdXNlbW92ZSBhbmQgbW91c2V1cCBsaXN0ZW5lcnMgb24gd2luZG93XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX29uTW91c2VNb3ZlLCBmYWxzZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9vbk1vdXNlVXAsIGZhbHNlKTtcblxuICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gIH1cblxuICBfb25Nb3VzZU1vdmUoZSkge1xuICAgIGxldCBldmVudCA9IHRoaXMuY3JlYXRlRXZlbnQoJ21vdXNlbW92ZScsIGUpO1xuICAgIHRoaXMuX2RlZmluZUFyZWEoZXZlbnQsIHRoaXMuX21vdXNlRG93bkV2ZW50LCB0aGlzLl9sYXN0RXZlbnQpO1xuICAgIC8vIFVwZGF0ZSBgbGFzdEV2ZW50YCBmb3IgbmV4dCBjYWxsXG4gICAgdGhpcy5fbGFzdEV2ZW50ID0gZXZlbnQ7XG5cbiAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICB9XG5cbiAgX29uTW91c2VVcChlKSB7XG4gICAgbGV0IGV2ZW50ID0gdGhpcy5jcmVhdGVFdmVudCgnbW91c2V1cCcsIGUpO1xuICAgIHRoaXMuX2RlZmluZUFyZWEoZXZlbnQsIHRoaXMuX21vdXNlRG93bkV2ZW50LCB0aGlzLl9sYXN0RXZlbnQpO1xuXG5cbiAgICB0aGlzLl9tb3VzZURvd25FdmVudCA9IG51bGw7XG4gICAgdGhpcy5fbGFzdEV2ZW50ID0gbnVsbDtcbiAgICAvLyBSZW1vdmUgbW91c2Vtb3ZlIGFuZCBtb3VzZXVwIGxpc3RlbmVycyBvbiB3aW5kb3dcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fb25Nb3VzZU1vdmUpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fb25Nb3VzZVVwKTtcblxuICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gIH1cblxuICBfb25DbGljayhlKSB7XG4gICAgbGV0IGV2ZW50ID0gdGhpcy5jcmVhdGVFdmVudCgnY2xpY2snLCBlKTtcbiAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZXZlbnQpO1xuICB9XG5cbiAgX29uRGJsQ2xpY2soZSkge1xuICAgIGxldCBldmVudCA9IHRoaXMuY3JlYXRlRXZlbnQoJ2RibGNsaWNrJywgZSk7XG4gICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgfVxuXG4gIF9vbk1vdXNlT3ZlcihlKSB7XG4gICAgbGV0IGV2ZW50ID0gdGhpcy5jcmVhdGVFdmVudCgnbW91c2VvdmVyJywgZSk7XG4gICAgdGhpcy5lbWl0KCdldmVudCcsIGV2ZW50KTtcbiAgfVxuXG4gIF9vbk1vdXNlT3V0KGUpIHtcbiAgICBsZXQgZXZlbnQgPSB0aGlzLmNyZWF0ZUV2ZW50KCdtb3VzZW91dCcsIGUpO1xuICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBldmVudCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3VyZmFjZTtcbiJdfQ==