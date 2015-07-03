const BaseState = require('./base-state');

class CenteredZoomState extends BaseState {
  constructor(timeline) {
    super(timeline);

    this.currentLayer = null;
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
  }

  onMouseMove(e) {
    if (!this.mouseDown) { return; }

    const timeContext = this.timeline.timeContext;
    const lastCenterTime = timeContext.xScale.invert(e.x);

    timeContext.stretchRatio += e.dy / 100;
    timeContext.stretchRatio = Math.max(timeContext.stretchRatio, 0.01);

    const newCenterTime = timeContext.xScale.invert(e.x);
    const delta = newCenterTime - lastCenterTime;
    const offset = timeContext.offset;
    // apply new offset to keep it centered to the mouse
    timeContext.offset += (delta + timeContext.xScale.invert(e.dx));

    // clamp other values here if needed (example: offset < 0, stretchRatio > 1, etc...)

    this.timeline.update();
  }

  onMouseUp(e) {
    this.mouseDown = false;
  }
}

module.exports = CenteredZoomState;
