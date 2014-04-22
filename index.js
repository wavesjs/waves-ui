
"use strict";

var selfInit = require('self-init');
var filter = require('filter-object');
var getSet = require('get-set');
// var eventEmitter = new events.EventEmitter(); // inherits from basetimeline events

// allowed options to be passed in
var allowedOptions = ['data', 'name'];

var segDesc = {

  name: { writable: true },
  dname: { writable: true },
  xBaseDomain: { writable: true },
  base: { writable: true },
  g: { writable: true },
  selectable: { writable: true },
  handleWidth: { writable: true },

  // "inherit" events,
  on: { enumerable: true, writable: true},
  trigger: {writable: true},

  init: {
    value: function(options) {
      // we use the selfInit module here to
      // automatically set the state bases on the filtered
      // passed in options
      var addGS = getSet(this);
      addGS('model');
      addGS('data');

      selfInit(this, options);
      this.selectable = false;
      this.handleWidth = 3;
      return this;
    }
  },

  load: {
    enumerable: true, configurable: true, value: function(base){
      this.base = base; // bind the baseTimeLine
      this.on = base.on;
      this.trigger = base.trigger;
    }
  },

  bind: {
    enumerable: true, value: function(g) {
      this.g = g;

      this.update();
    }
  },

  update: {
    enumerable: true, value: function() {
      var that = this;
      var sel = this.g.selectAll('.block')
      .data(this.data(), function(d) {
        //set the sorting index to d.begin
        return d.get('begin');
      });

      var opacity = 0.60;

      var g = sel.enter()
      .append('g')
        .attr("class", 'block')
        .attr("transform", "translate(0, 0)");
      
      g.append('rect')
        .attr("class", 'seg')
        .attr('y', 0)
        .attr('fill-opacity', opacity)
        .attr('height', that.height);
      
      g.append("line")
        .attr("class", 'handle l-handle')
        .attr("y1", 0)
        .style("stroke-width", this.handleWidth)
        .attr("y2", that.height)
        .attr('stroke-opacity', 0);
      
      g.append("line")
        .attr("class", 'handle r-handle')
        .attr("y1", 0)
        .style("stroke-width", this.handleWidth)
        .attr("y2", that.height)
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
      el = el || this.g.selectAll('.block');

      var ly = this;
      var g = this.g;
      var halfHandle = this.handleWidth * 0.5;

      // offset handles
      var lx = function(d){return ly.xScale(parseFloat(d.get('begin'))) + halfHandle;};
      var rx = function(d){return ly.xScale(parseFloat(d.get('begin'))) + ly.xScale(parseFloat(d.get('duration'))) - halfHandle;};

      var x = function(d){return ly.xScale(parseFloat(d.get('begin')));};
      var w = function(d){return ly.xScale(parseFloat(d.get('duration')));};
      var y = function(d){return ly.xScale(parseFloat(d.get('begin'))) + ly.xScale(parseFloat(d.get('duration')));};
      var color = function(d, i){return d.get('color');};

      el.attr("x", x);
      el.attr("y", y);

      el.selectAll('.l-handle')
        .attr("x1", lx)
        .attr("x2", lx)
        .attr("fill", color)
        .style("stroke", color);

      el.selectAll('.r-handle')
        .attr("x1", rx)
        .attr("x2", rx)
        .attr("fill", color)
        .style("stroke", color);

      el.selectAll('.seg')
        .attr('fill', color)
        .attr('width', w)
        .attr('x', x);

      if(this.selectable) this.bindEvents();

    }
  },

  bindEvents: {
    value: function() {
      this.g.selectAll('.block')
        .classed('selectable', true);
    }
  },

  unbindEvents: {
    value: function() {
      this.g.selectAll('.block')
        .classed('selectable', false);
    }
  }

};

// exported factory
// ----------------
// exports initiated object with the passed in options
// the filter module allows only the specified keys to
// pass through

module.exports = function createBaseTimeline(options){
  var segmenter = Object.create({}, segDesc);
  return segmenter.init(filter(options, allowedOptions));
};