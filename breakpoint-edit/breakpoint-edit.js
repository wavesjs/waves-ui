// var getSet        = require('utils').getSet;
// var uniqueId      = require('utils').uniqueId;
var BreakpointVis = require('breakpoint-vis');
var makeEditable  = require('make-editable');
var pck           = require('./package.json');

'use strict';

var BreakpointEdit = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(BreakpointEdit, super$0);var proto$0={};

  function BreakpointEdit() {
    if (!(this instanceof BreakpointEdit)) {
      return new BreakpointEdit();
    }

    super$0.call(this);
  }if(super$0!==null)SP$0(BreakpointEdit,super$0);BreakpointEdit.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":BreakpointEdit,"configurable":true,"writable":true}});DP$0(BreakpointEdit,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  // logic performed to select an item from the brush
  proto$0.brushItem = function(extent, mode) {
    mode = mode || 'xy'; // default tries to match both
    
    var modeX = mode.indexOf('x') >= 0;
    var modeY = mode.indexOf('y') >= 0;
    var matchX = false;
    var matchY = false;

    var r  = this.r();
    var cx = this.cx();
    var cy = this.cy();

    this.g.selectAll('.selectable').classed('selected', function(d, i)  {
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
  };

  proto$0.handleDrag = function(item, e) {
    if (item === null) { return; }

    this.move(item, e.originalEvent.dx, e.originalEvent.dy);
  };

  proto$0.move = function(item, dx, dy) {
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
  };
MIXIN$0(BreakpointEdit.prototype,proto$0);proto$0=void 0;return BreakpointEdit;})(BreakpointVis);

makeEditable(BreakpointEdit);

module.exports = BreakpointEdit;
