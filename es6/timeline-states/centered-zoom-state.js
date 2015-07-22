import d3Scale from 'd3-scale';

import BaseState from './base-state';


/**
 * `CenteredZoomState` is a timeline state that allows the user to browse the timeline by clicking on a track, and then
 * - moving down to zoom in
 * - moving up to zoom out
 * - moving left to move in time, after
 * - moving right to move in time, before
 */
export default class CenteredZoomState extends BaseState {
  constructor(timeline) {
    super(timeline);
    this.currentLayer = null;
    // Set max/min zoom
    // maxZoom: 1px per sample
    // minZoom: 10 000 px per 1 hour
    // with a default to 44.1kHz sample rate
    this.maxZoom = 44100*1/this.timeline.timeContext.pixelsPerSecond;
    this.minZoom = 10000/3600/this.timeline.timeContext.pixelsPerSecond;
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
    this.mouseDown = true;
    const actualZoom = this.timeline.timeContext.zoom;
    const initialY = e.y;
    this.yScale = d3Scale.linear()
                    .domain([initialY, 0])
                    .range([actualZoom, -2*actualZoom]);
  }

  onMouseMove(e) {
    if (!this.mouseDown) { return; }

    const timeContext = this.timeline.timeContext;
    const lastCenterTime = timeContext.xScale.invert(e.x);

    timeContext.zoom = Math.min(Math.max(this.yScale(e.y), this.minZoom), this.maxZoom);

    const newCenterTime = timeContext.xScale.invert(e.x);
    const delta = newCenterTime - lastCenterTime;

    // Apply new offset to keep it centered to the mouse
    timeContext.offset += (delta + timeContext.xScale.invert(e.dx));

    // Other possible experiments with centered-zoom-state
    //
    // Example 1: Prevent timeline.offset to be negative
    // timeContext.offset = Math.min(timeContext.offset, 0);
    //
    // Example 2: Keep in container when zoomed out
    // if (timeContext.stretchRatio < 1) {
    //   const minOffset = timeContext.xScale.invert(0);
    //   const maxOffset = timeContext.xScale.invert(view.width - timeContext.xScale(timeContext.duration));
    //   timeContext.offset = Math.max(timeContext.offset, minOffset);
    //   timeContext.offset = Math.min(timeContext.offset, maxOffset);
    // }

    this.timeline.tracks.update();
  }

  onMouseUp(e) {
    this.mouseDown = false;
  }
}
