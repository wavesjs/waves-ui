
class BaseState {
  constructor(timeline, options = {}) {
    this.timeline = timeline;
    this.layers = timeline.layers;
    // this.interactionsGroup = options.interactionsGroup;
  }

  /**
   *  Called when the timeline is entering the state
   */
  enter() {}

  /**
   *  Called when the timeline is exiting the state
   */
  exit() {}

  /**
   *  handle registered inputs from surface, keyboard, etc...
   *  @param {Event} the event to process
   */
  handleEvent(e) {}
}

module.exports = BaseState;