'use strict';

var Layer = require('layer');
var accessors = (uniqueId = require('utils')).accessors, uniqueId = uniqueId.uniqueId;

var Marker = (function(super$0){var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(Marker, super$0);var proto$0={};

  function Marker() {
    if (!(this instanceof Marker)) return new Marker();

    super$0.call(this);

    var defaults = {
      type: 'cursor',
      id: uniqueId(name),
      displayMark: true
    };

    this.params(defaults);
    this.width(1);
    this.color('#000000');
    this.opacity('0.7');
    this.data([{ x: 0 }]);

    this.x(function(d) {var v = arguments[1];if(v === void 0)v = null;
      if (v !== null) { return d.x = parseFloat(v, 10); }
      return d.x
    })
  }if(super$0!==null)SP$0(Marker,super$0);Marker.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":Marker,"configurable":true,"writable":true}});DP$0(Marker,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.xZoom = function() {
    this.update();
  };

  proto$0.setCurrentTime = function(currentTime) {
    var x = this.x();

    if (!Array.isArray(currentTime)) {
      x(this.data()[0], currentTime);
    } else {
      this.data(currentTime);
    }

    // this.update();
    // this.draw();
    return this;
  };

  proto$0.handleDrag = function(el, e) {
    this.move(el, e.originalEvent.dx, e.originalEvent.dy);
  };

  proto$0.move = function(item, dx, dy) {
    item = this.d3.select(item);
    var datum = item.datum();

    var xScale = this.base.xScale;
    var xRange = xScale.range();
    var x = xScale(datum);
    var targetX = x + dx;

    if (targetX >= xRange[0] && targetX <= xRange[1]) {
      x = targetX;
    }

    datum = xScale.invert(x);
    item.datum(datum);
    // redraw element
    this.draw(item);
  };

  proto$0.update = function() {var data = arguments[0];if(data === void 0)data = null;
    if (data !== null && !Array.isArray(data)) { data = [data]; }
    super$0.prototype.update.call(this, data);

    this.items = this.g.selectAll('.' + this.param('unitClass'))
      .data(this.data());

    this.items.enter()
      .append('g')
      .classed('item', true)
      .classed(this.param('unitClass'), true);

    // console.log(this.items.data());
    var markHeight = 8;
    var height, y;

    if (this.param('displayMark')) {
      height = this.param('height') - markHeight;
      y = markHeight;
    } else {
      height = this.param('height');
      y = 0;
    }

    this.items.append('line')
      .style('stroke-width', this.width())
      .style('stroke', this.color())
      .style('opacity', this.opacity())
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', y)
      .attr('y2', height)

    if (this.param('displayMark')) {
      var area = this.d3.svg.area()
        .x(function(d) { return d; })
        .y0(0)
        .y1(markHeight);

      this.items.append('path')
        .attr('d', area([-3, 4]))
        .style('opacity', this.opacity())
        .style('fill', this.color());
    }

    this.items.exit().remove();
  };

  proto$0.draw = function() {var el = arguments[0];if(el === void 0)el = null;
    el = el || this.items;

    var xScale = this.base.xScale;
    var xAccessor = this.x();
    var x = function(d)  { return xScale(xAccessor(d)); };

    el.attr('transform', function(d)  {
      return 'translate(' + x(d) + ', 0)';
    });
  };
MIXIN$0(Marker.prototype,proto$0);proto$0=void 0;return Marker;})(Layer);

accessors.getFunction(Marker.prototype,
  ['color', 'opacity', 'width', 'x']
);

module.exports = Marker;
