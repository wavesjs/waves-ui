var LayerVis  = require('layer-vis');
var pck       = require('./package.json');
var getSet    = require('utils').getSet;

'use strict';

var LabelVis = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(LabelVis, super$0);var proto$0={};

  function LabelVis() {
    if (!(this instanceof LabelVis)) { return new LabelVis; }

    super$0.call(this);

    this.params({
      'name': pck.name.replace('-vis', ''),
      'padding': { top: 0, right: 0, bottom: 0, left: 0 }
    });

    // data accessors
    this.y(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) { return +d.y || 0 }
      d.y = (+v);
    });

    this.x(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) { return +d.x || 0 }
      d.x = (+v);
    });

    this.width(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) { return +d.width || 0 }
      d.width = (+v);
    });

    this.height(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) { return +d.height || 0 }
      d.height = (+v);
    });

    this.text(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) { return (d.text + '') }
      d.text = (v + '');
    });

    this.color(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) { return d.color ? d.color + '' : '#000000' }
      d.color = (v + '');
    });

    // 'left', 'center', 'top'
    this.align(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) { return d.align ? d.align + '' : 'left' }
      d.align = (v + '');
    });

    // 'top', 'middle', 'bottom'
    this.valign(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) { return d.valign ? d.valign + '' : 'top' }
      d.valign = (v + '');
    });

    // 'padding' ?
  }if(super$0!==null)SP$0(LabelVis,super$0);LabelVis.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":LabelVis,"configurable":true,"writable":true}});DP$0(LabelVis,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.update = function(data) {
    super$0.prototype.update.call(this, data);

    var sel = this.g.selectAll('.' + this.unitClass)
      .data(this.data(), this.sortIndex());

    var g = sel.enter()
      .append('g')
      .attr('class', this.unitClass)
      .attr('id', function(d)  { return d.id; });

    g.append('rect')
      .attr('class', 'bounding-box')
      .attr('fill', 'transparent')
      .style('opacity', 0.2)

    g.append('text')
     .attr('class', 'text');

    sel.exit().remove();
    this.draw();
  };

  proto$0.draw = function() {var el = arguments[0];if(el === void 0)el = null;var this$0 = this;
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
    var w = function(d)  { return _xScale(_w(d)); }
    var x = function(d)  { return _xScale(_x(d)); }
    var h = function(d)  { return this$0.base.height() - _yScale(_h(d)); }
    var y = function(d)  { return _yScale(_y(d)) - h(d); }

    // scales for text-position
    var tx = function(d)  {
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

    var anchor = function(d)  {
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

    var ty = function(d)  {
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
    var dy = function(d)  {
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
      .text(function(d)  { return this$0.text()(d); })
      .attr('fill', function(d)  { return this$0.color()(d) })
      .attr('x', tx)
      .attr('y', ty)
      .attr('dy', dy)
      .attr('text-anchor', anchor)
  };
MIXIN$0(LabelVis.prototype,proto$0);proto$0=void 0;return LabelVis;})(LayerVis);

getSet(
  LabelVis.prototype,
  ['x', 'y', 'width', 'height', 'text', 'color', 'align', 'valign', 'sortIndex']
);

module.exports = LabelVis;
