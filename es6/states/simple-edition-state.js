import BaseState from './base-state';


/**
 *  a simple plug and play state - select and edit
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
    this.mouseDown = true;
    // keep target consistent with mouse down
    // @NOTE: move this to Surface ?
    this.currentTarget = e.target;

    this.layers.forEach((layer) => {
      if (!layer.hasElement(this.currentTarget)) { return; }

      if (!e.originalEvent.shiftKey) {
        layer.unselect();
      }

      const item = layer.getItemFromDOMElement(this.currentTarget);

      if (item === null) { return; }

      this.currentEditedLayer = layer;
      layer.select(item);
    });
  }

  onMouseMove(e) {
    if (!this.mouseDown || !this.currentEditedLayer) { return; }

    this.layers.forEach((layer) => {
      const items = layer.selectedItems;

      layer.edit(items, e.dx, e.dy, this.currentTarget);
      layer.update(items);
    });
  }

  onMouseUp(e) {
    this.currentEditedLayer = null;
    this.mouseDown = false;
  }
}
