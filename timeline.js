var d3        = window.d3 || require('d3');
var EventEmitter = require('events').EventEmitter;
var shortId   = require('shortid');
var accessors = require('utils').accessors;
var extend    = require('utils').extend;
var uniqueId  = require('utils').uniqueId;

'use strict';

var Timeline = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(Timeline, super$0);var proto$0={};
  function Timeline() {var options = arguments[0];if(options === void 0)options = {};
    if (!(this instanceof Timeline)) { return new Timeline(options); }

    super$0.call(this); 
    this.name(options.name || shortId.generate());
    this.cname(uniqueId(this.name()));
    // defaults
    this.margin({top: 0, right: 0, bottom: 0, left: 0});
    this.xDomain([0, 0]);
    this.yDomain([0, 1]);

    // initialize
    this.layers = {};
    this.xScale = d3.scale.linear().clamp(true);
    this.yScale = d3.scale.linear().clamp(true);

    // alias `EventEmitter.emit`
    this.trigger = this.emit;
    // keep track of scales initialization
    this.__scalesInitialized = false;
    // bind draw method for call from d3
    this.draw = this.draw.bind(this);
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
    if (this.__scalesInitialized === false) { 
      this.initScales(); 
    }

    this.initLayer(layer); // compute `cname`, ...
    this.delegateScales(layer);
    // add the layer to the stack
    this.layers[layer.param('cname')] = layer;

    // allow to dynamically add a layer after after the timeline has been drawn
    if (!!this.boundingBox) {
      this.enterLayer(layer, this.boundingBox);
    }

    return this;
  };

  // alias for layer - symetry with remove
  proto$0.add = function(layer) {
    this.layer(layer);
  };

  // remove a layer
  proto$0.remove = function(layer) {
    if (layer.param('isEditable') && layer.undelegateEvents) {
      layer.undelegateEvents();
    }

    layer.g.remove();
    this.layers[layer.param('cname')] = undefined;
  };

  // initialize the layer - @NOTE remove ?
  proto$0.initLayer = function(layer) {
    layer.load(this, d3);
    // check presence of the method for object do not extend LayerVis yet
    if ('onload' in  layer) { layer.onload(); }
  };

  // initialize layer scales
  proto$0.delegateScales = function(layer) {
    // @NOTE: is the really needed ?
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
    layer.yScale = this.yScale.copy();

    if (!!layer.param('yDomain')) {
      layer.yScale.domain(layer.param('yDomain'));
    }

    if (layer.param('height') === null) {
      layer.param('height', this.height());
    }

    var yRange = [layer.param('height'), 0];
    layer.yScale.range(yRange);
  };

  // create a group for the given layer
  proto$0.enterLayer = function(layer, boundingBox) {
    // if layer already entered, do nothing
    if (layer.g) { return; }
    // create layer group
    layer.g = boundingBox.append('g')
      .classed('layer', true)
      .classed(layer.param('type'), true)
      .attr('data-cname', layer.param('cname'))
      .attr('transform', 'translate(0, ' + (layer.param('top') || 0) + ')');

    if (layer.param('nameAsIdAttribute')) {
      layer.g.attr('id', layer.param('name'));
    }
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

    this.svg.on('mousemove', function()  {
      this$0.trigger('mousemove', d3.event);
    });

    this.svg.on('mouseleave', function()  {
      this$0.trigger('mouseleave', d3.event);
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

  proto$0.draw = function(sel) {
    // draw should be called only once
    if (this.svg) { return this.update(); }

    // assume a timeline is unique and can be bound only to one element
    this.selection = sel || this.selection;
    var el = d3.select(this.selection[0][0]);
    // normalize dimensions based on the margins
    this.width(this.width() - this.margin().left - this.margin().right);
    this.height(this.height() - this.margin().top - this.margin().bottom);
      
    // 1. create svg element
    // @NOTE viewbox: do we really want this behavior ?
    // @NOTE doesn't work well with foreignobject canvas
    // cf. http://stackoverflow.com/questions/3120739/resizing-svg-in-html
    var margin = this.margin();
    var outerWidth  = this.width() + margin.left + margin.right;
    var outerHeight = this.height() + margin.top + margin.bottom;
    var viewBox = '0 0 ' + outerWidth + ' ' + outerHeight;

    this.svg = el.append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', viewBox)
      .attr('data-cname', this.cname());

    // 2. delegate events
    this.delegateEvents();

    // 3. create layout group and clip path
    var clipPathId = 'bouding-box-clip-' + this.cname();

    this.svg
      .append('defs')
      .append('clipPath')
      .attr('id', clipPathId)
      .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', outerWidth)
        .attr('height', outerHeight);

    this.boundingBox = this.svg.append('g')
      .attr('class', 'bounding-box')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .attr('clip-path', 'url(#' + clipPathId + ')');

    // 4. create layers groups
    for (var key in this.layers) {
      this.enterLayer(this.layers[key], this.boundingBox);
    }

    // 5. update view
    this.update();

    return this;
  };

  // update layers
  // @param layerIds <string|object|array> optionnal
  //      layers to update or instance(s)
  proto$0.update = function() {var SLICE$0 = Array.prototype.slice;var layers = SLICE$0.call(arguments, 0);
    var toUpdate = {};

    if (layers.length === 0) {
      toUpdate = this.layers;
    } else {
      layers.forEach(function(layer)  {
        toUpdate[layer.param('cname')] = layer;
      });
    }

    // update selected layers
    for (var key in toUpdate) { toUpdate[key].update(); }
    for (var key$0 in toUpdate) { toUpdate[key$0].draw(); }
  };

  // destroy the timeline
  proto$0.destroy = function() {
    // this.layers.forEach((layer) => this.remove(layer));
    // this.undelegateEvents();
  };

  // --------------------------------------------------
  // utils
  // --------------------------------------------------

  proto$0.toFront = function(item) {
    item.parentNode.appendChild(item);
  };
MIXIN$0(Timeline.prototype,proto$0);proto$0=void 0;return Timeline;})(EventEmitter);

// generic getters(setters) accessors and defaults
// accessors.getFunction(Timeline.prototype, [ ]);
accessors.getValue(Timeline.prototype, [
  'name', 'cname', 'xDomain', 'yDomain', 'height', 'width', 'margin', 'data'
]);


module.exports = Timeline;
