'use strict';

var { uniqueId, accessors } = require('../helpers/utils');
var { Layer } = require('../core/layer');

class Label extends Layer {

  constructor() {
    super();

    var defaults = {
      type: 'label',
      // expose to allow tweaking vertical alignment for design adjustments
      verticalAlignment: { top: '1em', middle: '0.5em', bottom: '0' }
    };

    this.params(defaults);

    // data accessors
    this.y(function(d, v = null) {
      if (v === null) { return +d.y || 0; }
      d.y = (+v);
    });

    this.x(function(d, v = null) {
      if (v === null) { return +d.x || 0; }
      d.x = (+v);
    });

    this.text(function(d, v = null) {
      if (v === null) { return (d.text + ''); }
      d.text = (v + '');
    });

    this.bgColor(function(d, v = null) {
      if (v === null) { return d.bgColor + ''; }
      d.bgColor = (v + '');
    });

    // the following can also be setted as global params
    // which are acting as default values
    this.width(function(d, v = null) {
      if (v === null) { return +d.width; }
      d.width = (+v);
    });

    this.height(function(d, v = null) {
      if (v === null) { return +d.height; }
      d.height = (+v);
    });

    this.color(function(d, v = null) {
      if (v === null) { return d.color || '#000000'; }
      d.color = (v + '');
    });

    // 'left', 'center', 'top'
    this.align(function(d, v = null) {
      if (v === null) { return d.align || 'left'; }
      d.align = (v + '');
    });

    // 'top', 'middle', 'bottom'
    this.valign(function(d, v = null) {
      if (v === null) { return d.valign || 'top'; }
      d.valign = (v + '');
    });

    this.margin({ top: 0, right: 0, bottom: 0, left: 0 });
  }

  xZoom(factor) {
    this.draw();
  }

  update(data) {
    super.update(data);

    this.items = this.g.selectAll('.' + this.param('unitClass'))
      .data(this.data(), this.sortIndex());

    var sel = this.items.enter()
      .append('g')
      .classed('item', true)
      .classed(this.param('unitClass'), true);

    sel.append('rect')
      .attr('class', 'bounding-box')
      .attr('fill', 'transparent');

    sel.append('text')
     .attr('class', 'text');

    this.items.exit().remove();
  }

  draw(el = null) {
    el = el || this.items;

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
    var minDomain = _xScale.domain()[0];

    // scales for bounding box position
    var w = (d) => {
      var width = _xScale(minDomain + _w(d));
      return width < 0 ? 0 : width;
    };

    var x = (d) => {
      return _xScale(_x(d));
    };

    var h = (d) => {
      return (this.param('height') - _yScale(_h(d))) || this.param('height');
    };

    var y = (d) => {
      return (_yScale(_y(d)) - h(d)) || 0;
    };

    // scales for text-position
    var tx = (d) => {
      var ret;
      switch (_align(d)) {
        case 'left':
          ret = x(d) + parseInt(_margin().left, 10);
          break;
        case 'center':
          ret = x(d) + (w(d) / 2);
          break;
        case 'right':
          ret = x(d) + w(d) - parseInt(_margin().right, 10);
          break;
      }

      return ret;
    };

    var anchor = (d) => {
      var ret;
      switch (_align(d)) {
        case 'left':
          ret = 'start';
          break;
        case 'center':
          ret = 'middle';
          break;
        case 'right':
          ret = 'end';
          break;
      }

      return ret;
    };

    var ty = (d) => {
      var ret;
      switch (_valign(d)) {
        case 'top':
          ret = y(d) + parseInt(_margin().top, 10);
          break;
        case 'middle':
          ret = y(d) + (h(d) / 2);
          break;
        case 'bottom':
          ret = y(d) + h(d) - parseInt(_margin().bottom, 10);
          break;
      }

      return ret;
    };

    // based on small manual testing - can probably be improved
    var dy = (d) => {
      var ret;
      switch (_valign(d)) {
        case 'top':
          ret = _verticalAlignment.top;
          break;
        case 'middle':
          ret = _verticalAlignment.middle;
          break;
        case 'bottom':
          ret = _verticalAlignment.bottom;
          break;
      }

      return ret;
    };

    el.selectAll('.bounding-box')
      .attr('x', x)
      .attr('y', y)
      .attr('width', w)
      .attr('height', h)
      .attr('fill', (d) => { return this.bgColor()(d); });

    el.selectAll('.text')
      .text((d) => { return this.text()(d); })
      .attr('fill', (d) => { return this.color()(d); })
      .attr('x', tx)
      .attr('y', ty)
      .attr('dy', dy)
      .attr('text-anchor', anchor);

    if (!!this.each()) { el.each(this.each()); }
  }
}

accessors.getFunction(Label.prototype,[
  'x', 'y', 'width', 'height', 'text',
  'color', 'align', 'valign', 'margin',
  'sortIndex', 'bgColor'
]);

function factory() { return new Label(); }
factory.Label = Label;

module.exports = factory;
