var LayerVis  = require('layer-vis');
var pck       = require('./package.json');
var getSet    = require('utils').getSet;
var uniqueId  = require('utils').uniqueId;

'use strict';

class LabelVis extends LayerVis {

  constructor() {
    if (!(this instanceof LabelVis)) { return new LabelVis; }

    super();

    var defaults = {
      name: uniqueId(pck.name.replace('-vis', '')),
      // expose to allow tweaking vertical alignment for design adjustments
      verticalAlignment: { top: '1em', middle: '0.5em', bottom: '0' }
    };

    this.params(defaults);

    // data accessors
    this.y((d, v = null) => {
      if (v === null) { return +d.y || 0 }
      d.y = (+v);
    });

    this.x((d, v = null) => {
      if (v === null) { return +d.x || 0 }
      d.x = (+v);
    });

    this.text((d, v = null) => {
      if (v === null) { return (d.text + '') }
      d.text = (v + '');
    });

    // the following can also be setted as global params
    // which are acting as default values
    this.width((d, v = null) => {
      if (v === null) { return +d.width }
      d.width = (+v);
    });

    this.height((d, v = null) => {
      if (v === null) { return +d.height }
      d.height = (+v);
    });

    this.color((d, v = null) => {
      if (v === null) { return d.color || '#000000' }
      d.color = (v + '');
    });

    // 'left', 'center', 'top'
    this.align((d, v = null) => {
      if (v === null) { return d.align || 'left' }
      d.align = (v + '');
    });

    // 'top', 'middle', 'bottom'
    this.valign((d, v = null) => {
      if (v === null) { return d.valign || 'top' }
      d.valign = (v + '');
    });

    this.margin({ top: 0, right: 0, bottom: 0, left: 0 });

    // 'margin' ?
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

    g.append('line')
     .attr('class', 'line')

    sel.exit().remove();
  }

  draw(el = null) {
    if (el === null) { el = this.g.selectAll('.' + this.unitClass); }

    var _xScale = this.base.xScale;
    var _yScale = this.yScale;

    var _w = this.width();
    var _h = this.height();
    var _x = this.x();
    var _y = this.y();
    var _align  = this.align();
    var _valign = this.valign();
    var _margin = this.margin();
    var _verticalAlignment = this.params().verticalAlignment;

    // scales for bound box position
    var w = (d) => { return _xScale(_w(d)); }
    var x = (d) => { return _xScale(_x(d)); }
    var h = (d) => { return this.param('height') - _yScale(_h(d)); }
    var y = (d) => { return _yScale(_y(d)) - h(d); }

    // scales for text-position
    var tx = (d) => {
      switch (_align(d)) {
        case 'left':
          return x(d) + parseInt(_margin().left, 10);
          break;
        case 'center':
          return x(d) + (w(d) / 2);
          break;
        case 'right':
          return x(d) + w(d) - parseInt(_margin().right, 10);
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
          return y(d) + parseInt(_margin().top, 10);
          break;
        case 'middle':
          return y(d) + (h(d) / 2);
          break;
        case 'bottom':
          return y(d) + h(d) - parseInt(_margin().bottom, 10);
          break;
      }
    };


    // based on small manual testing - can probably be improved
    var dy = (d) => {
      switch (_valign(d)) {
        case 'top':
          return _verticalAlignment.top;
          break;
        case 'middle':
          return _verticalAlignment.middle;
          break;
        case 'bottom':
          return _verticalAlignment.bottom;
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

    // testing
  }
}

getSet(
  LabelVis.prototype,
  ['x', 'y', 'width', 'height', 'text', 'color', 'align', 'valign', 'margin', 'sortIndex']
);

module.exports = LabelVis;
