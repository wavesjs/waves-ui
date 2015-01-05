var accessors = require('utils').accessors;
var uniqueId = require('utils').uniqueId;
var LayerVis = require('layer-vis');
var pck      = require('./package.json');

'use strict';

class BreakpointVis extends LayerVis {

  constructor() {
    if (!(this instanceof BreakpointVis)) { return new BreakpointVis; }

    super();

    var name = pck.name.replace('-vis', '');

    var defaults = {
      type: name,
      id: uniqueId(name),
      opacity: 1,
      color: '#000000',
      lineColor: '#000000',
      displayLine: true,
      radius: 3,
      interpolate: 'linear'
    };

    this.params(defaults);

    this.cx((d, v = null) => {
      if (v === null) return +d.cx;
      d.cx = (+v);
    });

    this.cy((d, v = null) => {
      if (v === null) return +d.cy;
      d.cy = (+v);
    });

    this.r((d, v = null) => {
      if (v === null) return +d.r;
      d.r = (+v);
    });

    this.opacity((d, v = null) => {
      if (v === null) return +d.opacity;
      d.opacity = (+v);
    });

    this.color((d, v = null) => {
      if (v === null) return d.color;
      d.color = v + '';
    });
  }

  // keep breakpoints coherent in time axis
  sortData() {
    var cx = this.cx();
    this.data().sort((a, b) => { return cx(a) - cx(b); });
  }

  xZoom() {
    // var xScale = this.base.xScale;
      // var min = xScale.domain()[0],
      //     max = xScale.domain()[1];

      // // var nuData = [];
      // var dv = extend(this.defaultDataView(), this.dataView());
      // var that = this;

      // this.data().forEach(function(d, i) {
      //   var start = dv.xc(d);
      //   var duration = dv.duration(d);
      //   var end = start + duration;

      //   // rethink when feeling smarter
      //   if((start > min && end < max) || (start < min && end < max && end > min) || (start > min && start < max && end > max) || (end > max && start < min)) nuData.push(d);
      // });
      this.update();
  }

  update(data) {
    super.update(data);

    this.sortData();

    var sel = this.g.selectAll('.' + this.param('unitClass'))
      .data(this.data());

    // create line
    if (this.param('displayLine')) {
      this.line = this.d3.svg.line().interpolate(this.param('interpolate'));

      var path = this.g.select('path');
      // create path if not exists
      if (!path[0][0]) { path = this.g.append('path') };
      // remove line if no data
      if (this.data().length === 0) { path.remove(); }
    }

    // create points
    this.items = sel.enter()
      .append('g')
      .classed('item', true)
      .classed(this.param('unitClass'), true)
        
    this.items.append('circle');

    sel.exit().remove();
  }

  draw(el) {
    el = el || this.items;

    this.sortData();

    var _xScale = this.base.xScale;
    var _yScale = this.yScale;
    var _cx = this.cx();
    var _cy = this.cy();
    var _r  = this.r();
    var _color = this.color();
    var _opacity = this.opacity();

    var cx = (d) => { return _xScale(_cx(d)); };
    var cy = (d) => { return _yScale(_cy(d)); };
    var r  = (d) => { return _r(d) || this.param('radius'); };
    var color   = (d) => { return _color(d) || this.param('color'); }
    var opacity = (d) => { return _opacity(d) || this.param('opacity'); }

    // draw line
    if (this.param('displayLine')) {
      this.line.x(cx).y(cy);

      this.g.select('path')
        .attr('d', this.line(this.data()))
        .attr('stroke', this.param('lineColor'))
        .attr('stroke-width', 1)
        .attr('stroke-opacity', this.param('opacity'))
        .attr('fill', 'none');
    }

    // draw circles
    el.selectAll('circle')
      .attr('fill', color)
      .attr('fill-opacity', opacity)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', r)
      .attr('transform', (d) => {
        return 'translate(' + cx(d) + ', ' + cy(d) + ')';
      });

    if (!!this.each()) { el.each(this.each()); }
  }

}

// add data accessors
accessors.getFunction(BreakpointVis.prototype, [
  'cx', 'cy', 'r', 'opacity', 'color'
]);

module.exports = BreakpointVis;
