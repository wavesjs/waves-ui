
/* global d3 */
"use strict";

var segVis = require('segment-vis');
var makeEditable = require('make-editable');

// exports an augmented segment
// ----------------------------

module.exports = function segmentEditor(){
  var seg = segVis();

  // hit test tells wheter we are acting on our visualiser or not
  Object.defineProperty(seg, 'hits', {
    value: function(item) {
      return item.classList.contains('seg') || item.tagName === 'line';
    }
  });

  // mouse drag ev switcher depending on drag (left|right|block) levels
  Object.defineProperty(seg, 'onDrag', {
    value: function(e) {
      var classes = e.dragged.classList;

      var mode = 'mv';
      if(classes.contains('left') > 0) mode = 'l';
      if(classes.contains('right') > 0) mode = 'r';
      this.handleDrag.call(this, mode, e);
    }
  });


  // handles all the dragging possibilities
  Object.defineProperty(seg, 'handleDrag', {
    value: function handleDrag(mode, res) {

      var d = res.d;
      var delta = res.event;
      var item = res.target;
      var minDur = 0.0001;

      var dataView = this.dataView();

      // has to be the svg because the group is virtually not there :(
      if(mode === 'l' || mode === 'r') {
        this.base.svg.classed('handle-resize', true);
      } else {
        this.base.svg.classed('handle-drag', true);
      }

      var duration = dataView.duration(d);

      if(mode === 'l') duration += parseFloat( 1 - this.xScale.invert(delta.dx)); // ms
      if(mode === 'r') duration += parseFloat( this.xScale.invert(delta.dx)); // ms

      // abort if duration is smaller than the minimum duration
      if(duration <= minDur) return;
      // apply duration when editing through the handles
      if(mode === 'l' || mode === 'r') dataView.duration(d, duration);
      
      // update begining
      // ---------------
      var begin = dataView.start(d);
      if(mode === 'l' || mode === 'mv') {
        begin += this.xScale.invert(delta.dx); // data.begin in ms
        dataView.start(d, begin);
      }

      // redraw visualization
      // --------------------
      this.draw(d3.select(item));

    }
  });


  return makeEditable(seg);
};