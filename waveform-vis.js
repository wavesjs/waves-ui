var getSet   = require('utils').getSet;
var uniqueId = require('utils').uniqueId;
var LayerVis = require('layer-vis');
var pck      = require('./package.json');
var fs       = require('fs');
var renderingStrategies = require('./lib/rendering-strategies');
var minMax   = require('./lib/min-max');

'use strict';

var workerBlob = new Blob(
  [fs.readFileSync(__dirname + '/lib/resampler-worker.js', 'utf-8')],
  { type: 'text/javascript' }
);

var WaveformVis = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(WaveformVis, super$0);var proto$0={};
  function WaveformVis() {
    if (!(this instanceof WaveformVis)) { return new WaveformVis; }

    super$0.call(this);

    var name = pck.name.replace('-vis', '');

    var defaults = {
      type: name,
      id: uniqueId(name),
      renderingStrategy: 'svg',
      yDomain: [-1, 1], // default yDomain for audioBuffer
      triggerUpdateZoomDelta: 0.01,
      triggerUpdateDragDelta: 4,
      useWorker: false
    };

    this.params(defaults);
    this.color('#000000');
    this.sampleRate(44100);
    // init zoom factor to 1
    this.currentZoomFactor = 1;
    this.currentDragDeltaX = 0;
  }if(super$0!==null)SP$0(WaveformVis,super$0);WaveformVis.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":WaveformVis,"configurable":true,"writable":true}});DP$0(WaveformVis,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  // get number of sample per timeline pixels - aka. windowSize
  proto$0.getSamplesPerPixel = function() {
    var timelineDomain = this.base.xScale.domain();
    var timelineDuration = timelineDomain[1] - timelineDomain[0];
    var timelineWidth = this.base.width();
    var sampleRate = this.sampleRate();

    return (timelineDuration * sampleRate()) / timelineWidth;
  };

  proto$0.onload = function() {
    // bind rendering strategy
    var strategy = renderingStrategies[this.param('renderingStrategy')];
    this._update = strategy.update.bind(this);
    this._draw   = strategy.draw.bind(this);

    // create partial xxScale
    this.xxScale = this.d3.scale.linear()
      .range([0, this.duration()()]);

    // init worker
    if (this.param('useWorker')) { this.initWorker(); }
  };

  proto$0.initWorker = function() {
    this.resampler = new Worker(window.URL.createObjectURL(workerBlob));
    var onResponse = this.resamplerResponse.bind(this);
    this.resampler.addEventListener('message', onResponse, false);

    var message = {
      cmd: 'initialize',
      buffer: this.data(),
      minMax: minMax.toString()
    };

    this.resampler.postMessage(message, [message.buffer]);
  };

  // call the resampler worker or online minMax 
  // according to `this.param('useWorker')`
  proto$0.downSample = function() {
    var range = this.base.xScale.range();
    var width = range[1] - range[0];
    var extractAtTimes = [];

    // define all times where a minMax snapshot must be done
    for (var pixel = 0; pixel < width; pixel++) {
      var timelineTimeStart = this.base.xScale.invert(pixel);
      extractAtTimes.push(timelineTimeStart);
    }

    // define center of the y domain for default values
    var yDomain = this.yScale.domain(); // not this
    var defaultValue = (yDomain[0] + yDomain[1]) / 2;
    var sampleRate = this.sampleRate()();
    var windowSize = this.getSamplesPerPixel();

    if (this.param('useWorker')) {
      var message = {
        cmd: 'downSample',
        extractAtTimes: extractAtTimes,
        sampleRate: sampleRate,
        windowSize: windowSize,
        defaultValue: defaultValue
      };

      this.resampler.postMessage(message);
    } else {
      var data = this.data();
      var buffer = data instanceof ArrayBuffer ? new Float32Array(data) : data;

      var downSampledView = minMax(
        buffer, 
        extractAtTimes, 
        sampleRate, 
        windowSize, 
        defaultValue
      );

      this.setDownSample(downSampledView);
    }
  };

  // is called by the resampler worker when done
  // @NOTE is this method really needed
  proto$0.resamplerResponse = function(message) {
    var data = message.data;

    switch (data.cmd) {
      case 'downSample':
        this.setDownSample(data.downSampledView);
        break;
      default:
        throw new Error('Resampler unkown command: ' + data.msg);
        break;
    }
  };

  // cache the down sampling result and create some scale
  proto$0.setDownSample = function(data) {
    // update xxScale according to new base.xScale.domain and data.length
    this.xxScale
      .domain([0, data.length])
      .range(this.base.xScale.domain());
    // update cache
    this.cache(data);
    this.draw(data);
  };

  // zoom - needs to be tested again
  proto$0.xZoom = function(e) {
    // @TODO caching system must be improved:
    // - different trigger updates according to zoom in or out
    // - force update when only sliding without zooming
    var triggerUpdateZoomDelta = this.param('triggerUpdateZoomDelta');
    var triggerUpdateDragDelta = this.param('triggerUpdateDragDelta');
    var deltaZoom = Math.abs(this.currentZoomFactor - e.factor);
    var deltaDrag = Math.abs(this.currentDragDeltaX - e.delta.x);
    
    // if not small zoom delta or small drag delta
    // => render cached data
    if (
      (deltaZoom < triggerUpdateZoomDelta) && 
      (deltaDrag < triggerUpdateDragDelta)
    ) {
      return this.draw(this.cache()());
    }

    this.currentZoomFactor = e.factor;
    this.currentDragDeltaX = e.delta.x;

    this.downSample();
  };

  // display methods
  proto$0.update = function() {
    this._update();
  };

  proto$0.draw = function(data) {
    if (!data) { return this.downSample(); }
    this._draw(data);
  };

MIXIN$0(WaveformVis.prototype,proto$0);proto$0=void 0;return WaveformVis;})(LayerVis);

// data accessors
getSet(WaveformVis.prototype, ['color', 'sampleRate', 'duration', 'cache']);

module.exports = WaveformVis;
