import EventSource from './event-source';
import WaveEvent from './wave-event';


/**
 * Normalizes mouse user interactions with the timeline upon the DOM
 * container element of `Track` instances. As soon as a `track` is added to a
 * `timeline`, its attached `Surface` instance will emit the mouse events.
 */
class Surface extends EventSource {
  /**
   * @param {DOMElement} el - The DOM element to listen.
   * @todo - Add some padding to the surface.
   */
  constructor($el) {
    super($el);

    /**
     * The name of the event source.
     * @type {String}
     */
    this.sourceName = 'surface';
    this._mouseDownEvent = null;
    this._lastEvent = null;

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onDblClick = this._onDblClick.bind(this);
    this._onMouseOver = this._onMouseOver.bind(this);
    this._onMouseOut = this._onMouseOut.bind(this);

    this.bindEvents();
  }

  /**
   * Factory method for `Event` class
   */
  createEvent(type, e) {
    const event = new WaveEvent(this.sourceName, type, e);

    const pos = this._getRelativePosition(e);
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
  bindEvents() {
    // Bind callbacks
    this.$el.addEventListener('mousedown', this._onMouseDown, false);
    this.$el.addEventListener('click', this._onClick, false);
    this.$el.addEventListener('dblclick', this._onDblClick, false);
    this.$el.addEventListener('mouseover', this._onMouseOver, false);
    this.$el.addEventListener('mouseout', this._onMouseOut, false);
  }

  unbindEvents() {
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
  _getRelativePosition(e) {
    // @TODO: should be able to ignore padding
    let x = 0;
    let y = 0;
    const clientRect = this.$el.getBoundingClientRect();
    const scrollLeft = document.body.scrollLeft + document.documentElement.scrollLeft;
    const scrollTop  = document.body.scrollTop + document.documentElement.scrollTop;

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
    y = y - (clientRect.top  + scrollTop );

    return { x, y };
  }

  _defineArea(e, mouseDownEvent, lastEvent) {
    if (!mouseDownEvent || !lastEvent) { return; }
    e.dx = e.x - lastEvent.x;
    e.dy = e.y - lastEvent.y;

    const left = mouseDownEvent.x < e.x ? mouseDownEvent.x : e.x;
    const top  = mouseDownEvent.y < e.y ? mouseDownEvent.y : e.y;
    const width  = Math.abs(Math.round(e.x - mouseDownEvent.x));
    const height = Math.abs(Math.round(e.y - mouseDownEvent.y));

    e.area = { left, top, width, height };
  }

  _onMouseDown(e) {
    // by removing the previous selection we prevent bypassing the mousemove events coming from SVG in Firefox.
    window.getSelection().removeAllRanges();
    const event = this.createEvent('mousedown', e);


    this._mouseDownEvent = event;
    this._lastEvent = event;
    // Register mousemove and mouseup listeners on window
    window.addEventListener('mousemove', this._onMouseMove, false);
    window.addEventListener('mouseup', this._onMouseUp, false);

    this.emit('event', event);
  }

  _onMouseMove(e) {
    let event = this.createEvent('mousemove', e);
    this._defineArea(event, this._mouseDownEvent, this._lastEvent);
    // Update `lastEvent` for next call
    this._lastEvent = event;

    this.emit('event', event);
  }

  _onMouseUp(e) {
    let event = this.createEvent('mouseup', e);
    this._defineArea(event, this._mouseDownEvent, this._lastEvent);


    this._mouseDownEvent = null;
    this._lastEvent = null;
    // Remove mousemove and mouseup listeners on window
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('mouseup', this._onMouseUp);

    this.emit('event', event);
  }

  _onClick(e) {
    let event = this.createEvent('click', e);
    this.emit('event', event);
  }

  _onDblClick(e) {
    let event = this.createEvent('dblclick', e);
    this.emit('event', event);
  }

  _onMouseOver(e) {
    let event = this.createEvent('mouseover', e);
    this.emit('event', event);
  }

  _onMouseOut(e) {
    let event = this.createEvent('mouseout', e);
    this.emit('event', event);
  }
}

export default Surface;
