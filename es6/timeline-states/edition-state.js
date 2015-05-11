const BaseState = require('./base-state');

class EditionState extends BaseState {
  constructor(timeline) {
    this.timeline = timeline;
    this.layers = timeline.layers;

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
      if (layer.hasItem(e.target)) {
        this.currentEditedLayer = layer;
      }
    });
  }

  onMouseMove(e) {
    if (!this.mouseDown || !this.currentEditedLayer) { return; }

    const layer = this.currentEditedLayer;
    const items = layer.selectedItems;
    // the loop should be in layer to match select / unselect API
    items.forEach((item) => {
      layer.edit(item, e.dx, e.dy, this.currentTarget);
    });

    layer.update(items);
  }

  onMouseUp(e) {
    this.currentEditedLayer = null;
    this.mouseDown = false;
  }
}

module.exports = EditionState;
