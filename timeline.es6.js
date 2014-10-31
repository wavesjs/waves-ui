var d3        = require('d3');
var events    = require('events');
var shortId   = require('shortid');
var getSet    = require('utils').getSet;
var extend    = require('utils').extend;

'use strict';

class Timeline {
  constructor(options = {}) {
    if (!(this instanceof Timeline)) { return new Timeline(options); }

    console.log('%c-------------------------------', 'color:red');
    console.log('%ces6 timeline', 'color:red');
    console.log('%c-------------------------------', 'color:red');
    // initialize
    this.layers = {};
    this.xScale = d3.scale.linear().clamp(true);
    this.yScale = d3.scale.linear().clamp(true);
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
  }


  // --------------------------------------------------
  // layers initialization related methods
  // --------------------------------------------------

  // register a layer
  layer(layer) {
    this.initLayer(layer); // compute `cid`, ...
    this.layers[layer.param('cid')] = layer;

    return this;
  }

  // initialize the layer - @NOTE remove ?
  initLayer(layer) {
    layer.load(this, d3);
  }

  // initialize layer scales
  delegateScales(layer) {
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
  }

  // create a group for the given layer
  enterLayer(layer, g) {
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
  }

  // --------------------------------------------------
  // events
  // --------------------------------------------------

  // handles and delegates to local drag behaviours
  drag(callback) {
    return d3.behavior.drag().on('drag', () => {
      this.selection.selectAll('.selected').each(function() {
        callback.apply(this, arguments);
      });
    });
  }

  // sets the brushing state for interaction and a css class for styles
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
  }

  // @NOTE - used ?
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
    this.selection = sel || this.selection;
    // normalize dimensions based on the margins
    this.width(this.width() - this.margin().left - this.margin().right);
    this.height(this.height() - this.margin().top - this.margin().bottom);

    this.selection.each((d, index) => {
      let el = d3.select(this.selection[index][0]);

      // 1. create svg element
      var prevSvg = el.select('svg');
      this.svg = (!!prevSvg.node()) ? prevSvg : el.append('svg');

      this.svg
        .attr('width', this.width() + this.margin().left + this.margin().right)
        .attr('height', this.height() + this.margin().top + this.margin().bottom);
      // create an alias (why ?)
      this.el = this.svg;

      var that = this;
      // 2. event delegation
      // !!! remember to unbind when deleting element !!!
      this.svg.on('mousedown', function() {
        that.dragInit = d3.event.target;
        that.trigger(that.id() + ':mousedown', d3.event);
      });

      this.svg.on('mouseup', function() {
        that.trigger(that.id() + ':mouseup', d3.event);
      });

      // for mousedrag we call a configured d3.drag behaviour returned from the objects drag method
      // this.svg.on('drag'...

      this.svg.call(this.drag(function(d) {
        // this.throttle(this.trigger(this.id() + ':drag', {target: this, event: d3.event, d:d, dragged: that.dragInit} ));
        that.trigger(
          that.id() + ':drag',
          { target: this, event: d3.event, d:d, dragged: that.dragInit }
        );
      }));

      document.body.addEventListener('mouseout', (e) => {
        // console.log(evt.fromElement)
        if (e.fromElement === document.body){
          this.trigger(this.id() + ':mouseout', d3.event );
        }
      });

      // 3. create layout group
      var prevG = this.svg.select('g');
      var g = (!!prevG.node())? prevG : this.svg.append('g');
      var margin = this.margin();

      g.attr('class', 'layout')
       .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // 4. initialize scales
      var xRange = [0, this.width()];
      if (this.swapX) { xRange.reverse(); /* xRange = this.swapRange(xRange); */ }

      var yRange = [this.height(), 0];
      if (this.swapY) { yRange.reverse(); /* yRange = this.swapRange(yRange); */ }

      this.xScale
        .domain(this.xDomain())
        .range(xRange);

      this.yScale
        .domain(this.yDomain())
        .range(yRange);

      // keep a reference unmodified scale range for use in the layers when zooming
      this.originalXscale = this.xScale.copy();

      // 5. configure and initialize layers groups
      for (var key in this.layers) {
        var layer = this.layers[key];

        this.delegateScales(layer);
        this.enterLayer(layer, g);
      }

      // 6. draw the graph
      this.update();
    });

    return this;
  }

  update() {
    var layers = this.layers;
    // update layers
    for (var key in layers) { layers[key].update(); }

    var draw = () => {
      for (var key in layers) { layers[key].draw(); }
    };
    // draw in rAF
    requestAnimationFrame(draw);
  }

  // --------------------------------------------------
  // utils
  // --------------------------------------------------
  // swapRange(range) {
  //   return [range[1], range[0]]
  // }

  toFront(item) {
    item.parentNode.appendChild(item);
  }
}

// generic getters(setters) accessors and defaults
getSet(Timeline.prototype, [
  'id', 'margin', 'xDomain', 'yDomain', 'height', 'width', 'data'
], true);

module.exports = Timeline;