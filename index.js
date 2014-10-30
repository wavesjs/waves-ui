/* global d3 */

// TODO:
// reimplement zoom

"use strict";

var events = window.events || require('events');
var shortId = require('shortid');
var getSet = require('utils').getSet;
var extend = require('utils').extend;

var timeLine;

// property descriptor
var baseDesc = {

  // collects the layers
  layers: { writable: true },

  // modifiable xScale
  xScale: { writable: true },

  // modifiable yScale
  yScale: { writable: true },

  // reference xScale when zooming

  // reference svg element
  svg: { writable: true },
  el: { enumerable: true, writable: true },

  // reference svg element
  selection: { writable: true },

  dragInit: { writable: true },

  _brushing: { writable: true },

  // swapX: { enumerable: true, writable: true },
  // swapY: { enumerable: true, writable: true },

  on: { enumerable: true, writable: true },
  trigger: { writable: true },

  // init
  // ----

  init: {
    value: function(options) {
      options = options || {}; // fail safe

      // generic getters(setters) accessors and defaults
      getSet(this, [
        'id', 'margin', 'xDomain', 'yDomain', 'height', 'width', 'data'
      ], true);

      // initialize
      this.layers = {};
      this.xScale = d3.scale.linear().clamp(true);
      this.yScale = d3.scale.linear().clamp(true);

      var eventEmitter = new events.EventEmitter();
      this.on = eventEmitter.on;
      this.trigger = eventEmitter.emit;

      this.id(options.id || shortId.generate());
      this.margin({top: 0, right: 0, bottom: 0, left: 0});
      this.xDomain([0, 0]);
      this.yDomain([0, 1]);
      // this.swapX = false;
      // this.swapY = false;
      // this.zoom = false;

      // for throttling
      this.fps = 60;

      return this;
    }
  },

  params: {
    enumerable: true, value: function(params) {
      this._params = extend(this._params, params);
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
    enumerable: true, value: function(layer) {
      this.layers[layer.name()] = layer;
      return this;
    }
  },

  // draws the layers
  draw: {
    enumerable: true, value: function(sel) {
      var that = timeLine; // binding fix when called from d3
      sel = sel || that.selection;
      that.selection = sel;

      // normalize dimensions based on the margins
      that.width(that.width() - that.margin().left - that.margin().right);
      that.height(that.height() - that.margin().top - that.margin().bottom);

      that.initLayers();
      // console.log(that.width())

      sel.each(function() {
        var prevSvg = d3.select(this).select('svg');
        that.svg = (!!prevSvg.node())?
            prevSvg
          : d3.select(this).append("svg");

        that.svg
          .attr("width", that.width() + that.margin().left + that.margin().right)
          .attr("height", that.height() + that.margin().top + that.margin().bottom);

        that.el = that.svg;

        // events

        // !!! remember to unbind when deleting element !!!
        that.svg.on('mousedown', function() {
          that.dragInit = d3.event.target;
          that.trigger(that.id() + ':mousedown', d3.event );
        });

        that.svg.on('mouseup', function() {
          that.trigger(that.id() + ':mouseup', d3.event );
        });

        // for mousedrag we call a configured d3.drag behaviour returned from the objects drag method
        // that.svg.on('drag'...

        that.svg.call(that.drag(function(d) {
          // that.throttle(that.trigger(that.id() + ':drag', {target: this, event: d3.event, d:d, dragged: that.dragInit} ));
          that.trigger(that.id() + ':drag', {target: this, event: d3.event, d:d, dragged: that.dragInit} );
        }));

        document.body.addEventListener('mouseout', function(evt) {
          // console.log(evt.fromElement)
          if(evt.fromElement === document.body){
            that.trigger(that.id() + ':mouseout', d3.event );
          }
        });

        // layout group
        var prevg = that.svg.select('g');
        var g = (!!prevg.node())?
            prevg
          : that.svg.append("g");

          g.attr("class", 'layout')
          .attr("transform", "translate(" + that.margin().left + "," + that.margin().top + ")");

        // Updates scales
        // --------------

        var xRange = [0, that.width()];
        if(that.swapX) xRange = that.swapRange(xRange);

        var yRange = [that.height(), 0];
        if(that.swapY) yRange = that.swapRange(yRange); // y is always expected to be upside down

        that.xScale
            .domain(that.xDomain())
            .range(xRange);

        that.yScale
            .domain(that.yDomain())
            .range(yRange);

        // keep a reference unmodified scale range for use in the layers when zooming
        that.originalXscale = that.xScale.copy();

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

    }
  },

  // sets the brushing state for interaction and a css class for styles
  brushing: {
    enumerable: true, value: function(state) {
      if(!arguments.length) return this._brushing;
      this._brushing = state;
      d3.select(document.body).classed('brushing', state);
    }
  },

  // only call on requestAnimationFrame ticks
  // throttle: {
  //   enumerable: true, value: function(func) {
  //     var wait, args, context, now, delta;
  //     var then = Date.now();
  //     var interval = 1000/this.fps;

  //     console.log(this.fps);

  //     return function () {
  //       if (wait) return;
  //       wait = true;
  //       args = arguments;
  //       context = this;

  //       window.requestAnimationFrame(function () {
  //         wait = false;

  //         now = Date.now();
  //         delta = now - then;

  //         if (delta > interval) {
  //             func.apply(context, args);
  //             then = now - (delta % interval);
  //         }
  //       });
  //     };
  //   }
  // },

  xZoom: {
    enumerable: true, value: function(zoom) {

      var that = this;
      var layers = this.layers;

      zoom.anchor = this.originalXscale.invert(zoom.anchor); // in px to domain

      // this.zoomFactor = zoom.factor;
      this.xZoomCompute(zoom, this);

      // redraw layers
      for(var key in layers) {
        var layer = layers[key];
        if(layer.hasOwnProperty('xScale')) that.xZoomCompute(zoom, layer);
        if(layer.hasOwnProperty('xZoom')) layer.xZoom(zoom);
        // if(layer.xZoom) that.throttle(layer.xZoom());
      }

    }
  },

  // thanks Charles Picasso <charles.picasso@ircam.fr> !!
  xZoomCompute: {
    enumerable: true, value: function(zoom, ly) {
      var deltaY = zoom.delta.y;
      var deltaX = zoom.delta.x;
      var anchor = zoom.anchor;
      var factor = zoom.factor;

      // start and length (instead of end)
      var targetStart = ly.originalXscale.domain()[0];
      var currentLength = ly.originalXscale.domain()[1] - targetStart;

      // length after scaling
      var targetLength = currentLength * factor;
      // unchanged length in px
      var rangeLength = ly.originalXscale.range()[1] - ly.originalXscale.range()[0];

      // zoom
      if (deltaY){
        var offsetOrig = ( (anchor - targetStart) / currentLength ) * rangeLength;
        var offsetFina = ( (anchor - targetStart) / targetLength ) * rangeLength;
        targetStart += ( (offsetFina - offsetOrig) / rangeLength ) * targetLength;
      }

      // translate x
      if (deltaX){
        var translation = (deltaX / rangeLength) * targetLength;
        targetStart += translation;
      }

      // ly.targetStart = targetStart;
      // updating the scale
      ly.xScale.domain([targetStart, targetStart + targetLength]);

    }
  },

  xZoomSet: {
    enumerable: true, value: function() {
      var layers = this.layers;
      // saves new scale reference

      this.originalXscale = this.xScale.copy();

      for(var key in layers) {
        var layer = layers[key];
         if (layer.hasOwnProperty('xScale')) layer.originalXscale = layer.xScale.copy();
      }

    }
  },

  update: {
    enumerable: true, value: function(){
      var layers = this.layers;

      for (var key in layers) {
        var layer = layers[key];
        layer.update();
      }
    }
  },

  // initialize layers
  initLayers: {
    value: function() {
      var layers = this.layers;

      for (var key in layers) {
        var layer = layers[key];
        // configure layer
        layer.load(this, d3);
      }
    }
  },

  drawLayers: {
    value: function(name){
      name = name || '';
      var layers = this.layers;

      // update all layers excepthe one passed
      // rethink this later
      for (var key in layers) {
        var layer = layers[key];
        if (layer.draw && layer.name() !== name) layer.draw();
      }

    }
  },

  // internal scale update
  delegateScales: {
    value: function(layer) {
      // @NOTE: is the really needed ? - probably yes... see "bachotheque"
      if (layer.hasOwnProperty('xScale')) {
        var baseXscale = this.xScale.copy();

        // if (!!layer.param('xDomain')) { baseXscale.domain(layer.param('xDomain')); }
        if(!!layer.xDomain && !!layer.xDomain()) baseXscale.domain(layer.xDomain());
        // if (!!layer.param('xRange')) { baseXscale.domain(layer.param('xRange')); }
        if(!!layer.xRange && !!layer.xRange()) baseXscale.range(layer.xRange());
        layer.xScale = baseXscale;
        layer.originalXscale = baseXscale.copy();
      }

      if ('yScale' in layer) {
        var baseYscale = this.yScale.copy();

        if (!!layer.param('yDomain')) {
          baseYscale.domain(layer.param('yDomain'));
        }

        if (!!layer.param('height')) {
          var yRange = [layer.param('height'), 0];
          baseYscale.range(yRange);
        }

        layer.yScale = baseYscale;
      }
    }
  },

  // call layer enter method
  enterLayers: {
    value: function(g) {

      var that = this;
      var layers = this.layers;

      // setup external layers containers and dimensions
      for(var key in layers) {
        var layer = layers[key];
        // rebind Scales in case they updated
        that.delegateScales(layer);

        // margin/position handling
        var top = layer.param('top') || 0;
        if(layer.param('height') === null) layer.param('height', that.height());

        var height = layer.param('height');
        var width = that.width();

        // layer group
        // var klen = Object.keys(that.layers).length;
        // var lg = (klen > 1) ? g.append("g") // if there are more than one layer we append a layer group
        //                     : g; // otherwise we work only with the inner group

        // var lg = g.append("g");
        var prevLg = g.select('.' + layer.dname);
        var lg = (!!prevLg.node())?
          prevLg
          : g.append("g");

        // apply all the dimensions to our group
        lg.classed(layer.dname, true)
          .attr("transform", "translate(0, " + top + ")");

        // keep this?
        // we might still want this hook in the layer
        // if(layer.hasOwnProperty('bind')) layer.bind(lg);

        layer.g = lg;
        layer.update();

      }

    }
  },

  swapRange: {
    value: function(range) {
      return [range[1], range[0]];
    }
  },

  // moves selected item to front
  toFront: {
    value: function(item) {
      item.parentNode.appendChild(item);
    }
  }

};


// exported factory
// ----------------
module.exports = function timeline(options){
  timeLine = Object.create({}, baseDesc);
  return timeLine.init(options); // return initiated object
};
