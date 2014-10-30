var LayerVis  = require('layer-vis');
var pck       = require('./package.json');
var getSet    = require('utils').getSet;
var uniqueId  = require('utils').uniqueId;

'use strict';

class SegmentVis extends LayerVis {


  constructor() {

    if (!(this instanceof SegmentVis)) return new SegmentVis;

    super();

    // set layer defaults
    this.params({
      name: uniqueId(pck.name.replace('-vis', '')),
      handlerWidth: 3,
      handlerOpacity: 0
    });

    this.__minWidth = 1;
    // initialize data accessors
    this.y((d, v = null) => {
      if (v === null) return +d.y || 0;
      d.y = (+v);
    });

    this.height((d, v = null) => {
      if (v === null) return +d.height || 1;
      d.height = (+v);
    });

    this.duration((d, v = null) => {
      if (v === null) return +d.duration || 1;
      d.duration = (+v);
    });

    this.start((d, v = null) => {
      if (v === null) return +d.start || 0;
      d.start = (+v);
    });

    this.color((d, v = null) => {
      if (v === null) return d.color ? d.color + '' : '#000000';
      d.color = v + '';
    });
  }


  update(data) {

    super.update(data);

    var sel = this.g.selectAll('.' + this.unitClass)
      .data(this.data(), this.sortIndex());

    var g = sel.enter()
      .append('g')
      .attr('class', this.unitClass)
      .attr('id', (d) => { return d.id; });

    g.append('rect')
      .attr('class', 'seg')
      .attr('fill-opacity', this.param('opacity'));

    g.append('line')
      .attr('class', 'handle left')
      .attr('stroke-width', this.param('handlerWidth'))
      .attr('stroke-opacity', this.param('handlerOpacity'));

    g.append('line')
      .attr('class', 'handle right')
      .attr('stroke-width', this.param('handlerWidth'))
      .attr('stroke-opacity', this.param('handlerOpacity'));

    sel.exit().remove();
    this.draw();
  }


  draw(el = null) {
    if (el === null) { el = this.g.selectAll('.' + this.unitClass); }

    var _xScale = this.base.xScale;
    var _yScale = this.yScale;

    var xScale, that = this, halfHandler;

    // data mappers
    var _start    = this.start();
    var _duration = this.duration();
    var _y        = this.y();
    var _color    = this.color();
    var _height   = this.height();

    //
    var _handlerWidth = parseInt(this.param('handlerWidth'), 10)
    var _halfHandler = _handlerWidth * 0.5;
    var max = Math.max;

    // segment positions
    var x = (d) => { return _xScale(_start(d)); }
    var w = (d) => { return max(that.__minWidth, _xScale(_duration(d))); }
    var h = (d) => { return this.param('height') - _yScale(_height(d)); }
    var y = (d) => { return _yScale(_y(d)) - h(d); }

    // handler positions
    var lhx = (d) => { return x(d) + _halfHandler; }
    var rhx = (d) => {
      let width = w(d);
      return (width < this.__minWidth) ?
        x(d) + _handlerWidth : x(d) + width - _halfHandler;
    }
    var hh  = (d) => { return y(d) + h(d); }

    // color accessor
    var color = (d) => { return _color(d); }

    var segs = el.selectAll('.seg');

    segs
      .attr('x', x)
      .attr('y', y)
      .attr('width', w)
      .attr('height', h)
      .attr('fill', color);

    el.selectAll('.handle.left')
      .attr('x1', lhx)
      .attr('x2', lhx)
      .attr('y1', y)
      .attr('y2', hh)
      .style('stroke', color);

    el.selectAll('.handle.right')
      .attr('x1', rhx)
      .attr('x2', rhx)
      .attr('y1', y)
      .attr('y2', hh)
      .style('stroke', color);

    if (!!this.each()) { el.each(this.each()); }
  }


  xZoom(val) {
    // console.log(this.xBaseDomain);
    // console.log('zooom');
    var that = this;
    var xScale = this.base.xScale;
    var min = xScale.domain()[0],
        max = xScale.domain()[1];

    var nuData = [];

    this.data().forEach(function(d, i) {
      var start = that.start()(d);
      var duration = that.duration()(d);
      var end = start + duration;
      // if((start + dv.duration(d)) <= max && start >= min) nuData.push(d);
      if((start > min && end < max) || (start < min && end < max && end > min) || (start > min && start < max && end > max) || (end > max && start < min)) nuData.push(d);
      // if((end < min && start < min) || (end > max && start > max)) nuData.push(d);
    });

    // this.update(nuData);
    this.update();
    // var xAxis = this.graph[this.iName];
    // xAxis.scale(xScale);

    // this.g.call(xAxis);
  }

}

// add and initialize our accessors
getSet(SegmentVis.prototype, ['y', 'width', 'color', 'height', 'duration', 'start', 'sortIndex']);

module.exports = SegmentVis;
