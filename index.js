
"use strict";

var getSet = require('get-set');
var extend = require('extend');

function isFunction(func) {
  return Object.prototype.toString.call(func) === '[object Function]';
}

// helper data mapping functions
function defDataMap(prop, def) {
  if (arguments.length < 2) def = null;

  return function(d, v) {
    if (isFunction(def)) def = def();
    if (arguments.length === 1) return d && d[prop] || def;
    d[prop] = v;
  };
}

var segDesc = {

  unitClass: { writable: true },
  dname: { writable: true },
  xBaseDomain: { writable: true },
  yScale: { writable: true },
  base: { writable: true },
  g: { writable: true },

  // handler width
  hdWidth: { writable: true },

  // "inherit" events,
  on: { enumerable: true, writable: true},
  trigger: {writable: true},

  init: {
    value: function() {

      // getters(setters) to be added
      getSet(this)([
        'name', 'height', 'top', 'data', 'opacity',
        'dataView', 'xDomain', 'xRange', 'yDomain', 'yRange',
        'dStart', 'dDuration', 'dHeight', 'dY', 'dColor', 'dSortIndex',
        'each'
      ]);

      // defaults
      this.minWidth = 1;
      this.selectable = false;
      this.hdWidth = 3;
      this.height(0);
      this.opacity(0.70);

      // default data accessors defDataMap(property, defaultvalue)
      this.dStart(defDataMap('start', 0));
      this.dDuration(defDataMap('duration', 0));
      this.dHeight(defDataMap('height', this.height));
      this.dY(defDataMap('y', 0));
      this.dColor(defDataMap('color', '#ccc'));

      return this;
    }
  },

  load: {
    enumerable: true, configurable: true, value: function(base){
      this.base = base; // bind the baseTimeLine
      this.unitClass = this.name() + '-item';
    }
  },

  bind: {
    value: function(g) {
      this.g = g;
      this.update();
    }
  },

  update: {
    enumerable: true, value: function(data) {
      data = data || this.data() || this.base.data();
      this.data(data);
      // this.untouchedXscale = this.base.xScale.copy();
      // this.untouchedYscale = this.base.yScale.copy();
      this.zoomFactor = this.base.zoomFactor;

      var sel = this.g.selectAll('.' + this.unitClass)
            .data(data, this.dSortIndex());

      var g = sel.enter()
      .append('g')
        .attr("class", this.unitClass)
        .attr('id', function(d) {
          return d.id;
        });
        // .attr("transform", "translate(0, 0)");

      g.append('rect')
        .attr("class", 'seg')
        .attr('fill-opacity', this.opacity());

      g.append("line")
        .attr("class", 'handle left')
        .style("stroke-width", this.hdWidth)
        .attr('stroke-opacity', 0);

      g.append("line")
        .attr("class", 'handle right')
        .style("stroke-width", this.hdWidth)
        .attr('stroke-opacity', 0);

      sel.exit().remove();
      this.draw();
    }
  },

  xZoom: {
    enumerable: true, value: function(val) {
      // console.log(this.xBaseDomain);
      // console.log('zooom');
      var that = this;
      var xScale = this.base.xScale;
      var min = xScale.domain()[0],
          max = xScale.domain()[1];

      var nuData = [];
      // var dv = extend(this.defaultDataView(), this.dataView());

      this.data().forEach(function(d, i) {
        var start = that.dStart()(d);
        var duration = that.dDuration()(d);
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
    }
  },

  draw: {
    enumerable: true, configurable: true, value: function(el) {
      el = el || this.g.selectAll('.' + this.unitClass);

      var that = this;
      var g = this.g;
      var halfHandler = this.hdWidth * 0.5;
      // var dv = extend(this.defaultDataView(), this.dataView());
      var base = this.base;
      var xScale = this.base.xScale;
      var max = Math.max;

      // data mappers
      var dStart = this.dStart();
      var dDuration = this.dDuration();
      var dY = this.dY();
      var dColor = this.dColor();
      var dHeight = this.dHeight();

      var x = function(d) { return xScale(dStart(d)); };
      var w = function(d) { return max(that.minWidth,
        (xScale(dStart(d) + dDuration(d))) - xScale(dStart(d))); };

      // var h = function(d) { return max(that.yScale(dv.height(d)), 1); };
      var h = function(d) { return max(base.height() - that.yScale(dHeight(d)), 1); };
      var y = function(d) { return that.yScale(dY(d)) - h(d); };

      // handlers
      var lx = function(d) { return xScale(dStart(d)) + halfHandler; };
      var rx = function(d) {
        var _w = (xScale(dStart(d) + dDuration(d))) - xScale(dStart(d));
        var rpos = xScale(dStart(d) + dDuration(d)) - halfHandler;
        return (_w < that.minWidth) ? dStart(d) + ((that.minWidth + that.hdWidth) * 2 ) : rpos;
      };

      var lrh = function(d) { return y(d) + h(d); };
      var color = function(d) { return dColor(d); };

      var segs = el.selectAll('.seg');

      segs.attr('x', x)
        .attr('y', y)

        .attr('width', w)
        .attr('height', h)

        .attr('fill', color);

      if(!!this.each()) el.each(this.each());

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
    }
  }

};

module.exports = function createBaseTimeline(options){
  var segmenter = Object.create({}, segDesc);
  return segmenter.init();
};
