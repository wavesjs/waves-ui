import events from 'events';


/**
 * Abstract class to extend to create new sources of interactions.
 * A `Surface` and `Keyboard` event sources are provided.
 */
export default class EventSource extends events.EventEmitter {
  constructor($el) {
    super();
    /**
     * The element on which the listener is added
     * @type {Element}
     */
    this.$el = $el;

    this._bindEvents();
  }

  _createEvent(type, e) {}

  _bindEvents() {}
}
