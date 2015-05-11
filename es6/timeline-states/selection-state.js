const BaseState = require('./base-state');
const ns = require('../core/namespace');

class SelectionState extends BaseState {
  constructor(timeline) {
    this.timeline = timeline;
    this.layers = timeline.layers;

    this.interactionsGroup = timeline.interactionsGroup;
    this.currentLayer = null;
    // need a cached
    this.selectedItems = null;
    this.mouseDown = false;
    this.shiftKey = false;
  }

  enter() {
    this.brush = document.createElementNS(ns, 'rect');
    this.brush.style.backgroundColor = '#898989';
    this.brush.style.opacity = 0.08;
    this.interactionsGroup.appendChild(this.brush);
  }

  exit() {
    this._removeBrush();
    this.interactionsGroup.removeChild(this.brush);
  }

  _removeBrush() {
    // reset brush element
    this.brush.setAttributeNS(null, 'transform', 'translate(0, 0)');
    this.brush.setAttributeNS(null, 'width', 0);
    this.brush.setAttributeNS(null, 'height', 0);
  }

  _updateBrush(e) {
    const translate = `translate(${e.area.left}, ${e.area.top})`;
    this.brush.setAttributeNS(null, 'transform', translate);
    this.brush.setAttributeNS(null, 'width', e.area.width);
    this.brush.setAttributeNS(null, 'height', e.area.height);
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

  onKey(e) {
    this.shiftKey = e.shiftKey;
  }

  onMouseDown(e) {
    this.mouseDown = true;
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

    if (newLayer) {
      this.currentLayer = newLayer;
    }

    this.previousSelection = this.currentLayer.selectedItems.slice(0);
    // create brush
    if (!this.shiftKey) { this.currentLayer.unselect(); }
  }

  onMouseMove(e) {
    if (!this.mouseDown) { return; }
    // update brush
    this._updateBrush(e);
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

  onMouseUp(e) {
    if (!this.mouseDown) { return; }
    this.mouseDown = false;
    // remove brush
    this._removeBrush();
  }

  // @NOTE: 'mousedown' and 'mouseup' are called before 'click'
  onClick(e) {
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
