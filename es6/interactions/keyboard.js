import EventSource from './event-source';
import WaveEvent from './wave-event';


const body = window.document.body;

/**
 * http://javascript.info/tutorial/keyboard-events
 */
export default class Keyboard extends EventSource {
  constructor(el) {
    super(el);
  }

  _createEvent(type, e) {
    const event = new WaveEvent(type, e);

    event.shiftKey = e.shiftKey;
    event.ctrlKey = e.ctrlKey;
    event.altKey = e.altKey;
    event.metaKey = e.metaKey;
    event.char = String.fromCharCode(e.keyCode);

    return event;
  }

  _bindEvents() {
    const onKeyDown = (e) => {
      let event = this._createEvent('keydown', e);
      this.emit('event', event);
    };

    const onKeyUp = (e) => {
      let event = this._createEvent('keyup', e);
      this.emit('event', event);
    };

    this.el.onkeydown = onKeyDown;
    this.el.onkeyup = onKeyUp;
  }
}
