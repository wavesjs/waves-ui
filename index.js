
/* global d3 */
"use strict";

module.exports = function makeEditable(graph){

  // a visualiser to decorate
  var edit = graph;

  // keep old methods to override
  var defaultDraw = edit.draw;
  var defaultLoad = edit.load;

  // overrides load to add editing capablilities
  Object.defineProperty(edit, 'load', {
    value: function(base) {

      // default load
      defaultLoad.call(this, base);
      var id = base.id();
      var g = base.g;

      // edition events handling
      base.on(id + ':mousedown', this.mouseDown.bind(this));
      base.on(id + ':drag', this.onDrag.bind(this));
      base.on(id + ':mouseup', this.mouseUp.bind(this));
      
      // clicking anywhere ouside the container deselects
      document.body.addEventListener('mousedown', this.mouseDown.bind(this));

      return this;
    }
  });
 
  Object.defineProperty(edit, 'draw', {
    enumerable: true, value: function(el) {
      // add css for cursors
      this.g.selectAll('.item').classed('selectable', true);
      defaultDraw.call(this, el);
    }
  });

  Object.defineProperty(edit, 'mouseUp', {
    value: function () {
        // has to be the svg because the group is virtually not there :(
        this.base.svg.classed('handle-resize', false);
        this.base.svg.classed('handle-drag', false);
      }
  });

  // mouse down ev handler
  Object.defineProperty(edit, 'mouseDown', {
    value: function(ev) {
      if(ev.button === 0) {
        var item = ev.target;

        if(this.hits(item)) {
          this.itemMousedown(ev);
        } else {
          this.unselectAll();
        }

      }
    }
  });

  // mouse down on the svg element deselects
  Object.defineProperty(edit, 'unselectAll', {
    value: function svgMousedown() {
      this.base.svg.selectAll('.selected').classed('selected', false);
    }
  });

  // mousedown on the segments selects them and should trigger an event
  Object.defineProperty(edit, 'itemMousedown', {
    value: function itemMousedown(ev) {

      var g = this.g;
      var item = ev.target.parentNode; // containing g
      var selects = g.node().querySelectorAll('.selected');
      var isFound = [].indexOf.call(selects, item) >= 0;
      var isSelectable = item.classList.contains('selectable');

      if((selects.length < 1 || !isFound) && !ev.shiftKey){
        this.unselectAll();
      }
      if(isSelectable) d3.select(item).classed('selected', true);
    }
  });

  return edit;
};