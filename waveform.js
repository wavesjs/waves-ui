'use strict';

var Layer  = require('layer');
var accessors = (uniqueId = require('utils')).accessors, uniqueId = uniqueId.uniqueId;
var minMax = (createSnapshot = require('./lib/resampler')).minMax, createSnapshot = createSnapshot.createSnapshot;
var renderingStrategies = require('./lib/rendering-strategies');
// var fs        = require('fs'); // for workers

//   @NOTES/TODOS
//   use cached data in zoom in / define what to do on zoom out
//
// - webworker create a creepy flicking issue due to asynchrony
//   and is actually not usable - we must find a workaround for that problem
//   option removed for now

// var workerBlob = new Blob(
//   [fs.readFileSync(__dirname + '/lib/resampler-worker.js', 'utf-8')],
//   { type: 'text/javascript' }
// );

var Waveform = (function(super$0){var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(Waveform, super$0);var proto$0={};
  function Waveform() {
    if (!(this instanceof Waveform)) { return new Waveform; }

    super$0.call(this);

    var defaults = {
      type: 'waveform',
      id: uniqueId(name),
      renderingStrategy: 'svg',
      yDomain: [-1, 1], // default yDomain for audioBuffer
      triggerUpdateZoomDelta: 0.01,
      triggerUpdateDragDelta: 2,
      // useWorker: false
    };

    this.params(defaults);
    this.color('#000000');
    this.sampleRate(44100);
    // init zoom factor to 1
    this.currentZoomFactor = 1;
    this.currentDragDeltaX = 0;
  }if(super$0!==null)SP$0(Waveform,super$0);Waveform.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":Waveform,"configurable":true,"writable":true}});DP$0(Waveform,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  // get number of sample per timeline pixels - aka. windowSize
  // should not be dependant of timeline with,
  // should be able to create some kind of segment
  proto$0.getSamplesPerPixel = function() {
    var timelineDomain = this.base.xScale.domain();
    var timelineDuration = timelineDomain[1] - timelineDomain[0];
    var timelineWidth = this.base.width();
    var sampleRate = this.sampleRate();

    return (timelineDuration * sampleRate()) / timelineWidth;
  };

  proto$0.load = function(base, d3) {
    super$0.prototype.load.call(this, base, d3);

    var duration = this.duration();
    // bind rendering strategy
    var strategy = renderingStrategies[this.param('renderingStrategy')];
    this._update = strategy.update.bind(this);
    this._draw   = strategy.draw.bind(this);

    // create partial xxScale
    this.xxScale = this.d3.scale.linear()
      .range([0, duration()]);

    // init worker
    // if (this.param('useWorker')) { this.initWorker(); }
  };

  // initWorker() {
  //   this.resampler = new Worker(window.URL.createObjectURL(workerBlob));
  //   var onResponse = this.resamplerResponse.bind(this);
  //   this.resampler.addEventListener('message', onResponse, false);
  //   // an index to prevent drawing to "come back" in time
  //   // try to fix async problem but do anything actually
  //   // this.__currentWorkerCallTime = 0;

  //   var message = {
  //     cmd: 'initialize',
  //     buffer: this.data(),
  //     minMax: minMax.toString()
  //   };

  //   this.resampler.postMessage(message, [message.buffer]);
  // }

  // call the resampler worker or online minMax
  // according to `this.param('useWorker')`
  proto$0.downSample = function() {
    var data = this.data();
    var buffer = data instanceof ArrayBuffer ? new Float32Array(data) : data;

    var snapshotWindowSize = 256;
    if (!this.__snapshot256) {
      this.__snapshot256 = createSnapshot(buffer, snapshotWindowSize);
    }

    // width should be computed this way
    // what about having multiple sounds on the same track ?
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
    var downSampledAt;

    // if (this.param('useWorker')) {
    //   var message = {
    //     cmd: 'downSample',
    //     time: new Date().getTime(),
    //     extractAtTimes: extractAtTimes,
    //     sampleRate: sampleRate,
    //     windowSize: windowSize,
    //     defaultValue: defaultValue
    //   };

    //   this.resampler.postMessage(message);
    // } else {
      // var data = this.data();
      // var buffer = data instanceof ArrayBuffer ? new Float32Array(data) : data;
    if (windowSize > (snapshotWindowSize * 2)) {
      // use snapshot
      buffer = this.__snapshot256;
      downSampledAt = snapshotWindowSize;
    } else {
      buffer = buffer;
      downSampledAt = 1;
    }

      var downSampledView = minMax(
        buffer,
        extractAtTimes,
        sampleRate,
        windowSize,
        defaultValue,
        downSampledAt
      );

      this.setDownSample(downSampledView);
    // }
  };

  // is called by the resampler worker when done
  // @NOTE is this method really needed
  // resamplerResponse(message) {
  //   var data = message.data;

  //   switch (data.cmd) {
  //     case 'downSample':
  //       this.setDownSample(data.downSampledView);
  //       break;
  //     default:
  //       throw new Error('Resampler unkown command: ' + data.msg);
  //       break;
  //   }
  // }

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

  proto$0.xZoom = function(e) {
    // @TODO
    // - different trigger updates according to zoom in or out
    var triggerUpdateZoomDelta = this.param('triggerUpdateZoomDelta');
    var triggerUpdateDragDelta = this.param('triggerUpdateDragDelta');
    var deltaZoom = Math.abs(this.currentZoomFactor - e.factor);
    var deltaDrag = Math.abs(this.currentDragDeltaX - e.delta.x);

    // if small zoom or drag delta, render cached data
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

  proto$0.xZoomSet = function(e) {
    console.log('waveform xZoomSet');
  };

  // display methods
  proto$0.update = function() {
    this._update();
  };

  proto$0.draw = function(data) {
    if (!data) { return this.downSample(); }
    this._draw(data);
  };

MIXIN$0(Waveform.prototype,proto$0);proto$0=void 0;return Waveform;})(Layer);

// data accessors
// @NOTE `start` and `end` could allow drag
accessors.getFunction(Waveform.prototype, [
  'color', 'sampleRate', 'duration', 'cache'
]);

module.exports = Waveform;
