
"use strict";

var getSet = require('get-set');
var extend = require('extend');

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
        'dataView', 'xDomain', 'xRange', 'yDomain', 'yRange'
      ]);
      
      // defaults
      this.minWidth = 1;
      this.selectable = false;
      this.hdWidth = 3;
      this.height(0);
      this.opacity(0.70);

      return this;
    }
  },

  // default dataView to be overriden by the user's
  defaultDataView: {
    value: function() {
      var that = this;
      return {
                start: function(d, v) {
                  if(!v) return +d.start || 0;
                  d.start = (+v);
                },
                duration: function(d, v) {
                  if(!v) return +d.duration || 1;
                  d.duration = (+v);
                },
                height: function(d, v) {
                  if(!v) return +d.height || that.base.height();
                  d.height = (+v);
                },
                y: function(d, v) {
                  if(!v) return +d.y || 0;
                  d.y = (+v);
                },
                color: function(d, v) {
                  if(!v) return d.color || '#000000';
                  d.color = v;
                }
              };
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
      var that = this;

      data = data || this.data() || this.base.data();
      this.data(data);

      var dv = extend(this.defaultDataView(), this.dataView());

      // this.untouchedXscale = this.base.xScale.copy();
      // this.untouchedYscale = this.base.yScale.copy();
      this.zoomFactor = this.base.zoomFactor;

      var sel = this.g.selectAll('.' + this.unitClass)
            .data(data, dv.sortIndex || null); // ! we may or may not pass a sorting index

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
      var xScale = this.base.xScale;
      var min = xScale.domain()[0],
          max = xScale.domain()[1];

      var nuData = [];
      var dv = extend(this.defaultDataView(), this.dataView());
      var that = this;

      this.data().forEach(function(d, i) {
        var start = dv.start(d);
        var duration = dv.duration(d);
        var end = start + duration;
        // if((dv.start(d) + dv.duration(d)) <= max && dv.start(d) >= min) nuData.push(d);
        if((start > min && end < max) || (start < min && end < max && end > min) || (start > min && start < max && end > max) || (end > max && start < min)) nuData.push(d);
        // if((end < min && start < min) || (end > max && start > max)) nuData.push(d);
      });
      
      this.update(nuData);
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
      var dv = extend(this.defaultDataView(), this.dataView());
      var base = this.base;
      var xScale = this.base.xScale;
      var max = Math.max;
      
      var x = function(d) { return xScale(dv.start(d)); };
      var w = function(d) {
        var _w = (xScale(dv.start(d) + dv.duration(d))) - xScale(dv.start(d));
        return max(that.minWidth, _w);
      };
 
      // var h = function(d) { return that.height() - that.yScale(dv.height(d)); };
      var h = function(d) { return max(that.yScale(dv.height(d)), 1); };
      var y = function(d) { return that.yScale(dv.y(d)) - h(d); };

      // handlers
      var lx = function(d) { return xScale(dv.start(d)) + halfHandler; };
      var rx = function(d) {
        var _w = (xScale(dv.start(d) + dv.duration(d))) - xScale(dv.start(d));
        var rpos = xScale(dv.start(d) + dv.duration(d)) - halfHandler;
        return (_w < that.minWidth) ? dv.start(d) + ((that.minWidth + that.hdWidth) * 2 ) : rpos;
      };

      var lrh = function(d) { return y(d) + h(d); };
      var color = function(d) { return dv.color(d); };

      el.selectAll('.seg')
        .attr('x', x)
        .attr('y', y)
        
        .attr('width', w)
        .attr('height', h)

        .attr('fill', color);

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