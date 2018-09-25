import EventSource from './EventSource';
import WaveEvent from './WaveEvent';


/**
 * A global event sourve for the keyboard. Only one instance of this source
 * can be created. The first created timeline instanciate the singleton, each
 * subsequent instanciation returns the first created instance.
 */
class Keyboard extends EventSource {
  /**
   * @param {Element} $el - The element on which to install the listener.
   */
  constructor($el) {
    super($el);
    /**
     * The name of the source
     * @type {String}
     */
    this.sourceName = 'keyboard';

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);

    this.bindEvents();
  }

  createEvent(type, e) {
    const event = new WaveEvent(this.sourceName, type, e);

    event.shiftKey = e.shiftKey;
    event.ctrlKey = e.ctrlKey;
    event.altKey = e.altKey;
    event.metaKey = e.metaKey;
    event.which = e.which;
    event.char = String.fromCharCode(e.which);

    return event;
  }

  bindEvents() {
    this.$el.addEventListener('keydown', this._onKeyDown, false);
    this.$el.addEventListener('keyup', this._onKeyUp, false);
  }

  unbindEvents() {
    this.$el.removeEventListener('keydown', this._onKeyDown, false);
    this.$el.removeEventListener('keyup', this._onKeyUp, false);
  }

  _onKeyDown(e) {
    let event = this.createEvent('keydown', e);
    this.emit('event', event);
  }

  _onKeyUp(e) {
    let event = this.createEvent('keyup', e);
    this.emit('event', event);
  }
}

export default Keyboard;
