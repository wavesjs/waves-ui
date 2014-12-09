var extend = require('utils').extend;

// is actually not es6...
'use strict';

// mixin to add editable properties to a visualiser component
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

      this.param('isEditable', true);
      // bind events callbacks
      this.mouseDown = this.mouseDown.bind(this);
      this.onDrag = this.onDrag.bind(this);
      this.mouseUp = this.mouseUp.bind(this);
      this.mouseLeave = this.base.xZoomSet.bind(this.base);
      // layer events handling
      this.delegateEvents();

      return this;
    },

    delegateEvents: function() {
      this.base.on('mousedown', this.mouseDown);
      this.base.on('drag', this.onDrag);
      this.base.on('mouseup', this.mouseUp);
      this.base.on('mouseleave', this.mouseLeave);
    },

    undelegateEvents: function() {
      this.base.removeListener('mousedown', this.mouseDown);
      this.base.removeListener('drag', this.onDrag);
      this.base.removeListener('mouseup', this.mouseUp);
      this.base.removeListener('mouseleave', this.mouseLeave);
    },

    draw: function(el) {
      // add `selectable` css class on each unit
      this.g.selectAll('.' + this.param('unitClass'))
        .classed('selectable', true);

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
        this.unselectAll();
      }

      // @TODO: clicking anywhere ouside or inside the container deselects
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
      } else if (isSelectable) {
        d3.select(item).classed('selected', true);
      }
    }
  }

  // add editable properties to the layer prototype
  extend(proto, editableProperties);
  return layer;
};

module.exports = makeEditable;
