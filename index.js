
"use strict";

var getSet = require('get-set');

var segDesc = {

  dname: { writable: true },
  xBaseDomain: { writable: true },
  xScale: { writable: true },
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
        'name', 'height', 'top', 'opacity',
        'dataView'
      ]);
      
      // defaults
      var minWidth = 1;
      this.selectable = false;
      this.hdWidth = 3;
      this.height(0);
      this.opacity(0.70);

      return this;
    }
  },

  load: {
    enumerable: true, configurable: true, value: function(base){
      this.base = base; // bind the baseTimeLine
    }
  },

  bind: {
    value: function(g) {
      this.g = g;
      this.update();
    }
  },

  update: {
    enumerable: true, value: function() {
      var that = this;
      var data = this.base.data();
      var dataView = this.dataView();

      var sel = this.g.selectAll('.item')
            .data(data, dataView.sortIndex || null); // ! we may or may not pass a sorting index

      var g = sel.enter()
      .append('g')
        .attr("class", 'item')
        .attr("transform", "translate(0, 0)");

      g.append('rect')
        .attr("class", 'seg')
        .attr('y', 0)
        .attr('fill-opacity', this.opacity())
        .attr('height', this.height());
      
      g.append("line")
        .attr("class", 'handle left')
        .attr("y1", 0)
        .style("stroke-width", this.hdWidth)
        .attr("y2", this.height())
        .attr('stroke-opacity', 0);
      
      g.append("line")
        .attr("class", 'handle right')
        .attr("y1", 0)
        .style("stroke-width", this.hdWidth)
        .attr("y2", this.height())
        .attr('stroke-opacity', 0);
      
      sel.exit().remove();
      this.draw();
    }
  },

  // xZoon: {
  //   enumerable: true, value: function(val){
  //     var xAxis = this.graph[this.iName];
  //     xAxis.scale(this.xScale);

  //     this.g.call(xAxis);
  //   }
  // },

  draw: {
    enumerable: true, configurable: true, value: function(el) {
      el = el || this.g.selectAll('.item');

      var that = this;
      var g = this.g;
      var halfHandler = this.hdWidth * 0.5;
      var dataView = this.dataView();

      // offset handles
      var lx = function(d) { return that.xScale(dataView.start(d)) + halfHandler; };
      var rx = function(d) { return that.xScale(dataView.start(d) + dataView.duration(d)) - halfHandler; };
      var x = function(d) { return that.xScale(dataView.start(d)); };
      var w = function(d) { return that.xScale(dataView.duration(d)); };
      var color = dataView.color;

      el.selectAll('.seg')
        .attr('fill', color)
        .attr('width', w)
        .attr('x', x);

      el.selectAll('.handle.left')
        .attr("x1", lx)
        .attr("x2", lx)
        .attr("fill", color)
        .style("stroke", color);

      el.selectAll('.handle.right')
        .attr("x1", rx)
        .attr("x2", rx)
        .attr("fill", color)
        .style("stroke", color);

    }
  }

};

module.exports = function createBaseTimeline(options){
  var segmenter = Object.create({}, segDesc);
  return segmenter.init();
};