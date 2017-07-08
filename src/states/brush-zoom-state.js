import ns from '../core/namespace';
import BaseState from './base-state';


/**
 * Protools like zoom with zone selection. Press space bar to reset zoom.
 *
 * [example usage](./examples/states-zoom.html)
 *
 * @todo - could also handle `g` and `h` keys to zoom-in, zoom-out.
 */
export default class BrushZoomState extends BaseState {
  constructor(timeline) {
    super(timeline);
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
      case 'keydown':
        this.onKeyDown(e);
        break;
    }
  }

  onMouseDown(e) {
    this.brushes = [];
    this.startX = e.x;
    // create brush in each containers
    this.tracks.forEach((track) => {
      const interactions = track.$interactions;

      const brush = document.createElementNS(ns, 'rect');
      brush.setAttributeNS(null, 'height', track.height);
      brush.setAttributeNS(null, 'y', 0);
      brush.style.fill = '#787878';
      brush.style.opacity = 0.2;

      interactions.appendChild(brush);

      this.brushes.push(brush);
    });
  }

  onMouseMove(e) {
    // update brush
    const width = Math.abs(e.x - this.startX);
    const x = Math.min(e.x, this.startX);

    this.brushes.forEach((brush) => {
      brush.setAttributeNS(null, 'width', width);
      brush.setAttributeNS(null, 'x', x);
    });
  }

  onMouseUp(e) {
    // remove brush
    this.brushes.forEach((brush) => {
      brush.parentNode.removeChild(brush);
    });

    // update timeContext
    const startX = this.startX;
    const endX = e.x;
    // return if no drag
    if (Math.abs(startX - endX) < 1) { return; }

    const leftX = Math.max(0, Math.min(startX, endX));
    const rightX = Math.max(startX, endX);

    let minTime = this.timeline.timeToPixel.invert(leftX);
    let maxTime = this.timeline.timeToPixel.invert(rightX);

    const deltaDuration = maxTime - minTime;
    const zoom = this.timeline.visibleDuration / deltaDuration;

    this.timeline.offset -= minTime;
    this.timeline.zoom *= zoom;

    this.tracks.update();
  }

  onKeyDown(e) {
    // reset on space bar
    if (e.originalEvent.keyCode === 32) {
      this.timeline.offset = 0;
      this.timeline.zoom = 1;
      this.tracks.update();
    }
  }
}
