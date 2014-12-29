var accessors = require('utils').accessors;
var uniqueId  = require('utils').uniqueId;
var LayerVis  = require('layer-vis');
var pck       = require('./package.json');
var fs        = require('fs');
var renderingStrategies = require('./lib/rendering-strategies');

var minMax         = require('./lib/resampler').minMax;
var createSnapshot = require('./lib/resampler').createSnapshot;

// for test purpose - must be removed
var _ = require('underscore');

'use strict';

// @NOTES / TODOS:
// - from: http://www.bbc.co.uk/rd/blog/2013/10/audio-waveforms
//   audacity creates a cached down sampled version of min / max values
//   with a window size of 256 samples
// > if samplesPerPIxels > 256 parse data from downsampled extract
// > else parse raw data
//   should improve perf when zoomed out
// DONE !!!!
//
//   use cached data in zoom in / define what to do on zoom out
//
// - webworker create a creepy flicking issue due to asynchrony
//   and is actually not usable - we must find a workaround for that problem
// > maybe define an incremental index for each call and ignore any
//   response that would have a smaller index
//
// - throttle
//    -> define where it must be implemented
//
// - how to integrate "native" d3 component with the rAF loop - DONE !
//
// - comment all worker stuff - unusable for now cause of async problem

var workerBlob = new Blob(
  [fs.readFileSync(__dirname + '/lib/resampler-worker.js', 'utf-8')],
  { type: 'text/javascript' }
);

class WaveformVis extends LayerVis {
  constructor() {
    if (!(this instanceof WaveformVis)) { return new WaveformVis; }

    super();

    var name = pck.name.replace('-vis', '');

    var defaults = {
      type: name,
      id: uniqueId(name),
      renderingStrategy: 'svg',
      yDomain: [-1, 1], // default yDomain for audioBuffer
      triggerUpdateZoomDelta: 0.05,
      triggerUpdateDragDelta: 2,
      useWorker: false
    };

    this.params(defaults);
    this.color('#000000');
    this.sampleRate(44100);
    // init zoom factor to 1
    this.currentZoomFactor = 1;
    this.currentDragDeltaX = 0;

    // debounce xZoom call
    // this.xZoom = _.throttle(this.xZoom, 50);
    // console.log(this.xZoom);
  }

  // get number of sample per timeline pixels - aka. windowSize
  // should not be dependant of timeline with,
  // should be able to create some kind of segment
  getSamplesPerPixel() {
    var timelineDomain = this.base.xScale.domain();
    var timelineDuration = timelineDomain[1] - timelineDomain[0];
    var timelineWidth = this.base.width();
    var sampleRate = this.sampleRate();

    return (timelineDuration * sampleRate()) / timelineWidth;
  }

  onload() {
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
  }

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
  downSample() {
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
    for (let pixel = 0; pixel < width; pixel++) {
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
    if (windowSize > (snapshotWindowSize * 4)) {
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
  }

  // is called by the resampler worker when done
  // @NOTE is this method really needed
  resamplerResponse(message) {
    var data = message.data;

    switch (data.cmd) {
      case 'downSample':
        this.setDownSample(data.downSampledView);
        break;
      default:
        throw new Error('Resampler unkown command: ' + data.msg);
        break;
    }
  }

  // cache the down sampling result and create some scale
  setDownSample(data) {
    // update xxScale according to new base.xScale.domain and data.length
    this.xxScale
      .domain([0, data.length])
      .range(this.base.xScale.domain());
    // update cache
    this.cache(data);
    this.draw(data);
  }

  // zoom - needs to be tested again
  xZoom(e) {
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
  }

  xZoomSet(e) {
    console.log('waveform xZoomSet');
  }

  // display methods
  update() {
    this._update();
  }

  draw(data) {
    if (!data) { return this.downSample(); }
    this._draw(data);
  }

}

// data accessors
// @NOTE if start / end, cound be dragged and so on
accessors.getFunction(WaveformVis.prototype, [
  'color', 'sampleRate', 'duration', 'cache', // 'start', 'end'
]);

module.exports = WaveformVis;
