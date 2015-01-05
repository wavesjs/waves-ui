// var getSet        = require('utils').getSet;
// var uniqueId      = require('utils').uniqueId;
var BreakpointVis = require('breakpoint-vis');
var makeEditable  = require('make-editable');
var pck           = require('./package.json');

'use strict';

class BreakpointEdit extends BreakpointVis {

  constructor() {
    if (!(this instanceof BreakpointEdit)) {
      return new BreakpointEdit();
    }

    super();
  }

  // logic performed to select an item from the brush
  brushItem(extent, mode) {
    mode = mode || 'xy'; // default tries to match both
    
    var modeX = mode.indexOf('x') >= 0;
    var modeY = mode.indexOf('y') >= 0;
    var matchX = false;
    var matchY = false;

    var r  = this.r();
    var cx = this.cx();
    var cy = this.cy();

    this.g.selectAll('.selectable').classed('selected', (d, i) => {
      var halfR = r(d) * 0.5;

      // X match
      if (modeX) {
        var x1 = cx(d) - halfR;
        var x2 = cx(d) + halfR;
        //            begining sel               end sel
        var matchX1 = extent[0][0] <= x1 && x2 < extent[1][0];
        var matchX2 = extent[0][0] <= x2 && x1 < extent[1][0];

        matchX = (matchX1 || matchX2);
      } else {
        matchX = true;
      }

      // Y match 
      if (modeY) {
        var y1 = cy(d) - halfR;
        var y2 = cy(d) + halfR;
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

  handleDrag(item, e) {
    if (item === null) { return; }

    this.move(item, e.originalEvent.dx, e.originalEvent.dy);
  }

  move(item, dx, dy) {
    item = this.d3.select(item);
    var datum = item.datum();

    var xScale = this.base.xScale;
    var yScale = this.yScale;

    var cx = this.cx();
    var cy = this.cy();
    var x = xScale(cx(datum));
    var y = yScale(cy(datum));
    // update range
    x += dx;
    y += dy;
    // range to domain
    var xValue = xScale.invert(x);
    var yValue = yScale.invert(y);
    // update data
    cx(datum, xValue);
    cy(datum, yValue);
    // redraw view
    this.draw(item);
  }
}

makeEditable(BreakpointEdit);

module.exports = BreakpointEdit;
