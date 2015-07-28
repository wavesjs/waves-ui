import BaseState from './base-state';
import ns from '../core/namespace';


/**
 *  @NOTE Broken
 */
export default class SelectionState extends BaseState {
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

  _addBrush(track) {
    if (track.$brush) { return; }

    const brush = document.createElementNS(ns, 'rect');
    brush.style.fill = '#686868';
    brush.style.opacity = 0.2;

    track.$interactions.appendChild(brush);
    track.$brush = brush;
  }

  _removeBrush(track) {
    if (track.$brush === null) { return; }

    this._resetBrush(track);
    track.$interactions.removeChild(track.$brush);
    delete track.$brush;
  }

  _resetBrush(track) {
    const $brush = track.$brush;
    // reset brush element
    $brush.setAttributeNS(null, 'transform', 'translate(0, 0)');
    $brush.setAttributeNS(null, 'width', 0);
    $brush.setAttributeNS(null, 'height', 0);
  }

  _updateBrush(e, track) {
    const $brush = track.$brush;
    const translate = `translate(${e.area.left}, ${e.area.top})`;

    $brush.setAttributeNS(null, 'transform', translate);
    $brush.setAttributeNS(null, 'width', e.area.width);
    $brush.setAttributeNS(null, 'height', e.area.height);
  }

  onKey(e) {
    this.shiftKey = e.shiftKey;
  }

  onMouseDown(e) {
    this._currentTrack = this.timeline.getTrackFromDOMElement(e.target);
    if (!this._currentTrack) { return; }

    this._addBrush(this._currentTrack);
    // const container = this.timeline.getContainerFromDOMElement(e.currentTarget);
    // this.currentContainer = container;


    // let newLayer;
    // find the layer
    // for (let layer of this.layers) {
    //   if (layer.hasItem(e.target)) {
    //     newLayer = layer;
    //     break;
    //   }
    // }

    // if (this.currentLayer && newLayer && newLayer !== this.currentLayer) {
    //   this.currentLayer.unselectAll();
    // }

    // if (newLayer && newLayer !== this.currentLayer) {
    //   this.currentLayer = newLayer;
    // }

    // if (!this.currentLayer) { return; }

    // this.previousSelection = this.currentLayer.selectedItems.slice(0);
    // // create brush
    // if (!this.shiftKey) { this.currentLayer.unselect(); }
  }

  onMouseMove(e) {
    this._updateBrush(e, this._currentTrack);

    this._currentTrack.layers.forEach((layer) => {
      const previousSelectedItems = layer.selectedItems;
      const newSelectedItems = layer.getItemsInArea(e.area);

      // if is not pressed
      if (!e.originalEvent.shiftKey) {
        layer.unselect(previousSelectedItems);
        layer.select(newSelectedItems);
      } else {
        const toSelect = [];
        const toUnselect = [];
      }
    });

    // if (this.currentLayer) {
    //   // select all dots in area
    //   const items = this.currentLayer.getItemsInArea(e.area);
    //   const currentSelection = this.currentLayer.selectedItems;
    //   // 1. select all items
    //   items.forEach((item) => this.currentLayer.select(item));
    //   // handle shift key
    //   if (this.shiftKey) {
    //     this.previousSelection.forEach((item) => {
    //       if (items.indexOf(item) !== -1) {
    //         // 2.1  if the item was is not in item, unselect it
    //         this.currentLayer.unselect(item);
    //       } else {
    //         // 2.2  else select it
    //         this.currentLayer.select(item);
    //       }
    //     });
    //   }

    //   // 3. if an item of the current selection is no more in the items
    //   //    and is not in previous selection, unselect it
    //   currentSelection.forEach((item) => {
    //     if (
    //       items.indexOf(item) === -1 &&
    //       this.previousSelection.indexOf(item) === -1
    //     ) {
    //       this.currentLayer.unselect(item);
    //     }
    //   });
    // }
  }

  onMouseUp(e) {
    this._removeBrush(this._currentTrack);

  }

  // @NOTE: 'mousedown' and 'mouseup' are called before 'click'
  onClick(e) {
    if (!this._currentTrack) { return; }

    this._currentTrack.layers.forEach((layer) => {
      let item = layer.getItemFromDOMElement(e.target);

      if (!e.originalEvent.shiftKey) {
        layer.unselect();
      }

      if (item) {
        const method = layer.selectedItems.indexOf(item) !== -1 ? 'unselect' : 'select';
        layer[method](item);
      }
    });
  }
}
