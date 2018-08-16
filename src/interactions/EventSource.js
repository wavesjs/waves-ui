import { EventEmitter } from 'events';


/**
 * Abstract class to extend to create new sources of interactions.
 * A `Surface` and `Keyboard` event sources are provided.
 */
class EventSource extends EventEmitter {
  constructor($el) {
    super();
    /**
     * The element on which the listener is added
     * @type {Element}
     */
    this.$el = $el;
  }

  destroy() {
    this.unbindEvents();
  }

  createEvent(type, e) {}

  bindEvents() {}

  unbindEvents() {}
}

export default EventSource;
