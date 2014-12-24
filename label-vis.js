var LayerVis  = require('layer-vis');
var pck       = require('./package.json');
var accessors = require('utils').accessors;
var uniqueId  = require('utils').uniqueId;

'use strict';

var LabelVis = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(LabelVis, super$0);var proto$0={};

  function LabelVis() {
    if (!(this instanceof LabelVis)) { return new LabelVis; }

    super$0.call(this);

    var name = pck.name.replace('-vis', '');

    // this.xScale().clamp(true);
    // this.yScale().clamp(true);

    var defaults = {
      type: name,
      id: uniqueId(name),
      // expose to allow tweaking vertical alignment for design adjustments
      verticalAlignment: { top: '1em', middle: '0.5em', bottom: '0' }
    };

    this.params(defaults);

    // data accessors
    this.y(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) { return +d.y || 0 }
      d.y = (+v);
    });

    this.x(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) { return +d.x || 0 }
      d.x = (+v);
    });

    this.text(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) { return (d.text + '') }
      d.text = (v + '');
    });

    this.bgColor(function(d, v)  {
      if (v === null) { return d.bgColor + ''; }
      d.bgColor = (v + '');
    });

    // the following can also be setted as global params
    // which are acting as default values
    this.width(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) { return +d.width }
      d.width = (+v);
    });

    this.height(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) { return +d.height }
      d.height = (+v);
    });

    this.color(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) { return d.color || '#000000' }
      d.color = (v + '');
    });

    // 'left', 'center', 'top'
    this.align(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) { return d.align || 'left' }
      d.align = (v + '');
    });

    // 'top', 'middle', 'bottom'
    this.valign(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) { return d.valign || 'top' }
      d.valign = (v + '');
    });

    this.margin({ top: 0, right: 0, bottom: 0, left: 0 });
  }if(super$0!==null)SP$0(LabelVis,super$0);LabelVis.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":LabelVis,"configurable":true,"writable":true}});DP$0(LabelVis,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.update = function(data) {
    super$0.prototype.update.call(this, data);

    var sel = this.g.selectAll('.' + this.param('unitClass'))
      .data(this.data(), this.sortIndex());

    var g = sel.enter()
      .append('g')
      .classed('item', true)
      .classed(this.param('unitClass'), true);

    g.append('rect')
      .attr('class', 'bounding-box')
      .attr('fill', 'transparent')

    g.append('text')
     .attr('class', 'text');

    sel.exit().remove();
  };

  proto$0.draw = function() {var el = arguments[0];if(el === void 0)el = null;var this$0 = this;
    if (el === null) { el = this.g.selectAll('.' + this.param('unitClass')); }

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

    // scales for bounding box position
    var w = function(d)  { return _xScale(_w(d)); }
    var x = function(d)  { return _xScale(_x(d)); }
    var h = function(d)  { return this$0.param('height') - _yScale(_h(d)); }
    var y = function(d)  { return _yScale(_y(d)) - h(d); }

    // scales for text-position
    var tx = function(d)  {
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
    var dy = function(d)  {
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
      .attr('fill', function(d)  { return this$0.bgColor()(d); });

    el.selectAll('.text')
      .text(function(d)  { return this$0.text()(d); })
      .attr('fill', function(d)  { return this$0.color()(d); })
      .attr('x', tx)
      .attr('y', ty)
      .attr('dy', dy)
      .attr('text-anchor', anchor)

    if (!!this.each()) { el.each(this.each()); }
  };
MIXIN$0(LabelVis.prototype,proto$0);proto$0=void 0;return LabelVis;})(LayerVis);

accessors.getFunction(LabelVis.prototype,[
  'x', 'y', 'width', 'height', 'text', 
  'color', 'align', 'valign', 'margin', 
  'sortIndex', 'bgColor'
]);

module.exports = LabelVis;
