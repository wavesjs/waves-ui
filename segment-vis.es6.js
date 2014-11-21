var LayerVis  = require('layer-vis');
var pck       = require('./package.json');
var getSet    = require('utils').getSet;
var uniqueId  = require('utils').uniqueId;

'use strict';

class SegmentVis extends LayerVis {

  constructor() {
    if (!(this instanceof SegmentVis)) return new SegmentVis;

    super();

    var name = pck.name.replace('-vis', '');

    var defaults = {
      type: name,
      id: uniqueId(name),
      rectClass: 'rect'
    };
    // set layer defaults
    this.params(defaults);

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

    var sel = this.g.selectAll('.' + this.param('unitClass'))
      .data(this.data(), this.sortIndex());

    var g = sel.enter()
      .append('g')
      .classed('item', true)
      .classed(this.param('unitClass'), true)

    g.append('rect')
      .attr('class', this.param('rectClass'))
      .attr('fill-opacity', this.param('opacity'));

    sel.exit().remove();

    return g;
  }

  draw(el = null) {
    if (el === null) { el = this.g.selectAll('.' + this.param('unitClass')); }

    var accessors = this.getAccessors();

    el.selectAll('.' + this.param('rectClass'))
      .attr('x', accessors.x)
      .attr('y', accessors.y)
      .attr('width', accessors.w)
      .attr('height', accessors.h)
      .attr('fill', accessors.color);

    if (!!this.each()) { el.each(this.each()); }

    return el;
  }

  // #NOTE add a caching system ?
  getAccessors() {
    // if (this.params('accessors')) {
    //   return this.params('accessors');
    // }

    var _xScale = this.base.xScale;
    var _yScale = this.yScale;

    // data mappers
    var _start    = this.start();
    var _duration = this.duration();
    var _y        = this.y();
    var _color    = this.color();
    var _height   = this.height();

    // define accesors
    var w = (d) => { return Math.max(this.__minWidth, _xScale(_duration(d))); };
    var h = (d) => { return this.param('height') - _yScale(_height(d)); };
    var x = (d) => { return _xScale(_start(d)); };
    var y = (d) => { return _yScale(_y(d)) - h(d); };

    var color = (d) => { return _color(d); };

    // this.params('accessors', { w: w, h: h, x: x, y: y, color: color });
    // return this.params('accessors');
    return { w: w, h: h, x: x, y: y, color: color };
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
