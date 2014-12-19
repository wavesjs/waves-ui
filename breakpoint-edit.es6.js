// var getSet        = require('utils').getSet;
// var uniqueId      = require('utils').uniqueId;
var BreakpointVis = require('breakpoint-vis');
var makeEditable  = require('make-editable');
var pck           = require('./package.json');

'use strict';

class BreakpointEdit extends BreakpointVis {

  constructor() {
    if (!(this instanceof BreakpointEdit)) return new BreakpointEdit();

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

  // checks if the clicked item is one of our guys
  clicked(item) {
    // @TODO should be cached in uppdate
    var items = this.g.selectAll('circle')[0];
    return items.indexOf(item) !== -1;
  }

  onDrag(e) {
    if (this.base.brushing()) { return; }

    var d = e.d;
    var delta = e.event;
    var item = e.target;
    var base = this.base;

    var _cx = this.cx();
    var _cy = this.cy();
    var _xScale = base.xScale;
    var _yScale = base.yScale;

    var cx = _xScale(_cx(d));
    var cy = _yScale(_cy(d));
    // has to be the svg because the group is virtually not there :( ??
    base.svg.classed('handle-drag', true);
    // update position
    cx += delta.dx;
    cy += delta.dy;
    // position to data domain
    var xValue = _xScale.invert(cx);
    var yValue = _yScale.invert(cy);
    // update data
    _cx(d, xValue);
    _cy(d, yValue);
    // sort data and redraw view
    this.sortData();
    this.draw(this.d3.select(item));
    // tell the timeline to update the rest except me
    // base.drawLayers(this.name);
  }
}

makeEditable(BreakpointEdit);

module.exports = BreakpointEdit;
