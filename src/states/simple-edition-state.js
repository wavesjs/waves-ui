import BaseState from './base-state';


/**
 * A state to select and edit shapes in a simple way. (kind of plug n play state)
 */
export default class SimpleEditionState extends BaseState {
  constructor(timeline) {
    super(timeline);

    this.currentEditedLayer = null;
    this.currentTarget = null;
  }

  enter() {}
  exit() {}

  handleEvent(e) {
    switch (e.type) {
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
    // keep target consistent with mouse down
    this.currentTarget = e.target;

    this.layers.forEach((layer) => {
      if (!layer.hasElement(this.currentTarget)) { return; }

      if (!e.originalEvent.shiftKey) {
        layer.unselect();
      }

      const item = layer.getItemFromDOMElement(this.currentTarget);

      if (item === null) { return; }

      this.currentEditedLayer = layer;
      requestAnimationFrame(function() { layer.select(item); });
    });
  }

  onMouseMove(e) {
    if (!this.currentEditedLayer) { return; }

    const layer = this.currentEditedLayer;
    const items = layer.selectedItems;

    layer.edit(items, e.dx, e.dy, this.currentTarget);
    requestAnimationFrame(function() { layer.update(items); });
  }

  onMouseUp(e) {
    this.currentEditedLayer = null;
  }
}
