import events from 'events';


/**
 * Main interface for event source
 */
export default class EventSource extends events.EventEmitter {
  constructor(el) {
    super();
    this.el = el;

    this._bindEvents();
  }

  _createEvent(type, e) {}

  _bindEvents() {}
}
