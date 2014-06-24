
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
      // base.on(id + ':mousedown', this.mouseDown.bind(this));
      base.on(id + ':drag', this.onDrag.bind(this));
      base.on(id + ':mouseup', this.mouseUp.bind(this));
      base.on(id + ':mouseout', this.base.xZoomSet.bind(this.base));
      
      // clicking anywhere ouside or inside the container deselects
      document.body.addEventListener('mousedown', this.mouseDown.bind(this));

      return this;
    }
  });
 
  Object.defineProperty(edit, 'draw', {
    enumerable: true, value: function(el) {
      // add css for cursors
      this.g.selectAll('.' + this.unitClass).classed('selectable', true);
      defaultDraw.call(this, el);
    }
  });

  Object.defineProperty(edit, 'mouseUp', {
    value: function (ev) {

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

        if(this.clicked(item)) {
          this.itemMousedown(ev);
        } else {
          if(!item.classList.contains('keep-selection')) this.unselectAll();
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
      var isSelected = d3.select(item).classed('selected');

      // move selected item to the front
      this.base.toFront(item);

      // we click away or in some other block without shift
      if((selects.length < 1 || !isFound) && !ev.shiftKey){
        this.unselectAll();
      }

      // shift + was selected: deselect
      if(ev.shiftKey && isSelected){
        d3.select(item).classed('selected', false);
      } else {
        if(isSelectable) d3.select(item).classed('selected', true);
      }

    }
  });

  return edit;
};