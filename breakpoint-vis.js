var getSet   = require('utils').getSet;
// var extend   = require('utils').extend;
var uniqueId = require('utils').uniqueId;
var LayerVis = require('layer-vis');
var pck = require('./package.json');

'use strict';

var BreakpointVis = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(BreakpointVis, super$0);var proto$0={};

  function BreakpointVis() {
    if (!(this instanceof BreakpointVis)) { return new BreakpointVis; }

    super$0.call(this);

    var name = pck.name.replace('-vis', '');

    var defaults = {
      type: name,
      id: uniqueId(name),
      opacity: 1,
      color: '#000000',
      lineColor: '#000000',
      displayLine: true,
      interpolate: 'linear'
    };

    this.params(defaults);

    this.cx(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) return +d.cx || 1;
      d.cx = (+v);
    });

    this.cy(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) return +d.cy || 1;
      d.cy = (+v);
    });

    this.r(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) return +d.r || 3;
      d.r = (+v);
    });

    this.opacity(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) return +d.opacity;
      d.opacity = (+v);
    });

    this.color(function(d)  {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) return d.color;
      d.color = v + '';
    });
  }if(super$0!==null)SP$0(BreakpointVis,super$0);BreakpointVis.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":BreakpointVis,"configurable":true,"writable":true}});DP$0(BreakpointVis,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  // keep breakpoints coherent in time axis
  proto$0.sortData = function() {
    var cx = this.cx();
    this.data().sort(function(a, b)  { return cx(a) - cx(b); });
  };

  proto$0.xZoom = function() {
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
  };

  proto$0.update = function(data) {
    super$0.prototype.update.call(this, data);

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
    sel.enter()
      .append('circle')
      .classed('item', true)
      .classed(this.param('unitClass'), true);

    sel.exit().remove();
  };

  proto$0.draw = function(el) {var this$0 = this;
    el = el || this.g.selectAll('.' + this.param('unitClass'));

    var _xScale = this.base.xScale;
    var _yScale = this.yScale;
    var _cx = this.cx();
    var _cy = this.cy();
    var _r  = this.r();
    var _color = this.color();
    var _opacity = this.opacity();

    var cx = function(d)  { return _xScale(_cx(d)); };
    var cy = function(d)  { return _yScale(_cy(d)); };
    var r  = function(d)  { return _r(d); };
    var color     = function(d)  { return _color(d) || this$0.param('color'); }
    var opacity = function(d)  { return _opacity(d) || this$0.param('opacity'); }

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
    el.attr('fill', color)
      .attr('fill-opacity', opacity)
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', r);
  };

MIXIN$0(BreakpointVis.prototype,proto$0);proto$0=void 0;return BreakpointVis;})(LayerVis);

// add data accessors
getSet(BreakpointVis.prototype, [
  'cx', 'cy', 'r', 'opacity', 'color'
]);

module.exports = BreakpointVis;
