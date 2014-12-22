var LayerVis  = require('layer-vis');
var pck       = require('./package.json');
var getSet    = require('utils').getSet;
var uniqueId  = require('utils').uniqueId;
var name = pck.name.replace('-vis', '');

'use strict';

var SegmentVis = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(SegmentVis, super$0);var proto$0={};

  function SegmentVis() {
    if (!(this instanceof SegmentVis)) return new SegmentVis;

    super$0.call(this);
    // set layer defaults
    this.params({ 
      type: name, 
      opacity: 1 
    });

    this.__minWidth = 1;
    // initialize data accessors
    this.y(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) return +d.y || 0;
      d.y = (+v);
    });

    this.height(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) return +d.height || 1;
      d.height = (+v);
    });

    this.duration(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) return +d.duration || 1;
      d.duration = (+v);
    });

    this.start(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) return +d.start || 0;
      d.start = (+v);
    });

    this.color(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) return d.color ? d.color + '' : '#000000';
      d.color = v + '';
    });

    this.opacity(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) return d.opacity;
      d.opacity = v + '';
    });
  }if(super$0!==null)SP$0(SegmentVis,super$0);SegmentVis.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":SegmentVis,"configurable":true,"writable":true}});DP$0(SegmentVis,"prototype",{"configurable":false,"enumerable":false,"writable":false});


  proto$0.update = function(data) {
    super$0.prototype.update.call(this, data);

    var sel = this.g.selectAll('.' + this.param('unitClass'))
      .data(this.data(), this.sortIndex());

    var g = sel.enter()
      .append('g')
      .classed('item', true)
      .classed(this.param('unitClass'), true);

    g.append('rect');

    sel.exit().remove();

    return g;
  };

  proto$0.draw = function() {var el = arguments[0];if(el === void 0)el = null;
    if (el === null) { el = this.g.selectAll('.' + this.param('unitClass')); }

    var accessors = this.getAccessors();

    el.attr('transform', function(d) {
      return 'translate(' + accessors.x(d) + ', ' + accessors.y(d) + ')';
    })

    el.selectAll('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', accessors.w)
      .attr('height', accessors.h)
      .attr('fill', accessors.color)
      .attr('fill-opacity', accessors.opacity);

    if (!!this.each()) { el.each(this.each()); }
    // return el for segment edit's `draw` method
    return el;
  };

  // #NOTE add some caching system ?
  proto$0.getAccessors = function() {var this$0 = this;
    // if (this.params('accessors')) {
    //   return this.params('accessors');
    // }

    var _xScale = this.base.xScale;
    var _yScale = this.yScale;

    // data mappers
    var _start    = this.start();
    var _y        = this.y();
    var _duration = this.duration();
    var _height   = this.height();
    var _color    = this.color();
    var _opacity  = this.opacity();

    // define accesors
    var w = function(d)  { return Math.max(this$0.__minWidth, _xScale(_duration(d))); };
    var h = function(d)  { return this$0.param('height') - _yScale(_height(d)); };
    var x = function(d)  { return _xScale(_start(d)); };
    var y = function(d)  { return _yScale(_y(d)) - h(d); };

    var color = function(d)  { return _color(d); };
    var opacity = function(d)  { return (_opacity(d) || this$0.param('opacity')); }

    // this.params('accessors', { w: w, h: h, x: x, y: y, color: color });
    // return this.params('accessors');
    return { w: w, h: h, x: x, y: y, color: color, opacity: opacity };
  };

  proto$0.xZoom = function(val) {
    // console.log(this.xBaseDomain);
    // console.log('zooom');
    var that = this;
    var xScale = this.base.xScale;
    var min = xScale.domain()[0],
        max = xScale.domain()[1];

    var newData = [];

    this.data().forEach(function(d, i) {
      var start = that.start()(d);
      var duration = that.duration()(d);
      var end = start + duration;
      // if((start + dv.duration(d)) <= max && start >= min) nuData.push(d);
      if (
        (start > min && end < max) || 
        (start < min && end < max && end > min) || 
        (start > min && start < max && end > max) || 
        (end > max && start < min)
      ) {
        newData.push(d);
      }
      // if((end < min && start < min) || (end > max && start > max)) nuData.push(d);
    });

    // this.update(nuData);
    this.update();
    // var xAxis = this.graph[this.iName];
    // xAxis.scale(xScale);

    // this.g.call(xAxis);
  };

MIXIN$0(SegmentVis.prototype,proto$0);proto$0=void 0;return SegmentVis;})(LayerVis);

// add and initialize our accessors
getSet(SegmentVis.prototype, ['y', 'width', 'color', 'height', 'duration', 'start', 'sortIndex', 'opacity']);

module.exports = SegmentVis;
