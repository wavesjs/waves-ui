import EventSource from './event-source';
import WaveEvent from './wave-event';


export default class Keyboard extends EventSource {
  constructor(el) {
    // kind of singleton
    if (Keyboard._instance) { return Keyboard._instance; }

    super(el);
    this.sourceName = 'keyboard';

    Keyboard._instance = this;
  }

  _createEvent(type, e) {
    const event = new WaveEvent(this.sourceName, type, e);

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

    this.el.addEventListener('keydown', onKeyDown, false);
    this.el.addEventListener('keyup', onKeyUp, false);
  }
}
