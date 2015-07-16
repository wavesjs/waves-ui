export default class BaseState {
  constructor(timeline, options = {}) {
    this.timeline = timeline;
  }

  get views() {
    return this.timeline.views;
  }

  get layers() {
    return this.timeline.views.layers;
  }

  /**
   * Called when the timeline is entering the state
   */
  enter() {}

  /**
   * Called when the timeline is exiting the state
   */
  exit() {}

  /**
   * handle registered inputs from surface, keyboard, etc...
   * @param {Event} e - the event to process
   */
  handleEvent(e) {}
}
