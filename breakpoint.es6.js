'use strict';

var { uniqueId, accessors } = require('utils');
var { Layer } = require('layer');

class Breakpoint extends Layer {

  constructor() {
    super();

    var defaults = {
      type: 'breakpoint',
      id: uniqueId(name),
      opacity: 1,
      color: '#000000',
      lineColor: '#000000',
      displayLine: true,
      radius: 3,
      interpolate: 'linear'
    };

    this.params(defaults);

    this.cx(function(d, v = null) {
      if (v === null) return +d.cx;
      d.cx = (+v);
    });

    this.cy(function(d, v = null) {
      if (v === null) return +d.cy;
      d.cy = (+v);
    });

    this.r(function(d, v = null) {
      if (v === null) return +d.r;
      d.r = (+v);
    });

    this.opacity(function(d, v = null) {
      if (v === null) return +d.opacity;
      d.opacity = (+v);
    });

    this.color(function(d, v = null) {
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

    this.items = this.g.selectAll('.' + this.param('unitClass'))
      .data(this.data(), this.dataKey());

    // create line
    if (this.param('displayLine')) {
      this.line = this.d3.svg.line().interpolate(this.param('interpolate'));

      var path = this.g.select('path');
      // create path if not exists
      if (!path[0][0]) { path = this.g.append('path'); }
      // remove line if no data
      if (this.data().length === 0) { path.remove(); }
    }

    // create points
    var sel = this.items.enter()
      .append('g')
      .classed('item', true)
      .classed(this.param('unitClass'), true);

    sel.append('circle');

    this.items.exit().remove();
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
    var color   = (d) => { return _color(d) || this.param('color'); };
    var opacity = (d) => { return _opacity(d) || this.param('opacity'); };

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

  // logic performed to select an item from the brush
  handleBrush(extent, e) {

    /*
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
    */
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
    var yRange = yScale.range();

    var cx = this.cx();
    var cy = this.cy();
    var x = xScale(cx(datum));
    var y = yScale(cy(datum));
    // update range
    x += dx;

    // clamp y
    var targetY = y + dy;
    if (targetY <= yRange[0] && targetY >= yRange[1]) {
      y = targetY;
    }

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

// add data accessors
accessors.getFunction(Breakpoint.prototype, [
  'cx', 'cy', 'r', 'opacity', 'color'
]);

function factory() { return new Breakpoint(); }
factory.Breakpoint = Breakpoint;

module.exports = factory;
