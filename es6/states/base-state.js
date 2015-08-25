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
   * returns an array of the layers which positions
   * and sizes matches a pointer Event
   * @param {WavesEvent} e - the event from the Surface
   * @return {Array} - matched layers
   */
  getHitLayers(e) {
    const clientX = e.originalEvent.clientX;
    const clientY = e.originalEvent.clientY;
    let layers = [];

    this.layers.forEach((layer) => {
      if (!layer.params.hittable) { return; }
      const br = layer.$el.getBoundingClientRect();

      if (
        clientX > br.left && clientX < br.right &&
        clientY > br.top && clientY < br.bottom
      ) {
        layers.push(layer);
      }
    });

    return layers;
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
