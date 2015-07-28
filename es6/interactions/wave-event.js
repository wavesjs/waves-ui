// base class for all Events
// @NOTE: use a single Event per Surface
export default class WaveEvent {
  constructor(type, originalEvent) {
    this.type = type;
    this.originalEvent = originalEvent;

    this.target = originalEvent.target;
    this.currentTarget = originalEvent.currentTarget;
  }
}
