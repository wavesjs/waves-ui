var SegmentVis   = require('segment-vis');
var makeEditable = require('make-editable');
// var extend       = require('utils').extend;

'use strict';

var SegmentEdit = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(SegmentEdit, super$0);var proto$0={};

  function SegmentEdit() {
    if (!(this instanceof SegmentEdit)) { return new SegmentEdit; }

    super$0.call(this);
    // default editable properties
    var defaults = {
      edits: ['x', 'y', 'width', 'height'],
      handlerWidth: 2,
      handlerOpacity: 0
    };

    this.params(defaults);
  }if(super$0!==null)SP$0(SegmentEdit,super$0);SegmentEdit.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":SegmentEdit,"configurable":true,"writable":true}});DP$0(SegmentEdit,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  // add handlers on segment shape
  proto$0.update = function(data) {
    super$0.prototype.update.call(this, data);

    this.items.append('line')
      .attr('class', 'handle left')
      .attr('stroke-width', this.param('handlerWidth'))
      .attr('stroke-opacity', this.param('handlerOpacity'));

    this.items.append('line')
      .attr('class', 'handle right')
      .attr('stroke-width', this.param('handlerWidth'))
      .attr('stroke-opacity', this.param('handlerOpacity'));
  };

  proto$0.draw = function(el) {
    el = super$0.prototype.draw.call(this, el);
    var accessors = this.getAccesors();

    var _handlerWidth = parseInt(this.param('handlerWidth'), 10)
    var _halfHandler = _handlerWidth * 0.5;

    el.selectAll('.handle.left')
      .attr('x1', _halfHandler)
      .attr('x2', _halfHandler)
      .attr('y1', 0)
      .attr('y2', accessors.h)
      .style('stroke', accessors.color);

    el.selectAll('.handle.right')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', accessors.h)
      .attr('transform', function(d)  { 
        return 'translate(' + accessors.rhx(d) + ', 0)'; 
      })
      .style('stroke', accessors.color);
  };

  proto$0.getAccesors = function() {var this$0 = this;
    var accessors = super$0.prototype.getAccessors.call(this);

    var _handlerWidth = parseInt(this.param('handlerWidth'), 10)
    var _halfHandler = _handlerWidth * 0.5;

    // handler positions
    // var hh  = (d) => { return accessors.y(d) + accessors.h(d); }
    // var lhx = (d) => { return accessors.x(d) + _halfHandler; }
    var rhx = function(d)  {
      var width = accessors.w(d);

      return (width < (_handlerWidth * 2)) ?
        _handlerWidth + this$0.__minWidth : width - _halfHandler;
    }

    return Object.assign(accessors, { rhx: rhx });
  };

  // logic performed to select an item from the brush
  proto$0.brushItem = function(extent, mode) {
    mode = mode || 'xy'; // default tries to match both

    var modeX = mode.indexOf('x') >= 0;
    var modeY = mode.indexOf('y') >= 0;
    var matchX = false, matchY = false;

    // data mappers
    var start = this.start();
    var duration = this.duration();
    var y = this.y();
    var height = this.height();

    this.g.selectAll('.selectable').classed('selected', function(d, i)  {
      // var offsetTop = (that.top() || 0) + (that.base.margin().top || 0);
      // var offsetLeft = (that.left || 0) + (that.base.margin().left || 0);

      // X match
      if (modeX) {
        var x1 = start(d);
        var x2 = x1 + duration(d);
        //            begining sel               end sel
        var matchX1 = extent[0][0] <= x1 && x2 < extent[1][0];
        var matchX2 = extent[0][0] <= x2 && x1 < extent[1][0];

        matchX = (matchX1 || matchX2);
      } else {
        matchX = true;
      }

      // Y match
      if (modeY) {
        var y1 = y(d);
        var y2 = y1 + height(d);
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

    var classList = e.target.classList;
    var mode = 'move';
    // if the target is an handler
    if (classList.contains('left')) { mode = 'resizeLeft'; }
    if (classList.contains('right')) { mode = 'resizeRight'; }

    this[mode](item, e.originalEvent.dx, e.originalEvent.dy);
  };

  proto$0.move = function(item, dx, dy) {
    item = this.d3.select(item);
    var datum = item.datum();
    // define constrains
    var constrains = this.param('edits');
    var canX = !!~constrains.indexOf('x');
    var canY = !!~constrains.indexOf('y');
    // early return if cannot edit x and y
    if (!canX && !canY) { return }
    // else lock the corresponding axis
    if (!canX) { dx = 0; }
    if (!canY) { dy = 0; }

    var accessors = this.getAccessors();

    var xScale = accessors.xScale;
    var yScale = accessors.yScale;
    var xRange = xScale.range();
    var yRange = yScale.range();

    var x = accessors.x(datum);
    var w = accessors.w(datum);
    var h = accessors.h(datum);
    var y = yScale(this.y()(datum));

    // handle x position
    var targetX = x + dx;
    if (targetX >= xRange[0] && (targetX + w) <= xRange[1]) {
      x = targetX;
    }

    // handle y position
    var targetY = y - dy;
    var yDisplayed = yRange[1] - h - targetY;

    if (yDisplayed >= yRange[0] && (yDisplayed + h) <= yRange[1]) {
      y = targetY;
    }

    var xValue = xScale.invert(x);
    var yValue = yScale.invert(y);

    this.start()(datum, xValue);
    this.y()(datum, yValue);

    this.draw(item);
  };

  proto$0.resizeLeft = function(item, dx, dy) {
    item = this.d3.select(item);
    var datum = item.datum();

    var constrains = this.param('edits');
    var canW = !!~constrains.indexOf('width');
    // early return if cannot edit    
    if (!canW) { return; }

    var accessors = this.getAccessors();
    var xRange = accessors.xScale.range();

    var x = accessors.x(datum);
    var w = accessors.w(datum);

    var targetX = x + dx;
    var targetW = w - dx;

    if (targetX >= xRange[0] && targetW >= this.__minWidth) {
      x = targetX;
      w = targetW;
    }

    var xValue = accessors.xScale.invert(x);
    var wValue = accessors.xScale.invert(w);

    this.start()(datum, xValue);
    this.duration()(datum, wValue);

    this.draw(item);
  };

  proto$0.resizeRight = function(item, dx, dy) {
    item = this.d3.select(item);
    var datum = item.datum();

    var constrains = this.param('edits');
    var canW = !!~constrains.indexOf('width');
    // early return if cannot edit
    if (!canW) { return; }

    var accessors = this.getAccessors();
    var xRange = accessors.xScale.range();

    var x = accessors.x(datum);
    var w = accessors.w(datum);

    var targetW = w + dx;

    if (targetW >= this.__minWidth && (x + targetW) <= xRange[1]) {
      w = targetW;
    }

    var wValue = accessors.xScale.invert(w);
    this.duration()(datum, wValue);

    this.draw(item);
  };
MIXIN$0(SegmentEdit.prototype,proto$0);proto$0=void 0;return SegmentEdit;})(SegmentVis);

// make editable mixin
makeEditable(SegmentEdit);

module.exports = SegmentEdit;
