import BaseState from './base-state';
import ns from '../core/namespace';


/**
 * A state to select shapes.
 */
export default class SelectionState extends BaseState {
  constructor(timeline /*, options = {} */) {
    super(timeline /*, options */);

    this.currentLayer = null;
    // need a cached
    this.selectedItems = null;
    this.mouseDown = false;
    this.shiftKey = false;

    this._layerSelectedItemsMap = new Map();
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

    // recreate the map
    this._layerSelectedItemsMap = new Map();
    this._currentTrack.layers.forEach((layer) => {
      this._layerSelectedItemsMap.set(layer, layer.selectedItems.slice(0));
    });
  }

  onMouseMove(e) {
    this._updateBrush(e, this._currentTrack);

    this._currentTrack.layers.forEach((layer) => {
      const currentSelection = layer.selectedItems;
      const currentItems = layer.getItemsInArea(e.area);

      // if is not pressed
      if (!e.originalEvent.shiftKey) {
        layer.unselect(currentSelection);
        layer.select(currentItems);
      } else {
        const toSelect = [];
        const toUnselect = [];
        // use the selection from the previous drag
        const previousSelection = this._layerSelectedItemsMap.get(layer);
        // toUnselect = toUnselect.concat(previousSelectedItems);

        currentItems.forEach((item) => {
          if (previousSelection.indexOf(item) === -1) {
            toSelect.push(item);
          } else {
            toUnselect.push(item);
          }
        });

        currentSelection.forEach((item) => {
          if (
            currentItems.indexOf(item) === -1 &&
            previousSelection.indexOf(item) === -1
          ) {
            toUnselect.push(item);
          }
        });

        layer.unselect(toUnselect);
        layer.select(toSelect);
      }
    });
  }

  onMouseUp(e) {
    this._removeBrush(this._currentTrack);
  }

  onClick(e) {
    if (!this._currentTrack) { return; }

    this._currentTrack.layers.forEach((layer) => {
      let item = layer.getItemFromDOMElement(e.target);

      if (!e.originalEvent.shiftKey) {
        layer.unselect();
      }

      if (item) {
        layer.toggleSelection(item);
      }
    });
  }
}
