var SegmentVis   = require('segment-vis');
var makeEditable = require('make-editable');

'use strict';

var SegmentEdit = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(SegmentEdit, super$0);var proto$0={};

  function SegmentEdit() {
    if (!(this instanceof SegmentEdit)) return new SegmentEdit;

    super$0.call(this);
    // default editable properties
    this.param('edits', ['x', 'y', 'width', 'height']);
  }if(super$0!==null)SP$0(SegmentEdit,super$0);SegmentEdit.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":SegmentEdit,"configurable":true,"writable":true}});DP$0(SegmentEdit,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  // logic performed to select an item from the brush
  proto$0.brushItem = function(extent, mode) {
    mode = mode || 'xy'; // default tries to match both

    var modeX = mode.indexOf('x') >= 0;
    var modeY = mode.indexOf('y') >= 0;
    var matchX = false, matchY = false;

    // data mappers
    var _start = this.start();
    var _duration = this.duration();
    var _y = this.y();
    var _height = this.height();

    this.g.selectAll('.selectable').classed('selected', function(d, i)  {
      // var offsetTop = (that.top() || 0) + (that.base.margin().top || 0);
      // var offsetLeft = (that.left || 0) + (that.base.margin().left || 0);

      // X match
      if (modeX) {
        var x1 = _start(d);
        var x2 = x1 + _duration(d);
        //            begining sel               end sel
        var matchX1 = extent[0][0] <= x1 && x2 < extent[1][0];
        var matchX2 = extent[0][0] <= x2 && x1 < extent[1][0];

        matchX = (matchX1 || matchX2);
      } else {
        matchX = true;
      }

      // Y match
      if (modeY) {
        var y1 = _y(d);
        var y2 = y1 + _height(d);
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

  // checks if the clicked item is one of our guys
  proto$0.clicked = function(item) {
    return item.classList.contains('seg') || item.tagName === 'line';
  };

  // mouse drag event switcher depending on drag (left|right|block) levels
  proto$0.onDrag = function(e) {
    if (this.base.brushing()) { return; }

    var classes = e.dragged.classList;
    var mode = 'mv';
    if (classes.contains('left') > 0) mode = 'l';
    if (classes.contains('right') > 0) mode = 'r';

    this.handleDrag.call(this, mode, e);
  };

  // handles all the dragging possibilities
  proto$0.handleDrag = function(mode, res) {
    var d = res.d;
    var delta = res.event;
    var item = res.target;
    var xScale = this.base.xScale;

    var constrains = this.param('edits');
    var canX = !!~constrains.indexOf('x');
    var canY = !!~constrains.indexOf('y');
    var canW = !!~constrains.indexOf('width');
    var canH = !!~constrains.indexOf('height');

    // data mappers
    var _start = this.start();
    var _duration = this.duration();
    var _y = this.y();

    // has to be the svg because the group is virtually not there :(
    if (mode === 'l' || mode === 'r') {
      this.base.svg.classed('handle-resize', true);
    } else {
      this.base.svg.classed('handle-drag', true);
    }

    var duration = xScale(_duration(d));
    var begin = xScale(_start(d));

    // handle resize
    if (mode === 'l' && canW) duration -= delta.dx; // px
    if (mode === 'r' && canW) duration += delta.dx; // px

    // apply duration when editing through the handles
    if ((mode === 'l' || mode === 'r') && canW) {
      if (duration < 1) { duration = 1; }
      _duration(d, xScale.invert(duration));
    }

    if (mode === 'l' && canW) {
      begin += delta.dx;
      _start(d, xScale.invert(begin));
    }

    // handle move
    if (mode === 'mv' && canX) {
      begin += delta.dx;
      _start(d, xScale.invert(begin));
    }

    if (mode === 'mv' && canY) {
      var y = this.yScale(_y(d));
      y += delta.dy;
      _y(d, this.yScale.invert(y));
    }

    // redraw visualization
    this.draw(this.d3.select(item));
  };
MIXIN$0(SegmentEdit.prototype,proto$0);proto$0=void 0;return SegmentEdit;})(SegmentVis);

// make editable mixin
makeEditable(SegmentEdit);

module.exports = SegmentEdit;
