var d3        = window.d3 || require('d3');
var events    = require('events');
var shortId   = require('shortid');
var getSet    = require('utils').getSet;
var extend    = require('utils').extend;

'use strict';

var Timeline = (function(){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};
  function Timeline() {var options = arguments[0];if(options === void 0)options = {};
    if (!(this instanceof Timeline)) { return new Timeline(options); }

    // initialize
    this.layers = {};
    this.xScale = d3.scale.linear(); // .clamp(true);
    this.yScale = d3.scale.linear(); // .clamp(true);
    // event system
    var eventEmitter = new events.EventEmitter();
    this.on = eventEmitter.on;
    this.trigger = eventEmitter.emit;

    // should maybe be consistent with layer API `.name` ? one way or other
    this.id(options.id || shortId.generate());
    this.margin({top: 0, right: 0, bottom: 0, left: 0});
    this.xDomain([0, 0]);
    this.yDomain([0, 1]);
    // this.swapX = false;
    // this.swapY = false;
    // this.zoom = false;
    // for throttling
    // this.fps = 60;

    // bind draw method for call from d3
    this.draw = this.draw.bind(this);
    return this;
  }DP$0(Timeline,"prototype",{"configurable":false,"enumerable":false,"writable":false});


  // --------------------------------------------------
  // layers initialization related methods
  // --------------------------------------------------

  // register a layer
  proto$0.layer = function(layer) {
    this.initLayer(layer); // compute `cid`, ...
    this.layers[layer.param('cid')] = layer;

    return this;
  };

  // initialize the layer - @NOTE remove ?
  proto$0.initLayer = function(layer) {
    layer.load(this, d3);
    // check presence of the method for object do not extend LayerVis yet
    if ('onload' in  layer) { layer.onload() };
  };

  // initialize layer scales
  proto$0.delegateScales = function(layer) {
    // @NOTE: is the really needed ? - probably yes... see 'bachotheque'
    // if (layer.hasOwnProperty('xScale')) {
    //   var baseXscale = this.xScale.copy();
    //   // if (!!layer.param('xDomain')) { baseXscale.domain(layer.param('xDomain')); }
    //   if(!!layer.xDomain && !!layer.xDomain()) baseXscale.domain(layer.xDomain());
    //   // if (!!layer.param('xRange')) { baseXscale.domain(layer.param('xRange')); }
    //   if(!!layer.xRange && !!layer.xRange()) baseXscale.range(layer.xRange());
    //   layer.xScale = baseXscale;
    //   layer.originalXscale = baseXscale.copy();
    // }

    // define layer yScale
    var baseYscale = this.yScale.copy();

    if (!!layer.param('yDomain')) {
      baseYscale.domain(layer.param('yDomain'));
    }

    if (!!layer.param('height')) {
      var yRange = [layer.param('height'), 0];
      baseYscale.range(yRange);
    }

    layer.yScale = baseYscale;
  };

  // create a group for the given layer
  proto$0.enterLayer = function(layer, g) {
    if (layer.param('height') === null) {
      layer.param('height', this.height());
    }

    // layer group
    var prevLayerG = g.select('#' + layer.param('cid'));
    var layerG = (!!prevLayerG.node()) ? prevLayerG : g.append('g');

    // add classname to layer group and position it in the timeline
    layerG
      .classed(layer.param('type'), true)
      .attr('id', layer.param('cid'))
      .attr('transform', 'translate(0, ' + (layer.param('top') || 0) + ')');

    // keep this? we might still want this hook in the layer
    // if (layer.hasOwnProperty('bind')) layer.bind(lg);
    layer.g = layerG;
  };

  // --------------------------------------------------
  // events
  // --------------------------------------------------

  // handles and delegates to local drag behaviours
  proto$0.drag = function(callback) {var this$0 = this;
    return d3.behavior.drag().on('drag', function()  {
      this$0.selection.selectAll('.selected').each(function() {
        callback.apply(this, arguments);
      });
    });
  };

  // sets the brushing state for interaction and a css class for styles
  proto$0.brushing = function() {var state = arguments[0];if(state === void 0)state = null;
    if (state === null) { return this._brushing; }

    this._brushing = state;
    d3.select(document.body).classed('brushing', state);
  };

  proto$0.xZoom = function(zoom) {
    // in px to domain
    zoom.anchor = this.originalXscale.invert(zoom.anchor);
    // this.zoomFactor = zoom.factor;
    this.xZoomCompute(zoom, this);
    // redraw layers
    for (var key in this.layers) {
      var layer = this.layers[key];
      if ('xScale' in layer) { this.xZoomCompute(zoom, layer); }
      if ('xZoom' in layer) { layer.xZoom(zoom); }
    }
  };

  proto$0.xZoomCompute = function(zoom, layer) {
    var deltaY = zoom.delta.y;
    var deltaX = zoom.delta.x;
    var anchor = zoom.anchor;
    var factor = zoom.factor;

    // start and length (instead of end)
    var targetStart = layer.originalXscale.domain()[0];
    var currentLength = layer.originalXscale.domain()[1] - targetStart;

    // length after scaling
    var targetLength = currentLength * factor;
    // unchanged length in px
    var rangeLength = layer.originalXscale.range()[1] - layer.originalXscale.range()[0];

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
    // layer.targetStart = targetStart;
    // updating the scale
    layer.xScale.domain([targetStart, targetStart + targetLength]);
  };

  // @NOTE - used ?
  proto$0.xZoomSet = function() {
    // saves new scale reference
    this.originalXscale = this.xScale.copy();

    for (var key in this.layers) {
      var layer = this.layers[key];
      if ('xScale' in layer) { layer.originalXscale = layer.xScale.copy(); }
    }
  };

  // --------------------------------------------------
  // main interface methods
  // --------------------------------------------------

  proto$0.draw = function(sel) {var this$0 = this;
    this.selection = sel || this.selection;
    // normalize dimensions based on the margins
    this.width(this.width() - this.margin().left - this.margin().right);
    this.height(this.height() - this.margin().top - this.margin().bottom);

    this.selection.each(function(d, index)  {
      var el = d3.select(this$0.selection[index][0]);

      // 1. create svg element
      var prevSvg = el.select('svg');
      this$0.svg = (!!prevSvg.node()) ? prevSvg : el.append('svg');

      // @TODO refactor
      // keep width and height to 100% and set `viewBox` attribute - make resize easier
      // cf. http://stackoverflow.com/questions/3120739/resizing-svg-in-html
      // add a body clip and translate the layout (body of the chart)
      this$0.svg
        .attr('width', this$0.width() + this$0.margin().left + this$0.margin().right)
        .attr('height', this$0.height() + this$0.margin().top + this$0.margin().bottom);
      // create an alias (why ?)
      this$0.el = this$0.svg;

      var that = this$0;
      // 2. event delegation
      // !!! remember to unbind when deleting element !!!
      this$0.svg.on('mousedown', function() {
        that.dragInit = d3.event.target;
        that.trigger(that.id() + ':mousedown', d3.event);
      });

      this$0.svg.on('mouseup', function() {
        that.trigger(that.id() + ':mouseup', d3.event);
      });

      // for mousedrag we call a configured d3.drag behaviour returned from the objects drag method
      // this.svg.on('drag'...

      this$0.svg.call(this$0.drag(function(d) {
        // this.throttle(this.trigger(this.id() + ':drag', {target: this, event: d3.event, d:d, dragged: that.dragInit} ));
        that.trigger(
          that.id() + ':drag',
          { target: this, event: d3.event, d:d, dragged: that.dragInit }
        );
      }));

      document.body.addEventListener('mouseout', function(e)  {
        // console.log(evt.fromElement)
        if (e.fromElement === document.body){
          this$0.trigger(this$0.id() + ':mouseout', d3.event );
        }
      });

      // 3. create layout group
      var prevG = this$0.svg.select('g');
      var g = (!!prevG.node())? prevG : this$0.svg.append('g');
      var margin = this$0.margin();

      g.attr('class', 'layout')
       .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // 4. initialize scales
      var xRange = [0, this$0.width()];
      if (this$0.swapX) { xRange.reverse(); /* xRange = this.swapRange(xRange); */ }

      var yRange = [this$0.height(), 0];
      if (this$0.swapY) { yRange.reverse(); /* yRange = this.swapRange(yRange); */ }

      this$0.xScale
        .domain(this$0.xDomain())
        .range(xRange);

      this$0.yScale
        .domain(this$0.yDomain())
        .range(yRange);

      // keep a reference unmodified scale range for use in the layers when zooming
      this$0.originalXscale = this$0.xScale.copy();

      // 5. configure and initialize layers groups
      for (var key in this$0.layers) {
        var layer = this$0.layers[key];

        this$0.delegateScales(layer);
        this$0.enterLayer(layer, g);
      }

      // 6. draw the graph
      this$0.update();
    });

    return this;
  };

  // update layers
  // @param layerIds <string|array> optionnal
  //      ids of the layers to update
  proto$0.update = function() {var layerIds = arguments[0];if(layerIds === void 0)layerIds = null;
    var layers;

    if (layerIds) {
      layers = [];
      // allow string or array as argument
      if (!Array.isArray(layerIds)) { layerIds = [layerIds]; }

      for (var key in this.layers) {
        var layer = this.layers[key];

        if (layerIds.indexOf(layer.param('id')) !== -1) {
          layers.push(layer);
        }
      }
    } else {
      layers = this.layers;
    }

    // update layers
    for (var key$0 in layers) { layers[key$0].update(); }
    for (var key$1 in layers) { layers[key$1].draw(); }
  };

  // --------------------------------------------------
  // utils
  // --------------------------------------------------
  // swapRange(range) {
  //   return [range[1], range[0]]
  // }

  proto$0.toFront = function(item) {
    item.parentNode.appendChild(item);
  };
MIXIN$0(Timeline.prototype,proto$0);proto$0=void 0;return Timeline;})();

// generic getters(setters) accessors and defaults
getSet(Timeline.prototype, [
  'id', 'margin', 'xDomain', 'yDomain', 'height', 'width', 'data'
], true);

module.exports = Timeline;