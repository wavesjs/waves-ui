import BaseState from './base-state';


/**
 * A state to edit shapes in the more general way. Interact only with selected shapes.
 */
export default class EditionState extends BaseState {
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
    this.currentTarget = e.target;
  }

  onMouseMove(e) {
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
