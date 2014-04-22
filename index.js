
/* global d3 */
"use strict";

var createSegVis = require('seg-vis');

// exports an augmented segment
// ----------------------------

module.exports = function createSegmentEditor(options){

  // a simple segment visualizer to decorate
  var edit = createSegVis(options);

  // keep old methods to override
  edit.defaultDraw = edit.draw;
  edit.defaultLoad = edit.load;

  // overrides load to add editing capablilities
  Object.defineProperty(edit, 'load', {
    value: function(base) {

      // default load
      this.defaultLoad(base);
      var id = this.base.id();
      var g = this.base.g;
      // edition events handling

      this.base.on(id + ':mousedown', this.mouseDown.bind(this));
      this.base.on(id + ':drag', this.onDrag.bind(this));
      this.base.on(id + ':mouseup', function () {
        // has to be the svg because the group is virtually not there :(
        this.base.svg.classed('handle-resize', false);
        this.base.svg.classed('handle-drag', false);
      }.bind(this));
      
      // clicking anywhere ouside the container deselects
      document.body.addEventListener('mousedown', this.mouseDown.bind(this));

      return this;
    }
  });
 
  Object.defineProperty(edit, 'draw', {
    enumerable: true, value: function(el) {
      // add css for cursors
      this.g.selectAll('.block').classed('selectable', true);
      this.defaultDraw(el);
    }
  });

  // mouse down ev handler
  Object.defineProperty(edit, 'mouseDown', {
    value: function(ev) {
      if(ev.button === 0) {
        var item = ev.target;
        var svg = this.base.svg.node();
        
        switch (item.tagName){
          case 'rect':
            this.segMousedown.call(this, ev);
            break;

          case 'line':
            this.segMousedown.call(this, ev);
            break;

          default:
            this.svgMousedown.call(svg, ev);
            break;
        }
      }
    }
  });

  // mouse drag ev switcher depending on drag (left|right|block) levels
  Object.defineProperty(edit, 'onDrag', {
    value: function(e) {
      var classes = e.dragged.classList;
      var mode = 'mv';
      if(classes.contains('l-handle') > 0) mode = 'l';
      if(classes.contains('r-handle') > 0) mode = 'r';
      this.handleDrag.call(this, mode, e);
    }
  });

  // handles all the dragging possibilities
  Object.defineProperty(edit, 'handleDrag', {
    value: function handleDrag(mode, res) {

      var d = res.d;
      var delta = res.event;
      var item = res.target;
      var minDur = 0.0001;

      // has to be the svg because the group is virtually not there :(
      if(mode === 'l' || mode === 'r') {
        this.base.svg.classed('handle-resize', true);
      } else {
        this.base.svg.classed('handle-drag', true);
      }

      // update duration
      // ---------------
      var duration = parseFloat(d.get('duration'));
      if(mode === 'l') duration += parseFloat( 1 - this.xScale.invert(delta.dx)); // ms
      if(mode === 'r') duration += parseFloat( this.xScale.invert(delta.dx)); // ms

      // abort if duration is smaller than the minimum duration
      if(duration <= minDur) return;

      // apply duration when editing through the handles
      if(mode === 'l' || mode === 'r') d.set('duration', duration);
      
      // update begining
      // ---------------
      var begin = parseFloat(d.get('begin'));
      if(mode === 'l' || mode === 'mv') {
        begin += this.xScale.invert(delta.dx); // data.begin in ms
        d.set('begin', begin);
      }

      // synchronise durations and end
      d.set('end', d.get('begin') + d.get('duration'));

      // redraw visualization
      // --------------------
      this.draw(d3.select(item));

    }
  });

  // mouse down on the svg element deselects
  Object.defineProperty(edit, 'svgMousedown', {
    value: function svgMousedown(ev) {

      d3.select(this).selectAll('.selected').classed('selected', false);
    }
  });

  // mousedown on the segments selects them and should trigger an event
  Object.defineProperty(edit, 'segMousedown', {
    value: function segMousedown(ev) {

      var g = this.g;
      var item = ev.target.parentNode; // containing g
      var selects = g.node().querySelectorAll('.selected');
      var isFound = [].indexOf.call(selects, item) >= 0;
      var isSelectable = item.classList.contains('selectable');

      if((selects.length < 1 || !isFound) && !ev.shiftKey){
        g.selectAll('.selected').classed('selected', false);
      }
      if(isSelectable) d3.select(item).classed('selected', true);
    }
  });

  return edit;
};