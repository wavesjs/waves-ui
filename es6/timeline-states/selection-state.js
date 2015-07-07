const BaseState = require('./base-state');
const ns = require('../core/namespace');


/**
 *  @NOTE Broken
 */
class SelectionState extends BaseState {
  constructor(timeline /*, options = {} */) {
    super(timeline /*, options */);

    this.currentLayer = null;
    // need a cached
    this.selectedItems = null;
    this.mouseDown = false;
    this.shiftKey = false;
  }

  enter() {

  }

  exit() {
    const containers = this.timeline.containers;

    for (let id in containers) {
      this._removeBrush(containers[id]);
    }
  }

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
      case 'click':
        this.onClick(e);
        break;
      case 'keydown':
        this.onKey(e);
        break;
      case 'keyup':
        this.onKey(e);
        break;
    }
  }

  _addBrush(container) {
    if (container.brushElement !== null) { return; }

    const brush = document.createElementNS(ns, 'rect');
    brush.style.fill = '#686868';
    brush.style.opacity = 0.2;

    container.interactionsElement.appendChild(brush);
    container.brushElement = brush;
  }

  _removeBrush(container) {
    if (container.brushElement === null) { return; }

    this._resetBrush(container.brushElement);
    container.interactionsElement.removeChild(container.brushElement);
    container.brushElement = null;
  }

  _resetBrush(container) {
    const brushElement = container.brushElement;
    // reset brush element
    brushElement.setAttributeNS(null, 'transform', 'translate(0, 0)');
    brushElement.setAttributeNS(null, 'width', 0);
    brushElement.setAttributeNS(null, 'height', 0);
  }

  _updateBrush(e, container) {
    const brushElement = container.brushElement;
    const translate = `translate(${e.area.left}, ${e.area.top})`;

    brushElement.setAttributeNS(null, 'transform', translate);
    brushElement.setAttributeNS(null, 'width', e.area.width);
    brushElement.setAttributeNS(null, 'height', e.area.height);
  }

  onKey(e) {
    this.shiftKey = e.shiftKey;
  }

  onMouseDown(e) {
    this.mouseDown = true;

    const container = this.timeline.getContainerFromDOMElement(e.currentTarget);
    this.currentContainer = container;
    this._addBrush(container);

    let newLayer;
    // find the layer
    for (let layer of this.layers) {
      if (layer.hasItem(e.target)) {
        newLayer = layer;
        break;
      }
    }

    if (this.currentLayer && newLayer && newLayer !== this.currentLayer) {
      this.currentLayer.unselectAll();
    }

    if (newLayer && newLayer !== this.currentLayer) {
      this.currentLayer = newLayer;
    }

    if (!this.currentLayer) { return; }

    this.previousSelection = this.currentLayer.selectedItems.slice(0);
    // create brush
    if (!this.shiftKey) { this.currentLayer.unselect(); }
  }

  onMouseMove(e) {
    if (!this.mouseDown) { return; }

    const container = this.timeline.getContainerFromDOMElement(this.currentLayer);
    // update brush
    this._updateBrush(e, this.currentContainer);

    if (this.currentLayer) {
      // select all dots in area
      const items = this.currentLayer.getItemsInArea(e.area);
      const currentSelection = this.currentLayer.selectedItems;
      // 1. select all items
      items.forEach((item) => this.currentLayer.select(item));
      // handle shift key
      if (this.shiftKey) {
        this.previousSelection.forEach((item) => {
          if (items.indexOf(item) !== -1) {
            // 2.1  if the item was is not in item, unselect it
            this.currentLayer.unselect(item);
          } else {
            // 2.2  else select it
            this.currentLayer.select(item);
          }
        });
      }

      // 3. if an item of the current selection is no more in the items
      //    and is not in previous selection, unselect it
      currentSelection.forEach((item) => {
        if (
          items.indexOf(item) === -1 &&
          this.previousSelection.indexOf(item) === -1
        ) {
          this.currentLayer.unselect(item);
        }
      });
    }
  }

  onMouseUp(e) {
    if (!this.mouseDown) { return; }
    this.mouseDown = false;
    // reset brushElement
    this._resetBrush(this.currentContainer);
  }

  // @NOTE: 'mousedown' and 'mouseup' are called before 'click'
  onClick(e) {
    if (!this.currentLayer) { return; }

    const item = this.currentLayer.hasItem(e.target);
    // if no item - unselect all
    if (this.previousSelection.length !== 0 && !this.shiftKey) {
      this.currentLayer.unselectAll();
    }

    // toggle otherwise
    if (item) {
      if (this.previousSelection.indexOf(item) === -1) {
        this.currentLayer.select(item);
      } else {
        this.currentLayer.unselect(item);
      }
    }
  }
}

module.exports = SelectionState;
