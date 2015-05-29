const EventSource = require('./event-source');
const Event  = require('./event');
const body = window.document.body;

class Surface extends EventSource {
  /**
   * @param el <DOMElement> the DOM element to monitore
   * @param padding <Object> the padding of the current surface @TODO
   */
  constructor(el /*, padding */) {
    super(el);

    // this.isMouseDown = false;
    this.mouseDownEvent = null;
    this.lastEvent = null;
  }

  /**
   *  factory method for `Event` class
   */
  _createEvent(type, e) {
    const event = new Event(type, e);

    const pos = this._getRelativePosition(e);
    event.x = pos.x;
    event.y = pos.y;

    return event;
  }

  /**
   * @param  e <Event> raw event from listener
   * @return <Object> the x, y coordinates coordinates relative to the surface element
   */
  _getRelativePosition(e) {
    // @TODO: should be able to ignore padding
    let x = 0;
    let y = 0;
    const clientRect = this.el.getBoundingClientRect();
    const scrollLeft = body.scrollLeft + document.documentElement.scrollLeft;
    const scrollTop  = body.scrollTop + document.documentElement.scrollTop;

    // adapted from http://www.quirksmode.org/js/events_properties.html#position
    if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    } else if (e.clientX || e.clientY) {
      // normalize to pageX, pageY
      x = e.clientX + scrollLeft;
      y = e.clientY + scrollTop;
    }

    // clientRect refers to the client, not to the page
    x = x - (clientRect.left + scrollLeft);
    y = y - (clientRect.top  + scrollTop );

    // should handle padding

    return { x, y };
  }

  /**
   * keep this private to avoir double event binding
   * main logic of the surface is here
   * should be extended with needed events
   * @NOTE should we stop the propagation inside the timeline ?
   */
  _bindEvents() {

    // @NOTE add mouseup on body too
    var onMouseDown = (e) => {
      // e.stopPropagation();
      let event = this._createEvent('mousedown', e);

      this.isMouseDown = true;
      this.mouseDownEvent = event;
      this.lastEvent = event;
      // register mouse move on body - more user friendly
      body.addEventListener('mousemove', onMouseMove, false);
      // console.log(event);

      this.emit('event', event);
    }

    var onMouseMove = (e) => {
      // e.stopPropagation();
      let event = this._createEvent('mousemove', e);
      event.defineArea(this.mouseDownEvent, this.lastEvent);
      // update `lastEvent` for next call
      this.lastEvent = event;

      this.emit('event', event);
    }

    var onMouseUp = (e) => {
      // e.stopPropagation();
      let event = this._createEvent('mouseup', e);
      event.defineArea(this.mouseDownEvent, this.lastEvent);

      this.isMouseDown = false;
      this.mouseDownEvent = null;
      this.lastEvent = null;
      // remove listener on
      body.removeEventListener('mousemove', onMouseMove);

      this.emit('event', event);
    }

    var onClick = (e) => {
      // e.stopPropagation();
      let event = this._createEvent('click', e);
      this.emit('event', event);
    }

    var onDblClick = (e) => {
      // e.stopPropagation();
      let event = this._createEvent('dblclick', e);
      this.emit('event', event);
    }

    // bind callbacks
    this.el.addEventListener('mousedown', onMouseDown, false);
    this.el.addEventListener('mouseup', onMouseUp, false);
    this.el.addEventListener('click', onClick, false);
    this.el.addEventListener('dblclick', onDblClick, false);

    // let svgs = this.el.querySelectorAll('svg');
    // console.log(svgs);
    // for (let i = 0, l = svgs.length; i < l; i++) {
    //   svgs[i].addEventListener('mousedown', onMouseDown, false);
    // }

    // @TODO: mouseenter, mouseleave, wheel ?
  }
}

module.exports = Surface;
