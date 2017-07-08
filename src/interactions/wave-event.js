/**
 * Object template for all events. Event sources should use this event template
 * in order to keep consistency with existing sources.
 */
export default class WaveEvent {
  /**
   * @param {String} source - The name of the source (`keyboard`, `surface`, ...).
   * @param {String} type - The type of the source (`mousedown`, `keyup`, ...).
   * @param {Event} originalEvent - The original event as emitted by the browser.
   */
  constructor(source, type, originalEvent) {
    this.source = source;
    this.type = type;
    this.originalEvent = originalEvent;

    this.target = originalEvent.target;
    this.currentTarget = originalEvent.currentTarget;
  }
}
