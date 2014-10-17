
"use strict";

var LayerVis = require('layer-vis');
var pck = require('./package.json');
var getSet = require('utils').getSet;

var SegmentVis = (function(super$0){var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(SegmentVis, super$0);var proto$0={};


  function SegmentVis() {

    if (!(this instanceof SegmentVis)) return new SegmentVis;

    super$0.call(this);

    // set layer defaults
    this.param('name', pck.name.replace('-vis', ''));

    this.__minWidth = 1;
    this.__handleWidth = 3;

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
      if (v === null) return d.color + '';
      d.color = v + '';
    });
  }if(super$0!==null)SP$0(SegmentVis,super$0);SegmentVis.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":SegmentVis,"configurable":true,"writable":true}});DP$0(SegmentVis,"prototype",{"configurable":false,"enumerable":false,"writable":false});


  proto$0.update = function(data) {

    super$0.prototype.update.call(this, data);

    var sel = this.g.selectAll('.' + this.unitClass)
          .data(this.data(), this.sortIndex());

    var g = sel.enter()
    .append('g')
      .attr("class", this.unitClass)
      .attr('id', function(d) {
        return d.id;
      });
      // .attr("transform", "translate(0, 0)");

    g.append('rect')
      .attr("class", 'seg')
      .attr('fill-opacity', this.param('opacity'));

    g.append("line")
      .attr("class", 'handle left')
      .style("stroke-width", this.__handleWidth)
      .attr('stroke-opacity', 0);

    g.append("line")
      .attr("class", 'handle right')
      .style("stroke-width", this.__handleWidth)
      .attr('stroke-opacity', 0);

    sel.exit().remove();
    this.draw();
  };


  proto$0.draw = function(el) {
    el = el || this.g.selectAll('.' + this.unitClass);

    var that = this;
    var g = this.g;
    var halfHandler = this.__handleWidth * 0.5;

    var base = this.base;
    var xScale = this.base.xScale;
    var max = Math.max;

    // data mappers
    var _start = this.start();
    var _duration = this.duration();
    var _y = this.y();
    var _color = this.color();
    var _height = this.height();

    var x = function(d) { return xScale(_start(d)); };
    var w = function(d) { return max(that.__minWidth,
      (xScale(_start(d) + _duration(d))) - xScale(_start(d))); };

    // var h = function(d) { return max(that.yScale(dv.height(d)), 1); };
    var h = function(d) { return max(base.height() - that.yScale(_height(d)), 1); };
    var y = function(d) { return that.yScale(_y(d)) - h(d); };

    // handlers
    var lx = function(d) { return xScale(_start(d)) + halfHandler; };
    var rx = function(d) {
      var _w = (xScale(_start(d) + _duration(d))) - xScale(_start(d));
      var rpos = xScale(_start(d) + _duration(d)) - halfHandler;
      return (_w < that.__minWidth) ? _start(d) + ((that.__minWidth + that.__handleWidth) * 2 ) : rpos;
    };

    var lrh = function(d) { return y(d) + h(d); };
    var color = function(d) { return _color(d); };

    var segs = el.selectAll('.seg');

    segs.attr('x', x)
      .attr('y', y)

      .attr('width', w)
      .attr('height', h)

      .attr('fill', color);

    if (!!this.each()) el.each(this.each());

    el.selectAll('.handle.left')
      .attr("x1", lx)
      .attr("x2", lx)

      .attr("y1", y)
      .attr("y2", lrh)

      .attr("fill", color)
      .style("stroke", color);

    el.selectAll('.handle.right')
      .attr("x1", rx)
      .attr("x2", rx)

      .attr("y1", y)
      .attr("y2", lrh)

      .attr("fill", color)
      .style("stroke", color);
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
