import BaseState from './base-state';
import TimeContextBehavior from '../behaviors/time-context-behavior';


/**
 * A state to interact directly with layers time contexts.
 *
 * [example usage, see. advanced usage](./examples/layer-waveform.html)
 */
export default class ContextEditionState extends BaseState {
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
    }
  }

  onMouseDown(e) {
    this.mouseDown = true;
    this.currentTarget = e.target;

    for (let i = 0, l = this.layers.length; i < l; i++) {
      const layer = this.layers[i];
      if (layer.hasElement(e.target)) {
        this.currentLayer = layer;
        break;
      }
    }
  }

  onMouseMove(e) {
    if (!this.mouseDown || !this.currentLayer) { return; }

    const layer = this.currentLayer;
    const target = this.currentTarget;

    // in this example the context is stretched when shift is pressed
    if (!e.originalEvent.shiftKey) {
      layer.editContext(e.dx, e.dy, target);
    } else {
      layer.stretchContext(e.dx, e.dy, target);
    }

    this.timeline.tracks.update(layer);
  }

  onMouseUp(e) {
    this.mouseDown = false;
    this.currentTarget = null;
    this.currentLayer = null;
  }
}
