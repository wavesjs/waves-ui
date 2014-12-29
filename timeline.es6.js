var d3        = window.d3 || require('d3');
var EventEmitter = require('events').EventEmitter;
var shortId   = require('shortid');
var accessors = require('utils').accessors;
var uniqueId  = require('utils').uniqueId;
var UILoop    = require('utils').UILoop;

'use strict';

class Timeline extends EventEmitter {
  constructor(options = {}) {
    if (!(this instanceof Timeline)) { return new Timeline(options); }

    super(); 
    this.name(options.name || shortId.generate());
    this.cname(uniqueId(this.name()));
    // defaults
    this.margin({ top: 0, right: 0, bottom: 0, left: 0 });
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
    // @TODO define if it should be a getter
    this.fps = 60;
    this.uiLoop = new UILoop(this.fps);
    // bind draw method for call from d3
    this.draw = this.draw.bind(this);
  }

  // initialize the scales of the timeline
  // is called the first time a layer is added
  initScales() {
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
  }

  // --------------------------------------------------
  // layers initialization related methods
  // --------------------------------------------------

  // register a layer
  layer(layer) {
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
  }

  // alias for layer - symetry with remove
  add(layer) {
    this.layer(layer);
    
    return this;
  }

  // remove a layer
  remove(layer) {
    if (layer.param('isEditable') && layer.undelegateEvents) {
      layer.undelegateEvents();
    }

    layer.g.remove();
    delete this.layers[layer.param('cname')];

    return this;
  }

  // initialize the layer - @NOTE remove ?
  initLayer(layer) {
    layer.load(this, d3);
    // check presence of the method for object do not extend LayerVis yet
    if ('onload' in  layer) { layer.onload(); }
  }

  // initialize layer scales
  delegateScales(layer) {
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
  }

  // create a group for the given layer
  enterLayer(layer, boundingBox) {
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
  }

  // --------------------------------------------------
  // events
  // --------------------------------------------------

  delegateEvents() {
    // !!! remember to unbind when deleting element !!!
    var body = document.body;
    var target;
    // is actually not listened in make editable
    this.svg.on('mousedown', () => {
      target = d3.event.target;
      this.trigger('mousedown', d3.event);
    });

    this.svg.on('mouseup', () => {
      this.trigger('mouseup', d3.event);
    });

    this.svg.on('mousemove', () => {
      this.trigger('mousemove', d3.event);
    });

    // choose which one we really want
    this.svg.on('mouseleave', () => {
      // this.xZoomSet(); // was in makeEditable - check if really needed
      this.trigger('mouseleave', d3.event);
    });

    body.addEventListener('mouseleave', (e) => {
      if (e.fromElement !== body) { return; }
      this.trigger('mouseleave', e);
    });

    var that = this;
    // @NOTE: how removeListeners for drag behavior
    var dragBehavior = d3.behavior.drag();
    // dragBehavior.on('dragstart', function() {
    //   console.log(d3.event);
    // });

    dragBehavior.on('drag', () => {
      // we drag only selected items
      // @NOTE shouldn't rely on `selected` class here
      this.selection.selectAll('.selected').each(function(datum) {
        var e = {
          // group - allow to redraw only the current dragged item
          currentTarget: this,
          // element (which part of the element is actually dragged,
          // ex. line or rect in a segment)
          target: target,
          d: datum,
          originalEvent: d3.event
        }

        that.trigger('drag', e);
      });
    });

    this.svg.call(dragBehavior);

    // var brush = d3.svg.brush()
    //   .x(this.xScale)
    //   .y(this.yScale);
    
    // brush.on('brushstart', function() {
    //   console.log('brushstart', d3.event);
    // });

    // brush.on('brush', function() {
    //   console.log('brush', d3.event);
    // });

    // brush.on('brushend', function() {
    //   console.log('brushend', d3.event);
    // });

    // this.boundingBox.call(brush);
  }

  // should clean event delegation, in conjonction with a `remove` method
  undelegateEvents() {
    // 
  }

  // sets the brushing state for interaction and a css class for styles
  // @TODO define how the brush should work
  brushing(state = null) {
    if (state === null) { return this._brushing; }

    this._brushing = state;
    d3.select(document.body).classed('brushing', state);
  }

  xZoom(zoom) {
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
  }

  xZoomCompute(zoom, layer) {
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
  }

  // @NOTE - used ? - is called from make editable
  xZoomSet() {
    // saves new scale reference
    this.originalXscale = this.xScale.copy();

    for (var key in this.layers) {
      var layer = this.layers[key];
      if ('xScale' in layer) { layer.originalXscale = layer.xScale.copy(); }
    }
  }

  // --------------------------------------------------
  // main interface methods
  // --------------------------------------------------

  draw(sel) {
    // draw should be called only once
    if (this.svg) { return this.update(); }

    // assume a timeline is unique and can be bound only to one element
    this.selection = sel || this.selection;
    let el = d3.select(this.selection[0][0]);
    // normalize dimensions based on the margins
    this.width(this.width() - this.margin().left - this.margin().right);
    this.height(this.height() - this.margin().top - this.margin().bottom);
      
    // 1. create svg element
    // @NOTE viewbox: do we really want this behavior ?
    //       doesn't work well with foreignobject canvas
    // cf. http://stackoverflow.com/questions/3120739/resizing-svg-in-html
    var margin = this.margin();
    var outerWidth  = this.width() + margin.left + margin.right;
    var outerHeight = this.height() + margin.top + margin.bottom;
    var viewBox = '0 0 ' + outerWidth + ' ' + outerHeight;

    this.svg = el.append('svg')
      .attr('width', outerWidth)
      .attr('height', outerHeight)
      // .attr('width', '100%')
      // .attr('height', '100%')
      // .attr('viewBox', viewBox)
      .attr('data-cname', this.cname());

    // 2. create layout group and clip path
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


    // 3. delegate events
    this.delegateEvents();

    // 4. create layers groups
    for (var key in this.layers) {
      this.enterLayer(this.layers[key], this.boundingBox);
    }

    // 5. update view
    this.update();

    return this;
  }

  // update layers
  // @param layerIds <string|object|array> optionnal
  //      layers to update or instance(s)
  update(...layers) {
    var toUpdate = {};

    if (layers.length === 0) {
      toUpdate = this.layers;
    } else {
      layers.forEach((layer) => {
        toUpdate[layer.param('cname')] = layer;
      });
    }

    // update selected layers
    for (let key in toUpdate) { toUpdate[key].update(); }
    for (let key in toUpdate) { toUpdate[key].draw(); }
    // start rAF
    this.uiLoop.start();
  }

  // destroy the timeline
  destroy() {
    // this.layers.forEach((layer) => this.remove(layer));
    // this.undelegateEvents();
    // this.svg.remove();
  }
}

// generic getters(setters) accessors and defaults
// accessors.getFunction(Timeline.prototype, [ ]);
accessors.getValue(Timeline.prototype, [
  'name', 'cname', 'xDomain', 'yDomain', 'height', 'width', 'margin', 'data'
]);


module.exports = Timeline;
