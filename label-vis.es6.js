var LayerVis  = require('layer-vis');
var pck       = require('./package.json');
var getSet    = require('utils').getSet;

'use strict';

class LabelVis extends LayerVis {

  constructor() {
    if (!(this instanceof LabelVis)) { return new LabelVis; }

    super();

    this.params({
      'name': pck.name.replace('-vis', ''),
      'padding': { top: 0, right: 0, bottom: 0, left: 0 }
    });

    // data accessors
    this.y((d, v = null) => {
      if (v === null) { return +d.y || 0 }
      d.y = (+v);
    });

    this.x((d, v = null) => {
      if (v === null) { return +d.x || 0 }
      d.x = (+v);
    });

    this.width((d, v = null) => {
      if (v === null) { return +d.width || 0 }
      d.width = (+v);
    });

    this.height((d, v = null) => {
      if (v === null) { return +d.height || 0 }
      d.height = (+v);
    });

    this.text((d, v = null) => {
      if (v === null) { return (d.text + '') }
      d.text = (v + '');
    });

    this.color((d, v = null) => {
      if (v === null) { return d.color ? d.color + '' : '#000000' }
      d.color = (v + '');
    });

    // 'left', 'center', 'top'
    this.align((d, v = null) => {
      if (v === null) { return d.align ? d.align + '' : 'left' }
      d.align = (v + '');
    });

    // 'top', 'middle', 'bottom'
    this.valign((d, v = null) => {
      if (v === null) { return d.valign ? d.valign + '' : 'top' }
      d.valign = (v + '');
    });

    // 'padding' ?
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
      .attr('class', 'bounding-box')
      .attr('fill', 'transparent')
      .style('opacity', 0.2)

    g.append('text')
     .attr('class', 'text');

    sel.exit().remove();
    this.draw();
  }

  draw(el = null) {
    el = el !== null ? el : this.g.selectAll('.' + this.unitClass);

    var _xScale = this.base.xScale;
    var _yScale = this.yScale;
    var _x = this.x();
    var _y = this.y();
    var _w = this.width();
    var _h = this.height();
    var _align = this.align();
    var _valign = this.valign();
    var _padding = this.param('padding');

    // scales for bound box position
    var w = (d) => { return _xScale(_w(d)); }
    var x = (d) => { return _xScale(_x(d)); }
    var h = (d) => { return this.base.height() - _yScale(_h(d)); }
    var y = (d) => { return _yScale(_y(d)) - h(d); }

    // scales for text-position
    var tx = (d) => {
      switch (_align(d)) {
        case 'left':
          return x(d) + parseInt(_padding.left, 10);
          break;
        case 'center':
          return x(d) + (w(d) / 2);
          break;
        case 'right':
          return x(d) + w(d) - parseInt(_padding.right, 10);
          break;
      }
    };

    var anchor = (d) => {
      switch (_align(d)) {
        case 'left':
          return 'start';
          break;
        case 'center':
          return 'middle';
          break;
        case 'right':
          return 'end';
          break;
      }
    };

    var ty = (d) => {
      switch (_valign(d)) {
        case 'top':
          return y(d) + parseInt(_padding.top, 10);
          break;
        case 'middle':
          return y(d) + (h(d) / 2);
          break;
        case 'bottom':
          return y(d) + h(d) - parseInt(_padding.bottom, 10);
          break;
      }
    };

    // based on small manual testing - can probably be improved
    var dy = (d) => {
      switch (_valign(d)) {
        case 'top':
          return '1em';
          break;
        case 'middle':
          return '0.3em';
          break;
        case 'bottom':
          return '-0.4em';
          break;
      }
    }

    el.selectAll('.bounding-box')
      .attr('x', x)
      .attr('y', y)
      .attr('width', w)
      .attr('height', h)

    el.selectAll('.text')
      .text((d) => { return this.text()(d); })
      .attr('fill', (d) => { return this.color()(d) })
      .attr('x', tx)
      .attr('y', ty)
      .attr('dy', dy)
      .attr('text-anchor', anchor)
  }
}

getSet(
  LabelVis.prototype,
  ['x', 'y', 'width', 'height', 'text', 'color', 'align', 'valign', 'sortIndex']
);

module.exports = LabelVis;
