var SegmentVis   = require('segment-vis');
var makeEditable = require('make-editable');
var extend       = require('utils').extend;

'use strict';

var SegmentEdit = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(SegmentEdit, super$0);var proto$0={};

  function SegmentEdit() {
    if (!(this instanceof SegmentEdit)) { return new SegmentEdit; }

    super$0.call(this);
    // default editable properties
    this.params({
      edits: ['x', 'y', 'width', 'height'],
      handlerWidth: 3,
      handlerOpacity: 0
    });
  }if(super$0!==null)SP$0(SegmentEdit,super$0);SegmentEdit.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":SegmentEdit,"configurable":true,"writable":true}});DP$0(SegmentEdit,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  // add handler on segment shape
  proto$0.update = function(data) {
    var g = super$0.prototype.update.call(this, data);

    g.append('line')
      .attr('class', 'handle left')
      .attr('stroke-width', this.param('handlerWidth'))
      .attr('stroke-opacity', this.param('handlerOpacity'));

    g.append('line')
      .attr('class', 'handle right')
      .attr('stroke-width', this.param('handlerWidth'))
      .attr('stroke-opacity', this.param('handlerOpacity'));
  };

  proto$0.draw = function(el) {
    el = super$0.prototype.draw.call(this, el);
    var accessors = this.getAccesors();

    el.selectAll('.handle.left')
      .attr('x1', accessors.lhx)
      .attr('x2', accessors.lhx)
      .attr('y1', accessors.y)
      .attr('y2', accessors.hh)
      .style('stroke', accessors.color);

    el.selectAll('.handle.right')
      .attr('x1', accessors.rhx)
      .attr('x2', accessors.rhx)
      .attr('y1', accessors.y)
      .attr('y2', accessors.hh)
      .style('stroke', accessors.color);
  };

  proto$0.getAccesors = function() {var this$0 = this;
    var accessors = super$0.prototype.getAccessors.call(this);

    var _handlerWidth = parseInt(this.param('handlerWidth'), 10)
    var _halfHandler = _handlerWidth * 0.5;

    // handler positions
    var hh  = function(d)  { return accessors.y(d) + accessors.h(d); }
    var lhx = function(d)  { return accessors.x(d) + _halfHandler; }
    var rhx = function(d)  {
      var width = accessors.w(d);

      return (width < (_handlerWidth * 2)) ?
        accessors.x(d) + _handlerWidth + this$0.__minWidth : accessors.x(d) + width - _halfHandler;
    }

    return extend(accessors, { hh: hh, lhx: lhx, rhx: rhx });
  };

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
    return item.classList.contains(this.param('rect-class')) ||
           item.tagName === 'line';
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
    var yScale = this.yScale;

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

    var width = xScale(_duration(d));
    var posX = xScale(_start(d));

    // handle resize
    if (mode === 'l' && canW) width -= delta.dx; // px
    if (mode === 'r' && canW) width += delta.dx; // px

    // apply duration when editing through the handles
    if ((mode === 'l' || mode === 'r') && canW) {
      if (width < 1) { width = 1; }
      _duration(d, xScale.invert(width));
    }

    if (mode === 'l' && canW) {
      posX += delta.dx;
      _start(d, xScale.invert(posX));
    }

    // handle move
    if (mode === 'mv' && canX) {
      var minX = 0;
      var maxX = this.base.width();
      var targetX = posX + delta.dx;

      if (targetX >= minX && (targetX + width) <= maxX) {
        posX = targetX;
        _start(d, xScale.invert(posX));
      }
    }

    if (mode === 'mv' && canY) {
      var posY = this.yScale(_y(d));
      var minY = this.param('height') - this.yScale(this.height()(d));
      var maxY = this.param('height');
      var targetY = posY + delta.dy;

      if (targetY >= minY && targetY <= maxY) {
        posY = targetY;
        _y(d, this.yScale.invert(posY));
      }
    }

    // redraw visualization
    this.draw(this.d3.select(item));
  };
MIXIN$0(SegmentEdit.prototype,proto$0);proto$0=void 0;return SegmentEdit;})(SegmentVis);

// make editable mixin
makeEditable(SegmentEdit);

module.exports = SegmentEdit;
