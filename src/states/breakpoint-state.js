import BaseState from './base-state';


/**
 * A state to interact with a breakpoint function, mimicing Max/MSP's
 * breakpoint function interactions.
 *
 * [example usage](./examples/layer-breakpint.html)
 */
export default class BreakpointState extends BaseState {
  constructor(timeline, datumGenerator) {
    super(timeline);

    this.datumGenerator = datumGenerator;
    this.currentEditedLayer = null;
    this.currentTarget = null;
  }

  enter() {}
  exit() {}

  handleEvent(e, hitLayers) {
    switch (e.type) {
      case 'mousedown':
        this.onMouseDown(e, hitLayers);
        break;
      case 'mousemove':
        this.onMouseMove(e, hitLayers);
        break;
      case 'mouseup':
        this.onMouseUp(e, hitLayers);
        break;
    }
  }

  onMouseDown(e, hitLayers) {
    this.mouseDown = true;
    // keep target consistent with mouse down
    this.currentTarget = e.target;
    let updatedLayer = null;

    const layers = hitLayers;

    layers.forEach((layer) => {
      layer.unselect();
      const item = layer.getItemFromDOMElement(e.target);

      if (item === null) {
        // create an item
        const time = layer.timeToPixel.invert(e.x) - this.timeline.offset;
        const value = layer.valueToPixel.invert(layer.params.height - e.y);
        const datum = this.datumGenerator(time, value);

        layer.data.push(datum);
        updatedLayer = layer;
      } else {
        // if shift is pressed, remove the item
        if (e.originalEvent.shiftKey) {
          const data = layer.data;
          const datum = layer.getDatumFromItem(item);
          data.splice(data.indexOf(datum), 1);

          updatedLayer = layer;
        } else {
          this.currentEditedLayer = layer;
          layer.select(item);
        }
      }
    });

    if (updatedLayer) {
      this.timeline.tracks.render(updatedLayer);
      this.timeline.tracks.update(updatedLayer);
    }
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
