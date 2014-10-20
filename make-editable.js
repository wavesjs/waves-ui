var extend = require('utils').extend;

// is actually not es6...
'use strict';

function makeEditable(layer) {
  // a visualiser to decorate
  var proto = layer.prototype;

  // keep old methods to override
  var defaultDraw = proto.draw;
  var defaultLoad = proto.load;

  var editableProperties = {
    load: function(base) {
       // default load
      defaultLoad.apply(this, arguments);
      var baseId = base.id();
      // layer events handling
      // base.on(id + ':mousedown', this.mouseDown.bind(this));
      base.on(baseId + ':drag', this.onDrag.bind(this));
      base.on(baseId + ':mouseup', this.mouseUp.bind(this));
      base.on(baseId + ':mouseout', this.base.xZoomSet.bind(this.base));
      // clicking anywhere ouside or inside the container deselects
      document.body.addEventListener('mousedown', this.mouseDown.bind(this));

      return this;
    },
    draw: function(el) {
      // add `selectable` css class on each unit
      this.g.selectAll('.' + this.unitClass).classed('selectable', true);
      defaultDraw.call(this, el);
    },
    mouseUp: function(e) {
      // has to be the svg because the group is virtually not there :(
      var svg = this.base.svg;

      svg.classed('handle-resize', false);
      svg.classed('handle-drag', false);
    },
    mouseDown: function(e) {
      if (e.button !== 0) { return; }
      var item = e.target;

      if (this.clicked(item)) {
        this.itemMouseDown(e);
      } else {
        if (!item.classList.contains('keep-selection')) {
          this.unselectAll();
        }
      }
    },
    unselectAll: function() {
      this.base.svg.selectAll('.selected').classed('selected', false);
    },
    itemMouseDown: function(e) {
      var d3 = this.d3;
      var g = this.g;
      var item = e.target.parentNode; // containing g
      var selects = g.node().querySelectorAll('.selected');
      var isFound = [].indexOf.call(selects, item) >= 0;
      var isSelectable = item.classList.contains('selectable');
      var isSelected = d3.select(item).classed('selected');

      // move selected item to the front
      this.base.toFront(item);

      // we click away or in some other block without shift
      if ((selects.length < 1 || !isFound) && !e.shiftKey) {
        this.unselectAll();
      }

      // shift + was selected: deselect
      if (e.shiftKey && isSelected) {
        d3.select(item).classed('selected', false);
      } else {
        if (isSelectable) {
          d3.select(item).classed('selected', true);
        }
      }
    }
  }

  // add editable properties to the layer prototype
  extend(proto, editableProperties);
  return layer;
};

module.exports = makeEditable;
