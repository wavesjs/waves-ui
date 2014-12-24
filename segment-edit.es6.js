var SegmentVis   = require('segment-vis');
var makeEditable = require('make-editable');
// var extend       = require('utils').extend;

'use strict';

class SegmentEdit extends SegmentVis {

  constructor() {
    if (!(this instanceof SegmentEdit)) { return new SegmentEdit; }

    super();
    // default editable properties
    var defaults = {
      edits: ['x', 'y', 'width', 'height'],
      handlerWidth: 2,
      handlerOpacity: 0
    };

    this.params(defaults);
  }

  // add handlers on segment shape
  update(data) {
    super.update(data);

    this.items.append('line')
      .attr('class', 'handle left')
      .attr('stroke-width', this.param('handlerWidth'))
      .attr('stroke-opacity', this.param('handlerOpacity'));

    this.items.append('line')
      .attr('class', 'handle right')
      .attr('stroke-width', this.param('handlerWidth'))
      .attr('stroke-opacity', this.param('handlerOpacity'));
  }

  draw(el) {
    el = super.draw(el);
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
      .attr('transform', (d) => { 
        return 'translate(' + accessors.rhx(d) + ', 0)'; 
      })
      .style('stroke', accessors.color);
  }

  getAccesors() {
    var accessors = super.getAccessors();

    var _handlerWidth = parseInt(this.param('handlerWidth'), 10)
    var _halfHandler = _handlerWidth * 0.5;

    // handler positions
    // var hh  = (d) => { return accessors.y(d) + accessors.h(d); }
    // var lhx = (d) => { return accessors.x(d) + _halfHandler; }
    var rhx = (d) => {
      let width = accessors.w(d);

      return (width < (_handlerWidth * 2)) ?
        _handlerWidth + this.__minWidth : width - _halfHandler;
    }

    return Object.assign(accessors, { rhx: rhx });
  }

  // logic performed to select an item from the brush
  brushItem(extent, mode) {
    mode = mode || 'xy'; // default tries to match both

    var modeX = mode.indexOf('x') >= 0;
    var modeY = mode.indexOf('y') >= 0;
    var matchX = false, matchY = false;

    // data mappers
    var start = this.start();
    var duration = this.duration();
    var y = this.y();
    var height = this.height();

    this.g.selectAll('.selectable').classed('selected', (d, i) => {
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
  }

  handleDrag(item, e) {
    if (item === null) { return; }

    var classList = e.target.classList;
    var mode = 'move';
    // if the target is an handler
    if (classList.contains('left')) { mode = 'resizeLeft'; }
    if (classList.contains('right')) { mode = 'resizeRight'; }

    this[mode](item, e.originalEvent.dx, e.originalEvent.dy);
  }

  move(item, dx, dy) {
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

    // handle x position - lock to boundaries
    var targetX = x + dx;
    if (targetX >= xRange[0] && (targetX + w) <= xRange[1]) {
      x = targetX;
    } else if (targetX < xRange[0]) {
      x = xRange[0];
    } else if ((targetX + w) > xRange[1]) {
      x = xRange[1] - w;
    }

    // handle y position - lock to boundaries
    var targetY = y - dy;
    var yDisplayed = yRange[1] - h - targetY;

    if (yDisplayed >= yRange[0] && (yDisplayed + h) <= yRange[1]) {
      y = targetY;
    } else if (yDisplayed < yRange[0]) {
      y = yRange[1] - h;
    } else if ((yDisplayed + h) > yRange[1]) {
      y = yRange[0];
    }

    var xValue = xScale.invert(x);
    var yValue = yScale.invert(y);

    this.start()(datum, xValue);
    this.y()(datum, yValue);

    this.draw(item);
  }

  resizeLeft(item, dx, dy) {
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
  }

  resizeRight(item, dx, dy) {
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
  }
}

// make editable mixin
makeEditable(SegmentEdit);

module.exports = SegmentEdit;
