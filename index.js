/* global d3 */

// TODO:
// reimplement zoom

"use strict";

var events = require('events');
var eventEmitter = new events.EventEmitter();
var shortId = require('shortid');
var getSet = require('get-set');

var _ = require('underscore');
    _.str = require('underscore.string');
    _.mixin(_.str.exports());

    // l-dash-trim helper
    _.dash = function(string){
      var dashed = _.dasherize(string);
      if(_.startsWith(dashed, '-')) dashed = dashed.substr(1);
      return dashed;
    };

// property descriptor
var baseDesc = {

  // collects the layers
  layers: { writable: true },

  // modifiable xScale
  xScale: { writable: true },

  // modifiable yScale
  yScale: { writable: true },

  // reference xScale when zooming
  // xBaseDomain: {  writable: true },

  // reference svg element
  svg: { writable: true },
  el: { enumerable: true, writable: true },

  // reference svg element
  selection: { writable: true },

  dragInit: { writable: true },

  // swapX: { enumerable: true, writable: true },
  // swapY: { enumerable: true, writable: true },

  on: { enumerable: true, writable: true },
  trigger: { writable: true },
  
  // init
  // ----

  init: {
    value: function(options) {
      options = options || {}; // fail safe
      
      var addGS = getSet(this);

      // generic getters(setters) accessors and defaults
      addGS('id');
      addGS('margin');
      addGS('xDomain');
      addGS('yDomain');
      addGS('height');
      addGS('width');
      addGS('model');

      // initialize
      this.layers = {};
      this.xScale = d3.scale.linear();
      this.yScale = d3.scale.linear();

      this.on = eventEmitter.on;
      this.trigger = eventEmitter.emit;

      this.id(options.id || shortId.generate());
      this.margin({top: 0, right: 0, bottom: 0, left: 0});
      this.xDomain([0, 100]);
      this.yDomain([0, 100]);
      // this.swapX = false;
      // this.swapY = false;
      // this.zoom = false;

      // normalize dimensions based on the margins
      this.width(this.width() - this.margin().left - this.margin().right);
      this.height(this.height() - this.margin().top - this.margin().bottom);

      return this;
    }
  },

  // inverts the order of the elements in a range array
  // swapRange: {
  //   value: function(range){
  //     var _range = [range[1], range[0]];
  //     range = _range;
  //     return _range;
  //   }
  // },

  // layer 'plugin' interface
  // adds new layers to layout
  layer: {
    enumerable: true, value: function(layer){
      this.layers[layer.name] = layer;
      return this;
    }
  },

  // draws the layers
  draw: {
    enumerable: true, value: function(sel){

      var that = this;
      this.selection = sel;
      this.initLayers();

      sel.each(function() {

        that.svg = d3.select(this).append("svg")
          .attr("width", that.width() + that.margin().left + that.margin().right)
          .attr("height", that.height() + that.margin().top + that.margin().bottom);

        that.el = that.svg;
        
        // events
        that.svg.on('mousedown', function() {
          that.dragInit = d3.event.target;
          that.trigger(that.id() + ':mousedown', d3.event );
        });
                    
        that.svg.on('mouseup', function() {
          that.trigger(that.id() + ':mouseup', d3.event );
        });
          
        that.svg.call(that.drag(function(d) {
          that.trigger(that.id() + ':drag', {target: this, event: d3.event, d:d, dragged: that.dragInit} );
        }));

        // layout group
        var g = that.svg.append("g")
          .attr("class", 'layout')
          .attr("transform", "translate(" + that.margin().left + "," + that.margin().top + ")");

        // Updates scales
        // --------------

        var xRange = [0, that.width()];
        if(that.swapX) xRange = that.swapRange(xRange);

        var yRange = [that.height(), 0];
        if(that.swapY) yRange = that.swapRange(yRange);

        that.xScale
            .domain(that.xDomain())
            .range(xRange);

        that.yScale
            .domain(that.yDomain())
            .range(yRange);

        // if(that.zoom){
        //   var zoom = d3.behavior.zoom()
        //     .x(that.xScale)
        //     // .center([0,0])
        //     .on("zoom", function(){
        //       that.xZoom(d3.event);
        //     });

        //   that.svg.call(zoom);
        // }

        // keep a reference unmodified scale range for use in the layers when zooming
        that.xBaseDomain = that.xDomain();

        // enter layers
        that.enterLayers(g);
      });
      
      return this;
    }
  },

  // handles and delegates to local drag behaviours
  drag: {
    enumerable: true, value: function(cb) {
      var that = this;
      var delta; // null unless we pass through drag
      
      // global drag behaviours
      return d3.behavior.drag()
        .on("drag", function(){

          // var parentDragged = that.dragInit.parentNode;

          // still used?
          // get the delta values
          // delta = {
          //   x: parseInt(d3.event.dx, 10),
          //   y: parseInt(d3.event.dy, 10)
          // };
          
          // executes local drag for each selected element
          that.selection.selectAll('.selected')
            .each(function(d) {
              cb.call(this, d);
            });
          });

        // .on("dragend", function(d, i){
        //   that.dragInit = undefined;
        // });
    }
  },

  // xZoom: {
  //   enumerable: true, value: function(val) {
  //     // val = parseInt(val, 10);

  //     // no defualt zoom so we do our own
  //     if(!this.zoom){
  //       // update the xscale domain based on the
  //       // original xscale and the zoom value
  //       var dm = this.xBaseDomain;
  //       var nDomain = [dm[0] / val, dm[1] / val];
  //       this.xDomain(nDomain);
  //       this.xScale.domain(this.xDomain());
  //     }

  //     _.each(this.layers, function(layer){
  //       // update the layer attrs
  //       if(layer.hasOwnProperty('xZoom')) layer.xZoom(val);
  //     });

  //   }
  // },

  // initialize layers
  initLayers: {
    value: function(){
        
      var that = this;
      var layers = this.layers;

      _.each(layers, function(layer){
        layer.load(that);
        layer.dname = _.dash(layer.name); // dashed name
        layer.xScale = that.xScale;
        layer.yScale = d3.scale.linear();
        if(that.model() && layer.hasOwnProperty('model')) layer.model(that.model());
      });

    }
  },

  // internal scale update
  delegateScales: {
    value: function(layer){
      // layer.xScale = this.xScale;
      // layer.yScale = this.yScale;
      layer.xBaseDomain = this.xBaseDomain;
    }
  },

  // call layer enter method
  enterLayers: {
    value: function(g){
        
      var that = this;
      var layers = this.layers;
      
      // setup external layers containers and dimensions
      _.each(layers, function(layer){
        // rebind Scales in case they changed
        that.delegateScales(layer);

        // margin/position handling
        if(!layer.height) layer.height = that.height();
        
        var top = layer.top || 0;
        var height = layer.height;
        var width = that.width();

        // layer group
        // var klen = Object.keys(that.layers).length;
        // var lg = (klen > 1) ? g.append("g") // if there are more than one layer we append a layer group
        //                     : g; // otherwise we work only with the inner group
        
        var lg = g.append("g");
        // apply all the dimensions to our group
        lg.classed(layer.dname, true)
          .attr('height', height)
          .attr("transform", "translate(0, " + top + ")");
        if(layer.hasOwnProperty('bind')) layer.bind(lg);
      });

    }
  }

};


// exported factory
// ----------------
module.exports = function createBaseTimeline(options){
  var timeLine = Object.create({}, baseDesc);
  return timeLine.init(options); // return initiated object
};