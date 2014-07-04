/* global d3 */

"use strict";

var getSet = require('get-set');
var extend = require('extend');

var bkptDesc = {

  unitClass: { writable: true },
  base: { writable: true },
  g: { writable: true },
  xBaseDomain: { writable: true },
  line: { writable: true },
 
  // "inherit" events,
  on: { enumerable: true, writable: true},
  trigger: {writable: true},
  
  init: {
    value: function() {

      // getters(setters) to be added
      getSet(this)([
        'name', 'height', 'top', 'data', 'opacity',
        'color', 'lineColor',
        'dataView', 'xDomain', 'xRange', 'yDomain', 'yRange', 'interpolate'
      ]);
      
      // defaults
      this.selectable = false;
      this.height(0);
      this.opacity(0.70);
      this.line = d3.svg.line();
      this.interpolate('linear');

      return this;
    }
  },

  // default dataView to be overriden by the user's
  defaultDataView: {
    value: function() {
      var that = this;
      return {
        cx: function(d, v) {
          if(!v) return +d.cx || 0;
          d.cx = (+v);
        },
        cy: function(d, v) {
          if(!v) return +d.cy || 1;
          d.cy = (+v);
        },
        r: function(d, v) {
          if(!v) return +d.r || 5;
          d.r = (+v);
        },
        color: function(d, v) {
          if(!v) return d.color || that.color() || '#000';
          d.color = v;
        },
        lineColor: function(d) {
          return that.lineColor() || that.color() || '#000';
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

  sortData: {
    value: function(data) {

      var dv = extend(this.defaultDataView(), this.dataView());
      data.sort(function(a, b) {
        return (dv.cx(a) < dv.cx(b) ? -1 : (dv.cx(a) > dv.cx(b) ? 1 : 0));
      });
    }
  },

  update: {
    enumerable: true, value: function(data) {

      data = data || this.data() || this.base.data();
      this.data(data);
     
      var that = this;

      var xScale = this.base.xScale;
      var yScale = this.base.yScale;
      var dv = extend(this.defaultDataView(), this.dataView());

      this._linedata = data.slice();
      this.sortData(this._linedata);

      var sel = this.g.selectAll('.' + this.unitClass)
            .data(data, dv.sortIndex || null);
      
      var path =  this.g.select('.bkpt-line');
      if(!path.node()) path = this.g.append("path");

      path.attr("class", 'bkpt-line')
        .attr('stroke-opacity', this.opacity());

      this.line
        .x(function(d){ return xScale(dv.cx(d));})
        .y(function(d){ return yScale(dv.cy(d));})
        .interpolate(this.interpolate());

      var g = sel.enter()
      .append('g')
        .attr("class", this.unitClass)
        .attr('id', function(d, i) {
          return d.id || that.unitClass + '-' + i;
        });

      g.append("circle")
        .attr("class", 'bkpt')
        .attr('fill-opacity', this.opacity());
      
      sel.exit().remove();
      this.draw();
    }
  },

  xZoom: {
    enumerable: true, value: function(val) {

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
      // this.update();
      this.draw();
    }
  },

  draw: {
    enumerable: true, configurable: true, value: function(el) {
      el = el || this.g.selectAll('.' + this.unitClass);

      var dv = extend(this.defaultDataView(), this.dataView());
      var base = this.base;
      var xScale = base.xScale;
      var yScale = base.yScale;
      
      var cx = function(d) { return xScale(dv.cx(d)); };
      var cy = function(d) { return yScale(dv.cy(d)); };
      var r = function(d) { return dv.r(d); };
     
    
      this.g.selectAll('.bkpt-line')
        .attr("d", this.line(this._linedata))
        .attr("stroke", dv.lineColor)
        .attr("stroke-width", 1)
        .attr("fill", "none");

      el.selectAll('.bkpt')
        .attr('fill', dv.color)
        .attr('cx', cx)
        .attr('cy', cy)
        .attr("stroke-width", 1)
        .attr('r', r);

    }
  }

};

module.exports = function breakpointVis(options){
  var breakpoint = Object.create({}, bkptDesc);
  return breakpoint.init();
};