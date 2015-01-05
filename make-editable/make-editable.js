var toFront = require('utils').toFront;
// is actually not es6...
'use strict';

// @TODO merge brushable here
// example use
// var segment = segmentEdit()
//   .params({
//     interactions: {
//       editable: true|false,
//       selectable: true|false
//       brushable: true|false
//     }
//   })

// mixin to add editable properties to a visualiser component
function makeEditable(layer) {var SLICE$0 = Array.prototype.slice;
  // a visualiser to decorate
  var proto = layer.prototype;

  // keep old methods to override
  var defaultDraw = proto.draw;
  var defaultLoad = proto.load;

  var SELECTED_CLASS   = 'selected';
  // var SELECTABLE_CLASS = 'selectable';

  // var SELECTABLE = 'selectable';
  // var EDITABLE  = 'editable';
  // var DRAGGABLE = 'draggable';
  // var BRUSHABLE = 'brushable';

  var editableProperties = {
    load: function(base) {
      // default load
      defaultLoad.apply(this, arguments);
      // bind events callbacks
      this.onMouseDown = this.onMouseDown.bind(this);
      this.onDrag = this.onDrag.bind(this);
      // delegate events according to `interactions` param
      this.delegateEvents();

      return this;
    },

    delegateEvents: function() {
      var interactions = this.param('interactions');

      if (interactions.editable) {
        this.base.on('drag', this.onDrag);
        // being editable implies being selectable
        interactions.selectable = true;
      }

      if (interactions.selectable) {
        this.base.on('mousedown', this.onMouseDown);
      }
    },

    undelegateEvents: function() {
      this.base.removeListener('mousedown', this.onMouseDown);
      this.base.removeListener('drag', this.onDrag);
    },

    onMouseDown: function(e) {
      if (e.button !== 0) { return; }
      // check if the clicked item belongs to the layer
      // should find something more reliable - closest `.item` group ?
      var item = e.target.parentNode;
      // clicked item doesn't belong to this layer
      if (this.items[0].indexOf(item) === -1) {
        item = null;
      }

      this.handleSelection(item, e);
    },

    onDrag: function(e) {
      // if (this.base.brushing()) { return; }
      var item = e.currentTarget;

      if (this.items[0].indexOf(item) === -1) {
        item = null;
      }

      this.handleDrag(item, e);
    },

    // @TODO: `handleSelection` and `handleDrag` could be getters/setters
    // to allow easy override

    // default selection handling - can be shared by all layers ?
    // can be overriden to change behavior - shiftKey, etc.
    handleSelection: function(item, e) {
      this.unselect();

      if (item === null) { return; }

      if (item.classList.contains(SELECTED_CLASS)) {
        this.unselect(item); // @TODO doesn't work
      } else if (!item.classList.contains(SELECTED_CLASS)) {
        this.select(item);
      }
    },

    // handleDrag: function(item, e) {
    //   throw new Error('must be implemented');
    // },

    select: function() {var els = SLICE$0.call(arguments, 0);
      els = (els.length === 0) ?
        this.items :
        this.d3.selectAll(els);

      els.classed(SELECTED_CLASS, true);

      els.each(function() {
        toFront(this);
      })
    },

    unselect: function() {var els = SLICE$0.call(arguments, 0);
      els = (els.length === 0) ?
        this.items :
        this.d3.selectAll(els);

      els.classed(SELECTED_CLASS, false);
    },

  }

  // add editable properties to the layer prototype
  Object.assign(proto, editableProperties);
  return layer;
};

module.exports = makeEditable;
