var d3        = window.d3 || require('d3');
var EventEmitter = require('events').EventEmitter;
var shortId   = require('shortid');
var getSet    = require('utils').getSet;
var extend    = require('utils').extend;

'use strict';

var Timeline = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(Timeline, super$0);var proto$0={};
  function Timeline() {var options = arguments[0];if(options === void 0)options = {};
    if (!(this instanceof Timeline)) { return new Timeline(options); }

    // initialize
    this.layers = {};
    this.xScale = d3.scale.linear(); // .clamp(true);
    this.yScale = d3.scale.linear(); // .clamp(true);

    this.id(options.id || shortId.generate());
    this.margin({top: 0, right: 0, bottom: 0, left: 0});
    this.xDomain([0, 0]);
    this.yDomain([0, 1]);
    // this.swapX = false;
    // this.swapY = false;
    // this.zoom = false;
    // for throttling
    // this.fps = 60;

    // alias `EventEmitter.emit`
    this.trigger = this.emit;
    // keep track of scales initialization
    this.__scalesInitialized = false;
    // bind draw method for call from d3
    this.draw = this.draw.bind(this);
    
    return this;
  }if(super$0!==null)SP$0(Timeline,super$0);Timeline.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":Timeline,"configurable":true,"writable":true}});DP$0(Timeline,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  // initialize the scales of the timeline
  // is called the first time a layer is added
  proto$0.initScales = function() {
    var xRange = [0, this.width()];
    if (this.swapX) { xRange.reverse(); }

    var yRange = [this.height(), 0];
    if (this.swapY) { yRange.reverse(); }

    this.xScale
      .domain(this.xDomain())
      .range(xRange);

    this.yScale
      .domain(this.yDomain())
      .range(yRange);

    // keep a reference unmodified scale range for use in the layers when zooming
    this.originalXscale = this.xScale.copy();
    this.__scalesInitialized = true;
  };

  // --------------------------------------------------
  // layers initialization related methods
  // --------------------------------------------------

  // register a layer
  proto$0.layer = function(layer) {
    if (this.__scalesInitialized === false) { this.initScales(); }

    this.initLayer(layer); // compute `cid`, ...
    this.delegateScales(layer);
    // add the layer to the stack
    this.layers[layer.param('cid')] = layer;

    // allow to dynamically add a layer after after the timeline has been drawn
    // @NOTE: create a test case - needs to be tested
    if (!!this.layout) {
      this.enterLayer(layer, this.layout);
    }

    return this;
  };

  // initialize the layer - @NOTE remove ?
  proto$0.initLayer = function(layer) {
    layer.load(this, d3);
    // check presence of the method for object do not extend LayerVis yet
    if ('onload' in  layer) { layer.onload(); }
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

  proto$0.delegateEvents = function() {var this$0 = this;
    // !!! remember to unbind when deleting element !!!
    var body = document.body;

    // is actually not listened in make editable
    this.svg.on('mousedown', function()  {
      this$0.dragInit = d3.event.target;
      this$0.trigger('mousedown', d3.event);
    });

    this.svg.on('mouseup', function()  {
      this$0.trigger('mouseup', d3.event);
    });

    // for mousedrag we call a configured d3.drag behaviour
    // returned from the objects drag method: `this.svg.on('drag'...`
    var that = this;

    // @NOTE: how to remove the two following listeners ?
    this.svg.call(this.drag(function(datum) {
      var e = {
        // group - allow to redraw only the given group
        target: this,
        // element (which part of the element is actually dragged, 
        // ex. line or rect in a segment)
        dragged: that.dragInit,
        d: datum,
        event: d3.event
      }

      that.trigger('drag', e);
    }));

    body.addEventListener('mouseleave', function(e)  {
      if (e.fromElement !== body) { return; }
      this$0.trigger('mouseleave', e);
    });
  };

  // should clean event delegation, in conjonction with a `remove` method
  proto$0.undelegateEvents = function() {
    // 
  };

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
    if (deltaY) {
      var offsetOrigin = ( (anchor - targetStart) / currentLength ) * rangeLength;
      var offsetFinal = ( (anchor - targetStart) / targetLength ) * rangeLength;
      targetStart += ( (offsetFinal - offsetOrigin) / rangeLength ) * targetLength;
    }

    // translate x
    if (deltaX) {
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

      // 2. event delegation
      this$0.delegateEvents();

      // 3. create layout group and clip path
      this$0.svg
        .append('defs')
        .append('clip-path')
        .attr('id', 'layout-clip')
        .append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', this$0.width() + this$0.margin().left + this$0.margin().right)
          .attr('height', this$0.height() + this$0.margin().top + this$0.margin().bottom);

      var prevG = this$0.svg.select('g');
      var g = (!!prevG.node())? prevG : this$0.svg.append('g');
      var margin = this$0.margin();

      g.attr('class', 'layout')
       .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
       .attr('clip-path', 'url(#layout-clip)');

      this$0.layout = g;

      // 4. create layers groups
      for (var key in this$0.layers) {
        this$0.enterLayer(this$0.layers[key], g);
      }

      // 5. draw the graph
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

  // @TODO implement
  proto$0.remove = function() {
    // this.undelegateEvents()
  };

  // --------------------------------------------------
  // utils
  // --------------------------------------------------

  proto$0.toFront = function(item) {
    item.parentNode.appendChild(item);
  };
MIXIN$0(Timeline.prototype,proto$0);proto$0=void 0;return Timeline;})(EventEmitter);

// generic getters(setters) accessors and defaults
getSet(Timeline.prototype, [
  'id', 'margin', 'xDomain', 'yDomain', 'height', 'width', 'data'
], true);

module.exports = Timeline;