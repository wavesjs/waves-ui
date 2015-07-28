/**
* `State` instances are used to define the application logic by precising specific user interaction cases, and how they impact the overal temporal representation.
* States manage interactions like zooming, browsing, or editing the timeline.
* Customized states should extend this BaseState.
*/
export default class BaseState {
  constructor(timeline, options = {}) {
    this.timeline = timeline;
  }

  /**
   * Get timeline views
   */
  get tracks() {
    return this.timeline.tracks;
  }

  /**
   * Get timeline layers
   */
  get layers() {
    return this.timeline.tracks.layers;
  }

  /**
   * Called when the timeline is entering the state
   */
  enter() {}

  /**
   * Called when the timeline is leaving the state
   */
  exit() {}

  /**
   * handle registered inputs from mouse and keyboard
   * @param {Event} e - the event to process
   */
  handleEvent(e) {}
}
