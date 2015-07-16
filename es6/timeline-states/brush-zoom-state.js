import ns from '../core/namespace';
import BaseState from './base-state';

// works (maybe same problem as CenteredZoom)
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
    this.views.forEach((view) => {
      const interactions = view.$interactions;

      const brush = document.createElementNS(ns, 'rect');
      brush.setAttributeNS(null, 'height', view.height);
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

    this.views.forEach((view) => {
      const timeContext = view.timeContext;
      // update timeContext
      const startX = this.startX;
      const endX = e.x;

      const minTime = timeContext.xScale.invert(Math.max(0, Math.min(startX, endX)));
      const maxTime = timeContext.xScale.invert(Math.max(startX, endX));
      const deltaDuration = maxTime - minTime;

      const stretchRatio = timeContext.duration / deltaDuration;

      view.offset = -minTime;
      view.zoom = stretchRatio;
    });

    this.views.update();
  }

  onKeyDown(e) {
    // reset on space bar
    if (e.originalEvent.keyCode === 32) {
      this.views.offset = 0;
      this.views.zoom = 1;
      this.views.update();
    }
  }
}
