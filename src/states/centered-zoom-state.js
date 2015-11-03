import scales from '../utils/scales';
import BaseState from './base-state';


/**
 * `CenteredZoomState` is a timeline state mimicing the `Live` zoom interaction. It allows the user to browse the timeline by clicking on a track, and then
 * - moving down to zoom in
 * - moving up to zoom out
 * - moving left to move in time, after
 * - moving right to move in time, before
 *
 * [example usage](./examples/states-zoom.html)
 */
export default class CenteredZoomState extends BaseState {
  constructor(timeline) {
    super(timeline);
    this.currentLayer = null;
    // Set max/min zoom
    // maxZoom: 1px per sample
    // minZoom: 10 000 px per 1 hour
    // with a default to 44.1kHz sample rate
    this.maxZoom = 44100 * 1 / this.timeline.timeContext.pixelsPerSecond;
    this.minZoom = 10000 / 3600 / this.timeline.timeContext.pixelsPerSecond;
  }

  handleEvent(e) {
    switch(e.type) {
      case 'mousedown':
        this.onMouseDown(e);
        break;
      case 'mousemove':
        this.onMouseMove(e);
        break;
      case 'mouseup':
        this.onMouseUp(e);
        break;
    }
  }

  onMouseDown(e) {
    this.initialZoom = this.timeline.timeContext.zoom;
    this.initialY = e.y;

    this._pixelToExponent = scales.linear()
      .domain([0, 100]) // 100px => factor 2
      .range([0, 1]);
  }

  onMouseMove(e) {
    // prevent annoying text selection when dragging
    e.originalEvent.preventDefault();

    const timeContext = this.timeline.timeContext;
    const lastCenterTime = timeContext.timeToPixel.invert(e.x);
    const exponent = this._pixelToExponent(e.y - this.initialY);
    const targetZoom = this.initialZoom * Math.pow(2, exponent); // -1...1 -> 1/2...2

    timeContext.zoom = Math.min(Math.max(targetZoom, this.minZoom), this.maxZoom);

    const newCenterTime = timeContext.timeToPixel.invert(e.x);
    const delta = newCenterTime - lastCenterTime;

    // Apply new offset to keep it centered to the mouse
    timeContext.offset += (delta + timeContext.timeToPixel.invert(e.dx));

    // Other possible experiments with centered-zoom-state
    //
    // Example 1: Prevent timeline.offset to be negative
    // timeContext.offset = Math.min(timeContext.offset, 0);
    //
    // Example 2: Keep in container when zoomed out
    // if (timeContext.stretchRatio < 1) {
    //   const minOffset = timeContext.timeToPixel.invert(0);
    //   const maxOffset = timeContext.timeToPixel.invert(view.width - timeContext.timeToPixel(timeContext.duration));
    //   timeContext.offset = Math.max(timeContext.offset, minOffset);
    //   timeContext.offset = Math.min(timeContext.offset, maxOffset);
    // }

    this.timeline.tracks.update();
  }

  onMouseUp(e) {}
}
