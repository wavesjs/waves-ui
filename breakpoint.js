'use strict';

var uniqueId = (accessors = require('utils')).uniqueId, accessors = accessors.accessors;
var Layer = require('layer');

var Breakpoint = (function(super$0){var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(Breakpoint, super$0);var proto$0={};

  function Breakpoint() {
    if (!(this instanceof Breakpoint)) { return new Breakpoint; }

    super$0.call(this);

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

    this.cx(function(d) {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) return +d.cx;
      d.cx = (+v);
    });

    this.cy(function(d) {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) return +d.cy;
      d.cy = (+v);
    });

    this.r(function(d) {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) return +d.r;
      d.r = (+v);
    });

    this.opacity(function(d) {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) return +d.opacity;
      d.opacity = (+v);
    });

    this.color(function(d) {var v = arguments[1];if(v === void 0)v = null;
      if (v === null) return d.color;
      d.color = v + '';
    });
  }if(super$0!==null)SP$0(Breakpoint,super$0);Breakpoint.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":Breakpoint,"configurable":true,"writable":true}});DP$0(Breakpoint,"prototype",{"configurable":false,"enumerable":false,"writable":false});

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

    this.items = this.g.selectAll('.' + this.param('unitClass'))
      .data(this.data(), this.dataKey());

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
    var sel = this.items.enter()
      .append('g')
      .classed('item', true)
      .classed(this.param('unitClass'), true)

    sel.append('circle');

    this.items.exit().remove();
  };

  proto$0.draw = function(el) {var this$0 = this;
    el = el || this.items;

    this.sortData();

    var _xScale = this.base.xScale;
    var _yScale = this.yScale;
    var _cx = this.cx();
    var _cy = this.cy();
    var _r  = this.r();
    var _color = this.color();
    var _opacity = this.opacity();

    var cx = function(d)  { return _xScale(_cx(d)); };
    var cy = function(d)  { return _yScale(_cy(d)); };
    var r  = function(d)  { return _r(d) || this$0.param('radius'); };
    var color   = function(d)  { return _color(d) || this$0.param('color'); }
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
    el.selectAll('circle')
      .attr('fill', color)
      .attr('fill-opacity', opacity)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', r)
      .attr('transform', function(d)  {
        return 'translate(' + cx(d) + ', ' + cy(d) + ')';
      });

    if (!!this.each()) { el.each(this.each()); }
  };

  // logic performed to select an item from the brush
  proto$0.handleBrush = function(extent, e) {

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
  };

  proto$0.handleDrag = function(item, e) {
    if (item === null) { return; }

    this.move(item, e.originalEvent.dx, e.originalEvent.dy);
  };

  proto$0.move = function(item, dx, dy) {
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
  };

MIXIN$0(Breakpoint.prototype,proto$0);proto$0=void 0;return Breakpoint;})(Layer);

// add data accessors
accessors.getFunction(Breakpoint.prototype, [
  'cx', 'cy', 'r', 'opacity', 'color'
]);

module.exports = Breakpoint;
