/* global d3 */
"use strict";

var breakpoint = require('breakpoint-vis');
var makeEditable = require('make-editable');
var extend = require('extend');

// exports an augmented breakpoint
// -------------------------------

module.exports = function breakpointEditor() {
  var bkpt = breakpoint();

  // logic performed to select an item from the brush
  Object.defineProperty(bkpt, 'brushItem', {
    enumerable: true, value: function(extent, mode) {
      mode = mode || 'xy'; // default tries to match both
      var that = this;
      var dv = extend(this.defaultDataView(), this.dataView());
      var modex = mode.indexOf('x') >= 0;
      var modey = mode.indexOf('y') >= 0;
      var matchX = false, matchY = false;

      this.g.selectAll('.selectable').classed('selected', function(d, i) {

        // var offsetTop = (that.top() || 0) + (that.base.margin().top || 0);
        // var offsetLeft = (that.left || 0) + (that.base.margin().left || 0);

        // X match
        if( modex ) {
          var x1 = dv.start(d);
          var x2 = x1 + dv.duration(d);

          //            begining sel               end sel
          var matchX1 = extent[0][0] <= x1 && x2 < extent[1][0];
          var matchX2 = extent[0][0] <= x2 && x1 < extent[1][0];

          matchX = (matchX1 || matchX2);
        } else {
          matchX = true;
        }

        // Y match
        if( modey ) {
          var y1 = dv.y(d);
          var y2 = y1 + dv.height(d);
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
  Object.defineProperty(bkpt, 'clicked', {
    value: function(item) {
      return item.classList.contains('bkpt');
    }
  });

  // mouse drag ev switcher depending on drag (left|right|block) levels
  Object.defineProperty(bkpt, 'onDrag', {
    value: function(res) {

      var d = res.d;
      var delta = res.event;
      var item = res.target;
      var base = this.base;

      var dv = extend(this.defaultDataView(), this.dataView());
      var xScale = base.xScale;
      var yScale = base.yScale;
      var cx = xScale(dv.cx(d));
      var cy = yScale(dv.cy(d));

      // has to be the svg because the group is virtually not there :(
      base.svg.classed('handle-drag', true);

      this.sortData();

      // update positions
      // ----------------

      cx += delta.dx;
      dv.cx(d, xScale.invert(cx));

      cy += delta.dy;
      dv.cy(d, yScale.invert(cy));

      // redraw visualization
      // --------------------
      // update myself
      this.draw(d3.select(item));
      // tell the timeline to update the rest except me
      base.drawLayers(this.name);

    }
  });


  return makeEditable(bkpt);
};