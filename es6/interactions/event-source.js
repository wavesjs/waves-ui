/**
 *  main interface for event source
 */
const events = require('events');

class EventSource extends events.EventEmitter {
  constructor(el) {
    super();
    this.el = el;

    this._bindEvents();
  }

  _createEvent(type, e) {}

  _bindEvents() {}
}

module.exports = EventSource;
