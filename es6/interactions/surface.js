import EventSource from './event-source';
import WaveEvent from './wave-event';


const body = window.document.body;

/**
 * `Surface` normalizes mouse user interactions with the timeline upon the DOM container element of `Track` instances.
 * As soon as a `track` is added to a `timeline`, its attached `Surface` instance will emit the mouse events.
 */
export default class Surface extends EventSource {
  /**
   * @param {DOMElement} el - the DOM element to monitor
   */
  constructor(el /*, padding of the current surface @TODO */) {
    super(el);

    // this.isMouseDown = false;
    this.mouseDownEvent = null;
    this.lastEvent = null;
  }

  /**
   * Factory method for `Event` class
   */
  _createEvent(type, e) {
    const event = new WaveEvent(type, e);

    const pos = this._getRelativePosition(e);
    event.x = pos.x;
    event.y = pos.y;

    return event;
  }

  /**
   * @param {Event} e - raw event from listener
   * @return {Object} The x, y coordinates coordinates relative to the surface element
   */
  _getRelativePosition(e) {
    // @TODO: should be able to ignore padding
    let x = 0;
    let y = 0;
    const clientRect = this.el.getBoundingClientRect();
    const scrollLeft = body.scrollLeft + document.documentElement.scrollLeft;
    const scrollTop  = body.scrollTop + document.documentElement.scrollTop;

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

    // Should handle padding

    return { x, y };
  }

  /**
   * Keep this private to avoid double event binding
   * Main logic of the surface is here
   * Should be extended with needed events (mouseenter, mouseleave, wheel ...)
   */
  _bindEvents() {

    // @NOTE add mouseup on body too
    const onMouseDown = (e) => {
      // By removing the previous selection we prevent bypassing the mousemove events coming from SVG in Firefox.
      window.getSelection().removeAllRanges();
      const event = this._createEvent('mousedown', e);

      this.isMouseDown = true;
      this.mouseDownEvent = event;
      this.lastEvent = event;
      // Register mousemove and mouseup listeners on window
      window.addEventListener('mousemove', onMouseMove, false);
      window.addEventListener('mouseup', onMouseUp, false);

      this.emit('event', event);
    };

    const onMouseMove = (e) => {
      let event = this._createEvent('mousemove', e);
      event.defineArea(this.mouseDownEvent, this.lastEvent);
      // Update `lastEvent` for next call
      this.lastEvent = event;

      this.emit('event', event);
    };

    const onMouseUp = (e) => {
      let event = this._createEvent('mouseup', e);
      event.defineArea(this.mouseDownEvent, this.lastEvent);

      this.isMouseDown = false;
      this.mouseDownEvent = null;
      this.lastEvent = null;
      // Remove mousemove and mouseup listeners on window
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      this.emit('event', event);
    };

    const onClick = (e) => {
      let event = this._createEvent('click', e);
      this.emit('event', event);
    };

    const onDblClick = (e) => {
      let event = this._createEvent('dblclick', e);
      this.emit('event', event);
    };

    // Bind callbacks
    this.el.addEventListener('mousedown', onMouseDown, false);
    this.el.addEventListener('click', onClick, false);
    this.el.addEventListener('dblclick', onDblClick, false);
  }
}
