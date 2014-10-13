/* global d3 */
"use strict";

var segment = require('segment-vis');
var makeEditable = require('make-editable');
var extend = require('extend');
var getSet = require('get-set');


// exports an augmented segment
// ----------------------------

module.exports = function segmentEditor() {
  var seg = segment();

  // getters(setters) to be added
  getSet(seg)(['edits']);

  // editable properties
  seg.edits(['x', 'y', 'width', 'height']);

  // logic performed to select an item from the brush
  Object.defineProperty(seg, 'brushItem', {
    enumerable: true, value: function(extent, mode) {
      mode = mode || 'xy'; // default tries to match both

      var modex = mode.indexOf('x') >= 0;
      var modey = mode.indexOf('y') >= 0;
      var matchX = false, matchY = false;
      
      // data mappers
      var dStart = this.dStart();
      var dDuration = this.dDuration();
      var dY = this.dY();
      var dColor = this.dColor();
      var dHeight = this.dHeight();

      this.g.selectAll('.selectable').classed('selected', function(d, i) {

        // var offsetTop = (that.top() || 0) + (that.base.margin().top || 0);
        // var offsetLeft = (that.left || 0) + (that.base.margin().left || 0);

        // X match
        if( modex ) {
          var x1 = dStart(d);
          var x2 = x1 + dDuration(d);

          //            begining sel               end sel
          var matchX1 = extent[0][0] <= x1 && x2 < extent[1][0];
          var matchX2 = extent[0][0] <= x2 && x1 < extent[1][0];

          matchX = (matchX1 || matchX2);
        } else {
          matchX = true;
        }

        // Y match
        if( modey ) {
          var y1 = dY(d);
          var y2 = y1 + dHeight(d);
          //            begining sel               end sel
          var matchY1 = extent[0][1] <= y1 && y2 < extent[1][1];
          var matchY2 = extent[0][1] <= y2 && y1 <= extent[1][1];
          matchY = (matchY1 || matchY2);
        } else {
          matchY = true;
        }

        return matchX && matchY;
      });

    }
  });

  // checks if the clicked item is one of our guys
  Object.defineProperty(seg, 'clicked', {
    value: function(item) {
      return item.classList.contains('seg') ||  item.tagName === 'line';
    }
  });

  // mouse drag ev switcher depending on drag (left|right|block) levels
  Object.defineProperty(seg, 'onDrag', {
    value: function(e) {
      if (!this.base.brushing()) {
        var classes = e.dragged.classList;

        var mode = 'mv';
        if (classes.contains('left') > 0) mode = 'l';
        if (classes.contains('right') > 0) mode = 'r';
        this.handleDrag.call(this, mode, e);
      }
    }
  });


  // handles all the dragging possibilities
  Object.defineProperty(seg, 'handleDrag', {
    value: function handleDrag(mode, res) {

      var d = res.d;
      var delta = res.event;
      var item = res.target;
      var minDur = 0.001;
      var xScale = this.base.xScale;

      var constrains = this.edits();
      var canX = !!~constrains.indexOf('x');
      var canY = !!~constrains.indexOf('y');
      var canW = !!~constrains.indexOf('width');
      var canH = !!~constrains.indexOf('height');

      // data mappers
      var dStart = this.dStart();
      var dDuration = this.dDuration();
      var dY = this.dY();
      var dColor = this.dColor();
      var dHeight = this.dHeight();

      // has to be the svg because the group is virtually not there :(
      if (mode === 'l' || mode === 'r') {
        this.base.svg.classed('handle-resize', true);
      } else {
        this.base.svg.classed('handle-drag', true);
      }

      var duration = xScale(dDuration(d));
      var begin = xScale(dStart(d));

      if (mode === 'l' && canW) duration -= delta.dx; // px
      if (mode === 'r' && canW) duration += delta.dx; // px

      // apply duration when editing through the handles
      if ((mode === 'l' || mode === 'r') && canW) dDuration(d, xScale.invert(duration));

      // update positions
      // ----------------
      if (mode === 'l' || mode === 'mv') {

        if(mode === 'l' && canW ||  mode === 'mv' && canX){
          begin += delta.dx;
          dStart(d, xScale.invert(begin));
        }

        if(mode === 'mv' && canY) {
          var y = this.yScale(dY(d));
          y += delta.dy;
          dY(d, this.yScale.invert(y));
        }
      }

      // redraw visualization
      // --------------------
      this.draw(d3.select(item));

    }
  });


  return makeEditable(seg);
};