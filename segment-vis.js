var LayerVis = require('layer-vis');
var pck = require('./package.json');
var getSet = require('utils').getSet;

'use strict';

var SegmentVis = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(SegmentVis, super$0);var proto$0={};


  function SegmentVis() {

    if (!(this instanceof SegmentVis)) return new SegmentVis;

    super$0.call(this);

    // set layer defaults
    this.params({
      name: pck.name.replace('-vis', ''),
      handlerWidth: 3,
      handlerOpacity: 0
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
  }if(super$0!==null)SP$0(SegmentVis,super$0);SegmentVis.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":SegmentVis,"configurable":true,"writable":true}});DP$0(SegmentVis,"prototype",{"configurable":false,"enumerable":false,"writable":false});


  proto$0.update = function(data) {

    super$0.prototype.update.call(this, data);

    var sel = this.g.selectAll('.' + this.unitClass)
      .data(this.data(), this.sortIndex());

    var g = sel.enter()
      .append('g')
      .attr('class', this.unitClass)
      .attr('id', function(d)  { return d.id; });

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
  };


  proto$0.draw = function() {var el = arguments[0];if(el === void 0)el = null;var this$0 = this;
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
    var x = function(d)  { return _xScale(_start(d)); }
    var w = function(d)  { return max(that.__minWidth, _xScale(_duration(d))); }
    var h = function(d)  { return this$0.param('height') - _yScale(_height(d)); }
    var y = function(d)  { return _yScale(_y(d)) - h(d); }

    // handler positions
    var lhx = function(d)  { return x(d) + _halfHandler; }
    var rhx = function(d)  {
      var width = w(d);
      return (width < this$0.__minWidth) ?
        x(d) + _handlerWidth : x(d) + width - _halfHandler;
    }
    var hh  = function(d)  { return y(d) + h(d); }

    // color accessor
    var color = function(d)  { return _color(d); }

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
  };


  proto$0.xZoom = function(val) {
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
  };

MIXIN$0(SegmentVis.prototype,proto$0);proto$0=void 0;return SegmentVis;})(LayerVis);

// add and initialize our accessors
getSet(SegmentVis.prototype, ['y', 'width', 'color', 'height', 'duration', 'start', 'sortIndex']);

module.exports = SegmentVis;
